import { subscribePresentation } from 'noname';

// Attack lines are rendered by game.linexy, including old packs with "default".
// This provider only mirrors phase/deadline; it must never overlay a pink line.
export function mountIndicators({ui,game,parts,enabled}) {
 let disposed=false;
 const previous=document.body.getAttribute('data-shousha-lines');
 if(parts.has('lines'))document.body.dataset.shoushaLines='off';
 const phase=document.createElement('div');phase.className='shousha-phase';phase.hidden=true;
 let arena,timer;
 // Mirror only the engine's real deadline; do not invent a countdown or auto-play.
 const progress=document.createElement('div'),fill=document.createElement('div'),remaining=document.createElement('span');
 progress.className='shousha-progress';progress.hidden=true;progress.append(fill,remaining);
 const previousTimer=document.body.getAttribute('data-shousha-timer');
 const updateTimer=()=>{
  if(!arena?.isConnected){progress.hidden=true;return;}
  progress.hidden=!timer?.isConnected||timer.classList.contains('hidden')||timer.style.display==='none';
  if(progress.hidden)return;
  const fraction=Math.max(0,Math.min(1,1-(parseFloat(timer.fillnode?.style.top)||0)/100));
  const transform=`scaleX(${fraction})`,label=timer.popnode?.textContent||'';
  if(fill.style.transform!==transform)fill.style.transform=transform;
  // Presentation observes childList changes and calls refresh(). Replacing
  // identical text here feeds that observer again on every animation frame.
  if(remaining.textContent!==label)remaining.textContent=label;
 };
 const timerObserver=new MutationObserver(updateTimer);
 // Provider activation also runs in the lobby, before the core owns an arena.
 // Rebind the same nodes when arena/timer appear or a mode replaces them.
 function refresh(){
  if(disposed||!parts.has('arena'))return;
  if(arena!==ui.arena){
   phase.remove();progress.remove();arena=ui.arena;
   if(arena)arena.append(phase,progress);
  }
  if(timer!==ui.timer){
   timerObserver.disconnect();timer=ui.timer;
   if(timer)timerObserver.observe(timer,{subtree:true,attributes:true,childList:true,characterData:true});
  }
  if(arena&&timer)document.body.dataset.shoushaTimer='on';
  else if(previousTimer===null)document.body.removeAttribute('data-shousha-timer');
  else document.body.setAttribute('data-shousha-timer',previousTimer);
  updateTimer();
 }
 refresh();
 const labels={phaseZhunbei:'准备阶段',phaseJudge:'判定阶段',phaseDraw:'摸牌阶段',phaseUse:'出牌阶段',phaseDiscard:'弃牌阶段',phaseJieshu:'结束阶段'};
 const unsubscribe=subscribePresentation(message=>{
  if(message.type==='phase'){
   const label=labels[message.phase],mine=message.player?.seat===String(game.me?.dataset.position);
   phase.hidden=!mine||!label;if(label&&phase.textContent!==label)phase.textContent=label;
  }
  if(message.type==='result')phase.hidden=true;
 });
 const release=()=>{disposed=true;unsubscribe();timerObserver.disconnect();phase.remove();progress.remove();if(previousTimer===null)document.body.removeAttribute('data-shousha-timer');else document.body.setAttribute('data-shousha-timer',previousTimer);if(previous===null)document.body.removeAttribute('data-shousha-lines');else document.body.setAttribute('data-shousha-lines',previous);};
 release.refresh=refresh;return release;
}
