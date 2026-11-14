import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDesktopRegistry } from '../packages/desktop-registry/src/service.js';
import { apply as registryApply } from '../packages/desktop-registry/index.js';

const fixtureFilesystem = {
  stat(file) {
    if (file.startsWith('/Applications/')) {
      throw Object.assign(new Error('System applications are outside the test fixture'), { code: 'ENOENT' });
    }
    return fs.stat(file);
  },
};

test('registry distinguishes app installation from config-only and unsupported OS', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-reg-'));
  try {
    await fs.mkdir(path.join(home, '.qoder/skills'), { recursive: true });
    const registry = createDesktopRegistry({
      home, platform: 'darwin',
      filesystem: fixtureFilesystem,
    });
    const desktops = await registry.listDesktops();
    assert.equal(desktops.length, 7);
    for (const id of ['zcode', 'doubao']) {
      const desktop = desktops.find(item => item.id === id);
      assert.equal(desktop.status, 'not-detected');
      assert.equal(desktop.skillRoots.length, id === 'zcode' ? 1 : 0);
    }
    assert.equal(desktops.find((x) => x.id === 'qoder-global').status, 'configuration-found');
    assert.equal(desktops.find((x) => x.id === 'workbuddy').status, 'not-detected');
    assert.equal(desktops.find((x) => x.id === 'workbuddy').skillRoots.length, 0);
    assert.equal((await createDesktopRegistry({ home, platform: 'linux' }).listDesktops())[0].status, 'unsupported-os');
  } finally { await fs.rm(home, { recursive: true, force: true }); }
});

test('registry publishes versioned service through Cordis ctx', () => {
  const provided = [];
  registryApply({ provide: (name, instance) => provided.push([name, instance]) });
  assert.equal(provided[0][0], 'desktopRegistry');
  assert.equal(provided[0][1].version, 1);
});

test('registry collapses application aliases and keeps independent installations', async (t) => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-reg-'));
  t.after(() => fs.rm(home, { recursive: true, force: true }));
  const app = path.join(home, 'Applications', 'Trae.app');
  const alias = path.join(home, 'Trae alias.app');
  const secondApp = path.join(home, 'Trae copy.app');
  await fs.mkdir(app, { recursive: true });
  await fs.symlink(app, alias);
  await fs.mkdir(secondApp);
  const registry = createDesktopRegistry({
    home, platform: 'darwin',
    filesystem: fixtureFilesystem,
    appPathsOverrides: { trae: [alias, secondApp] },
  });
  const trae = (await registry.listDesktops()).find(item => item.id === 'trae');
  assert.deepEqual(trae.appPaths, [app, secondApp]);
});

test('registry recognizes ChatGPT.app only with the Codex bundle ID', { skip: process.platform !== 'darwin' }, async (t) => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-reg-'));
  t.after(() => fs.rm(home, { recursive: true, force: true }));
  const app = path.join(home, 'Applications', 'ChatGPT.app');
  const plist = path.join(app, 'Contents', 'Info.plist');
  await fs.mkdir(path.dirname(plist), { recursive: true });
  const registry = createDesktopRegistry({
    home, platform: 'darwin',
    filesystem: fixtureFilesystem,
  });
  for (const bundleId of ['com.openai.codex', 'com.example.other']) {
    await fs.writeFile(plist, `<?xml version="1.0" encoding="UTF-8"?><plist version="1.0"><dict><key>CFBundleIdentifier</key><string>${bundleId}</string></dict></plist>`);
    const codex = (await registry.listDesktops()).find(item => item.id === 'codex-desktop');
    assert.deepEqual(codex.appPaths, bundleId === 'com.openai.codex' ? [app] : []);
  }
});
