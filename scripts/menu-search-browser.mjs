import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.NONAME_PLAYWRIGHT_MODULE || "C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const origin = process.env.NONAME_UI_TEST_ORIGIN || "http://127.0.0.1:5174";
const output = "output/menu-search";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--enable-unsafe-swiftshader"] });
const reports = [];
try {
	for (const suite of process.argv.slice(2).length ? process.argv.slice(2) : ["native", "ink", "decade", "rzsh", "shousha"]) {
		const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } }),
			page = await context.newPage();
		const report = { suite, errors: [], checks: [] };
		reports.push(report);
		page.on("pageerror", e => report.errors.push(e.message));
		page.on("dialog", d => d.accept());
		await context.route("**/*", r => {
			const u = new URL(r.request().url());
			return u.hostname !== "127.0.0.1" || u.pathname.startsWith("/api/") || u.pathname.startsWith("/ws/") ? r.abort() : r.continue();
		});
		await context.addInitScript(() => {
			sessionStorage.setItem("noname_0.9_return_to_lobby", "true");
		});
		await page.route("**/game/config.json", async r => {
			const response = await r.fetch(),
				config = await response.json();
			Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: "1.11.6", show_splash: "always", mode: "identity", characters: ["standard"], cards: ["standard"], ui_workshop_active: { native: "", ink: "builtin-ink-gold", decade: "builtin-decade-ingame", rzsh: "builtin-rzsh", shousha: "builtin-shousha-standard" }[suite] });
			config.mode_config.identity = { ...config.mode_config.identity, player_number: "5", double_character: false };
			for (const k of Object.keys(config)) if (k.startsWith("extension_") && k.endsWith("_enable")) config[k] = false;
			await r.fulfill({ response, json: config });
		});
		try {
			await page.goto(origin, { waitUntil: "domcontentloaded" });
			if (suite === "shousha") {
				await page.waitForSelector('iframe[src*="/html/rzsh.html"]', { timeout: 90000 });
				await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator("#offlinebutton").click();
			}
			await page.waitForSelector(suite === "shousha" || suite === "rzsh" ? "#splash canvas" : "#splash", { timeout: 90000 });
			await page.waitForFunction(async () => !!(await import("/noname.js")).lib.uiWorkshop?.openSettings);
			await page.evaluate(async () => {
				const { openLobbyTools } = await import("/noname/ui/lobbyTools.js");
				openLobbyTools({ title: "大厅菜单", onOnline: () => {}, onOriginal: () => {} });
				await document.fonts.load("25px lobby-calligraphy");
			});
			await page.screenshot({ path: `${output}/${suite}-tools.png` });
			assert.equal(await page.getByRole("button", { name: "大厅设置", exact: true }).count(), 1);
			await page.evaluate(() => {
				const overlay = document.createElement("button");
				overlay.id = "bleed-fixture";
				overlay.textContent = "底层皮肤管理";
				overlay.style.cssText = "position:fixed;top:0;left:50%;z-index:999999;visibility:visible";
				document.body.append(overlay);
			});
			await page.getByRole("button", { name: "大厅设置", exact: true }).click();
			await page.waitForSelector("html.lobby-settings-page .main.menu", { timeout: 90000 });
			await page.evaluate(async () => {
				const { ui } = await import("/noname.js");
				ui.click.menuTab("开始");
			});
			await page.waitForTimeout(400);
			const menu = page.locator("#window .menu-container:not(.hidden) > .main.menu");

			const tab = async name => {
				await page.evaluate(async name => (await import("/noname.js")).ui.click.menuTab(name), name);
			};
			await tab("扩展");
			const search = menu.getByRole("searchbox", { name: "搜索扩展 / 功能", exact: true });
			assert.equal(await search.count(), 1);
			const names = await menu.locator(".left.pane > .menubutton").allTextContents();
			assert.equal(names.at(-1), "内置功能");
			for (const name of ["牌堆补充", "诸神降临", "富甲天下"]) assert.ok(!names.includes(name));
			await menu.locator('[data-extension-group="功能性扩展"]').click();
			const functional = menu.locator(".right.pane details[data-extension]");
			assert.deepEqual((await functional.evaluateAll(ns => ns.map(n => n.dataset.extension))).sort(), ["boss", "cardpile", "coin"]);
			const before = await page.evaluate(async () => (await import("/noname.js")).lib.config.plays.slice());
			await search.fill("富甲天下");
			const results = menu.locator(".pack-menu-search-results button");
			assert.equal(await results.count(), 1);
			await results.first().click();
			const coin = menu.locator('details[data-extension="coin"]');
			assert.ok(await coin.evaluate(n => n.open));
			const toggle = coin.locator(".config.toggle").first();
			await toggle.click();
			assert.equal(await page.evaluate(async () => (await import("/noname.js")).lib.config.plays.includes("coin")), !before.includes("coin"));
			await toggle.click();
			assert.deepEqual(await page.evaluate(async () => (await import("/noname.js")).lib.config.plays.slice()), before);
			await search.fill("千幻");
			await results.first().click();
			assert.ok(await menu.locator('details[data-extension="千幻聆音"]').evaluate(n => n.open));
			await search.fill("风云变幻");
			await results.first().click();
			assert.ok(await menu.locator('[data-pack-submenu="settings:extension_风云浮生明辉月:风云变幻"]').evaluate(n => n.open));
			await search.fill("名将杀");
			assert.ok((await results.count()) > 0);
			await results.first().click();
			assert.equal(await menu.locator(".left.pane > .menubutton.active").textContent(), "武将扩展包");
			assert.ok(await menu.locator('details[data-extension="名将杀"]').evaluate(n => n.open));
			await page.screenshot({ path: output + "/" + suite + "-extension-search.png" });
			await search.fill("not-an-extension-987654");
			assert.equal(await results.count(), 0);
			await search.fill("");
			assert.ok(await menu.locator(".pack-menu-search-results").evaluate(n => n.hidden));
			report.checks.push("functional group; final builtins; nested/direct extension search; existing toggle persistence; empty/no match");
			await tab("武将");
			const characters = menu.getByRole("searchbox", { name: "搜索武将 / 武将包", exact: true });
			await characters.fill("移动版");
			assert.ok((await results.count()) > 0);
			await results.first().click();
			await page.waitForTimeout(300);
			const portraits = menu.locator(".right.pane .button.character");
			assert.ok((await portraits.count()) > 0);
			const portraitStyles = await portraits.evaluateAll(ns =>
				ns.slice(0, 3).map(n => {
					const s = getComputedStyle(n);
					return { origin: s.backgroundOrigin, repeat: s.backgroundRepeat, clip: s.backgroundClip, border: s.border, width: s.width, height: s.height };
				})
			);
			for (const css of portraitStyles) {
				assert.equal(css.origin, "border-box");
				assert.equal(css.repeat, "no-repeat");
				assert.equal(css.clip, "border-box");
			}
			await page.screenshot({ path: output + "/" + suite + "-portraits.png" });
			await characters.fill("曹操");
			assert.ok((await results.count()) > 0);
			await characters.press("Enter");
			await characters.fill("不应存在的武将987654");
			assert.equal(await results.count(), 0);
			await characters.fill("standard");
			await results.first().click();
			assert.equal(await menu.locator(".left.pane > .menubutton.active").textContent(), "基础");
			await page.setViewportSize({ width: 960, height: 540 });
			await characters.fill("曹操");
			const rect = await characters.boundingBox();
			assert.ok(rect.x >= 0 && rect.x + rect.width <= 960);
			await page.screenshot({ path: output + "/" + suite + "-compact.png" });
			report.checks.push("character/pack name and ID queries; Enter navigation; portrait border fill; narrow viewport");
			if (suite === "native") {
				await page.evaluate(async () => (await import("/extension/华夏风云/main/config.js")).default.loadPz.onclick());
				await page.waitForSelector(".editor2 .cm-editor");
				assert.match(await page.locator(".editor2 .cm-content").textContent(), /_status.extension_config/);
				report.checks.push("华夏风云 uses the shared supported editor");
			}
			assert.deepEqual(report.errors, []);
		} catch (error) {
			report.failure = error.stack;
			await page.screenshot({ path: output + "/" + suite + "-failure.png" }).catch(() => {});
			throw error;
		} finally {
			await fs.writeFile(output + "/report.json", JSON.stringify(reports, null, 2));
			await context.close();
		}
		console.log(suite + ": " + report.checks.join("; "));
	}
} finally {
	await browser.close();
}
