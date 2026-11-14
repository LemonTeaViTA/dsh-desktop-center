# Definition of Done · DSH Desktop Center

完成必须同时提供**结果与证据**，不能以单元测试通过替代实机安装。

| 阶段 | 客观条件 | 当前状态 |
|---|---|---|
| 设计完成 | 只读功能边界、服务契约、权限与 UI 状态明确定义 | 已完成初稿 |
| 代码完成 | Bundle Host/Client、测试、发布配置一致，离线检查通过 | 待本版本验证 |
| 集成完成 | 真实 macOS DSH 上安装、刷新、查看数据、卸载/恢复测试 | 未完成 |
| 可发布 | 完整 CI（包括 ESLint/Prettier）、版本兼容、UI/无障碍、安全与文档验收 | 未完成 |

## 核心验收场景

1. 五个 Desktop 未安装或部分安装时，准确展示 `not-detected` / `configuration-found` / `app-found`，不虚构在线/登录状态。
2. Qoder 国内与国际版本地目录隔离；`~/.agents/skills` 共享目录按设计展示。
3. Skills 包指纹覆盖普通文件，权限异常/符号链接/超限情况给出 `unknown` 与诊断。
4. 只读 UI 能显示 Desktop、Skills、差异与诊断，搜索/刷新/空状态正确，异常不泄露敏感路径。
5. 禁用/卸载插件后，服务/路由/页面被清理；不修改用户的其他 Desktop 配置。
6. macOS 环境记录 DSH 版本、OS、真实 Desktop 版本及脱敏截图/日志。

每次 PR 应记录证据、未验证项、回退方式，并遵守 `docs/QUALITY_GATES.md`。
