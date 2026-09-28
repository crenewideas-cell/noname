import { game, ui, _status, ai, lib, get } from "noname";
import { swTool } from "../../main/swTool.js";
const ea = swTool.audioSrc;

export default {
	// Q群风云传
	// 奥利奥
	swq_zhitian: {
		audio: ["dczhizhe", 2],
		hiddenCard: function (player, name) {
			if (player.isTempBanned("swq_zhitian")) return false;
			return lib.inpile.includes(name);
		},
		enable: "chooseToUse",
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) == "basic" || get.type(name) == "trick")
						list.push([get.translation(get.type(name)), "", name]);
					if (name == "sha") {
						for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
					}
				}
				return ui.create.dialog("知天", [list, "vcard"]);
			},
			check(button) {
				const player = get.player();
				if (ui.cardPile.hasChildNodes()) {
					const card = ui.cardPile.firstChild;
					if (player.hasValueTarget(card, true, true)) {
						return button.link[2] == get.name(card);
					}
					return false;
				}
				return get.value(button.link);
			},
			filter: function (button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			backup: function (links, player) {
				return {
					audio: ["dczhizhe", 2],
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
					selectCard: -1,
					filterCard: () => false,
					precontent() {
						player.logSkill("swq_zhitian");
						const cards = get.cards();
						event.result.card = get.autoViewAs({ name: event.result.card.name }, cards);
						event.result.cards = cards;
						delete event.result.skill;
						game.cardsGotoOrdering(cards);
						if (cards[0].name != event.result.card.name) {
							player.tempBanSkill("swq_zhitian");
							player.loseHp();
						}
					},
				};
			},
			prompt: function (links, player) {
				return "将牌堆顶的牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		group: "swq_zhitian_guanxing",
		subSkill: {
			guanxing: {
				trigger: { player: "changeHp" },
				prompt2: function (event, player) {
					return `观看牌堆顶的${get.cnNumber(player.hp + 2)}张牌，并以任意顺序将其置于牌堆顶或牌堆底`;
				},
				filter: function (event, player) {
					return player.hp + 2 > 0;
				},
				async content(event, trigger, player) {
					const cards = get.cards(player.hp + 2);
					await game.cardsGotoOrdering(cards);
					const next = player.chooseToMove();
					next.set("list", [["牌堆顶", cards.filterInD()], ["牌堆底"]]);
					next.set("prompt", "知天：点击或拖动将牌移动到牌堆顶或牌堆底");
					next.processAI = list => {
						const cards = list[0][1],
							player = _status.event.player;
						const top = [];
						const judges = player.getCards("j");
						let stopped = false;
						if (!player.hasWuxie()) {
							for (let i = 0; i < judges.length; i++) {
								const judge = get.judge(judges[i]);
								cards.sort((a, b) => judge(b) - judge(a));
								if (judge(cards[0]) < 0) {
									stopped = true;
									break;
								} else {
									top.unshift(cards.shift());
								}
							}
						}
						let bottom;
						if (!stopped) {
							cards.sort((a, b) => get.value(b, player) - get.value(a, player));
							while (cards.length) {
								if (get.value(cards[0], player) <= 5) break;
								const card = cards.shift()
								if (player.hasValueTarget(card, true, true)) top.unshift(card);
							}
						}
						bottom = cards;
						return [top, bottom];
					};
					const {
						result: { moved },
					} = await next;
					const top = moved[0];
					const bottom = moved[1];
					top.reverse();
					game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
						if (event.top_cards.includes(card)) return ui.cardPile.firstChild;
						return null;
					});
					player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
					game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
					await game.delayx();
				},
			},
			backup: {},
		},
		ai: {
			order: 12,//秀死你们
			result: {
				player: 1,
			},
			save: true,
			respondSha: true,
			respondShan: true,
			respondTao: true,
			skillTagFilter(player, tag, arg) {
				switch (tag) {
					case "save":
					case "respondTao":
					case "respondShan":
					case "respondSha":
						return !player.isTempBanned("swq_zhitian");
				}
			},
		},
	},
	swq_jincui: {
		audio: ["dcjincui", 2],
		enable: 'phaseUse',
		skillAnimation: true,
		animationColor: 'orange',
		limited: true,
		logTarget: "target",
		filterTarget(card, player, target) {
			return player != target;
		},
		ai2(target) {
			const player = get.player();
			return get.effect(target, { name: "sha" }, player, player) > 0 && get.attitude(player, target) < 0;
		},
		async content(event, trigger, player) {
			const { target } = event;
			await player.awakenSkill("swq_jincui");
			await player.loseHp();
			let cards = get.cards(7);
			game.cardsGotoOrdering(cards);
			await player.showCards(cards, get.translation(player) + '的【尽瘁】牌展示');
			while (target.isIn() && cards.length) {
				let have = 0;
				for (let card of cards) {
					if (card.name == 'sha' && player.canUse(card, target, false)) {
						await player.useCard(card, target, false);
						cards.remove(card);
						have = 1;
						break;
					};
				}
				if (!have) break;
			}
			if (target.isIn()) {
				player.removeMark("swq_qideng", 1);
			}
			else if (cards.length) {
				const result = await player.chooseButton(['###【尽瘁】###<div class="text center">你可以选择获得一张牌</div>', [cards, 'card']], false)
					.set("ai", button => {
						const player = get.player(),
							card = button.link;
						return player.getUseValue(card) + 0.01;
					})
					.forResult();
				if (result?.links?.length) {
					player.gain(result.links, 'gain2');
				};
			};
		},
		subSkill: {
			machi: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: {
					global: ["washCard", "die"],
				},
				filter: function (event, player) {
					return player.hasSkill("swq_jincui", null, false, false);
				},
				content: function () {
					player.addSkill("swq_jincui_risutoa");
				},
			},
			risutoa: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { global: "phaseAfter" },
				content: function () {
					if (player.awakenedSkills.includes("swq_jincui")) {
						player.restoreSkill("swq_jincui");
						game.log(player, "重置了", "#g【尽瘁】");
					}
					player.removeSkill("swq_jincui_risutoa");
				},
			},
		},
		ai: {
			order: 9,
			expose: 1,
			threaten: 1.2,
		}
	},
	swq_qideng: {
		audio: ["dcqingshi", 2],
		marktext: "灯",
		intro: {
			name: "七星灯",
			content: "当前有#个灯",
		},
		onremove: true,
		trigger: {
			player: "dyingBegin",
		},
		forced: true,
		filter(event, player) {
			return event.getParent(2)?.name != "swq_qideng";
		},
		async content(event, trigger, player) {
			if (player.countMark("swq_qideng") > 0) {
				const num = 1 - player.getHp(true);
				if (num > 0) {
					player.removeMark("swq_qideng", num);
					await player.recoverTo(1);
				}
			}
			else {
				await player.loseHp();
			}
		},
		group: "swq_qideng_init",
		subSkill: {
			init: {
				audio: ["dcqingshi", 2],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				charlotte: true,
				forced: true,
				async content(event, trigger, player) {
					player.addMark("swq_qideng", 7);
				},
			},
		},
		ai: {
			threaten: function (player, target) {
				if (player.countMark("swq_qideng") > 1) return (1 / player.countMark("swq_qideng")) + 0.4;
				else return 1.5;
			}
		}
	},
	swq_zhongyuan: {
		audio: `${ea}swq_shouwang:2`,
		marktext: "愿",
		intro: {
			name: "许愿值",
			content: "当前有#点“许愿值”",
		},
		trigger: {
			global: ["swq_zhongyuan_gain_backupAfter"],
		},
		forced: true,
		filter(event, player) {
			// let current = player.additionalSkills?.swq_zhongyuan?.length ?? 0;
			// let target =
			// 	player.countMark("swq_zhongyuan") == lib.skill.swq_zhongyuan.maxMarkCount
			// 		? lib.skill.swq_zhongyuan.derivation.length
			// 		: player.countMark("swq_zhongyuan");
			// return target > current;
			return true;
		},
		persevereSkill: true,
		beginMarkCount: 0,
		maxMarkCount: 12,
		derivation: ["swq_houzai", "swq_lieqi", "swq_youquan", "swq_shengxi", "swq_shenguang"],
		addMark(player, num) {
			num = Math.min(num, lib.skill.swq_zhongyuan.maxMarkCount - player.countMark("swq_zhongyuan"));
			player.addMark("swq_zhongyuan", num);
		},
		async content(event, trigger, player) {
			const derivation = lib.skill.swq_zhongyuan.derivation,
				skills =
					player.countMark("swq_zhongyuan") == lib.skill.swq_zhongyuan.maxMarkCount
						? derivation
						: derivation.slice(0, Math.floor(player.countMark("swq_zhongyuan")));
			player.addAdditionalSkill("swq_zhongyuan", skills, false);
		},
		global: ["swq_zhongyuan_gain", "swq_zhongyuan_add"],
		subSkill: {
			gain: {
				enable: "phaseUse",
				usable: 1,
				persevereSkill: true,
				filter(event, player) {
					return game.filterPlayer(p => p.hasSkill("swq_zhongyuan"))?.length > 0;
				},
				chooseButton: {
					dialog() {
						return ui.create.dialog("###终愿###" + "你可以失去任意点体力并摸等量的牌");
					},
					chooseControl(event, player) {
						const list = [];
						for (let i = 1; i <= player.hp; i++) {
							const cn = get.cnNumber(i, true);
							list.push(cn);
						}
						list.push("cancel2");
						return list;
					},
					backup(result, player) {
						return {
							number: result.control,
							discard: false,
							lose: false,
							delay: false,
							async content(event, trigger, player) {
								const number = get.info(event.name)?.number;
								let loseNum = 1;
								for (let i = 1; i <= player.hp; i++) {
									if (number == get.cnNumber(i, true)) {
										loseNum = i;
										break;
									}
								}
								await player.loseHp(loseNum);
								await player.draw(loseNum);
								const list2 = game.filterPlayer(p => p.hasSkill("swq_zhongyuan"));
								for (const p of list2) {
									player.line(p);
									lib.skill.swq_zhongyuan.addMark(p, loseNum * 2);
									await p.recover(1);
								}
							},
						};
					},
				},
			},
			add: {
				trigger: {
					global: ["swq_shenguangAfter", "swq_shengxiAfter", "swq_youquanAfter", "swq_lieqiAfter", "swq_houzaiAfter"],
				},
				direct: true,
				filter(event, player) {
					return true;
				},
				persevereSkill: true,
				async content(event, trigger, player) {
					const derivation = lib.skill.swq_zhongyuan.derivation,
						skills =
							player.countMark("swq_zhongyuan") == lib.skill.swq_zhongyuan.maxMarkCount
								? derivation
								: derivation.slice(0, Math.floor(player.countMark("swq_zhongyuan")));
					player.addAdditionalSkill("swq_zhongyuan", skills, false);
				},
			}
		}
	},
	swq_shenguang: {
		audio: `${ea}swq_shouwang:1`,
		persevereSkill: true,
		limited: true,
		skillAnimation: false,
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("swq_zhongyuan") >= 5;
		},
		filterTarget(card, player, target) {
			return true;
		},
		deadTarget: true,
		async contentBefore(event, trigger, player) {
			if (typeof swTool.playSkillVideo === "function") {
				game.broadcastAll(function () {
					swTool.playSkillVideo("shouwang", 6700);
				})
				await game.delay(0, 6700);
			}
		},
		async content(event, trigger, player) {
			await player.awakenSkill(event.name);
			player.removeMark("swq_zhongyuan", 5);
			const { target } = event;
			if (target.isDead()) {
				await target.reviveEvent(5);
			}
			else {
				await target.recoverTo(5);
			}
			await target.draw(3);
			target.addTempSkill("swq_shenguang_mianyi", { player: "phaseBeginStart" });
		},
		subSkill: {
			mianyi: {
				trigger: { player: "damageBefore" },
				mark: true,
				forced: true,
				charlotte: true,
				init: function (player) {
					game.log(player, "获得了", "【免疫】");
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nothunder: true,
					nodamage: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, "damage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
				intro: {
					content: "防止一切伤害",
				},
			},
		},
	},
	swq_shengxi: {
		audio: `${ea}swq_shouwang:1`,
		persevereSkill: true,
		trigger: { player: "dieBefore" },
		limited: true,
		filter(event, player) {
			if (!(event.getParent().name !== "giveup" && player.maxHp > 0)) {
				return false;
			}
			return player.countMark("swq_zhongyuan") >= 4;
		},
		async content(event, trigger, player) {
			await player.awakenSkill(event.name);
			player.removeMark("swq_zhongyuan", 4);
			trigger.cancel();
			await player.recoverTo(player.maxHp);
		},
		ai: {
			save: true,
		},
	},
	swq_youquan: {
		audio: `${ea}swq_shouwang:1`,
		persevereSkill: true,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (player.countMark("swq_zhongyuan") < 3) return false;
			return game.hasPlayer(current => current.isDamaged());
		},
		logTarget: "targets",
		async cost(event, trigger, player) {
			const damaged = game.filterPlayer(current => current.isDamaged());
			if (!damaged.length) return;
			event.result = await player
				.chooseTarget(
					"幽泉：选择至多两名已受伤角色，各恢复1点体力",
					[1, 2],
					(card, player, target) => target.isDamaged()
				)
				.set("ai", target => get.attitude(get.player(), target))
				.forResult();
		},
		async content(event, trigger, player) {
			if (!event.targets?.length) return;
			player.removeMark("swq_zhongyuan", 3);
			for (const target of event.targets.sortBySeat(player)) {
				await target.recover(1);
			}
		},
	},
	swq_lieqi: {
		audio: `${ea}swq_shouwang:1`,
		persevereSkill: true,
		trigger: { source: "damageEnd" },
		filter(event, player) {
			return event.num > 0 && player.countMark("swq_zhongyuan") >= 2;
		},
		logTarget: "targets",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					"烈祈：是否选择一名角色获得一个随机伤害性技能直到其回合结束。"
				)
				.set("ai", button => get.attitude(get.player(), button.link))
				.forResult();
		},
		async content(event, trigger, player) {
			if (!event?.targets?.length) return;
			const target = event.targets[0];

			if (!_status.damageSkills) {
				if (!lib.skill.olzhouxi?.initList) return;
				lib.skill.olzhouxi.initList();
			}
			const damageSkills = _status.damageSkills || [];
			const candidates = damageSkills.filter(skill => !target.hasSkill(skill, null, null, false));
			const chosenSkill = candidates.randomGets(1)[0];
			if (!chosenSkill) return;

			player.removeMark("swq_zhongyuan", 2);
			await target.addTempSkills(chosenSkill, { player: "phaseEnd" });
			//player.line(target);
		},
	},
	swq_houzai: {
		audio: `${ea}swq_shouwang:1`,
		persevereSkill: true,
		usable: 1,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (player.hasSkill("swq_houzai_used")) return;
			if (player.countMark("swq_zhongyuan") < 1 || !player.getCards("he").some(card => get.type(card) === "equip")) return false;
			for (let i = 0; i < lib.inpile.length; i++) {
				const name = lib.inpile[i];
				if (name == "sha") {
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
					for (var nature of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) return true;
					}
				}
				else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
				else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (let i = 0; i < lib.inpile.length; i++) {
					const name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
						}
					}
					else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
				}
				return ui.create.dialog("厚载", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "swq_houzai",
					filterCard(card) {
						return get.type(card) === "equip";
					},
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "he",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent(player) {
						player.logSkill("swq_houzai");
						player.removeMark("swq_zhongyuan", 1);
						player.addTempSkill("swq_houzai_used");
					},
				};
			},
			prompt(links, player) {
				return `将一张装备牌当做` + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			return lib.inpile.includes(name) && !player.hasSkill("swq_houzai_used");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			respondTao: true,
			save: true,
			order: 5,
			result: {
				player: 1
			},
		},
		group: ["swq_houzai_draw"],
		subSkill: {
			draw: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "respondAfter"] },
				forced: true,
				popup: false,
				direct: true,
				filter(event, player) {
					return event.skill == "swq_houzai_backup";
				},
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
			used: { charlotte: true },
		}
	},
	swq_xinsui: {
		//audio: `${ea}swq_shouwang:2`,
		zhuSkill: true,
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			return (
				player.isIn() &&
				event.player != player &&
				event.player.group == "key"
			);
		},
		forced: true,
		locked: false,
		logTarget: "player",
		async content(event, trigger, player) {
			lib.skill.swq_zhongyuan.addMark(player, 1);
			//player.line(trigger.player);
		},
	},
	swq_tsk_distance: {
		charlotte: true,
		onremove(player, skill) {
			delete player.storage[skill];
		},
		init: function (player) {
			player.storage.swq_tsk_distance ??= [0, 0];
		},
		intro: {
			markcount: (storage = [0, 0]) => {
				return storage[0] + storage[1];
			},
			content: function (storage) {
				if (!storage || !Array.isArray(storage) || storage.length != 2) return '';
				const num = storage[0] + storage[1];
				if (num > 0) return '与其他角色的距离+' + num;
				if (num < 0) return '与其他角色的距离' + num;
				return '距离无修正';
			},
		},
		mod: {
			globalFrom: function (from, to, distance) {
				if (from.storage.swq_tsk_distance && from.storage.swq_tsk_distance?.length == 2) {
					return distance + from.storage.swq_tsk_distance[0] + from.storage.swq_tsk_distance[1];
				}
				return distance;
			},
			globalTo: function (from, to, distance) {
				if (to.storage.swq_tsk_distance && to.storage.swq_tsk_distance?.length == 2) {
					return distance + to.storage.swq_tsk_distance[0] + to.storage.swq_tsk_distance[1];
				}
				return distance;
			},
		},
	},
	swq_gushou: {
		trigger: {
			global: 'damageEnd',
		},
		forced: true,
		locked: true,
		// The phaseAfter callback below already clears this turn's victims.
		init: function (player) {
			player.disableEquip(1);
			player.addSkill("swq_tsk_distance");
			player.storage.swq_tsk_distance ??= [0, 0];
		},
		onremove(player, skill) {
			if (player.storage.swq_tsk_distance?.length == 2) {
				player.storage.swq_tsk_distance[0] = 0;
			}
			delete player.storage.swq_gushou;
		},
		filter: function (event, player) {
			if (!event.player?.isIn()) return false;
			const victims = player.getStorage("swq_gushou", []);
			if (victims.includes(event.player)) return false;
			return get.distance(player, event.player, "attack") <= player.getAttackRange();
		},
		async content(event, trigger, player) {
			await player.draw();
			const result = await player.chooseControl('+1', '-1').set('prompt', '选择令你与其他角色的距离+1或-1').set('ai', function () {
				const player = _status.event.player;
				if (player.hp <= 2) return '+1';
				return '-1';
			}).forResult();
			if (result.control == '+1') {
				player.storage.swq_tsk_distance[0]++;
			} else {
				player.storage.swq_tsk_distance[0]--;
			}
			player.markSkill('swq_tsk_distance');
			player.logSkill("swq_gushou", trigger.player);
			if (!player.storage.swq_gushou) {
				player.when({ global: "phaseAfter" }).step(async () => player.unmarkSkill("swq_gushou"));
			}
			player.markAuto("swq_gushou", trigger.player);
		},
		intro: {
			content: "已对$发动过",
			onunmark: true
		},
	},
	swq_buce: {
		trigger: {
			global: 'phaseBegin',
		},
		init: function (player) {
			player.addSkill("swq_tsk_distance");
			player.storage.swq_tsk_distance ??= [0, 0];
		},
		mark: true,
		marktext: "☯",
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
		},
		intro: {
			content(storage) {
				if (!storage) return "每名角色的回合开始时，你可以摸X张牌并令你至其他角色的距离-X（X为你与当前回合角色的距离）。";
				return "每名角色的回合开始时，你可以弃置至多Y张牌并令你至其他角色的距离+Y（Y为你弃置的牌数且至多为你的体力上限）。";
			},
		},
		onremove(player, skill) {
			if (player.storage.swq_tsk_distance?.length == 2) {
				player.storage.swq_tsk_distance[1] = 0;
			}
		},
		filter: function (event, player) {
			return event.player && event.player.isIn();
		},
		async cost(event, trigger, player) {
			const isYin = !!player.storage.swq_buce;
			const prompt2 = isYin
				? `弃置至多${player.maxHp}张手牌并令你至其他角色的距离+Y（Y为弃牌数）`
				: `摸X张牌并令你至其他角色的距离-X（X为你与${get.translation(trigger.player)}的距离）`;
			event.result = await player
				.chooseBool(get.prompt("swq_buce"), prompt2)
				.set("ai", () => {
					if (isYin) {
						return player.hp <= 2 || player.countCards("h") > player.maxHp;
					}
					return true;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			if (!player.storage.swq_buce) {
				const x = Math.max(0, get.distance(player, target));
				if (x > 0) {
					await player.draw(x);
					player.storage.swq_tsk_distance[1] -= x;
					player.markSkill("swq_tsk_distance");
					game.log(player, "通过【步测】令距离修正", "#y-" + x);
				}
			} else {
				const maxDiscard = Math.min(player.maxHp, player.countCards("h", card => lib.filter.cardDiscardable(card, player, "swq_buce")));
				let y = 0;
				if (maxDiscard > 0) {
					const result = await player
						.chooseToDiscard("he", [1, maxDiscard], "步测：弃置至多" + maxDiscard + "张牌")
						.set("ai", card => 8 - get.value(card))
						.forResult();
					y = result?.cards?.length || 0;
				}
				if (y > 0) {
					player.storage.swq_tsk_distance[1] += y;
					player.markSkill("swq_tsk_distance");
					game.log(player, "通过【步测】令距离修正", "#y+" + y);
				}
			}
			player.changeZhuanhuanji("swq_buce");
		},
	},
	swq_xiaobing: {
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		locked: false,
		filter: function (event, player) {
			const hs = event.getl(player)?.hs;
			if (!hs?.length) return false;
			for (const card of hs) {
				if (get.type(card) == "equip" && get.subtype(card) == "equip1") {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const hs = trigger.getl(player)?.hs || [];
			let totalDraw = 0;
			for (const card of hs) {
				if (get.type(card) == "equip" && get.subtype(card) == "equip1") {
					const nameLength = get.translation(card.name).length;
					totalDraw = Math.max(totalDraw, nameLength);
				}
			}
			if (totalDraw > 0) {
				await player.draw(totalDraw);
				game.log(player, "通过【销兵】摸了", totalDraw, "张牌");
			}
		},
	},
	// 岁儿
	swq_wanxiang: {
		audio: `${ea}swq_suier:2`,
		comboSkill: true,
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					const evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt?.card && get.type2(evt.card) == "basic" && !evt.swq_wanxiang && get.type2(card) == "trick") {
						return num + 10;
					}
				}
			},
		},
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			const { card } = event;
			if (!card || get.type2(card) != "trick") return false;
			const evt = lib.skill.dcjianying.getLastUsed(player, event);
			if (!evt || !evt.card || evt.swq_wanxiang) return false;
			return get.type2(evt.card) == "basic";
		},
		logTarget: "targets",
		async cost(event, trigger, player) {
			const x = Math.max(0, trigger.targets?.length || 0);
			event.result = await player
				.chooseTarget(get.prompt2("swq_wanxiang"), (card, pl, target) => target.isIn())
				.set("ai", target => (x > 0 ? -target.countCards("h") : 0) + get.attitude(player, target) * 0.1)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.set(event.name, true);
			const x = Math.max(0, trigger.targets?.length || 0);
			const target = event.targets?.[0];
			if (!target?.isIn()) return;
			if (x > 0) {
				const take = Math.min(x, target.countCards("hes"));
				if (take > 0) {
					const r = await target.chooseCard("hes", take, take, true, "万象：将" + get.cnNumber(take) + "张牌置于" + get.translation(player) + "的武将牌上").forResult();
					if (r?.bool && r.cards?.length) {
						const next = player.addToExpansion(r.cards, target, "give");
						next.gaintag.add("swq_wanxiang");
						await next;
					}
				}
			}
			const num = player.getCards("x", c => c.hasGaintag("swq_wanxiang")).length;
			if (num > game.countPlayer()) {
				await player.tempBanSkill("swq_wanxiang");
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		marktext: "象",
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: ["swq_wanxiang_turn"],
		subSkill: {
			mark: {
				init(player, skill) {
					const evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt?.card && get.type2(evt.card) == "basic" && !evt.swq_wanxiang) {
						player.addTip(skill, "万象 可连击");
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				trigger: {
					player: ["useCard1", "useCardAfter"],
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (event.triggername == "useCard1") {
						if (get.type2(trigger.card) == "basic") {
							player.addTip(event.name, "万象 可连击");
						} else {
							player.removeTip(event.name);
						}
					} else if (trigger.swq_wanxiang) {
						player.removeTip(event.name);
					}
				},
			},
			turn: {
				audio: `swq_wanxiang`,
				trigger: { player: "phaseBegin" },
				forced: true,
				filter(event, player) {
					return player.countCards("x", c => c.hasGaintag("swq_wanxiang"));
				},
				async content(event, trigger, player) {
					const cards = player.getCards("x", c => c.hasGaintag("swq_wanxiang"));
					const n = cards.length;
					if (n) {
						await player.gain(cards, "gain2");
						await player.chooseToGuanxing(n);
					}
				},
			},
		},
	},
	swq_wendao: {
		audio: `${ea}swq_suier:2`,
		mark: true,
		marktext: "☯",
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
		},
		intro: {
			content(storage) {
				if (!storage) {
					return '失去1点体力，视为使用一张无距离限制的雷【杀】。';
				}
				return '回复1点体力，视为使用一张目标须包含自己的【铁索连环】。';
			},
		},
		group: ["swq_wendao_yang", "swq_wendao_yin"],
		subSkill: {
			yang: {
				audio: `swq_wendao`,
				usable: 1,
				trigger: { target: "useCardToTargeted" },
				filter(event, player) {
					if (event.swq_wendao_done) return false;
					if (player.storage.swq_wendao) return false;
					if (event.target != player) return false;
					if (!event.player || event.player == player || !event.player.isIn()) return false;
					return event.player.hp >= player.hp;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseBool(get.prompt("swq_wendao"), "阳：失去1点体力，视为使用一张无距离限制的雷【杀】")
						.set("ai", () => true)
						.forResult();
				},
				async content(event, trigger, player) {
					trigger.swq_wendao_done = true;
					await player.loseHp();
					await player.addTempSkill("swq_wendao_sha_ai", { player: "useCardAfter" });
					const vcard = get.autoViewAs({ name: "sha", nature: "thunder", isCard: true }, []);
					try {
						await player.chooseUseTarget(vcard, true, false);
					} finally {
						player.removeSkill("swq_wendao_sha_ai");
					}
					player.changeZhuanhuanji("swq_wendao");
				},
			},
			yin: {
				audio: "swq_wendao",
				usable: 1,
				trigger: { target: "useCardToTargeted" },
				filter(event, player) {
					if (event.swq_wendao_done) return false;
					if (!player.storage.swq_wendao) return false;
					if (event.target != player) return false;
					if (!event.player || event.player == player || !event.player.isIn()) return false;
					return event.player.hp >= player.hp;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseBool(get.prompt("swq_wendao"), "阴：回复1点体力，视为使用一张目标须包含自己的【铁索连环】")
						.set("ai", () => true)
						.forResult();
				},
				async content(event, trigger, player) {
					trigger.swq_wendao_done = true;
					await player.recover();
					const others = game.filterPlayer(p => p != player && p.isIn());
					let ts = [player];
					if (others.length) {
						const r = await player
							.chooseTarget("问道：你可以选择【铁索连环】的另一名目标", lib.filter.notMe)
							.set("ai", t => get.effect(t, { name: "tiesuo" }, player, player))
							.forResult();
						if (r?.bool && r.targets?.[0]) ts.push(r.targets[0]);
					}
					const vcard = get.autoViewAs({ name: "tiesuo", isCard: true }, []);
					await player.useCard(vcard, ts, false);
					player.changeZhuanhuanji("swq_wendao");
				},
			},
			sha_ai: {
				charlotte: true,
				mod: {
					targetInRange() {
						return true;
					},
				},
			},
		},
	},
	swq_dingxu: {
		manualConfirm: true,
		audio: `${ea}swq_suier:2`,
		skillAnimation: false,
		limited: true,
		animationColor: "water",
		enable: "phaseUse",
		filter(event, player) {
			return player.getStorage("swq_dingxu_snapshots", []).length > 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill("swq_dingxu");
			const snaps = player.getStorage("swq_dingxu_snapshots", []);
			if (!snaps.length) return;
			const names = snaps.map((_, i) => "记录" + (i + 1));
			const ctrl = await player
				.chooseControl(...names)
				.set("prompt", "定序：选择要回溯的快照")
				.set("ai", () => 0)
				.forResult();
			if (ctrl.control == "cancel2" || !names.includes(ctrl.control)) return;

			if (typeof swTool.playSkillVideo === "function") {
				game.broadcastAll(function () {
					swTool.playSkillVideo("suier", 7300);
				})
				await game.delay(0, 7300);
			}

			const snap = snaps[names.indexOf(ctrl.control)];

			for (let list of snap) {
				if (list?.length != 2) continue;
				const target = list[0];
				if (!target.isIn()) continue;
				const obj = list[1];
				target.removeSkill(target.skills.filter(skill => skill != "swq_wanxiang"));
				const hs = target.countCards("hejxs", card => !player.getExpansions("swq_wanxiang").includes(card));
				if (hs > 0) {
					const next = target.lose(target.getCards("hejxs").filter(card => !player.getExpansions("swq_wanxiang").includes(card)));
					next._triggered = null;
					await next;
				}
			}

			const restore = [];

			for (let list of snap) {
				if (list?.length != 2) continue;
				const target = list[0];
				if (!target.isIn()) continue;
				const obj = list[1];
				if (!target.isIn()) continue;
				// obj.state.expansions ??= [];
				// obj.state.expansions.addArray(target.getExpansions("swq_wanxiang"));
				const cards = target.getExpansions("swq_wanxiang");
				if (cards?.length) restore.push([target, cards]);

				game.broadcastAll((player, name1, name2) => {
					player.init(name1, name2);
				}, target, obj.state?.name1, obj.state?.name2)
				const additionalSkills = Object.values(obj.additionalSkills).flat();
				target.addSkill(obj.skills.filter(skill => skill != "swq_wanxiang" && !additionalSkills.includes(skill)));
				for (const key of Object.keys(obj.additionalSkills)) {
					const value = obj.additionalSkills?.[key];
					if (value) target.addAdditionalSkill(key, value);
				}
				game.broadcastAll((player, obj) => {
					player.actionHistory = obj.actionHistory;
					player.stat = obj.stat;
					player.storage = obj.storage;

					player.awakenedSkills = obj.awakenedSkills;
					player.disabledSkills = obj.disabledSkills;
					player.forbiddenSkills = obj.forbiddenSkills;

					let info = obj.state;

					if (info.name && info.name != info.name1) {
						player.name = info.name;
					}
					if (!info.unseen) {
						player.classList.remove("unseen");
					}
					if (!info.unseen2) {
						player.classList.remove("unseen2");
					}
					if (!player.isUnseen(2) && player.storage.nohp) {
						delete player.storage.nohp;
						player.node.hp.show();
					}
					player.group = info.group;
					player.node.name.dataset.nature = get.groupnature(info.group);
					player.hp = info.hp;
					player.maxHp = info.maxHp;
					player.hujia = info.hujia;
					player.sex = info.sex;
					player.disabledSlots = info.disabledSlots;
					player.expandedSlots = info.expandedSlots;
					player.extraEquip = info.extraEquip;
					if (info.linked) {
						player.addLink();
					}
					else {
						player.removeLink();
					}
					if (info.turnedover) {
						player.classList.add("turnedover");
					}
					else {
						player.classList.remove("turnedover");
					}
					if (info.disableJudge) {
						player.$disableJudge();
					}
					player.$syncDisable();
					if (info.extraEquip) {
						player.$handleEquipChange();
					}
					player.directgain(info.handcards.filter(card => !card.hasGaintag("swq_wanxiang")));
					for (let i = 0; i < info.equips.length; i++) {
						let card = info.equips[i],
							id = card.cardid,
							map = info.equips_map[id];
						card.fix();
						card.style.transform = "";
						card.classList.remove("drawinghidden");
						delete card._transform;
						if (map.isViewAsCard) {
							card.isViewAsCard = true;
							if (map._destroyed_Virtua) {
								card._destroyed_Virtua = map._destroyed_Virtua;
							}
							if (map.destroyed) {
								card.destroyed = map.destroyed;
							}
							card.cards = map?.vcard?.cards || [];
							card.viewAs = map?.vcard?.name || card.name;
							card.classList.add("fakeequip");
						} else {
							card.classList.remove("fakeequip");
							delete card.viewAs;
						}
						if (map.name2) {
							card.node.name2.innerHTML = map.name2;
						}
						if (map.vcard) {
							const cardSymbol = Symbol("card");
							card.cardSymbol = cardSymbol;
							card[cardSymbol] = map.vcard;
							if (map.vcard.subtypes) {
								card.subtypes = map.vcard.subtypes;
							}
							if (map.vcard.cards?.length) {
								for (let j of map.vcard.cards) {
									j.goto(ui.special);
									j.destiny = player.node.equips;
								}
							}
							player.addVirtualEquip(map.vcard, map.vcard.cards);
						}
						let equipped = false,
							equipNum = get.equipNum(card);
						if (player.node.equips.childNodes.length) {
							for (let i = 0; i < player.node.equips.childNodes.length; i++) {
								if (get.equipNum(player.node.equips.childNodes[i]) >= equipNum) {
									equipped = true;
									player.node.equips.insertBefore(card, player.node.equips.childNodes[i]);
									break;
								}
							}
						}
						if (equipped === false) {
							player.node.equips.appendChild(card);
						}
					}
					for (let i = 0; i < info.judges.length; i++) {
						let card = info.judges[i],
							id = card.cardid,
							map = info.judges_map[id];
						card.fix();
						card.style.transform = "";
						card.classList.remove("drawinghidden");
						delete card._transform;
						if (map.isViewAsCard) {
							card.isViewAsCard = true;
							if (map._destroyed_Virtua) {
								card._destroyed_Virtua = map._destroyed_Virtua;
							}
							if (map.destroyed) {
								card.destroyed = map.destroyed;
							}
							card.cards = map?.vcard?.cards || [];
							card.viewAs = map?.vcard?.name || card.name;
							card.classList.add("fakejudge");
						} else {
							card.classList.remove("fakejudge");
							delete card.viewAs;
						}
						if (map.name2) {
							card.node.name2.innerHTML = map.name2;
						}
						if (map.vcard) {
							const cardSymbol = Symbol("card");
							card.cardSymbol = cardSymbol;
							card[cardSymbol] = map.vcard;
							if (map.vcard.subtypes) {
								card.subtypes = map.vcard.subtypes;
							}
							if (map.vcard.cards?.length) {
								for (let j of map.vcard.cards) {
									j.goto(ui.special);
									j.destiny = player.node.judges;
								}
							}
							player.addVirtualJudge(map.vcard, map.vcard.cards);
						}
						player.node.judges.insertBefore(card, player.node.judges.firstChild);
					}
					for (let i = 0; i < info.handcards.length; i++) {
						info.handcards[i].addGaintag(info.gaintag[i]);
					}
					for (let i = 0; i < info.specials.length; i++) {
						info.specials[i].classList.add("glows");
					}

					// if (info.expansions.length) {
					// 	let expansion_gaintag = [];
					// 	player.$addToExpansion(info.expansions, false, null, false);
					// 	for (var i = 0; i < info.expansions.length; i++) {
					// 		if(!info.expansions[i]?.gaintag) continue;
					// 		expansion_gaintag.push(info.expansions[i]?.gaintag[0]);
					// 		info.expansions[i].addGaintag(expansion_gaintag[i]);
					// 		expansion_gaintag.addArray(expansion_gaintag[i]);
					// 	}
					// 	for (var i of expansion_gaintag) {
					// 		player.markSkill[i];
					// 	}
					// }
					if (info.expansions.length) {
						var expansion_gaintag = [];
						player.$addToExpansion(info.expansions);
						for (var i = 0; i < info.expansions.length; i++) {
							info.expansions[i].addGaintag(info.expansion_gaintag[i]);
							expansion_gaintag.addArray(info.expansion_gaintag[i]);
						}
						for (var i of expansion_gaintag) {
							player.markSkill[i];
						}
					}

					for (let i = 0; i < info.judges.length; i++) {
						if (info.views[i] && info.views[i] != info.judges[i]) {
							info.judges[i].classList.add("fakejudge");
							info.judges[i].viewAs = info.views[i];
							info.judges[i].node.background.innerHTML = lib.translate[info.views[i] + "_bg"] || get.translation(info.views[i])[0];
						}
						player.node.judges.appendChild(info.judges[i]);
					}
					ui.updatej(player);
					player.update();
					player.$update();

				}, target, obj);
				target.skills.forEach(skill => {
					if (target.storage[skill]) target.markSkill(skill);
					// debugger
					// const info = get.info(skill);
					// if(info.mark) {
					// 	target.markSkill(skill);
					// }
				})
			}

			for (let list of restore) {
				const target = list[0];
				const next = target.addToExpansion(list[1], "gain2");
				next.gaintag.add("swq_wanxiang");
				await next;
			}
			game.log(player, "发动了", "#g【定序】", "的回溯效果");
			const result = await player.chooseTarget(true, 1, "请选择〖定序〗的目标，使其获得所有「象」并获得一个额外回合").set("ai", (target) => get.attitude(get.player(), target)).forResult();
			if (result?.bool && result?.targets?.length) {
				const target = result.targets[0];
				const cards = player.getExpansions("swq_wanxiang");
				if (cards?.length) {
					await target.gain(cards, "gain2");
				}
				target.insertPhase();
				player.line(target);
			}
			player.awakenSkill("swq_dingxu");
		},
		persevereSkill: true,
		group: ["swq_dingxu_record_game", "swq_dingxu_die"],
		subSkill: {
			record_game: {
				audio: "swq_dingxu",
				persevereSkill: true,
				trigger: {
					global: ["roundStart", "dyingAfter"],
				},
				filter(event, player, name) {
					if (name === "roundStart") return game.roundNumber === 1;
					return event.player?.isIn();
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseBool("〖定序〗：是否记录当前全场状态（至多两份）？")
						.set("ai", () => get.event()?.getTrigger()?.name === "roundStart")
						.forResult();
				},
				async content(event, trigger, player) {
					const snap = game.filterPlayer(current => current.isIn()).map(p => [p, {
						state: p.getState(),
						skills: get.copy(p.skills),
						actionHistory: get.copy(p.actionHistory),
						stat: get.copy(p.stat),
						storage: get.copy(p.storage),
						additionalSkills: get.copy(p.additionalSkills),
						awakenedSkills: get.copy(p.awakenedSkills),
						disabledSkills: get.copy(p.disabledSkills),
						forbiddenSkills: get.copy(p.forbiddenSkills),
					}]);
					player.storage.swq_dingxu_snapshots ??= [];
					player.storage.swq_dingxu_snapshots.push(snap);
					if (player.storage.swq_dingxu_snapshots.length > 2) player.storage.swq_dingxu_snapshots = player.storage.swq_dingxu_snapshots.slice(-2);
					game.log(player, "记录了一份", "#g【定序】", "状态");
				},
			},
			die: {
				audio: "swq_dingxu",
				skillAnimation: false,
				animationColor: "water",
				trigger: { global: "dieBegin" },
				filter(event, player) {
					return player.getStorage("swq_dingxu_snapshots", []).length > 0 && !player.awakenedSkills?.includes("swq_dingxu");
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseBool("〖定序〗：是否将全场角色状态回溯至某一时刻？")
						.set("ai", () => {
							const target = get.event()?.getTrigger()?.player;
							if (target && get.event()?.player) {
								return get.attitude(get.event().player, target) > 0 ? true : false;
							}
							return true;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					trigger.cancel();
					await lib.skill.swq_dingxu.content(event, trigger, player);
				},
			},
		},
	},
	// 屑桃宝
	swq_xiangfu: {
		audio: `${ea}swq_xietaobao:2`,
		mark: true,
		marktext: "赴",
		init(player) {
			player.storage.swq_xiangfu_used ??= { sha: 0, jiu: 0, shan: 0, tao: 0 };
		},
		intro: {
			markcount(storage, player) {
				const limit = lib.skill.swq_xiangfu.getLimit();
				const used = player.storage.swq_xiangfu_used || {};
				return ["sha", "jiu", "shan", "tao"].filter(name => (used[name] || 0) < limit).length;
			},
			content(storage, player) {
				const limit = lib.skill.swq_xiangfu.getLimit();
				const used = player.storage.swq_xiangfu_used || {};
				const lines = lib.skill.swq_xiangfu.cardList.map(({ name }) => {
					const left = Math.max(0, limit - (used[name] || 0));
					return `${get.translation(name)}（${lib.skill.swq_xiangfu.getDiffText(name)}）：${limit - left}`;
				});
				lines.unshift(`本轮上限：${limit}`);
				return lines.join("<br>");
			},
		},
		cardList: [
			{ name: "sha", diff: 3, mode: "min" },
			{ name: "jiu", diff: 2, mode: "exact" },
			{ name: "shan", diff: 1, mode: "exact" },
			{ name: "tao", diff: 0, mode: "exact" },
		],
		getLimit() {
			return 1;// game.filterPlayer(p => p.hasSkill("swq_xiangfu")).length
		},
		getLastTarget(player) {
			const history = player.getHistory("useSkill", evt => evt.skill === "swq_xiangfu" && evt.targets?.length);
			return history[history.length - 1]?.targets?.[0] ?? null;
		},
		getDiffRule(name) {
			return lib.skill.swq_xiangfu.cardList.find(i => i.name === name);
		},
		getDiffText(name) {
			const rule = lib.skill.swq_xiangfu.getDiffRule(name);
			if (!rule) return "";
			if (rule.mode === "min") return `差≥${rule.diff}`;
			return `差${rule.diff}`;
		},
		matchHandDiff(player, target, name) {
			if (!target || target === player) return false;
			const rule = lib.skill.swq_xiangfu.getDiffRule(name);
			if (!rule) return false;
			const diff = Math.abs(player.countCards("h") - target.countCards("h"));
			if (rule.mode === "min") return diff >= rule.diff;
			return diff === rule.diff;
		},
		canUseType(event, player, name) {
			if (player.isTempBanned("swq_xiangfu")) return false;
			const limit = lib.skill.swq_xiangfu.getLimit();
			if (!limit) return false;
			const used = player.storage.swq_xiangfu_used?.[name] || 0;
			if (used >= limit) return false;
			if (!game.hasPlayer(p => lib.skill.swq_xiangfu.matchHandDiff(player, p, name))) return false;
			const card = get.autoViewAs({ name, isCard: true }, []);
			return event.filterCard(card, player, event);
		},
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (player.isTempBanned("swq_xiangfu")) return false;
			if (!lib.skill.swq_xiangfu.getLimit()) return false;
			return lib.skill.swq_xiangfu.cardList.some(({ name }) => lib.skill.swq_xiangfu.canUseType(event, player, name));
		},
		hiddenCard(player, name) {
			const evt = _status.event;
			if (!evt || !lib.skill.swq_xiangfu.cardList.some(i => i.name === name)) return false;
			return lib.skill.swq_xiangfu.canUseType(evt, player, name);
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const { name } of lib.skill.swq_xiangfu.cardList) {
					if (!lib.skill.swq_xiangfu.canUseType(event, player, name)) continue;
					list.push(["基本", "", name]);
				}
				return ui.create.dialog("相赴", [list, "vcard"]);
			},
			check(button) {
				const player = get.player();
				const name = button.link[2];
				return player.getUseValue({ name, isCard: true }) + (name === "tao" ? 3 : name === "shan" ? 2 : 1);
			},
			filter(button, player) {
				const evt = get.event()?.getParent();
				return lib.skill.swq_xiangfu.canUseType(evt, player, button.link[2]);
			},
			backup(links, player) {
				return {
					xiangfu_name: links[0][2],
					audio: "swq_xiangfu",
					filterCard() {
						return false;
					},
					selectCard: -1,
					log: false,
					async precontent(event, trigger, player) {
						const skill = "swq_xiangfu";
						const cardName = get.info(skill + "_backup")?.xiangfu_name;
						if (!cardName) {
							event.result.bool = false;
							event.getParent().goto(0);
							return;
						}
						const diffText = lib.skill.swq_xiangfu.getDiffText(cardName);
						const choose = await player
							.chooseTarget(
								1,
								get.prompt(skill),
								`请选择一名与你手牌数${diffText}的其他角色`,
								function (card, pl, target) {
									return lib.skill.swq_xiangfu.matchHandDiff(pl, target, get.event().xiangfu_name);
								}
							)
							.set("xiangfu_name", cardName)
							.set("ai", function (target) {
								const pl = get.player();
								const name = get.event().xiangfu_name;
								if (!lib.skill.swq_xiangfu.matchHandDiff(pl, target, name)) return -1;
								return get.attitude(pl, target) + 1;
							})
							.forResult();
						if (!choose?.bool || !choose.targets?.[0]) {
							event.result.bool = false;
							event.getParent().goto(0);
							return;
						}
						const target = choose.targets[0];
						// const lastTarget = lib.skill.swq_xiangfu.getLastTarget(player);
						// if (target == lastTarget) {
						// 	player.tempBanSkill("swq_xiangfu", { player: "phaseAfter" });
						// }
						player.logSkill(skill, target);
						const ph = player.countCards("h"),
							th = target.countCards("h");
						if (ph !== th) {
							const more = ph > th ? player : target;
							const less = ph > th ? target : player;
							if (more.countCards("h")) {
								await more.chooseToDiscard(1, "h", true).forResult();
							}
							await less.draw();
						}
						player.storage.swq_xiangfu_used ??= { sha: 0, jiu: 0, shan: 0, tao: 0 };
						player.storage.swq_xiangfu_used[cardName]++;
						player.markSkill(skill);
						const viewAs = get.autoViewAs({ name: cardName, isCard: true }, []);
						game.broadcastAll(
							function (v, sk) {
								lib.skill[sk + "_backup2"].viewAs = v;
							},
							viewAs,
							skill
						);
						event.result.card = viewAs;
						delete event.result.targets;
						const evt = event.getParent();
						evt.set("_backupevent", `${skill}_backup2`);
						evt.set("openskilldialog", "相赴：请选择【" + get.translation(cardName) + "】的目标");
						evt.backup(skill + "_backup2");
						evt.set("norestore", true);
						evt.set("custom", {
							add: {},
							replace: { window() { } },
						});
						evt.set("swq_xiangfu_target", target);
						evt.goto(0);
					},
				};
			},
			prompt(links, player) {
				return `相赴：选择要视为使用的【${get.translation(links[0][2])}】`;
			},
		},
		ai: {
			order: 5,
			respondSha: true,
			respondShan: true,
			respondTao: true,
			save: true,
			result: { player: 1 },
		},
		group: ["swq_xiangfu_reset"],
		subSkill: {
			backup2: {
				audio: "swq_xiangfu",
				filterCard() {
					return false;
				},
				selectCard: -1,
				popname: true,
				log: false,
				viewAs: { name: "sha", isCard: true },
				async precontent(event, trigger, player) {
					const chooseEvt = event.getParent("chooseToUse") || event.getParent("chooseToRespond");
					const target = chooseEvt?.swq_xiangfu_target;
					player
						.when({ player: ["useCardAfter", "respondAfter"] })
						.filter(evt => evt.getParent() == event.getParent())
						.step(async (event, trigger, player) => {
							event.set("swq_xiangfu_target", target);
							await event.trigger("swq_xiangfu_backup");
						});
				},
			},
			reset: {
				charlotte: true,
				trigger: { global: "roundStart" },
				forced: true,
				popup: false,
				filter(event, player) {
					return player.hasSkill("swq_xiangfu", null, false, false);
				},
				async content(event, trigger, player) {
					player.storage.swq_xiangfu_used = { sha: 0, jiu: 0, shan: 0, tao: 0 };
					player.markSkill("swq_xiangfu");
				},
			},
		},
	},
	swq_zhishou: {
		audio: `${ea}swq_xietaobao:1`,
		trigger: { player: ["swq_xiangfu_backup"] },
		filter(event, player) {
			const target = event?.swq_xiangfu_target;
			const old = player.storage.swq_zhishou_grant;
			if (old == target) return false;
			return target && target !== player && target.isIn();
		},
		countUse(player) {
			return player.getAllHistory("useSkill", evt => evt.skill === "swq_zhishou").length;
		},
		async cost(event, trigger, player) {
			const target = trigger.swq_xiangfu_target;
			const old = player.storage.swq_zhishou_grant;
			let prompt2 = `是否令${get.translation(target)}视为拥有【相赴】，直至你再次发动【执手】？`;
			if (old?.isIn() && old !== target) {
				prompt2 = `是否结束对${get.translation(old)}的【相赴】赋予，并改为令${get.translation(target)}视为拥有【相赴】？`;
			}
			event.result = await player
				.chooseBool(get.prompt("swq_zhishou"), prompt2)
				.set("ai", () => {
					const player = get.player();
					const target = trigger.swq_xiangfu_target;
					return get.attitude(player, target) > 0;
				})
				.forResult();
		},
		logTarget: "swq_xiangfu_target",
		async content(event, trigger, player) {
			const target = trigger.swq_xiangfu_target;
			const old = player.storage.swq_zhishou_grant;
			if (old?.isIn()) {
				old.removeAdditionalSkills("swq_zhishou");
			}
			player.removeStorage("swq_zhishou_grant");
			await target.addAdditionalSkills("swq_zhishou", "swq_xiangfu");
			player.setStorage("swq_zhishou_grant", target);
			game.log(player, "令", target, "视为拥有", "#g【相赴】");
			if (lib.skill.swq_zhishou.countUse(player) === 1) {
				game.log(player, "本局首次发动", "#g【执手】", "，使用牌无距离和次数限制");
				player.addSkill("swq_zhishou_buff");
			}
			else {
				player.removeSkill("swq_zhishou_buff");
			}
		},
		onremove(player) {
			const grant = player.storage.swq_zhishou_grant;
			if (grant?.isIn()) grant.removeAdditionalSkills("swq_zhishou");
			delete player.storage.swq_zhishou_grant;
		},
		group: ["swq_zhishou_die"],
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					targetInRange(card, player) {
						return true;
					},
					cardUsable(card, player, num) {
						return Infinity;
					},
				},
				// intro: {
				// 	content(player) {
				// 		const num = lib.skill.swq_zhishou.countUse(player);
				// 		if (num === 1) {
				// 			return "使用牌无距离和次数限制";
				// 		}
				// 		if (num === 0) {
				// 			return "本局未发动过〖执手〗";
				// 		}
				// 		return `本局已发动${num}次〖执手〗`;
				// 	},
				// },
			},
			die: {
				charlotte: true,
				trigger: { player: "die" },
				forced: true,
				popup: false,
				forceDie: true,
				async content(event, trigger, player) {
					const grant = player.storage.swq_zhishou_grant;
					if (grant?.isIn()) grant.removeAdditionalSkills("swq_zhishou");
				},
			},
		},
	},
	//睡死
	swq_xinjie: {
		audio: `${ea}swq_shuisi:1`,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return true;
		},
		filterTarget(card, player, target) {
			return target.isIn();
		},
		ai2(target) {
			const player = get.event().player;
			if (_status.currentPhase === player) return target = player;
			else {
				const target1 = game.filterPlayer(p => get.attitude(player, p) <= 0 && (p.getHp() == 1 || p.isMaxHp())).randomGet();
				const target2 = game.filterPlayer(p => true).randomGet();
				return target == target1 || target == target2;
			}
			return false;
		},
		selectTarget: 1,
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const beforeHp = target.getHp();
			const respondedCard = trigger?.card;
			const result = await player
				.chooseControl(["选项一", "选项二"], true)
				.set("prompt", `新界：令${get.translation(target)}执行一项`)
				.set("choiceList", [
					"失去1点体力，然后回复1点体力",
					"回复1点体力，然后失去1点体力",
				])
				.set("targetx", target)
				.set("ai", () => {
					const target = get.event()?.targetx;
					const player = get.event()?.player;
					if (get.attitude(player, target) > 0) {
						if (target.isMaxHp()) return "选项一";
						else return "选项二";
					}
					else {
						if (target.isMaxHp()) return "选项二";
						else return "选项一";
					}
				})
				.forResult();
			if (!result?.control) return;
			if (result.control === "选项一") {
				await target.loseHp();
				await target.recover();
			}
			else {
				await target.recover();
				await target.loseHp();
			}
			const afterHp = target.getHp();
			if (afterHp < beforeHp) {
				await player.draw(1);
			}
			else if (afterHp === beforeHp) {
				const excludeType = respondedCard ? get.type(respondedCard) : null;
				const types = ["basic", "trick", "equip"].filter(t => t !== excludeType);
				const cards = [];
				for (const t of types) {
					const card = get.cardPile(c => get.type(c) === t);
					if (card) cards.push(card);
				}
				await player.gain(cards, "gain2");
			}
			else {
				const iceSha = get.autoViewAs({ name: "sha", nature: "ice", isCard: true }, []);
				await player.useCard(iceSha, player, false);
			}
		},
		group: ["swq_xinjie_respond"],
		subSkill: {
			respond: {
				trigger: { player: ["useCard", "respond"] },
				filter(event, player) {
					return Array.isArray(event.respondTo) && event.respondTo[0] != player;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("新界：是否选择一名角色执行后续效果", (card, player, target) => true)
						.set("ai", (target) => {
							const player = get.event().player;
							if (_status.currentPhase === player) return target = player;
							else {
								const target1 = game.filterPlayer(p => get.attitude(player, p) <= 0 && (p.getHp() == 1 || p.isMaxHp())).randomGet();
								const target2 = game.filterPlayer(p => true).randomGet();
								return target == target1 || target == target2;
							}
							return false;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					await get.info("swq_xinjie")?.content(event, trigger, player);
				},
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
				target(player, target) {
					if (target.hp < target.maxHp) return 1;
					return 0.5;
				},
			},
		},
	},
	swq_duwo: {
		audio: `${ea}swq_shuisi:1`,
		forced: true,
		group: ["swq_duwo_noself", "swq_duwo_die", "swq_duwo_changeHp"],
		subSkill: {
			noself: {
				audio: "swq_duwo",
				trigger: { player: "useCard" },
				forced: true,
				priority: 1,
				filter(event, player) {
					return true;
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray([player]);
				},
			},
			die: {
				audio: "swq_duwo",
				trigger: { player: "die" },
				forceDie: true,
				forced: true,
				filter(event, player) {
					return game.hasPlayer(current => current != player);
				},
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget("独我：选择一名其他角色获得〖独我〗", true, lib.filter.notMe)
						.set("ai", target => -get.attitude(player, target))
						.forResult();
					if (result.bool && result.targets[0]) {
						player.line(result.targets[0]);
						await result.targets[0].addSkills("swq_duwo");
					}
				},
			},
			changeHp: {
				trigger: {
					player: ["changeHp"],
				},
				forced: true,
				charlotte: true,
				filter(event, player) {
					return !player.hasSkill("swq_duwo_unlock");
				},
				async content(event, trigger, player) {
					player.addTempSkill("swq_duwo_unlock");
				},
			},
			unlock: {
				charlotte: true,
			},
		},
		mod: {
			cardname(card, player) {
				if (player.hasSkill("swq_duwo_unlock")) {
					return;
				}
				if (["trick", "delay"].includes(lib.card?.[card.name]?.type)) {
					return "wuxie";
				}
				if (["basic"].includes(lib.card?.[card.name]?.type)) {
					return "shan";
				}
			},
		},
		ai: {
			respondShan: true,
			respondWuxie: true,
			skillTagFilter(player, tag) {
				if (tag === "respondShan" || tag === "respondWuxie") {
					const round = _status.globalHistory[_status.globalHistory.length - 1];
					return !round?.changeHp?.some(evt => evt.player == player);
				}
				return true;
			},
		},
	},
	swq_shuigu: {
		audio: `${ea}swq_shuisi:1`,
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		trigger: { global: "dying" },
		filter(event, player) {
			return event.player != player && event.player.isIn();
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const count = game.getAllGlobalHistory("everything", evt => {
				if (evt.name != "dying" || evt.player != target) {
					return false;
				}
				return true;
			}).length;
			event.result = await player
				.chooseBool(`睡梏：是否失去1点体力并对${get.translation(target)}造成${count}点伤害？（本局已进入濒死${count}次）`)
				.set("targetx", target)
				.set("ai", () => {
					const target = get.event()?.targetx;
					const player = get.event()?.player;
					return get.damageEffect(target, player, player) < 0 && count > 1 && get.attitude(player, target) <= 0;
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseHp(1);
			const target = trigger.player;
			const count = game.getAllGlobalHistory("everything", evt => {
				if (evt.name != "dying" || evt.player != target) {
					return false;
				}
				return true;
			}).length;
			target.when({ player: ["dyingAfter", "die"] })
				.assign({
					forceDie: true
				})
				.filter(evt => true)
				.step(async (event2, trigger2, player2) => {
					if (trigger2.name == "die") {
						player.restoreSkill("swq_shuigu");
						game.log(player, "重置了", "#g【睡梏】");
					}
				});
			player.line(target);
			const damageEvent = target.damage(count, player);
			await damageEvent;
			// if (damageEvent.num > 0 && target.isDying()) {
			// 	trigger.reason = damageEvent;
			// 	trigger.source = player;
			// }
		},
		ai: {
			expose: 0.5,
		},
	},
	// 陆古寿
	swq_duannian: {
		audio: "sbluoshen",
		persevereSkill: true,
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		trigger: { player: "dyingAfter" },
		check(event, player) {
			//是的孩子们我有天眼
			return !game.hasPlayer(current => {
				return get.attitude(current, player) > 1 &&
					current.canSave(player)
			}) || game
				.getAllGlobalHistory("everything", evt => {
					return evt.name == "dying" && evt.player == player;
				})
				.length >= 2
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const controlDeleteNum = player.getStorage("swq_duannian_dnum", 0);
			let list = [
				["draw", `摸${Math.max(0, 4 - player.getStorage("swq_duannian_dnum", 0))}张牌并回复1点体力`],//
				["reset", `重置该技能并删除该技能最后一个选项`],
				["gain", `获得一名其他角色的一个技能`],
				["level", `升级〖讥讽〗`],
			];
			list.length = list.length - controlDeleteNum;
			const num = Math.min(game
				.getAllGlobalHistory("everything", evt => {
					return evt.name == "dying" && evt.player == player;
				})
				.length - player.getStorage("swq_duannian_LastDyingNum", 0),
				list.length
			);
			const result = await player
				.chooseButton([
					"###" + get.prompt("swq_duannian") + `###<div class="text center">选择依次执行至多${get.cnNumber(num)}项</div>`,
					[
						list,
						"textbutton"
					]
				],
					[1, num])
				.set("num", num)
				.set("ai", button => {
					const player = get.player();
					var num = 0;
					const priority = {
						draw: () => {
							return Math.max(0, 4 - player.getStorage("swq_duannian_dnum", 0)) * 2 + 2;
						},
						gain: () => {
							const skills = game.players.map(p => p.getSkills(null, false, false).map(c => [p, c])).flat(1)
							skills.randomSort();
							skills.sort((a, b) => get.skillRank(b[1], "inout") - get.skillRank(a[1], "inout"));
							return get.skillRank(skills[0][1], "inout") * 2.8;// 1.0 - 2.0 左右
						},
						reset: () => {
							return get.event("num") == 1 ? 0 : 10;
						},
						level: () => {
							return 5.6
						},
					};
					return priority[button.link]() || 0;
				})
				.set('complexSelect', true)
				.forResult();
			if (result?.bool && result?.links?.length) {
				player.setStorage("swq_duannian_LastDyingNum", num);
				if (result?.links?.includes("draw")) {
					await player.draw(Math.max(0, 4 - player.getStorage("swq_duannian_dnum", 0)));
					await player.recover(1);
				}
				if (result?.links?.includes("reset")) {
					player.restoreSkill("swq_duannian");
					game.broadcastAll((player, num) => {
						player.setStorage("swq_duannian_dnum", num + 1);
					}, player, player.getStorage("swq_duannian_dnum", 0))
				}
				if (result?.links?.includes("gain")) {
					//await player.loseMaxHp(1);
					const result2 = await player
						.chooseTarget(
							"断念：获得一名其他角色的一个技能",
							(card, player, target) => {
								return target !== player && target.getSkills(null, false, false).length
							},
							true
						)
						.set("ai", target => {
							const skills = game.players.map(p => p.getSkills(null, false, false).map(c => [p, c])).flat(1)
							skills.randomSort();
							skills.sort((a, b) => get.skillRank(b[1], "inout") - get.skillRank(a[1], "inout"));
							return skills[0][0];
						})
						.forResult();
					if (result2?.targets && result2?.targets.length) {
						const tar = result2.targets[0];
						const targetSkills = tar.getSkills(null, false, false).filter(skill => {
							const info = get.info(skill);
							if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) return false;
							return true;
						});
						if (!targetSkills || targetSkills.length == 0) return;
						player.line(tar);
						const control = await player
							.chooseControl(targetSkills)
							.set(
								"choiceList",
								targetSkills.map(skill => {
									return `<div class="skill">【${get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2))}】</div><div>${get.skillInfoTranslation(skill, tar)}</div>`;
								})
							)
							.set("displayIndex", false)
							.set("prompt", "断念：选择获得一个技能")
							.set("tar", tar)
							.set("ai", (event) => {
								const skills = get.event("tar").getSkills(null, false, false)
								skills.randomSort();
								skills.sort((a, b) => get.skillRank(b, "inout") - get.skillRank(a, "inout"));
								return skills[0];
							})
							.forResultControl();
						await player.addSkills(control);
					}
				}
				if (result?.links?.includes("level")) {
					game.broadcastAll((player) => {
						player.setStorage("swq_jifeng", 1);
						// player.setStorage("swq_juejing", 1);
					}, player)
				}
			}
		},
		ai: {
			threaten: 0.9,
		}
	},
	swq_jifeng: {
		audio: "qingguo",
		enable: "phaseUse",
		usable: Infinity,
		derivation: ["swq_jifeng_lv2"],
		logTarget: "target",
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.swq_jifeng.filterTarget(null, player, target));
		},
		filterTarget(event, player, target) {
			return player.canCompare(target) && !target.hasSkill("swq_jifeng_baiban") && !target.hasSkill("swq_jifeng_fengyin");
		},
		onremove(player, skill) {
			game.players.forEach(current => {
				current.removeSkill(["swq_jifeng_baiban", "swq_jifeng_fengyin"]);
			});
		},
		ai2(target) {
			const player = get.player();
			return -get.attitude(player, target) + 1;
		},
		async content(event, trigger, player) {
			const { target } = event;
			await player.draw(1 + player.getStorage("swq_jifeng", 0));//1 +
			await player.damage(player, 1);
			if (player.countCards('h') <= 0) {
				player.addSkill("swq_jifeng_baiban")
				event.finish();
			}
			const result = await player.chooseToCompare(target)

				.forResult();
			const winsay = ["就这？就这？", `肺雾${target.nickname ? target.nickname.slice(0, 4) : get.translation(target.name)}`, "不玩神山识玩什么？"];
			const losesay = ["闹麻了", "感觉被做局了", "唉，孩子们"];
			if (result?.bool) {
				const { winner, num1, num2 } = result
				if (winner === player) {
					if (player.getStorage("swq_jifeng", 0) == 0) {
						target.addTempSkill("swq_jifeng_baiban", { player: "phaseBegin" });
					}
					else {
						//target.addTempSkill("swq_jifeng_baiban", { player: "phaseBegin" });
						target.addTempSkill("swq_jifeng_fengyin", { player: "phaseBegin" });
					}
					player.chat(winsay.randomGet())
				}
				else {
					player.addTempSkill("swq_jifeng_baiban", { player: "phaseBegin" });
					player.chat(losesay.randomGet())
				}
			}
			else {
				player.addTempSkill("swq_jifeng_baiban", { player: "phaseBegin" });
				player.chat(losesay.randomGet())
			}
			// const bool = await player.chooseBool()
			// 	.set("prompt", "###〖讥讽〗###" + "是否对自己造成1点伤害？")
			// 	.set("ai", () => {
			// 		if(_status.currentPhase === player)  {
			// 			if (player.getHp() <= 1) return true;
			// 			return false;
			// 		}
			// 		else {
			// 			return player.countCards("h") <= 3
			// 		}
			// 	})
			// 	.forResultBool();
			// if(bool) {
			// 	await player.damage(player);
			// }
			// if(player.getHistory("useSkill", evt => {
			// 	return evt.skill == event.name;
			// }).length == 1) {
			// 	player.when({
			// 		player: ["phaseBegin"],
			// 	}).then(() => {
			// 		game.players.forEach(current => {
			// 			current.removeSkill(["swq_jifeng_baiban", "swq_jifeng_fengyin"]);
			// 		});
			// 	})
			// }
		},
		group: "swq_jifeng_recover",
		subSkill: {
			baiban: {
				popup: false,
				nopop: true,
				init: function (player, skill) {
					player.addSkillBlocker(skill);
					player.addTip(skill, "非锁定技失效");
				},
				onremove: function (player, skill) {
					player.removeSkillBlocker(skill);
					player.removeTip(skill);
				},
				charlotte: true,
				skillBlocker: function (skill, player) {
					return !lib.skill[skill].persevereSkill && !lib.skill[skill].charlotte && !get.is.locked(skill, player);
				},
				mark: true,
				marktext: "讥",
				intro: {
					content: function (storage, player, skill) {
						var list = player.getSkills(null, false, false).filter(function (i) {
							return lib.skill.fengyin.skillBlocker(i, player);
						});
						if (list.length) return "失效技能：" + get.translation(list);
						return "无失效技能";
					},
				},
			},
			fengyin: {
				popup: false,
				nopop: true,
				init(player, skill) {
					player.addSkillBlocker(skill);
					player.addTip(skill, "讥讽 技能失效");
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
					player.removeTip(skill);
				},
				inherit: "baiban",
				marktext: "讥",
			},
			recover: {
				trigger: { player: "dying" },
				filter(event, player) {
					return event.reason?.name == "damage" && event.reason.getParent()?.name == "swq_jifeng";
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.recoverTo(1);
				},
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			}
		},
	},
	swq_juejing: {
		audio: "luoshen",
		//derivation: ["swq_juejing_lv2"],
		init: () => {
			game.addGlobalSkill("swq_juejingGlobal");
		},
		ai: {
			threaten: function (player, target) {
				if (!player.hasSkill("swq_jifeng_baiban") && player.getHp() <= 1) return 0.5;
				else return 1;
			}
		}
	},
	swq_juejingGlobal: {
		audio: "luoshen",
		trigger: { player: "dyingBegin" },
		firstDo: true,
		ruleSkill: true,
		usable(skill, player) {
			return 1 + player.getStorage("swq_juejing", 0);
		},
		filter(event, player) {
			const skills = player.getSkills(null, false, false).slice(0)
			// if(player.getHistory("useSkill", evt => {
			// 	return evt.skill == "swq_juejingGlobal";
			// }).length >= 2) return false;
			return skills.includes("swq_juejing") && !game.filterSkills(skills, player).includes("swq_juejing")
		},
		async content(event, trigger, player) {
			await player.recoverTo(1);
			await player.draw(2);
			await player.removeSkill("swq_jifeng_baiban");
		},
		//group: "swq_juejingGlobal_damage",
		subSkill: {
			damage: {
				enable: "phaseUse",
				manualConfirm: true,
				prompt: "出牌阶段限一次，你可以对自己造成1点伤害。",
				audio: "luoshen",
				usable: 1,
				filter(event, player) {
					const skills = player.getSkills(null, false, false).slice(0)
					return skills.includes("swq_juejing") && !game.filterSkills(skills, player).includes("swq_juejing")
				},
				async content(event, trigger, player) {
					await player.damage(1, player);
				},
			}
		}
	},
	// 心动
	swq_qingnian: {
		mark: true,
		marktext: "☯",
		//popup: false,
		usable: 3,
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "swq_xindong" }, "swq_xindong" + (player.storage[skill] ? "_shadow" : ""));
		},
		intro: {
			content(storage) {
				if (!storage) return "当你不因使用而失去手牌时，你可以将手牌摸至体力上限并随机明置一名其他角色的X张手牌。（X为你本次失去牌的数量）";
				return "当你不因使用而失去手牌时，你可以明置一张手牌并弃置一名其他角色的至多X张牌，然后你将被弃置的牌以任意顺序置于牌堆顶或牌堆底。（X为你本次失去牌的数量）";
			},
		},
		audio: "xingchong",
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			//if (player.getStorage("swq_qingnian_used").includes(player.storage.swq_qingnian ? "yin" : "yang")) return false;
			if (event.name == "lose" && event.getParent().name == "useCard") return false;
			if (player.storage.swq_qingnian && player.countCards("h", function (card) {
				return !get.is.shownCard(card);
			}) <= 0) return false;
			return event.getl(player)?.hs?.length;
		},
		check(event, player) {
			return true;
		},
		async cost(event, trigger, player) {
			const num = trigger.getl(player)?.hs?.length || 1;
			if (player.storage.swq_qingnian) {
				event.result = await player.chooseCardTarget({
					filterCard(card) {
						return !get.is.shownCard(card);
					},
					filterTarget(card, player, target) {
						return target != player && target.countCards('he');
					},
					selectCard: 1,
					position: "h",
					prompt: get.prompt("swq_qingnian"),
					prompt2: "明置" + get.cnNumber(1) + `张手牌并弃置一名其他角色的至多${num}张牌。`,
					ai1(card) {
						return 15 - get.value(card);
					},
					ai2(target) {
						var player = get.player();
						return -get.attitude(player, target) + 1;
					},
				}).forResult();
			} else {
				event.result = await player.chooseTarget(1, get.prompt("swq_qingnian"), `将手牌摸至体力上限并随机明置一名其他角色的${num}张手牌`,
					function (card, player, target) {
						return target != player && target.countCards('h', card => !get.is.shownCard(card));
					})
					.set("ai", function (target) {
						var player = get.player();
						return -get.attitude(player, target) + 1;
					})
					.forResult();
			}
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const num = trigger.getl(player)?.hs?.length || 1;
			const target = event?.targets?.[0];
			//await player.logSkill("swq_qingnian", target);
			//player.addTempSkill("swq_qingnian_used");
			//player.markAuto("swq_qingnian_used", [player.storage.swq_qingnian ? "yin" : "yang"]);
			player.changeZhuanhuanji("swq_qingnian");
			if (player.storage.swq_qingnian) {
				await player.drawTo(player.maxHp);
				//await player.line(target);
				const cards = target.getCards('h', card => !get.is.shownCard(card)).randomGets(num);
				await target.addShownCards(cards, "visible_swq_qingnian");
				await target.showCards(cards, get.translation(player) + "对" + get.translation(target) + `发动了【${get.translation("swq_qingnian")}】`);
			} else {
				await player.addShownCards(event.cards, "visible_swq_qingnian");
				await player.showCards(event.cards);
				const result = await player.discardPlayerCard(target, "he", false, [1, num]).forResult();
				if (result?.bool && result?.cards?.length) {
					const { moved } = await player
						.chooseToMove()
						.set("list", [["牌堆顶", result?.cards], ["牌堆底"]])
						.set("prompt", "倾念：将这些牌置于牌堆顶或牌堆底")
						.set("processAI", function (list) {
							var cards = list[0][1],
								player = _status.event.player;
							var target = _status.currentPhase?.next;
							var att = get.sgn(get.attitude(player, target));
							var top = [];
							var stopped = false;
							if (target) {
								var judges = target.getCards("j");
								if (player != target || !target.hasWuxie()) {
									for (var i = 0; i < judges.length; i++) {
										var judge = get.judge(judges[i]);
										cards.sort(function (a, b) {
											return (judge(b) - judge(a)) * att;
										});
										if (judge(cards[0]) * att < 0) {
											stopped = true;
											break;
										} else {
											top.unshift(cards.shift());
										}
									}
								}
							}
							var bottom;
							if (!stopped) {
								cards.sort(function (a, b) {
									return (get.value(b, player) - get.value(a, player)) * att;
								});
								while (cards.length) {
									if (get.value(cards[0], player) <= 5 == att > 0) break;
									top.unshift(cards.shift());
								}
							}
							bottom = cards;
							return [top, bottom];
						})
						.forResult();
					const top = moved[0];
					const bottom = moved[1];
					top.reverse();
					game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
						if (event.top_cards.includes(card)) return ui.cardPile.firstChild;
						return null;
					});
					player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
					game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
					await game.delayx();
				}
			}
		},
		group: "swq_qingnian_change",
		subSkill: {
			change: {
				audio: "xingchong",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【倾念】为状态" + (player.storage.swq_qingnian ? "阳" : "阴");
				},
				check: () => true,
				content() {
					player.changeZhuanhuanji("swq_qingnian");
				},
			},
			used: { charlotte: true, onremove: true },
		},
		ai: {
			expose: 0.4,
			result: {
				player: 2,
				target: -2,
			},
			noh: true,
			skillTagFilter(player, tag, arg) {
				if (tag == "noh") {
					//if (player.getStorage("swq_qingnian_used").includes(player.storage.swq_qingnian ? "yin" : "yang")) return false;
					if (player.storage.swq_qingnian) return !(player.countCards('h') >= 1);
					return true;
				}
			},
		},
	},
	swq_lunqi: {
		filter(event, player) {
			return player.countCards("h", card => lib.filter.cardDiscardable(card, player, "swq_lunqi"));
		},
		audio: "liunian",
		usable: 1,
		enable: "phaseUse",
		popup: false,
		chooseButton: {
			dialog() {
				return ui.create.dialog("###论契###" + get.translation("swq_lunqi_info"));
			},
			chooseControl(event, player) {
				var suits = [],
					hs = player.getCards("h", card => lib.filter.cardDiscardable(card, player, "swq_lunqi"));
				for (var i of hs) {
					var suit = get.suit(i, player);
					suits.add(suit);
				}
				suits.push("cancel2");
				return suits;
			},
			check(event, player) {
				var suits = [],
					hs = player.getCards("h", card => lib.filter.cardDiscardable(card, player, "swq_lunqi"));
				for (var i of hs) {
					var suit = get.suit(i, player);
					suits.add(suit);
				}
				if (!suits?.length) return false;
				const arr = suits.map(x => [x, suits.filter(y => y === x).length])
					.sort((a, b) => b[1] - a[1])
				if (player.storage.swq_qingnian) {
					//需要保留至少一张手牌进行明置
					const num = player.countCards('h');
					for (let i in arr) {
						if (arr[i][1] != num) return arr[i][0];
					}
					return false;
				}
				else {
					return arr[0][0];
				}
			},
			backup(result, player) {
				return {
					audio: "liunian",
					suit: result.control,
					discard: false,
					lose: false,
					delay: false,
					async content(event, trigger, player) {
						const suit = get.info(event.name)?.suit;
						const cards = player.getCards("h", card => get.suit(card, player) == suit);
						await player.modedDiscard(cards);
						await player.line(game.filterPlayer())
						await player
							.chooseToDebate(
								game.filterPlayer()
							)
							.set("callback", async event => {
								const result = event.debateResult;
								if (result?.bool) {
									const { black, red } = result;
									let num = Math.abs((black?.length || 0) - (red?.length || 0))
									if (num === 0) return;
									const res2 = await player.chooseTarget(2, get.prompt("swq_lunqi"), `你可以选择两名角色交换他们的至多${num}张手牌`, false, function (card, player, target) {
										return target.countCards("h") > 0;
									}).set("ai", function (target) {
										const player = get.player();
										let num = player.countCards('h', card => 7 - get.value(card));
										if (player.storage.swq_qingnian &&
											//!player.getStorage("swq_qingnian_used").includes(player.storage.swq_qingnian ? "yin" : "yang") &&
											num == player.countCards('h') &&
											num > 0
										) {
											num--;//阴状态保留至少一张手牌，其他的无所谓了
										}
										if (ui.selected?.targets?.length == 0) {
											if (target === player) {
												//return !player.getStorage("swq_qingnian_used").includes(player.storage.swq_qingnian ? "yin" : "yang") ? 100 : num * 2.5;
												return num * 2.5;
											}
											else return get.attitude(player, target);
										}
										else {
											//return -get.attitude(player, target) || (!player.getStorage("swq_qingnian_used").includes(player.storage.swq_qingnian ? "yin" : "yang") && !player.storage.swq_qingnian ? Math.random() : 0);
											return -get.attitude(player, target) || (!player.storage.swq_qingnian ? Math.random() : 0);
										}
									}).forResult();
									if (res2?.bool && res2?.targets.length == 2) {
										res2.targets.sortBySeat();
										const p1 = res2.targets[0],
											p2 = res2.targets[1];
										await player.line(p1);
										await player.line(p2);
										num = Math.min(num, Math.min(p1.countCards('h'), p2.countCards('h')));
										const links1 =
											await player.choosePlayerCard(p1, true, "h", [1, num], `论契：选择${get.translation(p1) + (p1 == player ? "(你)" : "")}的至多${num}张手牌`)
												.set("ai", (button) => {
													const player = get.player();
													const target = get.event("targetx");
													const num = get.event("ainum");
													const card = button.link;
													if (target === player) {
														if (ui.selected?.buttons?.length < num) {
															return 7 - get.value(card);
														}
														else {
															return -10;
														}
													}
													else {
														if (get.is.shownCard(card)) {
															return (7 - get.value(card)) * Math.sign(get.attitude(player, target));
														}
														else {
															return (1 + Math.random()) * 4 * Math.sign(get.attitude(player, target));
														}
													}
												})
												.set("targetx", p1)
												.set("ainum", () => {
													let num = player.countCards('h', card => 7 - get.value(card));
													if (player.storage.swq_qingnian &&
														//!player.getStorage("swq_qingnian_used").includes(player.storage.swq_qingnian ? "yin" : "yang") &&
														num == player.countCards('h') &&
														num > 0
													) {
														num--;//阴状态保留至少一张手牌，其他的无所谓了
													}
													return num;
												})
												.forResultLinks();
										if (!links1?.length) return;
										const links2 =
											await player.choosePlayerCard(p2, true, "h", links1.length, `论契：选择${get.translation(p2) + (p2 == player ? "(你)" : "")}的${links1.length}张手牌交换`)
												.set("ai", (button) => {
													const player = get.player();
													const target = get.event("targetx");
													const card = button.link;
													if (get.is.shownCard(card)) {
														return (7 - get.value(card)) * Math.sign(get.attitude(player, target));
													}
													else {
														return (1 + Math.random()) * 4 * Math.sign(get.attitude(player, target));
													}
												})
												.set("targetx", p2)
												.forResultLinks();
										if (!links2?.length) return;
										await p1.swapHandcards(p2, links1, links2);
										await game.delayex();
									}
								}
							});
					},
				};
			},
		},
		group: "swq_lunqi_debate",
		subSkill: {
			backup: {},
			debate: {
				//audio: 2,
				trigger: {
					player: "chooseToDebateBegin",
				},
				charlotte: true,
				forced: true,
				direct: true,
				filter(event, player) {
					if (!event.list.includes(player)) return false;
					if (event.fixedResult?.some(key => key[0] == player)) return false;
					return event?.getParent("swq_lunqi_backup").name == "swq_lunqi_backup" && player.countCards("h", card => get.is.shownCard(card)) >= 1;
				},
				async content(event, trigger, player) {
					const result = await player.chooseCard(1, "本次议事你仅能使用展示的手牌", true, (card) => {
						return get.is.shownCard(card);
					}).forResult();
					if (!trigger.fixedResult) trigger.fixedResult = [];
					trigger.fixedResult.push([player, result.cards[0]]);
				},
			},
		},
		ai: {
			order: 2,
			result: {
				player: 2,
			},
		},
	},
	swq_xinci: {
		audio: "zhenge",
		zhuSkill: true,
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			return (
				player != event.player &&
				event.player.group == "key" &&
				player.countCards('h')
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(
					get.prompt2("swq_xinci"),
					"h",
					1,
					false
				)
				.set("target", trigger.player)
				.set("ai", card => {
					const { player, target } = get.event();
					if (get.attitude(player, target) > 0 && player.getHp() > 2 && target.isDamaged() && player.countCards('h') >= 2) return 11 - get.value(card);
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.give(event.cards, trigger.player);
			await trigger.player.addShownCards(event.cards, "visible_swq_xinci");
			await trigger.player.showCards(event.cards);
			trigger.player.addTempSkill("swq_xinci_check");
			trigger.player.markAuto("swq_xinci_check", [player]);
		},
		subSkill: {
			check: {
				charlotte: true,
				trigger: { player: "phaseEnd" },
				firstDo: true,
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					if (!player.getStorage("swq_xinci_check")?.length) return;
					const target = player.getStorage("swq_xinci_check")?.[0];
					return game
						.getGlobalHistory("changeHp", evt => {
							return evt.getParent().name == "recover" && evt.player == player;
						})
						.map(evt => evt.num)
						.reduce((p, c) => p + c, 0) <= 0;
				},
				async content(event, trigger, player) {
					var targets = player.getStorage("swq_xinci_check");
					targets.sortBySeat();
					for (var i of targets) {
						if (i.isIn()) {
							await i.line(player);
							await i.logSkill("swq_xinci");
							await i.loseHp();
						}
					}
					await player.removeSkill("swq_xinci_check");
				},
			},
		},
	},
	// 孙玉凝
	swq_wudu: {
		audio: "saya_shouji",
		mod: {
			cardRecastable(card) {
				if (get.type(card) == "identity") return true;
			},
		},
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(p => p.identity);
		},
		video(player, info) {
			for (var name of info[0]) {
				lib.skill.swq_wudu.createCard(name);
				lib.inpile.add("swq_wudu_" + name);
			}
		},
		async content(event, trigger, player) {
			//game.addGlobalSkill("tianzuo_global");
			let identityList = [...new Set(game.filterPlayer().map(p => p.identity))];
			game.addVideo("skill", player, ["swq_wudu", [identityList]]);
			game.broadcastAll(
				function (list) {
					for (const name of list) {
						lib.skill.swq_wudu.createCard(name);
						lib.inpile.add("swq_wudu_" + name);
					}
				},
				identityList
			);
			var cards = [];
			identityList.forEach(identity => {
				for (var i = 4; i < 12; i++) {
					cards.push(game.createCard2("swq_wudu_" + identity, ["club", "spade", "diamond", "heart"][i % 4], i));
				}
			})
			await game.delayx();
			game.cardsGotoPile(cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
		},
		createCard(name) {
			if (!_status.postReconnect.swq_wudu)
				_status.postReconnect.swq_wudu = [
					function (list) {
						for (var name of list) {
							lib.skill.swq_wudu.createCard(name);
							lib.inpile.add("swq_wudu_" + name);
						}
					},
					[],
				];
			_status.postReconnect.swq_wudu[1].add(name);
			if (lib.card["swq_wudu_" + name]) return;
			lib.translate["swq_wudu_" + name] = (get.translation(name + "2") == name + "2" ? get.translation(name) : (get.translation(name + "2") || get.translation(name)));
			var info = lib.character[name];
			var card = {
				global: "swq_wudu_identity",
				fullskin: true,
				//cardimage: "identity_" + name,
				image: "ext:../image/card/identity_" + name + ".jpg",
				type: "identity",
				savable(card, player, dying) {
					return dying == player && player.identity == card.name.replace(/^swq_wudu_/, "");
				},
				toself: true,
				ai: {
					basic: {
						useful: (card, i) => {
							const player = _status.event.player;
							if (player?.identity != get.name(card, player).replace(/^swq_wudu_/, "")) return 0;
							if (player.hp > 1) {
								if (i === 0) return 2;
								return 0;
							}
							if (i === 0) return 5.3;
							return 2;
						},
						value: (card, player, i) => {
							if (player?.identity != get.name(card, player).replace(/^swq_wudu_/, "")) return 0;
							if (player.hp > 1) {
								if (i === 0) return 2.5;
								return 0;
							}
							if (i === 0) return 5.3;
							return 2;
						},
					},
					result: {
						target: (player, target, card) => {
							if (target?.identity != get.name(card, player).replace(/^swq_wudu_/, "")) return 0;
							if (target && target.isDying()) return 2;
							return 0;
						},
					},
					tag: {
						save: 1,
						recover: 0.1,
					},
					expose: 1,//使用此牌必定暴露身份
				},
				selectTarget: -1,
				filterTarget(card, player, target) {
					return target == player && target.hp < target.maxHp;
				},
				modTarget(card, player, target) {
					return target.hp < target.maxHp;
				},
				content() {
					target.recover();
				},
			};
			lib.translate["swq_wudu_" + name + "_info"] = "①当你摸到此牌时，若你的身份和牌名相同，你失去1点体力。②当你处于濒死状态时，若你的身份和牌名相同，可以对你自己使用，回复1点体力。";
			// var append = "";
			// lib.translate["swq_wudu_" + name + "_append"] = append;
			lib.card["swq_wudu_" + name] = card;
			//lib.card["identity_" + name] ??= { image: "identity_" + name };
		},
		group: "swq_wudu_use",
		subSkill: {
			use: {
				audio: "saya_shouji",
				enable: "phaseUse",
				usable: 1,
				filter() {
					return game.hasPlayer(p => p.identity);
				},
				async content(event, trigger, player) {
					const numbers = Array.from({ length: 13 }).map((_, i) => get.strNumber(i + 1));
					const identityList = [...new Set(game.filterPlayer().map(p => p.identity))].map(p => [p, get.translation(p + '2') || get.translation(p)]);
					const result = await player
						.chooseButton(
							[
								"###巫毒###" + `<div class="text center">向牌堆中添加${get.cnNumber(game.players.length)}张任意花色和点数的一种身份牌</div>`,
								[identityList, "tdnodes"],
								[
									lib.suit
										.slice()
										.reverse()
										.map(i => [i, get.translation(i)]),
									"tdnodes",
								],
								[numbers, "tdnodes"],
							],
							3
						)
						.set("filterButton", button => {
							return !ui.selected.buttons.some(but => {
								return [get.event("identityList").map(identity => identity?.[0]), lib.suit, get.event("numbers")].some(list => list.includes(but.link) && list.includes(button.link));
							});
						})
						.set("numbers", numbers)
						.set("identityList", identityList)
						.set("forced", true)
						.set("ai", (button) => {
							const player = get.player();
							const link = button.link;
							const lists = [get.event("identityList").map(identity => identity?.[0]), lib.suit, get.event("numbers")]
							if (lists[0].includes(link)) {
								return (game.hasPlayer(p => p.identity != player.identity && p.identity == link && (get.mode() == "identity" ? get.realAttitude(player, p) < 0 : get.rawAttitude(player, p) < 0)) + 0.1) * Math.random();
							}
							else return Math.random();
						})
						.forResult();
					if (result?.bool && result?.links?.length) {
						const lts = result.links.sort((a, b) => {
							return lib.suit.includes(a) + (numbers.includes(a) ? 2 : 0) - (lib.suit.includes(b) + (numbers.includes(b) ? 2 : 0));
						});
						const cardname = lts[0];
						if (!lib.inpile.includes("swq_wudu_" + cardname)) {
							game.addVideo("skill", player, ["swq_wudu", [[cardname]]]);
							game.broadcastAll(
								function (list) {
									for (const name of list) {
										lib.skill.swq_wudu.createCard(name);
										lib.inpile.add("swq_wudu_" + name);
									}
								},
								[cardname]
							);
						}
						var cards = [];
						for (var i = 0; i < game.players.length; i++) {
							cards.push(game.createCard2("swq_wudu_" + cardname, lts[1], get.numString(lts[2])));
						}
						await game.delayx();
						game.cardsGotoPile(cards, () => {
							return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
						});
						player.popup(get.translation(cards?.[0]).replace(/[【】]/g, ""));
						game.log("#b" + get.translation(player), "向牌堆中添加了", "#y" + get.translation(cards));
					}
				},
				ai: {
					order: 6,
					result: {
						player: 1,
					},
				}
			},
		},
	},
	swq_wudu_identity: {
		trigger: {
			player: "gainAfter",
		},
		cardSkill: true,
		direct: true,
		filter(event, player) {
			if (event.getParent().name != "draw") return false;
			let hs = player.getCards("h");
			for (let card of event.getg(player)) {
				if (get.name(card, player).slice(0, 9) == "swq_wudu_" && hs.includes(card)
					&& get.name(card, player).replace(/^swq_wudu_/, "") == player?.identity
					&& !player.hasSkill("swq_wudu")
				) return true;
			}
			return false;
		},
		content() {
			let num = 0;
			for (let card of trigger.getg(player)) {
				if (get.name(card, player).slice(0, 9) == "swq_wudu_"
					&& get.name(card, player).replace(/^swq_wudu_/, "") == player?.identity
					&& !player.hasSkill("swq_wudu")
				) num++;
			}
			game.log("#b" + get.translation(player), "由于摸到了自己的身份牌，失去了", "#y" + num, "点体力");
			player.loseHp(num);
		},
		ai: { expose: 0.1 },
	},
	swq_yuyin: {
		audio: "saya_powei",
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return event.player != player &&
				event.player.hasCard(true, 'h') &&
				get.discarded().filterInD("d").filter(card => get.type(card) == "identity").length;
		},
		persevereSkill: true,
		frequent: true,
		async content(event, trigger, player) {
			await trigger.player.addTempSkill("swq_yuyin_view")
			const result = await player
				.chooseButton(["御因：是否视为使用其中一张牌？", trigger.player.getCards('h').map(card => {
					if (get.name(card) != card.name) ui.create.cardTempName(card);
					return card;
				})])
				.set("filterButton", button => {
					var player = _status.event.player;
					var card = button.link;
					var cardx = get.autoViewAs({ name: get.name(card, get.owner(card)), nature: get.nature(card, get.owner(card)), isCard: true }, "unsure");
					return player.hasUseTarget(cardx, true, false);
				})
				.set("ai", button => {
					var card = button.link;
					return _status.event.player.getUseValue(get.name(card, get.owner(card)));
				})
				.forResult();
			if (result?.bool) {
				const card = result.links[0];
				const cardx = get.autoViewAs({ name: get.name(card, get.owner(card)), nature: get.nature(card, get.owner(card)), isCard: true }, "unsure");
				await trigger.player.removeSkill("swq_yuyin_view")
				await trigger.player.showCards(card, get.translation(trigger.player) + '的【御因】牌展示');
				await game.delayx();
				const res2 = await player.chooseUseTarget(cardx, true)
					.forResult();
				// if(res2?.bool && res2?.targets?.length) {
				// 	const target = res2.targets[0];
				// 	if(trigger.player === target) await target.draw();
				// }
				await player.draw();
			}
			else await trigger.player.removeSkill("swq_yuyin_view");
		},
		subSkill: {
			view: {
				charlotte: true,
				onremove: true,
				nopop: true,
				mod: {
					cardname(card, player) {
						if (get.type(card, "trick", false) == "identity") {
							switch (card?.name.replace(/^swq_wudu_/, "")) {
								case "zhu":
									return "tuixinzhifu";
								case "zhong":
									return "wuzhong";
								case "fan":
									return "qizhengxiangsheng";
								case "nei":
									return "wanjian";
								default:
									return "tiesuo";
							}
						}
					},
				},
			},
		},
		ai: {
			combo: "swq_wudu",
			threaten: 1.2,
			result: {
				player: 1,
			},
		}
	},
	swq_yinbing: {
		forced: true,
		trigger: { global: "dieBegin" },
		firstDo: true,
		logTarget: "player",
		filter(event, player) {
			if (!(event.getParent().name !== "giveup" && player.maxHp > 0)) {
				return false;
			}
			return _status.currentPhase !== player && event.getParent("swq_yinbing_phase")?.name !== "swq_yinbing_phase";
		},
		async content(event, trigger, player) {
			await player.draw();
			trigger.cancel();
		},
		group: "swq_yinbing_phase",
		subSkill: {
			phase: {
				forced: true,
				trigger: {
					player: "phaseZhunbei"
				},
				filter(event, player) {
					return game.hasPlayer(p => p.getHp(true) <= 0);
				},
				//logTarget: "targets",
				async content(event, trigger, player) {
					const nt = player.chooseTarget(1, "###【" + get.translation("swq_yinbing") + `】###<div class="text center">你可以令一名体力值不大于0的角色执行濒死阶段</div>`, (card, player, target) => {
						return target.getHp(true) <= 0;
					})
						.set("ai", (target) => {
							const player = get.player()
							return get.attitude(player, target) > 0
						})
					nt.targetprompt2.add(target => {
						if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) {
							return false;
						}
						return "【" + target.getHp(true) + "】";
					})
					const result = await nt.forResult()
					if (result?.bool) {
						const target = result.targets[0];
						player.line(target);
						if (target.getHp(true) <= 0 && target.isAlive() && !event.nodying) {
							await game.delayx();
							event._dyinged = true;

							var next = game.createEvent("dying");
							next.player = target;
							next.reason = event;
							next.setContent("dying");
							next.filterStop = function () {
								if (this.player.hp > 0 || this.nodying) {
									delete this.filterStop;
									return true;
								}
							};
							await next;
							//await target.dying(event);
						}
					}
					const plys = game.filterPlayer(p => p.getHp(true) <= 0)
					for (const i of plys) {
						await i.die();
					}
				},
			},
		},
	},
	swq_lingcan: {
		trigger: { global: "dying" },
		locked: true,
		usable: 1,
		filter(event, player) {
			return event.player !== player && player.countCards('hs') > 0;
		},
		onChooseToUse(event) {
			event.targetprompt2.add(target => {
				if (!target.isIn()) {
					return false;
				}
				const player = get.player(),
					card = get.card();
				if (get.type(card) == "trick" || (get.type(card) == "basic" && !["shan", "tao", "jiu", "du"].includes(card.name))) {
					if (target.isIn() && target !== player) {
						if (target.getHp(true) < player.getHp(true)) {
							return "不可响应";
						}
						if (target.getHp(true) > player.getHp(true)) {
							return "伤害+1";
						}
					}
				}
			});
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseCardTarget({
				onChooseToUse(event) {
					lib.skill.swq_lingcan.onChooseToUse(event);
				},
				filterCard(card) {
					return get.type2(card) === "basic";
				},
				filterTarget(card, player, target) {
					return _status.event?.getTrigger()?.player === target && player.canUse({ name: "sha", nature: "ice" }, target, false, false);
				},
				selectCard: 1,
				selectTarget: 1,
				position: "hs",
				prompt: get.prompt("swq_lingcan"),
				prompt2: `将一张基本牌当冰【杀】使用。`,
				ai1(card) {
					return 8 - get.value(card);
				},
				ai2(target) {
					const player = get.player();
					return get.attitude(player, target) > 0 ? target.countCards("he") : true;
				},
			}).forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event?.targets?.[0];
			await player.useCard({ name: "sha", nature: "ice" }, event?.cards, target);
			if (player.hasHistory("sourceDamage", evt => evt.getParent(3).name == "swq_lingcan")) {
				await player.recover();
			}
			else {
				await target.recover();
			}
			// player.when("useCardAfter")
			// 	.filter((event, player) => {
			// 		return event.card == evt.card
			// 	})
			// 	.then(() => {
			// 		if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) {
			// 			player.gainPlayerCard("he", trigger.targets[0], true)
			// 		}
			// 	})
		},
		group: ["swq_lingcan_norespond", "swq_lingcan_damage"],
		subSkill: {
			norespond: {
				forced: true,
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return (
						event.card &&
						(get.type(event.card) == "trick" || (get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
						game.hasPlayer(function (current) {
							return current !== player && current.getHp(true) < player.getHp(true);
						})
					);
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current !== player && current.getHp(true) < player.getHp(true);
						})
					);
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg.target.getHp(true) < player.getHp(true);
					},
				},
			},
			damage: {
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event, player) {
					return event.player.getHp(true) > player.getHp(true);
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
		},
	},
	// 风灵火山
	swq_fengling: {
		audio: `${ea}swq_fenglinghuoshan:2`,
		trigger: { player: "useCardToPlayered" },
		logTarget: "target",
		filter(event, player) {
			return get.suit(event.card) === "club" && event.target.countCards("hej") > 0;
		},
		check(event, player) {
			const target = event.target;
			return target === player || get.attitude(player, target) <= 0;
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			const cards = target.getCards("hej");
			await target.lose(cards, ui.cardPile);
			target.$throw(cards.length);
			for (const card of cards) {
				const p = Math.floor(Math.random() * ui.cardPile.childElementCount);
				ui.cardPile.insertBefore(card, ui.cardPile.childNodes[p]);
			}
			game.updateRoundNumber();
			game.log(target, "的", `#y${get.cnNumber(cards.length)}张牌`, "洗回了牌堆");
			await target.draw(cards.length);
		},
	},
	swq_liantian: {
		audio: `${ea}swq_fenglinghuoshan:2`,
		group: ["swq_liantian_fix", "swq_liantian_clear", "swq_liantian_lose", "swq_liantian_swap"],
		enable: "phaseUse",
		trigger: { global: ["changeHpAfter", "gainMaxHpAfter", "loseMaxHpAfter"] },
		damageStatusChanged(player2, evt) {
			if (!evt.changedMaxHp) {
				if (evt.changedHp > 0) return !player2.isDamaged();
				if (evt.changedHp < 0) return player2.hp - evt.changedHp === player2.maxHp;
			}
			if (evt.changedMaxHp > 0) return player2.maxHp - evt.changedMaxHp === player2.getHp();
			if (evt.changedMaxHp < 0) return !player2.isDamaged() && evt.changedHp !== evt.changedMaxHp;
			return false;
		},
		filter(event, player) {
			if (player.getStorage("swq_liantian_used", false)) return false;
			const hasTarget = game.hasPlayer((target) =>
				target !== player && player.canCompare(target)
				&& !player.getStorage("swq_liantian").includes(target));
			if (!hasTarget) return false;
			if (event.name === "chooseToUse") return true;
			return ["changeHp", "gainMaxHp", "loseMaxHp"].includes(event.name)
				&& get.info("swq_liantian").damageStatusChanged(event.player, event);
		},
		filterTarget(card, player, target) {
			return target !== player && player.canCompare(target)
				&& !player.getStorage("swq_liantian").includes(target);
		},
		selectTarget: 1,
		check(event, player) {
			return game.hasPlayer((target) =>
				target !== player && player.canCompare(target) && get.attitude(player, target) <= 0
				&& !player.getStorage("swq_liantian").includes(target));
		},
		intro: {
			markcount(storage) {
				if (storage) {
					return storage.length;
				}
				return 0;
			},
			content: "本回合已对$发动过【连天】"
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget("连天：请选择拼点对象",
				(card, player2, target2) => {
					const owner = get.event().player;
					return target2 !== owner && owner.canCompare(target2)
						&& !owner.getStorage("swq_liantian").includes(target2);
				})
				.set("ai", (target2) => {
					const owner = get.event().player;
					return get.attitude(owner, target2) <= 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!target) return;
			if (trigger) player.line(target);
			player.markAuto("swq_liantian", [target]);
			player.setStorage("swq_liantian_used", true)
			const fix = { num1: 0, num2: 0, small: false };
			const swapWho = {};
			const optionKind = {};
			const optionButtons = [
				["选项一/+3", "选项一/+3：将你的拼点点数+3"],
				["选项一/-3", "选项一/-3：将你的拼点点数-3"],
				["选项二", "选项二：将本次拼点规则改为小点获胜"],
				["选项三", "选项三：拼点时将你的拼点牌与牌堆顶的牌交换"],
			];
			const optionAi = (button) => {
				const link = button.link;
				return link === "选项一/+3" ? 3 : link === "选项一/-3" ? 2.5 : link === "选项二" ? 1 : 0.5;
			};
			const optionResults = await player.chooseButtonOL([
				[player, ["连天：" + "请选择一项拼点规则", [optionButtons, "textbutton"], "hidden"], true, optionAi],
				[target, ["连天：" + "请选择一项拼点规则", [optionButtons, "textbutton"], "hidden"], true, optionAi],
			]).forResult();
			for (const chooser of [player, target]) {
				const link = optionResults[chooser.playerid]?.links?.[0];
				if (typeof link === "string") {
					// chooser.popup(link, "water");
					// game.log(chooser, "选择了", "#y" + optionButtons[0][link]);
					if (link.startsWith("选项一")) {
						optionKind[chooser.playerid] = "选项一";
						const delta = link === "选项一/+3" ? 3 : -3;
						if (chooser === player) fix.num1 = delta;
						else fix.num2 = delta;
					} else if (link === "选项二") {
						optionKind[chooser.playerid] = "选项二";
						fix.small = true;
					} else {
						optionKind[chooser.playerid] = "选项三";
						swapWho[chooser.playerid] = true;
					}
				} else {
					optionKind[chooser.playerid] = "选项一";
					if (chooser === player) fix.num1 = 3;
					else fix.num2 = 3;
				}
			}
			const next = player.chooseToCompare(target);
			next.set("small", fix.small);
			next.swq_liantian_fix = fix;
			next.swq_liantian_swap = swapWho;
			const result2 = await next.forResult();
			for (const chooser of [player, target]) {
				const link = optionResults[chooser.playerid]?.links?.[0];
				const color = optionKind[player.playerid] === optionKind[target.playerid] ? "wood" : "fire";
				const chosen = optionButtons.find((item) => item[0] === link);
				if (chosen) game.log(chooser, "选择了", `#y${chosen[1]}`);
				switch (link) {
					case "选项一/+3":
						chooser.popup("+3", color);
						break;
					case "选项一/-3":
						chooser.popup("-3", color);
						break;
					case "选项二":
						chooser.popup("小点", color);
						break;
					case "选项三":
						chooser.popup("交换", color);
						break;
					default:
						break;
				}
			}
			if (result2.cancelled) return;
			if (result2.bool || optionKind[player.playerid] === optionKind[target.playerid]) {
				await target.link(true);
				const pool = Array.from(ui.cardPile.childNodes).concat(Array.from(ui.discardPile.childNodes))
					.filter((card) => get.suit(card) === "club");
				if (pool.length) {
					const card = pool[Math.floor(Math.random() * pool.length)];
					await player.gain(card, "gain2");
				} else {
					game.log(player, "牌堆和弃牌堆中都没有♣牌");
				}
				player.setStorage("swq_liantian_used", false);
				game.log(player, "重置了", "#g【连天】");
			} else {
				if (player.countCards("h")) {
					await player.chooseToDiscard({ forced: true, position: "h", selectCard: 1 })
						.set("prompt", "连天：拼点失败，请弃置一张手牌")
						.forResult();
				}
			}
		},
		ai: {
			order: 5,
			result: { player: 1 },
		},
		subSkill: {
			clear: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: { global: ["phaseAfter", "phaseBefore"] },
				filter(event, player) {
					return player.getStorage("swq_liantian").length > 0;
				},
				content(event, trigger, player) {
					player.unmarkAuto("swq_liantian", player.getStorage("swq_liantian"));
					player.setStorage("swq_liantian_used", false);
					// player.removeStorage("swq_liantian_used");
					// player.syncStorage("swq_liantian_used");
				},
			},
			fix: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: { global: "compare" },
				filter(event) {
					return event.swq_liantian_fix;
				},
				content(event, trigger, player) {
					const { num1, num2, small } = trigger.swq_liantian_fix;
					trigger.num1 += num1;
					trigger.num2 += num2;
					if (small) [trigger.num1, trigger.num2] = [trigger.num2, trigger.num1];
				},
			},
			swap: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: { global: "compareCardShowBefore" },
				filter(event) {
					return event.swq_liantian_swap;
				},
				async content(event, trigger, player) {
					if (trigger.swq_liantian_swap[trigger.player.playerid]) {
						const goto = game.cardsGotoOrdering(get.cards());
						const topCard = goto.cards[0];
						await goto;
						await game.cardsGotoPile([trigger.card1], "insert");
						trigger.card1 = topCard;
						const idx = trigger.lose_list.findIndex((item) => item[0] === trigger.player);
						if (idx > -1) trigger.lose_list[idx][1] = [topCard];
					}
					if (trigger.swq_liantian_swap[trigger.target.playerid]) {
						const goto = game.cardsGotoOrdering(get.cards());
						const topCard = goto.cards[0];
						await goto;
						await game.cardsGotoPile([trigger.card2], "insert");
						trigger.card2 = topCard;
						const idx = trigger.lose_list.findIndex((item) => item[0] === trigger.target);
						if (idx > -1) trigger.lose_list[idx][1] = [topCard];
					}
				},
			},
			lose: {
				forced: true,
				locked: false,
				priority: 1,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
				},
				filter(event, player) {
					if (player.countCards("h")) {
						return false;
					}
					const evt = event.getl(player);
					return evt && evt.hs && evt.hs.length && event.getParent("swq_liantian")?.name;
				},
				async content(event, trigger, player) {
					await player.drawTo(player.maxHp);
				},
			},
		},
	},
	swq_huoshan: {
		audio: `${ea}swq_fenglinghuoshan:2`,
		forced: true,
		trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsGotoPileAfter"] },
		filter(event, player, name, target) {
			if (event.name === "cardsGotoPile") return true;
			if (event.name === "lose") {
				if (event.position === ui.cardPile && event.getlx !== false && event.cards2.length) return true;
			}
			return game.hasPlayer((target2) =>
				target2.hasHistory("lose", (evt) =>
					evt.getParent() === event && evt.position === ui.cardPile && evt.cards2?.length));
		},
		async content(event, trigger, player) {
			if (trigger.name === "lose" && trigger.getParent()?.name === "loseAsync") return;
			const charged = player.hasSkill("swq_huoshan_charged");
			if (!charged) {
				const result = await player
					.chooseControl(["选项一", "选项二"], true)
					.set("prompt", get.poptip("swq_huoshan") + "：请选择一项")
					.set("choiceList", [
						"对体力值最高或处于横置状态的一名角色造成1点火焰伤害",
						"令该技能下一次造成的伤害+1且无法选择此项",
					])
					.set("ai", () => "选项一")
					.forResult();
				if (!result?.control) return;
				if (result.control === "选项二") {
					player.popup("增伤", "fire");
					player.addSkill("swq_huoshan_charged");
					return;
				}
			}
			player.popup("造成", "thunder");
			const maxHp = Math.max(...game.filterPlayer().map((t) => t.hp));
			const targets = game.filterPlayer((t) => t.hp === maxHp || t.isLinked());
			let target;
			if (targets.length === 1) {
				target = targets[0];
			} else {
				const result = await player.chooseTarget(
					`火山：请选择对一名体力值最高或处于横置状态的角色造成${charged ? 2 : 1}点火焰伤害`,
					(card, player2, target2) => get.event().targetsx.includes(target2))
					.set("targetsx", targets)
					.set("ai", (target2) => {
						const playerx = get.event().player;
						return target2 === playerx ? 0 : get.damageEffect(target2, playerx, playerx);
					})
					.set("forced", true)
					.forResult();
				if (!result.bool || !result.targets.length) return;
				target = result.targets[0];
			}
			player.line(target);
			if (charged) player.removeSkill("swq_huoshan_charged");
			await target.damage("fire", player, charged ? 2 : 1);
		},
		subSkill: {
			charged: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "火",
				intro: {
					content: "下次发动【火山】造成的伤害+1",
				},
			}
		}
	},
	swq_shiyun: {
		audio: `${ea}swq_fenglinghuoshan:2`,
		group: ["swq_shiyun_unmark"],
		zhuSkill: true,
		forced: true,
		locked: false,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const num = game.filterPlayer((p) => p.group == "key").length;
			if (!num) return;
			const clubs = Array.from(ui.cardPile.childNodes).filter((card) => get.suit(card) === "club");
			if (!clubs.length) return;
			let cards;
			const count = Math.min(num, clubs.length);
			if (clubs.length === count) {
				cards = clubs.slice(0);
			} else {
				cards = clubs.randomGets(count);
			}
			player.$gain2(cards, false);
			game.log(player, "将", cards, "置于了武将牌上");
			await player.loseToSpecial(cards, "swq_shiyun").set("visible", true);
			player.markSkill("swq_shiyun");
		},
		marktext: "势",
		intro: {
			mark(dialog, storage, player) {
				dialog.addAuto(
					player.getCards("s", card => card.hasGaintag("swq_shiyun"))
				);
			},
			markcount(storage, player) {
				return player.getCards("s", (card) => card.hasGaintag("swq_shiyun")).length;
			},
			onunmark(storage, player) {
				const cards = player.getCards("s", (card) => card.hasGaintag("swq_shiyun"));
				if (cards.length) player.loseToDiscardpile(cards);
			},
		},
		subSkill: {
			unmark: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: { player: "loseAfter" },
				filter(event, player) {
					return !player.getCards("s", (card) => card.hasGaintag("swq_shiyun")).length;
				},
				content(event, trigger, player) {
					player.unmarkSkill("swq_shiyun");
				},
			},
		},
	},
	// 玄敞
	swq_suibo: {
		audio: `${ea}swq_xuanchang:2`,
		locked: true,
		enable: "chooseToUse",
		group: ["swq_suibo_after", "swq_suibo_last"],
		selectCard: 1,
		position: "h",
		lastCard(player) {
			const list = player.getStorage("swq_suibo_last", []);
			return list.length ? list[0] : null;
		},
		wuxieSource(player, map) {
			const card = map?.card;
			if (!card || card.name != "wuxie") {
				return null;
			}
			return { name: "wuxie", nature: card.nature, self: map.player == player };
		},
		sourceInfo(player, event) {
			event = event ?? get.event();
			if (event?.type == "wuxie") {
				const src = lib.skill.swq_suibo.wuxieSource(player, event.info_map);
				if (src) {
					return src;
				}
			}
			return lib.skill.swq_suibo.lastCard(player);
		},
		hiddenWuxie(player, info) {
			const src = lib.skill.swq_suibo.wuxieSource(player, info) || lib.skill.swq_suibo.lastCard(player);
			if (!src || src.self || src.name != "wuxie") {
				return false;
			}
			return player.countCards("h", (card) => lib.card?.[card.name]?.type != "basic") > 0;
		},
		viewAsInfo(player, event) {
			const last = lib.skill.swq_suibo.sourceInfo(player, event);
			if (!last) {
				return null;
			}
			const name = last.name;
			if (!name || !lib.card?.[name]) {
				return null;
			}
			return { name: name, nature: last.nature, isCard: true };
		},
		filterCard(card) {
			return lib.card?.[card.name]?.type != "basic";
		},
		filter(event, player) {
			const last = lib.skill.swq_suibo.sourceInfo(player, event);
			if (!last || last.self) {
				return false;
			}
			if (!player.countCards("h", (card) => lib.card?.[card.name]?.type != "basic")) {
				return false;
			}
			if (typeof event?.filterCard != "function") {
				return true;
			}
			return event.filterCard(lib.skill.swq_suibo.viewAsInfo(player, event), player, event);
		},
		viewAs(cards, player) {
			return lib.skill.swq_suibo.viewAsInfo(player, get.event());
		},
		prompt(event, player) {
			const info = lib.skill.swq_suibo.viewAsInfo(player, event);
			if (!info) {
				return "随波";
			}
			return `将一张非基本牌当做【${get.translation(info.name)}】使用`;
		},
		check(card) {
			if (get.itemtype(card) != "card") {
				return 0;
			}
			return 6 - get.value(card);
		},
		mod: {
			cardname(card, player) {
				const event = get.event();
				if (!event || !["chooseToUse", "chooseToRespond"].includes(event.name)) {
					return;
				}
				if (event.type == "wuxie") {
					return;
				}
				if (lib.card?.[card.name]?.type == "basic") {
					return;
				}
				const last = lib.skill.swq_suibo.lastCard(player);
				if (!last || !last.self) {
					return;
				}
				return "shan";
			},
			cardnature(card, player) {
				const event = get.event();
				if (!event || !["chooseToUse", "chooseToRespond"].includes(event.name)) {
					return;
				}
				if (event.type == "wuxie") {
					return;
				}
				if (lib.card?.[card.name]?.type == "basic") {
					return;
				}
				const last = lib.skill.swq_suibo.lastCard(player);
				if (!last || !last.self) {
					return;
				}
				return false;
			},
		},
		ai: {
			order: 1,
			result: { player: 1 },
			respondShan: true,
			skillTagFilter(player, tag) {
				if (tag != "respondShan") {
					return true;
				}
				const last = lib.skill.swq_suibo.lastCard(player);
				if (!last || !last.self) {
					return false;
				}
				return player.countCards("h", (card) => lib.card?.[card.name]?.type != "basic") > 0;
			},
		},
		subSkill: {
			after: {
				audio: "swq_suibo",
				charlotte: true,
				forced: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return event.skill == "swq_suibo";
				},
				async content(event, trigger, player) {
					await player.draw(1);
					const list = game.filterPlayer(
						(current) => current != player && current.countCards("h", (card) => !get.is.shownCard(card)) > 0
					);
					if (!list.length) {
						return;
					}
					const result = await player
						.chooseTarget({
							prompt: "随波：明置一名其他角色的随机一张手牌",
							filterTarget(card, player, target) {
								return get.event().swqTargets.includes(target);
							},
						})
						.set("swqTargets", list)
						.set("ai", (target) => -get.attitude(get.player(), target))
						.forResult();
					if (!result.bool) {
						return;
					}
					const target = result.targets[0];
					const card = target.getCards("h", (card) => !get.is.shownCard(card)).randomGet();
					if (!card) {
						return;
					}
					player.line(target, "green");
					await target.addShownCards([card], "visible_swq_suibo");
					await target.showCards(
						[card],
						`${get.translation(player)}对${get.translation(target)}发动了【${get.translation("swq_suibo")}】`
					);
				},
			},
			last: {
				charlotte: true,
				forced: true,
				popup: false,
				silent: true,
				trigger: { global: "useCard" },
				filter(event) {
					return !!(event.card && event.card.name);
				},
				content(event, trigger, player) {
					player.setStorage("swq_suibo_last", [
						{
							name: trigger.card.name,
							nature: get.nature(trigger.card, trigger.player),
							self: trigger.player == player,
						},
					]);
					player.updateMarks("swq_suibo_last");
				},
			},
		},
	},
	swq_zhuliu: {
		audio: `${ea}swq_xuanchang:2`,
		group: ["swq_zhuliu_phase", "swq_zhuliu_use", "swq_zhuliu_reset"],
		subSkill: {
			// 其他角色的出牌阶段结束时
			phase: {
				audio: "swq_zhuliu",
				trigger: { global: "phaseUseEnd" },
				logTarget: "player",
				filter(event, player) {
					return event.player != player && event.player.isIn();
				},
				check(event, player) {
					const num = event.player.countCards("h");
					const own = player.countCards("h");
					return own < num || (own == num && own > 0);
				},
				async content(event, trigger, player) {
					const num = trigger.player.countCards("h");
					const own = player.countCards("h");
					if (own > num) {
						await player.chooseToDiscard(own - num, true, "h");
					} else if (own < num) {
						await player.draw(Math.min(num - own, 5));
					}
					await player.chooseToUse("逐流：你可以使用一张手牌").set("position", "h");
				},
			},
			// 每种牌名每轮限一次，将一张手牌当做一张被明置的非装备牌使用
			use: {
				audio: "swq_zhuliu",
				enable: "chooseToUse",
				copyable(player, event) {
					const used = player.getStorage("swq_zhuliu_copied");
					const list = [];
					for (const current of game.filterPlayer()) {
						for (const card of current.getShownCards()) {
							const name = get.name(card, current);
							if (!name || !lib.card?.[name] || lib.card[name].type == "equip") {
								continue;
							}
							if (used.includes(name)) {
								continue;
							}
							if (list.some((card2) => get.name(card2, get.owner(card2)) == name)) {
								continue;
							}
							if (
								typeof event?.filterCard == "function" &&
								!event.filterCard({ name: name, nature: get.nature(card, current), isCard: true, cards: [card] }, player, event)
							) {
								continue;
							}
							list.push(card);
						}
					}
					return list;
				},
				hiddenWuxie(player, info) {
					if (player.getStorage("swq_zhuliu_copied").includes("wuxie")) {
						return false;
					}
					return game.filterPlayer().some((current) =>
						current.getShownCards().some((card) => get.name(card, current) == "wuxie")
					);
				},
				// 逐流②的实体材料是手牌，没手牌时不给按钮
				filter(event, player) {
					return player.countCards("h") > 0 && lib.skill.swq_zhuliu_use.copyable(player, event).length > 0;
				},
				chooseButton: {
					dialog(event, player) {
						return ui.create.dialog("逐流", lib.skill.swq_zhuliu_use.copyable(player, event));
					},
					check(button) {
						return get.value(button.link, get.player()) - 4;
					},
					backup(links, player) {
						const card = links[0];
						const owner = get.owner(card);
						return {
							viewAs: { name: get.name(card, owner), nature: get.nature(card, owner), isCard: true },
							card: card,
							position: "h",
							filterCard: true,
							selectCard: 1,
							popname: true,
							log: false,
							check(card) {
								return 6 - get.value(card);
							},
							async precontent(event, trigger, player) {
								player.logSkill("swq_zhuliu", player);
								player.markAuto("swq_zhuliu_copied", lib.skill.swq_zhuliu_use_backup.viewAs.name);
							},
						};
					},
				},
			},
			copied: {
				charlotte: true,
				onremove: true,
			},
			reset: {
				charlotte: true,
				forced: true,
				popup: false,
				silent: true,
				trigger: { global: "roundStart" },
				filter(event, player) {
					return player.hasSkill("swq_zhuliu");
				},
				content(event, trigger, player) {
					player.setStorage("swq_zhuliu_copied", []);
					player.updateMarks("swq_zhuliu_copied");
				},
			},
		},
	},
	swq_gongjin: {
		audio: `${ea}swq_xuanchang:2`,
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return lib.skill.swq_gongjin.choosable(player).length > 0;
		},
		choosable(player) {
			const used = player.getStorage("swq_gongjin_used");
			const list = [];
			if (!used.includes("1") && game.hasPlayer((current) => current != player && current.countCards("h", (card) => !get.is.shownCard(card)) > 0)) {
				list.push("1");
			}
			if (!used.includes("2") && game.hasPlayer((current) => current != player && lib.skill.swq_gongjin_use.applicable(current))) {
				list.push("2");
			}
			return list;
		},
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog(`${get.translation("swq_gongjin")}：请选择一项`, "hidden");
				const x = player.getHp() + 1;
				dialog.add([
					[
						["1", `明置至多${x}名其他角色各一张未明置的随机手牌，若这些牌的类型均相同，重铸其中一名目标区域内至多X张牌，并明置以此法得到的牌`],
						["2", `令至多${x}名其他角色视为使用一张被明置的【杀】或普通锦囊牌`],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				return lib.skill.swq_gongjin.choosable(player).includes(button.link);
			},
			check: () => 1 + Math.random(),
			backup(links) {
				return get.copy(lib.skill["swq_gongjin_" + links[0]]);
			},
			prompt(links, player) {
				const x = player.getHp() + 1;
				if (links[0] == "1") {
					return `共进：明置至多${get.cnNumber(x)}名其他角色各一张未明置的随机手牌`;
				}
				return `共进：令至多${get.cnNumber(x)}名其他角色视为使用一张被明置的【杀】或普通锦囊牌`;
			},
		},
		ai: { order: 9, result: { player: 1 } },
		subSkill: {
			backup: { audio: "swq_gongjin" },
			used: {
				charlotte: true,
				onremove: true,
			},
			1: {
				audio: "swq_gongjin",
				multitarget: true,
				filterCard: () => false,
				selectCard: -1,
				selectTarget() {
					return [1, _status.event.player.getHp() + 1];
				},
				filterTarget(card, player, target) {
					return target != player && target.countCards("h", (card) => !get.is.shownCard(card)) > 0;
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					player.addTempSkill("swq_gongjin_used", "phaseUseAfter");
					player.markAuto("swq_gongjin_used", "1");
					const x = player.getHp() + 1;
					const targets = event.targets.slice().sortBySeat(player);
					const shown = [];
					for (const target of targets) {
						const card = target.getCards("h", (card) => !get.is.shownCard(card)).randomGet();
						if (!card) {
							continue;
						}
						await target.addShownCards([card], "visible_swq_gongjin");
						await target.showCards(
							[card],
							`${get.translation(player)}对${get.translation(target)}发动了【${get.translation("swq_gongjin")}】`
						);
						shown.push(card);
					}
					if (!shown.length) {
						return;
					}
					// 以此法明置的牌类型都相同才继续
					if (shown.map((card) => get.type2(card)).unique().length > 1) {
						return;
					}
					const list = targets.filter((target) => target.isIn());
					if (!list.length) {
						return;
					}
					const result = await player
						.chooseTarget({
							prompt: `共进：选择一名角色，重铸其区域内至多${get.cnNumber(x)}张牌`,
							filterTarget(card, player, target) {
								return get.event().swqTargets.includes(target);
							},
						})
						.set("swqTargets", list)
						.set("ai", (target) => -get.attitude(get.player(), target))
						.forResult();
					if (!result.bool) {
						return;
					}
					const chosen = result.targets[0];
					player.line(chosen, "green");
					const pool = chosen.getCards("hej");
					if (!pool.length) {
						return;
					}
					const max = Math.min(x, pool.length);
					const pick = await player
						.choosePlayerCard(chosen, "hej", [1, max], true, `请选择重铸${get.translation(chosen)}区域内的至多${get.cnNumber(max)}张牌`)
						.set("ai", (button) => -get.value(button.link, get.player()))
						.forResult();
					if (!pick.bool) {
						return;
					}
					const cards = pick.links;
					const before = chosen.getCards("h");
					await chosen.recast(cards);
					const gained = chosen.getCards("h").filter((card) => !before.includes(card));
					if (gained.length) {
						await chosen.addShownCards(gained, "visible_swq_gongjin");
						await chosen.showCards(
							gained,
							`${get.translation(player)}对${get.translation(chosen)}发动了【${get.translation("swq_gongjin")}】`
						);
					}
				},
				ai: {
					order: 9,
					result: {
						player: 1,
						target(target, player) {
							return -get.attitude(player, target);
						},
					},
				},
			},
			2: {
				audio: "swq_gongjin",
				multitarget: true,
				filterCard: () => false,
				selectCard: -1,
				selectTarget() {
					return [1, _status.event.player.getHp() + 1];
				},
				filterTarget(card, player, target) {
					// 被明置的牌取自目标自己的明置牌
					return target != player && lib.skill.swq_gongjin_use.applicable(target);
				},
				async content(event, trigger, player) {
					player.addTempSkill("swq_gongjin_used", "phaseUseAfter");
					player.markAuto("swq_gongjin_used", "2");
					for (const target of event.targets.slice().sortBySeat()) {
						if (!target.isIn()) {
							continue;
						}
						const cards = target.getShownCards().filter((card) => lib.skill.swq_gongjin_use.usable(card, target));
						if (!cards.length) {
							continue;
						}
						const result = await target
							.chooseButton({
								createDialog: ["共进：是否视为使用一张被明置的【杀】或普通锦囊牌？", cards],
								selectButton: 1,
								ai(button) {
									const me = get.player();
									const card = button.link;
									const vcard = get.autoViewAs({
										name: get.name(card, me),
										nature: get.nature(card, me),
										isCard: true,
									});
									return game.hasPlayer((current) => get.effect(current, vcard, me, me) > 0) ? 1 : 0;
								},
							})
							.forResult();
						if (!result.bool) {
							continue;
						}
						const card = result.links[0];
						const vcard = get.autoViewAs({ name: get.name(card, target), nature: get.nature(card, target), isCard: true });
						player.logSkill("swq_gongjin", target);
						await target.showCards(card, `${get.translation(player)}对${get.translation(target)}发动了【共进】`);
						await target.chooseUseTarget(vcard, "共进：请选择目标").set("logSkill", "swq_gongjin");
					}
				},
				ai: {
					order: 8,
					result: {
						player: 1,
						target(target, player) {
							return get.attitude(player, target);
						},
					},
				},
			},
		},
	},
	swq_gongjin_use: {
		charlotte: true,
		legal(card, player) {
			const name = get.name(card, player);
			return !!name && (name == "sha" || get.type(card, null, player) == "trick");
		},
		applicable(player) {
			return player.getShownCards().some((card) => lib.skill.swq_gongjin_use.legal(card, player));
		},
		usable(card, player) {
			if (!lib.skill.swq_gongjin_use.legal(card, player)) {
				return false;
			}
			const vcard = get.autoViewAs({ name: get.name(card, player), nature: get.nature(card, player), isCard: true });
			if (!lib.filter.cardEnabled(vcard, player)) {
				return false;
			}
			if (get.info(vcard)?.notarget) {
				return true;
			}
			return player.hasUseTarget(vcard);
		},
	},
	//Q群风云-鹿天帝分包
	swlu_mengyan: {
		audio: `${ea}swlu_lugushou:3`,
		logAudio: () => 2,
		enable: "phaseUse",
		usable: 3,
		locked: true,
		filter(event, player) {
			return player.storage?.swlu_mengyan?.[1].some(num => num >= 1);
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("梦衍：消耗某角色的所有“碎片”并获得对应随从（长按可以查看具体技能）", "hidden");
				const list = [];
				const list2 = [];
				const arr = player.storage?.swlu_mengyan?.[0];
				for (let i = 0; i < arr.length; i++) {
					if (player.storage?.swlu_mengyan?.[1][i] >= 1) {
						list.push(arr[i]?.name);
						list2.push(arr[i]);
					}
				}
				dialog.add([
					list,
					"character",
				]);
				for (let i = 0; i < dialog.buttons.length; i++) {
					const button = dialog.buttons[i];
					const character = list[i];
					const infoitem = get.character(character);
					let hp = infoitem.hp,
						maxHp = infoitem.maxHp || infoitem.hp,
						hujia = infoitem.hujia;
					hp = Math.floor(hp / 2);
					maxHp = Math.floor(maxHp / 2);
					let str = get.numStr(hp);
					if (hp !== maxHp) {
						str += "/";
						str += get.numStr(maxHp);
					}
					if (button?.node?.hp) {
						button.node.hp.innerHTML = `<div></div><div class="text">${str}</div>`
					}
					button.link = [button.link, list2[i]];
					button._customintro = function (uiintro, evt) {
						const node = button;
						const cname = node.link[0];
						const character = cname,
							characterInfo = get.character(cname);
						let capt = get.translation(character);
						if (characterInfo) {
							const infoSex = characterInfo[0];
							if (infoSex && lib.config.show_sex) {
								capt += `&nbsp;&nbsp;${infoSex == "none" ? "无" : lib.translate[infoSex]}`;
							}
							const infoGroup = characterInfo[1];
							if (infoGroup && lib.config.show_group) {
								const group = get.is.double(character, true);
								if (group) {
									capt += `&nbsp;&nbsp;${group.map(value => get.translation(value)).join("/")}`;
								} else {
									capt += `&nbsp;&nbsp;${lib.translate[infoGroup]}`;
								}
							}
						}
						uiintro.add(capt);

						if (lib.characterTitle[cname]) {
							uiintro.addText(get.colorspan(lib.characterTitle[cname]));
						}

						if (lib.characterAppend[cname]) {
							uiintro.addText(get.colorspan(lib.characterAppend[cname]));
						}

						if (get.characterInitFilter(cname)) {
							const initFilters = get.characterInitFilter(cname).filter(tag => {
								if (!lib.characterInitFilter[cname]) {
									return true;
								}
								return lib.characterInitFilter[cname](tag) !== false;
							});
							if (initFilters.length) {
								const str = initFilters.reduce((strx, stry) => strx + lib.InitFilter[stry] + "<br>", "").slice(0, -4);
								uiintro.addText(str);
							}
						}
						var skills = lib.skill?.swlu_mengyan?.getSubPlayerSkills(node.link[1]) || get.character(character, 3);
						let translation = "";
						for (i = 0; i < skills.length; i++) {
							if (lib.translate[skills[i] + "_info"]) {
								if (lib.translate[skills[i] + "_ab"]) {
									translation = lib.translate[skills[i] + "_ab"];
								} else {
									translation = get.translation(skills[i]);
									if (!lib.skill[skills[i]].nobracket) {
										translation = `【${translation.slice(0, 2)}】`;
									}
								}
								uiintro.add('<div><div class="skill">' + translation + "</div><div>" + get.skillInfoTranslation(skills[i]) + "</div></div>");
								if (lib.translate[skills[i] + "_append"]) {
									uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[i] + "_append"] + "</div>");
								}
							}
						}
						uiintro.add(ui.create.div(".placeholder.slim"));
					};
				}
				dialog.addText(" <br> ");
				return dialog;
			},
			filter(button) {
				return true;
			},
			check(button) {
				return true;
			},
			backup(links) {
				return {
					audio: "swlu_mengyan_audio",
					choice: links[0],
					async content(event, trigger, player) {
						const choice = lib.skill.swlu_mengyan_backup.choice;
						const target = choice[1];
						const cname = choice[0];
						const skills = lib.skill.swlu_mengyan.getSubPlayerSkills(target)?.slice(0);
						for (let i = 0; i < skills?.length || 0; i++) {
							if (lib.skill[skills[i]].nosub) {
								skills.splice(i--, 1);
							}
						}
						const playerOriginalSkills = player.getSkills(null, false, false);
						const infoitem = get.character(cname);
						let hp = infoitem.hp,
							maxHp = infoitem.maxHp || infoitem.hp,
							hujia = infoitem.hujia;
						hp = Math.min(3, Math.floor(hp / 2));
						maxHp = Math.min(3, Math.floor(maxHp / 2));
						const subPlayerCur = player.addSubPlayer({
							name: cname,
							skills: skills,
							hp: hp,
							maxHp: maxHp,
							hujia: hujia,
							sex: infoitem.sex,
							group: infoitem.group,
							hs: get.cards(lib.skill.swlu_mengyan.getPlayerData(player, target)),
							image: lib.character[cname].img ? "img:" + lib.character[cname].img : undefined,
							//intro: "出牌阶段，你可以调遣此随从（直到随从死亡不可再次切换）",
							//caption: .flat(),
							originalSkills: playerOriginalSkills.slice(),
							originalplayer: target,
							onremove(player, current) {
								const goon = [player.name1, player.name2].includes(current);
								if (!goon) {
									player.reinit(player.name, player.storage.subplayer.name, [player.storage.subplayer.hp, player.storage.subplayer.maxHp, player.storage.subplayer.hujia]);
									player.update();
								}
								player.addSkill(player.storage?.[current]?.originalSkills || []);
								const target = player.storage?.[current]?.originalplayer;
								if (target && target.isIn()) {
									target.addTempSkill("fengyin");
									player.line(target);
									game.log(target, "的非锁定技", "#y失效了");
								}
								if (player.storage?.swlu_mengyan?.[0]?.length) player.markSkill("swlu_mengyan");
								if (Array.isArray(player.storage?.swlu_mengyan_subPlayer) && player.storage?.swlu_mengyan_subPlayer?.length) {
									player.storage.swlu_mengyan_subPlayer.pop();
								}
							},
						});
						player.storage.swlu_mengyan_subPlayer ??= [];
						player.storage.swlu_mengyan_subPlayer.push(subPlayerCur);

						//为了原版的bug多的步骤
						game.broadcastAll((skill, cname) => {
							const list = [lib.translate[cname] + "傀儡", lib.translate[cname + "_prefix"], lib.translate[cname + "_ab"]];
							for (let i = 0; i < list.length; i++) {
								if (!list[i]) {
									continue;
								}
								lib.translate[skill + ["", "_prefix", "_ab"][i]] = list[i];
							}
							lib.skill[skill].charlotte = true;
						}, subPlayerCur, cname)

						if (!_status.postReconnect.swlu_mengyan2) {
							_status.postReconnect.swlu_mengyan2 = [
								function (arr) {
									for (let list2 of arr) {
										const skill = list2[0],
											cname = list2[1],
											thisskill = list2[2],
											thischaracter = list2[3];
										const list = [lib.translate[cname] + "傀儡", lib.translate[cname + "_prefix"], lib.translate[cname + "_ab"]];
										for (let i = 0; i < list.length; i++) {
											if (!list[i]) {
												continue;
											}
											lib.translate[skill + ["", "_prefix", "_ab"][i]] = list[i];
										}
										lib.skill[skill] = thisskill;
										lib.character[skill] = thischaracter;
									}
								},
								[],
							];
						}
						_status.postReconnect.swlu_mengyan2[1].add([subPlayerCur, cname, lib.skill[subPlayerCur], lib.character[subPlayerCur]]);

						lib.skill.swlu_mengyan.removePlayerData(player, target);
						if (player.getLastStat("skill")?.swlu_mengyan_backup >= 3) {
							await player.loseMaxHp();
							//鹿关成功
							if (player.hasSkill("swlu_xiaqi") && !player.storage.swlu_xiaqi) await game.delay(0, 2000);
							await event.trigger("swluguan");
						}
						player.removeSkill(playerOriginalSkills);
						await player.callSubPlayer(subPlayerCur);
						Object.assign(player.getStorage(player.storage.swlu_mengyan_subPlayer[player.storage.swlu_mengyan_subPlayer.length - 1], {}), { subPlayerBefore: player.storage.subplayer });
						//Object.assign(player.tempSkills, target.tempSkills);
						// player.when("exitSubPlayerBeofre")
						// 	.assign({
						// 		forceDie: true,
						// 	})
						// 	.filter((event, player) => {
						// 		debugger
						// 		return [player.name1, player.name2].includes(player.storage.swlu_mengyan_subPlayer);
						// 	})
						// 	.then(() => {
						// 		player.removeSkill(player.getSkills(true, false, false));
						// 	})
						if (player.storage?.swlu_mengyan?.[0]?.length) {
							await player.markSkill("swlu_mengyan");
						}

						if (player.getLastStat("skill")?.swlu_mengyan_backup >= 3) {
							//鹿关成功
							const result = await player
								.chooseTarget("是否对一名其他角色造成1点伤害？", function (card, player, target) {
									return target != player;
								})
								.set("ai", function (target) {
									return -get.attitude(_status.event?.player, target);
								})
								.forResult();
							player.line(result.targets[0]);
							await result.targets[0].damage(1, player);
						}
					},
				};
			},
		},
		getSubPlayerSkills(target) {
			if (!target) return undefined;
			return ["swlu_submengyan", "swlu_subclear"].concat(target.getSkills(null, false, false).filter(skill => ![...new Set(Object.values(target.additionalSkills || {}).flat())].includes(skill))).filter(skill => {
				const info = get.info(skill);
				if (skill == "subplayer") return true;
				if (info && info.charlotte) return false;
				return true;
			});
		},
		getPlayerData(player, target) {
			let storage = player.storage.swlu_mengyan;
			const index = storage[0].indexOf(target);
			return index !== -1 ? storage[1][index] : undefined;
		},
		addPlayerData(player, target, num) {
			let storage = player.storage.swlu_mengyan;
			storage ??= [[], []];
			const index = storage[0].indexOf(target);
			if (index === -1) {
				storage[0].push(target);
				storage[1].push(num);
			}
			else {
				storage[1][index] += num;
			}
			game.log(player, "获得了", "#y" + num, "个", target, "的", "#y”碎片“");
			player.markSkill("swlu_mengyan");
			game.broadcast((player, storage) => {
				player.storage.swlu_mengyan = storage;
			}, player, player.storage.swlu_mengyan);
		},
		removePlayerData(player, target, num) {
			let storage = player.storage.swlu_mengyan;
			storage ??= [[], []];
			const index = storage[0].indexOf(target);
			if (index !== -1) {
				if (num === undefined) {
					num = storage[1][index];
					storage[0].splice(index, 1);
					storage[1].splice(index, 1);
				}
				else {
					storage[1][index] -= num;
				}
			}
			game.log(player, "失去了", "#y" + num, "个", target, "的", "#y”碎片“");
			player.markSkill("swlu_mengyan");
		},
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [[], []];
			}
			game.broadcastAll(() => {
				lib.skill.subplayer.charlotte = true
			})
			_status.postReconnect.swlu_mengyan = [
				function () {
					lib.skill.subplayer.charlotte = true
				},
				[],
			];
		},
		marktext: "衍",
		intro: {
			name: "碎片背包",
			markcount: (storage = [[]]) => storage[0].length,
			content(storage = [[]], player) {
				if (!storage.length) {
					return "无信息";
				}
				var str = "<span style=\"font-size: 14px;\">前辈们，请把力量借给我吧！</span><br>";
				for (var i = 0; i < storage[0].length; i++) {
					var str2 = get.translation(storage[0][i]) + "：" + storage[1][i];
					// if (!storage[0][i].isIn()) {
					// 	str2 = '<span style="opacity:0.5">' + str2 + "（已故）</span>";
					// }
					str += "<li>" + str2;
				}
				return str;
			},
		},
		//onremove: true,
		group: ["swlu_mengyan_add", "swlu_mengyan_lose"],
		subSkill: {
			add: {
				audio: [`${ea}swlu_lugushou/swlu_mengyan1.mp3`, `${ea}swlu_lugushou/swlu_mengyan2.mp3`],
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				filter(event, player) {
					var target = event.player,
						source = event.source;
					if (target === source && source === player) {
						return false;
					}
					if (!target || !source) {
						return false;
					}
					return true;
				},
				forced: true,
				async content(event, trigger, player) {
					const target = trigger.player,
						source = trigger.source,
						num = trigger.num;
					if (target === player) {
						lib.skill.swlu_mengyan.addPlayerData(player, source, num)
					}
					else if (source === player) {
						lib.skill.swlu_mengyan.addPlayerData(player, target, num)
					}
				},
			},
			lose: {
				trigger: {
					player: "subPlayerDie",
				},
				filter(event, player) {
					return event.getParent()?.name != "swlu_submengyan_delete";
				},
				forced: true,
				async content(event, trigger, player) {
					var list = [],
						choiceList = ["横置并弃置两张手牌", "失去1点体力", "失去1点体力上限"];
					if (player.storage["swlu_mengyanChoice"] === "选项一") {
						choiceList[0] += '<span style="color: yellow;">' + "(上次选择)" + "</span>"
					}
					else if (player.storage["swlu_mengyanChoice"] === "选项二") {
						choiceList[1] += '<span style="color: yellow;">' + "(上次选择)" + "</span>"
					}
					else if (player.storage["swlu_mengyanChoice"] === "选项三") {
						choiceList[2] += '<span style="color: yellow;">' + "(上次选择)" + "</span>"
					}
					if (player.countCards('h') >= 2 && !player.isLinked() && player.storage["swlu_mengyanChoice"] !== "选项一") list.push("选项一");
					else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
					if (player.storage["swlu_mengyanChoice"] !== "选项二") list.push("选项二");
					else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
					if (player.storage["swlu_mengyanChoice"] !== "选项三") list.push("选项三");
					else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "</span>";
					const result = await player
						.chooseControl(list)
						.set("prompt", get.translation("swlu_mengyan"))
						.set("prompt2", "选择不同于上一次的一项执行：")
						.set("choiceList", choiceList)
						.set("choiceList2", list)
						.set("ai", function (event, player) {
							return Math.random();
						})
						.forResult();
					if (result?.control === "选项一") {
						await player.link();
						await player.chooseToDiscard("h", true, 2);
					}
					else if (result?.control === "选项二") {
						await player.loseHp();
					}
					else if (result?.control === "选项三") {
						await player.loseMaxHp();
					}
					player.storage["swlu_mengyanChoice"] = result?.control;
				},
			},
			backup: {},
			audio: {
				audio: `${ea}swlu_lugushou/swlu_mengyan3.mp3`,
			},
		}
	},
	swlu_xiaqi: {
		audio: `${ea}swlu_lugushou:1`,
		dutySkill: true,
		group: ["swlu_xiaqi_achieve", "swlu_xiaqi_fail"],
		achievesay: ["嘻嘻，我要赢", `孩子们，让我出牌`, "不玩神山识玩什么？"],
		failsay: ["闹麻了", "感觉被做局了", "唉，孩子们"],
		subSkill: {
			achieve: {
				audio: 'swlu_xiaqi',
				trigger: {
					player: "swluguan",
				},
				forced: true,
				locked: false,
				skillAnimation: false,
				animationColor: "thunder",
				async content(event, trigger, player) {

					if (typeof swTool.playSkillVideo === "function") {
						game.broadcastAll(function () {
							swTool.playSkillVideo("lugushou", 5300);
						})
						await game.delay(0, 5300);
					}

					player.awakenSkill("swlu_xiaqi");
					game.log(player, "成功完成使命");
					await player.gainMaxHp(2);
					await player.recover();
					player.line(game.filterPlayer(p => p != player));
					player.chat(lib.skill.swlu_xiaqi.achievesay.randomGet());
					game.filterPlayer(p => p != player).forEach(p => {
						lib.skill.swlu_mengyan.addPlayerData(player, p, 2)
					})
				},
			},
			fail: {
				audio: 'swlu_xiaqi',
				trigger: { player: "dieBegin" },
				forced: true,
				locked: false,
				firstDo: true,
				filter(event, player) {
					if (!(event.getParent().name !== "giveup" && player.maxHp > 0)) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					player.awakenSkill("swlu_xiaqi");
					game.log(player, "使命失败");
					trigger.cancel();
					await player.loseMaxHp(1);
					await player.recoverTo(1);
					player.chat(lib.skill.swlu_xiaqi.failsay.randomGet());
					//await player.useSkill("swlu_mengyan");
					if (player.storage?.swlu_mengyan?.[0]?.length) {
						const videoId = lib.status.videoId++;
						if (event.isMine()) {
							const dialog = lib.skill.swlu_mengyan.chooseButton.dialog(event, player);
							dialog.videoId = videoId;
							dialog.open();
						}
						else if (player.isOnline2()) {
							player.send(
								function (event, id, player) {
									const dialog = lib.skill.swlu_mengyan.chooseButton.dialog(event, player);
									dialog.videoId = id;
									dialog.open();
								},
								event,
								videoId,
								player
							);
						}
						const result = await player.chooseButton()
							.set("dialog", videoId)
							.set("closeDialog", true)
							.forResult();
						if (result?.bool) {
							Object.assign(lib.skill.swlu_mengyan_backup, lib.skill.swlu_mengyan.chooseButton.backup(result?.links))
							game.broadcast((skill) => {
								lib.skill.swlu_mengyan_backup = skill;
							}, lib.skill.swlu_mengyan_backup)
							await player.useSkill("swlu_mengyan_backup");
						}
					}
				},
			},
		},
	},
	swlu_submengyan: {
		audio: `swlu_mengyan`,
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			var target = event.player,
				source = event.source;
			if (target === source && source === player) {
				return false;
			}
			if (!target || !source) {
				return false;
			}
			return true;
		},
		forced: true,
		async content(event, trigger, player) {
			const target = trigger.player,
				source = trigger.source,
				num = trigger.num;
			lib.skill.swlu_mengyan.addPlayerData(player, target, num)
		},
		group: "swlu_submengyan_delete",
		subSkill: {
			delete: {
				enable: "phaseUse",
				usable: Infinity,
				locked: true,
				manualConfirm: true,
				prompt: "确认销毁此随从？",
				filter(event, player) {
					return true;
				},
				async content(event, trigger, player) {
					await player.exitSubPlayer(true);
					const storage = player.getStorage("swlu_mengyan_subPlayer", []);
					if (storage.length > 0) {
						player.storage.subplayer = player.getStorage(storage[storage.length - 1])?.subPlayerBefore;
						player.addSkill("subplayer");
					}
				},
			}
		},
	},
	swlu_subclear: {
		charlotte: true,
		onremove(player) {
			if (get.event().name === "exitSubPlayer") {
				player.removeSkill(player.getSkills(null, false, false).filter(skill => {
					return skill != "subplayer";
					// let info = get.info(skill);
					// if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
					// 	return false;
					// }
					// return true;
				}));
			}
		},
	},
	swlu_yuqian: {
		audio: `${ea}swlu_sunyuning:2`,
		group: ["swlu_yuqian_start", "swlu_yuqian_gain"],
		subSkill: {
			start: {
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				audio: "swlu_yuqian",
				forced: true,
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(target => target.getNext());
				},
				async content(event, trigger, player) {
					const players = game.filterPlayer(target => target.getNext()).sortBySeat();
					const players2 = players.filter(target => target.identity && !target.isZhu).sortBySeat();
					const result = await player.chooseBool(`###迂迁###\n是否令所有非主公角色同时将身份牌交给下家？`).forResult();
					if (result?.bool) {
						if (players2.length) {
							const orginal = players2.map(target => ({
								identity: target.identity,
								side: target.side,
							}));
							game.broadcastAll(
								function (players, orginal) {
									for (let i = 0; i < players.length; i++) {
										if (players[i].isZhu) continue;
										players[i].forceShown = false;
										let next = players[i].getNext();
										while (next.isZhu) next = next.getNext();
										if (next.node?.identity) next.node.identity.classList.add("guessing");
										next.identity = orginal[i].identity;
										next.side = orginal[i].side;
										next.setIdentity("cai");
										if (game.me.isZhu) continue;
										let menext = game.me.getNext();
										while (menext.isZhu) menext = menext.getNext();
										if (menext == next || game.me == next) {
											next.setIdentity(next.identity);
											next.forceShown = true;
											if (next.node?.identity) next.node.identity.classList.remove("guessing");
										}
									}
									// const list = ["zhu", "rZhu", "bZhu"]
									// list.forEach(i => {
									// 	if (game[i] && game[i].getNext()) {
									// 		game[i].isZhu = undefined;
									// 		delete game[i].identityShown;
									// 		game[i] = game[i].getNext();
									// 		game[i].isZhu = true;
									// 		game[i].identityShown = true;
									// 	}
									// })
									// if (game.zhu) {
									// 	game.zhu.setIdentity(game.zhu.identity);
									// 	game.zhu.forceShown = true;
									// 	game.zhu.identityShown = true;
									// 	if (game.zhu.node?.identity) game.zhu.node.identity.classList.remove("guessing");
									// }
								},
								players2,
								orginal
							);
							const listrandom = ["man~", "我的身份！", "我让你飞起来", "这么玩是吧？", "孩子们我的身份坠机了", "我要烟牌！！"];
							for (const pp of players2) {
								if (pp == player) continue;
								await pp.chat(listrandom.randomGet());
								await game.delayx(1);
							}
						}
					}
					// 伪同时：先记录每名角色初始手牌，再依次交给下家，保证give事件链完整触发
					const giveList = players.map(p => [p, p.getNext(), p.getCards("h").slice(0)]);
					for (const [from, to, cards] of giveList) {
						if (cards.length) {
							await from.give(cards, to);
						}
					}
				},
			},
			gain: {
				audio: "swlu_yuqian",
				trigger: {
					global: "gainAfter",
				},
				round: 1,
				filter(event, player) {
					if (event.player == player) return false;
					if (event.source != player) return false;
					return true;
					// const target = event.player;
					// return !player.identity || !target.identity || player.identity != target.identity;
				},
				async cost(event, trigger, player) {
					const target = trigger.player;
					const list = [];
					if (target.countCards("h")) list.push("手牌区");
					if (target.countCards("e")) list.push("装备区");
					if (!list.length) {
						event.result = { bool: false };
						return;
					}
					const result = await player
						.chooseControl(list, "cancel2")
						.set("prompt", "迂迁：是否获得其一个区域内的所有牌？")
						.set("prompt2", `请选择要获得${get.translation(target)}的区域`)
						.set("ai", () => list[0])
						.forResult();
					event.result = {
						bool: !!result?.control && result.control != "cancel2",
						cost_data: {
							target,
							pos: result?.control == "装备区" ? "e" : "h",
						},
					};
				},
				async content(event, trigger, player) {
					const { target, pos } = event.cost_data;
					await player.turnOver();
					const cards = target.getCards(pos);
					if (!cards.length) return;
					player.line(target, "green");
					await player.gain(cards, target, "giveAuto");
				},
			},
		},
	},
	swlu_lvshu: {
		audio: `${ea}swlu_sunyuning:2`,
		locked: true,
		forced: true,
		usable: Infinity,
		trigger: {
			player: "changeHp",
		},
		async content(event, trigger, player) {
			const hp = player.hp;
			if (hp >= 3) {
				if (player.getStat("skill")?.swlu_yuqian_gain) {
					delete player.getStat("skill").swlu_yuqian_gain;
					player.markSkill("swlu_yuqian_gain");
				}
			}
			else if (hp == 2) {
				if (player.isTurnedOver()) await player.turnOver(false);
				if (player.isLinked()) await player.link(false);
			}
			else {
				if (player.countCards("he")) {
					const giveResult = await player
						.chooseCardTarget({
							prompt: "律枢：将任意张牌交给一名其他角色",
							position: "he",
							filterTarget: lib.filter.notMe,
							selectCard: [1, Infinity],
							filterCard: true,
							ai1(card) {
								return 6 - get.value(card);
							},
							ai2(target) {
								const player = get.player();
								return get.attitude(player, target);
							},
						})
						.forResult();
					if (giveResult?.bool && giveResult.targets?.length && giveResult.cards?.length) {
						await player.give(giveResult.cards, giveResult.targets[0]);
					}
				}
				player.addTempSkill("swlu_lvshu_baiban", "roundStart");
			}
			if (player.countSkill("swlu_lvshu") === 3) {
				await player.loseMaxHp();
				const targetResult = await player
					.chooseTarget("律枢（鹿关）：可以令一名角色翻面", false)
					.set("ai", target => {
						const player = get.player();
						return -get.attitude(player, target);
					})
					.forResult();
				if (targetResult?.bool && targetResult.targets?.length) {
					const target = targetResult.targets[0];
					player.line(target);
					await target.turnOver();
				}
				await event.trigger("swluguan");
			}
		},
		subSkill: {
			baiban: {
				popup: false,
				nopop: true,
				charlotte: true,
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
					player.removeTip(skill);
				},
				init(player, skill) {
					player.addSkillBlocker(skill);
					player.addTip(skill, "律枢 技能失效");
				},
				skillBlocker(skill, player) {
					const info = lib.skill[skill];
					if (!info) return false;
					return !info.persevereSkill && !info.charlotte;
				},
				mark: true,
				marktext: "律",
				intro: {
					content(storage, player, skill) {
						const list = player.getSkills(null, false, false).filter(i => lib.skill[skill].skillBlocker(i, player));
						if (list.length) return "失效技能：" + get.translation(list);
						return "无失效技能";
					},
				},
			},
		},
	},
	swlu_xucheng: {
		audio: `${ea}swlu_sunyuning:2`,
		trigger: {
			global: "phaseEnd",
		},
		persevereSkill: true,
		filter(event, player) {
			return event.player != player && (event.player.countCards("h") == 0 || event.player.countCards("e") == 0);
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl("选项一", "选项二", "选项三", "cancel2")
				.set("prompt", "虚承：请选择一项")
				.set("choiceList", [
					"将手牌数调整至与其体力上限相同并翻面（至多摸五张）",
					"观看该角色的手牌并可以视为使用其的一张牌",
					"使用一张手牌",
				])
				.set("ai", function () {
					return "选项一";
				})
				.forResult();
			event.result = {
				bool: !!(result.control && result.control !== "cancel2"),
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			if (!event.cost_data || event.cost_data === "cancel2") {
				return;
			}
			player.addTempSkill("swlu_xucheng_distance", "phaseAfter");
			player.markAuto("swlu_xucheng_distance", [trigger.player.playerid]);
			if (event.cost_data === "选项一") {
				const need = Math.max(0, trigger.player.maxHp);
				const hand = player.countCards("h");
				if (hand < need) await player.draw(Math.min(5, need - hand));
				else if (hand > need) await player.chooseToDiscard("h", hand - need, true);
				await player.turnOver();
			}
			else if (event.cost_data === "选项二") {
				if (!trigger.player.countCards("h")) return;
				const resultPick = await player
					.choosePlayerCard(trigger.player, "h", [1, 1], false, "虚承：请选择一张牌并视为使用")
					.set("visible", true)
					.set("filterButton", function (button) {
						const player = _status.event.player;
						const target = _status.event.target;
						const card = button.link;
						const owner = get.owner(card) || target;
						return player.hasUseTarget(
							get.autoViewAs(
								{
									name: get.name(card, owner),
									nature: get.nature(card, owner),
									isCard: true,
									suit: get.suit(card, owner),
									number: get.number(card, owner),
								},
								[]
							),
							null,
							false
						);
					})
					.set("ai", function (button) {
						const player = _status.event.player;
						const target = _status.event.target;
						const card = button.link;
						const owner = get.owner(card) || target;
						const vcard = get.autoViewAs(
							{
								name: get.name(card, owner),
								nature: get.nature(card, owner),
								isCard: true,
								suit: get.suit(card, owner),
								number: get.number(card, owner),
							},
							[]
						);
						const v = player.getUseValue(vcard);
						return typeof v == "number" ? v : 0;
					})
					.forResult();
				if (!resultPick || !resultPick.bool || !resultPick.cards || !resultPick.cards.length) return;
				const picked = resultPick.cards[0];
				const owner = get.owner(picked) || trigger.player;
				const vcard = get.autoViewAs(
					{
						name: get.name(picked, owner),
						nature: get.nature(picked, owner),
						isCard: true,
						suit: get.suit(picked, owner),
						number: get.number(picked, owner),
					},
					[]
				);
				await player.chooseUseTarget(vcard, true, false);
			}
			else if (event.cost_data === "选项三") {
				if (!player.countCards("hs")) return;
				const result = await player.chooseToUse({
					filterCard(card) {
						if (get.itemtype(card) != "card" || !["h", "s"].includes(get.position(card))) {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					// filterTarget(card, player2, target) {
					// 	return lib.filter.targetEnabled.apply(this, arguments);
					// },
					prompt: "虚承：使用一张手牌",
					addCount: false,
					forced: true
				});
			}
		},
		subSkill: {
			distance: {
				charlotte: true,
				onremove: true,
				nopop: true,
				mod: {
					globalFrom(from, to, distance) {
						if (!from?.hasSkill || !from.hasSkill("swlu_xucheng_distance")) return distance;
						if (from.getStorage("swlu_xucheng_distance").includes(to.playerid)) return 1;
						return distance;
					},
					globalTo(from, to, distance) {
						if (!to?.hasSkill || !to.hasSkill("swlu_xucheng_distance")) return distance;
						if (to.getStorage("swlu_xucheng_distance").includes(from.playerid)) return 1;
						return distance;
					},
				},
			},
		},
	},

	// 鹿帝心动
	swlu_kuiqing: {
		audio: "xingchong",
		mark: true,
		marktext: "☯",
		usable: 3,
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "swlu_xindong" }, "swlu_xindong" + (player.storage[skill] ? "_shadow" : ""));
			if (player.storage[skill]) {
				player.removeTip("swlu_kuiqing_track");
			} else {
				lib.skill.swlu_kuiqing.updateSuitTip(player);
			}
		},
		intro: {
			content(storage, player) {
				if (!storage) return `当有花色相同的牌被连续使用后，你可以将手牌调整至体力上限并选择一名其他角色的至多X张未拥有此法标记的手牌，这些牌被标记为“葵倾”且于本轮中无法被使用、打出或弃置（X为你手牌调整前后的差值-1且至少为1）。`;
				return `当有转化或虚拟牌被使用时，你可以将手牌调整至1并选择一名其他角色，令其于下个回合开始前使用的前X次牌无效（X为你手牌调整前后的差值-1且至少为1）。`;
			},
		},
		group: ["swlu_kuiqing_change", "swlu_kuiqing_track"],
		trigger: { global: "useCard" },
		filter(event, player) {
			if (player.storage.swlu_kuiqing) {
				return get.is.convertedCard(event.card) || get.is.virtualCard(event.card);
			}
			const suit = get.suit(event.card, event.player);
			if (!suit) return false;
			const last = _status.swlu_kuiqing_last;
			return !!(last && last.suit === suit);
		},
		updateSuitTip(player) {
			const targets = player
				? [player]
				: game.filterPlayer(current => current.hasSkill("swlu_kuiqing", null, false, false) && !current.storage.swlu_kuiqing);
			const suit = _status.swlu_kuiqing_last?.suit;
			for (const current of targets) {
				if (!current.hasSkill("swlu_kuiqing", null, false, false) || current.storage.swlu_kuiqing) {
					current.removeTip("swlu_kuiqing_track");
					continue;
				}
				if (suit) {
					current.addTip("swlu_kuiqing_track", `葵倾 ${get.translation(suit)}`);
				} else {
					current.removeTip("swlu_kuiqing_track");
				}
			}
		},
		async adjustHandTo(player, targetNum) {
			const hand = player.countCards("h");
			if (hand < targetNum) {
				await player.draw(targetNum - hand);
			} else if (hand > targetNum) {
				await player.chooseToDiscard("h", hand - targetNum, true);
			}
		},
		logTarget: "targets",
		async cost(event, trigger, player) {
			if (!player.storage.swlu_kuiqing) {
				const handBefore = player.countCards("h");
				const num = Math.max(1, Math.abs(player.maxHp - handBefore) - 1);
				event.result = await player
					.chooseTarget(get.prompt("swlu_kuiqing"), "将手牌调整至体力上限并选择一名其他角色", lib.filter.notMe)
					.set("ai", target => -get.attitude(get.player(), target))
					.forResult();
				if (event.result?.bool) event.result.cost_data = { num };
			}
			else {
				const handBefore = player.countCards("h");
				const num = Math.max(1, handBefore - 1 - 1);
				event.result = await player
					.chooseTarget(get.prompt("swlu_kuiqing"), "将手牌调整至1并选择一名其他角色", lib.filter.notMe)
					.set("ai", target => -get.attitude(get.player(), target))
					.forResult();
				if (event.result?.bool) event.result.cost_data = { num };
			}
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji("swlu_kuiqing");
			if (player.storage.swlu_kuiqing) {
				const num = event.cost_data?.num ?? Math.max(1, Math.abs(player.maxHp - player.countCards("h")) - 1);
				await lib.skill.swlu_kuiqing.adjustHandTo(player, player.maxHp);
				const target = event.targets?.[0];
				if (target?.countCards("h", card => !card.hasGaintag("swlu_kuiqing"))) {
					const pick = await player
						.choosePlayerCard(
							target,
							"h",
							[1, num],
							true,
							`葵倾：选择其至多${get.cnNumber(num)}张未拥有“葵倾”标记的手牌`
						)
						.set("filterButton", button => !button.link.hasGaintag("swlu_kuiqing"))
						.set("ai", button => get.value(button.link, target))
						.forResult();
					if (pick?.bool && pick.cards?.length) {
						target.addGaintag(pick.cards, "swlu_kuiqing");
						target.addSkill("swlu_kuiqing_lock");
						target.markSkill("swlu_kuiqing_lock");
						player.line(target);
						game.log(target, "的", `${get.cnNumber(num)}张牌`, "被标记为“葵倾”且于本轮无法被使用、打出或弃置");
					}
				}
			}
			else {
				const num = event.cost_data?.num ?? Math.max(1, player.countCards("h") - 1 - 1);
				await lib.skill.swlu_kuiqing.adjustHandTo(player, 1);
				const target = event.targets?.[0];
				if (target) {
					target.addTempSkill("swlu_kuiqing_invalid", { player: "phaseBefore" });
					if (num > target.countMark("swlu_kuiqing_invalid")) {
						target.setMark("swlu_kuiqing_invalid", num, false);
					}
					game.log(target, "于下个回合开始前使用的前", get.cnNumber(num), "张牌无效");
				}
			}
			if ((player.getHistory("useSkill", (evt) => evt.skill == "swlu_kuiqing").length) == 3) {
				await player.loseMaxHp();
				if (player.hp < player.maxHp) {
					await player.recoverTo(player.maxHp);
				}
				await event.trigger("swluguan");
			}
		},
		subSkill: {
			change: {
				audio: "xingchong",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【葵倾】为状态" + (player.storage.swlu_kuiqing ? "阳" : "阴");
				},
				check: () => 1,
				content(event, trigger, player) {
					player.changeZhuanhuanji("swlu_kuiqing");
				},
			},
			track: {
				charlotte: true,
				trigger: { global: "useCardAfter" },
				silent: true,
				firstDo: true,
				init(player) {
					if (!player.storage.swlu_kuiqing) {
						lib.skill.swlu_kuiqing.updateSuitTip(player);
					}
				},
				onremove(player) {
					player.removeTip("swlu_kuiqing_track");
				},
				content(event, trigger, player) {
					const suit = get.suit(trigger.card, trigger.player);
					if (!suit) {
						delete _status.swlu_kuiqing_last;
						lib.skill.swlu_kuiqing.updateSuitTip();
						return;
					}
					_status.swlu_kuiqing_last = { suit };
					lib.skill.swlu_kuiqing.updateSuitTip();
				},
			},
			invalid: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "倾",
				intro: {
					content: "下个回合开始前使用的前#张牌无效",
				},
				forced: true,
				popup: false,
				trigger: { player: "useCard" },
				filter(event, player) {
					return player.hasMark("swlu_kuiqing_invalid");
				},
				content(event, trigger, player) {
					player.removeMark(event.name, 1, false);
					if (!player.hasMark(event.name)) {
						player.removeSkill(event.name);
					}
					game.log(trigger.card, "被无效了");
					player.popup("无效");
					trigger.all_excluded = true;
				},
			},
			lock: {
				charlotte: true,
				mark: true,
				marktext: "葵",
				intro: {
					markcount(storage, player) {
						return player.countCards("h", card => card.hasGaintag("swlu_kuiqing"));
					},
					content: "“葵倾”标记的牌于本轮无法被使用、打出或弃置",
				},
				trigger: { global: "roundStart" },
				forced: true,
				popup: false,
				remove: true,
				filter(event, player) {
					return player.getCards("h", card => card.hasGaintag("swlu_kuiqing"))?.length > 0;
				},
				content(event, trigger, player) {
					player.removeGaintag("swlu_kuiqing");
					player.removeSkill("swlu_kuiqing_lock");
				},
				mod: {
					cardEnabled2(card, player) {
						if (card.hasGaintag("swlu_kuiqing")) return false;
					},
					cardDiscardable(card, player) {
						if (card.hasGaintag("swlu_kuiqing")) return false;
					},
					cardRespondable(card, player) {
						if (card.hasGaintag("swlu_kuiqing")) return false;
					},
				},
			},
		},
	},
	swlu_kongxian: {
		audio: "liunian",
		group: ["swlu_kongxian_show", "swlu_kongxian_discard", "swlu_kongxian_chengshi"],
		getRoundDiscarded(player) {
			const cards = [];
			game.getGlobalHistory("cardMove", evt => {
				if (evt.name !== "lose" || !evt.cards?.length) return;
				if (evt.position !== ui.discardPile && evt.position?.id !== "discardPile") return;
				for (const card of evt.cards) {
					if (card && get.position(card, true) === "d" && player.hasUseTarget(card)) {
						cards.add(card);
					}
				}
			});
			return cards;
		},
		isChengshi(current) {
			return current.countCards("h") > current.hp && !current.getHistory("sourceDamage").length;
		},
		subSkill: {
			show: {
				audio: "liunian",
				trigger: { global: "phaseEnd" },
				priority: 1,
				filter(event, player) {
					if (event.player === player || !event.player?.isIn()) return false;
					return event.player.countCards("h") > event.player.hp;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(`空弦：选择一名角色，令其展示一张基本或者普通锦囊牌`, (card, source, target) => {
							return target.countCards("h", c => {
								const type = get.type(c);
								return type === "basic" || type === "trick";
							});
						})
						.set("ai", target => get.attitude(player, target))
						.forResult();
				},
				async content(event, trigger, player) {
					const current = trigger.player;
					const chengshi = lib.skill.swlu_kongxian.isChengshi(current);
					if (!event.targets?.length) return;
					const target = event.targets[0];
					if (
						!target.countCards("h", card => {
							const type = get.type(card, target);
							if (type !== "basic" && type !== "trick") return false;
							return target.hasUseTarget(get.autoViewAs(card, [], target), false, false);
						})
					) {
						target.popup("无牌可选");
						return;
					}
					const pick = await target
						.chooseCard("h", true, card => {
							const tp = get.event()?.player;
							const type = get.type(card, tp);
							if (type !== "basic" && type !== "trick") return false;
							return tp.hasUseTarget(get.autoViewAs(card, [], tp), false, false);
						})
						.set("prompt2", "空弦：展示一张基本或普通锦囊牌")
						.set("ai", card => get.event().player.getUseValue(get.autoViewAs(card, [], get.event().player)))
						.forResult();
					if (!pick?.bool || !pick.cards?.length) return;
					await target.showCards(pick.cards, `${get.translation(target)}展示了`).set("triggeronly", true);
					const card = pick.cards[0];
					const vcard = get.autoViewAs({ name: get.name(card, target), suit: get.suit(card, target), number: get.number(card, target), nature: get.nature(card, target) }, [], target);
					if (!target.hasUseTarget(vcard, false, false)) return;
					if (chengshi) {
						player.popup("乘势", "fire");
						vcard.storage = { ...vcard.storage, swlu_kongxian_chengshi: true };
					}
					const next = target.chooseUseTarget(vcard, [card], true, false);
					// if (card.name === vcard.name && get.is.sameNature(card, vcard, true)) {
					// 	next.set("viewAs", false);
					// }
					await next.forResult();
				},
			},
			discard: {
				audio: "liunian",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					if (event.player === player || !event.player?.isIn()) return false;
					if (event.player.getHistory("sourceDamage").length) return false;
					return lib.skill.swlu_kongxian.getRoundDiscarded(player).length > 0;
				},
				async cost(event, trigger, player) {
					const cards = lib.skill.swlu_kongxian.getRoundDiscarded(player);
					if (!cards.length) {
						event.result = { bool: false };
						return;
					}
					const result = await player
						.chooseButton([get.prompt("swlu_kongxian"), "使用本回合进入弃牌堆的一张牌", cards])
						.set("ai", button => get.player().getUseValue(button.link))
						.forResult();
					event.result = {
						bool: result?.bool,
						cost_data: result?.links ?? [],
					};
				},
				async content(event, trigger, player) {
					const card = event?.cost_data?.[0];
					if (!card) return;
					const current = trigger.player;
					const chengshi = lib.skill.swlu_kongxian.isChengshi(current);
					if (chengshi) {
						player.popup("乘势", "fire");
						card.storage = { ...card.storage, swlu_kongxian_chengshi: true };
					}
					await player.chooseUseTarget(card, true, false).forResult();
					card.storage.swlu_kongxian_chengshi = false;
				},
			},
			chengshi: {
				charlotte: true,
				trigger: { global: "useCardToPlayered" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					const use = event.getParent("useCard");
					return !!use?.card?.storage?.swlu_kongxian_chengshi;
				},
				content(event, trigger, player) {
					const use = trigger.getParent("useCard");
					if (!use) return;
					if (!Array.isArray(use.directHit)) use.directHit = [];
					use.directHit.addArray(game.players);
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg?.card) return false;
						return !!arg.card.storage?.swlu_kongxian_chengshi;
					},
				},
			},
		},
	},
	swlu_xinqi: {
		audio: "zhenge",
		zhuSkill: true,
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			if (!player.isIn() || event.player === player || event.player.group !== "key") return false;
			return player.getSkills(null, false, false).some(skill => get.is.zhuanhuanji(skill, player));
		},
		async content(event, trigger, player) {
			const list = player.getSkills(null, false, false).filter(skill => get.is.zhuanhuanji(skill, player));
			if (!list.length) return;
			let skill;
			if (list.length === 1) {
				const result = await player.chooseBool(get.prompt("swlu_xinqi"), `是否转换【${get.translation(list[0])}】的状态`).set("ai", () => 1).forResult();
				if (!result?.bool) return;
				skill = list[0];
			} else {
				const result = await player
					.chooseControl(list.concat("cancel2"))
					.set("prompt", get.prompt("swlu_xinqi"))
					.set("prompt2", "转换你的一个转换技状态")
					.set("ai", () => list[0])
					.forResult();
				if (result.control === "cancel2") return;
				skill = result.control;
			}
			player.logSkill("swlu_xinqi");
			player.changeZhuanhuanji(skill);
			player.popup(skill, "wood");
			game.log(player, "转换了", "#g【" + get.translation(skill) + "】", "的状态");
			await game.delayx();
		},
	},
	// 鹿帝天上客
	swlu_qiujian: {
		//audio: `${ea}swlu_tianshangke:2`,
		enable: "phaseUse",
		usable: 3,
		filter(event, player) {
			return [1, 2, 3, 4, 5].some((i) => player.hasEnabledSlot(i));
		},
		selectTarget: 1,
		filterTarget(card, player, target) {
			return target != player;
		},
		async content(event, trigger, player) {
			const target = event.target;
			// 废除一个装备栏
			const list = [1, 2, 3, 4, 5].filter((i) => player.hasEnabledSlot(i)).map((i) => "equip" + i);
			const result = await player
				.chooseControl(list)
				.set("prompt", "请选择废除一个装备栏")
				//.set("choiceList", list.map((slot) => (get.is.mountCombined() && slot == "equip3" ? get.translation("equip3_4") : get.translation(slot)) + "栏"))
				.set("ai", () => list.find((slot) => !get.player().getEquips(slot).length) || list[0])
				.forResult();
			await player.disableEquip(result.control);
			const X = Math.max(1, player.countDisabledSlot());
			const Y = Math.max(1, player.countEnabledSlot());
			const cards = get.cards(X * Y);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards, `${get.translation(player)}发动了【囚剑】`, true).set("delay_time", 0.1).set("clearArena", false);
			await game.delay(0, 2000); // 展示2秒
			game.broadcastAll(ui.clear);
			const damage = cards.filterInD().filter((card) => get.is.damageCard(card) && player.canUse(card, target, false));
			if (damage.length) {
				const result2 = await player
					.chooseButton(["囚剑：是否对其使用其中一张伤害牌？", damage], false)
					.set("ai", (button) => player.getUseValue(button.link))
					.forResult();
				if (result2?.bool && result2.links?.length) {
					const next = player.useCard(result2.links[0], [target], "swlu_qiujian");
					next.addCount = false;
					next.addSkillCount = false;
					await next;
				}
			}
			// 鹿关：本回合第3次发动时减1点体力上限并与该角色交换装备栏废除状态
			if (player.countSkill("swlu_qiujian") == 3) {
				await player.loseMaxHp();
				if (player.isDead()) return;
				const mine = [], theirs = [];
				for (const [slot, num] of Object.entries(player.disabledSlots || {})) {
					for (let i = 0; i < num; i++) mine.push(slot);
				}
				for (const [slot, num] of Object.entries(target.disabledSlots || {})) {
					for (let i = 0; i < num; i++) theirs.push(slot);
				}
				const theirsLeft = theirs.slice();
				const mineOnly = mine.filter((slot) => {
					const index = theirsLeft.indexOf(slot);
					if (index < 0) return true;
					theirsLeft.splice(index, 1);
					return false;
				});
				const theirsOnly = theirsLeft;
				if (mineOnly.length) await player.enableEquip(mineOnly);
				if (theirsOnly.length) await target.enableEquip(theirsOnly);
				if (mineOnly.length) await target.disableEquip(player, mineOnly);
				if (theirsOnly.length) await player.disableEquip(target, theirsOnly);
				game.log(player, "与", target, "交换了装备栏废除状态");
			}
			else {
				// 获得剩余牌
				const remains = cards.filterInD().filter((card) => !get.is.damageCard(card));
				if (remains.length) {
					await player.gain(remains, "gain2");
				}
			}
			if (get.itemtype(cards) == "cards" && cards.someInD()) {
				game.log(cards.filterInD(), "被置入了弃牌堆");
				await game.cardsDiscard(cards.filterInD());
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					return -get.attitude(player, target);
				},
			},
		},
	},
	swlu_bishen: {
		//audio: `${ea}swlu_tianshangke:1`,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return !event.skill;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseTarget(get.prompt2("swlu_bishen"), (card, player, target) => target.isAlive())
				.set("ai", (target) => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.forResult();
			event.result = { bool: result.bool, targets: result.targets };
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.insertPhase("swlu_bishen");
		},
		group: ["swlu_bishen_use", "swlu_bishen_end"],
		subSkill: {
			use: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return event.skill == "swlu_bishen";
				},
				async content(event, trigger, player) {
					player.addTempSkill("swlu_bishen_block");
				},
			},
			block: {
				charlotte: true,
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") return false;
					},
				},
				mark: true,
				intro: {
					content: "不能使用或打出手牌",
				},
			},
			end: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: { player: ["phaseEnd", "phaseCancelled"] },
				filter(event, player) {
					return event.skill == "swlu_bishen" && player.getHistory("gain").length > 0;
				},
				async content(event, trigger, player) {
					player.removeSkill("swlu_bishen_block");
					if (trigger.name == "phaseCancelled") {
						return;
					}
					const X = player.getHistory("gain").length;
					// 选择至多X个装备栏
					const list = [];
					for (let i = 1; i <= 5; i++) {
						if (i == 4 && get.is.mountCombined()) continue;
						const slot = i == 3 && get.is.mountCombined() ? "equip3_4" : "equip" + i;
						const disabled = player.hasDisabledSlot(slot);
						list.push([[slot, disabled], get.translation(slot) + "栏" + (disabled ? "（已废除）" : "")]);
					}
					const result = await player
						.chooseButton([`###【闭神】###<div class='text center'>选择至多` + get.cnNumber(Math.min(X, list.length)) + `个装备栏\n（已废除的装备栏将优先恢复且每个装备栏随机装备一件对应区域装备）</div>`, [list, "textbutton"]], [1, Math.min(X, list.length)])
						.set("ai", (button) => (button.link[1] ? 10 : 3))
						.forResult();
					const chosen = (result.bool ? result.links : []).map((link) => link[0]);
					for (const slot of chosen) {
						if (player.hasDisabledSlot(slot)) {
							await player.enableEquip(slot);
						}
					}
					for (const slot of chosen) {
						const card = get.cardPile((card2) => {
							if (slot == "equip3_4") {
								return ["equip3", "equip4"].includes(get.subtype(card2));
							}
							return get.subtype(card2) == slot;
						}, void 0, "random");
						if (!card) continue;
						await player.gain(card, "gain2");
						await player.equip(card);
					}
				},
			},
		},
		ai: {
			order: 3,
			result: {
				player: 1,
			},
		},
	},
	// 鹿帝睡死
	swlu_pianyu: {
		audio: "swq_duwo",
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return player.isIn() && event.player !== player && event.player.isIn();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseBool(get.prompt("swlu_pianyu"), `是否摸一张牌并回复1点体力，然后交给${get.translation(trigger.player)}一张基本或普通锦囊牌？`)
				.set("ai", () => true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.draw();
			await player.recover();
			const give = await player
				.chooseToGive({
					target,
					position: "he",
					prompt: `交给${get.translation(target)}一张基本或普通锦囊牌`,
					filterCard: (card, player) => {
						const type = get.type(card, null, player);
						return type === "basic" || type === "trick";
					},
					forced: true,
					ai: card => -get.value(card),
				})
				.forResult();
			if (!give?.bool || !give.cards?.length) return;
			const type = get.type(give.cards[0], null, player);
			let matchType = null;
			if (type === "basic") matchType = "trick";
			else if (type === "trick") matchType = "basic";
			if (matchType) {
				target.addTempSkill("swlu_pianyu_state");
				target.addTempSkill("swlu_pianyu_after");
				target.setStorage("swlu_pianyu_state", []);
				target.markAuto("swlu_pianyu_state", [player, matchType]);
				game.log(player, "令", target, "本回合使用", matchType === "trick" ? "普通锦囊牌" : "基本牌", "时成为额外目标");
			}
		},
		subSkill: {
			state: {
				charlotte: true,
				mark: true,
				marktext: "偏",
				onremove: true,
				intro: {
					nocount: true,
					content(storage, player) {
						const target = storage?.[0];
						const type = storage?.[1];
						return `你使用${type === "basic" ? "基本牌" : "普通锦囊牌"}时，若${get.translation(target)}不是此牌的目标，其成为目标；若其已是此牌的目标，此牌对其额外结算一次。`;
					},
				},
				trigger: { player: "useCard2" },
				direct: true,
				filter(event, player) {
					const rec = player.getStorage("swlu_pianyu_state", []);
					if (rec?.length == 0) return false;
					const target = rec?.[0];
					const type = rec?.[1];
					if (get.type(event.card, null, player) !== type) return false;
					return get.info(event.card)?.allowMultiple !== false;
				},
				async content(event, trigger, player) {
					const rec = player.getStorage("swlu_pianyu_state", []);
					if (rec?.length == 0) return false;
					const target = rec?.[0];
					const type = rec?.[1];
					if (trigger.targets?.includes(target)) {
						// 已是目标：标记到事件上，待此牌正常结算完仅对其单独额外结算一次
						trigger._swluPianyuExtra = target;
					} else {
						if (!trigger.targets) trigger.targets = [];
						trigger.targets.addArray([target]);
						player.line(target);
						game.log(target, "成为", trigger.card, "的额外目标");
					}
				},
			},
			after: {
				charlotte: true,
				direct: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return !!event._swluPianyuExtra && event._swluPianyuExtra.isAlive() && !event.cancelled && !event.all_excluded;
				},
				async content(event, trigger, player) {
					const target = trigger._swluPianyuExtra;
					game.log(trigger.card, "对", target, "额外结算一次");
					const next = game.createEvent(trigger.card.name, false, trigger);
					next.setContent(get.info(trigger.card).content);
					next.targets = [target];
					next.target = target;
					next.card = trigger.card;
					next.cards = trigger.cards;
					next.player = trigger.player;
					next.num = 0;
					next.skill = trigger.skill;
					next.multitarget = get.info(trigger.card).multitarget;
					next.preResult = trigger.preResult;
					next.baseDamage = trigger.baseDamage;
					if (trigger.directHit?.includes(target)) next.directHit = true;
					if (trigger.forceDie) next.forceDie = true;
					await next.start();
				},
			},
		}
	},
	swlu_juejie: {
		audio: "swq_xinjie",
		mark: true,
		marktext: "☯",
		usable: 3,
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
		},
		intro: {
			content(storage, player) {
				if (!storage) return "当你受到基本/普通锦囊牌的伤害后，你从牌堆中获得一张普通锦囊/基本牌。";
				return "当你受到基本/普通锦囊牌的伤害后，你令一名角色使用其手牌中的一张普通锦囊/基本牌。";
			},
		},
		trigger: { player: "damageEnd" },
		filter(event, player) {
			const card = event.card || event.cards?.[0];
			if (!card) return false;
			const type = get.type(card, null, event.source || player);
			return type === "basic" || type === "trick";
		},
		logTarget(trigger, player) {
			return null;
		},
		async cost(event, trigger, player) {
			const src = trigger.card || trigger.cards?.[0];
			const wantTrick = get.type(src, null, trigger.source || player) === "basic";
			if (!player.storage.swlu_juejie) {
				event.result = await player
					.chooseBool(get.prompt2("swlu_juejie"), `是否从牌堆中获得一张${wantTrick ? "普通锦囊" : "基本"}牌？`)
					//.set("prompt2", lib.dynamicTranslate.swlu_juejie(player, "swlu_juejie"))
					.set("ai", () => true)
					.forResult();
			} else {
				const result = await player
					.chooseTarget(get.prompt2("swlu_juejie"), `令一名角色使用其手牌中的一张${wantTrick ? "普通锦囊" : "基本"}牌`)
					//.set("prompt2", lib.dynamicTranslate.swlu_juejie(player, "swlu_juejie"))
					.set("ai", target => get.attitude(player, target))
					.forResult();
				event.result = { bool: result.bool, targets: result.targets };
			}
		},
		async content(event, trigger, player) {
			const src = trigger.card || trigger.cards?.[0];
			const wantTrick = get.type(src, null, trigger.source || player) === "basic";
			if (!player.storage.swlu_juejie) {
				const card = get.cardPile(
					c => (wantTrick ? ["trick"] : ["basic"]).includes(get.type(c, null, player)),
					"cardPile"
				);
				if (card) await player.gain(card, "gain2");
			} else {
				const target = event.targets?.[0];
				if (
					target &&
					target.countCards("h", (card) => {
						const type = get.type(card, null, target);
						if (wantTrick ? type !== "trick" : type !== "basic") return false;
						return lib.filter.filterCard(card, target) && target.hasUseTarget(card);
					}) > 0
				) {
					const filterCard = wantTrick
						? function (card, player) {
								if (get.type(card, null, player) !== "trick") return false;
								return lib.filter.filterCard(card, player) && player.hasUseTarget(card);
							}
						: function (card, player) {
								if (get.type(card, null, player) !== "basic") return false;
								return lib.filter.filterCard(card, player) && player.hasUseTarget(card);
							};
					await target.chooseToUse(
						filterCard,
						`【${get.translation("swlu_juejie")}】：使用一张${wantTrick ? "普通锦囊" : "基本"}牌`
					);
				}
			}
			player.changeZhuanhuanji("swlu_juejie");
			// 鹿关：一回合内第 3 次发动
			if (player.getHistory("useSkill", evt => evt.skill === "swlu_juejie").length === 3) {
				await player.loseMaxHp();
				player.addTempSkill("swlu_juejie_immune");
				const basic = get.cardPile(c => get.type(c, null, player) === "basic", "cardPile");
				const trick = get.cardPile(c => get.type(c, null, player) === "trick", "cardPile");
				const cards = [basic, trick].filter(Boolean);
				if (cards.length) await player.gain(cards, "gain2");
				await event.trigger("swluguan");
			}
		},
		subSkill: {
			immune: {
				charlotte: true,
				mark: true,
				marktext: "鹿",
				intro: { content: "防止你受到的伤害" },
				forced: true,
				trigger: { player: "damageBefore" },
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
		},
	},
	swlu_shuiyu: {
		audio: "swq_shuigu",
		skillAnimation: true,
		animationColor: "fire",
		limited: true,
		mark: true,
		marktext: "睡",
		intro: { content: "已对$发动过技能" },
		trigger: { global: "dyingAfter" },
		filter(event, player) {
			return !!event.player && event.player !== player && event.player.isIn() && !player.getStorage("swlu_shuiyu", []).includes(event.player);
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const count = game.getAllGlobalHistory("everything", evt => evt.name == "dying" && evt.player == target).length;
			event.result = await player
				.chooseBool(get.prompt("swlu_shuiyu"), `是否令${get.translation(target)}摸${get.cnNumber(count)}张牌并获得一个额外回合？（其回合结束时流失所有体力）`)
				.set("ai", (event, player) => get.attitude(player, event._trigger.player) < 0)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.awakenSkill("swlu_shuiyu");
			const count = game.getAllGlobalHistory("everything", evt => evt.name == "dying" && evt.player == target).length;
			await target.draw(Math.max(1, count));
			target.addTempSkill("swlu_shuiyu_guard");
			player.line(target);
			player.markAuto("swlu_shuiyu", [target]);
			target.addSkill("swlu_shuiyu_use");
			target.markAuto("swlu_shuiyu_use", player);
			game.log(player, "令", target, "摸", get.cnNumber(Math.max(1, count)), "张牌、获得一个额外回合，其回合结束时流失所有体力");
			target.insertPhase("swlu_shuiyu");
		},
		//group: ["swlu_shuiyu_reset"],
		subSkill: {
			use: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return event.skill == "swlu_shuiyu";
				},
				async content(event, trigger, player) {
					player.addSkill("swlu_shuiyu_doom");
					player.addTempSkill("swlu_shuiyu_reset");
				},
			},
			// 重置：目标在本技能给的额外回合内杀死过角色
			reset: {
				charlotte: true,
				trigger: { global: "dieAfter" },
				silent: true,
				forceDie: true,
				filter(event, player) {
					debugger
					if (!event.source) return false;
					const phase = event.getParent("phase");
					return phase?.skill === "swlu_shuiyu" && phase.player === event.source && player === event.source && player.getStorage("swlu_shuiyu_use")?.length > 0;
				},
				content(event, trigger, player) {
					const target = player.getStorage("swlu_shuiyu_use", [])?.[0];
					target.restoreSkill("swlu_shuiyu");
					game.log(target, "重置了", "#g【" + get.translation("swlu_shuiyu") + "】");
				},
			},
			guard: {
				charlotte: true,
				mark: true,
				marktext: "睡",
				intro: { content: "防止你受到的伤害" },
				forced: true,
				trigger: { player: "damageBefore" },
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			doom: {
				charlotte: true,
				mark: true,
				marktext: "圄",
				intro: { content: "你的回合结束时流失所有体力" },
				forced: true,
				trigger: { player: "phaseAfter" },
				async content(event, trigger, player) {
					player.removeSkill("swlu_shuiyu_doom");
					await player.loseHp(player.hp);
					player.removeSkill("swlu_shuiyu_use");
				},
			},
		},
	},
	//异构奇英录
	// 异构沮授
	swyg_jianying: {
		audio: 'xinjianying',
		trigger: { player: "useCard" },
		frequent: true,
		filter(event, player) {
			const evt = player.getLastUsed(1);
			if (!evt || !evt.card) return false;
			if (!player.isPhaseUsing()) return false;
			const evt2 = evt.getParent("phaseUse");
			if (!evt2 || evt2.name != "phaseUse" || evt2 !== event.getParent("phaseUse")) return false;
			if (!get.cardNameLength(evt.card)) return
			return true
		},
		init(player) {
			if (player.isPhaseUsing()) {
				const evt = _status.event.getParent("phaseUse");
				const history = player.getHistory("useCard", evt2 => evt2.getParent("phaseUse") == evt);
				if (history.length) {
					const trigger = history[history.length - 1];
					if (get.cardNameLength(trigger.card)) return;
					player.storage.swyg_jianying_mark = trigger.card;
					player.markSkill("swyg_jianying_mark");
					game.broadcastAll(
						(player, cardNameLength) => {
							if (player.marks.swyg_jianying_mark) player.marks.swyg_jianying_mark.firstChild.innerHTML = get.translation(cardNameLength);
						},
						player,
						get.cardNameLength(trigger.card)
					);
					player.when("phaseUseAfter").then(() => {
						player.unmarkSkill("swyg_jianying_mark");
						delete player.storage.swyg_jianying_mark;
					});
				}
			}
		},
		onremove(player) {
			player.unmarkSkill("swyg_jianying_mark");
			delete player.storage.swyg_jianying_mark;
		},
		async content(event, trigger, player) {
			const evt = player.getLastUsed(1);
			const evenCardnum = get.cardNameLength(trigger.card)
			const lastCardnum = get.cardNameLength(evt.card)
			if (evenCardnum === lastCardnum) {
				await player.draw()
			}
			else if (Math.abs(evenCardnum - lastCardnum) === 1 && !player.hasSkill("swyg_jianying_effect")) {
				player.addTempSkill("swyg_jianying_effect", { player: "useCard1", global: ["phaseAfter", "phaseBeforeStart"] })
			}
			else if (Math.abs(evenCardnum - lastCardnum) > 1) {
				delete player.getStat("skill")['swyg_quanlue']
			}
		},
		group: ["swyg_jianying_buff", "swyg_jianying_mark", "swyg_jianying_clear"],
		subSkill: {
			buff: {
				ai: {
					aiOrder(player, card, num) {
						if (typeof card == "object" && player.isPhaseUsing()) {
							const evt = player.getLastUsed();
							if (!evt || !evt.card || evt.getParent("phaseUse") !== _status.event.getParent("phaseUse")) return num;
							if ((get.cardNameLength(evt.card) && get.cardNameLength(evt.card) == get.cardNameLength(card))) {
								return num + 10;
							}
						}
					},
					cardUsable(card, player) {
						if (player.isPhaseUsing() && typeof card == "object") {
							const evt = player.getLastUsed();
							if (evt && evt.card && evt.getParent("phaseUse") === _status.event.getParent("phaseUse")) {
								const cardLength = get.cardNameLength(card)
								const evtCardLength = get.cardNameLength(evt.card)
								const abs = Math.abs(evtCardLength - cardLength)
								if (abs === 1) return Infinity
							}
						}
					},
					targetInRange(card, player) {
						if (player.isPhaseUsing() && typeof card == "object") {
							const evt = player.getLastUsed();
							if (evt && evt.card && evt.getParent("phaseUse") === _status.event.getParent("phaseUse")) {
								const cardLength = get.cardNameLength(card)
								const evtCardLength = get.cardNameLength(evt.card)
								const abs = Math.abs(evtCardLength - cardLength)
								if (abs === 1) return true
							}
						}
					},
				},
			},
			mark: {
				charlotte: true,
				trigger: { player: "useCard1" },
				filter(event, player) {
					return player.isPhaseUsing();
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (!get.cardNameLength(trigger.card)) player.unmarkSkill("swyg_jianying_mark");
					else {
						player.storage.swyg_jianying_mark = trigger.card;
						player.addTip("swyg_jianying", "渐营 " + get.translation(get.name(trigger.card, player)) + get.cardNameLength(trigger.card, player), true);
						player.markSkill("swyg_jianying_mark");
						game.broadcastAll(
							(player, cardNameLength) => {
								if (player.marks.swyg_jianying_mark) player.marks.swyg_jianying_mark.firstChild.innerHTML = get.translation(cardNameLength);
							},
							player,
							get.cardNameLength(trigger.card, player)
						);
					}
				},
				intro: {
					markcount(card, player) {
						return parseFloat(get.cardNameLength(card));
					},
					content(card, player) {
						return `<li>上一张使用的牌名字<br>${get.translation(get.name(card, player))}</li>`;
					},
				},
			},
			clear: {
				charlotte: true,
				trigger: { player: "phaseUseAfter" },
				filter(event, player) {
					return player.storage.swyg_jianying_mark;
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					player.unmarkSkill("swyg_jianying_mark");
					delete player.storage.swyg_jianying_mark;
				},
			},
			effect: {
				mod: {
					cardUsable: () => Infinity,
					targetInRange: () => true,
				},
				mark: true,
				marktext: "渐营",
				intro: {
					content: "使用下一张牌无距离和次数限制",
				},
			},
		},
	},
	swyg_quanlue: {
		audio: 'dcjianying',
		enable: "phaseUse",
		usable: 1,
		selectCard: 1,
		position: 'he',
		filterCard: () => true,
		filter: (event, player) => player.hasCard(true, "he"),
		// prompt:'弃置一张牌然后从牌堆中获得一张任意点数的牌',
		async content(event, trigger, player) {
			let numbers = []
			ui.cardPile.childNodes.forEach(name => numbers.add(String(get.cardNameLength(name))))
			numbers = numbers.sort((a, b) => a - b)
			const { result } = await player.chooseControl(...numbers).set('prompt', '从牌堆中获得一张任意点数的牌')
			if (result.control) {
				const card = get.cardPile2(card => get.cardNameLength(card) == result.control);
				if (card) {
					await player.gain(card, 'gain2')
				} else {
					game.log(`牌堆没有${result.control}个字的牌`)
				}
			}
		},
		ai: {
			order: 2,
		},
	},
	swyg_shibei: {
		audio: "dcshibei",
		inherit: 'shibei',
		filter(trigger, player) {
			const damage = player.getHistory("damage")
			const index = damage.indexOf(trigger)
			return index === 1 || index === 0
		},
		async content(event, trigger, player) {
			const damage = player.getHistory("damage")
			if (damage.indexOf(trigger) === 0) {
				await player.recover();
			} else if (damage.indexOf(trigger) === 1) {
				await player.loseHp();
				await player.draw()
			}
		}
	},
	// 异构郭嘉
	swyg_shisheng: {
		audio: "xianmou",
		enable: "phaseUse",
		usable: 1,
		selectTarget: 1,
		filterTarget: lib.filter.notMe,
		selectCard: -1,
		ai2(target) {
			const player = get.player();
			const [cards1, cards2, hp1, hp2, eq1, eq2] = [
				player.countCards('h'), target.countCards('h'),
				player.hp, target.hp,
				player.countCards('e'), target.countCards('e')
			]
			return (cards1 > cards2) + (hp1 > hp2) + (eq1 > eq2);
		},
		async content(event, trigger, player) {
			const { target } = event
			const [cards1, cards2, hp1, hp2, eq1, eq2] = [
				player.countCards('h'), target.countCards('h'),
				player.hp, target.hp,
				player.countCards('e'), target.countCards('e')
			]
			let num = (cards1 > cards2) + (hp1 > hp2) + (eq1 > eq2)
			player.popup(`${num}项`, "wood")
			game.log(`#b${get.translation(player)}`, '与', `#b${get.translation(target)}`, '比较', `#y胜${num}项`);
			await game.delayx()
			await player.addAdditionalSkills("swyg_shisheng", []);
			if (num >= 1) {
				await player.addAdditionalSkills("swyg_shisheng", "tiandu");
			}
			if (num >= 2) {
				await player.draw(2)
			}
			if (num >= 3) {
				await player.recover()
			}
		},
		ai: {
			order: 7,
			threaten: 1.2,
			result: {
				player: function (player, target) { // TODO：好像没用？
					return get.max(game.filterPlayer(), tar => {
						const [cards1, cards2, hp1, hp2, eq1, eq2] = [
							player.countCards('h'), tar.countCards('h'),
							player.hp, tar.hp,
							player.countCards('e'), tar.countCards('e')
						]
						return (cards1 > cards2) + (hp1 > hp2) + (eq1 > eq2);
					}) * 1.5
				},
			},
		},
	},
	swyg_shibai: {
		audio: "lunshi",
		trigger: { player: 'damageEnd' },
		async cost(event, trigger, player) {
			const list = ['re_guojia', 'ol_xunyu', 're_simayi', 're_caocao', 'xizhicai']
			const skills = ['new_reyiji', 'oljieming', 'refankui', 'new_rejianxiong', 'chouce', 'cancel']
			if (!trigger.source) {
				skills.remove('refankui')
				list.remove('re_simayi')
			}
			const { result } = await player
				.chooseControl(skills)
				.set("ai", (event) => {
					const player = get.player();
					const priority = {
						//一张牌按6价值算。TODO：应该可以计算当前event下技能的使用价值
						new_reyiji: () => {
							return 6 * 2;
						},
						oljieming: () => {
							return get.max(game.filterPlayer(), (p) => {
								//let att = get.attitude(player, target);
								let draw = Math.min(5, p.maxHp) - p.countCards("h");
								return Math.abs(draw) * 3.8
							})
						},
						refankui: () => {
							return (Math.random() + 1.1) * 6
						},
						new_rejianxiong: () => {
							return (event?.getTrigger()?.cards?.reduce((acc, card) => acc + get.value(card, player), 0) || 0) + 6 * 1
						},
						chouce: () => {
							return (Math.random() + 1.1) * 6;
						},
					};
					const entries = Object.entries(priority).map(([key, fn]) => [key, fn()]);
					entries.sort((a, b) => b[1] - a[1]);
					return entries[0][0] || 0;
				})
				.set("dialog", [`十败：` + "请选择尝试发动的技能", [list, "character"]])
			event.result = {
				bool: result.control !== 'cancel',
				cost_data: result.control
			}
		},
		async content(event, trigger, player) {
			const skill = event.cost_data
			player.addTempSkill(skill)
			player.markAuto("swyg_shibai", skill)
		},
		group: ["swyg_shibai_check", "swyg_shibai_check2"],
		subSkill: {
			check: {
				charlotte: true,
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return player.getStorage("swyg_shibai").length
				},
				direct: true,
				lastDo: true,
				priority: -Infinity,
				async content(event, trigger, player) {
					player.getStorage("swyg_shibai").forEach((sk) => player.removeSkill(sk))
					player.setStorage("swyg_shibai", [])
				},
			},
			check2: {
				charlotte: true,
				trigger: { player: ["useSkill", "logSkillBegin"] },
				filter(event, player) {
					var info = get.info(event.skill);
					if (info && info.charlotte) return false;
					var skill = get.sourceSkillFor(event);
					return player.getStorage("swyg_shibai").includes(skill);
				},
				direct: true,
				firstDo: true,
				priority: Infinity,
				async content(event, trigger, player) {
					const skill = get.sourceSkillFor(trigger);
					player.removeSkill(skill);
					player.unmarkAuto("swyg_shibai", [skill])
				},
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (!target.hasFriend()) return;
						let num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) num = 0.7;
							else num = 0.5;
						}
						if (!target.isDamaged()) num = num * 2;
						if (target.hp >= 4) return [1, num * 2];
						if (target.hp == 3) return [1, num * 1.5];
						if (target.hp == 2) return [1, num * 0.5];
					}
				},
			},
			threaten: 0.6,
		},
	},
	// 异构荀彧
	swyg_zaifu: {
		audio: "sbjieming",
		trigger: {
			player: "damageEnd",
		},
		logTarget: "targets",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("swyg_zaifu"), `令一名角色将手牌调整至体力上限（至多摸五张）`)
				.set("ai", target => {
					const player = get.player();
					let att = get.attitude(player, target);
					let draw = Math.min(5, target.maxHp) - target.countCards("h");
					if (draw >= 0) {
						if (target.hasSkillTag("nogain")) att /= 6;
						if (att > 2) {
							return Math.sqrt(draw + 1) * att;
						}
						return att / 3;
					}
					if (draw < -1) {
						if (target.hasSkillTag("nogain")) att *= 6;
						if (att < -2) {
							return -Math.sqrt(1 - draw) * att;
						}
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = target.maxHp - target.countCards("h");
			if (num > 0) {
				await target.draw(Math.min(5, num)).gaintag.add("swyg_zaifu");
			}
			else if (num < 0 && target.countDiscardableCards(target, "h") > 0) {
				const result = await target.chooseToDiscard(-num, "h", true).forResult();
				if (result?.cards && result?.cards.length && target.isIn() && target.getHp() > 0) {
					//await player.directgains(result?.cards, null, 'swyg_zaifu2');
					if (_status.connectMode) game.broadcastAll(() => (_status.noclearcountdown = true));
					let cards = game.cardsGotoOrdering(result.cards).cards;
					let given_map = {};
					let giveNum = target.getHp();
					while (cards.length && giveNum > 0) {
						let result;
						if (cards.length == 1) result = { bool: true, links: cards.slice() };
						else {
							result = await player.chooseCardButton("宰辅：请选择要分配的牌", false, cards, [1, Math.min(cards.length, giveNum)]).set("ai", function (button) {
								if (!ui.selected.buttons.length) return get.buttonValue(button);
								return 0;
							}).forResult();
						}
						if (!result?.bool || !result?.links) break;
						const gives = result.links;
						const result2 = await player
							.chooseTarget("宰辅：选择获得" + get.translation(gives) + "的角色", false)
							.set("ai", target => {
								return get.attitude(get.event("player"), target) * get.sgn(get.sgn(get.event("goon")) + 0.5);
							})
							.set(
								"goon",
								gives.reduce((sum, card) => sum + get.value(card), 0)
							).forResult();
						if (result2?.bool) {
							giveNum -= gives.length
							cards.removeArray(gives);
							const id = result2.targets[0].playerid;
							if (!given_map[id]) given_map[id] = [];
							given_map[id].addArray(gives);
						}
					}
					if (_status.connectMode) game.broadcastAll(() => delete _status.noclearcountdown);
					let list = [];
					for (const i in given_map) {
						const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						player.line(source, "green");
						game.log(source, "获得了", given_map[i]);
						list.push([source, given_map[i]]);
					}
					await game
						.loseAsync({
							gain_list: list,
							giver: player,
							animate: "gain2",
						})
						.setContent("gaincardMultiple");
					await game.delayx();
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && target.hp > 1) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						var max = 0;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) > 0) {
								max = Math.max(Math.min(5, players[i].hp) - players[i].countCards("h"), max);
							}
						}
						switch (max) {
							case 0:
								return 2;
							case 1:
								return 1.5;
							case 2:
								return [1, 2];
							default:
								return [0, max];
						}
					}
					if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) return [0, 0];
				},
			},
			threaten: 0.7,
		},
		group: "swyg_zaifu_tag",
		subSkill: {
			tag: {
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return game.filterPlayer().some(target => {
						return target.hasHistory("lose", function (evt) {
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("swyg_zaifu")) return true;
							}
						})
					})
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(
							`宰辅：选择角色A和B，视为A对B使用一张随机的伤害类锦囊牌`,
							false,
							2
						)
						.set("ai", target => {
							const player = get.player();
							if (ui?.selected?.targets?.length == 1) {
								return -get.attitude(player, target);
							}
							return Math.random() + get.attitude(player, target) > 0 ? 0 : 0.3;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const targets = event.targets;
					const list = get.inpileVCardList(info => {
						return info[0] == "trick" && get.tag({ name: info[2] }, "damage");
					});
					await targets[0].useCard(get.autoViewAs({ name: list.randomGet()[2], isCard: true }), targets[1], false);
				}
			},
		},
	},
	swyg_dingce: {
		audio: "dinghan",
		onremove: true,
		intro: { content: "已记录牌名：$" },
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			for (let i = 0; i < lib.inpile.length; i++) {
				const name = lib.inpile[i];
				if (player.getStorage("swyg_dingce").includes(name)) continue
				if (name == "sha") {
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
					for (var nature of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) return true;
					}
				}
				else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
				else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (let i = 0; i < lib.inpile.length; i++) {
					const name = lib.inpile[i];
					if (player.getStorage("swyg_dingce").includes(name)) continue
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
						}
					}
					else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
				}
				return ui.create.dialog("定策", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "dinghan",
					filterCard(card) {
						return get.cardNameLength(card) === get.cardNameLength(links[0][2])
					},
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					onuse(result, player) {
						player.markAuto("swyg_dingce", [result.card.name]);
					},
					onrespond(result, player) {
						player.markAuto("swyg_dingce", [result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return `将一张牌名字数为${get.cardNameLength(links[0][2])}的牌当做` + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) return false;
			return !player.getStorage("swyg_dingce").includes(name)
		},
		group: "swyg_dingce_remove",
		subSkill: {
			remove: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter(event, player) {
					return player.getStorage("swyg_dingce").filter(name => get.type2(name) == "trick").length
				},
				async content(event, trigger, player) {
					let dialog = [get.prompt("swyg_dingce")]
					let list = player.getStorage("swyg_dingce").filter(name => get.type2(name) == "trick");
					if (list.length) {
						dialog.push('<div class="text center">已记录</div>');
						dialog.push([list, "vcard"]);
					}
					const { result } = await player.chooseButton(dialog).set("ai", function (button) {
						var player = get.player()
						return player.getUseValue({
							name: button.link[2],
						})
					});
					if (result.bool) {
						player.logSkill("swyg_dingce");
						var name = result.links[0][2];
						if (player.getStorage("swyg_dingce").includes(name)) {
							player.unmarkAuto("swyg_dingce", [name]);
							game.log(player, "从定策记录中移除了", "#y" + get.translation(name));
						}
						game.delayx();
					}
				},
			},
			backup: {},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			respondTao: true,
			save: true,
			skillTagFilter(player, tag, arg) {
				switch (tag) {
					case "save":
						return !player.getStorage("swyg_dingce").includes("tao") || !player.getStorage("swyg_dingce").includes("jiu")
					case "respondTao":
						return !player.getStorage("swyg_dingce").includes("tao")
					case "respondShan":
						return !player.getStorage("swyg_dingce").includes("shan")
					case "respondSha":
						return !player.getStorage("swyg_dingce").includes("sha")
				}
			},
			order: 5,
			result: {
				player: 1
			},
		}
	},
	// 异构曹金玉
	swyg_yuqi: {
		audio: 'yuqi',
		trigger: { player: 'damageEnd' },
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget('选择要弃置的角色', [1, player.maxHp], (card, player, target) => {
				return target.countCards('h') > 0
			}).set('ai', target => {
				const att = get.attitude(player, target)
				if (att < 0) return 1000 - target.countCards('h')
				return target.countCards('h') - 8
			}).forResult()
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat()
			const yu = []
			const shatao = []
			for (const target of targets) {
				if (target.countCards('h') > 0) {
					const { result } = await player.discardPlayerCard(target, "h", true)
					result.cards.forEach(card => {
						const name = get.name(card)
						if (name === 'tao' || name === 'sha') {
							shatao.push(card)
						} else {
							yu.push(card)
						}
					})
				}
			}
			while (shatao.length > 0 && player.getStorage("swyg_yuqi").length < 2) {
				const { result } = await player.chooseButton(["隅泣：是否使用其中的一张牌？", shatao])
					.set("filterButton", button => {
						const player = _status.event.player
						return !player.getStorage("swyg_yuqi").includes(get.name(button.link)) && player.hasUseTarget(button.link);
					})
					.set("ai", button => {
						const player = _status.event.player,
							card = button.link,
							cards = _status.event.getParent().cards;
						const val = player.getUseValue(card) + 0.01;
						if ((val > 0 && cards.length > 1) || (val > 4 && cards.length == 1 && (player.maxHp > 3 || player.isDamaged()))) return get.order(card) + val / 5;
						return 0;
					});
				if (result?.bool) {
					const card = result.links[0];
					player.$gain2(card, false);
					game.delayx();
					await player.chooseUseTarget(true, card, false);
					shatao.remove(card)
					player.markAuto("swyg_yuqi", [get.name(card)])
				}
				else {
					break
				}
			}
			yu.addArray(shatao)
			player.addToExpansion(yu, player, "give").gaintag.add("swyg_yuqi");
		},
		marktext: "隅",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove: true,
		group: ["swyg_yuqi_clear"],
		subSkill: {
			clear: {
				trigger: { global: 'phaseEnd' },
				charlotte: true,
				direct: true,
				filter(event, player) {
					return player.hasHistory("useSkill", evt => evt.skill == "swyg_yuqi");
				},
				async content(event, trigger, player) {
					player.setStorage("swyg_yuqi", [])
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten: 0.8,
			expose: 0.3,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (!target.hasFriend()) return;
						let num = 1;
						if (target.hp >= 4) return [1, num * 2];
						if (target.hp == 3) return [1, num * 1.2];
						if (target.hp == 2) return [1, num * 0.5];
					}
				},
			},
		},
	},
	swyg_shanshen: {
		audio: 'shanshen',
		trigger: { player: 'phaseZhunbeiBegin' },
		filter(event, player) {
			return player.getExpansions("swyg_yuqi").length > 0 && player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			const expansions = player.getExpansions("swyg_yuqi");
			const cards = player.getCards('he')
			const num = Math.max(1, player.getDamagedHp())
			const max = Math.min(expansions.length, cards.length, num)
			const result = await player.chooseToMove("善身：交换任意牌")
				.set("list", [
					["你的「隅泣」", expansions, "swyg_shanshen_tag"],
					["你的牌", cards],
				])
				.set("filterMove", (from, to, moved) => {
					// if (moved[0].includes(from.link)) {
					// 	if (typeof to == "number") {
					// 		if (to == 1) {
					// 			if (moved[1].length >= _status.event.max) return false;
					// 		}
					// 		return true;
					// 	}
					// }
					return true;
				})
				//.set("max", max)
				.set("processAI", function (list) {
					// if (_status.event.max) {
					// 	let gain = list[0][1]
					// 		.sort((a, b) => {
					// 			return player.getUseValue(b, null, true) - player.getUseValue(a, null, true);
					// 		})
					// 		.slice(0, _status.event.max),
					// 		give = list[1][1]
					// 			.sort((a, b) => {
					// 				return get.value(a, player) - get.value(b, player);
					// 			})
					// 			.slice(0, _status.event.max);
					// 	for (let i of gain) {
					// 		if (get.value(i, player) < get.value(give[0], player)) continue;
					// 		let j = give.shift();
					// 		list[0][1].remove(i);
					// 		list[0][1].push(j);
					// 		list[1][1].remove(j);
					// 		list[1][1].push(i);
					// 		if (!give.length) break;
					// 	}
					// }
					return [list[0][1], list[1][1]];
				})
				.forResult();
			let top, bottom;
			if (result?.bool) {
				top = expansions.filter(card => !result.moved[0].includes(card));
				bottom = cards.filter(card => !result.moved[1].includes(card));
			}
			event.result = {
				cost_data: { top, bottom },
				bool: result?.bool
			}
		},
		async content(event, trigger, player) {
			const { top, bottom } = event.cost_data
			player.addToExpansion(bottom, "give", player).gaintag.add("swyg_yuqi");
			await player.gain(top, "gain2")
			const { damage, another } = player.getExpansions("swyg_yuqi").reduce((now, card) => {
				const add = get.tag(card, "damage") ? 'damage' : 'another'
				now[add]++
				return now
			}, { damage: 0, another: 0 })
			if (damage > another) {
				player.popup("大于", "wood")
				player.addTempSkill('swyg_shanshen_gt')
			}
			else if (damage === another) {
				player.popup("等于")
				await player.draw(2)
				player.addTempSkill('swyg_shanshen_eq')
			}
			else if (damage < another) {
				player.popup("小于", "fire")
				await player.recover()
				player.addTempSkill('swyg_shanshen_lt')
			}
			await game.delayx()
		},
		subSkill: {
			gt: {
				forced: true,
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (get.name(card, player) === 'sha') return num + 1
					}
				},
				trigger: { player: 'useCard' },
				filter(trigger, player) {
					return get.name(trigger.card, player) === 'sha'
				},
				async content(event, trigger, player) {
					if (player.getHistory('useCard', evt => get.name(evt.card) === 'sha').length === 1) {
						trigger.directHit.addArray(game.players)
					}
				}
			},
			eq: {
				trigger: { player: 'phaseDiscardBefore' },
				charlotte: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.cancel()
				}
			},
			lt: {
				mod: {
					playerEnabled(card, player, target) {
						if (target !== player) return false;
					},
				}
			}
		},
		ai: {
			combo: "swyg_yuqi",
		},
	},
	swyg_xianjing: {
		trigger: { player: 'swyg_yuqiAfter' },
		audio: 'xianjing',
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(trigger, player) {
			return !player.storage.swyg_xianjingAwake && player.getExpansions("swyg_yuqi").length >= 7
		},
		async content(event, trigger, player) {
			player.awakenSkill('swyg_xianjing')
			player.storage.swyg_xianjingAwake = true
			await player.gainMaxHp()
			await player.recover()

			const result = await player.chooseCardButton("你可以弃置任意张「隅泣」并摸两倍数量的牌", [1, Infinity], player.getExpansions("swyg_yuqi"))
				.set('ai', (button) => {
					return true;
				})
				.forResult();
			if (result.bool) {
				await player.loseToDiscardpile(result?.links);
				await player.draw(result?.links?.length * 2)
			}
		},
		ai: {
			combo: "swyg_yuqi",
		},
	},
	// 异构汉末献帝
	swyg_modi: {
		audio: "tianming",
		trigger: { global: 'phaseBeginStart' },
		forced: true,
		locked: true,
		filter(trigger, player) {
			return trigger.player !== player
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player
			const { result } = await target.chooseCard(`将一张牌交给${get.translation(player)}，否则你须选择对其他角色出【杀】或失去1点体力`, 1, 'he')
				.set("sourcex", player)
				.set("ai", card => {
					const player = get.player()
					const target = _status.event.sourcex
					if (get.attitude(player, target) < 0) {
						if (player.hasCard("sha", "h")) return false;
						return player.getHp() <= 1;
					}
					return true;
				})
			if (result.bool || (result.cards && result.cards.length > 0)) {
				await target.give(result.cards, player, 'giveAuto', 'bySelf')
				await player.draw()
				const { result: huan } = await player.chooseCard(`将一张牌交给${get.translation(target)}`, 1, true, 'he')
				await player.give(huan.cards, target, 'giveAuto', 'bySelf')
			}
			else {
				const { result } = await target.chooseToUse(function (card) {
					if (get.name(card) !== "sha") return false;
					return lib.filter.filterCard.apply(this, arguments);
				}, `对除${get.translation(player)}外的其他角色使用一张【杀】或失去1点体力`)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target === _status.event.sourcex) return false;
						return lib.filter.filterTarget.apply(this, arguments);
					})
					.set("sourcex", player);
				if (!result?.bool) {
					await target.loseHp()
				}
			}
		},
	},
	swyg_zhaoling: {
		audio: "mizhao",
		marktext: '汉',
		intro: {
			name: "汉业",
			content: "mark",
		},
		enable: "phaseUse",
		usable: 3,
		selectCard: [1, Infinity],
		selectTarget: 1,
		position: 'he',
		discard: false,
		lose: false,
		delay: false,
		filterTarget: lib.filter.notMe,
		filterCard: () => true,
		ai1(card) {
			return 7 - get.value(card);
		},
		ai2(target) {
			const player = get.player();
			return get.attitude(player, target) >= 0
		},
		async content(event, trigger, player) {
			const { target, cards } = event
			await player.give(cards, target).gaintag.add("swyg_zhaoling_tag");
		},
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
			if (!ui.selected.cards.length && card.name == "du") return 20;
			const player = get.owner(card);
			if (ui.selected.cards.length >= Math.max(1, player.countCards("h") - player.hp)) return 0;
			return 10 - get.value(card);
		},
		group: 'swyg_zhaoling_use',
		subSkill: {
			use: {
				forced: true,
				trigger: { global: ["useCardAfter", "respondAfter"] },
				filter(event, player) {
					return event.player.hasHistory("lose", evt => {
						if (event !== evt.getParent()) return false;
						for (const i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("swyg_zhaoling_tag")) return true;
						}
					});
				},
				async content(event, trigger, player) {
					await player.draw()
					player.addMark('swyg_zhaoling', 1)
				}
			}
		},
		ai: {
			order: 7,
			expose: 0.3,
			result: {
				player: 1,
			},
		}
	},
	swyg_fuhan: {
		audio: "dcsbtiancheng",
		trigger: { player: 'phaseZhunbeiBegin' },
		forced: true,
		locked: false,
		juexingji: true,
		skillAnimation: true,
		animationColor: "metal",
		derivation: "swyg_tianzi",
		filter(event, player) {
			if (player.storage.swyg_fuhanAwake) return false
			return player.countMark("swyg_zhaoling") >= game.countGroup();
		},
		async content(event, trigger, player) {
			player.awakenSkill("swyg_fuhan");
			player.storage.swyg_fuhanAwake = true
			await player.gainMaxHp(3)
			await player.recover()
			await player.removeSkills('swyg_modi')
			await player.addSkills('swyg_tianzi')
		},
		ai: {
			combo: "swyg_zhaoling",
		}
	},
	swyg_tianzi: {
		audio: "dcsbchensheng",
		mod: {
			targetInRange(card, player, target, now) {
				return true;
			},
		},
		direct: true,
		trigger: { player: ['phaseDrawBegin2', 'phaseDiscardBegin'] },
		filter: function (event, player) {
			if (event.name == "phaseDraw") return !event.numFixed;
			return true
		},
		async content(event, trigger, player) {
			const name = event.triggername
			if (name === 'phaseDrawBegin2') {
				trigger.num += Math.min(3, player.getHp())
				player.logSkill("swyg_tianzi")
			}
			else if (name === 'phaseDiscardBegin') {
				trigger.cancel()
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	swyg_handi: {
		unique: true,
		zhuSkill: true,
		firstDo: true,
		trigger: { global: ["useCardAfter", "respondAfter"] },
		usable: 1,
		audio: "dcsbzhanban",
		filter(event, player) {
			return event.player.hasHistory("lose", evt => {
				if (event !== evt.getParent()) return false;
				for (const i in evt.gaintag_map) {
					if (evt.gaintag_map[i].includes("swyg_zhaoling_tag")) return true;
				}
			});
		},
		async content(event, trigger, player) {
			trigger.player.addSkill('swyg_handi_buff')
			trigger.player.when("useCardAfter").then(() => {
				player.removeSkill('swyg_handi_buff')
			})
		},
		forced: true,
		subSkill: {
			buff: {
				mod: {
					targetInRange: () => true,
					cardUsable: () => Infinity,
				},
				charlotte: true,
				mark: true,
				marktext: '诏',
				intro: {
					name: '诏书',
					content: '使用的下一张牌无距离和次数限制'
				}
			}
		}
	},
	// 异构孙鲁育
	swyg_meibu: {
		audio: "meibu",
		trigger: {
			global: "phaseUseBegin",
		},
		filter(event, player) {
			return event.player != player && event.player.isIn() && player.countCards("he") > 0;// && event.player.inRange(player);
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseToDiscard("he", 1, false, get.prompt("swyg_meibu", trigger.player), "he")
				.set(
					"prompt2",
					"弃置一张牌，令该角色弃置所有伤害牌；若其未因此弃牌，你摸一张牌。"
				)
				.set("logSkill", ["swyg_meibu", trigger.player])
				.set("targetx", trigger.player)
				.set("ai", card => {
					const { player: pl, targetx: tar } = get.event();
					if (get.attitude(pl, tar) >= 0) return 0;
					return 6 - get.value(card);
				})
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.cards,
			};
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			const damageCards = target.getCards("he").filter(c => get.is.damageCard(c));
			if (!damageCards.length) {
				await player.draw();
				return;
			}
			await target.discard(damageCards);
		},
		ai: {
			expose: 0.2,
		},
	},
	swyg_mumu: {
		// audio: "mumu",
		group: ["swyg_mumu_equip", "swyg_mumu_redirect"],
		subSkill: {
			equip: {
				audio: "mumu",
				usable: 1,
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return get.type(event.card) == "equip";
				},
				logTarget: "targets",
				async cost(event, trigger, player) {
					const card = trigger.card;
					const result2 = await player
						.chooseTarget("穆穆：是否将此装备置入一名其他角色的装备区并摸两张牌？", false)
						.set("card", card)
						.set("filterTarget", (_card, pl, target) => {
							if (target == pl) return false;
							return target.canEquip(get.event().card);
						})
						.set("ai", target => get.attitude(get.player(), target))
						.forResult();
					event.result = {
						bool: result2.bool,
						targets: result2.targets,
						cost_data: result2.targets?.[0],
					};
				},
				async content(event, trigger, player) {
					const target = event.cost_data ?? event.targets?.[0];
					if (!target?.isIn()) return;
					trigger.targets = [target];
					trigger.target = target;
					//await player.logSkill("swyg_mumu", target);
					await player.draw(2);
				},
			},
			redirect: {
				audio: "mumu",
				usable: 1,
				trigger: {
					global: "useCard",
				},
				filter(event, player) {
					if (event.player == player || get.type(event.card) != "equip") return false;
					if (!player.canEquip(event.card)) return false;
					if (event.targets?.length == 1 && event.targets[0] == player) return false;
					return true;
				},
				logTarget: "player",
				async cost(event, trigger, player) {
					const source = trigger.player;
					const result = await player
						.chooseBool()
						.set("prompt", get.prompt("swyg_mumu"))
						.set("prompt2", "是否将目标改为你？（若如此，直到其回合结束，你无法响应" + get.translation(source) + "对你使用的牌。）")
						.set("source", source)
						.set("ai", () => {
							const { player: pl, source: src } = get.event();
							return get.attitude(pl, src) < 0 ? 1 : 0;
						})
						.forResult();
					event.result = { bool: result.bool };
				},
				async content(event, trigger, player) {
					const source = trigger.player;
					trigger.targets = [player];
					trigger.target = player;
					//await player.logSkill("swyg_mumu", source);
					player.addTempSkill("swyg_mumu_debuff");
					player.markAuto("swyg_mumu_debuff", source);
				},
			},
			debuff: {
				charlotte: true,
				onremove: true,
				trigger: { target: "useCardToPlayer" },
				silent: true,
				filter(event, player) {
					return player.getStorage("swyg_mumu_debuff").includes(event.player);
				},
				async content(event, trigger, player) {
					trigger.getParent().directHit.add(player);
				},
			},
		}
	},
	// 异构小乔
	swyg_tianxiang: {
		forced: false,
		locked: true,
		audio: "tianxiang_re_xiaoqiao",
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return event.num > 0 && player.countCards("h") > 0;
		},
		change(player, num) {
			if (typeof player.storage.swyg_tianxiang !== "number") player.storage.swyg_tianxiang = 0;
			if (!num) return;
			player.storage.swyg_tianxiang += num;
			player.markSkill("swyg_tianxiang");
			if (player.storage.swyg_tianxiang == 0) {
				player.unmarkSkill("swyg_tianxiang");
			}
			game.log(player, "的手牌上限", "#g" + (num > 0 ? "+" : "") + num);
		},
		async content(event, trigger, player) {
			if (player.countCards('h') > 0) await player.showHandcards();
			if (player.getCards('h').every(card => get.suit(card) == "heart") || player.countCards('h') == 0) {
				const result = await player
					.chooseTarget(get.prompt2("swyg_tianxiang"), "将此伤害转移给其他角色，摸两张牌并使手牌上限-1", function (card, player, target) {
						return target != player;
					})
					.set("forced", true)
					.set("ai", function (target) {
						const player = get.player();
						return get.damageEffect(target, player, player) - get.attitude(player, target);
					})
					.forResult();
				if (result?.bool && result?.targets[0]) {
					const target = result.targets[0];
					trigger.cancel();
					await player.line(target);
					await target.damage(trigger.source || "nosource", trigger.num || 0, "nocard");
					await player.draw(2);
					await lib.skill.swyg_tianxiang.change(player, -1);
				}
			}
			else if (player.countCards('h') > 0) {
				const num = Math.abs(player.getHandcardLimit() - player.getHp()) + 1 || 1;
				const result = await player.chooseCard('h', '是否重铸至多' + num + '张手牌？', [1, num]).set('ai', function (card) {
					return 10 - get.value(card) - (get.suit(card) == "heart") * 8;
				})
					.forResult();
				if (result?.bool) {
					player.recast(result?.cards);
				};
			}
		},
		markimage: "image/card/handcard.png",
		intro: {
			content(storage, player) {
				var num = player.storage.swyg_tianxiang;
				return "手牌上限" + (num >= 0 ? "+" : "") + num;
			},
		},
		group: "swyg_tianxiang_add",
		subSkill: {
			add: {
				forced: true,
				audio: "sbtianxiang",
				trigger: {
					player: "damageEnd",
				},
				async content(event, trigger, player) {
					lib.skill.swyg_tianxiang.change(player, trigger.num || 0);
				},
			}
		},
		ai: {
			maixie: true,
			maixie_defend: true,
			threaten: function (player, target) {
				return player.countCards('h') > 0 ? 1.4 : 0.7;
			},
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) return;
					if (get.tag(card, "damage") && target.countCards("h") >= 4) return 0.9;
					if (get.tag(card, "damage") && target.countCards("h") >= 1) return 0.7;
				},
			},
		},
		mod: {
			aiValue(player, card, num) {
				if (num <= 0) return num;
				let suit = get.suit(card, player);
				if (suit === "heart") return num + 1.6;
			},
			aiUseful(player, card, num) {
				if (num <= 0) return num;
				let suit = get.suit(card, player);
				if (suit === "heart") return num + 3;
			},
		}
	},
	swyg_hongyan: {
		mod: {
			suit(card, suit) {
				const player = get.owner(card) || _status.event.player;
				const num = Math.abs(player.getHandcardLimit() - player.getHp()) + 1 || 1;
				if (num >= 1 && suit == "spade") return "heart";
				if (num >= 2 && suit == "club") return "heart";
				if (num >= 3 && suit == "diamond") return "heart";
			},
			maxHandcard(player, num) {
				return num + player.countMark("swyg_tianxiang");
			},
		},
	},

	// 异构刘备
	swyg_huairen: {
		audio: "rerende",
		onremove(player) {
			game.filterPlayer(p => {
				if (p.getStorage("swyg_huairen_min") === player) {
					p.removeSkill("swyg_huairen_min");
					delete p.storage.swyg_huairen_min;
					delete p.storage.swyg_huairen_hurt;
					delete p.storage.swyg_huairen_deal;
					p.unmarkSkill("swyg_huairen_min");
				}
			});
		},
		trigger: { global: "roundStart" },
		async cost(event, trigger, player) {
			game.filterPlayer(p => {
				if (p.getStorage("swyg_huairen_min") === player) {
					p.removeSkill("swyg_huairen_min");
					delete p.storage.swyg_huairen_min;
					delete p.storage.swyg_huairen_hurt;
					delete p.storage.swyg_huairen_deal;
					p.unmarkSkill("swyg_huairen_min");
				}
			});
			event.result = await player
				.chooseTarget(
					get.prompt("swyg_huairen"),
					"令至多三名角色获得“民”标记直到本轮结束",
					[1, 3],
					false
				)
				.set("ai", tar => get.attitude(player, tar))
				.forResult();
		},
		async content(event, trigger, player) {
			if (!event.targets?.length) return;
			for (const tar of event.targets) {
				if (!tar?.isIn()) continue;
				tar.addTempSkill("swyg_huairen_min", "roundStart");
				tar.setStorage("swyg_huairen_min", player);
				tar.markSkill("swyg_huairen_min");
				game.log(tar, "获得了", "#y民", "标记");
			}
		},
		group: ["swyg_huairen_guard", "swyg_huairen_gain"],
		subSkill: {
			guard: {
				audio: "rerende",
				trigger: { global: "damageBegin3" },
				filter(event, player) {
					const tar = event.player;
					if (!event.num || !tar?.isIn()) return false;
					if (tar.getStorage("swyg_huairen_min") !== player) return false;
					return !tar.storage.swyg_huairen_hurt;
				},
				logTarget: "player",
				async cost(event, trigger, player) {
					const tar = trigger.player;
					event.result = await player
						.chooseBool(get.prompt("swyg_huairen", tar), "失去1点体力防止此伤害，并摸两张牌？")
						.set("ai", () => get.attitude(get.player(), tar) > 0)
						.forResult();
				},
				async content(event, trigger, player) {
					const tar = event.getTrigger().player;
					event.getTrigger().cancel();
					await player.loseHp(1);
					await player.draw(2);
					tar.storage.swyg_huairen_hurt = true;
					tar.markSkill("swyg_huairen_min");
				},
			},
			gain: {
				audio: "rerende",
				trigger: { global: "damageBegin1" },
				forced: true,
				popup: false,
				filter(event, player) {
					const tar = event.source;
					if (!event.num || !tar?.isIn()) return false;
					if (tar.getStorage("swyg_huairen_min") !== player) return false;
					return !tar.storage.swyg_huairen_deal;
				},
				async content(event, trigger, player) {
					const tar = trigger.source;
					if (!player.isDamaged()) await player.draw(2);
					else await player.recover();
					//await player.draw(2);
					tar.storage.swyg_huairen_deal = true;
					tar.markSkill("swyg_huairen_min");
				},
			},
			min: {
				charlotte: true,
				mark: true,
				marktext: "民",
				intro: {
					markcount: () => 0,
					content(storage, player) {
						const from = player.getStorage("swyg_huairen_min");
						let str = from ? "来源：" + get.translation(from) + "<br>" : "";
						str += "本轮结束时移除<br>";
						const done = [];
						if (player.storage.swyg_huairen_hurt) done.push("①防止伤害");
						if (player.storage.swyg_huairen_deal) done.push("②造成伤害");
						str += done.length ? "已触发：" + done.join("、") : "已触发：无";
						return str;
					},
				},
				onremove(player) {
					delete player.storage.swyg_huairen_min;
					delete player.storage.swyg_huairen_hurt;
					delete player.storage.swyg_huairen_deal;
					player.unmarkSkill("swyg_huairen_min");
				},
			},
		},
	},
	swyg_gongji: {
		audio: "rejijiang",
		forced: true,
		usable: 1,
		popup: false,
		trigger: {
			player: ["swyg_huairen_guardAfter", "swyg_huairen_gainAfter"],
		},
		filter(event, player) {
			const sk = event.name;
			if (!["swyg_huairen_guard", "swyg_huairen_gain"].includes(sk)) return false;
			const evt = event.getTrigger();
			const tar = sk === "swyg_huairen_guard" ? evt?.player : evt?.source;
			if (!tar?.isIn() || tar.getStorage("swyg_huairen_min") !== player) return false;
			return tar.storage.swyg_huairen_hurt && tar.storage.swyg_huairen_deal;
		},
		async content(event, trigger, player) {
			const sk = trigger.name;
			const evt = trigger.getTrigger();
			const tar = sk === "swyg_huairen_guard" ? evt?.player : evt?.source;
			delete tar.storage.swyg_huairen_hurt;
			delete tar.storage.swyg_huairen_deal;
			tar.markSkill("swyg_huairen_min");
			player.logSkill("swyg_gongji", tar);
			game.log(tar, "的", "#g【怀仁】", "效果视为未发动过");
		},
	},

	// 异构张温
	swyg_zhaotao: {
		audio: false,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (event.getParent().triggeredTargets3.length > 1) {
				return false;
			}
			return (
				event.player === player &&
				event.targets?.some(target => target !== player && target.isIn())
			);
		},
		async cost(event, trigger, player) {
			const targets = trigger.targets.filter(target => target !== player && target.isIn());
			const num = targets.length;
			const list = [];
			const choiceList = [];
			if (targets.some(target => target.countDiscardableCards(player, "hej") > 0)) {
				list.push("选项一");
				choiceList.push("依次弃置目标区域内一张牌");
			} else {
				choiceList.push('<span style="opacity:0.5">依次弃置目标区域内一张牌</span>');
			}
			if (game.hasPlayer(p => p !== player && p.isIn())) {
				list.push("选项二");
				choiceList.push(`令一名其他角色摸${get.cnNumber(num)}张牌`);
			} else {
				choiceList.push('<span style="opacity:0.5">令一名其他角色摸' + get.cnNumber(num) + "张牌</span>");
			}
			if (!list.length) return;
			list.push("cancel2");
			const result = await player
				.chooseControl(...list)
				.set("prompt", get.prompt("swyg_zhaotao"))
				.set("choiceList", choiceList)
				.set("ai", () => {
					const player = get.player();
					const trigger = get.event().getTrigger();
					const targets = trigger.targets.filter(t => t !== player && t.isIn());
					const num = targets.length;
					if (
						get.event("choiceList2")?.includes("选项一") &&
						targets.some(t => get.attitude(player, t) < 0 && t.countDiscardableCards(player, "hej") > 0)
					) {
						return "选项一";
					}
					if (get.event("choiceList2")?.includes("选项二")) {
						const drawTarget = game.filterPlayer(p => p !== player && p.isIn()).maxBy(p => get.attitude(player, p));
						if (drawTarget && get.attitude(player, drawTarget) > 0 && num > 0) return "选项二";
					}
					return "cancel2";
				})
				.set("choiceList2", list)
				.forResult();
			event.result = {
				bool: result.control && result.control !== "cancel2",
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const audio =
				event.cost_data === "选项一"
					? `${ea}swyg_zhangwen/swyg_zhaotao1.mp3`
					: event.cost_data === "选项二"
						? `${ea}swyg_zhangwen/swyg_zhaotao2.mp3`
						: "";
			if (audio) {
				game.broadcastAll(function (audioPath) {
					if (!lib.config.background_speak) return;
					game.tryAudio({ audioList: [audioPath], random: false });
				}, audio);
			}
			const targets = trigger.targets.filter(target => target !== player && target.isIn());
			const num = targets.length;
			if (event.cost_data === "选项一") {
				//player.logSkill("swyg_zhaotao", targets);
				player.line(targets);
				for (const target of targets) {
					if (!target.isIn() || !target.countDiscardableCards(player, "hej")) continue;
					await player.discardPlayerCard(target, "hej", get.prompt("swyg_zhaotao"), true).forResult();
				}
			} else if (event.cost_data === "选项二") {
				const result = await player
					.chooseTarget(get.prompt("swyg_zhaotao"), `令一名其他角色摸${get.cnNumber(num)}张牌`, (card, pl, target) => {
						return target !== pl && target.isIn();
					})
					.set("ai", target => get.attitude(get.player(), target))
					.forResult();
				if (result?.bool && result.targets?.[0]) {
					const target = result.targets[0];
					//player.logSkill("swyg_zhaotao", target);
					player.line(target);
					if (num > 0) await target.draw(num);
				}
			}
		},
	},
	swyg_lvwang: {
		audio: `${ea}swyg_zhangwen:2`,
		group: ["swyg_lvwang_gain", "swyg_lvwang_discard"],
		subSkill: {
			gain: {
				audio: `${ea}swyg_zhangwen/swyg_lvwang1.mp3`,
				usable: 1,
				trigger: { global: "gainAfter" },
				filter(event, player) {
					const target = event.player;
					if (!target?.isIn()) return false;
					if (!event.getg?.(target)?.length) return false;
					if (event.getParent().name === "draw") {
						const phaseDraw = event.getParent("phaseDraw");
						if (phaseDraw && phaseDraw.player === target) return false;
					}
					return target.countDiscardableCards(player, "hej") > 0;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseBool(get.prompt("swyg_lvwang"), `是否弃置${get.translation(trigger.player)}区域内至多两张牌？`)
						.set("ai", () => {
							const player = get.player();
							const target = get.event().getTrigger().player;
							return get.attitude(player, target) < 0 && target.countDiscardableCards(player, "hej") > 0;
						})
						.forResult();
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = trigger.player;
					if (!target?.isIn() || !target.countDiscardableCards(player, "hej")) return;
					await player.discardPlayerCard(target, "hej", get.translation("swyg_lvwang"), true, [1, 2]).forResult();
				},
			},
			discard: {
				audio: `${ea}swyg_zhangwen/swyg_lvwang2.mp3`,
				usable: 1,
				trigger: { global: ["loseAfter", "loseAsyncAfter"] },
				filter(event, player) {
					if (event.type !== "discard") return false;
					// const phaseDiscard = event.getParent("phaseDiscard");
					// if (!phaseDiscard || phaseDiscard.player !== event.player) return false;
					const target = event.player;
					if (!target?.isIn()) return false;
					return event.getl?.(target)?.cards2?.length > 0 || event.cards?.length > 0;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseBool(get.prompt("swyg_lvwang"), `是否令${get.translation(trigger.player)}摸两张牌？`)
						.set("ai", () => {
							const player = get.player();
							const target = get.event().getTrigger().player;
							return get.attitude(player, target) > 0;
						})
						.forResult();
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = trigger.player;
					if (!target?.isIn()) return;
					await target.draw(2);
				},
			},
		},
	},

	// 二游同人创
	swe_quanbing: {
		audio: `${ea}swe_nanali:2`,
		frequent: true,
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			debugger
			return game.hasGlobalHistory("changeHp", evt => evt.player === player && evt.num !== 0);
		},
		async content(event, trigger, player) {
			const cards = get.cards(5, true);
			await player.viewCards("权柄：观看牌堆顶五张牌", cards);
			const damageCards = cards.filter(card => get.is.damageCard(card));
			if (!damageCards.length) {
				await game.cardsGotoPile(cards.slice().reverse(), ["insert_card", true]);
				return;
			}
			await player.showCards(damageCards, `${get.translation(player)}因“${get.translation(event.name)}”展示`, true).set("clearArena", false);
			const optionButtons = ["依次使用其中的伤害牌（无距离限制），然后失去等同于造成伤害的体力值", "弃置其中的伤害牌，然后回复1点体力"];
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						"权柄：选择一项并令一名角色执行",
						[optionButtons, "textbutton"],
					],
					selectButton: 1,
					selectTarget: 1,
					filterButton: true,
					filterTarget: true,
					ai1: () => Math.random(),
					ai2(target) {
						const button = ui.selected.buttons[0];
						if (!button) return 0;
						const player = get.player();
						const optionIndex = get.event().optionButtons.indexOf(button.link);
						if (optionIndex === 0) return -get.attitude(player, target);
						return get.attitude(player, target);
					},
					optionButtons,
				})
				.forResult();
			if (!result.bool || !result.targets?.length || !result.links?.length) return;
			const target = result.targets[0];
			const optionIndex = optionButtons.indexOf(result.links[0]);
			player.line(target);
			if (optionIndex === 1) {
				target.$throw(damageCards, 1000);
				await game.cardsDiscard(damageCards);
				const remain = cards.filter(card => !damageCards.includes(card));
				if (remain.length) {
					await game.cardsGotoPile(remain.slice().reverse(), ["insert_card", true]);
				}
				if (target.isDamaged()) await target.recover();
			}
			else {
				let totalDamage = 0;
				for (const card of damageCards) {
					const useBefore = target.getHistory("useCard").length;
					const damageBefore = game.getGlobalHistory("everything").length;
					if (target.hasUseTarget(card, null, true)) {
						await target.chooseUseTarget(card, true, false, "nodistance");
					}
					const useHistory = target.getHistory("useCard");
					const relatedUse = useHistory.slice(useBefore).find(evt => evt.card === card || evt.cards?.includes(card));
					const history = game.getGlobalHistory("everything");
					if (relatedUse) {
						for (let i = damageBefore; i < history.length; i++) {
							const evt = history[i];
							if (evt?.name !== "damage" || evt.source !== target) continue;
							if (evt.getParent("useCard") === relatedUse) {
								totalDamage += evt.num || 0;
							}
						}
					}
					else {
						for (let i = damageBefore; i < history.length; i++) {
							const evt = history[i];
							if (evt?.name === "damage" && evt.source === target) {
								totalDamage += evt.num || 0;
							}
						}
					}
				}
				if (totalDamage > 0) await target.loseHp(totalDamage);
			}
		},
	},
	swe_aowu: {
		audio: `${ea}swe_nanali:1`,
	},
	swe_zhongji: {
		audio: `${ea}swe_nanali:2`,
		chargeSkill: Infinity,
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("swe_zhongji_fushou")) return true;
			},
		},
		mark: true,
		marktext: "终",
		intro: {
			name: "终极",
			content(storage, player) {
				const mode = player.getStorage("swe_zhongji_mode", 1);
				const modeText =
					mode == 1 ? "本轮记录：造成伤害的伤害牌" : "本轮记录：未造成伤害的伤害牌";
				return `${modeText}`;
			},
		},
		init(player) {
			player.storage.swe_zhongji_mode = 1;
			player.storage.swe_zhongji_roundRecords = { 1: [], 2: [] };
			player.storage.swe_zhongji_lastRecords = { 1: [], 2: [] };
		},
		addRoundRecord(player, type, card) {
			const records = player.getStorage("swe_zhongji_roundRecords", { 1: [], 2: [] });
			if (!records[type]) records[type] = [];
			const list = records[type];
			if (card.cardid != null) {
				if (list.some(item => item?.cardid === card.cardid)) return;
			} else if (list.includes(card)) {
				return;
			}
			list.push(card);
			player.storage.swe_zhongji_roundRecords = records;
		},
		getLastRoundCards(mode, player) {
			const records = player.getStorage("swe_zhongji_lastRecords", { 1: [], 2: [] });
			const list = records[mode] || [];
			const cards = [];
			const ids = [];
			for (const card of list) {
				if (!card) continue;
				const pos = get.position(card, true);
				if (pos !== "c" && pos !== "d") continue;
				if (card.cardid != null) {
					if (ids.includes(card.cardid)) continue;
					ids.push(card.cardid);
				} else if (cards.includes(card)) {
					continue;
				}
				cards.push(card);
			}
			return cards;
		},
		findUseCardAnchor(triggerEvent, card) {
			if (!card) return null;
			let ev = triggerEvent;
			for (let depth = 0; depth < 55 && ev; depth++) {
				if (ev.name === "useCard") {
					const ucard = ev.card;
					const ucards = ev.cards;
					if (ucard === card || (Array.isArray(ucards) && ucards.includes(card))) return ev;
					if (card.cardid != null) {
						if (ucard?.cardid === card.cardid) return ev;
						if (Array.isArray(ucards) && ucards.some(c => c && c.cardid === card.cardid)) return ev;
					}
				}
				ev = typeof ev.getParent === "function" ? ev.getParent() : null;
			}
			return null;
		},
		isDamagedCard(card, triggerEvent) {
			if (!card || !get.is.damageCard(card) || !triggerEvent) return false;
			const anchor = lib.skill.swe_zhongji.findUseCardAnchor(triggerEvent, card);
			if (!anchor) return false;
			const hist = game.getGlobalHistory("everything");
			for (let i = 0; i < hist.length; i++) {
				const evt = hist[i];
				if (evt.name !== "damage" || (evt.num || 0) <= 0) continue;
				const dc = evt.card;
				if (!dc) continue;
				const match =
					dc === card ||
					(card.cardid != null &&
						dc.cardid != null &&
						String(dc.cardid) === String(card.cardid));
				if (!match) continue;
				const use =
					typeof evt.getParent === "function" ? evt.getParent("useCard") : null;
				if (use === anchor) return true;
			}
			return false;
		},
		group: ["swe_zhongji_choose", "swe_zhongji_record", "swe_zhongji_collect", "swe_zhongji_follow"],
		subSkill: {
			choose: {
				trigger: { global: "roundStart" },
				audio: "swe_zhongji",
				async cost(event, trigger, player) {
					const result = await player
						.chooseControl("造成伤害", "未造成伤害")
						.set("prompt", "终极：选择本轮方式")
						.set("choiceList", [
							"本轮当有造成伤害的非“副手”伤害牌进入弃牌堆后，你获得等量蓄力值",
							"本轮当有未造成伤害的非“副手”伤害牌进入弃牌堆后，你获得等量蓄力值",
						])
						.set("ai", () => {
							return "造成伤害";
						})
						.set("forced", true)
						.forResult();
					event.result = {
						bool: !!result.control,
						cost_data: result.control,
					};
				},
				async content(event, trigger, player) {
					const current = player.getStorage("swe_zhongji_roundRecords", { 1: [], 2: [] });
					player.storage.swe_zhongji_lastRecords = {
						1: (current[1] || []).slice(),
						2: (current[2] || []).slice(),
					};
					player.storage.swe_zhongji_roundRecords = { 1: [], 2: [] };
					const mode = event.cost_data === "未造成伤害" ? 2 : 1;
					player.storage.swe_zhongji_mode = mode;
					if (player.countCharge() < game.countPlayer()) return;
					player.removeCharge(player.countCharge());
					const targetCards = lib.skill.swe_zhongji.getLastRoundCards(mode, player).filter(card => !player.getStorage("swe_zhongji_havegained").includes(card));
					if (!targetCards.length) return;
					if (typeof swTool.playSkillVideo === "function") {
						game.broadcastAll(function () {
							swTool.playSkillVideo("nanali", 3200);
						})
						await game.delay(0, 3200);
					}
					await player.gain(targetCards, "gain2").gaintag.add("swe_zhongji_fushou");
					player.markAuto("swe_zhongji_refushou", targetCards);
					player.markAuto("swe_zhongji_havegained", targetCards);
					game.log(player, "将", targetCards, "置为了“副手”");
				},
			},
			collect: {
				trigger: {
					global: ["cardsDiscardAfter", "loseAfter", "loseAsyncAfter"],
				},
				forced: true,
				firstDo: true,
				audio: "swe_aowu",
				filter(event, player) {
					if (!Array.isArray(event.cards)) return false;
					const mode = player.getStorage("swe_zhongji_mode", 1);
					const cardIds = [];
					for (const card of event.cards) {
						if (!get.is.damageCard(card) || get.position(card, true) !== "d") continue;
						if (player.getStorage("swe_zhongji_refushou").includes(card)) return false;
						if (card.cardid && cardIds.includes(card.cardid)) continue;
						if (card.cardid) cardIds.push(card.cardid);
						const damaged = lib.skill.swe_zhongji.isDamagedCard(card, event);
						const type = damaged ? 1 : 2;
						if (type === mode) return true;
					}
					return false;
				},
				async content(event, trigger, player) {
					const mode = player.getStorage("swe_zhongji_mode", 1);
					let gainNum = 0;
					const cardIds = [];
					for (const card of trigger.cards || []) {
						if (!get.is.damageCard(card) || get.position(card, true) !== "d") continue;
						if (player.getStorage("swe_zhongji_refushou").includes(card)) return false;
						if (card.cardid && cardIds.includes(card.cardid)) continue;
						if (card.cardid) cardIds.push(card.cardid);
						const damaged = lib.skill.swe_zhongji.isDamagedCard(card, trigger);
						const type = damaged ? 1 : 2;
						if (type === mode) gainNum += 1;
					}
					if (gainNum > 0) player.addCharge(gainNum);
				},
			},
			record: {
				trigger: {
					global: ["cardsDiscardAfter", "loseAfter", "loseAsyncAfter"],
				},
				forced: true,
				silent: true,
				filter(event, player) {
					return (
						Array.isArray(event.cards) &&
						event.cards.some(
							card =>
								get.is.damageCard(card) &&
								get.position(card, true) === "d"
						)
					);
				},
				async content(event, trigger, player) {
					const cardIds = [];
					for (const card of trigger.cards || []) {
						if (!get.is.damageCard(card) || get.position(card, true) !== "d") continue;
						if (card.cardid && cardIds.includes(card.cardid)) continue;
						if (card.cardid) cardIds.push(card.cardid);
						const damaged = lib.skill.swe_zhongji.isDamagedCard(card, trigger);
						const type = damaged ? 1 : 2;
						lib.skill.swe_zhongji.addRoundRecord(player, type, card);
					}
					player.markAuto("swe_zhongji_refushou", player.getStorage("swe_zhongji_refushou").filter(card => !trigger.cards.includes(card)));
				},
			},
			follow: {
				trigger: {
					player: "useCardAfter",
				},
				forced: true,
				audio: "swe_aowu",
				filter(event, player) {
					if (!event.card || event.card.isCard !== true || !event.cards?.length) return false;
					if (event.cards.filter(card => player.getStorage("swe_zhongji_refushou").includes(card))?.length > 0) return false;
					return player.countCards("h", card => card.hasGaintag("swe_zhongji_fushou") && player.hasUseTarget(card)) > 0;
				},
				async content(event, trigger, player) {
					const next = player.chooseToUse({
						filterCard(card) {
							if (get.itemtype(card) != "card" || get.position(card) !== "h") return false;
							if (!card.hasGaintag("swe_zhongji_fushou")) return false;
							return lib.filter.filterCard.apply(this, arguments);
						},
						filterTarget(card, player2, target) {
							return lib.filter.targetEnabled.apply(this, arguments);
						},
						prompt: "终极：你可以使用一张“副手”牌",
						addCount: false,
						forced: false,
					});
					next.set("logSkill", "swe_zhongji");
					await next;
				},
			},
		},
	},
	// 卡提希娅（❤❤❤
	swe_fengdu: {
		audio: `${ea}katixiya:2`,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		init: function (player, skill) {
			player.storage[skill] = 0;
		},
		usable: 2,
		filter(event, player) {
			if (!event.card || event?.targets?.length !== 1 || !event.player.isIn()) return false;
			if (!["basic", "trick"].includes(get.info(event.card).type)) return false;
			return (event.player !== player && player === event.targets[0]) || (event.player === player && player !== event.targets[0]);
		},
		async cost(event, trigger, player) {
			var list = [],
				choiceList = ["令此牌额外增加一个目标", "令此牌回复值/伤害值+1"];
			if (player.storage["swe_fengduChoice"] === "选项一") {
				choiceList[0] += '<span style="color: yellow;">' + "(上次选择)" + "</span>"
			}
			else if (player.storage["swe_fengduChoice"] === "选项二") {
				choiceList[1] += '<span style="color: yellow;">' + "(上次选择)" + "</span>"
			}
			if (game.hasPlayer(p => {
				return !trigger?.targets?.includes(p) && lib.filter.targetEnabled2(trigger.card, trigger.player, p);
			})) list.push("选项一");
			else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			list.push("选项二");
			list.push("cancel2");
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt("swe_fengdu"))
				.set("choiceList", choiceList)
				.set("choiceList2", list)
				.set("ai", function (event, player) {
					let trigger = event.getTrigger();
					let priority1 = 1,
						priority2 = 1;
					let inc = player.hasSkill("swe_fengdu_shenquanjian") ? 1 : 2;
					if (player.storage["swe_fengduChoice"] === "选项一") {
						priority2 += inc;
					} else if (player.storage["swe_fengduChoice"] === "选项二") {
						priority1 += inc;
					}
					if (game.hasPlayer(target => {
						return trigger.targets.includes(target) &&
							lib.filter.targetEnabled2(trigger.card, trigger.player, target) &&
							get.effect(target, trigger.card, trigger.player, _status.event.player) > 0;
					})) {
						priority1 += 1;
					}
					if (player.getHp() < 3) {
						priority2 /= 3;
					}
					if (!player.hasSkill("swe_fengdu_yiquanjian")) {
						priority2 *= 1.5;
						if (player.hasSkill("swe_fengdu_renquanjian") && player.hasSkill("swe_fengdu_shenquanjian")) {
							priority2 *= 2;
						}
					}
					return Math.random() > 0.2 ? (priority1 >= priority2 ? (get.event("choiceList2").includes("选项一") ? "选项一" : "cancel2") : "选项二") : "cancel2";
				})
				.forResult();
			let targetx;
			if (result.control === "选项一") {
				targetx = await player
					.chooseTarget("为" + get.translation(trigger.card) + "增加一个目标", true, function (card, player, target) {
						var trigger = _status.event.getTrigger();
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
					})
					.set("ai", function (target) {
						var trigger = _status.event.getTrigger();
						return get.effect(target, trigger.card, trigger.player, _status.event.player);
					}).
					forResultTargets();
			}
			event.result = {
				bool: result.control && result.control !== "cancel2",
				cost_data: result.control,
				targets: targetx || [],
			};
		},
		async content(event, trigger, player) {
			switch (event.cost_data) {
				case "选项一":
					const target = event.targets[0];
					trigger.targets.push(target);
					trigger.player.line(target);
					game.log(player, "为", "#y" + get.translation(trigger.card), "增加了", target, "为目标");
					await game.delayx();
					break;
				case "选项二":
					const evt = trigger.getParent();
					if (evt) {
						if (!evt.baseDamage) evt.baseDamage = 1;
						evt.baseDamage += 1;
						game.log(evt.card, "的伤害值/回复值", "#y+" + 1);
					}
					break;
				default:
					break;
			}
			if (player.storage["swe_fengduChoice"] && player.storage["swe_fengduChoice"] !== event.cost_data) {
				await player.draw();
				if (!player.hasSkill("swe_fengdu_shenquanjian")) {
					await player.addSkill("swe_fengdu_shenquanjian");
					await player.popup("神权剑");
					await game.delayx();
				}
			}
			player.storage["swe_fengduChoice"] = event.cost_data;
		},
		group: "swe_fengdu_damage",
		createSword(player, name) {
			if (!_status.swJianCSS) {
				_status.swJianCSS = true
				const style = document.createElement('style')
				style.innerHTML = `
						@keyframes swordAnim1 {
						  0% { transform: translate(0, -12px); }
						  30% { transform: translate(0, 0); }
						  80% { transform: translate(0px, -20px); }
						  100% { transform: translate(0, -12px); }
						}
						@keyframes swordAnim2 {
						  0% { transform: translate(0, -6px); }
						  15% { transform: translate(0, 0); }
						  65% { transform: translate(0px, -20px); }
						  100% { transform: translate(0, -6px); }
						}
						@keyframes swordAnim3 {
						  0% { transform: translate(0, 0); }
						  50% { transform: translate(0px, -20px); }
						  100% { transform: translate(0, 0); }
						}
						.swJianYing img{
						position: absolute;
						width: 35px;
						height: 50px;
						pointer-events: none;
						z-index: 10;
						transform-origin: center center;
						}
						.swJianYing .shenquanjian{
						rotate: -45deg;
						animation: swordAnim1 4s infinite ease-in-out;
						}
						.swJianYing .renquanjian{
						rotate: 0deg;
						left: 30px;
						animation: swordAnim2 4s infinite ease-in-out;
						}
						.swJianYing .yiquanjian{
						rotate: 45deg;
						left: 60px;
						animation: swordAnim3 4s infinite ease-in-out;
						}
						`
				document.head.appendChild(style)
			}
			let div;
			if (!player?.node?.swJian) {
				div = ui.create.div('.swJianYing', player, {
					width: "80px",
					//height: "80px",
					left: "12px",
					transform: "translateY(10px)",
					pointerEvents: "none",
					overflow: "visible",
					display: "flex",
					alignItems: "center",
					zIndex: "201",
					position: "relative",
				});
				div.num = 0;
				player.node.swJian = div;
			}
			else {
				div = player.node.swJian;
			}
			if (!div.num) div.startTime = performance.now();
			const img = document.createElement('img');
			img.src = `${lib.assetURL}extension/${swTool.extensionName}/assets/image/${name}.png`;
			img.classList.add(name);
			const elapsed = (performance.now() - div.startTime) % 4000;
			img.style.animationDelay = `-${elapsed}ms`;
			div.num = (div.num || 0) + 1;
			div.appendChild(img);
			game.broadcast((player, name) => {
				lib.skill.swe_fengdu.createSword(player, name);
			}, player, name)
		},
		removeSword(player, name) {
			if (!player?.node?.swJian) return;
			const div = player.node.swJian;
			const target = div.querySelector(`.${name}`);
			if (target) {
				target.remove();
				div.num = Math.max((div.num || 0) - 1, 0);
			}
			game.broadcast((player, name) => {
				lib.skill.swe_fengdu.removeSword(player, name);
			}, player, name)
		},
		subSkill: {
			damage: {
				audio: ["swe_fengdu", 2],
				forced: true,
				firstDo: true,
				trigger: {
					source: "damageSource",
					player: "damageEnd",
				},
				filter(event, player) {
					return !player.hasSkill("swe_fengdu_yiquanjian") && event?.num > 1;
				},
				async content(event, trigger, player) {
					await player.addSkill("swe_fengdu_yiquanjian");
					await player.popup("异权剑");
					await game.delayx();
				},
			},
			renquanjian: {
				temp: true,
				init2(player) {
					lib.skill.swe_fengdu.createSword(player, "renquanjian");
					game.log(player, "获得了", "#g【人权剑】")
				},
				onremove(player) {
					lib.skill.swe_fengdu.removeSword(player, "renquanjian");
				},
			},
			shenquanjian: {
				temp: true,
				init2(player) {
					lib.skill.swe_fengdu.createSword(player, "shenquanjian");
					game.log(player, "获得了", "#g【神权剑】")
				},
				onremove(player) {
					lib.skill.swe_fengdu.removeSword(player, "shenquanjian");
				},
			},
			yiquanjian: {
				temp: true,
				init2(player) {
					lib.skill.swe_fengdu.createSword(player, "yiquanjian");
					game.log(player, "获得了", "#g【异权剑】")
				},
				onremove(player) {
					lib.skill.swe_fengdu.removeSword(player, "yiquanjian");
				},
			},
		},
		ai: {
			order: 4,
			threaten: function (player, target) {
				if (player.hasHistory("useSkill", evt => {
					return evt.skill == "swe_fengdu";
				})) return 1;
				return 0.7;
			},
			result: {
				player: 1,
			},
			effect: {
				target(card, player, target) {
					if (!player.hasHistory("useSkill", evt => {
						return evt.skill == "swe_fengdu";
					}) &&
						["basic", "trick"].includes(get.info(card).type)
					) return [1, 1];
					return;
				},
				player(card, player, target, result) {
					if (!player.hasHistory("useSkill", evt => {
						return evt.skill == "swe_fengdu";
					}) &&
						["basic", "trick"].includes(get.info(card).type)
					) return [1, 1];
					return;
				},
			},
		},
	},
	swe_yijian: {
		audio: `${ea}katixiya:2`,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return true;
		},
		ai2(target) {
			const player = get.player();
			return lib.suit.filter(s => !target.getCards('h').map(card => get.suit(card)).includes(s)).length * get.attitude(player, target) * ((player.countCards("h") > 10 && player === target) ? 0 : 1);
		},
		async content(event, trigger, player) {
			const target = event.target;
			const cards = [];
			const suit = lib.suit.filter(s => !target.getCards('h').map(card => get.suit(card)).includes(s));
			for (const s of suit) {
				const card = get.cardPile2(function (card) {
					return get.suit(card) == s;
				});
				if (card) cards.push(card);
			}
			if (cards.length) {
				await target.gain(cards, "gain2");
				if (cards.length >= 2) {
					await player.addSkill("swe_fengdu_renquanjian");
					await player.popup("人权剑");
				}
			}
			await game.delayx();
		},
		ai: {
			order() {
				var player = _status.event.player;
				return (lib.suit.filter(s => !player.getCards('h').map(card => get.suit(card)).includes(s)).length + 0.01) * 2;
			},
			result: {
				player(player) {
					return lib.suit.filter(s => !player.getCards('h').map(card => get.suit(card)).includes(s)).length
				},
			},
		},
	},
	swe_qiyuan: {
		limited: true,
		skillAnimation: false,
		enable: "phaseUse",
		audio: `${ea}katixiya:2`,
		selectCard: [-1, -2],
		filterTarget(card, player, target) {
			if (ui.selected.targets.length) return true;
			if (player === target) {
				player.classList.add("selected");
				ui.selected.targets.add(player);
				game.check();
				return true;
			}
			return false;
		},
		selectTarget: 1,
		filterCard: () => false,
		filter(event, player) {
			return !player.hasHistory("useSkill", evt => {
				return evt.skill == "swe_qiyuan";
			}) &&
				(
					player.getHistory('useCard').map(evt => get.suit(evt.card)).unique().filter(i => lib.suit.includes(i)).length >= 4 ||
					(player.hasSkill("swe_fengdu_shenquanjian") && player.hasSkill("swe_fengdu_yiquanjian") && player.hasSkill("swe_fengdu_renquanjian"))
				)
		},
		async contentBefore(event, trigger, player) {
			if (typeof swTool.playSkillVideo === "function") {
				game.broadcastAll(function () {
					swTool.playSkillVideo("kati1", 3700);
				})
				await game.delay(0, 3700);
			}
		},
		async content(event, trigger, player) {
			await player.awakenSkill(event.name);
			if (player.getHp(true) > Math.floor((player.maxHp + 1) / 2)) {
				const delt = player.getHp(true) - Math.floor((player.maxHp + 1) / 2);
				if (delt != 0) {
					const next = player.changeHp(-delt);
					next._triggered = null;
					await next;
				}
			}
			if ([player.name1, player.name2].includes("swe_katixiya")) await player.reinitCharacter("swe_katixiya", "swe_fuludelisi");
			else await player.changeCharacter(["swe_fuludelisi"]);
			await player.restoreSkill("swe_chaonu", true);
		},
		ai: {
			order() {
				const player = get.player();
				if (player.hasSkill("swe_fengdu_shenquanjian") && player.hasSkill("swe_fengdu_yiquanjian") && player.hasSkill("swe_fengdu_renquanjian")) return 114514;
				return 0;
			},
			result: {
				player(player) {
					return (player.hasSkill("swe_fengdu_shenquanjian") + player.hasSkill("swe_fengdu_yiquanjian") + player.hasSkill("swe_fengdu_renquanjian") * 2)
				},
			},
		}
	},
	// 芙露德莉斯
	swe_jueyi: {
		audio: `${ea}katixiya:4`,
		persevereSkill: true,
		trigger: {
			player: ["swe_jueyi_beginAfter", "swe_jueyi_addAfter"],
		},
		filter(event, player) {
			let skills = [];
			if (player?.additionalSkills?.swe_jueyi) skills.addArray(player.additionalSkills.swe_jueyi);
			return player.countMark("swe_jueyi") >= 120 * skills.length;
		},
		direct: true,
		beginMarkCount: 0,
		maxMarkCount: 120,
		derivation: ["swe_chaonu"],
		onremove: true,
		addMark(player, num) {
			num = Math.min(num, lib.skill.swe_jueyi.maxMarkCount - player.countMark("swe_jueyi"));
			if (num > 0) player.addMark("swe_jueyi", num);
		},
		async content(event, trigger, player) {
			const derivation = lib.skill.swe_jueyi.derivation,
				skills = player.countMark("swe_jueyi") == lib.skill.swe_jueyi.maxMarkCount ? derivation : derivation.slice(0, Math.floor(player.countMark("swe_jueyi") / 120));
			player.addAdditionalSkill("swe_jueyi", skills);
		},
		marktext: "决",
		intro: {
			name: "决意",
			content: "当前决意点数为#",
		},
		group: ["swe_jueyi_begin", "swe_jueyi_add", "swe_jueyi_clear"],
		subSkill: {
			begin: {
				persevereSkill: true,
				trigger: { player: "changeCharacterAfter" },
				forced: true,
				async content(event, trigger, player) {
					if (player.hasSkill("swe_fengdu_shenquanjian")) {
						await player.removeSkill("swe_fengdu_shenquanjian")
						lib.skill.swe_jueyi.addMark(player, 30);
						await player.addSkill("swe_jueyi_immunity");
					}
					if (player.hasSkill("swe_fengdu_yiquanjian")) {
						await player.removeSkill("swe_fengdu_yiquanjian")
						lib.skill.swe_jueyi.addMark(player, 30);
						await player.addSkill("swe_jueyi_damage");
					}
					if (player.hasSkill("swe_fengdu_renquanjian")) {
						await player.removeSkill("swe_fengdu_renquanjian")
						lib.skill.swe_jueyi.addMark(player, 30);
						await player.addSkill("swe_jueyi_jump");
					}
				},
			},
			add: {
				audio: ["swe_jueyi", 4],
				persevereSkill: true,
				trigger: {
					player: ["turnOverEnd", "linkEnd", "loseEnd"],
					source: "damageSource",
				},
				filter(event, player) {
					if (player.countMark("swe_jueyi") >= lib.skill.swe_jueyi.maxMarkCount) return false;
					if (event.name === "damage") return event.num > 1;
					else if (event.name === "lose") {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].original == "h" && player.countCards('h', card => get.suit(event.cards[i]) === get.suit(card)) <= 0) return true;
						}
						return false;
					}
					return true;
				},
				forced: true,
				async content(event, trigger, player) {
					let toAdd = (event.triggername === "damageSource") * 30 + (event.triggername !== "loseEnd" && event.triggername !== "damageSource") * 40;
					if (event.triggername === "loseEnd") {
						const evt = event.getTrigger();
						const list = [];
						for (var i = 0; i < evt.cards.length; i++) {
							if (evt.cards[i].original == "h" &&
								player.countCards('h', card => get.suit(evt.cards[i]) === get.suit(card)) <= 0 &&
								!list.includes(get.suit(evt.cards[i]))
							) {
								toAdd += 20;
								list.push(get.suit(evt.cards[i]))
							}
						}
					}
					lib.skill.swe_jueyi.addMark(player, toAdd);
				},
			},
			clear: {
				charlotte: true,
				trigger: { global: "roundStart" },
				direct: true,
				async content(event, trigger, player) {
					const list = ["jump", "damage", "immunity"];
					for (const i of list) {
						const name = `swe_jueyi_${i}`;
						if (player.hasSkill(name)) {
							player.setStorage(name, player.getStorage(name, 0) - 1);
							if (player.getStorage(name, 0) <= 0) player.removeSkill(name);
						}
					}
				},
			},
			jump: {
				charlotte: true,
				temp: true,
				init2(player) {
					player.setStorage("swe_jueyi_jump", 2);
				},
				trigger: {
					player: ["phaseDiscardBefore", "phaseJudgeBefore"],
				},
				onremove: true,
				mark: true,
				marktext: "人",
				intro: {
					name: "人权之心",
					content: function (storage, player, skill) {
						return `始终跳过判定和弃牌阶段<br>剩余持续轮次：${player.getStorage("swe_jueyi_jump", 0)}`;
					},
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.cancel();
					//player.logSkill(event.name);
					game.log(player, "跳过了", "#y" + event.triggername == "phaseDiscardBefore" ? "弃牌阶段" : "判定阶段");
				},
			},
			damage: {
				charlotte: true,
				temp: true,
				trigger: { source: "damageBegin1" },
				init2(player) {
					player.setStorage("swe_jueyi_damage", 2);
				},
				onremove: true,
				mark: true,
				marktext: "异",
				intro: {
					name: "异权之力",
					content: function (storage, player, skill) {
						return `你造成的伤害+1<br>剩余持续轮次：${player.getStorage("swe_jueyi_damage", 0)}`;
					},
				},
				filter(event, player) {
					return (
						// game
						// 	.getGlobalHistory(
						// 		"everything",
						// 		evt => {
						// 			return evt.name == "damage" && evt.source == player;
						// 		},
						// 		event
						// 	)
						// 	.indexOf(event) == 0 &&
						event.player.isIn()
					);
				},
				logTarget: "player",
				forced: true,
				async content(event, trigger, player) {
					trigger.num += 1;
					//player.logSkill(event.name);
				},
			},
			immunity: {
				charlotte: true,
				temp: true,
				trigger: { player: "damageBegin4" },
				init2(player) {
					player.setStorage("swe_jueyi_immunity", 2);
				},
				onremove: true,
				mark: true,
				marktext: "神",
				intro: {
					name: "神权之意",
					content: function (storage, player, skill) {
						return `当你受到伤害时，你可以弃置一张装备牌防止之<br>剩余持续轮次：${player.getStorage("swe_jueyi_immunity", 0)}`;
					},
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseToDiscard("he", { type: "equip" }, false)
						.set(
							"prompt",
							'###神权之意###<div class="text center">你可以弃置一张装备牌并防止此伤害</div>'
						)
						.set("ai", function (card) {
							var player = _status.event.player;
							if (player.hp == 1 || _status.event.getTrigger().num > 1) {
								return 10 - get.value(card);
							}
							if (player.hp == 2) {
								return 8 - get.value(card);
							}
							return 7 - get.value(card);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					trigger.cancel();
					//player.logSkill(event.name);
				},
				ai: {
					threaten: function (player, target) {
						if (player.countCards("he", { type: "equip" })) return 0.6;
						return 1;
					},
				},
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.name(card) == "tiesuo") return [1, 2];
				},
				player(card, player, target) {
					if (!player.hasCard(cd => get.suit(cd) == get.suit(card), 'h')) return [1, 1];
				},
			},
		}
	},
	swe_chaonu: {
		audio: `${ea}katixiya:2`,
		limited: true,
		skillAnimation: false,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		position: "he",
		filterCard: false,
		selectCard: [0, Infinity],
		persevereSkill: true,
		filter(event, player) {
			return player.countMark("swe_jueyi") >= 120;
		},
		complexSelect: true,
		ai1(card) {
			return 0;
			// if (!ui?.selected?.targets?.length) return 0;
			// const target = ui?.selected?.targets[0];
			// const player = get.player();
			// if (ui.selected.cards?.length >= Math.min(target.countCards('h'), 4)) return -114514;
			// return 8 - get.value(card);
		},
		ai2(target) {
			const player = get.player();
			return get.damageEffect(target, player, player) * target.countCards('h');
		},
		async contentBefore(event, trigger, player) {
			if (typeof swTool.playSkillVideo === "function") {
				game.broadcastAll(function () {
					swTool.playSkillVideo("kati2", 5300);
				})
				await game.delay(0, 5300);
			}
		},
		logTarget: "target",
		async content(event, trigger, player) {
			await player.awakenSkill(event.name);
			// 下雨特效
			game.broadcastAll(() => {
				const raindropCount = 200;
				if (!_status.swYuCSS) {
					_status.swYuCSS = true
					const style = document.createElement('style')
					style.innerHTML = `
						.raindrop {
						  position: absolute;
						  width: 2px;
						  background: #aaa;
						  opacity: 0.6;
						  animation: fall 1s linear forwards;
						}
					
						@keyframes fall {
						  from {
							transform: translateY(0);
						  }
						  to {
							transform: translateY(100vh);
						  }
						}
						`
					document.head.appendChild(style)
				}
				for (let i = 0; i < raindropCount; i++) {
					const delay = Math.random() * 6000;
					setTimeout(() => {
						const drop = document.createElement('div');
						drop.className = 'raindrop';
						drop.style.left = Math.random() * window.innerWidth + 'px';
						drop.style.top = '0px';
						drop.style.pointerEvents = 'none';
						drop.style.height = 30 + Math.random() * 20 + 'px';
						drop.addEventListener('animationend', () => {
							drop.remove();
						});
						document.body.appendChild(drop);
					}, delay);
				}
			})
			// 剑痕特效
			game.broadcastAll(() => {
				_status.oldLineXY = game.linexy;
				game.linexy = function (...args) {
					try {
						return _status.oldLineXY.apply(this, args);
					} finally {
						game.linexy = _status.oldLineXY;
						delete _status.oldLineXY;
						const path = args[0];
						const from = [path[0], path[1]],
							to = [path[2], path[3]];
						const line = document.createElement('line');
						const dx = to[0] - from[0];
						const dy = to[1] - from[1];
						const angle = Math.atan2(dy, dx) * 180 / Math.PI;
						const screenHypot = Math.hypot(window.innerWidth, window.innerHeight);
						const length = Math.sqrt(dx * dx + dy * dy) + screenHypot;
						line.style.left = from[0] + 'px';
						line.style.top = from[1] + 'px';
						line.style.transform = `rotate(${angle}deg)`;
						line.style.width = length + 'px';
						line.style.position = 'absolute';
						line.style.height = '2px';
						line.style.background = '#7FDBFF';
						line.style.boxShadow = '0 0 8px #7FDBFF, 0 0 16px #7FDBFF';
						line.style.transformOrigin = 'left center';
						line.style.zIndex = '10';
						line.style.pointerEvents = 'none';
						line.style.opacity = '0';
						line.style.transitionDuration = '4s';
						requestAnimationFrame(() => {
							line.style.opacity = '1';
						});
						setTimeout(() => {
							line.style.opacity = '0';
							line.addEventListener('transitionend', () =>
								line.remove()
							);
						}, 60000);
						if (game.chess) ui.chess.appendChild(line);
						else ui.arena.appendChild(line);
					}
				};
			})
			// const cardsNum = event?.cards?.length || 0
			// const damageNum = Math.min(lib.suit.map(suit => event.target.getCards('h').map(card => get.suit(card)).includes(suit) ? [suit] : []).flat().length, cardsNum) || 1;
			const damageNum = lib.suit.map(suit => event.target.getCards('h').map(card => get.suit(card)).includes(suit) ? [suit] : []).flat().length || 1;
			player.line(event.target);
			await event.target.damage(damageNum, player);
			// if (damageNum != cardsNum) {
			// 	player.when("phaseEnd")
			// 		.then(() => {
			// 			player.draw(drawNum)
			// 		})
			// 		.vars({
			// 			drawNum: Math.abs(damageNum - cardsNum)
			// 		})
			// }
			await game.delayx();
			const list = ["jump", "damage", "immunity"];
			for await (const i of list) {
				const name = `swe_jueyi_${i}`;
				if (player.hasSkill(name)) {
					await player.removeSkill(name);
				}
			}
			await player.recover();//Math.floor(player.maxHp / 2)
			await player.removeMark("swe_jueyi", 120, false);
			if ([player.name1, player.name2].includes("swe_fuludelisi")) await player.reinitCharacter("swe_fuludelisi", "swe_katixiya");
			else await player.changeCharacter(["swe_katixiya"]);
			await player.restoreSkill("swe_qiyuan");
		},
		ai: {
			threaten: 1.2,
			expose: 0.8,
			order: 114514,
			result: {
				player: 1,
			},
		},
	},
	// 二游同人创 - 伊德梅塔
	swe_tianjian: {
		audio: `${ea}swe_yidemeita:2`,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const males = game.countPlayer(current => current.isIn() && current.sex === "male");
			const num = event.num ?? Math.max(3, males);
			if (!ui.cardPile.hasChildNodes) return;
			const pile = Array.from(ui.cardPile.childNodes);
			const pool = pile
				.slice(0, Math.ceil(pile.length / 2))//  
				.filter(card => {
					const type = get.type(card);
					return type === "basic" || type === "trick";
				})
				.sort((a, b) => lib.sort.card(get.name(b), get.name(a)));
			if (!pool.length) return;
			let cards = pool;
			if (pool.length > num) {
				const result = await player
					.chooseButton([`天剑：从牌堆的前一半中选择${get.cnNumber(num)}张基本或普通锦囊牌`, [pool, "vcard"]], true)
					.set("selectButton", num)
					.set("ai", button => get.value(button.link))
					.forResult();
				if (!result?.bool || !result.links?.length) return;
				cards = result.links;
			} else {
				cards = pool.slice(0, Math.min(num, pool.length));
			}
			player.$gain2(cards, false);
			game.log(player, "将", cards, "置于了武将牌上");
			await player.loseToSpecial(cards, "swe_tianjian").set("visible", true);
			player.markSkill("swe_tianjian");
		},
		marktext: "天剑",
		intro: {
			mark(dialog, storage, player) {
				dialog.addAuto(
					player.getCards("s", card => card.hasGaintag("swe_tianjian"))
				);
			},
			markcount(storage, player) {
				return player.countCards("s", card => card.hasGaintag("swe_tianjian"));
			},
			onunmark(storage, player) {
				const cards = player.getCards("s", card => card.hasGaintag("swe_tianjian"));
				if (cards.length) {
					player.loseToDiscardpile(cards);
				}
			},
		},
	},
	swe_baoneng: {
		charlotte: true,
		isBaonengUse(event) {
			if (!event || typeof event.getParent !== "function") return false;
			const use = event.name === "useCard" || event.name === "useCardAfter" ? event : event.getParent("useCard");
			if (!use?.skill) return false;
			const info = get.info(use.skill);
			return info?.sourceSkill === "swe_baoneng";
		},
		audioname2: {
			swe_yidemeita: ["swe_tianqi", 2],
		},
		enable: "chooseToUse",
		filter(event, player) {
			//if (!player.hasSkill("swe_tianqi", null, false, false)) return false;
			const checked = new Set();
			for (const card of player.getCards("hs")) {
				const name = get.name(card, player);
				if (checked.has(name)) continue;
				checked.add(name);
				const count =
					name === "sha"
						? player.countCards("hs", c => get.name(c, player) === "sha")
						: player.countCards("hs", c => get.name(c, player) === name);
				if (count < 2) continue;
				if (name === "sha") {
					if (lib.inpile_nature.some(nature => event.filterCard(get.autoViewAs({ name: "sha", nature, isCard: true }, "unsure"), player, event))) {
						return true;
					}
					if (event.filterCard(get.autoViewAs({ name: "sha", isCard: true }, "unsure"), player, event)) {
						return true;
					}
					continue;
				}
				if (event.filterCard(get.autoViewAs({ name, isCard: true }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				const checked = new Set();
				for (const card of player.getCards("hs")) {
					const name = get.name(card, player);
					if (checked.has(name)) continue;
					checked.add(name);
					const count =
						name === "sha"
							? player.countCards("hs", c => get.name(c, player) === "sha")
							: player.countCards("hs", c => get.name(c, player) === name);
					if (count < 2) continue;
					if (name === "sha") {
						for (const nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name: "sha", nature, isCard: true }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", nature]);
							}
						}
						if (event.filterCard(get.autoViewAs({ name: "sha", isCard: true }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						continue;
					}
					if (!event.filterCard(get.autoViewAs({ name, isCard: true }, "unsure"), player, event)) continue;
					list.push([get.translation(get.type(name)), "", name]);
				}
				return ui.create.dialog("爆能", [list, "vcard"], "hidden");
			},
			check(button) {
				const player = get.player();
				const card = { name: button.link[2], nature: button.link[3], isCard: true };
				if (_status.event.getParent().type !== "phase") return 1;
				return player.getUseValue(card, null, true);
			},
			filter(button, player) {
				const evt = _status.event.getParent();
				return evt.filterCard({ name: button.link[2], nature: button.link[3], isCard: true }, player, evt);
			},
			backup(links, player) {
				const viewAs = { name: links[0][2] };
				if (links[0][3]) viewAs.nature = links[0][3];
				game.broadcastAll(
					(name, nature) => {
						lib.skill.swe_baoneng_backup.viewAs = { name, nature };
					},
					viewAs.name,
					viewAs.nature
				);
				lib.skill.swe_baoneng_backup.viewAs = viewAs;
				return get.copy(lib.skill.swe_baoneng_backup);
			},
			prompt(links) {
				return `将两张【${get.translation(links[0][2])}】当做【${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}】使用`;
			},
		},
		group: ["swe_baoneng_extra"],
		subSkill: {
			backup: {
				sourceSkill: "swe_baoneng",
				audioname2: {
					swe_yidemeita: ["swe_tianqi", 2],
				},
				filterCard(card, player) {
					const viewAs = lib.skill.swe_baoneng_backup.viewAs;
					if (!viewAs) return false;
					if (viewAs.name === "sha") return get.name(card, player) === "sha";
					return get.name(card, player) === viewAs.name && (!viewAs.nature || get.nature(card, player) === viewAs.nature);
				},
				selectCard: 2,
				position: "hs",
				complexCard: true,
				popname: true,
				viewAs: { name: "sha" },
			},
			extra: {
				charlotte: true,
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter(event, player) {
					return lib.skill.swe_baoneng.isBaonengUse(event);
				},
				content(event, trigger, player) {
					if (typeof trigger.effectCount !== "number") trigger.effectCount = 1;
					trigger.effectCount++;
					game.log(trigger.card, "额外结算一次");
				},
			},
			direct: {
				charlotte: true,
				trigger: { player: "useCardToPlayered" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (!lib.skill.swe_baoneng.isBaonengUse(event)) return false;
					const use = event.getParent("useCard");
					return use && use.effectedCount >= 2 && !use._swe_baoneng_direct;
				},
				content(event, trigger, player) {
					const use = trigger.getParent("useCard");
					if (!use) return;
					if (!Array.isArray(use.directHit)) use.directHit = [];
					use.directHit.addArray(game.players);
					use._swe_baoneng_direct = true;
					game.log(use.card, "第二次结算不能被响应");
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg?.card || !arg?.target) return false;
						return lib.skill.swe_baoneng.isBaonengUse(get.event());
					},
				},
			},
		},
	},
	swe_tianqi: {
		audio: `${ea}swe_yidemeita:3`,
		audioname2: {
			swe_yidemeita: `${ea}swe_yidemeita:3`,
		},
		achieveAudio2: {
			swe_yidemeita: `${ea}swe_yidemeita/swe_tianqi3.mp3`,
		},
		playAchieveAudio(player) {
			const char = player.name1 || player.name;
			const file = lib.skill.swe_tianqi.achieveAudio2?.[char];
			if (!file) return;
			game.broadcastAll(function (audioPath) {
				//if (!lib.config.background_speak) return;
				game.tryAudio({ audioList: [audioPath], random: false });
			}, file);
		},
		faithSkill: true,
		mark: true,
		marktext: "爆",
		intro: {
			content(storage, player) {
				return `爆能次数：${player.countMark("swe_tianqi_baoneng")}/5`;
			},
			markcount(storage, player) {
				return player.countMark("swe_tianqi_baoneng");
			},
		},
		group: ["swe_baoneng", "swe_baoneng_extra", "swe_baoneng_direct", "swe_tianqi_after"],
		subSkill: {
			after: {
				trigger: { player: "useCardAfter" },
				forced: true,
				popup: false,
				filter(event, player) {
					return lib.skill.swe_baoneng.isBaonengUse(event);
				},
				async content(event, trigger, player) {
					//await player.draw();
					await player.useSkill({ skill: "swe_tianjian", num: 1 }).forResult();
					player.addMark("swe_tianqi_baoneng", 1, false);
					player.markSkill("swe_tianqi");
					if (player.countMark("swe_tianqi_baoneng") >= 5 && !player.storage.swe_tianqi_faith) {
						player.storage.swe_tianqi_faith = true;
						game.log(player, "完成信仰");
						lib.skill.swe_tianqi.playAchieveAudio(player);
						player.$skill("天启", null, null, player.name || player.name1);
						await game.delay(0, 3100);
					}
					else if (player.storage.swe_tianqi_faith) {
						await player.gainMaxHp();
						await player.recover();
					}
				},
			},
			// fail: {
			// 	audio: false,
			// 	trigger: { player: "dieBefore" },
			// 	forced: true,
			// 	popup: false,
			// 	filter(event, player) {
			// 		return player.hasSkill("swe_tianqi", null, false, false) && !player.storage.swe_tianqi_faith;
			// 	},
			// 	content(event, trigger, player) {
			// 		game.log(player, "信仰失败");
			// 	},
			// },
		},
	},
	swe_epicseven: {
		ruleSkill: true,
		forced: true,
		firstDo: true,
		trigger: {
			global: "gameStart",
		},
		init: () => {
			game.addGlobalSkill("swe_epicsevenEnd");
		},
		filter(event, player) {
			return true;
		},
		async content(event, trigger, player) {
			if (_status.epicsevenLoop) return;
			_status.epicsevenLoop = true;
			game.phaseLoop = function (player) {
				const next = game.createEvent("phaseLoop");
				//确定首次行动的角色
				next.player = player;
				next.setContent([
					async (event, trigger, player) => {
						//执行回合
						if (game.players.includes(event.player)) {
							lib.onphase.forEach(i => i());
							const phase = event.player.phase();
							event.next.remove(phase);
							let isRoundEnd = false;
							if (lib.onround.every(i => i(phase, event.player))) {
								isRoundEnd = _status.roundSkipped;
								if (_status.isRoundFilter) {
									isRoundEnd = _status.isRoundFilter(phase, event.player);
								} else if (_status.seatNumSettled) {
									const seatNum = event.player.getSeatNum();
									if (seatNum != 0) {
										if (get.itemtype(_status.lastPhasedPlayer) != "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
											isRoundEnd = true;
										}
									}
								} else if (event.player == _status.roundStart) {
									isRoundEnd = true;
								}
								if (isRoundEnd && _status.globalHistory.some(i => i.isRound)) {
									for (let i = 0; i < game.players.length; i++) {
										game.players[i].classList.remove("acted");
									}
									game.log();
									await event.trigger("roundEnd");
								}
							}
							event.next.push(phase);
							if (lib.storage.zhu) {
								player.classList.add("acted");
							}
							await phase;
						}
						await event.trigger("phaseOver");
					},
					async (event, trigger, player) => {
						//判断接着行动的一方和角色
						/**
						 * 计算下一个行动条到达100%的玩家
						 * @param {number[]} speeds - 所有玩家的速度值
						 * @param {number[]} progresses - 所有玩家当前的行动条进度（0 ~ Number.MAX_SAFE_INTEGER）
						 * @returns {{ playerIndex: number, newProgresses: number[] }} 返回值是一个对象，包含第一个到达100%的玩家索引和新的进度数组
						 */
						function nextTurn(speeds, progresses) {
							const MAX = Number.MAX_SAFE_INTEGER;
							const needed = progresses.map(p => MAX - p);
							// 计算到达MAX所需的时间 = 剩余进度 / 速度
							const times = needed.map((n, i) => n / speeds[i]);
							// 找到最小时间和对应玩家
							let minTime = times[0];
							let playerIndex = 0;
							for (let i = 1; i < times.length; i++) {
								if (times[i] < minTime) {
									minTime = times[i];
									playerIndex = i;
								}
							}
							const newProgresses = progresses.map((p, i) => {
								let np = p + speeds[i] * minTime;
								return Math.min(np, MAX);
							});
							return ({
								playerIndex,
								newProgresses
							});
						}
						const players = game.filterPlayer2(p => !p.isDead())
						const { playerIndex, newProgresses } = nextTurn(players.map(p => p.swSpeed || 100), players.map(p => p.swProgess || 0));
						for (let i = 0; i < players.length; i++) {
							players[i].swProgess = newProgresses[i] || 0;
						}
						const nextPlayer = players[playerIndex]

						event.player = nextPlayer;
						event.goto(0);
					},
				]);
			}
			game.broadcastAll((player) => {
				game.filterPlayer2().forEach(p => {
					if (p === player) p.swSpeed ??= 116;
					else p.swSpeed ??= 100;
					p.swProgess ??= 0;
				})
			}, player)
		},
	},
	swe_epicsevenEnd: {
		ruleSkill: true,
		direct: true,
		lastDo: true,
		trigger: {
			player: "phaseEnd",
		},
		async content(event, trigger, player) {
			player.swProgess = 0;
		},
	},
	// Q群风云传-玫瑰血色包
	swx_xuezu: {
		forced: true,
		locked: true,
		group: ["swx_xuezu_init", "swx_xuezu_recover"],
		subSkill: {
			init: {
				forced: true,
				locked: true,
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				async content(event, trigger, player) {
					const cards = [];
					const suits = ["heart", "diamond"];
					for (let i = 3; i <= 10; i++) {
						cards.push(game.createCard2("sha", suits[(i - 1) % 2], i, "sw_xue"));
					}
					// game.broadcastAll(() => void lib.inpile.add(""));
					game.cardsGotoPile(cards, () => {
						return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
					});
				},
			},
			recover: {
				forced: true,
				locked: true,
				firstDo: true,
				trigger: {
					global: "damageEnd",
				},
				filter(event, player) {
					return event.card && event.card.name === "sha" && event.hasNature("sw_xue") && event.num > 0 && player.getDamagedHp() > 0;
				},
				async content(event, trigger, player) {
					await player.recover();
				},
			},
		},
	},
	swx_mieyi: {
		audio: `${ea}swx_lugushou:2`,
		group: ["swx_mieyi_maxhp", "swx_mieyi_minhp"],
		subSkill: {
			maxhp: {
				audio: "swx_mieyi",
				prompt2(event, player) {
					return "令" + get.translation(event.player) + "对自己造成1点伤害且本回合出杀次数+1";
				},
				logTarget: "target",
				trigger: { global: "recoverAfter" },
				usable: 1,
				filter(event, player) {
					return event.player && !event.player.isDead() && (event.player.isMaxHp(false) || event.player.getHp() == event.player.maxHp);
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					player.line(target);
					await target.damage(1, target);
					await target.addTempSkill("sw_xuesha_buff");
					target.storage.sw_xuesha_buff = (target.storage.sw_xuesha_buff || 0) + 1;
					target.updateMarks("sw_xuesha_buff");
				},
			},
			minhp: {
				audio: "swx_mieyi",
				prompt2(event, player) {
					return "令" + get.translation(event.player) + "回复1点体力并从牌堆中获得一张血【杀】";
				},
				logTarget: "target",
				trigger: {
					global: "damageEnd",
				},
				usable: 1,
				filter(event, player) {
					return event.player && event.player.isIn() && (event.player.isMinHp(false) || event.player.getHp() == 1);
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					player.line(target);
					await target.recover();
					let card = get.cardPile(current => current.name === "sha" && current.nature === "sw_xue");
					// if (!card) {
					// 	card = game.createCard2("sha", "heart", 1, "sw_xue");
					// }
					if (card) {
						await target.gain(card, "gain2");
					}
				},
			},
		},
	},
	swx_jihun: {
		audio: `${ea}swx_lugushou:1`,
		limited: true,
		skillAnimation: true,
		animationColor: "blood",
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.player && event.player !== player && event.source === event.player && event.num > 0 && player.getStorage("swx_jihun_have", [])?.length <= 0;
		},
		logTarget: "target",
		async content(event, trigger, player) {
			player.awakenSkill("swx_jihun");
			const target = trigger.player;
			const result = await player
				.chooseControl("上家", "下家")
				.set("prompt", "祭魂：将巫毒娃娃放置在上家或下家")
				.set("ai", () => "下家")
				.forResult();
			const isNext = result.control === "下家";
			const doll = await game.addPlayerOL(player, "swx_wudouwawa", null, isNext, { source: player, animate: false });
			if (!doll) return;

			game.broadcastAll((player, name) => {
				player.setAvatar(player.name, name);
				player.identity = "";
			}, doll, target.name)

			doll.storage.swx_jihun_isdoll = true;
			target.storage.swx_jihun_first = true;
			doll.storage.swx_jihun_pair = [player, target];
			target.storage.swx_jihun_together ??= [];
			doll.storage.swx_jihun_together ??= [];
			target.storage.swx_jihun_together.push(doll);
			doll.storage.swx_jihun_together.push(target);
			player.storage.swx_jihun_have ??= [];
			player.storage.swx_jihun_have.push(doll);

			const skills = target
				.getSkills(null, false, false)
				.filter(skill => ![...new Set(Object.values(target.additionalSkills || {}).flat())].includes(skill))
				.filter(skill => {
					const info = get.info(skill);
					if (info && info.charlotte) return false;
					return true;
				})
			await player.addAdditionalSkills("swx_jihun", skills);

			game.broadcastAll((maxHp, hp, doll) => {
				doll.maxHp = maxHp;
				doll.hp = hp;
				doll.update();
			}, target.maxHp, target.hp, doll);

			// const deltaMax = target.maxHp - doll.maxHp;
			// if (deltaMax > 0) {
			// 	const next = doll.gainMaxHp(deltaMax);
			// 	next._triggered = null;
			// 	await next;
			// }
			// else if (deltaMax < 0) {
			// 	const next = doll.loseMaxHp(-deltaMax);
			// 	next._triggered = null;
			// 	await next;
			// }
			// if (doll.hp > target.hp) {
			// 	const next = doll.changeHp(doll.hp - target.hp);
			// 	next._triggered = null;
			// 	await next;
			// }
			// else if (doll.hp < target.hp) {
			// 	const next = doll.changeHp(target.hp - doll.hp);
			// 	next._triggered = null;
			// 	await next;
			// }
			if (target.isLinked() !== doll.isLinked()) doll.link(true);
			player.addSkill(["swx_jihun_syncDamage", "swx_jihun_syncRecover", "swx_jihun_clear"]);
		},
		subSkill: {
			syncDamage: {
				trigger: { global: "damageEnd" },
				forced: true,
				charlotte: true,
				firstDo: true,
				popup: false,
				filter(event, player) {
					if (!event.player || !event.num) return false;
					if (event.player.storage.swx_jihun_first == true) {
						event.player.storage.swx_jihun_first = false;
						delete event.player.storage.swx_jihun_first;
						return false;
					}
					return event.player.getStorage("swx_jihun_together")?.length > 0 &&
						event.getParent().name != "swx_jihun_syncDamage";
				},
				async content(event, trigger, player) {
					const list = trigger.player.getStorage("swx_jihun_together");
					for (let p of list) {
						trigger.player.line(p);
						await p.damage(trigger.num, "nosource");
					}
				},
			},
			syncRecover: {
				trigger: { global: "recoverEnd" },
				forced: true,
				firstDo: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					if (!event.player || !event.num) return false;
					return event.player.getStorage("swx_jihun_together")?.length > 0 &&
						event.getParent().name != "swx_jihun_syncRecover";
				},
				async content(event, trigger, player) {
					const list = trigger.player.getStorage("swx_jihun_together");
					for (let p of list) {
						trigger.player.line(p);
						await p.recover(trigger.num);
					}
				},
			},
			clear: {
				trigger: { global: "dieAfter" },
				forced: true,
				charlotte: true,
				firstDo: true,
				popup: false,
				forceDie: true,
				filter(event, player) {
					return event.player && (event.player.getStorage("swx_jihun_together")?.length > 0 || event.player.getStorage("swx_jihun_have")?.length > 0);
				},
				async content(event, trigger, player) {
					const dead = trigger.player;
					while (dead.getStorage("swx_jihun_have")?.length) {
						const p = dead.getStorage("swx_jihun_have").shift();
						if (p.isIn()) {
							await p.die();
						}
					}
					while (dead.getStorage("swx_jihun_together")?.length) {
						const p = dead.getStorage("swx_jihun_together").shift();
						if (!p.isIn()) continue;
						if (dead.getStorage("swx_jihun_isdoll", false)) {
							await game.removePlayerOL(dead);
							if (dead.getStorage("swx_jihun_pair")?.length == 2) {
								await dead.getStorage("swx_jihun_pair")[0].removeAdditionalSkills("swx_jihun");
								const target = dead.getStorage("swx_jihun_pair")[1];
								if (target) {
									target.getStorage("swx_jihun_together").remove(dead);
									await target.loseHp(target.getHp());
								}
							}
						}
						else {
							if (p.getStorage("swx_jihun_isdoll", false)) {
								dead.getStorage("swx_jihun_together").remove(p);
								await p.die();
								if (p.getStorage("swx_jihun_pair")?.length == 2) {
									await p.getStorage("swx_jihun_pair")[0].removeAdditionalSkills("swx_jihun");
								}
								await game.removePlayerOL(p);
							}
						}
					}

				},
			},
		},
	},
	swx_jihun_doll_lock: {
		charlotte: true,
		forced: true,
		popup: false,
		trigger: { player: ["phaseBefore", "phaseUseBefore"] },
		filter(event, player) {
			return !!player.storage.swx_jihun_isdoll;
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
		mod: {
			cardEnabled(card, player) {
				if (player.storage.swx_jihun_isdoll) return false;
			},
			cardRespondable(card, player) {
				if (player.storage.swx_jihun_isdoll) return false;
			},
			cardSavable(card, player) {
				if (player.storage.swx_jihun_isdoll) return false;
			},
		},
	},

	// 瑰血天上客
	swx_xuezu2: {
		forced: true,
		locked: true,
		group: ["swx_xuezu2_init", "swx_xuezu2_recover"],
		subSkill: {
			init: {
				forced: true,
				locked: true,
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				async content(event, trigger, player) {
					const cards = [];
					const suits = ["heart", "diamond"];
					for (let i = 3; i <= 10; i++) {
						cards.push(game.createCard2("sha", suits[(i - 1) % 2], i, "sw_xue"));
					}
					// game.broadcastAll(() => void lib.inpile.add(""));
					game.cardsGotoPile(cards, () => {
						return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
					});
				},
			},
			recover: {
				forced: true,
				locked: true,
				firstDo: true,
				trigger: {
					global: "damageEnd",
				},
				filter(event, player) {
					return event.card && event.card.name === "sha" && event.hasNature("sw_xue") && event.num > 0 && player.getDamagedHp() > 0;
				},
				async content(event, trigger, player) {
					const card = get.cardPile(
						function (card) {
							return get.type(card) == "equip";
						},
						void 0,
						"random"
					);
					if (card) {
						await player.gain({ cards: [card], animate: "gain2" });
					}
				},
			},
		},
	},
	swx_mengmu: {
		forced: true,
		mod: {
			attackRangeBase(player) {
				return Math.max(player.hp, 0);
			},
			cardname(card, player) {
				if (card?.name === "shan") return "sha";
			},
			cardnature(card, player) {
				if (card?.name === "shan") return "sw_xue";
			},
		},
		updateSnapshot() {
			if (game.players.some((p) => !p.nextSeat)) return; // 座位环未排好(旁观重建中),等filter懒重建
			const map = {};
			for (const p of game.players) {
				if (!map[p.playerid]) map[p.playerid] = {};
				for (const q of game.players) {
					if (p === q) continue;
					map[p.playerid][q.playerid] = p.inRange(q);
				}
			}
			_status.swx_mengmu_snapshot = map;
		},
		trigger: {
			global: ["logSkill", "useSkillAfter", "dieAfter", "phaseBefore", "changeHp", "equipAfter", "loseAfter", "changeSkillsAfter"],
			player: "enterGame",
		},
		init(player) {
			lib.skill.swx_mengmu.updateSnapshot();
		},
		logTarget: "targets",
		filter(event, player) {
			const snapshot = _status.swx_mengmu_snapshot;
			if (!snapshot || !snapshot[player.playerid]) {
				lib.skill.swx_mengmu.updateSnapshot();
				return false;
			}
			const oldMap = snapshot[player.playerid] || {};
			const entering = [];
			const leaving = [];
			for (const p of game.players) {
				if (p === player) continue;
				const was = oldMap[p.playerid];
				const now = player.inRange(p);
				if (was && !now) leaving.push(p);
				else if (!was && now) entering.push(p);
			}
			const affected = entering.concat(leaving);

			if (affected?.length) {
				lib.skill.swx_mengmu.updateSnapshot();
				event.targets = affected;
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			const affected = trigger.targets;
			player.line(affected);
			for await (const p of affected) {
				if (p.countGainableCards(player, "hej") > 0) {
					await player.gainPlayerCard(p, "hej", true);
				}
			}

			const card = get.autoViewAs({ name: "sha" });
			let num = get.info(card).usable;
			if (typeof num == "function") {
				num = num(card, player);
			}
			num = game.checkMod(card, player, num, "cardUsable", player);
			if (typeof num != "number") {
				num = Infinity;
			}
			num = num - player.countUsed(card);

			if (num > 0) {
				const result = await player.chooseToUse(
					"你可以使用一张【杀】（计入次数）",
					(...args) => {
						const card = args[0];
						if (get.name(card) !== "sha") {
							return false;
						}
						return lib.filter.filterCard(...args);
					},
					(...args) => {
						const [card, player2, target2] = args;
						if (player2 === target2) {
							return false;
						}
						return lib.filter.filterTarget(...args);
					}
				).set("addCount", false).forResult();
				if (result?.bool) {
					const stat = player.getStat("card");
					stat.sha = (stat.sha || 0) + 1;
				}
			}
			lib.skill.swx_mengmu.updateSnapshot();
		},
		ai: { threaten: 1.5 },
	},
	swx_xiake: {
		priority: 1,
		dutySkill: true,
		derivation: ["swx_jianchu"],
		group: ["swx_xiake_achieve", "swx_xiake_fail"],
		subSkill: {
			achieve: {
				audio: "swx_xiake",
				trigger: { source: "dieAfter" },
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "thunder",
				filter(event, player) {
					return player.hasSkill("swx_xiake", null, false, false) && !player.awakenedSkills?.includes("swx_xiake");
				},
				async content(event, trigger, player) {
					player.awakenSkill("swx_xiake");
					game.log(player, "成功完成使命");
					await player.removeSkills("swx_mengmu");
					await player.addSkills("swx_jianchu");
				},
			},
			fail: {
				audio: "swx_xiake",
				trigger: {
					global: ["logSkill", "useSkillAfter", "dieAfter", "phaseBefore", "changeHp", "equipAfter", "loseAfter", "changeSkillsAfter"],
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return player.hasSkill("swx_xiake", null, false, false) && !player.awakenedSkills?.includes("swx_xiake") && player.getAttackRange() < 1;
				},
				async content(event, trigger, player) {
					player.awakenSkill("swx_xiake");
					game.log(player, "使命失败");
					player.disableEquip("equip1");
				},
			},
		},
	},
	swx_jianchu: {
		forced: true,
		init() {
			if (!lib.skill.global.includes("swx_jianchu_global")) {
				game.addGlobalSkill("swx_jianchu_global");
			}
		},
		onremove(player) {
			if (!game.hasPlayer(p => p.hasSkill("swx_jianchu", null, false, false), true)) {
				game.removeGlobalSkill("swx_jianchu_global");
			}
		},
		mod: {
			attackRangeBase(player) {
				return Infinity;
			},
			cardUsable(card, player, num) {
				if (card.name === "sha") return Infinity;
			},
		},
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.card?.name === "sha";
		},
		async content(event, trigger, player) {
			await player.draw();
		},
		group: "swx_jianchu_guard",
		subSkill: {
			guard: {
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					return event.card?.name === "sha";
				},
				async content(event, trigger, player) {
					player.addTempSkill("swx_jianchu_untouchable", { player: "useCardAfter" });
					// player.when("useCardAfter")
					// 	.assign({
					// 		forceOut: true,
					// 	})
					// 	.filter((event2, player2) => {
					// 		return trigger?.card === event2?.card;
					// 	})
					// 	.then(() => {
					// 		player.removeSkill("swx_jianchu_untouchable");
					// 	})
				},
			},
			untouchable: {
				group: "undist",
				init(player) {
					if (player.isIn()) {
						game.broadcastAll(function (player) {
							player.classList.add("transparent");
						}, player);
					}
					//player.addSkill("undist");
					//player.out("swx_jianchu");
				},
				onremove(player) {
					if (player.classList.contains("transparent")) {
						game.broadcastAll(function (player) {
							player.classList.remove("transparent");
						}, player);
					}
					//player.removeSkill("undist");
					//player.in("swx_jianchu");
				},
				charlotte: true,
				mark: true,
				intro: { content: "无法成为其他角色使用牌或技能的目标" },
				targetEnabled(card, user, target) {
					if (user !== target) return false;
				}
			},
		},
		ai: { threaten: 2.0 },
	},
	swx_jianchu_global: {
		charlotte: true,
		mod: {
			playerEnabled(card, user, target) {
				if (target?.hasSkill("swx_jianchu_untouchable") && user !== target) return false;
			},
		},
		wrapFilterTarget(event) {
			if (event._swx_jianchu) return;
			event._swx_jianchu = true;
			const old = event.filterTarget;
			event.filterTarget = function (card, pl, target) {
				if (target?.hasSkill("swx_jianchu_untouchable") && pl !== target) return false;
				if (typeof old === "function") return old.apply(this, arguments);
				return lib.filter.filterTarget(card, pl, target);
			};
		},
		onChooseToUse(event) {
			if (game.hasPlayer(p => p.hasSkill("swx_jianchu_untouchable"))) {
				lib.skill.swx_jianchu_global.wrapFilterTarget(event);
			}
		},
		onChooseTarget(event, player) {
			lib.skill.swx_jianchu_global.wrapFilterTarget(event);
		},
		trigger: { global: "chooseCardTargetBegin" },
		forced: true,
		silent: true,
		firstDo: true,
		popup: false,
		filter(event, player) {
			return game.hasPlayer(p => p.hasSkill("swx_jianchu_untouchable"));
		},
		async content(event, trigger, player) {
			lib.skill.swx_jianchu_global.wrapFilterTarget(trigger);
		},
	},
	// 瑰血睡死
	swx_guihen: {
		marktext: "瑰",
		intro: {
			name: "瑰痕",
			content: "“瑰痕”标记为#个",
			markcount(storage, player) {
				return `${player.countMark("swx_guihen")}`;
			},
		},
	},
	swx_xuezu3: {
		audio: `${ea}swx_shuisi:2`,
		forced: true,
		locked: true,
		priority: 1,
		group: ["swx_xuezu3_init", "swx_xuezu3_damage"],
		subSkill: {
			init: {
				audio: "swx_xuezu3",
				forced: true,
				locked: true,
				priority: 1,
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				async content(event, trigger, player) {
					const cards = [];
					const suits = ["heart", "diamond"];
					for (let i = 3; i <= 10; i++) {
						cards.push(game.createCard2("sha", suits[(i - 1) % 2], i, "sw_xue"));
					}
					game.cardsGotoPile(cards, () => {
						return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
					});
				},
			},
			damage: {
				audio: "swx_xuezu3",
				forced: true,
				locked: true,
				priority: 1,
				trigger: { global: "damageEnd" },
				logTarget: "player",
				filter(event, player) {
					return event.num > 0 && event.player.isAlive();
				},
				content(event, trigger, player) {
					trigger.player.addMark("swx_guihen", trigger.num, false);
					if (trigger.source === trigger.player) trigger.player.addMark("swx_guihen", trigger.num, false);
				},
			},
		},
	},
	swx_sijie: {
		audio: "swq_xinjie",
		marktext: "思",
		intro: {
			name: "思界",
			content: "本局已移除“瑰痕”标记#个",
		},
		trigger: { global: "useCardToPlayered" },
		forced: true,
		locked: false,
		// 方向A：睡死用牌指定有瑰痕的角色；方向B：有瑰痕的角色用牌指定睡死
		// 日志目标恒指向被移除瑰痕的角色
		logTarget(trigger, player) {
			return trigger.target === player ? trigger.player : trigger.target;
		},
		filter(event, player) {
			if (!event.target?.isIn() || !event.player?.isIn()) return false;
			const source = event.player, dest = event.target;
			// 只处理与睡死有关的指定：睡死指定他人，或他人指定睡死
			if (source !== player && dest !== player) return false;
			const marked = source === player ? dest : source;
			if (marked.countMark("swx_guihen") <= 0) return false;
			return !player.getStorage("swx_sijie_used", []).includes(marked);
		},
		async checkUpgrade(player) {
			while (true) {
				const removed = player.countMark("swx_sijie");
				const spent = player.countMark("swx_sijie_spent");
				if (Math.floor(removed / 8) <= spent) return;
				const gp = player.countMark("swx_sijie_gainplus");
				const vp = player.countMark("swx_sijie_viewplus");
				const controls = [], choiceList = [];
				if (vp < 4) {
					controls.push("观看牌+");
					choiceList.push(`本技能观看牌堆顶的牌+1（当前${vp}/4）`);
				}
				if (gp < 4) {
					controls.push("获得牌+");
					choiceList.push(`本技能获得的牌数量+1（当前${gp}/4）`);
				}
				if (!controls.length) {
					player.addMark("swx_sijie_spent", 1, false);
					continue;
				}
				game.log(player, "#g【思界】", "#y升级！");
				let card = get.cardPile(current => current.name === "sha" && current.nature === "sw_xue");
				if (card) {
					await player.gain(card, "gain2");
				}
				const result = await player
					.chooseControl(...controls)
					.set("prompt", `思界：本局已累计移除${removed}个“瑰痕”，请选择一项升级`)
					.set("choiceList", choiceList)
					.set("ai", () => {
						const p = get.player();
						const gp2 = p.countMark("swx_sijie_gainplus"), vp2 = p.countMark("swx_sijie_viewplus");
						if (gp2 < 4 && (gp2 <= vp2 || vp2 >= 4)) return "获得牌+";
						return "观看牌+";
					})
					.forResult();
				player.addMark("swx_sijie_spent", 1, false);
				if (result.control === "获得牌+") {
					player.addMark("swx_sijie_gainplus", 1, false);
					game.log(player, "的", "#g【思界】", "获得的牌数", "#y+1");
				} else if (result.control === "观看牌+") {
					player.addMark("swx_sijie_viewplus", 1, false);
					game.log(player, "的", "#g【思界】", "观看牌堆顶牌数", "#y+1");
				}
			}
		},
		async content(event, trigger, player) {
			// 被移除瑰痕的角色：方向A是被指定的目标，方向B是指定的来源
			const target = trigger.target === player ? trigger.player : trigger.target;
			const num = target.countMark("swx_guihen");
			target.removeMark("swx_guihen", num);
			player.addMark("swx_sijie", num, false);
			await lib.skill.swx_sijie.checkUpgrade(player);
			player.addTempSkill("swx_sijie_used");
			player.markAuto("swx_sijie_used", [target]);
			const viewNum = Math.min(num + player.countMark("swx_sijie_viewplus"), ui.cardPile.childNodes.length);
			const cards = get.cards(viewNum, true);
			if (!cards.length) return;
			await game.cardsGotoOrdering(cards);
			const gainLimit = Math.min(1 + player.countMark("swx_sijie_gainplus"), cards.length);
			const result = await player
				.chooseToMove(`思界：获得其中至多${get.cnNumber(gainLimit)}张牌，其余以任意顺序置于牌堆顶或牌堆底`, true)
				.set("list", [["牌堆顶", cards], ["牌堆底"], ["获得"]])
				.set("gainLimit", gainLimit)
				.set("filterOk", moved => moved[2].length <= get.event().gainLimit)
				.set("processAI", list => {
					const player2 = get.player();
					const cards2 = list[0][1].slice(0).sort((a, b) => get.value(b, player2) - get.value(a, player2));
					const gain = cards2.splice(0, get.event().gainLimit);
					return [cards2, [], gain];
				})
				.forResult();
			if (!result.bool) return;
			const [top, bottom, gain] = result.moved;
			if (gain.length) await player.gain(gain, "gain2");
			if (top.length) await game.cardsGotoPile(top.slice(0).reverse(), "insert");
			if (bottom.length) await game.cardsGotoPile(bottom);
		},
		ai: { threaten: 0.8 },
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	swx_shuizhi: {
		audio: "swq_shuigu",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		trigger: { global: "dying" },
		filter(event, player) {
			if (event.player == player || !event.player.isIn()) return false;
			return event.player.countMark("swx_guihen") > 0;
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const count = game.getAllGlobalHistory("everything", evt => {
				if (evt.name != "dying" || evt.player != target) {
					return false;
				}
				return true;
			}).length;
			event.result = await player
				.chooseBool(`睡桎：是否对${get.translation(target)}发动？（本局游戏其已进入濒死${count}次）`)
				.set("targetx", target)
				.set("ai", () => {
					const t = get.event()?.targetx, p = get.event()?.player;
					return get.attitude(p, t) <= 0;
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = trigger.player;
			const num = target.countMark("swx_guihen");
			if (!num) return;
			target.removeMark("swx_guihen", num);
			player.addMark("swx_sijie", num, false);
			await lib.skill.swx_sijie.checkUpgrade(player);
			const cards = get.bottomCards(num);
			if (!cards.length) return;
			await player.showCards(cards, `${get.translation(player)}发动了【睡桎】，展示了牌堆底的${get.cnNumber(cards.length)}张牌`);
			await game.cardsDiscard(cards);
			const black = cards.filter(card => get.color(card) === "black").length;
			const red = cards.filter(card => get.color(card) === "red").length;
			if (black > red) {
				const count = game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.player === target).length;
				player.line(target);
				target.when({ player: ["dyingAfter", "die"] })
				.assign({ forceDie: true })
				.filter(evt => true)
				.step(async (event2, trigger2, player2) => {
					if (trigger2.name == "die") {
						player.restoreSkill("swx_shuizhi");
						game.log(player, "重置了", "#g【睡桎】");
					}
				});
				await target.damage(count, player);
			} else {
				player.restoreSkill("swx_shuizhi");
				game.log(player, "重置了", "#g【睡桎】");
			}
		},
		ai: { expose: 0.5 },
	},
	swyc_skillcardGlobal_lose: {
		ruleSkill: true,
		systemSkill: true,
		charlotte: true,
		forced: true,
		silent: true,
		firstDo: true,
		isSkillCard(card) {
			return card && get.type(card) === "character";
		},
		getSkillId(card) {
			return card?.storage?.skill || lib.card[card?.name]?.skills?.[0];
		},
		async showCharacterCards(player) {
			if (!player?.isIn()) return;
			const cards = player.getCards("h", c => lib.skill.swyc_skillcardGlobal_lose.isSkillCard(c) && !get.is.shownCard(c));
			if (cards.length) await player.addShownCards(cards, "visible_swyc_skillcard");
		},
		// trigger: {
		// 	player: ["loseEnd", "loseAsyncEnd"],
		// },
		// filter(event, player) {
		// 	debugger
		// 	const pack = lib.skill.swyc_skillcardGlobal_lose,
		// 		hs = event.getl?.(player)?.hs;
		// 	return hs?.length && hs.some(c => pack.isSkillCard(c));
		// },
		// async content(event, trigger, player) {
		// 	debugger
		// 	const pack = lib.skill.swyc_skillcardGlobal_lose,
		// 		hs = trigger.getl(player).hs.filter(c => pack.isSkillCard(c)),
		// 		remove = [...new Set(hs.map(c => pack.getSkillId(c)).filter(sk => sk && player.hasSkill(sk, false, false, false)))];
		// 	if (remove.length) await player.removeSkills(remove);
		// },
		trigger: {
			player: ["loseBegin", "loseAsyncBegin"],
		},
		filter(event, player) {
			const pack = lib.skill.swyc_skillcardGlobal_lose,
				hs = event?.cards?.filter(card => player.getCards('h').includes(card));
			return hs?.length && hs.some(c => pack.isSkillCard(c));
		},
		async content(event, trigger, player) {
			const pack = lib.skill.swyc_skillcardGlobal_lose,
				hs = trigger.cards.filter(card => player.getCards('h').includes(card)).filter(c => pack.isSkillCard(c)),
				remove = [...new Set(hs.map(c => pack.getSkillId(c)).filter(sk => sk && player.hasSkill(sk, false, false, false)))];
			if (remove.length) await player.removeSkills(remove);
		},
	},
	swyc_skillcardGlobal_gain: {
		ruleSkill: true,
		systemSkill: true,
		charlotte: true,
		forced: true,
		silent: true,
		trigger: {
			player: ["gainAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			const pack = lib.skill.swyc_skillcardGlobal_lose,
				cards = event.getg?.(player) || [];
			return cards.some(c => get.position(c, true) === "h" && pack.isSkillCard(c));
		},
		async content(event, trigger, player) {
			const pack = lib.skill.swyc_skillcardGlobal_lose,
				cards = trigger.getg(player).filter(c => get.position(c, true) === "h" && pack.isSkillCard(c)),
				add = [...new Set(cards.map(c => pack.getSkillId(c)).filter(sk => sk && !player.hasSkill(sk, false, false, false)))];
			if (add.length) await player.addSkills(add);
		},
	},
	swyc_skillcardGlobal_show: {
		ruleSkill: true,
		systemSkill: true,
		charlotte: true,
		forced: true,
		silent: true,
		init() {
			if (!lib.skill.global.includes("swyc_skillcardGlobal_show")) game.addGlobalSkill("swyc_skillcardGlobal_show");
		},
		trigger: {
			player: ["gainAfter", "drawAfter", "loseAsyncAfter", "swapHandcardsAfter"],
		},
		filter(event, player) {
			const pack = lib.skill.swyc_skillcardGlobal_lose;
			if (event.name === "drawAfter") {
				return player.hasCard(c => pack.isSkillCard(c), "h");
			}
			if (event.name === "swapHandcardsAfter") {
				return player.hasCard(c => pack.isSkillCard(c), "h");
			}
			const cards = event.getg?.(player) || event.cards || [];
			return cards.some(c => get.position(c, true) === "h" && pack.isSkillCard(c));
		},
		async content(event, trigger, player) {
			await lib.skill.swyc_skillcardGlobal_lose.showCharacterCards(player);
		},
	},
	// swyc_skillcardGlobal_disc: {
	// 	ruleSkill: true,
	// 	systemSkill: true,
	// 	charlotte: true,
	// 	forced: true,
	// 	silent: true,
	// 	lastDo: true,
	// 	trigger: { player: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
	// 	filter(event, player) {
	// 		// debugger
	// 		// if (event.name.indexOf("lose") == 0) {
	// 		// 	if (event.getlx === false || event.position != ui.discardPile) {
	// 		// 		return false;
	// 		// 	}
	// 		// }
	// 		const pack = lib.skill.swyc_skillcardGlobal_lose;
	// 		return [...(event.cards || [])].some(c => pack.isSkillCard(c));
	// 	},
	// 	async content(event, trigger, player) {
	// 		const pack = lib.skill.swyc_skillcardGlobal_lose;
	// 		for (let card of [...(trigger.cards || [])]) {
	// 			if (!pack.isSkillCard(card)) continue;
	// 			const skillId = pack.getSkillId(card);
	// 			if (!skillId) continue;
	// 			const own = game.filterPlayer(p => p.playerid === card.storage?.ownerPi);
	// 			if (!own?.isAlive?.()) continue;
	// 			if (!own.hasSkill(skillId, false, false, false)) await own.addSkills([skillId]);
	// 		}
	// 	},
	// },
	swyc_chaoyuan: {
		skillSlot(skillName, player) {
			let nm = typeof skillName == "string" ? skillName : "",
				libInfo = nm && lib.skill[nm];
			if (libInfo?.sourceSkill) nm = libInfo.sourceSkill;
			const ord = [];
			const skills = player.getSkills(null, false, false).slice(0);
			for (let i = 0; i < skills.length; i++) {
				if (lib.skill[skills[i]] && (lib.skill[skills[i]].nopop || lib.skill[skills[i]].equipSkill)) {
					continue;
				}
				if (lib.translate[skills[i] + "_info"]) {
					ord.push(skills[i]);
				}
			}
			for (let i = 0; i < ord.length; i++) {
				const core = ord[i];
				if (nm === core || (nm.startsWith(core) && nm[core.length] === "_")) return i;
			}
			return -114514;
		},
		skillPickPool() {
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			if (!game.swyc_pingjian_skillpool || game.swyc_pingjian_skillpool?.length <= 0) {
				game.swyc_pingjian_skillpool = [];
				for (let name of (_status.characterlist || []).slice(0)) {
					if (!lib.character[name]?.[3] || /zuoci|xushao/i.test(name)) continue;
					for (let sk of lib.character[name][3]) {
						let xf = lib.skill[sk];
						if (!xf || xf.equipSkill || xf.hiddenSkill || xf.silent || xf.juexingji || xf.limited || xf.dutySkill) continue;
						if (xf.ai?.notemp || xf.ai?.neg || xf.ai?.combo) continue;
						if (game.swyc_pingjian_skillpool.includes(sk)) continue;
						let trigStr = xf.trigger ? JSON.stringify(xf.trigger) : "";
						let ok =
							xf.enable === "phaseUse" ||
							trigStr.includes("damageEnd") ||
							trigStr.includes("damageSource") ||
							trigStr.includes("damageAfter") ||
							/xinDamage|hurt|Damage\b/.test(trigStr);
						if (!ok) continue;
						game.swyc_pingjian_skillpool.push(sk);
					}
				}
			}
			return game.swyc_pingjian_skillpool || [];
		},
		createCard(name, skills, derivation = "swyc_chaoyuan") {
			if (!_status.postReconnect.swyc_skillcard) {
				_status.postReconnect.swyc_skillcard = [
					function (list) {
						for (var entry of list) {
							lib.skill.swyc_chaoyuan.createCard(entry[0], entry[1]);
						}
					},
					[],
				];
			}
			_status.postReconnect.swyc_skillcard[1].add([name, skills]);
			const skillName = skills?.[0];
			if (!lib.card["swyc_skillcard_" + skillName]) {
				if (skillName && lib.translate[skillName]) {
					lib.translate["swyc_skillcard_" + skillName] = lib.translate[skillName];
				} else if (lib.translate[skillName + "_ab"]) {
					lib.translate["swyc_skillcard_" + skillName] = lib.translate[skillName + "_ab"];
				} else {
					lib.translate["swyc_skillcard_" + skillName] = lib.translate[skillName] || skillName;
				}
				var info = lib.character[name];
				var card = {
					fullimage: true,
					image: "character:" + name,
					type: "character",
					// vanish: true,
					skills: skills,
					derivation,
					ai: {},
					equipDelay: false,
					loseDelay: false,
				};
				var str = "";
				if (skills.length) {
					str += "当你的手牌区内有此牌时，你拥有技能";
					for (var skill of skills) {
						str += "〖" + get.translation(skill) + "〗";
						str += "、";
					}
					str = str.slice(0, str.length - 1);
					str += "；";
				}
				str += "当此牌进入弃牌堆后，销毁之且技能返回至原拥有者的武将牌上。";
				lib.translate["swyc_skillcard_" + skillName + "_info"] = str;
				var append = "";
				if (skills.length) {
					for (var skill of skills) {
						if (lib.skill[skill].nobracket) {
							append +=
								'<div class="skilln">' +
								get.translation(skill) +
								'</div><div><span style="font-family: yuanli">' +
								get.skillInfoTranslation(skill) +
								"</span></div><br><br>";
						} else {
							var translation = lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2);
							append +=
								'<div class="skill">【' +
								translation +
								'】</div><div><span style="font-family: yuanli">' +
								get.skillInfoTranslation(skill) +
								"</span></div><br><br>";
						}
					}
					str = str.slice(0, str.length - 8);
				}
				lib.translate["swyc_skillcard_" + skillName + "_append"] = append;
				lib.card["swyc_skillcard_" + skillName] = card;
				game.finishCard("swyc_skillcard_" + skillName);
			}
			return "swyc_skillcard_" + skillName;
		},
		pickEquipRandom(who, armor) {
			const num = armor ? 2 : 1;
			let card = get.cardPile(c => get.type(c) === "equip" && get.equipNum(c) === num && who.canEquip(c), undefined, "random");
			if (!card) {
				card = get.cardPile(c => get.type(c) === "equip" && get.equipNum(c) === num && who.canEquip(c, true), undefined, "random");
			}
			return card;
		},
		makeSkillCard(skill, player, derivation) {
			if (!lib.skill.global.includes("swyc_skillcardGlobal_limit")) {
				game.addGlobalSkill("swyc_skillcardGlobal_limit");
			}
			const key = player.name1;
			game.broadcastAll(
				(name, skills, derivation) => {
					lib.skill.swyc_chaoyuan.createCard(name, skills, derivation);
				},
				key,
				[skill],
				derivation
			);
			const card = game.createCard("swyc_skillcard_" + skill);
			card.destroyed = function (destroyed, targetPosition, player, event) {
				if ("discardPile" == targetPosition) {
					const pack = lib.skill.swyc_skillcardGlobal_lose;
					if (!pack?.isSkillCard?.(destroyed)) return;
					const skillId = pack.getSkillId(destroyed);
					if (!skillId) return;
					const own = game.players
						.concat(game.dead || [])
						.find(p => p.playerid === destroyed.storage?.ownerPid);
					if (!own?.isAlive?.()) return;
					if (!own.hasSkill(skillId, false, false, false)) own.addSkills([skillId]);
				}
				return "discardPile" == targetPosition;
			}
			card.storage ??= {};
			card.storage.skill = skill;
			card.storage.ownerPid = player.playerid;
			return card;
		},
		getSkillList(player) {
			let order = [];
			const skills = player.getSkills(null, false, false).slice(0);
			for (let i = 0; i < skills.length; i++) {
				if (lib.skill[skills[i]] && (lib.skill[skills[i]].nopop || lib.skill[skills[i]].equipSkill)) {
					continue;
				}
				if (lib.translate[skills[i] + "_info"]) {
					order.push(skills[i]);
				}
			}
			return order;
		},
		audio: "swlu_mengyan",
		frequent: true,
		swyc_chaoyongji: true,
		init(player) {
			player.storage.swyc_last_slot_index ??= null;
			for (const sk of ["swyc_skillcardGlobal_lose", "swyc_skillcardGlobal_gain", "swyc_skillcardGlobal_show"]) {
				if (!lib.skill.global.includes(sk)) game.addGlobalSkill(sk);
			}
		},
		mark: true,
		marktext: "潮",
		intro: {
			content(storage, player) {
				const ord = [],
					lastSkill = player.storage.swyc_last_slot_index || "",
					parts = [];
				const skills = player.getSkills(null, false, false).slice(0);
				for (let i = 0; i < skills.length; i++) {
					if (lib.skill[skills[i]] && (lib.skill[skills[i]].nopop || lib.skill[skills[i]].equipSkill)) {
						continue;
					}
					if (lib.translate[skills[i] + "_info"]) {
						ord.push(skills[i]);
					}
				}
				for (const sk of ord) {
					const xf = lib.skill[sk];
					if (!xf || xf.swyc_chaoyongjisub) continue;
					const tr = get.translation(sk);
					parts.push(sk === lastSkill ? `<span style="color:yellow;font-weight:bold">${tr}</span>` : tr);
				}
				if (!parts.length) return "（暂无技能）";
				return "潮涌顺位：" + parts.join("-");
			},
		},
		trigger: { player: "phaseZhunbeiBegin" },
		async content(event, trigger, player) {
			let order = lib.skill.swyc_chaoyuan.getSkillList(player);
			const createCard = function (item, type, position, noclick, node) {
				node = ui.create.buttonPresets.vcard(get.translation(item), type, position, noclick);
				//node.node.range.innerHTML = "技能";
				node.node.range.style.bottom = "2.5px";
				node.node.range.style.width = "100%";
				node.node.range.style.right = "0%";
				node.node.range.style.textAlign = "center";
				node._link = node.link = [null, null, item];
				node._customintro = [
					node => `${get.translation(node.link[2])}`,
					node => get.skillInfoTranslation(node.link[2]),
				];
				return node;
			}
			const res = await player.chooseToMove("潮渊：是否调整技能列表顺序？").set("list", [["技能块", [order, createCard]]]).forResult();
			if (!res?.bool || !res.moved?.[0]?.length) return;
			order = res.moved[0].map(m => m[2]);
			game.broadcastAll((player, order) => {
				const skillsLast = player.skills.filter(skill => !order.includes(skill));
				player.skills = order.concat(skillsLast);
			}, player, order)
			game.log(player, "调整了技能列表顺序：", "#g" + order.map(s => get.translation(s)).join("→"));
		},
		group: ["swyc_chaoyuan_listen"],
		subSkill: {
			listen: {
				audio: "swlu_mengyan",
				//sourceSkill: "swyc_chaoyuan",
				usable(skill, player) {
					return 3;
				},
				trigger: {
					player: ["useSkill", "logSkillBegin"],
				},
				swyc_chaoyongjisub: true,
				filter(event, player) {
					if (["global", "equip"].includes(event.type)) return false;
					let src = get.sourceSkillFor(event);
					if (!src) return false;
					let xf = get.info(src);
					if (!xf || xf.charlotte || xf.equipSkill) return false;
					if (!lib.skill.swyc_chaoyuan.getSkillList(player)?.includes(src)) return false;
					if (get.info(event.skill)?.swyc_chaoyongjisub) return false;
					let slot = lib.skill.swyc_chaoyuan.skillSlot(src, player);
					if (slot < 0) return false;
					let last = lib.skill.swyc_chaoyuan.skillSlot(player.storage.swyc_last_slot_index, player);
					if (last == null || last < 0) {
						game.broadcastAll((player, slot) => {
							player.storage.swyc_last_slot_index = slot;
						}, player, src)
						return false;
					}
					if (Math.abs(slot - last) !== 1) {
						game.broadcastAll((player, slot) => {
							player.storage.swyc_last_slot_index = slot;
						}, player, src)
						return false;
					}
					event.swyc_tidal = slot > last ? "qi" : "luo";
					game.broadcastAll((player, slot) => {
						player.storage.swyc_last_slot_index = slot;
					}, player, src)
					return true;
				},
				logTarget: "targets",
				async cost(event, trigger, player) {
					const mode = trigger.swyc_tidal;
					const prompt =
						mode === "qi"
							? "潮渊·潮起：选择一名其他角色，视为对其使用水【杀】"
							: "潮渊·潮落：选择一名其他角色，其视为对你使用水【杀】";
					event.result = await player
						.chooseTarget(prompt, false, lib.filter.notMe)
						.set("ai", target => -get.attitude(get.player(), target))
						.forResult();
				},
				async content(event, trigger, player) {
					const tg = event.targets?.[0];
					if (!tg?.isIn()) return;
					const mode = trigger.swyc_tidal,
						pack = lib.skill.swyc_chaoyuan,
						sheetPick = pl => (lib.skill.swyc_chaoyuan.getSkillList(pl) || [null])[0],
						gainGuohe = async who => {
							if (!who?.isIn()) return;
							const card = get.cardPile(c => c.name === "guohe", undefined, "random");
							if (!card) return;
							who.$gain2(card);
							await who.gain(card, "gain2");
						};
					if (mode === "qi") {
						const cd = get.autoViewAs({ name: "sha", nature: "sw_shui", isCard: true }, []);
						if (!player.canUse(cd, tg, false)) return;
						const next = player.useCard(cd, tg, false);
						await next;
						const hitdmg = tg.hasHistory("damage", evtx => evtx.getParent("useCard") == next);
						if (hitdmg ? tg.isIn() && player.isIn() : player.isIn()) {
							const receiver = hitdmg ? tg : player,
								eq = pack.pickEquipRandom(receiver, hitdmg);
							if (eq) {
								receiver.$gain2(eq);
								await receiver.equip(eq);
							}
						}
					}
					else {
						const cd2 = get.autoViewAs({ name: "sha", nature: "sw_shui", isCard: true }, []);
						if (!tg.canUse(cd2, player, false)) return;
						const next = tg.useCard(cd2, player, false);
						await next;
						const tookDmg = player.hasHistory("damage", evtx => evtx.getParent("useCard") == next);
						if (!tookDmg) {
							let sid = sheetPick(tg);
							if (sid) {
								const cardsSkill = game.players.map(p => p.getCards('hejxs', function (card) {
									return get.type(card) == "character" && card?.storage?.skill == sid;
								})).flat();
								for (const card of cardsSkill) {
									game.broadcastAll((card) => {
										card.fix();
										card.remove();
										card.destroyed = true;
									}, card)
									game.log(card, "被销毁了");
								}
								await tg.removeSkills([sid]);
								let c = pack.makeSkillCard(sid, tg);
								await player.gain(c, "gain2");
							}
							// await gainGuohe(tg);
						} else {
							let sid2 = sheetPick(player);
							if (sid2) {
								const cardsSkill = game.players.map(p => p.getCards('hejxs', function (card) {
									return get.type(card) == "character" && card?.storage?.skill == sid2;
								})).flat();
								for (const card of cardsSkill) {
									game.broadcastAll((card) => {
										card.fix();
										card.remove();
										card.destroyed = true;
									}, card)
									game.log(card, "被销毁了");
								}
								await player.removeSkills([sid2]);
								let c2 = pack.makeSkillCard(sid2, player);
								await tg.gain(c2, "gain2");
							}
							// await gainGuohe(player);
						}
					}
				},
			},
		},
	},
	swyc_skillcardGlobal_limit: {
		ruleSkill: true,
		systemSkill: true,
		charlotte: true,
		forced: true,
		silent: true,
		mod: {
			maxHandcard(player, num) {
				return num - player.hasCards("h", c => lib.skill.swyc_skillcardGlobal_lose.isSkillCard(c));
			},
		},
	},
	swyc_zhuiyun: {
		audio: `${ea}swyc_lugushou:2`,
		trigger: { global: ["changeSkillsAfter", "removeSkillsAfter"] },
		filter(event, player) {
			const list = [];
			const target = event.player;
			if (lib.character[target.name]) {
				list.addArray(lib.character[target.name][3]);
			}
			if (lib.character[target.name1]) {
				list.addArray(lib.character[target.name1][3]);
			}
			if (lib.character[target.name2]) {
				list.addArray(lib.character[target.name2][3]);
			}
			return target?.isIn?.() && event.removeSkill?.length && list.length > lib.skill.swyc_chaoyuan.getSkillList(target)?.length;
		},
		getIndex(event, player) {
			if (!event.removeSkill.length) {
				return false;
			}
			return event.removeSkill;
		},
		forced: true,
		async content(event, trigger, player) {
			const victim = trigger.player;
			await victim.recover();
			const poolRaw = game.swyc_pingjian_skillpool?.filter(sk => lib.skill[sk] && !victim.hasSkill(sk, false, false, false));
			const pool = poolRaw.randomGets(Math.min(3, poolRaw.length));
			if (!pool.length) return;
			player.line(victim);
			const list = pool.map(sk => _status.skillOwner?.[sk] || "shibing");
			const result = await player
				.chooseControl(pool)
				.set("dialog", [`追云：选择一个技能加入${get.translation(victim)}的技能列表`, [list, "character"]])
				.forResult();
			const pick = result?.control;
			if (!pick || victim.hasSkill(pick, false, false, false)) return;
			await victim.addSkills([pick]);
		},
		init(player) {
			lib.skill.swyc_chaoyuan.skillPickPool();
		},
	},
	swyc_huaquan: {
		usable: 1,
		audio: `${ea}swyc_lugushou:2`,
		enable: ["chooseToUse", "phaseUse"],
		canPay(player) {
			const pack = lib.skill.swyc_huaquan;
			if (player.hasCard(card => pack.isSkillCard(card), "h")) return true;
			return player.hasCard(
				card =>
					!pack.isSkillCard(card) &&
					player.countCards("h", c => !pack.isSkillCard(c) && get.type2(c) === get.type2(card)) >= 2,
				"h"
			);
		},
		hasViewAs(event, player) {
			const evt = event || _status.event;
			const tryCard = (name, nature) => {
				const card = { name, nature };
				if (evt?.filterCard) return evt.filterCard(card, player, evt);
				return lib.filter.filterCard(card, player, evt);
			};
			for (const name of ["tao", "jiu", "shan"]) {
				if (tryCard(name)) return true;
			}
			for (const nature of lib.inpile_nature) {
				if (tryCard("sha", nature)) return true;
			}
			return false;
		},
		filter(event, player) {
			if (!player.countCards("h")) return false;
			const pack = lib.skill.swyc_huaquan;
			if (!pack.canPay(player) || !pack.hasViewAs(event, player)) return false;
			return true;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				const tryAdd = (name, nature) => {
					const card = { name, nature };
					if (!event.filterCard(card, player, event)) return;
					if (name === "sha" && nature) list.push(["基本", "", name, nature]);
					else list.push([get.translation(get.type(name)), "", name]);
				};
				for (const name of ["tao", "jiu", "shan"]) tryAdd(name);
				for (const nature of lib.inpile_nature) tryAdd("sha", nature);
				return ui.create.dialog("化泉", [list, "vcard"]);
			},
			check(button) {
				const player = get.player(),
					card = get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure");
				return player.getUseValue(card);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			prompt(links) {
				const player = get.player(),
					cost = "一张技能牌或两张同类型的手牌";
				return (
					"###化泉###<div class='text center'>将" +
					cost +
					"当作" +
					(get.translation(links[0][3]) || "") +
					"【" +
					get.translation(links[0][2]) +
					"】使用</div>"
				);
			},
			backup(links) {
				return {
					audio: "swyc_huaquan",
					filterCard(card, player) {
						const selected = ui.selected.cards;
						if (!selected.length) return true;
						if (lib.skill.swyc_huaquan.isSkillCard(selected[0])) {
							return lib.skill.swyc_huaquan.isSkillCard(card);
						}
						if (lib.skill.swyc_huaquan.isSkillCard(card)) return false;
						return get.type2(card) === get.type2(selected[0]);
					},
					selectCard() {
						const selected = ui.selected.cards;
						if (!selected.length) return [1, 2];
						if (lib.skill.swyc_huaquan.isSkillCard(selected[0])) return 1;
						return [2, 2];
					},
					position: "h",
					complexSelect: true,
					filterOk() {
						const selected = ui.selected.cards,
							n = selected.length,
							pack = lib.skill.swyc_huaquan;
						if (n === 1) return pack.isSkillCard(selected[0]);
						if (n === 2) {
							const type = get.type2(selected[0]);
							return selected.every(c => !pack.isSkillCard(c) && get.type2(c) === type);
						}
						return false;
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					popname: true,
					log: false,
					check(card) {
						const player = get.player();
						if (player.hasCard(c => lib.skill.swyc_huaquan.isSkillCard(c), "h") && lib.skill.swyc_huaquan.isSkillCard(card)) {
							return 8 - get.value(card);
						}
						return 6 - get.value(card);
					},
					async precontent(event, trigger, player) {
						player.logSkill("swyc_huaquan");
					},
				};
			},
		},
		isSkillCard(card) {
			return get.type(card) === "character";
		},
		ai: {
			order: 8,
			result: { player: 1 },
			respondSha: true,
			respondShan: true,
			respondTao: true,
			skillTagFilter(player, tag) {
				const pack = lib.skill.swyc_huaquan;
				if (!player.countCards("h")) return false;
				return pack.canPay(player) && pack.hasViewAs(_status.event, player);
			},
		},
		group: ["swyc_huaquan_boot"],
		subSkill: {
			boot: {
				sourceSkill: "swyc_huaquan",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				audio: "swyc_huaquan",
				forced: true,
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && player.hasSkill("swyc_huaquan", false, false, false);
				},
				async content(event, trigger, player) {
					//await player.changeSkills([], ["swyc_huaquan"]);
					await player.removeSkills(["swyc_huaquan"]);
					const card = lib.skill.swyc_chaoyuan.makeSkillCard("swyc_huaquan", player, "swyc_huaquan");
					await player.gain(card, "gain2");
				},
			},
		},
	},
	swyc_yongguan: {
		audio: `${ea}swyc_os:2`,
		trigger: {
			player: "dying"
		},
		filter(event, player) {
			if (!event.reason) {
				return false;
			}
			const reason = event.reason;
			return reason.name == "damage" && reason.hasNature();
		},
		forced: true,
		async content(event, trigger, player) {
			await player.recoverTo(1);
			//发动就让
			if (game.countPlayer(p => p.countGainableCards(player, 'h') > 0 && p.isMaxHp(true) && p != player)) {
				await player.useSkill({ skill: "swyc_jiurang", targets: game.filterPlayer(p => p.countGainableCards(player, 'h') > 0 && p.isMaxHp(true) && p != player) }).forResult();
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (current < 0 && get.tag(card, "natureDamage")) {
						// 属性伤害打进濒死会回到1血，降低使用意愿
						if (target.getHp() <= 1) {
							return 0;
						}
						return [0.3, 0];
					}
				}
			}
		}
	},
	// 前辈还是崭新的好女孩吗
	swyc_zhanxin: {
		audio: `${ea}swyc_os:2`,
		trigger: { global: "damageEnd" },
		filter(event) {
			return event.hasNature("fire");
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseBool(get.prompt2("swyc_zhanxin"))
				.set("ai", () => get.player().getHp() <= 2)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.damage(player, 1, "sw_shui");
			if (player.countMark("swyc_zhanxin_wenzhang") <= 0) {
				player.addSkill("swyc_zhanxin_wenzhang");
				player.addMark("swyc_zhanxin_wenzhang", 2, false);
				player.markSkillCharacter("swyc_zhanxin_wenzhang", player, `<span style="color:#40c6ff">崭新的少女·欧丝</span>`, `<span style="font-weight:bold; color:#40ff89;">纹章</span><span style="font-weight:bold; color:#feaf41;">(${player.countMark("swyc_zhanxin_wenzhang")})</span>：有角色的回合结束时，若你的手牌数不大于体力值，你摸已损失体力值张牌（至少为1，至多为5），反之，你回复1点体力。`);
				game.log(player, "获得纹章", "#y崭新的少女·欧丝", "#g(2)");
			}
			else {
				player.addMark("swyc_zhanxin_wenzhang", 1, false);
				player.markSkillCharacter("swyc_zhanxin_wenzhang", player, `<span style="color:#40c6ff">崭新的少女·欧丝</span>`, `<span style="font-weight:bold; color:#40ff89;">纹章</span><span style="font-weight:bold; color:#feaf41;">(${player.countMark("swyc_zhanxin_wenzhang")})</span>：有角色的回合结束时，若你的手牌数不大于体力值，你摸已损失体力值张牌（至少为1，至多为5），反之，你回复1点体力。`);
				game.log(player, "延时纹章", "#y崭新的少女·欧丝", `#g(${player.countMark("swyc_zhanxin_wenzhang")})`);
			}
		},
		subSkill: {
			wenzhang: {
				trigger: {
					global: "phaseEnd",
				},
				popup: false,
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.countMark("swyc_zhanxin_wenzhang") > 0;
				},
				onremove: true,
				// marktext: "崭",
				// intro: {
				// 	name: `<span style="color:#40c6ff">崭新的少女·欧丝</span>`,
				// 	content: `<span style="font-weight:bold; color:#40ff89">纹章</span><span style="font-weight:bold; color:#feaf41">(#)</span>：有角色的回合结束时，若你的手牌数不大于体力值，你摸已损失体力值张牌（至少为1，至多为5），反之，你回复1点体力。`,
				// },
				async content(event, trigger, player) {
					player.removeMark("swyc_zhanxin_wenzhang", 1, false);
					player.markSkillCharacter("swyc_zhanxin_wenzhang", player, `<span style="color:#40c6ff">崭新的少女·欧丝</span>`, `<span style="font-weight:bold; color:#40ff89;">纹章</span><span style="font-weight:bold; color:#feaf41;">(${player.countMark("swyc_zhanxin_wenzhang")})</span>：有角色的回合结束时，若你的手牌数不大于体力值，你摸已损失体力值张牌（至少为1，至多为5），反之，你回复1点体力。`);
					if (player.countMark("swyc_zhanxin_wenzhang") <= 0) {
						player.removeSkill("swyc_zhanxin_wenzhang");
					}
					game.log(player, "纹章", "#y崭新的少女·欧丝", "#b减少1回合");
					if (player.countCards('h') <= player.getHp()) {
						await player.draw(Math.max(1, Math.min(5, player.maxHp - player.getHp())));
					}
					else {
						await player.recover();
					}
				}
			},
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "fireDamage")) {
						if (get.attitude(player, target) > 0) {
							return [1, 2];
						}
						return [1, -2];
					}
				},
			},
		},

	},
	swyc_jiurang: {
		audio: `${ea}swyc_os:2`,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(p => p.countGainableCards(player, 'h') > 0 && p != player);
		},
		filterTarget(card, player, target) {
			return target.countGainableCards(player, 'h') > 0 && player != target;
		},
		selectTarget() {
			return [1, get.player()?.getHp() || 1];
		},
		multitarget: true,
		multiline: true,
		logTarget: "targets",
		async content(event, trigger, player) {
			if (!event.targets) return;
			const targets = event.targets.sortBySeat();
			//player.line(targets, "thunder");
			const toGain = [];
			const toGive = [];
			for (const target of targets) {
				const cards = target.getCards("h");
				const gainableCards = cards
					.filter(card => {
						return lib.filter.canBeGained(card, player, target);
					})
					.randomSort();
				if (gainableCards?.length) {
					toGain.push(gainableCards[0]);
					if (get.is.damageCard(gainableCards[0])) {
						toGive.push(target);
					}
				}
			}
			if (toGain.length) {
				await player.gain(toGain, "giveAuto");
			}
			await game.delayx();
			const linkNum = toGive.length;
			while (toGive.length) {
				const target = toGive.shift();
				if (!player.countGainableCards(target, "h")) continue;
				player.line(target);
				await player.chooseToGive(target, 1, true, "h");
			}
			if (linkNum > 0 && game.countPlayer(p => !p.isLinked()) > 0) {
				const result = linkNum > game.countPlayer(p => !p.isLinked()) ? { bool: true, targets: game.filterPlayer(p => !p.isLinked()) } :
					await player.chooseTarget(linkNum, "选择横置" + linkNum + "名角色", true, function (card, player2, current) {
						return !current.isLinked();
					})
						.set("ai", function (target) {
							const player2 = _status.event.player;
							return get.effect(target, { name: "tiesuo" }, player2, player2);
						})
						.forResult();
				if (result.bool) {
					const targets = result.targets.sortBySeat();
					player.line(targets, "thunder");
					for (const i of targets) {
						await i.link();
					}
					for (const player of targets) {
						const findEquipCard = slot => {
							const find = card => get.type(card, null, false) == "equip" && (!slot || get.subtype(card) == slot);
							return get.cardPile2(find, "random") || get.discardPile(find, "random");
						};
						const emptySlots = Array.from({ length: 5 }, (_, i) => i + 1)
							.filter(i => player.hasEmptySlot(i))
							.map(i => "equip" + i);

						let card = null;
						if (emptySlots.length > 0) {
							for (const slot of emptySlots) {
								card = findEquipCard(slot);
								if (card) break;
							}
						}
						if (!card) {
							card = findEquipCard();
						}
						if (!card) {
							return;
						}
						if (player.hasUseTarget(card)) {
							await player.chooseUseTarget(card, true);
						}
					}
				}
			}
		},
		//group: ["swyc_jiurang_roundStart"],
		subSkill: {
			roundStart: {
				audio: "swyc_jiurang",
				trigger: { global: "roundStart" },
				nopop: true,
				popup: false,
				slient: true,
				filter(event, player) {
					return game.hasPlayer(p => p.countGainableCards(player, 'h') > 0 && p != player);
				},
				async cost(event, trigger, player) {
					event.result = await player.chooseTarget(get.prompt2("swyc_jiurang"), [1, player.getHp() || 1], (card, player2, p) => {
						return p.countGainableCards(player2, 'h') > 0 && p != player2;
					}).set("ai", (target) => {
						const player2 = get.player();
						return -get.attitude(player2, target);
					}).forResult();
					// if (!event.targets) {
					// 	event.targets = game.filterPlayer(p => p.countGainableCards(player, 'h') > 0 && p != player);
					// }
				},
				async content(event, trigger, player) {
					await player.useSkill({ skill: "swyc_jiurang", targets: event.targets }).forResult();
				},
			},
		},
	},
	swyc_shapai: {
		audio: `${ea}swyc_os:3`,
		frequent: true,
		swyc_chaoyongji: true,
		init(player) {
			player.storage.swyc_last_slot_index ??= null;
		},
		mark: true,
		marktext: "潮",
		intro: {
			content(storage, player) {
				return lib.skill.swyc_chaoyuan.intro.content(storage, player);
			},
		},
		trigger: { player: "phaseZhunbeiBegin" },
		async content(event, trigger, player) {
			let order = lib.skill.swyc_chaoyuan.getSkillList(player);
			const createCard = function (item, type, position, noclick, node) {
				node = ui.create.buttonPresets.vcard(get.translation(item), type, position, noclick);
				//node.node.range.innerHTML = "技能";
				node.node.range.style.bottom = "2.5px";
				node.node.range.style.width = "100%";
				node.node.range.style.right = "0%";
				node.node.range.style.textAlign = "center";
				node._link = node.link = [null, null, item];
				node._customintro = [
					node => `${get.translation(node.link[2])}`,
					node => get.skillInfoTranslation(node.link[2]),
				];
				return node;
			}
			const res = await player.chooseToMove("沙排：是否调整技能列表顺序？").set("list", [["技能块", [order, createCard]]]).forResult();
			if (!res?.bool || !res.moved?.[0]?.length) return;
			order = res.moved[0].map(m => m[2]);
			game.broadcastAll((player, order) => {
				const skillsLast = player.skills.filter(skill => !order.includes(skill));
				player.skills = order.concat(skillsLast);
			}, player, order)
			game.log(player, "调整了技能列表顺序：", "#g" + order.map(s => get.translation(s)).join("→"));
		},
		group: ["swyc_shapai_listen"],
		global: ["swyc_shapai_mod"],
		subSkill: {
			listen: {
				audio: "swyc_shapai",
				usable(skill, player) {
					return 3;
				},
				trigger: {
					player: ["useSkill", "logSkillBegin"],
				},
				swyc_chaoyongjisub: true,
				filter(event, player) {
					return lib.skill.swyc_chaoyuan.subSkill.listen.filter(event, player);
				},
				logTarget: "targets",
				async cost(event, trigger, player) {
					const mode = trigger.swyc_tidal;
					const options = mode === "qi"
						? ["摸两张牌", "视为对对方使用一张水属性【决斗】"]
						: ["获得的下两张牌视为无次数限制的火【杀】", "横置并重铸两张牌，若重铸的两张牌类型相同，则受到你造成的1点水属性伤害"];
					const prompt = mode === "qi"
						? "沙排·潮起：选择一名其他角色并执行一项，然后其执行另一项"
						: "沙排·潮落：选择一名其他角色并执行一项，然后其执行另一项";
					const result = await player
						.chooseButtonTarget({
							createDialog: [
								prompt,
								[options, "textbutton"],
							],
							selectButton: 1,
							selectTarget: 1,
							filterButton: true,
							filterTarget: lib.filter.notMe,
							ai1(button) {
								if (ui.selected.targets.length == 0) return 0;
								const target = ui.selected.targets[0];
								const player = get.player();
								if (button.link == "摸两张牌") {
									return player.countCards("h") >= target.countCards("h");
								}
								if (button.link == "视为对对方使用一张水属性【决斗】") {
									return player.countCards("h") < target.countCards("h");
								}
								if (button.link == "横置并重铸两张牌，若重铸的两张牌类型相同，则受到你造成的1点水属性伤害") {
									return !player.isLinked() && game.countPlayer(p => p.isLinked() && get.attitude(player2, p) > 0) < game.countPlayer(p => p.isLinked() && get.attitude(player2, p) <= 0);
								}
								return 1;
							},
							ai2(target) {
								// const button = ui.selected.buttons[0];
								// if (!button) return 0;
								// const player2 = get.player();
								// if (mode === "qi") {
								// 	// 潮起：摸牌→队友，决斗→敌人
								// 	return button.link === options[0]
								// 		? get.attitude(player2, target)
								// 		: -get.attitude(player2, target);
								// } else {
								// 	// 潮落：火杀→敌人，横置→队友
								// 	return button.link === options[0]
								// 		? -get.attitude(player2, target)
								// 		: get.attitude(player2, target);
								// }
								// 始终指向敌人
								return -get.attitude(get.player(), target)
							},
						})
						.forResult();
					if (result.bool && result.targets?.length) {
						event.result = { bool: true, targets: result.targets, cost_data: options.indexOf(result.links?.[0]) };
					} else {
						event.result = { bool: false };
					}
				},
				async content(event, trigger, player) {
					const target = event.targets?.[0];
					if (!target?.isIn()) return;
					if (typeof swTool.playSkillVideo === "function") {
						game.broadcastAll(function () {
							swTool.playSkillVideo("ousi", 2500);
						})
						await game.delay(0, 2500);
					}
					let player1 = player, player2 = target;
					if (event.cost_data == 1) {
						[player1, player2] = [player2, player1];
					}
					if (trigger.swyc_tidal === "qi") {
						await player1.draw(2);
						const card = get.autoViewAs({ name: "juedou", nature: "sw_shui", isCard: true }, []);
						if (!player2.canUse(card, player1, false)) return;
						const next = player2.useCard(card, player1, false).set("nature", "sw_shui");
						player2.when({
							global: ["damageBegin1", "useCardEnd"],
						})
							.filter(evt => {
								debugger
								return evt.card === next.card
							})
							.step(async (event2, trigger2, player2) => {
								debugger
								if (trigger2.name == "useCard") return;
								trigger2.nature = trigger2.nature ? trigger2.nature + lib.natureSeparator + "sw_shui" : "sw_shui";
							});
						// player1.when("useCard1")
						// 	.filter(evt => evt.card === next.card)
						// 	.step(async (event2, trigger2, player2) => {
						// 		event2.customNature = "sw_shui";
						// 	});
						await next;
					}
					else {
						player1.addSkill("swyc_shapai_fskill");
						player1.addMark("swyc_shapai_fskill", 2, false);
						player1.markSkill("swyc_shapai_fskill");

						if (!player2.isLinked()) await player2.link();
						const result = await player2.chooseCard("hej", "沙排：重铸两张牌", 2, true, lib.filter.cardRecastable)
							.set("ai", card => {
								const evt = get.event();
								const selected = ui.selected.cards.concat(card);
								if (selected.length < 2) return 6 - get.value(card);
								return (get.type(selected[0]) === get.type(selected[1]) ? -1 : 1) * (player.hasSkill("swyc_yongguan") ? -1 : 1);
							})
							.forResult();
						if (result.bool && result?.cards?.length) {
							await player2.recast(result.cards);
						}
						if (!result?.cards?.length || result.cards.length == 1 || get.type2(result.cards[0]) == get.type2(result.cards[1])) {
							await player2.damage(1, player, "sw_shui");
						}
					}

				},
			},
			fskill: {
				onremove: true,
				charlotte: true,
				forced: true,
				popup: false,
				marktext: "排",
				intro: {
					content: "获得的下#张牌视为无次数限制的火【杀】",
				},
				trigger: { player: ["gainAfter", "loseAfter", "loseAsyncAfter"] },
				filter(event, player) {
					if (event.name === "gain") {
						return player.countMark("swyc_shapai_fskill") > 0;
					}
					return event.cards?.some(c => c.hasGaintag("swyc_shapai"));
				},
				async content(event, trigger, player) {
					if (trigger.name === "gain") {
						let remain = player.countMark("swyc_shapai_fskill") || 0;
						for (const card of trigger.cards) {
							if (remain <= 0) break;
							if (get.position(card) === "h") {
								player.addGaintag(card, "swyc_shapai");
								remain--;
							}
						}
						player.setMark("swyc_shapai_fskill", remain);
						player.updateMarks("swyc_shapai_fskill");
						if (remain <= 0) player.removeSkill("swyc_shapai_fskill");
					}
					else {
						player.removeGaintag("swyc_shapai", event.cards);
						if (!player.getCards("h").some(c => c.hasGaintag("swyc_shapai"))) {
							player.removeSkill("swyc_shapai_fskill");
						}
					}
				},
			},
			mod: {
				charlotte: true,
				forced: true,
				mod: {
					cardname(card, player) {
						if (card?.hasGaintag && card.hasGaintag("swyc_shapai") && get.position(card) === "h") return "sha";
					},
					cardnature(card, player) {
						if (card?.hasGaintag && card.hasGaintag("swyc_shapai") && get.position(card) === "h") return "fire";
					},
					cardUsable(card) {
						if (card.cards?.some(card => card.hasGaintag("swyc_shapai") && get.position(card) === "h")) {
							return Infinity;
						}
					},
				},
			}
		},
	},


	_sw_xue_skill: {//--------血杀
		trigger: {
			source: 'damageSource',
		},
		forced: true,
		ruleSkill: true,
		popup: false,
		shaRelated: true,
		filter: function (event, player) {
			return event.hasNature('sw_xue') && event.num > 0;
		},
		async content(event, trigger, player) {
			await player.recover();
			const bool = await player.chooseBool()
				.set("prompt", "是否对自己造成1点伤害，然后摸1张牌且本回合出杀次数+1？")
				.set("ai", () => {
					if (_status.currentPhase === player) {
						if (
							player.getHp() >= 2 &&
							player.hasCard(i => {
								let name = get.name(i, player);
								return name === "sha";
							})
						) return true;
						return false;
					}
					else {
						return player.countCards("h") <= 3
					}
				})
				.forResultBool()
			if (bool) {
				game.log(player, "发动了", "【血祭】");
				await player.popup("血祭", "sw_xue")
				await player.damage(player)
				await player.draw()
				await player.addTempSkill("sw_xuesha_buff")
				player.storage.sw_xuesha_buff++;
				player.updateMarks("sw_xuesha_buff");
			}
		},
	},
	sw_xuesha_buff: {
		charlotte: true,
		mark: true,
		direct: true,
		intro: {
			content: "出杀次数+#",
		},
		init(player, skill) {
			if (!player.storage[skill]) player.storage[skill] = 0;
		},
		onremove: true,
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") return num + player.storage.sw_xuesha_buff;
			},
		},
	},
	_sw_shui_skill: {//--------水属性伤害
		trigger: { source: 'damageBegin1' },
		forced: true,
		ruleSkill: true,
		shaRelated: true,
		lastDo: true,
		popup: false,
		filter(event, player) {
			return event.hasNature('sw_shui') && event.num > 0 && event.player.countCards("e") > 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			let result;
			if (!target.countDiscardableCards(target, "e")) result = { index: 1 };
			else
				result = await target
					.chooseControl()
					.set("choiceList", ["弃置装备区所有牌", "令此伤害+1"])
					.set("ai", () => {
						const player = get.event("player"),
							trigger = get.event().getTrigger();
						if (
							player.getHp() <= 2 ||
							player.getDiscardableCards(player, "e").reduce((sum, card) => {
								return sum + get.value(card, player);
							}, 0) < 7
						)
							return 0;
						return 1;
					})
					.forResult();
			if (result.index == 0) {
				await target.discard(target.getDiscardableCards(target, "e"));
			} else trigger.increase("num");
		}
	},


































	sw_shangzhuo: {
		audio: ["dcjinjin"],
		trigger: { player: "damageEnd" },
		unique: true,
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		content: function () {
			"step 0";
			var list;
			if (_status.characterlist) {
				list = [];
				for (var i = 0; i < _status.characterlist.length; i++) {
					var name = _status.characterlist[i];
					list.push(name);
				}
			} else if (_status.connectMode) {
				list = get.charactersOL(function (i) {
					return false;
				});
			} else {
				list = get.gainableCharacters(function (info) {
					return true;
				});
			}
			var players = game.players.concat(game.dead);
			for (var i = 0; i < players.length; i++) {
				list.remove(players[i].name);
				list.remove(players[i].name1);
				list.remove(players[i].name2);
			}
			// var dialog=ui.create.dialog();
			// dialog.add([list.randomGets(5),'character']);
			player
				.chooseButton(true)
				.set("ai", function (button) {
					return get.rank(button.link, true) - lib.character[button.link][2];
				})
				.set("createDialog", ["将武将牌替换为一名角色", [list.randomGets(player.countCards("h") + 1), "character"]]);//改为X张
			player.awakenSkill("sw_shangzhuo");
			"step 1";
			player.disableJudge();
			player.reinitCharacter(get.character(player.name2, 3).includes("sw_shangzhuo") ? player.name2 : player.name1, result.links[0]);
			if (3 - player.maxHp > 0) player.gainMaxHp(3 - player.maxHp);
			else if (player.maxHp - 3 > 0) player.loseMaxHP(player.maxHp - 3);
			player.recover();
		},
	},
	sw_heping: {
		audio: ["dcjinjin"],
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		logTarget: function () {
			return game.filterPlayer(function (current) {
				return !current.hasSkill("sw_heping_1");
			});
		},
		onremove: true,
		content: function () {
			var targets = lib.skill.sw_heping.logTarget().sortBySeat();
			for (var target of targets) {
				player.line(target);
				target.addSkill("sw_heping_1");
			}
			game.delayx();
		},
		mod: {
			ignoredHandcard: function (card, player) {
				if (get.suit(card, player) == "diamond") return true;
			},
		},
		subSkill: {
			1: {
				charlotte: true,
				mark: true,
				marktext: "和",
				intro: {
					name: "和平",
					content: "你的♠牌和♠判定牌的花色视为♥，♣牌和♣判定牌的花色视为♦",
				},
				mod: {
					suit(card, suit) {
						if (suit == "spade") return "heart";
						if (suit == "club") return "diamond";
					},
				},
			},
		},
	},
	sw_gugu: {
		audio: ["dchaochong", 2],
		trigger: {
			global: "phaseBefore",
			player: ["phaseJieshuBegin", "enterGame"],
		},
		filter: function (event, player, name) {
			if (player.hasJudge("lebu")) return false;
			return (event.name != "phase" || game.phaseNumber == 0 || name == "phaseJieshuBegin") && player.countCards("hes", { suit: "diamond" }) > 0;
		},
		locked: false,
		discard: false,
		delay: false,
		prepare: "throw",
		position: "he",
		//filterCard: function (card, player, event) {
		//	return get.suit(card) == "diamond" && player.canAddJudge({ name: "lebu", cards: [card] });
		//},
		content() {
			"step 0";
			player.chooseCard("hes", "【咕咕】：选择一张♦牌当做【乐不思蜀】置入你的判定区", (card, player) => {
				return get.suit(card) == "diamond" && player.canAddJudge({ name: "lebu", cards: [card] });
			});
			"step 1";
			if (result.bool) {
				player.$throw(result.cards[0]);
				player.addJudge({ name: "lebu" }, result.cards[0]);
			}
			else event.finish();
			"step 1";
			player.draw(1);
		},
		group: ["sw_gugu_1"],
		subSkill: {
			1: {
				audio: ["dchaochong", 2],
				trigger: { target: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					return player.countCards("j") && event.targets.length == 1;
				},
				content: function () {
					trigger.getParent().excluded.add(player);
				},
			},
		},
	},

	sw_tonghun: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget('选择一名角色与其获得“同婚”标记<br>且其回复体力后你回复等量体力，其摸牌后你摸等量牌', lib.filter.notMe).set('ai', target => {
				return get.attitude(_status.event.player, target)
			}).forResult()
		},
		init(player) {
			player.storage.sw_tonghunTargets = []
			//game.addGlobalSkill('sw_caibu')
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				target.addMark('sw_tonghun', 1)
				player.markCharacter(target.name)
				player.storage.sw_tonghunTargets.push(target)
			}
			player.addMark('sw_tonghun', 1)
			player.addSkill('sw_tonghun_xianfu')
		},
		onreset(player) {
			game.players.forEach(current => {
				current.clearMark('sw_tonghun')
				current.unmarkSkill('sw_tonghun')
			})
			player.remove('sw_tonghun_xianfu')
		},
		onremove(player) {
			game.removeGlobalSkill('sw_caibu')
			game.players.forEach(current => {
				current.clearMark('sw_tonghun')
				current.unmarkSkill('sw_tonghun')
			})
			player.remove('sw_tonghun_xianfu')
		},
		mark: true,
		marktext: "嫁",
		intro: {
			name: "同婚",
			content(err, player) {
				return `同婚标记个数为${player.countMark('sw_tonghun')}`
			},
			markcount(err, player) {
				return `${player.countMark('sw_tonghun')}`
			}
		},
	},
	sw_renjie_mark: {
		//mark: true,
		direct: true,
		marktext: "精",
		intro: {
			name: "精气",
			content: function (storage, player) {
				return get.translation(player.name) + "通过戒鹿获得的精气，手牌上限+" + player.countMark("sw_renjie_mark");
			},
		},
		onremove: true,
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("sw_renjie_mark");
			},
		},
	},
	sw_renjie: {
		audio: ["dchaochong", 2],
		init: player => {
			player.addSkill("sw_renjie_mark");
		},
		trigger: { source: "damageBegin4" },
		forced: true,
		content() {
			player.addMark("sw_renjie_mark", Math.min((5 - player.countMark("sw_renjie_mark")), trigger.num * 2));
			trigger.cancel();
		},
		group: ["sw_renjie_1"],
		subSkill: {
			1: {
				audio: ["dchaochong", 2],
				trigger: { player: "damageBegin3" },
				forced: true,
				content() {
					if (trigger.num > 2) trigger.num = 2;
					player.addMark("sw_renjie_mark", Math.min((5 - player.countMark("sw_renjie_mark")), 1));
					player.logSkill("sw_renjie");
				},
			},
		}
	},
	sw_sanyang: {
		audio: ["dchaochong", 2],
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return player.hasMark("sw_renjie_mark") && player.countMark("sw_renjie_mark") >= 1;
		},
		content: function () {
			player.removeMark("sw_renjie_mark", 1);
			trigger.targets.length = 0;
			trigger.getParent().triggeredTargets1.length = 0;
		},
	},
	sw_luguan: {
		audio: ["dcjinjin", 2],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasMark("sw_renjie_mark") && player.countMark("sw_renjie_mark") >= 1;
		},
		skillAnimation: true,
		animationColor: "ice",
		filterTarget: function (card, player, target) {
			return target != player;
		},
		content() {
			"step 0";
			event.num3 = player.countMark("sw_renjie_mark");
			event.num = player.countMark("sw_renjie_mark");
			player.removeMark("sw_renjie_mark", event.num);
			event.num2 = event.num * 2 + Math.floor(Math.random() * (15 - 4 + 1)) + 4;
			event.time = get.utc();
			event.num = 0;
			"step 1";
			player.chooseBool("是否继续鹿关？").ai = function () {
				return true;
			};
			event.num++;
			"step 2";
			if (result.bool && event.num < event.num2) event.goto(1);
			else if (result.bool && event.num >= event.num2) event.goto(3);
			else {
				game.log(player, "鹿关总次数：" + event.num);
				game.log(player, "鹿关失败...阳气散尽...");
				event.finish();
			}
			"step 3";
			game.log(player, "鹿关总次数：" + event.num);
			game.log(player, "鹿关成功！");
			game.log(player, "鹿关总时长：" + Math.round((get.utc() - event.time) / 100) / 10 + "s");
			player.line(target);
			player.logSkill("对着TA鹿关了！", target);
			target.damage("fire", Math.max(0, Math.min(Math.round(event.num3 * (event.num2 / 8) / (Math.round((get.utc() - event.time) / 100) / 10)), 2)), "nocard");
			player.addMark("sw_luguan_mark", 1);
			//获得技能
			if (target.hasSex("female")) {
				if (!target.hasSkill("sw_haixiu")) target.addSkill("sw_haixiu");
			}
			else {
				if (!target.hasSkill("sw_fenmen")) target.addSkill("sw_fenmen");
			}
			"step 4";
			if (player.countMark("sw_luguan_mark") >= 3) {
				player.die();
			}
		},
		subSkill: {
			mark: {
				direct: true,
				marktext: "鹿",
				intro: {
					name: "鹿关",
					content: "当前鹿关次数#",
				},
			},
		},
	},
	sw_haixiu: {
		forced: true,
		trigger: { player: "gainAfter" },
		logTarget: "player",
		content() {
			player.addMark("sw_haixiu_mark", trigger.cards.length);
			if (player.countMark("sw_haixiu_mark") >= 8) {
				var num = Math.floor(player.countMark("sw_haixiu_mark") / 8);
				player.loseHp(num);
				player.removeMark("sw_haixiu_mark", num * 8);
			}
		},
		group: ["sw_haixiu_mark"],
		subSkill: {
			mark: {
				mark: true,
				direct: true,
				marktext: "羞",
				intro: {
					name: "害羞",
					content: "mark",
				},
			},
		},
	},
	sw_fenmen: {
		forced: true,
		trigger: { source: "damageEnd" },
		logTarget: "player",
		content() {
			player.addMark("sw_fenmen_mark", trigger.num);
			if (player.countMark("sw_fenmen_mark") >= 3) {
				var num = Math.floor(player.countMark("sw_fenmen_mark") / 3);
				player.loseHp(num);
				player.removeMark("sw_fenmen_mark", num * 3);
			}
		},
		group: ["sw_fenmen_mark"],
		subSkill: {
			mark: {
				mark: true,
				direct: true,
				marktext: "愤",
				intro: {
					name: "愤懑",
					content: "mark",
				},
			},
		},
	},
	sw_xinhuo: {
		init: function (player) {
			player.storage.cnt = 0;
			//player.syncStorage("cnt");
		},
		audio: ["dcjinjin", 2],
		trigger: {
			player: "useCardEnd",
		},
		forced: true,
		content: function () {
			player.addMark("sw_xinhuo_mark", 1);
			if (!(player.countMark("sw_xinhuo_mark") % 2)) {
				var skills = game.filterSkills(
					player.getStockSkills(true, true).filter(skill => {
						const info = get.info(skill);
						return !info.persevereSkill || !info.charlotte;
					}),
					player
				);
				var num = 1;
				skills = skills.slice(0, num);
				if (skills[0] == "sw_xinhuo") player.loseMaxHp();
				player.disableSkill("sw_xinhuo", skills);
				player.addTempSkill("sw_xinhuo_restore");
				player.storage.cnt += 1;
				//player.syncStorage("cnt");
				var str = "";
				for (var i of skills) {
					str += "【" + get.translation(i) + "】、";
					player.popup(i);
				}
				str = str.slice(0, -1);
				game.log(player, "的技能", "#g" + str, "失效了");
				player.draw(player.storage.cnt);
			}
		},
		subSkill: {
			restore: {
				charlotte: true,
				forced: true,
				popup: false,
				onremove: function (player) {
					player.enableSkill("sw_xinhuo");
					player.storage.cnt = 0;
					game.log(player, "恢复了技能");
					player.removeMark("sw_xinhuo_mark", player.countMark("sw_xinhuo_mark"));
				},
			},
			mark: {
				direct: true,
				marktext: "火",
				intro: {
					name: "心火",
					content: "本回合使用牌数#",
				},
			},
		},
	},
	sw_shangshi: {
		audio: ["dchaochong", 2],
		trigger: { player: "phaseJieshuBegin" },
		init: function (player) {
			if (!player.storage.sw_shangshi) player.storage.sw_shangshi = [3, 3];
		},
		getInfo: function (player) {
			if (!player.storage.sw_shangshi) player.storage.sw_shangshi = [3, 3];
			return player.storage.sw_shangshi;
		},
		broadcast(card) {
			game.broadcast(
				(card, storage) => {
					card.storage = storage;
				},
				card,
				card.storage
			);
		},
		//recordGuPiao: function (player, target, color, num) {
		//	if (!player.storage.sw_shangshi_record) player.storage.sw_shangshi_record = {};
		//	if (!player.storage.sw_shangshi_record.target) player.storage.sw_shangshi_record.target = {red: 0,black: 0};

		//	if (color == "red") player.storage.sw_shangshi_record.target.red += num;
		//	else player.storage.sw_shangshi_record.target.black += num;
		//	//alert(player.storage.sw_shangshi_record.target.red);
		//},
		filter: function (event, player) {
			return player.countCards("he") && player.maxHp > 0;
		},
		content: function* (event, map) {
			"step 0";
			var player = map.player;
			var list = lib.skill.sw_shangshi.getInfo(player);
			var num = list[0];
			var result = yield player
				.chooseCard(get.prompt("sw_shangshi"), "将至多" + get.cnNumber(num) + "张牌称为“股”置于武将牌上并摸等量的牌或取消可以选择进行判定", "he", [1, num])
				.set("complexCard", true)
				.set("triggerName", event.triggername);
			if (result.bool) {
				player.logSkill("sw_shangshi");
				for (var k of result.cards) {
					//k.storage.sw_shangshi_hidden = true;
					//投股记录
					//lib.skill.sw_shangshi.recordGuPiao(player, player, get.color(k), 1);

					var color = get.color(k);
					//if (!player.storage.sw_shangshi_record) player.storage.sw_shangshi_record = {};
					//if (!player.storage.sw_shangshi_record.player) player.storage.sw_shangshi_record.player = { red: 0, black: 0 };
					//if (color == "red") player.storage.sw_shangshi_record.player.red += 1;
					//else player.storage.sw_shangshi_record.player.black += 1;
					if (!player.storage.sw_shangshi_record) player.storage.sw_shangshi_record = 0;
					if (color == "red") player.storage.sw_shangshi_record += 1;
				}
				//alert(player.storage.sw_shangshi_record.player.red);

				//player.$throw(result.cards, 1000);
				player.lose(result.cards, ui.cardPile, "insert");
				game.log(player, "将" + get.cnNumber(result.cards.length) + "张牌置于了牌堆顶");
				player.addToExpansion(result.cards, player, "draw").gaintag.add("sw_shangshi");

				player.draw(result.cards.length);
				if (player.hujia == 0) player.changeHujia();

				event.finish();
			}
			else event.goto(1);
			"step 1";
			result.bool = player.chooseBool("是否进行一次判定并将判定牌称为“股”置于武将牌上");
			"step 2";
			if (result.bool) {
				player.logSkill("sw_shangshi");
				player.judge(card => 1).callback = lib.skill.sw_shangshi.callback;
			}
		},
		callback: function () {
			if (typeof card.number == "number") {

				if (!card.storage) card.storage = {};
				card.storage.sw_shangshi_hidden = true;
				lib.skill.sw_shangshi.broadcast(card);

				player.addToExpansion(card, "gain2").gaintag.add("sw_shangshi");
				player.popup("判定生效", "wood");
			}
		},
		marktext: "股",
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				const cards = player.getExpansions("sw_shangshi"),
					hidden = cards.filter(card => !card.storage.sw_shangshi_hidden),
					dis = cards.removeArray(hidden);
				dialog.addText("股票形势");
				if (dis.length) dialog.addSmall(dis);
				else dialog.addText("暂无明股");
				if (hidden.length) {
					return "此外，还有" + get.cnNumber(hidden.length) + "张暗“股”，在无形间改变股票形势";
				}
			},
			content(content, player) {
				const cards = player.getExpansions("sw_shangshi"),
					hidden = cards.filter(card => card.storage.sw_shangshi_hidden),
					dis = cards.removeArray(hidden);
				dialog.addText("股票形势");
				if (dis.length) dialog.addSmall(dis);
				else dialog.addText("暂无明股");
				if (hidden.length) {
					return "此外，还有" + get.cnNumber(hidden.length) + "张暗“股”，在无形间改变股票形势";
				}
			},
		},
		onremove: function (player, skill) {//失去技能时失去所有的股票牌
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
			player.storage.sw_shangshi_record = {};
		},
		group: ["sw_shangshi_1", "sw_shangshi_2"],
		subSkill: {
			1: {
				forced: true,
				trigger: { global: "phaseZhunbeiBegin" },
				popup: false,
				filter(trigger, player) {
					return trigger.player !== player && player.getExpansions("sw_shangshi").length;
				},

				async content(event, trigger, player) {
					const target = trigger.player
					player.logSkill("sw_shangshi");
					player.line(trigger.player);
					var num = lib.skill.sw_shangshi.getInfo(player)[1];
					var list = [], choiceList = ["将一张牌称为“股”置于" + get.translation(player) + "的武将牌上", "失去" + num + "点体力"];
					if (game.hasPlayer(target => target.countCards("he"))) list.push("入“股”");
					else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
					list.push("失去体力");
					var str = "";
					for (var i of list) {
						str += i;
						str += "、";
					}
					str = str.slice(0, -1);
					list = list.filter(control => {
						if (control == "失去体力") return true;
						return target.countDiscardableCards(target, "he");
					});


					const {
						result: { control },
					} = await target.chooseControl(list)
						.set("prompt", "【上市②】：请选择一项")
						.set(
							"choiceList",
							choiceList.map(str => str)
						)
						.set("target", target);
					switch (control) {
						case "入“股”":
							const {
								result: { bool, cards },
							} = await trigger.player.chooseCard("he", choiceList[0], true);
							if (bool) {
								//target.$throw(cards, 1000);
								target.lose(cards, ui.cardPile, "insert");
								game.log(target, "将" + get.cnNumber(cards.length) + "张牌置于了牌堆顶");
								player.addToExpansion(cards, target, "draw").gaintag.add("sw_shangshi");
								//投股记录
								for (var k of cards) {
									var color = get.color(k);
									if (!target.storage.sw_shangshi_record) target.storage.sw_shangshi_record = 0;
									if (color == "red") target.storage.sw_shangshi_record += 1;
								}
							}
							break;
						case "失去体力":
							target.loseHp(num);
							break;
					}
					player.judge(card => 1).callback = lib.skill.sw_shangshi.callback;
				},
			},
			2: {
				forced: true,
				mod: {
					maxHandcard: function (player, num) {
						return num + lib.skill.sw_shangshi.getInfo(player)[0];
					},
				},
			},
		},
	},
	sw_kaipan: {
		audio: ["dcjinjin", 2],
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(trigger, player) {
			return player.getExpansions("sw_shangshi").length;
		},
		content: function () {
			"step 0";
			player
				.chooseControl("<span class=firetext>涨涨涨</span>", "<span class=greentext>跌跌跌</span>")
				.set("prompt", "请预测股票：")
				.set("ai", function () {
					return Math.Random();
				});
			"step 1";
			event.boolGuPiao = (result.control == "<span class=firetext>涨涨涨</span>");
			//alert(event.boolGuPiao);
			var cards = player.getExpansions("sw_shangshi");
			var zhang = 0, die = 0;
			for (var k of cards) {
				if (get.color(k) == "red") zhang += get.number(k);
				if (get.color(k) == "black") die += get.number(k);
			}
			var res = zhang > die;
			event.boolRes = res;
			var str = `${get.translation(player)}的股票开盘！！：<br>涨幅度：<span class=firetext>${zhang}</span>  跌幅度：<span class=greentext>${die}</span><br>预测结果：${res == event.boolGuPiao ? "<span class=greentext>正确！</span>" : "<span class=firetext>错误！</span>"}`;
			//var dialog = ui.create.dialog(str, cards, true);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (ss, cards, id) {
					var dialog = ui.create.dialog(ss, cards, true);
					dialog.videoId = id;
				},
				str,
				cards,
				event.videoId
			);
			game.delay(7);
			"step 2";
			game.broadcastAll('closeDialog', event.videoId);
			var targets = game.filterPlayer().sortBySeat(player);
			for (var k of targets) {
				if (k.storage.sw_shangshi_record) {
					if (event.boolRes) k.draw(2 * k.storage.sw_shangshi_record);
					else k.loseHp(k.storage.sw_shangshi_record);
				}
				k.storage.sw_shangshi_record = 0;
			}
			if (event.boolGuPiao == event.boolRes) {
				if (event.boolRes) {
					player.addTempSkill("dcjinjing");
					player.addTempSkill("sw_ziben");
				}
				else {
					player.recover();
					player.addTempSkill("fankui", { player: "phaseZhunbeiBegin" });
				}
			}
			else {
				var list = lib.skill.sw_shangshi.getInfo(player);
				var index = 0;
				if (!event.boolRes) index = 1;
				list[index] = Math.max(0, list[index] - 1);
				game.log(player, "将【上市", index == 0 ? "①" : "②", "】数字改为", "#y" + list[index]);
				player.markSkill("sw_shangshi");
			}
			"step 3";
			var cards = player.getExpansions("sw_shangshi");
			if (cards.length) {
				player.loseToDiscardpile(cards);

				for (var card of cards) {
					if (card && card.storage) {
						card.storage.sw_shangshi_hidden = false;
						lib.skill.sw_shangshi.broadcast(card);
					}
				}

				//game.broadcastAll(function (c) {
				//	for(var k of c){
				//		c.storage.sw_shangshi_hidden = false;
				//	}
				//}, cards);
			}

		},
	},
	sw_ziben: {
		trigger: { source: "damageEnd" },
		logTarget: "player",
		frequent: true,
		forced: false,
		filter: function (event, player) {
			if (event._notrigger.includes(event.player)) return false;
			return event.player != player && event.player.isIn() && event.player.countGainableCards(player, "hej") > 0;
		},
		check: function () {
			return false;
		},
		content: function () {
			player.gainPlayerCard(trigger.player, "he", false);
			player.line(trigger.player, "green");
		},
	},
	sw_tongpin2: {
		//audio: 2,
		group: ["sw_tongpin2_0", "sw_tongpin2_1", "sw_tongpin2_2", "sw_tongpin2_3"],
		subSkill: {
			0: {
				trigger: { global: "damageBegin3" },
				filter(event, player) {
					if (player.hasSkill("sw_tongpin2_round")) return false;
					return event.player && event.player.isIn() && event.player.hasMark("sw_tongpin_mark") && player.countCards("he") >= event.num;
				},
				forced: true,
				async content(event, trigger, player) {
					//"step 0";
					const num = trigger.num;
					const {
						result: { bool },
					} = await player.chooseToDiscard("he", num, get.prompt("sw_tongpin2", trigger.target), "弃置" + num + "张牌，并转移" + num + "点伤害给自己");
					//"step 1";
					if (bool) {
						player.discard(event.cards);
						player.damage(trigger.source ? trigger.source : "nosource");
						player.line(trigger.player);
						player.addTempSkill("sw_tongpin2_round", "roundStart");
						trigger.cancel();
					}
				},
			},
			1: {
				trigger: { global: "damageEnd" },
				filter(event, player) {
					return event.player && event.player.isIn() && event.player.hasMark("sw_tongpin_mark");
				},
				forced: true,
				logTarget: "player",
				content() {
					//trigger.player.recover(trigger.player.countMark("sw_tongpin_mark"));
					if (!player.hasSkill("sw_tongpin2_round")) {
						player.recover(trigger.player.countMark("sw_tongpin_mark"));
						player.addTempSkill("sw_tongpin2_round", "roundStart");
					}
					trigger.player.removeMark("sw_tongpin_mark", trigger.player.countMark("sw_tongpin_mark"));
					trigger.player.removeSkill("sw_tongpin_mark");
					if (player.isTurnedOver()) player.turnOver(false);
					player.removeSkill("sw_tongpin2");
					player.line(trigger.player);
				},
			},
			2: {
				trigger: {
					player: "turnOverBefore",
				},
				forced: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current.hasMark("sw_tongpin_mark");
					});
				},
				content() {
					//player.logSkill("sw_tongpin");
					trigger.cancel();
				},
			},
			3: {
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current.hasMark("sw_tongpin_mark");
					});
				},
				content() {
					//player.logSkill("sw_tongpin");
					trigger.cancel();
				},
			},
			round: {
				mark: true,
				marktext: "守",
				intro: { name: "同嫁", content: "本轮的伤害转移已使用" },
			},
		},
	},
	sw_tongpin: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: function (card, player, target) {
			return target != player;
		},
		content() {
			"step 0";
			player.line(target);
			if (!player.isTurnedOver()) player.turnOver(true);
			"step 1";
			target.addSkill("sw_tongpin_mark");
			target.addMark("sw_tongpin_mark", 1);
			player.addSkill("sw_tongpin2");
		},
		subSkill: {
			mark: {
				trigger: { source: "damageBegin1" },
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return event.card.name == "sha";
				},
				content() {
					trigger.num++;
					game.log(player, "造成了", "#y暴击伤害");
				},
				marktext: "嫁",
				intro: {
					name: "同嫁",
					content: function (storage, player) {
						return "有女同嫁给了你！";
					},
				},
				mod: {
					cardUsable(card, player, num) {
						if (player.hasMark("sw_tongpin_mark") && card.name == "sha")
							return (
								num +
								game.countPlayer(function (current) {
									return current.hasSkill("sw_tongpin");
								})
							);
					},
				},
			},
		},

	},
	sw_zhinang: {
		audio: 2,
		trigger: { player: "useCardEnd", },
		forced: true,
		filter(event, player) {
			return get.zhinangs().includes(event.card.name) && event.card.isCard && event.cards && event.cards.length == 1;
		},
		content() {
			"step 0";
			if (!_status.zhinang_list) {
				var list,
					skills = [];
				//var banned = ["xunyi", "mbyilie"];
				if (get.mode() == "guozhan") {
					list = [];
					for (var i in lib.characterPack.mode_guozhan) list.push(i);
				} else if (_status.connectMode) list = get.charactersOL();
				else {
					list = [];
					for (var i in lib.character) {
						if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
						list.push(i);
					}
				}
				for (var i of list) {
					if (i.indexOf("gz_jun") == 0) continue;
					for (var j of lib.character[i][3]) {
						var skill = lib.skill[j];
						if (!skill || skill.zhuSkill) continue;
						if (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
						var info = get.translation(j + "_info");
						for (var ix = 0; ix < info.length - 4; ix++) {
							// 匹配四字成语
							if (/无懈可击|过河拆桥|顺手牵羊|无中生有|乐不思蜀/.test(info.substring(ix, ix + 4))) {
								skills.add(j);
								break;
							}
						}
					}
				}
				_status.zhinang_list = skills;
			}
			var list = _status.zhinang_list
				.filter(function (i) {
					return !player.hasSkill(i, null, null, false);
				})
				.randomGets(3);
			if (list.length == 0) game.log(player, "没有技能可选");
			else {
				event.videoId = lib.status.videoId++;
				var func = function (skills, id, target) {
					var dialog = ui.create.dialog("forcebutton");
					dialog.videoId = id;
					dialog.add("选择一个技能获得");
					for (var i = 0; i < skills.length; i++) {
						dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(skills[i]) + "】</div><div>" + lib.translate[skills[i] + "_info"] + "</div></div>");
					}
					dialog.addText(" <br> ");
				};
				func(list, event.videoId, player);
				player.chooseControl(list).set("ai", function () {
					var controls = _status.event.controls;
					if (controls.includes("cslilu")) return "cslilu";
					if (controls.includes("zhichi")) return "zhichi";
					return controls[0];
				});
			}
			"step 1";
			game.broadcastAll("closeDialog", event.videoId);
			player.addSkills(result.control);
		},
	},
	sw_shenjincui: {
		audio: ["dcjincui", 2],
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		forced: true,
		charlotte: true,
		filter: function (event, player) {
			return true;
		},
		content: function () {
			var num = 0;
			for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
				var card = ui.cardPile.childNodes[i];
				if (get.zhinangs().includes(card.name)) num++;
			}
			game.log(player, "牌堆中剩余智囊数：" + num.toString());
			if (num > 9) {
				player.draw();
				player.gainMaxHp();
			}
			if (num >= 7) {
				player.addTempSkill("ssw_shenjincui_buff", { player: "phaseAfter" });
				player.addMark("sw_shenjincui_buff", 1, false);
			}
			if (num < 7) {
				if (player.MaxHp > 3) player.loseMaxHp(1);
			}
		},
		subSkill: {
			buff: {
				onremove: true,
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("sw_shenjincui_buff");
					},
				},
				mark: true,
				intro: {
					content: "本阶段内使用【杀】的次数上限+#",
				},
			},
		},
	},
	sw_kanpo: {
		init: function (player) {
			if (!player.storage.sbkanpo) {
				player.storage.sbkanpo = [12, [], []];
				player.markSkill("sbkanpo");
			}
		},
		audio: ["sbkanpo", 2],
		trigger: { global: "roundStart" },
		filter: function (event, player) {
			var storage = player.storage.sbkanpo;
			return storage[0] || storage[1].length;
		},
		forced: true,
		locked: false,
		content: function* (event, map) {
			var player = map.player,
				storage = player.storage.sbkanpo;
			var sum = storage[0];
			storage[1] = [];
			player.markSkill("sbkanpo");
			if (!sum) {
				"step 0";
				if (player.hasSkill("sw_kanpo")) player.removeSkill("sw_kanpo");
				player.addSkill("swq_jincui");
				var cards = [];
				for (var i of get.zhinangs()) {
					var card = get.cardPile2(function (card) {
						return card.name == i;
					});
					if (card) cards.push(card);
				}
				if (cards.length) player.gain(cards, "gain2");
				return;
			}
			const list = get.inpileVCardList(info => {
				if (info[2] == "sha" && info[3]) return false;
				//return info[0] != "equip";
				return true;
			});
			const func = () => {
				const event = get.event();
				const controls = [
					link => {
						const evt = get.event();
						if (evt.dialog && evt.dialog.buttons) {
							for (let i = 0; i < evt.dialog.buttons.length; i++) {
								const button = evt.dialog.buttons[i];
								button.classList.remove("selectable");
								button.classList.remove("selected");
								const counterNode = button.querySelector(".caption");
								if (counterNode) {
									counterNode.childNodes[0].innerHTML = ``;
								}
							}
							ui.selected.buttons.length = 0;
							game.check();
						}
						return;
					},
				];
				event.controls = [ui.create.control(controls.concat(["清除选择", "stayleft"]))];
			};
			if (event.isMine()) func();
			else if (event.isOnline()) event.player.send(func);
			var result = yield player
				.chooseButton(["看破：是否记录至多" + get.cnNumber(sum) + "个牌名？", [list, "vcard"]], [1, sum], false)
				.set("ai", function (button) {
					//if (ui.selected.buttons.length >= Math.max(3, game.countPlayer() / 2)) return 0;
					switch (button.link[2]) {
						case "wuxie":
							return 5 + Math.random();
						case "sha":
							return 5 + Math.random();
						case "tao":
							return 4 + Math.random();
						case "jiu":
							return 3 + Math.random();
						case "lebu":
							return 3 + Math.random();
						case "shan":
							return 4.5 + Math.random();
						case "wuzhong":
							return 4 + Math.random();
						case "shunshou":
							return 2.7 + Math.random();
						case "nanman":
							return 2 + Math.random();
						case "wanjian":
							return 1.6 + Math.random();
						default:
							return 1.5 + Math.random();
					}
				})
				//.set("filterButton", button => {
				//    return !_status.event.names.includes(button.link[2]);
				//})
				.set("names", storage[2])
				.set("custom", {
					add: {
						confirm: function (bool) {
							if (bool != true) return;
							const event = get.event().parent;
							if (event.controls) event.controls.forEach(i => i.close());
							if (ui.confirm) ui.confirm.close();
							game.uncheck();
						},
						button: function () {
							if (ui.selected.buttons.length) return;
							const event = get.event();
							if (event.dialog && event.dialog.buttons) {
								for (let i = 0; i < event.dialog.buttons.length; i++) {
									const button = event.dialog.buttons[i];
									const counterNode = button.querySelector(".caption");
									if (counterNode) {
										counterNode.childNodes[0].innerHTML = ``;
									}
								}
							}
							if (!ui.selected.buttons.length) {
								const evt = event.parent;
								if (evt.controls) evt.controls[0].classList.add("disabled");
							}
						},
					},
					replace: {
						button: function (button) {
							const event = get.event(),
								sum = event.sum;
							if (!event.isMine()) return;
							if (button.classList.contains("selectable") == false) return;
							if (ui.selected.buttons.length >= sum) return false;
							button.classList.add("selected");
							ui.selected.buttons.push(button);
							let counterNode = button.querySelector(".caption");
							const count = ui.selected.buttons.filter(i => i == button).length;
							if (counterNode) {
								counterNode = counterNode.childNodes[0];
								counterNode.innerHTML = `×${count}`;
							} else {
								counterNode = ui.create.caption(`<span style="font-size:24px; font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`, button);
								counterNode.style.right = "5px";
								counterNode.style.bottom = "2px";
							}
							const evt = event.parent;
							if (evt.controls) evt.controls[0].classList.remove("disabled");
							game.check();
						},
					},
				})
				.set("sum", sum);
			if (result.bool) {
				var names = result.links.map(link => link[2]);
				storage[0] -= names.length;
				storage[1] = names;
				storage[2] = names;
			} else storage[2] = [];
			player.markSkill("sbkanpo");
		},
		marktext: "破",
		intro: {
			markcount: function (storage) {
				return storage[1].length;
			},
			mark: function (dialog, content, player) {
				const storage = player.getStorage("sbkanpo");
				const sum = storage[0];
				const names = storage[1];
				dialog.addText("剩余可记录" + sum + "次牌名");
				if (player.isUnderControl(true) && names.length) {
					dialog.addText("本轮记录牌名：");
					dialog.addSmall([names, "vcard"]);
				}
			},
		},
		group: "sbkanpo_kanpo",
		subSkill: {
			kanpo: {
				audio: "sbkanpo",
				trigger: { global: "useCard" },
				filter: function (event, player) {
					return event.player != player && player.storage.sbkanpo[1].includes(event.card.name);
				},
				prompt2: function (event, player) {
					return "移除" + get.translation(event.card.name) + "的记录，令" + get.translation(event.card) + "无效";
				},
				check: function (event, player) {
					var effect = 0;
					if (event.card.name == "wuxie" || event.card.name == "shan") {
						if (get.attitude(player, event.player) < -1) effect = -1;
					} else if (event.targets && event.targets.length) {
						for (var i = 0; i < event.targets.length; i++) {
							effect += get.effect(event.targets[i], event.card, event.player, player);
						}
					}
					if (effect < 0) {
						if (event.card.name == "sha") {
							var target = event.targets[0];
							if (target == player) return !player.countCards("h", "shan");
							else return target.hp == 1 || (target.countCards("h") <= 2 && target.hp <= 2);
						} else return true;
					}
					return false;
				},
				logTarget: "player",
				content: function () {
					player.storage.sbkanpo[1].remove(trigger.card.name);
					player.markSkill("sbkanpo");
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					player.draw();
				},
			},
		},
	},
	sw_nanchong: {
		audio: ["dchaochong", 2],
		trigger: { player: "useCardAfter" },
		filter: function (event, player) {
			return player.maxHp != player.countCards("h");
		},
		direct: true,
		locked: false,
		content: function () {
			"step 0";
			var del = player.maxHp - player.countCards("h");
			event.delta = del;
			if (del > 0) {
				player.chooseBool(get.prompt("sw_nanchong"), "摸" + get.cnNumber(del) + "张牌，然后令你的体力上限-1").set("ai", () => {
					var player = _status.event.player;
					if (player.isPhaseUsing() && player.hasCard(cardx => player.hasUseTarget(cardx) && player.hasValueTarget(cardx), "hs")) return false;
					return true;
				});
			} else if (del < 0) {
				player
					.chooseToDiscard(get.prompt("sw_nanchong"), "弃置" + get.cnNumber(-del) + "张手牌，然后令你的体力上限+1", -del)
					.set("ai", card => {
						var player = _status.event.player;
						if (player.isPhaseUsing() && player.hasCard(cardx => player.hasValueTarget(cardx), "hs")) return 6 - player.getUseValue(card);
						return 5 - get.value(card);
					})
					.set("logSkill", "sw_nanchong");
			}
			"step 1";
			if (result.bool) {
				if (event.delta > 0) {
					player.logSkill("sw_nanchong");
					player.draw(event.delta);
					//lib.skill.sw_nanchong.change(player, -1);
					player.loseMaxHp();
				} else if (event.delta < 0) {
					//lib.skill.sw_nanchong.change(player, 1);
					player.gainMaxHp();
				}
			}
		},
		change: function (player, num) {
			if (typeof player.storage.sw_nanchong !== "number") player.storage.sw_nanchong = 0;
			if (!num) return;
			player.storage.sw_nanchong += num;
			player.markSkill("sw_nanchong");
			game.log(player, "的手牌上限", "#g" + (num > 0 ? "+" : "") + num);
		},
		markimage: "image/card/handcard.png",
		intro: {
			content: function (storage, player) {
				var num = player.storage.sw_nanchong;
				return "手牌上限" + (num >= 0 ? "+" : "") + num;
			},
		},
		mod: {
			maxHandcard: function (player, num) {
				return num + player.countMark("sw_nanchong");
			},
		},
		ai: { threaten: 2.2 },
	},
	sw_weige: {
		audio: ["dcjinjin", 2],
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		usable: 2,
		logTarget: "source",
		check: function (event, player) {
			if (player.maxHp == 7) return true;
			var evt = event.getParent("useCard");
			if (evt && evt.player == player && event.source == player) return false;
			if (player.isPhaseUsing() && player.maxHp - 7 == -1) return true;
			return Math.abs(7 - player.maxHp) >= 2;
		},
		prompt2: function (event, player) {
			var str = "";
			if (player.maxHp != 7) {
				str += "重置因〖男宠〗增加或减少的体力上限，";
			}
			var num = Math.abs(7 - player.maxHp) || 1;
			if (event.source && event.source.isIn()) {
				str += "令伤害来源弃置至多" + get.cnNumber(num) + "张牌，然后你摸" + num + "-X张牌（X为其弃置的牌数）";
			} else str += "你摸" + get.cnNumber(num) + "张牌";
			return str;
		},
		content: function () {
			"step 0";
			var del = Math.abs(7 - player.maxHp) || 1;
			event.delta = del;
			//player.storage.dchaochong = 0;
			if (7 - player.maxHp > 0) player.gainMaxHp(7 - player.maxHp);
			else player.loseMaxHP(player.maxHp - 7);
			if (player.hasSkill("sw_nanchong", null, false, false)) player.markSkill("sw_nanchong");
			game.log(player, "重置了体力上限");
			if (trigger.source && trigger.source.isIn()) {
				trigger.source
					.chooseToDiscard(get.translation(player) + "对你发动了【伟哥】", "弃置至多" + get.cnNumber(del) + "张牌，然后" + get.translation(player) + "摸" + del + "-X张牌（X为你弃置的牌数）。", [1, del], "he")
					.set("ai", card => {
						if (_status.event.goon) return 5.5 - get.value(card);
						return 0;
					})
					.set("goon", get.attitude(trigger.source, player) < 0);
			}
			"step 1";
			var num = event.delta;
			if (result.bool) num -= result.cards.length;
			if (num > 0) player.draw(num);
		},
		ai: {
			combo: "sw_nanchong",
			maixie: true,
			maixie_hp: true,
			threaten: 0.85,
			effect: {
				target: function (card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (!target.hasFriend()) return;
						var num = 0;
						if (typeof target.storage.dcninchong == "number") num = Math.abs(target.storage.dcninchong);
						if (num <= 0) return;
						return [1, Math.min(1, num / 3)];
					}
				},
			},
		},
	},
	sw_tonghun_xianfu: {
		charlotte: true,
		trigger: { global: ["drawEnd", "recoverEnd"] },
		forced: true,
		filter(event, player) {
			if (event.player.isDead() || !player.storage.sw_tonghunTargets || !player.storage.sw_tonghunTargets.includes(event.player) || event.num <= 0) return false;
			return true
		},
		async content(event, trigger, player) {
			const name = event.triggername
			if (name === 'drawEnd') {
				await player.draw(trigger.num)
			}
			if (name === 'recoverEnd') {
				await player.recover(trigger.num)
			}
		},
		popup: false,
	},

	// 瑰血风灵火山
	swx_fenglinghuoshan_xuezu: {
		forced: true,
		locked: true,
		group: ["swx_fenglinghuoshan_xuezu_init", "swx_fenglinghuoshan_xuezu_hujia"],
		subSkill: {
			// 前半句与包内三代血族完全一致，逐字复用
			init: {
				forced: true,
				locked: true,
				trigger: { player: "enterGame", global: "phaseBefore" },
				filter(event, player) {
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				async content(event, trigger, player) {
					const cards = [];
					const suits = ["heart", "diamond"];
					for (let i = 3; i <= 10; i++) cards.push(game.createCard2("sha", suits[(i - 1) % 2], i, "sw_xue"));
					game.cardsGotoPile(cards, () => ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)]);
				},
			},
			// 当其他角色受到自己造成的伤害后，你获得一点护甲
			hujia: {
				forced: true,
				locked: true,
				trigger: { global: "damageEnd" },
				filter(event, player) {
					// 谓词只做字段比对（联机安全）：其他角色 + 受到自己造成的伤害 + 实际掉血
					return event.player !== player && event.source === event.player && event.num > 0;
				},
				async content(event, trigger, player) {
					await player.changeHujia(1, null, true);
				},
			},
		},
	},
	swx_fenglinghuoshan_b: {
		forced: true,
		trigger: { global: "roundStart" },
		// 本技能的数字范围是「初始体力上限」—— 不能读 player.maxHp（会被 gainMaxHp/loseMaxHp 改变）
		getInitMaxHp(player) {
			return lib.character?.[player.name]?.maxHp || player.maxHp;
		},
		async content(event, trigger, player) {
			// fired 按【轮】重置，不能放进 choose —— 否则②结算后的「重新选择」会把已触发的标记抹掉，
			// 让本轮结束时的奖励错误地再次生效。
			player.setStorage("swx_fenglinghuoshan_b_fired", false);
			await lib.skill.swx_fenglinghuoshan_b.choose(player);
		},
		// ①：秘密选择一名其他角色 + 从 1~初始上限 选一个数字。
		// 「清除之前的记录」= 覆盖（清的是上一次的选择），与本次选择并行 —— 所以直接写新的即可，不要先清空。
		// 「秘密」= 不 logSkill、不用 markAuto（会出可见标记），只 setStorage + updateMarks。
		async choose(player) {
			const result = await player
				.chooseTarget("秘密选择一名其他角色", lib.filter.notMe)
				.set("ai", target => -get.attitude(get.player(), target))
				.forResult();
			if (!result?.bool || !result.targets?.length) return;
			const target = result.targets[0];
			const max = Math.max(1, lib.skill.swx_fenglinghuoshan_b.getInitMaxHp(player));
			const picked = await player
				.chooseNumbers(`从 1 到 ${max} 选择一个数字`, [{ prompt: `请选择 1~${max} 的数字`, min: 1, max }], true)
				.set("processAI", () => {
					const me = get.player();
					return [Math.max(1, Math.min(lib.skill.swx_fenglinghuoshan_b.getInitMaxHp(me), me.getStorage("swx_fenglinghuoshan_b_num", 1)))];
				})
				.forResult();
			const num = picked?.numbers?.[0];
			if (!num) return;
			player.setStorage("swx_fenglinghuoshan_b_target", [target]);
			player.updateMarks("swx_fenglinghuoshan_b_target");
			player.setStorage("swx_fenglinghuoshan_b_num", num);
			player.updateMarks("swx_fenglinghuoshan_b_num");
			player.setStorage("swx_fenglinghuoshan_b_count", 0);
			player.updateMarks("swx_fenglinghuoshan_b_count");
		},
		// ②的效果：双方失去 num 点体力值；此过程中双方无法回复体力；死亡时改为扣 1 点上限并调整体力/手牌至 num
		async effect(player, target, num) {
			const pairs = [player, target];
			for (const current of pairs) {
				current.addTempSkill("swx_fenglinghuoshan_b_norecover");
				current.addTempSkill("swx_fenglinghuoshan_b_nodying");
				// active 供 nodying 子技能认领「本次技能造成的死亡」
				current.setStorage("swx_fenglinghuoshan_b_mark", { num, owner: player, active: true });
				current.updateMarks("swx_fenglinghuoshan_b_mark");
			}
			game.log(player, "与", target, "失去", get.cnNumber(num), "点体力值");
			for (const current of pairs) await current.loseHp(num);
			// 兜底清理：若没人真的进入死亡（例如被求桃救活），nodying 不会跑，这里补一次
			for (const current of pairs) {
				current.removeSkill("swx_fenglinghuoshan_b_norecover");
				current.removeSkill("swx_fenglinghuoshan_b_nodying");
			}
			// 结算完成。然后「你可重新选择并移除先前的选择」——
			// 形态参照 OL董昭〖先略〗（sp/skill.js:28062-28088）：**询问、可取消**，
			// 选了就整体覆盖 storage（覆盖即「移除先前的记录」），取消则保留旧记录。
			// 注意：每回合限一次的 used 标记**不摘除**，故本回合不会再触发②。
			player.setStorage("swx_fenglinghuoshan_b_fired", true);
			await lib.skill.swx_fenglinghuoshan_b.choose(player);
		},
		// ⚠ group 里的子技能是【常驻】的，只有真正需要一直生效的才放进来。
		// used / norecover / nodying 都是按需 addTempSkill / addSkill 挂载的，
		// 一旦放进 group 就会永远生效：used 恒真会让②永不触发、norecover 会让人永远无法回体力。
		// （与葵倾的 invalid / lock 同款处理：subSkill 里定义，但不进 group。）
		group: ["swx_fenglinghuoshan_b_watch", "swx_fenglinghuoshan_b_roundend"],
		subSkill: {
			// 计数：你选择的角色对你使用牌
			watch: {
				charlotte: true,
				forced: true,
				popup: false,
				// global useCardAfter（参照 OL董昭〖先略〗 sp/skill.js:27952）—— 放在牌【结算完成后】。
				// 不用 useCardToTargeted：那是牌结算过程中触发，而本技能后面要「失去体力值 + 弹窗重新选择」，
				// 嵌进牌结算里是嵌套风险（同类坑：damage vs damageEnd）。
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					// 谓词只做名单比对（联机安全），名单从 storage 读
					const chosen = player.getStorage("swx_fenglinghuoshan_b_target", [])[0];
					if (!chosen || event.player !== chosen) return false;
					return event.targets?.includes(player);
				},
				async content(event, trigger, player) {
					const chosen = player.getStorage("swx_fenglinghuoshan_b_target", [])[0];
					const need = player.getStorage("swx_fenglinghuoshan_b_num", 1);
					if (!chosen || !need) return;
					const count = player.getStorage("swx_fenglinghuoshan_b_count", 0) + 1;
					player.setStorage("swx_fenglinghuoshan_b_count", count);
					player.updateMarks("swx_fenglinghuoshan_b_count");
					if (!player.hasSkill("swx_fenglinghuoshan_b_used") && count >= need) {
						player.addTempSkill("swx_fenglinghuoshan_b_used"); // 每回合限一次
						player.setStorage("swx_fenglinghuoshan_b_count", 0);
						player.updateMarks("swx_fenglinghuoshan_b_count");
						await lib.skill.swx_fenglinghuoshan_b.effect(player, chosen, need);
					}
				},
			},
			// 每回合限一次的标记（空技能，仅作存在性判断）
			used: {
				charlotte: true,
			},
			// 「此过程中无法回复体力」—— 照抄 OL 谋姜维 olsbranji 的 norecover（onlyOL/skill.js:15274-15294）
			norecover: {
				charlotte: true,
				mark: true,
				marktext: "血",
				intro: { content: "不能回复体力" },
				trigger: { player: "recoverBefore" },
				forced: true,
				firstDo: true,
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			// 「死亡时改为扣除一点体力上限，并将体力值与手牌数调整至选择数字」
			/*
			 * 免死 + 结算：死到临头才拦（参考神庞统〖困御〗 kunyu，character/extra/skill.js:1707-1726）。
			 * ⚠ 必须挂在 dieBegin，不能挂 dying：濒死流程里 dying 触发早于求桃，而那里设 nodying
			 * 会让步骤2「hp > 0 || event.nodying」直接结束、**求桃整个被跳过**。
			 * player.die() 发生在步骤3（求桃之后），故在 dieBegin 拦下既能保住求桃、又能防死。
			 */
			nodying: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { player: "dieBegin" },
				filter(event, player) {
					if (event.getParent()?.name === "giveup") return false; // 排除主动认输（kunyu 同款守卫）
					return player.getStorage("swx_fenglinghuoshan_b_mark", false)?.active === true;
				},
				async content(event, trigger, player) {
					const rec = player.getStorage("swx_fenglinghuoshan_b_mark", false) || {};
					const num = Math.max(1, rec.num ?? 1);
					const owner = rec.owner;
					// ⚠ 必须先关掉 active：下面 loseMaxHp 若把上限扣到 ≤0 会直接 die（content.ts:12239-12241），
					// 那时 active 还开着就会递归进本技能。
					rec.active = false;
					player.setStorage("swx_fenglinghuoshan_b_mark", rec);
					player.updateMarks("swx_fenglinghuoshan_b_mark");

					trigger.cancel(); // 防止死亡（此刻求桃已结束）
					// 「直到求桃结束，然后移除」禁回
					player.removeSkill("swx_fenglinghuoshan_b_norecover");
					if (owner) owner.removeSkill("swx_fenglinghuoshan_b_norecover");

					await player.loseMaxHp(1); // 死亡改为扣除一点体力上限

					// 体力值调整至 num（不触发任何技能 → _triggered = null）
					const delta = num - player.hp;
					if (delta !== 0) {
						const next = player.changeHp(delta, false);
						next._triggered = null;
						await next;
					}
					// 手牌数调整至 num
					const hand = player.countCards("h");
					if (hand < num) await player.draw(num - hand);
					else if (hand > num) await player.chooseToDiscard("h", hand - num, true);
				},
			},
			// 「本轮结束时若未触发，你获得其一点体力上限」
			roundend: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { global: "roundEnd" },
				filter(event, player) {
					const chosen = player.getStorage("swx_fenglinghuoshan_b_target", [])[0];
					return !!chosen && !player.getStorage("swx_fenglinghuoshan_b_fired", false);
				},
				async content(event, trigger, player) {
					const target = player.getStorage("swx_fenglinghuoshan_b_target", [])[0];
					player.setStorage("swx_fenglinghuoshan_b_target", []);
					player.updateMarks("swx_fenglinghuoshan_b_target");
					// 掠夺：从「其」身上拿走一点体力上限
					if (target?.isIn()) await target.loseMaxHp();
					await player.gainMaxHp();
					game.log(player, "获得了", target, "的1点体力上限");
				},
			},
		},
	},
	swx_fenglinghuoshan_c: {
		enable: "phaseUse",
		async content(event, trigger, player) {
			const result = await player
				.chooseControl("选项一", "选项二", "cancel2")
				.set("prompt", get.prompt("swx_fenglinghuoshan_c"))
				.set("choiceList", [
					"对自己造成X点伤害，然后增加一点体力上限（X为本技能本回合发动次数）",
					"扣除一点体力上限，选择一名其他角色，其下一张可以指定你为目标的牌必须指定你为目标",
				])
				.set("ai", () => "选项一")
				.forResult();
			if (result.control === "cancel2") return;
			if (result.control === "选项一") {
				// X = 本技能本回合发动次数（含选项二），getHistory 天然按回合归零。
				// ⚠ 客机 history 恒空，此技能由此仅在主机侧取值正确。
				const num = Math.max(1, player.getHistory("useSkill", evt => evt.skill === "swx_fenglinghuoshan_c").length);
				await player.gainMaxHp();
				await player.damage(player, num);
			} else {
				const picked = await player
					.chooseTarget("选择一名其他角色", lib.filter.notMe)
					.set("ai", target => -get.attitude(get.player(), target))
					.forResult();
				if (!picked?.bool || !picked.targets?.length) return;
				await player.loseMaxHp();
				const target = picked.targets[0];
				// 可叠加：对同一角色重复选择则计数累加
				const rec = target.getStorage("swx_fenglinghuoshan_c_state", false);
				const count = (rec && rec.self === player ? rec.count : 0) + 1;
				target.addSkill("swx_fenglinghuoshan_c_state");
				target.setStorage("swx_fenglinghuoshan_c_state", { self: player, count });
				target.updateMarks("swx_fenglinghuoshan_c_state");
				player.line(target);
				game.log(player, "令", target, "接下来", get.cnNumber(count), "张可指定其使用者为目标的牌必须指定", player, "为目标");
			}
		},
	},
	/*
	 * 技能C 的状态技 —— 挂在「其」身上，形态同本会话已验证的 swlu_pianyu_state。
	 * 该角色下一张可指定其使用者为目标的牌，必须指定其使用者为目标；可叠加（count 累加）。
	 * 用 addSkill 永久挂载、耗尽后自行 removeSkill（不随回合过期）。
	 */
	swx_fenglinghuoshan_c_state: {
		charlotte: true,
		mark: true,
		marktext: "血",
		sourceSkill: "swx_fenglinghuoshan_c",
		intro: { content: "你接下来可以指定其使用者为目标的牌，必须指定其使用者为目标" },
		trigger: { player: "useCard2" },
		direct: true, // 不询问，直接执行
		filter(event, player) {
			const rec = player.getStorage("swx_fenglinghuoshan_c_state", false);
			if (!rec || !rec.self || rec.count <= 0) return false;
			return lib.filter.targetEnabled2(event.card, player, rec.self);
		},
		async content(event, trigger, player) {
			const rec = player.getStorage("swx_fenglinghuoshan_c_state", false);
			if (!rec?.self || rec.count <= 0) return;
			if (!trigger.targets) trigger.targets = [];
			if (!trigger.targets.includes(rec.self)) {
				trigger.targets.addArray([rec.self]);
				player.line(rec.self);
				game.log(rec.self, "成为", trigger.card, "的强制目标");
			}
			rec.count--;
			player.setStorage("swx_fenglinghuoshan_c_state", rec);
			player.updateMarks("swx_fenglinghuoshan_c_state");
			if (rec.count <= 0) player.removeSkill("swx_fenglinghuoshan_c_state");
		},
	},

	// 碧野栖鸾包
	swby_fangcao: {
		keywords: "藏/荐/英/营/草".split("/"),
		audio: `${ea}swby_lugushou:2`,
		enable: ["chooseToUse", "chooseToRespond"],
		usable: 1,
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [[], {}];
			}
		},
		onremove(player, skill) {
			delete player.storage[skill];
			delete player.storage.swby_fangcao_marked;
			delete player.storage.swby_fangcao_recoreded;
			game.filterPlayer(function (current) {
				if (current.getStorage("swby_fangcao_qingcao")?.from === player) {
					current.removeSkill("swby_fangcao_qingcao");
					delete current.storage.swby_fangcao_qingcao;
				}
			});
		},
		hiddenCard(player, name) {
			if (player.storage.swby_fangcao && player.storage.swby_fangcao[0].includes(name) && !player.getStat("skill").swby_fangcao) {
				return true;
			}
			return false;
		},
		mark: true,
		marktext: "草",
		intro: {
			markcount(storage) {
				return storage[0] ? storage[0].length : 0;
			},
			content(storage) {
				if (!storage) {
					return;
				}
				var str = "<li>";
				if (!storage[0].length) {
					str += "本轮未记录牌名";
				} else {
					str += "已记录牌名：";
					str += get.translation(storage[0]);
				}
				return str;
			},
		},
		filter(event, player) {
			var storage = player.storage.swby_fangcao;
			if (!storage || !storage[0].length) {
				return false;
			}
			for (var i of storage[0]) {
				var card = { name: i, isCard: true };
				if (event.filterCard(card, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var storage = player.storage.swby_fangcao;
				for (var i of storage[0]) {
					list.push([get.type2(i) == "trick" ? "锦囊" : "基本", "", i]);
				}
				return ui.create.dialog("芳草", [list, "vcard"], "hidden");
			},
			filter(button, player) {
				var evt = _status.event.getParent();
				return evt.filterCard({ name: button.link[2], isCard: true }, player, evt);
			},
			check(button) {
				var card = { name: button.link[2] },
					player = _status.event.player;
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				if (card.name == "jiu") {
					return 0;
				}
				if (card.name == "sha" && player.hasSkill("jiu")) {
					return 0;
				}
				return player.getUseValue(card, null, true);
			},
			backup(links, player) {
				return {
					audio: "swby_fangcao",
					filterCard() {
						return false;
					},
					popname: true,
					viewAs: {
						name: links[0][2],
						isCard: true,
						storage: { swby_fangcao: true },
					},
					selectCard: -1,
					async precontent(event, trigger, player) {
						//player.logSkill("swby_fangcao");
						player
							.when({ player: ["useCardAfter", "respondAfter"] })
							.filter((evt, pl) => pl === player && evt.card?.storage?.swby_fangcao && evt.getParent() == event.getParent())
							.step(async (_, evt, pl) => {
								const name = evt.card.name;
								delete evt.card.storage.swby_fangcao;
								if (evt?.targets?.length <= 0 && !pl.hasSkill("swby_fangcao_qingcao")) {
									lib.skill.swby_fangcao.applyQingcao(pl, pl, name);
									return;
								}
								const targets = (evt.targets || []).filter(t => t?.isIn() && !t.hasSkill("swby_fangcao_qingcao"));
								if (!targets.length) return;
								let target = targets[0];
								if (targets.length > 1) {
									const pick = await pl
										.chooseTarget("芳草：令一名角色获得“青青草原”标记", true, function (card, p, tar) {
											return get.event("canTargetIds")?.includes(tar);
										})
										.set("ai", tar => get.attitude(pl, tar))
										.set("canTargetIds", targets)
										.forResult();
									if (!pick?.bool || !pick.targets?.length) return;
									target = pick.targets[0];
								}
								lib.skill.swby_fangcao.applyQingcao(pl, target, name);
								pl.line(target);
							})
							.finish();
					},
				};
			},
			prompt(links) {
				return "选择【" + get.translation(links[0][2]) + "】的目标";
			},
		},
		ai: {
			order: 2,
			result: {
				player(player) {
					if (_status.event.type == "dying") {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		initList() {
			var list,
				skills = [],
				banned = [],
				bannedInfo = ["游戏开始时"];
			if (get.mode() == "guozhan") {
				list = [];
				for (var i in lib.characterPack.mode_guozhan) {
					list.push(i);
				}
			} else if (_status.connectMode) {
				list = get.charactersOL();
			} else {
				list = [];
				for (var i in lib.character) {
					if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
						continue;
					}
					list.push(i);
				}
			}
			for (var i of list) {
				if (i.indexOf("gz_jun") == 0) {
					continue;
				}
				for (var j of lib.character[i][3]) {
					if (j == "swby_fangcao") continue;
					var skill = lib.skill[j];
					if (!skill || skill.zhuSkill || banned.includes(j)) {
						continue;
					}
					if (skill.ai && (skill.ai.combo || skill.ai.neg)) {
						continue;
					}
					const infox = get.skillInfoTranslation(j);
					if (bannedInfo.some(item => infox.includes(item))) {
						continue;
					}
					const keywords = lib.skill.swby_fangcao.keywords;
					const nameText = get.plainText(get.translation(j));
					const descText = get.plainText(get.skillInfoTranslation(j));
					if (keywords.some(item => nameText.includes(item) || descText.includes(item))) {
						skills.add(j);
					}
				}
			}
			_status.swby_fangcao_list = skills;
		},
		applyQingcao(owner, target, cardname) {
			target.addTempSkill("swby_fangcao_qingcao", "roundStart");
			target.setStorage("swby_fangcao_qingcao", { from: owner, card: cardname });
			target.markSkill("swby_fangcao_qingcao");
			game.log(target, "获得了", "#y青青草原", "标记");
		},
		group: ["swby_fangcao_record"],
		subSkill: {
			backup: { audio: "swby_fangcao" },
			record: {
				audio: "swby_fangcao",
				trigger: { global: "roundStart" },
				locked: false,
				forced: true,
				filter(event, player) {
					return !player.storage.swby_fangcao_recoreded;
				},
				async content(event, trigger, player) {
					var list = get.inpileVCardList(function (info) {
						if (info[2] == "sha" && info[3]) {
							return false;
						}
						return info[0] == "basic" || info[0] == "trick";
					});
					const result = await player
						.chooseButton(["芳草：是否记录至多四个牌名？", [list, "vcard"]], [0, 4])
						.set("ai", function (button) {
							switch (button.link[2]) {
								case "wuxie":
								case "sha":
								case "shan":
									return 5 + Math.random();
								case "tao":
									return 4 + Math.random();
								default:
									return 2 + Math.random();
							}
						}).forResult();
					if (result?.bool && result.links.length) {
						var storage = player.storage.swby_fangcao;
						storage[0] = result.links.map(function (link) {
							return link[2];
						});
						player.markSkill("swby_fangcao");
						game.log(player, "记录了", get.translation(storage[0]));
						player.storage.swby_fangcao_recoreded = true;
					}
				},
			},
			qingcao: {
				charlotte: true,
				mark: true,
				marktext: "草",
				intro: {
					name: "青青草原",
					content(storage) {
						if (!storage?.from) {
							return "受到伤害时，由令你获得此标记的角色防止并结算〖芳草〗选项";
						}
						return (
							"来源：" +
							get.translation(storage.from) +
							"<br>对应牌名：" +
							get.translation(storage.card) +
							`<br><span style="font-family: yuanli">哪里来的绿帽儿？</span>`
						);
					},
				},
				onremove(player) {
					delete player.storage.swby_fangcao_qingcao;
					player.unmarkSkill("swby_fangcao_qingcao");
				},
				audio: "swby_fangcao",
				trigger: { player: "damageBegin4" },
				forced: true,
				popup: false,
				filter(event, player) {
					const owner = player.getStorage("swby_fangcao_qingcao")?.from;
					return event.num > 0 && owner?.isIn();
				},
				async content(event, trigger, player) {
					const data = player.getStorage("swby_fangcao_qingcao");
					const owner = data?.from;
					const cardName = data?.card;
					const victim = player;
					const source = trigger.source;
					if (!owner?.isIn()) return;
					trigger.cancel();
					owner.line(victim);
					owner.logSkill("swby_fangcao", victim);

					const card3 = get.translation(victim);
					const sourceName = source ? get.translation(source) : "伤害来源";
					const list = [
						"移除" + card3 + "的「青青草原」标记",
						"令" + sourceName + "获得一个技能名或描述中含“藏/荐/英/营/草”之一的技能",
						"从〖芳草〗记录中删除" +
						get.translation(cardName) +
						"，并移除场上你以此牌名产生的标记",
						"废除你的一个装备栏（若均已废除则改为失去全部体力）",
					];
					const btnResult = await owner
						.chooseButton([
							"芳草：请选择任意项",
							[list.map((item, i) => [i, item]), "textbutton"],
						])
						.set("forced", false)
						.set("selectButton", [1, 4])
						.set("ai", button => {
							switch (button.link) {
								case 0:
									return 2;
								case 1:
									return source ? 1.5 : 0;
								case 2:
									return 1;
								case 3:
									return 0.5;
							}
						})
						.forResult();
					const links = btnResult?.links ? btnResult.links.slice().sort() : [];
					if (links?.length) {
						game.log(owner, "选择了", "#g【芳草】", "的", "#y选项" + links.map(link => get.cnNumber(link + 1, true)).join("、"));
					}
					else {
						game.log(owner, "未选择", "#g【芳草】", "的", "#y任何选项");
					}
					if (links.includes(1) && source?.isIn()) {
						lib.skill.swby_fangcao.initList();
						const skillList = _status.swby_fangcao_list
							.filter(sk => !source.hasSkill(sk, null, null, false))
							.randomGets(3);
						if (skillList.length) {
							const videoId = lib.status.videoId++;
							const func = (skills, id, target) => {
								const dialog = ui.create.dialog("forcebutton");
								dialog.videoId = id;
								dialog.add("令" + get.translation(target) + "获得一个技能");
								for (const sk of skills) {
									dialog.add(
										'<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' +
										get.translation(sk) +
										"】</div><div>" +
										lib.translate[sk + "_info"] +
										"</div></div>"
									);
								}
								dialog.addText(" <br> ");
							};
							if (owner.isOnline()) {
								owner.send(func, skillList, videoId, source);
							} else if (owner === game.me) {
								func(skillList, videoId, source);
							}
							const pick = await owner
								.chooseControl(skillList)
								.set("ai", () => skillList[0])
								.forResult();
							game.broadcastAll("closeDialog", videoId);
							if (pick?.control) {
								await source.addSkills(pick.control);
							}
						}
					}
					const storage = owner.storage.swby_fangcao;
					if (links.includes(0)) {
						victim.removeSkill("swby_fangcao_qingcao");
						delete victim.storage.swby_fangcao_qingcao;
					}
					if (links.includes(2)) {
						// const name = cardName;
						storage[0].remove(cardName);
						// for (const p of game.filterPlayer()) {
						// 	const data = p.getStorage("swby_fangcao_qingcao");
						// 	if (data?.from === owner && data?.card === name) {
						// 		p.removeSkill("swby_fangcao_qingcao");
						// 		delete p.storage.swby_fangcao_qingcao;
						// 		game.log(p, "失去了", "#y青青草原", "标记");
						// 	}
						// }
						owner.markSkill("swby_fangcao");
					}
					if (links.includes(3)) {
						if (owner.hasEnabledSlot()) {
							await owner.chooseToDisable().set("ai", (evt, pl, list) => {
								for (const slot of list) {
									const i = slot === "equip3_4" ? 3 : parseInt(slot.slice(5));
									if (pl.hasEmptySlot(i)) {
										return slot;
									}
								}
								return list.randomGet();
							});
						} else if (owner.hp > 0) {
							await owner.loseHp(owner.hp);
						}
					}
					if (links.length < 3) {
						await owner.loseMaxHp(3 - links.length);
					}
				},
			},
		},
	},
	swby_qiluan: {
		audio: `${ea}swby_lugushou:1`,
		audioname2: {
			// 按拥有角色适配语音与台词（无 args 场景如技能台词面板同样生效）
			swby_shouwang: "swq_shengxi",
		},
		trigger: { global: "phaseEnd" },
		round: 3,
		filter(event, player) {
			return player.isIn();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseBool(get.prompt("swby_qiluan", trigger.player))
				.set("prompt2", "对自己造成1点伤害并执行一个额外的出牌阶段？")
				.set("ai", () => {
					const player = get.player();
					return player.hp > 1 && player.countCards("h") > 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.damage(player);
			const next = player.insertPhase("swby_qiluan");
			next.set("phaseList", ["phaseUse|swby_qiluan"]);
		},
		group: ["swby_qiluan_use", "swby_qiluan_useEnd"],
		subSkill: {
			debuff: {
				mod: {
					cardEnabled(card) {
						if (card.name === "sha") {
							return false;
						}
					},
				},
			},
			use: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					return event._extraPhaseReason == "swby_qiluan";
				},
				async content(event, trigger, player) {
					const others = game.filterPlayer(p => p != player);
					for (const p of others) p.addTempSkill("swby_qiluan_baiban");
					player.line(others);
					player.addSkill("swby_qiluan_debuff");
				},
			},
			useEnd: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { player: "phaseUseAfter" },
				filter(event, player) {
					return event._extraPhaseReason == "swby_qiluan";
				},
				async content(event, trigger, player) {
					game.filterPlayer(p => {
						if (p.hasSkill("swby_qiluan_baiban")) p.removeSkill("swby_qiluan_baiban");
					});
					player.removeSkill("swby_qiluan_debuff");
				},
			},
			baiban: {
				charlotte: true,
				popup: false,
				nopop: true,
				init(player, skill) {
					player.addSkillBlocker(skill);
					player.addTip(skill, "非锁定技失效");
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
					player.removeTip(skill);
				},
				skillBlocker(skill, player) {
					const info = lib.skill[skill];
					if (!info) return false;
					return !info.persevereSkill && !info.charlotte && !get.is.locked(skill, player);
				},
				mark: true,
				marktext: "鸾",
				intro: {
					content(storage, player) {
						const list = player.getSkills(null, false, false).filter(i => lib.skill.swby_qiluan_baiban.skillBlocker(i, player));
						if (list.length) return "失效技能：" + get.translation(list);
						return "无失效技能";
					},
				},
			},
		},
	},
	// 碧野守望
	swby_zhezhi: {
		audio: "swq_lieqi",
		enable: "chooseToUse",
		usable: 1,
		hiddenCard(player, name) {
			return (name === "tao" || name === "jiu") && player.countCards("h") > 0;
		},
		filter(event, player) {
			//if (player.hasSkill("swby_zhezhi_used")) return false;   // 每回合限一次
			if (player.countCards("h") === 0) return false;
			if (event.type === "dying" && event.dying) {
				return lib.filter.cardSavable({ name: "tao", isCard: true }, player, event.dying)
					|| lib.filter.cardSavable({ name: "jiu", isCard: true }, player, event.dying);
			}
			if (event.type === "phase") {
				return lib.filter.filterCard({ name: "tao", isCard: true }, player, event)
					|| lib.filter.filterCard({ name: "jiu", isCard: true }, player, event);
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				if (event.type === "dying" && event.dying) {
					if (lib.filter.cardSavable({ name: "tao", isCard: true }, player, event.dying)) list.push(["基本牌", "", "tao"]);
					if (lib.filter.cardSavable({ name: "jiu", isCard: true }, player, event.dying)) list.push(["基本牌", "", "jiu"]);
				} else {
					if (lib.filter.filterCard({ name: "tao", isCard: true }, player, event)) list.push(["基本牌", "", "tao"]);
					if (lib.filter.filterCard({ name: "jiu", isCard: true }, player, event)) list.push(["基本牌", "", "jiu"]);
				}
				return ui.create.dialog("###【折枝】###<div class='text center'>请选择要使用的牌</div>", [list, "vcard"]);
			},
			filter(button, player) {
				const event = _status.event.getParent();
				if (!event) return false;
				return event.filterCard({ name: button.link[2] }, player, event);
			},
			check(button) {
				const player = get.player();
				const event = _status.event.getParent();
				if (event && event.type === "dying") return button.link[2] === "tao" ? 20 : 5;
				if (button.link[2] === "tao") {
					if (player.isDamaged() || game.hasPlayer(current => current !== player && current.isDamaged() && get.attitude(player, current) > 0)) return 10;
					return 0;
				}
				return 6;
			},
			backup(links, player) {
				return {
					audio: "swby_zhezhi",
					cardName: links[0][2],
					filterCard(card, player) {
						if (ui.selected.cards.length >= 4) return false;
						const suit = get.suit(card);
						return !ui.selected.cards.some(c => get.suit(c) === suit);
					},
					selectCard: [1, 4],
					position: "h",
					filterTarget(card, player, target) {
						const evt = _status.event;
						if (evt && evt.dying) return target === evt.dying;
						return lib.filter.filterTarget({ name: get.info(evt.skill).cardName, isCard: true }, player, target);
					},
					selectTarget: lib.filter.selectTarget({ name: links[0][2], isCard: true }, player),
					ai2(target, targets) {
						const player = get.event().player;
						const evt = _status.event;
						if (evt && evt.dying) return 100;   // 濒死：目标被强制为濒死者，放行
						const name = get.info(evt.skill).cardName;
						if (name === "jiu") {
							return target === player ? 100 : -100;   // 自己的回合酒只给自己（加杀伤害），给队友无意义
						}
						if (target !== player && get.attitude(player, target) <= 0) return -100;
						return 103 - target.hp;   // 桃：自己或友好角色中血量较少者
					},
					discard: false,
					lose: false,
					check(card) {
						// 尽量弃置更多的花色：始终为正让 AI 把可弃花色数拉满，低价值优先
						return Math.max(1, 6 - get.value(card));
					},
					async content(event, trigger, player) {
						const n = event.cards.length;
						await player.discard(event.cards);
						const result = player.drawTo(player.maxHp);
						result.gaintag.add("swby_zhezhi_hand");
						await result;//  n 
						//player.addTempSkill("swby_zhezhi_used");
						const next = player.useCard({ name: get.info(event.name).cardName, isCard: true }, [event.target], "swby_zhezhi");
						next.swby_zhezhi_count = n;
						next.addSkillCount = false;
						await next;
					},
				};
			},
			prompt(links, player) {
				return "弃置一至四张花色互异的手牌并将手牌摸至体力上限，视为使用" + get.translation(links[0][2]);
			},
		},
		group: ["swby_zhezhi_use", "swby_zhezhi_clear", "swby_zhezhi_mod"],
		subSkill: {
			mod: {
				charlotte: true,
				silent: true,
				ignoredHandcard(card, player) {
					if (card.gaintag?.includes("swby_zhezhi_hand")) return true;
				},
				aiValue(player, card, num) {
					// 使用牌时尽量保证花色多样性：重复花色的牌更倾向使用，唯一花色的牌尽量保留
					const suit = get.suit(card, player);
					const count = player.countCards("h", c => get.suit(c, player) === suit);
					if (count > 1) return num + Math.min(count, 4) * 0.3;
					return num - 0.5;
				},
				aiUseful(player, card, num) {
					const suit = get.suit(card, player);
					const count = player.countCards("h", c => get.suit(c, player) === suit);
					if (count > 1) return num + Math.min(count, 4) * 0.3;
					return num - 0.5;
				},
			},
			backup: { },
			use: {
				audio: "swby_zhezhi",
				charlotte: true,
				forced: true,
				popup: false,
				silent: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.skill === "swby_zhezhi" && (event.swby_zhezhi_count || 0) > 1;
				},
				async content(event, trigger, player) {
					const n = trigger.swby_zhezhi_count || 0;   // 从 useCard 事件上读取弃置花色数
					if (n >= 2) {
						const target = trigger.targets[0];
						if (target) {
							if (!_status.damageSkills && lib.skill.olzhouxi?.initList) {
								lib.skill.olzhouxi.initList();
							}
							const damageSkills = _status.damageSkills || [];
							const candidates = damageSkills.filter(skill => !target.hasSkill(skill, null, null, false));
							const chosenSkill = candidates.randomGets(1)[0];
							if (chosenSkill) await target.addTempSkills(chosenSkill, { player: "phaseEnd" });
						}
					}
					if (n >= 3) {
						trigger.effectCount++;
						game.log("#g【折枝】", "额外结算一次");
					}
					if (n >= 4) {
						const result = player.draw(4);
						result.gaintag.add("swby_zhezhi_hand");
						await result;
					}
				},
			},
			used: { charlotte: true },
			clear: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: { player: "phaseAfter" },
				filter(event, player) {
					return player.countCards("h", card => card.gaintag?.includes("swby_zhezhi_hand")) > 0;
				},
				async content(event, trigger, player) {
					player.removeGaintag("swby_zhezhi_hand");          // 删除手牌中所有的折枝标记
				},
			},
		},
		ai: {
			save: true,
			respondTao: true,
			order() {
				const player = get.player();
				const evt = get.event();
				if (evt && evt.dying) return get.attitude(player, evt.dying) > 0 ? 6 : 0;
				// 出牌阶段：能用就用，优先级很高
				if (player.countCards("h") > 0
					&& (lib.filter.filterCard({ name: "tao", isCard: true }, player, evt)
						|| lib.filter.filterCard({ name: "jiu", isCard: true }, player, evt))) return 12;
				return 0;
			},
			result: {
				player(player) {
					const evt = get.event();
					if (evt && evt.dying) return get.attitude(player, evt.dying);
					return 10;   // 出牌阶段只要能用就用
				},
			},
		},
	},
	swby_hongwang: {
		audio: "swq_youquan",
		locked: true,
		forced: true,
		group: ["swby_hongwang_recover"],
		trigger: { global: "recoverBegin" },
		logTarget: "player",
		filter(event, player) {
			return event.source === player;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			let num = trigger.num;
			if (num > target.maxHp - target.hp) {
				num = target.maxHp - target.hp;
			}
			trigger.cancel();
			if (num <= 0) return;
			if (lib.config.background_audio) {
				game.playAudio("effect", "recover");
			}
			game.broadcast(() => {
				if (lib.config.background_audio) {
					game.playAudio("effect", "recover");
				}
			});
			target.$damagepop(num, "thunder");
			game.log(target, `向上调整了${get.cnNumber(num)}点体力`);
			const next = target.changeHp(num, false);
			next._triggered = null;
			await next;
		},
		subSkill: {
			recover: {
				audio: "swby_hongwang",
				charlotte: true,
				forced: true,
				trigger: { player: "useCardAfter" },
				logTarget: "player",   // 日志目标为自己（回复对象）
				filter(event, player) {
					return ["tao", "jiu"].includes(get.name(event.card))
						&& event.targets.some(target => target !== player)
						&& player.isDamaged();
				},
				async content(event, trigger, player) {
					await player.recover(1);   // 经鸿望②转换为调整体力（不触发技能），净效果回复1点
				},
			},
		},
		mod: {
			playerEnabled(card, player, target) {
				if (target !== player && ["tao", "jiu"].includes(get.name(card))) {
					if(get.name(card) === "tao") return target.isDamaged();
					else return true;
				}
			},
			selectTarget(card, player, range) {
				if (["tao", "jiu"].includes(get.name(card))) {
					range[0] = 1;
					range[1] = 1;
				}
			},
			cardEnabled(card, player) {
				if (get.name(card) === "tao" && game.hasPlayer(current => current !== player && current.isDamaged())) return true;
			},
		},
		ai: {
			jiuOther: true,
		},
	},
	swby_chunsheng: {
		audio: "swq_shenguang",
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		enable: "phaseUse",
		selectTarget: [1, 3],
		multiline: true,
		multitarget: true,
		deadTarget: true,
		ai2(target) {
			// 只指定态度大于0的角色；优先：死亡 > 血量较少 > 残血
			const player = get.event().player;
			if (get.attitude(player, target) <= 0) return -100;
			if (target.isDead()) return 100;
			if (target.isDamaged()) return 50 + (target.maxHp - target.hp);
			return 10;
		},
		filterTarget(card, player, target) {
			return true;
		},
		async content(event, trigger, player) {
			await player.awakenSkill(event.name);
			const targets = event.targets.sortBySeat(player);
			for await(const target of targets) {
				if (target.isDead()) {
					await target.reviveEvent(1);
				} else {
					await target.recover(1);
				}
				await target.draw(1);
			}
		},
		ai: {
			order() {
				const player = get.player();
				// 队友死亡：最高优先级（复活）
				if (game.dead.some(current => get.attitude(player, current) > 0)) return 10;
				// 队友大残血（已损失体力≥2）才发动
				const hurt = game.filterPlayer(current => get.attitude(player, current) > 0 && current.maxHp - current.hp >= 2);
				return hurt.length ? 6 : 0;
			},
			result: {
				player(player) {
					// 与 order 同款门槛（供 get.effect/logAi 等评估）
					if (game.dead.some(current => get.attitude(player, current) > 0)) return 10;
					const hurt = game.filterPlayer(current => get.attitude(player, current) > 0 && current.maxHp - current.hp >= 2);
					if (!hurt.length) return 0;
					return 2 + Math.max(...hurt.map(current => current.maxHp - current.hp));
				},
				target(player, target) {
					// 只指定态度大于0的角色；优先：死亡 > 血量较少 > 残血
					if (get.attitude(player, target) <= 0) return -100;
					if (target.isDead()) return 100;
					if (target.isDamaged()) return 50 + (target.maxHp - target.hp);
					return 10;
				},
			},
		},
	},
	// 丛雨
	swe_renling: {
		audio: `${ea}swe_congyu:4`,
		// logAudio(event, player, triggername) {
		// 	debugger
		// 	if (triggername != "phaseBegin" && triggername != "phaseBefore") {
		// 		return `${ea}swe_congyu/swe_renling4.mp3`;
		// 	}
		// 	return 3;
		// },
		broadcast(card) {
			game.broadcast(
				(card, storage) => {
					card.storage = storage;
				},
				card,
				card.storage
			);
		},
		forced: true,
		group: ["swe_renling_end"],
		trigger: {
			player: "phaseBegin",
			global: ["phaseBefore", "loseAfter", "cardsDiscardAfter", "loseAsyncAfter"],
		},
		filter(event, player, name) {
			if (name === "phaseBefore") {
				return (event.name != "phase" || game.phaseNumber == 0) && !player.storage.swe_renlingWeapon;
			}
			if (name == "phaseBegin") {
				const card = lib.skill.swe_renling.getBoundCard(player);
				return card && !player.getCards("e").includes(card);
			}
			const lost = event.cards || (event.getd ? event.getd() : []);
			return lost.some(c => c.name === "swe_congyuwan" && c.storage?.swe_renling === player && get.position(c, true) === "d");
		},
		async content(event, trigger, player) {
			if (event.triggername === "phaseBefore") {
				if (!player.storage.swe_renlingWeapon) {
					const card = game.createCard("swe_congyuwan", lib.card.swe_congyuwan.cardcolor, lib.card.swe_congyuwan.cardnumber);
					card.storage.swe_renling = player;
					player.storage.swe_renlingWeapon = card;
					lib.skill.swe_renling.broadcast(card);
					if (_status.connectMode) {
						if (!_status.postReconnect.swe_renling) {
							_status.postReconnect.swe_renling = [
								function (list) {
									setTimeout(() => {
										for (const [cardid, playerid] of list) {
											const c = lib.cardOL[cardid];
											const p = lib.playerOL[playerid];
											if (c && p) c.storage.swe_renling = p;
										}
									}, 0);
								},
								[],
							];
						}
						_status.postReconnect.swe_renling[1].add([card.cardid, player.playerid]);
					}
					const list = game.filterPlayer(p => p.isIn() && p.canEquip(card, true));
					let target = list[0];
					if (list.length > 1) {
						const result = await player
							.chooseTarget(`刃灵：将${get.translation(card)}置入一名角色的装备区`, true, function (c, p, tar) {
								return get.event()?.weaponTarget?.includes(tar);
							})
							.set("ai", tar => get.attitude(player, tar))
							.set("weaponTarget", list)
							.forResult();
						target = result?.targets?.[0];
					}
					if (!target) return;
					player.$gain2(card, false);
					await game.delayx();
					if (target != player) await player.give(card, target);
					await target.equip(card);
				}
				return;
			}

			const lost = trigger.cards || (trigger.getd ? trigger.getd() : []);
			const card =
				lost.find(c => c.name === "swe_congyuwan" && c.storage?.swe_renling === player) ||
				lib.skill.swe_renling.getBoundCard(player);
			if (!card) return;

			if (event.triggername != "phaseBegin" && (player.countCards("he") <= 0 || !player.canEquip(card, true))) return;

			if (event.triggername != "phaseBegin") {
				await player.chooseToDiscard("he", true, "刃灵：弃置一张牌，将丛雨丸收回武器栏");
			}
			const owner = get.owner(card);
			if (owner && owner != player) {
				owner.line(player);
				owner.$give(card, player);
				await owner.lose(card, ui.special);
				await game.delayx();
			} else if (owner) {
				await owner.lose(card, ui.special);
			} else {
				player.$gain2(card, false);
				await game.delayx();
			}
			await player.equip(card);
			lib.skill.swe_renling.broadcast(card);
		},
		getBoundCard(player) {
			const name = "swe_congyuwan";
			const allPlayers = (game.players || []).concat(game.dead || []);
			for (const p of allPlayers) {
				const cards = p.getCards("hejxs");
				for (const c of cards) {
					if (c && c.name === name && c.storage && c.storage.swe_renling === player) {
						return c;
					}
				}
			}
			if (ui.cardPile) {
				for (const c of Array.from(ui.cardPile.childNodes)) {
					if (c && c.name === name && c.storage && c.storage.swe_renling === player) {
						return c;
					}
				}
			}
			if (ui.discardPile) {
				for (const c of Array.from(ui.discardPile.childNodes)) {
					if (c && c.name === name && c.storage && c.storage.swe_renling === player) {
						return c;
					}
				}
			}
			if (ui.special) {
				for (const c of Array.from(ui.special.childNodes)) {
					if (c && c.name === name && c.storage && c.storage.swe_renling === player) {
						return c;
					}
				}
			}
			return player.storage.swe_renlingWeapon?.storage?.swe_renling === player ? player.storage.swe_renlingWeapon : null;
		},
		subSkill: {
			end: {
				audio: `swe_renling`,
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					const card = lib.skill.swe_renling.getBoundCard(player);
					if (!card) return false;
					return game.hasPlayer(p => p != player && p.isIn() && p.canEquip(card, true));
				},
				logTarget: "targets",
				async cost(event, trigger, player) {
					const card = lib.skill.swe_renling.getBoundCard(player);
					event.result = await player
						.chooseTarget("刃灵：将丛雨丸置于一名其他角色的武器栏？")
						.set("filterTarget", (cardx, p, target) => {
							const Targets = get.event()?.renlingTargets;
							return Targets?.includes(target);
						})
						.set("renlingTargets", game.filterPlayer(target => target != player && target.canEquip(card, true)))
						.set("ai", target => get.attitude(player, target))
						.forResult();
				},
				async content(event, trigger, player) {
					const tar = event.targets?.[0];
					if (!tar) return;
					const card = lib.skill.swe_renling.getBoundCard(player);
					if (!card) return;
					player.line(tar);
					player.$give(card, tar);
					await player.lose(card, ui.special);
					await game.delayx();
					await tar.equip(card);
					lib.skill.swe_renling.broadcast(card);
				},
			}
		},
	},
	swe_congyuwan: {
		equipSkill: true,
		forced: true,
		mod: {
			targetEnabled(card, user, target) {
				if (target.getEquips("swe_congyuwan").length && get.subtype(card, false) == "equip1" && get.name(card, user) != "swe_congyuwan") {
					return false;
				}
			},
			canBeReplaced(card2, player2) {
				if (player2.getVEquips("swe_congyuwan").includes(card2)) {
					return false;
				}
			},
			cardEnabled2(card2, player2) {
				if (player2.getEquips("swe_congyuwan").includes(card2)) {
					return false;
				}
			},
		},
		trigger: { player: "useCard" },
		filter(event, player) {
			return event.card.name == "sha" && player.getCards("e", c => c.name == "swe_congyuwan").length > 0 && player.getCards("e", c => c.name == "swe_congyuwan")?.[0]?.storage?.swe_renling;
		},
		async content(event, trigger, player) {
			const weapon = player.getCards("e", c => c.name == "swe_congyuwan")[0];
			const renling = weapon.storage.swe_renling;
			renling.line(player);
			const list = ["锈刀", "除祟", "附神", "共进"];
			const result = await renling
				.chooseControl(list)
				.set("prompt", "丛雨丸：为此次【杀】选择一项")
				.set("choiceList", [
					"锈刀：令此【杀】无效且从牌堆或弃牌堆中获得一张普通锦囊牌",
					"除祟：令目标弃置所有非基本牌",
					"附神：令目标不可响应且此【杀】伤害+1",
					"共进：令攻击范围内的所有角色均成为此【杀】的目标",
				])
				.set("displayIndex", false)
				.set("ai", () => list.randomGet())
				.forResult();
			const mode = result.control;
			renling.popup(mode);
			game.log(renling, "选择了", "#y" + mode);
			trigger.swe_congyuwan_mode = mode;
			if (renling.hasSkill("swe_wangyue")) {
				renling.markAuto("swe_wangyue", [mode]);
			}
			if (mode == "锈刀") {
				trigger.cancel();
				const trick = get.cardPile2(c => get.type(c) == "trick");
				if (trick) await player.gain(trick, "gain2");
				return;
			}
			if (mode == "共进") {
				trigger.targets.addArray(game.filterPlayer(current => player.inRange(current)));
				player.logSkill("swe_congyuwan", trigger.targets);
			}
		},
		group: ["swe_congyuwan_after", "swe_congyuwan_attach"],
		subSkill: {
			attach: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				silent: true,
				filter(event, player) {
					return event.card.name == "sha" && event.getParent().swe_congyuwan_mode == "附神";
				},
				content(event, trigger, player) {
					trigger.directHit.add(trigger.target);
					// const evt = trigger.getParent();
					const map = trigger.customArgs;
					const id = trigger.target.playerid;
					if (!map[id]) {
						map[id] = {};
					}
					if (!map[id].extraDamage) {
						map[id].extraDamage = 0;
					}
					map[id].extraDamage++;
				},
			},
			after: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				slient: true,
				filter(event, player) {
					return event.card.name == "sha" && event.getParent().swe_congyuwan_mode == "除祟";
				},
				async content(event, trigger, player) {
					const tar = trigger.target;
					const hs = tar.getCards("he", c => get.type(c) != "basic");
					if (hs.length) await tar.discard(hs);
				},
			},
		},
	},
	swe_wangyue: {
		audio: `${ea}swe_congyu:2`,
		dutySkill: true,
		marktext: "月",
		derivation: ["swe_yueyu", "swe_zhixin"],
		updateSkin(player) {
			if (player.name != "swe_congyu" && player.name1 != "swe_congyu" && player.name2 != "swe_congyu") return;
			if (player.awakenedSkills?.includes("swe_wangyue")) {
				player.changeSkin({ characterName: "swe_congyu" }, "swe_congyu_archive");
				return;
			}
			if (player.storage.swe_wangyue_noDuty) {
				player.changeSkin({ characterName: "swe_congyu" }, "swe_congyu_fail");
				return;
			}
			if (!player.hasSkill("swe_wangyue", null, false, false) && !player.hasSkill("swe_renling", null, false, false)) return;
			const card = lib.skill.swe_renling.getBoundCard(player);
			const hasWeapon = card && player.getCards("e").includes(card);
			player.changeSkin({ characterName: "swe_congyu" }, hasWeapon ? "swe_congyu_weapon" : "swe_congyu");
		},
		intro: {
			markcount(storage, player) {
				if (player.storage.swe_wangyue_noDuty) return 0;
				const options = (player.getStorage("swe_wangyue") || []).length;
				const discard = player.countMark("swe_wangyue_discardCount");
				return `${options}/${discard}`;
			},
			content(storage, player) {
				const list = ["锈刀", "除祟", "附神", "共进"];
				const done = player.getStorage("swe_wangyue") || [];
				let str =
					"已执行：" +
					list
						.map(opt => (done.includes(opt) ? `<span class="thundertext">${opt}</span>` : `<span style="opacity:0.5">${opt}</span>`))
						.join(" ");
				if (!player.storage.swe_wangyue_noDuty) {
					str += `<br>丛雨丸入弃牌堆：${player.countMark("swe_wangyue_discardCount")}/4`;
				}
				return str;
			},
		},
		group: ["swe_wangyue_achieve", "swe_wangyue_fail", "swe_wangyue_dist", "swe_wangyue_dying", "swe_wangyue_skin", "swe_wangyue_chat"],
		subSkill: {
			skin: {
				charlotte: true,
				superCharlotte: true,
				forced: true,
				popup: false,
				firstDo: true,
				trigger: {
					player: ["enterGame", "equipAfter"],
					global: ["equipAfter", "loseAfter", "loseAsyncAfter"],
				},
				filter(event, player) {
					if (player.name != "swe_congyu" && player.name1 != "swe_congyu" && player.name2 != "swe_congyu") return false;
					if (player.awakenedSkills?.includes("swe_wangyue") || player.storage.swe_wangyue_noDuty) return false;
					if (!player.hasSkill("swe_wangyue", null, false, false) && !player.hasSkill("swe_renling", null, false, false)) return false;
					const card = lib.skill.swe_renling.getBoundCard(player);
					if (!card) return event.name == "enterGame";
					if (event.name == "equip") {
						return event.player == player || event.card?.name == "swe_congyuwan" || event.cards?.includes(card);
					}
					if (event.name == "lose" || event.name == "loseAsync") {
						const lost = event.cards || (event.getd ? event.getd() : []);
						return lost.includes(card);
					}
					return true;
				},
				content(event, trigger, player) {
					lib.skill.swe_wangyue.updateSkin(player);
				},
			},
			dist: {
				mod: {
					globalTo(from, to, distance) {
						if (to.hasSkill("swe_wangyue", null, false, false)) {
							const card = lib.skill.swe_renling.getBoundCard(to);
							let x = 1;
							if (card) {
								const ren = card.storage.swe_renling;
								x = ren ? Math.max(1, ren.maxHp) : 1;
							}
							return distance + x - 1;
						}
					},
					maxHandcard(player, num) {
						if (player.hasSkill("swe_wangyue", null, false, false)) {
							const card = lib.skill.swe_renling.getBoundCard(player);
							let x = 1;
							if (card) {
								const ren = card.storage.swe_renling;
								x = ren ? Math.max(1, ren.maxHp) : 1;
							}
							return num + x;
						}
					},
					targetEnabled(card, user, target) {
						if (!target.hasSkill("swe_wangyue", null, false, false) || user == target) return;
						if (!user.inRange(target) && get.is.damageCard(card)) return false;
					},
				},
			},
			dying: {
				audio: "swe_wangyue",
				trigger: { player: "dying" },
				filter(event, player) {
					return player.hasSkill("swe_wangyue", null, false, false);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("望月：令一名角色使用一张手牌？")
						.set("ai", t => get.attitude(player, t))
						.forResult();
				},
				async content(event, trigger, player) {
					const tar = event.targets?.[0];
					if (!tar) return;
					if (!tar.hasCard(card => tar.hasUseTarget(card, false, false), "hs")) {
						tar.popup("无牌可用");
						return;
					}
					const result = await tar
						.chooseToUse({
							filterCard(card) {
								if (get.itemtype(card) != "card" || !["h", "s"].includes(get.position(card))) {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							},
							filterTarget(card, player2, target) {
								return lib.filter.targetEnabled.apply(this, arguments);
							},
							prompt: "望月：使用一张手牌",
							addCount: false,
							forced: true,
						})
						.forResult();
					if (!result?.bool) return;
					const card = result.card || result.cards?.[0];
					if (card && get.name(card) == "sha" && (tar == player || tar.getCards("e", c => c.name == "swe_congyuwan").length)) {
						await player.recoverTo(1);
					}
				},
			},
			achieve: {
				audio: `${ea}swe_congyu/swe_wangyue1.mp3`,
				trigger: { global: "phaseEnd" },
				forced: true,
				priority: 1,
				skillAnimation: true,
				animationColor: "thunder",
				filter(event, player) {
					if (player.awakenedSkills?.includes("swe_wangyue") || player.storage.swe_wangyue_noDuty) return false;
					const done = player.getStorage("swe_wangyue");
					return ["锈刀", "除祟", "附神", "共进"].every(opt => done.includes(opt));
				},
				async content(event, trigger, player) {
					player.awakenSkill("swe_wangyue");
					game.log(player, "成功完成使命");
					game.broadcastAll(() => {
						_status.tempMusic = "ext:云中守望/assets/audio/swe_congyu/swe_congyu_archive_bgm.mp3";
						game.playBackgroundMusic();
					});
					await player.gainMaxHp();
					await player.recover();
					await player.removeSkills("swe_renling");
					const card = lib.skill.swe_renling.getBoundCard(player);
					if (card) {
						delete card.storage.swe_renling;
						delete player.storage.swe_renlingWeapon;
						lib.skill.swe_renling.broadcast(card);
						if (_status.connectMode && _status.postReconnect.swe_renling) {
							const arr = _status.postReconnect.swe_renling[1];
							for (let i = 0; i < arr.length; i++) {
								if (arr[i][0] === card.cardid) {
									arr.splice(i, 1);
									break;
								}
							}
						}
					}
					game.broadcastAll(player => {
						player.node.name.innerHTML = "有地绫";
						player.node.name2.innerHTML = "";
					}, player)
					await player.addSkills(["swe_yueyu", "swe_zhixin"]);
					lib.skill.swe_wangyue.updateSkin(player);
				},
			},
			fail: {
				audio: `${ea}swe_congyu/swe_wangyue2.mp3`,
				trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
				forced: true,
				priority: 1,
				filter(event, player) {
					if (player.storage.swe_wangyue_noDuty || !player.hasSkill("swe_wangyue", null, false, false)) return false;
					const lost = event.cards || (event.getd ? event.getd() : []);
					return lost.some(c => c.name === "swe_congyuwan" && c.storage?.swe_renling === player && get.position(c, true) === "d");
				},
				async content(event, trigger, player) {
					player.addMark("swe_wangyue_discardCount", 1, false);
					player.markSkill("swe_wangyue");
					if (player.countMark("swe_wangyue_discardCount") >= 4) {
						player.storage.swe_wangyue_noDuty = true;
						player.syncStorage("swe_wangyue_noDuty");
						player.removeSkill("swe_wangyue_achieve");
						player.removeSkill("swe_wangyue_fail");
						game.log(player, "的〖望月〗失去了使命技标签");
						lib.skill.swe_wangyue.updateSkin(player);
					}
				},
			},
			chat: {
				charlotte: true,
				superCharlotte: true,
				forced: true,
				slient: true,
				popup: false,
				firstDo: true,
				trigger: { player: "damageEnd" },
				filter(event, player) {
					if (!event.num) return false;
					if (!player.hasSkill("swe_wangyue", null, false, false)) return false;
					return player.name == "swe_congyu" || player.name1 == "swe_congyu" || player.name2 == "swe_congyu";
				},
				content(event, trigger, player) {
					const list = [
						"疼疼疼！",
						"呜……这里流血了……主人",
						"呃啊",
						"什？！什么？",
					];
					player.chat(list.randomGet());
				},
			},
		},
	},
	swe_yueyu: {
		audio: `${ea}swe_congyu:2`,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const n1 = player.countCards("h"),
				n2 = target.countCards("h");
			await player.swapHandcards(target);
			const m1 = player.countCards("h"),
				m2 = target.countCards("h");
			const gP = m1 - n1,
				gT = m2 - n2;
			if (gP == 0 && gT == 0) {
				await player.recover();
				await target.recover();
				await player.draw(Math.min(5, player.maxHp));
				await target.draw(Math.min(5, target.maxHp));
				return;
			}
			if (gP > 0) {
				await player.loseHp(Math.min(gP, 1));
			}
			if (gT > 0) {
				await target.loseHp(Math.min(gT, target.maxHp));
			}
			if (gP < 0) {
				await player.draw(-gP);
			}
			if (gT < 0) {
				await target.draw(Math.min(-gT, target.maxHp));
			}
		},
		ai: { order: 6, result: { target: 0.5 } },
	},
	swe_zhixin: {
		audio: `${ea}swe_congyu:2`,
		persevereSkill: true,
		group: ["swe_zhixin_use"],
		subSkill: {
			use: {
				audio: "swe_zhixin",
				trigger: { global: "useCard" },
				filter(event, player) {
					const user = event.player;
					if (!user.isPhaseUsing()) return false;
					return user.getHistory("useCard", (evt) => true).indexOf(event) == 0;
				},
				async cost(event, trigger, player) {
					const user = trigger.player;
					const card = trigger.card;
					const result = await player
						.chooseControl("选项一", "选项二", "cancel2")
						.set("prompt", `执心：对${get.translation(user)}的${get.translation(card)}发动？`)
						.set("choiceList", ["令此牌无效", "额外结算一次"])
						.forResult();
					event.result = {
						bool: result.control != "cancel2",
						cost_data: { choice: result.control, user },
					};
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const { choice, user } = event.cost_data;
					if (choice == "选项一") {
						trigger.targets.length = 0;
						trigger.all_excluded = true;
						player.addTempSkill("swe_zhixin_cancel");
					}
					else if (choice == "选项二") {
						trigger.effectCount ??= get.info(trigger.card, false).effectCount || 1;
						trigger.effectCount++;
						game.log(trigger.card, "额外结算一次");
						user.addTempSkill("swe_zhixin_hand");
					}
				},
			},
			hand: {
				charlotte: true,
				onremove: true,
				mark: true,
				markimage: "image/card/handcard.png",
				intro: {
					content: "手牌上限+1",
				},
				mod: {
					maxHandcard(player, num) {
						if (player.hasSkill("swe_zhixin_hand")) return num + 1;
					},
				},
			},
			cancel: {
				charlotte: true,
				onremove: true,
				trigger: { player: "damageBegin2" },
				forced: true,
				content(event, trigger, player) {
					trigger.cancel();
					player.removeSkill("swe_zhixin_cancel");
				},
				mark: true,
				marktext: "心",
				intro: {
					content: "本回合下一次受到伤害时，取消之",
				},
			},
		},
	},
	// 和泉妃爱
	swe_chijia: {
		audio: `${ea}swe_hequanfeiai:2`,
		enable: "phaseUse",
		usable: 3,
		filter(event, player) {
			return ui.cardPile.hasChildNodes;
		},
		async content(event, trigger, player) {
			await lib.skill.swe_chijia.chijiaContent(player);
		},
		ai: {
			order: 7,
			result: { player: 1 },
		},
		async content(event, trigger, player) {
			const revealed = [];
			const times = player.getRoundHistory("useSkill", (evt) => evt.skill == "swe_chijia" || evt.skill == "swe_chijia_damage")?.length;
			while (ui.cardPile.hasChildNodes) {
				const card = await lib.skill.swe_chijia.revealCard(player, revealed.length + 1);
				if (!card) {
					break;
				}
				revealed.push(card);
				if (lib.skill.swe_chijia.getMinTwoSuitSum(revealed) > times) {
					player.tempBanSkill("swe_chijia", "roundStart");
					break;
				}
				const result = await player
					.chooseBool("是否继续亮出牌堆顶的牌？")
					.set("ai", () => {
						const { revealed, times } = get.event();
						if (lib.skill.swe_chijia.getMinTwoSuitSum(revealed) > times) {
							return 0;
						}
						return revealed.length < 2 ? 1 : 0.3;
					})
					.set("revealed", revealed.slice())
					.set("times", times)
					.forResult();
				if (!result?.bool) {
					break;
				}
			}
			const suitCards = {};
			for (const card of revealed) {
				const suit = get.suit(card);
				if (!lib.suit.includes(suit)) {
					continue;
				}
				suitCards[suit] ??= [];
				suitCards[suit].push(card);
			}
			const suits = lib.suit.filter(s => suitCards[s]?.length);
			const singleSuit = suits.length === 1;
			const gainButtons = suits.map(s => [["gain", s], get.translation(s)]);
			const giveButtons = suits.map(s => [["give", s], get.translation(s)]);
			const selectResult = await player
				.chooseButtonTarget({
					createDialog: singleSuit
						? [
							`${get.prompt("swe_chijia")}`,
							"<div class='text center'>选择要获得的花色</div>",
							[gainButtons, "tdnodes"],
							"<div class='text center'> </div>",
						]
						: [
							`${get.prompt("swe_chijia")}`,
							"<div class='text center'>选择要获得的花色</div>",
							[gainButtons, "tdnodes"],
							"<div class='text center'>选择要交给其他角色的花色</div>",
							[giveButtons, "tdnodes"],
							"<div class='text center'> </div>",
						],
					suitCards,
					singleSuit,
					complexSelect: true,
					custom: {
						add: {},
						replace: {
							button(button) {
								const event = get.event();
								if (!event.isMine()) {
									return;
								}
								if (event.singleSuit && button.link[0] === "give") {
									return;
								}
								const row = button.link[0];
								if (button.classList.contains("selected")) {
									ui.selected.buttons.remove(button);
									button.classList.remove("selected");
								} else {
									const otherRow = row === "gain" ? "give" : "gain";
									if (ui.selected.buttons.some(b => b.link[0] === otherRow && b.link[1] === button.link[1])) {
										game.check();
										return;
									}
									for (const b of ui.selected.buttons.slice()) {
										if (b.link[0] === row) {
											ui.selected.buttons.remove(b);
											b.classList.remove("selected");
										}
									}
									button.classList.add("selected");
									ui.selected.buttons.add(button);
								}
								game.check();
							},
						},
					},
					filterButton(button) {
						if (get.event().singleSuit && button.link[0] === "give") {
							return false;
						}
						const selected = ui.selected.buttons;
						if (selected.includes(button)) {
							return true;
						}
						if (selected.some(b => b.link[0] !== button.link[0] && b.link[1] === button.link[1])) {
							return false;
						}
						return true;
					},
					selectButton() {
						return get.event().singleSuit ? [1, 1] : [0, 2];
					},
					selectTarget() {
						const { singleSuit } = get.event();
						const selected = ui.selected.buttons;
						const gain = selected.some(b => b.link[0] === "gain");
						const give = selected.some(b => b.link[0] === "give");
						if (singleSuit && gain) {
							return -1;
						}
						if (gain && give) {
							return 1;
						}
						return 0;
					},
					filterTarget(card, player, target) {
						if (get.event().singleSuit) {
							return false;
						}
						return target !== player;
					},
					filterOk() {
						const { singleSuit } = get.event();
						const selected = ui.selected.buttons;
						const gain = selected.find(b => b.link[0] === "gain");
						if (!gain) {
							return false;
						}
						if (singleSuit) {
							return selected.length === 1;
						}
						const give = selected.find(b => b.link[0] === "give");
						return !!give && gain.link[1] !== give.link[1] && ui.selected.targets.length === 1;
					},
					ai1(button) {
						const { suitCards, singleSuit } = get.event();
						const [row, suit] = button.link;
						const count = suitCards[suit]?.length || 0;
						if (row === "gain") {
							return count;
						}
						return singleSuit ? 0 : count * 0.01;
					},
					ai2(target) {
						if (get.event().singleSuit) {
							return 0;
						}
						return get.attitude(get.player(), target);
					},
				})
				.forResult();
			if (!selectResult?.bool || !selectResult.links?.length) {
				game.broadcastAll(() => ui.clear());
				await game.cardsGotoPile(revealed.slice().reverse(), ["insert_card", true]);
				return;
			}
			const gainSuit = selectResult.links.find(link => link[0] === "gain")?.[1];
			const giveSuit = selectResult.links.find(link => link[0] === "give")?.[1];
			const target = selectResult.targets?.[0];
			const gainCards = suitCards[gainSuit] || [];
			const giveCards = suitCards[giveSuit] || [];
			const handled = new Set([...gainCards, ...giveCards]);
			const remain = revealed.filter(card => !handled.has(card));
			game.broadcastAll(() => ui.clear());
			if (gainCards.length) {
				await player.gain(gainCards, "gain2");
			}
			if (giveCards.length) {
				player.line(target);
				await target.gain(giveCards, "gain2");
			}
			if (remain.length) {
				await game.cardsGotoPile(remain.slice().reverse(), ["insert_card", true]);
			}
		},
		group: ["swe_chijia_damage"],
		subSkill: {
			damage: {
				audio: "swe_chijia",
				usable: 1,
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return ui.cardPile.hasChildNodes;
				},
				// getIndex(event, player, triggername) {
				// 	return event.num;
				// },
				async cost(event, trigger, player) {
					event.result = await player
						.chooseBool(get.prompt2("swe_chijia"))
						.set("ai", () => (get.player().isDamaged() ? 1 : 0.5))
						.forResult();
				},
				async content(event, trigger, player) {
					await lib.skill.swe_chijia.content(event, trigger, player);
				},
			},
		},
		getMinTwoSuitSum(cards) {
			const counts = lib.suit.map(s => cards.filter(c => get.suit(c) === s).length);
			counts.sort((a, b) => b - a);
			return counts[0] + (counts?.[1] || 0);
		},
		async revealCard(player, index) {
			if (!ui.cardPile.hasChildNodes) {
				return null;
			}
			const card = get.cards()[0];
			if (!card) {
				return null;
			}
			await game.cardsGotoOrdering(card);
			const judgestr = get.translation(player) + "亮出的第" + get.cnNumber(index, true) + "张【持家】牌";
			const videoId = lib.status.videoId++;
			game.addVideo("judge1", player, [get.cardInfo(card), judgestr, videoId]);
			game.broadcastAll(
				(player, card, str, id, cardid) => {
					let event;
					if (game.online) {
						event = {};
					} else {
						event = _status.event;
					}
					if (game.chess) {
						event.node = card.copy("thrown", "center", ui.arena).addTempClass("start");
					} else {
						event.node = player.$throwordered(card.copy(), true);
					}
					if (lib.cardOL) {
						lib.cardOL[cardid] = event.node;
					}
					event.node.cardid = cardid;
					event.node.classList.add("thrownhighlight");
					ui.arena.classList.add("thrownhighlight");
					event.dialog = ui.create.dialog(str);
					event.dialog.classList.add("center");
					event.dialog.videoId = id;
				},
				player,
				card,
				judgestr,
				videoId,
				get.id()
			);
			game.log(player, "亮出了牌堆顶的", card);
			await game.delay(2);
			game.broadcastAll(id => {
				const dialog = get.idDialog(id);
				if (dialog) {
					dialog.close();
				}
				ui.arena.classList.remove("thrownhighlight");
			}, videoId);
			game.addVideo("judge2", null, videoId);
			return card;
		},
	},
	swe_chenxiang: {
		audio: `${ea}swe_hequanfeiai:2`,
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || player.getStorage("swe_chenxiang_used").includes(name)) {
				return false;
			}
			if (get.type(name) !== "trick") {
				return false;
			}
			return player.countCards("hs", card => get.name(card, player) === "shan") > 0;
		},
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hs", card => get.name(card, player) === "shan")) {
				return false;
			}
			return lib.inpile.some(name => {
				if (player.getStorage("swe_chenxiang_used").includes(name)) {
					return false;
				}
				if (get.type(name) !== "trick") {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name, isCard: true }, "unsure"), player, event);
			});
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const name of lib.inpile) {
					if (player.getStorage("swe_chenxiang_used").includes(name)) {
						continue;
					}
					if (get.type(name) !== "trick") {
						continue;
					}
					list.push(["锦囊", "", name]);
				}
				return ui.create.dialog("沉香", [list, "vcard"], "hidden");
			},
			check(button) {
				const player = get.player();
				const card = { name: button.link[2], nature: button.link[3], isCard: true };
				const evt = _status.event.getParent();
				if (evt?.name === "chooseToRespond") {
					return 1;
				}
				return player.getUseValue(card, null, true);
			},
			filter(button, player) {
				if (player.getStorage("swe_chenxiang_used").includes(button.link[2])) {
					return false;
				}
				const evt = _status.event.getParent();
				return evt.filterCard({ name: button.link[2], nature: button.link[3], isCard: true }, player, evt);
			},
			backup(links, player) {
				const viewAs = { name: links[0][2] };
				if (links[0][3]) {
					viewAs.nature = links[0][3];
				}
				game.broadcastAll(
					(name, nature) => {
						lib.skill.swe_chenxiang_backup.viewAs = { name, nature };
					},
					viewAs.name,
					viewAs.nature
				);
				lib.skill.swe_chenxiang_backup.viewAs = viewAs;
				return get.copy(lib.skill.swe_chenxiang_backup);
			},
			prompt(links) {
				return `将一张【闪】当作${get.translation(links[0][3]) || ""}【${get.translation(links[0][2])}】使用或打出`;
			},
		},
		group: ["swe_chenxiang_damage"],//"swe_chenxiang_refresh", 
		subSkill: {
			backup: {
				sourceSkill: "swe_chenxiang",
				audio: `swe_chenxiang`,
				filterCard(card, player) {
					return get.name(card, player) === "shan";
				},
				selectCard: 1,
				position: "hs",
				popname: true,
				viewAs: { name: "guohe" },
				check(card) {
					return 8 - get.value(card);
				},
				onuse(result, player) {
					player.addTempSkill("swe_chenxiang_used", "roundStart");
					player.markAuto("swe_chenxiang_used", [result.card.name]);
				},
				onrespond(event, player) {
					player.addTempSkill("swe_chenxiang_used", "roundStart");
					player.markAuto("swe_chenxiang_used", [event.card.name]);
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
			refresh: {
				trigger: {
					player: "useCardToPlayered"
				},
				forced: true,
				popup: false,
				filter(event, player) {
					return event?.skill === "swe_chenxiang_backup" && event.targets.length > 0;;
				},
				async content(event, trigger, player) {
					const targets = trigger.targets;
					if (targets.includes(player)) {
						await player.refreshSkill("swe_chijia");
					}
				},
			},
			damage: {
				trigger: {
					player: "useCardToPlayered"
				},
				forced: true,
				popup: false,
				filter(event, player) {
					return event?.skill === "swe_chenxiang_backup" && event.targets.length > 0;;
				},
				async content(event, trigger, player) {
					const targets = (trigger.targets || []).filter(target => target?.isIn?.()).sortBySeat(player);
					player.disableSkill("swe_chenxiang", "swe_chenxiang");
					game.log(player, "的技能", `【${get.translation("swe_chenxiang")}】`, "暂时失效了");
					player.addSkill("swe_chenxiang_restore");
					player.addMark("swe_chenxiang_restore", targets?.length + player.countHistory("useSkill", (evt) => evt.skill == "swe_chenxiang_backup"));
					player.markSkill("swe_chenxiang_restore");
					for (const target of targets) {
						player.line(target);
						await target.damage(1, player);
					}
				},
			},
			restore: {
				marktext: "沉",
				intro: {
					content(storage, player) {
						return `再使用 <span style="font-weight:bold; color:#40ff89">${storage}</span> 张牌后，令【沉香】恢复`;
					}
				},
				trigger: { player: "useCardAfter" },
				forced: true,
				popup: false,
				onremove: true,
				charlotte: true,
				filter(event, player) {
					return player.countMark("swe_chenxiang_restore") > 0 && event?.skill != "swe_chenxiang_backup";
				},
				async content(event, trigger, player) {
					player.removeMark("swe_chenxiang_restore", 1, false);
					player.markSkill("swe_chenxiang_restore");
					if (player.countMark("swe_chenxiang_restore") <= 0) {
						player.enableSkill("swe_chenxiang", "swe_chenxiang");
						game.log(player, "的技能", `【${get.translation("swe_chenxiang")}】`, "恢复了");
						player.removeSkill("swe_chenxiang_restore");
					}
				},
			}
		},
		ai: {
			order(item, player) {
				if (_status.event.type === "phase") {
					return get.order({ name: "guohe" }) + 0.15;
				}
				return 4;
			},
			result: { player: 1 },
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (!player.countCards("hs", card => get.name(card, player) === "shan")) {
					return false;
				}
				const name = arg?.name || arg?.card?.name;
				if (name && player.getStorage("swe_chenxiang_used").includes(name)) {
					return false;
				}
				return true;
			},
		},
	},
	// 捉鬼
	swe_zhuogui: {
		audio: `${ea}swe_shenshanshi:2`,
		trigger: { player: "useCardToTarget" },
		popup: false,
		filter(event, player) {
			if (!event.target || event.target == player) return false;
			if (!player.storage.swe_guiji_failed) {
				if (player.getStorage("swe_zhuogui_banned")?.includes(event.target)) return false;
			}
			return event.target.countGainableCards(player, "hej") > 0;
		},
		async cost(event, trigger, player) {
			const target = trigger.target;
			event.result = await player
				.gainPlayerCard(`捉鬼：请选择获得${get.translation(target)}区域内的一张牌`, target, "hej")
				.set("ai", button => {
					if (get.attitude(player, target) < 0) {
						return get.value(button.link);
					}
					return -1;
				})
				.set("logSkill", ["swe_zhuogui", target])
				.forResult();
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			if (!player.storage.swe_guiji_failed) {
				player.markAuto("swe_zhuogui_banned", [target]);
			}
		},
		group: ["swe_zhuogui_banned", "swe_zhuogui_clear"],
		subSkill: {
			banned: {
				charlotte: true,
				mark: true,
				intro: { content: "捉鬼已对$发动" },
			},
			clear: {
				trigger: { target: "useCardToTarget" },
				forced: true,
				popup: false,
				filter(event, player) {
					if (player.storage.swe_guiji_failed) return false;
					return event.player != player && player.getStorage("swe_zhuogui_banned")?.includes(event.player);
				},
				async content(event, trigger, player) {
					player.unmarkAuto("swe_zhuogui_banned", [trigger.player]);
				},
			},
		},
		ai: {
			expose: 0.3,
			threaten: 0.6,
		},
	},
	// 鬼姬（使命技）
	swe_guiji: {
		audio: `${ea}swe_shenshanshi:2`,
		dutySkill: true,
		derivation: "swe_yujie",
		trigger: {
			player: "gainAfter",
		},
		filter(event, player) {
			debugger
			if (player.awakenedSkills?.includes("swe_guiji")) return false;
			if (player.storage.swe_guiji_failed) return false;
			if (["swe_hangxingji", "swe_bingguiji", "swe_huoshengqiang", "swe_denglonghai"].filter(e => player.hasSkill(e)).length >= 4) return false;
			const cards = event.cards || [];
			if (!cards.length) return false;
			const handNames = player.getCards("h").filter(c => !cards.includes(c)).map(c => c.name);
			const gainedNames = cards.map(c => c.name);
			if (gainedNames.some(name => handNames.includes(name))) return false;
			return true;
		},
		async cost(event, trigger, player) {
			const list = ["swe_hangxingji", "swe_bingguiji", "swe_huoshengqiang", "swe_denglonghai"].filter(e => !player.hasSkill(e));
			if (!list.length) {
				event.result = { bool: false };
				return;
			}
			const buttons = list.map(skill => [
				skill,
				'<div class="popup text" style="width:calc(100% - 20px);display:inline-block"><div class="skill" style="width: 100px !important;">【' +
				get.translation(skill) + '】</div><div>' +
				(lib.translate[skill + "_info2"] || '') + '</div></div>',
			]);
			const result = await player
				.chooseButton(["###鬼姬###<div class='text center'>你可以选择获得一项效果</div>", [buttons, "textbutton"]], true)
				// .set("ai", button => {
				// 	const player = get.player();
				// 	// AI 优先选择未被选的效果
				// 	if (available.includes("hangxingji")) return choices[available.indexOf("hangxingji")];
				// 	if (available.includes("huoshengqiang")) return choices[available.indexOf("huoshengqiang")];
				// 	return choices.randomGet();
				// })
				.forResult();
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
			};
		},
		async content(event, trigger, player) {
			const skillName = event.cost_data?.[0];
			await player.addSkills(skillName);
			game.log(player, "获得了", "#y" + get.translation(skillName), "的效果");
		},
		group: ["swe_guiji_achieve", "swe_guiji_fail"],
		updateSkin(player) {
			if (player.name != "swe_shenshanshi" && player.name1 != "swe_shenshanshi" && player.name2 != "swe_shenshanshi") return;
			if (player.storage.swe_guiji_failed) {
				player.changeSkin({ characterName: "swe_shenshanshi" }, "swe_shenshanshi_fail");
				return;
			}
			if (player.awakenedSkills?.includes("swe_guiji")) {
				player.changeSkin({ characterName: "swe_shenshanshi" }, "swe_shenshanshi_guiji");
			}
		},
		subSkill: {
			achieve: {
				audio: "swe_guiji",
				trigger: {
					player: "changeSkillsAfter",
				},
				forced: true,
				skillAnimation: true,
				animationColor: "orange",
				filter(event, player) {
					if (player.awakenedSkills?.includes("swe_guiji")) return false;
					if (player.storage.swe_guiji_failed) return false;
					return ["swe_hangxingji", "swe_bingguiji", "swe_huoshengqiang", "swe_denglonghai"].filter(e => player.hasSkill(e)).length >= 4;
				},
				async content(event, trigger, player) {
					player.awakenSkill("swe_guiji");
					game.log(player, "成功完成使命");
					await player.addSkills("swe_yujie");
					lib.skill.swe_guiji.updateSkin(player);
				},
			},
			fail: {
				audio: "swe_guiji",
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					if (player.awakenedSkills?.includes("swe_guiji")) return false;
					if (player.storage.swe_guiji_failed) return false;
					return !player.countCards("h");
				},
				async content(event, trigger, player) {
					player.storage.swe_guiji_failed = true;
					player.syncStorage("swe_guiji_failed");
					player.awakenSkill("swe_guiji");
					game.log(player, "使命失败");
					player.markAuto("swe_zhuogui_banned", []);
					await player.loseMaxHp(1);
					await player.recover();
					lib.skill.swe_guiji.updateSkin(player);
				},
			},
		},
	},
	// 航行技：始终跳过判定和弃牌阶段
	swe_hangxingji: {
		audio: `${ea}swe_shenshanshi:2`,
		trigger: {
			player: ["phaseJudgeBefore", "phaseDiscardBefore"],
		},
		forced: true,
		charlotte: true,
		mark: true,
		marktext: "航",
		intro: {
			content: "始终跳过判定和弃牌阶段",
		},
		filter(event, player) {
			return player.hasSkill("swe_hangxingji", null, false, false);
		},
		async content(event, trigger, player) {
			trigger.cancel();
			game.log(player, "跳过了", "#y" + (event.triggername == "phaseDiscardBefore" ? "弃牌阶段" : "判定阶段"));
		},
		ai: {
			threaten: 1.5,
		},
	},
	swe_bingguiji: {
		trigger: {
			global: ["chooseToDiscardBefore", "damageBegin3"],
		},
		charlotte: true,
		mark: true,
		marktext: "鬼",
		intro: {
			content: "当有角色需要选牌弃置时/受到伤害时，若其可弃置牌数/当前体力值小于所需值，则你可将效果修改为摸等量牌/回复等量体力。",
		},
		logTarget: "player",
		filter(event, player) {
			debugger
			if (!event.player?.isIn()) return false;
			if (event.name === "damage") return event.num > event.player.getHp();
			const need = Array.isArray(event.selectCard) ? event.selectCard[0] : (event.selectCard || 1);
			const can = event.player.countDiscardableCards(player, event.position || "he");
			return can < need;
		},
		async cost(event, trigger, player) {
			debugger
			const target = trigger.player;
			if (trigger.name === "damage") {
				event.result = await player
					.chooseBool(get.prompt2("swe_bingguiji", target), `取消${get.translation(target)}即将受到的${trigger.num}点伤害，改为回复${trigger.num}点体力？`)
					.forResult();
			} else {
				const need = Array.isArray(trigger.selectCard) ? trigger.selectCard[0] : (trigger.selectCard || 1);
				event.result = await player
					.chooseBool(get.prompt2("swe_bingguiji", target), `取消${get.translation(target)}即将弃置的${need}张牌，改为摸${need}张牌？`)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			if (trigger.name === "damage") {
				trigger.cancel();
				await target.recover(trigger.num);
			} else {
				const need = Array.isArray(trigger.selectCard) ? trigger.selectCard[0] : (trigger.selectCard || 1);
				trigger.cancel();
				await target.draw(need);
			}
		},
	},
	// },
	// 火绳枪：造成伤害时额外视为造成3X点伤害
	swe_huoshengqiang: {
		audio: `${ea}swe_shenshanshi:2`,
		trigger: { source: "damageSource" },
		charlotte: true,
		mark: true,
		marktext: "枪",
		intro: {
			content: "当你造成非虚拟伤害时，你可以额外视为对其造成2X点伤害（X为伤害值）。",
		},
		init() {
			lib.element.content.damage[0] = async function (event, trigger, player) {
				event.forceDie = true;
				event.includeOut = true;
				if (event.unreal && !event.unrealForced) {
					event.goto(4);
					return;
				}
				game.callHook("checkDamage1", [event, player]);
				await event.trigger("damageBegin1");
			}
		},
		filter(event, player) {
			if (!player.hasSkill("swe_huoshengqiang", null, false, false)) return false;
			return event.num > 0 && !event.unreal && event.player && event.player.isIn();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseBool(`火绳枪：是否额外视为对${get.translation(trigger.player)}造成${trigger.num * 2}点伤害？`)
				.set("ai", () => {
					return get.attitude(get.player(), trigger.player) < 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			const extra = trigger.num * 2;
			player.line(target, "fire");
			await target.damage(extra, player, "unreal").set("unrealForced", true);
		},
		ai: {
			threaten: 2.0,
		},
	},
	// 灯笼海：每回合限一次，重新指定伤害来源
	swe_denglonghai: {
		audio: `${ea}swe_shenshanshi:2`,
		trigger: { global: "damageBegin3" },
		charlotte: true,
		mark: true,
		marktext: "灯",
		intro: {
			content: "每回合限一次，当有角色受到非虚拟伤害时，你可以重新指定一名其他角色作为伤害来源。",
		},
		usable: 1,
		filter(event, player) {
			if (!player.hasSkill("swe_denglonghai", null, false, false)) return false;
			if (!event.num || event.unreal) return false;
			return game.hasPlayer(p => p != event.source && p.isIn() && p != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget("灯笼海：你可以选择新的伤害来源")
				.set("filterTarget", (cardx, p, t) => {
					return t != get.event()?.sourcex && t.isIn() && t != p;
				})
				.set("sourcex", trigger.source)
				.set("ai", target => {
					const player = get.player();
					const origSource = get.event()?.sourcex;
					if (get.attitude(player, origSource) < 0 && get.attitude(player, target) > 0) return 1;
					if (get.attitude(player, origSource) > 0 && get.attitude(player, target) < 0) return -1;
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const newSource = event.targets?.[0];
			if (!newSource) return;
			player.line(trigger.player, "green");
			game.log(player, "将伤害来源由", trigger.source, "变更为", newSource);
			trigger.source = newSource;
		},
		ai: {
			threaten: 1.5,
		},
	},
	swe_yujie: {
		audio: `shiki_omusubi`,
		trigger: {
			player: "phaseEnd",
			global: "roundStart",
		},
		filter(event, player) {
			if (!player.hasSkill("swe_yujie", null, false, false)) return false;
			return game.hasPlayer(p => p != player && p.isIn() && !player.getStorage("swe_yujie_share", [])?.includes(p));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget("御结：请选择一名其他角色，你们互将对方手牌如自己手牌般使用或打出")
				.set("filterTarget", (cardx, p, t) => {
					return !get.event()?.sourcex?.includes(t) && t.isIn() && t != p;
				})
				.set("sourcex", player.getStorage("swe_yujie_share", []))
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets?.[0];
			if (!target) return;
			player.line(target, "green");
			// 清除旧的御结关系
			const oldTarget = player.storage.swe_yujie_target;
			if (oldTarget && oldTarget != target && oldTarget.isIn()) {
				oldTarget.removeAdditionalSkill(`swe_yujie_share_${player.playerid}`);
				oldTarget.removeAdditionalSkill(`swe_yujie_changed_${player.playerid}`);
				oldTarget.unmarkAuto("swe_yujie_share", [player]);
			}
			if (oldTarget && oldTarget != target) {
				player.removeAdditionalSkill(`swe_yujie_share_${oldTarget.playerid}`);
				player.removeAdditionalSkill(`swe_yujie_changed_${oldTarget.playerid}`);
				player.unmarkAuto("swe_yujie_share", [oldTarget]);
			}
			// 设置新的御结关系
			player.storage.swe_yujie_target = target;
			// 为对方添加使用我方手牌的能力
			target.markAuto("swe_yujie_share", [player]);
			target.addAdditionalSkill(`swe_yujie_share_${player.playerid}`, "swe_yujie_share");
			target.addAdditionalSkill(`swe_yujie_changed_${player.playerid}`, "swe_yujie_changed");
			// 为自己添加使用对方手牌的能力
			player.markAuto("swe_yujie_share", [target]);
			player.addAdditionalSkill(`swe_yujie_share_${target.playerid}`, "swe_yujie_share");
			player.addAdditionalSkill(`swe_yujie_changed_${target.playerid}`, "swe_yujie_changed");
			game.log(player, "与", target, "缔结了", "#y御结");
		},
		group: ["swe_yujie_die"],
		subSkill: {
			die: {
				trigger: { player: "dieBefore" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const target = player.storage.swe_yujie_target;
					if (target?.isIn()) {
						target.removeAdditionalSkill(`swe_yujie_share_${player.playerid}`);
						target.removeAdditionalSkill(`swe_yujie_changed_${player.playerid}`);
						target.unmarkAuto("swe_yujie_share", [player]);
					}
					if (target) {
						player.removeAdditionalSkill(`swe_yujie_share_${target.playerid}`);
						player.removeAdditionalSkill(`swe_yujie_changed_${target.playerid}`);
						player.unmarkAuto("swe_yujie_share", [target]);
					}
				},
			},
			share: {
				init(player, skill) {
					// 清除旧假卡
					const toRemove = player.getCards("s", card => card.hasGaintag("swe_yujie_tag"));
					game.deleteFakeCards(toRemove);
					// 从所标记的角色处创建假卡
					const cards = player.getStorage("swe_yujie_share").reduce((cards, target) => {
						const fake = target.isAlive() && target.countCards("h") ? game.createFakeCards(target.getCards("h")) : [];
						return cards.addArray(fake);
					}, []);
					player.directgains(cards, null, "swe_yujie_tag");
				},
				onremove(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("swe_yujie_tag"));
					game.deleteFakeCards(toRemove);
				},
				mark: true,
				intro: {
					content: "你可以如手牌般使用或打出<span class=thundertext>$</span>的手牌",
				},
				forced: true,
				popup: false,
				delay: false,
				charlotte: true,
				trigger: {
					player: ["useCardBefore", "respondBefore"],
					global: ["swe_yujieChange"],
				},
				filter(event, player) {
					if (["useCard", "respond"].includes(event.name)) {
						const cards = player.getCards("s", card => card.hasGaintag("swe_yujie_tag"));
						return event.cards && event.cards.some(card => cards.includes(card));
					}
					return player.getStorage("swe_yujie_share").includes(event.player);
				},
				async content(event, trigger, player) {
					const tag = "swe_yujie_tag";
					if (["useCard", "respond"].includes(trigger.name)) {
						trigger.set("swe_yujie", player);
						const real = player.getStorage("swe_yujie_share").reduce((cards, target) => {
							const hs = target.isAlive() && target.countCards("h") ? target.getCards("h") : [];
							return cards.addArray(hs);
						}, []);
						for (let i = 0; i < trigger.cards.length; i++) {
							const card = trigger.cards[i];
							const cardx = real.find(cardx => cardx.cardid == card._cardid);
							if (cardx) {
								trigger.cards[i] = cardx;
								trigger.card.cards[i] = cardx;
							}
						}
					} else {
						game.deleteFakeCards(player.getCards("s", card => trigger.toRemove.find(cardx => cardx.cardid == card._cardid)));
						player.directgains(game.createFakeCards(trigger.toAdd), null, tag);
					}
				},
			},
			changed: {
				trigger: {
					global: ["loseEnd", "loseAsyncEnd", "gainEnd", "addToExpansionEnd", "equipEnd", "addJudgeEnd"],
				},
				silent: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return event.getg?.(player)?.length || event.getl?.(player)?.hs?.length;
				},
				forceDie: true,
				async content(event, trigger, player) {
					const toAdd = trigger.getg?.(player) || [],
						toRemove = trigger.getl?.(player)?.hs || [];
					event.set("toAdd", toAdd);
					event.set("toRemove", toRemove);
					await event.trigger("swe_yujieChange");
				},
			},
		},
		ai: {
			threaten: 2.0,
		},
	},
	swe_yuzhao: {
		audio: `${ea}swe_minglaibaiyu:2`,
		trigger: { global: "judge" },
		filter(event, player) {
			return true;
		},
		onremove: true,
		popup: false,
		async cost(event, trigger, player) {
			if (player.getStorage("swe_yuzhao", false)) {
				const result = await player.chooseBool(get.prompt("swe_yuzhao", trigger.player), "观看牌堆顶的三张牌，打出其中一张牌代替之")
					.forResult();
				event.result = {
					bool: result.bool,
					cost_data: { choice: "选项一" },
				};
			}
			else {
				const list = ["选项一", "选项二", "cancel2"];
				const result = await player
					.chooseControl(list)
					.set("prompt", get.prompt("swe_yuzhao", trigger.player))
					.set("choiceList", [
						"观看牌堆顶的三张牌，打出其中一张牌代替之",
						"选择并打出一张任意花色和点数的虚拟牌代替之，若如此做，你重新获得仅有选项一的此技能",
					])
					//.set("displayIndex", false)
					.set("ai", () => {
						const player = get.player();
						const evt = _status.event.getTrigger();
						if (!evt || !evt.player?.judging?.[0]) return "cancel2";
						const result = evt.judge(evt.player.judging[0]);
						if (get.attitude(player, evt.player) > 0) return result < 0 ? "选项一：观星改判" : "cancel2";
						return result > 0 ? "选项一：观星改判" : "cancel2";
					})
					.forResult();
				event.result = {
					bool: result.control && result.control !== "cancel2",
					cost_data: { choice: result.control },
				};
			}
		},
		async content(event, trigger, player) {
			const choice = event.cost_data.choice;
			if (choice === "选项一") {
				const cards = get.cards(3, true);
				const { links } = await player
					.chooseButton([
						`预兆：${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，选择一张牌打出以改判}`,
						cards,
					], true)
					.set("filterButton", button => {
						const player = get.player();
						const card = button.link;
						const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod2 != "unchanged") return mod2;
						const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
						if (mod != "unchanged") return mod;
						return true;
					})
					.set("ai", button => {
						const card = button.link;
						const trigger = get.event().getTrigger();
						const player = get.player();
						const judging = get.event().judging;
						const result = trigger.judge(card) - trigger.judge(judging);
						const attitude = get.attitude(player, trigger.player);
						return result * attitude;
					})
					.set("judging", trigger.player.judging[0])
					.forResult();
				if (!links || !links.length) return;
				await player.respond(links, "swe_yuzhao", "highlight", "noOrdering");
				if (trigger.player.judging[0].clone) {
					trigger.player.judging[0].clone.classList.remove("thrownhighlight");
					game.broadcast(function (card) {
						if (card.clone) card.clone.classList.remove("thrownhighlight");
					}, trigger.player.judging[0]);
					game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
				}
				await game.cardsDiscard(trigger.player.judging[0]);
				trigger.player.judging[0] = links[0];
				trigger.orderingCards.addArray(links);
				game.log(trigger.player, "的判定牌改为", links[0]);
			}
			else if (choice === "选项二") {
				const numbers = Array.from({ length: 13 }).map((_, i) => get.strNumber(i + 1));
				const result = await player
					.chooseButton(
						[
							"预兆：请选择花色和点数",
							[lib.suit.slice().reverse().map(i => [i, get.translation(i)]), "tdnodes"],
							[numbers, "tdnodes"],
						],
						2,
						true
					)
					.set("filterButton", button => {
						const numbers = Array.from({ length: 13 }).map((_, i) => get.strNumber(i + 1));
						return !ui.selected.buttons.some(but => {
							return [lib.suit, numbers].some(list => list.includes(but.link) && list.includes(button.link));
						});
					})
					.set("ai", () => 1 + Math.random())
					.forResult();
				if (!result?.bool || result?.links?.length < 2) return;
				const suit = lib.suit.includes(result.links[0]) ? result.links[0] : result.links[1];
				const numStr = numbers.includes(result.links[0]) ? result.links[0] : result.links[1];
				const virtualCard = get.autoViewAs({ name: "shandian", suit: suit, number: get.numString(numStr), isCard: true });
				virtualCard.clone = { classList: [], };
				// await game.cardsDiscard(trigger.player.judging[0]);
				// trigger.player.judging[0] = virtualCard;
				// trigger.orderingCards.add(virtualCard);
				// game.log(trigger.player, "的判定牌改为", virtualCard);
				const links = [virtualCard]
				await player.respond(links, "swe_yuzhao", "highlight", "noOrdering").set("card", links[0]).set("cards", links);
				if (trigger.player.judging[0].clone) {
					trigger.player.judging[0].clone.classList.remove("thrownhighlight");
					game.broadcast(function (card) {
						if (card.clone) card.clone.classList.remove("thrownhighlight");
					}, trigger.player.judging[0]);
					game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
				}
				await game.cardsDiscard(trigger.player.judging[0]);
				trigger.player.judging[0] = links[0];
				trigger.orderingCards.addArray(links);
				game.log(trigger.player, "的判定牌改为", links[0]);
				await player.removeSkills("swe_yuzhao");
				await player.addSkills("swe_yuzhao");
				player.setStorage("swe_yuzhao", true);
			}
		},
		ai: {
			rejudge: true,
			tag: { rejudge: 1 },
		},
	},
	swe_chunbai: {
		audio: `${ea}swe_minglaibaiyu:2`,
		trigger: { player: "damageBegin3" },
		forced: true,
		locked: true,
		filter(event, player) {
			return event.num > 0;
		},
		async content(event, trigger, player) {
			trigger.cancel();
			await player.loseHp();
			await player.draw();
		},
		ai: { threaten: 0.3 },
	},
	swe_kaoyu: {
		audio: `${ea}swe_minglaibaiyu:3`,
		onChooseToUse(event) {
			const player = event.player;
			if (!game.online && (player.getStat().skill.swe_kaoyu || 0) < lib.skill.swe_kaoyu.usable) {
				event.set("swe_kaoyu", player.getHistory("gain").reduce((cards, evt) => cards.addArray(evt.cards), []));
			}
		},
		enable: "chooseToUse",
		usable: 1,
		filter(event, player) {
			const cards = player.getCards("h", card => event.swe_kaoyu?.includes(card));
			return ["sha", "shan", "tao", "jiu"].some(name => cards.some(i => event.filterCard(get.autoViewAs({ name }, [i]), player, event)));
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = [];
				const cards = player.getCards("h", card => event.swe_kaoyu?.includes(card));
				for (const name of ["sha", "shan", "tao", "jiu"]) {
					if (cards.some(i => event.filterCard(get.autoViewAs({ name }, [i]), player, event))) vcards.push(["基本", "", name]);
				}
				const dialog = ui.create.dialog("烤鱼", [vcards, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				const player = get.player();
				if (_status.event.getParent().type !== "phase") return 1;
				return player.getUseValue({ name: button.link[2] }, null, true);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			backup(links, player) {
				return {
					audio: "swe_kaoyu",
					filterCard(card, player) {
						return get.event().swe_kaoyu?.includes(card) && get.position(card) === "h";
					},
					position: "h",
					selectCard() { if (ui.selected.cards.length) return -1; return 1; },
					check(card) {
						return 7 - get.value(card);
					},
					viewAs: { name: links[0][2] },
					precontent() {
						player.logSkill("swe_kaoyu");
					},
				};
			},
			prompt(links) {
				return `将本回合获得的所有牌当作【${get.translation(links[0][2])}】使用`;
			},
		},
		ai: {
			order(item, player) {
				return get.event().type === "phase" ? get.order({ name: "sha" }, player) + 0.1 : 1;
			},
			respondSha: true,
			respondShan: true,
			respondTao: true,
			save: true,
			skillTagFilter(player, tag, arg) {
				const cards = player.getHistory("gain").reduce((cards, evt) => cards.addArray(evt.cards), []);
				return arg !== "respond" && (player.getStat().skill.swe_kaoyu || 0) < lib.skill.swe_kaoyu.usable && cards.containsSome(...player.getCards("h"));
			},
			result: { player: 1 },
		},
	},
	swe_guying: {
		audio: `${ea}swe_minglaibaiyu:2`,
		trigger: {
			player: ["chooseToUseAfter", "chooseToRespondAfter"],
		},
		filter(event, player) {
			if (!event.respondTo || event.respondTo?.[0] === player || event.result.bool) return false;
			// 该牌目标须包含自己
			const targets = event.getParent((evt) => evt.name === "useCard")?.targets;
			if (!targets?.includes(player)) return false;
			return event.respondTo?.[0] && event.respondTo?.[0].isIn();
		},
		async cost(event, trigger, player) {
			const source = trigger.respondTo?.[0];
			if (!source || source === player) {
				event.result = { bool: false };
				return;
			}
			event.result = await player
				.chooseBool(`孤影：是否与${get.translation(source)}各进行一次虚拟闪电判定？`)
				.set("ai", () => get.attitude(get.player(), source) < 0)
				.forResult();
		},
		async content(event, trigger, player) {
			const source = trigger.respondTo?.[0];
			if (!source) return;
			player.line(source, "thunder");
			const count = player.getHistory("useSkill", (evt) => evt.skill == "swe_guying")?.length || 0;
			const isEven = count % 2 === 0;
			for (const target of [player, source]) {
				if (!target.isIn()) continue;
				const next = target.executeDelayCardEffect("shandian");
				if (isEven) {
					next.judge = card => -lib.card.shandian.judge(card) - 4;
					next.judge2 = result => !lib.card.shandian.judge2(result);
				}
				const _oldEffect = lib.card.shandian.effect;
				lib.card.shandian.effect = async function (event, trigger, player, result) {
					if (result.bool === false) {
						player.damage(2, "thunder", "nosource");
					} else {
						player.addJudgeNext(event.card);
					}
				};
				await next;
				lib.card.shandian.effect = _oldEffect;
			}
			const skills = game.filterSkills(
				player.getSkills(null, false, false).filter((skill) => {
					let info = get.info(skill);
					if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
						return false;
					}
					return true;
				}),
				player
			);
			if (skills?.[0]) {
				player.disableSkill("swe_guying", skills[0]);
				player.addTempSkill("swe_guying_restore");
				game.log(player, "的技能", `【${get.translation(skills[0])}】`, "于本回合失效");
			}
		},
		subSkill: {
			restore: {
				charlotte: true,
				onremove(player) {
					player.enableSkill("swe_guying");
					game.log(player, "恢复了技能");
				},
			},
		},
		ai: { threaten: 1.2 },
	},
	// 睡死
	swe_fenke: {
		audio: `${ea}swe_shuisi:2`,
		group: ["swe_fenke_init", "swe_fenke_copy", "swe_fenke_move"],
		async moveMark(player) {
			const types = ["judge", "draw", "play", "discard"];
			const names = { judge: "判定", draw: "摸牌", play: "出牌", discard: "弃牌" };
			if (!game.hasPlayer(p => types.some(t => p.countMark("swe_fenke_" + t) > 0))) return false;
			const result = await player.chooseTarget({
				prompt: "分刻：移动场上一个标记至其他角色处",
				filterTarget(card, player, target) {
					if (!ui.selected.targets?.length) {
						return types.some(t => target.countMark("swe_fenke_" + t) > 0);
					}
					return target != ui.selected.targets[0] && target != player;
				},
				selectTarget: 2,
				complexTarget: true,
				ai(target) {
					const player = get.player();
					if (!ui.selected.targets?.length) {
						return -get.attitude(player, target);
					}
					return get.attitude(player, target);
				},
				targetprompt: ["失去标记", "获得标记"],
			}).forResult();
			if (!result?.bool || result.targets?.length !== 2) return false;
			const source = result.targets[0];
			const dest = result.targets[1];
			const sourceTypes = types.filter(t => source.countMark("swe_fenke_" + t) > 0);
			let type = sourceTypes[0];
			if (sourceTypes.length > 1) {
				const typeResult = await player.chooseControl(...sourceTypes)
					.set("prompt", "分刻：选择要移动的标记类型")
					.set("choiceList", sourceTypes.map(t => names[t] + "标记"))
					.forResult();
				if (typeResult.control) type = typeResult.control;
			}
			if (!type) return false;
			source.removeMark("swe_fenke_" + type, 1);
			dest.addMark("swe_fenke_" + type, 1);
			game.log(source, "的", names[type] + "标记", "移动至", dest);
			return true;
		},
		ai: { threaten: 1 },
	},
	swe_fenke_judge: {
		mark: true,
		marktext: "判",
		intro: { content: "拥有「判」标记的角色，其判定阶段结束后令睡死执行一个判定阶段" },
	},
	swe_fenke_draw: {
		mark: true,
		marktext: "摸",
		intro: { content: "拥有「摸」标记的角色，其摸牌阶段结束后令睡死执行一个摸牌阶段" },
	},
	swe_fenke_play: {
		mark: true,
		marktext: "出",
		intro: { content: "拥有「出」标记的角色，其出牌阶段结束后令睡死执行一个出牌阶段" },
	},
	swe_fenke_discard: {
		mark: true,
		marktext: "弃",
		intro: { content: "拥有「弃」标记的角色，其弃牌阶段结束后令睡死执行一个弃牌阶段" },
	},
	swe_fenke_init: {
		trigger: { global: "gameStart" },
		forced: true,
		silent: true,
		async content(event, trigger, player) {
			const types = ["judge", "draw", "play", "discard"];
			for (const type of types) player.addMark("swe_fenke_" + type, 1);
			game.log(player, "发动了", "【分刻】", "，获得判定、摸牌、出牌、弃牌标记");
		},
	},
	swe_fenke_copy: {
		trigger: { global: "phaseAfter" },
		forced: true,
		filter(event, player) {
			if (player.hasSkill("swe_fenke_copying")) return false;
			const current = event.player;
			if (!current || current === player) return false;
			return ["judge", "draw", "play", "discard"].some(t => current.countMark("swe_fenke_" + t) > 0);
		},
		async content(event, trigger, player) {
			const current = trigger.player;
			const types = ["judge", "draw", "play", "discard"];
			const phaseMap = { judge: "phaseJudge", draw: "phaseDraw", play: "phaseUse", discard: "phaseDiscard" };
			const phases = types.filter(t => current.countMark("swe_fenke_" + t) > 0).map(t => phaseMap[t]);
			if (!phases.length) return;
			player.logSkill("swe_fenke");
			player.addTempSkill("swe_fenke_copying");
			player.insertPhase("swe_fenke_copy").set("phaseList", phases);
		},
	},
	swe_fenke_copying: {
		charlotte: true,
		silent: true,
	},
	swe_fenke_move: {
		trigger: { global: "roundStart" },
		filter(event, player) {
			return game.filterPlayer(p => ["judge", "draw", "play", "discard"].some(t => p.countMark("swe_fenke_" + t) > 0)).length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseBool("分刻：是否移动一枚标记？")
				.set("ai", () => true)
				.forResult();
		},
		async content(event, trigger, player) {
			player.logSkill("swe_fenke");
			await lib.skill.swe_fenke.moveMark(player);
		},
	},
	swe_dunyi: {
		audio: `${ea}swe_shuisi:2`,
		group: ["swe_dunyi_draw_buff", "swe_dunyi_play_track"],
		trigger: { player: ["phaseJudgeBegin", "phaseDrawBegin", "phaseUseBegin", "phaseDiscardBegin"] },
		filter(event, player) {
			return !player.hasSkill("swe_dunyi_used");
		},
		async cost(event, trigger, player) {
			const lost = Math.max(player.maxHp - player.hp, 1);
			const list = ["cancel2", "swe_dunyi_judge", "swe_dunyi_draw", "swe_dunyi_play", "swe_dunyi_reveal"];
			const choiceList = [
				"不发动",
				"下个判定阶段发动【司命】时可选择一名其他玩家一同进行判定",
				"下个摸牌阶段额外摸X张牌",
				"下个出牌阶段使用过三种类别的牌后令一名其他角色流失1点体力",
				"明置一名角色的X张手牌",
			];
			const result = await player.chooseControl(...list)
				.set("prompt", `遁逸：是否跳过本阶段并选择一项？（X=${lost}）`)
				.set("choiceList", choiceList)
				.set("ai", () => "swe_dunyi_draw")
				.forResult();
			if (!result.control || result.control === "cancel2") {
				event.result = { bool: false };
				return;
			}
			event.result = { bool: true, cost_data: { choice: result.control } };
		},
		async content(event, trigger, player) {
			const choice = event.cost_data.choice;
			const lost = Math.max(player.maxHp - player.hp, 1);
			trigger.cancel();
			player.logSkill("swe_dunyi");
			player.addTempSkill("swe_dunyi_used");
			switch (choice) {
				case "swe_dunyi_judge":
					player.storage.swe_dunyi_judge = true;
					game.log(player, "选择：下个判定阶段发动【司命】时可选择一名其他玩家一同进行判定");
					break;
				case "swe_dunyi_draw":
					player.storage.swe_dunyi_draw = (player.getStorage("swe_dunyi_draw", 0) || 0) + lost;
					game.log(player, "选择：下个摸牌阶段额外摸X张牌（累计", player.storage.swe_dunyi_draw, "张）");
					break;
				case "swe_dunyi_play":
					player.storage.swe_dunyi_play = true;
					game.log(player, "选择：下次出牌阶段首次使用过三种类型的牌后令一名其他角色流失1点体力");
					break;
				case "swe_dunyi_reveal": {
					const target = (await player.chooseTarget("遁逸：选择一名角色", `明置其${lost}张手牌`,
						(card, p, t) => t.countCards('h', cd => !get.is.shownCard(cd)) > 0)
						.set("ai", t => -get.attitude(get.player(), t))
						.forResult()).targets[0];
					if (!target) break;
					const cards = target.getCards('h', cd => !get.is.shownCard(cd)).randomGets(lost);
					if (cards.length) {
						target.addGaintag(cards, "swe_dunyi_reveal_tag");
						await target.addShownCards(cards, "visible_swe_shuisi");
						await target.showCards(cards, get.translation(player) + `对${get.translation(target)}发动了【遁逸】`);
						target.addTempSkill("swe_dunyi_reveal_tag", "roundStart");
					}
					break;
				}
			}
		},
		ai: { threaten: 0.5 },
	},
	swe_dunyi_used: {
		charlotte: true,
		silent: true,
	},
	swe_dunyi_reveal_tag: {
		charlotte: true,
		onremove(player) {
			player.removeGaintag("swe_dunyi_reveal_tag");
		},
		mod: {
			cardDiscardable(card, player) {
				if (card.hasGaintag("swe_dunyi_reveal_tag")) {
					return false;
				}
			},
		},
	},
	swe_dunyi_draw_buff: {
		trigger: { player: "phaseDrawBegin2" },
		forced: true,
		silent: true,
		filter(event, player) {
			return (player.getStorage("swe_dunyi_draw", 0) || 0) > 0;
		},
		content(event, trigger, player) {
			const x = player.getStorage("swe_dunyi_draw", 0) || 0;
			trigger.num += x;
			delete player.storage.swe_dunyi_draw;
			game.log(player, "的摸牌阶段额外摸", x, "张牌");
		},
	},
	swe_dunyi_play_track: {
		trigger: { player: ["useCardAfter", "phaseUseEnd"] },
		forced: true,
		silent: true,
		filter(event, player) {
			if (!player.getStorage("swe_dunyi_play", false)) return false;
			if (event.triggername === "useCardAfter") {
				return player.isPhaseUsing();
			}
			return true;
		},
		async content(event, trigger, player) {
			if (event.triggername === "phaseUseEnd") {
				delete player.storage.swe_dunyi_play;
				player.setStorage("swe_dunyi_play_types", [], true);
				return;
			}
			player.markAuto("swe_dunyi_play_types", get.type2(trigger.card));
			if (player.getStorage("swe_dunyi_play_types").length >= 3) {
				player.setStorage("swe_dunyi_play_types", [], true);
				delete player.storage.swe_dunyi_play;
				const dr = await player.chooseTarget("遁逸：令一名其他角色流失1点体力", "",
					(card, p, t2) => t2 !== p && t2.isIn()).set("ai", t2 => -get.attitude(get.player(), t2)).forResult();
				if (dr.bool && dr.targets[0]) await dr.targets[0].loseHp();
			}
		},
	},
	swe_siming_play_tag: {
		charlotte: true,
		onremove(player) {
			player.removeGaintag("swe_siming_play_tag");
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("swe_siming_play_tag")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("swe_siming_play_tag")) {
					return false;
				}
			},
		},
	},
	swe_siming: {
		audio: `${ea}swe_shuisi:2`,
		locked: true,
		group: ["swe_siming_judge", "swe_siming_draw", "swe_siming_play", "swe_siming_discard", "swe_siming_discard_reset"],
		ai: { threaten: 1 },
	},
	swe_siming_judge: {
		trigger: { player: "phaseJudgeAfter" },
		forced: true,
		filter(event, player) {
			return !player.hasSkill("swe_fenke_copying");
		},
		async content(event, trigger, player) {
			player.logSkill("swe_siming");
			let extraTarget = null;
			if (player.getStorage("swe_dunyi_judge", false)) {
				delete player.storage.swe_dunyi_judge;
				const extra = await player.chooseTarget("司命：可额外选择一名角色进行判定", "",
					(card, p, t) => t !== p && t.isIn()).set("ai", t => -get.attitude(get.player(), t)).forResult();
				extraTarget = extra.targets[0] || null;
			}
			const result = await player.judge().forResult();
			if (get.suit(result.card) === "spade") {
				await player.damage(2, "nosource");
			}
			if (extraTarget) {
				const extraResult = await extraTarget.judge().forResult();
				if (get.suit(extraResult.card) === "spade") {
					await extraTarget.damage(2, "nosource");
				}
			}
		},
	},
	swe_siming_draw: {
		trigger: { player: "phaseDrawEnd" },
		forced: true,
		direct: true,
		filter(event, player) {
			return !player.hasSkill("swe_fenke_copying");
		},
		async content(event, trigger, player) {
			player.logSkill("swe_siming");
			const handNum = player.countCards("h");
			if (!handNum) return;
			const others = game.filterPlayer(p => p !== player && p.isAlive());
			if (!others.length || !others.every(p => p.countCards("h") < handNum)) return;
			const types = ["basic", "trick", "equip"];
			const names = { basic: "基本牌", trick: "锦囊牌", equip: "装备牌" };
			const ownedTypes = types.filter(t => player.getCards("h").some(c => get.type2(c) === t));
			if (!ownedTypes.length) return;
			let type;
			if (ownedTypes.length === 1) {
				type = ownedTypes[0];
			} else {
				const result = await player.chooseControl(...ownedTypes)
					.set("prompt", "司命：重铸一种类别的所有手牌")
					.set("choiceList", ownedTypes.map(t => names[t]))
					.forResult();
				type = result.control;
			}
			if (!type) return;
			const cards = player.getCards("h").filter(c => get.type2(c) === type);
			if (cards.length) await player.recast(cards);
		},
	},
	swe_siming_play: {
		trigger: { player: "phaseUseEnd" },
		forced: true,
		direct: true,
		filter(event, player) {
			return !player.hasSkill("swe_fenke_copying");
		},
		async content(event, trigger, player) {
			player.logSkill("swe_siming");
			const phaseEvent = event.getParent("phaseUse");
			const causedDamage = player.getHistory("sourceDamage", evt =>
				evt.getParent("phaseUse") === phaseEvent && evt.player !== player
			).length > 0;
			if (!causedDamage) {
				await lib.skill.swe_fenke.moveMark(player);
				const next = player.draw(1);
				next.gaintag = ["swe_siming_play_tag"];
				await next;
				player.addTempSkill("swe_siming_play_tag");
			}
		},
	},
	swe_siming_discard: {
		trigger: { player: "phaseDiscardEnd" },
		forced: true,
		direct: true,
		filter(event, player) {
			return !player.hasSkill("swe_fenke_copying");
		},
		async content(event, trigger, player) {
			player.logSkill("swe_siming");
			const used = player.getStorage("swe_siming_discard_used", []);
			const result = await player.chooseTarget("司命：令一名其他角色进行弃牌阶段", "",
				(card, p, t) => t !== p && t.isIn() && !used.includes(t.playerid)).set("ai", t => -get.attitude(get.player(), t)).forResult();
			if (!result.bool) return;
			const target = result.targets[0];
			if (!target) return;
			player.markAuto("swe_siming_discard_used", [target.playerid]);
			const before = target.getCards('h');
			await target.phaseDiscard();
			const still = new Set(target.getCards('h'));
			const discarded = before.filter(c => !still.has(c));
			const types = new Set(discarded.map(c => get.type2(c)));
			if (types.has("basic") && types.has("trick") && types.has("equip")) {
				await player.gainMaxHp();
				await target.gainMaxHp();
			}
		},
	},
	swe_siming_discard_reset: {
		trigger: { global: "roundStart" },
		forced: true,
		silent: true,
		content(event, trigger, player) {
			player.setStorage("swe_siming_discard_used", [], true);
		},
	},
	// 符玄
	swe_pitai: {
		audio: `${ea}swe_fuxuan:3`,
		trigger: {
			player: ["changeHp", "gainAfter", "loseAfter"],
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			const used = player.getStorage("swe_pitai", []);
			if (event.name === "changeHp") {
				return event.num < 0 && player.isMinHp() && !used.includes("hp");
			}
			if (used.includes("hand")) return false;
			if (event.name === "gainAfter") {
				return (event.cards || []).some((card) => get.position(card) === "h") && player.isMinHandcard();
			}
			return (event.hs || []).length > 0 && player.isMinHandcard();
		},
		async cost(event, trigger, player) {
			if (event.triggername === "changeHp") {
				const maxHp = Math.max(...game.filterPlayer().map((cur) => cur.getHp()));
				event.result = await player
					.chooseBool(`是否发动${get.poptip("swe_pitai")}，将体力回复至全场最高（${maxHp}点）？`)
					.set("ai", () => 1)
					.forResult();
			} else {
				const maxHand = Math.max(...game.filterPlayer().map((cur) => cur.countCards("h")));
				event.result = await player
					.chooseBool(`是否发动${get.poptip("swe_pitai")}，将手牌数摸至全场最多（${maxHand}张）？`)
					.set("ai", () => 1)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const func = async () => {
				if (typeof swTool.playSkillVideo === "function") {
					game.broadcastAll(function () {
						swTool.playSkillVideo("fuxuan", 3600);
					})
					await game.delay(0, 3600);
				}
			}
			if (event.triggername === "changeHp") {
				player.markAuto("swe_pitai", ["hp"]);
				const num = Math.max(...game.filterPlayer().map((cur) => cur.getHp()));
				if(num - player.getHp(true) >= 2) func();
				await player.recoverTo(num);
			} else {
				player.markAuto("swe_pitai", ["hand"]);
				const num = Math.max(...game.filterPlayer().map((cur) => cur.countCards("h")));
				if(num - player.countCards("h") >= 4) func();
				await player.drawTo(num);
			}
		},
		mark: true,
		marktext: "否",
		intro: {
			content(storage, player) {
				const used = player.getStorage("swe_pitai", []);
				const names = { hp: "体力项", hand: "手牌项" };
				return "本轮已使用：" + (used.length ? used.map((item) => names[item]).join("、") : "无");
			},
		},
		group: ["swe_pitai_reset"],
		subSkill: {
			reset: {
				charlotte: true,
				trigger: { global: "roundStart" },
				forced: true,
				popup: false,
				content(event, trigger, player) {
					player.setStorage("swe_pitai", [], true);
					player.updateMarks("swe_pitai");
				},
			},
		},
		ai: { threaten: 0.8 },
	},
	swe_qiongguan: {
		audio: `${ea}swe_fuxuan:4`,
		logAudio() {
			return [`${ea}swe_fuxuan/swe_qiongguan1`, `${ea}swe_fuxuan/swe_qiongguan2`];
		},
		trigger: { player: "phaseJudgeBegin" },
		frequent: true,
		group: ["swe_qiongguan_choose", "swe_qiongguan_transfer", "swe_qiongguan_die"],
		async content(event, trigger, player) {
			await player.chooseToGuanxing(game.countPlayer()).set("prompt", "穷观：点击或拖动将牌移动到牌堆顶或牌堆底");
		},
		subSkill: {
			choose: {
				audio: [`${ea}swe_fuxuan/swe_qiongguan3`, `${ea}swe_fuxuan/swe_qiongguan4`],
				charlotte: true,
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return game.hasPlayer((p) => p != player && p.isIn());
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(`是否发动${get.poptip("swe_qiongguan")}，选择至多三名其他角色？`, [1, 3], (card, p, target) => target != p && target.isIn())
						.set("ai", (target) => get.attitude(get.player(), target))
						.forResult();
				},
				async content(event, trigger, player) {
					const { targets } = event;
					// 只移除自己上过的旧标记，其他符玄的归属不动
					game.filterPlayer((p) => p.getStorage("swe_qiongguan_mark", []).includes(player) && !targets.includes(p)).forEach((p) => {
						p.unmarkAuto("swe_qiongguan_mark", [player]);
					});
					for (const target of targets) {
						if (!target.getStorage("swe_qiongguan_mark", []).includes(player)) {
							target.markAuto("swe_qiongguan_mark", [player]);
						}
					}
					game.log(player, "令", targets, "获得了", "#y“穷”标记");
				},
			},
			mark: {
				charlotte: true,
				mark: true,
				marktext: "穷",
				intro: {
					content(storage, player) {
						const owners = player.getStorage("swe_qiongguan_mark", []);
						return "受到伤害时，" + owners.map((owner) => get.translation(owner)).join("、") + "可以将此伤害转移给自己";
					},
				},
			},
			transfer: {
				audio: [`${ea}swe_fuxuan/swe_qiongguan3`, `${ea}swe_fuxuan/swe_qiongguan4`],
				charlotte: true,
				trigger: { global: "damageBegin4" },
				usable: 1,
				logTarget: "player",
				filter(event, player) {
					return event.player != player && event.num > 0 && event.player.getStorage("swe_qiongguan_mark", []).includes(player);
				},
				check(event, player) {
					return get.attitude(player, event.player) > 0;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseBool(`是否发动${get.poptip("swe_qiongguan")}，将${get.translation(trigger.player)}即将受到的伤害${trigger.num || 0}点转移给你？`)
						.set("ai", () => {
							const { att } = get.event();
							return att > 0;
						})
						.set("att", get.attitude(player, trigger.player))
						.forResult();
				},
				async content(event, trigger, player) {
					player.line(trigger.player, "green");
					trigger.player = player;
				},
			},
			die: {
				charlotte: true,
				trigger: { player: "dieBefore" },
				forced: true,
				popup: false,
				content(event, trigger, player) {
					game.filterPlayer((p) => p.getStorage("swe_qiongguan_mark", []).includes(player)).forEach((p) => {
						p.unmarkAuto("swe_qiongguan_mark", [player]);
					});
				},
			},
		},
		ai: { threaten: 1 },
	},
	// 小春
	swe_maodian: {
		audio: `${ea}swe_xiaochun:2`,
		locked: true,
		forced: true,
		group: ["swe_maodian_start", "swe_maodian_judge", "swe_maodian_armor", "swe_maodian_damage"],
		subSkill: {
			start: {
				charlotte: true,
				audio: "swe_maodian",
				trigger: { global: "gameStart" },
				forced: true,
				async content(event, trigger, player) {
					await player.changeHujia(1, null, true);
				},
			},
			judge: {
				charlotte: true,
				audio: "swe_maodian",
				trigger: { player: "phaseJudgeBefore" },
				filter(event, player) {
					return player.hujia > 0;
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.cancel();
					game.log(player, "因拥有护甲跳过了", "#y判定阶段");
				},
			},
			armor: {
				charlotte: true,
				audio: "swe_maodian",
				trigger: { player: ["useCard", "respond"] },
				filter(event, player) {
					const name = get.name(event.card);
					if (name !== "sha") return false;// && name !== "shan"
					return (event.cards || []).length > 0;
				},
				popup: false,
				forced: true,
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget(`请选择一名角色获得1点护甲`, 1)
						.set("forced", true)
						.set("ai", (target) => {
							const att = get.attitude(player, target);
							if (att > 0) return 1 + att;
							return 0.5;
						})
						.forResult();
					const target = result.targets && result.targets[0];
					if (!target) return;
					player.logSkill(event.name, target);
					await target.changeHujia(1, null, true);
				},
			},
			damage: {
				charlotte: true,
				audio: "swe_maodian",
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.player.hujia > 0 && event.num > 0;
				},
				forced: true,
				async content(event, trigger, player) {
					const bonus = 2 * trigger.player.hujia;
					trigger.num += bonus;
					game.log("#g【锚点】", `：伤害+${bonus}`);
				},
			},
		},
		ai: {
			threaten: 1.5,
		},
	},
	swe_maopao: {
		audio: `${ea}swe_xiaochun:2`,
		enable: "chooseToUse",
		usable: 1,
		filter(event, player) {
			if (event.type !== "phase") return false;
			//if (player.hujia == player.getHp()) return false;
			return lib.inpile.some((name) => {
				const card = { name, isCard: true };
				return get.is.damageCard(card) && !get.tag(card, "multitarget") && lib.filter.cardEnabled(card, player) && player.hasUseTarget(card);
			});
		},
		chooseButton: {
			dialog(event, player) {
				const list = lib.inpile
					.filter((name) => {
						const card = { name, isCard: true };
						return get.is.damageCard(card) && !get.tag(card, "multitarget") && lib.filter.cardEnabled(card, player) && player.hasUseTarget(card);
					})
					.map((name) => ["伤害牌", "", name]);
				return ui.create.dialog("###【锚炮】###<div class='text center'>请选择要使用的牌</div>", [list, "vcard"]);
			},
			check(button) {
				return get.player().getUseValue({ name: button.link[2], isCard: true });
			},
			backup(links, player) {
				return {
					audio: "swe_maopao",
					popname: false,
					popup: false,
					slient: true,
					cardName: links[0][2],
					filterCard: () => false,
					selectCard: -1,
					position: "h",
					filterTarget(card, player, target) {
						const vcard = { name: get.info(_status.event.skill).cardName, isCard: true };
						return lib.filter.targetEnabled(vcard, player, target) && lib.filter.targetInRange(vcard, player, target);
					},
					selectTarget: 1,
					async content(event, trigger, player) {
						const cardName = get.info(event.name).cardName;
						const newHp = Math.min(player.hujia, player.maxHp);
						const delta = newHp - player.hp;
						const X = Math.abs(delta);
						if (delta !== 0) {
							if (delta > 0) {
								const before = player.hp;
								await player.recover(delta);
								const recovered = player.hp - before;
								if (recovered > 0) {
									player.setStorage("swe_maopao_recover", player.getStorage("swe_maopao_recover", 0) + recovered);
								}
							} else {
								await player.loseHp(-delta);
							}
						}
						if (!player.isIn()) return;
						const chosen = [];
						if (X > 0) {
							const list = [
								[1, "<span style='display:inline-flex;align-items:center;justify-content:center;width:230px;height:40px;text-align:center'>你与此牌目标各获得1点护甲</span>"],
								[2, "<span style='display:inline-flex;align-items:center;justify-content:center;width:230px;height:40px;text-align:center'>目标非锁定技于本回合失效</span>"],
								[3, "<span style='display:inline-flex;align-items:center;justify-content:center;width:230px;height:40px;text-align:center'>摸护甲数张牌</span>"],
								[4, "<span style='display:inline-flex;align-items:center;justify-content:center;width:230px;height:40px;text-align:center'>此技能视为未发动过</span>"],
							];
							const result = await player
								.chooseButton({
									createDialog: ["###【锚炮】###<div class='text center'>请选择至多" + get.cnNumber(X) + "项</div>", [list, "tdnodes"]],
									selectButton: [1, Math.min(X, list.length)],
								})
								.set("ai", (button) => {
									const num = button.link;
									if (num === 1) return 4;
									if (num === 2) return 2;
									if (num === 3) return 3;
									if (num === 4) return 1;
									return 0;
								})
								.forResult();
							if (result.links && result.links.length) chosen.push(...result.links);
						}
						const target = event.target;
						if (chosen.includes(1)) {
							await player.changeHujia(1, null, true);
							await target.changeHujia(1, null, true);
						}
						if (chosen.includes(2)) {
							target.addTempSkill("fengyin");
						}
						if (chosen.includes(3)) {
							await player.draw(player.hujia);
						}
						if (chosen.includes(4)) {
							player.refreshSkill("swe_maopao");
						}
						const next = player.useCard({ name: cardName, isCard: true, storage: { swe_maopao: true } }, [target]);
						next.addSkillCount = false;
						next.addCount = false;
						await next;
					},
				};
			},
			prompt(links, player) {
				return "将体力值调整至与护甲数相同，视为使用" + get.translation(links[0][2]);
			},
		},
		group: ["swe_maopao_video", "swe_maopao_recover"],
		subSkill: {
			backup: { },
			recover: {
				charlotte: true,
				forceDie: true,
				slient: true,
				popup: false,
				//audio: "swe_maopao",
				trigger: { player: ["phaseAfter", "dieBefore"] },
				filter(event, player) {
					return player.getStorage("swe_maopao_recover", 0) > 0;
				},
				forced: true,
				async content(event, trigger, player) {
					const num = Math.ceil(player.getStorage("swe_maopao_recover", 0) / 2);
					player.setStorage("swe_maopao_recover", 0);
					if (event.triggername === "phaseAfter" && num > 0) {
						await player.changeHujia(-num);
					}
				},
			},
			video: {
				charlotte: true,
				silent: true,
				popup: false,
				//audio: "swe_maopao",
				trigger: { source: "damageBegin4" },
				filter(event, player) {
					return event.num > 4 && event.card?.storage?.swe_maopao;
				},
				forced: true,
				usable: 1,
				async content(event, trigger, player) {
					if (typeof swTool.playSkillFullVideo !== "function") return;
					const videoPromise = swTool.playSkillFullVideo("xiaochun", 6600);
					game.broadcast(function () {
						swTool.playSkillFullVideo("xiaochun", 6600);
					});
					await videoPromise;
				},
			},
		},
		ai: {
			order() {
				const player = get.player();
				const evt = get.event();
				if (get.skillCount("swe_maopao", player) >= 1) return 0;
				if (!evt || evt.type !== "phase") return 0;
				if (player.hujia > 0 && player.hp > player.hujia) return 9;
				if (player.hujia > player.hp) return 6;
				return 2;
			},
			result: {
				player(player) {
					return 10;
				},
			},
		},
	},
	// ====== 剑挽造化篇 ======
	swjw_jianche: {
		audio: "swlu_mengyan",
		trigger: {
			global: ["shaMiss", "eventNeutralized"]
		},
		forced: true,
		filter(event, player, name) {
			return event.card?.name == "sha" && event.cards.someInD("od") && event.getParent("swjw_jianche").name != "swjw_jianche";
		},
		async content(event, trigger, player) {
			const entities = (trigger.cards.filterInD("od") || []);
			if (!entities.length) return;
			const addE = player.addToExpansion(entities, player, "gain2");
			addE.gaintag.add("swjw_jianche");
			await addE;
			const cards = player.getCards("x", function (c) { return c.hasGaintag("swjw_jianche"); });
			const suits = {};
			for (const c of cards) suits[get.suit(c, false)] = true;
			if (Object.keys(suits).length >= 3) {
				const count = cards.length;
				//await player.loseToDiscardpile(cards);
				const targets = game.filterPlayer(function (t) {
					return player.canUse({ name: "sha", nature: "thunder", cards: cards }, t, null, false);
				});
				if (targets.length) {
					const next = player.chooseUseTarget(
						{ name: "sha", nature: "thunder" },
						"请选择基础伤害为" + count + "的雷【杀】的目标",
						true,
						false,
						"nodistance"
					);
					next.set("cards", cards);
					next.set("oncard", () => {
						const evt = get.event();
						evt.baseDamage = evt.card?.cards?.length || 1;
					});
					const result = await next.forResult();

					// const next = player.chooseToUse();
					// next.set("openskilldialog", "【剑恻】将武将牌上的所有牌当一张基础伤害为" + cards.length + "的雷【杀】使用");
					// next.set("_backupevent", "xinxshuohua_backup");
					// next.set("oncard", () => {
					// 	const evt = get.event();
					// 	evt.baseDamage = evt.cards.length;
					// });
					// next.set("addCount", false)
					// next.backup("xinxshuohua_backup");
					// await next;
				}
			}
		},
		marktext: "剑",
		intro: {
			content: "expansion",
			markcount: "expansion"
		},
		group: "swjw_jianche_start",
		subSkill: {
			start: {
				audio: "swjw_jianche",
				forced: true,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					const card = game.createCard("swjw_zhili", lib.card.swjw_zhili.cardcolor, lib.card.swjw_zhili.cardnumber);
					player.$gain2(card, false);
					await player.equip(card);
				}
			}
		}
	},
	swjw_feihua: {
		audio: "swx_mieyi",
		enable: "phaseUse",
		usable(skill, player) {
			return 1 - (player.getHistory("useSkill", (evt) => evt.skill == "swjw_feihua" || evt.skill == "swjw_feihua_dying")?.length || 0);
		},
		filterTarget: true,
		selectTarget: 1,
		filter(event, player) {
			return true;
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			player.addSkill("swjw_feihua_draw");
			let current = event.targets[0];
			while (current && current.isIn()) {
				const target = current.getNext();
				if (!target || target === current) break;
				const sha = get.cardPile2(function (c) { return c.name === "sha"; });
				if (!sha) {
					const randomList = ["孩子们，感觉被做局了", "我要开PVE去了", "自觉都来了", "唉，不如界管宁"];
					player.chat(randomList.randomGet());
					break;
				}
				player.line(current);
				sha.storage ??= {};
				sha.storage.swjw_feihua = true;
				const useResult = await current.useCard(sha, target, false);

				const result = await current
					.chooseControl()
					.set("choiceList", ["令下家继续此流程", "弃置所有手牌（无牌则不弃）并终止"], true)
					.set("sourcex", player)
					.set("ai", function () {
						const player = get.player();
						const next = player.getNext();
						const nextnext = next.getNext();
						const source = get.event()?.sourcex;
						if (player.countCards("h") > 4) return 0;
						if (get.attitude(player, source) < 0) return 1;
						return get.attitude(player, nextnext) <= 0 ? 0 : 1;
					})
					.forResult();
				if (result && result.index === 0) {
					game.log(current, "选择了让", target, "继续此流程");
					current = target;
				}
				else {
					game.log(current, "选择了弃置所有手牌并终止了邪恶的乱武");
					const randomList = ["干嘛？", "废物", "bug真多", "唉，不如继续杀", "我说不杀算你输了", "挂机了，不如玩塔", "早知道玩储君了"];
					player.chat(randomList.randomGet());
					await current.modedDiscard(current.getCards("h"));
					break;
				}

				if (sha && sha?.storage?.swjw_feihua) {
					delete sha.storage.swjw_feihua;
				}
			}
			player.removeSkill("swjw_feihua_draw");
		},
		//group: ["swjw_feihua_dying"],
		subSkill: {
			dying: {
				audio: "swjw_feihua",
				trigger: { player: "dying" },
				filter(event, player) {
					return true;
				},
				usable(skill, player) {
					return 1 - (player.getHistory("useSkill", (evt) => evt.skill == "swjw_feihua" || evt.skill == "swjw_feihua_dying")?.length || 0);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt2("swjw_feihua"))
						.forResult();
				},
				async content(event, trigger, player) {
					await lib.skill.swjw_feihua.content(event, trigger, player);
				},
			},
			draw: {
				audio: "swjw_feihua",
				trigger: { global: "damageBegin4" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event?.card?.storage?.swjw_feihua;
				},
				async content(event, trigger, player) {
					const zhili = get.cardPile(card => card.name == "swjw_zhili");
					if (zhili) {
						player.$gain2(zhili, false);
						await player.equip(zhili);
					}
					else {
						await player.draw(2);
						// if (!player.isMaxHandcard(true)) {
						// 	await player.draw(2);
						// }
					}
				},
			},
		},
		ai: { order: 6, result: { target: -1 } },
	},
	swjw_binzang: {
		audio: "swyc_zhuiyun",
		trigger: { source: "dieAfter" },
		forced: true,
		filter(event, player) {
			return event.player !== player;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const skills = trigger.player.getStockSkills(true, true).filter(skill => get.info(skill) && !get.info(skill).charlotte);
			if (!skills.length) {
				await player.draw(3);
				return;
			}
			const result = await player
				.chooseControl()
				.set("choiceList", [
					skills.length ? "获得其武将牌上的所有技能" : "获得其武将牌上的所有技能（无技能可获得）",
					"摸三张牌",
				])
				.set("ai", function () { return skills.length > 2 ? 0 : 1; })
				.forResult();
			if (result.index === 0 && skills.length) {
				game.log(player, "获得了", trigger.player, "的技能");
				await player.addSkills(skills);
			}
			else {
				await player.draw(3);
			}
		},
	},
	swjw_zhili_skill: {
		trigger: { player: "useCardToPlayered" },
		forced: true,
		equipSkill: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && event.getParent("useCard")?.baseDamage > 1;
		},
		content() {
			trigger.directHit.addArray(game.players);
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name === "sha" && get.info(card).baseDamage > 1) return [1, 0.5];
				},
			},
		},
	},
	// 剑挽天上客
	swjw_yangbing: {
		//audio: `${ea}swjw_tianshangke:2`,
		group: "swjw_yangbing_start",
		trigger: { global: "useCardAfter" },
		logTarget: "",
		//usable: 1,
		filter(event, player) {
			return event.player == player && _status.currentPhase != player;
		},
		async cost(event, trigger, player) {
			const card = !player.getEquips("swjw_pujian").length ? get.cardPile((card2) => card2.name == "swjw_pujian") : null;
			if (card) {
				const result = await player.chooseBool("是否装备朴剑？").set("ai", () => true).forResult();
				event.result = { bool: result.bool, cost_data: { card } };
				return;
			}
			const num = player.maxHp - player.countCards("h");
			if (!num) {
				event.result = { bool: false, cost_data: {} };
				return;
			}
			const result = await player
				.chooseBool(`是否将手牌数调整至体力上限（${num}张）？`)
				.set("ai", () => true)
				.forResult();
			event.result = { bool: result.bool, cost_data: { num } };
		},
		async content(event, trigger, player) {
			if (event.cost_data.card) {
				await lib.skill.swjw_pujian_yi.restoreSlot(player);
				player.$gain2(event.cost_data.card, false);
				await player.equip(event.cost_data.card);
			} else if (event.cost_data.num) {
				if (event.cost_data.num > 0) {
					await player.draw(Math.min(5, event.cost_data.num));
				} else {
					await player.chooseToDiscard("h", -event.cost_data.num, true);
				}
			}
		},
		subSkill: {
			start: {
				audio: "swjw_yangbing",
				forced: true,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					if (player.getEquips("swjw_pujian").length) return;
					const card = game.createCard("swjw_pujian", lib.card.swjw_pujian.cardcolor, lib.card.swjw_pujian.cardnumber);
					player.$gain2(card, false);
					await player.equip(card);
				},
			},
		},
	},
	swjw_xuren: {
		//audio: `${ea}swjw_tianshangke:2`,
		trigger: { global: "phaseUseBegin" },
		logTarget: "player",
		filter(event, player) {
			return event.player != player && player.isIn() && !player.hasSkill("swjw_xuren_ban");
		},
		async cost(event, trigger, player) {
			const choice = (() => {
				if (get.attitude(player, trigger.player) >= 0) return false;
				return !!get.cardPile((card) => card.name == "sha") || player.countCards("hs", (card) => get.name(card) == "sha") > 0;
			})();
			const result = await player.chooseBool(get.prompt2("swjw_xuren", trigger.player))
				.set("ai", () => get.event().choice)
				.set("choice", choice)
				.forResult();
			event.result = { bool: result.bool, cost_data: {} };
			if (!result.bool) {
				player.addMark("swjw_xuren_count", 1, false);
			}
		},
		async content(event, trigger, player) {
			player.addTempSkill("swjw_xuren_ban", { player: "phaseBegin" });
			player.setStorage("swjw_xuren_boost", false);
			player.setStorage("swjw_xuren_cards", []);
			player.addTempSkill("swjw_xuren_use");
			const card = get.cardPile((card2) => card2.name == "sha");
			if (card) {
				await player.gain(card, "gain2");
			} else {
				game.log("牌堆与弃牌堆中均无", "#g【杀】");
			}
			while (true) {
				//if (!player.getCards("hs", (card2) => get.name(card2) == "sha" && player.hasUseTarget(card2)).length) break;
				const result = await player
					.chooseToUse(function (card2) {
						if (get.name(card2) != "sha") return false;
						return lib.filter.filterCard.apply(this, arguments);
					}, "蓄刃：你可以对其使用任意张【杀】（取消则结束）")
					.set("addCount", false)
					.set("targetRequired", true)
					.set("filterTarget", function (card2, player2, target) {
						if (target != get.event().xurenTarget) return false;   // 只能对其使用
						return lib.filter.targetEnabled.apply(this, arguments);   // 不含距离检查 → 无距离限制
					})
					.set("xurenTarget", trigger.player)
					.forResult();
				if (!result?.bool || !result?.cards?.length) break;
			}
			player.clearMark("swjw_xuren_count");
		},
		group: ["swjw_xuren_boost", "swjw_xuren_count", "swjw_xuren_reset"],
		subSkill: {
			ban: {
				charlotte: true,
			},
			count: {
				charlotte: true,
				marktext: "刃",
				intro: {
					content: "距你上次受伤后，你连续拒绝了$次〖蓄刃〗",
				},
			},
			boost: {
				charlotte: true,
				trigger: { source: "damageBegin1" },
				forced: true,
				silent: true,
				filter(event, player) {
					if (player.getStorage("swjw_xuren_boost", false)) return false;
					const cards = player.getStorage("swjw_xuren_cards");
					if (!cards.length) return false;
					return (event.cards || []).some((card) => cards.includes(card)) || cards.includes(event.card);
				},
				content() {
					const num = player.countMark("swjw_xuren_count");
					trigger.num += num;
					player.setStorage("swjw_xuren_boost", true);
					game.broadcast(function (player2) {
						player2.setStorage("swjw_xuren_boost", true);
					}, player);
					game.log(player, "蓄刃", `令此伤害+${get.cnNumber(num)}`);
				},
			},
			use: {
				charlotte: true,
				trigger: { player: "useCard1" },
				forced: true,
				silent: true,
				filter(event, player) {
					return get.name(event.card) == "sha";
				},
				content() {
					const cards = player.getStorage("swjw_xuren_cards");
					cards.addArray(trigger.cards);
					player.setStorage("swjw_xuren_cards", cards);
					game.broadcast(function (player2, cards2) {
						player2.setStorage("swjw_xuren_cards", cards2);
					}, player, cards);
				},
			},
			reset: {
				charlotte: true,
				trigger: { player: "damageEnd" },
				forced: true,
				silent: true,
				filter(event, player) {
					return player.countMark("swjw_xuren_count") > 0;
				},
				content() {
					player.clearMark("swjw_xuren_count");
				},
			},
		},
	},
	swjw_zhufeng: {
		//audio: `${ea}swjw_tianshangke:2`,
		trigger: { source: "dieAfter" },
		forced: true,
		locked: true,
		filter(event, player) {
			return event.player != player;
		},
		async content(event, trigger, player) {
			const num = Math.max(1, Math.floor(trigger.player.maxHp / 2));
			const result = await player
				.chooseControl("选项一", "选项二")
				.set("prompt", get.prompt("swjw_zhufeng", trigger.player))
				.set("choiceList", [
					`增加${get.cnNumber(num)}点体力上限`,
					"本局游戏你造成的伤害+1",
				])
				.set("ai", function () {
					return get.event().choice;
				})
				.set("choice", game.countPlayer() >= 4 ? "选项二" : "选项一")
				.forResult();
			if (result.control == "选项一") {
				await player.gainMaxHp(num, true);
			} else {
				player.addMark("swjw_zhufeng_add", 1);
			}
		},
		group: ["swjw_zhufeng_add"],
		subSkill: {
			add: {
				charlotte: true,
				trigger: { source: "damageBegin1" },
				forced: true,
				silent: true,
				filter(event, player) {
					return player.countMark("swjw_zhufeng_add") > 0;
				},
				content() {
					trigger.num += player.countMark("swjw_zhufeng_add");
				},
				mark: true,
				marktext: "锋",
				intro: {
					content: "你本局游戏造成的伤害增加$点",
				},
			},
		},
		ai: {
			threaten: 1.5,
		},
	},
	swjw_pujian_yi: {
		charlotte: true,
		//audio: "swjw_yangbing",
		trigger: { global: "useCard" },
		forced: true,
		silent: true,
		filter(event, player) {
			return event.card?.name == "swjw_pujian" && event.player == player && player.hasDisabledSlot(1);
		},
		async content(event, trigger, player) {
			await lib.skill.swjw_pujian_yi.restoreSlot(player);
		},
		restoreSlot(player) {
			if (player.hasDisabledSlot(1)) {
				return player.enableEquip("equip1");
			}
			return null;
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "swjw_pujian" && player.hasDisabledSlot(1)) {
					return true;
				}
			},
		},
	},
	swjw_pujian_er: {
		charlotte: true,
		//audio: "swjw_yangbing",
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		silent: true,
		filter(event, player) {
			if (!player.isIn() || player.isDead() || player.hasDisabledSlot(1)) return false;
			if (!player.hasClan("天上")) return false;
			if (event.name == "equipAfter") return false;
			const es = event.getl(player).es;
			return es.length && es.some((card) => card.name == "swjw_pujian");
		},
		async content(event, trigger, player) {
			await player.disableEquip("equip1");
		},
	},
	swjw_pujian_skill: {
		//audio: "swjw_yangbing",
		equipSkill: true,
		trigger: { player: "gainAfter" },
		filter(event, player) {
			if (!player.getVCards("e", (card) => card.name == "swjw_pujian").length) return false;
			return event.cards.some((card) => get.name(card) == "sha" && get.position(card) == "h");
		},
		async cost(event, trigger, player) {
			const shas = trigger.cards.filter((card) => get.name(card) == "sha" && get.position(card) == "h");
			const result = await player
				.chooseBool(`###${get.translation("swjw_pujian_skill")}###是否将${get.translation(shas)}置于${get.translation("swjw_pujian")}上？`)
				.set("ai", () => get.event().choice)
				.set("choice", true)
				.forResult();
			event.result = { bool: result.bool, cost_data: {} };
		},
		async content(event, trigger, player) {
			const shas = trigger.cards.filter((card) => get.name(card) == "sha" && get.position(card) == "h");
			await player.loseToSpecial(shas, "swjw_pujian_sha");
			const weapon = player.getVCards("e").find((card) => card.name == "swjw_pujian");
			weapon.storages ??= [];
			weapon.storages.addArray(shas);
			game.broadcast(function (weapon2, cards) {
				weapon2.storages = cards;
			}, weapon, weapon.storages);
			player.updateMarks();
		},
		mark: true,
		marktext: "剑",
		intro: {
			markcount(storage, player) {
				let num = 0;
				for (const weapon of player.getVCards("e", (card) => card.name == "swjw_pujian")) {
					if (weapon?.storages?.length) num += weapon.storages.length;
				}
				return num;
			},
			mark(dialog, storage, player) {
				const cards = [];
				for (const weapon of player.getVCards("e", (card) => card.name == "swjw_pujian")) {
					if (weapon?.storages?.length) cards.addArray(weapon.storages);
				}
				if (!cards.length) return;
				dialog.addText("剑下");
				dialog.addSmall(cards);
			},
		},
	},
	swjw_pujian_clear: {
		charlotte: true,
		trigger: { player: "loseEnd" },
		firstDo: true,
		forced: true,
		silent: true,
		delay: false,
		filter(event, player) {
			if (!event.ss || !event.ss.length) return false;
			for (const weapon of player.getVCards("e", (card) => card.name == "swjw_pujian")) {
				if (weapon?.storages?.length && event.ss.filter((card) => weapon.storages.includes(card)).length) return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			for (const weapon of player.getVCards("e", (card) => card.name == "swjw_pujian")) {
				if (weapon?.storages) {
					weapon.storages.removeArray(trigger.ss);
					game.broadcast(function (weapon2, cards) {
						weapon2.storages = cards;
					}, weapon, weapon.storages);
				}
			}
			player.updateMarks();
		},
	},
	// 鸢一折纸
	swyz_tianyi: {
		audio: `${ea}swyz_yuanyizhezhi:1`,
		trigger: {
			player: "useCardToPlayered"
		},
		filter: function filter(event, player) {
			if (!event.isFirstTarget) return false;
			for (let i of event.targets) {
				if (i == player) continue;
				if (i.countDiscardableCards(i, 'he'))
					return true;
			}
			return false;
		},
		cost: async function cost(event, trigger, player) {
			event.result = await player.chooseTarget()
				.set('selectTarget', [1, Infinity])
				.set('filterTarget', function (card, player, target) {
					return trigger.targets.includes(target);
				})
				.set('ai', function (target) {
					if (get.tag(trigger.card, 'gain')) return 0;
					if (player.attitudeTo(target) > 0) return -get.effect(target, trigger.card, player, player);
					if (get.effect(target, trigger.card, player, player) < 0) return 1;
					if (trigger.card.name == 'huogong' && player.countCards('h') < 4) return 1;
					if (trigger.excluded.includes(trigger.target)) return 1;
					if (get.tag(trigger.card, 'respondSha') && trigger.target.mayHaveSha(player, 'respond')) return 1;
					if (get.tag(trigger.card, 'respondShan') && trigger.target.mayHaveShan(player)) return 1;
					return 0;
				})
				.set('prompt', get.prompt2('swyz_tianyi'))
				.forResult();
			if (event.result.bool) event.result.targets.sortBySeat();
		},
		content: async function content(event, trigger, player) {
			trigger.excluded.addArray(event.targets);
			for (const target of event.targets) if (target.hasCard(card => {
				return lib.filter.cardDiscardable(card, target, 'chooseToDiscard')
			}, 'he')) await target.chooseToDiscard()
				.set('forced', true)
				.set('position', 'he')
				.set('prompt', lib.translate[event.name])
				.set('prompt2', `${get.translation(trigger.card)}已对你无效，请弃置一张牌`);
		}
	},
	swyz_shengmian: {
		audio: `${ea}swyz_yuanyizhezhi:1`,
		trigger: {
			global: [
				"equipEnd",
				"addJudgeEnd",
				"gainEnd",
				"loseAsyncEnd",
				"addToExpansionEnd",
				"loseEnd"
			]
		},
		forced: true,
		filter: function filter(event, player) {
			return game.hasPlayer(current => {
				if (current == player) return false;
				var evt = event.getl(current);
				return evt && evt.hs && evt.hs.length &&
					current.countCards('h') == 0;
			});
		},
		getIndex: function getIndex(event, player) {
			return game.filterPlayer(current => {
				if (current == player) return false;
				var evt = event.getl(current);
				return evt && evt.hs && evt.hs.length &&
					current.countCards('h') == 0;
			});
		},
		content: async function content(event, trigger, player) {
			await player.draw();
		}
	},
	swyz_rilun: {
		audio: `${ea}swyz_yuanyizhezhi:1`,
		enable: "chooseToUse",
		usable: 1,
		filter: function filter(event, player) {
			return player.hasCard(card => {
				return get.suit(card) == 'diamond';
			}, 'hs');
		},
		filterCard: {
			suit: "diamond"
		},
		position: "hs",
		viewAs: {
			name: "wanjian"
		}
	},
	swyz_paoguan: {
		audio: `${ea}swyz_yuanyizhezhi:1`,
		unique: true,
		limited: true,
		mark: true,
		intro: {
			content: "limited"
		},
		skillAnimation: true,
		animationColor: "gray",
		enable: "phaseUse",
		filter: function filter(event, player) {
			return player.countCards('h');
		},
		filterCard: function filterCard(card, player) {
			if (ui.selected.cards.length)
				for (let i of ui.selected.cards)
					if (get.suit(card) == get.suit(i))
						return false;
			return true;
		},
		complexCard: true,
		position: "h",
		selectCard: () => [1, lib.suit.length],
		check: function check(card) {
			return 8 - get.value(card);
		},
		filterTarget: function filterTarget(card, player, target) {
			return player.inRange(target);
		},
		content: async function content(event, trigger, player) {
			player.awakenSkill('swyz_paoguan');
			let damage = event.cards.length;
			let players = game.filterPlayer(function (current) {
				return current != player;
			});
			players.sortBySeat();
			for (const current of players) {
				const extInfo = current.attitudeTo(event.target) <= 0 ? false :
					damage >= event.target.hp ? 'needDiscard' : 'isFriend';
				const result = await current.chooseToDiscard(2, 'he')
					.set('ai', function (card) {
						switch (extInfo) {
							case 'needDiscard':
								return 7 - get.value(card);
							case 'isFriend':
								return 4.5 - get.value(card);
							default:
								return 0;
						}
					})
					.set('prompt', '炮冠')
					.set('prompt2', get.translation(event.target) + '即将受到' +
						get.cnNumber(damage) + '点伤害，是否弃置两张牌令伤害值-1？')
					.forResult();
				if (result.bool) damage--;
				if (damage <= 0) break;
			}
			if (damage > 0) await event.target.damage(damage, player);
		},
		ai: {
			order: 2,
			result: {
				target: function target(player, target) {
					if (target.hp > 4) return 0;
					if (target.hp < 2) return -3;
					return -4.5 + target.hp;
				},
				player: function player(player) {
					var suits = [],
						hs = player.getCards('h');
					for (let i of hs) {
						if (get.value(i) < 8) suits.add(get.suit(i));
						if (suits.length >= lib.suit.length) break;
					}
					return (suits.length - lib.suit.length) * 2;
				}
			}
		}
	},

	// 本条二亚
	swyz_xiaolan: {
		trigger: {
			player: "phaseDrawBefore"
		},
		direct: true,
		filter: function filter(event, player) {
			return ui.cardPile.childElementCount > 0;
		},
		cost: async function cost(event, trigger, player) {
			event.result = await player.chooseCard()
				.set('filterCard', (card, player, event) => {
					return !get.is.shownCard(card) &&
						get.suit(card) == 'diamond';
				})
				.set('ai', card => {
					return 1;
				})
				.set('prompt', get.prompt2('swyz_xiaolan'))
				.forResult();
		},
		content: async function content(event, trigger, player) {
			player.addShownCards(event.cards, 'visible_swyz');
			await trigger.cancel();
			let list = [],
				map = { basic: [], trick: [], equip: [] };
			for (let i = 0; i < ui.cardPile.childElementCount; i++) {
				let typex = get.type2(ui.cardPile.childNodes[i]);
				if (!map[typex]) map[typex] = [];
				map[typex].push(ui.cardPile.childNodes[i]);
			}
			for (let j in map) {
				if (map[j].length == 0) continue;
				list.push(get.translation(j));
				map[j].sort((a, b) => {
					let ia = lib.inpile.indexOf(get.name(a)),
						ib = lib.inpile.indexOf(get.name(b));
					if (ia == -1) ia = lib.inpile.length;
					if (ib == -1) ib = lib.inpile.length;
					ia *= 13;
					ib *= 13;
					ia += (get.number(a) - 1) || 0;
					ib += (get.number(b) - 1) || 0;
					return ia - ib;
				});
				list.push(map[j]);
			}
			const result = await player.chooseButton()
				.set('createDialog', list)
				.set('forced', true)
				.set('selectButton', [1, 2])
				.set('ai', button => {
					return (get.value(button.link) + get.useful(button.link)) *
						(0.7 + Math.random() * 0.3);
				})
				.forResult();
			if (result.bool) {
				game.log(player, '从牌堆中获得了' + get.cnNumber(result.links.length) + '张牌');
				await player.gain(result.links, 'draw').gaintag.add('swyz_xiaolan');
			}
		},
		group: [
			"swyz_xiaolan_clear"
		],
		subSkill: {
			clear: {
				charlotte: true,
				mod: {
					ignoredHandcard: function (card, player) {
						if (card.hasGaintag('swyz_xiaolan')) return true;
					},
					cardDiscardable: function (card, player, name) {
						if (name == 'phaseDiscard' && card.hasGaintag('swyz_xiaolan'))
							return false;
					}
				},
				trigger: {
					global: "phaseAfter"
				},
				direct: true,
				lastDo: true,
				content: async function content(event, trigger, player) {
					player.removeGaintag('swyz_xiaolan');
				},
				sub: true
			}
		}
	},
	swyz_niegao: {
		audio: `${ea}swyz_bentiaoerya:2`,
		trigger: {
			global: "useCard"
		},
		direct: true,
		filter: function filter(event, player) {
			if (!get.info(event.card)?.enable) return false;
			if (!event.player.inRange(player)) return false;
			if (event.player.getHistory('useCard').length != 1) return false;
			return ['equip', 'delay'].includes(get.type(event.card)) && player.hasCard(function (card) {
				return !get.is.shownCard(card);
			}, 'h');
		},
		content: async function content(event, trigger, player) {
			//ai判断准备工作
			const att = player.attitudeTo(trigger.player),
				copyCard = new lib.element.VCard(trigger.card);
			let targetsValue = 0;
			for (let i of trigger.targets)
				targetsValue += get.effect(i, trigger.card, trigger.player, player);
			//玩家操作
			const result1 = await player.chooseCard('h')
				.set('filterCard', function (card, player) {
					let info = get.info(card);
					if (!info || !info.enable) return false;
					return !get.is.shownCard(card);
				})
				.set('ai', function (card) {
					const info = get.info(card);
					//当展示的牌没有目标时，视为取消所有目标
					if (info.notarget) return -targetsValue;
					//为“假设牌”重定义
					copyCard.name = get.name(card, trigger.player);
					copyCard.suit = get.suit(card, trigger.player);
					copyCard.number = get.number(card, trigger.player);
					copyCard.nature = get.nature(card, trigger.player);
					//遍历游戏角色，筛选合法目标，提取目标价值
					let valueList = [],
						isSame = trigger.card.name == copyCard.name;
					game.players.forEach(current => {
						if (trigger.player.canUse(copyCard, current, true, isSame ? true : null))
							valueList.push(get.effect(current, trigger.card, trigger.player, player));
					});
					//当不存在合法目标时，等同于取消所有目标
					if (valueList.length == 0) return -targetsValue;
					//按照价值高低排序
					valueList.sort((a, b) => b - a);
					//获取“假设牌”的可选目标数
					let range = get.select(get.copy(info.selectTarget));
					game.checkMod(copyCard, trigger.player, range, 'selectTarget', trigger.player);
					if (range[1] <= -1) {
						range[0] = valueList.length;
						range[1] = valueList.length;
					} else {
						if (range[0] > valueList.length) {
							range[0] = valueList.length;
						}
						if (range[1] > valueList.length) {
							range[1] = valueList.length;
						}
					}
					//根据可选目标数，计算“假设牌”的目标总价值
					let values = 0;
					for (let i = 0; i < range[1]; i++) {
						if (i >= range[0] && (att > 0 !== valueList[i] > 0)) break;
						values += valueList[i];
					}

					return values - targetsValue;
				})
				.set('prompt', get.prompt('swyz_niegao', trigger.player) + '（更改' + get.translation(trigger.card) + '的目标方法）')
				.set('prompt2', lib.translate['swyz_niegao_info'])
				.forResult();
			if (result1.bool) {
				player.logSkill('swyz_niegao', trigger.player);

				let card = result1.cards[0];
				player.addShownCards(card, 'visible_swyz');
				copyCard.name = get.name(card, trigger.player);
				copyCard.suit = get.suit(card, trigger.player);
				copyCard.number = get.number(card, trigger.player);
				copyCard.nature = get.nature(card, trigger.player);

				let info = get.info(card);
				let notarget = info.notarget === true,
					range,
					targets;
				if (!notarget) {
					range = get.select(get.copy(info.selectTarget));
					targets = game.filterPlayer(function (current) {
						return trigger.player.canUse(copyCard, current, true, (trigger.card.name == copyCard.name) === false ? null : true);
					});
					if (targets.length == 0) notarget = true;
				}
				if (notarget) {
					trigger.targets = [];
					game.log(trigger.card, '无有效目标，取消了所有目标');
				} else {
					game.checkMod(copyCard, trigger.player, range, 'selectTarget', trigger.player);
					const result2 = (range[1] <= -1) ?
						{ bool: true, targets: targets } :
						await trigger.player.chooseTarget()
							.set('forced', true)
							.set('selectTarget', range)
							.set('sourceCard', trigger.card)
							.set('targets', targets)
							.set('filterTarget', function (card, player, target) {
								return _status.event.targets.includes(target);
							})
							.set('ai', function (target) {
								return get.effect(target, _status.event.sourceCard, _status.event.player);
							})
							.set('prompt', '为选择' + get.translation(trigger.card) + '重新选择目标')
							.set('prompt2', `
                                    ${get.translation(player)}明置了一张${get.translation(card)}，
                                    你现在需要按照${get.translation(card)}的目标指定规则，
                                    为${get.translation(trigger.card)}重新指定目标。
                                `)
							.forResult();
					if (result2.bool) {
						trigger.targets = result2.targets.slice(0);
						game.log(trigger.card, '重指定了', trigger.targets, '为目标');
						trigger.player.line(trigger.targets, 'orange');
					}
				}
			}
		}
	},

	// 时崎狂三
	swyz_lingli: {
		charlotte: true,
		marktext: "⏲",
		intro: {
			name: "时间",
			content: "mark",
		},
	},
	swyz_shiyu: {
		global: "swyz_shiyu_global",
	},
	swyz_shiyu_global: {
		trigger: {
			player: "damageBefore",
		},
		forced: true,
		filter(event, player) {
			if (!event.source || event.source == player) return false;
			if (event.source.hasSkill("swyz_shiyu") || event.source.hasSkill("swyz_shiyu_used")) return false;
			if (event.player.hasSkill("swyz_shiyu")) return false;
			return game.filterPlayer(p => p.hasSkill("swyz_shiyu"))?.length > 0;
		},
		async content(event, trigger, player) {
			trigger.cancel();
			// trigger.source.addTempSkill("swyz_shiyu_used");
			await trigger.player.loseHp(trigger.num);
		},
		ai: {
			jueqing: true,
		},
	},
	swyz_shiyu_used: {
		charlotte: true,
	},
	swyz_shiyan: {
		audio: `${ea}swyz_shiqikuangsan:4`,
		persevereSkill: true,
		intro: {
			markcount(storage, player) {
				return player.getCards("x", card => card.hasGaintag("swyz_zidan")).length;
			},
			mark(dialog, storage, player) {
				const bullets = player.getCards("x", card => card.hasGaintag("swyz_zidan"));
				if (bullets.length) {
					dialog.addText("子弹");
					dialog.addSmall(bullets);
				}
			},
		},
		categories(skill, player) {
			return ["灵能技"];
		},
		trigger: {
			player: "enterGame",
			global: ["phaseBefore", "loseHpEnd"],
		},
		forced: true,
		silent: true,
		filter(event, player) {
			debugger
			if (event.name == "phase") {
				return game.phaseNumber == 0 && player.countMark("swyz_lingli") < 12;
			}
			if (event.name == "loseHp") {
				return event.num > 0;
			}
			return player.countMark("swyz_lingli") < 12;
		},
		async content(event, trigger, player) {
			if (trigger.name == "loseHp") {
				const gain = Math.min(trigger.num, 24 - player.countMark("swyz_lingli"));
				if (gain > 0) {
					player.addMark("swyz_lingli", gain, false);
					game.log(player, "获得了", gain, "点“时间”");
				}
			} else {
				player.addMark("swyz_lingli", 12 - player.countMark("swyz_lingli"), false);
			}
		},
		group: [
			"swyz_shiyan_summon",
			"swyz_shiyan_upkeep",
			"swyz_shiyan_zidan",
			"swyz_shidan_I",
			"swyz_shidan_II",
			"swyz_shidan_III",
			"swyz_shidan_IV",
			"swyz_shidan_V",
			"swyz_shidan_VI",
			"swyz_shidan_VII",
			"swyz_shidan_VIII",
			"swyz_shidan_IX",
			"swyz_shidan_X",
			"swyz_shidan_XI",
			"swyz_shidan_XII",
		],
		subSkill: {
			summon: {
				trigger: {
					global: "roundStart",
					player: "phaseBegin",
				},
				filter(event, player) {
					if (player.countMark("swyz_lingli") <= 0) return false;
					return !player.getStorage("swyz_shiyan_angel", false);
				},
				async cost(event, trigger, player) {
					const result = await player.chooseBool("是否召唤天使？").set("ai", () => true).forResult();
					event.result = { bool: result.bool, cost_data: {} };
				},
				async content(event, trigger, player) {
					const textPromise = swTool.playFullText("刻刻帝", "神威灵装—三番", "fire", false);
					game.broadcast(function () {
						swTool.playFullText("刻刻帝", "神威灵装—三番", "fire", false);
					});
					await textPromise;
					if (!player.getStorage("swyz_shiyan_summoned", false)) {
						const videoPromise = swTool.playSkillFullVideo("shiqikuangsan_lingzhuang", 6800);
						game.broadcast(function () {
							swTool.playSkillFullVideo("shiqikuangsan_lingzhuang", 6800);
						});
						await videoPromise;
					}
					else {
						const audio = `${ea}swyz_shiqikuangsan/swyz_kekedi.mp3`;
						game.playAudio(audio);
						game.broadcast(function (audio) {
							game.playAudio(audio);
						}, audio);
					}
					game.log(player, "召唤了天使刻刻帝");
					player.setStorage("swyz_shiyan_angel", true);
					player.changeSkin({ characterName: "swyz_shiqikuangsan" }, "swyz_shiqikuangsan_lingzhuang");
					if (!player.getStorage("swyz_shiyan_summoned", false)) {
						player.setStorage("swyz_shiyan_summoned", true);
						const bullets = [];
						for (let num = 1; num <= 12; num++) {
							const card = Array.from(ui.cardPile.childNodes).find(c => get.number(c) === num);
							if (card) bullets.push(card);
						}
						if (bullets.length) {
							await player.addToExpansion({ cards: bullets, gaintag: ["swyz_zidan"], animate: "gain2" });
							player.markSkill("swyz_shiyan");
							game.log(player, "获得了", bullets, "作为子弹");
						}
					}
				},
				sub: true,
			},
			upkeep: {
				audio: "swyz_shiyan",
				trigger: {
					global: "phaseJieshuBegin",
				},
				forced: true,
				filter(event, player) {
					return lib.skill.swyz_shiyan.getAngelCount(player) > 0;
				},
				async content(event, trigger, player) {
					player.removeMark("swyz_lingli", lib.skill.swyz_shiyan.getAngelCount(player));
					if (player.countMark("swyz_lingli") <= 0) {
						lib.skill.swyz_shiyan.dissipateAngel(player);
					} else {
						const result = await player.chooseBool("是否手动消散天使？").set("ai", () => false).forResult();
						if (result.bool) lib.skill.swyz_shiyan.dissipateAngel(player);
					}
				},
				sub: true,
			},
			zidan: {
				audio: "swyz_shiyan",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				filterCard: true,
				selectCard: [1, Infinity],
				prompt: "将任意张手牌置于武将牌上作为“子弹”",
				async content(event, trigger, player) {
					await player.addToExpansion({ cards: event.cards, gaintag: ["swyz_zidan"], animate: "gain2" });
					player.markSkill("swyz_shiyan");
				},
				ai: {
					order: 1,
					result: {
						player: 0,
					},
				},
				sub: true,
			},
		},
		// —— 灵能技/时弹共用框架 ——
		hasAngel(player, skill) {
			return player.getStorage(skill + "_angel", false) === true;
		},
		getAngelCount(player) {
			let num = 0;
			for (const skill of game.expandSkills(player.getSkills(null, null, false).concat(lib.skill.global))) {
				if (get.skillCategoriesOf(skill, player).includes("灵能技") && player.getStorage(skill + "_angel", false) === true) {
					num++;
				}
			}
			return num;
		},
		canShidan(player, num) {
			if (!lib.skill.swyz_shiyan.hasAngel(player, "swyz_shiyan")) return false;
			if (player.countMark("swyz_lingli") > 0) return true;
			return player.getCards("x", card => card.hasGaintag("swyz_zidan") && get.number(card) === num).length > 0;
		},
		shidanDialog(skillId, num, player) {
			// 合并单对话框参数列表：子弹牌按钮（直接点选即消耗）+ "消耗1点灵力" + 取消
			// 返回数组而非 DOM 对话框：联机时走引擎 createDialog 路径（content.js:6775），客机本地重建对话框，
			// 否则 DOM 对话框经 get.stringifiedResult 序列化为 {}，客机弹空框并卡流程
			const bullets = player.getCards("x", card => card.hasGaintag("swyz_zidan") && get.number(card) === num);
			const list = [`###${get.translation(skillId)}###${get.translation(skillId + "_info")}\n（请选择消耗方式）`];
			if (bullets.length) list.push(bullets);
			if (player.countMark("swyz_lingli") > 0) list.push([[["lingli", "消耗1点“灵力”"]], "textbutton"]);
			return list;
		},
		async shidanCost(event, trigger, player, num) {
			const skillId = event.skill || event.name;   // 触发技 cost 有 event.skill；enable 技 content 只有 event.name
			if (num == undefined) num = lib.skill[skillId].shidanNumber;
			const result = await player.chooseButton()
				.set("createDialog", lib.skill.swyz_shiyan.shidanDialog(skillId, num, player))
				.set("closeDialog", true)
				.set("ai", button => button.link == "lingli" ? 0.6 : 1)
				.forResult();
			if (!result.bool) return { bool: false, cost_data: {} };
			if (result.links.includes("lingli")) return { bool: true, cost_data: { way: "lingli" } };
			return { bool: true, cost_data: { way: "bullet", cardid: result.links[0].cardid } };
		},
		async shidanConsume(event, trigger, player) {
			const data = event.cost_data;
			if (data.way == "bullet") {
				const card = Array.from(player.node.expansions.childNodes).find(c => c.cardid == data.cardid);
				if (card) {
					player.$throw(card, 1e3);   // 子弹牌扔出动画
					await player.lose([card], ui.special);  // 移出游戏（本体决进写法：进公共移出区，不进角色特殊区）
					player.markSkill("swyz_shiyan");
				}
			} else if (data.way == "lingli") {
				player.removeMark("swyz_lingli", 1);
			}
		},
		dissipateAngel(player) {
			for (const skill of game.expandSkills(player.getSkills(null, null, false).concat(lib.skill.global))) {
				if (get.skillCategoriesOf(skill, player).includes("灵能技")) {
					player.setStorage(skill + "_angel", false);
				}
			}
			if (player.hasSkill("swyz_shiyan")) {
				player.changeSkin({ characterName: "swyz_shiqikuangsan" }, "swyz_shiqikuangsan");
			}
			game.log(player, "的天使消散了");
		},
		// derivation: [
		// 	"swyz_shidan_I",
		// 	"swyz_shidan_II",
		// 	"swyz_shidan_III",
		// 	"swyz_shidan_IV",
		// 	"swyz_shidan_V",
		// 	"swyz_shidan_VI",
		// 	"swyz_shidan_VII",
		// 	"swyz_shidan_VIII",
		// 	"swyz_shidan_IX",
		// 	"swyz_shidan_X",
		// 	"swyz_shidan_XI",
		// 	"swyz_shidan_XII",
		// ],
	},
	swyz_shidan_I: {
		audio: "swyz_shiyan",
		shidanNumber: 1,
		enable: "phaseUse",
		usable: 1,
		popup: false,
		filter(event, player) {
			if (player.hasSkill("swyz_shidan_I_effect")) return false;
			return lib.skill.swyz_shiyan.canShidan(player, 1);
		},
		chooseButton: {
			dialog(event, player) {
				return lib.skill.swyz_shiyan.shidanDialog("swyz_shidan_I", 1, player);
			},
			complexSelect: false,
			check(event, player) {
				return 1;
			},
			backup(links, player) {
				return {
					audio: "swyz_shiyan",
					effect: links,
					filterCard: () => false,
					selectCard: -1,
					//manualConfirm: true,   // 无目标/无牌需求时强制第二遍确认框，避免 chooseToUse 重复弹选择框死循环（参考本体 pot_liezhi）
					async content(event, trigger, player) {
						const card = lib.skill.swyz_shidan_I_backup.effect.find(i => get.itemtype(i) == "card");
						if (card) {
							player.$throw(card, 1e3);   // 子弹牌扔出动画
							await player.lose([card], ui.special);
							player.markSkill("swyz_shiyan");
						} else {
							player.removeMark("swyz_lingli", 1);
						}
						player.addTempSkill("swyz_shidan_I_effect");
					},
				};
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	swyz_shidan_II: {
		audio: "swyz_shiyan",
		shidanNumber: 2,
		enable: "phaseUse",
		popup: false,
		usable: 1,
		filter(event, player) {
			if (!lib.skill.swyz_shiyan.canShidan(player, 2)) return false;
			return game.hasPlayer(target => target != player);
		},
		chooseButton: {
			dialog(event, player) {
				return lib.skill.swyz_shiyan.shidanDialog("swyz_shidan_II", 2, player);
			},
			complexSelect: false,
			check(event, player) {
				return 1;
			},
			backup(links, player) {
				return {
					audio: "swyz_shiyan",
					prompt(links) {
						return `请选择一名其他角色`;
					},
					filterTarget(card, player, target) {
						return target != player;
					},
					effect: links,
					async content(event, trigger, player) {
						const card = lib.skill.swyz_shidan_II_backup.effect.find(i => get.itemtype(i) == "card");
						if (card) {
							player.$throw(card, 1e3);   // 子弹牌扔出动画
							await player.lose([card], ui.special);
							player.markSkill("swyz_shiyan");
						} else {
							player.removeMark("swyz_lingli", 1);
						}
						event.target.addTempSkill("swyz_shidan_II_effect", { player: "phaseAfter" });
						//player.line(event.target);
					},
				};
			},
			prompt(links, player) {
				return "请选择一名其他角色";
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	swyz_shidan_III: {
		audio: "swyz_shiyan",
		shidanNumber: 3,
		usable: 1,
		trigger: {
			source: "damageEnd",
		},
		filter(event, player) {
			if (event.player.isDead() || event.player.isOut()) return false;   // 受伤者已不在场则不能触发
			return lib.skill.swyz_shiyan.canShidan(player, 3);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			player.line(trigger.player);
			await trigger.player.damage(1, player, trigger.nature);
		},
	},
	swyz_shidan_IV: {
		audio: "swyz_shiyan",
		shidanNumber: 4,
		usable: 1,
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return lib.skill.swyz_shiyan.canShidan(player, 4);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			await player.recover(1);
		},
	},
	swyz_shidan_V: {
		audio: "swyz_shiyan",
		shidanNumber: 5,
		trigger: {
			player: "phaseJudgeBegin",
		},
		filter(event, player) {
			return lib.skill.swyz_shiyan.canShidan(player, 5);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			await player.chooseToGuanxing(4);
		},
	},
	swyz_shidan_VI: {
		audio: "swyz_shiyan",
		shidanNumber: 6,
		trigger: {
			player: "phaseDiscardBegin",
		},
		filter(event, player) {
			return lib.skill.swyz_shiyan.canShidan(player, 6);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			const low = player.countCards("h") <= player.getHandcardLimit();
			await trigger.cancel();
			if (low) player.insertPhase("swyz_shidan_VI").set("phaseList", ["phaseUse"]);
		},
	},
	swyz_shidan_VII: {
		audio: "swyz_shiyan",
		shidanNumber: 7,
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			return Array.isArray(event.respondTo) && lib.skill.swyz_shiyan.canShidan(player, 7);;
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			const current = _status.currentPhase;
			if (current) {
				current.addSkill("swyz_shidan_VII_effect");
				current.addMark("swyz_shidan_VII_effect", 1);
			}
		},
	},
	swyz_shidan_VIII: {
		audio: "swyz_shiyan",
		shidanNumber: 8,
		trigger: {
			player: ["turnOverBefore", "phaseAnySkipped"],
		},
		filter(event, player) {
			return lib.skill.swyz_shiyan.canShidan(player, 8);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			if (trigger.name == "turnOver") {
				await trigger.cancel();
			} else {
				const name = trigger.name.replace(/(Skipped|Cancelled)$/, "");
				if (typeof player[name] === "function") await player[name]();
			}
		},
	},
	swyz_shidan_IX: {
		audio: "swyz_shiyan",
		shidanNumber: 9,
		trigger: {
			player: "gainAfter",
		},
		filter(event, player) {
			const phaseDraw = event.getParent("phaseDraw");
			if (phaseDraw?.player === player) return false;   // 摸牌阶段摸牌排除（本体界凌统写法）
			debugger
			if (event.getParent(evt => evt.name == "swyz_shidan_IX")?.name) return false;   // 防自身内容递归（getParent 未找到时返回 {}，需取 .name 判断）
			return lib.skill.swyz_shiyan.canShidan(player, 9);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			await player.draw(2);
			await player.chooseToDiscard(1, true, "h");
		},
	},
	swyz_shidan_X: {
		audio: "swyz_shiyan",
		shidanNumber: 10,
		trigger: {
			player: "loseAfter",
		},
		filter(event, player) {
			if (event.type != "discard") return false;   // 只算"弃置"类失去（本体写法）
			if (event.discarder != player) return false;
			debugger
			if (event.getParent("phaseDiscard")?.name) return false;   // 弃牌阶段弃置排除
			if (event.getParent(evt => evt.name == "swyz_shidan_X")?.name) return false;   // 防与九之弹互相递归（getParent 未找到时返回 {}，需取 .name 判断）
			return lib.skill.swyz_shiyan.canShidan(player, 10);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			const result = await player.chooseTarget(true)
				//.set("filterTarget", lib.filter.notMe)
				.set("ai", target => 0)
				.forResult();
			if (result.bool) {
				player.line(result.targets[0]);
				await player.discardPlayerCard(result.targets[0], "he", true);
			}
		},
	},
	swyz_shidan_XI: {
		audio: "swyz_shiyan",
		shidanNumber: 11,
		trigger: {
			global: "dyingBegin",
		},
		filter(event, player) {
			if (event.player == player || event.source != player) return false;
			if (!player.canCompare(event.player)) return false;
			return lib.skill.swyz_shiyan.canShidan(player, 11);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			const target = trigger.player;
			player.line(target);
			const result = await player.chooseToCompare(target).forResult();
			if (!result.bool) return;
			if (player.countMark("swyz_lingli") < 24) player.addMark("swyz_lingli", 1, false);
			if (player.countMark("swyz_lingli") >= 11) {
				const result2 = await player.chooseBool(`是否额外扣除11点“灵力”，令${get.translation(target)}直接死亡？`).set("ai", () => false).forResult();
				if (result2.bool) {
					player.removeMark("swyz_lingli", 11);
					lib.skill.swyz_shiyan.dissipateAngel(player);
					await trigger.cancel();
					await target.die().set("source", player);
				}
			}
		},
	},
	swyz_shidan_XII: {
		audio: "swyz_shiyan",
		shidanNumber: 12,
		trigger: {
			player: "dyingBegin",
		},
		filter(event, player) {
			if (!game.hasPlayer(target => target != player && player.canCompare(target))) return false;
			return lib.skill.swyz_shiyan.canShidan(player, 12);
		},
		async cost(event, trigger, player) {
			event.result = await lib.skill.swyz_shiyan.shidanCost(event, trigger, player);
		},
		async content(event, trigger, player) {
			await lib.skill.swyz_shiyan.shidanConsume(event, trigger, player);
			const result = await player.chooseTarget(true)
				.set("filterTarget", lib.filter.notMe)
				.set("ai", target => 0)
				.forResult();
			if (!result.bool) return;
			player.line(result.targets[0]);
			const result2 = await player.chooseToCompare(result.targets[0]).forResult();
			if (!result2.bool) return;
			if (player.countMark("swyz_lingli") < 24) player.addMark("swyz_lingli", 1, false);
			if (player.countMark("swyz_lingli") >= 12) {
				const result3 = await player.chooseBool("是否额外扣除12点“灵力”，将体力值与手牌数调整至游戏开始？").set("ai", () => true).forResult();
				if (result3.bool) {
					player.removeMark("swyz_lingli", 12);
					lib.skill.swyz_shiyan.dissipateAngel(player);
					await player.changeHp(player.maxHp - player.hp);
					const num = player.countCards("h") - 4;
					if (num > 0) await player.chooseToDiscard(num, true, "h");
					else if (num < 0) await player.draw(-num);
				}
			}
		},
	},
	swyz_shidan_I_effect: {
		charlotte: true,
		mark: true,
		marktext: "一",
		intro: {
			name: "一弹",
			content: "本回合使用牌无距离限制",
		},
		mod: {
			targetInRange(card, player, target) {
				return true;
			},
		},
	},
	swyz_shidan_II_effect: {
		charlotte: true,
		mark: true,
		marktext: "二",
		intro: {
			name: "二弹",
			content: "攻击距离-1直到回合结束",
		},
		mod: {
			attackRange(player, num) {
				return num - 1;
			},
		},
	},
	swyz_shidan_VII_effect: {
		charlotte: true,
		mark: true,
		marktext: "七",
		intro: {
			name: "七弹",
			content: "使用的下#张牌无效",
		},
		onremove: true,
		forced: true,
		popup: false,
		trigger: { player: "useCard" },
		filter(event, player) {
			return player.hasMark("swyz_shidan_VII_effect");
		},
		content(event, trigger, player) {
			player.removeMark(event.name, 1, false);
			if (!player.hasMark(event.name)) {
				player.removeSkill(event.name);
			}
			game.log(trigger.card, "被无效了");
			player.popup("无效");
			trigger.all_excluded = true;
		},
	},

	// 氷芽川四糸乃
	swyz_xueyin: {
		audio: `${ea}swyz_bingyachuansisinai:2`,
		trigger: {
			global: "discardEnd"
		},
		filter: function filter(event, player, onrewrite) {
			if (event.player == player) return false;
			return event.discarder == player;
		},
		check: function check(event, player) {
			if (player.attitudeTo(event.player) > 0) return true;
			return event.player.countCards('h') > 1;
		},
		content: async function content(event, trigger, player) {
			await player.draw(2);
			const result = await player.chooseCard()
				.set('forced', true)
				.set('position', 'h')
				.set('ai', card => {
					if (player.attitudeTo(trigger.player) > 0)
						return get.value(card, trigger.player) * 2 - get.value(card);
					return 20 - get.value(card, trigger.player) - get.value(card);
				})
				.set('prompt', lib.translate['swyz_xueyin'])
				.set('prompt2', `交给${get.translation(trigger.player)}一张手牌`)
				.forResult();
			if (result.bool) {
				player.line(trigger.player);
				trigger.player.gain(result.cards, player, 'giveAuto');
			}
		}
	},
	swyz_hanqiao: {
		audio: `${ea}swyz_bingyachuansisinai:2`,
		enable: "chooseToUse",
		filterCard: {
			suit: "club"
		},
		viewAs: {
			name: "sha",
			nature: "ice",
			storage: {
				swyz_hanqiao: true
			}
		},
		viewAsFilter: function viewAsFilter(player) {
			return player.hasCard({ suit: 'club' }, 'hs');
		},
		prompt: "将一张♣牌当做冰【杀】使用",
		check: function check(card) { return 6 - get.value(card) },
		ai: {
			effect: {
				player: function player(card, player, target, result1) {
					if (card?.storage?.swyz_hanqiao && target.mayHaveShan(player, 'respond'))
						return [1, target.countCards('he') / 2];
				}
			}
		},
		group: [
			"swyz_hanqiao_trigger"
		],
		global: [
			"swyz_hanqiao_global"
		],
		subSkill: {
			trigger: {
				trigger: {
					player: "shaEnd"
				},
				direct: true,
				filter: function filter(event, player) {
					return event.card?.storage?.swyz_hanqiao;
				},
				content: async function content(event, trigger, player) {
					const result = await trigger.target.chooseToRespond({ name: 'shan' })
						.set('ai', card => {
							if (trigger.target.isHealthy()
								&& !trigger.target.hasSkillTag('useShan')) return 0;
							return get.order(card);
						})
						.set('respondTo', [player, trigger.card])
						.set('prompt', get.prompt('swyz_hanqiao').replace('发动', '响应'))
						.set('prompt2', '打出一张【闪】，回复一点体力')
						.forResult();
					if (result.bool) await trigger.target.recover();
				},
				sub: true
			},
			global: {
				ai: {
					noshan: true,
					skillTagFilter: function skillTagFilter(player, tag, arg) {
						if (tag == 'noshan') {
							return player.attitudeTo(arg.player) > 0
								&& arg.card?.storage?.swyz_hanqiao;
						}
					}
				},
				sub: true
			}
		}
	},
	swyz_dongjie: {
		audio: `${ea}swyz_bingyachuansisinai:1`,
		trigger: {
			global: [
				"chooseToUseBefore",
				"dying"
			]
		},
		forced: true,
		filter: function filter(event, player) {
			return event.player != player
				&& _status.currentPhase == player
				&& player.isDamaged();
		},
		content: async function content(event, trigger, player) { },
		ai: {
			maixie: true,
			skillTagFilter: function skillTagFilter(player, tag, arg) {
				if (tag == 'maixie' && player.isDamaged()) return false;
			}
		},
		global: [
			"swyz_dongjie_global"
		],
		subSkill: {
			global: {
				mod: {
					cardEnabled: function cardEnabled(card, player, result) {
						if (game.hasPlayer(current => {
							if (current == _status.currentPhase
								&& current != player
								&& current.isDamaged()
								&& current.hasSkill('swyz_dongjie')
								&& !get.is.blocked('swyz_dongjie', current)) return true;
						})) return false;
					},
					cardSavable: function cardSavable(card, player, target, result) {
						if (game.hasPlayer(current => {
							if (current == _status.currentPhase
								&& current != player
								&& current.isDamaged()
								&& current.hasSkill('swyz_dongjie')
								&& !get.is.blocked('swyz_dongjie', current)) return true;
						})) return false;
					}
				},
				sub: true
			}
		}
	},

	// 五河琴里
	swyz_chongran: {
		audio: `${ea}swyz_wuheqinli:2`,
		mod: {
			aiValue: function aiValue(player, card, num) {
				if (get.owner(card) == player && get.position(card) == 'h') {
					if (get.is.shownCard(card)) {
						if (get.event().getParent('phaseDiscard', true)) return num + 5;
						return num + 1;
					}
					return num - 1.5;
				}
			},
			aiUseful: function aiUseful(player, card, num) {
				if (get.owner(card) == player && get.position(card) == 'h' && get.is.shownCard(card)
					&& get.event().getParent('phaseDiscard', true)
				) return num + 5;
			}
		},
		trigger: {
			player: [
				"damageEnd",
				"loseAfter"
			],
			global: "loseAsyncAfter"
		},
		forced: true,
		filter: function filter(event, player) {
			if (event.name == 'damage') return true;
			if (event.type == 'use') return false;
			const evt = event.getl(player);
			if (!evt || !evt.hs.length) return false;
			return evt.hs.some(cardx => {
				if (get.position(cardx, true) != 'd' || !cardx.cardid) return false;
				if (event.gaintag_map) {
					const tags = event.gaintag_map[cardx.cardid] || [];
					for (let i = 0; i < tags.length; i++)
						if (tags[i].startsWith('visible_'))
							return false;
				}
				return true;
			});
		},
		content: async function content(event, trigger, player) {
			if (trigger.name == 'damage') {
				const cards = await player.draw('nodelay', 'visible').forResult();
				if (cards?.length)
					player.addShownCards(cards, 'visible_swyz');
			} else {
				let cards = trigger.getl(player).hs.filter(cardx => {
					if (get.position(cardx, true) != 'd') return false;
					if (trigger.gaintag_map) {
						const tags = trigger.gaintag_map[cardx.cardid] || [];
						for (let i = 0; i < tags.length; i++)
							if (tags[i].startsWith('visible_'))
								return false;
					}
					return true;
				});
				if (cards.length) {
					cards = await player.gain(cards, 'gain2', false).cards;
					if (cards.length)
						player.addShownCards(cards, 'visible_swyz');
				}
			}
		},
		ai: {
			effect: {
				target: function target(card, source, player) {
					if (get.tag(card, 'loseCard') && source != player) {
						if (!player.hasCard(cardx => {
							return get.is.shownCard(cardx) ||
								get.position(cardx) == 'e';
						}, 'he')) return 0.5;
					}
				}
			}
		}
	},
	swyz_yanxi: {
		audio: `${ea}swyz_wuheqinli:2`,
		mod: {
			aiOrder: function aiOrder(player, card, num) {
				if (card?.name == 'jiu') {
					let num2 = 0;
					for (const i of lib.inpile) {
						const cardx = { name: i, cards: 'unsure' };
						if (get.tag(cardx, 'damage') &&
							player.hasUsableCard(i, 'limit'))
							num2 = Math.max(num2, get.order(cardx));
					}
					return num - 3.2 + num2;
				}
			}
		},
		locked: false,
		enable: "chooseToUse",
		filterCard: function filterCard(card) { return get.is.shownCard(card) },
		selectCard: 2,
		viewAs: {
			name: "jiu",
			storage: {
				swyz_yanxi: true
			}
		},
		viewAsFilter: function viewAsFilter(player) {
			return player.countCards('h', cardx => {
				return get.is.shownCard(cardx);
			}) >= 2;
		},
		prompt: "将两张明置牌当做【酒】使用，然后摸一张牌",
		check: function check(card) {
			if (_status.event.type == 'dying')
				return 1 / Math.max(0.1, get.value(card));
			return 8 - get.value(card);
		},
		onuse: function onuse(result, player) {
			player.when('useCardAfter')
				.filter(event => {
					return event.skill == 'swyz_yanxi';
				})
				.then(() => {
					player.draw();
				});
		},
		ai: {
			threaten: 1.5
		},
		group: [
			"swyz_yanxi_jiuExtra"
		],
		subSkill: {
			jiuExtra: {
				audio: "swyz_yanxi",
				trigger: {
					player: [
						"useCard1",
						"useCardAfter"
					]
				},
				forced: true,
				firstDo: true,
				filter: function filter(event, player) {
					if (!player.hasSkill('jiu')) return false;
					return event.card?.name != 'sha' &&
						get.tag(event.card, 'damage');
				},
				content: async function content(event, trigger, player) {
					if (event.triggername == 'useCard1') {
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						trigger.baseDamage += player.storage.jiu;
						trigger.jiu = true;
						trigger.jiu_add = player.storage.jiu;
						game.log(trigger.card, '受【酒】效果增幅，', `#r伤害值+${player.storage.jiu}`);
					}
					game.addVideo('jiuNode', player, false);
					//@ts-ignore
					game.broadcastAll(function (player) {
						player.removeSkill('jiu');
					}, player);
				},
				ai: {
					damageBonus: true,
					skillTagFilter: function skillTagFilter(player, tag, arg) {
						return arg?.card?.name != 'sha' &&
							get.tag(arg?.card, 'damage');
					}
				},
				sub: true
			}
		}
	},
	swyz_chizhuo: {
		audio: `${ea}swyz_wuheqinli:1`,
		enable: "chooseToUse",
		filterCard: {
			suit: "club"
		},
		viewAs: {
			name: "huogong",
			storage: {
				swyz_chizhuo: true
			}
		},
		viewAsFilter: function viewAsFilter(player) {
			return player.hasCard({ suit: 'club' }, 'hs');
		},
		prompt: "将一张♣牌当做【火攻】使用",
		check: function check(card) { return 6 - get.value(card) },
		ai: {
			player: function player(player, target) {
				const suits = [];
				player.countCards('h', cardx => {
					suits.add(get.suit(cardx));
				});
				return suits.length - 3;
			}
		},
		group: [
			"swyz_chizhuo_trigger"
		],
		subSkill: {
			trigger: {
				trigger: {
					global: "showCardsEnd"
				},
				forced: true,
				filter: function filter(event, player) {
					const evt = event.getParent(1);
					if (evt.card?.storage?.swyz_chizhuo !== true ||
						evt.name != 'huogong') return false;
					return event.cards.some(cardx => {
						return lib.filter.canBeDiscarded(cardx, player, event.player);
					});
					// return event.cards.some(cardx => {
					//     return !get.is.shownCard(cardx) ||
					//         player.canRecast(cardx, get.owner(cardx), false);
					// });
				},
				content: async function content(event, trigger, player) {
					const cards = trigger.cards.filter(cardx => {
						return lib.filter.canBeDiscarded(cardx, player, trigger.player);
					});
					if (cards.length > 0) {
						await trigger.player.discard(cards)
							.set('notBySelf', trigger.player != player)
							.set('discarder', player);
						await player.draw(1);
					}
				},
				sub: true
			}
		}
	},

	// 星宫六喰
	swyz_bisuo: {
		audio: `${ea}swyz_xinggongliucan:1`,
		trigger: {
			global: [
				"phaseZhunbeiBefore",
				"phaseJudgeBefore",
				"phaseDrawBefore",
				"phaseUseBefore",
				"phaseDiscardBefore",
				"phaseJieshuBefore"
			]
		},
		usable: 1,
		filter: function filter(event, player) {
			const evt = event.getParent()
			if (player.isHealthy()) return false;
			if (evt?.name == 'phase' && evt?.num == player.getDamagedHp() - 1)
				return player.inRange(event.player);
			return false;
		},
		cost: async function cost(event, trigger, player) {
			const phaseStateTranslation = {
				'phaseZhunbei': '准备阶段',
				'phaseJudge': '判定阶段',
				'phaseDraw': '摸牌阶段',
				'phaseUse': '出牌阶段',
				'phaseDiscard': '弃牌阶段',
				'phaseJieshu': '结束阶段'
			}[trigger.name] || lib.translate[trigger.name];
			if (player.hasSkill('swyz_xinyao') && player.storage['swyz_xinyao'].includes(trigger.player)) {
				event.result = await trigger.player.chooseBool()
					.set('prompt', `是否发动${get.translation(player)}的【闭锁】？`)
					.set('prompt2', `令${get.translation(player)}回复一点体力，你跳过${phaseStateTranslation}`)
					.set('ai', () => {
						if (trigger.name == 'phaseDiscard' || trigger.name == 'phaseJudge') return true;
						if ((trigger.name == 'phaseZhunbei' || trigger.name == 'phaseJieshu')
							&& trigger.player.attitudeTo(player) > 0) return true;
						return false;
					})
					.forResult();
			} else {
				event.result = await player.chooseBool()
					.set('prompt', `是否对发动${get.translation(trigger.player)}【闭锁】？`)
					.set('prompt2', `回复一点体力，令${get.translation(trigger.player)}跳过${phaseStateTranslation}`)
					.set('ai', () => {
						if (trigger.name == 'phaseZhunbei' || trigger.name == 'phaseJieshu') return true;
						if (player.attitudeTo(trigger.player) > 0)
							return trigger.name == 'phaseDiscard' || trigger.name == 'phaseJudge';
						return trigger.name == 'phaseDraw' || trigger.name == 'phaseUse';
					})
					.forResult();
			}
		},
		content: async function content(event, trigger, player) {
			player.recover();
			await trigger.cancel();
			const phaseStateTranslation = {
				'phaseZhunbei': '准备阶段',
				'phaseJudge': '判定阶段',
				'phaseDraw': '摸牌阶段',
				'phaseUse': '出牌阶段',
				'phaseDiscard': '弃牌阶段',
				'phaseJieshu': '结束阶段'
			}[trigger.name] || lib.translate[trigger.name];
			if (phaseStateTranslation) game.log(trigger.player, '的', `#y${phaseStateTranslation}`, '被跳过了');
		}
	},
	swyz_xinyao: {
		audio: `${ea}swyz_xinggongliucan:1`,
		init: function init(player, skill) {
			if (!player.storage[skill]) player.storage[skill] = [];
		},
		marktext: "钥",
		intro: {
			name: "心钥",
			content: "players"
		},
		trigger: {
			player: "recoverAfter"
		},
		forced: true,
		silent: true,
		filter: function filter(event, player, triggername) {
			return event.source && !player.storage['swyz_xinyao'].includes(event.source);
		},
		content: async function content(event, trigger, player) {
			player.storage['swyz_xinyao'].push(trigger.source);
			player.markSkill('swyz_xinyao');
		},
		ai: {
			effect: {
				target: function target(card, source, player, result2) {
					if (card.name == 'tao') {
						if (player.storage['swyz_xinyao'].includes(source)) return;
						if (player.getDamagedHp() <= 2) return;
						if (source.attitudeTo(player) < 0) return [0, 0.05];
					}
				}
			}
		},
		global: [
			"swyz_xinyao_global"
		],
		subSkill: {
			global: {
				audio: "swyz_xinyao",
				mod: {
					selectTarget: function selectTarget(card, player, range) {
						if (get.name(card) == 'tao' && game.hasPlayer(current => {
							return current != player && current.isDamaged() &&
								current.hasSkill('swyz_xinyao') &&
								!get.is.blocked('swyz_xinyao', current);
						})) {
							range[0] = Math.max(1, range[0]);
							range[1] = Math.max(1, range[1]);
						}
					},
					cardEnabled: function cardEnabled(card, player, result) {
						if (get.name(card) == 'tao' && game.hasPlayer(current => {
							return current != player && current.isDamaged() &&
								current.hasSkill('swyz_xinyao') &&
								!get.is.blocked('swyz_xinyao', current);
						})) return true;
					},
					playerEnabled: function playerEnabled(card, player, target, result) {
						if (get.name(card) == 'tao'
							&& target.isDamaged()
							&& target.hasSkill('swyz_xinyao')
							&& !get.is.blocked('swyz_xinyao', target)) {
							return true;
						}
					}
				},
				sub: true
			}
		}
	},
	swyz_fengjie: {
		trigger: {
			player: "recoverEnd"
		},
		filter: function filter(event, player) {
			return player.isHealthy();
		},
		cost: async function cost(event, trigger, player) {
			let list = ['cancel2'];
			for (let i = player.hp; i > 0; i--) {
				list.unshift(get.cnNumber(i));
			}
			const result = await player.chooseControl()
				.set('controls', list)
				.set('choice', (() => {
					return Math.min(player.hp - 1, list.length) - 1;
				})())
				.set('prompt', get.prompt('swyz_fengjie'))
				.set('prompt2', '失去任意点体力，摸等量张牌')
				.forResult();
			event.result = {
				bool: result.control !== 'cancel2',
				cost_data: {
					num: list.indexOf(result.control) + 1
				}
			}
		},
		content: async function content(event, trigger, player) {
			await player.loseHp(event.cost_data.num);
			await player.draw(event.cost_data.num);
			const result = await player.chooseBool()
				.set('ai', () => {
					return !player.hasSkill('swyz_fengjie_effect') && player.maxHp > 4;
				})
				.set('prompt', '封解：是否失去一点体力上限？')
				.set('prompt2', '若如此做，直到你下个回合结束前，你使用的牌不能被响应')
				.forResult();
			if (result.bool) {
				await player.loseMaxHp(1);
				player.addTempSkill('swyz_fengjie_effect', { player: 'phaseAfter' });
			}
		},
		subSkill: {
			effect: {
				mark: true,
				marktext: "解",
				intro: {
					name: "封解",
					content: "直到你的回合结束前，你使用牌不能被响应"
				},
				trigger: {
					player: "useCard1"
				},
				forced: true,
				content: async function content(event, trigger, player) {
					trigger.directHit.push(...game.players.slice(0));
				},
				sub: true
			}
		}
	},

	// 镜野七罪
	swyz_jingxiang: {
		audio: `${ea}swyz_jingyeqizui:2`,
		mod: {
			cardname: function cardname(card, player, name) {
				if (name === 'ying' && card && card.hasGaintag && card.hasGaintag('swyz_jingxiang')) {
					return card.storage?.swyz_jingxiang;
				}
			},
			aiOrder: function aiOrder(player, card, num) {
				if (card && card.hasGaintag && card.hasGaintag('swyz_jingxiang')) {
					return num + 7;
				}
				return num;
			}
		},
		trigger: {
			global: "useCardEnd"
		},
		forced: true,
		filter: function filter(event, player, onrewrite) {
			if (event.player == player) return get.suit(event.card) == 'spade';
			if (get.type(event.card) == 'equip') return false;
			return event.player.getHistory('useCard', evt => get.type(evt.card) != 'equip')[0] == event;
		},
		content: async function content(event, trigger, player) {
			if (trigger.player == player) player.addTempSkill('swyz_jingxiang_blocked');
			else {
				const yings = lib.card.ying.getYing(1);
				if (!yings[0].storage) yings[0].storage = {};
				yings[0].storage.swyz_jingxiang = trigger.card.name;
				const next = player.gain(yings, 'gain2');
				next.gaintag.add('swyz_jingxiang');
				next.gaintag.add(trigger.card.name);
				await next;
			}
		},
		subSkill: {
			blocked: {
				charlotte: true,
				init: function (player, skill) {
					player.addSkillBlocker(skill);
					player.addTip(skill, '〖镜像〗失效');
				},
				onremove: function (player, skill) {
					player.removeSkillBlocker(skill);
					player.removeTip(skill);
				},
				skillBlocker: function (skill, player) {
					return skill == 'swyz_jingxiang';
				},
				sub: true
			}
		}
	},
	swyz_fangxing: {
		audio: `${ea}swyz_jingyeqizui:2`,
		trigger: {
			global: "roundStart"
		},
		filter: function filter(event, player) {
			return player.countCards('h') >= 2;
		},
		cost: async function cost(event, trigger, player) {
			event.result = await player.chooseCardTarget({
				filterCard: true,
				selectCard: 2,
				ai1(card) {
					return 6 - get.value(card);
				},
				filterTarget: lib.filter.notMe,
				ai2(target) {
					let value = 0;
					for (const card of ui.selected.cards) value += get.value(card);
					if (value > 3 && player.attitudeTo(target) < 0) return 0;
					const names = get.nameList(target);
					let skills = [];
					for (const name of names) skills.push(...(lib.character[name]?.skills ?? []));
					return Math.max.apply(Math, skills.map(skill => get.skillRank(skill)))
						+ player.attitudeTo(target) > 0 ? Math.random() : 0;
				},
				prompt: get.prompt2(event.skill)
			}).forResult();
			if (event.result.bool) {
				const names = get.nameList(event.result.targets[0]);
				let skills = [];
				for (const name of names) skills.push(...(lib.character[name]?.skills ?? [])
					.filter(skill => {
						if (player.hasSkill(skill)) return false;
						const info = get.info(skill);
						return info && !info.charlotte && !info.persevereSkill;
					}));
				event.result.cost_data = await player.chooseControl()
					.set('choiceList', skills.map(skill => {
						return `<b>${lib.translate[skill]}</b>&ensp;${get.skillInfoTranslation(skill, player)}`;
					}))
					.set('controls', [...skills.map(skill => lib.translate[skill]), 'cancel2'])
					.set('displayIndex', false)
					.set('choice', (() => {
						return skills.map((item, index) => {
							if (get.skillInfoTranslation(item, player).length == 0) return [index, 0];
							return [index, get.skillRank(item)];
						}).sort().reverse()[0][0];
					})())
					.set('prompt', lib.translate[event.skill] + '：请选择你要获得的技能')
					.forResult()
				event.result.bool = Boolean(skills[event.result.cost_data.index]);
				event.result.cost_data.control = skills[event.result.cost_data.index];
			}
		},
		content: async function content(event, trigger, player) {
			const skill = event.cost_data.control;
			await player.give(event.cards, event.targets[0], false);
			await player.addAdditionalSkills('swyz_fangxing', skill, false);
			player.when({ player: ['logSkill', 'useSkill'] })
				.filter((evt, ply) => skill == evt.skill)
				.then(() => player.removeAdditionalSkills('swyz_fangxing'));
			player.when({ global: 'roundStart' })
				.filter((evt, ply) => evt != trigger)
				.then(() => player.removeAdditionalSkills('swyz_fangxing'));
		}
	},

	// 八舞耶俱矢
	swyz_jufeng: {
		audio: `${ea}swyz_bawuyejushi:2`,
		trigger: {
			player: "useCardToPlayered"
		},
		filter: function filter(event, player) {
			return event.targets.length == 1
				&& get.suit(event.card) == 'spade'
				&& !event.target.isLinked()
				&& event.target.countCards('hej') > 0;
		},
		content: async function content(event, trigger, player) {
			await trigger.target.link(true);
			const cards = trigger.target.getCards('hej');
			await trigger.target.lose(cards, ui.cardPile);
			trigger.target.$throw(cards.length);
			for (const card of cards) {
				const p = Math.floor(Math.random() * ui.cardPile.childElementCount);
				ui.cardPile.insertBefore(card, ui.cardPile.childNodes[p]);
			}
			game.updateRoundNumber();
			game.log(trigger.target, '的', '#y' + get.cnNumber(cards.length) + '张牌', '洗入了牌堆');
			await trigger.target.draw(cards.length)
		}
	},
	swyz_jichi: {
		audio: `${ea}swyz_bawuyejushi:1`,
		onremove: function onremove(player, skill) {
			player.removeTip(skill);
		},
		marktext: "驰",
		intro: {
			name: "疾驰",
			content: "本回合已有&张牌进入弃牌堆"
		},
		mod: {
			targetInRange: function targetInRange(card, player, target, now) {
				return true;
			},
			cardUsable: function cardUsable(card, player, num) {
				return Infinity;
			}
		},
		trigger: {
			global: [
				"phaseBefore",
				"loseAfter",
				"cardsDiscardAfter",
				"loseAsyncAfter",
				"equipAfter"
			]
		},
		usable: 1,
		forced: true,
		filter: function filter(event, player) {
			if (event.name == 'phase') {
				delete player.storage['swyz_jichi'];
				player.unmarkSkill('swyz_jichi');
				return false;
			}
			let num = 0;
			game.getGlobalHistory('cardMove', (evt) => {
				if (evt.name == 'cardsDiscard' || (evt.name == 'lose' && evt.position == ui.discardPile)) num += evt.cards.length;
				return false;
			});
			if (num > 0 && num < 8) {
				player.storage['swyz_jichi'] = num;
				player.markSkill('swyz_jichi');
				player.addTip('swyz_jichi', `疾驰 — ${get.cnNumber(num)}张`);
			} else {
				delete player.storage['swyz_jichi'];
				player.unmarkSkill('swyz_jichi');
				player.removeTip('swyz_jichi');
			}
			return num >= 8;
		},
		content: async function content(event, trigger, player) {
			await player.turnOver();
			let phasestage = event.getParent(function (evt) {
				return evt.name.startsWith('phase') && evt.name.length > 5;
			}, true);
			if (phasestage != null) {
				phasestage.finish();
				let phaseevent = event.getParent(function (evt) {
					return evt.name == 'phase';
				}, true);
				if (phaseevent != null) {
					phaseevent.finish();
				}
			}
		},
		derivation: [
			"swyz_xieliao",
			"swyz_tianji"
		]
	},

	// 八舞夕弦
	swyz_xieliao: {
		audio: `${ea}swyz_bawuxixian:1`,
		init: function init(player, skill) {
			if (!player.storage['swyz_xieliao_ai'])
				player.storage['swyz_xieliao_ai'] = [];
		},
		enable: "chooseToUse",
		filter: function filter(event, player) {
			return _status.currentPhase?.isLinked() && (
				event.filterCard({ name: 'shan', isCard: true }, player, event) ||
				event.filterCard({ name: 'wuxie', isCard: true }, player, event)
			);
		},
		chooseButton: {
			dialog: function dialog(event, player) {
				var list = [];
				if (event.filterCard({ name: 'shan', isCard: true }, player, event))
					list.push(['basic', '', 'shan']);
				if (event.filterCard({ name: 'wuxie', isCard: true }, player, event))
					list.push(['trick', '', 'wuxie']);
				return ui.create.dialog('解镣', [list, 'vcard']);
			},
			check: function check(button) {
				return _status.event.player.getUseValue({
					name: button.link[2],
					isCard: true
				});
			},
			backup: function backup(links, player) {
				return {
					audio: 'swyz_xieliao',
					popname: true,
					filterCard: () => false,
					selectCard: -1,
					viewAs: { name: links[0][2] },
					onuse(result, player) {
						_status.currentPhase?.link(false);
					},
				}
			}
		},
		hiddenCard: function hiddenCard(player, name) {
			if (name != 'shan' && name != 'wuxie') return false;
			return _status.currentPhase?.isLinked();
		},
		ai: {
			respondShan: true,
			skillTagFilter: function skillTagFilter(player, tag, arg) {
				if (tag == 'respondShan') {
					if (arg != 'use' || !_status.currentPhase?.isLinked()) return false;
				}
			},
			order: 7,
			result: {
				player: 1
			}
		}
	},
	swyz_tianji: {
		audio: `${ea}swyz_bawuxixian:1`,
		trigger: {
			player: [
				"useCardEnd",
				"respondEnd"
			]
		},
		usable: 1,
		forced: true,
		filter: function filter(event, player) {
			return Array.isArray(event.respondTo) && event.respondTo[0] != player;
		},
		content: async function content(event, trigger, player) {
			await player.draw(2);
			player.when({ global: 'phaseAfter' })
				.then(() => {
					player.turnOver();
				});
		},
		derivation: [
			"swyz_jufeng",
			"swyz_jichi"
		]
	},

	// 八舞姊妹
	swyz_shuangsheng: {
		trigger: {
			player: "enterGame",
			global: "phaseBefore"
		},
		forced: true,
		filter: function (event, player) {
			return event.name != 'phase' || game.phaseNumber == 0;
		},
		content: async function content(event, trigger, player) {
			let list = [player.name1, player.name2];
			for (const i of list) {
				if (lib.character[i]?.skills?.includes('swyz_shuangsheng')) {
					const result = await player.chooseButton()
						.set('forced', true)
						.set('selectButton', player.storage.dualside === undefined ? 2 : 1)
						.set('complexSelect', true)
						.set('createDialog', [
							'###' + lib.translate['swyz_shuangsheng'] + '###' +
							`游戏开始时，从以下武将牌中选择一张作为正面武将登场
                                    ${player.storage.dualside === undefined ? '，后选择的一张作为背面武将' : ''}
                                。`,
							'hidden', [['swyz_bawuyejushi', 'swyz_bawuxixian'], 'character']
						])
						.set('ai', button => { return Math.random() })
						.forResult();
					if (result.bool) {
						const cfg = [
							result.links[0],
							player.hp,
							player.maxHp,
							result.links[1],
							lib.character[result.links[1]].hp,
							lib.character[result.links[1]].maxHp
						];
						player.reinit(i, cfg[0], [cfg[1], cfg[2]]);
						if (player.storage.dualside === undefined) {
							player.storage.dualside = cfg;
							player.markSkillCharacter('dualside', { name: cfg[3] }, '背面', `当前体力：${cfg[4]}/${cfg[5]}`);
						}
					}
					break;
				}
			}
		},
		group: [
			"swyz_shuangsheng2"
		],
		derivation: [
			"swyz_jufeng",
			"swyz_jichi",
			"swyz_xieliao",
			"swyz_tianji",
			"swyz_keyword_dualside"
		]
	},
	swyz_shuangsheng2: {
		trigger: {
			player: "phaseBefore"
		},
		forced: true,
		filter: function (event, player) {
			if (player.storage.dualside_over) return false;
			return Array.isArray(player.storage.dualside) &&
				!event._noTurnOver && player.isTurnedOver();
		},
		content: async function content(event, trigger, player) {
			trigger._noTurnOver = true;
		},
		derivation: [
			"swyz_keyword_dualside"
		]
	},

	// 诱宵美九
	swyz_hexian: {
		audio: `${ea}swyz_youxiaomeijiu:1`,
		trigger: {
			player: "useCardEnd"
		},
		direct: true,
		filter: function filter(event, player) {
			return ['equip', 'delay'].includes(get.type(event.card));
		},
		content: async function content(event, trigger, player) {
			const hs = player.countCards('h');
			let players = game.filterPlayer(current => {
				return current != player &&
					current.countCards('h') == hs;
			}).sortBySeat(_status.currentPhase);
			while (players.length > 0) {
				let current = players.shift();
				const result = await current.chooseToUse({
					filterCard(card, player) {
						return ['equip', 'delay'].includes(get.type(card))
							&& lib.filter.filterCard.apply(this, arguments);
					},
					ai1(card) {
						if (current.attitudeTo(player) > 0) return get.cacheOrder(card);
						if (get.number(trigger.card) > get.number(card)) return 0;
						return get.cacheOrder(card);
					},
					addCount: false,
					respondTo: [player, trigger.card],
					prompt: '是否响应' + get.translation(player) + '的【和弦】？',
					prompt2: '以响应' + get.translation(player) + '使用的' +
						get.translation(trigger.card) + '的形式，使用一张即时牌',
					logSkill: ['swyz_hexian', player]
				}).forResult();
				if (result.bool) break;
			}
		}
	},
	swyz_xiezou: {
		audio: `${ea}swyz_youxiaomeijiu:2`,
		trigger: {
			global: [
				"useCardEnd",
				"respondEnd"
			]
		},
		forced: true,
		filter: function filter(event, player) {
			if (!event.respondTo) return false;
			const position = ['d', 'o'];
			if (event.cards.length !== 1
				|| !position.includes(get.position(event.cards[0], true))) return false;
			if (event.respondTo[1]?.cards.length !== 1
				|| !position.includes(get.position(event.respondTo[1].cards[0], true))) return false;
			return (event.player == player && player.canCompare(event.respondTo[0]))
				|| (event.respondTo[0] == player && player.canCompare(event.player));
		},
		content: async function content(event, trigger, player) {
			const fixedResult = {};
			fixedResult[trigger.player.playerid] = trigger.cards[0];
			fixedResult[trigger.respondTo[0].playerid] = trigger.respondTo[1].cards[0];
			const target = trigger.player == player ? trigger.respondTo[0] : trigger.player;
			const result = await player.chooseToCompare(target)
				.set('fixedResult', fixedResult)
				.forResult();
			if (result.winner) result.winner.draw();
			const suit1 = get.suit(trigger.card),
				suit2 = get.suit(trigger.respondTo[1]),
				allowSuits = ['heart', 'spade'];
			if ((suit1 == allowSuits[0] || suit1 == allowSuits[1])
				&& (suit2 == allowSuits[0] || suit2 == allowSuits[1])) await player.draw(1);
		}
	},

	// 夜刀神十香
	swyz_zhongjian: {
		audio: `${ea}swyz_yedaoshenshixiang:1`,
		shaRelated: true,
		enable: "chooseToUse",
		filter: function filter(event, player) {
			return player.countCards('h') > 0;
		},
		filterCard: function filterCard(card) {
			if (ui.selected.cards.length > 0)
				return get.suit(card) == get.suit(ui.selected.cards[0]);
			if (!_status.event.swyz_zhongjian_checkSuit) {
				let checkSuits = {}, max = 0;
				const player = get.owner(card);
				if (player) player.countCards('h', cardx => {
					const suit = get.suit(cardx);
					if (!checkSuits[suit]) checkSuits[suit] = 0;
					max = Math.max(++checkSuits[suit], max);
				});
				_status.event.swyz_zhongjian_checkSuit = [];
				for (const suit in checkSuits)
					if (checkSuits[suit] == max)
						_status.event.swyz_zhongjian_checkSuit.push(suit);
			}
			return _status.event.swyz_zhongjian_checkSuit.includes(get.suit(card));
		},
		selectCard: function selectCard() {
			if (ui.selected.cards.length > 0)
				return -1;
			return [1, Infinity];
		},
		complexCard: true,
		position: "h",
		viewAs: {
			name: "sha",
			storage: {
				swyz_zhongjian: true
			}
		},
		viewAsFilter: function viewAsFilter(player) {
			if (!player.countCards('h')) return false;
		},
		prompt: "将一种花色的所有手牌当做【杀】使用",
		check: function check(card) {
			return 6.4 - get.value(card);
		},
		onuse: async function onuse(result, player) {
			await player.showHandcards(`${lib.translate['swyz_zhongjian']}：${get.translation(player)}的手牌`);
		},
		ai: {
			order: function order(item, player) {
				return game.roundNumber < 3 ? 3 : 4;
			},
			result: {
				player: 1
			}
		},
		group: [
			"swyz_zhongjian_damage"
		],
		subSkill: {
			damage: {
				trigger: {
					player: "useCardBegin"
				},
				direct: true,
				filter: function filter(event, player) {
					return event.skill == 'swyz_zhongjian';
				},
				content: async function content(event, trigger, player) {
					if (!trigger.baseDamage) trigger.baseDamage = 0;
					else trigger.baseDamage--;
					trigger.baseDamage += Math.min(trigger.cards.length, game.roundNumber);
				},
				sub: true
			}
		}
	},
	swyz_aosha: {
		audio: `${ea}swyz_yedaoshenshixiang:1`,
		trigger: {
			player: "phaseJieshu"
		},
		frequent: true,
		filter: function filter(event, player) {
			let suits = [];
			game.getGlobalHistory('cardMove').filter(evt => {
				for (const card of evt.cards.filterInD('d')) suits.push(get.suit(card));
			});
			return new Set(suits).size >= 4;
		},
		content: async function content(event, trigger, player) {
			player.insertPhase('swyz_aosha').set('phaseList', ['phaseDraw', 'phaseUse']);
		},
		group: [
			"swyz_aosha_mark"
		],
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					global: [
						"loseAfter",
						"cardsDiscardAfter",
						"loseAsyncAfter",
						"equipAfter"
					]
				},
				direct: true,
				filter: function filter(event, player) {
					return _status.currentPhase == player;
				},
				content: async function content(event, trigger, player) {
					let suits = [], str = '';
					game.getGlobalHistory('cardMove').filter(evt => {
						for (const card of evt.cards.filterInD('d')) suits.push(get.suit(card));
					});
					for (const suit of new Set(suits)) str += `${lib.translate[suit]}`;
					if (str.length > 0) player.addTip('swyz_aosha_mark', `鏖杀${str}`, true);
				},
				sub: true
			}
		}
	},
}
