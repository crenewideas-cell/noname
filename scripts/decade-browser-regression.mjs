// Real Chromium/IndexedDB/ZIP import. Fresh profiles, no account or remote room.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const evidence=path.resolve('docs/references/decade-ingame-ui/evidence'),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8181';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const results=[];
async function ready(page){await page.waitForFunction(async()=>{try{const {lib}=await import('/noname.js');return !!(lib.config?.extensions&&lib.uiWorkshop&&lib.db);}catch{return false;}},null,{timeout:120000});await page.waitForTimeout(2000);}
try{for(const [name,zip] of [['single','十周年局内 UI-UI套装.zip'],['combo','如真似幻＋十周年局内-UI套装.zip']]){
 const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage(),result={name,errors:[],warnings:[],failedResources:[],sourceRequests:[]};results.push(result);
 page.on('pageerror',e=>result.errors.push(e.stack));page.on('console',m=>{if(['warning','error'].includes(m.type()))result.warnings.push(m.text());});page.on('dialog',d=>d.accept());
 page.on('response',r=>{if(r.status()>=400&&decodeURIComponent(r.url()).includes('十周年局内UI'))result.failedResources.push({url:r.url(),status:r.status()});});
 await context.route('**/*',route=>{const url=new URL(route.request().url());if(/\/temp\//i.test(decodeURIComponent(url.pathname))){result.sourceRequests.push(url.href);return route.abort();}if(!['127.0.0.1','localhost'].includes(url.hostname)||url.pathname.startsWith('/api/v1')||url.pathname.startsWith('/ws/v1'))return route.abort();return route.continue();});
 await page.route('**/game/config.json',async route=>{const response=await route.fetch(),config=await response.json();config.extensions=[];config.extension_auto_import=false;config.new_tutorial=true;config.version='1.11.6';for(const key of Object.keys(config))if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;await route.fulfill({response,json:config});});
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:90000});await ready(page);
  await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');for(const n of lib.config.extensions)await game.promises.saveConfig('extension_'+n+'_enable',false);for(const[k,v]of Object.entries({extension_auto_import:false,new_tutorial:true,show_splash:'off',mode:'identity'}))await game.promises.saveConfig(k,v);await game.promises.saveConfig('player_number','5','identity');await lib.uiWorkshop.open();});
  const picker=page.waitForEvent('filechooser');await page.getByRole('button',{name:'导入套装 ZIP',exact:true}).click();await(await picker).setFiles(path.resolve('dist/ui',zip));
  await page.waitForFunction(()=>document.querySelector('noname-ui-workshop')?.shadowRoot.querySelector('[role=status]')?.textContent.startsWith('已导入'),null,{timeout:120000});
  result.importMessage=await page.locator('noname-ui-workshop').locator('[role=status]').textContent();
  result.saved=await page.evaluate(async()=>{const{lib}=await import('/noname.js');const{readPack}=await import('/noname/ui/workshop/service.js');const id=lib.config.ui_workshop_catalog.at(-1).id;const pack=await readPack(id);await lib.uiWorkshop.use(id);return {id,manifest:pack.manifest};});
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  if(name==='combo'){
   await page.evaluate(async()=>{const{game,lib}=await import('/noname.js');await game.promises.saveConfig('show_splash','always');localStorage.removeItem(lib.configprefix+'directstart');});
   await page.reload({waitUntil:'domcontentloaded'});await ready(page);await page.waitForSelector('.rzsh-modern-splash canvas',{timeout:90000});await page.waitForTimeout(15000);assert.equal(await page.evaluate(async()=>(await import('/noname.js')).lib.uiWorkshop?.error),undefined);await page.screenshot({path:path.join(evidence,'combo-lobby.png')});result.lobby=true;
  }
  await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');await game.promises.saveConfig('show_splash','off');localStorage.setItem(lib.configprefix+'directstart',true);});
  await page.reload({waitUntil:'domcontentloaded'});await ready(page);await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});await page.waitForFunction(()=>document.body.dataset.decadeParts?.includes('cards'));
  await page.screenshot({path:path.join(evidence,name+'-select.png')});await page.locator('#arena .button.character.selectable').first().click();
  await page.waitForTimeout(1500);await page.evaluate(async()=>{const{ui}=await import('/noname.js');ui.click.auto();});await page.waitForTimeout(12000);
  result.game=await page.evaluate(async()=>{const{game,_status}=await import('/noname.js');return {round:game.roundNumber,players:game.players.length,hand:game.me.countCards('h'),event:_status.event?.name};});assert.ok(result.game.round>=1);await page.screenshot({path:path.join(evidence,name+'-play.png')});
  // Test mount/dispose on a paused real game; compare registry references and state.
  result.boundary=await page.evaluate(async()=>{
   const{lib,game,ui,get}=await import('/noname.js'),service=await import('/noname/ui/workshop/service.js');game.pause2();service.releaseAppearance();
   const provider=await import('/extension/十周年局内UI/extension.js'),{decadeManifest}=await import('/noname/ui/workshop/ingame.js');
   const objects=[game,lib.element.player,lib.element.card,lib.element.content,lib.skill],snap=objects.map(o=>Object.getOwnPropertyDescriptors(o));
   const state=()=>JSON.stringify(game.players.map(p=>({name:p.name,hp:p.hp,hujia:p.hujia,skills:p.skills,hand:p.getCards('he').map(c=>[c.name,c.suit,c.number,c.nature])})));const before=state(),count=lib.arenaReady?.length||0;
   for(let i=0;i<3;i++){const release=await provider.activate(decadeManifest);await new Promise(r=>setTimeout(r,600));release();}
   await new Promise(r=>setTimeout(r,100));
   const unchanged=objects.every((o,i)=>{const now=Object.getOwnPropertyDescriptors(o),old=snap[i];return Object.keys(now).length===Object.keys(old).length&&Object.keys(old).every(k=>now[k]?.value===old[k].value&&now[k]?.get===old[k].get&&now[k]?.set===old[k].set);});
   const remaining=document.querySelectorAll('.decade-frame,.decade-animation,.decade-portrait,.decade-result,link[href*="十周年局内UI/presentation.css"]').length;
   game.resume2();return {unchanged,sameState:before===state(),remaining,arenaReady:(lib.arenaReady?.length||0)-count,body:document.body.dataset.decadeParts||''};
  });assert.deepEqual(result.boundary,{unchanged:true,sameState:true,remaining:0,arenaReady:0,body:''});
  assert.equal(result.sourceRequests.length,0);assert.equal(result.failedResources.length,0);result.passed=true;
 }catch(error){result.failure=error.stack;result.diagnostics=await page.evaluate(async()=>{const{lib,game,ui,_status}=await import('/noname.js');return {body:document.body.innerHTML.slice(-2500),splash:window.inSplash,active:lib.config.ui_workshop_active,error:lib.uiWorkshop?.error,scripts:[...document.scripts].map(s=>s.src),event:_status.event?.name,arena:!!ui.arena,ready:lib.arenaReady?.length};}).catch(()=>null);console.error(name,error);await page.screenshot({path:path.join(evidence,name+'-failure.png')}).catch(()=>{});}finally{await context.close();await fs.writeFile(path.join(evidence,'browser-regression.json'),JSON.stringify({at:new Date().toISOString(),results},null,2));}
}}
finally{await browser.close();}console.log(JSON.stringify(results,null,2));if(results.some(r=>!r.passed))process.exitCode=1;
