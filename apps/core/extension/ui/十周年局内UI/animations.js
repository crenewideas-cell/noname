import { subscribePresentation, followPortraitEffect, mountBattleAudio } from 'noname';
import { createAnimationRenderer } from './animation-renderer.js';
import { spine } from './vendor/spine.js';
const cards={sha:'heisha',shan:'shan',tao:'tao',jiu:'jiu',wuxie:'wuxiekeji',wuzhong:'wuzhongshengyou',guohe:'guohechaiqiao',shunshou:'shunshouqianyang',nanman:'nanmanruqin',wanjian:'wanjianqifa',taoyuan:'taoyuanjieyi',wugu:'wugufengdeng',huogong:'huogong',tiesuo:'tiesuolianhuan',lebu:'lebusishu',bingliang:'bingliangcunduan',shandian:'shandian'};
const nationalCards={gz_guguoanbang:'effect_guguoanbang',gz_haolingtianxia:'effect_haolingtianxia',gz_kefuzhongyuan:'effect_kefuzhongyuan',gz_wenheluanwu:'effect_wenheluanwu'};
// 琉璃版 animation.js: these are arena-wide effects, not avatar animations.
const fullscreenCards={nanman:{name:'SZN_nanmanruqin',scale:.8},taoyuan:{name:'SZN_taoyuanjieyi',scale:.9,speed:.8},wanjian:{name:'effect_wanjianqifa_full',scale:.9}};
// These achievements reuse a hard-edged full-screen wash. Suppress only
// that baked backdrop; retain lettering, characters, rings and particles.
const achievementBackdrops=new Set(['shoupo','lianpo','sanpo','sipo','wupo','liupo','qipo','wanfumodi','shenweizhengqiankun']);
export function mountAnimations({base,parts,options,metadata,enabled}) {
 const {AnimationPlayer}=createAnimationRenderer(spine),loads=new Map(),pending=new Set(),targets=new Map(),dying=new Map(),drinking=new Map(),specialSkills=new Map(),transients=new Map(),delayed=new Set();
 const pendingCards=[],seenCards=new WeakSet(),cardBirths=new WeakMap(),cardSprites=new Map();
 for(const card of document.querySelectorAll('#arena>.card.thrown'))seenCards.add(card);
 // Public player rectangles are viewport coordinates. The core scales body
 // for small displays, so the full-screen canvas must live outside that body.
 const overlayRoot=document.documentElement||document.body;
 let disposed=false,renderer,failed=false,resultNode;
 function later(callback,delay){const timer=setTimeout(()=>{delayed.delete(timer);if(!disposed)callback();},delay);delayed.add(timer);}
 function destroy(){if(!renderer)return;const current=renderer;renderer=undefined;cancelAnimationFrame(current.requestId);current.canvas.remove();for(const release of [()=>current.stopSpineAll(),()=>current.spine.assetManager?.dispose?.(),()=>current.spine.shader?.dispose?.(),()=>current.spine.batcher?.dispose?.(),()=>current.gl?.getExtension('WEBGL_lose_context')?.loseContext()])try{release();}catch(error){console.warn('动画释放失败',error);}}
 const sharedAudio=mountBattleAudio({active:()=>!disposed&&parts.has('arena'),enabled:()=>options.sound!==false});
 const sound=sharedAudio.sound;
 async function play(definition,player,time,anchor){
  const def=typeof definition==='string'?{name:definition}:definition,name=def.name;
  if(disposed||failed||!enabled()||options.effects===false||!parts.has('arena'))return;
  if(!renderer){
   renderer=new AnimationPlayer(base+'assets/animation/',overlayRoot);
   if(!renderer.gl){destroy();failed=true;throw new Error('设备无法创建 Spine 画布');}
   renderer.canvas.className='decade-animation';renderer.canvas.setAttribute('aria-hidden','true');
   const draw=renderer.render;renderer.render=function(t){if(disposed)return;try{if(this.canvas.width!==this.canvas.clientWidth||this.canvas.height!==this.canvas.clientHeight)this.resized=false;draw.call(this,t);}catch(error){failed=true;destroy();console.warn('十周年动画绘制失败',error);}};
  }
  const current=renderer;
  if(!loads.has(name))loads.set(name,new Promise((resolve,reject)=>{
   let settled=false;
   const finish=fn=>{if(disposed||renderer!==current)try{current.spine.assetManager?.dispose?.();}catch{}if(settled)return;settled=true;clearTimeout(timer);pending.delete(cancel);fn();};
   const cancel=()=>finish(resolve),timer=setTimeout(()=>finish(()=>reject(new Error('动画加载超时：'+name))),5000);pending.add(cancel);
   current.loadSpine(name,'skel',()=>finish(resolve),()=>finish(()=>reject(new Error('动画加载失败：'+name))));
  }));
  try{await loads.get(name);}catch(error){loads.delete(name);throw error;}
  if(disposed||renderer!==current||!enabled()||options.effects===false||performance.now()-time>5000)return;
  const r=player?.rect;
  const axis=(v,size)=>Array.isArray(v)?v[0]+v[1]*size:typeof v==='number'?v:size/2;
  if(anchor&&!anchor.isConnected)return;
  const position=anchor?{parent:anchor,follow:true,x:def.x,y:def.y,scale:r.width/(def.referenceWidth||180)}:
   r?{x:r.left+axis(def.x,r.width),y:innerHeight-r.top-r.height+axis(def.y,r.height),scale:Math.min(r.width/180,.8)}:
   {x:def.x,y:def.y,scale:Math.min(innerWidth/1400,innerHeight/800)};
  const hideSlots=achievementBackdrops.has(name)?[...new Set([...(def.hideSlots||[]),'renwuguang2'])]:def.hideSlots;
  const sprite=current.playSpine({...def,hideSlots,loop:def.loop===true},{...position,angle:def.angle,scale:position.scale*(def.scale||1)});
  return sprite&&anchor&&def.loop===true?followPortraitEffect(sprite,anchor,def.scale||1,def.referenceWidth||180):sprite;
 }
 function killPortraits(message){
  if(!enabled()||options.effects===false||!message.source?.avatar||!message.player?.avatar||message.source.seat===message.player.seat)return;
  const root=document.createElement('div');root.className='decade-kill';root.setAttribute('aria-hidden','true');
  const child=(parent,name,avatar)=>{const node=document.createElement('div');node.className=name;if(avatar)node.style.backgroundImage=avatar;parent.append(node);return node;};
  child(child(root,'killer-warpper'),'killer',message.source.avatar);
  const back=child(child(root,'victim'),'back');child(back,'part1',message.player.avatar);child(back,'part2',message.player.avatar);
  overlayRoot.append(root);transients.set(root,setTimeout(()=>{root.remove();transients.delete(root);},3000));return true;
 }
 function syncLoop(nodes,entries,definition){
  const visible=new Set(enabled()&&options.effects!==false?nodes:[]);
  for(const [node,entry] of entries)if(!visible.has(node)){entry.cancelled=true;if(entry.sprite)renderer?.stopSpine(entry.sprite);entries.delete(node);}
  for(const node of visible)if(!entries.has(node)){
   const entry={cancelled:false,sprite:null};entries.set(node,entry);
   const rect=node.getBoundingClientRect();
   void play({...definition,loop:true},{rect},performance.now(),node).then(sprite=>{if(entry.cancelled||disposed){if(sprite)renderer?.stopSpine(sprite);}else entry.sprite=sprite;}).catch(error=>console.warn('循环动效保留本体提示',error));
  }
 }
 const syncTargets=nodes=>syncLoop(options.indicator==='off'?[]:nodes,targets,options.indicator&&metadata.indicators[options.indicator]||{name:'aar_chupaizhishiX',scale:.6,speed:1.2,x:[0,.6]});
 const syncDying=nodes=>syncLoop(nodes,dying,{name:'SZN_jiuwo',scale:.8,y:[0,.4]});
 const syncDrinking=nodes=>syncLoop(nodes,drinking,{name:'jiubuff',scale:.5});
 function syncCards(){
  const now=performance.now();
  for(const [node,entry]of cardSprites)if(!node.isConnected||node.classList.contains('removing')){entry.cancelled=true;if(entry.sprite)renderer?.stopSpine(entry.sprite);cardSprites.delete(node);}
  for(let index=pendingCards.length-1;index>=0;index--)if(now-pendingCards[index].message.time>5000)pendingCards.splice(index,1);
  for(const node of document.querySelectorAll('#arena>.card.thrown')){
   if(seenCards.has(node)||node.classList.contains('infohidden'))continue;
   if(!cardBirths.has(node))cardBirths.set(node,now);
   const index=pendingCards.findIndex(({message})=>message.actionId&&node.node?.throw_id?String(node.node.throw_id)===message.actionId:cardBirths.get(node)>=message.time-50&&message.card===(node.dataset.cardName||node.name));
   if(index<0)continue;
   seenCards.add(node);
   const {definition,message}=pendingCards.splice(index,1)[0];
   const rect=node.getBoundingClientRect();
   const entry={cancelled:false,sprite:null};cardSprites.set(node,entry);
   void play({...definition,referenceWidth:108},{rect},message.time,node).then(sprite=>{if(entry.cancelled||disposed){if(sprite)renderer?.stopSpine(sprite);}else entry.sprite=sprite;}).catch(error=>console.warn('出牌动效加载失败',error));
  }
 }
 const unsubscribe=subscribePresentation(message=>{
  if(disposed||!parts.has('arena'))return;
  // A limited/awakening skill may also emit the host's fullscreen label.
  // Render that one public action once; never suppress a core notification.
  if(message.type==='skill'&&(message.awakening||message.mission||message.limited))specialSkills.set(message.player?.seat,message.time);
  if(message.type==='fullscreen'&&message.time-(specialSkills.get(message.player?.seat)??-Infinity)<300)return;
  let effect,extraEffect,player=message.player;
  switch(message.type){
   case 'start':effect='effect_youxikaishi_SZN';break;
   case 'card': {
    let card=cards[message.card];
    if(message.card==='sha'){if(message.color==='red')card='hongsha';if(message.nature.includes('fire'))card='huosha';else if(message.nature.includes('thunder'))card='leisha';else if(message.nature.includes('ice'))card='bingsha';else if(message.nature.includes('kami'))card='shesha';}
    let local=metadata.effects.card[message.card]||(message.card==='juedou'?{name:'card/juedou'}:card?{name:'effect_'+card}:undefined);
    if(message.card==='caochuan')local={name:'effect_caochuanjiejian'};
    if(message.card==='wanjian')local={name:'effect_wanjianqifa',scale:.78};
    if(message.card==='nanman')local=null;
    if(local){
     const entry={definition:local,message};pendingCards.push(entry);later(syncCards,0);
     // Pure virtual cards can have no physical thrown node (or the host may
     // hide the virtual card label). Still present their effect at the table.
     later(()=>{
      const index=pendingCards.indexOf(entry);if(index<0)return;
      pendingCards.splice(index,1);
      void play(local,null,message.time).catch(error=>console.warn('虚拟牌动效加载失败',error));
     },350);
    }
    effect=fullscreenCards[message.card];player=null;
    
    break;
   }
   case 'skill': {
    const delayed={lebu:{name:'SZN_lebusishu',scale:.7},bingliang:{name:'SZN_bingliangcunduan',scale:.8,y:[0,.3]}};
    const group=['wei','shu','wu','jin'].includes(player?.group)?player.group:'qun';
    effect=message.awakening?'juexingji/juexingji1/juexingji':message.mission?'juexingji/juexingji1/shimingji':message.limited?'juexingji/juexingji1/xiandingji':delayed[message.skill]||metadata.effects.skill[message.skill]||{name:'SL'+group,scale:.8};
    extraEffect={name:'baikuang',speed:1.2,scale:.6};
    
    if(!message.awakening&&!message.mission&&!message.limited&&!metadata.effects.skill[message.skill])void play({name:'effect_jineng_SZN',speed:2,scale:1,x:[0,.52]},player,message.time).catch(error=>console.warn('技能扫光加载失败',error));
    break;
   }
   case 'fullscreen':effect='juexingji/juexingji1/xiandingji';break;
   case 'number': {
    // The core supplies the cause and public amount. A skin cannot infer
    // damage/HP loss from a negative popup or rerun armor/recovery rules.
    const health=message.health,n=health?.value;
    if(health?.kind==='damage'&&health.sourced&&Number.isFinite(n)&&n>=3){const name=n===3?'wanfumodi':'shenweizhengqiankun';void play({name,scale:.7,speed:n===3?.8:1.15},null,message.time).catch(error=>console.warn('伤害成就动画失败',error));}
    if(health?.kind==='damage'&&message.value<0){const actions=message.nature==='thunder'?['play5','play6']:message.nature==='fire'?['play3','play4']:['play1','play2'];extraEffect={name:'effect_shoujidonghua',action:actions[message.value<=-2?1:0],scale:.8};}
    if(health?.kind==='recover'&&message.value>0)extraEffect={name:'effect_zhiliao',scale:.7};
    if(health?.kind==='loseHp'&&n>0){effect={name:'SZN_loseHp',scale:.6,speed:.8};}
    else if(Number.isInteger(n)&&n<=9){
     if(health?.kind==='recover'&&n>=1)effect={name:'globaltexiao/huifushuzi/shuzi2',action:String(n),speed:.6,scale:.5,y:20};
     else if(health?.kind==='damage'&&health.unreal&&n>=0)effect={name:'globaltexiao/xunishuzi/SS_PaiJu_xunishanghai',action:'play'+n,speed:.6,scale:.5,y:20};
     else if(health?.kind==='damage'&&!health.unreal&&n>1)effect={name:'globaltexiao/shanghaishuzi/SZN_shuzi',action:String(n),speed:.6,scale:.4,y:20};
    }
    break;
   }
   case 'judge':effect={name:'effect_panding',action:message.effective?'play4':'play5'};break;
   case 'conversion':effect={name:'SS_zhuanhuanji',scale:.6};break;
   case 'cardTarget': {
    if(!message.target)return;
    player=message.target;
    if(message.card==='guohe'&&message.player?.seat!==player.seat){
     effect={name:'guohechaiqiao',action:'zizouqi_guohechaiqiao_futou',scale:.8};
     extraEffect={name:'guohechaiqiao',action:'zizouqi_guohechaiqiao_qiao',scale:.8};
    }else if(message.card==='shunshou'){
     effect={name:'shunshouqianyang',action:'yangchuxian',speed:1.5,scale:.65};
     const source=message.player,definition=effect;
     later(()=>{void play(definition,source,performance.now()).catch(error=>console.warn('顺手牵羊回返动效失败',error));},600);
    }
    break;
   }
   case 'recoveryAchievement': {
    let index=0;for(const achievement of message.achievements||[]){
     const name={recovery:'qingnangjishi',rescue:'shenyimiaoshou'}[achievement];if(!name)continue;
     const show=()=>{void play({name,scale:.68,y:[0,.52],speed:.8},null,performance.now()).catch(error=>console.warn('治疗成就动画失败',error));};
     if(index++)later(show,2200);else show();
    }
    break;
   }
   case 'death': {
    effect='effect_zhenwang';
    if(message.source&&message.source.seat!==message.player?.seat){
     const portraits=killPortraits(message);
     // The host supplies the authoritative cumulative count. A skin never
     // increments it, so remounting cannot reset or duplicate achievements.
     const count=Number.isInteger(message.kills)&&message.kills>0?Math.min(message.kills,7):0;
     if(count){
      const show=()=>{
      const name=['shoupo','lianpo','sanpo','sipo','wupo','liupo','qipo'][count-1];
      const time=performance.now();
      void play({name,scale:.7,speed:.8},null,time).catch(error=>console.warn('击杀成就动画失败',error));
      if(count>1)void play({name:'qy_SF_eff_lianzhan_lv'+count+'_zi',scale:.7,speed:.8,x:[0,.9],y:[0,.15]},null,time).catch(error=>console.warn('连战动画失败',error));
      
      };if(portraits)later(show,3000);else show();
     }
     if(message.source.avatar&&message.player?.avatar){
      void play({name:'effect_jisha1',scale:1.2},null,message.time).catch(error=>console.warn('击杀动画失败',error));
     }
    }
    break;
   }
   case 'result':if(enabled()&&options.effects!==false){resultNode?.remove();resultNode=document.createElement('div');resultNode.className='decade-result';resultNode.textContent=message.result===true?'胜利':message.result===false?'失败':'对局统计';overlayRoot.append(resultNode);}break;
  }
  if(message.type==='card'&&nationalCards[message.card]){effect='card/'+nationalCards[message.card];player=null;}
  if(effect||extraEffect)return Promise.all([extraEffect,effect].filter(Boolean).map(def=>play(def,player,message.time)));
 });
 return {sound,syncTargets,syncDying,syncDrinking,syncCards,dispose(){disposed=true;pendingCards.length=0;for(const entry of cardSprites.values())entry.cancelled=true;cardSprites.clear();for(const timer of delayed)clearTimeout(timer);delayed.clear();for(const [node,timer] of transients){clearTimeout(timer);node.remove();}transients.clear();for(const entries of [targets,dying,drinking]){for(const entry of entries.values())entry.cancelled=true;entries.clear();}specialSkills.clear();unsubscribe();for(const cancel of pending)cancel();pending.clear();destroy();sharedAudio.dispose();loads.clear();resultNode?.remove();}};
}
