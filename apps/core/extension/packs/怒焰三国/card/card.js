import { lib, game, ui, get, ai, _status } from "noname";

const card = {
	nysgs_fudichouxin: {
		audio: "ext:怒焰三国/audio",
		fullskin: true,
		type: "trick",
		enable: true,
    	filterTarget(card, player, target) {
    		return target != player && target.nysgsCountFury();
    	},
    	selectTarget: 1,
    	async content(event, trigger, player) {
	        const target = event.targets[0];
	        const next = target.nysgsRemoveFury();
	        next.set("source", player);
	        await next;
	    },
	    ai: {
	        wuxie(target, card, player, viewer, status) {
	        	let att = get.attitude(viewer, target),
	                eff = get.effect(target, card, player, target);
	            if (Math.abs(att) < 1 || status * eff * att >= 0) {
	                return 0;
	            }
	            return target.hasSkillTag("nysgsKeepFury");
	        },
	        basic: {
	            order: 8,
	            useful: 4,
	            value: 3,
	        },
	        result: {
	            target(player, target) {
	                return -1 * get.attitude(player, target);
	            },
	        },
	        tag: {
				nysgsRemoveFury: 1,
			},
	    },
	},
	nysgs_nufachongguan: {
		audio: "ext:怒焰三国/audio",
		fullskin: true,
		type: "trick",
		enable: true,
    	filterTarget(card, player, target) {
    		return target.nysgsCountFury(true);
    	},
    	selectTarget: 1,
    	async content(event, trigger, player) {
	        const target = event.targets[0];
	        const next = target.nysgsAddFury();
	        await next;
	    },
	    ai: {
	        wuxie(target, card, player, viewer, status) {
	        	let att = get.attitude(viewer, target),
	                eff = get.effect(target, card, player, target);
	            if (Math.abs(att) < 1 || status * eff * att >= 0) {
	                return 0;
	            }
	            return target.nysgsCountFury() < 2;
	        },
	        basic: {
	            order: 8,
	            useful: 4,
	            value: 4,
	        },
	        result: {
	            target(player, target) {
	                return -1 * get.attitude(player, target);
	            },
	        },
	        tag: {
				nysgsAddFury: 1,
			},
	    },
	},
	nysgs_shuiyanqijun: {
		audio: "ext:怒焰三国/audio",
		fullskin: true,
		type: "trick",
		enable: true,
    	filterTarget(card, player, target) {
    		return target != player;
    	},
    	selectTarget: -1,
    	async content(event, trigger, player) {
            const target = event.target;
            if (typeof event.baseDamage !== "number") {
		        event.baseDamage = 1;
		    }
		    if (typeof event.extraDamage !== "number") {
		        event.extraDamage = 0;
		    }
		    const num = event.baseDamage + event.extraDamage;
            const list = [];
            if (target.countCards("e", function (card) {
                return lib.filter.cardDiscardable(card, target, "nysgs_shuiyanqijun");
            })) {
                list.push("弃置所有装备区的牌");
            }
            list.push(`受到${num}点水属性伤害`);
            if (list.length == 1) event.result = {index: 1};
            else {
                event.result = await target
                    .chooseControl(list)
                    .set("prompt", `${get.translation(player)}对你使用${get.translation(event.card)}，请你选择一项`)
                    .set("ai", () => {
                    	const { player, source } = get.event();
                        let eff = get.effect(player, { name: "losehp" }, source, player) * get.event("num");
                        if (eff > 0) {
                            return 1;
                        }
                        if (player.hasSkillTag("noe")) {
                            return 0;
                        }
                        if (!eff) {
                            return 1;
                        }
                        if (player.isDamaged() && player.hasCard(card => get.name(card) == "baiyin" && get.recoverEffect(player, player, player) > 0, "e")) {
                            return 0;
                        }
                        if (player.hasCard(card => get.value(card, player) <= 0, "e") && !player.hasCard(card => get.value(card, player) > Math.max(7, 12 - player.hp), "e")) {
                            return 0;
                        }
                        if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) >= (get.event("num") * 2)) return 1;
                        return 0;
                    })
                    .set("source", player)
                    .set("num", num)
                    .forResult();
            }
            if (event.result.index == 0) {
                await target.modedDiscard(target.getCards("e"));
            } else {
                await target.damage(num, "nysgswater");
            }
        },
	    ai: {
	        wuxie(target, card, player, viewer, status) {
	            let att = get.attitude(viewer, target),
	                eff = get.effect(target, card, player, target);
	            if (Math.abs(att) < 1 || status * eff * att >= 0) {
	                return 0;
	            }
	            return 1;
	        },
	        basic: {
	            order: 8,
	            useful: [5, 1],
	            value: 4,
	        },
	        result: {
	        	player(player, target) {
	                if (player._nysgs_shuiyanqijun) {
	                    return 0;
	                }
	                if (target.hp > 2 || (target.hp > 1 && !target.isZhu && target !== game.boss && target !== game.trueZhu && target !== game.falseZhu)) {
	                    return 0;
	                }
	                player._nysgs_shuiyanqijun = true;
	                let eff = get.effect(target, { name: "losehp" }, player, target);
	                delete player._nysgs_shuiyanqijun;
	                if (eff >= 0) {
	                    return 0;
	                }
	                if (target.hp > 1 && target.hasSkillTag("respondSha", true, "respond", true)) {
	                    return 0;
	                }
	                let res = 0,
	                    att = get.sgnAttitude(player, target);
	                res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
	                if (get.mode() === "identity" && target.identity === "fan") {
	                    res += 2.4;
	                }
	                if ((get.mode() === "guozhan" && player.identity !== "ye" && player.identity === target.identity) || (get.mode() === "identity" && player.identity === "zhu" && (target.identity === "zhong" || target.identity === "mingzhong"))) {
	                    res -= 0.8 * player.countCards("he");
	                }
	                return res;
	            },
	            target(player, target) {
	            	let zhu = (get.mode() === "identity" && target.isZhu) || target.identity === "zhu";
	            	let es = target.getCards("e"),
	            		eff = 2 * get.sgn(get.effect(target, {name: "losehp"}, player, target));
	                if (!es.length) {
	                	if (zhu) {
	                		if (target.hp < 2) {
	                            return -99;
	                        }
	                	}
	                    return eff;
	                }
	                let val = 0;
	                for (let i of es) {
	                    if (i.name == "baiyin" && target.isDamaged() && get.recoverEffect(target)) {
	                        val += 6;
	                    } else {
	                        val -= get.value(i, target);
	                    }
	                }
	                return Math.max(eff, 0.15 * val);
	            },
	        },
	        tag: {
	        	loseHp: 1,
				loseCard: 1,
				multitarget: 1,
            	multineg: 1,
			},
	    },
	},
	nysgs_fengzuidao: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: {
			attackFrom: -3,
		},
		skills: ["nysgs_fengzuidao_skill"],
	},
	nysgs_longyaqiang: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: {
			attackFrom: -1,
		},
		skills: ["nysgs_longyaqiang_skill"],
	},
	nysgs_bazhepifeng: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		skills: ["nysgs_bazhepifeng_skill"],
	},
	nysgs_longlinjia: {
        fullskin: true,
        type: "equip",
        subtype: "equip2",
        skills: ["nysgs_longlinjia_skill"],
        onEquip() {
            if (player.nysgsCountFury(true)) {
                player.nysgsAddFury();
            }
        },
    },
	nysgsdb_atk1: {
		type: "db_atk",
    	fullskin: true,
	},
	nysgsdb_atk2: {
		type: "db_atk",
    	fullskin: true,
	},
	nysgsdb_atk3: {
		type: "db_atk",
    	fullskin: true,
	},
	nysgsdb_def1: {
		type: "db_def",
    	fullskin: true,
	},
	nysgsdb_def2: {
		type: "db_def",
    	fullskin: true,
	},
	nysgsdb_def3: {
		type: "db_def",
    	fullskin: true,
	},
};

for (let i in card) {
	card[i].image = "ext:怒焰三国/image/card/" + i + ".png";
	//card[i].audio = "ext:怒焰三国/audio";
}

export default card;
