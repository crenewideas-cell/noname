// Per-player ownership: loading, decoded images and GPU textures never enter
// the legacy runtime's process-wide asset cache.
export function createSpineAssetScope(spine, context, { legacy = false, signal } = {}) {
  const controller = new AbortController(), textures = new Set();
  const pending = new Set();
  let disposed = false;
  const check = () => {
    if (disposed || controller.signal.aborted) throw new DOMException('Spine 加载已取消', 'AbortError');
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    signal?.removeEventListener('abort', dispose);
    for (const texture of textures) texture.dispose();
    textures.clear();
  };
  signal?.addEventListener('abort', dispose, { once: true });
  if (signal?.aborted) dispose();
  async function response(address) {
    check();
    const result = await fetch(address, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(60000)]) });
    if (!result.ok) throw Error('Spine 资源读取失败 ' + result.status + ' ' + address);
    check();
    return result;
  }
  async function image(address) {
    const blob = await (await response(address)).blob();
    check();
    const objectURL = URL.createObjectURL(blob), value = new Image();
    try {
      await new Promise((resolve, reject) => {
        const cancel = () => finish(new DOMException('Spine 纹理加载已取消', 'AbortError'));
        const finish = error => {
          value.onload = value.onerror = null;
          controller.signal.removeEventListener('abort', cancel);
          error ? reject(error) : resolve();
        };
        controller.signal.addEventListener('abort', cancel, { once: true });
        value.onload = () => finish();
        value.onerror = () => finish(Error('Spine 纹理解码失败 ' + address));
        value.src = objectURL;
      });
      check();
      return value;
    } finally { URL.revokeObjectURL(objectURL); if (disposed) value.removeAttribute('src'); }
  }
  const track = operation => {
    const job = operation(); pending.add(job);
    return job.finally(() => pending.delete(job));
  };
  return {
    dispose,
    get pendingLoads() { return pending.size; },
    loadBinary: address => track(async () => {
      const data = await (await response(address)).arrayBuffer(); check(); return new Uint8Array(data);
    }),
    loadTextureAtlas: address => track(async () => {
      const text = await (await response(address)).text(); check();
      const atlas = legacy ? new spine.TextureAtlas(text, () => new spine.FakeTexture({ width: 16, height: 16 })) : new spine.TextureAtlas(text);
      const pages = new Map();
      await Promise.all(atlas.pages.map(async page => {
        const addressPage = new URL(page.name.split('/').map(encodeURIComponent).join('/'), address).href;
        const pixels = await image(addressPage); check();
        const texture = new (legacy ? spine.webgl.GLTexture : spine.GLTexture)(context, pixels);
        textures.add(texture); pages.set(page.name, texture);
      }));
      check();
      if (legacy) return new spine.TextureAtlas(text, name => pages.get(name));
      for (const page of atlas.pages) page.setTexture(pages.get(page.name));
      return atlas;
    }),
  };
}
