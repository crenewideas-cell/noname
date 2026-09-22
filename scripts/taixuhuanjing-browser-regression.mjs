import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.resolve(process.env.NONAME_TEST_OUTPUT || 'output/taixuhuanjing-validation');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const report={errors:[],failed:[],console:[]};
const context=await browser.newContext({viewport:{width:1440,height:810}});
const page=await context.newPage();
await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_disable_extension','true'));
page.on('pageerror',e=>report.errors.push(e.stack));
page.on('console',m=>{if(m.type()==='error')report.console.push(m.text());});
page.on('dialog',async d=>{if(!d.message().includes('GPLv3'))report.errors.push(d.message());await d.accept();});
page.on('response',r=>{if(r.status()>=400)report.failed.push({url:decodeURIComponent(r.url()),status:r.status()});});
await context.route('**/*',route=>{
 const url=new URL(route.request().url());
 if(decodeURIComponent(url.pathname).includes('/temp/'))throw new Error('Reference-tree runtime dependency');
 if(!['127.0.0.1','localhost'].includes(url.hostname)||url.pathname.startsWith('/api/')||url.pathname.startsWith('/ws/'))return route.abort();
 return route.continue();
});
await page.route('**/game/config.json',async route=>{
 const response=await route.fetch(),config=await response.json();
 Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'off',mode:'taixuhuanjing',ui_workshop_active:process.env.NONAME_TEST_SKIN || ''});
 for(const key of Object.keys(config))if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;
 await route.fulfill({response,json:config});
});
try {
 await page.goto(process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8183',{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForSelector('.taixuhuanjing_Home',{timeout:90000});
 await page.evaluate(async()=>{window.modeTestHost=await import('/noname.js');});
 await page.locator('#extension-recovery summary').click();
 await page.waitForTimeout(1200);
 report.home=await page.evaluate(async()=>{
  const {game,lib}=await import('/noname.js');
  return {seasons:Object.keys(game.seasonPack),npcs:Object.keys(game.NPCPack.character).length,buffs:Object.keys(game.buffPack).length,save:lib.config.taixuhuanjing,buttons:[...document.querySelectorAll('.taixuhuanjing_Home [class]')].map(n=>[n.className,n.textContent.slice(0,100)]).filter(x=>x[1])};
 });
 await page.screenshot({path:path.join(output,'home.png')});
 report.seasonCycle=[];
 for(let index=0;index<8;index++) {
  await page.locator('.taixuhuanjing_HomeBodySeasonName').click({position:{x:10,y:10}});
  await page.waitForTimeout(150);
  report.seasonCycle.push(await page.evaluate(async()=>(await import('/noname.js')).lib.config.taixuhuanjing.season));
 }
 await page.locator('.taixuhuanjing_HomeBodyNewJourney').click();
 await page.waitForSelector('.taixuhuanjing_chooseCharacterDiv',{timeout:10000});
 await page.locator('.taixuhuanjing_chooseCharacterDiv').first().click();
 await page.locator('.taixuhuanjing_chooseCharacterOkButton').click();
 await page.waitForSelector('.taixuhuanjing_chooseSLBtn',{timeout:10000});
 await page.screenshot({path:path.join(output,'servant.png')});
 await page.locator('.taixuhuanjing_chooseSLBtn').click();
 await page.waitForSelector('.taixuhuanjing_Home2',{timeout:15000});
 await page.mouse.move(10,100);
 await page.waitForTimeout(1200);
 await page.screenshot({path:path.join(output,'journey.png')});
 report.journey=await page.evaluate(async()=>{
  const {lib}=await import('/noname.js');
  return {save:lib.config.taixuhuanjing,buttons:[...document.querySelectorAll('.taixuhuanjing_Home2 [class]')].filter(n=>n.className.includes('Button')||n.className.includes('Event')).map(n=>[n.className,n.textContent.slice(0,60)])};
 });
 await page.locator('.taixuhuanjing_consoledeskEventDiv').filter({hasText:'黄巾新军'}).locator('.taixuhuanjing_consoledeskEventDivButton').click();
 await page.locator('.taixuhuanjing_lookEventHomeButton').filter({hasText:'挑战'}).click();
 await page.waitForFunction(()=>{const{game}=window.modeTestHost;return game.players?.length>=2&&game.players.every(p=>p.name)&&game.me?.countCards('h')>0;},null,{timeout:20000});
 await page.waitForTimeout(5500);
 report.battle=await page.evaluate(async()=>{const{game,lib,_status}=await import('/noname.js');return {skin:lib.config.ui_workshop_active,players:game.players.map(p=>({name:p.name,hp:p.hp,side:p.side,skills:p.skills,treasureSlots:p.countEnabledSlot(5),avatar:{image:getComputedStyle(p.node.avatar).backgroundImage,clip:getComputedStyle(p.node.avatar).clipPath,display:getComputedStyle(p.node.avatar).display,opacity:getComputedStyle(p.node.avatar).opacity,rect:p.node.avatar.getBoundingClientRect().toJSON()}})),clips:!!document.querySelector('#ss-solo-clip'),event:_status.event?.name,paused:_status.paused,servantAnimated:!!window.txhj.servant?.sprite};});
 assert.equal(report.battle.skin,process.env.NONAME_TEST_SKIN || '');
 if(report.battle.players.some(p=>p.treasureSlots!==2))throw new Error('Native treasure slots did not initialize');
 await page.evaluate(()=>{window.firstBattleEvent=window.txhj.battleEvent;});
 await page.screenshot({path:path.join(output,'battle.png')});
 await page.evaluate(async()=>{const{game,ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});
 await page.waitForFunction(()=>window.modeTestHost._status.enterGame===true,null,{timeout:15000});
 await page.evaluate(async()=>{const{game}=await import('/noname.js');game.players.find(p=>p.side!==game.me.side).die(game.me);});
 await page.waitForSelector('.taixuhuanjing_StateHome',{timeout:20000});
 await page.waitForTimeout(1200);
 report.settlement=await page.evaluate(async()=>{const{game,lib}=await import('/noname.js');return {players:game.players.length,save:lib.config.taixuhuanjing,buttons:[...document.querySelectorAll('.taixuhuanjing_StateHome [class]')].filter(n=>n.className.includes('Button')).map(n=>[n.className,n.textContent])};});
 await page.screenshot({path:path.join(output,'settlement.png')});
 if(await page.locator('.taixuhuanjing_StateHomeBoxButton').isVisible()) {
  await page.locator('.taixuhuanjing_StateHomeBoxDiv').first().click();
  await page.locator('.taixuhuanjing_StateHomeBoxButton').click();
 }
 await page.locator('.taixuhuanjing_StateHomeOkButton').click();
 await page.waitForSelector('.taixuhuanjing_Home2',{timeout:12000});
 report.afterSettlement=await page.evaluate(async()=>(await import('/noname.js')).lib.config.taixuhuanjing);
 if(report.afterSettlement.score.fight!==1)throw new Error('Settlement did not persist one battle');
 console.log('PASS eight season homes, selection, native battle and settlement');
 if(process.argv.includes('--ui-cycle')) {
  await page.evaluate(async()=>{
   const {game,lib}=await import('/noname.js');
   await game.promises.saveConfig('taixuhuanjing',lib.config.taixuhuanjing);
   await lib.uiWorkshop.use('builtin-shousha-standard');
   sessionStorage.setItem(lib.configprefix+'return_to_lobby','true');
   localStorage.removeItem(lib.configprefix+'directstart');
  });
  await page.reload();
  await page.waitForFunction(()=>[...document.querySelectorAll('iframe')].some(f=>f.src.includes('/html/rzsh.html')),null,{timeout:40000});
  await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click({timeout:30000});
  await page.waitForSelector('#splash canvas',{timeout:40000});
  await page.waitForTimeout(4500);
  await page.locator('#extension-recovery summary').click();
  await page.screenshot({path:path.join(output,'shousha-lobby.png')});
  await page.mouse.click(1350,290);
  await page.waitForSelector('.taixuhuanjing_Home',{timeout:20000});
  await page.evaluate(async()=>{window.modeTestHost=await import('/noname.js');});
  await page.locator('.taixuhuanjing_HomeBodyOldJourney').click();
  await page.waitForSelector('.taixuhuanjing_Home2',{timeout:12000});
  report.resumed=await page.evaluate(async()=>{const{lib}=await import('/noname.js');return {skin:lib.config.ui_workshop_active,save:lib.config.taixuhuanjing};});
  assert.equal(report.resumed.skin,'builtin-shousha-standard');
  assert.deepEqual(report.resumed.save,report.afterSettlement);
  await page.waitForSelector('.taixuhuanjing_transitionDialog',{state:'detached',timeout:10000});
  await page.screenshot({path:path.join(output,'shousha-resumed.png')});
  console.log('PASS shousha lobby entry and unchanged save after switching skin');
 }
  await page.waitForSelector('.taixuhuanjing_transitionDialog',{state:'detached',timeout:10000});
  await page.locator('.taixuhuanjing_consoledeskEventDivButton').first().click();
  await page.locator('.taixuhuanjing_lookEventHomeButton').filter({hasText:'挑战'}).click();
  await page.waitForFunction(()=>{const{game}=window.modeTestHost;return game.players?.length===3&&game.players.every(p=>p.name)&&game.me?.countCards('h')>0;},null,{timeout:20000});
  await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});
  await page.waitForFunction(()=>window.modeTestHost._status.enterGame===true,null,{timeout:15000});
  report.nextBattle=await page.evaluate(async()=>{const{game}=await import('/noname.js');return game.players.map(p=>({name:p.name,treasureSlots:p.countEnabledSlot(5)}));});
  assert.equal(report.nextBattle.length,3);
  assert.ok(report.nextBattle.every(p=>p.treasureSlots===2));
  if(!process.argv.includes('--ui-cycle'))assert.ok(await page.evaluate(()=>window.firstBattleEvent===window.txhj.battleEvent),'Encounters must reuse the active mode event');
  await page.evaluate(async()=>{const{game}=await import('/noname.js');game.me.die(game.players.find(p=>p.side!==game.me.side));});
  await page.waitForSelector('.taixuhuanjing_StateHome',{timeout:20000});
  report.defeat=await page.evaluate(async()=>{const{_status,lib}=await import('/noname.js');return {result:_status.TaiXuHuanJingGame.return,fights:lib.config.taixuhuanjing.score.fight,records:Object.keys(lib.config.taixuhuanjingRecord||{}).length};});
  assert.equal(report.defeat.result,false);
  assert.equal(report.defeat.fights,2);
  assert.equal(report.defeat.records,1);
  await page.screenshot({path:path.join(output,'defeat.png')});
  await page.locator('.taixuhuanjing_StateHomeOkButton').click();
  await page.waitForSelector('.taixuhuanjing_StateHomeGameScore',{timeout:12000});
  console.log('PASS resumed three-player battle and defeat settlement');
 const missingModeAssets=report.failed.filter(r=>r.url.includes('/mode/taixuhuanjing/'));
 assert.deepEqual(missingModeAssets,[],'Missing mode assets');
 if(report.errors.length)throw new Error('Runtime errors: '+report.errors[0]);
} catch(error) {report.failure=error.stack;await page.screenshot({path:path.join(output,'failure.png')});process.exitCode=1;}
finally {await fs.writeFile(path.join(output,'browser.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({failure:report.failure,errors:report.errors,modeAssetFailures:report.failed.filter(r=>r.url.includes('/mode/taixuhuanjing/')),report:path.join(output,'browser.json')},null,2));await browser.close();}
