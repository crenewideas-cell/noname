import test from "node:test";
import assert from "node:assert/strict";
import extension from "../apps/core/extension/红楼幻境/extension.js";

const choice = result => ({ set() { return this; }, async forResult() { return result; } });
const list = (...items) => Object.assign(items, { remove(value) { const i = this.indexOf(value); if (i >= 0) this.splice(i, 1); } });
function setup(count = 4) {
    const log = [];
    const lib = { config: {}, card: { sha: { type: "basic" }, tao: { type: "basic" }, wuzhong: { type: "trick" }, zhuge: { type: "equip", subtype: "equip1" }, bagua: { type: "equip", subtype: "equip2" } }, filter: { targetEnabled: (c, p, t) => t !== p, cardRespondable: () => true } };
    const game = {
        players: [], dead: [], phaseNumber: 0,
        broadcast() {},
        hlhjVoice: { register() {}, emit() {}, scope() {}, ruleSkill: {}, entered: new WeakSet() },
        countPlayer() { return this.players.filter(p => p.isIn()).length; },
        hasPlayer(fn) { return this.players.some(fn); },
        addGroup(...args) { this.group = args; },
        createCard2(name, suit, number, nature) { return makeCard(name, suit, number, nature); },
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
            playerid: String(i), storage: {}, hand: [], alive: true, hp: 3,
            skills: i === 0 ? [...pack.package.character.character.hlhj_daiyu.skills] : [],
            isIn() { return this.alive; }, hasSex(s) { return s === (i ? "male" : "female"); },
            getStorage(k) { return this.storage[k] || []; }, syncStorage() {}, line() {}, logSkill() {},
            send() {}, markSkill() {}, unmarkSkill() {}, getHistory(k) { return this.history?.[k] || []; },
            removeSkill(k) { this.skills = this.skills.filter(s => s !== k); },
            countMark(k) { return this.storage[k] || 0; }, addMark(k, n) { this.storage[k] = this.countMark(k) + n; },
            removeMark(k, n) { this.storage[k] = this.countMark(k) - n; }, markAuto(k, v) { this.storage[k] = v; },
            hasSkill(k) { return this.skills.includes(k); }, addSkill(k) { if (!this.skills.includes(k)) this.skills.push(k); if (k === "hlhj_yiyuan") log.push("gift"); },
            hasCard(fn) { return this.hand.some(fn); }, getCards(zone, filter) { return filter ? this.hand.filter(filter) : [...this.hand]; },
            chooseTarget() { return choice(this.targetResult || { bool: true, targets: [game.players[1]] }); },
            chooseButton() { return choice(this.buttonResult || { bool: false }); },
            chooseBool() { return choice({ bool: this.accept !== false }); },
            chooseToRespond() { return choice({ bool: this.accept !== false }); },
            async draw(n) { this.drawn = (this.drawn || 0) + n; log.push("draw"); },
            async discard(cards) { log.push("discard"); this.hand = this.hand.filter(c => !cards.includes(c)); },
            async die() { if (lib.skill.hlhj_guimeng_gift.filter({}, this)) await lib.skill.hlhj_guimeng_gift.content({}, {}, this); log.push("die"); this.alive = false; },
            isDamaged() { return this.hp < 3; }, async recover() { this.hp = Math.min(3, this.hp + 1); },
            addGaintag(cards, tag) { cards.forEach(c => c.addGaintag([tag])); },
            gain(cards) {
                const event = { cards };
                const done = Promise.resolve().then(async () => {
                    this.hand.push(...cards); cards.forEach(c => { c.position = "h"; c.owner = this; });
                    if (lib.skill.hlhj_hua_gain.filter(event, this)) await lib.skill.hlhj_hua_gain.content({}, event, this);
                });
                done.set = (k, v) => { event[k] = v; return done; }; return done;
            },
            async loseToDiscardpile(cards) {
                const loss = { gaintag_map: Object.fromEntries(cards.map((c, i) => [i, [...c.gaintag]])) };
                this.hand = this.hand.filter(c => !cards.includes(c));
                for (const c of cards) {
                    c.position = pack.package.card.card[c.name]?.destroy?.(c, "discardPile", this, loss) ||
                        c.destroyed?.(c, "discardPile") ? "destroyed" : "d";
                    c.gaintag = []; delete c.owner;
                }
                if (lib.skill.hlhj_hua.filter(loss, this)) await lib.skill.hlhj_hua.content({}, loss, this);
            },
        };
    }
    game.players = Array.from({ length: count }, (_, i) => makePlayer(i));
    const [p, b, o] = game.players;
    p.storage.hlhj_mushi = [b];
    status.event = { player: p };
    return { lib, game, get, pack, s: lib.skill, p, b, o, log };
}
function makeCard(name, suit, number, nature) {
    return { name, suit, number, nature, storage: {}, gaintag: [],
        init([s, n, value, attr]) { this.suit = s; this.number = n; this.name = value; this.nature = attr; },
        addGaintag(tags) { this.gaintag = [...new Set([...this.gaintag, ...tags])]; },
        hasGaintag(tag) { return this.gaintag.includes(tag); }, willBeDestroyed() { return false; },
    };
}
const useEvent = (source, target, card = { name: "sha", color: "red" }, parent = {}) => {
    parent.targets ||= list(target);
    parent.triggeredTargets2 ||= list(target);
    return { name: "useCardToTarget", player: source, target, card, targets: parent.targets, getParent: () => parent };
};
const redEvent = (...args) => ({ ...useEvent(...args), name: "useCardToTargeted" });
const discardEvent = (owner, cards, parent = {}, name = "lose") => ({ name, type: "discard", getParent: () => parent, getl: p => p === owner ? { cards2: cards } : undefined });

test("注册命势力、3体力女性与六个主技能", () => {
    const { pack, game } = setup(); pack.precontent();
    assert.deepEqual(game.group.slice(0, 3), ["hlhj_ming", "命", "命"]);
    const c = pack.package.character.character.hlhj_daiyu;
    assert.equal(c.group, "hlhj_ming"); assert.equal(c.hp, 3); assert.equal(c.sex, "female"); assert.equal(c.skills.length, 6);
});
test("转化自己的基本与武器手牌，锦囊、防具、非手牌和其他角色的牌保留原名", () => {
    const { s, p, b } = setup();
    for (const name of ["sha", "tao", "zhuge"]) assert.equal(s.hlhj_jiangzhu.mod.cardname({ name, owner: p, position: "h" }, p), "hlhj_qingsi");
    for (const name of ["wuzhong", "bagua"]) assert.equal(s.hlhj_jiangzhu.mod.cardname({ name, owner: p, position: "h" }, p), undefined);
    assert.equal(s.hlhj_jiangzhu.mod.cardname({ name: "sha", owner: p, position: "x" }, p), undefined);
    assert.equal(s.hlhj_jiangzhu.mod.cardname({ name: "sha", owner: b, position: "h" }, p), undefined);
});
test("木石缘只选择一次；允许选择自己并建立双向标记", async () => {
    const { s, p, b, game } = setup(); delete p.storage.hlhj_mushi;
    await s.hlhj_mushi.content({}, {}, p); assert.deepEqual(p.getStorage("hlhj_mushi"), [b]);
    assert.equal(s.hlhj_mushi.filter({ name: "phase" }, p), false);
    delete p.storage.hlhj_mushi_chosen; delete p.storage.hlhj_mushi; game.players = [p];
    p.targetResult = { bool: true, targets: [p] };
    await s.hlhj_mushi.content({}, {}, p); assert.deepEqual(p.getStorage("hlhj_mushi"), [p]);
    assert.deepEqual(p.getStorage("hlhj_mushiyuan"), [p]);
});
test("情思保留其他目标和来源，木石缘已是目标时额外结算；拒绝自用与死缘", async () => {
    const { s, p, b, o, game } = setup();
    p.hand.push({ name: "sha", position: "h", owner: p });
    const parent = { targets: list(p, game.players[3]), triggeredTargets2: list(p) };
    const e = useEvent(o, p, undefined, parent);
    assert.ok(s.hlhj_qingsi_redirect.filter(e, p));
    await s.hlhj_qingsi_redirect.content({}, e, p);
    assert.deepEqual([...parent.targets], [game.players[3], b]); assert.equal(parent.triggeredTargets2.includes(p), false);
    assert.ok(s.hlhj_qingsi_redirect.filter(useEvent(b, p), p));
    const duplicate = useEvent(o, p, undefined, { targets: list(p, b) });
    await s.hlhj_qingsi_redirect.content({}, duplicate, p);
    assert.deepEqual([...duplicate.targets], [b, b]); assert.equal(duplicate.player, o);
    assert.equal(s.hlhj_qingsi_redirect.filter(useEvent(p, p), p), false);
    b.alive = false; assert.equal(s.hlhj_qingsi_redirect.filter(useEvent(o, p), p), false);
});
test("拒绝情思响应不会改变目标", async () => {
    const { s, p, o } = setup(); p.accept = false;
    const e = useEvent(o, p); await s.hlhj_qingsi_redirect.content({}, e, p);
    assert.deepEqual([...e.targets], [p]);
});
test("葬花逐次获得1/2/3张手牌花并分享同量原面复制牌；失花才得泪", async () => {
    const { s, p, b, o } = setup(); const originals = [];
    for (let i = 1; i <= 3; i++) {
        const c = Object.assign(makeCard("sha", "heart", 7, "fire"), { position: "d" }); originals.push(c);
        p.buttonResult = { bool: true, links: [c] };
        await s.hlhj_xiangduan.content({}, discardEvent(o, [c]), p);
        assert.equal(p.hand.length, i * (i + 1) / 2); assert.equal(b.hand.length, p.hand.length);
    }
    const copies = p.hand.filter(c => c.storage.hlhj_temporary); assert.equal(copies.length, 3);
    assert.ok(p.hand.every(c => c.name === "hlhj_qingsi" && c.hasGaintag("hlhj_hua")));
    assert.ok(b.hand.every(c => c.name === "sha" && c.suit === "heart" && c.number === 7 && c.nature === "fire" && !c.hasGaintag("hlhj_hua")));
    assert.equal(p.countMark("hlhj_lei"), 0);
    await p.loseToDiscardpile([...p.hand]);
    assert.equal(p.countMark("hlhj_lei"), 6); assert.equal(b.drawn, 6); assert.equal(p.hand.length, 0);
    assert.ok(copies.every(c => c.position === "destroyed")); assert.ok(originals.every(c => c.position === "d"));
    assert.ok(originals.every(c => c.name === "sha" && c.nature === "fire"));
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
    await s.hlhj_xiangduan.content({}, discardEvent(o, [c]), p); assert.equal(p.hand.length, 0);
});
test("红色目标每次用牌只计一次，得泪1/2/3并令木石缘等量摸牌", async () => {
    const { s, p, b, o } = setup();
    for (let i = 1; i <= 3; i++) {
        const e = redEvent(o, b); assert.ok(s.hlhj_xiaoxiang.filter(e, p));
        await s.hlhj_xiaoxiang.content({}, e, p); assert.equal(s.hlhj_xiaoxiang.filter(e, p), false);
    }
    assert.equal(p.countMark("hlhj_lei"), 6); assert.equal(b.drawn, 6);
    assert.equal(s.hlhj_xiaoxiang.filter(redEvent(b, b), p), false);
    assert.equal(s.hlhj_xiaoxiang.filter(redEvent(o, b, { color: "black" }), p), false);
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

test("批量转移读取自己的移动子历史，排除途中其他技能触发的转移", () => {
    const { s, p, b, o } = setup(); const card = {};
    const root = { name: "loseAsync", getParent: () => ({}) };
    const gain = { name: "gain", cards: [card], getParent: () => root };
    b.history = { gain: [gain] };
    o.history = { lose: [{ name: "lose", cards: [card], getParent: () => gain }] };
    assert.ok(s.hlhj_xiaoxiang.filter(root, p));
    gain.getParent = () => ({ name: "unrelatedSkill", getParent: () => root });
    assert.equal(s.hlhj_xiaoxiang.filter(root, p), false);
});

test("红牌取消不递增且同次不再询问；遗愿可拒绝", async () => {
    const { s, p, b, o } = setup(); p.accept = false;
    const event = redEvent(o, b);
    await s.hlhj_xiaoxiang.content({}, event, p);
    assert.equal(p.countMark("hlhj_lei"), 0); assert.equal(p.storage.hlhj_gain_step, undefined);
    assert.equal(s.hlhj_xiaoxiang.filter(event, p), false);
    await s.hlhj_guimeng_gift.content({}, {}, p);
    assert.equal(b.hasSkill("hlhj_yiyuan"), false); assert.equal(p.storage.hlhj_gifted, undefined);
});
test("失泪独立递增、最低0、同次用牌去重，零泪不递增", async () => {
    const { s, p, b } = setup(); p.addMark("hlhj_lei", 5); p.storage.hlhj_gain_step = 4;
    for (let i = 0; i < 3; i++) { const e = useEvent(b, p); assert.ok(s.hlhj_xiaoxiang_loss.filter(e, p)); await s.hlhj_xiaoxiang_loss.content({}, e, p); assert.equal(s.hlhj_xiaoxiang_loss.filter(e, p), false); }
    assert.equal(p.countMark("hlhj_lei"), 0); assert.equal(p.storage.hlhj_loss_step, 3); assert.equal(p.storage.hlhj_gain_step, 4);
    assert.equal(s.hlhj_xiaoxiang_loss.filter(useEvent(b, p), p), false);
});
test("每个角色回合开始重置花、得泪、失泪和代伤次数", async () => {
    const { s, p } = setup(); for (const k of ["hlhj_flower_step", "hlhj_gain_step", "hlhj_loss_step", "hlhj_wish_used"]) p.storage[k] = 5;
    await s.hlhj_turn.content({}, {}, p); assert.equal(p.storage.hlhj_flower_step + p.storage.hlhj_gain_step + p.storage.hlhj_loss_step + p.storage.hlhj_wish_used, 0);
});
test("达到16泪：先摸牌，再弃全部手牌、授遗愿、直接死亡", async () => {
    const { s, p, b, o, log } = setup(); p.addMark("hlhj_lei", 15); p.hand = [{}];
    await s.hlhj_xiaoxiang.content({}, redEvent(o, b), p);
    assert.equal(p.alive, false); assert.equal(p.hand.length, 0); assert.ok(b.hasSkill("hlhj_yiyuan"));
    assert.deepEqual(log, ["draw", "discard", "gift", "die"]);
});
test("阈值随人数变化，最小16；人数减少也触发归梦", async () => {
    const { s, p, game } = setup(6); p.addMark("hlhj_lei", 20);
    assert.equal(s.hlhj_guimeng.filter({}, p), false);
    game.players[5].alive = false; assert.ok(s.hlhj_guimeng.filter({}, p));
    await s.hlhj_guimeng.content({}, {}, p); assert.equal(p.alive, false);
    assert.equal(s.hlhj_guimeng.filter({}, p), false);
});
test("木石缘已死仍累积泪及归梦，但不摸牌、不授遗愿", async () => {
    const { s, p, b } = setup(); b.alive = false; const loss = { gaintag_map: Object.fromEntries(Array.from({ length: 16 }, (_, i) => [i, ["hlhj_hua"]])) };
    await s.hlhj_hua.content({}, loss, p);
    assert.equal(p.alive, false); assert.equal(b.drawn, undefined); assert.equal(b.hasSkill("hlhj_yiyuan"), false);
});
test("普通死亡也可授遗愿且只授一次", async () => {
    const { s, p, b } = setup(); assert.ok(s.hlhj_guimeng_gift.filter({}, p));
    await s.hlhj_guimeng_gift.content({}, {}, p); assert.ok(b.hasSkill("hlhj_yiyuan")); assert.equal(s.hlhj_guimeng_gift.filter({}, p), false);
});
test("遗愿自愿代伤每回合一次，拒绝不消耗，保留来源数值属性且禁止重复转移", async () => {
    const { s, b, o, p } = setup(); const e = { player: o, source: p, num: 2, nature: "fire", card: {} };
    b.accept = false; await s.hlhj_yiyuan_guard.content({}, e, b); assert.equal(e.player, o); assert.equal(b.storage.hlhj_wish_used, undefined);
    b.accept = true; assert.ok(s.hlhj_yiyuan_guard.filter(e, b)); await s.hlhj_yiyuan_guard.content({}, e, b);
    assert.equal(e.player, b); assert.equal(e.source, p); assert.equal(e.num, 2); assert.equal(e.nature, "fire");
    assert.equal(s.hlhj_yiyuan_guard.filter(e, o), false); assert.equal(s.hlhj_yiyuan_guard.filter({ player: o, num: 1 }, b), false);
    await s.hlhj_turn.content({}, {}, b); assert.ok(s.hlhj_yiyuan_guard.filter({ player: o, num: 1 }, b));
});
test("遗愿每次受伤回复1点；死亡后不复活", async () => {
    const { s, b } = setup(); b.hp = 1; assert.ok(s.hlhj_yiyuan.filter({}, b)); await s.hlhj_yiyuan.content({}, {}, b); assert.equal(b.hp, 2);
    b.alive = false; assert.equal(s.hlhj_yiyuan.filter({}, b), false);
});
