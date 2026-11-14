# DSH Desktop Center · Agent 开发约束

按顺序阅读：`docs/ARCHITECTURE.md` → `docs/DEVELOPMENT.md` → `docs/DEFINITION_OF_DONE.md` → `docs/SKILLS_POLICY.md` → `docs/QUALITY_GATES.md`；涉及 UI 时另读 `docs/DESIGN_SYSTEM.md`。

- 产品**仅**负责 macOS AI Desktop 本地应用/配置发现、Skills 清单、差异比较和只读展示。
- 不把 CLI 当成 Desktop；不把目录存在误写成已登录/运行/已连接。
- **当前项目不做** SuperAgent 调度、签到积分、MCP/原生插件管理、Skills 安装或桌面控制。新增该类需求应新建独立插件。
- 核实 DSH 官方 `cordis-plugin-development` Skill、实际 Client API 和插件管理器后再集成；不要编造宿主行为。
- 读取 Skill 文件时控制大小、禁止执行脚本，保护用户路径和敏感数据；默认只读。
- 先修改契约/测试，再修改实现；运行 `npm run check`、`npm run typecheck`、`npm test` 和打包。
- 区分代码完成、离线验证、macOS 实机集成、公开发布，不得混淆。
- UI 采用既有 Design System；花叔 Design/Unslop 是可选视觉辅助，不改变宿主 API 或数据安全边界。
