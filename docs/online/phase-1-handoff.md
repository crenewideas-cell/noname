# 第一阶段交接：公网身份房间与托管执行

日期：2026-09-11。依据：[三轮开发方案](../public-online-three-round-plan.md)。

后续阶段已继续开发；当前联机开发和部署请以[第三阶段交接与部署说明](phase-3-handoff.md)为准。本文件保留第一阶段的范围记录。

状态：第一阶段代码与部署草案已交付，**未运行构建、自动化测试、浏览器联调或公网验收**。用户负责实际验证。本文件区分实现范围与验证结果，不能据此标记“公网可玩验证通过”。没有分析或修改扩展包内容。

## 1. 本轮实现

| 模块 | 实现内容 |
| --- | --- |
| 入口 | 两种默认启动主题共用单机/联机切换；移除 connect 玩法卡片；单机卡片保留原路径；联机身份卡片打开新大厅；旧 connect 自动启动回到入口 |
| UI | 国风背景、原画、金色/深绿主题；账号页、房间列表、搜索、人数/状态筛选、分页、创建/密码对话框、席位、准备、房主操作、聊天、加载、错误、结算返回；退出在顶部右侧 |
| 身份 | PostgreSQL 账号、唯一用户名、公开玩家码、scrypt 密码哈希、一次性恢复码、HttpOnly 会话、CSRF、短期一次性 WS 票据；同账号只有当前连接可发指令 |
| 房间 | 真实建房/入房/搜索、公开房/邀请码房、密码、准备、开始、离开、踢人、改名、房主转移、再来一局；单进程串行变更、版本检查、持久化失败回滚；全员离线空闲十分钟回收 |
| 执行 | 平台启动 headless Chromium；加载固定版本本体；所有座位映射真实账号；服务端运行身份引擎；客户端只提交选择；不需要房主的浏览器执行全局逻辑 |
| 结算 | 从引擎 Player 计算各账号胜负/平局，按 instanceId 幂等写入数据库；回到原房间可由房主重置并准备下一局 |
| 运行 | Compose、同域反代、数据卷、启动迁移、实例上限、启动超时/最长四小时回收、健康/就绪端点、日志轮转与关闭处理 |

独立平台入口是 `packages/server/src/platform-cli.ts`，监听 8082。旧中继入口保留兼容用途，新大厅不使用旧中继协议或文件服务。

## 2. 明确的玩法与能力边界

- 本轮托管预设：`identity-standard-v1`；2 / 4 / 6 / 8 人标准身份；标准武将包 `standard`、标准卡牌包 `standard`；单将；30 秒行动时限，35 秒服务端兜底转托管；不开放双将、特殊身份、旁观、自定义卡池或扩展规则。
- 开局要求全部席位是真实登录账号，且全部在线并准备。没有补假玩家。断线/超时后的 AI 是该席位的托管处理。
- 房主在对局中关闭浏览器不关闭执行实例。第一阶段不恢复刷新后的进行中画面；大厅连接可手动重试，进行中的原席位保留托管，直到结算或用户主动离开。
- 邀请方式是分享房间码；邀请码房不在其他人的公开列表出现，若另有密码仍需密码。好友关系、定向邀请、匹配队列、自动重连、快照恢复和斗地主托管属于第二阶段，当前界面明确显示未开放。
- 平台是单进程、单数据库、内存房间调度。数据库 advisory lock 阻止同时运行两个调度进程。平台重启会关闭旧活动房间；账号、会话和已写入的结算仍保留。不提供进程重启后的游戏恢复。
- 第一阶段以同域浏览器客户端为部署入口。Electron/移动壳的远端会话适配和完整跨端验收在第三阶段收口。现有本地客户端的退出程序实现继续保留；普通网页受浏览器限制，不能强制关闭任意标签页。
- 上行只接受白名单平台命令及 `attach/inited/result/auto` 游戏命令。选择令牌、所属座位、卡牌引用、目标、武将候选等有校验，禁止客户端函数反序列化与原型字段。**仍需后续按技能/事件细化合法动作验证和隐藏信息审查，不将本轮称为完整反作弊系统。**
- 下行复用本体的受信引擎消息（包含受沙盒限制的引擎函数）；它不是重新设计的纯数据游戏引擎。服务端只加载本项目构建资源。

## 3. 源码接线

```text
EntryShell（单机/联机）
  ├─ 单机 → 原 mode loader → 本地游戏
  └─ 联机 → OnlineLobby → client.ts → /api/v1 + /ws/v1
                                      ↓
                              platform/rooms.ts
                                      ↓
                              @noname/game-host
                                      ↓
                       Chromium → online/host.js → identity 引擎
                                      ↓
                         game.engine / game.choice / game.finished
                                      ↓
                          online/game.js → 现有对局 UI
```

开局分配写入当前标签页 sessionStorage 后，用干净的运行时加载对局，跳过本地扩展挂钩。`connect.js` 静态引入本体的 `online/game.js`，让公网构建把对局适配器纳入依赖图，避免产物运行时请求未发布的源文件路径。

关键文件：

- `apps/core/noname/online/client.ts`：账号状态、HTTP、WS 票据握手、请求关联和事件分发。
- `apps/core/noname/online/ui/EntryShell.vue`、`OnlineLobby.vue`、`online.css`：入口、大厅和统一视觉。
- `apps/core/noname/online/host.js`：服务器内部注入识别、固定规则、远程座位、选择与结算适配。
- `apps/core/noname/online/game.js`：引擎客户端适配、加载/失败/结算状态、离房返回。
- `packages/online-protocol/src/index.ts`：协议版本、规则能力、共享类型和输入约束。
- `packages/server/src/platform/{index,database,rooms}.ts`：接口、会话、房间调度和数据库。
- `packages/game-host/src/index.ts`：浏览器实例生命周期、资源限制和内部收发。
- `scripts/build-online.ts`：单独的本体公网产物，不调用扩展构建。

## 4. 本地开发启动（由用户执行）

要求 Node.js 22.12+、pnpm 10、PostgreSQL、可用 Chromium。开发依赖已安装，但未启动数据库/平台或下载安装 Chromium。当前已运行的开发服务器若受依赖变更影响，请重启。

仓库根目录执行：

```powershell
pnpm --filter noname --filter @noname/server --filter @noname/game-host --filter @noname/online-protocol install --no-frozen-lockfile
pnpm --filter @noname/game-host exec playwright-core install chromium
```

可以使用自己已有的 PostgreSQL；或者先在 `deploy/online/` 将 `.env.example` 复制成 `.env`，替换数据库密码，再执行以下命令仅启动开发数据库：

```powershell
docker compose -f compose.yaml -f compose.dev.yaml up -d database
```

在仓库根目录的一个终端启动平台，下面的密码需与实际数据库一致：

```powershell
$env:DATABASE_URL = 'postgresql://noname:YOUR_PASSWORD@127.0.0.1:5432/noname_online'
$env:PUBLIC_ORIGIN = 'http://127.0.0.1:8081'
$env:HOST_CLIENT_URL = 'http://127.0.0.1:8081/index.html'
$env:ONLINE_BUILD_ID = 'online-phase3-v1'
pnpm dev:online
```

另一个终端启动现有前端：

```powershell
pnpm --filter noname dev
```

打开 `http://127.0.0.1:8081`。Vite 已将 `/api/v1` 和 `/ws/v1` 代理到 8082。`localhost` 与 `127.0.0.1` 是不同 Origin，必须与 `PUBLIC_ORIGIN` 一致。旧文件服务仅供本地开发，不要暴露到公网。

如果使用系统 Chromium，可设置 `CHROMIUM_PATH` 为浏览器可执行文件绝对路径。托管资源地址由管理员配置，玩家不输入 IP。

## 5. Linux 公网部署草案（由用户执行）

使用独立域名，DNS 指向服务器，80/443 可达。以下按单台 Linux / Docker Compose 设计，尚未根据用户实际服务器调整，也没有执行部署。

先构建本体静态资源。在构建机仓库根目录：

```powershell
$env:VITE_ONLINE_BUILD_ID = 'online-phase3-v1'
pnpm build:online
```

Linux 构建机对应：

```sh
VITE_ONLINE_BUILD_ID=online-phase3-v1 pnpm build:online
```

产物为根目录 `dist-online/`。构建包括依赖包、本体模式与卡牌/武将模块，保留图片、音频、字体和布局；公网构建关闭即时编译插件，跳过扩展加载，不打包 `src/` 或扩展目录。产物中的 `node_modules/` 是 Rollup 输出的浏览器运行依赖，不能删除或一概拦截，否则 import map 无法载入 Vue 等依赖。

服务器须具备仓库中的 `packages/server`、`packages/game-host`、`packages/online-protocol`、`deploy/online` 以及 `dist-online`，目录层级与仓库一致。在 `deploy/online` 中：

```sh
cp .env.example .env
# 编辑 PUBLIC_HOST、PUBLIC_ORIGIN、POSTGRES_PASSWORD、ONLINE_BUILD_ID 等
docker compose up -d --build
docker compose logs -f platform gateway
```

当前按用户要求使用 HTTP + IP：`PUBLIC_ORIGIN=http://实际服务器IP:端口` 与 `PUBLIC_PORT` 对应，无需 `PUBLIC_HOST` 或证书，详见[静态修复与最新部署配置](static-review-fixes.md)。构建时 `VITE_ONLINE_BUILD_ID` 与平台 `ONLINE_BUILD_ID` 一致。数据库、静态资源服务和平台仅在 Compose 内部网络，不发布 5432、8082 或浏览器调试端口。

浏览器运行镜像固定为 Playwright 1.63.0，并以非 root `pwuser` 配合随仓库提供的 seccomp 配置启用 Chromium 沙盒。宿主内核必须允许必要的用户命名空间；若启动日志报告 sandbox/namespace 不可用，应按服务器环境修正配置，不应直接关闭沙盒。默认同时最多两局，3 GiB / 2 CPU 是初始配置，**不是测得的容量承诺**。

首次启动自动执行 `database.ts` 中版本 1、2 迁移；没有需要单独运行的迁移命令。新库创建表，旧库幂等保留账号/结算，将失去运行实例的旧房间标为关闭。停止/更新平台会结束其活动对局，更新前应等待对局排空。不要用 `docker compose down -v` 作为普通重启操作，数据库数据在命名卷中。

当前镜像构建用 tsx 执行平台源码，不依赖旧中继的 tsup 入口。第三阶段应结合实际环境固定完整镜像摘要/部署依赖、补齐备份恢复与正式运维流程。

## 6. 由用户执行的第一阶段验证记录

所有项目当前均为 **待用户验证**：

1. 两套启动主题切换单机/联机；确认无联机卡片；单机身份仍进入原逻辑；退出在右侧。
2. 两个独立浏览器配置/设备注册不同账号，保存恢复码；验证重新登录、错误密码和恢复密码。
3. 创建两人标准身份公开房；另一个账号按名称/码找到并加入；验证密码房、邀请码房、满房、非房主开始/踢人被拒绝。
4. 全员准备，由房主开始；两端真实选将、出牌和响应，推进到真实胜负/平局；不能以“房间已连接”作为通过。
5. 结算返回原房间，房主再来一局，准备后再次开始；检查不是复用已结束的 instanceId。
6. 四人场开局后房主关闭浏览器，其他用户继续游戏；离线席位应托管，不关闭实例。刷新恢复不属于本轮通过条件。
7. 关闭平台时页面明确报错；重新启动后账号及已结算结果仍在，失去 worker 的旧房间不显示可继续。
8. 公网两个不同网络的设备通过 HTTPS/WSS 完成至少一局。记录域名、构建号、人数、发生时间、roomId / instanceId、平台日志与界面现象。
9. 窄屏与桌面检查搜索、密码弹窗、准备/开始、离房及返回按钮。Native 退出程序由对应客户端实际验证。

可查询 `/api/v1/results` 查看当前账号最近二十局的持久化记录（需要当前账号会话）；该接口不接受客户端上报胜负。平台健康/就绪在容器内使用 `/healthz`、`/readyz`，不提供未认证管理操作。

## 7. 下一轮接续

第二阶段沿用现有 accountId / roomId / instanceId，完成好友和定向邀请、真实队列匹配、自动重连及可见状态快照、斗地主托管。优先处理本轮用户实测反馈，再扩展规则，不新增独立旧大厅或第二套身份系统。

已知需要在实测中重点关注：引擎选择事件覆盖、技能的服务端约束、超时托管与多玩家同时响应、启动/结算时序、服务器浏览器资源消耗。未获实际证据前均不得标记验证完成。

参考：[Playwright Docker](https://playwright.dev/docs/docker)（非 root 与沙盒配置）、[Caddy reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)（WebSocket 反代）。随附 seccomp 文件来源和许可证见 `deploy/online/THIRD_PARTY.md`。
