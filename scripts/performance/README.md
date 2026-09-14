# 阶段 0 性能基线工具

在仓库根目录执行。依赖已有 pnpm 工作区和本机 Chrome；默认独占 `http://localhost:8081`，端口占用时直接报错，不终止已有服务。测试启动自己的只读文件接口，不要求另启文件服务器。依次运行，避免并行构建、测试影响性能采样。

```powershell
pnpm perf:test
pnpm perf:semantics
pnpm perf:baseline --scenario=minimal --runs=20
pnpm perf:baseline --scenario=defaults --runs=20
pnpm perf:baseline --scenario=minimal --runs=1 --collector=off
pnpm perf:build
# 可选：在隔离副本内恢复 4 个埋点文件为 HEAD，用于判断故障是否由本次埋点引入
# 注意：这是整文件恢复。若文件还含其他未提交改动，它们也会从对照副本中移除；
# 先检查副本差异，不能把存在其他差异的对照称为“仅移除埋点”。工作区文件不受影响。
pnpm perf:build --without-instrumentation
# 把构建打印的 PERF_ARTIFACT 路径填入下面参数
pnpm perf:baseline --channel=production --scenario=minimal --runs=1 --artifact="C:/完整路径/apps/core/dist"
# 把采样打印的 PERF_REPORT 目录填入下面命令
pnpm perf:report "C:/完整路径/采样目录"
```

`CHROMIUM_PATH` 可指定 Edge 或其他 Chromium 可执行文件。`--port=8081` 可改端口；独立语义命令使用环境变量 `PERF_PORT`。默认浏览器 headless，版本、CPU、内存和网络条件写入 `environment.json`。每个 pair 使用新的隔离浏览器上下文；结束后自动关闭测试浏览器和服务，不读取用户日常浏览器数据。

## 指标与配置

- `minimal`：明确标注的精简对照，只启用 standard 人物/卡牌，不启用扩展；不代表优化成果。
- `defaults`：本仓库首次登记时的默认扩展组合，实际启用列表写入每个样本；不代表用户真实存档。两种场景都使用合成双人身份局，已确认 GPL、跳过教程、10 人/页、显示全部人物、开启自由选将、关闭出牌自动确认。固定随机种子；配置初始化仍会改变候选和牌堆。
- `cold`：新上下文、清空 HTTP 缓存后的首次启动；`warm`：同一上下文保留刚才游戏写入的配置后重新导航。**缓存、首次登记与恢复配置同时变化，二者差值不能解读为纯缓存收益。** Vite 磁盘依赖缓存、操作系统文件缓存不清空。
- 大厅就绪：模式按钮可操作，经过两次 rAF 后的 `performance.now()`；不是全部图片/字体完成，也不是 LCP。发生自动刷新时它只覆盖当前文档；新脚本另存导航次数和整个流程 wall time，不能用最终文档时间代替跨刷新启动时间。
- 交互：真实 pointerdown/keydown 到断言状态成立并经过两次 rAF 的时间，包括业务动画和测试轮询成本；这是呈现机会近似值，不是精确绘制时间或 INP。搜索测量从 Enter 开始，不含输入文本耗时。选将到首操作从最后一次选将确认开始，不含人为停留。
- 每组第 1 对保存 CDP CPU trace，其余只采集 HAR/PerformanceObserver；`traced`、首次服务器导航有独立标记。录制可能显著放大开销，比较时保持条件一致。每组 20 个样本按 nearest-rank 计算 p50/p95；不足 20 个时 p95 为 null。
- `passed` 仅表示交互断言通过。错误仍保存在样本中；新脚本另标 `runtimeClean`，页面异常/弹窗导致命令失败，普通控制台错误需结合 HAR 分类审查。

## 输出与复现

`output/performance/<时间>-<渠道>-<配置>/` 保存 `summary.json`、环境、种子配置、源码基线 commit、工作区哈希、tracked diff 和每对的 `cold/warm.json`、截图、HAR。首对另有两份 `.trace.json`，可用 Chrome DevTools Performance 的 Load profile 打开。HAR 不保存响应正文。

新版脚本另复制 untracked 源文件到 `untracked-source/`。早期正式 dev 样本只保存 untracked 内容参与的哈希，未复制内容；相关工具随后有清理和输出字段补充，详见阶段报告，不能声称早期目录包含完整源码快照。`output/` 被 Git 忽略，需连同报告备份原始目录，不能只提交 Markdown 就丢弃证据。

`analysis.json` 汇总完成资源的传输字节、请求失败、慢阶段、长任务和最大资源。资源观察条目上限 2048，丢弃数有记录；发生丢弃时汇总只代表保留窗口。Resource Timing 不含导航文档和未完成请求，缓存 transferSize=0 不代表资源体积为 0。长任务观察器在引擎模块执行过程中初始化，最早静态依赖执行可能不在观察窗口；首对完整导航应查看 CDP trace。`boot.function` 包含等待用户选择模式的时间，阶段互相嵌套，不能相加当 CPU 耗时。

## 采集开关与兼容

仅 `?perf=1` 启用应用采集。无参数时无观察器、轮询或全局 API；保留少量函数分支/闭包调用，未宣称绝对零成本。每类最多 2048 条、计数器最多 128 种；`window.__nonamePerf.snapshot()` 导出，`.stop()` 断开观察并停止记录。开启时 Promise 包装增加一个微任务，用于诊断；不作为与历史未埋点版本无条件等价的性能结果。

采集单测覆盖关闭行为、Promise/异常传递、环形缓存、停止后不再增长及缺失观察器回退；另有 Vite 构建不污染后续 dev 进程环境的回归。基线 `--collector=off` 运行同样交互并验证全局 API 不存在；关闭采集不再输出观察器指标。

## 构建和语义门槛

`perf:build` 在独立源码副本执行当前正常 core 构建，不覆盖工作区 dist。大体积 image/audio/extension 由测试服务器只读挂载；pnpm 依赖链接仍指向当前安装，所以它不是可发布的独立产物。生产服务器使用未压缩 `max-age=0/ETag`，不能代表真实部署响应策略。正常生产产物的 import map、JIT Service Worker 和自动刷新都保留。

语义测试从真实 `apps/core/scripts/build.ts` 提取 `buildSelf`/`buildIndividual` 的 minify、treeshake 设置，实际通过 Vite 构建最小 fixture，再交给真实 GameEvent/StepCompiler 执行。覆盖 step/goto/redo/跨步结果、async 和编译缓存。默认 Terser 是必须暴露错误的负向对照。

**当前 buildIndividual 的两个旧式 fixture 失败，命令退出码 1 是已发现的正确性门槛失败。** 不要为了让基线“通过”改成预期通过或忽略退出码。构建策略 fixture 不是完整技能、扩展或联机回归；完整生产流程失败也必须单独保留。阶段 0 负责记录证据，后续修复需重新运行这道门槛。
