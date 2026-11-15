import fs from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

export const qoderProfiles = new Map([
  ['qoder-global', '.qoder'],
  ['qoder-cn', '.qoder-cn'],
]);

const MAX_BYTES = 512 * 1024;
const MAX_ENTRY_BYTES = 32 * 1024;
const isObject = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const fail = (code) => Object.assign(new Error(code), { code });

export function isMcpManagementRequest({ action, target, name, config }) {
  if (
    !qoderProfiles.has(target) ||
    typeof name !== 'string' ||
    !name.trim() ||
    name.length > 128 ||
    Array.from(name).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) ||
    ['__proto__', 'prototype', 'constructor'].includes(name)
  )
    return false;
  if (action === 'remove') return true;
  if (
    action !== 'add' ||
    !isObject(config) ||
    Buffer.byteLength(JSON.stringify(config)) > MAX_ENTRY_BYTES
  )
    return false;

  const type = config.type ?? (config.command ? 'stdio' : 'streamable-http');
  if (type === 'stdio') {
    return (
      typeof config.command === 'string' &&
      Boolean(config.command.trim()) &&
      config.url === undefined &&
      (config.args === undefined ||
        (Array.isArray(config.args) && config.args.every((value) => typeof value === 'string')))
    );
  }
  if (
    !['http', 'streamable-http', 'sse'].includes(type) ||
    typeof config.url !== 'string' ||
    config.command !== undefined
  )
    return false;
  try {
    const url = new URL(config.url);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}

async function readSettings(file) {
  let handle;
  try {
    handle = await fs.open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const revision = await handle.stat({ bigint: true });
    if (!revision.isFile() || revision.nlink !== 1n || revision.size > BigInt(MAX_BYTES))
      throw fail('INVALID_SETTINGS');
    const buffer = Buffer.alloc(MAX_BYTES + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await handle.read(buffer, length, buffer.length - length, null);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > MAX_BYTES) throw fail('INVALID_SETTINGS');
    let settings;
    try {
      settings = JSON.parse(
        new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, length)),
      );
    } catch {
      throw fail('INVALID_SETTINGS');
    }
    if (
      !isObject(settings) ||
      (Object.hasOwn(settings, 'mcpServers') && !isObject(settings.mcpServers))
    ) {
      throw fail('INVALID_SETTINGS');
    }
    return { settings, revision };
  } catch (error) {
    if (error.code === 'ENOENT') return { settings: {} };
    throw error;
  } finally {
    await handle?.close();
  }
}

export async function manageQoderMcp({ action, target, name, config, home }) {
  if (!isMcpManagementRequest({ action, target, name, config })) throw fail('INVALID_REQUEST');
  const profile = path.join(await fs.realpath(home), qoderProfiles.get(target));
  const profileStat = await fs.lstat(profile);
  if (!profileStat.isDirectory()) throw fail('INVALID_SETTINGS');

  const lock = path.join(profile, '.desktop-center-mcp.lock');
  await fs.mkdir(lock, { mode: 0o700 });
  try {
    const file = path.join(profile, 'settings.json');
    const { settings, revision } = await readSettings(file);
    const servers = settings.mcpServers ?? {};
    if (action === 'add') {
      if (Object.hasOwn(servers, name)) throw fail('MCP_EXISTS');
      servers[name] = config;
    } else {
      if (!Object.hasOwn(servers, name)) throw fail('ENOENT');
      delete servers[name];
    }
    settings.mcpServers = servers;

    const source = JSON.stringify(settings, null, 2) + '\n';
    if (Buffer.byteLength(source) > MAX_BYTES) throw fail('INVALID_SETTINGS');
    const staged = path.join(lock, 'settings.json');
    const mode = revision ? Number(revision.mode & 0o777n) : 0o600;
    await fs.writeFile(staged, source, { mode: 0o600, flag: 'wx' });
    await fs.chmod(staged, mode);

    if (revision) {
      const current = await fs.lstat(file, { bigint: true });
      if (
        ['dev', 'ino', 'ctimeNs', 'mtimeNs', 'size'].some((key) => current[key] !== revision[key])
      ) {
        throw fail('SETTINGS_CHANGED');
      }
      await fs.rename(staged, file);
    } else {
      await fs.link(staged, file);
    }
    return { name };
  } finally {
    await fs.rm(lock, { recursive: true, force: true });
  }
}
