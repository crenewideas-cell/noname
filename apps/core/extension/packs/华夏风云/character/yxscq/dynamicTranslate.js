import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const dynamicTranslates = {
    //动态技能描述
    hx_yinshi(player) {
        if (!player.storage.hx_yinshi) {
            return lib.translate["hx_yinshi_info"];
        } else {
            var num = player.storage.hx_yinshi;
            return "每轮第" + num + "个回合开始时，你摸" + num + "张牌。";
        }
    },
    /*hun_yuhun(player) {
        if (!player.storage.hun_yuhun) {
            return `转换技，出牌阶段限一次，阴：你可以弃置两张牌并指定一名手牌不小于你的其他角色，你摸牌至与该角色手牌数量相同。<span class="bluetext">阳：你可以弃置任意张牌并摸等量张牌。</span>。`;
        }
        return `转换技，出牌阶段限一次，<span class="bluetext">阴：你可以弃置两张牌并指定一名手牌不小于你的其他角色，你摸牌至与该角色手牌数量相同。</span>阳：你可以弃置任意张牌并摸等量张牌。`;
    },*/
    hx_zhitui(player) {
        var s = player.storage.hx_zhitui || [2, 1, 1, 1];
        return "准备阶段与结束阶段。若你的手牌数不为最多，你摸(" + s[0] + ")张牌；否则你可令手牌数不小于你的(" + s[1] + ")名其他角色交给你(" + s[2] + ")张牌；你的手牌上限+(" + s[3] + ")。";
    },
    hun_an(player) {
        var s = player.storage.hun_bian2;
        var storage = player.storage.hun_an;
        var yang = s ? "你获得一张与此牌类型不同的牌并令一名角色交给另一名角色一张牌" : "你获得一张与此牌类型不同的牌/你令一名角色交给另一名角色一张牌";
        var yin = s ? "你令至多两名角色横置并令一名角色对一名除你以外的其他角色造成1点暗属性伤害。" : "你令至多两名角色横置/你令一名角色对一名除你以外的其他角色造成1点暗属性伤害。";
        if (storage) {
            yin = `<span class="bluetext">${yin}</span>`;
        } else {
            yang = `<span class="firetext">${yang}</span>`;
        }
        var start = "转换技。当你使用或打出" + (s ? "牌时" : "红色/黑色牌时") + "，";
        var end = "。";
        return `${start}阳：${yang}；阴：${yin}${end}`;
    },
};
export default dynamicTranslates;