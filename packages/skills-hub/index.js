import { createSkillsHub } from './src/service.js';

export const name = 'superagent-skills-hub';
export const inject = ['desktopRegistry'];
export function apply(ctx) {
  ctx.provide('skillsHub', createSkillsHub({ registry: ctx.desktopRegistry }));
}
export { createSkillsHub };
