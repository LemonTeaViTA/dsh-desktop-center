# 参与贡献 / Contributing

欢迎问题反馈、文档改进与代码贡献。本项目当前处于 **V0.3 安装候选阶段**，真实 macOS DSH Desktop 集成尚未完成，故不要把模拟测试通过解释为正式版可用。

## 贡献流程

1. 开 Issue 描述问题、平台、DSH 版本和预期行为；不要上传账号凭据、Cookie 或日志中的个人信息。
2. 从 `main` 创建分支，例如 `feat/skills-filter` 或 `fix/mac-path-detection`。
3. 遵守 [`AGENTS.md`](AGENTS.md)、[`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)、[`docs/DEFINITION_OF_DONE.md`](docs/DEFINITION_OF_DONE.md)。
4. 执行 `npm run check && npm test && npm run typecheck`；依赖安装可用时再执行 `npm run quality`。如果某检查因环境条件无法完成，必须在 PR 中明确说明。
5. 通过 Pull Request 合并，写明测试证据、是否涉及其他 Desktop 配置、回滚方式。

## 安全边界

当前插件必须保持只读。不得在未经明确授权的情况下添加自动写入第三方 Desktop 配置、读取凭据、调用私有签到接口或绕过验证的功能。第三方 Skills/插件的许可证应逐一核对，避免直接复制不兼容许可证的实现。

## 提交格式

推荐 Conventional Commits，如 `feat(skills): add filtered inventory`、`fix(registry): handle missing directory`、`docs: clarify macOS validation`。所有发布版本都应有对应 Git tag、变更日志和真实的质量验证说明。
