# 十周年局内 UI 迁移：当前实现与交接报告

2026-09-23 最新：用户限定的手牌上限、特殊标记与动效已补齐；其余由用户后续测试反馈。上限显示本体最近一次既有计算结果，未计算时为“—”，不会为刷新 UI 额外执行规则。针对性测试及边界见 [十周年局内 UI 补漏核验首节](decade-ingame-ui-audit-2026-09-23.md)，逐项资源用途见 [功能分类清单](decade-ingame-ui-feature-review-2026-09-23.json)。当前独立包为 216,604,232 字节，组合包为 507,759,765 字节；最终哈希及读写往返结果见 `dist/ui/decade-export-report.json`。正式清单含 1537 项，另有 files.json 自身。该限定范围交付不代表全部场景像素一致或全部设备验收。

## 上一轮交接记录（历史）

以下保留 09-22 的包大小、用户收束指示和当时验证状态，均不是本次最新交付结果；本次已恢复迁移及实测，不把旧记录当作最终验收。

日期：2026-09-22（Asia/Shanghai）。后续问题修复见 [如真似幻开始对局修复记录](decade-rzsh-start-fix.md)：直接从如真似幻进入十周年局内已实测通过；以下完整迁移的其它待验项目仍有效。状态：**代码和两个套装 ZIP 已交付，完整验收未完成，转由用户验证**。用户「由我验证即可，请收束」指示到达后停止浏览器/对局回归，仅完成包更新、清单和记录整理。旧日志中的通过标记不代表最终版本全部通过。

## 交付物与使用

| 交付物 | 路径 | 大小 |
| --- | --- | ---: |
| 独立局内套装 | `dist/ui/十周年局内 UI-UI套装.zip` | 72,993,794 字节 |
| 保留如真似幻大厅的组合套装 | `dist/ui/如真似幻＋十周年局内-UI套装.zip` | 364,149,261 字节 |
| 包哈希、生成时间、读写往返结果 | `dist/ui/decade-export-report.json` | — |
| 正式提供者 | `apps/core/extension/ui/十周年局内UI/` | files.json 列出 985 项，另有 files.json 自身 |
| 来源、资源哈希及许可 | 提供者 `SOURCE.json`、`LICENSE`、`MIGRATION.md` | — |
| 实际删除列表 | `docs/references/decade-ingame-ui/evidence/deleted-files.jsonl`、`deleted-stale-archive.json` | — |
| 工作区指纹与交付审计 | `docs/references/decade-ingame-ui/evidence/delivery-state.json` | — |

宿主要求是当前工程（本体版本 1.11.6）的 UI 工坊、受信任提供者登记、公共展示通知和头像可见性标记，不是任意旧客户端安装包。先运行本次工程，在 UI 工坊导入 ZIP 并应用。已有如真似幻方案可将「局内 UI 方案」切换为「十周年局内 UI」，保存即可保留大厅。动画、音效、动态立绘可独立关闭。工坊不执行 ZIP 中任意代码，运行程序来自宿主受信任提供者。

独立包 SHA-256：`ac69d61c2b331e6a2f6d0cf01836cd179f076c59d58acc55c29704269491dd58`。

组合包 SHA-256：`94f20082422e7efaf1f958c1bd66c2ba34c4e782ee512990180157fd492d62f9`。

## 实现范围和边界

新提供者保留本体操作节点、点击处理器、合法候选和可见性，只增补展示。未迁入来源技能、选将规则、卡牌规则、AI、游戏事件或联机流程，未覆盖这些引擎方法。扩展登记为当前合法 ESM 入口。

| 局内范围 | 来源/实现 | 当前边界与待验内容 |
| --- | --- | --- |
| 背景、字体、武将框、身份、体力、护甲、手牌数 | ol_bg、HYZLSJ、xinsha 框、shousha 身份、ol 体力，装饰本体节点 | 框比例和全部人数布局待逐场景对照 |
| 选将、双将、候选按钮 | dialog5、候选图框，本体 character 按钮 | 不创建候选或决定可选性；国战曾进行真实逻辑对照 |
| 卡面、卡背、手牌、出牌、弃牌 | gold 卡图、kb3、kuang1、card_select，本体 card 节点 | 自定义卡图、未知/多属性卡保留本体回退；未逐卡验收 |
| 装备、判定、标记、翻面 | judge-mark、player_mark、turn_over_mask_shousha | 保留本体数据和操作，特殊模式未穷举 |
| 技能、确认取消、提示、倒计时、菜单、托管、整理 | 原控制纹理、skill/shousha、lbtn/shousha，现有控件 | 事件入口不变；观星、普通/多人拼点未逐场景验证 |
| 目标高亮、攻击指示线 | 本体选中/目标状态、来源指示 Spine、线路样式 | 不自行计算合法目标或响应选择 |
| 开战、卡牌、技能、觉醒/限定/使命、伤害、判定、阵亡 | 公共展示消息、来源骨骼、配套音效 | 游戏流程不等待通知；各效果未逐一录制验收 |
| 动态立绘 | 来源可闭合骨骼的六名武将 | 只用公开头像标记；其余保留本体静态图，不是全武将动态皮肤库 |
| 胜负、结算 | 本体结果消息和统计表格，展示标题及样式 | 源十周年扩展无独立胜负界面资源，未导入其它扩展 MVP 评分业务；完整结算视觉待验 |

共用修正：本体粒子/散牌绘制和音频随机选取使用 `noname/util/displayRandom.js`，避免动画帧数消耗游戏随机序列；Spine 抖动使用私有展示随机流。未改洗牌、AI 或规则随机入口。卡牌展示通知补充公开颜色供红杀效果使用。手杀大厅释放函数移回资源所属作用域；如真似幻场景改用 `Object.hasOwn` 兼容本体现有无原型快照，生成器同步修正。最后修正未全部复验。

## 实际执行结果

环境：Windows、Node 22.23.2、本机 Chrome/Playwright、新建临时浏览器配置，无账号登录和远端房间操作。证据目录为 `docs/references/decade-ingame-ui/evidence/`。HEAD：`d59d8cf22b8c9dbcfff11bd2b665dfce54b1acab`，交付含未提交修改，不能仅用 HEAD 表示最终版本。

| 检查 | 实际结果 | 证据与限制 |
| --- | --- | --- |
| 工坊及迁移契约 | 当时 11/11 通过 | workshop-current-test.log；收束前新增展示随机源用例未运行 |
| 皮肤服务 | 14/14 通过 | skin-test.log |
| 合并皮肤和 presentation 测试 | 14 通过、1 失败 | skin-current-test.log；期望联网强制 shousha，实际 classic，未修改断言掩盖失败，需结合当前外观契约复核 |
| 两包浏览器导入、选将、托管推进首轮 | 较早版本实际成功 | browser-regression.json、single/combo-select.png、single/combo-play.png；最终包未重跑 |
| 如真似幻大厅 | 发现失败，修正待复验 | 旧测试只见 canvas 就标通过，不能接受该结论；combo-lobby.png 存在场景错误。无原型对象调用已修正并进最终包，加强断言后的验证未执行 |
| 连续三次启用/释放 | 当时通过 | browser-regression.json boundary：业务引用/状态不变，节点/样式/钩子残留为零；最终异步取消改动未重跑 |
| 动画失败、关闭、退出后恢复对局 | 已执行场景通过 | display-faults.json；通知快速返回，释放后画布为零，继续进入首轮；不代表所有超时和平台 |
| 隐匿武将/隐藏手牌 | 夹具部分检查通过 | display-faults.json：未请求隐藏动态骨骼、未添加阵营/卡面；卡名 visibility 不等于可见性（本体用 display:none），该细项断言未补齐；观战/录像未验证 |
| 默认/十周年可控随机真实对局 | 身份、国战、斗地主曾通过，对抗有差异 | logic-regression-public-rng.log；比较前六阶段体力、护甲、技能、手牌装备、随机状态。对抗有人工输入时序疑点，不能标通过 |
| 原子输入重跑 | 身份通过，其余按用户指示停止 | logic-regression-final.log、logic-regression.json；最后 JSON 仅含身份结果，不覆盖其它失败历史 |
| 独立联机窗口外观数据 | 浏览器传输夹具通过 | display-faults.json，实际 exportOnlineSkin/importOnlineSkin、临时 token、IndexedDB 恢复；不是原生窗口/服务器对局/重连验收 |
| 隔离构建 | 较早代码本体 desktop 构建成功 | isolated-build-final.log；不是完整 Electron/Android 安装包，后续公共随机源及大厅修正未再构建 |
| 最终 ZIP 生成与往返 | 两包完成 | export-delivery.log、decade-export-report.json，07:45 UTC；实际 writer/reader 两次读写清单相同，不等于最终浏览器导入通过 |

四张原始参考图及 source-contact/red-frames 等来源诊断图只用于追踪，不算新实现证据。没有完整动效视频和逐场景视觉签收。

## 来源独立性和实际清理

APK 仅由显式 `migrate-decade-media.py --source <APK>` 读取，提取媒体、纯字面量数据和绘图库，不执行来源扩展。日常 `decade-inventory.mjs`、导出和运行读取正式目录。`output/decade-validation` 无 temp/APK/琉璃来源：提供者实际复制，本体正式 image/audio 用硬链接独立目录项提供，工具依赖 node_modules 使用 junction。浏览器、构建和最终导出均不访问来源。此上下文保留供复查；其中构建产物是早期证据，不是最终客户端。

清理先核对当前程序/CSS/资源表、骨骼页、白名单和生成链，保留有效 original 媒体和纯绘图库。旧业务脚本的大量删除已存在于开工 179 项修改基线，不计为本次删除成果。额外实际删除：

- 2918 个退役重复媒体、原素材 ZIP 副本及旧手杀套装，共 3,243,437,527 字节；收束时原路径均不存在。
- 另删本次早期 `scripts/decade-browser-probe.mjs`，由正式浏览器/故障回归脚本替代，加入实际删除日志。
- 删除采用限定绝对路径、叶文件长度/SHA-256 校验和 PowerShell `-LiteralPath`；空目录确认无内容后移除。没有放入备份或仅排除打包。
- 保留原 APK、琉璃来源、temp、存档、不相关扩展、现代登记入口、有效大厅和必要绘图库/许可。
- 最终两包按实际 files.json 和提供者白名单导出，旧选择/兼容/工厂脚本不是输入。最新完整生成回归和全部安装资源扫描未完成，不能声称所有产物绝无残留。

候选理由与哈希见 deletion-candidates.json；实际结果见 deleted-files.jsonl、deleted-stale-archive.json。新提供者 SOURCE.json 是资源来源清单，files.json 是发行清单。原扩展许可文本保留，不推断商业美术和 Spine 的额外授权。

## 用户接手验证重点

1. 最终两包导入/应用/重新导出再导入，组合大厅加载、大厅字体菜单隔离。
2. 对抗逻辑差异、presentation 测试失败、完整胜负；各技能响应、装备判定、护甲、拼点/观星。
3. 不同人数、双将、移动窄横屏手牌和按钮遮挡；四图相近比例及其它来源局内状态逐项对照。
4. 真实联机窗口、断线重连、观战/录像隐藏信息、Electron/Android 路径/CSP/音频。
5. 最后随机源/异步释放/大厅修正后的构建和释放回归，其他皮肤全面回归。

没有远端发布、推送或部署。实现已覆盖局内主要展示面，但“全部局内内容完整保留”“外观完全一致”“所有平台通过”均无充分验收证据，本报告不作这些声明。
