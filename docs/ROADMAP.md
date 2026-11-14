# 开发路线与可交付里程碑（2026-11-14 更新）

| 阶段 | 内容 | 当前验证状态 | 阻塞与下一步 |
|---|---|---|---|
| V0.1 | Registry + Skills Hub V1 的只读 Host Bundle | 模拟测试通过 | 未经 DSH Desktop 实机验证 |
| **V0.2** | **开发规范 / DoD / 设计系统 / Skills 路由 / CI 配置，Skills Hub V2 全包指纹** | 离线检查、Node 测试、TypeScript 契约检查通过 | npm 依赖无法安装；在线 lint/format/CI 未验证 |
| V0.3 | DSH Skills 管理 UI、Client/Host RPC、WorkBuddy 路径核验 | 尚未开发 | 需要真实 DSH Client Slots 和 macOS 运行时 |
| V0.4 | Skills 部署预览、确认、备份/回滚；MCP Hub 只读 | 尚未开发 | 写入安全与目标应用协议确认 |
| V0.5 | MCP Hub 配置/Plugin Hub 发现与兼容性管理 | 尚未开发 | 客户端结构不一致，授权与密钥隔离 |
| V0.6 | Check-in + Credits 两个独立插件 | 尚未开发 | 官方规则、账户、领取实证、积分有效期 |
| V0.7 | Desktop Bridge（真实 Desktop 会话能力） | 尚未开发 | 每个 App 都需独立确认开放接口和权限 |
| V1.0 | SuperAgent 跨 Desktop 任务编排 | 尚未开发 | 幂等任务、审批、Git 隔离、积分优先推荐 |

不能为“获得积分”绕过验证码、风控或客户端使用规则。随机签到时间只能用于平台许可范围内的分散调度，不能作为规避检测承诺。
