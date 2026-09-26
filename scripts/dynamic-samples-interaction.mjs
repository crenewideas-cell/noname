import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const entries=JSON.parse(await fs.readFile('apps/core/extension/ui/动态皮肤验证扩展/catalog.json','utf8')).entries;
const out='output/dynamic-samples';await fs.mkdir(out,{recursive:true});
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
const reports=[];
try{for(const entry of entries.filter(e=>(!process.argv[2]||e.id===process.argv[2])&&e.type==='live2d')){
 const context=await browser.newContext({viewport:{width:640,height:720},hasTouch:true}),page=await context.newPage();
 const report={id:entry.id,checks:[],errors:[]};reports.push(report);page.on('pageerror',e=>report.errors.push(String(e.stack)));
 await page.addInitScript(()=>{window.__audios=[];const Native=window.Audio;window.Audio=class extends Native{constructor(...args){super(...args);window.__audios.push(this);}};});
 try{
  await page.goto(origin+'/extension/'+encodeURIComponent('动态皮肤验证扩展')+'/runtime/player.html?id='+entry.id+'&interactive=1',{waitUntil:'load'});
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);assert.equal(await page.evaluate(()=>window.skinPlayerError),null);
  const points=await page.evaluate(()=>{
   const p=skinPlayer,targets=new Map(),drags=new Map();
   for(let y=10;y<innerHeight-10;y+=5)for(let x=10;x<innerWidth-10;x+=5){
    const hits=p.hit(x,y),action=p.info().hits.find(h=>h.name===hits.find(name=>p.info().hits.some(h=>h.name===name&&h.action)))?.action;
    if(action){if(!targets.has(action))targets.set(action,[]);targets.get(action).push({x,y,action});}
    const drag=p.info().hits.find(h=>h.name===hits.find(name=>/Drag/.test(name)&&p.info().hits.some(h=>h.name===name&&h.action)));
    if(drag&&!drags.has(drag.action))drags.set(drag.action,{x,y,action:drag.action});
   }
   const centers=[...targets.values()].map(points=>{const cx=points.reduce((a,p)=>a+p.x,0)/points.length,cy=points.reduce((a,p)=>a+p.y,0)/points.length;return points.sort((a,b)=>(a.x-cx)**2+(a.y-cy)**2-(b.x-cx)**2-(b.y-cy)**2)[0];});
   return {clicks:centers,drags:[...drags.values()]};
  });
  report.points=points;
  if(entry.id==='az_9600141'){
   points.drags=await page.evaluate(async()=>{
    const p=skinPlayer,im=p.model.internalModel,found=new Map();
    for(const state of p.entry.motions.filter(m=>/^idle/.test(m))){
     await p.motion(state,false);await new Promise(r=>setTimeout(r,100));
     for(const h of p.info().hits.filter(h=>/Drag/.test(h.name)&&h.action)){
      const bounds=im.getDrawableBounds(h.index),local=im.localTransform.apply({x:bounds.x+bounds.width/2,y:bounds.y+bounds.height/2}),pt=p.model.toGlobal(local);
      if(pt.x>0&&pt.x<innerWidth-30&&pt.y>0&&pt.y<innerHeight-30&&p.hit(pt.x,pt.y).includes(h.name)&&!found.has(h.action))found.set(h.action,{x:pt.x,y:pt.y,action:h.action,state});
     }
    }p.reset();return [...found.values()];
   });
   assert.equal(points.drags.length,3,'All three provided drag motions have reachable regions in their matching idle states');
  }
  for(const kind of ['mouse','touch']){
   const point=points.clicks.find(p=>p.action==='touch_head')||points.clicks[0];if(!point)continue;
   await page.evaluate(()=>skinPlayer.reset());await page.waitForTimeout(150);
   if(kind==='mouse')await page.mouse.click(point.x,point.y);else await page.touchscreen.tap(point.x,point.y);
   await page.waitForFunction(action=>skinPlayer.lastMotion===action,point.action);
   report.checks.push(kind+' hit triggers '+point.action);
   if(entry.id==='az_9600141'){await page.waitForFunction(()=>__audios.some(a=>a.currentTime>0&&!a.paused));report.checks.push(kind+' hit automatically plays matching costume voice');}
  }
  for(const point of points.drags){
   await page.evaluate(()=>skinPlayer.reset());await page.waitForTimeout(100);
   if(point.state){await page.evaluate(state=>skinPlayer.motion(state,false),point.state);await page.waitForTimeout(150);}
   await page.mouse.move(point.x,point.y);await page.mouse.down();await page.mouse.move(point.x+25,point.y+15,{steps:4});await page.mouse.up();
   await page.waitForFunction(action=>skinPlayer.lastMotion===action,point.action);report.checks.push('mouse drag triggers '+point.action);
  }
  if(points.drags.length){
   const point=points.drags[0];await page.evaluate(()=>skinPlayer.reset());await page.waitForTimeout(100);
   if(point.state){await page.evaluate(state=>skinPlayer.motion(state,false),point.state);await page.waitForTimeout(150);}
   const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:point.x+25,y:point.y+15}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await page.waitForFunction(action=>skinPlayer.lastMotion===action,point.action);report.checks.push('touch drag triggers '+point.action);
  }
  const control=await page.evaluate(async()=>{
   const p=skinPlayer,core=p.model.internalModel.coreModel,par=p.info().parameters.find(v=>v.max>v.min),layer=p.info().layers.find(v=>core.getDrawableOpacity(+v.id)>.1);
   let parameter=false;
   if(par){p.setParameter(par.id,par.max);await new Promise(r=>p.model.internalModel.once('beforeModelUpdate',()=>{parameter=Math.abs(core.getParameterValueById(par.id)-par.max)<.01;r();}));}
   if(par)p.setParameter(par.id,null);
   let hidden,restored;if(layer){p.setLayer(layer.id,false);hidden=core.getDrawableOpacity(+layer.id)===0;p.setLayer(layer.id,true);restored=core.getDrawableOpacity(+layer.id)>0;}
   return {parameter,hidden,restored,expressions:p.info().expressions.length};
  });report.controls=control;assert.ok(control.parameter&&control.hidden&&control.restored);
  report.checks.push('parameter override/release and drawable hide/restore');
  await page.mouse.move(630,50);await page.waitForFunction(()=>Math.abs(skinPlayer.model.internalModel.focusController.x)+Math.abs(skinPlayer.model.internalModel.focusController.y)>.1);
  report.checks.push('pointer movement drives model focus');
  if(!points.clicks.length&&entry.motions.some(n=>/^(touch|tap|click)(_|$)/i.test(n))){
   const first=entry.motions.find(n=>/^(touch|tap|click)(_|$)/i.test(n));
   for(const kind of ['mouse','touch']){await page.evaluate(()=>skinPlayer.reset());if(kind==='mouse')await page.mouse.click(320,360);else await page.touchscreen.tap(320,360);await page.waitForFunction(action=>skinPlayer.lastMotion===action,first);report.checks.push(kind+' generic preview triggers provided '+first);}
  }
  if(await page.evaluate(()=>skinPlayer.info().voices.length>0)){
   await page.mouse.click(1,1);const played=await page.evaluate(()=>skinPlayer.playVoice(0));assert.ok(played);
   await page.waitForFunction(()=>__audios.some(a=>a.currentTime>0&&!a.paused));report.checks.push('bundled voice decodes and plays');
  }
  await page.evaluate(()=>window.postMessage({type:'noname-skin-options',channel:'',interactive:false},'*'));await page.waitForTimeout(100);
  const idle=await page.evaluate(()=>skinPlayer.lastMotion);const p=points.clicks[0];if(p){await page.mouse.click(p.x,p.y);await page.touchscreen.tap(p.x,p.y);await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x+40,p.y+40);await page.mouse.up();}
  await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>skinPlayer.lastMotion),idle);assert.ok(await page.evaluate(()=>__audios.every(a=>a.paused)));
  report.checks.push('disabled interaction suppresses mouse/touch/drag and stops voice');
  assert.deepEqual(report.errors,[]);
 }catch(error){report.failure=error.stack;}
 finally{await context.close();await fs.writeFile(out+'/interaction-report.json',JSON.stringify(reports,null,2));}
 console.log(entry.id,report.failure?'FAIL '+report.failure.split('\n')[0]:'PASS',report.checks);
}}finally{await browser.close();}
assert.ok(reports.every(r=>!r.failure),'Interaction checks failed: output/dynamic-samples/interaction-report.json');
