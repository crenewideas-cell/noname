import fs from 'node:fs/promises';import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const phase=process.env.SKIN_ENTRANCE_PHASE||'before',out='output/dynamic-remediation/20260926-r01/performance-r10/entrance-'+phase;await fs.mkdir(out,{recursive:true});
const report={phase,errors:[],cases:[]},context=await chromium.launchPersistentContext(out+'/profile',{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}});
try{
 await context.routeWebSocket('**',s=>s.close());await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await context.route('**/game/config.json*',async r=>{const response=await r.fetch(),c=await response.json();Object.assign(c,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,show_splash:'always',ui_workshop_active:'builtin-rzsh',change_skin:true,animation:true,low_performance:false});for(const k of Object.keys(c))if(k.startsWith('extension_')&&k.endsWith('_enable'))c[k]=k==='extension_千幻聆音_enable';await r.fulfill({response,json:c});});
 await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));const page=context.pages()[0];page.on('pageerror',e=>report.errors.push(String(e)));page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:8081',{waitUntil:'domcontentloaded'});await page.evaluate(async()=>window.__env=await import('/noname.js'));await page.waitForFunction(()=>__env.game.qhly_coreReady&&__env.game.localDynamicPacksReady,null,{timeout:120000});
 await page.evaluate(async()=>{for(const name of ['standard','shiji','extra']){const c=await import('/character/'+name+'/character.js'),t=await import('/character/'+name+'/translate.js');__env.lib.characterPack[name] ||= c.default;Object.assign(__env.lib.translate,t.default);}});
 for(const [id,name] of [['base_f608254663196ac9','huanggai'],['base_a0c323434bdc7cc4','zhenji']]){
  const entry=JSON.parse(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/entries/'+id+'.json'));
  const row={id,name,frames:[]};report.cases.push(row);await page.evaluate(name=>__env.openCharacterSkins(name,undefined,'skin'),name);
  await page.waitForFunction(token=>[...document.querySelectorAll('.qh-skinchange-shousha-big-skin')].some(n=>n.skin?.skinId===token),entry.skinTitle+'.png');
  await page.evaluate(token=>[...document.querySelectorAll('.qh-skinchange-shousha-big-skin')].find(n=>n.skin?.skinId===token).click(),entry.skinTitle+'.png');
  await page.waitForFunction(id=>[...__env.game.localDynamicSkinTestHub.previews.values()].find(h=>h.e.id===id)?.effectHost?.active?.style.visibility==='visible',id,{timeout:60000});
  for(const ms of [0,700,1000,4000]){await page.waitForTimeout(ms);const state=await page.evaluate(async id=>{const h=[...__env.game.localDynamicSkinTestHub.previews.values()].find(h=>h.e.id===id),p=h.frame.contentWindow.skinPlayer,e=h.effectHost.active;return{url:h.frame.src,preview:h.frame.getBoundingClientRect().toJSON(),anchor:await p.subjectAnchor?.(),effect:!!e,idleRestoredAt:e?.__nonameSkinIdleRestoredAt,alignment:e?.__nonameSkinAlignment,placement:e?.contentWindow.skinPlayer?.entry.scene.layers[0].placement};},id);row.frames.push({afterMs:ms,...state});await page.screenshot({path:out+'/'+id+'-'+ms+'.png'});}
  console.log(JSON.stringify({id,effectFinished:!row.frames.at(-1).effect}));
 }
}catch(e){report.failure=String(e);await context.pages()[0].screenshot({path:out+'/failure.png'}).catch(()=>{});throw e;}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await context.close();}
