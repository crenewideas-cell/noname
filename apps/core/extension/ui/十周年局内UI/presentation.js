import { installAdaptiveLayout } from './layout.js';
import { mountAnimations } from './animations.js';
import { mountPortraits } from './portraits.js';

export function cardArtwork(card,{lib,get,inventory,base}) {
 if(!card.name||!card.childNodes.length||card.classList.contains('infohidden')||lib.config.hide_card_image)return;
 const info=lib.card[card.name];if(!info||info.image||info.cardimage)return;
 const nature=get.natureList(card);if(nature.length>1)return;
 const aliases={fire:'huosha',thunder:'leisha',ice:'bingsha',stab:'cisha'};
 const name=card.name==='sha'&&aliases[nature[0]]?aliases[nature[0]]:card.name;
 for(const suffix of ['webp','png','jpg']){const path='assets/cards/'+name+'.'+suffix;if(inventory.has(path))return base+path;}
}

// Retain the actual core nodes and handlers. This adapter never selects a
// candidate, changes a rule, evaluates a skill or supplies an event result.
export async function mountPresentation({base,manifest,ui,lib,get,game,signal}) {
 const response=await fetch(base+'files.json',{signal});if(!response.ok)throw new Error('资源清单缺失');
 const inventory=new Set(await response.json());
 const metadataResponse=await fetch(base+'animation-assets.json',{signal});if(!metadataResponse.ok)throw new Error('动画清单缺失');
 const metadata=await metadataResponse.json();
 const style=document.createElement('link');style.rel='stylesheet';style.href=base+'presentation.css';
 await new Promise((resolve,reject)=>{
  const finish=error=>{clearTimeout(timer);signal.removeEventListener('abort',abort);style.onload=style.onerror=null;if(error){style.remove();reject(error);}else resolve();};
  const abort=()=>finish(new Error('展示已退出'));
  const timer=setTimeout(()=>finish(new Error('样式加载超时')),15000);
  style.onload=()=>finish();style.onerror=()=>finish(new Error('样式加载失败'));signal.addEventListener('abort',abort,{once:true});
  if(signal.aborted)abort();else document.head.append(style);
 });
 if(signal.aborted){style.remove();return()=>{};}
 const parts=new Set(Object.entries(manifest.components).filter(([,p])=>p.runtime==='decade').map(([id])=>id));
 const previous=document.body.getAttribute('data-decade-parts');document.body.dataset.decadeParts=[...parts].join(' ');
 const cards=new Map(),frames=new Map(),dialogs=new Set(),skills=new Set(),menus=new Map(),icons=new Map(),deaths=new Map();let disposed=false,raf=0;
 const layout=parts.has('arena')&&parts.has('players')&&!game.chess?installAdaptiveLayout({game:{get me(){return !!game.me;}},ui,className:'decade-layout',refreshHand:()=>ui.updatehl()}):()=>{};
 const options=manifest.components.arena?.options||{},enabled=()=>lib.config.animation!==false&&!lib.config.low_performance;
 const animations=mountAnimations({base,parts,options,metadata,enabled,volume:()=>Math.max(0,Math.min(1,(lib.config.volumn_audio||0)/8))});
 const portraits=mountPortraits({base,metadata,enabled:()=>parts.has('players')&&options.dynamic!==false&&enabled()});
 function icon(node,kind,file){
  if(!node)return;const value=inventory.has(file)?`url(${JSON.stringify(base+file)})`:null;
  if(value){if(icons.get(node)?.value!==value){node.style.setProperty('--decade-icon',value);node.classList.add('decade-'+kind);icons.set(node,{kind,value});}}
  else if(icons.has(node)){node.style.removeProperty('--decade-icon');node.classList.remove('decade-'+icons.get(node).kind);icons.delete(node);}
 }
 function decorate(){
  raf=0;if(disposed)return;
  animations.syncTargets(parts.has('lines')?[...ui.arena.querySelectorAll(':scope>.player.selected,:scope>.player.target')]:[]);
  if(parts.has('players')&&!manifest.components.players?.assets?.frame)for(const player of ui.arena?.querySelectorAll(':scope>.player:not(.minskin)')||[]) {
   let frame=frames.get(player);
   if(!frame){frame=document.createElement('div');frame.className='decade-frame';frame.setAttribute('aria-hidden','true');player.append(frame);frames.set(player,frame);}
   const publicIdentity=player.node?.identity?.textContent?.trim();
   const role={主:'zhu',主公:'zhu',忠:'zhong',忠臣:'zhong',反:'fan',反贼:'fan',内:'nei',内奸:'nei',猜:'guessing',地主:'dizhu',农民:'nongmin',友:'friend',敌:'enemy',野:'ye'}[publicIdentity];
   icon(player.node?.identity,'identity','assets/image/styles/shousha/identity2_'+role+'.png');
   const deathFile='assets/image/styles/shousha/dead2_'+role+'.png';
   if(player.classList.contains('dead')&&inventory.has(deathFile)){let stamp=deaths.get(player);if(!stamp){stamp=document.createElement('div');stamp.setAttribute('aria-hidden','true');player.append(stamp);deaths.set(player,stamp);}icon(stamp,'death',deathFile);}
   else if(deaths.has(player)){deaths.get(player).remove();deaths.delete(player);}
   // Group is decorative public data only after both generals are revealed.
   const hidden=['unseen','unseen2','unseen_v','unseen2_v','unseen_show','unseen2_show'].some(x=>player.classList.contains(x));
   const group=hidden?'unknown':player.group||'unknown';
   if(frame.dataset.group!==group)frame.dataset.group=group;
   const label=hidden||group==='unknown'?'':get.translation(group);
   if(frame.textContent!==label)frame.textContent=label;
  }
  if(parts.has('players'))for(const card of ui.arena.querySelectorAll('.judges>.card')){const name=card.viewAs||card.name;icon(card,'judge','assets/image/ui/judge-mark/'+name+'.png');}
  if(parts.has('cards'))for(const card of document.querySelectorAll('#window .card')) {
   const art=cardArtwork(card,{lib,get,inventory,base});
   if(art){if(cards.get(card)!==art){cards.set(card,art);card.style.setProperty('--decade-card',`url(${JSON.stringify(art)})`);}card.classList.add('decade-card');}
   else if(cards.delete(card)){card.classList.remove('decade-card');card.style.removeProperty('--decade-card');}
  }
  if(parts.has('players'))for(const dialog of document.querySelectorAll('#window .dialog')) {
   const characters=Array.from(dialog.buttons||[]).some(b=>b.classList.contains('character'));
   if(characters){dialog.classList.add('decade-characters');dialogs.add(dialog);}
   else if(dialogs.delete(dialog))dialog.classList.remove('decade-characters');
  }
  if(parts.has('buttons'))for(const node of [ui.skills,ui.skills2,ui.skills3])if(node&&!skills.has(node)){skills.add(node);node.classList.add('decade-skills');}
  if(parts.has('buttons'))for(const [node,name] of [[ui.configMenu,'decade-settings'],[ui.sortCard,'decade-sort'],[ui.exit,'decade-exit']])if(node instanceof HTMLElement&&!menus.has(node)){node.classList.add(name);menus.set(node,name);}
  for(const [node,{kind}] of icons)if(!node.isConnected){node.classList.remove('decade-'+kind);node.style.removeProperty('--decade-icon');icons.delete(node);}
  for(const [player,frame] of frames)if(!player.isConnected||player.classList.contains('minskin')){frame.remove();frames.delete(player);}
  for(const card of cards.keys())if(!card.isConnected){card.classList.remove('decade-card');card.style.removeProperty('--decade-card');cards.delete(card);}
  for(const dialog of dialogs)if(!dialog.isConnected){dialog.classList.remove('decade-characters');dialogs.delete(dialog);}
  for(const node of skills)if(!node.isConnected){node.classList.remove('decade-skills');skills.delete(node);}
 }
 const schedule=()=>{if(!disposed&&!raf)raf=requestAnimationFrame(()=>{try{decorate();}catch(error){console.warn('十周年节点装饰失败',error);}});};
 const observer=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.attributeName!=='class'||r.target.matches('.card,.player')))schedule();});
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-card-name','data-nature']});schedule();
 const click=event=>{if(!parts.has('buttons'))return;const node=event.target.closest?.('#control .control:not(.disabled),#arena .card.selectable,#arena .button.selectable');if(node)animations.sound(node.matches('.card')?'card_click':'BtnSure');};
 document.addEventListener('click',click,{passive:true});
 return()=> {
  if(disposed)return;disposed=true;
  const releases=[()=>observer.disconnect(),()=>cancelAnimationFrame(raf),layout,portraits,()=>animations.dispose(),()=>document.removeEventListener('click',click),()=>style.remove(),
   ...[...frames.values()].map(node=>()=>node.remove()),
   ...[...cards.keys()].map(node=>()=>{node.classList.remove('decade-card');node.style.removeProperty('--decade-card');}),
   ...[...dialogs].map(node=>()=>node.classList.remove('decade-characters')),
   ...[...deaths.values()].map(node=>()=>node.remove()),
   ...[...icons].map(([node,{kind}])=>()=>{node.classList.remove('decade-'+kind);node.style.removeProperty('--decade-icon');}),
   ...[...menus].map(([node,name])=>()=>node.classList.remove(name)),
   ...[...skills].map(node=>()=>node.classList.remove('decade-skills')),
   ()=>{if(previous===null)document.body.removeAttribute('data-decade-parts');else document.body.setAttribute('data-decade-parts',previous);}];
  for(const release of releases)try{release();}catch(error){console.warn('十周年展示释放失败',error);}
  frames.clear();cards.clear();dialogs.clear();skills.clear();menus.clear();icons.clear();deaths.clear();
 };
}
