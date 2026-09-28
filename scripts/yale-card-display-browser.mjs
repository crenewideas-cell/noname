// Real production modules, isolated DOM seats; never starts a match.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='output/yale-card-display';
await fs.mkdir(out,{recursive:true});
const context=await chromium.launchPersistentContext(out+'/profile',{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}}),report={errors:[],matchStarted:false};
try{
 await context.routeWebSocket('**',s=>{if(new URL(s.url()).hostname!=='127.0.0.1'){s.close();return;}const server=s.connectToServer();server.onMessage(m=>{try{if(JSON.parse(String(m)).type==='connected')s.send(m);}catch{}});});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await context.route('**/game/config.json*',async r=>{const response=await r.fetch(),c=await response.json();Object.assign(c,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',mode:'identity',characters:['standard'],cards:['standard'],show_splash:'always',ui_workshop_active:'builtin-rzsh',change_skin:true,animation:true,low_performance:false});for(const k of Object.keys(c))if(k.startsWith('extension_')&&k.endsWith('_enable'))c[k]=false;await r.fulfill({response,json:c});});
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

 await page.evaluate(async()=>{
  const {lib,game,ui}=__env;
  ui.dialogs ||= [];ui.dialogUpdates ||= [];
  const cards=(await import('/card/standard.js')).default;
  Object.assign(lib.card,cards.card);Object.assign(lib.translate,cards.translate);
  lib.inpile=['wuzhong','guohe','shunshou','juedou','nanman'];
  game.me.getStorage=()=>['wuzhong','wuzhong'];
  const skills=(await import('/extension/怒焰三国/character/skill.js')).default;
  window.__yale=skills.nysgs_huan_caiwenji_skill;
  lib.skill.nysgs_yanzoudiaoshi=skills.nysgs_yanzoudiaoshi;
  game.me.isOnline2=()=>false;
  game.me.chooseButton=()=>({set(){return this},forResult(){return new Promise(resolve=>window.__chooseMode=resolve)}});
  window.__playing=skills.nysgs_yanzoudiaoshi.playMode({name:'nysgs_huan_caiwenji_skill_init'}, {}, game.me);
  window.__dialog=document.querySelector('#nysgs_playMode');
 });

 await page.waitForTimeout(800);
 report.cases=[];
 for(const provider of ['default','shousha','decade']){
  await page.evaluate(provider=>{
   for(const a of ['data-decade-parts','data-shousha-parts','data-decade-loading','data-shousha-loading'])document.body.removeAttribute(a);
   document.body.classList.remove('decade-layout','shousha-skinned-arena','shousha-native-game');
   document.querySelector('#test-provider')?.remove();
   if(provider!=='default'){
    document.body.setAttribute('data-'+provider+'-parts','players cards menus buttons');
    const link=document.createElement('link');link.id='test-provider';link.rel='stylesheet';link.href=provider==='shousha'?'/extension/手杀标准UI/native/presentation.css':'/extension/十周年局内UI/presentation.css';document.head.append(link);
   }
  },provider);
  await page.waitForTimeout(250);
  for(const selected of [false,true]){
   const cards=await page.evaluate(async selected=>{
    return Promise.all(__dialog.buttons.map(async b=>{
     b.classList.toggle('selected',selected);b.classList.add('selectable');
     const style=getComputedStyle(b),url=style.backgroundImage.match(/url\("?([^"\)]+)"?\)/)?.[1];
     const img=new Image();if(url)img.src=url;
     let loaded=false;try{if(url){await img.decode();loaded=img.naturalWidth>0;}}catch{}
     return {condition:b.dataset.condition,link:b.link,background:style.backgroundImage,border:style.borderImageSource,label:b.getAttribute('aria-label'),loaded};
    }));
   },selected);
   assert.deepEqual(cards.map(c=>c.condition),['Do','Re','Mi','Sol','La']);
   assert(cards.every(c=>c.loaded&&c.background.includes('/'+c.condition+'.png')&&c.border==='none'&&c.label),'original mode artwork must survive button theming');
   report.cases.push({provider,selected,cards});
  }
  const identities=await page.evaluate(()=>__env.game.players.slice(0,2).map(p=>{const n=p.node.identity;return{font:getComputedStyle(n.firstChild).fontFamily,border:getComputedStyle(n).borderStyle,text:n.textContent}}));
  assert.equal(identities[0].font,identities[1].font);assert.equal(identities[0].border,identities[1].border);assert.equal(identities[0].text,'忠');
  await page.screenshot({path:out+'/'+provider+'-after.png'});
 }
 report.selection=await page.evaluate(async()=>{
  const {game}=__env;let added;
  game.me.addAdditionalSkills=async(group,links)=>{added={group,links}};
  __chooseMode({bool:true,links:['nysgs_mode_Re']});await __playing;return added;
 });
 assert.deepEqual(report.selection,{group:'nysgs_yanzoudiaoshi',links:['nysgs_mode_Re']});
 report.tricks=await page.evaluate(()=>{
  const d=__yale.chooseButton.dialog({filterCard:()=>true},__env.game.me);
  const result=d.buttons.map(b=>({name:b.link[2],uses:b.node.info.textContent,art:b.node.image.style.backgroundImage}));d.close();return result;
 });
 assert.equal(report.tricks.length,5);assert.equal(report.tricks[0].uses,'3');assert(report.tricks.every(c=>c.art));
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify({cases:report.cases.length,selection:report.selection,tricks:report.tricks.length,errors:report.errors}));
}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await context.close();}
