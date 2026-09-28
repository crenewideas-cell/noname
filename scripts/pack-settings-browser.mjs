import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || "C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const origin = process.env.NONAME_UI_TEST_ORIGIN || "http://127.0.0.1:5174";
const installed = JSON.parse(await fs.readFile("apps/core/game/organized-extensions.json"));
const bundled = JSON.parse(await fs.readFile("apps/core/game/bundled-extensions.json"));
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const report = { checks: [], errors: [], dialogs: [] };
await fs.mkdir("output/pack-settings", { recursive: true });
page.on("pageerror", e => report.errors.push(String(e)));
page.on("dialog", async d => { if (!d.message().includes("GPLv3")) report.dialogs.push(d.message()); await d.accept(); });
await context.route("**/*", r => {
	const url = new URL(r.request().url());
	return url.hostname !== "127.0.0.1" || url.pathname.startsWith("/api/") ? r.abort() : r.continue();
});
await page.route("**/game/config.json", async r => {
	const response = await r.fetch(), config = await response.json();
	Object.assign(config, { extensions: ["笮融", "卡牌扩展"], extension_auto_import: false, new_tutorial: true, version: "1.11.6", show_splash: "always", mode: "identity", characters: ["standard"], cards: ["standard", "extra"], plays: [], ui_workshop_active: "", touchscreen: false });
	for (const name of [...installed.map(x => x.name), ...bundled]) config[`extension_${name}_enable`] = ["笮融", "卡牌扩展"].includes(name);
	await r.fulfill({ response, json: config });
});
const tab = name => page.evaluate(async name => (await import("/noname.js")).ui.click.menuTab(name), name);
const ready = () => page.waitForSelector("html.lobby-settings-page .main.menu", { timeout: 90000 });
const menu = page.locator("#window .menu-container:not(.hidden) > .main.menu");
const state = () => page.evaluate(async () => {
	const { lib } = await import("/noname.js");
	return { selected: lib.config.characters.includes("zerongPack"), playable: !!lib.character.zerong_base, owner: lib.characterPackExtension?.zerongPack, plays: lib.config.plays };
});
try {
	await page.goto(origin + "/?lobbySettings=characters", { waitUntil: "domcontentloaded" });
	await ready();
	assert.deepEqual(await state(), { selected: true, playable: true, owner: "笮融", plays: [] });
	const search = menu.getByRole("searchbox", { name: "搜索武将 / 武将包", exact: true });
	const filter = menu.getByRole("combobox", { name: "搜索武将 / 武将包：启用状态", exact: true });
	await search.fill("zerongPack");
	await filter.selectOption("enabled");
	const results = menu.locator(".pack-menu-search-results button");
	assert.equal(await results.count(), 1);
	await results.first().click();
	assert.equal(await menu.locator(".left.pane > .menubutton.active").textContent(), "PXLNGU");
	const pack = menu.locator('[data-pack-submenu="characters:PXLNGU:zerongPack"]');
	await pack.locator(".config.toggle").filter({ hasText: /^开启/ }).click();
	assert.equal((await state()).selected, false);
	assert.equal(await pack.locator(".config.toggle").filter({ hasText: /^开启/ }).evaluate(node => node.classList.contains("on")), false);
	assert.equal(await results.count(), 0);
	await filter.selectOption("disabled");
	assert.equal(await results.count(), 1);
	await page.screenshot({ path: "output/pack-settings/character-filter.png", animations: "disabled" });
	await page.reload({ waitUntil: "domcontentloaded" }); await ready();
	assert.equal((await state()).selected, false);
	assert.equal((await state()).playable, false);
	report.checks.push("笮融 merged into PXLNGU; new pack enabled; name+state filters refresh; disabled choice survives reload and removes playable characters");
	await menu.locator(".left.pane > .lefttext").filter({ hasText: /^全部开启$/ }).click();
	assert.equal((await state()).selected, true);
	await menu.locator(".left.pane > .lefttext").filter({ hasText: /^全部关闭$/ }).click();
	assert.equal((await state()).selected, false);
	await menu.locator(".left.pane > .lefttext").filter({ hasText: /^恢复默认$/ }).click();
	assert.equal((await state()).selected, false);
	report.checks.push("character bulk enable, disable and restore-default controls");
	await tab("扩展");
	await menu.locator('[data-extension-group="功能性扩展"]').click();
	const groupFilter = menu.getByRole("combobox", { name: "功能性扩展：启用状态", exact: true });
	await groupFilter.selectOption("disabled");
	const supplement = menu.locator('details[data-extension="cardpile"]');
	await supplement.locator("summary").click();
	await supplement.locator(".config.toggle").filter({ hasText: /^开启/ }).click();
	assert.equal(await supplement.isVisible(), false);
	await groupFilter.selectOption("enabled");
	assert.equal(await supplement.isVisible(), true);
	const extSearch = menu.getByRole("searchbox", { name: "搜索扩展 / 功能", exact: true });
	await extSearch.fill("牌堆补充");
	await menu.getByRole("combobox", { name: "搜索扩展 / 功能：启用状态", exact: true }).selectOption("enabled");
	assert.equal(await results.count(), 1);
	await results.first().click();
	assert.equal(await groupFilter.inputValue(), "all");
	await page.screenshot({ path: "output/pack-settings/extension-filter.png" });
	report.checks.push("extension global/group filters track native enabled state and navigation clears conflicting filters");
	await tab("卡牌");
	for (const [label, enabled] of [["全部开启", true], ["全部关闭", false]]) {
		await menu.locator(".left.pane > .lefttext").filter({ hasText: new RegExp(`^${label}$`) }).click();
		assert.equal(await page.evaluate(async () => (await import("/noname.js")).lib.config.cards.includes("standard")), enabled);
	}
	await menu.locator(".left.pane > .lefttext").filter({ hasText: /^恢复默认$/ }).click();
	await menu.locator(".left.pane > .menubutton").filter({ hasText: /^标准$/ }).click();
	await menu.locator(".right.pane .config.more.pile").click();
	await menu.locator(".right.pane button").filter({ hasText: /^添加卡牌$/ }).click();
	const addCard = menu.locator(".cardpilecfgadd");
	await addCard.locator("select").nth(0).selectOption("huosha");
	await addCard.locator("select").nth(1).selectOption("heart");
	await addCard.locator("select").nth(2).selectOption("7");
	await addCard.getByRole("button", { name: "确定", exact: true }).click();
	await addCard.getByRole("button", { name: "确定", exact: true }).click();
	assert.equal(await page.evaluate(async () => (await import("/noname.js")).lib.config.addedpile.standard.length), 2);
	await menu.locator(".right.pane .cardpiledelete").first().click();
	assert.equal(await page.evaluate(async () => (await import("/noname.js")).lib.config.addedpile.standard.length), 1);
	report.checks.push("card bulk switches, restoring defaults, adding duplicate elemental attacks and deleting exactly one copy");
	await page.evaluate(async () => {
		const { lib, game } = await import("/noname.js");
		await game.saveConfig("customcardpile", { "测试牌堆": [{ standard: [0, 1] }, { standard: [["heart", 7, "sha"]] }] });
		await game.saveConfig("cardpilename", "测试牌堆", "global");
	});
	await menu.locator(".left.pane > .menubutton").filter({ hasText: /^牌堆$/ }).click();
	await menu.locator(".cardpilecfg").filter({ hasText: /^测试牌堆删除$/ }).locator(".cardpiledelete").click();
	assert.equal(await page.evaluate(async () => (await import("/noname.js")).lib.config.mode_config.global.cardpilename), "默认牌堆");
	report.checks.push("deleting selected custom deck also clears the global selection");
	await page.reload({ waitUntil: "domcontentloaded" }); await ready();
	assert.ok((await state()).plays.includes("cardpile"));
	assert.deepEqual(report.dialogs, []);
	await page.evaluate(async () => {
		const { lib, game } = await import("/noname.js");
		await game.saveConfig("characters", ["standard"]);
		await game.saveConfig("cards", ["standard", "extra"]);
		await game.saveConfig("customcardpile", { "补充测试": [{}, { standard: Array.from({ length: 160 }, () => ["spade", 1, "wuzhong"]) }] });
		await game.saveConfig("cardpilename", "补充测试", "identity");
		await game.saveConfig("mode", "identity");
		localStorage.setItem(lib.configprefix + "directstart", "true");
	});
	await page.goto(origin, { waitUntil: "domcontentloaded" });
	for (let attempt = 0; attempt < 180; attempt++) {
		report.deck = await page.evaluate(async () => {
			const { lib, ui } = await import("/noname.js");
			if (!(ui.cardPile?.childElementCount > 320)) return null;
			return { list: lib.card.list.length, physical: ui.cardPile.childElementCount, sha: lib.card.list.filter(card => card[2] === "sha" && !card[3]).length, fire: lib.card.list.filter(card => card[3] === "fire").length };
		});
		if (report.deck) break;
		await page.waitForTimeout(500);
	}
	assert.ok(report.deck, "game constructs the supplemented physical deck");
	assert.ok(report.deck.sha >= Math.round(report.deck.list * 30 / 160) - 1);
	assert.ok(report.deck.fire >= Math.round(report.deck.list * 5 / 160) - 1);
	report.checks.push("native supplement boots without missing extension; real game creates supplemented physical deck with target sha/fire proportions");
	assert.deepEqual(report.errors, []);
	report.passed = true;
} catch (error) {
	report.failure = error.stack;
	await page.screenshot({ path: "output/pack-settings/failure.png" }).catch(() => {});
} finally {
	await fs.writeFile("output/pack-settings/report.json", JSON.stringify(report, null, 2));
	console.log(JSON.stringify(report));
	await browser.close();
}
if (!report.passed) process.exitCode = 1;
