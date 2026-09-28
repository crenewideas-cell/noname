import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const core = fileURLToPath(new URL('../apps/core/', import.meta.url));
const readJson = async p => JSON.parse(await fs.readFile(path.join(core, p), 'utf8'));
const report = await readJson('game/dream-watch-imports.json');

async function loadPack(name) {
  const lib = {
    config: { characters: ['standard'] }, translate: {}, character: {}, skill: {},
    imported: { character: {}, card: {} }, arenaReady: [], namePrefix: new Map(),
    group: ['wei', 'shu', 'wu', 'qun', 'key'], poptip: { add() {} }, filter: { notMe() {} },
  };
  const game = {
    async import(type, factory) { const pack = await factory(lib, game, {}, get, {}, status); lib.imported[type][pack.name] = pack; },
    async saveConfig(key, value) { lib.config[key] = value; },
    async saveExtensionConfig(extension, key, value) { lib.config[`extension_${extension}_${key}`] = value; },
    addGroup() {}, addNature() {},
  };
  const get = { poptip: value => typeof value === 'string' ? value : value.name, translation: id => lib.translate[id] || id };
  const status = { postReconnect: {} };
  const context = vm.createContext({ console, TextEncoder, TextDecoder, setTimeout, clearTimeout, document: { createElement: () => ({ style: {} }), head: { appendChild() {} } } });
  const exports = { lib, game, get, ui: {}, ai: {}, _status: status };
  const noname = new vm.SyntheticModule(Object.keys(exports), function () { for (const [k, v] of Object.entries(exports)) this.setExport(k, v); }, { context });
  const modules = new Map();
  async function moduleAt(file) {
    if (modules.has(file)) return modules.get(file);
    const source = await fs.readFile(file, 'utf8');
    const mod = new vm.SourceTextModule(source, { context, identifier: file });
    modules.set(file, mod);
    await mod.link((specifier, parent) => specifier === 'noname' ? noname : moduleAt(path.resolve(path.dirname(parent.identifier), specifier)));
    return mod;
  }
  const mod = await moduleAt(path.join(core, 'extension/packs', name, 'extension.js'));
  await mod.evaluate();
  const extension = await mod.namespace.default();
  await extension.precontent();
  return { lib, extension, context };
}

for (const expected of report.packages) test(`${expected.name}: loads the deduplicated roster, assets and dependencies`, async () => {
  const { lib, extension } = await loadPack(expected.name);
  const pack = Object.values(lib.imported.character)[0];
  assert.deepEqual(Object.keys(pack.character).sort(), expected.imported.map(c => c.id).sort());
  for (const entry of expected.excluded) assert.ok(!Object.hasOwn(pack.character, entry.id), entry.id);
  assert.ok(lib.config.characters.includes(pack.name));
  lib.config.characters = ['standard'];
  await extension.precontent();
  assert.deepEqual(lib.config.characters, ['standard'], 'subsequent loads preserve an explicit pack disable');
  const sortIds = Object.values(pack.characterSort || {}).flatMap(group => Object.values(group).flat());
  for (const id of sortIds) assert.ok(pack.character[id], `stale sort entry: ${id}`);
  for (const [id, info] of Object.entries(pack.character)) {
    assert.ok(pack.translate[id], `missing name: ${id}`);
    if (info.img?.startsWith('extension/')) {
      const p = info.img.replace('extension/' + expected.name, 'extension/packs/' + expected.name);
      await fs.access(path.join(core, p));
    }
    if (info.img?.startsWith('image/')) await fs.access(path.join(core, info.img));
  }
  for (const fn of lib.arenaReady) fn();
  if (expected.name === '星之梦') {
    for (const id of Object.keys(report.skillAndCardMapping)) assert.ok(!Object.hasOwn(pack.skill, id), `overwrites skill: ${id}`);
    assert.ok(lib.imported.card.xzmCard);
  }
});

test('installed extensions and character menus use PXLNGU with enabled defaults', async () => {
  const installed = await readJson('game/organized-extensions.json');
  const groups = await readJson('game/character-menu-groups.json');
  const owners = groups.groups.find(g => g.name === 'PXLNGU').members;
  for (const name of ['星之梦', '云中守望']) {
    assert.equal(installed.filter(p => p.name === name).length, 1);
    assert.equal(installed.find(p => p.name === name).defaultEnabled, true);
    assert.ok(owners.includes(name));
  }
  assert.ok(owners.includes('swDIY'));
});

test('all imported JavaScript parses', async () => {
  async function visit(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await visit(p);
      else if (e.name.endsWith('.js')) {
        const source = ts.createSourceFile(p, await fs.readFile(p, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
        assert.equal(source.parseDiagnostics.length, 0, p);
      }
    }
  }
  for (const name of ['星之梦', '云中守望']) await visit(path.join(core, 'extension/packs', name));
});
