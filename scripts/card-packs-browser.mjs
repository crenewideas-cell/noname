import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const { chromium } = createRequire(import.meta.url)("C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = process.env.NONAME_CARD_TEST_ORIGIN || "http://127.0.0.1:5174";
const manifest = JSON.parse(await fs.readFile("apps/core/extension/collections/卡牌扩展/manifest.json"));
const installed = JSON.parse(await fs.readFile("apps/core/game/organized-extensions.json"));
const bundled = JSON.parse(await fs.readFile("apps/core/game/bundled-extensions.json"));
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const report = { errors: [], dialogs: [], checks: [] };
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } }),
	page = await context.newPage();
page.on("pageerror", e => report.errors.push(e.stack || String(e)));
page.on("dialog", async d => {
	if (!d.message().includes("GPLv3")) report.dialogs.push(d.message());
	await d.accept();
});
await page.route("**/game/config.json", async r => {
	const response = await r.fetch(),
		config = await response.json();
	Object.assign(config, { extensions: ["卡牌扩展"], extension_auto_import: false, new_tutorial: true, version: "1.11.6", show_splash: "always", mode: "identity", characters: ["standard"], cards: ["standard"], ui_workshop_active: "" });
	for (const name of [...installed.map(x => x.name), ...bundled]) config["extension_" + name + "_enable"] = name === "卡牌扩展";
	await r.fulfill({ response, json: config });
});
await page.route("**/api/**", r => r.abort());
await page.routeWebSocket("**", r => r.close());
try {
	await page.goto(base + "/?lobbySettings=cards", { waitUntil: "domcontentloaded" });
	await page.waitForSelector("html.lobby-settings-page .main.menu", { timeout: 90000 });
	report.boot = await page.evaluate(async () => {
		const { lib } = await import("/noname.js");
		return {
			packs: Object.keys(lib.cardPackInfo).filter(x => x.startsWith("import_")).length,
			deck: lib.card.list.length,
			active: lib.config.cards,
			missing: Object.values(lib.cardPack)
				.flat()
				.filter(x => !lib.card[x]),
		};
	});
	await page.screenshot({ path: "output/card-packs-menu.png" });
	const target = manifest.members.find(x => x.name === "辅助卡牌");
	report.menu = await page.evaluate(async id => {
		const { lib, ui } = await import("/noname.js");
		ui.click.menuTab("卡牌");
		const node = [...document.querySelectorAll(".menubutton")].find(n => n.mode === id);
		if (!node) throw Error("card pack menu missing " + id);
		node.click();
		return { title: node.textContent, off: node.classList.contains("off"), options: node.link?.textContent.slice(0, 250) };
	}, target.id);
	const node = page.locator(".menu-container:not(.hidden) .config.toggle").filter({ hasText: /^开启/ }).first();
	await node.click();
	assert.equal(await page.evaluate(async id => (await import("/noname.js")).lib.config.cards.includes(id), target.id), true);
	report.checks.push("real card menu toggles shared cards config");
	await page.reload({ waitUntil: "domcontentloaded" });
	await page.waitForSelector("html.lobby-settings-page .main.menu", { timeout: 90000 });
	report.enabled = await page.evaluate(async id => {
		const { lib } = await import("/noname.js");
		return { enabled: lib.config.cards.includes(id), count: lib.card.list.filter(x => ["duji888881", "W_miji", "huixue88888881", "xr_zhan", "xr_xiantao"].includes(x[2])).length };
	}, target.id);
	assert.equal(report.enabled.enabled, true);
	assert.equal(report.enabled.count, 23);
	report.checks.push("restart preserves enabled pack and inserts configured 23 cards");
	report.cards = await page.evaluate(async () => {
		const { lib, game } = await import("/noname.js");
		const results = [];
		for (const name of ["W_miji", "duji888881", "zhen_baodiaogong"]) {
			if (!lib.card[name]) continue;
			const card = game.createCard(name);
			results.push({ name, image: card.node.image.style.backgroundImage });
			card.remove();
		}
		return results;
	});
	report.compilation = await page.evaluate(async members => {
		const { lib, game, ui, get, ai, _status } = await import("/noname.js");
		const { createCardPackBuilder } = await import("/noname/init/cardPackRuntime.js");
		const { default: compiler } = await import("/noname/library/element/GameEvent/compilers/ContentCompiler.ts");
		let count = 0;
		const errors = [];
		for (const member of members) {
			const { default: create } = await import("/extension/" + encodeURIComponent("卡牌扩展") + "/members/" + member.id + "/data.js");
			const data = create(lib, game, ui, get, ai, _status);
			const builder = createCardPackBuilder(lib);
			const options = Object.fromEntries(Object.entries(data.config).map(([key, option]) => [key, typeof option.init === "boolean" ? true : option.init]));
			data.build(options, builder);
			const walk = (value, path) => {
				if (!value || typeof value !== "object") return;
				for (const [key, item] of Object.entries(value)) {
					if (typeof item === "function" && ["content", "contentBefore", "contentAfter"].includes(key)) {
						try {
							compiler.compile(item);
							count++;
						} catch (e) {
							errors.push(member.name + "/" + path + "/" + key + ": " + e.message);
						}
					} else if (key === "subSkill") for (const [sub, skill] of Object.entries(item)) walk(skill, path + "/" + sub);
				}
			};
			for (const section of ["card", "skill"]) for (const [key, value] of Object.entries(builder[section])) walk(value, section + "/" + key);
		}
		return { count, errors };
	}, manifest.members);
	assert.deepEqual(report.compilation.errors, []);
	report.checks.push("all imported event contents compile with the real engine");
	assert.deepEqual(report.errors, []);
	assert.deepEqual(report.dialogs, []);
	report.passed = true;
} catch (e) {
	report.failure = String(e);
	await page.screenshot({ path: "output/card-packs-failure.png" });
} finally {
	await fs.writeFile("output/card-packs-browser.json", JSON.stringify(report, null, 2));
	console.log(JSON.stringify(report));
	await browser.close();
}
if (!report.passed) process.exitCode = 1;
