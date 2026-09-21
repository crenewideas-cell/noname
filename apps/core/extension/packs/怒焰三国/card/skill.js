import { lib, game, ui, get, ai, _status } from "noname";

const skill = {
	nysgs_fengzuidao_skill: {
        equipSkill: true,
        trigger: {
            player: "useCard",
        },
        filter(event, player) {
            if (event.card.name == "sha" && !game.hasNature(event.card)) {
                return true;
            }
        },
        async cost(event, trigger, player) {
            let eff = 0,
                nature = trigger.card.nature;
            for (let i = 0; i < trigger.targets.length; i++) {
                eff -= get.effect(trigger.targets[i], trigger.card, player, player);
                trigger.card.nature = "fire";
                eff += get.effect(trigger.targets[i], trigger.card, player, player);
                trigger.card.nature = nature;
            }
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill), 2, "chooseonly")
                .set("ai", card => {
                    const player = get.player();
                    const trigger = _status.event.getTrigger();
                    if (get.event("eff") > 0) {
                        return 7 - get.value(card);
                    }
                })
                .set("eff", eff)
                .forResult();
        },
        async content(event, trigger, player) {
            await player.discard(event.cards);
            trigger.baseDamage++;
            game.setNature(trigger.card, "fire");
            if (get.itemtype(trigger.card) == "card") {
                var next = game.createEvent("nysgs_fengzuidao_clear");
                next.card = trigger.card;
                event.next.remove(next);
                trigger.after.push(next);
                next.setContent(function () {
                    game.setNature(trigger.card, []);
                });
            }
        },
    },
    nysgs_stratagem_fengzuidao: {
        equipSkill: true,
        trigger: {
            source: "damageBegin1",
        },
        forced: true,
        locked: false,
        filter(event, player) {
        	if (!player.getVEquips("nysgs_fengzuidao").some(card => card.storage?.nysgs_stratagem)) return false;
            return event.hasNature("linked");
        },
        content() {
            trigger.num++;
        },
    },
    nysgs_longyaqiang_skill: {
        equipSkill: true,
        trigger: {
            source: "damageSource",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return event.card?.name == "sha" && event.player != player;
        },
        async content(event, trigger, player) {
            trigger.noFuryAdd = true;
        },
    },
    nysgs_stratagem_longyaqiang: {
        equipSkill: true,
        trigger: {
            source: "damageSource",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return player.nysgsCountFury(true);
        },
        content() {
            player.nysgsAddFury();
        },
    },
    nysgs_bazhepifeng_skill: {
        equipSkill: true,
        trigger: {
            player: ["loseHpBegin", "phaseJieshuBegin"],
        },
        forced: true,
        locked: false,
        filter(event, player) {
            if (player.hasSkillTag("unequip2")) {
                return false;
            }
            if (event.name == "phaseJieshuBegin") return player.isDamaged();
            return event.source?.isIn() && event.source != player;
        },
        async content(event, trigger, player) {
            if (trigger.name == "loseHp") {
                trigger.cancel();
            } else {
                player.recover();
            }
        },
    },
    nysgs_stratagem_bazhepifeng: {
        equipSkill: true,
        locked: false,
        mod: {
            targetEnabled(card, player, target) {
                if (target == player || target.hasSkillTag("unequip2")) return;
                if (!target.getVEquips("nysgs_bazhepifeng").some(card => card.storage?.nysgs_stratagem)) return;
                if (get.type(card) == "trick" && get.info("xunshi").isXunshi(card)) {
                    return false;
                }
            },
        },
    },
    nysgs_longlinjia_skill: {
        equipSkill: true,
        audio: true,
        trigger: {
            target: "shaBegin",
        },
        forced: true,
        priority: 6,        
        filter(event, player) {
            if (player.hasSkillTag("unequip2")) {
                return false;
            }
            if (
                event.player.hasSkillTag("unequip", false, {
                    name: event.card ? event.card.name : null,
                    target: player,
                    card: event.card,
                })
            ) {
                return false;
            }
            return event.card.name === "sha" && get.color(event.card) === "black";
        },
        content() {
            trigger.cancel();
        },
        ai: {
            effect: {
                target(card, player, target) {
                    if (typeof card !== "object" || target.hasSkillTag("unequip2")) {
                        return;
                    }
                    if (
                        player.hasSkillTag("unequip", false, {
                            name: card ? card.name : null,
                            target: target,
                            card: card,
                        }) ||
                        player.hasSkillTag("unequip_ai", false, {
                            name: card ? card.name : null,
                            target: target,
                            card: card,
                        })
                    ) {
                        return;
                    }
                    if (card.name === "sha" && get.color(card) === "black") {
                        return "zeroplayertarget";
                    }
                },
            },
        },
    },
    nysgs_stratagem_longlinjia: {
        equipSkill: true,
        trigger: {
            player: "useCardToPlayered",
        },
        forced: true,
        locked: false,
        filter(event, player) {
        	if (player.hasSkillTag("unequip2")) return false;
        	if (!player.getVEquips("nysgs_longlinjia").some(card => card.storage?.nysgs_stratagem)) return;
            return eventc.card.name == "sha" && get.color(event.card) == "black";
        },
        logTarget: "target",
        content() {
            trigger.target.loseHp();
        },
        ai: {
            jueqing: true,
            skillTagFilter(player, tag, arg) {
            	if (!player.getVEquips("nysgs_longlinjia").some(card => card.storage?.nysgs_stratagem)) return false;
                return arg?.card?.name === "sha" && get.color(arg.card) == "black";
            },
        },
    },
	nysgs_stratagem_qilin: {
		equipSkill: true,
		mod: {
            selectTarget(card, player, range) {
                if (card.name != "sha") return;
                if (!player.getVEquips("qilin").some(card => card.storage?.nysgs_stratagem)) return;
                if (range[1] != -1) range[1]++;
            },
        },
	},
	nysgs_stratagem_qinggang: {
        trigger: {
            player: "damageBegin1",
        },
        forced: true,
        equipSkill: true,
        filterx(event, player) {
            if (!player.getVEquips("qinggang").some(card => card.storage?.nysgs_stratagem)) return false;
            return event.player.hujia;
        },
        async content(event, trigger, player) {
            trigger.num *= 2;
        },
    },
    nysgs_stratagem_zhangba: {
		equipSkill: true,
		mod: {
	        cardEnabled(card, player) {
	            if (card.name != "tao" || !player.isDying()) return;
	            if (
	                game.hasPlayer(target => {
	                	if (target == player || !target.inRange(player)) return false;
	                    return target.getVEquips("zhangba").some(card => card.storage?.nysgs_stratagem);
	                })
	            ) {
	                return false;
	            }
	        },
	        cardSavable(card, player) {
	            return lib.skill.nysgs_stratagem_zhangba.mod.cardEnabled.apply(this, arguments);
	        },
	    },
    },
    nysgs_stratagem_zhuge: {
    	trigger: {
            player: "useCard",
        },
        forced: true,
        equipSkill: true,
        filter(event, player) {
        	if (!player.getVEquips("zhuge").some(card => card.storage?.nysgs_stratagem)) return false;
            return event.nysgsFuryBuff && event.card.name == "sha";
        },
        content() {
            trigger.num++;
        },
    },
    nysgs_stratagem_bagua: {
        trigger: {
            player: "useCard",
        },
        forced: true,
        equipSkill: true,
        filter(event, player) {
        	if (player.hasSkillTag("unequip2")) return false;
            if (!player.getVEquips("bagua").some(card => card.storage?.nysgs_stratagem)) return false;
            return get.tag(event.card, "damage") >= 0.5 && get.type(event.card) == "trick";
        },
        content() {
            trigger.nowuxie = true;
            trigger.baseDamage++;
        },
    },
    nysgs_stratagem_baiyin: {
        trigger: {
            player: "loseAfter",
            global: ["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
        },
        forced: true,
        charlotte: true,
        equipSkill: true,
        filter(event, player, name, card) {
            if (!card || card.name != "baiyin" || !card.storage?.nysgs_stratagem) {
                return false;
            }
            return !player.hasSkillTag("unequip2");
        },
        getIndex(event, player) {
            const evt = event.getl(player);
            const lostCards = [];
            evt.es.forEach(card => {
                const VEquip = evt.vcard_map.get(card);
                if (VEquip.name === "baiyin") {
                    lostCards.add(VEquip);
                }
            });
            return lostCards;
        },
        async content(event, trigger, player) {
            player.addSkill(`nysgs_stratagem_baiyin_clear`);
            const targets = game.filterPlayer(target => target != player);
            for (const target of targets) {
            	target.addAdditionalSkill(`nysgs_stratagem_baiyin_${player.playerid}`, "fengyin");
            }
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
                        target.removeAdditionalSkill(`nysgs_stratagem_baiyin_${player.playerid}`);
                    }, true);
                },
            },
        },
    },
};

export default skill;
