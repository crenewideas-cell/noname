import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(new URL('../packages/game-host/package.json', import.meta.url))('playwright-core');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const output = 'output/character-selection-performance';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = { errors: [], cases: [] };
try {
 for (const target of ['caocao', 'liubei', 'sunquan', 'hlhj_daiyu']) {
 const context = await browser.newContext({ viewport: { width: 1680, height: 900 } });
 const page = await context.newPage();
 page.on('pageerror', e => report.errors.push(e.stack));
 page.on('dialog', d => d.accept());
 await page.addInitScript(() => sessionStorage.setItem('noname_0.9_disable_extension', 'true'));
 await page.route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
 await page.routeWebSocket('**', r => r.close());
 await page.route('**/game/config.json*', async r => {
  const response = await r.fetch(), config = await response.json();
  Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'off', mode: 'identity', characters: ['standard', 'hlhj'], cards: ['standard'], ui_workshop_active: 'builtin-rzsh', showMax_character_number: '10', auto_confirm: false });
  config.mode_config.identity = { ...config.mode_config.identity, player_number: '8', double_character: false, change_choice: true, free_choose: true, change_card: 'disabled' };
  for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
  await r.fulfill({ response, json: config });
 });
 await page.goto(origin, { waitUntil: 'domcontentloaded' });
 await page.waitForSelector('#arena .button.character.selectable', { timeout: 90000 });
 await page.evaluate(async () => {
  window.env = await import('/noname.js');
  const { lib, ui, game } = env;
  const honglou = await import('/character/hlhj/index.js');
  const { loadCharacter } = await import('/noname/init/loading.ts');
  await game.import('character', honglou.default);
  loadCharacter(lib.imported.character.hlhj);
  game.finishCards();
  for (let i = 0; i < 3000; i++) {
   const id = `selection_perf_${i}`;
   lib.character[id] = lib.character.caocao;
   lib.translate[id] = `性能测试${i}`;
  }
  lib.config.character_dialog_tool = '收藏';
  lib.config.favouriteCharacter = ['caocao', 'liubei', 'sunquan', 'hlhj_daiyu'];
  window.selectionReads = [];
  const create = ui.create.characterDialog;
  ui.create.characterDialog = function (...args) {
   const d = create.apply(this, args);
   if (d.characterPager) {
    const descriptor = Object.getOwnPropertyDescriptor(d, 'buttons');
    Object.defineProperty(d, 'buttons', { ...descriptor, get() {
     selectionReads.push(new Error('full button pool requested').stack);
     return descriptor.get.call(this);
    } });
   }
   return d;
  };
 });
 await page.locator('#control .control > div').filter({ hasText: /^自由选将$/ }).click();
 await page.waitForSelector('.character-browser-paged .button.character.selectable');
 const selectedNode = await page.evaluateHandle(target => env.ui.dialog.characterPager.buttons.find(b => b.link === target), target);
 assert.ok(selectedNode.asElement(), `real character ${target} is loaded`);
 const start = performance.now();
 await selectedNode.asElement().click();
 const selectionMs = performance.now() - start;
 const state = await page.evaluate(() => ({ selected: env.ui.selected.buttons.map(b => b.link), complexSelect: env._status.event.complexSelect, materialized: env.ui.dialog.characterPager.isMaterialized, reads: selectionReads, nodes: env.ui.dialog.querySelectorAll('.button.character').length, total: env.ui.dialog.characterPager.total }));
 report.cases.push({ target, selectionMs, ...state });
 assert.deepEqual(state.selected, [target]);
 assert.equal(state.complexSelect, true, 'exercise the real chooseButton default');
 assert.equal(state.materialized, false, 'clicking a candidate must not materialize the entire character pool');
 assert.equal(state.reads.length, 0);
 assert.ok(state.nodes <= 10);
 // Deselect and reselect through native pointer events, then finish drafting.
 await selectedNode.asElement().click();
 assert.deepEqual(await page.evaluate(() => env.ui.selected.buttons.map(b => b.link)), []);
 await selectedNode.asElement().click();
 await page.locator('#control .control:not(.removing) > div').filter({ hasText: /^确定$/ }).click();
 await page.waitForFunction(target => env.game.me.name === target && !env.ui.arena.classList.contains('choose-character'), target, { timeout: 15000 });
 assert.deepEqual(await page.evaluate(() => selectionReads), []);
 await context.close();
 }
 console.log(JSON.stringify(report, null, 2));
 assert.deepEqual(report.errors, []);
} finally {
 await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
 await browser.close();
}
