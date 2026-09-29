import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import create from '../apps/core/extension/collections/清瑶葭绮/members/假装无敌/characters.js';
import { playQiyu } from '../apps/core/extension/collections/清瑶葭绮/members/假装无敌/compatibility.js';
import { artifactNames } from '../apps/core/extension/collections/清瑶葭绮/members/假装无敌/artifacts.js';

const lib = { config: {}, skill: {} };
const pack = create(lib, {}, {}, {}, {}, {}).package;
const parser = fs.readFileSync('apps/core/noname/library/element/GameEvent/compilers/StepCompiler.ts', 'utf8');
const code = ts.transpileModule(parser.slice(parser.indexOf('class StepParser')), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
function steps(content, vars) {
    const Parser = vm.runInNewContext(`${code}; StepParser`, {
        ...Object.fromEntries(['lib', 'game', 'get', 'ui', 'ai', '_status'].map(k => [k, vars[k] || {}])),
        security: { getIsolatedsFrom: () => [null, null, (async () => {}).constructor], isSandboxRequired: () => false },
        ErrorManager: { setCodeSnippet() {} }, CodeSnippet: class {}, ContentCompiler: { compile: steps => steps },
    });
    return new Parser(content).getResult();
}

test('57 characters include 少女清瑶, all initial skills resolve and new media exists', () => {
    assert.equal(Object.keys(pack.character.character).length, 57);
    const id = 'qy_qyshaonvqingyao';
    assert.equal(pack.character.translate[id], '少女清瑶');
    for (const [name, info] of Object.entries(pack.character.character)) {
        for (const skill of info[3]) assert.ok(pack.character.skill[skill], `${name}: ${skill}`);
        assert.ok(fs.existsSync(path.join('apps/core/extension/collections', info[4].find(s => s.startsWith('ext:')).slice(4))));
    }
    assert.equal(pack.character.character[id][4].find(s => s.startsWith('die:')), `die:ext:清瑶葭绮/members/假装无敌/${id}.mp3`);
});

test('all ten derived artifacts have skills and art, preserving the public deck and card art', () => {
    assert.equal(artifactNames.length, 10);
    for (const id of artifactNames) {
        const card = pack.card.card[id];
        for (const skill of card.skills) assert.ok(pack.card.skill[skill], skill);
        assert.ok(fs.existsSync(path.join('apps/core/extension/collections', card.image.slice(4))));
        assert.ok(!pack.card.list.some(c => c[2] === id));
    }
    assert.match(pack.card.card.ymhaoshouqiongjing.image, /artwork\/ymhaoshouqiongjing.webp$/);
    assert.equal(pack.card.list.length, 8);
    const holder = { hp: 1, hasSkill: id => id === 'ymwangyao' };
    assert.equal(pack.card.card.xuanyuanjian.enable(null, holder), true);
    assert.equal(pack.card.skill.xuanyuanjian.filter({}, holder), false);
});

test('浮曦 awakens once, restores HP to one and grants 望遥 without legacy xuanyuan', async () => {
    const skill = pack.character.skill.ymfuxi;
    const gained = [];
    const p = { hp: -2, maxHp: 3, name1: 'qy_qyshaonvqingyao', storage: {}, awakenSkill() {}, recover(n) { this.hp += n; }, addTempSkill(id) { gained.push(id); }, addSkill(id) { gained.push(id); }, insertPhase() {} };
    assert.equal(skill.filter({ name: 'die' }, p), true);
    let cancelled = false;
    await steps(skill.content, { lib: { character: pack.character.character }, get: { infoMaxHp: n => n } })[0]({ name: 'ymfuxi' }, { name: 'die', cancel() { cancelled = true; } }, p);
    assert.equal(cancelled, true);
    assert.equal(p.hp, 1);
    assert.equal(skill.filter({ name: 'die' }, p), false);
    assert.deepEqual(gained, ['ymfuxi_mianyi', 'ymwangyao']);
    assert.doesNotThrow(() => pack.character.skill.ymwangyao.init(p, 'ymwangyao'));
    assert.equal(p.storage.ymwangyao.length, 10);
});

test('纠音 distributes remaining cards instead of reading the unrelated step cards variable', async () => {
    const content = pack.character.skill.ymjiuyin.subSkill.lose.content;
    const e = { cards: [{}], _result: { targets: [{ playerid: 'target' }] }, given_map: {}, togive: [{ cardid: 'one' }], goto(n) { this.nextStep = n; } };
    Object.defineProperty(Array.prototype, 'addArray', { configurable: true, value(items) { for (const item of items) if (!this.includes(item)) this.push(item); } });
    try { await steps(content, {})[3](e, {}, {}); }
    finally { delete Array.prototype.addArray; }
    assert.equal(e.nextStep, 1);
    assert.equal(e.given_map.target[0].cardid, 'one');
});

test('泣玉 loads core before game, returns score and cleans the game-over hook', async () => {
    const previous = { window: globalThis.window, document: globalThis.document };
    globalThis.window = {}; globalThis.document = { body: {} };
    const order = [], hooks = [], game = {};
    let done, destroyed = false;
    const host = { onover: hooks, init: { js(_base, name, resolve) {
        order.push(name);
        if (name === 'core') window.XianYuCore = {};
        else window.qyXianYuGame = { mount() { assert.ok(window.XianYuCore); return { onEnd(fn) { done = fn; }, destroy() { destroyed = true; } }; } };
        resolve();
    } } };
    try {
        const result = playQiyu(host, game, false);
        await new Promise(resolve => setImmediate(resolve));
        assert.deepEqual(order, ['core', 'game']);
        assert.equal(hooks.length, 1);
        done({ score: 10 });
        assert.equal(await result, 10);
        assert.equal(destroyed, true);
        assert.equal(hooks.length, 0);
    } finally { Object.assign(globalThis, previous); }
});

test('泣玉 script failure can retry without leaving a pending load', async () => {
    const previous = globalThis.window; globalThis.window = {};
    let attempts = 0;
    const host = { init: { js(_base, _name, _resolve, reject) { attempts++; reject(Error('missing')); } } };
    const game = {};
    try {
        await assert.rejects(playQiyu(host, game), /missing/);
        await assert.rejects(playQiyu(host, game), /missing/);
        assert.equal(attempts, 2);
    } finally { globalThis.window = previous; }
});
