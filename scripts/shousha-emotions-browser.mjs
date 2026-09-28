// Fresh browser save; run actual Player actions and GameEvent triggers.
// Only the cosmetic RNG is fixed to make probabilistic assertions repeatable.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=path.resolve('output/ui-effects/emotions');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage();
const report={errors:[],missing:[],checks:[],modules:[],httpErrors:[]};
page.on('request',r=>{if(/gameEvent|presentationEvents|emotionReplies/.test(r.url()))report.modules.push(r.url());});
page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
page.on('console',msg=>{if(msg.type()==='error'||/UI (动画失败|展示数据生成失败)/.test(msg.text()))report.errors.push(msg.text());});
page.on('response',r=>{if(r.status()>=400){report.httpErrors.push({url:r.url(),status:r.status()});if(r.url().includes('throw_emotion'))report.missing.push(r.url());}});
await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||/^\/(api|ws)\//.test(u.pathname)?r.abort():r.continue();});
await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_disable_extension','true'));
await page.route('**/game/config.json',async r=>{
 const response=await r.fetch(),config=await response.json();
 Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'off',mode:'identity',characters:['standard'],cards:['standard','extra'],ui_workshop_active:'builtin-shousha-standard',game_speed:'vfast',background_audio:false});
 config.mode_config.identity={...config.mode_config.identity,player_number:'5',double_character:false,change_card:'disabled'};
 config.ui_workshop_shousha_settings={ss_auto_emotion:true,ss_emotion_reply:false,ss_dynamic:false};
 for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
 await r.fulfill({response,json:config});
});
try{
 await page.goto(process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:5174/',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
 await page.waitForSelector('.ss-player-frame');
 await page.evaluate(async()=>{
  window.host=await import('/noname.js');
  const {lib,game,_status,subscribePresentation}=host;
  window.fx={stage:'opening',messages:[],triggers:[],rng:.01,ready:false};
  const nativeRandom=crypto.getRandomValues.bind(crypto);
  crypto.getRandomValues=array=>array instanceof Uint32Array&&array.length===1?(array[0]=Math.floor(fx.rng*4294967296),array):nativeRandom(array);
  subscribePresentation(m=>{
   if(m.type==='emotion')fx.messages.push({...m,stage:fx.stage});
   if(m.type==='emotionTrigger')fx.triggers.push({...m,stage:fx.stage});
  });
  window.hold=async stage=>{fx.stage=stage;fx.ready=true;await new Promise(resolve=>window.advance=()=>{fx.ready=false;resolve();});};
  lib.skill._emotion_browser_driver={trigger:{global:'phaseBefore'},forced:true,popup:false,firstDo:true,priority:100000,
   filter:()=>!fx.started,
   async content(){
    fx.started=true;
    await new Promise(resolve=>setTimeout(resolve,2300));
    await hold('opening');
    fx.rng=.75;
    const {game,_status}=host,me=game.me,others=game.players.filter(p=>p!==me),[ally,enemy,enemy2,ally2]=others;
    fx.seats={me:me.dataset.position,ally:ally.dataset.position,enemy:enemy.dataset.position,enemy2:enemy2.dataset.position,ally2:ally2.dataset.position};
    for(const p of game.players){p.init('sunquan');p.hp=p.maxHp=6;p.ai.shown=1;p.identityShown=true;}
    me.identity='zhu';ally.identity=ally2.identity='zhong';enemy.identity=enemy2.identity='fan';game.zhu=me;
    _status.auto=true;
    for(const p of game.players){const cards=p.getCards('he');if(cards.length)await p.lose(cards,host.ui.discardPile);}
    fx.stage='friendly-damage';await ally.damage(1,me);await hold('friendly-damage');
    fx.stage='multi-damage';await enemy.damage(2,me);await hold('multi-damage');
    fx.stage='gift';const gifts=[game.createCard('shan'),game.createCard('shan')];await me.gain(gifts,'gain2');await me.give(gifts,ally);await hold('gift');
    fx.stage='wine';await me.useCard({name:'jiu',isCard:true},me,false);await hold('wine');
    fx.stage='phase-use';me.removeSkill('zhiheng');await me.gain(Array.from({length:12},()=>game.createCard('shan')),'gain2');await me.phaseUse();await hold('phase-use');
    fx.stage='turnover';const flip=game.createEvent('emotionTestFlip',false);flip.player=enemy;flip.target=ally;
    flip.setContent(async event=>{await event.target.turnOver().set('source',event.player);});await flip;await hold('turnover');
    fx.stage='entry';fx.rng=.01;await game.triggerEnter(ally);await new Promise(resolve=>setTimeout(resolve,1000));await hold('entry');fx.rng=.75;
    fx.stage='rescue';ally.hp=1;ally.update();await me.gain([game.createCard('tao'),game.createCard('tao')],'gain2');await ally.damage(1,enemy);await hold('rescue');
    fx.stage='kill';enemy2.hp=1;enemy2.update();await me.useCard({name:'sha',isCard:true},enemy2,false);await hold('kill');
    fx.stage='done';game.pause2();
   }};
  game.addGlobalSkill('_emotion_browser_driver');
 });
 if(await page.locator('#extension-recovery summary').isVisible())await page.locator('#extension-recovery summary').click();
 await page.locator('#arena .button.character.selectable').first().click();
 for(const stage of ['opening','friendly-damage','multi-damage','gift','wine','phase-use','turnover','entry','rescue','kill']){
  await page.waitForFunction(stage=>window.fx?.ready&&fx.stage===stage,stage,{timeout:90000});
  if(stage==='rescue')await page.waitForTimeout(950);
  const current=await page.evaluate(stage=>({stage,messages:fx.messages.filter(m=>m.stage===stage),triggers:fx.triggers.filter(m=>m.stage===stage),seats:fx.seats,
   images:[...document.querySelectorAll('img[src*="throw_emotion/"]')].map(n=>({src:n.src,loaded:n.complete&&n.naturalWidth>0,rect:n.getBoundingClientRect().toJSON()})),
   states:host.game.players.map(p=>({seat:p.dataset.position,hp:p.hp,identity:p.identity})),dead:host.game.dead.map(p=>p.dataset.position)}),stage);
  report.checks.push(current);console.log(stage,JSON.stringify(current.messages.reduce((counts,m)=>(counts[m.emotion]=(counts[m.emotion]||0)+1,counts),{})),current.triggers.map(m=>m.trigger).join(','));
  if(stage==='opening')assert.ok(current.messages.length>=40,'opening greeting must retain multiple rounds');
  if(stage==='friendly-damage')assert.ok(current.messages.some(m=>m.player.seat===current.seats.ally&&m.target.seat===current.seats.me&&m.emotion==='egg'));
  if(stage==='multi-damage')assert.ok(current.messages.some(m=>m.target.seat===current.seats.me&&m.emotion==='flower'));
  if(stage==='gift')assert.ok(current.messages.some(m=>m.player.seat===current.seats.ally&&m.target.seat===current.seats.me&&m.emotion==='wine'));
  if(stage==='wine')assert.ok(current.messages.filter(m=>m.emotion==='wine'&&m.target.seat===current.seats.me).length>=2);
  if(stage==='phase-use')assert.equal(current.messages.filter(m=>m.emotion==='wine'&&m.target.seat===current.seats.me).length,2);
  if(stage==='turnover')assert.ok(current.messages.some(m=>m.player.seat===current.seats.ally&&m.target.seat===current.seats.enemy&&m.emotion==='egg'));
  if(stage==='entry'){assert.equal(current.messages.length,48);assert.equal(current.messages.filter(m=>m.emotion==='wine').length,4);}
  if(stage==='rescue'){assert.ok(current.triggers.some(m=>m.trigger==='recoverAfter'&&m.savePlayer===current.seats.me));assert.equal(current.messages.filter(m=>m.emotion==='flower'&&m.player.seat===current.seats.ally).length,9);}
  if(stage==='kill'){assert.ok(current.dead.includes(current.seats.enemy2));assert.ok(current.messages.some(m=>m.emotion==='flower'&&m.target.seat===current.seats.me));}
  if(['friendly-damage','multi-damage','rescue'].includes(stage)){
   assert.ok(current.images.some(n=>n.loaded&&n.rect.width>0&&n.rect.height>0),'actual throw sprite must be visible');
   await page.screenshot({path:path.join(out,stage+'.png')});
  }
  await page.evaluate(()=>advance());
 }
 await page.waitForFunction(()=>fx.stage==='done');
 report.completed=true;assert.deepEqual(report.missing,[]);
 assert.deepEqual(report.httpErrors.filter(r=>new URL(r.url).pathname!=='/preload.js'),[]);
 // Browsers may log intentionally blocked remote endpoints; actual JS failures
 // are checked separately from known net::ERR_FAILED diagnostics.
 assert.deepEqual(report.errors.filter(e=>!e.includes('net::ERR_FAILED')&&!e.includes('status of 404')),[]);
}catch(error){
 report.failure=error.stack;report.state=await page.evaluate(()=>({fx:window.fx,event:window.host?._status.event?.name,triggerCode:window.host?.lib.element.GameEvent.prototype.trigger.toString(),parts:document.body.dataset.shoushaParts,body:document.body.innerText.slice(-2000)})).catch(()=>null);
 await page.screenshot({path:path.join(out,'failure.png')});throw error;
}finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify({completed:report.completed,errors:report.errors,missing:report.missing,stages:report.checks.map(c=>c.stage),failure:report.failure}));}

