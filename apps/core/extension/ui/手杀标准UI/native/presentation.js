import {installNativeMenu} from './menu.js';

/** Resolve artwork without replacing Card.init or changing extension metadata. */
export function cardArtwork(card, {lib, get, files, base, config}) {
 if(config.rzsh_cards===false||lib.config.hide_card_image||card.classList.contains('infohidden'))return;
 const info=lib.card[card.name];
 if(!info||info.image||info.cardimage)return;
 const natures=get.natureList(card);
 // Multi-nature / extension-specific artwork remains the core's responsibility.
 if(natures.length>1)return;
 const aliases={fire:'huosha',thunder:'leisha',ice:'bingsha',stab:'cisha'};
 const name=card.name==='sha'&&aliases[natures[0]]?aliases[natures[0]]:card.name;
 for(const ext of ['webp','png','jpg']){
  const file='original/十周年UI/image/card/'+name+'.'+ext;
  if(files.has(file))return base+file;
 }
}

/** DOM decoration only. No prototype, selection, event or skill replacement. */
export function mountGamePresentation({lib,game,ui,get,manifest,files,base,config}) {
 const parts=new Set(Object.entries(manifest.components).filter(([,part])=>part.runtime==='shousha').map(([id])=>id));
 const inventory=new Set(files),cards=new Map(),decorated=new Set();
 const style=document.createElement('link');style.rel='stylesheet';style.href=base+'native/presentation.css';document.head.append(style);
 const previous=document.body.getAttribute('data-shousha-parts');document.body.dataset.shoushaParts=[...parts].join(' ');
 let disposed=false,frame=0,disposeMenu,menuNode,settlement;
 function decorate(){
  frame=0;if(disposed)return;
  if(ui.system2!==menuNode){disposeMenu?.();menuNode=ui.system2;if(parts.has('buttons'))disposeMenu=installNativeMenu({ui});}
  if(parts.has('cards'))for(const card of document.querySelectorAll('#window .card')){
   if(!card.name)continue;
   const image=cardArtwork(card,{lib,get,files:inventory,base,config});
   if(image){
    if(cards.get(card)!==image){cards.set(card,image);card.style.setProperty('--ss-card-art',`url(${JSON.stringify(image)})`);}
    if(!card.classList.contains('ss-card-art'))card.classList.add('ss-card-art');
   }else if(cards.has(card)){cards.delete(card);card.classList.remove('ss-card-art');card.style.removeProperty('--ss-card-art');}
  }
  // Core dialogs own the candidates, eligibility, selection count, confirmation
  // and cancellation. This class changes their layout, never event properties.
  if(parts.has('players'))for(const dialog of document.querySelectorAll('#window .dialog')){
   const characters=Array.from(dialog.buttons||[]).filter(button=>button.classList.contains('character'));
   if(characters.length){dialog.classList.add('ss-character-dialog');decorated.add(dialog);}
   else if(decorated.delete(dialog))dialog.classList.remove('ss-character-dialog');
  }
  for(const node of cards.keys())if(!node.isConnected){node.classList.remove('ss-card-art');node.style.removeProperty('--ss-card-art');cards.delete(node);}
 }
 function schedule(){if(!disposed&&!frame)frame=requestAnimationFrame(decorate);}
 const observer=new MutationObserver(records=>{
  if(records.some(record=>record.type==='childList'||record.attributeName==='data-card-name'||record.attributeName==='data-nature'||(record.attributeName==='class'&&record.target.classList.contains('card'))))schedule();
 });
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-card-name','data-nature']});
 // Statistics are read after the host has determined the result. This panel
 // cannot award cards/skills, decide a winner, or change any player's score.
 function showSettlement(result){
  if(!parts.has('arena')||config.rzsh_mvp===false||disposed)return;
  settlement?.remove();settlement=document.createElement('section');settlement.className='ss-core-settlement';
  const heading=document.createElement('h2');heading.textContent=result===true?'对局胜利':result===false?'对局结束':'对局统计';settlement.append(heading);
  const rows=[...game.players,...game.dead].map(player=>({name:get.translation(player.name),damage:(player.stat||[]).reduce((sum,stat)=>sum+(stat.damage||0),0),kills:(player.stat||[]).reduce((sum,stat)=>sum+(stat.kill||0),0)}));
  const top=[...rows].sort((a,b)=>b.damage-a.damage||b.kills-a.kills)[0];
  if(top){const mvp=document.createElement('p');mvp.textContent='本场输出最高：'+top.name;settlement.append(mvp);}
  const table=document.createElement('table');
  for(const row of [['武将','造成伤害','击杀'],...rows.map(row=>[row.name,row.damage,row.kills])]){const tr=document.createElement('tr');for(const text of row){const cell=document.createElement('td');cell.textContent=String(text);tr.append(cell);}table.append(tr);}
  const close=document.createElement('button');close.textContent='查看本体结算';close.onclick=()=>settlement.remove();settlement.append(table,close);document.body.append(settlement);
 }
 const onover=result=>{try{showSettlement(result);}catch(error){settlement?.remove();console.warn('手杀结算展示失败',error);}};
 lib.onover.push(onover);schedule();
 return()=>{
  disposed=true;cancelAnimationFrame(frame);observer.disconnect();disposeMenu?.();settlement?.remove();style.remove();
  const index=lib.onover.indexOf(onover);if(index>=0)lib.onover.splice(index,1);
  for(const card of cards.keys()){card.classList.remove('ss-card-art');card.style.removeProperty('--ss-card-art');}
  for(const node of decorated)node.classList.remove('ss-character-dialog');
  if(previous===null)document.body.removeAttribute('data-shousha-parts');else document.body.setAttribute('data-shousha-parts',previous);
 };
}
