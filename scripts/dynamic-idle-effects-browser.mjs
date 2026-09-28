import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin='http://127.0.0.1:8184',base=origin+'/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/';
const work='output/dynamic-remediation/20260926-r01',out=path.join(work,'idle-masks-r05',process.env.SKIN_EFFECT_LABEL||'effects-v1');
await fs.mkdir(out,{recursive:true});const bytes=new Map(),sha=b=>createHash('sha256').update(b).digest('hex');
for(const file of await fs.readdir('apps/core/noname/skin/localDynamic/runtime'))if(/\.(js|css|html)$/.test(file))bytes.set('/runtime/'+file,await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+file));
for(const file of ['bridge.js','effect-host.js'])bytes.set('/noname/skin/localDynamic/'+file,await fs.readFile('apps/core/noname/skin/localDynamic/'+file));
await fs.mkdir(path.join(out,'tested-bytes'));for(const [key,b] of bytes)await fs.writeFile(path.join(out,'tested-bytes',key.replaceAll('/','_')),b);
const report={runtime:[...bytes].map(([file,b])=>({file,sha256:sha(b)})),rows:[],errors:[]};
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{for(const [index,id]of ['base_3548949c34b6ea5c','base_10bdf67606eeb796','base_0bd95d2722e02076','base_169c8a25e70bb8ad','base_dd28794bc31102d4','base_548a5def3d1b73f9'].entries()){
 const context=await browser.newContext({viewport:{width:1000,height:700},deviceScaleFactor:index%2?2:1});await context.routeWebSocket('**',s=>s.close());
 await context.route('**/*',r=>{const u=new URL(r.request().url()),match=[...bytes].find(([key])=>u.pathname.endsWith(key));return match?r.fulfill({body:match[1],contentType:u.pathname.endsWith('.html')?'text/html':u.pathname.endsWith('.css')?'text/css':'text/javascript'}):r.continue();});
 await context.route('**/effect-fixture.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><style>body{margin:0;background:#28344b}#clip{position:absolute;left:50px;top:330px;width:180px;height:270px;overflow:hidden;transform:translateZ(0)}#portrait{position:relative;width:180px;height:270px} .local-dynamic-effect::backdrop{background:transparent;pointer-events:none}</style><div id="clip"><div id="portrait"></div></div>'}));
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
 const entry=JSON.parse(await fs.readFile(path.join(work,'idle-masks-r05/browser-v1/entries',id+'.json')).catch(()=>fs.readFile(path.join(work,'external-actions-r03/candidates-v3/entries',id+'.json')))),row={id,actions:[],entrySHA256:sha(JSON.stringify(entry))};report.rows.push(row);
 try{
  await page.goto(origin+'/effect-fixture.html');
  await page.evaluate(async({entry,base})=>{const {createHub}=await import('/noname/skin/localDynamic/bridge.js');const lib={config:{},arenaReady:[]},game={};window.hub=createHub({lib,game,ui:{},_status:{}});hub.packs.test={name:'test',base,resourcePath:base,entries:[entry]};hub.previewResource(document.getElementById('portrait'),'test',entry);window.host=[...hub.previews.values()][0];}, {entry,base});
  await page.waitForFunction(()=>host.frame.contentWindow.skinPlayer||host.frame.contentWindow.skinPlayerError,null,{timeout:60000});
  await page.evaluate(()=>{window.p=host.frame.contentWindow.skinPlayer;if(!p)throw Error(host.frame.contentWindow.skinPlayerError);p.pause(true);window.done=[];});
  for(const action of entry.scene.actionContract.records.filter(a=>a.status==='candidate'&&['chuchang','gongji','teshu'].includes(a.kind)).slice(0,2)){
   await page.evaluate(async command=>{done=[];await p.motion(command,false,false,r=>done.push(r));},action.command);
   const sample=await page.evaluate(()=>{
    const ef=host.effectHost.active,ep=ef?.contentWindow.skinPlayer;if(!ep)throw Error('No screen player');window.ep=ep;ep.pause(true);
    const l=ep.engine42?.layers[0]||ep.root.children[0];window.drawEffect=dt=>{if(ep.engine42)ep.engine42.draw(dt);else{l.update(dt);ep.app.render();}};drawEffect(l.state.getCurrent(0).animation.duration/2);
    const primary=p.engine42?.layers.at(-1)||p.root.children.at(-1),r=host.frame.getBoundingClientRect();
    const c=ep.canvas,tmp=document.createElement('canvas');tmp.width=c.width;tmp.height=c.height;const ctx=tmp.getContext('2d');ctx.drawImage(c,0,0);const data=ctx.getImageData(0,0,tmp.width,tmp.height).data;
    let visible=0,outside=0;for(let y=0;y<tmp.height;y++)for(let x=0;x<tmp.width;x++)if(data[(y*tmp.width+x)*4+3]>16){visible++;const xx=x/tmp.width*ef.clientWidth,yy=y/tmp.height*ef.clientHeight;if(xx<r.left||xx>r.right||yy<r.top||yy>r.bottom)outside++;}
    return{screen:[ef.clientWidth,ef.clientHeight],avatar:[r.width,r.height],visible,outside,primaryHidden:!!(primary.sourceHidden||primary.renderable===false),trace:l.placementTrace||l.skinPlacementTrace,topLayer:ef.parentElement.matches(':popover-open'),pointer:getComputedStyle(ef).pointerEvents,duration:l.state.getCurrent(0).animation.duration};
   });
   assert.deepEqual(sample.screen,[1000,700]);assert.ok(sample.outside>100);assert.ok(sample.primaryHidden);assert.ok(sample.topLayer);assert.equal(sample.pointer,'none');
   await page.screenshot({path:path.join(out,id+'-'+action.kind+'.png')});
   await page.setViewportSize({width:1100,height:750});
   await page.waitForFunction(()=>ep.canvas.clientWidth===1100);
   await page.evaluate(()=>drawEffect(30));await page.waitForFunction(()=>done.length>0);
   const completion=await page.evaluate(()=>({events:done,remaining:document.querySelectorAll('.local-dynamic-effect').length,primaryRestored:(p.engine42?.layers||p.root.children).every(l=>!l.sourceHidden&&l.renderable!==false)}));
   assert.deepEqual(completion.events,['completed']);assert.equal(completion.remaining,0);assert.ok(completion.primaryRestored);row.actions.push({kind:action.kind,...sample,completion});await page.setViewportSize({width:1000,height:700});
  }
  // Cancellation while resources are still pending must settle and never blank the avatar.
  row.pendingCancel=await page.evaluate(async command=>{done=[];const promise=p.motion(command,false,false,r=>done.push(r));p.reset();const played=await promise;return{played,done,overlays:document.querySelectorAll('.local-dynamic-effect').length};},entry.scene.actionContract.records.find(a=>a.status==='candidate'&&['chuchang','gongji','teshu'].includes(a.kind)).command);
  assert.deepEqual(row.pendingCancel,{played:false,done:['interrupted'],overlays:0});
  const command=entry.scene.actionContract.records.find(a=>a.status==='candidate'&&['chuchang','gongji','teshu'].includes(a.kind)).command;
  row.activeReset=await page.evaluate(async command=>{done=[];await p.motion(command,false,false,r=>done.push(r));p.reset();return{done,overlays:document.querySelectorAll('.local-dynamic-effect').length,restored:(p.engine42?.layers||p.root.children).every(l=>!l.sourceHidden&&l.renderable!==false)};},command);
  assert.deepEqual(row.activeReset,{done:['interrupted'],overlays:0,restored:true});
  await context.route('**/assets/dynamic/**',r=>r.abort());
  row.failedLoad=await page.evaluate(async command=>{done=[];let failed=false;try{await p.motion(command,false,false,r=>done.push(r));}catch{failed=true;}return{failed,done,overlays:document.querySelectorAll('.local-dynamic-effect').length,restored:(p.engine42?.layers||p.root.children).every(l=>!l.sourceHidden&&l.renderable!==false)};},command);
  assert.deepEqual(row.failedLoad,{failed:true,done:['failed'],overlays:0,restored:true});
  await context.unroute('**/assets/dynamic/**');
  row.retry=await page.evaluate(async command=>{done=[];const played=await p.motion(command,false,false,r=>done.push(r));return{played,overlays:document.querySelectorAll('.local-dynamic-effect').length};},command);
  assert.deepEqual(row.retry,{played:true,overlays:1});
  await page.evaluate(()=>p.reset());
  row.masks=await page.evaluate(()=>{
   if(!p.app)return{backend:'native',covered:'existing renderer hideSlots'};
   const s=p.root.children.at(-1),legacy=p.entry.models.at(-1).legacy,original=legacy.hideSlots;
   s.state.clearTracks();s.skeleton.setToSetupPose();s.state.setAnimation(0,s.skinIdle,true);s.update(0);
   const names=[...new Set(s.skeleton.slots.map(s=>s.attachment?.name).filter(Boolean))];
   const attachmentRefs=s.skeleton.slots.map(s=>s.attachment),deforms=s.skeleton.slots.map(s=>[...(s.deform||[])]);
   const count=()=>{const tex=p.app.renderer.generateTexture(s);try{const a=p.app.renderer.plugins.extract.pixels(tex);let n=0;for(let i=3;i<a.length;i+=4)if(a[i]>16)n++;return n;}finally{tex.destroy(true);}};
   const before=count();legacy.hideSlots=names;s.update(0);const hidden=count();s.update(0);const hiddenAgain=count();legacy.hideSlots=original;s.update(0);const after=count();
   return{before,hidden,hiddenAgain,after,restored:s.skeleton.slots.every((s,i)=>s.attachment===attachmentRefs[i]&&JSON.stringify(s.deform||[])===JSON.stringify(deforms[i]))};
  });
  if(row.masks.before){assert.equal(row.masks.hidden,0);assert.equal(row.masks.hiddenAgain,0);assert.equal(row.masks.after,row.masks.before);assert.ok(row.masks.restored);}
  await page.evaluate(async command=>{await p.motion(command,false,false);hub.stopPreview(document.getElementById('portrait'));},command);assert.equal(await page.locator('iframe').count(),0);row.status='passed';
 }catch(error){row.status='failed';row.error=String(error);}
 await context.close();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({id,status:row.status,error:row.error}));
}}finally{await browser.close();}
assert.equal(report.errors.length,0,JSON.stringify(report.errors));assert.ok(report.rows.every(r=>r.status==='passed'));
