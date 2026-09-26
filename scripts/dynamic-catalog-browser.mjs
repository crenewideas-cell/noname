import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184',name='动态皮肤验证扩展',out='output/dynamic-performance';
const count=Number(process.env.NONAME_PERF_SKINS||5000),before=process.argv.includes('--before');
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
const catalog=JSON.parse(await fs.readFile('apps/core/extension/ui/'+name+'/catalog.json','utf8'));
const sample=catalog.entries.find(e=>e.type==='spine');
const entries=Array.from({length:count},(_,i)=>({...sample,id:'perf_'+i,character:'压力测试',title:'皮肤'+String(i).padStart(5,'0')}));
const report={count,mode:before?'before':'after',errors:[],checks:[]};
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 page.setDefaultTimeout(120000);
 page.on('pageerror',e=>report.errors.push(e.stack));page.on('dialog',d=>void d.accept());
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?route.abort():route.continue();});
 await page.route('**/catalog.json',route=>decodeURI(route.request().url()).includes(name)?route.fulfill({json:{...catalog,entries}}):route.continue());
 if(before)await page.route('**/*.js',async route=>{
  const path=decodeURI(new URL(route.request().url()).pathname);
  const file=path.endsWith('/动态皮肤验证扩展/bridge.js')?'bridge.js':path.endsWith('/千幻聆音/dynamic-core.js')?'dynamic-core.js':path.endsWith('/shousha/code/shousha.js')?'shousha.js':null;
  if(!file)return route.fallback();
  const body=(await fs.readFile(out+'/before/'+file,'utf8')).replace("from 'noname'", "from '/noname.js'").replace("animation-assets.json' with {type:'json'}", "animation-assets.json?import'");
  return route.fulfill({body,contentType:'application/javascript'});
 });
 await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 await page.route('**/game/config.json',async route=>{
  const response=await route.fetch(),config=await response.json();
  Object.assign(config,{extensions:['千幻聆音',name],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:'builtin-rzsh',change_skin:true,change_skin_auto:'off',animation:true,low_performance:false});
  for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
  for(const row of installed)config['extension_'+row.name+'_enable']=['千幻聆音',name].includes(row.name);
  config['extension_'+name+'_enable']=true;await route.fulfill({response,json:config});
 });
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 await page.evaluate(async()=>{window.__env=await import('/noname.js');});
 await page.waitForFunction(count=>__env.game.qhly_coreReady&&__env.game.localDynamicSkinTestHub?.packs['动态皮肤验证扩展']?.entries.length===count,count);
 await page.waitForSelector('#splash canvas');
 console.log('ready',count);
 await page.evaluate(()=>{
  window.__thumbnailChecks=0;const check=__env.game.qhly_checkFileExist;
  __env.game.qhly_checkFileExist=function(file,...args){if(file.includes('/samples/'))__thumbnailChecks++;return check.call(this,file,...args);};
  window.__resizeBefore=__env.lib.onresize.length;
 });
 const start=performance.now();
 await page.evaluate(()=>__env.openCharacterSkins('caocao',undefined,'skin'));
 await page.waitForFunction(count=>document.querySelectorAll('.qh-skinchange-shousha-big-skin').length>=count,count);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 report.openMs=Math.round(performance.now()-start);
 console.log('opened',report.openMs);
 report.initialThumbnailChecks=await page.evaluate(()=>__thumbnailChecks);
 if(!before)assert.ok(report.initialThumbnailChecks<40,'Only viewport and neighbor thumbnails should load');
 const cards=page.locator('.qh-skinchange-shousha-big-skin');
 assert.equal(await cards.filter({hasText:'压力测试'}).count(),count);
 // Existing card actions and horizontal navigation must reach the end of a huge list.
 await cards.filter({hasText:'皮肤'+String(count-1).padStart(5,'0')}).evaluate(card=>card.click());
 await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
 console.log('last skin ready');
 assert.ok(await page.evaluate(()=>__env.game.qhly_getSkin('caocao').includes('皮肤'+String(__env.game.localDynamicSkinTestHub.packs['动态皮肤验证扩展'].entries.length-1).padStart(5,'0'))));
 report.checks.push('All entries retained; last skin can be selected and rendered');
 if(!before){
  // Arrow uses the existing DOM action and scrolls adjacent thumbnails into view.
  await page.locator('.qh-skinchange-shousha-bigarrow.left').evaluate(arrow=>arrow.click());
  await page.waitForFunction(count=>__env.game.qhly_getSkin('caocao').includes('皮肤'+String(count-2).padStart(5,'0')),count);
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
  await page.waitForFunction(() => {
    const selected = document.querySelector('.qh-skinchange-shousha-big-skin.sel .primary-avatar');
    return selected && getComputedStyle(selected).backgroundImage !== 'none';
  });
  report.finalThumbnailChecks=await page.evaluate(()=>__thumbnailChecks);
  assert.ok(report.finalThumbnailChecks<60);
  const frame=await (await page.locator('.qh-image-standard iframe').elementHandle()).contentFrame();
  assert.equal(await frame.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('/catalog.json'))),false);
  report.checks.push('Adjacent arrow and on-demand thumbnails work; player loads no full catalog');
 }
 await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
 await page.waitForTimeout(900);
 report.resizeListeners=await page.evaluate(()=>({before:__resizeBefore,after:__env.lib.onresize.length}));
 assert.equal(await page.locator('.local-dynamic-preview').count(),0);
 if(!before)assert.equal(report.resizeListeners.after,report.resizeListeners.before);
 assert.equal(report.errors.length,0);
}catch(e){report.failure=e.stack;}finally{
 await browser.close();await fs.mkdir(out,{recursive:true});await fs.writeFile(out+'/ui-'+report.mode+'.json',JSON.stringify(report,null,2));
}
console.log(JSON.stringify(report,null,2));assert.ok(!report.failure);
