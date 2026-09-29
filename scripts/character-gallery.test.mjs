import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { characterGalleryPacks } from "../apps/core/noname/ui/workshop/characterGallery.js";

function eventBossMetadata() {
	const source = fs.readFileSync(new URL("../apps/core/extension/packs/活动BOSS/extension.js", import.meta.url), "utf8");
	const ast = ts.createSourceFile("extension.js", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
	let definition;
	function visit(node) {
		if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "BOSS_huodong") definition = node.initializer;
		else ts.forEachChild(node, visit);
	}
	visit(ast);
	assert.ok(definition, "real event BOSS pack exists");
	return Object.fromEntries(
		["character", "translate"].map(key => {
			const property = definition.properties.find(property => property.name?.getText(ast) === key);
			if (key === "translate") return [key, Object.fromEntries(property.initializer.properties.filter(entry => entry.initializer && ts.isStringLiteral(entry.initializer)).map(entry => [entry.name.text, entry.initializer.text]))];
			return [key, structuredClone(vm.runInNewContext(`(${property.initializer.getText(ast)})`))];
		})
	);
}

const { mergeDuplicateCharacters, isDuplicateCharacter } = await import("../apps/core/noname/init/characterDuplicates.js");
const skills = character => character.skills || character[3];

test("real BOSS names merge skills even with mixed-case IDs and different portraits", () => {
	const pack = eventBossMetadata();
	const before = structuredClone(pack);
	const aliases = mergeDuplicateCharacters(pack);
	const gallery = characterGalleryPacks({ BOSS_huodong: pack }).BOSS_huodong;
	for (const name of ["草丛", "狼", "木隼", "隼爪", "隼翅"]) {
		const originals = Object.keys(before.character).filter(id => before.translate[id] === name && !before.character[id][4]?.includes("unseen"));
		assert.ok(originals.length > 1, name);
		const shown = Object.keys(gallery.character).filter(id => pack.translate[id] === name);
		assert.equal(shown.length, 1, name);
		const union = [...new Set(originals.flatMap(id => skills(before.character[id])))];
		for (const id of originals) {
			assert.deepEqual(skills(pack.character[id]), union, id);
			assert.equal(pack.character[id][2], before.character[id][2], "retain event HP for " + id);
			assert.equal(isDuplicateCharacter(pack.character[id]), id !== shown[0]);
		}
	}
	const names = Object.entries(gallery.character)
		.filter(([, c]) => !c[4]?.includes("unseen"))
		.map(([id]) => pack.translate[id])
		.filter(Boolean);
	assert.equal(new Set(names).size, names.length, "no duplicate display names in the entire BOSS pack");
	const merged = structuredClone(pack);
	assert.deepEqual(mergeDuplicateCharacters(pack), aliases);
	assert.deepEqual(pack, merged, "repeated registration is stable");
});

test("different packs stay separate, including shared definition objects; hidden transformations stay intact", () => {
	const shared = ["male", "qun", 4, ["base"], []];
	const first = { character: { a: shared, b: ["female", "wei", 6, ["base", "extra"], ["ext:different/b.jpg"]], hidden: ["male", "qun", 1, ["transform"], ["unseen"]] }, translate: { a: "同名", b: "<b>同名</b>", hidden: "同名" }, characterSort: { pack: { row: ["a", "b", "hidden"] } } };
	const second = { character: { c: shared, d: ["male", "qun", 3, ["other"], []] }, translate: { c: "同名", d: "另一位" } };
	const before = structuredClone(second);
	mergeDuplicateCharacters(first);
	mergeDuplicateCharacters(second);
	assert.deepEqual(second, before);
	assert.deepEqual(shared[3], ["base"]);
	assert.deepEqual(first.character.a[3], ["base", "extra"]);
	assert.deepEqual(first.character.hidden[3], ["transform"]);
	assert.deepEqual(first.characterSort.pack.row, ["a", "hidden"]);
	const gallery = characterGalleryPacks({ first, second });
	assert.deepEqual(Object.keys(gallery.first.character), ["a", "hidden"]);
	assert.deepEqual(Object.keys(gallery.second.character), ["c", "d"]);
});

test("modern metadata and incremental additions retain the skill union and compatibility aliases", () => {
	const pack = { character: { a: { group: "qun", hp: 4, skills: ["first"], trashBin: [] }, b: { group: "qun", hp: 6, skills: ["second"], trashBin: [] } }, translate: { a: "首领", b: "首领", c: "首领" } };
	mergeDuplicateCharacters(pack);
	assert.equal(pack.character.b.isUnseen, true);
	assert.deepEqual(pack.character.a.skills, ["first", "second"]);
	pack.character.c = { group: "qun", hp: 8, skills: ["third", "first"], trashBin: [] };
	mergeDuplicateCharacters(pack);
	for (const character of Object.values(pack.character)) assert.deepEqual(character.skills, ["first", "second", "third"]);
	assert.deepEqual(Object.keys(characterGalleryPacks({ custom: pack }).custom.character), ["a"]);
});

test("missing names and translation accessors are not treated as matching characters", () => {
	const translate = {
		a: "first",
		b: "second",
		get c() {
			throw new Error("must not run gameplay getter");
		},
	};
	const pack = { character: Object.fromEntries(["a", "b", "c", "d"].map(id => [id, ["male", "qun", 4, [id], []]])), translate };
	assert.equal(mergeDuplicateCharacters(pack).size, 0);
	for (const [id, c] of Object.entries(pack.character)) assert.deepEqual(c[3], [id]);
});
