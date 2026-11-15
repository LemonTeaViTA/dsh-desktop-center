import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';

const targets = new Map([
  ['qoder-global', '.qoder'],
  ['qoder-cn', '.qoder-cn'],
]);
const validName = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;

async function ensureDirectory(directory) {
  try {
    await fs.mkdir(directory, { mode: 0o700 });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
  if (!(await fs.lstat(directory)).isDirectory()) throw new Error('Expected a real directory');
}

export function isSkillManagementRequest({ action, target, name, source }) {
  return (
    targets.has(target) &&
    typeof name === 'string' &&
    validName.test(name) &&
    (action === 'uninstall' ||
      (action === 'install' && typeof source === 'string' && path.isAbsolute(source)))
  );
}

export async function manageSkill({ action, target, name, source, home = os.homedir() }) {
  const profile = targets.get(target);
  if (!isSkillManagementRequest({ action, target, name, source })) {
    throw new Error('Invalid operation, Desktop or Skill directory name');
  }
  const canonicalHome = await fs.realpath(home);
  const profilePath = path.join(canonicalHome, profile);
  const root = path.join(profilePath, 'skills');
  const destination = path.join(root, name);
  if (action === 'install') {
    await ensureDirectory(profilePath);
    await ensureDirectory(root);
  }
  if ((await fs.realpath(root)) !== root)
    throw new Error('Skill directory resolves outside the target profile');

  const lock = path.join(root, '.desktop-center-' + name + '.lock');
  await fs.mkdir(lock, { mode: 0o700 });
  try {
    if (action === 'uninstall') {
      if (
        !(await fs.lstat(destination)).isDirectory() ||
        !(await fs.lstat(path.join(destination, 'SKILL.md'))).isFile()
      ) {
        throw new Error('Expected a local Skill directory with a regular SKILL.md');
      }
      const recovery = path.join(profilePath, '.desktop-center-removed');
      await ensureDirectory(recovery);
      const backup = path.join(recovery, name + '-' + randomUUID());
      await fs.rename(destination, backup);
      return { destination, backup };
    }

    const staged = path.join(lock, 'package');
    const sourceRoot = await fs.realpath(source);
    if (
      sourceRoot === root ||
      root.startsWith(sourceRoot + path.sep) ||
      sourceRoot.startsWith(lock + path.sep) ||
      sourceRoot === lock
    ) {
      throw new Error('Source contains the target Skills directory');
    }
    if (!(await fs.lstat(path.join(sourceRoot, 'SKILL.md'))).isFile()) {
      throw new Error('Source requires a regular SKILL.md');
    }
    await fs.cp(sourceRoot, staged, {
      recursive: true,
      filter: async (file) => {
        const stat = await fs.lstat(file);
        if (
          (!stat.isDirectory() && !stat.isFile()) ||
          (file !== sourceRoot &&
            path.basename(file).startsWith('.') &&
            !['.gitignore', '.gitattributes'].includes(path.basename(file)))
        ) {
          throw new Error('Source contains a hidden or non-regular entry');
        }
        return true;
      },
    });
    try {
      await fs.lstat(destination);
      throw Object.assign(new Error('Skill already exists in the target'), {
        code: 'SKILL_EXISTS',
      });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    await fs.rename(staged, destination);
    return { destination };
  } finally {
    await fs.rm(lock, { recursive: true, force: true });
  }
}
