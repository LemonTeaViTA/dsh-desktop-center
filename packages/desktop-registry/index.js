import { createDesktopRegistry } from './src/service.js';

export const name = 'dsh-desktop-center-registry';
/** Cordis owns service lifetime; no process launch or UI automation. */
export function apply(ctx) {
  ctx.provide('desktopRegistry', createDesktopRegistry());
}
export { createDesktopRegistry };
