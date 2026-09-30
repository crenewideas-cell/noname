import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(new URL('../packages/game-host/package.json', import.meta.url))('playwright-core');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:18081';
const output = 'output/character-selection-restore';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = { errors: [], reads: [], writes: [] };
const context = await browser.newContext({ viewport: { width: 1440, height: 810 } });
const page = await context.newPage();
page.setDefaultTimeout(30000);
page.on('pageerror', error => { report.errors.push(error.stack); console.log('PAGE ERROR', error.message); });
page.on('dialog', async dialog => { report.errors.push(dialog.message()); console.log('DIALOG', dialog.message().slice(0, 200)); await dialog.accept(); });
await context.addInitScript(() => localStorage.setItem('gplv3_noname_alerted', 'true'));
await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
await page.routeWebSocket('**', () => {});
await page.route('**/game/config.json*', async route => {
 const response = await route.fetch(), config = await response.json();
 Object.assign(config, { new_tutorial: true, version: '1.11.6', show_splash: 'off', mode: 'identity', ui_workshop_active: process.env.NONAME_UI_PROVIDER || 'builtin-rzsh', auto_confirm: false });
 delete config.showMax_character_number;
 config.mode_config.identity = { ...config.mode_config.identity, player_number: '2', double_character: false, change_choice: true, free_choose: true, change_card: 'disabled', change_identity: true };
 await route.fulfill({ response, json: config });
});
try {
 await page.goto(origin, { waitUntil: 'domcontentloaded' });
 console.log('Page loaded');
 await page.waitForTimeout(15000);
 console.log(await page.evaluate(() => document.body.innerText.slice(-800)));
 await page.screenshot({ path: `${output}/startup.png` });
 await page.waitForSelector('#arena .button.character.selectable', { timeout: 120000 });
 console.log('Default extensions reached character selection');
 await page.evaluate(async () => {
  window.env = await import('/noname.js');
  window.directoryReads = []; window.directoryWrites = [];
  const create = env.ui.create.characterDialog;
  env.ui.create.characterDialog = function (...args) {
   const dialog = create.apply(this, args);
   const descriptor = Object.getOwnPropertyDescriptor(dialog, 'buttons');
   if (descriptor?.get) Object.defineProperty(dialog, 'buttons', { ...descriptor,
    get() { directoryReads.push(new Error('full directory read').stack); return descriptor.get.call(this); },
    set(value) { directoryWrites.push(new Error('directory replacement').stack); return descriptor.set.call(this, value); },
   });
   return dialog;
  };
 });
 await page.locator('#control .control > div').filter({ hasText: /^自由选将$/ }).click();
 console.log('Opened free choice');
 report.directory = await page.evaluate(() => ({
  pager: !!env.ui.dialog.characterPager,
  materialized: env.ui.dialog.characterPager?.isMaterialized,
  total: env.ui.dialog.characterPager?.total,
  nodes: env.ui.dialog.querySelectorAll('.button.character').length,
  filters: !!env.ui.dialog.querySelector('.character-filters'),
  search: !!env.ui.dialog.querySelector('input'),
  reads: directoryReads, writes: directoryWrites,
  extensions: env.lib.config.extensions,
 }));
 console.log(JSON.stringify(report.directory));
 await page.screenshot({ path: `${output}/directory.png` });
 assert.equal(report.directory.pager, true);
 assert.equal(report.directory.filters, true);
 assert.equal(report.directory.search, true);
 assert.equal(report.directory.materialized, false);
 assert.ok(report.directory.nodes <= 10);
 const next = page.locator('.character-browser .page-next');
 await next.scrollIntoViewIfNeeded(); await next.click();
 assert.equal(await page.evaluate(() => env.ui.dialog.characterPager.page), 2);
 const packs = page.getByLabel('筛选武将包');
 await packs.selectOption('standard');
 assert.ok(await page.evaluate(() => env.ui.dialog.characterPager.buttons.every(button => !!env.lib.characterPack.standard[button.link])));
 await packs.selectOption('');
 const search = page.locator('.character-browser input');
 await search.fill('^曹操$'); await search.press('Enter');
 await page.waitForFunction(() => env.ui.dialog.characterPager.buttons.some(button => button.link === 'caocao'));
 const candidate = await page.evaluateHandle(() => env.ui.dialog.characterPager.buttons.find(button => button.link === 'caocao'));
 await candidate.asElement().click();
 assert.deepEqual(await page.evaluate(() => env.ui.selected.buttons.map(button => button.link)), ['caocao']);
 await page.locator('#control .control:not(.removing) > div').filter({ hasText: /^确定$/ }).click();
 await page.waitForFunction(() => env.game.me.name === 'caocao' && !env.ui.arena.classList.contains('choose-character'), undefined, { timeout: 45000 });
 report.completed = true;
 console.log('Pagination, pack filter, search, selection and game entry passed');
} catch (error) {
 report.failure = String(error);
 await page.screenshot({ path: `${output}/failure.png`, timeout: 10000 }).catch(() => {});
 throw error;
} finally {
 await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
 await browser.close();
}
