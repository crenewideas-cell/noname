import { lib, game, ui, get, ai, _status } from "noname";

const skills = {
    nysgs_mou_caocao_shadow_skinSkill: {
        nobracket: true,
        init(player, skill) {
            if (_status?.currentPhase !== player) {
                return;
            }
            if (!get.info(skill).filterx(null, player)) return;
            const targets = game.filterPlayer(current => current !== player);
            for (const target of targets) {
                target.addTempSkill(skill + "_block");
            }
        },
        onremove(player, skill) {
            if (_status?.currentPhase !== player) {
                return;
            }
            if (!get.info(skill).filterx(null, player)) return;
            const targets = game.filterPlayer(current => current !== player);
            for (const target of targets) {
                target.removeSkill(skill + "_block");
            }
        },
        trigger: {
            player: "phaseBeginStart",
        },
        forced: true,
        charlotte: true,
        filter(event, player) {
            if (!get.info("nysgs_mou_caocao_shadow_skinSkill").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_mou_caocao") && player.skin?.name == "nysgs_mou_caocao_shadow";
        },
        async content(event, trigger, player) {
            get.info(event.name).init(player, event.name);
        },
        subSkill: {
            block: {
                inherit: "fengyin",
                trigger: {
                    player: "damageEnd",
                },
                forced: true,
                filter(event, player) {
                    return event.source && event.source == _status.currentPhase;
                },
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
            },
        },
    },
    nysgs_wei_guanyu_shadow_skinSkill: {
        nobracket: true,
        global: "nysgs_wei_guanyu_shadow_skinSkill_global",
        locked: true,
        trigger: {
            target: "useCardToBefore",
        },
        forced: true,
        charlotte: true,
        filter(event, player) {
            if (!get.info("nysgs_wei_guanyu_shadow_skinSkill").filterx(event, player)) return false;
            return event.player.group != "sha" && get.color(event.card) != "red";
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_wei_guanyu") && player.skin?.name == "nysgs_wei_guanyu_shadow";
        },
        content() {
            trigger.cancel();
        },
        ai: {
            effect: {
                target(card, player, target) {
                    if (!get.info("nysgs_wei_guanyu_shadow_skinSkill").filterx(null, target)) return;
                    if (player.group != "shu" || get.color(card) != "red") return "zeroplayertarget";
                },
            },
        },
        subSkill: {
            global: {
                mod: {
                    targetInRange(card, player, target) {
                        if (player.group != "shu") return;
                        if (card.name != "sha" || get.color(card) != "red") return;
                        if (!game.hasPlayer(current => {
                            return lib.skill.nysgs_wei_guanyu_shadow_skinSkill.filterx(null, current);
                        })) {
                            return;
                        }
                        return true;
                    },
                },
            },
        },
    },
};
const translates = {
    nysgs_mou_caocao_shadow: "七星曜日",
    nysgs_mou_caocao_shadow_skinSkill: "七星曜日",
    nysgs_mou_caocao_shadow_skinSkill_info: "锁定技，你的回合内，未受到你伤害的其他角色封禁。",

    nysgs_wei_guanyu_shadow: "匡顶炎汉",
    nysgs_wei_guanyu_shadow_skinSkill: "匡顶炎汉",
    nysgs_wei_guanyu_shadow_skinSkill_info: "锁定技，场上蜀势力角色使用的红色牌无距离限制；场上非蜀势力角色使用的非红色牌对你无效。",
};
Object.assign(lib.translate, translates);

if (lib.config["extension_怒焰三国_chooseSkin"]) {
    Object.assign(skills, {
        _nysgs_skinSkill: {
            charlotte: true,
            ruleSkill: true,
            trigger: {
                global: "chooseCharacterAfter",
            },
            silent: true,
            lastDo: true,
            filter(event, player) {
                return player.skin?.name && !player._nysgs_skinSkill;
            },
            async content(event, trigger, player) {
                player._nysgs_skinSkill = true;
                const skill = player.skin.name + "_skinSkill";
                if (lib.skill[skill]) {
                    player.addSkill(skill);
                }
            },
        },
    });
}

export default skills;
