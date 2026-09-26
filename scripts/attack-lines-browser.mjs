import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184',out='output/attack-lines';await fs.mkdir(out,{recursive:true});
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:900}}),report={checks:[],errors:[],assets:[],alerts:[]};
page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',async d=>{report.alerts.push(d.message());await d.accept();});
page.on('response',r=>{if(r.url().includes('/image/pointer/migrated/'))report.assets.push({url:r.url(),status:r.status()});});
await page.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
await page.route('**/game/config.json',async r=>{const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',characters:['standard'],cards:['standard','extra'],mode:'identity',ui_workshop_active:'builtin-native'});for(const row of installed)config['extension_'+row.name+'_enable']=false;await r.fulfill({response,json:config});});
const ready=()=>page.waitForFunction(async()=>{const{lib}=await import('/noname.js');return !!lib.uiWorkshop&&!!lib.db&&!!lib.configOL;},null,{timeout:120000});
async function start(){
 await page.waitForSelector('#arena .button.character.selectable',{timeout:120000});
 await page.locator('#arena .button.character.selectable').first().click();
 await page.waitForFunction(async()=>{const{game,_status}=await import('/noname.js');if(_status.gameStarted&&game.roundNumber>=1&&game.me?.countCards('h')>0){game.pause2();return true;}return false;},null,{timeout:60000});
 await page.waitForTimeout(3500);
}
try{
 await page.goto(origin,{waitUntil:'domcontentloaded'});await ready();await page.waitForSelector('#splash');
 await page.evaluate(async()=>{
  const{game,lib}=await import('/noname.js');const{builtinPacks}=await import('/noname/ui/workshop/presets.js');const{savePack}=await import('/noname/ui/workshop/service.js');
  const pack=builtinPacks().find(p=>p.manifest.id==='builtin-shousha-standard');
  // Keep the actual shousha in-game provider, with the core mode selector for isolation.
  delete pack.manifest.components.home;delete pack.manifest.components.modes;pack.manifest.name='指示线测试套装';
  const saved=await savePack(pack,true);await lib.uiWorkshop.use(saved.manifest.id);
  for(const[k,v]of Object.entries({show_splash:'off',characters:['standard'],cards:['standard','extra'],background_speak:false,background_audio:false,animation:true,low_performance:false,ui_workshop_shousha_settings:{ss_dynamic:false,ss_effects:true}}))await game.promises.saveConfig(k,v);
  await game.promises.saveConfig('player_number','5','identity');await game.promises.saveConfig('change_card','disabled','identity');localStorage.setItem(lib.configprefix+'directstart',true);
 });
 await page.reload({waitUntil:'domcontentloaded'});await ready();await start();
 assert.equal(await page.evaluate(async()=>(await import('/noname.js')).lib.config.zhishixian),'Liuli');
 assert.ok((await page.locator('body').getAttribute('data-shousha-parts')).split(' ').includes('lines'));
 const before=await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');return {skills:Object.keys(lib.skill),players:game.players.map(p=>({hp:p.hp,hand:p.getCards('h').map(c=>c.cardid),stats:p.stat}))};});
 for(const style of ['Liuli','ZipYulong','ZipJingdian','ZipBaoji']){
  await page.evaluate(async style=>{const{game,lib}=await import('/noname.js');lib.configMenu.appearence.config.zhishixian.onclick(style);game.me.line(game.players.filter(p=>p!==game.me));},style);
  await page.waitForTimeout(540);
  const state=await page.evaluate(()=>({count:document.querySelectorAll('.migrated-attack-line').length,styles:[...document.querySelectorAll('.migrated-attack-line')].map(n=>n.dataset.lineStyle),overlay:document.querySelectorAll('.shousha-lines line').length,nodes:[...document.querySelectorAll('.migrated-attack-line')].map(n=>({parent:n.parentNode.id,visible:getComputedStyle(n).visibility,opacity:getComputedStyle(n).opacity,art:getComputedStyle(n).backgroundImage,height:getComputedStyle(n).height,rect:n.getBoundingClientRect().toJSON()}))}));
  assert.equal(state.count,4,style);assert.deepEqual([...new Set(state.styles)],[style]);assert.equal(state.overlay,0);assert.ok(state.nodes.every(n=>n.parent==='arena'&&n.visible==='visible'&&Number(n.opacity)>0&&n.rect.width>0));
  if(style==='Liuli')assert.ok(state.nodes.every(n=>n.art.includes('yulongLineXy/line.png')&&n.height==='60px'),'hand line must use the supplied gold artwork, not merely produce a visible DOM line');
  await page.screenshot({path:`${out}/${style}.png`});
  await page.waitForTimeout(1450);assert.equal(await page.locator('.migrated-attack-line').count(),0);report.checks.push(style+': real 5-player shousha lines, no duplicate provider overlay, automatic cleanup');
 }
 await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');lib.configMenu.appearence.config.zhishixian.onclick('default');game.me.line(game.players.find(p=>p!==game.me));});
 await page.waitForTimeout(100);assert.equal(await page.locator('.migrated-attack-line[data-line-style=Liuli]').count(),1);assert.equal(await page.locator('.shousha-lines line').count(),0);
 report.checks.push('old personal packs using default also render the gold hand line without a pink overlay');
 const after=await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');return {skills:Object.keys(lib.skill),players:game.players.map(p=>({hp:p.hp,hand:p.getCards('h').map(c=>c.cardid),stats:p.stat}))};});assert.deepEqual(after,before);
 const contracts=await page.evaluate(async()=>{
  const{game,lib,ui}=await import('/noname.js');lib.configMenu.appearence.config.zhishixian.onclick('ZipYulong');
  const drag=game.linexy([20,20,120,80],'drag'),same=game.linexy([20,20,100,140],'drag',drag)===drag;drag.remove();
  const parent=document.createElement('div');ui.arena.append(parent);const custom=game.linexy([10,10,100,100],parent),correctParent=custom.parentNode===parent;game.clearAttackLines();parent.remove();
  const chess=document.createElement('div');ui.arena.append(chess);const previous={chess:game.chess,node:ui.chess};game.chess=true;ui.chess=chess;
  const c=game.linexy([10,10,200,200]),correctChess=c.parentNode===chess;game.clearAttackLines();game.chess=previous.chess;ui.chess=previous.node;chess.remove();
  lib.config.low_performance=true;const fallback=game.linexy([10,10,150,50]),native=fallback.classList.contains('linexy');fallback.remove();lib.config.low_performance=false;
  for(let i=0;i<100;i++)game.linexy([20,20,100+i,80]);const burst=document.querySelectorAll('.migrated-attack-line').length;game.clearAttackLines();
  return {same,correctParent,correctChess,native,burst,left:document.querySelectorAll('.migrated-attack-line').length};
 });assert.deepEqual(contracts,{same:true,correctParent:true,correctChess:true,native:true,burst:100,left:0});report.checks.push('drag node reuse, custom parent, chess parent, low-performance fallback, 100 simultaneous lines cleanup; no gameplay/skill changes');
 // Exercise the actual workshop select and persistence, not just an internal setter.
 await page.evaluate(async()=>{await(await import('/noname.js')).lib.uiWorkshop.open();});
 await page.getByRole('button',{name:'攻击 / 拖拽指示线',exact:true}).click();
 const select=page.locator('label.field').filter({has:page.locator('span').filter({hasText:/^指示线$/})}).locator('select');
 await select.waitFor();
 assert.equal(await select.locator('option').filter({hasText:'手杀指示线'}).count(),1);
 for(const value of ['Liuli','ZipYulong','ZipJingdian','ZipBaoji'])assert.equal(await select.locator(`option[value="${value}"]`).count(),1);
 await select.selectOption('ZipJingdian');await page.getByRole('button',{name:'保存搭配',exact:true}).click();
 await page.getByRole('status').filter({hasText:'搭配已保存'}).waitFor();
 const savedId=await page.evaluate(async()=>{const{lib}=await import('/noname.js');const{readPack}=await import('/noname/ui/workshop/service.js');const id=lib.config.ui_workshop_catalog.at(-1).id;const pack=await readPack(id);if(pack.manifest.components.lines.settings.zhishixian!=='ZipJingdian')throw Error('workshop selection not persisted');await lib.uiWorkshop.use(id);return id;});
 await page.evaluate(async()=>{const{lib}=await import('/noname.js');localStorage.setItem(lib.configprefix+'directstart',true);});
 await page.reload({waitUntil:'domcontentloaded'});await ready();await start();
 const restored=await page.evaluate(async()=>{const{game,lib}=await import('/noname.js');game.me.line(game.players.find(p=>p!==game.me));return {id:lib.config.ui_workshop_active,style:lib.config.zhishixian};});
 assert.deepEqual(restored,{id:savedId,style:'ZipJingdian'});await page.waitForTimeout(100);assert.equal(await page.locator('.migrated-attack-line[data-line-style="ZipJingdian"]').count(),1);
 report.checks.push('actual workshop dropdown saves the choice; reload re-applies and renders it');
 await page.waitForTimeout(1500);
 assert.ok(report.assets.some(a=>a.url.includes('yulongLineXy'))&&report.assets.some(a=>a.url.includes('jingdianLineXy'))&&report.assets.some(a=>a.url.includes('baojilinexy')));assert.ok(report.assets.every(a=>a.status===200));
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.alerts.filter(t=>/错误文件|错误信息/.test(t)),[]);report.passed=true;
}catch(error){report.failure=error.stack;await page.screenshot({path:out+'/failure.png'}).catch(()=>{});throw error;}
finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await browser.close();}
console.log(report.checks.join('\n'));
