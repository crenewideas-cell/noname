import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const work=path.resolve(process.env.SKIN_ACTION_WORK||'output/dynamic-remediation/20260926-r01/action-placement-r02');
const out=path.join(work,process.env.SKIN_ACTION_LABEL||'browser-pilot');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const ids=process.env.SKIN_CASE_IDS?.split(',')||['base_ffc889af6cd02a3e','base_677584f7a40de95f','base_a9d9b01d971eee83'];
const sha=b=>createHash('sha256').update(b).digest('hex'),files=new Map(),hashes=[];
await fs.mkdir(path.join(out,'runtime'),{recursive:true});
for(const name of (await fs.readdir('apps/core/noname/skin/localDynamic/runtime')).filter(n=>/\.(js|html|css)$/.test(n)).sort()){
 const b=await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+name);files.set(name,b);hashes.push({name,sha256:sha(b)});await fs.writeFile(path.join(out,'runtime',name),b,{flag:'wx'});
}
await fs.writeFile(path.join(out,'provenance.json'),JSON.stringify({createdAt:new Date().toISOString(),ids,hashes,runnerSHA256:sha(await fs.readFile(import.meta.filename)),scope:'Partial Windows Chrome timing, declared placement and reset checks. Independent source-coordinate arithmetic; no independent raster or full-screen EpicFX certification; no final skin acceptance.'},null,2),{flag:'wx'});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),rows=[];
try{for(const id of ids){
 const bytes=await fs.readFile(path.join(work,'entries',id+'.json')),entry=JSON.parse(bytes),viewport={width:240,height:360};
 const context=await browser.newContext({viewport,deviceScaleFactor:1});
 await context.routeWebSocket('**',ws=>ws.close());
 await context.route('**/runtime/*',r=>{const n=new URL(r.request().url()).pathname.split('/').at(-1);return files.has(n)?r.fulfill({body:files.get(n),contentType:n.endsWith('.js')?'text/javascript':n.endsWith('.html')?'text/html':'text/css'}):r.continue();});
 await context.route('**/entries/'+id+'.json',r=>r.fulfill({body:bytes,contentType:'application/json'}));
 const page=await context.newPage(),row={id,title:entry.title,versions:entry.models.map(m=>m.version),entrySHA256:sha(bytes),viewport,errors:[],actions:[]};page.on('pageerror',e=>row.errors.push(String(e)));
 try{
  await page.goto(origin+'/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/player.html?id='+id+'&presentation=preview');
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
  row.environment=await page.evaluate(()=>{if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.engine42?.pause(true);p.app?.stop();const c=p.engine42?.canvas||p.app.view,g=c.getContext('webgl2')||c.getContext('webgl'),e=g.getExtension('WEBGL_debug_renderer_info');return{renderer:e&&g.getParameter(e.UNMASKED_RENDERER_WEBGL),userAgent:navigator.userAgent};});
  for(const action of entry.scene.actionContract.records.filter(a=>a.status==='candidate')){
   const setup=await page.evaluate(async action=>{
    const p=skinPlayer,ls=p.engine42?.layers||p.root.children,l=ls[action.layer];p.reset();
    const render=dt=>{if(p.engine42)p.engine42.draw(dt);else{ls.forEach(s=>s.update(dt));p.app.render();}};render(0);
    action={...action,returnAnimation:action.returnAnimation??(l.idle||l.skinIdle)};
    const a=l.skeleton.data.findAnimation(action.animation),idle=l.skeleton.data.findAnimation(action.returnAnimation);if(!a||!idle)throw Error('Missing exact source clip');
    const base=p.entry.scene.layers[action.layer].playback.speed,event=action.actionLayer?.playback.speed??base;if(!(base>0&&event>0))throw Error('Stationary/negative fixture requires a different time window');
    const completions=[],played=await p.motion(action.command,false,false,r=>completions.push(r));render(0);
    window.placementTest={p,ls,l,action,render,completions,time:0,duration:a.duration,event,base};
    return{played,duration:a.duration,event,base,idleDuration:idle.duration};
   },action);
   const result={kind:action.kind,...setup,samples:[],frames:[]};row.actions.push(result);
   const d=setup.duration/setup.event,eps=1/60,points=[0,d/2,Math.max(0,d-eps),d+2*eps,d+setup.idleDuration/setup.base];
   for(const target of [...new Set(points)].sort((a,b)=>a-b)){
    const sample=await page.evaluate(target=>{
     const t=placementTest;while(t.time<target-1e-9){const dt=Math.min(1/60,target-t.time);t.render(dt);t.time+=dt;}t.render(0);
     const active=t.time<t.duration/t.event,expectedName=active?t.action.animation:t.action.returnAnimation,expectedTime=active?t.time*t.event:(t.time-t.duration/t.event)*t.base;
     const states=t.ls.map(l=>{const c=l.state.getCurrent(0);return{name:c.animation.name,time:c.trackTime,speed:c.timeScale,loop:c.loop};});
     const matrices=t.ls.map(l=>l.placementTrace||l.skinPlacementTrace),scene=t.p.entry.scene;
     // Evaluate raw source fields independently of the production layout helper.
     const expected=t.ls.map((l,i)=>{const c=(active&&i===t.action.layer&&t.action.actionLayer?t.action.actionLayer:scene.layers[i]).source;const xy=(v,size)=>Array.isArray(v)?v[0]+v[1]*size:v??size/2;return{x:xy(c.x,innerWidth),y:xy(c.y,innerHeight),scale:(c.scale??1)*(scene.viewport.referenceHeight?innerHeight/scene.viewport.referenceHeight:1),angle:c.angle??0};});
     const placementPass=matrices.every((m,i)=>Object.keys(expected[i]).every(k=>Math.abs(m[k]-expected[i][k])<1e-6));
     const backgroundPass=states.every((s,i)=>i===t.action.layer||Math.abs(s.time-t.time*scene.layers[i].playback.speed)<1e-4);
     const c=states[t.action.layer],timeError=Math.abs(c.time-expectedTime),layerPass=!!t.l.sourceLayer===!!(active&&t.action.actionLayer);
     return{time:t.time,states,expectedName,expectedTime,timeError,matrices,expected,placementPass,backgroundPass,layerPass,completions:[...t.completions],pass:c.name===expectedName&&c.speed===(active?t.event:t.base)&&timeError<1e-4&&placementPass&&backgroundPass&&layerPass};
    },target);result.samples.push(sample);
    if(target===0||target===d/2||target===points.at(-1)){const file=id+'-'+action.kind+'-'+result.samples.length+'.png';await page.screenshot({path:path.join(out,file),omitBackground:true});result.frames.push(file);}
   }
   result.interruption=await page.evaluate(async command=>{const t=placementTest,events=[];await t.p.motion(command,false,false,r=>events.push(r));t.render(.1);await t.p.motion(command,false,false,r=>events.push(r));t.render(.1);const newLayerPass=!!t.l.sourceLayer===!!t.action.actionLayer;t.p.reset();t.render(0);return{events,newLayerPass,states:t.ls.map(l=>({name:l.state.getCurrent(0).animation.name,time:l.state.getCurrent(0).trackTime,activeLayer:!!l.sourceLayer})),pass:events.join()==='interrupted,interrupted'&&newLayerPass&&t.ls.every(l=>!l.sourceLayer&&l.state.getCurrent(0).animation.name===(l.idle||l.skinIdle)&&l.state.getCurrent(0).trackTime===0)};},action.command);
   result.status=setup.played&&result.samples.every(s=>s.pass)&&result.interruption.pass&&result.samples.at(-1).completions.join()==='completed'?'passed':'failed';
  }
  row.status=row.actions.every(a=>a.status==='passed')&&!row.errors.length?'passed':'failed';
 }catch(e){row.status='failed';row.error=String(e);}
 finally{await page.evaluate(()=>skinPlayer?.dispose()).catch(()=>{});await context.close();rows.push(row);await fs.writeFile(path.join(out,'report.json'),JSON.stringify(rows,null,2));}
 console.log(JSON.stringify({id,status:row.status,actions:row.actions.length,error:row.error}));
}}finally{await browser.close();}
console.log(JSON.stringify({total:rows.length,passed:rows.filter(r=>r.status==='passed').length}));
if(rows.some(r=>r.status!=='passed'))process.exitCode=1;
