import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184',out='output/qianhuan-stale-entry';
await fs.mkdir(out,{recursive:true});
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const reports=[];
try{for(const suite of ['shousha','rzsh']){
 const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage(),report={suite,checks:[],errors:[],alerts:[]};reports.push(report);
 page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',async d=>{report.alerts.push(d.message());await d.accept();});
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
 await context.addInitScript(()=>{sessionStorage.setItem('noname_0.9_return_to_lobby','true');window.__uiApps=[];let pixi;Object.defineProperty(window,'PIXI',{configurable:true,get:()=>pixi,set(value){const App=value.Application;if(App&&!App.__recorded){const Recorded=class extends App{constructor(...args){super(...args);window.__uiApps.push(this);}};Recorded.__recorded=true;value.Application=Recorded;}pixi=value;}});});
 await page.route('**/game/config.json',async r=>{const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',ui_workshop_active:suite==='shousha'?'builtin-shousha-standard':'builtin-rzsh',qhly_lastCharacter:'hlhj_daiyu',favouriteCharacter:['caocao','xiaoqiao'],rzLock_jsc:false,rzLock_jzj:true});for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;for(const row of installed)config['extension_'+row.name+'_enable']=row.name==='千幻聆音';await r.fulfill({response,json:config});});
 async function enter(){await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.qhly_coreReady;},null,{timeout:90000});if(suite==='shousha'){await page.waitForSelector('iframe[src*="/html/rzsh.html"]',{timeout:90000});await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();}await page.waitForSelector('#splash canvas',{timeout:90000});}
 async function clickSkin(){const p=await page.waitForFunction(name=>{let found;function visit(n,app){if(!n.worldVisible)return;if(n.name===name&&n.interactive){const b=n.getBounds(),c=app.view.getBoundingClientRect();const x=c.left+(b.x+b.width/2)*c.width/app.screen.width,y=c.top+(b.y+b.height/2)*c.height/app.screen.height;if(x>0&&y>0&&x<innerWidth&&y<innerHeight)found={x,y};}n.children?.forEach(child=>visit(child,app));}for(const app of window.__uiApps)if(app.stage&&app.renderer&&app.view.isConnected)visit(app.stage,app);return found;},suite==='shousha'?'under5':'pifubutton',{timeout:45000});const{x,y}=await p.jsonValue();await page.mouse.click(x,y);}
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});await enter();
  assert.equal(await page.evaluate(async()=>{const{get}=await import('/noname.js');return get.character('hlhj_daiyu').isNull;}),true,'reproduce the unavailable remembered character');
  await clickSkin();await page.waitForSelector('.qh-window',{timeout:30000});assert.ok((await page.locator('.qh-window').innerText()).includes('曹操'));
  assert.equal(await page.evaluate(async()=>(await import('/noname.js')).lib.config.qhly_lastCharacter),'caocao');
  await page.screenshot({path:`${out}/${suite}-recovered.png`});report.checks.push('actual lobby skin button recovers stale hlhj_daiyu history into the native Cao Cao skin page');
  await page.locator('.qh-back').click();await page.locator('.qh-background').waitFor({state:'detached'});
  await page.evaluate(async()=>{await(await import('/noname.js')).lib.uiWorkshop.openSkins('hlhj_daiyu');});await page.locator('dialog.qhly-core-notice').waitFor();assert.match(await page.locator('dialog.qhly-core-notice').innerText(),/hlhj_daiyu/);await page.locator('dialog.qhly-core-notice button').click();
  await page.evaluate(async()=>{await(await import('/noname.js')).lib.uiWorkshop.openSkins('xiaoqiao');});await page.waitForSelector('.qh-window');assert.ok((await page.locator('.qh-window').innerText()).includes('小乔'));await page.locator('.qh-back').click();await page.locator('.qh-background').waitFor({state:'detached'});
  // The original back button returns to the character directory, not the home
  // scene. Exercise the shared entry here; after reload click the home sprite.
  await page.evaluate(async()=>{await(await import('/noname.js')).lib.uiWorkshop.openSkins();});await page.waitForSelector('.qh-window');assert.ok((await page.locator('.qh-window').innerText()).includes('小乔'));await page.locator('.qh-back').click();await page.locator('.qh-background').waitFor({state:'detached'});
  report.checks.push('explicit missing entry returns a closable notice; valid selection and repeated lobby opening remain correct');
  await page.reload({waitUntil:'domcontentloaded'});await enter();await clickSkin();await page.waitForSelector('.qh-window');assert.ok((await page.locator('.qh-window').innerText()).includes('小乔'));report.checks.push('valid remembered character survives reload');
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.alerts.filter(text=>/错误文件|错误信息|武将资料尚未加载/.test(text)),[]);report.passed=true;
 }catch(e){report.failure=e.stack;await page.screenshot({path:`${out}/${suite}-failure.png`}).catch(()=>{});throw e;}
 finally{await fs.writeFile(out+'/report.json',JSON.stringify(reports,null,2));await context.close();}
 console.log(suite+': '+report.checks.join('; '));
}}finally{await browser.close();}
