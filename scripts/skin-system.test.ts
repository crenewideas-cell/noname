import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createSkinService, normalizeSkinPath, savedSkinPath } from "../apps/core/noname/skin/service.js";
import { skinCatalog } from "../apps/core/noname/skin/catalog.js";

function setup(overrides = {}) {
	const config = { skin: {}, change_skin: true };
	const saves: unknown[] = [];
	const store = createSkinService({
		config: () => config,
		save: async (_key, value) => {
			saves.push(structuredClone(value));
		},
		directory: () => "image/skin/hero/",
		readDirectory: async () => ["春.新.webp", "notes.txt", "../bad.jpg", "draft.json"],
		exists: async () => true,
		...overrides,
	});
	return { store, config, saves };
}

test("local paths are normalized; corrupt saved settings and traversal are ignored", () => {
	assert.equal(normalizeSkinPath("ext:测试\\skin\\a.webp"), "extension/测试/skin/a.webp");
	for (const path of ["../a.jpg", "image/%2e%2e/a.jpg", "https://x/a.jpg", "//x/a.jpg", 'image/"a.jpg', "image/%zz.jpg"]) assert.equal(normalizeSkinPath(path), null);
	for (const value of [1, {}, null, [null, "a.jpg"], ["x", "code.js"]]) assert.equal(savedSkinPath(value), null);
});

test("directory filtering and dotted filenames preserve alternate-form paths", async () => {
	const { store, config } = setup({ substitutes: () => ["hero_form"] });
	const { skins } = await store.list("hero");
	assert.equal(skins.length, 1);
	assert.equal(skins[0].variants.hero_form, "image/skin/hero/春.新/hero_form.webp");
	await store.apply("hero", skins[0].id);
	assert.deepEqual(config.skin.hero_form, ["春.新", "image/skin/hero/春.新/hero_form.webp"]);
});

test("missing filesystem leaves registered skins available and retries discovery", async () => {
	let attempts = 0;
	const { store } = setup({
		readDirectory: async () => {
			attempts++;
			throw Error("offline");
		},
	});
	store.register("pack", () => [{ path: "image/a.jpg", name: "春" }]);
	assert.equal((await store.list("hero")).skins.length, 1);
	assert.equal((await store.list("hero")).unavailable, true);
	assert.equal(attempts, 2);
});

test("provider failures are isolated and duplicate paths coalesce", async () => {
	const { store } = setup({ directory: () => null });
	store.register("broken", () => {
		throw Error("bad provider");
	});
	store.register("okay", () => [{ path: "image/a.jpg" }, { path: "image/a.jpg" }]);
	const result = await store.list("hero");
	assert.equal(result.skins.length, 1);
	assert.equal(result.unavailable, true);
});

test("missing main image preserves selection and never persists", async () => {
	const { store, config, saves } = setup({ exists: async () => false });
	config.skin.hero = ["旧皮肤", "image/old.jpg"];
	await assert.rejects(store.apply("hero", "image/skin/hero/春.新.webp"), /无法加载/);
	assert.equal(config.skin.hero[1], "image/old.jpg");
	assert.equal(saves.length, 0);
});

test("missing alternate image resets stale form skin without changing unrelated characters", async () => {
	const { store, config } = setup({ substitutes: () => ["hero_form"], exists: async path => !path.includes("hero_form") });
	config.skin.hero_form = ["old", "image/old.jpg"];
	config.skin.other = ["other", "image/other.jpg"];
	await store.apply("hero", "image/skin/hero/春.新.webp");
	assert.equal(config.skin.hero_form, undefined);
	assert.equal(config.skin.other[1], "image/other.jpg");
	await store.apply("hero", null);
	assert.equal(config.skin.hero, undefined);
	assert.equal(config.skin.other[1], "image/other.jpg");
});

test("save rejection preserves in-memory selection and the queue recovers", async () => {
	let fail = true;
	const { store, config } = setup({
		save: async () => {
			if (fail) throw Error("disk full");
		},
	});
	config.skin.hero = ["old", "image/old.jpg"];
	await assert.rejects(store.apply("hero", null), /disk full/);
	assert.equal(config.skin.hero[1], "image/old.jpg");
	fail = false;
	await store.apply("hero", null);
	assert.equal(config.skin.hero, undefined);
});

test("a slow earlier request cannot overwrite a later reset", async () => {
	let release;
	const { store, config } = setup({
		exists: () =>
			new Promise(resolve => {
				release = resolve;
			}),
	});
	const pending = store.apply("hero", "image/skin/hero/春.新.webp");
	while (!release) await new Promise(resolve => setImmediate(resolve));
	await store.apply("hero", null);
	release(true);
	assert.equal(await pending, false);
	assert.equal(config.skin.hero, undefined);
});

test("concurrent saves for different characters retain both selections", async () => {
	const { store, config } = setup({
		save: async () => {
			await new Promise(resolve => setImmediate(resolve));
		},
	});
	await Promise.all([store.apply("a", "image/skin/hero/春.新.webp"), store.apply("b", "image/skin/hero/春.新.webp")]);
	assert.ok(config.skin.a);
	assert.ok(config.skin.b);
});

test("disabling skins cancels a pending apply without deleting saved preferences", async () => {
	let release;
	const { store, config, saves } = setup({
		exists: () =>
			new Promise(resolve => {
				release = resolve;
			}),
	});
	config.skin.hero = ["old", "image/old.jpg"];
	const pending = store.apply("hero", "image/skin/hero/春.新.webp");
	while (!release) await new Promise(resolve => setImmediate(resolve));
	config.change_skin = false;
	release(true);
	assert.equal(await pending, false);
	assert.equal(saves.length, 0);
	assert.equal(config.skin.hero[1], "image/old.jpg");
});

test("all built-in wardrobe entries reference existing core artwork", () => {
	for (const skins of Object.values(skinCatalog))
		for (const skin of skins) {
			assert.ok(existsSync(new URL(`../apps/core/${skin.path}`, import.meta.url)), skin.path);
		}
});

test("an unresponsive provider times out without blocking the available catalogue", async () => {
	const { store } = setup({ discoveryTimeout: 10, directory: () => null });
	store.register("hanging", () => new Promise(() => {}));
	store.register("available", () => [{ path: "image/a.jpg" }]);
	const result = await store.list("hero");
	assert.equal(result.unavailable, true);
	assert.equal(result.skins[0].path, "image/a.jpg");
});

test("guozhan storage aliases share current selection and reset the same preference", async () => {
	const { store, config } = setup({ characterKey: name => (name === "gz_hero" ? "hero" : name) });
	config.skin.hero = ["old", "image/old.jpg"];
	assert.equal(store.current("gz_hero"), "image/old.jpg");
	assert.ok((await store.list("gz_hero")).skins.some(skin => skin.path === "image/old.jpg"));
	await store.apply("gz_hero", null);
	assert.equal(store.current("gz_hero"), null);
	assert.equal(store.current("hero"), null);
});

test("automatic discovery excludes Spine texture atlases", async () => {
	const { store } = setup({ readDirectory: async () => ["animation.png", "animation.atlas", "other.PNG", "other.skel", "portrait.webp"] });
	assert.deepEqual(
		(await store.list("hero")).skins.map(skin => skin.name),
		["portrait"]
	);
});
