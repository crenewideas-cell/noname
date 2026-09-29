import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(path.resolve('packages/game-host/package.json'));
const { chromium } = require('playwright-core');
const output = path.resolve('output/linked-state');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1680, height: 900 } });
const report = { errors: [], checks: [] };
page.on('pageerror', error => report.errors.push(error.message));
page.on('dialog', dialog => dialog.accept());
await page.route('**/*', route => {
 const url = new URL(route.request().url());
 return url.hostname !== '127.0.0.1' || /^\/(api|ws)\//.test(url.pathname) ? route.abort() : route.continue();
});
await page.addInitScript(() => sessionStorage.setItem('noname_0.9_disable_extension', 'true'));
await page.route('**/game/config.json', async route => {
 const response = await route.fetch(), config = await response.json();
 Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'off', mode: 'identity', characters: ['standard'], cards: ['standard', 'extra'], ui_workshop_active: 'builtin-decade-ingame', link_style2: 'chain', background_audio: false });
 config.mode_config.identity = { ...config.mode_config.identity, player_number: '8', double_character: false };
 for (const key of Object.keys(config)) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
 await route.fulfill({ response, json: config });
});
const snapshot = () => page.evaluate(() => window.linkAudit.game.players.map(player => {
 const style = getComputedStyle(player.node.chain);
 return { seat: player.dataset.position, linked: player.isLinked(), visible: style.visibility === 'visible' && style.display !== 'none' && style.opacity !== '0', background: style.backgroundImage, className: player.className, arena: window.linkAudit.ui.arena.className, visibility: style.visibility, display: style.display };
}));
try {
 await page.goto(process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081/', { waitUntil: 'domcontentloaded' });
 await page.waitForSelector('#arena .button.character.selectable', { timeout: 90000 });
 await page.waitForSelector('.decade-frame');
 await page.evaluate(async () => { window.linkAudit = await import('/noname.js'); window.linkAudit.game.pause2(); });
 report.initial = await snapshot();
 assert.equal(report.initial.length, 8);
 await page.screenshot({ path: path.join(output, 'initial.png') });
 for (const player of report.initial) {
  assert.equal(player.linked, false, `seat ${player.seat}: initial core state`);
  assert.equal(player.visible, false, `seat ${player.seat}: unlinked chain must be hidden`);
 }
 report.checks.push('all eight new players start unlinked with hidden chains');
 for (const seat of ['0', '1']) {
  for (const linked of [true, false]) {
   await page.evaluate(async seat => {
    const { lib, game } = window.linkAudit;
    const player = game.players.find(p => p.dataset.position === seat);
    await lib.element.content.link({}, null, player);
   }, seat);
   // Core div transitions take 500ms; inspect the settled rendering.
   await page.waitForFunction(({ seat, linked }) => {
    const player = window.linkAudit.game.players.find(p => p.dataset.position === seat);
    return getComputedStyle(player.node.chain).visibility === (linked ? 'visible' : 'hidden');
   }, { seat, linked }, { timeout: 3000 });
   const players = await snapshot();
   (report.transitions ||= []).push({ seat, linked, players });
   for (const player of players) {
    const expected = player.seat === seat && linked;
    assert.equal(player.linked, expected);
    assert.equal(player.visible, expected, `seat ${player.seat}: chain after core link event`);
    if (expected) assert.match(player.background, /tie_suo\.png/);
   }
  }
 }
 report.checks.push('core link/unlink events show and hide only the affected local/opponent chain');
 await page.evaluate(async () => {
  const { lib, game, ui } = window.linkAudit;
  await lib.element.content.link({}, null, game.me);
  ui.arena.classList.add('nolink');
 });
 assert.equal((await snapshot()).find(p => p.seat === '0').visible, false);
 await page.evaluate(() => window.linkAudit.ui.arena.classList.remove('nolink'));
 await page.waitForFunction(() => getComputedStyle(window.linkAudit.game.me.node.chain).visibility === 'visible');
 assert.equal((await snapshot()).find(p => p.seat === '0').visible, true);
 report.checks.push('the core alternate link-indicator setting still hides the chain');
 await page.screenshot({ path: path.join(output, 'linked.png') });
 assert.deepEqual(report.errors, []);
 report.passed = true;
} catch (error) {
 report.failure = error.stack;
 process.exitCode = 1;
} finally {
 await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
 await browser.close();
}
console.log(JSON.stringify({ passed: report.passed, checks: report.checks, errors: report.errors, failure: report.failure }, null, 2));
