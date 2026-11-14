# 安全政策 / Security Policy

当前 V0.3 为预发布候选，尚未经过独立安全审计或真实 macOS DSH 集成验证。请勿用它访问敏感账号或修改重要 Desktop 配置。

- 如果发现安全漏洞，请优先通过 GitHub 仓库的 **Security → Report a vulnerability** 私下报告（仓库发布后需由维护者启用 Private Vulnerability Reporting）。
- 如果尚未启用私下报告渠道，请先联系仓库维护者协商私密提交方式；**不要在公开 Issue 中披露令牌、密钥或可复现的敏感数据**。
- 当前安全边界与后续写入要求详见 [`docs/SECURITY.md`](docs/SECURITY.md)。

安全修复优先于普通功能，发布前应重跑验收流程并更新安全说明。
