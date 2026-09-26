import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const root='apps/core/extension/ui/动态皮肤验证扩展/',out='output/dynamic-performance';
const catalog=JSON.parse(await fs.readFile(root+'catalog.json','utf8'));
const baseline=process.argv.includes('--compare');
const results=[];
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
try{
 for(const mode of baseline?['before','after']:['after'])for(const type of ['live2d','spine','spine42']){
  const entry=catalog.entries.find(e=>e.type===type),context=await browser.newContext({viewport:{width:640,height:720}}),page=await context.newPage();
  const result={mode,type,id:entry.id,errors:[],missing:[]};results.push(result);
  page.on('pageerror',e=>result.errors.push(String(e.stack||e)));
  page.on('response',r=>{if(r.status()>=400)result.missing.push(r.url());});
  if(mode==='before')await context.route('**/runtime/*',async route=>{
   const file=new URL(route.request().url()).pathname.split('/').pop();
   if(!['player.html','player.js','spine42.js'].includes(file))return route.continue();
   await route.fulfill({body:await fs.readFile(out+'/before/'+file),contentType:file.endsWith('html')?'text/html':'application/javascript'});
  });
  await context.route('**/__dynamic_perf__.html',route=>route.fulfill({body:'<!doctype html><body style="margin:0">',contentType:'text/html'}));
  try{
   await page.goto(origin+'/__dynamic_perf__.html');
   const start=performance.now();
   await page.evaluate(({entry,origin})=>{
    const f=document.createElement('iframe');f.__nonameSkinEntry=entry;
    f.style.cssText='width:640px;height:720px;border:0';f.src=origin+'/extension/'+encodeURIComponent('动态皮肤验证扩展')+'/runtime/player.html?id='+entry.id;document.body.append(f);
   },{entry,origin});
   const frame=await (await page.locator('iframe').elementHandle()).contentFrame();
   await frame.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
   assert.equal(await frame.evaluate(()=>window.skinPlayerError),null);
   result.readyMs=Math.round(performance.now()-start);
   result.resources=await frame.evaluate(()=>performance.getEntriesByType('resource').map(r=>({url:decodeURI(r.name).split('/runtime/').pop(),bytes:r.decodedBodySize})).filter(r=>r.url.includes('vendor/')||r.url.endsWith('catalog.json')));
   if(mode==='after'){
    assert.equal(result.resources.some(r=>r.url.endsWith('catalog.json')),false,'Embedded player must not parse entire catalog');
    if(type==='spine42')assert.equal(result.resources.some(r=>r.url.includes('pixi')||r.url.includes('live2d')),false);
    if(type==='live2d')assert.equal(result.resources.some(r=>r.url.includes('spine')),false);
    if(type==='spine')assert.equal(result.resources.some(r=>r.url.includes('live2d')),false);
   }
   result.actions=await frame.evaluate(async()=>{const p=skinPlayer,played=[];for(const m of p.info().motions)played.push(await p.motion(m,false));p.reset();return played;});
   assert.ok(result.actions.every(Boolean));
   result.render=await frame.evaluate(()=>{
    const p=skinPlayer,c=p.engine42?.canvas||p.app.view;p.engine42?p.engine42.draw():p.app.render();
    const gl=c.getContext('webgl2')||c.getContext('webgl'),pixels=new Uint8Array(c.width*c.height*4);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let nonempty=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i])nonempty++;
    return {nonempty,fit:p.fit,presentation:p.presentation};
   });
   assert.ok(result.render.nonempty>100);
   if(mode==='after'){
    await frame.evaluate(()=>{window.__draws=0;const p=skinPlayer;if(p.engine42)p.engine42.setOnDraw(()=>__draws++);else p.app.renderer.on('postrender',()=>__draws++);});
    await page.evaluate(()=>document.querySelector('iframe').contentWindow.postMessage({type:'noname-skin-pause',channel:'',paused:true},'*'));
    await page.waitForTimeout(100);
    const stopped=await frame.evaluate(()=>({draws:__draws,elapsed:skinPlayer.model?.elapsedTime}));
    await page.waitForTimeout(200);
    assert.deepEqual(await frame.evaluate(()=>({draws:__draws,elapsed:skinPlayer.model?.elapsedTime})),stopped);
    await page.evaluate(()=>document.querySelector('iframe').contentWindow.postMessage({type:'noname-skin-pause',channel:'',paused:false},'*'));
    await frame.waitForFunction(n=>__draws>n,stopped.draws);
    result.pauseResume=true;
   }
   assert.equal(result.errors.length,0);assert.equal(result.missing.length,0);
  }catch(e){result.failure=e.stack;}
  finally{await context.close();await fs.mkdir(out,{recursive:true});await fs.writeFile(out+'/runtime.json',JSON.stringify(results,null,2));}
  console.log(mode,type,result.failure||{readyMs:result.readyMs,resources:result.resources,actions:result.actions?.length});
 }
}finally{await browser.close();}
assert.ok(results.every(r=>!r.failure),'See output/dynamic-performance/runtime.json');
