// Frame-following effects are separate from the portrait and fixed ornaments.
const nativeFrames = new WeakMap();

export function registerPortraitFrame(player, size) {
  nativeFrames.set(player, size);
  return () => { if (nativeFrames.get(player) === size) nativeFrames.delete(player); };
}

export function followPortraitEffect(sprite, player, scale = 1, referenceWidth = 180) {
  const update = sprite.update;
  sprite.update = function (event) {
    const rect = player.getBoundingClientRect(), base = nativeFrames.get(player);
    // Preserve the effect's original vertical size while extending the frame
    // horizontally. Recompute during every draw, including resize/transitions.
    const nativeWidth = base ? base.width * rect.height / base.height : rect.width;
    this.scale = nativeWidth / referenceWidth * scale;
    update.call(this, event);
    if (base && nativeWidth > 0) this.mvp.scale(rect.width / nativeWidth, 1, 1);
  };
  return sprite;
}
