# 阶段 0：生产正确性修复与基线补充

日期：2026-09-14。源码起点：`919e48096`，分支 `04_FixUIAndBUG`。本次接续处理阶段 0 的生产启动、旧式 step 构建阻塞，并处理真实热启动中发现的扩展标识问题；阶段 1–8 未实施。

## 1. 修改与原因

### 普通生产构建的循环初始化

旧普通产物将 `GamePromises` 的 `import ... from "noname"` 改写成内部模块直连。公共入口同时重新导出这些模块，改写改变了循环依赖的访问顺序，产生 `Cannot access 'GamePromises' before initialization`。原失败及无埋点失败对照见 [原阶段 0 报告](performance-stage-0-report.md)。

`apps/core/scripts/build.ts` 在普通 core 构建中将 `noname` 自引用保留为 external，并通过 `output.paths` 指向实际的 `/noname.js`。仍生成公共入口，仍保留内部模块路径；公共联机构建的合并策略未改动。第一轮修复 smoke 已消除初始化错误，随后补上 `output.paths`，避免 HTML 将裸 `noname` 当作脚本 URL 请求。

这也符合 Rollup 对跨 chunk 循环重新导出可能影响执行顺序的说明，参见 [Rollup 源码](https://github.com/rollup/rollup/blob/master/src/Chunk.ts)；本项目结论以实际产物和浏览器复测为依据。

### 旧式技能步骤标记

独立包保持 `minify:false`，将 `treeshake:true` 改为 `false`，保留被 `StepCompiler` 从函数源码读取的 step 标记。原 `legacyRedo`、`legacyGoto`、跨步 result、async 和缓存身份断言保持不变。

`scripts/performance/semantics.ts` 另外保留旧 tree-shaking 策略为 `unsafeTreeShake`，与 `unsafeTerser` 分别作为负向对照：两个对照都必须检出旧式步骤变化，当前 source/buildSelf/buildIndividual 的正向用例必须全部通过。没有把当前构建的失败改成预期通过。

### 默认扩展热启动

首次默认扩展生产 smoke 的冷/热交互都完成，但热启动出现“红楼幻梦”导入失败弹窗，因此整条命令仍判失败。原因是实际目录为 `extension/红楼幻境`，扩展工厂和 info 却以“红楼幻梦”登记，旧开关恢复会把这个不存在的目录补入加载清单。

- 将扩展工厂、info、人物包分组键和默认资源路径统一为目录标识“红楼幻境”。展示文案和作者名不承担路径身份，保留原文。
- 在 `organizedExtensions.ts` 中将旧加载清单、登记历史和包选择中的别名迁移为真实标识，并合并重复项。
- 旧私有选项仅在目标键不存在时复制；保留旧键供回退。真实标识下已保存的开关优先，首次登记也保留明确的禁用选择。
- 新增别名去重、选项迁移、禁用优先、重复启动幂等、默认资源存在等回归。

没有修改技能结算函数，也没有靠关闭此扩展完成测试。修复后默认组合首次启动即加载其人物，冷启动人物总数相较原记录增加 1，不能把不同内容的耗时差当作纯性能收益。

## 2. 证据与环境

测试在本机 Chrome、隔离存档和只读测试文件接口中执行。8081 已有服务，故本次使用 `localhost:8082`；默认无网络/CPU 限速，1280×800。现有服务保留，不是受控真机或线上环境。

最终普通 core 产物：`output/performance/builds/2026-09-14T05-47-57-629Z/apps/core/dist`。其父目录保存 `build.json`、构建日志和源码副本；图片、音频、扩展仍由测试服务器只读挂载当前源码，不能把该目录当作可发布独立包。

| 证据 | 路径（相对仓库根目录） |
| --- | --- |
| 公共入口修复首轮 smoke | `output/performance/2026-09-14T05-41-57-139Z-production-minimal/` |
| 检出扩展别名失败的 smoke | `output/performance/2026-09-14T05-43-39-869Z-production-defaults/` |
| 最终构建 | `output/performance/builds/2026-09-14T05-47-57-629Z/` |
| 默认扩展正式生产基线 | `output/performance/2026-09-14T05-49-02-202Z-production-defaults/` |
| 精简配置正式生产基线 | `output/performance/2026-09-14T05-55-56-975Z-production-minimal/` |
| 默认扩展关闭采集复测 | `output/performance/2026-09-14T06-00-57-366Z-production-defaults/` |
| 独立源码/构建策略语义门槛 | `output/performance/semantics-2026-09-14T06-01-57-927Z/` |
| 工具单测 | `output/performance/tests-correctness-fix.log` |
| 登记与资源回归 | `output/performance/registration-correctness-fix.log` |
| 初次额外红楼规则检查 | `output/performance/identity-regression.log` |
| 修改前红楼规则隔离对照源码 | `output/performance/legacy-hlhj-control/` |
| 红楼规则修改前失败对照及用例比较 | `output/performance/legacy-hlhj-control.log`、`output/performance/legacy-hlhj-control-comparison.json` |
| 最终局部 ESLint | `output/performance/lint-correctness-final.log` |
| 产物静态体积及入口审计 | `output/performance/build-correctness-size.json` |
| 最终样本、错误和资源摘要 | `output/performance/correctness-final-audit.json`；两组目录下的 `analysis.json` |

所有 `output/` 证据均被 Git 忽略，需要单独保留。中间 smoke 不混入最终正式基线。

## 3. 指标口径

继续使用原来的合成双人身份局、固定随机种子、10 人一页、真实搜索/选将/手牌操作。每对使用新的隔离上下文：冷启动同时含首次登记与清缓存，热启动复用游戏保存的配置。两者不能作纯缓存对照。首对开启 CPU trace，所有对保存 HAR，详细配置和浏览器版本见各组 `environment.json`。

新增 `lobbyReadyWallMs`：使用测试进程单调时钟，从发起导航到大厅可操作并经过两次 rAF，包含生产 JIT 自动刷新。保留的 `lobbyReadyMs` 仅覆盖最后一个文档；不能拿它替代完整启动等待。旧样本缺少新字段，不回填或补成 0。

精简和默认扩展正式组各 20 冷 + 20 热，合计 80 次流程断言全部通过，均无 pageerror/弹窗，两条命令语义门槛通过且退出码 0。下表为默认扩展，随后单列精简组；每格为毫秒 `p50 / p95`，nearest-rank，每格 n=20；保留首对录制样本，不删除慢样本。

| 指标 | 默认扩展冷 | 默认扩展热 |
| --- | ---: | ---: |
| 导航到大厅（包含刷新） | 2725 / 3596 | 2034 / 2431 |
| 最后一个文档到大厅 | 2028 / 2795 | 2032 / 2428 |
| 模式到选将 | 2167 / 2747 | 216 / 529 |
| 打开人物库 | 533 / 1723 | 168 / 229 |
| 翻页 | 26 / 63 | 36 / 63 |
| 搜索 | 22 / 31 | 21 / 34 |
| 选将到首个合法操作 | 1588 / 1666 | 2577 / 2697 |
| 手牌选中 | 18 / 37 | 18 / 43 |
| 手牌取消 | 12 / 23 | 16 / 25 |

修复前普通生产构建无法进入大厅，没有可比的成功启动耗时；不能计算百分比提速。原开发组与本次的渠道、源码配置和加载内容不同，也不能直接相减。本轮验证了生产可启动和重复交互，未宣称达到全部流畅度预算：默认组人物库仍创建 2552 个按钮，字体、真实分页和后台任务优化仍待后续阶段。

| 指标 | 精简冷 | 精简热 |
| --- | ---: | ---: |
| 导航到大厅（包含刷新） | 1925 / 2496 | 1008 / 1778 |
| 模式到选将 | 202 / 344 | 101 / 215 |
| 打开人物库 | 77 / 125 | 61 / 104 |
| 翻页 | 18 / 25 | 47 / 68 |
| 搜索 | 17 / 23 | 11 / 14 |
| 选将到首个合法操作 | 1576 / 1596 | 1552 / 1569 |
| 手牌选中 | 38 / 49 | 35 / 65 |
| 手牌取消 | 19 / 27 | 20 / 30 |

两组全部冷样本均有 3 次文档导航，热样本均为 1 次。默认扩展观察窗口内长任务数中位数为冷 8、热 5；每个样本最大长任务的中位数为冷 682 ms、热 165 ms。资源条目没有因容量上限丢弃，但观察窗口仍只覆盖最终文档且不含尚未完成请求，不能把 Resource Timing 汇总当作跨刷新总下载量。完整导航请求应查看 HAR 和首对 CPU trace。

## 4. 验证结论与剩余问题

| 检查 | 结果 |
| --- | --- |
| 普通 core 构建 | 成功，保留模块路径，HTML 不再生成裸 `src="noname"` |
| 正式生产基线 | 80/80 流程通过，无 pageerror/弹窗；两组语义门槛通过 |
| 独立语义门槛 | source/buildSelf/buildIndividual 共 9 个正向用例通过；两个负向策略分别检出旧式步骤变化，退出码 0 |
| 关闭采集的默认扩展生产流程 | 冷/热各 1 次通过，确认采集 API 不存在，语义门槛通过，退出码 0；不作为开销统计 |
| 性能工具单测 | 6/6 通过 |
| 扩展登记、迁移、资源定位 | 11/11 通过 |
| 修改代码的局部 ESLint | 通过 |
| 额外红楼规则旧单测 | **18 项中 13 项失败**，5 项通过；本次整体验收不能写成无失败 |

额外运行的 `scripts/hlhj-regression.test.js` 存在不完整 mock 和断言失败，包括缺少 `game.broadcast`、`getHistory`、配置及异步测试结束后的 rejection。将测试与扩展入口恢复到 `919e48096` 的隔离目录后，同样 13 个具名用例失败，已保存逐项比较；因此这些失败并非本次标识/资源路径修复引入。没有改写这些规则断言来掩盖失败，红楼全部技能和联机正确性仍需单独处理、验证。

还有资源控制台错误：平台探测 `/preload.js`、`/theme/style/card`、部分扩展缺少 `info.json` 或卡图，以及“神州平板”引用 Android 本地路径。JIT 初次控制页面前还可能出现原始 TypeScript 的 MIME 错误并触发刷新，完整启动跨度已包含该过程。修复后的正式默认组未再记录“红楼幻梦”路径失败或扩展加载弹窗，但不能称所有资源无错误。

**本轮三项正确性阻塞已修复、生产基线已补齐；阶段 0 的本地核心检查通过，整体验收仍保留上述规则单测失败及外部待验。** 真机、线上响应策略、用户实际存档、完整扩展规则、联机/回放和长期运行未全面验收。它们不等同于字体和图片资源优化已完成；下一轮可按命令集推进阶段 1，同时保留独立规则测试待修项。

## 5. 复现和回退

```powershell
pnpm perf:test
pnpm exec tsx --test scripts/extension-organizer/registration.test.ts
$env:PERF_PORT = '8082'
pnpm perf:semantics
pnpm perf:build
# 将新构建打印的 PERF_ARTIFACT 填入 --artifact，依次执行，避免采样互相干扰。
pnpm perf:baseline --channel=production --scenario=minimal --runs=20 --port=8082 --artifact="C:/新构建/apps/core/dist"
pnpm perf:baseline --channel=production --scenario=defaults --runs=20 --port=8082 --artifact="C:/新构建/apps/core/dist"
pnpm perf:baseline --channel=production --scenario=defaults --runs=1 --collector=off --port=8082 --artifact="C:/新构建/apps/core/dist"
```

回退时只撤销本次差异：普通 core 的 external/paths、独立包的 treeshake、扩展标识和登记迁移。语义用例及旧失败证据建议保留，它们会如实检出恢复后的不安全构建。旧配置键仍在，不删用户存档，不使用全仓库 reset。本次未提交、推送或部署。


后续更新（2026-09-14）：此前 13 项旧规则测试失败已修正测试夹具及旧断言，未修改技能逻辑；后续阶段 1、2 已开发，验收按用户要求集中到最后。详情见 [阶段 1、2 开发记录](performance-stages-1-2-development.md)。本报告的原始基线与失败证据保留为历史。
