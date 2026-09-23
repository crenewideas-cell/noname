import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const scenario=process.env.NONAME_MATCHING_CHECK||'normal';
const out='output/ui-report-fixes/ranking'+(scenario==='normal'?'':'-'+scenario);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const reports=[];
try{for(const skin of process.argv.slice(2).length?process.argv.slice(2):['rzsh','shousha']){
 const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage(),report={skin,errors:[],loadingText:[],steps:[]};reports.push(report);
 page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
 await context.addInitScript(()=>{
  sessionStorage.setItem('noname_0.9_disable_extension','true');sessionStorage.setItem('noname_0.9_return_to_lobby','true');
  window.__uiApps=[];let pixi;
  Object.defineProperty(window,'PIXI',{configurable:true,get:()=>pixi,set(value){
   const Application=value.Application;
   if(Application&&!Application.__recorded){const Recorded=class extends Application{constructor(...args){super(...args);window.__uiApps.push(this);}};Recorded.__recorded=true;value.Application=Recorded;}
   pixi=value;
  }});
  window.__loadingTexts=[];new MutationObserver(()=>{for(const n of document.querySelectorAll('.rzsh-loading'))if(n.textContent)window.__loadingTexts.push(n.textContent);}).observe(document,{subtree:true,childList:true,characterData:true});
 });
 await page.route('**/game/config.json',async r=>{const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:skin==='rzsh'?'builtin-rzsh':'builtin-shousha-standard'});for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;await r.fulfill({response,json:config});});
 if(scenario==='normal')await page.route(/(?:extension\.js|native-runtime\.js)(?:\?.*)?$/,async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replaceAll('},20000)','},60000)')});});
 async function controls(){return page.evaluate(()=>{const found=[];function visit(n,canvas,sx,sy){if(!n.worldVisible)return;if(n.interactive){const b=n.getBounds();found.push({name:n.name,text:n.text||n.children?.map(c=>c.text||'').join(''),textures:n.texture?.textureCacheIds,rect:{x:canvas.left+b.x*sx,y:canvas.top+b.y*sy,width:b.width*sx,height:b.height*sy}});}n.children?.forEach(c=>visit(c,canvas,sx,sy));}for(const app of window.__uiApps)if(app.stage&&app.renderer&&app.view.isConnected){const rect=app.view.getBoundingClientRect();visit(app.stage,rect,rect.width/app.screen.width,rect.height/app.screen.height);}return found;});}
 async function click(node){assert.ok(node,'missing scene control');const b=node.rect;await page.mouse.click(b.x+b.width/2,b.y+b.height/2);}
 try{
  await page.goto(process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8182',{waitUntil:'domcontentloaded'});
  if(skin==='shousha'){await page.waitForSelector('iframe[src*="/html/rzsh.html"]',{timeout:90000});await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();}
  await page.waitForSelector('#splash canvas',{timeout:90000});await page.waitForTimeout(12000);
  let buttons=await controls();report.steps.push({page:'home',buttons});await fs.writeFile(out+'/'+skin+'-progress.json',JSON.stringify(report,null,2));
  await page.screenshot({path:out+'/'+skin+'-home.png'});
  const ranked=buttons.find(b=>skin==='rzsh'?b.name==='right_ranking':b.name==='mode2');await click(ranked);await page.waitForTimeout(1600);
  buttons=await controls();report.steps.push({page:'ranking',buttons});await fs.writeFile(out+'/'+skin+'-progress.json',JSON.stringify(report,null,2));await page.screenshot({path:out+'/'+skin+'-ranking.png'});
  await click(buttons.find(b=>b.name==='versustwobtn'));const start=Date.now();await page.waitForTimeout(800);await page.screenshot({path:out+'/'+skin+'-matching.png'});
  report.animation=await page.evaluate(()=>{const found=[];function visit(n){if(n.state?.tracks)found.push(n.state.tracks.filter(Boolean).map(t=>({name:t.animation?.name,duration:t.animation?.duration,time:t.trackTime,listener:!!t.listener})));n.children?.forEach(visit);}for(const a of window.__uiApps)if(a.stage&&a.renderer)visit(a.stage);return found;});
  if(scenario==='stalled')await page.evaluate(()=>{for(const a of window.__uiApps)if(a.stage&&a.renderer)a.stop();});
  await page.waitForSelector('#arena .button.character.selectable',{timeout:45000});report.elapsed=Date.now()-start;
  report.state=await page.evaluate(async()=>{const{lib,game,_status}=await import('/noname.js');return {mode:lib.config.mode,variant:lib.config.mode_config.versus.versus_mode,players:game.players.length,event:_status.event?.name,error:lib.uiWorkshop.error,parts:document.body.dataset.shoushaParts||document.body.dataset.decadeParts};});
  assert.equal(report.state.mode,'versus');assert.equal(report.state.variant,'two');assert.equal(report.state.players,4);assert.equal(report.state.error,undefined);
  report.loadingText=await page.evaluate(()=>window.__loadingTexts);assert.equal(report.loadingText.some(t=>/正在准备/.test(t)),false);
  await page.screenshot({path:out+'/'+skin+'-selection.png'});
  await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});
  await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.roundNumber>=1&&game.players.every(p=>!!p.name);},null,{timeout:60000});
  report.started=await page.evaluate(async()=>{const{game}=await import('/noname.js');return {round:game.roundNumber,players:game.players.map(p=>p.name)};});
  assert.equal(report.started.players.length,4);assert.deepEqual(report.errors,[]);report.passed=true;
 }catch(error){report.failure=error.stack;await page.screenshot({path:out+'/'+skin+'-failure.png'}).catch(()=>{});process.exitCode=1;}
 finally{await fs.writeFile(out+'/report.json',JSON.stringify(reports,null,2));await context.close();console.log(JSON.stringify(report));}
}}
finally{await browser.close();}
