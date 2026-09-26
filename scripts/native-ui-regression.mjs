// Restore through the existing workshop action, with isolated browser storage.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const out='output/builtin-ui';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1200,height:800}}),report={checks:[],errors:[]};
// Directory registration can enable bundled extensions after config.json is read.
// Keep this native-layout regression independent of their game-start skills.
await page.addInitScript(()=>localStorage.setItem('noname_0.9_disable_extension','true'));
page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
await page.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
await page.route('**/game/config.json',async r=>{const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',characters:['standard'],cards:['standard','extra'],mode:'identity'});for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;await r.fulfill({response,json:config});});
const ready=()=>page.waitForFunction(async()=>{const{lib}=await import('/noname.js');return !!lib.uiWorkshop&&!!lib.db&&!!lib.configOL;},null,{timeout:120000});
async function config(){return page.evaluate(async()=>{const{lib}=await import('/noname.js');return Object.fromEntries(['ui_workshop_active','ui_workshop_previous','layout','phonelayout','show_sortcard','qhly_skinset','qhly_dynamicEnabled'].map(k=>[k,lib.config[k]]));});}
try{
 await page.goto(origin,{waitUntil:'domcontentloaded'});await ready();await page.waitForSelector('#splash');
 await page.evaluate(async()=>{const{game,lib}=await import('/noname.js');for(const[k,v]of Object.entries({layout:'mobile',phonelayout:true,show_sortcard:false,show_cardpile_number:true,characters:['standard'],cards:['standard','extra'],background_speak:false,background_audio:false,qhly_skinset:{skin:{caocao:'经典.jpg'}},qhly_dynamicEnabled:true}))await game.promises.saveConfig(k,v);await game.promises.saveConfig('player_number','5','identity');await game.promises.saveConfig('change_card','disabled','identity');await lib.uiWorkshop.use('builtin-ink-gold');});
 await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForSelector('#splash');
 const before=await config();assert.equal(before.phonelayout,true);assert.equal(before.layout,'mobile');
 await page.evaluate(async()=>{await(await import('/noname.js')).lib.uiWorkshop.open();});
 await page.getByRole('button',{name:'恢复本体内置 UI',exact:true}).click();
 await page.waitForFunction(async()=>(await import('/noname.js')).lib.config?.ui_workshop_active==='builtin-native');
 await ready();await page.waitForSelector('#splash');
 const restored=await config();assert.equal(restored.layout,'long2');assert.equal(restored.phonelayout,false);assert.equal(restored.show_sortcard,true);assert.equal(restored.ui_workshop_previous,'builtin-ink-gold');assert.deepEqual(restored.qhly_skinset,before.qhly_skinset);assert.equal(restored.qhly_dynamicEnabled,before.qhly_dynamicEnabled);
 report.checks.push('Existing restore action replaces residual mobile/phone layout without changing skin preferences; undo target retained');
 await page.evaluate(async()=>{const{game,lib}=await import('/noname.js');await game.promises.saveConfig('show_splash','off');localStorage.setItem(lib.configprefix+'directstart',true);});
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
 // Wait for boot (including extension registration) before dismissing the
 // safe-mode notice generated solely by this test's isolation flag.
 await page.evaluate(()=>document.getElementById('extension-recovery')?.remove());
 await page.locator('#arena .button.character.selectable').first().click();
 await page.waitForFunction(async()=>{const{game,ui,_status}=await import('/noname.js');if(_status.gameStarted&&game.roundNumber>=1&&game.me?.countCards('h')>0&&ui.cardPileButton?.style.display!=='none'&&ui.commonCardPileButton?.style.display!=='none'){game.pause2();return true;}return false;},null,{timeout:60000});
 await page.waitForTimeout(1200);
 for(const size of [{width:1200,height:800},{width:1920,height:911}]){
  await page.setViewportSize(size);await page.waitForTimeout(1200);
  const state=await page.evaluate(async()=>{
   const{ui,lib,game}=await import('/noname.js');const rect=n=>n.getBoundingClientRect().toJSON();
   const nodes=[ui.config2,document.querySelector('#arena-log-toggle'),ui.pause,ui.auto,ui.volumn,ui.sortCard,ui.cardPileButton,ui.commonCardPileButton,document.querySelector('#game-navigation-button')];
   return {parts:{...document.body.dataset},phone:ui.arena.classList.contains('phone'),phoneSheet:ui.css.phone.getAttribute('href'),layout:ui.css.layout.href,menuDisplay:getComputedStyle(ui.roundmenu).display,buttons:nodes.map(n=>({text:n.textContent,rect:rect(n),display:getComputedStyle(n).display,visibility:getComputedStyle(n).visibility,hit:(()=>{const r=rect(n),e=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return e===n||n.contains(e);})()})),me:rect(ui.me),hand:rect(ui.handcards1Container),cards:game.me.getCards('h').map(n=>({rect:rect(n),parent:n.parentNode===ui.handcards1})),pile:{rect:rect(ui.cardPileNumber),parent:ui.cardPileNumber.parentNode.id},styles:[...document.querySelectorAll('style[data-ui-workshop]')].map(n=>n.dataset.uiWorkshop),layoutName:game.layout};
  });
  report[size.width]=state;
  assert.equal(state.phone,false);assert.ok(!state.phoneSheet);assert.match(state.layout,/long2/);assert.equal(state.menuDisplay,'none');assert.deepEqual(state.styles,['builtin-native']);assert.equal(state.parts.decadeParts,undefined);assert.equal(state.parts.shoushaParts,undefined);
  for(const b of state.buttons){assert.notEqual(b.display,'none',b.text);assert.equal(b.visibility,'visible',b.text);assert.ok(b.hit,b.text+' is clickable');assert.ok(b.rect.y>=0&&b.rect.bottom<80,b.text+' remains in native top bar');}
  assert.equal(state.pile.parent,'time');assert.ok(Math.abs(state.pile.rect.x+state.pile.rect.width/2-size.width/2)<60);
  assert.ok(state.hand.width>size.width*.7&&state.hand.height>100);assert.ok(state.me.bottom<=size.height+1);assert.ok(state.cards.length>0&&state.cards.every(c=>c.parent&&c.rect.y>=size.height-200&&c.rect.bottom<=size.height+1));
  await page.screenshot({path:`${out}/restored-${size.width}.png`});report[size.width]=state;
 }
 report.checks.push('Native toolbar, round/pile position, hidden phone menu, existing hand containers and card positions verified at 1200 and 1920 widths');
 await page.locator('#arena-log-toggle').click();assert.equal(await page.locator('#arena-log-toggle').getAttribute('aria-pressed'),'true');await page.locator('#arena-log-toggle').click();
 await page.locator('#game-navigation-button').click();await page.getByRole('dialog').filter({hasText:'返回主界面'}).waitFor();await page.getByRole('button',{name:'继续游戏',exact:true}).click();
 report.checks.push('Existing log and exit menu callbacks remain functional');
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(error){report.failure=error.stack;report.config=await config().catch(()=>null);report.diagnostics=await page.evaluate(async()=>{const{lib,ui,_status}=await import('/noname.js');return {show_cardpile:lib.config.show_cardpile,show_commonCardpile:lib.config.show_commonCardpile,event:_status.event?.name,started:_status.gameStarted,paused:_status.paused,paused2:_status.paused2,system:ui.system?.outerHTML};}).catch(()=>null);await page.screenshot({path:out+'/restore-failure.png'}).catch(()=>{});throw error;}
finally{await fs.writeFile(out+'/regression.json',JSON.stringify(report,null,2));await browser.close();}
console.log(report.checks.join('\n'));
