import { decodeChoice, validateResult } from "/noname/online/host.js";
import { visibleSkillState } from "/noname/online/publicSkillState.js";
import { normalizeCharacterPool } from "../packages/online-protocol/src/index.ts";

export async function runOnlineTests({ lib, game, ui, get, _status, p, b, o, add, test, assert }) {
    const wire = result => decodeChoice(JSON.parse(JSON.stringify(get.stringifiedResult(result))));
    const reject = fn => { let rejected = false; try { fn(); } catch { rejected = true; } assert(rejected, "非法选择被接受"); };
    const detached = event => { event.parent?.next.remove(event); event.resolve(); return event; };
    await test("联机白名单与武将、情思定义完整加载", () => {
        assert(normalizeCharacterPool({ packs: ["standard", "hlhj"], banned: [] }).packs.includes("hlhj"), "房间未开放红楼幻境");
        assert(lib.connectCharacterPack.includes("hlhj") && lib.characterPack.hlhj.hlhj_daiyu, "联机武将包未注册");
        assert(lib.card.hlhj_qingsi && lib.skill.hlhj_yiyuan_guard, "联机依赖未加载");
    });
    await test("木石缘远端选择及服务端男性目标校验", () => {
        const e = detached(p.chooseTarget("木石前缘", true, (card, player, target) => target !== player && target.hasSex("male")));
        validateResult(e, p, wire({ bool: true, targets: [b] }));
        reject(() => validateResult(e, p, wire({ bool: true, targets: [p] })));
    });
    await test("情思响应跨序列化校验，拒绝锦囊、他人牌及伪造牌名", () => {
        const e = detached(p.chooseToRespond({ position: "h", filterCard: (card, player) => get.name(card, player) === "hlhj_qingsi" }));
        const card = p.getCards("h").find(c => c.name === "sha");
        validateResult(e, p, wire({ bool: true, cards: [card], card: { name: "hlhj_qingsi", isCard: true } }));
        reject(() => validateResult(e, p, wire({ bool: true, cards: [p.getCards("h").find(c => c.name === "wuzhong")], card: { name: "hlhj_qingsi" } })));
        reject(() => validateResult(e, p, wire({ bool: true, cards: [add("sha", b)], card: { name: "hlhj_qingsi" } })));
        reject(() => validateResult(e, p, wire({ bool: true, cards: [card], card: { name: "shan" } })));
        validateResult(e, p, wire({ bool: false }));
    });
    await test("葬花卡牌按钮传输可验证，拒绝本次弃牌以外的卡牌", () => {
        const flower = add("sha", o); ui.discardPile.append(flower);
        const dialog = ui.create.dialog("葬花", [flower], "hidden");
        const e = detached(p.chooseButton(dialog));
        validateResult(e, p, wire({ bool: true, links: [flower] }));
        reject(() => validateResult(e, p, wire({ bool: true, links: [p.getCards("h")[0]] })));
        validateResult(e, p, wire({ bool: false })); dialog.close();
    });
    await test("遗愿同意、拒绝和取消通过远端结果校验", () => {
        const e = detached(b.chooseBool("代伤"));
        validateResult(e, b, wire({ bool: true })); validateResult(e, b, wire({ bool: false }));
        reject(() => validateResult(e, b, wire({ bool: "yes" })));
    });
    window.__hlhjOnline = {
        snapshot() {
            p.storage.hlhj_mushi = [b]; p.storage.hlhj_lei = 4; p.storage.hlhj_gain_step = 2;
            p.storage.secretCards = [p.getCards("h")[0]];
            return get.stringifiedResult(visibleSkillState(get.skillState(b), b.playerid, Object.keys(lib.playerOL)));
        },
        restore(data) {
            b.applySkills(get.parsedResult(data));
            return { bond: p.getStorage("hlhj_mushi")[0]?.playerid, tears: p.countMark("hlhj_lei"), step: p.storage.hlhj_gain_step, secret: "secretCards" in p.storage };
        },
    };
}
