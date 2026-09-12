# 本机一键部署到 139.196.192.5

在 Windows 本机的项目根目录双击 **`deploy-online.cmd`**。首次按提示输入一次服务器 root 登录密码，后续在同一台电脑上再次运行即可使用 SSH 密钥部署。

默认目标为 `root@139.196.192.5:22`，联机接口使用 `http://139.196.192.5/api/v1/`，服务目录为 `/opt/noname-online`。玩家使用下载的完整客户端，服务器不再提供游戏网页、图片或音频。

## 2 核 2G 的运行与部署预算

- 默认保留最多 10 个房间，最多同时托管 2 个进行中的 8 人对局。每个房间使用独立浏览器上下文，共享一个 Chromium 主进程；房间启动排队执行，避免同时分配造成瞬时内存峰值。
- 对 2 核 2G 机器，10 个同时运行的 8 人 Chromium 对局无法稳定实现：本地 10 房间实测 Chromium 进程约 2.3GiB，还未计入系统和 Docker。脚本采用安全准入：2 个活动对局、10 个房间总量，资源不足时返回 `SERVICE_BUSY`，保留 SSH 和系统可用性。需要 10 个同时进行的对局，应升级内存后再提高 `MAX_GAME_INSTANCES`。
- 平台（包括 Chromium）硬限制为 768MiB / 1.2 核；PostgreSQL 为 128MiB / 0.25 核；两个 Caddy 各 48MiB / 0.1 核。容器不能用额外 swap 扩张，给操作系统和 SSH 留出余量。
- 你的服务器内核为 3.10，默认设置 `CHROMIUM_SANDBOX=0` 以兼容该内核。平台仍以 `pwuser` 非 root 身份运行，使用 seccomp 配置和容器隔离；升级到支持 user namespace 的新内核后，可在服务器环境文件中改为 `CHROMIUM_SANDBOX=1`。
- 部署前要求可用内存至少 768MiB、根盘剩余至少 6GiB；镜像逐个拉取，Docker 26 使用传统构建器将每个构建步骤限制为 512MiB / 0.75 核；服务逐个启动并检查健康。
- 更新旧部署时，脚本会将之前保存的 `PLATFORM_MEMORY=3g`、`PLATFORM_CPUS=2`、`MAX_GAME_INSTANCES=2` 覆盖为上述小机器预算，保留数据库密码和其他配置。仅修改 Compose 默认值不会覆盖旧 `.env`，因此这里明确执行迁移。
- 10 个房间是配置与验证目标，不是无条件的容量保证。最终需要在目标 Linux 主机运行真实 80 客户端并发测试；本地引擎冒烟测试不能替代它。其他服务也占用内存时必须重新评估。

## 客户端资源与服务端代码

`pnpm build:online` 生成 `dist-online-host/`，只包含托管引擎、规则、运行所需页面/CSS/JS、配置和许可证。`release.tar.gz` 只打包这个目录及服务端源码、部署配置。媒体目录和其他位置的图片、音频、字体均不进入服务器产物。

`pnpm build:online:client` 生成 `dist/online-client/`，包含完整本体图片、音频和字体，供你通过自己的渠道分发。应在生成客户端资源后再打包 Electron 或 Android 安装包；Android 使用 `--skip-web-build` 可以复用已经完成的 `dist`。

Electron 联机窗口和 Android 联机窗口从本地 `online-client` 读取页面与资源，只有 API/WebSocket 请求发往服务器；本地文件缺失会报错，不会转为服务器资源下载。窗口保持无 Node/Capacitor 文件系统桥接。旧客户端需要重新打包更新，不能继续使用“打开服务器网页”的旧入口。

默认地址为 `http://139.196.192.5`。其他地址在客户端构建前设置 `VITE_ONLINE_ORIGIN`，与部署参数保持一致。同一份游戏源代码会生成相同的联机版本号，重复部署不会仅因时间变化要求玩家升级；规则或客户端代码更新时，需要同步发布匹配版本客户端。

## 本机与服务器条件

- 本机需要 Node.js 22.18+ 或 24.2+、Windows OpenSSH Client，以及 Windows 自带的 `tar.exe`。脚本会准备项目要求的 pnpm 10.34.5。
- 服务器沿用 Docker 26.1.4，不重装、不升级 Docker 引擎，不覆盖镜像加速器。复用 Compose；缺失时仅下载并校验固定版本 Compose。低内存部署不使用 Buildx。
- 服务器需要能够拉取 PostgreSQL、Caddy、Microsoft Playwright 镜像，并访问 npm 软件源。首次部署会下载较大的镜像和游戏资源，请预留足够磁盘空间。
- 阿里云安全组需要允许入站 TCP 80；SSH 继续使用 22。脚本不会更改云账号的安全组，也不会停掉其他网站来抢占端口。阿里云同样要求为 HTTP 应用放行 80 端口，见[官方部署说明](https://www.alibabacloud.com/help/zh/ecs/user-guide/install-and-use-docker)。

双击入口兼容 Windows PowerShell 5.1 和 PowerShell 7。无需在 Xshell 中逐条执行部署命令。

## 脚本会执行什么

1. 创建本机专用 Ed25519 密钥，首次使用服务器密码将公钥加入该账号的 `authorized_keys`，随后立即确认免密连接。后续 SSH/SCP 全部禁止密码交互。
2. 在本机运行 `build:online`，构建不含媒体的对局运行代码；生成基于源码的兼容版本号，打包三个服务端包及部署配置，不读取或上传 `扩展包/`。
3. 通过 SCP 上传压缩包，远端校验 SHA-256，解压到独立版本目录。数据库密码和管理令牌在服务器首次随机生成，后续沿用，不写入本机仓库。
4. 先拉取镜像、构建平台，再开启维护并确认没有活动对局。有正在启动或进行中的对局时，停止本次更新、恢复原维护状态，保留服务运行；待对局结束后重跑脚本。
5. 停止旧平台，备份 PostgreSQL，再按依赖顺序启动数据库、静态资源、平台和 HTTP 网关。使用现有 Compose 的容器健康检查、重启策略，并启用 Docker 开机启动。
6. 检查沙盒 Chromium、内部运行代码版本和公网 API；确认游戏页面与媒体路径不向公网提供。只有检查完成，才显示绿色的 `Deployment succeeded`。

部署检查不等于 80 玩家容量测试。本地可运行 `pnpm exec tsx scripts/online-host-smoke.ts` 验证真实引擎启动和离线 AI 路径；通过 `SMOKE_ROOMS=10` 设置十个八人房间，使用 `CHROMIUM_PATH` 指定已安装的 Chromium。

## 密码与密钥

默认密钥位于本机：

```text
%USERPROFILE%\.ssh\noname_139.196.192.5_22_root_ed25519
%USERPROFILE%\.ssh\noname_139.196.192.5_22_root_ed25519.pub
```

脚本不保存服务器密码。为满足后续无交互运行，专用私钥没有口令；请妥善保存私钥，勿提交或分享。原有 SSH 密钥、密码登录配置及 `authorized_keys` 中其他公钥会保留。首次连接使用 `accept-new` 记录主机密钥，之后发现主机密钥变化会拒绝连接。

更换电脑或丢失此私钥后，需要重新进行一次密码验证。若服务器禁止公钥登录，脚本会明确失败，不会在上传和启动步骤反复索要密码。

## 更换端口或账号

若 80 已被之前部署的其他项目占用，在本机项目目录运行：

```powershell
.\deploy-online.cmd -HttpPort 8081
```

此时服务地址为 `http://139.196.192.5:8081`，客户端构建时设置相同的 `VITE_ONLINE_ORIGIN`，并放行 TCP 8081；以后更新也使用相同参数。

其他可选参数：

```powershell
.\deploy-online.cmd -User root -SshPort 22 -HttpPort 80 -RemoteDirectory /opt/noname-online
```

非 root 账号需要已配置免密 sudo，否则脚本会停止；脚本不修改 sudoers。默认 root 账号无需 sudo。

## 远端文件与日常管理

```text
/opt/noname-online/
  current -> releases/<最近成功版本>
  shared/.env                  持久化密码、令牌和部署参数
  shared/runtime/maintenance   维护标记
  releases/<版本>/             每次部署的资源、服务源码与配置
  backups/<版本>.dump          更新前的 PostgreSQL 备份
```

数据库使用 Compose 项目 `noname-online` 的持久卷 `noname-online_postgres-data`。更新不会删除数据卷。旧版本目录和备份会保留，不会自动清理其他项目或执行 `docker system prune`；多次更新后可按需另行归档旧版本和备份。

部署后在 Xshell 查看状态或日志：

```bash
cd /opt/noname-online/current/deploy/online
docker compose ps
docker compose logs --tail=100 platform
```

需要修改房间并发等参数时，编辑 `/opt/noname-online/shared/.env` 后重跑本机脚本。`PUBLIC_PORT`、`PUBLIC_ORIGIN` 和 `ONLINE_BUILD_ID` 由脚本根据本次参数生成，修改它们应使用本机脚本参数。不要随意修改已有数据库的密码。

默认情况下同一账号只保留一个活动连接。仅用于测试时，可在该文件中设置 `ALLOW_MULTI_OPEN=1`，让同一浏览器的不同窗口使用各自的会话令牌测试多个账号；新窗口不会继承其他窗口的登录状态。该模式不改变同一账号的单连接保护，也不建议公网长期启用。

若检测到已有同名 Compose 项目、已有数据库却缺失密码文件，或目标目录属于旧的手工部署，脚本会停止以避免覆盖原数据。这种情况需要先迁移原部署配置，不能通过删除数据库来绕过。

## 失败后处理

- **安装依赖停在 `Proceed? (Y/n)`**：旧版脚本可能出现多个工作区确认提示重叠。按 `Ctrl+C` 结束旧进程，再运行更新后的 `deploy-online.cmd`；安装步骤已自动确认依赖目录重建并逐行输出进度，无需手动删除目录或升级 pnpm。
- **端口被占用**：使用 `-HttpPort 8081` 等空闲端口，或自行处理占用端口的原服务。
- **存在活动对局**：等待对局结束，再运行相同命令。
- **镜像或插件下载失败**：修复服务器出网或已有镜像加速配置后重跑；脚本不使用不明来源的镜像代理。
- **服务启动失败**：脚本输出本次版本目录和日志命令。数据库、备份、版本文件保留，修复问题后重跑；若已经切换服务，维护标记会保留，重跑成功后自动解除脚本留下的维护状态。
- **远端启动成功但公网 HTTP 不通**：检查阿里云安全组、服务器防火墙与指定 HTTP 端口。此时容器可能已在运行，脚本仍会返回失败，避免把“仅内网可用”误报为部署完成。

数据库迁移后不自动回退数据库；备份供明确选择恢复时使用。管理员自己开启的维护状态会保留，不会在部署成功后被擅自取消。

缺失 Compose 插件时使用 [v2.29.7](https://github.com/docker/compose/releases/tag/v2.29.7) 并校验 SHA-256。构建限制采用 [Docker 传统构建器的资源参数](https://docs.docker.com/reference/cli/docker/image/build/)，与容器运行限制分别设置。未来升级 Docker 时需要重新确认此构建方式的可用性。
