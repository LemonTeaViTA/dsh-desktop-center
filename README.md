# DSH Desktop Center

**将多个 AI Desktop 的本地应用信息、Skills 清单和差异集中展示在 DSH 内。**

本仓库只有一个当前产品：**DSH Desktop Center**。它不是 SuperAgent，不负责任务编排、桌面远程控制、自动签到、积分领取、Skills 安装或 MCP / 原生插件管理。这些若开发，应成为独立项目或独立插件，不属于此仓库的功能承诺。

> 当前版本 **v0.3.0-rc.3（开源候选）**。rc.2 已在 macOS DSH Desktop 验证安装、面板加载和首次扫描。rc.3 的滚动及识别修复待宿主复测。

## 已有功能

| 模块 | 功能 | 边界 |
|---|---|---|
| Desktop Registry | 只读发现 Qoder 国际版 / CN、WorkBuddy、Trae、Codex Desktop 的本地应用候选和配置目录 | 路径存在不代表应用正在运行、账户已登录或接口连通 |
| Skills Inventory | 只读扫描 Skills 目录、SKILL.md 元数据、整包 SHA-256 指纹 | 不运行 Skill 中的脚本，不安装/同步/编辑 Skills |
| Skills Comparison | 按 Desktop 展示 Skills 差异和 `unknown` 状态 | 对无法验证的文件不报告为一致 |
| Desktop Center 面板 | DSH 侧边栏入口、四个只读标签、搜索、刷新和扫描诊断 | UI 注册只完成离线模拟测试，尚未 Mac 实机验收 |

WorkBuddy 的实际 Skills 路径尚未核实，显示未确定而不是虚构数据。只对 Desktop 本地配置作只读发现；不将 CLI 视为 Desktop 应用的替代。

## 安装（待实机验证）

- **插件包：** `releases/dsh-desktop-center-0.3.0-rc.3.tgz`
- **目录安装：** `packages/desktop-center/`（首次建议通过 DSH 官方插件管理器/Creator `plugin_manager install_bundle` 使用本地目录）
- **详细步骤：** [安装与验收指南](docs/INSTALLATION_V0.3.md)
- **声明目标：** DSH `>=0.2.1-rc.2 <0.3.0-0`、Node >=22；是开发声明，不代表实际设备兼容性已被证明。

首次安装前备份 DSH Profile；若早期试验过独立 Registry / Skills Bundle，先通过官方管理器禁用以避免服务名冲突。`.tgz` 不是 macOS 双击安装文件，不能手改 DSH Profile 假装安装成功。

## 本地开发与验证

```bash
npm run check
npm run typecheck
npm test
npm run pack:desktop-center
```

有联网的 npm 开发环境可以安装审查后的依赖并执行 `npm run quality`（ESLint、Prettier、TypeScript、测试）。本开发环境未完成完整 lint/format 和 GitHub CI 实际运行，不得将这些项目标注为通过。

```text
packages/desktop-center/   单入口 Bundle（Host + Client + 只读聚合 API）
packages/desktop-registry/ Desktop Registry 独立核心模块/Bundle
packages/skills-hub/       Skills 清单/差异核心模块/Bundle
contracts/                 只包含本项目实际服务契约
skills/                    项目开发与测试流程 Skills（非产品功能）
tests/                     离线回归测试
docs/                      架构、设计、安装、发布规范
```

同一个安装包内部注册 `desktopRegistry`、`skillsHub`、`desktopCenter` 服务，但为了首次安装方便三个服务随 Bundle 一起启停；源码和接口仍保持模块边界。

## 开源 / Git 历史

项目仓库名 **`dsh-desktop-center`**， npm Bundle 名 **`dsh-desktop-center`**，MIT 许可。

- [架构及范围](docs/ARCHITECTURE.md)
- [开发规范](docs/DEVELOPMENT.md)
- [完成定义](docs/DEFINITION_OF_DONE.md)
- [质量门禁](docs/QUALITY_GATES.md)
- [GitHub 发布指南](docs/GITHUB_PUBLISH.md)
- [贡献指南](CONTRIBUTING.md) · [安全说明](SECURITY.md)

当前版本为预发布候选，源码见 [GitHub 仓库](https://github.com/LemonTeaViTA/dsh-desktop-center)。
