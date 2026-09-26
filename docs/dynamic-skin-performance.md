# 动态皮肤性能优化与验证（2026-09-25）

本次基于已经验证的动态皮肤系统做性能优化。原千幻页面、皮肤排序/选择/默认存档、经典还原、静动开关、主副将、构图、自动动作、手动互动及语音路径继续沿用。没有增加操作面板，没有降低现有分辨率或帧率，没有改变原有局内最多四个动态播放器和本机优先规则。

## 改动

- `catalog-index.js` 为文件名、旧 `localdyn_ID.png` 别名和显示名称建立索引；皮肤信息的序号随索引生成，消除反复 `indexOf`。热查询只检查启用的扩展包状态，不再扫描全部皮肤。包启停、条目数组替换、增删会重建；直接原地修改元数据后可调用 `hub.invalidateCatalog()`。缓存仅保存元数据，不保留播放器或纹理。
- 千幻动态表复用索引快照及原生皮肤的合并结果，不在每次查询或每帧渲染时复制几千个条目。没有原生动皮的角色共享导入目录表。
- 现有手杀列表以集合匹配静动皮，排序键每项只计算一次；语音说明在访问时计算。缩略图先加载可见区域及相邻区域，并使用 IntersectionObserver 跟踪原生滚动、程序滚动和布局变化；卡片使用 `content-visibility:auto`。所有列表条目、原有选择和箭头逻辑仍然存在。
- 选择状态仅更新原卡片与新卡片，避免切一次皮肤改几千张卡片的 class。列表事件和缩放回调只注册一次，关闭时释放观察器、缩放监听及待执行定时器。
- 同源内嵌播放器直接克隆当前所选条目的元数据，不再各自下载和解析完整目录。独立打开、跨源或无法访问父框架时保留原目录读取方式，含 `file://` 的 XHR 降级。
- 按模型类型加载播放库；同类型的依赖并行请求、依次执行。Spine 4.2 不加载 PIXI、旧 Spine 和 Live2D；Live2D 不加载 Spine；旧 Spine 不加载 Live2D。Spine 4.2 的图集与骨骼二进制并行请求。
- Live2D 使用应用自身的 ticker，取消额外 shared ticker；口型采样复用缓冲区。画布尺寸没变时不重建尺寸。暂停/隐藏时停止更新，恢复时重新启动，显式暂停不会被页面重新可见覆盖。
- 局内 class 变更合并到下一帧刷新；互动和音量没有变化时不重复向 iframe 发送选项，就绪/重载时强制同步一次。

## 实测

环境：本机 Windows、Chrome headless、项目 Vite 开发服务、隔离浏览器存档。目录测试将一个真实 Spine 条目复制为 5,000 个不同名称/ID，验证目录规模和列表开销，**不代表同时载入 5,000 个不同模型或 5,000 张纹理**。

| 指标 | 优化前 | 优化后 |
| --- | ---: | ---: |
| 5,000 款完整列表首次构建并等待两帧 | 15,974 ms | 1,330 ms |
| 首屏导入皮肤缩略图文件检查 | 5,000 | 4 |
| 跳到末尾并切换相邻皮肤后的累计缩略图检查 | — | 12 |
| 关闭页面后新增缩放监听器残留 | 3 | 0 |
| 5,000 款目录下 1,000 次末尾查询 | 135.064 ms | 2.504 ms |
| 5,000 款目录下 1,000 次动态表读取 | 797.969 ms | 0.147 ms |

列表测试优化前后均能选择并渲染末尾皮肤；优化后还断言相邻箭头、缩略图加载、播放器不请求完整目录以及关闭清理。查询测量包含首次索引建立；具体耗时会随机器负载变化，不作为固定性能承诺。早先被热更新打断的浏览器测量不采用。

三类播放器逐类检查实际请求，只加载对应类型的播放库；同源内嵌模式没有 `catalog.json` 请求。播放器冷加载时间仍受模型、纹理大小、GPU、磁盘/网络影响，不将脚本减少量等同于帧率提升或零等待切换。

## 复现

开发核心服务默认 `http://127.0.0.1:8184`，文件服务 8089。浏览器脚本沿用 `NONAME_UI_TEST_ORIGIN`、`PLAYWRIGHT_MODULE_PATH`、`CHROME_PATH`。

```powershell
node --test scripts/dynamic-performance.test.mjs scripts/dynamic-samples-events.test.mjs scripts/dynamic-samples-framing.test.mjs
node scripts/dynamic-performance.mjs
node scripts/dynamic-performance-browser.mjs
node scripts/dynamic-catalog-browser.mjs
pnpm exec tsx --test scripts/skin-system.test.ts scripts/qianhuan-extension.test.mjs scripts/extension-organizer/registration.test.ts
```

`NONAME_PERF_SKINS` 可调整目录压力测试条目数。原始结果在 `output/dynamic-performance/`：`catalog.json`、`runtime.json`、`ui-before.json`、`ui-after.json`。本机保留优化前文件快照于该目录的 `before/`；只有提供这些快照后，才可执行 `dynamic-performance-browser.mjs --compare` 和 `dynamic-catalog-browser.mjs --before`。快照不随代码提交，不能用 Git HEAD 代替本次任务开始时已经存在的未提交代码。

功能回归沿用 `dynamic-samples-integration.mjs`、`dynamic-samples-framing.mjs`、`dynamic-samples-interaction.mjs az_9600141`、`dynamic-samples-local-player.mjs` 和 `qianhuan-dynamic-browser.mjs ingame`。构图本次抽查 `az_9600141`、`az_301290`、`nikke_c911_00`、`mjs_82e3407c03b9c525`，不扩大为逐套人工验收。

最终结果：上述功能回归通过，32 项原有皮肤/扩展注册测试及 10 项索引/事件/构图测试通过；三类播放器抽查共 70 个声明动作正常播放，暂停期间不继续绘制，恢复后继续绘制。鼠标、触屏、匹配语音、已有拖拽、自动事件、死亡释放、本机优先、隐将/经典还原及横竖屏复核通过。构图脚本的命中测试改为等待异步 idle 重置完成后重新计算命中点，避免复用前一个动作的坐标导致偶发超时。

修改后运行 `dynamic-samples-inventory.mjs` 与 `qianhuan-inventory.mjs` 更新安装清单。原模型、纹理、动作和声音资源不改动。EXE/APK 和 Android 真机不属于本次已验证范围。
