import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { DESKTOP_CATALOG } from './catalog.js';

const runFile = promisify(execFile);

async function directoryStat(filepath, filesystem) {
  try {
    const stat = await filesystem.stat(filepath);
    return stat.isDirectory() ? stat : null;
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return null;
    throw error;
  }
}

function normalizeOverride(id, overrides = {}) {
  return Array.isArray(overrides[id]) ? overrides[id] : [];
}

/** Read-only service. Explicit overrides are intended for tests and future adapters. */
export function createDesktopRegistry({
  home = os.homedir(),
  platform = process.platform,
  filesystem = fs,
  appPathsOverrides = {},
  skillRootsOverrides = {},
} = {}) {
  const catalog = DESKTOP_CATALOG.map((desktop) => ({ ...desktop }));

  const service = {
    version: 1,
    targets() {
      return catalog.map(({ id, label }) => ({ id, label }));
    },
    async listDesktops() {
      if (platform !== 'darwin') {
        return catalog.map((item) => ({
          id: item.id,
          label: item.label,
          status: 'unsupported-os',
          appPaths: [],
          skillRoots: [],
          notes: [item.note].filter(Boolean),
        }));
      }
      const entries = [];
      for (const item of catalog) {
        const conventionalPaths = item.appNames.flatMap((name) => [
          path.join('/Applications', name),
          path.join(home, 'Applications', name),
        ]);
        const candidates = [
          ...new Set([...conventionalPaths, ...normalizeOverride(item.id, appPathsOverrides)]),
        ];
        const appPaths = [];
        const seenDirectories = new Set();
        const notes = [item.note].filter(Boolean);
        for (const candidate of candidates) {
          try {
            const stat = await directoryStat(candidate, filesystem);
            if (!stat) continue;
            const bundleId = item.bundleIds?.[path.basename(candidate)];
            if (bundleId) {
              const plist = path.join(candidate, 'Contents', 'Info.plist');
              const { stdout } = await runFile('/usr/bin/plutil', [
                '-extract',
                'CFBundleIdentifier',
                'raw',
                '-o',
                '-',
                plist,
              ]);
              if (stdout.trim() !== bundleId) continue;
            }
            const identity = `${stat.dev}:${stat.ino}`;
            if (seenDirectories.has(identity)) continue;
            seenDirectories.add(identity);
            appPaths.push(candidate);
          } catch (error) {
            notes.push(`App path unavailable: ${error?.code ?? 'IO_ERROR'}`);
          }
        }
        const allRoots = [
          ...item.skillRoots.map((root) => ({
            path: path.join(home, root.relative),
            scope: root.scope,
            evidence: root.evidence,
          })),
          ...normalizeOverride(item.id, skillRootsOverrides).map((root) => ({
            path: path.resolve(root),
            scope: 'configured',
            evidence: 'user-override',
          })),
        ];
        const skillRoots = [];
        for (const root of allRoots) {
          try {
            skillRoots.push({
              ...root,
              exists: Boolean(await directoryStat(root.path, filesystem)),
            });
          } catch (error) {
            skillRoots.push({ ...root, exists: false, error: error?.code ?? 'IO_ERROR' });
          }
        }
        // 'configuration-found' is *not* equivalent to app installation or login.
        const status = appPaths.length
          ? 'app-found'
          : skillRoots.some((r) => r.exists)
            ? 'configuration-found'
            : 'not-detected';
        entries.push({ id: item.id, label: item.label, status, appPaths, skillRoots, notes });
      }
      return entries;
    },
  };
  return Object.freeze(service);
}
