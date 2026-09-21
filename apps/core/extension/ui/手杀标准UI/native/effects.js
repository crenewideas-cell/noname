// Cold cosmetic effects load on demand without pausing the game event queue.
// Return the real APNode immediately so existing code may set complete/scale,
// or cancel a looping effect before the download finishes.
export function installDeferredEffects(animation,files) {
 if(!animation||!window.duilib?.APNode)return()=>{};
 const available=new Set(files),restores=[];
 for(const renderer of [animation,...(animation.cap?.animations||[])]) {
  const play=renderer.playSpine,stop=renderer.stopSpine,stopAll=renderer.stopSpineAll;
  const pending=new Map();let disposed=false;
  renderer.playSpine=function(input,position){
   if(!input||window.duicfg?.gameAnimationEffect===false)return play.call(this,input,position);
   const options=typeof input==='string'?{name:input}:input;
   if(this.hasSpine(options.name))return play.call(this,input,position);
   const node=options instanceof window.duilib.APNode?options:new window.duilib.APNode(options);
   node.id ??= options.id??this.BUILT_ID++;
   node.completed=true;
   const type=['skel','json'].find(type=>available.has('original/十周年UI/assets/animation/'+node.name+'.'+type));
   if(!type){console.warn('手杀标准UI：缺少可选特效',node.name);return node;}
   pending.set(node.id,node);
   this.loadSpine(node.name,type,()=>{
    if(disposed||!pending.delete(node.id))return;
    if(position?.parent&&position.parent.isConnected===false)return;
    // The original player expects a skeleton object on reused APNodes. Its
    // false completed flag tells play() to obtain a real prepared skeleton.
    node.skeleton={completed:false};this.nodes.push(node);
    try{play.call(this,node,position);}catch(error){
     const index=this.nodes.indexOf(node);if(index!==-1)this.nodes.splice(index,1);
     node.completed=true;console.warn('手杀标准UI：特效无法播放',node.name,error);
    }
   },()=>{pending.delete(node.id);console.warn('手杀标准UI：特效资源载入失败',node.name);});
   return node;
  };
  renderer.stopSpine=function(node){
   const id=typeof node==='object'?node?.id:node;
   if(pending.has(id)){const result=pending.get(id);pending.delete(id);result.completed=true;return result;}
   return node==null?null:stop.call(this,node);
  };
  renderer.stopSpineAll=function(){pending.clear();return stopAll.call(this);};
  restores.push(()=>{disposed=true;pending.clear();renderer.playSpine=play;renderer.stopSpine=stop;renderer.stopSpineAll=stopAll;});
 }
 return()=>restores.forEach(restore=>restore());
}
