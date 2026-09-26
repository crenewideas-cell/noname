import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const {chromium}=playwright;
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const out='output/portrait-quality';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
const reports=[];
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));

try {for(const suite of process.argv.slice(2).length?process.argv.slice(2):['shousha','retina','decade']) {
 const touch=suite==='touch', context=await browser.newContext({viewport:{width:1440,height:810},hasTouch:touch,deviceScaleFactor:suite==='retina'?2:1});
 const page=await context.newPage(), report={suite,errors:[],checks:[]};reports.push(report);page.setDefaultTimeout(12000);
 page.on('pageerror',e=>{report.errors.push(e.stack);console.error(e.stack)});page.on('dialog',d=>d.accept());
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue()});
 await page.route('**/game/config.json',async r=>{const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='decade'?'builtin-decade-ingame':'builtin-shousha-standard',change_skin:true,change_skin_auto:'off',touchscreen:touch,hover_all:false,right_info:true,longpress_info:true,qhly_smallwindowstyle:'shousha',qhly_currentViewSkin:'shousha'});config.mode_config.identity={...config.mode_config.identity,player_number:'2',double_character:true};for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;for(const row of installed)config['extension_'+row.name+'_enable']=row.name==='千幻聆音';await r.fulfill({response,json:config});});
 try {
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
  await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto('forced');});
  await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.players?.length&&game.players.every(p=>p.name1&&p.name2);},null,{timeout:60000});
  await page.evaluate(async()=>{const{game,ui,_status}=await import('/noname.js');if(_status.auto)ui.click.auto('forced');game.pause2();game.me.init('caocao','guojia');game.me.dataset.menuTest='self';ui.arena.classList.remove('selecting');game.me.classList.remove('selectable','target');});


  await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');lib.character.caocao.img='extension/怒焰三国/image/character/nysgs_DongXie.jpg';game.me.uninit();game.me.init('caocao');});
  const avatar=page.locator('[data-menu-test="self"]>.avatar:not(.removing)');
  const sampled=async locator=>{await page.waitForFunction(selector=>document.querySelector(selector)?.style.backgroundImage.startsWith('url("data:image/png;'),await locator.evaluate(el=>{el.dataset.qualityTest='target';return '[data-quality-test="target"]';}));await locator.evaluate(el=>delete el.dataset.qualityTest);};
  await sampled(avatar);await page.waitForTimeout(900);
  report.avatar=await avatar.evaluate(async node=>{const urls=[...node.style.backgroundImage.matchAll(/url\("(.*?)"\)/g)].map(m=>m[1]);const original=new Image(),filtered=new Image();original.src=urls[1];filtered.src=urls[0];await Promise.all([original.decode(),filtered.decode()]);return {source:urls[1],original:[original.naturalWidth,original.naturalHeight],sample:[filtered.naturalWidth,filtered.naturalHeight],rect:node.getBoundingClientRect().toJSON(),dpr:devicePixelRatio};});
  assert.deepEqual(report.avatar.original,[1088,1445]);assert.ok(report.avatar.sample[1]>=report.avatar.rect.height*report.avatar.dpr);assert.ok(report.avatar.sample[1]<1445);
  await avatar.screenshot({path:out+'/'+suite+'-avatar-after.png'});
  await avatar.evaluate(node=>{window.__sampledStyle=node.style.backgroundImage;node.style.backgroundImage=node.style.backgroundImage.replace(/^url\("data:[^"]+"\),\s*/, '');});
  await avatar.screenshot({path:out+'/'+suite+'-avatar-before.png'});
  await avatar.evaluate(node=>node.style.backgroundImage=window.__sampledStyle);
  await avatar.click();await page.locator('#qhly_playerwindowbtn1').click();
  const small=page.locator('.qh-skinchange-shousha-area1 .primary-avatar').first();await sampled(small);
  await page.locator('.qh-skinchange-shousha-area1 .qh-skinchange-shousha-skin').first().screenshot({path:out+'/'+suite+'-small-after.png'});
  await small.evaluate(node=>{window.__smallStyle=node.style.backgroundImage;node.style.backgroundImage=node.style.backgroundImage.replace(/^url\("data:[^"]+"\),\s*/, '');});
  await page.locator('.qh-skinchange-shousha-area1 .qh-skinchange-shousha-skin').first().screenshot({path:out+'/'+suite+'-small-before.png'});
  await small.evaluate(node=>node.style.backgroundImage=window.__smallStyle);
  report.checks.push('actual player avatar and original skin picker use filtered source at physical pixel resolution');
  await page.locator('.qh-skinchange-shousha-enlarge').click();await page.locator('.qh-window').waitFor();
  const big=page.locator('.qh-image-standard').first();await big.waitFor();assert.ok(!(await big.evaluate(n=>n.style.backgroundImage)).includes('data:image'));await page.screenshot({path:out+'/'+suite+'-profile.png'});await page.locator('.qh-back').click();await page.locator('.qh-background').waitFor({state:'detached'});
  report.checks.push('large original illustration stays full resolution');
  // Exercise lifecycle/races with the same core background setter, in isolated DOM nodes.
  report.lifecycle=await page.evaluate(async()=>{
   const {samplePortraitBackground,releasePortraitSampling}=await import('/noname/util/portraitSampling.js');
   const source='/extension/怒焰三国/image/character/nysgs_DongXie.jpg';
   const node=document.createElement('div');node.className='primary-avatar';node.style.cssText='position:fixed;left:10px;top:10px;width:120px;height:180px;background-size:cover;z-index:100000;';document.body.append(node);
   const wait=async predicate=>{const end=performance.now()+10000;while(!predicate()){if(performance.now()>end)throw Error('portrait sampling timeout');await new Promise(r=>setTimeout(r,30));}};
   node.setBackgroundImage(source);await wait(()=>node.style.backgroundImage.includes('data:image'));
   const first=node.style.backgroundImage;node.style.height='270px';await wait(()=>node.style.backgroundImage.includes('data:image')&&node.style.backgroundImage!==first);
   node.style.height='500px';await wait(()=>!node.style.backgroundImage.includes('data:image'));
   node.style.height='180px';await wait(()=>node.style.backgroundImage.includes('data:image'));
   node.setBackgroundImage('/image/character/caocao.jpg');node.setBackgroundImage(source);await wait(()=>node.style.backgroundImage.includes('data:image')&&node.style.backgroundImage.includes('DongXie'));
   await new Promise(r=>setTimeout(r,200));if(node.style.backgroundImage.includes('/image/character/caocao.jpg'))throw Error('stale portrait won');
   const bitmapFactory=window.createImageBitmap;window.createImageBitmap=undefined;node.style.height='193px';node.setBackgroundImage(source+'?progressive');await wait(()=>node.style.backgroundImage.includes('data:image'));window.createImageBitmap=bitmapFactory;node.setBackgroundImage('/missing-portrait-quality.png');await new Promise(r=>setTimeout(r,300));if(node.style.backgroundImage.includes('data:image'))throw Error('missing image retained old sample');
   node.setBackgroundImage(source);node.remove();await new Promise(r=>setTimeout(r,300));releasePortraitSampling(node);
   const transparent=document.createElement('div');transparent.className='primary-avatar';transparent.style.cssText='position:fixed;left:1px;top:1px;width:100px;height:100px;background-size:cover';document.body.append(transparent);transparent.setBackgroundImage('/extension/千幻聆音/theme/shousha/bigedit_info.png');await new Promise(r=>setTimeout(r,100));transparent.remove();releasePortraitSampling(transparent);
   const hidden=document.createElement('div');hidden.className='primary-avatar';hidden.style.display='none';document.body.append(hidden);hidden.setBackgroundImage(source);await new Promise(r=>setTimeout(r,100));if(hidden.style.backgroundImage.includes('data:image'))throw Error('hidden processed');hidden.remove();releasePortraitSampling(hidden);
   return {resize:true,largeRestore:true,sourceRace:true,missingFallback:true,detach:true,hidden:true,progressiveFallback:true};
  });
  report.checks.push('resize/DPR, large restore, source race, missing image fallback, detach and hidden lifecycle');
  assert.deepEqual(report.errors,[]);
 }catch(e){report.failure=e.stack;await page.screenshot({path:out+'/'+suite+'-failure.png'});console.error(e);}finally{await fs.writeFile(out+'/report.json',JSON.stringify(reports,null,2));await context.close();}
}}finally{await browser.close();}
console.log(JSON.stringify(reports,null,2));if(reports.some(r=>r.failure))process.exitCode=1;
