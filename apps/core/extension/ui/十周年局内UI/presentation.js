import { installAdaptiveLayout } from './layout.js';
import { mountAnimations } from './animations.js';
import { mountPortraits } from './portraits.js';
import { mountExtras } from './extras.js';
import { skillPresentation, subscribePresentation, openCharacterSkins, getSkinService, subscribeCharacterSkins } from 'noname';

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
 const skillPanels=new Map(),skillButtons=new Set();let passivePanel,skinButton,gallery,identityTip,tipImage;
 // A presentation-only drawer retains all core button nodes and callbacks.
 // It never pauses, changes auto-play, saves settings or invokes game actions.
 const menuButton=parts.has('buttons')?document.createElement('button'):null;
 const previousMenu=document.body.getAttribute('data-decade-menu');
 const setMenu=open=>{document.body.dataset.decadeMenu=open?'open':'closed';menuButton?.setAttribute('aria-expanded',String(open));};
 if(menuButton){menuButton.type='button';menuButton.className='decade-menu-toggle';menuButton.textContent='菜单';menuButton.setAttribute('aria-label','局内菜单');menuButton.setAttribute('aria-controls','system1 system2 game-navigation-button');menuButton.addEventListener('click',()=>setMenu(document.body.dataset.decadeMenu!=='open'));document.body.append(menuButton);setMenu(false);}
 const closeMenu=event=>{if(menuButton&&document.body.dataset.decadeMenu==='open'&&!event.target.closest?.('#system,.decade-menu-toggle'))setMenu(false);};
 if(menuButton)document.addEventListener('click',closeMenu,{passive:true});
 const layout=parts.has('arena')&&parts.has('players')&&!game.chess?installAdaptiveLayout({game:{get me(){return !!game.me;}},ui,className:'decade-layout',refreshHand:()=>ui.updatehl()}):()=>{};
 const options=manifest.components.arena?.options||{},enabled=()=>lib.config.animation!==false&&!lib.config.low_performance;
 const animations=mountAnimations({base,parts,options,metadata,enabled,volume:()=>Math.max(0,Math.min(1,(lib.config.volumn_audio||0)/8))});
 const portraits=mountPortraits({base,metadata,enabled:()=>parts.has('players')&&options.dynamic!==false&&enabled(),staticSelected:name=>lib.config.change_skin!==false&&!!getSkinService().current(name),subscribe:subscribeCharacterSkins});
 const extras=mountExtras({base,parts,ui,game,lib,inventory,metadata,animations});
 if(parts.has('buttons')){
  skinButton=document.createElement('button');skinButton.type='button';skinButton.className='decade-skin-button';skinButton.title='换肤';skinButton.setAttribute('aria-label','换肤');
  skinButton.addEventListener('click',()=>{gallery=openCharacterSkins();});document.body.append(skinButton);
 }
 if(parts.has('arena')){
  identityTip=document.createElement('details');identityTip.className='decade-identity-tip';
  const summary=document.createElement('summary');summary.textContent='?';summary.setAttribute('aria-label','身份任务');
  tipImage=document.createElement('img');identityTip.append(summary,tipImage);document.body.append(identityTip);
 }
 const badgeFile=skill=>({limited:'new_xiandingji',awakening:'new_juexingji',mission:'new_mark_duty',conversion:skill.state==='yin'?'new_mark_ying':skill.state==='yang'?'new_mark_yang':null}[skill.kind]);
 function skillBadge(parent,skill){
  const file=badgeFile(skill);if(!file)return;
  const node=document.createElement('span');node.className='decade-skill-badge';node.dataset.kind=skill.kind;node.dataset.state=skill.state;node.classList.toggle('used',skill.used);node.title=skill.label;node.setAttribute('aria-label',skill.label);
  node.style.backgroundImage=`url(${JSON.stringify(base+'assets/ui/assets/skill/yijiang/'+file+'.png')})`;parent.append(node);
 }
 function decorateSkills(){
  const me=game.me,local=skillPresentation(me,lib,!game.observe);
  if(parts.has('buttons')){
   const passive=local.filter(s=>!s.active),key=JSON.stringify(passive);
   if(!passivePanel){passivePanel=document.createElement('div');passivePanel.className='decade-passive-skills';ui.arena.append(passivePanel);}
   if(passivePanel.dataset.value!==key){passivePanel.dataset.value=key;passivePanel.replaceChildren();for(const skill of passive){const label=document.createElement('span');label.textContent=skill.label;label.title=skill.label;passivePanel.append(label);}}
   for(const control of [ui.skills,ui.skills2,ui.skills3])for(const button of control?.children||[]){
    const skill=local.find(s=>s.id===button.link),value=JSON.stringify(skill||null);
    if(button.dataset.decadeSkill===value)continue;
    skillButtons.add(button);button.dataset.decadeSkill=value;button.querySelectorAll(':scope>.decade-skill-badge').forEach(n=>n.remove());
    if(skill){button.dataset.decadeKind=skill.kind;skillBadge(button,skill);}else button.removeAttribute('data-decade-kind');
   }
  }
  if(parts.has('players'))for(const player of ui.arena.querySelectorAll(':scope>.player:not(.minskin)')){
   const state=skillPresentation(player,lib,player===me&&!game.observe).filter(s=>s.kind!=='normal'),key=JSON.stringify(state);
   let panel=skillPanels.get(player);
   if(!state.length){panel?.remove();skillPanels.delete(player);continue;}
   if(!panel){panel=document.createElement('div');panel.className='decade-skill-marks';player.append(panel);skillPanels.set(player,panel);}
   if(panel.dataset.value!==key){panel.dataset.value=key;panel.replaceChildren();state.forEach(s=>skillBadge(panel,s));}
  }
  for(const [player,panel] of skillPanels)if(!player.isConnected||player.classList.contains('minskin')){panel.remove();skillPanels.delete(player);}
  for(const button of skillButtons)if(!button.isConnected){button.querySelectorAll(':scope>.decade-skill-badge').forEach(n=>n.remove());button.removeAttribute('data-decade-skill');button.removeAttribute('data-decade-kind');skillButtons.delete(button);}
 }
 function icon(node,kind,file){
  if(!node)return;const value=inventory.has(file)?`url(${JSON.stringify(base+file)})`:null;
  if(value){if(icons.get(node)?.value!==value){node.style.setProperty('--decade-icon',value);node.classList.add('decade-'+kind);icons.set(node,{kind,value});}}
  else if(icons.has(node)){node.style.removeProperty('--decade-icon');node.classList.remove('decade-'+icons.get(node).kind);icons.delete(node);}
 }
 function decorate(){
  raf=0;if(disposed)return;
  extras.update();
  decorateSkills();
  if(identityTip){
   const label=game.me?.node?.identity?.textContent?.trim();
   const mode=lib.config.mode,variant=lib.config.mode_config?.identity?.identity_mode;
   let role={主:'zhugong',主公:'zhugong',忠:'zhongchen',忠臣:'zhongchen',反:'fanzei',反贼:'fanzei',内:'neijian',内奸:'neijian',地:'dizhu',地主:'dizhu',农:'nongmin',农民:'nongmin',魏:'weiguo',蜀:'shuguo',吴:'wuguo',群:'qunxiong',晋:'jinguo',野:'ye',猜:'weizhi'}[label];
   if(mode==='doudizhu')role={zhugong:'dizhu',fanzei:'nongmin'}[role]||role;
   // The source task artwork describes standard victory conditions only.
   // Do not mislabel purple/team/custom modes with an unrelated objective.
   const supported=mode==='doudizhu'||mode==='guozhan'||mode==='identity'&&(!variant||variant==='normal');
   const file='assets/ui/assets/lbtn/SFTS/Tip'+role+'.png',available=supported&&!!role&&inventory.has(file);
   identityTip.hidden=!available;
   if(available&&identityTip.dataset.file!==file){identityTip.dataset.file=file;tipImage.src=base+file;tipImage.alt=label+'身份任务';identityTip.open=false;}
  }
  animations.syncTargets(parts.has('lines')?[...ui.arena.querySelectorAll(':scope>.player.selectable,:scope>.player.selected,:scope>.player.target')]:[]);
  if(parts.has('players')&&!manifest.components.players?.assets?.frame)for(const player of ui.arena?.querySelectorAll(':scope>.player:not(.minskin)')||[]) {
   let frame=frames.get(player);
   if(!frame){frame=document.createElement('div');frame.className='decade-frame';frame.setAttribute('aria-hidden','true');player.append(frame);frames.set(player,frame);}
   const publicIdentity=player.node?.identity?.textContent?.trim();
   const role={主:'zhu',主公:'zhu',忠:'zhong',忠臣:'zhong',反:'fan',反贼:'fan',内:'nei',内奸:'nei',猜:'guessing',地:'dizhu',地主:'dizhu',农:'nongmin',农民:'nongmin',友:'friend',敌:'enemy',野:'ye'}[publicIdentity];
   icon(player.node?.identity,'identity','assets/image/styles/shousha/identity2_'+role+'.png');
   icon(player.marks?.ghujia,'armor','assets/image/styles/decade/shield.png');
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
   if(art){
    if(cards.get(card)!==art){cards.set(card,art);card.style.setProperty('--decade-card',`url(${JSON.stringify(art)})`);}card.classList.add('decade-card');
    const info=card.node?.info||card.querySelector(':scope>.info');
    const corner=info?.textContent.replace(/[\s\uFE0E\uFE0F]/g,'').match(/^([♠♥♣♦])(.+)$/);
    if(corner&&info.dataset.decadePoint!==corner[2]+'\n'+corner[1])info.dataset.decadePoint=corner[2]+'\n'+corner[1];
    if(!corner)info?.removeAttribute('data-decade-point');
   }
   else if(cards.delete(card)){card.classList.remove('decade-card');card.style.removeProperty('--decade-card');card.querySelector(':scope>.info')?.removeAttribute('data-decade-point');}
  }
  if(parts.has('players'))for(const dialog of document.querySelectorAll('#window .dialog')) {
   const characters=Array.from(dialog.buttons||[]).some(b=>b.classList.contains('character'));
   if(characters){dialog.classList.add('decade-characters');dialogs.add(dialog);}
   else if(dialogs.delete(dialog))dialog.classList.remove('decade-characters');
  }
  if(parts.has('buttons'))for(const node of [ui.skills,ui.skills2,ui.skills3])if(node&&!skills.has(node)){skills.add(node);node.classList.add('decade-skills');}
  if(parts.has('buttons'))for(const [node,name] of [[ui.config2,'decade-settings'],[ui.sortCard,'decade-sort'],[document.getElementById('game-navigation-button'),'decade-exit'],[document.getElementById('arena-log-toggle'),'decade-log'],[ui.chatButton,'decade-chat']])if(node instanceof HTMLElement&&!menus.has(node)){node.classList.add(name);menus.set(node,name);}
  // The core owns the pile/round count and elapsed clock. Only reformat its
  // existing text; never inspect the hidden pile, create a game timer or poll rules.
  if(parts.has('arena')){
   const pile=ui.cardPileNumber,time=ui.time3;
   if(pile){
    if(!menus.has(pile)){pile.classList.add('decade-pile');menus.set(pile,'decade-pile');}
    const value=pile.textContent.match(/^(\d+)轮\s*剩余牌:\s*(\d+)/);
    if(value){pile.dataset.decadeRound='第'+value[1]+'轮';pile.dataset.decadePile=value[2];}
   }
   if(time&&!menus.has(time)){time.classList.add('decade-time');menus.set(time,'decade-time');}
  }
  for(const [node,{kind}] of icons)if(!node.isConnected||node.closest('.player.minskin')){node.classList.remove('decade-'+kind);node.style.removeProperty('--decade-icon');icons.delete(node);}
  for(const [player,stamp] of deaths)if(!player.isConnected||player.classList.contains('minskin')){stamp.remove();deaths.delete(player);}
  for(const [player,frame] of frames)if(!player.isConnected||player.classList.contains('minskin')){frame.remove();frames.delete(player);}
  for(const card of cards.keys())if(!card.isConnected){card.classList.remove('decade-card');card.style.removeProperty('--decade-card');card.querySelector(':scope>.info')?.removeAttribute('data-decade-point');cards.delete(card);}
  for(const dialog of dialogs)if(!dialog.isConnected){dialog.classList.remove('decade-characters');dialogs.delete(dialog);}
  for(const node of skills)if(!node.isConnected){node.classList.remove('decade-skills');skills.delete(node);}
 }
 const schedule=()=>{if(!disposed&&!raf)raf=requestAnimationFrame(()=>{try{decorate();}catch(error){console.warn('十周年节点装饰失败',error);}});};
 const unsubscribe=subscribePresentation(schedule);
 const observer=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.attributeName!=='class'||r.target.matches('.card,.player')))schedule();});
 observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','data-card-name','data-nature','data-color']});schedule();
 const click=event=>{if(!parts.has('buttons'))return;const node=event.target.closest?.('#control .control:not(.disabled),#arena .card.selectable,#arena .button.selectable');if(node)animations.sound(node.matches('.card')?'card_click':'BtnSure');};
 document.addEventListener('click',click,{passive:true});
 return()=> {
  if(disposed)return;disposed=true;
  const releases=[unsubscribe,()=>observer.disconnect(),()=>cancelAnimationFrame(raf),layout,portraits,()=>extras.dispose(),()=>animations.dispose(),()=>document.removeEventListener('click',click),()=>style.remove(),
   ()=>{skinButton?.remove();gallery?.close();identityTip?.remove();passivePanel?.remove();for(const panel of skillPanels.values())panel.remove();skillPanels.clear();for(const button of skillButtons){button.querySelectorAll(':scope>.decade-skill-badge').forEach(n=>n.remove());button.removeAttribute('data-decade-skill');button.removeAttribute('data-decade-kind');}skillButtons.clear();},
   ()=>{document.removeEventListener('click',closeMenu);menuButton?.remove();if(previousMenu===null)document.body.removeAttribute('data-decade-menu');else document.body.setAttribute('data-decade-menu',previousMenu);},
   ...[...frames.values()].map(node=>()=>node.remove()),
   ...[...cards.keys()].map(node=>()=>{node.classList.remove('decade-card');node.style.removeProperty('--decade-card');node.querySelector(':scope>.info')?.removeAttribute('data-decade-point');}),
   ...[...dialogs].map(node=>()=>node.classList.remove('decade-characters')),
   ...[...deaths.values()].map(node=>()=>node.remove()),
   ...[...icons].map(([node,{kind}])=>()=>{node.classList.remove('decade-'+kind);node.style.removeProperty('--decade-icon');}),
   ...[...menus].map(([node,name])=>()=>{node.classList.remove(name);node.removeAttribute('data-decade-round');node.removeAttribute('data-decade-pile');}),
   ...[...skills].map(node=>()=>node.classList.remove('decade-skills')),
   ()=>{if(previous===null)document.body.removeAttribute('data-decade-parts');else document.body.setAttribute('data-decade-parts',previous);}];
  for(const release of releases)try{release();}catch(error){console.warn('十周年展示释放失败',error);}
  frames.clear();cards.clear();dialogs.clear();skills.clear();menus.clear();icons.clear();deaths.clear();
 };
}
