import { scanRoots, buildSkillMatrix } from './scan.js';

/** Desktop Registry is an injected service; Skills Hub does not own its data. */
export function createSkillsHub({ registry, scanner = scanRoots, scanOptions = {} }) {
  if (!registry || typeof registry.listDesktops !== 'function') {
    throw new TypeError('Skills Hub requires a desktopRegistry service');
  }
  return Object.freeze({
    version: 2,
    async inventory() {
      const desktops = await registry.listDesktops();
      const result = [];
      for (const desktop of desktops) {
        const { skills, diagnostics } = await scanner(desktop.skillRoots, scanOptions);
        result.push({ ...desktop, skills, diagnostics });
      }
      return { scannedAt: new Date().toISOString(), desktops: result };
    },
    async compare() {
      const inventory = await this.inventory();
      return {
        scannedAt: inventory.scannedAt,
        matrix: buildSkillMatrix(inventory),
        desktops: inventory.desktops.map((d) => ({ id: d.id, status: d.status })),
      };
    },
  });
}
