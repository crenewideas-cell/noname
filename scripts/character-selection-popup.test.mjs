import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../apps/core/extension/packs/名将杀/src/js/lib/hooks/buttonCard.js', import.meta.url), 'utf8');
function fixture(dialog) {
 const lib = { config: { extension_名将杀_chooseCardPopup: true } };
 const ui = { selected: { buttons: [] }, dialog };
 const player = { node: { handcards2: { _childNodesWatcher: { childNodes: [] } } } };
 const get = { idDialog: () => undefined, is: { singleHandcard: () => false }, itemtype: item => typeof item === 'string' ? 'character' : 'card' };
 const hooks = vm.runInNewContext(source.replace(/^import .*;\r?\n/, '').replace('export default checkButton;', 'checkButton;'), { lib, ui, get, game: {}, _status: {} });
 return { run: event => hooks.checkBegin[0]({ name: 'chooseButton', player, selectButton: [1, 1], dialog, ...event }) };
}

test('card popup hook never materializes a paged character directory', () => {
 const dialog = { characterPager: {}, get buttons() { throw new Error('full character pool materialized'); } };
 fixture(dialog).run();
});

test('ordinary character choices retain the existing popup eligibility checks', () => {
 const dialog = { buttons: [{ innerText: '曹操', link: 'caocao' }], querySelectorAll: () => [{}] };
 fixture(dialog).run();
});

test('eligible card choices still reach the card popup conversion', () => {
 const card = {};
 const dialog = { buttons: [{ innerText: '杀', link: card }], querySelectorAll: () => [{}] };
 const fixture_ = fixture(dialog);
 const event = { parent: {}, player: { node: { handcards2: { _childNodesWatcher: { childNodes: [] } } }, getCards() { throw new Error('card popup conversion reached'); } } };
 assert.throws(() => fixture_.run(event), /card popup conversion reached/);
});
