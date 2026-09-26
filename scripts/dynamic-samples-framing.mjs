import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184',name='动态皮肤验证扩展',out='output/dynamic-samples';
await fs.mkdir(out,{recursive:true});
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
const reports=[];
try{for(const suite of process.argv.slice(2).length?process.argv.slice(2):['lobby']){
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),report={suite,errors:[],checks:[],missing:[]};reports.push(report);
 page.on('pageerror',e=>{report.errors.push(e.stack);console.log(e.message);});page.on('dialog',d=>void d.accept().catch(()=>{}));
 page.on('response',r=>{if(r.status()>=400&&decodeURI(r.url()).includes(name))report.missing.push(decodeURI(r.url()));});
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?route.abort():route.continue();});
 if(suite==='lobby')await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 await page.route('**/game/config.json',async route=>{
  const response=await route.fetch(),config=await response.json();
  Object.assign(config,{extensions:['千幻聆音',name],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:suite==='lobby'?'always':'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='lobby'?'builtin-rzsh':'builtin-decade-ingame',change_skin:true,change_skin_auto:'off',animation:true,low_performance:false});
  config.mode_config.identity={...config.mode_config.identity,player_number:'2',double_character:true};
  for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
  for(const row of installed)config['extension_'+row.name+'_enable']=['千幻聆音',name].includes(row.name);
  config['extension_'+name+'_enable']=true;await route.fulfill({response,json:config});
 });
 const load=async()=>{await page.evaluate(async()=>{window.__dynamicEnv=await import('/noname.js');});await page.waitForFunction(()=>window.__dynamicEnv.game.qhly_coreReady&&window.__dynamicEnv.game.localDynamicSkinTestHub?.packs['动态皮肤验证扩展']?.entries.length===64,null,{timeout:120000});};
 const setInteraction=async value=>page.evaluate(async value=>{const ext=await import('/extension/动态皮肤验证扩展/extension.js');ext.default().config.interaction.onclick(value);},value);
 const assertNoNewUI=async()=>{
  assert.equal(await page.locator('.local-dynamic-gallery,.local-dynamic-controls,.local-dynamic-interaction').count(),0);
  assert.equal(await page.locator('.local-dynamic-skin button,.local-dynamic-preview button').count(),0);
  assert.deepEqual(await page.evaluate(async()=>Object.keys((await import('/extension/动态皮肤验证扩展/extension.js')).default().config)),['interaction']);
 };

 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});await load();
  await page.waitForSelector('#splash canvas',{timeout:90000});
  await page.evaluate(async()=>{(await import('/noname.js')).openCharacterSkins('caocao',undefined,'skin');});
  const samples=await page.evaluate(()=>{
   const es=window.__dynamicEnv.game.localDynamicSkinTestHub.packs['动态皮肤验证扩展'].entries;
   const chosen=[...new Set(es.map(e=>e.testCategory))].map(c=>es.find(e=>e.testCategory===c));
   for(const id of ['az_301290','mjs_82e3407c03b9c525',es.find(e=>e.testCategory==='碧蓝mod2'&&e.title.includes('shengluyisi_4')).id])if(!chosen.some(e=>e.id===id))chosen.push(es.find(e=>e.id===id));
   return chosen.map(e=>({id:e.id,title:e.skinTitle,type:e.type,category:e.testCategory}));
  });
  const cards=page.locator('.qh-skinchange-shousha-big-skin');
  for(const e of samples.filter(e=>!process.env.NONAME_FRAMING_IDS||process.env.NONAME_FRAMING_IDS.split(',').includes(e.id))){
   await cards.filter({hasText:e.title}).click();
   await page.waitForFunction(id=>{const f=document.querySelector('.qh-image-standard iframe');return f?.src.includes('id='+id)&&f.dataset.ready==='true';},e.id,{timeout:60000});
   const frame=page.frames().find(f=>f.url().includes('id='+e.id));
   await frame.evaluate(()=>new Promise(resolve=>{let n=0;const tick=()=>++n<30?requestAnimationFrame(tick):resolve();requestAnimationFrame(tick);}));
   const data=await frame.evaluate(()=>{const canvas=document.querySelector('[data-skin-surface]'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;return {fit:skinPlayer.fit,info:skinPlayer.info(),opaque:[[0,0],[w-1,0],[0,h-1],[w-1,h-1]].every(([x,y])=>ctx.getImageData(x,y,1,1).data[3]===255)};});
   assert.ok(data.opaque,'same-animation background fills all transparent corners');
   const layout=await page.locator('.qh-window').evaluate(v=>{
    const a=v.querySelector('.qh-shousha-big-avatar'),p=v.querySelector('.qh-image-standard'),r=a.getBoundingClientRect(),s=v.querySelector('.qh-shoushabg').getBoundingClientRect();
    return {landscape:v.classList.contains('local-skin-landscape'),avatar:{x:r.x,y:r.y,width:r.width,height:r.height},skills:{x:s.x,y:s.y,width:s.width,height:s.height},background:getComputedStyle(p).backgroundImage,children:p.querySelectorAll('.local-dynamic-preview').length};
   });
   assert.equal(layout.background,'none');assert.equal(layout.children,1);
   if(e.type==='spine42')assert.equal(layout.landscape,true);
   if(e.id==='az_301290')assert.equal(layout.landscape,false);
   if(layout.landscape){assert.ok(layout.avatar.width>layout.avatar.height);assert.ok(layout.avatar.x+layout.avatar.width<layout.skills.x);}
   if(e.id==='az_9600141'){
    await setInteraction(true);
    for(const touch of [false,true]){
     // Reset loads motions asynchronously. Inspect the hit area after the idle
     // pose has rendered, rather than reusing coordinates from the prior action.
     await frame.evaluate(async()=>{skinPlayer.reset();await skinPlayer.motion(skinPlayer.entry.idle,false);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
     const point=await frame.evaluate(()=>{const ps=[];for(let y=8;y<innerHeight;y+=6)for(let x=8;x<innerWidth;x+=6)if(skinPlayer.hit(x,y).includes('TouchHead'))ps.push({x,y});const c=ps.reduce((c,p)=>({x:c.x+p.x/ps.length,y:c.y+p.y/ps.length}),{x:0,y:0});return ps.sort((a,b)=>(a.x-c.x)**2+(a.y-c.y)**2-(b.x-c.x)**2-(b.y-c.y)**2)[0];});
     assert.ok(point,'head hit area remains visible after automatic framing');
     if(touch){const box=await frame.locator('[data-skin-surface]').boundingBox(),size=await frame.evaluate(()=>({w:innerWidth,h:innerHeight})),cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+point.x*box.width/size.w,y:box.y+point.y*box.height/size.h}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}else {const box=await frame.locator('[data-skin-surface]').boundingBox(),size=await frame.evaluate(()=>({w:innerWidth,h:innerHeight}));await page.mouse.click(box.x+point.x*box.width/size.w,box.y+point.y*box.height/size.h);}
     await frame.waitForFunction(()=>skinPlayer.lastMotion==='touch_head');
    }
    await frame.evaluate(async()=>{await skinPlayer.motion('idle7',false);await new Promise(resolve=>{let n=0;const tick=()=>++n<12?requestAnimationFrame(tick):resolve();requestAnimationFrame(tick);});});
    const drag=await frame.evaluate(()=>{const p=skinPlayer,im=p.model.internalModel,h=p.info().hits.find(h=>h.action==='touch_drag1'),b=im.getDrawableBounds(h.index),pt=p.model.toGlobal(im.localTransform.apply({x:b.x+b.width/2,y:b.y+b.height/2}));return {x:pt.x,y:pt.y,hit:p.hit(pt.x,pt.y).includes(h.name)};});
    assert.ok(drag.hit);
    const box=await frame.locator('[data-skin-surface]').boundingBox(),size=await frame.evaluate(()=>({w:innerWidth,h:innerHeight})),x=box.x+drag.x*box.width/size.w,y=box.y+drag.y*box.height/size.h;
    await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+25,y+15,{steps:4});await page.mouse.up();
    await frame.waitForFunction(()=>skinPlayer.lastMotion==='touch_drag1');
    report.inputChecks=['framed mouse/touch head hit','framed mouse drag in supplied idle7 state'];
    await setInteraction(false);
   }
   await assertNoNewUI();
   if(['az_301290','mjs_82e3407c03b9c525','nikke_c911_00'].includes(e.id)||e.category==='碧蓝mod2')await page.screenshot({path:out+'/framing-'+e.id+'.png'});
   report.checks.push({id:e.id,category:e.category,fit:data.fit,layout});console.log(JSON.stringify(report.checks.at(-1)));
  }
  for(const viewport of [{width:1024,height:768},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   await page.waitForFunction(()=>{const p=document.querySelector('.qh-background').getBoundingClientRect(),r=document.querySelector('.qh-window').getBoundingClientRect();return Math.abs(p.width-innerWidth)<2&&Math.abs(p.height-innerHeight)<2&&r.x>=-1&&r.y>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;},null,{timeout:10000});await page.waitForTimeout(1000);
   await page.screenshot({path:out+'/framing-'+viewport.width+'.png'});
  }
  await page.setViewportSize({width:1440,height:900});
  // Check a stale native image write both while loading and after renderer readiness.
  await page.route('**/runtime/player.html?*',async route=>{await new Promise(r=>setTimeout(r,600));await route.continue();});
  await cards.filter({hasText:samples[0].title}).click();
  assert.equal(await page.locator('.qh-image-standard').evaluate(p=>{p.style.backgroundImage='url(/image/character/caocao.jpg)';return getComputedStyle(p).backgroundImage;}),'none');
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
  assert.equal(await page.locator('.qh-image-standard').evaluate(p=>getComputedStyle(p).backgroundImage),'none');
  const toggle=page.locator('.qh-skinchange-big-dynamicChange');await toggle.click();await page.waitForSelector('.qh-image-standard iframe',{state:'detached'});
  assert.notEqual(await page.locator('.qh-image-standard').evaluate(p=>getComputedStyle(p).backgroundImage),'none');
  await toggle.click();await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
  await cards.filter({hasText:'经典形象'}).first().click();
  await page.waitForSelector('.qh-image-standard iframe',{state:'detached'});
  assert.equal(await page.locator('.qh-window.local-skin-landscape').count(),0);
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);
 }catch(error){console.log(await page.locator('.qh-window').evaluate(v=>({inner:[innerWidth,innerHeight],style:v.style.cssText,rect:v.getBoundingClientRect().toJSON(),computed:{zoom:getComputedStyle(v).zoom,transform:getComputedStyle(v).transform},parent:{rect:v.parentElement.getBoundingClientRect().toJSON(),style:v.parentElement.style.cssText,client:[v.parentElement.clientWidth,v.parentElement.clientHeight]}})).catch(()=>null));await page.screenshot({path:out+'/framing-failure.png'});report.failure=error.stack;console.log(error.stack);}
 finally{await fs.writeFile(out+'/framing-report.json',JSON.stringify(reports,null,2));await context.close();}
}}finally{await browser.close();}
assert.ok(reports.every(r=>!r.failure),'Framing failed: output/dynamic-samples/framing-report.json');
