import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const baseline = process.argv.includes('--baseline');
const shousha = process.argv.includes('--shousha');
const failInventory = process.argv.includes('--timeout');
const character = process.env.SKIN_TEST_CHARACTER || 'caocao';
const skinTitle = process.env.SKIN_TEST_TITLE || '魏武东临';
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const output=process.env.SKIN_TEST_OUTPUT||'output/dynamic-import';await fs.mkdir(output,{recursive:true});
const installed = JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json'));
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = { baseline, requests: [], errors: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } }), page = await context.newPage();
  await context.route('**/*', route => { const u = new URL(route.request().url()); return u.hostname !== '127.0.0.1' || /^\/(api|ws)\//.test(u.pathname) ? route.abort() : route.fallback(); });
  if(process.argv.includes('--candidate'))await context.route('**/runtime/*',async route=>{
    const name=new URL(route.request().url()).pathname.split('/').at(-1);
    if(!/^[a-z0-9-]+\.(?:js|html|css)$/.test(name))return route.fallback();
    try{await route.fulfill({body:await fs.readFile(path.resolve('apps/core/noname/skin/localDynamic/runtime',name)),contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.html')?'text/html':'text/css'});}catch(e){if(e.code==='ENOENT')return route.fallback();throw e;}
  });
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('dialog', d => void d.accept());
  page.on('request', r => { const p = decodeURIComponent(new URL(r.url()).pathname); if (p.includes('本地动态皮肤包')) report.requests.push(p); });
  await context.addInitScript(() => sessionStorage.setItem('noname_0.9_return_to_lobby', 'true'));
  if (failInventory) await context.addInitScript(() => {
    const fetchOriginal = window.fetch;let failed = false;
    window.fetch = function(input, ...args) {
      if (!failed && decodeURIComponent(String(input)).includes('手杀标准UI/files.json')) {
        failed = true;return Promise.reject(new DOMException('signal timed out', 'TimeoutError'));
      }
      return fetchOriginal.call(this, input, ...args);
    };
  });
  await page.route('**/game/config.json', async route => {
    const response = await route.fetch(), config = await response.json();
    Object.assign(config, { extensions: ['千幻聆音'], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'always', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: shousha ? 'builtin-shousha-standard' : 'builtin-rzsh', change_skin: true, change_skin_auto: 'off', animation: true, low_performance: false });
    for (const k of Object.keys(config)) if (k.startsWith('extension_') && k.endsWith('_enable')) config[k] = false;
    for (const row of installed) config['extension_' + row.name + '_enable'] = row.name === '千幻聆音';
    await route.fulfill({ response, json: config });
  });
  const start = Date.now();
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  if (failInventory) {
    await page.getByRole('button', { name: '重试皮肤加载' }).waitFor({ timeout: 30000 });
    assert.equal(await page.locator('body').getAttribute('data-shousha-loading'), null);
    assert.ok((await page.locator('.shousha-native-notice').innerText()).includes('界面素材清单读取超时'));
    await page.getByRole('button', { name: '重试皮肤加载' }).click();
    await page.locator('.shousha-native-notice').waitFor({ state: 'detached' });
    report.timeoutRecovered = true;
  }
  if (shousha) {
    await page.waitForSelector('iframe[src*="/html/rzsh.html"]', { timeout: 60000 });
    await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();
  }
  await page.waitForSelector('#splash canvas', { timeout: 120000 });
  await page.evaluate(async () => { window.__env = await import('/noname.js'); await __env.game.localDynamicPacksReady; });
  report.startupMs = Date.now() - start;
  report.startup = await page.evaluate(() => ({ entries: Object.values(__env.game.localDynamicSkinTestHub?.packs || {}).reduce((n, p) => n + p.entries.length, 0), heap: performance.memory?.usedJSHeapSize }));
  assert.equal(await page.evaluate(() => __env.lib.uiWorkshop?.error), undefined);
  report.startupRequests = [...report.requests];
  console.log('startup', JSON.stringify({ ms: report.startupMs, ...report.startup, requests: report.startupRequests }));
  if (!baseline) { assert.deepEqual(report.startupRequests, []); assert.equal(report.startup.entries, 0); }
  const opened = Date.now();
  await page.evaluate(character => __env.openCharacterSkins(character, undefined, 'skin'), character);
  await page.waitForSelector('.qh-skinchange-shousha-big-skin', { timeout: 30000 });
  const skin = page.locator('.qh-skinchange-shousha-big-skin').filter({ hasText: skinTitle }).last();
  await skin.waitFor({ state: 'attached' });
  report.listMs = Date.now() - opened;
  report.afterList = await page.evaluate(() => ({ entries: Object.values(__env.game.localDynamicSkinTestHub.packs).reduce((n, p) => n + p.entries.length, 0) }));
  report.listRequests = [...report.requests];
  if (!baseline) {
    assert.ok(report.afterList.entries > 0 && report.afterList.entries < 30);
    assert.ok(!report.requests.some(p => /catalog\.json|\/gallery\//.test(p)));
    assert.ok(await page.locator('iframe[data-skin-thumbnail]').count() <= 1,'Visible thumbnails share one renderer');
  }
  await skin.evaluate(card => card.click());
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]', { timeout: 30000 });
  report.selectionRequests = [...report.requests];
  const frame = await (await page.locator('.qh-image-standard iframe').elementHandle()).contentFrame();
  report.loadedSkin = await frame.evaluate(() => ({ id: skinPlayer.entry.id, type: skinPlayer.entry.type }));
  if (!baseline) {
    const details=report.requests.filter(p => /\/entries\/.*\.json$/.test(p));
    assert.ok(details.length <= 5,'Only selected and visible skins load their models');
    assert.ok(!report.requests.some(p => p.includes('catalog.json')));
    assert.ok(!report.requests.some(p => /名将杀扩展|少女前线扩展|碧蓝航线扩展/.test(p)));
    const before = report.requests.filter(p => p.includes('/characters/')).length;
    await page.evaluate(character => new Promise(resolve => __env.game.qhly_getSkinList(character, resolve)), character);
    assert.equal(report.requests.filter(p => p.includes('/characters/')).length, before);
  }
  if (character === 'luyi') {
    const presentation = await frame.evaluate(() => SkinFraming.compose(skinPlayer.entry, skinPlayer.fit));
    assert.equal(presentation.nativePortrait, true);
    const bounds = await page.locator('.qh-image-standard').boundingBox();
    assert.ok(bounds.height > bounds.width, 'Native portrait frame must stay tall');
  }
  await skin.locator('.primary-avatar[data-skin-thumbnail-ready=true]').waitFor({timeout:30000});
  assert.ok((await skin.locator('.primary-avatar').evaluate(node=>node.style.backgroundImage)).includes('data:image/'),'Dynamic card contains a rendered image, not a label SVG');
  await page.waitForFunction(()=>[...document.querySelectorAll('.qh-skinchange-shousha-big-skin')].every(card=>{
    if(!card.textContent.includes('本地 · '))return true;
    const r=card.getBoundingClientRect(),c=card.parentElement.parentElement.getBoundingClientRect();
    if(r.right<=c.left||r.left>=c.right||r.bottom<=c.top||r.top>=c.bottom)return true;
    return card.querySelector('.primary-avatar')?.dataset.skinThumbnailReady==='true';
  }),null,{timeout:60000});
  await page.screenshot({ path: `${output}/lazy-preview-${character}.png` });
  report.buttons = await page.evaluate(() => {
    const result = {};
    for (const [key,selector] of Object.entries({interaction:'.qh-skin-preview-interaction',toggle:'.qh-skinchange-big-dynamicChange',avatar:'.qh-shousha-big-avatar'})) {
      const node=document.querySelector(selector),style=getComputedStyle(node);
      result[key]={rect:node.getBoundingClientRect().toJSON(),right:style.right,left:style.left,margin:style.margin,transform:style.transform,box:style.boxSizing};
    }
    return result;
  });
  for (const viewport of [{width:1440,height:900},{width:1100,height:720}]) {
    await page.setViewportSize(viewport);
    const button=page.locator('.qh-skin-preview-interaction');
    await button.waitFor({state:'visible'});
    await page.waitForFunction(() => {
      const b=document.querySelector('.qh-skin-preview-interaction').getBoundingClientRect();
      const t=document.querySelector('.qh-skinchange-big-dynamicChange').getBoundingClientRect();
      const p=document.querySelector('.qh-image-standard').getBoundingClientRect();
      return b.top >= t.bottom + 2 && b.right <= p.right - 8 && b.left >= p.left + 8;
    });
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    assert.ok(await button.evaluate(node=>node.getBoundingClientRect().right<=document.querySelector('.qh-image-standard').getBoundingClientRect().right-8),'Expanded interaction button stays inside the painting');
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'),'false');
    const caption=await page.locator('.qh-skinchange-decade-big-skin-text').evaluate(n=>{
      const a=n.closest('.qh-shousha-big-avatar').querySelector('.qh-image-standard').getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();
      return {text:n.textContent,key:n.dataset.skinKey,inside:b.left>=a.left&&b.right<=a.right&&b.bottom<=a.bottom,lines:n.clientHeight/parseFloat(getComputedStyle(n).lineHeight),painting:a.toJSON(),box:b.toJSON(),style:getComputedStyle(n.parentElement).cssText};
    });
    (report.captions||=[]).push(caption);
    assert.ok(caption.inside,'Caption stays within the painting');
    assert.ok(caption.lines<2.5,'Caption has at most two lines');
    assert.ok(!caption.text.includes('本地 · '),'Preview caption omits the internal pack key');
    assert.ok(caption.key.startsWith('本地 · '),'Dynamic toggle retains the full internal key');
    const longCaption=await page.locator('.qh-skinchange-decade-big-skin-text').evaluate(n=>{
      const saved=n.textContent;n.textContent=saved.repeat(20);
      const style=getComputedStyle(n),result={lines:n.clientHeight/parseFloat(style.lineHeight),width:n.getBoundingClientRect().width,parentWidth:n.parentElement.getBoundingClientRect().width};n.textContent=saved;return result;
    });
    assert.ok(longCaption.lines<2.5&&longCaption.width<=longCaption.parentWidth,'Long captions wrap/clamp inside the same frame');
  }
  // A fresh loader reads the persisted thumbnail without fetching a skeleton
  // or allocating another WebGL renderer.
  const beforeCache=report.requests.length;
  await page.evaluate(async id=>{
    const hub=__env.game.localDynamicSkinTestHub;
    const p=Object.values(hub.packs).find(p=>p.entries.some(e=>e.id===id)),e=p.entries.find(e=>e.id===id);
    const {createThumbnailLoader}=await import('/noname/skin/localDynamic/thumbnails.js');
    const node=document.createElement('div');node.id='thumbnail-cache-check';node.style.cssText='position:fixed;left:10px;top:10px;width:160px;height:240px';document.body.append(node);
    createThumbnailLoader(()=>({p,e}))('',e.skinTitle+'.png',node);
  },report.loadedSkin.id);
  await page.waitForSelector('#thumbnail-cache-check[data-skin-thumbnail-ready=true]');
  assert.equal(report.requests.length,beforeCache,'Cached thumbnail makes no pack requests');
  await page.locator('#thumbnail-cache-check').evaluate(node=>node.remove());
  const dynamicToggle=page.locator('.qh-skinchange-big-dynamicChange');
  await dynamicToggle.click();
  await page.waitForFunction(()=>!document.querySelector('.qh-image-standard iframe'));
  await dynamicToggle.click();
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]',{timeout:30000});
  const restoredFrame=await (await page.locator('.qh-image-standard iframe').elementHandle()).contentFrame();
  assert.equal(await restoredFrame.evaluate(()=>skinPlayer.entry.id),report.loadedSkin.id,'Short captions do not change static/dynamic skin lookup');
  report.dynamicToggleRoundTrip=true;
  const staticCards=page.locator('.qh-skinchange-shousha-big-skin');
  await (process.env.SKIN_TEST_STATIC_TITLE?staticCards.filter({hasText:process.env.SKIN_TEST_STATIC_TITLE}).first():staticCards.first()).evaluate(card=>card.click());
  await page.locator('.qh-skin-preview-interaction').waitFor({state:'hidden'});
  if(process.env.SKIN_TEST_STATIC_TITLE){
    await page.waitForFunction(()=>document.querySelector('.qh-image-standard')?.style.backgroundImage.startsWith('url("data:image/'));
    assert.equal(await page.locator('.qh-image-standard').evaluate(n=>(n.style.backgroundImage.match(/url\(/g)||[]).length),1,'Transparent static art does not overlay another character');
  }
  await page.screenshot({path:`${output}/static-preview-${character}.png`});
  report.staticButtonHidden=true;report.thumbnailCached=true;
  assert.deepEqual(report.errors, []);
} finally {
  await fs.writeFile(output+'/' + (baseline ? 'lazy-before' : failInventory ? 'lazy-timeout-recovery' : shousha ? 'lazy-shousha' : 'lazy-after') + '.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log('PASS', JSON.stringify({ startupMs: report.startupMs, listMs: report.listMs, entries: report.afterList?.entries, selected: report.loadedSkin }));
