import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = async relative => fs.readFile(path.join(root, relative), 'utf8');

test('published product name, Cordis IDs, UI IDs and routes use Desktop Center naming consistently', async () => {
  const manifest = JSON.parse(await read('packages/desktop-center/package.json'));
  const workspace = JSON.parse(await read('package.json'));
  assert.equal(manifest.name, 'dsh-desktop-center');
  assert.equal(workspace.name, 'dsh-desktop-center-workspace');
  assert.equal(manifest.version, '0.3.0-rc.14');
  assert.equal(workspace.version, manifest.version);
  assert.match(await read('packages/desktop-center/cordis.patch.yml'), /id: dsh-desktop-center\s+name: dsh-desktop-center/);
  const host = await read('packages/desktop-center/lib/index.js');
  const client = await read('packages/desktop-center/lib/client.js');
  assert.match(host, /\/api\/dsh-desktop-center\/overview/);
  assert.match(client, /id: 'dsh-desktop-center'/);
  assert.ok(client.includes("const CLIENT_VERSION = '" + manifest.version + "';"));
  assert.match(client, /PAGE_ID = 'dsh-desktop-center'/);
  for (const content of [manifest.name, host, client]) assert.doesNotMatch(content, /dsh-superagent|superagent-desktop-center/i);
});

test('this project exposes only the implemented read-only Desktop and Skills contracts', async () => {
  const contract = await read('contracts/index.d.ts');
  assert.match(contract, /DesktopCenterServiceV1/);
  for (const other of ['CheckinProvider', 'CreditsProvider', 'DesktopBridge']) assert.doesNotMatch(contract, new RegExp(other));
  assert.match(await read('README.md'), /^# DSH Desktop Center\n/);
});
