import { subscribePresentation, followPortraitEffect } from 'noname';
const cards={sha:'heisha',shan:'shan',tao:'tao',jiu:'jiu',wuxie:'wuxiekeji',wuzhong:'wuzhongshengyou',guohe:'guohechaiqiao',shunshou:'shunshouqianyang',nanman:'nanmanruqin',wanjian:'wanjianqifa',taoyuan:'taoyuanjieyi',wugu:'wugufengdeng',huogong:'huogong',tiesuo:'tiesuolianhuan',lebu:'lebusishu',bingliang:'bingliangcunduan',shandian:'shandian'};
const nationalCards={gz_guguoanbang:'effect_guguoanbang',gz_haolingtianxia:'effect_haolingtianxia',gz_kefuzhongyuan:'effect_kefuzhongyuan',gz_wenheluanwu:'effect_wenheluanwu'};
// 琉璃版 animation.js: these are arena-wide effects, not avatar animations.
const fullscreenCards={nanman:{name:'../../../标记补充/animation/effect_nanmanruqin',scale:.8},taoyuan:{name:'SS_taoyuanjieyi',scale:.8,speed:3},wanjian:{name:'../../../标记补充/animation/effect_wanjianqifa_full',scale:.9,speed:.7,y:[0,.4]}};
export function mountBattleEffects({base,parts,config,inventory,prepare,active,enabled,volume}) {
 let metadata;
 const options={get effects(){return config.ss_effects!==false&&config.extension_十周年UI_gameAnimationEffect!==false;},get sound(){return config.ss_effects_sound!==false;},get indicator(){return config.extension_十周年UI_CPZS||'shoushaX';}};
 const effectRoot='original/十周年UI/assets/animation/';
 const assetPath=name=>{const segments=[];for(const part of (effectRoot+name).split('/')){if(part==='..')segments.pop();else if(part!=='.')segments.push(part);}return segments.join('/');};
 const markEffect=name=>'../../../标记补充/animation/'+name;
 const hasEffect=name=>inventory.has(assetPath(name)+'.skel');
 const audio=new Set(),loads=new Map(),pending=new Set(),targets=new Map(),dying=new Map(),drinking=new Map(),specialSkills=new Map(),transients=new Map(),delayed=new Set();
 const pendingCards=[],seenCards=new WeakSet(),cardBirths=new WeakMap(),cardSprites=new Map();
 for(const card of document.querySelectorAll('#arena>.card.thrown'))seenCards.add(card);

 // Public player rectangles are viewport coordinates. The core scales body
 // for small displays, so the full-screen canvas must live outside that body.
 const overlayRoot=document.documentElement||document.body;
 let disposed=false,renderer,failed=false,over=false,skillScene,skillRequest=0;
 function later(callback,delay){const timer=setTimeout(()=>{delayed.delete(timer);if(!disposed)callback();},delay);delayed.add(timer);}
 function destroy(){clearSkill();if(!renderer)return;const current=renderer;renderer=undefined;cancelAnimationFrame(current.requestId);current.canvas.remove();for(const release of [()=>current.stopSpineAll(),()=>current.spine.assetManager?.dispose?.(),()=>current.spine.shader?.dispose?.(),()=>current.spine.batcher?.dispose?.(),()=>current.gl?.getExtension('WEBGL_lose_context')?.loseContext()])try{release();}catch(error){console.warn('动画释放失败',error);}}
 function sound(name){
  if(disposed||over||!active()||!enabled()||!options.effects||options.sound===false||!parts.has('arena'))return;
  const file=['original/标记补充/audio/','original/十周年UI/audio/'].map(root=>root+name+'.mp3').find(file=>inventory.has(file));if(!file)return;
  const node=new Audio(base+file);node.volume=volume();audio.add(node);
  const stop=()=>{node.pause();node.onended=node.onerror=null;node.removeAttribute('src');audio.delete(node);};node.onended=stop;node.onerror=stop;void node.play().catch(stop);
 }
 async function play(definition,player,time,anchor){
  const def=typeof definition==='string'?{name:definition}:definition,name=def.name;
  if(!hasEffect(name))return;
  if(disposed||over||failed||!active()||!enabled()||options.effects===false||!parts.has('arena'))return;
  const {classes,data}=await prepare();metadata=data;
  if(disposed||!active()||!enabled()||!options.effects)return;
  if(!renderer){
   renderer=new classes.AnimationPlayer(base+effectRoot,overlayRoot);
   if(!renderer.gl){destroy();failed=true;throw new Error('设备无法创建 Spine 画布');}
   renderer.canvas.className='ss-battle-animation';renderer.canvas.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:10002;pointer-events:none';renderer.canvas.setAttribute('aria-hidden','true');
   const draw=renderer.render;renderer.render=function(t){if(disposed)return;try{const ratio=this.dprAdaptive?Math.max(devicePixelRatio||1,1):1;if(this.canvas.width!==Math.floor(this.canvas.clientWidth*ratio)||this.canvas.height!==Math.floor(this.canvas.clientHeight*ratio))this.resized=false;if(!active()||!enabled()||!options.effects){clearSkill();this.stopSpineAll();}skillScene?.resize();draw.call(this,t);}catch(error){failed=true;destroy();console.warn('手杀动画绘制失败',error);}};
  }
  const current=renderer;
  if(!loads.has(name))loads.set(name,new Promise((resolve,reject)=>{
   let settled=false;
   const finish=fn=>{if(disposed||renderer!==current)try{current.spine.assetManager?.dispose?.();}catch{}if(settled)return;settled=true;clearTimeout(timer);pending.delete(cancel);fn();};
   const cancel=()=>finish(resolve),timer=setTimeout(()=>finish(()=>reject(new Error('动画加载超时：'+name))),5000);pending.add(cancel);
   current.loadSpine(name,'skel',()=>finish(resolve),()=>finish(()=>reject(new Error('动画加载失败：'+name))));
  }));
  try{await loads.get(name);}catch(error){loads.delete(name);throw error;}
  if(disposed||over||renderer!==current||!active()||!enabled()||options.effects===false||performance.now()-time>5000)return;
  const r=player?.rect;
  const axis=(v,size)=>Array.isArray(v)?v[0]+v[1]*size:typeof v==='number'?v:size/2;
  if(anchor&&!anchor.isConnected)return;
  const position=anchor?{parent:anchor,follow:true,x:def.x,y:def.y,scale:r.width/(def.referenceWidth||180)}:
   r?{x:r.left+axis(def.x,r.width),y:innerHeight-r.top-r.height+axis(def.y,r.height),scale:Math.min(r.width/180,.8)}:
   {x:def.x,y:def.y,scale:Math.min(innerWidth/1400,innerHeight/800)};
  const sprite=current.playSpine({...def,loop:def.loop===true},{...position,angle:def.angle,scale:position.scale*(def.scale||1)});
  return sprite&&anchor&&def.loop===true?followPortraitEffect(sprite,anchor,def.scale||1,def.referenceWidth||180):sprite;
 }
 function clearSkill(expected=skillScene){
  if(!expected||expected!==skillScene)return;
  skillScene=undefined;clearTimeout(expected.timer);expected.root.remove();expected.title.remove();
  expected.host?.classList.remove('ss-fullscreen-replaced');
  if(expected.sprite&&!expected.sprite.completed)renderer?.stopSpine(expected.sprite);
 }
 async function loadPortrait(background){
  // setPortraitBackground writes several CSS url() layers (skin, original,
  // fallback). A whole-background regexp turns that list into an invalid URL.
  // Keep commas/parentheses inside quoted or data URLs intact, and decode CSS
  // escapes before assigning an individual URL to Image.src.
  const urls=[...String(background||'').matchAll(/url\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^)]*?))\s*\)/gi)].map(match=>(match[1]??match[2]??match[3]).replace(/\\([\da-f]{1,6}\s?|\r\n|[\s\S])/gi,(_,value)=>{
   if(/^[\da-f]/i.test(value)){const code=parseInt(value,16);return String.fromCodePoint(code>0&&code<=0x10ffff?code:0xfffd);}
   return /[\r\n\f]/.test(value)?'':value;
  })).filter(Boolean);
  const cancels=new Set();
  // Load the layers together, then prefer the first working layer just as CSS
  // does. A missing optional skin must not discard a valid original portrait.
  const jobs=[...new Set(urls)].map(src=>new Promise(resolve=>{
   const image=new Image();let settled=false;
   const finish=ok=>{if(settled)return;settled=true;clearTimeout(timer);pending.delete(cancel);cancels.delete(cancel);image.onload=image.onerror=null;if(!ok)image.removeAttribute('src');resolve(ok?image.src:null);};
   const cancel=()=>finish(false),timer=setTimeout(cancel,2500);pending.add(cancel);cancels.add(cancel);
   image.onload=()=>finish(image.naturalWidth>0);image.onerror=cancel;image.src=src;
  }));
  try{for(const job of jobs){const src=await job;if(src)return `url(${JSON.stringify(src)})`;}}
  finally{for(const cancel of cancels)cancel();}
  return null;
 }
 async function showSkill(message,kind='limited'){
  if(disposed||over||failed||!enabled()||!options.effects)return;
  // The source's three skill skeletons contain a frame, not a portrait slot.
  // Compose the public main/vice artwork with that frame; never guess an
  // unrevealed character or play an empty frame while its image is loading.
  const source=message.avatarSide==='vice'?message.player?.avatar2:message.player?.avatar;
  const request=++skillRequest;
  const background=await loadPortrait(source);
  if(!background||disposed||over||request!==skillRequest||!active())return;
  const awakening=kind==='awakening';
  const sprite=await play({name:awakening?'juexingji':kind==='mission'?'shimingji':'xiandingji',speed:1.2,hideSlots:['heidi']},null,message.time);
  if(!sprite)return;
  if(disposed||over||request!==skillRequest){renderer?.stopSpine(sprite);return;}
  clearSkill();
  const root=document.createElement('div');root.className='ss-battle-skill';root.dataset.kind=kind;root.setAttribute('aria-hidden','true');
  const stage=document.createElement('div');stage.className='ss-battle-skill-stage';root.append(stage);
  const portrait=document.createElement('div');portrait.className='ss-battle-skill-portrait';portrait.style.backgroundImage=background;stage.append(portrait);
  // Artwork is below the flame canvas; the skill lettering stays above it.
  const title=document.createElement('div');title.className='ss-battle-skill-stage ss-battle-skill-title';title.dataset.kind=kind;title.setAttribute('aria-hidden','true');
  const label=document.createElement('div');label.className='ss-battle-skill-label';label.textContent=String(message.label||'').replace(/<[^>]*>/g,'');title.append(label);
  // All three layers use one viewport scale, outside the game's body zoom.
  // The fixed-size black Spine slot is replaced by a viewport-sized backdrop,
  // so ultrawide screens and window resizing cannot expose its rectangular edge.
  const resize=()=>{
   const scale=Math.min(innerWidth/900,innerHeight/500);
   stage.style.transform=title.style.transform=`scale(${scale})`;
   sprite.x=innerWidth/2;sprite.y=innerHeight/2+(awakening?11.5*scale:0);sprite.scale=scale*(awakening?.8:1);
  };
  const host=message.presentationId?document.querySelector(`[data-presentation-fullscreen="${CSS.escape(message.presentationId)}"]`):null;
  const duration=(sprite.skeleton.data.findAnimation(sprite.action||sprite.skeleton.defaultAction)?.duration||2.5)/1.2*1000;
  const scene={root,title,sprite,host,resize,timer:undefined};skillScene=scene;
  for(const layer of [root,title])layer.style.setProperty('--ss-skill-duration',duration+'ms');resize();overlayRoot.append(root,title);
  // Only suppress the matching host visual after both art and Spine are ready.
  // The host continues to own the action, replay and game delay.
  host?.classList.add('ss-fullscreen-replaced');
  sprite.oncomplete=()=>clearSkill(scene);
  scene.timer=setTimeout(()=>clearSkill(scene),duration+100);
 }
 function pulseHealth(message){
  const kind=message.health?.kind;if(!['damage','recover'].includes(kind)||message.health.unreal||message.health.value<=0)return;
  const player=[...document.querySelectorAll('#arena>.player')].find(node=>String(node.dataset.position)===message.player?.seat);
  const gems=[...(player?.node?.hp?.children||[])].filter(node=>node.getClientRects().length);
  const count=Math.min(gems.length,Math.max(0,message.health.value));
  const candidates=gems.filter(node=>node.classList.contains('lost')===(kind==='damage'));
  const shown=kind==='damage'?candidates.slice(0,count):candidates.slice(-count);
  for(const gem of shown)void play({name:kind==='damage'?'skeletonxHp':'skeleton',action:'animation',scale:kind==='damage'?.56:.4,referenceWidth:14},{rect:gem.getBoundingClientRect()},message.time,gem).catch(error=>console.warn('勾玉动效加载失败',error));
 }
 async function steal(message){
  const from=message.target?.rect,to=message.player?.rect;if(!from||!to)return;
  const sprite=await play({name:markEffect('shunshouqianyang'),action:'yang',loop:true,scale:.65},message.target,message.time);
  if(!sprite||disposed)return;
  const x=to.left+to.width/2,y=to.top+to.height/2,dx=from.left+from.width/2-x,dy=from.top+from.height/2-y;
  sprite.rotateTo((Math.atan2(dy,dx)-Math.PI/2)*180/Math.PI);
  sprite.moveTo(x,innerHeight-y,1000);
  const rope=document.createElement('img');rope.src=base+'original/标记补充/image/sheng.png';rope.alt='';
  rope.style.cssText=`position:fixed;pointer-events:none;z-index:10001;left:${x}px;top:${y}px;width:${Math.hypot(dx,dy)}px;height:6px;transform-origin:0 50%`;
  overlayRoot.append(rope);
  rope.animate([{transform:`rotate(${Math.atan2(dy,dx)}rad) scaleX(1)`},{transform:`rotate(${Math.atan2(dy,dx)}rad) scaleX(0)`}],{duration:1000,easing:'ease',fill:'forwards'});
  const timer=setTimeout(()=>{renderer?.stopSpine(sprite);rope.remove();transients.delete(rope);},1100);transients.set(rope,timer);
 }
 function killPortraits(message){
  if(!enabled()||options.effects===false||!message.source?.avatar||!message.player?.avatar||message.source.seat===message.player.seat)return;
  const root=document.createElement('div');root.className='ss-battle-kill';root.setAttribute('aria-hidden','true');
  const child=(parent,name,avatar)=>{const node=document.createElement('div');node.className=name;if(avatar)node.style.backgroundImage=avatar;parent.append(node);return node;};
  child(child(root,'killer-warpper'),'killer',message.source.avatar);
  const back=child(child(root,'victim'),'back');child(back,'part1',message.player.avatar);child(back,'part2',message.player.avatar);
  overlayRoot.append(root);transients.set(root,setTimeout(()=>{root.remove();transients.delete(root);},3000));return true;
 }
 function syncLoop(nodes,entries,definition){
  const visible=new Set(!over&&active()&&parts.has('arena')&&enabled()&&options.effects!==false?nodes:[]);
  for(const [node,entry] of entries)if(!visible.has(node)){entry.cancelled=true;if(entry.sprite)renderer?.stopSpine(entry.sprite);entries.delete(node);}
  for(const node of visible)if(!entries.has(node)){
   const entry={cancelled:false,sprite:null};entries.set(node,entry);
   const rect=node.getBoundingClientRect();
   void play({...definition,loop:true},{rect},performance.now(),node).then(sprite=>{if(entry.cancelled||disposed){if(sprite)renderer?.stopSpine(sprite);}else if(sprite)entry.sprite=sprite;else entries.delete(node);}).catch(error=>{entries.delete(node);console.warn('循环动效保留本体提示',error);});
  }
 }
 const indicators={shousha:{name:'aar_chupaizhishi',scale:.8,x:[0,.6]},shoushaX:{name:'aar_chupaizhishiX',scale:.6,speed:1.2,x:[0,.6]}};
 for(const name of ['jiangjun','weijiangjun','cheqijiangjun','biaoqijiangjun','dajiangjun','dasima'])indicators[name]={name:'SF_xuanzhong_eff_'+name,scale:name==='biaoqijiangjun'?.5:.6};
 const syncTargets=nodes=>syncLoop(!parts.has('lines')||['off','none'].includes(options.indicator)?[]:nodes,targets,indicators[options.indicator]||indicators.shoushaX);
 const syncDying=nodes=>syncLoop(nodes,dying,{name:'SS_jiuwo',scale:.85});
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
 const unsubscribe=subscribePresentation(async message=>{
  if(disposed||!active()||!parts.has('arena'))return;
  if(message.type==='result'){over=true;++skillRequest;clearSkill();renderer?.stopSpineAll();syncTargets([]);syncDying([]);syncDrinking([]);return;}
  if(over)return;
  // Record before awaiting resources: skill and fullscreen arrive separately.
  // The explicit fullscreen flag avoids a timing-based duplicate animation.
  const special=message.awakening?'awakening':message.mission?'mission':message.limited?'limited':null;
  if(message.type==='skill'&&special)specialSkills.set(message.player?.seat,{message,kind:special});
  const previous=message.type==='fullscreen'?specialSkills.get(message.player?.seat):null;
  const fullscreenKind=previous&&message.time-previous.message.time<1500&&[previous.message.label,previous.message.animationLabel].includes(message.label)?previous.kind:'limited';
  if(message.type==='fullscreen')specialSkills.delete(message.player?.seat);
  const prepared=await prepare();metadata=prepared.data;if(disposed||over||!active())return;
  let effect,extraEffect,sfx,player=message.player;
  switch(message.type){
   case 'start':effect='effect_youxikaishi_shousha';sfx='game_start_shousha';break;
   case 'card': {
    let card=cards[message.card];
    if(message.card==='sha'){if(message.color==='red')card='hongsha';if(message.nature.includes('fire'))card='huosha';else if(message.nature.includes('thunder'))card='leisha';else if(message.nature.includes('ice'))card='bingsha';else if(message.nature.includes('kami'))card='shesha';}
    // The source has ice card art but no effect_bingsha skeleton. Retain its
    // red/black slash effect for natures without a dedicated animation.
    if(message.card==='sha'&&!hasEffect('effect_'+card))card=message.color==='red'?'hongsha':'heisha';
    let local=metadata.effects.card[message.card]||(message.card==='juedou'?{name:'../../../标记补充/animation/SSZBB_DDZ_eff_juedou'}:card?{name:'effect_'+card}:undefined);
    if(message.damage&&message.action!=='respond')void play({name:markEffect('aar_longxingzhixiang'),speed:.5,scale:.6},message.player,message.time).catch(error=>console.warn('出牌指示加载失败',error));
    if(message.cardType==='equip')void play({name:markEffect('zbwq'),scale:.6},message.player,message.time).catch(error=>console.warn('装备扫光加载失败',error));
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
    sfx=message.card==='nanman'?'effect_nanmanruqin':message.card==='wanjian'?'effect_wanjianqifa_full':message.card==='juedou'?'juedou':card;
    break;
   }
   case 'skill': {
    const delayed={lebu:{name:'SS_lebusishu',scale:.4},bingliang:{name:'SS_bingliangcunduan',scale:.5}};
    if(special){if(!message.fullscreen)void showSkill(message,special).catch(error=>console.warn('技能原画动效加载失败，保留本体提示',error));}
    else effect=delayed[message.skill]||metadata.effects.skill[message.skill]||{name:'effect_jineng_SS_1',scale:1.2,x:[-100,0],y:[-100,0]};
    extraEffect={name:'baikuang',speed:1.2,scale:.6};
    sfx=message.awakening?'juexing':message.mission?'shiming':message.limited?'xianding':'SkillBtn';
    if(!message.awakening&&!message.mission&&!message.limited&&!metadata.effects.skill[message.skill])void play({name:'effect_jineng_SS_2',speed:2,scale:1,x:[-15,.5]},player,message.time).catch(error=>console.warn('技能扫光加载失败',error));
    break;
   }
   case 'fullscreen':return showSkill(message,fullscreenKind);
   case 'number': {
    pulseHealth(message);
    // The core supplies the cause and public amount. A skin cannot infer
    // damage/HP loss from a negative popup or rerun armor/recovery rules.
    const health=message.health,n=health?.value;
    if(health?.kind==='damage'&&health.sourced&&Number.isFinite(n)&&n>=3){const name=n===3?'diankuangtulu':'wanjunqushou';sound('ss_'+name);void play({name:markEffect(name),scale:.7,speed:n===3?.8:1.15},null,message.time).catch(error=>console.warn('伤害成就动画失败',error));}
    if(health?.kind==='damage'&&message.value<0){const actions=message.nature==='thunder'?['play5','play6']:message.nature==='fire'?['play3','play4']:['play1','play2'];extraEffect={name:'effect_shoujidonghua',action:actions[message.value<=-2?1:0],scale:.8};}
    if(health?.kind==='recover'&&message.value>0)extraEffect={name:'effect_zhiliao',scale:.7};
    if(health?.kind==='loseHp'&&n>0){effect={name:markEffect('effect_loseHp'),scale:.6,speed:.8};sfx='SZN_loseHp';}
    else if(Number.isInteger(n)&&n<=9){
     if(health?.kind==='recover'&&n>=1)effect={name:'shuzi2',action:String(n),speed:.6,scale:.5,y:20};
     else if(health?.kind==='damage'&&!health.unreal&&n>1)effect={name:markEffect('shuzi'),action:String(n),speed:.8,scale:.6};
    }
    break;
   }
   case 'judge':effect={name:'effect_panding_SS',action:message.effective?'play4':'play5'};break;
   case 'phase':if(message.phase==='phaseZhunbei')effect={name:markEffect('huihekaishi'),scale:.6};break;
   case 'conversion':effect={name:'SS_zhuanhuanji',scale:.6};break;
   case 'cardTarget': {
    if(!message.target)return;
    player=message.target;
    if(message.card==='guohe'&&message.player?.seat!==player.seat){
     effect={name:'../../../标记补充/animation/effect_guohechaiqiao',action:'zizouqi_guohechaiqiao_futou',scale:.8};
     extraEffect={name:'../../../标记补充/animation/effect_guohechaiqiao',action:'zizouqi_guohechaiqiao_qiao',scale:.8};sfx='guohechaiqiao';
    }else if(message.card==='shunshou'){
     sfx='shunshouqianyang';void steal(message).catch(error=>console.warn('顺手牵羊动效失败',error));
    }
    break;
   }
   case 'recoveryAchievement': {
    let index=0;for(const achievement of message.achievements||[]){
     const name={recovery:'Xmiaoshouhuichun',rescue:'Xyishugaochao'}[achievement];if(!name)continue;
     const show=()=>{sound('ss_'+name.slice(1));void play({name:markEffect(name),scale:.68,y:[0,.52],speed:.8},null,performance.now()).catch(error=>console.warn('治疗成就动画失败',error));};
     if(index++)later(show,2200);else show();
    }
    break;
   }
   case 'death': {
    effect='SS_zhenwang';sfx='ss_dead';
    if(message.source&&message.source.seat!==message.player?.seat){
     const portraits=killPortraits(message);
     // The host supplies the authoritative cumulative count. A skin never
     // increments it, so remounting cannot reset or duplicate achievements.
     const count=Number.isInteger(message.kills)&&message.kills>0?Math.min(message.kills,7):0;
     if(count){
      const show=()=>{
      const action='play'+count;
      const soundName=['yipo','shuanglian','sanlian','silian','wulian','liulian','qilian'][count-1];
      const time=performance.now();
      void play({name:markEffect('shoushajisha'),action,scale:.8},null,time).catch(error=>console.warn('击杀成就动画失败',error));
      sound('a_'+soundName);
      };if(portraits)later(show,3000);else show();
     }
     if(message.source.avatar&&message.player?.avatar){
      void play({name:'effect_jisha1',scale:1.2},null,message.time).catch(error=>console.warn('击杀动画失败',error));sound('kill_effect_sound');
     }
    }
    break;
   }

  }
  if(message.type==='card'&&nationalCards[message.card]){effect='../../../标记补充/animation/'+nationalCards[message.card];sfx=nationalCards[message.card];player=null;}
  if(sfx)sound(sfx);
  if(effect||extraEffect)return Promise.all([extraEffect,effect].filter(Boolean).map(def=>play(def,player,message.time)));
 });
 return {sound,syncTargets,syncDying,syncDrinking,syncCards,dispose(){disposed=true;pendingCards.length=0;for(const entry of cardSprites.values())entry.cancelled=true;cardSprites.clear();for(const timer of delayed)clearTimeout(timer);delayed.clear();for(const [node,timer] of transients){clearTimeout(timer);node.remove();}transients.clear();for(const entries of [targets,dying,drinking]){for(const entry of entries.values())entry.cancelled=true;entries.clear();}specialSkills.clear();unsubscribe();for(const cancel of pending)cancel();pending.clear();destroy();for(const node of audio){node.pause();node.onended=node.onerror=null;node.removeAttribute('src');}audio.clear();loads.clear();}};
}
