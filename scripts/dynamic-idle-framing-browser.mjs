import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';
import {compileDecadeScene} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run='output/dynamic-remediation/20260926-r01',work=run+'/idle-masks-r05',out=work+'/'+(process.env.SKIN_IDLE_LABEL||'browser-v1');await fs.mkdir(out,{recursive:true});await fs.mkdir(out+'/entries');await fs.mkdir(out+'/runtime');
const ids=process.env.SKIN_CASE_IDS?.split(',')||['base_2ffdbe289f05a565','base_548a5def3d1b73f9','base_9ad4a25a34ccc857','base_10bdf67606eeb796'];
const inventory=JSON.parse(await fs.readFile(run+'/inventory.json')),runtime=new Map(),sha=b=>createHash('sha256').update(b).digest('hex');for(const n of await fs.readdir('apps/core/noname/skin/localDynamic/runtime'))if(/\.(js|html|css)$/.test(n)){const b=await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+n);runtime.set(n,b);await fs.writeFile(out+'/runtime/'+n,b);}
const report={runtime:[...runtime].map(([file,b])=>({file,sha256:sha(b)})),rows:[]};
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{for(const id of ids){
 const old=inventory.entries.find(e=>e.id===id);let entry;
 try{entry=JSON.parse(await fs.readFile(run+'/external-actions-r03/candidates-v3/entries/'+id+'.json'));}catch{entry=structuredClone(old.effective);entry.scene=compileDecadeScene(old.sourceConfigs[0].config,{sourceConfigHash:old.sourceConfigHash});entry.models=entry.models.map((m,i)=>({...m,role:entry.scene.layers[i].role}));}
 entry.scene.viewport={...entry.scene.viewport,referenceHeight:180,policy:'protected-idle-artwork',evidence:'R05 idle camera guard, measured opaque geometry and flat backing plane detection; explicit sprite actions retain screen contract'};
 if(process.env.SKIN_IDLE_POLICY==='legacy')entry=structuredClone(old.effective);
 await fs.writeFile(out+'/entries/'+id+'.json',JSON.stringify(entry));
 for(const size of [[120,180],[360,600]]){
  const context=await browser.newContext({viewport:{width:size[0],height:size[1]},deviceScaleFactor:1});await context.routeWebSocket('**',s=>s.close());
  await context.route('**/runtime/*',r=>{const n=new URL(r.request().url()).pathname.split('/').at(-1);return runtime.has(n)?r.fulfill({body:runtime.get(n),contentType:n.endsWith('.js')?'text/javascript':n.endsWith('.html')?'text/html':'text/css'}):r.continue();});
  await context.route('**/entries/'+id+'.json',r=>r.fulfill({json:entry}));const page=await context.newPage(),row={id,size,errors:[],frames:[]};report.rows.push(row);page.on('pageerror',e=>row.errors.push(String(e)));
  try{
   await page.goto('http://127.0.0.1:8184/extension/本地动态皮肤包/无名杀基础扩展/runtime/player.html?id='+id+'&presentation=preview');await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
   row.initial=await page.evaluate(()=>{if(skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.pause(true);window.layers=p.engine42?.layers||p.root.children;window.render=dt=>{if(p.engine42)p.engine42.draw(dt);else{layers.forEach(l=>l.update(dt));p.app.render();}};window.elapsed=0;return{fit:p.fit,presentation:p.presentation,fillScene:p.fillScene,animations:layers.map(l=>({idle:l.idle||l.skinIdle,name:l.state.getCurrent(0).animation.name,duration:l.state.getCurrent(0).animation.duration})),transforms:p.engine42?.layers.map(l=>l.transform)};});
   const subject=row.initial.presentation.protectedSubject;
   if(subject)assert.ok(Math.abs(row.initial.fit.x+row.initial.fit.width/2-subject.x-subject.width/2)<1e-4,'principal subject horizontally centered');
   const duration=Math.max(...row.initial.animations.map(a=>a.duration));
   for(const time of [0,duration/2,duration,duration*1.5,duration*2]){
    const sample=await page.evaluate(async time=>{while(elapsed<time-1e-8){const dt=Math.min(1/60,time-elapsed);render(dt);elapsed+=dt;}render(0);const p=skinPlayer,{subjectBounds}=await import('./composition.js'),l=layers.at(-1),native=!!p.engine42,face=subjectBounds(l.skeleton,native?l.transform||{}:{x:l.x,y:l.y,scale:l.scale.x,angle:l.angle});const scale=(p.fillScene?Math.max(innerWidth/p.fit.width,innerHeight/p.fit.height):Math.min(innerWidth/p.fit.width,innerHeight/p.fit.height)*.97),cx=p.fit.x+p.fit.width/2,cy=p.fit.y+p.fit.height/2;
     const pixelFace=face?.width?{x:(face.x-cx)*scale+innerWidth/2,y:(native?cy-face.y-face.height:face.y-cy)*scale+innerHeight/2,width:face.width*scale,height:face.height*scale}:null;
     const c=p.canvas,t=document.createElement('canvas');t.width=c.width;t.height=c.height;const ctx=t.getContext('2d');ctx.drawImage(c,0,0);const data=ctx.getImageData(0,0,t.width,t.height).data;let gray=0,opaque=0;for(let i=0;i<data.length;i+=4){if(data[i+3]>240)opaque++;if(data[i]===80&&data[i+1]===80&&data[i+2]===80&&data[i+3]>240)gray++;}
     return{time,fit:{...p.fit},face:pixelFace,grayPixels:gray,opaquePixels:opaque,loops:layers.map(l=>({name:l.state.getCurrent(0).animation.name,loop:l.state.getCurrent(0).loop,time:l.state.getCurrent(0).trackTime}))};},time);
    row.frames.push(sample);assert.ok(sample.loops.every(l=>l.loop));assert.deepEqual(sample.fit,row.initial.fit);
    if(id==='base_2ffdbe289f05a565')assert.ok(sample.grayPixels<size[0]*size[1]*.005,'flat backing must not form a band');
    if(sample.face)assert.ok(sample.face.x>=-1&&sample.face.y>=-1&&sample.face.x+sample.face.width<=size[0]+1&&sample.face.y+sample.face.height<=size[1]+1,'face protected');
    if(time===0||time===duration||time===duration*2)await page.screenshot({path:out+'/'+id+'-'+size[0]+'-t'+time+'.png',omitBackground:true});
   }
   if(id==='base_548a5def3d1b73f9')assert.equal(row.initial.presentation.cameraGuard?.reason,'anonymous-primary-outside-background');
   if(id==='base_9ad4a25a34ccc857')assert.ok(!row.initial.transforms?.at(-1)?.scale||row.initial.transforms.at(-1).scale<=1);
   row.resizes=[];
   for(const viewport of [{width:90,height:210},{width:240,height:120}]){
    await page.setViewportSize(viewport);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const resize=await page.evaluate(()=>{const p=skinPlayer,s=p.presentation.protectedSubject;if(!s)return{skipped:'anonymous geometry uses contain'};const h=Math.min(p.fit.height,p.fit.width/(innerWidth/innerHeight)),w=h*innerWidth/innerHeight,x=p.fit.x+p.fit.width/2-w/2,y=p.fit.y+p.fit.height/2-h/2;return{subject:s,camera:{x,y,width:w,height:h},inside:s.x>=x-1e-4&&s.y>=y-1e-4&&s.x+s.width<=x+w+1e-4&&s.y+s.height<=y+h+1e-4};});
    row.resizes.push(resize);if(!resize.skipped){assert.equal(resize.inside,true,'resized camera protects head envelope');assert.ok(Math.abs(resize.camera.x+resize.camera.width/2-resize.subject.x-resize.subject.width/2)<1e-4,'resized subject centered');}
   }
   await page.evaluate(()=>skinPlayer.dispose());row.status=row.errors.length?'failed':'passed';
  }catch(error){row.status='failed';row.error=String(error);}
  await context.close();await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({id,size,status:row.status,error:row.error}));
 }
}}finally{await browser.close();}
assert.ok(report.rows.every(r=>r.status==='passed'));
