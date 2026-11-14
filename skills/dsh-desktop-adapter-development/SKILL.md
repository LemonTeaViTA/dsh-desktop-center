---
name: dsh-desktop-adapter-development
description: Verify read-only macOS Desktop app/config/Skills discovery for Qoder Global, Qoder CN, WorkBuddy, Trae and Codex Desktop, with evidence and unknown-state handling.
---

# DSH Desktop Center · 只读适配器开发

## 目标

适配器只负责发现特定 **Desktop 应用**、配置候选位置和 Skills 清单来源，记录证据、版本与异常；不发送消息、不控制现有会话、不使用 CLI 替代桌面 App、不读取密钥、不写入任何配置。

## 验证流程

1. 核实真实 `.app` Bundle ID、产品版本、安装目录、用户级 Skills 路径。Qoder Global/CN 独立处理；Trae 国内/国际版不得推测为相同；WorkBuddy 不借用 CodeBuddy 路径。
2. 先查官方公开文档，再在授权的 macOS 环境中只读核对。目录存在不证明应用已登录或已使用该 Skill。
3. 每个路径标记证据：`verified`（目标版本实际观察）、`documented`（文档）、`community`（社区）、`unknown`（未确认）。
4. 应用未安装、目录缺失、权限拒绝、软链接越界、文件过大或内容无法验证时，返回明确状态与安全诊断，不伪造零值。
5. 只从可信配置位置读取 `SKILL.md` 元数据并计算整包指纹，**禁止执行扫描到的脚本**。
6. 附测试 fixture、真实版本与路径依据；更新公共契约、覆盖回归，并提交代码评审。

## 权限边界

本仓库最多支持 `detect-only` 与 `read-only-inventory`。Skills 安装/同步、MCP 写入、账号签到、积分记录和桌面会话控制属于其他独立项目，不在适配器里提前实现或增加权限。
