import { lib, game, ui, get, ai, _status } from "noname";

const skills = {
    //蓄势待发
    nysgs_zf_xushidaifa: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        content() {
            const evt = trigger.getParent("phase", true, true);
            if (player.getStat("damage") < 4) {
                if (evt?.phaseList) {
                    evt.phaseList.splice(evt.num + 1, 0, `phaseUse|${event.name}`);
                }
            }
            if (evt?.phaseList) {
                evt.phaseList.splice(evt.num + 1, 0, `phaseDraw|${event.name}`);
            }
        },
    },
    //暗中突袭
    nysgs_zf_anzhongtuxi: {
        nobracket: true,
        nopop: true,
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        forced: true,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.player != player;
        },
        async content(event, trigger, player) {
            const target = trigger.player;
            await player.nysgsAddFury();
            const cards = target.getCards("h", card => {
                return lib.filter.cardDiscardable(card, player, "nysgs_zf_anzhongtuxi");
            });
            if (cards.length > 0) {
                await target.discard(cards.randomGets(2)).set("discarder", player);
            }
            await target.nysgsRemoveFury();
        },
    },
    //破阵摧坚
    nysgs_zf_pozhencuijian: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "useCardToTarget",
        },
        popup: false,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            if (!get.info("_nysgsFury_buff").getList.includes(event.card.name)) return false;
            return get.is.singleCard(event.card);
        },
        logTarget: "target",
        check(event, player) {
            return get.attitude(player, event.target) <= 0;
        },
        async content(event, trigger, player) {
            const target = trigger.target;
            const backups = get.copy(get.info("_nysgsFury_buff").getBuff.get(trigger.card.name));
            const next = game.createEvent(`${event.name}_${trigger.card.name}`, false);
            next.player = player;
            next._trigger = trigger.getParent();
            next.num = 2;
            next.setContent(backups.content);
            trigger.getParent().directHit.addArray(game.filterPlayer());
            player.when("useCardAfter")
                .filter(event => event == trigger.getParent())
                .step(async (event, trigger, player) => {
                    const cards = target.getCards("h", card => {
                        return lib.filter.nysgsCardDestroyable(card, target, "nysgs_zf_pozhencuijian");
                    });
                    if (cards.length) {
                        await target.nysgsDestroyCards(cards.randomGets(Math.ceil(cards.length / 2)));
                    }
                });
        },
    },
    //雷霆怒吼
    nysgs_zf_leitingnuhou: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        popup: false,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    if (target == player) return false;
                    return target.countCards("he", { type: "equip" });
                })
                .set("ai", target => {
                    const player = get.player();
                    return -get.attitude(player, target) / target.getHp();
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0]
            player.logSkill(event.name, target);
            const cards = [];
            for (var pos of ["e", "h"]) {
                const cards2 = target.getCards(pos, card => {
                    return lib.filter.cardDiscardable(card, player, "nysgs_zf_leitingnuhou");
                });
                if (cards2.length) {
                    cards.addArray(cards2.randomGets(2 - cards.length));
                    if (cards.length >= 2) break;
                }
            }
            if (cards.length) {
                await target.discard(cards).set("discarder", player);
            }
            player.addTempSkill("nysgs_zf_leitingnuhou_clear");
            target.addAdditionalSkill(`nysgs_zf_leitingnuhou_${player.playerid}`, "nysgs_skill_podan");
        },
        subSkill: {
            clear: {
                trigger: {
                    player: "changeCharacterEnd",
                    global: "phaseEnd",
                },
                silent: true,
                charlotte: true,
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
                onremove(player, skill) {
                    game.countPlayer2(target => {
                        target.removeAdditionalSkill(`nysgs_zf_leitingnuhou_${player.playerid}`);
                    }, true);
                },
            },
        },
    },
    //侵略如火
    nysgs_zf_qinlueruhuo: {
        derivation: ["nysgs_jie_XunYu_Skill", "nysgs_jie_ZhangXingCai_Skill", "nysgs_jie_SunQuan_Skill", "nysgs_jie_DiaoChan_Skill"],
        nobracket: true,
        nopop: true,
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        forced: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async content(event, trigger, player) {
            await player.draw();
            if (trigger.player != player) return;
            const skills = lib.skill[event.name].derivation;
            await player.addTempSkills(skills.randomGets(1));
        },
    },
    //不动如山
    nysgs_zf_budongrushan: {
        nobracket: true,
        nopop: true,
        derivation: ["nysgs_jie_GuoJia_Skill", "nysgs_jie_LiuShan_Skill", "nysgs_jie_WuGuoTai_Skill", "nysgs_jie_ZhangJiao_Skill"],
        trigger: {
            global: ["phaseBefore", "phaseJieshuBegin"],
            player: "enterGame",
        },
        forced: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player, name) {
            return (name != "phaseBefore" || game.phaseNumber == 0);
        },
        async content(event, trigger, player) {
            await player.draw();
            if (trigger.player != player) return;
            const skills = lib.skill[event.name].derivation;
            await player.addTempSkills(skills.randomGets(1));
        },
    },
    //飞扬跋扈
    nysgs_zf_feiyangbahu: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: ["phaseJudgeBegin", "phaseUseBegin"],
        },
        forced: true,
        locked: false,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.name != "phaseJudge" || player.countCards("j");
        },
        async content(event, trigger, player) {
            if (trigger.name == "phaseJudge") {
                const cards = player.getCards("j");
                if (cards.length) player.loseToDiscardpile(cards.randomGets(1));
            } else {
                await player.draw(2);
                player.addTempSkill("nysgs_zf_feiyangbahu_effect", "phaseUseAfter");
                player.addMark("nysgs_zf_feiyangbahu_effect", 1, false);
            }
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") return num + player.countMark("nysgs_zf_feiyangbahu_effect");
                    },
                },
            },
        },
    },
    //其疾如风
    nysgs_zf_qijirufeng: {
        derivation: ["nysgs_jie_XunYou_Skill", "nysgs_jie_PangTong_Skill", "nysgs_jie_GanNing_Skill", "nysgs_jie_CaiFuRen_Skill"],
        nobracket: true,
        nopop: true,
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        forced: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async content(event, trigger, player) {
            await player.draw();
            if (trigger.player != player) return;
            const skills = lib.skill[event.name].derivation;
            await player.addTempSkills(skills.randomGets(1));
        },
    },
    //其徐如林
    nysgs_zf_qixurulin: {
        nobracket: true,
        nopop: true,
        derivation: ["nysgs_jie_YueJin_Skill", "nysgs_jie_XuShu_Skill", "nysgs_jie_LuXun_Skill", "nysgs_jie_GongSunZan_Skill"],
        trigger: {
            global: ["phaseBefore", "phaseJieshuBegin"],
            player: "enterGame",
        },
        forced: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player, name) {
            return (name != "phaseBefore" || game.phaseNumber == 0);
        },
        async content(event, trigger, player) {
            await player.draw();
            if (trigger.player != player) return;
            const skills = lib.skill[event.name].derivation;
            await player.addTempSkills(skills.randomGets(1));
        },
    },
    //割须弃袍
    nysgs_zf_gexuqipao: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "dying",
        },
        forced: true,
        locked: false,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return _status.currentPhase != player;
        },
        async content(event, trigger, player) {
            await player.draw(3);
            if (player.hasSkill("nysgs_zf_gexuqipao_used")) return;
            const result = await player
                .chooseToDiscard("你可以弃置1张红桃手牌，令本回合其他角色使用黑色伤害牌对你无效")
                .set("ai", card => {
                    const player = get.player();
                    if (player.hasSkill("nysgs_zf_gexuqipao_effect")) return 0;
                    return 7 - get.value(card);
                })
                .forResult();
            if (result.bool) {
                player.addTempSkill("nysgs_zf_gexuqipao_used", "roundStart");
            }
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
            effect: {
                trigger: {
                    target: "useCardToTarget",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    return get.color(event.card) == "black" && get.tag(event.card, "damage") >= 0.5;
                },
                async content(event, trigger, player) {
                    trigger.getParent()?.targets.remove(player);
                },
                ai: {
                    effect: {
                        target(card, player, target, current) {
                            if (get.color(card) == "black" && get.tag(card, "damage") >= 0.5) {
                                return "zeroplayertarget";
                            }
                        },
                    },
                },

            },
        },
    },
    //单打独斗
    nysgs_zf_dandadudou: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "phaseBegin",
        },
        forced: true,
        locked: false,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return game.countPlayer() <= 2;
        },
        async content(event, trigger, player) {
            const targets = game.filterPlayer().sortBySeat();
            targets.forEach(current => {
                current.addTempSkill("nysgs_zf_dandadudou_effect");
                current.addMark("nysgs_zf_dandadudou_effect", 1, false);
            });
        },
        subSkill: {
            damage: {
                onremove: true,
                charlotte: true,
                trigger: {
                    source: "damageBegin1",
                    player: "damageBegin3",
                },
                forced: true,
                async content(event, trigger, player) {
                    trigger.num += player.countMark(event.name);
                },
                intro: {
                    content: "本回合造成/受到的伤害+#",
                },
            },
        },
    },
    //摧城拔寨
    nysgs_zf_cuichengbazhai: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "useCardToPlayer",
        },
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.card.name == "sha";
        },
        check(event, player) {
            return get.attitude(player, event.target) <= 0;
        },
        async content(event, trigger, player) {
            const target = trigger.target;
            trigger.getParent().baseDamage++;
            trigger.getParent().directHit.addArray(game.filterPlayer());
            const num = trigger.getParent().baseDamage * 2;
            const cards = target.getCards("h", card => {
                return lib.filter.nysgsCardDestroyable(card, target, "nysgs_zf_cuichengbazhai");
            });
            if (cards.length) {
                player.addTempSkill("nysgs_zf_cuichengbazhai_used");
                player.markAuto("nysgs_zf_cuichengbazhai_used", [trigger.target]);
                await target.nysgsDestroyCards(cards.randomGets(num));
            }
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    //龙争虎斗
    nysgs_zf_longzhenghudou: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "compare",
            target: "compare",
        },
        forced: true,
        locked: false,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            if (event.player == player) {
                return !event.iwhile && get.type(event.card1) == "equip";
            }
            return get.type(event.card2) == "equip";
        },
        async content(event, trigger, player) {
            game.log(player, "拼点牌点数视为", "#yK");
            if (player == trigger.player) {
                trigger.num1 = 13;
            } else {
                trigger.num2 = 13;
            }
            await game.delayx();
            const target = trigger[trigger.player == player ? "target" : "player"];
            target.addTempSkill("nysgs_zf_budongrushan_effect");
        },
        subSkill: {
            effect: {
                charlotte: true,
                mod: {
                    cardEnabled2(card, player, target) {
                        if (get.color(card) == "black") return false;
                    },
                },
                ai: {
                    noFuryAdd: true,
                },
                mark: true,
                intro: {
                    content: "本回合无法使用或打出黑色牌且受到伤害后无法获得怒气",
                },
            },
        },
    },
    //严刑峻法
    nysgs_zf_yanxingjunfa: {
        nobracket: true,
        nopop: true,
        trigger: {
            source: "dying",
        },
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.player != player;
        },
        check(event, player) {
            const target = event.player;
            const att = get.attitude(player, target);
            if (target.hasSkillTag("noturn")) return false;
            if (att > 0) {
                if (target.isTurnedOver()) return true;
            }
            if (target.isTurnedOver()) return false;
            return true;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const target = trigger.player;
            const result = await target
                .chooseControl("翻面", "失去怒气且下次受伤+1")
                .set("prompt", `${get.translation(player)}对你发动了【${get.translation(event.name)}】，你选择一项`)
                .set("ai", () => {
                    const player = get.player();
                    if (player.isTurnedOver()) return 0;
                    return 1;
                })
                .forResult();
            if (result.index == 0) {
                target.turnOver();
            } else {
                await target.nysgsRemoveFury();
                target.addSkill("nysgs_zf_yanxingjunfa_effect");
                target.addMark("nysgs_zf_yanxingjunfa_effect", 1, false);
            }
        },
    },
    //厉兵秣马
    nysgs_zf_libingmoma: {
        nobracket: true,
        nopop: true,
        trigger: {
            global: "roundStart",
        },
        forced: true,
        locked: false,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async content(event, trigger, player) {
            const num = game.countPlayer() - 1, cards = [];
            for (let i = 0; i < num; i++) {
                const card = get.cardPile(card => {
                    return get.type(card) == "equip" && !cards.includes(card);
                }, null, "random");
                if (card) cards.push(card);
            }
            if (cards.length) await player.gain(cards, "gain2");
            player.addTempSkill(event.name + "_effect", "roundStart");
            player.addMark(event.name + "_effect", num, false);
        },
        subSkill: {
            effect: {
                charlotte: true,
                mod: {
                    globalTo(from, to, distance) {
                        return distance + to.countMark("nysgs_zf_libingmoma_effect");
                    },
                },
                mark: true,
                intro: {
                    content: "本轮其他角色计算与你的距离+#",
                },
            },
        },
    },
    //掠地攻城
    nysgs_zf_lvedigongcheng: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill))
                .set("filterTarget", lib.filter.notMe)
                .set("ai", target => {
                    const player = get.player();
                    return get.damageEffect(target, player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const num = get.rand(1, 3);
            await target.damage(num);
            const cards = target.getGainableCards(player, "he");
            if (cards.length) {
                const num = Math.min(cards.length, player.getAttackRange() + 1);
                await target.give(cards.randomGets(num), player);
                const delt = player.getAttackRange() + 1 - num;
                if (num > 0) {
                    await target.damage(delt);
                }
            }
        },
    },
    //百鸟朝凤
    nysgs_zf_bainiaochaofeng: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "phaseUseBegin",
        },
        popup: false,
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async cost(event, trigger, player) {
            const list = get.inpileVCardList(info => {
                if (info[0] != "trick") {
                    return false;
                }
                return player.hasUseTarget({ name: info[2], isCard: true }, true, false);
            });
            if (!list.length) return;
            const { bool, links } = await player
                .chooseButton([`${get.translation(event.skill)}`, [list, "vcard"]])
                .set("ai", button => {
                    const player = get.player();
                    return player.getUseValue(button.link[2]);
                })
                .forResult();
            if (bool) {
                const card = {
                    name: links[0][2],
                    storage: {
                        nysgsFuryBuff: true,
                    },
                };
                game.broadcastAll(function (skill, card) {
                    lib.skill[`${skill}_backup`].viewAs = card;
                }, event.skill, card);
                const result = await player.chooseToUse()
                    .set("openskilldialog", get.prompt2(event.skill))
                    .set("norestore", true)
                    .set("_backupevent", `${event.skill}_backup`)
                    .set("custom", {
                        add: {},
                        replace: { window: function () { } },
                    })
                    .backup(`${event.skill}_backup`)
                    .set("nouse", true)
                    .forResult()
                event.result = { bool: result.bool, cost_data: { result } };
            }
        },
        async content(event, trigger, player) {
            const { cost_data: { result } } = event;
            event.set("onresult", result => {
                player.when("useCardAfter")
                    .filter(event => event.skill == "nysgs_zf_bainiaochaofeng_backup")
                    .step(async (event, trigger, player) => {
                        const targets = game.filterPlayer(target => target != player);
                        for (const target of targets) {
                            const result = await target
                                .chooseToGive(player, "h", `交给${get.translation(player)}一张牌名为${get.translation(trigger.card.name)}的手牌，否则你流失2点体力`)
                                .set("ai", card => {
                                    const { player, take } = get.event();
                                    if (take || (get.name(card) == "tao" || player.getHp() > 3)) {
                                        return 0;
                                    }
                                    return 8 - get.value(card);
                                })
                                .set("take", get.effect(target, { name: "losehp" }, target) >= 0)
                                .forResult();
                            if (!result.bool) {
                                await target.loseHp(2);
                            }
                        }
                    });
            });
            await player.useResult(result, event);
        },
        subSkill: {
            backup: {
                filterCard: () => false,
                selectCard: -1,
            },
        },
    },
    //移花接木
    nysgs_zf_yihuajiemu: {
        nobracket: true,
        nopop: true,
        trigger: {
            global: "phaseUseBegin",
        },
        forced: true,
        locked: false,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.player != player;
        },
        async content(event, trigger, player) {
            await player.draw();
            const result = await player
                .chooseCard(`###${get.prompt(event.name)}###你可以展示至多5张手牌并随机弃置${get.translation(trigger.player)}等量的手牌，其获得你展示的牌，你摸2张牌`, "h", [1, 5])
                .set("ai", card => {
                    const player = get.player();
                    const trigger = _status.event.getTrigger();
                    if (get.attitude(player, trigger.player) > 0) return 0;
                    if (ui.selected.cards.length >= trigger.player.countCards("h")) return 0;
                    return 7 - get.value(card);
                })
                .forResult();
            if (result.bool) {
                await player.showCards(result.cards);
                const cards = trigger.player.getCards("h", card => {
                    return lib.filter.cardDiscardable(card, player, "nysgs_zf_yihuajiemu");
                });
                if (cards.length) {
                    await trigger.player.discard(cards.randomGets(result.cards.length)).set("discarder", player);
                }
                await trigger.player.gain(result.cards, player, "give");
                await player.draw(2);
            }
        },
    },
    //夜探敌营
    nysgs_zf_yetandiying: {
        nobracket: true,
        nopop: true,
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.player != player && event.player.countCards("h");
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const result = await player
                .gainPlayerCard(trigger.player, "h", "visible", true)
                .set("prompt", get.prompt(event.name, trigger.player))
                .forResult();
            await player.gain(event.cards, trigger.player, "give");
            trigger.player.addTempSkill(event.name + "_effect");
        },
        subSkill: {
            effect: {
                trigger: {
                    source: "damageBegin1",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    return event.num > 1;
                },
                async content(event, trigger, player) {
                    trigger.num--;
                },
            },
        },
    },
    //避虚击实
    nysgs_zf_bixujishi: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: ["gainMaxHpEnd", "loseMaxHpEnd"],
        },
        forced: true,
        locked: false,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async content(event, trigger, player) {
            await player.draw(3);
            player.addTempSkill(`${event.name}_${trigger.name.slice(0, 4)}`);
            player.addMark(`${event.name}_${trigger.name.slice(0, 4)}`, 1, false);
        },
        subSkill: {
            gain: {
                trigger: {
                    source: "damageBegin1",
                },
                forced: true,
                charlotte: true,
                onremove: true,
                async content(event, trigger, player) {
                    trigger.num += player.countMark(event.name);
                },
            },
            lose: {
                trigger: {
                    player: "loseHpBegin",
                },
                forced: true,
                charlotte: true,
                onremove: true,
                filter(event, player) {
                    return event.source && event.source != player;
                },
                async content(event, trigger, player) {
                    trigger.num -= player.countMark(event.name);
                },
            },
        },
    },
    //固本归元
    nysgs_zf_gubenguiyuan: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "damageEnd",
        },
        forced: true,
        locked: false,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async content(event, trigger, player) {
            await player.draw(4);
            if (player.hasSkill(event.name + "_used")) {
                return;
            }
            player.addTempSkill(event.name + "_used");
            player.addTempSkill(event.name + "_effect");
        },
        subSkill: {
            used: {
                charlotte: true,
            },
            effect: {
                trigger: {
                    source: ["damageBegin1", "recoverBegin"],
                },
                forced: true,
                popup: false,
                charlotte: true,
                async content(event, trigger, player) {
                    trigger.num++;
                },
            },
        },
    },
    //蒸蒸日上
    nysgs_zf_zhengzhengrishang: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        forced: true,
        locked: false,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async content(event, trigger, player) {
            await player.draw(game.roundNumber + 1);
            player.addTempSkill(event.name + "_effect");
        },
        subSkill: {
            effect: {
                charlotte: true,
                mod: {
                    cardUsable(card, player) {
                        if (get.color(card) == "red") return Infinity;
                    },
                    targetInRange(card, player, target) {
                        if (get.color(card) == "black") return true;
                    },
                },
            },
        },
    },
    //铜墙铁壁
    nysgs_zf_tongqiangtiebi: {
        nobracket: true,
        nopop: true,
        trigger: {
            global: ["phaseBegin", "loseHpBegin"],
        },
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.name == "phase" || player.hujia > player.maxHp;
        },
        async cost(event, trigger, player) {
            if (trigger.name == "phase") event.result = { bool: true };
            else {
                event.result = await player
                    .chooseBool(get.prompt(event.skill), "当你流失体力时，若你的护甲值大于体力上限，你可以失去1点护甲，然后防止之。")
                    .forResult();
            }
        },
        async content(event, trigger, player) {
            if (trigger.name == "phase") {
                await player.changeHujia(1);
            } else {
                await player.changeHujia(-1);
                trigger.cancel();
            }
        },
    },
    //赦过宥罪
    nysgs_zf_sheguoyouzui: {
        nobracket: true,
        nopop: true,
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.player != player && event.player.countCards("h");
        },
        check(event, player) {
            const bool = event.player.nysgsHasStatusEffect();
            if (get.attitude(player, event.player) <= 0) return !bool;
            return bool;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            await target.chooseToGive(player, 2, true);
            if (target.nysgsHasStatusEffect()) {
                target.nysgsrefreshCharacter();
            }
        },
    },
    //移星换斗
    nysgs_zf_yixinghuandou: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "phaseBegin",
        },
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), 2)
                .set("filterTarget", (card, player, target) => {
                    return target.countCards("h")
                })
                .set("ai", target => {
                    const player = get.player();
                    const att = get.sgnAttitude(player, target);
                    if (att > 0) return 0;
                    return -att;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const targets = event.targets;
            player.logSkill(event.name, targets);
            const hs1 = targets[0].getCards("h"),
                hs2 = targets[1].getCards("h");
            const num = Math.min(hs1.length, hs2.length);
            const cards1 = hs1.randomGets(num),
                cards2 = hs2.randomGets(num);
            await targets[0].swapHandcards(targets[1], cards1, cards2);
            const filter = skill => {
                const info = get.info(skill);
                return info && ["attack", "defend", "draw", "fury"].includes(info.runestoneSkill);
            };
            const skills = [];
            for (const target of targets) {
                const list = [];
                if (target.nysgsBuff) {
                    list.addArray(Object.keys(target.nysgsBuff).filter(filter));
                }
                skills.push(list);
            }
            var list = skills.map((item, index) => item.map(info => targets[index].countMark(info)));
            for (var i = 0; i < targets.length; i++) {
                var j = targets.length - 1 - i;
                targets[i].removeSkill(skills[i]);
                skills[i].forEach(skill => {
                    targets[i].nysgsBuff[skill].remove();
                    targets[i].clearMark(skill, false);
                });
                targets[i].addSkill(skills[j]);
                skills[j].forEach((skill, index) => {
                    targets[i].setStorage(skill, list[j][index]);
                });
                if (lib.config.extension_怒焰三国_display == "icon") {
                    nysgs.createSkillBuff(skills[j].reverse(), targets[i], true);
                }
            }
        },
    },
    //酒酣战勇
    nysgs_zf_jiuhanzhanyong: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "phaseUseBegin",
        },
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        async content(event, trigger, player) {
            const card = new lib.element.VCard({ name: "jiu" });
            if (player.hasUseTarget(card, false, false)) {
                await player.chooseUseTarget(card, false, true);
            }
            const list = lib.inpile.filter(name => get.tag({ name: name }, "damage") >= 0.5);
            const cards = [];
            for (let i = 0; i < list.length; i++) {
                const card = get.cardPile(card => {
                    if (!get.tag(card, "damage")) return false;
                    return !cards.reduce((list, card) => list.add(card.name), []).includes(card.name);
                });
                if (card) cards.push(card);
            }
            if (cards.length) {
                await player.gain(cards, "gain2");
            }
        },
    },
    //摄魂夺魄
    nysgs_zf_shehunduopo: {
        nobracket: true,
        nopop: true,
        trigger: {
            player: "gainAfter",
            global: "loseAsyncAfter",
        },
        charlotte: true,
        silent: true,
        forced: false,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        getIndex(event, player) {
            if (!event.getg || !event.getl) {
                return [];
            }
            return game.filterPlayer(current => current != player && event.getl(current).cards2?.length);
        },
        filter(event, player, name, target) {
            const cards = event.getg(player);
            if (!cards.length) {
                return false;
            }
            return event.getl(target).cards2?.containsSome(...cards);
        },
        logTarget(event, player, name, target) {
            return target;
        },
        check(event, player, name, target) {
            return get.attitude(player, target) <= 0;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            if (target.nysgsCountFury()) {
                await target.nysgsRemoveFury(1, player);
                await player.nysgsAddFury();
            }
            player.addSkill(`${event.name}_clear`);
            target.addAdditionalSkill(`${event.name}_${player.playerid}`, "fengyin");
        },
        subSkill: {
            clear: {
                trigger: {
                    player: "changeCharacterEnd",
                    global: "phaseEnd",
                },
                silent: true,
                charlotte: true,
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
                onremove(player, skill) {
                    game.countPlayer2(target => {
                        target.removeAdditionalSkill(`nysgs_zf_shehunduopo_${player.playerid}`);
                    }, true);
                },
            },
        },
    },
    //珠联璧合
    nysgs_zf_zhulianbihe: {
        nobracket: true,
        nopop: true,
        mod: {
            aiOrder(player, card, num) {
                if (typeof card == "object" && player.isPhaseUsing()) {
                    var evt = lib.skill.nysgs_zf_zhulianbihe.getLastUsed(player);
                    if (evt && evt.card && (evt.card.number && evt.card.number == get.number(card))) {
                        return num + 10;
                    }
                }
            },
        },
        trigger: {
            player: "useCard",
        },
        forced: true,
        locked: false,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            var evt = lib.skill.nysgs_zf_zhulianbihe.getLastUsed(player, event);
            if (!evt || !evt.card) {
                return false;
            }
            return get.is.convertedCard(event.card) && typeof get.number(evt.card, false) == "number" && get.number(evt.card, false) == get.number(event.card);
        },
        getLastUsed(player, event) {
            var history = player.getAllHistory("useCard");
            var index;
            if (event) {
                index = history.indexOf(event) - 1;
            } else {
                index = history.length - 1;
            }
            if (index >= 0) {
                return history[index];
            }
            return false;
        },
        async content(event, trigger, player) {
            const card = get.cardPile(card => {
                return get.number(card) == get.number(trigger.card) + 1;
            }, null, "random");
            if (card) {
                await player.gain(card, "gain2");
                if (get.tag(card, "damage") >= 0.5) {
                    trigger.directHit.addArray(game.filterPlayer());
                }
            }
        },
        group: "nysgs_zf_zhulianbihe_mark",
        subSkill: {
            mark: {
                charlotte: true,
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                popup: false,
                firstDo: true,
                content() {
                    if (get.suit(trigger.card, player) == "none" || typeof get.number(trigger.card, player) != "number") {
                        player.unmarkSkill("nysgs_zf_zhulianbihe_mark");
                    } else {
                        player.storage.nysgs_zf_zhulianbihe_mark = trigger.card;
                        player.markSkill("nysgs_zf_zhulianbihe_mark");
                    }
                },
                marktext: "珠联",
                intro: {
                    markcount(card, player) {
                        return get.number(card, player);
                    },
                    content(card, player) {
                        var num = get.number(card, player);
                        var str = "上一张牌的点数：" + get.strNumber(num);
                        return str;
                    },
                },
            },
        },
    },
    //势如破竹
    nysgs_zf_shirupozhu: {
        nobracket: true,
        nopop: true,
        trigger: {
            source: ["damageBegin1", "damageSource"],
        },
        forced: true,
        locked: false,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player, name) {
            return event.card && (get.type(event.card) == "trick" && get.info("xunshi").isXunshi(event.card));
        },
        async content(event, trigger, player) {
            if (event.triggername == "damageBegin1") {
                game.setNature(trigger, "fire");
            } else {
                const cards = trigger.player.getCards("h", card => {
                    return lib.filter.nysgsCardDestroyable(card, trigger.player, "nysgs_zf_shirupozhu");
                });
                if (cards.length) {
                    await trigger.player.nysgsDestroyCards(cards.randomGets(trigger.num));
                }
                await player.nysgsAddFury();
            }
        },
    },
    //花言巧语
    nysgs_zf_huayanqiaoyu: {
        nobracket: true,
        nopop: true,
        trigger: {
            global: ["gainAfter", "loseAsyncAfter"],
        },
        forced: false,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player, name, target) {
            if (event.name == "gain" && !event.giver) {
                return false;
            }
            if (player.hasStorage("nysgs_zf_huayanqiaoyu_used", target)) return false;
            return event.getl(player).cards2?.containsSome(...event.getg(target));
        },
        getIndex(event, player) {
            if (!event.getg || !event.getl || !event.getl(player)?.cards2?.length) {
                return [];
            }
            return game
                .filterPlayer(current => {
                    if (current == player) {
                        return false;
                    }
                    return event.getg(current)?.length;
                })
                .sortBySeat();
        },
        logTarget: (event, player, name, target) => target,
        check(event, player, name, target) {
            const num = event.getg(target).filter(card => event.getl(player).cards2?.includes(card)).length;
            const att = get.attitude(player, target);
            if (att < 0 && num > 3) return true;
            if (att > 0 && num <= 3) {
                return get.recoverEffect(player, player, player) + get.recoverEffect(target, player, player) > 2;
            }
            return false;
        },
        async content(event, trigger, player) {
            const [target] = event.targets;
            player.addTempSkill("nysgs_zf_huayanqiaoyu_used");
            player.markAuto("nysgs_zf_huayanqiaoyu_used", [target]);
            await player.recover();
            await target.recover();
            const num = trigger.getg(target).filter(card => trigger.getl(player).cards2?.includes(card)).length;
            if (num > 3) {
                player.addTempSkill("nysgs_zf_huayanqiaoyu_clear");
                target.addAdditionalSkill(`nysgs_zf_huayanqiaoyu_${player.playerid}`, "nysgs_xuanyun");
            }
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
            clear: {
                trigger: {
                    player: "changeCharacterEnd",
                    global: "phaseEnd",
                },
                silent: true,
                charlotte: true,
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
                onremove(player, skill) {
                    game.countPlayer2(target => {
                        target.removeAdditionalSkill(`nysgs_zf_huayanqiaoyu_${player.playerid}`);
                    }, true);
                },
            },
        },
    },
    //风雪漫天
    nysgs_zf_fengxuemantian: {
        nobracket: true,
        nopop: true,
        trigger: {
            source: "damageBegin1",
        },
        forced: true,
        charlotte: true,
        silent: true,
        strategySkill: true,
        categories: () => ["战法技"],
        equipSkill: true,
        filter(event, player) {
            return event.hasNature("nysgswater");
        },
        async content(event, trigger, player) {
            await trigger.player.nysgsRemoveFury();
            if (trigger.player.isHealthy()) return;
            await player.draw();
            player.addSkill("nysgs_zf_fengxuemantian_effect");
            player.addMark("nysgs_zf_fengxuemantian_effect", 1, false);
        },
        subSkill: {
            effect: {
                mod: {
                    cardUsable(card, player, num) {
                        if (get.type(card) == "basic") return Infinity;
                    },
                    targetInRange(card, player, num) {
                        if (get.type(card) == "basic") return true;
                    },
                },
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                charlotte: true,
                onremove: true,
                popup: false,
                firstDo: true,
                filter(event, player) {
                    return get.type(event.card) == "basic" && event.card.name != "shan";
                },
                content() {
                    trigger.baseDamage += player.countMark(event.name);
                    player.removeSkill(event.name);
                    if (trigger.addCount !== false) {
                        trigger.addCount = false;
                        const stat = player.getStat().card,
                            name = trigger.card.name;
                        if (typeof stat[name] == "number") {
                            stat[name]--;
                        }
                    }
                },
                mark: true,
                intro: {
                    content: "使用下一张基本牌效果+#且无距离和次数限制",
                },
            },
        },
    },
};

export default skills;
