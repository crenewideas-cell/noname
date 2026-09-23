import { handLimitPresentation, dyingPresentation } from 'noname';

const value=(object,key)=>Object.getOwnPropertyDescriptor(object||{},key)?.value;
export function specialMarkFile(id){
 if(/^xinfu_falu_(spade|heart|club|diamond)$/.test(id))return 'falu_'+id.slice(11)+'.png';
 if(/^starcanxi_(qun|shu|wei|wu|jin|shen)$/.test(id))return id+'.png';
}
export function prefixMarkFile(player,lib,prefixes){
 if(['unseen','unseen_v','unseen_show'].some(c=>player.classList.contains(c)))return;
 const name=value(player,'name1')||value(player,'name'),prefix=value(lib.translate,name+'_prefix');
 const style=value(prefixes,prefix);
 // These four styles have artwork in the selected source player stylesheet.
 if(['jie','shen','sp','tw'].includes(style))return 'assets/image/ui/mark/mark_'+style+'.png';
}

// Decorate core-owned marks in place so their tooltip, tap and removal paths
// remain the original ones. No skill registration, storage or rule queries.
export function mountExtras({base,parts,ui,game,lib,inventory,metadata,animations}){
 const marks=new Set(),prefixes=new Map();let hand;
 const text=(node,str)=>{if(node.textContent!==str)node.textContent=str;};
 if(parts.has('arena')){
  hand=document.createElement('div');hand.className='decade-hand-limit';hand.hidden=true;
  hand.title='手牌数 / 本体最近计算的手牌上限；— 表示尚未计算';
  const current=document.createElement('span'),separator=document.createElement('span'),limit=document.createElement('span');
  current.className='current';separator.textContent=' / ';limit.className='limit';hand.append(current,separator,limit);ui.arena.append(hand);
 }
 function resetMark(node){node.classList.remove('decade-special-mark');node.style.removeProperty('--decade-special-mark');marks.delete(node);}
 function update(){
  const players=[...ui.arena.querySelectorAll(':scope>.player:not(.minskin)')];
  animations.syncDying(parts.has('arena')?players.filter(dyingPresentation):[]);
  if(hand){
   const me=game.me,shown=!!me?.node&&!game.observe&&!me.classList.contains('dead');hand.hidden=!shown;
   if(shown){
    const count=me.node.count?.textContent?.trim()||'0',limit=handLimitPresentation(me);
    const display=limit===Infinity?'∞':typeof limit==='number'&&!Number.isNaN(limit)?String(limit):'—';
    text(hand.querySelector('.current'),count);text(hand.querySelector('.limit'),display);
    hand.classList.toggle('over-limit',typeof limit==='number'&&Number(count)>limit);
    const label='手牌 '+count+' / 上限 '+display;if(hand.getAttribute('aria-label')!==label)hand.setAttribute('aria-label',label);
   }
  }
  const activeMarks=new Set(),activePrefixes=new Set();
  if(parts.has('players'))for(const player of players){
   const hidden=['unseen','unseen2','unseen_v','unseen2_v','unseen_show','unseen2_show'].some(c=>player.classList.contains(c));
   if(!hidden)for(const node of player.node?.marks?.children||[]){
    const file=specialMarkFile(node.name||node.dataset.skill||''),path='assets/ui/assets/skill/yijiang/'+file;
    if(!file||!inventory.has(path))continue;
    activeMarks.add(node);
    if(!marks.has(node)){marks.add(node);node.classList.add('decade-special-mark');node.style.setProperty('--decade-special-mark',`url(${JSON.stringify(base+path)})`);}
   }
   const file=prefixMarkFile(player,lib,metadata.prefixMarks);
   if(file&&inventory.has(file)){
    activePrefixes.add(player);let node=prefixes.get(player);
    if(!node){node=document.createElement('div');node.className='decade-prefix-mark';node.setAttribute('aria-hidden','true');player.append(node);prefixes.set(player,node);}
    if(node.dataset.file!==file){node.dataset.file=file;node.style.backgroundImage=`url(${JSON.stringify(base+file)})`;}
   }
  }
  for(const node of marks)if(!activeMarks.has(node))resetMark(node);
  for(const[player,node]of prefixes)if(!activePrefixes.has(player)){node.remove();prefixes.delete(player);}
 }
 return {update,dispose(){hand?.remove();for(const node of marks)resetMark(node);for(const node of prefixes.values())node.remove();prefixes.clear();}};
}
