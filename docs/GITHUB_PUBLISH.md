# 将 DSH SuperAgent 发布到 GitHub（macOS）

本仓库已经包含 `main` 分支的初始 Git 提交，以及 `v0.3.0-rc.1` 预发布标签（在我们提供的 Git 仓库 ZIP 中）。**当前不是已发布的 GitHub 远程仓库**。

## 最简单：GitHub Desktop 图形界面发布

1. 下载并解压随交付提供的 **Git 仓库 ZIP** 到 Mac 的独立开发目录；解压后保留隐藏的 `.git` 目录。
2. 安装并登录 [GitHub Desktop](https://desktop.github.com/)，在菜单选择 **File → Add Local Repository…**，定位到解压后的 `dsh-superagent` 文件夹。
3. 确认能看到 `main` 和初始提交；点击顶部 **Publish repository**。
4. 仓库名称输入 `dsh-superagent`。要开源，请**取消勾选 `Keep this code private`**；确认将其发布到你的个人账号或组织。
5. 发布完成后在 GitHub 上查看 README、LICENSE、GitHub Actions 等文件是否齐全。建议先将 Release 标为 **Pre-release**，标注真实 DSH Mac 安装验证尚未完成。

官方文档：<https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop>。

## 命令行方式（可选）

假设已安装 GitHub CLI，并且你已经在本机通过浏览器完成登录：

```bash
cd /path/to/dsh-superagent
gh auth login
gh repo create dsh-superagent --public --source=. --remote=origin --push
# 首次发布预发布标签（用于后续 Release）
git push origin v0.3.0-rc.1
```

只有在第一次发布、远程尚不存在时才运行 `gh repo create`。命令中的路径应替换为实际解压位置。不要在聊天中发送个人访问令牌，也不要把 Token 写进仓库。

官方文档：<https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github>。

## GitHub 仓库上线后推荐设置

- Settings → Branches / Rulesets：保护 `main`，以后通过 PR 合并；要求 CI 通过后才能合并。规则具体可用性取决于 GitHub 账户和仓库权限。
- Settings → Security：启用 Secret scanning、Private vulnerability reporting（如果计划及仓库能力允许）。
- 第一次 Release 使用 `v0.3.0-rc.1` 标记 **Pre-release**，上传 `releases/dsh-superagent-desktop-center-0.3.0.tgz`；不要声称它已经通过 macOS 实机测试。
- Issues：使用模板收集真实 DSH 版本、安装日志、兼容性问题。

## 开发时怎样回退

- 每项功能使用新分支，每次较小变更提交一次；GitHub Desktop 的 **History** 可以查看历史提交。
- 对已经推送的历史，优先使用 `git revert <commit>`，再推送新的撤销提交；不要为了回退而 `git push --force` 覆盖其他人的历史。
- 未发布的实验可用独立分支；插件发布建议使用 Git tag 标记每一个稳定的已验证候选。

公开前务必根据 [`RELEASE_CHECKLIST`](RELEASE_CHECKLIST.md) 检查许可证、凭据、质量门禁与版本说明。初步字符串扫描不等于完整安全审计。
