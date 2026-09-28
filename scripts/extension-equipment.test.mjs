import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../apps/core/extension/packs/絶伦逸羣/extension.js", import.meta.url), "utf8");
const factory = vm.runInNewContext(source.replace(/^import .*?;\s*/, "").replace("export const type", "const type").replace("export default function", "const createExtension = function") + ";createExtension;");
const skills = factory({}, {}, {}, {}, {}, {}).package.skill.skill;
const playerSource = readFileSync(new URL("../apps/core/noname/library/element/player.js", import.meta.url), "utf8");
function player(disabledSlots, expandedSlots, combined = false) {
  const result = { storage: {}, disabledSlots, expandedSlots };
  for (const name of ["countDisabledSlot", "countEnabledSlot"]) {
    const code = new RegExp(`\\t${name}\\(type\\) \\{[\\s\\S]*?\\n\\t\\}`).exec(playerSource)[0];
    result[name] = vm.runInNewContext(`({${code}})`, { get: { is: { mountCombined: () => combined } } })[name];
  }
  return result;
}
test("奋命 uses current engine slots, including fresh players with no legacy storage", () => {
  const mod = skills.jvelun_dongxi_fenming.mod;
  const from = player();
  assert.equal(mod.globalFrom(from, player(), 3), 3);
  assert.equal(mod.maxHandcard(from, 4), 4);
  from.disabledSlots = { equip1: 1, equip2: 2 };
  assert.equal(mod.globalFrom(from, player(), 4), 1);
  assert.equal(mod.maxHandcard(from, 4), 7);
  assert.equal(mod.globalTo, undefined, "skill only changes owner's outgoing distance");
});
test("断缆 checks remaining slots, supports expanded/combined mounts and turn limit", () => {
  const filter = skills.jvelun_dongxi_duanlan.filter;
  assert.equal(filter({}, player()), true);
  const full = { equip1: 1, equip2: 1, equip3: 1, equip4: 1, equip5: 1 };
  assert.equal(filter({}, player(full)), false);
  assert.equal(filter({}, player(full, { equip1: 1 })), true);
  assert.equal(filter({}, player(full, undefined, true)), false);
  const used = player(); used.storage.jvelun_dongxi_duanlanUse = 0;
  assert.equal(filter({}, used), false);
});

function muniuPack(game, ui = {}) {
  const source = readFileSync(new URL("../apps/core/extension/packs/极略/card/jlsg_qs.js", import.meta.url), "utf8");
  const context = vm.createContext({ lib: {}, game, ui, get: {}, ai: {}, _status: {}, console: { log() {} } });
  vm.runInContext("Array.prototype.addArray = function (cards) { for (const card of cards) if (!this.includes(card)) this.push(card); return this; };", context);
  return vm.runInContext(source.replace(/^import .*?;\s*/, "").replace("export default jlsg_qs;", "jlsg_qs;"), context);
}

test("木牛流马 gives the selected drawn card to the selected recipient", async () => {
  const pack = muniuPack({});
  const cards = [{ name: "sha" }], target = {}, vcard = { name: "jlsgqs_muniu" };
  const calls = [];
  const player = {
    addTempSkill: name => calls.push(["temp", name]),
    markAuto: (name, values) => calls.push(["mark", name, values[0]]),
    async give(given, recipient) {
      assert.equal(given, cards);
      assert.equal(recipient, target);
      calls.push(["give"]);
    },
  };
  await pack.skill.jlsgqs_muniu_skill.content({ name: "jlsgqs_muniu_skill", cards, targets: [target], cost_data: { vcard } }, {}, player);
  assert.deepEqual(calls, [["temp", "jlsgqs_muniu_skill_use"], ["mark", "jlsgqs_muniu_skill_use", vcard], ["give"]]);
  assert.equal(vcard.storage, undefined, "giving cards does not store them under the equipment");
});

test("木牛流马 still stores cards at the deck bottom when the owner selects themself", async () => {
  const cardPile = {}, cards = [{ name: "shan" }], vcard = { name: "jlsgqs_muniu" };
  let lost, delayed = false;
  const pack = muniuPack({
    log() {},
    broadcastAll: (callback, ...args) => callback(...args),
    async delayx() { delayed = true; },
  }, { cardPile });
  const player = {
    addTempSkill() {}, markAuto() {}, markSkill() {},
    async lose(data) { lost = data; },
  };
  await pack.skill.jlsgqs_muniu_skill.content({ name: "jlsgqs_muniu_skill", cards, targets: [player], cost_data: { vcard } }, {}, player);
  assert.equal(lost.source, player);
  assert.equal(lost.cards, cards);
  assert.equal(lost.position, cardPile);
  assert.deepEqual(Array.from(vcard.storage.jlsgqs_muniu), cards);
  assert.equal(delayed, true);
});
