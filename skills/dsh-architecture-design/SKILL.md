---
name: dsh-architecture-design
description: Use before designing, splitting, reviewing or extending DSH SuperAgent Cordis plugins. Define responsibility boundaries, service contracts, dependencies, upgrade safety and acceptance checks before coding.
---

# DSH SuperAgent 架构设计

## 何时使用

- 新增或拆分 DSH Desktop 管理插件。
- 修改多个 Bundle 间的服务接口。
- 现有功能发生职责重叠、循环依赖、重复存储、插件卸载导致错误。

不要用这个 Skill 替代具体 DSH 的官方 Cordis API 文档。先使用 `cordis-plugin-development`，确认实际运行版本及服务注册行为。

## 必须遵守的流程

1. **查证**：先查 DSH 官方源码、Runtime Inspector、现有插件与当前版本，不凭印象编造 API。
2. **定边界**：写一句话定义插件的唯一主职责；列出负责与不负责的事情。
3. **数据所有权**：每类状态只有一个权威数据所有者；消费者通过服务契约获取数据。
4. **依赖图**：用箭头画 Service Provider → Consumer，禁止循环依赖；非必需能力用 optional service/event。
5. **接口版本**：定义服务名称、版本号、入参、返回状态、错误/超时/取消语义；兼容更改前给迁移计划。
6. **安全**：按只读、需确认写入、高权限控制三类区分操作；日志不得携带密钥。
7. **卸载/重载**：需要描述 Provider 卸载后的行为、HMR、重连、状态恢复；禁止直接修改别的插件数据库。
8. **验收**：测试至少覆盖无插件/无应用/配置损坏/权限拒绝/无网络/版本不兼容。

## 输出模板

```text
功能目标：
插件名称/职责：
已有能力复用：
Provider 与 Consumer：
数据与凭据归属：
接口契约 Vn：
风险与审查门槛：
降级和回滚：
测试与验收：
```

## 本项目约束

目标应用只包括 Qoder 国际版、Qoder CN、WorkBuddy、Trae、Codex **Desktop**；不能把 CLI 执行器视为 Desktop 已有会话的替代。积分管理与签到分开，Skills/MCP/Plugins 也分开；SuperAgent 只编排，不直接读写各个业务插件的内部存储。

## V0.2 治理要求

- 为每个新 Bundle 明确契约版本、字段兼容策略、异常与 `unknown` 语义；不得把“扫码发现配置”上升为“账号已登录”。
- 新增接口前先更新 `contracts/index.d.ts`，写出至少一个正常和一个异常用例，再修改实现。
- 默认在 PR 描述中附上 `docs/DEVELOPMENT.md` 的模块边界和 `docs/DEFINITION_OF_DONE.md` 的证据状态。
