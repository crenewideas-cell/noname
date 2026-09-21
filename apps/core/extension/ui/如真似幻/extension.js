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
const base = () => `${lib.assetURL}extension/如真似幻/`;
let prepared, installed = false;
let fileList, sceneGame, activeScene, sceneContext;
function script(file) {
 return new Promise((resolve, reject) => {
  const node = document.createElement("script"); node.src = base() + file;
  node.onload = resolve; node.onerror = () => { node.remove(); reject(new Error(`如真似幻资源加载失败：${file}`)); };
  document.head.append(node);
 });
}
async function prepare() {
 if (!prepared) prepared = (async () => {
  await script("js/gsap.min.js");
  await script("js/pixi6.min.js");
  const response = await fetch(base()+"files.json"); if (!response.ok) throw new Error("如真似幻文件清单缺失"); fileList = await response.json();
  sceneContext = createSceneContext({lib,game,ui,get}, {settingsKey:"ui_workshop_rzsh_settings", actions:{reload:()=>game.reload()}});
  sceneGame = createSceneGame(fileList, sceneContext.game);
  sceneContext.game = sceneGame;
  const scene = await import("./scenes.js");
  scene.bindSceneContext(sceneContext);
  // The old alert used an audio path relative to its HTML login page.
  window.rzsh.function.alert = message => {
   if (sceneContext._status.rzsh_alerting) return;
   sceneContext._status.rzsh_alerting = true;
   const toast = document.createElement("div"); toast.className = "huanpaiwenzi";
   toast.textContent = String(message).replace(/<br\s*\/?>/g,"\n").replace(/<[^>]*>/g, ""); document.body.append(toast);
   sceneGame.playAudio("audio/sgs/Notice02.mp3");
   setTimeout(() => { toast.remove(); delete sceneContext._status.rzsh_alerting; },3000);
  };
  window.我们敬爱你呀丞相 = () => lib.uiWorkshop.openSettings("options");
  return scene;
 })().catch(error => { prepared = undefined; throw error; });
 return prepared;
}
export async function activate() {
 if (installed) return;
 installed = true;
 const splash = {
  id: "rzsh-modern", name: "如真似幻", lifecycle: null,
  async init(node, resolve, restore = {}) {
   node.classList.add("rzsh-modern-splash");
   const links = ["font", "dream_corridor", "setting", "modern"].map(file => {
    const link = document.createElement("link"); link.rel = "stylesheet"; link.href = base()+`css/${file}.css`; document.head.append(link); return link;
   });
   const timers = new Set(), intervals = new Set(), frames = new Set();
   const loaders = new Set(), tickers = new Set(), containers = new Set(), backgrounds = new Set(), animations = new Set(), owned = new Set();
   // Match the original 1103 × 514 layout units while allowing the viewport
   // aspect ratio to determine its width. The stage itself scales uniformly.
   const screen = {x:0, y:0, width:514 * (node.clientWidth || 1103) / (node.clientHeight || 514), height:514};
   let viewport = {width:screen.width,height:screen.height,scale:1};
   const views = new Map();
   let pendingView = restore.view || "home", activeView = restore.view || "home", resizing, finishing = false, homeReady = false;
   let observer, onlineController, onlineOpen = false, resizeScene;
   let done = false;
   const lifecycle = this.lifecycle = {
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
        const state = {view:pendingView || activeView, mode:window.moode};
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
     loader.load = callback => load((...args) => { if (!done) callback?.(...args); });
     loaders.add(loader); return loader;
    },
    ticker() { const ticker = new PIXI.Ticker(); tickers.add(ticker); return ticker; },
    container() { const container = new PIXI.Container(); containers.add(container); return container; },
    packLabel,
    sessionButtons(parent, x, y, scale) { addSessionButtons(lifecycle, parent, x, y, scale); },
    offline() { game.saveConfig("sessionType", "offline"); window.moode = "shenfen"; lifecycle.showView("mode"); },
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
    markHomeReady() { homeReady = true; if (pendingView) this.showView(pendingView); },
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
     if (restore.mode) { window.moode = restore.mode; delete restore.mode; }
     if (view.container.parent !== lifecycle.app?.stage) view.enter();
     activeView = name;
    },
    optionalSpine(loader, name, path) { throw new Error("此动态皮肤未随原素材包提供"); },
    openTools(onOriginal) { openTools(() => lifecycle.settings(), onOriginal); },
    settings() { return lib.uiWorkshop.openSettings("options"); },
    restart() { game.reload(); },
    character(name) { return lib.uiWorkshop.openSkins(name); },
    skins() { return lib.uiWorkshop.openSkins(Object.keys(lib.characterPack).flatMap(key => Object.keys(lib.characterPack[key]))[0]); },
    corridor() { return lifecycle.skins(); },
    timeout(fn, ms, ...args) { const id = setTimeout(() => { timers.delete(id); if (!done) fn(...args); }, ms); timers.add(id); return id; },
    interval(fn, ms, ...args) { const id = setInterval(() => { if (!done) fn(...args); }, ms); intervals.add(id); return id; },
    frame(fn) { const id = requestAnimationFrame(t => { frames.delete(id); if (!done) fn(t); }); frames.add(id); return id; },
    async finish(mode) { if (done || finishing) return; finishing = true; try { await sceneContext.commitMode(mode); clearTimeout(resizing); lifecycle.sound.dispose(); resolve(mode); } catch(error) { finishing=false;window.rzsh.function.alert(error.message); } },
    dispose(resize = false) {
     if (done) return; done = true;
     onlineController?.close();
     if (activeScene === lifecycle) activeScene = null;
     clearTimeout(resizing); lifecycle.sound.dispose(); lifecycle.portraits?.dispose(); lifecycle.grid?.dispose();
     timers.forEach(clearTimeout); intervals.forEach(clearInterval); frames.forEach(cancelAnimationFrame);
     observer?.disconnect(); loaders.forEach(loader => loader.destroy()); tickers.forEach(ticker => ticker.destroy());
     animations.forEach(animation => animation.kill());
     containers.forEach(container => { if (!container.destroyed) container.destroy({children:true}); });
     owned.forEach(sprite => { if (!sprite.destroyed) sprite.destroy({children:true}); });
     lifecycle.app?.destroy(true, { children: true, texture: !resize, baseTexture: !resize }); lifecycle.app = null;
     for (const key of ["currentSprite", "isOnhide", "bbgp", "container", "moode"]) delete window[key];
     links.forEach(link => link.remove()); status.remove(); document.querySelector(".rzsh-tool-menu")?.remove();
    }
   };
   activeScene = lifecycle;
   const status = document.createElement("div"); status.className = "rzsh-loading"; status.textContent = "正在准备如真似幻…"; node.append(status);
   try {
    const scene = await prepare();
    if (done) return;
    lifecycle.portraits = createPortraitLoader(lifecycle);
    lifecycle.grid = createCharacterGrid(lifecycle);
    prepareCharacters(); status.remove();
     sceneContext.refreshCharacters();
     sceneContext.config.extension_如真似幻_menuInit ??= "0";
     scene.createScene(sceneContext.lib, sceneGame, sceneContext.ui, sceneContext.get, sceneContext.ai, sceneContext._status, node, lifecycle);
     const onlineReturn = sessionStorage.getItem("noname_online_return");
     if (onlineReturn) { sessionStorage.removeItem("noname_online_return"); void lifecycle.online(onlineReturn); }
   } catch (error) {
    status.textContent = `如真似幻加载失败：${error.message}`; node.append(status);
    const recover = document.createElement("button"); recover.textContent = "打开 UI 工坊"; recover.onclick = () => lib.uiWorkshop?.open(); status.append(recover);
    console.error(error);
   }
  },
  async dispose(node) { this.lifecycle?.dispose(); node.remove(); return true; },
  preview(node) { node.style.backgroundImage = `url('${base()}images/background.jpg')`; }
 };
 lib.onloadSplashes.push(splash);
 lib.config.splash_style = splash.id;
 return () => { activeScene?.dispose(); lib.onloadSplashes = lib.onloadSplashes.filter(item=>item!==splash); installed=false; };
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
