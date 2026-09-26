import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const root = 'apps/core/extension/imports/本地动态皮肤包', installed = JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json'));
const index = JSON.parse(await fs.readFile(root + '/runtime-index.json')), selections = {};
for (const name of ['caocao', 'liubei']) {
  const rows = JSON.parse(await fs.readFile(root + '/' + index.characters[name]));
  selections[name] = (rows.find(r => r.entry.type === 'spine36') || rows[0]).entry.skinTitle + '.png';
}
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const report = { requests: [], errors: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } }), page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));page.on('dialog', d => void d.accept());
  page.on('request', r => { const p = decodeURIComponent(new URL(r.url()).pathname);if (p.includes('本地动态皮肤包')) report.requests.push(p); });
  await context.route('**/*', route => { const u = new URL(route.request().url());return u.hostname !== '127.0.0.1' || /^\/(api|ws)\//.test(u.pathname) ? route.abort() : route.continue(); });
  await page.route('**/game/config.json', async route => {
    const response = await route.fetch(), config = await response.json();
    Object.assign(config, { extensions: ['千幻聆音'], extension_auto_import: false, new_tutorial: true, version: '1.11.6',
      show_splash: 'off', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: 'builtin-shousha-standard',
      change_skin: true, change_skin_auto: 'off', animation: true, low_performance: false });
    config.mode_config.identity = { ...config.mode_config.identity, player_number: '2', change_card: 'disabled' };
    for (const k of Object.keys(config)) if (k.startsWith('extension_') && k.endsWith('_enable')) config[k] = false;
    for (const row of installed) config['extension_' + row.name + '_enable'] = row.name === '千幻聆音';
    await route.fulfill({ response, json: config });
  });
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => { window.__env = await import('/noname.js'); });
  await page.waitForSelector('#arena .button.character.selectable', { timeout: 60000 });
  assert.deepEqual(report.requests, []);
  await page.evaluate(() => { if (!__env._status.auto) __env.ui.click.auto(); });
  await page.waitForFunction(() => __env._status.gameStarted && __env.game.players.every(p => p.name1), null, { timeout: 60000 });
  await page.evaluate(selections => {
    const { game, lib, ui, _status } = __env;if (_status.auto) ui.click.auto();game.pause2();
    // A lobby preset may override the requested two-player game. Isolate all
    // other seats so a randomly chosen Cao Cao/Liu Bei is not a second sample.
    for (const player of game.players) if (player !== game.me) player.classList.add('unseen','unseen2');
    const other = game.players.find(p => p !== game.me);
    other.uninit();other.init('liubei');other.classList.add('unseen');other.dataset.lazyTest = 'hidden';
    game.me.uninit();game.me.init('caocao');game.me.dataset.lazyTest = 'visible';
    // Finish rebuilding both player nodes before enabling their saved skins;
    // otherwise initialization can briefly mount a renderer on an old avatar.
    lib.config.qhly_skinset.skin = { ...lib.config.qhly_skinset.skin, ...selections };
    game.localDynamicSkinTestHub.refresh();
  }, selections);
  await page.waitForSelector('[data-lazy-test=visible] .local-dynamic-skin iframe[data-ready=true]', { timeout: 30000 });
  assert.equal(report.requests.filter(p => p.includes('/characters/')).length, 1);
  assert.equal(await page.locator('[data-lazy-test=hidden] .local-dynamic-skin').count(), 0);
  assert.equal(await page.evaluate(() => __env.lib.config.qhly_skinset.skin.liubei), selections.liubei);
  report.hiddenNotLoaded = true;
  await page.evaluate(() => { document.querySelector('[data-lazy-test=hidden]').classList.remove('unseen');__env.game.localDynamicSkinTestHub.refresh(); });
  await page.waitForSelector('[data-lazy-test=hidden] .local-dynamic-skin iframe[data-ready=true]', { timeout: 30000 });
  assert.equal(report.requests.filter(p => p.includes('/characters/')).length, 2);
  assert.equal(report.requests.filter(p => p.includes('/entries/')).length, 2);
  report.savedSelectionsRestored = true;
  await page.evaluate(() => { document.querySelector('[data-lazy-test=hidden]').classList.add('unseen');__env.game.localDynamicSkinTestHub.refresh(); });
  assert.equal(await page.locator('[data-lazy-test=hidden] .local-dynamic-skin').count(), 0);
  assert.equal(await page.evaluate(() => __env.lib.uiWorkshop?.error), undefined);
  assert.ok(!report.requests.some(p => p.includes('catalog.json')));assert.deepEqual(report.errors, []);
  await page.screenshot({ path: 'output/dynamic-import/lazy-game.png' });report.passed = true;
} finally {
  await fs.writeFile('output/dynamic-import/lazy-game.json', JSON.stringify(report, null, 2));await browser.close();
}
console.log('PASS visible saved skins load, hidden opponents stay unloaded and saved selections survive');
