import { lib, game, ui, get, ai, _status } from "noname";
/** @type { importCharacterConfig["skill"] } */
export default {
    mjs_debuff_fengjin: {
        popup: false,
        charlotte: true,
        init(player, skill) {
            player.addSkillBlocker(skill);
            game.broadcastAll(
                player => {
                    
                },
                player
            );
        },
        onremove(player, skill) {
            player.removeSkillBlocker(skill);
        },
        skillBlocker(skill, player) {
            return !lib.skill[skill].persevereSkill && !lib.skill[skill].charlotte;
        },
    },
    mjs_debuff_liuxue: {
        nopop: true,
        trigger: {
            player: "phaseEnd",
        },
        silent: true,
        charlotte: true,
        onremove: true,
        async content(event, trigger, player) {
            await player.loseHp();
            player.removeMark(event.name);
            if (!player.hasMark(event.name)) {
                player.removeSkill(event.name);
            }
        },
        ai: {
            result: {
                target(player, target) {
                    const att = get.sgnAttitude(player, target);
                    if (att > 0) {
                        return 0;
                    }
                    if (target.hasSkillTag("mjs_debuff_liuxue")) {
                        return 0;
                    }
                    const num = target.countMark("mjs_debuff_zhongdu");
                    return (-att + 2) / (num > 2 ? num * 1.15 : 1);
                },
            },
        },
        mark: true,
        intro: {
            markcount: (storage) => {
                return storage > 0 ? `x${storage}` : storage;
            },
            content: "info",
        },
    },
    mjs_debuff_zhongdu: {
        nopop: true,
        trigger: {
            player: "recoverBegin",
        },
        silent: true,
        charlotte: true,
        onremove: true,
        async content(event, trigger, player) {
            trigger.cancel();
            player.removeMark(event.name);
            if (!player.hasMark(event.name)) {
                player.removeSkill(event.name);
            }
        },
        ai: {
            result: {
                target(player, target) {
                    const att = get.sgnAttitude(player, target);
                    if (att > 0) {
                        return 0;
                    }
                    if (target.hasSkillTag("mjs_debuff_zhongdu_defend")) {
                        return 0;
                    }
                    const num = target.countMark("mjs_debuff_zhongdu");
                    return (-att + 2) / (num > 2 ? num * 1.15 : 1);
                },
            },
        },
        mark: true,
        intro: {
            markcount: (storage) => {
                return storage > 0 ? `x${storage}` : storage;
            },
            content: "info",
        },
    },
};

