import { game, _status } from 'noname';
import { subscribePresentation } from './presentationEvents.js';

// 手杀ui/extension.js use_throw_emoji: recipient replies (40%) and a nearby
// bot joins in (25%). This belongs to the host, not a skin's rule registry.
export function installEmotionReplies({enabled=()=>true}={}) {
 const timers=new Set();let disposed=false,lastReply=-Infinity;
 const random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;
 const pick=list=>list[Math.floor(random()*list.length)];
 const allowed=()=>!disposed&&enabled()&&!_status.connectMode&&!game.online&&!_status.video&&!_status.over&&!!game.me&&!game.observe;
 const bot=player=>player&&player!==game.me&&game.players.includes(player)&&!player.isOnline()&&!player.isUnderControl?.(true)&&!player.classList.contains('dead');
 const later=(sender,recipient,emotion,delay)=>{
  const timer=setTimeout(()=>{timers.delete(timer);if(allowed()&&bot(sender)&&recipient===game.me&&game.players.includes(recipient))sender.throwEmotion(recipient,emotion);},delay);
  timers.add(timer);
 };
 const clear=()=>{for(const timer of timers)clearTimeout(timer);timers.clear();};
 const unsubscribe=subscribePresentation(message=>{
  if(message.type==='result'){clear();return;}
  if(message.type!=='emotion'||!allowed()||message.player?.seat!==String(game.me.dataset.position))return;
  const alternate={wine:'flower',flower:'wine',egg:'shoe',shoe:'egg'}[message.emotion];
  if(!alternate||message.time-lastReply<400)return;
  const target=game.players.find(player=>String(player.dataset.position)===message.target?.seat);
  if(!bot(target))return;
  lastReply=message.time;
  const recipient=game.me;
  if(random()<.4)later(target,recipient,random()<.2?alternate:message.emotion,pick([500,700,1000,1200,1500,1700]));
  const bystanders=game.players.filter(player=>player!==target&&bot(player));
  if(bystanders.length&&random()<.25)later(pick(bystanders),recipient,random()<.3?alternate:message.emotion,pick([900,1100,1300,1800,2000]));
 });
 return()=>{disposed=true;unsubscribe();clear();};
}
