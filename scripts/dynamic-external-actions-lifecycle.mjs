import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='output/dynamic-remediation/20260926-r01/external-actions-r03',work=base+'/candidates-v2',snapshot=work+'/browser-final/runtime',rows=[];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{for(const id of ['base_3548949c34b6ea5c','base_10bdf67606eeb796'])for(const mode of ['fail-retry','pending-reset','pending-switch','pending-dispose']){
 const entry=JSON.parse(await fs.readFile(work+'/entries/'+id+'.json')),a=entry.scene.actionContract.records.find(a=>a.mode==='external');
 const context=await browser.newContext({viewport:{width:240,height:360}});await context.routeWebSocket('**',ws=>ws.close());
 await context.route('**/runtime/*',async r=>{const n=new URL(r.request().url()).pathname.split('/').at(-1);try{await r.fulfill({body:await fs.readFile(snapshot+'/'+n),contentType:n.endsWith('.js')?'text/javascript':n.endsWith('.html')?'text/html':'text/css'});}catch(e){if(e.code!=='ENOENT')throw e;await r.continue();}});
 await context.route('**/entries/'+id+'.json',r=>r.fulfill({json:entry}));
 let count=0,entered,release;const seen=new Promise(r=>entered=r),held=new Promise(r=>release=r);
 await context.route('**/*',async r=>{if(!decodeURIComponent(new URL(r.request().url()).pathname).endsWith('/'+a.model.skeleton))return r.fallback();count++;if(count!==1)return r.continue();entered();if(mode==='fail-retry')return r.fulfill({status:503,body:'injected fixture'});await held;await r.continue().catch(()=>{});});
 const page=await context.newPage(),row={id,mode,errors:[]};page.on('pageerror',e=>row.errors.push(String(e)));
 try{
  await page.goto('http://127.0.0.1:8184/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/player.html?id='+id+'&presentation=preview');await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
  await page.evaluate(cmd=>{if(window.skinPlayerError)throw Error(skinPlayerError);skinPlayer.engine42?.pause(true);skinPlayer.app?.stop();window.events=[];window.done=null;void skinPlayer.motion(cmd,false,false,r=>events.push(r)).then(played=>done={played},e=>done={error:String(e)});},a.command);
  await Promise.race([seen,new Promise((_,reject)=>setTimeout(()=>reject(Error('request not seen')),10000))]);
  if(mode==='fail-retry'){
   await page.waitForFunction(()=>window.done);row.first=await page.evaluate(()=>({done,events,hidden:skinPlayer.engine42?skinPlayer.engine42.layers.some(l=>l.sourceHidden):skinPlayer.root.children.some(l=>!l.renderable)}));
   row.retried=await page.evaluate(async cmd=>{const played=await skinPlayer.motion(cmd,false);skinPlayer.reset();return played;},a.command);
  }else{
   await page.evaluate(mode=>{if(mode==='pending-dispose')skinPlayer.dispose();else if(mode==='pending-switch')void skinPlayer.motion(skinPlayer.entry.idle,false);else skinPlayer.reset();},mode);release();await page.waitForFunction(()=>window.done);
   row.after=await page.evaluate(()=>({done,events,canvases:document.querySelectorAll('canvas').length,active:(skinPlayer.engine42?.externalLayers||skinPlayer.externalLayers).filter(l=>l.visible).length,phase:document.documentElement.dataset.skinPhase,hidden:skinPlayer.engine42?skinPlayer.engine42.layers.some(l=>l.sourceHidden):skinPlayer.root.children.some(l=>!l.renderable)}));
  }
  row.pass=!row.errors.length&&(mode==='fail-retry'?!!row.first.done.error&&row.first.events.join()==='failed'&&!row.first.hidden&&row.retried:row.after.done.played===false&&row.after.events.join()==='interrupted'&&!row.after.active&&!row.after.hidden&&(mode!=='pending-dispose'||row.after.canvases===0));
 }catch(error){row.pass=false;row.error=String(error);}
 finally{release();await page.evaluate(()=>skinPlayer?.dispose()).catch(()=>{});await context.close();rows.push(row);await fs.writeFile(base+'/lifecycle.json',JSON.stringify(rows,null,2));}
 console.log(JSON.stringify({id,mode,pass:row.pass,error:row.error}));
}}finally{await browser.close();}
if(rows.some(r=>!r.pass))process.exitCode=1;
