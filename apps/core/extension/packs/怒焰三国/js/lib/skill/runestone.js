import { lib, game, ui, get, ai, _status } from "noname";

const attack = {
    //震慑
    nysgs_fs_zhenshe: {
        trigger: {
            player: "useCardToPlayered",
        },
        forced: true,
        filter(event, player) {
            return (
                get.tag(event.card, "damage") >= 0.5 &&
                event.targets?.length == 1 &&
                event.target.nysgsCountFury()
            );
        },
        async content(event, trigger, player) {
            await trigger.target.nysgsRemoveFury(3);
        },
    },
    //夺魄
    nysgs_fs_duopo: {
        trigger: {
            source: "damageSource",
        },
        forced: true,
        filter(event, player) {
            return player.isDamaged();
        },
        async content(event, trigger, player) {
            await player.recover();
        },
    },
    //符爆
    nysgs_fs_fubao: {
        trigger: {
            source: "damageBegin1",
        },
        forced: true,
        filter(event, player) {
            return event.card && get.type(event.card) == "trick";
        },
        async content(event, trigger, player) {
            trigger.num++;
        },
    },
    //攻坚
    nysgs_fs_gongjian: {
        trigger: {
            player: "shaMiss",
        },
        forced: true,
        filter(event, player) {
            return event.target.isIn() && event.target != player;
        },
        async content(event, trigger, player) {
            await trigger.target.loseHp();
        },
    },
    //余威
    nysgs_fs_yuwei: {
        trigger: {
            player: "shaMiss",
        },
        forced: true,
        filter(event, player) {
            const evt = event.getParent();
            if (evt.name != "orderingDiscard") return false;
            const evtx = evt.relatedEvent || evt.getParent();
            return (
                evtx.name == "useCard" &&
                evtx.player == player &&
                event.cards.filterInD("d").some(card => {
                    if (get.type(card) != "trick") return false;
                    return !player.hasStorage("nysgs_fs_yuwei", card);
                })
            );
        },
        async content(event, trigger, player) {
            const cards = trigger.cards.filter(card => {
                return get.position(card, true) == "d" && !player.hasStorage(event.name, card);
            });
            if (cards.length) {
                player.markAuto(event.name, cards);
                await player.gain(cards, "gain2").set("gaintag", [event.name]);
            }
        },
    },
    //深谋
    nysgs_fs_shenmou: {
        trigger: {
            player: "useCard",
        },
        forced: true,
        filter(event, player) {
            return get.type(event.card) == "trick";
        },
        content() {
            trigger.nowuxie = true;
        },
    },
    //奋勇
    nysgs_fs_fenyong: {
        trigger: {
            player: "useCard",
        },
        forced: true,
        filter(event, player) {
            return player.isDamaged() && get.type(event.card) === "basic";
        },
        content() {
            trigger.baseDamage++;
        },
    },
    //游龙
    nysgs_fs_youlong: {
        trigger: {
            source: "damageBegin1",
        },
        forced: true,
        filter(event, player) {
            return event.card?.name == "sha" && event.getParent("useCard")?.nysgsFuryBuff;
        },
        content() {
            trigger.num++;
        },
    },
    //灵剑
    nysgs_fs_lingjian: {
        trigger: {
            player: "useCardToPlayered",
        },
        forced: true,
        filter(event, player) {
            return event.card.name == "sha" && event.target.countCards("he", { type: "equip" });
        },
        async content(event, trigger, player) {
            const target = trigger.target;
            player.logSkill(event.name, target);
            const cards = target
                .getCards("he", card => {
                    return get.type(card) == "equip" && lib.filter.canBeGained(card, target, player);
                })
                .randomGets(1);
            if (cards.length) {
                await player.gain(cards, target, "giveAuto", "bySelf");
            }
        },
    },
    //强攻
    nysgs_fs_qianggong: {
        trigger: {
            player: "useCardToPlayer",
        },
        forced: true,
        filter(event, player) {
            return event.card.name == "sha" && event.target.nysgsCountFury();
        },
        logTarget: "target",
        content() {
            trigger.target.nysgsRemoveFury(2);
        },
    },
    //天罚
    nysgs_fs_tianfa: {
        trigger: {
            source: "damageSource",
        },
        forced: true,
        filter(event, player) {
            return event.player != player;
        },
        logTarget: "player",
        content() {
            trigger.noFuryAdd = true;
        },
    },
    //惊鸿
    nysgs_fs_jinghong: {
        trigger: {
            source: "damageBegin1",
        },
        forced: true,
        filter(event, player) {
            return event.card?.name == "sha" && !event.getParent("useCard")?.nysgsFuryBuff;
        },
        content() {
            trigger.num++;
        },
    },
};
for (let i in attack) {
    attack[i].equipSkill = true;
    attack[i].popup = true;
    attack[i].silent = true;
    attack[i].runestoneSkill = "attack";
    attack[i].categories = () => ["符石技"];
}

const defend = {
    //凶兵
    nysgs_fs_xiongbing: {
        trigger: {
            player: "damageEnd",
        },
        forced: true,
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) {
                return false;
            }
            if (
                event.source &&
                event.source.hasSkillTag("undefend", false, {
                    name: event.card ? event.card.name : null,
                    target: player,
                    card: event.card,
                })
            ) {
                return false;
            }
            return event.source?.isIn() && event.source.countDiscardableCards(player, "he");
        },
        async content(event, trigger, player) {
            const target = trigger.source;
            player.logSkill(event.name, target);
            const cards = target.getCards("he", card => {
                return lib.filter.cardDiscardable(card, player, event.name);
            });
            if (cards.length) {
                await target.discard(cards.randomGets(trigger.num)).set("discarder", player);
            }
            const cards2 = target.getCards("e", card => {
                return player.canEquip(card);
            });
            if (cards2.length) {
                const card = cards2.randomGet();
                target.$give(card, player);
                await game.delay(0.5);
                await player.equip(card);
            }
        },
    },
    //灵阵
    nysgs_fs_lingzhen: {
        enable: ["chooseToRespond", "chooseToUse"],
        locked: false,
        filterCard(card) {
            return get.type(card) == "equip";
        },
        viewAs: {
            name: "shan",
        },
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) return false;
            const evt = event.getParent("useCard");
            if (evt?.player) {
                if (
                    evt.player &&
                    evt.player.hasSkillTag("undefend", false, {
                        name: evt.card ? evt.card.name : null,
                        target: player,
                        card: evt.card,
                    })
                ) {
                    return false;
                }
            }
            return true;
        },
        viewAsFilter(player) {
            if (!player.countCards("hs", { type: "equip" })) {
                return false;
            }
        },
        position: "hes",
        prompt: "将一张装备牌当闪使用或打出",
        check(card) {
            if (_status.event.name == "chooseToRespond") {
                return 7 - get.value(card);
            }
            return 5 - get.value(card);
        },
        log: false,
        async precontent(event, trigger, player) {
            player.logSkill("nysgs_fs_lingzhen");
            player.when("useCardAfter")
                .filter(event => event.skill == "nysgs_fs_lingzhen")
                .then(() => {
                    if (!trigger.nysgsFuryBuff) {
                        player.nysgsAddFury();
                    }
                });
        },
    },
    //英勇
    nysgs_fs_yingyong: {
        enable: "chooseToUse",
        viewAs: {
            name: "jiu",
        },
        filterCard: {
            type: "equip",
        },
        position: "hes",
        prompt: "将一张装备牌当酒使用",
        viewAsFilter(player) {
            if (_status.event.type == "dying") return false;
            if (player.hasSkillTag("undefend2")) return false;
            if (!player.isDying()) return false;
            return player.hasCard({ type: "equip" }, "hes");
        },
        check(card) {
            if (_status.event.type == "dying") {
                return 1 / (get.value(card) || 0.5);
            }
            return 5 - get.value(card);
        },
    },
    //妙算
    nysgs_fs_miaosuan: {
        enable: "chooseToUse",
        filter(event, player) {
            if (event.type != "wuxie" || _status.currentPhase == player) {
                return false;
            }
            let info = event.info_map;
            if (!info || get.type(info.card) != "trick") {
                return false;
            }
            if (player.hasSkillTag("undefend2")) return false;
            const evt = event.getParent("useCard");
            if (evt?.player) {
                if (
                    evt.player &&
                    evt.player.hasSkillTag("undefend", false, {
                        name: evt.card ? evt.card.name : null,
                        target: player,
                        card: evt.card,
                    })
                ) {
                    return false;
                }
            }
            return info.target == player;
        },
        filterCard: () => false,
        selectCard: -1,
        viewAs: {
            name: "wuxie",
        },
        viewAsFilter(player) {
            if (_status.currentPhase == player) return false;
        },
        prompt: "视为使用无懈可击",
    },
    //援兵
    nysgs_fs_yuanbing: {
        trigger: {
            player: ["damageEnd", "loseHpEnd"],
        },
        forced: true,
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) return false;
            if (
                event.source &&
                event.source.hasSkillTag("undefend", false, {
                    name: event.card ? event.card.name : null,
                    target: player,
                    card: event.card,
                })
            ) {
                return false;
            }
            return player.isDamaged();
        },
        content() {
            player.recover();
        },
    },
    //盾阵
    nysgs_fs_dunzhen: {
        enable: "chooseToUse",
        viewAs: {
            name: "wuxie",
        },
        filterCard: {
            type: "equip",
        },
        position: "hes",
        prompt: "将一张装备牌当无懈可击使用",
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) return false;
            const evt = event.getParent("useCard");
            if (evt?.player) {
                if (
                    evt.player &&
                    evt.player.hasSkillTag("undefend", false, {
                        name: evt.card ? evt.card.name : null,
                        target: player,
                        card: evt.card,
                    })
                ) {
                    return false;
                }
            }
            return true;
        },
        viewAsFilter(player) {
            if (!player.hasCard({ type: "equip" }, "hes")) {
                return false;
            }
        },
        check(card) {
            if (_status.event.type == "dying") {
                return 1 / (get.value(card) || 0.5);
            }
            return 5 - get.value(card);
        },
    },
    //神佑
    nysgs_fs_shenyou: {
        trigger: {
            player: ["damageBegin4", "loseHpBegin"],
        },
        forced: true,
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) return false;
            if (
                event.source &&
                event.source.hasSkillTag("undefend", false, {
                    name: event.card ? event.card.name : null,
                    target: player,
                    card: event.card,
                })
            ) {
                return false;
            }
            if (event.name == "loseHp") {
                const evt = event.getParent()
                return evt.name == "useCard" && get.type(evt.card) == "trick";
            }
            return event.card && get.type(event.card) == "trick";
        },
        content() {
            trigger.cancel();
        },
    },
    //轻灵
    nysgs_fs_qingling: {
        trigger: {
            player: "damageBegin3",
        },
        forced: true,
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) return false;
            if (
                event.source &&
                event.source.hasSkillTag("undefend", false, {
                    name: event.card ? event.card.name : null,
                    target: player,
                    card: event.card,
                })
            ) {
                return false;
            }
            return event.num == 1;
        },
        content() {
            trigger.cancel();
        },
    },
    //死守
    nysgs_fs_sishou: {
        mod: {
            maxHandcard(player, num) {
                if (_status.event.name == "phaseDiscard" || _status.event.getParent("phaseDiscard")?.name == "phaseDiscard") {
                    return 6 + player.getDamagedHp();
                }
            },
        },
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) return false;
            return player.needsToDiscard();
        },
        content() { },
    },
    //铁甲
    nysgs_fs_tiejia: {
        trigger: {
            player: "damageBegin3",
        },
        forced: true,
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) return false;
            if (
                event.source &&
                event.source.hasSkillTag("undefend", false, {
                    name: event.card ? event.card.name : null,
                    target: player,
                    card: event.card,
                })
            ) {
                return false;
            }
            return event.num > 1;
        },
        content() {
            player.logSkill(event.name);
            trigger.num--;
        },
    },
    //坚韧
    nysgs_fs_jianren: {
        trigger: {
            player: "damageEnd",
        },
        forced: true,
        filter(event, player) {
            if (player.hasSkillTag("undefend2")) return false;
            var evt = event.getParent();
            if (
                event.source &&
                event.source.hasSkillTag("undefend", false, {
                    name: event.card ? event.card.name : null,
                    target: player,
                    card: event.card,
                })
            ) {
                return false;
            }
            return player.isMinHp() && player.isDamaged();
        },
        content() {
            player.recover();
        },
    },
};
for (let i in defend) {
    defend[i].equipSkill = true;
    defend[i].popup = true;
    defend[i].silent = true;
    defend[i].runestoneSkill = "defend";
    defend[i].categories = () => ["符石技"];
}

const draw = {
    //战鼓
    nysgs_fs_zhangu: {
        trigger: {
            player: "useCard",
        },
        forced: true,
        filter(event, player) {
            return get.tag(event.card, "damage") >= 0.5;
        },
        content() {
            const xushi = get.type(trigger.card) == "trick" && get.info("xunshi").isXunshi(trigger.card);
            player.draw(xushi ? 2 : 1);
        },
    },
    //军阵
    nysgs_fs_junzhen: {
        trigger: {
            player: "phaseDrawBegin2",
        },
        forced: true,
        filter(event, player) {
            return !event.numFixed;
        },
        content() {
            trigger.num += game.countPlayer();
        },
    },
    //巡查
    nysgs_fs_xuncha: {
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        forced: true,
        filter(event, player) {
            if (!player.isMinHandcard()) {
                return false;
            }
            const evt = event.getl(player);
            return evt && evt.player == player && evt.hs && evt.hs.length > 0;
        },
        content() {
            player.draw(2);
        },
    },
    //生机
    nysgs_fs_shengji: {
        trigger: {
            player: "changeHpEnd",
        },
        forced: true,
        filter(event, player) {
            return event.num > 0;
        },
        content() {
            const num = Math.min(5, trigger.num);
            player.draw(num);
        },
    },
    //藏锋
    nysgs_fs_cangfeng: {
        trigger: {
            global: "phaseEnd",
        },
        forced: true,
        filter(event, player) {
            return player.countCards("h");
        },
        content() {
            const num = player.getCards("h").reduce((list, card) => list.add(get.type2(card)), []).length;
            if (num > 0) player.draw(num);
        },
    },
    //爆能
    nysgs_fs_baoneng: {
        trigger: {
            player: "nysgsAddFuryEnd",
        },
        forced: true,
        filter(event, player) {
            return !player.nysgsCountFury(true);
        },
        content() {
            player.draw(2);
        },
    },
    //武库
    nysgs_fs_wuku: {
        trigger: {
            global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
        },
        forced: true,
        filter(event, player) {
            if (!event.getd) {
                return false;
            }
            let cards = event.getd();
            return cards.some(card => {
                if (get.position(card) != "d" || get.type(card) != "equip") {
                    return false;
                }
                if (card.willBeDestroyed("discardPile", get.owner(card), event)) {
                    return false;
                }
                return game.hasPlayer(target => {
                    return target != player && event.getd(target, "cards2").includes(card);
                });
            });
        },
        async content(event, trigger, player) {
            const cards = trigger.getd().filter(card => {
                if (get.position(card) != "d" || get.type(card) != "equip") {
                    return false;
                }
                if (card.willBeDestroyed("discardPile", get.owner(card), trigger)) {
                    return false;
                }
                return game.hasPlayer(target => {
                    return target != player && trigger.getd(target, "cards2").includes(card);
                });
            });
            if (cards.length) {
                await player.gain(cards, "gain2");
            }
            await player.draw(2);
        },
    },
    //诱敌
    nysgs_fs_youdi: {
        trigger: {
            player: ["nysgsAddFuryEnd", "nysgsRemoveFuryEnd"],
        },
        forced: true,
        content() {
            player.draw(2);
        },
    },
    //袭扰
    nysgs_fs_xirao: {
        trigger: {
            global: "nysgsAddFuryEnd",
        },
        forced: true,
        filter(event, player) {
            return event.player != player && event.num > 0;
        },
        content() {
            player.draw(trigger.num);
        },
    },
    //御灵
    nysgs_fs_yuling: {
        trigger: {
            player: "phaseEnd",
        },
        forced: true,
        filter(event, player) {
            return player.isDamaged();
        },
        content() {
            player.draw(2);
        },
    },
    //轻身
    nysgs_fs_qingshen: {
        trigger: {
            player: "phaseDrawBegin2",
        },
        forced: true,
        filter(event, player) {
            return !event.numFixed && !player.nysgsCountFury(true);
        },
        content() {
            trigger.num += 2;
        },
    },
    //虎啸
    nysgs_fs_huxiao: {
        trigger: {
            global: "nysgsRemoveFuryEnd",
        },
        forced: true,
        filter(event, player) {
            return event.player != player && event.num > 0;
        },
        content() {
            player.draw(trigger.num);
        },
    },
};
for (let i in draw) {
    draw[i].equipSkill = true;
    draw[i].popup = true;
    draw[i].silent = true;
    draw[i].runestoneSkill = "draw";
    draw[i].categories = () => ["符石技"];
}

const fury = {
    //杀意
    nysgs_fs_shayi: {
        trigger: {
            player: "useCardToPlayered",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            return event.card.name == "sha";
        },
        content() {
            player.draw(trigger.target.isMinHp() ? 2 : 1);
        },
    },
    //奋发
    nysgs_fs_fenfa: {
        trigger: {
            player: "changeHpAfter",
        },
        forced: true,
        filter(event, player) {
            return event.num < 0;
        },
        content() {
            player.nysgsAddFury();
            player.recover();
        },
    },
    //星驰
    nysgs_fs_xingchi: {
        trigger: {
            player: "changeHpAfter",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            return event.player != player && (event.card.name == "sha" || (get.type(event.card) == "trick" && get.info("xunshi").isXunshi(event.card)));
        },
        content() {
            player.nysgsAddFury();
        },
    },
    //同仇
    nysgs_fs_tongchou: {
        trigger: {
            global: ["damageEnd", "loseHpAfter"],
        },
        forced: true,
        filter(event, player) {
            return event.player != player;
        },
        content() {
            player.nysgsAddFury();
            player.recover();
        },
    },
    //鬼谋
    nysgs_fs_guimou: {
        trigger: {
            player: "useCard",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            return get.type(event.card) == "trick";
        },
        content() {
            const xushi = get.type(trigger.card) == "trick" && get.info("xunshi").isXunshi(trigger.card);
            player.nysgsAddFury(xushi ? 2 : 1);
        },
    },
    //振奋
    nysgs_fs_zhenfen: {
        trigger: {
            player: "nysgsRemoveFuryEnd",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            return player.nysgsCountFury() <= 1;
        },
        content() {
            player.nysgsAddFury(2);
        },
    },
    //奇谋
    nysgs_fs_qimou: {
        trigger: {
            player: "useCard",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            if (_status.currentPhase == player) return false;
            return event.card.name == "wuxie";
        },
        content() {
            player.nysgsAddFury(2);
            const target = _status.currentPhase;
            if (target?.isIn()) {
                const cards = target.getCards("h", card => {
                    return lib.filter.cardDiscardable(card, player, "nysgs_fs_qimou");
                });
                if (cards.length) {
                    player.line(target);
                    target.discard(cards.randomGets(1));
                }
            }
        },
    },
    //武灵
    nysgs_fs_wuling: {
        trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            const evt = event.getl(player);
            if (event.name == "equip" && event.player == player) {
                return true;
            }
            return evt && evt.es.length;
        },
        getIndex(event, player) {
            const evt = event.getl(player);
            if (event.name == "equip" && event.player == player && evt && evt.es.length) {
                return 2;
            }
            return 1;
        },
        content() {
            player.nysgsAddFury(2);
        },
    },
    //哀兵
    nysgs_fs_aibing: {
        trigger: {
            player: "phaseBegin",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            return player.isDamaged();
        },
        content() {
            player.nysgsAddFury(player.getDamagedHp());
        },
    },
    //精兵
    nysgs_fs_jingbing: {
        trigger: {
            player: "phaseBegin",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            return player.countCards("e");
        },
        content() {
            player.nysgsAddFury(2);
        },
    },
    //灵渊
    nysgs_fs_lingyuan: {
        trigger: {
            player: "phaseBegin",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            return player.nysgsCountFury() < 2;
        },
        content() {
            player.nysgsAddFury(2);
        },
    },
    //孤军
    nysgs_fs_lingyuan: {
        trigger: {
            player: "phaseEnd",
        },
        forced: true,
        filter(event, player) {
            if (!player.nysgsCountFury(true)) return false;
            return player.getHistory("lose", evt => {
                return evt.type == "discard" && evt.getParent("phaseDiscard")?.player == player;
            })
                .reduce((sum, evtx) => sum + evtx.cards2.length, 0) > 0;
        },
        content() {
            const num = player
                .getHistory("lose", evt => {
                    return evt.type == "discard" && evt.getParent("phaseDiscard")?.player == player;
                })
                .reduce((sum, evtx) => sum + evtx.cards2.length, 0);
            player.nysgsAddFury(num);
        },
    },
};
for (let i in fury) {
    fury[i].equipSkill = true;
    fury[i].popup = true;
    fury[i].silent = true;
    fury[i].runestoneSkill = "fury";
    fury[i].categories = () => ["符石技"];
}

const sign = {
    //甄姬
    nysgs_fs_zhenji: {
        nobracket: true,
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        filter(event, player) {
            if (!get.info("nysgs_fs_caopi").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_zhenji");
        },
        async content(event, trigger, player) {
            const cards = [];
            while (true) {
                const next = player.judge(function (card) {
                    if (get.color(card) == "red") {
                        return 1.5;
                    }
                    return -1.5;
                });
                next.judge2 = function (result) {
                    return result.bool;
                };
                next.set("callback", function () {
                    if (event.judgeResult.color == "red") {
                        event.getParent().orderingCards.remove(card);
                    }
                });
                const result = await next.forResult();
                cards.push(result.card);
                if (!result?.bool) {
                    if (cards.length) await player.gain(cards, "gain2");
                    break;
                }
            }
        },
    },
    //曹丕
    nysgs_fs_caopi: {
        trigger: {
            player: "nysgs_caopi_skillAfter",
        },
        forced: true,
        filter(event, player) {
            if (!get.info("nysgs_fs_caopi").filterx(event, player)) return false;
            return event.targets.some(target => target.countGainableCards(player, "he"));
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_caopi");
        },
        async content(event, trigger, player) {
            for (const target of trigger.targets) {
                const result = await player.gainPlayerCard(target, "he", true).forResult();
                if (result?.bool && result.cards?.length) {
                    if (get.type(result.cards[0]) != "basic") {
                        await player.recover();
                    }
                }
            }
        },
    },
    //辛宪英
    nysgs_fs_xinxianying: {
        nobracket: true,
        trigger: {
            player: "useSkillAfter",
        },
        forced: true,
        filter(event, player) {
            if (!get.info("nysgs_fs_xinxianying").filterx(event, player)) return false;
            return event.skill == "nysgs_xinxianying_skill";
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_xinxianying");
        },
        logTarget(event, player) {
            return event.targets[0];
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.addTempSkill("nysgs_fs_xinxianying_effect", { player: "phaseBeginStart" });
            target.addAdditionalSkill(`nysgs_fs_xinxianying_${player.playerid}`, "nysgs_fs_xinxianying_mark");
            target.markAuto("nysgs_fs_xinxianying_mark", [player]);
        },
        subSkill: {
            effect: {
                mod: {
                    targetEnabled(card, player, target, now) {
                        if (!get.is.singleCard(card)) {
                            return;
                        }
                        if (player.hasStorage("nysgs_fs_xinxianying_mark", target)) {
                            return false;
                        }
                    },
                },
                charlotte: true,
                onremove(player) {
                    game.countPlayer2(current => {
                        if (current.getStorage("nysgs_fs_xinxianying_mark").includes(player)) {
                            current.unmarkAuto("nysgs_fs_xinxianying_mark", [player]);
                            current.removeAdditionalSkill(`nysgs_fs_xinxianying_${player.playerid}`);
                        }
                    }, true);
                },
            },
            mark: {
                charlotte: true,
                onremove: true,
                mark: true,
                marktext: "忠奸",
                intro: {
                    markcount: () => 0,
                    content: "你使用的单体非延时锦囊牌无法指定$为目标",
                },
            },
        },
    },
    //戏志才
    nysgs_fs_xizhicai: {
        nobracket: true,
        trigger: {
            player: "judge",
        },
        popup: false,
        filter(event, player) {
            if (!get.info("nysgs_fs_xizhicai").filterx(event, player)) return false;
            return event.getParent().name == "nysgs_xizhicai_skill" && player.countCards("hs") > 0;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_xizhicai");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt(event.skill), "hs", card => {
                    const player = _status.event.player;
                    const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
                    if (mod2 != "unchanged") {
                        return mod2;
                    }
                    const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
                    if (mod != "unchanged") {
                        return mod;
                    }
                    return true;
                })
                .set("ai", card => {
                    const trigger = _status.event.getTrigger();
                    const player = _status.event.player;
                    const judging = _status.event.judging;
                    const result = trigger.judge(card) - trigger.judge(judging);
                    const attitude = get.attitude(player, trigger.player);
                    let val = get.value(card);
                    if (get.subtype(card) == "equip2") {
                        val /= 2;
                    } else {
                        val /= 4;
                    }
                    if (attitude == 0 || result == 0) {
                        return 0;
                    }
                    if (attitude > 0) {
                        return result - val;
                    }
                    return -result - val;
                })
                .set("judging", trigger.player.judging[0])
                .forResult();
        },
        async content(event, trigger, player) {
            const chooseCardResultCards = event.cards;
            await player.respond(chooseCardResultCards, "nysgs_fs_xizhicai", "highlight", "noOrdering");
            if (trigger.player.judging[0].clone) {
                trigger.player.judging[0].clone.classList.remove("thrownhighlight");
                game.broadcast(function (card) {
                    if (card.clone) {
                        card.clone.classList.remove("thrownhighlight");
                    }
                }, trigger.player.judging[0]);
                game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
            }
            game.cardsDiscard(trigger.player.judging[0]);
            trigger.player.judging[0] = chooseCardResultCards[0];
            trigger.orderingCards.addArray(chooseCardResultCards);
            game.log(trigger.player, "的判定牌改为", chooseCardResultCards[0]);
            await game.delay(2);
        },
    },
    //曹叡
    nysgs_fs_caorui: {
        nobracket: true,
        trigger: {
            global: "dying",
        },
        filter(event, player) {
            if (!get.info("nysgs_fs_caorui").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_caorui");
        },
        logTarget: "player",
        check(event, player) {
            return get.attitude(player, event.player) > 0;
        },
        async content(event, trigger, player) {
            await trigger.player.recoverTo(1);
            if (trigger.player != player) {
                await player.damage("nosource");
            }
        },
    },
    nysgs_fs_chengyu: {
        nobracket: true,
        trigger: {
            player: "logSkill",
        },
        forced: true,
        filter(event, player) {
            if (!get.info("nysgs_fs_chengyu").filterx(event, player)) return false;
            return event.skill == "nysgs_chengyu_skill_use" && event.targets?.length;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_chengyu");
        },
        async content(event, trigger, player) {
            for (const target of trigger.targets) {
                target.addTempSkill("nysgs_fs_chengyu_effect");
            }
        },
        getSkills() {
            return lib.runestoneSkills
                .filter(skill => {
                    const info = get.info(skill);
                    return info && ["attack", "defend", "draw", "fury"].includes(info.runestoneSkill);
                });
        },
        subSkill: {
            effect: {
                init(player, skill) {
                    player.addSkillBlocker(skill);
                },
                onremove(player, skill) {
                    player.removeSkillBlocker(skill);
                },
                skillBlocker(skill, player) {
                    return get.info("nysgs_fs_chengyu").getSkills().includes(skill);
                },
                trigger: {
                    get player() {
                        return get.info("nysgs_fs_chengyu").getSkills().map(skill => skill + "Begin");
                    },
                },
                forced: true,
                charlotte: true,
                content() {
                    trigger.cancel();
                },
                mark: true,
                intro: {
                    content: "本回合触发的技能符石失效",
                },
            },
        },
    },
    nysgs_fs_guozhao: {
        nobracket: true,
        trigger: {
            global: "phaseBegin",
        },
        filter(event, player) {
            if (!get.info("nysgs_fs_guozhao").filterx(event, player)) return false;
            return event.player != player && player.countCards("he");
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_guozhao");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill, trigger.player), "he", "chooseonly")
                .set("ai", card => {
                    const player = get.player();
                    const trigger = _status.event.getTrigger();
                    return get.attitude(player, trigger.player) < 0;
                })
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            await player.discard(event.cards);
            const skill = event.name + "_effect";
            player.addTempSkill(skill);
            if (player.getStorage(skill).some(info => info[0] == trigger.player)) {
                let list = player.getStorage(skill).find(info => info[0] == trigger.player);
                list[1] = list[1].addArray(event.cards);
            } else player.markAuto(skill, [[trigger.player, event.cards]]);
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    targetEnabled(card, player, target) {
                        if (get.type(card) != "basic") return;
                        const skill = "nysgs_fs_guozhao_effect";
                        const storage = target.getStorage(skill);
                        if (storage.some(info => info[0] == player)) {
                            if (storage.some(info => info[1].reduce((list, card) => list.add(get.color(card)), []).includes(get.color(card)))) {
                                return false;
                            }
                        }
                    },
                },
                mark: true,
                intro: {
                    markcount: () => 0,
                    content(storage, player) {
                        let str = "";
                        storage.forEach(target => {
                            return str += `<span class=thundertext>${get.translation(target[0])}</span>本回合使用与<span class=yellowtext>${get.translation(target[1])}</span>颜色相同基本牌无法指定你为目标`;
                        });
                        return str;
                    },
                },
            },
        },
    },
    //曹婴
    nysgs_fs_caoying: {
        nobracket: true,
        trigger: {
            global: "showCardsAfter",
        },
        forced: true,
        filter(event, player) {
            if (!get.info("nysgs_fs_caoying").filterx(event, player)) return false;
            if (event.getParent().name != "nysgs_caoying_skill") return false;
            const types = event.player.getCards("h").reduce((list, card) => list.add(get.type2(card)), []);
            return types.length != event.player.getCards("h");
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_caoying");
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const target = trigger.player;
            const types = target.getCards("h").reduce((list, card) => list.add(get.type2(card)), []);
            if (types.length == target.countCards("h")) return;
            const result = await target
                .chooseCard("h", types.length, true, (card, player) => {
                    if (ui.selected.cards.length) {
                        return !ui.selected.cards.some(cardx => get.type2(cardx, player) == get.type2(card, player));
                    }
                    return true;
                })
                .set("complexCard", true)
                .set("ai", card => {
                    return get.value(card);
                })
                .forResult();
            if (result?.bool) {
                const cards = target.getCards("h").removeArray(result.cards);
                if (cards.length) {
                    await trigger.player.modedDiscard(cards);
                }
            }
        },
    },
    //魏文鸯
    nysgs_fs_wei_wenyang: {
        nobracket: true,
        trigger: {
            player: "useCardToPlayered",
        },
        locked: true,
        filter(event, player) {
            if (!get.info("nysgs_fs_wei_wenyang").filterx(event, player)) return false;
            return event.card.name == "juedou" && event.targets.length == 1;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_wei_wenyang");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseControl("无视防具且不可被响应", "无视防御符石且视为体力流失")
                .set("prompt", `你发动了【${get.translation(event.skill)}】，请选择一项`)
                .set("ai", () => {
                    const player = get.player();
                    const trigger = _status.event.getTrigger();
                    if (get.attitude(player, trigger.target) > 0) return 1;
                    return get.rand(0, 1);
                })
                .forResult();
            event.result.cost_data = { index: event.result.index };
        },
        async content(event, trigger, player) {
            player.addTempSkill(event.name + "_effect");
            if (event.cost_data.index == 0) {
                trigger.card._nysgs_fs_wei_wenyang_unequip = true;
                trigger.getParent().directHit.addArray(game.filterPlayer());
            } else {
                trigger.card._nysgs_fs_wei_wenyang_undefend = true;
            }
        },
        subSkill: {
            effect: {
                trigger: {
                    global: "damageBegin1",
                },
                forced: true,
                charlotte: true,
                forceDie: true,
                filter(event, player) {
                    return event.card?._nysgs_fs_wei_wenyang_undefend;
                },
                async content(event, trigger, player) {
                    game.setNature(trigger, "nysgswater");
                },
                ai: {
                    unequip: true,
                    undefend: true,
                    skillTagFilter(player, tag, arg) {
                        if (tag == "unequip") {
                            if (!arg?.card?._nysgs_fs_wei_wenyang_unequip) return false;
                        }
                        if (!arg?.card?._nysgs_fs_wei_wenyang_undefend) return false;
                    },
                },
            },
        },
    },
    //卞夫人
    nysgs_fs_bianfuren: {
        nobracket: true,
        trigger: {
            player: "useCardAfter",
        },
        filter(event, player) {
            if (!get.info("nysgs_fs_bianfuren").filterx(event, player)) return false;
            if (!player.getExpansions("nysgs_bianfuren_skill").length) return false;
            return get.type(event.card) == "basic" || get.is.singleCard(event.card);
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_bianfuren");
        },
        async cost(event, trigger, player) {
            const cards = player.getExpansions("nysgs_bianfuren_skill");
            event.result = await player
                .chooseCardButton(get.prompt2(event.skill), cards, [1, 2])
                .set("ai", button => {
                    const player = get.player();
                    if (player.getExpansions("nysgs_bianfuren_skill").length < 2) return 0;
                    return player.getUseValue(button.link);
                })
                .forResult();
            if (event.result.bool) {
                event.result.cost_data = event.result.links;
            }
        },
        content() {
            player.gain(event.cost_data, "gain2");
        },
    },
    //曹纯
    nysgs_fs_caochun: {
        nobracket: true,
        trigger: {
            global: "phaseUseBegin",
        },
        filter(event, player) {
            if (!get.info("nysgs_fs_caochun").filterx(event, player)) return false;
            return event.player != player && player.countCards("he", { type: "equip" });
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_caochun");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill, trigger.player), "he", "chooseonly")
                .set("filterCard", card => {
                    return get.type(card) == "equip";
                })
                .set("ai", card => {
                    const player = get.player();
                    const trigger = _status.event.getTrigger();
                    return get.attitude(player, trigger.player) < 0;
                })
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            await player.discard(event.cards);
            const colors = event.cards.reduce((list, card) => list.add(get.color(card)), []);
            trigger.player.addTempSkill("nysgs_fs_caochun_effect", "phaseUseAfter");
            trigger.player.markAuto("nysgs_fs_caochun_effect", colors);
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardEnabled2(card, player, target) {
                        if (get.position(card) != "h") return;
                        if (player.getStorage("nysgs_fs_caochun_effect").includes(get.color(card))) return false;
                    },
                },
                mark: true,
                intro: {
                    content: "此阶段不能使用或打出$手牌",
                },
            },
        },
    },
    //羊徽瑜
    nysgs_fs_yanghuiyu: {
        nobracket: true,
        trigger: {
            global: "phaseBegin",
        },
        filter(event, player) {
            if (!get.info("nysgs_fs_yanghuiyu").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_yanghuiyu");
        },
        getList() {
            let list = Object.keys(lib.characterPack.nysgs);
            const players = game.players.concat(game.dead);
            for (var i = 0; i < players.length; i++) {
                list.remove(players[i].name);
                list.remove(players[i].name1);
                list.remove(players[i].name2);
            }
            list.removeArray(lib.skill.nysgs_fs_yanghuiyu.banList);
            const filter = skill => {
                const translation = get.skillInfoTranslation(skill);
                if (!translation) return false;
                const info = get.info(skill);
                return info && !info.charlotte;
            };
            list = list.filter(name => (lib.character[name][0] == "female"));
            list = list.filter(name => (lib.character[name][3] || []).some(filter));
            return list;
        },
        banList: [],
        async content(event, trigger, player) {
            const list = lib.skill.nysgs_fs_yanghuiyu.getList().randomGets(3);
            const skills = [];
            for (const i of list) {
                skills.addArray(
                    (lib.character[i][3] || []).filter(function (skill) {
                        const info = get.info(skill);
                        return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill;
                    }).slice(0, 1)
                );
            }
            if (!list.length) {
                return;
            }
            const videoId = lib.status.videoId++;
            const createDialog = function (list, skills, id) {
                let dialog = ui.create.dialog("###追思###", [list, "character"]);
                if (list.length > 6) {
                    const width = list.length * (lib.config["extension_十周年UI_enable"] ? 150 : 125);
                    dialog.style.setProperty("width", (width + "px"), "important");
                    dialog.style.setProperty("left", `calc(50% - ${(width / 2)}px)`, "important");
                }
                dialog.add([skills.map(skill => [skill, get.translation(skill)]), "tdnodes"]);
                const width = Math.max(...dialog.buttons.map(button => button.getBoundingClientRect().width));
                dialog.buttons.forEach(button => {
                    if (!list.includes(button.link)) {
                        button.style.setProperty("width", `${width}px`, "important");
                        if (lib.config["extension_十周年UI_enable"]) {
                            const margin = "20px";
                            button.style.setProperty("margin-left", margin, "important");
                            button.style.setProperty("margin-right", margin, "important");
                        }
                    } else {
                        button.style.setProperty("opacity", "1", "important");
                    }
                });
                dialog.videoId = id;

                dialog.style.display = "none";
                return dialog;
            }
            if (player.isOnline()) {
                player.send(createDialog, list, skills, videoId);
            } else {
                createDialog(list, skills, videoId);
            }
            const result = await player
                .chooseButton(get.idDialog(videoId), true)
                .set("filterButton", button => {
                    return !button.classList.contains("character");
                })
                .set("ai", button => {
                    const skill = button.link;
                    return get.skillRank(skill, "inout");
                })
                .forResult();
            game.broadcastAll("closeDialog", videoId);
            if (result?.links?.length) {
                await player.addTempSkills(result.links);
            }
            game.broadcastAll(function (list) {
                game.expandSkills(list);
                for (const i of list) {
                    var info = lib.skill[i];
                    if (!info) {
                        continue;
                    }
                    if (!info.audioname2) {
                        info.audioname2 = {};
                    }
                    info.audioname2.nysgs_yanghuiyu = "nysgs_yanghuiyu_skill";
                }
            }, result.links);
        },
    },
    //王元姬
    nysgs_fs_wangyuanji: {
        nobracket: true,
        trigger: {
            player: "dying",
        },
        filter(event, player) {
            if (!get.info("nysgs_fs_wangyuanji").filterx(event, player)) return false;
            return player.countCards("hes", { color: "black" });
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_wangyuanji");
        },
        async cost(event, trigger, player) {
            const num = player.countSkill(event.skill) + 1;
            const target = _status.currentPhase;
            const result = await player
                .chooseToUse()
                .set("openskilldialog", `###${get.prompt(event.skill)}###你可以将${num}张黑色牌当【酒】使用${target?.isIn() ? `，然后对${get.translation(target)}造成${num}点伤害` : ""}`)
                .set("norestore", true)
                .set("_backupevent", `${event.skill}_backup`)
                .set("addCount", false)
                .set("logSkill", `${event.skill}`)
                .set("custom", {
                    add: {},
                    replace: { window() { } },
                })
                .set("nouse", true)
                .set("num", num)
                .backup(`${event.skill}_backup`)
                .forResult();
            event.result = { bool: result.bool, cost_data: { result } };
        },
        async content(event, trigger, player) {
            const { cost_data: { result } } = event;
            trigger._nysgs_fs_wangyuanji = true;
            player.addTempSkill(event.name + "_effect");
            await player.useResult(result, event);
        },
        subSkill: {
            backup: {
                viewAs: {
                    name: "jiu",
                },
                viewAsFilter(player) {
                    if (player.countCards("hes", { color: "black" }) < get.event().num) {
                        return false;
                    }
                },
                filterCard(card) {
                    return get.itemtype(card) == "card" && get.color(card) == "black";
                },
                position: "hes",
                selectCard() {
                    return get.event().num;
                },
                ai1(card) {
                    const player = get.player(),
                        target = _status.currentPhase;
                    if (target?.isIn() && get.attitude(player, target) > 0) {
                        return 0;
                    }
                    return 7 - get.value(card);
                },
                log: false,
            },
            effect: {
                trigger: {
                    player: "dyingAfter",
                },
                silent: true,
                charlotte: true,
                filter(event, player) {
                    return _status.currentPhase?.isIn() && event._nysgs_fs_wangyuanji;
                },
                logTarget: () => _status.currentPhase,
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const num = player.countSkill("nysgs_fs_wangyuanji");
                    await target.damage(num);
                },
            },
        },
    },
    //曹髦
    nysgs_fs_caomao: {
        trigger: {
            player: "nysgs_caomao_skillBegin",
        },
        forced: true,
        filter(event, player) {
            if (!get.info("nysgs_fs_caomao").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_caomao");
        },
        async content(event, trigger, player) {
            if (typeof trigger.num != "number" || !trigger.num) {
                trigger.num = 0;
            }
            trigger.num += 2;
            player
                .when("nysgs_caomao_skillAfter")
                .filter(evt => evt == trigger)
                .then(() => {
                    player.changeHujia(6);
                });
        },
        ai: {
            combo: "nysgs_caomao_skill",
        },
    },
    //蔡贞姬
    nysgs_fs_caizhenji: {
        nobracket: true,
        trigger: {
            player: "changeHpEnd",
        },
        filter(event, player) {
            if (!get.info("nysgs_fs_caizhenji").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_caizhenji");
        },
        check(event, player) {
            return player.getDamagedHp() > 2;
        },
        async content(event, trigger, player) {
            const cards = [];
            for (var i = 0; i < 3; i++) {
                const card = get.cardPile(card => {
                    return get.number(card) <= 6 && !cards.includes(card);
                }, null, "random");
                if (card) cards.push(card);
            }
            if (!cards.length) return;
            const result = await player
                .chooseButton(["凤栖琴：选择获得其中1张牌", cards], "hidden", true)
                .set("ai", button => {
                    const player = get.player();
                    return player.getUseValue(button.link) + get.number(button.link) * 0.1;
                })
                .forResult();
            if (result?.bool) {
                await player.gain(result.links, "gain2");
            }
        }
    },
    //陈琳
    nysgs_fs_chenlin: {
        nobracket: true,
        trigger: {
            player: "nysgs_chenlin_skillAfter",
        },
        filter(event, player) {
            if (!get.info("nysgs_fs_chenlin").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_chenlin");
        },
        async content(event, trigger, player) {
            const cards = [];
            for (var i = 0; i < 2; i++) {
                const card = get.cardPile(card => {
                    return get.suit(card) == "spade" && !cards.includes(card);
                }, null, "random");
                if (card) cards.push(card);
            }
            if (cards.length) {
                await player.gain(cards, "gain2");
            }
        },
    },
    //谋司马懿
    nysgs_fs_mou_simayi: {
        nobracket: true,
        trigger: {
            player: "turnOverBegin",
        },
        popup: false,
        filter(event, player) {
            if (!get.info("nysgs_fs_mou_simayi").filterx(event, player)) return false;
            return game.hasPlayer(target => {
                return player.getSeatNum() > target.getSeatNum() || target.hp > player.hp;
            });
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_mou_simayi");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return player.getSeatNum() > target.getSeatNum() || target.hp > player.hp;
                })
                .set("ai", target => {
                    if (target.hasSkillTag("noturn")) {
                        return 0;
                    }
                    const player = _status.event.player;
                    const current = _status.currentPhase;
                    const dis = current ? get.distance(current, target, "absolute") : 1;
                    const draw = player.getDamagedHp();
                    const att = get.attitude(player, target);
                    if (att == 0) {
                        return target.hasJudge("lebu") ? Math.random() / 3 : Math.sqrt(get.threaten(target)) / 5 + Math.random() / 2;
                    }
                    if (att > 0) {
                        if (target.isTurnedOver()) {
                            return att + draw;
                        }
                        if (draw < 4) {
                            return -1;
                        }
                        if (current && target.getSeatNum() > current.getSeatNum()) {
                            return att + draw / 3;
                        }
                        return (10 * Math.sqrt(Math.max(0.01, get.threaten(target)))) / (3.5 - draw) + dis / (2 * game.countPlayer());
                    } else {
                        if (target.isTurnedOver()) {
                            return att - draw;
                        }
                        if (draw >= 5) {
                            return -1;
                        }
                        if (current && target.getSeatNum() <= current.getSeatNum()) {
                            return -att + draw / 3;
                        }
                        return (4.25 - draw) * 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) + (2 * game.countPlayer()) / dis;
                    }
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const filter = skill => {
                const info = get.info(skill);
                return info && ["attack", "defend", "draw", "fury"].includes(info.runestoneSkill);
            };
            const list = ["翻面"];
            if (target.nysgsBuff && Object.keys(target.nysgsBuff).some(filter)) {
                list.push("技能符石失效");
            }
            if (list.length == 1) event.result = { control: list[0] };
            else event.result = await target
                .chooseControl(list)
                .set("prompt", `${get.translation(player)}对你发动了${get.translation(event.name)}，你选择一项`)
                .set("ai", () => {
                    const player = get.player();
                    if (player.isTurnedOver()) return 0;
                    return 1;
                })
                .forResult();
            if (event.result.control == "翻面") {
                await target.turnOver();
            } else {
                target.addTempSkill("nysgs_fs_mou_simayi_effect");
            }
        },
        subSkill: {
            effect: {
                init(player, skill) {
                    player.disableSkill(skill, get.info("nysgs_fs_chengyu").getSkills());
                },
                onremove(player, skill) {
                    player.enableSkill(skill);
                },
                trigger: {
                    get player() {
                        return get.info("nysgs_fs_chengyu").getSkills().map(skill => skill + "Begin");
                    },
                },
                forced: true,
                charlotte: true,
                content() {
                    trigger.cancel();
                },
                mark: true,
                intro: {
                    content: "本回合触发的技能符石失效",
                },
            },
        },
    },
    //谋曹操
    nysgs_fs_mou_caocao: {
        nobracket: true,
        trigger: {
            source: "damageBefore",
        },
        forced: true,
        filter(event, player) {
            if (!get.info("nysgs_fs_mou_caocao").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_mou_caocao");
        },
        async content(event, trigger, player) {
            game.setNature(trigger, "thunder");
            trigger.goto(4);
        },
    },
    //幻蔡文姬
    nysgs_fs_huan_caiwenji: {
        nobracket: true,
        trigger: {
            global: "loseHpEnd",
            player: ["showCharacterAfter", "phaseZhunbeiBegin"],
        },
        popup: false,
        filter(event, player) {
            if (!get.info("nysgs_fs_huan_caiwenji").filterx(event, player)) return false;
            if (event.name == "loseHp") {
                return player.hasSkill("nysgs_fs_huan_caiwenji_rewrite");
            }
            if (name == "showCharacter") {
                return player.isFirstShowCharacter();
            }
            return !player.hasSkill("nysgs_fs_huan_caiwenji_rewrite");
        },
        filterx(event, player) {
            return get.is.playerNames(player, "nysgs_huan_caiwenji");
        },
        async cost(event, trigger, player) {
            if (!player.hasSkill("nysgs_fs_huan_caiwenji_rewrite")) {
                event.result = await player
                    .chooseTarget(get.prompt(event.skill), get.skillInfoTranslation(event.skill, player))
                    .set("ai", target => {
                        const player = get.player();
                        return get.attitude(player, target);
                    })
                    .forResult();
            } else {
                event.result = await player
                    .chooseBool(get.prompt(event.skill, trigger.player), `一名角色流失体力时，你可以防止之，然后其获得${get.poptip("nysgs_huan_caiwenji_wangji")}直至其下个回合结束。`)
                    .set("ai", () => {
                        const player = get.player();
                        const trigger = get.event().getTrigger();
                        return get.attitude(player, trigger.player) > 0;
                    })
                    .forResult();
            }
        },
        async content(event, trigger, player) {
            if (!player.hasSkill("nysgs_fs_huan_caiwenji_rewrite")) {
                const target = event.targets[0];
                player.logSkill(event.name, target);
                await target.addTempSkills("nysgs_huan_caiwenji_wangyou", { player: "phaseBegin" });
            } else {
                player.logSkill(event.name, trigger.player);
                await trigger.player.addTempSkills("nysgs_huan_caiwenji_wangji", { player: "phaseEnd" });
            }
        },
        subSkill: {
            rewrite: {
                charlotte: true,
            },
        },
    },
    //夏侯惇
    nysgs_fs_xiahoudun: {
        nopop: true,
        trigger: {
            player: "changeHp",
        },
        popup: false,
        filter(event, player) {
            if (!get.info("nysgs_fs_xiahoudun").filterx(event, player)) return false;
            return true;
        },
        filterx(event, player) {
            return ["nysgs_xiahoudun", "nysgs_jie_xiahoudun"].some(name => get.is.playerNames(player, name));
        },
        async cost(event, trigger, player) {
            const targets = game.filterPlayer(target => {
                return target != player && target.hasAllHistory("sourceDamage", evt => evt.player == player);
            });
            if (!targets.length) return;
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), [1, Infinity])
                .set("filterTarget", (card, player, target) => {
                    return get.event().targets.includes(target);
                })
                .set("targets", targets)
                .set("ai", target => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    return -att;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.logSkill(event.name, event.targets);
            const func = async target => {
                const skill = player.hasSkill("nysgs_jie_xiahoudun_skill") ? "nysgs_jie_xiahoudun_skill" : "nysgs_xiahoudun_skill";
                const next = game.createEvent(skill);
                next.player = player;
                next._trigger = {
                    source: target,
                };
                next.setContent(lib.skill[skill].content);
            };
            await game.doAsyncInOrder(event.targets, func);
        },
    },
};
for (let i in sign) {
    sign[i].equipSkill = true;
    sign[i].nopop = true;
    sign[i].runestoneSkill = "sign";
    sign[i].categories = () => ["符石技"];
}

const legend = {
    nysgs_icon_point: {},
    nysgs_fs_tianchen: {},
    nysgs_fs_tiannu: {},
    nysgs_fs_tianyan: {},
};

const skills = {
    ...attack, 
    ...defend, 
    ...draw, 
    ...fury, 
    ...sign,
    ...legend
};

export default skills;
