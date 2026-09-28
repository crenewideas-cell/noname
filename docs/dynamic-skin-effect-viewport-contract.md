# 出框动作、取景及遮罩候选契约

2026-09-26 第四轮。机器入口：`output/dynamic-remediation/20260926-r01/effect-viewport-r04/effect-viewport-close.json`。冻结4934/优先4895/暂缓39/删除0不变；源码候选未正式安装。

## 两套画框

`bridge.js` 创建头像播放器时提供 `createEffectHost` 能力。已有源动作协议中的 chuchang/gongji/teshu，若引用外部模型或明确声明同骨骼模型对象，交给独立的透明屏幕 iframe。普通字符串动作名、shan 保留已有头像行为。无父宿主的裸播放器仍使用前轮局部动作控制器；不能据此把单独打开的 player.html 当成全屏验收入口。

头像背景、主体骨骼和时钟保留原位；屏幕动作不继承头像的 height/180 相机、view 缩放或裁切。父容器使用 Chrome manual popover 顶层，避免头像祖先 overflow 与 transform 截断；iframe 和遮罩 backdrop 均不接收鼠标输入。每个宿主至多一个活动动作，请求 supersede、reset、dispose、失败均有一次结束通知并清理资源。首帧前保留头像主层，首帧后隐藏其绘制，动作轨道完成时恢复。暂停随主播放器传递；结束不使用墙钟动画定时器。

每次创建独立播放器并于结束释放，尚未跨动作缓存 WebGL 资源。现有资源 URL 和浏览器缓存仍复用；多人并发性能、进入/退出浏览器原生全屏时的顶层顺序留待最终集中回归。

## 屏幕坐标来源

来源为 `apps/core/extension/ui/千幻聆音/extension/content.js` 的 `EpicFX.playDynamicEffect2`（约658—770行）及 APNode 坐标公式。位置为屏幕 CSS 像素、Y向上；DPR只控制栅格，不再次乘入逻辑位置/比例。

- 本机攻击/技能保留动作对象的 x/y；未声明位置为画面中心。对手攻击/技能使用左侧0.4/右侧0.63与y=0.5。
- 非对局预览的攻击/技能比例使用源 `offsetHeight * .0035`，不叠加头像 height/180；DOM矩形只用于映射屏幕锚点。
- 本机出场为玩家水平中心和顶部。其他出场复用来源 `getPlayerPos(false)` 后再加半个宽度，实际锚点为右边缘/垂直中心；明确记录这个来源细节，没有按每皮肤修正。
- 原全屏路径清除 angle，因此此屏幕适配器的 angle=0。精确动作名与 source 配置继续保留；不会照搬旧代码硬写 gongji/jineng/play 导致模型缺名的行为。
- 同骨骼显式对象重新编译自己的缺省值，不继承头像 speed/scale/hideSlots。单元素 action 数组使用协议3已解析的唯一动作。骨骼 skin、opacity、flip、hideSlots 保持其声明。

这是带明示规则的来源适配，尚非对所有素材的独立像素认证。动作可以延伸到屏幕边界外；屏幕边缘裁切和头像误裁不是同一问题。此轮未采用逐皮肤比例补丁。

## 遮罩时序

旧 PIXI 路径在 Spine.update 完成后才把 hideSlots 附件清空；这一帧的显示节点已经生成，下一帧动画 attachment 时间线又会恢复附件，造成连续漏画。`source-masks.js` 在 AnimationState.apply 之后、PIXI 构建 sprite/mesh/clipping 之前临时清空命中的附件引用，update 的 finally 恢复原引用。没有调用会重置 deform 的 setAttachment。

hideSlots 按完整附件名比较，字符串与数组均支持。骨骼内部 clipping 继续正常生效：隐藏被裁部件仍结束该槽位的 clip，之后的图层不会被误裁；隐藏 clipping 附件只影响它定义的裁切，恢复时按骨骼继续工作。外部 clip、clipSlots、disableMask、outcropMask 不混同，未支持的契约没有偷偷放开。

## 证据与边界

静态可达影响1232皮肤/2108命令：1680外部模型命令与428显式同骨骼命令。`impact.json`列出准确ID/命令。候选仍为上一轮1246皮肤/2290命令，没有生成新的排除清单。

- `browser-final/report.json`：6皮肤12动作，Windows Chrome，3.6/3.8/4.0、JSON/二进制、DPR1/2。实际头像外像素、顶层隔离、窗口改变、完成、加载中重置、活动重置、失败重试和活动销毁均通过。三条PIXI 样本连续两帧 hideSlots 清空及还原像素数量一致。
- `masks-v2/report.json`：3.8.99/4.0.56确定性区域与骨骼clip夹具，按解析几何应分别有9600/6400/12800个像素；两后端相符，包括隐藏结束槽位及恢复遮罩。属于小型独立几何断言，不冒充全库遮罩正确。
- `game-events-v1/report.json`：真实游戏页面主动触发两个事件，经真实 hub 和播放器进入屏幕层，完成后主体恢复，错误0。不是耐久/自然事件全覆盖。最终掩码字符串规范化及删除未使用清理语句后，又以browser-final/masks-v2验证。
- `unit-tests.txt`：65通过。浏览器最终快照和当前运行时哈希一致。

原文鸯静态/待机构图、部分源多层注册、复杂/生成遮罩、随机条件/变身/showTime、22条明确资源或动作失败、跨后端、多人并发、安装发布与最终集中回归继续开放。云涯文鸯本轮确认的是两个动作不再被头像裁断，不能据此关闭原3条反馈。

回退先撤候选路由。`before/`保存本轮开始时的已有文件，恢复前核对最新收尾哈希并保留后续改动；新增模块/工具列在收尾清单。不要用 Git HEAD、reset/clean 或目录整体覆盖代替这个增量回退。


## 第五轮后续（优先于以上历史剩余项）

idle-masks-r05 已补齐公共待机构图和复杂PIXI剪裁修复，文鸯三条以及用户新增神荀彧截图完成候选路径复核；6皮肤12屏幕动作重新回归通过。复杂clip/region切换、凹形、加权、deform、drawOrder、嵌套和恢复有独立像素证据，外部遮罩契约仍未放开。最新范围、未测项与回退见 dynamic-skin-idle-masks-contract.md；正式安装仍未切换。
