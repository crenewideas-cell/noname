import { lib } from '../library/index.js';
import { subscribePresentation } from './presentationEvents.js';

// One core resource set for every arena skin. Character voices and card-pack
// rarity announcements still go through the engine's skill/audio resolver.
const files = new Set(['SkillBtn','BtnSure','card_click','game_start_shousha','xianding','juexing','shiming',
 'SZN_loseHp','ss_dead','kill_effect_sound','diankuangtulu','wanjunqushou','miaoshouhuichun','yishugaochao',
 'guohechaiqiao','shunshouqianyang','huogong','juedou','nanmanruqin','wanjianqifa','wuxiekeji','taoyuanjieyi','shandian',
 'effect_guguoanbang','effect_haolingtianxia','effect_kefuzhongyuan','effect_wenheluanwu',
 'a_yipo','a_shuanglian','a_sanlian','a_silian','a_wulian','a_liulian','a_qilian']);
const cards={guohe:'guohechaiqiao',shunshou:'shunshouqianyang',huogong:'huogong',juedou:'juedou',nanman:'nanmanruqin',
 wanjian:'wanjianqifa',wuxie:'wuxiekeji',taoyuan:'taoyuanjieyi',shandian:'shandian',
 gz_guguoanbang:'effect_guguoanbang',gz_haolingtianxia:'effect_haolingtianxia',gz_kefuzhongyuan:'effect_kefuzhongyuan',gz_wenheluanwu:'effect_wenheluanwu'};
const kills=['a_yipo','a_shuanglian','a_sanlian','a_silian','a_wulian','a_liulian','a_qilian'];

export function mountBattleAudio({active=()=>true,enabled=()=>true}={}) {
 const playing=new Set(),blocked=new Map(),queue=[];
 let disposed=false,ended=false,announcing=false;
 const allowed=()=>!disposed&&active()&&enabled()&&lib.config.background_audio!==false;
 function play(name,finished=()=>{}) {
  if(!allowed()||!files.has(name)){finished();return;}
  const node=new Audio(`${lib.assetURL}audio/effect/ui/${name}.mp3`);
  node.volume=Math.max(0,Math.min(1,(lib.config.volumn_audio??8)/8));playing.add(node);
  let closed=false;
  const stop=()=>{if(closed)return;closed=true;blocked.delete(node);playing.delete(node);node.pause();node.onended=node.onerror=null;node.removeAttribute('src');finished();};
  const attempt=()=>{void node.play().catch(error=>{
   if(closed)return;
   if(error.name==='NotAllowedError'&&!disposed)blocked.set(node,{attempt,stop,time:performance.now()});
   else stop();
  });};
  node.onended=stop;node.onerror=stop;attempt();
 }
 function drain(){
  if(announcing||disposed||!queue.length)return;
  announcing=true;play(queue.shift(),()=>{announcing=false;drain();});
 }
 const announce=name=>{if(!allowed())return;queue.push(name);drain();};
 const sound=name=>{if(!ended)play(name);};
 const unlock=()=>{for(const [node,entry] of blocked){blocked.delete(node);if(performance.now()-entry.time<5000)entry.attempt();else entry.stop();}};
 document.addEventListener('pointerdown',unlock,true);document.addEventListener('keydown',unlock,true);
 const unsubscribe=subscribePresentation(message=>{
  if(message.type==='start')ended=false;
  if(message.type==='result'){ended=true;return;}
  if(ended||!allowed())return;
  switch(message.type){
   case 'start':sound('game_start_shousha');break;
   case 'skill':sound(message.awakening?'juexing':message.mission?'shiming':message.limited?'xianding':'SkillBtn');break;
   case 'card':if(cards[message.card])sound(cards[message.card]);break;
   case 'number':{
    const h=message.health;
    if(h?.kind==='damage'&&!h.unreal&&h.sourced&&Number.isFinite(h.value)&&h.value>=3)announce(h.value===3?'diankuangtulu':'wanjunqushou');
    else if(h?.kind==='loseHp'&&h.value>0)sound('SZN_loseHp');
    break;
   }
   case 'recoveryAchievement':for(const kind of message.achievements||[]){const name={recovery:'miaoshouhuichun',rescue:'yishugaochao'}[kind];if(name)announce(name);}break;
   case 'death':
    if(message.source&&message.source.seat!==message.player?.seat&&Number.isInteger(message.kills)&&message.kills>0)announce(kills[Math.min(message.kills,7)-1]);
    else sound('ss_dead');
    break;
  }
 });
 return {sound,dispose(){
  disposed=true;unsubscribe();queue.length=0;
  document.removeEventListener('pointerdown',unlock,true);document.removeEventListener('keydown',unlock,true);
  for(const node of playing){node.onended=node.onerror=null;node.pause();node.removeAttribute('src');}
  playing.clear();blocked.clear();
 }};
}
