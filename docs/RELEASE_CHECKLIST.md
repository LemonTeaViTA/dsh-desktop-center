# DSH Desktop Center · 公开发布检查清单（v0.3.0-rc.2）

## 本地验证

- [x] 修改后离线语法、17 项 Node 测试、公共类型检查与 npm pack 均通过。
- [x] 源码 `README`、Manifest、Cordis ID、Client ID、只读 API、包文件名统一使用 `dsh-desktop-center`。
- [x] Git `main` 保留历史且有更名提交；当前标签为 `v0.3.0-rc.2`。
- [x] `.gitignore`、MIT LICENSE、Issue/PR 模板与安全披露文档齐备。
- [x] 对当前源码做常见密钥、私钥等模式扫描，未发现常见格式匹配（不代表安全审计完成）。

## 仍需完成的远程与实机验证

- [ ] GitHub Public 仓库 `dsh-desktop-center` 创建成功，`origin` 与 `main` 已推送。
- [ ] GitHub Actions 的 ESLint、Prettier、类型检查和测试实际运行通过。
- [ ] 在真实 macOS DSH Desktop 安装、刷新、卸载、权限失败场景均通过。
- [ ] 核实真实 Qoder/Trae/WorkBuddy/Codex Desktop 配置适配路径。
- [ ] 仅创建 **Pre-release**，附 `dsh-desktop-center-0.3.0-rc.2.tgz`，明确现有兼容性限制。
