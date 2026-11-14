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

async function readMcpConfig(file, selectServers, getEnabled) {
  let handle;
  try {
    handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_CONFIG_BYTES) return { status: 'unreadable', servers: [] };

    const buffer = Buffer.alloc(MAX_CONFIG_BYTES + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await handle.read(buffer, length, buffer.length - length, null);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > MAX_CONFIG_BYTES) return { status: 'unreadable', servers: [] };

    const configured = selectServers(buffer.toString('utf8', 0, length)) ?? {};
    if (!configured || typeof configured !== 'object' || Array.isArray(configured)) {
      return { status: 'unreadable', servers: [] };
    }

    const servers = [];
    for (const [name, config] of Object.entries(configured)) {
      if (!config || typeof config !== 'object' || Array.isArray(config)) {
        return { status: 'unreadable', servers: [] };
      }
      servers.push(getEnabled ? { name, enabled: getEnabled(config) } : { name });
    }
    return { status: 'read', servers: servers.sort((a, b) => a.name.localeCompare(b.name)) };
  } catch (error) {
    return { status: error?.code === 'ENOENT' ? 'missing' : 'unreadable', servers: [] };
  } finally {
    await handle?.close();
  }
}
