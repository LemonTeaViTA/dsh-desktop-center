import { constants } from 'node:fs';
import { open } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import TOML from '@iarna/toml';

const MAX_CONFIG_BYTES = 512 * 1024;

export async function readCodexMcp(file = join(homedir(), '.codex', 'config.toml')) {
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

    const { mcp_servers: configured = {} } = TOML.parse(buffer.toString('utf8', 0, length));
    if (!configured || typeof configured !== 'object' || Array.isArray(configured)) {
      return { status: 'unreadable', servers: [] };
    }

    const servers = [];
    for (const [name, config] of Object.entries(configured)) {
      if (!config || typeof config !== 'object' || Array.isArray(config) ||
          (config.enabled !== undefined && typeof config.enabled !== 'boolean')) {
        return { status: 'unreadable', servers: [] };
      }
      servers.push({ name, enabled: config.enabled !== false });
    }
    return { status: 'read', servers: servers.sort((a, b) => a.name.localeCompare(b.name)) };
  } catch (error) {
    return { status: error?.code === 'ENOENT' ? 'missing' : 'unreadable', servers: [] };
  } finally {
    await handle?.close();
  }
}
