/** Proposed versioned public contracts. No UI or transport implied. */
export type DesktopId = 'qoder-global' | 'qoder-cn' | 'workbuddy' | 'trae' | 'codex-desktop';
export type DesktopDetection = 'app-found' | 'configuration-found' | 'not-detected' | 'unsupported-os';
export interface SkillRoot { path: string; scope: 'user'|'shared'|'legacy'|'configured'; evidence: string; exists: boolean; error?: string }
export interface DesktopRecord {
  id: DesktopId; label: string; status: DesktopDetection; appPaths: string[];
  skillRoots: SkillRoot[]; notes: string[];
}
export interface DesktopRegistryServiceV1 {
  version: 1;
  targets(): Array<{ id: DesktopId; label: string }>;
  listDesktops(): Promise<DesktopRecord[]>;
}
export interface SkillRecord {
  name: string; directoryName: string; description: string; root: string;
  scope: string; file: string; sha256: string; bytes: number;
  packageSha256?: string | null; fingerprintStatus?: 'complete' | 'incomplete';
  packageBytes?: number; fileCount?: number;
}
// V2 adds full-package fingerprints and an honest unknown state.
export interface SkillsHubServiceV2 {
  version: 2;
  inventory(): Promise<{ scannedAt: string; desktops: Array<DesktopRecord & { skills: SkillRecord[]; diagnostics: Array<{ root: string; reason: string; skill?: string }> }> }>;
  compare(): Promise<{
    scannedAt: string;
    desktops: Array<{ id: DesktopId; status: DesktopDetection }>;
    matrix: Array<{ name: string; status: 'different'|'consistent'|'unknown'; byDesktopStatus: Record<string,'missing'|'conflict'|'different'|'same'|'unknown'> }>;
  }>;
}


/** V0.3's single-install aggregate read-only Host service. */
export interface DesktopCenterOverviewV1 {
  version: string;
  scannedAt: string;
  platform: string;
  readOnly: true;
  desktops: Array<DesktopRecord & {
    skills: SkillRecord[];
    diagnostics: Array<{root: string; reason: string; skill?: string}>;
  }>;
  summary: { desktopCount: number; installedAppCount: number; skillOccurrences: number; diagnosticCount: number };
}
export interface DesktopCenterServiceV1 {
  version: 1;
  registry: DesktopRegistryServiceV1;
  skillsHub: SkillsHubServiceV2;
  overview(): Promise<DesktopCenterOverviewV1>;
  comparison(): ReturnType<SkillsHubServiceV2['compare']>;
}

/** Design contracts for future bundles: these are NOT implemented in MVP. */
export interface CreditsProviderV1 {
  snapshot(desktopId: DesktopId): Promise<{ currency: string; amount?: number; observedAt: string; provenance: 'verified'|'estimated'|'unknown' }>;
  expiring(days: number): Promise<Array<{ desktopId: DesktopId; amount: number; expiresAt: string; provenance: string }>>;
}
export interface CheckinProviderV1 {
  status(desktopId: DesktopId): Promise<'unavailable'|'due'|'completed'|'needs-attention'|'unknown'>;
  run(desktopId: DesktopId): Promise<{ outcome: 'completed'|'skipped'|'failed'|'needs-attention'; verified: boolean }>;
}
export interface DesktopBridgeV1 {
  capabilities(desktopId: DesktopId): Promise<string[]>;
  request(desktopId: DesktopId, capability: string, request: unknown): Promise<{ ok: boolean; receiptId: string }>;
}
