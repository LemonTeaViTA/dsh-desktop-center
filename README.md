# DSH SuperAgent · Desktop Center V0.3

**本次重点：终于做成了一个单入口 DSH Bundle，并且有真正的 DSH Sidebar Client 页面。** 它仍然是需在真实 Mac DSH 中验证的安装候选版本，不能当成已在用户电脑安装成功的正式发布。

## 直接使用的文件

- `releases/dsh-superagent-desktop-center-0.3.0.tgz`：单个可安装的 DSH npm Bundle 包，包含后台 Host、Web/Desktop Client、两个扫描模块，不需要在你的 Mac 安装项目开发依赖。
- `packages/desktop-center/`：等效的本地目录安装源；**首次兼容性验证推荐让 DSH 插件管理器安装此目录**，而不是手改 Profile 或双击 ZIP。
- `docs/INSTALLATION_V0.3.md`：一步一步的真实 Mac 验证说明。

### 已实现

| 功能 | 当前状态 |
|---|---|
| 一个包包含 DSH `dsh.bundle` 与 `dsh.client` | 完成打包、待实机装载 |
| DSH 侧边栏 `Desktop Center` 入口与主面板 | Client 代码及离线 Slot 注册测试通过，待实机截图 |
| 五个 Mac Desktop 目标 | 提供候选应用/目录映射，不等于账号在线 |
| Skills 列表、全包指纹、跨端差异、扫描诊断 | 核心离线测试通过 |
| Host/Client 数据通讯 | 使用 DSH `connection.fetch` 认证桥，离线路由测试通过 |
| 搜索、刷新、加载/错误/空状态 | 已写入 Client，待真实 UI 操作测试 |
| WorkBuddy Skills 路径 | 未可靠核实，显示未确定 |
| 自动签到、Credits、Skills 安装/写入、MCP、Plugin Hub | 未开发；仍是独立后续插件计划 |

**特别说明：** V0.3 的一键包内部仍将 Registry 与 Skills Hub 写成独立模块和两个版本化服务；为了一个安装入口，聚合 Bundle 暂时整体启停。这是便利安装与物理插件隔离之间的明确取舍。

## 在 DSH Desktop 安装

1. 查看 `docs/INSTALLATION_V0.3.md`。备份当前 profile，确认 DSH 版本满足包的 `engines.dsh`: `>=0.2.1-rc.2 <0.3.0-0`。
2. 如果已经安装了 V0.2 的两个旧 Bundle，先通过 DSH 插件管理器禁用/卸载它们，避免重复服务名。
3. 将整个项目 ZIP 解压到 Mac 的独立目录，在 DSH Creator 模式的官方 `plugin_manager` 中，对 `packages/desktop-center` 的**绝对路径**执行 `install_bundle`（让 DSH 展示安装目标并要求确认）。支持本地 tarball 的版本也可直接安装 `.tgz`。
4. DSH 提示成功后，按它报告的 `nextStep` 重启或刷新，打开左侧 `Desktop Center`，核对 Mac 实际数据。

不是 `.dmg`，也还没有在 GitHub/npm 发布，所以不能声称它已支持「点公网链接就自动安装」。当前可安装包已经通过离线 npm 安装检查，但尚未经过真正 DSH Profile 安装。

## 质量状态

在当前隔离 Node 环境执行：

```bash
npm run check
npm run typecheck
npm test
npm run pack:desktop-center
```

测试覆盖 Host 服务、认证路由形状、错误脱敏、Client factory/Slot 注册、配置与 Skills 差异。ESLint、Prettier 的依赖因 npm Registry 网络限制尚未安装/执行，在线 CI 未运行。`npm run quality` 不应被宣称已通过。

## 开发结构

- `packages/desktop-registry/`：原生独立 Registry Bundle 与算法源。
- `packages/skills-hub/`：原生独立 Skills Hub Bundle 与算法源。
- `packages/desktop-center/`：新版一入口 Bundle，使用独立模块的快照。`npm run pack:desktop-center` 时从源目录复制并打包。
- `tests/`：Node 自动测试。
- `contracts/`、`skills/`、`docs/`：契约、研发 Skills、设计系统和质量规范。

参考 [架构文档](docs/ARCHITECTURE.md)、[设计系统](docs/DESIGN_SYSTEM.md)、[完成定义](docs/DEFINITION_OF_DONE.md)、[安装验证](docs/INSTALLATION_V0.3.md)。

## 安全原则

只读；没有任意 shell 命令、CLI Desktop 替代、CDP、钥匙串或浏览器 Cookie 访问、外部 HTTP 上报。所有 GET 数据接口交由 DSH 的 `connection.fetch` 受认证路由承载。平台路径未验证时显示未知，不擅自操作其他 Desktop。

## GitHub 开源与版本控制

仓库采用 Git `main` 主分支和短期功能分支；正式变更通过 Pull Request 和质量检查合并。首个开源候选标签为 `v0.3.0-rc.1`（**预发布，不代表真实 DSH 集成已通过**）。

- [GitHub Desktop 一键发布指南](docs/GITHUB_PUBLISH.md)
- [参与贡献](CONTRIBUTING.md)
- [公开仓库检查清单](docs/RELEASE_CHECKLIST.md)
- [安全报告政策](SECURITY.md)

当前交付仅是已经初始化的**本地 Git 仓库**，并未推送到任何用户的 GitHub 账号；仓库创建和公开动作须由 GitHub 登录用户执行。
