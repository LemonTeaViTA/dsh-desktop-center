import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createDesktopCenter, makeRoutes, ROUTES } from '../packages/desktop-center/lib/index.js';

test('Qoder MCP management preserves unrelated settings and isolates both editions', async (t) => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsc-mcp-manage-'));
  t.after(() => fs.rm(home, { recursive: true, force: true }));
  const global = path.join(home, '.qoder', 'settings.json');
  const cn = path.join(home, '.qoder-cn', 'settings.json');
  await fs.mkdir(path.dirname(global));
  await fs.mkdir(path.dirname(cn));
  const original = {
    theme: 'light',
    mcpServers: { existing: { command: 'fixture', env: { TOKEN: 'fixture-secret' } } },
  };
  await fs.writeFile(global, JSON.stringify(original), { mode: 0o640 });
  const gateway = makeRoutes(createDesktopCenter({ home, platform: 'darwin' })).find(
    (route) => route.path === ROUTES.mcp,
  );
  const send = async (body, extra = {}) =>
    gateway.fetch(
      new Request('http://localhost' + gateway.path, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...extra },
        body: JSON.stringify(body),
      }),
    );
  const entry = { type: 'streamable-http', url: 'https://example.invalid/mcp' };
  const add = { action: 'add', target: 'qoder-global', name: 'sample', config: entry };
  assert.equal((await send(add, { 'sec-fetch-site': 'cross-site' })).status, 403);
  assert.equal((await send({ ...add, name: '__proto__' })).status, 400);
  assert.equal((await send({ ...add, target: 'codex-desktop' })).status, 400);
  assert.equal((await send({ ...add, config: { url: 'file:///tmp/fixture' } })).status, 400);
  assert.deepEqual(JSON.parse(await fs.readFile(global, 'utf8')), original);

  const [a, b] = await Promise.all([send(add), send(add)]);
  assert.deepEqual([a.status, b.status].sort(), [200, 409]);
  const success = a.ok ? a : b;
  assert.deepEqual(await success.json(), { ok: true, data: { name: 'sample' } });
  assert.deepEqual(JSON.parse(await fs.readFile(global, 'utf8')), {
    ...original,
    mcpServers: { ...original.mcpServers, sample: entry },
  });
  assert.equal((await fs.stat(global)).mode & 0o777, 0o640);

  assert.equal((await send({ ...add, target: 'qoder-cn' })).status, 200);
  assert.equal((await fs.stat(cn)).mode & 0o777, 0o600);
  assert.equal(
    (await send({ action: 'remove', target: 'qoder-global', name: 'sample' })).status,
    200,
  );
  assert.deepEqual(JSON.parse(await fs.readFile(global, 'utf8')), original);
  assert.deepEqual(JSON.parse(await fs.readFile(cn, 'utf8')), { mcpServers: { sample: entry } });

  await fs.writeFile(cn, '{broken');
  const failure = await send({ ...add, target: 'qoder-cn' });
  assert.equal(failure.status, 422);
  assert.deepEqual(await failure.json(), { ok: false, error: 'INVALID_SETTINGS' });
  assert.equal(await fs.readFile(cn, 'utf8'), '{broken');
  await fs.unlink(cn);
  await fs.symlink(global, cn);
  assert.equal((await send({ ...add, target: 'qoder-cn' })).status, 422);
  assert.deepEqual(JSON.parse(await fs.readFile(global, 'utf8')), original);
});
