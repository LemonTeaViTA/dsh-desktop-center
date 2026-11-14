# DSH Desktop Center v0.3.0-rc.2 · 安装与验证

**安装状态：** 单 Bundle 已实现并可用 npm 离线打包；**尚未实测你的 macOS DSH Desktop**。正式安装以你当前 DSH 版本支持的官方插件管理器操作为准。

## 首次安装

1. 备份当前 DSH Profile，确认当前版本符合包声明：DSH `>=0.2.1-rc.2 <0.3.0-0`，Node >=22。版本不满足时不要强装。
2. 若曾安装两个早期 V0.2 Bundle（Registry、Skills Hub），先通过官方管理器禁用或卸载，避免重复服务注册。
3. 下载 Git 仓库 ZIP，解压到 Mac 工作目录；让 DSH Creator 使用官方 `plugin_manager install_bundle`，安装目标设为 `<解压目录>/packages/desktop-center` 的**绝对路径**。确认前检查：包名 `dsh-desktop-center`、版本 `0.3.0-rc.2`、路径与权限。
4. 若当前插件管理器明确支持本地 `.tgz`，也可选择 `releases/dsh-desktop-center-0.3.0-rc.2.tgz`；否则使用目录方式。ZIP/TGZ 都不是双击安装的 `.dmg`。
5. 按 DSH 返回的提示刷新或重启，侧边栏应出现 **Desktop Center**；打开四个只读标签：桌面应用、Skills 清单、跨端差异、诊断。
6. 如 DSH 提供 Inspector，在官方认证通道下验证 GET `/api/dsh-desktop-center/health`、`/overview`、`/comparison` 与 `desktopRegistry` / `skillsHub` / `desktopCenter` 服务。

## 实机验收清单

- [ ] DSH 插件管理器报告安装成功，侧边栏出现 Desktop Center。
- [ ] 没有白屏，刷新后展示 Mac 真实扫描结果而非演示数据。
- [ ] Qoder Global / CN 区分正确；未核实 WorkBuddy 路径显示未知。
- [ ] Skills 包差异与 `unknown` 状态正确，错误不泄露路径/密钥。
- [ ] 禁用/卸载后服务、路由及页面解除注册，不更改任何其他 Desktop 配置。
- [ ] 记录系统/DSH/目标 App 版本、验证日期和脱敏日志。

若失败，使用 DSH 插件管理器禁用/卸载；不要直接修改 `$DSH_HOME` 或其他 Desktop 的内部数据。参考 [完成标准](DEFINITION_OF_DONE.md)。
