import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const root = new URL("../apps/core/extension/packs/名将杀/", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const source = ts.createSourceFile("skill.js", read("character/now/skill.js"), ts.ScriptTarget.Latest, true);
const names = ["mjszaohuatonggong", "mjschaijiejishu", "mjsmugesuxing"];
const definitions = [];
function visit(node) {
    if (ts.isPropertyAssignment(node) && names.includes(node.name.getText(source))) definitions.push(node.getText(source));
    else ts.forEachChild(node, visit);
}
visit(source);
assert.equal(definitions.length, 3);

function setup() {
    const calls = [];
    const characters = {
        mjs_yanshi: { hp: 2, maxHp: 2, skills: names },
        puppet: { hp: 4, maxHp: 4, skills: ["puppetSkill"] },
    };
    const lib = { skill: {}, character: characters, element: { player: {
        init(name) { calls.push(["init", name]); this.name1 = name; return this; },
    } } };
    const game = {
        initCharacterList() {}, log() {}, addRecentCharacter() {},
        createEvent(name) { calls.push(["event", name]); return { setContent() {} }; },
    };
    const get = {
        character: name => characters[name], info: name => lib.skill[name] || {},
        skillInfoTranslation: () => "description", cards: n => Array(n).fill("card"), mode: () => "identity",
    };
    const context = vm.createContext({ lib, game, get, ui: {}, ai: {}, _status: { event: { name: "chooseCharacter" } } });
    vm.runInContext(`
        Array.prototype.remove = function(item) { const i = this.indexOf(item); if (i >= 0) this.splice(i, 1); return this; };
        Array.prototype.removeArray = function(items) { for (const item of items) this.remove(item); return this; };
        Array.prototype.randomGets = function(n) { return this.slice(0, n); };
        Array.prototype.randomGet = function() { return this[0]; };
        _status.characterlist = ["mjs_yanshi", "puppet"];
    `, context);
    Object.assign(lib.skill, vm.runInContext(`({${definitions.join(",")}})`, context));
    lib.skill.mjsallmax = { change(player, n) { player.handLimit += n; } };
    const list = () => vm.runInContext("[]", context);
    const player = {
        name1: "mjs_yanshi", hp: 1, maxHp: 3, handLimit: 5, storage: {}, awakenedSkills: [],
        getSkills: () => names, getHandcardLimit() { return this.handLimit; },
        mjsGetEquipLimit() { return 3 + (this.storage.mjsequip || 0); },
        setStorage(key, value) { this.storage[key] = value; },
        getStorage(key, fallback) { return this.storage[key] ?? fallback; },
        addInvisibleSkill(skills) { this.invisibleSkills = skills; },
        addSkill() {}, update() {}, isIn: () => true, getHp() { return Math.max(0, this.hp); },
        getCards(zone) { calls.push(["cards", zone]); return ["hand", "equip", "judge", "special", "expansion"]; },
        discard(cards) { calls.push(["discard", cards.length]); return { set() {} }; },
        gain: async cards => calls.push(["gain", cards.length]), draw: async n => calls.push(["draw", n]),
        reinitCharacter: async function(from, to) { calls.push(["reinit", from, to]); this.name1 = to; },
        awakenSkill(skill) { this.awakenedSkills.push(skill); },
        chooseButton() { return { set() { return this; }, forResult: async () => ({ links: ["puppet"] }) }; },
        addMark(key, n) { this.storage[key] = (this.storage[key] || 0) + n; },
        countMark(key) { return this.storage[key] || 0; },
    };
    return { lib, game, context, calls, player, list };
}

test("computer selection initializes the puppet once and keeps Yanshi's original state", () => {
    const { lib, context, player, calls } = setup();
    vm.runInContext(read("main/prepare.js").replace(/^import .*;\r?\n/m, "").replace("export function prepare", "function prepare") + "\nprepare();", context);
    lib.element.player.init.call(player, "mjs_yanshi");
    assert.equal(player.name1, "puppet");
    assert.deepEqual(calls, [["init", "puppet"]]);
    assert.equal(player.storage.mjszaohuatonggong.name, "mjs_yanshi");
    assert.equal(player.storage.mjszaohuatonggong.hp, 2);
    assert.equal(player.storage.mjszaohuatonggong.hasHidden, true);
    assert.deepEqual(Array.from(player.invisibleSkills), names);
});

test("human selection restores hidden skills without initializing the character twice", async () => {
    const { lib, game, context, player, calls } = setup();
    game.me = player;
    vm.runInContext(read("main/prepare.js").replace(/^import .*;\r?\n/m, "").replace("export function prepare", "function prepare") + "\nprepare();", context);
    const result = vm.runInContext('({ links: ["mjs_yanshi", "puppet"], buttons: [{link:"mjs_yanshi"}, {link:"puppet"}] })', context);
    await lib.skill._mjszaohuatonggong.content({}, { result }, player);
    lib.element.player.init.call(player, result.links[0]);
    assert.deepEqual(calls, [["init", "puppet"]]);
    assert.equal(player.storage.mjszaohuatonggong.name, "mjs_yanshi");
    assert.deepEqual(Array.from(player.invisibleSkills), names);
});

test("puppet candidates exclude Yanshi without changing the shared character pool", () => {
    const { lib, context } = setup();
    assert.deepEqual(Array.from(lib.skill.mjszaohuatonggong.getList()), ["puppet"]);
    assert.deepEqual(Array.from(context._status.characterlist), ["mjs_yanshi", "puppet"]);
});

test("alternate selection path stores the same structured snapshot", async () => {
    const { lib, player } = setup();
    await lib.skill.mjszaohuatonggong.content({}, {}, player);
    await lib.skill.mjszaohuatonggong.chooseCharacterAfter({}, {}, player);
    assert.equal(player.storage.mjszaohuatonggong.name, "mjs_yanshi");
    assert.equal(player.storage.mjszaohuatonggong.hasHidden, true);
    assert.deepEqual(Array.from(player.invisibleSkills), names);
});

test("dismantling counts three damage events, regardless of damage amount", async () => {
    const { lib, player } = setup();
    const counter = lib.skill.mjschaijiejishu.subSkill.counter;
    for (const [index, num] of [3, 2, 1].entries()) {
        const damage = { num };
        await counter.content({ name: "mjschaijiejishu_counter" }, damage, player);
        assert.equal(Boolean(damage._mjschaijiejishu), index === 2);
    }
});

for (const triggerName of ["dying", "damage"]) {
    for (const firstAppearance of [true, false]) {
        test(`dismantling restores state and queues one phase (${triggerName}, first=${firstAppearance})`, async () => {
            const { lib, player, calls, list } = setup();
            player.storage.mjsequip = 2;
            lib.skill.mjszaohuatonggong.addKuilei(player);
            player.storage.mjszaohuatonggong.hasHidden = firstAppearance;
            player.name1 = "puppet";
            player.hp = triggerName === "dying" ? 0 : 2;
            player.maxHp = 4;
            player.handLimit = 2;
            player.storage.mjsequip = -1;
            player.storage.retainedBuff = 1;
            const event = { next: list() }, parent = { next: list() };
            player.phaseUse = () => { const phase = { name: "phaseUse" }; event.next.push(phase); return phase; };
            await lib.skill.mjschaijiejishu.content(event, { name: triggerName, getParent: () => parent }, player);
            assert.equal(player.name1, "mjs_yanshi");
            assert.equal(player.hp, 1);
            assert.equal(player.maxHp, 3);
            assert.equal(player.handLimit, 5);
            assert.equal(player.mjsGetEquipLimit(), 5);
            assert.equal(player.storage.retainedBuff, 1);
            assert.equal(player.storage.mjszaohuatonggong, undefined);
            assert.equal(event.next.length, 0);
            assert.equal(parent.next.length, 1);
            assert.deepEqual(calls.filter(c => c[0] === "gain"), firstAppearance ? [["gain", 4]] : []);
            assert.deepEqual(calls.filter(c => c[0] === "draw"), [["draw", triggerName === "dying" ? 0 : 4]]);
            assert.ok(calls.some(c => c[0] === "cards" && c[1] === "hejsx"));
        });
    }
}

test("recreating a puppet saves Yanshi's limits and preserves the limited skill marker", async () => {
    const { lib, player } = setup();
    player.storage.mjsequip = 2;
    await lib.skill.mjsmugesuxing.content({ name: "mjsmugesuxing" }, {}, player);
    assert.equal(player.name1, "puppet");
    assert.equal(player.hp, 4);
    assert.equal(player.storage.mjszaohuatonggong.hp, 1);
    assert.equal(player.storage.mjszaohuatonggong.maxHandcard, 5);
    assert.equal(player.storage.mjszaohuatonggong.maxEquip, 5);
    assert.equal(player.storage.mjszaohuatonggong.hasHidden, false);
    assert.deepEqual(player.awakenedSkills, ["mjsmugesuxing"]);
});

test("all six skill voices and both death voices are present and have subtitles", () => {
    const voices = vm.runInNewContext("(" + read("character/now/voices.js").replace("export default", "").replace(/;\s*$/, "") + ")");
    for (const skill of names) {
        for (const n of [1, 2]) {
            const audio = `audio/skill/${skill}${n}`;
            assert.ok(existsSync(new URL(`${audio}.mp3`, root)));
            assert.ok(voices[`#ext:名将杀/${audio}`]);
        }
    }
    const context = vm.createContext({ lib: { config: { extension_名将杀_outcrop: "full" } } });
    vm.runInContext("Array.prototype.addArray = function(items) { for (const item of items) if (!this.includes(item)) this.push(item); };", context);
    const characters = vm.runInContext(read("character/now/character.js").replace(/import .*;\r?\n/, "").replace(/export default characters;?/, "characters;"), context);
    assert.equal(characters.mjs_yanshi.dieAudios.length, 2);
    for (const audio of characters.mjs_yanshi.dieAudios) {
        const path = audio.replace("ext:名将杀/", "");
        assert.ok(existsSync(new URL(path, root)));
        assert.ok(voices[`#${audio.replace(/\.mp3$/, "")}:die`]);
    }
});
