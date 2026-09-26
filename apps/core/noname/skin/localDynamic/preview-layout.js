// Reflow existing Qianhuan elements; never create another preview or control.
export function layoutPreview(portrait, presentation, onLayout) {
  const avatar = portrait.closest('.qh-shousha-big-avatar');
  const view = avatar?.closest('.qh-window');
  if (!view) return () => {};
  const landscape = presentation.orientation === 'landscape';
  const interaction = view.classList.contains('qh-interaction');
  const original = Object.fromEntries(['width', 'height', 'left', 'top', 'fontSize'].map(key => [key, view.style[key]]));
  const baseWidth = view.clientWidth, baseHeight = view.clientHeight, baseFont = parseFloat(getComputedStyle(view).fontSize);
  const maxPortraitRatio = avatar.offsetHeight / Math.max(1, avatar.offsetWidth);
  const labels = [...avatar.querySelectorAll('.qh-avatar-label,.qh-avatar-label-other')];
  for (const label of labels) label.style.setProperty('--local-frame-image', getComputedStyle(label).backgroundImage);
  function resize() {
    // The game applies a global zoom and a minimum virtual width. Work in the
    // same local coordinates, but keep the whole existing window on screen.
    const rect = view.getBoundingClientRect(), parent = view.parentElement.getBoundingClientRect();
    const scale = rect.width / view.clientWidth || 1;
    const parentScale = parent.width / view.parentElement.clientWidth || 1;
    const narrow = innerWidth / innerHeight < 1.2;
    const w = interaction ? innerWidth * .98 / scale : Math.min(baseWidth, innerWidth / scale), h = interaction ? innerHeight * .98 / scale : narrow ? innerHeight * .92 / scale : Math.min(baseHeight, innerHeight * .92 / scale);
    if (!w || !h) return;
    Object.assign(view.style, { width: w + 'px', height: h + 'px', left: (innerWidth / 2 - parent.left) / parentScale + 'px', top: (innerHeight / 2 - parent.top) / parentScale + 'px', fontSize: (narrow ? Math.max(baseFont, 12 / scale) : baseFont) + 'px' });
    const stacked = narrow;
    // Match the frame to the subject ratio before cover-scaling. A very tall
    // character should not be enlarged several times merely to fill a wide card.
    const aspect = Math.max(.18, Math.min(3, presentation.focus.width / presentation.focus.height));
    const maxWidth = w * (interaction ? .96 : stacked ? .86 : landscape ? .55 : .30);
    const maxHeight = h * (interaction ? .80 : stacked ? .43 : landscape ? .76 : .93);
    const contentHeight = Math.min(maxHeight - 36, (maxWidth - 36) / aspect);
    let width = contentHeight * aspect + 36, height = contentHeight + 36;
    // A portrait frame may widen, but must never become taller/narrower than the native frame.
    if (!landscape && height > width * maxPortraitRatio) {
      width = Math.min(maxWidth, height / maxPortraitRatio);
      height = Math.min(height, width * maxPortraitRatio);
    }
    view.classList.toggle('local-skin-stacked', stacked);
    view.style.setProperty('--local-preview-width', width + 'px');
    view.style.setProperty('--local-preview-height', height + 'px');
    view.style.setProperty('--local-preview-left', (interaction || stacked ? (w - width) / 2 : landscape ? w * .07 + (maxWidth - width) / 2 : w * .30 - width / 2) + 'px');
    view.style.setProperty('--local-preview-top', (interaction ? h * .005 + (maxHeight-height)/2 : stacked ? h * .06 : (h - height) / 2) + 'px');
    // Local portraits have their own border: transfer the painting's inner
    // ratio, not this preview's additional 18px border on each side.
    onLayout?.({aspect:landscape?(width-36)/(height-36):width/height,version:3});
  }
  view.classList.add('local-skin-adapted'); view.classList.toggle('local-skin-landscape', landscape); resize();
  view.qhlyDynamicLayout = resize;
  const observer = new ResizeObserver(resize); observer.observe(view);
  addEventListener('resize', resize);
  const cleanup = () => {
    observer.disconnect();
    removeEventListener('resize', resize);
    if (view.qhlyDynamicLayout === resize) delete view.qhlyDynamicLayout;
    for (const label of labels) label.style.removeProperty('--local-frame-image');
    Object.assign(view.style, original);
    view.classList.remove('local-skin-adapted', 'local-skin-landscape', 'local-skin-stacked');
    for (const prop of ['width', 'height', 'top', 'left']) view.style.removeProperty('--local-preview-' + prop);
  };
  cleanup.resize = resize;
  return cleanup;
}

// Load before the first model is ready so geometry never uses half-applied styles.
if (!document.getElementById('local-skin-layout-css')) {
  const link = document.createElement('link');
  link.id = 'local-skin-layout-css'; link.rel = 'stylesheet';
  link.href = new URL('./preview-layout.css', import.meta.url).href;
  document.head.append(link);
}
