// Keep the existing controls and handlers; only size/place/style their DOM.
export function installAdaptiveLayout({game,ui}) {
 const arena=ui.arena;if(!arena)return()=>{};
 let disposed=false,frame=0;
 const originals=new Map();
 const save=node=>{if(!originals.has(node))originals.set(node,node.getAttribute('style'));};
 function layout(){
  frame=0;if(disposed||!arena.isConnected)return;
  const players=Array.from(arena.children).filter(node=>node.classList.contains('player')&&!node.classList.contains('minskin'));
  const width=arena.clientWidth,height=arena.clientHeight;
  if(!width||!height)return;
  const count=Number(arena.dataset.number)||players.length;
  // The suite's frame/ornaments use fixed pixel geometry. Uniform zoom keeps
  // those layers aligned and avoids stretching the avatar or its skill marks.
  const scale=Math.max(.75,Math.min(count<=4?1.65:1.3,width/(count<=4?1060:1420),height/(count<=4?620:730)));
  const positions=count<=3?[[.5,.06],[.66,.09],[.34,.09]]:
   count===4?[[.5,.06],[.81,.24],[.5,.06],[.19,.24]]:
   count===5?[[.5,.06],[.85,.33],[.66,.06],[.34,.06],[.15,.33]]:
   count===6?[[.5,.06],[.87,.36],[.76,.06],[.5,.06],[.24,.06],[.13,.36]]:
   count===7?[[.5,.06],[.89,.43],[.86,.08],[.62,.04],[.38,.04],[.14,.08],[.11,.43]]:
   [[.5,.06],[.90,.44],[.88,.08],[.69,.04],[.5,.04],[.31,.04],[.12,.08],[.10,.44]];
  let selfWidth=128*scale;
  if(count<=8)for(const player of players){
   save(player);
   const pos=Number(player.dataset.position);if(!Number.isInteger(pos))continue;
   const pw=(player.offsetWidth||128)*scale,ph=(player.offsetHeight||180)*scale;
   const own=pos===0;
   if(own)selfWidth=pw;
   const anchor=count===2?[.5,.06]:positions[pos];if(!anchor)continue;
   const right=arena.dataset.rightLayout!=='off';
   const x=own?(right?width-pw-26:26):Math.max(24,Math.min(width-pw-24,width*anchor[0]-pw/2));
   const y=own?height-ph-14:Math.max(12,Math.min(height-ph-180,height*anchor[1]));
   player.style.setProperty('zoom',String(scale));
   player.style.setProperty('left',x/scale+'px','important');
   player.style.setProperty('top',y/scale+'px','important');
   player.style.setProperty('right','auto','important');player.style.setProperty('bottom','auto','important');
  }
  arena.style.setProperty('--ss-self-width',selfWidth+'px');

  // Refresh hand spacing against the final available width after resize.
  if(game.me&&ui.handcards1)window.decadeUI?.layoutHand?.();
 }
 const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(layout);};
 const resize=new ResizeObserver(schedule);resize.observe(arena);
 const mutation=new MutationObserver(records=>{if(records.some(record=>record.type==='attributes'||record.target===arena))schedule();});
 mutation.observe(arena,{childList:true,subtree:true,attributes:true,attributeFilter:['data-position','data-number','data-right-layout']});


 document.body.classList.add('shousha-native-game');schedule();
 return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();mutation.disconnect();arena.style.removeProperty('--ss-self-width');
  for(const [node,style] of originals){if(style===null)node.removeAttribute('style');else node.setAttribute('style',style);}
 };
}
