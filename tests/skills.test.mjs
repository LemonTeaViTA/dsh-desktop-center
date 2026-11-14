import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { scanRoots, buildSkillMatrix, parseFrontmatter } from '../packages/skills-hub/src/scan.js';
import { createDesktopRegistry } from '../packages/desktop-registry/src/service.js';
import { createSkillsHub } from '../packages/skills-hub/src/service.js';
import { apply as skillsApply, inject } from '../packages/skills-hub/index.js';

async function makeSkill(root, name, description) {
  const folder = path.join(root, name);
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(path.join(folder, 'SKILL.md'), `---\nname: ${name}\ndescription: ${description}\n---\n\nDo work.\n`);
}

test('skills hub scans Skill packages, diffs content and reports unsupported WorkBuddy path', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-sk-'));
  try {
    await makeSkill(path.join(home, '.qoder/skills'), 'frontend-design', 'Design one');
    await makeSkill(path.join(home, '.qoder-cn/skills'), 'frontend-design', 'Design two');
    await makeSkill(path.join(home, '.agents/skills'), 'shared-review', 'Review');
    const registry = createDesktopRegistry({ home, platform: 'darwin' });
    const hub = createSkillsHub({ registry, scanOptions: { home } });
    const inventory = await hub.inventory();
    assert.equal(inventory.desktops.find((x) => x.id === 'workbuddy').skills.length, 0);
    assert.equal(inventory.desktops.find((x) => x.id === 'qoder-global').skills.length, 2);
    const result = await hub.compare();
    const frontend = result.matrix.find((x) => x.name === 'frontend-design');
    assert.equal(frontend.status, 'different');
    assert.equal(frontend.byDesktopStatus['qoder-global'], 'different');
    assert.equal(frontend.byDesktopStatus['qoder-cn'], 'different');
    assert.equal(frontend.byDesktopStatus['workbuddy'], 'missing');
    const shared = result.matrix.find((x) => x.name === 'shared-review');
    assert.equal(shared.byDesktopStatus['codex-desktop'], 'same');
  } finally { await fs.rm(home, { recursive: true, force: true }); }
});

test('external symlinks are skipped rather than reading arbitrary files', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-safe-'));
  const external = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-ext-'));
  try {
    await makeSkill(external, 'unsafe', 'Secret should never be read');
    const root = path.join(home, '.qoder/skills');
    await fs.mkdir(root, { recursive: true });
    await fs.symlink(path.join(external, 'unsafe'), path.join(root, 'unsafe'));
    const scanned = await scanRoots([{ path: root, exists: true, scope: 'user' }], { home });
    assert.equal(scanned.skills.length, 0);
    assert.equal(scanned.diagnostics[0].reason, 'OUTSIDE_HOME_SYMLINK');
  } finally {
    await fs.rm(home, { recursive: true, force: true });
    await fs.rm(external, { recursive: true, force: true });
  }
});

test('malformed metadata falls back to folder name', async () => {
  assert.deepEqual(parseFrontmatter('not yaml'), {});
  assert.deepEqual(parseFrontmatter('---\nname: test\n---\nhello'), { name: 'test' });
});

test('Skills Hub declares the registry dependency and publishes its service', () => {
  assert.deepEqual(inject, ['desktopRegistry']);
  const ctx = { desktopRegistry: { listDesktops: async () => [] }, provide(name, svc) { this[name] = svc; } };
  skillsApply(ctx);
  assert.equal(ctx.skillsHub.version, 2);
});

test('package fingerprint includes reference and script changes even if SKILL.md stays identical', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-full-package-'));
  try {
    const a = path.join(home, '.qoder/skills');
    const b = path.join(home, '.qoder-cn/skills');
    await makeSkill(a, 'review', 'Check things');
    await makeSkill(b, 'review', 'Check things');
    for (const root of [a, b]) {
      await fs.mkdir(path.join(root, 'review', 'references'), { recursive: true });
      await fs.mkdir(path.join(root, 'review', 'scripts'), { recursive: true });
      await fs.writeFile(path.join(root, 'review', 'references', 'guide.md'), 'Original guide\n');
      await fs.writeFile(path.join(root, 'review', 'scripts', 'inspect.js'), 'export const n = 1;\n');
    }
    const first = await scanRoots([
      { path: a, scope: 'user', exists: true },
      { path: b, scope: 'user', exists: true },
    ], { home });
    assert.equal(first.skills[0].fileCount, 3);
    assert.equal(first.skills[0].packageSha256, first.skills[1].packageSha256);
    await fs.writeFile(path.join(b, 'review', 'references', 'guide.md'), 'Changed guide\n');
    const second = await scanRoots([
      { path: a, scope: 'user', exists: true },
      { path: b, scope: 'user', exists: true },
    ], { home });
    assert.equal(second.skills[0].sha256, second.skills[1].sha256);
    assert.notEqual(second.skills[0].packageSha256, second.skills[1].packageSha256);
    const matrix = buildSkillMatrix({ desktops: [
      { id: 'qoder-global', skills: [second.skills[0]] },
      { id: 'qoder-cn', skills: [second.skills[1]] },
    ] });
    assert.equal(matrix[0].status, 'different');
  } finally {
    await fs.rm(home, { recursive: true, force: true });
  }
});

test('hidden files and nested symlinks produce unknown fingerprints, not false agreement', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-incomplete-'));
  try {
    const root = path.join(home, '.qoder/skills');
    await makeSkill(root, 'review', 'Test');
    await fs.writeFile(path.join(root, 'review', '.hidden'), 'not inspected');
    await fs.symlink(path.join(home, '.ssh', 'id_rsa'), path.join(root, 'review', 'key-link'));
    const { skills, diagnostics } = await scanRoots([{ path: root, exists: true, scope: 'user' }], { home });
    assert.equal(skills.length, 1);
    assert.equal(skills[0].fingerprintStatus, 'incomplete');
    assert.equal(skills[0].packageSha256, null);
    assert.ok(diagnostics.some((item) => item.reason === 'HIDDEN_CONTENT_UNVERIFIED'));
    assert.ok(diagnostics.some((item) => item.reason === 'NESTED_SYMLINK_UNVERIFIED'));
    const matrix = buildSkillMatrix({ desktops: [
      { id: 'qoder-global', skills },
      { id: 'codex-desktop', skills: [] },
    ] });
    assert.equal(matrix[0].status, 'unknown');
    assert.equal(matrix[0].byDesktopStatus['qoder-global'], 'unknown');
    assert.equal(matrix[0].byDesktopStatus['codex-desktop'], 'missing');
  } finally {
    await fs.rm(home, { recursive: true, force: true });
  }
});

test('a manifest symlink pointing elsewhere within home is rejected', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-manifest-'));
  try {
    const root = path.join(home, '.qoder/skills');
    await fs.mkdir(path.join(root, 'bad'), { recursive: true });
    await fs.mkdir(path.join(home, 'documents'), { recursive: true });
    const privateFile = path.join(home, 'documents', 'SKILL.md');
    await fs.writeFile(privateFile, 'not a skill');
    await fs.symlink(privateFile, path.join(root, 'bad', 'SKILL.md'));
    const result = await scanRoots([{ path: root, exists: true, scope: 'user' }], { home });
    assert.deepEqual(result.skills, []);
    assert.equal(result.diagnostics[0].reason, 'MANIFEST_OUTSIDE_SKILL');
  } finally {
    await fs.rm(home, { recursive: true, force: true });
  }
});

test('oversized supplementary files create incomplete package status without exposing content', async () => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-too-large-'));
  try {
    const root = path.join(home, '.qoder/skills');
    await makeSkill(root, 'review', 'Test');
    await fs.writeFile(path.join(root, 'review', 'large.bin'), Buffer.alloc(2 * 1024 * 1024 + 1, 1));
    const { skills, diagnostics } = await scanRoots([{ path: root, exists: true, scope: 'user' }], { home });
    assert.equal(skills[0].packageSha256, null);
    assert.equal(skills[0].fingerprintStatus, 'incomplete');
    assert.ok(diagnostics.some((item) => item.reason === 'PACKAGE_LIMIT_EXCEEDED'));
  } finally {
    await fs.rm(home, { recursive: true, force: true });
  }
});

test('Skill introductions read folded and literal blocks but exclude other fields and the body', () => {
  for (const marker of ['>', '>-', '|', '|+']) {
    const text = ['---', 'description: ' + marker, '  Browse diagrams', '  and export them.', 'name: diagram', '---', 'Body'].join('\r\n');
    assert.deepEqual(parseFrontmatter(text), { name: 'diagram', description: 'Browse diagrams and export them.' });
  }
});
