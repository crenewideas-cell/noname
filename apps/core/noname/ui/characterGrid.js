// Only visible rows (plus one row on either side) create cards or request portraits.
export function createCharacterGrid(lifecycle) {
 const PIXI = lifecycle.graphics;
 const grids = new Map();
 return {
  show(cards, container, scrollbox, scaleX, scaleY, { columnWidth = 189, columns = 4 } = {}) {
   grids.get(container)?.dispose();
   container.removeChildren();
   const rowHeight = 192 * scaleY, columnSpacing = columnWidth * scaleX, top = 14 * scaleY;
   const height = Math.max(scrollbox.boxHeight, top + Math.ceil(cards.length / columns) * rowHeight);
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
    if (card.destroyed) return;
    for (const child of card.children) {
     if (child instanceof PIXI.AnimatedSprite) enabled ? child.play() : child.stop();
    }
   };
   const update = () => {
    if (!container.worldVisible || !container.parent) {
     if (lastRow !== -1) visible.forEach(card => animate(card, false));
     lastRow = -1; return;
    }
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
    const first = row * columns, end = Math.min(cards.length, (row + Math.ceil(scrollbox.boxHeight / rowHeight) + 3) * columns);
    const next = new Set(cards.slice(first, end));
    for (const card of visible) if (!next.has(card)) { container.removeChild(card); animate(card, false); }
    visible.clear();
    for (let index = first; index < end; index++) {
     const card = cards[index];
     if (card.workshopBuild) { card.workshopBuild(); delete card.workshopBuild; }
     card.position.set(2 * scaleX + (index % columns) * columnSpacing, top + Math.floor(index / columns) * rowHeight);
     if (card.parent !== container) container.addChild(card);
     lifecycle.portraits?.request(card.getChildByName("avatar"));
     animate(card, true); visible.add(card);
    }
   };
   const ticker = lifecycle.ticker(); ticker.add(update); ticker.start(); update();
   grids.set(container, { dispose() {
    ticker.stop(); ticker.remove(update);
    if (lifecycle.releaseTicker) lifecycle.releaseTicker(ticker); else ticker.destroy();
    visible.forEach(card => animate(card, false));
    extent.destroy();
   } });
  },
  dispose() { grids.forEach(grid => grid.dispose()); grids.clear(); }
 };
}

