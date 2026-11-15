# DSH Desktop Center v0.3 · 安装与验证

## 安装

1. 首次安装前备份 DSH Profile。包声明支持 DSH `>=0.2.1-rc.2 <0.3.0-0`、Node >=22。若曾试装独立的 Registry 或 Skills Hub Bundle，先在 DSH 插件管理器禁用旧 Bundle，避免重复注册。
2. 在 DSH 的添加插件页面输入 `https://github.com/LemonTeaViTA/dsh-desktop-center`。本地目录安装可使用仓库中 `packages/desktop-center` 的绝对路径。
3. 要安装固定版本，可下载 [rc.20 安装包](https://github.com/LemonTeaViTA/dsh-desktop-center/blob/main/releases/dsh-desktop-center-0.3.0-rc.20.tgz)。完全退出 DSH Desktop 后，在终端使用已安装的 DSH CLI。

   ```sh
   dsh plugin --profile desktop add "/绝对路径/dsh-desktop-center-0.3.0-rc.20.tgz" --ignore-scripts
   ```

4. 打开 DSH Desktop，从侧边栏进入 **Desktop Center**，确认版本及本地扫描结果。应用详情提供 Skills、MCP 和插件或扩展入口。

## 回退

完全退出 DSH Desktop，卸载当前 Bundle，再安装需要的旧版包并重新打开客户端。卸载 Desktop Center 不会撤销已经写入 Qoder 的 Skills 或 MCP 配置。

```sh
dsh plugin --profile desktop remove dsh-desktop-center
dsh plugin --profile desktop add "/绝对路径/dsh-desktop-center-0.3.0-rc.19.tgz" --ignore-scripts
```

要恢复通过 Desktop Center 卸载的 Skill，先确认原位置没有同名目录，将卸载结果中记录的恢复目录移回该应用的 `skills` 目录并恢复原目录名，再重新扫描。

## 实机验收记录

2026-11-15 在 macOS 26.4（arm64）、DSH Desktop 0.2.2-rc.3 的独立 Profile 中完成：

- 用官方 DSH CLI 从 rc.20 压缩包安装，打开侧边栏并完成本地扫描。实测 360px 面板、键盘操作及滚动。
- 将 Qoder 国际版和国内版的测试 Skill 恢复至原目录，扫描找回后再次卸载，恢复文件与原文件一致。
- 移除 rc.20 后重启，确认侧边栏入口消失、健康检查返回 404。安装 rc.19 后重启，确认入口、健康检查和扫描恢复。

两版 Qoder 0.5.11 的隔离客户端需登录后查看资源清单。客户端刷新验收和稳定版发布进度以 [任务清单](ROADMAP.md) 为准。
