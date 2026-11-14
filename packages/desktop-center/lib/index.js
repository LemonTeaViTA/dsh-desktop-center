/**
 * DSH Desktop Center V0.3 Host, read-only.
 * The individual Registry and Skills implementations remain separate pure
 * modules and expose separately versioned Cordis services. This package is
 * their single-install entry point; no Desktop settings are written.
 */
import { createDesktopRegistry } from './registry/service.js';
import { createSkillsHub } from './skills/service.js';

export const name = 'dsh-desktop-center';
export const inject = ['connection'];
export const VERSION = '0.3.0-rc.4';
export const ROUTES = Object.freeze({
  overview: '/api/dsh-desktop-center/overview',
  comparison: '/api/dsh-desktop-center/comparison',
  health: '/api/dsh-desktop-center/health',
});

const noCache = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };
const json = (payload, status = 200) => Response.json(payload, { status, headers: noCache });

/** Inject dependencies for deterministic tests; no external process launched. */
export function createDesktopCenter({ registry = createDesktopRegistry(), hub, platform = process.platform } = {}) {
  const skillsHub = hub ?? createSkillsHub({ registry });
  return Object.freeze({
    version: 1,
    registry,
    skillsHub,
    async overview() {
      const inventory = await skillsHub.inventory();
      return {
        version: VERSION,
        scannedAt: inventory.scannedAt,
        platform,
        readOnly: true,
        desktops: inventory.desktops,
        summary: {
          desktopCount: inventory.desktops.length,
          installedAppCount: inventory.desktops.filter(item => item.appPaths.length > 0).length,
          skillOccurrences: inventory.desktops.reduce((sum, item) => sum + item.skills.length, 0),
          diagnosticCount: inventory.desktops.reduce((sum, item) => sum + item.diagnostics.length, 0),
        },
      };
    },
    comparison: () => skillsHub.compare(),
  });
}

/** A fetch route is registered only through DSH's authenticated Connection.
 * The route is GET-only, with no filesystem, credentials, or mutation API.
 */
export function makeRoutes(center) {
  return [
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
      } catch (error) {
        // Never echo raw filesystem paths, exception stacks or sensitive data.
        return json({ ok: false, error: 'SCAN_FAILED', message: 'Read-only scan failed. Check DSH plugin logs.' }, 500);
      }
    },
  }));
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
