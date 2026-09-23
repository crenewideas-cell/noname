import {installNativeMenu} from './menu.js';
import {installAdaptiveLayout} from './layout.js';
import {installPortraitClips} from './portrait-clips.js';
import {subscribePresentation,suspendSelectionGuide} from 'noname';

/** Resolve artwork without replacing Card.init or changing extension metadata. */
export function cardArtwork(card, {lib, get, files, base, config}) {
 if(!card.name||!card.childNodes.length||config.rzsh_cards===false||lib.config.hide_card_image||card.classList.contains('infohidden'))return;
 const info=lib.card[card.name];
 if(!info||info.image||info.cardimage)return;
 const natures=get.natureList(card);
 // Multi-nature / extension-specific artwork remains the core's responsibility.
 if(natures.length>1)return;
 const aliases={fire:'huosha',thunder:'leisha',ice:'bingsha',stab:'cisha'};
 const name=card.name==='sha'&&aliases[natures[0]]?aliases[natures[0]]:card.name;
 // The source suite defaults to PNG (手杀风格); WEBP is a different gold set.
 for(const ext of ['png','webp','jpg']){
  const file='original/十周年UI/image/card/'+name+'.'+ext;
  if(files.has(file))return base+file;
 }
}

/** DOM decoration only. No prototype, selection, event or skill replacement. */
export async function mountGamePresentation({lib,game,ui,get,manifest,files,base,config,animations,signal}) {
 const parts=new Set(Object.entries(manifest.components).filter(([,part])=>part.runtime==='shousha').map(([id])=>id));
 const inventory=new Set(files),cards=new Map(),decorated=new Set(),playerFrames=new Map(),skillControls=new Set(),ornaments=new Map(),identities=new Set();
 const identityNames={'主':'zhu','忠':'zhong','反':'fan','内':'nei','猜':'cai','野':'ye','地':'dizhu','农':'nongmin','先':'xianshou','后':'houshou','帅':'zhushuai','将':'dajiang','兵':'qianfeng','师':'junshi','盟':'mengjun','神':'boss','从':'suicong'};
 function artwork(node,kind,file){
  const key='ss-'+kind;
  if(!inventory.has(file)){node.classList.remove(key);node.style.removeProperty('--'+key);return false;}
  const value=`url(${JSON.stringify(base+file)})`;
  if(node.style.getPropertyValue('--'+key)!==value)node.style.setProperty('--'+key,value);
  node.classList.add(key);return true;
 }
 const style=document.createElement('link');style.rel='stylesheet';style.href=base+'native/presentation.css';
 await new Promise((resolve,reject)=>{
  const finish=error=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);style.onload=style.onerror=null;if(error){style.remove();reject(error);}else resolve();};
  const abort=()=>finish(new Error('手杀对局皮肤已退出'));
  const timer=setTimeout(()=>finish(new Error('手杀对局皮肤样式加载超时')),20000);
  style.onload=()=>finish();style.onerror=()=>finish(new Error('手杀对局皮肤样式加载失败'));
  signal?.addEventListener('abort',abort,{once:true});
  if(signal?.aborted)abort();else document.head.append(style);
 });
 if(signal?.aborted){style.remove();return()=>{};}
 const previous=document.body.getAttribute('data-shousha-parts');document.body.dataset.shoushaParts=[...parts].join(' ');
 const releaseGuide=parts.has('arena')?suspendSelectionGuide():()=>{};
 const disposeClips=parts.has('players')?installPortraitClips():()=>{};
 let disposed=false,frame=0,disposeMenu,disposeLayout,arenaNode,menuNode,settlement;
 function decorate(){
  frame=0;if(disposed)return;
  if(ui.system2!==menuNode){disposeMenu?.();menuNode=ui.system2;if(parts.has('buttons'))disposeMenu=installNativeMenu({ui});}
  if(ui.arena!==arenaNode){
   disposeLayout?.();arenaNode=ui.arena;
   if(arenaNode&&parts.has('arena')&&parts.has('players')&&!game.chess)disposeLayout=installAdaptiveLayout({game,ui,className:'shousha-skinned-arena',refreshHand:()=>ui.updatehl()});
  }
  if(parts.has('players')&&!manifest.components.players?.assets?.frame)for(const player of ui.arena?.querySelectorAll(':scope > .player')||[]){
   if(player.classList.contains('minskin')){
    playerFrames.get(player)?.remove();playerFrames.delete(player);
    const identity=player.node?.identity;
    if(identity&&identities.delete(identity)){identity.classList.remove('ss-identity-art');identity.style.removeProperty('--ss-identity-art');}
    continue;
   }
   let ornament=playerFrames.get(player);
   if(!ornament){ornament=document.createElement('div');ornament.className='ss-player-frame';ornament.setAttribute('aria-hidden','true');player.append(ornament);playerFrames.set(player,ornament);}
   // Unknown generals keep the unknown frame. Never use an unrevealed name to
   // choose the decoration; the skin must not expose hidden game information.
   const hidden=['unseen','unseen2','unseen_v','unseen2_v','unseen_show','unseen2_show'].some(name=>player.classList.contains(name));
   const group=hidden?'unknown':player.group||'unknown';
   const candidate='original/十周年UI/image/decoration/name_new_'+group+'.png';
   const file=inventory.has(candidate)?candidate:'original/十周年UI/image/decoration/name_new_unknown.png';
   if(ornament.dataset.art!==file){ornament.dataset.art=file;ornament.style.backgroundImage=`url(${JSON.stringify(base+file)})`;}
   const identity=player.node?.identity;
   if(identity){
    // Only the label already exposed by the core, never player.identity.
    const label=identity.textContent.trim(),name=identityNames[label];
    const suffix=identity.dataset.color?.startsWith('b')?'_blue':'';
    const path='original/十周年UI/image/decoration/identity_new_'+name;
    artwork(identity,'identity-art',path+(inventory.has(path+suffix+'.png')?suffix:'')+'.png');identities.add(identity);
   }
   // Original rarity art was installed by a global skill. Observe the public
   // avatar instead; no skill registration, trigger or gameplay RNG is needed.
   const publicName=lib.config.mode!=='guozhan'&&!hidden&&player.node?.avatar?.dataset.skinCharacter;
   const rarity=publicName?game.getRarity(publicName):undefined;
   const dragonFile='original/十周年UI/assets/image/long1_'+rarity+'.png';
   if(publicName&&config.ss_dragon!==false&&inventory.has(dragonFile)){
    let dragon=ornaments.get(player);
    if(!dragon){dragon=document.createElement('img');dragon.className='ss-rarity-ornament';dragon.alt='';dragon.setAttribute('aria-hidden','true');player.append(dragon);ornaments.set(player,dragon);}
    if(dragon.dataset.rarity!==rarity){dragon.dataset.rarity=rarity;dragon.src=base+dragonFile;}
   }else{ornaments.get(player)?.remove();ornaments.delete(player);}
  }
  if(parts.has('buttons'))for(const control of [ui.skills,ui.skills2,ui.skills3]){
   if(control&&!skillControls.has(control)){control.classList.add('ss-skill-control');skillControls.add(control);}
  }
  if(parts.has('cards'))for(const card of document.querySelectorAll('#window .card')){
   const image=cardArtwork(card,{lib,get,files:inventory,base,config});
   if(image){
    if(cards.get(card)!==image){cards.set(card,image);card.style.setProperty('--ss-card-art',`url(${JSON.stringify(image)})`);}
    const info=card.node?.info||card.querySelector(':scope > .info');
    const corner=info?.textContent.replace(/[\s\uFE0E\uFE0F]/g,'').match(/^([♠♥♣♦])(.+)$/);
    if(corner&&info.dataset.ssPoint!==corner[2]+'\n'+corner[1])info.dataset.ssPoint=corner[2]+'\n'+corner[1];
    if(!corner)info?.removeAttribute('data-ss-point');
    if(!card.classList.contains('ss-card-art'))card.classList.add('ss-card-art');
   }else if(cards.has(card)){cards.delete(card);card.classList.remove('ss-card-art');card.style.removeProperty('--ss-card-art');card.querySelector(':scope > .info')?.removeAttribute('data-ss-point');}
  }
  // Core dialogs own the candidates, eligibility, selection count, confirmation
  // and cancellation. This class changes their layout, never event properties.
  if(parts.has('players'))for(const dialog of document.querySelectorAll('#window .dialog')){
   const characters=Array.from(dialog.buttons||[]).filter(button=>button.classList.contains('character'));
   if(characters.length){dialog.classList.add('ss-character-dialog');decorated.add(dialog);}
   else if(decorated.delete(dialog))dialog.classList.remove('ss-character-dialog');
  }
  for(const node of cards.keys())if(!node.isConnected){node.classList.remove('ss-card-art');node.style.removeProperty('--ss-card-art');node.querySelector(':scope > .info')?.removeAttribute('data-ss-point');cards.delete(node);}
  for(const [player,ornament] of playerFrames)if(!player.isConnected){ornament.remove();playerFrames.delete(player);}
  for(const [player,ornament] of ornaments)if(!player.isConnected||player.classList.contains('minskin')){ornament.remove();ornaments.delete(player);}
  for(const node of identities)if(!node.isConnected){node.classList.remove('ss-identity-art');node.style.removeProperty('--ss-identity-art');identities.delete(node);}
  for(const node of skillControls)if(!node.isConnected){node.classList.remove('ss-skill-control');skillControls.delete(node);}
  for(const node of decorated)if(!node.isConnected){node.classList.remove('ss-character-dialog');decorated.delete(node);}
 }
 function schedule(){if(!disposed&&!frame)frame=requestAnimationFrame(()=>{try{decorate();}catch(error){frame=0;console.warn('手杀节点装饰失败',error);}});}
 const observer=new MutationObserver(records=>{
  if(records.some(record=>record.type==='childList'||record.type==='characterData'||['data-card-name','data-nature','data-color','data-skin-character'].includes(record.attributeName)||(record.attributeName==='class'&&record.target.matches('.card,.player'))))schedule();
 });
 observer.observe(document.body,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['class','data-card-name','data-nature','data-color','data-skin-character']});
 // Statistics are read after the host has determined the result. This panel
 // cannot award cards/skills, decide a winner, or change any player's score.
 function showSettlement(result,rows){
  if(!parts.has('arena')||config.rzsh_mvp===false||disposed||!rows.length)return;
  settlement?.remove();settlement=document.createElement('section');settlement.className='ss-core-settlement';
  const heading=document.createElement('h2');heading.textContent=result===true?'对局胜利':result===false?'对局结束':'对局统计';settlement.append(heading);
  const top=[...rows].sort((a,b)=>b.damage-a.damage||b.kills-a.kills)[0];
  if(top){const mvp=document.createElement('p');mvp.textContent='本场输出最高：'+top.name;settlement.append(mvp);}
  const table=document.createElement('table');
  for(const row of [['武将','造成伤害','击杀'],...rows.map(row=>[row.name,row.damage,row.kills])]){const tr=document.createElement('tr');for(const text of row){const cell=document.createElement('td');cell.textContent=String(text);tr.append(cell);}table.append(tr);}
  const close=document.createElement('button');close.textContent='关闭';close.onclick=()=>settlement.remove();settlement.append(table,close);document.body.append(settlement);
 }
 const unsubscribe=subscribePresentation(message=>{
  if(message.type!=='result')return;
  showSettlement(message.result,message.rows);
  return animations?.result(message.result);
 });
 schedule();
 return()=>{
  if(disposed)return;disposed=true;
  const releases=[unsubscribe,releaseGuide,()=>cancelAnimationFrame(frame),()=>observer.disconnect(),()=>disposeMenu?.(),()=>disposeLayout?.(),disposeClips,()=>settlement?.remove(),()=>style.remove(),
   ...Array.from(cards.keys(),card=>()=>{card.classList.remove('ss-card-art');card.style.removeProperty('--ss-card-art');card.querySelector(':scope > .info')?.removeAttribute('data-ss-point');}),
   ...Array.from(decorated,node=>()=>node.classList.remove('ss-character-dialog')),
   ...Array.from(playerFrames.values(),ornament=>()=>ornament.remove()),
   ...Array.from(ornaments.values(),ornament=>()=>ornament.remove()),
   ...Array.from(identities,node=>()=>{node.classList.remove('ss-identity-art');node.style.removeProperty('--ss-identity-art');}),
   ...Array.from(skillControls,node=>()=>node.classList.remove('ss-skill-control')),
   ()=>{if(document.body.dataset.shoushaParts!==[...parts].join(' '))return;if(previous===null)document.body.removeAttribute('data-shousha-parts');else document.body.setAttribute('data-shousha-parts',previous);},
  ];
  for(const release of releases)try{release();}catch(error){console.warn('手杀对局展示释放失败',error);}
  cards.clear();decorated.clear();playerFrames.clear();skillControls.clear();ornaments.clear();identities.clear();
 };
}
