import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const{chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),origin='http://127.0.0.1:8184',runtime='apps/core/noname/skin/localDynamic/runtime';
const inv=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const prefix='/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('少女前线扩展')+'/',rows=[];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{for(const test of ['normal','settings-cancel','moc-cancel','texture-cancel','physics-cancel','texture-error']){
 const entry=inv.entries.find(e=>e.id===(test==='physics-cancel'?'gf_aki_p2':'gf_jiangyu_dress')).effective;
 const page=await browser.newPage({viewport:{width:240,height:360}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{const fetchOriginal=fetch;window.__fetchPending=0;window.fetch=async(...args)=>{__fetchPending++;try{return await fetchOriginal(...args);}finally{__fetchPending--;}};const create=URL.createObjectURL,revoke=URL.revokeObjectURL;window.__urls=new Set();URL.createObjectURL=(...a)=>{const u=create(...a);__urls.add(u);return u;};URL.revokeObjectURL=u=>{__urls.delete(u);return revoke(u);};});
 await page.route('**/runtime/*',async r=>{const name=new URL(r.request().url()).pathname.split('/').at(-1);try{await r.fulfill({body:await fs.readFile(path.join(runtime,name)),contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.html')?'text/html':'text/css'});}catch(e){if(e.code==='ENOENT')return r.fallback();throw e;}});
 await page.route('**/entries/lifecycle.json',r=>r.fulfill({json:{...entry,id:'lifecycle'}}));
 let release,held=false;const gate=new Promise(r=>release=r);
 await page.route('**/*',async r=>{const p=decodeURIComponent(new URL(r.request().url()).pathname);if(test==='texture-error'&&p.endsWith('.png'))return r.fulfill({status:404,body:'injected missing texture'});const match=test==='settings-cancel'?p.endsWith(entry.model):test==='moc-cancel'?p.endsWith('.moc3'):test==='texture-cancel'?p.endsWith('.png'):test==='physics-cancel'?p.endsWith('.physics3.json'):false;if(match){held=true;await gate;}await r.fallback().catch(()=>{});});
 await page.goto(origin+prefix+'runtime/player.html?id=lifecycle&presentation=preview');
 await page.waitForFunction(()=>window.skinPlayerLifecycle);
 if(test==='normal'){
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
  const ready=await page.evaluate(()=>({error:skinPlayerError,ready:document.documentElement.dataset.skinReady,canvas:document.querySelectorAll('canvas').length}));assert.equal(ready.error,null);assert.equal(ready.ready,'true');assert.ok(ready.canvas>0);await page.waitForTimeout(500);
 }else if(test==='texture-error'){await page.waitForFunction(()=>window.skinPlayerError,null,{timeout:20000});}
 else{for(let i=0;i<240&&!held;i++)await page.waitForTimeout(50);assert.equal(held,true,'Cancellation gate must be reached: '+test);}
 await page.evaluate(()=>{skinPlayerLifecycle.dispose();skinPlayerLifecycle.dispose();});release();await page.waitForTimeout(700);
 const state=await page.evaluate(()=>({phase:skinPlayerLifecycle.phase,canvas:document.querySelectorAll('canvas').length,ready:document.documentElement.dataset.skinReady??null,pending:__fetchPending,objectURLs:__urls.size,error:skinPlayerError}));
 if(test==='texture-error')assert.match(state.error,/404/);else assert.equal(state.error,null);
 const {error,...observed}=state;
 assert.deepEqual(observed,{phase:test==='texture-error'?'error':'disposed',canvas:0,ready:null,pending:0,objectURLs:0});assert.deepEqual(errors,[]);
 rows.push({test,status:'passed',state});console.log(JSON.stringify(rows.at(-1)));await page.close();
}}finally{await browser.close();await fs.writeFile(path.join(run,process.env.SKIN_LIVE2D_LIFECYCLE_REPORT||'live2d-lifecycle.json'),JSON.stringify(rows,null,2));}
