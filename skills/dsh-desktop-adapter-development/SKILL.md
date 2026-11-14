---
name: dsh-desktop-adapter-development
description: Use when adding or maintaining a Desktop app adapter for Qoder Global, Qoder CN, WorkBuddy, Trae, Codex Desktop, or future graphical desktop apps, including Skills/MCP/Plugin locations, active session APIs, and read-only capability detection.
---

# Desktop 适配器开发（不等同于 CLI 连接器）

## 定位

一个 Adapter 只关心一个 Desktop 产品或需要独立账号/文件目录的产品版本；Qoder Global 与 Qoder CN 必须拆分。不能把 Trae CN 与 Trae Global 或 WorkBuddy 与 CodeBuddy 混淆。

## 先确认的事实

- 实际桌面 App 的 Bundle ID、显示名、版本和 macOS 安装路径。
- Skills、MCP、Plugins 的用户级/项目级目录与同名优先级；只引用官方或可靠的本机验证来源。
- 官方公开的授权接口、存在会话控制能力与否、是否允许自动化；没有公开 API 时声明 `unsupported`。
- 配置所在系统权限及文件锁/并发更新风险。

## 分级能力

```text
level 0: detect-only       # App、只读配置目录探测
level 1: inventory         # Skills/MCP/Plugins 只读清单
level 2: managed-write     # 明确批准后原子写入和回滚
level 3: authorized-action # 经授权的 Desktop 动作，返回执行回执
```

每级只在真实设备验证后开放；没有更高级能力时不能偷偷退回到私有 HTTP 接口、抓包或绕过验证流程。

## 上线检查

- 目录存在与实际使用该目录不是同一件事；在 Desktop UI 中手动核对技能列表。
- Scope 隔离，绝不借用另一产品的登录资料。
- 账号积分批次与 Codex 重置周期分开处理；所有金额/有效期必须保留证据来源。
- 每次应用版本升级，重新校验读写配置和权限边界。
- 报告来源链接、待确认项、测试步骤及安全注意事项。

## V0.2 的证据分级

- `verified`: 真实目标版本 Desktop/DSH 环境中实际观察到；`documented`: 官方文档但未实机验证；`community`: 社区报道；`unknown`: 无足够证据。
- `community` 不能直接变成默认的可写配置路径。WorkBuddy 路径无实机核验时保持空数组和诊断。
- 不因为可找到 Desktop CLI 就宣称能接管原生 Desktop 既有会话。
