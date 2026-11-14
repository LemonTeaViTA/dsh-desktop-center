# 安装、验证与环境前提

## 当前可验证的部分

本交付环境有 Node.js 22，但不是你的 macOS DSH Desktop，也没有连到用户的应用目录。当前仅有模拟文件系统测试，不能确认 DSH 实际运行版本或 Bundle 装载情况。V0.2 不包含可视化面板。

```bash
npm test
npm run check
# 本环境 tsc 全局可用时运行 npm run typecheck
```

## 在 DSH Desktop 上安装（需要由你本地 DSH 执行）

1. 先确认你的 DSH Desktop 版本与它自带的 `cordis-plugin-development` Skill（官方仓库中的 `packages/preset/agent-preset/skills/cordis-plugin-development/SKILL.md`）。优先让 DSH 检查 `cordis_inspect_list` 与 `cordis_inspect_query` 中可用服务与 Client Slot。
2. 把整个 Starter 解压到一个独立的工作目录。**不要放在 `$DSH_HOME` 下**，更不要直接修改 profile 的 `package.json` 或 patch。
3. 在 DSH 的插件管理器或官方 `plugin_manager install_bundle` 流程里依次安装两个包目录：
   - `<工作目录>/packages/desktop-registry`
   - `<工作目录>/packages/skills-hub`
4. 如果使用本地安装命令，请以当前版本的 `dsh plugin --help` 为准，避免凭空假定 Desktop 的参数和打包行为。首次建议备份 DSH profile。
5. 安装后使用 DSH Cordis Inspector 检查 `desktopRegistry`、`skillsHub` 服务与 `superagent-desktop-registry`、`superagent-skills-hub` 插件行是否真正激活；如果服务不可用，先检查 Bundle 依赖、当前 profile 和插件安装日志，不要修改别人的桌面配置。
6. 读取 `desktopRegistry.listDesktops()` / `skillsHub.inventory()`；核对路径是否与 Mac 上实际安装一致。对于 Qoder CN/WorkBuddy/Trae 的 `.app` bundle 名称，用户实际名称可能不同，应当通过经过验证的配置适配器更新，而不是根据猜测自动安装。

**注意**：这些是 DSH **Host 插件**，不是可见 UI 页面。只有计划中的 V0.3 完成 Client 注册与 RPC 之后才会出现可操作的 DSH 管理面板。`skillsHub` 服务版本现为 2，旧版消费者须确认兼容。

## 不能做的事

- 不要通过 `node`/shell 控制 Qoder/WorkBuddy/Trae/Codex 的开发任务；这个项目使用 Node.js 仅作为 Host Plugin 运行时和本地自动化测试工具。
- 不要在配置里写入密钥、Cookie、访问 Token 或桌面应用的会话存储文件。
- 没有验证 WorkBuddy Skills 路径前，不要把 CodeBuddy 目录当作 WorkBuddy 管理。

## 真实机器验证清单

- [ ] 当前 macOS、DSH Desktop 与五个 Desktop 版本记录。
- [ ] `desktopRegistry` 服务成功激活，扫描没有写操作。
- [ ] Qoder CN 与国际版正确隔离；`~/.agents/skills` 共享目录识别正确。
- [ ] WorkBuddy 无可靠路径时显示 Unknown，而不是空白或 0 积分。
- [ ] 关闭 Skills Hub 不影响 Desktop Registry；关闭 Registry 能让依赖消费者安全卸载。
- [ ] 权限受限和目录不存在时，只返回诊断信息，不触发安装/授权弹窗。

## V0.2 质量工具

`npm run quality` 需要从 npm 下载 ESLint/Prettier/TypeScript 开发依赖；目前受限环境网络不可达，故仅可声明 Node 内置检查和已存在的 TypeScript 工具检查通过。参见 `docs/QUALITY_GATES.md`。第三方视觉 Skills 为外部选项，不在安装包内。
