# 调研依据与可复核出处（2026-11-14 更新）

以下为公开文档/项目的研究参考，**不是兼容性实机测试**：

1. DSH 官方 Cordis 与 Bundle/插件设计：
   - https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
   - https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md
   - https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-api/context.md
   - https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/preset/agent-preset/skills/cordis-plugin-development/SKILL.md
2. DSH Desktop Host 插件服务（不是原生 Electron API 的通用代理）：
   - https://github.com/qzcpl/deepseek-harness-desktop/blob/master/docs/plugin-development.md
3. Skills 路径：
   - Qoder 国际版：https://docs.qoder.com/extensions/skills
   - Qoder 国际版共享目录：https://docs.qoder.com/qoder/skills
   - Qoder CN：https://github.com/vercel-labs/skills/issues/1319
   - Trae（官方）：https://docs.trae.cn/ide_skills
   - Codex：https://learn.chatgpt.com/docs/build-skills
4. 参考的开源管理器（**未拷贝其代码**）：
   - https://github.com/xingkongliang/skills-manager
   - https://github.com/yxdwind/agent-skill-manager
   - https://github.com/ccckfg/agent-skills-manager

**不确定性**：WorkBuddy 的准确 Skills 目录、用户实际安装的 Trae 是否为 CN 版、Qoder CN/Global 在现有 Desktop 版本的 `.app` 名称和配置覆盖顺序尚未核实。MCP/Plugins 的自动管理、积分/签到均未开发。

5. 外部设计 Skills（未复制代码或安装）:
   - 花叔 Design（MIT）：https://github.com/alchaincyf/huashu-design
   - Unslop（CC BY 4.0）：https://github.com/heydamir/unslop

开发和发布规范为本项目独立制定，不能因引用开源项目而推断已验证其实际 DSH 兼容性。
