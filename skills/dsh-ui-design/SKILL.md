---
name: dsh-ui-design
description: Use when designing or implementing DSH Desktop plugin pages, sidebars, status dashboards, permission flows, settings, and Skills/MCP/Plugins/Credits management UI. Prefer actual DSH Client slots and accessibility conventions.
---

# DSH 插件 UI 与交互设计

## 设计前

1. 查当前 DSH 的 `cordis-plugin-development` 和 UI 插件参考；用 Cordis Inspector 检查 Client Slots、主题色、可用组件与 user-action 通道。
2. 明确 UI 应安装在 DSH Host/Client 的哪个具体位置；如果没查到 Slot，**不得臆造 API**，先提交草图和待验证项。
3. 逐项区分真实数据、估算值、未获取状态、样例数据；默认不以“成功”展示未经核验的签到/到账。

## 信息架构

建议分为 Desktop / Skills / MCP / Plugins / Rewards / Tasks 六个页面，菜单只展示已安装插件。首页只聚合已实际启用的服务，不为未安装模块显示空占位作为假数据。

## 交互规范

- 查看与安装是两类操作：扫描只读；安装先预览变更与权限，再明确确认。
- 兼容性：每个目标应用的支持情况使用 `supported`、`partial`、`unverified`、`unavailable`，不因有一个目录就显示已连接。
- 列表应含来源、版本、作用域（用户级/项目级/共享）、同步状态与最后核验时间。
- 敏感字段只显示脱敏后摘要或凭据引用，禁止把完整 Token 送往 Client。
- 错误提示说明未完成的操作与恢复步骤；删除/覆盖必须可撤销。
- 低宽度布局下不得隐藏风险警告或按钮文本；键盘可操作、对比度可读。

## 交付

先做简洁 Wireframe 与状态机，再实现真实 Host/Client 数据绑定、测试加载/卸载和页面刷新。界面示例必须明显标明是示例；不要以静态 HTML 假装已经集成 DSH Desktop。

## 与视觉 Skills 的关系（V0.2）

- 设计顺序：需求/状态与 DSH Slots 核验 → `docs/DESIGN_SYSTEM.md` → 花叔 Design 生成候选方向 → 用户选定 → DSH Host/Client 真正实现 → Unslop 截图审查 → `docs/UI_REVIEW_TEMPLATE.md` 验收。
- 花叔 Design 决定**候选风格**，Unslop 负责**修改具体视觉问题**。二者都不能修改 DSH API、伪造积分数据或绕过 UI 权限。
- 不必每次微调按钮都重新要求花叔生成三个方向；大版本首次建立视觉语言时才做风格探索。
- 未获取 DSH Client Slots 时只交 Wireframe 和状态清单，不得以原型代替真实集成。
