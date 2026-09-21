import { lib, game, ui, get, ai, _status } from "noname";

const skills = {
    //怒气
    nysgsFury: {
        marktext: "🔥",
        intro: {
            name: "怒气",
            markcount(skill, player) {
                return `${player.nysgsCountFury()}/${player.nysgsCountMaxFury()}`;
            },
            content: (storage, player) => `怒气值：${player.nysgsCountFury()}/${player.nysgsCountMaxFury()}`,
        },
    },
    //受伤获得怒气
    _nysgsFury_add: {
        trigger: {
            player: "damageEnd",
        },
        forced: true,
        silent: true,
        ruleSkill: true,
        charlotte: true,
        filter(event, player) {
            if (event.noFuryAdd || player.hasSkillTag("noFuryAdd")) return false;
            return event.num > 0;
        },
        async content(event, trigger, player) {
            if (typeof trigger.baseFury != "number") {
                trigger.baseFury = 0;
            }
            const num = trigger.num + trigger.baseFury;
            await player.nysgsAddFury(num);
        },
    },
    //怒气强化
    _nysgsFury_buff: {
        trigger: {
            player: "useCard",
        },
        popup: false,
        ruleSkill: true,
        priority: 15,
        charlotte: true,
        filter(event, player, name) {
            if (!get.info("_nysgsFury_buff").filterx(event, player)) {
                if (!player.nysgsCountFury()) return false;
            }
            return get.info("_nysgsFury_buff").getList.includes(event.card.name);
        },
        filterx(event, player) {
            if (player.hasSkillTag("nysgsFreeFury", true, event)) return true;
            return event.nysgsFuryBuff || event.card._nysgsFury || event.card.storage?.nysgsFuryBuff;
        },
        async cost(event, trigger, player) {
            const backups = get.copy(get.info(event.skill).getBuff.get(trigger.card.name));
            if (backups.filter && !backups.filter(trigger, player)) {
                return;
            }
            const bool = (trigger.nysgsFuryBuff || trigger.card.storage?.nysgsFuryBuff);
            if (bool) {
                event.result = { bool: true };
            }
            else {
                if (["tiesuo", "shandian"].includes(trigger.card.name) && get.is.convertedCard(trigger.card)) {
                    _status._nysgsFury_use_check = true;
                    if (trigger.card.name == "shandian") {
                        const target = trigger.targets[0];
                        if (target != player) {
                            if ((() => {
                                var mod = game.checkMod(trigger.card, player, target, "unchanged", "playerEnabled", player);
                                if (mod == false) return false;
                                var mod = game.checkMod(trigger.card, player, target, "unchanged", "targetEnabled", target);
                                if (mod != "unchanged") {
                                    return mod;
                                }
                                var mod = game.checkMod(trigger.card, player, "unchanged", "cardEnabled2", player);
                                if (mod != "unchanged") {
                                    return mod;
                                }
                                var mod = game.checkMod(trigger.card, player, "unchanged", "cardEnabled", player);
                                if (mod != "unchanged") {
                                    return mod;
                                }
                                return true;
                            })()) {
                                event.result = { bool: true };
                            }
                        }
                    } 
                    else {
                        var range, info = get.info(trigger.card);
                        var select = get.copy(info.selectTarget);
                        range = info.selectTarget;
                        game.checkMod(trigger.card, player, range, "selectTarget", player);
                        const num = trigger.targets.length;
                        if (num > range[1]) {
                            event.result = { bool: true };
                        }
                    }
                    delete _status._nysgsFury_use_check;
                    return;
                }
                if (!trigger.card._nysgsFury && !player.nysgsCountFury()) return;
                if (get.is.virtualCard(trigger.card)) return;
                if (!get.is.convertedCard(trigger.card)) return;
                const prompt = get.translation(event.skill);
                const prompt2 = `你可以${trigger.card._nysgsFury ? 
                    "不消耗怒气" : "失去1点怒气"}强化使用【${get.translation(trigger.card.name)}】，令此牌` + backups.description;
                event.result = await player
                    .chooseBool(`###${prompt}###${prompt2}`)
                    .set("ai", () => {
                        const player = get.player();
                        if (get.event().free) return true;
                        if (player.hasSkillTag("nysgsKeepFury")) {
                            if (player.nysgsCountFury() <= 2) return false;
                        }
                        return get.event().check;
                    })
                    .set("free", trigger.card._nysgsFury)
                    .set("check", backups.check(trigger, player))
                    .forResult();
            }
        },
        async content(event, trigger, player) {
            if (!get.info(event.name).filterx(trigger, player)) {
                await player.nysgsRemoveFury();
            }
            trigger.nysgsFuryBuff = true;
            trigger.card.nysgsFuryBuff = true;
            game.log(player, "#r" + "强化", "使用了", trigger.card);
            if (trigger.cards?.length) {
                game.broadcastAll(cards => cards.forEach(card => card.clone.classList.add("nysgs-fury-glow")), trigger.cards);
            }
            const backups = get.copy(get.info(event.name).getBuff.get(trigger.card.name));
            const next = game.createEvent(`${event.name}_${trigger.card.name}`, false);
            next.player = player;
            next.num = 1;
            next._trigger = trigger;
            next.setContent(backups.content);
            await next;
        },
        get getList() {
            return Array.from(lib.skill._nysgsFury_buff.getBuff).map(info => info[0]);
        },
        getBuff: new Map([
            ["sha", {
                description: "造成的伤害提升至2点",
                check(event, player) {
                    return event.targets.some(target => {
                        return !target.hasSkillTag("filterDamage", null, {
                            player: player,
                            card: event.card,
                        });
                    });
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num;
                    return;
                    trigger._apply_args = {
                        oncard: () => {
                            var evt = get.event();
                            for (var target of game.filterPlayer(null, null, true)) {
                                var id = target.playerid;
                                var map = evt.customArgs;
                                if (!map[id]) {
                                    map[id] = {};
                                }
                                map[id].shanRequired = evt.baseDamage;
                            }
                        },
                    };
                },
            }],
            ["shan", {
                description: "抵消全部伤害，并摸1张牌",
                check(event, player) {
                    if (player.countCards("h") > 2) return false;
                    return get.effect(player, { name: "draw" }, player, player) > 0;
                },
                async content(event, trigger, player) {
                    await player.draw();
                    return;
                    if (typeof trigger.getParent(2).shanRequired != "number") return;
                    trigger.getParent(2).shanRequired = 1;
                },
            }],
            ["tao", {
                description: "回复的体力提升至2点",
                check(event, player) {
                    return event.targets.some(target => {
                        return get.attitude(player, target) > 0 && target.getDamagedHp() >= (event.baseDamage + 1);
                    });
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num;
                },
            }],
            ["jiu", {
                description: "伤害加成提升至2点；回答的体力提升至2点",
                check(event, player) {
                    if (!player.isPhaseUsing()) {
                        return player.isDying();
                    }
                    return false;
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num;
                },
            }],
            ["juedou", {
                description: "造成的伤害提升至2点",
                check(event, player) {
                    return event.targets.some(target => {
                        return !target.hasSkillTag("filterDamage", null, {
                            player: player,
                            card: event.card,
                        });
                    });
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num;
                },
            }],
            ["wuxie", {
                description: "额外获得此锦囊牌（仅当目标锦囊牌为单体锦囊牌时可强化使用）",
                check(event, player) {
                    var evt = event.getParent(4);
                    if (evt.name != "phaseJudge") {
                        return evt.cards && evt.cards?.filterInD("od")?.length;
                    }
                    return false;
                },
                async content(event, trigger, player) {
                    player.when("useCardAfter")
                        .filter(event => event.card == trigger.card)
                        .then(() => {
                            var evt = trigger.getParent(4);
                            if (evt.name == "phaseJudge") {
                                if (evt.cancelled) {
                                    if (evt.card && get.itemtype(evt.card) == "card") {
                                        player.gain(evt.card, "gain2");
                                    }
                                }
                            } else {
                                if (evt._neutralized) {
                                    const cards = evt.cards.filterInD("od");
                                    if (cards.length) {
                                        player.gain(cards, "gain2");
                                    }
                                }
                            }
                        });
                },
            }],
            ["shunshou", {
                description: "获得的牌提升至2张",
                check(event, player) {
                    return event.targets.some(target => {
                        return target.countGainableCards(player, "hej") > 1;
                    });
                },
                async content(event, trigger, player) {
                    const num = event.num;
                    player.when("gainPlayerCardBegin")
                        .filter((event, player) => {
                            return event.getParent().name == "shunshou" && event.getParent(2).card == trigger.card;
                        })
                        .step(async (event, trigger, player) => {
                            if (typeof trigger.selectButton != "number") {
                                trigger.selectButton = 1;
                            }
                            trigger.selectButton += num;
                        });
                },
            }],
            ["guohe", {
                description: "弃置的牌提升至2张",
                check(event, player) {
                    return event.targets.some(target => {
                        return target.countDiscardableCards(player, "hej") > 1;
                    });
                },
                async content(event, trigger, player) {
                    const num = event.num;
                    player.when("discardPlayerCardBegin")
                        .filter((event, player) => {
                            return event.getParent().name == "guohe" && event.getParent(2).card == trigger.card;
                        })
                        .step(async (event, trigger, player) => {
                            if (typeof trigger.selectButton != "number") {
                                trigger.selectButton = 1;
                            }
                            trigger.selectButton += num;
                        });
                },
            }],
            ["nanman", {
                description: "造成的伤害提升至2点",
                check(event, player) {
                    return event.targets.some(target => {
                        return !target.hasSkillTag("filterDamage", null, {
                            player: player,
                            card: event.card,
                        });
                    });
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num;
                },
            }],
            ["wanjian", {
                description: "造成的伤害提升至2点",
                check(event, player) {
                    return event.targets.some(target => {
                        return !target.hasSkillTag("filterDamage", null, {
                            player: player,
                            card: event.card,
                        });
                    });
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num;
                },
            }],
            ["wuzhong", {
                description: "摸牌数提升至3张",
                check(event, player) {
                    return player.countCards("h") < 4;
                },
                async content(event, trigger, player) {
                    const num = event.num;
                    player.when("drawBefore")
                        .filter(event => event.getParent().name == "wuzhong" && event.getParent(2) == trigger)
                        .step(async (event, trigger, player) => {
                            trigger.num += num;
                        });
                },
            }],
            ["taoyuan", {
                description: "所有受伤角色回复1点体力并获得1点怒气",
                check(event, player) {
                    return false;
                },
                async content(event, trigger, player) {
                    player.when("taoyuanBegin")
                        .filter(event => event.card == trigger.card)
                        .then(() => {
                            trigger.setContent(() => {
                                const { target } = event;
                                target.recover();
                                target.nysgsAddFury();
                            });
                        });
                },
            }],
            ["wugu", {
                description: "出牌阶段，选择一名角色使用。从牌堆顶亮出等同于现存活角色数量+2的牌，从该角色开始，每名角色依次选择并获得弃置的1张",
                check(event, player) {
                    return false;
                },
                async content(event, trigger, player) {
                    if (typeof trigger.card.storage?.extraCardsNum != "number") {
                        trigger.card.storage.extraCardsNum = 0;
                    }
                    trigger.card.storage.extraCardsNum += 2;
                    player
                        .when({ global: "useCardToTargeted" })
                        .filter(evt => evt.getParent() == trigger && evt?.targets?.length == evt.getParent()?.triggeredTargets4?.length)
                        .step(async (event, trigger, player) => {
                            const result = await player
                                .chooseTarget("请选择【五谷丰登】的起点", true)
                                .set("ai", target => {
                                    return get.attitude(get.player(), target);
                                })
                                .forResult();
                            let target = player;
                            if (result?.targets) {
                                target = result.targets[0];
                            }
                            trigger.getParent().targets = trigger.getParent().targets.sortBySeat(target);
                            trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.sortBySeat(target);
                        });
                },
            }],
            ["huogong", {
                description: "造成的伤害提升至2点",
                check(event, player) {
                    return false;
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num;
                },
            }],
            ["tiesuo", {
                description: "最大目标数提升至3个",
                check(event, player) {
                    return false;
                },
                async content(event, trigger, player) {},
            }],
            ["nysgs_shuiyanqijun", {
                description: "造成的伤害提升至2点",
                check(event, player) {
                    return event.targets.some(target => {
                        return !target.countCards("e");
                    });
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num;
                },
            }],
            ["nysgs_nufachongguan", {
                description: "获得的怒气提升至3点",
                check(event, player) {
                    return event.targets.some(target => {
                        return target.nysgsMaxFury - target.nysgsFury > 2;
                    });
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num + 1;
                },
            }],
            ["nysgs_fudichouxin", {
                description: "失去的怒气提升至3点",
                check(event, player) {
                    return event.targets.some(target => {
                        return target.nysgsCountFury() > 2;
                    });
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += event.num + 1;
                },
            }],
            ["lebu", {
                description: "跳过摸牌和出牌阶段",
                check(event, player) {
                    return true;
                },
                async content(event, trigger, player) {},
            }],
            ["bingliang", {
                description: "跳过摸牌和出牌阶段",
                check(event, player) {
                    return true;
                },
                async content(event, trigger, player) {},
            }],
            ["shandian", {
                description: "改为对一名角色使用且造成的伤害提升至5点",
                check(event, player) {
                    return false;
                },
                async content(event, trigger, player) {},
            }],
        ]),
        subSkill: {
            lebu: {
                trigger: {
                    player: "judgeEnd",
                },
                silent: true,
                ruleSkill: true,
                charlotte: true,
                filter(event, player) {
                    if (event.result?.bool) return false;
                    const evt = event.getParent();
                    if (evt.card?.name != "lebu") return false;
                    const cardSymbols = Object.getOwnPropertySymbols(evt.card ?? {});
                    return evt.card?.[cardSymbols?.[0]]?.nysgsFuryBuff;
                },
                content() {
                    player.skip("phaseDraw");
                    game.log(player, "跳过摸牌阶段");
                },
            },
            bingliang: {
                trigger: {
                    player: "judgeEnd",
                },
                silent: true,
                ruleSkill: true,
                charlotte: true,
                filter(event, player) {
                    if (event.result?.bool) return false;
                    const evt = event.getParent();
                    if (evt.card?.name != "bingliang") return false;
                    const cardSymbols = Object.getOwnPropertySymbols(evt.card ?? {});
                    return evt.card?.[cardSymbols?.[0]]?.nysgsFuryBuff;
                },
                content() {
                    player.skip("phaseUse");
                    game.log(player, "跳过出牌阶段");
                },
            },
            shandian: {
                trigger: {
                    player: "damageBegin3",
                },
                silent: true,
                ruleSkill: true,
                charlotte: true,
                filter(event, player) {
                    if (event.card?.name != "shandian") return false;
                    const evt = event.getParent(2);
                    const cardSymbols = Object.getOwnPropertySymbols(evt.card ?? {});
                    return evt.card?.[cardSymbols?.[0]]?.nysgsFuryBuff;
                },
                content() {
                    trigger.num += 2;
                },
            },
        },
    },
    nysgsFury_use: {
        charlotte: true,
        ruleSkill: true,
        enable: "chooseToUse",
        mod: {
            selectTarget(card, player, range) {
                if (!["tiesuo", "shandian"].includes(card.name)) return;
                if (!player.nysgsCanAddFuryBuff(card)) return;
                if (_status._nysgsFury_use_check) return;
                const event = get.event();
                if (!event || event.name !== "chooseToUse") return;
                _status._nysgsFury_use_check = true;
                const bool = game.countPlayer(target => lib.filter.targetEnabled2(card, player, target)) > 1;
                delete _status._nysgsFury_use_check;
                if (bool) {
                    switch (card.name) {
                        case "tiesuo": {
                            if (range[1] != -1) range[1]++;
                        }
                            break;
                        case "shandian": {
                            if (range[0] !== 1) range[0] = 1;
                            if (range[1] !== 1) range[1] = 1;
                        }
                            break;
                    }
                }
            },
            cardEnabled(card, player) {
                if (!["tiesuo", "shandian"].includes(card.name)) return;
                if (!player.nysgsCanAddFuryBuff(card)) return;
                if (_status._nysgsFury_use_check) return;
                const event = get.event();
                if (!event || event.name !== "chooseToUse") return;
                _status._nysgsFury_use_check = true;
                const bool = game.hasPlayer(target => lib.filter.targetEnabled2(card, player, target));
                delete _status._nysgsFury_use_check;
                if (bool) return true;
            },
            playerEnabled(card, player, target) {
                if (!["tiesuo", "shandian"].includes(card.name)) return;
                if (!player.nysgsCanAddFuryBuff(card)) return;
                if (_status._nysgsFury_use_check) return;
                const event = get.event();
                if (!event || event.name !== "chooseToUse") return;
                _status._nysgsFury_use_check = true;
                const bool = lib.filter.targetEnabled2(card, player, target);
                delete _status._nysgsFury_use_check;
                if (bool) return true;
            },
        },
        hiddenCard(player, name) {
            return player.hasCard(card => {
                if (get.info("_nysgsFury_buff").getList.includes(name)) {
                    return get.name(card, player) == name && player.nysgsCanAddFuryBuff(card);
                }
                return false;
            }, "hs");
        },
        filter(event, player) {
            return player.hasCard(card => {
                if (get.info("_nysgsFury_buff").getList.includes(get.name(card, player))) {
                    //无懈可击 => 仅当目标锦囊牌为单体锦囊牌时可强化使用
                    if (event.type == "wuxie") {
                        let info = event.info_map;
                        if (!info || get.type2(info.card) != "trick" || get.info("xunshi").isXunshi(info.card)) {
                            return false;
                        }
                    }
                    return event.filterCard(card, player, event) && player.nysgsCanAddFuryBuff(card);
                }
                return false;
            }, "hs");
        },
        filterCard(card, player, event) {
            event = event || _status.event;
            if (get.info("_nysgsFury_buff").getList.includes(get.name(card, player))) {
                return event._backup.filterCard(card, player, event);
            }
            return false;
        },
        check(card) {
            const player = get.player();
            if (player.hasSkillTag("nysgsKeepFury")) {
                if (player.nysgsCountFury() <= 2) return 0;
            }
            switch(card.name) {
                case "shan": {
                    if (player.countCards("h") > 4) return 0;
                }
                case "shandian": case "tiesuo": {
                    return 0;
                }
                default: {
                    return get.value(card);
                }
            }
        },
        ignoreMod: true,
        position: "hs",
        viewAs(cards, player) {
            if (cards.length) {
                const card = cards[0];
                return card;
            }
            return null;
        },
        prompt: "你可以强化使用一张牌",
        log: false,
        logv: false,
        async precontent(event, trigger, player) {
            const evt = event.getParent(), evtx = event.result;
            if (!get.info("_nysgsFury_buff").filterx(evtx, player)) {
                await player.nysgsRemoveFury();
            }
            evt.nysgsFuryBuff = true;
            evtx.card.storage.nysgsFuryBuff = true;
        },
        ai: {
            order: (item, player) => {
                if (!player) {
                    player = get.player();
                }
                if (_status.event.type == "phase") {
                    for (const card of player.getCards("hs")) {
                        if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
                            continue;
                        }
                        const cardName = get.name(card, player);
                        if (cardName == "tao" && player.hp <= 2 && player.getDamagedHp() >= 2) {
                            return get.order(card, player) + 0.5;
                        }
                        return 7;
                    }
                }
                return 3.5;
            },
            result: {
                player(player) {
                    if (_status.event.dying) {
                        return get.attitude(player, _status.event.dying);
                    }
                    return 1;
                },
            },
        },
    },
    //摧毁
    _nysgs_destroy: {
        charlotte: true,
        ruleSkill: true,
        trigger: {
            player: "gainAfter",
            global: "loseAsyncAfter",
        },
        silent: true,
        charlotte: true,
        filter(event, player) {
            return event.getg && event.getg(player)?.some(card => card.storage?.nysgsdestroy);
        },
        async content(event, trigger, player) {
            const cards = trigger.getg().filter(card => card.storage?.nysgsdestroy);
            if (cards.length) {
                player.addGaintag(cards, "nysgs_destroy");
                player.addTip("nysgs_destroy", get.translation("nysgs_destroy") + " " + player.nysgsGetDestroyedCards().length);
            }
        },
        mod: {
            cardEnabled(card) {
                if (card.storage?.nysgsdestroy) return false;
            },
            cardSavable(card) {
                if (card.storage?.nysgsdestroy) return false;
            },
            cardRespondable(card) {
                if (card.storage?.nysgsdestroy) return false;
            },
        },
        subSkill: {
            init: {
                trigger: {
                    global: ["loseEnd", "cardsDiscardEnd", "loseAsyncEnd", "equipEnd"],
                },
                silent: true,
                charlotte: true,
                filter(event, player, name) {
                    if (event._nysgs_destroyStarted) return false;
                    return event.getd().some(card => {
                        return card?.storage?.nysgsdestroy;
                    });
                },
                async content(event, trigger, player) {
                    trigger._nysgs_destroyStarted = true;
                    const cards = trigger.getd().filter(card => {
                        return card?.storage?.nysgsdestroy;
                    });
                    for (const card of cards) {
                        if (card.storage.dustdestroy) {
                            delete card.storage.dustdestroy;
                        }
                    }
                    if (cards.length) {
                        game.log(cards, "解除", "#g摧毁", "状态");
                    }
                    const num = player.nysgsGetDestroyedCards().length;
                    if (num > 0) {
                        player.markSkill("nysgs_destroy");
                        player.updateMark("nysgs_destroy");
                        player.addTip("nysgs_destroy", get.translation("nysgs_destroy") + " " + num);
                    }
                    else {
                        player.unmarkSkill("nysgs_destroy");
                        player.removeTip("nysgs_destroy");
                    }
                },
            },
            compare: {
                trigger: {
                    player: ["chooseToCompareBefore", "compareMultipleBefore"],
                    target: ["chooseToCompareBefore", "compareMultipleBefore"],
                },
                forced: true,
                silent: true,
                async content(event, trigger, player) {
                    if (!trigger.filterCard) {
                        trigger.filterCard = function (card, player) {
                            if (card?.storage?.nysgsdestroy) return false;
                            return true;
                        };
                    } else {
                        const origin_filter = trigger.filterCard;
                        trigger.filterCard = function (card, player) {
                            if (card?.storage?.nysgsdestroy) return false;
                            return origin_filter.apply(this, arguments);
                        };
                    }
                },
                ai: {
                    noCompareSource: true,
                    noCompareTarget: true,
                    skillTagFilter(player, tag, arg) {
                        if (!player.countCards("h") || player.countCards("h", card => !card?.storage?.nysgsdestroy)) return false;
                    },
                },
            },
        },
    },
    nysgs_destroy: {
        intro: {
            markcount(storage, player) {
                const num = player.nysgsGetDestroyedCards().length;
                return `${num}`;
            },
            content(storage, player) {
                const num = player.nysgsGetDestroyedCards().length;
                return `已被摧毁${num}张手牌`;
            },
        },
        init(player, skill) {
            player.addTip(skill, get.translation(skill) + " " + player.nysgsGetDestroyedCards().length);
        },
        onremove(player, skill) {
            player.removeTip(skill);
        },
    },
    //隐匿
    nysgs_hiddenCharacter: {
        popup: true,
        charlotte: true,
        ruleSkill: true,
        mod: {
            targetEnabled(card, player, target, now) {
                if (target == player || !target.nysgsIsHidden()) {
                    return;
                }
                if (card.name == "sha" || (get.type2(card) == "trick" && !get.info("xunshi").isXunshi(card))) {
                    return false;
                }
            },
        },
        init(player, skill) {
            player.turnOver(false);
        },
        trigger: {
            player: ["damageBegin4", "turnOverBefore"],
            source: "damageBegin1",
        },
        forced: true,
        silent: true,
        filter(event, player, name) {
            if (name == "turnOverBefore") return !player.isTurnedOver();
            return player.nysgsIsHidden();
        },
        async content(event, trigger, player) {
            if (event.triggername == "turnOverBefore") {
                trigger.cancel();
            }
            else if (event.triggername == "damageBegin4") {
                trigger.cancel();
                player.nysgsHiddenCharacter(false);
            } else if (event.triggername == "damageBegin1") {
                trigger.num *= 2;
                player.nysgsHiddenCharacter(false);
            }
        },
        ai: {
            noturn: true,
        },
    },
    //眩晕
    nysgs_xuanyun: {
        popup: true,
        charlotte: true,
        ruleSkill: true,
        mod: {
            cardEnabled2(card, player) {
                if (card.name == "shan") return;
                if (get.position(card) == "h") return false;
            },
        },
        mark: true,
        intro: {
            content: "info",
        },
    },
    //换将
    nysgs_changeCharacter: {
        enable: "phaseUse",
        usable: 1,
        charlotte: true,
        ruleSkill: true,
        onremove: true,
        filter(event, player) {
            if (player.hasSkillTag("noChangeCharacter")) return false;
            return player.storage.nysgs_changeCharacter && !player.hasSkill("nysgs_changeCharacter_blocker", null, null, false);
        },
        async content(event, trigger, player) {
            /*
            player.addTempSkill("nysgs_changeCharacter_blocker", {
                player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
            });
            */
            if (!_status[`nysgs_changeCharacter_${player.playerid}`]) {
                _status[`nysgs_changeCharacter_${player.playerid}`] = false;
            }
            _status[`nysgs_changeCharacter_${player.playerid}`] = Boolean(!_status[`nysgs_changeCharacter_${player.playerid}`]);
            var bool = _status[`nysgs_changeCharacter_${player.playerid}`];
            var cfg = player.storage.nysgs_changeCharacter;
            if (!cfg || !Array.isArray(cfg)) return;
            if (bool) {
                cfg[1] = player.hp;
                cfg[2] = player.maxHp;
                //player.reinit(cfg[0], cfg[3], [cfg[4], cfg[5]]);
                player.hp = cfg[4];
                player.maxHp = cfg[5];
                player.markSkillCharacter("nysgs_changeCharacter", { name: cfg[0] }, "正面", "当前体力：" + cfg[1] + "/" + cfg[2]);
                await player.reinitCharacter(cfg[0], cfg[3], false);
                const skills = get.character(cfg[0]).skills.filter(skill => get.info(skill)?.dualSideSkill);
                player.addAdditionalSkill("nysgs_changeCharacter", skills);
            }
            else {
                cfg[4] = player.hp;
                cfg[5] = player.maxHp;
                //player.reinit(cfg[3], cfg[0], [cfg[1], cfg[2]]);
                player.hp = cfg[1];
                player.maxHp = cfg[2];
                player.markSkillCharacter("nysgs_changeCharacter", { name: cfg[3] }, "背面", "当前体力：" + cfg[4] + "/" + cfg[5]);
                await player.reinitCharacter(cfg[3], cfg[0], false);
                const skills = get.character(cfg[3]).skills.filter(skill => get.info(skill)?.dualSideSkill);
                player.addAdditionalSkill("nysgs_changeCharacter", skills);
            }
            //换将后刷新一下标记
            const skills = player.getStockSkills(true, true);
            game.expandSkills(skills);
            for (const skill of skills) {
                player.markSkill(skill);
            }
        },
        ai: {
            order: 1,
            result: {
                player(player) {
                    return 0;
                },
            },
        },
        group: "nysgs_changeCharacter_turn",
        subSkill: {
            blocker: {
                charlotte: true,
            },
            turn: {
                trigger: {
                    player: "dieBefore",
                },
                silent: true,
                forceDie: true,
                filter(event, player) {
                    return player.storage.nysgs_changeCharacter;
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                    if (!_status[`nysgs_changeCharacter_${player.playerid}`]) {
                        _status[`nysgs_changeCharacter_${player.playerid}`] = false;
                    }
                    _status[`nysgs_changeCharacter_${player.playerid}`] = Boolean(!_status[`nysgs_changeCharacter_${player.playerid}`]);
                    var bool = _status[`nysgs_changeCharacter_${player.playerid}`];
                    var cfg = player.storage.nysgs_changeCharacter;
                    if (bool) {
                        cfg[1] = player.hp;
                        cfg[2] = player.maxHp;
                        player.hp = cfg[4];
                        player.maxHp = cfg[5];
                        //player.reinit(cfg[0], cfg[3], [cfg[4], cfg[5]]);
                        player.markSkillCharacter("nysgs_changeCharacter", { name: cfg[0] }, "正面", "当前体力：" + cfg[1] + "/" + cfg[2]);
                        await player.reinitCharacter(cfg[0], cfg[3], false);
                    } 
                    else {
                        cfg[4] = player.hp;
                        cfg[5] = player.maxHp;
                        player.hp = cfg[1];
                        player.maxHp = cfg[2];
                        //player.reinit(cfg[3], cfg[0], [cfg[1], cfg[2]]);
                        player.markSkillCharacter("nysgs_changeCharacter", { name: cfg[3] }, "背面", "当前体力：" + cfg[4] + "/" + cfg[5]);
                        await player.reinitCharacter(cfg[3], cfg[0], false);
                    }
                    player.removeSkill("nysgs_changeCharacter");
                },
            },
        },
    },
    //登场
    _nysgs_showCharacter: {
        trigger: {
            player: "changeCharacterEnd",
        },
        silent: true,
        ruleSkill: true,
        filter(event, player) {
            return player.name1?.startsWith("nysgs");
        },
        async content(event, trigger, player) {
            const next = game.createEvent("showCharacter");
            next.player = player;
            next.toShow = [player.name1];
            next.setContent("emptyEvent");
        },
        subSkill: {
            init: {
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                silent: true,
                ruleSkill: true,
                filter(event, player) {
                    return player.name1?.startsWith("nysgs") && (event.name != "phase" || game.phaseNumber == 0);
                },
                async content(event, trigger, player) {
                    const next = game.createEvent("showCharacter");
                    next.player = player;
                    next.toShow = [player.name1];
                    next.setContent("emptyEvent");
                },
            },
        },
    },
    //符石
    _nysgs_runestoneCheck: {
        trigger: {
            player: "logSkillBegin",
        },
        silent: true,
        ruleSkill: true,
        charlotte: true,
        filter(event, player) {
            if (event.type != "player") return false;
            let skill = get.sourceSkillFor(event);
            if (!skill) return false;
            let info = get.info(skill);
            return info && info.runestoneSkill;
        },
        async content(event, trigger, player) {
            const skill = get.sourceSkillFor(trigger);
            if (lib.config.extension_怒焰三国_display == "icon") {
                nysgs.animSkillBuff(player, skill);
                nysgs.updateSkillBuff(player, skill);
            } else {
                player.updateMark(skill);
                nysgs.updateSkillBuff(player, skill);
            }
        },
    },
    //水属性伤害
    _nysgs_nature_water: {
        description: "角色即将受到水属性伤害时，将此伤害改为体力流失（体流来源与原伤害一致）。",
        trigger: {
            source: "damageBegin1",
        },
        silent: true,
        charlotte: true,
        ruleSkill: true,
        filter(event) {
            return event.hasNature("nysgswater");
        },
        content() {
            trigger.cancel();
            const next = trigger.player.loseHp(trigger.num);
            next.set("source", trigger.source);
        },
    },
};

Object.assign(skills, {
    nysgs_runestone_tianchen: {
        popup: true,
        equipSkill: true,
    },
    nysgs_runestone_tiannu: {
        popup: true,
        equipSkill: true,
    },
    nysgs_runestone_tianyan: {
        popup: true,
        equipSkill: true,
    },
    nysgs_icon_point: {
        popup: true,
        equipSkill: true,
    },
});

if (lib.config["extension_怒焰三国_ruleSkill"]) {
    Object.assign(skills, {
        _nysgs_ruleSkill: {
            trigger: {
                player: "phaseDrawBegin2",
            },
            silent: true,
            ruleSkill: true,
            filter(event, player) {
                if (!player.name1?.startsWith("nysgs_")) return false;
                return !event.numFixed;
            },
            async content(event, trigger, player) {
                trigger.num++;
            },
            subSkill: {
                init: {
                    trigger: {
                        global: "phaseBefore",
                        player: "enterGame",
                    },
                    silent: true,
                    ruleSkill: true,
                    filter(event, player) {
                        if (_status._nysgs_ruleSkill_init) return false;
                        return (event.name != "phase" || game.phaseNumber == 0);
                    },
                    async content(event, trigger, player) {
                        _status._nysgs_ruleSkill_init = true;
                        const packs = lib.cardPack.nysgs.filter(name => {
                            return ["basic", "trick", "equip"].includes(get.type2(name));
                        });
                        if (packs.length) {
                            game.broadcastAll(() => lib.inpile.addArray(packs));
                        }
                    },
                },
                wuxie: {
                    /**【无懈可击】修改为怒焰三国杀【看破】版本
                     * 看破 => 当锦囊牌对你生效前可以使用，抵消此锦囊牌的效果
                     * */
                    mod: {
                        cardEnabled(card, player) {
                            if (card.name != "wuxie") return;
                            if (!player.name1?.startsWith("nysgs_")) return;
                            let evt = get.event();
                            if (evt.name != "chooseToUse") {
                                evt = evt.getParent("chooseToUse");
                            }
                            const info = evt.info_map,
                                target = info?.target;
                            if (!target || target != player) {
                                return false;
                            }
                        },
                    },
                },
                /**【铁索连环】修改为怒焰三国杀【铁索连环】版本
                 * 铁索连环 => 不可被重铸
                 * */
                /*
                tiesuo: {
                    mod: {
                        cardRecastable(card, player) {
                            if (card.name != "tiesuo") return;
                            if (!player.name1?.startsWith("nysgs_")) return;
                            return false;
                        },
                    },
                },
                */
                hujia: {
                    trigger: {
                        player: "changeHujiaBegin",
                    },
                    silent: true,
                    ruleSkill: true,
                    filter(event, player, name) {
                        if (!player.name1?.startsWith("nysgs_")) return;
                        return event.type == "gain" && (player.hujia + event.num) > 36;
                    },
                    async content(event, trigger, player) {
                        if (player.hujia >= 36) {
                            trigger.cancel();
                        } else {
                            trigger.num -= (36 - player.hujia);
                        }
                    },
                },
            },
        },
    });
}
export default skills;
