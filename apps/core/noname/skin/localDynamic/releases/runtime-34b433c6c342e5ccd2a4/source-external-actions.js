// A separate source sprite temporarily replaces the primary's drawing only.
// Its primary/background clocks remain alive. One owner governs both pending
// loads and active tracks, so stale completions cannot reveal a newer action.
export function createExternalActionController({load,setPrimaryHidden}){
 let active,closed=false;
 function finish(ticket,reason){
  if(ticket.finished)return;
  ticket.finished=true;
  if(ticket.layer)ticket.layer.visible=false;
  if(active===ticket){active=null;setPrimaryHidden(false);}
  ticket.onFinished?.(reason);
 }
 function stop(){if(active)finish(active,'interrupted');}
 return{
  async play(action,onFinished){
   if(closed)return false;
   stop();const ticket={onFinished};active=ticket;
   try{
    const layer=await load(action);
    if(closed||active!==ticket||ticket.finished)return false;
    const animations=layer.skeleton.data.animations;
    const name=action.animation??animations[0]?.name;
    if(!name||!animations.some(a=>a.name===name))throw Error('源动作不存在：'+name);
    ticket.layer=layer;layer.sourceLayer=action.actionLayer;
    layer.state.clearTracks();layer.skeleton.setToSetupPose();
    const track=layer.state.setAnimation(0,name,false);track.mixDuration=0;track.timeScale=action.actionLayer.playback.speed;
    track.listener={complete:()=>finish(ticket,'completed'),interrupt:()=>finish(ticket,'interrupted'),end:()=>finish(ticket,'interrupted')};
    layer.visible=true;setPrimaryHidden(true);return true;
   }catch(error){if(closed||ticket.finished)return false;finish(ticket,'failed');throw error;}
  },
  stop,
  dispose(){closed=true;stop();},
  get active(){return active?.layer||null;}
 };
}
