// Downsample detailed artwork before the compositor shrinks it to a small portrait.
// Keep the original CSS layers for immediate display, failure fallback and cloning.
const states = new WeakMap();
const images = new Map();
const samples = new Map();
let visibility, sizes;
const portraits = '.avatar, .avatar2, .primary-avatar, .deputy-avatar';

export function releasePortraitSampling(node) {
 states.delete(node);
 visibility?.unobserve(node);
 sizes?.unobserve(node);
}

function bounded(cache, key, create, limit) {
 if (cache.has(key)) return cache.get(key);
 const result = create();
 cache.set(key, result);
 if (cache.size > limit) cache.delete(cache.keys().next().value);
 return result;
}

function load(source) {
 return bounded(images, source, () => new Promise(resolve => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => { images.delete(source); resolve(null); };
  image.src = source;
 }), 8);
}

async function sample(image, width, height) {
 const canvas = document.createElement('canvas');
 canvas.width = width;
 canvas.height = height;
 const context = canvas.getContext('2d');
 if (!context) return null;
 context.imageSmoothingEnabled = true;
 context.imageSmoothingQuality = 'high';
 if (typeof createImageBitmap === 'function') {
  const bitmap = await createImageBitmap(image, {resizeWidth: width, resizeHeight: height, resizeQuality: 'high'});
  try { context.drawImage(bitmap, 0, 0); } finally { bitmap.close(); }
 } else {
  // Progressive reduction also avoids sparse sampling in older desktop webviews.
  let source = image, w = image.naturalWidth, h = image.naturalHeight;
  while (w / 2 > width && h / 2 > height) {
   const step = document.createElement('canvas');
   step.width = w = Math.ceil(w / 2);
   step.height = h = Math.ceil(h / 2);
   const ctx = step.getContext('2d');
   if (!ctx) return null;
   ctx.imageSmoothingEnabled = true;
   ctx.imageSmoothingQuality = 'high';
   ctx.drawImage(source, 0, 0, w, h);
   source = step;
  }
  context.drawImage(source, 0, 0, width, height);
 }
 // Keep transparent artwork on its original layers; duplicating alpha would change its opacity.
 const pixels = context.getImageData(0, 0, width, height).data;
 for (let i = 3; i < pixels.length; i += 4) if (pixels[i] !== 255) return null;
 return canvas.toDataURL('image/png');
}

async function update(node) {
 const state = states.get(node);
 if (!state || !state.visible) return;
 if (!node.isConnected) { releasePortraitSampling(node); return; }
 if (node.style.backgroundImage !== state.applied) { releasePortraitSampling(node); return; }
 const rect = node.getBoundingClientRect(), css = getComputedStyle(node);
 // Full illustrations, hidden/dynamic portraits and custom crops retain original rendering.
 if (!rect.width || !rect.height || css.backgroundImage === 'none') return;
 if (rect.width > 320 || rect.height > 400 || css.backgroundSize.split(',')[0].trim() !== 'cover') {
  state.version++;
  node.style.backgroundImage = state.original;
  state.applied = node.style.backgroundImage;
  return;
 }
 const version = ++state.version;
 const image = await load(state.source);
 if (!image) return;
 const ratio = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight) * (window.devicePixelRatio || 1);
 const width = Math.ceil(image.naturalWidth * ratio), height = Math.ceil(image.naturalHeight * ratio);
 const current = () => states.get(node) === state && state.version === version && node.isConnected && node.style.backgroundImage === state.applied;
 if (!current()) return;
 if (ratio >= 0.5 || width > 1024 || height > 1024) {
  node.style.backgroundImage = state.original;
  state.applied = node.style.backgroundImage;
  return;
 }
 const key = JSON.stringify([state.source, width, height]);
 try {
  const result = await bounded(samples, key, () => sample(image, width, height).catch(() => null), 32);
  if (!result || !current()) return;
  node.style.backgroundImage = 'url(' + JSON.stringify(result) + '), ' + state.original;
  state.applied = node.style.backgroundImage;
 } catch { /* An unsupported decoder or tainted canvas leaves the source intact. */ }
}

export function samplePortraitBackground(node, sources) {
 releasePortraitSampling(node);
 if (!node.matches(portraits) || !sources[0] || typeof IntersectionObserver === 'undefined' || typeof ResizeObserver === 'undefined') return;
 // Skip GIF animation and non-image resources. Dynamic canvases remain untouched.
 const source = new URL(sources[0], document.baseURI);
 if (!/\.(png|jpe?g|webp|avif)$/i.test(source.pathname)) return;
 if (source.origin !== location.origin) return;
 if (!visibility) {
  visibility = new IntersectionObserver(entries => {
   for (const entry of entries) {
    if (!entry.target.isConnected) { releasePortraitSampling(entry.target); continue; }
    const state = states.get(entry.target);
    if (state) { state.visible = entry.isIntersecting; if (state.visible) void update(entry.target); }
   }
  });
  sizes = new ResizeObserver(entries => { for (const entry of entries) void update(entry.target); });
  // DPR / body zoom can change without changing an element's CSS content box.
  window.addEventListener('resize', () => {
   for (const target of document.querySelectorAll(portraits)) void update(target);
  });
 }
 states.set(node, {source: source.href, original: node.style.backgroundImage, applied: node.style.backgroundImage, version: 0, visible: false});
 visibility.observe(node);
 sizes.observe(node);
}

// Outcrop portraits contain a transparent band for a head above the frame.
// A rectangular list card needs a backing there, without cropping that head.
// Extend only the first opaque background strip behind the unchanged image.
export async function fillPortraitBackdrop(node,source) {
  const expected=node.style.backgroundImage;
  try {
    const image=await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=new URL(source,document.baseURI).href;});
    if(!node.isConnected||node.style.backgroundImage!==expected)return;
    const canvas=document.createElement('canvas');canvas.width=Math.max(300,Math.min(1200,image.naturalWidth));canvas.height=Math.round(canvas.width*image.naturalHeight/image.naturalWidth);
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,canvas.width,canvas.height);
    const {data}=ctx.getImageData(0,0,canvas.width,canvas.height),w=canvas.width,h=canvas.height;
    let first=-1;
    for(let y=0;y<Math.floor(h*.25);y++){
      let opaque=0;for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>245)opaque++;
      if(opaque>w*.95){first=y;break;}
    }
    if(first<h*.035)return;
    const strip=document.createElement('canvas');strip.width=w;strip.height=1;
    strip.getContext('2d').drawImage(canvas,0,first,w,1,0,0,w,1);
    ctx.clearRect(0,0,w,h);ctx.filter='blur(12px)';ctx.drawImage(strip,-24,-24,w+48,first+48);ctx.filter='none';ctx.drawImage(image,0,0,w,h);
    if(node.isConnected&&node.style.backgroundImage===expected){node.style.backgroundImage='url('+JSON.stringify(canvas.toDataURL('image/webp',.9))+')';node.dataset.portraitPadding='filled';}
  }catch{/* Keep the original image on unsupported/cross-origin decoders. */}
}
