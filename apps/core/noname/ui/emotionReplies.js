import { game, get, _status } from 'noname';
import { subscribePresentation } from './presentationEvents.js';

/** Cosmetic reactions to completed public effects. One responder per event;
 * no gameplay skill, rule delay, hidden-card inspection or gameplay RNG. */
export function installEmotionReplies({enabled=()=>true,automatic=()=>false}={}) {
 const timers=new Set(),pending=new Map(),cooldowns=new Map(),autoEchoes=new Map();
 let disposed=false,ended=false,flushTimer=0,nextReaction=0;
 const now=()=>performance.now();
 const random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;
 const allowed=()=>!disposed&&!ended&&!_status.connectMode&&!game.online&&!_status.video&&!_status.over&&!!game.me&&!game.observe;
 const present=p=>p&&game.players.includes(p)&&p.isIn();
 const mine=p=>p===game.me&&!game.notMe;
 const bot=p=>present(p)&&p!==game.me&&!p.isUnderControl()&&!p.isOnline();
 const canSend=p=>present(p)&&typeof p.throwEmotion==='function'&&(mine(p)||bot(p));
 const find=seat=>seat==null?undefined:[...game.players,...(game.dead||[])].find(p=>String(p.dataset.position)===seat);
 const key=p=>String(p.dataset.position);
 const friend=(a,b)=>a&&b&&a!==b&&get.attitude(a,b)>0;
 const enemy=(a,b)=>a&&b&&a!==b&&get.attitude(a,b)<0;
 const later=(fn,delay)=>{const t=setTimeout(()=>{timers.delete(t);if(allowed())fn();},delay);timers.add(t);return t;};
 const clear=()=>{for(const t of timers)clearTimeout(t);timers.clear();pending.clear();cooldowns.clear();autoEchoes.clear();flushTimer=0;};
 function send(sender,target,emotion,auto=true){
  if(!allowed()||!(auto?automatic():enabled())||!canSend(sender)||!present(target))return;
  // The notification is delivered asynchronously, after throwEmotion returns.
  autoEchoes.set(key(sender)+':'+key(target)+':'+emotion,now()+2500);
  sender.throwEmotion(target,emotion);
 }
 function reserve(sender,target,forced=false){
  const t=now(),pair=key(sender)+':'+key(target);
  if(!forced&&(t<nextReaction||t<(cooldowns.get('actor:'+key(sender))||0)||t<(cooldowns.get(pair)||0)))return false;
  nextReaction=t+3000;cooldowns.set('actor:'+key(sender),t+6000);cooldowns.set(pair,t+12000);return true;
 }
 function offer(target,beneficiary,score,kind,forced=false){
  if(!target||!(score>0)||!present(target))return;
  const id=key(target)+':'+kind;
  const row=pending.get(id)||{target,beneficiaries:new Set(),score:0,kind};
  if(beneficiary)row.beneficiaries.add(beneficiary);
  row.score+=score;row.forced ||= forced;pending.set(id,row);
  if(!flushTimer)flushTimer=later(flush,650);
 }
 function flush(){
  if(flushTimer){clearTimeout(flushTimer);timers.delete(flushTimer);}
  flushTimer=0;const rows=[...pending.values()];pending.clear();
  if(!automatic())return;
  const responded=new Set();
  // Multi-target damage and assistance add intensity within a short window.
  const relevant=row=>row.kind==='mistake'||(row.kind==='praise'?(row.target===game.me||friend(game.me,row.target)):enemy(game.me,row.target));
  rows.sort((a,b)=>Number(!!b.forced)-Number(!!a.forced)||Number(relevant(b))-Number(relevant(a))||b.score-a.score);
  for(const row of rows){
   const {target,score,kind,beneficiaries,forced}=row;
   if(!present(target)||responded.has(target)||(!forced&&now()<nextReaction))continue;
   const candidates=game.players.filter(p=>canSend(p)&&p!==target&&
    (kind==='praise'?friend(p,target):kind==='mistake'?beneficiaries.has(p):enemy(p,target)))
    .map(p=>({p,priority:(beneficiaries.has(p)?4:0)+(p===game.me?2:0)+random()})).sort((a,b)=>b.priority-a.priority);
   const sender=candidates.find(({p})=>forced||(now()>=(cooldowns.get('actor:'+key(p))||0)&&now()>=(cooldowns.get(key(p)+':'+key(target))||0)))?.p;
   if(!sender)continue;
   // Roll once per actor/event, not once for each ally/enemy candidate.
   responded.add(target);
   if((!forced&&random()>=.8)||!reserve(sender,target,forced))continue;
   const minimum=score<=2?1:score<=4?2:3;
   const count=minimum+Math.floor(random()*2);
   const emotion=kind==='praise'?'flower':'egg';
   // Start mandatory reactions before a killing blow can end the game.
   if(forced)send(sender,target,emotion);
   for(let i=forced?1:0;i<count;i++)later(()=>send(sender,target,emotion),150+i*320);
  }
 }
 function automaticReply(m){
  const player=find(m.player),source=find(m.source),giver=find(m.giver)||source||find(m.parentPlayer);
  const amount=Number.isFinite(m.num)?Math.max(0,m.num):0;
  if(m.trigger==='damageSource'&&player&&source&&source!==player&&amount>0){
   if(friend(source,player)){
    // Deliberate damage-benefit combinations are not classified as mistakes.
    if(!player.hasSkillTag('maixie')&&!player.hasSkillTag('maixie_hp'))offer(source,player,amount*2,'mistake',amount>=3);
   }else if(enemy(source,player)){
    offer(source,null,amount*2,'praise',amount>=3);offer(source,player,amount*2-.25,'rival',amount>=3);
   }
  }else if(m.trigger==='recoverAfter'&&amount>0){
   const saver=find(m.savePlayer)||source||find(m.parentPlayer);
   const rescued=m.rescued===true||(!!m.savePlayer&&m.hp>0),forced=rescued||amount>=3;
   if(rescued||player===saver||friend(player,saver)){
    offer(saver,player,amount*2+(rescued?3:0),'praise',forced);
    offer(saver,null,amount*2+(rescued?2.75:-.25),'rival',forced);
   }
  }else if(m.trigger==='gainAfter'&&m.count>0){
   // A gain source can be the victim of theft, not a voluntary donor.
   const donor=find(m.giver)||(['give','giveAuto'].includes(m.gainAnimation)?source:!source?find(m.parentPlayer):null);
   if(friend(player,donor))offer(donor,player,Math.min(12,m.count),'praise');
  }else if(m.trigger==='changeHujiaAfter'&&amount>0&&friend(player,giver)){
   offer(giver,player,amount*2,'praise');
  }else if(m.trigger==='turnOverAfter'&&player){
   const actor=source||find(m.parentPlayer);
   if(friend(player,actor)&&m.turnedOver===false)offer(actor,player,3,'praise');
   if(enemy(player,actor)&&m.turnedOver===true){offer(actor,null,3,'praise');offer(actor,player,2.75,'rival');}
  }else if(m.trigger==='death'&&enemy(source,player)){
   offer(source,null,5,'praise',true);offer(source,null,4.75,'rival',true);
  }
  if([...pending.values()].some(row=>row.forced))flush();
 }
 const unsubscribe=subscribePresentation(message=>{
  if(message.type==='start'){ended=false;clear();nextReaction=0;return;}
  if(message.type==='result'){ended=true;clear();return;}
  if(!allowed())return;
  if(message.type==='death'){if(automatic())automaticReply({trigger:'death',player:message.player?.seat,source:message.source?.seat});return;}
  if(message.type==='emotionTrigger'){if(automatic())automaticReply(message);return;}
  if(message.type!=='emotion'||!enabled()||message.player?.seat!==String(game.me.dataset.position))return;
  const t=now(),echo=message.player.seat+':'+message.target?.seat+':'+message.emotion;
  for(const [k,expires]of autoEchoes)if(expires<t)autoEchoes.delete(k);
  if(autoEchoes.has(echo))return;
  const target=find(message.target?.seat),alternate={wine:'flower',flower:'wine',egg:'shoe',shoe:'egg'}[message.emotion];
  if(!alternate||!bot(target)||random()>=.8||!reserve(target,game.me))return;
  const count=message.emotion==='flower'?1+Math.floor(random()*2):1;
  const emotion=message.emotion==='flower'?'flower':random()<.2?alternate:message.emotion;
  const delay=700+random()*700;
  for(let i=0;i<count;i++)later(()=>send(target,game.me,emotion,false),delay+i*320);
 });
 return()=>{disposed=true;unsubscribe();clear();};
}
