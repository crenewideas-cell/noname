import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../apps/core/noname/game/check.js', import.meta.url), 'utf8');
function fixture() {
 const button = link => {
  const classes = new Set();
  return { link, classList: { contains: key => classes.has(key), add: key => classes.add(key), remove: key => classes.delete(key) } };
 };
 const all = [button('first'), button('second'), button('off-page')];
 const selected = [];
 selected.add = item => { if (!selected.includes(item)) selected.push(item); };
 selected.remove = item => { const i = selected.indexOf(item); if (i >= 0) selected.splice(i, 1); };
 const ui = { selected: { buttons: selected } };
 const game = { callHook() {} };
 const lib = { filter: { buttonIncluded: () => true, cardAiIncluded: () => true } };
 const Check = vm.runInNewContext(source.replace(/^import .*;\r?\n/, '').replace('export class Check', 'class Check') + '\nCheck', { ui, game, lib, get: { select: value => value }, _status: {} });
 game.Check = new Check();
 let reads = 0;
 const pager = { buttons: all.slice(0, 2), disabledReasons: new Map(), syncSelection() {} };
 const event = {
  player: {}, selectButton: [1, 1], complexSelect: true, forced: true, isMine: () => true,
  filterButton: () => true,
  dialog: { characterPager: pager, get buttons() { reads++; return all; } },
 };
 return { check: () => game.Check.button(event, true), event, all, pager, selected, reads: () => reads };
}

test('default complex selection checks only the page and re-evaluates dependent filters', () => {
 const f = fixture();
 f.event.selectButton = [2, 2];
 f.event.filterButton = b => b.link !== 'second' || f.selected.length === 0;
 assert.equal(f.check().ok, false);
 assert.equal(f.all[1].classList.contains('selectable'), true);
 f.selected.add(f.all[0]);
 f.all[0].classList.add('selected');
 f.check();
 assert.equal(f.all[1].classList.contains('selectable'), false, 'selection changes invalidate dependent filters');
 // The pager retains the first selected button when switching to another page.
 f.pager.buttons = [f.all[2], f.all[0]];
 f.check();
 assert.equal(f.all[2].classList.contains('selectable'), true);
 f.selected.add(f.all[2]);
 f.all[2].classList.add('selected');
 assert.equal(f.check().ok, true, 'selections across pages complete the requested count');
 assert.equal(f.reads(), 0);
});

test('AI, select-all, forced direct selection, and custom handlers retain complete candidates', () => {
 for (const changes of [{ isMine: () => false }, { selectButton: [1, -1] }, { forceDirect: true }, { custom: { replace: { button() {} } } }]) {
  const f = fixture();
  Object.assign(f.event, changes);
  f.check();
  assert.equal(f.reads(), 1);
  assert.ok(f.all[2].classList.contains('selectable'));
 }
});

test('a forced empty page still checks off-page candidates before completing', () => {
 const f = fixture();
 f.event.filterButton = b => b.link === 'off-page';
 assert.equal(f.check().ok, false);
 assert.equal(f.reads(), 1);
 assert.equal(f.all[2].classList.contains('selectable'), true);
});

test('ordinary dialogs preserve their complete button array', () => {
 const f = fixture();
 delete f.event.dialog.characterPager;
 f.check();
 assert.equal(f.reads(), 1);
 assert.equal(f.all[2].classList.contains('selectable'), true);
});
