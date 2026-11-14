import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';

// No Skill code is executed. Bounds prevent an untrusted Skill from exhausting
// memory or causing an unbounded read across a user's home directory.
const MAX_MANIFEST_BYTES = 64 * 1024;
const MAX_PACKAGE_BYTES = 8 * 1024 * 1024;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_PACKAGE_FILES = 256;
const MAX_DEPTH = 8;
const IGNORED_NAMES = new Set(['.DS_Store']);

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return (
    relative === '' ||
    (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}

/** Read bounded frontmatter text without evaluating YAML tags or aliases. */
export function parseFrontmatter(text) {
  const header = /^---[ \t]*\r?\n([\s\S]*?)^---[ \t]*\r?$/m.exec(text.slice(0, 8192));
  if (header?.index !== 0) return {};
  const result = {};
  const lines = header[1].split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const match = /^(name|description):[ \t]*(.*?)[ \t]*$/.exec(line);
    if (!match) continue;
    const [, key, value] = match;
    if (key === 'description' && /^[>|][+-]?(?:\s+#.*)?$/.test(value)) {
      const block = [];
      for (const part of lines.slice(index + 1)) {
        if (part.trim() && !/^ /.test(part)) break;
        block.push(part.trim());
      }
      result.description = block.join(' ').replace(/\s+/g, ' ').trim().slice(0, 240);
    } else {
      result[key] = value.replace(/^['"]|['"]$/g, '').slice(0, 240);
    }
  }
  return result;
}

/**
 * Produce a deterministic fingerprint of *all readable regular package files*.
 * If any content cannot be safely inspected, report unknown rather than a
 * misleading 'same'. Nested symlinks and hidden files are not followed.
 */
async function fingerprintPackage(folder, filesystem) {
  const hash = createHash('sha256');
  const state = { bytes: 0, fileCount: 0, incomplete: false, reasons: new Set() };
  const mark = (reason) => {
    state.incomplete = true;
    state.reasons.add(reason);
  };

  async function walk(directory, depth) {
    if (depth > MAX_DEPTH) {
      mark('MAX_DEPTH_EXCEEDED');
      return;
    }
    let entries;
    try {
      entries = await filesystem.readdir(directory, { withFileTypes: true });
    } catch (error) {
      mark(error?.code ?? 'PACKAGE_READ_FAILED');
      return;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    for (const entry of entries) {
      if (IGNORED_NAMES.has(entry.name)) continue;
      if (entry.name.startsWith('.')) {
        mark('HIDDEN_CONTENT_UNVERIFIED');
        continue;
      }
      const current = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        mark('NESTED_SYMLINK_UNVERIFIED');
        continue;
      }
      let real;
      try {
        real = await filesystem.realpath(current);
      } catch (error) {
        mark(error?.code ?? 'PACKAGE_RESOLVE_FAILED');
        continue;
      }
      if (!isInside(folder, real)) {
        mark('PACKAGE_PATH_ESCAPE');
        continue;
      }
      if (entry.isDirectory()) {
        await walk(current, depth + 1);
      } else if (entry.isFile()) {
        let stat;
        try {
          stat = await filesystem.stat(current);
        } catch (error) {
          mark(error?.code ?? 'PACKAGE_STAT_FAILED');
          continue;
        }
        if (
          stat.size > MAX_FILE_BYTES ||
          state.bytes + stat.size > MAX_PACKAGE_BYTES ||
          state.fileCount >= MAX_PACKAGE_FILES
        ) {
          mark('PACKAGE_LIMIT_EXCEEDED');
          continue;
        }
        try {
          const bytes = await filesystem.readFile(current);
          if (bytes.length > MAX_FILE_BYTES || state.bytes + bytes.length > MAX_PACKAGE_BYTES) {
            mark('PACKAGE_LIMIT_EXCEEDED');
            continue;
          }
          state.bytes += bytes.length;
          state.fileCount += 1;
          const relative = path.relative(folder, current).split(path.sep).join('/');
          hash.update(relative, 'utf8');
          hash.update('\0');
          hash.update(String(bytes.length));
          hash.update('\0');
          hash.update(bytes);
          hash.update('\0');
        } catch (error) {
          mark(error?.code ?? 'PACKAGE_READ_FAILED');
        }
      } else {
        mark('UNSUPPORTED_FILE_TYPE');
      }
    }
  }

  await walk(folder, 0);
  return {
    packageSha256: state.incomplete ? null : hash.digest('hex'),
    fingerprintStatus: state.incomplete ? 'incomplete' : 'complete',
    packageBytes: state.bytes,
    fileCount: state.fileCount,
    reasons: [...state.reasons],
  };
}

/**
 * Read-only bounded scanner. A symlinked Skill root inside the user's home is
 * supported; its manifest must still resolve inside that Skill directory.
 */
export async function scanRoots(roots, { filesystem = fs, home = os.homedir() } = {}) {
  let resolvedHome;
  try {
    resolvedHome = await filesystem.realpath(home);
  } catch {
    resolvedHome = path.resolve(home);
  }
  const skills = [];
  const diagnostics = [];
  const inspected = new Set();

  for (const root of roots) {
    if (!root.exists) continue;
    let children;
    try {
      children = await filesystem.readdir(root.path, { withFileTypes: true });
    } catch (error) {
      diagnostics.push({ root: root.path, reason: error?.code ?? 'READ_FAILED' });
      continue;
    }
    for (const child of children) {
      if (child.name.startsWith('.')) continue;
      if (!(child.isDirectory() || child.isSymbolicLink())) continue;
      const folder = path.join(root.path, child.name);
      const candidate = path.join(folder, 'SKILL.md');
      let realFolder;
      let realManifest;
      try {
        realFolder = await filesystem.realpath(folder);
        realManifest = await filesystem.realpath(candidate);
      } catch (error) {
        if (error?.code !== 'ENOENT' && error?.code !== 'ENOTDIR') {
          diagnostics.push({ root: root.path, skill: child.name, reason: error?.code ?? 'RESOLVE_FAILED' });
        }
        continue;
      }
      if (!isInside(resolvedHome, realFolder) || !isInside(resolvedHome, realManifest)) {
        diagnostics.push({ root: root.path, skill: child.name, reason: 'OUTSIDE_HOME_SYMLINK' });
        continue;
      }
      if (!isInside(realFolder, realManifest)) {
        diagnostics.push({ root: root.path, skill: child.name, reason: 'MANIFEST_OUTSIDE_SKILL' });
        continue;
      }
      let stat;
      try {
        stat = await filesystem.stat(realManifest);
      } catch (error) {
        diagnostics.push({ root: root.path, skill: child.name, reason: error?.code ?? 'STAT_FAILED' });
        continue;
      }
      if (!stat.isFile() || stat.size > MAX_MANIFEST_BYTES) {
        diagnostics.push({ root: root.path, skill: child.name, reason: 'INVALID_OR_TOO_LARGE' });
        continue;
      }
      const key = `${root.path}\0${realManifest}`;
      if (inspected.has(key)) continue;
      inspected.add(key);
      try {
        const bytes = await filesystem.readFile(realManifest);
        if (bytes.length > MAX_MANIFEST_BYTES) {
          diagnostics.push({ root: root.path, skill: child.name, reason: 'INVALID_OR_TOO_LARGE' });
          continue;
        }
        const meta = parseFrontmatter(bytes.toString('utf8'));
        const fingerprint = await fingerprintPackage(realFolder, filesystem);
        for (const reason of fingerprint.reasons) {
          diagnostics.push({ root: root.path, skill: child.name, reason });
        }
        skills.push({
          name: meta.name || child.name,
          directoryName: child.name,
          description: meta.description || '',
          root: root.path,
          scope: root.scope,
          file: candidate,
          // Backward-compatible manifest-only hash; *not* used for package diff.
          sha256: createHash('sha256').update(bytes).digest('hex'),
          bytes: bytes.length,
          packageSha256: fingerprint.packageSha256,
          fingerprintStatus: fingerprint.fingerprintStatus,
          packageBytes: fingerprint.packageBytes,
          fileCount: fingerprint.fileCount,
        });
      } catch (error) {
        diagnostics.push({ root: root.path, skill: child.name, reason: error?.code ?? 'READ_FAILED' });
      }
    }
  }
  return { skills, diagnostics };
}

/** Compare entire Skill packages. Incomplete evidence is never reported as same. */
export function buildSkillMatrix(inventory) {
  const targetIds = inventory.desktops.map((item) => item.id);
  const rows = new Map();
  for (const desktop of inventory.desktops) {
    for (const skill of desktop.skills) {
      const key = skill.name.toLowerCase();
      let row = rows.get(key);
      if (!row) {
        row = { name: skill.name, byDesktop: Object.fromEntries(targetIds.map((id) => [id, []])) };
        rows.set(key, row);
      }
      row.byDesktop[desktop.id].push({
        sha256: skill.sha256,
        packageSha256: skill.packageSha256 ?? null,
        fingerprintStatus: skill.fingerprintStatus ?? 'unknown',
        scope: skill.scope,
        file: skill.file,
      });
    }
  }
  return [...rows.values()]
    .map((row) => {
      const records = Object.values(row.byDesktop).flat();
      const incomplete = records.some((item) => !item.packageSha256);
      const fingerprints = new Set(records.map((item) => item.packageSha256).filter(Boolean));
      const byDesktopStatus = {};
      for (const id of targetIds) {
        const items = row.byDesktop[id];
        byDesktopStatus[id] = items.length === 0 ? 'missing' :
          items.some((item) => !item.packageSha256) ? 'unknown' :
          new Set(items.map((item) => item.packageSha256)).size > 1 ? 'conflict' :
          fingerprints.size > 1 ? 'different' : 'same';
      }
      return {
        ...row,
        status: incomplete ? 'unknown' : fingerprints.size > 1 ? 'different' : 'consistent',
        byDesktopStatus,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
