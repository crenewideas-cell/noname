// Extracted from character/dragon.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
		},
"characterSort": {
			dragon: {
				dragon_init: [ 'jsrg_simazhao']
			},
		},
"characterIntro": {
			wangjing: '字彦纬，冀州清河郡人，三国时代曹魏大臣。农民出身，因得到同乡崔林的赏识，被提拔任官。其母说他太快出头会不吉利，但他平步青云，历任江夏太守、雍州刺史。正元二年(255年)，蜀将姜维攻入陇西郡时，他率军出狄道城迎击蜀军，却被击败。被包围在城中，陷入穷途末路的境况。幸亏得到大将陈泰和邓艾的援助，合力击破姜维，才脱险。此后，他被朝廷召回。不久迁司隶校尉、尚书。甘露五年(260年)，魏帝曹髦召见王沈、王经、王业，提出进讨司马昭的计划。王经进谏，但曹髦不听；王沈、王业向司马昭告密，王经不从。司马昭弑君后，王经因未向司马昭告急，而和其母一同被逮捕并被处死。',
		},
"characterPrefix": {
			mb_sp_guanqiujian: '玄',
		},
"translate": {
			mb_caomao: '手杀曹髦',
			mb_caomao2: '手杀曹髦',
			mb_caomao_ab: '曹髦',
			mb_caomao2_ab: '曹髦',
			mbqianlong: '潜龙',
			mbqianlong_info: '持恒技，游戏开始时，你获得20点道心值。当你得到牌后你获得5点道心值；当你受到一点伤害后，你获得10点道心值；当你造成1点伤害后，你获得15点道心值，你的道心值上限为99，你根据你的道心值数量视为拥有以下技能：25点〖清正〗，50点〖酒诗〗，75点〖放逐〗，99点〖决进〗。',
			mbcmqingzheng: '清正',
			mbcmqingzheng_info: '持恒技，出牌阶段开始时，你可以弃置1种花色的所有手牌，并观看一名有手牌的其他角色的手牌，你弃置其中一种花色的所有牌。若其被弃置的牌数小于你以此法弃置的牌数，你对其造成1点伤害。',
			mbcmjiushi: '酒诗',
			mbcmjiushi_info: '持恒技，①当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。②当你受到伤害后，若你的武将牌背面向上，你可以翻面。③当你翻面后，你获得牌堆里的一张锦囊牌。',
			mbcmfangzhu: '放逐',
			mbcmfangzhu_info: '持恒技。出牌阶段限一次，你可以选择一项令一名其他角色执行（不能选择上次发动选择的目标）：1. 直到其下个回合结束时，其不能使用锦囊牌外的手牌；2. 直到其下个回合结束时，其技能失效。',
			mbjuejin: '决进',
			mbjuejin_info: '持恒技，限定技，出牌阶段，你可以令所有角色依次将体力回复或失去至1并获得X点护甲（X为其因调整减少的体力值，你因此法获得的护甲值额外+2点），将牌堆、弃牌堆、场上、所有角色手牌中所有【闪】、【桃】、【酒】移出游戏，并增加“向死存魏”光环效果：当有牌进入弃牌堆后，将这些牌中的【闪】、【桃】、【酒】移出游戏。',
			mbcmxscw: '向死存魏',
			mbweitong: '卫统',
			mbweitong_info: '主公技，游戏开始时，若场上有其他魏势力角色且你拥有“潜龙”，则你因“潜龙”于游戏开始时获得的道心值修改为60点。',
			lizhaojiaobo: "李昭焦伯",
			mbzuoyou: "佐佑",
			mbzuoyou_info: "转换技，出牌阶段限一次，阳：你可以令一名角色摸三张牌，然后其弃置两张手牌；阴：你可以令一名有手牌的角色弃置一张手牌，然后其获得1点护甲。",
			mbshishou: "侍守",
			mbshishou_info: "锁定技。当你发动“佐佑”后，若选择的目标角色不为你，你执行“佐佑”中其未执行的一项。",
			chengji: "成济",
			mbkuangli: "狂戾",
			mbkuangli_info: "锁定技。出牌阶段开始时，你令场上随机任意名其他角色获得“狂戾”标记。出牌阶段限两次。当你使用牌指定有“狂戾”的角色为目标后，你与其各随机弃置一张牌，然后你摸两张牌。回合结束时，你移除场上所有“狂戾”标记。",
			mbxiongsi: "凶肆",
			mbxiongsi_info: "限定技。出牌阶段，若你的手牌数不低于三张，你可以弃置所有手牌，然后令其他角色依次流失1点体力。",
			mb_sp_guanqiujian: "玄毌丘俭",
			mbcuizhen: "摧阵",
			mbcuizhen_info: "游戏开始时，你可指定至多三名其他角色，废除其武器区。出牌阶段，你使用伤害类卡牌指定一名其他角色为目标后，若其手牌数不小于体力值，则你可废除其武器区。摸牌阶段，你额外摸X张牌（X为场上被废除的武器区数+1且至多为3）。",
			mbkuili: "溃离",
			mbkuili_info: "锁定技。当你受到伤害后，若此伤害来源的角色武器区被废除，则恢复之。",
			mb_simafu: "司马孚",
			mbpanxiang: "蹒襄",
			mbpanxiang_info: "当一名角色受到伤害时，你可选择一项：⒈你令此伤害-1，然后伤害来源摸两张牌；⒉令此伤害+1，然后其摸三张牌（不能选择上次该角色受伤后你发动此技能选择的选项）。",
			mbchenjie: "臣节",
			mbchenjie_info: "若你有“蹒襄”，一名成为过“蹒襄”目标的角色死亡后，你弃置你区域内的所有牌，然后摸四张牌。",
			mb_wangjing: '王经',
			mbzujin: '阻进',
			mbzujin_info: '每回合每种牌名限一次。若你未受伤或体力值不为最低，你可将一张基本牌当做【杀】使用或打出；若你已受伤，你可将一张基本牌当做【闪】或【无解可击】使用或打出。',
			mbjiejian: '节谏',
			mbjiejian_info: '准备阶段，你可将任意张手牌交给任意名其他角色，并为这些角色添加“节谏”标记。若如此做，“节谏”角色成为一张牌的唯一目标时，你可将此牌转移给你，然后你摸一张牌。“节谏”角色的回合结束时，移除其“节谏”标记，若其体力值不小于x(x为你交给其牌时其的体力值)，你摸两张牌。',
			mb_wenqin: '手杀文钦',
			mb_wenqin_ab: '文钦',
			mbbeiming: '孛明',
			mbbeiming_info: '游戏开始时，你可选择至多两名角色，令其依次获得牌堆中一张攻击范围为x的武器牌(x为其初始手牌的花色数)。',
			mbchoumang: '仇铓',
			mbchoumang_info: '每回合限一次，你使用【杀】指定唯一目标后或成为【杀】的唯一目标后，你可以选择一项：1.令此【杀】伤害+1；2.若此【杀】被【闪】抵消，则你可以获得与你距离为1以内的一名其他角色区域内的一张牌。背水：弃置你与其装备区的武器牌(你或其装备区有武器牌方可使用)。',
			mb_simazhou: '手杀司马伷',
			mb_simazhou_ab: '司马伷',
			mbbifeng: '避锋',
			mbbifeng_info: '当你成为一张基本牌或普通锦囊牌的目标时，若此牌的目标数不大于4，你可取消之。若如此做，则此牌结算结束后，若此牌没有其他角色响应，你失去1点体力，否则你摸两张牌。',
			mbsuwang: '宿望',
			mbsuwang_info: '一名角色的回合结束时，若其于此回合内选择过你为目标且你未受到过伤害，则你将牌堆顶的一张牌置于武将牌上，称之为宿望牌。摸牌阶段，若你有宿望牌，则可以改为获得宿望牌，然后你可令一名其他角色摸两张牌。',
			mb_jiachong: '贾充',
			mbbeini: '悖逆',
			mbbeini_info: '出牌阶段限一次，你可以选择一名体力值不小于你的角色，令你或其摸两张牌，然后未摸牌的角色选择一项：1.视为对摸牌的角色使用一张【杀】；2.获得摸牌的角色场上的一张牌。',
			mbdingfa: '定法',
			mbdingfa_info: '弃牌阶段结束时，若本回合你失去的牌数不小于你的体力值，你可以选择一项：1.回复1点体力；2.弃置一名角色至多两张牌。',

			dragon_init: '龙血玄黄'
		},
"skill": {
			mbbeini: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				log: false,
				line: false,
				noaudio: true,
				delay: false,
				filterTarget: function (card, player, target) {
					return target.hp >= player.hp && target != player;
				},
				prompt: '你可选择1名角色，1人摸2张牌，另一人视为用杀或获得场上牌',
				content: function () {
					'step 0'
					var list = [];
					list.push('其摸2牌');
					list.push('你摸2牌');
					list.push('cancel2');
					player.chooseControl(list)
						.set('prompt', '你可选择1名角色，1人摸2张牌，另一人视为用杀或获得场上牌')
						.set('ai', function () {
							const evt = _status.event.getParent(),
								player = evt.player,
								target = evt.target;
							const card = {
								name: "sha",
								isCard: true
							},
								att = get.attitude(player, target) > '你摸2牌';
							if (!target.canUse(card, player, false) || get.effect(player, card, target, player) >= 0) return '你摸2牌';
							if (att && (!player.canUse(card, target, false) || get.effect(target, card, player, player) >= 0)) return '其摸2牌';
							if (target.hasSkill("nogain") && player.canUse(card, target, false) && get.effect(target, card, player, player) > 0) return '其摸2牌';
							if (player.hasShan()) return '你摸2牌';
							if (att && target.hasShan()) return '其摸2牌';
							return '你摸2牌';
						});
					'step 1'
					if (result.control != 'cancel2') {
						if (result.control == '其摸2牌') {
							player.logSkill('mbbeini', target);
							target.draw(2, 'nodelay');
						} else {
							player.logSkill('mbbeini');
							player.draw(2, 'nodelay');
						}
						event.mbbeiniPlayer = result.control == '其摸2牌' ? player : target;
						event.mbbeiniTarget = result.control == '其摸2牌' ? target : player;
						var list = [];
						list.push('对其用杀');
						if (event.mbbeiniTarget.countCards('ej') > 0) list.push('获得其场上1张牌');
						event.mbbeiniPlayer.chooseControl(list)
							.set('prompt', '你视为对摸牌角色使用杀或获得其场上1张牌')
							.set('ai', function () {
								const eff2 = get.effect(target, {
									name: "sha"
								}, player, player),
									eff1 = get.effect(target, {
										name: "shunshou_copy2"
									}, player, player);
								return eff1 > eff2 ? "对其用杀" : "获得其场上1张牌";
							});
					} else {
						player.getStat()
							.skill.mbbeini--;
						event.finish();
					}
					'step 2'
					if (result.control == '对其用杀') {
						var card = {
							name: 'sha',
							isCard: true
						};
						if (event.mbbeiniPlayer.canUse(card, event.mbbeiniTarget, false)) event.mbbeiniPlayer.useCard(card, event.mbbeiniTarget, false);
						event.finish();
					} else {
						var next = event.mbbeiniPlayer.choosePlayerCard(event.mbbeiniTarget, 'ej', 1, true);
						next.set('ai', function (button) {
							var val = get.value(button.link);
							if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
							return val;
						});
						next.set('forceAuto', true);
					}
					'step 3'
					if (result.bool) event.mbbeiniPlayer == player ? event.mbbeiniPlayer.gain(result.cards[0], event.mbbeiniTarget) : event.mbbeiniPlayer.gain(result.cards[0], event.mbbeiniTarget, 'give');
					'step 4'
					game.delay(0);
				},
			},
			mbdingfa: {
				audio: 2,
				trigger: {
					player: 'phaseDiscardEnd'
				},
				direct: true,
				filter: function (event, player) {
					var num = 0;
					player.getHistory('lose', function (evt) {
						num += evt.cards2.length;
					});
					return num >= player.hp;
				},
				content: function () {
					'step 0'
					var list = [];
					if (player.isDamaged()) list.push('回复1点体力');
					list.push('弃置一名角色至多2张牌');
					list.push('cancel2');
					player.chooseControl(list)
						.set('prompt', '你可以回复1点体力或者弃置一名角色2张牌')
						.set('ai', function () {
							var listx = list.slice();
							listx.remove("cancel2");
							const eff = get.recoverEffect(player, player, player);
							if (!game.hasPlayer(current => get.effect(current, {
								name: "guohe_copy2"
							}, player, player) > eff)) listx.remove("弃置一名角色至多2张牌");
							else if (listx.includes("弃置一名角色至多2张牌")) return "弃置一名角色至多2张牌";
							if (eff <= 0) listx.remove("回复1点体力");
							if (!listx.length) return "cancel2";
							return listx.randomGet();
						});
					'step 1'
					if (result.control != 'cancel2') {
						if (result.control == '回复1点体力') {
							player.logSkill('mbdingfa');
							player.recover();
							event.finish();
						} else player.chooseTarget(function (card, player, target) {
							return target.countCards('he') > 0;
						})
							.set('prompt', '你可以选择一名角色，弃置其至多2张牌')
							.set('ai', function (target) {
								return -get.attitude(_status.event.player, target);
							});
					} else event.finish();
					'step 2'
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill('mbdingfa', event.target);
						var next = player.choosePlayerCard(event.target, 'he', [1, 2], true);
						next.set('ai', function (button) {
							if (!_status.event.goon) return 0;
							var val = get.value(button.link);
							if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
							return val;
						});
						next.set('goon', get.attitude(player, event.target) <= 0);
						next.set('forceAuto', true);
					} else event.goto(0);
					'step 3'
					if (result.bool) event.target.discard(result.cards, 'tag');
				},
				group: 'mbdingfa_add',
				subSkill: {
					add: {
						trigger: {
							player: 'phaseBegin'
						},
						direct: true,
						content: function () {
							player.addTempSkill('mbdingfax', 'phaseDiscardAfter');
						}
					},
				},
			},
			mbdingfax: {
				trigger: {
					player: 'loseAfter',
					global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
				},
				direct: true,
				charlotte: true,
				init: function (player) {
					player.storage.mbdingfax = 0;
				},
				filter: function (event, player) {
					var evt = event.getParent();
					if (evt && evt.name == 'useCard' && evt.card && get.type(evt.card) == 'equip') return false;
					var evt = event.getl(player);
					if (!evt || !evt.cards2) return false;
					if (_status.currentPhase != player) return false;
					return true;
				},
				content: function () {
					var evt = trigger.getl(player);
					player.storage.mbdingfax = player.storage.mbdingfax + evt.cards2.length;
					player.markSkill('mbdingfax');
				},
				mark: true,
				marktext: '定法',
				intro: {
					markcount: function (storage) {
						return (storage || 0)
							.toString();
					},
				},
				onremove: true,
			},
			//司马伷
			mbbifeng: {
				audio: 1,
				trigger: {
					target: 'useCardToTarget'
				},
				priority: true,
				filter: function (event, player) {
					return event.card && (get.type(event.card.viewAs ? event.card.viewAs : event.card) == 'basic' || (get.type(event.card.viewAs ? event.card.viewAs : event.card) == 'trick' && get.type(event.card.viewAs ? event.card.viewAs : event.card) != 'delay')) && event.targets.length <= 4;
				},
				prompt: function (event, player) {
					return '你可发动避锋，取消成为' + get.translation(event.card.viewAs ? event.card.viewAs : event.card.name) + '的目标';
				},
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				content: function () {
					if (!trigger.card.storage) trigger.card.storage = {};
					trigger.card.storage.mbbifeng = true;
					player.addSkill('mbbifeng_offset');
					trigger.targets.remove(player);
					trigger.getParent().triggeredTargets2.remove(player);
					trigger.untrigger();
				},
				subSkill: {
					lose: {
						audio: 1
					},
					draw: {
						audio: 1
					},
					offset: {
						trigger: {
							global: 'useCardAfter'
						},
						direct: true,
						filter: function (event, player) {
							return event.card.storage && event.card.storage.mbbifeng;
						},
						content: function () {
							player.removeSkill('mbbifeng_offset');
							var targets = game.filterPlayer(current => {
								return current != player;
							}),
								bool = false;
							for (var current of targets) if (current.hasHistory('useCard', evt => {
								return evt.respondTo && evt.respondTo[1] == trigger.card;
							}) || current.hasHistory('respond', evt => {
								return evt.respondTo && evt.respondTo[1] == trigger.card;
							})) bool = true;
							bool ? player.logSkill('mbbifeng_draw') : player.logSkill('mbbifeng_lose');
							bool ? player.draw(2, 'nodelay') : player.loseHp();
						}
					},
				},
			},
			mbsuwang: {
				audio: 2,
				trigger: {
					global: 'phaseEnd'
				},
				forced: true,
				filter: function (event, player) {
					return player.hasSkill('mbsuwang_air') && !player.getHistory('damage').length;
				},
				content: function () {
					var cards = get.cards(1);
					player.addToExpansion(cards, player).gaintag.add('mbsuwang');
				},
				intro: {
					markclick: true,
					markcount: "expansion",
					content: "expansion",
				},
				group: ['mbsuwang_draw', 'mbsuwang_add'],
				subSkill: {
					air: {},
					add: {
						audio: 1,
						trigger: {
							target: 'useCardToTarget'
						},
						forced: true,
						popup: false,
						content: function () {
							player.addTempSkill('mbsuwang_air');
						},
					},
					draw: {
						audio: 'mbsuwang',
						trigger: {
							player: 'phaseDrawBegin1'
						},
						delay: false,
						filter: function (event, player) {
							return !event.numFixed && player.getExpansions('mbsuwang').length > 0;
						},
						prompt: '你可发动宿望，获得宿望牌替代摸牌',
						content: function () {
							'step 0'
							trigger.changeToZero();
							event.cards = player.getExpansions('mbsuwang');
							player == game.me ? player.gain(event.cards).nodelay = true : player.gain(event.cards, 'give').nodelay = true;
							'step 1'
							player.chooseTarget((card, player, target) => {
								return target != player;
							}).set('prompt', '你可选择1名其他角色，令其摸2张牌').set('ai', target => {
								return get.attitude(_status.event.player, target);
							});
							'step 2'
							if (result.bool) result.targets[0].draw(2, 'nodelay');
						},
					},
				},
			},
			//文钦
			mbbeiming: {
				audio: 2,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				direct: true,
				filter: function (event, player) {
					return event.name != 'phase' || game.phaseNumber == 0;
				},
				content: function () {
					'step 0'
					player.chooseTarget([1, 2]).set('prompt', '你可选择至多2名角色，令其依次获得牌堆中的1张武器牌').set('ai', target => {
						return get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						result.targets.sortBySeat();
						player.logSkill('mbbeiming', result.targets);
						for (var current of result.targets) {
							var suit = [];
							for (var card of current.getCards('h')) if (!suit.contains(get.suit(card))) suit.add(get.suit(card));
							var card = get.cardPile2(function (card) {
								var info = get.info(card);
								return get.subtype(card) == 'equip1' && info.distance && info.distance.attackFrom && Math.abs(info.distance.attackFrom - 1) == suit.length;
							});
							if (card) current == game.me ? current.gain(card).nodelay = true : current.gain(card, 'draw').nodelay = true;
						}
					}
				},
			},
			mbchoumang: {
				audio: 2,
				trigger: {
					player: 'useCardToPlayered',
					target: 'useCardToTargeted'
				},
				usable: 1,
				direct: true,
				filter: function (event, player) {
					return event.card && (event.card.viewAs ? event.card.viewAs.name : event.card.name) == 'sha' && event.targets.length == 1;
				},
				content: function () {
					'step 0'
					var list = [];
					list.push('杀伤害+1');
					list.push('被抵消获得牌');
					if (trigger.player.getEquip(1) || trigger.target.getEquip(1)) list.push('背水');
					list.push('cancel2');
					player.chooseControl(list).set('prompt', '你可发动仇铓并选择一项效果发动').set('ai', function () {
						return list.randomGet();
					});
					'step 1'
					if (result.control != 'cancel2') {
						if (result.control == '杀伤害+1') trigger.getParent().baseDamage++;
						if (result.control == '被抵消获得牌') {
							if (!trigger.card.storage) trigger.card.storage = {};
							trigger.card.storage.mbchoumang = true;
							player.addSkill('mbchoumang_offset');
						}
						if (result.control == '背水') {
							trigger.getParent().baseDamage++;
							if (!trigger.card.storage) trigger.card.storage = {};
							trigger.card.storage.mbchoumang = true;
							player.addSkill('mbchoumang_offset');
							if (trigger.player.getEquip(1)) trigger.player.discard(trigger.player.getEquip(1), trigger.player == player ? 'tag' : 'passive').delay = false;
							if (trigger.target.getEquip(1)) trigger.target.discard(trigger.target.getEquip(1), trigger.target == player ? 'tag' : 'passive').delay = false;
						}
						player.logSkill('mbchoumang');
					} else player.storage.counttrigger.mbchoumang--;
				},
				subSkill: {
					offset: {
						trigger: {
							global: 'shaMiss'
						},
						direct: true,
						filter: function (event, player) {
							return event.card.storage && event.card.storage.mbchoumang;
						},
						content: function () {
							'step 0'
							player.chooseTarget((card, player, target) => {
								return target != player && get.distance(target, player) <= 1;
							}).set('prompt', '你可获得与你距离为1以内的1名其他角色区域内的1张牌').set('ai', target => {
								return -get.attitude(_status.event.player, target);
							});
							'step 1'
							if (result.bool) {
								event.target = result.targets[0];
								var next = player.choosePlayerCard(event.target, 'hej', 1, true);
								next.set('ai', function (button) {
									if (!_status.event.goon) return 0;
									var val = get.value(button.link);
									if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
									return val;
								});
								next.set('goon', get.attitude(player, event.target) <= 0);
								next.set('forceAuto', true);
							} else event.finish();
							'step 2'
							if (result.bool) {
								player == game.me ? player.gain(result.cards, event.target) : player.gain(result.cards, event.target, 'giveAuto');
							}
						},
					},
				},
			},
			mbzujin: {
				audio: 3,
				enable: ['chooseToUse', 'chooseToRespond'],
				prompt: function (event, player) {
					event = event || _status.event;
					var filter = event._backup.filterCard;
					if (filter({
						name: 'sha'
					}, player, event)) return '你可将1张基本牌当做杀使用或打出';
					if (filter({
						name: 'shan'
					}, player, event)) return '你可将1张基本牌当做闪使用或打出';
					if (filter({
						name: 'wuxie'
					}, player, event)) return '你可将1张基本牌当做无懈可击使用或打出';
				},
				onuse: function (result, player) {
					ui.skillControl.update();
				},
				viewAs: function (cards, player) {
					var event = _status.event;
					var filter = event._backup.filterCard;
					if (filter({
						name: 'sha'
					}, player, event)) name = 'sha';
					if (filter({
						name: 'shan'
					}, player, event)) name = 'shan';
					if (filter({
						name: 'wuxie'
					}, player, event)) name = 'wuxie';
					if (name) {
						player.storage.mbzujin_used = name;
						return {
							name: name
						};
					}
					return null;
				},
				check: function (card) {
					return 1;
				},
				log: false,
				selectCard: 1,
				position: 'h',
				filterCard: function (card, player, event) {
					if (get.type(card, player) == 'basic') return true;
					return false;
				},
				filter: function (event, player) {
					var filter = event.filterCard;
					if (filter({
						name: 'sha'
					}, player, event) && player.countCards('h', {
						type: 'basic'
					}) && (!player.isDamaged() || game.hasPlayer(function (current) {
						return current.hp <= player.hp;
					})) && player.storage.mbzujin_clear.contains('sha')) return true;
					if (filter({
						name: 'shan'
					}, player, event) && player.countCards('h', {
						type: 'basic'
					}) && player.isDamaged() && player.storage.mbzujin_clear.contains('shan')) return true;
					if (filter({
						name: 'wuxie'
					}, player, event) && player.countCards('h', {
						type: 'basic'
					}) && player.isDamaged() && player.storage.mbzujin_clear.contains('wuxie')) return true;
					return false;
				},
				hiddenCard: function (player, name) {
					if (name == 'wuxie' || name == 'shan') return player.countCards('h', {
						type: 'basic'
					}) > 0 && player.isDamaged();
					if (name == 'sha') return player.countCards('h', {
						type: 'basic'
					}) > 0;
				},
				precontent: function () {
					player.logSkill('mbzujin_' + player.storage.mbzujin_used);
					player.storage.mbzujin_clear.remove(player.storage.mbzujin_used);
				},
				init: function (player) {
					if (!player.storage.mbzujin_clear) player.storage.mbzujin_clear = ['sha', 'shan', 'wuxie'];
				},
				mark: true,
				intro: {
					markcount: 'expansion',
					content: 'expansion',
				},
				group: 'mbzujin_clear',
				subSkill: {
					sha: {
						audio: 1
					},
					shan: {
						audio: 1
					},
					wuxie: {
						audio: 1
					},
					clear: {
						trigger: {
							global: 'phaseBegin'
						},
						direct: true,
						firstDo: true,
						charlotte: true,
						content: function () {
							player.storage.mbzujin_clear = ['sha', 'shan', 'wuxie'];
						},
					},
				},
				ai: {
					respondSha: true,
					respondShan: true,
					skillTagFilter: function (player, tag) {
						if (!player.countCards("h", card => get.type(card) == "basic")) return false;
						if (tag == "respondSha") return !player.isDamaged() || game.hasPlayer(function (current) {
							return current.hp <= player.hp;
						}) && player.storage.mbzujin_clear.contains('sha');
						return player.isDamaged() && player.storage.mbzujin_clear.contains('shan');
					},
				},
			},
			mbjiejian: {
				audio: 3,
				trigger: {
					player: 'phaseZhunbeiBegin'
				},
				direct: true,
				init: function (player) {
					if (!lib.skill['mbjiejian_' + player.playerid]) {
						lib.skill['mbjiejian_' + player.playerid] = {
							mark: true,
							intro: {},
						}
						lib.translate['mbjiejian_' + player.playerid] = '节谏';
					}
				},
				content: function () {
					'step 0'
					var num = game.countPlayer(current => current != player);
					player.chooseTarget([1, Math.max(1, num)], (card, player, target) => {
						return target != player;
					}).set('prompt', '你可发动节谏，选择任意名其他角色').set('ai', target => {
						return get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						result.targets.sortBySeat();
						event.targets = result.targets;
						player.logSkill('mbjiejian_choose', event.targets);
						event.num = 0;
					} else event.finish();
					'step 2'
					if (event.num <= (event.targets.length - 1) && player.countCards('h') > 0) player.chooseCard([1, player.countCards('h')], 'h', true).set('prompt', '选择你的手牌交给' + get.translation(event.targets[event.num])).set('ai', function (card) {
						return 6 - get.value(card);
					});
					else event.finish();
					'step 3'
					if (result.bool) {
						player.give(result.cards, event.targets[event.num]);
						event.targets[event.num].storage['mbjiejian_' + player.playerid] = event.targets[event.num].hp + '体力';
						event.targets[event.num].addSkill('mbjiejian_' + player.playerid);
						event.num++;
						event.goto(2);
					}
				},
				group: ['mbjiejian_clear', 'mbjiejian_use'],
				subSkill: {
					choose: {
						audio: 1
					},
					use: {
						audio: 1,
						trigger: {
							global: 'useCardToTarget'
						},
						filter: function (event, player) {
							return event.player != player && event.target != player && event.targets.length == 1 && get.type(event.card) != 'equip' && event.target.hasSkill('mbjiejian_' + player.playerid);
						},
						delay: false,
						check: function (event, player) {
							if (event.card.name != 'tao' && event.card.name != 'wuzhong' && event.card.name != 'jiu') return get.attitude(player, event.player) > 0;
							else return get.attitude(player, event.player) < 0;
						},
						prompt: function (event, player) {
							return '你可取消' + get.translation(event.card.name) + '的目标，然后你成为此牌的目标，并摸1张牌';
						},
						content: function () {
							trigger.targets.remove(trigger.target);
							trigger.getParent().triggeredTargets2.remove(trigger.target);
							trigger.untrigger();
							trigger.targets.push(player);
							player.draw(1, 'nodelay');
						},
					},
					clear: {
						audio: 1,
						trigger: {
							global: 'phaseEnd'
						},
						forced: true,
						filter: function (event, player) {
							return event.player != player && event.player.hasSkill('mbjiejian_' + player.playerid);
						},
						content: function () {
							trigger.player.removeSkill('mbjiejian_' + player.playerid);
							if (trigger.player.hp >= trigger.player.storage['mbjiejian_' + player.playerid][0]) player.draw(2, 'nodelay');
						},
					},
				},
			},
			//司马孚
			//蹒襄
			mbpanxiang: {
				audio: 4,
				trigger: {
					global: "damageBegin3",
				},
				direct: true,
				content: function () {
					'step 0'
					var list = [];
					if (!trigger.player.hasMark("mbpanxiang_add")) {
						if (trigger.source) {
							list.push('伤害-1，' + get.translation(trigger.source) + '摸2张牌');
						} else {
							list.push('伤害-1');
						}
					};
					if (!trigger.player.hasMark("mbpanxiang_reduce")) {
						list.push('伤害+1，' + get.translation(trigger.player) + '摸3张牌');
					};
					player.chooseControl(list, '取消').set('ai', function () {
						if (get.attitude(_status.event.player, trigger.player) > 0 && trigger.player.hasMark("mbpanxiang_add") && (trigger.num + 1) >= trigger.player.hp) return '取消';
						if (get.attitude(_status.event.player, trigger.player) < 0 && trigger.player.hasMark("mbpanxiang_reduce") && trigger.num >= trigger.player.hp) return '取消';
						if (!trigger.player.hasMark("mbpanxiang_add")) return '伤害-1';
						if (!trigger.player.hasMark("mbpanxiang_reduce")) return '伤害+1';
					});
					'step 1'
					if (result.control) {
						if (result.control.includes('伤害-1')) {
							player.logSkill("mbpanxiang");
							if (trigger.player.hasMark("mbpanxiang_reduce")) {
								trigger.player.clearMark("mbpanxiang_reduce");
							};
							trigger.player.addMark("mbpanxiang_add", 1, false);
							trigger.num--;
							if (trigger.source) trigger.source.draw(2);
						} else if (result.control.includes('伤害+1')) {
							player.logSkill("mbpanxiang");
							if (trigger.player.hasMark("mbpanxiang_add")) {
								trigger.player.clearMark("mbpanxiang_add");
							};
							trigger.player.addMark("mbpanxiang_reduce", 1, false);
							trigger.num++;
							trigger.player.draw(3);
						} else {
							event.finish();
						};
					};
				},
				subSkill: {
					add: {
						marktext: "蹒襄·增",
						intro: {
							content: "下一次对其发动“蹒襄”时只能选择增伤选项",
							markcount: () => null,
						},
					},
					reduce: {
						marktext: "蹒襄·减",
						intro: {
							content: "下一次对其发动“蹒襄”时只能选择减伤选项",
							markcount: () => null,
						},
					},
				},
			},

			//臣节
			mbchenjie: {
				audio: 2,
				trigger: {
					global: "dieAfter",
				},
				filter: function (event, player) {
					if (!player.hasSkill('mbpanxiang')) return false;
					return (event.player.hasMark('mbpanxiang_add') || event.player.hasMark('mbpanxiang_reduce'));
				},
				forced: true,
				locked: false,
				content: function () {
					'step 0'
					player.discard(player.getCards('hej'));
					'step 1'
					player.draw(4);
				},
			},

			//李昭焦伯
			//佐佑
			mbzuoyou: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filterTarget: function (card, player, target) {
					if (player.storage.mbzuoyou == true) return target.countCards('h') > 0;
					return true;
				},
				zhuanhuanji: true,
				mark: true,
				marktext: '☯',
				intro: {
					content: function (storage, player, skill) {
						if (player.storage.mbzuoyou == true) return '转换技，你可以令一名有手牌的角色弃置一张手牌，然后其获得1点护甲。';
						return '转换技，你可以令一名角色摸三张牌，然后其弃置两张手牌。';
					},
				},
				prompt: function () {
					if (_status.event.player.storage.mbzuoyou == true) return '你可以令一名有手牌的角色弃置一张手牌，然后其获得1点护甲';
					return '你可以令一名角色摸三张牌，然后其弃置两张手牌';
				},
				content: function () {
					'step 0'
					if (player.storage.mbzuoyou == true) {
						target.chooseToDiscard('佐佑：请弃置一张手牌，然后获得一点护甲', 'he', 1, true);
						target.changeHujia(1, null, true);
					} else {
						target.draw(3);
						target.chooseToDiscard('佐佑：请弃置两张手牌', 'he', 2, true);
					}
					player.changeZhuanhuanji('mbzuoyou');
				},
				ai: {
					order: function () {
						return get.order({ name: 'sha' }) + 5;
					},
					result: {
						target: 1,
						player: 1,
					},
				},
			},

			//侍守
			mbshishou: {
				audio: 2,
				trigger: {
					player: 'mbzuoyouAfter'
				},
				forced: true,
				filter: function (event, player) {
					return !event.targets.includes(player);
				},
				content: function () {
					'step 0'
					if (player.storage.mbzuoyou == true) {
						game.log(player, '执行了', '#g【佐佑】', '的阴选项');
						player.chooseToDiscard('佐佑：请弃置一张手牌，然后获得一点护甲', 'he', 1, true);
						player.changeHujia(1, null, true);
					} else {
						game.log(player, '执行了', '#g【佐佑】', '的阳选项');
						player.draw(3);
						player.chooseToDiscard('佐佑：请弃置两张手牌', 'he', 2, true);
					}
				},
			},

			//成济
			//狂戾
			mbkuangli: {
				group: ['mbkuangli_use', 'mbkuangli_remove'],
				marktext: "狂戾",
				intro: {
					content: "mark",
					markcount: () => null,
				},
				audio: 2,
				trigger: {
					player: 'phaseUseBegin'
				},
				forced: true,
				content: function () {
					for (var target of game.filterPlayer(current => current != player)) {
						var num = [0, 1].randomGet();
						if (num == 0) {
							player.line(target, 'green');
							target.addMark("mbkuangli", 1);
						};
					};
				},
				subSkill: {
					use: {
						audio: "mbkuangli",
						trigger: { player: "useCardToPlayered" },
						usable: 2,
						forced: true,
						filter: function (event, player) {
							return event.target.hasMark('mbkuangli');
						},
						content: function () {
							'step 0'
							player.discard(player.getCards('he').randomGet());
							trigger.target.discard(trigger.target.getCards('he').randomGet());
							'step 1'
							player.draw(2);
						},
					},
					remove: {
						audio: "mbkuangli",
						trigger: { player: "phaseEnd" },
						forced: true,
						filter: function (event, player) {
							return game.hasPlayer(current => current.hasMark('mbkuangli'));
						},
						content: function () {
							for (var target of game.filterPlayer()) {
								if (target.hasMark('mbkuangli')) {
									target.removeMark("mbkuangli", target.countMark("mbkuangli"));
								};
							};
						},
					},
				},
			},
			//凶肆
			mbxiongsi: {
				unique: true,
				mark: true,
				intro: {
					content: "limited",
				},
				limited: true,
				audio: 2,
				enable: 'phaseUse',
				filter: function (event, player) {
					return player.countCards("h") >= 3;
				},
				filterTarget: true,
				selectTarget: -1,
				filterCard: true,
				selectCard: -1,
				skillAnimation: true,
				animationColor: 'metal',
				content: function () {
					player.awakenSkill('mbxiongsi');
					if (target != player) {
						target.loseHp();
					}
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							if (lib.config.mode == 'identity' && game.zhu.isZhu && player.identity == 'fan') {
								if (game.zhu.hp == 1 && game.zhu.countCards('h') <= 2) return 1;
							}
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								var att = get.attitude(player, players[i]);
								if (att > 0) att = 1;
								if (att < 0) att = -1;
								if (players[i] != player && players[i].hp <= 3) {
									if (players[i].countCards('h') == 0) num += att / players[i].hp;
									else if (players[i].countCards('h') == 1) num += att / 2 / players[i].hp;
									else if (players[i].countCards('h') == 2) num += att / 4 / players[i].hp;
								}
								if (players[i].hp == 1) num += att * 1.5;
							}
							if (player.hp == 1) {
								return -num;
							}
							if (player.hp == 2) {
								return -game.players.length / 4 - num;
							}
							return -game.players.length / 3 - num;
						}
					}
				}
			},

			//sp毌丘俭
			//摧阵
			mbcuizhen: {
				group: ['mbcuizhen_use', 'mbcuizhen_draw'],
				audio: 2,
				trigger: {
					global: 'phaseBefore',
					player: 'enterGame',
				},
				popup: false,
				filter: function (event, player) {
					return (event.name != 'phase' || game.phaseNumber == 0);
				},
				check: function (event, player) {
					return true;
				},
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt('mbcuizhen'), [1, 3], lib.filter.notMe, '你可选择至多三名其他角色，废除其武器区').set('ai', function (target) {
						return -get.attitude(_status.event.player, target) * get.threaten(target);
					});
					'step 1'
					if (result.bool) {
						var targets = result.targets;
						targets.sortBySeat();
						player.logSkill('mbcuizhen', targets);
						for (var target of targets) {
							target.disableEquip(1);
						}
					}
				},
				subSkill: {
					use: {
						audio: "mbcuizhen",
						trigger: { player: "useCardToPlayered" },
						filter: function (event, player) {
							return (player.isPhaseUsing() && get.tag(event.card, "damage") && event.target !== player && event.target.countCards("h") >= event.target.hp && !event.target.isDisabled(1));
						},
						logTarget: "target",
						check: function (event, player) {
							return get.attitude(player, event.target) <= 0;
						},
						content: function () {
							trigger.target.disableEquip(1);
						},
					},
					draw: {
						audio: "mbcuizhen",
						trigger: { player: "phaseDrawBegin2" },
						forced: true,
						locked: false,
						filter: function (event, player) {
							return !event.numFixed;
						},
						content: function () {
							trigger.num += Math.min(3, game.countPlayer(target => target.isDisabled(1)) + 1);
						},
					},
				},
			},

			//溃离
			mbkuili: {
				audio: 2,
				trigger: {
					player: "damageEnd",
				},
				filter: function (event, player) {
					return event.source && event.source.isIn() && event.source.isDisabled(1);
				},
				forced: true,
				content: function () {
					player.line(trigger.source, "green");
					trigger.source.enableEquip(1, player);
				},
				ai: {
					threaten: 3,
				},
			},
			mbqianlong: {
				audio: 6,
				trigger: {
					global: 'phaseBefore',
					player: 'enterGame',
				},
				priority: 6,
				forced: true,
				locked: false,
				forever: true,
				filter: function (event, player) {
					return event.name != 'phase' || game.phaseNumber == 0;
				},
				content: function () {
					var num = 20;
					if (game.hasPlayer(current => {
						return current !== player && current.group === 'wei' && player.hasZhuSkill('mbweitong', current);
					})) num = 60;
					var count = player.countMark('mbqianlong');
					if (num + count >= 99) {
						player.addMark('mbqianlong', 99 - count);
					}
					else player.addMark('mbqianlong', num);
					var next = game.createEvent('mbqianlong_refresh');
					next.player = player;
					next.setContent(lib.skill.mbqianlong.subSkill['5'].content);
				},
				group: ['mbqianlong_1', 'mbqianlong_2', 'mbqianlong_3'],
				mark: true,
				marktext: "道心值",
				intro: {
					markcount: function (storage, player) {
						return player.countMark('mbqianlong');
					},
					content: function (storage, player) {
						return player.countMark('mbqianlong') + '/99';
					}
				},
				subSkill: {
					"1": {
						audio: "mbqianlong",
						trigger: { player: 'gainEnd' },
						locked: false,
						forced: true,
						forever: true,
						filter: function (event, player) {
							return player.countMark('mbqianlong') < 99;
						},
						content: function () {
							var num = 5;
							var count = player.countMark('mbqianlong');
							if (num + count >= 99) {
								player.addMark('mbqianlong', 99 - count);
							}
							else player.addMark('mbqianlong', num);
							var next = game.createEvent('mbqianlong_refresh');
							next.player = player;
							next.setContent(lib.skill.mbqianlong.subSkill['5'].content);
						}
					},
					"2": {
						audio: "mbqianlong",
						trigger: { player: 'damageEnd' },
						locked: false,
						forced: true,
						forever: true,
						filter: function (event, player) {
							return player.countMark('mbqianlong') < 99 && event.num > 0;
						},
						content: function () {
							var num = trigger.num * 10;
							var count = player.countMark('mbqianlong');
							if (num + count >= 99) {
								player.addMark('mbqianlong', 99 - count);
							}
							else player.addMark('mbqianlong', num);
							var next = game.createEvent('mbqianlong_refresh');
							next.player = player;
							next.setContent(lib.skill.mbqianlong.subSkill['5'].content);
						}
					},
					"3": {
						audio: "mbqianlong",
						trigger: { source: "damageSource" },
						locked: false,
						forced: true,
						forever: true,
						filter: function (event, player) {
							return player.countMark('mbqianlong') < 99 && event.num > 0;
						},
						content: function () {
							var num = trigger.num * 15;
							var count = player.countMark('mbqianlong');
							if (num + count >= 99) {
								player.addMark('mbqianlong', 99 - count);
							}
							else player.addMark('mbqianlong', num);
							var next = game.createEvent('mbqianlong_refresh');
							next.player = player;
							next.setContent(lib.skill.mbqianlong.subSkill['5'].content);
						}
					},
					"5": {
						forever: true,
						content: function () {
							if (player.countMark('mbqianlong') >= 25 && !player.hasSkill('mbcmqingzheng')) player.addAdditionalSkill('mbqianlong', 'mbcmqingzheng', true);
							if (player.countMark('mbqianlong') >= 50 && !player.hasSkill('mbcmjiushi')) player.addAdditionalSkill('mbqianlong', 'mbcmjiushi', true);
							if (player.countMark('mbqianlong') >= 75 && !player.hasSkill('mbcmfangzhu')) player.addAdditionalSkill('mbqianlong', 'mbcmfangzhu', true);
							if (player.countMark('mbqianlong') >= 99 && !player.hasSkill('mbjuejin')) player.addAdditionalSkill('mbqianlong', 'mbjuejin', true);
						}
					},
				},
			},
			mbcmqingzheng: {
				audio: 2,
				trigger: { player: 'phaseUseBegin' },
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				direct: true,
				forever: true,
				content: function () {
					'step 0'
					var num = 1;
					var prompt = '###' + get.prompt('mbcmqingzheng') + '###弃置' + get.cnNumber(num) + '种花色的所有牌';
					var next = player.chooseButton([prompt, [lib.suit.map(i => ['', '', 'lukai_' + i]), 'vcard']], num);
					next.set('filterButton', button => {
						var player = _status.event.player;
						var cards = player.getCards('h', { suit: button.link[2].slice(6) });
						return cards.length > 0 && cards.filter(card => lib.filter.cardDiscardable(card, player, 'mbcmqingzheng')).length == cards.length;
					});
					next.set('ai', button => {
						var player = _status.event.player;
						return 15 - player.getCards('h', { suit: button.link[2].slice(6) }).map(i => get.value(i)).reduce((p, c) => p + c, 0);
					});
					next.set('custom', {
						replace: {
							button: function (button) {
								if (!_status.event.isMine()) return;
								if (button.classList.contains('selectable') == false) return;
								var cards = _status.event.player.getCards('h', { suit: button.link[2].slice(6) });
								if (cards.length) {
									var chosen = cards.filter(i => ui.selected.cards.includes(i)).length == cards.length;
									if (chosen) {
										ui.selected.cards.removeArray(cards);
										cards.forEach(card => {
											card.classList.remove('selected');
											card.updateTransform(false);
										});
									} else {
										ui.selected.cards.addArray(cards);
										cards.forEach(card => {
											card.classList.add('selected');
											card.updateTransform(true);
										});
									}
								}
								if (button.classList.contains('selected')) {
									ui.selected.buttons.remove(button);
									button.classList.remove('selected');
									if (_status.multitarget || _status.event.complexSelect) {
										game.uncheck();
										game.check();
									}
								}
								else {
									button.classList.add('selected');
									ui.selected.buttons.add(button);
								}
								var custom = _status.event.custom;
								if (custom && custom.add && custom.add.button) {
									custom.add.button();
								}
								game.check();
							}
						},
						add: next.custom.add
					});
					'step 1'
					if (result.bool) {
						var cards = result.cards;
						if (!cards.length) {
							var suits = result.links.map(i => i[2].slice(6));
							cards = player.getCards('h', card => suits.includes(get.suit(card, player)));
						}
						event.cards = cards;
						if (!cards.length) event.finish();
						else player.chooseTarget('清正：观看一名其他角色的手牌并弃置其中一种花色的所有牌', (card, player, target) => {
							return target != player && target.countCards('h');
						}).set('ai', target => {
							var player = _status.event.player, att = get.attitude(player, target);
							if (att >= 0) return 0;
							return 1 - att / 2 + Math.sqrt(target.countCards('h'));
						});
					} else event.finish();
					'step 2'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill('mbcmqingzheng', target);
						player.discard(cards);
						var list = [];
						var dialog = ['清正：弃置' + get.translation(target) + '一种花色的所有牌'];
						for (var suit of lib.suit.concat('none')) {
							if (target.countCards('h', { suit: suit })) {
								dialog.push('<div class="text center">' + get.translation(suit + '2') + '牌</div>');
								dialog.push(target.getCards('h', { suit: suit }));
								list.push(suit);
							}
						}
						if (list.length) {
							player.chooseControl(list).set('dialog', dialog).set('ai', () => {
								return _status.event.control;
							}).set('control', (() => {
								var getv = (cards) => cards.map(i => get.value(i)).reduce((p, c) => p + c, 0);
								return list.sort((a, b) => {
									return getv(target.getCards('h', { suit: b })) - getv(target.getCards('h', { suit: a }));
								})[0];
							})());
						}
					} else event.finish();
					'step 3'
					var cards2 = target.getCards('h', { suit: result.control });
					event.cards2 = cards2;
					target.discard(cards2, 'notBySelf').set('discarder', player);
					'step 4'
					if (event.cards2.length < cards.length) target.damage();
				},
			},
			mbcmjiushi: {
				audio: 2,
				forever: true,
				group: ['mbcmjiushi_1', 'mbcmjiushi_2', 'mbcmjiushi_3', 'mbcmjiushi_gain'],
				subfrequent: ['gain'],
				subSkill: {
					"1": {
						hiddenCard: function (player, name) {
							if (name == 'jiu') return !player.isTurnedOver();
							return false;
						},
						enable: 'chooseToUse',
						log: false,
						forever: true,
						filter: function (event, player) {
							if (player.classList.contains('turnedover')) return false;
							return event.filterCard({ name: 'jiu', isCard: true }, player, event);
						},
						content: function () {
							if (_status.event.getParent(2).type == 'dying') {
								event.dying = player;
								event.type = 'dying';
							}
							player.logSkill('mbcmjiushi');
							player.turnOver();
							player.useCard({ name: 'jiu', isCard: true }, player);
						},
						ai: {
							order: 5,
							result: {
								player: function (player) {
									if (_status.event.parent.name == 'phaseUse') {
										if (player.countCards('h', 'jiu') > 0) return 0;
										if (player.getEquip('zhuge') && player.countCards('h', 'sha') > 1) return 0;
										if (!player.countCards('h', 'sha')) return 0;
										var targets = [];
										var target;
										var players = game.filterPlayer();
										for (var i = 0; i < players.length; i++) {
											if (get.attitude(player, players[i]) < 0) {
												if (player.canUse('sha', players[i], true, true)) {
													targets.push(players[i]);
												}
											}
										}
										if (targets.length) {
											target = targets[0];
										}
										else {
											return 0;
										}
										var num = get.effect(target, { name: 'sha' }, player, player);
										for (var i = 1; i < targets.length; i++) {
											var num2 = get.effect(targets[i], { name: 'sha' }, player, player);
											if (num2 > num) {
												target = targets[i];
												num = num2;
											}
										}
										if (num <= 0) return 0;
										var e2 = target.getEquip(2);
										if (e2) {
											if (e2.name == 'tengjia') {
												if (!player.countCards('h', { name: 'sha', nature: 'fire' }) && !player.getEquip('zhuque')) return 0;
											}
											if (e2.name == 'renwang') {
												if (!player.countCards('h', { name: 'sha', color: 'red' })) return 0;
											}
											if (e2.name == 'baiyin') return 0;
										}
										if (player.getEquip('guanshi') && player.countCards('he') > 2) return 1;
										return target.countCards('h') > 3 ? 0 : 1;
									}
									if (player == _status.event.dying || player.isTurnedOver()) return 3;
								}
							},
							effect: {
								target: function (card, player, target) {
									if (card.name == 'guiyoujie') return [0, 0.5];
									if (target.isTurnedOver()) {
										if (get.tag(card, 'damage')) {
											if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
											if (target.hp == 1) return;
											return [1, target.countCards('h') / 2];
										}
									}
								}
							}
						},
					},
					"2": {
						trigger: { player: 'damageBegin3' },
						silent: true,
						firstDo: true,
						forever: true,
						filter: function (event, player) {
							return player.classList.contains('turnedover');
						},
						content: function () {
							trigger.mbcmjiushi = true;
						}
					},
					"3": {
						trigger: { player: 'damageEnd' },
						popup: false,
						forever: true,
						check: function (event, player) {
							return player.isTurnedOver();
						},
						filter: function (event, player) {
							if (event.mbcmjiushi) {
								return true;
							}
							return false;
						},
						prompt: '是否发动【酒诗】，将武将牌翻面？',
						content: function () {
							player.logSkill('mbcmjiushi');
							delete trigger.mbcmjiushi;
							player.turnOver();
						}
					},
					gain: {
						trigger: { player: 'turnOverAfter' },
						popup: false,
						forever: true,
						frequent: true,
						prompt: '是否发动【酒诗】，获得牌堆中的一张锦囊牌？',
						content: function () {
							player.logSkill('mbcmjiushi');
							var card = get.cardPile2(function (card) {
								return get.type2(card) == 'trick';
							});
							if (card) player.gain(card, 'gain2', 'log');
						},
					},
				},
			},
			mbcmfangzhu: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				forever: true,
				init: function (player) {
					player.storage.mbcmfangzhu = '';
				},
				filter: function (event, player) {
					return game.hasPlayer(p => {
						return p != player && p != player.storage.mbcmfangzhu;
					})
				},
				filterTarget: function (card, player, target) {
					return target != player && target != player.storage.mbcmfangzhu;
				},
				content: function () {
					'step 0'
					player.chooseControl(['技能失效', '无法用牌']).set('prompt', '选择令' + get.translation(target)).set('ai', function () {
						return ['技能失效', '无法用牌'].randomGet();
					});
					player.storage.mbcmfangzhu = target;
					'step 1'
					if (result.control == '技能失效') {
						target.addTempSkill('mbcmfangzhu_baiban', { player: 'phaseEnd' });
						event.finish();
					}
					else {
						target.addTempSkill('mbcmfangzhu_jin', { player: 'phaseEnd' });
						target.storage.mbcmfangzhu_jin.add('trick');
						target.updateMarks('mbcmfangzhu_jin');
					}
				},
				ai: {
					threaten: 1.6,
					order: 9,
					result: {
						target: -1,
					},
				},
				group: ['mbcmfangzhu_clear'],
				subSkill: {
					clear: {
						charlotte: true,
						forever: true,
						direct: true,
						trigger: {
							player: 'phaseUseEnd'
						},
						filter: function (event, player) {
							return !player.hasHistory('useSkill', evt => evt.skill == 'mbcmfangzhu');
						},
						content: function () {
							if (player.storage.mbcmfangzhu) player.storage.mbcmfangzhu = '';
						},
					},
					baiban: {
						init: function (player, skill) {
							player.addSkillBlocker(skill);
						},
						onremove: function (player, skill) {
							player.removeSkillBlocker(skill);
						},
						charlotte: true,
						skillBlocker: function (skill, player) {
							return !lib.skill[skill].forever && !lib.skill[skill].charlotte;
						},
						marktext: "放逐",
						mark: true,
						intro: {
							markcount: '技能',
							content: function (storage, player, skill) {
								var list = player.getSkills(null, false, false).filter(function (i) {
									return lib.skill.baiban.skillBlocker(i, player);
								});
								if (list.length) return '失效技能：' + get.translation(list);
								return '无失效技能';
							},
						},
					},
					jin: {
						mark: true,
						marktext: "放逐",
						intro: {
							content: '只能使用手中的锦囊牌直到回合结束',
							markcount: '锦囊',
						},
						unique: true,
						charlotte: true,
						onremove: true,
						init: function (player, skill) {
							if (!player.storage[skill]) player.storage[skill] = [];
						},
						mod: {
							cardEnabled: function (card, player) {
								if (!player.getStorage('mbcmfangzhu_jin').includes(get.type2(card))) return false;
							},
							cardSavable: function (card, player) {
								if (!player.getStorage('mbcmfangzhu_jin').includes(get.type2(card))) return false;
							},
						},
					},
				}
			},
			mbjuejin: {
				mark: true,
				intro: { content: "limited" },
				audio: 2,
				enable: 'phaseUse',
				limited: true,
				forever: true,
				owner: 'mb_caomao',
				content: function () {
					"step 0"
					var targets = game.filterPlayer();
					player.awakenSkill('mbjuejin');
					event.list = game.players.slice().sortBySeat(event.player);
					"step 1"
					var target = event.list.shift();
					if (target) {
						if (target.hp > 1) {
							var num = (target.hp - 1);
							target.changeHp(0 - num);
							if (target != player) target.changeHujia(num);
							else target.changeHujia(num + 2);
							//target.addMark("mbcmxscw",1,false);
						} else if (target.hp < 1) {
							var num = (1 - target.hp);
							target.change(num);
							target.changeHujia(num);
							//target.addMark("mbcmxscw",1,false);
						}
						event.redo();
					}
					"step 2"
					var cards = [];
					for (var k = 0; k < ui.cardPile.childNodes.length; k++) {
						var card = ui.cardPile.childNodes[k];
						if (["shan", "tao", "jiu"].includes(get.name(card))) {
							cards.push(card);
						}
					}
					for (var j = 0; j < ui.discardPile.childNodes.length; j++) {
						var card = ui.discardPile.childNodes[j];
						if (["shan", "tao", "jiu"].includes(get.name(card))) {
							cards.push(card);
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						var hs = game.players[i].getCards("h");
						for (var j = 0; j < hs.length; j++) {
							if (["shan", "tao", "jiu"].includes(get.name(hs[j]))) {
								cards.push(hs[j]);
							}
						}
					}
					game.cardsGotoSpecial(cards);
					game.log(cards, '被移出了游戏');
					"step 3"
					game.updateRoundNumber();
					game.sortCard(true);
					game.addGlobalSkill('mbcmxscw');
					game.delay(3);
					player.swapBackground('mbjuejin');
				},
				ai: {
					threaten: 1.6,
					pretao: true,
					order: function (item, player) {
						if (player.countCards('h', 'tao') == 0) return 10;
						if (player.countCards('h', 'tao') > 0) {
							return get.order({
								name: 'tao'
							}) - 1;
						}
					},
					result: {
						player: function (player, target) {
							var nump = game.countPlayer(function (current) {
								if (get.attitude(player, current) > 0) {
									return current.countCards('h', 'tao') + current.countCards('h', 'jiu') + current.countCards('h', 'shan');
								}
							});
							var numt = game.countPlayer(function (current) {
								if (get.attitude(player, current) < 0) {
									return current.countCards('h', 'tao') + current.countCards('h', 'jiu') + current.countCards('h', 'shan');
								}
							});
							var numc = game.countPlayer(function (current) {
								if (get.attitude(player, current) > 0) {
									return current.hp;
								}
							});
							var numb = game.countPlayer(function (current) {
								if (get.attitude(player, current) < 0) {
									return current.hp;
								}
							});
							var numtj = player.countCards('h', 'tao') + player.countCards('h', 'jiu')
							if (nump < numt || numb < numc || (player.hp == 2 && numtj == 0)) return 1;
						},
					},
				},
			},
			mbcmxscw: {
				trigger: {
					global: ['loseAfter', 'equipAfter', 'loseAsyncAfter', 'cardsDiscardAfter'],
				},
				silent: true,
				locked: true,
				direct: true,
				charlotte: true,
				firstDo: true,
				content: function () {
					var cards = [];
					for (i = 0; i < ui.discardPile.childNodes.length; i++) {
						var currentcard = ui.discardPile.childNodes[i];
						if (currentcard.name == 'shan' || currentcard.name == 'tao' || currentcard.name == 'jiu') {
							ui.discardPile.removeChild(currentcard);
							cards.push(currentcard);
							game.log(cards, '被移出游戏');
						}
					}
					game.cardsGotoSpecial(cards);
				}
			},
			mbweitong: {
				audio: 2,
				zhuSkill: true,
				forever: true,
				priority: 10,
				// trigger: {
				// 	global: 'phaseBefore',
				// 	player: 'enterGame',
				// },
				// filter: function (event, player) {
				// 	return (event.name != 'phase' || game.phaseNumber == 0) && game.hasPlayer(current => {
				// 		return current !== player && current.group === 'wei' && player.hasZhuSkill('mbweitong', current);
				// 	});
				// },
				forced: true,
				locked: false,
				// content: function () {
				// 	var num = game.countPlayer(function (current) {
				// 		return current.group == 'wei' && current != player;
				// 	})
				// 	if (num) player.addMark('mbqianlong', num * 20);
				// }
			},
		}
};
}
