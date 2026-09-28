import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const out=path.join(run,'native-resource-stress');await fs.mkdir(out,{recursive:true});
const runtime=path.resolve('apps/core/noname/skin/localDynamic/runtime'),snapshot=new Map();
for(const f of await fs.readdir(runtime))if(/\.(js|html|css)$/.test(f))snapshot.set(f,await fs.readFile(path.join(runtime,f)));
await fs.writeFile(path.join(out,'runtime-hashes.json'),JSON.stringify([...snapshot].map(([name,b])=>({name,sha256:createHash('sha256').update(b).digest('hex')})),null,2));
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const ids=['base_cdf8a6c7aee4577a','mjs_3585a21ef01f0707'];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report={cycles:[],errors:[],scope:'200 create/draw/destroy cycles in persistent pages, real 3.6 and 4.2 assets; not the 30-minute game acceptance'};
try{
 for(const id of ids){
  const e=inventory.entries.find(e=>e.id===id),entry=e.effective,base=origin+'/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent(e.pack)+'/';
  const page=await browser.newPage({viewport:{width:240,height:360}});page.on('pageerror',error=>report.errors.push(String(error)));
  await page.route('**/runtime/native-stress.html',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:'<!doctype html><html><meta charset="utf-8"><body style="margin:0;background:transparent"></body></html>'}));
  await page.route('**/runtime/*.js',r=>{const name=new URL(r.request().url()).pathname.split('/').at(-1);return snapshot.has(name)?r.fulfill({body:snapshot.get(name),contentType:'text/javascript'}):r.fallback();});
  await page.goto(base+'runtime/native-stress.html');
  await page.evaluate(()=>{
   const add=document.addEventListener.bind(document),remove=document.removeEventListener.bind(document),listeners=new Set();
   document.addEventListener=function(type,fn,...args){if(type==='visibilitychange')listeners.add(fn);return add(type,fn,...args);};
   document.removeEventListener=function(type,fn,...args){if(type==='visibilitychange')listeners.delete(fn);return remove(type,fn,...args);};
   const request=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window),frames=new Set();
   window.requestAnimationFrame=fn=>{const id=request(t=>{frames.delete(id);fn(t);});frames.add(id);return id;};
   window.cancelAnimationFrame=id=>{frames.delete(id);cancel(id);};
   window.__resourceCounts=()=>({canvas:document.querySelectorAll('canvas').length,visibilityListeners:listeners.size,animationFrames:frames.size});
  });
  await page.addScriptTag({url:base+'runtime/framing.js'});
  await page.addScriptTag({url:base+'runtime/'+(entry.type==='spine42'?'spine42.js':'spine36.js')});
  const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
  for(let cycle=0;cycle<100;cycle++){
   const result=await page.evaluate(async({entry,base})=>{
    const start=performance.now(),engine=await (entry.type==='spine42'?createSpine42:createSpine36)(entry,p=>new URL(p.split('/').map(encodeURIComponent).join('/'),base).href,{scale:1,x:0,y:0});
    engine.pause(true);engine.draw(1);const loadMs=performance.now()-start;
    const gl=engine.canvas.getContext('webgl2')||engine.canvas.getContext('webgl');const pixels=new Uint8Array(engine.canvas.width*engine.canvas.height*4);gl.readPixels(0,0,engine.canvas.width,engine.canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let visible=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i])visible++;
    engine.destroy();engine.destroy();return{loadMs,visible,...__resourceCounts()};
   },{entry,base});
   assert.ok(result.visible>1000);assert.equal(result.canvas,0);assert.equal(result.visibilityListeners,0);assert.equal(result.animationFrames,0);
   if(cycle%10===0||cycle===99){await cdp.send('HeapProfiler.collectGarbage');const metrics=await cdp.send('Performance.getMetrics');result.heap=metrics.metrics.find(m=>m.name==='JSHeapUsedSize')?.value;}
   report.cycles.push({id,cycle,...result});
   if(cycle%10===0||cycle===99){console.log(JSON.stringify(report.cycles.at(-1)));await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));}
  }
  await page.close();
 }
 assert.deepEqual(report.errors,[]);report.completed=true;
}finally{await browser.close();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));}
