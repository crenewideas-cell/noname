import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import tale from "../apps/core/extension/collections/卡牌扩展/members/import_c8b8f5fc7d/data.js";
import surpass from "../apps/core/extension/collections/卡牌扩展/members/import_fa474d9dca/data.js";

const read = path => readFileSync(new URL(`../apps/core/${path}`, import.meta.url), "utf8");
function extract(path, name, globals = {}, pick) {
    const source = read(path), ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
    let found;
    function visit(node) {
        if (found) return;
        if ((ts.isMethodDeclaration(node) || ts.isPropertyAssignment(node)) && node.name.getText(ast) === name) found = node;
        else ts.forEachChild(node, visit);
    }
    visit(ast); assert.ok(found, `missing ${name}`);
    const node = pick ? pick(found.initializer) : found;
    const code = ts.transpileModule(`const value = ${ts.isMethodDeclaration(node) ? `({${node.getText(ast)}}).${name}` : node.getText(ast)};`, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
    }).outputText;
    return vm.runInNewContext(`${code}; value`, globals);
}

test("checkMod tolerates missing skills, no mod table and missing/nonfunction hooks", () => {
    const definitions = { plain: {}, noHook: { mod: {} }, invalid: { mod: { cardEnabled: true } }, valid: { mod: { cardEnabled: () => false } } };
    const fn = extract("noname/game/index.js", "checkMod", { get: { info: name => definitions[name] } });
    const names = ["missing", "plain", "noHook", "invalid", "valid"];
    assert.equal(fn({}, {}, "unchanged", "cardEnabled", names), false);
    assert.equal(fn({}, {}, "unchanged", "cardEnabled", { getModableSkills: () => names }), false);
    assert.equal(fn({}, {}, "unchanged", "cardEnabled", ["missing", "plain"]), "unchanged");
});

test("modifiers may remove another skill mid-dispatch without crashing or skipping surviving hooks", () => {
    const seen = [], definitions = {
        first: { mod: { cardEnabled: () => { delete definitions.removed; seen.push("first"); } } },
        removed: { mod: { cardEnabled: () => assert.fail("removed hook executed") } },
        last: { mod: { cardEnabled: () => { seen.push("last"); return false; } } },
    };
    const fn = extract("noname/game/index.js", "checkMod", { get: { info: name => definitions[name] } });
    assert.equal(fn({}, {}, "unchanged", "cardEnabled", Object.keys(definitions)), false);
    assert.deepEqual(seen, ["first", "last"]);
});

test("death cleanup skips undefined skill info while removing both kinds of temporary skills", async () => {
    const removed = [], player = {
        tempSkills: { explicit: true }, name: "missing_general", isDead: () => true,
        removeSkill: name => removed.push(name), getSkills: () => ["missing", "normal", "temporary"], getCards: () => [],
    };
    const fn = extract("noname/library/element/content.ts", "die", {
        game: { reserveDead: true }, lib: { skill: { normal: {}, temporary: { temp: true } } }, _status: {},
    }, array => array.elements.find(node => node.getText().includes("lib.skill[skill]?.temp")));
    await fn({}, {}, player);
    assert.deepEqual(removed, ["explicit", "temporary"]);
});

class SkillList extends Array {
    remove(item) { const index = this.indexOf(item); if (index >= 0) this.splice(index, 1); return this; }
    unique() { return new SkillList(...new Set(this)); }
}
for (const [id, factory, storage, config] of [
    ["import_c8b8f5fc7d", tale, "soul", {}],
    ["import_fa474d9dca", surpass, "SurpassHumankind_soul", { wish: true }],
]) {
    test(`${id}: resource triggers stay automatic for every general and do not open ordering choices`, async () => {
        const game = {}, builder = { skill: {}, translate: {}, addPack() {}, addCard() {} };
        factory({}, game, {}, {}, {}, {}).build(config, builder);
        const parent = builder.skill[`_xianji_${id}`], counter = parent.subSkill.gz;
        assert.equal(parent.silent, true); assert.equal(counter.silent, true);
        const player = { storage: {}, markSkill() {}, chooseControl() { assert.fail("automatic counter opened skill ordering UI"); } };
        game.me = player;
        assert.equal(counter.filter({}, player), true);
        const count = vm.runInNewContext(`(${counter.content.toString()})`, { player }); count();
        assert.equal(player.storage[storage], 1);
        const lib = { skill: { counter, optional: {} }, translate: { counter: "献祭", optional: "可选技能" }, filter: { filterTrigger: () => true } };
        const executed = [];
        game.createTrigger = (name, skill) => ({ async forResult() { executed.push(skill); } });
        const arrange = extract("noname/library/element/content.ts", "arrangeTrigger", {
            lib, game, get: { itemtype: () => "player" },
        });
        const todoList = new SkillList(...["optional", "counter"].map(skill => ({ skill, player, priority: 0 })));
        await arrange({ doingList: [{ player, todoList, doneList: [] }], triggername: "phaseBegin" }, {}, player);
        assert.deepEqual(executed, ["counter", "optional"]);
    });
}
