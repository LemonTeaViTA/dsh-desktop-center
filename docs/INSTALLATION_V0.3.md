# V0.3 从源码原型升级为单入口安装 Bundle

## 与 V0.2 的区别

V0.2 只有两个后台 Host 服务，需要分别安装，用户看不到操作界面。V0.3 在不修改 DSH 内核的前提下，用 **一个可安装 npm Bundle** 收拢两个只读服务，并加入 `dsh.client` 前端、DSH sidebar 与 `main` panel：UI 通过 DSH `connection.fetch` 的已认证只读路由获取本地数据。

> 产品取舍：源码模块仍然独立，但为了“安装一次即可查看”，V0.3 的三个服务在同一个 Bundle 生命周期中启停。之后可以通过可选子 Bundle 恢复更细粒度的独立启停；这需要进一步的真实 Cordis 组合验证。

## 如何使用

1. 下载 `.tgz` 或完整 ZIP。ZIP 是开发源码，`.tgz` 是单个 DSH Bundle 的 npm 发布格式；**两者都不是双击安装的 Mac app**。
2. 先在 DSH 查看本机当前版本，必须满足包清单里的 `engines.dsh`。如果低于要求，请停止而不是绕过版本检查。
3. 首次优先下载完整源码 ZIP，解压后让 DSH Creator 使用官方 `plugin_manager install_bundle`，`target` 指向解压目录内 `packages/desktop-center` 的**绝对路径**，安装前先显示包名 `dsh-superagent-desktop-center` 与版本 `0.3.0`。
4. 若使用 `.tgz`，先将文件放到本地目录，在插件管理器中安装此本地压缩包；如果当前 DSH 不接受本地 `.tgz`，使用第 3 步的本地目录而非编辑配置文件。
5. DSH 可能需要重启/重组插件树。按它报告的 `nextStep` 操作。安装成功后，左侧边栏应出现 **Desktop Center**。
6. 先检查 `健康`：GET `/api/dsh-superagent/health` 必须通过 DSH 认证；然后打开页面检查全部 4 个标签：Desktop、Skills、差异、诊断。
7. 安装失败：使用 DSH 插件管理器禁用或卸载该 Bundle；不要直接删除 `$DSH_HOME` 下面的文件。保留错误日志供分析。

## 验收清单

- [ ] DSH 版本检查通过，实际 Bundle 按官方插件管理器安装。
- [ ] Host `desktopRegistry`、`skillsHub`、`desktopCenter` 服务都激活。
- [ ] 侧边栏出现 Desktop Center，打开后无白屏。
- [ ] 概览统计和扫描结果来自真实 Mac，非演示数据。
- [ ] Qoder Global / CN 配置相互独立，WorkBuddy 未验证路径不伪装成功。
- [ ] Skills 全包指纹与差异正确，扫描报错会显示诊断。
- [ ] 在禁用/卸载插件后面板与 Fetch 路由被清理；不影响其他 Desktop 配置。

完成这些才算“在你的机器上完成集成验证”。目前在开发环境只完成离线自动测试，**没有用户 Mac 的权限或实际安装记录**。

## 参考

- 官方 DSH Bundle：`https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.zh.md`
- 官方 Client Modules：`https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/modules/README.md`
- 官方插件管理器：`https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/README.md`
- 第三方 no-build client 参考：`https://github.com/c-ling/dsh-plugin-pet`（研究其公开实现结构，未复制其业务代码）
