import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || "C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const { PNG } = createRequire(import.meta.url)("C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs");
const installed = JSON.parse(await fs.readFile("apps/core/game/organized-extensions.json"));
const bundled = JSON.parse(await fs.readFile("apps/core/game/bundled-extensions.json"));
const enabled = process.argv.slice(2).length ? process.argv.slice(2) : ["华夏风云", "极略", "名将杀", "笮融", "手杀新赵襄", "新诸葛果", "觉醒突破", "分支武将"];
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await context.newPage();
const report = { errors: [], dialogs: [], packs: [] };
await fs.mkdir("output/extension-character-audit", { recursive: true });
page.on("pageerror", e => report.errors.push(e.stack));
page.on("dialog", async d => { if (!d.message().includes("GPLv3")) report.dialogs.push(d.message()); await d.accept(); });
await page.route("**/api/**", r => r.abort());
await page.routeWebSocket("**", r => r.close());
await page.route("**/game/config.json", async r => {
	const response = await r.fetch(), config = await response.json();
	Object.assign(config, { extensions: enabled, extension_auto_import: false, new_tutorial: true, version: "1.11.6", show_splash: "always", mode: "identity", characters: ["standard"], cards: ["standard"], plays: [], ui_workshop_active: process.env.AUDIT_PROVIDER || "" });
	for (const name of [...installed.map(x => x.name), ...bundled]) config[`extension_${name}_enable`] = false;
	await r.fulfill({ response, json: config });
});
try {
	await page.goto((process.env.NONAME_UI_TEST_ORIGIN || "http://127.0.0.1:5174") + "/?lobbySettings=extensions", { waitUntil: "domcontentloaded" });
	await page.waitForSelector("html.lobby-settings-page .main.menu", { timeout: 120000 });
	await page.evaluate(async () => { window.auditDocument = {}; (await import("/noname.js")).ui.click.menuTab("武将"); });
	let failImport = true;
	await page.route(/runtime=/, route => failImport ? route.abort() : route.continue());
	for (const name of enabled) {
		await page.evaluate(async name => (await import("/noname.js")).ui.click.extensionTab(name), name);
		const group = page.locator(`.menu-container:not(.hidden) details[data-extension="${name}"]`);
		await group.locator('.config.toggle').filter({ hasText: /^开启/ }).first().click();
		await group.locator('[aria-busy="true"]').waitFor({ state: "detached", timeout: 60000 });
		if (failImport) {
			assert.match((await group.locator('.extension-loading-status').allTextContents()).join(''), /加载失败/);
			assert.equal(await group.locator('.config.toggle').first().evaluate(n => n.classList.contains('on')), false);
			failImport = false;
			await group.locator('.config.toggle').filter({ hasText: /^开启/ }).first().click();
			await group.locator('[aria-busy="true"]').waitFor({ state: "detached", timeout: 60000 });
			report.importFailureRetry = true;
		}
		assert.equal(await group.locator('.extension-loading-status').count(), 0, await group.locator('.extension-loading-status').allTextContents());
		await group.locator('.button.character').first().waitFor({ state: "attached", timeout: 30000 });
		console.log(`Live enabled: ${name}`);
	}
	assert.equal(await page.evaluate(() => !!window.auditDocument), true);
	report.liveEnabledWithoutReload = true;
	report.registration = await page.evaluate(async names => {
		const { lib } = await import("/noname.js");
		const { extensionCharacterPacks } = await import("/noname/ui/create/menu/extensionGroups.ts");
		return names.map(name => ({ name, ownerPacks: Object.entries(lib.characterPackExtension || {}).filter(([, owner]) => owner === name).map(([id]) => [id, Object.keys(lib.characterPack[id] || {}).length]), resolved: extensionCharacterPacks(name, lib).map(p => ({ id: p.mode, count: p.characters.length })) }));
	}, enabled);
	for (const name of enabled) {
		await page.evaluate(async name => (await import("/noname.js")).ui.click.extensionTab(name), name);
		await page.waitForTimeout(600);
		const group = page.locator(`.menu-container:not(.hidden) details[data-extension="${name}"]`);
		const result = await group.evaluate(n => ({ name: n.dataset.extension, count: n.querySelectorAll(".button.character").length, pending: n.querySelectorAll(".prebutton-pending").length, packs: [...n.querySelectorAll("[data-character-pack]")].map(p => ({ id: p.dataset.characterPack, count: p.querySelectorAll(".button.character").length })) }));
		report.packs.push(result);
		const expected = await page.evaluate(async name => {
			const { lib } = await import("/noname.js");
			const { extensionCharacterPacks } = await import("/noname/ui/create/menu/extensionGroups.ts");
			return extensionCharacterPacks(name, lib).flatMap(p => p.characters.filter(id => !lib.characterPack[p.mode][id].isUnseen)).sort();
		}, name);
		assert.deepEqual(await group.locator('.button.character').evaluateAll(nodes => nodes.map(n => n.link).sort()), expected);
		await page.evaluate(async name => (await import("/noname.js")).ui.click.extensionTab(name), name);
		assert.equal(await group.locator('.button.character').count(), expected.length);
		if (name === "华夏风云") {
			await group.locator('.button.character').first().scrollIntoViewIfNeeded();
			report.portrait = await group.locator('.button.character').first().evaluate(n => {
				const read = s => Object.fromEntries(['width','height','boxSizing','border','borderImageSource','backgroundImage','backgroundOrigin','backgroundClip','backgroundRepeat','backgroundSize','borderRadius','left','top','boxShadow','opacity'].map(k => [k,s[k]]));
				return { class: n.className, style: n.style.cssText, computed: read(getComputedStyle(n)), before: read(getComputedStyle(n,'::before')), after: read(getComputedStyle(n,'::after')) };
			});
			await group.locator('.button.character').first().screenshot({ path: "output/extension-character-audit/portrait.png" });
			assert.equal(report.portrait.computed.borderImageSource, 'none');
			assert.equal(report.portrait.computed.backgroundOrigin, 'border-box');
			assert.equal(report.portrait.computed.backgroundRepeat, 'no-repeat');
			report.portraitCorners = [];
			for (const index of [1, 2, 3]) {
				const portrait = group.locator('.button.character').nth(index);
				await portrait.scrollIntoViewIfNeeded();
				assert.equal(await portrait.evaluate(n => new Promise(resolve => { const image = new Image(); image.onload = () => resolve(true); image.onerror = () => resolve(false); image.src = getComputedStyle(n).backgroundImage.slice(5, -2); })), true);
				const png = PNG.sync.read(await portrait.screenshot({ path: `output/extension-character-audit/portrait-${index}.png` }));
				const corners = [[0,0],[png.width-1,0],[0,png.height-1],[png.width-1,png.height-1]].map(([x,y]) => [...png.data.subarray((y*png.width+x)*4,(y*png.width+x)*4+3)]);
				assert.ok(corners.every(rgb => Math.min(...rgb) > 60), JSON.stringify(corners));
				report.portraitCorners.push(corners);
			}
			await page.screenshot({ path: "output/extension-character-audit/hxfy.png", animations: "disabled" });
		}
	}
	if (enabled.includes("华夏风云")) {
		const menu = page.locator('.menu-container:not(.hidden) > .main.menu');
		const openHeroPack = async () => {
			await page.evaluate(async () => (await import('/noname.js')).ui.click.menuTab('武将'));
			await menu.getByRole('searchbox', { name: '搜索武将 / 武将包', exact: true }).fill('yxscq');
			await menu.locator('.pack-menu-search-results button').first().click();
		};
		await openHeroPack();
		assert.equal(await menu.locator('.right.pane .button.character').count(), 374);
		await page.evaluate(async () => {
			const { lib, ui } = await import('/noname.js');
			lib.characterPack.yxscq.caocao = lib.characterPack.standard.caocao;
			for (const update of ui.updateCharacterPackMenu) update('yxscq');
		});
		assert.equal(await menu.locator('.right.pane .button.character').count(), 375);
		await page.evaluate(async () => {
			const { lib, ui } = await import('/noname.js');
			delete lib.characterPack.yxscq.caocao;
			for (const update of ui.updateCharacterPackMenu) update('yxscq');
		});
		assert.equal(await menu.locator('.right.pane .button.character').count(), 374);
		report.existingCharacterPackRefresh = true;
		await page.evaluate(async () => {
			const { lib } = await import('/noname.js');
			window.auditSkills = Object.fromEntries(Object.entries(lib.skill));
			window.auditExtensionCount = lib.extensions.length;
		});
		const toggleHero = async () => {
			await page.evaluate(async () => (await import('/noname.js')).ui.click.extensionTab('华夏风云'));
			const group = menu.locator('details[data-extension="华夏风云"]');
			await group.locator('.config.toggle').filter({ hasText: /^开启/ }).first().click();
			await group.locator('[aria-busy="true"]').waitFor({ state: 'detached' });
		};
		await toggleHero();
		assert.equal(await page.evaluate(async () => { const { lib } = await import('/noname.js'); return Object.keys(lib.characterPack.yxscq).some(id => !!lib.character[id]); }), false);
		await openHeroPack();
		assert.equal(await menu.locator('.right.pane .config.toggle').filter({ hasText: /^开启/ }).first().evaluate(n => n.classList.contains('on')), false);
		await toggleHero();
		await openHeroPack();
		assert.equal(await menu.locator('.right.pane .config.toggle').filter({ hasText: /^开启/ }).first().evaluate(n => n.classList.contains('on')), true);
		assert.equal(await page.evaluate(async () => { const { lib } = await import('/noname.js'); return lib.extensions.length === window.auditExtensionCount && Object.entries(window.auditSkills).every(([id, skill]) => lib.skill[id] === skill); }), true);
		await menu.locator('.right.pane .config.toggle').filter({ hasText: /^开启/ }).first().click();
		await toggleHero(); await toggleHero();
		await openHeroPack();
		assert.equal(await menu.locator('.right.pane .config.toggle').filter({ hasText: /^开启/ }).first().evaluate(n => n.classList.contains('on')), false);
		assert.equal(await page.evaluate(() => !!window.auditDocument), true);
		report.liveCharacterMenuAndPreservedChoices = true;
		await page.evaluate(async () => {
			const { lib, ui } = await import("/noname.js");
			ui.click.extensionTab("华夏风云");
			lib.characterPackExtension.audit_late = "华夏风云";
			lib.characterPack.audit_late = { caocao: lib.characterPack.standard.caocao };
		});
		const late = page.locator('details[data-extension="华夏风云"] [data-character-pack="audit_late"] .button.character');
		await late.waitFor({ state: "attached" });
		assert.equal(await late.count(), 1);
		await page.evaluate(async () => {
			const { lib, ui } = await import("/noname.js");
			delete lib.characterPack.audit_late;
			delete lib.characterPackExtension.audit_late;
			ui.click.extensionTab("华夏风云");
		});
		assert.equal(await late.count(), 0);
		report.lateRegistrationAndReopen = true;
	}
} catch (error) {
	report.failure = error.stack;
	report.loading = await page.locator('.extension-loading-status').allTextContents();
	await page.screenshot({ path: "output/extension-character-audit/failure.png" }).catch(() => {});
} finally {
	await fs.writeFile("output/extension-character-audit/report.json", JSON.stringify(report, null, 2));
	console.log(JSON.stringify(report));
	await browser.close();
}
if (report.failure || report.errors.length || report.packs.some(p => !p.count)) process.exitCode = 1;
