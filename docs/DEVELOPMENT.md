# DEVELOPMENT · DSH SuperAgent 开发规范 V0.2

## 目标和约束

- 目标仅为真实 **macOS Desktop 应用**：Qoder 国际版/CN、WorkBuddy、Trae、Codex Desktop。不要将 CLI 替代已有 Desktop 会话。
- 每个 Bundle 只拥有一组业务能力。宿主通过 Cordis service 注入，禁止业务插件互读私有 SQLite/配置。
- 当前已有 `desktopRegistry` V1 与 `skillsHub` V2。新增/修改公共服务须先更新 `contracts/index.d.ts`，再更新测试、消费者与 `docs/ARCHITECTURE.md`。
- 默认只读；涉及桌面控制、帐号数据、配置写入、插件安装时，必须采用独立权限流程。未知能力标记 `unsupported`/`unknown`，不能猜测接口。
- 原始 Skill 文本/脚本视作不可信数据，不执行、不通过 Agent 隐式执行；插件日志不得包含 token、cookie、密钥。

## 开发习惯

1. 提需求先创建小型设计记录（功能范围/不做的事/目标版本/验收用例/对其他插件的影响）。
2. 先设计服务契约与错误/未知状态，再写实现；用最小文件系统 fixture 验证。
3. 一次 PR 对应一个明确的插件功能；不可在 Skills Hub PR 里顺便改签到协议或 DSH 核心。
4. 先写回归测试，再修问题；每次 bugfix 包含能稳定重现的测试。
5. 优先保持纯函数和依赖注入（例：传 `filesystem`、`home`），避免全局单例和隐式文件操作。
6. 变更后跑 `npm run check` 与 `npm test`；依赖安装可用时还要跑 `npm run quality`。
7. 任何手工 macOS/DSH 验收，记录 app 版本、DSH 版本、操作、结果和时间；环境不可用明确标未验证。

## 代码规范

- 新增模块优先 TypeScript + `strict`，但当前 Host 文件仍为 ES Modules JavaScript；**不得用无测试的大规模迁移替代功能开发**。V0.2 仅严格检查 `.d.ts` 公共契约，迁移时逐包扩大类型检查范围。
- 命名：目录 `kebab-case`；函数/变量 `camelCase`；类型/接口 `PascalCase`；常量 `UPPER_SNAKE_CASE`；事件名使用 `area/action`。
- 使用 async/await；错误结构化（稳定 `code` + 诊断），保留失败来源，不静默吞掉安全问题。
- 仅在真实必要时增加依赖，优先 Node 标准库。未证实的 DSH API 不可写成已验证代码。
- 每个可改变用户资料的操作：dry-run、变更预览、确认、备份、原子写入、回滚、重启恢复；当前版本不做写操作。
- 不读取/改写 DSH profile 目录、其他应用会话数据库或 Keychain 中的密钥；只允许由授权官方扩展点提供的最小能力。
- 使用 EditorConfig/Prettier/ESLint 作为目标工具链。受限环境下只运行内置离线门禁，不得虚报完整格式化/lint 通过。

## PR 模板（文字检查项）

- 为什么要改、用户可见行为、触及的 Bundle、契约版本
- 新增/修改了哪些测试、包括权限错误和回退路径
- 是否读取敏感数据/调用 Desktop API/修改文件；授权边界
- DSH 实机验证结果（或原因和阻塞项）
- UI 变化有无设计决策、暗/亮主题、截图与可访问性检查

## 版本与兼容

- 保持单插件独立发布；breaking contract 升主版本（或明确 Vn 服务），新增字段默认可选且需兼容旧消费者。
- 任何字段从 `string` 变成 `null` 或增加 `unknown` 状态均视为契约变化。Skills Hub V0.2 对外 `version: 2`。
- 不将 `app-found` 误写为 `running`、`logged-in`、`connected`；不将 hash 一样误写成同平台可以执行。
