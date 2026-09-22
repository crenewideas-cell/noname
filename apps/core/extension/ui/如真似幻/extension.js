import { lib, game, ui, get, createSceneContext } from "noname";
import { createSceneGame, prepareCharacters, createPortraitLoader, packLabel, openTools } from "./bridge.js";
import { createLobbyAudio, createCharacterGrid, addSessionButtons } from "./runtime.js";

export const type = "extension";
export const workshopManifest = {
 format: "noname-ui-workshop", version: 1, id: "rzsh-modern", name: "如真似幻",
 author: "蒸、某个萌新、非凡欧德内里、文和",
 description: "动画大厅与模式选择使用如真似幻素材；规则、设置、皮肤和联机统一接入本体。",
 components: { home: { name: "如真似幻 · 交互大厅", runtime: "rzsh", settings: {}, assets: {}, style: {} } }
};
const base = () => import.meta.url.slice(0, import.meta.url.lastIndexOf('/') + 1);
let prepared, installed;
let fileList;
const scripts = new Map();
function script(file) {
 if (scripts.has(file)) return scripts.get(file);
 const job = new Promise((resolve, reject) => {
  const node = document.createElement("script"); node.src = base() + file;
  node.onload = resolve; node.onerror = () => { node.remove(); reject(new Error(`如真似幻资源加载失败：${file}`)); };
  document.head.append(node);
 });
 scripts.set(file, job); job.catch(() => scripts.delete(file)); return job;
}
async function prepare() {
 if (!prepared) prepared = (async () => {
  await script("js/gsap.min.js");
  await script("js/pixi6.min.js");
  const response = await fetch(base()+"files.json"); if (!response.ok) throw new Error("如真似幻文件清单缺失"); fileList = await response.json();
  return import("./scenes.js");
 })().catch(error => { prepared = undefined; throw error; });
 return prepared;
}
export async function activate(manifest) {
 if (installed) return installed;
 let disposed = false, sceneGame, activeScene, previousAlert;
 const sceneContext = createSceneContext({lib,game,ui,get}, {settingsKey:"ui_workshop_rzsh_settings", actions:{reload:()=>game.reload()}});
 const draftGame = sceneContext.game, draftCreate = {...sceneContext.ui.create}, previousSettings = window.我们敬爱你呀丞相;
 const openSettings = () => lib.uiWorkshop.openSettings("options");
 const alertScene = message => {
  if (disposed || !activeScene || sceneContext._status.rzsh_alerting) return;
  sceneContext._status.rzsh_alerting = true;
  const toast = document.createElement("div"); toast.className = "huanpaiwenzi";
  toast.textContent = String(message).replace(/<br\s*\/?>/g,"\n").replace(/<[^>]*>/g, ""); document.body.append(toast);
  activeScene.own({destroy:()=>{toast.remove();delete sceneContext._status.rzsh_alerting;}});
  sceneGame?.playAudio("audio/sgs/Notice02.mp3");
  activeScene.timeout(() => { toast.remove(); delete sceneContext._status.rzsh_alerting; },3000);
 };
 const splash = {
  id: "rzsh-modern", name: "如真似幻", lifecycle: null,
  async init(node, resolve, restore = {}) {
   if (disposed || !node.isConnected) return;
   this.lifecycle?.dispose();
   node.classList.add("rzsh-modern-splash");
   const links = ["font", "dream_corridor", "setting", "modern"].map(file => {
    const link = document.createElement("link"); link.rel = "stylesheet"; link.href = base()+`css/${file}.css`; document.head.append(link); return link;
   });
   const timers = new Set(), intervals = new Set(), frames = new Set();
   const loaders = new Set(), tickers = new Set(), containers = new Set(), backgrounds = new Set(), animations = new Set(), owned = new Set();
   const sceneWindow=Object.create(null), sceneNodes=new Set();
   Object.defineProperty(sceneWindow,'devicePixelRatio',{get:()=>window.devicePixelRatio});
   sceneWindow.inSplash=!!window.inSplash;
   sceneWindow._rzsh_theme=sceneContext.config.uiStyles;
   const ownNode=node=>{sceneNodes.add(node);return node;};
   const sceneDocument=new Proxy(document,{get(target,key){if(key==='createElement')return(...args)=>ownNode(target.createElement(...args));const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;}});
   for(const [key,create] of Object.entries(draftCreate))sceneContext.ui.create[key]=(...args)=>ownNode(create(...args));
   // Match the original 1103 × 514 layout units while allowing the viewport
   // aspect ratio to determine its width. The stage itself scales uniformly.
   const screen = {x:0, y:0, width:514 * (node.clientWidth || 1103) / (node.clientHeight || 514), height:514};
   let viewport = {width:screen.width,height:screen.height,scale:1};
   const views = new Map();
   let pendingView = restore.view || "home", activeView = restore.view || "home", resizing, finishing = false, homeReady = false;
   let observer, onlineController, onlineOpen = false, resizeScene;
   let done = false;
   const lifecycle = this.lifecycle = {
    window:sceneWindow, document:sceneDocument,
    app: null,
    sound: createLobbyAudio(node),
    get pixi() { return new Proxy(globalThis.PIXI, {get(target,key) { return key === "sound" ? lifecycle.sound : Reflect.get(target,key); }}); },
    get animation() {
     return new Proxy(globalThis.gsap, { get(target,key) {
      if (!["to", "from", "fromTo", "timeline", "delayedCall"].includes(key)) return Reflect.get(target,key);
      return (...args) => { const tween = target[key](...args); animations.add(tween); return tween; };
     } });
    },
    application(options) {
     const app = new PIXI.Application({...options, width:screen.width, height:screen.height});
     const update=app.ticker.update.bind(app.ticker);app.ticker.update=(...args)=>runVisual(update,...args);
     return new Proxy(app, {get(target,key) { return key === "screen" ? screen : Reflect.get(target,key); }});
    },
    mount(app) {
     this.app = app; node.append(app.view);
     const resize = () => {
      const width = node.clientWidth, height = node.clientHeight;
      if (!width || !height || done) return;
      const scale = Math.min(width / screen.width, height / screen.height);
      viewport = {width,height,scale}; app.renderer.resize(width,height);
      app.stage.scale.set(scale); app.stage.position.set((width-screen.width*scale)/2,(height-screen.height*scale)/2);
      app.view.style.width = `${width}px`; app.view.style.height = `${height}px`;
      app.view.style.transform = "translate(-50%,-50%)";
      backgrounds.forEach(sprite => { if (!sprite.destroyed) lifecycle.cover(sprite); });
      clearTimeout(resizing);
      if (!finishing && !onlineOpen && activeView !== "matching" && Math.abs(width / height - screen.width / screen.height) > 0.005) {
       resizing = setTimeout(() => {
        if (done || finishing) return;
        const state = {view:pendingView || activeView, mode:sceneWindow.moode};
        lifecycle.dispose(true);
        void splash.init(node, resolve, state);
       }, 180);
      }
     };
     resizeScene = resize;
     observer = new ResizeObserver(resize); observer.observe(node); resize();
     app.ticker.add(() => backgrounds.forEach(sprite => { if (!sprite.destroyed) lifecycle.cover(sprite); }));
    },
    cover(sprite) {
     const first = backgrounds.size === 0;
     backgrounds.add(sprite);
     const scale = Math.max(viewport.width / viewport.scale / Math.max(1,sprite.texture.width), viewport.height / viewport.scale / Math.max(1,sprite.texture.height));
     sprite.scale.set(scale); sprite.anchor.set(0.5); sprite.position.set(screen.width/2,screen.height/2);
     if (first) queueMicrotask(() => { if (pendingView) lifecycle.showView(pendingView); });
    },
    loader() {
     const loader = new PIXI.Loader(), load = loader.load.bind(loader);
     loader.load = callback => load((...args) => { if (!done) runVisual(callback,...args); });
     loaders.add(loader); return loader;
    },
    ticker() { const ticker = new PIXI.Ticker(), update=ticker.update.bind(ticker);ticker.update=(...args)=>runVisual(update,...args);tickers.add(ticker); return ticker; },
    container() { const container = new PIXI.Container(); containers.add(container); return container; },
    packLabel,
    sessionButtons(parent, x, y, scale) { addSessionButtons(lifecycle, parent, x, y, scale); },
    offline() { game.saveConfig("sessionType", "offline"); sceneWindow.moode = "shenfen"; lifecycle.showView("mode"); },
    async online(mode = "identity") {
     if (done || finishing || onlineOpen) return;
     onlineOpen = true; clearTimeout(resizing);
     try {
      await game.promises.saveConfig("sessionType", "online");
      if (done) return;
      onlineController = await game.openOnlineRooms(mode);
      if (done) { onlineController.close(); return; }
      await onlineController.closed;
     } catch (error) { if (!done) window.rzsh.function.alert(error.message || "无法进入联机大厅"); }
     finally { onlineController = null; onlineOpen = false; if (!done) resizeScene?.(); }
    },
    startGame(mode, matching = false) {
     if (lib.config.sessionType === "online") return lifecycle.online(mode);
     if (matching) lifecycle.showView("matching"); else lifecycle.finish(mode);
    },
    own(sprite) { owned.add(sprite); return sprite; },
    get isHome() { return activeView === "home"; },
    initialHome(enter) { if (activeView === "home") enter(); },
    markHomeReady() { homeReady = true; if(lib.uiWorkshop?.failedId===(manifest?.id||'rzsh-modern')){delete lib.uiWorkshop.failedId;delete lib.uiWorkshop.error;}if (pendingView) this.showView(pendingView); },
    readyView(name, container, enter) {
     container.on("added", () => { activeView = name; });
     views.set(name, {container, enter});
     if (pendingView === name) this.showView(name);
    },
    showView(name) {
     if (done) return;
     pendingView = name;
     const view = views.get(name);
     if (!view || !homeReady || !backgrounds.size) { status.textContent = "正在准备界面…"; node.append(status); return; }
     pendingView = null; status.remove();
     if (restore.mode) { sceneWindow.moode = restore.mode; delete restore.mode; }
     if (view.container.parent !== lifecycle.app?.stage) view.enter();
     activeView = name;
    },
    optionalSpine(loader, name, path) {
     const address=new URL(path,document.baseURI).href,relative=decodeURIComponent(address.slice(base().length));
     if(!address.startsWith(base())||!fileList.includes(relative))throw new Error("此动态皮肤未随原素材包提供");
     return loader.add(name,address);
    },
    openTools(onOriginal) { openTools(() => lifecycle.settings(), onOriginal); },
    settings() { return lib.uiWorkshop.openSettings("options"); },
    restart() { game.reload(); },
    character(name) { return lib.uiWorkshop.openSkins(name); },
    skins() { return lib.uiWorkshop.openSkins(Object.keys(lib.characterPack).flatMap(key => Object.keys(lib.characterPack[key]))[0]); },
    corridor() { return lifecycle.skins(); },
    timeout(fn, ms, ...args) { if(done)return 0;const id = setTimeout(() => { timers.delete(id); if (!done) runVisual(fn,...args); }, ms); timers.add(id); return id; },
    interval(fn, ms, ...args) { if(done)return 0;const id = setInterval(() => { if (!done) runVisual(fn,...args); }, ms); intervals.add(id); return id; },
    frame(fn) { if(done)return 0;const id = requestAnimationFrame(t => { frames.delete(id); if (!done) runVisual(fn,t); }); frames.add(id); return id; },
    async finish(mode) { if (done || finishing) return; finishing = true; try { await sceneContext.commitMode(mode); if(done||disposed)return; clearTimeout(resizing); lifecycle.sound.dispose(); resolve(mode); } catch(error) { finishing=false;if(!done)alertScene(error.message); } },
    dispose(resize = false) {
     if (done) return; done = true;
     const release = action => { try { action(); } catch(error) { console.warn("如真似幻资源释放失败",error); } };
     release(() => onlineController?.close());
     if (activeScene === lifecycle) activeScene = null;
     clearTimeout(resizing); release(()=>lifecycle.sound.dispose()); release(()=>sceneGame?.stopSceneAudio()); release(()=>lifecycle.portraits?.dispose()); release(()=>lifecycle.grid?.dispose());
     timers.forEach(clearTimeout); intervals.forEach(clearInterval); frames.forEach(cancelAnimationFrame);
     observer?.disconnect(); loaders.forEach(loader => release(()=>loader.destroy())); tickers.forEach(ticker => release(()=>ticker.destroy()));
     animations.forEach(animation => release(()=>animation.kill()));
     containers.forEach(container => release(()=>{ if (!container.destroyed) container.destroy({children:true}); }));
     owned.forEach(sprite => release(()=>{ if (!sprite.destroyed) sprite.destroy({children:true}); }));
     // PIXI caches atlas textures globally; another active provider may share them.
     release(()=>lifecycle.app?.destroy(true, { children: true })); lifecycle.app = null;
     for(const node of sceneNodes)release(()=>{if(node instanceof HTMLMediaElement){node.pause();node.removeAttribute('src');node.load();}node.remove();});sceneNodes.clear();
     for(const key of Object.keys(sceneWindow))delete sceneWindow[key];
     links.forEach(link => link.remove()); status.remove(); document.querySelector(".rzsh-tool-menu")?.remove();
    }
   };
   activeScene = lifecycle;
   const status = document.createElement("div"); status.className = "rzsh-loading"; status.textContent = "正在准备如真似幻…"; node.append(status);
   function runVisual(fn,...args){
    if(done||disposed||typeof fn!=='function')return;
    try{Promise.resolve(fn(...args)).catch(fail);}catch(error){fail(error);}
   }
   function fail(error){
    if(done||disposed)return;
    lifecycle.dispose();
    status.style.cssText='position:absolute;inset:15%;z-index:30;padding:24px;background:#292720;color:#ead9af;white-space:normal;overflow:auto';
    status.textContent=`如真似幻加载失败：${error.message || error}`;node.append(status);
    if(lib.uiWorkshop){lib.uiWorkshop.failedId=manifest?.id||'rzsh-modern';lib.uiWorkshop.error=status.textContent;}
    for(const [label,action] of [['重新加载如真似幻',()=>{status.remove();return splash.init(node,resolve,restore);}],['打开 UI 工坊',()=>lib.uiWorkshop?.open()]]){
     const button=document.createElement('button');button.textContent=label;button.onclick=()=>Promise.resolve().then(action).catch(error=>console.warn('如真似幻恢复失败',error));status.append(button);
    }
    console.warn('如真似幻展示失败',error);
   }
   try {
    const scene = await prepare();
    if (done || disposed) return;
    sceneGame = createSceneGame(fileList, draftGame); sceneContext.game = sceneGame;
    scene.bindSceneContext(sceneContext);
    if(window.rzsh.function.alert !== alertScene)previousAlert=window.rzsh.function.alert;
    window.rzsh.function.alert=alertScene; window.我们敬爱你呀丞相=openSettings;
    sceneWindow.rzsh=window.rzsh;
    sceneWindow.noname_character_rank=structuredClone(window.noname_character_rank||sceneContext.lib.rank);
    lifecycle.portraits = createPortraitLoader(lifecycle);
    lifecycle.grid = createCharacterGrid(lifecycle);
    prepareCharacters(); status.remove();
     sceneContext.refreshCharacters();
     sceneContext.config.extension_如真似幻_menuInit ??= "0";
     scene.createScene(sceneContext.lib, sceneGame, sceneContext.ui, sceneContext.get, sceneContext.ai, sceneContext._status, node, lifecycle);
     const onlineReturn = sessionStorage.getItem("noname_online_return");
     if (onlineReturn) { sessionStorage.removeItem("noname_online_return"); void lifecycle.online(onlineReturn); }
   } catch (error) {
    fail(error);
   }
  },
  async dispose(node) { this.lifecycle?.dispose(); node?.remove(); return true; },
  preview(node) { node.style.backgroundImage = `url('${base()}images/background.jpg')`; }
 };
 (lib.onloadSplashes ||= []).push(splash);
 lib.config.splash_style = splash.id;
 installed = () => {
  if(disposed)return;disposed=true;activeScene?.dispose();sceneContext.dispose();
  if(window.rzsh?.function?.alert===alertScene)window.rzsh.function.alert=previousAlert;
  if(window.我们敬爱你呀丞相===openSettings){if(previousSettings===undefined)delete window.我们敬爱你呀丞相;else window.我们敬爱你呀丞相=previousSettings;}
  lib.onloadSplashes = lib.onloadSplashes.filter(item=>item!==splash); installed=undefined;
 };return installed;
}
export default function () {
 return {
  name: "如真似幻", editable: false,
  package: { nopack: true, author: workshopManifest.author, version: "3.0.0", intro: workshopManifest.description },
  async precontent() {
   if (lib.uiWorkshop) {
    const response = await fetch(base()+"ui-workshop.json");
    const manifest = response.ok ? await response.json() : workshopManifest;
    await lib.uiWorkshop.registerExtension(manifest, "如真似幻");
   }
   else await activate();
  },
  content() {},
  config: { workshop: { name: "打开 UI 工坊", clear: true, onclick() { lib.uiWorkshop?.open(); } } }
 };
}
