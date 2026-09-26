import test from 'node:test';
import assert from 'node:assert/strict';
import { createCatalogIndex } from '../apps/core/noname/skin/localDynamic/catalog-index.js';

test('explicit owners isolate variants, unrelated characters, and unbound imports', () => {
  const pack = { entries: [
    { id: 'a', skinTitle: '曹操', characterIds: ['caocao', 're_caocao'] },
    { id: 'b', skinTitle: '名将杀曹操', characterIds: ['mjs_caocao'] },
    { id: 'c', skinTitle: '游离曹操', aliases: ['caocao'], character: '曹操', characterIds: [] },
    { id: 'missing', skinTitle: '缺件皮肤', characterIds: ['caocao'], available: false },
  ] };
  const packs = { pack }, index = createCatalogIndex(packs, p => !p.disabled);
  assert.deepEqual(index.forCharacter('caocao').files, ['曹操.png']);
  assert.deepEqual(index.forCharacter('re_caocao').files, ['曹操.png']);
  assert.deepEqual(index.forCharacter('mjs_caocao').files, ['名将杀曹操.png']);
  assert.deepEqual(index.forCharacter('liubei').files, []);
  assert.equal(index.owns('liubei', index.read().byFile.get('localdyn_a.png')), false);
  assert.equal(index.read().unbound.length, 1);
  assert.equal(index.read().byFile.has('缺件皮肤.png'), false);
  assert.equal(index.forCharacter('caocao'), index.forCharacter('caocao'));
  pack.disabled = true;
  assert.deepEqual(index.forCharacter('caocao').files, []);
  pack.disabled = false;
  pack.entries = [...pack.entries, { id: 'd', skinTitle: '刘备', characterIds: ['liubei'] }];
  assert.deepEqual(index.forCharacter('liubei').files, ['刘备.png']);
});
