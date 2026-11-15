# DSH Desktop Center GitHub 发布指南

公开仓库为 [LemonTeaViTA/dsh-desktop-center](https://github.com/LemonTeaViTA/dsh-desktop-center)，默认分支为 `main`，包名为 `dsh-desktop-center`，采用 MIT 许可。

1. 核对 [发布清单](RELEASE_CHECKLIST.md)，运行 `npm run quality` 与 `npm run pack:desktop-center`，检查包内容、版本和源码一致。
2. 通过普通 Git 推送将提交送到 `main`，等对应提交的 GitHub Actions 通过。读取远程标签和历史，核对待发布的标签尚未使用。
3. 为已验收的提交创建版本标签并推送。通过 GitHub CLI 发布时使用 `--verify-tag`，上传同版本的 `.tgz` 并提供实机范围、已知限制和回退方式。候选版使用 `--prerelease`。
4. 下载 Release 的附件并核对 SHA-256，确认 Release 指向已验收提交。安装方式见 [安装与验收指南](INSTALLATION_V0.3.md)。

维护操作使用已授权的 GitHub CLI。凭据保存在本机 GitHub CLI 或凭据管理器中。公共分支和已发布标签用于版本追溯。
