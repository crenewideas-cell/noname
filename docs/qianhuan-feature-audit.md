# 千幻聆音功能接入核对表

核对日期：2026-09-24。基线为用户提供的 `temp/千幻聆音.zip`（4.16.1.11），不是重新设计的皮肤页面。

## 武将切换结论

千幻通过接管核心的 `ui.click.charactercard`，让武将目录中的不同武将打开各自的千幻资料页。单个武将的手杀资料页没有“选择任意武将”的控件；底部卡片切换的是该武将的皮肤。原版支持拖动/触摸滑动，现有箭头原本没有绑定点击，适配时复用原滚动方法补齐，不新建控件。

源码证据：`extension/content.js` 中 `replaceCharacterCardFunction`、`qhly_open`、`qhly_open_new`；`theme/shousha/code/shousha.js` 中 `qhly_initShoushaView`。后者创建的“适用武将”“国服第一”节点没有绑定任意武将选择行为，不能把图案当成已实现的入口。

入口已纠正：武将按钮 → 原有目录 → 武将资料；皮肤按钮 → 最近查看武将的千幻皮肤页 → 原版返回到现有目录 → 选择其他武将继续看皮肤；珍宝阁 → 独立原版抽奖。此前把皮肤、珍宝阁都转到武将目录属于适配错误，已撤销。详情见 [大厅入口纠正](lobby-entry-repair.md)。额外选择武将按钮保持删除，没有恢复旧衣橱。

## 验收口径

- **已验证**：自动化操作实际入口或核心事件，验证结果与存档，不只确认函数存在。
- **保留待验收**：原程序已安装，但尚未覆盖该选项的全部分支，不能算完成。
- **待适配**：已确认有当前核心接口或渲染器差异。
- **外部依赖**：需要额外扩展、素材或可写文件平台；保留接口不等于提供了依赖。

## 主要业务链路

| 功能 | 当前状态与证据 |
| --- | --- |
| 两个大厅浏览不同武将 | 已验证：如真似幻、手杀原生目录分别进入小乔、界曹操、曹操；返回后继续浏览 |
| 武将技能、简介、标题、稀有度 | 补齐大厅未安装到核心的已导入包元数据；简介已验证。稀有度复用核心原始 rank 数据 |
| 静态皮肤列表、预览、设为默认、经典还原 | 已验证原版控件；点击卡片是预览，必须遵守原版“设为默认”语义，不能用预览结果冒充持久化成功 |
| 当前核心存档与皮肤服务 | 已验证双向兼容已有核心存档、原版回调写入核心、重载保留；不清空已有存档 |
| 大厅 PIXI、局内 DOM 主副将头像 | 已验证切换与还原；变更不修改武将身份、体力、技能等规则数据 |
| 局内资料入口和四种小窗 | 已验证十周年、手杀、经典、龙头小窗真实入口、选皮及关闭后保留；隐藏武将不增加泄露入口 |
| 收藏 | 原版选项读写核心收藏；关闭资料页后刷新两套大厅收藏；销毁的大厅不再接收刷新 |
| 技能配音 | 已验证共享武将语音映射、原版试听、核心 trySkillAudio 调用实际皮肤音频；增强音频不重复播放且返回音频对象 |
| 单条语音音量 | 已验证原版弹窗读取静音值 0；修正无效值判断与被大厅覆盖的问题 |
| 代码与战绩附加页 | 已验证原版简介下拉菜单入口；代码只读回退不依赖 CodeMirror，不改写正在运行的 subSkill |
| 自动换肤 | 已验证轮换和原配置关闭；修复单一可取消定时器、关闭和结算清理、无可选皮肤后继续调度 |
| 头像原版换肤按钮、角色 BGM、结算记录、MVP | 已验证真实 gameStart 安装主副将按钮、BGM 音频元素、game.over 写入主副将战绩及执行 MVP 回调；MVP 音频素材是否存在另外判断 |
| 12 种原版主题 | 已通过基础打开、人物信息、原版返回测试；统一调用 qhly_open 尊重经典怀旧，修复十周年定位和大厅稀有度数据 |
| 插件管理、随机皮肤、皮肤屏蔽、国战、露头、皮肤编辑 | 原实现保留，仍需各模式与写入流程专项验收 |
| 动态立绘、出框、动态调参、生成静皮 | **待适配**：当前新渲染器不是旧 decadeUI/duilib。旧玩家初始化覆盖不能直接启用。新十周年提供少量动皮素材，但尚未接入千幻动态选择与编辑链路 |
| 联机、录像、移动端安装包 | **待验收**：普通浏览器离线局内通过不代表这些发布与运行场景通过 |

## 原版配置完整清单

按 `extension/config.js` 的实际对象属性核对：75 项，其中 8 项为分组标题，67 项为选项或操作。注释中的 `qhly_recordWin`、`qhly_audioPlus` 不计入正式配置；增强音频内部路径仍做兼容验证。以下使用原配置键省略 `qhly_` 前缀，分组内不删除任何有效项。

| 原版分组 | 全部有效配置键 | 接入/验收范围 |
| --- | --- | --- |
| UI 设置 | currentViewSkin、layoutFitX、layoutFitY、vMiddle、fontsize1 | 主题入口和自适应已适配；拉伸遵守原设置；字号/居中所有组合待验收 |
| 功能设置：资料与入口 | replaceCharacterCard2、nolihuiOrigin、smallwiningame、smallwindowstyle、dragonsize、forbidExtPage、dragonlocation、smallwinclosewhenchange、titlereplace | 原资料卡默认恢复为 info，保留用户明确选择；四小窗与附加页已测；其余细项待验收 |
| 功能设置：皮肤行为 | randskin、extcompat、lutou、lutouType、skinButton、showrarity、name_pattern、dragButton、dragButtonPosition | 全部原逻辑保留；头像按钮与拖曳入口接入；随机、露头、任意第三方扩展包仍需专项回归 |
| 功能设置：声音与资源 | notbb、notbb_range、originSkinPath、extSkinPath、autoChangeSkin | 已接通皮肤/配音资源发现、静态索引降级、自动轮换；防啰嗦范围组合待验收 |
| 功能设置：页面与对局 | listdefaultpage、doubledefaultpage、guozhan、skinconfig、editmode、skillingame、keymarkopen、chooseButtonOrigin、mvp | 尊重原入口默认页；编辑模式、国战和选将原皮待专项回归；MVP 结算路径纳入测试 |
| 十周年及手杀专用 | decadeCloseDynamic、close_circle_top、playerwindow、formatDS、editDynamic、noSkin、dom2image、decadeDynamic、decadeChangeEffect、guozhanDS、decadeDengjie、decadeAuto、shoushaTexiao、ignoreClips | 原配置与实现保留；decadeAuto 接入轮换；动态渲染、出框、编辑、静皮导出及其联动不能标记为完成 |
| 音效设置 | closeVoice、currentMusic、enableCharacterMusic、modemusicconfig | 点击音效、全局/角色/模式 BGM 原路径保留；角色 BGM 实际音频元素纳入测试 |
| 水墨龙吟 | hanggaoxiufu、hanggaoxiufu2、shilizihao、lihuiSupport、hideShuimoCover | 原主题与选项保留；页面基础开关验收，排版组合及独立立绘素材待验收 |
| 海克斯科技 | lolhanggaoxiufu、lolhanggaoxiufu2、lolshilizihao | 同上，保留原主题布局和设置 |
| 兼容性 | funcLoadInPrecontent | 已适配：当前大厅需要提前初始化，即使旧开关关闭也只初始化一次，不等到局内才可用 |
| 其他 | clear、restore、plugin | 保留原清空、恢复官方设置、插件管理；涉及实际文件删除/恢复的完整平台流程未作为本次浏览器用例执行 |

## 五个原版附加页插件

| 插件 | 依赖与当前状态 |
| --- | --- |
| 代码（code_999888） | 独立可用，原菜单已验证；缺少 CodeMirror 使用只读文本框 |
| 战绩（record_999888） | 独立可用，原菜单已验证；结算记录由核心 onover 触发 |
| AI（ai_777213231） | 原判断要求启用 AI优化；本项目未提供此依赖，不伪造可用入口 |
| DIY 编辑（diy_editor_123456） | 要求 DIYEditor 和其 openCharacterCard/写入能力；尚未安装适配依赖 |
| 特效（eff_999888） | 要求特效测试扩展、txcsanm 对象和对应开关；尚未安装适配依赖 |

动态部分另含皮肤切换、EpicFX、EngEX 等可选联动分支。它们不是千幻 ZIP 自带的完整依赖，不应自动复制旧 UI 的整个核心补丁来冒充兼容。

## 后续阶段必须交付的内容

1. 动态渲染适配：把千幻选择、待机/背景/出框、动静切换、主副将、隐藏/变身生命周期接到当前渲染器；提供真实素材验收，避免两个渲染器叠画。
2. 编辑与导出：皮肤元数据、语音文本、动态参数、生成静皮的原版操作，验证写入位置、失败反馈、重启后读取；按目标运行平台补齐文件接口。
3. 模式与联动：随机/禁用、自动轮换、国战、联机与回放；第三方附加页仅在依赖安装且验证后标记完成。
4. 发布验收：安装包素材完整性、手机触控、不同分辨率和性能。资源缺失与功能未接通分别记录。

本表用于防遗漏；保留代码和配置不代表已完成“全部功能接入”。不能再把主页面可打开、能换一张图作为整个迁移的验收结论。

## 可复现验证

- `node scripts/qianhuan-browser.mjs rzsh shousha ingame static small`：真实大厅、局内、静态文件服务降级及小窗流程，报告 `output/qianhuan-native/report.json`。
- `node scripts/qianhuan-features-browser.mjs themes gameplay`：全部主题基础页面与实际 gameStart / 自动换肤 / BGM / game.over，报告 `output/qianhuan-features/report.json`。
- `pnpm exec tsx --test scripts/extension-organizer/registration.test.ts scripts/skin-system.test.ts scripts/qianhuan-extension.test.mjs`：注册、皮肤服务、文件访问与降级。

浏览器使用隔离存档。源码来源、改动哈希、资源维护流程见 `qianhuan-skin-migration.md` 与安装目录 `SOURCE.json`。

本轮结果：5 个主流程场景、12 主题和 gameplay 场景通过，报告页面异常数为 0；32 项注册/皮肤服务/文件访问测试通过。上述结果不覆盖标为待适配、待验收和外部依赖的项目。
