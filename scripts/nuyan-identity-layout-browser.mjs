// Real production modules, isolated DOM seats; never starts a match.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='output/nuyan-identity-layout';
await fs.mkdir(out,{recursive:true});
const context=await chromium.launchPersistentContext(out+'/profile',{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}}),report={errors:[],matchStarted:false};
try{
 await context.routeWebSocket('**',s=>{if(new URL(s.url()).hostname!=='127.0.0.1'){s.close();return;}const server=s.connectToServer();server.onMessage(m=>{try{if(JSON.parse(String(m)).type==='connected')s.send(m);}catch{}});});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await context.route('**/game/config.json*',async r=>{const response=await r.fetch(),c=await response.json();Object.assign(c,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',mode:'identity',characters:['standard'],cards:['standard'],show_splash:'always',ui_workshop_active:'builtin-shousha-standard',change_skin:true,animation:true,low_performance:false});for(const k of Object.keys(c))if(k.startsWith('extension_')&&k.endsWith('_enable'))c[k]=false;await r.fulfill({response,json:c});});
 await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 const page=context.pages()[0];page.on('pageerror',e=>report.errors.push(e.stack));page.on('console',m=>{if(m.type()==='warning')(report.warnings||=[]).push(m.text());});page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:8081',{waitUntil:'domcontentloaded'});
 await page.evaluate(async()=>window.__env=await import('/noname.js'));
 await page.waitForFunction(()=>window.__env?.lib.config?.mode&&__env.lib.element?.Player,null,{timeout:60000});

 await page.evaluate(async()=>{
  const {ui,lib,game,get}=__env;
  await import('/character/rank.js');lib.rank=window.noname_character_rank;
  document.querySelector('#splash')?.remove();document.querySelectorAll('iframe').forEach(n=>n.remove());
  ui.window ||= ui.create.div('#window',document.body);ui.window.style.display='';
  ui.arena ||= ui.create.div('#arena',ui.window);ui.arena.dataset.number='5';ui.arena.style.display='';
  ui.canvas ||= document.createElement('canvas');
  for(const n of [ui.window,ui.arena]){n.classList.remove('hidden');n.style.visibility='visible';n.style.opacity='1';}
  for(const n of document.body.children)if(n!==ui.window&&!['SCRIPT','STYLE','LINK','svg'].includes(n.tagName))n.style.display='none';
  for(const file of ['layout/mobile/layout.css','extension/怒焰三国/extension.css']){const link=document.createElement('link');link.rel='stylesheet';link.href='/'+file;document.head.append(link);}
  Object.assign(lib.translate,{zhu:'主',zhong:'忠',fan:'反',nei:'内',cai:'猜'});
  game.players=[];game.dead=[];
  for(let i=0;i<5;i++){
   const p=ui.create.player(ui.arena);p.dataset.position=String(i);p.name=p.name1=['diaochan','caocao','liubei','sunquan','caocao'][i];p.node.avatar.show();p.node.avatar.setBackground(p.name,'character');p.node.name.textContent=['蔡文姬','曹操','刘备','孙权','曹操'][i];p.identity=['zhong','fan','zhu','nei','fan'][i];p.setIdentity(i===0?'zhong':i===2?'zhu':'cai');p.nysgsBuff={};p.countMark=()=>6;game.players.push(p);
   const mark=document.createElement('div');mark.className='card';mark.textContent='怒';p.node.marks.append(mark);
  }
  game.me=game.players[0];
  const {installCompactSeatLayout}=await import('/noname/ui/compactSeats.js');installCompactSeatLayout({game,ui,mode:'identity'});
 });
 const source=await fs.readFile('apps/core/extension/packs/怒焰三国/main/precontent.js','utf8');
 const code=source.slice(source.indexOf('nysgs.updateSkillBuff ='),source.indexOf('nysgs.initSkillBuff ='));
 await page.evaluate(async code=>{
  const {lib,game,get}=__env;
  window.nysgs={};
  const runes=(await import('/extension/怒焰三国/js/lib/skill/runestone.js')).default;
  const translations=(await import('/extension/怒焰三国/js/lib/translate/runestone.js')).default;
  Object.assign(lib.skill,runes);Object.assign(lib.translate,translations);
  window.__runes=Object.keys(runes).filter(k=>runes[k].runestoneSkill).slice(0,12);
  Function('lib','game','get','nysgs',code)(lib,game,get,nysgs);
  game.players.forEach(p=>nysgs.createSkillBuff(p===game.me?__runes:__runes.slice(0,6),p));
 },code);
 await page.waitForTimeout(1000);
 report.cases=[];
 for(const provider of ['default','shousha','decade']){
  await page.evaluate(provider=>{
   document.body.removeAttribute('data-shousha-parts');document.body.removeAttribute('data-decade-parts');
   document.querySelector('#test-provider')?.remove();
   if(provider!=='default'){
    document.body.setAttribute('data-'+provider+'-parts','players');
    const link=document.createElement('link');link.id='test-provider';link.rel='stylesheet';link.href=provider==='shousha'?'/extension/手杀标准UI/native/presentation.css':'/extension/十周年局内UI/presentation.css';document.head.append(link);
   }
  },provider);
  for(const [width,height]of [[1920,911],[1366,768],[900,650]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(300);
   const result=await page.evaluate(()=>{
    const {game,ui}=__env,r=n=>n.getBoundingClientRect().toJSON();
    const overlap=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;
    const players=game.players.map(p=>({seat:p.dataset.position,frame:r(p),panel:r(p.nysgsBuffBox),marks:r(p.node.marks),identity:r(p.node.identity),label:p.node.identity.textContent,font:getComputedStyle(p.node.identity.firstChild).fontFamily,opacity:getComputedStyle(p.node.identity.firstChild).opacity,icons:p.nysgsBuffBox.querySelectorAll('img').length,iconRows:[...p.nysgsBuffBox.querySelectorAll('img')].map(n=>r(n).top),background:getComputedStyle(p.nysgsBuffBox).backgroundImage,backgroundColor:getComputedStyle(p.nysgsBuffBox).backgroundColor,border:getComputedStyle(p.nysgsBuffBox).borderStyle,shadow:getComputedStyle(p.nysgsBuffBox).boxShadow,scrollWidth:p.nysgsBuffBox.scrollWidth,clientWidth:p.nysgsBuffBox.clientWidth}));
    return {width:innerWidth,height:innerHeight,players,overlaps:players.flatMap(a=>players.filter(b=>overlap(a.panel,b.frame)||overlap(a.panel,b.marks)).map(b=>[a.seat,b.seat])),handRight:ui.arena.style.getPropertyValue('--table-hand-right')};
   });
   report.cases.push({provider,...result});
   assert.deepEqual(result.overlaps,[],JSON.stringify(result));assert(result.players.every(p=>p.icons===(p.seat==='0'?12:6)));
   assert(result.players.every(p=>p.background==='none'&&p.backgroundColor==='rgba(0, 0, 0, 0)'&&p.border==='none'&&p.shadow==='none'));
   assert(result.players.slice(1).every(p=>new Set(p.iconRows).size===1&&p.scrollWidth<=p.clientWidth+1),'other players have one fully visible row');
   assert(result.players.slice(1).every(p=>p.panel.top>=p.frame.bottom||p.panel.bottom<=p.frame.top),'rune rows must be strictly above or below, never beside a portrait');
   const own=result.players[0];assert.equal(own.label,'忠');assert.equal(own.font,result.players[1].font,'local identity must use the same existing font as other players');
   assert(result.width-parseFloat(result.handRight)<own.panel.left,'hands must leave room for the rune panel');
   await page.screenshot({path:out+'/'+provider+'-'+width+'.png'});
  }
 }
 report.wangyou=await page.evaluate(async()=>{
  const {lib,game,_status}=__env;
  const skills=(await import('/extension/怒焰三国/character/skill.js')).default;
  const base='nysgs_huan_caiwenji_wangyou',inherited='nysgs_huan_caiwenji_wangji';
  lib.skill[base]=skills[base];lib.skill[inherited]=skills[inherited];game.finishSkill(inherited);
  lib.skill.test_old_equip={};lib.skill.test_new_equip={};lib.card.test_old_equip={skills:['test_old_equip']};lib.card.test_new_equip={skills:['test_new_equip']};
  const p=game.players[4],savedGetCards=p.getCards,savedEvent=_status.event;
  _status.event={clearStepCache(){}};let equipment=[{name:'test_old_equip'}];p.getCards=()=>equipment;
  const cases=[];
  try{
   for(const name of [base,inherited]){
    equipment=[{name:'test_old_equip'}];p.disabledSkills={test_new_equip:['other_effect']};
    lib.skill[name].init(p,name);
    if(!p.disabledSkills.test_old_equip?.includes(name))throw Error('init did not disable equipment');
    equipment=[{name:'test_new_equip'}];await lib.skill[name].content({name},{name:'equip',player:p},p);
    if(p.disabledSkills.test_old_equip||!p.disabledSkills.test_new_equip?.includes(name))throw Error('equipment refresh failed');
    await lib.skill[name].content({name},{name:'equip',player:p},p);
    if(p.disabledSkills.test_new_equip.filter(x=>x===name).length!==1)throw Error('duplicate disable reason');
    lib.skill[name].onremove(p,name);
    if(p.disabledSkills.test_new_equip.join(',')!=='other_effect')throw Error('removal changed another effect');
    equipment=[];lib.skill[name].init(p,name);await lib.skill[name].content({name},{name:'lose',player:p},p);lib.skill[name].onremove(p,name);
    cases.push(name);
   }
   // Both effects can coexist and must release only their own disable reason.
   equipment=[{name:'test_new_equip'}];p.disabledSkills={};
   for(const name of [base,inherited]){lib.skill[name].init(p,name);await lib.skill[name].content({name},{},p);}
   lib.skill[base].onremove(p,base);
   if(p.disabledSkills.test_new_equip.join(',')!==inherited)throw Error('coexisting effect was removed');
   lib.skill[inherited].onremove(p,inherited);
   if(Object.keys(p.disabledSkills).length)throw Error('equipment stayed disabled');
   return {cases,coexistence:true};
  }finally{p.getCards=savedGetCards;_status.event=savedEvent;}
 });
 const img=page.locator('.player[data-position="0"] .nysgs-buff-panel img').first();await img.hover();
 assert(await page.locator('.nysgs-skillBuffDesc').first().isVisible());
 await img.click();await page.mouse.move(10,10);
 report.update=await page.evaluate(()=>{const p=__env.game.me,k=__runes[0];p.removeMark=()=>{};p.countMark=()=>0;nysgs.updateSkillBuff(p,k);return {removed:!p.nysgsBuff[k],icons:p.nysgsBuffBox.querySelectorAll('img').length};});
 assert.equal(report.update.removed,true);assert.equal(report.update.icons,11);
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify({cases:report.cases.length,update:report.update,wangyou:report.wangyou,errors:report.errors}));
}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await context.close();}
