import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readCodexMcp, readZCodeMcp } from '../packages/desktop-center/lib/codex-mcp.js';
import { createDesktopCenter } from '../packages/desktop-center/lib/index.js';

test('Codex MCP overview exposes only service names and configured enablement', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-mcp-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const file = join(dir, 'config.toml');
  await writeFile(
    file,
    `
[mcp_servers."example.server"]
url = "https://example.invalid"
[mcp_servers."example.server".env_http_headers]
Authorization = "fixture-secret"
[mcp_servers.stopped]
enabled = false
command = "fixture-command"
`,
  );
  const desktops = ['codex-desktop', 'workbuddy'].map((id) => ({
    id,
    appPaths: [],
    skills: [],
    diagnostics: [],
  }));
  const service = createDesktopCenter({
    hub: { inventory: async () => ({ desktops }) },
    platform: 'darwin',
    readMcp: () => readCodexMcp(file),
    home: dir,
  });
  const result = await service.overview();
  assert.deepEqual(result.desktops[0].mcp, {
    status: 'read',
    servers: [
      { name: 'example.server', enabled: true },
      { name: 'stopped', enabled: false },
    ],
  });
  assert.deepEqual(result.desktops[1].mcp, { status: 'missing', servers: [] });
  assert.doesNotMatch(JSON.stringify(result), /fixture-secret|fixture-command|example\.invalid/);
  assert.deepEqual(await readCodexMcp(join(dir, 'absent.toml')), {
    status: 'missing',
    servers: [],
  });
  await writeFile(file, '[mcp_servers.broken');
  assert.deepEqual(await readCodexMcp(file), { status: 'unreadable', servers: [] });
});

test('Qoder editions read their own user settings and return service names only', async (t) => {
  const home = await mkdtemp(join(tmpdir(), 'dsh-mcp-'));
  t.after(() => rm(home, { recursive: true, force: true }));
  for (const [path, name] of [
    ['.qoder', 'global'],
    ['.qoder-cn', 'cn'],
  ]) {
    await mkdir(join(home, path, 'plugins'), { recursive: true });
    await writeFile(
      join(home, path, 'plugins', 'installed_plugins_v2.json'),
      JSON.stringify({
        version: 2,
        plugins: {
          [name]: [
            { scope: 'user', displayName: name, version: '1.2.3', installPath: '/private/fixture' },
          ],
          ignored: [{ scope: 'project' }, { scope: 'user', userVisible: false }],
        },
      }),
    );
    await writeFile(
      join(home, path, 'settings.json'),
      JSON.stringify({
        mcpServers: {
          [name]: { url: 'https://example.invalid', env: { TOKEN: 'fixture-secret' } },
        },
      }),
    );
  }
  const desktops = ['qoder-global', 'qoder-cn'].map((id) => ({
    id,
    skills: [],
    appPaths: [],
    diagnostics: [],
  }));
  const center = createDesktopCenter({
    home,
    platform: 'darwin',
    hub: { inventory: async () => ({ desktops }) },
  });
  const overview = await center.overview();
  assert.deepEqual(
    overview.desktops.map(({ plugins }) => plugins),
    [
      { status: 'read', entries: [{ name: 'global', version: '1.2.3' }] },
      { status: 'read', entries: [{ name: 'cn', version: '1.2.3' }] },
    ],
  );
  assert.deepEqual(
    overview.desktops.map(({ mcp }) => mcp),
    [
      { status: 'read', servers: [{ name: 'global' }] },
      { status: 'read', servers: [{ name: 'cn' }] },
    ],
  );
});

test('ZCode uses shared MCP only when native settings contain no servers', async (t) => {
  const home = await mkdtemp(join(tmpdir(), 'dsh-zcode-'));
  t.after(() => rm(home, { recursive: true, force: true }));
  await mkdir(join(home, '.agents'));
  await mkdir(join(home, '.zcode', 'cli'), { recursive: true });
  const native = join(home, '.zcode', 'cli', 'config.json');
  await writeFile(
    join(home, '.agents', 'mcp.json'),
    '{"mcpServers":{"shared":{"url":"https://example.invalid"}}}',
  );
  assert.deepEqual(await readZCodeMcp(home), { status: 'read', servers: [{ name: 'shared' }] });
  await writeFile(native, '{"mcp":{"servers":{"native":{"enable":false,"command":"fixture"}}}}');
  assert.deepEqual(await readZCodeMcp(home), {
    status: 'read',
    servers: [{ name: 'native', enabled: false }],
  });
  await writeFile(native, '{');
  assert.deepEqual(await readZCodeMcp(home), { status: 'unreadable', servers: [] });
});

test('ZCode overview reads user plugin records and reports missing and damaged registries separately', async (t) => {
  const home = await mkdtemp(join(tmpdir(), 'dsh-zcode-'));
  t.after(() => rm(home, { recursive: true, force: true }));
  const directory = join(home, '.zcode', 'cli', 'plugins');
  await mkdir(join(directory, 'cache'), { recursive: true });
  const registry = join(directory, 'installed_plugins.json');
  const desktops = ['zcode', 'doubao'].map((id) => ({
    id,
    skills: [],
    appPaths: [],
    skillRoots: [],
    diagnostics: [],
  }));
  desktops[0].skillRoots.push({ path: '/private/fixture', exists: false, error: 'EACCES' });
  const center = createDesktopCenter({
    home,
    platform: 'darwin',
    hub: { inventory: async () => ({ desktops }) },
  });
  const scan = () => center.overview();

  const missing = await scan();
  assert.deepEqual(missing.desktops[0].plugins, { status: 'missing', entries: [] });
  assert.equal(missing.desktops[1].plugins, undefined);
  assert.equal(missing.summary.diagnosticCount, 1);
  await writeFile(registry, JSON.stringify({ version: 1, plugins: [] }));
  assert.deepEqual((await scan()).desktops[0].plugins, { status: 'read', entries: [] });

  const record = {
    id: 'sample@market',
    name: 'sample',
    marketplace: 'market',
    version: '1.2.3',
    installPath: '/private/fixture-secret',
    installedAt: '2026-11-15T00:00:00Z',
    scope: 'user',
  };
  const expected = { status: 'read', entries: [{ name: 'sample', version: '1.2.3' }] };
  await writeFile(
    registry,
    JSON.stringify({ version: 1, plugins: [record, { ...record, scope: 'workspace' }] }),
  );
  const current = await scan();
  assert.deepEqual(current.desktops[0].plugins, expected);
  assert.doesNotMatch(JSON.stringify(current), /fixture-secret/);
  await writeFile(
    registry,
    JSON.stringify({
      version: 1,
      plugins: {
        'sample@market': [
          { ...record, scope: 'user' },
          { ...record, scope: 'project' },
        ],
      },
    }),
  );
  assert.deepEqual((await scan()).desktops[0].plugins, expected);

  await writeFile(registry, JSON.stringify({ version: 2, plugins: [] }));
  const damaged = await scan();
  assert.deepEqual(damaged.desktops[0].plugins, { status: 'unreadable', entries: [] });
  assert.equal(damaged.summary.diagnosticCount, 2);
});

test('TRAE reads each edition user MCP and extension registry independently', async (t) => {
  const home = await mkdtemp(join(tmpdir(), 'dsh-trae-'));
  t.after(() => rm(home, { recursive: true, force: true }));
  for (const [edition, dotDir, name] of [
    ['Trae', '.trae', 'global'],
    ['Trae CN', '.trae-cn', 'cn'],
  ]) {
    const user = join(home, 'Library', 'Application Support', edition, 'User');
    const extensions = join(home, dotDir, 'extensions');
    await mkdir(user, { recursive: true });
    await mkdir(extensions, { recursive: true });
    await writeFile(
      join(user, 'mcp.json'),
      JSON.stringify({ mcpServers: { [name]: { command: 'fixture-secret' } } }),
    );
    await writeFile(
      join(extensions, 'extensions.json'),
      JSON.stringify([
        { identifier: { id: 'fixture.' + name }, version: '1.2.3', location: 'fixture-secret' },
      ]),
    );
  }
  const desktops = ['trae', 'trae-cn'].map((id) => ({
    id,
    skills: [],
    appPaths: [],
    diagnostics: [],
  }));
  const center = createDesktopCenter({
    home,
    platform: 'darwin',
    hub: { inventory: async () => ({ desktops }) },
  });
  const { desktops: result } = await center.overview();
  assert.deepEqual(
    result.map((d) => d.mcp.servers),
    [[{ name: 'global' }], [{ name: 'cn' }]],
  );
  assert.deepEqual(
    result.map((d) => d.plugins.entries),
    [[{ name: 'fixture.global', version: '1.2.3' }], [{ name: 'fixture.cn', version: '1.2.3' }]],
  );
  assert.doesNotMatch(JSON.stringify(result), /fixture-secret/);
});
