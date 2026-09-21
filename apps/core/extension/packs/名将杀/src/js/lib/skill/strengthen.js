import { lib, game, ui, get, ai, _status } from "noname";
/** @type { importCharacterConfig["skill"] } */
export default {
    _mjsstrengthen: {
        mod: {
            cardEnabled(card, player) {
                if (card.name == "tao" && card.storage?.mjsstrengthen) {
                    return true;
                }
            },
            targetEnabled(card, player, target) {
                if (card.name == "tao" && card.storage?.mjsstrengthen && target == player) {
                    return true;
                }
            },
            targetInRange(card, player, target) {
                if (card.name == "mjsduoliangjieying" && card?.storage?.mjsstrengthen) {
                    return true;
                }
            },
            selectTarget(card, player, range) {
                if (!card?.storage?.mjsstrengthen) {
                    return;
                }
                if (!["tiesuo", "mjslianhuan", "mjsxiuyangshengxi"].includes(card.name)) return;
                switch (card.name) {
                    case "tiesuo": case "mjsxiuyangshengxi": {
                        range[1] = Infinity;
                    }
                        break;
                    case "taoyuan": case "mjslianhuan": {
                        range[0] = 1;
                        range[1] = Infinity;
                    }
                        break;
                }
            },
        },
        trigger: {
            player: "useCard",
        },
        silent: true,
        ruleSkill: true,
        priority: 15,
        charlotte: true,
        filter(event, player, name) {
            if (!get.info("_mjsstrengthen").filterx(event, player)) {
                return false;
            }
            return get.info("_mjsstrengthen").getList.includes(event.card.name);
        },
        filterx(event, player) {
            if (get.is.convertedCard(event.card) || get.is.virtualCard(event.card)) {
                return false;
            }
            return event.cards?.length == 1 && event.cards[0]?.storage?.mjsstrengthen;
        },
        async content(event, trigger, player) {
            const backups = get.copy(get.info(event.name).getBuff.get(trigger.card.name));
            const next = game.createEvent(`${event.name}_${trigger.card.name}`, false);
            next.player = player;
            next._trigger = trigger;
            next.setContent(backups.content);
            await next;
        },
        get getList() {
            return Array.from(lib.skill._mjsstrengthen.getBuff).map(info => info[0]);
        },
        getBuff: new Map([
            ["sha", {
                description: "出牌阶段限1次，对攻击范围内的1名其他角色造成2点伤害",
                description2: "出牌阶段限1次，对攻击范围内的1名其他角色造成1点雷电伤害，并且造成伤害后，出杀次数+1",
                description3: "出牌阶段限1次，对攻击范围内的1名其他角色造成1点火焰伤害，并且造成伤害后，令目标下回合开始时受到1点火焰伤害",
                async content(event, trigger, player) {
                    if (!game.hasNature(trigger.card)) {
                        //出牌阶段限1次，对攻击范围内的1名其他角色造成2点伤害
                        //出牌阶段限1次，对攻击范围内的1名其他角色造成1点伤害，并且无法被抵消
                        //trigger.directHit.addArray(game.filterPlayer());
                        trigger.baseDamage++;
                    } else if (game.hasNature(trigger.card, "fire") || game.hasNature(trigger.card, "thunder")) {
                        player.addTempSkill("mjsstrengthen_sha");
                        player.markAuto("mjsstrengthen_sha", [trigger.card]);
                    }
                },
            }],
            ["shan", {
                description: "抵消1张杀，并且打出时，弃置目标1张牌",
                async content(event, trigger, player) {
                    const target = trigger.respondTo?.[0];
                    if (target.countDiscardableCards(player, "he")) {
                        await player.discardPlayerCard(target, "he", true);
                    }
                },
            }],
            ["tao", {
                description: "令自己或重伤角色增加1点体力上限，并且恢复1点体力",
                async content(event, trigger, player) {
                    player.when({ global: "useCardToBegin" })
                        .filter(evt => evt.card == trigger.card)
                        .then(async (event, trigger, player) => {
                            trigger.setContent(get.info("_mjsstrengthen").getBuff.get(trigger.card.name).contentx);
                        });
                },
                async contentx(event, trigger, player) {
                    const target = event.target;
                    await target.gainMaxHp();
                    await target.recover();
                },
            }],
            ["mjsduoduoyishan", {
                description: "摸3张牌",
                async content(event, trigger, player) {
                    return;
                    player
                        .when("drawBefore")
                        .filter(event => event.getParent().name == "mjsduoduoyishan" && event.getParent(2) == trigger)
                        .then(async (event, trigger, player) => {
                            trigger.num++;
                        });
                },
            }],
            ["mjsjianyuqishe", {
                description: "令所有其他角色依次打出2张闪，否则受到你造成的1点伤害",
                async content(event, trigger, player) { },
            }],
            ["mjsfenghuolangyan", {
                description: "令所有其他角色依次打出2张杀，否则受到你造成的1点伤害",
                async content(event, trigger, player) { },
            }],
            ["mjslianhuan", {
                description: "令任意名角色进入或解除连环状态，或者直接弃置，然后摸1张牌",
                async content(event, trigger, player) { },
            }],
            ["mjsxiuyangshengxi", {
                description: "令任意名角色回复1点体力",
                async content(event, trigger, player) { },
            }],
            ["mjszhenqianduijue", {
                description: "令一名其他角色和你依次打出2张杀，否则受到对方造成的1点伤害",
                async content(event, trigger, player) {
                    game.countPlayer(target => {
                        target.addTempSkill("mjsstrengthen_juedou");
                    });
                },
            }],
            ["mjsliehuofencheng", {
                description: "令一名有牌的角色弃置你选择的一种属性的手牌，否则随机烧毁其1张牌，然后对其造成1点火焰伤害",
                async content(event, trigger, player) { },
            }],
            ["mjsduoliangjieying", {
                description: "获得一名其他角色的1张牌",
                async content(event, trigger, player) { },
            }],
            ["mjspozhenxiejia", {
                description: "弃置一名其他角色的2张牌",
                async content(event, trigger, player) {
                    player.when("discardPlayerCardBegin")
                        .filter((event, player) => {
                            return event.getParent().name == "mjspozhenxiejia" && event.getParent(2).card == trigger.card;
                        })
                        .then(async (event, trigger, player) => {
                            if (typeof trigger.selectButton != "number") {
                                trigger.selectButton = 1;
                            }
                            trigger.selectButton++;
                        });
                },
            }],
            ["mjsxianbatouchou", {
                description: "翻开存活角色数量的牌，选择获得1张，其他角色不拿牌",
                async content(event, trigger, player) {
                    player.addTempSkill("mjsstrengthen_mjsxianbatouchou");
                    player.markAuto("mjsstrengthen_mjsxianbatouchou", [trigger.card]);
                },
            }],
            ["wuxie", {
                description: "抵消1张战法牌，并且无法被抵消",
                async content(event, trigger, player) {
                    trigger.directHit.addArray(game.players);
                    game.log(trigger.card, "不可被响应");
                },
            }],
            ["mjsdiaobingqianjiang", {
                description: "令一名其他角色对你指定的另一名角色使用打出1张杀，否则你获得其1张牌。",
                async content(event, trigger, player) { },
            }],
        ]),
    },
    mjsstrengthen_sha: {
        trigger: {
            source: "damageSource",
        },
        forced: true,
        silent: true,
        charlotte: true,
        onremove: true,
        filter(event, player) {
            return event.card?.name == "sha" && player.hasStorage("mjsstrengthen_sha", event.card);
        },
        async content(event, trigger, player) {
            if (game.hasNature(trigger.card, "fire")) {
                trigger.player.addSkill("mjsstrengthen_sha_fire");
                trigger.player.addMark("mjsstrengthen_sha_fire", 1, false);
            }
            if (game.hasNature(trigger.card, "thunder")) {
                player.addTempSkill("mjsstrengthen_sha_thunder");
                player.addMark("mjsstrengthen_sha_thunder", 1, false);
            }
        },
        subSkill: {
            fire: {
                trigger: {
                    player: "phaseBegin",
                },
                forced: true,
                charlotte: true,
                onremove: true,
                silent: true,
                async content(event, trigger, player) {
                    const num = player.countMark(event.name);
                    await player.damage(num, "fire", "nosource");
                    player.removeSkill(event.name);
                },
            },
            thunder: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") return num + player.countMark("mjsstrengthen_sha_thunder");
                    },
                },
            },
        },
    },
    mjsstrengthen_mjszhenqianduijue: {
        trigger: {
            player: "useCardToPlayered",
            target: "useCardToTargeted",
        },
        silent: true,
        charlotte: true,
        filter(event, player) {
            return ["mjszhenqianduijue"].includes(event.card.name) && event.card?.storage?.mjsstrengthen;
        },
        async content(event, trigger, player) {
            const id = (player == trigger.player ? trigger.target : trigger.player)["playerid"];
            const idt = trigger.target.playerid;
            const map = trigger.getParent().customArgs;
            if (!map[idt]) {
                map[idt] = {};
            }
            if (!map[idt].shaReq) {
                map[idt].shaReq = {};
            }
            if (!map[idt].shaReq[id]) {
                map[idt].shaReq[id] = 1;
            }
            map[idt].shaReq[id]++;
        },
        ai: {
            "directHit_ai": true,
            skillTagFilter(player, tag, arg) {
                if (!["mjszhenqianduijue"].includes(arg?.card?.name) || arg?.card?.storage?.mjsstrengthen || Math.floor(arg.target.countCards("h", "sha") / 2) > player.countCards("h", "sha")) {
                    return false;
                }
            },
        },
    },
};

