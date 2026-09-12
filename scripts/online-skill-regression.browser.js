import { lib, game, ui, get, ai, _status } from "noname";
import config from "/game/config.json";
import "/noname/init/polyfill.ts";
import { loadCharacter, loadCard } from "/noname/init/loading.ts";
import identity from "/mode/identity.js";
import { CacheContext } from "/noname/library/cache/cacheContext.js";
import { security, initializeSandboxRealms } from "/noname/util/sandbox.ts";
import { onlineCharacterLoadList, onlineCardLoadList } from "/noname/online/characterPool.js";
import { decodeChoice, validateResult, describeChoiceDialog } from "/noname/online/host.js";
import { decorateSkillControl, decorateChoiceDialog } from "/noname/online/ui/skillControls.js";

const report = { passed: [], failures: [], audit: { characters: 0, activeSkills: 0, errors: [] } };
const assert = (ok, message) => {
	if (!ok) throw new Error(message);
};
const test = (name, fn) => {
	try {
		fn();
		report.passed.push(name);
	} catch (error) {
		report.failures.push({ name, error: error.stack });
	}
};
try {
	lib.config = { ...structuredClone(config), mode: "identity", characters: onlineCharacterLoadList(), cards: onlineCardLoadList(), background_speak: false, background_music: "music_off", animation: false, bannedpile: {}, addedpile: {} };
	lib.assetURL = "/";
	lib.configOL = { mode: "identity", characterPack: onlineCharacterLoadList(), banned: [], bannedcards: [] };
	Object.assign(lib, { get, game, ui, ai, connectCharacterPack: [], connectCardPack: [] });
	game.layout = "newlayout";
	_status.mode = "normal";
	ui.css = {};
	ui.dialogs = [];
	ui.controls = [];
	CacheContext.setProxy({ lib, game, get });
	Object.assign(get, identity.get);
	Object.assign(ai, identity.ai);
	_status.characterlist = [];
	await initializeSandboxRealms(true);
	await security.initSecurity({ lib, game, ui, get, ai, _status });
	ui.window = ui.create.div("#window", document.body);
	ui.arena = ui.create.div("#arena", ui.window);
	ui.background = ui.create.div(".background", document.body);
	ui.backgroundMusic = document.createElement("audio");
	for (const [key, cls] of Object.entries({ cardPile: "card-pile", discardPile: "discard-pile", ordering: "ordering", special: "special", control: "control", system: "system" })) ui[key] = ui.create.div("." + cls, ui.window);
	ui.system1 = ui.create.div(ui.system);
	ui.system2 = ui.create.div(ui.system);
	for (const name of onlineCharacterLoadList()) {
		const mod = await import(/* @vite-ignore */ `/character/${name}/index.js`);
		if (mod.default) await game.import(mod.type || "character", mod.default);
	}
	for (const pack of Object.values(lib.imported.character)) loadCharacter(pack);
	for (const name of onlineCardLoadList()) {
		const mod = await import(/* @vite-ignore */ `/card/${name}.js`);
		if (mod.default) await game.import(mod.type || "card", mod.default);
	}
	for (const pack of Object.values(lib.imported.card)) loadCard(pack);
	game.finishCards();
	_status.event = new lib.element.GameEvent("phaseUse", false);
	game.players = Array.from({ length: 4 }, () => ui.create.player(ui.arena));
	game.dead = [];
	game.me = game.zhu = game.players[0];
	lib.playerOL = {};
	lib.cardOL = {};
	lib.vcardOL = {};
	for (const [i, player] of game.players.entries()) {
		player.playerid = "test-seat-" + i;
		lib.playerOL[player.playerid] = player;
		player.next = player.nextSeat = game.players[(i + 1) % 4];
		player.previous = player.previousSeat = game.players[(i + 3) % 4];
		player.identity = i ? "fan" : "zhu";
		player.init("caocao");
	}
	let player = game.players[0];
	const other = game.players[1];
	const makeEvent = (name, fields = {}) => Object.assign(new lib.element.GameEvent(name, false), { player, ...fields });
	const phase = () => makeEvent("chooseToUse", { type: "phase", filterCard: lib.filter.cardEnabled, selectCard: 1, filterTarget: lib.filter.filterTarget, selectTarget: lib.filter.selectTarget, position: "hs" });
	_status.event = phase();
	_status.currentPhase = player;
	game.phaseNumber = 1;
	game.roundNumber = 1;
	const wire = value => decodeChoice(JSON.parse(JSON.stringify(get.stringifiedResult(value))));
	const addCard = (name, suit = "heart", number = 7) => {
		const card = ui.create.card().init([suit, number, name]);
		card.cardid = get.id();
		lib.cardOL[card.cardid] = card;
		player.node.handcards1.append(card);
		return card;
	};
	test("天妒/chooseUseTarget：虚拟锦囊的目标和距离验证", () => {
		const card = { name: "juedou", isCard: true };
		const event = makeEvent("chooseTarget", { _get_card: card, filterTarget: (c, p, t) => lib.filter.targetInRange(c, p, t) && lib.filter.targetEnabledx(c, p, t), selectTarget: lib.filter.selectTarget });
		validateResult(event, player, wire({ bool: true, targets: [other] }));
		let rejected = false;
		try {
			validateResult(event, player, wire({ bool: true, targets: [player] }));
		} catch {
			rejected = true;
		}
		assert(rejected, "决斗不能以自己为目标");
	});
	for (const prefix of ["sb", "tw"])
		for (const name of ["xingshang", "fangzhu"]) {
			const skill = prefix + name,
				mark = prefix + "xingshang";
			test(skill + "：标记条件、选项传输、服务端备份和目标选择", () => {
				player.init("sb_caopi");
				if (prefix === "tw") player.addSkill(["twxingshang", "twfangzhu"]);
				player.storage[mark] = 9;
				const event = phase();
				_status.event = event;
				assert(lib.filter.filterEnable(event, player, skill), "满足标记条件后应可发动");
				validateResult(event, player, wire({ bool: true, skill }));
				const info = lib.skill[skill].chooseButton,
					dialog = info.dialog(event, player);
				const description = get.parsedResult(JSON.parse(JSON.stringify(get.stringifiedResult(describeChoiceDialog(dialog)))));
				const restored = ui.create.dialog(description.title, "hidden");
				for (const [item, type] of description.buttons) restored.add([[item], type]);
				assert(restored.buttons.length === dialog.buttons.length && restored.buttons.every((button, i) => button.link === dialog.buttons[i].link), "重连和远端弹窗必须恢复所有选项");
				restored.close();
				const offered = dialog.buttons.filter(button => info.filter(button, player));
				assert(offered.length > 0, "应有可选效果");
				for (const button of offered) {
					const selection = makeEvent("chooseButton", { dialog, filterButton: info.filter, selectButton: 1 });
					const result = wire({ bool: true, links: [button.link] });
					validateResult(selection, player, result);
					const backup = (lib.skill[skill + "_backup"] = info.backup(result.links, player));
					backup.sourceSkill = skill;
					assert(backup.effect === lib.skill[skill].getList[button.link], "应使用本机技能效果，不能从网络安装函数");
					const next = phase();
					next.backup(skill + "_backup");
					const targets = [];
					for (const target of game.players) {
						ui.selected.targets = targets;
						if (backup.filterTarget === true || backup.filterTarget(null, player, target)) targets.push(target);
						if (targets.length >= get.select(backup.selectTarget)[0]) break;
					}
					ui.selected.targets = [];
					if (targets.length) validateResult(next, player, wire({ bool: true, skill: skill + "_backup", targets, cards: [] }));
				}
				dialog.close();
				player.storage[mark] = 0;
				assert(!lib.filter.filterEnable(event, player, skill), "标记不足时不能发动");
			});
		}
	test("拒绝客户端携带函数或伪造技能", () => {
		let rejected = 0;
		try {
			wire({ bool: true, links: [{ effect: () => true }] });
		} catch {
			rejected++;
		}
		try {
			validateResult(phase(), player, { bool: true, skill: "nonexistent_skill" });
		} catch {
			rejected++;
		}
		assert(rejected === 2, "不能放宽技能和函数校验");
	});
	test("谋张辽登锋等：选项和目标联合选择，目标过滤能读取先选的按钮", () => {
		const dialog = ui.create.dialog(
			"联合选择",
			[
				[
					["equip", "获得装备"],
					["sha", "获得杀"],
				],
				"textbutton",
			],
			"hidden"
		);
		const event = makeEvent("chooseButtonTarget", { dialog, selectButton: 1, selectTarget: 1, filterButton: () => true, filterTarget: (card, p, t) => ui.selected.buttons[0]?.link === "sha" && t !== p });
		validateResult(event, player, wire({ bool: true, links: ["sha"], targets: [other] }));
		let rejected = false;
		try {
			validateResult(event, player, wire({ bool: true, links: ["equip"], targets: [other] }));
		} catch {
			rejected = true;
		}
		assert(rejected, "按钮和目标不匹配时应拒绝");
		dialog.close();
	});
	test("TW谋曹丕行殇/虞翻纵玄：分配卡牌与目标的联合选择", () => {
		const card = addCard("juedou");
		ui.ordering.append(card);
		const dialog = ui.create.dialog("分配牌", [card], "hidden");
		const event = makeEvent("chooseButtonTarget", { dialog, selectButton: 1, selectTarget: 1, filterButton: () => true, filterTarget: (c, p, t) => ui.selected.buttons[0]?.link === card && t !== p });
		const result = wire({ bool: true, links: [card], targets: [other] });
		validateResult(event, player, result);
		assert(result.links[0] === card && result.buttons[0] === dialog.buttons[0], "必须恢复真实牌及按钮");
		dialog.close();
	});
	for (const [character, skill, name, suit, target] of [
		["guanyu", "wusheng", "shan", "heart", true],
		["zhaoyun", "longdan_sha", "shan", "club", true],
		["ganning", "qixi", "sha", "spade", true],
		["daqiao", "guose", "sha", "diamond", true],
		["liubei", "rende", "sha", "heart", true],
		["sunquan", "zhiheng", "sha", "heart", false],
	])
		test(character + "/" + skill + "：实体牌、转化牌及主动技能提交", () => {
			player.init(character);
			other.node.handcards1.append(ui.create.card().init(["club", 2, "shan"]));
			const card = addCard(name, suit);
			const event = phase();
			_status.event = event;
			const result = wire({ bool: true, skill, cards: [card], targets: target ? [other] : [] });
			validateResult(event, player, result);
			assert(result.skill === skill, "应保留合法技能");
		});
	test("取消与拒绝不会污染服务端的选择上下文", () => {
		const event = makeEvent("chooseTarget", { filterTarget: lib.filter.notMe, selectTarget: 1 });
		const previous = _status.event,
			buttons = ui.selected.buttons,
			targets = ui.selected.targets;
		let rejected = false;
		try {
			validateResult(event, player, { bool: true, targets: [player] });
		} catch {
			rejected = true;
		}
		assert(rejected && _status.event === previous && ui.selected.buttons === buttons && ui.selected.targets === targets, "应恢复上下文");
		const result = { bool: false, skill: "wusheng", targets: [other] };
		validateResult(event, player, result);
		assert(result.confirm === "cancel" && Object.keys(result).length === 2 && result.bool === false, "取消不得携带可执行选择");
	});
	for (const [character, skill, cardName, suit] of [
		["zhenji", "qingguo", "sha", "spade"],
		["zhaoyun", "longdan_shan", "sha", "heart"],
	]) {
		test(character + "/" + skill + "：响应闪的转化牌提交", () => {
			player.init(character);
			const card = addCard(cardName, suit);
			const event = makeEvent("chooseToRespond", { filterCard: c => get.name(c) === "shan", selectCard: 1, position: "hs" });
			_status.event = event;
			const result = wire({ bool: true, skill, cards: [card], targets: [] });
			validateResult(event, player, result);
			assert(result.card.name === "shan", "应由服务端重建闪");
		});
	}
	// Exercise each shipped character's own enable/filter code with real players,
	// cards, history and marks; collect concrete failures for review, not a claim
	// that every branch of every skill has been played through.
	const ids = [...new Set(onlineCharacterLoadList().flatMap(pack => Object.keys(lib.characterPack[pack] || {})))];
	for (const id of ids) {
		try {
			player.remove();
			player = ui.create.player(ui.arena);
			game.players[0] = game.me = game.zhu = player;
			player.playerid = "test-seat-0";
			lib.playerOL[player.playerid] = player;
			player.identity = "zhu";
			for (const [i, seat] of game.players.entries()) {
				seat.next = seat.nextSeat = game.players[(i + 1) % 4];
				seat.previous = seat.previousSeat = game.players[(i + 3) % 4];
			}
			_status.event = phase();
			_status.currentPhase = player;
			player.init(id);
			for (const node of Array.from(player.node.handcards1.childNodes)) node.remove();
			for (const name of ["sha", "shan", "tao", "juedou"]) {
				const card = ui.create.card().init(["heart", 7, name]);
				player.node.handcards1.append(card);
			}
			const skills = game.expandSkills(player.getSkills(false).slice()).filter(skill => lib.skill[skill]?.enable);
			for (const skill of skills) lib.skill[skill].onChooseToUse?.(_status.event);
			for (const skill of skills) {
				report.audit.activeSkills++;
				try {
					lib.filter.filterEnable(_status.event, player, skill);
				} catch (error) {
					report.audit.errors.push({ id, skill, error: error.stack });
				}
			}
			report.audit.characters++;
		} catch (error) {
			report.audit.errors.push({ id, error: error.stack });
		}
	}
	// Leave a real control/dialog on screen for desktop and narrow-screen QA.
	for (const node of Array.from(ui.window.children)) if (node !== ui.arena && node !== ui.control) node.remove();
	for (const node of Array.from(ui.arena.children)) node.remove();
	ui.arena.style.cssText = "position:fixed;inset:0;width:100%;height:100%;";
	document.body.style.background = "#192d2c";
	ui.window.append(ui.control);
	ui.control.style.cssText = "position:fixed;top:auto;bottom:20px;left:5%;width:90%;height:auto;z-index:20;";
	player.init("sb_caopi");
	player.storage.sbxingshang = 4;
	_status.event = phase();
	ui.control.id = "control";
	ui.control.className = "";
	document.body.classList.add("online-managed-game");
	for (const seat of game.players) {
		delete seat.storage.sbfangzhu_ban;
	}
	const dialog = lib.skill.sbfangzhu.chooseButton.dialog(_status.event, player);
	decorateChoiceDialog(dialog);
	dialog.open();
	for (const button of dialog.buttons) button.classList.add(lib.skill.sbfangzhu.chooseButton.filter(button, player) ? "selectable" : "unselectable");
	await Promise.all(
		["/layout/default/layout.css", "/layout/newlayout/layout.css", "/noname/online/ui/online.css"].map(
			href =>
				new Promise(resolve => {
					const link = document.createElement("link");
					link.rel = "stylesheet";
					link.href = href;
					link.onload = resolve;
					document.head.append(link);
				})
		)
	);
	window.__skillPreview = () => {
		const control = ui.create.control(["sbxingshang", "sbfangzhu", () => {}]);
		control.skills = ["sbxingshang", "sbfangzhu"];
		decorateSkillControl(control, player);
	};
} catch (error) {
	report.fatal = error.stack;
}
window.__skillReport = report;
