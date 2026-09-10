import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function objectProperty(file: string, name: string, globals: Record<string, unknown> = {}) {
	const source = fs.readFileSync(new URL(`../../apps/core/${file}`, import.meta.url), "utf8");
	const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
	let expression: ts.Expression | undefined;
	function visit(node: ts.Node) {
		if (ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteralLike(node.name)) && node.name.text === name && ts.isObjectLiteralExpression(node.initializer)) {
			expression ??= node.initializer;
		}
		ts.forEachChild(node, visit);
	}
	visit(ast);
	assert.ok(expression, `${file}: ${name}`);
	return vm.runInNewContext(`(${expression.getText(ast)})`, globals);
}

test("Fan Yunfei initializes only his own limited-skill storage", () => {
	const skill = objectProperty("extension/苦情树下/extension.js", "沙暴袭");
	const storage = { otherSkill: 7 };
	const player: any = { storage, countCards: () => 2 };
	skill.init(player);
	assert.equal(player.storage, storage);
	assert.equal(player.storage.otherSkill, 7);
	assert.equal(skill.filter({}, player), true);
	player.storage.沙暴袭 = true;
	assert.equal(skill.filter({}, player), false);
});

test("Huangfu Song uses valid trigger names and can regain Guanhuo without implicit variables", async () => {
	const skill = objectProperty("extension/手杀武将/apk/还原武将/extension.js", "twjuxia");
	const regain = skill.subSkill.g;
	assert.deepEqual(Object.keys(regain.trigger), ["player"]);
	assert.equal(regain.trigger.player, "phaseBegin");
	const added: string[] = [];
	let choices = 0;
	const player = {
		hasSkill: () => false,
		chooseBool() { choices++; return { set() { return this; }, forResult: async () => ({ bool: true }) }; },
		addSkill: (id: string) => added.push(id),
	};
	await regain.content({}, {}, player);
	assert.deepEqual(added, ["twguanhuo"]);
	player.hasSkill = () => true;
	await regain.content({}, {}, player);
	assert.equal(choices, 1);
});

test("Qunxiong Luoyi subskill has only event names in its trigger map", () => {
	const skill = objectProperty("extension/群雄并起/members/群雄并起/extension.js", "qx_luoyi_sha");
	assert.deepEqual(Object.keys(skill.subSkill.damage.trigger), ["player"]);
	assert.equal(skill.subSkill.damage.trigger.player, "damageBefore");
});

test("activity dual-sided characters refer to surviving unique characters", () => {
	const characters = objectProperty("extension/活动武将/js/precontent/huodongcharacter.js", "character");
	let checked = 0;
	for (const [id, info] of Object.entries(characters) as [string, any[]][]) {
		const tag = info[4]?.find((value: string) => value.startsWith("dualside:"));
		if (!tag) continue;
		const target = tag.slice("dualside:".length);
		assert.ok(characters[target], `${id} references missing ${target}`);
		assert.notEqual(id, target);
		assert.ok(characters[target][4].includes(`dualside:${id}`));
		checked++;
	}
	assert.equal(checked, 6);
});
