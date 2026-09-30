// Renderer for the existing Qianhuan list/portrait. No additional skin UI.
import { eventMotions } from './events.js';
import { createEffectHost } from './effect-host.js';
import { createCatalogIndex } from './catalog-index.js';
import { createThumbnailLoader, fillCardPortrait } from './thumbnails.js';
import {skinEnabled,managedSelection} from '../management.js';
import {dynamicOwners} from './assignments.js';
import {createSkinResourceCache} from './resource-cache.js';
import {dynamicPlayerURL} from './runtime-url.js';
export function readJSON(address) {
  if(!address.startsWith('file:'))return fetch(address,{signal:AbortSignal.timeout(15000)}).then(r=>{if(!r.ok)throw Object.assign(Error('读取失败 '+r.status),{status:r.status});return r.json();});
  return new Promise((resolve,reject)=>{
    const xhr=new XMLHttpRequest();xhr.open('GET',address);xhr.timeout=15000;
    xhr.onload=()=>{try{if(xhr.status!==0&&xhr.status!==200)throw Error('读取失败 '+xhr.status);resolve(JSON.parse(xhr.responseText));}catch(e){reject(e);}};
    xhr.onerror=()=>reject(Error('本地文件读取失败'));xhr.ontimeout=()=>reject(Error('本地文件读取超时'));xhr.send();
  });
}
export function install(env,packName,resourcePath='extension/'+packName+'/') {
  const {lib,game}=env,hub=game.localDynamicSkinTestHub ||= createHub(env);
  if(hub.packs[packName])return hub.packs[packName];
  const base=new URL(resourcePath,new URL(lib.assetURL||'./',document.baseURI)).href;
  const pack=hub.packs[packName]={name:packName,base,resourcePath,entries:[],byFile:new Map()};
  return pack;
}
export function createHub({lib,game,ui,_status,openCharacterSkins}) {
  const hub={version:3,packs:{},hosts:new Map(),previews:new Map(),framing:new Map()};let serial=0;const warmPreviews=[];
  const active=p=>lib.config['extension_'+p.name+'_enable']!==false;
  const current=name=>name?(game.qhly_getSkin?game.qhly_getSkin(name):managedSelection(lib.config,name)?.token||lib.config.qhly_skinset?.skin?.[name]):null;
  const interactive=p=>lib.config['extension_'+p.name+'_interaction']!==false;
  const owners=(p,e)=>dynamicOwners(lib.config,p.name,e);
  const catalog=createCatalogIndex(hub.packs,active,owners);
  const lookup=skin=>skin?catalog.read().byFile.get(skin):undefined;
  const lookupOwned=(name,skin)=>{const row=lookup(skin);return catalog.owns(name,row)?row:undefined;};
  hub.resources=createSkinResourceCache();
  hub.loadThumbnail=createThumbnailLoader(lookupOwned,hub.resources);
  hub.fillCardPortrait=fillCardPortrait;
  const isLocal=skin=>typeof skin==='string'&&(skin.startsWith('本地 · ')||skin.startsWith('localdyn_'));
  hub.owns=(name,skin)=>!!lookupOwned(name,skin);
  hub.unbound=()=>catalog.read().unbound;
  hub.invalidateCatalog=()=>catalog.invalidate();
  const filename=e=>e.skinTitle+'.png';
  const canAnimate=(name,e,node)=>skinEnabled(lib.config,name,'dynamic',e.skinTitle+'.png')&&lib.config.change_skin!==false&&lib.config.animation!==false&&!lib.config.low_performance&&!lib.config.extension_千幻聆音_qhly_decadeCloseDynamic&&(node?.dataset.qhlyPreviewDynamic==='true'||!lib.config.qhly_skinset?.djtoggle?.[name]?.[e.skinTitle]);
  const blocked=h=>h.player&&(ui.arena?.classList.contains('selecting')||h.player.classList.contains('selectable')||h.player.classList.contains('target')||_status.dragged);
  function message(frame,type,extra={}){frame?.contentWindow?.postMessage({type:'noname-skin-'+type,channel:frame.dataset.channel,...extra},'*');}
  function updateInput(h,force=false){
    if(!h.frame)return;
    const manual=h.portrait.dataset.qhlyManualInteraction;
    const enabled=((manual===undefined?false:manual==='true')||h.portrait.closest('.qh-interaction'))&&!blocked(h);
    h.tapEnabled=!!(h.player&&interactive(h.p)&&h.capabilities?.interaction?.available&&!blocked(h));
    h.node.style.pointerEvents='none';
    h.frame.style.pointerEvents=!h.player&&enabled?'auto':'none';
    const options={interactive:!!(!h.player&&enabled),volume:Math.max(0,Math.min(1,(lib.config.volumn_audio??8)/8))};
    if(force||h.input?.interactive!==options.interactive||h.input?.volume!==options.volume){h.input=options;message(h.frame,'options',options);h.portrait.dispatchEvent(new Event('qhly-preview-input'));}
  }
  hub.setPreviewInteraction=(node,value)=>{
    const h=hub.previews.get(node);if(!h?.frame)return false;
    node.dataset.qhlyManualInteraction=String(!!value);updateInput(h);return true;
  };
  function openManual(h){
    if(!h||!interactive(h.p)||blocked(h)||_status.dragged)return;
    // Reuse Qianhuan's large portrait and its existing back button.
    if(_status.qhly_open||hub.previews.size)return;
    openCharacterSkins?.(h.name,h.player,'interaction');
  }
  hub.setInteraction=(name,value)=>{
    game.saveConfig('extension_'+name+'_interaction',!!value);
    for(const h of [...hub.hosts.values(),...hub.previews.values()]){if(h.p.name===name)delete h.portrait.dataset.qhlyManualInteraction;updateInput(h);}
    if(value)openManual([...hub.hosts.values()].find(h=>h.player===game.me&&h.p.name===name));
  };
  hub.skinTable=name=>catalog.forCharacter(name).byTitle;
  hub.listSkins=name=>Object.values(hub.packs).flatMap(p=>p.entries.filter(e=>owners(p,e).includes(name)&&e.available!==false).map(e=>({name:e.title,token:e.skinTitle+'.png',path:p.resourcePath+e.thumbnail,dynamic:true,pack:p.name,id:e.id,packEnabled:active(p)})));
  hub.previewResource=(node,pack,entry)=>{
    hub.stopPreview(node);const p=hub.packs[pack];if(!p||!canAnimate('',entry,node))return false;
    const h=createHost(p,entry,node,'');h.libraryPreview=true;hub.previews.set(node,h);return true;
  };
  function wrap(name,replacement){
    const old=game[name];if(typeof old!=='function'||old._localDynamicHub===hub)return;
    const fn=replacement(old);fn._localDynamicHub=hub;game[name]=fn;
  }
  hub.integrate=()=>{
    wrap('qhly_setOriginSkin',old=>function(name,skin,node,...args){
      hub.loadThumbnail.cancel(node);
      const own=lookupOwned(name,skin);
      if(!own)return old.call(this,name,isLocal(skin)?null:skin,node,...args);
      // Imported skins use their own thumbnail in static mode. Never request a
      // native character portrait that can arrive late beneath the transparent canvas.
      if(!node.style.backgroundImage||node.style.backgroundImage==='none')node.style.backgroundImage='url('+JSON.stringify(own.p.base+own.e.thumbnail)+')';
      hub.loadThumbnail(name,skin,node);
    });
    wrap('qhly_getSkinList',old=>function(name,callback,...args){
      const run=()=>old.call(this,name,(ok,list)=>{const extra=catalog.forCharacter(name).files;callback(ok||extra.length>0,[...new Set([...(list||[]).filter(file=>!isLocal(file)||hub.owns(name,file)),...extra])].filter(file=>!old._skinManager||game.qhly_skinAllowed?.(name,file)!==false));},...args);
      if(hub.hasCharacter?.(name))return run();
      return Promise.resolve(hub.ensureCharacter?.(name)).then(run,error=>{console.warn('动态皮肤列表加载失败',error);return run();});
    });
    wrap('qhly_getSkinFile',old=>function(name,skin,...args){const own=lookupOwned(name,skin);return own?own.p.resourcePath+own.e.thumbnail:old.call(this,name,isLocal(skin)?null:skin,...args);});
    wrap('qhly_getSkinInfo',old=>function(name,skin,...args){
      const own=lookupOwned(name,skin);return own?{name:own.e.character+' · '+own.e.title,translation:own.e.skinTitle,displayName:own.e.title,info:own.p.name,level:'动态',order:own.order,skill:{}}:old.call(this,name,isLocal(skin)?null:skin,...args);
    });
    wrap('qhly_setCurrentSkin',old=>function(name,skin,callback,...args){
      if(isLocal(skin)&&!hub.hasCharacter?.(name))return Promise.resolve(hub.ensureCharacter?.(name)).then(()=>game.qhly_setCurrentSkin(name,skin,callback,...args),error=>{console.warn('动态皮肤加载失败',error);callback?.();});
      const own=lookupOwned(name,skin);if(!own){const result=old.call(this,name,isLocal(skin)?null:skin,callback,...args);hub.refresh();return result;}
      // Clear prior voice substitutions and invalidate stale selections first.
      return old.call(this,name,null,()=>{
        const config=lib.config.qhly_skinset ||= {};config.skin ||= {};config.skin[name]=filename(own.e);
        game.saveConfig('qhly_skinset',config);
        for(const listener of lib.qhly_callbackList||[])listener.onChangeSkin?.(name,filename(own.e));
        game.qhly_refresh?.(name,filename(own.e));
        hub.refresh();callback?.();
      },...args);
    });
  };
  if(!document.getElementById('local-dynamic-style')){
    const style=document.createElement('style');style.id='local-dynamic-style';style.textContent='.local-dynamic-visible{background-image:none!important}.local-dynamic-loading{position:absolute;left:50%;bottom:18%;transform:translateX(-50%);padding:5px 12px;border-radius:8px;background:#211a18b8;color:#eadcb8;font-size:14px;white-space:nowrap;pointer-events:none}.local-dynamic-effect::backdrop{background:transparent;pointer-events:none}';document.head.append(style);
  }
  function createHost(p,e,portrait,name,player,animated=true){
    const node=document.createElement('div');node.className=player?'local-dynamic-skin':'local-dynamic-preview';
    node.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:3;border-radius:inherit;background-size:contain;background-position:center;background-repeat:no-repeat;';
    // Keep a real portrait until the composed first frame is ready.
    portrait.classList.remove('local-dynamic-visible');
    if(!animated){node.style.backgroundImage='url('+JSON.stringify(p.base+e.thumbnail)+')';hub.loadThumbnail(name,filename(e),node);}
    const h={p,e,portrait,name,player,node};
    if(animated){
      hub.loadThumbnail.preview(p,e,node);
      h.loading=document.createElement('span');h.loading.className='local-dynamic-loading';h.loading.textContent='动态加载中…';node.append(h.loading);
    }
    if(animated){
      h.releasePriority=hub.loadThumbnail.prioritize(p,e);
      const start=()=>{
      if(!node.isConnected)return;
      // Pass only selected metadata to the same-origin player, not the whole catalog.
      const f=h.frame=document.createElement('iframe');f.title=e.character+' · '+e.title;f.dataset.channel='skin-'+(++serial);f.__nonameSkinEntry=e;f.__nonameSkinResources=hub.resources;
      f.src=dynamicPlayerURL(p.base,{id:e.id,channel:f.dataset.channel,interactive:Number(!player&&interactive(p)),presentation:player&&player!==game.me?'portrait':'preview'});
      f.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;background:transparent;pointer-events:none;visibility:hidden;';
      h.effectHost=f.__nonameSkinEffectHost=createEffectHost({frame:f,anchor:player||portrait,local:!!player&&player===game.me,preview:!player});
      node.append(f);f.addEventListener('load',()=>updateInput(h,true));
      };if(player)queueMicrotask(start);else h.startTimer=setTimeout(start,100);
    }else portrait.classList.add('local-dynamic-visible');
    (player||portrait).append(node);
    if(player){
      const tap=event=>{
        if(!h.tapEnabled||blocked(h)||event.button!==0||event.defaultPrevented||event.target.closest('.card,.button'))return;
        const r=h.node.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)return;
        const choices=h.capabilities.interaction.motions,command=choices[(h.tapIndex||0)%choices.length];h.tapIndex=(h.tapIndex||0)+1;
        message(h.frame,'motion',{motion:command});
      };
      player.addEventListener('click',tap,true);h.cleanupInput=()=>player.removeEventListener('click',tap,true);
    }
    updateInput(h);return h;
  }
  function dispose(h){if(h){clearTimeout(h.startTimer);h.releasePriority?.();hub.loadThumbnail.cancel(h.node);h.cleanupInput?.();h.effectHost?.dispose();h.cleanupLayout?.();message(h.frame,'options',{interactive:false});const child=h.frame?.contentWindow;if(child?.skinPlayerLifecycle)child.skinPlayerLifecycle.dispose();else child?.skinPlayer?.dispose();h.node.remove();if(!h.parked)h.portrait.classList.remove('local-dynamic-visible');}}
  function prunePreviews(){for(let i=warmPreviews.length-1;i>=0;i--){const h=warmPreviews[i];if(!h.node.isConnected||Date.now()-h.parkedAt>45000){warmPreviews.splice(i,1);dispose(h);}}while(warmPreviews.length>(hub.previews.size?2:3))dispose(warmPreviews.shift());}
  hub.stopPreview=node=>{
    const h=hub.previews.get(node);if(!h)return;hub.previews.delete(node);
    if(node.isConnected&&h.frame?.dataset.ready==='true'){
      h.effectHost?.stop();h.frame.contentWindow.skinPlayer.pause(true);message(h.frame,'options',{interactive:false});
      h.cleanupLayout?.();h.cleanupLayout=undefined;h.parked=true;h.parkedAt=Date.now();h.node.style.visibility='hidden';h.frame.style.visibility='hidden';node.classList.remove('local-dynamic-visible');warmPreviews.push(h);prunePreviews();
    }else dispose(h);
    if(h.facade&&node.dynamic===h.facade){const previous=h.facade;previous.primary=null;queueMicrotask(()=>{if(node.dynamic===previous)delete node.dynamic;});}
  };
  hub.mount=(node,name,title)=>{
    if(node.closest('#arena>.player')){hub.refresh();return;}
    const own=lookupOwned(name,title+'.png');if(!own){hub.stopPreview(node);return;}
    if(hub.previews.get(node)?.e.id===own.e.id)return;
    hub.stopPreview(node);if(!canAnimate(name,own.e,node))return;
    prunePreviews();const index=warmPreviews.findIndex(h=>h.portrait===node&&h.e.id===own.e.id&&h.p===own.p);
    const h=index<0?createHost(own.p,own.e,node,name):warmPreviews.splice(index,1)[0];hub.previews.set(node,h);prunePreviews();
    if(h.parked){h.parked=false;h.entered=false;h.lastEvent=undefined;h.node.style.visibility='';h.frame.contentWindow.skinPlayer.pause(false);readyHost(h,h.readyData);}
    h.facade={id:++serial,primary:{},renderer:{capacity:1,postMessage(data){if(data.message==='DESTROY')hub.stopPreview(node);}}};
    node.dynamic=h.facade;node.stopDynamic=()=>hub.stopPreview(node);
  };
  hub.refresh=()=>{
    const wanted=new Set();let count=0;
    const dying=[...hub.hosts.values()].filter(h=>h.deathUntil>Date.now()).map(h=>h.player);
    const players=[...new Set([game.me,...game.players||[],...dying])].filter(Boolean);
    for(const player of players){
      if(!player?.node||!player.isConnected||!player.getClientRects().length)continue;
      const dead=player.classList.contains('dead');
      for(let slot=0;slot<2;slot++){
        const name=slot?player.name2:player.name1||player.name,portrait=slot?player.node.avatar2:player.node.avatar;
        if(!name||!portrait||lib.config.change_skin===false)continue;
        const hidden=slot?'unseen2':'unseen';
        if([hidden,hidden+'_v',hidden+'_show'].some(c=>player.classList.contains(c))||player.isUnseen?.(slot))continue;
        if(dead&&!(hub.hosts.get(portrait)?.deathUntil>Date.now()))continue;
        const skin=current(name);
        if(isLocal(skin)&&!hub.hasCharacter?.(name)){hub.requestCharacter?.(name);continue;}
        const own=lookupOwned(name,skin);if(!own)continue;
        wanted.add(portrait);const animated=canAnimate(name,own.e)&&count<4;if(animated)count++;
        const signature=name+'/'+own.e.id+'/'+animated+'/'+(player===game.me);let h=hub.hosts.get(portrait);
        if(h?.signature!==signature){dispose(h);hub.hosts.delete(portrait);h=null;}
        if(!h){h=createHost(own.p,own.e,portrait,name,player,animated);h.signature=signature;hub.hosts.set(portrait,h);}
        Object.assign(h.node.style,{left:portrait.offsetLeft+'px',top:portrait.offsetTop+'px',width:(portrait.offsetWidth||player.offsetWidth)+'px',height:(portrait.offsetHeight||player.offsetHeight)+'px'});updateInput(h);
      }
    }
    for(const [portrait,h] of hub.hosts)if(!wanted.has(portrait)){dispose(h);hub.hosts.delete(portrait);}
    for(const [node,h] of hub.previews){if(!node.isConnected||!node.getClientRects().length||(!h.libraryPreview&&!active(h.p))||!canAnimate(h.name,h.e,node))hub.stopPreview(node);else {h.cleanupLayout?.resize?.();updateInput(h);}}
  };
  function readyHost(h,data){
        h.releasePriority?.();h.releasePriority=undefined;hub.loadThumbnail.cancel(h.node);h.loading?.remove();h.node.style.backgroundImage='none';h.portrait.classList.add('local-dynamic-visible');h.frame.dataset.ready='true';
        h.capabilities=data.info;
        h.events=data.info?.events||eventMotions(h.e,data.info?.motions);
        if(!h.readyData)hub.loadThumbnail.publish(h.p,h.e,h.frame.contentWindow.skinPlayer);h.readyData=data;
        if(data.presentation){
          const p=data.presentation;
          h.nativePortrait=!!p.nativePortrait;
          if(p.nativePortrait){
            h.cleanupLayout?.();h.cleanupLayout=undefined;hub.framing.delete(h.e.id);
            if(lib.config.localDynamicSkinFrames?.[h.e.id]){delete lib.config.localDynamicSkinFrames[h.e.id];game.saveConfig('localDynamicSkinFrames',lib.config.localDynamicSkinFrames);}
          }
          // Frame geometry belongs to the theme, for every skin and renderer.
          // Artwork metadata must not resize either preview or player borders.
        }
        updateInput(h,true);hub.refresh();h.frame.style.visibility='visible';
        playHostEvent(h,'enter');
        if(h.pendingEvent&&h.pendingEvent!=='enter'){const kind=h.pendingEvent;delete h.pendingEvent;playHostEvent(h,kind);}else delete h.pendingEvent;
  }
  addEventListener('message',event=>{
    for(const h of [...hub.hosts.values(),...hub.previews.values()]){
      if(event.source!==h.frame?.contentWindow||event.data?.channel!==h.frame?.dataset.channel)continue;
      if(event.data.type==='noname-skin-ready'){
        readyHost(h,event.data);
      }
      if(event.data.type==='noname-skin-event-finished'&&event.data.kind==='death'){h.deathUntil=0;hub.refresh();}
      if(event.data.type==='noname-skin-error'){h.releasePriority?.();h.releasePriority=undefined;console.warn(h.p.name,h.e.id,event.data.message);h.node.style.backgroundImage='url('+JSON.stringify(h.p.base+h.e.thumbnail)+')';h.frame.remove();h.frame=null;}
    }
  });
  let refreshFrame=0;
  const scheduleRefresh=()=>{if(!refreshFrame)refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;hub.refresh();});};
  const observer=new MutationObserver(scheduleRefresh);
  const observe=()=>{if(ui.arena)observer.observe(ui.arena,{subtree:true,attributes:true,attributeFilter:['class']});};
  observe();lib.arenaReady?.push(observe);
  function playHostEvent(h,kind){
    if(!h.frame||h.deathUntil>Date.now()&&kind!=='death')return;
    if(h.frame.dataset.ready!=='true'){h.pendingEvent=kind;return;}
    const motion=h.events?.[kind];if(!motion)return;
    if(kind==='enter'){if(h.entered)return;h.entered=true;}
    // useSkill and logSkill can refer to the same activation. Avoid restarting
    // the animation while still permitting a different following event.
    if(h.lastEvent===kind&&Date.now()-h.lastEventAt<180)return;
    h.lastEvent=kind;h.lastEventAt=Date.now();
    if(kind==='death')h.deathUntil=Date.now()+15000;
    message(h.frame,'event',{kind,motion});
  }
  hub.playEvent=(player,kind)=>{
    if(!player)return;
    hub.refresh();
    for(const h of hub.hosts.values())if(h.player===player)playHostEvent(h,kind);
  };
  hub.handleEvent=(trigger,triggername)=>{
    if(!trigger)return;
    if(triggername==='gameStart'||trigger.name==='gameStart'){
      for(const player of game.players||[])hub.playEvent(player,'enter');return;
    }
    if(trigger.name==='die'){
      if(triggername==='dieBegin')hub.playEvent(trigger.player,'death');
      else if(triggername==='dieAfter')hub.playEvent(trigger.source,'kill');
      return;
    }
    const kind={useCard:trigger.card?.name==='sha'?'attack':trigger.card?.name==='shan'?'dodge':'card',respond:trigger.card?.name==='shan'?'dodge':'respond',
      useSkill:'skill',logSkill:'skill',enterGame:'enter',damage:'damage'}[trigger.name];
    if(kind)hub.playEvent(trigger.player,kind);
  };
  if(lib.skill&&typeof game.addGlobalSkill==='function'){
    lib.skill._localDynamicTestEvents={charlotte:true,forced:true,popup:false,silent:true,forceDie:true,
      trigger:{global:['useCard','respond','useSkill','logSkill','damageEnd','dieBegin','dieAfter','gameStart','enterGame']},
      filter(event,player,name){return player===(game.me||game.players?.[0])&&(name==='gameStart'||!!(event.player||event.source));},
      async content(event,trigger){game.localDynamicSkinTestHub?.handleEvent(trigger,event.triggername);}};
    game.addGlobalSkill('_localDynamicTestEvents');
  }
  hub.timer=setInterval(()=>{prunePreviews();hub.resources.prune();hub.integrate();hub.refresh();},750);
  lib.arenaReady?.push(()=>{hub.integrate();hub.refresh();});return hub;
}
