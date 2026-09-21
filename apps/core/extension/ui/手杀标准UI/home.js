// Liuli's original atlases and Spine animations with current-client actions.
const rz="extension/如真似幻";
let pixiPromise;
function loadPixi(base) {
 if(globalThis.PIXI?.spine) return Promise.resolve(globalThis.PIXI);
 return pixiPromise ||= new Promise((resolve,reject)=>{
  const script=document.createElement("script");script.src=base+"vendor/pixi6.min.js";
  script.onload=()=>resolve(globalThis.PIXI);script.onerror=()=>{pixiPromise=undefined;script.remove();reject(new Error("登录动画加载失败"));};document.head.append(script);
 });
}
export async function createHome(node,{base,data,lib,game,resolve,preview=false,initial}) {
 const doc=node.ownerDocument;
 const css=doc.createElement("link");css.rel="stylesheet";css.href=base+"home.css";doc.head.append(css);
 const root=doc.createElement("main");root.className="shousha-home";node.append(root);
 const url=source=>data.resources[source]?base+data.resources[source]:"";
 const el=(tag,parent,cls,text)=>{const n=doc.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;parent?.append(n);return n;};
 let disposed=false,animation,loader,resizeObserver,modal,theme=lib.config.shousha_standard_theme||"经典主题",screen;
 if(!data.sheets[theme])theme="经典主题";
 const listeners=new AbortController();
 const button=(parent,label,action,cls="")=>{const b=el("button",parent,cls,label);b.type="button";b.onclick=()=>Promise.resolve(action()).catch(error=>notice(error.message||String(error)));return b;};
 const notice=text=>{const old=root.querySelector(".ss-notice");old?.remove();const n=el("p",root,"ss-notice",text);n.setAttribute("role","status");button(n,"关闭",()=>n.remove());};
 function stopAnimation(){resizeObserver?.disconnect();resizeObserver=null;loader?.destroy();loader=null;animation?.destroy(true,{children:true,texture:true,baseTexture:true});animation=null;}
 function clear(){stopAnimation();modal=null;root.replaceChildren();root.dataset.screen=screen;root.style.backgroundImage=`url("${url(`${rz}/images/uiStyles/${theme}/bg.jpg`)}")`;}
 const workshop=()=>{if(!preview)void lib.uiWorkshop?.open();};
 const settings=tab=>{if(preview)return;const page=tab==="records"?"other":tab||"options";if(lib.uiWorkshop?.openSettings)return lib.uiWorkshop.openSettings(page);const next=new URL(location.href);next.searchParams.set("lobbySettings",page);location.href=next.href;};
 function dialog(title){modal?.remove();modal=el("section",root,"ss-modal");modal.setAttribute("role","dialog");modal.setAttribute("aria-label",title);const panel=el("div",modal,"ss-panel");const h=el("header",panel);el("h2",h,"",title);button(h,"返回",()=>{modal.remove();modal=null;});return el("div",panel,"ss-panel-body");}
 function sprite(parent,key,label,action,cls="") {
  const btn=button(parent,"",action,`ss-sprite ${cls}`);btn.setAttribute("aria-label",label);btn.title=label;
  const frame=data.sheets[theme]?.frames[key];
  if(!frame){btn.textContent=label;return btn;}
  const canvas=el("canvas",btn);canvas.width=frame.sourceSize.w;canvas.height=frame.sourceSize.h;
  const img=new Image();img.onload=()=>{
   if(disposed)return;const ctx=canvas.getContext("2d"),f=frame.frame,s=frame.spriteSourceSize;
   if(frame.rotated){ctx.save();ctx.translate(s.x,s.y+s.h);ctx.rotate(-Math.PI/2);ctx.drawImage(img,f.x,f.y,f.h,f.w,0,0,s.h,s.w);ctx.restore();}
   else ctx.drawImage(img,f.x,f.y,f.w,f.h,s.x,s.y,s.w,s.h);
  };img.src=url(`${rz}/images/uiStyles/${theme}/ui.png`);
  el("span",btn,"ss-sprite-caption",label);return btn;
 }
 async function loginAnimation() {
  if(preview)return;
  try {
   const PIXI=await loadPixi(base);if(disposed||screen!=="login")return;
   const app=animation=new PIXI.Application({width:1280,height:720,backgroundAlpha:0,resolution:Math.min(devicePixelRatio||1,2),autoDensity:true});
   app.view.className="ss-login-animation";root.prepend(app.view);
   const currentLoader=loader=new PIXI.Loader();
   currentLoader.add("background",base+"spine/startSpine/戏志才·举棋若定/BeiJing.skel");
   currentLoader.add("character",base+"spine/startSpine/戏志才·举棋若定/XingXiang.skel");
   await new Promise((ok,fail)=>{currentLoader.onError.add(fail);currentLoader.load(ok);});
   if(disposed||screen!=="login")return;
   for(const [key,x,y,scale,loop] of [["background",640,216,1,"beijing"],["character",448,432,.66,"daiji"]]) {
    const resource=currentLoader.resources[key];if(!resource?.spineData)continue;
    const spine=new PIXI.spine.Spine(resource.spineData);spine.position.set(x,y);spine.scale.set(scale);app.stage.addChild(spine);
    const names=spine.spineData.animations.map(a=>a.name);const opening=names.find(n=>n.toLowerCase()==="chuchang"),idle=names.find(n=>n.toLowerCase()===loop)||names[0];
    if(opening){spine.state.setAnimation(0,opening,false);spine.state.addAnimation(0,idle,true,0);}else if(idle)spine.state.setAnimation(0,idle,true);
   }
   const resize=()=>{const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;app.renderer.resize(w,h);const scale=Math.max(w/1280,h/720);app.stage.scale.set(scale);app.stage.position.set((w-1280*scale)/2,(h-720*scale)/2);};
   resizeObserver=new ResizeObserver(resize);resizeObserver.observe(root);resize();
  }catch(error){if(!disposed&&screen==="login")notice("动画暂不可用，仍可点击进入大厅。");console.warn("手杀标准UI登录动画",error);}
 }
 function login(){
  screen="login";clear();root.style.backgroundImage=`url("${url(`${rz}/images/hom.jpg`)}")`;
  const top=el("header",root,"ss-login-top");el("h1",top,"","手杀标准UI");
  button(top,"UI 工坊",workshop);button(top,"设置",()=>settings());
  const enter=button(root,"",()=>{
   if(!preview){const audio=new Audio(url(`${rz}/audio/sgs/Enter.mp3`));audio.volume=Math.min(1,(lib.config.volumn_effect||0)/8);void audio.play().catch(()=>{});}
   home();
  },"ss-enter");
  const start=el("img",enter);start.src=url(`${rz}/images/loginui/start.png`);start.alt="开始游戏";
  el("span",enter,"","进入大厅");
  const footer=el("footer",root,"ss-login-footer");el("span",footer,"",lib.config.connect_nickname||"无名玩家");
  button(footer,"切换昵称",()=>{const box=dialog("玩家昵称");const input=el("input",box);input.value=lib.config.connect_nickname||"";input.maxLength=20;input.setAttribute("aria-label","玩家昵称");button(box,"保存",async()=>{if(!preview)await game.promises.saveConfig("connect_nickname",input.value.trim()||"无名玩家");login();});});
  el("span",footer,"","三国杀 · 琉璃版 5.5 界面");
  void loginAnimation();
 }
 function home(){
  screen="home";clear();
  const top=el("header",root,"ss-top");const profile=button(top,lib.config.connect_nickname||"无名玩家",()=>profileDialog(),"ss-profile");
  const avatar=el("img",profile);avatar.src=url(`${rz}/images/avatar/2.png`);avatar.alt="头像";
  el("span",top,"ss-title","手杀标准UI");button(top,"更换主题",themes);button(top,"设置",()=>settings());button(top,"UI 工坊",workshop);
  const left=el("nav",root,"ss-left");sprite(left,"left1","武将",()=>characters());sprite(left,"left2","卡牌",()=>cardGallery());sprite(left,"left3","战绩",()=>settings("records"));
  const modes=el("section",root,"ss-main-modes");
  for(const [key,name,ids] of [["mode1","经典场",["identity","guozhan"]],["mode2","排位赛",["single","versus"]],["mode3","自由场",lib.config.all.mode.filter(id=>id!=="connect")],["mode4","至尊场",["doudizhu","boss"]]])sprite(modes,key,name,()=>modeChoices(name,ids),"ss-mode-sprite");
  const bottom=el("nav",root,"ss-bottom");
  for(const [key,label,action] of [["under1","全部模式",allModes],["under3","武将图鉴",characters],["under4","皮肤",()=>skins()],["under5","游戏设置",()=>settings()],["under6","返回登录",login]])sprite(bottom,key,label,action);
 }
 function profileDialog(){const panel=dialog("玩家资料");el("h3",panel,"",lib.config.connect_nickname||"无名玩家");el("p",panel,"","在游戏设置中查看战绩、录像和已启用武将包。");button(panel,"游戏记录",()=>settings("records"));button(panel,"更换昵称",login);}
 function themes(){const panel=dialog("大厅主题");panel.classList.add("ss-gallery");for(const name of Object.keys(data.sheets)){const b=button(panel,name,async()=>{theme=name;if(!preview)await game.promises.saveConfig("shousha_standard_theme",name);home();});const img=el("img",b);img.src=url(`${rz}/images/uiStyles/${name}/bg.jpg`);img.alt=name;}}
 function allModes(){const panel=dialog("选择模式");panel.classList.add("ss-gallery");for(const id of lib.config.all.mode.filter(id=>id!=="connect")){const name=lib.translate[id]||id;const b=button(panel,name,()=>modeDialog(id,name));const path=url(`${rz}/images/mode/${id}.jpg`);if(path){const img=el("img",b);img.src=path;img.alt=name;}}}
 function modeChoices(title,ids){const panel=dialog(title);panel.classList.add("ss-gallery");for(const id of ids){if(!lib.config.all.mode.includes(id))continue;const name=lib.translate[id]||id;const b=button(panel,name,()=>modeDialog(id,name));const src=url(`${rz}/images/mode/${id}.jpg`);if(src){const img=el("img",b);img.src=src;img.alt=name;}}}
 function modeDialog(id,name){
  const panel=dialog(name);panel.classList.add("ss-mode-detail");const img=el("img",panel);img.src=url(`${rz}/images/mode/${id}.jpg`);img.alt=name;
  const actions=el("div",panel);el("h2",actions,"",name);
  button(actions,"开始单机",async()=>{if(preview)return;await game.promises.saveConfig("sessionType","offline");stopAnimation();resolve(id);},"ss-primary");
  button(actions,"模式设置",()=>settings("options"));
  button(actions,"联机房间",async()=>{
   if(preview)return;
   if(!lib.uiWorkshop?.openRooms)throw new Error("当前客户端未提供联机房间入口");
   await lib.uiWorkshop.openRooms(id);
  });
 }
 async function characters(){
  if(!Object.keys(lib.character||{}).length && lib.uiWorkshop?.prepareCharacters)await lib.uiWorkshop.prepareCharacters();
  const panel=dialog("武将图鉴");const search=el("input",panel);search.placeholder="搜索武将";search.setAttribute("aria-label","搜索武将");const grid=el("div",panel,"ss-character-grid");
  const ids=[...new Set([...Object.keys(lib.character||{}),...Object.values(lib.characterPack||{}).flatMap(pack=>Object.keys(pack))])];
  let limit=60;const draw=()=>{grid.replaceChildren();const query=search.value.trim();const matches=ids.filter(id=>!query||id.includes(query)||(lib.translate[id]||"").includes(query));
   for(const id of matches.slice(0,limit)){const b=button(grid,lib.translate[id]||id,()=>skins(id));const picture=el("div",b,"ss-portrait");if(picture.setBackground)picture.setBackground(id,"character");else picture.style.backgroundImage=`url("${lib.assetURL}image/character/${id}.jpg")`;}
   if(matches.length>limit)button(grid,"加载更多",()=>{limit+=60;draw();});
  };search.oninput=()=>{limit=60;draw();};draw();
 }
 async function skins(id){if(preview)return;if(lib.uiWorkshop?.openSkins)await lib.uiWorkshop.openSkins(id);else settings("options");}
 function cardGallery(){const panel=dialog("卡牌图鉴");const search=el("input",panel);search.placeholder="搜索卡牌";search.setAttribute("aria-label","搜索卡牌");const grid=el("div",panel,"ss-card-grid");let limit=60;
  const draw=()=>{grid.replaceChildren();const ids=Object.keys(data.cards).filter(id=>!search.value||id.includes(search.value)||(lib.translate[id]||"").includes(search.value));for(const id of ids.slice(0,limit)){const figure=el("figure",grid);const img=el("img",figure);img.loading="lazy";img.src=base+data.cards[id];img.alt=lib.translate[id]||id;el("figcaption",figure,"",lib.translate[id]||id);}if(ids.length>limit)button(grid,"加载更多",()=>{limit+=60;draw();});};search.oninput=()=>{limit=60;draw();};draw();}
 doc.addEventListener("keydown",event=>{if(event.key==="Escape"&&modal){modal.remove();modal=null;event.stopPropagation();}},{signal:listeners.signal});
 if(initial==="home")home();else login();
 return ()=>{disposed=true;stopAnimation();listeners.abort();root.remove();css.remove();};
}
