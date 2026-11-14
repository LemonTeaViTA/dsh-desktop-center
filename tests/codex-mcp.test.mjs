import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readCodexMcp } from '../packages/desktop-center/lib/codex-mcp.js';
import { createDesktopCenter } from '../packages/desktop-center/lib/index.js';

test('Codex MCP overview exposes only service names and configured enablement', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-mcp-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const file = join(dir, 'config.toml');
  await writeFile(file, `
[mcp_servers."example.server"]
url = "https://example.invalid"
[mcp_servers."example.server".env_http_headers]
Authorization = "fixture-secret"
[mcp_servers.stopped]
enabled = false
command = "fixture-command"
`);
  const desktops = ['codex-desktop', 'workbuddy'].map(id => ({
    id, appPaths: [], skills: [], diagnostics: [],
  }));
  const service = createDesktopCenter({
    hub: { inventory: async () => ({ desktops }) },
    platform: 'darwin',
    readMcp: () => readCodexMcp(file),
  });
  const result = await service.overview();
  assert.deepEqual(result.desktops[0].mcp, {
    status: 'read',
    servers: [{ name: 'example.server', enabled: true }, { name: 'stopped', enabled: false }],
  });
  assert.equal(result.desktops[1].mcp, undefined);
  assert.doesNotMatch(JSON.stringify(result), /fixture-secret|fixture-command|example\.invalid/);
  assert.deepEqual(await readCodexMcp(join(dir, 'absent.toml')), { status: 'missing', servers: [] });
  await writeFile(file, '[mcp_servers.broken');
  assert.deepEqual(await readCodexMcp(file), { status: 'unreadable', servers: [] });
});

test('Qoder editions read their own user settings and return service names only', async t => {
  const home = await mkdtemp(join(tmpdir(), 'dsh-mcp-'));
  t.after(() => rm(home, { recursive: true, force: true }));
  const { mkdir } = await import('node:fs/promises');
  for (const [path, name] of [['.qoder', 'global'], ['.qoder-cn', 'cn']]) {
    await mkdir(join(home, path));
    await writeFile(join(home, path, 'settings.json'), JSON.stringify({
      mcpServers: { [name]: { url: 'https://example.invalid', env: { TOKEN: 'fixture-secret' } } },
    }));
  }
  const desktops = ['qoder-global', 'qoder-cn'].map(id => ({ id, skills: [], appPaths: [], diagnostics: [] }));
  const center = createDesktopCenter({ home, platform: 'darwin', hub: { inventory: async () => ({ desktops }) } });
  const overview = await center.overview();
  assert.deepEqual(overview.desktops.map(({ mcp }) => mcp), [
    { status: 'read', servers: [{ name: 'global' }] },
    { status: 'read', servers: [{ name: 'cn' }] },
  ]);
});
