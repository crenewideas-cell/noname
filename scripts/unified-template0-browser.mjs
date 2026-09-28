import {createRequire} from 'node:module';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:5174',out='output/unified-surfaces';
await fs.mkdir(out,{recursive:true});
const before=await fs.readFile('output/unified-surfaces-before/apps/core/layout/default/lobby-settings.css','utf8');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
try{for(const old of [true,false]){
 const context=await browser.newContext({viewport:{width:1600,height:1000}}),page=await context.newPage();
 page.on('dialog',d=>d.accept());
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
 await page.route('**/game/config.json',async r=>{const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:''});for(const key in config)if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;await r.fulfill({response,json:config});});
 if(old)await page.route('**/layout/default/lobby-settings.css*',r=>r.fulfill({contentType:'text/css',body:before}));
 await page.goto(origin,{waitUntil:'domcontentloaded'});await page.waitForSelector('#splash');await page.waitForTimeout(6000);await page.waitForFunction(async()=>!!(await import('/noname.js')).lib.uiWorkshop?.openSettings);
 await page.evaluate(async()=>{const{lib}=await import('/noname.js');await lib.uiWorkshop.openSettings('options');await document.fonts.load('24px lobby-calligraphy');});
 await page.waitForSelector('.lobby-settings-heading');await page.waitForTimeout(500);
 results.push(await page.evaluate(()=>['.lobby-settings-heading','.lobby-settings-heading button','#window .main.menu','#window .main.menu>.menu-tab','#window .main.menu .left.pane','#window .main.menu .right.pane','#window .main.menu .left.pane>div.active','#window .main.menu .config.toggle','#window .main.menu .config.toggle>div'].map(selector=>{
  const nodes=[...document.querySelectorAll(selector)].filter(n=>n.getBoundingClientRect().width>0);return nodes.map(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return {selector,box:[r.x,r.y,r.width,r.height],css:Object.fromEntries(['color','background','border','border-image','font','padding','box-shadow','text-shadow','border-radius'].map(k=>[k,s.getPropertyValue(k)]))};});
 })));
 await page.screenshot({path:out+`/template0-${old?'before':'after'}.png`});await context.close();
}assert.deepEqual(results[1],results[0]);await fs.writeFile(out+'/template0-comparison.json',JSON.stringify({unchanged:true,elements:results[0].flat().length},null,2));console.log('Template 0 unchanged:',results[0].flat().length,'elements');}finally{await browser.close();}
