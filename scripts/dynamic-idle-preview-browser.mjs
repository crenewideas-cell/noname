import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='output/dynamic-remediation/20260926-r01/idle-masks-r05/'+(process.env.SKIN_PREVIEW_LABEL||'preview-layout-v2');await fs.mkdir(out);
const entry=JSON.parse(await fs.readFile('output/dynamic-remediation/20260926-r01/idle-masks-r05/browser-v1/entries/base_548a5def3d1b73f9.json'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report={errors:[],sizes:[]};
try{
 const context=await browser.newContext({viewport:{width:1300,height:900}}),page=await context.newPage();await context.routeWebSocket('**',s=>s.close());
 await context.route('**/preview-fixture.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><style>body{margin:0;background:#263445}.qh-window{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1000px;height:700px;font-size:16px}.qh-shousha-big-avatar{position:absolute;left:50px;top:50px;width:230px;height:500px}.qh-image-standard{position:absolute;inset:0}</style><div class="qh-window"><div class="qh-shousha-big-avatar"><div id="portrait" class="qh-image-standard"></div></div></div>'}));
 await context.route('**/runtime/*',async r=>{const name=new URL(r.request().url()).pathname.split('/').at(-1);try{const bytes=await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+name);await r.fulfill({body:bytes,contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.html')?'text/html':'text/css'});}catch{await r.continue();}});
 page.on('pageerror',e=>report.errors.push(String(e)));await page.goto('http://127.0.0.1:8184/preview-fixture.html');
 await page.evaluate(async entry=>{const {createHub}=await import('/noname/skin/localDynamic/bridge.js');window.saved=0;window.hub=createHub({lib:{config:{},arenaReady:[]},game:{saveConfig(){saved++;}},ui:{},_status:{}});hub.packs.test={name:'test',base:location.origin+'/extension/本地动态皮肤包/无名杀基础扩展/',entries:[entry]};hub.previewResource(document.getElementById('portrait'),'test',entry);window.host=[...hub.previews.values()][0];},entry);
 await page.waitForFunction(()=>host.frame?.dataset.ready==='true');
 for(const [width,height] of [[1300,900],[850,900]]){
  await page.setViewportSize({width,height});await page.waitForFunction(()=>document.querySelector('.qh-window').classList.contains('local-skin-adapted'));
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const row=await page.evaluate(()=>{const p=host.frame.contentWindow.skinPlayer;p.pause(true);const r=host.frame.getBoundingClientRect();return{viewport:[innerWidth,innerHeight],frame:{x:r.x,y:r.y,width:r.width,height:r.height},aspect:p.presentation.previewAspect,visiblePixels:Array.from(p.app.renderer.plugins.extract.pixels()).filter((v,i)=>i%4===3&&v>16).length,framingSaved:hub.framing.size,configWrites:saved};});report.sizes.push(row);
  assert.ok(Math.abs(row.frame.width/row.frame.height-row.aspect)<.02);assert.ok(row.visiblePixels>1000);assert.equal(row.configWrites,0);assert.equal(row.framingSaved,0);assert.ok(row.frame.x>=0&&row.frame.y>=0&&row.frame.x+row.frame.width<=width&&row.frame.y+row.frame.height<=height);await page.screenshot({path:out+'/'+width+'.png'});
 }
 await page.evaluate(()=>hub.stopPreview(document.getElementById('portrait')));assert.equal(await page.locator('.local-skin-adapted').count(),0);assert.deepEqual(report.errors,[]);report.passed=true;
}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await browser.close();}
