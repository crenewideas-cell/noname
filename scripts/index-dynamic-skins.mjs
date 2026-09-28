import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createSceneVariantResolver } from './dynamic-scene-variants.mjs';
import { publishDynamicRuntime } from './publish-dynamic-runtime.mjs';

const digest = value => createHash('sha256').update(value).digest('hex').slice(0, 20);
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const write = (file, value) => fs.writeFile(file, JSON.stringify(value));

// Run at import time, never in the game. Full catalogs remain repair/audit data.
export async function indexDynamicSkins(root, {runtimeOptions} = {}) {
  const manifest = await read(path.join(root, 'manifest.json'));
  const index = { version: 2, packs: [], characters: {} }, characters = new Map();
  const resolveScene = await createSceneVariantResolver();
  await fs.mkdir(path.join(root, 'characters'), { recursive: true });
  for (const pack of manifest.packs) {
    if (!pack.name || /[\\/\0]/.test(pack.name)) throw Error('无效皮肤包名称');
    const directory = path.join(root, pack.name), catalog = await read(path.join(directory, 'catalog.json'));
    const catalogRevision=(await fs.stat(path.join(directory,'catalog.json'))).mtimeMs;
    const groups = new Map(), bindings = {}, titles = new Set(), library=[];
    const sceneVariants=[],completedBackgrounds=[],layerRegistrations=[];
    await fs.mkdir(path.join(directory, 'entries'), { recursive: true });
    await fs.mkdir(path.join(directory, 'groups'), { recursive: true });
    for (const original of await resolveScene.normalizeAvatars(directory,catalog.entries)) {
      const entry=original.available===false?original:await resolveScene.completeBackground(directory,original);
      if(entry.inferredBackground)completedBackgrounds.push({id:entry.id,title:entry.title,...entry.inferredBackground});
      if (!entry.id || /[\\/\0]/.test(entry.id)) throw Error('无效皮肤 ID');
      let skinTitle = '本地 · ' + pack.name + ' · ' + entry.character + ' · ' + entry.title.replace(/[\\/]/g, '／');
      if (titles.has(skinTitle)) skinTitle += ' · ' + entry.id;
      titles.add(skinTitle);
      if (entry.available === false) continue;
      const summary = { id: entry.id, type: entry.type, character: entry.character, title: entry.title,
        skinTitle, characterIds: entry.characterIds || [], thumbnail: entry.thumbnail, events: entry.events,
        detail: 'entries/' + entry.id + '.json' };
      const row = { pack: pack.name, entry: summary }, group = digest(entry.group || entry.id);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(row);bindings[entry.id] = 'groups/' + group + '.json';
      library.push({...row,entry:{...summary,group:entry.character||entry.group||'未分类',sex:entry.sex||entry.gender||'unknown'},bindingGroup:'groups/'+group+'.json'});
      for (const owner of summary.characterIds) {
        if (!characters.has(owner)) characters.set(owner, []);
        characters.get(owner).push(row);
      }
      let sceneModels=await resolveScene.pairedScene(directory,entry)||await resolveScene(directory,entry);
      if(sceneModels)sceneVariants.push({id:entry.id,title:entry.title,model:sceneModels.at(-1).skeleton,...sceneModels.at(-1).sceneVariant});
      const registered=await resolveScene.registerLayers(directory,{...entry,models:sceneModels||entry.models});
      if(registered){sceneModels=registered;if(registered.at(-1).layerRegistration)layerRegistrations.push({id:entry.id,title:entry.title,...registered.at(-1).layerRegistration});}
      summary.thumbnailRevision=digest(JSON.stringify({catalogRevision,models:sceneModels||entry.models,model:entry.model,legacy:entry.legacy,composition:entry.composition}));
      const detail=path.join(directory,summary.detail);
      let actionScene=entry.actionScene;
      if(!actionScene)try{const previous=await read(detail);if(JSON.stringify(previous.legacy)===JSON.stringify(entry.legacy))actionScene=previous.actionScene;}catch(error){if(error.code!=='ENOENT')throw error;}
      await write(detail, { ...entry, skinTitle, ...(sceneModels?{models:sceneModels}:{}), ...(actionScene?{actionScene}:{}) });
    }
    for (const [group, rows] of groups) await write(path.join(directory, 'groups', group + '.json'), rows);
    await write(path.join(directory, 'binding-index.json'), bindings);
    await write(path.join(directory, 'library-index.json'), library);
    await write(path.join(directory, 'scene-variants.json'),sceneVariants);
    await write(path.join(directory, 'completed-backgrounds.json'),completedBackgrounds);
    await write(path.join(directory, 'layer-registrations.json'),layerRegistrations);
    index.packs.push({ name: pack.name, available: pack.available, bound: pack.bound, unbound: pack.unbound });
  }
  for (const [name, rows] of characters) {
    const file = 'characters/' + digest(name) + '.json';index.characters[name] = file;
    await write(path.join(root, file), rows);
  }
  // Publish last so a completed import always exposes a complete index.
  await publishDynamicRuntime(root, runtimeOptions);
  await write(path.join(root, 'runtime-index.json'), index);
  return index;
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const root = path.resolve('apps/core/extension/imports/本地动态皮肤包');
  const index = await indexDynamicSkins(root);
  console.log('已生成按需目录：', index.packs.length, '个包，', Object.keys(index.characters).length, '个武将');
}
