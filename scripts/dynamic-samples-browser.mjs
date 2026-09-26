import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const root='apps/core/extension/ui/动态皮肤验证扩展/';
const catalog=JSON.parse(await fs.readFile(root+'catalog.json','utf8'));
const out='output/dynamic-samples';await fs.mkdir(out,{recursive:true});
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
const reports=[];
try{
 for(const e of catalog.entries.filter(e=>!process.argv[2]||e.id===process.argv[2])){
  const context=await browser.newContext({viewport:{width:640,height:720},hasTouch:true});const page=await context.newPage();
  const report={id:e.id,type:e.type,category:e.testCategory,errors:[],missing:[]};reports.push(report);
  page.on('pageerror',err=>report.errors.push(String(err.stack||err)));
  page.on('response',r=>{if(r.status()>=400)report.missing.push(r.url());});
  await page.addInitScript(()=>{window.__audios=[];const Native=window.Audio;window.Audio=class extends Native{constructor(...args){super(...args);window.__audios.push(this);}};});
  try{
   await page.goto(origin+'/extension/'+encodeURIComponent('动态皮肤验证扩展')+'/runtime/player.html?id='+e.id+'&interactive=1',{waitUntil:'load'});
   await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
   assert.equal(await page.evaluate(()=>window.skinPlayerError),null);
   report.info=await page.evaluate(()=>skinPlayer.info());
   report.actions=await page.evaluate(async()=>{const result=[];for(const name of skinPlayer.info().motions)result.push({name,played:!!await skinPlayer.motion(name,false)});return result;});
   assert.ok(report.actions.every(a=>a.played),'Every declared animation loads');
   await page.evaluate(()=>skinPlayer.reset());await page.waitForTimeout(250);
   report.render=await page.evaluate(()=>{const p=skinPlayer;const c=p.engine42?.canvas||p.app.view;const gl=c.getContext('webgl2')||c.getContext('webgl');if(p.engine42)p.engine42.draw();else p.app.render();const pixels=new Uint8Array(c.width*c.height*4);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let nonempty=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i])nonempty++;return {width:c.width,height:c.height,nonempty};});
   assert.ok(report.render.nonempty>100,'Rendered model is nonempty');
   report.unmapped=report.info.hits.filter(h=>!h.action).map(h=>h.name);
   if(e.type!=='live2d'){
    const action=report.info.motions.find(n=>n!==e.idle);
    if(action){
     await page.mouse.click(320,360);await page.waitForFunction(name=>skinPlayer.lastMotion===name,action);
     await page.evaluate(()=>skinPlayer.reset());await page.touchscreen.tap(320,360);await page.waitForFunction(name=>skinPlayer.lastMotion===name,action);
     report.pointerPreview=true;
    }
    report.layers=await page.evaluate(()=>{const p=skinPlayer;return p.info().layers.map(layer=>{p.setLayer(layer.id,false);const off=p.engine42?!p.engine42.layers[+layer.id].enabled:!p.root.children[+layer.id].visible;p.setLayer(layer.id,true);const on=p.engine42?p.engine42.layers[+layer.id].enabled:p.root.children[+layer.id].visible;return {id:layer.id,off,on};});});
    assert.ok(report.layers.every(l=>l.off&&l.on));
    for(const expression of report.info.expressions){await page.evaluate(name=>window.postMessage({type:'noname-skin-expression',channel:'',name},'*'),expression);await page.waitForFunction(name=>skinPlayer.lastMotion===name,expression);}
    report.expressionsVerified=report.info.expressions.length;
    if(report.info.voices.length){await page.mouse.click(1,1);assert.ok(await page.evaluate(()=>skinPlayer.playVoice(0)));await page.waitForFunction(()=>__audios.some(a=>a.currentTime>0&&!a.paused));report.voicePlayback=true;}
   }
  }catch(error){report.failure=error.stack;}
  finally{await context.close();await fs.writeFile(out+'/render-report.json',JSON.stringify(reports,null,2));}
  console.log(e.id,report.failure?'FAIL '+report.failure.split('\n')[0]:'PASS',report.actions?.length,report.info?.hits?.length);
 }
}finally{await browser.close();}
assert.ok(reports.every(r=>!r.failure&&!r.errors.length&&!r.missing.length),'All models render and animations load; see output/dynamic-samples/render-report.json');
