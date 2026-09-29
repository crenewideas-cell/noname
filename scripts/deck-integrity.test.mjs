import test from "node:test";
import assert from "node:assert/strict";
import { registerCardPack, applyModeCardPacks, applyRequiredCardPacks, buildOnlineCardPile, filterCardPile, isCardPackEnabled, setCardPackEnabled } from "../apps/core/noname/init/cardPackRuntime.js";
import { supplementCardPile } from "../apps/core/noname/init/cardpileSupplement.js";
import { initializeCharacterPack } from "../apps/core/noname/init/characterPackRuntime.js";
import { createMergedExtension } from "../apps/core/extension/_merge.js";
import formationPack from "../apps/core/extension/collections/分支武将/packs/pack_50.js";
import { loadDependentCardResources } from "../apps/core/noname/init/cardResourceProviders.js";

function copy(value) {
 if (Array.isArray(value)) return value.map(copy);
 if (!value || typeof value !== "object") return value;
 return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, copy(child)]));
}
function fixture(mode = "identity") {
 const lib = { config: { mode, cards: [], characters: [], connect_cards: [], bannedpile: {}, addedpile: {}, plays: ["cardpile"] },
  card: { list: [], sha: {}, shan: {}, tao: {} }, skill: {}, translate: {}, cardPack: {}, cardPackInfo: {}, cardPile: {}, character: {}, characterPack: {} };
 return { lib, get: { copy }, game: { saveConfig: (key, value) => lib.config[key] = value } };
}
function register(f, pack, options) { registerCardPack(f.lib, f.game, f.get, pack, options); }
function characters(f, source = "source", count = 1) {
 const pack = "generals_" + source;
 initializeCharacterPack(f.lib, f.game, pack, source);
 f.lib.characterPack[pack] = {};
 for (let i = 0; i < count; i++) {
  const id = source + "_" + i;
  f.lib.character[id] = ["female", "arbitrary_faction", 3, []];
  f.lib.characterPack[pack][id] = f.lib.character[id];
 }
 return pack;
}
const addon = (name = "addon") => ({ name, connect: true, card: { [name]: { type: "basic" } },
 skill: { ["_" + name]: { trigger: {}, filter: () => true, mod: { maxHandcard: (_player, num) => num + 1 } } },
 list: [["heart", 3, name], ["heart", 3, name]] });
function finalize(f, connect = false, players = []) {
 const required = applyRequiredCardPacks(f.lib, f.get, connect, players);
 filterCardPile(f.lib, { connect, required });
 return required;
}

test("faction resource declarations load on demand once without enabling other extensions", async () => {
 const f = fixture();
 let imports = 0;
 const resource = { name: "arbitrary_resources", groups: ["arbitrary_faction"], connect: true, load: async () => {
  imports++;
  return { default: () => ({ ...addon("shared"), card: { shared: { type: "basic", requiredGroups: ["arbitrary_faction"] } } }) };
 } };
 const args = [f.lib, f.game, {}, f.get, {}, {}];
 await loadDependentCardResources(args, [resource]);
 assert.equal(imports, 0);
 characters(f, "independent", 10000);
 const switches = copy(f.lib.config);
 await Promise.all([1, 2].map(() => loadDependentCardResources(args, [resource])));
 assert.equal(imports, 1);
 assert.deepEqual(f.lib.config, switches);
 finalize(f); finalize(f);
 assert.equal(f.lib.card.list.length, 2);
 register(f, { ...addon("full_provider"), card: { shared: { type: "basic", requiredGroups: ["arbitrary_faction"] } }, list: [["heart", 3, "shared"], ["heart", 3, "shared"]] });
 f.lib.card.list = [];
 finalize(f);
 assert.equal(f.lib.card.list.length, 2);
 assert.equal(f.lib.skill._shared.filter(), true, "The first provider's global rules remain active after resource deduplication");
 f.lib.config.characters = [];
 finalize(f);
 assert.equal(f.lib.card.list.length, 0);
 assert.equal(f.lib.skill._shared.filter(), false);
});

test("resource loading respects online compatibility and retries failed imports", async () => {
 const f = fixture("connect");
 const pack = characters(f);
 f.lib.configOL = { mode: "identity", characterPack: [pack], cardPack: [] };
 let imports = 0;
 const source = { name: "online_resources", groups: ["arbitrary_faction"], connect: false, load: async () => {
  if (++imports === 1) throw new Error("temporary import failure");
  return { default: () => ({ ...addon("shared"), card: { shared: { type: "basic", requiredGroups: ["arbitrary_faction"] } } }) };
 } };
 const args = [f.lib, f.game, {}, f.get, {}, { connectMode: true }];
 await loadDependentCardResources(args, [source]);
 assert.equal(imports, 0);
 source.connect = true;
 await assert.rejects(loadDependentCardResources(args, [source]), /temporary import failure/);
 await loadDependentCardResources(args, [source]);
 buildOnlineCardPile(f.lib, f.get);
 finalize(f, true);
 assert.equal(f.lib.card.list.length, 2);
});

test("legacy aliases normalize both offline selections and online exclusions", () => {
 const f = fixture("connect");
 f.lib.config.connect_cards = ["mode_extension_addon", "addon"];
 assert.equal(isCardPackEnabled(f.lib, "addon"), false);
 register(f, addon());
 assert.deepEqual(f.lib.config.connect_cards, ["addon"]);
 setCardPackEnabled(f.lib, f.game, "mode_extension_addon", true, true);
 assert.deepEqual(f.lib.config.connect_cards, []);
});

for (const mode of ["identity", "guozhan", "versus", "doudizhu", "single", "boss", "chess", "tafang", "stone", "brawl", "taixuhuanjing"]) {
 test(`${mode}: finalizing a replaced pile restores an enabled extension exactly once`, () => {
  const f = fixture(mode);
  register(f, addon(), { extension: "source" });
  f.lib.card.list = [["spade", 1, "sha"], ["heart", 3, "addon"]];
  finalize(f); finalize(f);
  assert.equal(f.lib.card.list.filter(row => row[2] === "addon").length, 2);
 });
 test(`${mode}: source dependency survives independent pack switches, edits and bans`, () => {
  const f = fixture(mode);
  characters(f);
  f.lib.config.extension_source_cards_enable = false;
  f.lib.config.bannedpile.addon = [0, 1];
  f.lib.config.bannedcards = ["addon"];
  const pack = addon();
  register(f, pack, { extension: "source" });
  assert.equal(f.lib.card.list.length, 0);
  finalize(f); finalize(f);
  assert.equal(f.lib.card.list.length, 2);
  assert.equal(f.lib.skill._addon.filter(), true);
  assert.equal(f.lib.skill._addon.mod.maxHandcard({}, 4), 5);
  assert.ok(pack.list.every(row => !row._replaced), "source data stays immutable");
  f.lib.config.characters = [];
  finalize(f);
  assert.equal(f.lib.card.list.length, 0);
  assert.equal(f.lib.skill._addon.filter(), false);
  assert.equal(f.lib.skill._addon.mod.maxHandcard({}, 4), undefined);
 });
}

test("ten thousand generals share one original pack, with no per-general piles or multiplication", () => {
 const f = fixture();
 characters(f, "large_source", 10000);
 f.lib.config.extension_large_source_cards_enable = false;
 register(f, addon(), { extension: "large_source" });
 finalize(f);
 assert.equal(f.lib.card.list.length, 2);
 assert.deepEqual(Object.keys(f.lib.cardPile), ["addon"]);
});

test("source coupling does not pull in disabled siblings that happen to contain the same basic card", () => {
 const f = fixture();
 characters(f);
 f.lib.config.extension_source_cards_enable = false;
 f.lib.config.extension_unrelated_cards_enable = false;
 register(f, { ...addon(), list: [["heart", 1, "sha"]] }, { extension: "source" });
 register(f, { ...addon("unrelated"), list: Array.from({ length: 30 }, () => ["heart", 1, "sha"]) }, { extension: "unrelated" });
 finalize(f); finalize(f);
 assert.equal(f.lib.card.list.length, 1);
});

test("disabled standalone extensions cannot reinsert their cards by overwriting the final list", () => {
 const f = fixture();
 f.lib.config.extension_source_cards_enable = false;
 register(f, addon(), { extension: "source" });
 f.lib.card.list = [["heart", 3, "addon"], ["heart", 1, "sha"]];
 finalize(f);
 assert.deepEqual(f.lib.card.list, [["heart", 1, "sha"]]);
});

test("same-name cards remain valid when another owning pack is enabled", () => {
 const f = fixture();
 f.lib.config.extension_disabled_cards_enable = false;
 register(f, addon(), { extension: "disabled" });
 register(f, { ...addon(), name: "enabled" }, { extension: "enabled" });
 finalize(f);
 assert.equal(f.lib.card.list.length, 2);
});

test("generated card definitions and ordinary skills already work without a public pile", () => {
 const f = fixture();
 f.lib.config.extension_source_cards_enable = false;
 const content = () => {};
 register(f, { name: "resources", card: { generated: { derivation: "general", content } }, skill: { resource: { content } }, list: [] }, { extension: "source" });
 assert.equal(f.lib.card.generated.content, content);
 assert.equal(f.lib.skill.resource.content, content);
 finalize(f);
 assert.equal(f.lib.card.list.length, 0);
});

test("faction dependencies cross source boundaries without enabling unrelated cards or making per-general piles", () => {
 const f = fixture();
 characters(f, "other_source", 10000);
 f.lib.config.extension_provider_cards_enable = false;
 const pack = addon();
 pack.card.addon.requiredGroups = ["arbitrary_faction"];
 pack.card.unrelated = { type: "basic" };
 pack.list.push(["club", 2, "unrelated"]);
 register(f, pack, { extension: "provider" });
 f.lib.config.bannedcards = ["addon"];
 f.lib.card.list = [["club", 2, "unrelated"]];
 finalize(f); finalize(f);
 assert.deepEqual(f.lib.card.list.map(row => row[2]), ["addon", "addon"]);
 assert.equal(f.lib.skill._addon.filter(), true);
 assert.deepEqual(Object.keys(f.lib.cardPile), ["addon"]);
 f.lib.config.characters = [];
 finalize(f);
 assert.equal(f.lib.card.list.length, 0);
 assert.equal(f.lib.skill._addon.filter(), false);
});

test("faction selection uses room character packs and current player groups, not client preferences", () => {
 const f = fixture("connect");
 const generals = characters(f, "other_source");
 const pack = addon();
 pack.card.addon.requiredGroups = ["arbitrary_faction"];
 register(f, pack, { extension: "provider" });
 f.lib.configOL = { mode: "identity", cardPack: [], characterPack: [] };
 finalize(f, true);
 assert.equal(f.lib.card.list.length, 0);
 f.lib.configOL.characterPack = [generals];
 finalize(f, true);
 assert.equal(f.lib.card.list.length, 2);
 f.lib.configOL.characterPack = [];
 buildOnlineCardPile(f.lib, f.get);
 finalize(f, true, [{ group: "arbitrary_faction" }]);
 assert.equal(f.lib.card.list.length, 2);
 buildOnlineCardPile(f.lib, f.get);
 finalize(f, true);
 assert.equal(f.lib.card.list.length, 0);
});

test("faction metadata survives an earlier card definition and later pack fragments", () => {
 const f = fixture();
 characters(f, "other_source");
 f.lib.config.extension_provider_cards_enable = false;
 f.lib.card.addon = { type: "basic" };
 const pack = addon();
 pack.card.addon.requiredGroups = ["arbitrary_faction"];
 register(f, pack, { extension: "provider" });
 register(f, { name: "addon", card: {}, list: [] }, { extension: "provider" });
 finalize(f);
 assert.equal(f.lib.card.list.length, 2);
});

test("global subskills obey the same switch as the parent skill", () => {
 const f = fixture();
 f.lib.config.extension_source_cards_enable = false;
 const pack = addon();
 pack.skill._addon.subSkill = { child: { trigger: {}, filter: () => true, mod: { maxHandcard: (_player, num) => num + 2 } } };
 register(f, pack, { extension: "source" });
 assert.equal(f.lib.skill._addon.subSkill.child.filter(), false);
 assert.equal(f.lib.skill._addon.subSkill.child.mod.maxHandcard({}, 4), undefined);
 characters(f);
 finalize(f);
 assert.equal(f.lib.skill._addon.subSkill.child.filter(), true);
 assert.equal(f.lib.skill._addon.subSkill.child.mod.maxHandcard({}, 4), 6);
});

test("live generals retain their source dependency even outside the configured selection", () => {
 const f = fixture();
 characters(f);
 f.lib.config.characters = [];
 f.lib.config.extension_source_cards_enable = false;
 register(f, addon(), { extension: "source" });
 finalize(f, false, [{ name: "source_0" }]);
 assert.equal(f.lib.card.list.length, 2);
 assert.equal(f.lib.skill._addon.filter(), true);
 finalize(f);
 assert.equal(f.lib.skill._addon.filter(), false);
});

test("different enabled packs retain their combined identical copies after replacement", () => {
 const f = fixture();
 register(f, addon(), { extension: "a" });
 register(f, { ...addon(), name: "second" }, { extension: "b" });
 f.lib.card.list = [];
 finalize(f); finalize(f);
 assert.equal(f.lib.card.list.length, 4);
});

test("online selection is authoritative over client preferences and resets on room changes", () => {
 const f = fixture("connect");
 const generals = characters(f);
 register(f, addon(), { extension: "source" });
 f.lib.config.connect_cards = ["addon"];
 f.lib.configOL = { mode: "identity", cardPack: [], characterPack: [generals], bannedcards: ["addon"] };
 buildOnlineCardPile(f.lib, f.get);
 finalize(f, true); finalize(f, true);
 assert.equal(f.lib.card.list.length, 2);
 assert.equal(f.lib.skill._addon.filter(), true);
 f.lib.configOL.characterPack = [];
 buildOnlineCardPile(f.lib, f.get);
 finalize(f, true);
 assert.equal(f.lib.card.list.length, 0);
 assert.equal(f.lib.skill._addon.filter(), false);
 f.lib.configOL.cardPack = ["addon"];
 f.lib.configOL.bannedcards = [];
 buildOnlineCardPile(f.lib, f.get);
 finalize(f, true);
 assert.equal(f.lib.card.list.length, 2);
});

test("incompatible same-source packs are excluded without blocking unrelated generals", () => {
 for (const online of [false, true]) {
  const f = fixture(online ? "connect" : "identity");
  const generals = characters(f);
  register(f, { ...addon(), ...(online ? { connect: false } : { mode: ["guozhan"] }) }, { extension: "source" });
  if (online) f.lib.configOL = { mode: "identity", cardPack: [], characterPack: [generals] };
  f.lib.card.list = [["heart", 1, "sha"]];
  assert.doesNotThrow(() => finalize(f, online));
  assert.deepEqual(f.lib.card.list, [["heart", 1, "sha"]]);
 }
});

test("real formation cards do not crash identity and remain available in national war", () => {
 for (const mode of ["identity", "guozhan"]) {
  const f = fixture(mode);
  characters(f, "collection");
  const pack = formationPack(f.lib, f.game, {}, f.get, {}, {});
  assert.deepEqual(pack.card.changshezhen.mode, ["guozhan"]);
  register(f, { ...pack, name: "formation", list: [["diamond", 1, "changshezhen"]] }, { extension: "collection" });
  f.lib.card.list = [["heart", 1, "sha"]];
  assert.doesNotThrow(() => finalize(f));
  assert.equal(f.lib.card.list.some(row => row[2] === "changshezhen"), mode === "guozhan");
  assert.ok(f.lib.card.list.some(row => row[2] === "sha"));
 }
});

test("mixed same-source lists keep valid dependencies and omit mode-limited or missing definitions", () => {
 const f = fixture();
 characters(f);
 f.lib.config.extension_source_cards_enable = false;
 const pack = addon();
 pack.card.mode_limited = { type: "basic", mode: ["guozhan"] };
 pack.list.push(["club", 1, "mode_limited"], ["spade", 1, "missing_definition"]);
 register(f, pack, { extension: "source" });
 f.lib.config.bannedcards = ["addon"];
 assert.doesNotThrow(() => finalize(f));
 assert.deepEqual(f.lib.card.list.map(row => row[2]), ["addon", "addon"]);
});

test("online mode restrictions follow the room and all elemental aliases normalize", () => {
 const f = fixture("connect");
 const source = ["huosha", "leisha", "icesha", "cisha", "kamisha"].map(id => ["heart", 1, id]);
 register(f, { ...addon(), mode: ["guozhan"], list: source }, { extension: "source" });
 f.lib.configOL = { mode: "identity", cardPack: ["addon"], characterPack: [] };
 buildOnlineCardPile(f.lib, f.get);
 assert.equal(f.lib.card.list.length, 0);
 assert.equal(f.lib.skill._addon.filter(), false);
 f.lib.configOL.mode = "guozhan";
 f.lib.config.mode = "guozhan";
 buildOnlineCardPile(f.lib, f.get);
 finalize(f, true);
 assert.deepEqual(f.lib.card.list.map(row => row[3]), ["fire", "thunder", "ice", "stab", "kami"]);
 assert.equal(source[0][2], "huosha");
 assert.equal(f.lib.skill._addon.filter(), true);
});

test("filtering precedes balancing; repeated finalization remains stable", () => {
 const f = fixture();
 f.lib.card.forbidden = { forbid: ["identity"] };
 f.lib.config.bannedcards = ["shan"];
 f.lib.card.list = [["heart", 1, "sha"], ["heart", 1, "shan"], ["heart", 1, "forbidden"], ["heart", 1, "unknown"], ...Array.from({ length: 100 }, () => ["heart", 1, "tao"])];
 finalize(f);
 assert.ok(supplementCardPile(f.lib) > 0);
 assert.ok(f.lib.card.list.every(row => ["sha", "tao"].includes(row[2]) && !row[3]));
 const length = f.lib.card.list.length;
 finalize(f); supplementCardPile(f.lib);
 assert.equal(f.lib.card.list.length, length);
});

test("balancing runs on the online host and honors explicit disable and room bans", () => {
 const f = fixture();
 f.lib.configOL = { mode: "identity", bannedcards: ["shan"] };
 f.lib.card.list = [["spade", 1, "sha"], ...Array.from({ length: 100 }, () => ["heart", 1, "tao"])];
 assert.ok(supplementCardPile(f.lib, () => 0, { connect: true }) > 0);
 assert.ok(!f.lib.card.list.some(row => row[2] === "shan"));
 f.lib.config.plays = [];
 assert.equal(supplementCardPile(f.lib, () => 0, { connect: true }), 0);
 assert.equal(f.lib.card.list.length, 101);
});

test("merged packages preserve identical copies within and across members", async () => {
 const f = fixture();
 const extension = await createMergedExtension("combined", ["a", "b"], [f.lib, f.game], import.meta.url,
  async () => ({ default: () => ({ package: { card: addon() } }) }));
 await extension.content({}, extension.package);
 assert.equal(extension.package.card.list.length, 4);
});

