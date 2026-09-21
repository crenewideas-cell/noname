import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig["skill"] } */
const skills = {
    //斯卡蒂
    mcdh_AA00101: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/mcdh_AA00101.mp3",
        enable: ["chooseToUse", "chooseToRespond"],
        usable: 1,
        onChooseToUse(event) {
            if (game.online || !ui.cardPile.childElementCount || Array.isArray(event.mcdh_AA00101_cards)) {
                return;
            }
            const num = lib.skill.mcdh_AA00101.getNum(event.player);
            event.set("mcdh_AA00101_cards", Array.from(ui.cardPile.childNodes).slice(0, num));
        },
        onChooseToRespond(event) {
            if (game.online || !ui.cardPile.childElementCount || Array.isArray(event.mcdh_AA00101_cards)) {
                return;
            }
            const num = lib.skill.mcdh_AA00101.getNum(event.player);
            event.set("mcdh_AA00101_cards", Array.from(ui.cardPile.childNodes).slice(0, num));
        },
        hiddenCard(player, name) {
            if (name == "wuxie") return false;
            return !player.getStat().skill.mcdh_AA00101 && lib.inpile.includes(name);
        },
        getNum(player) {
            return Math.abs(player.maxHp - player.countCards("h"));
        },
        filter(event, player) {
            if (event.type == "wuxie" || lib.skill.mcdh_AA00101.getNum(player) <= 0) {
                return false;
            }
            if (!Array.isArray(event.mcdh_AA00101_cards) || event.responded || event.mcdh_AA00101) {
                return false;
            }
            return lib.inpile.some(i => event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event));
        },
        chooseButton: {
            dialog(event, player) {
                return ui.create.dialog(get.translation("mcdh_AA00101"), event.mcdh_AA00101_cards, "hidden");
            },
            filter(button, player) {
                const evt = _status.event.getParent();
                return evt.filterCard(button.link, player, evt);
            },
            check(button) {
                const card = button.link,
                    player = get.player();
                return player.getUseValue(card);
            },
            backup(links, player) {
                return {
                    filterCard() {
                        return false;
                    },
                    selectCard: -1,
                    viewAs: links[0],
                    card: links[0],
                    log: false,
                    async precontent(event, trigger, player) {
                        const card = lib.skill.mcdh_AA00101_backup.card;
                        event.result.cards = [card];
                        event.result.card = get.autoViewAs(card, [card]);
                        event.result.card.mcdh_AA00101 = true;
                        player.logSkill("mcdh_AA00101");
                    },
                };
            },
            prompt(links, player) {
                return "跃浪之行：是否使用" + get.translation(links[0]) + "？";
            },
        },
        ai: {
            effect: {
                target(card, player, target, effect) {
                    if (target.getStat().skill.mcdh_AA00101) return;
                    if (get.tag(card, "respondShan")) {
                        return 0.7;
                    }
                    if (get.tag(card, "respondSha")) {
                        return 0.7;
                    }
                },
            },
            order: 12,
            respondShan: true,
            respondSha: true,
            result: {
                player(player) {
                    if (_status.event.dying) {
                        return get.attitude(player, _status.event.dying);
                    }
                    return 1;
                },
            },
        },
        group: "mcdh_AA00101_restore",
        subSkill: {
            backup: {},
            restore: {
                audio: "mcdh_AA00101",
                trigger: {
                    player: "damageEnd",
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    return player.getStat().skill.mcdh_AA00101;
                },
                async content(event, trigger, player) {
                    player.refreshSkill("mcdh_AA00101");
                },
            },
        },
    },
    mcdh_AA00102: {
        nobracket: true,
        trigger: {
            player: ["phaseDrawBegin1", "damageEnd"],
        },
        forced: true,
        filter(event, player) {
            if (event.name == "phaseDraw") {
                return !event.numFixed;
            }
            return lib.skill.mcdh_AA00102.logTarget(event, player).length;
        },
        async content(event, trigger, player) {
            if (trigger.name == "phaseDraw") {
                trigger.changeToZero();
                player.draw();
            } else {
                const targets = game.filterPlayer(target => {
                    return [player.getPrevious(), player.getNext()].includes(target);
                });
                for (const target of event.targets) {
                    target.addSkill("mcdh_AA00102_effect");
                }
            }
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "phaseDrawBegin1",
                },
                popup: false,
                forced: true,
                charlotte: true,
                filter(event, player) {
                    return !event.numFixed;
                },
                async content(event, trigger, player) {
                    trigger.changeToZero();
                    player.draw();
                    player.removeSkill(event.name);
                },
                mark: true,
                marktext: "血",
                intro: {
                    content: "你的下个摸牌阶段改为摸一张牌",
                },
            },
        },
    },
    //幽灵鲨
    mcdh_AA00201: {
        nobracket: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        forced: true,
        filter(event, player) {
            return player.isDamaged();
        },
        async content(event, trigger, player) {
            const cards = get.cards(player.getDamagedHp());
            await game.cardsGotoOrdering(cards);
            const dialog = ui.create.dialog("殇嗤嬉食血澜极乐", cards, true);
            dialog.videoId = lib.status.videoId++;
            _status.dieClose.push(dialog);
            event.preResult = dialog.videoId;
            game.broadcast(function (cards, id) {
                var dialog = ui.create.dialog("殇嗤嬉食血澜极乐", cards, true);
                _status.dieClose.push(dialog);
                dialog.videoId = id;
            }, cards, dialog.videoId);
            game.log(player, "亮出了", cards);
            game.addVideo("showCards", player, ["殇嗤嬉食血澜极乐", get.cardsInfo(cards)]);
            await game.delay(2);
            if (cards.some(card => get.name(card, false) == "sha")) {
                const { bool, links } = await player
                    .chooseButton("殇嗤嬉食血澜极乐", true)
                    .set("dialog", event.preResult)
                    .set("closeDialog", false)
                    .set("dialogdisplay", true)
                    .set("filterButton", button => {
                        var player = _status.event.player;
                        var card = button.link;
                        var cardx = {
                            name: get.name(card, get.owner(card)),
                            nature: get.nature(card, get.owner(card)),
                            cards: [card],
                        };
                        if (card.name != "sha") return false;
                        return player.hasUseTarget(cardx, null, false);
                    })
                    .set("ai", button => {
                        var card = button.link;
                        var fix = 1;
                        return fix * _status.event.player.getUseValue(card);
                    })
                    .forResult();
                if (bool) {
                    var card = links[0];
                    cards.remove(card);
                    var cardx = {
                        name: get.name(card, get.owner(card)),
                        nature: get.nature(card, get.owner(card)),
                        cards: [card],
                    };
                    var next = player
                        .chooseUseTarget(cardx, [card], true, false)
                        .set("oncard", card => {
                            var owner = _status.event.getParent().owner;
                            if (owner) owner.$throw(card.cards);
                        });
                    if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) next.viewAs = false;
                    var owner = get.owner(card);
                    if (owner != player && get.position(card) == "h") {
                        next.throw = false;
                        next.set("owner", owner);
                    }
                    await next;
                    if (cards.length) {
                        const next = player.chooseToMove("殇嗤嬉食血澜极乐：是否交换任意张牌？");
                        next.set("list", [
                            ["展示牌", cards, "sbhuanshi_tag"],
                            ["手牌", player.getCards("h")],
                        ]);
                        next.set("filterMove", (from, to) => {
                            return typeof to !== "number";
                        });
                        next.set("processAI", list => {
                            let cards = [...list[0][1], ...list[1][1]],
                                player = get.player();
                            cards.sort((a, b) => player.getUseValue(a, null, true) - player.getUseValue(b, null, true));
                            return [cards.slice(0, 2), cards.slice(2)];
                        });
                        const { bool, moved } = await next.forResult();
                        if (bool) {
                            const puts = player.getCards("h", i => moved[0].includes(i)),
                                gains = cards.filter(i => moved[1].includes(i));
                            if (puts.length && gains.length) {
                                player.$throw(puts, 1000);
                                await player.lose(puts, ui.special);
                                await player.gain(gains, "gain2");
                                const cardx = moved[0].slice();
                                if (cardx.length) {
                                    await game.cardsGotoOrdering(cardx);
                                    for (let i = cardx.length - 1; i >= 0; i--) {
                                        ui.cardPile.insertBefore(cardx[i], ui.cardPile.firstChild);
                                    }
                                    game.updateRoundNumber();
                                }
                            }
                        }
                    }
                }
            }
            dialog.close();
            _status.dieClose.remove(dialog);
            game.addVideo("cardDialog", null, event.preResult);
            game.broadcastAll("closeDialog", event.preResult);
        },
    },
    mcdh_AA00202: {
        nobracket: true,
        mod: {
            attackRange(player, num) {
                if (player.countCards("h") >= player.getHp(true)) return;
                return num++;
            },
        },
        trigger: {
            player: "useCard1",
        },
        popup: false,
        filter(event, player) {
            if (player.isHealthy() || event.card.name != "sha") {
                return false;
            }
            return game.hasPlayer(target => {
                return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target);
            });
        },
        async cost(event, trigger, player) {
            const targets = game.filterPlayer(target => {
                return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
            });
            const num = Math.min(player.getDamagedHp(), targets.length);
            if (!num) return;
            if (targets.length == num) {
                event.result = { bool: true, targets: targets };
                return;
            }
            event.result = await player
                .chooseTarget(num, true)
                .set("prompt", `你发动了【${get.translation(event.skill)}】`)
                .set("prompt2", `为${get.translation(trigger.card)}多指定${num}个目标`)
                .set("targets", targets)
                .set("card", trigger.card)
                .set("filterTarget", (card, player, target) => {
                    return get.event().targets.includes(target);
                })
                .set("ai", target => {
                    const player = get.player();
                    const trigger = get.event().getTrigger();
                    return get.effect(target, trigger.card, trigger.player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.logSkill(event.name, event.targets);
            trigger.targets.addArray(event.targets);
        },
    },
    //安哲拉
    mcdh_AA00301: {
        nobracket: true,
        trigger: {
            player: "useCardToPlayered",
        },
        popup: false,
        filter(event, player) {
            if (player.hasSkill("mcdh_AA00301_used")) {
                return false;
            }
            if (!player.isPhaseUsing() || event.getParent().triggeredTargets3.length > 1) {
                return false;
            }
            if (!get.is.damageCard(event.card)) return false;
            const targets = [player].addArray(event.targets);
            return targets.some(target => target.countDiscardableCards(player, target == player ? "ej" : "hej"));
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), function (card, player, target) {
                    const trigger = _status.event.getTrigger();
                    if (!target.countDiscardableCards(player, target == player ? "ej" : "hej")) return false;
                    return target == player || trigger.targets.includes(target);
                })
                .set("ai", target => {
                    const player = get.player();
                    return get.effect(target, { name: "guohe_copy2" }, player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0],
                targetsOld = game.filterPlayer(current => player.inRange(current));
            player.logSkill(event.name, target);
            player.addTempSkill("mcdh_AA00301_used", "phaseUseAfter");
            const result = await player
                .discardPlayerCard(target, target == player ? "ej" : "hej", true)
                .set("ai", function (button) {
                    return (get.type(button.link) != "basic" ? 4 : 0) - get.value(button.link);
                })
                .forResult();
            if (result?.bool && result.cards?.length) {
                if (get.type(result.cards[0]) != "basic") {
                    await player.draw();
                }
                const targetsNew = game.filterPlayer(current => player.inRange(current));
                if (targetsOld.every(Old => targetsNew.includes(Old)) && targetsNew.every(New => targetsOld.includes(New))) return;
                player.refreshSkill();
            }
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    mcdh_AA00302: {
        nobracket: true,
        enable: "phaseUse",
        limited: true,
        filter(event, player) {
            return player.canMoveCard();
        },
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            const result = await player.moveCard(true).forResult();
            if (result?.bool) {
                const target = result.targets[0];
                const card = new lib.element.VCard({ name: "sha" });
                if (target.hasUseTarget(card, true, false)) {
                    await target.chooseUseTarget(card, true, false);
                }
            }
        },
        ai: {
            order: 5,
            result: {
                player(player) {
                    return player.canMoveCard(true);
                },
            },
        },
    },
    //歌蕾蒂娅
    mcdh_AA00401: {
        nobracket: true,
        trigger: {
            player: "useCardToPlayered",
            target: "useCardToTargeted",
        },
        mcdhCharge: 3,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_AA00401")) return false;
            return event.targets?.length == 1;
        },
        check(event, player) {
            if (!player.hasCard(card => {
                return card.name == "shan" && lib.filter.cardDiscardable(card, player, "mcdh_AA00401");
            }, "h")) {
                if (get.damageEffect(player, player, player) >= 0) return true;
                if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) return false;
            }
            return true;
        },
        async content(event, trigger, player) {
            player.mcdh_removeCharge(2);
            const result = await player.draw(2).forResult();
            if (get.itemtype(result.cards) != "cards") return;
            await player.showCards(result.cards);
            if (result.cards.some(card => get.type(card) == "basic")) {
                player
                    .when({ global: "useCardAfter" })
                    .filter(evt => evt.card == trigger.card)
                    .then(async (event, trigger, player) => {
                        const result = await player
                            .chooseToDiscard("h", { name: "shan" }, "缺水的掌握怒海：弃置一张闪，或受到1点无来源伤害")
                            .set("ai", card => {
                                const player = get.player();
                                if (get.damageEffect(player, player, player) >= 0) return 0;
                                return 8 - get.value(card);
                            })
                            .forResult();
                        if (!result?.bool) {
                            await player.damage("nosource");
                        }
                    });
            }
        },
    },
    mcdh_AA00402: {
        nobracket: true,
        trigger: {
            source: "damageBegin1",
            player: "damageBegin3",
        },
        forced: true,
        filter(event, player, name) {
            const target = get.info("mcdh_AA00402").logTarget(event, player, name);
            if (!target || !target.isIn()) {
                return false;
            }
            if (player.hasStorage("mcdh_AA00402_used", name)) return false;
            return player.countCards("h") > target.countCards("h") && player.hp > target.hp;
        },
        logTarget(event, player, name, target) {
            return event[name == "damageBegin1" ? "player" : "source"];
        },
        async content(event, trigger, player) {
            player.addTempSkill("mcdh_AA00402_used", "roundStart");
            player.markAuto("mcdh_AA00402_used", [event.triggername]);
            trigger.num += (event.triggername == "damageBegin1" ? 1 : -1);
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    //银灰
    mcdh_BI00101: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        mod: {
            targetInRange(card, player) {
                if (card?.storage?.mcdh_BI00101) return true;
            },
        },
        enable: "chooseToUse",
        locked: false,
        viewAs: {
            name: "sha",
            isCard: true,
            storage: {
                mcdh_BI00101: true,
            },
        },
        viewAsFilter(player) {
            if (!player.isPhaseUsing() || player.storage.mcdh_BI00101) {
                return false;
            }
        },
        filterCard: () => false,
        selectCard: -1,
        log: false,
        async precontent(event, trigger, player) {
            player.logSkill("mcdh_BI00101");
            player.changeZhuanhuanji("mcdh_BI00101");
            player.mcdh_removeCharge(1);
            player.addTempSkill("mcdh_BI00101_effect", { player: "phaseBegin" });
        },
        trigger: {
            global: "phaseJieshuBegin",
        },
        mcdhCharge: 1,
        mark: true,
        zhuanhuanji: true,
        marktext: "☯",
        intro: {
            content(storage, player, skill) {
                if (!storage) return "出牌阶段，你可以视为使用一张无距离限制的【杀】，然后直到你下回合开始，你的攻击范围始终视为1。";
                return "每名角色的结束阶段，你可以判定，若结果为红桃，你可以令其回复1点体力，否则你获得此判定牌。";
            },
        },
        filter(event, player) {
            if (event.getParent().name != "phaseUse" && !player.storage.mcdh_BI00101) return false
            return player.mcdh_hasCharge("mcdh_BI00101");
        },
        prompt(event) {
            const player = event.player;
            if (player.storage.mcdh_BI00101) {
                return `是否对${get.translation(event.player)}发动【${get.skillTranslation("mcdh_BI00101", player)}】？`;
            }
            return "出牌阶段，你可以视为使用一张无距离限制的【杀】，然后直到你下回合开始，你的攻击范围始终视为1。";
        },
        prompt2: "每名角色的结束阶段，你可以判定，若结果为红桃，你可以令其回复1点体力，否则你获得此判定牌。",
        async content(event, trigger, player) {
            player.changeZhuanhuanji("mcdh_BI00101");
            player.mcdh_removeCharge();
            const next = player.judge();
            next.set("callback", get.info("mcdh_BI00101").callback);
            await next;
        },
        async callback(event, trigger, player) {
            const target = event.getParent(2).getTrigger().player;
            if (event.judgeResult.suit == "heart") {
                const result = await player
                    .chooseBool(`你可以令${get.translation(target)}回复1点体力`)
                    .set("ai", () => {
                        const { player, target } = get.event();
                        return get.sgnAttitude(player, target) * get.recoverEffect(target, player, player) > 0;
                    })
                    .set("target", target)
                    .forResult();
                if (result.bool) {
                    await target.recover();
                }
            } else {
                await player.gain(event.card, "gain2");
            }
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    attackRangeBase: () => 1,
                },
            },
        },
    },
    mcdh_BI00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseUseBegin",
        },
        limited: true,
        filter(event, player) {
            const num = 5 - player.countCards("e");
            return player.mcdh_countCharge() >= num;
        },
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            const cards = player.getCards("e", card => {
                return lib.filter.cardDiscardable(card, player, event.name);
            });
            if (cards.length) {
                await player.discard(cards);
                player.mcdh_removeCharge(5 - cards.length);
            }
            player.addTempSkill("mcdh_BI00102_effect");
            if (_status.connectMode)
                game.broadcastAll(function () {
                    _status.noclearcountdown = true;
                });
            const lose_list = [];
            let num = 5;
            let log = false;
            while (num > 0) {
                const result = await player
                    .chooseTarget(get.prompt("mcdh_BI00102"), `弃置任意名角色的累计至多${num}张牌`, (card, player, target) => {
                        return target.hasCard(card => {
                            return lib.filter.canBeDiscarded(card, player, target, "mcdh_BI00102");
                        }, "he");
                    })
                    .set("ai", target => {
                        const player = _status.event.player,
                            discarded = _status.event.lose_list.find(item => item[0] == target);
                        if (discarded) {
                            if (target == player) return 0;
                            const num = discarded[1].length;
                            if (num > 1 && player.hp + player.hujia > 2) return 0;
                        }
                        if (target == player) {
                            if (ui.cardPile.childNodes.length > 80 && player.hasCard(card => get.value(card) < 8)) return 20;
                            return 0;
                        }
                        return get.effect(target, { name: "guohe_copy2" }, player, player);
                    })
                    .set("lose_list", lose_list)
                    .forResult();
                if (result?.bool && result.targets?.length) {
                    const target = result.targets[0];
                    const { bool, cards } = await player
                        .choosePlayerCard(target, true, "he", [1, num], `选择弃置${get.translation(target)}的牌`)
                        .set("filterButton", button => {
                            const card = button.link,
                                target = _status.event.target,
                                player = get.player();
                            return lib.filter.canBeDiscarded(card, player, target, "mcdh_BI00102");
                        })
                        .set("lose_list", lose_list)
                        .set("ai", button => {
                            if (ui.selected.buttons.length > 0) return false;
                            var val = get.buttonValue(button);
                            if (get.attitude(_status.event.player, _status.event.target) > 0) return -val;
                            return val;
                        })
                        .forResult();
                    num -= cards.length;
                    const index = lose_list.find(item => item[0] == target);
                    if (!index) {
                        lose_list.push([target, cards]);
                    } else {
                        index[1].addArray(cards);
                    }
                    await target.discard(cards, "notBySelf").set("discarder", player);
                } else {
                    break;
                }
            }
            if (_status.connectMode) {
                game.broadcastAll(function () {
                    delete _status.noclearcountdown;
                    game.stopCountChoose();
                });
            }
        },
        subSkill: {
            effect: {
                trigger: {
                    global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
                },
                forced: true,
                popup: false,
                charlotte: true,
                filter(event, player) {
                    return game.hasPlayer(function (target) {
                        if (!event.getParent("mcdh_BI00102", true)) return false;
                        let evt = event.getl(target);
                        return evt && evt.hs && evt.hs.length && !target.hasCards("h");
                    });
                },
                getIndex(event, player) {
                    if (event.name !== "loseAsyncAfter") return [event.player];
                    return game.filterPlayer(target => {
                        if (!event.getParent("mcdh_BI00102", true)) return false;
                        let evt = event.getl(target);
                        return evt && evt.hs && evt.hs.length && !target.hasCards("h");
                    }).sortBySeat(player);
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    game.trySkillAudio("mcdh_BI00102", player);
                    await target.damage();
                },
            },
        },
    },
    mcdh_BI00103: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        filter(event, player) {
            return (event.name != "phase" || game.phaseNumber == 0);
        },
        logTarget(event, player) {
            return game.filterPlayer(target => target != player);
        },
        getSkills(player) {
            return player
                .getCards("e", card => {
                    return ["equip2", "equip3", "equip4"].includes(get.subtype(card));
                })
                .reduce((list, card) => {
                    const info = get.info(card);
                    if (info && info.skills) return list.addArray(info.skills);
                    return list;
                }, []);
        },
        async content(event, trigger, player) {
            for (const target of event.targets) {
                target.addSkill("mcdh_BI00103_effect");
                target.markAuto("mcdh_BI00103_effect", [player]);
            }
        },
        subSkill: {
            effect: {
                trigger: {
                    global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "phaseBefore"],
                },
                forced: true,
                popup: false,
                charlotte: true,
                firstDo: true,
                async content(event, trigger, player) {
                    if (player.getStorage("mcdh_BI00103_effect").some(i => i.inRange(player))) {
                        player.addTip("mcdh_BI00103_effect", get.translation("mcdh_BI00103_effect"));
                        player.disableSkill("mcdh_BI00103_effect", get.info("mcdh_BI00103").getSkills(player));
                    } else {
                        player.removeTip("mcdh_BI00103_effect");
                        player.enableSkill("mcdh_BI00103_effect");
                    }
                },
                init(player, skill) {
                    if (player.getStorage(skill).every(i => !i.inRange(player))) return;
                    player.addTip(skill, get.translation(skill));
                    player.disableSkill(skill, get.info("mcdh_BI00103").getSkills(player));
                },
                onremove(player, skill) {
                    player.removeTip(skill);
                    delete player.storage[skill];
                    player.enableSkill(skill);
                },
                mod: {
                    attackRange(player, num) {
                        if (player.getStorage("mcdh_BI00103_effect").every(i => !i.inRange(player))) return;
                        return num + 1 - player.getEquipRange();
                    },
                    globalFrom(from, to, distance) {
                        if (from.getStorage("mcdh_BI00103_effect").every(i => !i.inRange(from))) return;
                        let num = 0;
                        for (let i of from.getVCards("e")) {
                            const info = get.info(i).distance;
                            if (!info) continue;
                            if (info.globalFrom) num += info.globalFrom;
                        }
                        return distance - num;
                    },
                    globalTo(from, to, distance) {
                        if (to.getStorage("mcdh_BI00103_effect").every(i => !to.inRange(to))) return;
                        let num = 0;
                        for (let i of to.getVCards("e")) {
                            const info = get.info(i).distance;
                            if (!info) continue;
                            if (info.globalTo) num += info.globalTo;
                            if (info.attackTo) num += info.attackTo;
                        }
                        return distance - num;
                    },
                },
                mark: true,
                intro: {
                    markcount: () => 0,
                    content: "若你处于$的攻击范围内，你的防具与坐骑效果失效",
                },
            },
        },
    },
    //崖心
    mcdh_BI00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:3",
        enable: "phaseUse",
        mcdhCharge: 3,
        filterTarget(card, player, target) {
            return player.canCompare(target);
        },
        selectTarget: [1, 3],
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_BI00201")) {
                return false;
            }
            return player.hasCards("h");
        },
        multitarget: true,
        async content(event, trigger, player) {
            player.mcdh_removeCharge(3);
            player.chooseToCompare(event.targets).set("callback", get.info("mcdh_BI00201").callback);
        },
        async callback(event, trigger, player) {
            const target = event.target;
            if (event.num1 < event.num2) await target.draw();
            else if (event.num1 > event.num2) {
                if (player.canMoveCard(true, true, target)) {
                    await player.moveCard(true, target);
                } else {
                    if (target.hasCards("h")) await target.chooseToDiscard("h", true);
                }
            }
        },
        ai: {
            order: 7,
            result: {
                target(player, target) {
                    return -1;
                },
            },
        },
    },
    mcdh_BI00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        fetters: ["mcdh_BI001", "mcdh_BI002", "mcdh_BI003"],
        trigger: {
            global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        getIndex(event, player) {
            return game
                .filterPlayer(target => {
                    const evt = event.getl(target);
                    return evt && evt.es?.length;
                })
                .sortBySeat(player);
        },
        filter(event, player, triggername, target) {
            return target?.isIn() && (_status.currentPhase != target || get.info("mcdh_BI00202").fetters.some(name => get.is.playerNames(target, name)));
        },
        logTarget(event, player, triggername, target) {
            return target;
        },
        prompt2(event, player, triggername, target) {
            return `你可以与${get.translation(target)}各摸一张牌。`;
        },
        check(event, player, triggername, target) {
            return get.attitude(player, target) > 0;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            await game.asyncDraw([player, target]);
        },
    },
    //初雪
    mcdh_BI00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "damageBegin4",
        },
        mcdhCharge: 2,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_BI00301")) return false;
            return event.player.hasEnabledSlot() || (event.player == player ? event.player.countGainableCards(player, "e") : event.player.countCards("he", { type: "equip" }));
        },
        logTarget: "player",
        check(event, player) {
            if (get.damageEffect(event.player, player, player) < 0) {
                return true;
            }
            var att = get.attitude(player, event.player);
            if (att > 0 && event.player.hasCards("e")) {
                return true;
            }
            if (event.num > 1) {
                if (att < 0) {
                    return false;
                }
                if (att > 0) {
                    return true;
                }
            }
            var cards = event.player.getGainableCards(player, "e");
            for (var i = 0; i < cards.length; i++) {
                if (get.equipValue(cards[i]) >= 6) {
                    return true;
                }
            }
            return false;
        },
        async content(event, trigger, player) {
            player.mcdh_removeCharge(2);
            trigger.cancel();
            const target = trigger.player;
            const list = [];
            if (target.hasEnabledSlot()) {
                list.push("废除你的装备栏");
            }
            if (target != player && target.countGainableCards(player, "e")) {
                list.push("获得你的装备牌");
            } else if (target == player) {
                if (player.hasCards("he", { type: "equip" })) {
                    list.push("你弃置一张装备");
                }
            }
            event.result = await target
                .chooseControl(list)
                .set("prompt", `###${get.translation(player)}对你发动了${get.poptip(event.name)}###选择令其执行一项`)
                .set("ai", () => {
                    let controls = get.event().controls;
                    return controls[controls.length - 1];
                })
                .forResult();
            if (event.result.control == "废除你的装备栏") {
                const list = [];
                for (let i = 1; i < 6; i++) {
                    if (target.hasEnabledSlot(i)) {
                        list.add("equip" + (i == 3 || i == 4 ? "3_4" : i));
                    }
                }
                if (!list.length) return;
                if (list.length == 1) {
                    event.result = { control: list[0] };
                } else {
                    event.result = await player
                        .chooseControl(list)
                        .set("prompt", `选择废除${get.translation(target)}的一个装备栏`)
                        .set("ai", function () {
                            var target = _status.event.getTrigger().player;
                            if (list.includes("equip6") && target.getEquip("equip3") && target.getEquip("equip4")) {
                                return "equip6";
                            }
                            if (list.includes("equip2") && target.getEquip(2) && get.value(target.getEquip(2), target) > 0) {
                                return "equip2";
                            }
                            if (list.includes("equip5") && target.getEquip(5) && get.value(target.getEquip(5), target) > 0) {
                                return "equip5";
                            }
                            return 0;
                        })
                        .forResult();
                }
                if (event.result.control != "equip3_4") {
                    await target.disableEquip(event.result.control);
                } else {
                    await target.disableEquip(3, 4);
                }
            } else {
                if (target != player) {
                    await player.gainPlayerCard(target, "e", true);
                } else {
                    await player.chooseToDiscard("he", { type: "equip" }, true);
                }
            }
        },
    },
    mcdh_BI00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "damageBegin3",
        },
        filter(event, player) {
            return player.inRange(event.player) && event.player.hasDisabledSlot();
        },
        logTarget: "player",
        check(event, player) {
            if (get.damageEffect(event.player, event.source, player) <= 0) {
                return 0;
            }
            return true;
        },
        async content(event, trigger, player) {
            const next = player.chooseToEnable();
            next.set("ai", () => {
                var player = get.player();
                var list = [2, 5, 1, 3, 4];
                for (var i of list) {
                    if (player.hasDisabledSlot(i)) return "equip" + i;
                }
            });
            await next;
            trigger.num++;
        },
    },
    //角峰
    mcdh_BI00401: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        getNum(player) {
            return game
                .getRoundHistory(
                    "everything",
                    evt => {
                        return ["lose", "loseAsync", "equip", "cardsDiscard"].includes(evt.name) && evt.getd(player, "cards2").some(i => get.type(i) == "basic");
                    },
                ).length;
        },
        init(player) {
            if (!player.countMark("mcdh_BI00401_counter")) {
                const num = lib.skill.mcdh_BI00401.getNum(player);
                if (num) {
                    player.addTempSkill("mcdh_BI00401_counter", "roundStart");
                    player.addMark("mcdh_BI00401_counter", num, false);
                }
            }
        },
        onremove: ["mcdh_BI00401_counter"],
        trigger: {
            player: "loseAfter",
            global: ["loseAsyncAfter", "cardsDiscardAfter"],
        },
        filter(event, player) {
            if (!lib.skill.mcdh_BI00401.filterx(event, player)) return false;
            return event.getd(player, "cards2").some(i => get.type(i, player) == "basic");
        },
        filterx(event, player) {
            switch (player.countMark("mcdh_BI00401_counter")) {
                case 1:
                    return player.canMoveCard(
                        null,
                        true,
                        player,
                        game.filterPlayer(target => target != player),
                    );
                case 2:
                    return true;
                case 3:
                    return player.isDamaged();
                case 4:
                    return player.countCards("h") < player.maxHp;
                default:
                    return false;
            }
        },
        async cost(event, trigger, player) {
            const index = player.countMark("mcdh_BI00401_counter");
            const map = lib.skill.mcdh_BI00401.backups;
            const prompt = map.get(index).description;
            const cost = map.get(index).cost;
            if (cost) {
                cost(event, trigger, player);
                return;
            }
            event.result = await player
                .chooseBool(`###${get.prompt(event.skill)}###${prompt}`)
                .forResult();
        },
        async content(event, trigger, player) {
            const index = player.countMark("mcdh_BI00401_counter");
            const map = lib.skill.mcdh_BI00401.backups;
            if (!Array.from(map).map(info => info[0]).includes(index)) return;
            const backups = Array.from(map).map(info => info[1]);
            const next = game.createEvent(event.name + "_backup", false);
            next.player = player;
            next.targets = event.targets;
            next.setContent(map.get(index).content);
        },
        backups: new Map([
            [1, {
                description: "移动你场上的一张牌",
                async content(event, trigger, player) {
                    await player.moveCard(
                        true,
                        player,
                        game.filterPlayer(i => i != player)
                    );
                },
            }],
            [2, {
                description: "令一名角色摸一张牌",
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseTarget(get.prompt(event.skill), "令一名角色摸一张牌")
                        .forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    await target.draw();
                },
            }],
            [3, {
                description: "回复1点体力",
                async content(event, trigger, player) {
                    await player.recover();
                },
            }],
            [4, {
                description: "摸牌至体力上限",
                async content(event, trigger, player) {
                    await player.drawTo(player.maxHp);
                },
            }],
        ]),
        group: "mcdh_BI00401_mark",
        subSkill: {
            mark: {
                trigger: {
                    player: "loseAfter",
                    global: ["loseAsyncAfter", "cardsDiscardAfter"],
                },
                forced: true,
                charlotte: true,
                popup: false,
                firstDo: true,
                filter(event, player) {
                    return event.getd(player, "cards2").some(i => get.type(i, player) == "basic");
                },
                async content(event, trigger, player) {
                    if (!player.countMark(event.name)) {
                        player.addTempSkill("mcdh_BI00401_counter", "roundStart");
                    }
                    player.addMark("mcdh_BI00401_counter", 1, false);
                },
            },
            counter: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    mcdh_BI00402: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        init(player) {
            game.addGlobalSkill("mcdh_BI00402_global");
        },
        onremove(player) {
            if (!game.hasPlayer(current => current.hasSkill("mcdh_BI00402", null, null, false), true)) {
                game.removeGlobalSkill("mcdh_BI00402_global");
            }
        },
        trigger: {
            player: "phaseUseBegin",
        },
        mcdhCharge: 3,
        popup: false,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_BI00402")) return false;
            return game.hasPlayer(target => target != player);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", target => {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            player.mcdh_removeCharge(3);
            player.addTempSkill("mcdh_BI00402_effect", { player: "phaseBegin" });
            player.markAuto("mcdh_BI00402_effect", [target]);
        },
        subSkill: {
            global: {
                trigger: {
                    player: "dieAfter",
                },
                filter: (event, player) => {
                    return !game.hasPlayer(current => current.hasSkill("mcdh_BI00402", null, null, false), true);
                },
                silent: true,
                forceDie: true,
                charlotte: true,
                content: () => {
                    game.removeGlobalSkill(event.name);
                },
                hiddenCard(player, name) {
                    if (!game.hasPlayer(target => target.hasStorage("mcdh_BI00402_effect", player))) {
                        return false;
                    }
                    return true;
                },
                ai: {
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player) {
                        if (!game.hasPlayer(target => target.hasStorage("mcdh_BI00402_effect", player))) {
                            return false;
                        }
                    },
                },
            },
            effect: {
                trigger: {
                    global: ["chooseToUseBegin", "chooseToRespondBegin"],
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    if (event._mcdh_BI00402_effect || event.responded) {
                        return false;
                    }
                    if (!player.hasStorage("mcdh_BI00402_effect", event.player)) {
                        return false;
                    }
                    if (event.player == _status.currentPhase || event.player == player) {
                        return false;
                    }
                    return get.inpileVCardList(info => {
                        const name = info[2],
                            nature = info[3];
                        const card = { name: name };
                        return event.filterCard(card, event.player, event);
                    }).length;
                },
                async content(event, trigger, player) {
                    const list = get.inpileVCardList(info => {
                        const name = info[2],
                            nature = info[3];
                        const card = { name: name };
                        return trigger.filterCard(card, trigger.player, trigger);
                    });
                    if (!list.length) {
                        return;
                    }
                    const reason = trigger.name == "chooseToUse" ? "使用" : "打出";
                    const next = player[trigger.name](`是否替${get.translation(trigger.player)}${reason}一张牌`, function (card) {
                        if (!get.event().nameList.includes(get.name(card))) {
                            return false;
                        }
                        const trigger = get.event().getTrigger();
                        return trigger.filterCard(card, trigger.player, trigger);
                    });
                    next.set("ai", () => {
                        const event = _status.event;
                        return get.attitude(event.player, event.source) - 2;
                    });
                    next.set("nameList", list.map(info => info[2]));
                    next.set("source", trigger.player);
                    next.set("_mcdh_BI00402_effect", true);
                    next.set("skillwarn", `替${get.translation(trigger.player)}${trigger.name == "chooseToUse" ? "使用" : "打出"}一张牌`);
                    var keys = ["filterTarget", "selectTarget", "ai2"];
                    for (var key of keys) {
                        delete next[key];
                    }
                    for (var i in trigger) {
                        if (!(i in next)) {
                            next[i] = trigger[i];
                        }
                    }
                    next.filterTargetx = trigger.filterTarget || (() => false);
                    next.filterTarget = function (card, player, target) {
                        var filter = this.filterTargetx;
                        if (typeof filter != "function") {
                            filter = () => filter;
                        }
                        player = _status.event.getTrigger().player;
                        return this.filterTargetx.apply(this, arguments);
                    };
                    if (typeof next.selectTarget != "number" && typeof next.selectTarget != "function" && get.itemtype(next.selectTarget) != "select") {
                        next.selectTarget = -1;
                    }
                    const { bool, card, cards, targets } = await next.forResult();
                    if (bool) {
                        trigger.untrigger();
                        trigger.set("responded", true);
                        trigger.animate = false;
                        const result = {
                            bool: true,
                            card: card,
                            cards: cards,
                        };
                        if (targets?.length) {
                            result.targets = targets;
                        }
                        trigger.result = result;
                        return;
                    }
                },
                mark: true,
                marktext: "护",
                intro: {
                    markcount: (storage) => get.translation(storage),
                    mark(dialog, storage, player) {
                        if (storage && storage.length) {
                            dialog.addSmall(storage);
                        }
                    },
                },
            },
        },
    },
    //讯使
    mcdh_BI00501: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            source: "damageSource",
            player: ["damageEnd", "phaseJieshuBegin"],
        },
        forced: true,
        filter(event, player) {
            if (event.name == "phaseJieshu") {
                return player.getExpansions("mcdh_BI00501").length;
            }
            return event.source?.isIn() && event.source.hasCards("he");
        },
        async content(event, trigger, player) {
            if (event.triggername != "phaseJieshuBegin") {
                const result = await player
                    .choosePlayerCard(trigger.source, "he", true)
                    .forResult();
                if (result?.bool && result?.cards?.length) {
                    const next = player.addToExpansion(result.cards, trigger.source, "give");
                    next.set("gaintag", ["mcdh_BI00501"]);
                    await next;
                }
            } else {
                const cards = player.getExpansions("mcdh_BI00501");
                if (cards.length) await player.gain(cards, "gain2");
                const num = Math.min(cards.length, game.countPlayer(target => target != player));
                if (!num || player.countCards("he") < num) return;
                const result = await player
                    .chooseCardTarget({
                        prompt: `你发动了${get.translation(event.skill)}`,
                        prompt2: `选择将${num}张牌交给等量名其他角色。`,
                        forced: true,
                        filterCard: true,
                        selectCard: num,
                        position: "he",
                        filterTarget: lib.filter.notMe,
                        selectTarget() {
                            return ui.selected.cards.length;
                        },
                        ai1(card) {
                            if (card.name == "du") return 10;
                            else if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
                            var player = _status.event.player;
                            if (ui.selected.cards.length > 4 || !game.hasPlayer(function (current) {
                                return get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
                            })) return 0;
                            return 1 / Math.max(0.1, get.value(card));
                        },
                        ai2(target) {
                            var player = _status.event.player,
                                att = get.attitude(player, target);
                            if (ui.selected.cards[0].name == "du") return -att;
                            if (target.hasSkillTag("nogain")) att /= 6;
                            return att;
                        },
                    })
                    .forResult();
                if (result?.bool) {
                    const gain_list = [];
                    for (let i = 0; i < result.targets.length; i++) {
                        gain_list.push([result.targets[i], result.cards[i]]);
                        player.line(result.targets[i]);
                    }
                    await game
                        .loseAsync({
                            gain_list: gain_list,
                            player: player,
                            cards: result.cards,
                            giver: player,
                            animate: "giveAuto",
                        })
                        .setContent("gaincardMultiple");
                }
            }
        },
        marktext: "信",
        intro: {
            content: "expansion",
            markcount: "expansion",
        },
        onremove(player, skill) {
            const cards = player.getExpansions(skill);
            if (cards.length) {
                player.loseToDiscardpile(cards);
            }
        },
    },
    mcdh_BI00502: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "gainAfter",
            global: "loseAsyncAfter",
        },
        usable: 1,
        getIndex(event, player, triggername, target) {
            if (event.name == "loseAsync" && event.type != "gain") return [];
            if (!event.getl || !event.getg) return [];
            return game
                .filterPlayer(target => {
                    let cards2 = event.getl(target).cards2;
                    return game.hasPlayer(current => {
                        if (current == target) return false;
                        if (cards2.length) {
                            let cards = event.getg(current);
                            if (cards?.length && cards.some(card => cards2.includes(card))) return true;
                        }
                        return false;
                    });
                })
                .sortBySeat();
        },
        logTarget(event, player, triggername, target) {
            return target;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            await target.draw();
            if (target.isMaxHandcard() && target != player && target.countGainableCards(player, target == player ? "e" : "he")) {
                await player.gainPlayerCard(target, target == player ? "e" : "he", true);
            }
        },
    },
    //灵知
    mcdh_BI00601: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        mcdhCharge: 2,
        filter(event, player) {
            return player.mcdh_hasCharge("mcdh_BI00601");
        },
        filterTarget(card, player, target) {
            return target != player && target.countDiscardableCards(player, "he");
        },
        selectTarget: 2,
        multitarget: true,
        complexTarget: true,
        line: false,
        async content(event, trigger, player) {
            player.mcdh_removeCharge(2);
            await player.loseHp();
            player.addTempSkill("mcdh_BI00601_effect", "phaseUseAfter");
            player.addMark("mcdh_BI00601_effect", 1, false);
            for (const target of event.targets) {
                if (target.countDiscardableCards(player, "he")) {
                    await player.discardPlayerCard(target, "he", true);
                }
            }
        },
        ai: {
            order: 8,
            result: {
                target(player, target) {
                    if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) return 0;
                    return -1;
                },
            },
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") {
                            return num + player.countMark("mcdh_BI00601_effect");
                        }
                    },
                    targetInRange(card, player, target) {
                        if (card.name == "sha" && get.color(card) == "red") return true;
                    },
                    selectTarget(card, player, range) {
                        if (card.name != "sha" || get.color(card) != "red") return;
                        if (range[1] == -1) return;
                        range[1] += player.countMark("mcdh_BI00601_effect");
                    },
                },
                mark: true,
                intro: {
                    content(storage, player, skill) {
                        const num = player.countMark("mcdh_BI00601_effect");
                        return `你使用【杀】的限制次数+${num}，使用的红色【杀】无距离限制且可以额外指定${get.cnNumber(num)}名角色为目标`;
                    },
                },
            },
        },
    },
    mcdh_BI00602: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "mcdh_addChargeAfter",
        },
        popup: false,
        filter(event, player) {
            return game.hasPlayer(target => {
                return target.countDiscardableCards(player, "h");
            });
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), function (card, player, target) {
                    return target.countDiscardableCards(player, "h");
                })
                .set("ai", target => {
                    const player = get.player();
                    let att = get.attitude(player, target);
                    if (target.hasSkillTag("noh")) att /= 2;
                    return -att;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            player.discardPlayerCard("h", target, true);
        },
        group: "mcdh_BI00602_use",
        subSkill: {
            use: {
                audio: "mcdh_BI00602",
                trigger: {
                    global: ["loseAfter", "loseAsyncAfter"],
                },
                direct: true,
                getIndex(event, player) {
                    if (event.type != "discard" || event.getlx === false) return [];
                    if ((!event.discarder || event.getParent(2).player) != player) return [];
                    return game.filterPlayer(target => {
                        if (target == player) return false;
                        if (
                            target.getHistory("lose", evt => {
                                if (evt.type != "discard") return false;
                                if ((!evt.discarder || evt.getParent(2).player) != player) return false;
                                return evt.cards2 && evt.cards2?.length;
                            })
                                .length != 2
                        )
                            return false;
                        return event.getl(target).cards2?.length > 0;
                    });
                },
                filter(event, player) {
                    if (event.type != "discard" || event.getlx === false) return false;
                    if ((!event.discarder || event.getParent(2).player) != player) return false;
                    return game.hasPlayer(function (target) {
                        if (target == player) return false;
                        if (
                            target.getHistory("lose", evt => {
                                if (evt.type != "discard") return false;
                                if ((!evt.discarder || evt.getParent(2).player) != player) return false;
                                return evt.cards2 && evt.cards2?.length;
                            })
                                .length != 2
                        )
                            return false;
                        return event.getl(target).cards2?.length > 0;
                    });
                },
                logTarget(event, player, name, target) {
                    return target;
                },
                async content(event, trigger, player) {
                    const target = event.indexedData;
                    const card = new lib.element.VCard({ name: "sha", nature: "ice" });
                    await player
                        .chooseUseTarget(card, target, false)
                        .set("prompt", `###${get.prompt(`${event.name}`, target)}###你可以视为对其使用一张无距离限制的冰【杀】。`)
                        .set("logSkill", event.name)
                        .forResult();
                },
            },
        },
    },
    //锏
    mcdh_BI00701: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            if (event.name != "phaseJieshu") {
                return player.hasCards("h", card => get.type2(card) == "trick" && player.canRecast(card));
            }
            return player
                .getHistory("custom", evt => evt.mcdh_BI00701)
                .reduce((list, evt) => list.add(evt.mcdh_BI00701), []).length >= 3;
        },
        chooseButton: {
            dialog() {
                var dialog = ui.create.dialog(
                    "无声的歌者",
                    [
                        [
                            [1, "⒈【杀】无距离限制且无视防具"],
                        ],
                        "tdnodes",
                    ],
                    [
                        [
                            [2, "⒉使用的下张【杀】无次数限制"],
                        ],
                        "tdnodes",
                    ],
                    [
                        [
                            [3, "⒊【杀】可以额外指定一名目标"],
                        ],
                        "tdnodes",
                    ],
                );
                return dialog;
            },
            check(button) {
                let player = get.player();
                let eff = 0.6;
                if (!player.hasHistory("custom", evt => evt.mcdh_BI00701 == button.link)) {
                    eff += 0.3;
                }
                return eff + Math.random();
            },
            backup(links, player) {
                return {
                    num: links[0],
                    filterCard(card) {
                        const player = get.player();
                        return get.type2(card) == "trick" && player.canRecast(card);
                    },
                    check(card) {
                        return 7 - get.value(card);
                    },
                    lose: false,
                    discard: false,
                    delay: false,
                    log: false,
                    async content(event, trigger, player) {
                        player.logSkill("mcdh_BI00701");
                        const num = lib.skill.mcdh_BI00701_backup.num;
                        await player.recast(event.cards);
                        player.getHistory("custom").push({ mcdh_BI00701: num });
                        player.addTempSkill("mcdh_BI00701_effect");
                        player.markAuto("mcdh_BI00701_effect", [num]);
                    },
                    ai: {
                        result: {
                            player: 1,
                        },
                    },
                };
            },
        },
        async content(event, trigger, player) {
            const card = get.discardPile(function (cardx) {
                return get.type(cardx) == "equip";
            });
            if (card) {
                await player.gain(card, "gain2");
                await player.chooseUseTarget(card);
            }
        },
        ai: {
            order() {
                return get.order({ name: "sha" }) + 0.1;
            },
            result: {
                player(player) {
                    return 1;
                },
            },
        },
        subSkill: {
            backup: {},
            effect: {
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                charlotte: true,
                onremove: true,
                silent: true,
                firstDo: true,
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
                mod: {
                    targetInRange(card, player, target, now) {
                        if (card.name == "sha" && player.hasStorage("mcdh_BI00701_effect", 1)) return true;
                    },
                    cardUsable(card, player, num) {
                        if (card.name == "sha" && player.hasStorage("mcdh_BI00701_effect", 2)) return Infinity;
                    },
                    selectTarget(card, player, range) {
                        if (card.name != "sha" || !player.hasStorage("mcdh_BI00701_effect", 3)) return;
                        if (range[1] == -1) return;
                        range[1] += 1;
                    },
                },
                ai: {
                    unequip: true,
                    skillTagFilter(player, tag, arg) {
                        if ((!arg || !arg.card || arg.card.name != "sha") && player.hasStorage("mcdh_BI00701_effect", 1)) return false;
                    },
                },
                mark: true,
                intro: {
                    markcount: () => false,
                    content(storage, player) {
                        let list = ["1.无距离限制且无视防具；", "2.无次数限制；", "3.可以额外指定一名目标。"];
                        let str = "本回合使用的下一张【杀】：";
                        storage.forEach(info => str += list[info - 1]);
                        return str;
                    },
                },
            },
        },
    },
    mcdh_BI00702: {
        nobracket: true,
        mod: {
            cardEnabled(card) {
                if (get.type(card, "trick") == "trick") return false;
            },
            aiValue(player, card, val) {
                if (get.type(card, "trick") == "trick") {
                    return 0;
                }
            },
            aiUseful(player, card, val) {
                if (get.type(card, "trick") == "trick") {
                    return 0;
                }
            },
        },
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        filter(event, player) {
            return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
            await player.expandEquip(1);
            const cards = [];
            while (cards.length < 2) {
                const card = get.cardPile(card => {
                    return get.subtype(card) == "equip1" && !cards.includes(card);
                });
                if (card) {
                    cards.push(card);
                } else {
                    break;
                }
            }
            for (const card of cards) {
                await player.equip(card);
            }
        },
    },
    //耶拉
    mcdh_BI00801: {
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.countCards("he", { name: ["wuxie", "shan"] }) > 0;
        },
        filterTarget(card, player, target) {
            if (!ui.selected.targets.length && player == target) return false;
            if (ui.selected.targets.length) {
                if (ui.selected.cards[0].name == "shan") {
                    return target.canUse({ name: "juedou" }, ui.selected.targets[0]);
                }
                return target.canUse({ name: "sha" }, ui.selected.targets[0], false, false);
            }
            return true;
        },
        selectTarget: 2,
        complexTarget: true,
        filterCard(card, player, target) {
            return card.name == "wuxie" || card.name == "shan";
        },
        check(card) {
            return 8 - get.value(card);
        },
        targetprompt: ["给牌", "用牌"],
        multitarget: true,
        discard: false,
        lose: false,
        delay: false,
        async content(event, trigger, player) {
            const targets = event.targets;
            await player.give(event.cards, targets[0], "visible");
            for (const target of targets) {
                target.addTempSkill("mcdh_BI00801_effect");
            }
            const card = new lib.element.VCard({ name: event.cards[0].name == "shan" ? "juedou" : "sha" });
            const useCardEvent = targets[1].useCard(card, targets[0], "noai");
            useCardEvent.animate = false;
            await useCardEvent;
            await game.delay(0.5);
            for (const target of targets) {
                target.removeSkill("mcdh_BI00801_effect");
            }
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "damageBegin3",
                    source: "damageBegin1",
                },
                forced: true,
                popup: false,
                charlotte: true,
                async content(event, trigger, player) {
                    if (event.triggername == "damageBegin1") await player.draw();
                    else if (player.hasCards("he")) await player.chooseToDiscard("he", true);
                },
            },
        },
        ai: {
            expose: 0.4,
            order: 4,
            result: {
                target(player, target) {
                    if (!ui.selected.targets.length) {
                        return -3;
                    } else {
                        const eff1 = get.effect(target, { name: "juedou" }, ui.selected.targets[0], target),
                            eff2 = get.effect(target, { name: "sha" }, ui.selected.targets[0], target);
                        return Math.max(eff1, eff2);
                    }
                },
            },
        },
    },
    mcdh_BI00802: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
        },
        filter(event, player) {
            return game.hasPlayer(target => {
                if (target == player || _status.currentPhase == target) return false;
                return event.getd(target, "cards2").some(card => !player.hasStorage("mcdh_BI00802_used", get.type2(card)));
            });
        },
        async cost(event, trigger, player) {
            const cards = game
                .filterPlayer(target => {
                    if (target == player || _status.currentPhase == target) return false;
                    return trigger.getd(target, "cards2").some(card => !player.hasStorage("mcdh_BI00802_used", get.type2(card)));
                })
                .reduce((list, target) => list.add(trigger.getd(target, "cards2")), []).flat();
            if (!cards.length) return;
            event.result = await player
                .chooseCardButton(get.prompt2(event.skill), cards)
                .set("filterButton", button => {
                    const player = get.player();
                    return !player.hasStorage("mcdh_BI00802_used", get.type2(button.link));
                })
                .set("ai", button => {
                    const player = get.player();
                    return get.value(button.link);
                })
                .forResult();
            if (event.result?.bool && event.result.links?.length) {
                event.result.cost_data = event.result.links;
            }
        },
        async content(event, trigger, player) {
            const cards = event.cost_data;
            await player.gain(cards, "gain2");
            player.addTempSkill("mcdh_BI00802_used", "roundStart");
            const list = cards.reduce((list, card) => list.add(get.type2(card)), []);
            player.markAuto("mcdh_BI00802_used", list);
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    //极光
    mcdh_BI00901: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "useCardToTarget",
        },
        mcdhCharge: 1,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_BI00901")) return false;
            if (_status.currentPhase == player) {
                return false;
            }
            return (event.card.name == "sha" || get.type(event.card) == "trick") && event.targets?.length == 1;
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill, trigger.target), "chooseonly")
                .set("ai", card => {
                    return _status.event.goon / 1.4 - get.value(card);
                })
                .set(
                    "goon",
                    (function () {
                        if (!trigger.targets.length) {
                            return -get.attitude(player, trigger.player);
                        }
                        var num = 0;
                        for (var i of trigger.targets) {
                            num -= get.effect(i, trigger.card, trigger.player, player);
                        }
                        return num;
                    })()
                )
                .forResult();
        },
        async content(event, trigger, player) {
            player.mcdh_removeCharge();
            await player.discard(event.cards);
            if (get.suit(event.cards[0]) == get.suit(trigger.card)) {
                trigger.targets.length = 0;
                trigger.getParent().triggeredTargets2.length = 0;
                trigger.cancel();
            } else {
                const cards = trigger.cards.filterInD();
                if (cards.length) {
                    await player.gain(cards, "gain2");
                }
            }
        },
    },
    mcdh_BI00902: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        //global: "mcdh_BI00902_global",
        trigger: {
            player: ["showCardsEnd", "loseEnd"],
        },
        filter(event, player) {
            if (event.name == "lose" && !event.visible) {
                return false;
            }
            return event.cards.some(card => {
                if (event.name == "showCards") {
                    if (!event?.show_map?.get?.(player)?.hs?.includes(card)) {
                        return false;
                    }
                }
                return get.suit(card, player) != "none";
            });
        },
        async cost(event, trigger, player) {
            const cards = trigger.cards.filter(card => {
                if (trigger.name == "showCards") {
                    if (!trigger?.show_map?.get?.(player)?.hs?.includes(card)) {
                        return false;
                    }
                }
                return get.suit(card, player) != "none";
            });
            if (!cards.length) {
                return;
            }
            event.result = await player
                .chooseCardButton(get.translation(event.skill), cards, [1, cards.length])
                .forResult();
            if (event.result.bool && event.result.links?.length) {
                event.result.cards = event.result.links;
            }
        },
        async content(event, trigger, player) {
            for (const card of event.cards) {
                //card.addGaintag("eternal_mcdh_BI00902_tag");
                game.broadcastAll(
                    function (card) {
                        card.init(["none", card.number, card.name]);
                    },
                    card,
                );
            }
        },
        subSkill: {
            tag: {
                name: "invisible",
            },
            global: {
                mod: {
                    suit(card, suit) {
                        if (get.itemtype(card) == "card" && card.hasGaintag("eternal_mcdh_BI00902_tag")) {
                            return "none";
                        }
                    },
                },
            },
        },
    },
    //菈塔托丝
    mcdh_BI01001: {
        nobracket: true,
        trigger: {
            player: "phaseUseBegin",
        },
        popup: false,
        filter(event, player) {
            return game.hasPlayer(target => {
                return target != player && target.countGainableCards(player, "h");
            });
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return target != player && target.countGainableCards(player, "h");
                })
                .set("ai", target => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    return get.event(target, { name: "shunshou_copy2" }, player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const { bool, cards } = await player.gainPlayerCard(target, "h", true).forResult();
            if (bool && cards?.length) {
                player.addGaintag(cards, "mcdh_BI01001_tag");
                const card = cards[0];
                if (player.hasCards("h") && game.hasPlayer(target => target != player)) {
                    const result = await player
                        .chooseCardTarget({
                            prompt: `你发动了${get.translation(event.name)}`,
                            prompt2: `请选择展示一张手牌并令一名其他角色猜测此牌是否是你因此获得的牌（${get.translation(card)}）`,
                            forced: true,
                            filterCard: true,
                            filterTarget: lib.filter.notMe,
                            source: target,
                            ai1(card) {
                                var player = _status.event.player;
                                return 6 / Math.max(1, get.value(card));
                            },
                            ai2(target) {
                                const { player, source } = get.event();
                                let att = get.attitude(player, target);
                                if (target == source) att /= 2;
                                return -att;
                            },
                        })
                        .forResult();
                    if (result.bool && result.targets?.length) {
                        const target2 = result.targets[0];
                        await player.showCards(result.cards);
                        const aiBool = (card == result.cards[0] ? 0 : 1);
                        const { index } = await target
                            .chooseControl(["是", "否"])
                            .set("prompt", `###${get.translation(player)}对你发动了【${get.translation(event.name)}】###猜测${get.translation(cards)}是否是其因此技能获得的牌，若猜测正确，你获得此牌，否则其在本回合结束时，获得你的一张牌。`)
                            .set("ai", () => {
                                const { player, source, bool } = get.event();
                                if (player == source) return bool;
                                return get.rand(0, 1);
                            })
                            .set("bool", aiBool)
                            .set("source", target)
                            .forResult();
                        target2.popup(aiBool == 0 ? "是" : "否");
                        if (aiBool === index) {
                            game.log(target2, "猜测", "#g正确");
                            await target2.gain(cards, "gain2");
                        }
                        else {
                            game.log(target2, "猜测", "#r错误");
                            player
                                .when("phaseEnd")
                                .then(async (event, trigger, player) => {
                                    if (target2.countGainableCards(player, "he")) {
                                        await player.gainPlayerCard(target2, "he", true);
                                    }
                                });
                        }
                    }
                }
                player.removeGaintag("mcdh_BI01001_tag");
            }
        },
        subSkill: {
            tag: {
                name: "底牌",
            },
        },
    },
    mcdh_BI01002: {
        nobracket: true,
        trigger: {
            player: "phaseJieshuBegin",
        },
        popup: false,
        limited: true,
        filter(event, player) {
            return game.hasPlayer(target => target != player);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", target => {
                    const player = get.player();
                    const att = get.sgnAttitude(player, target);
                    return att * get.damageEffect(target, player, target, "fire");
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.logSkill(event.name, event.targets);
            player.awakenSkill(event.name);
            const targets = [player, ...event.targets];
            for (const target of targets) {
                target.addSkill("mcdh_BI01002_effect");
                target.setStorage("mcdh_BI01002_effect", targets);
            }
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "phaseZhunbeiBegin",
                    global: "dying",
                },
                forced: true,
                charlotte: true,
                onremove: true,
                filter(event, player) {
                    return event.name == "phaseZhunbei" || player.hasStorage("mcdh_BI01002_effect", event.player);
                },
                async content(event, trigger, player) {
                    if (trigger.name == "phaseZhunbei") {
                        player.damage("fire", "nosource");
                    } else {
                        player.removeSkill(event.name);
                    }
                },
                mark: true,
                intro: {
                    content: "准备阶段，你受到1点无来源的火焰伤害，直到$其中一名角色进入濒死状态",
                },
            },
        },
    },
    //休露丝
    mcdh_BI01101: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        chooseButton: {
            dialog(event, player) {
                const list = get.inpileVCardList(info => {
                    const name = info[2], type = get.type(name), infox = get.info({ name: name });
                    return ["basic", "trick"].includes(type);
                });
                return ui.create.dialog(get.translation("mcdh_BI01101"), [list, "vcard"]);
            },
            check(button) {
                return get.player().getUseValue({
                    name: button.link[2],
                    nature: button.link[3],
                });
            },
            backup(links, player) {
                return {
                    filterCard: () => false,
                    selectCard: -1,
                    card: {
                        name: links[0][2],
                        nature: links[0][3],
                    },
                    filterTarget: lib.filter.notMe,
                    async content(event, trigger, player) {
                        const list = [],
                            target = event.targets[0],
                            vcard = get.info("mcdh_BI01101_backup").card;
                        if (target.hasUseTarget(vcard, false)) list.push("选项一");
                        if (target.hasCards("h")) list.push("选项二");
                        if (!list.length) return;
                        const { control } = await target
                            .chooseControl(list)
                            .set("choiceList", [
                                `视为使用一张【${get.translation(vcard)}】，此牌结算后你需弃置一张同名牌或者失去1点体力`,
                                `令${get.translation(player)}观看你的手牌并获得其中的一牌`,
                            ])
                            .set("card", vcard)
                            .set("ai", () => {
                                const player = get.player(),
                                    card = get.event().card;
                                let controls = get.event().controls;
                                if (controls.includes("选项一")) {
                                    if (player.hp > 2 || player.hasCards("he", card => {
                                        return get.name(card, false) == get.event().card.name
                                    })) return "选项一";
                                }
                                return "选项二";
                            })
                            .forResult();
                        if (control == "选项一") {
                            await target.chooseUseTarget(vcard, true);
                            const { bool } = await target
                                .chooseToDiscard("he", function (card) {
                                    return get.name(card) == vcard.name;
                                })
                                .set("prompt", `请弃置一张${get.translation(vcard)}，否则你失去1点体力`)
                                .set("ai", card => {
                                    return 10 - get.value(card);
                                })
                                .forResult();
                            if (!bool) target.loseHp();
                        } else if (target.hasCards("h")) {
                            await player.gainPlayerCard(target, "h", true, "visible");
                        }
                    },
                    ai: {
                        result: {
                            target: -1,
                        },
                    },
                }
            },
            prompt(links) {
                return "你可以声明【" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "】并选择一名其他角色";
            },
        },
        ai: {
            order: 6,
            result: {
                player: 1,
            },
        },
        subSkill: {
            backup: {},
        },
    },
    mcdh_BI01102: {
        nobracket: true,
        trigger: {
            player: "phaseJieshuBegin",
        },
        async cost(event, trigger, player) {
            const cards = get.info("mcdh_BI01102").getCards(player);
            if (!cards.length) {
                return;
            }
            const { bool, links } = await player
                .chooseCardButton(get.prompt2("mcdh_BI01102"), cards, [1, Infinity])
                .set("filterButton", button => {
                    let num = 0;
                    for (let i = 0; i < ui.selected.buttons.length; i++) {
                        num += get.number(ui.selected.buttons[i].link);
                    }
                    return num + get.number(button.link) <= _status.event.maxNum;
                })
                .set("ai", button => {
                    let player = _status.event.player,
                        name = get.name(button.link),
                        val = get.value(button.link, player);
                    if (name === "tao") {
                        return val + 2 * Math.min(3, 1 + player.getDamagedHp());
                    }
                    if (name === "jiu" && player.hp < 3) {
                        return val + 2 * (2.8 - player.hp);
                    }
                    if (name === "wuxie" && player.hasCards("j") && !player.hasWuxie()) {
                        return val + 5;
                    }
                    if (player.hp > 1 && player.hasSkill("renxin") && player.hasFriend() && get.type(button.link) === "equip") {
                        return val + 4;
                    }
                    return val;
                })
                .set("maxNum", 13)
                .forResult();
            if (event.result?.bool && event.result.links?.length) {
                event.result.cost_data = event.result.links;
            }
        },
        async content(event, trigger, player) {
            await player.gain(event.cost_data, "gain2");
        },
        getCards(player) {
            const cards = [];
            game.getGlobalHistory("cardMove", function (evtx) {
                if (get.info("mcdh_BI01102").isUseOrRespond(evtx, player)) cards.addArray(evtx.cards);
                if (evtx.player != player && evtx.type == "discard") cards.addArray(evtx.cards);
            });
            return cards;
        },
        isUseOrRespond(event, player) {
            if (event.name != "cardsDiscard") return false;
            var evtx = event.getParent();
            if (evtx.name != "orderingDiscard") return false;
            var evt2 = (evtx.relatedEvent || evtx.getParent());
            if (evt2.player == player) return false;
            if (evt2.name == "phaseJudge") return false;
            return ["useCard", "respond"].includes(evt2.name);
        },
    },
    //尤卡坦
    mcdh_BI01201: {
        nobracket: true,
        trigger: {
            player: "useCardToPlayered",
        },
        usable: 1,
        forced: true,
        locked: false,
        filter(event, player) {
            if (!get.is.damageCard(event.card)) return false;
            return event.targets?.length == 1 && game.hasPlayer(i => i != player && i.hasCards("h"));
        },
        logTarget(event, player) {
            return game.filterPlayer(i => i != player && i.hasCards("he"))
                .sortBySeat(player);
        },
        async content(event, trigger, player) {
            const responders = [],
                targets = event.targets;
            for (const target of targets) {
                const result = await target
                    .chooseToDiscard("he")
                    .set("prompt", `${get.translation(player)}发动了【${get.translation(event.name)}】`)
                    .set("prompt2", `你可以依次弃置一张牌并弃置${get.translation(trigger.target)}一张牌，此牌造成伤害后，${get.translation(player)}令一名本回合以此法弃置牌的角色摸一张牌`)
                    .set("ai", card => {
                        const player = get.player(),
                            trigger = get.event().getTrigger();
                        if (get.attitude(player, trigger.target) > 0) return 0;
                        if (!trigger.target.countDiscardableCards(player, "he")) return 0;
                        return 5 - get.value(card);
                    })
                    .forResult()
                if (result?.bool && result.cards?.length) {
                    responders.add(target);
                    if (trigger.target.countDiscardableCards(target, "he")) {
                        await target.discardPlayerCard(trigger.target, "he", true);
                    }
                }
            }
            if (!responders.length) return;
            player
                .when("useCardAfter")
                .then(async (event, trigger, player) => {
                    if (!player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) {
                        return;
                    }
                    if (!game.hasPlayer(target => responders.includes(target))) return;
                    const result = await player
                        .chooseTarget(`你发动了【${get.translation("mcdh_BI01201")}】`, "选择令一名角色摸一张牌", true)
                        .set("filterTarget", (card, player, target) => {
                            return get.event().responders.includes(target);
                        })
                        .set("ai", target => {
                            const player = get.player();
                            return get.effect(target, { name: "draw" }, player, player);
                        })
                        .set("responders", responders)
                        .forResult();
                    if (result?.bool && result.targets?.length) {
                        const target = result.targets[0];
                        player.line(target);
                        await target.draw();
                    }
                });
        },
    },
    mcdh_BI01202: {
        nobracket: true,
        mod: {
            targetInRange(card, player, target) {
                if (get.event().skill == "mcdh_BI01202") return true;
            },
        },
        enable: "phaseUse",
        usable: 1,
        locked: false,
        viewAs: {
            name: "sha",
        },
        filterCard(card, player) {
            return get.type(card) != "basic";
        },
        viewAsFilter(player) {
            if (!player.hasCards("hes", card => get.type(card) != "basic")) return false;
        },
        position: "hes",
        check(card) {
            var val = get.value(card);
            return 6 - val;
        },
        async precontent(event, trigger, player) {
            player.addSkill("mcdh_BI01202_effect");
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "useCardToPlayer",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    return event.card.name == "sha" && event.skill == "mcdh_BI01202";
                },
                async content(event, trigger, player) {
                    if (trigger.target.isHealthy()) await player.draw();
                    if (trigger.target.inRangeOf(player)) {
                        if (trigger.getParent().addCount !== false) {
                            trigger.getParent().addCount = false;
                            player.getStat().card.sha--;
                        }
                    }
                },
            },
        },
    },
    //阿克托斯
    mcdh_BI01301: {
        nobracket: true,
        enable: "chooseToUse",
        usable: 1,
        viewAs: {
            name: "sha",
            isCard: true,
            storage: {
                mcdh_BI01301: true,
            },
        },
        viewAsFilter(player) {
            if (!player.hasCards("h")) return false;
        },
        filterCard: () => false,
        selectCard: -1,
        log: false,
        async precontent(event, trigger, player) {
            player.logSkill("mcdh_BI01301");
            const cards = player.getCards("h");
            await player.addShownCards(cards, "visible_mcdh");
        },
        ai: {
            unequip: true,
            "unequip_ai": true,
            skillTagFilter(player, tag, arg) {
                if (tag == "unequip" && (!arg || !arg.card || !arg.card.storage || !arg.card.storage.mcdh_BI01301)) return false;
                if (tag == "unequip_ai" && (!arg || arg.name != "sha")) return false;
            },
        },
    },
    mcdh_BI01302: {
        nobracket: true,
        derivation: ["ganglie", "rewenji", "mubing"],
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        filter(event, player) {
            return player.getStorage("mcdh_BI01302").length < 3;
        },
        async content(event, trigger, player) {
            const list = ["一张牌", "1点体力上限", "有节必诛"]
                .filter(info => !player.getStorage(event.name).includes(info));
            if (!player.hasCards("h")) list.remove("一张牌");
            if (!player.hasSkill("mcdh_BI01301", null, false, false)) list.remove("有节必诛");
            if (!list.length) return;
            const { control } = await player
                .chooseControl(list)
                .set("prompt", `你发动了【${get.translation(event.name)}】`)
                .set("prompt2", `请选择将以下一项交给一名其他角色`)
                .set("ai", () => {
                    let controls = get.event().controls;
                    return controls[controls.length - 1];
                })
                .forResult();
            const { bool, targets } = await player
                .chooseTarget(`扶植圣女：选择将${control}交给一名其他角色`, lib.filter.notMe, true)
                .set("ai", target => {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
            if (!bool) return;
            const target = targets[0];
            player.line(target);
            player.markAuto(event.name, [control]);
            switch (control) {
                case "一张牌": {
                    if (player.hasCards("he")) {
                        await player.chooseToGive(target, "he", true);
                    }
                }
                    break;
                case "1点体力上限": {
                    await player.loseMaxHp();
                    await target.gainMaxHp();
                }
                    break;
                default: {
                    await player.removeSkills("mcdh_BI01301");
                    await target.addSkills("mcdh_BI01301");
                }
                    break;
            }
            const skills = get.info(event.name).derivation;
            const index = player.getStorage(event.name).length - 1;
            await player.addSkills(skills[index]);
        },
    },
    //瓦莱斯
    mcdh_BI01401: {
        nobracket: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        popup: false,
        filter(event, player) {
            return game.hasPlayer(target => {
                return target.countMark("mcdh_BI01401_mark") >= get.character(target.name, 2);
            });
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt(event.skill), "令一名至少拥有X枚「仇毒」的角色失去所有体力（X为其武将的初始体力值），当其脱离濒死状态后，移除其所有「仇毒」标记且其不会再获得「仇毒」标记。", (card, player, target) => {
                    return target.countMark("mcdh_BI01401_mark") >= get.character(target.name, 2);
                })
                .set("ai", target => {
                    const player = get.player();
                    return get.effect(target, { name: "losehp" }, player, player) * target.getHp();
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            await target.loseHp(target.hp);
            if (
                game.getGlobalHistory("everything", evt => {
                    return evt.name == "dying" && evt.getParent(event.name) == event && evt.player == target;
                }).length
            ) {
                target.setStorage("mcdh_BI01401_add", true);
                if (target?.isIn()) target.clearMark("mcdh_BI01401_mark");
            }
        },
        group: "mcdh_BI01401_add",
        subSkill: {
            mark: {
                mark: true,
                marktext: "仇毒",
                intro: {
                    name: "仇毒",
                    content: "mark",
                },
            },
            add: {
                trigger: {
                    global: ["gainAfter", "loseAsyncAfter"],
                },
                forced: true,
                locked: false,
                getIndex(event, player) {
                    return game
                        .filterPlayer(target => {
                            return event?.getg?.(target)?.length;
                        })
                        .sortBySeat();
                },
                filter(event, player, triggername, target) {
                    if (target == _status.currentPhase || target == player) {
                        return false;
                    }
                    return !target.storage.mcdh_BI01401_add;
                },
                logTarget: (event, player, triggername, target) => target,
                async content(event, trigger, player) {
                    const cards = trigger.getg(trigger.player);
                    trigger.player.addMark("mcdh_BI01401_mark", cards.length);
                },
            },
        },
    },
    mcdh_BI01402: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filterCard(card) {
            return card.name == "shan" || get.type(card) == "equip";
        },
        check(card) {
            return 8 - get.value(card);
        },
        position: "he",
        filterTarget: lib.filter.notMe,
        async content(event, trigger, player) {
            const target = event.target;
            const cards = target.getCards("h", "sha");
            if (cards.length) {
                await target.discard(cards);
                await target.draw(cards.length);
            }
            const card = new lib.element.VCard({ name: "juedou" });
            if (player.canUse(card, target)) {
                await player.useCard(card, target);
                await game.delay();
            }
        },
        ai: {
            order() {
                return get.order({ name: "juedou" }) + 0.1;
            },
            result: {
                target(player, target) {
                    return get.effect(target, { name: "juedou" }, player);
                },
            },
        },
    },
    //古罗
    mcdh_BI01501: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        viewAs: {
            name: "juedou",
            isCard: true,
        },
        filterCard: () => false,
        selectCard: -1,
        log: false,
        async content(event, trigger, player) {
            player.logSkill("mcdh_BI01501");
            if (player.canMoveCard()) await player.moveCard();
            player
                .when("useCardAfter")
                .filter(evt => evt.skill == "mcdh_BI01501")
                .then(async (event, trigger, player) => {
                    if (!player.hasHistory("damage", evt => evt.card == trigger.card)) return;
                    const targets = trigger.targets.filter(target => target.hasHistory("sourceDamage", evt => evt.card == trigger.card));
                    for (const target of targets) {
                        if (target.canMoveCard()) {
                            await target.moveCard();
                        }
                    }
                });
        },
    },
    mcdh_BI01502: {
        nobracket: true,
        trigger: {
            player: "damageEnd",
        },
        filter(event, player) {
            return _status.currentPhase == player && player.hp >= 0;
        },
        check(event, player) {
            return !player.hasCard(card => {
                return player.hasUseTarget(card, true, true);
            }, "hs");
        },
        async content(event, trigger, player) {
            const num = player.hp + 1;
            await player.draw(num);
            player.addTempSkill("mcdh_BI01502_effect");
        },
        subSkill: {
            effect: {
                mod: {
                    cardEnabled: () => false,
                    cardSavable: () => false,
                },
                charlotte: true,
                mark: true,
                marktext: "修",
                intro: {
                    content: "本回合你不能使用牌",
                },
            },
        },
    },
    //莫希
    mcdh_BI01601: {
        nobracket: true,
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        locked: true,
        filter(event, player) {
            return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(`你发动了【${get.translation(event.skill)}】`, get.skillInfoTranslation(event.skill), lib.filter.notMe, true)
                .set("ai", function (target) {
                    let att = get.attitude(_status.event.player, target);
                    if (att > 0) {
                        return att + 1;
                    }
                    if (att == 0) {
                        return Math.random();
                    }
                    return att;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const [target] = event.targets;
            player.addSkill("mcdh_BI01601_effect");
            player.setStorage("mcdh_BI01601_effect", target);
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "phaseDrawEnd",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    return player.hasCards("h") && player.storage.mcdh_BI01601_effect?.isIn();
                },
                logTarget(event, player) {
                    return player.storage.mcdh_BI01601_effect;
                },
                async content(event, trigger, player) {
                    const hs = player.getCards("h");
                    if (!hs.length) {
                        return;
                    }
                    const source = player.storage.mcdh_BI01601_effect;
                    const num = player.getAllHistory("useSkill", evt => evt.skill == "mcdh_BI01602").length;
                    if (num >= hs.length) {
                        const next = player.chooseToUse();
                        next.set("openskilldialog", `###${get.prompt("mcdh_BI01601")}###将一张牌当任意基本牌或普通锦囊牌使用。`);
                        next.set("norestore", true);
                        next.set("_backupevent", "mcdh_BI01601_use");
                        next.set("addCount", false);
                        next.set("custom", {
                            add: {},
                            replace: { window() { } },
                        });
                        next.backup("mcdh_BI01601_use");
                        await next;
                        return;
                    }
                    const cards = hs.randomGets(hs.length - num);
                    const result = await source
                        .chooseButtonTarget({
                            forced: true,
                            createDialog: [get.translation(event.name), cards],
                            filterButton(button) {
                                const source = get.player(),
                                    player = get.owner(button.link);
                                var card = button.link;
                                if (get.type(card, player) == "equip") {
                                    return false;
                                }
                                var cardx = {
                                    name: get.name(card, get.owner(card)),
                                    nature: get.nature(card, get.owner(card)),
                                    cards: [card],
                                };
                                return source.hasUseTarget(cardx, null, false) || player.hasUseTarget(cardx, null, false);
                            },
                            filterTarget(card, player, target) {
                                const source = get.player();
                                card = ui.selected.buttons[0].link;
                                player = get.owner(card);
                                var cardx = {
                                    name: get.name(card, get.owner(card)),
                                    nature: get.nature(card, get.owner(card)),
                                    cards: [card],
                                };
                                if (target == player && player.hasUseTarget(cardx, null, false)) {
                                    return true;
                                }
                                return target == source && source.hasCards("he") && source.hasUseTarget(cardx, null, false);
                            },
                            ai1(button) {
                                const player = get.player();
                                return player.getUseValue(button.link) + 1;
                            },
                            ai2(target) {
                                const player = get.player();
                                return get.attitude(player, target);
                            },
                        })
                        .forResult();
                    if (result.bool && result.links?.length && result.targets?.length) {
                        const {
                            links: [card],
                            targets: [target],
                        } = result;
                        if (target == source) {
                            const result2 = await source
                                .chooseToGive(player, "he", `选择交给${get.translation(player)}一张牌并使用${get.translation(card)}`)
                                .set("ai", card => {
                                    return 7 - get.value(card);
                                })
                                .forResult();
                            if (!result2?.bool || !result2.cards?.length) {
                                return;
                            }
                        }
                        const cardx = {
                            name: get.name(card, get.owner(card)),
                            nature: get.nature(card, get.owner(card)),
                            cards: [card],
                        };
                        const next = target.chooseUseTarget(cardx, [card], true, false);
                        if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
                            next.viewAs = false;
                        }
                        await next;
                    }
                },
            },
            use: {
                enable: "chooseToUse",
                filter(event, player) {
                    if (!player.hasCards("he")) {
                        return false;
                    }
                    return get
                        .inpileVCardList(info => {
                            const name = info[2], nature = info[3];
                            return ["basic", "trick"].includes(get.type(name));
                        })
                        .some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
                },
                chooseButton: {
                    dialog(event, player) {
                        const list = get
                            .inpileVCardList(info => {
                                const name = info[2], nature = info[3];
                                return ["basic", "trick"].includes(get.type(name));
                            })
                            .filter(card => event.filterCard(get.autoViewAs({ name: card[2] }, "unsure"), player, event));
                        const dialog = ui.create.dialog(get.translation("mcdh_BI01601_use"), [list, "vcard"]);
                        dialog.direct = true;
                        return dialog;
                    },
                    check(button) {
                        const player = get.player();
                        return player.getUseValue({ name: button.link[2] }) + 1;
                    },
                    backup(links, player) {
                        return {
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                            },
                            filterCard: true,
                            position: "he",
                            ai1(card) {
                                const player = get.player();
                                const name = get.card().name;
                                if (card.name == name) {
                                    return 0;
                                }
                                return 8 - get.value(card);
                            },
                            popname: true,
                            log: false,
                        };
                    },
                    prompt(links, player) {
                        return "将一张牌当作" + get.translation(links[0][2]) + "使用";
                    },
                },
                hiddenCard(player, name) {
                    if (!player.hasCards("he")) {
                        return false;
                    }
                    return ["basic", "trick"].includes(get.type(name));
                },
                ai: {
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player) {
                        if (!player.hasCards("he")) {
                            return false;
                        }
                    },
                    order: 7,
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
            use_backup: {},
        },
    },
    mcdh_BI01602: {
        nobracket: true,
        enable: "phaseUse",
        filter(event, player) {
            return player.hasCards('he', { type: "equip" });
        },
        filterCard: {
            type: "equip",
        },
        position: "he",
        check(card) {
            return 7 - get.value(card);
        },
        content() { },
        ai: {
            combo: "mcdh_BI01601",
            order: 1,
            result: {
                player(player) {
                    if (!player.hasSkill("mcdh_BI01601_effect")) {
                        return 0;
                    }
                    const source = player.storage.mcdh_BI01601_effect;
                    if (!source?.isIn()) {
                        return 0;
                    }
                    return get.attitude(player, source) > 0 ? 0 : 1;
                },
            },
        },
    },
    //切斯特
    mcdh_BI01701: {
        nobracket: true,
        derivation: "zhongzuo",
        trigger: {
            player: "phaseUseBegin",
        },
        popup: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", function (target) {
                    return get.attitude(_status.event.player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const result = await target.choosePlayerCard(player, "h", true).forResult();
            if (result.bool && result.cards?.length) {
                await player.showCards(result.cards);
                if (get.number(result.cards[0]) < game.countPlayer()) {
                    await player.addTempSkills("zhongzuo", { player: "phaseBegin" });
                }
                else {
                    await player.draw(2);
                    player.addTempSkill(event.name + "_debuff");
                    player.addMark(event.name + "_debuff", 1, false)
                }
            }
        },
        subSkill: {
            debuff: {
                charlotte: true,
                onremove: true,
                mod: {
                    maxHandcard(player, num) {
                        return num - player.countMark("mcdh_BI01701_debuff");
                    },
                },
            },
        },
    },
    mcdh_BI01702: {
        nobracket: true,
        trigger: {
            player: "loseAfter",
            global: "loseAsyncAfter",
        },
        filter(event, player) {
            if (event.type !== "discard") {
                return false;
            }
            const evt = event.getParent("phaseDiscard");
            const evt2 = event.getl(player);
            return evt?.name === "phaseDiscard" && evt?.player === player && evt2?.cards2?.filterInD("d");
        },
        async content(event, trigger, player) {
            const cards = trigger.getl(player).cards2.filterInD("d");
            const hs = player.getCards("h");
            if (!hs.length) {
                return;
            }
            const next = player.chooseToMove("百举百全：是否交换弃置牌和手牌？");
            next.set("list", [
                ["弃置牌", cards],
                ["手牌区", hs],
            ]);
            next.set("filterMove", function (from, to) {
                return typeof to != "number";
            });
            next.set("processAI", function (list) {
                const player = _status.event.player,
                    cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
                        return get.value(a) - get.value(b);
                    }),
                    cards2 = cards.splice(0, player.getExpansions("zhengrong").length);
                return [cards2, cards];
            });
            const result = await next.forResult();
            if (result.bool) {
                const pushs = result.moved[0],
                    gains = result.moved[1];
                pushs.removeArray(cards);
                gains.removeArray(player.getCards("h"));
                if (pushs.length && pushs.length == gains.length) {
                    await player.loseToDiscardpile(pushs);
                    await player.gain(gains, "gain2", "log");
                }
                const cards = pushs.filterInD("d");
                if (cards.length && game.hasPlayer(target => target != player)) {
                    const result = await player
                        .chooseTarget(`令一名其他角色获得你弃置的牌(${get.translation(cards)})`, lib.filter.notMe, true)
                        .set("ai", target => {
                            const { player, cards } = get.event();
                            let att = get.attitude(player, target);
                            if (att < 3) {
                                return 0;
                            }
                            if (target.hasSkillTag("nogain")) {
                                att /= 10;
                            }
                            if (target.hasJudge("lebu")) {
                                att /= 5;
                            }
                            if (target.hasSha() && cards.some(card => card.name == "sha")) {
                                att /= 5;
                            }
                            if (target.needsToDiscard(1) && cards.some(card => card.name == "wuxie")) {
                                att /= 5;
                            }
                            return att / (1 + get.distance(player, target, "absolute"));
                        })
                        .set("cards", cards)
                        .forResult();
                    if (result.bool && result.targets?.length) {
                        const target = result.targets[0];
                        await target.gain(cards, "gain2").set("giver", player);
                    }
                }
            }
        },
    },
    //恩希欧迪斯
    mcdh_BI01801: {
        nobracket: true,
        trigger: {
            player: "phaseUseBegin",
        },
        popup: false,
        filter(event, player) {
            return player.hasCards("h");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCardTarget({
                    prompt: get.prompt2(event.skill),
                    selectCard: () => {
                        return [1, game.countPlayer()];
                    },
                    filterCard: true,
                    selectTarget: () => {
                        return ui.selected.cards.length;
                    },
                    filterTarget: (card, player, target) => {
                        return target.hasCards("he");
                    },
                    complexTarget: true,
                    complexSelect: true,
                    ai1(card) {
                        if (card.name == 'du') return 10;
                        else if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                        var player = _status.event.player;
                        if (!game.hasPlayer(function (current) {
                            return get.attitude(player, current) > 0 && !current.hasSkillTag('nogain');
                        })) return 0;
                        return 1 / Math.max(0.1, get.value(card));
                    },
                    ai2(target) {
                        var player = _status.event.player, att = get.attitude(player, target);
                        if (ui.selected.cards[0].name == 'du') return -att;
                        if (target.hasSkillTag('nogain')) att /= 6;
                        return att;
                    },
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.logSkill(event.name, event.targets);
            await player.showCards(event.cards);
            const num = event.cards.length;
            const cards = event.cards;
            await player.lose(cards, ui.ordering, "visible")
            player
                .when("phaseDiscardBegin")
                .then(async () => {
                    const result = await player
                        .chooseCard(`你可以重铸${get.cnNumber(num)}张牌`, "he", num, lib.filter.cardRecastable)
                        .forResult();
                    if (result.bool) {
                        await player.recast(result.cards);
                    }
                });
            var dialog = ui.create.dialog("周旋与礼", cards, true);
            _status.dieClose.push(dialog);
            dialog.videoId = lib.status.videoId++;
            game.addVideo("cardDialog", null, ["周旋与礼", get.cardsInfo(cards), dialog.videoId]);
            var preResult = dialog.videoId;
            event.preResult = preResult;
            game.broadcast(function (cards, id) {
                var dialog = ui.create.dialog("周旋与礼", cards, true);
                _status.dieClose.push(dialog);
                dialog.videoId = id;
            }, cards, dialog.videoId);
            for (const target of event.targets) {
                for (let i = 0; i < ui.dialogs.length; i++) {
                    if (ui.dialogs[i].videoId == event.preResult) {
                        dialog = ui.dialogs[i]; 
                        break;
                    }
                }
                event.dialog = dialog;
                if (!event.dialog || event.dialog.buttons.length === 0|| !target.hasCards("he")) {
                    continue;
                }
                if (target == player) {
                    event.result = { bool: true };
                } else {
                    event.result = await target
                        .chooseToGive(player, "he", true)
                        .set("prompt", `###${get.translation(player)}发动了【周旋与礼】###选择交给其一张牌并获得一张展示牌。`)
                        .forResult();
                }
                if (event.result?.bool) {
                    if (event.dialog.buttons.length > 1) {
                        var next = target.chooseButton(true);
                        next.set("ai", button => {
                            return get.value(button.link, _status.event.player);
                        });
                        next.set("dialog", event.preResult);
                        next.set("closeDialog", false);
                        next.set("dialogdisplay", true);
                        event.result = await next.forResult();
                    } else {
                        event.result = { bool: true, links: event.dialog.buttons.reduce((list, button) => list.add(button.link), []) };
                    }
                    if (event.result?.bool && event.result.links?.length) {
                        var dialog = event.dialog;
                        var card = event.result.links[0];
                        var button;
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            if (dialog.buttons[i].link === card) {
                                button = dialog.buttons[i];
                                const innerHTML = target.getName(true);
                                game.createButtonCardsetion(innerHTML, button);
                                dialog.buttons.remove(button);
                                break;
                            }
                        }
                        var capt = "周旋与礼";
                        if (card) {
                            await target.gain(card, "gain2");
                            game.broadcast(
                                function (card, id, name, capt) {
                                    var dialog = get.idDialog(id);
                                    if (dialog) {
                                        dialog.content.firstChild.innerHTML = capt;
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.buttons[i].link === card) {
                                                game.createButtonCardsetion(name, dialog.buttons[i]);
                                                dialog.buttons.splice(i--, 1);
                                                break;
                                            }
                                        }
                                    }
                                },
                                card,
                                dialog.videoId,
                                target.getName(true),
                                capt
                            );
                        }
                        dialog.content.firstChild.innerHTML = capt;
                        game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
                        game.log(target, "选择了", button.link);
                        await game.delay();
                    }
                }
            }
            for (var i = 0; i < ui.dialogs.length; i++) {
                if (ui.dialogs[i].videoId === event.preResult) {
                    var dialog = ui.dialogs[i];
                    dialog.close();
                    _status.dieClose.remove(dialog);
                    break;
                }
            }
            game.broadcast(function (id) {
                var dialog = get.idDialog(id);
                if (dialog) {
                    dialog.close();
                    _status.dieClose.remove(dialog);
                }
            }, event.preResult);
            game.addVideo("cardDialog", null, event.preResult);
        },
    },
    mcdh_BI01802: {
        nobracket: true,
        trigger: {
            global: "phaseJieshuBegin",
        },
        locked: true,
        filter(event, player) {
            if (event.player == player || player.hasHistory("damage")) {
                return false;
            }
            if (!game.hasPlayer(target => target.hasHistory("damage"))) {
                return false;
            }
            return get.discarded().filterInD("d").length;
        },
        async cost(event, trigger, player) {
            const cards = get.discarded().filterInD("d");
            if (!cards.length) {
                return;
            }
            if (cards.length == 1) {
                event.result = { bool: true, links: cards };
            } else {
                event.result = await player
                    .chooseCardButton(get.translation(event.skill), cards, true)
                    .set("ai", button => {
                        return get.value(button.link, get.player());
                    })
                    .forResult();
            }
            if (event.result?.bool && event.result.links?.length) {
                event.result.cards = event.result.links;
            }
        },
        async content(event, trigger, player) {
            const cards = event.cards.filterInD("d");
            if (!cards.length) {
                return;
            }
            await player.gain(cards, "gain2");
        },
    },
    //诺希斯
    mcdh_BI01901: {
        nobracket: true,
        trigger: {
            global: ["gainAfter", "loseAsyncAfter"],
        },
        usable: 1,
        getIndex(event, player) {
            return game.filterPlayer(target => {
                if (target == player || target == _status.currentPhase) {
                    return false;
                }
                const evt = event.getParent("phaseDraw");
                if (evt?.player == target) {
                    return false;
                }
                return event.getg(target).length > 1;
            });
        },
        filter(event, player, name, target) {
            return target?.isIn() && target.hasCards("h");
        },
        logTarget(event, player, name, target) {
            return target;
        },
        check(event, player, name, target) {
            if (target.countCards("h") < 2) {
                return false;
            }
            return get.attitude(player, target) <= 0;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            const cards = player.getCards("h");
            const cards2 = target.getCards("h");
            if (!cards.length) {
                await player.viewHandcards(target);
                return;
            } else if (!cards2.length) {
                await target.viewHandcards(player);
                return;
            }
            const list = lib.suit.slice().filter(suit => {
                return cards.some(card => get.suit(card, player) == suit) && cards2.some(card => get.suit(card, target) == suit);
            });
            if (!list.length) {
                return;
            }
            const dialog = ["博文才智：交换一种花色的所有牌"];
            dialog.push('<div class="text center">' + get.translation(player) + "的手牌</div>");
            dialog.push(cards);
            dialog.push('<div class="text center">' + get.translation(target) + "的手牌</div>");
            dialog.push(cards2);
            const result = await player
                .chooseControl(list)
                .set("dialog", dialog)
                .set("ai", () => {
                    return _status.event.control;
                })
                .set(
                    "control",
                    (() => {
                        let getv = cards => cards.map(i => get.value(i)).reduce((p, c) => p + c, 0);
                        return list.sort((a, b) => {
                            return getv(target.getCards("h", { suit: b })) - getv(target.getCards("h", { suit: a }));
                        })[0];
                    })()
                )
                .forResult();
            if (result?.control) {
                const getC = current => {
                    return current.getCards("h", { suit: result.control });
                };
                await player.swapHandcards(target, getC(player), getC(target));
            }
        },
        ai: {
            expose: 0.5,
        },
    },
    mcdh_BI01902: {
        nobracket: true,
        trigger: {
            player: "damageEnd",
        },
        usable: 1,
        filter(event, player) {
            return event.source?.isIn();
        },
        logTarget: "source",
        async content(event, trigger, player) {
            const target = event.targets[0];
            const result = await target
                .chooseControl("你摸一张牌并令其回复1点体力", "你摸两张牌")
                .set("prompt", `###${get.translation(player)}对你发动了【${get.translation(event.name)}】###请选择执行一项`)
                .set("ai", () => {
                    const source = get.player(),
                        player = get.event().getTrigger().player;
                    const att = get.attitude(source, player);
                    if (att <= 0) {
                        return 1;
                    }
                    if (player.isHealthy()) {
                        return 1;
                    }
                    return 0;
                })
                .forResult();
            if (result.index == 0) {
                await target.draw();
                await player.recover();
            } else {
                await target.draw(2);
            }
        },
    },
    //麒麟R夜刀
    mcdh_CF00101: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: ["useCardAfter", "respondAfter"]
        },
        filter(event, player) {
            if (_status.currentPhase != player || _status.dying?.length) {
                return false;
            }
            return player.mcdh_countCharge() >= player.getHistory(event.name).length;
        },
        async content(event, trigger, player) {
            const num = player.getHistory(trigger.name).length;
            const use = (num == player.mcdh_countCharge());
            await player.mcdh_removeCharge(num);
            const cards = get.cards(num);
            await game.cardsGotoOrdering(cards);
            await player.showCards(cards);
            const list = get.addNewRowList(cards, "color");
            const result = await player
                .chooseButton(
                    [
                        [
                            [[`###乘势连击###获得其中一种颜色的牌`], "addNewRow"],
                            [
                                dialog => {
                                    dialog.forcebutton = false;
                                    dialog._scrollset = false;
                                    dialog.css({
                                        top: "20%",
                                    });
                                },
                                "handle",
                            ],
                            list.map(item => [Array.isArray(item) ? item : [item], "addNewRow"]),
                        ],
                    ],
                )
                .set("filterButton", button => {
                    return button.links.length;
                })
                .set("ai", button => {
                    return button.links.length;
                })
                .forResult();
            if (result.bool && result.links?.length) {
                const gains = cards.filter(card => get.color(card, false) == result.links[0]);
                cards.removeArray(gains);
                await player.gain(gains, "gain2");
            }
            if (use && cards.length) {
                const card = get.autoViewAs({ name: "sha" }, cards);
                if (player.hasUseTarget(card, true, false)) {
                    await player.chooseUseTarget(`请选择使用${get.translation(card)}(${get.translation(cards)})的目标`, card, cards, false);
                }
            }
        },
    },
    mcdh_CF00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "useCardEnd",
        },
        filter(event, player) {
            return player.hasCard(card => lib.filter.cardRecastable(card, player, "mcdh_CF00102"), "he");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCard(get.prompt2(event.skill), "he", lib.filter.cardRecastable)
                .set("ai", card => {
                    const player = get.player();
                    return 7 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            await player.recast(event.cards);
        },
    },
    //火龙S黑角
    mcdh_CF00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "shaMiss",
        },
        filter(event, player) {
            if (event.type != "card") {
                return false;
            }
            return player == event.target && player.canUse({ name: "guohe", isCard: true }, event.player);
        },
        logTarget: "player",
        async content(event, trigger, player) {
            await player.useCard({ name: "guohe", isCard: true }, trigger.player);
        },
        group: "mcdh_CF00201_charge",
        subSkill: {
            charge: {
                trigger: {
                    player: "useCard",
                },
                forced: true,
                filter(event, player) {
                    return get.color(event.card) == "none";
                },
                async content(event, trigger, player) {
                    player.mcdh_addCharge();
                },
            },
        },
    },
    mcdh_CF00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseUseBegin",
        },
        popup: false,
        filter(event, player) {
            return player.countCards("h") > 0 && game.hasPlayer(function (current) {
                return current != player && player.canCompare(current);
            });
        },
        async cost(event, trigger, player) {
            var goon = player.hasCard(function (card) {
                return (card.number >= 9 && get.value(card) <= 5) || get.value(card) <= 3;
            }, "h");
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), function (card, player, target) {
                    return player.canCompare(target);
                })
                .set("ai", target => {
                    var player = _status.event.player;
                    if (_status.event.goon && get.attitude(player, target) < 0) {
                        return get.effect(target, { name: "sha" }, player, player);
                    }
                    return 0;
                })
                .set("goon", goon)
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const result = await player.chooseToCompare(target).forResult();
            const num = player.mcdh_countCharge() - 1;
            if (num > 0) await player.draw(num);
            if (!result.bool) {
                player.mcdh_removeCharge();
            }
            var cards = [result.player, result.target].filterInD("d");
            if (!cards.length) return;
            const winner = result.bool ? player : target;
            const loser = result.bool ? target : player;
            const card = get.autoViewAs({ name: "sha" }, cards);
            await winner.useCard(card, cards, loser);
        },
    },
    //泰拉调查团
    mcdh_CF00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "damageEnd",
        },
        async content(event, trigger, player) {
            const result = await player
                .judge(card => {
                    if (get.color(card) == "red") {
                        if (!game.hasPlayer(target => target.hasCards("ej"))) return 0;
                    }
                    return 2;
                })
                .set("judge2", result => result.bool)
                .forResult();
            if (result.bool) {
                const prompt = `你发动了【${get.translation(event.name)}】`;
                const prompt2 = "选择一名角色" + (result.color == "black" ? "其复原武将牌并摸两张牌" : "其获得场上的一张牌");
                const result2 = await player
                    .chooseTarget(prompt, prompt2, true)
                    .set("ai", target => {
                        let player = get.player();
                        let color = get.event().color;
                        let att = get.attitude(player, target);
                        if (color == "black") {
                            if (target.isLinked()) eff += 1;
                            if (target.isTurnedOver()) eff += 4;
                        }
                        return att;
                    })
                    .set("color", result.color)
                    .forResult();
                if (result2.bool && result2.targets.length) {
                    const target = result2.targets[0];
                    player.line(target);
                    if (result.color == "black") {
                        target.link(false);
                        target.turnOver(false);
                        await target.draw(2);
                    } else if (game.hasPlayer(function (current) {
                        return current.countGainableCards(target, "ej") > 0;
                    })) {
                        const result3 = await target
                            .chooseTarget("请选择一名角色，获得其装备区或判定区内的一张牌", true, function (card, player, target) {
                                return target.countGainableCards(player, "ej") > 0;
                            })
                            .set("ai", function (target) {
                                var player = _status.event.player;
                                var att = get.attitude(player, target);
                                if (att > 0 && target.hasCards("ej", function (card) {
                                    return get.position(card) == "j" || get.value(card, target) <= 0;
                                })) return 2 * att;
                                else if (att < 0 && target.hasCards("e", function (card) {
                                    return get.value(card, target) > 5;
                                })) return -att;
                                return -1;
                            })
                            .forResult();
                        if (result3.bool) {
                            await target.gainPlayerCard(result3.targets[0], "ej", true);
                        }
                    }
                }
            }
        },
    },
    mcdh_CF00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        enable: "chooseToUse",
        filter(event, player) {
            if (!player.hasCards("he", { color: "red" })) return false;
            if (event.type == "dying") {
                if (player == event.dying) return false;
                return true;
            }
            return false;
        },
        filterCard(card) {
            return get.color(card) == "red";
        },
        selectTarget: -1,
        filterTarget(card, player, target) {
            return target == _status.event.dying;
        },
        position: "he",
        check(card) {
            return 8 - get.value(card);
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.tempBanSkill(event.name, "roundStart", false);
            await target.recoverTo(1);
            target.turnOver();
            const result = await target
                .chooseToDiscard("你可以弃置任意张黑色牌，然后摸等量+1张牌", "he", [1, Infinity], { color: "black" })
                .set("ai", card => {
                    return 6.5 - get.value(card);
                })
                .forResult();
            if (result.bool && result.cards.length) {
                await target.draw(result.cards.length + 1);
            }
        },
        ai: {
            save: true,
            skillTagFilter(player, tag, target) {
                return player != target;
            },
            order: 1,
            result: {
                target(player, target) {
                    if (get.attitude(player, target) < 4) {
                        return 0;
                    }
                    return target.isTurnedOver() ? 4 : 2;
                },
            },
        },
    },
    //柏生义冈
    mcdh_CF00401: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        mod: {
            cardname(card, player, name) {
                if (card.name == "sha" && get.suit(card) == "club") return "shan";
            },
        },
        trigger: {
            player: "useCardAfter",
        },
        forced: true,
        filter(event, player) {
            return get.is.damageCard(event.card);
        },
        async content(event, trigger, player) {
            await player.recover();
        },
        ai: {
            effect: {
                player_use(card, player, target) {
                    if (get.tag(card, "damage") > 0.5 && player.isDamaged()) return [1, 1];
                },
            },
        },
    },
    mcdh_CF00402: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "recoverAfter",
        },
        forced: true,
        filter(event, player) {
            return player.isHealthy();
        },
        async content(event, trigger, player) {
            await player.loseHp();
            await player.draw(2);
        },
    },
    //利藤裕
    mcdh_CF00501: {
        nobracket: true,
        trigger: {
            player: "phaseJieshuBegin",
        },
        filter(event, player) {
            if (player.countCards("he") < 2) {
                return false;
            }
            return player.getHistory("gain", evt => evt.cards).reduce((sum, evt) => sum + evt.cards.length, 0) >= 3;
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToMove("埋祸于暗：将两张牌以任意顺序置入牌堆底并摸三张牌")
                .set("list", [
                    ["你的牌", player.getCards("he")],
                    ["牌堆底"],
                ])
                .set("filterMove", function (from, to, moved) {
                    if (to == 1 && moved[1].length >= 2) return false;
                    return true;
                })
                .set("filterOk", function (moved) {
                    return moved[1].length == 2;
                })
                .set("processAI", function (list) {
                    var cards = list[0][1].slice(0).sort(function (a, b) {
                        return get.value(b) - get.value(a);
                    });
                    return [cards, cards.splice(2)];
                })
                .forResult();
            if (event.result?.bool && event.result?.moved?.[0]?.length) {
                event.result.cards = event.result.moved[0];
            }
        },
        async content(event, trigger, player) {
            await player.loseToDiscardpile(event.cards, ui.cardPile, false, "blank").set("log", false);
            game.log(player, `将${get.cnNumber(event.cards.length)}张牌置于了牌堆底`);
            await player.draw(3);
        },
    },
    mcdh_CF00502: {
        nobracket: true,
        trigger: {
            global: "phaseUseEnd",
        },
        filter(event, player) {
            return game.hasPlayer2(function (current) {
                return current.hasHistory("useCard", function (evt) {
                    return evt.targets?.includes(player);
                });
            });
        },
        check(event, player) {
            const att = get.attitude(player, event.player);
            const color = get.color(ui.cardPile.lastChild);
            return (att > 0 && color == "red") || (att <= 0 && color == "black");
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const cards = get.bottomCards();
            await game.cardsGotoOrdering(cards);
            await trigger.player.showCards(cards);
            await trigger.player[get.color(cards[0]) == "red" ? "draw" : "loseHp"]();
        },
    },
    //泷居应
    mcdh_CF00601: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        async content(event, trigger, player) {
            const num = player.getExpansions("mcdh_CF00601").length + 1;
            const result = await player.draw(num, "bottom").forResult();
            if (get.itemtype(result.cards) != "cards") {
                return;
            }
            await player.showCards(result.cards);
            if (result.cards.every(card => get.color(card) == "red")) {
                await player.addToExpansion(get.cards(1), "giveAuto").set("gaintag", [event.name]);
            } else if (result.cards.every(card => get.color(card) == "black")) {
                if (!player.getExpansions(event.name).length) return;
                await player.loseToDiscardpile(player.getExpansions(event.name).randomGets(1));
            } else {
                if (player.hasCards("he")) {
                    await player.chooseToDiscard("he", true);
                }
                await player.damage();
            }
        },
        ai: {
            order: 1,
            result: {
                player(player) {
                    return 1;
                },
            },
        },
        marktext: "薪",
        intro: {
            content: "expansion",
            markcount: "expansion",
        },
        onremove(player, skill) {
            const cards = player.getExpansions(skill);
            if (cards.length) player.loseToDiscardpile(cards);
        },
    },
    mcdh_CF00602: {
        nobracket: true,
        trigger: {
            player: "damageEnd",
        },
        filter(event, player) {
            return player.hasCards("he");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCard(get.prompt2(event.skill), "he", [1, 2])
                .set("ai", card => {
                    return 5 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const cards = event.cards;
            await player.lose(cards, ui.cardPile);
            var shownCards = cards.filter(i => get.position(i) == "e"),
                handcardsLength = cards.length - shownCards.length;
            if (shownCards.length) {
                player.$throw(shownCards, null);
                game.log(player, "将", shownCards, "置于了牌堆底");
            }
            if (handcardsLength > 0) {
                player.$throw(handcardsLength, null);
                game.log(player, "将", get.cnNumber(handcardsLength), "张牌置于了牌堆底");
            }
            await game.delayex();
        },
    },
    //柏生明
    mcdh_CF00701: {
        nobracket: true,
        trigger: {
            player: "phaseUseBegin",
        },
        forced: true,
        async content(event, trigger, player) {
            await player.loseHp();
            const result = await player
                .chooseControl()
                .set("choiceList", [
                    "你可以令本回合使用的第一张【杀】不可被响应且此【杀】结算后你结束此阶段",
                    "令所有攻击范围含有你的角色成为【杀】的目标时，可以交给你一张牌，将此【杀】转移给你"
                ])
                .set("ai", () => {
                    const player = get.player();
                    if (player.hp > 2 && player.hasUseTarget({ name: "sha" })) return 0;
                    if (player.hp > 2 && player.hasFriend() && player.has) return 1;
                    return get.rand(0, 1);
                })
                .forResult();
            if (result.index == 0) {
                player.addTempSkill("mcdh_CF00701_direct", "phaseUseAfter");
            }
            else {
                player.addTempSkill("mcdh_CF00701_transfer", { player: "phaseBegin" });
            }
        },
        subSkill: {
            direct: {
                trigger: {
                    player: "useCard",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    if (event.card.name != "sha") return false;
                    return player.getHistory("useCard", evt => evt.card.name == "sha").indexOf(event) == 0;
                },
                async content(event, trigger, player) {
                    trigger.directHit.addArray(game.filterPlayer());
                    player
                        .when("useCardAfter")
                        .filter(event => event.card == trigger.card)
                        .then(() => {
                            for (var phase of lib.phaseName) {
                                var evt = event.getParent(phase);
                                if (evt && evt.name == phase) {
                                    var name = lib.phaseName2[lib.phaseName.indexOf(phase)];
                                    game.log(player, "令", _status.currentPhase, "结束了" + name + "阶段");
                                    evt.skipped = true;
                                }
                            }
                        });
                },
            },
            transfer: {
                charlotte: true,
                mark: true,
                intro: {
                    content: "直到你的下一个回合开始，令所有攻击范围含有你的角色成为【杀】的目标时，可以交给你一张牌，将此【杀】转移给你",
                },
                trigger: {
                    global: "useCardToTarget",
                },
                filter(event, player) {
                    if (event.card.name != "sha" || !player.inRangeOf(event.target)) {
                        return false;
                    }
                    return lib.filter.targetEnabled(event.card, event.player, player);
                },
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseCardTarget({
                            prompt: `是否响应${get.translation(player)}的【${get.translation(event.skill)}】？`,
                            prompt2: "交给攻击范围内的一名其他角色一张牌，并将此【杀】转移给其",
                            position: "he",
                            filterTarget(card, player, target) {
                                const source = get.event().source;
                                const trigger = get.event().getTrigger();
                                if (target != source) {
                                    return false;
                                }
                                return lib.filter.targetEnabled(trigger.card, trigger.source, target);
                            },
                            ai1(card) {
                                return get.unuseful(card) + 9;
                            },
                            ai2(target) {
                                const player = get.player();
                                if (player.hasCards("h", "shan")) {
                                    return -get.attitude(player, target);
                                }
                                if (get.attitude(player, target) < 5) {
                                    return 6 - get.attitude(player, target);
                                }
                                if (player.hp == 1 && player.countCards("h", "shan") == 0) {
                                    return 10 - get.attitude(player, target);
                                }
                                if (player.hp == 2 && player.countCards("h", "shan") == 0) {
                                    return 8 - get.attitude(player, target);
                                }
                                return -1;
                            },
                        })
                        .set("source", player)
                        .forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    game.log(target, "响应了", player, "的", `#g【${get.translation(event.name)}】`);
                    await target.give(event.cards, player);
                    var evt = trigger.getParent();
                    evt.triggeredTargets2.remove(target);
                    evt.targets.remove(target);
                    evt.targets.push(player);
                },
            },
        },
    },
    mcdh_CF00702: {
        nobracket: true,
        enable: "chooseToUse",
        usable: 1,
        filter(event, player) {
            if (!player.hasCards("hes", { suit: "spade" })) return false;
            if (event.type == "wuxie") return false;
            for (var name of ["sha", "shan"]) {
                if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
            }
            return false;
        },
        chooseButton: {
            dialog(event, player) {
                var vcards = [];
                for (var name of ["sha", "shan"]) {
                    var card = { name: name, isCard: true };
                    if (event.filterCard(card, player, event)) vcards.push(["基本", "", name]);
                }
                var dialog = ui.create.dialog("远目且射", [vcards, "vcard"], "hidden");
                dialog.direct = true;
                return dialog;
            },
            backup(links, player) {
                return {
                    viewAs: {
                        name: links[0][2],
                        storage: {
                            mcdh_CF00702: true,
                        }
                    },
                    filterCard(card) {
                        return get.suit(card) == "spade";
                    },
                    position: "hes",
                    log: false,
                    async precontent(event, trigger, player) {
                        player.logSkill("mcdh_CF00702");
                        event.getParent().addCount = false;
                        player
                            .when("useCardAfter")
                            .filter(event => event.card.storage?.mcdh_CF00702)
                            .then(async (event, trigger, player) => {
                                if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) return;
                                const result = await player
                                    .chooseTarget("你可以令一名非当前回合角色摸一张牌", function (card, player, target) {
                                        return target != _status.currentPhase;
                                    })
                                    .set("ai", target => {
                                        return get.attitude(_status.event.player, target);
                                    })
                                    .forResult();
                                if (result.bool && result.targets.length) {
                                    const target = result.targets[0];
                                    await target.draw();
                                }
                            });
                    },
                }
            },
            prompt(links, player) {
                return "远目且射：你可以将一张黑桃牌当【" + get.translation(links[0][2]) + "】使用";
            },
        },
        ai: {
            order(item, player) {
                var player = _status.event.player;
                var event = _status.event;
                if (event.filterCard({ name: "sha" }, player, event)) {
                    if (!player.hasShan() && !game.hasPlayer(function (current) {
                        return player.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player, player) > 0;
                    })) {
                        return 0;
                    }
                    return 2.95;
                }
                else {
                    var player = _status.event.player;
                    if (player.hasSkill("qingzhong_give")) return 2.95;
                    return 3.15;
                }
            },
            respondSha: true,
            respondShan: true,
            skillTagFilter(player, tag, arg) {
                if (arg != "use") return false;
            },
            result: {
                player: 1,
            },
        },
    },
    //里昂
    mcdh_CV00401: {
        nobracket: true,
        init() {
            //本体明置牌无触发时机
            game.addGlobalSkill("mcdh_CV00401_global");
            if (_status._mcdh_addShownCards) {
                return;
            }
            game.broadcastAll(() => {
                _status._mcdh_addShownCards = true;
                lib.element.content.addShownCards = async (event, trigger, player) => {
                    await event.trigger("addShownCardsBegin");
                    const hs = player.getCards("h");
                    const showingCards = event._cards.filter((showingCard) => hs.includes(showingCard));
                    const shown = player.getShownCards();
                    for (const tag of event.gaintag) {
                        player.addGaintag(showingCards, tag);
                    }
                    if (!(event.cards = showingCards.filter((showingCard) => !shown.includes(showingCard))).length) {
                        return;
                    }
                    game.log(player, "明置了", event.cards);
                    await event.trigger("addShownCardsAfter");
                };
            });
        },
        onremove: player => {
            if (!game.hasPlayer(current => current.hasSkill("mcdh_CV00401", null, null, false), true)) {
                game.removeGlobalSkill("mcdh_CV00401_global");
            }
        },
        mod: {
            canBeGained(card, source, player) {
                if (get.is.shownCard(card)) return false;
            },
            canBeDiscarded(card, source, player) {
                if (get.is.shownCard(card)) return false;
            },
        },
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        forced: true,
        filter(event, player) {
            if (player.getShownCards().length) return false;
            const evt = event.getl(player);
            for (var i in event.gaintag_map) {
                if (event.gaintag_map[i].some(tag => tag.startsWith("visible_"))) return evt && evt.player == player && evt.hs?.length;
            }
            return false;
        },
        async content(event, trigger, player) {
            await player.loseMaxHp();
            const result = await player.draw(4).forResult();
            await player.addShownCards(result, "visible_mcdh");
        },
        group: ["mcdh_CV00401_init", "mcdh_CV00401_show"],
        subSkill: {
            global: {
                locked: false,
                mod: {
                    cardEnabled2(card, player) {
                        if (get.is.shownCard(card) && get.owner(card) != player) {
                            return false;
                        }
                    },
                },
                trigger: {
                    player: "dieAfter",
                },
                filter: (event, player) => {
                    return !game.hasPlayer(current => current.hasSkill("mcdh_CV00401", null, null, false), true);
                },
                silent: true,
                forceDie: true,
                charlotte: true,
                content: () => {
                    game.removeGlobalSkill(event.name);
                },
            },
            init: {
                trigger: {
                    player: "enterGame",
                    global: "phaseBefore",
                },
                forced: true,
                popup: false,
                filter(event, player) {
                    return (event.name != "phase" || game.phaseNumber == 0);
                },
                async content(event, trigger, player) {
                    player.useSkill("mcdh_CV00401");
                },
            },
            show: {
                trigger: {
                    player: "addShownCardsBegin",
                },
                forced: true,
                firstDo: true,
                filter(event, player) {
                    return !event.getParent().name.startsWith("mcdh_CV00401");
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                },
            },
        },
    },
    //西尔维娜
    mcdh_CV00501: {
        nobracket: true,
        trigger: {
            global: "phaseUseBegin",
        },
        filter(event, player) {
            if (event.player == player) {
                return false;
            }
            return player.hasCard(function (card) {
                return lib.filter.cardDiscardable(card, player, "mcdh_CV00501");
            }, "he");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard("he", get.prompt2(event.skill), "chooseonly")
                .set("ai", card => {
                    if (get.event().goon) {
                        return 0;
                    }
                    return 6 - get.value(card);
                })
                .set(
                    "goon",
                    (() => {
                        const att = get.attitude(player, trigger.player);
                        return att < 0;
                    })()
                )
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const cards = event.cards;
            const num = get.number(cards[0]);
            player.tempBanSkill(event.name, "roundStart");
            await player.discard(cards);
            await trigger.player.draw(3);
            trigger.player
                .when("phaseUseEnd")
                .filter(evt => evt == trigger)
                .then(async (event, trigger, player) => {
                    if (player.hasHistory("useCard", evt => evt.getParent("phaseUse") == trigger && get.number(evt.card) == num)) {
                        return;
                    }
                    await player.chooseToDiscard("he", 2, true);
                });
        },
    },
    mcdh_CV00502: {
        nobracket: true,
        trigger: {
            player: "damageEnd",
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
            if (
                player.canMoveCard(
                    null,
                    false,
                    game.filterPlayer(i => i != player),
                    player,
                )
            ) {
                event.result = await player
                    .moveCard(
                        `违心积压：将其他角色场上的牌移动至你的区域内`,
                        game.filterPlayer(i => i != player),
                        player,
                        true,
                    )
                    .forResult();
            }
            if (!event.result?.bool || get.type(event.result?.card) == "delay") {
                await player.draw();
            }
        },
    },
    //迈尔斯&本尼
    mcdh_CV00601: {
        nobracket: true,
        trigger: {
            global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
        },
        mcdhCharge: 1,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_CV00601")) {
                return false;
            }
            return event.getd()?.length;
        },
        getIndex(event, player) {
            if (event.name != "cardsDiscard") {
                return game.filterPlayer(target => {
                    return event.getd().some(card => event.getl(target)?.cards2?.includes(card));
                });
            }
            var evt = event.getParent();
            if (evt.name != "orderingDiscard") return false;
            var evtx = (evt.relatedEvent || evt.getParent());
            return game.filterPlayer(target => {
                return target.hasHistory("lose", evtxx => {
                    return evtx == (evtxx.relatedEvent || evtxx.getParent()) && evtxx.cards2?.length;
                });
            })
        },
        logTarget(event, player, name, target) {
            return target;
        },
        check(event, player, name, target) {
            return get.attitude(player, target) > 0;
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, false, false);
            player.mcdh_removeCharge();
            const target = event.targets[0];
            const cards = trigger.getd()
                .filter(card => {
                    if (trigger.name != "cardsDiscard") {
                        return trigger.getl(target).cards2.includes(card);
                    }
                    return true;
                });
            if (cards.some(card => get.type(card) == "basic")) {
                const { bool } = await player
                    .chooseBool(`你可以令${get.translation(target)}本回合使用的下一张牌无次数限制`)
                    .forResult();
                if (bool) {
                    target.addTempSkill("mcdh_CV00601_effect");
                    target.addMark("mcdh_CV00601_effect", 1, false);
                }
            }
            if (cards.some(card => get.type(card) != "basic")) {
                const { bool } = await player
                    .chooseBool(`你可以减少1点技力上限令${get.translation(target)}获得${get.translation(cards)}`)
                    .set("ai", () => {
                        return 1;
                    })
                    .forResult();
                if (bool) {
                    await target.gain(cards, "gain2");
                }
            }
            if (cards.some(card => target.hasHistory("lose", evt => {
                return Object.values(evt.gaintag_map).some(evtx => evtx.some(tag => tag.startsWith("visible_")));
            }))) {
                const { bool } = await player
                    .chooseBool(`你可以失去${get.poptip("mcdh_CV00601")}令${get.translation(target)}摸三张牌`)
                    .set("ai", () => {
                        const { player, target } = get.event();
                        const att = get.attitude(player, target);
                        if (target !== _status.currentPhase || att <= 0) {
                            return false;
                        }
                        return get.effect(target, { name: "wuzhong" }, player, player) > 2;
                    })
                    .set("target", target)
                    .forResult();
                if (bool) {
                    await player.removeSkills("mcdh_CV00601");
                    await target.draw(3);
                }
            }
        },
        subSkill: {
            effect: {
                mod: {
                    cardUsable: () => Infinity,
                },
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                charlotte: true,
                onremove: true,
                popup: false,
                firstDo: true,
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
                mark: true,
                intro: {
                    content: "使用下一张牌无次数限制",
                },
            },
        },
    },
    mcdh_CV00602: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.mcdh_countChargeMax();
        },
        async content(event, trigger, player) {
            player.mcdh_removeChargeMax();
            await player.draw(2);
            const targets = game.filterPlayer(target => target.getShownCards().length);
            if (!targets.length) return;
            if (targets.length == 1) {
                event.result = { bool: true, targets: targets };
            }
            else {
                event.result = await player
                    .chooseTarget(`你发动了${get.translation(event.name)}`, "暗置一名角色的一至两张牌", function (card, player, target) {
                        return get.event().targets.includes(target);
                    })
                    .set("ai", target => {
                        return 1 + Math.random();
                    })
                    .set("targets", targets)
                    .forResult()
            }
            if (event.result?.targets?.length) {
                const target = event.result.targets[0];
                player.line(target);
                const result = await player
                    .choosePlayerCard(target, "h", [1, 2], true)
                    .set("prompt", get.translation(event.name))
                    .set("prompt2", `暗置${get.translation(target)}的一至两张牌`)
                    .set("filterButton", button => {
                        return get.is.shownCard(button.link);
                    })
                    .forResult();
                if (result?.bool && result?.links?.length) {
                    await target.hideShownCards(result.links);
                }
            }
        },
        ai: {
            order: 1,
            result: {
                player: 1,
            },
        },
    },
    //克洛丝
    mcdh_WR00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "phaseUseBegin",
        },
        filter(event, player) {
            return player.hasCards("he", card => lib.filter.cardDiscardable(card, player, "mcdh_WR00301"));
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill), "he", 2, "chooseonly")
                .set("ai", card => {
                    const player = get.player();
                    if (player.needsToDiscard()) {
                        return 9 - get.value(card);
                    }
                    return 7 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            await player.discard(event.cards);
            const result = await player.draw(2).forResult();
            if (get.itemtype(result.cards) == "cards") {
                player.addShownCards(result.cards, "visible_mcdh");
            }
        },
    },
    mcdh_WR00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        getList(player) {
            return lib.inpile.filter(name => {
                if (!["basic", "trick"].includes(get.type(name))) return false;
                return player.getShownCards().some(card => get.name(card) == name);
            });
        },
        trigger: {
            player: "phaseUseEnd",
        },
        filter(event, player) {
            if (!player.getShownCards().length) {
                return false;
            }
            const list = get.info("mcdh_WR00302").getList(player);
            return list.some(name => player.hasUseTarget({ name: name }));
        },
        async cost(event, trigger, player) {
            const list = get
                .inpileVCardList(info => {
                    const name = info[2], nature = info[3];
                    return get.info(event.skill).getList(player).includes(name);
                });
            if (!list.length) {
                return;
            }
            event.result = await player
                .chooseButton([get.translation(event.skill), [list, "vcard"]])
                .set("filterButton", button => {
                    return get.player().hasUseTarget({ name: button.link[2] });
                })
                .set("ai", button => {
                    return get.player().getUseValue({ name: button.link[2] });
                })
                .forResult();
            if (event.result.bool && event.result.links.length) {
                event.result.cost_data = event.result.links;
            }
        },
        async content(event, trigger, player) {
            const card = {
                name: event.cost_data[0][2],
                nature: event.cost_data[0][3],
            };
            game.broadcastAll(function (card) {
                lib.skill.mcdh_WR00302_backup.viewAs = card;
            }, card);
            await player
                .chooseToUse()
                .set("openskilldialog", `###${get.translation(event.name)}###你可以将${player.getShownCards().length}张牌当做${get.translation(card)}使用`)
                .set("norestore", true)
                .set("_backupevent", `${event.name}_backup`)
                .set("custom", {
                    add: {},
                    replace: { window: function () { } },
                })
                .backup(`${event.name}_backup`)
                .forResult()
        },
        subSkill: {
            backup: {
                filterCard(card) {
                    return get.itemtype(card) == "card";
                },
                position: "hes",
                selectCard() {
                    return get.player().getShownCards().length;
                },
                ai1(card) {
                    return 6 - get.value(card);
                },
            },
        },
    },
    //黎
    mcdh_WR00401: {
        nobracket: true,
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        filter(event, player) {
            if (_status.currentPhase == player || player.isHealthy()) {
                return false;
            }
            const evt = event?.getl?.(player);
            return evt && evt.player == player && evt.cards2?.length;
        },
        check(event, player) {
            if (player.getDamagedHp() >= 3) return true;
            return player.getDamagedHp() != event.getl(player).cards2.length;
        },
        async content(event, trigger, player) {
            await player.draw(player.getDamagedHp());
            if (player.getDamagedHp() != trigger.getl(player).cards2.length) {
                player.tempBanSkill(event.name, "roundStart");
            }
        },
    },
    mcdh_WR00402: {
        nobracket: true,
        trigger: {
            global: "damageSource",
        },
        filter(event, player) {
            if (!event.card) return false;
            return event.source?.isIn() && event.source != player;
        },
        async cost(event, trigger, player) {
            const num = get.cardNameLength(trigger.card);
            event.result = await player
                .chooseCardTarget({
                    prompt: get.prompt2(event.skill, trigger.source),
                    filterCard: true,
                    selectCard: num,
                    position: "he",
                    num: num,
                    filterTarget(card, player, target) {
                        return target == _status.event.getTrigger().source;
                    },
                    ai1(card) {
                        const player = get.player();
                        if (player.hasSkill("mcdh_WR00401") && !player.isTempBanned("mcdh_WR00401")) {
                            if (get.event().num != player.getDamagedHp()) return 7 - get.value(card);
                        }
                        return 4 - get.value(card);
                    },
                    ai2(target) {
                        let att = get.attitude(_status.event.player, target);
                        return Math.max(0, att);
                    },
                })
                .forResult();
        },
        logTarget: "source",
        async content(event, trigger, player) {
            await player.give(event.cards, event.targets[0]);
        },
    },
    //仇白
    mcdh_WR00601: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "loseAfter",
            global: ["cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
        },
        filter(event, player) {
            if (_status.currentPhase == player) return false;
            if (event.name != "cardsDiscard") {
                return event.getd(player, "cards2").some(i => get.name(i, player) == "sha");
            } else {
                if (!event.cards.filterInD("d").some(i => get.name(i, player) == "sha")) return false;
                var evt = event.getParent();
                if (evt.name != "orderingDiscard") return false;
                var evtx = evt.relatedEvent || evt.getParent();
                if (evtx.player != player) return false;
                return player.hasHistory("lose", evtxx => {
                    return evtx == (evtxx.relatedEvent || evtxx.getParent()) && evtxx.cards2.length > 0;
                });
            }
        },
        prompt2(event, player) {
            return "当你的【杀】于回合外进入弃牌堆后，你可以摸等量张牌。";
        },
        async content(event, trigger, player) {
            const cards = trigger.getd().filter(card => get.name(card) == "sha");
            if (cards.length) {
                await player.draw(cards.length);
            }
        },
        group: "mcdh_WR00601_recast",
        subSkill: {
            recast: {
                trigger: {
                    global: "phaseUseBegin",
                },
                filter(event, player) {
                    return event.player != player && player.hasCards("h", { name: "sha" });
                },
                logTarget: "player",
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseToDiscard(get.prompt("mcdh_WR00601", trigger.player), "你可以弃置任意张【杀】，然后其展示手牌并重铸其中至多等量张【杀】。", { name: "sha" }, [1, Infinity], "chooseonly")
                        .set("ai", card => {
                            return 6 - get.value(card);
                        })
                        .forResult();
                },
                async content(event, trigger, player) {
                    await player.discard(event.cards);
                    await trigger.player.showHandcards();
                    if (trigger.player.hasCards("he")) {
                        const result = await trigger.player
                            .chooseCard([1, event.cards.length])
                            .set("prompt", `${get.translation(player)}发动了${get.translation(event.name)}，你可以重铸至多${event.cards.length}张【杀】`)
                            .set("filterCard", (card, player) => {
                                if (!player.canRecast(card)) {
                                    return false;
                                }
                                return get.name(card, false) == "sha";
                            })
                            .set("ai", card => {
                                return 7 - get.value(card);
                            })
                            .forResult();
                        if (result.bool && result.cards?.length) {
                            await trigger.player.recast(result.cards);
                        }
                    }
                },
            },
        },
    },
    mcdh_WR00602: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        mod: {
            ignoredHandcard(card, player) {
                if (card.name == "sha") return true;
            },
            cardDiscardable(card, player, name) {
                if (name == "phaseDiscard" && card.name == "sha") return false;
            },
        },
        trigger: {
            player: "phaseUseEnd",
        },
        forced: true,
        filter(event, player) {
            return player.hasCards("h", card => get.name(card) != "sha");
        },
        async content(event, trigger, player) {
            await player.showHandcards();
            await game.delay();
            await Promise.all(event.next);
            event.videoId = lib.status.videoId++;
            if (player.isUnderControl()) game.swapPlayerAuto(player);
            /**
             * player选择target的一种花色的牌
             * @param {Player} player
             * @param {Player} target
             */
            function chooseOneSuitCard(player, target, force = false, limit, str = "请选择一个花色的牌", ai = { bool: false }) {
                const { promise, resolve } = Promise.withResolvers();
                const event = _status.event;
                event.selectedCards = [];
                event.selectedButtons = [];
                //对手牌按花色分类
                let suitCards = Object.groupBy(target.getCards("h", card => get.name(card) != "sha"), c => get.suit(c, target));
                suitCards.heart ??= [];
                suitCards.diamond ??= [];
                suitCards.spade ??= [];
                suitCards.club ??= [];
                let dialog = (event.dialog = ui.create.dialog());
                dialog.classList.add("fullheight");
                event.control_ok = ui.create.control("ok", link => {
                    _status.imchoosing = false;
                    event.dialog.close();
                    event.control_ok?.close();
                    event.control_cancel?.close();
                    event._result = {
                        bool: true,
                        cards: event.selectedCards,
                    };
                    resolve(event._result);
                    game.resume();
                });
                event.control_ok.classList.add("disabled");
                //如果是非强制的，才创建取消按钮
                if (!force) {
                    event.control_cancel = ui.create.control("cancel", link => {
                        _status.imchoosing = false;
                        event.dialog.close();
                        event.control_ok?.close();
                        event.control_cancel?.close();
                        event._result = {
                            bool: false,
                        };
                        resolve(event._result);
                        game.resume();
                    });
                }
                event.switchToAuto = function () {
                    _status.imchoosing = false;
                    event.dialog?.close();
                    event.control_ok?.close();
                    event.control_cancel?.close();
                    event._result = ai;
                    resolve(event._result);
                    game.resume();
                };
                dialog.addNewRow(str);
                let keys = Object.keys(suitCards).sort((a, b) => {
                    let arr = ["spade", "heart", "club", "diamond", "none"];
                    return arr.indexOf(a) - arr.indexOf(b);
                });
                //添加框
                while (keys.length) {
                    let key1 = keys.shift();
                    let cards1 = suitCards[key1];
                    let key2 = keys.shift();
                    let cards2 = suitCards[key2];
                    //点击容器的回调
                    /**@type {Row_Item_Option["clickItemContainer"]} */
                    const clickItemContainer = function (container, item, allContainer) {
                        if (!item?.length || item.some(card => !lib.filter.cardDiscardable(card, player, event.name))) return;
                        if (event.selectedButtons.includes(container)) {
                            container.classList.remove("selected");
                            event.selectedButtons.remove(container);
                            event.selectedCards.removeArray(item);
                        } else {
                            if (event.selectedButtons.length >= limit) {
                                let precontainer = event.selectedButtons[0];
                                precontainer.classList.remove("selected");
                                event.selectedButtons.remove(precontainer);
                                let suit = get.suit(event.selectedCards[0], target),
                                    cards = target.getCards("h", { suit: suit });
                                event.selectedCards.removeArray(cards);
                            }
                            container.classList.add("selected");
                            event.selectedButtons.add(container);
                            event.selectedCards.addArray(item);
                        }
                        event.control_ok.classList[event.selectedButtons.length === limit ? "remove" : "add"]("disabled");
                    };
                    //给框加封条，显示xxx牌多少张
                    function createCustom(suit, count) {
                        return function (itemContainer) {
                            function formatStr(str) {
                                return str.replace(/[♥︎♦︎]/g, "<span style='color: red; '>$&</span>");
                            }
                            let div = ui.create.div(itemContainer);
                            if (count) {
                                div.innerHTML = formatStr(`${get.translation(suit)}牌${count}张`);
                            } else {
                                div.innerHTML = formatStr(`没有${get.translation(suit)}牌`);
                            }
                            div.css({
                                position: "absolute",
                                width: "100%",
                                bottom: "1%",
                                height: "35%",
                                background: "#352929bf",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "1.2em",
                                zIndex: "2",
                            });
                        };
                    }
                    //框的样式，不要太宽，高度最小也要100px，防止空框没有高度
                    /**@type {Row_Item_Option["itemContainerCss"]} */
                    let itemContainerCss = {
                        border: "solid #c6b3b3 2px",
                        minHeight: "100px",
                    };
                    if (key2) {
                        dialog.addNewRow(
                            {
                                item: cards1,
                                ItemNoclick: true, //卡牌不需要被点击
                                clickItemContainer,
                                custom: createCustom(key1, cards1.length), //添加封条
                                itemContainerCss,
                            },
                            {
                                item: cards2,
                                ItemNoclick: true, //卡牌不需要被点击
                                clickItemContainer,
                                custom: createCustom(key2, cards2.length),
                                itemContainerCss,
                            }
                        );
                    } else {
                        dialog.addNewRow({
                            item: cards1,
                            ItemNoclick: true, //卡牌不需要被点击
                            clickItemContainer,
                            custom: createCustom(key1, cards1.length),
                            itemContainerCss,
                        });
                    }
                }
                game.pause();
                dialog.open();
                _status.imchoosing = true;
                return promise;
            }
            let limit = 1;
            let next,
                str = get.translation(event.name) + "" + `你可以将手牌中除【杀】以外的一种花色的牌当冰【杀】使用` + "";
            let ai = function () {
                let suits = lib.suits.slice().filter(suit => {
                    let cards = player.getCards("h", { suit: suit });
                    if (!cards.length || cards.filter(card => lib.filter.cardDiscardable(card, player, event.name)).length !== cards.length) return false;
                    return 15 - cards.map(i => get.value(i)).reduce((p, c) => p + c, 0) > 0;
                });
                if (suits.length < limit) return { bool: false };
                suits.sort((a, b) => {
                    return (
                        player
                            .getCards("h", { suit: a })
                            .map(i => get.value(i))
                            .reduce((p, c) => p + c, 0) -
                        player
                            .getCards("h", { suit: b })
                            .map(i => get.value(i))
                            .reduce((p, c) => p + c, 0)
                    );
                });
                return { bool: true, cards: suits.slice(0, limit).reduce((list, suit) => list.addArray(player.getCards("h", { suit: suit })), []) };
            };
            if (event.isMine()) {
                next = chooseOneSuitCard(player, player, null, limit, str, ai);
            } else if (player.isOnline()) {
                let { promise, resolve } = Promise.withResolvers();
                player.send(chooseOneSuitCard, player, player, null, limit, str, ai);
                player.wait(result => {
                    if (result == "ai") result = ai();
                    resolve(result);
                });
                next = promise;
            } else next = Promise.resolve(ai());
            let result = await next;
            if (!result.bool) return;
            let cards = result.cards;
            const sha = get.autoViewAs({ name: "sha", nature: "ice" }, cards);
            if (player.hasUseTarget(sha)) {
                await player.chooseUseTarget(`清选择${get.translation(card)}(${get.translation(cards)})的目标`, sha, cards);
            }
        },
    },
    //孟铁衣
    mcdh_WB00301: {
        nobracket: true,
        enable: "chooseToUse",
        usable: 1,
        hiddenCard(player, name) {
            return name == "jiu";
        },
        filter(event, player) {
            if (event.responded) return false;
            if (!event.filterCard({
                name: "jiu",
                isCard: true
            }, player, event)) return false;
            return game.hasPlayer((current) => player.canCompare(current)) && _status.currentPhase && _status.currentPhase.hasCards("hej");
        },
        filterTarget(card, player, target) {
            return player.canCompare(target);
        },
        async content(event, trigger, player) {
            await player.chooseToCompare(event.targets[0]);
            if (!_status.currentPhase?.hasCards("hej", function (card) {
                const vcard = get.autoViewAs({ name: "jiu" }, [card]);
                return player.hasUseTarget(vcard, null, false);
            })) return;
            const { bool, links } = await player.choosePlayerCard(_status.currentPhase, "hej", true)
                .set("prompt", get.translation(event.name))
                .set("prompt2", "选择将" + get.translation(_status.currentPhase) + "区域内的一张牌当作【酒】使用")
                .set("filterButton", button => {
                    const player = get.player();
                    const vcard = get.autoViewAs({ name: "jiu" }, [button.link]);
                    return player.hasUseTarget(vcard, null, false);
                })
                .forResult();
            if (bool) {
                if (_status.event.getParent(2).type == "dying") {
                    event.dying = player;
                    event.type = "dying";
                }
                const vcard = get.autoViewAs({ name: "jiu" }, links);
                player.useCard(vcard, links, false, player);
            }
        },
        ai: {
            order: 5,
            result: {
                player(player) {
                    if (_status.event.parent.name == "phaseUse") {
                        if (player.countCards("h", "jiu") > 0) return 0;
                        if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) return 0;
                        if (!player.hasCards("h", "sha")) return 0;
                        var targets = [];
                        var target;
                        var players = game.filterPlayer();
                        for (var i = 0; i < players.length; i++) {
                            if (get.attitude(player, players[i]) < 0) {
                                if (player.canUse("sha", players[i], true, true)) {
                                    targets.push(players[i]);
                                }
                            }
                        }
                        if (targets.length) {
                            target = targets[0];
                        } else {
                            return 0;
                        }
                        var num = get.effect(target, { name: "sha" }, player, player);
                        for (var i = 1; i < targets.length; i++) {
                            var num2 = get.effect(targets[i], { name: "sha" }, player, player);
                            if (num2 > num) {
                                target = targets[i];
                                num = num2;
                            }
                        }
                        if (num <= 0) return 0;
                        var e2 = target.getEquip(2);
                        if (e2) {
                            if (e2.name == "tengjia") {
                                if (!player.hasCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) return 0;
                            }
                            if (e2.name == "renwang") {
                                if (!player.hasCards("h", { name: "sha", color: "red" })) return 0;
                            }
                            if (e2.name == "baiyin") return 0;
                        }
                        if (player.getEquip("guanshi") && player.countCards("he") > 2) return 1;
                        return target.countCards("h") > 3 ? 0 : 1;
                    }
                    if (player == _status.event.dying || player.isTurnedOver()) return 3;
                },
                target(player, target) {
                    return -1;
                },
            },
        },
    },
    mcdh_WB00302: {
        nobracket: true,
        trigger: {
            player: ["chooseToCompareAfter", "compareMultipleAfter"],
            target: ["chooseToCompareAfter", "compareMultipleAfter"],
        },
        usable: 1,
        forced: true,
        filter(event, player) {
            if (event.preserve) return false;
            return (player == event.player && event.num1 > event.num2) || (player != event.player && event.num1 < event.num2);
        },
        logTarget(event, player) {
            return event[event.player == player ? "target" : "player"];
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            if (target.hp < player.hp) {
                const cards = trigger[trigger.player == player ? "card2" : "card1"];
                if (cards) {
                    await player.gain(cards, "gain2", "log");
                }
                await target.recover();
            } else {
                target.addTempSkill("mcdh_WB00302_ban");
            }
        },
        subSkill: {
            ban: {
                charlotte: true,
                mark: true,
                intro: {
                    content: "本回合不能使用牌",
                },
                mod: {
                    cardEnabled: () => false,
                },
            },
        },
    },
    //林雨霞
    mcdh_WB00101: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        locked: false,
        mod: {
            targetInRange(card, player, target) {
                if (card.name != "sha" || !card.cards || card.cards[0].name != "sha") return;
                if (get.event().skill?.startsWith("mcdh_WB00101")) return true;
            },
        },
        group: ["mcdh_WB00101_use", "mcdh_WB00101_turn"],
        subSkill: {
            use: {
                enable: "phaseUse",
                usable: 1,
                prompt: "出牌阶段限一次，你可以将一张牌当作目标数为X的【杀】使用，若转化底牌为【杀】，则此【杀】无视距离限制。",
                viewAs: {
                    name: "sha",
                },
                viewAsFilter(player) {
                    if (!player.mcdh_hasCharge()) return false;
                },
                filterCard(card) {
                    return get.itemtype(card) == "card";
                },
                selectCard: 1,
                position: "hes",
                check(card) {
                    return 6 - get.value(card)
                },
                selectTarget() {
                    const player = get.player();
                    return [1, player.mcdh_countCharge()];
                },
                log: false,
                async precontent(event, trigger, player) {
                    player.logSkill("mcdh_WB00101_use");
                    player.mcdh_removeCharge(event.result.targets.length);
                },
            },
            backup: {
                viewAs: {
                    name: "sha",
                },
                viewAsFilter(player) {
                    if (!player.mcdh_hasCharge()) return false;
                },
                filterCard(card) {
                    return get.itemtype(card) == "card";
                },
                selectCard: 1,
                position: "hes",
                check(card) {
                    return 6 - get.value(card)
                },
                selectTarget() {
                    const player = get.player();
                    return [1, player.mcdh_countCharge()];
                },
                log: false,
                async precontent(event, trigger, player) {
                    player.logSkill("mcdh_WB00101_turn");
                    player.mcdh_removeCharge(event.result.targets.length);
                },
            },
            turn: {
                trigger: {
                    player: "damageEnd",
                },
                direct: true,
                filter(event, player) {
                    if (!player.mcdh_hasCharge()) return false;
                    return player.hasCards("hes");
                },
                async content(event, trigger, player) {
                    await player
                        .chooseToUse()
                        .set("openskilldialog", `###${get.prompt("mcdh_WB00101")}###你可以将一张牌当作目标数为X的【杀】使用，若转化底牌为【杀】，则此【杀】无视距离限制。`)
                        .set("norestore", true)
                        .set("_backupevent", "mcdh_WB00101_backup")
                        .set("custom", {
                            add: {},
                            replace: { window: function () { } },
                        })
                        .backup("mcdh_WB00101_backup")
                },
            },
        },
    },
    mcdh_WB00102: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: ["phaseJieshuBegin", "damageEnd"]
        },
        prompt2(event, player) {
            return event.name == "phaseJieshu" ? `结束阶段，你可以摸${get.cnNumber(player.mcdh_countCharge(true))}张牌，然后翻面。` : `当你受到伤害后，你可以复原武将牌，然后回复1点技力。`;
        },
        check(event, player) {
            if (event.name == "phaseJieshu") {
                return player.isTurnedOver() || player.mcdh_countCharge(true) >= 2;
            }
            return true;
        },
        async content(event, trigger, player) {
            if (event.triggername == "phaseJieshuBegin") {
                await player.draw(player.mcdh_countCharge(true));
                player.turnOver();
            }
            else {
                player.link(false);
                player.turnOver(false);
                player.mcdh_addCharge();
            }
        },
    },
    //艾丽妮
    mcdh_SN00501: {
        nobracket: true,
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        filter(event, player) {
            if (
                !player.hasCards(function (card) {
                    return !get.is.shownCard(card);
                })
            )
                return false;
            var evt = event.getl(player);
            return evt && evt.player == player && evt.hs && evt.hs.length > 0;
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCard(get.prompt2(event.skill))
                .set("filterCard", card => {
                    return !get.is.shownCard(card);
                })
                .set("ai", card => {
                    return 1 + Math.random();
                })
                .forResult();
        },
        async content(event, trigger, player) {
            if (trigger.delay == false) await game.delay();
            await player.addShownCards(event.cards, "visible_mcdh")
        },
        group: "mcdh_SN00501_truth",
        subSkill: {
            truth: {
                trigger: {
                    player: ["addShownCardsAfter", "hideShownCardsAfter"],
                },
                filter(event, player) {
                    return event.cards?.length >= 2;
                },
                prompt2: "当你一次性暗置或失去至少两张明置牌后，你可以摸一张牌。",
                async content(event, trigger, player) {
                    await player.draw();
                },
            },
        },
    },
    mcdh_SN00502: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        viewAs: {
            name: "juedou",
            isCard: true,
        },
        viewAsFilter(player) {
            if (!player.getShownCards().length) return false;
        },
        filterCard(card) {
            return get.is.shownCard(card);
        },
        selectCard: [1, Infinity],
        check(event, player) {
            if (ui.selected.cards.length == 1) return 10 - get.value(card);
            return 8 - get.value(card);
        },
        lose: false,
        discard: false,
        delay: false,
        prompt: "出牌阶段限一次，你可以暗置至少一张牌，视为使用【决斗】。",
        log: false,
        async precontent(event, trigger, player) {
            player.logSkill("mcdh_SN00502");
            const cards = event.result.cards;
            event.result.cards = [];
            player
                .when("useCard")
                .filter(evt => evt.skill == "mcdh_SN00502")
                .then(async (event, trigger, player) => {
                    await player.hideShownCards(cards);
                });
        },
    },
    mcdh_SN00503: {
        nobracket: true,
        trigger: {
            global: "dieBegin",
        },
        limited: true,
        filter(event, player) {
            if (event.player == player) return false;
            if (event.source && event.source == player) return false
            return event.player.hasCards("hej");
        },
        async cost(event, trigger, player) {
            event.result = await trigger.player
                .chooseBool(`是否响应${get.translation(player)}的【${get.translation(event.skill)}】？`, `将你区域内的所有牌交给${get.translation(player)}`)
                .set("forceDie", true)
                .set("goon", get.attitude(trigger.player, player) > 0)
                .set("ai", () => {
                    return get.event().goon;
                })
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            const cards = trigger.player.getCards("hej");
            if (cards.length) {
                await player.gain(cards, "gain2");
            }
        },
    },
    //暗索
    mcdh_RH01401: {
        nobracket: true,
        trigger: {
            player: "phaseUseBegin"
        },
        popup: false,
        filter(event, player) {
            return game.hasPlayer(target => target != player && target.countDiscardableCards(player, "h"));
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), [1, 3], (card, player, target) => {
                    return target != player && target.countGainableCards(player, "h");
                })
                .set("ai", target => {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.logSkill(event.name, event.targets);
            player.addSkill("mcdh_RH01401_reback");
            player.markAuto("mcdh_RH01401_reback", event.targets);
            await player.gainMultiple(event.targets);
        },
        subSkill: {
            reback: {
                trigger: {
                    player: "phaseJieshuBegin",
                },
                forced: true,
                charlotte: true,
                onremove: true,
                async content(event, trigger, player) {
                    await player.drawTo(3);
                    if (!player.hasCards("he")) return;
                    const targets = game.filterPlayer(target => {
                        return player.getStorage("mcdh_RH01401_reback").includes(target)
                    });
                    if (!targets.length) return;
                    const result = await player
                        .chooseCardTarget({
                            prompt: get.translation("mcdh_RH01401"),
                            prompt2: `交给${get.translation(targets)}各一张牌。`,
                            forced: true,
                            filterCard: true,
                            targets: targets,
                            selectCard() {
                                return get.event().targets.length;
                            },
                            position: "he",
                            filterTarget(card, player, target) {
                                return get.event().targets.includes(target);
                            },
                            selectTarget() {
                                return ui.selected.cards.length;
                            },
                            ai1(card) {
                                if (card.name == "du") return 10;
                                else if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
                                var player = _status.event.player;
                                if (ui.selected.cards.length > 4 || !game.hasPlayer(function (current) {
                                    return get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
                                })) return 0;
                                return 1 / Math.max(0.1, get.value(card));
                            },
                            ai2(target) {
                                var player = _status.event.player, att = get.attitude(player, target);
                                if (ui.selected.cards[0].name == "du") return -att;
                                if (target.hasSkillTag("nogain")) att /= 6;
                                return att;
                            },
                        })
                        .forResult();
                    if (result?.bool) {
                        const gain_list = [];
                        for (let i = 0; i < result.targets.length; i++) {
                            gain_list.push([result.targets[i], result.cards[i]]);
                            player.line(result.targets[i]);
                        }
                        await game
                            .loseAsync({
                                gain_list: gain_list,
                                player: player,
                                cards: result.cards,
                                giver: player,
                                animate: "giveAuto",
                            })
                            .setContent("gaincardMultiple");
                    }
                },
            },
        },
    },
    //说书人
    mcdh_WR00501: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "phaseEnd",
        },
        popup: false,
        filter(event, player) {
            return !player.mcdh_countCharge(true) && player.mcdh_countChargeMax();
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill))
                .set("ai", target => {
                    const player = get.player();
                    return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1);
                })
                .forResult()
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            player.mcdh_removeChargeMax();
            await player.draw(2);
            if (player.hasCards("he")) {
                await player.chooseToDiscard("he", 2, true);
            }
            target.insertPhase();
        },
    },
    mcdh_WR00502: {
        nobracket: true,
        enable: "phaseUse",
        mcdhCharge: 1,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_WR00502")) {
                return false;
            }
            if (player.countCards("he", { color: "black" }) < 2) return false;
            return get.inpileVCardList(info => {
                const name = info[2], type = get.type(name), infox = get.info({ name: name });
                return ["basic", "trick"].includes(type);
            }).some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
        },
        chooseButton: {
            dialog(event, player) {
                const list = get.inpileVCardList(info => {
                    const name = info[2], type = get.type(name), infox = get.info({ name: name });
                    return ["basic", "trick"].includes(type);
                }).filter(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
                return ui.create.dialog("逢桃遣秽", [list, "vcard"]);
            },
            check(button) {
                return get.event().player
                    .getUseValue({
                        name: button.link[2],
                        nature: button.link[3]
                    });
            },
            backup(links, player) {
                return {
                    viewAs: {
                        name: links[0][2],
                        nature: links[0][3]
                    },
                    position: "hes",
                    filterCard(card) {
                        return get.color(card) == "black";
                    },
                    selectTarget: 1,
                    selectCard: 2,
                    check(card) {
                        return 6 - get.value(card);
                    },
                    log: false,
                    async precontent(event, trigger, player) {
                        player.logSkill("mcdh_WR00502");
                        player.mcdh_removeCharge();
                    },
                }
            },
            prompt(links, player) {
                return "将两张黑色牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
            },
        },
        ai: {
            order: 1,
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
    //嵯峨
    mcdh_WR00101: {
        nobracket: true,
        derivation: "mcdh_WR00102",
        audio: "ext:梦澈涤花/audio/skill:2",
        locked: false,
        zhuanhuanji: true,
        mark: true,
        marktext: "☯",
        intro: {
            content(storage, player, skill) {
                if (storage) return "你可以将一张牌当任意基本牌或普通锦囊牌使用";
                return "你可以获得〖拙山起尽〗并将一张牌当【火攻】使用";
            },
        },
        enable: "chooseToUse",
        filter(event, player) {
            if (!player.hasCards("hes")) return false;
            return get.inpileVCardList(info => {
                const name = info[2], type = get.type(name), infox = get.info({ name: name });
                if (!player.storage.mcdh_WR00101) return name == "huogong";
                return ["basic", "trick"].includes(type);
            }).some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
        },
        chooseButton: {
            dialog(event, player) {
                const list = get.inpileVCardList(info => {
                    const name = info[2], type = get.type(name), infox = get.info({ name: name });
                    if (!player.storage.mcdh_WR00101) return name == "huogong";
                    return ["basic", "trick"].includes(type);
                }).filter(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
                const dialog = ui.create.dialog("云收空界", [list, "vcard"]);
                dialog.direct = true;
                return dialog;
            },
            check(button) {
                return get.event().player
                    .getUseValue({
                        name: button.link[2],
                        nature: button.link[3]
                    });
            },
            backup(links, player) {
                return {
                    viewAs: {
                        name: links[0][2],
                        nature: links[0][3]
                    },
                    position: "hes",
                    filterCard: true,
                    check(card) {
                        return 6 - get.value(card);
                    },
                    log: false,
                    async precontent(event, trigger, player) {
                        player.logSkill("mcdh_WR00101");
                        player.changeZhuanhuanji("mcdh_WR00101");
                        if (player.storage.mcdh_WR00101) {
                            await player.addSkills("mcdh_WR00102");
                        }
                    },
                }
            },
            prompt(links, player) {
                return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
            },
        },
        hiddenCard(player, name) {
            if (player.storage.mcdh_WR00101) {
                if (name == "huogong") return true;
                return false;
            }
            return lib.inpile.includes(name) && ["basic", "trick"].includes(get.type(name));
        },
        ai: {
            order: 1,
            result: {
                player: 1,
            },
        },
    },
    mcdh_WR00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "damageEnd",
            source: "damageSource",
        },
        usable: 1,
        filter(event, player) {
            return player.hasCards("he") || game.hasPlayer(function (target) {
                return target.hasCards("ej");
            });
        },
        async cost(event, trigger, player) {
            const list = [];
            if (player.hasCards("he")) {
                list.push("重铸任意张牌");
            }
            if (game.hasPlayer(function (target) {
                return target.hasCards("ej");
            })) {
                list.push("弃置场上一张牌");
            }
            if (player.hasCards("he") || game.hasPlayer(function (target) {
                return target.hasCards("ej");
            })) {
                list.push("背水！");
            }
            if (!list.length) {
                return;
            }
            event.result = await player
                .chooseControl(list, "cancel2")
                .set("prompt", get.prompt("mcdh_WR00102"))
                .set("ai", function () {
                    const player = _status.event.player;
                    if (player.hasCards("he") && game.hasPlayer(function (current) {
                        return current.hasCards("ej");
                    })) {
                        if (game.hasPlayer(function (current) {
                            return (current.hasCards("e") && get.attitude(player, current) < 0) || (current.hasCards("j") && get.attitude(player, current) > 0);
                        }) && player.hasCard(card => get.value(card) <= 7.5, "he") && player.hp > 2) return "背水！";
                    }
                    if (game.hasPlayer(function (current) {
                        return (current.hasCards("e") && get.attitude(player, current) < 0) || (current.hasCards("j") && get.attitude(player, current) > 0);
                    })) {
                        return "弃置场上一张牌";
                    }
                    return "重铸任意张牌";
                })
                .forResult();
            if (event.result.control != "cancel2") {
                event.result.cost_data = event.result.control;
            }
        },
        async content(event, trigger, player) {
            const control = event.cost_data;
            if (control == "重铸任意张牌" || control == "背水！") {
                if (player.countCards("he", card => lib.filter.cardRecastable(card, player))) {
                    const { bool, cards } = await player
                        .chooseCard("he", "拙山起尽：重铸至少一张牌", true, [1, Infinity], lib.filter.cardRecastable)
                        .set("ai", function (card) {
                            return 5 - get.value(card);
                        })
                        .forResult();
                    if (bool) {
                        await player.recast(cards);
                    }
                }
            }
            if (control == "弃置场上一张牌" || control == "背水！") {
                if (game.hasPlayer(target => {
                    return target.countDiscardableCards(player, "ej");
                })) {
                    const { bool, targets } = await player
                        .chooseTarget(`弃置一名角色场上的一张牌`, true)
                        .set("filterTarget", (card, player, target) => {
                            return target.countDiscardableCards(player, "ej");
                        })
                        .set("ai", target => {
                            const player = get.player();
                            return get.effect(target, { name: "guohe_copy2" }, player, player)
                        })
                        .forResult();
                    if (bool) {
                        const target = targets[0];
                        player.line(target);
                        await player.discardPlayerCard(target, "ej", true);
                    }
                }
            }
            if (control == "背水！") {
                await player.loseHp();
                await player.removeSkills("mcdh_WR00102");
            }
        },
        init(player, skill) {
            player.addTip(skill, get.translation(skill));
            player.addSkillBlocker(skill);
        },
        onremove(player, skill) {
            player.removeTip(skill);
            player.removeSkillBlocker(skill);
        },
        skillBlocker(skill, player) {
            return skill != "mcdh_WR00102" && !lib.skill[skill].charlotte;
        },
    },
    //华法琳
    mcdh_RHHE00201: {
        nobracket: true,
        trigger: {
            global: "phaseBegin",
        },
        mcdhCharge: 3,
        filter(event, player) {
            return player.mcdh_hasCharge("mcdh_RHHE00201");
        },
        logTarget: "player",
        async content(event, trigger, player) {
            player.mcdh_removeCharge(3);
            await player.draw();
            trigger.player.addTempSkill("mcdh_RHHE00201_effect");
        },
        subSkill: {
            effect: {
                trigger: {
                    source: "damageBegin1",
                },
                usable: 1,
                check(event, player) {
                    if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) return false;
                    return (
                        get.attitude(player, event.player) < 0 &&
                        !event.player.hasSkillTag("filterDamage", null, {
                            player: player,
                            card: event.card,
                        }) &&
                        get.damageEffect(event.player, player, player, get.natureList(event)) > 0
                    );
                },
                prompt2: "你可以失去1点体力并摸一张牌，然后令此伤害+1",
                async content(event, trigger, player) {
                    await player.loseHp();
                    await player.draw();
                    trigger.num++;
                },
                mark: true,
                marktext: "血",
                intro: {
                    content: "本回合内于下次造成伤害时，你可以失去1点体力并摸一张牌，然后令此伤害+1",
                },
            },
        },
    },
    mcdh_RHHE00202: {
        nobracket: true,
        trigger: {
            global: "dying",
        },
        popup: false,
        filter(event, player) {
            return event.reason?.name == "damage" && player.hasCards("he", { color: "red" });
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCardTarget({
                    prompt: get.prompt2(event.skill),
                    filterCard(card, player) {
                        return get.color(card) == "red";
                    },
                    position: "he",
                    filterTarget(card, player, target) {
                        const trigger = get.event().getTrigger();
                        return trigger.source == target || target == player;
                    },
                    ai1(card) {
                        return 5 - get.value(card);
                    },
                    ai2(target) {
                        const player = get.player();
                        return get.recoverEffect(target, player, player);
                    },
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            await player.discard(event.cards);
            await target.recover();
        },
    },
    //嘉维尔
    mcdh_RHHE00301: {
        nobracket: true,
        mod: {
            cardUsable(card, player, num) {
                if (card.storage.mcdh_RHHE00301) return Infinity;
            },
        },
        enable: "phaseUse",
        usable: 1,
        viewAs: {
            name: "sha",
            storage: {
                mcdh_RHHE00301: true,
            }
        },
        locked: false,
        filter(event, player) {
            return game.hasPlayer((target) => target != player && target.hp >= player.hp);
        },
        filterCard: () => false,
        selectCard: -1,
        filterTarget: (card, player, target) => target != player && target.hp >= player.hp,
        async precontent(event, trigger, player) {
            player
                .when("useCardAfter")
                .filter(evt => evt.skill == "mcdh_RHHE00301")
                .then(async (event, trigger, player) => {
                    if (!player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) return;
                    const { bool, targets } = await player
                        .chooseTarget(`你可以令一名角色回复1点体力`)
                        .set("ai", target => {
                            const player = get.player();
                            return get.recoverEffect(target, player, player);
                        })
                        .forResult();
                    if (bool) {
                        const target = targets[0];
                        target.recover();
                    }
                });
        },
    },
    //亚叶
    mcdh_RHHE00501: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.hasCards("h");
        },
        filterCard: true,
        selectCard: -1,
        lose: false,
        discard: false,
        delay: false,
        async content(event, trigger, player) {
            await player.showCards(event.cards);
            const cards = event.cards.filter(card => get.is.damageCard(card));
            if (cards.length) await player.recast(cards);
            const colors = cards.reduce((list, card) => list.add(get.color(card)), []);
            if (colors.every(color => color == "red")) {
                const { bool, targets } = await player
                    .chooseTarget("你可以令一名角色回复1点体力")
                    .set("filterTarget", (card, player, target) => {
                        return target.isDamaged();
                    })
                    .set("ai", target => {
                        const player = get.player();
                        return get.recoverEffect(target, player, player);
                    })
                    .forResult();
                if (bool) {
                    player.line(targets);
                    targets[0].recover();
                }
            } else if (colors.every(color => color == "black")) {
                const { bool, links } = await player
                    .chooseButton([`你可以将其中一张牌交给一名角色`, cards])
                    .set("filterButton", button => {
                        return get.color(button.link) == "black";
                    })
                    .set("ai", button => {
                        return get.value(button.link);
                    })
                    .forResult();
                if (bool) {
                    const result = await player
                        .chooseTarget("你可以将其中一张牌交给一名角色")
                        .set("du", links[0].name == "du")
                        .set("ai", target => {
                            const player = get.player();
                            let att = get.attitude(player, target);
                            if (get.event().du) {
                                if (target.hasSkillTag("nodu")) return 0.5;
                                return -att;
                            }
                            if (att > 0) {
                                return att + Math.max(0, 5 - target.countCards("h"));
                            }
                            return att;
                        })
                        .forResult();
                    if (bool) {
                        player.line(targets);
                        await targets[0].gain(links, "gain2").set("giver", player);
                    }
                }
            }
        },
        ai: {
            order: 8,
            result: {
                player: 1,
            },
        },
    },
    mcdh_RHHE00502: {
        nobracket: true,
        trigger: {
            player: "phaseJieshuBegin",
        },
        direct: true,
        filter(event, player) {
            return game.hasPlayer(target => target != player && target.hasHistory("gain"));
        },
        async content(event, trigger, player) {
            const card = new lib.element.VCard({ name: "sha" });
            const targets = game.filterPlayer(target => target != player && target.hasHistory("gain"));
            await player
                .chooseUseTarget(card, targets, false, "nodistance")
                .set("prompt", get.prompt2(event.name))
                .set("logSkill", event.name)
        },
    },
    //末药
    mcdh_RHHE00601: {
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.countCards("he") > 1;
        },
        filterCard: true,
        selectCard: 2,
        position: "he",
        check(card) {
            return 5 - get.value(card);
        },
        async content(event, trigger, player) {
            const filter = card => get.color(card) == "red";
            const red = event.cards.filter(filter);
            const cards = get.cards(red.length + 2);
            await game.cardsGotoOrdering(cards);
            await player.showCards(cards);
            const gains = cards.filter(filter);
            if (gains.length) {
                cards.removeArray(gains);
                await player.gain(gains, "gain2");
            }
        },
        ai: {
            order: 1,
            result: {
                player: 1,
            },
        },
    },
    mcdh_RHHE00602: {
        nobracket: true,
        trigger: {
            player: "phaseJieshuBegin",
        },
        filter(event, player) {
            return get.discarded()?.filter(i => get.color(i) == "red").length >= 3;
        },
        async cost(event, trigger, player) {
            const list = ["摸一张牌", "令一名角色回复1点体力"];
            event.result = await player
                .chooseControl(list, "cancel2")
                .set("prompt", get.prompt(event.skill))
                .set("ai", () => {
                    const player = get.player();
                    if (game.hasPlayer(target => get.attitude(player, target) > 0 && target.isDamaged())) return "令一名角色回复1点体力";
                    return "摸一张牌";
                })
                .forResult();
            if (event.result.control != "cancel2") {
                event.result.cost_data = event.result.control;
            }
        },
        async content(event, trigger, player) {
            const control = event.cost_data;
            if (control == "摸一张牌") {
                await player.draw();
            }
            else {
                const result = await player
                    .chooseTarget(`你发动了${get.translation(event.name)}`, "令一名角色回复1点体力", true)
                    .set("ai", target => {
                        return get.recoverEffect(target, player, player);
                    })
                    .forResult();
                if (result?.bool && result.targets?.length) {
                    const target = result.targets[0];
                    await target.recover();
                }
            }
        },
    },
    //蜜莓
    mcdh_RHHE00701: {
        trigger: {
            player: "damageEnd",
        },
        popup: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill))
                .set("ai", function (target) {
                    const player = get.player();
                    return get.effect(target, "mcdh_RHHE00701_use", player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.logSkill(event.name, event.targets);
            const next = game.createEvent("mcdh_RHHE00701_use_backup");
            next.player = player;
            next.targets = event.targets;
            next.setContent(lib.skill.mcdh_RHHE00701_use.content);
        },
        group: "mcdh_RHHE00701_use",
        subSkill: {
            use: {
                enable: "phaseUse",
                usable: 1,
                filterTarget: true,
                prompt: "出牌阶段限一次，你可以令一名角色进行一次判定，若结果为：1.红色，你弃置其场上的一张牌，然后你摸一张牌；2.非基本牌，你令其回复1点体力。",
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const result = await target
                        .judge((card) => {
                            if (get.color(card) == "red" || get.type(card) != "basic") return 1;
                            return -1;
                        })
                        .forResult();
                    if (result?.bool) {
                        if (result.color == "red") {
                            if (target.countDiscardableCards(player, "ej")) await player.discardPlayerCard(target, true, "ej");
                            await player.draw();
                        }
                        if (get.type(result.card) != "basic") await target.recover();
                    }
                },
            },
            use_backup: {},
        },
        ai: {
            order: 6,
            result: {
                target(player, target) {
                    if (target.isDamaged()) return 1;
                    return 0;
                },
            },
        },
    },
    mcdh_RHHE00702: {
        nobracket: true,
        enable: "phaseUse",
        usable: 2,
        filter(event, player) {
            return player.hasCards("h") && get.discarded().length;
        },
        chooseButton: {
            dialog(event, player) {
                const dialog = ui.create.dialog(`###${get.translation("mcdh_RHHE00702")}###${get.skillInfoTranslation("mcdh_RHHE00702")}`, get.discarded(), "hidden")
                return dialog;
            },
            backup(links, player) {
                return {
                    filterCard: () => false,
                    selectCard: -1,
                    cards: links,
                    delay: false,
                    async content(event, trigger, player) {
                        const cards = get.info("mcdh_RHHE00702_backup").cards;
                        await game.cardsGotoPile(cards, "insert");
                        game.log(player, "将", cards, "置于了牌堆顶");
                        if (player.hasCards("he")) {
                            await player.chooseToDiscard("he", true);
                        }
                    },
                };
            },
            prompt(links) {
                return `你可以将${get.translation(links[0])}置于牌堆顶，然后弃置一张手牌`;
            },
        },
        ai: {
            order: 8,
            result: {
                player(player) {
                    var cards = get.discarded();
                    if (cards.some(i => get.color(i) == "red" && get.type(i) != "basic") && !get.skillCount("mcdh_RHHE00701") && !get.skillCount("mcdh_RHHE00702")) return 1;
                    return 0;
                },
            },
        },
    },
    //絮雨
    mcdh_RHHE00801: {
        nobracket: true,
        trigger: {
            player: "recoverEnd",
        },
        popup: false,
        filter(event, player) {
            return player.hasCards("he");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCardTarget({
                    prompt: get.prompt2(event.skill),
                    position: "he",
                    filterCard: true,
                    filterTarget: lib.filter.notMe,
                    ai1(card) {
                        return 6 - get.value(card);
                    },
                    ai2(target) {
                        var player = _status.event.player;
                        return get.attitude(player, target) > 0;
                    },
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            await player.give(event.cards, target);
            await player.draw(2);
            if (!player.hasCards("he")) return;
            const { bool, cards, targets } = await player
                .chooseCardTarget({
                    prompt: "你可以弃置两张红色牌，令一名角色回复1点体力",
                    position: "he",
                    filterCard(card, player) {
                        return get.color(card) == "red" && lib.filter.cardDiscardable(card, player, "mcdh_RHHE00801");
                    },
                    selectCard: 2,
                    filterTarget(card, player, target) {
                        return target.isDamaged();
                    },
                    ai1(card) {
                        return 6 - get.value(card);
                    },
                    ai2(target) {
                        const player = get.player();
                        return get.recoverEffect(target, player, player);
                    },
                })
                .forResult();
            if (bool) {
                await player.discard(cards);
                await targets[0].recover();
            }
        },
    },
    mcdh_RHHE00802: {
        nobracket: true,
        mod: {
            maxHandcardBase(player, num) {
                return player.getDamagedHp();
            },
        },
        trigger: {
            player: "dying",
        },
        forced: true,
        async content(event, trigger, player) {
            await player.recoverTo(1);
            await player.draw();
            await player.loseMaxHp();
        },
        ai: {
            effect: {
                target(card, player, target) {
                    if (get.tag(card, "recover") && _status.event.type == "phase" && !player.needsToDiscard()) return 0.2;
                },
            },
        },
    },
    //海沫
    mcdh_SN01601: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseEnd",
        },
        forced: true,
        filter(event, player) {
            return player.hasHistory("damage");
        },
        async content(event, trigger, player) {
            const result = await player
                .chooseToUse(`###你发动了${get.translation(event.name)}###你可以使用一张牌，或取消摸两张牌`)
                .set("ai", function (card) {
                    const player = get.player();
                    return player.getUseValue(card, false, true) >= 6;
                })
                .forResult();
            if (!result.bool) {
                await player.draw(2);
            }
        },
        ai: {
            expose: 0.2,
            maixie: true,
            skillTagFilter(player, tag) {
                if (player.hasHistory("damage")) return false;
            },
        },
    },
    mcdh_SN01602: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "useCardToPlayered",
        },
        usable: 1,
        logTarget: "target",
        filter(event, player) {
            if (event.target.hasCard(card => {
                return _status.connectMode || (lib.filter.cardDiscardable(card, event.target, "mcdh_SN01602"));
            }, "he")) {
                return true;
            }
            return get.info("mcdh_SN01602").getCards().some(card => get.color(card) == get.color(event.card));
        },
        getCards() {
            const cards = [];
            game.getGlobalHistory("cardMove", function (evt) {
                if (evt.name == "cardsDiscard" || (evt.name == "lose" && evt.position == ui.discardPile)) cards.addArray(evt.cards);
            });
            return cards;
        },
        check(event, player) {
            if (get.attitude(player, event.target) > 0) return true;
            const target = event.target;
            const history = game.getGlobalHistory("cardMove"), cards = [];
            for (let evt of history) {
                if (get.color(evt.cards.filter(card => get.position(card) == "d")) == get.color(event.card)) return true;
            }
            return false;
        },
        async content(event, trigger, player) {
            const target = trigger.target;
            const cards = get.info("mcdh_SN01602").getCards()
                .filter(card => get.color(card) == get.color(trigger.card));
            if (!cards.length) {
                if (target.hasCards("he")) {
                    await target.chooseToDiscard("he", true);
                }
            } else {
                const { bool } = await target
                    .chooseToDiscard()
                    .set("prompt", `###${get.translation(player)}发动了${get.translation(event.name)}###弃置一张牌，或令其获得本回合进入弃牌堆的一张牌`)
                    .set("sourcex", player)
                    .set("ai", card => {
                        const player = get.player(),
                            target = get.event().sourcex,
                            trigger = get.event().getTrigger();
                        if (get.attitude(player, target) >= 0) return 0;
                        return target.getUseValue(trigger.card) - get.value(card);
                    })
                    .forResult();
                if (!bool) {
                    const { bool, links } = await player
                        .chooseButton(true, [
                            `###${get.translation(event.name)}###选择获得一张本回合进入弃牌堆的的牌`,
                            cards,
                        ])
                        .set("ai", button => {
                            return get.player().getUseValue(button.link);
                        })
                        .forResult();
                    if (bool) {
                        await player.gain(links, "gain2");
                    }
                }
            }
        },
    },
    //医疗部凯尔希
    mcdh_RHHE00101: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "useCardAfter",
        },
        popup: false,
        filter(event, player) {
            return get.type(event.card) == "trick";
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), function (card, player, target) {
                    return target.hasCards("he");
                })
                .set("ai", function (target) {
                    const player = get.player();
                    if (target.hasCards("h", function (card) {
                        return target.hasUseTarget(card);
                    })) {
                        return 2 + Math.random();
                    }
                    return -1;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const { bool } = await player
                .chooseToUse(`###${get.translation(player)}发动了【${get.translation(event.name)}】###你可以使用一张牌，否则你需将一张牌置于牌堆底`, function (card) {
                    if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
                        return false;
                    }
                    return get.itemtype(card) == "card";
                })
                .forResult();
            if (!bool && target.hasCards("he")) {
                const { bool, cards } = await target
                    .chooseCard("he", true, `###【${get.translation(event.name)}】的效果被触发###将一张牌置于牌堆底`)
                    .set("ai", card => {
                        return get.unuseful(card);
                    })
                    .forResult();
                if (bool) {
                    await target.loseToDiscardpile(cards, ui.cardPile, false, "blank").set("log", false);
                    const shownCards = cards.filter(i => get.position(i) == "e"),
                        handcardsLength = cards.length - shownCards.length;
                    if (shownCards.length) {
                        target.$throw(shownCards, null);
                        game.log(target, "将", shownCards, "置于了牌堆底");
                    }
                    if (handcardsLength > 0) {
                        target.$throw(handcardsLength, null);
                        game.log(target, "将", get.cnNumber(handcardsLength), "张牌置于了牌堆底");
                    }
                }
            }
        },
    },
    mcdh_RHHE00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "dying"],
        },
        getIndex(event, player) {
            if (event.name == "dying") return [event.player];
            return game.filterPlayer(target => {
                if (target.hasCards("h")) return false;
                const evt = event.getl(target);
                return evt && evt.target == target && evt.hs?.length > 0;
            });
        },
        logTarget(event, player, name, target) {
            return target;
        },
        check(event, player, name, target) {
            return get.attitude(player, target) > 0;
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, "roundStart", false);
            const target = event.targets[0];
            const cards = get.bottomCards();
            await game.cardsGotoOrdering(cards);
            await player.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了〖死骨更肉〗");
            if (get.color(cards[0]) == "black") {
                await target.drawTo(4);
            }
            else if (get.color(cards[0]) == "red") {
                await target.recover();
            }
        },
    },
    //桑葚
    mcdh_IW00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "damageEnd",
        },
        frequent: true,
        filter(event, player) {
            return event.source?.hasCards("h");
        },
        logTarget: "source",
        async content(event, trigger, player) {
            const num = Math.min(trigger.source.countCards("h"), 5);
            await player.draw(num);
            if (player.hasCards("he")) {
                await player.chooseToDiscard("he", num, true);
            }
        },
        ai: {
            maixie: true,
            "maixie_hp": true,
            effect: {
                target(card, player, target) {
                    if (get.tag(card, "damage")) {
                        if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
                    }
                    return [1, 0.5];
                },
            },
        },
    },
    mcdh_IW00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        usable: 1,
        popup: false,
        filter(event, player) {
            if (event.type != "discard") return false;
            var evt = event.getl(player);
            return (
                evt &&
                evt.cards2?.length > 0
            );
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", function (target) {
                    const player = get.player();
                    if (target.countCards("h") == player.countCards("h")) {
                        return get.recoverEffect(target, player, player);
                    }
                    return -get.attitude(player, target);
                })
                .forResult()
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            if (target.countCards("h") == player.countCards("h")) {
                await target.recover();
            }
            else if (target.hasCards("he")) {
                await target.chooseToDiscard("he", true);
            }
        },
    },
    //阿尔贝托·萨卢佐
    mcdh_IS01001: {
        nobracket: true,
        trigger: {
            player: "useCardToPlayered",
        },
        filter(event, player) {
            if (event.targets?.length != 1) {
                return false;
            }
            return event.target.countDiscardableCards(player, event.target == player ? "e" : "he");
        },
        logTarget: "target",
        async content(event, trigger, player) {
            await player.choosePlayerCard(trigger.target, trigger.target == player ? "e" : "he", true);
        },
        group: "mcdh_IS01001_draw",
        subSkill: {
            draw: {
                trigger: {
                    global: "phaseJieshuBegin",
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    return game.hasPlayer(target => lib.skill.mcdh_IS01001_draw.logTarget(event, player));
                },
                logTarget(event, player) {
                    return game.filterPlayer(target => {
                        return player.hasHistory("useSkill", evt => evt.skill == "mcdh_IS01001" && evt.targets.includes(target));
                    });
                },
                async content(event, trigger, player) {
                    for (const target of event.targets) {
                        const num = target
                            .getHistory("lose", evt => {
                                return evt.getParent(2).name == "mcdh_IS01001" && evt.getParent(2).player == player;
                            })
                            .reduce((sum, evt) => sum + evt.cards2.length, 0);
                        if (num > 0) {
                            await target.draw(num);
                        }
                    }
                },
            },
        },
    },
    mcdh_IS01002: {
        nobracket: true,
        trigger: {
            source: "damageBegin1",
        },
        usable: 1,
        forced: true,
        filter(event, player) {
            return get.info("mcdh_IS01002").getNum();
        },
        getNum() {
            const cards = [];
            game.getGlobalHistory("cardMove", evt => {
                if (evt.name == "lose" && evt.position == ui.discardPile || evt.name == "cardsDiscard") {
                    cards.addArray(evt.cards.filter(i => get.suit(i) == "club"));
                }
            });
            return cards.length;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            trigger.num += get.info("mcdh_IS01002").getNum();
        },
        mark: true,
        intro: {
            markcount() {
                return get.info("mcdh_IS01002").getNum();
            },
            content() {
                return `${get.info("mcdh_IS01002").getNum()}`;
            },
        },
        group: "mcdh_IS01002_mark",
        subSkill: {
            mark: {
                trigger: {
                    global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
                },
                firstDo: true,
                silent: true,
                charlotte: true,
                filter(event, player) {
                    return event.getd().some(card => get.suit(card) == "club");
                },
                async content(event, trigger, player) {
                    player.updateMark("mcdh_IS01002");
                    player.addTip("mcdh_IS01002", get.translation("mcdh_IS01002") + get.info("mcdh_IS01002").getNum(), true);
                },
            },
        },
    },
    //承曦格雷伊
    mcdh_DV00201: {
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        async cost(event, trigger, player) {
            switch (player.getShownCards().length) {
                case 0: {
                    event.result = await player.chooseBool(get.prompt(event.skill), "你可以摸一张牌。").forResult();
                }
                    break;
                case 1: {
                    event.result = await player.chooseBool(get.prompt(event.skill), "你可以回复1点体力。").forResult();
                }
                    break;
                case 2: {
                    event.result = await player.chooseBool(get.prompt(event.skill), "你可以摸两张牌。").forResult();
                }
                    break;
                default: {
                    event.result = await player
                        .chooseTarget(get.prompt(event.skill), "你可以对一名其他角色造成1点雷属性伤害。", lib.filter.notMe)
                        .set("ai", target => {
                            const player = get.player();
                            return get.damageEffect(target, player, player, "thunder");
                        })
                        .forResult();
                }
                    break;
            }
            event.result.cost_data = player.getShownCards().length;
        },
        async content(event, trigger, player) {
            switch (event.cost_data) {
                case 0: {
                    await player.draw();
                }
                    break;
                case 1: {
                    await player.recover();
                }
                    break;
                case 2: {
                    await player.draw(2);
                }
                    break;
                default: {
                    const target = event.targets[0];
                    await target.damage("thunder");
                }
            }
        },
    },
    mcdh_DV00202: {
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "phaseJieshuBegin",
        },
        filter(event, player) {
            return player.hasCards("h", card => !get.is.shownCard(card));
        },
        async cost(event, trigger, player) {
            const num = Math.min(2, player.countCards("h", card => !get.is.shownCard(card)))
            event.result = await player
                .chooseCard(get.prompt2(event.skill), num)
                .set("filterCard", card => {
                    return !get.is.shownCard(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            await player.addShownCards(event.cards, "visible_mcdh");
        },
    },
    //贾斯汀
    mcdh_RL00801: {
        nobracket: true,
        derivation: "mcdh_RL00803",
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        filterCard: true,
        selectCard: [1, Infinity],
        filterTarget: lib.filter.notMe,
        check(card) {
            if (ui.selected.cards.length > 1) return 0;
            if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
            if (!ui.selected.cards.length && card.name == "du") return 20;
            var player = get.owner(card);
            var num = 0;
            var evt2 = _status.event.getParent();
            var num = 0;
            player.getHistory("lose", function (evt) {
                if (evt.getParent().skill == "hokyidefuren" && evt.getParent(3) == evt2) num += evt.cards.length;
            });
            if (player.getHp() == player.maxHp || num > 1 || player.countCards("h") <= 1) {
                if (ui.selected.cards.length) {
                    return -1;
                }
                var players = game.filterPlayer();
                for (var i = 0; i < players.length; i++) {
                    if (players[i].hasSkill("haoshi") &&
                        !players[i].isTurnedOver() &&
                        !players[i].hasJudge("lebu") &&
                        get.attitude(player, players[i]) >= 3 &&
                        get.attitude(players[i], player) >= 3) {
                        return 11 - get.value(card);
                    }
                }
                if (player.countCards("h") > player.getHp()) return 10 - get.value(card);
                if (player.countCards("h") > 2) return 6 - get.value(card);
                return -1;
            }
            return 10 - get.value(card);
        },
        discard: false,
        lose: false,
        delay: false,
        async content(event, trigger, player) {
            await player.give(event.cards, event.targets[0]);
            target.addTempSkill("mcdh_RL00803", { player: "phaseAfter" });
        },
        ai: {
            threaten: 0.8,
            order(skill, player) {
                return 1;
            },
            result: {
                target(player, target) {
                    if (target.hasSkillTag("nogain")) return 0;
                    if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
                        if (target.hasSkillTag("nodu")) return 0;
                        return -10;
                    }
                    if (target.hasJudge("lebu")) return 0;
                    var nh = target.countCards("h");
                    var np = player.countCards("h");
                    return Math.max(1, 5 - nh);
                },
            },
            effect: {
                target(card, player, target) {
                    if (player == target && get.type(card) == "equip") {
                        if (player.countCards("e", { subtype: get.subtype(card) })) {
                            var players = game.filterPlayer();
                            for (var i = 0; i < players.length; i++) {
                                if (players[i] != player && get.attitude(player, players[i]) > 0) {
                                    return 0;
                                }
                            }
                        }
                    }
                },
            },
        },
    },
    mcdh_RL00802: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        popup: false,
        filter(event, player) {
            if (_status.currentPhase == player) return false;
            if (event.getParent(2)?.name == "mcdh_RL00802") return false;
            return event.getg && event.getg(player)?.length;
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), function (card, player, target) {
                    return target.hp < _status.currentPhase.hp;
                })
                .set("ai", function (target) {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            await target.draw();
        },
    },
    mcdh_RL00803: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseUseEnd",
        },
        locked: true,
        popup: false,
        filter(event, player) {
            return player.hasHistory("sourceDamage") && player.hasCards("he");
        },
        async cost(event, trigger, player) {
            const num = Math.min(player.countCards("he"), player.getHistory("sourceDamage").reduce((p, c) => p + c.num), 0)
            const targets = game.filterPlayer(target => {
                return target != player && get.is.playerNames(target, "mcdh_RL008_Jiasiting");
            })
            if (!targets?.length) return;
            event.result = await player
                .chooseCardTarget({
                    prompt: `你发动了【${get.translation(event.name)}】`,
                    prompt2: `出牌阶段结束时，你交给贾斯汀X张牌（X为你本回合造成的伤害）。`,
                    position: "he",
                    forced: true,
                    filterCard: true,
                    selectCard: num,
                    targets: targets,
                    filterTarget(card, player, target) {
                        return get.event().targets.includes(target);
                    },
                    ai1(card) {
                        return 6 - get.value(card);
                    },
                    ai2(target) {
                        const player = get.player();
                        return get.attitude(player, target);
                    },
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.logSkill(event.name, event.targets);
            await player.give(event.cards, event.targets[0]);
        },
    },
    //瑟奇亚克
    mcdh_NL00801: {
        nobracket: true,
        trigger: {
            global: "roundStart"
        },
        forced: true,
        async content(event, trigger, player) {
            const { bool, cards, targets } = await player
                .chooseCardTarget({
                    prompt: get.prompt2(event.skill),
                    position: "he",
                    filterCard: true,
                    selectCard: game.roundNumber,
                    filterTarget(card, player, target) {
                        return target != player;
                    },
                    ai1(card) {
                        return 6 - get.value(card);
                    },
                    ai2(target) {
                        var player = _status.event.player;
                        return get.attitude(player, target) > 0;
                    },
                })
                .forResult();
            if (bool) {
                await player.give(cards, targets[0]);
                player.addTempSkill("mcdh_NL00801_effect", "roundStart");
            }
            else {
                await player.removeSkills(event.name);
                await player.draw(game.roundNumber);
                await player.loseHp();
            }
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "damageBegin3",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    return !event.hasNature();
                },
                async content(event, trigger, player) {
                    trigger.num--;
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (get.tag(card, "damage")) {
                                if (player.hasSkillTag("jueqing", false, target)) return;
                                if (lib.linked.includes(get.nature(card))) return;
                                return 0.5;
                            }
                        },
                    },
                },
                mark: true,
                intro: {
                    content: "受到的非属性伤害-1",
                },
            },
        },
    },
    mcdh_NL00802: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseUseEnd",
        },
        async content(event, trigger, player) {
            if (player.countCards("h") > player.hp) {
                player.addTempSkill("mcdh_NL00802_max");
                player.addMark("mcdh_NL00802_max", 1, false);
                const { bool, cards, targets } = await player
                    .chooseCardTarget({
                        prompt: get.prompt(event.name),
                        prompt: "你可以将一张牌交给一名其他角色。",
                        position: "he",
                        filterCard: true,
                        filterTarget(card, player, target) {
                            return player != target;
                        },
                        ai1(card) {
                            return 6 - get.value(card);
                        },
                        ai2(target) {
                            var att = get.attitude(_status.event.player, target);
                            if (target.hasSkillTag("nogain")) att /= 10;
                            if (target.hasJudge("lebu")) att /= 5;
                            return att;
                        },
                    })
                    .forResult();
                if (bool) {
                    player.line(targets);
                    await player.give(cards, event.targets[0]);
                }
            }
            else if (player.countCards("h") == player.hp) {
                await player.draw(2);
            }
            else {
                if (player.canMoveCard()) await player.moveCard();
            }
        },
        subSkill: {
            max: {
                charlotte: true,
                onremove: true,
                mod: {
                    maxHandcard(player, num) {
                        return num + player.countMark("mcdh_NL00802_max");
                    },
                },
            },
        },
    },
    //夏栎
    mcdh_MIS201601: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "dying"],
        },
        getIndex(event, player) {
            if (event.name == "dying") return [event.player];
            return game.filterPlayer(target => {
                if (target.hasCards("h")) return false;
                const evt = event.getl(target);
                return evt && evt.target == target && evt.hs?.length > 0;
            });
        },
        logTarget(event, player, name, target) {
            return target;
        },
        check(event, player, name, target) {
            if (player.countCards("h") > 4) return false;
            if (target == get.zhu(player)) return true;
            return get.attitude(player, target) > 4;
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, "roundStart", false);
            const target = event.targets[0];
            const cards = player.getCards("h");
            await player.lose(cards, ui.cardPile, "insert");
            game.log(player, "将", get.cnNumber(cards.length) + "张牌", "置于牌堆顶");
            game.updateRoundNumber();
            player.useCard({ name: "wuzhong" }, target, true);
        },
    },
    mcdh_MIS201602: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "damageEnd",
        },
        filter(event, player) {
            return event.source?.countGainableCards(player, "h");
        },
        logTarget: "source",
        async content(event, trigger, player) {
            const target = event.targets[0];
            if (target.countGainableCards(player, "h")) await player.gainPlayerCard(target, "h", true);
            if (target.countCards("h") > player.countCards("h")) return;
            const card = get.discardPile(function (card) {
                return card.name == "shan";
            });
            if (card) await player.gain(card, "gain2");
        },
        ai: {
            "maixie_defend": true,
            skillTagFilter(player, arg, target) {
                if (player.countCards("h") > target.countCards("h")) return false;
            },
            effect: {
                target(card, player, target) {
                    if (player.countCards("h") > 1 && get.tag(card, "damage")) {
                        if (player.hasSkillTag("jueqing", false, target)) return [1, -1.5];
                        if (get.attitude(target, player) < 0) return [1, 1];
                    }
                },
            },
        },
    },
    //史尔特尔
    mcdh_MISO01301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: ["loseHpAfter", "damageBegin4"],
        },
        forced: true,
        filter(event, player) {
            if (event.name == "damage") return event.hasNature() || event.num > 1;
            return player == _status.currentPhase;
        },
        async content(event, trigger, player) {
            if (trigger.name == "damage") {
                trigger.cancel();
                await player.loseMaxHp();
            }
            else {
                await player.draw();
            }
        },
        ai: {
            effect: {
                target(card, player, target, current) {
                    if (get.tag(card, "natureDamage")) return 0.5;
                    if (card.name == "tiesuo") {
                        return 0.01;
                    }
                },
            },
        },
    },
    mcdh_MISO01302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        viewAs: {
            name: "huogong",
        },
        filterCard: true,
        selectCard: -1,
        filter(event, player) {
            let hs = player.getCards("h");
            if (!hs.length) return false;
            for (let i = 0; i < hs.length; i++) {
                let mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
                if (mod2 === false) return false;
            }
            return event.filterCard(get.autoViewAs({ name: "huogong" }, hs));
        },
        log: false,
        async precontent(event, trigger, player) {
            player.logSkill("mcdh_MISO01302");
            player.when("useCard")
                .filter(event => event.skill == "mcdh_MISO01302")
                .then(async (event, trigger, player) => {
                    await player.draw(2);
                    await player.loseHp();
                });
        },
        ai: {
            order: 1,
            result: {
                player(player) {
                    if (player.countCards("h") >= player.hp - 1) return -1;
                    if (player.hp < 3) return -1;
                    return 1;
                },
            },
        },
    },
    mcdh_MISO01303: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "phaseJieshuBegin",
        },
        limited: true,
        skillAnimation: true,
        animationColor: "fire",
        check(event, player) {
            if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) return false;
            return player.hasUseTarget({ name: "juedou" });
        },
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            player.addSkill("mcdh_MISO01303_effect");
            await player.loseHp();
            const card = new lib.element.VCard({ name: "juedou", storage: { mcdh_MISO01303: true } });
            if (player.hasUseTarget(card)) await player.chooseUseTarget(card);
            if (player.hasUseTarget(card)) await player.chooseUseTarget(card);
            player.removeSkill("mcdh_MISO01303_effect");
        },
        subSkill: {
            effect: {
                trigger: {
                    source: "damageBegin1",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    return event.card?.storage?.mcdh_MISO01303;
                },
                async content(event, trigger, player) {
                    game.setNature(trigger, "fire");
                },
            },
        },
    },
    //清道夫
    mcdh_SW00401: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: ["phaseUseBegin", "phaseUseEnd"],
        },
        async cost(event, trigger, player) {
            const cards = player.getCards("h", function (card) {
                return lib.filter.cardRecastable(card, player) && get.name(card) == (event.triggername == "phaseUseBegin" ? "shan" : "sha");
            });
            if (!cards.length) {
                event.result = await player
                    .chooseBool(get.prompt2(event.skill))
                    .forResult();
                return;
            }
            event.result = await player
                .chooseCard([1, Infinity], get.prompt2(event.skill), card => {
                    return get.event().cards.includes(card);
                })
                .set("cards", cards)
                .set("ai", card => {
                    return 5 - get.value(card)
                })
                .forResult();
        },
        async content(event, trigger, player) {
            if (event.cards?.length) {
                await player.recast(event.cards);
            } else {
                await player.showHandcards();
                await player.draw();
            }
        },
    },
    //乌有
    mcdh_WR00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        init(player, skill) {
            player.addSkill(skill + "_mark");
        },
        onremove(player, skill) {
            player.removeSkill(skill + "_mark");
        },
        enable: "chooseToUse",
        viewAs(cards, player) {
            const info = player.storage.mcdh_WR00201_mark;
            if (!info) {
                return null;
            }
            return { name: info.name, nature: info.nature };
        },
        filter(event, player) {
            const info = player.storage.mcdh_WR00201_mark;
            if (!info) {
                return false;
            }
            if (!player.hasCards("hes") || player.hasSkill("mcdh_WR00201_used")) {
                return false;
            }
            return player.hasCards("hes", card => event.filterCard(get.autoViewAs({ name: info.name, nature: info.nature }, [card]), player, event));
        },
        filterCard: true,
        position: "hes",
        check(card) {
            return 8 - get.value(card);
        },
        log: false,
        prompt() {
            const player = _status.event.player;
            const info = player.storage.mcdh_WR00201_mark;
            const card = new lib.element.VCard({ name: info.name, nature: info.nature });
            return `每轮限一次，你可以将一张牌当${get.translation(card)}使用。`;
        },
        async precontent(event, trigger, player) {
            player.logSkill("mcdh_WR00201");
            player.addTempSkill("mcdh_WR00201_used", "roundStart");
        },
        hiddenCard(player, name) {
            if (!player.hasCards("hes") || player.hasSkill("mcdh_WR00201_used")) {
                return false;
            }
            return name == player.storage.mcdh_WR00201_mark;
        },
        ai: {
            effect: {
                target(card, player, target, effect) {
                    if (get.tag(card, "respondShan")) return 0.9;
                    if (get.tag(card, "respondSha")) return 0.9;
                },
            },
            order: 12,
            respondShan: true,
            respondSha: true,
            skillTagFilter(player, tag, arg) {
                if (arg == "respond") return false;
                if (!player.countMark("charge")) return false;
                if (!Array.from(ui.discardPile.childNodes).length) return false;
                const name = (tag == "respondSha" ? "sha" : "shan");
                return get.info("hokkehankuanglie").viewAs(null, player).name == name;
            },
            result: {
                player(player) {
                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                    return 1;
                },
            },
        },
        subSkill: {
            mark: {
                init(player, skill) {
                    const history = player.getAllHistory("useCard", evt => ["basic", "trick"].includes(get.type(evt.card))),
                        length = history.length;
                    if (!length) {
                        return;
                    }
                    const card = history[length - 1].card;
                    player.storage[skill] = card;
                },
                trigger: {
                    player: "useCard1",
                },
                silent: true,
                charlotte: true,
                onremove: true,
                filter(event, player) {
                    return ["basic", "trick"].includes(get.type(event.card));
                },
                async content(event, trigger, player) {
                    lib.skill[event.name].init(player, event.name);
                },
            },
            used: {
                charlotte: true,
            },
        },
    },
    mcdh_WR00202: {
        nobracket: true,
        derivation: ["mcdh_WR00203", "mcdh_WR00204"],
        audio: "ext:梦澈涤花/audio/skill:1",
        mod: {
            cardUsable: () => Infinity,
            targetInRange: () => true,
        },
        trigger: {
            player: "useCard",
        },
        forced: true,
        locked: false,
        dutySkill: true,
        filter(event, player) {
            return ["basic", "trick"].includes(get.type(event.card)) && event.targets?.length;
        },
        async content(event, trigger, player) {},
        group: ["mcdh_WR00202_achieve", "mcdh_WR00202_fail"],
        subSkill: {
            achieve: {
                trigger: {
                    source: "dieAfter",
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    player.logSkill(event.name);
                    player.awakenSkill("mcdh_WR00202");
                    game.log(player, "成功完成使命");
                    player.popup("使命成功", "green");
                    player.addSkill("mcdh_WR00203");
                },
            },
            fail: {
                trigger: {
                    player: "loseAfter",
                    global: "loseAsyncAfter",
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    if (event.type != "discard" || event.getlx === false) return false;
                    return event.getl(player).cards2?.filter(card => get.is.damageCard(card)).length > 1;
                },
                async content(event, trigger, player) {
                    player.logSkill("mcdh_WR00202");
                    player.awakenSkill("mcdh_WR00202");
                    game.log(player, "使命失败");
                    player.popup("使命失败", "fire");
                    await player.recover();
                    await player.draw(2);
                    await player.addSkills("mcdh_WR00204");
                },
            },
        },
    },
    mcdh_WR00203: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        async content(event, trigger, player) {
            await player.loseMaxHp();
            await player.draw(player.maxHp);
        },
    },
    mcdh_WR00204: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            global: "phaseJieshuBegin",
        },
        direct: true,
        filter(event, player) {
            return event.player.hasHistory("sourceDamage");
        },
        async content(event, trigger, player) {
            const card = new lib.element.VCard({ name: "juedou" });
            if (player.canUse(card, trigger.player)) {
                await player.chooseUseTarget(get.prompt2(event.name, trigger.player), card, trigger.player).set("logSkill", event.name);
            }
        },
    },
    //苏苏洛
    mcdh_RHHE00401: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        limited: true,
        skillAnimation: true,
        animationColor: "water",
        filter(event, player) {
            if (get.itemtype(event.player) != "player") return false;
            var evt = event.getl(event.player);
            return evt && evt.hs && evt.hs.length && event.player.num("h") == 0 && event.player.isAlive();
        },
        logTarget: "player",
        check(event, player) {
            return get.attitude(player, event.player) > 2;
        },
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            await trigger.player.draw(trigger.player.maxHp);
            await player.draw(2);
            player.addSkill("mcdh_RHHE00401_effect");
            player.addMark("mcdh_RHHE00401_effect", 1, false);
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "phaseDrawBegin2",
                },
                forced: true,
                filter(event, player) {
                    return !event.numFixed;
                },
                async content(event, trigger, player) {
                    trigger.num += player.countMark("mcdh_RHHE00401_effect");
                },
                ai: {
                    threaten: 2.5,
                },
            },
        },
    },
    mcdh_RHHE00402: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            global: "dying",
        },
        limited: true,
        skillAnimation: true,
        animationColor: "water",
        logTarget: "player",
        check(event, player) {
            return get.attitude(player, event.player) > 0;
        },
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            await trigger.player.recoverTo(1);
            await player[player.isHealthy() ? "gainMaxHp" : "recover"]();
        },
    },
    //布莱克
    mcdh_CW00301: {
        nobracket: true,
        trigger: {
            player: "useCardToTargeted",
        },
        usable: 1,
        forced: true,
        filter(event, player) {
            return get.is.damageCard(event.card);
        },
        async content(event, trigger, player) {
            if (player.hasCard(card => !get.is.damageCard(card))) {
                const { bool, cards } = await player
                    .chooseCard("he", `你发动了【${get.translation(event.name)}】`, "请重铸一张非伤害牌", true)
                    .set("filterCard", card => {
                        const player = get.player();
                        return !get.is.damageCard(card) && lib.filter.cardRecastable(card, player);
                    })
                    .set("ai", function (card) {
                        return 5 - get.useful(card);
                    })
                    .forResult();
                if (bool) {
                    await player.recast(cards);
                }
            }
            else {
                await player.showHandcards();
                do {
                    const result = await player.draw().forResult();
                    if (get.itemtype(result.cards) == "cards") {
                        await player.showCards(result.cards);
                        if (get.is.damageCard(result.cards[0])) break;
                    }
                }
                while (true);
            }
        },
    },
    mcdh_CW00302: {
        nobracket: true,
        trigger: {
            global: "phaseJieshuBegin",
        },
        direct: true,
        filter(event, player) {
            return event.player.hasHistory("lose", evt => evt.type == "discard");
        },
        async content(event, trigger, player) {
            player
                .chooseToUse()
                .set("openskilldialog", `###${get.prompt(event.name)}###你可以将两张牌当一张【杀】使用`)
                .set("norestore", true)
                .set("_backupevent", "mcdh_CW00302_backup")
                .set("custom", {
                    add: {},
                    replace: { window: function () { } },
                })
                .backup("mcdh_CW00302_backup")
        },
        subSkill: {
            backup: {
                viewAs: {
                    name: "sha",
                },
                filterCard(card) {
                    return get.itemtype(card) == "card";
                },
                selectCard: 2,
                position: "hes",
                ai1(card) {
                    return 5 - get.value(card);
                },
                log: false,
                async precontent(event, trigger, player) {
                    player.logSkill("mcdh_CW00302");
                    player.tempBanSkill("mcdh_CW00302", "roundStart", false);
                },
            },
        },
    },
    //奥伦·亚吉奥拉斯
    mcdh_GA00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "changeHp"
        },
        mcdhAmmo: 2,
        filter(event, player) {
            return player.mcdh_hasAmmo("mcdh_GA00301");
        },
        check(event, player) {
            return event.player.hp == 1 && get.damageEffect(event.player, player, player) > 0;
        },
        async content(event, trigger, player) {
            player.mcdh_removeAmmo(2);
            var evt = trigger.getParent();
            if (evt?.name == "recover") {
                trigger.player.addTempSkill("mcdh_GA00301_ban");
            }
            var next = trigger.player.damage();
            event.next.remove(next);
            if (!["recover", "loseHp", "damage"].includes(evt.name)) {
                event.after.push(next);
            } else {
                evt.after.push(next);
            }
        },
        subSkill: {
            ban: {
                charlotte: true,
                mod: {
                    cardEnabled2: () => false,
                },
                mark: true,
                intro: {
                    content: "你不能使用或打出牌",
                },
            },
        },
    },
    mcdh_GA00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            target: "useCardToTargeted",
        },
        forced: true,
        filter(event, player) {
            if (!["basic", "trick"].includes(get.type(event.card))) return false;
            return event.targets?.length > 1;
        },
        async content(event, trigger, player) {
            var list = ["摸一张牌"];
            if (player.mcdh_countAmmo(true)) list.push("装填弹药");
            const { control } = await player.chooseControl(list)
                .set("prompt", "离群准则：请选择一项")
                .set("ai", () => {
                    const player = get.player();
                    let controls = get.event().controls.slice();
                    return controls[controls.length - 1];
                })
                .forResult();
            await player[control == "摸一张牌" ? "draw" : "mcdh_addAmmo"]();
            trigger.getParent().excluded.add(player);
        },
    },
    //帕蒂亚
    mcdh_GA00601: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "useCardToPlayered",
            target: "useCardToTargeted"
        },
        usable: 2,
        filter(event, player) {
            return player.countCards("he", lib.filter.cardRecastable);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCard("he", get.prompt2(event.skill), [1, Infinity])
                .set("ai", card => {
                    return 7 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            await player.recast(event.cards);
        },
    },
    mcdh_GA00602: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: ["loseAfter"],
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        popup: false,
        filter(event, player) {
            const evt = event.getl(player);
            return evt && evt.cards2.length > 1 && evt.cards2.map(i => get.type(i)).toUniqued().length == evt.cards2.length;
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill))
                .set("ai", target => {
                    const player = get.player();
                    return -get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            player.tempBanSkill(event.name, "roundStart", false);
            if (target.mcdh_countAmmo() > 1) {
                target.mcdh_removeAmmo(2);
            } else {
                await target.chooseToDiscard("he", true);
            }
        },
    },
    //安多恩
    mcdh_GA00701: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: ["useCardAfter", "loseAfter", "loseAsyncAfter"],
        },
        mcdhAmmo: 1,
        locked: false,
        onremove: ["mcdh_GA00701_mark"],
        filterx(event, player) {
            if (!player.mcdh_hasAmmo("mcdh_GA00701")) return false;
            if (_status.dying.length) return false;
            if (event.name == "useCard") {
                return get.type(event.card) == "equip";
            } else if (event.name == "lose") {
                if (event.type != "discard") {
                    return false;
                }
                if (!(event.discarder || event.getParent(2).player)) {
                    return false;
                }
                if (!event.getl(event.player).cards2.filter(card => get.type(card) == "equip").length) {
                    return false;
                }
                return true;
            } else if (event.type == "discard") {
                if (!event.discarder) {
                    return false;
                }
                return game.hasPlayer(function (current) {
                    return event.getl(current).cards2.filter(card => get.type(card) == "equip").length;
                });
            }
            return false;
        },
        filter(event, player, triggername, target) {
            return target.isIn();
        },
        getIndex(trigger, player, triggername) {
            if (!lib.skill.mcdh_GA00701.filterx(trigger, player)) {
                return false;
            }
            const targets = [];
            if (trigger.name == "useCard") {
                targets.push(trigger.player);
            }
            else if (trigger.name == "loseAsync" && trigger.type == "discard") {
                if (event.type !== "discard" || !(event.discarder || event.getParent(2).player)) {
                    return [];
                }
                targets.addArray(
                    game.filterPlayer(function (current) {
                        return trigger.getl(current).cards2?.filter(card => get.type(card) == "equip").length > 0;
                    })
                );
            } else {
                targets.push(trigger.player);
            }
            targets.sortBySeat();
            return targets;
        },
        logTarget(event, player, name, target) {
            return target;
        },
        check(event, player, name, target) {
            return get.damageEffect(target, player, player) > 0;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.mcdh_removeAmmo(1);
            await target.damage();
            player.addSkill("mcdh_GA00701_mark");
            player.markAuto("mcdh_GA00701_mark", [target]);
        },
        subSkill: {
            mark: {
                charlotte: true,
                mark: true,
                intro: {
                    mark(dialog, storage, player) {
                        const targets = storage;
                        if (targets.length) {
                            dialog.addAuto(targets);
                        }
                    },
                },
            },
        },
    },
    mcdh_GA00702: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        derivation: "mcdh_GA00703",
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        forced: true,
        juexingji: true,
        skillAnimation: true,
        animationColor: "grey",
        filter(event, player) {
            if (!player.mcdh_hasAmmo()) return true;
            return !game.hasPlayer(function (target) {
                return !player.hasAllHistory("useSkill", evt => evt.skill == "mcdh_GA00701" && evt.targets?.includes(target));
            });
        },
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            const num = player.mcdh_getCharge();
            if (num > 0) {
                player.mcdh_removeAmmo(num)
                await player.draw(num);
            }
            await player.changeSkills(["mcdh_GA00703"], ["mcdh_GA00701"]);
        },
    },
    mcdh_GA00703: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: ["phaseUseEnd", "phaseDiscardBegin"],
        },
        popup: false,
        filter(event, player) {
            if (event.name == "phaseDiscard") {
                return player.mcdh_countAmmoMax();
            }
            const list = player.getHistory("useCard", evt => evt.getParent("phaseUse") == event).reduce((list, evt) => list.add(get.type2(evt.card)), []);
            return list.length == 1 && game.hasPlayer(target => player.canCompare(target));
        },
        async cost(event, trigger, player) {
            if (trigger.name == "phaseUse") {
                event.result = await player
                    .chooseTarget(get.prompt(event.skill), "你可以拼点，若你赢，你摸两张牌、或摸一张牌并令对方弃置一张牌")
                    .set("filterTarget", (card, player, target) => {
                        return player.canCompare(target);
                    })
                    .set("ai", target => {
                        const player = get.player();
                        if (get.attitude(player, target) > 0) return 0;
                        return 5 / target.countCards("h");
                    })
                    .forResult();
            } else {
                const list = Array.from({ length: player.mcdh_countAmmoMax() }).map((_, index) => `${get.cnNumber(index + 1)}点`);
                if (!player.mcdh_countAmmoMax()) return;
                event.result = await player
                    .chooseControl(list, "cancel2")
                    .set("prompt", get.prompt(event.skill), "你可以减少任意点弹药上限，在本阶段等量增加手牌上限。")
                    .set("ai", () => {
                        const { player, controls } = get.event();
                        if (player.isHealthy() && !player.needsToDiscard()) return "cancel2";
                        if (!player.mcdh_countAmmo(true)) return "cancel2";
                        return controls[0];
                    });
                if (event.result.control != "cancel2") {
                    event.result.cost_data = event.result.index + 1;
                }
            }
        },
        async content(event, trigger, player) {
            if (event.targets?.length) {
                const target = event.targets[0];
                player.logSkill(event.name, target);
                const result = await player.chooseToCompare(target).forResult();
                if (result.bool) {
                    const result2 = await player
                        .chooseTarget("殊途同归：你可以摸一张牌并令一名角色弃置一张牌，或取消摸两张牌")
                        .set("filterTarget", (card, player, target) => {
                            return get.event().getParent().targets.includes(target);
                        })
                        .forResult();
                    if (!result2.bool) {
                        await player.draw(2);
                    } else {
                        await player.draw();
                        await target.chooseToDiscard("he", true);
                    }
                }
            } else {
                player.logSkill(event.name);
                const num = event.cost_data;
                player.mcdh_removeAmmoMax(num);
                player.addTempSkill("mcdh_GA00703_effect", "phaseDiscardAfter");
                player.addMark("mcdh_GA00703_effect", num, false);
            }
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    maxHandcard(player, num) {
                        return num + player.countMark("mcdh_GA00703_effect");
                    },
                },
            },
        },
    },
    //帕特里奇昂
    mcdh_GA00801: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            source: "damageSource"
        },
        popup: false,
        filter(event, player) {
            return (
                (!event.hasNature() && game.hasPlayer(target => {
                    return target != player && !target.isLinked();
                })) ||
                (event.hasNature("fire") && ["thunder", "fire"].some(nature => {
                    const card = new lib.element.VCard({ name: "sha", nature: nature });
                    return player.hasUseTarget(card, true, false);
                }))
            )
        },
        async cost(event, trigger, player) {
            if (trigger.hasNature("fire")) {
                event.result = await player
                    .chooseTarget(get.prompt(event.skill), "你可以横置一名其他角色")
                    .set("filterTarget", (card, player, target) => {
                        return target != player && !target.isLinked();
                    })
                    .set("ai", target => {
                        return -get.attitude(get.player(), target);
                    })
                    .forResult();
            } else {
                const list = [["", "", "sha", "thunder"], ["", "", "sha", "fire"]]
                event.result = await player
                    .chooseButton([`###${get.prompt(event.skill)}###视为使用一张无次数限制的雷【杀】或火【杀】`, [list, "vcard"]])
                    .set("ai", button => {
                        const player = get.player();
                        return player.getUseValue({ name: button.link[2], nature: button.link[3] });
                    })
                    .forResult();
                if (event.result.bool && event.result.links?.length) {
                    event.result.cost_data = event.result.links;
                }
            }
        },
        async content(event, trigger, player) {
            if (event.targets?.length) {
                const target = event.targets[0];
                player.logSkill(event.name, target);
                target.link(target);
            } else {
                const links = event.cost_data;
                const card = new lib.element.VCard({ name: links[0][2], nature: links[0][3] });
                if (player.hasUseTarget(card, true, false)) {
                    await player.chooseUseTarget(card, true, false);
                }
            }
        },
    },
    //菲亚梅塔
    mcdh_GA00901: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        mcdhCharge: 3,
        filter(event, player) {
            return player.mcdh_hasCharge("mcdh_GA00901");
        },
        filterTarget(card, player, target) {
            var distance = player.distanceTo(target);
            return !game.hasPlayer(function (current) {
                return player.distanceTo(current) > distance;
            });
        },
        async content(event, trigger, player) {
            const target1 = event.targets[0];
            player.mcdh_removeCharge(3);
            await target1.damage("fire");
            if (!game.hasPlayer(target => target != player)) return;
            const result2 = await player
                .chooseTarget("###你发动了【你须愧悔】###选择令从你上家至其或从下家至其的所有角色依次弃置一张牌，或令你摸一张牌。", true)
                .set("filterTarget", (card, player, target) => {
                    return player.getPrevious() == target || player.getNext() == target;
                })
                .forResult();
            if (result2?.bool) {
                const target2 = result2.targets[0];
                const way = target2 == player.getPrevious() ? "getPrevious" : "getNext";
                let targets = [];
                let current = player[way]();
                for (const target of game.filterPlayer()) {
                    if (current == player || current == target1) break;
                    targets.add(current);
                    current = current[way]();
                }
                if (targets.length) {
                    for (const target of targets) {
                        if (target.isIn()) {
                            player.line(target, "fire");
                            const result = await target
                                .chooseToDiscard("he", "你须愧悔：弃置一张牌，或令" + get.translation(player) + "摸一张牌")
                                .set("ai", card => {
                                    if (get.event().res >= 0) {
                                        return 0;
                                    }
                                    return 6 - get.value(card);
                                })
                                .set("res", get.attitude(target, player))
                                .forResult();
                            if (!result.bool) {
                                await player.draw();
                            }
                        }
                    }
                }
            }
        },
        ai: {
            order: 8,
            result: {
                target(player, target) {
                    return get.damageEffect(target, player, target, "fire");
                },
            },
        },
    },
    mcdh_GA00902: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        popup: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", target => {
                    const player = get.player();
                    const dis = get.distance(player, target);
                    return -get.attitude(player, target) * dis;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            player.addTempSkill("mcdh_GA00902_effect", { player: "phaseBegin" });
            if (!player.storage.mcdh_GA00902_effect) player.storage.mcdh_GA00902_effect = [];
            player.storage.mcdh_GA00902_effect.push(target);
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    globalFrom(from, to, distance) {
                        const num = from.getStorage("mcdh_GA00902_effect")
                            .filter(target => target == to)
                            .length;
                        return distance + num;
                    },
                    globalTo(from, to, distance) {
                        const num = to.getStorage("mcdh_GA00902_effect")
                            .filter(target => target == from)
                            .length;
                        return distance + num;
                    },
                },
                mark: true,
                intro: {
                    markcount: () => 0,
                    mark(dialog, content, player) {
                        const targets = content.toUniqued();
                        if (targets?.length) {
                            dialog.addSmall(targets);
                        }
                    },
                },
            },
        },
    },
    //见行者
    mcdh_GA01001: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "useCardToTarget",
        },
        usable: 1,
        popup: false,
        filter(event, player) {
            if (event.player == player) return false;
            if (event.target.getHp(true) > player.getHp(true)) return false;
            return get.is.damageCard(event.card) && player.countCards("h");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCardTarget({
                    prompt: get.prompt(event.skill),
                    prompt2: `交给${get.translation(trigger.player)}一张手牌`,
                    filterCard: true,
                    filterTarget(card, player, target) {
                        return target == _status.event.getTrigger().player;
                    },
                    ai1(card) {
                        const player = get.player();
                        return 6 - get.value(card);
                    },
                    ai2(target) {
                        let att = get.attitude(_status.event.player, target);
                        return Math.max(0, att);
                    },
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0],
                cards = event.cards;
            player.logSkill(event.name, target);
            await player.give(cards, target);
        },
    },
    mcdh_GA01002: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            global: "gainAfter",
        },
        popup: false,
        filter(event, player) {
            if (player == event.player) {
                return false;
            }
            var evt = event.getl(player);
            return (
                evt &&
                evt.cards2 &&
                evt.cards2.length > 0
            );
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill))
                .set("filterTarget", (card, player, target) => {
                    const source = get.event().getTrigger().player;
                    return (target == source && target.countCards("he")) || target.countCards("h") < source.countCards("h");
                })
                .set("ai", target => {
                    const player = get.event();
                    const source = get.event().getTrigger().player;
                    if (target == source) {
                        return - get.attitude(player, target);
                    }
                    return 2 * get.effect(target, { name: "draw" }, player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            if (trigger.player == target) {
                await target.chooseToDiscard("he", 2, true);
            } else {
                await target.draw(2);
            }
        },
    },
    //塞茜莉亚
    mcdh_GA00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            target: "useCardToBefore",
        },
        mcdhCharge: 2,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_GA00201")) return false;
            return ["basic", "trick"].includes(get.type(event.card));
        },
        check(event, player) {
            if (get.effect(player, event.card, event.player, player) >= 0) return false;
            if (get.is.damageCard(event.card) && event.directHit) return true;
            if (get.tag(event.card, "respondSha") && !player.hasSha()) return true;
            if (get.tag(event.card, "respondShan") && !player.hasShan()) return true;
            return false;
        },
        async content(event, trigger, player) {
            player.mcdh_removeCharge(2);
            trigger.neutralize();
            game.log(trigger.player, "使用的", trigger.card, "对", player, "无效");
        },
    },
    mcdh_GA00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseJieshuBegin",
        },
        filter(event, player) {
            return event.player.hasHistory("useCard", function (evt) {
                return ["basic", "trick"].includes(get.type(evt.card));
            });
        },
        async cost(event, trigger, player) {
            const list = get.inpileVCardList(info => {
                const name = info[2], nature = info[3], type = get.type(name), infox = get.info({ name: name });
                if (!["basic", "trick"].includes(type) || nature) return false;
                return player.hasUseTarget({ name: name }) && trigger.player.hasHistory("useCard", evt => evt.card.name == name);
            })
            if (!list.length) return;
            event.result = await player
                .chooseButton([get.prompt2(event.skill), [list, "vcard"]])
                .set("ai", button => {
                    return get.player().getUseValue({ name: button.link[2] });
                })
                .forResult();
            if (event.result?.bool && event.result.links?.length) {
                event.result.cost_data = event.result.links[0][2];
            }
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, "roundStart", false);
            const card = new lib.element.VCard({ name: event.cost_data });
            if (player.hasUseTarget(card)) {
                await player.chooseUseTarget(card, true);
            }
        },
    },
    //德克萨斯
    mcdh_PL00201: {
        trigger: {
            player: "phaseJieshuBegin",
        },
        frequent: true,
        filter(event, player) {
            return player.getHistory("lose", evt => evt.hs?.length).length > 1;
        },
        async content(event, trigger, player) {
            const num = player.getHistory("lose", evt => evt.hs?.length).length;
            if (num >= 2) {
                const result = await player
                    .chooseTarget(get.prompt(event.name), "令一名角色摸一张牌或弃置一张牌")
                    .set("ai", function (target) {
                        var att = get.attitude(_status.event.player, target);
                        var delta = target.hp - target.countCards("h");
                        if (Math.abs(delta) == 1 && get.sgn(delta) == get.sgn(att)) {
                            return 3 * Math.abs(att);
                        }
                        if (att > 0 || target.countCards("h") > 0) {
                            return Math.abs(att);
                        }
                        return 0;
                    })
                    .forResult();
                if (result.bool) {
                    var target = result.targets[0];
                    player.line(target, "green");
                    if (target.countCards("he") == 0) {
                        event.result = { index: 0 };
                    } else {
                        event.result = await player
                            .chooseControl("摸一张牌", "弃置一张牌")
                            .set("prompt", "选择一项令" + get.translation(target) + "执行…")
                            .set("goon", get.attitude(player, target) > 0 ? 0 : 1)
                            .set("ai", () => _status.event.goon)
                            .forResult();
                    }
                    if (event.result?.index == 0) {
                        await target.draw();
                    } else {
                        await target.chooseToDiscard("he", true);
                    }
                }
            }
            if (num >= 4) {
                const result = await player
                    .chooseTarget(get.prompt(event.name), "对一名角色造成1点伤害")
                    .set("ai", function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player) * (target.hp == 1 ? 2 : 1);
                    })
                    .forResult();
                if (result.bool) {
                    var target = result.targets[0];
                    await target.damage();
                }
            }
            if (num >= 5) {
                const card = new lib.element.VCard({ name: "wanjian" });
                if (player.hasUseTarget(card)) {
                    await player.chooseUseTarget(card);
                }
            }
        },
    },
    mcdh_PL00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: ["phaseZhunbeiBegin", "phaseUseBegin"],
        },
        forced: true,
        filter(event, player) {
            return event.name == "phaseZhunbei" || player.countCards("he");
        },
        async content(event, trigger, player) {
            if (trigger.name == "phaseZhunbei") await player.draw();
            else await player.chooseToDiscard("he", true);
        },
        ai: {
            halfneg: true,
        },
    },
    //狮蝎
    mcdh_SW00201: {
        nobracket: true,
        trigger: {
            target: "useCardToTarget",
            player: "damageEnd",
        },
        filter(event, player, name) {
            if (name == "damageEnd") {
                const history = player.getHistory("damage", evt => evt != event);
                if (history.reduce((sum, evt) => sum + evt.num, 0) >= 2) return false;
                return player.getHistory("damage").reduce((sum, evt) => sum + evt.num, 0) >= 2;
            }
            return game.filterPlayer2(target => target != player)
                .reduce((sum, target) => {
                    return sum + target.getHistory("useCard", evt => evt.targets?.includes(player)).length;
                }, 0) == 2;
        },
        logTarget(event, player) {
            return _status.currentPhase;
        },
        check(event, player) {
            return get.attitude(player, _status.currentPhase) <= 0;
        },
        async content(event, trigger, player) {
            const target = _status.currentPhase;
            const result = await target
                .chooseToGive(player, "h", card => get.type(card) != "basic")
                .set("prompt", `交给${get.translation(player)}一张非基本牌，否则你失去1点体力`)
                .set("ai", card => {
                    const player = get.player();
                    if (get.effect(player, { name: "losehp" }, player, player) > 0) {
                        return 0;
                    }
                    if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
                        return 9 - get.value(card);
                    }
                    return 8 - get.value(card);
                })
                .forResult();
            if (!result.bool) {
                await target.loseHp();
            }
        },
    },
    mcdh_SW00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return game.hasPlayer(target => lib.skill.mcdh_SW00202.filterTarget(null, player, target));
        },
        filterTarget(card, player, target) {
            return target.countCards("h") > 0 && target != player;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            if (!target.countCards("h")) return;
            if (target.countCards("h") == 1) {
                event.result = {
                    bool: true,
                    cards: target.getCards("h")
                };
            }
            else event.result = await target
                .chooseCard(`###${get.translation(player)}对你发动了${get.translation(event.name)}###选择展示一张牌，可以重铸一张相同类型的牌并对你造成1点伤害。`, true)
                .set("ai", card => {
                    let val = 1;
                    if (get.type(card) == "basic") val -= 0.3;
                    return val + Math.random();
                })
                .forResult();
            if (event.result?.bool) {
                await target.showCards(event.result.cards);
                const result = await player
                    .chooseCard(get.prompt(event.name), `重铸一张牌并对${get.translation(target)}造成1点伤害`, "he")
                    .set("filterCard", card => {
                        return get.player().canRecast(card) && get.type2(card) == get.event().type;
                    })
                    .set("type", get.type2(event.result.cards[0]))
                    .set("ai", function (card) {
                        return 7 - get.value(card);
                    })
                    .forResult();
                if (result.bool) {
                    await player.recast(result.cards);
                    await target.damage();
                }
            }
        },
        ai: {
            order: 6,
            result: {
                target(player, target) {
                    return get.damageEffect(target, player, target);
                },
            },
        },
    },
    //索娜
    mcdh_PS00101: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        popup: false,
        filter(event, player) {
            if (!player.inRange(event.player)) return false;
            return player.countCards("h", card => {
                return get.color(card) == "red" && player.canRecast(card);
            });
        },
        async cost(event, trigger, player) {
            const num = player.getRoundHistory("useSkill", evt => evt.skill == event.skill).length + 1;
            event.result = await player
                .chooseCard(get.prompt2(event.skill, trigger.player), "he", num)
                .set("filterCard", card => {
                    const player = get.player();
                    return get.color(card) == "red" && player.canRecast(card);
                })
                .set("ai", card => {
                    const player = get.player();
                    return 7 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = trigger.player;
            const num = player.getRoundHistory("useSkill", evt => evt.skill == event.name).length + 1;
            player.logSkill(event.name, target);
            await player.recast(event.cards);
            const card = new lib.element.VCard({ name: "sha", storage: { mcdh_PS00101: true } });
            if (player.canUse(card, target, false, false)) {
                const next = player.useCard(card, target, false);
                await next;
            }
        },
        ai: {
            expose: 0.6,
        },
        group: "mcdh_PS00101_effect",
        subSkill: {
            effect: {
                silent: true,
                trigger: {
                    global: "dying",
                },
                filter(event, player) {
                    return event.reason?.card?.storage?.mcdh_PS00101;
                },
                async content(event, trigger, player) {
                    const num = player.getRoundHistory("useSkill", evt => evt.skill == "mcdh_PS00101").length;
                    const cards = await player.draw(num).forResult();
                    if (!game.hasPlayer(target => target != player) || !player.hasCard(card => cards.includes(card), "h")) {
                        return;
                    }
                    if (_status.connectMode) {
                        game.broadcastAll(() => (_status.noclearcountdown = true));
                    }
                    let given_map = [];
                    while (
                        player.hasCard(card => {
                            if (card.hasGaintag("mcdh_PS00101_given")) {
                                return false;
                            }
                            return cards.includes(card);
                        }, "h") &&
                        game.hasPlayer(target => target != player)
                    ) {
                        const result = await player
                            .chooseCardTarget({
                                filterCard(card, player) {
                                    if (card.hasGaintag("mcdh_PS00101_given")) {
                                        return false;
                                    }
                                    return get.event().cards.includes(card);
                                },
                                selectCard: [1, num],
                                filterTarget: lib.filter.notMe,
                                prompt: "炽心难熄：请选择要分配的卡牌和目标",
                                prompt2: "（还可分配" + num + "张）",
                                ai1(card) {
                                    return !ui.selected.cards.length && card.name == "du" ? 1 : 0;
                                },
                                ai2(target) {
                                    const player = get.event().player;
                                    const card = ui.selected.cards[0];
                                    if (card) {
                                        return get.value(card, target) * get.attitude(player, target);
                                    }
                                    return 0;
                                },
                                cards: cards,
                            })
                            .forResult();
                        if (result?.bool && result?.cards?.length && result?.targets?.length) {
                            const cards2 = result.cards;
                            const target = result.targets[0];
                            if (given_map.some(i => i[0] == target)) {
                                given_map[given_map.indexOf(given_map.find(i => i[0] == target))][1].addArray(cards2);
                            } else {
                                given_map.push([target, cards2]);
                            }
                            player.addGaintag(cards2, "mcdh_PS00101_given");
                        } else {
                            break;
                        }
                    }
                    if (_status.connectMode) {
                        game.broadcastAll(() => {
                            delete _status.noclearcountdown;
                            game.stopCountChoose();
                        });
                    }
                    if (given_map.length) {
                        await game
                            .loseAsync({
                                gain_list: given_map,
                                player: player,
                                cards: given_map.slice().flatMap(list => list[1]),
                                giver: player,
                                animate: "giveAuto",
                            })
                            .setContent("gaincardMultiple");
                    }
                },
            },
            given: {
                name: "invisible",
            },
        },
    },
    mcdh_PS00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        derivation: "mcdh_hongsonglin",
        trigger: {
            global: "roundStart",
        },
        popup: false,
        async cost(event, trigger, player) {
            event.result = await player.chooseTarget(get.prompt2(event.skill))
                .set("ai", function (target) {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            if (target.hasSkill("mcdh_hongsonglin")) {
                await target.addSkills("mcdh_hongsonglin");
            } else {
                await target.draw();
            }
        },
        ai: {
            expose: 0.4,
            threaten: 0.4,
        },
    },
    //艾沃娜
    mcdh_PS00401: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        onChooseTarget(event, player) {
            event.targetprompt2.add(target => {
                if (event.getParent().skill !== "mcdh_PS00401" || !target.classList.contains("selectable")) {
                    return;
                }
                const trigger = event.getTrigger();
                if (trigger.targets.includes(target)) {
                    return "已被选择";
                }
            });
        },
        trigger: {
            player: "useCardToPlayer",
            target: "useCardToTarget",
            global: "roundEnd",
        },
        filter(event, player, name) {
            if (name == "roundEnd") return player.getStorage("mcdh_PS00401_used").length < 2;
            if (get.type(event.card) != "trick" && event.card.name != "sha") return false;
            if (name == "useCardToPlayer") {
                return event.isFirstTarget && !player.hasStorage("mcdh_PS00401_used", 1);
            }
            return !player.hasStorage("mcdh_PS00401_used", 2);
        },
        async cost(event, trigger, player) {
            if (event.triggername != "roundEnd") {
                const list = [];
                if (!player.hasStorage("mcdh_PS00401_used", 1)) {
                    list.push("失去体力增减目标");
                }
                if (player.isDamaged() && !player.hasStorage("mcdh_PS00401_used", 2)) {
                    list.push("摸牌");
                }
                if (!list.length) return;
                const { control } = await player
                    .chooseControl(list, "cancel2")
                    .set("prompt", `###${get.prompt(event.skill)}###你可以选择失去1点体力并令此牌目标数+1或-1，或者摸你已损失体力值（${player.getDamagedHp()}）张牌。`)
                    .forResult();
                if (control == "cancel2") return;
                else if (control == "失去体力增减目标") {
                    event.result = await player
                        .chooseTarget(`${get.prompt(event.skill)}：为${get.translation(trigger.card)}增加或减少一个目标`)
                        .set("filterTarget", (card, player, target) => {
                            const event = get.event(),
                                trigger = event.getTrigger();
                            if (ui.selected.targets.length) {
                                if (trigger.targets.includes(ui.selected.targets[0]) && !trigger.targets.includes(target)) return false;
                                if (!trigger.targets.includes(ui.selected.targets[0]) && trigger.targets.includes(target)) return false;
                            }
                            if (trigger.targets.includes(target)) return true;
                            return lib.filter.targetEnabled2(trigger.card, trigger.player, target) && lib.filter.targetInRange(trigger.card, trigger.player, target);
                        })
                        .set("ai", target => {
                            const player = get.player(),
                                trigger = get.event().getTrigger();
                            if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) return 0;
                            return get.effect(target, trigger.card, player, player) * (trigger.targets.includes(target) ? -1 : 1);
                        })
                        .forResult();
                } else {
                    event.result = await player
                        .chooseBool(`###${get.prompt(event.skill)}###你可以摸${get.cnNumber(player.getDamagedHp())}张牌`)
                        .forResult();
                }
            } else {
                event.result = { bool: true };
            }
        },
        async content(event, trigger, player) {
            if (event.triggername != "roundEnd") {
                if (event.targets?.length) {
                    player.addTempSkill("mcdh_PS00401_used", "roundStart");
                    player.markAuto("mcdh_PS00401_used", [1]);
                    if (!event.isMine() && !event.isOnline()) await game.delay();
                    await player.loseHp();
                    if (trigger.targets.includes(event.targets[0])) {
                        trigger.targets.removeArray(event.targets);
                    } else {
                        trigger.targets.addArray(event.targets);
                    }
                } else {
                    player.addTempSkill("mcdh_PS00401_used", "roundStart");
                    player.markAuto("mcdh_PS00401_used", [2]);
                    await player.draw(player.getDamagedHp());
                }
            } else {
                player
                    .when({ global: "phaseAfter" })
                    .then(() => {
                        player.insertPhase();
                    });
            }
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    //正义骑士号
    mcdh_PS00501: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: ["recoverAfter", "loseHpAfter"],
        },
        filter(event, player) {
            return player.countCards("he", card => get.color(card) == (event.name == "recover" ? "red" : "black"));
        },
        logTarget: "player",
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt(event.skill, trigger.player), "chooseonly")
                .set("prompt2", trigger.name == "recover" ? "弃置一张红色牌令其失去1点体力" : "弃置一张黑色牌令其回复1点体力")
                .set("filterCard", card => {
                    const player = get.player();
                    const trigger = get.event().getTrigger();
                    return get.color(card) == (trigger.name == "recover" ? "red" : "black");
                })
                .set("ai", card => {
                    const player = get.player();
                    const trigger = get.event().getTrigger();
                    const target = trigger.player;
                    var att = get.attitude(player, target),
                        eff = get.recoverEffect(target, player, player);
                    if (trigger.name == "recover") {
                        if (target.isDamaged() && att > 2 && eff > 0) {
                            return 7 - get.value(card);
                        }
                    } else {
                        if (att < -2 && eff < 0) {
                            return 7 - get.value(card);
                        }
                    }
                    return 0;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            await player.discard(event.cards);
            if (get.color(event.cards[0]) == player.storage[event.name]) {
                await player.chooseToDiscard("he", true);
            }
            player.setStorage(event.name, trigger.name == "recover" ? "red" : "black");
            player.markSkill(event.name);
            await target[trigger.name == "recover" ? "loseHp" : "recover"]();
        },
        marktext: "启",
        intro: {
            content: "上次发动〖滴滴启动〗弃置牌的颜色为$",
        },
    },
    //查丝汀娜
    mcdh_PS00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        mod: {
            targetInRange(card) {
                if (card.storage?.mcdh_PS00301) return true;
            },
        },
        enable: "phaseUse",
        viewAs: {
            name: "sha",
            storage: {
                mcdh_PS00301: true,
            },
        },
        locked: false,
        position: "he",
        filterCard: true,
        viewAsFilter(player) {
            if (player.hasSkill("mcdh_PS00301_used")) return false;
            if (!player.countCards("he")) return false;
        },
        check(card) {
            var val = get.value(card);
            return 6 - val;
        },
        log: false,
        async precontent(event, trigger, player) {
            const targets = event.result.targets;
            player.logSkill("mcdh_PS00301");
            player.addTempSkill("mcdh_PS00301_used", "phaseUseAfter");
            if (!targets.every(target => player.inRange(target))) return;
            player.when("useCard2")
                .filter(event => event.card?.storage.mcdh_PS00301)
                .then(async (event, trigger, player) => {
                    if (
                        !game.hasPlayer(function (target) {
                            return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
                        })
                    ) {
                        return;
                    }
                    const result = await player
                        .chooseTarget(get.prompt("mcdh_PS00301"), "为" + get.translation(trigger.card) + "增加一个额外目标", function (card, player, target) {
                            var player = _status.event.player;
                            if (_status.event.targets.includes(target)) {
                                return false;
                            }
                            return lib.filter.targetEnabled2(_status.event.card, player, target) && lib.filter.targetInRange(_status.event.card, player, target);
                        })
                        .set("autodelay", true)
                        .set("ai", function (target) {
                            var trigger = _status.event.getTrigger();
                            var player = _status.event.player;
                            return get.effect(target, trigger.card, player, player);
                        })
                        .set("targets", trigger.targets)
                        .set("card", trigger.card)
                        .forResult();
                    if (result.bool) {
                        player.line(result.targets);
                        trigger.targets.addArray(result.targets);
                    }
                });
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    mcdh_PS00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "useCardToTarget",
        },
        usable: 1,
        filter(event, player) {
            if (["basic", "trick"].includes(get.type(event.card))) return false;
            return (
                player.inRange(event.target) &&
                event.targets?.length == 1 &&
                player.canCompare(event.target)
            );
        },
        check(event, player) {
            if (get.attitude(player, event.target) > 0) return false;
            return get.type(card) == "trick" || (get.type(card) == "basic" && !["shan", "tao", "jiu", "du"].includes(card.name));
        },
        logTarget: "target",
        async content(event, trigger, player) {
            const result = await player.chooseToCompare(trigger.target).forResult();
            if (result.bool) {
                trigger.getParent().directHit.add(trigger.target);
            }
        },
    },
    //号角
    mcdh_RH01801: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        locked: true,
        async content(event, trigger, player) {
            await player.damage("nosource");
            await player.draw(player.getDamagedHp());
            await player
                .chooseToUse(get.prompt(event.name), "你可以无距离次数限制的使用一张牌", function (card) {
                    return lib.filter.cardEnabled.apply(this, arguments);
                })
                .set("addCount", false)
                .set("mcdh_RH01801", true);
            player.addTempSkill("mcdh_RH01801_effect");
            player.addMark("mcdh_RH01801_effect", 1, false);
        },
        mod: {
            cardUsable(card, player, num) {
                if (get.event().mcdh_RH01801) return Infinity;
            },
            targetInRange(card, player, target) {
                if (get.event().mcdh_RH01801) return true;
            },
        },
        ai: {
            order() {
                return get.order({ name: "sha" }) + 0.1;
            },
            result: {
                player(player, target) {
                    if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) return 0;
                    return 1;
                },
            },
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    maxHandcard(player, num) {
                        return num + player.countMark("mcdh_RH01801_effect");
                    },
                },
            },
        },
    },
    mcdh_RH01802: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "damageBegin4",
        },
        filter(event, player) {
            return player.countCards("h") > player.getHp(true);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt(event.skill), `弃置${get.cnNumber(trigger.num)}张牌并防止此伤害`, "he", trigger.num, "chooseonly")
                .set("ai", card => {
                    const player = get.player();
                    if (get.damageEffect(player, trigger.source || player, player, trigger.nature) >= 0) {
                        return 0;
                    }
                    return 7 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            await player.discard(event.cards);
            trigger.cancel();
        },
    },
    //断罪者
    mcdh_RH00401: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseBegin",
            global: "judgeBegin",
        },
        mcdhCharge: 1,
        filter(event, player) {
            return player.mcdh_hasCharge("mcdh_RH00401");
        },
        async content(event, trigger, player) {
            player.mcdh_removeCharge(1);
            await player.chooseToGuanxing(2);
        },
    },
    mcdh_RH00402: {
        audio: "ext:梦澈涤花/audio/skill:2",
        shaRelated: true,
        trigger: {
            player: "useCardToPlayered",
        },
        filter(event, player) {
            return event.card.name == "sha";
        },
        check(event, player) {
            return get.attitude(player, event.target) <= 0;
        },
        async content(event, trigger, player) {
            const judgeEvent = player.judge(card => {
                if (get.suit(card) == "spade") return 2;
                if (get.number(card) >= 2 && get.number(card) <= 9) return 2;
                return -2;
            });
            judgeEvent.set("judge2", result => result.bool);
            const result = await judgeEvent.forResult();
            if (result.suit == "spade") {
                const id = trigger.target.playerid;
                const map = trigger.getParent().customArgs;
                if (!map[id]) {
                    map[id] = {};
                }
                if (typeof map[id].extraDamage != "number") {
                    map[id].extraDamage = 0;
                }
                map[id].extraDamage++;
            }
            if (result.number >= 2 && result.number <= 9) {
                trigger.getParent().directHit.push(trigger.target);
            }
        },
        ai: {
            threaten: 0.5,
            "directHit_ai": true,
            skillTagFilter(player, tag, arg) {
                if (
                    arg?.target &&
                    arg?.card &&
                    get.attitude(player, arg.target) <= 0 &&
                    arg.card.name == "sha"
                ) {
                    return true;
                }
                return false;
            },
        },
    },
    //亚历克斯&米莎
    mcdh_RM00801: {
        nobracket: true,
        trigger: {
            player: "phaseUseBegin",
        },
        forced: true,
        mark: true,
        locked: true,
        zhuanhuanji2(skill, player) {
            return !player || !player.hasSkill("mcdh_RM00801_rewrite");
        },
        marktext: "☯",
        intro: {
            content(storage, player, skill) {
                if (player.storage.mcdh_RM00801 != true) return "失去1点体力，然后本阶段你的基本牌均视为火【杀】且使用【杀】的限制次数+1";
                return "展示所有手牌，然后弃置其中的【杀】，摸等量张牌并令一名角色回复1点体力";
            },
        },
        async content(event, trigger, player) {
            if (player.hasSkill("mcdh_RM00801_rewrite")) {
                await player.loseHp();
                player.addTempSkill("mcdh_RM00801_effect", "phaseUseAfter");
            }
            await player.changeZhuanhuanji("mcdh_RM00801");
            if (player.storage[event.name]) {
                await player.loseHp();
                player.addTempSkill("mcdh_RM00801_effect", "phaseUseAfter");
            }
            else {
                await player.showHandcards();
                const cards = player.getCards("h", { name: "sha" });
                if (cards.length) {
                    await player.modedDiscard(cards);
                    await player.draw(cards.length);
                }
                if (!game.hasPlayer(target => target.isDamaged())) return;
                const result = await player
                    .chooseTarget("令一名角色回复1点体力", true, (card, player, target) => {
                        return target.isDamaged();
                    })
                    .set("ai", target => {
                        return get.recoverEffect(target, player, player);
                    })
                    .forResult();
                if (result.bool) {
                    const target = result.targets[0];
                    player.line(target);
                    await target.recover();
                }
            }
        },
        subSkill: {
            effect: {
                mod: {
                    cardname(card, player) {
                        if (get.type(card, null, false) == "basic") return "sha";
                    },
                    cardnature(card, player) {
                        if (get.type(card, null, false) == "basic") return "fire";
                    },
                    cardUsable(card, player, num) {
                        if (card.name == "sha") return num + 1;
                    },
                },
            },
            rewrite: {
                charlotte: true,
            },
        },
    },
    mcdh_RM00802: {
        nobracket: true,
        trigger: {
            player: "dying",
        },
        forced: true,
        juexingji: true,
        skillAnimation: true,
        animationColor: "fire",
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            await player.loseMaxHp();
            await player.recoverTo(player.maxHp);
            player.addSkill("mcdh_RM00801_rewrite");
            player.unmarkSkill("mcdh_RM00801");
        },
    },
    //佐菲娅
    mcdh_NL00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "damageBegin1",
        },
        mcdhCharge: 1,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_NL00301")) return false;
            return event.source && player.countCards("he");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill, trigger.player), "he", "chooseonly")
                .set("ai", card => {
                    const player = get.player();
                    if (_status.event.goon) {
                        return 5.25 - get.value(card) + (get.color(card) == "black" ? 2.75 : -3);
                    }
                    return 0;
                })
                .set(
                    "goon",
                    (function () {
                        var eff = get.damageEffect(trigger.player, trigger.source, player);
                        if (
                            eff > 5 &&
                            !trigger.player.hasSkillTag("filterDamage", null, {
                                player: player,
                                card: trigger.card,
                            })
                        ) {
                            return true;
                        }
                        if (eff < -5) {
                            return true;
                        }
                        return false;
                    })()
                )
                .forResult();
        },
        logTarget: "source",
        async content(event, trigger, player) {
            player.mcdh_removeCharge(1);
            await player.discard(event.cards);
            if (get.color(event.cards[0]) == "black") {
                trigger.num++;
                game.log(player, "令此伤害+1");
            }
            else if (get.color(event.cards[0]) == "red") {
                trigger.num--;
                game.log(player, "令此伤害-1");
            }
            const judgeEvent = player.judge(card => {
                if (get.color(card) != get.color(event.cards[0])) return 2;
                return -2;
            });
            judgeEvent.set("color", get.color(event.cards[0]))
            judgeEvent.set("callback", async event => {
                if (event.judgeResult.color == get.event().color) {
                    if (get.position(event.judgeResult.card, true) == "o") {
                        await player.gain(event.judgeResult.card, "gain2", "log");
                    }
                }
            });
            judgeEvent.set("judge2", result => result.bool);
            await judgeEvent;
        },
        ai: {
            expose: 0.2,
        },
    },
    //浊心斯卡蒂
    mcdh_SN00101: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.countCards("he");
        },
        filterTarget(card, player, target) {
            return player != target;
        },
        filterCard: true,
        selectCard: [1, 2],
        check(card) {
            return 5 - get.value(card);
        },
        lose: false,
        discard: false,
        delay: false,
        async content(event, trigger, player) {
            const target = event.targets[0],
                num = event.cards.length;
            await player.give(event.cards, target);
            const targets = game.filterPlayer(current => current.countCards("h") > target.countCards("h"));
            for (const current of targets) {
                player.line(current);
                const result = await current
                    .chooseToGive(target, "h", num)
                    .set("prompt", `交给${get.translation(current)}${get.cnNumber(num)}张非基本牌，否则你失去1点体力`)
                    .set("ai", card => {
                        const player = get.player();
                        if (get.effect(player, { name: "losehp" }, player, player) > 0) {
                            return 0;
                        }
                        if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
                            return 9 - get.value(card);
                        }
                        return 8 - get.value(card);
                    })
                    .forResult();
                if (!result.bool) {
                    await current.loseHp();
                }
            }
        },
        ai: {
            order: 10,
            result: {
                target(player, target) {
                    return 2;
                }
            }
        },
    },
    mcdh_SN00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: ["phaseBegin", "phaseJieshuBegin"],
        },
        forced: true,
        filter(event, player, name) {
            if (name == "phaseBegin") return true;
            return player.isMinHandcard();
        },
        async content(event, trigger, player) {
            if (event.triggername == "phaseBegin") {
                player.addTempSkill("mcdh_SN00102_counter");
            } else {
                await player.drawTo(Math.min(4, player.getHandcardLimit()));
            }
        },
        init(player, skill) {
            player.addTempSkill("mcdh_SN00102_counter");
            if (!player.hasMark("mcdh_SN00102_counter")) {
                const num = player.getHistory("useCard").length;
                if (num > 0) {
                    player.addMark("mcdh_SN00102_counter", num, false);
                }
            }
        },
        mod: {
            maxHandcardBase(player, num) {
                if (_status.currentPhase != player) return;
                return player.countMark("mcdh_SN00102_counter");
            },
        },
        subSkill: {
            counter: {
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                popup: false,
                firstDo: true,
                charlotte: true,
                onremove: true,
                async content(event, trigger, player) {
                    player.addMark(event.name, 1, false);
                },
            },
        },
    },
    //水月
    mcdh_SN01501: {
        nobracket: true,
        trigger: {
            player: "changeHpAfter",
        },
        popup: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill))
                .set("ai", target => {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const next = await target.draw("bottom").forResult();
            target.addShownCards(next, "visible_mcdh");
        },
    },
    mcdh_SN01502: {
        nobracket: true,
        mod: {
            cardUsable(card, player, num) {
                if (player.isTempBanned("mcdh_SN01502")) return;
                if (player == _status.currentPhase) return Infinity;
            },
            targetInRange(card, player) {
                if (player.isTempBanned("mcdh_SN01502")) return;
                if (player == _status.currentPhase) return true;
            },
        },
        trigger: {
            player: "useCardAfter",
        },
        forced: true,
        filter(event, player) {
            const evtx = player.getHistory("lose", evt => {
                return evt.getParent() == event;
            })[0];
            if (!evtx) return false;
            const history = player.getAllHistory("lose", evt => evt.getParent().name == "useCard");
            if (history.length < 2) return false;
            const index = history.indexOf(evtx);
            const evtx2 = history[index - 1];
            if (Object.values(evtx.gaintag_map)?.some(value => value.some(info => info.includes("visible_")))) {
                return Object.values(evtx2.gaintag_map).some(value => value.some(info => info.includes("visible_")))
            } else {
                return !Object.values(evtx2.gaintag_map).some(value => value.some(info => info.includes("visible_")))
            }
        },
        async content(event, trigger, player) {
            const result = await player
                .chooseTarget("潮浪层起：令一名角色从牌堆底摸一张牌并明置之", true)
                .set("ai", target => {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
            if (result.bool) {
                const target = result.targets[0];
                player.logSkill("mcdh_SN01501", target);
                const next = await target.draw("bottom").forResult();
                target.addShownCards(next, "visible_mcdh");
            }
            player.tempBanSkill(event.name, false);
        },
    },
    //圣徒卡门
    mcdh_SN00801: {
        audio: "ext:梦澈涤花/audio/skill:2",
        mod: {
            selectTarget(card, player, range) {
                if (card.name != "sha") return;
                if (range[1] == -1) return;
                if (!card.storage?.mcdh_SN00801?.includes(2)) return;
                range[1] += 1;
            },
        },
        getNum() {
            return game.filterPlayer(target => {
                if (target.hasSkill("mcdh_SN00802")) return true;
                return game.getGlobalHistory(
                    "everything",
                    evt => {
                        return evt.player == target && evt.name == "changeSkills" && evt.removeSkill.includes("mcdh_SN00802");
                    }
                ).length
            }).length;
        },
        enable: "phaseUse",
        usable: 1,
        locked: false,
        filter(event, player) {
            return lib.skill.mcdh_SN00801.getNum() > 0;
        },
        check(card) {
            var val = get.value(card);
            return 5 - val;
        },
        chooseButton: {
            dialog() {
                var dialog = ui.create.dialog(
                    "无声的歌者",
                    [
                        [
                            [1, "⒈此【杀】需使用两张【闪】"],
                        ],
                        "tdnodes",
                    ],
                    [
                        [
                            [2, "⒉此【杀】可额外指定目标"],
                        ],
                        "tdnodes",
                    ],
                    [
                        [
                            [3, "⒊此【杀】的基础伤害+1"],
                        ],
                        "tdnodes",
                    ],
                );
                return dialog;
            },
            select() {
                const num = lib.skill.mcdh_SN00801.getNum();
                return [1, num];
            },
            check(button) {
                let player = get.player();
                switch (button.link) {
                    default:
                        return 1 + Math.random();
                }
            },
            backup(links, player) {
                return {
                    viewAs: {
                        name: "sha",
                        nature: "thunder",
                        storage: {
                            mcdh_SN00801: links,
                        },
                    },
                    filterCard: true,
                    check(card) {
                        return 7 - get.value(card);
                    },
                    log: false,
                    async content(event, trigger, player) {
                        player.logSkill("mcdh_SN00801");
                        const links = event.result.card?.storage?.mcdh_SN00801;
                        if (links?.includes(1)) {
                            event.result._apply_args = {
                                shanReq: 2,
                                numx: links.includes(3) ? 1 : 0,
                                oncard: () => {
                                    var evt = get.event();
                                    for (var target of game.filterPlayer(null, null, true)) {
                                        var id = target.playerid;
                                        var map = evt.customArgs;
                                        if (!map[id]) {
                                            map[id] = {};
                                        }
                                        map[id].shanRequired = evt.shanReq;
                                    }
                                    evt.baseDamage += evt.numx;
                                },
                            };
                        }
                    },
                    ai: {
                        result: {
                            player: 1,
                        },
                    },
                };
            },
            prompt(links, player) {
                return "将一张牌当做雷【杀】使用";
            },
        },
        ai: {
            order() {
                return get.order({ name: "sha" }) + 0.1;
            },
            result: {
                target(player, target, card, isLink) {
                    return lib.card.sha.ai.result.target(player, target, card, isLink);
                },
            },
        },
        subSkill: {
            backup: {},
        },
    },
    mcdh_SN00802: {
        nobracket: true,
        trigger: {
            global: "dying",
        },
        skillAnimation: true,
        animationColor: "thunder",
        filter(event, player) {
            return event.player != player;
        },
        check(event, player) {
            return get.attitude(player, event.player) >= 0;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            await trigger.player.chooseDrawRecover(2, 1);
            await trigger.player.addSkills(event.name);
        },
    },
    //巫恋
    mcdh_MIS201301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: ["chooseToUse", "chooseToRespond"],
        usable: 1,
        viewAs: {
            name: "shan",
            isCard: true,
        },
        viewAsFilter(player) {
            if (!player.countCards("H")) return false;
        },
        filterCard: () => false,
        selectCard: -1,
        log: false,
        async precontent(event, trigger, player) {
            player.logSkill("mcdh_MIS201301");
            player.when("useCardAfter")
                .filter(event => event.skill == "mcdh_MIS201301")
                .then(async (event, trigger, player) => {
                    if (player.countCards("h") > _status.currentPhase.countCards("h")) {
                        await player.chooseToDiscard("he", true);
                    }
                });
        }
    },
    mcdh_MIS201302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.countCards("he") > 0;
        },
        filterTarget(card, player, target) {
            if (player == target) return false;
            if (ui.selected.targets.length == 1) {
                return target.canUse({ name: "sha" }, ui.selected.targets[0], false);
            }
            return true;
        },
        filterCard: true,
        targetprompt: ["给牌", "用杀"],
        check(card) {
            if (_status.event.player.hp == 1) return 8 - get.value(card);
            return 6 - get.value(card);
        },
        selectTarget: 2,
        complexTarget: true,
        multitarget: true,
        lose: false,
        discard: false,
        delay: false,
        async content(event, trigger, player) {
            await player.give(event.cards, event.targets[0]);
            const card = new lib.element.VCard({ name: "sha" });
            const useCardEvent = event.targets[1].useCard(card, event.targets[0], false, "noai");
            useCardEvent.animate = false;
            await game.delay(0.5);
        },
        ai: {
            order: 8,
            result: {
                target(player, target) {
                    if (ui.selected.targets.length == 0) {
                        return -3;
                    } else {
                        return get.effect(target, { name: "sha" }, ui.selected.targets[0], target);
                    }
                },
            },
            expose: 0.4,
            threaten: 3,
        },
    },
    //史都华德
    mcdh_RHA400201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            for (var i of lib.inpile) {
                var type = get.type2(i);
                if (!["juedou", "nanman", "wanjian", "sha"].includes(i)) continue;
                if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
                    return !player.getStorage("mcdh_RHA400201").includes(i);
                }
            }
            return false;
        },
        chooseButton: {
            dialog(event, player) {
                var list = [];
                for (var i = 0; i < lib.inpile.length; i++) {
                    var name = lib.inpile[i];
                    if (!["juedou", "nanman", "wanjian", "sha"].includes(name)) continue;
                    if (player.hasStorage("mcdh_RHA400201", name)) continue;
                    if (name == "sha") {
                        if (event.filterCard(get.autoViewAs({ name: name, nature: "ice" }, "unsure"), player, event)) {
                            list.push(["基本", "", "sha", "ice"]);
                        }
                    } else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
                        list.push(["锦囊", "", name]);
                    }
                }
                return ui.create.dialog("呼啸雪蓝", [list, "vcard"]);
            },
            check(button) {
                if (_status.event.getParent().type != "phase") {
                    return 1;
                }
                var player = _status.event.player;
                return player.getUseValue({
                    name: button.link[2],
                    nature: button.link[3],
                });
            },
            backup(links, player) {
                return {
                    viewAs: {
                        name: links[0][2],
                        nature: links[0][3]
                    },
                    filterCard: true,
                    selectCard: 1,
                    popname: true,
                    check(card) {
                        return 6 - get.value(card);
                    },
                    position: "hes",
                    log: false,
                    async precontent(event, trigger, player) {
                        player.logSkill("mcdh_RHA400201");
                        player.markAuto("mcdh_RHA400201", [event.result.card.name]);
                    },
                }
            },
            prompt(links, player) {
                return "将一张牌当" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
            },
        },
        ai: {
            order: 1,
            result: {
                player: 1,
            },
        },
    },
    mcdh_RHA400202: {
        audio: "ext:梦澈涤花/audio/skill:1",
        shaRelated: true,
        trigger: {
            player: "useCardToTargeted",
        },
        filter(event, player) {
            if (!event.target.getEquips(2).length && !event.target.isMaxHandcard()) return false;
            return get.is.damageCard(event.card);
        },
        check(event, player) {
            return get.attitude(player, event.target) <= 0;
        },
        logTarget: "target",
        async content(event, trigger, player) {
            await player.draw();
            if (trigger.target.getEquips(2).length) {
                trigger.target.addTempSkill("mcdh_RHA400202_effect");
            }
            if (trigger.target.isMaxHandcard()) {
                await trigger.target.chooseToDiscard("he", true);
            }
        },
        subSkill: {
            effect: {
                charlotte: true,
                ai: {
                    "unequip2": true,
                },
            },
        },
    },
    //雪雉
    mcdh_MISO00801: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseBegin",
        },
        filter(event, player) {
            return event.player != player && player.countCards("he") && event.player.countDiscardableCards(player, "j");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill, trigger.player), "he", "chooseonly")
                .set("ai", card => {
                    const player = get.player();
                    if (get.attitude(player, trigger.player) <= 0) return 0;
                    return 7 - get.value(card);
                })
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            await player.discardPlayerCard(trigger.player, "j", true);
        },
    },
    mcdh_MISO00802: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        frequent: true,
        filter(event, player) {
            var evt = event.getl(player);
            if (!evt || !evt.cards2 || !evt.cards2.length) {
                return false;
            }
            var history = player.getHistory("lose", function (evt) {
                return evt.cards2 && evt.cards2.length;
            });
            if (event.name == "lose") {
                if (history.indexOf(event) != 2) {
                    return false;
                }
            } else {
                if (
                    !player.hasHistory("lose", function (evt) {
                        return evt.getParent() == event && history.indexOf(evt) == 2;
                    })
                ) {
                    return false;
                }
            }
            return true;
        },
        async content(event, trigger, player) {
            const cards = get.cards(3);
            await game.cardsGotoOrdering(cards);
            if (_status.connectMode) {
                game.broadcastAll(function () {
                    _status.noclearcountdown = true;
                });
            }
            event.given_map = {};
            if (!cards.length) {
                return;
            }
            // event.goto -> do while
            do {
                const { bool, links } =
                    cards.length == 1
                        ? { links: cards.slice(0), bool: true }
                        : await player.chooseCardButton("览阅千卷：请选择要分配的牌", true, cards, [1, cards.length]).set("ai", () => {
                            if (ui.selected.buttons.length == 0) {
                                return 1;
                            }
                            return 0;
                        }).forResult();
                if (!bool) {
                    return;
                }
                cards.removeArray(links);
                event.togive = links.slice(0);
                const { targets } = await player
                    .chooseTarget("选择一名角色获得" + get.translation(links), true)
                    .set("ai", target => {
                        const att = get.attitude(_status.event.player, target);
                        if (_status.event.enemy) {
                            return -att;
                        } else if (att > 0) {
                            return att / (1 + target.countCards("h"));
                        } else {
                            return att / 100;
                        }
                    })
                    .set("enemy", get.value(event.togive[0], player, "raw") < 0)
                    .forResult();
                if (targets.length) {
                    const id = targets[0].playerid,
                        map = event.given_map;
                    if (!map[id]) {
                        map[id] = [];
                    }
                    map[id].addArray(event.togive);
                }
            } while (cards.length > 0);
            if (_status.connectMode) {
                game.broadcastAll(function () {
                    delete _status.noclearcountdown;
                    game.stopCountChoose();
                });
            }
            const list = [];
            for (const i in event.given_map) {
                const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
                player.line(source, "green");
                if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) {
                    player.addExpose(0.2);
                }
                list.push([source, event.given_map[i]]);
            }
            game.loseAsync({
                gain_list: list,
                giver: player,
                animate: "draw",
            }).setContent("gaincardMultiple");
        },
    },
    //炎狱炎熔
    mcdh_MISO00901: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            source: "damageBegin1",
            player: "damageBegin3",
            global: "dying",
        },
        forced: true,
        filter(event, player) {
            if (event.name == "dying") {
                return event.reason?.name == "damage" && event.getParent("damage")?.hasNature();
            }
            return event.hasNature("fire");
        },
        async content(event, trigger, player) {
            if (trigger.name == "dying") {
                await player.draw(2);
            } else {
                trigger.num += (event.triggername == "damageBegin1" ? 1 : -1);
            }
        },
        ai: {
            effect: {
                target(card, player, target, current) {
                    if (get.tag(card, "fireDamage") && current < 0) return -2;
                },
                player(card, player, target, current) {
                    if (get.tag(card, "fireDamage") && current < 0) return 2;
                },
            },
        },
    },
    mcdh_MISO00902: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "damageBegin3",
        },
        mcdhCharge: 2,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_MISO00902")) return false;
            return !event.hasNature("fire");
        },
        check(event, player) {
            const target = event.player,
                source = event.source || player;
            if (get.damageEffect(target, source, source, "fire") < get.damageEffect(target, source, source) - 5) {
                return false;
            }
            return true;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            player.mcdh_removeCharge(2);
            game.setNature(trigger, "fire");
        },
        ai: {
            fireAttack: true,
        },
    },
    //坚城塞雷娅
    mcdh_CW00601: {
        nobracket: true,
        trigger: {
            target: "useCardToTargeted",
            global: "useCard",
        },
        forced: true,
        filter(event, player, name) {
            if (event.player == player) return false;
            if (name == "useCardToTargeted") {
                return event.targets.length == 1;
            }
            return player == _status.currentPhase;
        },
        async content(event, trigger, player) {
            const eff = get.effect(player, trigger.card, trigger.player, trigger.player);
            const result = await trigger.player
                .chooseToDiscard("阻断如隔：弃置一张牌，否则" + get.translation(trigger.card) + "无效", "he")
                .set("ai", function (card) {
                    if (_status.event.eff > 0) {
                        return 10 - get.value(card);
                    }
                    return 0;
                })
                .set("eff", eff)
                .forResult();
            if (!result?.bool) {
                if (trigger.name == "useCard") {
                    trigger.targets.length = 0;
                    trigger.all_excluded = true;
                } else {
                    trigger.getParent().excluded.add(player);
                }
            }
        },
        ai: {
            effect: {
                target(card, player, target, current) {
                    if (get.attitude(player, target) < 0) {
                        if (_status.event.name == "mcdh_CW00601") {
                            return;
                        }
                        if (get.attitude(player, target) > 0 && current < 0) {
                            return "zerotarget";
                        }
                        const bs = player.getCards("h", { type: "basic" });
                        bs.remove(card);
                        if (card.cards) {
                            bs.removeArray(card.cards);
                        } else {
                            bs.removeArray(ui.selected.cards);
                        }
                        if (!bs.length) {
                            return "zerotarget";
                        }
                        if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) {
                            return;
                        }
                        if (bs.length <= 2) {
                            for (let i = 0; i < bs.length; i++) {
                                if (get.value(bs[i]) < 7) {
                                    return [1, 0, 1, -0.5];
                                }
                            }
                            return [1, 0, 0.3, 0];
                        }
                        return [1, 0, 1, -0.5];
                    }
                },
            },
        },
    },
    //槐琥
    mcdh_LDA00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return game.hasPlayer(target => lib.skill.mcdh_LDA00301.filterTarget(null, player, target));
        },
        filterTarget(card, player, target) {
            return player != target && player.canCompare(target);
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            const result = await player.chooseToCompare(target).forResult();
            if (result.bool) {
                if (_status.connectMode) {
                    game.broadcastAll(function () {
                        _status.noclearcountdown = true;
                    });
                }
                const lose_list = [];
                let num = 2;
                let log = false;
                while (num > 0) {
                    const result = await player
                        .chooseTarget(get.prompt("mcdh_LDA00301"), `弃置任意名角色区域内的累计至多${num}张牌`, (card, player, target) => {
                            return target.hasCard(card => {
                                return lib.filter.canBeDiscarded(card, player, target, "dcluochong");
                            }, "he");
                        })
                        .set("ai", target => {
                            const player = _status.event.player,
                                discarded = _status.event.lose_list.find(item => item[0] == target);
                            if (discarded) {
                                if (target == player) {
                                    return 0;
                                }
                                const num = discarded[1].length;
                                if (num > 1 && player.hp + player.hujia > 2) {
                                    return 0;
                                }
                            }
                            if (target == player) {
                                if (ui.cardPile.childNodes.length > 80 && player.hasCard(card => get.value(card) < 8)) {
                                    return 20;
                                }
                                return 0;
                            }
                            return get.effect(target, { name: "guohe_copy2" }, player, player);
                        })
                        .set("lose_list", lose_list)
                        .forResult();
                    if (result.bool) {
                        const target = result.targets[0];
                        const result2 = await player
                            .choosePlayerCard(target, true, "he", [1, num], `选择弃置${get.translation(target)}的牌`)
                            .set("filterButton", button => {
                                const card = button.link,
                                    target = _status.event.target,
                                    player = get.player();
                                return lib.filter.canBeDiscarded(card, player, target, "mcdh_LDA00301");
                            })
                            .set("lose_list", lose_list)
                            .set("ai", button => {
                                if (ui.selected.buttons.length > 0) {
                                    return false;
                                }
                                var val = get.buttonValue(button);
                                if (get.attitude(_status.event.player, _status.event.target) > 0) {
                                    return -val;
                                }
                                return val;
                            })
                            .forResult();
                        if (result2.bool && result2.cards?.length) {
                            const cards = result2.cards;
                            num -= cards.length;
                            const index = lose_list.find(item => item[0] == target);
                            if (!index) {
                                lose_list.push([target, cards]);
                            } else {
                                index[1].addArray(cards);
                            }
                            await target.discard(cards, "notBySelf").set("discarder", player);
                            await target.draw(cards.length);
                        }
                    } else {
                        break;
                    }
                }
                if (_status.connectMode) {
                    game.broadcastAll(function () {
                        delete _status.noclearcountdown;
                        game.stopCountChoose();
                    });
                }
            } else {
                if (player.countCards("he")) {
                    await player.chooseToDiscard("he", true);
                }
            }
        },
        ai: {
            order: 8,
            result: {
                target(player, target) {
                    return -1;
                },
            },
        },
    },
    mcdh_LDA00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        derivation: "mcdh_LDA00303",
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        filter(event, player) {
            return !player.countCards("h");
        },
        async content(event, trigger, player) {
            if (player.hasSkill("mcdh_LDA00303")) event.result = { index: 1 };
            else event.result = await player
                .chooseControl("获得技能", "摸两张牌")
                .set("prompt", `武欲精通：选择获得${get.poptip("mcdh_LDA00303")}或摸两张牌`)
                .set("ai", () => {
                    const player = get.player();
                    if (player.hasSkill("mcdh_LDA00303")) return 1;
                    return 0;
                })
                .forResult();
            if (event.result.index == 0) {
                await player.addSkills("mcdh_LDA00303");
            } else {
                await player.draw(2);
            }
        },
    },
    mcdh_LDA00303: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseEnd",
        },
        filter(event, player) {
            var suits = [];
            game.getGlobalHistory("cardMove", function (evt) {
                if (suits.length >= 4) {
                    return;
                }
                if (evt.name == "lose") {
                    if (evt.position == ui.discardPile) {
                        for (var i of evt.cards) {
                            suits.add(get.suit(i, false));
                        }
                    }
                } else {
                    if (evt.name == "cardsDiscard") {
                        for (var i of evt.cards) {
                            suits.add(get.suit(i, false));
                        }
                    }
                }
            });
            return suits.length >= 4;
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, "roundStart", false);
            player.insertPhase();
        },
    },
    //阿
    mcdh_LDA00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "useCardToPlayered",
        },
        frequent: true,
        filter(event, player, name) {
            if (!event.isFirstTarget || !event.targets?.length) {
                return false;
            }
            if (get.color(event.card) == "black") {
                return event.target == player && event.targets?.length == 1 && player.isDamaged();
            }
            return get.color(event.card) == "red" && event.target != player && !event.targets?.includes(player);
        },
        async content(event, trigger, player) {
            await player[get.color(trigger.card) == "black" ? "recover" : "draw"]();
        },
    },
    mcdh_LDA00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "dying",
        },
        filter(event, player) {
            if (event.player == player) return false;
            if (!event.player.countCards("h")) return false;
            return event.reason?.name == "damage" && event.source != player;
        },
        check(event, player) {
            if (get.attitude(player, event.player) > 0) return true;
            if (event.player.countCards("h") > 4) return true;
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, "roundStart", false);
            const hs = trigger.player.getCards("h");
            const card = new lib.element.VCard({ name: "tao" }, hs);
            if (lib.filter.cardSavable(card, player, trigger.player)) {
                await player.useCard(card, hs, trigger.player);
            }
            const cards = hs.filter(card => get.color(card) == "red");
            if (cards.length) {
                await player.gain(cards, "gain2");
            }
        },

    },
    //杜林
    mcdh_RHAF00301: {
        nobracket: true,
        mod: {
            maxHandcard(player, num) {
                return num + 1;
            },
            cardUsable(card, player, num) {
                if (card.name == "sha") return num + 1;
            },
        },
        trigger: {
            player: "phaseDrawBegin2",
        },
        forecd: true,
        locked: true,
        filter(event, player) {
            return !event.numFixed;
        },
        async content(event, trigger, player) {
            trigger.num++;
        },
        ai: {
            threaten: 2.3,
        },
    },
    mcdh_RHAF00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            target: "useCardToTargeted",
        },
        filter(event, player) {
            return event.player.hp > player.hp && player.isDamaged();
        },
        check(event, player) {
            return get.recoverEffect(player, player, player) > 0;
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, "roundStart", false);
            await player.recover();
        },
    },
    mcdh_RHAF00303: {
        nobracket: true,
        mod: {
            cardEnabled(card, player) {
                if (player.countMark("mcdh_RHAF00303_effect") >= 4) return false;
            },
            cardUsable(card, player) {
                if (player.countMark("mcdh_RHAF00303_effect") >= 4) return false;
            },
            cardSavable(card, player) {
                if (player.countMark("mcdh_RHAF00303_effect") >= 4) return false;
            },
        },
        init(player) {
            if (player.hasMark("mcdh_RHAF00303_effect")) {
                const num = player.getRoundHistory("useCard").length;
                if (num > 0) {
                    player.addMark("mcdh_RHAF00303_effect");
                }
            }
        },
        group: "mcdh_RHAF00303_effect",
        subSkill: {
            effect: {
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                silent: true,
                firstDo: true,
                charlotte: true,
                onremove: true,
                filter(event, player) {
                    return player.countMark("mcdh_RHAF00303_effect") < 4;
                },
                async content(event, trigger, player) {
                    player.addTempSkill("mcdh_RHAF00303_effect", "roundStart");
                    player.addMark("mcdh_RHAF00303_effect", 1, false);
                },
            },
        },
    },
    //巡林者
    mcdh_RHAF00401: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "phaseBegin",
        },
        async cost(event, trigger, player) {
            const list = ["无次数限制", "无距离限制"];
            list.removeArray(player.getStorage("mcdh_RHAF00402_delete"));
            if (!list.length) return;
            if (list.length == 1) {
                event.result = await player
                    .chooseBool(get.prompt(event.skill), "令本回合你使用的【杀】" + list[0])
                    .forResult();
                event.result.cost_data = list[0];
            } else {
                event.result = await player
                    .chooseControl(list, "cancel2")
                    .set("prompt", `###${get.prompt(event.skill)}###令本回合你使用的【杀】获得一个效果`)
                    .forResult();
                if (event.result.control != "cancel2") {
                    event.result.cost_data = event.result.control;
                }
            }
        },
        async content(event, trigger, player) {
            const effect = (event.cost_data == "无次数限制" ? "nousable" : "nodistance");
            player.addTempSkill("mcdh_RHAF00401_effect");
            player.markAuto("mcdh_RHAF00401_effect", [effect])
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (!player.hasStorage("mcdh_RHAF00401_effect", "nousable")) return;
                        if (card.name == "sha") return Infinity;
                    },
                    targetInRange(card, player, target) {
                        if (!player.hasStorage("mcdh_RHAF00401_effect", "nodistance")) return;
                        if (card.name == "sha") return true;
                    },
                },
            },
        },
    },
    mcdh_RHAF00402: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        derivation: ["redangxian", "relieren"],
        trigger: {
            global: "roundStart",
        },
        forced: true,
        juexingji: true,
        skillAnimation: true,
        animationColor: "fire",
        filter(event, player) {
            return game.roundNumber == 2;
        },
        async content(event, trigger, player) {
            player.awakenSkill("mcdh_RHAF00402");
            const list = ["无次数限制", "无距离限制"];
            list.removeArray(player.getStorage("mcdh_RHAF00402_delete"));
            if (!list.length) return;
            const { control } = await player
                .chooseControl(list)
                .set("prompt", "忆往昔峥嵘岁月稠：移除无次数限制选项获得〖当先〗，或移除无距离限制选项获得〖烈刃〗")
                .forResult();
            player.addSkill("mcdh_RHAF00402_delete");
            player.markAuto("mcdh_RHAF00402_delete", [control]);
            await player.addSkills(control == "无次数限制" ? "redangxian" : "relieren");
        },
        subSkill: {
            delete: {
                charlotte: true,
            },
        },
    },
    //山
    mcdh_MB00101: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        derivation: "mcdh_MB00102",
        trigger: {
            global: "cardsDiscardAfter",
        },
        filter(event, player) {
            var evt = event.getParent();
            if (evt.name != "orderingDiscard") {
                return false;
            }
            var evtx = evt.relatedEvent || evt.getParent();
            return (
                evtx.name == "useCard" &&
                ["basic", "trick"].includes(get.type(evtx.card)) &&
                evtx.card.isCard && evtx.cards && evtx.cards.length == 1 &&
                event.cards.filterInD("d").length == 1
            );
        },
        async cost(event, trigger, player) {
            const cards = trigger.getd();
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill), "he", "chooseonly")
                .set("cards", cards)
                .set("filterCard", card => {
                    const cards = get.event().cards;
                    return (
                        cards.some(cardx => get.type2(card) == get.type2(cardx)) &&
                        cards.some(cardx => get.color(card) == get.color(cardx))
                    )
                })
                .set("ai", card => {
                    const player = get.player();
                    const cards = get.event().cards;
                    if (cards.every(i => get.value(i) < 6.6)) return 0;
                    return 7 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const card = event.cards[0];
            await player.discard(event.cards);
            await player.changeSkills(["mcdh_MB00102"], ["mcdh_MB00101"]);
            if (player.hasUseTarget(card)) {
                await player.chooseUseTarget(card, true, false);
            }
        },
    },
    mcdh_MB00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        derivation: "mcdh_MB00101",
        trigger: {
            global: "phaseJieshuBegin",
        },
        popup: false,
        filter(event, player) {
            return game
                .getGlobalHistory("changeHp", function (evt) {
                    return evt.player == player;
                })
                .length;
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill))
                .set("ai", target => {
                    const player = get.player();
                    return get.damageEffect(target, player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            await target.damage();
            await player.changeSkills(["mcdh_MB00101"], ["mcdh_MB00102"]);
        },
    },
    //卡夫卡
    mcdh_MB00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        popup: false,
        filter(event, player) {
            if (event.player == player) return false;
            return (
                player.hasCard(function (card) {
                    return get.color(card) == "black" && get.type(card) != "basic";
                }, "he") &&
                event.player.canAddJudge({ name: "bingliang" })
            );
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCard(get.prompt2(event.skill), "he", card => {
                    return get.color(card) == "black" && get.type(card) != "basic";
                })
                .set("ai", target => {
                    var player = get.player();
                    var att = get.attitude(player, target);
                    if (att > 0) return 0;
                    return 7 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.logSkill(event.name, trigger.player);
            player.$give(card, target, false);
            await game.delay();
            await trigger.player.addJudge({ name: "bingliang" }, event.cards);
            const result = await trigger.player
                .chooseToDiscard("he", `你可以弃置一张非基本牌，令${get.translation(player)}摸一张牌并弃置你判定区内的一张牌`)
                .set("filterCard", function (card) {
                    const player = get.player();
                    return get.type(card) != "basic";
                })
                .set("ai", card => {
                    if (_status.event.goon) {
                        return 7 - get.value(card);
                    }
                    return 0;
                })
                .set(
                    "goon",
                    (() => {
                        if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
                            return false;
                        }
                        return player.hasCard(function (card) {
                            if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
                                return false;
                            }
                            return (
                                get.effect(
                                    player,
                                    {
                                        name: card.viewAs || card.name,
                                        cards: [card],
                                    },
                                    player,
                                    player
                                ) < 0
                            );
                        }, "j");
                    })()
                )
                .forResult();
            if (result.bool) {
                await player.draw();
                if (trigger.player.countDiscardableCards(player, "j")) {
                    await player.discardPlayerCard(trigger.player, "j", true);
                }
            }
        },
    },
    mcdh_MB00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: ["phaseDrawSkipped", "phaseDrawCancelled"]
        },
        direct: true,
        filter(event, player) {
            return event.player != player && player.canUse({ name: "sha" }, event.player, false, false);
        },
        async content(event, trigger, player) {
            const next = player.chooseUseTarget({ name: "sha" }, trigger.player);
            next.set("prompt", get.prompt2(event.name, trigger.player));
            next.set("logSkill", [event.name, trigger.player]);
            await next;
        },
    },
    //松果
    mcdh_MB00401: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "chooseToUse",
        usable: 1,
        mcdhCharge: 0,
        filter(event, player) {
            return player.hasCard(card => {
                const type = get.type(card, player);
                if (type == "trick" || type == "basic") {
                    return (
                        event.filterCard(
                            get.autoViewAs({
                                name: get.name(card, player),
                                suit: get.suit(card, player),
                                nature: get.nature(card, player),
                                number: get.number(card, player),
                            }),
                            player,
                            event
                        )
                    );
                }
                return false;
            }, "h");
        },
        filterCard(card, player, event) {
            event = event || _status.event;
            const type = get.type(card, player);
            if (type == "trick" || type == "basic") {
                return (
                    event._backup.filterCard(
                        get.autoViewAs({
                            name: get.name(card, player),
                            suit: get.suit(card, player),
                            nature: get.nature(card, player),
                            number: get.number(card, player),
                        }),
                        player,
                        event
                    )
                );
            }
            return false;
        },
        ignoreMod: true,
        position: "h",
        viewAs(cards, player) {
            if (cards.length) {
                const card = cards[0];
                return card;
            }
            return null;
        },
        viewAsFilter(player) {
            if (!player.mcdh_countCharge()) return false;
        },
        selectTarget() {
            const player = get.player();
            return [1, player.mcdh_countCharge()];
        },
        prompt: "使用手牌中一张无距离限制且指定目标数为X的基本牌或普通锦囊牌，若为伤害牌，摸一张牌",
        log: false,
        async precontent(event, trigger, player) {
            player.logSkill("mcdh_MB00401");
            await player.mcdh_removeCharge(event.result.targets.length);
            player.when("useCard")
                .filter(event => event.skill == "mcdh_MB00401")
                .then(() => {
                    if (get.is.damageCard(trigger.card)) {
                        player.draw();
                    }
                });
        },
        ai: {
            order: 7,
            result: {
                player: 1,
            },
        },
        hiddenCard(player, name) {
            return player.hasCard(card => {
                const type = get.type(card, player);
                if (type == "trick" || type == "basic") {
                    return get.name(card, player) == name;
                }
                return false;
            }, "h");
        },
    },
    mcdh_MB00402: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "mcdh_addChargeBegin1",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return !player.hasSkill("mcdh_MB00402_used");
        },
        async content(event, trigger, player) {
            player.addTempSkill("mcdh_MB00402_used", "roundStart");
            trigger.num++;
        },
        group: "mcdh_MB00402_use",
        subSkill: {
            use: {
                audio: "mcdh_MB00402",
                enable: "chooseToUse",
                filter(event, player) {
                    if (event.type == "dying") {
                        if (player != event.dying) return false;
                        return true;
                    }
                    return false;
                },
                prompt: "你可以失去〖备用工具〗并清空技力，然后回复等量体力并摸等量张牌。",
                async content(event, trigger, player) {
                    await player.removeSkills("mcdh_MB00402");
                    const num = player.mcdh_countCharge();
                    await player.mcdh_removeCharge(num);
                    await player.recover(num);
                    await player.draw(num);
                },
                ai: {
                    order: 1,
                    save: true,
                    skillTagFilter(player, arg, target) {
                        if (player != target) return false;
                        return true;
                    },
                    result: {
                        player: 1,
                    },
                },
            },
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    //杜玛
    mcdh_MB00501: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        popup: false,
        filter(event, player) {
            if (player.countCards("h") > player.hp) return false;
            var evt = event.getl(player);
            return evt && evt.hs && evt.hs.length > 0;
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return target.countCards("h") >= target.getHp();
                })
                .set("ai", target => {
                    const player = get.player();
                    return -get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const cards = get.cards(5);
            await game.cardsGotoOrdering(cards);
            await player.showCards(cards);
            const names = cards.reduce((list, card) => list.add(card.name), []);
            if (target.countCards("he", card => !names.includes(card.name))) {
                const next = target.chooseToDiscard("he", true);
                next.filterCard = card => !names.includes(card.name);
                await next;
            } else {
                await target.showHandcards();
            }
        },
    },
    mcdh_MB00502: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "chooseToUse",
        limited: true,
        skillAnimation: true,
        animationColor: "thunder",
        filter(event, player) {
            return event.type == "dying" && event.dying;
        },
        filterTarget(card, player, target) {
            return target == _status.event.dying;
        },
        selectTarget: -1,
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            await target.recoverTo(1);
            target.addSkill("mcdh_MB00502_mark");
            if (target.hasMark("mcdh_MB00502_mark")) {
                target.addMark("mcdh_MB00502_mark");
            }
            player.addSkill("mcdh_MB00502_restore");
        },
        ai: {
            order: 1,
            expose: 0.5,
            result: {
                target(player, target) {
                    return get.sgnAttitude(player, target);
                },
            },
        },
        subSkill: {
            mark: {
                trigger: {
                    player: "dying",
                },
                forced: true,
                onremove: true,
                charlotte: true,
                filter(event, player) {
                    return player.hasMark("mcdh_MB00502_mark");
                },
                logTarget: "player",
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                    await player.die();
                },
                mark: true,
                marktext: "葬",
                intro: {
                    name: "仪葬",
                    content: "你下次进入濒死时立即死亡",
                },
            },
            restore: {
                trigger: {
                    global: "washCard",
                },
                forced: true,
                charlotte: true,
                async content(event, trigger, player) {
                    player.restoreSkill("mcdh_MB00502");
                    if (!game.hasPlayer(target => target.hasMark("mcdh_MB00502_mark"))) return;
                    const result = await player
                        .chooseTarget(get.prompt("mcdh_MB00502"), "你可以移去任意名角色的「仪葬」标记", [1, Infinity])
                        .set("filterTarget", (card, player, target) => {
                            return target.hasMark("mcdh_MB00502_mark");
                        })
                        .set("ai", target => {
                            return get.attitude(get.player(), target);
                        })
                        .forResult();
                    if (result.bool) {
                        for (const target of result.targets) {
                            target.clearMark("mcdh_MB00502_mark");
                        }
                    }
                },
            },
        },
    },
    //缪尔赛思
    mcdh_RL00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseEnd",
        },
        frequent: true,
        filter(event, player) {
            return player.hasHistory("useCard", function (evt) {
                return get.type(evt.card) == "basic";
            });
        },
        async content(event, trigger, player) {
            const top = get.cards();
            await game.cardsGotoOrdering(top);
            const bottom = get.bottomCards();
            await game.cardsGotoOrdering(bottom);
            const cards = top.slice().addArray(bottom);
            await player.showCards(cards);
            if (cards.some(card => get.type(card) == "basic")) return;
            await player.gain(cards, "gain2");
        },
    },
    mcdh_RL00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        derivation: "mcdh_RL00303",
        trigger: {
            global: ["phaseBegin", "dying"],
        },
        limited: true,
        skillAnimation: true,
        animationColor: "water",
        filter(event, player) {
            return event.player != player && player.countCards("he");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCardTarget({
                    prompt: get.prompt2(event.skill, trigger.player),
                    filterCard: true,
                    filterTarget(card, player, target) {
                        const trigger = _status.event.getTrigger();
                        return target == trigger.player;
                    },
                    ai1(card) {
                        return 10 - get.value(card);
                    },
                    ai2(target) {
                        const player = get.player();
                        return get.attitude(player, target);
                    },
                })
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            player.awakenSkill("mcdh_RL00302");
            player.give(event.cards, trigger.player);
            const tao = get.autoViewAs({ name: "tao", isCard: true });
            await player.useCard(tao, trigger.player);
            await trigger.player.addSkills("mcdh_RL00303");
        },
    },
    mcdh_RL00303: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        global: "mcdh_RL00303_global",
        subSkill: {
            global: {
                trigger: {
                    global: ["phaseBegin", "dying"],
                },
                filter(event, player) {
                    if (!get.is.playerNames(player, "mcdh_RL003_Muelsyse")) return false;
                    return event.player.hasSkill("mcdh_RL00303") && event.player != player && player.countCards("he");
                },
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseCardTarget({
                            prompt: get.prompt2(event.skill, trigger.player),
                            filterCard: true,
                            filterTarget(card, player, target) {
                                const trigger = _status.event.getTrigger();
                                return target == trigger.player;
                            },
                            ai1(card) {
                                return 10 - get.value(card);
                            },
                            ai2(target) {
                                const player = get.player();
                                return get.attitude(player, target);
                            },
                        })
                        .forResult();
                },
                async content(event, trigger, player) {
                    player.give(event.cards, trigger.player);
                    const tao = get.autoViewAs({ name: "tao", isCard: true });
                    await player.useCard(tao, trigger.player);
                },
            },
        },
    },
    //切利尼娜·德克萨斯
    mcdh_IS00101: {
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.countCards("h") > 0;
        },
        filterCard: true,
        position: "he",
        check(card) {
            let val = get.value(card);
            if (get.type(card) == "basic") {
                return 8 - get.value(card);
            }
            return 5 - get.value(card);
        },
        filterTarget(card, player, target) {
            return player != target;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            await player.draw();
            const cards = target.getCards("h", card => {
                if (target.canRecast(card)) return false;
                return get.type2(card) == get.type2(event.cards[0]);
            });
            if (cards.length) {
                await target.recast(cards);
            } else {
                const card = new lib.element.VCard({ name: "sha" });
                if (player.canUse(card, target, false, false)) {
                    await player.useCard(card, target, false);
                }
            }
        },
        ai: {
            order: 8,
            result: {
                target(player, target) {
                    const card = new lib.element.VCard({ name: "sha" });
                    return get.effect(target, card, player);
                },
            },
        },
    },
    mcdh_IS00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            source: "damageBegin2",
        },
        filter(event, player) {
            return event.player != player;
        },
        async cost(event, trigger, player) {
            const list = [],
                target = trigger.player;
            list.push("失去体力");
            if (target.countDiscardableCards(player, "he")) {
                list.push("弃置牌");
            }
            if (player.hasCard(card => {
                return get.type(card, null, player) != "basic" && lib.filter.cardDiscardable(card, player, "mcdh_IS00102");
            }, "he")) {
                list.push("背水！");
            }
            event.result = await player
                .chooseControl(list, "cancel2")
                .set("prompt", `###${get.prompt(event.skill, trigger.player)}###防止此伤害并选择令其失去1点体力或弃置其一张牌`)
                .set("ai", () => {
                    const player = get.player();
                    const trigger = get.event().getTrigger();
                    const target = trigger.player;
                    let controls = get.event().controls;
                    if (get.attitude(player, target) > 0) {
                        return "弃置牌";
                    }
                    return "cancel2";
                })
                .forResult();
            if (event.result.control != "cancel2") {
                event.result.cost_data = event.result.control;
            }
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const control = event.cost_data,
                target = trigger.player;
            trigger.cancel();
            if (["失去体力", "背水！"].includes(control)) {
                await target.loseHp();
            }
            if (control == "弃置牌" || control == "背水！") {
                await player.discardPlayerCard(target, "he", true);
            }
            if (control == "背水！") {
                await player.chooseToDiscard("he", "弃置一张非基本牌", card => get.type(card) != "basic", true);
            }
        },
    },
    //能天使
    mcdh_PL00301: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseUseBegin",
        },
        filter(event, player) {
            return player.mcdh_hasAmmo("mcdh_PL00301");
        },
        async cost(event, trigger, player) {
            const num = player.mcdh_countAmmo();
            const list = Array.from({ length: num }, (_, i) => get.cnNumber(i + 1, true));
            event.result = await player
                .chooseControl(list, "cancel2")
                .set("prompt", get.prompt2(event.skill))
                .set("ai", () => {
                    const player = get.player();
                    const controls = get.event().controls.slice();
                    controls.remove("cancel2");
                    return controls[controls.length - 1];
                })
                .forResult();
            if (event.result.control != "cancel2") {
                event.result.cost_data = event.result.index + 1;
            }
        },
        async content(event, trigger, player) {
            const num = event.cost_data;
            const cards = get.cards(num);
            await game.cardsGotoOrdering(cards);
            await player.showCards(cards);
            const gains = cards.filter(card => get.type(card) != "basic");
            if (gains.length) {
                cards.removeArray(gains);
                await player.gain(gains, "gain2");
            }
            const sha = new lib.element.VCard({ name: "sha" });
            for (const card of cards) {
                await player.chooseUseTarget(sha, "nodistance", true, false);
            }
        },
    },
    mcdh_PL00302: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        trigger: {
            player: "useCardAfter",
        },
        forced: true,
        filter(event, player) {
            if (player.mcdh_countAmmo(true)) return false;
            if (_status.currentPhase != player) return false;
            if (!event.cards?.length) return false;
            if (get.type(event.card) == "equip") return false;
            return !player.hasHistory("sourceDamage");
        },
        async content(event, trigger, player) {
            player.mcdh_addAmmo();
        },
    },
    //截云
    mcdh_WB00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseDrawEnd",
        },
        filter(event, player) {
            var hs = player.getCards("h");
            return (
                hs.length > 0 &&
                player.getHistory("gain", function (evt) {
                    if (evt.getParent().name != "draw" || evt.getParent("phaseDraw") != event) {
                        return false;
                    }
                    for (var i of evt.cards) {
                        if (hs.includes(i)) {
                            return true;
                        }
                    }
                    return false;
                }).length > 0
            );
        },
        prompt2: "摸牌阶段结束时，你可以明置本阶段获得的牌。",
        async content(event, trigger, player) {
            var hs = player.getCards("h"),
                cards = [],
                suits = [];
            player.getHistory("gain", function (evt) {
                if (evt.getParent().name != "draw" || evt.getParent("phaseDraw") != trigger) {
                    return false;
                }
                for (var i of evt.cards) {
                    if (hs.includes(i)) {
                        cards.add(i);
                        suits.add(get.suit(i, player));
                    }
                }
            });
            player.addShownCards(cards, "visible_mcdh");
        },
        group: "mcdh_WB00201_use",
        subSkill: {
            use: {
                enable: "chooseToUse",
                filter(event, player) {
                    if (event.type == "wuxie" || !player.getShownCards().length) {
                        return false;
                    }
                    for (var name of ["jiu", "sha", "shan"]) {
                        if (event.filterCard({ name: name, isCard: true }, player, event)) {
                            return true;
                        }
                    }
                    return false;
                },
                chooseButton: {
                    dialog(event, player) {
                        var vcards = [];
                        for (var name of ["jiu", "sha", "shan"]) {
                            var card = { name: name, isCard: true };
                            if (event.filterCard(card, player, event)) {
                                vcards.push(["基本", "", name]);
                            }
                        }
                        var dialog = ui.create.dialog("探前路掷旧尘", [vcards, "vcard"], "hidden");
                        dialog.direct = true;
                        return dialog;
                    },
                    check(button) {
                        if (button.link[2] == "shan") return 3;
                        var player = _status.event.player;
                        if (button.link[2] == "jiu") {
                            if (player.getUseValue({ name: "jiu" }) <= 0) return 0;
                            if (player.countCards("h", "sha")) return player.getUseValue({ name: "jiu" });
                            return 0;
                        }
                        return player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
                    },
                    backup(links, player) {
                        return {
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                isCard: true,
                            },
                            filterCard(card) {
                                return get.is.shownCard(card);
                            },
                            selectCard: -1,
                            lose: false,
                            discard: false,
                            delay: false,
                            log: false,
                            async precontent(event, trigger, player) {
                                player.logSkill("mcdh_WB00201");
                                await player.recast(event.result.cards);
                                event.result.cards = [];
                            },
                        }
                    },
                },
                hiddenCard(player, name) {
                    if (!player.getShownCards().length) return false;
                    return ["jiu", "sha", "shan"].includes(name);
                },
                prompt(links, player) {
                    return "重铸所有明置牌并视为使用一张【" + get.translation(links[0][2]) + "】";
                },
                ai: {
                    order(item, player) {
                        return get.order({ name: "jiu" }) + 0.1;
                    },
                    respondShan: true,
                    respondSha: true,
                    skillTagFilter(player, tag) {
                        if (arg === "respond" || !player.getShownCards().length) return false;
                    },
                    result: {
                        player(player) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
            },
        },
    },
    mcdh_WB00202: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:1",
        derivation: "mcdh_WB00203",
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        forced: true,
        juexingji: true,
        skillAnimation: true,
        animationColor: "soil",
        filter(event, player) {
            const history = player.getAllHistory("useCard", evt => get.type(evt.card) == "basic");
            return history.reduce((list, evt) => list.add(evt.card.name), []).length >= 3;
        },
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            await player.loseMaxHp();
            await player.chooseDrawRecover(2, 1, true);
            await player.addSkill("mcdh_WB00203");
        },
    },
    mcdh_WB00203: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "useCardAfter",
        },
        filter(event, player) {
            return player.hasHistory("lose", function (evt) {
                if (evt.getParent() != event) return false;
                for (var i in evt.gaintag_map) {
                    if (evt.gaintag_map[i].includes("visible_mcdh")) return true;
                }
                return false;
            });
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, "roundStart", false);
            const cards = get.cards(2, true);
            await game.cardsGotoOrdering(cards);
            await player.showCards(card);
            const result = await player
                .chooseButton(["云动千里截此山晴：你可以使用其中一张牌", cards])
                .set("filterButton", button => {
                    var player = _status.event.player;
                    var card = button.link;
                    var cardx = {
                        name: get.name(card, get.owner(card)),
                        nature: get.nature(card, get.owner(card)),
                        cards: [card],
                    };
                    return player.hasUseTarget(cardx, null, false);
                })
                .set("ai", button => {
                    var card = button.link;
                    var fix = 1;
                    return fix * _status.event.player.getUseValue(card);
                })
                .forResult();
            if (result.bool) {
                var card = result.links[0];
                cards.remove(card);
                var cardx = {
                    name: get.name(card, get.owner(card)),
                    nature: get.nature(card, get.owner(card)),
                    cards: [card],
                };
                var next = player.chooseUseTarget(cardx, [card], true, false);
                if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) next.viewAs = false;
                if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
                    next.viewAs = false;
                }
            }
        },
    },
    //槐天裴
    mcdh_WB00501: {
        nobracket: true,
        trigger: {
            player: "phaseDrawEnd",
        },
        locked: true,
        filter(event, player) {
            return game.hasPlayer(target => player.canCompare(target))
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget("选择一名其他角色拼点", true)
                .set("filterTarget", (card, player, target) => {
                    return player.canCompare(target);
                })
                .set("ai", function (target) {
                    var player = _status.event.player,
                        att = get.attitude(target, player), cards = player.getCards("h");
                    var compara = false;
                    for (i of cards) {
                        if (i.number > 9) {
                            compara = true;
                            break;
                        }
                    }
                    if (player.hp < 3 && compara == false) return att > 0;
                    return att < 0;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            const result = await player.chooseToCompare(target).forResult();
            if (result.bool) {
                await player.recover();
            }
            else {
                player.addTempSkill("mcdh_WB00501_effect");
            }
        },
        subSkill: {
            effect: {
                mark: true,
                marktext: "路漫漫",
                intro: {
                    content: "防止你本回合造成伤害",
                },
                charlotte: true,
                direct: true,
                firstDo: true,
                trigger: {
                    source: "damageBefore",
                },
                content() {
                    trigger.cancel();
                },
                ai: {
                    effect: {
                        player(card, player, target) {
                            if (get.tag(card, "damage")) {
                                return "zeroplayertarget";
                            }
                        },
                    },
                },
            },
        },
    },
    mcdh_WB00502: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseJieshuBegin",
        },
        direct: true,
        filter(event, player) {
            return (
                player.countCards("h") == 1 &&
                game.hasPlayer(current =>
                    player.canUse(
                        {
                            name: "sha",
                            storage: { mcdh_WB00502: true },
                        },
                        current
                    )
                )
            );
        },
        async content(event, trigger, player) {
            var next = player.chooseToUse();
            next.set("openskilldialog", `###${get.prompt("mcdh_WB00502")}###将一张牌当【杀】使用，且当一名角色受到此【杀】伤害时，此伤害+X（X为其本回合回复过的体力值）。`);
            next.set("norestore", true);
            next.set("_backupevent", "mcdh_WB00502_backup");
            next.set("addCount", false);
            next.set("logSkill", "mcdh_WB00502");
            next.set("custom", {
                add: {},
                replace: { window() { } },
            });
            next.backup("mcdh_WB00502_backup");
        },
        subSkill: {
            backup: {
                filterCard(card) {
                    return get.itemtype(card) == "card";
                },
                viewAs: {
                    name: "juedou",
                },
                selectCard: 1,
                ai1(card) {
                    var player = get.player();
                    return 8 - get.value(card);
                },
                log: false,
                async precontent(event, trigger, player) {
                    player.when("useCardAfter")
                        .filter(event => event.skill == "mcdh_WB00502_backup")
                        .then(async (event, trigger, player) => {
                            if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) {
                                await player.draw(2);
                            }
                        });
                },
            },
        },
    },
    //左宣辽
    mcdh_WB00401: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        enable: "phaseUse",
        viewAs: {
            name: "juedou",
            isCard: true,
        },
        usable: 1,
        filterCard: () => false,
        selectCard: -1,
        log: false,
        async precontent(event, trigger, player) {
            player.logSkill("mcdh_WB00401");
            player.addTempSkill("mcdh_WB00401_respond");
        },
        subSkill: {
            respond: {
                trigger: {
                    player: "chooseToRespondBefore",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    if (event.responded) {
                        return false;
                    }
                    if (player.storage.mcdh_WB00401) {
                        return false;
                    }
                    if (!event.filterCard({ name: "sha", isCard: true }, player, event)) {
                        return false;
                    }
                    return game.hasPlayer(current => current != player);
                },
                async content(event, trigger, player) {
                    while (true) {
                        let result;
                        if (!event.current) {
                            event.current = player.next;
                        }
                        if (event.current == player) {
                            return;
                        } else {
                            if ((event.current == game.me && !_status.auto) || get.attitude(event.current, player) > 2 || event.current.isOnline()) {
                                player.storage.mcdh_WB00401 = true;
                                const next = event.current
                                    .chooseToRespond("是否替" + get.translation(player) + "打出一张杀？", { name: "sha" });
                                next.set("ai", () => {
                                    const event = _status.event;
                                    return get.attitude(event.player, event.source) - 2;
                                });
                                next.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
                                next.autochoose = lib.filter.autoRespondSha;
                                next.set("source", player);
                                result = await next.forResult();
                            }
                        }
                        player.storage.mcdh_WB00401 = false;
                        if (result?.bool) {
                            trigger.result = {
                                bool: true,
                                card: { name: "sha", isCard: true }
                            };
                            trigger.responded = true;
                            trigger.animate = false;
                            if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
                                event.current.ai.shown += 0.3;
                                if (event.current.ai.shown > 0.95) {
                                    event.current.ai.shown = 0.95;
                                }
                            }
                            const source = player;
                            event.current.when({ global: "useCardAfter" })
                                .filter(event => event.card.name == "juedou")
                                .then(async (event, trigger, player) => {
                                    const num = player.countCards("h") - source.countCards("h");
                                    if (num <= 0) {
                                        await player.drawTo(source.countCards("h"));
                                    } else {
                                        await player.chooseToDiscard("h", num, true);
                                    }
                                });
                            return;
                        } else {
                            event.current = event.current.next;
                        }
                    }
                },
                ai: {
                    respondSha: true,
                    skillTagFilter(player, tag, arg) {
                        if (arg != "respond") return false;
                        if (player.storage.mcdh_WB00401) {
                            return false;
                        }
                        return game.hasPlayer(current => current != player);
                    },
                },
            },
        },
    },
    mcdh_WB00402: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseBegin",
        },
        filter(event, player) {
            if (player.hasStorage("mcdh_WB00402", event.player)) return false;
            return event.player != player && player.countCards("h") == event.player.countCards("h");
        },
        check(event, player) {
            if (get.attitude(player, event.player) > 0) return false;
            var range = event.player.getAttackRange();
            var distance = get.distance(event.player, player);
            return range + 1 >= distance;
        },
        async content(event, trigger, player) {
            trigger.player.addTempSkill("mcdh_WB00402_effect");
            trigger.player.addMark("mcdh_WB00402_effect", 1, false);
            player.markAuto("mcdh_WB00402_effect", [trigger.player]);
            if (trigger.player.inRange(player)) {
                trigger.player.skip("phaseUse");
            }
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    attackRange(player, num) {
                        return num + player.countMark("mcdh_WB00402_effect");
                    },
                },
                mark: true,
                intro: {
                    content: "攻击范围+#",
                },
            },
        },
    },
    //帕拉斯
    mcdh_MIS201001: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseZhunbei",
        },
        mcdhCharge: 3,
        filter(event, player) {
            return player.mcdh_hasCharge("mcdh_MIS201001");
        },
        async cost(event, trigger, player) {
            const list = [];
            list.push("摸牌并视为使用火攻");
            if (trigger.player.isDamaged()) list.push("回复体力");
            if (trigger.player.mcdh_countCharge(true)) list.push("回复技力");
            event.result = await player
                .chooseControl(list, "cancel2")
                .set("prompt", `${get.prompt(event.skill, trigger.player)}，令其执行一项`)
                .set("ai", () => {
                    const player = get.player();
                    const trigger = _status.event.getTrigger();
                    if (get.attitude(player, trigger.player) <= 0) return "cancel2";
                    let controls = get.event().controls;
                    if (controls.includes("回复体力") && get.recoverEffect(trigger.player, player, player) > 0) return "回复体力";
                    if (controls.includes("回复技力")) return "回复技力";
                    return controls[0];
                })
                .forResult();
            if (event.result.control != "cancel2") {
                event.result.cost_data = event.result.control;
            }
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const control = event.cost_data;
            player.mcdh_removeCharge(3);
            if (control == "摸牌并视为使用火攻") {
                await trigger.player.draw();
                const card = new lib.element.VCard({ name: "huogong" });
                await trigger.player.chooseUseTarget(card, true);
            }
            else if (control == "回复体力") {
                await trigger.player.recover();
            } else {
                await trigger.player.mcdh_addCharge(2);
            }
        },
    },
    mcdh_MIS201002: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseJieshuBegin",
        },
        async cost(event, trigger, player) {
            var num = 0;
            if (trigger.player.isHealthy()) {
                num++;
            }
            if (!game.hasPlayer2(function (target) {
                return target.hasHistory("useCard", function (evt) {
                    return evt.targets?.includes(player);
                });
            })) {
                num++;
            }
            if (trigger.player.hasHistory("sourceDamage")) {
                num++;
            }
            const list = ["摸一张牌并视为使用一张【火攻】", "回复1点体力", "回复2点技力"];
            if (num == 0) return;
            event.result = await trigger.player
                .chooseBool(get.prompt(event.skill, player), `令其${list[num - 1]}`)
                .set("ai", () => {
                    const { player, source } = get.event();
                    return get.attitude(player, source) > 0;
                })
                .set("source", player)
                .forResult();
            event.result.cost_data = { num };
        },
        async content(event, trigger, player) {
            const num = event.cost_data.num;
            if (num == 1) {
                await player.draw();
                const card = new lib.element.VCard({ name: "huogong" });
                await player.chooseUseTarget(card, true);
            }
            else if (num == 2) {
                await player.recover();
            } else {
                await player.mcdh_addCharge(2);
            }
        },
    },
    //地灵
    mcdh_MIS201401: {
        nobracket: true,
        trigger: {
            global: "useCard",
        },
        mcdhCharge: 2,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_MIS201401")) return false;
            return event.player.getHistory("useCard").indexOf(event) == 0;
        },
        check(event, player, hp) {
            if (get.attitude(player, event.player) >= 0) return false;
            return true;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            player.mcdh_removeCharge(2);
            const result = await player.chooseToDiscard("h", true).forResult();
            const result2 = await player.discardPlayerCard(trigger.player, "h", true).forResult();
            const suits = (result.cards ?? []).addArray(result2.links ?? []).reduce((list, card) => list.add(get.suit(card)), []);
            if (suits.length) {
                trigger.player.addTempSkill("mcdh_MIS201401_effect");
                trigger.player.markAuto("mcdh_MIS201401_effect", suits);
            }
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardEnabled2(card, player, target) {
                        if (player.getStorage("mcdh_MIS201401_effect").includes(get.suit(card))) return false;
                    },
                },
                mark: true,
                intro: {
                    markcount: () => 0,
                    content: "不能使用或打出$牌",
                },
            },
        },
    },
    mcdh_MIS201402: {
        nobracket: true,
        trigger: {
            player: ["useCard", "useCardAfter"],
        },
        forced: true,
        locked: true,
        filter(event, player, name) {
            const evt = event.getParent("phaseUse");
            if (!evt || evt.player != player) return false;
            const history = player.getHistory("useCard", evtx => evtx.getParent("phaseUse") == evt);
            return history.length == (name == "useCard" ? player.hp : player.hp + 1);
        },
        async content(event, trigger, player) {
            if (event.triggername == "useCard") {
                await player.draw(player.hp);
            } else {
                var evt = _status.event.getParent("phaseUse");
                if (evt && evt.name == "phaseUse") {
                    evt.skipped = true;
                }
                var evt = _status.event.getParent("phase");
                if (evt && evt.name == "phase") {
                    evt.finish();
                }
            }
        },
    },
    //红松林
    mcdh_hongsonglin: {
        nobracket: true,
        mod: {
            maxHandcard(player, num) {
                return num + 1;
            },
            attackRange(player, num) {
                return num + game.countPlayer(target => target.hasSkill("mcdh_hongsonglin"));
            },
        },
        trigger: {
            global: "changeSkillsAfter"
        },
        forced: true,
        filter(event, player) {
            return event.addSkill?.includes("mcdh_hongsonglin") || event.removeSkill?.includes("mcdh_hongsonglin");
        },
        content() { },
    },
    //拉普兰德
    mcdh_IS00401: {
        trigger: {
            player: "useCardToPlayered",
        },
        filter(event, player) {
            if (event.card.name != "sha" || event.targets.length != 1) {
                return false;
            }
            return player.countCards("he") || event.target.countCards("he");
        },
        check(event, player) {
            return get.attitude(player, event.target) <= 0;
        },
        logTarget: "target",
        async content(event, trigger, player) {
            const target = trigger.target;
            await player.chooseToDiscard("he", true);
            await player.discardPlayerCard(target, "he", true);
            target.addTempSkill("fengyin");
        },
    },
    mcdh_IS00402: {
        group: ["mcdh_IS00402_discard", "mcdh_IS00402_judge"],
        subSkill: {
            discard: {
                trigger: {
                    global: ["loseAfter", "loseAsyncAfter"],
                },
                filter(event, player) {
                    if (event.type != "discard" || event.getlx === false) {
                        return false;
                    }
                    var cards = event.cards.slice(0);
                    var evt = event.getl(player);
                    if (evt && evt.cards) {
                        cards.removeArray(evt.cards);
                    }
                    for (var i = 0; i < cards.length; i++) {
                        if (cards[i].original != "j" && get.suit(cards[i], event.player) == "club" && get.position(cards[i], true) == "d") {
                            return true;
                        }
                    }
                    return false;
                },
                async cost(event, trigger, player) {
                    if (trigger.delay == false) {
                        await game.delay();
                    }
                    var cards = [],
                        cards2 = trigger.cards.slice(0),
                        evt = trigger.getl(player);
                    if (evt && evt.cards) {
                        cards2.removeArray(evt.cards);
                    }
                    for (var i = 0; i < cards2.length; i++) {
                        if (cards2[i].original != "j" && get.suit(cards2[i], trigger.player) == "spade" && get.position(cards2[i], true) == "d") {
                            cards.push(cards2[i]);
                        }
                    }
                    if (!cards.length) {
                        return;
                    }
                    event.result = await player
                        .chooseButton(["影落", cards], [1, cards.length])
                        .set("ai", function (button) {
                            return get.value(button.link, _status.event.player, "raw");
                        })
                        .forResult();
                    if (event.result.bool && event.result.links?.length) {
                        event.result.cards = event.result.links;
                    }
                },
                async content(event, trigger, player) {
                    player.gain(event.cards, "gain2", "log");
                },
            },
            judge: {
                trigger: {
                    global: "cardsDiscardAfter",
                },
                filter(event, player) {
                    var evt = event.getParent().relatedEvent;
                    if (!evt || evt.name != "judge") {
                        return;
                    }
                    if (evt.player == player) {
                        return false;
                    }
                    if (get.position(event.cards[0], true) != "d") {
                        return false;
                    }
                    return get.suit(event.cards[0]) == "spade";
                },
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseButton(["影落", trigger.cards], [1, trigger.cards.length])
                        .set("ai", function (button) {
                            return get.value(button.link, _status.event.player, "raw");
                        })
                        .forResult();
                    if (event.result.bool && event.result.links?.length) {
                        event.result.cards = event.result.links;
                    }
                },
                async content(event, trigger, player) {
                    player.gain(event.cards, "gain2", "log");
                },
            },
        },
    },
    //黑蛇塔露拉
    mcdh_RM00601: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return game.hasPlayer(target => target.countCards("h"));
        },
        filterTarget(card, player, target) {
            return target.countCards("h");
        },
        selectTarget: -1,
        multitarget: true,
        multiline: true,
        async content(event, trigger, player) {
            const targets = event.targets.filter(target => target.countCards("h"));
            if (!targets.length) {
                return;
            }
            const showEvent = player
                .chooseCardOL(targets, "我即烈日：请选择要展示的牌", true)
                .set("ai", function (card) {
                    return Math.random();
                })
                .set("source", player);
            showEvent.aiCard = function (target) {
                const hs = target.getCards("h");
                return { bool: true, cards: [hs.randomGet()] };
            };
            showEvent._args.remove("glow_result");
            const result = await showEvent.forResult();
            const cards = [],
                shown = [];
            for (var i = 0; i < targets.length; i++) {
                cards.push(result[i].cards[0]);
                shown.push([targets[i], result[i].cards[0]])
            }
            const suits = cards.map(card => get.suit(card)).unique();
            const next = player
                .showCards(cards, `${get.translation(player)} 发动了【${get.translation(event.name)}】`, false)
                .set("showers", targets)
                .set("customButton", button => {
                    const target = get.owner(button.link);
                    if (target) {
                        const div = button.querySelector(".info");
                        div.innerHTML = "<span style = 'font-weight:bold'>" + get.translation(get.suit(button.link, target)) + target.getName() + "</span>";
                    }
                })
                .set("delay_time", targets.length * 2)
                .set("closeDialog", false);
            await next;
            const id = next.videoId;

            const update = function (id, suits) {
                const dialog = get.idDialog(id);
                if (dialog) {
                    const div = dialog.querySelector(".caption");
                    div.innerHTML = `我即烈日：弃置一张牌并对展示牌与弃置牌相同花色的角色造成1点火焰伤害`;
                    ui.update();
                }
            };
            if (player == game.me) {
                update(id, suits);
            } else if (player.isOnline()) {
                player.send(update, id, suits);
            }
            const result2 = await player
                .chooseToDiscard(get.idDialog(id), true, card => {
                    return get.event().suits.includes(get.suit(card, get.player()));
                })
                .set("suits", suits)
                .set("ai", card => {
                    return 8 - get.value(card);
                })
                .forResult();
            game.broadcastAll("closeDialog", id);
            if (result2?.cards?.length) {
                const targets = shown
                    .filter(info => get.suit(result2.cards[0]) == get.suit(info[1]))
                    .map(info => info[0]);
                for (const target of targets) {
                    await target.damage("fire");
                }
            }
        },
        ai: {
            order: 10,
            result: {
                player: 1,
            },
        },
    },
    mcdh_RM00602: {
        nobracket: true,
        trigger: {
            player: "damageEnd",
        },
        filter(event, player) {
            return event.hasNature();
        },
        check(event, player) {
            return player.countCards("h") <= 2;
        },
        async content(event, trigger, player) {
            await player.modedDiscard(player.getCards("h"));
            await player.draw(3);
        },
    },
    //叶莲娜
    mcdh_RM00201: {
        nobracket: true,
        enable: "phaseUse",
        filter(event, player) {
            return player.mcdh_countCharge() > 1;
        },
        filterCard: () => false,
        selectCard: -1,
        filterTarget(card, player, target) {
            if (player == target) return false;
            return target.countDiscardableCards("h", player);
        },
        selectTarget() {
            const player = _status.event.player;
            return player.mcdh_countCharge() - 1;
        },
        multitarget: true,
        line: false,
        async content(event, trigger, player) {
            const targets = [player].addArray(event.targets);
            player.mcdh_removeCharge(targets.length);
            const cards = [];
            for (const target of targets) {
                const result = await player.discardPlayerCard(target, "h", true).forResult();
                if (result.bool) {
                    cards.addArray(result.links);
                }
            }
            const colors = cards.reduce((list, card) => list.add(get.color(card)), []);
            if (colors.length > 1) {
                const card = new lib.element.VCard({ name: "nanman", storage: { mcdh_RM00201: true } });
                const next = player.chooseUseTarget(card, true);
                next.set("oncard", (card, player) => {
                    player
                        .when("useCard2")
                        .filter(event => event.card.storage?.mcdh_RM00201)
                        .then(async (event, trigger, player) => {
                            const result = await player
                                .chooseTarget(`你发动了${get.translation("mcdh_RM00201")}`, `你可以为${get.translation(trigger.card)}减少一个目标`, function (card, player, target) {
                                    return _status.event.targets.includes(target);
                                })
                                .set("targets", trigger.targets)
                                .set("ai", function (target) {
                                    var player = _status.event.player;
                                    return -get.effect(target, _status.event.getTrigger().card, player, player)
                                })
                                .forResult();
                            if (result?.bool && result.targets?.length) {
                                player.line(result.targets);
                                trigger.targets.removeArray(result.targets);
                            }
                        });
                });
                await next;
            }
        },
        ai: {
            order: 5,
            result: {
                target(player, target) {
                    return -1;
                },
            },
        },
    },
    mcdh_RM00202: {
        nobracket: true,
        derivation: "mcdh_RM00203",
        trigger: {
            player: "dying",
        },
        forced: true,
        juexingji: true,
        skillAnimation: true,
        animationColor: "epic",
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            await player.recoverTo(player.maxHp);
            await player.addSkills("mcdh_RM00203");
        },
    },
    mcdh_RM00203: {
        nobracket: true,
        trigger: {
            source: "damageSource",
        },
        forced: true,
        async content(event, trigger, player) {
            await player.loseMaxHp();
        },
        ai: {
            neg: true,
        },
    },
    //博卓卡斯替
    mcdh_RM00301: {
        nobracket: true,
        global: ["mcdh_RM00301_global", "mcdh_RM00301_use"],
        trigger: {
            player: "mcdh_removeCharge",
        },
        forced: true,
        locked: true,
        mcdhCharge: 1,
        filter(event, player) {
            return game
                .getGlobalHistory("everything", evt => {
                    return evt.name == "mcdh_removeCharge" && evt.player == player;
                })
                .length == 3;
        },
        async content(event, trigger, player) {
            await player.addSkills("mcdh_RM00302");
        },
        subSkill: {
            global: {
                enable: "chooseToUse",
                filter(event, player) {
                    if (event.type == "wuxie" || event.mcdh_RM00301_global) return false;
                    if (player.hasSkill("mcdh_RM00301_blocker", null, null, false)) return false;
                    if (
                        !game.hasPlayer(target => {
                            return target.hasSkill("mcdh_RM00301") && target.countCards("he") && target.mcdh_countCharge();
                        })
                    )
                        return false;
                    for (var name of ["sha", "shan"]) {
                        if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
                    }
                    return false;
                },
                chooseButton: {
                    dialog(event, player) {
                        var vcards = [];
                        for (var name of ["sha", "shan"]) {
                            var card = { name: name, isCard: true };
                            if (event.filterCard(card, player, event)) vcards.push(["基本", "", name]);
                        }
                        var dialog = ui.create.dialog("感染者之盾", [vcards, "vcard"], "hidden");
                        dialog.direct = true;
                        return dialog;
                    },
                    backup(links, player) {
                        return {
                            filterCard: () => false,
                            selectCard: -1,
                            viewAs: {
                                name: links[0][2],
                                isCard: true,
                            },
                            popname: true,
                            async precontent(event, trigger, player) {
                                player.addTempSkill("mcdh_RM00301_blocker", { player: ["useCard1", "useSkillBegin", "phaseUseEnd"] });
                            },
                        }
                    },
                    prompt(links, player) {
                        return "感染者之盾：视为使用一张【" + get.translation(links[0][2]) + "】";
                    },
                },
                hiddenCard(player, name) {
                    if (player.hasSkill("mcdh_RM00301_blocker", null, null, false)) return false;
                    if (["sha", "shan"].includes(name)) {
                        return game.hasPlayer(target => {
                            return target.hasSkill("mcdh_RM00301") && target.countCards("he") && target.mcdh_countCharge();
                        });
                    }
                },
                ai: {
                    order() {
                        return get.order({ name: "sha" }) + 0.1;
                    },
                    result: {
                        player(player) {
                            return 1;
                        },
                    },
                },
            },
            use: {
                trigger: {
                    player: "useCardBegin",
                },
                forced: true,
                locked: false,
                popup: false,
                filter(event, player) {
                    return event.skill && event.skill.startsWith("mcdh_RM00301_global");
                },
                async content(event, trigger, player) {
                    delete trigger.skill;
                    trigger.getParent().set("mcdh_RM00301_global", true);
                    const targets = game.filterPlayer(target => {
                        return target.hasSkill("mcdh_RM00301") && target.countCards("he") && target.mcdh_countCharge();
                    });
                    if (!targets.length) {
                        trigger.cancel();
                        trigger.getParent().goto(0);
                        return;
                    }
                    for (const target of targets) {
                        const result = await player
                            .chooseToDiscard("he", `是否弃置一张非基本牌并失去1点技力，代替${get.translation(trigger.player)}使用${get.translation(trigger.card)}？`, function (card) {
                                return get.type(card) != "basic";
                            })
                            .set("ai", function (card) {
                                var player = _status.event.player;
                                return get.attitude(player, trigger.player) >= 0;
                            })
                            .forResult();
                        if (result.bool) {
                            player.mcdh_removeCharge();
                            await game.delay();
                            return;
                            break;
                        }
                    }
                    trigger.cancel();
                    trigger.getParent().goto(0);
                },
            },
            blocker: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    mcdh_RM00302: {
        nobracket: true,
        trigger: {
            player: ["phaseUseBegin", "phaseJieshuBegin"],
        },
        forced: true,
        filter(event, player, name) {
            return name == "phaseUseBegin" || get.discarded().some(card => get.is.damageCard(card));
        },
        async content(event, trigger, player) {
            if (event.triggername == "phaseUseBegin") {
                const cards = get.cards(4)
                await game.cardsGotoOrdering(cards);
                await player.showCards(cards);
                if (cards.some(card => get.is.damageCard(card))) {
                    const result = await player.chooseToRespond({ name: "shan" });
                    if (!result.bool) {
                        await player.loseHp();
                    }
                }
            } else {
                var num = get.discarded().filter(card => get.is.damageCard(card)).length;
                if (num > 0) {
                    await player.chooseUseTarget({ name: "guohe", isCard: true }, true);
                }
                if (num > 1) {
                    await player.chooseUseTarget({ name: "juedou", isCard: true }, true);
                }
                if (num > 2) {
                    await player.chooseUseTarget({ name: "sha", isCard: true }, true);
                }
            }
        },
    },
    //伊诺
    mcdh_RM00401: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return game.hasPlayer(target => {
                return lib.skill.mcdh_RM00401.filterTarget(null, player, target);
            });
        },
        filterCard: true,
        check(card) {
            return 7 - get.value(card);
        },
        filterTarget(card, player, target) {
            if (ui.selected.targets.length) {
                const card = ui.selected.cards[0];
                if (card) {
                    if (ui.selected.targets.reduce((sum, target) => sum + target.hp, 0) >= get.number(card)) return false;
                }
            }
            return target.isDamaged();
        },
        selectTarget: [1, Infinity],
        filterOk() {
            const card = ui.selected.cards[0];
            if (!card) return false;
            return ui.selected.targets.reduce((sum, target) => sum + target.hp, 0) == get.number(card)
        },
        multitarget: true,
        async content(event, trigger, player) {
            for (const target of event.targets) {
                if (target.countCards("he")) {
                    await target.chooseToGive(player, "he", true);
                }
            }
            const result = await player
                .chooseTarget("令体力值最小的一名角色回复1点体力", true)
                .set("filterTarget", (card, player, target) => {
                    return get.event().targets.includes(target) && target.isMinHp();
                })
                .set("ai", target => {
                    const player = get.player();
                    return get.recoverEffect(target, player, player);
                })
                .forResult();
            if (result.bool) {
                const target = result.targets[0];
                await target.recover();
            }
        },
        ai: {
            order: 3,
            result: {
                target(player, target) {
                    return get.sgnAttitude(player, target);
                },
            },
        },
    },
    mcdh_RM00402: {
        nobracket: true,
        trigger: {
            player: "gainAfter",
            global: "loseAsyncAfter",
        },
        popup: false,
        usable: 1,
        getIndex(event, player) {
            if (event.name == "loseAsync" && event.type != "gain") return [];
            if (!event.getl || !event.getg) return [];
            let cards = event.getg(player);
            return game
                .filterPlayer(current => {
                    if (current == player) return false;
                    if (cards.length) {
                        let evt = event.getl(current);
                        if (evt?.cards2?.length && evt.cards2.some(card => cards.includes(card))) return true;
                    }
                    return false;
                })
                .sortBySeat();
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill))
                .set("ai", target => {
                    return -get.attitude(_status.event.player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const cards = trigger.getg(player);
            const suits = cards.map(card => get.suit(card));
            await player.showCards(cards);
            const result = await target
                .chooseToDiscard(`白雀封喉：弃置一张牌，否则你失去1点体力`, "he", function (card) {
                    return get.event().suits.includes(get.suit(card));
                })
                .set("ai", function (card) {
                    const player = get.player();
                    return 7 - get.value(card);
                })
                .set("suits", suits)
                .forResult();
            if (!result.bool) {
                await target.loseHp();
            }
        },
    },
    //萨沙
    mcdh_RM00501: {
        nobracket: true,
        trigger: {
            global: "phaseJieshuBegin",
        },
        direct: true,
        filter(event, player) {
            return (
                event.player != player &&
                player.hasHistory("lose", evt => evt.cards2?.length) &&
                player.countCards("hes") &&
                game.hasPlayer(current =>
                    player.canUse(
                        {
                            name: "sha",
                        },
                        current
                    )
                )
            );
        },
        async content(event, trigger, player) {
            var next = player.chooseToUse();
            next.set("openskilldialog", get.prompt2(event.name));
            next.set("norestore", true);
            next.set("_backupevent", "mcdh_RM00501_backup");
            next.set("addCount", false);
            next.set("logSkill", "mcdh_RM00501");
            next.set("custom", {
                add: {},
                replace: { window() { } },
            });
            next.backup("mcdh_RM00501_backup");
        },
        subSkill: {
            backup: {
                filterCard(card) {
                    return get.itemtype(card) == "card";
                },
                viewAs: {
                    name: "sha",
                },
                selectCard: [1, 2],
                ai1(card) {
                    var player = get.player();
                    return 6 - get.value(card);
                },
                log: false,
                async precontent(event, trigger, player) {
                    player.when("useCardAfter")
                        .filter(event => event.skill == "mcdh_RM00501_backup")
                        .then(async (event, trigger, player) => {
                            if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) {
                                return;
                            }
                            const cards = trigger.cards.filterInD();
                            if (!cards.length) return;
                            const result = await player
                                .chooseTarget(`幻影出击：你可以令一名其他角色获得${get.translation(cards)}`, lib.filter.notMe)
                                .set("ai", target => {
                                    return get.attitude(_status.event.player, target);
                                })
                                .forResult();
                            if (result.bool) {
                                const target = result.targets[0];
                                await target.gain(cards, "gain2");
                            }
                        });
                },
            },
        },
    },
    mcdh_RM00502: {
        nobracket: true,
        trigger: {
            player: "useCard1",
        },
        filter(event, player) {
            return event.card.name == "sha" && player.countCards("h");
        },
        async content(event, trigger, player) {
            const cards = player.getCards("h");
            await player.showCards(cards);
            var color = get.color(trigger.card);
            if (cards.some(card => get.color(card) == color)) return;
            if (!trigger.card.storage) trigger.card.storage = {};
            trigger.card.storage._mcdh_RM00502 = true;
            const targets = game.filterPlayer(target => target != player);
            for (const target of targets) {
                target.addTempSkill("mcdh_RM00502_blocker");
                target.markAuto("mcdh_RM00502_blocker", [color]);
            }
        },
        subSkill: {
            blocker: {
                trigger: {
                    global: "useCardAfter",
                },
                forced: true,
                charlotte: true,
                popup: false,
                firstDo: true,
                filter(event, player) {
                    return event.card.name == "sha" && event.card.storage?._mcdh_RM00502;
                },
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
                onremove: true,
                mod: {
                    cardEnabled(card, player) {
                        if (!player.getStorage("mcdh_RM00502_blocker").includes(get.color(card))) return false;
                    },
                    cardSavable(card, player) {
                        if (!player.getStorage("mcdh_RM00502_blocker").includes(get.color(card))) return false;
                    },
                },
            },
        },
    },
    //斗士塔露拉
    mcdh_RM00101: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        chooseButton: {
            dialog(event, player) {
                var list = ["视为对全场手牌数最多的一名角色使用一张火【杀】", "获得一名手牌数为全场最多角色的一张手牌", "将两张牌交给一至两名其他角色，然后依次执行前两项"];
                var choiceList = ui.create.dialog("火愿焚尽", "forcebutton", "hidden");
                choiceList.add([
                    list.map((item, i) => {
                        return [i, item];
                    }),
                    "textbutton",
                ]);
                return choiceList;
            },
            filter(button) {
                const player = get.player();
                if (button.link == 0) {
                    return game.hasPlayer(target => {
                        const sha = new lib.element.VCard({ name: "sha", nature: "fire" });
                        return target.isMaxHandcard() && player.canUse(sha, target, false, false);
                    });
                }
                if (button.link == 1) {
                    return game.hasPlayer(target => {
                        return target.isMaxHandcard() && target != player && target.countGainableCards(player, "h");
                    });
                }
                if (button.link == 2) {
                    return player.countCards("he") >= 2;
                }
            },
            backup(links) {
                var next = get.copy(lib.skill.mcdh_RM00101.backups[links[0]]);
                return next;
            },
            check(button) {
                var player = _status.event.player;
                switch (button.link) {
                    case 0: {
                        return 1.3 + Math.random();
                    }
                    case 1: {
                        return 1.2 + Math.random();
                    }
                    case 2: {
                        return 1.6 + Math.random();
                    }
                }
            },
            prompt(links) {
                return ["视为对全场手牌数最多的一名角色使用一张火【杀】（无距离限制）", "获得一名手牌数为全场最多角色的一张手牌", "将两张牌交给一至两名其他角色，然后依次执行前两项"][links[0]];
            },
        },
        backups: [
            {
                filterCard: () => false,
                selectCard: -1,
                filterTarget(card, player, target) {
                    const sha = new lib.element.VCard({ name: "sha", nature: "fire" });
                    return target.isMaxHandcard() && player.canUse(sha, target, false, false);
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const sha = new lib.element.VCard({ name: "sha", nature: "fire" });
                    if (targets.length) {
                        await player.useCard(sha, target, false);
                    }
                },
            },
            {
                filterCard: () => false,
                selectCard: -1,
                filterTarget(card, player, target) {
                    return target.isMaxHandcard() && target.countGainableCards(player, "h");
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    await player.gainPlayerCard(target, "h", true);
                },
            },
            {
                filterCard: true,
                selectCard: 2,
                selectTarget: [1, 2],
                filterTarget: lib.filter.notMe,
                ai1(card) {
                    if (card.name == "du") return 10;
                    else if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
                    var player = _status.event.player;
                    if (!game.hasPlayer(function (target) {
                        return get.attitude(player, target) > 0 && !target.hasSkillTag("nogain");
                    })) return 0;
                    return 1 / Math.max(0.1, get.value(card));
                },
                ai2(target) {
                    var player = _status.event.player,
                        att = get.attitude(player, target);
                    if (ui.selected.cards[0].name == "du") return -att;
                    if (target.hasSkillTag("nogain")) att /= 6;
                    return att;
                },
                multitarget: true,
                lose: false,
                discard: false,
                delay: false,
                async content(event, trigger, player) {
                    if (event.targets.length == 1) {
                        await player.give(event.cards, event.targets[0]);
                    } else {
                        var list = [];
                        for (var i = 0; i < event.targets.length; i++) {
                            list.push([event.targets[i], event.cards[i]]);
                            player.line(event.targets[i]);
                        }
                        await game.loseAsync({
                            gain_list: list,
                            player: player,
                            cards: event.cards,
                            giver: player,
                            animate: "giveAuto",
                        }).setContent("gaincardMultiple");
                    }
                    const sha = new lib.element.VCard({ name: "sha", nature: "fire" });
                    const targets = game.filterPlayer(target => {
                        return target.isMaxHandcard() && player.canUse(sha, target, false, false);
                    });
                    if (targets.length) {
                        if (targets.length == 1) {
                            event.result = {
                                bool: true,
                                targets: targets,
                            }
                        } else {
                            event.result = await player
                                .chooseTarget("视为对手牌数最多的一名角色使用一张火【杀】", true)
                                .set("filterTarget", (card, player, target) => {
                                    return get.event().targets.includes(target);
                                })
                                .set("targets", targets)
                                .forResult();
                        }
                        await player.useCard(sha, event.result.targets, false);
                    }
                    const targets2 = game.filterPlayer(target => {
                        return target.isMaxHandcard() && target != player && target.countGainableCards(player, "h");
                    });
                    if (targets2.length) {
                        if (targets2.length == 1) {
                            event.result2 = {
                                bool: true,
                                targets: targets2,
                            }
                        } else {
                            event.result2 = await player
                                .chooseTarget("获得一名手牌数为全场最多角色的一张手牌", true)
                                .set("filterTarget", (card, player, target) => {
                                    return get.event().targets.includes(target);
                                })
                                .set("targets", targets2)
                                .forResult();
                        }
                        const target = event.result2.targets[0];
                        await player.gainPlayerCard(target, "h", true);
                    }
                },
            },
        ],
        ai: {
            order: 1,
            result: {
                player: 1,
            },
        },
        subSkill: {
            backup: {},
        },
    },
    //阿丽娜
    mcdh_RM00701: {
        nobracket: true,
        trigger: {
            player: "damageEnd"
        },
        filter(event, player) {
            return event.source && event.source.isIn();
        },
        async content(event, trigger, player) {
            const target = trigger.source;
            const cards = get.cards(3);
            await game.cardsGotoOrdering(cards);
            await player.showCards(cards);
            const hs = target.getCards("h");
            await target.showCards(hs);
            const cards2 = hs.filter(card => get.is.damageCard(card));
            if (cards2.length) {
                if (cards2.length == 1) {
                    event.result = {
                        bool: true,
                        moved: [cards2],
                    }
                } else {
                    var next = player.chooseToMove("将卡牌以任意顺序置于牌堆顶");
                    next.set("list", [["牌堆顶", cards2]]);
                    next.set("processAI", function (list) {
                        var player = _status.event.player, target = player.next;
                        var att = get.sgn(get.attitude(player, target));
                        var check = function (card) {
                            var judge = player.getCards("j")[cards.length];
                            if (judge) return get.judge(judge)(card) * att;
                            return player.getUseValue(card) * att;
                        };
                        var cards = list[0][1].slice(0);
                        cards.sort(function (a, b) {
                            return check(b) * att - check(a) * att;
                        });
                        return [cards];
                    });
                    event.result = await next.forResult();
                }
                if (event.result?.bool) {
                    var moved = event.result.moved[0].slice(0);
                    while (moved.length) {
                        ui.cardPile.insertBefore(moved.pop(), ui.cardPile.firstChild);
                    }
                    game.updateRoundNumber();
                    await game.delayx();
                }
                const num = Math.min(cards2.length, 3);
                const cards3 = cards.filter(card => !get.is.damageCard(card));
                if (num == 3 || num > cards3.length) {
                    event.result = {
                        bool: true,
                        links: cards3,
                    };
                } else {
                    var str = "令" + get.translation(target) + "获得" + get.cnNumber(num) + "张非伤害牌";
                    str += "，然后你获得剩余的牌";
                    event.result = await player
                        .chooseButton([str, cards], num, true)
                        .set("filterButton", function (button) {
                            return !get.is.damageCard(button.link);
                        })
                        .set("ai", button => {
                            const player = get.player();
                            return 1 / (get.value(button.link) + 1);
                        })
                        .forResult();
                }
                if (event.result?.bool && event.result?.links) {
                    cards.removeArray(event.result.links);
                    await target.gain(event.result.links, "gain2");
                }
            }
            if (cards.length) {
                await player.gain(cards, "gain2");
            }
        },
    },
    mcdh_RM00702: {
        nobracket: true,
        derivation: "mcdh_RM00703",
        trigger: {
            player: "dying",
        },
        limited: true,
        skillAnimation: true,
        animationColor: "orange",
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            if (get.mode() == "identity") {
                const list = game.filterPlayer();
                const list2 = game.filterPlayer().map(i => {
                    var identity = i.identity;
                    return identity == "mingzhong" ? "zhong" : identity;
                });
                const dialog = ui.create.dialog("忘却仇恨");
                dialog.classList.add("fullwidth");
                dialog.add(list);
                dialog.addAuto([
                    list2,
                    function (item, type, position, noclick, node) {
                        return lib.skill.jxlianpo.$createButton(item, type, position, noclick, node);
                    }
                ]);
                await player
                    .chooseControl("ok")
                    .set("dialog", dialog); "full"
            }
            const result = await player
                .chooseTarget("忘却仇恨：令一名其他角色获得技能【夜谈】", true, lib.filter.notMe)
                .set("ai", function (target) {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
            if (result.bool) {
                result.targets[0].addSkill("mcdh_RM00703");
            }
        },
    },
    mcdh_RM00703: {
        trigger: {
            source: "damageBegin2",
        },
        usable: 1,
        check(event, player) {
            if (get.attitude(player, event.player) > 0) return 1;
            if (
                !player.hasAllHistory("useSkill", evt => {
                    return evt.skill == "mcdh_RM00703" && evt.targets?.includes(event.player);
                })
            ) {
                return event.player.isDamaged();
            }
            return get.damageEffect(event.player, player, player) <= 0;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            trigger.cancel();
            await trigger.player.recover();
        },
        group: "mcdh_RM00703_win",
        subSkill: {
            win: {
                trigger: {
                    global: "phaseBefore",
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    return !game.hasPlayer(target => {
                        return !game.getAllGlobalHistory("changeHp", evt => {
                            if (evt.player != target) return false;
                            const evtx = evt.getParent();
                            if (evtx.name != "recover") return false;
                            return evtx.source == player;
                        }).length;
                    });
                },
                async content(event, trigger, player) {
                    var winners = player.getFriends();
                    game.over(player == game.me || winners.includes(game.me));
                },
            },
        },
    },
    //米莎碎骨
    mcdh_RM00801: {
        nobracket: true,
        trigger: {
            player: "phaseUseBegin"
        },
        forced: true,
        zhuanhuanji2(skill, player) {
            return !player || !player.hasSkill("mcdh_RM00801_rewrite");
        },
        async content(event, trigger, player) {
            if (player.hasSkill("mcdh_RM00801_rewrite")) {
                await player.loseHp();
                player.addTempSkill(event.name + "_effect", "phaseUseAfter");
            }
            await player.changeZhuanhuanji(event.name);
            if (player.storage[event.name]) {
                await player.loseHp();
                player.addTempSkill(event.name + "_effect", "phaseUseAfter");
            } else {
                await player.showHandcards();
                const cards = player.getCards("h", { name: "sha" });
                if (cards.length) {
                    await player.modedDiscard(cards);
                    await player.draw(cards.length);
                }
                if (game.hasPlayer(target => target.isDamaged())) {
                    const result = await player
                        .chooseTarget(true, "令一名角色回复1点体力", function (card, player, target) {
                            return target.isDamaged();
                        })
                        .set("ai", function (target) {
                            var player = _status.event.player;
                            return get.recoverEffect(target, player, player);
                        })
                        .forResult();
                    if (result.bool) {
                        const target = result.targets[0];
                        player.line(target);
                        await target.recover();
                    }
                }
            }
        },
        mark: true,
        marktext: "☯",
        intro: {
            content(storage, player, skill) {
                var str = "出牌阶段开始时，";
                if (player.hasSkill(skill + "_rewrite")) return "失去1点体力，然后本阶段你的基本牌均视为火【杀】且使用【杀】的限制次数+1";
                return !storage ? "失去1点体力，然后本阶段你的基本牌均视为火【杀】且使用【杀】的限制次数+1" : "展示所有手牌，然后弃置其中的【杀】，摸等量张牌并令一名角色回复1点体力。";
            },
        },
        subSkill: {
            effect: {
                charlotte: true,
                mod: {
                    cardname(card, player) {
                        if (get.type(card) == "basic") return "sha";
                    },
                    cardnature(card, player) {
                        if (get.type(card) == "basic") return "fire";
                    },
                    cardUsable(card, player, num) {
                        if (get.name(card) == "sha") return num += 1;
                    },
                },
            },
            rewrite: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    mcdh_RM00802: {
        nobracket: true,
        trigger: {
            player: "dying",
        },
        juexingji: true,
        forced: true,
        skillAnimation: true,
        animationColor: "wood",
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            await player.loseMaxHp();
            await player.recover(player.maxHp); rewrite
            player.addSkill("mcdh_RM00801_rewrite");
            player.unmarkSkill("mcdh_RM00801");
        },
    },
    //柳德米拉
    mcdh_RM00901: {
        nobracket: true,
        trigger: {
            global: "phaseJieshuBegin"
        },
        popup: false,
        filter(event, player) {
            return player.hasHistory("useCard", evt => get.is.damageCard(evt.card) && !player.hasHistory("sourceDamage", evtx => evtx.card == evt.card));
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    if (!target.countCards("h")) return false;
                    return target != player;
                })
                .set("ai", function (target) {
                    const player = get.player();
                    return -get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const result = await target
                .chooseToUse(function (card, player, event) {
                    if (get.name(card) != "sha") {
                        return false;
                    }
                    return lib.filter.filterCard.apply(this, arguments);
                }, `狼血继承：使用一张杀，或令${get.translation(player)}获得你的一张手牌`)
                .set("targetRequired", true)
                .set("complexSelect", true)
                .set("complexTarget", true)
                .set("filterTarget", function (card, player, target) {
                    return lib.filter.filterTarget.apply(this, arguments);
                })
                .forResult();
            if (!result.bool && target.countGainableCards(player, "h")) {
                await player.gainPlayerCard(target, "h")
            }
        },
    },
    mcdh_RM00902: {
        nobracket: true,
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        mcdhCharge: 3,
        logTarget: "player",
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_RM00902")) return false;
            if (!player.canUse({ name: "huogong" }, event.player, false)) return false;
            return event.player != player && player.inRange(event.player);
        },
        async content(event, trigger, player) {
            player.mcdh_removeCharge(3);
            await player.chooseUseTarget({ name: "huogong", isCard: true }, trigger.player, true, false);
        },
    },
    //W
    mcdh_RM01001: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.countCards("he", { suit: "heart" });
        },
        position: "he",
        filterTarget(card, player, target) {
            return target != player && target.countDiscardableCards("he", player);
        },
        filterCard(card) {
            return get.suit(card) == "heart";
        },
        check(card) {
            return 8 - get.value(card);
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            if (target.countDiscardableCards(player, "he")) {
                const result = await player.discardPlayerCard("he", target, true).forResult();
                if (get.type2(result.cards[0]) != get.type2(event.cards[0])) {
                    await target.damage();
                } else {
                    await player.draw(2);
                    const result = await player
                        .chooseCard("he", true, "选择交给" + get.translation(target) + "一张牌")
                        .forResult();
                    if (result.bool && result.cards?.length) {
                        await player.give(result.cards, target);
                    }
                }
            }
        },
        ai: {
            order: 3,
            result: {
                target(player, target) {
                    return -1;
                },
            },
        },
    },
    mcdh_RM01002: {
        nobracket: true,
        trigger: {
            player: "phaseJieshuBegin"
        },
        frequent: true,
        filter(event, player) {
            return player.hasHistory("sourceDamage");
        },
        async content(event, trigger, player) {
            const num = player.getHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0);
            await player.draw(num);
            if (player.getStat("kill") > 0) player.insertPhase();
        },
    },
    //雷德
    mcdh_RM01101: {
        nobracket: true,
        trigger: {
            player: "compare",
            target: "compare",
        },
        filter(event) {
            return !event.iwhile;
        },
        async cost(event, trigger, player) {
            const num = player.getDamagedHp() + 1;
            const next = player.chooseControl(`点数+${num}`, `点数-${num}`, "cancel2");

            function check() {
                const event = get.event();
                const small = Reflect.get(event, "small");

                return small ? 1 : 0;
            }

            next.set("prompt", get.prompt2(event.skill));
            next.set("ai", check);
            next.set("small", Reflect.get(trigger, "small"));

            const result = await next.forResult();
            event.result = {
                bool: result.index != 2,
                cost_data: {
                    num: num,
                    index: result.index,
                },
            };
        },
        async content(event, trigger, player) {
            const { num, index } = event.cost_data;
            if (index == 0) {
                game.log(player, "拼点牌点数", "#y+" + num);
                if (player == trigger.player) {
                    trigger.num1 += num;
                    if (trigger.num1 > 13) {
                        trigger.num1 = 13;
                    }
                } else {
                    trigger.num2 += num;
                    if (trigger.num2 > 13) {
                        trigger.num2 = 13;
                    }
                }
            } else {
                game.log(player, "拼点牌点数", "#y-" + num);
                if (player == trigger.player) {
                    trigger.num1 -= num;
                    if (trigger.num1 < 1) {
                        trigger.num1 = 1;
                    }
                } else {
                    trigger.num2 -= num;
                    if (trigger.num2 < 1) {
                        trigger.num2 = 1;
                    }
                }
            }
        },
    },
    mcdh_RM01102: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filterTarget(card, player, target) {
            return player.canCompare(target);
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            const result = await player.chooseToCompare(target).forResult();
            if (result.bool) {
                await player.chooseUseTarget({ name: "sha", nature: "fire" }, true, false);
            } else {
                await player.loseHp();
                await player.chooseUseTarget({ name: "jiu", isCard: true }, true, false);
            }
        },
        ai: {
            order: 3,
            result: {
                target(player, target) {
                    if (
                        player.countCards("h", function (card) {
                            return player.hasValueTarget(card);
                        })
                    ) {
                        if (player.hasSkill("reqiaoshui_target")) {
                            return 0;
                        }
                        var nd = !player.needsToDiscard();
                        if (
                            player.hasCard(function (card) {
                                if (get.position(card) != "h") {
                                    return false;
                                }
                                var val = get.value(card);
                                if (nd && val < 0) {
                                    return true;
                                }
                                if (val <= 5) {
                                    return get.number(card) >= 12;
                                }
                                if (val <= 6) {
                                    return get.number(card) >= 13;
                                }
                                return false;
                            })
                        ) {
                            return -1;
                        }
                        return 0;
                    }
                    return -1;
                },
            },
        },
    },
    //杰西卡
    mcdh_CV00101: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        mcdhCharge: 3,
        filter(event, player) {
            if (!player.mcdh_hasCharge("mcdh_CV00101")) return false;
            const hs = player.getCards("h");
            if (!hs.length) return false;
            if (hs.some(card => {
                const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
                return (mod2 === false)
            })) return false;
            return ["sha", "juedou"].some(name => {
                const card = get.autoViewAs({ name }, hs);
                return player.hasUseTarget(card);
            });
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseButton([get.prompt2(event.skill), [["sha", "juedou"], "vcard"]])
                .set("filterButton", button => {
                    const player = get.player();
                    return player.hasUseTarget({ name: button.link[2], nature: button.link[3], });
                })
                .set("ai", button => {
                    const player = get.player();
                    return player
                        .getUseValue({
                            name: button.link[2],
                            nature: button.link[3],
                        });
                })
                .forResult();
            if (event.result?.bool && event.result.links?.length) {
                event.result.cost_data = event.result.links;
            }
        },
        async content(event, trigger, player) {
            const links = event.cost_data;
            const cards = player.getCards("h");
            player.mcdh_removeCharge(get.info(event.name).mcdhCharge);
            const card = get.autoViewAs({
                name: links[0][2],
                nature: links[0][3],
                storage: {
                    mcdh_CV00101: true
                }
            }, cards);
            if (player.hasUseTarget(card)) {
                player.addTempSkill("mcdh_CV00101");
                await player.chooseUseTarget(card, cards, true);
            }
        },
        subSkill: {
            effect: {
                audio: "mcdh_CV00101",
                trigger: {
                    source: ["damageBegin1", "damageSource"],
                },
                forced: true,
                charlotte: true,
                filter(event, player, name) {
                    if (name == "damageBegin1") return event.player.getHp() > player.getHp();
                    return event.checkMcdh_CV00101;
                },
                async content(event, trigger, player) {
                    if (event.triggername == "damageBegin1") trigger.checkMcdh_CV00101 = true;
                    else await player.draw(2);
                },
            },
        },
    },
    mcdh_CV00102: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        getList: ["sha", "shan", "tao", "jiu"],
        global: "mcdh_CV00102_global",
        enable: "chooseToUse",
        filter(event, player) {
            if (player.countCards("h") == 1) return false;
            for (var name of lib.inpile) {
                if (player.getStorage("mcdh_CV00102").includes(name)) continue;
                if (get.type(name) != "basic") continue;
                if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
            }
            return false;
        },
        chooseButton: {
            dialog(event, player) {
                const list = [];
                for (let name of lib.inpile) {
                    if (get.type(name) != "basic") continue;
                    if (player.getStorage("mcdh_CV00102").includes(name)) continue;
                    const card = { name: name, isCard: true };
                    if (event.filterCard(card, player, event)) list.add(name);
                }
                const dialog = ui.create.dialog("孤注一掷", [list, "vcard"]);
                dialog.direct = true;
                return dialog;
            },
            check(button) {
                if (button.link[2] == "shan") return 1;
                var player = _status.event.player;
                if (button.link[2] == "jiu") {
                    if (player.getUseValue({ name: "jiu" }) <= 0) return 0;
                    if (player.countCards("h", "sha")) return player.getUseValue({ name: "jiu" });
                }
                return player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
            },
            backup(links, player) {
                let next = {
                    viewAs: {
                        name: links[0][2],
                        isCard: true,
                    },
                };
                let num = 1 - player.countCards("h");
                if (num >= 0) {
                    next.filterCard = () => false;
                    next.selectCard = -1;
                    next.precontent = lib.skill.mcdh_CV00102.backups.get("draw").content;
                } else {
                    next.selectCard = -num;
                    next.ignoreMod = true;
                    next.filterCard = lib.filter.cardDiscardable;
                    next.check = card => {
                        return 5 - get.value(card);
                    };
                    next.precontent = lib.skill.mcdh_CV00102.backups.get("discard").content;
                }
                return next;
            },
            prompt(links, player) {
                let num = 1 - player.countCards("h");
                return (num >= 0 ? "摸" : "弃") + get.cnNumber(Math.abs(num)) + "张牌并视为使用" + get.translation(links[0][2]);
            },
        },
        backups: new Map([
            ["draw", {
                log: false,
                async content(event, trigger, player) {
                    player.markAuto("mcdh_CV00102", [event.result.card.name]);
                    await player.drawTo(1);
                },
                ai: {
                    result: {
                        player(player) {
                            return 1;
                        },
                    },
                },
            }],
            ["discard", {
                log: false,
                async content(event, trigger, player) {
                    player.markAuto("mcdh_CV00102", [event.result.card.name]);
                },
                ai: {
                    result: {
                        player(player) {
                            return 1;
                        },
                    },
                },
            }],
        ]),
        hiddenCard(player, name) {
            if (player.countCards("h") == 1) return false;
            if (player.getStorage("mcdh_CV00102").includes(name)) return false;
            return lib.inpile.includes(name) && get.type(name) == "basic";
        },
        onremove(player, skill) {
            player.removeTip(skill);
        },
        intro: {
            markcount: () => 0,
            content(storage, player) {
                const list = [], list2 = player.getStorage("mcdh_CV00102");
                for (var name of lib.inpile) {
                    if (get.type(name) != "basic") continue;
                    if (list2.includes(name)) continue;
                    list.add(name);
                }
                if (list.length > 1) return "";
                return `你不能使用或打出${get.translation(list)}，你的回合内，其他角色也不能使用或打出此牌`;
            },
        },
        ai: {
            order(item, player) {
                if (_status.event.type == "phase" && player.getUseValue({ name: "jiu" }, null, true) > 0 && player.countCards("h", "sha")) return get.order({ name: "jiu" }) + 1;
                return 1;
            },
            respondShan: true,
            respondSha: true,
            save: true,
            skillTagFilter(player, tag) {
                if (tag == "respondSha" && player.getStorage("mcdh_CV00102").includes("sha")) return false;
                else if (tag == "respondShan" && player.getStorage("mcdh_CV00102").includes("shan")) return false;
                return !player.getStorage("mcdh_CV00102").includes("tao");
            },
            result: {
                player(player) {
                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                    return 1;
                },
            },
        },
        subSkill: {
            backup: {},
            global: {
                mod: {
                    cardEnabled2(card, player) {
                        if (
                            !game.hasPlayer(target => {
                                return target.hasSkill("mcdh_CV00102");
                            })
                        )
                            return;
                        if (player.hasSkill("mcdh_CV00102")) {
                            const list = [], list2 = player.getStorage("mcdh_CV00102");
                            for (var name of lib.inpile) {
                                if (get.type(name) != "basic") continue;
                                if (list2.includes(name)) continue;
                                list.add(name);
                            }
                            if (list.length > 1) return;
                            if (list.includes(card.name)) return false;
                        }
                        if (_status.currentPhase && _status.currentPhase.hasSkill("mcdh_CV00102")) {
                            const list = [], list2 = _status.currentPhase.getStorage("mcdh_CV00102");
                            for (var name of lib.inpile) {
                                if (get.type(name) != "basic") continue;
                                if (list2.includes(name)) continue;
                                list.add(name);
                            }
                            if (list.length > 1) return;
                            if (list.includes(card.name)) return false;
                        }
                    },
                },
                trigger: {
                    player: "useCard",
                },
                forced: true,
                locked: true,
                silent: true,
                charlotte: true,
                filter(event, player) {
                    if (event.skill != "mcdh_CV00102_backup") return false;
                    const list = [], list2 = player.getStorage("mcdh_CV00102");
                    for (var name of lib.inpile) {
                        if (get.type(name) != "basic") continue;
                        if (list2.includes(name)) continue;
                        list.add(name);
                    }
                    if (list.length > 1) return false;
                    return player.hasSkill("mcdh_CV00102");
                },
                async content(event, trigger, player) {
                    const list = [], list2 = player.getStorage("mcdh_CV00102");
                    for (var name of lib.inpile) {
                        if (get.type(name) != "basic") continue;
                        if (list2.includes(name)) continue;
                        list.add(name);
                    }
                    player.markSkill("mcdh_CV00102");
                    player.addTip("mcdh_CV00102", get.translation("mcdh_CV00102") + " " + get.translation(list));
                },
            },
        },
    },
    //海伦娜
    mcdh_CV00201: {
        nobracket: true,
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        filter(event, player) {
            if (event.player != player) return player.countCards("he") > 1;
            return true;
        },
        async cost(event, trigger, player) {
            if (trigger.player == player) {
                event.result = await player
                    .chooseBool(`###${get.prompt(event.skill)}###你可以摸一张牌并展示一张牌且本回合内：所有角色手牌中与此展示牌颜色相同的牌视为【酒】，直到本回合有【酒】被使用。`)
                    .set("ai", () => {
                        return true;
                    })
                    .forResult();
            } else {
                event.result = await player
                    .chooseToDiscard(get.prompt(event.skill), "其他角色的准备阶段，你可以弃置两张牌，然后你摸一张牌并展示一张牌且本回合内：所有角色手牌中与此展示牌颜色相同的牌视为【酒】，直到本回合有【酒】被使用。", "he", 2, "chooseonly")
                    .set("ai", card => {
                        return 5 - get.value(card);
                    })
                    .forResult();
            }
        },
        async content(event, trigger, player) {
            if (event.cards?.length) await player.discard(event.cards);
            await player.draw();
            const hs = player.getCards("h");
            if (!hs.length) {
                return;
            }
            const result = hs.length == 1 ?
                { bool: true, cards: hs } :
                await player
                    .chooseCard("h", true, `你发动了${get.poptip(event.name)}`, `请选择展示一张牌，本回合所有角色手牌中与此展示牌颜色相同的牌视为【酒】，直到本回合有【酒】被使用。`)
                    .forResult();
            if (result?.bool && result?.cards?.length) {
                const color = get.color(result.cards[0]);
                await player.showCards(result.cards);
                const targets = game.filterPlayer();
                for (const target of targets) {
                    target.addTempSkill("mcdh_CV00201_effect");
                    target.markAuto("mcdh_CV00201_effect", [color]);
                }
            }
        },
        subSkill: {
            effect: {
                mod: {
                    cardname(card, player) {
                        if (player.hasStorage("mcdh_CV00201_effect", get.color(card))) return "jiu";
                    },
                },
                trigger: {
                    global: "useCard",
                },
                forced: true,
                popup: false,
                charlotte: true,
                onremove: true,
                filter(event, player) {
                    return event.card.name == "jiu";
                },
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
                mark: true,
                intro: {
                    markcount: () => 0,
                    content(storage, player) {
                        return `你的${get.translation(storage)}牌均视为【酒】，直到本回合有【酒】被使用`;
                    },
                },
            },
        },
    },
    //伍德洛
    mcdh_CV00301: {
        nobracket: true,
        trigger: {
            player: "useCardToPlayered",
        },
        mcdhAmmo: 2,
        filter(event, player) {
            if (!player.mcdh_hasAmmo("mcdh_CV00301")) return false;
            return event.card.name == "sha" && event.target.countCards("hej");
        },
        check(event, player) {
            if (get.attitude(player, event.target) > 0) return false;
            return event.target.countCards("hej", card => get.is.damageCard(card));
        },
        logTarget: "target",
        async content(event, trigger, player) {
            const target = trigger.target;
            player.mcdh_removeAmmo(2);
            await target.showHandcards();
            const cards = target.getCards("hej", card => {
                if (!target.canRecast(card)) return false;
                return get.is.damageCard(card) || get.subtype(card) == "equip1";
            });
            if (!cards.length) {
                return;
            }
            await target.recast(cards);
            var id = target.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == "number") {
                map[id].shanRequired += cards.length;
            }
            else {
                map[id].shanRequired = cards.length + 1;
            }
            if (cards.length < 2) return;
            if (typeof map[id].extraDamage != "number") {
                map[id].extraDamage = 0;
            }
            map[id].extraDamage++;
        },
    },
    mcdh_CV00302: {
        nobracket: true,
        trigger: {
            player: "loseAfter",
            global: ["loseAsyncAfter", "cardsDiscardAfter"],
        },
        forced: true,
        filter(event, player) {
            if (event.name != "cardsDiscard") {
                return event.getd(player, "cards2").some(card => get.name(card, player) == "jiedao");
            } else {
                if (!event.cards.filterInD("d").some(card => get.name(card, player) == "jiedao")) return false;
                var evt = event.getParent();
                if (evt.name != "orderingDiscard") return false;
                var evtx = (evt.relatedEvent || evt.getParent());
                if (evtx.player != player) return false;
                return player.hasHistory("lose", evtxx => {
                    return evtx == (evtxx.relatedEvent || evtxx.getParent()) && evtxx.cards2.length > 0;
                });
            }
            return false;
        },
        async content(event, trigger, player) {
            const cards = [];
            if (trigger.name != "cardsDiscard") cards.addArray(trigger.getd().filter(card => get.name(card, player) == "jiedao"));
            else cards.addArray(trigger.cards.filter(card => get.name(card, player) == "jiedao"));
            if (cards.length) {
                await player.gain(cards, "gain2");
            }
            var num = player.mcdh_countAmmo(true);
            if (num > 0) player.mcdh_addAmmo(num);
        },
    },
    //风笛
    mcdh_RH01601: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "useCardAfter",
        },
        forced: true,
        locked: true,
        filter(event, player) {
            if (event.card.name != "sha") return false;
            return !player.hasHistory("sourceDamage", evt => evt.card == event.card);
        },
        async content(event, trigger, player) {
            player.addSkill("mcdh_RH01601_effect");
            player.addMark("mcdh_RH01601_effect", 1, false);
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "useCard",
                },
                forced: true,
                popup: false,
                charlotte: true,
                onremove: true,
                filter(event, player) {
                    return event.card.name == "sha";
                },
                async content(event, trigger, player) {
                    trigger.baseDamage += player.countMark(event.name);
                    player.removeSkill(event.name);
                },
            },
        },
    },
    mcdh_RH01602: {
        audio: "ext:梦澈涤花/audio/skill:2",
        trigger: {
            player: "phaseEnd",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return !player.hasHistory("sourceDamage");
        },
        async content(event, trigger, player) {
            await player.draw();
            const cards = player.getCards("h", card => !get.is.shownCard(card));
            if (!cards.length) return;
            if (cards.length == 1) {
                event.result = { bool: true, cards: cards }
            } else event.result = await player
                .chooseCard(`你发动了${get.translation(event.name)}`, "请你明置一张牌", true)
                .set("filterCard", card => {
                    return !get.is.shownCard(card);
                })
                .forResult();
            if (event.result?.bool && event.result.cards?.length) {
                await player.addShownCards(event.result.cards, "visible_mcdh");
            }
        },
        group: "mcdh_RH01602_use",
        subSkill: {
            use: {
                audio: "mcdh_RH01602",
                trigger: {
                    global: "useCard",
                },
                usable: 1,
                filter(event, player) {
                    if (event.player == player) {
                        return false;
                    }
                    if (!["basic", "trick"].includes(get.type(event.card))) return false;
                    return player.getShownCards().length;
                },
                async cost(event, trigger, player) {
                    if (trigger.card.name == "wuxie" || trigger.card.name == "shan") {
                        if (get.attitude(player, trigger.player) < -1) {
                            effect = -1;
                        }
                    } else if (trigger.targets && trigger.targets.length) {
                        for (var i = 0; i < trigger.targets.length; i++) {
                            effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
                        }
                    }
                    var str = "令" + get.translation(trigger.player);
                    if (trigger.targets && trigger.targets.length) {
                        str += "对" + get.translation(trigger.targets);
                    }
                    str += "使用的" + get.translation(trigger.card) + "失效？";
                    event.result = await player
                        .chooseCard(get.prompt(event.skill, trigger.player), str, card => {
                            return get.is.shownCard(card);
                        })
                        .set("ai", card => {
                            const player = get.player();
                            const trigger = _status.event.getTrigger();
                            if (get.event().effect < 0) {
                                if (trigger.card.name == "sha") {
                                    var target = trigger.targets[0];
                                    if (target == player && !player.countCards("h", "shan")) {
                                        return 8 - get.value(card);
                                    } else if (target.hp == 1 || (target.countCards("h") <= 2 && target.hp <= 2)) {
                                        return 8 - get.value(card);
                                    }
                                } else {
                                    return 7 - get.value(card);
                                }
                            }
                            return 0;
                        })
                        .set("effect", effect)
                        .forResult();
                },
                logTarget: "player",
                async content(event, trigger, player) {
                    await player.give(event.cards, trigger.player);
                    trigger.targets.length = 0;
                    trigger.all_excluded = true;
                },
                ai: {
                    expose: 0.1,
                },
            },
        },
    },
};

export default skills;
