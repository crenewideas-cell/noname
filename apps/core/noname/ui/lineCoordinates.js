/** Convert the displayed seat centres to the actual line container's CSS
 * coordinates. offsetLeft/getLeft omit per-player zoom and transforms. */
export function playerLinePath(source, target, parent) {
 if (!parent?.getBoundingClientRect) return null;
 const box=parent.getBoundingClientRect();
 const sx=box.width/parent.offsetWidth,sy=box.height/parent.offsetHeight;
 if (!(sx>0&&sy>0&&Number.isFinite(sx)&&Number.isFinite(sy))) return null;
 const centre=node=>{
  const r=node.getBoundingClientRect();
  return [(r.left+r.width/2-box.left)/sx-(parent.clientLeft||0)+(parent.scrollLeft||0),
   (r.top+r.height/2-box.top)/sy-(parent.clientTop||0)+(parent.scrollTop||0)];
 };
 const path=[...centre(source),...centre(target)];
 return path.every(Number.isFinite)?path:null;
}

/** The compact board scales seats with zoom and animated cards with scale.
 * Return translations in the card's coordinates, using the same displayed
 * seat centres as targeting lines. Keep other layouts on their legacy path. */
export function cardMoveOffset(card, player) {
 const parent = card.offsetParent;
 if (!parent?.classList.contains('compact-seats') || card.parentNode !== parent) return null;
 const path = playerLinePath(player, player, parent);
 if (!path) return null;
 const scales = getComputedStyle(card).scale.split(/\s+/).map(Number);
 const sx = scales[0] > 0 ? scales[0] : 1;
 const sy = scales[1] > 0 ? scales[1] : sx;
 return [(path[0] - card.offsetLeft - card.offsetWidth / 2) / sx,
  (path[1] - card.offsetTop - card.offsetHeight / 2) / sy];
}
