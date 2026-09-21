(async function(){
 const query=new URLSearchParams(location.search),preview=query.has('preview'),root=new URL('../../../',location.href),original=new URL('../',location.href),byId=id=>document.getElementById(id);
 new Function(await(await fetch(new URL('native/login-backgrounds.js',root))).text())();
 document.body.style.margin='0';
 byId('loginfoname').textContent=query.get('nickname')||localStorage.getItem('noname-shousha-native:loggedIn')||'无名玩家';
 byId('loginfo').style.display='block';byId('version').textContent='手杀标准UI';byId('loginoverlay').style.display='none';byId('transitionscreen').style.display='block';
 byId('updateve').textContent='手杀标准UI';
 byId('updatetext').textContent='手杀标准UI。登录、大厅、模式、选将、对局、换牌、技能、结算与本地界面设置。';
 byId('kftext').textContent='本地游戏与界面设置可直接使用。联机房间使用当前项目的联机服务。';
 byId('sqhe').textContent='社区';byId('sqtext').textContent='PXLNGU整合';
 const communityClose=document.createElement('button');communityClose.textContent='返回';communityClose.onclick=()=>byId('sqsp').style.display='none';byId('sqbg').append(communityClose);
 for(const [button,modal] of [['updatelogimage','updatelogmodal'],['kfbt','kfsp'],['sqbt','sqsp']]){const panel=byId(modal);panel.style.display='none';byId(button).onclick=()=>panel.style.display='block';panel.onclick=event=>{if(event.target===panel)panel.style.display='none';};}
 byId('relog').onclick=()=>{byId('usernameinput').value=byId('loginfoname').textContent;byId('loginoverlay').style.display='block';byId('usernameinput').focus();};
 // Local profile only; credentials are neither requested nor sent elsewhere.
 byId('passwordinput').remove();byId('loginmm').remove();
 byId('loginbutton').onclick=()=>{const nickname=byId('usernameinput').value.trim()||'无名玩家';byId('loginfoname').textContent=nickname;if(!preview)localStorage.setItem('noname-shousha-native:loggedIn',nickname);byId('loginoverlay').style.display='none';parent.postMessage({type:'shousha-profile',nickname},location.origin);};
 byId('usernameinput').onkeydown=event=>{if(event.key==='Enter')byId('loginbutton').click();};
 let finishing=false;
 function enter(offline=false){if(preview||finishing)return;finishing=true;byId('ksgame').play().catch(()=>{});parent.postMessage({type:'shousha-login',nickname:byId('loginfoname').textContent,offline},location.origin);}
 byId('offlinebutton').onclick=()=>enter(true);
 const app=new PIXI.Application({width:innerWidth,height:innerHeight,backgroundAlpha:0,resolution:devicePixelRatio||1,autoDensity:true,antialias:true});app.view.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:1';document.body.append(app.view);
 const theme=query.get('theme')||localStorage.getItem('noname-shousha-native:rzsh_loginui')||'戏志才·举棋若定';
 const adjustment=window.chgBackgroundlist[theme]||window.chgBackgroundlist['戏志才·举棋若定'],skeletons=adjustment['骨骼设定']?.['类型']||{};
 const loader=new PIXI.Loader();loader.add('background',new URL('spine/startSpine/'+theme+'/'+(skeletons['背景']||'BeiJing.skel'),original).href);loader.add('character',new URL('spine/startSpine/'+theme+'/'+(skeletons['形象']||'XingXiang.skel'),original).href);loader.add('start',new URL('spine/Ot/kaishiyouxi.skel',original).href);
 loader.onError.add(error=>{parent.postMessage({type:'shousha-login-error',message:error.message},location.origin);const node=document.createElement('div');node.textContent='登录动画加载失败：'+error.message;node.style.cssText='position:absolute;left:20px;bottom:20px;z-index:99;color:white';document.body.append(node);});
 loader.load((_,resources)=>{
  if(!resources.background.spineData||!resources.character.spineData||!resources.start.spineData)return;
  const bg=new PIXI.spine.Spine(resources.background.spineData),pe=new PIXI.spine.Spine(resources.character.spineData),start=new PIXI.spine.Spine(resources.start.spineData),animations=adjustment['骨骼设定']?.['动画']||{};
  function animation(spine,wanted,fallback){const names=spine.stateData.skeletonData.animations.map(a=>a.name);return names.find(name=>name.toLowerCase()===wanted.toLowerCase())||names.find(name=>name.toLowerCase()===fallback)||names[0];}
  const bgIdle=animation(bg,animations['背景-2']||'beijing','idle'),peIdle=animation(pe,animations['形象-2']||'daiji','idle');
  bg.state.setAnimation(0,animation(bg,animations['背景-1']||'chuchang',bgIdle),false);bg.state.addAnimation(0,bgIdle,true,0);pe.state.setAnimation(0,animation(pe,animations['形象-1']||'chuchang',peIdle),false);pe.state.addAnimation(0,peIdle,true,0);start.state.setAnimation(0,'animation',true);app.stage.addChild(bg,pe,start);
  // Measure the idle backdrop, not the entrance pose or floating particles.
  // Themes have different skeleton sizes and origins; fixed 1103x514 scaling
  // alone leaves exposed strips in themes such as the two children with kites.
  bg.state.setAnimation(0,bgIdle,true);bg.update(0);
  const backdropSlots=bg.skeleton.slots.filter(slot=>slot.currentSprite||slot.currentMesh);
  const backdrop=backdropSlots.sort((a,b)=>{
   const area=slot=>{const attachment=slot.getAttachment();return (attachment?.width||0)*(attachment?.height||0);};
   return area(b)-area(a);
  })[0];
  const display=backdrop?.currentSprite||backdrop?.currentMesh;
  const measured=display?.getBounds()||bg.getBounds();
  const origin=bg.toLocal(new PIXI.Point(measured.x,measured.y));
  const far=bg.toLocal(new PIXI.Point(measured.right,measured.bottom));
  const backdropBounds={x:Math.min(origin.x,far.x),y:Math.min(origin.y,far.y),width:Math.abs(far.x-origin.x),height:Math.abs(far.y-origin.y)};
  bg.state.setAnimation(0,animation(bg,animations['背景-1']||'chuchang',bgIdle),false);bg.state.addAnimation(0,bgIdle,true,0);
  function resize(){
   app.renderer.resize(innerWidth,innerHeight);
   const scale=innerHeight/514,b=adjustment['背景调整'],p=adjustment['形象调整'];
   let backgroundScale=(typeof b==='object'?b['缩放']*.8:b||1)*Math.max(scale,innerWidth/1103);
   if(backdropBounds.width>0&&backdropBounds.height>0)backgroundScale=Math.max(backgroundScale,innerWidth/backdropBounds.width,innerHeight/backdropBounds.height);
   bg.scale.set(backgroundScale);
   let x=(typeof b==='object'?b['X轴']:.5)*innerWidth,y=(typeof b==='object'?b['Y轴']:.3)*innerHeight;
   if(backdropBounds.width>0&&backdropBounds.height>0){
    x=Math.min(-backdropBounds.x*backgroundScale,Math.max(innerWidth-(backdropBounds.x+backdropBounds.width)*backgroundScale,x));
    y=Math.min(-backdropBounds.y*backgroundScale,Math.max(innerHeight-(backdropBounds.y+backdropBounds.height)*backgroundScale,y));
   }
   bg.position.set(x,y);pe.position.set((p?.['X轴']??.35)*innerWidth,(p?.['Y轴']??.6)*innerHeight);pe.scale.set((p?.['缩放']??.66)*scale);start.position.set(.75*innerWidth,.5*innerHeight);start.scale.set(.45*scale);
  }
  resize();parent.postMessage({type:'shousha-login-ready'},location.origin);addEventListener('resize',resize);start.interactive=true;start.buttonMode=true;start.on('pointerup',()=>{start.state.setAnimation(0,'animation2',false);start.state.addAnimation(0,'animation',true,0);if(!adjustment['无点击动画']){pe.state.setAnimation(0,animation(pe,animations['形象-3']||'gongji',peIdle),false);pe.state.addAnimation(0,peIdle,true,0);}if(!preview)setTimeout(()=>enter(false),650);});
 });
 const audio=byId('outgame');audio.volume=Number(query.get('volume')||.4);audio.play().catch(()=>{});addEventListener('pagehide',()=>{audio.pause();loader.destroy();app.destroy(true,{children:true,texture:true,baseTexture:true});});
})().catch(error=>{console.error(error);parent.postMessage({type:'shousha-login-error',message:error.message},location.origin);});
