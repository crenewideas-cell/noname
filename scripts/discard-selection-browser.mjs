// Isolated browser fixture: real cards, selection handlers, AI helper and controls.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const origin = process.env.NONAME_TEST_ORIGIN || "http://127.0.0.1:8081";
const out = "output/discard-selection-regression";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage({ viewport: { width: 1188, height: 821 } });
const report = { errors: [] };
page.on("pageerror", error => report.errors.push(error.stack));
try {
    await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await page.route("**/__discard_regression__", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><link rel="stylesheet" href="/layout/default/layout.css"><link rel="stylesheet" href="/layout/newlayout/layout.css"><body></body>' }));
    await page.goto(origin + "/__discard_regression__");
    await page.evaluate(async () => {
        const env = window.__env = await import("/noname.js");
        const { lib, game, ui, get, ai, _status } = env;
        const config = (await import("/game/config.json")).default;
        await import("/noname/init/polyfill.ts");
        const { loadCard } = await import("/noname/init/loading.ts");
        const { CacheContext } = await import("/noname/library/cache/cacheContext.js");
        const { security, initializeSandboxRealms } = await import("/noname/util/sandbox.ts");
        lib.config = { ...structuredClone(config), mode: "identity", cards: ["standard"], touchscreen: false, auto_confirm: false, animation: false, background_audio: false, bannedpile: {}, addedpile: {} };
        lib.assetURL = "/";
        lib.configOL = { mode: "identity", banned: [], bannedcards: [] };
        Object.assign(lib, { get, game, ui, ai, connectCardPack: [] });
        CacheContext.setProxy({ lib, game, get });
        await initializeSandboxRealms(true);
        await security.initSecurity(env);
        game.layout = "newlayout";
        ui.css = {}; ui.dialogs = []; ui.controls = [];
        ui.window = ui.create.div("#window", document.body);
        ui.window.addEventListener("click", ui.click.window);
        ui.arena = ui.create.div("#arena", ui.window);
        ui.canvas = document.createElement("canvas");
        for (const name of ["cardPile", "discardPile", "ordering", "special", "control"]) ui[name] = ui.create.div("#" + name, ui.arena);
        ui.backgroundMusic = document.createElement("audio");
        await game.import("card", (await import("/card/standard.js")).default);
        for (const pack of Object.values(lib.imported.card)) loadCard(pack);
        game.finishCards();
        game.players = [ui.create.player(ui.arena)]; game.dead = []; game.me = game.players[0];
        game.me.playerid = "discard-test"; game.me.hp = game.me.maxHp = 10;
        game.me.dataset.position = "0";
        ui.create.me(true);
        window.setupDiscard = async (count, required = 7, forced = false) => {
            if (_status.event) game.uncheck();
            for (const control of [...ui.controls]) control.close();
            for (const dialog of [...ui.dialogs]) dialog.close();
            game.me.node.handcards1.replaceChildren();
            _status.event = new lib.element.GameEvent("fixture", false);
            const names = ["sha", "shan", ...Array.from({ length: count }, (_, i) => ["qilin", "bagua", "jueying", "chitu", "zhuge"][i % 5])];
            names.forEach((name, i) => {
                const card = game.createCard2(name, "heart", 5);
                card.dataset.testIndex = String(i);
                game.me.node.handcards1.append(card);
            });
            const event = game.me.chooseToDiscard("he", required, "弃置七张装备牌，或受到等量的伤害", { type: "equip" }, forced);
            event.ai = () => 1;
            window.__discardEvent = event;
            _status.event = event;
            await lib.element.content.chooseToDiscard[0](event, null, game.me);
            ui.updatehl();
        };
    });
    const state = () => page.evaluate(() => ({
        selected: __env.ui.selected.cards.length,
        confirm: __env.ui.confirm?.str || "",
        selectable: __env.game.me.getCards("h").map(c => c.classList.contains("selectable")),
        result: window.__discardEvent.result?.bool,
    }));
    await page.evaluate(() => setupDiscard(5));
    assert.deepEqual((await state()).selectable, [false, false, true, true, true, true, true]);
    await page.locator('[data-test-index="2"]').click({ position: { x: 10, y: 20 } });
    assert.equal((await state()).selected, 1);
    await page.locator('[data-test-index="2"]').click({ position: { x: 10, y: 20 } });
    assert.equal((await state()).selected, 0);
    await page.getByText("AI代选", { exact: true }).click();
    report.partial = await state();
    assert.equal(report.partial.selected, 5);
    assert.equal(report.partial.confirm, "c");
    await page.screenshot({ path: out + "/partial-selection.png" });
    await page.locator('.confirm-control [data-action="cancel"]').click();
    assert.equal((await state()).result, false);
    await page.evaluate(() => setupDiscard(7));
    for (let i = 2; i < 9; i++) await page.locator(`[data-test-index="${i}"]`).click({ position: { x: 10, y: 20 } });
    report.complete = await state();
    assert.equal(report.complete.selected, 7);
    assert.equal(report.complete.confirm, "oc");
    await page.screenshot({ path: out + "/complete-selection.png" });
    await page.locator('.confirm-control [data-action="confirm"]').click();
    assert.equal((await state()).result, true);
    assert.deepEqual(report.errors, []);
    console.log(JSON.stringify(report, null, 2));
} catch (error) {
    report.failure = error.stack;
    throw error;
} finally {
    await writeFile(out + "/report.json", JSON.stringify(report, null, 2));
    await browser.close();
}
