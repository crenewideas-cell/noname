import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const read = path => readFileSync(new URL(`../apps/core/${path}`, import.meta.url), "utf8");
function method(path, name, globals) {
    const ast = ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true);
    let found;
    function visit(node) {
        if (ts.isMethodDeclaration(node) && node.name.getText(ast) === name) found ??= node;
        ts.forEachChild(node, visit);
    }
    visit(ast);
    assert.ok(found, name);
    return vm.runInNewContext(`({${found.getText(ast)}}).${name}`, globals);
}
function skills(path, globals, names) {
    const ast = ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true);
    const declaration = ast.statements.flatMap(node => ts.isVariableStatement(node) ? [...node.declarationList.declarations] : []).find(node => node.name.getText(ast) === "skills");
    const properties = declaration.initializer.properties.filter(node => names.includes(node.name.getText(ast)));
    assert.equal(properties.length, names.length);
    const context = vm.createContext(globals);
    vm.runInContext("Array.prototype.unique = function () { return [...new Set(this)]; };", context);
    return vm.runInContext(`({${properties.map(node => node.getText(ast)).join(",")}})`, context);
}

test("optional discard can cancel a partial AI/manual selection; complete selections can confirm", () => {
    const selected = { cards: [], buttons: [], targets: [] };
    const status = {};
    const ui = { selected };
    const get = {
        select: value => value,
        info: () => ({}), card: () => null,
        noSelected: () => !Object.values(selected).some(items => items.length),
    };
    let confirm;
    const game = {
        callHook() {}, uncheck() {},
        Check: {
            card: event => ({ ok: selected.cards.length >= event.selectCard[0], auto: false }),
            skill() {}, confirm: (event, value) => { confirm = value; },
        },
    };
    const check = method("noname/game/index.js", "check", {
        game, ui, get, _status: status, lib: { config: {} }, HTMLDivElement: class {},
        clearSelectionGuide() {}, updateSelectionGuide() {},
    });
    const event = {
        name: "chooseToDiscard", selectCard: [7, 7], filterCard: () => true,
        player: { node: { equips: { classList: { remove() {} } } } }, isMine: () => true,
    };
    status.event = event;
    for (const count of [0, 1, 5, 7]) {
        selected.cards.length = count;
        check(event);
        assert.equal(confirm, count === 7 ? "oc" : "c");
    }
    selected.cards.length = 5;
    event.forced = true;
    check(event);
    assert.equal(confirm, "", "forced discards cannot be skipped");
    event.forced = false;
    event.fakeforce = true;
    check(event);
    assert.equal(confirm, "");
    event.fakeforce = false;
    event.name = "chooseToUse";
    check(event);
    assert.equal(confirm, "", "other selection workflows keep their existing behavior");
});

test("昭心 evaluates actual hand-card suits and draws only for missing suits", async () => {
    const get = { suit: card => card.suit };
    const skill = skills("extension/packs/极略/character/jlsg_sk/skill.js", {
        lib: { suit: ["spade", "heart", "club", "diamond"] }, get, game: {}, ui: {}, ai: {}, _status: {},
    }, ["jlsg_zhaoxin"]).jlsg_zhaoxin;
    for (const suits of [[], ["heart"], ["heart", "heart", "club"], ["spade", "heart", "club", "diamond"]]) {
        // map/unique execute in the source realm, as they do in the game.
        const hand = vm.runInNewContext(JSON.stringify(suits.map(suit => ({ suit }))));
        hand.map = function (fn) { const result = Array.from(this, fn); result.unique = () => [...new Set(result)]; return result; };
        const calls = [];
        const player = { getCards: () => hand, async showHandcards() { calls.push("show"); }, draw: ({ num }) => calls.push(num) };
        const missing = 4 - new Set(suits).size;
        assert.equal(skill.filter({}, player), missing > 0);
        await skill.content({}, {}, player);
        assert.deepEqual(calls, missing ? ["show", missing] : ["show"]);
    }
});

test("乐进 discards the advertised count; 界乐进 requires equipment and damages only on refusal", async () => {
    const get = { cnNumber: String, damageEffect: () => -1 };
    const pack = skills("extension/packs/怒焰三国/character/skill.js", { lib: {}, get, game: {}, ui: {}, ai: {}, _status: {} }, ["nysgs_yuejin_skill", "nysgs_jie_yuejin_skill"]);
    for (const advanced of [false, true]) for (const bool of [false, true]) {
        let args, damage = 0, discarded;
        const target = {
            chooseToDiscard(...values) { args = values; return { set() { return this; }, async forResult() { return { bool }; } }; },
            damage: num => { damage += num; }, hasSkillTag: () => false,
        };
        const player = { logSkill() {}, discard: cards => { discarded = cards; }, nysgsCountFury: () => 6 };
        const cards = [{}, {}, {}];
        await pack[advanced ? "nysgs_jie_yuejin_skill" : "nysgs_yuejin_skill"].content({ name: "skill", cards, targets: [target] }, { player: target }, player);
        const count = advanced ? 7 : 3;
        assert.equal(args[0], "he");
        assert.equal(args[1], count);
        assert.equal(args[3]?.type, advanced ? "equip" : undefined);
        assert.equal(args[2].includes("装备牌"), advanced);
        assert.equal(damage, bool ? 0 : count);
        assert.equal(discarded, cards);
    }
});
