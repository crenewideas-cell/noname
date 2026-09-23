// Isolated browser save. Exercise real core choices and compare rule state
// across display-provider unmount/remount; never run archived UI rule scripts.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.resolve(process.env.NONAME_TEST_OUTPUT||'output/shousha-restoration');
const fromLobby=process.argv.includes('--lobby');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage();
const report={errors:[],skinRequests:[],checks:[]};
page.on('pageerror',e=>report.errors.push(e.message));
page.on('dialog',d=>d.accept());
page.on('response',r=>{if(r.status()>=400&&decodeURIComponent(r.url()).includes('/手杀标准UI/'))report.skinRequests.push(r.url());});
await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_disable_extension','true'));
if(fromLobby)await context.addInitScript(()=>{
 if(!sessionStorage.getItem('ss_test_lobby_visited')){
  sessionStorage.setItem('ss_test_lobby_visited','true');
  sessionStorage.setItem('noname_0.9_return_to_lobby','true');
  localStorage.removeItem('noname_0.9_directstart');
 }
});
await page.route('**/game/config.json',async r=>{
 const response=await r.fetch(),config=await response.json();
 Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:fromLobby?'on':'off',mode:'identity',characters:['standard'],cards:['standard','extra'],ui_workshop_active:'builtin-shousha-standard'});
 config.mode_config.identity={...config.mode_config.identity,player_number:'5',double_character:false,change_card:'once',identity:'zhong'};
 for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
 await r.fulfill({response,json:config});
});
const screenshot=name=>page.screenshot({path:path.join(output,name+'.png')});
async function visualState(){return page.evaluate(async()=>{
 const {lib,game,ui,_status}=await import('/noname.js');
 return {event:_status.event?.name,skin:lib.config.ui_workshop_active,error:lib.uiWorkshop.error,parts:document.body.dataset.shoushaParts,
  players:game.players.map(p=>({seat:p.dataset.position,rect:p.getBoundingClientRect().toJSON(),width:p.offsetWidth,height:p.offsetHeight})),
  frames:document.querySelectorAll('.ss-player-frame').length,dragons:document.querySelectorAll('.ss-rarity-ornament').length,
  cards:game.me?.getCards('h').map(c=>({art:c.style.getPropertyValue('--ss-card-art'),rect:c.getBoundingClientRect().toJSON()})),
  actions:[...ui.control.querySelectorAll('[data-action]')].map(n=>({action:n.dataset.action,art:getComputedStyle(n).backgroundImage,rect:n.getBoundingClientRect().toJSON()}))};
});}
try{
 await page.goto(process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8181/',{waitUntil:'domcontentloaded'});
 if(fromLobby){
  await page.waitForFunction(()=>document.querySelector('iframe[src*="/html/rzsh.html"]'),null,{timeout:90000});
  await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();
  await page.waitForSelector('#splash canvas');await page.waitForTimeout(4000);await screenshot('lobby');
  await page.mouse.click(350,390);await page.waitForTimeout(800);await screenshot('mode');await page.mouse.click(1070,404);
  report.checks.push('source login and lobby entered the core identity mode');
  // Keep pre-existing lobby-only missing assets visible in the report. The
  // restored match resources below are checked independently.
  report.lobbyAssetFailures=report.skinRequests.splice(0);
 }
 await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
 await page.waitForFunction(()=>document.querySelectorAll('.ss-player-frame').length>=5);
 if(await page.locator('#extension-recovery summary').isVisible())await page.locator('#extension-recovery summary').click();
 await page.waitForTimeout(1000);
 report.selection=await visualState();
 assert.equal(report.selection.error,undefined);
 for(const p of report.selection.players){assert.equal(p.width,120);assert.equal(p.height,180);assert.ok(p.rect.x>=0&&p.rect.right<=1440&&p.rect.bottom<=811,JSON.stringify(p));}
 await screenshot('selection-restored');report.checks.push('selection: native candidates, source art, all seats on screen');
 await page.locator('#arena .button.character.selectable').first().click();
 await page.waitForFunction(async()=>{const {game}=await import('/noname.js');return game.me?.getCards('h').length>0;},null,{timeout:30000});
 await page.waitForSelector('#control [data-action="cancel"]',{state:'visible',timeout:60000});
 await page.waitForTimeout(3000);report.game=await visualState();await screenshot('game-restored');
 const prompt=await page.locator('#arena>.dialog.nobutton').evaluate(n=>({height:n.clientHeight,contentHeight:n.querySelector('.caption').offsetHeight,text:n.textContent}));
 assert.ok(prompt.height>=prompt.contentHeight&&prompt.contentHeight>0,JSON.stringify(prompt));
 assert.ok(report.game.dragons>0);assert.ok(report.game.cards.some(c=>c.art.endsWith('.png")')));
 assert.ok(report.game.cards.every(c=>c.rect.bottom<=811));
 assert.ok(report.game.actions.some(c=>c.action==='cancel'&&c.art.includes('confirm-bg-c.png')));
 assert.equal(await page.locator('#roundmenu:not(.clock)>div').first().evaluate(n=>getComputedStyle(n).display),'none');
 report.checks.push('original PNG card set, identity badges, rarity ornament, hand geometry');
 // Freeze only this test through the core's pause API: an AI turn may still
 // be running after the opening deal. Display time must not be mistaken for
 // a rule difference. No application code pauses gameplay for its skin.
 await page.evaluate(async()=>{(await import('/noname.js')).game.pause2();});
 await page.waitForTimeout(200);
 report.promptAndMenu=await page.evaluate(async()=>{
  const {ui}=await import('/noname.js'),guide=await import('/noname/ui/selectionGuide.js');
  window.ssGuideFixture={isMine:()=>true,filterTarget:()=>true,selectTarget:[1,1]};
  guide.updateSelectionGuide(window.ssGuideFixture,false);
  const guides=document.querySelectorAll('.selection-guide').length;
  return {guides};
 });
 await page.locator('#roundmenu').click();await page.waitForSelector('dialog.ss-game-menu');
 Object.assign(report.promptAndMenu,await page.evaluate(()=>{
  const dialog=document.querySelector('dialog.ss-game-menu');
  return {menu:!!dialog,shortcuts:dialog?[...dialog.querySelectorAll('.ss-menu-shortcuts button')].map(n=>n.textContent):[],actions:dialog?[...dialog.querySelectorAll('.game-navigation-actions button')].map(n=>n.textContent):[]};
 }));
 assert.equal(report.promptAndMenu.guides,0);assert.equal(report.promptAndMenu.menu,true);assert.ok(report.promptAndMenu.shortcuts.includes('设置'));assert.ok(report.promptAndMenu.shortcuts.includes('托管'));
 await screenshot('handheld-menu');await page.locator('dialog.ss-game-menu .game-navigation-actions button').filter({hasText:'继续游戏'}).click();
 await page.waitForSelector('dialog.game-navigation',{state:'detached'});
 await page.locator('#roundmenu').click();await page.locator('dialog.ss-game-menu [data-ss-icon="settings"]').click();
 await page.waitForFunction(async()=>{const{ui}=await import('/noname.js');return ui.menuContainer&&!ui.menuContainer.classList.contains('hidden');});
 await page.evaluate(async()=>{const{ui}=await import('/noname.js');ui.click.configMenu();});
 report.checks.push('one prompt layer; handheld menu skins core actions and exposes original settings/auto controls');
 const baseline=await page.evaluate(async()=>{
  const host=await import('/noname.js');window.ssTestHost=host;
  const {lib,game,ui,_status}=host;
  window.ssRuleSnapshot=()=>JSON.stringify({event:_status.event.name,step:_status.event.step,paused:_status.paused,round:game.roundNumber,phase:_status.currentPhase?.playerid,
   players:game.players.map(p=>({id:p.playerid,name:p.name,name2:p.name2,hp:p.hp,maxHp:p.maxHp,hujia:p.hujia,identity:p.identity,skills:p.skills,storage:p.storage,cards:p.getCards('hej').map(c=>({id:c.cardid,name:c.name,suit:c.suit,number:c.number,nature:c.nature}))})),
   pile:[...ui.cardPile.children].map(c=>c.cardid),discard:[...ui.discardPile.children].map(c=>c.cardid),skills:Object.keys(lib.skill)});
  window.ssOwnedRefs=[game.check,game.uncheck,game.over,lib.element.player,lib.element.content,ui.click.card,ui.click.player,ui.click.button,ui.click.control];
  window.ssRandomCalls=0;window.ssOriginalRandom=Math.random;
  Math.random=(...args)=>{window.ssRandomCalls++;return window.ssOriginalRandom(...args);};
  return window.ssRuleSnapshot();
 });
 const stateOff=await page.evaluate(async()=>{
  const {lib}=window.ssTestHost,provider=await import('/extension/手杀标准UI/extension.js');
  window.ssTestManifest=(await import('/noname/ui/workshop/shoushaPreset.js')).shoushaManifest;
  (await provider.activate(window.ssTestManifest))();
  return window.ssRuleSnapshot();
 });
 assert.equal(stateOff,baseline);
 assert.equal(await page.evaluate(async()=>{const guide=await import('/noname/ui/selectionGuide.js');guide.updateSelectionGuide(window.ssGuideFixture,false);const count=document.querySelectorAll('.selection-guide').length;guide.clearSelectionGuide();return count;}),1);
 assert.equal(await page.locator('.ss-player-frame,.ss-rarity-ornament,.ss-identity-art,.ss-card-art').count(),0);
 await page.evaluate(async()=>{await(await import('/extension/手杀标准UI/extension.js')).activate(window.ssTestManifest);});
 await page.waitForSelector('.ss-rarity-ornament');
 assert.equal(await page.evaluate(()=>window.ssRuleSnapshot()),baseline);
 assert.equal(await page.evaluate(()=>{const{lib,game,ui}=window.ssTestHost;return [game.check,game.uncheck,game.over,lib.element.player,lib.element.content,ui.click.card,ui.click.player,ui.click.button,ui.click.control].every((x,i)=>x===window.ssOwnedRefs[i]);}),true);
 assert.equal(await page.evaluate(()=>{Math.random=window.ssOriginalRandom;return window.ssRandomCalls;}),0,'presentation lifecycle must not consume gameplay RNG');
 report.checks.push('unmount/remount: identical rule state, deck order, rule registries and original callbacks; no leftover decorations');
 // Hidden-card and hidden-general fixtures are DOM copies, never engine players.
 const hidden=await page.evaluate(async()=>{
  const {game,ui}=window.ssTestHost;
  const p=game.me.cloneNode(true);p.id='ss-hidden-fixture';p.classList.add('unseen');p.querySelectorAll('.ss-rarity-ornament,.ss-player-frame').forEach(n=>n.remove());ui.arena.append(p);
  const c=game.me.getCards('h')[0].cloneNode(true);c.id='ss-hidden-card';c.classList.add('infohidden');ui.arena.append(c);
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const result={dragon:p.querySelectorAll('.ss-rarity-ornament').length,frame:p.querySelector('.ss-player-frame')?.dataset.art,front:getComputedStyle(c).backgroundImage,corner:getComputedStyle(c.querySelector('.info'),'::after').content};p.remove();c.remove();return result;
 });
 assert.equal(hidden.dragon,0);assert.match(hidden.frame,/unknown/);assert.doesNotMatch(hidden.front,/image\/card\//);assert.ok(['none','normal'].includes(hidden.corner));
 report.hidden=hidden;report.checks.push('hidden-general and hidden-card decorations do not reveal private information');
 await page.setViewportSize({width:844,height:480});await page.waitForTimeout(1000);report.mobile=await visualState();await screenshot('mobile-restored');
 await page.locator('#roundmenu').click();await page.waitForSelector('dialog.ss-game-menu');await screenshot('mobile-menu');
 const menuBounds=await page.locator('dialog.ss-game-menu button').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
 for(const b of menuBounds)assert.ok(b.x>=0&&b.right<=845&&b.y>=0&&b.bottom<=481,JSON.stringify(b));
 await page.locator('dialog.ss-game-menu .game-navigation-actions button').filter({hasText:'继续游戏'}).click();
 for(const p of report.mobile.players)assert.ok(p.rect.x>=0&&p.rect.right<=845&&p.rect.bottom<=481,JSON.stringify(p));
 assert.ok(report.mobile.cards.every(c=>c.rect.bottom<=481));
 report.checks.push('844×480: portraits and hand within viewport');
 await page.setViewportSize({width:1440,height:810});
 // Real core input continues after remount; auto is the core's own control.
 await page.evaluate(()=>{const{game,_status}=window.ssTestHost;window.ssPendingChoice=_status.event;game.resume2();});
 await page.locator('#control [data-action="cancel"]').click();
 await page.waitForFunction(()=>window.ssTestHost._status.event!==window.ssPendingChoice||window.ssPendingChoice.finished);
 report.checks.push('source cancel button completed the original core choice after presentation remount');
 await page.evaluate(()=>{const{ui,_status}=window.ssTestHost;if(!_status.auto)ui.click.auto();});
 await page.waitForFunction(()=>window.ssTestHost.game.roundNumber>=2,null,{timeout:60000});
 report.checks.push('core AI continued into round two after presentation remount');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.skinRequests,[]);report.passed=true;
}catch(error){report.failure=error.stack;await screenshot('regression-failure').catch(()=>{});throw error;}
finally{await fs.writeFile(path.join(output,'regression.json'),JSON.stringify(report,null,2));await browser.close();}
