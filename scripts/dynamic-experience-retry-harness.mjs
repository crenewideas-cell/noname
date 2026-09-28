import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='output/dynamic-remediation/20260926-r01/experience-r09',phase=process.env.SKIN_PHASE||'before',out=root+'/'+phase,origin='http://127.0.0.1:8081';
await fs.mkdir(out,{recursive:true});
const report={phase,errors:[],messages:[],responses:[],cases:[]},pending=[];
const context=await chromium.launchPersistentContext(out+'/profile',{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}});
try{
 await context.routeWebSocket('**',s=>s.close());
 await context.route('**/*',r=>new URL(r.request().url()).hostname!=='127.0.0.1'?r.abort():r.continue());
 await context.route('**/game/config.json',async r=>{const response=await r.fetch(),c=await response.json();Object.assign(c,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:'builtin-rzsh',change_skin:true,change_skin_auto:'off',animation:true,low_performance:false});for(const k of Object.keys(c))if(k.startsWith('extension_')&&k.endsWith('_enable'))c[k]=k==='extension_千幻聆音_enable';await r.fulfill({response,json:c});});
 await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 await context.addInitScript(()=>{const open=indexedDB.open.bind(indexedDB);indexedDB.open=function(name,...args){if(name!=='noname-dynamic-thumbnails')return open(name,...args);const request={};queueMicrotask(()=>request.onblocked?.());return request;};});
 let failures=0;await context.route('**/*.skel',route=>{if(!failures&&route.request().frame().url().includes('thumbnail-')){failures++;report.injectedFailures=failures;return route.abort('failed');}return route.fallback();});
 const page=context.pages()[0];page.on('pageerror',e=>report.errors.push(String(e)));
 page.on('response',r=>{if(/\/(?:runtime-[^/]+\/(?:player|composition|spine36)|thumbnails|bridge)\.js(?:\?|$)/.test(r.url()))pending.push(r.body().then(b=>report.responses.push({url:r.url(),sha256:createHash('sha256').update(b).digest('hex')})).catch(()=>{}));});
 page.on('dialog',d=>d.accept());
 await page.goto(origin,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForSelector('#splash canvas',{timeout:120000});
 await page.evaluate(async()=>{window.__env=await import('/noname.js');await __env.game.localDynamicPacksReady;window.__messages=[];addEventListener('message',e=>{if(e.data?.type?.startsWith('noname-skin-'))__messages.push({time:performance.now(),...e.data});});});
 const cards=()=>page.evaluate(()=>[...document.querySelectorAll('.qh-skinchange-shousha-big-skin')].map(n=>{const a=n.querySelector('.primary-avatar'),r=n.getBoundingClientRect(),ar=a.getBoundingClientRect(),cover=n.parentElement.parentElement.getBoundingClientRect(),style=getComputedStyle(a);return{id:n.id,skin:n.skin?.skinId,ready:a.dataset.skinThumbnailReady,hasLoad:!!n.loadThumbnail,rect:r.toJSON(),avatar:ar.toJSON(),cover:cover.toJSON(),visible:r.right>cover.left&&r.left<cover.right,background:style.backgroundImage.slice(0,160),pointer:style.pointerEvents,contentVisibility:getComputedStyle(n).contentVisibility};}));
 const ids=(process.env.SKIN_IDS||'base_d7df31f97ce73240,base_839f50c86f1899be,base_61c9ad8257a3c9bc').split(',');
 for(const id of ids){
  const e=JSON.parse(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/entries/'+id+'.json')),row={id,title:e.title};report.cases.push(row);
  const character=await page.evaluate(ids=>ids.find(id=>!__env.get.character(id).isNull),e.characterIds);if(!character)throw Error('No installed owner: '+e.characterIds);row.character=character;
  await page.evaluate(name=>__env.openCharacterSkins(name,undefined,'skin'),character);
  await page.waitForFunction(key=>[...document.querySelectorAll('.qh-skinchange-shousha-big-skin')].some(n=>n.skin?.skinId===key),e.skinTitle+'.png');
  if(id===ids[0]){row.unselected=[];for(const ms of [1000,5000,15000]){await page.waitForTimeout(ms);row.unselected.push({afterMs:ms,cards:await cards()});await page.screenshot({path:out+'/unselected-'+ms+'.png'});}}
  const cardId=await page.evaluate(key=>[...document.querySelectorAll('.qh-skinchange-shousha-big-skin')].find(n=>n.skin?.skinId===key).id,e.skinTitle+'.png');
  const card=page.locator('#'+cardId);const started=Date.now();await card.evaluate(n=>n.click());
  await page.waitForTimeout(100);await page.screenshot({path:out+'/'+id+'-loading.png'});
  await page.waitForFunction(id=>[...document.querySelectorAll('.qh-image-standard iframe[data-ready=true]')].some(f=>f.contentWindow.skinPlayer?.entry.id===id),id,{timeout:60000});row.readyMs=Date.now()-started;
  await page.waitForTimeout(700);await page.screenshot({path:out+'/'+id+'-ready.png'});
  row.player=await page.evaluate(id=>{const h=[...__env.game.localDynamicSkinTestHub.previews.values()].find(h=>h.e.id===id),p=h.frame.contentWindow.skinPlayer;return{url:h.frame.src,events:h.events,input:h.input,info:p.info(),fit:p.fit,presentation:p.presentation,layers:(p.engine42?.layers||p.root?.children||[]).map(l=>({idle:l.idle||l.skinIdle,animations:l.skeleton?.data.animations.map(a=>({name:a.name,duration:a.duration})),slots:l.skeleton?.slots.map(s=>({name:s.data.name,attachment:s.attachment?.name}))}))};},id);
  const button=page.getByRole('button',{name:'交互',exact:true});if(await button.count()){await button.click();const frame=page.locator('.qh-image-standard iframe[data-ready=true]').first();await frame.click({position:{x:100,y:200}});await page.waitForTimeout(500);row.afterClick=await page.evaluate(()=>({messages:__messages.slice(-12),inputs:[...__env.game.localDynamicSkinTestHub.previews.values()].map(h=>({input:h.input,lastMotion:h.frame.contentWindow.skinPlayer?.lastMotion}))}));await page.screenshot({path:out+'/'+id+'-interaction.png'});}
  await page.waitForTimeout(6000);await page.screenshot({path:out+'/'+id+'-settled.png'});row.settled=await page.evaluate(id=>{const h=[...__env.game.localDynamicSkinTestHub.previews.values()].find(h=>h.e.id===id),p=h.frame.contentWindow.skinPlayer;return{effect:!!h.effectHost.active,tracks:(p.engine42?.layers||p.root?.children||[]).map(l=>({name:l.state?.getCurrent(0)?.animation?.name,loop:l.state?.getCurrent(0)?.loop,hidden:l.sourceHidden||l.renderable===false}))};},id);
  row.cards=await cards();await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({id,readyMs:row.readyMs,events:row.player.events,info:row.player.info?.motions}));
 }
 report.messages=await page.evaluate(()=>__messages);const last=report.cases[0].unselected.at(-1).cards.filter(c=>c.visible&&c.skin?.startsWith('本地 · '));if(!last.length||last.some(c=>c.ready!=='true'))throw Error('Visible unselected thumbnail did not recover');if(report.injectedFailures!==1)throw Error('Failure injection did not run');report.retryPassed=true;await Promise.all(pending);
}catch(error){report.failure=String(error);await context.pages()[0]?.screenshot({path:out+'/failure.png'}).catch(()=>{});throw error;}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await context.close();}
