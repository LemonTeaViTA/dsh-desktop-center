# DSH Desktop Center

**在 DSH 集中发现桌面应用，查看 Skills、MCP 与插件清单，管理 Qoder 两版的用户 Skills 和 MCP 服务。**

> 当前版本 **v0.3.0-rc.20（预发布候选）**。已在 macOS 26.4（arm64）、DSH Desktop 0.2.2-rc.3 验证安装、面板加载、卸载和回退。Qoder 两版仍待完成客户端刷新验收。

## 已有功能

| 模块               | 功能                                                                                             | 边界                                             |
| ------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| Desktop Registry   | 只读发现 Qoder 国际版 / CN、WorkBuddy、Trae、Codex Desktop、ZCode 和豆包的本地应用候选和配置目录 | 路径存在不代表应用正在运行、账户已登录或接口连通 |
| Skills Inventory   | 只读扫描 Skills 目录、SKILL.md 元数据、整包 SHA-256 指纹                                         | 不运行 Skill 中的脚本，不安装/同步/编辑 Skills   |
| Skills Comparison  | 按 Desktop 展示 Skills 差异和 `unknown` 状态                                                     | 对无法验证的文件不报告为一致                     |
| 应用资源详情       | 按应用浏览 Skills 简介、MCP、用户插件或扩展                                                      | 展示范围以扫描诊断中的应用覆盖状态为准           |
| Skills 和 MCP 管理 | 在 Qoder 国际版和国内版单独或批量安装、卸载 Skills，添加、移除 MCP                               | 用户选择目标，确认后写入。Skills 卸载可恢复      |

WorkBuddy 扫描独立的用户 Skills 目录。豆包支持应用发现，本地资源清单来源尚待验证。

## 安装

- **插件包：** `releases/dsh-desktop-center-0.3.0-rc.20.tgz`
- **GitHub 安装：** 在 DSH 的添加插件页面输入 `https://github.com/LemonTeaViTA/dsh-desktop-center`。本地也可通过官方插件管理器安装 `packages/desktop-center/`。
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

使用 `npm ci --ignore-scripts --no-audit --no-fund` 安装锁定的依赖，再运行 `npm run quality`。候选版 rc.20 已在本地和 [GitHub Actions](https://github.com/LemonTeaViTA/dsh-desktop-center/actions/runs/43701270831) 通过完整检查。

```text
packages/desktop-center/   单入口 Bundle（Host + Client + 聚合与管理 API）
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

开发进度见 [任务清单](docs/ROADMAP.md)。
