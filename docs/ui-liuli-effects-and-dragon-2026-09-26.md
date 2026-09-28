# 琉璃出牌幻影、自动互动与盘龙边框

## 实现

- 手杀 `native/card-phantom.js` 参照琉璃版 5.5 `史诗卡牌/cardPhantom.js` 的 `phantom4`：两层卡牌副本，透明度 0.5/0.3，延迟 50/100 ms 跟随，460 ms 移动并淡出。观察本体已抛出的公开卡牌，不替换 `$throw`，副本不进入 `ui.thrown`，不接受点击。隐藏牌、比较展示、低性能、关闭动画及减少动态效果时不创建幻影；页面隐藏、卸载和原牌移除时清理。最多同时保留 24 组。
- 自动互动完整迁移 `祖安武将/extension.js` 实际生效的六组规则，具体对应关系及本次复核见下文。由本体 `GameEvent.trigger` 发布不可变快照，共用宿主回礼服务处理；即使没有游戏技能订阅该触发点也能收到通知。移除此前额外添加的 1.2 秒自动互动冷却、80 条上限和开场单次缩减。独立随机源保留原版概率，不占用游戏规则的随机序列；联机、录像、旁观及结束后不触发，卸载时取消待执行任务。
- 手杀「对局外观」新增默认开启的「琉璃出牌幻影」「自动送花与砸蛋」「表情自动回礼」三个开关，配置沿用 `ui_workshop_shousha_settings`。
- 如真似幻采用共用十周年局内展示。将 `.decade-frame::after` 的红色盘龙替换为金玉浮雕；保留 55 × 187 CSS 像素的原位置和阵营配色，原红龙文件保留。共用这套局内边框的十周年 UI 同步获得新素材。
- 新程序和素材已登记进资源清单及提供者打包白名单。

## 美术

使用内置 `image_gen`，以原 `new_border_camp.png` 为编辑参考，输出保留透明通道。

项目素材：`apps/core/extension/ui/十周年局内UI/assets/image/styles/xinsha/dragon-jade-gold.png`

最终生成提示词：

> Edit target: the attached narrow vertical Chinese dragon game UI ornament. Redesign this same single slender S-shaped dragon into a breathtaking refined imperial Chinese relief ornament: sculpted champagne gold, antique bronze shadow recesses, delicate pale gold scale engraving, small restrained turquoise jade accents, graceful swept horns, expressive noble dragon head at upper right, elegant long tapering tail curling down to bottom right. Premium hand-painted realistic fantasy game UI metalwork, sharp silhouette, subtle highlights, not cartoon. Preserve the exact overall composition and tall narrow aspect ratio of the reference (about 110 wide by 380 high): head confined to top 20%, sinuously curved narrow body hugging left edge and flowing down, mostly transparent interior/right side so game character names remain readable. Entire single dragon fully visible, no rectangular frame, no extra objects, no lettering, no background, no drop shadow beyond silhouette, actual transparent alpha. Render at high resolution suitable for scaling to 55 x 187 CSS pixels. Do not add a second dragon.

## 验证

- `node --experimental-vm-modules --test scripts/shousha-effects.test.mjs scripts/ui-health-presentation.test.mjs scripts/ui-extras-presentation.test.mjs`：16 项通过。
- `scripts/shousha-presentation-regression.mjs`：实际选将、出牌、界面开关、窄横屏、本体 AI 进入第二轮通过，无脚本报错或手杀资源缺失；切换界面前后规则状态、牌堆和回调不变。
- `scripts/shousha-effects-browser.mjs`：真实 `$throw`、双层延迟、副本不可交互、丢弃队列不变、到时清理、减少动态效果和卸载清理；如真似幻清单加载新边框，检查桌面与窄横屏。证据位于 `output/ui-effects/`。
- `scripts/decade-ingame.test.mjs` 的原始媒体字节校验受 Windows CRLF 影响：`RWJGD_xiao.atlas` 本地 1497 字节，清单 1400 字节；归一化 LF 后字节数和 SHA-256 均与原清单一致。该文件本轮未改动。新素材清单一致性检查通过。

本轮修改源码和素材，未重打包已有桌面或 Android 安装包。

## 自动互动补全复核

原迁移取用了已被后续赋值覆盖的砸蛋规则，漏掉送酒、多点伤害和击杀分支，且分散的 content 通知没有完整表达原触发点。现将这些临时通知移除，统一接入本体触发入口。手杀提供者仍只安装一套宿主服务，不导入旧扩展的技能、原型替换或其它功能。

| 琉璃版实际规则 | 触发与行为 |
| --- | --- |
| `_emojiRebate1` | `recoverAfter`、`dying`、`gainAfter`、`turnOverAfter`；保留 70% 总过滤、来源不能为空或为自身、救援 `_save` 祖先、朋友/敌人判断和赠牌至少两张的条件。低血救援按原血量概率连送九朵花加一杯酒，濒死按原概率连送九个蛋加一只鞋，间隔 100 ms。普通回复不会被误当作救援。 |
| `_emojiRebate2` | `gameDrawBefore` 和 `enterGame`；按 `0.3 / 其他人数` 概率触发，保留 `10 + ceil(10 × random)` 轮鲜花及最后一轮酒，初始 0–500 ms、目标间 3 ms、轮次间 `其他人数 × 15 ms`。 |
| `_zuan_sendWine` | `phaseUseBegin`：双方好感为正、手牌大于五张，概率为手牌数 / 15；`useCard`：使用酒、体力大于零且不等于一，双方好感为正，70% 送酒。 |
| `_zuan_damageSendEgg` 最后一次定义 | `player: damageSource` 的 player 是受伤者。受伤 AI 对来源好感为正，且无 `maixie` / `maixie_hp` 标签，50% 回砸鞋或蛋。没有使用前面已失效的 `global: damageEnd` 定义。 |
| `_zuan_damageSendFlower` | `global: damageSource`：伤害大于一点，敌方受伤、友方造成，概率 `1 - 1 / 伤害点数`，向伤害来源送花。 |
| `_zuan_killSendFlower` | `dieBegin`：敌方死亡，友方击杀，80% 送花。原技能读取的是技能事件的 `event.source`（正常为空），实际回退到 `trigger.getParent(3).player`；迁移保留这一实际行为。 |

自动服务只处理在场、非真人控制的本地 AI，待执行投掷会复查对局、开关及人物是否仍在场。原版概率不改成必定触发。开场发牌事件的 `num` 可以是函数，快照仅在伤害触发时复制数值，避免序列化失败导致开场通知丢失。

验证记录：

- `scripts/fixtures/liuli-auto-emotions.js` 保存原版规则原文，仅作测试对照，包含两次同名赋值；运行时不依赖 `temp`。`scripts/shousha-effects.test.mjs` 执行原文和迁移服务，对照 340 组条件/随机分支的发送者、目标、表情、数量和时间，并检查取消、托管排除及无技能订阅的真实 trigger 方法。
- `node --experimental-vm-modules --test scripts/shousha-effects.test.mjs scripts/ui-health-presentation.test.mjs scripts/ui-extras-presentation.test.mjs`：13 项通过。
- `node scripts/shousha-emotions-browser.mjs`：独立 Chrome 存档，手杀 UI、本体真实事件与 Player 操作，十个阶段全部通过：开场、友伤、多点伤害、赠牌、使用酒、出牌阶段、翻面、中途入场、濒死救援、击杀。只固定测试中的表现随机数，不调用展示总线伪造通知，也不替换投掷渲染器。
- 实测开场 176 朵花 + 16 杯酒、中途入场 44 朵花 + 4 杯酒、救援九朵花 + 一杯酒；蛋、花图片已加载且有可见尺寸，截图与逐事件记录位于 `output/ui-effects/emotions/`。无互动脚本异常或表情素材缺失；浏览器仅有已有的桌面 `preload.js?import` 404。
