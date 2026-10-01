// Isolated browser fixture: real cards, selection handlers, AI helper and controls.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const origin = process.env.NONAME_TEST_ORIGIN || "http://127.0.0.1:8081";

const out = "output/large-hand-regression";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage({ viewport: { width: 1188, height: 821 } });
const report = { errors: [] };
page.on("pageerror", error => report.errors.push(error.stack));
try {
    await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await page.route("**/__rzsh_handcards__", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><link rel="stylesheet" href="/layout/default/layout.css"><link rel="stylesheet" href="/layout/mobile/layout.css"><body></body>' }));
    await page.goto(origin + "/__rzsh_handcards__");
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
        game.layout = "mobile";
        ui.css = {}; ui.dialogs = []; ui.controls = [];
        ui.window = ui.create.div("#window", document.body);
        ui.window.addEventListener("click", ui.click.window);
        ui.arena = ui.create.div("#arena.mobile.oblongcard", ui.window);
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
        const characters = (await import('/character/standard/character.js')).default;
        lib.characterPack.standard = characters;
        game.me.name = game.me.name1 = 'diaochan';
        game.me.node.avatar.show(); game.me.node.avatar.setBackground('diaochan', 'character');
        game.me.node.name.textContent = '貂蝉';
        game.me.skills = ['hand_test_a', 'hand_test_b', 'hand_test_c'];
        for (const [key, text] of [['hand_test_a','铁甲'], ['hand_test_b','藏锋'], ['hand_test_c','奋发']]) {
            lib.skill[key] = {}; lib.translate[key] = text;
        }
        const { builtinPacks } = await import('/noname/ui/workshop/presets.js');
        const { mountPresentation } = await import('/extension/十周年局内UI/presentation.js');
        const manifest = builtinPacks().find(p => p.manifest.id === 'builtin-rzsh').manifest;
        await mountPresentation({ ...env, base: '/extension/十周年局内UI/', manifest, signal: new AbortController().signal });
        const { installCompactSeatLayout } = await import('/noname/ui/compactSeats.js');
        installCompactSeatLayout({ game, ui, mode: 'identity' });
        window.setupHand = (count, spread, selected, touch = false) => {
            lib.config.fold_card = true; lib.config.spread_card = spread; lib.config.touchscreen = touch;
            ui.selected.cards.length = 0;
            game.me.node.handcards1.replaceChildren();
            ui.handcards1Container.scrollLeft = 0;
            _status.event = new lib.element.GameEvent('fixture', false);
            for (let i = 0; i < count; i++) {
                const card = game.createCard2(['sha', 'shan', 'tao', 'bagua', 'wuzhong'][i % 5], 'heart', i % 13 + 1);
                card.dataset.testIndex = String(i);
                if (selected && i === 0) { card.classList.add('selected'); ui.selected.cards.push(card); }
                game.me.node.handcards1.append(card);
            }
            ui.updatehl();
        };
    });

    report.cases = [];
    await page.evaluate(() => {
        window.__cardVisits = 0;
        const original = __env.get.natureList;
        __env.get.natureList = function (...args) { window.__cardVisits++; return original.apply(this, args); };
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    for (const count of [20, 100, 300, 1000]) {
        await page.evaluate(count => setupHand(count, false, false), count);
        await page.waitForTimeout(700);
        await page.evaluate(() => window.__cardVisits = 0);
        await page.waitForTimeout(350);
        const idleVisits = await page.evaluate(() => window.__cardVisits);
        const before = await cdp.send('Performance.getMetrics');
        const layoutMs = await page.evaluate(() => {
            const start = performance.now();
            for (let i = 0; i < 5; i++) __env.ui.updatehl();
            return (performance.now() - start) / 5;
        });
        const after = await cdp.send('Performance.getMetrics');
        const metric = (data, name) => data.metrics.find(m => m.name === name).value;
        report.cases.push({count, idleVisits, layoutMs, layoutCount:metric(after,'LayoutCount')-metric(before,'LayoutCount'), styleCount:metric(after,'RecalcStyleCount')-metric(before,'RecalcStyleCount')});
    }
    console.log(JSON.stringify(report, null, 2));
} finally {
    await writeFile(out + '/report.json', JSON.stringify(report, null, 2));
    await browser.close();
}
