// Targeted regression: normal RZSH lobby clicks, not the directstart shortcut.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const evidence='docs/references/decade-ingame-ui/evidence/',origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8181';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage(),report={at:new Date().toISOString(),errors:[]};
const ready=()=>page.waitForFunction(async()=>{const{lib}=await import('/noname.js');return !!lib.uiWorkshop&&!!lib.db&&!!lib.config?.extensions&&!!lib.configOL;},null,{timeout:120000});
page.on('pageerror',error=>report.errors.push(error.message));page.on('dialog',d=>d.accept());
await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/v1')||u.pathname.startsWith('/ws/v1')?route.abort():route.continue();});
await page.route('**/game/config.json',async route=>{const response=await route.fetch(),config=await response.json();Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6'});for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;await route.fulfill({response,json:config});});
async function controls(){return page.evaluate(async()=>{const{lib}=await import('/noname.js'),app=lib.onloadSplashes.find(x=>x.id==='rzsh-modern').lifecycle.app;const result=[];function visit(node){if(!node.worldVisible)return;if(node.interactive){const b=node.getBounds();result.push({name:node.name,text:node.text||node.children?.map(c=>c.text||'').join(''),textures:node.texture?.textureCacheIds,rect:{x:b.x,y:b.y,width:b.width,height:b.height}});}node.children?.forEach(visit);}visit(app.stage);return result;});}
async function click(control){assert.ok(control,'missing lobby control');const r=control.rect;await page.mouse.click(r.x+r.width/2,r.y+r.height/2);}
try{
 await page.goto(origin,{waitUntil:'domcontentloaded'});await ready();await page.waitForTimeout(10000);
 await page.evaluate(async()=>{const{game,lib}=await import('/noname.js');for(const[k,v]of Object.entries({show_splash:'always',new_tutorial:true,extension_auto_import:false,mode:'identity'}))await game.promises.saveConfig(k,v);await lib.uiWorkshop.use('builtin-rzsh');localStorage.removeItem(lib.configprefix+'directstart');});
 await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForSelector('.rzsh-modern-splash canvas');await page.waitForTimeout(12000);
 assert.equal(await page.evaluate(async()=>(await import('/noname.js')).lib.uiWorkshop.error),undefined);
 await page.screenshot({path:evidence+'rzsh-start-fixed-lobby.png'});
 await click((await controls()).find(x=>x.text==='人机对战'));await page.waitForTimeout(3000);
 const buttons=await controls();console.log(JSON.stringify(buttons));await page.screenshot({path:evidence+'rzsh-start-fixed-mode.png'});
 await click(buttons.find(x=>x.name==='spinekz'));await page.waitForTimeout(5000);await page.screenshot({path:evidence+'rzsh-start-after-click.png'});
 await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});await page.waitForFunction(()=>document.body.dataset.decadeParts?.includes('cards'));
 report.state=await page.evaluate(async()=>{const{lib}=await import('/noname.js');return {active:lib.config.ui_workshop_active,parts:document.body.dataset.decadeParts,background:getComputedStyle(document.querySelector('#arena')).backgroundImage,frames:document.querySelectorAll('.decade-frame').length,error:lib.uiWorkshop.error};});
 assert.equal(report.state.active,'builtin-rzsh');assert.match(report.state.background,/十周年|%E5%8D%81/i);assert.ok(report.state.frames>0);assert.equal(report.state.error,undefined);
 await page.screenshot({path:evidence+'rzsh-start-fixed-selection.png'});report.passed=true;
}catch(error){report.failure=error.stack;await page.screenshot({path:evidence+'rzsh-start-failure.png'}).catch(()=>{});throw error;}
finally{await fs.writeFile(evidence+'rzsh-start-fix-browser.json',JSON.stringify(report,null,2));await browser.close();}
