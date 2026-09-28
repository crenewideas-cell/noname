import test from "node:test";
import assert from "node:assert/strict";
import extension from "../apps/core/extension/packs/红楼幻境/extension.js";
import qingyao from "../apps/core/extension/collections/清瑶葭绮/members/假装无敌/characters.js";

function setup() {
    const lib = { config: {}, card: {
        sha: { type: "basic", damage: true }, shan: { type: "basic" }, tao: { type: "basic" },
        juedou: { type: "trick", damage: true }, zhuge: { type: "equip", subtype: "equip1" },
    }, filter: { cardDiscardable: card => !card.undiscardable } };
    Object.assign(lib.card, qingyao(lib, {}, {}, {}, {}, {}).package.card.card);
    const status = {}, log = [];
    const game = { players: [], dead: [], broadcast() {},
        countPlayer: () => 4, hasPlayer: fn => game.players.some(p => p.isIn() && fn(p)) };
    const get = { position: card => card.position, owner: card => card.owner,
        tag: card => lib.card[card.name]?.damage, value: () => 5, attitude: () => 1,
        translation: card => card.name, name: (card, player) => s.hlhj_jiangzhu.mod.cardname(card, player) || card.name };
    const pack = extension(lib, game, {}, get, {}, status), s = lib.skill = pack.package.skill.skill;
    Object.assign(lib.card, pack.package.card.card);
    let seq = 0;
    const card = (name, tags = []) => ({ name, suit: "heart", number: 7, nature: "fire", cardid: String(++seq), storage: {}, gaintag: tags,
        hasGaintag(tag) { return this.gaintag.includes(tag); },
        addGaintag(tags) { this.gaintag = [...new Set([...this.gaintag, ...tags])]; },
        init([suit, number, name, nature]) { Object.assign(this, { suit, number, name, nature }); },
    });
    const choice = result => ({ set(key, value) { this[key] = value; return this; }, async forResult() { return result; } });
    function player(id) {
        return { name: id, storage: {}, zones: { h: [], e: [], x: [] }, history: [], alive: true, skills: [],
            isIn() { return this.alive; }, hasSkill(name) { return this.skills.includes(name); },
            getStorage(name) { return this.storage[name] || []; }, syncStorage() {}, send() {},
            markSkill() {}, unmarkSkill() {}, logSkill() {}, line() {}, addSkill(name) { this.skills.push(name); }, removeSkill() {},
            getCards(zone, filter = () => true) { return [...zone].flatMap(z => this.zones[z]).filter(filter); },
            hasCard(filter, zone = "h") { return this.getCards(zone, filter).length > 0; },
            getHistory() { return this.history; }, canEquip() { return !this.disabledSlot; },
            countMark(name) { return this.storage[name] || 0; }, addMark(name, n) { this.storage[name] = this.countMark(name) + n; },
            addGaintag(cards, tag) { cards.forEach(card => card.addGaintag([tag])); },
            chooseBool() { log.push("equipPrompt"); return choice({ bool: this.acceptEquip !== false }); },
            chooseCard() { log.push("basicPrompt"); return choice({ bool: !!this.keep?.length, cards: this.keep || [] }); },
            chooseCardTarget() { return choice(this.change || { bool: false }); },
            chooseTarget() { return choice({ bool: false }); },
            async equip(c) { await lose(this, [c]); move(c, this, "e"); log.push("equip"); },
            async discard(c) { await lose(this, Array.isArray(c) ? c : [c]); },
        };
    }
    const [p, b, other] = game.players = [player("hlhj_daiyu"), player("bond"), player("other")];
    p.storage.hlhj_mushi = [b]; status.currentPhase = p;
    function move(c, owner, zone) {
        if (c.owner) for (const list of Object.values(c.owner.zones)) {
            const index = list.indexOf(c); if (index >= 0) list.splice(index, 1);
        }
        c.owner = owner; c.position = zone; if (owner) owner.zones[zone].push(c);
    }
    async function lose(owner, cards, parent = {}) {
        const loss = { name: "lose", hs: cards.filter(c => c.position === "h"), getlx: false,
            getParent: () => parent, gaintag_map: Object.fromEntries(cards.map(c => [c.cardid, [...c.gaintag]])) };
        owner.history.push(loss);
        cards.forEach(c => { c.gaintag = []; move(c, null, "o"); });
        if (s.hlhj_jiangzhu_convert.filter(loss, owner)) await s.hlhj_jiangzhu_convert.content({}, loss, owner);
        if (s.hlhj_hua.filter(loss, owner)) await s.hlhj_hua.content({}, loss, owner);
        return loss;
    }
    async function gain(cards, flower = false) {
        cards.forEach(c => move(c, p, "h"));
        s.hlhj_jiangzhu.mod.handcardGain(p);
        const trigger = { name: "gain", cards, hlhj_flower_owner: flower ? p : undefined };
        if (flower) await s.hlhj_hua_gain.content({}, trigger, p);
        if (s.hlhj_jiangzhu_convert.filter(trigger, p)) await s.hlhj_jiangzhu_convert.content({}, trigger, p);
    }
    return { lib, s, p, b, other, status, log, card, move, lose, gain, pack };
}

test("整个清瑶公开牌库带仙界类别，武器、防具和非装备均豁免转化", async () => {
    const { lib, s, p, card, gain } = setup();
    p.acceptEquip = false;
    for (const name of ["ymyaoguangjian", "ymwangshusan", "ymtianruihualing", "ymhuanhundan", "ymhaoshouqiongjing", "ymlinjuejian"]) {
        assert.equal(lib.card[name].qingyaoXian, true);
        const c = card(name); await gain([c]);
        assert.equal(c.name, name); assert.equal(s.hlhj_jiangzhu.mod.cardname(c, p), undefined);
    }
    assert.equal(lib.card.zhuge.qingyaoXian, undefined);
});

test("同批仙界装备先询问装备，再选择基本牌；未选牌照常转化", async () => {
    const { s, p, card, gain, log } = setup();
    const weapon = card("ymyaoguangjian"), sha = card("sha"), shan = card("shan"), trick = card("juedou");
    p.keep = [sha]; await gain([weapon, sha, shan, trick]);
    assert.equal(weapon.position, "e"); assert.equal(sha.name, "sha");
    assert.equal(sha.hasGaintag("hlhj_xian"), true);
    assert.equal(shan.name, "hlhj_qingsi"); assert.equal(trick.name, "hlhj_qingsi");
    assert.deepEqual(log, ["equipPrompt", "equip", "basicPrompt"]);
    assert.equal(s.hlhj_xian.mod.ignoredHandcard(sha), true);
    assert.equal(s.hlhj_xian.mod.cardDiscardable(sha, p, "phaseDiscard"), false);
    assert.equal(s.hlhj_xian.mod.cardDiscardable(sha, p, "skill"), undefined);
});

test("拒绝装备不反复询问，不开放基本牌保留；重新获得同一张装备会重新询问", async () => {
    const { s, p, card, gain, lose, log } = setup();
    p.acceptEquip = false;
    const weapon = card("ymwangshusan"), sha = card("sha"); await gain([weapon, sha]);
    assert.equal(weapon.position, "h"); assert.equal(sha.name, "hlhj_qingsi");
    await gain([card("shan")]);
    assert.equal(s.hlhj_jiangzhu_convert.filter({ name: "phase" }, p), false);
    assert.deepEqual(log, ["equipPrompt"]);
    await lose(p, [weapon]); await gain([weapon]);
    assert.deepEqual(log, ["equipPrompt", "equipPrompt"]);
});

test("装备栏不可用时仙界牌保留，基本牌不能因此逃过转化", async () => {
    const { p, card, gain, log } = setup(); p.disabledSlot = true;
    const armor = card("ymtianruihualing"), tao = card("tao"); await gain([armor, tao]);
    assert.equal(armor.position, "h"); assert.equal(tao.name, "hlhj_qingsi"); assert.deepEqual(log, []);
});

test("已有情思不能被标记为仙或还原为原基本牌", async () => {
    const { p, card, gain, move } = setup();
    const old = card("sha"); await gain([old]); assert.equal(old.name, "hlhj_qingsi");
    move(card("ymyaoguangjian"), p, "e");
    const fresh = card("shan"); p.keep = [old, fresh]; await gain([fresh]);
    assert.equal(old.name, "hlhj_qingsi"); assert.equal(old.hasGaintag("hlhj_xian"), false);
    assert.equal(fresh.name, "shan"); assert.equal(fresh.hasGaintag("hlhj_xian"), true);
});

test("装备区有仙界防具也可选全部、部分或不保留；仙标记不因装备离开失效", async () => {
    for (const retained of [0, 1, 2]) {
        const { s, p, card, move, gain, lose } = setup();
        const armor = card("ymtianruihualing"); move(armor, p, "e");
        const basics = [card("sha"), card("tao")]; p.keep = basics.slice(0, retained); await gain(basics);
        await lose(p, [armor]); s.hlhj_jiangzhu.mod.handcardGain(p);
        assert.equal(basics.filter(c => c.hasGaintag("hlhj_xian")).length, retained);
        assert.equal(basics.filter(c => c.name === "hlhj_qingsi").length, 2 - retained);
    }
});

test("仙与花共存；使用、响应、装备、赠予等离手均得泪，非手牌区离开不计", async () => {
    const { s, p, card, gain, move, lose } = setup();
    const armor = card("ymtianruihualing"); move(armor, p, "e");
    const sha = card("sha"); p.keep = [sha]; await gain([sha], true);
    assert.deepEqual(sha.gaintag.sort(), ["hlhj_hua", "hlhj_xian"]);
    await lose(p, [sha]); assert.equal(p.countMark("hlhj_lei"), 1);
    const weapon = card("ymyaoguangjian"); await gain([weapon], true);
    assert.equal(weapon.position, "e"); assert.equal(p.countMark("hlhj_lei"), 2);
    weapon.gaintag = ["hlhj_hua"]; await lose(p, [weapon]);
    assert.equal(p.countMark("hlhj_lei"), 2);
    for (const reason of ["use", "respond", "gain", "discard", "addToExpansion"]) {
        const c = card("hlhj_qingsi", ["hlhj_hua"]); move(c, p, "h");
        await lose(p, [c], { name: reason });
    }
    assert.equal(p.countMark("hlhj_lei"), 7);
    assert.equal(s.hlhj_hua.filter({ hs: [], gaintag_map: { other: ["hlhj_hua"] } }, p), false);
});

test("仙牌主动使用额外结算一次，响应、他人回合与无实体牌的复制不重复", async () => {
    const { s, p, other, card, move, lose, status } = setup();
    const c = card("sha", ["hlhj_xian"]); move(c, p, "h");
    const use = { card: c, cards: [c], effectCount: 1 }; await lose(p, [c], use);
    assert.equal(c.hasGaintag("hlhj_xian"), false);
    assert.equal(s.hlhj_xian.filter(use, p), true);
    await s.hlhj_xian.content({}, use, p); assert.equal(use.effectCount, 2);
    use.respondTo = [other, {}]; assert.equal(s.hlhj_xian.filter(use, p), false);
    delete use.respondTo; status.currentPhase = other; assert.equal(s.hlhj_xian.filter(use, p), false);
    status.currentPhase = p; assert.equal(s.hlhj_xian.filter({ ...use, cards: [] }, p), false);
});

test("换缘自己回合可主动反复使用；取消无代价，成功后回到原用牌或响应窗口", async () => {
    const { s, p, b, other, card, move, status } = setup();
    assert.equal(s.hlhj_mushi_change.trigger, undefined);
    assert.deepEqual(s.hlhj_mushi_change.enable, ["chooseToUse", "chooseToRespond"]);
    const c = card("hlhj_qingsi", ["hlhj_hua"]); move(c, p, "h");
    for (const name of ["chooseToUse", "chooseToRespond"]) assert.equal(s.hlhj_mushi_change.filter({ name }, p), true);
    status.currentPhase = b; assert.equal(s.hlhj_mushi_change.filter({}, p), false); status.currentPhase = p;
    const cancelled = { result: { bool: true, skill: "hlhj_mushi_change" } };
    await s.hlhj_mushi_change.precontent(cancelled, {}, p);
    assert.equal(p.storage.hlhj_mushi[0], b); assert.equal(c.position, "h");
    p.change = { bool: true, cards: [c], targets: [other] };
    const event = { result: { bool: true, skill: "hlhj_mushi_change" } };
    await s.hlhj_mushi_change.precontent(event, {}, p);
    assert.equal(p.storage.hlhj_mushi[0], other); assert.equal(p.countMark("hlhj_lei"), 1);
    assert.deepEqual(event.result, { bool: true, cancel: true });
    move(card("hlhj_qingsi"), p, "h"); assert.equal(s.hlhj_mushi_change.filter({}, p), true);
});
