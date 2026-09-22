import { subscribePresentation } from 'noname';
import { createAnimationRenderer } from './animation-renderer.js';
import { spine } from './vendor/spine.js';
const cards={sha:'heisha',shan:'shan',tao:'tao',jiu:'jiu',wuxie:'wuxiekeji',wuzhong:'wuzhongshengyou',guohe:'guohechaiqiao',shunshou:'shunshouqianyang',nanman:'nanmanruqin',wanjian:'wanjianqifa',taoyuan:'taoyuanjieyi',wugu:'wugufengdeng',huogong:'huogong',tiesuo:'tiesuolianhuan',lebu:'lebusishu',bingliang:'bingliangcunduan',shandian:'shandian'};
const sounds=new Set(['game_start_shousha','hpLossSund','ss_dead','SkillBtn','BtnSure','card_click','xianding','juexing','shiming','guohechaiqiao','shunshouqianyang','huogong','juedou','nanmanruqin','wanjianqifa','wuxiekeji','taoyuanjieyi','shandian']);
export function mountAnimations({base,parts,options,metadata,enabled,volume}) {
 const {AnimationPlayer}=createAnimationRenderer(spine),audio=new Set(),loads=new Map(),pending=new Set(),targets=new Map();
 let disposed=false,renderer,failed=false,resultNode;
 function destroy(){if(!renderer)return;const current=renderer;renderer=undefined;cancelAnimationFrame(current.requestId);current.canvas.remove();for(const release of [()=>current.stopSpineAll(),()=>current.spine.assetManager?.dispose?.(),()=>current.spine.shader?.dispose?.(),()=>current.spine.batcher?.dispose?.(),()=>current.gl?.getExtension('WEBGL_lose_context')?.loseContext()])try{release();}catch(error){console.warn('动画释放失败',error);}}
 function sound(name){
  if(disposed||options.sound===false||!sounds.has(name)||!parts.has('arena'))return;
  const node=new Audio(base+'assets/audio/'+name+'.mp3');node.volume=volume();audio.add(node);
  const stop=()=>{node.pause();node.onended=node.onerror=null;node.removeAttribute('src');audio.delete(node);};node.onended=stop;node.onerror=stop;void node.play().catch(stop);
 }
 async function play(definition,player,time){
  const def=typeof definition==='string'?{name:definition}:definition,name=def.name;
  if(disposed||failed||!enabled()||options.effects===false||!parts.has('arena'))return;
  if(!renderer){
   renderer=new AnimationPlayer(base+'assets/animation/',document.body);
   if(!renderer.gl){destroy();failed=true;throw new Error('设备无法创建 Spine 画布');}
   renderer.canvas.className='decade-animation';renderer.canvas.setAttribute('aria-hidden','true');
   const draw=renderer.render;renderer.render=function(t){if(disposed)return;try{draw.call(this,t);}catch(error){failed=true;destroy();console.warn('十周年动画绘制失败',error);}};
  }
  const current=renderer;
  if(!loads.has(name))loads.set(name,new Promise((resolve,reject)=>{
   let settled=false;
   const finish=fn=>{if(disposed||renderer!==current)try{current.spine.assetManager?.dispose?.();}catch{}if(settled)return;settled=true;clearTimeout(timer);pending.delete(cancel);fn();};
   const cancel=()=>finish(resolve),timer=setTimeout(()=>finish(()=>reject(new Error('动画加载超时：'+name))),5000);pending.add(cancel);
   current.loadSpine(name,'skel',()=>finish(resolve),()=>finish(()=>reject(new Error('动画加载失败：'+name))));
  }));
  await loads.get(name);
  if(disposed||renderer!==current||!enabled()||options.effects===false||performance.now()-time>5000)return;
  const r=player?.rect;
  const position=r?{x:r.left+r.width/2,y:innerHeight-r.top-r.height/2,scale:Math.min(r.width/180,.8)}:{scale:Math.min(innerWidth/1400,innerHeight/800)};
  return current.playSpine({...def,loop:def.loop===true},{...position,scale:position.scale*(def.scale||1)});
 }
 function syncTargets(nodes){
  const visible=new Set(enabled()&&options.effects!==false?nodes:[]);
  for(const [node,entry] of targets)if(!visible.has(node)){entry.cancelled=true;if(entry.sprite)renderer?.stopSpine(entry.sprite);targets.delete(node);}
  for(const node of visible)if(!targets.has(node)){
   const entry={cancelled:false,sprite:null};targets.set(node,entry);
   const rect=node.getBoundingClientRect();
   void play({...metadata.indicators.shousha,loop:true},{rect},performance.now()).then(sprite=>{if(entry.cancelled||disposed){if(sprite)renderer?.stopSpine(sprite);}else entry.sprite=sprite;}).catch(error=>console.warn('攻击指示保留本体选中框',error));
  }
 }
 const unsubscribe=subscribePresentation(message=>{
  if(disposed||!parts.has('arena'))return;
  let effect,sfx,player=message.player;
  switch(message.type){
   case 'start':effect='effect_youxikaishi_shousha';sfx='game_start_shousha';break;
   case 'card': {let card=cards[message.card];if(message.card==='sha'){if(message.color==='red')card='hongsha';if(message.nature.includes('fire'))card='huosha';else if(message.nature.includes('thunder'))card='leisha';else if(message.nature.includes('ice'))card='bingsha';}effect=message.card==='juedou'?'card/juedou':card?'effect_'+card:metadata.effects.card[message.card];sfx=card;break;}
   case 'skill':effect=message.awakening?'juexingji/juexingji1/juexingji':message.mission?'juexingji/juexingji1/shimingji':message.limited?'juexingji/juexingji1/xiandingji':metadata.effects.skill[message.skill]||'jineng';sfx=message.awakening?'juexing':message.mission?'shiming':message.limited?'xianding':'SkillBtn';break;
   case 'fullscreen':effect='juexingji/juexingji1/xiandingji';break;
   case 'number':if(typeof message.value==='number'&&message.value<0){effect='effect_loseHp';sfx='hpLossSund';}break;
   case 'judge':effect='effect_panding';break;
   case 'death':effect='effect_zhenwang';sfx='ss_dead';break;
   case 'result':if(enabled()&&options.effects!==false){resultNode?.remove();resultNode=document.createElement('div');resultNode.className='decade-result';resultNode.textContent=message.result===true?'胜利':message.result===false?'失败':'对局统计';document.body.append(resultNode);}break;
  }
  if(sfx)sound(sfx);
  if(effect)return play(effect,player,message.time);
 });
 return {sound,syncTargets,dispose(){disposed=true;for(const entry of targets.values())entry.cancelled=true;targets.clear();unsubscribe();for(const cancel of pending)cancel();pending.clear();destroy();for(const node of audio){node.pause();node.onended=node.onerror=null;node.removeAttribute('src');}audio.clear();loads.clear();resultNode?.remove();}};
}
