import fs from 'node:fs/promises';import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const phase=process.env.SKIN_ENTRANCE_PHASE||'before',out='output/dynamic-remediation/20260926-r01/performance-r10/format-'+phase;await fs.mkdir(out,{recursive:true});
const report={phase,errors:[],cases:[]},context=await chromium.launchPersistentContext(out+'/profile',{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}});
try{
 await context.routeWebSocket('**',s=>s.close());await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await context.route('**/game/config.json*',async r=>{const response=await r.fetch(),c=await response.json();Object.assign(c,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,show_splash:'always',ui_workshop_active:'builtin-rzsh',change_skin:true,animation:true,low_performance:false});for(const k of Object.keys(c))if(k.startsWith('extension_')&&k.endsWith('_enable'))c[k]=k==='extension_千幻聆音_enable';await r.fulfill({response,json:c});});
 await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));const page=context.pages()[0];page.on('pageerror',e=>report.errors.push(String(e)));page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:8081',{waitUntil:'domcontentloaded'});await page.evaluate(async()=>window.__env=await import('/noname.js'));await page.waitForFunction(()=>__env.game.qhly_coreReady&&__env.game.localDynamicPacksReady,null,{timeout:120000});
 await page.evaluate(async()=>{for(const name of ['standard','shiji','extra']){const c=await import('/character/'+name+'/character.js'),t=await import('/character/'+name+'/translate.js');__env.lib.characterPack[name] ||= c.default;Object.assign(__env.lib.translate,t.default);}});
 await page.evaluate(()=>__env.openCharacterSkins('caocao',undefined,'skin'));
 await page.waitForSelector('.qh-image-standard');
 for(const [pack,id] of [['无名杀基础扩展','base_548a5def3d1b73f9'],['名将杀扩展','mjs_3585a21ef01f0707'],['少女前线扩展','gf_abigail_p2']]){
  const entry=JSON.parse(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/'+pack+'/entries/'+id+'.json'));
  await page.evaluate(async({pack,entry})=>{const node=document.querySelector('.qh-image-standard');const hub=__env.game.localDynamicSkinTestHub,p=(await import('/noname/skin/localDynamic/bridge.js')).install(__env,pack,'extension/本地动态皮肤包/'+pack+'/');if(!hub.previewResource(node,p.name,entry))throw Error('Preview unavailable '+entry.id);},{pack,entry});
  await page.waitForFunction(id=>[...__env.game.localDynamicSkinTestHub.previews.values()].some(h=>h.e.id===id&&h.frame?.dataset.ready==='true'),id,{timeout:90000});
  await page.waitForTimeout(1500);report.cases.push(await page.evaluate(id=>{const h=[...__env.game.localDynamicSkinTestHub.previews.values()].find(h=>h.e.id===id);return{id,url:h.frame.src,type:h.e.type,phase:h.frame.contentDocument.documentElement.dataset.skinPhase};},id));
  await page.screenshot({path:out+'/'+id+'.png'});console.log(id);
 }
}catch(e){report.failure=String(e);await context.pages()[0].screenshot({path:out+'/failure.png'}).catch(()=>{});throw e;}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await context.close();}
