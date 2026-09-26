import { lib, subscribePresentation } from 'noname';

// Source: 十周年UI/effect.js line(), using the public viewport rectangles.
export function mountIndicators({ui,game,parts,enabled}) {
 const lineEnabled=()=>enabled()&&(!lib.config.zhishixian||lib.config.zhishixian==='default');
 const svgNS='http://www.w3.org/2000/svg',lines=new Set();let frame=0,disposed=false;
 const svg=document.createElementNS(svgNS,'svg');svg.classList.add('decade-lines');svg.setAttribute('aria-hidden','true');
 const previous=document.body.getAttribute('data-decade-lines');
 if(parts.has('lines')){document.documentElement.append(svg);document.body.dataset.decadeLines=lineEnabled()?'on':'off';}
 const phase=document.createElement('div');phase.className='decade-phase';phase.hidden=true;
 if(parts.has('arena'))ui.arena.append(phase);
 // Mirror only the engine's real deadline; do not invent a countdown or auto-play.
 const progress=document.createElement('div'),fill=document.createElement('div'),remaining=document.createElement('span');
 progress.className='decade-progress';progress.hidden=true;progress.append(fill,remaining);
 const previousTimer=document.body.getAttribute('data-decade-timer');
 const updateTimer=()=>{
  const timer=ui.timer;
  progress.hidden=!timer?.isConnected||timer.classList.contains('hidden')||timer.style.display==='none';
  if(progress.hidden)return;
  const fraction=Math.max(0,Math.min(1,1-(parseFloat(timer.fillnode?.style.top)||0)/100));
  fill.style.transform=`scaleX(${fraction})`;remaining.textContent=timer.popnode?.textContent||'';
 };
 const timerObserver=new MutationObserver(updateTimer);
 if(parts.has('arena')&&ui.timer){ui.arena.append(progress);document.body.dataset.decadeTimer='on';timerObserver.observe(ui.timer,{subtree:true,attributes:true,childList:true,characterData:true});updateTimer();}
 const labels={phaseZhunbei:'准备阶段',phaseJudge:'判定阶段',phaseDraw:'摸牌阶段',phaseUse:'出牌阶段',phaseDiscard:'弃牌阶段',phaseJieshu:'结束阶段'};
 function render(time){
  frame=0;if(disposed)return;
  svg.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);
  for(const entry of lines){
   const elapsed=time-entry.start;
   if(elapsed>=729||!lineEnabled()){entry.node.remove();lines.delete(entry);continue;}
   const head=Math.min(1,elapsed/243),tail=Math.max(0,(elapsed-486)/243);
   for(const [suffix,progress]of [['1',tail],['2',head]]){
    entry.node.setAttribute('x'+suffix,entry.x1+(entry.x2-entry.x1)*progress);
    entry.node.setAttribute('y'+suffix,entry.y1+(entry.y2-entry.y1)*progress);
   }
  }
  if(lines.size)frame=requestAnimationFrame(render);
 }
 const unsubscribe=subscribePresentation(message=>{
  if(parts.has('lines')){const state=lineEnabled()?'on':'off';if(document.body.dataset.decadeLines!==state)document.body.dataset.decadeLines=state;}
  if(message.type==='phase'){
   const label=labels[message.phase],mine=message.player?.seat===String(game.me?.dataset.position);
   phase.hidden=!mine||!label;if(label&&phase.textContent!==label)phase.textContent=label;
  }
  if(message.type==='result'){phase.hidden=true;for(const entry of lines)entry.node.remove();lines.clear();}
  if(message.type!=='line'||!parts.has('lines')||!lineEnabled()||!message.player?.rect||!message.target?.rect)return;
  const from=message.player.rect,to=message.target.rect,node=document.createElementNS(svgNS,'line');
  node.setAttribute('stroke','rgb(255,220,231)');node.setAttribute('stroke-width','2.8');node.setAttribute('stroke-linecap','round');
  svg.append(node);lines.add({node,start:performance.now(),x1:from.left+from.width/2,y1:from.top+from.height/2,x2:to.left+to.width/2,y2:to.top+to.height/2});
  if(!frame)frame=requestAnimationFrame(render);
 });
 return()=>{disposed=true;unsubscribe();timerObserver.disconnect();cancelAnimationFrame(frame);lines.clear();svg.remove();phase.remove();progress.remove();if(previousTimer===null)document.body.removeAttribute('data-decade-timer');else document.body.setAttribute('data-decade-timer',previousTimer);if(previous===null)document.body.removeAttribute('data-decade-lines');else document.body.setAttribute('data-decade-lines',previous);};
}
