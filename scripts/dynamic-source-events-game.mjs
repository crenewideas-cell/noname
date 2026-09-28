import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const seconds=30,label='external-actions-r03/game-events-v2';
if(!(seconds>=30))throw Error('Soak must last at least 30 seconds');
const out=path.join(run,label);await fs.mkdir(out);
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json'))),installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json'));
const deferred=new Set(JSON.parse(await fs.readFile(path.join(run,'scope-adjustment.json'))).deferredSkinIds);
const candidateDir=path.join(run,'external-actions-r03/candidates-v2/entries'),candidateIds=new Set(JSON.parse(await fs.readFile(path.join(run,'external-actions-r03/candidates-v2/ids.json'))));
const skins=inventory.entries.filter(e=>candidateIds.has(e.id)&&e.catalogAvailable&&e.effective&&!deferred.has(e.id));
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
 await context.route('**/entries/*.json',async route=>{const id=new URL(route.request().url()).pathname.split('/').at(-1).replace('.json','');if(candidateIds.has(id))await route.fulfill({body:await fs.readFile(path.join(candidateDir,id+'.json')),contentType:'application/json'});else await route.fallback();});
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
 await beginRound();await page.evaluate(()=>{__env.game.pause2();});
 report.eventChecks=[];
 const hosts=await page.evaluate(()=>[...__env.game.localDynamicSkinTestHub.hosts.values()].filter(h=>h.frame?.dataset.ready==='true').map(h=>({id:h.e.id,events:h.events})));
 for(const host of hosts.slice(0,1))for(const kind of ['enter','attack','skill','dodge']){
  if(!host.events[kind]?.startsWith('source:'))continue;
  const command=host.events[kind];
  await page.evaluate(({id,kind})=>{const hub=__env.game.localDynamicSkinTestHub,h=[...hub.hosts.values()].find(h=>h.e.id===id),p=h.frame.contentWindow.skinPlayer;p.engine42?.pause(true);p.app?.stop();h.lastEventAt=0;window.__eventReports=[];window.__eventChannel=h.frame.dataset.channel;if(!window.__eventHook){window.__eventHook=true;addEventListener('message',e=>{if(e.data?.channel===__eventChannel&&e.data?.type==='noname-skin-event-finished')__eventReports.push(e.data);});}const name={enter:'enterGame',attack:'useCard',skill:'useSkill',dodge:'respond'}[kind];hub.handleEvent({name,player:h.player,card:kind==='attack'?{name:'sha'}:kind==='dodge'?{name:'shan'}:undefined});},{id:host.id,kind});
  await page.waitForFunction(({id,command})=>[...__env.game.localDynamicSkinTestHub.hosts.values()].some(h=>h.e.id===id&&h.frame?.contentWindow.skinPlayer?.lastMotion===command),{id:host.id,command},{timeout:60000});
  const result=await page.evaluate(({id,kind,command})=>{const h=[...__env.game.localDynamicSkinTestHub.hosts.values()].find(h=>h.e.id===id),p=h.frame.contentWindow.skinPlayer,base=p.engine42?.layers||p.root.children,extra=p.engine42?.externalLayers||p.externalLayers;const active=extra.find(l=>l.visible)||base.find(l=>l.state.getCurrent(0)?.loop===false),track=active?.state.getCurrent(0);if(!track)throw Error('No finite event track');const seconds=track.animation.duration/(track.timeScale||1)+.1;if(seconds>30)throw Error('Duration exceeds this bounded bridge fixture');for(let time=0;time<seconds;time+=1/60){if(p.engine42)p.engine42.draw(1/60);else{[...base,...extra.filter(l=>l.visible)].forEach(l=>l.update(1/60));p.app.render();}}return{id,kind,command,seconds,external:extra.includes(active),restored:extra.every(l=>!l.visible)&&base.every(l=>!l.sourceHidden&&l.renderable!==false)};},{id:host.id,kind,command});
  await page.waitForFunction(kind=>__eventReports.some(r=>r.kind===kind),kind);
  result.notifications=await page.evaluate(()=>__eventReports);assert.ok(result.restored);assert.ok(result.notifications.some(r=>r.reason==='completed'));report.eventChecks.push(result);await save();
 }
 assert.ok(report.eventChecks.length,'At least one source event must traverse the real game bridge');report.completed=true;await page.screenshot({path:path.join(out,'final.png')});
}catch(error){report.failure=String(error);throw error;}finally{report.finishedAt=new Date().toISOString();await save();await browser.close();}
console.log(JSON.stringify({completed:report.completed,checks:report.eventChecks,errors:report.errors}));
