import { lib, game, ui, get, ai, _status } from "noname";

import characters from "../../character/character.js";
import runestoneSkills from "../lib/skill/runestone.js";
import strategySkills from "../lib/skill/strategy.js";

	//<noname-poptip poptip = tipname></noname-poptip>
	const poptipMap = new Map([
		["rule_nysgs_fengjin", {
			name: "封禁",
			info: "封禁：封禁是一种特殊的状态：1.封禁状态角色的非锁定技失效（除觉醒技、使命技和昂扬技）；2.封禁不会令符石技能，战法技能和皮肤技能失效",
		}],
		["rule_nysgs_yinni", {
			name: "隐匿",
			info: "隐匿：隐匿是一种特殊的状态：1.处于隐匿状态下，无法被翻面；2.不能被其他角色使用的【杀】和单体锦囊牌指定。<br>解除隐匿：1.受到伤害是防止，然后解除隐匿；2.造成伤害时翻倍，然后解除隐匿",
		}],
		["rule_nysgs_xuanyun", {
			name: "眩晕",
			info: "眩晕：眩晕是一种特殊的状态：眩晕角色无法使用或打手牌（除【闪】外）",
		}],
		["rule_nysgs_cuihui", {
			name: "摧毁",
			info: "摧毁：摧毁是卡牌的一种特殊的状态：1.无法使用、打出和拼点；2.置入弃牌堆后移除此状态",
		}],
		["rule_nysgs_tongxin", {
			name: "同心",
			info: "同心：同心是一种特殊的技能：双将模式中，背面武将拥有此技能会被正面武将共享（背面武将阵亡后不再共享）",
		}],
		["rule_nysgs_qianghua", {
			name: "强化",
			info: "强化：强化是装备牌的一种特殊效果：已强化的装备牌离开装备区后，强化效果移除",
		}],
		["rule_nysgs_wuqiqianghua", {
			name: "武器强化",
			info: "武器强化：凤嘴刀：你造成的属性伤害+1；<br>龙牙枪：你造成伤害后获得1点怒气；<br>麒麟弓：你使用【杀】可以额外指定1个目标；<br>青釭剑：你对有护甲的角色造成的伤害翻倍；<br>丈八蛇矛：你攻击范围内的其他角色濒死时不能使用【酒】<br>诸葛连弩：你强化使用【杀】伤害+1",
		}],
		["rule_nysgs_fangjuqianghua", {
			name: "防具强化",
			info: "防具强化：八卦阵：你使用伤害类锦囊牌无法被【无懈可击】响应且伤害+1；<br>霸者披风：你不能成为其他角色使用单体非延时锦囊牌的目标；<br>白银狮子：当你失去【白银狮子】后，封禁其他角色，直至你换将或回合结束；<br>龙鳞甲：你使用黑色【杀】指定目标后，其流失1点体力",
		}],
		["rule_nysgs_nature_water", {
			name: "水属性伤害",
			info: "水属性伤害：属性伤害的一种，角色即将受到水属性伤害时，将此伤害改为体力流失。无法被连环传导",
		}],
	]);

	poptipMap.forEach((value, key) => {
		lib.translate[key] = value.name;
		lib.translate[`${key}_info`] = value.info;
	});

	lib.runestoneSkills = Object.keys(runestoneSkills);
	lib.strategySkills = Object.keys(strategySkills);
	lib.nysgsRunestoneMap = {
		attack: "攻击",
		defend: "防御",
		draw: "摸牌",
		fury: "怒气",
		exclusive: "专属",
	};
	lib.element.player.inits = []
		.concat(lib.element.player.inits || [])
		.concat(player => {
			if (!player.nysgs_hidden) {
				player.nysgs_hidden = ui.create.div(".nysgs-hidden", "<div>" + get.verticalStr("隐匿") + "<div>", player);
			}
			/**怒焰双将 => 双面武将
			 * 玩怒焰双将，这也太阴了吧
			 */
			if (lib.config["extension_怒焰三国_ruleSkill"] && player.name1?.startsWith("nysgs_") && player.name2) {
				var name2 = player.name2;
            	var list = [player.name1, name2];
                player.storage.nysgs_change = [player.name1, player.hp, player.maxHp];
                var info2 = lib.character[name2];
                player.storage.nysgs_change.push(name2);
                player.storage.nysgs_change.push(info2.hp);
                player.storage.nysgs_change.push(info2.maxHp);
                var cfg = player.storage.nysgs_change;
                player.markSkillCharacter("nysgs_change", { name: cfg[3] }, "背面", "当前体力：" + cfg[4] + "/" + cfg[5]);
				game.broadcastAll(player => {
                    player.smoothAvatar(true);
                    player.node.avatar2.classList.add("hidden");
                    player.classList.remove("fullskin2");
                    player.node.name2.innerHTML = "";
                    player.removeSkill(lib.character[player.name2][3]);
                    player.syncSkills();
                    delete player.name2;
                    if (player == game.me && ui.fakeme) {
                        ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                    }
                }, player);
                player.addSkill("nysgs_change");
                //同心技
                const skills = get.character(name2).skills.filter(skill => get.info(skill)?.dualSideSkill);
                if (skills.length) player.addAdditionalSkill("nysgs_change", skills);
			}
			if (player.nysgsBuff) return;
			player.nysgsBuff = {};
			const num1 = player.nysgsGetFury(),
				num2 = player.nysgsGetFury(true);
			if (!num2) return;
			player.nysgsFury = num1;
			player.nysgsMaxFury = num2;
			player.addSkill("nysgsFury_use");
			player.markSkill("nysgsFury");
			if (lib.config.extension_怒焰三国_commonMode) {
				player.nysgsFury = 2;
				player.nysgsMaxFury = 4;
				game.log(player, "的", "#r怒气值", "为", "#r" + player.nysgsFury);
				game.log(player, "的", "#r怒气上限", "为", "#r" + player.nysgsMaxFury);
				return;
			}
			if (lib.config.extension_怒焰三国_stratagem) {
				const onEquip = _status.nysgsOnEquip[player.name1];
				if (!onEquip || typeof onEquip != "object") return;
				const list = Object.keys(onEquip).filter(key => key >= 5).map(key => onEquip[key]);
				player.nysgsFury += list.filter(info => info.endsWith("tiannu")).length;
				player.nysgsMaxFury += list.filter(info => info.endsWith("tianchen")).length;
				player.hp += list.filter(info => info.endsWith("tianyan")).length;
				player.maxHp += list.filter(info => info.endsWith("tianyan")).length;
				//player.update();
				const skills = Object.values(onEquip).toUniqued().removeArray(["nysgs_runestone_tianchen", "nysgs_runestone_tiannu", "nysgs_runestone_tianyan", "nysgs_icon_point"]);
				skills.forEach(skill => {
					player.addZhanfa(skill);
					if (get.info(skill).runestoneSkill) {
						player.addMark(skill, 6, false);
					}
				});
			}
			game.log(player, "的", "#r怒气值", "为", "#r" + player.nysgsFury);
			game.log(player, "的", "#r怒气上限", "为", "#r" + player.nysgsMaxFury);
		});

	lib.namePrefix.set("怒焰", {
		color: "#CD6836",
		nature: "firemm",
	});
	lib.namePrefix.set("幻", {
		color: "#6532a8",
		nature: "blackmm",
	});
	lib.namePrefix.set("威", {
		color: "#ff0000",
		nature: "firemm",
	});
	lib.namePrefix.set("魏", {
		color: "#b0d0e2",
		nature: "water",
	});
	lib.namePrefix.set("吴", {
		color: "#b2d9a9",
		nature: "wood",
	});
	lib.namePrefix.set("怒焰神", {
		getSpan: () => `${get.prefixSpan("怒焰")}${get.prefixSpan("神")}`,
	});
	lib.namePrefix.set("怒焰界", {
		getSpan: () => `${get.prefixSpan("怒焰")}${get.prefixSpan("界")}`,
	});
	lib.namePrefix.set("怒焰幻", {
		getSpan: () => `${get.prefixSpan("怒焰")}${get.prefixSpan("幻")}`,
	});
	lib.namePrefix.set("怒焰谋", {
		getSpan: () => `${get.prefixSpan("怒焰")}${get.prefixSpan("谋")}`,
	});
	lib.namePrefix.set("怒焰威", {
		getSpan: () => `${get.prefixSpan("怒焰")}${get.prefixSpan("威")}`,
	});
	lib.namePrefix.set("怒焰起", {
		getSpan: () => `${get.prefixSpan("怒焰")}${get.prefixSpan("起")}`,
	});
	lib.namePrefix.set("怒焰魏", {
		getSpan: () => `${get.prefixSpan("怒焰")}${get.prefixSpan("魏")}`,
	});
	lib.namePrefix.set("怒焰吴", {
		getSpan: () => `${get.prefixSpan("怒焰")}${get.prefixSpan("吴")}`,
	});

	/*
	lib.hooks.checkEnd.push(function nysgsFuryTip(event) {
		if (event.name != "chooseToUse" || event.skill != "nysgsFury_use") return;
		const dialog = event.skillDialog;
		if (dialog?.content?.lastChild) {
			if (ui.selected.cards.length) {
				const card = ui.selected.cards[0];
				dialog.content.lastChild.innerHTML = `<div><div style="width:100%;text-align:center">你可以失去1点怒气强化使用【${get.translation(card.name)}】，令此牌${get.info("_nysgsFury_buff").getBuff.get(card.name).description}</div></div>`;
			} else {
				dialog.content.lastChild.innerHTML = `<div><div style="width:100%;text-align:center">${get.info("nysgsFury_use").prompt}</div></div>`;
			}
		}
	});
	*/
	nysgs.onEquip = class OnEquip {
		constructor(name) {
			this.name = name;
		}

		init() {
			if (!lib.config.extension_怒焰三国_OnEquip[this.name]) {
				lib.config.extension_怒焰三国_OnEquip[this.name] = {};
			}
			game.saveExtensionConfig("怒焰三国", "OnEquip", lib.config.extension_怒焰三国_OnEquip);
			this.create();
		}

		create() {
			const name = this.name;
			const onEquip = this;
			const dialog = ui.create.div(ui.window, ".nysgsChangeOnEquip");
			this.dialog = dialog;
			const close = ui.create.div(dialog, '.nysgsChangeOnEquipClose', () => {
				dialog.remove();
			});
			const level = get.nysgsStarLevel(name);

			for (let i = 0; i < 6; i++) {
				const node = ui.create.div('.nysgsChangeOnEquipArea', dialog);
				const data = lib.config.extension_怒焰三国_OnEquip[name];
				const img = new Image();
				img.src = `${lib.assetURL}/extension/怒焰三国/image/icon/${data?.[i] ? data[i] : "nysgs_icon_point"}.png`;
				img.classList.add("nysgsChangeOnEquipImg");
				node.appendChild(img);
				const text = document.createElement("p");
				text.classList.add("nysgsOnEquipText");
				text.innerText = i < 4 ? get.cnNumber(i + 1, true) : i == 4 ? "战" : "专";
				node.appendChild(text);
				node.setAttribute("id", i);
				node._index = i;
				node.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
					const elements = document.querySelectorAll(`.nysgsChangeOnEquipDiv`);
					elements.forEach(ele => ele.remove());
					onEquip.clickConfig(this);
				});
			}

			for (let i = 6; i < level + 6; i++) {
				const node = ui.create.div('.nysgsChangeOnEquipArea', dialog);
				const data = lib.config.extension_怒焰三国_OnEquip[name];
				const img = new Image();
				img.src = `${lib.assetURL}/extension/怒焰三国/image/icon/${data?.[i] ? data[i] : "nysgs_icon_point"}.png`;
				img.classList.add("nysgsChangeOnEquipImg");
				node.appendChild(img);
				node._index = i;
				node.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
					const elements = document.querySelectorAll(`.nysgsChangeOnEquipDiv`);
					elements.forEach(ele => ele.remove());
					onEquip.clickConfig(this);
				});
			}
		}

		clickConfig(link) {
			this.removeTip();
			const onEquip = this;
			const { name, dialog } = this;
			const index = link._index,
				config = lib.config.extension_怒焰三国_OnEquip;
			const background = ui.create.div(dialog, ".nysgsChangeOnEquipDiv");
			this.bg = background;
			const skills = ["nysgs_icon_point"];
			if (index >= 6) {
				const list = ["chen", "nu", "yan"].map(info => `nysgs_runestone_tian${info}`)
					.filter(skill => onEquip.checkConfig(skill, index));
				skills.addArray(list);
			}
			else if (index < 4) {
				skills.addArray(lib.runestoneSkills.filter(skill => onEquip.checkConfig(skill, index)));
			}
			else if (index == 4) {
				skills.addArray(lib.strategySkills);
			} else if (lib.character[name].runestone) {
				skills.addArray(lib.character[name].runestone);
			}
			for (let skill of skills) {
				const node = ui.create.div('.nysgsChangeOnEquipArea', background);
				const img = new Image();
				img.src = `${lib.assetURL}/extension/怒焰三国/image/icon/${skill}.png`;
				img.classList.add("nysgsChangeOnEquipImg");
				node.appendChild(img);

				const text = document.createElement("p");
				text.classList.add("nysgsOnEquipTextBottom");
				text.innerText = get.translation(skill);
				node.appendChild(text);

				node._link = link;
				node.link = skill;
				node._index = link._index;
				node.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
					if (this.classList.contains("selected")) {
						onEquip.updateConfig(this);
						background.remove();
					} else {
						onEquip.recheckConfig();
						this.classList.add("selected");
						onEquip.addTip(this);
					}
				});
			}
		}

		updateConfig(link) {
			this.removeTip();
			lib.config.extension_怒焰三国_OnEquip[this.name][link._index] = link.link;
			game.saveExtensionConfig("怒焰三国", "OnEquip", lib.config.extension_怒焰三国_OnEquip);
			link._link.firstChild.src = `${lib.assetURL}/extension/怒焰三国/image/icon/${link.link}.png`;
		}

		checkConfig(skill, key) {
			const config = lib.config.extension_怒焰三国_OnEquip[this.name];
			if (key >= 0 && key <= 3) {
				return ![0, 1, 2, 3].slice().remove(key).some(item => {
					return get.info(config[item])?.runestoneSkill == get.info(skill).runestoneSkill;
				});
			} else if (key >= 6 && key <= 11) {
				const getLimit = skill.endsWith("tianyan") ? 1 : skill.endsWith("tianchen") ? 3 : skill.endsWith("tiannu") ? 3 : 6;
				return [6, 7, 8, 9, 10, 11]
					.filter(item => {
						return config.hasOwnProperty(item) && config[item] == skill;
					}).length < getLimit;
			}
			return true;
		}

		recheckConfig() {
			const elements = document.querySelectorAll(".nysgsChangeOnEquipArea");
			elements.forEach(ele => ele.classList.remove("selected"));
		}

		addTip(link) {
			this.removeTip();
			const onEquip = this;
			const { name, dialog, bg } = this;
			const index = link._index,
				config = lib.config.extension_怒焰三国_OnEquip;
			const node = ui.create.div(".nysgsChangeOnEquipTip", dialog);
			node.innerHTML = "<p style='color: gold;margin: 2%;'>" + get.translation(link.link) + "</p>" + "<p style='margin: 2%;'>" + get.skillInfoTranslation(link.link) + "</p>";
			this.tip = node;
		}

		removeTip() {
			const elements = document.querySelectorAll(".nysgsChangeOnEquipTip");
			elements.forEach(ele => ele.remove());
		}
	}
	nysgs.changeOnEquip = function (name) {
		const dialog = new nysgs.onEquip(name);
		dialog.init();
	}
	nysgs.updateSkillBuff = function (player, skill, type) {
		if (!type) type = "removeMark";
		player[type](skill, 1, false);
		if (!player.nysgsBuff) return;
		const buff = player.nysgsBuff[skill];
		if (!buff) return;
		buff.mark.innerHTML = player.countMark(skill);
		if (!player.countMark(skill)) buff.remove();
	}
	nysgs.animSkillBuff = function (player, skill) {
		if (!player.nysgsBuff) return;
		const buff = player.nysgsBuff[skill];
		if (buff) {
			buff.update();
		}
	}
	nysgs.createSkillBuff = function (buffs, player, first) {
		//参考太虚幻境侍灵
		let buffBox = player.nysgsBuffBox || document.createElement("div");
		buffBox.classList.add("nysgs-skillBuffIcons1");

		function createBuff(ele, buff, first) {
			let div = document.createElement("div");
			div.style.width = "20px";
			div.style.height = "20px";

			let node = document.createElement("div");
			node.classList.add("nysgs-skillBuff");
			node.style.width = "20px";
			node.style.height = "20px";
			node.style.position = "absolute";
			node.style.zIndex = 8;
			node.style.pointerEvents = "none";
			div.appendChild(node);
			let img = new Image();
			img.node = node;
			div.appendChild(img);
			img.classList.add("nysgs-skillBuff");
			img.src = `extension/怒焰三国/image/icon/${buff}.png`;
			img.setAttribute("id", buff);
			var desc = document.createElement("div");
			desc.classList.add("nysgs-skillBuffDesc");
			desc.innerHTML = "<p style='color: gold;margin: 2%;'>" + get.translation(buff) + "</p>" + "<p style='margin: 2%;'>" + get.skillInfoTranslation(buff) + "</p>";
			desc.style.display = "none";
			img.desc = desc;
			document.body.appendChild(desc);

			img.mark = document.createElement("p");
			img.mark.classList.add("nysgs-skillBuffText");
			img.mark.innerText = get.info(buff).runestoneSkill ? player.countMark(buff) : "100%";
			div.appendChild(img.mark);

			img.player = player;
			img.addEventListener("click", function () {
				event.cancelBubble = true;
				event.returnValue = false;
				return false;
			});
			img.onmouseover = function () {
				this.desc.style.display = "block";
			};
			img.onmouseout = function () {
				this.desc.style.display = "none";
			};
			img.update = function () {
				this.node.classList.add("nysgs-skillBuffAnim");
				setTimeout(() => {
					this.node.classList.remove("nysgs-skillBuffAnim");
				}, 1000);
				this.node.classList.add("nysgs-skillBuffRefresh");
				setTimeout(() => {
					this.node.classList.remove("nysgs-skillBuffRefresh");
				}, 500);
			};
			img.remove = function () {
				this.desc.remove();
				delete this.player.nysgsBuff[buff];
				this.closest("div").remove();
			};
			player.nysgsBuff[buff] = img;
			player.nysgsBuffBox = buffBox;
			
			if (first) {
				ele.insertBefore(div, ele.firstChild);
			} else {
				ele.appendChild(div);
			}

			if (lib.config.extension_十周年UI_enable) {
				div.classList.add("nysgsBuff_dui");
				node.classList.add("nysgsBuff_dui");
				img.classList.add("dui");
			}
		}

		if (player == game.me) {
			let ss = document.querySelector(".skill-control");
			if (ss) {
				ss.querySelector(".trigger").style.float = "right";
				ss.insertBefore(buffBox, ss.firstChild);
			} else {
				buffBox.classList.remove("nysgs-skillBuffIcons1");
				buffBox.classList.add("nysgs-skillBuffIcons2");
				player.appendChild(buffBox);
			}

			buffs.forEach((e) => {
				createBuff(buffBox, e, first);
			});
		}
		else {
			if (lib.config.extension_十周年UI_enable) {
				buffBox.classList.remove("nysgs-skillBuffIcons1");
				buffBox.classList.add("nysgs-skillBuffIcons4");
			} else {
				buffBox.classList.remove("nysgs-skillBuffIcons1");
				buffBox.classList.add("nysgs-skillBuffIcons3");
			}

			player.appendChild(buffBox);
			buffs.forEach((e) => {
				createBuff(buffBox, e, first);
			});
		}
	}
	nysgs.initSkillBuff = function (character) {
		var obj = {};
		for (let i = 0; i < 12; i++) {
			if (i > 5 + get.nysgsStarLevel(character)) break;
			switch (i) {
				case 0: case 1: case 2: case 3: {
					obj[i] = lib.runestoneSkills.filter(skill => {
						return get.info(skill).runestoneSkill == ["attack", "defend", "draw", "fury"][i];
					}).randomGet();
				}
					break;
				case 4: {
					obj[i] = lib.strategySkills.randomGet();
				}
					break;
				case 5: {
					obj[i] = (lib.character[character]?.runestone ?? []).randomGet() ?? "nysgs_icon_point";
				}
					break;
				default: {
					obj[i] = `nysgs_runestone_tian${["nu", "chen", "nu", "chen", "nu", "yan"][i - 6]}`;
				}
			}
		}
		return obj;
	}
