// The scene's animation coordinates stay fixed; only the viewport and edge
// attachments adapt. Pivots keep this independent of GSAP's x/y transitions.
export function createLobbyViewport(app, screen, fitBackground) {
 const originals = new WeakMap();
 let home, extraX = 0, extraY = 0;
 function move(node, x, y, stretchX, stretchY) {
  if (!node || node.destroyed) return;
  let base = originals.get(node);
  if (!base) {
   base = { x: node.pivot.x, y: node.pivot.y, sx: node.scale.x, sy: node.scale.y };
   originals.set(node, base);
  }
  if (stretchX !== undefined) node.scale.x = base.sx * stretchX;
  if (stretchY !== undefined) node.scale.y = base.sy * stretchY;
  // Entry animations can briefly collapse a sprite to zero size.
  node.pivot.set(base.x - x / (node.scale.x || 1), base.y - y / (node.scale.y || 1));
 }
 function update() {
  if (!home) return;
  move(home.top, -extraX / 2, -extraY / 2);
  // The authored header separates the profile/currency block from the tools
  // after x=800; the footer separates chat from its toolbar at x=500.
  for (const child of home.top.children) move(child, child.x > 800 ? extraX : 0, 0);
  move(home.left, -extraX / 2, 0);
  for (const child of home.left.children) {
   if (child.name === 'left_fix' || child.name === 'leftlong') move(child, 0, 0, 1, (screen.height + extraY) / screen.height);
  }
  move(home.decoration, -extraX / 2, -extraY / 2);
  move(home.right, extraX / 2, 0);
  move(home.bottom, -extraX / 2, extraY / 2);
  for (const child of home.bottom.children) {
   if (child.name === 'bottom_bg') move(child, extraX / 2, 0, (screen.width + extraX) / screen.width);
   else move(child, child.x >= 500 ? extraX : 0, 0);
  }
  for (const child of home.center.children) {
   if (/^right_(classic|ranking|activity|adventure)$/.test(child.name)) move(child, extraX / 2, extraY / 2);
  }
 }
 return {
  home(nodes) { home = nodes; update(); },
  update,
  resize(width, height) {
   const scale = Math.min(width / screen.width, height / screen.height);
   extraX = width / scale - screen.width;
   extraY = height / scale - screen.height;
   app.renderer.resize(width, height);
   app.stage.scale.set(scale);
   app.stage.position.set(extraX * scale / 2, extraY * scale / 2);
   app.view.style.width = `${width}px`;
   app.view.style.height = `${height}px`;
   update();
  },
  cover(sprite) {
   fitBackground(sprite, { width: screen.width + extraX, height: screen.height + extraY,
    centerX: screen.width / 2, centerY: screen.height / 2 });
  },
 };
}
