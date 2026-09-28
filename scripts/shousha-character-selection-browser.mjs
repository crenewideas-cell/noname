// Real identity-mode choices in an isolated save; no replacement event handlers.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const output = 'output/shousha-character-selection';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = { errors: [], cases: [] };
try {
 for (const freeChoice of [false, true]) {
  const context = await browser.newContext({ viewport: { width: 1774, height: 747 } });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  await context.addInitScript(() => sessionStorage.setItem('noname_0.9_disable_extension', 'true'));
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await page.routeWebSocket('**', () => {});
  await page.route('**/game/config.json*', async route => {
   const response = await route.fetch(), config = await response.json();
   Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'off', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: 'builtin-shousha-standard', auto_confirm: true });
   config.mode_config.identity = { ...config.mode_config.identity, player_number: '4', double_character: false, change_choice: true, free_choose: true, change_card: 'disabled' };
   for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
   await route.fulfill({ response, json: config });
  });
  try {
   await page.goto(origin, { waitUntil: 'domcontentloaded' });
   await page.waitForSelector('#arena .button.character.selectable', { timeout: 90000 });
   await page.waitForFunction(() => document.body.dataset.shoushaParts?.includes('players'));
   await page.locator('#extension-recovery').evaluateAll(nodes => nodes.forEach(n => n.open = false));
   const controls = page.locator('#control .control > div');
   await controls.filter({ hasText: /^更换$/ }).click();
   if (freeChoice) {
    await controls.filter({ hasText: /^自由选将$/ }).click();
    await page.waitForSelector('#arena .character-browser');
   }
   const entry = { freeChoice, sizes: [] };
   report.cases.push(entry);
   for (const [width, height] of [[1774,747], [1440,810], [960,540], [844,480]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(1200);
    const candidate = page.locator('#arena .dialog:not(.hidden) .button.character.selectable').first();
    await candidate.scrollIntoViewIfNeeded();
    const state = await candidate.evaluate(node => {
     const rect = node.getBoundingClientRect(), dialog = node.closest('.dialog'), content = dialog.querySelector('.content-container');
     return { rect: rect.toJSON(), dialog: dialog.getBoundingClientRect().toJSON(), content: content.getBoundingClientRect().toJSON(), art: getComputedStyle(node).backgroundImage, hit: document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest('.button.character') === node };
    });
    assert.ok(state.content.height >= state.rect.height, 'selection panel must have enough height for a candidate');
    assert.ok(state.rect.top >= 0 && state.rect.bottom <= height && state.hit, 'candidate is visible, unclipped and receives pointer input');
    assert.notEqual(state.art, 'none');
    assert.ok(await candidate.evaluate(async node => {
     const url = getComputedStyle(node).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
     if (!url) return false;
     const image = new Image(); image.src = url;
     try { await image.decode(); return image.naturalWidth > 0; } catch { return false; }
    }), 'character portrait actually loads');
    entry.sizes.push({ width, height, ...state });
    await page.screenshot({ path: `${output}/${freeChoice ? 'free' : 'normal'}-${width}x${height}.png` });
    const last = page.locator('#arena .dialog:not(.hidden) .button.character.selectable').last();
    await last.scrollIntoViewIfNeeded();
    assert.ok(await last.evaluate(node => {
     const r = node.getBoundingClientRect();
     return r.top >= 0 && r.bottom <= innerHeight && document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('.button.character') === node;
    }), 'scrolling reaches the last candidate as well as the first');
    await candidate.scrollIntoViewIfNeeded();
   }
   await page.setViewportSize({ width: 1774, height: 747 });
   await page.waitForTimeout(1200);
   const selected = page.locator('#arena .dialog:not(.hidden) .button.character.selectable').first();
   entry.selected = await selected.evaluate(n => n.link);
   assert.equal(typeof entry.selected, 'string');
   await selected.click();
   await page.waitForFunction(async () => {
    const { game, ui, _status } = await import('/noname.js');
    return game.me?.name && game.me.countCards('h') > 0 && !ui.arena.classList.contains('choose-character') && _status.event.name !== 'chooseButton';
   }, null, { timeout: 45000 });
   entry.game = await page.evaluate(async () => {
    const { game, _status } = await import('/noname.js');
    return { name: game.me.name, hand: game.me.countCards('h'), event: _status.event.name };
   });
   assert.equal(entry.game.name, entry.selected, 'the actual clicked general enters the match');
   await page.screenshot({ path: `${output}/${freeChoice ? 'free' : 'normal'}-entered-match.png` });
  } catch (error) {
   await page.screenshot({ path: `${output}/failure.png` }).catch(() => {});
   throw error;
  } finally { await context.close(); }
 }
 assert.deepEqual(report.errors, []);
 console.log(JSON.stringify({ cases: report.cases.map(c => ({ freeChoice: c.freeChoice, sizes: c.sizes.length, game: c.game })), errors: report.errors }));
} finally {
 await fs.writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
 await browser.close();
}
