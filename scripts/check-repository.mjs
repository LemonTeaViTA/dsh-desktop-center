import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'AGENTS.md',
  'docs/DEVELOPMENT.md',
  'docs/DEFINITION_OF_DONE.md',
  'docs/DESIGN_SYSTEM.md',
  'docs/QUALITY_GATES.md',
  'docs/SKILLS_POLICY.md',
  'docs/UI_REVIEW_TEMPLATE.md',
  'contracts/index.d.ts',
];
const excludes = new Set(['node_modules', '.git', 'dist', 'coverage']);
let filesChecked = 0;
let failed = false;

async function check(file) {
  const text = await fs.readFile(file, 'utf8');
  const relative = path.relative(root, file);
  if (text.includes('\r')) {
    console.error(`CRLF is disallowed: ${relative}`);
    failed = true;
  }
  if (!text.endsWith('\n')) {
    console.error(`Missing terminal newline: ${relative}`);
    failed = true;
  }
  if (/[^\S\r\n]+$/m.test(text) && !file.endsWith('.md')) {
    console.error(`Trailing whitespace: ${relative}`);
    failed = true;
  }
  if (file.endsWith('.js') || file.endsWith('.mjs')) {
    const result = spawnSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    if (result.status !== 0) {
      console.error(`Syntax check failed: ${relative}\n${result.stderr.toString('utf8')}`);
      failed = true;
    }
  }
  filesChecked += 1;
}

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (excludes.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:js|mjs|ts|md|json|yml|yaml)$/.test(entry.name)) await check(full);
  }
}

for (const name of required) {
  try {
    await fs.access(path.join(root, name));
  } catch {
    console.error(`Required governance artifact missing: ${name}`);
    failed = true;
  }
}
await walk(root);
if (failed) process.exitCode = 1;
else console.log(`Repository baseline passed (${filesChecked} text files checked).`);
