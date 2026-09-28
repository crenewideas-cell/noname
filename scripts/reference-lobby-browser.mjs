import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const output = 'output/reference-lobby';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1672, height: 941 } });
const report = { errors: [], sizes: [], palettes: [] };
page.on('pageerror', e => report.errors.push(e.message));
page.on('dialog', d => d.accept());
try {
 await page.route('**/*', r => new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
 await page.routeWebSocket('**', () => {});
 await page.route('**/game/config.json*', async r => {
  const response = await r.fetch(), config = await response.json();
  Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'always', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: '', presentation_style: 'shousha', ui_workshop_home_style: 'shousha' });
  for (const k in config) if (k.startsWith('extension_') && k.endsWith('_enable')) config[k] = false;
  await r.fulfill({ response, json: config });
 });
 await page.goto(origin, { waitUntil: 'domcontentloaded' });
 await page.waitForSelector('.reference-lobby .lobby-atlas-card', { timeout: 120000 });
 await page.evaluate(() => document.fonts.ready);
 // A default-only run misses the persisted workshop palette that clears
 // background images on every #splash button. Exercise the real renderer.
 for (const id of ['builtin-ink-gold','builtin-blue','builtin-jade']) {
  const state = await page.evaluate(async id => {
   const { builtinPacks } = await import('/noname/ui/workshop/presets.js');
   const { mountAppearance } = await import('/noname/ui/workshop/runtime.js');
   window.referencePaletteDispose?.();
   const pack = builtinPacks().find(pack => pack.manifest.id === id);
   window.referencePaletteDispose = mountAppearance(pack.manifest, path => path);
   const probe = document.createElement('div');
   probe.className='menubutton';probe.style.display='none';document.body.append(probe);
   const generalButtonColor=getComputedStyle(probe).backgroundColor;probe.remove();
   return {id, generalButtonColor, buttons:[...document.querySelectorAll('.reference-lobby .lobby-atlas-card,.reference-lobby .session-bar button')].map(n=>{
    const css=getComputedStyle(n);
    return {name:n.getAttribute('aria-label')||n.textContent, image:n.querySelector('image')?.getAttribute('href')||css.backgroundImage, size:css.backgroundSize, radius:css.borderRadius, border:css.borderImageSource};
   })};
  },id);
  report.palettes.push(state);
  await page.screenshot({path:`${output}/palette-${id}.png`});
  assert.equal(state.buttons.length,15);
  assert.ok(state.buttons.every(n=>(n.image.includes('reference-atlas.png')||n.image.includes('image/splash/shousha/'))&&n.radius==='0px'),`${id}: every mode and navigation button retains its artwork`);
  assert.notEqual(state.generalButtonColor,'rgba(0, 0, 0, 0)','palette still styles ordinary controls');
 }
 await page.evaluate(()=>window.referencePaletteDispose?.());
 // Responsive card geometry must be shared; SVG artwork must use a uniform scale.
 for (const [width, height] of [[1672,941],[1920,911],[2560,1080],[1366,768],[960,540],[390,844]]) {
  await page.setViewportSize({width,height});
  await page.waitForTimeout(1200);
  await page.locator('#splash').evaluate(n=>{n.scrollTop=0;n.scrollLeft=0;});
  const state = await page.evaluate(() => {
   const stage = document.querySelector('.reference-lobby').getBoundingClientRect();
   return { stage: stage.toJSON(), buttons: [...document.querySelectorAll('.lobby-atlas-card')].map(n => {
    const r = n.getBoundingClientRect();
    const css=getComputedStyle(n);
    return { mode:n.dataset.uiMode, rect:r.toJSON(), cssWidth:parseFloat(css.width), cssHeight:parseFloat(css.height), art:(()=>{const svg=n.querySelector('svg'),m=svg.getScreenCTM();return {source:svg.querySelector('image').getAttribute('href'),preserve:svg.getAttribute('preserveAspectRatio'),scaleX:Math.hypot(m.a,m.b),scaleY:Math.hypot(m.c,m.d)};})(), reachable: document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button') === n };
   }) };
  });
  assert.equal(state.buttons.length, 11);
  for(const card of state.buttons) {
   assert.equal(card.art.preserve,'xMidYMid slice');
   assert.ok(Math.abs(card.art.scaleX/card.art.scaleY-1)<.001, card.mode+' artwork never stretches on one axis');
  }
  const byMode=Object.fromEntries(state.buttons.map(b=>[b.mode,b]));
  for(const mode of ['identity','boss']) assert.ok(byMode[mode].art.source.endsWith('/'+mode+'.jpg'),'featured cards use original portrait sources');
  for(const [one,two] of [['identity','boss'],['guozhan','doudizhu'],['versus','single'],['guozhan','versus'],['chess','tafang'],['stone','brawl'],['stone','more']]) {
   assert.ok(Math.abs(byMode[one].rect.width-byMode[two].rect.width)<1 && Math.abs(byMode[one].rect.height-byMode[two].rect.height)<1, one+' and '+two+' have identical card dimensions');
  }
  assert.ok(Math.abs(state.stage.y)<1 && state.stage.height>=height-1, 'artwork fills the viewport height');
  assert.ok(Math.abs(state.stage.x)<1 && state.stage.width>=width-1, 'artwork covers both viewport edges');
  if (width>height) {
   assert.ok(Math.abs(state.stage.width-width)<1, 'landscape has no side bars');
   if(width>=1366) assert.ok(state.buttons.every(n=>n.reachable), 'wide screens show every card without shrinking it');
   const navigation=await page.locator('.session-bar button').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
   assert.ok(navigation[1].right<width/2 && navigation[2].left>width/2, 'session switch stays left and Options/Exit stay right');
  }
  {
   for(const card of state.buttons) {
    const button=page.locator(`[data-ui-mode="${card.mode}"]`);
    await button.scrollIntoViewIfNeeded();
    assert.ok(await button.evaluate(n=>{
     const r=n.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth+1 && document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===n;
    }), `every viewport can reach ${card.mode} without horizontal scrolling`);
   }
  }
  report.sizes.push({width,height,...state});
  await page.locator('#splash').evaluate(n=>{n.scrollTop=0;n.scrollLeft=0;});
  await page.screenshot({path:`${output}/lobby-${width}x${height}.png`});
  await page.locator('.session-options').click();
  const tools=page.locator('#lobby-common-tools');
  assert.deepEqual((await tools.locator('button').allTextContents()).map(s=>s.trim()),['选项','UI 工坊','日志设置','♫ 音乐与音效','武将','卡牌','扩展','其它']);
  const menuRect=await tools.boundingBox(),optionsRect=await page.locator('.session-options').boundingBox();
  assert.ok(menuRect.y>=optionsRect.y+optionsRect.height && menuRect.x>=0 && menuRect.x+menuRect.width<=width+1,'options menu stays below navigation and inside viewport');
  if(width===390) await page.screenshot({path:`${output}/options-390x844.png`});
  await page.locator('.session-options').click();
 }
 await page.setViewportSize({width:1672,height:941});
 await page.waitForTimeout(1200);
 await page.getByRole('button',{name:'更多模式',exact:true}).click();
 await page.locator('.lobby-more-dialog[open]').waitFor();
 await page.getByRole('button',{name:'返回',exact:true}).click();
 await page.locator('.session-options').click();
 await page.locator('#lobby-common-tools').waitFor({state:'visible'});
 await page.locator('.session-options').click();
 await page.locator('.session-switch button').nth(1).click();
 assert.equal(await page.locator('.session-switch button').nth(1).getAttribute('aria-pressed'),'true');
 await page.locator('.session-switch button').first().click();
 await page.locator('[data-ui-mode="guozhan"]').focus();
 assert.equal(await page.evaluate(()=>document.activeElement.dataset.uiMode),'guozhan');
 // Verify real mode dispatch without starting an unrelated full match.
 await page.evaluate(() => {
  const n=document.querySelector('.lobby-atlas-card');
  let c=n.__vueParentComponent;
  while(c && !c.props.click)c=c.parent;
  if(!c)throw Error('mode component unavailable');
  c.props.click=(mode)=>{window.referenceSelectedMode=mode;};
 });
 await page.locator('[data-ui-mode="guozhan"]').press('Enter');
 assert.equal(await page.evaluate(()=>window.referenceSelectedMode),'guozhan');
 assert.notEqual(report.sizes.find(s=>s.width===1920).buttons[0].cssWidth,report.sizes.find(s=>s.width===1366).buttons[0].cssWidth,'cards respond to available width instead of fixed pixels');
 // Render the actual boot HTML and shared stylesheet, including reduced motion.
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.reference-lobby .lobby-atlas-card',{timeout:120000});
 await page.evaluate(async()=>{
  const source=await (await fetch('/index.html')).text();
  const parsed=new DOMParser().parseFromString(source,'text/html');
  document.querySelector('#splash').remove();
  document.querySelector('#noname-boot-status')?.remove();
  document.body.append(parsed.querySelector('#noname-boot-status'));
 });
 await page.waitForTimeout(300);
 await page.evaluate(async()=>{
  await Promise.all(['reference-scene.png','reference-logo.png'].map(name=>new Promise((resolve,reject)=>{
   const image=new Image();image.onload=resolve;image.onerror=reject;image.src='/image/lobby/'+name;
  })));
 });
 for (const [width,height] of [[1920,911],[2560,1080],[1366,768],[390,844]]) {
  await page.setViewportSize({width,height});
  await page.waitForTimeout(1200);
  const boot=await page.locator('#noname-boot-status').evaluate(n=>({rect:n.getBoundingClientRect().toJSON(),size:getComputedStyle(n).backgroundSize}));
  assert.equal(boot.size,'cover','loading scenery fills the screen without side bars');
  assert.ok(Math.abs(boot.rect.x)<1 && Math.abs(boot.rect.y)<1 && boot.rect.width>=width-1 && boot.rect.height>=height-1);
  await page.screenshot({path:`${output}/loading-${width}x${height}.png`});
 }
 assert.equal(await page.locator('.boot-title').getAttribute('aria-label'),'无名杀');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.boot-progress').evaluate(n=>getComputedStyle(n,'::after').animationName),'none');
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify({sizes:report.sizes.map(s=>[s.width,s.height]),errors:report.errors}));
} finally {
 await fs.writeFile(`${output}/report.json`,JSON.stringify(report,null,2));
 await browser.close();
}
