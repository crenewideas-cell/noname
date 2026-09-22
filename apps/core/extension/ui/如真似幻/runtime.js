// Resources owned by one lobby visit. They never outlive the game handoff.
export function createLobbyAudio(node) {
 const sounds = new Map(), blocked = new Set();
 let disposed = false;
 const stop = audio => { blocked.delete(audio); audio.pause(); audio.currentTime = 0; };
 const play = audio => {
  if (disposed) return;
  const attempt = audio.play();
  attempt?.catch(error => {
   if (!disposed && error.name === "NotAllowedError") blocked.add(audio);
  });
 };
 const unlock = () => { for (const audio of blocked) { blocked.delete(audio); play(audio); } };
 node.addEventListener("pointerdown", unlock);
 return {
  add(name, options) {
   if (disposed) return;
   if (sounds.has(name)) stop(sounds.get(name));
   const audio = new Audio(options.url);
   audio.preload = "none";
   audio.loop = Boolean(options.loop);
   audio.volume = Math.max(0, Math.min(1, options.volume ?? 1));
   sounds.set(name, audio);
   return audio;
  },
  play(name) { const audio = sounds.get(name); if (!disposed && audio) { stop(audio); play(audio); } },
  stop(name) { const audio = sounds.get(name); if (audio) stop(audio); },
  dispose() {
   disposed = true;
   node.removeEventListener("pointerdown", unlock);
   for (const audio of sounds.values()) { stop(audio); audio.removeAttribute("src"); audio.load(); }
   sounds.clear(); blocked.clear();
  }
 };
}

// Only visible rows (plus one row on either side) create cards or request portraits.
export function createCharacterGrid(lifecycle) {
 const PIXI = lifecycle.graphics;
 const grids = new Map();
 return {
  show(cards, container, scrollbox, scaleX, scaleY) {
   grids.get(container)?.dispose();
   container.removeChildren();
   const rowHeight = 192 * scaleY, columnWidth = 189 * scaleX, top = 14 * scaleY;
   const height = Math.max(scrollbox.boxHeight, top + Math.ceil(cards.length / 4) * rowHeight);
   // A zero-alpha Graphics fill has no geometry in this PIXI version. Use a
   // real rectangle for bounds and explicitly size the underlying Viewport.
   const extent = new PIXI.Sprite(PIXI.Texture.WHITE);
   extent.width = scrollbox.boxWidth; extent.height = height; extent.alpha = 0;
   container.addChild(extent);
   scrollbox.resize({scrollWidth:scrollbox.boxWidth, scrollHeight:height});
   scrollbox.scrollTop = 0;
   const visible = new Set();
   let lastRow = -1;
   const animate = (card, enabled) => {
    for (const child of card.children) {
     if (child instanceof PIXI.AnimatedSprite) enabled ? child.play() : child.stop();
    }
   };
   const update = () => {
    if (!container.worldVisible || !container.parent) return;
    // A detached page is still locally visible, so also check stage membership.
    let root = container;
    while (root.parent) root = root.parent;
    if (root !== lifecycle.app?.stage) {
     if (lastRow !== -1) visible.forEach(card => animate(card, false));
     lastRow = -1; return;
    }
    const row = Math.max(0, Math.floor(scrollbox.scrollTop / rowHeight) - 1);
    if (row === lastRow) return;
    lastRow = row;
    const first = row * 4, end = Math.min(cards.length, (row + Math.ceil(scrollbox.boxHeight / rowHeight) + 3) * 4);
    const next = new Set(cards.slice(first, end));
    for (const card of visible) if (!next.has(card)) { container.removeChild(card); animate(card, false); }
    visible.clear();
    for (let index = first; index < end; index++) {
     const card = cards[index];
     if (card.workshopBuild) { card.workshopBuild(); delete card.workshopBuild; }
     card.position.set(2 * scaleX + (index % 4) * columnWidth, top + Math.floor(index / 4) * rowHeight);
     if (card.parent !== container) container.addChild(card);
     lifecycle.portraits.request(card.getChildByName("avatar"));
     animate(card, true); visible.add(card);
    }
   };
   const ticker = lifecycle.ticker(); ticker.add(update); ticker.start(); update();
   grids.set(container, { dispose() {
    ticker.stop(); ticker.remove(update);
    visible.forEach(card => animate(card, false));
    extent.destroy();
   } });
  },
  dispose() { grids.forEach(grid => grid.dispose()); grids.clear(); }
 };
}

export function addSessionButtons(lifecycle, parent, x, y, scale) {
 const PIXI = lifecycle.graphics;
 const group = lifecycle.container();
 group.position.set(x, y); group.scale.set(scale);
 const add = (label, offset, action) => {
  const button = new PIXI.Graphics();
  button.lineStyle(2, 0xa88b59).beginFill(0x292018, 0.95).drawRoundedRect(0, 0, 100, 30, 4).endFill();
  button.interactive = true; button.buttonMode = true;
  const text = new PIXI.Text(label, {fontFamily:"shousha", fontSize:19, fill:0xead39d});
  text.anchor.set(0.5); text.position.set(50, 15); button.addChild(text);
  button.x = offset; button.on("pointertap", action); group.addChild(button);
 };
 add("人机对战", -105, () => lifecycle.offline());
 add("联机对战", 5, () => lifecycle.online("identity"));
 parent.addChild(group);
}
