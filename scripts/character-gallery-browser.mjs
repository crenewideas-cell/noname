import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const { chromium } = createRequire(import.meta.url)("C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const installed = JSON.parse(await fs.readFile("apps/core/game/organized-extensions.json"));
const bundled = JSON.parse(await fs.readFile("apps/core/game/bundled-extensions.json"));
const provider = process.argv[2] || "builtin-rzsh";
const output = `output/character-gallery-${provider}`;
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1776, height: 900 } });
const report = { errors: [] };
page.on("pageerror", e => report.errors.push(e.message));
page.on("dialog", d => d.accept());
await page.route("**/*", r => { const u = new URL(r.request().url()); return u.hostname !== "127.0.0.1" || u.pathname.startsWith("/api/") ? r.abort() : r.continue(); });
await page.routeWebSocket("**", r => r.close());
await page.addInitScript(() => {
	sessionStorage.setItem("noname_0.9_return_to_lobby", "true");
	window.__uiApps = [];
	let pixi;
	Object.defineProperty(window, "PIXI", { configurable: true, get: () => pixi, set(value) {
		const App = value.Application;
		if (App && !App.__recorded) {
			const Recorded = class extends App { constructor(...args) { super(...args); window.__uiApps.push(this); } };
			Recorded.__recorded = true; value.Application = Recorded;
		}
		pixi = value;
	} });
});
await page.route("**/game/config.json", async r => {
	const response = await r.fetch(), config = await response.json();
	const enabled = ["笮融"];
	for (const name of [...installed.map(x => x.name), ...bundled]) config[`extension_${name}_enable`] = enabled.includes(name);
	Object.assign(config, { extensions: enabled, extension_auto_import: false, new_tutorial: true, version: "1.11.6", show_splash: "always", ui_workshop_active: provider, characters: ["standard"], cards: ["standard"], plays: [] });
	await r.fulfill({ response, json: config });
});
async function clickSprite(name) {
	const handle = await page.waitForFunction(name => {
		let result;
		function visit(n, app) {
			if (!n.worldVisible) return;
			if (n.name === name && n.interactive) {
				const r = n.getBounds(), b = app.view.getBoundingClientRect();
				result = { x: b.left + (r.x + r.width / 2) * b.width / app.screen.width, y: b.top + (r.y + r.height / 2) * b.height / app.screen.height };
			}
			n.children?.forEach(c => visit(c, app));
		}
		for (const app of window.__uiApps) if (app.renderer && app.stage && app.view.isConnected) visit(app.stage, app);
		return result;
	}, name, { timeout: 90000 });
	const point = await handle.jsonValue();
	await page.mouse.click(point.x, point.y);
}
try {
	await page.goto("http://127.0.0.1:5174", { waitUntil: "domcontentloaded" });
	if (provider === "builtin-shousha-standard") {
		await page.waitForSelector('iframe[src*="/html/rzsh.html"]', { timeout: 90000 });
		await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator("#offlinebutton").click();
	}
	await page.waitForSelector("#splash canvas", { timeout: 120000 });
	await page.waitForTimeout(6000);
	if (provider === "builtin-shousha-standard") await page.mouse.click(1518, 847);
	else await clickSprite("wujiangbutton");
	await page.locator(".lobby-character-manage").waitFor({ state: "visible", timeout: 60000 });
	report.metadata = await page.evaluate(async () => {
		const { lib, game, ui, get, createSceneContext } = await import("/noname.js");
		const before = JSON.stringify(lib.config.characters);
		const context = createSceneContext({ lib, game, ui, get }, { settingsKey: "audit_gallery" });
		context.refreshCharacters();
		const original = Object.keys(lib.imported.character.zerongPack.character);
		const other = Object.keys(lib.imported.character.huodongcharacter?.character || {});
		const combined = Object.keys(context.lib.imported.character.huodongcharacter.character);
		const result = { original, other: other.length, combined: combined.length, moved: original.every(id => combined.includes(id)), removed: !context.lib.imported.character.zerongPack, unchanged: before === JSON.stringify(lib.config.characters) && original.every(id => lib.characterPack.zerongPack[id]) };
		context.dispose(); return result;
	});
	assert.equal(report.metadata.original.length, 4);
	assert.equal(report.metadata.combined, report.metadata.other + 4);
	assert.ok(report.metadata.moved && report.metadata.removed && report.metadata.unchanged);
	report.categories = await page.evaluate(() => {
		const names = [], labels = [];
		function walk(n) { if (n.interactive && n.name) names.push(n.name); if (typeof n.text === "string") labels.push(n.text); n.children?.forEach(walk); }
		for (const app of window.__uiApps) if (app.stage && app.view.isConnected) walk(app.stage);
		return { names, other: labels.includes("其他武将"), zerong: labels.includes("笮融") };
	});
	assert.ok(report.categories.other);
	assert.equal(report.categories.zerong, false);
	assert.ok(!report.categories.names.includes("zerongPack"));
	assert.ok(report.categories.names.includes("huodongcharacter"));
	assert.equal(await page.locator('select[aria-label="将包分类"] option[value="zerongPack"]').count(), 0);
	await page.mouse.move(200, 650);
	for (let attempt = 0; attempt < 20; attempt++) {
		const targetY = await page.evaluate(() => {
			let y;
			function walk(n, app) { if (n.name === "huodongcharacter" && n.interactive) { const r = n.getBounds(), b = app.view.getBoundingClientRect(); y = b.top + (r.y + r.height / 2) * b.height / app.screen.height; } n.children?.forEach(c => walk(c, app)); }
			for (const app of window.__uiApps) if (app.stage && app.view.isConnected) walk(app.stage, app);
			return y;
		});
		if (targetY >= 490 && targetY <= 820) break;
		await page.mouse.wheel(0, Math.max(-800, Math.min(800, targetY - 650)));
		await page.waitForTimeout(250);
	}
	await clickSprite("huodongcharacter");
	const visible = await page.waitForFunction(() => {
		const ids = [];
		function walk(n) { if (n.worldVisible && n.pack === "huodongcharacter" && n.name?.startsWith("zerong_")) ids.push(n.name); n.children?.forEach(walk); }
		for (const app of window.__uiApps) if (app.stage && app.view.isConnected) walk(app.stage);
		return ids.length === 4 ? ids.sort() : false;
	}, null, { timeout: 15000 });
	report.visibleCharacters = await visible.jsonValue();
	assert.deepEqual(report.visibleCharacters, report.metadata.original.sort());
	await page.waitForTimeout(1200);
	await page.screenshot({ path: `${output}/gallery.png` });
	assert.deepEqual(report.errors, []);
	report.passed = true;
} catch (e) {
	report.failure = e.stack;
	await page.screenshot({ path: `${output}/failure.png`, timeout: 5000 }).catch(() => {});
	process.exitCode = 1;
} finally {
	await fs.writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
	console.log(JSON.stringify({ ...report, categories: report.categories && { other: report.categories.other, zerong: report.categories.zerong } }));
	await browser.close();
}
