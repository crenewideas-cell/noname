import { lib, game, ui, get, ai, _status } from "noname";
import config from "/game/config.json";
import "/noname/init/polyfill.ts";
import { loadCharacter, loadCard, loadExtension } from "/noname/init/loading.ts";
import identity from "/mode/identity.js";
import standardCards from "/card/standard.js";
import extension from "/extension/清瑶葭绮/members/假装无敌/characters.js";
import { artifactNames } from "/extension/清瑶葭绮/members/假装无敌/artifacts.js";

import { CacheContext } from "/noname/library/cache/cacheContext.js";
import { security, initializeSandboxRealms } from "/noname/util/sandbox.ts";

const report = { passed: [], failures: [] };
window.__qingyaoProgress = report;
const assert = (value, message) => { if (!value) throw new Error(message); };
const test = async (name, fn) => {
    report.running = name;
    console.log("QINGYAO_TEST " + name);
    try { await fn(); report.passed.push(name); }
    catch (e) {
        report.failures.push({ name, error: e.stack });
        while (_status.eventManager.eventStack.length) _status.eventManager.popStatusEvent();
    }
};
try {
    lib.config = { ...structuredClone(config), mode: "identity", characters: ["standard"], cards: ["standard"], background_speak: false, background_music: "music_off", animation: false, bannedpile: {}, addedpile: {}, ignore_error: false };
    lib.assetURL = "/";
    lib.path = (await import("path-browserify-esm")).default;
    lib.configOL = { mode: "identity", characterPack: ["standard"], banned: [], bannedcards: [] };
    Object.assign(lib, { get, game, ui, ai, connectCharacterPack: [], connectCardPack: [] });
    game.layout = "newlayout";
    _status.mode = "normal";
    lib.status.date = new Date();
    lib.status.dateDelayed = 0;
    ui.css = {}; ui.dialogs = []; ui.controls = [];
    CacheContext.setProxy({ lib, game, get });
    Object.assign(get, identity.get); Object.assign(ai, identity.ai);
    _status.characterlist = [];
    await initializeSandboxRealms(true);
    await security.initSecurity({ lib, game, ui, get, ai, _status });
    ui.window = ui.create.div("#window", document.body);
    ui.arena = ui.create.div("#arena", ui.window);
    ui.background = ui.create.div(".background", document.body);
    ui.backgroundMusic = document.createElement("audio");
    for (const [key, cls] of Object.entries({ cardPile: "card-pile", discardPile: "discard-pile", ordering: "ordering", special: "special", control: "control", system: "system", sidebar: "sidebar", arenalog: "arenalog", historybar: "historybar" })) ui[key] = ui.create.div("." + cls, ui.window);
    for (const key of ["cardPile", "discardPile", "ordering", "special"]) ui[key].id = key;
    ui.system1 = ui.create.div(ui.system); ui.system2 = ui.create.div(ui.system);
    const standard = await import("/character/standard/index.js");
    if (standard.default) await game.import("character", standard.default);
    for (const pack of Object.values(lib.imported.character)) loadCharacter(pack);
    await game.import("card", standardCards);
    for (const pack of Object.values(lib.imported.card)) loadCard(pack);
    const ext = extension(lib, game, ui, get, ai, _status);
    report.running = "loadExtension";
    delete lib.onload;
    ext.precontent();
    await loadExtension([ext.name, ext.content, {}, false, ext.package, ext.connect]);
    game.finishCards();
    _status.event = new lib.element.GameEvent("hlhj_test", false);
    game.players = Array.from({ length: 4 }, () => ui.create.player(ui.arena));
    game.dead = []; game.me = game.zhu = game.players[0];
    lib.playerOL = {}; lib.cardOL = {}; lib.vcardOL = {};
    for (const [i, p] of game.players.entries()) {
        p.playerid = "hlhj-test-" + i; lib.playerOL[p.playerid] = p;
        p.next = p.nextSeat = game.players[(i + 1) % 4];
        p.previous = p.previousSeat = game.players[(i + 3) % 4];
        p.identity = i ? "fan" : "zhu";
        p.init(i === 0 ? "qy_qyshaonvqingyao" : "caocao");
    }

    const p = game.me;
    _status.auto = true;
    await test("少女清瑶完整登记且十大神器只作为衍生牌", async () => {
        assert(Object.keys(lib.characterPack.假装无敌Pack).length === 57, "武将数错误");
        assert(p.getSkills().includes("ymqiyu"), "未获得技能");
        for (const id of artifactNames) {
            assert(lib.card[id] && lib.card[id].skills.every(s => lib.skill[s]), "神器技能缺失: " + id);
            assert(!lib.card.list.some(c => c[2] === id), "衍生牌意外加入牌堆");
            const image = new Image(); image.src = lib.assetURL + lib.card[id].image.replace("ext:", "extension/"); await image.decode();
        }
        const image = new Image(); image.src = "/extension/清瑶葭绮/members/假装无敌/qy_qyshaonvqingyao.jpg"; await image.decode();
        for (const skill of ["ymqiyu", "ymgumeng", "ymjiuyin", "ymfuxi", "ymwangyao"]) {
            for (const n of [1, 2]) assert((await fetch("/extension/清瑶葭绮/members/假装无敌/" + skill + n + ".mp3")).ok, "缺少语音");
        }
    });
    await test("新增技能及子技能通过真实事件编译器", () => {
        const scan = (s, name) => {
            if (s.content) { const e = new lib.element.GameEvent(name, false); e.setContent(s.content); }
            for (const [key, sub] of Object.entries(s.subSkill || {})) scan(sub, name + "_" + key);
        };
        for (const id of ["ymqiyu", "ymgumeng", "ymjiuyin", "ymfuxi", "ymwangyao", "ymfengqin"]) scan(lib.skill[id], id);
    });
    await test("望遥真实装备十次，无重复并获得化境", async () => {
        // Isolate the summoning chain from optional trick choices after each equip.
        const previous = lib.skill.ymwangyao_equip.filter;
        lib.skill.ymwangyao_equip.filter = () => false;
        try {
            p.addSkill("ymwangyao");
            const seen = [];
            for (let i = 0; i < 10; i++) {
                const before = p.storage.ymwangyao.slice();
                const e = new lib.element.GameEvent("ymwangyao", false);
                e.player = p; e._trigger = {}; e.setContent(lib.skill.ymwangyao.content);
                _status.event = e; await e.start();
                const after = p.storage.ymwangyao || [];
                seen.push(before.find(id => !after.includes(id)));
            }
            assert(new Set(seen).size === 10, "神器重复: " + seen);
            assert(p.hasSkill("ymhuajing") && !p.hasSkill("ymwangyao"), "十神器后未化境");
            assert(p.boss?.includes(p.name1), "动态化境未完成初始化");
        } finally { lib.skill.ymwangyao_equip.filter = previous; }
    });
    await test("泣玉真实小游戏可加载、结算和清理", async () => {
        const before = document.querySelectorAll("canvas").length;
        const score = await game.qyPlayQiyu(2);
        assert(score === 2, "自动演奏得分错误: " + score);
        assert(document.querySelectorAll("canvas").length === before, "小游戏画布未清理");
    });
} catch (e) { report.fatal = e.stack; }
delete report.running;
window.__qingyaoReport = report;
