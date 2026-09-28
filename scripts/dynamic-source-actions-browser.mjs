import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve('output/dynamic-remediation/20260926-r01'),work=path.join(run,'continuation-actions-20260926');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const label=process.env.SKIN_ACTION_LABEL||'browser-pilot',out=path.join(work,label);
await fs.mkdir(out,{recursive:true});
const all=JSON.parse(await fs.readFile(path.join(work,'ids.json')));
const ids=process.env.SKIN_CASE_IDS?.split(',')||all;
const files=new Map(),snapshot=[];
const sha=b=>createHash('sha256').update(b).digest('hex');
for(const name of (await fs.readdir('apps/core/noname/skin/localDynamic/runtime')).filter(n=>/\.(js|html|css)$/.test(n)).sort()){
 let b=await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+name);
 if(process.env.SKIN_ACTION_BEFORE==='1')try{b=await fs.readFile(path.join(work,'before-runtime',name));}catch(e){if(e.code!=='ENOENT')throw e;}
 files.set(name,b);snapshot.push({name,sha256:sha(b)});
 await fs.mkdir(path.join(out,'runtime'),{recursive:true});await fs.writeFile(path.join(out,'runtime',name),b,{flag:'wx'});
}
const provenance={createdAt:new Date().toISOString(),ids,files:snapshot,before:process.env.SKIN_ACTION_BEFORE==='1',runnerSHA256:sha(await fs.readFile(import.meta.filename)),scope:'Explicit unchanged-placement primary actions only; same decoded model direct-pose oracle tests routing/timing, not independent parser/raster certification. No automatic entrance/event integration or final skin acceptance.'};
await fs.writeFile(path.join(out,'provenance.json'),JSON.stringify(provenance,null,2),{flag:'wx'});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),rows=[];
try{for(const id of ids){
 const bytes=await fs.readFile(path.join(work,'entries',id+'.json')),entry=JSON.parse(bytes);
 const viewport={width:240,height:360};
 const context=await browser.newContext({viewport,deviceScaleFactor:1});
 await context.routeWebSocket('**',ws=>ws.close());
 await context.route('**/runtime/*',r=>{const name=new URL(r.request().url()).pathname.split('/').at(-1);return files.has(name)?r.fulfill({body:files.get(name),contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.html')?'text/html':'text/css'}):r.continue();});
 await context.route('**/entries/'+id+'.json',r=>r.fulfill({body:bytes,contentType:'application/json'}));
 const page=await context.newPage(),row={id,title:entry.title,versions:entry.models.map(m=>m.version),entrySHA256:sha(bytes),viewport,errors:[],actions:[],status:'running'};
 page.on('pageerror',e=>row.errors.push(String(e)));
 try{
  await page.goto(origin+'/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/player.html?id='+id+'&presentation=preview');
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
  row.environment=await page.evaluate(()=>{if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.engine42?.pause(true);p.app?.stop();const canvas=p.engine42?.canvas||p.app.view,gl=canvas.getContext('webgl2')||canvas.getContext('webgl'),ext=gl.getExtension('WEBGL_debug_renderer_info');return{renderer:ext&&gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),userAgent:navigator.userAgent};});
  for(const action of entry.scene.actionContract.records.filter(a=>a.status==='candidate')){
   const setup=await page.evaluate(async action=>{
    const p=skinPlayer,ls=p.engine42?.layers||p.root.children,primary=ls[action.layer];
    const state=l=>l.state,sk=l=>l.skeleton,idle=l=>l.idle||l.skinIdle;
    for(const l of ls){sk(l).setToSetupPose();state(l).clearTracks();state(l).setAnimation(0,idle(l),true);state(l).getCurrent(0).mixDuration=0;}
    const render=dt=>{if(p.engine42)p.engine42.draw(dt);else{for(const l of ls)l.update(dt);p.app.render();}};
    render(0);
    const data=primary.skeleton.data,a=data.findAnimation(action.animation),ret=data.findAnimation(action.returnAnimation);
    if(!a||!ret)throw Error('Source clip missing: '+action.animation+' / '+action.returnAnimation);
    const speed=p.entry.scene.layers[action.layer].playback.speed;
    if(!(speed>0))throw Error('Nonpositive source speed requires separate stationary temporal fixture');
    const completions=[];
    const played=await p.motion(action.command,false,false,reason=>completions.push(reason));render(0);
    window.actionTest={p,ls,primary,action,render,speed,completions,time:0,duration:a.duration,idleDuration:ret.duration,background:ls.map(l=>state(l).getCurrent(0).trackTime)};
    return{played,duration:a.duration,idleDuration:ret.duration,speed,primary:action.layer};
   },action);
   const result={kind:action.kind,command:action.command,...setup,samples:[],frames:[]};row.actions.push(result);
   if(!setup.played){result.status='not-played';continue;}
   const eps=1/60,d=setup.duration/setup.speed,idleD=setup.idleDuration/setup.speed;
   const points=[0,d/4,d/2,d*.75,Math.max(0,d-eps),d,d+eps*2,d+idleD,d+2*idleD].sort((a,b)=>a-b);
   if(points.at(-1)>180)throw Error('Action exceeds bounded runner window; not counted complete');
   for(const target of [...new Set(points)]){
    const sample=await page.evaluate(target=>{
     const t=actionTest;let steps=0;
     while(t.time<target-1e-9){const dt=Math.min(1/60,target-t.time);t.render(dt);t.time+=dt;steps++;}
     t.render(0); // Drain the exact boundary without advancing logical time.
     const track=t.primary.state.getCurrent(0),states=t.ls.map(l=>({name:l.state.getCurrent(0).animation.name,time:l.state.getCurrent(0).trackTime,loop:l.state.getCurrent(0).loop}));
     const elapsed=t.time*t.speed,expected=elapsed<t.duration?t.action.animation:t.action.returnAnimation;
     const expectedTime=elapsed<t.duration?elapsed:elapsed-t.duration;
     const backgroundContinuous=t.ls.every((l,i)=>i===t.action.layer||Math.abs(states[i].time-t.time*(t.p.entry.scene.layers[i].playback.speed))<1e-4);
     const matrices=t.ls.map(l=>l.placementTrace||l.skinPlacementTrace);
     return{time:t.time,steps,states,expected,expectedTime,timeError:Math.abs(track.trackTime-expectedTime),backgroundContinuous,matrices,completions:[...t.completions],pass:track.animation.name===expected&&Math.abs(track.trackTime-expectedTime)<1e-4&&backgroundContinuous};
    },target);
    result.samples.push(sample);
    if([0,d/2,d+eps*2,d+2*idleD].includes(target)){
     const name=id+'-'+action.kind+'-'+result.samples.length+'.png';await page.screenshot({path:path.join(out,name),omitBackground:true});result.frames.push({file:name,time:target});
    }
   }
   // An in-flight action can be superseded; its queued return cannot escape.
   result.interruption=await page.evaluate(async command=>{const t=actionTest;await t.p.motion(command,false);t.render(.1);await t.p.motion(command,false);const track=t.primary.state.getCurrent(0);return{time:track.trackTime,animation:track.animation.name,pass:track.trackTime===0};},action.command);
   result.status=result.samples.every(s=>s.pass)&&result.interruption.pass&&JSON.stringify(result.samples.at(-1).completions)==='["completed"]'?'passed':'failed';
  }
  row.status=row.actions.every(a=>a.status==='passed')&&row.errors.length===0?'passed':'failed';
 }catch(e){row.status='failed';row.error=String(e);}
 finally{await page.evaluate(()=>skinPlayer?.dispose()).catch(()=>{});await context.close();rows.push(row);await fs.writeFile(path.join(out,'report.json'),JSON.stringify(rows,null,2));}
 console.log(JSON.stringify({id,status:row.status,actions:row.actions.length,error:row.error}));
}}finally{await browser.close();}
console.log(JSON.stringify({total:rows.length,passed:rows.filter(r=>r.status==='passed').length,failed:rows.filter(r=>r.status!=='passed').length}));
