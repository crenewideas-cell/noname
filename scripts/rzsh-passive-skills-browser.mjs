// Real production modules, isolated DOM seats; never starts a match.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='output/rzsh-passive-skills';
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

 await page.evaluate(()=>{
  const {lib,game}=__env;
  const names=['天翊','铁骨','战英','星驰','约俭','扶危定乱','克勤巧思'];
  names.forEach((label,i)=>{lib.skill['test_passive_'+i]={};lib.translate['test_passive_'+i]=label;});
  lib.skill.test_active={enable:'phaseUse'};lib.translate.test_active='主动技能';
  game.me.skills=[...names.map((_,i)=>'test_passive_'+i),'test_active'];
  game.me.append(document.createElement('i'));
 });
 await page.waitForFunction(()=>document.querySelector('.decade-passive-skills')?.children.length===7,null,{timeout:15000});
 report.cases=[];
 for(const count of [0,6,12]){
  await page.evaluate(count=>{
   const p=__env.game.me;for(const buff of Object.values(p.nysgsBuff))buff.remove();
   nysgs.createSkillBuff(__runes.slice(0,count),p);
  },count);
  for(const [width,height,zoom]of [[1920,911,1],[1366,768,1],[900,650,1],[900,450,1],[1280,800,.8]]){
   await page.setViewportSize({width,height});await page.evaluate(zoom=>__env.ui.window.style.zoom=String(zoom),zoom);await page.waitForTimeout(350);
   const result=await page.evaluate(()=>{
    const {game,ui}=__env,p=game.me,skills=p.querySelector('.decade-passive-skills'),r=n=>n.getBoundingClientRect().toJSON();
    const frame=p.querySelector('.decade-frame'),f=r(frame),pseudo=getComputedStyle(frame,'::after'),scale=r(p).width/128;
    const decoration={left:f.left+parseFloat(pseudo.left)*scale,top:f.top+parseFloat(pseudo.top)*scale,right:f.left+(parseFloat(pseudo.left)+parseFloat(pseudo.width))*scale,bottom:f.top+(parseFloat(pseudo.top)+parseFloat(pseudo.height))*scale};
    const overlap=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;
    const panel=r(skills),runes=r(p.nysgsBuffBox),labels=[...skills.children].map(n=>n.textContent);
    return {panel,runes,decoration,portrait:r(p),labels,overlaps:overlap(panel,r(p))||overlap(panel,decoration)||!!p.nysgsBuffBox.children.length&&overlap(panel,runes),scrollHeight:skills.scrollHeight,clientHeight:skills.clientHeight,handRight:ui.arena.style.getPropertyValue('--table-hand-right'),arena:r(ui.arena),own:skills.parentElement===p,background:getComputedStyle(skills).backgroundImage};
   });
   assert.equal(result.own,true);assert.equal(result.overlaps,false,JSON.stringify(result));assert.equal(result.labels.length,7);assert(!result.labels.includes('主动技能'));assert.equal(result.background,'none');
   assert(result.panel.top>=0&&result.panel.bottom<=height+1&&result.panel.left>=0);
   assert(result.clientHeight>15,'skills remain visible with many runes');
   report.cases.push({count,width,height,zoom,...result});
   if(zoom===1&&width===1920)await page.screenshot({path:out+'/runes-'+count+'.png'});
  }
 }
 // Dynamic skill lists, scrolling and removing the last skill use the real observer.
 await page.evaluate(()=>{const {game,lib}=__env;for(let i=7;i<30;i++){lib.skill['test_passive_'+i]={};lib.translate['test_passive_'+i]='测试技能'+i;game.me.skills.push('test_passive_'+i);}game.me.append(document.createElement('i'));});
 await page.waitForFunction(()=>document.querySelector('.decade-passive-skills')?.children.length===30);
 report.scroll=await page.evaluate(()=>{const panel=document.querySelector('.decade-passive-skills');panel.scrollTop=panel.scrollHeight;return{top:panel.scrollTop,height:panel.clientHeight,scrollHeight:panel.scrollHeight}});
 assert(report.scroll.top>0);
 await page.evaluate(()=>{__env.game.me.skills=[];__env.game.me.append(document.createElement('i'));});
 await page.waitForFunction(()=>document.querySelector('.decade-passive-skills')?.children.length===0);
 assert.equal(await page.locator('.decade-passive-skills').isVisible(),false);
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify({cases:report.cases.length,scroll:report.scroll,errors:report.errors}));
}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await context.close();}
