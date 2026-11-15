# DSH Desktop Center · v0.3.0 发布检查清单

## 本地验证

- [x] 语法检查、ESLint、Prettier、公共类型检查、28 项 Node 测试与打包通过。
- [x] 工作区、Manifest、Host、Client 和安装包版本一致。
- [x] GitHub 仓库为 Public，默认分支为 `main`，保留既有历史与预发布标签。
- [x] `.gitignore`、MIT LICENSE、Issue/PR 模板与安全披露文档齐备。
- [x] 安装包内容与源码逐文件核对。检查跟踪文件和常见凭据模式。

## 实机验收

- [x] macOS arm64、DSH Desktop 安装、刷新、卸载、回退、目录拒绝访问和未授权请求通过验证。
- [x] 两版 Qoder 客户端刷新 Skills、MCP 和工具列表。移除测试条目后，确认配置及界面恢复。
- [x] 记录八个 Desktop 目标的验证范围、已知缺口和降级步骤，见 [实机验收记录](INSTALLATION_V0.3.md)。

## GitHub 交付

- [x] [发布提交的 GitHub Actions](https://github.com/LemonTeaViTA/dsh-desktop-center/actions/runs/43710296951) 通过。通过 DSH CLI 从 GitHub 插件子目录安装并打开实际面板。
- [x] [v0.3.0 Release](https://github.com/LemonTeaViTA/dsh-desktop-center/releases/tag/v0.3.0) 已发布。公开下载包与本地文件逐字节一致，SHA-256 为 `cfa9ffe3ce999d12a8faa45065a7dc8ebd66d3424b4b9a48dfa21a7c87c732e1`。
