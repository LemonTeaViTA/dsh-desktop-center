# DSH Desktop Center · Design System

以 DSH 宿主主题与组件为基准，覆盖 Desktop 资源浏览和已验证的 Skills、MCP 管理流程。

## 信息结构

- 顶部：产品名称、版本、视图导航、搜索和扫描操作。上次扫描时间放在页尾。
- 桌面应用：卡片显示应用、发现状态和已扫描资源数量。详情优先展示 Skills 和简介，提供跳转至 MCP、插件或扩展的入口。应用及扫描路径按需展开。
- Skills 清单：按应用查看名称和简介，共享来源与扫描问题在相关记录中显示。
- 跨端差异：`same`/`different`/`missing`/`unknown`，并解释原因。
- 诊断：权限、配置路径未确定、扫描失败等问题；不能展示密钥、Cookie 或敏感完整异常。

## 视觉基础

| 项目 | 规范 |
|---|---|
| 字体 | 12 / 14 / 16 / 20 / 24px，明确标题/正文层级 |
| 间距 | 4 / 8 / 12 / 16 / 24 / 32px |
| 圆角 | 4 / 8 / 12px，克制卡片装饰 |
| 色彩 | 使用 DSH 当前主题 Tokens，语义 `surface/text/muted/border/accent/success/warning/danger` |
| 对比度与操作 | WCAG 2.2 AA；键盘焦点清晰，文本不能只靠颜色区分状态 |
| 状态 | 加载、空、成功、未确认、错误、权限不足、刷新中、部分成功 |

不同模块可采用卡片、筛选表格与诊断列表，但必须保持导航、字体、间距、状态语义一致。

## 设计审查工作流

`dsh-ui-design` 定义信息结构 → 可选花叔 Design 探索视觉 → 按 DSH Client API 实施 → 可选 Unslop 检查截图 → 键盘/暗亮主题/错误处理验收。

花叔 Design（https://github.com/alchaincyf/huashu-design）与 Unslop（https://github.com/heydamir/unslop）为外部可选资源，未被包含或安装。静态预览属于演示数据，**不是实际 DSH 运行截图**。
