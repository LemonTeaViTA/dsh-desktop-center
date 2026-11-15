# DSH Desktop Center v0.3 · 安装与验证

## 安装

1. 首次安装前备份 DSH Profile。包声明支持 DSH `>=0.2.1-rc.2 <0.3.0-0`、Node >=22。若曾试装独立的 Registry 或 Skills Hub Bundle，先在 DSH 插件管理器禁用旧 Bundle，避免重复注册。
2. 在 DSH 的添加插件页面输入 `github:LemonTeaViTA/dsh-desktop-center#main&path:packages/desktop-center`。本地目录安装可使用仓库中 `packages/desktop-center` 的绝对路径。
3. 要安装固定版本，可从 [v0.3.0 Release](https://github.com/LemonTeaViTA/dsh-desktop-center/releases/tag/v0.3.0) 下载 `dsh-desktop-center-0.3.0.tgz`。完全退出 DSH Desktop 后，在终端使用已安装的 DSH CLI。

   ```sh
   dsh plugin --profile desktop add "/绝对路径/dsh-desktop-center-0.3.0.tgz" --ignore-scripts
   ```

4. 打开 DSH Desktop，从侧边栏进入 **Desktop Center**，确认版本及本地扫描结果。应用详情提供 Skills、MCP 和插件或扩展入口。

## 回退

完全退出 DSH Desktop，卸载当前 Bundle，再安装需要的旧版包并重新打开客户端。卸载 Desktop Center 不会撤销已经写入 Qoder 的 Skills 或 MCP 配置。

```sh
dsh plugin --profile desktop remove dsh-desktop-center
dsh plugin --profile desktop add "/绝对路径/dsh-desktop-center-0.3.0-rc.20.tgz" --ignore-scripts
```

要恢复通过 Desktop Center 卸载的 Skill，先确认原位置没有同名目录，将卸载结果中记录的恢复目录移回该应用的 `skills` 目录并恢复原目录名，再重新扫描。

## 实机验收记录

2026-11-15 在 macOS 26.4（arm64）、DSH Desktop 0.2.2-rc.3 的独立 Profile 中完成：

- 用官方 DSH CLI 从 v0.3.0 压缩包安装，打开侧边栏并完成本地扫描。实测 360px 面板、键盘操作及滚动。
- 将 Qoder 国际版和国内版的测试 Skill 恢复至原目录，扫描找回后再次卸载，恢复文件与原文件一致。
- 隔离 Skills 目录拒绝访问时，扫描报告权限错误，写入接口返回 403。未经认证的查询和写入均被拒绝。
- 从压缩包安装 rc.20 后完成卸载和回退 rc.19。卸载后入口消失、健康检查返回 404，回退后入口、健康检查与扫描恢复。
- 在两版 Qoder 0.5.11 客户端的扩展管理中确认各自的测试 Skill、MCP 连接器和 MCP 工具。移除测试资源并刷新后条目消失，原配置文件逐字节一致。

## 应用覆盖

| 应用                 | 本机版本      | 本次验收范围                                                   |
| -------------------- | ------------- | -------------------------------------------------------------- |
| Qoder 国际版、国内版 | 0.5.11        | 应用发现，Skills 和 MCP 单端、批量管理，客户端刷新             |
| WorkBuddy            | 5.11.3        | 应用发现，Skills 和用户插件登记读取，MCP 配置缺失状态          |
| Trae Desktop         | 3.6.4         | 应用发现，用户资源目录或配置缺失状态                           |
| Trae 国内版          | 3.4.18        | 应用发现，Skills 和用户扩展读取，MCP 配置缺失状态              |
| Codex Desktop        | 26.1106.51428 | 应用发现，Skills、MCP 和用户插件配置读取                       |
| ZCode                | 3.18.2        | 应用发现，用户插件登记格式及缺失状态；非空读取使用隔离数据验证 |
| 豆包                 | 2.35.12       | 应用发现。Skills、MCP 和插件清单来源仍待验证                   |

本次完整实机验收覆盖上述 macOS arm64、DSH Desktop 和客户端版本。其他组合的支持范围见 [包声明](../packages/desktop-center/package.json) 与 [任务清单](ROADMAP.md)。
