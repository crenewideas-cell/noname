// Keep the existing controls and handlers; only size/place/style their DOM.
export function installAdaptiveLayout({game,ui,className='shousha-native-game',refreshHand=()=>ui.updatehl?.()}) {
 const arena=ui.arena;if(!arena)return()=>{};
 let disposed=false,frame=0;
 const originals=new Map();
 const properties=['zoom','left','top','right','bottom'];
 const save=node=>{if(!originals.has(node)){originals.set(node,properties.map(key=>[key,node.style.getPropertyValue(key),node.style.getPropertyPriority(key)]));resize.observe(node);}};
 const restore=node=>{resize.unobserve(node);for(const [key,value,priority] of originals.get(node)||[]){if(value)node.style.setProperty(key,value,priority);else node.style.removeProperty(key);}originals.delete(node);};
 function layout(){
  frame=0;if(disposed||!arena.isConnected)return;
  const players=Array.from(arena.children).filter(node=>node.classList.contains('player')&&!node.classList.contains('minskin'));
  const width=arena.clientWidth,height=arena.clientHeight;
  if(!width||!height)return;
  const count=Number(arena.dataset.number)||players.length;
  for(const player of originals.keys())if(!players.includes(player))restore(player);
  // The suite's frame/ornaments use fixed pixel geometry. Uniform zoom keeps
  // those layers aligned and avoids stretching the avatar or its skill marks.
  const scale=Math.max(.5,Math.min(count<=4?1.65:1.3,width/(count<=4?1060:count>8?Math.ceil((count-1)/2)*165:1420),height/(count<=4?620:730)));
  // Source: 十周年UI/decadeLayout.css, data-layout="mobile" (手杀).
  // Edge seats sit at the arena edges; upper seats use the original fractions
  // and pixel offsets. Only viewport scaling is applied to those coordinates.
  const positions=count===2?[null,[.5,9]]:
   count===3?[null,[.675,9],[.325,9]]:
   count===4?[null,['right','side'],[.5,9],['left','side']]:
   count===5?[null,['right','side'],[.65,9],[.35,9],['left','side']]:
   count===6?[null,['right','side'],[.725,22],[.5,9],[.275,22],['left','side']]:
   count===7?[null,['right','middle'],['right',22],[.645,9],[.355,9],['left',22],['left','middle']]:
   [null,['right','middle'],['right',22],[.72,9],[.5,3],[.28,9],['left',22],['left','middle']];
  let selfWidth=128*scale;
  for(const player of players){
   save(player);
   const pos=Number(player.dataset.position);if(!Number.isInteger(pos))continue;
   const pw=(player.offsetWidth||128)*scale,ph=(player.offsetHeight||180)*scale;
   const own=pos===0;
   if(own)selfWidth=pw;
   const fraction=(pos-1)/Math.max(1,count-2);
   const anchor=count>8?[.5+.42*Math.cos(Math.PI*fraction),height*(.40-.35*Math.sin(Math.PI*fraction))/scale]:positions[pos];if(!own&&!anchor)continue;
   const right=arena.dataset.rightLayout!=='off';
   const x=own?(right?width-pw-30*scale:25*scale):anchor[0]==='left'?0:anchor[0]==='right'?width-pw:width*anchor[0]-pw/2;
   const y=own?height-ph-height*.01:anchor[1]==='side'?height*.18:anchor[1]==='middle'?height*.5-ph/2:anchor[1]*scale;
   player.style.setProperty('zoom',String(scale));
   player.style.setProperty('left',x/scale+'px','important');
   player.style.setProperty('top',y/scale+'px','important');
   player.style.setProperty('right','auto','important');player.style.setProperty('bottom','auto','important');
  }
  arena.style.setProperty('--ss-self-width',selfWidth+'px');
  // Source right-hand layout starts at 165 - 72 pixels. Account for the
  // host card's existing 14px inset without replacing its spacing algorithm.
  arena.style.setProperty('--ss-hand-left',arena.dataset.rightLayout==='off'?selfWidth+48+'px':Math.max(12,93*scale-14)+'px');
  arena.style.setProperty('--ss-hand-right',arena.dataset.rightLayout==='off'?'28px':selfWidth+48+'px');

  // Refresh hand spacing against the final available width after resize.
  if(game.me&&ui.handcards1)refreshHand();
 }
 const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(()=>{try{layout();}catch(error){frame=0;console.warn('手杀布局刷新失败',error);}});};
 const resize=new ResizeObserver(schedule);resize.observe(arena);
 const mutation=new MutationObserver(records=>{if(records.some(record=>record.type==='attributes'||record.target===arena))schedule();});
 mutation.observe(arena,{childList:true,subtree:true,attributes:true,attributeFilter:['data-position','data-number','data-right-layout']});


 const hadClass=document.body.classList.contains(className);
 document.body.classList.add(className);schedule();
 return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();mutation.disconnect();for(const key of ['--ss-self-width','--ss-hand-left','--ss-hand-right'])arena.style.removeProperty(key);
  for(const node of originals.keys())restore(node);
  if(!hadClass)document.body.classList.remove(className);
 };
}
