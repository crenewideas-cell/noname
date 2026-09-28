// Isolated browser fixture: real cards, selection handlers, AI helper and controls.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const origin = process.env.NONAME_TEST_ORIGIN || "http://127.0.0.1:8081";
const edgeOnly = process.argv.includes('--edges-only');
const out = "output/rzsh-handcards-regression" + (edgeOnly ? '/edges' : '');
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
    for (const [width, height, zoom] of (edgeOnly ? [] : [[1920, 1080, 1], [1708, 900, 1], [1366, 768, 1], [900, 650, 1], [1280, 800, .8]])) {
        await page.setViewportSize({ width, height });
        await page.evaluate(zoom => __env.ui.window.style.zoom = String(zoom), zoom);
        for (const count of [1, 4, 10, 20, 50]) {
            for (const [spread, selected, touch] of [[false, false, false], [true, true, false], [true, false, true]]) {
                await page.mouse.move(0, 0);
                await page.evaluate(args => setupHand(...args), [count, spread, selected, touch]);
                await page.waitForTimeout(600);
                const geometry = await page.evaluate(() => {
                    const { ui } = __env, r = n => n.getBoundingClientRect().toJSON();
                    const arena = r(ui.arena), hand = r(ui.handcards1Container), scale = arena.width / ui.arena.clientWidth;
                    return { arena, hand, expectedRight: arena.right - parseFloat(ui.arena.style.getPropertyValue('--table-hand-right')) * scale,
                        cards: [...ui.handcards1.children].map(r), scroll: ui.handcards1Container.classList.contains('scrollh') };
                });
                assert(Math.abs(geometry.hand.right - geometry.expectedRight) < 2, 'hand must fill the safe width: ' + JSON.stringify(geometry));
                if (!geometry.scroll) assert(geometry.cards.at(-1).right <= geometry.hand.right + 1, 'last card is clipped');
                // Visit every card from right to left so a raised neighbour cannot cover its hit strip.
                for (let index = count - 1; index >= 0; index--) {
                    await page.mouse.move(0, 0);
                    const point = await page.evaluate(index => {
                        const { ui } = __env, card = ui.handcards1.children[index], container = ui.handcards1Container;
                        container.scrollLeft = Math.max(0, parseFloat(card.style.transform.match(/translateX\(([-\d.]+)/)[1]) - 8);
                        const r = card.getBoundingClientRect(); return { x: r.left + Math.min(5, r.width / 4), y: r.top + r.height / 2 };
                    }, index);
                    await page.mouse.move(point.x, point.y);
                    await page.waitForTimeout(20);
                    const visible = await page.evaluate(index => {
                        const { ui } = __env, card = ui.handcards1.children[index], r = card.getBoundingClientRect(), h = ui.handcards1Container.getBoundingClientRect();
                        const points = [[3,3],[r.width-3,3],[3,r.height-3],[r.width-3,r.height-3],[r.width/2,r.height/2]];
                        return { hover: card.matches(':hover'), inside: r.left >= h.left - 1 && r.right <= h.right + 1 && r.top >= h.top - 1 && r.bottom <= h.bottom + 1,
                            uncovered: points.every(([x,y]) => document.elementFromPoint(r.left+x,r.top+y)?.closest('.card') === card), opacity: getComputedStyle(card).opacity };
                    }, index);
                    assert(visible.hover && visible.inside && visible.uncovered && visible.opacity === '1', JSON.stringify({width,height,count,index,spread,selected,touch,visible}));
                }
                report.cases.push({ width, height, zoom, count, spread, selected, touch, hand: geometry.hand, scroll: geometry.scroll });
                if (width === 1708 && count === 20 && selected) await page.screenshot({ path: out + '/hover-20-cards.png' });
            }
        }
    }
    report.edges = [];
    await page.setViewportSize({ width: 1708, height: 900 });
    await page.evaluate(() => { __env.ui.window.style.zoom = '1'; setupHand(50, false, true); });
    await page.waitForTimeout(700);
    for (const side of ['right', 'left']) {
        await page.mouse.move(0, 0);
        const point = await page.evaluate(side => {
            const { ui } = __env, container = ui.handcards1Container, card = ui.handcards1.children[side === 'right' ? 35 : 20];
            const x = parseFloat(card.style.transform.match(/translateX\(([-\d.]+)/)[1]);
            container.scrollLeft = side === 'right' ? x - container.clientWidth + 12 : x + 12;
            const h = container.getBoundingClientRect(), r = card.getBoundingClientRect();
            return { x: side === 'right' ? h.right - 4 : h.left + 4, y: r.top + r.height / 2 };
        }, side);
        await page.mouse.move(point.x, point.y);
        await page.waitForTimeout(100);
        const state = await page.evaluate(side => {
            const { ui, game } = __env, card = ui.handcards1.children[side === 'right' ? 35 : 20], r = card.getBoundingClientRect(), h = ui.handcards1Container.getBoundingClientRect();
            const panel = game.me.querySelector('.decade-passive-skills');
            return { hover: card.matches(':hover'), inside: r.left >= h.left - 1 && r.right <= h.right + 1,
                uncovered: document.elementFromPoint(r.right - 3, r.top + r.height / 2)?.closest('.card') === card,
                safe: h.right < game.me.getBoundingClientRect().left && !!panel && h.right < panel.getBoundingClientRect().left };
        }, side);
        assert(state.hover && state.inside && state.uncovered && state.safe, JSON.stringify({ side, state }));
        report.edges.push({ side, ...state });
    }
    await page.screenshot({ path: out + '/scroll-edge-hover.png' });
    assert.deepEqual(report.errors, []);
    console.log(JSON.stringify({ cases: report.cases.length, edges: report.edges, errors: report.errors }));
} catch (error) {
    report.failure = error.stack;
    await page.screenshot({ path: out + '/failure.png' });
    throw error;
} finally {
    await writeFile(out + '/report.json', JSON.stringify(report, null, 2));
    await browser.close();
}



