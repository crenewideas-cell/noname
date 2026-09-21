import { lib, game, ui, get, ai, _status } from "noname";
import { createSceneGame, prepareCharacters, createPortraitLoader, packLabel, openTools } from "./bridge.js";
import { createLobbyAudio, createCharacterGrid, addSessionButtons } from "./runtime.js";

export const type = "extension";
export const workshopManifest = {
 format: "noname-ui-workshop", version: 1, id: "rzsh-modern", name: "如真似幻",
 author: "蒸、某个萌新、非凡欧德内里、文和",
 description: "如真似幻 2.0.2 新式扩展。包含动画大厅、模式选择、天梯、梦之回廊、招募及原版设置。由 UI 工坊统一切换。",
 components: { home: { name: "如真似幻 · 交互大厅", runtime: "rzsh", settings: {}, assets: {}, style: {} } }
};
const base = () => `${lib.assetURL}extension/如真似幻/`;
let prepared, installed = false;
let fileList, sceneGame, activeScene;
const silentAudio = {add() {}, play() {}, stop() {}};
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
  sceneGame = createSceneGame(fileList);
  const scene = await import("./scenes.js");
  // The old alert used an audio path relative to its HTML login page.
  window.rzsh.function.alert = message => {
   if (_status.rzsh_alerting) return;
   _status.rzsh_alerting = true;
   const toast = document.createElement("div"); toast.className = "huanpaiwenzi";
   toast.textContent = String(message).replace(/<br\s*\/?>/g,"\n").replace(/<[^>]*>/g, ""); document.body.append(toast);
   sceneGame.playAudio("audio/sgs/Notice02.mp3");
   setTimeout(() => { toast.remove(); delete _status.rzsh_alerting; },3000);
  };
  for (const file of ["dynamicCorridor", "dream_corridor", "setting"]) {
   const module = await import(/* @vite-ignore */ `./js/${file}.js`);
   const pixi = new Proxy(globalThis.PIXI, {get(target,key) { return key === "sound" ? (activeScene?.sound || silentAudio) : Reflect.get(target,key); }});
   module.default(lib, sceneGame, ui, get, ai, _status, pixi);
  }
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
    settings() { const url = new URL(location.href); url.searchParams.set("lobbySettings", "options"); location.href = url.href; },
    restart() { game.reload(); },
    async skins() { const { openSkinGallery } = await import("../../noname/ui/skinGallery.js"); openSkinGallery(Object.keys(lib.characterPack).flatMap(key => Object.keys(lib.characterPack[key]))[0]); },
    async corridor() {
     // These skins belong to a separate extension and were not distributed in
     // the supplied package. Check them before the original Spine scene uses them.
     const entries = Object.values(window.dzxy_mzhl_dynamic || {}).flatMap(group => Object.values(group));
     const paths = [...new Set(entries.flatMap(entry => [entry.name, entry.beijing?.name]).filter(Boolean))];
     const missing = [];
     for (const path of paths) {
      try { const response = await fetch(`${lib.assetURL}${path}.skel`, {method:"HEAD"}); if (!response.ok) missing.push(path); }
      catch { missing.push(path); }
     }
     if (missing.length || !window.dzxy_mzhl) {
      window.rzsh.function.alert("梦之回廊需要的第三方动态皮肤未包含在原素材包中。补齐十周年 UI 的对应动态皮肤后可使用；现有武将与皮肤可通过底部“皮肤”浏览。");
      return;
     }
     window.dzxy_mzhl();
    },
    timeout(fn, ms, ...args) { const id = setTimeout(() => { timers.delete(id); if (!done) fn(...args); }, ms); timers.add(id); return id; },
    interval(fn, ms, ...args) { const id = setInterval(() => { if (!done) fn(...args); }, ms); intervals.add(id); return id; },
    frame(fn) { const id = requestAnimationFrame(t => { frames.delete(id); if (!done) fn(t); }); frames.add(id); return id; },
    finish(mode) { if (done || finishing) return; finishing = true; clearTimeout(resizing); lifecycle.sound.dispose(); resolve(mode); },
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
     lib.config.extension_如真似幻_menuInit ??= "0";
     scene.createScene(lib, sceneGame, ui, get, ai, _status, node, lifecycle);
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
 const { rankingContent } = await import("./scenes.js");
 lib.onload2.push(() => rankingContent({}, {}));
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
