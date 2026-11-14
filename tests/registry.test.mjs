import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDesktopRegistry } from '../packages/desktop-registry/src/service.js';
import { apply as registryApply } from '../packages/desktop-registry/index.js';

test('registry distinguishes app installation from config-only and unsupported OS', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-reg-'));
  try {
    await fs.mkdir(path.join(home, '.qoder/skills'), { recursive: true });
    const registry = createDesktopRegistry({ home, platform: 'darwin' });
    const desktops = await registry.listDesktops();
    assert.equal(desktops.length, 5);
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
