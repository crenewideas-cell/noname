import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:5174';
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
const out='output/ui-unification/lobbies';await fs.mkdir(out,{recursive:true});
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const reports=[];
async function clickSprite(page,name){
 const handle=await page.waitForFunction(name=>{
  let result;function visit(node,app){if(!node.worldVisible)return;if(node.name===name&&node.interactive){const r=node.getBounds(),b=app.view.getBoundingClientRect();const x=b.left+(r.x+r.width/2)*b.width/app.screen.width,y=b.top+(r.y+r.height/2)*b.height/app.screen.height;if(x>0&&y>0&&x<innerWidth&&y<innerHeight)result={x,y};}node.children?.forEach(child=>visit(child,app));}
  for(const app of window.__uiApps)if(app.stage&&app.renderer&&app.view.isConnected)visit(app.stage,app);return result;
 },name,{timeout:40000});const {x,y}=await handle.jsonValue();await page.mouse.click(x,y);await page.waitForTimeout(600);
}
try{for(const suite of process.argv.slice(2).length?process.argv.slice(2):['rzsh','shousha']){
 const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage(),report={suite,checks:[],errors:[],badAssets:[]};reports.push(report);
 page.on('pageerror',error=>{report.errors.push(error.stack);console.log(error.stack);});page.on('dialog',dialog=>dialog.accept());
 page.on('response',response=>{if(response.status()>=400&&decodeURI(response.url()).includes('cangZhenGe'))report.badAssets.push(decodeURI(response.url()));});
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?route.abort():route.continue();});
 await context.addInitScript(()=>{sessionStorage.setItem('noname_0.9_return_to_lobby','true');window.__uiApps=[];let pixi;Object.defineProperty(window,'PIXI',{configurable:true,get:()=>pixi,set(value){const App=value.Application;if(App&&!App.__recorded){const Recorded=class extends App{constructor(...args){super(...args);window.__uiApps.push(this);}};Recorded.__recorded=true;value.Application=Recorded;}pixi=value;}});});
 await page.route('**/game/config.json',async route=>{const response=await route.fetch(),config=await response.json();Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',ui_workshop_active:suite==='shousha'?'builtin-shousha-standard':'builtin-rzsh',favouriteCharacter:['xiaoqiao','caocao','caoying'],character_usage:{xiaoqiao:{count:3,last:3},caocao:{count:2,last:2},caoying:{count:1,last:1}},rzLock_jsc:false,rzLock_jzj:true,change_skin:true,qhly_lastCharacter:'caocao'});for(const key of Object.keys(config))if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;for(const row of installed)config['extension_'+row.name+'_enable']=row.name==='千幻聆音';await route.fulfill({response,json:config});});
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  if(suite==='shousha'){await page.waitForSelector('iframe[src*="/html/rzsh.html"]',{timeout:90000});await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();}
  await page.waitForSelector('#splash canvas',{timeout:90000});await page.waitForTimeout(10000);
  await clickSprite(page,suite==='shousha'?'under5':'pifubutton');await page.waitForSelector('.qh-window');
  assert.ok((await page.locator('.qh-window').innerText()).includes('曹操'));assert.equal(await page.locator('#pfqhCzg,.qhly-core-choose').count(),0);
  await page.screenshot({path:`${out}/${suite}-skin.png`});report.checks.push('skin entry directly opens native Qianhuan skin view');
  await page.locator('.qh-back').click();await page.locator('.qh-background').waitFor({state:'detached'});
  await clickSprite(page,'xiaoqiao');await page.waitForSelector('.qh-window');
  assert.ok((await page.locator('.qh-window').innerText()).includes('小乔'));
  await page.locator('.qh-back').click();await page.locator('.qh-background').waitFor({state:'detached'});
  await clickSprite(page,'caocao');await page.waitForSelector('.qh-window');
  assert.ok((await page.locator('.qh-window').innerText()).includes('曹操'));
  await page.locator('.qh-back').click();await page.locator('.qh-background').waitFor({state:'detached'});
  await clickSprite(page,'btn_lvl1_1b');
  const grid=await page.evaluate(()=>{
   let result;
   function visit(node){if(!node.worldVisible)return;const cards=(node.children||[]).filter(child=>child.pack&&child.name);if(cards.length>4){result={count:cards.length,names:cards.map(card=>card.name)};window.__sharedGrid=node;}node.children?.forEach(visit);}
   for(const app of window.__uiApps)if(app.stage&&app.view?.isConnected)visit(app.stage);return result;
  });
  assert.ok(grid&&grid.count>4&&grid.count<40,JSON.stringify(grid));
  await page.screenshot({path:out+'/'+suite+'-shared-grid.png'});
  const nextNames=await page.evaluate(async()=>{let scroll=window.__sharedGrid.parent;while(scroll&&!('scrollTop' in scroll))scroll=scroll.parent;if(!scroll)throw Error('Missing scrollbox');scroll.scrollTop=1200;await new Promise(r=>setTimeout(r,400));return window.__sharedGrid.children.filter(card=>card.pack).map(card=>card.name);});
  assert.notDeepEqual(nextNames,grid.names);assert.ok(nextNames.length>0&&nextNames.length<40);
  report.checks.push('profiles reuse the directory; all-character grid mounts only visible rows and scrolls');
  async function reloadLobby(){await page.reload({waitUntil:'domcontentloaded'});if(suite==='shousha'){await page.waitForSelector('iframe[src*="/html/rzsh.html"]',{timeout:90000});await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();}await page.waitForSelector('#splash canvas',{timeout:90000});await page.waitForTimeout(10000);}
  await reloadLobby();await clickSprite(page,suite==='shousha'?'under6':'wujiangbutton');assert.equal(await page.locator('.qh-window').count(),0);
  await page.screenshot({path:out+'/'+suite+'-characters.png'});await clickSprite(page,'xiaoqiao');await page.waitForSelector('.qh-window');
  assert.ok((await page.locator('.qh-window').innerText()).includes('小乔'));report.checks.push('character entry opens existing directory, character opens its own native profile');
  await reloadLobby();await clickSprite(page,suite==='shousha'?'under5':'pifubutton');await page.waitForSelector('.qh-window');
  assert.ok((await page.locator('.qh-window').innerText()).includes('小乔'));report.checks.push('skin entry remembers last viewed general after reload');
  await reloadLobby();
  const before=await page.evaluate(async()=>{const{lib,ui}=await import('/noname.js');window.__coreWindow=ui.window;window.__coreArena=ui.arena;return JSON.stringify(lib.config.qhly_skinset);});
  async function treasure(){if(suite==='shousha')await clickSprite(page,'czg');else{await clickSprite(page,'cangzhengebutton');await clickSprite(page,'lobby_czg');}await page.waitForSelector('#pfqhCzg[data-ready=true]',{timeout:60000});}
  await treasure();assert.equal(await page.locator('.qh-window').count(),0);await page.screenshot({path:`${out}/${suite}-treasure.png`});
  const boxes=page.locator('#pfqhCzg .box-item');assert.ok(await boxes.count()>1);await boxes.nth(1).click();assert.ok((await boxes.nth(1).getAttribute('class')).includes('box-item-select'));
  await page.locator('#pfqhCzg .cbgYuranBtn').click();await page.waitForTimeout(600);await page.screenshot({path:`${out}/${suite}-prizes.png`});await page.locator('.czg-reward-mask').click({position:{x:5,y:5}});
  await page.locator('#pfqhCzg .open-one').click();await page.waitForFunction(()=>document.querySelector('#pfqhCzg .stat-text').innerText.includes('累计抽取1次'),null,{timeout:15000});await page.waitForTimeout(2300);await page.screenshot({path:`${out}/${suite}-reward.png`});await page.locator('.czg-reward-mask').click({position:{x:5,y:5}});
  await page.locator('#pfqhCzg .open-all').click();await page.waitForFunction(()=>document.querySelector('#pfqhCzg .stat-text').innerText.includes('累计抽取51次'),null,{timeout:15000});await page.waitForTimeout(2300);await page.locator('.czg-reward-mask').click({position:{x:5,y:5}});
  await page.locator('#pfqhCzg .stat-btn').click();assert.ok((await page.locator('#pfqhCzg .stat-text').innerText()).includes('累计抽取51次'));await page.locator('#pfqhCzg .stat-close-btn').click();
  report.checks.push('original treasure pools, preview, single draw, 50 draws, reward animation and statistics work');
  await page.locator('#pfqhCzg .ret-back1').click();await page.locator('#pfqhCzg').waitFor({state:'detached'});
  const after=await page.evaluate(async()=>{const{lib,ui}=await import('/noname.js');return {skins:JSON.stringify(lib.config.qhly_skinset),window:window.__coreWindow===ui.window,arena:window.__coreArena===ui.arena,canvases:window.__uiApps.filter(app=>app.renderer&&app.view?.isConnected).length};});assert.equal(after.skins,before);assert.ok(after.window&&after.arena);assert.equal(after.canvases,1);
  await treasure();await page.locator('#pfqhCzg .open-one').click();
  await page.waitForFunction(()=>document.querySelector('#pfqhCzg .stat-text').innerText.includes('累计抽取1次'));
  await page.locator('.czg-reward-mask').click({position:{x:5,y:5}});await page.waitForTimeout(2200);
  await page.locator('#pfqhCzg .open-one').click();await page.waitForFunction(()=>document.querySelector('#pfqhCzg .stat-text').innerText.includes('累计抽取2次'));
  await page.locator('#pfqhCzg .ret-back1').click({force:true});await page.waitForTimeout(2200);assert.equal(await page.locator('#pfqhCzg').count(),0);report.checks.push('treasure closes and reopens without changing skins or deleting core nodes; renderer is released');
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.badAssets,[]);
 }catch(error){report.failure=error.stack;await page.screenshot({path:`${out}/${suite}-failure.png`}).catch(()=>{});throw error;}
 finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await context.close();}console.log(suite+': '+report.checks.join('; '));
}}finally{await browser.close();}
