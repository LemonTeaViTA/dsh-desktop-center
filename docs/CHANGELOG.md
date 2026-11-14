# Changelog

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
