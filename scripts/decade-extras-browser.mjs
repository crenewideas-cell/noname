// Scoped verification for hand-limit output, source marks and target/dying FX.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.resolve('output/decade-extras/browser');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage();
const report={errors:[],missing:[],sourceRequests:[],animationRequests:[],checks:[]};
page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
page.on('console',m=>{if(m.type()==='warning'&&/动画|动效|装饰失败/.test(m.text()))report.errors.push(m.text());});
page.on('response',r=>{const u=decodeURIComponent(r.url());if(u.includes('/十周年局内UI/')){if(r.status()>=400)report.missing.push(u);if(/SS_jiuwo|\/guohechaiqiao\.|\/shunshouqianyang\./.test(u))report.animationRequests.push(u);}});
await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.pathname.startsWith('/temp/')){report.sourceRequests.push(u.href);return r.abort();}return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_disable_extension','true'));
await page.route('**/game/config.json',async r=>{
 const response=await r.fetch(),config=await response.json();
 Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:'builtin-decade-ingame'});
 config.mode_config.identity={...config.mode_config.identity,player_number:'5',double_character:false,change_card:'once'};
 for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
 await r.fulfill({response,json:config});
});
const shot=name=>page.screenshot({path:path.join(output,name+'.png')});
try{
 await page.goto(process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8182',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});await page.waitForSelector('.decade-frame');
 await page.locator('#arena .button.character.selectable').first().click();await page.waitForSelector('#control [data-action="cancel"]',{timeout:60000});await page.waitForTimeout(800);
 await page.evaluate(async()=>{window.host=await import('/noname.js');window.visual=await import('/noname/ui/presentationEvents.js');host.game.pause2();});
 if(await page.locator('#extension-recovery summary').isVisible())await page.locator('#extension-recovery summary').click();
 await page.waitForTimeout(3500);
 // Exercise private presentation snapshots only; do not invoke a modifier to
 // manufacture a UI value, alter HP or install skills on a live participant.
 for(const [value,expected]of [[6,'6'],[0,'0'],['infinity','∞']]){
  await page.evaluate(v=>visual.rememberHandLimit(host.game.me,v==='infinity'?Infinity:v),value);
  await page.waitForFunction(t=>document.querySelector('.decade-hand-limit .limit')?.textContent===t,expected);
  if(value===0)assert.equal(await page.locator('.decade-hand-limit').evaluate(n=>n.classList.contains('over-limit')),true);
 }
 await page.evaluate(()=>visual.rememberHandLimit(host.game.me,6));await shot('hand-limit');
 report.checks.push('hand count with host-captured finite/zero/infinite limits and overflow color');
 report.marks=await page.evaluate(async()=>{
  const{game,ui,lib}=host,p=game.me.cloneNode(true);p.className='player';p.dataset.position='6';p.hp=0;
  p.style.setProperty('left','200px','important');p.style.setProperty('top','340px','important');
  p.querySelectorAll('.decade-frame,.decade-prefix-mark,.decade-skill-marks,.decade-portrait').forEach(n=>n.remove());
  const metadata=await(await fetch('/extension/十周年局内UI/animation-assets.json')).json();
  const prefixKey=Object.keys(lib.translate).find(k=>k.endsWith('_prefix')&&['jie','shen','sp','tw'].includes(metadata.prefixMarks[lib.translate[k]]));
  p.name=p.name1=prefixKey?.slice(0,-7);p.node={marks:p.querySelector('.marks'),identity:p.querySelector('.identity'),avatar:p.querySelector('.avatar'),name:p.querySelector('.name')};
  // Core keeps an invisible first placeholder; preserve that layout contract.
  p.node.marks.replaceChildren(document.createElement('div'));window.fixtureMarks=[];window.fixtureClicks=0;
  const names=['spade','heart','club','diamond'].map(s=>'xinfu_falu_'+s).concat(['qun','shu','wei','wu','jin','shen'].map(s=>'starcanxi_'+s));
  for(const name of names){const node=document.createElement('div');node.className='card mark';node.name=name;node.dataset.skill=name;const text=document.createElement('div');text.className='background skillmark';text.textContent='标';node.append(text);node.onclick=()=>window.fixtureClicks++;p.node.marks.append(node);fixtureMarks.push(node);}
  ui.arena.append(p);ui.updatem(p);window.fixturePlayer=p;
  await new Promise(r=>setTimeout(r,250));fixtureMarks[0].click();
  return {prefixKey,decorated:p.querySelectorAll('.decade-special-mark').length,styles:fixtureMarks.map(n=>getComputedStyle(n).backgroundImage),geometry:fixtureMarks.map(n=>({rect:n.getBoundingClientRect().toJSON(),visibility:getComputedStyle(n).visibility,opacity:getComputedStyle(n).opacity,display:getComputedStyle(n).display})),parentStyle:p.node.marks.getAttribute('style'),clicks:fixtureClicks,prefix:p.querySelector('.decade-prefix-mark')?.dataset.file};
 });
 assert.equal(report.marks.decorated,10);assert.equal(report.marks.clicks,1);assert.ok(report.marks.styles.every(s=>/falu_|starcanxi_/.test(s)));assert.ok(report.marks.prefix);
 assert.ok(report.marks.geometry.every(g=>g.opacity==='1'&&g.visibility==='visible'&&g.rect.width>15));await shot('special-marks');
 await page.evaluate(()=>fixturePlayer.classList.add('unseen'));await page.waitForFunction(()=>!fixturePlayer.querySelector('.decade-special-mark,.decade-prefix-mark'));
 await page.evaluate(()=>fixturePlayer.classList.remove('unseen'));await page.waitForFunction(()=>fixturePlayer.querySelectorAll('.decade-special-mark').length===10);
 await page.evaluate(()=>fixtureMarks[0].remove());await page.waitForFunction(()=>!fixtureMarks[0].classList.contains('decade-special-mark'));
 report.checks.push('four falu and six canxi source icons retain handlers; visible prefix; hide/reveal and mark removal cleanup');
 await page.evaluate(()=>visual.rememberDying(fixturePlayer,true));await page.waitForTimeout(1700);await shot('dying');
 assert.ok(report.animationRequests.some(u=>u.endsWith('/SS_jiuwo.skel')));
 await page.evaluate(()=>visual.rememberDying(fixturePlayer,false));await page.waitForTimeout(500);await shot('recovered');
 for(const card of ['guohe','shunshou']){
  await page.evaluate(card=>host.game.me.$cardTargetPresentation(card,host.game.players.find(p=>p!==host.game.me)),card);
  await page.waitForTimeout(500);await shot(card);await page.waitForTimeout(850);
 }
 assert.ok(report.animationRequests.some(u=>u.endsWith('/guohechaiqiao.skel')));assert.ok(report.animationRequests.some(u=>u.endsWith('/shunshouqianyang.skel')));
 report.checks.push('real renderer loaded and drew dying loop plus both target-resolution skeletons');
 for(const viewport of [{width:844,height:480},{width:390,height:844}]){
  await page.setViewportSize(viewport);await page.waitForTimeout(1200);
  const rect=await page.locator('.decade-hand-limit').boundingBox();assert.ok(rect.x>=0&&rect.y>=0&&rect.x+rect.width<=viewport.width+1&&rect.y+rect.height<=viewport.height+1);await shot('size-'+viewport.width);
 }
 // Pause keeps the authoritative board stable during release/remount.
 report.boundary=await page.evaluate(async()=>{
  const{game,ui,lib}=host,{activate}=await import('/extension/十周年局内UI/extension.js'),{decadeManifest}=await import('/noname/ui/workshop/ingame.js');
  const state=()=>JSON.stringify({players:game.players.map(p=>({hp:p.hp,skills:p.skills,storage:p.storage,cards:p.getCards('hej').map(c=>c.cardid)})),pile:[...ui.cardPile.children].map(c=>c.cardid),skills:Object.keys(lib.skill)});
  const oldRandom=Math.random,refs=[game.checkMod,lib.element.player.getHandcardLimit,ui.click.card],before=state();let calls=0;Math.random=()=>{calls++;return oldRandom();};
  try{
   visual.rememberDying(fixturePlayer,true);const release=await activate(decadeManifest);await new Promise(r=>setTimeout(r,300));release();
   const remaining=document.querySelectorAll('.decade-special-mark,.decade-prefix-mark,.decade-hand-limit,.decade-animation').length;
   await activate(decadeManifest);await new Promise(r=>setTimeout(r,350));
   const restored=document.querySelector('.decade-hand-limit .limit')?.textContent;fixturePlayer.remove();
   return {remaining,restored,unchanged:before===state(),sameMethods:refs.every((v,i)=>v===[game.checkMod,lib.element.player.getHandcardLimit,ui.click.card][i]),randomCalls:calls};
  }finally{Math.random=oldRandom;}
 });
 assert.deepEqual(report.boundary,{remaining:0,restored:'6',unchanged:true,sameMethods:true,randomCalls:0});
 report.checks.push('narrow/portrait counter bounds and provider release/remount preserve rules, state, RNG and captured limit');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);assert.deepEqual(report.sourceRequests,[]);report.passed=true;
}catch(error){report.failure=error.stack;process.exitCode=1;await shot('failure').catch(()=>{});}
finally{await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify(report,null,2));
