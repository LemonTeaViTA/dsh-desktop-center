# 研发 Skills

本仓库提供 4 个项目专用 Skill：

- `dsh-architecture-design`
- `dsh-ui-design`
- `dsh-plugin-testing`
- `dsh-desktop-adapter-development`

另外**复用 DSH 官方 `cordis-plugin-development`**（不在本仓库复制代码，避免与已安装 DSH 版本不匹配）。官方参考：
https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/preset/agent-preset/skills/cordis-plugin-development/SKILL.md

这四个文件是符合 Agent Skills 形式的 `SKILL.md` 模板；还未复制到你的 DSH 配置，也未在真实 DSH Agent 中验证触发。可以在核实 DSH 的 Skill discovery 目录后按项目级安装，不直接覆盖原有用户 Skill。

## V0.2 调用顺序

见 `docs/SKILLS_POLICY.md`。视觉工作按 `dsh-ui-design` 定义信息结构 → 花叔 Design 做前期方向（可选外部 Skill） → Unslop 做截图红线复核（可选外部 Skill） → `dsh-plugin-testing` 按 DoD 证据验收。两份第三方 Skill 并未安装到本项目，且不能代替 DSH 官方 API 运行时检查。
