import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
const out='output/qianhuan-dynamic';await fs.mkdir(out,{recursive:true});
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});

const reports=[];
try{for(const suite of process.argv.slice(2).length?process.argv.slice(2):['lobby','ingame']){
 const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage();
 const report={suite,errors:[],checks:[]};reports.push(report);page.on('pageerror',error=>{report.errors.push(error.stack);console.log(error.stack);});page.on('console',msg=>{if(msg.type()==='warning'&&/动态皮肤|动态立绘|Error/.test(msg.text()))console.log('WARN',msg.text());});page.on('dialog',d=>d.accept());
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?route.abort():route.continue();});
 if(suite==='lobby')await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 await page.route('**/game/config.json',async route=>{const response=await route.fetch(),config=await response.json();Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:suite==='lobby'?'always':'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='lobby'?'builtin-rzsh':'builtin-decade-ingame',change_skin:true,change_skin_auto:'off',animation:true,low_performance:false,extension_千幻聆音_qhly_dom2image:true});config.mode_config.identity={...config.mode_config.identity,player_number:'2',double_character:true};for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;for(const row of installed)config['extension_'+row.name+'_enable']=row.name==='千幻聆音';await route.fulfill({response,json:config});});
 try{
 await page.goto(origin,{waitUntil:'domcontentloaded'});await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.qhly_coreReady;},null,{timeout:90000});
 if(suite==='ingame'){await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.players?.length&&game.players.every(p=>p.name1&&p.name2);},null,{timeout:60000});await page.evaluate(async()=>{const{game}=await import('/noname.js');game.pause2();game.me.init('caocao','sunquan');game.me.dataset.qhlyTest='me';});}
 else await page.waitForSelector('#splash canvas',{timeout:90000});
 await page.evaluate(async()=>{window.__skinView=(await import('/noname.js')).openCharacterSkins('caocao',undefined,'skin');});
 const card=page.locator('.qh-skinchange-shousha-big-skin').filter({hasText:'雄吞天下'});await card.waitFor();await card.click();
 await page.waitForSelector('.qh-image-standard .qhly-core-dynamic[data-ready=true]',{timeout:30000});
 await page.waitForTimeout(1000);await page.screenshot({path:out+'/'+suite+'-dynamic.png'});
 report.checks.push('native skin card lists and renders installed dynamic skin');
 const toggle=page.locator('.qh-skinchange-big-dynamicChange');await toggle.click();await page.waitForSelector('.qh-image-standard .qhly-core-dynamic',{state:'detached'});await toggle.click();await page.waitForSelector('.qh-image-standard .qhly-core-dynamic[data-ready=true]');
 report.checks.push('native static/dynamic toggle stops and restarts the selected renderer');
 await page.locator('.qh-avatar-default').click();await page.waitForFunction(async()=>{const{_status}=await import('/noname.js');return _status.qhly_primarySkin_caocao==='雄吞天下.jpg';});
 if(suite==='lobby'){
 const avatar=page.locator('.qh-image-standard');await avatar.dispatchEvent('mousedown');await page.waitForSelector('#qhly_bigedit0');await avatar.dispatchEvent('mouseup');
 const before=await page.evaluate(()=>document.querySelector('.qh-image-standard').dynamic.primary.scale);
 await page.locator('#qhly_bigedit0').dispatchEvent('mousedown');await page.locator('#qhly_bigedit0').dispatchEvent('mouseup');
 assert.ok(await page.evaluate(()=>document.querySelector('.qh-image-standard').dynamic.primary.scale)>before);
 await page.locator('#qhly_bigedit7').dispatchEvent('mousedown');await page.waitForSelector('.qhly_blackbg',{state:'detached'});
 report.checks.push('original dynamic editor changes rendered scale and cancels');
 await page.evaluate(async()=>{const{game}=await import('/noname.js');const write=game.writeFile.bind(game);window.__writes=[];game.writeFile=(data,path,name,callback)=>write(data,'temp/qianhuan-validation',name,error=>{window.__writes.push({path,name,error:error?.message});callback?.(error);});});
 await avatar.dispatchEvent('mousedown');await page.waitForSelector('#qhly_bigedit0');await avatar.dispatchEvent('mouseup');
 await page.locator('#qhly_bigedit0').dispatchEvent('mousedown');await page.locator('#qhly_bigedit0').dispatchEvent('mouseup');
 await page.locator('#qhly_bigedit6').dispatchEvent('mousedown');await page.waitForSelector('.qhly_blackbg',{state:'detached'});
 await page.waitForFunction(()=>window.__writes.some(w=>w.name==='skinEdit.js'),null,{timeout:20000});
 assert.ok(await page.evaluate(()=>window.__writes.every(w=>!w.error)));
 await page.locator('.qh-skinchange-shousha-big-skin.sel .qh-domtoimage').click();await page.waitForSelector('#qh-d2icreate');
 await page.waitForSelector('.qh-domtoimagebg .qhly-core-dynamic[data-ready=true]',{timeout:30000});await page.locator('#qh-d2icreate').click();
 await page.waitForFunction(()=>window.__writes.some(w=>w.name==='雄吞天下.jpg'),null,{timeout:20000});
 assert.ok(await page.evaluate(()=>window.__writes.every(w=>!w.error)));await page.waitForSelector('.qh-domtoimagebg',{state:'detached'});
 report.checks.push('original editor and generate-image controls write actual files through current filesystem (isolated test directory)');
 }
 await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
 if(suite==='ingame'){
 await page.waitForSelector('#arena .avatar .qhly-core-dynamic[data-ready=true]');assert.equal(await page.locator('#arena .decade-portrait').count(),0);
 await page.evaluate(async()=>{const{game}=await import('/noname.js');await new Promise(r=>game.qhly_setCurrentSkin('sunquan','吴王六剑.jpg',r,true));});await page.waitForSelector('#arena > [data-qhly-test=me] > .avatar2 .qhly-core-dynamic[data-ready=true]');
 await page.evaluate(async()=>{const{game}=await import('/noname.js');game.me.classList.add('unseen2');});await page.waitForSelector('#arena > [data-qhly-test=me] > .avatar2 .qhly-core-dynamic',{state:'detached'});
 await page.evaluate(async()=>{const{game}=await import('/noname.js');game.me.classList.remove('unseen2');});await page.waitForSelector('#arena > [data-qhly-test=me] > .avatar2 .qhly-core-dynamic[data-ready=true]');
 assert.ok(await page.evaluate(()=>[...document.querySelectorAll('#arena>.player>.avatar,#arena>.player>.avatar2')].every(n=>n.querySelectorAll('.qhly-core-dynamic').length<=1)));
 report.checks.push('main/deputy dynamic skins follow selection and hidden state without duplicate renderer');
  }else {
 assert.equal(await page.locator('.qhly-core-dynamic').count(),0);
 const pairs=await page.evaluate(async()=>Object.entries((await import('/noname.js')).game.qhly_dynamicSkin).flatMap(([name,skins])=>Object.keys(skins).map(title=>[name,title])));
 report.assets=[];
 for(const [name,title] of pairs){
 await page.evaluate(async name=>{window.__skinView=(await import('/noname.js')).openCharacterSkins(name,undefined,'skin');},name);
 const card=page.locator('.qh-skinchange-shousha-big-skin').filter({hasText:title});await card.waitFor();await card.click();
 await page.waitForSelector('.qh-image-standard .qhly-core-dynamic[data-ready=true]',{timeout:30000});
 const data=await page.evaluate(async()=>{const{game}=await import('/noname.js');const node=document.querySelector('.qh-image-standard'),e=game.qhly_coreDynamic.entries.get(node);const blob=await game.qhly_captureDynamic(node);return {name:e.name,title:e.title,bytes:blob.size,actions:e.renderer.getSpineActions(e.primary.name)};});assert.ok(data.bytes>5000);report.assets.push(data);
 const action=await page.evaluate(async()=>{const{game}=await import('/noname.js');return game.qhly_coreDynamic.playAction(document.querySelector('.qh-image-standard'));});
 if(data.actions.some(a=>a.name==='GongJi')){assert.equal(action,true);await page.locator('.qhly-core-action canvas').waitFor();await page.waitForTimeout(500);await page.screenshot({path:out+'/'+name+'-action.png'});await page.locator('.qhly-core-action').waitFor({state:'detached',timeout:20000});}else assert.equal(action,false);
 await page.screenshot({path:out+'/'+name+'-dynamic.png'});
 await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});assert.equal(await page.locator('.qhly-core-dynamic').count(),0);
 }
 report.checks.push('all six installed dynamic skins render original skeletons/backgrounds, produce nonempty images and release resources');
 const race=await page.evaluate(async()=>{const{game}=await import('/noname.js');const check=game.qhly_checkFileExist;let release;game.qhly_checkFileExist=(path,callback)=>{release=()=>check(path,callback);};let stale=false;game.qhly_setCurrentSkin('caocao','英杰会聚.jpg',()=>{stale=true;});game.qhly_checkFileExist=check;game.qhly_setCurrentSkin('caocao',null);release();await new Promise(r=>setTimeout(r,1500));return {selected:game.qhly_getSkin('caocao'),stale};});assert.ok(!race.selected);assert.equal(race.stale,false);
 report.checks.push('delayed earlier selection cannot overwrite a later classic selection');
 const failure=await page.evaluate(async()=>{const{game}=await import('/noname.js');const write=game.writeFile;game.writeFile=()=>{throw Error('test denied');};try{return await new Promise(r=>game.qhly_writeTextFile('test','temp/qianhuan-validation','failure.txt',r));}finally{game.writeFile=write;}});assert.equal(failure.message,'test denied');
 report.checks.push('filesystem failure is returned to native editor callbacks with a readable message');
 }

 assert.deepEqual(report.errors,[]);
 }catch(error){console.log(await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');return {export:lib.config.extension_千幻聆音_qhly_dom2image,only:game.qhly_isDynamicOnly('caocao','雄吞天下.jpg'),cards:[...document.querySelectorAll('.qh-skinchange-shousha-big-skin')].map(n=>({text:n.innerText,skin:n.skin,export:n.querySelector('.qh-domtoimage')?.outerHTML}))};}));report.failure=error.stack;await page.screenshot({path:out+'/'+suite+'-failure.png'}).catch(()=>{});throw error;}
 finally{await fs.writeFile(out+'/report.json',JSON.stringify(reports,null,2));await context.close();}console.log(suite,report.checks);
}}finally{await browser.close();}
