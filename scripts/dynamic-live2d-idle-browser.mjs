import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const all=process.argv.includes('--all');
const out=path.join(run,all?'live2d-declared-idle-all':'live2d-declared-idle');await fs.mkdir(out,{recursive:true});
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const affected=inventory.entries.filter(e=>e.effective?.type==='live2d'&&e.effective.idle&&!/^(idle\d*|normal\w*|loop\w*|stand\w*|wait\w*)$/i.test(e.effective.idle));
await fs.writeFile(path.join(out,'impact.json'),JSON.stringify({count:affected.length,entries:affected.map(e=>({id:e.id,pack:e.pack,idle:e.effective.idle}))},null,2));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
try{
 for(const id of all?affected.map(e=>e.id):['gf_abigail_p2'])for(const candidate of [false,true]){
  const caseOut=all?path.join(out,id):out;await fs.mkdir(caseOut,{recursive:true});
  const context=await browser.newContext({viewport:{width:240,height:360}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.route('**/runtime/*',async route=>{
   const name=new URL(route.request().url()).pathname.split('/').at(-1);if(!/^[a-z0-9-]+\.(js|html|css)$/.test(name))return route.fallback();
   const root=candidate?'apps/core/noname/skin/localDynamic/runtime':path.join(run,'library-loading-v1/runtime');
   try{await route.fulfill({body:await fs.readFile(path.join(root,name)),contentType:name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.html')?'text/html; charset=utf-8':'text/css'});}catch(e){if(e.code==='ENOENT')return route.fallback();throw e;}
  });
  await page.goto(origin+'/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent(inventory.entries.find(e=>e.id===id).pack)+'/runtime/player.html?id='+id+'&presentation=preview');
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
  const before=await page.evaluate(async()=>{
   if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer,m=p.model.internalModel.motionManager,clip=await m.loadMotion(p.entry.idle,0);
   window.__idleStarts=0;m.on('motionStart',()=>__idleStarts++);
   const stream=p.canvas.captureStream(60),chunks=[],recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'});recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.start();window.__recording={stream,chunks,recorder};
   return{id:p.entry.id,idle:p.entry.idle,looping:clip.isLoop(),duration:clip.getLoopDuration(),canvas:!!p.canvas};
  });
  assert.equal(before.looping,candidate);assert.ok(before.duration>0);
  await page.screenshot({path:path.join(caseOut,candidate?'candidate-first.png':'before-first.png')});
  await page.waitForTimeout(Math.min(60000,(before.duration*2+.3)*1000));
  const after=await page.evaluate(async()=>{const p=skinPlayer,m=p.model.internalModel.motionManager,clip=await m.loadMotion(p.entry.idle,0);return{looping:clip.isLoop(),restarts:__idleStarts};});
  if(candidate)assert.equal(after.restarts,0);else assert.ok(after.restarts>=1);
  const video=path.join(caseOut,candidate?'candidate.webm':'before.webm');
  const bytes=await page.evaluate(async()=>{const {stream,chunks,recorder}=__recording;await new Promise(resolve=>{recorder.onstop=resolve;recorder.stop();});stream.getTracks().forEach(t=>t.stop());return await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(new Blob(chunks,{type:'video/webm'}));});});
  await fs.writeFile(video,Buffer.from(bytes,'base64'));
  assert.deepEqual(errors,[]);results.push({candidate,before,after,errors,video,observedSeconds:Math.min(60,before.duration*2+.3)});
  await context.close();
  await fs.writeFile(path.join(out,'report.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results.at(-1)));
 }
}finally{await browser.close();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(results,null,2));}
console.log(JSON.stringify({affected:affected.length,results}));
