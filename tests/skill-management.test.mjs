import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { manageSkill } from '../packages/desktop-center/lib/skill-management.js';

test('Qoder Skill operations isolate editions and recover uninstalled files', async t => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-manage-'));
  t.after(() => fs.rm(home, { recursive: true, force: true }));
  const source = path.join(home, '.agents', 'skills', 'sample');
  await fs.mkdir(source, { recursive: true });
  await fs.writeFile(path.join(source, 'SKILL.md'), 'Example');
  const request = { home, name: 'sample', source, action: 'install' };
  const global = await manageSkill({ ...request, target: 'qoder-global' });
  const cn = await manageSkill({ ...request, target: 'qoder-cn' });
  await assert.rejects(manageSkill({ ...request, target: 'qoder-global' }), /already exists/);
  await assert.rejects(manageSkill({ ...request, target: 'qoder-cn', name: '../sample' }), /Invalid/);
  const removed = await manageSkill({ ...request, action: 'uninstall', target: 'qoder-global' });
  await assert.rejects(fs.stat(global.destination), { code: 'ENOENT' });
  for (const dir of [source, cn.destination, removed.backup]) {
    assert.equal(await fs.readFile(path.join(dir, 'SKILL.md'), 'utf8'), 'Example');
  }
  await fs.symlink(path.join(source, 'SKILL.md'), path.join(source, 'symlink'));
  await assert.rejects(manageSkill({ ...request, target: 'qoder-global' }), /non-regular/);
  await assert.rejects(fs.stat(global.destination), { code: 'ENOENT' });
});
