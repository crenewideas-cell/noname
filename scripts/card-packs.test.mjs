import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { pathToFileURL } from "node:url";
import { registerCardPack, createCardCollection, createCardPackBuilder, isCardPackEnabled, setCardPackEnabled, applyModeCardPacks, resolveCardPackImage, replaceCardPackPile } from "../apps/core/noname/init/cardPackRuntime.js";
import presentation from "../apps/core/extension/collections/卡牌扩展/presentation.js";

const root = path.resolve(import.meta.dirname, "../apps/core");
const directory = path.join(root, "extension/collections/卡牌扩展");
const manifest = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json")));
const members = await Promise.all(manifest.members.map(async member => ({ ...member, create: (await import(pathToFileURL(path.join(directory, "members", member.id, "data.js")))).default })));
function copy(value) {
	if (!value || typeof value !== "object") return value;
	if (Array.isArray(value)) return value.map(copy);
	return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, copy(child)]));
}
for (const [key, value] of Object.entries({
	contains(item) {
		return this.includes(item);
	},
	randomGet() {
		return this[0];
	},
	randomGets(count) {
		return this.slice(0, count);
	},
	add(item) {
		if (!this.includes(item)) this.push(item);
		return this;
	},
	addArray(items) {
		for (const item of items) this.add(item);
		return this;
	},
	remove(item) {
		const at = this.indexOf(item);
		if (at >= 0) this.splice(at, 1);
		return this;
	},
}))
	if (!Array.prototype[key]) Object.defineProperty(Array.prototype, key, { value, configurable: true });

function fixture(settings = {}) {
	const lib = {
		config: { mode: "identity", cards: [], connect_cards: [], bannedpile: {}, addedpile: {}, ...settings },
		card: { list: [] },
		skill: {},
		translate: {},
		cardPack: {},
		cardPackInfo: {},
		cardPile: {},
		connectCardPack: [],
		suit: ["spade", "heart", "club", "diamond"],
		filter: {},
		nature: new Map(),
		linked: [],
		group: [],
		groupnature: {},
		character: { test: ["male", "wei", 4, ["testSkill"], []] },
		arenaReady: [],
		assetURL: "",
	};
	const game = {
		saveConfig(key, value) {
			lib.config[key] = value;
		},
	};
	const get = { mode: () => lib.config.mode, rand: () => 1, copy, translation: value => value, skillintro: () => "测试技能", config: () => false, convertedCharacter: value => ({ trashBin: value[4], hp: value[2], skills: value[3] }) };
	return { lib, game, get, args: [lib, game, {}, get, {}, {}] };
}
function builtins(f) {
	for (const file of fs.readdirSync(path.join(root, "card")).filter(file => file.endsWith(".js"))) {
		const source = fs
			.readFileSync(path.join(root, "card", file), "utf8")
			.replace(/^import .*?;\s*/gm, "")
			.replace("export const type", "const type")
			.replace("export default", "const pack =");
		const pack = vm.runInNewContext(`${source}; pack`, { lib: f.lib, game: f.game, get: f.get, ui: {}, ai: {}, _status: {} });
		registerCardPack(f.lib, f.game, f.get, pack);
	}
}
function simple(name = "sample") {
	return {
		name,
		card: { sample: { type: "basic", fullskin: true } },
		skill: { _sample: { trigger: {} } },
		translate: { sample_info: "sample" },
		list: [
			["heart", 1, "sample"],
			["heart", 1, "sample"],
		],
	};
}

test("legacy disabled state migrates once, then card menu is authoritative", () => {
	const f = fixture({ extension_sample_cards_enable: false });
	registerCardPack(f.lib, f.game, f.get, simple(), { extension: "sample" });
	assert.equal(f.lib.card.list.length, 0);
	assert.equal(f.lib.skill._sample, undefined);
	setCardPackEnabled(f.lib, f.game, "mode_extension_sample", true);
	assert.equal(isCardPackEnabled(f.lib, "sample"), true);
	const restarted = fixture(copy(f.lib.config));
	registerCardPack(restarted.lib, restarted.game, restarted.get, simple(), { extension: "sample" });
	assert.equal(restarted.lib.card.list.length, 2);
	assert.ok(restarted.lib.skill._sample);
});

test("late extension pile edits normalize elemental attacks without changing saved tuples", () => {
	const f = fixture({ addedpile: { sample: [["heart", 7, "huosha"], ["spade", 9, "leisha"], ["club", 8, "icesha"]] } });
	registerCardPack(f.lib, f.game, f.get, simple(), { extension: "sample" });
	assert.deepEqual(f.lib.card.list.slice(-3), [["heart", 7, "sha", "fire"], ["spade", 9, "sha", "thunder"], ["club", 8, "sha", "ice"]]);
	assert.equal(f.lib.config.addedpile.sample[0][2], "huosha");
});

test("pile edits preserve multiplicity, source immutability and repeated registration", () => {
	const f = fixture({ cards: ["sample"], bannedpile: { sample: [0] }, addedpile: { sample: [["spade", 2, "sample"]] } });
	const pack = simple();
	registerCardPack(f.lib, f.game, f.get, pack);
	registerCardPack(f.lib, f.game, f.get, pack);
	assert.deepEqual(f.lib.card.list, [
		["heart", 1, "sample"],
		["spade", 2, "sample"],
	]);
	assert.equal(f.lib.cardPile.sample.length, 2);
	f.lib.card.list[0][0] = "club";
	assert.equal(pack.list[1][0], "heart");
	registerCardPack(f.lib, f.game, f.get, { name: "sample", list: [["club", 3, "sample"]] });
	assert.deepEqual(f.lib.card.list, [
		["heart", 1, "sample"],
		["club", 3, "sample"],
		["spade", 2, "sample"],
	]);
});

test("mode restrictions and online capability use the same registration policy", () => {
	const f = fixture({ cards: ["sample"] });
	registerCardPack(f.lib, f.game, f.get, { ...simple(), mode: ["guozhan"] });
	assert.equal(f.lib.card.list.length, 0);
	assert.equal(f.lib.skill._sample, undefined);
	const online = fixture({ mode: "connect", connect_cards: ["sample"] });
	registerCardPack(online.lib, online.game, online.get, { ...simple(), connect: true });
	assert.equal(online.lib.card.list.length, 0);
	assert.equal(online.lib.cardPackList.sample.length, 2);
	assert.equal(online.lib.skill._sample, undefined);
	assert.deepEqual(online.lib.connectCardPack, ["sample"]);
	const offline = fixture({ mode: "connect" });
	registerCardPack(offline.lib, offline.game, offline.get, simple(), { extension: "sample" });
	assert.equal(offline.lib.cardPackList?.sample, undefined);
});

test("extension assets and nested skill audio share normalization without mutating the source", () => {
	const f = fixture();
	const pack = simple();
	pack.skill.item = { audio: true, subSkill: { nested: { audio: 2 } } };
	registerCardPack(f.lib, f.game, f.get, pack, { extension: "sample", database: true });
	assert.equal(f.lib.card.sample.image, "db:extension-sample:sample.png");
	assert.equal(f.lib.skill.item.subSkill.nested.audio, "ext:sample:2");
	assert.equal(pack.skill.item.audio, true);
	assert.equal(pack.card.sample.image, undefined);
});

test("all imported data factories build with defaults and every configured option", () => {
	for (const member of members) {
		const f = fixture();
		builtins(f);
		const data = member.create(...f.args);
		const defaults = Object.fromEntries(Object.entries(data.config).map(([key, option]) => [key, option.init]));
		const cases = [defaults];
		for (const [key, option] of Object.entries(data.config)) for (const value of option.item ? Object.keys(option.item) : typeof option.init === "boolean" ? [true, false] : ["0", "2"]) cases.push({ ...defaults, [key]: value });
		for (const options of cases) {
			const builder = createCardPackBuilder(f.lib);
			assert.doesNotThrow(() => data.build(options, builder), `${member.name}: ${JSON.stringify(options)}`);
			assert.equal(f.lib.card.list.length, 0, "building data must not bypass pack switches");
			for (const tuple of builder.list) assert.ok(builder.card[tuple[2]], `${member.name} refers to unknown card ${tuple[2]}`);
		}
	}
});

test("collection defaults do not alter the deck; enabled packs honor saved options", () => {
	const f = fixture();
	builtins(f);
	const extension = createCardCollection("卡牌扩展", members, f.args, manifest.assets);
	extension.content();
	f.lib.arenaReady.forEach(fn => fn());
	assert.equal(f.lib.card.list.length, 0);
	assert.equal(Object.keys(f.lib.cardPackInfo).filter(name => name.startsWith("import_")).length, members.length);
	const member = members.find(item => item.name === "辅助卡牌");
	const restarted = fixture({ cards: [member.id] });
	builtins(restarted);
	const ext = createCardCollection("卡牌扩展", members, restarted.args, manifest.assets);
	ext.content({ [`${member.id}_duji888881`]: "0", [`${member.id}_W_miji`]: "2" });
	assert.equal(restarted.lib.card.list.filter(row => row[2] === "duji888881").length, 0);
	assert.equal(restarted.lib.card.list.filter(row => row[2] === "W_miji").length, 2);
});

test("national-war fixed decks append only the enabled mode pack once", () => {
	const member = members.find(item => item.name === "国战补充②");
	const f = fixture({ mode: "guozhan", cards: [member.id] });
	builtins(f);
	createCardCollection("卡牌扩展", members, f.args).content();
	const count = f.lib.card.list.length;
	assert.ok(count > 0);
	f.lib.card.list = [["spade", 1, "sha"]];
	applyModeCardPacks(f.lib, f.get);
	applyModeCardPacks(f.lib, f.get);
	assert.equal(f.lib.card.list.length, count + 1);
});

test("replacement decks honor pack switches and editing while retaining enabled extensions", () => {
	const f = fixture({ cards: ["mjs", "sample"], bannedpile: { mjs: [0] }, addedpile: { mjs: [["heart", 5, "sha"]] } });
	registerCardPack(f.lib, f.game, f.get, { name: "mjs", list: [["spade", 1, "sha"]] });
	registerCardPack(f.lib, f.game, f.get, simple(), { extension: "sample" });
	const source = [
		["spade", 2, "sha"],
		["club", 3, "shan"],
	];
	assert.equal(replaceCardPackPile(f.lib, f.game, f.get, "mjs", source), true);
	assert.deepEqual(f.lib.card.list, [["club", 3, "shan"], ["heart", 5, "sha"], ...simple().list]);
	assert.deepEqual(source, [
		["spade", 2, "sha"],
		["club", 3, "shan"],
	]);
	setCardPackEnabled(f.lib, f.game, "mjs", false);
	const before = copy(f.lib.card.list);
	assert.equal(replaceCardPackPile(f.lib, f.game, f.get, "mjs", source), false);
	assert.deepEqual(f.lib.card.list, before);
});

test("legacy numeric options have real count controls and validate persisted values", () => {
	const member = members.find(item => item.name === "国战•阵");
	const f = fixture({ cards: [member.id] });
	builtins(f);
	const extension = createCardCollection("卡牌扩展", [member], f.args);
	assert.equal(extension.config[`${member.id}_feilong`].item["0"], "0张");
	extension.content({ [`${member.id}_feilong`]: "-1" });
	assert.equal(f.lib.card.list.length, 0);
	assert.equal(f.lib.config[`extension_卡牌扩展_${member.id}_feilong`], "0");
});

test("selected imported artwork resolves existing assets and respects off", () => {
	for (const asset of manifest.assets) {
		for (const file of asset.files) assert.ok(fs.existsSync(path.join(directory, "assets", asset.id, file)));
		if (!["ice", "art"].includes(asset.kind)) continue;
		const f = fixture();
		createCardCollection("卡牌扩展", [], f.args, manifest.assets).content({ [asset.kind === "ice" ? "iceArt" : "cardArt"]: asset.id });
		if (asset.kind === "ice") assert.match(resolveCardPackImage(f.lib, "sha", "ice"), /bingsha\.webp$/);
		else for (const name of Object.keys(asset.cards)) assert.ok(resolveCardPackImage(f.lib, name));
		createCardCollection("卡牌扩展", [], f.args, manifest.assets).content({ cardArt: "off", iceArt: "off" });
		assert.equal(resolveCardPackImage(f.lib, "sha", "ice"), undefined);
	}
});

test("imported card artwork has a real target whenever a file image is declared", () => {
	const f = fixture();
	builtins(f);
	const missing = [];
	for (const member of members) {
		const data = member.create(...f.args);
		const options = Object.fromEntries(Object.entries(data.config).map(([key, value]) => [key, typeof value.init === "boolean" ? true : value.init]));
		const builder = createCardPackBuilder(f.lib);
		data.build(options, builder);
		for (const [name, info] of Object.entries(builder.card)) {
			let image = info.image;
			if (!image && (info.fullskin || info.fullimage)) image = `ext:卡牌扩展/members/${member.id}/${name}.${info.fullskin ? "png" : "jpg"}`;
			if (typeof image !== "string" || !image.startsWith("ext:卡牌扩展/")) continue;
			const file = path.join(directory, image.slice("ext:卡牌扩展/".length));
			if (!fs.existsSync(file)) missing.push(`${member.name}/${name}: ${image}`);
		}
	}
	assert.deepEqual(missing, []);
});

test('card catalogue rejects lifecycle/skill entries and honors hidden extension cards', () => {
 const f=fixture({all:{cards:[]}});
 const pack={name:'late',card:{token:{fullskin:true,derivation:'test'},real:{type:'basic'},hidden:{type:'basic',hidden:true},precontent(){},helper:{mod:{}},recast:{cardSkill:true}},translate:{token:'衍生牌',real:'测试牌'},list:[]};
 registerCardPack(f.lib,f.game,f.get,pack,{extension:'source'});
 assert.deepEqual(f.lib.cardPack.late,['token','real']);
 assert.ok(f.lib.card.hidden);
 for(const id of ['precontent','helper','recast']) assert.equal(f.lib.card[id],undefined);
 assert.deepEqual(f.lib.config.all.cards,['late']);
 assert.equal(f.lib.cardPackExtension.late,'source');
 registerCardPack(f.lib,f.game,f.get,pack,{extension:'source'});
 assert.deepEqual(f.lib.config.all.cards,['late']);
});

test('legacy character artwork uses the shared portrait resolver without mutating source', () => {
 const f=fixture();const original={type:'character',image:'character/test'};
 registerCardPack(f.lib,f.game,f.get,{name:'portrait',card:{portrait:original},list:[]},{extension:'source'});
 assert.equal(f.lib.card.portrait.image,'character:test');
 assert.equal(f.lib.card.portrait.fullimage,true);
 assert.equal(original.image,'character/test');
});

test('curated presentation survives collection registration and every asset exists', () => {
 const f=fixture();builtins(f);
 for(const id of Object.keys(presentation.import_db0560d2b1)) f.lib.character[id.replace(/_charactercard$/,'')]=['male','wei',4,['testSkill'],[]];
 const collection=createCardCollection('卡牌扩展',members,f.args,[],presentation);
 collection.content({});
 for(const ready of f.lib.arenaReady) ready();
 for(const [pack,cards] of Object.entries(presentation)) for(const [id,override] of Object.entries(cards)) {
  if(override.hidden) { assert.equal(f.lib.cardPack[pack].includes(id),false); continue; }
  assert.equal(f.lib.card[id].image,override.image,pack+'/'+id);
  const file=override.image.replace('ext:卡牌扩展/',directory+'/');
  assert.ok(fs.statSync(file).size>1000,file);
 }
});
