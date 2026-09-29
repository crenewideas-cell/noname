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
