import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(new URL('../packages/game-host/package.json', import.meta.url))('playwright-core');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const touch = process.argv.includes('--touch');
const output = 'output/rzsh-gain-equipment';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = { errors: [], gains: [], hovers: [] };
try {
 const page = await browser.newPage({ viewport: { width: 1680, height: 900 } });
 page.on('pageerror', e => report.errors.push(e.stack));
 page.on('dialog', d => d.accept());
 await page.addInitScript(() => sessionStorage.setItem('noname_0.9_disable_extension', 'true'));
 await page.route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
 await page.routeWebSocket('**', r => r.close());
 await page.route('**/game/config.json*', async r => {
  const response = await r.fetch(), config = await response.json();
  Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'off', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: 'builtin-rzsh', auto_confirm: false, touchscreen: touch, hover_all: true, hoveration: 100 });
  config.mode_config.identity = { ...config.mode_config.identity, player_number: '8', double_character: false, change_card: 'disabled' };
  for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
  await r.fulfill({ response, json: config });
 });
 await page.goto(origin, { waitUntil: 'domcontentloaded' });
 await page.waitForSelector('#arena .button.character.selectable', { timeout: 90000 });
 await page.waitForSelector('.decade-frame');
 await page.evaluate(async () => {
  window.env = await import('/noname.js');
  const { game, ui } = env;
  game.pause2();
  for (const d of ui.dialogs.slice()) d.close();
  for (const node of document.querySelectorAll('#extension-recovery')) node.open = false;
  ui.arena.classList.remove('choose-character');
  for (const p of game.players) if (!p.name) p.init('caocao');
  for (const p of [game.me, game.players.find(p => p.dataset.position === '2')]) {
   const card = game.createCard2('zhuge', 'club', 1);
   p.$addVirtualEquip(new env.lib.element.VCard(card), [card]);
   const armor = game.createCard2('bagua', 'spade', 2);
   p.$addVirtualEquip(new env.lib.element.VCard(armor), [armor]);
  }
 });
 for (const seat of ['0', '2']) for (const index of [0, 1]) {
  const equip = page.locator(`#arena > .player[data-position="${seat}"] > .equips > .card`).nth(index);
  await equip.hover();
  await page.waitForTimeout(800);
  report.hovers.push(await equip.evaluate(card => ({ seat: card.parentNode.parentNode.dataset.position, hover: !!card._hoverfunc, current: env._status.currentmouseenter?.className, intro: card._mouseenterdialog?.textContent, rect: card.getBoundingClientRect().toJSON(), hit: document.elementFromPoint(card.getBoundingClientRect().x+10,card.getBoundingClientRect().y+10)?.className })));
  await page.mouse.move(800, 450);
 }
 for (const [width, height, zoom] of [[1680, 900, 1], [960, 540, 1], [1680, 900, 1.25]]) {
 await page.setViewportSize({ width, height });
 await page.evaluate(zoom => { env.game.documentZoom = zoom; env.ui.updatez(); }, zoom);
 await page.waitForTimeout(100);
 for (const seat of ['0', '2', '7']) for (const method of ['draw', 'existing-clone']) {
  report.gains.push(await page.evaluate(({ seat, method, width, height, zoom }) => {
   const { game, ui } = env;
   const player = game.players.find(p => p.dataset.position === seat);
   const card = game.createCard2('tiesuo', 'club', 11);
   if (method === 'existing-clone') {
    const clone = card.copy('thrown', ui.arena);
    clone.style.transform = 'translate(-160px, 60px)';
    clone.style.opacity = '1';
   }
   player.$gain2([card], false, false);
   const node = card.clone;
   // Inspect the target of the existing transition, without waiting for deletion.
   node.style.transition = 'none';
   const result = { seat, method, width, height, zoom, player: player.getBoundingClientRect().toJSON(), animation: node.getBoundingClientRect().toJSON() };
   node.remove(); card.remove();
   return result;
  }, { seat, method, width, height, zoom }));
 }
 }
 for (const row of report.gains) {
  const centre = r => [r.x + r.width / 2, r.y + r.height / 2];
  row.error = Math.hypot(...centre(row.player).map((value, i) => value - centre(row.animation)[i]));
  assert.ok(row.error < 2, `gain animation must reach seat ${row.seat}: ${row.error}px`);
 }
 for (const row of report.hovers) assert.match(row.intro || '', /装备牌/, `seat ${row.seat}: native equipment tooltip`);
 await page.setViewportSize({ width: 1680, height: 900 });
 await page.evaluate(() => { env.game.documentZoom = 1; env.ui.updatez(); env.ui.cheat?.close(); env.ui.cheat2?.close(); });
 // Capture the actual skill's prompt arguments, then exercise its native
 // chooseButton event and select-all control through real pointer input.
 report.flower = await page.evaluate(async () => {
  const { game, lib, ui, get, ai, _status } = env;
  const extension = (await import('/extension/packs/红楼幻境/extension.js')).default(lib, game, ui, get, ai, _status);
  const skill = extension.package.skill.skill.hlhj_xiangduan;
  const cards = ['tiesuo', 'bingliang'].map(name => game.createCard2(name, 'club', 11));
  cards.forEach(card => ui.discardPile.append(card));
  let args;
  const choose = game.me.chooseButton;
  try {
   game.me.chooseButton = (...values) => {
    args = values;
    return { set() { return this; }, async forResult() { return { bool: false }; } };
   };
   await skill.content({}, { type: 'discard', getl: p => p === game.players[1] ? { cards2: cards } : null }, game.me);
  } finally { game.me.chooseButton = choose; }
  const choice = game.me.chooseButton(...args);
  choice.dialog = ui.create.dialog(...choice.createDialog);
  _status.eventManager.setStatusEvent(choice, true);
  choice.dialog.open();
  game.uncheck();
  ui.create.buttonChooseAll();
  game.check();
  return { allowed: choice.allowChooseAll, complex: choice.complexSelect, candidates: choice.dialog.buttons.length };
 });
 assert.equal(report.flower.allowed, true);
 assert.equal(report.flower.complex, false);
 assert.ok(await page.locator('.dialog:not(.removing) .select-all').evaluate(node => node.getBoundingClientRect().bottom <= node.nextElementSibling.getBoundingClientRect().top), 'select-all must not cover the skill prompt');
 await page.locator('.dialog:not(.removing) .select-all').click();
 assert.equal(await page.evaluate(() => env.ui.selected.buttons.length), 2);
 await page.screenshot({ path: `${output}/all-selected-${touch ? 'touch' : 'mouse'}.png` });
 await page.locator('.dialog:not(.removing) .select-all').click();
 assert.equal(await page.evaluate(() => env.ui.selected.buttons.length), 0);
 assert.deepEqual(report.errors, []);
 report.passed = true;
 console.log(JSON.stringify({ passed: true, gains: report.gains.length, maxPositionError: Math.max(...report.gains.map(r => r.error)), hovers: report.hovers.length, flower: report.flower, touch }));
} catch (error) {
 report.failure = error.stack;
 throw error;
} finally {
 await writeFile(`${output}/report-${touch ? 'touch' : 'mouse'}.json`, JSON.stringify(report, null, 2));
 await browser.close();
}
