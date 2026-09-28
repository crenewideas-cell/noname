// Real production modules, isolated DOM seats; never starts a match.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const phase=process.env.R13_PHASE||'before',out='output/dynamic-remediation/20260926-r01/match-presentation-r13/'+phase;
await fs.mkdir(out,{recursive:true});
const context=await chromium.launchPersistentContext(out+'/profile',{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}}),report={errors:[],matchStarted:false};
try{
 await context.routeWebSocket('**',s=>{if(new URL(s.url()).hostname!=='127.0.0.1'){s.close();return;}const server=s.connectToServer();server.onMessage(m=>{try{if(JSON.parse(String(m)).type==='connected')s.send(m);}catch{}});});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await context.route('**/game/config.json*',async r=>{const response=await r.fetch(),c=await response.json();Object.assign(c,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',mode:'identity',characters:['standard'],cards:['standard'],show_splash:'always',ui_workshop_active:'builtin-rzsh',change_skin:true,animation:true,low_performance:false});for(const k of Object.keys(c))if(k.startsWith('extension_')&&k.endsWith('_enable'))c[k]=k==='extension_千幻聆音_enable';await r.fulfill({response,json:c});});
 await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 const page=context.pages()[0];page.on('pageerror',e=>report.errors.push(e.stack));page.on('console',m=>{if(m.type()==='warning')(report.warnings||=[]).push(m.text());});page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:8081',{waitUntil:'domcontentloaded'});
 await page.evaluate(async()=>window.__env=await import('/noname.js'));
 await page.waitForFunction(()=>window.__env?.game.qhly_coreReady&&__env.game.localDynamicPacksReady,null,{timeout:120000});
 await page.evaluate(async()=>{
  const {ui,lib,game,_status,get}=__env;
  await import('/character/rank.js');lib.rank=window.noname_character_rank;
  const c=await import('/character/standard/character.js'),t=await import('/character/standard/translate.js');lib.characterPack.standard=c.default;Object.assign(lib.translate,t.default);
  document.querySelector('#splash')?.remove();document.querySelectorAll('iframe').forEach(n=>n.remove());
  ui.window ||= ui.create.div('#window',document.body);ui.window.style.display='';
  ui.arena ||= ui.create.div('#arena',ui.window);ui.arena.classList.add('textequip');ui.arena.dataset.number='4';ui.arena.style.display='';
  ui.canvas ||= document.createElement('canvas');
  for(const n of [ui.window,ui.arena]){n.classList.remove('hidden');n.style.visibility='visible';n.style.opacity='1';}
  for(const file of ['layout/mobile/layout.css','layout/mobile/equip.css','layout/default/equipment-labels.css']){const link=document.createElement('link');link.rel='stylesheet';link.href='/'+file;document.head.append(link);}
  game.players=[];game.dead=[];
  for(let i=0;i<4;i++){
   const p=ui.create.player(ui.arena);p.dataset.position=String(i);p.name=p.name1=['caocao','liubei','sunquan','diaochan'][i];p.hp=p.maxHp=4;p.group=['wei','shu','wu','qun'][i];p.node.name.textContent=get.translation(p.name);p.node.avatar.show();p.node.avatar.setBackground(p.name,'character');p.node.equips.show();game.players.push(p);
   p.style.width='128px';p.style.height='180px';
   const card=ui.create.card(p.node.equips);card.name='zhuge';card.classList.add('equip1');card.node.name2.textContent='♥K 测试装备';
  }
  game.me=game.players[0];
  const {builtinPacks}=await import('/noname/ui/workshop/presets.js'),{mountGamePresentation}=await import('/extension/ui/手杀标准UI/native/presentation.js');
  const manifest=builtinPacks().find(p=>p.manifest.id==='builtin-shousha-standard').manifest,base='/extension/ui/手杀标准UI/';
  window.__release=await mountGamePresentation({lib,game,ui,get,manifest,base,files:await(await fetch(base+'files.json')).json(),config:{ss_auto_emotion:false,ss_emotion_reply:false},signal:new AbortController().signal});
 });
 await page.waitForTimeout(1800);
 report.body=await page.evaluate(()=>[...document.body.children,...__env.ui.window.children].map(n=>({tag:n.tagName,id:n.id,class:n.className,z:getComputedStyle(n).zIndex,opacity:getComputedStyle(n).opacity,visibility:getComputedStyle(n).visibility})));
 await page.evaluate(()=>{for(const n of document.body.children)if(n!==__env.ui.window&&!['SCRIPT','STYLE','LINK','svg'].includes(n.tagName))n.style.display='none';__env.ui.arena.style.setProperty('visibility','visible','important');});
 await page.waitForTimeout(400);
 report.geometry=await page.evaluate(()=>__env.game.players.map(p=>{const e=p.node.equips,r=p.node.avatar.getBoundingClientRect(),s=getComputedStyle(e);return {seat:p.dataset.position,player:p.getBoundingClientRect().toJSON(),avatar:r.toJSON(),equip:e.getBoundingClientRect().toJSON(),scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,overflow:s.overflowY,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.className,children:[...e.children].map(n=>({class:n.className,rect:n.getBoundingClientRect().toJSON(),scroll:n.scrollHeight}))};}));
 await page.screenshot({path:out+'/seats.png'});
 const r=report.geometry[0].avatar;await page.mouse.click(r.x+r.width/2,r.y+r.height*.3);await page.waitForTimeout(500);
 report.menu=await page.evaluate(()=>({open:__env._status.qhly_playerWindowing===true,clicked:__env._status.clicked,selecting:__env.ui.arena.className,ready:__env.game.qhly_coreReady}));
 await page.screenshot({path:out+'/menu.png'});await page.evaluate(()=>__env.game.qhly_closePlayerWindow?.());
 report.line=await page.evaluate(async()=>{const {game}=__env;const img=new Image();img.src='/image/pointer/migrated/yulongLineXy/line.png';await img.decode();game.me.line(game.players[2]);const n=document.querySelector('.migrated-attack-line');if(n){for(const a of n.getAnimations()){a.pause();a.currentTime=683;}return{style:n.style.cssText,computed:{opacity:getComputedStyle(n).opacity,visibility:getComputedStyle(n).visibility},rect:n.getBoundingClientRect().toJSON()};}});
 await page.waitForTimeout(300);
 await page.screenshot({path:out+'/line.png'});
 report.endpoints=[];
 for(const [width,height,zoom]of [[1440,900,1],[1100,720,.85],[1920,1080,1.1]]){
  await page.setViewportSize({width,height});
  await page.evaluate(zoom=>__env.ui.arena.style.zoom=String(zoom),zoom);await page.waitForTimeout(250);
  report.endpoints.push(await page.evaluate(()=>{
   const {game}=__env;game.clearAttackLines();game.me.line(game.players[3]);
   const n=document.querySelector('.migrated-attack-line');for(const a of n.getAnimations()){a.pause();a.currentTime=50+950*2/3;}
   const points=[0,parseFloat(n.style.width)].map(x=>{const p=document.createElement('i');p.style.cssText=`position:absolute;left:${x}px;top:${parseFloat(n.style.height)/2}px;width:0;height:0`;n.append(p);const r=p.getBoundingClientRect();return{x:r.x,y:r.y};});
   const wanted=[game.me,game.players[3]].map(p=>{const r=p.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
   return {viewport:[innerWidth,innerHeight],zoom:__env.ui.arena.style.zoom,points,wanted,error:Math.max(...points.map((p,i)=>Math.hypot(p.x-wanted[i].x,p.y-wanted[i].y)))};
  }));
 }
 await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>{__env.game.clearAttackLines();__env.ui.arena.style.zoom='1';});await page.waitForTimeout(250);
 report.emotionSetup=await page.evaluate(async()=>{
  const {game,lib,get}=__env,mode=(await import('/mode/identity.js')).default;Object.assign(get,mode.get);
  game.zhu=game.me;game.me.isZhu=true;game.players.forEach((p,i)=>{p.identity=['zhu','zhong','fan','fan'][i];p.identityShown=true;p.ai.shown=1;});
  lib.config.background_audio=false;
  const {installEmotionReplies,subscribePresentation}=__env;
  window.__gifts=[];window.__giftStop=subscribePresentation(m=>{if(m.type==='emotion')__gifts.push({sender:m.player.seat,target:m.target.seat,emotion:m.emotion});});window.__reactionsStop=installEmotionReplies({automatic:()=>true,enabled:()=>true});
  __env._status.gameDrawed=true;
  for(const num of [1,2])lib.element.GameEvent.prototype.trigger.call({name:'damage',player:game.players[2],source:game.players[1],num},'damageSource');
  return {attitudes:[get.attitude(game.me,game.players[1]),get.attitude(game.players[1],game.players[2])],players:game.players.map(p=>({seat:p.dataset.position,in:p.isIn(),control:p.isUnderControl(),online:p.isOnline()})),connect:__env._status.connectMode,video:__env._status.video,over:__env._status.over,observe:game.observe,online:game.online,notMe:game.notMe};
 });
 await page.waitForTimeout(1080);await page.screenshot({path:out+'/flowers.png'});await page.waitForTimeout(1300);
 report.emotions=await page.evaluate(()=>{__giftStop();__reactionsStop();return __gifts;});
 report.death=await page.evaluate(async()=>{
  const {lib,game}=__env,mode=(await import('/mode/identity.js')).default,p=game.players[3];Object.assign(lib.translate,mode.translate);
  p.$dieAfter=mode.element.player.$dieAfter;p.showIdentity=mode.element.player.showIdentity;p.identity='cai';p.identityShown=false;p.classList.add('dead');p.$dieAfter();
  const before=p.node.dieidentity.textContent;lib.playerOL={fixture:p};mode.game.updateState({fixture:{identity:'fan',identityShown:true,shown:1}});
  return {before,after:p.node.dieidentity.textContent,badge:p.node.identity.textContent,identity:p.identity,shown:p.identityShown};
 });
 await page.screenshot({path:out+'/death-revealed.png'});
 await page.evaluate(()=>{__env.lib.config.qhly_smallwindowstyle='dragon';__env.game.qhly_closePlayerWindow?.();});
 const avatar=await page.evaluate(()=>__env.game.me.node.avatar.getBoundingClientRect().toJSON());await page.mouse.click(avatar.x+avatar.width/2,avatar.y+avatar.height*.3);
 await page.getByRole('button',{name:'换肤',exact:true}).click();await page.waitForSelector('.qhly-dragonwin-out',{timeout:10000});await page.waitForTimeout(600);
 report.skinWindow=await page.locator('.qhly-dragonwin-out').isVisible();await page.screenshot({path:out+'/skin-window.png'});
 assert.equal(report.menu.open,true);assert.equal(report.skinWindow,true);assert.ok(report.geometry.every(r=>r.clientHeight===22&&r.hit==='avatar'));
 assert.ok(report.endpoints.every(r=>r.error<1),JSON.stringify(report.endpoints));assert.equal(report.death.after,'反贼');assert.equal(report.death.shown,true);assert.deepEqual(report.errors,[]);
 assert.equal(report.emotions.length,3);assert.ok(report.emotions.every(m=>m.sender==='0'&&m.target==='1'&&m.emotion==='flower'));
}catch(e){report.failure=String(e);throw e;}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await context.close();}
