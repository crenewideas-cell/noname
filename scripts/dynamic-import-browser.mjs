import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const root = 'apps/core/extension/imports/本地动态皮肤包';
const installed = JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json'));
const manifest = JSON.parse(await fs.readFile(root + '/manifest.json'));
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const report = { ownership: {}, renders: [], errors: [] };
try {
 if (!process.argv.includes('--render-only')) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(90000);
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('dialog', d => void d.accept());
  await context.route('**/*', route => { const u = new URL(route.request().url()); return u.hostname !== '127.0.0.1' || u.pathname.startsWith('/api/') || u.pathname.startsWith('/ws/') ? route.abort() : route.continue(); });
  await context.addInitScript(() => sessionStorage.setItem('noname_0.9_return_to_lobby', 'true'));
  await page.route('**/game/config.json', async route => {
    const response = await route.fetch(), config = await response.json();
    Object.assign(config, { extensions: ['千幻聆音', '动态皮肤验证扩展'], organized_extensions_registered: ['动态皮肤验证扩展'],
      qhly_skinset: { skin: { caocao: '验证 · 旧样本.png' }, skinAudioList: {}, audioReplace: {} },
      extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'always', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: 'builtin-rzsh', change_skin: true, change_skin_auto: 'off', animation: true, low_performance: false });
    for (const k of Object.keys(config)) if (k.startsWith('extension_') && k.endsWith('_enable')) config[k] = false;
    for (const row of installed) config['extension_' + row.name + '_enable'] = row.name === '千幻聆音';
    await route.fulfill({ response, json: config });
  });
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => { window.__env = await import('/noname.js'); });
  await page.waitForFunction(() => __env.game.qhly_coreReady && !!__env.game.localDynamicSkinTestHub?.ensureCharacter);
  report.ownership = await page.evaluate(async () => {
    const { game, lib } = __env, hub = game.localDynamicSkinTestHub;
    const rows = {};
    await game.localDynamicPacksReady;
    rows.oldSelectionCleared = !lib.config.qhly_skinset.skin.caocao;
    for (const name of ['caocao', 'liubei', 'mjs_diaochan', 'diaochan', 'unknown_hero']) {
      const files = await new Promise(resolve => game.qhly_getSkinList(name, (ok, files) => resolve(files)));
      const local = files.filter(f => f.startsWith('本地 · '));
      rows[name] = { count: local.length, allOwned: local.every(file => hub.owns(name, file)) };
    }
    const foreign = hub.packs['名将杀扩展'].entries[0].skinTitle + '.png';
    await new Promise(resolve => game.qhly_setCurrentSkin('caocao', foreign, resolve));
    rows.foreignSelectionRejected = game.qhly_getSkin('caocao') !== foreign;
    rows.unbound = hub.inventory.reduce((n, p) => n + p.unbound, 0);
    rows.oldRemoved = !lib.config.extensions.includes('动态皮肤验证扩展');
    return rows;
  });
  assert.ok(report.ownership.caocao.count > 0);
  for (const row of Object.values(report.ownership)) if (typeof row === 'object') assert.ok(row.allOwned);
  assert.equal(report.ownership.unknown_hero.count, 0);
  assert.ok(report.ownership.foreignSelectionRejected && report.ownership.oldRemoved && report.ownership.oldSelectionCleared);
  console.log('ownership', JSON.stringify(report.ownership));
  await page.waitForSelector('#splash canvas');
  await page.evaluate(() => __env.openCharacterSkins('caocao', undefined, 'skin'));
  await page.waitForSelector('.qh-skinchange-shousha-big-skin', { timeout: 20000 }).catch(async error => {
    await page.screenshot({ path: 'output/dynamic-import/preview-failure.png' });
    console.log(await page.evaluate(() => ({ text: document.body.innerText.slice(-1500), config: __env.lib.config.qhly_currentViewSkin, character: __env.get.character('caocao').isNull })));
    throw error;
  });
  await page.locator('.qh-skinchange-shousha-big-skin').filter({ hasText: '魏武东临' }).last().evaluate(card => card.click());
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]', { timeout: 20000 }).catch(async error => {
    await page.screenshot({ path: 'output/dynamic-import/preview-failure.png' });
    console.log(await page.evaluate(() => ({ skin: __env.game.qhly_getSkin('caocao'),
      frames: [...document.querySelectorAll('iframe')].map(f => ({ src: f.src, ready: f.dataset.ready, error: f.contentWindow?.skinPlayerError })),
      previews: __env.game.localDynamicSkinTestHub.previews.size, table: Object.keys(__env.game.localDynamicSkinTestHub.skinTable('caocao')),
      html: document.querySelector('.qh-image-standard')?.outerHTML?.slice(0,2500) })));
    throw error;
  });
  await page.screenshot({ path: 'output/dynamic-import/character-preview.png' });
  console.log('character preview ready');
  await context.close();
 }
  for (const pack of manifest.packs) {
    const catalog = JSON.parse(await fs.readFile(root + '/' + pack.name + '/catalog.json'));
    const samples = [];
    for (const e of catalog.entries.filter(e => e.available !== false)) {
      const key = e.type + '/' + [...new Set(e.models?.map(m => m.version?.slice(0, 3) || '') || [])].sort().join(',');
      if (!samples.some(s => s.key === key)) samples.push({ key, entry: e });
    }
    for (const { key, entry } of samples) {
      const context = await browser.newContext({ viewport: { width: 640, height: 720 } }), page = await context.newPage();
      const row = { pack: pack.name, id: entry.id, key, errors: [], missing: [] }; report.renders.push(row);
      page.on('pageerror', e => row.errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400) row.missing.push(r.url()); });
      try {
        await page.goto(origin + '/extension/' + encodeURIComponent('本地动态皮肤包') + '/' + encodeURIComponent(pack.name) + '/runtime/player.html?id=' + entry.id);
        await page.waitForFunction(() => window.skinPlayer || window.skinPlayerError, null, { timeout: 60000 });
        assert.equal(await page.evaluate(() => window.skinPlayerError), null);
        row.info = await page.evaluate(() => skinPlayer.info());
        row.nonempty = await page.evaluate(() => {
          const p = skinPlayer, c = p.engine42?.canvas || p.app.view;
          p.engine42 ? p.engine42.draw() : p.app.render();
          const gl = c.getContext('webgl2') || c.getContext('webgl'), pixels = new Uint8Array(c.width * c.height * 4);
          gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          let n = 0; for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) n++;
          return n;
        });
        assert.ok(row.nonempty > 100);
      } catch (e) { row.failure = e.message; }
      await context.close();
      console.log(pack.name, key, row.failure || 'PASS');
      await fs.writeFile('output/dynamic-import/browser.json', JSON.stringify(report, null, 2));
    }
  }
} finally {
  await fs.writeFile('output/dynamic-import/browser.json', JSON.stringify(report, null, 2));
  await browser.close();
}
assert.ok(report.renders.every(r => !r.failure && !r.errors.length && !r.missing.length));
