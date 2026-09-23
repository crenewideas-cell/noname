import test from "node:test";
import assert from "node:assert/strict";
import extension from "../apps/core/extension/packs/红楼幻境/extension.js";
import { visibleSkillState } from "../apps/core/noname/online/publicSkillState.js";

const choice = result => ({ set() { return this; }, async forResult() { return result; } });
function setup() {
    const lib = { config: {}, card: {
        sha: { type: "basic", damage: true }, shan: { type: "basic" }, tao: { type: "basic" },
        juedou: { type: "trick", damage: true }, nanman: { type: "trick", damage: true },
        wuzhong: { type: "trick" }, wuxie: { type: "trick" }, lebu: { type: "delay" },
        zhuge: { type: "equip", subtype: "equip1" }, bagua: { type: "equip", subtype: "equip2" },
    }, filter: { targetEnabled2: () => true, cardDiscardable: () => true } };
    lib.inpile = Object.keys(lib.card);
    const broadcasts = [], log = [], groups = [];
    const game = { players: [], dead: [], roundNumber: 1,
        broadcast(fn, ...args) { broadcasts.push(args); },
        filterPlayer(fn) { return this.players.filter(p => p.isIn() && fn(p)); },
        hasPlayer(fn) { return this.filterPlayer(fn).length > 0; },
        countPlayer() { return this.filterPlayer(() => true).length; },
        checkMod() { return "unchanged"; }, addGroup(...args) { groups.push(args); },
        hlhjVoice: { register() {}, ruleSkill: {}, entered: new WeakSet() },
        createCard2(...args) { return card(...args); },
        async cardsDiscard(cards) { cards.forEach(c => move(c, null, "d")); },
    };
    const get = { owner: c => c.owner, position: c => c.position,
        tag: (c, tag) => tag === "damage" && !!lib.card[c.name]?.damage,
        type: c => lib.card[typeof c === "string" ? c : c.name]?.type,
        color: c => ["heart", "diamond"].includes(c.suit) ? "red" : "black",
        autoViewAs: (c, cards) => ({ ...c, cards }), translation: c => c?.name || String(c),
        value: () => 1, attitude: () => 1, effect: () => -1, mode: () => "identity",
    };
    const status = {}, ui = { special: {}, create: { dialog() {
        return { links: [], addText() {}, add([links]) { this.links.push(...links); } };
    } } };
    const pack = extension(lib, game, ui, get, {}, status);
    Object.assign(lib.card, pack.package.card.card);
    const s = lib.skill = pack.package.skill.skill;
    let sequence = 0;
    function card(name, suit = "heart", number = 7, nature) {
        const c = { storage: {}, gaintag: [], cardid: String(++sequence), parentNode: {},
            init([suit, number, name, nature]) {
                Object.assign(this, { suit, number, name, nature });
                if (lib.card[name]?.destroy) this.destroyed = lib.card[name].destroy;
            },
            addGaintag(tags) { this.gaintag = [...new Set([...this.gaintag, ...tags])]; },
            hasGaintag(tag) { return this.gaintag.includes(tag); },
            willBeDestroyed(position, player, event) {
                return typeof this.destroyed === "function" ? this.destroyed(this, position, player, event) : this.destroyed === position;
            },
        };
        c.init([suit, number, name, nature]); return c;
    }
    function move(c, p, zone) {
        if (c.owner) for (const cards of Object.values(c.owner.zones)) {
            const index = cards.indexOf(c); if (index >= 0) cards.splice(index, 1);
        }
        c.owner = p; c.position = zone;
        if (p) p.zones[zone].push(c);
    }
    function player(id) {
        return { playerid: id, name: id, storage: {}, zones: { h: [], e: [], x: [] }, skills: [], alive: true,
            isIn() { return this.alive; }, isUnderControl() { return false; },
            hasSkill(k) { return this.skills.includes(k) || (k === "hlhj_moshi" && !this.disabled && this.zones.e.some(c => c.name === "hlhj_tonglingbaoyu")); },
            hasSkillTag() { return !!this.disabled; },
            getStorage(k) { return this.storage[k] || []; }, syncStorage() {}, send() {}, updateMarks() {},
            markSkill() {}, unmarkSkill() {}, logSkill() {}, getSeatNum() { return game.players.indexOf(this) + 1; },
            addSkill(k) { this.skills.push(k); }, removeSkill(k) { this.skills = this.skills.filter(s => s !== k); },
            getCards(zone, filter = () => true) { return this.zones[zone].filter(filter); },
            hasCard(filter, zone = "h") { return this.getCards(zone, filter).length > 0; },
            countCards(zone) { return this.zones[zone].length; },
            getExpansions(tag) { return this.zones.x.filter(c => c.hasGaintag(tag)); },
            canEquip() { return !this.noEquip; },
            async equip(c) { move(c, this, "e"); log.push("equip"); },
            async gain(cards) { cards.forEach(c => move(c, this, "h")); },
            async loseToDiscardpile(cards) { cards.forEach(c => move(c, null, "d")); },
            async draw(n = 1) { this.drawn = (this.drawn || 0) + n; },
            chooseBool() { return choice({ bool: this.accept !== false }); },
            chooseCard() { return choice(this.cardResult || { bool: false }); },
            chooseCardTarget() { return choice(this.cardTargetResult || { bool: false }); },
            chooseButton(args) { this.lastButtons = args; return choice(this.buttonResult || { bool: false }); },
            async showCards(cards) { this.shown = cards; log.push("show"); },
            lose(cards) { cards.forEach(c => move(c, null, "s")); return choice({}); },
            $addToExpansion(cards, unused, tags) { cards.forEach(c => { move(c, this, "x"); c.addGaintag(tags); }); },
            addToExpansion(cards) {
                cards.forEach(c => move(c, this, "x"));
                const result = Promise.resolve(); result.gaintag = { add: tag => cards.forEach(c => c.addGaintag([tag])) }; return result;
            },
        };
    }
    const [p, b, o] = game.players = [player("p"), player("b"), player("o")];
    p.skills = [...pack.package.character.character.hlhj_baoyu.skills];
    status.event = { player: p };
    function reading(cards = [card("wuzhong")], contributor = p) {
        p.storage.hlhj_gongdu = [b]; b.storage.hlhj_readers = [p]; b.addSkill("hlhj_readers");
        p.storage.hlhj_book_session ||= 1;
        p.storage.hlhj_book_pages = cards.map(c => { move(c, p, "x"); c.addGaintag(["hlhj_book"]); return { card: c, contributor }; });
        return cards;
    }
    function options(player = p) {
        return s.hlhj_read.chooseButton.dialog({ name: "chooseToRespond", filterCard: () => true }, player).links;
    }
    async function useEpitaph(player, name) {
        const link = options(player).find(link => link[2] === name && link[4][5] >= 0);
        assert.ok(link, `expected ${name} option`);
        const backup = s.hlhj_read.chooseButton.backup([link]);
        const event = { result: { bool: true, card: backup.viewAs } };
        await backup.precontent(event, {}, player); return event;
    }
    return { lib, pack, game, s, p, b, o, card, move, reading, options, useEpitaph, broadcasts, log, groups };
}

test("宝玉注册情缘体系与六技能，转化与衔玉分别展示", () => {
    const { pack, s, groups } = setup(); pack.precontent();
    const character = pack.package.character.character.hlhj_baoyu;
    assert.deepEqual([character.group, character.hp, character.maxHp, character.skills.length], ["hlhj_qing", 4, 4, 6]);
    assert.ok(groups.some(group => group[0] === "hlhj_qing"));
    assert.ok(!s.hlhj_xianyu.mod); assert.ok(s.hlhj_baoyu_jiangzhu.locked);
    assert.equal(s.hlhj_gongdu.usable, undefined);
    assert.equal(s.hlhj_mengyou.trigger.player, "phaseEnd");
});

test("两人的基本、伤害锦囊、武器转化保留花色点数，非伤害锦囊和防具不转化", () => {
    for (const [skill, name] of [["hlhj_baoyu_jiangzhu", "hlhj_qingjian"], ["hlhj_jiangzhu", "hlhj_qingsi"]]) {
        const { s, p, b, card, move } = setup();
        for (const original of ["sha", "shan", "tao", "juedou", "nanman", "zhuge", "wuzhong", "bagua", "lebu"]) {
            const c = card(original, "spade", 12, "fire"); move(c, p, "h");
            const id = c.cardid;
            s[skill].mod.handcardGain(p);
            assert.equal(c.name, ["wuzhong", "bagua", "lebu"].includes(original) ? original : name);
            assert.deepEqual([c.suit, c.number, c.cardid], ["spade", 12, id]);
        }
        const equipment = card("zhuge"); move(equipment, p, "e");
        assert.equal(s[skill].mod.cardname(equipment, p), undefined);
        move(equipment, b, "h"); assert.equal(s[skill].mod.cardname(equipment, p), undefined);
    }
});

test("情笺与情思反复互转后可逐层恢复实体原牌，临时牌销毁", () => {
    const { s, p, b, card, move } = setup();
    const c = card("juedou", "club", 11); const id = c.cardid;
    for (let i = 0; i < 4; i++) {
        move(c, p, "h"); s.hlhj_baoyu_jiangzhu.mod.handcardGain(p);
        move(c, b, "h"); s.hlhj_jiangzhu.mod.handcardGain(b);
    }
    assert.equal(c.willBeDestroyed("ordering", b), false); assert.equal(c.name, "hlhj_qingsi");
    assert.equal(c.willBeDestroyed("discardPile", b), false);
    assert.deepEqual([c.name, c.suit, c.number, c.cardid], ["juedou", "club", 11, id]);
    assert.equal(c.storage.hlhj_qingsi_source, undefined); assert.equal(c.storage.hlhj_qingjian_source, undefined);
    const copy = card("nanman"); copy.storage.hlhj_temporary = true; move(copy, p, "h");
    s.hlhj_baoyu_jiangzhu.mod.handcardGain(p); assert.equal(copy.willBeDestroyed("cardPile", p), true);
});

test("共读者死亡：建空诔台且全部余书归宝玉；宝玉死亡则全部归对方", async () => {
    for (const deadOwner of [false, true]) {
        const { s, p, b, card, reading } = setup(); const pages = reading([card("wuzhong"), card("shan")], b);
        (deadOwner ? p : b).alive = false;
        if (deadOwner) await s.hlhj_read_cleanup.content({ triggername: "die" }, { name: "die", player: p }, p);
        else {
            await s.hlhj_duzhuan.content({}, { player: b }, p);
            assert.deepEqual(p.storage.hlhj_furonglei[0].names, []);
            assert.equal(p.lastButtons, undefined);
        }
        assert.deepEqual((deadOwner ? b : p).zones.h, pages); assert.deepEqual(p.storage.hlhj_gongdu, []);
    }
});

test("正常结束共读按放入者归还书，异方用书摸牌，拒绝续页结束", async () => {
    const { s, p, b, card, reading } = setup(); const pages = reading([card("wuzhong"), card("shan")]);
    p.storage.hlhj_book_pages[1].contributor = b;
    const trigger = { card: { storage: { hlhj_read: { owner: p, contributor: p, session: 1 } } } };
    await s.hlhj_read_after.content({}, trigger, b);
    assert.equal(p.drawn, 1); assert.deepEqual(p.zones.h, [pages[0]]); assert.deepEqual(b.zones.h, [pages[1]]);
});

test("梦放在目标特殊栏位并可累积，发给旁观者的消息不含牌面", async () => {
    const { s, p, b, card, move, reading, broadcasts } = setup(); reading();
    const cards = [card("hlhj_qingjian", "heart"), card("hlhj_qingjian", "spade")];
    for (const c of cards) {
        move(c, p, "h"); p.cardTargetResult = { bool: true, cards: [c], targets: [b] };
        await s.hlhj_mengyou.content({}, {}, p);
    }
    assert.deepEqual(b.getExpansions("hlhj_dream_p"), cards); assert.equal(p.getExpansions("hlhj_dream").length, 0);
    assert.deepEqual(p.storage.hlhj_dream_target, [b]); assert.deepEqual(b.storage.hlhj_dream_owners, [p]);
    const masked = broadcasts.filter(args => typeof args[1] === "string" && args[1].startsWith("_noname_card:"));
    assert.equal(masked.length, 2); assert.ok(masked.every(args => !/heart|spade|qingjian/.test(args[1])));
});

async function dreamFixture() {
    const f = setup(), { s, p, b, card, move } = f;
    await s.hlhj_xianyu_start.content({}, {}, p);
    const dream = card("hlhj_qingjian", "heart"); move(dream, p, "h");
    p.cardTargetResult = { bool: true, cards: [dream], targets: [b] };
    await s.hlhj_mengyou.content({}, {}, p);
    const parent = { excluded: new Set() };
    const trigger = { target: b, player: f.o, card: card("sha", "heart"), getParent: () => parent };
    f.log.length = 0;
    return { ...f, dream, trigger, parent, jade: p.storage.hlhj_jade[0] };
}

test("护梦先赠玉后展示，同色取消目标；梦保留，玉可在下一回合召回", async () => {
    const { s, p, b, dream, trigger, parent, jade, log } = await dreamFixture();
    assert.ok(s.hlhj_mengyou_reveal.filter(trigger, p));
    await s.hlhj_mengyou_reveal.content({}, trigger, p);
    assert.deepEqual(log, ["equip", "show"]); assert.ok(parent.excluded.has(b));
    assert.ok(b.zones.e.includes(jade)); assert.ok(b.zones.x.includes(dream));
    assert.equal(s.hlhj_mengyou_reveal.filter(trigger, p), false);
    await s.hlhj_xianyu_recall.content({}, {}, p); assert.ok(p.zones.e.includes(jade));
    assert.ok(s.hlhj_mengyou_reveal.filter(trigger, p));
});

test("异色仍赠玉但不取消，拒绝则不移动玉、不展示梦", async () => {
    for (const accept of [false, true]) {
        const { s, p, b, trigger, parent, jade, log } = await dreamFixture();
        trigger.card.suit = "spade"; p.accept = accept;
        await s.hlhj_mengyou_reveal.content({}, trigger, p);
        assert.equal(parent.excluded.size, 0); assert.equal(jade.owner, accept ? b : p);
        assert.deepEqual(log, accept ? ["equip", "show"] : []);
    }
});

test("无效装备、手持玉、目标已有玉、宝物栏不可用、自用牌不触发护梦", async () => {
    for (const modify of [f => { f.p.disabled = true; }, f => f.move(f.jade, f.p, "h"),
        f => f.move(f.card("hlhj_tonglingbaoyu"), f.b, "e"), f => { f.b.noEquip = true; },
        f => { f.trigger.player = f.b; }]) {
        const f = await dreamFixture(); modify(f); assert.equal(f.s.hlhj_mengyou_reveal.filter(f.trigger, f.p), false);
    }
});

test("梦主或目标死亡只清理相关梦", async () => {
    const { s, p, b, o, card, move } = await dreamFixture();
    const other = card("hlhj_qingjian"); move(other, p, "h");
    p.cardTargetResult = { bool: true, cards: [other], targets: [o] }; await s.hlhj_mengyou.content({}, {}, p);
    await s.hlhj_dream_clear.content({}, { player: b }, p);
    assert.equal(b.zones.x.length, 0); assert.deepEqual(p.storage.hlhj_dream_target, [o]);
    await s.hlhj_dream_clear.content({}, { player: p }, p); assert.equal(o.zones.x.length, 0);
});

test("诔文逐篇新增且排除伤害牌、延时锦囊与已写牌名", async () => {
    const { s, p, b, o, reading } = setup(); reading();
    p.storage.hlhj_furonglei = [{ dead: o, seat: 3, names: ["shan"] }];
    b.buttonResult = { bool: true, links: [["trick", "", "wuzhong"]] };
    await s.hlhj_duzhuan_rewrite.content({}, { player: b }, p);
    assert.deepEqual(p.storage.hlhj_furonglei[0].names, ["shan", "wuzhong"]);
    const offered = b.lastButtons[1][0].map(link => link[2]);
    for (const name of ["shan", "sha", "juedou", "nanman", "lebu"]) assert.ok(!offered.includes(name));
    assert.ok(offered.includes("tao")); assert.ok(offered.includes("wuxie"));
    p.storage.hlhj_gongdu = []; assert.equal(s.hlhj_duzhuan_rewrite.filter({ player: p }, p), false);
});

test("诔文每人每种每轮独立计次，跨书页和共读关系不重置，新一轮恢复", async () => {
    const { s, p, b, o, card, game, reading, options, useEpitaph } = setup();
    reading([card("bagua"), card("bagua"), card("bagua"), card("bagua")]);
    p.storage.hlhj_furonglei = [{ dead: o, seat: 3, names: ["shan", "tao"] }];
    const used = await useEpitaph(p, "shan"); assert.ok(used.result.bool);
    assert.ok(!options(p).some(link => link[2] === "shan" && link[4][5] >= 0));
    assert.ok(s.hlhj_read.hiddenCard(b, "shan")); assert.ok(s.hlhj_read.hiddenCard(p, "tao"));
    await useEpitaph(b, "shan"); await useEpitaph(p, "tao");
    reading([card("bagua")]); assert.equal(s.hlhj_read.hiddenCard(p, "shan"), false);
    game.roundNumber++; assert.ok(s.hlhj_read.hiddenCard(p, "shan")); await useEpitaph(p, "shan");
});

test("情与不情把全部书交给未受伤的一方并减伤，莫失莫忘独立减伤", async () => {
    const { s, p, b, reading } = setup(); const cards = reading();
    const damage = { player: p, num: 2 };
    await s.hlhj_qingyu.content({}, damage, p); assert.equal(damage.num, 1); assert.deepEqual(b.zones.h, cards);
    await s.hlhj_xianyu_start.content({}, {}, p);
    assert.ok(s.hlhj_moshi.filter(damage, p)); await s.hlhj_moshi.content({}, damage, p); assert.equal(damage.num, 0);
});

test("联机公开梦归属与每人诔文次数，仍隔离私有数据", () => {
    const state = { p: { skills: [], storage: {
        hlhj_dream_owners: ["b"], hlhj_epitaph_used: { round: 1, names: ["shan"] }, privateCard: "heart",
    } } };
    const visible = visibleSkillState(state, "o", ["p"]);
    assert.deepEqual(visible.p.storage, { hlhj_dream_owners: ["b"], hlhj_epitaph_used: { round: 1, names: ["shan"] } });
});

test("身份限制同时覆盖宝玉与黛玉，互不交换成内奸", () => {
    const { pack, game, p, b, o } = setup(); pack.precontent();
    game.players.filter = function (fn) {
        const result = Array.prototype.filter.call(this, fn); result.randomGet = () => result[0]; return result;
    };
    p.name = "hlhj_baoyu"; p.identity = "nei";
    b.name2 = "hlhj_daiyu"; b.identity = "nei"; o.identity = "zhong";
    game.hlhjResolveIdentity();
    assert.equal(p.identity, "zhong"); assert.equal(b.identity, "fan"); assert.equal(o.identity, "nei");
});

test("多个梦可选择比色，所有梦展示后仍保留", async () => {
    const { s, p, b, card, move, dream, trigger, parent } = await dreamFixture();
    const black = card("hlhj_qingjian", "spade"); move(black, p, "h");
    p.cardTargetResult = { bool: true, cards: [black], targets: [b] };
    await s.hlhj_mengyou.content({}, {}, p);
    trigger.card.suit = "spade"; p.buttonResult = { bool: true, links: [black] };
    await s.hlhj_mengyou_reveal.content({}, trigger, p);
    assert.deepEqual(p.shown, [black]); assert.ok(parent.excluded.has(b));
    assert.deepEqual(b.getExpansions("hlhj_dream_p"), [dream, black]);
});

test("赠玉后目标装备失效仍展示梦，但不能令伤害牌无效", async () => {
    const { s, p, b, trigger, parent } = await dreamFixture();
    b.disabled = true; await s.hlhj_mengyou_reveal.content({}, trigger, p);
    assert.equal(p.shown.length, 1); assert.equal(parent.excluded.size, 0);
});

test("情笺可响应基本牌，不能救其他濒死者，免计手牌上限", () => {
    const { s, p, b, card, move } = setup(); const c = card("hlhj_qingjian"); move(c, p, "h");
    assert.ok(s.hlhj_qingjian_use.filter({ name: "chooseToRespond", filterCard: c => c.name === "shan" }, p));
    assert.equal(s.hlhj_qingjian_use.filter({ name: "chooseToUse", dying: b, filterCard: () => true }, p), false);
    assert.equal(s.hlhj_qingjian_use.mod.ignoredHandcard(c), true);
    assert.equal(s.hlhj_qingjian_use.mod.cardDiscardable(c, p, "phaseDiscard"), false);
    assert.equal(s.hlhj_qingjian_use.mod.cardDiscardable(c, p, "otherSkill"), undefined);
});
