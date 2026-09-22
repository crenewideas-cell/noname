import { lib, game, get } from "noname";

export const baseURL = () => import.meta.url.slice(0, import.meta.url.lastIndexOf('/') + 1);
export function plainText(value) {
 const document = new DOMParser().parseFromString(String(value ?? ""), "text/html");
 return document.body.textContent.trim();
}
export function prepareCharacters() {
 // Register portrait metadata only; the core still owns loading skills and rules.
 for (const [name, pack] of Object.entries(lib.imported.character || {})) {
  if (pack.character) lib.characterPack[name] = pack.character;
 }
}
export function packLabel(name, translations) {
 const pack = lib.imported.character?.[name];
 return plainText(translations[name+"_character_config"] || pack?.translate?.[name] || lib.translate[name] || name);
}
function portrait(name, portraitJobs) {
 if (portraitJobs.has(name)) return portraitJobs.get(name);
 const job = (async () => {
  const info = get.character(name);
  const database = (info.trashBin || []).find(tag => tag.startsWith("db:"));
  if (database && !lib.config.skin?.[name]) {
   const image = await game.getDB("image", database.slice(3));
   if (typeof image === "string") return image;
  }
  // Use the engine's resolver: extension portraits, aliases, selected skins,
  // forms, thumbnails, and fallback layers use exactly the same paths.
  const node = document.createElement("div"); node.className = "button character";
  node.setBackground(name, "character");
  const candidates = [...node.style.backgroundImage.matchAll(/url\("((?:[^"\\]|\\.)*)"\)/g)].map(match => JSON.parse(`"${match[1]}"`));
  for (const url of candidates) {
   const loaded = await new Promise(resolve => {
    const image = new Image();
    const finish = result => { clearTimeout(timeout); image.onload = image.onerror = null; if (!result) image.src = ""; resolve(result); };
    const timeout = setTimeout(() => finish(false), 8000);
    image.onload = () => finish(true); image.onerror = () => finish(false); image.src = url;
   });
   if (loaded) return url;
  }
  return `${lib.assetURL}${lib.characterDefaultPicturePath}male.jpg`;
 })();
 portraitJobs.set(name, job); return job;
}
export function createPortraitLoader(lifecycle) {
 const queue = [], pending = new WeakSet(), textures = new Map(), waiting = new Set(), portraitJobs = new Map(), ownedTextures = new Set(), cancelLoads = new Set();
 const graphics = PIXI;
 let active = 0, disposed = false;
 function textureFromURL(url) {
  return new Promise((resolve,reject)=>{
   const image=new Image();image.crossOrigin='anonymous';
   const finish=error=>{clearTimeout(timer);cancelLoads.delete(cancel);image.onload=image.onerror=null;if(error){image.src='';reject(error);}else resolve(new graphics.Texture(new graphics.BaseTexture(image)));};
   const cancel=()=>finish(new Error('武将立绘加载已取消'));
   const timer=setTimeout(cancel,15000);cancelLoads.add(cancel);
   image.onload=()=>finish();image.onerror=()=>finish(new Error('武将立绘加载失败'));image.src=url;
  });
 }
 const fit = sprite => {
  const box = sprite.workshopPortraitBox;
  if (!box) return;
  const scale = Math.max(box.width / Math.max(1,sprite.texture.orig.width), box.height / Math.max(1,sprite.texture.orig.height));
  sprite.anchor.set(0.5); sprite.scale.set(scale);
  sprite.position.set(box.x + box.width/2, box.y + box.height/2);
 };
 const attached = sprite => {
  let root = sprite;
  while (root.parent) root = root.parent;
  return root === lifecycle.app?.stage;
 };
 const pump = () => {
  while (!disposed && active < 4 && queue.length) {
   const sprite = queue.shift();
   if (sprite.destroyed || sprite.workshopPortraitLoaded || !attached(sprite)) { pending.delete(sprite); continue; }
   const name = sprite.workshopCharacter;
   active++;
   const job = textures.get(name) || portrait(name, portraitJobs).then(url => {
    if(disposed)return null;
    return textureFromURL(url).then(texture=>{if(disposed){texture.destroy(true);return null;}ownedTextures.add(texture);return texture;});
   });
   textures.set(name, job);
   job.then(texture => {
    if (!disposed && !sprite.destroyed && texture) { sprite.texture = texture; fit(sprite); sprite.workshopPortraitLoaded = true; }
    waiting.delete(sprite);
   }).catch(() => { textures.delete(name); waiting.delete(sprite); }).finally(() => { active--; pending.delete(sprite); pump(); });
  }
 };
 const request = sprite => {
  if (disposed || !sprite || sprite.destroyed || sprite.workshopPortraitLoaded || pending.has(sprite)) return;
  waiting.add(sprite);
  if (!attached(sprite)) return;
  pending.add(sprite); queue.push(sprite); queueMicrotask(pump);
 };
 lifecycle.interval(() => {
  for (const sprite of waiting) {
   if (sprite.destroyed || sprite.workshopPortraitLoaded) waiting.delete(sprite);
   else request(sprite);
  }
 }, 100);
 return {
  sprite(name) {
   const sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
   sprite.workshopCharacter = name;
   request(sprite);
   return sprite;
  },
  request,
  fit(sprite, card) {
   const box = {x:31, y:3, width:Math.max(1,card.texture.orig.width-34), height:Math.max(1,card.texture.orig.height-6)};
   const clip = new PIXI.Graphics();
   clip.beginFill(0xffffff).drawRoundedRect(box.x,box.y,box.width,box.height,3).endFill();
   card.addChild(clip); sprite.mask = clip; sprite.workshopPortraitBox = box; fit(sprite);
  },
  dispose() { disposed = true; queue.length = 0; for(const cancel of [...cancelLoads])cancel();for(const texture of ownedTextures)texture.destroy(true);ownedTextures.clear();textures.clear();portraitJobs.clear();waiting.clear(); }
 };
}
export function createSceneGame(files, sceneGame) {
 const sounds=new Set();
 return new Proxy(sceneGame, { get(target, key) {
  if(key==='stopSceneAudio')return()=>{for(const audio of sounds){audio.pause();audio.removeAttribute('src');}sounds.clear();};
  if (key === "getFileList") return (directory, callback) => {
   const prefix = directory.replace(/^.*extension\/如真似幻\//, "").replace(/\/$/, "") + "/";
   const children = files.filter(path => path.startsWith(prefix)).map(path => path.slice(prefix.length));
   callback([...new Set(children.filter(path => path.includes("/")).map(path => path.split("/")[0]))], children.filter(path => !path.includes("/")));
  };
  if (key === "playAudio") return (...args) => {
   const path = args.filter(arg => typeof arg === "string").join("/");
   if(!/^audio\//.test(path))return game.playAudio({path,addVideo:false});
   const audio=new Audio(new URL(path, new URL(baseURL(),location.href)).href);audio.volume=Math.max(0,Math.min(1,(lib.config.volumn_audio||0)/8));sounds.add(audio);
   const release=()=>{audio.pause();audio.removeAttribute('src');sounds.delete(audio);};audio.onended=release;audio.onerror=release;void audio.play().catch(release);return audio;
  };
  return Reflect.get(target, key);
 } });
}
export function openTools(onSettings, onOriginal) {
 document.querySelector(".rzsh-tool-menu")?.remove();
 const overlay = document.createElement("div"); overlay.className = "rzsh-tool-menu";
 overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-label", "如真似幻菜单");
 const panel = document.createElement("section"); overlay.append(panel);
 const title = document.createElement("h2"); title.textContent = "如真似幻"; panel.append(title);
 const add = (label, run) => {
  const button = document.createElement("button"); button.textContent = label;
  button.onclick = () => { overlay.remove(); run(); }; panel.append(button);
 };
 add("UI 工坊", () => lib.uiWorkshop.open());
 add("游戏设置", onSettings);
 add("如真似幻设置", () => window.我们敬爱你呀丞相?.());
 if (onOriginal) add("原版功能菜单", onOriginal);
 add("返回大厅", () => {});
 overlay.onclick = event => { if (event.target === overlay) overlay.remove(); };
 overlay.onkeydown = event => { if (event.key === "Escape") overlay.remove(); };
 document.body.append(overlay); panel.querySelector("button").focus();
}
