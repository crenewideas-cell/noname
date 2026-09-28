import { install, createHub, readJSON } from './bridge.js';
import { createLazyCatalog } from './lazy-catalog.js';

// Install hooks synchronously. The lobby makes zero pack requests or scans.
export function installLocalDynamicPacks(env) {
  if (env.game.localDynamicPacksReady) return env.game.localDynamicPacksReady;
  const hub = env.game.localDynamicSkinTestHub ||= createHub(env);
  const resourcePath = 'extension/本地动态皮肤包/';
  const base = new URL(resourcePath, new URL(env.lib.assetURL || './', document.baseURI)).href;
  const lazy = createLazyCatalog({ read: readJSON, base,
    bindings: () => env.lib.config.localDynamicSkinBindings || {},
    assignments:()=>env.lib.config.skin_management?.dynamicAssignments||{},
    merge(rows, index) {
      hub.inventory = index.packs;
      for (const { pack: name, entry } of rows) {
        const pack = install(env, name, resourcePath + name + '/');
        const previous = pack.byFile.get(entry.skinTitle + '.png');
        if (previous) previous.characterIds = [...new Set([...previous.characterIds, ...entry.characterIds])];
        else { pack.entries.push(entry); pack.byFile.set(entry.skinTitle + '.png', entry); }
      }
      hub.invalidateCatalog();
    },
  });
  hub.hasCharacter = name => lazy.has(name);
  hub.ensureCharacter = async name => { await lazy.ensure(name);hub.refresh(); };
  const requesting = new Set(), retryAfter = new Map();
  hub.requestCharacter = name => {
    if (requesting.has(name) || (retryAfter.get(name) || 0) > Date.now()) return;
    requesting.add(name);
    hub.ensureCharacter(name).catch(error => {
      retryAfter.set(name, Date.now() + 15000);console.warn('动态皮肤加载失败', name, error);
    }).finally(() => requesting.delete(name));
  };
  // Other saved selections survive until their character is requested.
  const saved = env.lib.config.qhly_skinset;
  let changed = false;
  for (const [name, skin] of Object.entries(saved?.skin || {})) {
    if (typeof skin === 'string' && skin.startsWith('验证 · ')) { delete saved.skin[name];changed = true; }
  }
  if (changed) env.game.saveConfig('qhly_skinset', saved);
  hub.integrate();hub.refresh();
  return env.game.localDynamicPacksReady = Promise.resolve(hub);
}
