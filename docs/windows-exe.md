# Windows EXE 打包

## 一键打包和运行

在 Windows 安装 Node.js 22.18+ 和 pnpm 10 后，在工程根目录执行：

```powershell
pnpm install --frozen-lockfile
pnpm build:exe
```

也可以双击根目录 `build-exe.cmd`。脚本会自动切换到工程目录，失败时保留错误信息。

成功后运行：

```text
output/windows/win-unpacked/noname.exe
```

这是免安装桌面程序，使用自带的 Electron 和本地文件服务，不需要目标电脑安装 Node.js、pnpm，也不需要启动开发服务器。打开后进入现有的游戏大厅（主界面）。公共联机仍需网络、账号和可用的服务器。

**分发时复制整个 `win-unpacked` 文件夹。EXE 旁边的 DLL、resources 等是必要运行文件，不能只拷贝 noname.exe。** 当前工程保留的角色、语音、皮肤和扩展较多，因此默认使用免安装目录，避免每次启动解压数 GiB 素材。

## 可选参数

```powershell
pnpm build:exe --offline-only  # 不附带公共联机客户端，保留本地大厅、单机、扩展
pnpm build:exe --portable      # 自解压单文件 EXE，可单独分发
pnpm build:exe --installer     # 原有 NSIS 安装包形式
pnpm build:exe --help
```

单文件名称为 `noname-<版本>-win-x64-portable.exe`，也在 `output/windows` 中。大量素材会增加压缩和每次解压时间；NSIS 自解压目标还受工具自身包体限制，素材较大的工程优先使用默认目录形式。

默认调用现有 `build:online:client`，附带隔离的公共联机客户端。服务器地址沿用已有配置，可以通过 `VITE_ONLINE_ORIGIN` 指定，例如：

```powershell
$env:VITE_ONLINE_ORIGIN = 'https://your-server.example'
pnpm build:exe
```

## 复用的原有功能

- `apps/electron/build.ts` 已使用 electron-builder，原 `build:win` 默认生成 NSIS 安装包。
- `scripts/build.ts` 原本会把 Web 构建、素材、整个扩展目录和 docs 等一起复制到根目录 dist。
- `scripts/package-hlhj.mjs` 只生成“红楼幻境”扩展 ZIP，不是游戏 EXE。
- 新入口 `scripts/build-exe.mjs` 复用核心构建和 Electron 打包，单独准备 `output/windows-stage`，不把工程根目录整体交给打包器。

## 文件筛选

保留：已编译核心、模式、卡牌、武将包、页面、样式、字体、图像、音频、已安装扩展、JIT 服务以及许可证。扩展可能在运行时加载 `src/`、TS、Vue、JSON，因此保留这些扩展内部文件。`scripts/desktop-dependencies.mjs` 显式收集本地文件服务、remote、ws 的完整生产依赖（包括 fastify），解决打包器对 pnpm workspace 依赖收集不完整的问题。

排除：核心构建的 `src/` 源码副本、工程文档和开发脚本、根 node_modules 开发工具、Git 信息、缓存、Home 存档、测试、类型声明、source map、日志、临时文件、原始 ZIP/7z/RAR、设计工程文件、红楼已转换素材的 `动态资源` / `*_配音` 母版目录及语音导入清单。不会因为扩展默认关闭就删除它，用户仍可在游戏里启用。

`output/windows/package-report.json` 记录暂存资源文件、大小和排除项目（被排除的整个目录只记一项）；`dependency-report.json` 记录桌面依赖版本。脚本会验证入口、import map、JIT 和默认联机入口存在，打包后从成品目录加载文件服务并验证入口 HTTP 200；任何构建步骤失败都会终止打包。暂存目录会在下一次打包重建，不应存放手动修改。

## 启动、存档和许可

- EXE 首次打开直接显示大厅；重新打开也回到大厅。游戏内部正常开始对局、重载和返回大厅仍遵循原有逻辑。
- 退出程序时统一收尾本地服务和存储；退出期间再次打开 EXE，会在旧进程结束后重新启动。扩展编译服务复用已注册的 Service Worker，游戏等待服务接管页面后再初始化，不再通过每次注销、刷新页面来启动。
- 自由选将搜索框采用独立横向布局；模式默认配置在游戏启动时初始化，不依赖打开设置菜单。
- 对局顶部“日志”可随时开关出牌文字记录，设置项位于“选项 → 显示 → 历史记录栏”。记录栏采用边缘小面板，新配置默认关闭；语音字幕会避开目标选择提示框。
- 联机窗口从随包的 `online-client` 读取页面、脚本和媒体，保留服务器来源用于联机 API；资源通过 Electron 原生流式协议接口返回，避免 `protocol.handle` 的 Web Request/Response 转换错误。本地响应提供对应的内容类型及媒体分段读取支持，API 通过同一会话的网络请求转发并显式绕过协议拦截，保留登录 Cookie。
- 联机加载失败时显示具体错误，详情写入 `%APPDATA%/noname-desktop/logs/online.log`；不再把所有加载错误笼统提示为客户端文件不完整。
- 单机与联机共用同一个桌面窗口。联机使用窗口内的隔离页面，可通过“操作 → 返回主大厅”关闭联机页面并恢复原大厅。关闭程序会同时释放内嵌页面和联机连接。
- 桌面包随附 `LICENSE`、`NOTICE.txt` 和第三方许可；“帮助 → 开源许可（GPLv3）”可打开许可文件。桌面包不再阻塞在浏览器版首次确认弹窗，也不替用户写入“已同意”标记。
- 打包后的配置、IndexedDB 存档和日志位于 `%APPDATA%/noname-desktop/`。旧版放在程序内 Home 的存档不会自动迁移。
- 扩展导入/修改仍写入游戏资源目录。默认免安装文件夹请放在可写目录；自解压单文件内临时导入的扩展不会在下次解压时保留，长期使用扩展导入功能请使用默认文件夹版。
- 8089 端口已被占用时会显示启动失败说明，关闭占用端口的开发服务后重试。
- 打包不包含本地服务器部署数据、账号库或密钥。发布修改版本时请同时提供相应源码，保留上游出处和许可证。

## 验证

本轮 BUG 修改按要求未运行测试、启动验证或重新打包。现有 `output/windows/win-unpacked/noname.exe` 不会自动更新；请重新执行 `pnpm build:exe`，然后使用生成的完整 `win-unpacked` 文件夹进行统一验证。

```powershell
pnpm test:exe
```

自动测试验证裁剪边界，尤其是扩展实际运行源码和媒体不能误删。构建后还应在 EXE 中确认大厅、扩展菜单和一局本地游戏；公共联机另受服务器状态及客户端版本影响。

Electron 下载失败时，仓库 `.npmrc` 已配置 Electron 镜像；也可为当前终端设置 `ELECTRON_MIRROR` 后重新安装运行时。脚本优先复用已经安装的 Electron。默认文件夹版跳过 EXE 签名和资源编辑，不要求管理员权限或 winCodeSign 工具；程序文件图标可能使用 Electron 默认图标。单文件/安装包仍可能下载 Windows 资源编辑器或 NSIS 工具，需要构建机可访问对应下载源及允许工具解压。

格式说明参见 [electron-builder 官方文档](https://www.electron.build/docs/)。
