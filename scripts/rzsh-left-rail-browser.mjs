import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='output/rzsh-left-rail';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report={cases:[],errors:[]};
try{
 const context=await browser.newContext({viewport:{width:1680,height:881}}),page=await context.newPage();
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.routeWebSocket('**',()=>{});
 await context.addInitScript(()=>{sessionStorage.setItem('noname_0.9_return_to_lobby','true');window.__uiApps=[];let pixi;Object.defineProperty(window,'PIXI',{configurable:true,get:()=>pixi,set(value){const App=value.Application;if(App&&!App.__recorded){const Recorded=class extends App{constructor(...args){super(...args);window.__uiApps.push(this);}};Recorded.__recorded=true;value.Application=Recorded;}pixi=value;}});});
 await page.route('**/game/config.json*',async r=>{const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',ui_workshop_active:'builtin-rzsh'});for(const key in config)if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;await r.fulfill({response,json:config});});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:18084',{waitUntil:'domcontentloaded'});
 for(const size of [{width:1680,height:881},{width:1920,height:1080},{width:1280,height:720}]){
  await page.setViewportSize(size);
  if(size.width!==1680)await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{const find=n=>n.name==='left_fix'&&n.worldVisible?n:n.children?.map(find).find(Boolean);return __uiApps.some(a=>a.renderer&&a.stage&&a.view?.isConnected&&find(a.stage));},null,{timeout:120000});
  await page.waitForTimeout(1800);
  const state=await page.evaluate(()=>{const find=n=>n.name==='left_fix'&&n.worldVisible?n:n.children?.map(find).find(Boolean),app=__uiApps.find(a=>a.renderer&&a.stage&&a.view?.isConnected&&find(a.stage)),rail=find(app.stage),b=rail.getBounds(),c=app.view.getBoundingClientRect(),sx=c.width/app.renderer.screen.width,sy=c.height/app.renderer.screen.height;return {viewport:{width:innerWidth,height:innerHeight},rail:{x:c.x+b.x*sx,y:c.y+b.y*sy,width:b.width*sx,height:b.height*sy},scale:{x:rail.scale.x,y:rail.scale.y}};});
  report.cases.push(state);assert.ok(state.rail.y<=1&&state.rail.y+state.rail.height>=size.height*.91,JSON.stringify(state));
  await page.screenshot({path:`${out}/${size.width}x${size.height}.png`});
 }
}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify(report));

