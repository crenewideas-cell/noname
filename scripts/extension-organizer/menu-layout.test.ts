import test from "node:test";
import assert from "node:assert/strict";
import { groupExtensionMenus, extensionCharacterPacks } from "../../apps/core/noname/ui/create/menu/extensionGroups.js";
import { characterGalleryPacks } from "../../apps/core/noname/ui/workshop/characterGallery.js";

test("extension portraits resolve runtime owners and legacy asset tags without duplicate characters", () => {
	const lib = { characterPackExtension: { renamed: "新导入" }, characterPack: {
		renamed: { a: {} }, legacy: { b: ["male", "qun", 3, [], ["ext:新导入/b.jpg"]] },
		modern: { c: { trashBin: ["img:extension/新导入/c.jpg"] } }, unrelated: { d: {} },
		mode_favourite: { b: ["male", "qun", 3, [], ["ext:新导入/b.jpg"]] },
	} };
	assert.deepEqual(extensionCharacterPacks("新导入", lib), [
		{ mode: "renamed", characters: ["a"] }, { mode: "legacy", characters: ["b"] }, { mode: "modern", characters: ["c"] },
	]);
	lib.characterPack["新导入"] = lib.characterPack.renamed;
	assert.deepEqual(extensionCharacterPacks("新导入", lib).flatMap(p => p.characters), ["a", "b", "c"]);
});

test("gallery moves Zerong into other characters without mutating engine packs or character data", () => {
	const form = ["male", "qun", 4, ["skill"], ["ext:笮融/portrait.jpg"]];
	const packs = { standard: { character: { caocao: {} } }, zerongPack: { character: { zr: form }, translate: { zr: "笮融" } }, huodongcharacter: { character: { other: {} }, translate: { other: "原有武将" } } };
	const before = structuredClone(packs);
	const gallery = characterGalleryPacks(packs);
	assert.equal(gallery.zerongPack, undefined);
	assert.deepEqual(Object.keys(gallery.huodongcharacter.character), ["zr", "other"]);
	assert.equal(gallery.huodongcharacter.character.zr, form);
	assert.equal(gallery.huodongcharacter.translate.huodongcharacter_character_config, "其他武将");
	assert.deepEqual(packs, before);
	assert.deepEqual(characterGalleryPacks({ zerongPack: packs.zerongPack }).huodongcharacter.character, packs.zerongPack.character);
});

test("keyboard society joins collections while card collection retains its own entry", () => {
	const modes = ["extension_清瑶葭绮", "extension_键社", "extension_卡牌扩展", "extension_名将杀"];
	assert.deepEqual(groupExtensionMenus(modes), [
		{ name: "合并扩展包", members: ["extension_清瑶葭绮", "extension_键社"] },
		"extension_卡牌扩展",
		{ name: "武将扩展包", members: ["extension_名将杀"] },
	]);
	const sorted = ["extension_卡牌扩展", "extension_键社", "extension_清瑶葭绮"];
	assert.deepEqual(groupExtensionMenus(sorted), [sorted[0], { name: "合并扩展包", members: sorted.slice(1) }]);
	assert.deepEqual(groupExtensionMenus(["extension_卡牌扩展"]), ["extension_卡牌扩展"]);
});
