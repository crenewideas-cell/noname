import test from 'node:test';
import assert from 'node:assert/strict';
import {createCatalogIndex} from '../apps/core/noname/skin/localDynamic/catalog-index.js';

const entry = (id, skinTitle=id) => ({id, skinTitle, characterIds:['caocao']});
test('5000 skins resolve by filename and legacy ID with stable table identity', () => {
  const entries = Array.from({length:5000}, (_, i) => entry('id-'+i, '皮肤-'+i));
  const pack = {entries}, index = createCatalogIndex({pack}, () => true);
  const snapshot = index.read();
  assert.equal(index.forCharacter('caocao').files.length, 5000);
  for (let i=0;i<5000;i++) {
    const row = snapshot.byFile.get('皮肤-'+i+'.png');
    assert.equal(row.e, entries[i]); assert.equal(row.order,i);
    assert.equal(snapshot.byFile.get('localdyn_id-'+i+'.png'),row);
    assert.equal(index.read(),snapshot);
  }
  assert.equal(snapshot.byFile.get('missing'),undefined);
});
test('pack activation, replacement, append, removal and explicit edits invalidate metadata', () => {
  const packs = {one:{enabled:true,entries:[entry('a')]}};
  const index = createCatalogIndex(packs, p=>p.enabled);
  const first = index.read();
  packs.one.enabled=false;assert.equal(index.forCharacter('caocao').files.length,0);
  packs.one.enabled=true;assert.equal(index.forCharacter('caocao').files[0],'a.png');
  packs.one.entries.push(entry('b'));assert.equal(index.forCharacter('caocao').files.length,2);
  packs.one.entries=[entry('c')];assert.equal(index.read().byFile.has('a.png'),false);
  packs.two={enabled:true,entries:[entry('d')]};assert.equal(index.forCharacter('caocao').files.length,2);
  delete packs.two;assert.equal(index.forCharacter('caocao').files.length,1);
  packs.one.entries[0].skinTitle='edited';index.invalidate();
  assert.equal(index.forCharacter('caocao').files[0],'edited.png');assert.notEqual(index.read(),first);
});
test('duplicate titles retain first-pack lookup, aliases and last-table override', () => {
  const a={entries:[entry('a','same')]},b={entries:[entry('b','same'),entry('constructor'),entry('__proto__')]};
  const index=createCatalogIndex({a,b},()=>true),data=index.read();
  assert.equal(data.byFile.get('same.png').p,a);
  assert.equal(data.byFile.get('localdyn_b.png').p,b);
  assert.deepEqual(index.forCharacter('caocao').byTitle.same,{localDynamic:true});
  assert.deepEqual(index.forCharacter('caocao').byTitle.__proto__,{localDynamic:true});
  assert.equal(Object.hasOwn(index.forCharacter('caocao').byTitle,'missing'),false);
});
