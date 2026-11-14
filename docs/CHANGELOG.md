# Changelog

## V0.2.0 — 2026-11-14

- Added `AGENTS.md`, Development / DoD / Design System / Quality Gates / Skills Policy, and a UI review template.
- Established Huashu Design (design exploration) + Unslop (visual critique) roles without copying or installing external Skills.
- Upgraded `skillsHub` service to `version: 2`: `packageSha256`, `fingerprintStatus`, `fileCount`, `packageBytes` and `unknown` comparison status.
- Fixed V0.1's manifest-only diff limitation: differences in `scripts/`, `references/` and other regular package files affect the package fingerprint.
- Added limits for package traversal; nested symlinks, hidden content, or oversized package files result in `unknown` rather than misleading consistency.
- Added offline checks, development tool configuration, and a CI workflow to validate when npm access is available.
- Added four focused regression tests. 10/10 Node tests currently pass in the isolated environment; contract declaration checking passes with a globally installed TypeScript compiler.

### Not validated

- ESLint/Prettier, npm install and CI (npm registry unavailable in this environment).
- Real DSH Desktop bundle loading/unloading, actual Mac Desktop compatibility, and any visual UI.

## V0.1.0 — 2026-11-13

- Created read-only `desktopRegistry` V1 and `skillsHub` V1 Host bundles, four local Skills and initial architecture/installation docs.

## V0.3.0 — 单安装包与原生 Dashboard Client（本地预览版）

- 增加 `packages/desktop-center/` 及唯一 Bundle manifest，支持本地目录或 `.tgz` 安装。
- 增加 DSH `dsh.client` factory-CJS，使用官方 `main` 和 `sidebar.panellist` Slots 注册 Desktop Center。
- 增加 4 个页面标签、真实数据获取、刷新、搜索和诊断/异常展示，使用认证的只读 Connection Fetch 路由。
- 保留两个扫描服务的独立接口，另加聚合服务 `desktopCenter` V1。
- Host/Client/打包离线测试新增 5 项（15/15 通过）；Mac DSH 实机未验证。

## v0.3.0-rc.1 — GitHub 开源预发布准备（2026-11-14）

- 新增本地 Git `main` 初始提交、版本标签、`.gitignore` 和 `.gitattributes`。
- 新增贡献指南、安全报告政策、Issue / PR 模板及 GitHub Desktop 发布文档。
- 初步检查代码库未发现常见私钥或 GitHub Token 字符串，离线 `npm run check` / `npm test` / `npm run typecheck` 通过。
- **尚未推送 GitHub，未进行真实 Mac DSH 装载验证，也未验证在线 CI。**
