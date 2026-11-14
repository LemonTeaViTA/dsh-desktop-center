import { mkdir, copyFile, readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, join } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const pkg = join(root, 'packages/desktop-center');
const release = join(root, 'releases');
await mkdir(release, { recursive: true });
// Canonical scanning algorithms remain in the two original independent modules.
// Copy them into the zero-dependency bundle to keep the installation self-contained.
for (const [from, to] of [
  ['desktop-registry/src/catalog.js', 'registry/catalog.js'],
  ['desktop-registry/src/service.js', 'registry/service.js'],
  ['skills-hub/src/scan.js', 'skills/scan.js'],
  ['skills-hub/src/service.js', 'skills/service.js'],
]) {
  const source = join(root, 'packages', from);
  const target = join(pkg, 'lib', to);
  await copyFile(source, target);
}
const manifest = JSON.parse(await readFile(join(pkg, 'package.json'), 'utf8'));
if (manifest.dsh?.bundle?.patch !== './cordis.patch.yml' || manifest.dsh?.client?.platform !== 'web') throw new Error('Missing DSH bundle/client manifest');
for (const file of ['lib/index.js', 'lib/client.js', 'cordis.patch.yml', 'README.md']) await stat(join(pkg, file));
const result = spawnSync('npm', ['pack', pkg, '--pack-destination', release, '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: root, stdio: 'inherit' });
if (result.status !== 0) throw new Error('npm pack failed');
console.log('Packaged to', release);
