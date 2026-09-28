import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const seconds=Number(process.env.SKIN_GAME_SECONDS||1800),label=process.env.SKIN_GAME_LABEL||'actual-game-soak';
if(!(seconds>=30))throw Error('Soak must last at least 30 seconds');
const out=path.join(run,label);await fs.mkdir(out);
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json'))),installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json'));
const deferred=new Set(JSON.parse(await fs.readFile(path.join(run,'scope-adjustment.json'))).deferredSkinIds);
const skins=inventory.entries.filter(e=>e.catalogAvailable&&e.effective&&!deferred.has(e.id));
const runtime=new Map();await fs.mkdir(path.join(out,'runtime'));
for(const name of (await fs.readdir('apps/core/noname/skin/localDynamic/runtime')).filter(n=>/\.(js|html|css)$/.test(n))){const bytes=await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+name);runtime.set(name,bytes);await fs.writeFile(path.join(out,'runtime',name),bytes);}
const report={startedAt:new Date().toISOString(),requestedSeconds:seconds,completed:false,errors:[],rounds:[],samples:[],runtime:[...runtime].map(([name,b])=>({name,sha256:createHash('sha256').update(b).digest('hex')})),scope:'Independent Windows Chrome profile, actual AI-operated identity games and native player skin hosts. No game state or official profile copied back.'};
const save=()=>fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 // An independent offline game must not reload when another workspace task edits a watched file.
 await context.routeWebSocket('**/*',socket=>socket.close());
 report.isolation={webSockets:'blocked (including Vite HMR)',runtime:'frozen bytes per run'};
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname!=='127.0.0.1'||/^\/(api|ws)\//.test(u.pathname)?route.abort():route.fallback();});
 await context.route('**/runtime/*',async route=>{const name=new URL(route.request().url()).pathname.split('/').at(-1);if(!runtime.has(name))return route.fallback();await route.fulfill({body:runtime.get(name),contentType:name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.html')?'text/html; charset=utf-8':'text/css'});});
 page.on('pageerror',e=>report.errors.push({time:new Date().toISOString(),error:String(e)}));page.on('dialog',d=>void d.accept());
 await page.route('**/game/config.json',async route=>{
  const response=await route.fetch(),config=await response.json();
  Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:'builtin-shousha-standard',change_skin:true,change_skin_auto:'off',animation:true,low_performance:false});
  config.mode_config.identity={...config.mode_config.identity,player_number:'2',change_card:'disabled',double_character:false};
  for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
  for(const r of installed)config['extension_'+r.name+'_enable']=r.name==='千幻聆音';
  await route.fulfill({response,json:config});
 });
 async function beginRound(){
  await page.goto(origin,{waitUntil:'domcontentloaded'});await page.evaluate(async()=>window.__env=await import('/noname.js'));
  await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
  await page.evaluate(()=>{if(!__env._status.auto)__env.ui.click.auto();});
  await page.waitForFunction(()=>__env._status.gameStarted&&__env.game.players.every(p=>p.name1),null,{timeout:60000});
  const names=await page.evaluate(()=>{__env.game.pause2();return __env.game.players.map(p=>p.name1);});
  const selection=names.map(name=>{const e=skins.find(e=>e.characterIds.includes(name)&&e.effective.models?.every(m=>/^3\.6\.|^4\.0\./.test(m.version||'')));return e?{name,id:e.id,file:e.effective.skinTitle+'.png'}:null;}).filter(Boolean);
  assert.ok(selection.length,'At least one naturally selected player must have a mapped dynamic skin');
  await page.evaluate(async selection=>{const{game,lib}=__env;for(const s of selection)await game.localDynamicSkinTestHub.ensureCharacter(s.name);lib.config.qhly_skinset.skin={...lib.config.qhly_skinset.skin,...Object.fromEntries(selection.map(s=>[s.name,s.file]))};game.localDynamicSkinTestHub.refresh();},selection);
  await page.waitForFunction(()=>[...document.querySelectorAll('.local-dynamic-skin iframe')].some(f=>f.dataset.ready==='true'),null,{timeout:60000});
  const row={startedAt:new Date().toISOString(),names,selection};report.rounds.push(row);
  await page.screenshot({path:path.join(out,`round-${report.rounds.length}-start.png`)});
  await page.evaluate(()=>__env.game.resume2());await save();
 }
 await beginRound();const start=Date.now();let lastShot=0;
 while(Date.now()-start<seconds*1000){
  await page.waitForTimeout(1000);
  const state=await page.evaluate(()=>{
   const{game,_status}=__env;return{over:!!_status.over,round:game.roundNumber,phase:game.phaseNumber,event:_status.event?.name,players:game.players.map(p=>({name:p.name1,hp:p.hp,hand:p.countCards('h')})),heap:performance.memory?.usedJSHeapSize,
    hosts:[...document.querySelectorAll('.local-dynamic-skin iframe')].map(f=>{const w=f.contentWindow,p=w.skinPlayer;return{id:p?.entry.id,ready:f.dataset.ready,error:w.skinPlayerError,canvas:w.document.querySelectorAll('canvas').length,time:p?.engine42?.layers[0]?.state.tracks[0]?.trackTime??p?.root?.children[0]?.state?.getCurrent?.(0)?.trackTime};})};
  });
  assert.ok(state.hosts.every(h=>!h.error),'Skin host must not report a rendering error');
  report.samples.push({elapsedSeconds:(Date.now()-start)/1000,...state});
  if(Date.now()-lastShot>60000){await page.screenshot({path:path.join(out,`game-${report.samples.length}.png`)});lastShot=Date.now();}
  if(state.over){report.rounds.at(-1).finishedAt=new Date().toISOString();await beginRound();}
  if(report.samples.length%10===0){await save();console.log(JSON.stringify({elapsed:report.samples.at(-1).elapsedSeconds,rounds:report.rounds.length,phase:state.phase,hosts:state.hosts.length}));}
 }
 report.elapsedSeconds=(Date.now()-start)/1000;assert.ok(report.samples.some(s=>s.phase>=2),'Actual game turns must advance');assert.deepEqual(report.errors,[]);report.completed=true;
 await page.screenshot({path:path.join(out,'final.png')});
}catch(error){report.failure=String(error);throw error;}finally{report.finishedAt=new Date().toISOString();await save();await browser.close();}
console.log(JSON.stringify({completed:report.completed,elapsedSeconds:report.elapsedSeconds,rounds:report.rounds.length,samples:report.samples.length}));
