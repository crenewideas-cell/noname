import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { indexDynamicSkins } from './index-dynamic-skins.mjs';
import { createLazyCatalog } from '../apps/core/noname/skin/localDynamic/lazy-catalog.js';

test('offline index loads only one owner, retains aliases, filters broken and unbound skins', async () => {
  const pointer=new URL('../apps/core/noname/skin/localDynamic/runtime-release.js',import.meta.url),active=await fs.readFile(pointer);
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'noname-lazy-'));
  try {
    await fs.mkdir(path.join(root, 'pack'));
    const entry = (id, owners, extra = {}) => ({ id, character: '曹操', title: '皮肤', characterIds: owners,
      thumbnail: 'previews/' + id + '.svg', type: 'spine', models: [{ skeleton: 'huge.skel' }], ...extra });
    const entries = [entry('broken', ['caocao'], { available: false }), entry('a', ['caocao', 're_caocao']),
      entry('b', ['liubei']), entry('loose', [], { group: 'manual', libraryGroup: '棕色尘埃扩展 · Mod2' }), entry('loose2', [], { group: 'manual' })];
    await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify({ packs: [{ name: 'pack' }] }));
    await fs.writeFile(path.join(root, 'pack/catalog.json'), JSON.stringify({ entries }));
    const index = await indexDynamicSkins(root, {runtimeOptions:{activate:false,releases:path.join(root,'releases')}}), requests = [], merged = [];
    assert.deepEqual(await fs.readFile(pointer),active,'temporary catalogs must never publish the active game runtime');
    const library=JSON.parse(await fs.readFile(path.join(root,'pack/library-index.json')));
    assert.equal(library.find(row=>row.entry.id==='loose').entry.group,'棕色尘埃扩展 · Mod2');
    assert.equal(library.find(row=>row.entry.id==='a').entry.group,'曹操');
    let bindings = {};
    const loader = createLazyCatalog({ base: root + '/', bindings: () => bindings,
      read: async file => { requests.push(file);return JSON.parse(await fs.readFile(file, 'utf8')); },
      merge: rows => merged.push(rows) });
    assert.deepEqual(requests, []);
    await Promise.all([loader.ensure('caocao'), loader.ensure('caocao')]);
    assert.equal(requests.length, 2);assert.equal(merged.length, 1);
    assert.equal(loader.has('caocao'), true);assert.equal(loader.has('liubei'), false);
    const row = merged[0][0];assert.equal(merged[0].length, 1);assert.equal(row.entry.id, 'a');
    assert.deepEqual(row.entry.characterIds, ['caocao', 're_caocao']);
    assert.equal(row.entry.models, undefined);assert.equal(row.entry.skinTitle, '本地 · pack · 曹操 · 皮肤 · a');
    const detail = JSON.parse(await fs.readFile(path.join(root, 'pack', row.entry.detail)));
    assert.equal(detail.models[0].skeleton, 'huge.skel');
    await loader.ensure('caocao');assert.equal(requests.length, 2);
    await loader.ensure('unknown');assert.deepEqual(merged.at(-1), []);assert.equal(requests.length, 2);
    bindings = { manual: { pack: 'pack', id: 'loose' }, guess: { pack: 'pack', id: 'loose', automatic: true } };
    await loader.ensure('manual');assert.deepEqual(merged.at(-1).map(r => r.entry.id), ['loose', 'loose2']);
    assert.ok(merged.at(-1).every(r => r.entry.characterIds.includes('manual')));
    await loader.ensure('guess');assert.deepEqual(merged.at(-1), []);
    assert.equal(Object.keys(index.characters).length, 3);
    assert.ok(!requests.some(file => /catalog.json|\/entries\//.test(file)));
  } finally {
    assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir()) + path.sep + 'noname-lazy-'));
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('failed requests can retry without poisoning shared cache or committing partial results', async () => {
  let fail = true;const requests = [], merged = [];
  const loader = createLazyCatalog({ base: '/', read: async file => {
    requests.push(file);
    if (file === '/runtime-index.json') return { packs: [], characters: { caocao: 'characters/a.json' } };
    if (fail) throw Error('offline');return [{ pack: 'p', entry: { id: 'a' } }];
  }, merge: rows => merged.push(rows) });
  await assert.rejects(loader.ensure('caocao'), /offline/);
  assert.equal(loader.has('caocao'), false);assert.deepEqual(merged, []);
  fail = false;await loader.ensure('caocao');
  assert.equal(loader.has('caocao'), true);assert.equal(merged.length, 1);
  assert.equal(requests.filter(f => f === '/runtime-index.json').length, 1);
});

test('clean checkout with no installed packs caches an empty index', async () => {
  let reads = 0;
  const loader = createLazyCatalog({ base: '/', read: async () => { reads++;throw Object.assign(Error('missing'), { status: 404 }); }, merge() {} });
  await loader.ensure('caocao');await loader.ensure('liubei');assert.equal(reads, 1);
});
