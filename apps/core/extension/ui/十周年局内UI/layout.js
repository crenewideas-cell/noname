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
  // Source decadeLayout.css mobile seat anchors: edge seats stay at the edges.
  // Pixel top offsets scale with the fixed-size portrait; percentage offsets
  // remain relative to the arena. No player ordering or game state is changed.
  const positions=count<=3?[[.5,9],[.65,9],[.35,9]]:
   count===4?[[.5,9],[1,.18],[.5,9],[0,.18]]:
   count===5?[[.5,9],[1,.18],[.65,9],[.35,9],[0,.18]]:
   count===6?[[.5,9],[1,.18],[.725,22],[.5,9],[.275,22],[0,.18]]:
   count===7?[[.5,9],[1,-.5],[1,22],[.645,9],[.355,9],[0,22],[0,-.5]]:
   [[.5,9],[1,-.5],[1,22],[.72,9],[.5,3],[.28,9],[0,22],[0,-.5]];
  let selfWidth=128*scale;
  for(const player of players){
   save(player);
   const pos=Number(player.dataset.position);if(!Number.isInteger(pos))continue;
   const pw=(player.offsetWidth||128)*scale,ph=(player.offsetHeight||180)*scale;
   const own=pos===0;
   if(own)selfWidth=pw;
   const fraction=(pos-1)/Math.max(1,count-2);
   const anchor=count===2?[.5,9]:count>8?[.5+.42*Math.cos(Math.PI*fraction),.40-.35*Math.sin(Math.PI*fraction)]:positions[pos];if(!anchor)continue;
   const right=arena.dataset.rightLayout!=='off';
   const x=own?(right?width-pw-26:26):Math.max(24,Math.min(width-pw-24,width*anchor[0]-pw/2));
   const top=anchor[1]<0?height/2-ph/2:anchor[1]>=1?anchor[1]*scale:height*anchor[1];
   const y=own?height-ph-14:Math.max(22*scale,Math.min(height-ph-170*scale,top));
   player.style.setProperty('zoom',String(scale));
   player.style.setProperty('left',x/scale+'px','important');
   player.style.setProperty('top',y/scale+'px','important');
   player.style.setProperty('right','auto','important');player.style.setProperty('bottom','auto','important');
  }
  arena.style.setProperty('--ss-self-width',selfWidth+'px');
  arena.style.setProperty('--ss-hand-left',arena.dataset.rightLayout==='off'?selfWidth+48+'px':'9%');
  arena.style.setProperty('--ss-hand-right',arena.dataset.rightLayout==='off'?'28px':selfWidth+48+'px');

  // Refresh hand spacing against the final available width after resize.
  if(game.me&&ui.handcards1)refreshHand();
 }
 const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(()=>{try{layout();}catch(error){frame=0;console.warn('十周年布局刷新失败',error);}});};
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
