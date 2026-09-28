import test from "node:test";
import assert from "node:assert/strict";
import { initializeCharacterPack, rememberCharacterPackChoices } from "../apps/core/noname/init/characterPackRuntime.js";
import { supplementCardPile, supplementWeights } from "../apps/core/noname/init/cardpileSupplement.js";
import { matchesEnabledFilter } from "../apps/core/noname/ui/create/menu/menuSearch.js";

function characters(config = {}) {
	const lib = { config: { characters: [], ...config } };
	return { lib, game: { saveConfig: (key, value) => { lib.config[key] = value; } } };
}
test("new subpacks default on; disabling survives repeat registration and legacy self-enabling", () => {
	const { lib, game } = characters();
	initializeCharacterPack(lib, game, "zerongPack", "笮融");
	assert.deepEqual(lib.config.characters, ["zerongPack"]);
	assert.equal(lib.characterPackExtension.zerongPack, "笮融");
	rememberCharacterPackChoices(lib, game, ["zerongPack"], false);
	initializeCharacterPack(lib, game, "zerongPack", "笮融");
	assert.deepEqual(lib.config.characters, []);
	lib.config.characters.push("zerongPack");
	initializeCharacterPack(lib, game, "zerongPack", "笮融");
	assert.deepEqual(lib.config.characters, []);
	initializeCharacterPack(lib, game, "secondPack", "笮融");
	assert.deepEqual(lib.config.characters, ["secondPack"]);
});
test("legacy off and initialized off remain off; builtins are never enabled by extension defaults", () => {
	const { lib, game } = characters({ extension_example_characters_enable: false });
	initializeCharacterPack(lib, game, "sample", "example");
	initializeCharacterPack(lib, game, "standard", undefined);
	assert.deepEqual(lib.config.characters, []);
	lib.config.extension_example_characters_enable = true;
	initializeCharacterPack(lib, game, "sample", "example");
	assert.deepEqual(lib.config.characters, []);
});
test("bulk character choices and restoring defaults remain independent of parent switches", () => {
	const { lib, game } = characters({ extension_example_enable: false });
	rememberCharacterPackChoices(lib, game, ["one", "two"], true);
	for (const name of ["one", "two"]) initializeCharacterPack(lib, game, name, "example");
	assert.deepEqual(lib.config.characters, ["one", "two"]);
	rememberCharacterPackChoices(lib, game, ["one", "two"], name => name === "one");
	for (const name of ["one", "two"]) initializeCharacterPack(lib, game, name, "example");
	assert.deepEqual(lib.config.characters, ["one"]);
	assert.equal(lib.config.extension_example_enable, false);
});
test("enabled filters exclude tools and accept only the requested boolean state", () => {
	assert.equal(matchesEnabledFilter(undefined, "all"), true);
	assert.equal(matchesEnabledFilter(undefined, "disabled"), false);
	assert.equal(matchesEnabledFilter(false, "disabled"), true);
	assert.equal(matchesEnabledFilter(true, "enabled"), true);
	assert.equal(matchesEnabledFilter(false, "enabled"), false);
});
function deck(extra = 0, config = {}) {
	const list = [];
	const card = {};
	for (const [id, suits] of Object.entries(supplementWeights)) {
		const name = id === "huosha" || id === "leisha" ? "sha" : id;
		card[name] = {};
		for (const [suit, count] of Object.entries(suits)) for (let i = 0; i < count; i++) {
			const tuple = [suit, i % 13 + 1, name];
			if (id === "huosha") tuple.push("fire");
			if (id === "leisha") tuple.push("thunder");
			list.push(tuple);
		}
	}
	while (list.length < 160 + extra) list.push(["spade", 1, "extra"]);
	card.extra = {};
	card.list = list;
	return { card, config: { mode: "identity", plays: ["cardpile"], ...config } };
}
test("normal military deck is unchanged; diluted deck reaches configured proportions", () => {
	const lib = deck();
	assert.equal(supplementCardPile(lib), 0);
	const expanded = deck(160);
	const initial = expanded.card.list.slice();
	const count = supplementCardPile(expanded, () => 0);
	assert.ok(count > 0 && count <= 1000);
	assert.deepEqual(expanded.card.list.slice(0, initial.length), initial);
	const length = expanded.card.list.length;
	for (const [name, nature, weight] of [["sha", undefined, 30], ["sha", "fire", 5], ["sha", "thunder", 9], ["shan", undefined, 24]]) {
		const n = expanded.card.list.filter(card => card[2] === name && card[3] === nature).length;
		assert.ok(Math.abs(n - length * weight / 160) <= 1);
	}
	assert.equal(supplementCardPile(expanded, () => 0), count);
	assert.equal(expanded.card.list.length, length);
	for (const card of expanded.card.list) assert.ok(card[1] >= 1 && card[1] <= 13);
});
test("disabled, online, empty, all-zero and unknown card definitions never supplement", () => {
	for (const config of [{ plays: [] }, { mode: "connect" }, { hiddenPlayPack: ["cardpile"] }, Object.fromEntries(Object.keys(supplementWeights).map(id => [`cardpile_${id}_playpackconfig`, "0"]))]) assert.equal(supplementCardPile(deck(100, config)), 0);
	assert.equal(supplementCardPile({ config: { plays: ["cardpile"] }, card: { list: [] } }), 0);
	assert.equal(supplementCardPile({ config: { plays: ["cardpile"] }, card: { list: [["heart", 1, "unknown"]] } }), 0);
});
test("all/half/off, excess copies and malformed values remain finite and respect the cap", () => {
	const base = Object.fromEntries(Object.keys(supplementWeights).map(id => [`cardpile_${id}_playpackconfig`, "0"]));
	const all = deck(1000, { ...base, cardpile_sha_playpackconfig: "1" });
	const half = deck(1000, { ...base, cardpile_sha_playpackconfig: "0.5" });
	assert.ok(supplementCardPile(all) > supplementCardPile(half));
	const excess = deck(50, base);
	excess.config.cardpile_sha_playpackconfig = "1";
	for (let i = 0; i < 100; i++) excess.card.list.push(["heart", 1, "sha"]);
	assert.equal(supplementCardPile(excess), 0);
	const huge = deck(10000, Object.fromEntries(Object.keys(supplementWeights).map(id => [`cardpile_${id}_playpackconfig`, "1"])));
	assert.equal(supplementCardPile(huge), 1000);
	for (const value of ["garbage", Infinity, -1, 500]) assert.ok(supplementCardPile(deck(100, { cardpile_sha_playpackconfig: value })) <= 1000);
});
