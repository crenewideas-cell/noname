import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const prefix='/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/',results=[];
const runtime=path.resolve('apps/core/noname/skin/localDynamic/runtime');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const fixture={skeleton:{spine:'3.8.99'},bones:[{name:'root'}],slots:[{name:'slot',bone:'root',attachment:'quad'}],skins:[{name:'default',attachments:{slot:{quad:{type:'region',width:100,height:100}}}}],animations:{idle:{bones:{root:{translate:[{time:0},{time:1,x:20}]}}}}};
const entry={id:'lifecycle',type:'spine',models:[{skeleton:'fixture.json',atlas:'fixture.atlas',version:'3.8.99'}],motions:['idle'],idle:'idle'};
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const native36=inventory.entries.find(e=>e.id==='base_cdf8a6c7aee4577a').effective;
try{
 for(const test of ['normal','metadata-cancel','script-cancel','model-cancel','texture-edge','texture-error','declared-size','native36-model-cancel','native36-texture-cancel','native42-model-cancel','native42-texture-cancel']){
  const current=test==='declared-size'?{...entry,models:[{...entry.models[0],version:'4.0.56'}]}:test.startsWith('native36')?{...native36,id:'lifecycle'}:test.startsWith('native42')?{...entry,type:'spine42',models:[{...entry.models[0],version:'4.2.37'}]}:entry;
  const page=await browser.newPage({viewport:{width:240,height:360}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  let release;const gate=new Promise(resolve=>release=resolve);let held=false;
  await page.route('**/runtime/**',async route=>{
   const name=new URL(route.request().url()).pathname.split('/').at(-1);
   if(test==='script-cancel'&&name==='pixi-spine.js'){held=true;await gate;return route.continue().catch(()=>{});}
   if(!/^[a-z0-9-]+\.(js|html|css)$/.test(name)||route.request().url().includes('/vendor/'))return route.continue();
   try{await route.fulfill({body:await fs.readFile(path.join(runtime,name)),contentType:name.endsWith('.js')?'text/javascript':'text/html'});}catch(error){if(error.code==='ENOENT')return route.continue();throw error;}
  });
  await page.route('**/entries/lifecycle.json',async route=>{if(test==='metadata-cancel'){held=true;await gate;}await route.fulfill({json:current}).catch(()=>{});});
  await page.route('**/fixture.json',async route=>{if(test==='model-cancel'){held=true;await gate;}await route.fulfill({json:{...fixture,skeleton:{spine:test==='declared-size'?'4.0.56':test.startsWith('native42')?'4.2.37':'3.8.99'}}}).catch(()=>{});});
  await page.route('**/fixture.atlas',route=>route.fulfill({body:test==='declared-size'?'fixture.png\nsize:4,2\nfilter:Nearest,Nearest\nquad\nbounds:2,0,2,2\noffsets:0,0,2,2\n':`fixture.png\nsize: 1,1\nformat: RGBA8888\nfilter: Nearest,Nearest\nrepeat: none\nquad\n  rotate: false\n  xy: 0, 0\n  size: ${test==='texture-error'?3:test==='texture-edge'?2:1}, 1\n  orig: 1, 1\n  offset: 0, 0\n  index: -1\n`}));
  // A real one-pixel PNG is generated in the independent browser, not supplied by the renderer.
  await page.route('**/lifecycle-fixture.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
  await page.goto(origin+'/lifecycle-fixture.html');
  const png=await page.evaluate(declared=>{const c=document.createElement('canvas');c.width=declared?2:1;c.height=1;const ctx=c.getContext('2d');ctx.fillStyle='#ff2020';ctx.fillRect(0,0,1,1);if(declared){ctx.fillStyle='#00ff00';ctx.fillRect(1,0,1,1);}return c.toDataURL().split(',')[1];},test==='declared-size');
  await page.route('**/fixture.png',route=>route.fulfill({body:Buffer.from(png,'base64'),contentType:'image/png'}));
  if(test.startsWith('native'))await page.route('**/*',async route=>{
   const pathname=decodeURIComponent(new URL(route.request().url()).pathname);
   if(test.includes('-model-')?pathname.endsWith('/'+current.models[0].skeleton):pathname.endsWith('.png')){held=true;await gate;}
   await route.fallback().catch(()=>{});
  });
  await page.goto(origin+prefix+'runtime/player.html?id=lifecycle&presentation=preview',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.skinPlayerLifecycle);
  if(test.endsWith('cancel')){
   for(let i=0;i<200&&!held;i++)await page.waitForTimeout(25);assert.equal(held,true,'request gate must actually be reached');
   await page.evaluate(()=>skinPlayerLifecycle.dispose());release();await page.waitForTimeout(300);
  }else{
   release();await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:10000});
   if(test==='normal'||test==='texture-edge')await page.evaluate(()=>{if(!skinPlayer.canvas.width)throw Error('Missing canvas');skinPlayer.dispose();skinPlayer.dispose();});
   if(test==='declared-size'){
    const pixel=await page.evaluate(()=>{if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.app.render();const gl=p.app.renderer.gl,rgba=new Uint8Array(4);gl.readPixels(120,180,1,1,gl.RGBA,gl.UNSIGNED_BYTE,rgba);p.dispose();return[...rgba];});
    assert.deepEqual(pixel,[0,255,0,255],'Declared atlas coordinates must sample the right green texel of the smaller source image');
   }
  }
  const state=await page.evaluate(()=>({phase:skinPlayerLifecycle.phase,pendingLoads:skinPlayerLifecycle.pendingLoads,canvas:document.querySelectorAll('canvas').length,ready:document.documentElement.dataset.skinReady??null,error:window.skinPlayerError}));
  assert.equal(state.phase,test==='texture-error'?'error':'disposed');assert.equal(state.pendingLoads,0);assert.equal(state.canvas,0);assert.equal(state.ready,null);
  if(test==='texture-error')assert.match(state.error,/图集区域越界/);else{assert.equal(state.error,null);assert.deepEqual(errors,[]);}
  results.push({test,status:'passed',state,expectedPageErrors:errors});await page.close();console.log(JSON.stringify(results.at(-1)));
 }
}finally{await browser.close();await fs.writeFile(path.join(run,process.env.SKIN_LIFECYCLE_REPORT||'lifecycle-native-scope-browser.json'),JSON.stringify(results,null,2));}
