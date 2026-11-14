# 将 DSH Desktop Center 开源发布到 GitHub（macOS）

推荐仓库名 **`dsh-desktop-center`**，插件包名 **`dsh-desktop-center`**，许可 **MIT**。当前交付包含一个本地 Git 仓库（`main` 分支和历史提交）及当前预发布标签 `v0.3.0-rc.2`，**尚未创建远程 GitHub 仓库**。

## GitHub Desktop 图形界面（推荐）

1. 解压交付的 **Git 仓库 ZIP**；保留隐藏的 `.git` 目录。
2. 安装并登录 [GitHub Desktop](https://desktop.github.com/)，选择 **File → Add Local Repository**，指向解压后的 `dsh-desktop-center` 目录。
3. 检查主分支 `main` 和最新提交；点击 **Publish repository**。
4. 名称填写 `dsh-desktop-center`，要公开共享则取消 `Keep this code private`，核对所属用户/组织后确认发布。
5. 上线后检查 README、LICENSE、Actions，并将 `v0.3.0-rc.2` 标记为 GitHub **Pre-release**；把 `releases/dsh-desktop-center-0.3.0-rc.2.tgz` 附到该 Release。

官方参考：https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop

## 命令行方式（可选）

若本机已安装 GitHub CLI，且通过浏览器完成账号登录：

```bash
cd /path/to/dsh-desktop-center
gh auth login
gh repo create dsh-desktop-center --public --source=. --remote=origin --push
git push origin v0.3.0-rc.2
```

命令中路径替换为 Mac 实际解压目录。**仅在远程仓库尚未创建时**使用 `gh repo create`，不能重复创建或强制覆盖；不要把 Token 贴到聊天或仓库。

## Git 历史与更名说明

旧的 `v0.3.0-rc.1` 是更名前的本地开发候选；更名通过**一个新增 Git 提交**保留历史，当前发布标签为 `v0.3.0-rc.2`。旧标签不在新交付包中，旧历史仍可从 Git 追溯。切勿使用 `git push --force` 改写公共历史。

发布后建议保护 `main`，使用功能分支和 PR，由 CI 运行测试及代码检查。见 [发布清单](RELEASE_CHECKLIST.md)。
