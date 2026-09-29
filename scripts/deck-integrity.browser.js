import { lib, game, ui, get, ai, _status } from "noname";
import config from "/game/config.json";
import "/noname/init/polyfill.ts";
import { loadCard, loadCharacter, loadExtension } from "/noname/init/loading.ts";
import { buildOnlineCardPile } from "/noname/init/cardPackRuntime.js";
import { loadDependentCardResources } from "/noname/init/cardResourceProviders.js";
import { CacheContext } from "/noname/library/cache/cacheContext.js";
import formationPack from "../apps/core/extension/collections/分支武将/packs/pack_50.js";
import factionProvider from "../apps/core/extension/collections/清瑶葭绮/members/假装无敌/characters.js";
import factionConsumer from "../apps/core/extension/packs/红楼幻境/extension.js";

const report = { passed: [], failures: [] };
const assert = (ok, message) => { if (!ok) throw Error(message); };
async function test(name, fn) {
 try { await fn(); report.passed.push(name); }
 catch (error) { report.failures.push({ name, error: error.stack }); }
}
function draw(list) {
 lib.card.list = get.copy(list);
 lib.inpile = []; lib.inpile_nature = [];
 ui.cardPile.replaceChildren();
 ui.create.cards();
 assert(ui.cardPile.children.length === lib.card.list.length, "Logical/physical deck sizes differ");
 return Array.from(ui.cardPile.children);
}
const source = "regression-source";
const publicCard = "regression_public";
const generatedCard = "regression_generated";
function resources(connect = true) {
 return {
  character: { connect, character: { regression_general: ["female", "regression_group", 3, []] }, translate: {} },
  card: { connect, card: {
   [publicCard]: { type: "basic", enable: true, content() {} },
   [generatedCard]: { type: "trick", derivation: "regression_general", content() {} },
  }, skill: { _regression_global: { trigger: { global: "phaseBefore" }, forced: true, content() {} } },
  translate: { [publicCard]: "回归牌", [generatedCard]: "生成牌" },
  list: [["heart", 3, publicCard], ["heart", 3, publicCard]] },
 };
}

try {
 _status.connectMode = false;
 lib.configOL = { mode: "identity", bannedcards: [] };
 lib.config = { ...structuredClone(config), mode: "identity", characters: [], cards: ["standard", "extra"],
  background_speak: false, background_audio: false, animation: false, bannedpile: {}, addedpile: {}, bannedcards: [],
  ["extension_" + source + "_cards_enable"]: false };
 lib.assetURL = "/";
 Object.assign(lib, { get, game, ui, ai, connectCharacterPack: [], connectCardPack: [] });
 CacheContext.setProxy({ lib, game, get });
 game.layout = "newlayout";
 game.players = []; game.dead = [];
 ui.css = {}; ui.dialogs = []; ui.controls = [];
 ui.window = ui.create.div("#window", document.body);
 ui.arena = ui.create.div("#arena", ui.window);
 ui.backgroundMusic = document.createElement("audio");
 for (const id of ["cardPile", "discardPile", "ordering", "special", "control", "system"]) ui[id] = ui.create.div("#" + id, ui.window);
 lib.playerOL = {}; lib.cardOL = {}; lib.vcardOL = {};
 for (const id of ["standard", "extra"]) {
  const mod = await import(/* @vite-ignore */ `/card/${id}.js`);
  await game.import("card", mod.default);
  loadCard(lib.imported.card[id]);
 }
 const base = get.copy(lib.card.list);
 await loadExtension([source, () => {}, {}, false, resources(), true]);
 await test("standard extension lifecycle automatically links character and card source ownership", () => {
  assert(lib.characterPackExtension[source] === source, "Missing character source");
  assert(lib.cardPackExtension[source] === source, "Missing card source");
  assert(lib.config.characters.includes(source), "General pack was not enabled");
  assert(!lib.config.cards.includes(source), "Test requires disabled public card switch");
  assert(lib.card[generatedCard]?.content, "Generated card definition unavailable");
 });
 for (const mode of ["identity", "guozhan", "versus", "doudizhu", "single", "boss", "chess", "tafang", "stone", "taixuhuanjing"]) {
  await test(`${mode}: final physical deck retains shared dependencies after mode replacement`, () => {
   lib.config.mode = mode;
   lib.config.bannedcards = [publicCard];
   const physical = draw(base);
   assert(physical.filter(card => card.name === publicCard).length === 2, "Missing or duplicate dependencies");
   assert(!physical.some(card => card.name === generatedCard), "Generated definitions leaked into draw pile");
   assert(lib.skill._regression_global.filter(), "Dependency global skill inactive");
  });
 }
 await test("brawl transforms run before final dependency and extension reconciliation", () => {
  lib.config.mode = "identity";
  _status.brawl = { cardPile: () => [["spade", 1, "sha"]] };
  try {
   const physical = draw(base);
   assert(physical.filter(card => card.name === publicCard).length === 2, "Brawl lost dependency");
  } finally { delete _status.brawl; }
 });
 await test("turning off the general pack restores independent card-disable behavior", () => {
  lib.config.characters = [];
  const physical = draw([...base, ["heart", 3, publicCard]]);
  assert(!physical.some(card => card.name === publicCard), "Disabled source leaked through replacement");
  assert(!lib.skill._regression_global.filter(), "Disabled global skill remains active");
 });
 await test("game.import preserves arbitrary extension provenance for separate character and card imports", async () => {
  _status.extension = "separate-source";
  try {
   await game.import("character", () => ({ name: "separate-generals", connect: true, character: { separate_general: ["male", "wei", 4, []] } }));
   await game.import("card", () => ({ name: "separate-cards", connect: true, card: { separate_card: { type: "basic" } }, translate: { separate_card: "分包牌" }, list: [["club", 7, "separate_card"]] }));
  } finally { delete _status.extension; }
  loadCharacter(lib.imported.character["separate-generals"]);
  loadCard(lib.imported.card["separate-cards"]);
  lib.config.cards.remove("separate-cards");
  const physical = draw(base);
  assert(physical.filter(card => card.name === "separate_card").length === 1, "Separate import dependency missing");
 });
 await test("online room selection wins over local switches and physical deck balances on host", async () => {
  lib.config.mode = "connect";
  const onlineSource = "online-source";
  const pack = resources();
  pack.character.character = { online_general: ["male", "shu", 4, []] };
  pack.card.card = { online_card: { type: "basic" } };
  pack.card.skill = {};
  pack.card.list = [["club", 6, "online_card"]];
  pack.card.translate = { online_card: "联机牌" };
  await loadExtension([onlineSource, () => {}, {}, false, pack, true]);
  await game.import("card", () => ({ name: "network-base", connect: true,
   list: [["spade", 1, "sha"], ["spade", 2, "icesha"], ...Array.from({ length: 40 }, () => ["heart", 1, "tao"])] }));
  loadCard(lib.imported.card["network-base"]);
  lib.config.mode = "identity"; _status.connectMode = true;
  lib.configOL = { mode: "identity", cardPack: ["network-base"], characterPack: [onlineSource], bannedcards: ["online_card"] };
  lib.config.connect_cards = [onlineSource, "network-base"];
  buildOnlineCardPile(lib, get);
  const physical = draw(lib.card.list);
  assert(physical.filter(card => card.name === "online_card").length === 1, "Room lost dependency");
  assert(!physical.some(card => [publicCard, "separate_card"].includes(card.name)), "Client choices leaked into room");
  assert(physical.length > 43, "Host balancing did not run");
  assert(physical.some(card => card.name === "sha" && card.nature === "ice"), "Ice alias normalization failed");
  lib.configOL.characterPack = [];
  buildOnlineCardPile(lib, get);
  assert(!draw(lib.card.list).some(card => card.name === "online_card"), "Previous room dependency leaked");
 });
 await test("real national-war formation cards never prevent physical deck creation in other modes", async () => {
  _status.connectMode = false;
  lib.config.mode = "identity";
  const cards = formationPack(lib, game, ui, get, ai, _status);
  cards.list = [["diamond", 1, "changshezhen"], ["club", 1, "unregistered_optional_card"]];
  await loadExtension(["formation-source", () => {}, {}, false, {
   character: { character: { formation_general: ["male", "wei", 4, []] } }, card: cards,
  }, false]);
  for (const mode of ["identity", "guozhan", "doudizhu", "versus"]) {
   lib.config.mode = mode;
   const physical = draw(base);
   assert(physical.some(card => card.name === "changshezhen") === (mode === "guozhan"), "Incorrect mode eligibility for formation card");
   assert(!physical.some(card => card.name === "unregistered_optional_card"), "Undefined card entered physical pile");
   assert(physical.some(card => card.name === "sha"), "Normal draw pile lost");
  }
 });
 await test("an independent immortal general loads public resources while the entire provider extension is absent", async () => {
  _status.connectMode = false;
  lib.config.mode = "identity";
  lib.config.characters = [];
  await loadDependentCardResources([lib, game, ui, get, ai, _status]);
  assert(!lib.card.ymhuanhundan, "Resources loaded without any dependent faction");
  const consumer = factionConsumer(lib, game, ui, get, ai, _status);
  await consumer.precontent();
  await loadExtension(["foreign_generals", consumer.content, {}, false, consumer.package, true]);
  lib.config.characters = ["foreign_generals"];
  const before = JSON.stringify(lib.config.cards);
  await Promise.all([1, 2].map(() => loadDependentCardResources([lib, game, ui, get, ai, _status])));
  const names = new Set(lib.cardPile.shared_immortal_cards.map(row => row[2]));
  const physical = draw(base);
  assert(physical.filter(card => names.has(card.name)).length === 8, "Standalone general has no shared physical fairy cards");
  assert([...names].every(name => lib.card[name].qingyaoXian), "Fairy classification missing");
  assert([...names].every(name => (lib.card[name].skills || []).every(skill => typeof lib.skill[skill]?.content === "function" || lib.skill[skill]?.mod)), "Public equipment rules did not load with the cards");
  assert(!lib.characterPack.假装无敌Pack, "Resource loading unexpectedly enabled provider generals");
  assert(JSON.stringify(lib.config.cards) === before, "Resource loading changed card switches");
 });
 await test("loading the original provider after shared resources never duplicates the faction pile", async () => {
  _status.connectMode = false;
  lib.config.mode = "identity";
  lib.config.extension_shared_provider_cards_enable = false;
  const provider = factionProvider(lib, game, ui, get, ai, _status);
  const consumer = factionConsumer(lib, game, ui, get, ai, _status);
  await provider.precontent();
  try {
   _status.loadingExtensionRuntime = "shared_provider";
   await loadExtension(["shared_provider", provider.content, {}, false, provider.package, false]);
   _status.loadingExtensionRuntime = "foreign_generals";
   await loadExtension(["foreign_generals", consumer.content, {}, false, consumer.package, true]);
  } finally { delete _status.loadingExtensionRuntime; }
  lib.config.characters = ["foreign_generals"];
  const names = new Set(provider.package.card.list.map(row => row[2]));
  lib.config.bannedcards = [...names];
  const physical = draw(base);
  assert(physical.filter(card => names.has(card.name)).length === provider.package.card.list.length, "Cross-source faction cards missing: " + JSON.stringify({
   expected: provider.package.card.list, actual: physical.filter(card => names.has(card.name)).map(card => card.name),
   groups: Object.values(lib.characterPack.foreign_generals || {}).map(info => info.group || info[1]),
   metadata: Object.fromEntries([...names].map(name => [name, lib.card[name]?.requiredGroups])),
  }));
  lib.config.characters = [];
  assert(!draw(base).some(card => names.has(card.name)), "Inactive faction cards leaked into next deck");
 });
 await test("crossbow AI equips before attacks and retains the weapon while multiple attacks remain", () => {
  lib.config.mode = "identity";
  const oldAttitude = get.rawAttitude;
  const oldEvent = _status.event;
  const oldPhase = _status.currentPhase;
  const oldMe = game.me;
  game.finishCard("sha"); game.finishCard("zhuge"); game.finishCard("qinggang");
  game.finishSkill("zhuge_skill");
  game.players = Array.from({ length: 2 }, () => ui.create.player(ui.arena));
  const [player, enemy] = game.players;
  for (const [i, current] of game.players.entries()) {
   current.playerid = "crossbow-test-" + i;
   current.hp = current.maxHp = 4;
   current.next = current.previous = current.nextSeat = current.previousSeat = game.players[1 - i];
   current.dataset.position = String(i);
   current.identity = i ? "fan" : "zhu";
  }
  game.me = player;
  _status.event = Object.assign(new lib.element.GameEvent("chooseToUse", false), { player, type: "phase" });
  _status.currentPhase = player;
  get.rawAttitude = (from, to) => from === to ? 5 : -5;
  const hand = name => { const card = ui.create.card().init(["spade", 7, name]); player.node.handcards1.append(card); return card; };
  try {
   hand("sha"); hand("sha"); hand("sha");
   const crossbow = hand("zhuge");
   assert(get.order(crossbow, player) > get.order({ name: "sha" }, player), "AI shoots before equipping a useful crossbow");
   player.directequip(crossbow);
   const alternative = hand("qinggang");
   assert(get.value(crossbow, player) > get.value(player.getCards("h", "sha")[0], player), "AI discards crossbow before surplus attacks");
   assert(get.equipResult(player, player, alternative) === 0, "AI replaces crossbow before completing multi-attack");
   player.getCards("h", "sha")[0].remove();
   player.group = "qingyao_xian";
   player.hp = 1;
   game.finishCard("ymyaoguangjian");
   const fairyWeapon = hand("ymyaoguangjian");
   assert(player.needsToDiscard(), "Replacement regression requires excess cards");
   assert(get.equipResult(player, player, fairyWeapon) === 0, "AI replaces useful crossbow with a higher-base-value weapon while two attacks remain");
   hand("sha");
   player.getStat().card.sha = 1;
   const valueWithThree = get.equipValue(crossbow, player);
   player.getCards("h", "sha")[0].remove();
   assert(valueWithThree > get.equipValue(crossbow, player), "Retention value ignores remaining attacks after the first use");
   get.rawAttitude = () => 5;
   assert(get.equipValue(crossbow, player) < valueWithThree, "AI retains crossbow for attacks that only help enemies");
  } finally {
   for (const current of game.players) current.remove();
   game.players = []; game.me = oldMe;
   get.rawAttitude = oldAttitude;
   _status.event = oldEvent; _status.currentPhase = oldPhase;
  }
 });
} catch (error) { report.fatal = error.stack; }
window.__deckReport = report;

