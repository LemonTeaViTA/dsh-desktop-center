# 调研依据与可复核出处（2026-11-15 更新）

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

**ZCode 用户插件登记**：ZCode 将用户安装、内置和市场来源分开管理，参见 [ZCode 插件文档](https://zcode.z.ai/en/docs/plugin)。在已安装的 macOS ZCode 中核对随应用分发的 CLI 读取逻辑，确认用户登记文件为 `~/.zcode/cli/plugins/installed_plugins.json`，支持新版数组和旧版按插件 ID 索引的记录。只显示用户级记录中的名称和版本。内置插件、目录缓存和工作区登记不纳入此清单。

**豆包**：本机识别到 `Doubao.app`（`com.bot.pc.doubao`）。[豆包技能接入指南](https://open.doubao.com/document/doubao-developer-guide/skill-integration-guide)和本机已知目录均未提供可复核的 Skills、MCP 或用户插件登记路径。继续显示应用发现，三种资源在扫描范围中标记为未覆盖。

5. 外部设计 Skills（未复制代码或安装）:
   - 花叔 Design（MIT）：https://github.com/alchaincyf/huashu-design
   - Unslop（CC BY 4.0）：https://github.com/heydamir/unslop

开发和发布规范为本项目独立制定，不能因引用开源项目而推断已验证其实际 DSH 兼容性。
