import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../apps/core/extension/絶伦逸羣/extension.js", import.meta.url), "utf8");
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
