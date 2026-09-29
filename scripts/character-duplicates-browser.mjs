import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const { chromium } = createRequire(import.meta.url)("C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const installed = JSON.parse(await fs.readFile("apps/core/game/organized-extensions.json"));
const bundled = JSON.parse(await fs.readFile("apps/core/game/bundled-extensions.json"));
const provider = process.argv[2] || "builtin-shousha-standard";
const output = `output/character-duplicates-${provider}`;
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1776, height: 900 } });
const report = { errors: [] };
page.on("pageerror", e => report.errors.push(e.message));
page.on("dialog", d => d.accept());
await page.route("**/*", r => {
	const u = new URL(r.request().url());
	return u.hostname !== "127.0.0.1" || u.pathname.startsWith("/api/") ? r.abort() : r.continue();
});
await page.routeWebSocket("**", r => r.close());
await page.addInitScript(() => {
	sessionStorage.setItem("noname_0.9_return_to_lobby", "true");
	window.__uiApps = [];
	let pixi;
	Object.defineProperty(window, "PIXI", {
		configurable: true,
		get: () => pixi,
		set(value) {
			const App = value.Application;
			if (App && !App.__recorded) {
				const Recorded = class extends App {
					constructor(...args) {
						super(...args);
						window.__uiApps.push(this);
					}
				};
				Recorded.__recorded = true;
				value.Application = Recorded;
			}
			pixi = value;
		},
	});
});
await page.route("**/game/config.json", async r => {
	const response = await r.fetch(),
		config = await response.json();
	const enabled = ["活动BOSS"];
	for (const name of [...installed.map(x => x.name), ...bundled]) config[`extension_${name}_enable`] = enabled.includes(name);
	Object.assign(config, { extensions: enabled, extension_auto_import: false, new_tutorial: true, version: "1.11.6", show_splash: "always", ui_workshop_active: provider, characters: ["standard"], cards: ["standard"], plays: [] });
	await r.fulfill({ response, json: config });
});
async function clickSprite(name) {
	const handle = await page.waitForFunction(
		name => {
			let result;
			function visit(n, app) {
				if (!n.worldVisible) return;
				if (n.name === name && n.interactive) {
					const r = n.getBounds(),
						b = app.view.getBoundingClientRect();
					result = { x: b.left + ((r.x + r.width / 2) * b.width) / app.screen.width, y: b.top + ((r.y + r.height / 2) * b.height) / app.screen.height };
				}
				n.children?.forEach(c => visit(c, app));
			}
			for (const app of window.__uiApps) if (app.renderer && app.stage && app.view.isConnected) visit(app.stage, app);
			return result;
		},
		name,
		{ timeout: 90000 }
	);
	const point = await handle.jsonValue();
	await page.mouse.click(point.x, point.y);
}
try {
	await page.goto("http://127.0.0.1:8081", { waitUntil: "domcontentloaded" });
	if (provider === "builtin-shousha-standard") {
		await page.waitForSelector('iframe[src*="/html/rzsh.html"]', { timeout: 90000 });
		await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator("#offlinebutton").click();
	}
	await page.waitForSelector("#splash canvas", { timeout: 120000 });
	await page.waitForTimeout(6000);
	if (provider === "builtin-shousha-standard") await page.mouse.click(1518, 847);
	else await clickSprite("wujiangbutton");
	await page.locator(".lobby-character-manage").waitFor({ state: "visible", timeout: 60000 });

	await page.evaluate(() => {
		function walk(n) {
			if (n.name === "search_btn" && n.interactive) n.emit("pointertap");
			n.children?.forEach(walk);
		}
		for (const app of window.__uiApps) if (app.stage && app.view.isConnected) walk(app.stage);
	});
	await page.locator('select[aria-label="将包分类"]').selectOption("BOSS_huodong");
	await page.locator('input[aria-label="搜索武将名称或技能"]').fill("^(草丛|狼|木隼|隼爪|隼翅)$");
	await page.locator('input[aria-label="搜索武将名称或技能"]').press("Enter");
	await page.waitForTimeout(1500);
	await page.mouse.click(900, 880);

	report.metadata = await page.evaluate(async () => {
		const { lib, game, ui, get, createSceneContext } = await import("/noname.js");
		const { loadCharacter } = await import("/noname/init/loading.ts");
		const pack = lib.imported.character.BOSS_huodong;
		lib.connectCharacterPack ||= [];
		loadCharacter(pack);
		const context = createSceneContext({ lib, game, ui, get }, { settingsKey: "audit_duplicates" });
		context.refreshCharacters();
		const gallery = context.lib.imported.character.BOSS_huodong.character;
		const cards = [];
		function walk(n) {
			if (n.pack === "BOSS_huodong" && n.name) cards.push(n.name);
			n.children?.forEach(walk);
		}
		for (const app of window.__uiApps) if (app.stage && app.view.isConnected) walk(app.stage);
		const groups = ["草丛", "狼", "木隼", "隼爪", "隼翅"].map(name => {
			const ids = Object.keys(pack.character).filter(id => pack.translate[id] === name);
			const visible = ids.filter(id => gallery[id] && !gallery[id].isUnseen && !gallery[id][4]?.includes("unseen"));
			return { name, ids, visible, cards: cards.filter(id => ids.includes(id)), skills: ids.map(id => ({ id, skills: lib.character[id]?.skills, hidden: lib.character[id]?.isUnseen })) };
		});
		const all = Object.keys(gallery).filter(id => !gallery[id].isUnseen && !gallery[id][4]?.includes("unseen"));
		const names = all.map(id => pack.translate[id]).filter(Boolean);
		context.dispose();
		// Exercise all public extension APIs with safe skills and a real player init.
		const oldExtension = (await import("/noname.js"))._status.extension;
		const status = (await import("/noname.js"))._status;
		status.extension = "audit_duplicate_api";
		const form = skill => ["male", "qun", 4, [skill], []];
		try {
			await game.import("character", { name: "audit_import", character: { audit_a: form("audit_s1"), audit_b: form("audit_s2") }, translate: { audit_a: "测试将", audit_b: "测试将" }, skill: { audit_s1: {}, audit_s2: {} } });
			loadCharacter(lib.imported.character.audit_import);
			game.addCharacterPack({ character: { audit_c: form("audit_s1"), audit_d: form("audit_s2") }, translate: { audit_c: "测试将", audit_d: "测试将" } }, "audit_add_pack");
			game.addCharacter("audit_e", { extension: "audit_duplicate_api", sex: "male", group: "qun", hp: 4, skills: ["audit_s1"], translate: "逐个添加" });
			game.addCharacter("audit_f", { extension: "audit_duplicate_api", sex: "male", group: "qun", hp: 4, skills: ["audit_s2"], translate: "逐个添加" });
		} finally {
			status.extension = oldExtension;
		}
		const api = ["audit_a", "audit_b", "audit_c", "audit_d", "audit_e", "audit_f"].map(id => ({ id, skills: lib.character[id]?.skills, hidden: lib.character[id]?.isUnseen }));
		const player = ui.create.player();
		player.init("audit_a");
		const playerSkills = player.getSkills();
		player.delete();
		const dialog = ui.create.characterDialog(id => !api.some(row => row.id === id), "expandall");
		const candidates = dialog.buttons.map(button => button.link);
		dialog.remove();
		return { groups, totalVisible: all.length, uniqueNames: new Set(names).size, namedVisible: names.length, api, playerSkills, candidates };
	});
	assert.equal(report.metadata.namedVisible, report.metadata.uniqueNames);
	for (const group of report.metadata.groups) {
		assert.equal(group.visible.length, 1, group.name);
		assert.deepEqual(group.cards, group.visible, group.name);
		const canonical = group.skills.find(row => row.id === group.visible[0]);
		assert.ok(canonical.skills.length);
		for (const row of group.skills) assert.deepEqual(row.skills, canonical.skills, row.id);
	}
	for (const row of report.metadata.api) assert.deepEqual(row.skills, ["audit_s1", "audit_s2"], row.id);
	assert.ok(report.metadata.playerSkills.includes("audit_s1") && report.metadata.playerSkills.includes("audit_s2"));
	assert.deepEqual(report.metadata.candidates.sort(), ["audit_a", "audit_c", "audit_e"]);
	await page.waitForTimeout(1500);
	await page.screenshot({ path: output + "/gallery.png" });
	assert.deepEqual(report.errors, []);
	report.passed = true;
} catch (e) {
	report.failure = e.stack;
	await page.screenshot({ path: `${output}/failure.png`, timeout: 5000 }).catch(() => {});
	process.exitCode = 1;
} finally {
	await fs.writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
	console.log(JSON.stringify({ passed: report.passed, failure: report.failure, errors: report.errors, metadata: report.metadata && { totalVisible: report.metadata.totalVisible, groups: report.metadata.groups.map(group => ({ name: group.name, visible: group.visible, versions: group.ids.length, skills: group.skills[0].skills.length })), candidates: report.metadata.candidates, playerSkills: report.metadata.playerSkills } }));
	await browser.close();
}
