import { dyingPresentation } from 'noname';

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
 const marks=new Set(),prefixes=new Map();
 function resetMark(node){node.classList.remove('decade-special-mark');node.style.removeProperty('--decade-special-mark');marks.delete(node);}
 function update(){
  const players=[...ui.arena.querySelectorAll(':scope>.player:not(.minskin)')];
  animations.syncDying(parts.has('arena')?players.filter(dyingPresentation):[]);
  animations.syncDrinking(parts.has('arena')?players.filter(player=>player.querySelector('.playerjiu')&&!player.classList.contains('dead')):[]);
  animations.syncCards();
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
 return {update,dispose(){for(const node of marks)resetMark(node);for(const node of prefixes.values())node.remove();prefixes.clear();}};
}
