import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const work=path.resolve(process.env.SKIN_ACTION_WORK||'output/dynamic-remediation/20260926-r01/external-actions-r03/candidates-v2'),out=path.join(work,process.env.SKIN_ACTION_LABEL||'browser-pilot');
const ids=process.env.SKIN_CASE_IDS?.split(',')||['base_3548949c34b6ea5c','base_10bdf67606eeb796','base_0bd95d2722e02076','base_169c8a25e70bb8ad','base_9ad4a25a34ccc857'];
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const sha=b=>createHash('sha256').update(b).digest('hex'),files=new Map(),hashes=[];await fs.mkdir(path.join(out,'runtime'),{recursive:true});
for(const n of (await fs.readdir('apps/core/noname/skin/localDynamic/runtime')).filter(n=>/\.(js|css|html)$/.test(n))){const b=await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+n);files.set(n,b);hashes.push({name:n,sha256:sha(b)});await fs.writeFile(path.join(out,'runtime',n),b,{flag:'wx'});}
await fs.writeFile(path.join(out,'provenance.json'),JSON.stringify({at:new Date().toISOString(),ids,hashes,runnerSHA256:sha(await fs.readFile(import.meta.filename)),scope:'Stratified Windows Chrome external action temporal/lifecycle/placement checks. Not full raster acceptance; portrait source-sprite placement does not certify EpicFX global-screen framing.'},null,2),{flag:'wx'});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),rows=[];
try{for(const id of ids){
 const bytes=await fs.readFile(path.join(work,'entries',id+'.json')),entry=JSON.parse(bytes),context=await browser.newContext({viewport:{width:240,height:360},deviceScaleFactor:1});
 await context.routeWebSocket('**',ws=>ws.close());
 await context.route('**/runtime/*',r=>{const n=new URL(r.request().url()).pathname.split('/').at(-1);return files.has(n)?r.fulfill({body:files.get(n),contentType:n.endsWith('.js')?'text/javascript':n.endsWith('.html')?'text/html':'text/css'}):r.continue();});
 await context.route('**/entries/'+id+'.json',r=>r.fulfill({body:bytes,contentType:'application/json'}));
 const page=await context.newPage(),row={id,title:entry.title,entrySHA256:sha(bytes),errors:[],actions:[]};page.on('pageerror',e=>row.errors.push(String(e)));
 try{
  await page.goto(origin+'/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/player.html?id='+id+'&presentation=preview');
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
  row.environment=await page.evaluate(()=>{if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.engine42?.pause(true);p.app?.stop();const canvas=p.engine42?.canvas||p.app.view,g=canvas.getContext('webgl2')||canvas.getContext('webgl'),e=g.getExtension('WEBGL_debug_renderer_info');return{renderer:e&&g.getParameter(e.UNMASKED_RENDERER_WEBGL),userAgent:navigator.userAgent,initialExternalLayers:(p.engine42?.externalLayers||p.externalLayers).length};});
  for(const action of entry.scene.actionContract.records.filter(a=>a.mode==='external')){
   const setup=await page.evaluate(async action=>{
    const p=skinPlayer,base=p.engine42?.layers||p.root.children,external=p.engine42?.externalLayers||p.externalLayers;p.reset();
    const render=dt=>{if(p.engine42)p.engine42.draw(dt);else{[...base,...external.filter(l=>l.visible)].forEach(l=>l.update(dt));p.app.render();}};render(0);
    const events=[],played=await p.motion(action.command,false,false,r=>events.push(r));render(0);
    const l=external.find(l=>l.visible);if(!l)throw Error('External layer not visible');
    const current=l.state.getCurrent(0);window.externalTest={p,base,external,render,l,action,events,time:0};
    return{played,name:current.animation.name,duration:current.animation.duration,speed:current.timeScale,cacheSize:external.length};
   },action);
   const result={kind:action.kind,version:action.model.version,...setup,samples:[],frames:[]};row.actions.push(result);
   if(!(setup.speed>0))throw Error('Stationary fixture handled in unit test');const d=setup.duration/setup.speed;
   for(const target of [0,d/2,d+1/30,d+1]){
    result.samples.push(await page.evaluate(target=>{const t=externalTest;while(t.time<target-1e-8){const dt=Math.min(1/60,target-t.time);t.render(dt);t.time+=dt;}t.render(0);const active=t.time<(t.l.state.getCurrent(0).animation.duration/t.action.actionLayer.playback.speed),primary=t.base[t.action.layer],primaryHidden=!!(t.p.engine42?primary.sourceHidden:!primary.renderable),background=t.base.map((l,i)=>({name:l.state.getCurrent(0).animation.name,time:l.state.getCurrent(0).trackTime,expected:t.time*t.p.entry.scene.layers[i].playback.speed}));const trace=t.l.placementTrace||t.l.skinPlacementTrace,c=t.action.source,xy=(x,size)=>Array.isArray(x)?x[0]+x[1]*size:x??size/2,expected={x:xy(c.x,innerWidth),y:xy(c.y,innerHeight),scale:(c.scale??1)*innerHeight/t.p.entry.scene.viewport.referenceHeight,angle:c.angle??0};const placementPass=Object.keys(expected).every(k=>Math.abs(trace[k]-expected[k])<1e-6),clockPass=background.every(s=>Math.abs(s.time-s.expected)<1e-4);return{time:t.time,active,visible:t.l.visible,primaryHidden,background,trace,expected,events:[...t.events],pass:t.l.visible===active&&primaryHidden===active&&placementPass&&clockPass&&t.events.join()===(active?'':'completed')};},target));
    if(target===0||target===d/2||target===d+1){const file=id+'-'+action.kind+'-'+result.samples.length+'.png';await page.screenshot({path:path.join(out,file),omitBackground:true});result.frames.push(file);}
   }
   result.reuseReset=await page.evaluate(async command=>{const t=externalTest,n=t.external.length,events=[];await t.p.motion(command,false,false,r=>events.push(r));t.render(.1);await t.p.motion(command,false,false,r=>events.push(r));t.render(.1);t.p.reset();t.render(0);return{events,cacheSize:t.external.length,pass:t.external.length===n&&events.join()==='interrupted,interrupted'&&t.external.every(l=>!l.visible)&&t.base.every(l=>!l.sourceHidden&&l.renderable!==false)};},action.command);
   result.status=result.samples.every(x=>x.pass)&&result.reuseReset.pass?'passed':'failed';
  }
  row.dispose=await page.evaluate(()=>{skinPlayer.dispose();return{canvases:document.querySelectorAll('canvas').length,phase:document.documentElement.dataset.skinPhase};});
  row.status=row.actions.length&&row.actions.every(a=>a.status==='passed')&&!row.errors.length&&row.dispose.canvases===0?'passed':'failed';
 }catch(error){row.status='failed';row.error=String(error);}
 finally{await page.evaluate(()=>skinPlayer?.dispose()).catch(()=>{});await context.close();rows.push(row);await fs.writeFile(path.join(out,'report.json'),JSON.stringify(rows,null,2));}
 console.log(JSON.stringify({id,status:row.status,actions:row.actions.length,error:row.error}));
}}finally{await browser.close();}
if(rows.some(r=>r.status!=='passed'))process.exitCode=1;
