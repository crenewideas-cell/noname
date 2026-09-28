# 源动作候选契约（2026-09-26 续接）

## 第四轮呈现与遮罩增量（最新）

全屏动作与头像画框已分离；最新范围1232皮肤/2108命令、代表性验证与限制见 [出框与遮罩契约](dynamic-skin-effect-viewport-contract.md) 和 effect-viewport-r04/effect-viewport-close.json。下方第三轮“尚未实现全屏容器”为保留的历史状态。正式安装仍未切换。

## 协议3增量（最新）

协议3接受由候选生成器核对源文件/安装资源身份的独立动作模型。主层隐藏绘制但继续计时；新sprite使用自己的位置/角度/速度/显示参数，首次请求加载，完成/打断后恢复主层，背景不中断。原生3.6和PIXI各自使用原有资产所有权；同资源的重复动作复用已加载骨骼，最多由声明的四类命令产生有限缓存。销毁中止在途加载并释放播放器资源。

源缺省动作规则直接依据 animation-renderer.js 的 skeleton.defaultAction=data.animations[0].name 和 playSpine 的默认选择。外部模型未声明动作时以及主层未声明返回动作时遵循此规则，不根据DaiJi/idle等名称推断。单元素动作列表只有一种选择，协议3允许它；多元素、条件切换及showTime仍不猜测。原始source字段保持不变。

外部动作的HIDE/恢复依据千幻聆音extension/content.js中EpicFX.playDynamicEffect2与完成消息流程；本轮实现的是头像容器内独立sprite候选，**尚未认证原全屏EpicFX的全局坐标、玩家锚点和出框画布**。图像可见裁切因此继续开放。不能把新动作支持称为全屏呈现已修复。

源命令通过events.js映射真实游戏事件；bridge按shan卡区分闪避与普通响应。显式entry.events优先，旧皮肤未公布source命令时沿用旧别名。实际游戏页面的入场、攻击到完成通知已覆盖；技能/闪避映射有单测，未逐个模拟全部局内情境。

最新范围与证据为external-actions-r03/external-actions-close.json、candidates-v3/impact.json；849皮肤/1680外部命令，全部运行时候选1246皮肤/2290命令。用户已明确无需全量验证，后续采用版本/格式/时序/生命周期/呈现类别覆盖，未测不冒充每条通过。下文协议1/2记录是此前增量历史。



本轮实现位于 `runtime/source-actions.js`，仅在条目明确携带 `scene.actionContract.protocol = noname-source-actions/1` 或 `/2` 时启用。正式安装没有切换。本契约是 G2/G3 候选实现，不是整条皮肤验收结论。

支持源 `chuchang/gongji/teshu/shan` 的明确字符串动作，或同一主模型、明确动作名且没有改变图层参数的对象。返回动作必须由主层源 `action/animation` 明确声明，不使用首动画或名称猜测。命令使用 `source:<字段>`，与骨骼原动作名分开。只切换主层轨道；背景、前景、坐标和取景保持当前源场景契约。

一次请求播放一次，随后返回声明待机并循环；即便事件与待机使用同一个动作名，也不会将事件误认成循环状态。候选过渡策略为持续时间末尾直接切换、无混合，明确属于候选协议，不冒称已认证全部来源的原生过渡。完成通知由轨道 complete/interrupt 产生，随实际播放速度、暂停和打断推进，不依赖墙钟定时器。出场尚未自动触发，真实游戏事件映射仍待后续接入。

协议2另支持同一模型且完整明确声明x/y/scale的动作对象，允许坐标、角度、速度、透明度、翻转和hideSlots覆盖；其他改变仍拒绝。对象字段使用原EpicFX独立sprite的缺省值（例如未声明angle=0、speed=1），不隐式继承头像参数。取景仍遵循已有源场景策略，本次不等于全屏EpicFX原生位置认证。动作速度改为逐轨道设置，返回后恢复源待机速度；动作结束、打断、重置恢复原图层参数，旧轨道回调不能清掉后来动作的参数。重置逐层恢复各自待机，不向所有图层广播主层动作；clearTracks也发出一次interrupted通知。

多动作选择、外部模型、不完整位置覆盖、遮罩等额外语义、未知字段、无明确返回动作继续逐项保留为 unsupported；不替换素材、不改大小写、不隐藏源错误。源配置 `Teshu` 而模型没有此精确名称的一条在浏览器中明确失败，尚未修订其源事实。

本轮已核对基础包全部已映射源层：clip、clipSlots、disableMask、outcropMask 没有启用值，hideSlots 涉及两个唯一条目。这不证明骨骼内部 clipping、运行时生成遮罩或其他来源的遮罩已通过；不能据此关闭文鸯裁切问题。原播放器中 clip 为画布坐标的 scissor，clipSlots 只在 outcropMask 路径生效，disableMask 控制骨骼内遮罩，三者不可互相替代。

证据位于 `output/dynamic-remediation/20260926-r01/continuation-actions-20260926/`。`impact.json` 保留4934条分母、全部分支与原因；`before-runtime/`是本轮开始时的三个已改源码字节，不能用 Git HEAD 替代。新增模块随条目显式开关启用，撤下候选覆盖即可恢复原路径。

用户最新要求优先修复、部分验证，最终统一回归。整类批次已据此停止，未测项和参考差异保留。独立4.0参考复用已验证的 Screen 显式适配；3.8使用固定历史参考；3.6 APNode仍共享本地读取器/栅格路径，其独立Java证据仅用于解析与几何，不冒称独立完整栅格认证。

第二轮证据在 `output/dynamic-remediation/20260926-r01/action-placement-r02/`，机器收尾为 `action-placement-close.json`。374候选皮肤/402命令中，独立动作参数覆盖影响23皮肤/43命令；比上一轮增加22候选皮肤。全4934静态动作记录2672条，其中418候选、2254仍未支持（包含无可用场景或武将歧义的记录，不能等同于运行时命令数）。51项单测通过；3.6/4.0/3.8三条五动作完成局部浏览器检查；只查看9张关键帧概览，仍存在源取景裁切。其余371条未做本轮回归；上一轮证据不自动覆盖本轮变动。before保存的是本轮起点，恢复前须检查最新哈希，不能用HEAD覆盖未提交修改。


## R05：稳态待机与保护取景

最新候选支持 viewport.policy=protected-idle-artwork：待机使用艺术画面坐标并保护主体，独立屏幕动作仍沿用原动作对象参数。显式declaredAction优先，否则选择DaiJi/BeiJing等稳态动作；各层playback.resolvedIdle作为缺省返回，显式returnAnimation仍优先。已有其它政策不改写。公共旧条目取景也独立验证，详见 dynamic-skin-idle-masks-contract.md 及 idle-masks-r05/idle-masks-close.json。
