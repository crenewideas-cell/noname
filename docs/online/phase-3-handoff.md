# 第三阶段交接：公网交付、安全收口与运维

日期：2026-09-11。依据：[三轮开发方案](../public-online-three-round-plan.md)与[第二阶段交接](phase-2-handoff.md)。

最新静态修复与部署约定见[静态复核修复记录](static-review-fixes.md)：用户当前明确使用 HTTP + IP，不要求 HTTPS 或域名。当前 Compose/Caddy 配置以该记录为准，本文下述 TLS、域名及 443 端口步骤是此前交接内容。

本轮完成第三阶段源码、部署和运维收口。按用户要求没有运行测试、构建、浏览器联调、容器启动或公网验证；扩展包内容继续完全忽略。当前构建标识为 `online-phase3-v1`，客户端、平台、托管 Chromium 和静态资源必须统一使用这个标识。

## 本轮完成

平台现在支持维护状态。维护期间仍可登录、查询大厅、继续进行中的对局和离开房间；新建房间、加入房间、开始对局、再来一局、加入匹配和确认匹配会被服务端拒绝，前端显示统一维护提示。这样更新时可以先阻止新增对局，再按部署窗口处理服务重启。

平台启动时会从数据库恢复等待中和已结算房间，活动中的 `starting` / `in_game` 房间仍按实例失效策略关闭。恢复的席位统一标记为离线且取消准备，重新认证后再恢复在线状态；账号、好友、邀请、密码房哈希、封禁记录和结算记录仍在数据库中保留。数据库迁移会为旧 `online_rooms` 表补充独立的 `password_hash` 列，密码不会写进对外房间文档。第一、二阶段创建但尚未持久化密码哈希的旧密码房会在重启时安全关闭，避免被降级成无密码房。

新增受保护只读状态接口 `/api/v1/admin/status`，使用 `Authorization: Bearer <ADMIN_STATUS_TOKEN>`，不把管理令牌放在 URL。接口只返回构建号、维护状态、账号数量、连接数、房间状态统计、匹配队列、托管实例、基础进程内存和请求计数，不返回房间文档、手牌、密码、Cookie、会话或完整载荷。未设置令牌时接口不可用。

平台成功命令日志只记录 requestId、accountId、命令名、roomId 和 instanceId；现有日志继续脱敏密码、恢复码、Cookie 和 Authorization。服务端对客户端指令、资源数量、WebSocket 帧大小、待处理请求、速率和托管实例数设有限制；托管 Chromium 继续使用非 root 用户和沙盒。

公网网关继续只开放 80/443，平台、数据库、静态资源和 Chromium 执行器在内部网络。Caddy 增加基本安全响应头；静态资源服务阻断扩展、源码、文件操作接口、环境文件、Git 和构建配置路径，同时保留运行时需要的浏览器依赖目录。前端不暴露玩家填写 IP 的联机入口。

## 版本与配置

```text
ONLINE_BUILD_ID=online-phase3-v1
MATCH_REGION=default
RESUME_GRACE_MS=120000
ONLINE_MAINTENANCE=0
MAX_GAME_INSTANCES=2
PLATFORM_MEMORY=3g
PLATFORM_CPUS=2
ADMIN_STATUS_TOKEN=<仅放在部署服务器环境中的随机长令牌>
```

版本不一致会在能力查询或 WebSocket 握手阶段被拒绝；客户端会显示版本升级提示，不会无限重连。修改 `ONLINE_BUILD_ID` 时必须先用相同的 `VITE_ONLINE_BUILD_ID` 构建 `dist-online`，再部署平台和静态资源。

正式部署目录为 `deploy/online/`。复制 `.env.example` 为 `.env`，替换域名、数据库随机密码和管理状态令牌；不要把 `.env` 提交到仓库。只使用 `docker compose up -d --build` 启动，确认 DNS 指向服务器且 80/443 可达。数据库的 5432、平台 8082、Chromium 调试端口和内部静态资源端口不发布。

维护更新流程：在 `deploy/online/` 下执行 `./maintenance.sh on`，它会创建只读维护标记文件，平台无需重启即可返回维护状态并停止新增房间、匹配、邀请和再开局；等待当前活动对局排空后，再更新客户端资源与平台镜像。因为当前执行实例保存在平台进程内，平台进程重启会结束失去执行实例的进行中对局，服务端会明确报异常结束，不能伪装成无损恢复。更新完成后执行 `./maintenance.sh off`。也可以用 `.env` 中的 `ONLINE_MAINTENANCE=1` 作为始终维护的启动默认值。

数据库备份脚本为 `deploy/online/backup.sh`，默认把自定义格式备份写入 `/var/backups/noname-online`，保留 14 天并设置文件权限 600。恢复脚本为 `deploy/online/restore.sh`，要求显式设置 `CONFIRM_RESTORE=YES`，并在恢复前停止 platform 和 gateway；恢复后应先检查数据源，再启动服务。脚本只提供运维动作，不代表本轮已经执行过备份或恢复。

## 管理状态查询

通过网关查询时：

```sh
curl -H 'Authorization: Bearer YOUR_ADMIN_STATUS_TOKEN' https://game.example.com/api/v1/admin/status
```

把令牌放在命令历史中会留下本地记录，正式环境应使用安全的运维凭据注入方式。状态接口适合小规模人工检查和外部监控读取。管理写操作同样只接受 Bearer 令牌，并且通过网关来源校验；示例中的 `ADMIN_TOKEN` 代表部署环境中的令牌，不应写入客户端。

封禁账号会立即关闭其 WebSocket，后续会话认证返回 403；解封后账号可以重新登录。异常房间可由管理员关闭，正在运行的托管实例会被回收并向房间成员推送结束原因：

```sh
curl -X POST -H 'Origin: https://game.example.com' -H 'Content-Type: application/json' -H 'Authorization: Bearer ADMIN_TOKEN' \
  -d '{"reason":"违规行为","expiresAt":"2026-09-12T00:00:00Z"}' \
  https://game.example.com/api/v1/admin/accounts/ACCOUNT_ID/ban
curl -X DELETE -H 'Origin: https://game.example.com' -H 'Content-Type: application/json' -H 'Authorization: Bearer ADMIN_TOKEN' \
  https://game.example.com/api/v1/admin/accounts/ACCOUNT_ID/ban
curl -X POST -H 'Origin: https://game.example.com' -H 'Content-Type: application/json' -H 'Authorization: Bearer ADMIN_TOKEN' \
  -d '{"message":"检测到异常，房间已关闭"}' \
  https://game.example.com/api/v1/admin/rooms/ROOM_ID/close
```

首次部署前执行 `mkdir -p runtime`，使 Compose 的只读维护目录挂载到正确位置；`runtime/maintenance` 由 `maintenance.sh` 管理。平台启动会幂等执行已有数据库迁移，并登记第三阶段的密码房与封禁表结构。

## 用户验收清单

第三阶段仍由用户执行以下验证，当前全部标记为待验证：

1. 构建客户端并部署后，确认浏览器与平台使用 `online-phase3-v1`，旧构建收到明确版本不匹配提示。
2. 访问 HTTPS 域名，确认房间、好友、匹配、身份和斗地主仍走统一大厅；确认浏览器不再显示旧邀请链接输入弹窗。
3. 设为维护状态，确认新建/加入/匹配/再来一局被拦截，进行中房间可以继续和离开；恢复为正常状态后新对局可创建。
4. 重启 platform，确认等待房间和已结算房间仍可查询，活动对局收到明确失败状态；确认好友关系、账号和历史结算仍存在。
5. 使用管理令牌访问状态接口、封禁/解封账号和关闭异常房间，确认可以看到汇总指标并收到对应事件；使用错误令牌、URL 令牌和普通玩家身份均被拒绝。
6. 检查公网只能访问 80/443；数据库、平台、Chromium 和文件操作接口不能从公网访问；确认源码、扩展和环境文件路径返回 404。
7. 执行一次备份并保存到独立磁盘，再按恢复脚本说明在维护窗口验证恢复；记录备份时间、数据量和恢复结果。
8. 在桌面、手机窄屏、触控和键盘下验证大厅、匹配、好友、离房、恢复和维护状态没有遮挡；确认退出按钮仍在右侧，桌面退出可以完整关闭程序。

## 当前边界

公网可玩、服务器容量、TLS 证书、备份恢复和跨端体验没有本轮运行证据，必须以用户实际服务器日志和验收结果为准。当前部署仍是单平台进程和单 PostgreSQL 实例；平台进程重启不提供进行中对局无损恢复。当前匹配为单人匹配，好友组队通过私房邀请完成；没有旁观、段位、跨区域和扩展玩法。

## 交付后静态复核修正

针对第二、三阶段代码重新核查后，补充修正了以下运行质量问题：首次登录直接建立 WebSocket 时预置客户端构建标识；平台非 JSON 请求钩子仅约束确实携带 JSON 请求体的方法，保证无请求体的管理 DELETE 可用；房间串行回滚同时恢复席位控制代数和更新时间；托管实例异常清理统一消费失败 Promise，并在持久化短暂失败时保留重试路径；对外房间搜索继续只返回座位占用摘要；服务端缓存响应前重新验证实时会话；HTTP 非 JSON 网关错误转换为统一联机错误提示。以上修正没有改变扩展包范围，也没有运行测试、构建或公网验证。
