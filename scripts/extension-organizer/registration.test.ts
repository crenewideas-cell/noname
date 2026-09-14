import test from "node:test";
import assert from "node:assert/strict";
import installed from "../../apps/core/game/organized-extensions.json";
import validation from "../../apps/core/game/organized-extension-status.json";
import bundled from "../../apps/core/game/bundled-extensions.json";
import fs from "node:fs/promises";
import { registerOrganizedExtensions } from "../../apps/core/noname/init/organizedExtensions.js";

function fixture(initial: Record<string, unknown> = {}) {
	const values = new Map(Object.entries(initial));
	const writes: string[] = [];
	return {
		values,
		writes,
		config: { get: (key: string) => values.get(key), has: (key: string) => values.has(key) },
		save: async (key: string, value: unknown) => {
			values.set(key, value);
			writes.push(key);
		},
	};
}

test("removing crossover packs preserves advanced pack IDs and unrelated saved switches", async () => {
	const f = fixture({
		characters: ["gwent", "hearth", "offline", "diy", "key", "yunchou"],
		cards: ["standard", "mtg", "gujian", "yunchou"],
		extension_杀海拾遗_gwent: true, extension_群雄并起_member_3_mtg: true,
		extension_杀海拾遗_yunchou: true, extension_名将杀_enable: false,
	});
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.values.get("characters"), ["offline", "diy", "key", "yunchou"]);
	assert.deepEqual(f.values.get("cards"), ["standard", "yunchou"]);
	assert.equal(f.values.get("extension_杀海拾遗_gwent"), false);
	assert.equal(f.values.get("extension_群雄并起_member_3_mtg"), false);
	assert.equal(f.values.get("extension_杀海拾遗_yunchou"), true);
	assert.equal(f.values.get("extension_名将杀_enable"), false);
	f.writes.length = 0;
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.writes, []);
});

test("fresh browser registers all installed packs, disables incomplete packs", async () => {
	const f = fixture({ extensions: ["existing"] });
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.values.get("extensions"), ["existing", ...bundled, ...installed.map(p => p.name)]);
	for (const name of bundled) assert.equal(f.values.get(`extension_${name}_enable`), name === "红楼幻境");
	const disabled = new Set(validation.disabled.map(p => p.name));
	for (const p of installed) assert.equal(f.values.get(`extension_${p.name}_enable`), !disabled.has(p.name) && !("defaultEnabled" in p && p.defaultEnabled === false));
	assert.equal(new Set(installed.map(p => p.name)).size, installed.length);
	for (const p of validation.disabled) assert.ok(installed.some(i => i.name === p.name));
});

test("repeated startup preserves user switches and removed registrations without writes", async () => {
	const f = fixture();
	await registerOrganizedExtensions(f.config, f.save);
	const name = installed.find(p => !validation.disabled.some(d => d.name === p.name))!.name;
	f.values.set(`extension_${name}_enable`, false);
	f.values.set(`extension_${validation.disabled[0].name}_enable`, true);
	f.values.set(
		"extensions",
		(f.values.get("extensions") as string[]).filter(n => n !== name)
	);
	f.writes.length = 0;
	await registerOrganizedExtensions(f.config, f.save);
	assert.equal(f.values.get(`extension_${name}_enable`), false);
	assert.equal(f.values.get(`extension_${validation.disabled[0].name}_enable`), true);
	assert.equal((f.values.get("extensions") as string[]).includes(name), false);
	assert.deepEqual(f.writes, []);
});

test("validation version changes never reset existing extension switches", async () => {
	for (const version of [undefined, 2, 3, validation.version + 1]) {
		const names = [...bundled, ...installed.map(p => p.name)];
		const f = fixture({ extensions: names, organized_extensions_registered: names, organized_extensions_validation: version });
		for (const [i, name] of names.entries()) f.values.set(`extension_${name}_enable`, i % 2 === 0);
		await registerOrganizedExtensions(f.config, f.save);
		for (const [i, name] of names.entries()) assert.equal(f.values.get(`extension_${name}_enable`), i % 2 === 0);
		assert.ok(!f.writes.some(key => key.endsWith("_enable")));
		assert.equal(f.values.get("organized_extensions_validation"), validation.version);
	}
});

test("new registration preserves previous disabled choice and does not duplicate existing name", async () => {
	const name = installed[0].name;
	const f = fixture({ extensions: [name], [`extension_${name}_enable`]: false });
	await registerOrganizedExtensions(f.config, f.save);
	assert.equal(f.values.get(`extension_${name}_enable`), false);
	assert.equal((f.values.get("extensions") as string[]).filter(n => n === name).length, 1);
});

test("APK upgrade restores omitted original registrations while preserving settings and order", async () => {
	const previous = ["custom", "活动武将", installed[0].name];
	const f = fixture({
		extensions: previous,
		organized_extensions_registered: installed.map(p => p.name),
		organized_extensions_validation: 2,
		extension_名将杀_enable: true,
		extension_活动武将_enable: false,
		extension_名将杀_customOption: "preserved",
		characters: ["standard", "mjsha"],
	});
	await registerOrganizedExtensions(f.config, f.save);
	const extensions = f.values.get("extensions") as string[];
	assert.deepEqual(extensions.slice(0, previous.length), previous);
	for (const name of bundled) assert.equal(extensions.filter(n => n === name).length, 1);
	assert.equal(f.values.get("extension_名将杀_enable"), true);
	assert.equal(f.values.get("extension_活动武将_enable"), false);
	assert.equal(f.values.get("extension_名将杀_customOption"), "preserved");
	assert.deepEqual(f.values.get("characters"), ["standard", "mjsha"]);
	assert.ok(!f.writes.includes("extension_名将杀_enable"));
	assert.ok(!f.writes.includes("extension_活动武将_enable"));
	f.writes.length = 0;
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.writes, []);
});

test("incremental registration preserves enabled choices even for newly safety-listed packs", async () => {
	const f = fixture({ extensions: ["名将杀"] });
	for (const p of validation.disabled) f.values.set(`extension_${p.name}_enable`, true);
	await registerOrganizedExtensions(f.config, f.save);
	for (const p of validation.disabled) assert.equal(f.values.get(`extension_${p.name}_enable`), true);
});

test("original extension manifest includes 名将杀 and 活动武将 and resolves real ESM entries", async () => {
	assert.ok(bundled.includes("名将杀"));
	assert.ok(bundled.includes("活动武将"));
	const names = [...bundled, ...installed.map(p => p.name)];
	assert.equal(new Set(names).size, names.length);
	for (const name of bundled) {
		const root = new URL(`../../apps/core/extension/${name}/`, import.meta.url);
		const info = JSON.parse(await fs.readFile(new URL("info.json", root), "utf8"));
		assert.equal(info.name, name);
		const source = await fs.readFile(new URL("extension.js", root), "utf8");
		assert.match(source, /export\s+(?:let|const|var)\s+type\s*=\s*["']extension["']/);
		assert.match(source, /export\s+default\b/);
	}
});

test("legacy Honglou identity migrates once without resurrecting its missing directory", async () => {
	const f = fixture({
		extensions: ["custom", "红楼幻梦", "红楼幻境"],
		organized_extensions_registered: ["红楼幻梦"],
		extension_红楼幻梦_enable: true,
		extension_红楼幻境_enable: false,
		extension_红楼幻梦_volume: 0.3,
		characters: ["standard", "红楼幻梦"],
		cards: ["mode_extension_红楼幻梦", "standard"],
		gameRecord: { wins: 12 },
	});
	await registerOrganizedExtensions(f.config, f.save, [...f.values.keys()]);
	assert.equal(f.values.get("extension_红楼幻境_enable"), false);
	assert.equal(f.values.get("extension_红楼幻梦_enable"), true, "keep rollback data");
	assert.equal(f.values.get("extension_红楼幻境_volume"), 0.3);
	assert.deepEqual(f.values.get("characters"), ["standard", "红楼幻境"]);
	assert.deepEqual(f.values.get("cards"), ["mode_extension_红楼幻境", "standard"]);
	assert.deepEqual(f.values.get("gameRecord"), { wins: 12 });
	for (const key of ["extensions", "organized_extensions_registered"]) {
		const names = f.values.get(key) as string[];
		assert.ok(!names.includes("红楼幻梦"));
		assert.equal(names.filter(name => name === "红楼幻境").length, 1);
	}
	f.values.set("extension_红楼幻境_volume", 0.8);
	f.writes.length = 0;
	await registerOrganizedExtensions(f.config, f.save, [...f.values.keys()]);
	assert.deepEqual(f.writes, []);
	assert.equal(f.values.get("extension_红楼幻境_volume"), 0.8);
});

test("Honglou adopts a legacy enabled or disabled choice on first registration", async () => {
	for (const enabled of [true, false]) {
		const f = fixture({ extension_红楼幻梦_enable: enabled });
		await registerOrganizedExtensions(f.config, f.save, [...f.values.keys()]);
		assert.equal(f.values.get("extension_红楼幻境_enable"), enabled);
		assert.ok(!(f.values.get("extensions") as string[]).includes("红楼幻梦"));
	}
});

test("Honglou runtime identity and default assets resolve to the installed directory", async () => {
	const { default: extension } = await import("../../apps/core/extension/红楼幻境/extension.js");
	const pack = extension({}, {}, {}, {}, {}, {});
	assert.equal(pack.name, "红楼幻境");
	assert.ok(pack.package.character.characterSort[pack.name]);
	const portrait = pack.package.character.character.hlhj_daiyu.img;
	const card = pack.package.card.card.hlhj_qingsi.image.replace(/^ext:/, "extension/");
	for (const file of [portrait, card]) {
		assert.ok(file.startsWith("extension/红楼幻境/"));
		await fs.access(new URL(`../../apps/core/${file}`, import.meta.url));
	}
});

test("private enable options never become load entries and polluted 名将杀 registrations are repaired", async () => {
	const privateNames = ["mjs", "mjsold", "mjsnew"].map(pack => `名将杀_characterPack_${pack}`);
	for (const polluted of [false, true]) {
		const f = fixture({
			extensions: ["名将杀", "custom_pack", ...(polluted ? privateNames : [])],
			organized_extensions_registered: ["名将杀", "custom_pack", ...(polluted ? privateNames : [])],
			extension_名将杀_enable: false,
			extension_custom_pack_enable: true,
			extension_custom_pack_feature_enable: true,
			characters: ["mjs", "mjsold", "mjsnew"],
		});
		for (const name of privateNames) f.values.set(`extension_${name}_enable`, true);
		await registerOrganizedExtensions(f.config, f.save, [...f.values.keys()]);
		for (const key of ["extensions", "organized_extensions_registered"]) {
			const names = f.values.get(key) as string[];
			assert.ok(names.includes("名将杀"));
			assert.ok(names.includes("custom_pack"), "real names may contain underscores");
			for (const name of [...privateNames, "custom_pack_feature"]) assert.ok(!names.includes(name));
		}
		assert.equal(f.values.get("extension_名将杀_enable"), false);
		assert.equal(f.values.get("extension_custom_pack_feature_enable"), true);
		for (const name of privateNames) assert.equal(f.values.get(`extension_${name}_enable`), true);
		assert.deepEqual(f.values.get("characters"), ["mjs", "mjsold", "mjsnew"]);
		f.writes.length = 0;
		await registerOrganizedExtensions(f.config, f.save, [...f.values.keys()]);
		assert.deepEqual(f.writes, []);
	}
});

test("registration history restores a missing enabled manual pack without guessing option identities", async () => {
	const f = fixture({
		extensions: [], organized_extensions_registered: ["custom_pack"],
		extension_custom_pack_enable: true, extension_unknown_feature_enable: true,
	});
	await registerOrganizedExtensions(f.config, f.save, [...f.values.keys()]);
	assert.ok((f.values.get("extensions") as string[]).includes("custom_pack"));
	assert.ok(!(f.values.get("extensions") as string[]).includes("unknown_feature"));
	assert.equal(f.values.get("extension_unknown_feature_enable"), true);
});
