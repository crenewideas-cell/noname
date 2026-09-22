// Compare real core phase traces under a seeded RNG and identical auto input.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8181';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']}),report=[];
const waitReady=page=>page.waitForFunction(async()=>{const{lib}=await import('/noname.js');return !!lib.uiWorkshop&&!!lib.config?.extensions;},null,{timeout:120000});
try{for(const mode of process.argv.slice(2).length?process.argv.slice(2):['identity','guozhan','doudizhu','versus']){
 const pair={mode,runs:[]};report.push(pair);
 for(const skin of ['', 'builtin-decade-ingame']){
  const context=await browser.newContext(),page=await context.newPage(),run={skin,errors:[]};pair.runs.push(run);
  page.on('pageerror',e=>run.errors.push(e.message));page.on('dialog',d=>d.accept());
  await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/v1')||u.pathname.startsWith('/ws/v1'))return route.abort();return route.continue();});
  await page.route('**/game/config.json',async route=>{const response=await route.fetch(),config=await response.json();config.extensions=[];config.extension_auto_import=false;config.new_tutorial=true;config.version='1.11.6';for(const key of Object.keys(config))if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;await route.fulfill({response,json:config});});
  await page.addInitScript(()=>{let n=271828;window.__randomLog=[];window.__resetRandom=seed=>{n=seed;window.__randomLog=[];};Math.random=()=>{window.__randomLog.push(new Error().stack.split('\n').slice(2,5).join('\n'));n=(Math.imul(n,1664525)+1013904223)>>>0;window.__randomState=n;return n/4294967296;};});
  try{
   await page.goto(origin, {waitUntil:'domcontentloaded',timeout:90000});await waitReady(page);await page.waitForTimeout(10000);
   await page.evaluate(async({skin,mode})=>{const{lib,game}=await import('/noname.js');for(const n of lib.config.extensions)await game.promises.saveConfig('extension_'+n+'_enable',false);for(const[k,v]of Object.entries({extension_auto_import:false,new_tutorial:true,version:lib.version,show_splash:'off',mode,game_speed:'vfast',characters:['standard'],cards:['standard','extra']}))await game.promises.saveConfig(k,v);await game.promises.saveConfig('player_number','5','identity');await game.promises.saveConfig('player_number','4','guozhan');await lib.uiWorkshop.use(skin);localStorage.setItem(lib.configprefix+'directstart',true);},{skin,mode});
   await page.reload({waitUntil:'domcontentloaded'});await waitReady(page);await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return !!game.me&&game.players.length>0;},null,{timeout:120000});
   await page.evaluate(async()=>{const{lib,game,ui}=await import('/noname.js');window.__trace=[];const snapshot=()=>({rng:window.__randomState,round:game.roundNumber,players:[...game.players,...game.dead].map(p=>({seat:p.dataset.position,name:p.name,name2:p.name2,hp:p.hp,maxHp:p.maxHp,hujia:p.hujia,skills:p.skills.slice(),dead:p.isDead(),cards:p.getCards('hej').map(c=>[c.name,c.suit,c.number,c.nature])}))});lib.onphase.push(()=>{window.__trace.push(snapshot());if(window.__trace.length>=6){window.__traceDone=true;game.pause2();}});lib.onover.push(result=>{window.__trace.push({result,state:snapshot()});window.__traceDone=true;});});
   await page.waitForSelector('#arena .button.character.selectable',{timeout:60000});
   run.candidates=await page.locator('#arena .button.character.selectable').evaluateAll(nodes=>nodes.map(n=>n.link));
   // One atomic input batch: a wall-clock delay after selection could let one
   // skin reach a human response while the other is already using auto AI.
   await page.evaluate(async mode=>{const{ui,_status}=await import('/noname.js');document.querySelector('#arena .button.character.selectable').click();if(mode==='guozhan')document.querySelector('#arena .button.character.selectable:not(.selected)')?.click();if(_status.event?.name==='chooseButton')document.querySelector('#control [data-action="confirm"]')?.click();if(!_status.auto)ui.click.auto();},mode);
   await page.waitForFunction(()=>window.__traceDone,null,{timeout:120000});run.trace=await page.evaluate(()=>window.__trace);run.randomCalls=await page.evaluate(()=>window.__randomLog);
  }catch(error){run.failure=error.message;run.trace=await page.evaluate(()=>window.__trace).catch(()=>undefined);run.state=await page.evaluate(async()=>{const{_status,ui}=await import('/noname.js');return {event:_status.event?.name,text:document.body.innerText.slice(-1000),auto:_status.auto,control:ui.control?.innerHTML};}).catch(()=>null);}finally{await context.close();}
 }
 try{assert.ok(pair.runs.every(r=>!r.failure&&r.errors.length===0));assert.deepEqual(pair.runs[0].trace,pair.runs[1].trace);pair.passed=true;}catch(error){pair.failure=error.message;}
 await fs.writeFile('docs/references/decade-ingame-ui/evidence/logic-regression.json',JSON.stringify({at:new Date().toISOString(),report},null,2));console.log(mode,pair.passed?'passed':pair.failure);
}}
finally{await browser.close();}if(report.some(p=>!p.passed))process.exitCode=1;
