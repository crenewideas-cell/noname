import { lib, game, ui, get, ai, _status } from "noname";

const skills = {
    //
    ca_shouzhen: {
        init(player, skill) {
            player.setStorage(skill, player);
        },
        trigger: {
            global: "useCardToTarget",
        },
        filter(event, player) {
            return event.target == player.storage.ca_shouzhen && event.player != event.target;
        },
        logTarget: "player",
        prompt2: "令其打出闪，否则对其造成一点伤害",
        check(event, player) {
            return get.damageEffect(event.player, player, player) > 0;
        },
        async content(event, trigger, player) {
            const target = trigger.player;
            event.baseDamage = 1;
            event.shanRequired = 1;
            const next = target.chooseToRespond();
            next.set("filterCard", (card, player2) => get.name(card) === "shan" && lib.filter.cardRespondable(card, player2));
            next.set("ai", (card) => get.event().toRespond ? get.order(card) : -1);
            next.set(
              "toRespond",
              (() => {
                if (target.hasSkillTag("noShan", null, "respond")) {
                  return false;
                }
                if (target.hasSkillTag("useShan", null, "respond")) {
                  return true;
                }
                if (event.baseDamage >= target.hp + (player.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
                  return true;
                }
                const damage = get.damageEffect(target, player, target);
                if (damage >= 0) {
                  return false;
                }
                if (event.shanRequired > 1 && !target.hasSkillTag("freeShan", null, {
                  player,
                  card: event.card,
                  type: "respond"
                }) && event.shanRequired > target.mayHaveShan(target, "respond", null, "count")) {
                  return false;
                }
                return true;
              })()
            );
            next.autochoose = lib.filter.autoRespondShan;
            const result = await next.forResult();
            if (!result?.bool) {
                await target.damage();
            }
        },
        group: ["ca_shouzhen_change", "ca_shouzhen_blocker"],
        subSkill: {
            change: {
                trigger: {
                    player: "phaseJieshuBegin",
                },
                popup: false,
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseTarget(get.prompt(event.skill), "将[ ]内修改为一名其他角色", lib.filter.notMe)
                        .set("ai", target => {
                            const player = get.player();
                            return get.attitude(player, target);
                        })
                        .forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    player.logSkill(event.name, target);
                    player.setStorage("ca_shouzhen", target);
                },
            },
            blocker: {
                trigger: {
                    player: "damageEnd",
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    player.tempBanSkill("ca_shouzhen");
                },
            },
        },
    },
    ca_shouzhen: {
        trigger: {
            global: ["useCard", "respond"],
        },
        filter(event, player) {
            if (event.player == player) {
                return false;
            }
            return typeof get.number(event.card) == "number" && get.number(event.card) == player.storage.ca_shouzhen;
        },
        async cost(event, trigger, player) {
            var effect = 0;
            if (trigger.name == "useCard") {
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
            } else {
                var str = "令" + get.translation(trigger.player);
                str += "打出的" + get.translation(trigger.card) + "失效？";
            }
            event.result = await player
                .chooseBool(get.prompt(event.skill, trigger.player), str, function () {
                    var player = _status.event.player;
                    var trigger = _status.event.getTrigger();
                    if (trigger.name == "respond") {
                        return get.damageEffect(trigger.player, player, player) * 2 > 0;
                    }
                    if (_status.event.effect < 0) {
                        if (trigger.card.name == "sha") {
                            var target = trigger.targets[0];
                            if (target == player) {
                                return !player.countCards("h", "shan");
                            } else {
                                return target.hp == 1 || (target.countCards("h") <= 2 && target.hp <= 2);
                            }
                        } else {
                            return true;
                        }
                    }
                    return false;
                })
                .set("effect", effect)
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            if (trigger.name == "useCard") {
                trigger.targets.length = 0;
                trigger.all_excluded = true;
            } else {
                trigger.cancel();
            }
            game.log(player, "令", trigger.card, "无效");
            await trigger.player.damage(2);
            await player.recover();
            await player.draw(2);
            player
                .when({ global: ["useCardAfter", "respondAfter"] })
                .filter(evt => evt == trigger)
                .then(async (event2, trigger2, player2) => {
                    if (player.getStorage("ca_shouzhen_record").length >= 13) {
                        //player.unmarkSkill("ca_shouzhen");
                        return;
                    }
                    event2.skill = "ca_shouzhen";
                    await lib.skill.ca_shouzhen_init.cost(event2, trigger2, player2);
                    const next = game.createEvent("ca_shouzhen_init", false);
                    next.player = player2;
                    next.cost_data = event2.result.cost_data;
                    next.setContent(lib.skill.ca_shouzhen_init.content);
                    await next;
                });
        },
        group: "ca_shouzhen_init",
        subSkill: {
            init: {
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                filter(event, player) {
                    return (event.name != "phase" || game.phaseNumber == 0);
                },
                async cost(event, trigger, player) {
                    const list = Array.from({ length: 13 }, (_, index) => [index + 1, index + 1]);
                    event.result = await player
                        .chooseButton([get.translation(event.skill), [list, "tdnodes"]], true)
                        .set("filterButton", button => {
                            return !get.player().getStorage("ca_shouzhen_record").includes(button.link);
                        })
                        .set("ai", button => {
                            return 1 + Math.random();
                        })
                        .forResult();
                    if (event?.result?.links?.length) {
                        event.result.cost_data = event.result.links[0];
                    }
                },
                async content(event, trigger, player) {
                    player.setStorage("ca_shouzhen", event.cost_data);
                    //player.markSkill("ca_shouzhen");
                    player.addSkill("ca_shouzhen_record");
                    player.markAuto("ca_shouzhen_record", event.cost_data);
                },
            },
            record: {
                charlotte: true,
            },
        },
    },
    //
    ca_zushi: {
        enable: ["chooseToUse", "chooseToRespond"],
        usable: 20,
        filter(event, player) {
            if (!player.countCards("hes")) {
                return false;
            }
            const cards = player.getExpansions("ca_zushi");
            if (!cards.length) {
                return false;
            }
            return cards.some(card => event.filterCard(get.autoViewAs({ name: card.name, nature: card.nature }, "unsure"), player, event));
        },
        hiddenCard(player, name) {
            if (!player.countCards("hes")) {
                return false;
            }
            const list = player.getExpansions("ca_zushi").reduce((list, card) => list.add(card.name), []);
            return list.includes(name);
        },
        chooseButton: {
            dialog(event, player) {
                const cards = player.getExpansions("ca_zushi");
                return ui.create.dialog(get.translation("ca_zushi"), cards, "hidden");
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
                    filterCard(card) {
                        return get.suit(card) == get.suit(get.card());
                    },
                    position: "hes",
                    check(card) {
                        return 8 - get.value(card);
                    },
                    viewAs: links[0],
                    card: links[0],
                    async precontent(event, trigger, player) {
                        const card2 = lib.skill.ca_zushi_backup.card;
                        const card = {
                            name: card2.name,
                            nature: card2.nature
                        };
                        event.result.card = get.autoViewAs(card, event.result.cards);
                    },
                };
            },
            prompt(links, player) {
                return "将一张与“祖”花色相同的牌当" + get.translation(links[0]) + "使用或打出？";
            },
        },
        ai: {
            order: 12,
            respondShan: true,
            respondSha: true,
            skillTagFilter(player, tag) {
              const name = "s" + tag.slice("respondS".length);
              return lib.skill.ca_zushi.hiddenCard(player, name);
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
        marktext: "祖",
        intro: {
            content: "expansion",
            markcount: "expansion",
        },
        onremove(player, skill) {
          const cards2 = player.getExpansions(skill);
          if (cards2.length) {
            player.loseToDiscardpile(cards2);
          }
        },
        group: "ca_zushi_put",
        subSkill: {
            put: {
                trigger: {
                    player: ["useCardAfter", "respondAfter"],
                },
                filter(event, player) {
                    if (!get.is.ordinaryCard(event.card)) {
                        return false;
                    }
                    if (get.is.convertedCard(event.card)) {
                        return false;
                    }
                    return event.cards.filterInD("oe").length;
                },
                prompt2(event, player) {
                    return `将${get.translation(event.cards.filterInD("oe"))}置于武将牌上`;
                },
                async content(event, trigger, player) {
                    const cards2 = player.getExpansions("ca_zushi");
                    if (cards2.length >= 3) {
                        const result = await player
                            .chooseCardButton("选择一张“祖”移除", cards2, true)
                            .set("ai", button => {
                                return -get.player().getUseValue(button.link);
                            })
                            .forResult();
                        if (result?.links?.length) {
                            await player.loseToDiscardpile(result.links);
                        }
                    }
                    const cards = trigger.cards.filterInD("oe");
                    player.addToExpansion(cards, "gain2").gaintag.add("ca_zushi");
                },
            },
            backup: {},
        },
    },
    ca_fouding: {
        trigger: {
            player: ["loseAfter"],
            global: ["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
        },
        forced: true,
        locked: false,
        filter(event, player) {
            var evt = event.getl(player);
            if (!evt || !evt.xs || !evt.xs.length) {
                return false;
            }
            if (event.name == "lose") {
                for (var i in event.gaintag_map) {
                    if (event.gaintag_map[i].includes("ca_zushi")) {
                        return true;
                    }
                }
                return false;
            }
            return player.hasHistory("lose", function (evt) {
                if (event != evt.getParent()) {
                    return false;
                }
                for (var i in evt.gaintag_map) {
                    if (evt.gaintag_map[i].includes("ca_zushi")) {
                        return true;
                    }
                }
                return false;
            });
        },
        async content(event, trigger, player) {
            const cards2 = [];
            if (trigger.name == "lose") {
                for (const i of trigger.xs) {
                    if (!trigger.gaintag_map[i.cardid] || !trigger.gaintag_map[i.cardid].includes("ca_zushi")) {
                      continue;
                    }
                    cards2.push(i);
                }
            } else {
                player.getHistory("lose", evt => {
                    if (trigger == evt.getParent()) {
                        for (const i of evt.xs) {
                            if (!evt.gaintag_map[i.cardid] || !evt.gaintag_map[i.cardid].includes("ca_zushi")) {
                              continue;
                            }
                            cards2.push(i);
                        }
                    }
                });
            }
            await player.draw(cards2.length);
        },
        group: "ca_fouding_dying",
        subSkill: {
            dying: {
                trigger: {
                    player: "dying",
                },
                filter(event, player) {
                    return player.getExpansions("ca_zushi").length >= 3;
                },
                prompt2: "你可以移除所有的“祖”然后回复至一点体力",
                async content(event, trigger, player) {
                    const cards = player.getExpansions("ca_zushi");
                    if (cards.length) {
                        await player.loseToDiscardpile(cards);
                    }
                    await player.recoverTo(1);
                },
            },
        },
    },
    //
    ca_jiejie: {
        enable: "phaseUse",
        filter(event, player) {
            if (!player.hasSkill("ca_jiejie_rewrite")) {
                return !player.hasSkill("ca_jiejie_used");
            }
            return true;
        },
        filterTarget(card, player, target) {
            return target.countCards("hes");
        },
        async content(event, trigger, player) {
            player.addTempSkill("ca_jiejie_used");
            const target = event.target;
            const result = await player.choosePlayerCard(target, "hej", true).set("ai", lib.card.guohe.ai.button).forResult();
            if (!result?.links?.length) {
                return;
            }
            const card = result.links[0];
            const result2 = await player
                .chooseToDiscard(`你可以弃置一张牌，然后弃置${get.translation(card)}（若展示后未弃置牌则此技能本回合失效），然后你摸一张牌`, "he", { suit: get.suit(card, target) })
                .set("ai", card => {
                    return 8 - get.value(card);
                })
                .forResult();
            if (!result2?.bool) {
                player.tempBanSkill(event.name);
            } else {
                await target.modedDiscard(result.links);
            }
            await player.draw();
        },
        ai: {
            order: 7,
            result: {
                target(player, target) {
                    return get.effect(target, { name: "guohe_copy2" }, player, target);
                },
            },
        },
        group: "ca_jiejie_use",
        subSkill: {
            use: {
                trigger: {
                    global: "useCard",
                },
                filter(event, player) {
                    if (event.player == player) {
                        return false;
                    }
                    if (!player.countDiscardableCards(player, "he", card => get.suit(card) == get.suit(event.card))) {
                        return false;
                    }
                    if (!player.hasSkill("ca_jiejie_rewrite")) {
                        return !player.hasSkill("ca_jiejie_used");
                    }
                    return true;
                },
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseToDiscard(get.prompt2(event.skill, trigger.player), "he")
                        .set("filterCard", (card) => {
                            return get.suit(card) == get.event().suit;
                        })
                        .set("ai", card => {
                            return _status.event.goon / 1.4 - get.value(card);
                        })
                        .set("suit", get.suit(trigger.card))
                        .set("logSkill", [event.skill, trigger.player])
                        .set(
                            "goon",
                            (() => {
                              if (!trigger.targets.length) {
                                return -get.attitude(player, trigger.player);
                              }
                              let num = 0;
                              for (const target of trigger.targets) {
                                num -= get.effect(target, trigger.card, trigger.player, player);
                              }
                              return num;
                            })()
                        )
                        .forResult();
                },
                logTarget: "player",
                async content(event, trigger, player) {
                    player.addTempSkill("ca_jiejie_used");
                    trigger.targets.length = 0;
                    trigger.all_excluded = true;
                    game.log(player, "令", trigger.card, "无效");
                    await player.draw();
                },
            },
            used: {
                charlotte: true,
            },
            rewrite: {
                charlotte: true,
            },
        },
    },
    ca_qiyue: {
        trigger: {
            global: "damageBegin4",
        },
        locked: true,
        juexingji: true,
        filter(event, player) {
            if (player.countMark("ca_zhumo_mark") < 3) {
                return false;
            }
            if (event.player.hp + event.player.hujia > event.num) {
                return false;
            }
            return event.player == player || player.getStorage("ca_qiyue_effect", []).includes(event.player);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill, trigger.player), true, (card, player, target) => {
                    return player != target;
                })
                .set("ai", target => {
                    const player = get.player();
                    return get.damageEffect(target, player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.awakenSkill(event.name);
            player.removeMark("ca_zhumo_mark", 3);
            await target.damage(3);
            player.addSkill("ca_jiejie_rewrite");
            await player.addSkills("ca_huanyuan");
        },
        group: "ca_qiyue_init",
        subSkill: {
            init: {
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                popup: false,
                locked: true,
                filter(event, player) {
                    return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
                },
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseTarget(get.prompt2("ca_qiyue"), lib.filter.notMe)
                        .set("ai", target => {
                            const player = get.player();
                            return target.getSkills(null, false, false).length + 1;
                        })
                        .forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    player.logSkill(event.name, target);
                    const skill = event.name + "_effect";
                    delete player.storage[skill];
                    player.addSkill(skill);
                    player.markAuto(skill, [target]);
                },
            },
            effect: {
                mark: true,
                intro: {
                    markcount: () => 0,
                    content: "本局游戏当你或$受到致命伤害时，若你的“魔力”标记大于等于三则你移去三个标记，取消之，然后对一名其他角色造成三点伤害，修改“结界”，获得“还愿”",
                },
            },
        },
    },
    ca_huanyuan: {
        trigger: {
            player: "phaseZhunbeiBegin",
            global: "dying",
        },
        popup: false,
        filter(event, player) {
            return player.hasMark("ca_zhumo_mark");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    if (target.isHealthy()) {
                        return false;
                    }
                    const trigger = _status.event.getTrigger();
                    if (trigger.name == "phaseZhunbei") {
                        return true;
                    }
                    return trigger.player == target;
                })
                .set("ai", target => {
                    const player = get.player();
                    return get.recoverEffect(target, player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            player.removeMark("ca_zhumo_mark");
            await target.recover();
            player.when({ global: "phaseEnd" }).then(async (event, trigger, player) => {
                player.logSkill("ca_huanyuan", target);
                await target.recover();
            });
        },
    },
    //
    ca_dutu: {
        trigger: {
            target: "useCardToTarget",
            player: "useCardToPlayer",
        },
        usable: 2,
        filter(event, player) {
            return event.player != event.target && player.countDiscardableCards(player, "he", card => get.color(card) == get.color(event.card));
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill), "he", { color: get.color(trigger.card) })
                .set("ai", card => {
                    if (_status.event.goon) {
                        return 8 - get.value(card);
                    }
                    return 0;
                })
                .set(
                    "goon",
                    (() => {
                        if (trigger.player == player) {
                            if (!["basic", "trick"].includes(get.type(trigger.card))) {
                                return false;
                            }
                            if (!trigger?.targets?.length) {
                                return false;
                            }
                            return !get.tag(trigger.card, "norepeat");
                        }
                        return get.effect(player, trigger.card, trigger.player, player) <= 0;
                    })()
                )
                .set("logSkill", event.skill)
                .forResult();
        },
        async content(event, trigger, player) {
            const next = player.judge(card => {
                if (get.color(card) == "red") {
                    if (get.attitude(player, trigger.player) > 0) {
                        return 2;
                    }
                }
                if (get.color(card) == "black" && trigger.target == player) {
                    return 1;
                }
                return 0;
            });
            const result = await next.forResult();
            if (result.color == "red") {
                if (lib.skill.dcshixian.filterx(trigger.getParent())) {
                    trigger.getParent().effectCount++;
                    game.log(trigger.card, "额外结算一次");
                }
            } else if (result.color == "black") {
                trigger.getParent().targets.length = 0;
                trigger.getParent().all_excluded = true;
            }
        },
    },
    ca_toutian: {
        trigger: {
            player: "judgeBegin",
        },
        popup: false,
        filter(event, player) {
            return !event.directresult && game.hasPlayer((current) => current != player && current.countCards("h"));
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return target != player && target.countCards("h");
                })
                .set("ai", target => {
                    const { player, todiscard } = get.event();
                    if (!todiscard) {
                      return 0;
                    }
                    if (todiscard != "all") {
                      if (target == todiscard) {
                        return 100;
                      }
                    }
                    return get.effect(target, { name: "guohe_copy2" }, player, player) / 2;
                })
                .set(
                    "todiscard",
                    (() => {
                      if (trigger.judgestr == "闪电" && get.damageEffect(player, null, player, "thunder") >= 0) {
                        return "all";
                      }
                      let friends = game.filterPlayer((i) => get.attitude(i, player) > 0);
                      for (let friend of friends) {
                        let cardsx = friend.getCards("he", (card) => trigger.judge(card) > 0);
                        cardsx.sort((a, b) => {
                          return get.value(a) - get.value(b);
                        });
                        if (cardsx.length) {
                          let card = cardsx[0];
                          if (trigger.judge(player.judging[0]) >= 0) {
                            if (get.value(card) > 4) {
                              return false;
                            }
                          }
                          return get.owner(card);
                        }
                      }
                      return "all";
                    })()
                )
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            if (!target.countCards("h")) {
                return;
            }
            const result = await player
                .choosePlayerCard(target, "请选择判定牌", "h", true)
                .set("ai", button => {
                    return get.event().getTrigger().judge(button.link);
                })
                .forResult();
            if (!result?.bool || !result.links?.length) {
                return;
            }
            const [card] = result.links;
            const lose_list = [];
            lose_list.push([target, result.links]);
            await game.loseAsync({
                lose_list: lose_list,
            }).setContent("chooseToCompareLose");
            trigger.directresult = result.links[0];
        },
    },
    //
    ca_nuowa: {
        init(player, skill) {
            game.addGlobalSkill("ca_nuowa_g");
            game.addGlobalSkill("ca_nuowa_effect");
        },
        onremove: player => {
            if (!game.hasPlayer(current => current.hasSkill("ca_nuowa", null, null, false), true)) {
                game.removeGlobalSkill("ca_nuowa_g");
                game.removeGlobalSkill("ca_nuowa_effect");
            }
        },
        trigger: {
            global: "phaseBegin",
            player: "damageEnd",
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCard(get.prompt2(event.skill), 2)
                .set("ai", card => {
                    return 7 - get.value(card);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            player.addGaintag(event.cards, "eternal_ca_nuowa_jiyan");
            const next = player.loseToDiscardpile(event.cards, ui.cardPile, "blank");
            next.set("log", false);
            next.insert_index = function () {
                return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
            };
            await next;
            game.log(player, `将${get.cnNumber(event.cards.length)}张牌置入了牌堆`);
            const cards = Array.from(ui.cardPile.childNodes).filter(card => card.hasGaintag("eternal_ca_nuowa_jiyan"));
            const skill = "eternal_ca_nuowa_ranyan";
            for (const card of cards) {
                let tag = card.gaintag?.find(tag => tag.startsWith(skill));
                if (tag) {
                    game.broadcastAll(
                        card => {
                            card.removeGaintag(tag);
                        },
                        card,
                        tag
                    );
                }
                tag = tag ? skill + parseFloat(parseInt(tag.slice(skill.length)) + 1) : "eternal_ca_nuowa_ranyan1";
                game.addTempTag(tag, `燃焰+${tag.slice(skill.length)}`);
                game.broadcastAll(
                    card => {
                        card.addGaintag(tag);
                    },
                    card,
                    tag
                );
            }
            await player.draw(2);
        },
        group: ["ca_nuowa_gain", "ca_nuowa_remove", "ca_nuowa_use"],
        subSkill: {
            gain: {
                trigger: {
                    global: ["gainAfter","loseAsyncAfter"],
                },
                forced: true,
                locked: false,
                getIndex(event, player) {
                    if (!event.getg) return [];
                    return game
                        .filterPlayer(target => {
                            const evt = event.getg(target);
                            return evt?.length && evt.some(card => card.hasGaintag("eternal_ca_nuowa_jiyan"));
                        })
                        .sortBySeat();
                },
                filter(event, player, name, target) {
                    return target != player;
                },
                logTarget(event, player, name, target) {
                    return target;
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const cards = trigger.getg(target).filter(card => card.hasGaintag("eternal_ca_nuowa_jiyan"));
                    await player.gain(cards, target, "giveAuto");
                },
            },
            remove: {
                trigger: {
                    global: ["loseAfter","cardsDiscardAfter","loseAsyncAfter","equipAfter"],
                },
                forced: true,
                filter(event, player) {
                    return event.getd()?.filterInD("od")?.some(card => {
                        return card.hasGaintag("eternal_ca_nuowa_jiyan");
                    });
                },
                async content(event, trigger, player) {
                    const cards = trigger.getd()?.filterInD("od")?.filter(card => {
                        return card.hasGaintag("eternal_ca_nuowa_jiyan");
                    });
                    for (const card of cards) {
                        game.broadcastAll(
                            card => {
                                card.removeGaintag("eternal_ca_nuowa_jiyan");
                                const skill = "eternal_ca_nuowa_ranyan";
                                let tag = card.gaintag?.find(tag => tag.startsWith(skill));
                                if (tag) {
                                    card.removeGaintag(tag);
                                }
                            },
                            card
                        );
                    }
                },
            },
            use: {
                trigger: {
                    player: "phaseUseBegin",
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    const card = get.cardPile(card => card.hasGaintag("eternal_ca_nuowa_jiyan"), "cardPile", "random");
                    if (card) {
                        await player.gain(card, "draw");
                    }
                },
            },
            jiyan: {
                name: "极炎",
            },
            ranyan: {
                name: "燃焰",
            },
            g: {
                trigger: {
                    player: "dieAfter",
                },
                filter: (event, player) => {
                    return !game.hasPlayer(current => current.hasSkill("ca_nuowa", null, null, false), true);
                },
                silent: true,
                forceDie: true,
                charlotte: true,
                content: () => {
                    game.removeGlobalSkill("ca_nuowa_g");
                    game.removeGlobalSkill("ca_nuowa_effect");
                },
            },
            effect: {
                mod: {
                    targetInRange(card, player, target) {
                        if (card?.gaintag?.length) {
                            return;
                        }
                        const skill = "eternal_ca_nuowa_ranyan";
                        let tag = card.gaintag?.find(tag => tag.startsWith(skill));
                        if (!tag) {
                            return;
                        }
                        let num = parseFloat(parseInt(tag.slice(skill.length)));
                        if (num > 1) {
                            return true;
                        }
                    },
                },
                trigger: {
                    player: "useCard",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    if (!event.card) {
                        return false;
                    }
                    return player.hasHistory(
                        "lose",
                        evtx =>
                            evtx.getParent() === event &&
                            Object.keys(evtx.gaintag_map).some(i => {
                                return evtx.gaintag_map[i].some(tag => tag.startsWith("eternal_ca_nuowa_ranyan"));
                            })
                    );
                },
                async content(event, trigger, player) {
                    const skill = "eternal_ca_nuowa_ranyan",
                        evt = trigger;
                    const evtx = player.getHistory(
                        "lose",
                        evtx =>
                            evtx.getParent() === evt &&
                            Object.keys(evtx.gaintag_map).some(i => {
                                return evtx.gaintag_map[i].some(tag => tag.startsWith(skill));
                            })
                    )[0];
                    const num = Object.keys(evtx.gaintag_map).reduce((sum, i) => {
                        const tag = evtx.gaintag_map[i].find(tag => tag.startsWith(skill));
                        if (tag) {
                            sum += parseInt(tag.slice(skill.length));
                        }
                        return sum;
                    }, 0);
                    if (num > 1) {
                        if (trigger.addCount !== false) {
                            trigger.addCount = false;
                            const stat = player.getStat().card;
                            const name = trigger.card.name;
                            if (typeof stat[name] == "number") {
                              stat[name]--;
                            }
                        }
                    }
                    if (num > 2) {
                        await player.draw(2);
                    }
                    if (num > 3) {
                        await player.recover();
                        await player.changeHujia(1);
                    }
                    if (num > 4) {
                        trigger.baseDamage += 1;
                    }
                    if (num > 5) {
                        trigger.effectCount++;
                    }
                    if (num > 6) {
                        trigger.effectCount++;
                    }
                    if (num > 7) {
                        trigger.effectCount++;
                    }
                },
            },
        },
    },
    ca_zhengbao: {
        trigger: {
            player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
        },
        popup: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return target.countCards("he", card => target.canRecast(card));
                })
                .set("ai", target => {
                    const player = get.player();
                    const cards = target.countCards("he", card => target.canRecast(card));
                    const att = get.attitude(player, target);
                    const num = target.maxHp - cards.length;
                    return att * num;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const cards = target.getCards("he", card => target.canRecast(card));
            if (cards.length) {
                await target.recast(cards);
            }
            const num = target.maxHp - target.countCards("h");
            if (num >= 0) {
                await target.drawTo(Math.min(5, target.maxHp));
            } else if (target.countDiscardableCards(target, "h")) {
                await target.chooseToDiscard(target.countCards("h") - target.maxHp, true);
            }
        },
    },
};