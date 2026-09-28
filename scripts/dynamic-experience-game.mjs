import fs from 'node:fs/promises';
let s=(await fs.readFile('scripts/dynamic-shared-game.mjs','utf8')).replace('**/game/config.json','**/game/config.json*');
// Controlled test hero in a separate browser profile; actual AI game and event
// compiler are used without replacing the runtime, entries or event delivery.
s=s.replace('return __env.game.players.map(p=>p.name1);',"__env.game.me.init('ganfuren');return __env.game.players.map(p=>p.name1);");
s=s.replace("await page.evaluate(()=>__env.game.resume2());await save();",`await page.evaluate(()=>{
    const hub=__env.game.localDynamicSkinTestHub;window.__skinEvents=[];const handle=hub.handleEvent;
    hub.handleEvent=function(trigger,name){__skinEvents.push({type:'game',name:name||trigger?.name,player:trigger?.player?.name1,card:trigger?.card?.name});return handle.call(this,trigger,name);};
    addEventListener('message',e=>{if(e.data?.type?.startsWith('noname-skin-')&&['noname-skin-motion','noname-skin-event-finished','noname-skin-notice'].includes(e.data.type))__skinEvents.push({type:'player',...e.data});});
    __env.game.resume2();
  });await save();`);
s=s.replace('report.elapsedSeconds=(Date.now()-start)/1000;',"report.skinEvents=await page.evaluate(()=>__skinEvents);report.elapsedSeconds=(Date.now()-start)/1000;");
process.env.NONAME_UI_TEST_ORIGIN='http://127.0.0.1:8081';process.env.SKIN_GAME_LABEL=process.env.SKIN_GAME_LABEL||'experience-r09/game-standard';process.env.SKIN_GAME_SECONDS=process.env.SKIN_GAME_SECONDS||'60';
const file='output/dynamic-remediation/20260926-r01/experience-r09/game-fixed-harness.mjs';await fs.writeFile(file,s);await import('../'+file);
