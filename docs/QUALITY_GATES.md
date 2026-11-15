# QUALITY GATES · 工程与发布门禁 V0.2

## 先明确三类证据

1. **本机可执行 / 无第三方包**：`npm run check`（所有 JS 语法及仓库结构）、`npm test`（Node 内置测试）。不需要网络。
2. **依赖安装后可执行**：`npm run lint`（ESLint）、`npm run format:check`（Prettier）、`npm run typecheck`（TypeScript 公共契约），`npm run quality` 组合上述检查。没有运行成功就不能声称通过。
3. **真实集成 / 人工**：macOS DSH Desktop 中插件安装、启用、卸载、持久化与 UI；模拟测试、CI 均不能代替。

## 阶段门禁

| 阶段     | 自动门禁                                        | 人工/环境证据                             |
| -------- | ----------------------------------------------- | ----------------------------------------- |
| PR 初审  | Node 测试、ESM 语法、ESLint、Prettier、类型声明 | 契约变更评审、边界和数据敏感度            |
| 代码合并 | 所有 PR 门禁通过；新增行为配回归测试            | Maintainer 审查安全与兼容性               |
| 安装验证 | 产出 Bundle 内容、无额外文件或密钥              | 真实 DSH API、Host 生命周期、Mac App 版本 |
| UI 验收  | 实际可运行 UI 的可访问性与交互测试              | 截图、暗/亮主题、Unslop 红线评审          |
| 发布     | 上述所有已验证；回滚演练                        | 发版说明、支持矩阵、风险和降级步骤        |

## 依赖与检查

本地和 GitHub Actions 使用 `npm ci --ignore-scripts --no-audit --no-fund` 按锁文件安装依赖。发布时核对对应提交的 GitHub Actions 检查结果和 macOS 实机验收记录。

`tsconfig.contracts.json` 当前只检查 `.d.ts` 契约，不代表全量 JS 通过 `strict` 类型检查。待完成逐包 TypeScript 迁移后才启用整仓严格类型检查。

## 真实 DSH/桌面测试（发布前）

- 记录操作系统、CPU 架构、DSH 版本与每个 Desktop 版本；至少一次离线/权限不足场景。
- 通过一个 `dsh-desktop-center` Bundle 安装、检查 `desktopRegistry`/`skillsHub`/`desktopCenter` 服务；整体卸载验证依赖与路由清理。
- 只读扫描零写入，对配置不存在、WorkBuddy 未核实路径给明确未知状态。
- 有 UI 时：Slots 在真实 Client 中存在，Host RPC 权限正确、无泄露凭据，所有 UI 状态可复现。
- 扫描保持只读。管理操作须明确用户选择的目标，验证目标隔离、冲突和失败恢复。

## 禁止的“验证替代品”

不能以 `node --test` 代替 macOS 客户端测试；不能以截图代替交互测试；不能以 Skill 描述代替实际 lint；不能以“目录存在”证明用户已经登录；不能把扫描结果视为目标 Desktop 实际支持某项功能。
