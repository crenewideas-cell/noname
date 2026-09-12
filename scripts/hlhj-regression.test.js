import test from "node:test";
import assert from "node:assert/strict";
import extension from "../apps/core/extension/红楼幻境/extension.js";

const choice = result => ({ set() { return this; }, async forResult() { return result; } });
const list = (...items) => Object.assign(items, { remove(value) { const i = this.indexOf(value); if (i >= 0) this.splice(i, 1); } });
function setup(count = 4) {
    const log = [];
    const lib = { card: { sha: { type: "basic" }, tao: { type: "basic" }, wuzhong: { type: "trick" }, zhuge: { type: "equip" } }, filter: { targetEnabled: (c, p, t) => t !== p, cardRespondable: () => true } };
    const game = {
        players: [], dead: [], phaseNumber: 0,
        countPlayer() { return this.players.filter(p => p.isIn()).length; },
        hasPlayer(fn) { return this.players.some(fn); },
        addGroup(...args) { this.group = args; },
        createCard2(name, suit, number, nature) { return { name, suit, number, nature }; },
    };
    const get = {
        position: c => c.position, owner: c => c.owner,
        name: (c, p) => lib.skill.hlhj_jiangzhu.mod.cardname(c, p) || c.name,
        color: c => c.color || (["heart", "diamond"].includes(c.suit) ? "red" : "black"),
        translation: x => x?.name || "目标", effect: () => 0, value: () => 1, attitude: () => 5,
    };
    const status = {};
    const pack = extension(lib, game, {}, get, {}, status);
    lib.skill = pack.package.skill.skill;
    function makePlayer(i) {
        return {
            playerid: String(i), storage: {}, hand: [], flowers: [], alive: true, hp: 3,
            skills: i === 0 ? [...pack.package.character.character.hlhj_daiyu.skills] : [],
            isIn() { return this.alive; }, hasSex(s) { return s === (i ? "male" : "female"); },
            getStorage(k) { return this.storage[k] || []; }, syncStorage() {}, line() {}, logSkill() {},
            countMark(k) { return this.storage[k] || 0; }, addMark(k, n) { this.storage[k] = this.countMark(k) + n; },
            removeMark(k, n) { this.storage[k] = this.countMark(k) - n; }, markAuto(k, v) { this.storage[k] = v; },
            hasSkill(k) { return this.skills.includes(k); }, addSkill(k) { if (!this.skills.includes(k)) this.skills.push(k); log.push("gift"); },
            hasCard(fn) { return this.hand.some(fn); }, getCards() { return [...this.hand]; }, getExpansions() { return [...this.flowers]; },
            chooseTarget() { return choice({ bool: true, targets: [game.players[1]] }); },
            chooseButton() { return choice(this.buttonResult || { bool: false }); },
            chooseBool() { return choice({ bool: this.accept !== false }); },
            chooseToRespond() { return choice({ bool: this.accept !== false }); },
            async draw(n) { this.drawn = (this.drawn || 0) + n; log.push("draw"); },
            async discard(cards) { log.push("discard"); this.hand = this.hand.filter(c => !cards.includes(c)); },
            async die() { if (lib.skill.hlhj_guimeng_gift.filter({}, this)) lib.skill.hlhj_guimeng_gift.content({}, {}, this); log.push("die"); this.alive = false; },
            isDamaged() { return this.hp < 3; }, async recover() { this.hp = Math.min(3, this.hp + 1); },
            addToExpansion(cards) { this.flowers.push(...cards); cards.forEach(c => c.position = "x"); return { gaintag: { add() {} } }; },
            async loseToDiscardpile(cards) { this.flowers = this.flowers.filter(c => !cards.includes(c)); cards.forEach(c => { c.position = c._destroy ? "destroyed" : "d"; }); },
        };
    }
    game.players = Array.from({ length: count }, (_, i) => makePlayer(i));
    const [p, b, o] = game.players;
    p.storage.hlhj_mushi = [b];
    status.event = { player: p };
    return { lib, game, get, pack, s: lib.skill, p, b, o, log };
}
const useEvent = (source, target, card = { name: "sha", color: "red" }, parent = {}) => {
    parent.targets ||= list(target);
    parent.triggeredTargets2 ||= list(target);
    return { name: "useCardToTarget", player: source, target, card, targets: parent.targets, getParent: () => parent };
};
const discardEvent = (owner, cards, parent = {}, name = "lose") => ({ name, type: "discard", getParent: () => parent, getl: p => p === owner ? { cards2: cards } : undefined });

test("注册命势力、3体力女性与五个主技能", () => {
    const { pack, game } = setup(); pack.precontent();
    assert.deepEqual(game.group.slice(0, 3), ["hlhj_ming", "命", "命"]);
    const c = pack.package.character.character.hlhj_daiyu;
    assert.equal(c.group, "hlhj_ming"); assert.equal(c.hp, 3); assert.equal(c.sex, "female"); assert.equal(c.skills.length, 5);
});
test("只转化自己的基本手牌，锦囊、装备、花和其他角色的牌保留原名", () => {
    const { s, p, b } = setup();
    for (const name of ["sha", "tao"]) assert.equal(s.hlhj_jiangzhu.mod.cardname({ name, owner: p, position: "h" }, p), "hlhj_qingsi");
    for (const name of ["wuzhong", "zhuge"]) assert.equal(s.hlhj_jiangzhu.mod.cardname({ name, owner: p, position: "h" }, p), undefined);
    assert.equal(s.hlhj_jiangzhu.mod.cardname({ name: "sha", owner: p, position: "x" }, p), undefined);
    assert.equal(s.hlhj_jiangzhu.mod.cardname({ name: "sha", owner: b, position: "h" }, p), undefined);
});
test("木石缘只选择一次；无男性时安全跳过", async () => {
    const { s, p, b, game } = setup(); delete p.storage.hlhj_mushi;
    await s.hlhj_mushi.content({}, {}, p); assert.deepEqual(p.getStorage("hlhj_mushi"), [b]);
    assert.equal(s.hlhj_mushi.filter({ name: "phase" }, p), false);
    delete p.storage.hlhj_mushi_chosen; delete p.storage.hlhj_mushi; game.players = [p];
    await s.hlhj_mushi.content({}, {}, p); assert.deepEqual(p.getStorage("hlhj_mushi"), []);
});
test("情思替换自身目标且保留其他目标；拒绝重复目标、非法自指和已死木石缘", async () => {
    const { s, p, b, o, game } = setup();
    p.hand.push({ name: "sha", position: "h", owner: p });
    const parent = { targets: list(p, game.players[3]), triggeredTargets2: list(p) };
    const e = useEvent(o, p, undefined, parent);
    assert.ok(s.hlhj_qingsi_redirect.filter(e, p));
    await s.hlhj_qingsi_redirect.content({}, e, p);
    assert.deepEqual([...parent.targets], [game.players[3], b]); assert.equal(parent.triggeredTargets2.includes(p), false);
    assert.equal(s.hlhj_qingsi_redirect.filter(useEvent(b, p), p), false);
    assert.equal(s.hlhj_qingsi_redirect.filter(useEvent(o, p, undefined, { targets: list(p, b) }), p), false);
    b.alive = false; assert.equal(s.hlhj_qingsi_redirect.filter(useEvent(o, p), p), false);
});
test("拒绝情思响应不会改变目标", async () => {
    const { s, p, o } = setup(); p.accept = false;
    const e = useEvent(o, p); await s.hlhj_qingsi_redirect.content({}, e, p);
    assert.deepEqual([...e.targets], [p]);
});
test("葬花逐次获得1/2/3张，复制属性一致，回合结束6花换6泪并摸6牌", async () => {
    const { s, p, b, o } = setup(); const originals = [];
    for (let i = 1; i <= 3; i++) {
        const c = { name: "sha", suit: "heart", number: 7, nature: "fire", position: "d" }; originals.push(c);
        p.buttonResult = { bool: true, links: [c] };
        await s.hlhj_xiangduan.content({}, discardEvent(o, [c]), p);
        assert.equal(p.flowers.length, i * (i + 1) / 2);
    }
    const copies = p.flowers.filter(c => c._destroy); assert.equal(copies.length, 3);
    assert.ok(copies.every(c => c.name === "sha" && c.suit === "heart" && c.number === 7 && c.nature === "fire"));
    await s.hlhj_hua.content({}, {}, p);
    assert.equal(p.countMark("hlhj_lei"), 6); assert.equal(b.drawn, 6); assert.equal(p.flowers.length, 0);
    assert.ok(copies.every(c => c.position === "destroyed")); assert.ok(originals.every(c => c.position === "d"));
});
test("只收取他人真正弃置且仍在弃牌堆的牌；异步子事件不重复", () => {
    const { s, p, o } = setup(); const c = { position: "d" };
    assert.ok(s.hlhj_xiangduan.filter(discardEvent(o, [c]), p));
    assert.equal(s.hlhj_xiangduan.filter(discardEvent(p, [c]), p), false);
    assert.equal(s.hlhj_xiangduan.filter({ ...discardEvent(o, [c]), type: "gain" }, p), false);
    assert.equal(s.hlhj_xiangduan.filter(discardEvent(o, [c], { name: "loseAsync" }), p), false);
    assert.ok(s.hlhj_xiangduan.filter(discardEvent(o, [c], {}, "loseAsync"), p));
    c.position = "h"; assert.equal(s.hlhj_xiangduan.filter(discardEvent(o, [c]), p), false);
});
test("葬花取消或弃牌已被拿走时不递增", async () => {
    const { s, p, o } = setup(); const c = { position: "d" };
    await s.hlhj_xiangduan.content({}, discardEvent(o, [c]), p); assert.equal(p.storage.hlhj_flower_step, undefined);
    p.buttonResult = { bool: true, links: [{ position: "h" }] };
    await s.hlhj_xiangduan.content({}, discardEvent(o, [c]), p); assert.equal(p.flowers.length, 0);
});
test("红色目标每次用牌只计一次，得泪1/2/3并令木石缘等量摸牌", async () => {
    const { s, p, b, o } = setup();
    for (let i = 1; i <= 3; i++) {
        const e = useEvent(o, b); assert.ok(s.hlhj_xiaoxiang.filter(e, p));
        await s.hlhj_xiaoxiang.content({}, e, p); assert.equal(s.hlhj_xiaoxiang.filter(e, p), false);
    }
    assert.equal(p.countMark("hlhj_lei"), 6); assert.equal(b.drawn, 6);
    assert.equal(s.hlhj_xiaoxiang.filter(useEvent(b, b), p), false);
    assert.equal(s.hlhj_xiaoxiang.filter(useEvent(o, b, { color: "black" }), p), false);
});
test("双方转移按事件计泪，摸牌不计，异步gain子事件不重复", () => {
    const { s, p, b, o } = setup(); const c = {};
    const e = { name: "gain", getParent: () => ({}), getg: x => x === b ? [c] : [], getl: x => ({ cards2: x === o ? [c] : [] }) };
    assert.ok(s.hlhj_xiaoxiang.filter(e, p));
    assert.ok(s.hlhj_xiaoxiang.filter({ ...e, getg: x => x === o ? [c] : [], getl: x => ({ cards2: x === b ? [c] : [] }) }, p));
    assert.equal(s.hlhj_xiaoxiang.filter({ ...e, getl: () => ({ cards2: [] }) }, p), false);
    assert.equal(s.hlhj_xiaoxiang.filter({ ...e, getParent: () => ({ name: "loseAsync" }) }, p), false);
    assert.ok(s.hlhj_xiaoxiang.filter({ ...e, name: "loseAsync" }, p));
});
test("失泪独立递增、最低0、同次用牌去重，零泪不递增", () => {
    const { s, p, b } = setup(); p.addMark("hlhj_lei", 5); p.storage.hlhj_gain_step = 4;
    for (let i = 0; i < 3; i++) { const e = useEvent(b, p); assert.ok(s.hlhj_xiaoxiang_loss.filter(e, p)); s.hlhj_xiaoxiang_loss.content({}, e, p); assert.equal(s.hlhj_xiaoxiang_loss.filter(e, p), false); }
    assert.equal(p.countMark("hlhj_lei"), 0); assert.equal(p.storage.hlhj_loss_step, 3); assert.equal(p.storage.hlhj_gain_step, 4);
    assert.equal(s.hlhj_xiaoxiang_loss.filter(useEvent(b, p), p), false);
});
test("每个角色回合开始重置花、得泪、失泪和代伤次数", () => {
    const { s, p } = setup(); for (const k of ["hlhj_flower_step", "hlhj_gain_step", "hlhj_loss_step", "hlhj_wish_used"]) p.storage[k] = 5;
    s.hlhj_turn.content({}, {}, p); assert.equal(p.storage.hlhj_flower_step + p.storage.hlhj_gain_step + p.storage.hlhj_loss_step + p.storage.hlhj_wish_used, 0);
});
test("达到8泪：先摸牌，再弃全部手牌、授遗愿、直接死亡", async () => {
    const { s, p, b, o, log } = setup(); p.addMark("hlhj_lei", 7); p.hand = [{}];
    await s.hlhj_xiaoxiang.content({}, useEvent(o, b), p);
    assert.equal(p.alive, false); assert.equal(p.hand.length, 0); assert.ok(b.hasSkill("hlhj_yiyuan"));
    assert.deepEqual(log, ["draw", "discard", "gift", "die"]);
});
test("阈值随人数变化，最小8；人数减少也触发归梦", async () => {
    const { s, p, game } = setup(6); p.addMark("hlhj_lei", 10);
    assert.equal(s.hlhj_guimeng.filter({}, p), false);
    game.players[5].alive = false; assert.ok(s.hlhj_guimeng.filter({}, p));
    await s.hlhj_guimeng.content({}, {}, p); assert.equal(p.alive, false);
    assert.equal(s.hlhj_guimeng.filter({}, p), false);
});
test("木石缘已死仍累积泪及归梦，但不摸牌、不授遗愿", async () => {
    const { s, p, b } = setup(); b.alive = false; p.flowers = Array.from({ length: 8 }, () => ({}));
    await s.hlhj_hua.content({}, {}, p);
    assert.equal(p.alive, false); assert.equal(b.drawn, undefined); assert.equal(b.hasSkill("hlhj_yiyuan"), false);
});
test("普通死亡也授遗愿且只授一次", () => {
    const { s, p, b } = setup(); assert.ok(s.hlhj_guimeng_gift.filter({}, p));
    s.hlhj_guimeng_gift.content({}, {}, p); assert.ok(b.hasSkill("hlhj_yiyuan")); assert.equal(s.hlhj_guimeng_gift.filter({}, p), false);
});
test("遗愿自愿代伤每回合一次，拒绝不消耗，保留来源数值属性且禁止重复转移", async () => {
    const { s, b, o, p } = setup(); const e = { player: o, source: p, num: 2, nature: "fire", card: {} };
    b.accept = false; await s.hlhj_yiyuan_guard.content({}, e, b); assert.equal(e.player, o); assert.equal(b.storage.hlhj_wish_used, undefined);
    b.accept = true; assert.ok(s.hlhj_yiyuan_guard.filter(e, b)); await s.hlhj_yiyuan_guard.content({}, e, b);
    assert.equal(e.player, b); assert.equal(e.source, p); assert.equal(e.num, 2); assert.equal(e.nature, "fire");
    assert.equal(s.hlhj_yiyuan_guard.filter(e, o), false); assert.equal(s.hlhj_yiyuan_guard.filter({ player: o, num: 1 }, b), false);
    s.hlhj_turn.content({}, {}, b); assert.ok(s.hlhj_yiyuan_guard.filter({ player: o, num: 1 }, b));
});
test("遗愿每次受伤回复1点；死亡后不复活", async () => {
    const { s, b } = setup(); b.hp = 1; assert.ok(s.hlhj_yiyuan.filter({}, b)); await s.hlhj_yiyuan.content({}, {}, b); assert.equal(b.hp, 2);
    b.alive = false; assert.equal(s.hlhj_yiyuan.filter({}, b), false);
});
