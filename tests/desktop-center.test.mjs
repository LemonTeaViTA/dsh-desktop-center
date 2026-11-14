import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createDesktopRegistry } from '../packages/desktop-center/lib/registry/service.js';
import { createSkillsHub } from '../packages/desktop-center/lib/skills/service.js';
import { createDesktopCenter, makeRoutes, ROUTES, VERSION, apply, inject } from '../packages/desktop-center/lib/index.js';

const moduleRoot = new URL('../packages/desktop-center/', import.meta.url);

test('single-install manifest declares Host Bundle and Web Client in the same package', async () => {
  const manifest = JSON.parse(await fs.readFile(new URL('./package.json', moduleRoot), 'utf8'));
  assert.equal(manifest.version, VERSION);
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml');
  assert.equal(manifest.dsh.client.platform, 'web');
  assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-sidebar'));
  assert.equal(manifest.exports['./client'], './lib/client.js');
  assert.match(manifest.engines.dsh, /0\.2\.1/);
  const patch = await fs.readFile(new URL('./cordis.patch.yml', moduleRoot), 'utf8');
  assert.match(patch, /name: dsh-desktop-center/);
});

test('host exposes independent services and the expected authenticated read-only GET routes', async () => {
  const services = new Map();
  const routes = new Map();
  const teardown = [];
  const ctx = {
    provide(name, service) { services.set(name, service); },
    connection: { fetch: { register(route) { routes.set(route.path, route); return () => routes.delete(route.path); } } },
    effect(action) { teardown.push(action()); },
  };
  assert.deepEqual(inject, ['connection']);
  apply(ctx);
  assert.equal(services.get('desktopRegistry').version, 1);
  assert.equal(services.get('skillsHub').version, 2);
  assert.equal(services.get('desktopCenter').version, 1);
  assert.deepEqual([...routes.keys()].sort(), Object.values(ROUTES).sort());
  assert.ok([...routes.values()].every(r => r.methods.join() === 'GET' && r.requestBody === 'buffered'));
  const health = await routes.get(ROUTES.health).fetch(new Request('https://example.com' + ROUTES.health));
  assert.equal(health.status, 200);
  assert.equal((await health.json()).data.version, VERSION);
  assert.equal(health.headers.get('cache-control'), 'no-store');
  const unsupported = await routes.get(ROUTES.overview).fetch(new Request('https://example.com' + ROUTES.overview, { method: 'POST' }));
  assert.equal(unsupported.status, 405);
  for (const dispose of teardown) await dispose();
  assert.equal(routes.size, 0);
});

test('overview reports real scan statistics but does not treat config dirs as running apps', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-center-'));
  try {
    const skill = path.join(home, '.qoder/skills', 'audit');
    await fs.mkdir(skill, { recursive: true });
    await fs.writeFile(path.join(skill, 'SKILL.md'), '---\nname: audit\n---\nRead only.\n');
    const registry = createDesktopRegistry({
      home, platform: 'darwin',
      filesystem: { stat(file) {
        if (file.startsWith('/Applications/')) {
          throw Object.assign(new Error('System applications are outside the test fixture'), { code: 'ENOENT' });
        }
        return fs.stat(file);
      } },
    });
    const center = createDesktopCenter({ registry, hub: createSkillsHub({ registry, scanOptions: { home } }),
      platform: 'darwin', readMcp: async () => ({ status: 'missing', servers: [] }),
    });
    const overview = await center.overview();
    assert.equal(overview.summary.desktopCount, 8);
    assert.equal(overview.summary.installedAppCount, 0);
    assert.ok(overview.summary.skillOccurrences >= 1);
    assert.equal(overview.desktops.find(d => d.id === 'qoder-global').status, 'configuration-found');
    assert.equal(overview.readOnly, true);
    const diff = await center.comparison();
    assert.ok(diff.matrix.some(x => x.name === 'audit'));
  } finally {
    await fs.rm(home, { recursive: true, force: true });
  }
});

test('route errors have no raw exception details or sensitive filesystem paths', async () => {
  const [route] = makeRoutes({ overview: async () => { throw new Error('secret=/Users/test/.ssh/private-key'); } });
  assert.equal(route.path, ROUTES.health); // health is first
  const overview = makeRoutes({ overview: async () => { throw new Error('secret=/Users/test/.ssh/private-key'); } })[1];
  const result = await overview.fetch(new Request('https://test.local' + ROUTES.overview));
  const body = JSON.stringify(await result.json());
  assert.equal(result.status, 500);
  assert.doesNotMatch(body, /private-key|\.ssh|secret=/);
});

test('client factory registers actual DSH main and sidebar panel using public slots', async () => {
  const clientSource = await fs.readFile(new URL('./lib/client.js', moduleRoot), 'utf8');
  let factory;
  vm.runInNewContext(clientSource, {
    window: { __ModuleLoader__: { load(value) { assert.equal(value.id, 'dsh-desktop-center'); factory = value.factory; } } },
  });
  assert.equal(typeof factory, 'function');
  const fakeReact = {
    createElement: (type, props, ...children) => ({ type, props, children }),
  };
  const plugin = factory(key => {
    if (key === 'react') return fakeReact;
    throw new Error('Unexpected module: ' + key);
  });
  assert.equal(typeof plugin.apply, 'function');
  assert.deepEqual(Array.from(plugin.inject), ['slots', 'layout']);
  const registrations = [];
  plugin.apply({ slots: {
    inject(name, callback) { callback(); },
    register(options, view) { registrations.push({ options, view }); return () => {}; },
  } });
  assert.deepEqual(registrations.map(r => r.options.name).sort(), ['main', 'sidebar.panellist']);
  assert.equal(registrations.find(r => r.options.name === 'main').options.key, 'dsh-desktop-center');
  assert.equal(registrations.find(r => r.options.name === 'sidebar.panellist').options.id, 'dsh-desktop-center');
});
