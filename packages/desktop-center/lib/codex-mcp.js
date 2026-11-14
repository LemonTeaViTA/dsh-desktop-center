import { constants } from 'node:fs';
import { open } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import TOML from '@iarna/toml';

const MAX_CONFIG_BYTES = 512 * 1024;

export function readCodexMcp(file = join(homedir(), '.codex', 'config.toml')) {
  return readMcpConfig(file, text => TOML.parse(text).mcp_servers, config => {
    if (config.enabled !== undefined && typeof config.enabled !== 'boolean') throw new Error('Invalid enabled flag');
    return config.enabled !== false;
  });
}

export function readQoderMcp(file) {
  return readMcpConfig(file, text => {
    const settings = JSON.parse(text);
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('Invalid settings');
    return settings.mcpServers;
  });
}

export async function readZCodeMcp(home) {
  const config = await readMcpConfig(join(home, '.zcode', 'cli', 'config.json'),
    text => JSON.parse(text).mcp?.servers, server => server.enable !== false);
  if (config.status === 'unreadable' || config.servers.length) return config;
  const fallback = await readQoderMcp(join(home, '.agents', 'mcp.json'));
  return fallback.status === 'missing' ? config : fallback;
}

async function readMcpConfig(file, selectServers, getEnabled) {
  const { status, entries } = await readConfig(file, text => {
      const configured = selectServers(text) ?? {};
      if (!configured || typeof configured !== 'object' || Array.isArray(configured)) {
        throw new Error('Invalid MCP configuration');
      }

      const servers = [];
      for (const [name, config] of Object.entries(configured)) {
        if (!config || typeof config !== 'object' || Array.isArray(config)) {
          throw new Error('Invalid MCP configuration');
        }
        servers.push(getEnabled ? { name, enabled: getEnabled(config) } : { name });
      }
      return servers.sort((a, b) => a.name.localeCompare(b.name));
  });
  return { status, servers: entries };
}

export function readCodexPlugins(file) {
  return readConfig(file, text => {
    const { plugins = {} } = TOML.parse(text);
    if (!plugins || typeof plugins !== 'object' || Array.isArray(plugins)) throw new Error('Invalid plugins');
    return Object.entries(plugins).map(([name, config]) => {
      if (typeof config?.enabled !== 'boolean') throw new Error('Invalid plugin enablement');
      return { name, enabled: config.enabled };
    }).sort((a, b) => a.name.localeCompare(b.name));
  });
}

export function readQoderPlugins(file) {
  return readConfig(file, text => {
    const { version, plugins } = JSON.parse(text);
    if (version !== 2 || !plugins || typeof plugins !== 'object' || Array.isArray(plugins)) {
      throw new Error('Unknown Qoder plugin registry format');
    }
    const entries = [];
    for (const [id, records] of Object.entries(plugins)) {
      if (!Array.isArray(records)) throw new Error('Invalid Qoder plugin records');
      for (const record of records) {
        if (record?.scope !== 'user' || record.userVisible === false) continue;
        const name = typeof record.displayName === 'string' && record.displayName.trim()
          ? record.displayName.trim() : id;
        const pluginVersion = typeof record.version === 'string' ? record.version : undefined;
        entries.push({ name, version: pluginVersion });
      }
    }
    return entries.sort((a, b) => a.name.localeCompare(b.name));
  });
}

async function readConfig(file, parse) {
  let handle;
  try {
    handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_CONFIG_BYTES) return { status: 'unreadable', entries: [] };

    const buffer = Buffer.alloc(MAX_CONFIG_BYTES + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await handle.read(buffer, length, buffer.length - length, null);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > MAX_CONFIG_BYTES) return { status: 'unreadable', entries: [] };

    return { status: 'read', entries: parse(buffer.toString('utf8', 0, length)) };
  } catch (error) {
    return { status: error?.code === 'ENOENT' ? 'missing' : 'unreadable', entries: [] };
  } finally {
    await handle?.close();
  }
}
