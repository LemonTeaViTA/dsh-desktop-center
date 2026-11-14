---
name: dsh-plugin-testing
description: Use to verify DSH Cordis plugin bundles, lifecycle, Skills scanning, adapter correctness, security boundaries, packaging, and release readiness before installing or updating plugins.
---

# DSH 插件测试与发布验收

## 测试金字塔

1. 单元测试：插件逻辑输入输出、配置解析、目录边界、错误代码、幂等性。
2. 合同测试：Service Vn 入参/返回一致，Provider 缺失时消费者正常待机，不存在隐式全局状态。
3. 生命周期测试：Bundle 安装、装载、禁用、热重载、卸载、恢复；没有悬挂事件或 timer。
4. Desktop 兼容测试：Mac ARM64 和 Intel（如需要）、当前 DSH Desktop、各客户端版本。
5. 权限测试：缺失目录、目录只读、不可读目录、异常软链接、重复名字、超大 SKILL.md。
6. 写入测试（仅未来）：预览与真实写入完全一致，哈希竞争检测，失败恢复，备份回滚。

## 发布门槛

- 任意用户数据被修改前必须明确授权且通过恢复测试。
- MCP/Skills 自带脚本默认不执行。代码静态检查不能代替审查脚本的网络/执行权限。
- 不得引用未验证的私有 API 或未经许可的第三方代码。
- `app-found` 仅代表找到候选 App bundle，不代表运行中或登录中；UI 不得偷换概念。
- 成功与失败日志都不能包含账号 cookie、OAuth token、API Key。

## 本项目现有命令

在项目目录运行 `npm test`、`npm run check`。这些命令只验证插件代码，不会控制 Codex/Qoder 等 Desktop。本地 DSH 装载测试属于独立步骤，不能仅凭 Node tests 宣称已完成。

## 完成定义与自动门禁（V0.2）

1. 先读 `docs/DEFINITION_OF_DONE.md`、`docs/QUALITY_GATES.md`，报告 `designed`/`code-complete`/`integration-verified`/`release-ready` 中**有证据**的一种。
2. 离线运行 `npm run check && npm test`；如果 npm 依赖可用，再运行 `npm run quality`。无法安装 ESLint/Prettier 时禁止声称 lint/格式化门禁通过。
3. 变更公共接口需更新 `contracts/index.d.ts`；`skillsHub` V2 的 `unknown` 指纹状态必须被消费者处理。
4. 必须单独附上真实 macOS DSH 安装/卸载和生命周期测试结果；CI 不等于真实 Desktop 验证。
5. UI 测试依据 `docs/UI_REVIEW_TEMPLATE.md`，未实现 Client 页面时标明“不适用”，不能补造截图。
