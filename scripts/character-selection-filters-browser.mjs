import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
try {
 for (const provider of (process.argv.slice(2).length ? process.argv.slice(2) : ['builtin-native', 'builtin-rzsh', 'builtin-shousha-standard', 'builtin-decade-ingame', 'builtin-ink-gold', 'builtin-blue', 'builtin-jade'])) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 810 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  await context.addInitScript(() => sessionStorage.setItem('noname_0.9_disable_extension', 'true'));
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await page.routeWebSocket('**', () => {});
  await page.route('**/game/config.json*', async route => {
   const response = await route.fetch(), config = await response.json();
   Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'off', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: provider, character_dialog_tool: '最近' });
   config.mode_config.identity = { ...config.mode_config.identity, player_number: '4', double_character: false, change_choice: true, free_choose: true, recentCharacter: ['caocao'] };
   for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
   await route.fulfill({ response, json: config });
  });
  try {
   await page.goto(origin, { waitUntil: 'domcontentloaded' });
   await page.waitForSelector('#arena .button.character.selectable', { timeout: 90000 });
   const result = await page.evaluate(async () => {
    const { lib, ui, get } = await import('/noname.js');
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    const visible = dialog => (dialog.characterPager?.buttons || dialog.buttons).filter(button => !button.classList.contains('nodisplay') && button.style.display !== 'none').map(button => button.link).sort();
    const click = node => node.dispatchEvent(new Event(lib.config.touchscreen ? 'touchend' : 'click', { bubbles: true }));
    const ids = ['caocao', 'liubei', 'sunquan'];
    lib.config.character_dialog_tool = '最近';
    lib.config.mode_config.identity.recentCharacter = ['caocao'];
    lib.config.favouriteCharacter = ['liubei'];
    // An extension-registered pack outside the built-in enabled-pack list.
    lib.characterPack.selection_filter_fixture = { liubei: lib.character.liubei, sunquan: lib.character.sunquan };
    lib.translate.selection_filter_fixture_character_config = '筛选回归包';
    const cases = [];
    for (const kind of ['ordinary', 'paged', 'legacy']) {
     lib.config.showMax_character_number = kind === 'paged' ? '2' : '0';
     const filter = id => !ids.includes(id);
     const dialog = kind === 'legacy' ? ui.create.characterDialog2(filter) : ui.create.characterDialog(filter, ...(kind === 'paged' ? ['paged'] : []));
     ui.arena.append(dialog);
     const recent = [...dialog.querySelectorAll(kind === 'legacy' ? '.packnode > div' : '.character-filters .tdnode')].find(node => node.textContent.trim() === '最近');
     check(recent, `${kind}: recent control exists`);
     check(!recent.classList.contains('thundertext') && !recent.classList.contains('active'), `${kind}: recent is initially off`);
     check(visible(dialog).some(id => id !== 'caocao'), `${kind}: initial candidates are not limited to recent`);
     if (kind === 'paged') check(dialog.characterPager.totalPages === 2, 'pagination covers all candidates');
     click(recent);
     check(JSON.stringify(visible(dialog)) === JSON.stringify(['caocao']), `${kind}: manual recent still filters`);
     if (kind !== 'legacy') {
      click(recent);
      check(visible(dialog).some(id => id !== 'caocao'), `${kind}: recent can be cleared`);
     }
     const select = dialog.querySelector('select[aria-label="筛选武将包"]');
     if (select) {
      check([...select.options].some(option => option.value === 'selection_filter_fixture'), `${kind}: extension pack is available`);
      select.value = 'selection_filter_fixture';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      check(JSON.stringify(visible(dialog)) === JSON.stringify(['liubei', 'sunquan']), `${kind}: pack selection filters candidates`);
      select.value = '';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      check(visible(dialog).includes('caocao'), `${kind}: all packs restores candidates`);
     }
     cases.push({ kind, dropdown: !!select, recentInitiallyOff: true, manualRecent: true });
     dialog.characterPager?.pause();
     dialog.remove();
    }
    // Preserve other explicit defaults and the mode's actual eligibility filter.
    lib.config.character_dialog_tool = '收藏';
    lib.config.showMax_character_number = '0';
    const favourite = ui.create.characterDialog(id => !ids.includes(id));
    check(JSON.stringify(visible(favourite)) === JSON.stringify(['liubei']), 'favourite default remains supported');
    favourite.remove();
    check(get.config('recentCharacter').includes('caocao'), 'recent history is preserved');
    return { cases, splashes: lib.onloadSplashes.map(splash => splash.id) };
   });
   if (['builtin-rzsh', 'builtin-shousha-standard'].includes(provider)) assert.equal(result.cases[0].dropdown, true, `${provider}: shared RZSH dropdown`);
   assert.ok(!result.splashes.includes('ui-workshop-failed'), `${provider}: UI loads successfully`);
   assert.deepEqual(errors, []);
   results.push({ provider: provider || 'native', ...result });
   console.log(JSON.stringify(results.at(-1)));
  } finally { await context.close(); }
 }
} finally { await browser.close(); }
