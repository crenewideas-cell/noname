// Only visible cards enter this queue. A single short-lived renderer supplies
// missing previews; the resulting image is reused without keeping a WebGL context.
export function createThumbnailLoader(lookup) {
  const jobs = new Map(), images = new Map(), waiting = [], targets = new WeakMap(), failed = new Set();
  let running = false, database;
  const revision = 'portrait-v13:';
  function db() {
    return database ||= new Promise(resolve => {
      try {
        const request = indexedDB.open('noname-dynamic-thumbnails', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('images');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
  }
  async function cached(key, value) {
    const database = await db(); if (!database) return;
    return new Promise(resolve => {
      try {
        const transaction = database.transaction('images', value ? 'readwrite' : 'readonly');
        const request = value ? transaction.objectStore('images').put(value, key) : transaction.objectStore('images').get(key);
        request.onsuccess = () => resolve(request.result); request.onerror = () => resolve();
      } catch { resolve(); }
    });
  }
  const visible = node => {
    if (!node.isConnected || !node.getClientRects().length) return false;
    const r = node.getBoundingClientRect(), cover = node.closest('.qh-skinchange-shousha-big-skin')?.parentElement?.parentElement;
    const c = cover?.getBoundingClientRect() || {left:0,top:0,right:innerWidth,bottom:innerHeight};
    return r.right > Math.max(0,c.left) && r.left < Math.min(innerWidth,c.right) && r.bottom > Math.max(0,c.top) && r.top < Math.min(innerHeight,c.bottom);
  };
  async function snapshot(row) {
    const frame = document.createElement('iframe'), channel = 'thumbnail-' + crypto.randomUUID();
    frame.__nonameSkinEntry = row.e;
    frame.style.cssText = 'position:fixed;left:-1000px;top:0;width:240px;height:360px;border:0;pointer-events:none';
    frame.setAttribute('aria-hidden','true'); frame.dataset.skinThumbnail = 'true';
    try {
      return await new Promise((resolve,reject) => {
        let finished = false;
        const finish = (error,value) => { if(finished)return;finished=true;clearTimeout(timer);clearInterval(abandon);removeEventListener('message',message);error?reject(error):resolve(value); };
        const timer = setTimeout(() => finish(Error('缩略图渲染超时')),30000);
        const abandon = setInterval(() => { if(![...row.nodes].some(visible))finish(Error('缩略图已不可见')); },250);
        const message = event => {
          if(event.source !== frame.contentWindow || event.data?.channel !== channel)return;
          if(event.data.type === 'noname-skin-error')finish(Error(event.data.message));
          if(event.data.type === 'noname-skin-ready') {
            try {
              const player = frame.contentWindow.skinPlayer;
              player.engine42?.pause(true); player.app?.stop();
              const canvas = player.canvas || player.engine42?.canvas || player.app?.view;
              // Use the same camera and composed layers as the selected portrait.
              player.capture();
              finish(null,canvas.toDataURL('image/webp',.85));
            } catch(error) { finish(error); }
          }
        };
        addEventListener('message',message);
        frame.src = row.p.base + 'runtime/player.html?id=' + encodeURIComponent(row.e.id) + '&presentation=portrait&channel=' + channel;
        document.body.append(frame);
      });
    } finally { frame.contentWindow?.skinPlayer?.dispose(); frame.remove(); }
  }
  function apply(row, source) {
    for(const node of row.nodes)if(targets.get(node)===row.key && node.isConnected){
      node.style.backgroundImage = 'url(' + JSON.stringify(source) + ')';node.dataset.skinThumbnailReady='true';
    }
    row.nodes.clear();
  }
  async function pump() {
    if(running)return;running=true;
    try { while(waiting.length) {
      const row=waiting.shift();
      try {
        let source=images.get(row.key)||await cached(row.key);
        if(!source && [...row.nodes].some(visible)) {
          source=await snapshot(row); void cached(row.key,source);
        }
        if(source){images.set(row.key,source);if(images.size>100)images.delete(images.keys().next().value);apply(row,source);}
        else for(const node of row.nodes)if(node.isConnected)observer.observe(node);
      } catch { if([...row.nodes].some(visible))failed.add(row.key);else for(const node of row.nodes)if(node.isConnected)observer.observe(node); }
      finally {jobs.delete(row.key);}
    }} finally {running=false;}
  }
  const rows=new WeakMap();
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.target.isConnected){observer.unobserve(entry.target);continue;}
      if(entry.isIntersecting){observer.unobserve(entry.target);enqueue(rows.get(entry.target),entry.target);}
    }
  });
  function enqueue(own,node){
    if(!own)return;
    const key=revision+own.p.base+own.e.id+':' +(own.e.thumbnailRevision||'');targets.set(node,key);
    if(failed.has(key))return;
    if(images.has(key)){apply({nodes:new Set([node]),key},images.get(key));return;}
    let row=jobs.get(key);
    if(!row){row={...own,key,nodes:new Set()};jobs.set(key,row);waiting.push(row);}
    row.nodes.add(node);void pump();
  }
  const load = (name,skin,node)=>{
    const own=lookup(name,skin);if(!own)return false;
    if(!own.e.thumbnail?.endsWith('.svg'))return false;
    rows.set(node,own);observer.observe(node);return true;
  };
  load.cancel = node => {targets.delete(node);rows.delete(node);observer.unobserve(node);for(const row of jobs.values())row.nodes.delete(node);};
  return load;
}

export { fillPortraitBackdrop as fillCardPortrait } from '../../util/portraitSampling.js';
