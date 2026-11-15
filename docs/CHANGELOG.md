# Changelog

## v0.3.0-rc.20

- 固定构建依赖，GitHub Actions 改用锁文件安装。
- 修正全仓格式，恢复完整质量检查。

## v0.3.0-rc.19

- 简化桌面应用卡片。详情优先展示 Skills 和简介，提供 MCP、插件与扩展跳转，扫描路径按需展开。
- 支持搜索应用详情里的 Skills、MCP 与插件。调整窄面板排版、键盘焦点和滚动区域。
- 2026-11-15 在 macOS 26.4（arm64）、DSH Desktop 0.2.2-rc.3 验证 360px 面板、键盘交互、主题对比度和现有 MCP 管理流程。

## v0.3.0-rc.18

- 从 ZCode 用户级安装登记读取插件名称和版本，支持当前与旧版登记格式。
- 诊断列出 Skills 目录访问错误、MCP 配置读取错误和插件登记读取错误。可展开各应用的扫描范围，区分未覆盖、未找到文件、无记录及读取失败。
- 豆包保留应用发现，明确标注其本地资源清单来源尚待验证。
- 2026-11-15 在 macOS 26.4（arm64）、DSH Desktop 0.2.2-rc.3 验证扫描范围及 ZCode 登记四种状态。登记格式核对自 ZCode 3.18.2，非空登记使用隔离测试数据。

## v0.3.0-rc.17

- 新增按应用浏览和搜索的 MCP 清单。
- 可勾选 Qoder 国际版和国内版，批量添加或移除服务，并按目标查看结果和重试。

## v0.3.0-rc.16

- 在 Qoder 两版详情页添加和移除单个用户级 MCP 服务。
- 保留配置文件中的其他设置，拒绝同名覆盖及不兼容的配置。

## v0.3.0-rc.15

- Skills 清单可勾选 Qoder 两版，批量安装或卸载用户 Skills。
- 显示各目标结果，有明确失败结果的目标可单独重试。

## v0.3.0-rc.14

- 在 DSH 桌面应用详情中加入 Qoder 两版的本地 Skills 安装和可恢复卸载。
- 建立逐项验收的任务清单。

## v0.3.0-rc.13

- 新增 Qoder 国际版和国内版的用户级 Skills 安装和可恢复卸载命令。

## v0.3.0-rc.12

- 接入 TRAE 两个版本各自的用户 MCP 配置和扩展安装登记。

## v0.3.0-rc.11

- 分开识别 Trae 国际版及国内版，扫描各自的用户 Skills 目录。

- 接入 WorkBuddy 用户级 Skills、MCP 配置和插件安装登记，以及 Codex 用户插件配置。
- 将普通 Git 元数据纳入 Skill 指纹，并区分单个 Skill 读取失败和包内容比较受限。

## v0.3.0-rc.10

- 接入 ZCode 用户级 Skills 和 MCP 配置，支持 MCP 的共享配置回退。
- 跨端差异区分未覆盖、扫描不完整和包内容未完整核验。

## v0.3.0-rc.9

- 增加 ZCode 和豆包的 macOS 应用发现，按已核实的 Bundle ID 识别。
- 跨端差异将未覆盖 Skills 路径的 Desktop 标为未知。

## v0.3.0-rc.8

- 在 Qoder 国际版和国内版详情中只读展示用户插件安装登记的名称和版本。

## v0.3.0-rc.7

- 显示 Skills 多行简介正文并支持搜索。
- 分别展示 Qoder 国际版和国内版用户配置中的 MCP 服务名称。

## v0.3.0-rc.6

- 新增 Desktop 详情，集中查看该应用的 Skills 和 MCP。
- Codex MCP 清单只读展示用户配置中的服务名称和启用状态。

## v0.3.0-rc.5

- Skills 清单按桌面应用分组，展示名称与简介，仅在相关条目下展示扫描异常。
- 面板显示当前加载的客户端完整版本号。

## v0.3.0-rc.4

- 将面板高度约束与内容滚动拆到两层容器，让桌面应用及各表格页签共享同一纵向滚动区。

## v0.3.0-rc.3

- 修复 DSH 主面板裁剪长内容时无法纵向滚动的问题。
- 识别 Bundle ID 为 `com.openai.codex` 的 ChatGPT.app，并按实际目录去重应用安装位置。
- 明确应用目标数与 Skills 扫描记录的统计口径，标记共享目录。

## v0.3.0-rc.2 — 2026-11-14 · Correct product scope and naming

- 正式更名为 **DSH Desktop Center**，GitHub 仓库建议名 `dsh-desktop-center`，npm 包名 `dsh-desktop-center`。
- 同步更新 Cordis Bundle ID、Client 插件 ID、侧边栏 Slot Key、只读路由前缀、测试断言及静态预览标题。新增 2 项命名/范围回归测试，离线测试总数为 17。
- 从当前仓库移除未实现的签到、积分、桥接、MCP / Plugins 管理及 Agent 调度接口草案；这些不属于产品功能。
- 调整架构、Roadmap、README、研发 Skills 与 GitHub 发布说明，保留 Git 历史；新包仅作为**预发布候选**。
- **真实 macOS DSH Desktop 安装和 UI 验证尚未完成。**

## v0.3.0-rc.1 — 2026-11-14 · Original pre-release candidate

- 初始 Git 仓库和开源文档；单 Bundle、只读 Host/Client、Skills 管理界面离线测试及 npm 打包。
- 此提交使用过宽泛的旧项目名称，已在 rc.2 中更正。

## V0.2.0 — 2026-11-14

- 工程标准、测试门禁、Skills 全包指纹/unknown 状态，四个研发 Skills。

## V0.1.0 — 2026-11-13

- 只读 Desktop Registry 和 Skills Inventory 的首个代码原型。
