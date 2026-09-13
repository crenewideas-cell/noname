import { lib, game, ui, get, ai, _status } from "noname";
import config from "/game/config.json";
import "/noname/init/polyfill.ts";
import { loadCharacter, loadCard, loadExtension } from "/noname/init/loading.ts";
import identity from "/mode/identity.js";
import standardCards from "/card/standard.js";
import extension from "/extension/红楼幻境/extension.js";
import honglouCharacter from "/character/hlhj/index.js";
import { CacheContext } from "/noname/library/cache/cacheContext.js";
import { security, initializeSandboxRealms } from "/noname/util/sandbox.ts";

const report = { passed: [], failures: [] };
const online = new URL(location.href).searchParams.has("online");
window.__hlhjProgress = report;
const assert = (value, message) => { if (!value) throw new Error(message); };
const test = async (name, fn) => {
    report.running = name;
    console.log("HLHJ_TEST " + name);
    try { await fn(); report.passed.push(name); }
    catch (e) {
        report.failures.push({ name, error: e.stack });
        while (_status.eventManager.eventStack.length) _status.eventManager.popStatusEvent();
    }
};
try {
    lib.config = { ...structuredClone(config), mode: "identity", characters: ["standard"], cards: ["standard"], background_speak: false, background_music: "music_off", animation: false, bannedpile: {}, addedpile: {}, ignore_error: false };
    lib.assetURL = "/";
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
    if (online) {
        await game.import("character", honglouCharacter);
        loadCharacter(lib.imported.character.hlhj);
    } else {
        ext.precontent();
        await loadExtension([ext.name, ext.content, {}, false, ext.package, ext.connect]);
    }
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
        p.init(i === 0 ? "hlhj_daiyu" : "caocao");
    }
    const [p, b, o] = game.players;
    p.storage.hlhj_mushi = [b];
    const add = (name, owner = p, where = "h") => {
        const card = game.createCard2(name, "heart", 7);
        (where === "h" ? owner.node.handcards1 : owner.node.expansions).append(card);
        return card;
    };
    await test("标准扩展加载：武将、命势力、分组、技能与情思牌注册", () => {
        assert(lib.character.hlhj_daiyu?.group === "hlhj_ming", "势力错误");
        assert(lib.translate.hlhj_ming === "命" && lib.group.includes("hlhj_ming"), "命势力未注册");
        assert(lib.groupnature.hlhj_ming === "hlhj_ming", "势力颜色未注册");
        assert(lib.characterSort[online ? "hlhj" : ext.name].hlhj_mingyun.includes("hlhj_daiyu"), "命运分组缺失");
        assert(lib.card.hlhj_qingsi && p.hasSkill("hlhj_xiaoxiang_loss"), "卡牌或子技能未加载");
    });
    await test("真实手牌：杀闪桃均转情思，锦囊装备保留，移出手牌恢复原名", () => {
        for (const name of ["sha", "shan", "tao"]) assert(get.name(add(name), p) === "hlhj_qingsi", `${name}未转化`);
        for (const name of ["wuzhong", "zhuge"]) assert(get.name(add(name), p) === name, `${name}被错误转化`);
        const card = add("sha"); ui.discardPile.append(card);
        assert(get.name(card) === "sha", "离手仍为情思");
        const flower = add("sha", p, "x"); flower.addGaintag("hlhj_hua");
        assert(get.name(flower, p) === "sha", "花被转化");
    });
    await test("真实过滤器：情思不能在出牌阶段主动使用或作为闪响应", () => {
        const card = p.getCards("h").find(c => c.name === "sha");
        const e = new lib.element.GameEvent("chooseToUse", false); e.player = p; e.type = "phase";
        _status.event = e;
        assert(!lib.filter.cardEnabled(card, p, e), "情思不应主动使用");
        assert(get.name(card, p) !== "shan", "不应当闪");
    });
    await test("真实事件编译器执行回合重置与失泪，保留闭包", async () => {
        const run = async (name, trigger) => {
            const e = new lib.element.GameEvent(name, false);
            e.player = p; e._trigger = trigger; e.setContent(lib.skill[name].content);
            _status.event = e;
            await e.start();
        };
        p.storage.hlhj_gain_step = 4;
        await run("hlhj_turn", {});
        assert(p.storage.hlhj_gain_step === 0, "回合未重置");
        p.addMark("hlhj_lei", 3, false);
        const use = {};
        await run("hlhj_xiaoxiang_loss", { getParent: () => use });
        assert(p.countMark("hlhj_lei") === 2 && p.storage.hlhj_loss_step === 1, "失泪结算错误");
    });
    await test("真实事件编译器授予遗愿并加载代伤子技能", async () => {
        const e = new lib.element.GameEvent("hlhj_guimeng_gift", false);
        e.player = p; e._trigger = {}; e.setContent(lib.skill.hlhj_guimeng_gift.content);
        _status.event = e; await e.start();
        assert(b.hasSkill("hlhj_yiyuan") && b.hasSkill("hlhj_yiyuan_guard"), "遗愿子技能缺失");
    });
    await test("真实 lose 事件将复制花销毁、原牌送入弃牌堆", async () => {
        const flowers = p.getExpansions("hlhj_hua");
        const copy = add("sha", p, "x"); copy.addGaintag("hlhj_hua"); copy._destroy = true;
        const root = new lib.element.GameEvent("hlhj_flower_cleanup", false);
        root.player = p;
        root.setContent(async () => { await p.loseToDiscardpile([...flowers, copy]); });
        _status.event = root; await root.start();
        assert(copy.destroyed && !copy.parentNode, "复制花没有销毁");
        assert(flowers.every(c => get.position(c, true) === "d"), "原花未回弃牌堆：" + JSON.stringify(flowers.map(c => ({ name: c.name, position: get.position(c, true), parent: c.parentNode?.className, destroyed: c.destroyed, destroy: c._destroy }))));
    });
    await test("真实武将图资源可解码", async () => {
        const img = new Image(); img.src = "/extension/红楼幻境/hlhj_daiyu.svg"; await img.decode();
        assert(img.naturalWidth === 600, "武将图不可用");
    });
    if (online) {
        const { runOnlineTests } = await import("./hlhj-online-regression.browser.js");
        await runOnlineTests({ lib, game, ui, get, _status, p, b, o, add, test, assert });
    }
} catch (e) { report.fatal = e.stack; }
delete report.running;
window.__hlhjReport = report;
