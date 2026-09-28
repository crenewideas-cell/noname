import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {

	hx_taiejian: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		skills: ["hx_taiejian_skill"],
		distance: {
			attackFrom: -1,
		},
		ai: {
			basic: {
				equipValue: 2,
				order: (card2, player) => {
					const equipValue = get.equipValue(card2, player) / 20;
					return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
				},
				useful: 2,
				value: (card2, player, index, method) => {
					if (!player.getCards("e").includes(card2) && !player.canEquip(card2, true)) {
						return 0.01;
					}
					const info2 = get.info(card2), current = player.getEquip(info2.subtype), value = current && card2 != current && get.value(current, player);
					let equipValue = info2.ai.equipValue || info2.ai.basic.equipValue;
					if (typeof equipValue == "function") {
						if (method == "raw") {
							return equipValue(card2, player);
						}
						if (method == "raw2") {
							return equipValue(card2, player) - value;
						}
						return Math.max(0.1, equipValue(card2, player) - value);
					}
					if (typeof equipValue != "number") {
						equipValue = 0;
					}
					if (method == "raw") {
						return equipValue;
					}
					if (method == "raw2") {
						return equipValue - value;
					}
					return Math.max(0.1, equipValue - value);
				},
			},
			result: {
				target: (player, target, card2) => get.equipResult(player, target, card2),
			},
		},
		enable: true,
		selectTarget: -1,
		filterTarget: (card2, player, target) => player == target && target.canEquip(card2, true),
		modTarget: true,
		allowMultiple: false,
		async equipCard(event) {
			const { card, target } = event;
			if (!card?.cards.some((card2) => get.position(card2, true) !== "o")) {
				await target.equip(card);
			}
		},
		toself: true,
	},
	
	hx_chixiao: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    distance: {
        attackFrom: -2,
    },
    skills: ["hx_chixiao_skill"],
    ai: {
        basic: {
            equipValue: 5,
        },
    },
},

   hx_shengsibu: {
    fullskin: true,
    type: "equip",
    subtype: "equip5",
    skills: ["hx_shengsibu_skill", "hx_shengsibu_destroy"],
    // ... 其他属性 ...
    onLose() {
        if ((!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
            cards.forEach(card => {
                card.fix();
                card.remove();
                card.destroyed = true;
                game.log(card, "被销毁了");
            });
        }
    },
},

hx_zhijuezhuge: {
		hidden: true, // Source placeholder has no rule, translation or artwork.
        enable: true,
        type: "trick",
        fullskin: true,
        selectTarget: -1,
        toself: true,
        filterTarget(card, player, target) {
            return target == player;
        },
        content: function () {
            
        },
    },
	
            yxs_jinlinjia: {
                            loseDelay: false,
                            onLose() {
                                var next = game.createEvent('yxs_jinlinjia_recover');
                                event.next.remove(next);
                                var evt = event.getParent();
                                if (evt.getlx === false) evt = evt.getParent();
                                evt.after.push(next);
                                next.player = player;
                                next.setContent(function() {
                                    if (player.isDamaged()) player.logSkill('yxs_jinlinjia_skill');
                                    player.recover();
                                });
                            },
                            filterLose(card, player) {
                                if (player.hasSkillTag('unequip2')) return false;
                                return true;
                            },
                            image: "ext:华夏风云/image/cardpic/${i}.png",
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            skills: ["yxs_jinlinjia_skill"],
                            tag: {
                                recover: 1,
                            },
                            ai: {
                                equipValue: 6,
                            },
                        },
                        
            yxs_TheBloodthirster: {
                            fullskin: true,
                            type: 'equip',
                            subtype: 'equip1',
                            image: "ext:华夏风云/image/cardpic/yxs_TheBloodthirster.png",
                            distance: {
                                attackFrom: -1
                            },
                            cardnature: 'fire',
                            ai: {
                                basic: {
                                    equipValue: 6
                                }
                            },
                            skills: ['yxs_TheBloodthirster_skill']
                        },
                        
            yxs_qiankundai: {
                            onLose() {
                                player.draw();
                            },
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            skills: ["yxs_qiankundai_skill"],
                            ai: {
                                equipValue: 5,
                            },
                        },
                        
    yxs_kongqueling: {
                            fullskin: true,
                            type: 'equip',
                            subtype: 'equip1',
                            distance: {
                                attackFrom: -3
                            },
                            cardnature: 'wood',
                            ai: {
                                basic: {
                                    equipValue: 5
                                }
                            },
                            skills: ['yxs_kongqueling_skill']
                        },
                        
               yxs_huxinjing: {
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            skills: ["yxs_huxinjing_skill"],
                            ai: {
                                equipValue: 7,
                            },
                        },
                        
               yxs_zhen: {
                            audio: "ext:华夏风云/audio/card",
                            fullskin: true,
                            type: "basic",
                            toself: true,
                            enable: true,
                            logv: false,
                            savable(card, player, dying) {
                                return dying == player;
                            },
                            global: 'g_zhen',
                            selectTarget: -1,
                            modTarget: true,
                            filterTarget(card, player, target) {
                                return target == player;
                            },
                            content() {
                                if (typeof event.baseDamage != 'number') event.baseDamage = 1;
                                if (target.isDying() || event.getParent(2).type == 'dying') {
                                    target.recover(event.baseDamage);
                                    if (_status.currentPhase == target) {
                                        target.getStat().card.yxs_zhen--;
                                    }
                                } else {
                                    if (!target.hasSkill('yxs_zhen_skill')) target.addTempSkill('yxs_zhen_skill');
                                    player.loseHp();
                                }
                            },
                            ai: {
                                /*basic:{
                                	useful(card,i){
                                		if(_status.event.player.hp>1){
                                			if(i==0) return 4;
                                			return 1;
                                		}
                                		if(i==0) return 7.3;
                                		return 3;
                                	},
                                	value(card,player,i){
                                		if(player.hp>1){
                                			if(i==0) return 5;
                                			return 1;
                                		}
                                		if(i==0) return 7.3;
                                		return 3;
                                	},
                                },
                                order(){
                                	return get.order({name:'sha'})+0.2;
                                },*/
                                basic: {
                                    order(card, player) {
                                        return get.order({
                                            name: 'sha'
                                        }) + 0.2;
                                    },
                                    useful: [7.2, 4, 3, 2],
                                    value: [7.2, 4, 3, 2],
                                },
                                result: {
                                    target(player, target) {
                                        if (target && target.isPhaseUsing() && target.hp == 1 && !target.countCards("h", "tao") && !player.getCards('h', 'sha')) return 0;
                                        if (target.hasSkill('yxs_zhen_skill')) return 0;
                                        if (player.hp == 1 && !player.countCards("h", "tao") && !player.countCards("h", "jiu")) {
    return 0;
}

                                        if (target && target.isDying()) return 2;
                                        if (target && !target.isPhaseUsing()) return 0;
                                        if (lib.config.mode == 'stone' && !player.isMin()) {
                                            if (player.getActCount() + 1 >= player.actcount) return 0;
                                        }
                                        var shas = player.getCards('h', 'sha');
                                        if (shas.length > 1 && (player.getCardUsable('sha') > 1 || player.countCards('h', 'zhuge'))) {
                                            return 1;
                                        }
                                        shas.sort(function(a, b) {
                                            return get.order(b) - get.order(a);
                                        })
                                        var card;
                                        if (shas.length) {
                                            for (var i = 0; i < shas.length; i++) {
                                                if (lib.filter.filterCard(shas[i], target)) {
                                                    card = shas[i];
                                                    break;
                                                }
                                            }
                                        } else if (player.hasSha() && player.needsToDiscard()) {
                                            if (player.countCards('h', 'zhuge') != 1) {
                                                card = {
                                                    name: 'sha'
                                                };
                                            }
                                        }
                                        if (card) {
                                            if (game.hasPlayer(function(current) {
                                                    return (get.attitude(target, current) < 0 &&
                                                        target.canUse(card, current, true, true) &&
                                                        !current.hasSkillTag('filterDamage', null, {
                                                            player: player,
                                                            card: card,
                                                            yxs_zhen: true,
                                                        }) &&
                                                        get.effect(current, card, target) > 0);
                                                })) {
                                                return 1;
                                            }
                                        }
                                        return 0;
                                    },
                                },
                                tag: {
                                    save: 1
                                }
                            }
                        },
                        
               yxs_zhanshen: {
                            fullskin: true,
                            type: "equip",
                            subtype: "equip2",
                            skills: ["zhanshenmianju_skill"],
                            ai: {
                                equipValue: 5,
                            },
                        },
                        
               yxs_xuanhuafu: {
                            type: "equip",
                            subtype: "equip1",
                            fullskin: true,
                            distance: {
                                attackFrom: -0,
                            },
                            skills: ["yxs_xuanhuafu_skill"],
                            ai: {
                                basic: {
                                    equipValue: 5,
                                },
                            },
                        },
                        
                        yxs_gean: {
    audio: "ext:华夏风云/audio/card",
    fullskin: true,
    image: "ext:华夏风云/image/cardpic/yxs_gean.png",
    type: "trick",
    filterTarget(card, player, target) {
        if (!ui.selected.targets.length) {
            return !target.hasSkillTag('noCompareTarget') && 
                ((target != player && target.countCards('h') > 0) || 
                 (target == player && player.countCards('h') > 1));
        }
        if (target == ui.selected.targets[0]) return false;  // 修复：不能选同一个目标
        if (ui.selected.targets[0] != player) {
            return ui.selected.targets[0].canCompare(target);
        } else {
            return ui.selected.targets[0].canCompare(target) && player.countCards('h') > 1;
        }
    },
    enable() {
        return game.countPlayer() > 1;
    },
    chongzhu() {
        return game.countPlayer() <= 2;
    },
    multicheck(card, player) {
        return game.countPlayer(function(current) {
            return current != player && current.countCards('h');
        }) > 1;
    },
    selectTarget: 2,
    singleCard: true,
    multitarget: true,
    targetprompt: ['P1', 'P2'],
    complexTarget: true,
    content() {
        'step 0'
        event.target1 = target;
        event.target2 = event.addedTarget;
        if (typeof event.baseDamage != 'number') event.baseDamage = 1;
        if (typeof event.extraDamage != 'number') event.extraDamage = 0;
        if (event.target1.canCompare(event.target2)) {
            event.target1.chooseToCompare(event.target2);
        } else {
            event.finish();
        }
        'step 1'
if (result.bool) {
    event.target3 = event.target1;
    event.target4 = event.target2;
} else if (result.tie) {
    event.target4 = player;
    event._tie = true;
} else {
    event.target4 = event.target1;
    event.target3 = event.target2;
}
if (result.player) {
    event.target1.gain([result.player], 'gain2', 'log');
}
if (result.target) {
    event.target2.gain([result.target], 'gain2', 'log');
}
'step 2'
if (event.target4 && event.target4.isIn()) {
    if (event._tie) {
        event.target4.damage(event.baseDamage + event.extraDamage);
    } else if (event.target3 && event.target3.isIn()) {
        event.target4.damage(event.target3, event.baseDamage + event.extraDamage);
    }
}
    },
    ai: {
        order: 6,
        value: [7, 1],
        useful: [4, 1],
        tag: {
            damage: 1,
        },
        result: {
            target(player, target) {
                // 修复：根据是否能赢拼点评估
                if (target == player) return 0;
                return -1;
            },
        },
    },
},
                        
               yxs_shewoqishui: {
    audio: "ext:华夏风云/audio/card",
    image: "ext:华夏风云/image/cardpic/yxs_shewoqishui.png",
    fullskin: true,

    type: 'delay',   // ← 保持你原来的，1.11.5 里这才是延时锦囊的正确写法

    filterTarget(card, player, target) {
        return (lib.filter.judge(card, player, target) && player != target);
    },
    judge(card) {
        if (get.suit(card) == 'diamond') return 1;
        return -3;
    },
    judge2(result) {
        if (result.bool == false) return true;
        return false;
    },
    contentBefore() {
        if (cards && cards.length == 1) {
            cards[0].storage.yxs_shewoqishui = player;
        }
    },
    effect() {
        if (result.bool == false) {
            if (card.cards && card.cards[0] && card.cards[0].storage.yxs_shewoqishui && card.cards[0].storage.yxs_shewoqishui.isIn()) {
                player.addTempSkill('yxs_shewoqishui_skill');
                player.storage.yxs_shewoqishui_skill = card.cards[0].storage.yxs_shewoqishui;
            }
        }
    },
    ai: {
        basic: {
            order: 1,
            useful: 1,
            value: 8,
        },
        result: {
            target(player, target) {
                if (player.hp == 1) return 0;
                var num = target.hp - target.countCards('h') - 2;
                if (num > -1) return -0.01;
                if (target.hp < 3) num--;
                if (target.isTurnedOver()) num /= 2;
                var dist = get.distance(player, target, 'absolute');
                if (dist < 1) dist = 1;
                return num / Math.sqrt(dist) * get.threaten(target, player);
            }
        },
    }
},
                        
               yxs_touliang: {
                            audio: "ext:华夏风云/audio/card",
                            fullskin: true,
                            image: "ext:华夏风云/image/cardpic/yxs_touliang.png",
                            type: 'trick',
                            enable: true,
                            selectTarget: 2,
                            singleCard: true,
                            complexTarget: true,
                            multitarget: true,
                            targetprompt: ['拿两张牌', '拿一张牌'],
                            filterTarget(card, player, target) {
                                if (ui.selected.targets.length == 1) {
                                    return (target == player && target.countCards('h') > 2) || (target != player && target.countCards('h') > 1)
                                }
                                return (target != player && target.countCards("h") > 0) || (target == player && target.countCards("h") > 1);
                            },
                            content() {
                                'step 0'
                                event.target1 = target;
                                event.target2 = event.addedTarget;
                                if (event.target1 && event.target2) {
                                    event.target1.chooseCard('h', '将一张牌交给' + get.translation(event.target2), 1, true);
                                } else {
                                    event.finish()
                                }
                                'step 1'
                                if (result.bool) {
                                    event.card1 = result.cards;
                                    var he = event.target2.getCards('h');
                                    if (he.length <= 2) {
                                        event.directresult = he;
                                    } else {
                                        event.target2.chooseCard('h', '将两张牌交给' + get.translation(event.target1), 2, true);
                                    }
                                } else {
                                    event.finish()
                                }
                                'step 2'
                                event.target1.$giveAuto(event.card1, event.target2);
                                event.target2.gain(event.card1, event.target1);
                                if (result.bool) {
                                    if (!event.directresult) {
                                        event.directresult = result.cards;
                                    }
                                    event.target2.$giveAuto(event.directresult, event.target1);
                                    event.target1.gain(event.directresult, event.target2);
                                }
                            },
                            ai: {
                                wuxie(target, card, player, viewer) {
                                    if (player == game.me && get.attitude(viewer, player) > 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    order: 8,
                                    value: 2,
                                    useful: 1,
                                },
                                tag: {
                                    multitarget: 1,
                                    multineg: 1,
                                },
                                result: {
                                    target(player, target) {
                                        if (ui.selected.targets.length == 1) {
                                            if (target.countCards('h') > 1 && get.attitude(player, target) < 0) return -2;
                                            return -1;
                                        }
                                        if (target.hasSkillTag('nogain')) return 0;
                                        return 2;
                                        return 0;
                                    }
                                }
                            }
                        },
                        
               yxs_dhhezong: {
                            audio: "ext:华夏风云/audio/card",
                            image: "ext:华夏风云/image/cardpic/yxs_hezong.png",
                            fullskin: true,
                            type: 'trick',
                            enable: true,
                            filterTarget: true,
                            selectTarget: [1, 2],
                            global: 'y_yxs_hezong',
                            targetprompt: ['连横'],
                            //wuxieable:true,
                            //notarget:true,
                            content() {
                                if (player.storage.hezonging == true || game.countPlayer(function(current) {
                                        return current.storage.hezonging == true;
                                    }) > 0) {
                                    target.draw();
                                } else target.link();
                            },
                            ai: {
                                wuxie(target, card, player, viewer) {
                                    if (_status.event.getRand() < 0.5) return 0;
                                    if (player == game.me && get.attitude(viewer, player) > 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    useful: 4,
                                    value: 4,
                                    order: 7
                                },
                                result: {
                                    target(player, target) {
                                        if (player.storage.hezonging == true) return 1;
                                        if (target.isLinked()) {
                                            if (target.hasSkillTag('link')) return 0;
                                            var f = target.hasSkillTag('nofire');
                                            var t = target.hasSkillTag('nothunder');
                                            if (f && t) return 0;
                                            if (f || t) return 0.5;
                                            return 2;
                                        }
                                        if (get.attitude(player, target) > 0) return -0.9;
                                        if (ui.selected.targets.length) return -0.9;
                                        if (game.hasPlayer(function(current) {
                                                return get.attitude(player, current) <= -1 && current != target && !current.isLinked();
                                            })) {
                                            return -0.9;
                                        }
                                        return 0;
                                    }
                                },
                                tag: {
                                    multitarget: 1,
                                    multineg: 1,
                                    norepeat: 1
                                }
                            }
                        },
                        yxs_hezong: {
                            audio: "ext:华夏风云/audio/card",
                            image: "ext:华夏风云/image/cardpic/yxs_hezong.png",
                            fullskin: true,
                            type: 'trick',
                            enable: true,
                            filterTarget: true,
                            selectTarget: [1, 2],
                            //global:'y_yxs_hezong',
                            //targetprompt:['连横'],
                            //wuxieable:true,
                            //notarget:true,
                            content() {
                                'step 0'
                                if (_status.event.targets.length == 1 && target == player) {
                                    player.chooseBool('合纵连横：是否摸一张牌？').set('ai', function(player) {
                                        var player = _status.event.player;
                                        if (!player.isLinked()) return true;
                                        return false;
                                    });
                                }
                                'step 1'
                                if (result.bool) {
                                    target.draw();
                                } else target.link();
                            },
                            ai: {
                                wuxie(target, card, player, viewer) {
                                    if (_status.event.getRand() < 0.5) return 0;
                                    if (player == game.me && get.attitude(viewer, player) > 0) {
                                        return 0;
                                    }
                                },
                                basic: {
                                    useful: 4,
                                    value: 4,
                                    order: 7
                                },
                                result: {
                                    target(player, target) {
                                        if (player.storage.hezonging == true) return 1;
                                        if (target.isLinked()) {
                                            if (target.hasSkillTag('link')) return 0;
                                            var f = target.hasSkillTag('nofire');
                                            var t = target.hasSkillTag('nothunder');
                                            if (f && t) return 0;
                                            if (f || t) return 0.5;
                                            return 2;
                                        }
                                        if (ui.selected.targets.length && ui.selected.targets.includes(player)) return 0;
                                        if (!game.hasPlayer(function(current) {
                                                return get.effect(current, {
                                                    name: 'tiesuo'
                                                }, player, player) > 0;
                                            })) {
                                            if (target == player) return 1;
                                            return 0;
                                        }
                                        if (get.attitude(player, target) > 0) return -0.9;
                                        if (ui.selected.targets.length) return -0.9;
                                        if (game.hasPlayer(function(current) {
                                                return get.attitude(player, current) <= -1 && current != target && !current.isLinked();
                                            })) {
                                            return -0.9;
                                        }
                                        return 0;
                                    }
                                },
                                tag: {
                                    multitarget: 1,
                                    multineg: 1,
                                    norepeat: 1
                                }
                            }
                        },
    y_yxs_hezong: {
                            cardSkill: true,
                            logv: false,
                            enable: 'phaseUse',
                            direct: true,
                            filter(event, player) {
                                var num = player.countCards('h', 'yxs_hezong');
                                return num > 0 && player.canUse('yxs_hezong', player);
                            },
                            content() {
                                'step 0'
                                player.storage.hezonging = true;
                                player.chooseToUse('使用【合纵连横】之合纵？', {
                                    name: 'yxs_hezong'
                                }, player, -1);
                                'step 1'
                                delete player.storage.hezonging;
                            },
                            ai: {
                                basic: {
                                    order: 6
                                },
                                result: {
                                    player: 1,
                                },
                            }
                        },
                        
              yxs_fu: {
                            type: "basic",
                            enable: false,
                            global: 'yxs_fu_skill',
                            fullskin: true,
                            image: "ext:华夏风云/image/cardpic/yxs_fu.png",
                            ai: {
                                basic: {
                                    order(card, player) {
                                        if (player.hasSkillTag('pretao')) return 5;
                                        return 2;
                                    },
                                    useful: [6.5, 4, 3, 2],
                                    value: [6.5, 4, 3, 2],
                                },
                                result: {
                                    target: 2,
                                    target_use(player, target) {
                                        // if(player==target&&player.hp<=0) return 2;
                                        if (player.hasSkillTag('nokeep', true, null, true)) return 2;
                                        var nd = player.needsToDiscard();
                                        var keep = false;
                                        if (nd <= 0) {
                                            keep = true;
                                        } else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
                                            keep = true;
                                        }
                                        var mode = get.mode();
                                        if (target.hp >= 2 && keep && target.hasFriend()) {
                                            if (target.hp > 2 || nd == 0) return 0;
                                            if (target.hp == 2) {
                                                if (game.hasPlayer(function(current) {
                                                        if (target != current && get.attitude(target, current) >= 3) {
                                                            if (current.hp <= 1) return true;
                                                            if ((mode == 'identity' || mode == 'versus' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
                                                        }
                                                    })) {
                                                    return 0;
                                                }
                                            }
                                        }
                                        if (target.hp < 0 && target != player && target.identity != 'zhu') return 0;
                                        var att = get.attitude(player, target);
                                        if (att < 3 && att >= 0 && player != target) return 0;
                                        var tri = _status.event.getTrigger();
                                        if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                                            if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                                                var num = game.countPlayer(function(current) {
                                                    if (current.identity == 'fan') {
                                                        return current.countCards('h', 'tao');
                                                    }
                                                });
                                                if (num > 1 && player == target) return 2;
                                                return 0;
                                            }
                                        }
                                        if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                                            if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                                                return 0;
                                            }
                                        }
                                        if (mode == 'stone' && target.isMin() &&
                                            player != target && tri && tri.name == 'dying' && player.side == target.side &&
                                            tri.source != target.getEnemy()) {
                                            return 0;
                                        }
                                        return 2;
                                    },
                                },
                                tag: {
                                    recover: 1,
                                    save: 1,
                                }
                            }
                        },          

                   
                        
                        
               dz_xueansha_set: {
                            mod: {
                                cardname(card, player, name) {
                                    if (card.name == 'dz_xuesha') return 'sha';
                                    if (card.name == 'dz_ansha') return 'sha';
                                    if (card.name == 'dz_dusha') return 'sha';
                                },
                                cardnature(card, player) {
                                    if (card.name == 'dz_xuesha') return 'GXS_blood';
                                    if (card.name == 'dz_ansha') return 'GXS_darkness';
                                    if (card.name == 'dz_dusha') return 'GXS_poison';
                                },
                            },
                        },
            
            dz_xuesha:{
				fullskin:true,
				image:"ext:华夏风云/image/cardpic/dz_xuesha.png",
                type:'basic',
				addinfo:'血杀',
				autoViewAs:'sha',
				global:'dz_xueansha_set',
				cardnature:'GXS_blood',
			},
            dz_ansha:{
				fullskin:true,
				image:"ext:华夏风云/image/cardpic/dz_ansha.png",
                type:'basic',
				addinfo:'暗杀',
				autoViewAs:'sha',
				global:'dz_xueansha_set',
				cardnature:'GXS_darkness',
			},
			dz_dusha:{
				fullskin:true,
				image:"ext:华夏风云/image/cardpic/dz_dusha.png",
                type:'basic',
				addinfo:'毒杀',
				autoViewAs:'sha',
				global:'dz_xueansha_set',
				cardnature:'GXS_poison',
			},
			
			precontent() {
            game.addNature("GXS_darkness", "暗", {});
            lib.inpile_nature.add('GXS_darkness');
            lib.natureBg.set("GXS_darkness", "extension/华夏风云/image/cardpic/dz_ansha.png");
            lib.translate.GXS_darknesssha = '暗杀';
            lib.translate.GXS_darknesssha_info = '造成的伤害不触发技能。';
            lib.translate._GXS_darknesssha_skill = '背袭';
            game.addNature("GXS_blood", "血", {});
            lib.inpile_nature.add('GXS_blood');
            lib.natureBg.set("GXS_blood", "extension/华夏风云/image/cardpic/dz_xuesha.png");
            lib.translate.GXS_bloodsha = '血杀';
            game.addNature("GXS_poison", "毒", {});
            lib.inpile_nature.add('GXS_poison');
            lib.natureBg.set("GXS_poison", "extension/华夏风云/image/cardpic/dz_dusha.png");
            lib.translate.GXS_poisonsha = '毒杀';
            
            },
                        
                                                
	
	

};

// These source entries belong to skills/lifecycle, never to the card catalogue.
export const cardSkills = { y_yxs_hezong: card.y_yxs_hezong, dz_xueansha_set: card.dz_xueansha_set };
export const prepareCardNatures = card.precontent;
delete card.y_yxs_hezong;
delete card.dz_xueansha_set;
delete card.precontent;

for (let i in card) {
	if (!card[i].cardimage && (!card[i].image || card[i].image.includes("${i}"))) {
		card[i].image = `ext:华夏风云/image/cardpic/${i}.png`;
	}
	if (!card[i].audio) {
		card[i].audio = `ext:华夏风云/audio/card/${i}.mp3`;
	}
}

export default card;
