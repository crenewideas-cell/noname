// Extracted from character/bingshi.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
			// Create Comparative Attack，创造相对优势，即兵势篇
			ca_taishici: ['male', 'wu', 4, ['cahanzhan', 'cazhanlie', 'cazhenfeng'], ['transform:[ca_taishici,ca_taishici1,ca_taishici2,ca_taishici3,ca_taishici4]']],
		},
"characterSort": {
			bingshi: {
				shi: ['ca_taishici'],
			}
		},
"characterIntro": {
			
		},
"translate": {
			ca_taishici: '势太史慈',
			cahanzhan: '酣战',
			cahanzhan_info: '出牌阶段限一次，你可以选择一名其他角色，你与其依次将手牌数摸至X张（X为各自的体力上限，每次至多摸3张），然后你视为对其使用一张【决斗】。',
			cazhanlie: '战烈',
			cazhanlie_info: '①每名角色的回合开始时，你记录X（X为你此时的攻击范围）。②本回合内的前X张【杀】进入弃牌堆时，若此牌在弃牌堆中，你获得1枚“烈”标记（你至多拥有6枚“烈”标记）。③出牌阶段结束时，你可以移除所有的“烈”标记，然后你视为使用一张无次数限制的【杀】并选择以下至多Y项（Y为你此次移去的“烈”标记数/3,向下取整）：1.此【杀】的目标数+1；2.此【杀】的基础伤害值+1；3.此【杀】需额外弃置一张牌才能响应；4.此【杀】结算完毕后，你摸两张牌。',
			cazhenfeng: '振锋',
			cazhenfeng_backup: '振锋',
			cazhenfeng_info: '限定技，出牌阶段，你可以选择一项：1.回复2点体力；2.将“酣战”和“战烈”中的X分别固定为其中一个选项的数值（当前体力值/已损失体力值/存活角色数）。',

			bingshi: '兵势篇',
		},
"skill": {
			cahanzhan: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filterTarget: lib.filter.notMe,
				selectTarget: 1,
				content: function () {
				    'step 0'
					var num1 = player.maxHp, num2 = target.maxHp;
					if (player.storage.cahanzhan) {
						switch (player.storage.cahanzhan) {
							case '当前体力值':
								num1 = player.hp;
								num2 = target.hp;
								break;
							case '当前已损失体力值':
								num1 = player.maxHp - player.hp;
								num2 = target.maxHp - target.hp;
								break;
							case '场上存活角色数':
								num1 = num2 = game.countPlayer();
								break;
						}
					}
				    player.drawTo(Math.min(num1, player.countCards('h') + 3));
				    target.drawTo(Math.min(num2, target.countCards('h') + 3));
				    'step 1'
				    if (player.canUse({ name: 'juedou', isCard: true }, target, false)) {
				        player.useCard({ name: 'juedou', isCard: true }, target, false);
				    }
				},
				ai: {
					order(item, player) {
						if ((player.countCards('h', { name: 'sha' }) || player.maxHp - player.countCards('h')) > 1) return 10;
						return 1;
					},
					result: {
						target(player, target) {
							return get.effect(target, { name: 'juedou' }, player, player);
						},
					},
				},
			},
			cazhanlie: {
			    audio: 2,
			    trigger: {
			        player: 'phaseUseEnd'
			    },
			    filter: function (event, player) {
			        return player.hasUseTarget({ name: 'sha', isCard: true }, false);
			    },
				direct: true,
			    content: function () {
					player.chooseUseTarget(`###${get.prompt('cazhanlie')}？###移去所有“烈”，视为使用一张无次数限制的【杀】`, { name: 'sha', isCard: true }, false)
						.set('oncard', () => {
							var evt = _status.event, player = evt.player;
							var num = player.countMark('cazhanlie_range');
							player.addTempSkill('cazhanlie_buff');
							player.removeMark('cazhanlie_range', num);
							evt.set('cazhanlie', Math.floor(num / 3));
						});
			    },
			    group: 'cazhanlie_range',
			    subSkill: {
			        range: {
			            trigger: {
			                global: 'phaseBegin'
			            },
			            chatlotte: true,
			            forced: true,
			            content: function () {
							var range = 0;
							if (player.storage.cazhanlie) {
								switch (player.storage.cazhanlie) {
									case '当前体力值':
										range = player.hp;
										break;
									case '当前已损失体力值':
										range = player.maxHp - player.hp;
										break;
									case '场上存活角色数':
										range = game.countPlayer();
										break;
								}
							}
			                else range = player.getAttackRange();
							player.addTempSkill('cazhanlie_gain');
							player.addMark('cazhanlie_gain', range, false);
			            },
						mark: true,
						marktext: '烈',
						intro: {
							name: '烈',
							content: 'mark'
						},
			        },
			        gain: {
			            trigger: {
			                global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter']
			            },
						charlotte: true,
						forced: true,
						onremove: true,
			            filter: function (event, player) {
							if (player.countMark('cazhanlie_range') >= 6 || player.countMark('cazhanlie_gain') == 0) return false;
							var num = event.getd().filter(card => card.name == 'sha').length;
							return num > 0 && player.countMark('cazhanlie_gain') > 0;
			            },
			            content: function () {
							'step 0'
							event.count = Math.min(trigger.getd().filter(card => card.name == 'sha').length, player.countMark('cazhanlie_gain'), 6 - player.countMark('cazhanlie_range'));
							'step 1'
			                player.addMark('cazhanlie_range', 1);
							player.removeMark('cazhanlie_gain', 1, false);
							event.count--;
							if (event.count > 0) event.redo();
			            },
						mark: false,
			        },
					buff: {
						trigger: {
							player: 'useCard1'
						},
						charlotte: true,
						forced: true,
						popup: false,
						filter: function (event, player) {
							return event.cazhanlie;
						},
						content: function () {
							'step 0'
							event.num = trigger.cazhanlie;
							var str = get.translation(trigger.card);
							var list = [
								[0, `选项一：令${str}可以额外指定一个目标`],
								[1, `选项二：令${str}的基础伤害值+1`],
								[2, `选项三：令${str}需额外弃置一张牌才能响应`],
								[3, `选项四：${str}结算完毕后，你摸两张牌`]
							]
							player.chooseButton([`战烈：是否选择至多${get.cnNumber(event.num)}项执行？`, [list, 'textbutton']])
								.set('selectButton', [1, event.num])
								.set('ai', button => {
									var player = _status.event.player, trigger = _status.event.getTrigger();
									switch (button.link) {
										case 0:
											return Math.max(...game.filterPlayer(target => {
												return !trigger.targets?.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
											}).map(target => get.effect(target, trigger.card, player, player)));
										case 1:
											return (trigger.targets || []).reduce((sum, target) => {
												const effect = get.damageEffect(target, player, player);
												return sum + effect * (target.hasSkillTag('filterDamage', null, { player: player, card: trigger.card }) ? 1 : 1 + (trigger.baseDamage || 1) + (trigger.extraDamage || 0));
											}, 0);
										case 2:
											return (trigger.targets || []).reduce((sum, target) => {
												var card = get.copy(trigger.card);
												card.nature = 'stab';
												return sum + get.effect(target, card, player, player);
											}, 0);
										case 3:
											return 2;
									}
								});
							'step 1'
							if (result.bool) {
								var choices = result.links;
								game.log(player, '选择了', '#g【战烈】', '的', '#y' + choices);
								choices.forEach(choice => {
									switch (choice) {
										case 0:
											player.addTempSkill('cazhanlie_tianyi');
											break;
										case 1:
											trigger.baseDamage++;
											game.log(trigger.card, '造成的伤害', '#y+1');
											break;
										case 2:
											player.addTempSkill('cazhanlie_stab');
											player.markAuto('cazhanlie_stab', [trigger.card]);
											break;
										case 3:
											player.addTempSkill('cazhanlie_draw');
											break;
									}
								});
							}
						},
					},
					tianyi: {
						trigger: {
							player: 'useCard2'
						},
						charlotte: true,
						forced: true,
						silent: true,
						onremove: true,
						filter: function (event, player) {
							return event.card && event.card.name == 'sha';
						},
						content: function () {
							'step 0'
							player.chooseTarget(`是否为${get.translation(trigger.card)}增加一个目标？`, (card, player, target) => {
								var evt = _status.event.getTrigger();
								return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
							}).set('ai', target => {
								var player = _status.event.player, evt = _status.event.getTrigger();
								return get.effect(target, evt.card, player);
							});
							'step 1'
							if (result.bool && result.targets.length) {
								player.line(result.targets[0], trigger.card.nature);
								trigger.targets.add(result.targets[0]);
								game.log(result.targets[0], '成为了', trigger.card, '的额外目标');
							}
						},
					},
					stab: {
						trigger: {
							player: ['shaMiss', 'eventNeutralized']
						},
						charlotte: true,
						forced: true,
						silent: true,
						onremove: true,
						filter: function (event, player) {
							if (event.type != 'card' || !event.target.isIn()) return false;
							return player.getStorage('cazhanlie_stab').includes(event.card);
						},
						logTarget: 'target',
						content: function () {
							'step 0'
							var target = trigger.target;
							target.chooseToDiscard(`战烈：弃置一张牌，否则${get.translation(trigger.card)}依然造成伤害`)
								.set('ai', card => {
									var target = _status.event.player, evt = _status.event.getParent();
									if (get.damageEffect(target, evt.player, target, 'stab') < 0) return 8 - get.useful(card);
									return 0;
								});
							'step 1'
							if (!result.bool) {
								if (event.triggername == 'shaMiss') {
									trigger.untrigger();
									trigger.trigger('shaHit');
									trigger._result.bool = false;
									trigger._result.result = null;
								} else trigger.unneutralize();
							}
						},
					},
					draw: {
						trigger: {
							player: 'useCardAfter'
						},
						charlotte: true,
						forced: true,
						silent: true,
						onremove: true,
						filter: function (event, player) {
							return event.card && event.card.name == 'sha';
						},
						content: function () {
							player.draw(2);
						},
					},
			    },
			},
			cazhenfeng: {
				audio: 4,
				enable: 'phaseUse',
				limited: true,
				skillAnimation: true,
				animationColor: 'metal',
				owner: 'ca_taishici',
				filter: function (event, player) {
					return player.isDamaged() || player.hasSkill('cahanzhan') || player.hasSkill('cazhanlie');
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [
							[0, '回复2点体力'],
							[1, '修改〖酣战〗和〖战烈〗描述中的“X”值'],
						];
						return ui.create.dialog('振锋：你可以选择一项', 'hidden', [list, 'textbutton']);
					},
					filter: function (button, player) {
						switch (button.link) {
							case 0:
								return player.isDamaged();
							case 1:
								return player.hasSkill('cahanzhan') || player.hasSkill('cazhanlie');
						}
					},
					prompt: function (links) {
						return `点击“确定”，${links[0] === 0 ? "回复2点体力" : "修改〖酣战〗和〖战烈〗描述中的“X”值"}`;
					},
					check: function (button) {
						var player = _status.event.player;
						if (button.link == 0) return player.hp + player.countCards('h', { name: 'tao' }) < 2;
						if (button.link == 1) {
							var numbers = [player.hp, player.maxHp - player.hp, game.countPlayer()];
							if (numbers.some(c => c > player.getAttackRange())) return Math.max(...numbers) * 2;
						}
						return 0.1;
					},
					backup: function (links) {
						return {
							audio: 'cazhenfeng',
							popname: true,
							link: links[0],
							content: function () {
								'step 0'
								player.awakenSkill('cazhenfeng');
								if (lib.skill.cazhenfeng_backup.link == 0) {
									player.logSkill('cazhenfeng');
									player.recover(2);
									player.swapBackground('cazhenfeng', 1); //弓
									event.finish();
								}
								event.skills = [], event.listx = [];
								if (player.hasSkill('cahanzhan')) event.skills.push('cahanzhan');
								if (player.hasSkill('cazhanlie')) event.skills.push('cazhanlie');
								'step 1'
								if (!event.count) event.count = event.skills.length;
								var list = ['当前体力值', '当前已损失体力值', '场上存活角色数'];
								player.chooseControl(list)
									.set('prompt', `请为${get.translation(event.skills[event.count - 1])}选择一项数值以固定`)
									.set('ai', () => {
										var max = Math.max(player.hp, player.maxHp - player.hp, game.countPlayer());
										if (player.hp == max) return '当前体力值';
										if (player.maxHp - player.hp == max) return '当前已损失体力值';
										if (game.countPlayer() == max) return '场上存活角色数';
									});
								'step 2'
								if (result.control) event.listx.push(result.control);
								event.count--;
								if (event.count > 0) event.goto(1);
								'step 3'
								player.logSkill('cazhenfeng');
								// var map = new Map([['当前体力值', player.hp], ['当前已损失体力值', player.maxHp - player.hp], ['场上存活角色数', game.countPlayer()]]);
								//由于不确定变身规则，故目前仅写出已知规则的变身
								for (var i = 0; i < event.skills.length; i++) {
									player.storage[event.skills[i]] = event.listx[i];
									player.popup(event.skills[i]);
									console.log(player.storage[event.skills[i]]);
									game.log(player, '修改', `#g【${get.translation(event.skills[i])}】`, '的', '#yX', '为', `#g${event.listx[i]}`);
								}
								if (event.listx.length > 1) {
									if (event.listx[0] == '当前体力值') player.swapBackground('cazhenfeng', 3); //剑
									if (event.listx[0] == '当前已损失体力值') player.swapBackground('cazhenfeng', 2); //刀
									if (event.listx[0] == '场上存活角色数') player.swapBackground('cazhenfeng', 4); //戟
								}
							},
						}
					},
				},
			},
		}
};
}
