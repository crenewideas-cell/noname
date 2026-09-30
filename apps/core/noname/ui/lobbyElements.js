import { createLobbyLayout } from './lobbyLayout.js';

export const lobbyLoadingTips = Object.freeze([
 '三国杀是一款流行的桌面卡牌游戏，基于三国历史背景。',
 '在三国杀中，玩家需要策略地使用各种角色卡牌来击败对手。',
 '诸葛亮、曹操和刘备是三国杀中的著名角色。',
 '游戏中的卡牌包括杀、闪、桃等各种不同的功能。',
 '每位角色都有独特的技能和特点，增加了游戏的变化性。',
 '三国杀的策略性和战术性使其成为一款受欢迎的卡牌游戏。',
 '在三国杀中，胜利需要巧妙地使用卡牌和角色技能。',
 '游戏中的合作和背叛元素增加了战局的紧张感。',
 '使用你喜欢的武将，积累武将经验，可以获得炫酷的武将表现效果',
 '付费购买的武将及招募的武将均可以分解成一定数量的将魂',
 '开通会员后，可以加速等级的提升哦',
]);

export function fitLobbyBackground(sprite, { width, height, centerX = width / 2, centerY = height / 2 }, fit = 'cover') {
 if (fit === 'stretch') {
  sprite.width = width;
  sprite.height = height;
 } else {
  const scale = Math.max(width / Math.max(1, sprite.texture.width), height / Math.max(1, sprite.texture.height));
  sprite.scale.set(scale);
  sprite.anchor.set(0.5);
  sprite.position.set(centerX, centerY);
 }
 return sprite;
}

// Atlas content and action handlers belong to the theme; the UI templates do not.
export function createLobbyElements(PIXI, theme) {
 const layout = createLobbyLayout(theme);
 function button(node, { down, up } = {}) {
  node.interactive = true;
  if (down) node.on('pointerdown', down);
  if (up) node.on('pointerup', up);
  return node;
 }
 function sprite(atlas, name, options = {}) {
  const node = options.animated ? PIXI.AnimatedSprite.fromFrames(atlas[name]) : new PIXI.Sprite(atlas[name]);
  node.name = name;
  if (options.anchor !== undefined) node.anchor.set(options.anchor);
  if (options.animated) {
   node.animationSpeed = options.speed ?? 0.5;
   node.play();
  }
  if (options.interactive || options.down || options.up) button(node, options);
  return node;
 }
 function place(node, { x = 1, y = 1, raw = false, handlers } = {}) {
  if (!node) return;
  if (handlers) button(node, handlers);
  const spec = layout[node.name];
  if (!spec) return;
  let px = x, py = y, sx = x, sy = y;
  if (raw) px = py = sx = sy = 1;
  else if (theme === 'rzsh') {
   // The left rail joins the header and footer. Its vertical extent follows
   // the stage height; treating it as an icon leaves gaps on narrower screens.
   if (!/bg|kuang/.test(node.name) && node.name !== 'left_fix') sx = sy = Math.min(x, y);
  } else {
   const menu = /menuyi|menuer|menusan|menusi|menuwu/.test(node.name);
   if (menu) py = x;
   // Only structural backdrops stretch with the layout. Mode illustrations,
   // portraits, text and buttons must retain their atlas aspect ratio.
   if (!/bg|kuang|leftlong/.test(node.name)) sx = sy = Math.min(x, y);
  }
  node.x = spec.x * px;
  node.y = spec.y * py;
  node.anchor.set(0.5);
  node.scale.set(spec.scale * sx, spec.scale * sy);
 }
 function center(node, scale) {
  node.anchor.set(0.5);
  node.scale.set(scale);
 }
 function idle(spineData, screen, { x = 0.5, y = 0.5, scale = 0.8 } = {}) {
  const node = new PIXI.spine.Spine(spineData);
  node.state.setAnimation(0, 'idle', true);
  positionIdle(node, screen, { x, y, scale });
  return node;
 }
 function positionIdle(node, screen, { x = 0.5, y = 0.5, scale = 0.8 } = {}) {
  node.position.set(screen.width * x, screen.height * y);
  node.scale.set(scale);
 }
 function randomTip(count = lobbyLoadingTips.length) {
  return lobbyLoadingTips[Math.floor(Math.random() * count)];
 }
 function tip(screen, { y = 0.95, fontSize = 17, fill = '#DAA520' } = {}) {
  const node = new PIXI.Text(randomTip(), { fontSize, fill, fontFamily: 'shousha' });
  node.anchor.set(0.5);
  node.position.set(screen.width * 0.51, screen.height * y);
  return node;
 }
 function background(texture, screen, fit = 'stretch') {
  return fitLobbyBackground(new PIXI.Sprite(texture), screen, fit);
 }
 return { layout, sprite, button, place, center, idle, positionIdle, randomTip, tip, background };
}
