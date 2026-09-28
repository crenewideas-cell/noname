import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCardConfig["skill"] } */
const skill = {

    hx_taiejian_skill: {
        equipSkill: true,
        trigger: {
            source: "damageSource",
        },
        filter(event, player) {
            return event.card?.name == "sha" && player != event.player;
        },
        logTarget: "player",
        check(event, player) {
            return -get.attitude(player, event.player);
        },
        async content(event, trigger, player) {
            trigger.player.addSkill(event.name + "_cancel");
            trigger.player.addMark(event.name + "_cancel", 1, false);
        },
        subSkill: {
            cancel: {
                charlotte: true,
                forced: true,
                silent: true,
                popup: false,
                trigger: {
                    source: "damageBefore",
                },
                marktext: "泰阿",
                intro: {
                    content: "下#次造成伤害取消之",
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                    player.removeMark(event.name, 1, false);
                    if (!player.countMark(event.name)) {
                        player.removeSkill(event.name);
                    }
                },
            },
        },
    },
    
    hx_chixiao_skill: {
    audio: "ext:华夏风云/audio:2",
    equipSkill: true,
    trigger: {
        source: "damageSource",
    },
    filter(event, player) {
        return event.card &&
            event.card.name == "sha" &&
            player.countCards("he") > 0;
    },
    async content(event, trigger, player) {
        const result = await player.chooseCard(
            "he",
            [1, Infinity],
            "赤霄剑：你可以重铸任意张牌"
        )
            .set("ai", card => {
                const player = get.player();
                return 6 - get.value(card, player);
            })
            .forResult();

        if (result.bool && result.cards?.length) {
            await player.recast(result.cards);
        }
    },
},

hx_shengsibu_skill: {
    audio: "ext:华夏风云/audio:2",
    equipSkill: true,
    trigger: {
        player: "dieBefore",
        global: "dieBefore",
    },
    filter(event, player, name) {
        const equip = player.getEquips("hx_shengsibu")[0];
        if (!equip) return false;

        if (event.player == player) {
            if (!event.source) return true;
        }

        return true;
    },
    async cost(event, trigger, player) {
        const equip = player.getEquips("hx_shengsibu")[0];

        if (trigger.player == player && !trigger.source) {
            event.result = {
                bool: true,
                cost_data: {
                    type: "immune",
                    equip,
                },
            };
            return;
        }

        const result = await player.chooseBool(
            get.prompt("hx_shengsibu_skill", trigger.player),
            "弃置【生死簿】，令" + get.translation(trigger.player) + "复活并回复4点体力"
        )
            .set("ai", () => {
                const player = get.player();
                const target = _status.event.getTrigger().player;
                return get.attitude(player, target) > 0;
            })
            .forResult();

        event.result = {
            bool: result.bool,
            cost_data: {
                type: "revive",
                equip,
            },
        };
    },
    async content(event, trigger, player) {
        const data = event.cost_data || {};
        const equip = data.equip || player.getEquips("hx_shengsibu")[0];

        if (data.type == "immune") {
            trigger.cancel();
            game.log(player, "免疫了非正常死亡");
            return;
        }

        if (equip) {
            await player.discard(equip);
        }

        trigger.cancel();

        if (trigger.player.isDead?.()) {
            trigger.player.revive();
        }

        await trigger.player.recover(4, player);
    },
},

hx_shengsibu_destroy: {
    trigger: {
        global: "loseToDiscardpile",
    },
    forced: true,
    popup: false,
    charlotte: true,
    filter(event, player) {
        const cards = event.cards || (event.card ? [event.card] : []);
        return cards.some(card => card.name == "hx_shengsibu");
    },
    async content(event, trigger, player) {
        const cards = (trigger.cards || (trigger.card ? [trigger.card] : []))
            .filter(card => card.name == "hx_shengsibu");
        for (const card of cards) {
            if (ui.discardPile.contains(card)) {
                game.cardsGotoSpecial(card);
                game.log(card, "被销毁了");
            }
        }
    },
},
    
    yxs_jinlinjia_skill: {
                            equipSkill: true,
                            audio: "ext:华夏风云/audio/card:true",
                            trigger: {
                                target: ['useCardToBefore']
                            },
                            forced: true,
                            priority: 6,
                            audio: "ext:华夏风云/audio/card:true",
                            filter(event, player) {
                                if (player.hasSkillTag('unequip2')) return false;
                                if (event.player.hasSkillTag('unequip', false, {
                                        name: event.card ? event.card.name : null,
                                        target: player,
                                        card: event.card
                                    })) return false;
                                if (event.card.name == 'nanman') return true;
                                if (event.card.name == 'wanjian') return true;
                                //if(event.card.name=='chuqibuyi') return true;
                                return false;
                            },
                            content() {
                                trigger.cancel();
                            },
                            ai: {
                                effect: {
                                    target(card, player, target, current) {
                                        if (target.hasSkillTag('unequip2')) return;
                                        if (player.hasSkillTag('unequip', false, {
                                                name: card ? card.name : null,
                                                target: target,
                                                card: card
                                            }) || player.hasSkillTag('unequip_ai', false, {
                                                name: card ? card.name : null,
                                                target: target,
                                                card: card
                                            })) return;
                                        //if(card.name=='nanman'||card.name=='wanjian'||card.name=='chuqibuyi') return 'zerotarget';
                                        if (card.name == 'nanman' || card.name == 'wanjian') return 'zerotarget';
                                    }
                                }
                            }
                        },
                        
          yxs_TheBloodthirster_skill: {
                            equipSkill: true,
                            trigger: {
                                player: 'useCard1'
                            },
                            //priority:7,
                            filter(event, player) {
                                if (event.card.name == 'sha' && !event.card.nature) return true;
                            },
                            audio: "ext:华夏风云/audio/card:true",
                            check(event, player) {
                                var eff = 0;
                                for (var i = 0; i < event.targets.length; i++) {
                                    var target = event.targets[i];
                                    var eff1 = get.damageEffect(target, player, player);
                                    var eff2 = get.damageEffect(target, player, player, 'GXS_blood');
                                    eff += eff2;
                                    eff -= eff1;
                                }
                                return eff >= 0;
                            },
                            content() {
                                trigger.card.nature = 'GXS_blood';
                                if (get.itemtype(trigger.card) == 'card') {
                                    var next = game.createEvent('yxs_TheBloodthirster_clear');
                                    next.card = trigger.card;
                                    event.next.remove(next);
                                    trigger.after.push(next);
                                    next.setContent(function() {
                                        delete card.nature;
                                    });
                                }
                            }
                        },
                        yxs_TheBloodthirster_skill2: {
                            trigger: {
                                player: 'useCardAfter'
                            },
                            forced: true,
                            popup: false,
                            content() {
                                delete player.storage.yxs_TheBloodthirster_skill.nature;
                            }
                        },
                        
          yxs_qiankundai_skill: {
                            equipSkill: true,
                            audio: "ext:华夏风云/audio/card:true",
                            mod: {
                                maxHandcard(player, num) {
                                    return num + 1;
                                },
                            },
                        },
                        
    yxs_kongqueling_skill: {
                            equipSkill: true,
                            audio: "ext:华夏风云/audio/card:true",
                            enable: "phaseUse",

                            filter(event, player) {
    return true;
},
                            content() {
                                player.loseHp();
                                player.addTempSkill('yxs_zhen_skill');
                            },
                            ai: {
                                order: 8,
                                result: {
                                    player(player) {
                                        if (player.hasSkill('yxs_zhen_skill')) return 0;
                                        if (player.hp == 1) {
                                            if (player.countCards('h', {
                                                    name: 'tao'
                                                }) && player.countCards('h', {
                                                    name: 'sha'
                                                })) {
                                                return 2;
                                            }
                                            return 0;
                                        }
                                        if (player.countCards('h', {
                                                name: 'tao'
                                            }) && player.countCards('h', {
                                                name: 'sha'
                                            })) return 5;
                                        if (player.countCards('h', {
                                                name: 'sha'
                                            })) return 1;
                                        return 0;
                                    },
                                },
                                effect(card, player, target) {
                                    if (get.tag(card, 'damage')) {
                                        if (player.hasSkillTag('jueqing', false, target)) return [1, 1];
                                        return 1.2;
                                    }
                                    if (get.tag(card, 'loseHp')) {
                                        if (player.hp <= 1) return;
                                        return [0, 0];
                                    }
                                },
                            },
                        },
                        
          yxs_huxinjing_skill: {
                            equipSkill: true,
                            audio: "ext:华夏风云/audio/card:true",
                            trigger: {
                                player: "damageBefore",
                            },
                            filter(event, player) {
                                if (event.source && event.source.hasSkillTag('unequip', false, {
                                        name: event.card ? event.card.name : null,
                                        target: player,
                                        card: event.card
                                    })) return;
                                if (event.card && event.card.name == "sha" && event.card.nature != "GXS_darkness") return true;
                            },
                            content() {
    var card = player.getEquip('yxs_huxinjing');
    if (!card) return;
    // 初始化护甲值为2（总共可吸收2点伤害）
    if (typeof card.storage.yxs_huxinjing != 'number') {
        card.storage.yxs_huxinjing = 2;      // 初始值2
    }
    var damage = trigger.num;                 // 本次伤害值
    var remain = card.storage.yxs_huxinjing - damage;  // 剩余护甲值

    if (remain > 0) {
        // 护甲值足够，完全吸收本次伤害
        trigger.cancel();
        card.storage.yxs_huxinjing = remain;
    } else {
        // 护甲值不够，装备碎裂
        player.discard(card);
        if (player.countCards("h")) player.chooseToDiscard("h", true);
        trigger.num = -remain;  // 溢出伤害由角色承担
    }
},
                            ai: {
                                order: 9,
                                result: {
                                    player: 1
                                }
                            }
                        },
                        
          yxs_zhen_skill: {
                            trigger: {
                                player: 'useCard1'
                            },
                            filter(event) {
                                return event.card && event.card.name == 'sha' && event.notLink();
                            },
                            forced: true,
                            charlotte: true,
                            firstDo: true,
                            content() {
                                if (!trigger.baseDamage) trigger.baseDamage = 1;
                                trigger.baseDamage++
                            },
                            popup: false,
                            nopop: true,
                            ai: {
                                damageBonus: true
                            },
                        },
                        
           "g_zhen": {
                            cardSkill: true,
                            trigger: {
                                player: 'loseEnd',
                            },
                            popup: false,
                            forced: true,
                            filter(event, player) {
                                if (!event.visible) return false;
                                if (event.getParent(2).type == 'dying') return false;
                                if (event.type != 'discard' || event.getParent('phaseDiscard').player != player) return false;
                                if (event.hs) {
                                    for (var i = 0; i < event.hs.length; i++) {
                                        if (get.name(event.hs[i], player) == 'yxs_zhen') return true;
                                    }
                                }
                                return false;
                            },
                            content() {
                                var num = 0;
                                for (var i = 0; i < trigger.hs.length; i++) {
                                    if (get.name(trigger.hs[i], player) == 'yxs_zhen') num++;
                                }
                                if (trigger.getParent().name != 'useCard' || trigger.getParent().card.name != 'yxs_zhen') player.popup('鸩', 'wood');
                                player.loseHp(num).type = 'yxs_zhen';
                            },
                        },             
                        
          zhanshenmianju_skill: {
                            equipSkill: true,
                            trigger: {
                                player: 'damage'
                            },
                            audio: "ext:华夏风云/audio/card:true",
                            filter(event, player) {
                                if (event.source == undefined || event.num < 1) return false;
                                if (player.hasSkillTag('unequip2')) return false;
                                if (event.source && event.source.hasSkillTag('unequip', false, {
                                        name: event.card ? event.card.name : null,
                                        target: player,
                                        card: event.card
                                    })) return false;
                                return true;
                            },
                            check(event, player) {
                                var app = get.attitude(player, event.source);
                                if (event.num > 1 && app < 0) return true;
                                if (event.num > event.source.hp && app < 0) return true;
                                if (event.source.hp <= 2 && app < 0) return true;
                                return false;
                            },
                            logTarget: 'source',
                            content() {
                                var card = player.getEquip('yxs_zhanshen');
                                if (card) {
                                    player.discard(card);
                                    trigger.source.damage(trigger.num);
                                }
                            },
                            ai: {
                                filterDamage: true,
                                effect: {
                                    target(card, player, target) {
                                        if (player.countCards('h', 'tao') == 0 && player.countCards('h', 'yxs_zhen') == 0 && player.countCards('h', 'yxs_fu') == 0 && player.hp <= 1 && get.tag(card, 'damage') > 0) return 0;
                                    },
                                },
                                skillTagFilter(player, tag, arg) {
                                    if (player.hasSkillTag('unequip2')) return false;
                                    if (arg && arg.player) {
                                        if (arg.player.hasSkillTag('unequip', false, {
                                                name: arg.card ? arg.card.name : null,
                                                target: player,
                                                card: arg.card,
                                            })) return false;
                                        if (arg.player.hasSkillTag('unequip_ai', false, {
                                                name: arg.card ? arg.card.name : null,
                                                target: player,
                                                card: arg.card,
                                            })) return false;
                                        if (arg.player.hasSkillTag('jueqing', false, player)) return false;
                                    }
                                },
                            },
                        },
                        
          yxs_xuanhuafu_skill: {
                            forced: true,
                            locked: true,
                            audio: "ext:华夏风云/audio/card:true",
                            trigger: {
                                source: "damageBegin1",
                            },
                            direct: true,
                            equipSkill: true,
                            filter(event, player) {
                                if (event.getParent().name != 'sha') return false;
                                return player.countCards('he', function(card) {
                                    return card != player.getEquip('yxs_xuanhuafu');
                                }) > 0;
                            },
                            content() {
                                'step 0'
                                var next = player.chooseToDiscard('he', function(card, player) {
                                    return card != player.getEquip('yxs_xuanhuafu');
                                }, get.prompt(event.name, trigger.player), '弃置一张牌，令即将对其造成的伤害+1');
                                next.ai = function(card) {
                                    if (trigger.player.getEquip('baiyin')) return 0;
                                    if (_status.event.goon) return 6 - get.value(card);
                                    if (get.attitude(player, trigger.player) < 0 && trigger.player.hp <= 2) return 8 - get.value(card);
                                    return -1;
                                };
                                next.set('goon', get.attitude(player, trigger.player) < 0 && !trigger.player.hasSkillTag('filterDamage', null, {
                                    player: player,
                                    card: trigger.card,
                                }));
                                next.logSkill = [event.name, trigger.player];
                                'step 1'
                                if (result.bool) {
                                    trigger.num++;
                                }
                            },
                            ai: {
                                expose: 0.25,
                            },
                        },
                        
          yxs_shewoqishui_skill: {
                            cardSkill: true,
                            mod: {
                                cardEnabled(card, player) {
                                    if (player.storage.yxs_shewoqishui_skill == undefined) return true;
                                    if ((player.storage.yxs_shewoqishui_skill.hasSkill('kongcheng') || player.storage.yxs_shewoqishui_skill.hasSkill('yxs_guiyin')) && player.storage.yxs_shewoqishui_skill.countCards('h') == 0 && (card.name == 'sha' || card.name == 'juedou')) return false;
                                }
                            },
                            charlotte: true,
                            trigger: {
                                player: "useCardToPlayer",
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                content: '杀、决斗均视为对$使用'
                            },
                            filter(event, player) {
                                return (event.card.name == 'sha' || event.card.name == 'juedou') && player.storage.yxs_shewoqishui_skill && event.target != player.storage.yxs_shewoqishui_skill && player.storage.yxs_shewoqishui_skill.isAlive();
                            },
                            onremove(player) {
                                delete player.storage.yxs_shewoqishui_skill;
                            },
                            content() {
                                game.log(player, '触发目标呼叫转移，视为对', player.storage.yxs_shewoqishui_skill, '使用', trigger.card);
                                game.filterPlayer(function(current) {
                                    if (current == player.storage.yxs_shewoqishui_skill) {
                                        trigger.getParent().targets.push(current);
                                        trigger.target.line(current, 'red');
                                    }
                                });
                                trigger.getParent().targets.remove(trigger.target);
                            },
                        },
                        
          yxs_fu_skill: {
    cardSkill: true,
    enable: ["chooseToUse", "chooseToRespond"],
    hiddenCard(player, name) {
        if (!['sha', 'shan', 'tao', 'yxs_zhen'].includes(name)) return false;
        return player.hasCard(function(card) {
            return card.name == 'yxs_fu';
        }, 'hs');
    },
    filter(event, player) {
        // 守卫：非选牌事件（如AI评估调用的hasUsableCard）没有filterCard方法
        if (typeof event.filterCard !== 'function') return false;
        if (event.filterCard({
                name: 'sha'
            }, player, event) ||
            event.filterCard({
                name: 'shan'
            }, player, event) ||
            event.filterCard({
                name: 'yxs_zhen'
            }, player, event) ||
            event.filterCard({
                name: 'tao'
            }, player, event)) {
            if (player.hasCard(function(card) {
                    return card.name == 'yxs_fu';
                }, 'hs')) return true;
        }
        return false;
    },
    chooseButton: {
        dialog(event, player) {
            var list = [];
            if (event.filterCard({
                    name: 'sha'
                }, player, event)) {
                list.push(['基本', '', 'sha']);
                list.push(['基本', '', 'sha', 'GXS_blood']);
                list.push(['基本', '', 'sha', 'GXS_darkness']);
            }
            if (event.filterCard({
                    name: 'shan'
                }, player, event)) {
                list.push(['基本', '', 'shan']);
            }
            if (event.filterCard({
                    name: 'tao'
                }, player, event)) {
                list.push(['基本', '', 'tao']);
            }
            if (event.filterCard({
                    name: 'yxs_zhen'
                }, player, event)) {
                list.push(['基本', '', 'yxs_zhen']);
            }
            return ui.create.dialog('符', [list, 'vcard'], 'hidden');
        },
        check(button) {
            var player = _status.event.player;
            var card = {
                name: button.link[2],
                nature: button.link[3]
            };
            if (_status.event.getParent().type != 'phase' || game.hasPlayer(function(current) {
                    return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
                })) {
                switch (button.link[2]) {
                    case 'yxs_zhen': {
                        if (player.hp >= 2 && (player.countCards('hs', 'yxs_fu') >= 2 || player.countCards('h', 'sha') > 0) && !player.hasSkill('GXS_lianyining')) return 5;
                    };
                    case 'tao':
                        if (!player.hasSkill('GXS_lianyining')) return 4;
                    case 'shan':
                        return 4;
                    case 'sha':
                        if (button.link[3] == 'GXS_blood') return 2.95;
                        else if (button.link[3] == 'GXS_darkness') return 2.92;
                        else return 2.9;
                }
            }
            return 0;
        },
        backup(links, player) {
            return {
                filterCard(card, player, target) {
                    return card.name == 'yxs_fu';
                },
                precontent() {
                    game.playAudio("../extension/华夏风云/audio/card/", (player.sex == "female" ? "nv_yxs_fu" : "nan_yxs_fu"));
                },
                viewAs: {
                    name: links[0][2],
                    nature: links[0][3]
                },
                position: 'hs',
                popname: true,
            }
        },
        prompt(links, player) {
            return '将符当做' + get.translation(links[0][3] || '') + get.translation(links[0][2]) + '使用或打出';
        },
    },
    ai: {
        order(item, player) {
            if (_status.event.type == 'phase' && (player.countCards('h', 'sha') > 0 || player.countCards('hs', 'yxs_fu') > 1)) {
                return get.order({
                    name: 'sha'
                }) + 0.2;
            }
            return get.order({
                name: 'sha'
            }) - 0.1;
        },
        skillTagFilter(player) {
            if (!player.countCards('hs', 'yxs_fu')) return false;
        },
        result: {
            player: 1,
        },
        respondSha: true,
        respondShan: true,
        save: true,
    },
},
                        
                        
                        
                        
          
                        
                    
                                    
        
                        
                        
                        

};

export default skill;
