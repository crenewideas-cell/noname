// Real core choices plus isolated visual fixtures; never load source APK code.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.resolve(process.env.NONAME_PRESENTATION_OUTPUT||'output/decade-audit/presentation');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage();
const report={errors:[],missing:[],checks:[]};
page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
page.on('response',r=>{if(r.status()>=400&&decodeURIComponent(r.url()).includes('/十周年局内UI/'))report.missing.push(r.url());});
await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_disable_extension','true'));
await page.route('**/game/config.json',async r=>{
 const response=await r.fetch(),config=await response.json();
 Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:'builtin-decade-ingame'});
 config.mode_config.identity={...config.mode_config.identity,player_number:'5',double_character:false,change_card:'once'};
 for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
 await r.fulfill({response,json:config});
});
const shot=name=>page.screenshot({path:path.join(output,name+'.png')});
const checkpoint=async name=>{console.log('checkpoint:',name);report.checkpoint=name;await fs.writeFile(path.join(output,'progress.json'),JSON.stringify(report,null,2));};
try{
 await page.goto(process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8181/',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});await page.waitForSelector('.decade-frame');
 await checkpoint('selection');
 if(await page.locator('#extension-recovery summary').isVisible())await page.locator('#extension-recovery summary').click();
 await page.waitForTimeout(1000);await shot('selection');
 await page.locator('#arena .button.character.selectable').first().click();
 await page.waitForSelector('#control [data-action="cancel"]',{timeout:60000});await page.waitForTimeout(2500);
 await page.evaluate(async()=>{window.auditHost=await import('/noname.js');window.auditHost.game.pause2();});
 assert.equal(await page.locator('.decade-menu-toggle').getAttribute('aria-expanded'),'false');
 const menuCallback=await page.evaluate(()=>{window.auditMenuCallback=window.auditHost.ui.click.auto;return getComputedStyle(document.getElementById('system1')).visibility;});assert.equal(menuCallback,'hidden');
 assert.equal(await page.locator('.decade-settings').isVisible(),false);
 await page.locator('.decade-menu-toggle').click();
 assert.equal(await page.locator('.decade-menu-toggle').getAttribute('aria-expanded'),'true');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.getElementById('system1')).visibility),'visible');
 assert.equal(await page.evaluate(()=>window.auditMenuCallback===window.auditHost.ui.click.auto),true);
 assert.equal(await page.locator('.decade-settings').isVisible(),true);
 await page.locator('.decade-menu-toggle').click();assert.equal(await page.locator('.decade-menu-toggle').getAttribute('aria-expanded'),'false');await page.waitForFunction(()=>getComputedStyle(document.querySelector('.decade-settings')).visibility==='hidden');assert.equal(await page.locator('.decade-settings').isVisible(),false);report.checks.push('menu drawer opens/closes existing core controls without replacing action callbacks');
 report.geometry=await page.evaluate(()=>{
  const {game,ui}=window.auditHost;
  return {players:game.players.map(p=>({width:p.offsetWidth,height:p.offsetHeight,rect:p.getBoundingClientRect().toJSON()})),
   hand:game.me.getCards('h').map(c=>({art:c.style.getPropertyValue('--decade-card'),corner:c.node.info.dataset.decadePoint,rect:c.getBoundingClientRect().toJSON()})),
   pile:{display:getComputedStyle(ui.cardPileNumber).display,text:ui.cardPileNumber.textContent,round:ui.cardPileNumber.dataset.decadeRound,count:ui.cardPileNumber.dataset.decadePile},
   clock:!!ui.time3?.classList.contains('decade-time'),cancel:getComputedStyle(ui.control.querySelector('[data-action="cancel"]')).backgroundImage,
   prompt:[...ui.arena.querySelectorAll(':scope>.dialog.nobutton')].map(n=>({height:n.clientHeight,content:n.querySelector('.caption')?.offsetHeight||0}))};
 });
 for(const p of report.geometry.players){assert.equal(p.width,130);assert.equal(p.height,180);assert.ok(p.rect.x>=0&&p.rect.right<=1441&&p.rect.bottom<=811);}
 assert.ok(report.geometry.hand.every(c=>c.art.includes('/assets/cards/')&&c.corner));
 assert.notEqual(report.geometry.pile.display,'none');assert.ok(report.geometry.pile.count);assert.ok(report.geometry.clock);
 assert.ok(report.geometry.cancel.includes('new_btnn.png'));
 assert.ok(report.geometry.prompt.every(p=>p.height>=p.content&&p.content>0));
 await shot('game');report.checks.push('real selection/deal: source cards, controls, visible prompt, public round/pile/clock and seat bounds');
 await checkpoint('deal');
 await page.locator('.decade-skin-button').click();await page.waitForSelector('.noname-skin-gallery[open]');await page.locator('.noname-skin-gallery .skin-close').click();await page.waitForSelector('.noname-skin-gallery',{state:'detached'});
 if(await page.locator('.decade-identity-tip').isVisible()){await page.locator('.decade-identity-tip>summary').click();assert.equal(await page.locator('.decade-identity-tip>img').isVisible(),true);await page.locator('.decade-identity-tip>summary').click();}
 report.checks.push('skin entry opens/closes the core wardrobe and standard identity task image toggles');
 report.fixtures=await page.evaluate(async()=>{
  const{ui,game}=window.auditHost;const p=game.me.cloneNode(true);p.className='player';p.dataset.position='5';
  p.node={identity:p.querySelector('.identity'),avatar:p.querySelector('.avatar'),name:p.querySelector('.name')};
  p.querySelectorAll('.decade-frame,.decade-portrait,.decade-death').forEach(n=>n.remove());
  p.node.identity.classList.remove('decade-identity');p.node.identity.style.removeProperty('--decade-icon');
  p.node.identity.innerHTML='<div>地</div>';ui.arena.append(p);
  const wait=()=>new Promise(r=>setTimeout(r,120));await wait();const land=p.node.identity.style.getPropertyValue('--decade-icon');
  p.node.identity.firstChild.firstChild.nodeValue='农';await wait();const farmer=p.node.identity.style.getPropertyValue('--decade-icon');
  p.classList.add('selectable','linked2');await wait();
  const glow=getComputedStyle(p,'::before').backgroundImage,chain=getComputedStyle(p.querySelector('.chain')).backgroundImage;
  p.classList.add('dead');await wait();p.classList.add('minskin');await wait();const minskin=p.querySelectorAll('.decade-frame,.decade-death,.decade-identity').length;
  p.remove();
  const card=game.me.getCards('h')[0].cloneNode(true);card.classList.add('infohidden');ui.arena.append(card);await wait();
  const hidden={art:getComputedStyle(card).backgroundImage,corner:getComputedStyle(card.querySelector('.info'),'::after').content};card.remove();
  return {land,farmer,glow,chain,minskin,hidden};
 });
 assert.match(report.fixtures.land,/identity2_dizhu/);assert.match(report.fixtures.farmer,/identity2_nongmin/);
 assert.match(report.fixtures.glow,/sprites_glow_blue/);assert.match(report.fixtures.chain,/tie_suo\.png/);assert.equal(report.fixtures.minskin,0);
 assert.match(report.fixtures.hidden.art,/kb3/);assert.ok(['none','normal'].includes(report.fixtures.hidden.corner));
 report.checks.push('DOM fixtures: identity text mutation, source glow/chain, minskin cleanup, masked card');
 const baseline=await page.evaluate(()=>{
  const{lib,game,ui,_status}=window.auditHost;
  window.auditSnapshot=()=>JSON.stringify({event:_status.event.name,players:game.players.map(p=>({id:p.playerid,hp:p.hp,skills:p.skills,storage:p.storage,cards:p.getCards('hej').map(c=>c.cardid)})),pile:[...ui.cardPile.children].map(c=>c.cardid),skills:Object.keys(lib.skill)});
  window.auditRefs=[game.check,game.uncheck,game.over,ui.click.card,ui.click.player,ui.click.button,ui.click.control];window.auditRandom=Math.random;window.auditCalls=0;Math.random=()=>{window.auditCalls++;return window.auditRandom();};return window.auditSnapshot();
 });
 await page.evaluate(async()=>{const p=await import('/extension/十周年局内UI/extension.js');window.auditManifest=(await import('/noname/ui/workshop/ingame.js')).decadeManifest;(await p.activate(window.auditManifest))();});
 assert.equal(await page.locator('.decade-frame,.decade-identity,.decade-card,.decade-pile,.decade-time,.decade-animation,.decade-portrait,.decade-menu-toggle,.decade-passive-skills,.decade-skill-marks,.decade-skill-badge,.decade-skin-button,.decade-identity-tip,.decade-kill,[data-decade-skill],[data-decade-point],[data-decade-menu]').count(),0);
 await page.evaluate(async()=>{await(await import('/extension/十周年局内UI/extension.js')).activate(window.auditManifest);});await page.waitForSelector('.decade-frame');await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>window.auditSnapshot()),baseline);
 assert.equal(await page.evaluate(()=>{const{game,ui}=window.auditHost;return [game.check,game.uncheck,game.over,ui.click.card,ui.click.player,ui.click.button,ui.click.control].every((x,i)=>x===window.auditRefs[i]);}),true);
 assert.equal(await page.evaluate(()=>{Math.random=window.auditRandom;return window.auditCalls;}),0);
 report.checks.push('unmount/remount: no rule/registry/callback/deck changes, no gameplay RNG calls, no leftover decoration');
 await checkpoint('remount');
 await page.setViewportSize({width:844,height:480});await page.waitForTimeout(600);await shot('mobile');
 report.mobile=await page.evaluate(()=>window.auditHost.game.players.map(p=>p.getBoundingClientRect().toJSON()));
 for(const p of report.mobile)assert.ok(p.x>=0&&p.right<=845&&p.bottom<=481,JSON.stringify(p));
 report.sizes=[];
 for(const viewport of [{width:390,height:844},{width:1024,height:768},{width:1920,height:1080}]){
  await page.setViewportSize(viewport);await page.waitForTimeout(650);await page.waitForFunction(()=>!window.auditHost.ui._updatexr);await page.waitForTimeout(600);
  const rectangles=await page.evaluate(()=>window.auditHost.game.players.map(p=>p.getBoundingClientRect().toJSON()));
  for(const r of rectangles)assert.ok(r.x>=0&&r.y>=0&&r.right<=viewport.width+1&&r.bottom<=viewport.height+1,JSON.stringify({viewport,r}));
  await page.evaluate(async()=>{const{emitPresentation,playerPresentation}=await import('/noname/ui/presentationEvents.js');emitPresentation('conversion',()=>({player:playerPresentation(window.auditHost.game.me)}));});
  await page.waitForFunction(()=>{const c=document.querySelector('.decade-animation');if(!c)return false;const r=c.getBoundingClientRect();return Math.abs(r.width-innerWidth)<1&&Math.abs(r.height-innerHeight)<1&&c.width===innerWidth&&c.height===innerHeight;},null,{timeout:10000});
  report.sizes.push({viewport,rectangles});await shot('size-'+viewport.width+'x'+viewport.height);
 }
 await page.setViewportSize({width:1440,height:810});await page.waitForTimeout(300);
 await page.evaluate(()=>window.auditHost.game.resume2());await page.locator('#control [data-action="cancel"]').click();
 await page.evaluate(()=>{const{ui,_status}=window.auditHost;if(!_status.auto)ui.click.auto();});
 await page.waitForFunction(()=>window.auditHost.game.roundNumber>=2,null,{timeout:90000});report.checks.push('narrow viewport and real core continuation through round two');
 await checkpoint('round2');
 await page.evaluate(()=>{window.auditHost.game.pause2();});await page.waitForTimeout(300);
 report.skillState=await page.evaluate(()=>{const{game,lib,skillPresentation}=window.auditHost;return {name:game.me.name,skills:game.me.skills,hidden:game.me.hiddenSkills,snapshot:skillPresentation(game.me,lib,true),labels:[...document.querySelectorAll('.decade-passive-skills>span')].map(n=>n.textContent)};});
 assert.ok(report.skillState.snapshot.length);assert.deepEqual(report.skillState.labels,report.skillState.snapshot.filter(s=>!s.active).map(s=>s.label));await shot('skills');
 await checkpoint('skills');
 // Presentation-only fixture on an independent clone. No synthetic skills or
 // counters are installed in the live game's registry/state.
 report.skillMarks=await page.evaluate(async()=>{
  const{game,lib,ui,skillPresentation}=window.auditHost;
  const ids=['limited','juexingji','dutySkill','zhuanhuanji'].map(flag=>Object.keys(lib.skill).find(id=>Object.getOwnPropertyDescriptor(lib.skill[id]||{},flag)?.value===true&&typeof Object.getOwnPropertyDescriptor(lib.translate,id)?.value==='string')).filter(Boolean);
  const p=game.me.cloneNode(true);p.className='player';p.dataset.position='6';p.skills=ids;p.storage={};p.awakenedSkills=[];p.node={identity:p.querySelector('.identity'),avatar:p.querySelector('.avatar'),name:p.querySelector('.name')};
  p.querySelectorAll('.decade-frame,.decade-skill-marks,.decade-portrait').forEach(n=>n.remove());ui.arena.append(p);
  const wait=()=>new Promise(r=>setTimeout(r,160));await wait();
  const kinds=[...p.querySelectorAll('.decade-skill-badge')].map(n=>n.dataset.kind);
  p.awakenedSkills=ids.slice();for(const id of ids)p.storage[id]=true;p.classList.add('selectable');await wait();
  const used=p.querySelectorAll('.decade-skill-badge.used').length,yin=p.querySelector('[data-state="yin"]')!=null;
  p.classList.add('unseen');await wait();const hidden=p.querySelectorAll('.decade-skill-badge').length;p.remove();return {ids,kinds,used,yin,hidden};
 });
 assert.ok(report.skillMarks.kinds.includes('limited'));assert.ok(report.skillMarks.kinds.includes('awakening'));assert.ok(report.skillMarks.yin);assert.ok(report.skillMarks.used>=2);assert.equal(report.skillMarks.hidden,0);
 await checkpoint('marks');
 report.checks.push('live passive skill labels and isolated limited/awakening/mission/conversion state decorations, hidden-general removal');
 await page.evaluate(async()=>{const {emitPresentation,playerPresentation}=await import('/noname/ui/presentationEvents.js');const players=window.auditHost.game.players.filter(p=>p.node.avatar.style.backgroundImage);emitPresentation('death',()=>({player:playerPresentation(players[0]),source:playerPresentation(players[1]),kills:2}));});
 await page.waitForSelector('.decade-kill');await page.waitForTimeout(500);await shot('kill');assert.equal(await page.locator('.decade-kill .part1,.decade-kill .part2,.decade-kill .killer').count(),3);
 await page.waitForSelector('.decade-kill',{state:'detached',timeout:6000});
 await page.waitForTimeout(600);await shot('kill-achievement');await page.waitForTimeout(2000);
 await page.evaluate(async()=>{const{emitPresentation,playerPresentation}=await import('/noname/ui/presentationEvents.js');emitPresentation('recoveryAchievement',()=>({player:playerPresentation(window.auditHost.game.me),achievements:['recovery','rescue']}));});await page.waitForTimeout(500);await shot('recovery');
 report.checks.push('kill portraits and healing achievements render without controlling a core event; kill overlay expires');
 await page.waitForTimeout(4600);
 await page.evaluate(async()=>{const{emitPresentation,playerPresentation}=await import('/noname/ui/presentationEvents.js');const player=playerPresentation(window.auditHost.game.me);emitPresentation('card',()=>({player,card:'gz_guguoanbang',nature:''}));});await page.waitForTimeout(500);await shot('national-card');
 await page.waitForTimeout(2200);await page.evaluate(async()=>{const{emitPresentation,playerPresentation}=await import('/noname/ui/presentationEvents.js');emitPresentation('number',()=>({player:playerPresentation(window.auditHost.game.me),value:-3,health:{kind:'damage',value:3,sourced:true}}));});await page.waitForTimeout(600);await shot('damage-achievement');
 report.checks.push('national-card and source-attributed damage milestone rendered from public notification fixtures');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);report.passed=true;
}catch(error){report.failure=error.stack;await shot('failure').catch(()=>{});process.exitCode=1;}
finally{await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({passed:report.passed,checks:report.checks,failure:report.failure,errors:report.errors,missing:report.missing},null,2));
