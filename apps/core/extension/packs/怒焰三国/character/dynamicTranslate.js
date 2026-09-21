import { lib, game, ui, get, ai, _status } from "noname";
const dynamicTranslates = {
    nysgs_shen_zhenji_skill3(player, skill) {
        const bool = player.storage[skill];
        const num = 1 + player.countMark("nysgs_shen_zhenji_skill3_buff");
        let yang = `你摸${num}张牌`,
            yin = `你下次发动“神赋”的伤害+${num}`;
        if (bool) {
            yin = `<span class='bluetext'>${yin}</span>`;
        } else {
            yang = `<span class='firetext'>${yang}</span>`;
        }
        let start = "转换技，锁定技。你获得“洛神”标记后，",
            end = "。当你的“洛神”标记数每次达到水仙花数时，此技能的其他数字+1。";
        return `${start}阳：${yang}；阴：${yin}${end}`;
    },
    nysgs_xurong_skill2(player, skill) {
        const bool = player.storage[skill];
        let yang = "随机弃置其4张手牌，然后你获得X个“暴戾”标记",
            yin = "对其造成2点伤害，然后你本回合出杀次数+X";
        if (bool) {
            yin = `<span class='bluetext'>${yin}</span>`;
        } else {
            yang = `<span class='firetext'>${yang}</span>`;
        }
        let start = "转换技，出牌阶段限2次，你可以移除一名其他角色的全部“暴戾”标记，",
            end = "（X为其移除的“暴戾”标记数且至多为3）。";
        return `${start}阳：${yang}；阴：${yin}${end}`;
    },
    nysgs_taohuang_skill2(player, skill) {
        const bool = player.storage[skill];
        let yang = "对其造成X点伤害并随机获得其1张手牌",
            yin = "令其回复1点体力并摸X张牌";
        if (bool) {
            yin = `<span class='bluetext'>${yin}</span>`;
        } else {
            yang = `<span class='firetext'>${yang}</span>`;
        }
        let start = "转换技，出牌阶段每名角色各限1次，你可以选择一名角色，",
            end = "（X为你的怒气且至少为1）。";
        return `${start}阳：${yang}；阴：${yin}${end}`;
    },
    nysgs_zhangxiu_skill2(player, skill) {
        const bool = player.storage[skill];
        let yang = "当作【怒发冲冠】使用，若此牌为装备牌，你摸2张牌",
            yin = `当作【决斗】使用，若此牌为锦囊牌，造成伤害时视为${get.poptip("rule_nysgs_nature_water")}`;
        if (bool) {
            yin = `<span class='bluetext'>${yin}</span>`;
        } else {
            yang = `<span class='firetext'>${yang}</span>`;
        }
        let start = "转换技，出牌阶段限2次，你可以将1张非基本牌，",
            end = "。";
        return `${start}阳：${yang}；阴：${yin}${end}`;
    },
    nysgs_caojinyu_skill(player, skill) {
        const num = Math.min(10, 3 + player.countMark(skill)),
            num2 = Math.min(10, 2 + player.countMark(skill)),
            num3 = Math.min(10, 1 + player.countMark(skill));
        return `每回合限${num}次，一名角色受到伤害后，你可以观看牌堆项${num2}张牌，并将其中至多${num3}张交给其，然后你获得剩余的牌。`;
    },
    nysgs_jie_caojinyu_skill(player, skill) {
        const num = Math.min(10, 3 + player.countMark(skill)),
            num2 = Math.min(10, 2 + player.countMark(skill)),
            num3 = Math.min(10, 1 + player.countMark(skill));
        return `每回合限${num}次，一名角色受到伤害后，你可以观看牌堆项${num2}张牌，并将其中至多${num3}张交给其，然后你获得剩余的牌。你首次登场或准备阶段，你令此技能中的全部数字+2（单项不大于10）。`;
    },
    nysgs_huaman_skill(player, skill) {
        if (player.hasSkill("nysgs_huaman_skill3")) return "其他角色回合开始时，你可以弃置一张手牌，若此牌为：黑桃，视为你强化使用1张【南蛮入侵】；红桃，你从牌堆获得3张不同花色的牌；梅花，你随机弃置其2张手牌；方块，你视为对其强化使用1张【杀】。然后你可以重复此流程（每个回合每种牌名限1次）。";
        return "你于回合内无法使用伤害牌。其他角色回合开始时，你可以弃置一张手牌，若此牌为：黑桃，视为你强化使用1张【南蛮入侵】；红桃，你从牌堆获得3张不同花色的牌；梅花，你随机弃置其2张手牌；方块，你视为对其强化使用1张【杀】。";
    },
    nysgs_fs_huanzhangchu(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "当一名角色的判定牌生效前，你可以将一张黑色手牌代替之。";
        return "你登场时或使用【闪电】后，可以令一名角色受到1点雷电伤害（你觉醒后升级九节杖）。";
    },
    nysgs_fs_huanxiaoqiao(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "你于出牌阶段首次发动“星舞·妹”移除“舞”后，令你本阶段发动该技能移除的“舞”改为2张。";
        return "当你连续使用2张花色相同的非基本牌时，可以从牌堆或弃牌堆中获得2张与之相同花色的牌（你觉醒后升级“青霄”）。";
    },
    nysgs_fs_huan_daqiao(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "你于出牌阶段首次发动“星舞·姊”移除“舞”后，令你本阶段发动该技能移除的“舞”改为2张。";
        return "当你发动“囚鸾”或“桎梏”移除“囚”标记后，可以令一名其他角色获得1个“囚”（你觉醒后升级“夙白”）。";
    },
    nysgs_fs_huancaiwenji(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "一名角色流失体力时，你可以防止之，然后其获得“忘机”直至其下个回合结束。";
        return "准备阶段或你登场时，你可以令一名角色获得“忘忧”直至其下个回合开始。你觉醒后升级“柯琴笛”。";
    },
    nysgs_jie_pangtong_skill(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return `出牌阶段，你可以将1张黑色手牌当作${get.poptip("nysgs_fudichouxin")}使用；你使用【釜底抽薪】结算后，对目标造成2点火属性伤害，然后你获得1点怒气。`;
        return `出牌阶段，你可以将1张黑色手牌当作${get.poptip("nysgs_fudichouxin")}使用；你使用【釜底抽薪】结算后，令目标下次受到的伤害+1，然后你获得1点怒气。`;
    },
    nysgs_sunhanhua_skill2(player, skill) {
        return [
            `你成为其他角色使用黑色【杀】的目标时，你摸1张牌。每当你获得3个“灵”后，可以升级${get.poptip("nysgs_sunhanhua_skill2_lv1")}。`, 
            `你成为其他角色使用【杀】的目标时，你摸2张牌。每当你获得3个“灵”后，可以升级${get.poptip("nysgs_sunhanhua_skill2_lv3")}。`, 
            "你成为其他角色使用【杀】的目标时，你摸2张牌，然后进行一次判定，若判定结果为黑色，则抵消全部伤害。"
        ][player.countMark(skill)];
    },
    nysgs_sunhanhua_skill3(player, skill) {
        return [
            `出牌阶段限5次，你可以将1张基本牌当作【杀】普通使用（不计入限制次数），或将1张非基本牌当作${get.poptip("nysgs_shuiyanqijun")}普通使用。每当你获得3个“灵”后，可以升级${get.poptip("nysgs_sunhanhua_skill3_lv1")}。`, 
            `出牌阶段限5次，你可以将1张基本牌当作【杀】强化使用（不计入限制次数），或将1张非基本牌当作${get.poptip("nysgs_shuiyanqijun")}强化使用。每当你获得3个“灵”后，可以升级${get.poptip("nysgs_sunhanhua_skill3_lv3")}。`, 
            `出牌阶段，你可以移除1个“灵”视为强化使用一张【杀】（不计入限制次数），或视为强化使用一张${get.poptip("nysgs_shuiyanqijun")}。`
        ][player.countMark(skill)];
    },
    nysgs_jie_wuguotai_skill(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "一名角色不因使用、打出或拼点而失去牌后，你摸1张牌。若该角色不为你，你可以交给其至多2张牌，若你本次交出的都是黑色牌，则其流失X点体力（X为你本次交出的牌数）。";
        return "一名角色不因使用、打出或拼点而失去牌后，你摸1张牌。若该角色不为你，你可以交给其至多2张牌，然后你流失1点体力。";
    },
    nysgs_nanhualaoxian_changsheng(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "二级：锁定技，每个回合限1次，你进入濒死状态时，将体力回复至2点。";
        return "一级：锁定技，每轮限1次，你进入濒死状态时，将体力回复至1点。";
    },
    nysgs_nanhualaoxian_yinbing(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "二级：锁定技，你造成伤害后，失去2点怒气。";
        return "一级：锁定技，你造成伤害后，失去1点怒气。";
    },
    nysgs_nanhualaoxian_xianshou(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "二级：锁定技，你获得红桃牌后，摸1张牌。";
        return "一级：锁定技，你获得红桃非基本牌后，摸1张牌。";
    },
    nysgs_nanhualaoxian_guizhou(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "二级：锁定技，你获得黑色非基本牌后，随机摧毁1张手牌。";
        return "一级：锁定技，你获得黑桃非基本牌后，随机摧毁1张手牌。";
    },
    nysgs_nanhualaoxian_leifa(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "二级：你使用方块牌后，可以令一名其他角色受到2点雷电伤害。";
        return "一级：你使用方块牌后，可以令一名其他角色受到1点雷电伤害。";
    },
    nysgs_nanhualaoxian_shouyi(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "二级：锁定技，出牌阶段开始和结束时，你流失1点体力。";
        return "一级：锁定技，出牌阶段开始和结束时，你受到1点雷电伤害。";
    },
    nysgs_nanhualaoxian_fue(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "二级：锁定技，你受到伤害时，数值+1。";
        return "一级：锁定技，你受到大于1点的伤害时，数值+1。";
    },
    nysgs_nanhualaoxian_chengshan(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return `二级：锁定技，你即将造成的伤害视为${get.poptip("rule_nysgs_nature_water")}且数值+1。`;
        return `一级：锁定技，你即将造成的伤害视为${get.poptip("rule_nysgs_nature_water")}。`;
    },
};
export default dynamicTranslates;
