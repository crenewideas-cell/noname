import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { skipExistingCharacters, existingCharacters } from "../apps/core/extension/packs/活动BOSS/incremental.js";

const core = new URL("../apps/core/", import.meta.url);
function load(file) {
    const source = fs.readFileSync(new URL(`character/bingshi/${file}.js`, core), "utf8");
    const engine = { lib: { skill: {} }, game: { roundNumber: 3 }, get: { type: card => card.type, name: card => card.name }, ui: {}, ai: {}, _status: {} };
    const context = vm.createContext({ exports: {}, require: () => engine, window: {}, ...engine });
    vm.runInContext("Array.prototype.add = function(value) { if (!this.includes(value)) this.push(value); return this; };", context);
    vm.runInContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
    Object.assign(engine.lib.skill, context.exports.skills);
    for (const [id, skill] of Object.entries(context.exports.skills)) {
        for (const [sub, definition] of Object.entries(skill.subSkill || {})) engine.lib.skill[`${id}_${sub}`] = definition;
    }
    return { ...context.exports, context, ...engine };
}

test("both Zhao Yun variants have distinct identities and resolvable native portraits/audio", () => {
    const original = load("zhaoyun"), trial = load("zhaoyun-trial");
    assert.equal(original.translates.hy_zhaoyun, "势赵云");
    assert.equal(trial.translates.szty_zhaoyun, "势赵云·体验");
    assert.ok(!Object.keys(original.skills).some(id => id in trial.skills));
    for (const pack of [original, trial]) {
        for (const character of Object.values(pack.characters)) {
            for (const file of [character.img, ...character.dieAudios]) assert.ok(fs.existsSync(new URL(file, core)), file);
            for (const id of character.skills) {
                const skill = pack.skills[id];
                assert.ok(skill, id);
                for (const file of skill.audio) assert.ok(fs.existsSync(new URL(file, core)), file);
                for (const dependency of skill.group || []) assert.ok(pack.lib.skill[dependency], dependency);
            }
        }
    }
    const sort = fs.readFileSync(new URL("character/bingshi/sort.js", core), "utf8");
    assert.equal((sort.match(/"hy_zhaoyun"/g) || []).length, 1);
    assert.equal((sort.match(/"szty_zhaoyun"/g) || []).length, 1);
});

test("original 武翊 records basic hand cards without requiring an animation engine", () => {
    const pack = load("zhaoyun");
    pack.lib.skill.hy_wuyi._updateMark = () => {};
    const player = { storage: {}, syncStorage() {} };
    pack.context.player = player;
    pack.context.trigger = { getl: () => ({ hs: [{ name: "sha", type: "basic" }, { name: "sha", type: "basic" }, { name: "wuzhong", type: "trick" }] }) };
    pack.game.log = () => {};
    pack.get.translation = value => value;
    pack.skills.hy_wuyi.subSkill.count.content();
    assert.deepEqual(Array.from(player.storage._szy_wy_names), ["sha"]);
    const event = { filterCard: () => true };
    assert.equal(pack.skills.hy_wuyi.subSkill.use.filter(event, player), true);
    player.storage._szy_wy_round = 3;
    assert.equal(pack.skills.hy_wuyi.subSkill.use.filter(event, player), false);
});

test("trial 武翊 uses paid hand materials and shares its once-per-round quota", () => {
    const pack = load("zhaoyun-trial"), skill = pack.skills.szty_wuyi;
    const material = {}, event = { card: { name: "sha", type: "basic" }, cards: [material] };
    const player = { storage: {}, getHistory: (_type, filter) => [{ getParent: () => event, hs: [material] }].filter(filter) };
    assert.equal(skill.filter(event, player), true);
    assert.equal(skill.filter({ ...event, cards: [] }, player), false);
    player.storage.szty_wuyi = ["sha"];
    assert.equal(skill.filter(event, player), false);
    assert.equal(skill.subSkill.virtual.canActivate(player), true);
    player.storage.szty_wuyi_round = 3;
    assert.equal(skill.subSkill.virtual.canActivate(player), false);
    assert.equal(pack.skills.szty_cuifeng.used(player), 0);
    Object.assign(player.storage, { szty_cuifeng_round: 3, szty_cuifeng_used: 2 });
    assert.equal(pack.skills.szty_cuifeng.used(player), 2);
    pack.game.roundNumber = 4;
    assert.equal(pack.skills.szty_cuifeng.used(player), 0);
});

test("BOSS import skips existing IDs, translations and sort entries without dropping new characters", () => {
    const pack = { character: { fresh: [] }, translate: { fresh: "新武将" }, characterSort: { boss: { row: ["fresh", ...existingCharacters] } } };
    for (const id of existingCharacters) { pack.character[id] = []; pack.translate[id] = "duplicate"; }
    skipExistingCharacters(pack);
    assert.deepEqual(Object.keys(pack.character), ["fresh"]);
    assert.deepEqual(Object.keys(pack.translate), ["fresh"]);
    assert.deepEqual(pack.characterSort.boss.row, ["fresh"]);
    assert.deepEqual(skipExistingCharacters(pack), pack);
});

test("both Zhao Yun variants resolve shared Spine atlases and every atlas page", () => {
    const base = new URL("character/bingshi/assets/zhaoyun/animation/", core);
    for (const file of fs.readdirSync(base, { recursive: true }).filter(name => name.endsWith(".atlas"))) {
        const atlas = new URL(file.replaceAll("\\", "/"), base);
        assert.ok(fs.existsSync(new URL(atlas.href.replace(/\.atlas$/, ".skel"))));
        const pages = fs.readFileSync(atlas, "utf8").split(/\r?\n/).map(line => line.trim()).filter(line => /\.(png|jpg|webp)$/i.test(line));
        assert.ok(pages.length);
        for (const page of pages) assert.ok(fs.existsSync(new URL(page, atlas)), `${file}: ${page}`);
    }
    const beauty = fs.readFileSync(new URL("character/bingshi/assets/zhaoyun-trial/beauty/main.js", core), "utf8");
    assert.ok(beauty.includes("character/bingshi/assets/zhaoyun/animation/"));
});
