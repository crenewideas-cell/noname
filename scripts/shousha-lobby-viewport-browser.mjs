// Real PIXI loading/lobby rendering, with an isolated save and local assets only.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:18081';
const out='output/shousha-lobby-viewport';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const report={errors:[],cases:[]};
try{
 for(const viewport of [{width:1680,height:881},{width:1920,height:1080},{width:1280,height:720}]){
  const context=await browser.newContext({viewport}),page=await context.newPage();
  page.on('pageerror',error=>report.errors.push(error.stack));page.on('dialog',dialog=>dialog.accept());
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await page.routeWebSocket('**',()=>{});
  await context.addInitScript(()=>{
   if(location.hostname!=='127.0.0.1')return;
   sessionStorage.setItem('noname_0.9_return_to_lobby','true');window.__uiApps=[];let pixi;
   Object.defineProperty(window,'PIXI',{configurable:true,get:()=>pixi,set(value){
    const App=value.Application;if(App&&!App.__recorded){const Recorded=class extends App{constructor(...args){super(...args);window.__uiApps.push(this);}};Recorded.__recorded=true;value.Application=Recorded;}pixi=value;
   }});
  });
  await page.route('**/game/config.json*',async route=>{
   const response=await route.fetch(),config=await response.json();
   Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',ui_workshop_active:'builtin-shousha-standard'});
   for(const key in config)if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;
   await route.fulfill({response,json:config});
  });
  // Hold the home atlas until the actual PIXI loading screen is inspected.
  let releaseHome;const homeReady=new Promise(resolve=>{releaseHome=resolve;setTimeout(resolve,20000).unref();});
  await page.route(/\/images\/uiStyles\/.*\/ui\.json/,async route=>{await homeReady;await route.continue();});
  await page.goto(origin,{waitUntil:'domcontentloaded'});console.log('loaded',viewport);
  await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click({timeout:90000});
  console.log('login clicked');
  await page.waitForFunction(()=>window.__uiApps.some(a=>a.view?.isConnected&&a.stage.children.length>0)&&!document.querySelector('.shousha-native-loading'),null,{timeout:90000});
  async function measure(label){
   const result=await page.evaluate(()=>{
    const app=window.__uiApps.find(a=>a.view?.isConnected),rect=app.view.getBoundingClientRect();
    const background=app.stage.children.find(n=>n.texture&&n.texture.width>1000);
    const bounds=background?.getBounds();
    return {width:innerWidth,height:innerHeight,canvas:rect.toJSON(),stageScale:{x:app.stage.scale.x,y:app.stage.scale.y},background:bounds&&{x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height},backgroundScale:background&&{x:background.scale.x,y:background.scale.y}};
   });
   assert(Math.abs(result.canvas.width-result.width)<1&&Math.abs(result.canvas.height-result.height)<1,`${label}: canvas fills viewport`);
   assert(Math.abs(result.canvas.x)<1&&Math.abs(result.canvas.y)<1,`${label}: no outer bars`);
   assert.equal(result.stageScale.x,result.stageScale.y,`${label}: uniform stage scale`);
   assert.equal(result.backgroundScale.x,result.backgroundScale.y,`${label}: uniform background scale`);
   const b=result.background;assert(b.x<=1&&b.y<=1&&b.x+b.width>=result.width-1&&b.y+b.height>=result.height-1,`${label}: background covers viewport`);
   report.cases.push({label,...result});await page.screenshot({path:`${out}/${viewport.width}x${viewport.height}-${label}.png`});
  }
  await page.waitForTimeout(500);await measure('loading');releaseHome();
  await page.waitForFunction(()=>{
   function find(n){return n.name==='mode1'&&n.worldVisible&&n.worldAlpha>.99||n.children?.some(find);}
   return window.__uiApps.some(a=>a.view?.isConnected&&find(a.stage));
  },null,{timeout:90000});
  await page.waitForTimeout(1500);await measure('home');
  if(viewport.width===1680){
   await page.setViewportSize({width:1366,height:768});await page.waitForTimeout(500);await measure('resized');
   const button=await page.evaluate(()=>{
    const app=window.__uiApps.find(a=>a.view?.isConnected);let button;
    function find(n){if(n.name==='menu1'&&n.interactive)button=n;n.children?.forEach(find);}find(app.stage);
    const b=button.getBounds(),r=app.view.getBoundingClientRect();
    return {x:r.x+(b.x+b.width/2)*r.width/app.renderer.screen.width,y:r.y+(b.y+b.height/2)*r.height/app.renderer.screen.height};
   });
   await page.mouse.click(button.x,button.y);await page.getByRole('button',{name:'大厅设置',exact:true}).waitFor({timeout:10000});
   report.pointerAfterResize=true;
  }
  await context.close();
 }
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();}
