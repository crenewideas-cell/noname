// Reference board: 1920 x 1080. These are the supplied seat templates,
// not samples of a curve. Seat zero is always the viewer at bottom right.
const SELF = [6, 'self'];
const TEMPLATES = {
 2: [SELF, [3, 12]],
 3: [SELF, [4, 12], [2, 12]],
 4: [SELF, [6, 220], [3, 12], [0, 220]],
 5: [SELF, [6, 220], [4, 12], [2, 12], [0, 220]],
 6: [SELF, [6, 220], [4.5, 60], [3, 12], [1.5, 60], [0, 220]],
 7: [SELF, [6, 220], [5, 80], [3.6, 12], [2.4, 12], [1, 80], [0, 220]],
 8: [SELF, [6, 220], [5, 80], [4, 12], [3, 12], [2, 12], [1, 80], [0, 220]],
};

export function compactSeatGeometry(width, height, count, { mode, landlordPosition = 0 } = {}) {
 count = Math.max(2, Math.trunc(Number(count) || 2));
 const unit = Math.max(.001, Math.min(width / 1920, height / 1080));
 let template = TEMPLATES[count];
 if (count === 3 && mode === 'doudizhu') {
  // Preserve next/previous order. The two farmer views are distinct.
  if (landlordPosition === 1) template = [SELF, [4, 12], [0, 220]];
  if (landlordPosition === 2) template = [SELF, [6, 220], [2, 12]];
 }
 if (!template) template = [SELF, ...Array.from({ length: count - 1 }, (_, i) =>
  [6 * (count - 2 - i) / (count - 2), Math.min(i, count - 2 - i) === 0 ? 220 : Math.min(i, count - 2 - i) === 1 ? 80 : 12])];
 const scale = 1.96 * unit * Math.min(1, 7 / (count - 1));
 const playerWidth = 128 * scale, playerHeight = 180 * scale;
 // Wide screens retain symmetric margins without stretching artwork.
 const inset = 16 * unit + Math.max(0, width - 1920 * unit) * .2;
 const span = Math.max(0, width - 2 * inset - playerWidth);
 const seats = template.map(([column, top]) => ({
  x: inset + span * column / 6,
  y: top === 'self' ? height - playerHeight - 12 * unit : top * unit,
 }));
 return { unit, scale, seats, playerWidth, playerHeight,
  cardScale: 1.8 * unit, discardScale: 1.49 * unit,
  handLeft: inset + 116 * unit, handRight: width - seats[0].x + 24 * unit };
}

const layouts = new WeakMap();
export function measureCompactSeats(arena, players = Array.from(arena.children), context = {}) {
 const seats = players.filter(node => node.matches('.player[data-position]:not(.minskin)'));
 const count = Math.max(Number(arena.dataset.number) || 0, ...seats.map(node => Number(node.dataset.position) + 1), 2);
 const game = context.game || layouts.get(arena)?.game;
 const modeOption = context.mode ?? layouts.get(arena)?.mode;
 const mode = typeof modeOption === 'function' ? modeOption() : modeOption;
 const landlord = game?.zhu || seats.find(node => node.identity === 'zhu');
 return compactSeatGeometry(arena.clientWidth, arena.clientHeight, count, {
  mode, landlordPosition: Number(landlord?.dataset.position) || 0,
 });
}
export function refreshCompactSeatLayout(arena) { layouts.get(arena)?.layout(); }
export function releaseCompactSeatLayout(arena) { layouts.get(arena)?.dispose(); }

/** Commit the full table before revealing players. Observer callbacks run
 * before paint, never defer position corrections to another animation frame.
 * Canonical dimensions avoid dependence on loading images, fonts or skins. */
export function installCompactSeatLayout({ game, ui, mode }) {
 const arena = ui.arena;
 const modeName = typeof mode === 'function' ? mode() : mode;
 if (!arena || game.chess || arena.classList.contains('chess') || ['chess', 'tafang'].includes(modeName)) return;
 if (layouts.has(arena)) {
  const current = layouts.get(arena); current.game = game;
  if (mode !== undefined) current.mode = mode;
  current.layout(); return;
 }
 let disposed = false, updating = false, observedControl, previousHandLayout, previousHand1, previousHand2;
 const originals = new Map(), variables = new Map();
 const properties = ['zoom', 'left', 'top', 'right', 'bottom', 'width', 'height', '--nysgs-buff-left', '--decade-passive-top'];
 const set = (node, key, value, priority = '') => {
  if (node.style.getPropertyValue(key) !== value || node.style.getPropertyPriority(key) !== priority) node.style.setProperty(key, value, priority);
 };
 const variable = (key, value) => {
  if (!variables.has(key)) variables.set(key, arena.style.getPropertyValue(key));
  set(arena, key, value);
 };
 function restore(player) {
  for (const [key, value, priority] of originals.get(player) || []) {
   if (value) player.style.setProperty(key, value, priority); else player.style.removeProperty(key);
  }
  delete player.dataset.seatReady; delete player.dataset.buffPlacement; originals.delete(player);
 }
 function layout() {
  if (disposed || updating) return;
  if (!arena.isConnected) { dispose(); return; }
  if (!arena.clientWidth || !arena.clientHeight) return;
  updating = true;
  try {
   const players = Array.from(arena.children).filter(node => node.matches('.player[data-position]:not(.minskin)'));
   for (const player of originals.keys()) if (!players.includes(player)) restore(player);
   const geometry = measureCompactSeats(arena, players);
   const { scale, unit, seats, cardScale, discardScale, handLeft, playerWidth } = geometry;
   // Reserve the local player's external rune panel before laying out hands.
   const self = players.find(player => player.dataset.position === '0');
   const buffPanel = self?.querySelector(':scope > .nysgs-buff-panel:not(:empty)');
   const passivePanel = self?.querySelector(':scope > .decade-passive-skills:not(:empty)');
   const handRight = geometry.handRight + Math.max(buffPanel ? 96 : 0, passivePanel ? 156 : 0) * scale;
   for (const player of players) {
    const seat = seats[Number(player.dataset.position)]; if (!seat) continue;
    if (!originals.has(player)) originals.set(player, properties.map(key => [key, player.style.getPropertyValue(key), player.style.getPropertyPriority(key)]));
    set(player, 'width', '128px', 'important'); set(player, 'height', '180px', 'important');
    set(player, 'zoom', String(scale), 'important');
    set(player, 'left', `${seat.x / scale}px`, 'important'); set(player, 'top', `${seat.y / scale}px`, 'important');
    set(player, 'right', 'auto', 'important'); set(player, 'bottom', 'auto', 'important');
   }
   if(self)set(self, '--decade-passive-top', `${buffPanel ? buffPanel.offsetTop + buffPanel.offsetHeight + 6 : 0}px`);
   // Other players' rune rows belong below their portraits. If that space is
   // occupied (including the local player's marks), use the space above only.
   const bounds = arena.getBoundingClientRect();
   const intersects = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
   const occupied = players.flatMap(player => [player, player.node?.marks].filter(Boolean).map(node => node.getBoundingClientRect()));
   for (const player of players) {
    if (player.dataset.position === '0') { delete player.dataset.buffPlacement; continue; }
    const panel = player.querySelector(':scope > .nysgs-buff-panel:not(:empty)');
    if (!panel) { delete player.dataset.buffPlacement; continue; }
    const frame = player.getBoundingClientRect(), row = panel.getBoundingClientRect();
    const zoom = frame.width / 128;
    const left = Math.max(bounds.left, Math.min(frame.left, bounds.right - row.width));
    set(player, '--nysgs-buff-left', `${(left - frame.left) / zoom}px`);
    const top = frame.bottom + 38 * zoom;
    const below = { left, right: left + row.width, top, bottom: top + row.height };
    const placement = below.bottom > bounds.bottom || occupied.some(rect => intersects(below, rect)) ? 'above' : 'below';
    if (player.dataset.buffPlacement !== placement) player.dataset.buffPlacement = placement;
   }
   variable('--table-unit', String(unit));
   variable('--table-card-scale', String(cardScale)); variable('--table-discard-scale', String(discardScale));
   variable('--table-hand-left', `${handLeft}px`); variable('--table-hand-right', `${handRight}px`);
   variable('--table-hand-height', `${174 * cardScale}px`);
   // Compatibility aliases used by decorations and the selection guide.
   variable('--ss-self-width', `${playerWidth}px`);
   variable('--ss-hand-left', `${handLeft}px`); variable('--ss-hand-right', `${handRight}px`);
   variable('--builtin-card-scale', String(cardScale));
   variable('--builtin-hand-left', `${handLeft}px`); variable('--builtin-hand-right', `${handRight}px`);
   const hasHand = !arena.classList.contains('choose-character') && ui.me?.querySelector('.handcards > .card:not(.removing)');
   const controlBottom = hasHand ? 174 * cardScale + 8 * unit : 12 * unit;
   variable('--table-control-bottom', `${controlBottom}px`);
   if (observedControl !== ui.control) {
    if (observedControl) resize.unobserve(observedControl);
    observedControl = ui.control; if (observedControl) resize.observe(observedControl);
   }
   variable('--builtin-dialog-bottom', `${controlBottom + (ui.control?.offsetHeight || 40) + 12}px`);
   for (const player of players) if (seats[Number(player.dataset.position)]) player.dataset.seatReady = 'true';
   const hand1 = ui.handcards1Container?.firstChild, hand2 = ui.handcards2Container?.firstChild;
   const handLayout = [arena.clientWidth, cardScale, handLeft, handRight, hand1?.childElementCount, hand2?.childElementCount].join(':');
   // Timer labels, damage popups and ornaments also mutate the arena. Do not
   // force layout for every hand card unless its geometry or contents changed.
   if (game.me && hand1 && hand2 && (handLayout !== previousHandLayout || hand1 !== previousHand1 || hand2 !== previousHand2)) {
    previousHandLayout = handLayout; previousHand1 = hand1; previousHand2 = hand2;
    ui.updatehl?.();
   }
  } finally { updating = false; }
 }
 const resize = new ResizeObserver(layout);
 const mutation = new MutationObserver(records => {
  if (records.some(record => record.type === 'childList' || record.attributeName !== 'class' || record.target === arena)) layout();
 });
 const detached = new MutationObserver(() => { if (!arena.isConnected) dispose(); });
 function dispose() {
  if (disposed) return;
  disposed = true; resize.disconnect(); mutation.disconnect(); detached.disconnect();
  window.removeEventListener('resize', layout);
  for (const player of originals.keys()) restore(player);
  for (const [key, value] of variables) { if (value) arena.style.setProperty(key, value); else arena.style.removeProperty(key); }
  arena.classList.remove('compact-seats'); layouts.delete(arena);
 }
 layouts.set(arena, { game, mode, layout, dispose });
 arena.classList.add('compact-seats'); ui.updatePlayerPositions?.();
 resize.observe(arena);
 window.addEventListener('resize', layout);
 mutation.observe(arena, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-position', 'data-number', 'class'] });
 detached.observe(document.body, { childList: true });
 if (arena.parentElement) detached.observe(arena.parentElement, { childList: true });
 layout();
}
