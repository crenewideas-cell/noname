import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolveExtensionPath } from "../../packages/fs/src/extensionLayout.mjs";
import groups from "../../apps/core/game/extension-groups.json";
import installed from "../../apps/core/game/organized-extensions.json";
import characterGroups from "../../apps/core/game/character-menu-groups.json";
import { groupExtensionMenus, characterMenuOwner, mergedMenuSections } from "../../apps/core/noname/ui/create/menu/extensionGroups.js";

const coreRoot = fileURLToPath(new URL("../../apps/core/", import.meta.url));
const extensionFile = (name: string, file: string) => resolveExtensionPath(coreRoot, `extension/${name}/${file}`);

test("settings categories collect installed extensions without losing any menu entry", () => {
	const modes = installed.map(pack => `extension_${pack.name}`);
	const original = [...modes];
	const result = groupExtensionMenus(modes);
	const standalone = result.find(entry => typeof entry !== "string" && entry.name === "独立武将");
	assert.ok(standalone && typeof standalone !== "string");
	for (const name of ["张三丰", "界周妃", "笮融", "朱绩"]) assert.ok(standalone.members.includes(`extension_${name}`), name);
	const flattened = result.flatMap(entry => typeof entry === "string" ? [entry] : entry.members);
	assert.deepEqual([...flattened].sort(), [...modes].sort());
	assert.equal(new Set(flattened).size, modes.length);
	assert.deepEqual(modes, original);
	const names = result.filter(entry => typeof entry !== "string").map(entry => entry.name);
	assert.equal(new Set(names).size, names.length);
	assert.ok(!names.includes("PXLNGU")); // Character ownership is separate from settings categories.
});

test("settings distinguish major packs, collections, characters, UI and unclassified imports", () => {
	const collections = ["风云浮生明辉月", "觉醒突破", "清瑶葭绮", "群雄并起", "分支武将"].map(name => `extension_${name}`);
	assert.deepEqual(groupExtensionMenus(["extension_活动武将", "extension_絶伦逸羣", ...collections, "extension_笮融", "extension_朱绩", "extension_千幻聆音", "extension_custom"]), [
		{ name: "武将扩展包", members: ["extension_活动武将", "extension_絶伦逸羣"] },
		{ name: "合并扩展包", members: collections },
		{ name: "独立武将", members: ["extension_笮融", "extension_朱绩"] },
		"extension_千幻聆音", // The menu page collects builtins after tools.
		"extension_custom",
	]);
});

test("partial installs, removed or hidden members are not resurrected", () => {
	assert.deepEqual(groupExtensionMenus([]), []);
	assert.deepEqual(groupExtensionMenus(["coin", "extension_custom"]), ["coin", "extension_custom"]);
	assert.deepEqual(groupExtensionMenus(["extension_界周妃"]), [{ name: "独立武将", members: ["extension_界周妃"] }]);
	assert.deepEqual(groupExtensionMenus(["extension_EpicFX"]), []);
});

test("custom top-level and member sort order are preserved", () => {
	assert.deepEqual(groupExtensionMenus(["coin", "extension_朱绩", "extension_名将杀", "extension_笮融", "extension_界周妃", "extension_指示线"]), [
		"coin",
		{ name: "独立武将", members: ["extension_朱绩", "extension_笮融", "extension_界周妃"] },
		{ name: "武将扩展包", members: ["extension_名将杀"] },
		"extension_指示线",
	]);
});

test("real extensions sharing a settings category name are never shadowed", () => {
	for (const [name, member] of [
		["独立武将", "朱绩"], ["武将扩展包", "活动武将"], ["合并扩展包", "群雄并起"],
		["界面与特效", "千幻聆音"], ["新导入待分类", "custom"],
	]) {
		const modes = [`extension_${member}`, `extension_${name}`];
		const result = groupExtensionMenus(modes);
		assert.ok(!result.some(entry => typeof entry !== "string" && entry.name === name), name);
		assert.ok(result.includes(`extension_${member}`), member);
		assert.deepEqual(result.flatMap(entry => typeof entry === "string" ? [entry] : entry.members), modes);
	}
});

test("each PXLNGU member exists and removed EpicFX is absent from registration", async () => {
	assert.equal(groups.length, 1);
	assert.equal(groups[0].name, "PXLNGU");
	const members = groups[0].members;
	assert.equal(new Set(members).size, members.length);
	assert.ok(!members.includes("EpicFX"));
	assert.ok(!installed.some(pack => pack.name === "EpicFX"));
	assert.deepEqual(groupExtensionMenus(["extension_EpicFX", "extension_名将杀"]), [{ name: "武将扩展包", members: ["extension_名将杀"] }]);
	for (const name of members) {
		assert.ok(installed.some(pack => pack.name === name), name);
		const source = await fs.readFile(extensionFile(name, "extension.js"), "utf8");
		assert.match(source, /export\s+const\s+type\s*=\s*["']extension["']/);
	}
});

test("startup, post-game rebuild and late arrivals share one character owner map", () => {
	assert.equal(characterMenuOwner("zerongPack"), "PXLNGU");
	for (let rebuild = 0; rebuild < 3; rebuild++) {
		for (const name of groups[0].members) {
			assert.equal(characterMenuOwner(name), "PXLNGU");
			assert.equal(characterMenuOwner(`mode_extension_${name}`), "PXLNGU");
		}
		assert.equal(characterMenuOwner("wandian"), "群雄并起");
		assert.equal(characterMenuOwner("清瑶葭绮"), "清瑶葭绮");
		assert.equal(characterMenuOwner("standard"), "基础");
	}
});

test("every consolidated pack exposes stable member config sections without importing code", () => {
	assert.equal(mergedMenuSections("清瑶葭绮").length, 4);
	assert.equal(mergedMenuSections("风云浮生明辉月").length, 4);
	assert.equal(mergedMenuSections("觉醒突破").length, 2);
	assert.equal(mergedMenuSections("群雄并起").length, 7);
	assert.equal(mergedMenuSections("手杀武将").length, 8);
	assert.deepEqual(mergedMenuSections("名将杀"), []);
	assert.equal(mergedMenuSections("手杀武将").find(member => member.name === "新武将")?.keys[0], "apk_new");
});

test("advanced group retains eleven core packs and includes the two activity subpacks", async () => {
	const group = characterGroups.groups[0];
	assert.equal(group.name, "进阶");
	assert.equal(new Set(group.members).size, 13);
	for (const name of group.members) {
		assert.equal(characterMenuOwner(name), "进阶");
		if (["HD_chaoshikong", "huodongcharacter"].includes(name)) {
			await fs.access(`apps/core/extension/packs/活动武将/js/precontent/${name}.js`);
		} else {
			await fs.access(`apps/core/character/${name}`);
		}
	}
	const labels = await fs.readFile("apps/core/game/package.js", "utf8");
	assert.match(labels, /diy: "设计比赛20"/);
	assert.match(labels, /key: "键社"/);
	assert.equal(characterMenuOwner("key"), "PXLNGU");
});

test("retired crossover packs have no load entry or switches; independent packs remain", async () => {
	const base = "apps/core/extension/collections/群雄并起/members/杀海拾遗/main/";
	const source = await fs.readFile(base + "precontent.js", "utf8");
	const config = await fs.readFile(base + "config.js", "utf8");
	for (const id of characterGroups.removed) {
		assert.doesNotMatch(source, new RegExp(`\\b${id}\\b`));
		assert.doesNotMatch(config, new RegExp(`\\b${id}\\b`));
	}
	for (const id of ["yunchou", "wuxing", "zhenfa"]) assert.match(source, new RegExp(`loadPack\\("${id}"`));
});

test("consolidated package credits display PXLNGU", async () => {
	assert.equal(characterGroups.author, "PXLNGU");
	for (const name of ["风云浮生明辉月", "觉醒突破", "清瑶葭绮", "群雄并起"]) {
		const info = JSON.parse(await fs.readFile(extensionFile(name, "info.json"), "utf8"));
		assert.equal(info.author, "PXLNGU");
	}
	assert.match(await fs.readFile("apps/core/extension/collections/手杀武将/extension.js", "utf8"), /pack\.package\.author = "PXLNGU"/);
});
