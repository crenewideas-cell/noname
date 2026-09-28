// Real production modules, isolated DOM seats; never starts a match.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='output/dynamic-remediation/20260926-r01/responsive-r14/size-only';
await fs.mkdir(out,{recursive:true});
const context=await chromium.launchPersistentContext(out+'/profile',{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}}),report={errors:[],matchStarted:false};
try{
 await context.routeWebSocket('**',s=>{if(new URL(s.url()).hostname!=='127.0.0.1'){s.close();return;}const server=s.connectToServer();server.onMessage(m=>{try{if(JSON.parse(String(m)).type==='connected')s.send(m);}catch{}});});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await context.route('**/game/config.json*',async r=>{const response=await r.fetch(),c=await response.json();Object.assign(c,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',mode:'identity',characters:['standard'],cards:['standard'],show_splash:'always',ui_workshop_active:'builtin-shousha-standard',change_skin:true,animation:true,low_performance:false});for(const k of Object.keys(c))if(k.startsWith('extension_')&&k.endsWith('_enable'))c[k]=k==='extension_千幻聆音_enable';await r.fulfill({response,json:c});});
 await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 const page=context.pages()[0];page.on('pageerror',e=>report.errors.push(e.stack));page.on('console',m=>{if(m.type()==='warning')(report.warnings||=[]).push(m.text());});page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:8081',{waitUntil:'domcontentloaded'});
 await page.evaluate(async()=>window.__env=await import('/noname.js'));
 await page.waitForFunction(()=>window.__env?.game.qhly_coreReady&&__env.game.localDynamicPacksReady,null,{timeout:120000});
 report.startup=await page.evaluate(async()=>({overlay:!!document.querySelector('vite-error-overlay'),aliasImports:await Promise.all(['/extension/手杀标准UI/native/layout.js','/extension/十周年局内UI/layout.js'].map(async url=>({url,exported:typeof(await import(url)).installAdaptiveLayout})))}));
 assert.equal(report.startup.overlay,false);assert(report.startup.aliasImports.every(m=>m.exported==='function'));
 await page.evaluate(async()=>{
  const {ui,lib,game,_status,get}=__env;
  await import('/character/rank.js');lib.rank=window.noname_character_rank;
  const c=await import('/character/standard/character.js'),t=await import('/character/standard/translate.js');lib.characterPack.standard=c.default;Object.assign(lib.translate,t.default);
  document.querySelector('#splash')?.remove();document.querySelectorAll('iframe').forEach(n=>n.remove());
  ui.window ||= ui.create.div('#window',document.body);ui.window.style.display='';
  ui.arena ||= ui.create.div('#arena',ui.window);ui.arena.classList.add('textequip');ui.arena.dataset.number='5';ui.arena.style.display='';
  ui.canvas ||= document.createElement('canvas');
  for(const n of [ui.window,ui.arena]){n.classList.remove('hidden');n.style.visibility='visible';n.style.opacity='1';}
  for(const file of ['layout/mobile/layout.css','layout/mobile/equip.css','layout/default/equipment-labels.css']){const link=document.createElement('link');link.rel='stylesheet';link.href='/'+file;document.head.append(link);}
  game.players=[];game.dead=[];
  for(let i=0;i<5;i++){
   const p=ui.create.player(ui.arena);p.dataset.position=String(i);p.name=p.name1=['caocao','liubei','sunquan','diaochan'][i%4];p.hp=p.maxHp=4;p.group=['wei','shu','wu','qun'][i%4];p.node.name.textContent=get.translation(p.name);p.node.avatar.show();p.node.avatar.setBackground(p.name,'character');p.node.equips.show();game.players.push(p);
   p.style.width='128px';p.style.height='180px';
   const card=ui.create.card(p.node.equips);card.name='zhuge';card.classList.add('equip1');card.node.name2.textContent='♥K 测试装备';
  }
  game.me=game.players[0];
  const {builtinPacks}=await import('/noname/ui/workshop/presets.js'),{mountGamePresentation}=await import('/extension/手杀标准UI/native/presentation.js');
  const manifest=builtinPacks().find(p=>p.manifest.id==='builtin-shousha-standard').manifest,base='/extension/手杀标准UI/';
  window.__release=await mountGamePresentation({lib,game,ui,get,manifest,base,files:await(await fetch(base+'files.json')).json(),config:{ss_auto_emotion:false,ss_emotion_reply:false},signal:new AbortController().signal});
 });
 await page.waitForTimeout(1800);

 await page.evaluate(()=>{for(const n of document.body.children)if(n!==__env.ui.window&&!['SCRIPT','STYLE','LINK','svg'].includes(n.tagName))n.style.display='none';__env.ui.arena.style.setProperty('visibility','visible','important');window.__hits=[];__env.ui.arena.addEventListener('click',e=>{const p=e.target.closest('.player');if(p){__hits.push(p.dataset.position);e.stopImmediatePropagation();e.preventDefault();}},true);});
 report.cases=[];
 for(const provider of ['shousha','decade']){
  if(provider==='decade')await page.evaluate(async()=>{
   __release?.();const {builtinPacks}=await import('/noname/ui/workshop/presets.js'),manifest=builtinPacks().find(p=>p.manifest.id==='builtin-decade-ingame').manifest;
   const {mountPresentation}=await import('/extension/十周年局内UI/presentation.js');window.__release=await mountPresentation({base:'/extension/十周年局内UI/',manifest,...__env,signal:new AbortController().signal});
  });
  for(const [width,height,zoom]of [[996,591,1],[900,650,1],[1440,900,1],[1280,800,.8]]){
   await page.setViewportSize({width,height});await page.evaluate(zoom=>{__env.ui.window.style.zoom=String(zoom);__hits=[];},zoom);await page.waitForTimeout(1300);
   const r=await page.evaluate(()=>({arena:__env.ui.arena.getBoundingClientRect().toJSON(),players:__env.game.players.map(p=>({seat:p.dataset.position,rect:p.getBoundingClientRect().toJSON()}))}));
   console.log(provider,width,height,r.players.map(p=>p.rect.width));for(const p of r.players){const b=p.rect;assert(b.width>=108*zoom,provider+' targets smaller than standard hand cards');assert(b.x>=r.arena.x-1&&b.right<=r.arena.right+1&&b.y>=r.arena.y-1&&b.bottom<=r.arena.bottom+1,provider+' outside arena');await page.mouse.click(b.x+b.width*.5,b.y+b.height*.3);}
   const hits=await page.evaluate(()=>__hits);report.cases.push({provider,width,height,zoom,...r,hits});assert.equal(new Set(hits).size,5,provider+' hit targets');
   await page.screenshot({path:out+'/'+provider+'-'+width+'-'+zoom+'.png'});
  }
 }
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify({startup:report.startup,cases:report.cases.length,errors:report.errors}));
}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await context.close();}
