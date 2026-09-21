// Run against the local dev server with an isolated, disposable save.
// NONAME_PLAYWRIGHT_MODULE may point to an existing Playwright installation.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'playwright');
const duel=process.argv.includes('--duel');
const output=path.resolve(duel?'output/shousha-regression-duel':'output/shousha-regression');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.NONAME_CHROME?{executablePath:process.env.NONAME_CHROME}:{})});
const context=await browser.newContext({viewport:{width:1440,height:800}});
const page=await context.newPage();
page.setDefaultTimeout(10000);
const errors=[],requests=[],warnings=[];
const cdp=await context.newCDPSession(page);
async function screenshot(name){const {data}=await cdp.send('Page.captureScreenshot',{format:'png'});await fs.writeFile(path.join(output,name),Buffer.from(data,'base64'));}
let checking=false;
page.on('console',m=>{if(checking&&m.type()==='error'&&!m.text().includes('Failed to load resource')){
 // The bundled PIXI runtime logs this deprecation but successfully parses the
 // supplied 3.8.75 animation. Keep it in the report, separate from exceptions.
 if(m.text()==='Unsupported skeleton data, 3.8.75 is deprecated, please export with a newer version of Spine.'||/^Not allowed to load local resource:.*\.(?:jpg|png)$/i.test(m.text()))warnings.push(m.text());else errors.push(m.text());
}});
page.on('pageerror',e=>{if(checking){errors.push(e.stack);console.log('PAGE ERROR',e.stack);}});
page.on('response',r=>{if(checking&&r.status()>=400&&/\/(?:extension|noname)\//.test(r.url())&&/\.(?:css|js)(?:\?|$)/.test(r.url()))requests.push(r.status()+' '+r.url());});
page.on('dialog',async d=>{if(checking){errors.push(d.message());console.log('DIALOG',d.message());}if(d.message().includes('GPL'))await d.accept();else await d.dismiss();});
await page.addInitScript(()=>window.addEventListener('unhandledrejection',e=>console.error('UNHANDLED',e.reason?.stack||String(e.reason))));
const state=()=>page.evaluate(async()=>{const {game,ui,_status}=await import('/noname.js');return {event:_status.event?.name,players:game.players.length,hand:game.me?.countCards('h'),me:game.me?.name,phase:_status.currentPhase?.name,round:game.roundNumber,paused:_status.paused,buttons:ui.dialog?.buttons?.length};});
async function waitFor(predicate,label,timeout=60000){
 const start=Date.now();
 while(Date.now()-start<timeout){
  if(errors.length||requests.length)throw new Error([...errors,...requests].join('\n'));
  if(await predicate())return;
  await page.waitForTimeout(300);
 }
 throw new Error('Timed out: '+label+' '+JSON.stringify(await state()));
}
async function clickNode(kind){
 const box=await page.evaluate(async kind=>{const{ui,game}=await import('/noname.js');let node;
  if(kind==='character')node=ui.dialog.buttons.find(b=>b.classList.contains('selectable'));
  if(kind==='cancel')node=ui.confirm?.lastElementChild;
  if(kind==='ok')node=ui.confirm?.firstElementChild;
  if(kind==='equipment')node=game.me.getCards('h').find(c=>c.classList.contains('selectable')&&['zhuge','bagua','qinggang','zhuahuang','dilu','jueying','chitu','dawan','zixin','renwang','cixiong','guanshi','qilin','hanbing','zhangba','fangtian'].includes(c.name));
  if(!node)return null;const r=node.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};
 },kind);
 assert.ok(box,'Missing '+kind+' control');await page.mouse.click(box.x,box.y);
}
try{
 await page.goto(process.env.NONAME_URL||'http://127.0.0.1:8081/');
 await page.waitForTimeout(7000);
 await page.waitForFunction(async()=>{try{const {lib}=await import('/noname.js');return !!lib.uiWorkshop;}catch{return false;}},null,{timeout:60000});
 await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');await game.promises.saveConfig('new_tutorial',true);for(const n of lib.config.extensions)await game.promises.saveConfig('extension_'+n+'_enable',false);await game.promises.saveConfig('extension_auto_import',false);await lib.uiWorkshop.use('builtin-shousha-standard');sessionStorage.setItem(lib.configprefix+'return_to_lobby','true');localStorage.removeItem(lib.configprefix+'directstart');});
 checking=true;await page.reload();
 await waitFor(async()=>page.frames().some(f=>f.url().includes('/html/rzsh.html')),'login');
 const login=page.frames().find(f=>f.url().includes('/html/rzsh.html'));
 await login.locator('#offlinebutton').click();
 await waitFor(()=>page.locator('#splash canvas').count(),'lobby');
 await page.waitForTimeout(4000);
 const recovery=page.getByText('扩展当前全部停用（资源仍在）',{exact:true});if(await recovery.count())await recovery.click();
 await screenshot('lobby.png');
 console.log('PASS login and lobby');
 await page.mouse.click(duel?690:350,390);await page.waitForTimeout(800);await screenshot('mode.png');await page.mouse.click(duel?994:1070,duel?319:404);
 await page.waitForTimeout(7000);await screenshot('match.png');
 await waitFor(async()=>{const s=await state();
  // A new disposable profile can show the engine's release notes first.
  const notes=await page.getByText('1.11.6更新内容',{exact:true}).isVisible();
  if(notes)await page.getByText('确定',{exact:true}).last().click();
  return s.event==='chooseButton'&&s.buttons>0;
 },'character selection');
 await screenshot('selection.png');console.log('PASS character selection');
 if(duel){
  await page.evaluate(async()=>{const{ui}=await import('/noname.js');ui.click.auto();});
  await waitFor(async()=>{const s=await state();return s.players===2&&s.hand>0&&s.round>=1;},'duel first turn',90000);
  await screenshot('play.png');console.log('PASS duel gameplay',await state());
  await waitFor(async()=>{const s=await state();return s.round>=2;},'duel second round',90000);
  console.log('PASS duel second round',await state());
 }else{
 await clickNode('character');
 await waitFor(async()=>{const s=await state();
  const groupChoice=await page.evaluate(async()=>{const{ui}=await import('/noname.js');return ui.dialog?.buttons?.some(b=>['wei','shu','wu','qun','jin'].includes(b.link));});
  if(s.event==='chooseButton'&&groupChoice)await clickNode('character');
  return s.event==='gameDraw'&&s.hand>0;
 },'draw');
 await screenshot('draw.png');console.log('PASS draw',await state());
 await clickNode('cancel');
 await waitFor(async()=>{const s=await state();if(s.event==='chooseToUse'&&s.phase===s.me)return true;if(['chooseCard','chooseToRespond','chooseBool'].includes(s.event)&&s.paused)await clickNode('cancel');return false;},'player phase');
 await screenshot('play.png');console.log('PASS player phase',await state());
 await clickNode('cancel');
 await waitFor(async()=>{const s=await state();if(s.event==='chooseToDiscard'&&s.paused){await page.evaluate(async()=>{const{ui}=await import('/noname.js');ui.click.auto();});}return s.phase&&s.phase!==s.me;},'next player');
 console.log('PASS next player',await state());
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 await fs.writeFile(path.join(output,'result.json'),JSON.stringify({passed:true,state:await state(),errors,requests,warnings},null,2));
}catch(error){
 await fs.writeFile(path.join(output,'result.json'),JSON.stringify({passed:false,error:error.stack,errors,requests},null,2));
 await screenshot('failure.png').catch(()=>{});
 throw error;
}finally{await browser.close();}
