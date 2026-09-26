import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8081';
const base=origin+'/extension/本地动态皮肤包/无名杀基础扩展/';
const completed=JSON.parse(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/completed-backgrounds.json'));
const ids=[...new Set(['base_022f539d1118533e','base_a364362f4c82685f','base_4e06eb71780fb3d3',...completed.map(e=>e.id)])];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const report=[];
try{
 for(const id of ids){
  const page=await browser.newPage({viewport:{width:360,height:600}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'runtime/player.html?id='+id+'&presentation=preview');
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
  const result=await page.evaluate(async()=>{
   if(window.skinPlayerError)throw Error(skinPlayerError);
   const p=skinPlayer,e=p.engine42;e.pause(true);
   const {faceAnchor}=await import('./composition.js');
   const foreground=e.layers.at(-1),face=faceAnchor(foreground.skeleton,foreground.transform);
   const scale=Math.max(innerWidth/p.fit.width,innerHeight/p.fit.height);
   const gl=e.canvas.getContext('webgl2')||e.canvas.getContext('webgl'),pixels=new Uint8Array(e.canvas.width*e.canvas.height*4);
   gl.readPixels(0,0,e.canvas.width,e.canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
   let solid=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>240)solid++;
   return {id:p.entry.id,title:p.entry.title,fit:p.fit,transform:foreground.transform,faceX:Number.isFinite(face) ? .5+(face-p.fit.x-p.fit.width/2)*scale/innerWidth:null,opaque:solid/(pixels.length/4),times:e.layers.map(l=>l.state.tracks[0].trackTime),inferred:p.entry.inferredBackground};
  });
  await page.screenshot({path:`output/dynamic-cases/${id}-fixed.png`});
  assert.deepEqual(errors,[]);assert.ok(result.times.every(t=>t>=0),'Animation clocks never run backward');
  if(completed.some(e=>e.id===id)){assert.ok(result.inferred);assert.ok(result.opaque>.93,'Recovered scene fills the portrait');}
  if(result.faceX!==null)assert.ok(result.faceX>.1&&result.faceX<.9,'Face remains inside the portrait');
  report.push(result);await page.close();
 }
 const pair=report.slice(0,2);assert.ok(Math.abs(pair[0].transform.scale-pair[1].transform.scale)<.001,'Same geometry uses the same scale');
 assert.deepEqual(pair[0].fit,pair[1].fit,'Equivalent rigs must have the same initial camera despite edition flags');
 // Verify load fallback with transparent artwork, missing files and rapid reuse.
 const page=await browser.newPage();await page.route('**/portrait-test',r=>r.fulfill({contentType:'text/html',body:'<body></body>'}));
 await page.goto(origin+'/portrait-test');
 const fallback=await page.evaluate(async()=>{
  const {setPortraitBackground}=await import('/noname/util/portraitThumbnails.ts');
  const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;const c=canvas.getContext('2d');c.fillStyle='blue';c.fillRect(0,16,32,16);const transparent=canvas.toDataURL();c.fillStyle='red';c.fillRect(0,0,32,32);const red=canvas.toDataURL();
  const node=document.createElement('div');node.style.cssText='width:100px;height:100px';document.body.append(node);
  const until=async f=>{for(let i=0;i<100&&!f();i++)await new Promise(r=>setTimeout(r,20));if(!f())throw Error('fallback did not settle');};
  setPortraitBackground(node,[transparent,red],'');await new Promise(r=>setTimeout(r,100));
  const layered=node.style.backgroundImage.includes(red);
  setPortraitBackground(node,['/missing-portrait-regression.png',red],'');await until(()=>node.style.backgroundImage.includes(red));
  const recovered=true;setPortraitBackground(node,['/missing-other-regression.png',red],'');setPortraitBackground(node,[transparent],'');await new Promise(r=>setTimeout(r,100));
  return {layered,recovered,stale:node.style.backgroundImage.includes(red)};
 });
 assert.deepEqual(fallback,{layered:false,recovered:true,stale:false});
 console.log(JSON.stringify({scenes:report.length,fallback}));
}finally{await fs.writeFile('output/dynamic-cases/shared-regression.json',JSON.stringify(report,null,2));await browser.close();}
