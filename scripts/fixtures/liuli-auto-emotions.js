// Test oracle: verbatim from 琉璃版 5.5 / 祖安武将/extension.js:40201-40497.
// Includes both damageSendEgg definitions, so the later assignment wins as in the original.
                lib.skill._emojiRebate1 = {
                    trigger: {
                        player: ['recoverAfter', 'dying', 'gainAfter', 'turnOverAfter']
                    },
                    forced: true,
                    popup: false,
                    priority: -98,
                    filter: function(event, player) {
                        if (!event.source || event.source == player || game.isMine(player)) return false;
                        return lib.config['extension_祖安设置_zuanemotion'] && player.throwEmotion && (Math.random() >= 0.3);
                    },
                    content: function() {
                        var list = {
                            humiliationList: ["shoe", "egg"],
                            praiseList: ["flower", "wine"],
                        };
                        switch (trigger.name) {
                        case "recover":
                            let save = trigger.getParent("_save");
                            let keys = Object.keys(save);
                            if (keys.length) {
                                if (player.getEnemies().contains(save.player)) {
                                    //EpicFX.emoji.playEmoji(player, save.player, EpicFX.emoji.humiliationList.randomGet());
                                    player.throwEmotion(save.player, list.humiliationList.randomGet());
                                } else {
                                    //EpicFX.emoji.playEmoji(player, save.player, EpicFX.emoji.praiseList.randomGet());
                                    if (player.getHp() > 2 || (Math.random() * 2 + 0.5) < Math.max(1, player.getHp())) {
                                        player.throwEmotion(save.player, list.praiseList.randomGet());
                                    } else {
                                        for (let i = 0; i < 10; i++) {
                                            setTimeout(() =>{
                                                if (i <= 8) player.throwEmotion(trigger.source, 'flower');
                                                else player.throwEmotion(trigger.source, 'wine');
                                            },
                                            100 * i);
                                        }
                                    }
                                }
                            }
                            break;
                        case "dying":
                            if (trigger.source) {
                                if (player.getEnemies().contains(trigger.source)) {
                                    //EpicFX.emoji.playEmoji(player, trigger.source, EpicFX.emoji.humiliationList.randomGet());
                                    if (Math.random() >= 0.3) {
                                        player.throwEmotion(trigger.source, list.humiliationList.randomGet());
                                    } else {
                                        for (let i = 0; i < 10; i++) {
                                            setTimeout(() =>{
                                                if (i <= 8) player.throwEmotion(trigger.source, 'egg');
                                                else player.throwEmotion(trigger.source, 'shoe');
                                            },
                                            100 * i);
                                        }
                                    }
                                }
                            }
                            break;
                        case "turnOver":
                            if (trigger.parent) {
                                if (player.getEnemies().contains(trigger.parent.player)) {
                                    //EpicFX.emoji.playEmoji(player, trigger.parent.player, EpicFX.emoji.humiliationList.randomGet());
                                    player.throwEmotion(trigger.parent.player, list.humiliationList.randomGet());
                                } else {
                                    //EpicFX.emoji.playEmoji(player, trigger.parent.player, EpicFX.emoji.praiseList.randomGet());
                                    player.throwEmotion(trigger.parent.player, list.praiseList.randomGet());
                                }
                            }
                            break;
                        case "gain":
                            if (trigger.giver && trigger.cards.length >= 2 && player.getFriends().contains(trigger.giver)) {
                                //EpicFX.emoji.playEmoji(player, trigger.giver, EpicFX.emoji.praiseList.randomGet());
                                player.throwEmotion(trigger.giver, list.praiseList.randomGet());
                            }
                            break;
                        }
                    }
                }
                lib.skill._emojiRebate2 = {
                    trigger: {
                        global: ['gameDrawBefore'],
                        player: "enterGame",
                    },
                    forced: true,
                    popup: false,
                    priority: -99,
                    filter: function(event, player) {
                        if (game.isMine(player)) return false;
                        return lib.config['extension_祖安设置_zuanemotion'] && game.filterPlayer(current =>current != player).length >= 2 && player.throwEmotion && Math.random() <= (0.3 / game.filterPlayer(current =>current != player).length); //(Math.random() >= 0.75);
                    },
                    content: function() {
                        const initialDelay = [0, 100, 200, 300, 400, 500].randomGet();
                        const players = game.filterPlayer(current =>current !== player).sortBySeat();
                        const baseInterval = 15; // 基础间隔时间 (最低阈值)
                        const sum = 10 + Math.ceil(10 * Math.random());
                        //const times = [1,1,1,2,2,3].randomGet();
                        player.throwing_forbid = true;

                        let forSend = function(num) {
                            const img = num >= 1 ? 'flower': 'wine';
                            for (let i = 0; i < players.length; i++) {
                                const target = players[i];
                                const executeTime = i * baseInterval * 0.2;
                                setTimeout(() =>{
                                    player.throwEmotion(target, img);
                                },
                                executeTime);
                            }
                            setTimeout(() =>{
                                if (num > 0) {
                                    forSend(num - 1);
                                } else {
                                    player.throwing_forbid = undefined;
                                }
                            },
                            players.length * baseInterval);
                        }
                        setTimeout(() =>{
                            forSend(sum);
                        },
                        initialDelay);
                    }
                }
                lib.skill._zuan_damageSendEgg = {
                    forced: true,
                    popup: false,
                    priority: -98,
                    trigger: {
                        global: 'damageEnd',
                    },
                    filter: function(event, player) {
                        var evt = event.getParent();
                        return lib.config['extension_祖安设置_zuanemotion'] && !game.isMine(player)
                        /*!player.isUnderControl(true)*/
                        && player.throwEmotion && get.attitude(player, event.player) > 0 && game.xwGetPhasePlayer() == event.player;
                    },
                    content: function() {
                        'step 0';
                        if (Math.random() >= 0.8) {
                            player.throwEmotion(trigger.player, ['egg', 'shoe'].randomGet());
                        }
                    }
                };
                lib.element.player.zuanLikeMe = function(tar, rate) {
                    if (!rate) {
                        rate = 1;
                    }
                    if (!lib.config['extension_祖安设置_zuanemotion']) {
                        return;
                    }
                    if (!this.throwEmotion) {
                        return;
                    }
                    if (tar === 'friend') {
                        tar = game.filterPlayer(function(current) {
                            return current != this && get.attitude(current, this) > 0 && get.attitude(this, current) > 0;
                        });
                    } else if (tar === 'enemy') {
                        tar = game.filterPlayer(function(current) {
                            return current != this && get.attitude(current, this) < 0 && get.attitude(this, current) < 0;
                        });
                    } else if (!Array.isArray(tar)) { //判断是否为数组
                        tar = [tar];
                    }
                    tar.randomSort();
                    for (var p of tar) {
                        if (Math.random() <= rate) {
                            p.throwEmotion(this, 'flower');
                        }
                    }
                };

                lib.element.player.zuanHateMe = function(tar, rate) {
                    if (!rate) {
                        rate = 1;
                    }
                    if (!lib.config['extension_祖安设置_zuanemotion']) {
                        return;
                    }
                    if (!this.throwEmotion) {
                        return;
                    }
                    if (tar === 'friend') {
                        tar = game.filterPlayer(function(current) {
                            return current != this && get.attitude(current, this) > 0 && get.attitude(this, current) > 0;
                        });
                    } else if (tar === 'enemy') {
                        tar = game.filterPlayer(function(current) {
                            return current != this && get.attitude(current, this) < 0 && get.attitude(this, current) < 0;
                        });
                    } else if (!Array.isArray(tar)) {
                        tar = [tar];
                    }
                    tar.randomSort();
                    for (var p of tar) {
                        if (Math.random() <= rate) {
                            p.throwEmotion(this, ['egg', 'shoe'].randomGet());
                        }
                    }
                };
                lib.skill._zuan_sendWine = {
                    forced: true,
                    popup: false,
                    priority: -45,
                    trigger: {
                        global: ['phaseUseBegin', 'useCard'],
                    },
                    filter: function(event, player) {
                        if (event.name == 'useCard') {
                            if (event.card.name != 'jiu') return false;
                            if (event.player.hp == 1) return false;
                            if (event.player == player) return false;
                            //if(player.isUnderControl(true))return false;
                            if (game.isMine(player)) return false;
                            if (event.player.hp <= 0) return false;
                            return lib.config['extension_祖安设置_zuanemotion'] && get.attitude(player, event.player) > 0 && get.attitude(event.player, player) > 0;
                        }
                        return get.attitude(player, event.player) > 0 && get.attitude(event.player, player) > 0 && event.player.countCards('h') > 5 && lib.config['extension_祖安设置_zuanemotion'] && !player.isUnderControl(true) && player.throwEmotion;
                    },
                    content: function() {
                        if (trigger.name == 'useCard') {
                            if (Math.random() > 0.3) {
                                player.throwEmotion(trigger.player, 'wine');
                            }
                            return;
                        }
                        if (Math.random() < trigger.player.countCards('h') / 15 && trigger.player != player) {
                            player.throwEmotion(trigger.player, 'wine');
                        }
                    }
                };
                lib.skill._zuan_damageSendEgg = {
                    forced: true,
                    popup: false,
                    priority: -998,
                    trigger: {
                        player: 'damageSource',
                    },
                    filter: function(event, player) {
                        return ! player.hasSkillTag('maixie') && !player.hasSkillTag('maixie_hp') && event.source && get.attitude(player, event.source) > 0 && lib.config['extension_祖安设置_zuanemotion'] && !game.isMine(player)
                        /*!player.isUnderControl(true)*/
                        && player.throwEmotion;
                    },
                    content: function() {
                        'step 0';
                        if (Math.random() > 0.5) {
                            player.throwEmotion(trigger.source, ['shoe', 'egg'].randomGet());
                        }
                    }
                };
                lib.skill._zuan_damageSendFlower = {
                    forced: true,
                    popup: false,
                    priority: -3,
                    trigger: {
                        global: 'damageSource',
                    },
                    filter: function(event, player) {
                        return event.source && event.num > 1 && get.attitude(player, event.player) < 0 && get.attitude(player, event.source) > 0 && lib.config['extension_祖安设置_zuanemotion'] && !game.isMine(player)
                        /*!player.isUnderControl(true)*/
                        && player.throwEmotion;
                    },
                    content: function() {
                        'step 0';
                        if (Math.random() > 1 / trigger.num && trigger.source != player) {
                            player.throwEmotion(trigger.source, 'flower');
                        }
                    }
                };
                lib.skill._zuan_killSendFlower = {
                    forced: true,
                    popup: false,
                    priority: -23,
                    trigger: {
                        global: 'dieBegin',
                    },
                    filter: function(event, player) {
                        return get.attitude(player, event.player) < 0 && lib.config['extension_祖安设置_zuanemotion'] && !game.isMine(player)
                        /*!player.isUnderControl(true)*/
                        && player.throwEmotion;
                    },
                    content: function() {
                        'step 0';
                        event.killer = event.source;
                        if (!event.killer || get.attitude(player, event.killer) <= 0) {
                            var evt = trigger.getParent(3);
                            event.killer = evt.player;
                        }
                        if (event.killer && event.killer != player && get.attitude(player, event.killer) > 0) {
                            if (Math.random() > 0.2) {
                                player.throwEmotion(event.killer, 'flower');
                            }
                        }
                    }
                };
