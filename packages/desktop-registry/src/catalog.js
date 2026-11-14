/**
 * Profiles describe Desktop installations, not CLI executables.
 * Only verified file locations are included by default. A directory existing
 * does not prove that a Desktop session is logged in or currently running.
 */
export const DESKTOP_CATALOG = Object.freeze([
  {
    id: 'qoder-global', label: 'Qoder 国际版',
    appNames: ['Qoder.app'],
    skillRoots: [
      { relative: '.qoder/skills', scope: 'user', evidence: 'official' },
      { relative: '.agents/skills', scope: 'shared', evidence: 'official' },
    ],
  },
  {
    id: 'qoder-cn', label: 'Qoder 国内版',
    // Exact .app name may differ by release. Discovered config is only a hint.
    appNames: ['Qoder CN.app', 'QoderCN.app'],
    skillRoots: [
      { relative: '.qoder-cn/skills', scope: 'user', evidence: 'community' },
      { relative: '.agents/skills', scope: 'shared', evidence: 'official' },
    ],
  },
  {
    id: 'workbuddy', label: 'WorkBuddy',
    appNames: ['WorkBuddy.app'],
    skillRoots: [], // Unverified: never guess that ~/.codebuddy belongs to WorkBuddy.
    note: 'WorkBuddy Skills path is not verified; configure a verified adapter later.',
  },
  {
    id: 'trae', label: 'Trae Desktop',
    appNames: ['Trae.app', 'TRAE.app'],
    skillRoots: [{ relative: '.trae/skills', scope: 'user', evidence: 'official' }],
    note: 'Trae CN has a separate global path and requires its own future profile.',
  },
  {
    id: 'codex-desktop', label: 'Codex Desktop',
    appNames: ['Codex.app', 'ChatGPT.app'],
    chatGPTBundleId: 'com.openai.codex',
    skillRoots: [
      { relative: '.agents/skills', scope: 'shared', evidence: 'official' },
      { relative: '.codex/skills', scope: 'legacy', evidence: 'community' },
    ],
  },
]);
