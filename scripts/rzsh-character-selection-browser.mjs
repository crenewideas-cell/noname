// Exercise real mode dialogs and the shared RZSH/decade skin in isolated saves.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const output = 'output/rzsh-character-selection';
const baseline = process.argv.includes('--baseline');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = { errors: [], cases: [] };
try {
 for (const [mode, count] of [['identity', 8], ['identity', 5], ['versus', 4]]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 810 } });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('dialog', d => d.accept());
  await context.addInitScript(() => sessionStorage.setItem('noname_0.9_disable_extension', 'true'));
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await page.routeWebSocket('**', () => {});
  await page.route('**/game/config.json*', async route => {
   const response = await route.fetch(), config = await response.json();
   Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'off', mode, characters: ['standard', 'refresh', 'shenhua'], cards: ['standard'], ui_workshop_active: 'builtin-rzsh', showMax_character_number: '10', auto_confirm: false });
   config.mode_config[mode] = { ...config.mode_config[mode], player_number: String(count), versus_mode: 'two', double_character: false, change_choice: true, free_choose: true, change_card: 'disabled', change_identity: true, change_seat: true };
   for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
   await route.fulfill({ response, json: config });
  });
  try {
   await page.goto(origin, { waitUntil: 'domcontentloaded' });
   await page.waitForSelector('#arena .button.character.selectable', { timeout: 90000 });
   await page.waitForFunction(() => document.body.dataset.decadeParts?.includes('players'));
   await page.evaluate(async () => { window.__selectionEnv = await import('/noname.js'); });
   await page.locator('#extension-recovery').evaluateAll(nodes => nodes.forEach(n => n.open = false));
   const controls = page.locator('#control .control > div');
   await controls.filter({ hasText: /^更换$/ }).click();
   for (const freeChoice of [false, true]) {
    if (freeChoice) {
     await page.waitForFunction(() => !__selectionEnv.ui.cheat2?.classList.contains('disabled'));
     await controls.filter({ hasText: /^自由选将$/ }).click();
    }
    for (const [width, height, zoom] of (baseline ? [[1440, 810, 1]] : [[1440, 810, 1], [960, 540, 1], [844, 480, 1], [1440, 810, 1.25]])) {
     await page.setViewportSize({ width, height });
     await page.evaluate(zoom => { const { game, ui } = __selectionEnv; game.documentZoom = zoom; ui.updatez(); ui.update(); }, zoom);
     await page.waitForTimeout(400);
     const state = await page.evaluate(() => {
      const { ui } = __selectionEnv, dialog = ui.dialog, container = dialog.contentContainer;
      container.scrollTop = 0;
      const rect = n => n.getBoundingClientRect().toJSON();
      const css = getComputedStyle(dialog), scrollCSS = getComputedStyle(container);
      return { dialog: rect(dialog), container: rect(container), arena: rect(ui.arena), controls: rect(ui.control), background: css.backgroundImage, border: css.border, overflow: scrollCSS.overflowY, scrollHeight: container.scrollHeight, clientHeight: container.clientHeight, classes: dialog.className, paged: !!dialog.characterPager };
     });
     report.cases.push({ mode, count, freeChoice, width, height, zoom, ...state });
     await page.screenshot({ path: `${output}/${baseline ? 'baseline-' : ''}${mode}-${count}-${freeChoice ? 'free' : 'normal'}-${width}-${zoom}.png` });
     if (!baseline) {
      const { dialog: d, container: c, arena: a } = state;
      assert(d.top >= Math.max(0, a.top) - 1 && d.bottom <= Math.min(height, a.bottom) + 1 && d.left >= 0 && d.right <= width + 1, 'panel remains inside arena and screen');
      assert(c.top >= d.top && c.bottom <= d.bottom + 1 && c.left >= d.left && c.right <= d.right + 1, 'scroll viewport remains within its painted panel');
      assert(c.top >= d.top + d.height * .12 && c.bottom <= d.bottom - d.height * .04 + 1, 'content stays clear of transparent artwork edges');
      assert(d.bottom < state.controls.top, 'panel leaves room for game controls');
      assert(state.background.includes('dialog5.png'), 'all modes share the existing 2v2 panel artwork');
      const candidates = page.locator('#arena .dialog:not(.hidden) .button.character.selectable:not(.nodisplay)');
      for (const candidate of [candidates.first(), candidates.last()]) {
       await candidate.scrollIntoViewIfNeeded();
       assert(await candidate.evaluate(node => {
        const r = node.getBoundingClientRect(), c = node.closest('.content-container').getBoundingClientRect();
        return r.top >= c.top - 1 && r.bottom <= c.bottom + 1 && document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('.button.character') === node;
       }), 'first and last candidates are fully reachable and clickable');
      }
      if (state.paged) {
       const next = page.locator('#arena .dialog:not(.hidden) .page-next');
       await next.scrollIntoViewIfNeeded();
       await next.click();
       assert.equal(await page.evaluate(() => __selectionEnv.ui.dialog.characterPager.page), 2);
       await page.evaluate(() => __selectionEnv.ui.dialog.characterPager.go(1));
      }
     }
    }
   }
   if (!baseline) {
    await controls.filter({ hasText: /^自由选将$/ }).click();
    await page.waitForTimeout(600);
    assert.equal(await page.evaluate(() => !!__selectionEnv.ui.dialog.characterPager), false);
    await controls.filter({ hasText: /^更换$/ }).click();
    await page.waitForTimeout(600);
    await controls.filter({ hasText: /^自由选将$/ }).click();
    await page.waitForTimeout(600);
    const selected = page.locator('#arena .dialog:not(.hidden):not(.removing) .button.character.selectable:not(.nodisplay)').first();
    await selected.scrollIntoViewIfNeeded();
    const id = await selected.evaluate(n => n.link);
    await selected.click();
    assert.deepEqual(await page.evaluate(() => __selectionEnv.ui.selected.buttons.map(b => b.link)), [id]);
    await page.locator('#control .control > div').filter({ hasText: /^确定$/ }).click();
    await page.waitForFunction(id => __selectionEnv.game.me?.name === id && !__selectionEnv.ui.arena.classList.contains('choose-character'), id, { timeout: 45000 });
   }
  } catch (error) {
   await page.screenshot({ path: `${output}/failure.png` }).catch(() => {});
   throw error;
  } finally { await context.close(); }
 }
 assert.deepEqual(report.errors, []);
 console.log(JSON.stringify({ cases: report.cases.length, errors: report.errors }));
} finally {
 await fs.writeFile(`${output}/${baseline ? 'baseline-' : ''}report.json`, JSON.stringify(report, null, 2));
 await browser.close();
}
