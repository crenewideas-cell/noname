import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:5174';
const output='output/lobby-settings-corrected';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const reports=[];
try{for(const suite of process.argv.slice(2).length?process.argv.slice(2):['native','ink','decade','rzsh','shousha']){
 const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();
 const report={suite,errors:[],checks:[]};reports.push(report);page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
 await context.addInitScript(()=>{sessionStorage.setItem('noname_0.9_return_to_lobby','true');});
 await page.route('**/game/config.json',async r=>{
  const response=await r.fetch(),config=await response.json();
  Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:({native:'',ink:'builtin-ink-gold',decade:'builtin-decade-ingame',rzsh:'builtin-rzsh',shousha:'builtin-shousha-standard'})[suite]});
  config.mode_config.identity={...config.mode_config.identity,player_number:'5',double_character:false};
  for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
  await r.fulfill({response,json:config});
 });
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  if(suite==='shousha'){await page.waitForSelector('iframe[src*="/html/rzsh.html"]',{timeout:90000});await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();}
  await page.waitForSelector(suite==='shousha'||suite==='rzsh'?'#splash canvas':'#splash',{timeout:90000});
  await page.waitForFunction(async()=>!!(await import('/noname.js')).lib.uiWorkshop?.openSettings);
  await page.evaluate(async()=>{const {openLobbyTools}=await import('/noname/ui/lobbyTools.js');openLobbyTools({title:'大厅菜单',onOnline:()=>{},onOriginal:()=>{}});await document.fonts.load('25px lobby-calligraphy');});
  await page.screenshot({path:`${output}/${suite}-tools.png`});
  assert.equal(await page.getByRole('button',{name:'大厅设置',exact:true}).count(),1);
  await page.evaluate(()=>{const overlay=document.createElement('button');overlay.id='bleed-fixture';overlay.textContent='底层皮肤管理';overlay.style.cssText='position:fixed;top:0;left:50%;z-index:999999;visibility:visible';document.body.append(overlay);});
  await page.getByRole('button',{name:'大厅设置',exact:true}).click();
  await page.waitForSelector('html.lobby-settings-page .main.menu',{timeout:90000});
  await page.evaluate(async()=>{const {ui}=await import('/noname.js');ui.click.menuTab('开始');});
  await page.waitForTimeout(400);
  const menu=page.locator('#window .menu-container:not(.hidden) > .main.menu');
  report.layout=await menu.evaluate(n=>{const r=n.getBoundingClientRect(),left=n.querySelector('.left.pane'),button=left.firstElementChild,row=n.querySelector('.right.pane .config:not(.hidden)');return {x:r.x,y:r.y,width:r.width,height:r.height,viewport:[innerWidth,innerHeight],font:getComputedStyle(row).fontSize,ink:getComputedStyle(row).color,paper:getComputedStyle(n.querySelector('.right.pane')).backgroundColor,button:getComputedStyle(button).borderImageSource,transform:getComputedStyle(n).transform};});
  assert.ok(report.layout.width>=1300&&report.layout.width<=1440,JSON.stringify(report.layout));assert.ok(report.layout.height>850);assert.equal(report.layout.transform,'none');
  assert.ok(parseFloat(report.layout.font)>=20);assert.equal(report.layout.ink,'rgb(48, 37, 28)');assert.equal(report.layout.paper,'rgb(196, 181, 144)');assert.match(report.layout.button,/decade-button/);
  assert.equal(await page.locator('#bleed-fixture').evaluate(n=>getComputedStyle(n).opacity==='0'&&n.inert),true);
  assert.equal(await page.locator('#window').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(37, 34, 28)');
  await page.screenshot({path:`${output}/${suite}-settings.png`});
  const double=menu.locator('.right.pane .config.toggle').filter({hasText:'双将模式'}).first();
  await double.click();assert.equal(await page.evaluate(async()=>{const {lib}=await import('/noname.js');return lib.config.mode_config.identity.double_character;}),true);
  await double.click();assert.equal(await page.evaluate(async()=>{const {lib}=await import('/noname.js');return lib.config.mode_config.identity.double_character;}),false);
  const players=menu.locator('.right.pane .config.switcher').filter({hasText:'游戏人数'}).first();
  const valueInset=await players.evaluate(n=>n.getBoundingClientRect().right-n.querySelector('div').getBoundingClientRect().right);
  assert.ok(valueInset>=0&&valueInset<25,`Dropdown value inset: ${valueInset}`);await players.click();
  const popup=page.locator('.popup-container:not(.hidden) > .menu');
  const popupBox=await popup.boundingBox();assert.ok(popupBox.x>=0&&popupBox.x+popupBox.width<=1920,JSON.stringify(popupBox));
  await popup.getByText('八人',{exact:true}).click();
  assert.equal(await page.evaluate(async()=>{const {lib}=await import('/noname.js');return lib.config.mode_config.identity.player_number;}),'8');
  await players.click();await popup.getByText('五人',{exact:true}).click();
  report.checks.push('shared tool entry; full-size settings; existing toggle and dropdown save through host');
  for(const tab of ['选项','武将','卡牌','扩展','其它']){
   await page.evaluate(async name=>{const{ui}=await import('/noname.js');ui.click.menuTab(name);},tab);await page.waitForTimeout(200);
   assert.equal(await menu.locator('.menu-tab > .active').textContent(),tab);
   if(tab==='选项'||tab==='扩展')await page.screenshot({path:`${output}/${suite}-${tab==='选项'?'options':'extensions'}.png`});
  }
  await page.evaluate(async()=>{const{ui}=await import('/noname.js');ui.click.menuTab('开始');window.__sharedLobbyMenu=ui.menuContainer;});
  await page.getByRole('button',{name:'完成 · 返回大厅',exact:true}).click();
  await page.waitForFunction(()=>!document.documentElement.classList.contains('lobby-settings-page'));
  assert.ok(await page.locator('#splash').isVisible());
  assert.equal(await page.locator('#bleed-fixture').evaluate(n=>getComputedStyle(n).opacity==='1'&&!n.inert),true);
  await page.locator('#bleed-fixture').evaluate(n=>n.remove());
  await page.evaluate(async()=>{await(await import('/noname.js')).lib.uiWorkshop.openSettings('start');});
  assert.equal(await page.evaluate(async()=>window.__sharedLobbyMenu===(await import('/noname.js')).ui.menuContainer),true);
  assert.equal(await page.locator('.lobby-settings-heading').count(),1);
  await page.setViewportSize({width:960,height:540});await page.waitForTimeout(450);
  const compact=await menu.boundingBox();assert.ok(compact.x>=0&&compact.y>=0&&compact.x+compact.width<=961&&compact.y+compact.height<=541,JSON.stringify(compact));
  await page.screenshot({path:`${output}/${suite}-compact.png`});
  await menu.locator('.menu-tab > div').filter({hasText:'选项'}).click();
  await page.getByRole('button',{name:'完成 · 返回大厅',exact:true}).click();
  report.checks.push('all six tabs; return and reopen reuse the same menu; 960×540 fits viewport');
  assert.deepEqual(report.errors,[]);
 }catch(error){report.failure=error.stack;await page.screenshot({path:`${output}/${suite}-failure.png`}).catch(()=>{});throw error;}
 finally{await fs.writeFile(`${output}/report.json`,JSON.stringify(reports,null,2));await context.close();}
 console.log(suite+': '+report.checks.join('; '));
}}finally{await browser.close();}
