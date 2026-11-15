/**
 * DSH Desktop Center V0.3 Host, read-only.
 * The individual Registry and Skills implementations remain separate pure
 * modules and expose separately versioned Cordis services. This package is
 * their single-install entry point; no Desktop settings are written.
 */
import { createDesktopRegistry } from './registry/service.js';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { readCodexMcp, readQoderMcp, readQoderPlugins, readZCodeMcp, readCodexPlugins, readTraeExtensions } from './codex-mcp.js';
import { createSkillsHub } from './skills/service.js';

import { isSkillManagementRequest, manageSkill } from './skill-management.js';

export const name = 'dsh-desktop-center';
export const inject = ['connection'];
export const VERSION = '0.3.0-rc.15';
export const ROUTES = Object.freeze({
  overview: '/api/dsh-desktop-center/overview',
  comparison: '/api/dsh-desktop-center/comparison',
  health: '/api/dsh-desktop-center/health',
  skills: '/api/dsh-desktop-center/skills/manage',
});

const noCache = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };
const json = (payload, status = 200) => Response.json(payload, { status, headers: noCache });

/** Inject dependencies for deterministic tests; no external process launched. */
export function createDesktopCenter({ registry = createDesktopRegistry(), hub, platform = process.platform, readMcp = readCodexMcp, home = homedir() } = {}) {
  const skillsHub = hub ?? createSkillsHub({ registry });
  return Object.freeze({
    version: 1,
    registry,
    skillsHub,
    async overview() {
      const inventory = await skillsHub.inventory();
      const desktops = await Promise.all(inventory.desktops.map(async desktop => {
        if (platform !== 'darwin') return desktop;
        if (desktop.id === 'codex-desktop') {
          const [mcp, plugins] = await Promise.all([
            readMcp(), readCodexPlugins(join(home, '.codex', 'config.toml')),
          ]);
          return { ...desktop, mcp, plugins };
        }
        if (desktop.id === 'workbuddy') {
          const [mcp, plugins] = await Promise.all([
            readQoderMcp(join(home, '.workbuddy', 'mcp.json')),
            readQoderPlugins(join(home, '.workbuddy', 'plugins', 'installed_plugins.json')),
          ]);
          return { ...desktop, mcp, plugins };
        }
        if (desktop.id === 'trae' || desktop.id === 'trae-cn') {
          const isCn = desktop.id === 'trae-cn';
          const userData = isCn ? 'Trae CN' : 'Trae';
          const extensionHome = isCn ? '.trae-cn' : '.trae';
          const [mcp, plugins] = await Promise.all([
            readQoderMcp(join(home, 'Library', 'Application Support', userData, 'User', 'mcp.json')),
            readTraeExtensions(join(home, extensionHome, 'extensions', 'extensions.json')),
          ]);
          return { ...desktop, mcp, plugins };
        }
        if (desktop.id === 'zcode') return { ...desktop, mcp: await readZCodeMcp(home) };
        const directory = { 'qoder-global': '.qoder', 'qoder-cn': '.qoder-cn' }[desktop.id];
        if (!directory) return desktop;
        const [mcp, plugins] = await Promise.all([
          readQoderMcp(join(home, directory, 'settings.json')),
          readQoderPlugins(join(home, directory, 'plugins', 'installed_plugins_v2.json')),
        ]);
        return { ...desktop, mcp, plugins };
      }));
      return {
        version: VERSION,
        scannedAt: inventory.scannedAt,
        platform,
        readOnly: true,
        desktops,
        summary: {
          desktopCount: inventory.desktops.length,
          installedAppCount: inventory.desktops.filter(item => item.appPaths.length > 0).length,
          skillOccurrences: inventory.desktops.reduce((sum, item) => sum + item.skills.length, 0),
          diagnosticCount: inventory.desktops.reduce((sum, item) => sum + item.diagnostics.length, 0),
        },
      };
    },
    comparison: () => skillsHub.compare(),
    manageSkill(input) {
      if (platform !== 'darwin') throw Object.assign(new Error('Unsupported platform'), { code: 'UNSUPPORTED_PLATFORM' });
      return manageSkill({ ...input, home });
    },
  });
}

/** Exact Connection Fetch routes are restricted to owner Peers by DSH. */
export function makeRoutes(center) {
  const queries = [
    { path: ROUTES.health, get: () => ({ version: VERSION, readOnly: true }) },
    { path: ROUTES.overview, get: () => center.overview() },
    { path: ROUTES.comparison, get: () => center.comparison() },
  ].map(({ path, get }) => ({
    path,
    methods: ['GET'],
    requestBody: 'buffered',
    async fetch(request) {
      if (request.method !== 'GET') {
        return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405);
      }
      try {
        return json({ ok: true, data: await get() });
      } catch {
        // Never echo raw filesystem paths, exception stacks or sensitive data.
        return json({ ok: false, error: 'SCAN_FAILED', message: 'Read-only scan failed. Check DSH plugin logs.' }, 500);
      }
    },
  }));
  return [...queries, {
    path: ROUTES.skills,
    methods: ['POST'],
    requestBody: 'buffered',
    async fetch(request) {
      if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405);
      if (request.headers.get('sec-fetch-site') === 'cross-site') return json({ ok: false, error: 'FORBIDDEN' }, 403);
      if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
        return json({ ok: false, error: 'INVALID_REQUEST' }, 415);
      }
      const body = await request.json().catch(() => null);
      if (!body || !isSkillManagementRequest(body)) return json({ ok: false, error: 'INVALID_REQUEST' }, 400);
      const { action, target, name, source } = body;
      try {
        return json({ ok: true, data: await center.manageSkill({ action, target, name, source }) });
      } catch (error) {
        if (error.code === 'SKILL_EXISTS' || error.code === 'EEXIST') return json({ ok: false, error: 'CONFLICT' }, 409);
        if (error.code === 'ENOENT') return json({ ok: false, error: 'NOT_FOUND' }, 404);
        if (error.code === 'EPERM' || error.code === 'EACCES') return json({ ok: false, error: 'FORBIDDEN' }, 403);
        if (error.code === 'UNSUPPORTED_PLATFORM') return json({ ok: false, error: 'UNSUPPORTED_PLATFORM' }, 400);
        return json({ ok: false, error: 'MANAGEMENT_FAILED' }, 422);
      }
    },
  }];
}

export function apply(ctx) {
  const center = createDesktopCenter();
  ctx.provide('desktopRegistry', center.registry);
  ctx.provide('skillsHub', center.skillsHub);
  ctx.provide('desktopCenter', center);
  for (const route of makeRoutes(center)) {
    // Cordis disposes registered routes on unload / HMR.
    ctx.effect(() => ctx.connection.fetch.register(route), `desktop-center: ${route.path}`);
  }
}
