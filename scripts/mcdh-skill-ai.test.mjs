import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function extract(path, predicate) {
    const source = readFileSync(new URL(`../apps/core/${path}`, import.meta.url), "utf8");
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
    let found;
    function visit(node) {
        if (found) return;
        if (predicate(node, ast)) found = node;
        else ts.forEachChild(node, visit);
    }
    visit(ast);
    assert.ok(found, `missing definition in ${path}`);
    return found.getText(ast);
}

const skillSource = extract("extension/packs/梦澈涤花/character/skill.js", (node, ast) =>
    ts.isPropertyAssignment(node) && node.name.getText(ast) === "mcdh_WB00201");
const skill = vm.runInNewContext(`({${skillSource}}).mcdh_WB00201.subSkill.use`);
const tagSource = extract("noname/library/element/player.js", (node, ast) =>
    ts.isMethodDeclaration(node) && node.name.getText(ast) === "hasSkillTag");
const hasSkillTag = vm.runInNewContext(`({${tagSource}}).hasSkillTag`, {
    lib: { skill: { mcdh_WB00201_use: skill } },
    game: { expandSkills() {} },
});

for (const tag of ["respondSha", "respondShan"]) {
    test(`探前路掷旧尘: ${tag} requires shown cards and a use context`, () => {
        for (const shown of [[], [{ name: "tao" }]]) {
            const player = {
                getSkills: () => ["mcdh_WB00201_use"],
                getShownCards: () => shown,
            };
            for (const context of ["respond", "use", undefined]) {
                assert.equal(
                    hasSkillTag.call(player, tag, true, context, false),
                    shown.length > 0 && context !== "respond",
                    `shown=${shown.length}, context=${context}`,
                );
            }
        }
    });
}

const nlSource = extract("extension/packs/梦澈涤花/character/skill.js", (node, ast) =>
    ts.isPropertyAssignment(node) && node.name.getText(ast) === "mcdh_NL00802");
for (const choice of [true, false]) {
    test(`mcdh_NL00802 uses the choice result without event.targets (accept=${choice})`, async () => {
        const calls = [], cards = [{}], recipient = {};
        const definition = vm.runInNewContext(`({${nlSource}}).mcdh_NL00802`, { get: { prompt: () => "" } });
        const player = {
            hp: 3, countCards: () => 4,
            addTempSkill: id => calls.push(["temp", id]), addMark: (...args) => calls.push(["mark", ...args]),
            chooseCardTarget: options => {
                assert.equal(options.position, "he");
                assert.equal(options.filterTarget(null, player, player), false);
                assert.equal(options.filterTarget(null, player, recipient), true);
                return { forResult: async () => choice ? { bool: true, cards, targets: [recipient] } : { bool: false } };
            },
            line: targets => assert.equal(targets[0], recipient),
            give: async (given, target) => { assert.equal(given, cards); assert.equal(target, recipient); calls.push(["give"]); },
        };
        await definition.content({ name: "mcdh_NL00802" }, {}, player);
        assert.deepEqual(calls, [["temp", "mcdh_NL00802_max"], ["mark", "mcdh_NL00802_max", 1, false], ...(choice ? [["give"]] : [])]);
    });
}
for (const [hand, movable, expected] of [[3, false, [["draw", 2]]], [2, true, [["move"]]], [2, false, []]]) {
    test(`mcdh_NL00802 preserves draw/move branches (${hand}, ${movable})`, async () => {
        const calls = [];
        const definition = vm.runInNewContext(`({${nlSource}}).mcdh_NL00802`);
        await definition.content({}, {}, { hp: 3, countCards: () => hand, canMoveCard: () => movable,
            draw: async n => calls.push(["draw", n]), moveCard: async () => calls.push(["move"]) });
        assert.deepEqual(calls, expected);
    });
}
