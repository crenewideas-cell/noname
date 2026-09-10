// Extracted from character/app.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
            app_liuling: ['male', 'wei', 3, ['appjiusong', 'apphaotao', 'appbishi']],
            app_simayi: ['male', 'wei', 3, ['appyinren', 'appduoquan']],
            app_guojia: ['male', 'wei', 3, ['appdingce', 'appsuanlue']],
            app_zhugeliang: ['male', 'shu', 3, ['appsangu', 'appyanshi']],
            app_huangyueying: ['female', 'shu', 3, ['appmiaobi', 'apphuixin']],
            app_caocao: ['male', 'wei', 4, ['appdelu', 'appzhujiu']],
            app_xuzhu: ['male', 'wei', 4, ['apphuhou', 'appwuwei']],
            app_yuanshao: ['male', 'qun', 4, ['appzunbei', 'appmengshou']],
            app_zhenji: ['female', 'wei', 3, ['appshenfu', 'appsiyuan']],
            app_sunce: ['male', 'wu', 4, ['apptaoni', 'apppingjiang', 'appdingye'], ['zhu']],
            app_xiaoqiao: ['female', 'wu', 3, ['apptongxin', 'appzhaoyan']],
            app_daqiao: ['female', 'wu', 3, ['appjielie', 'appxiangzhi']],
            app_machao: ['male', 'qun', 4, ['appqipao', 'appzhuixi'], ['doublegroup:qun:shu']],
            app_lusu: ['male', 'wu', 3, ['applvyuan', 'apphezong']],
            app_wangrong: ["male", "wei", 3, ["appjianlin", "appsixiao"]],
            app_xunyu: ['male', 'wei', 3, ['appwangzuo', 'appjuxian', 'appxianshi']],
            app_caiwenji: ['female', 'qun', 3, ['appbeijia', 'appsifu']],
            app_guanyu: ['male', 'shu', 4, ['appyihan', 'appgywuwei']],
            app_sunquan: ['male', 'wu', 4, ['appzongxi', 'appluheng']],
            app_zhouyu: ['male', 'wu', 3, ['appyingrui', 'appfenli']],
        },
"characterSort": {
            app: {
                app_zhulinqixian: ['app_liuling', 'app_wangrong'],
                app_wu: ['app_lvbu', 'app_xuzhu', 'app_machao', 'app_guanyu', 'app_sunce'],
                app_zhi: ['app_guojia', 'app_zhugeliang', 'app_lusu', 'app_xunyu', 'app_zhouyu'],
                app_quan: ['app_simayi', 'app_caocao', 'app_yuanshao', 'app_sunquan'],
                app_cai: ['app_xiaoqiao', 'app_huangyueying', 'app_daqiao', 'app_zhenji', 'app_caiwenji'],
            },
        },
"characterIntro": {},
"dynamicTranslate": {},
"translate": {
            app_liuling: '刘伶',
            appjiusong: '酒颂',
            appjiusong_info: '你可以将一张锦囊牌当【酒】使用。当一名角色使用【酒】时，你获得1枚“醉”标记（至多3枚）。',
            apphaotao: '酕醄',
            apphaotao_info: '当其他角色使用基本牌或普通锦囊牌指定唯一目标时，你可以移去1枚“醉”，令此牌目标改为随机一名角色，若原目标与新目标为同一角色，你从牌堆中获得一张锦囊牌。',
            appbishi: '避仕',
            appbishi_info: '锁定技，你不能成为伤害类锦囊牌的目标。',
            app_simayi: '极司马懿',
            appyinren: '隐忍',
            appyinren_info: '回合开始时，你可以跳过本回合的出牌阶段和弃牌阶段，依次获得以下一个技能：“奸雄”，“行殇”，“明鉴”。',
            appduoquan: '夺权',
            appduoquan_info: '结束阶段，你可以观看一名角色的手牌并选择一种类别，当其使用下一张牌时，若此牌为你选择的类别，你令之无效，且此牌进入弃牌堆时，你可以使用之。',
            appyinren_new_rejianxiong: '奸雄',
            appyinren_xingshang: '行殇',
            appyinren_mingjian: '明鉴',
            app_guojia: '极郭嘉',
            appdingce: '定策',
            appdingce_info: '游戏开始时，你获得3点谋略值（至多5点）。每名角色的回合结束后，你获得X点谋略值（X为你本回合使用牌的类别数）。',
            appsuanlue: '算略',
            appsuanlue_info: '每名角色的回合限一次，你可以消耗1点谋略值，将一张牌当你本回合使用的上一张基本牌或普通锦囊牌使用。',
            appmiaoji: '妙计',
            appmiaoji_info: '每名角色的回合限一次，你可以消1~3点耗谋略值，视为使用对应牌：1点，【过河拆桥】；2点，【无懈可击】；3点，【无中生有】。',
            app_zhugeliang: '极诸葛亮',
            app_huangyueying: '极黄月英',
            appsangu: '三顾',
            appyanshi: '演势',
            appmiaobi: '妙笔',
            apphuixin: '慧心',
            appsangu_info: '锁定技，每当有三张牌指定你为目标后，你获得3点谋略值（至多5点），然后你观看牌堆顶的三张牌，以任意顺序置于牌堆顶或牌堆底。',
            appyanshi_info: '出牌阶段限一次，你可以从牌堆顶或牌堆底摸一张牌，若此牌于此阶段被使用，结算后你可以弃置一张牌，再次发动此技能，然后从牌堆另一端摸一张牌。',
            appmiaobi_info: '当你于出牌阶段使用锦囊牌结算后，你可以将之置于其中一个目标的武将牌旁（每回合每种牌名限一次）。有“妙笔”的角色的准备阶段，其选择一项：1.交给你一张锦囊牌，然后移去“妙笔”；2.你对其依次使用“妙笔”。',
            apphuixin_info: '回合开始时，若你装备区牌数为：偶数，本回合你获得“集智”；奇数，本回合你获得“祭风”。',
            appjifeng: '祭风',
            appjifeng_info: '出牌阶段限一次，你可以弃置一张手牌，然后从牌堆中随机获得一张锦囊牌。',
            app_xuzhu: '极许褚',
            apphuhou: '虎侯',
            apphuhou_info: '①与你进行【决斗】的角色不能打出【杀】。②你可以将任意张装备牌当作【杀】使用或打出。③以你为伤害来源的【杀】或【决斗】造成的伤害+X（X为此牌对应的实体牌与你使用【决斗】打出的牌中因〖虎侯②〗转化的装备牌数之和）。',
            appwuwei: '武卫',
            appwuwei_info: '结束阶段，你可以选择一名角色，若如此做，直到你的下个回合开始，其成为伤害类卡牌的目标后，若其体力值不大于你，则你令此牌对其无效，然后使用者于此牌结算完毕后视为对你使用【决斗】（你无法因此【决斗】触发〖武卫〗）。',
            app_caocao: '极曹操',
            appdelu: '得鹿',
            appdelu_info: '出牌阶段限一次，你可以与任意名体力值不大于你的角色进行同时拼点，且你的拼点点数+X（X为此次参与拼点的角色数）。拼点赢的角色依次随机获得所有拼点没赢的角色区域内的一张牌。',
            appzhujiu: '煮酒',
            appzhujiu_info: '出牌阶段限一次，你可以与一名其他角色交换一张手牌，若这两张手牌的颜色：相同，你回复1点体力；不相同，你对其造成1点伤害。',
            app_yuanshao: '极袁绍',
            appzunbei: '尊北',
            appzunbei_info: '出牌阶段限一次，你可以与所有其他角色进行共同拼点。赢的角色视为使用一张【万箭齐发】，且此牌结算完毕后，你摸受到过此牌造成的伤害的角色数的牌；若不存在赢的角色，则此技能视为未发动过。',
            appmengshou: '盟首',
            appmengshou_info: '每轮限一次，当你受到其他角色造成的伤害时，若其本轮造成的伤害值不大于你，则你可以防止此伤害。',
            app_sunce: '极孙策',
            apptaoni: '讨逆',
            apptaoni_info: '出牌阶段开始时，你可以失去任意点体力并摸等量张牌，然后令至多X名其他角色获得1枚“讨逆”标记（X为你以此法失去的体力值）。若如此做，本回合你的手牌上限等于你的体力上限。',
            apppingjiang: '平江',
            apppingjiang_info: '出牌阶段，你可以视为对一名有“讨逆”标记的角色使用一张【决斗】。若你胜，其弃置所有“讨逆”标记且本回合你使用的【决斗】获得〖无双〗效果且造成的伤害+1。否则此技能失效直到本回合结束',
            appdingye: '鼎业',
            appdingye_info: '锁定技，结束阶段，你回复X点体力（X为本回合受到过伤害的角色数）。',
            app_zhenji: '极甄姬',
            appshenfu: '神赋',
            appshenfu_info: '①一名角色受到伤害后，你获得1枚“神赋”标记。②准备阶段，你可以弃置所有“神赋”标记并亮出牌堆顶等量的牌，然后你可以依次使用其中的黑色牌。',
            appsiyuan: '思怨',
            appsiyuan_info: '当你受到伤害后，你可以选择一名其他角色，令伤害来源视为对其造成过1点伤害。',
            app_daqiao: '极大乔',
            appjielie: '节烈',
            appjielie_info: '出牌阶段限一次，你可以选择一名其他角色，然后你选择一项：①令其选择是否使用一张牌，若其使用了红色的【杀】，你失去1点体力且本回合可以继续发动〖节烈〗；②你下次发动〖相知〗时，令该角色获得相同的效果。',
            appxiangzhi: '相知',
            appxiangzhi_info: '出牌阶段限一次，<br>平：你可以摸一张牌。<br>仄：你可以回复1点体力。<br>转韵：你发动〖节烈〗结算完成后。',
            app_xiaoqiao: '极小乔',
            apptongxin: '同心',
            apptongxin_info: '出牌阶段限一次，<br>平：出牌阶段限一次，你可以令一名其他角色交给你一张手牌，然后若其手牌数不大于你，其摸一张牌。<br>仄：出牌阶段限一次，你可以交给一名其他角色一张手牌，然后若其手牌数不小于你，你对其造成1点伤害。<br>转韵：你于出牌阶段使用本回合未使用过的类型的牌。',
            appzhaoyan: '昭颜',
            appzhaoyan_info: '每回合限一次，当你成为其他角色使用牌的目标后，若其手牌数大于你，你摸一张牌。',
            app_machao: '极马超',
            appqipao: '弃袍',
            appqipao_info: '当你使用【杀】指定目标后，你可以令其选择一项：①弃置其装备区所有牌（至少一张）；②本回合非锁定技失效且不能响应此牌。',
            appzhuixi: '追袭',
            appzhuixi_info: '①结束阶段，若场上所有其他角色均在你的攻击范围内，你可以视为使用一张【杀】。②你与装备区没有坐骑牌的角色的距离视为1。',
            app_wangrong: "王戎",
            appjianlin: "俭吝",
            appjianlin_info: "每回合结束后，若本回合你有基本牌因使用、打出或弃置而进入弃牌堆，则你可以选择其中一张获得之。",
            appsixiao: "死孝",
            appsixiao_info: "锁定技，游戏开始时，你选择一名其他角色。每回合限一次，当该角色需要使用或打出除【无懈可击】外的牌时，其可以观看你的手牌并可以使用或打出其中一张牌，然后你摸一张牌。",
            app_lusu: '极鲁肃',
            applvyuan: '虑远',
            applvyuan_info: '结束阶段，你可以弃置任意张牌并摸等量的牌。若你弃置的牌数大于1，且颜色相同，则直到你的下个回合开始，当你失去与弃置牌颜色不同的牌时，你摸一张牌。',
            apphezong: '合纵',
            apphezong_info: '一轮游戏开始时，你可以选择两名角色。若如此做，直到下一轮游戏开始：①当这些角色使用指定除对方外的唯一目标的【杀】结算完毕后，除非另一名角色对相同目标使用一张【杀】，否则交给其一张牌；②当这些角色成为使用者不为对方的唯一目标的【杀】时，除非另一名角色交给其一张【闪】，否则其也成为此牌的额外目标。',
            app_caiwenji: '极蔡文姬',
            appbeijia: '悲笳',
            appbeijia_info: '韵律技，每回合限一次，<br>平：你可以将一张点数大于你上一张使用的牌当做任意普通锦囊牌使用。<br>仄：你可以将一张点数小于你上一张使用的牌当做任意基本牌使用。<br>转韵：出牌阶段，使用一张点数等于你上一张使用的牌。',
            appsifu: '思赋',
            appsifu_info: '出牌阶段限一次，你可以随机从牌堆中获得你本回合使用过的和本回合你未使用过的点数的牌各一张。',
            app_xunyu: '极荀彧',
            appwangzuo: '王佐',
            appwangzuo_info: '每回合限一次，你的摸牌/出牌/判定阶段开始前，你可以跳过此阶段并令一名其他角色执行之。',
            appjuxian: '举贤',
            appjuxian_info: '你的回合内，其他角色因使用/打出/弃置的牌进入弃牌堆后，你获得之。',
            appxianshi: '先识',
            appxianshi_info: '一名角色的摸牌阶段开始时，你可以观看牌堆顶三张牌并用任意张手牌替换其中等量的牌。',
            app_guanyu: '极关羽',
            appyihan: '翊汉',
            appyihan_info: '出牌阶段限一次，你可以展示一名其他角色的一张手牌，然后令其选择一项：1.交给你展示牌；2.你视为对其使用一张无次数限制的【杀】。',
            appgywuwei: '武威',
            appgywuwei_info: '奋武技，出牌阶段，你可以弃置X+1张牌并弃置一名角色的等量张牌（X为你本阶段发动〖武威〗的次数）。若你以此法弃置的牌的点数之和不大于其因此被弃置的牌的点数之和，你对其造成1点雷电伤害。',
            app_sunquan: '极孙权',
            appzongxi: '纵阋',
            appzongxi_info: '①出牌阶段限一次。你可以将至多三张牌以任意顺序置于牌堆顶，然后令X名角色进行共同拼点（X为你以此法置于牌堆顶的牌数+1）。赢的角色摸两张牌。②共同拼点结束后，你获得其他角色的拼点牌。',
            appluheng: '戮衡',
            appluheng_info: '结束阶段，若你本回合发动过〖纵阋〗，你可以视为对一名本回合参与过共同拼点且其中手牌数最多的其他角色使用一张【杀】。',
            app_zhouyu: '极周瑜',
            appyingrui: '英锐',
            appyingrui_info: '摸牌阶段结束时或当你杀死一名角色后，你获得4点谋略值。',
            appfenli: '焚离',
            appfenli_info: '出牌阶段限一次。你可以消耗2点谋略值并弃置至多两名座位连续的角色一张牌。若以此弃置的牌颜色相同，你可以消耗2点谋略值对这些角色造成1点火焰伤害。',

            app_zhulinqixian: '竹林七贤',
            app_dengfengzaoji: '登峰造极',
            app_wu: '登峰造极·武',
            app_zhi: '登峰造极·智',
            app_quan: '登峰造极·权',
            app_cai: '登峰造极·才',
        },
"skill": {
            appyingrui: {
                audio: 2,
                trigger: {
                    player: 'phaseDrawEnd',
                    source: 'dieAfter',
                },
                forced: true,
                locked: false,
                content: function () {
                    player.addMoulue(4);
                },
            },
            appfenli: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    if (player.countMoulue() < 2) return false;
                    return game.hasPlayer(current => get.info('appfenli').filterTarget(null, player, current));
                },
                selectTarget: [1, 2],
                complexSelect: true,
                complexTarget: true,
                filterTarget(card, player, target) {
                    var selected = ui.selected.targets;
                    if (!target.countDiscardableCards(player, 'he')) return false;
                    if (!selected.length) return true;
                    if (selected[0].getNext() == target || selected[0].getPrevious() == target) return true;
                    return false;
                },
                multitarget: true,
                multiline: true,
                content: function () {
                    'step 0'
                    player.removeMoulue(2);
                    var targets = event.targets.sortBySeat();
                    event.targets = targets;
                    for (var target of targets) player.discardPlayerCard(target, 'he', true);
                    'step 1'
                    var cards = [];
                    game.getGlobalHistory('cardMove', function (evt) {
                        if (evt.player && evt.hs && evt.type == 'discard' && evt.getParent(3) == event) {
                            for (var i of evt.hs) {
                                cards.add(i);
                            }
                        }
                    });
                    var list = [];
                    for (var i = 0; i < cards.length; i++) {
                        list.add(get.color(cards[i]));
                    }
                    if (player.countMoulue() > 1 && list.length == 1) {
                        var effect = event.targets.reduce((sum, i) => sum + get.damageEffect(i, player, player, 'fire'), 0);
                        player.chooseBool(`是否再消耗2点谋略值，对${get.translation(event.targets)}各造成1点伤害`).set('choice', effect > 0);
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (result.bool) {
                        player.removeMoulue(2);
                        for (var target of event.targets) target.damage('fire');
                    }
                },
                ai: {
                    order: 7,
                    result: {
                        player(player, target) {
                            return get.effect(target, {
                                name: 'guohe_copy2'
                            }, player, player);
                        },
                    },
                },
            },
            appzongxi: {
                audio: 2,
                enable: 'phaseUse',
                filterCard: true,
                selectCard: [1, 3],
                complexCard: true,
                discard: false,
                loseTo: 'cardPile',
                insert: true,
                visible: true,
                delay: false,
                position: 'he',
                usable: 1,
                check: function (card) {
                    var player = get.player();
                    var num = Math.min(3, game.countPlayer(current => game.hasPlayer(currentx => current.canCompare(currentx)) && get.attitude(player, current) <= 0));
                    if (ui.selected.cards.length >= num) return 0;
                    return 13 - get.number(card);
                },
                content: function () {
                    'step 0'
                    player.$throw(cards.length);
                    var next = player.chooseToMove();
                    next.set('list', [
                        ['牌堆顶', cards],
                    ]);
                    next.set('prompt', '纵阋：将这些牌置于牌堆顶');
                    next.set('processAI', function (list) {
                        var cards = list[0][1],
                            player = _status.event.player;
                        var target = player.next;
                        var att = get.sgn(get.attitude(player, target));
                        var top = [];
                        var judges = target.getCards('j');
                        var stopped = false;
                        if (player != target || !target.hasWuxie()) {
                            for (var i = 0; i < judges.length; i++) {
                                var judge = get.judge(judges[i]);
                                cards.sort(function (a, b) {
                                    return (judge(b) - judge(a)) * att;
                                });
                                if (judge(cards[0]) * att < 0) {
                                    stopped = true;
                                    break;
                                } else {
                                    top.unshift(cards.shift());
                                }
                            }
                        }
                        var bottom;
                        if (!stopped) {
                            cards.sort(function (a, b) {
                                return (get.value(b, player) - get.value(a, player)) * att;
                            });
                            while (cards.length) {
                                if ((get.value(cards[0], player) <= 5) == (att > 0)) break;
                                top.unshift(cards.shift());
                            }
                        }
                        return [top];
                    });
                    'step 1'
                    var top = result.moved[0];
                    top.reverse();
                    for (var i = 0; i < top.length; i++) {
                        top[i].fix();
                        ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
                    }
                    player.popup(get.cnNumber(top.length) + '上');
                    game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
                    game.updateRoundNumber();
                    game.delayx();
                    if (!game.hasPlayer(current => game.hasPlayer(currentx => current.canCompare(currentx)))) return;
                    player.chooseTarget(`选择至多${get.cnNumber(top.length + 1)}名角色进行共同拼点`, [2, top.length + 1], true, (card, player, target) => {
                        if (!ui.selected.targets.length) return game.hasPlayer(currentx => target.canCompare(currentx));
                        return target != player && ui.selected.targets[0].canCompare(target);
                    }).set('ai', target => {
                        const player = get.player();
                        let att = get.attitude(player, target);
                        if (target.hasSkillTag('noh')) att /= 3;
                        return (-att + 0.1) / Math.sqrt(target.countCards('h'));
                    }).set('targetprompt', ['拼点目标']).set('complexTarget', true);
                    'step 2'
                    if (result.bool) {
                        var targets = result.targets.sortBySeat();
                        for (var i of targets) i.addTempSkill('appzongxi_air');
                        event.targets = targets;
                        player.logSkill('appzongxi', targets);
                    } else event.finish();
                    'step 3'
                    player.chooseToCompare(targets, function (card) {
                        return get.number(card);
                    }).setContent(lib.skill.twchaofeng.chooseToCompareMeanwhile);
                    'step 4'
                    if (result.winner) {
                        result.winner.draw(2);
                    } else event.finish();
                },
                group: 'appzongxi_sub',
                subSkill: {
                    air: {
                        charlotte: true,
                    },
                    sub: {
                        forced: true,
                        trigger: { player: 'chooseToCompareAfter' },
                        filter: function (event, player) {
                            return event.getParent().name == 'appzongxi' && event.lose_list;
                        },
                        content: function () {
                            var list = [];
                            for (var i of trigger.lose_list) {
                                if (i[0] != player) {
                                    list.push(i[1][0]);
                                }
                            }
                            player.gain(list, 'gain2');
                        }
                    }
                },
                ai: {
                    order: 5,
                    result: {
                        player: 1
                    },
                },
            },
            appluheng: {
                audio: 2,
                trigger: {
                    player: 'phaseJieshuBegin'
                },
                filter: function (event, player) {
                    return game.hasPlayer(function (current) {
                        return current.hasSkill('appzongxi_air');
                    });
                },
                direct: true,
                content: function () {
                    'step 0'
                    var next = player.chooseTarget().set('ai', function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player)
                    });
                    next.set('prompt', '选择视为对一名除你外本回合参与过共同拼点且手牌数最多的其他角色使用一张【杀】');
                    next.set('filterTarget', function (card, player, target) {
                        return player != target && target.hasSkill('appzongxi_air') && !game.hasPlayer(function (current) {
                            return current != player && current.countCards('h') > target.countCards('h');
                        });
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.line(target);
                        if (player.canUse('sha', target, false)) {
                            player.useCard({
                                name: 'sha',
                                isCard: true
                            }, target, false);
                        }
                    }
                },
                ai: {
                    combo: 'appzongxi',
                }
            },
            appyihan: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return game.hasPlayer(current => get.info('appyihan').filterTarget(null, player, current));
                },
                filterTarget(card, player, target) {
                    return target.countCards('h') && target != player;
                },
                content: function () {
                    "step 0"
                    player.choosePlayerCard(target, true, 'h');
                    "step 1"
                    var cards = result.cards;
                    event.cards = cards;
                    player.showCards(cards, get.translation(player) + '对' + get.translation(target) + '发动了【翊汉】');
                    target.chooseControl().set('choiceList', [`交给${get.translation(player)}${get.translation(cards)}`, `令${get.translation(player)}视为对你使用一张无次数限制的【杀】`]).set('ai', () => {
                        const player = get.player(),
                            target = _status.event.getParent().player;
                        const card = _status.event.cards[0];
                        if (get.effect(player, {
                            name: 'sha'
                        }, target, player) > 0) return 1;
                        if (player.getEquip('bagua') || player.getEquip('tengjia')) return 1;
                        return get.value(card, player) > 7 ? 1 : 0;
                    }).set('cards', cards);
                    "step 2"
                    if (result.index == 0) {
                        target.give(event.cards, player);
                    } else if (player.canUse('sha', target, false)) {
                        player.useCard({
                            name: 'sha',
                            isCard: true
                        }, target, false);
                    }
                },
                ai: {
                    order: 8,
                    result: {
                        target(player, target) {
                            return -1;
                        }
                    }
                }
            },
            appgywuwei: {
                audio: 2,
                enable: 'phaseUse',
                filter(event, player) {
                    var num = 1 + (player.getStat('skill').appgywuwei || 0);
                    if (num > player.countCards('he', card => lib.filter.cardDiscardable(card, player)) || num > player.countMark("appgywuwei") + 1) return false;
                    return game.hasPlayer(current => get.info('appgywuwei').filterTarget(null, player, current));
                },
                filterTarget(card, player, target) {
                    return target.countDiscardableCards(player, 'he');
                },
                filterCard: lib.filter.cardDiscardable,
                selectCard() {
                    return 1 + (get.player().getStat('skill').appgywuwei || 0);
                },
                position: 'he',
                check(card) {
                    return 7.5 - get.value(card);
                },
                marktext: '奋武',
                intro: {
                    content: 'mark'
                },
                getLimit: 5,
                group: ['appgywuwei_1', 'appgywuwei_2'],
                content(event, trigger, player) {
                    'step 0'
                    var numx = 0;
                    for (var i of cards) numx += get.number(i, player);
                    event.num = numx;
                    player.discardPlayerCard(target, 'he', cards.length, true);
                    'step 1'
                    var numx = 0;
                    for (var i of result.cards) numx += get.number(i, player);
                    if (numx >= num) target.damage('thunder');
                },
                subSkill: {
                    1: {
                        audio: 2,
                        trigger: {
                            player: 'damageEnd',
                            source: 'damageSource',
                        },
                        filter: function (event, player) {
                            return player.countMark("appgywuwei") + 1 < get.info("appgywuwei").getLimit;
                        },
                        forced: true,
                        locked: false,
                        content: function () {
                            player.addMark("appgywuwei", 1);
                        },
                    },
                    2: {
                        trigger: {
                            global: 'roundFinish',
                        },
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            return player.hasMark('appgywuwei');
                        },
                        content: function () {
                            player.removeMark('appgywuwei', player.countMark('appgywuwei'));
                        }
                    },
                },
                ai: {
                    order: 10,
                    result: {
                        player(player, target) {
                            return get.effect(target, {
                                name: 'guohe_copy2'
                            }, player, player);
                        },
                    },
                },
            },
            appwangzuo: {
                audio: 2,
                trigger: { player: ['phaseDrawBefore', 'phaseUseBefore', 'phaseDiscardBefore'] },
                usable: 1,
                direct: true,
                content: function () {
                    'step 0'
                    const phaseTranslation = {
                        'phaseDraw': '摸牌阶段',
                        'phaseUse': '出牌阶段',
                        'phaseDiscard': '弃牌阶段'
                    };
                    player.chooseTarget('跳过' + phaseTranslation[trigger.name] + '并令一名其他角色执行之', lib.filter.notMe).setHiddenSkill('appwangzuo');
                    'step 1'
                    if (result.bool) {
                        trigger.cancel();
                        var target = result.targets[0];
                        player.logSkill('appwangzuo', target);
                        var phaseFunc = {
                            'phaseDraw': 'phaseDraw',
                            'phaseUse': 'phaseUse',
                            'phaseDiscard': 'phaseDiscard'
                        }[trigger.name];
                        var next = target[phaseFunc]();
                        event.next.remove(next);
                        trigger.getParent().next.push(next);
                    }
                    else player.storage.counttrigger.appwangzuo--;
                },
            },
            appjuxian: {
                audio: 2,
                trigger: { global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter'] },
                filter(event, player) {
                    if (player !== _status.currentPhase) return false;
                    if (event.name.indexOf('lose') == 0) {
                        if (event.type != 'discard') return false;
                        let players = game.players.slice().concat(game.dead);
                        players.remove(player);
                        return players.reduce((list, target) => {
                            const evt = event.getl(target);
                            if (evt && evt.cards2 && evt.cards2.length) {
                                return list.addArray(evt.cards2);
                            }
                            return list;
                        }, []).length > 0;
                    }
                    const evt = event.getParent();
                    if (evt.name != 'orderingDiscard') return false;
                    const evtx = (evt.relatedEvent || evt.getParent());
                    if (evtx.player == player) return false;
                    const history = evtx.player.getHistory('useCard').concat(evtx.player.getHistory('respond'));
                    return history.some(evtxx => evtx.getParent() == (evtxx.relatedEvent || evtxx.getParent()));
                },
                forced: true,
                locked: false,
                content() {
                    let cards;
                    if (trigger.name == 'cardsDiscard') cards = trigger.cards.filterInD('d');
                    else {
                        let players = game.players.slice().concat(game.dead);
                        players.remove(player);
                        cards = players.reduce((list, target) => {
                            const evt = trigger.getl(target);
                            if (evt && evt.cards2 && evt.cards2.length) {
                                return list.addArray(evt.cards2);
                            }
                            return list;
                        }, []).filterInD('d');
                    }
                    player.gain(cards, 'gain2');
                },
            },
            appxianshi: {
                audio: 2,
                trigger: { global: 'phaseDrawBegin' },
                filter(event, player) {
                    return player.countCards('h');
                },
                logTarget: 'player',
                frequent: true,
                content: function () {
                    'step 0'
                    var cards = get.cards(3);
                    event.cards2 = cards;
                    game.cardsGotoOrdering(cards);
                    var next = player.chooseToMove('先识：将三张牌置于牌堆顶');
                    var list = [['牌堆顶', cards]], hs = player.getCards('h');
                    if (hs.length) {
                        list.push(['手牌', hs]);
                        next.set('filterMove', function (from, to) {
                            return typeof to != 'number';
                        });
                    }
                    next.set('list', list);
                    next.set('processAI', function (list) {
                        var allcards = list[0][1].concat(list[1][1]), canchoose = allcards.slice(0), cards = [];
                        var player = _status.event.player;
                        var getv = function (button) {
                            if (button.name == 'sha' && allcards.filter(function (card) {
                                return card.name == 'sha' && !cards.filter(function () {
                                    return button == card;
                                }).length;
                            }).length > player.getCardUsable({ name: 'sha' })) return 10;
                            return -player.getUseValue(button, player);
                        };
                        while (cards.length < 3) {
                            canchoose.sort(function (a, b) {
                                return getv(b) - getv(a);
                            });
                            cards.push(canchoose.shift());
                        }
                        return [cards, canchoose];
                    })
                    'step 1'
                    if (result.bool) {
                        event.forceDie = true;
                        var cards = result.moved[0];
                        event.cards = cards;
                        var hs = player.getCards('h');
                        var lose = [], gain = event.cards2;
                        for (var i of cards) {
                            if (hs.contains(i)) lose.push(i);
                            else gain.remove(i);
                        }
                        if (lose.length) player.lose(lose, ui.cardPile);
                        if (gain.length) player.gain(gain, 'draw');
                    }
                    else event.finish();
                    'step 2'
                    for (var i = cards.length - 1; i >= 0; i--) {
                        var card = cards[i];
                        if (!(('hejsdx').includes(get.position(card, true)))) {
                            card.fix();
                            ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                        }
                    }
                    game.updateRoundNumber();
                },
            },
            appbeijia: {
                audio: 2,
                mark: true,
                locked: false,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content: function (storage, player, skill) {
                        if (player.storage.appbeijia == true) return '每回合限一次，你可以将一张点数小于你上一张使用的牌当做任意基本牌使用。';
                        return '每回合限一次，你可以将一张点数大于你上一张使用的牌当做任意普通锦囊牌使用。';
                    },
                },
                group: ["appbeijia_1", "appbeijia_2", "appbeijia_3"],
                subSkill: {
                    used: { charlotte: true },
                    1: {
                        audio: 2,
                        enable: ['chooseToUse', 'chooseToRespond'],
                        filter: function (event, player) {
                            if (!player.countCards('hse') || player.hasSkill('appbeijia_used') || !player.storage.appbeijia2) return false;

                            var cardType = player.storage.appbeijia ? 'basic' : 'trick';
                            for (var i of lib.inpile) {
                                var type = get.type(i);
                                if (type === cardType && event.filterCard({ name: i }, player, event)) return true;
                            }
                            return false;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [];
                                for (var i = 0; i < lib.inpile.length; i++) {
                                    var name = lib.inpile[i];
                                    if (get.type(name) == 'trick' && !player.storage.appbeijia && event.filterCard({ name: name }, player, event)) list.push(['锦囊', '', name]);
                                    else if (name == 'sha') {
                                        if (player.storage.appbeijia && event.filterCard({ name: name }, player, event)) list.push(['基本', '', 'sha']);
                                        for (var j of lib.inpile_nature) {
                                            if (player.storage.appbeijia && event.filterCard({ name: name, nature: j }, player, event)) list.push(['基本', '', 'sha', j]);
                                        }
                                    }
                                    else if (get.type(name) == 'basic' && player.storage.appbeijia && event.filterCard({ name: name }, player, event)) list.push(['基本', '', name]);
                                }
                                return ui.create.dialog('悲笳', [list, 'vcard']);
                            },
                            filter: function (button, player) {
                                return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
                            },
                            check: function (button) {
                                if (_status.event.getParent().type != 'phase') return 1;
                                var player = _status.event.player;
                                if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].contains(button.link[2])) return 0;
                                return player.getUseValue({
                                    name: button.link[2],
                                    nature: button.link[3],
                                });
                            },
                            backup: function (links, player) {
                                return {
                                    filterCard: function (card, player) {
                                        var num = 0;
                                        for (var i = 0; i < ui.selected.cards.length; i++) {
                                            num += get.number(ui.selected.cards[i]);
                                        }
                                        return player.storage.appbeijia ? get.number(card) + num < player.storage.appbeijia2 : get.number(card) + num > player.storage.appbeijia2;
                                    },
                                    selectCard: 1,
                                    audio: 'appbeijia',
                                    popname: true,
                                    complexCard: true,
                                    check: function (card) {
                                        var num = 0;
                                        for (var i = 0; i < ui.selected.cards.length; i++) {
                                            num += get.number(ui.selected.cards[i]);
                                        }
                                        if (num + get.number(card) == 13) return 5.5 - get.value(card);
                                        if (ui.selected.cards.length == 0) {
                                            var cards = _status.event.player.getCards('h');
                                            for (var i = 0; i < cards.length; i++) {
                                                for (var j = i + 1; j < cards.length; j++) {
                                                    if (get.number(cards[i]) + get.number(cards[j]) == 13) {
                                                        if (cards[i] == card || cards[j] == card) return 6 - get.value(card);
                                                    }
                                                }
                                            }
                                        }
                                        return 0;
                                    },
                                    position: 'hes',
                                    viewAs: { name: links[0][2], nature: links[0][3] },
                                    precontent: function () {
                                        player.addTempSkill('appbeijia_used');
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                return player.storage.appbeijia ? '将一张点数小于你上一张使用的牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用' : '将一张点数大于你上一张使用的牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                            }
                        },
                        hiddenCard: function (player, name) {
                            if (!lib.inpile.contains(name)) return false;
                            var type = get.type(name);
                            return player.countCards('she') > 0 && !player.hasSkill('appbeijia_used');
                        },
                        ai: {
                            fireAttack: true,
                            respondSha: true,
                            respondShan: true,
                            skillTagFilter: function (player) {
                                if (!player.countCards('hse') || player.hasSkill('appbeijia_used')) return false;
                            },
                            order: 1,
                            result: {
                                player: function (player) {
                                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                                    return 1;
                                },
                            },
                        },
                    },
                    2: {
                        trigger: { player: 'useCardAfter' },
                        forced: true,
                        silent: true,
                        init: function (player) {
                            player.storage.appbeijia2 = 0;
                        },
                        filter: function (event, player) {
                            return typeof get.number(event.card) == 'number';
                        },
                        content: function () {
                            player.storage.appbeijia2 = get.number(trigger.card);
                            player.markSkill('appbeijia');
                        },
                    },
                    3: {
                        trigger: { player: 'useCard' },
                        forced: true,
                        silent: true,
                        filter: function (event, player) {
                            var num1 = get.number(event.card), num2 = player.storage.appbeijia2;
                            return typeof num1 == 'number' && typeof num2 == 'number' && num2 == num1;
                        },
                        content: function () {
                            player.changeZhuanhuanji('appbeijia');
                            player.removeSkill('appbeijia_used');
                            game.log(player, '转换了', '#g【悲笳】', '的韵律');
                        },
                    },
                },
            },
            appsifu: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                filter: function (event, player) {
                    var list = [];
                    for (var i of player.getHistory('useCard', e => {
                        return get.number(e.card) != null;
                    })) {
                        list.add(get.number(i.card));
                    }
                    return list.length != 0 && list.length != 13;
                },
                content: function () {
                    'step 0'
                    var list = [];
                    for (var i of player.getHistory('useCard', e => {
                        return get.number(e.card) != null;
                    })) {
                        list.add(get.number(i.card));
                    }
                    if (list.length == 0) event.finish();
                    else {
                        var card = get.cardPile(function (card) {
                            return list.contains(card.number);
                        });
                        var card2 = get.cardPile(function (card) {
                            return !list.contains(card.number);
                        });
                        if (card || card2) player.gain([card, card2], 'gain2');
                        else event.finish();
                    }
                    'step 1'
                    game.updateRoundNumber();
                },
                mark: true,
                intro: {
                    name: '赋',
                    mark: function (dialog, storage, player) {
                        dialog.content.style['overflow-x'] = 'visible';
                        var list = storage;
                        if (!player.hasHistory('useCard', e => {
                            return get.number(e.card) != null;
                        })) return '本回合没有使用带有点数的牌';
                        var list = [];
                        for (var i of player.getHistory('useCard', e => {
                            return get.number(e.card) != null;
                        })) {
                            list.add(get.number(i.card));
                        }
                        var core = document.createElement('div');
                        var centerX = -10, centerY = 80, radius = 80;
                        var fulllist = ['Ａ', '２', '３', '４', '５', '６', '７', '８', '９', '10', 'Ｊ', 'Ｑ', 'Ｋ'];;
                        var radian = Math.PI * 2 / fulllist.length;
                        for (var i = 0; i < fulllist.length; i++) {
                            var td = document.createElement('div');
                            var color = '';
                            if (list.contains(i + 1)) color = ' class="yellowtext"';
                            else color = ' class="greentext"';
                            td.innerHTML = '<span' + color + '>[' + fulllist[i] + ']</span>';
                            td.style.position = 'absolute';
                            core.appendChild(td);
                            td.style.left = (centerX + radius * Math.sin(radian * i)) + 'px';
                            td.style.top = (centerY - radius * Math.cos(radian * i)) + 'px';
                        }
                        dialog.content.appendChild(core);
                    },
                },
            },
            applvyuan: {
                audio: 2,
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    return player.hasCard(card => _status.connectMode || lib.filter.cardDiscardable(card, player), 'he');
                },
                popup: false,
                content: function () {
                    'step 0'
                    player.chooseToDiscard('he', [1, Infinity]).set('logSkill', 'applvyuan');

                    'step 1'
                    if (result.bool) {
                        const cards = result.cards;
                        player.draw(cards.length);

                        'step 2'
                        var colors = [get.color(cards[0], player)];
                        for (var i = 1; i < cards.length; i++) {
                            if (get.color(cards[i], player) != colors[0]) return;
                        }
                        if (cards.length <= 1) return;
                        player.addTempSkill('applvyuan_effect', { player: 'phaseBegin' });
                        player.markAuto('applvyuan_effect', [colors[0]]);
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: {
                            markcount: () => 0,
                            content(storage) {
                                if (storage.length == 1) return '失去一张非' + get.translation(storage) + '牌时，摸一张牌';
                                return '失去一张牌时，摸一张牌';
                            },
                        },
                        trigger: {
                            player: 'loseAfter',
                            global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                        },
                        filter(event, player) {
                            const evt = event.getl(player), storage = player.getStorage('applvyuan_effect');
                            return evt && evt.player == player && evt.cards2 && evt.cards2.some(card => storage.length != 1 || get.color(card, player) != storage[0]);
                        },
                        forced: true,
                        content() {
                            const evt = trigger.getl(player), storage = player.getStorage('applvyuan_effect');
                            player.draw(evt.cards2.filter(card => storage.length != 1 || get.color(card, player) != storage[0]).length);
                        },
                    }
                }
            },
            apphezong: {
                audio: 2,
                trigger: { global: 'roundStart' },
                filter(event, player) {
                    return game.countPlayer() > 1;
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt2('apphezong'), 2).set('logSkill', 'apphezong');

                    'step 1'
                    if (result.bool) {
                        const targets = result.targets.sortBySeat();
                        for (let i = 0; i < targets.length; i++) {
                            const target = targets[i];
                            const friend = targets[1 - i];
                            const skill = 'apphezong_mark_' + friend.playerid;

                            if (!lib.skill[skill]) {
                                game.broadcastAll(skill => {
                                    lib.skill[skill] = { charlotte: true };
                                    lib.translate[skill] = '合纵';
                                }, skill);
                            }

                            target.addSkill(skill);
                            target.markSkillCharacter(skill, friend, '合纵', '已与' + get.translation(friend) + '组成合纵关系');
                            targets[0].addTempSkill('apphezong_effect', 'roundStart');
                            targets[1].addTempSkill('apphezong_effect', 'roundStart');
                            targets[0].addTempSkill('apphezong_qiuyuan', 'roundStart');
                            targets[1].addTempSkill('apphezong_qiuyuan', 'roundStart');
                            targets[0].markAuto('apphezong_effect', [targets[1]]);
                            targets[0].markAuto('apphezong_qiuyuan', [targets[1]]);
                            targets[1].markAuto('apphezong_effect', [targets[0]]);
                            targets[1].markAuto('apphezong_qiuyuan', [targets[0]]);
                        }
                    }
                },
                subSkill: {
                    mark: {
                        charlotte: true,
                        intro: { onunmark: true }
                    },
                    effect: {
                        charlotte: true,
                        onremove(player, skill) {
                            const targets = [player].concat(player.getStorage(skill));
                            delete player.storage[skill];
                            for (const i of targets) {
                                const skills = i.skills.slice().filter(hezong => hezong.startsWith('apphezong_mark_'));
                                if (skills.length) i.removeSkill(skills);
                            }
                        },
                        audio: 'apphezong',
                        trigger: { global: 'useCardAfter' },
                        filter(event, player, name) {
                            if (event.card.name != 'sha' || !event.targets || event.targets.length != 1) return false;
                            const list = [player].concat(player.getStorage('apphezong_effect'));
                            return event.getParent(2).name != 'apphezong_effect' && event.player != player && list.includes(event.player) && !list.includes(event.targets[0]) && event.targets[0].isIn();
                        },
                        forced: true,
                        popup: false,
                        content(event, trigger, player) {
                            'step 0'
                            player.chooseToUse(function (card, player, event) {
                                var name = get.name(card);
                                if (name != 'sha') return false;
                                return lib.filter.cardEnabled.apply(this, arguments);
                            }, '合纵：是否对' + get.translation(trigger.targets[0]) + '使用一张【杀】，或交给' + get.translation(trigger.player) + '一张牌').set('logSkill', 'apphezong').set('complexSelect', true).set('filterTarget', function (card, player, target) {
                                if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
                                return lib.filter.targetEnabled.apply(this, arguments);
                            }).set('sourcex', trigger.targets[0]).set('addCount', false);
                            'step 1'
                            if (!result.bool && player.countCards('he') > 0) {
                                player.chooseCard('he', '交给' + get.translation(trigger.player) + '一张牌', true);
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                player.give(result.cards, trigger.player);
                            }
                        }
                    },
                    qiuyuan: {
                        charlotte: true,
                        onremove(player, skill) {
                            const targets = [player].concat(player.getStorage(skill));
                            delete player.storage[skill];
                            for (const i of targets) {
                                const skills = i.skills.slice().filter(hezong => hezong.startsWith('apphezong_mark_'));
                                if (skills.length) i.removeSkill(skills);
                            }
                        },
                        audio: 'apphezong',
                        trigger: { global: 'useCardToTarget' },
                        direct: true,
                        filter(event, player, name) {
                            if (event.card.name != 'sha' || !event.targets || event.targets.length != 1) return false;
                            const list = [player].concat(player.getStorage('apphezong_qiuyuan'));
                            return list.includes(event.target) && !list.includes(event.player) && event.getParent(2).name != 'apphezong_qiuyuan' && event.target != player;
                        },
                        forced: true,
                        popup: false,
                        content: function () {
                            "step 0"

                            player.chooseCard({ name: 'shan' }, '交给' + get.translation(trigger.target) +
                                '一张闪，或成为此杀的额外目标').set('ai', function (card) {
                                    return get.attitude(target, _status.event.sourcex) >= 0 ? 1 : -1;
                                }).set('sourcex', event.target);
                            game.delay();
                            "step 1"
                            if (result.bool) {
                                player.give(result.cards, trigger.target);
                                game.delay();
                            }
                            else {
                                trigger.getParent().targets.add(player);
                                trigger.getParent().triggeredTargets1.push(player);
                                game.log(player, '成为了', trigger.card, '的额外目标');
                            }
                        }
                    }
                }
            },
            appjianlin: {
                audio: 2,
                trigger: {
                    global: "phaseAfter",
                },
                forced: true,
                filter: function (event, player) {
                    const cards = [];
                    game.getGlobalHistory("cardMove", evt => {
                        if (evt.name === "lose" && evt.position === ui.discardPile && evt.player === player) {
                            cards.addArray(evt.cards.filter(card => get.type(card) === "basic" && get.position(card) === "d"));
                        } else if (evt.name === "cardsDiscard") {
                            const evtx = evt.getParent();
                            if (evtx.name === "orderingDiscard") {
                                const evt2 = evtx.relatedEvent || evtx.getParent();
                                if (["useCard", "respond"].includes(evt2.name) && evt2.player === player) {
                                    cards.addArray(evt.cards.filter(card => get.type(card) === "basic" && get.position(card) === "d"));
                                }
                            }
                        }
                    });
                    return cards.length > 0;
                },
                content: function () {
                    "step 0"
                    const cards = [];
                    game.getGlobalHistory("cardMove", evt => {
                        if (evt.name === "lose" && evt.position === ui.discardPile && evt.player === player) {
                            cards.addArray(evt.cards.filter(card => get.type(card) === "basic" && get.position(card) === "d"));
                        } else if (evt.name === "cardsDiscard") {
                            const evtx = evt.getParent();
                            if (evtx.name === "orderingDiscard") {
                                const evt2 = evtx.relatedEvent || evtx.getParent();
                                if (["useCard", "respond"].includes(evt2.name) && evt2.player === player) {
                                    cards.addArray(evt.cards.filter(card => get.type(card) === "basic" && get.position(card) === "d"));
                                }
                            }
                        }
                    });
                    if (cards.length) {
                        player.chooseCardButton('选择要获得的一张基本牌', cards, 1).set('ai', button => get.value(button.link, player, 'raw'));
                    } else {
                        event.finish();
                    }
                    "step 1"
                    if (result.bool) {
                        player.logSkill('appjianlin');
                        player.gain(result.links, 'gain2', 'log');
                    }
                },
                ai: {
                    threaten: 1.3,
                    expose: 0.2
                }
            },
            appsixiao: {
                audio: 2,
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                locked: true,
                forced: true,
                filter(event, player) {
                    return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(current => current != player);
                },
                content: function () {
                    "step 0"
                    player.chooseTarget(true, lib.filter.notMe, "死孝：请选择一名角色当其孝子", "当该角色需要使用或打出除【无懈可击】外的牌时，其可以观看你的手牌并可以使用或打出其中一张牌，然后你摸一张牌")
                        .set("ai", target => {
                            return get.attitude(get.player(), target);
                        });
                    "step 1"
                    if (result.bool) {
                        var target = result.targets[0];
                        game.log(player, "成为了", target, "的孝子");
                        target.storage.appsixiao_use = player;
                        target.addSkill("appsixiao_use");
                    }
                },
                group: 'appsixiao_draw',
                subSkill: {
                    use: {
                        charlotte: true,
                        mark: "character",
                        intro: {
                            content: "当你需要使用或打出除【无懈可击】外的牌时，你可以观看$的手牌并可以使用或打出其中一张牌，然后$摸一张牌",
                        },
                        hiddenCard(player, name) {
                            if (name == "wuxie" || !lib.inpile.includes(name) || player.hasSkill("appsixiao_used", null, null, false)) return false;
                            const target = player.storage.appsixiao_use;
                            const cards = target.getCards("h");
                            for (var i of cards) {
                                if (get.name(i, target) == name) return true;
                            }
                            return false;
                        },
                        enable: ["chooseToUse", "chooseToRespond"],
                        filter(event, player) {
                            const target = player.storage.appsixiao_use;
                            const cards = target.getCards("h");
                            if (player.hasSkill("appsixiao_used", null, null, false)) return false;
                            return cards.some(i =>
                                event.filterCard(
                                    {
                                        name: get.name(i, target),
                                        nature: get.nature(i, target),
                                        isCard: true,
                                    },
                                    player,
                                    event
                                )
                            );
                        },
                        chooseButton: {
                            dialog(event, player) {
                                const target = player.storage.appsixiao_use;
                                const cards = target.getCards("h");
                                return ui.create.dialog("死孝", cards);
                            },
                            filter(button, player) {
                                const evt = _status.event.getParent();
                                const target = player.storage.appsixiao_use;
                                return evt.filterCard(
                                    {
                                        name: get.name(button.link, target),
                                        nature: get.nature(button.link, target),
                                        isCard: true,
                                    },
                                    player,
                                    evt
                                );
                            },
                            check(button) {
                                const player = get.player();
                                const evt = _status.event.getParent();
                                if (evt.dying) return get.attitude(player, evt.dying);
                                if (_status.event.getParent().type != "phase") return 1;
                                return player.getUseValue(get.autoViewAs(button.link), null, true);
                            },
                            backup(links, player) {
                                const target = player.storage.appsixiao_use;
                                return {
                                    viewAs: {
                                        name: get.name(links[0], target),
                                        nature: get.nature(links[0], target),
                                        isCard: true,
                                    },
                                    card: links[0],
                                    filterCard: () => false,
                                    selectCard: -1,
                                    log: false,
                                    precontent(event, trigger, player) {
                                        const card = lib.skill.appsixiao_use_backup.card,
                                            target = player.storage.appsixiao_use;
                                        event.result.card = card;
                                        event.result.cards = [card];
                                        player.addTempSkill("appsixiao_used");
                                    },
                                };
                            },
                            ai: {
                                hasSha: true,
                                hasShan: true,
                                skillTagFilter(player, tag) {
                                    const name = "s" + tag.slice(4);
                                    return lib.skill.appsixiao_use.hiddenCard(player, name);
                                },
                            },
                        },
                        ai: {
                            order: 8,
                            result: {
                                player: 1,
                            },
                        },
                    },
                    used: {},
                    draw: {
                        trigger: {
                            global: ["useCard", "respond"],
                        },
                        forced: true,
                        audio: 'appsixiao',
                        filter: function (event, player) {
                            return event.skill == "appsixiao_use_backup";
                        },
                        content: function () {
                            player.draw()
                        }
                    }
                },
            },
            appqipao: {
                audio: 2,
                trigger: { player: 'useCardToPlayered' },
                filter: function (event, player) {
                    return event.card.name === 'sha';
                },
                check: function (event, player) {
                    return get.attitude(player, event.target) < 0;
                },
                logTarget: 'target',
                content: function () {
                    'step 0'
                    if (!trigger.target.countDiscardableCards(trigger.player, 'e')) {
                        event._result = { index: 1 };
                    } else {
                        trigger.target.chooseControl().set('choiceList', [
                            '弃置装备区的所有牌',
                            '本回合非锁定技失效，且不能响应' + get.translation(trigger.card),
                        ]);
                    }
                    'step 1'
                    if (result.index === 0) {
                        trigger.target.discard(trigger.target.getCards('e'));
                    } else {
                        trigger.target.addTempSkill('fengyin');
                        trigger.getParent().directHit.add(trigger.target);
                    }
                },
                ai: {
                    directHit_ai: true,
                    skillTagFilter: function (player, tag, arg) {
                        if (!arg || !arg.card || arg.card.name !== 'sha' || !arg.target || arg.target.countDiscardableCards(arg.target, 'e')) return false;
                    },
                },
            },
            appzhuixi: {
                mod: {
                    globalFrom: function (from, to) {
                        if (!to.countCards('e', card => get.type(card) == 'equip3' || get.type(card) == 'equip4')) {
                            return -Infinity;
                        }
                    },
                },
                audio: 2,
                trigger: { player: 'phaseJieshuBegin' },
                filter: function (event, player) {
                    return player.hasUseTarget({ name: 'sha' }, false) &&
                        !game.hasPlayer(target => target != player && !player.inRange(target));
                },
                direct: true,
                locked: false,
                content: function () {
                    player.chooseUseTarget(
                        { name: 'sha' },
                        get.prompt('appzhuixi'),
                        '视为使用一张【杀】',
                        false
                    ).logSkill = 'appzhuixi';
                },
            },
            apptongxin: {
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content: function (storage, player) {
                        var str = '出牌阶段限一次，你可以令一名其他角色交给你一张手牌，然后若其手牌数不大于你，其摸一张牌。';
                        if (storage) str = '出牌阶段限一次，你可以交给一名其他角色一张手牌，然后若其手牌数不小于你，你对其造成1点伤害。';
                        return '<li>当前韵律：' + (storage ? '仄' : '平') + '<br><li>' + str;
                    },
                },
                group: 'apptongxin_zhuanyun',
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player) {
                    var yunlv = player.storage.apptongxin;
                    if (!yunlv && !game.hasPlayer(function (current) {
                        if (current == player) return false;
                        return current.countCards('h');
                    })) return false;
                    if (yunlv && !player.countCards('h')) return false;
                    return true;
                },
                filterTarget: function (card, player, target) {
                    var yunlv = player.storage.apptongxin;
                    if (target == player) return false;
                    return yunlv || target.countCards('h');
                },
                filterCard: function (card, player) {
                    return player.storage.apptongxin;
                },
                selectCard: function () {
                    var player = _status.event.player;
                    return player.storage.apptongxin ? 1 : -1;
                },
                check: function (card) {
                    return 7 - get.value(card);
                },
                discard: false,
                lose: false,
                delay: false,
                usable: 1,
                content: function () {
                    'step 0'
                    if (cards.length) {
                        target.gain(cards, player, 'giveAuto');
                        event.goto(3);
                    }
                    'step 1'
                    target.chooseCard('h', '同心：将一张手牌交给' + get.translation(player), true);
                    'step 2'
                    if (result.bool) player.gain(result.cards, target, 'giveAuto');
                    'step 3'
                    if (player.storage.apptongxin) {
                        if (target.countCards('h') >= player.countCards('h')) {
                            player.line(target);
                            target.damage();
                        }
                    }
                    else if (target.countCards('h') <= player.countCards('h')) target.draw();
                },
                ai: {
                    order: 7,
                    result: {
                        target: function (player, target) {
                            var yunlv = player.storage.apptongxin;
                            if (yunlv) {
                                if (player.countCards('h') - target.countCards('h') <= 2) return -1;
                                return 0;
                            }
                            else {
                                if (target.countCards('h') - player.countCards('h') > 2) return -3;
                                return get.sgn(get.attitude(player, target)) * (get.attitude(player, target) > 0 ? 2 : 1);
                            }
                        },
                    },
                },
                subSkill: {
                    zhuanyun: {
                        audio: 'apptongxin',
                        trigger: { player: 'useCard' },
                        filter: function (event, player) {
                            return player.isPhaseUsing() && !player.hasHistory('useCard', function (evt) {
                                return evt.card != event.card && get.type2(evt.card) == get.type2(event.card);
                            });
                        },
                        forced: true,
                        locked: false,
                        content: function () {
                            player.changeZhuanhuanji('apptongxin');
                            if (player.getStat('skill').apptongxin) delete player.getStat('skill').apptongxin;
                            game.log(player, '转换了', '#g【同心】', '的韵律');
                        },
                    },
                },
            },
            appzhaoyan: {
                audio: 2,
                trigger: { target: 'useCardToTargeted' },
                filter: function (event, player) {
                    return event.player.countCards('h') > player.countCards('h');
                },
                forced: true,
                locked: false,
                usable: 1,
                content: function () {
                    player.draw();
                },
            },
            appjielie: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                filterTarget: lib.filter.notMe,
                content: function () {
                    'step 0'
                    player.chooseControl().set('choiceList', [
                        '令' + get.translation(target) + '选择是否使用一张牌',
                        '下次发动【相知】的时候令' + get.translation(target) + '获得同样的效果'
                    ]).set('ai', function () {
                        if (target.hasCard(function (card) {
                            return target.getUseValue(card) > 0 && game.hasPlayer(function (current) {
                                return get.effect(current, card, target, player) > 0;
                            });
                        })) return 0;
                        return 1;
                    });
                    'step 1'
                    if (result.index == 1) {
                        player.addTempSkill('appjielie_targets', { player: 'appxiangzhiAfter' });
                        player.markAuto('appjielie_targets', [target]);
                        event.finish();
                    }
                    else target.chooseToUse({ prompt: '节烈：是否使用一张牌？' });
                    'step 2'
                    if (result.bool) {
                        var card = result.cards[0];
                        if (card.name == 'sha' && get.color(card, target) == 'red') {
                            player.loseHp();
                            delete player.getStat('skill').appjielie;
                        }
                    }
                },
                ai: {
                    order: 7,
                    result: {
                        target: function (player, target) {
                            if (player.hp + player.countCards('hs', { name: 'tao' }) < 2) return 0;
                            if (target.hasCard(function (card) {
                                return target.getUseValue(card) > 0 && game.hasPlayer(function (current) {
                                    return get.effect(current, card, target, player) > 0;
                                });
                            })) return 2;
                            return 1;
                        },
                    },
                },
                subSkill: {
                    targets: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        intro: { content: '下次发动【相知】时，令$也获得相同的效果' },
                    },
                },
            },
            appxiangzhi: {
                mark: true,
                marktext: '☯',
                intro: {
                    content: function (storage, player) {
                        var str = (storage ? '出牌阶段限一次，你可以回复1点体力。' : '出牌阶段限一次，你可以摸一张牌。');
                        return '<li>当前韵律：' + (storage ? '仄' : '平') + '<br><li>' + str;
                    },
                },
                group: 'appxiangzhi_zhuanyun',
                audio: 2,
                zhuanhuanji: true,
                enable: 'phaseUse',
                usable: 1,
                content: function () {
                    'step 0'
                    player[player.storage.appxiangzhi ? 'recover' : 'draw']();
                    'step 1'
                    var targets = player.getStorage('appjielie_targets').filter(i => i.isIn()).sortBySeat();
                    if (targets.length) {
                        targets.forEach(target => {
                            player.line(target);
                            target[player.storage.appxiangzhi ? 'recover' : 'draw']();
                        });
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        player: function (player, target) {
                            if (player.storage.appxiangzhi && player.isHealthy()) return 0;
                            return 1;
                        },
                    },
                },
                subSkill: {
                    zhuanyun: {
                        audio: 'appxiangzhi',
                        trigger: { player: 'useSkillAfter' },
                        filter: function (event, player) {
                            return event.skill == 'appjielie';
                        },
                        forced: true,
                        locked: false,
                        content: function () {
                            player.changeZhuanhuanji('appxiangzhi');
                            if (player.getStat('skill').appxiangzhi) delete player.getStat('skill').appxiangzhi;
                            game.log(player, '转换了', '#g【相知】', '的韵律');
                        },
                    },
                },
            },
            appshenfu: {
                audio: 2,
                trigger: {
                    player: 'phaseZhunbeiBegin',
                },
                filter: function (event, player) {
                    return player.hasMark('appshenfu');
                },
                check: function (event, player) {
                    return player.countMark('appshenfu') > 2;
                },
                content: function () {
                    var num = player.countMark('appshenfu');
                    player.removeMark('appshenfu', num);
                    var cards = get.cards(num);
                    player.showCards(cards, get.translation(player) + '发动了【神赋】');
                    var black = cards.filter(card => get.color(card) == 'black' && player.hasUseTarget(card));
                    if (!black.length) return;
                    while (black.length) {
                        var card = black.shift();
                        if (!player.hasUseTarget(card)) continue;
                        player.chooseUseTarget(card, true, false);
                        if (!black.length) break;
                    }
                },
                group: 'appshenfu_mark',
                subSkill: {
                    mark: {
                        trigger: {
                            global: 'damageEnd',
                        },
                        silent: true,
                        forced: true,
                        content: function () {
                            player.addMark('appshenfu', 1);
                        }
                    },
                },
                marktext: '赋',
                intro: {
                    name: '神赋',
                    content: 'mark',
                    onunmark: true,
                },
            },
            appsiyuan: {
                audio: 2,
                trigger: {
                    player: 'damageEnd',
                },
                filter: function (event, player) {
                    return event.source && event.source.isIn() && game.hasPlayer(current => current != player && current != event.source);
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt2('appsiyuan'), (card, player, target) => {
                        return target != player && target != trigger.source;
                    });
                    'step 1'
                    if (result.bool) {
                        result.targets[0].damage(trigger.source).setContent(lib.skill.guanzong.viewAsDamageContent);
                    }
                },
            },
            apptaoni: {
                audio: 2,
                marktext: '讨逆',
                intro: {
                    content: 'mark',
                    onunmark: true,
                },
                trigger: {
                    player: 'phaseUseBegin',
                },
                filter: function (event, player) {
                    return player.hp > 0;
                },
                content: function () {
                    'step 0'
                    var map = {}, list = [];
                    for (var i = 1; i <= player.hp; i++) {
                        var cn = get.cnNumber(i, true);
                        map[cn] = i;
                        list.push(cn);
                    }
                    list.push('cancel2');
                    event.map = map;
                    player.chooseControl(list).set('prompt', get.prompt2('apptaoni'));
                    'step 1'
                    if (result.control != 'cancel2') {
                        var num = event.map[result.control] || 1;
                        player.logSkill('apptaoni');
                        player.loseHp(num);
                        player.draw(num);
                        player.addTempSkill('apptaoni_huaizi');
                        player.chooseTarget([1, num], '是否令至多' + get.cnNumber(num) + '名其他角色各获得1枚「讨逆」标记？', lib.filter.notMe).set('ai', target => {
                            var att = get.attitude(player, target);
                            if (att >= 0) return 0;
                            if (att < 0 && target.hasMark('apptaoni')) return 0;
                            return -att;
                        });
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (result.bool) {
                        var targets = result.targets.sortBySeat();
                        player.line(targets);
                        for (var i of targets) {
                            i.addMark('apptaoni', 1);
                        }
                    }
                },
                subSkill: {
                    huaizi: {
                        mod: {
                            maxHandcardBase: function (player, num) {
                                return player.maxHp;
                            },
                        },
                    }
                },
            },
            apppingjiang: {
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player) {
                    return game.hasPlayer(current => get.info('apppingjiang').filterTarget(null, player, current)) && !player.hasSkill('apppingjiang_air');
                },
                filterTarget: function (card, player, target) {
                    return target.hasMark('apptaoni') && player.canUse({ name: 'juedou' }, target, false);
                },
                content: function () {
                    var juedou = get.autoViewAs({ name: 'juedou', isCard: true, storage: { apppingjiang: true } });
                    player.useCard(juedou, event.targets[0], false);
                },
                ai: {
                    order: 4,
                    result: {
                        player(player, target) {
                            return get.effect(target, { name: 'juedou' }, player, player);
                        }
                    },
                    combo: 'apptaoni',
                },
                group: 'apppingjiang_buff',
                subSkill: {
                    buff: {
                        trigger: {
                            player: 'juedouAfter',
                        },
                        filter: function (event, player) {
                            return event.card.storage && event.card.storage.apppingjiang;
                        },
                        charlotte: true,
                        forced: true,
                        silent: false,
                        content: function () {
                            if (trigger.turn == player) player.addTempSkill('apppingjiang_air');
                            else {
                                if (trigger.target.isIn() && trigger.target.hasMark('apptaoni')) trigger.target.removeMark('apptaoni');
                                player.addTempSkill('apppingjiang_wushuang');
                                player.addTempSkill('apppingjiang_jiaozi');
                            }
                        },
                    },
                    jiaozi: {
                        trigger: {
                            player: 'useCardToPlayered',
                            source: 'damageBegin1',
                        },
                        filter: function (event, player) {
                            return event.card && event.card.name == 'juedou';
                        },
                        forced: true,
                        logTarget: function (event, player) {
                            return event.name == 'useCard' ? event.target : event.player;
                        },
                        content: function () {
                            if (trigger.name == 'useCard') {
                                var id = trigger.target.playerid;
                                var idt = trigger.target.playerid;
                                var map = trigger.getParent().customArgs;
                                if (!map[idt]) map[idt] = {};
                                if (!map[idt].shaReq) map[idt].shaReq = {};
                                if (!map[idt].shaReq[id]) map[idt].shaReq[id] = 1;
                                map[idt].shaReq[id]++;
                            } else {
                                trigger.num++;
                            }
                        },
                        ai: {
                            directHit_ai: true,
                            skillTagFilter(player, tag, arg) {
                                if (arg.card.name != 'juedou' || Math.floor(arg.target.countCards('h', 'sha') / 2) > player.countCards('h', 'sha')) return false;
                            },
                        },
                    },
                    wushuang: {
                        audio: 2,
                        trigger: { player: 'useCardToPlayered', target: 'useCardToTargeted' },
                        forced: true,
                        logTarget: function (trigger, player) {
                            return player == trigger.player ? trigger.target : trigger.player;
                        },
                        filter: function (event, player) {
                            return event.card.name == 'juedou';
                        },
                        content: function () {
                            var id = (player == trigger.player ? trigger.target : trigger.player)['playerid'];
                            var idt = trigger.target.playerid;
                            var map = trigger.getParent().customArgs;
                            if (!map[idt]) map[idt] = {};
                            if (!map[idt].shaReq) map[idt].shaReq = {};
                            if (!map[idt].shaReq[id]) map[idt].shaReq[id] = 1;
                            map[idt].shaReq[id]++;
                        },
                        ai: {
                            directHit_ai: true,
                            skillTagFilter: function (player, tag, arg) {
                                if (arg.card.name != 'juedou' || Math.floor(arg.target.countCards('h', 'sha') / 2) > player.countCards('h', 'sha')) return false;
                            }
                        }
                    },
                    air: {},
                }
            },
            appdingye: {
                audio: 2,
                trigger: { player: 'phaseJieshuBegin' },
                forced: true,
                content: function () {
                    player.recover(Math.min(player.maxHp - player.hp, game.countPlayer(current => {
                        return current.getHistory('damage').length > 0;
                    })));
                }
            },
            //极袁绍
            appzunbei: {
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player) {
                    return !game.hasPlayer(target => target != player && !player.canCompare(target));
                },
                filterTarget: lib.filter.notMe,
                selectTarget: -1,
                usable: 1,
                multitarget: true,
                multiline: true,
                content: function () {
                    'step 0'
                    player.chooseToCompare(targets, function (card) {
                        return get.number(card);
                    }).setContent(lib.skill.twchaofeng.chooseToCompareMeanwhile);
                    'step 1'
                    if (!result.winner) {
                        delete player.getStat('skill').appzunbei;
                        return;
                    }

                    var targets = [player].addArray(event.targets).sortBySeat(player);
                    targets.remove(result.winner);
                    var card = { name: 'wanjian', isCard: true };
                    var targetsx = targets.filter(function (target) {
                        return result.winner.canUse(card, target, false);
                    });
                    if (targetsx.length) {
                        result.winner.useCard(card, targetsx, 'noai').set('addCount', false);
                    }

                    'step 2'
                    var num = game.countPlayer2(target =>
                        target.getHistory('damage', evt => evt.card && evt.card.name == 'wanjian').length
                    );
                    if (num) {
                        player.draw(num);
                    }
                },
                ai: {
                    order: 9,
                    result: { player: 1 },
                },
            },
            appmengshou: {
                getNum(player) {
                    return player.getHistory('sourceDamage').reduce((sum, evt) => sum + evt.num, 0);
                },
                audio: 2,
                trigger: { player: 'damageBegin4' },
                filter: function (event, player) {
                    var getNum = get.info('appmengshou').getNum;
                    return event.source && event.source != player && getNum(player) >= getNum(event.source) && !player.hasSkill("appmengshou_disable");
                },
                check: function (event, player) {
                    return get.damageEffect(player, event.source, player) <= 0;
                },
                logTarget: 'source',
                content() {
                    player.addTempSkill("appmengshou_disable", "roundStart");
                    trigger.cancel();
                },
                subSkill: {
                    disable: {
                        mark: true,
                        intro: {
                            content: "本轮已发动",
                        },
                        sub: true,
                        parentskill: "appmengshou",
                    },
                },
            },
            appdelu: {
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player) {
                    if (player.hasSkillTag('noCompareSource')) return false;
                    return game.hasPlayer(target => lib.skill.appdelu.filterTarget(null, player, target));
                },
                filterTarget: function (card, player, target) {
                    return player.canCompare(target) && target.hp <= player.hp;
                },
                usable: 1,
                selectTarget: [1, Infinity],
                multitarget: true,
                multiline: true,
                content: function () {
                    'step 0'
                    //player.draw();
                    player.addTempSkill('appdelu_compare');
                    'step 1'
                    player.chooseToCompare(targets, function (card) {
                        return get.number(card);
                    }).setContent(lib.skill.twchaofeng.chooseToCompareMeanwhile);
                    'step 2'
                    if (result.winner) {
                        var targetx = [player].addArray(targets).sortBySeat(player);
                        targetx.remove(result.winner);
                        for (var target of targetx) {
                            var cards = target.getGainableCards(result.winner, 'hej');
                            if (cards.length) result.winner.gain(cards.randomGet(), target, 'giveAuto');
                        }
                    }
                },
                ai: {
                    order: 7,
                    result: {
                        target: function (player, target) {
                            if (target.countCards('he') > 1) return -3;
                            return -1;
                        },
                    },
                },
                subSkill: {
                    compare: {
                        charlotte: true,
                        trigger: { player: 'compare' },
                        filter: function (event, player) {
                            return event.getParent().name == 'appdelu' && !event.iwhile;
                        },
                        forced: true,
                        popup: false,
                        content: function () {
                            var num = trigger.lose_list.length;
                            trigger.num1 += num;
                            if (trigger.num1 > 13) trigger.num1 = 13;
                            game.log(player, '的拼点牌点数+', num);
                        },
                    },
                },
            },
            appzhujiu: {
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player) {
                    if (!player.countCards('h')) return false;
                    return game.hasPlayer(target => lib.skill.appzhujiu.filterTarget(null, player, target));
                },
                filterTarget: function (card, player, target) {
                    return target != player && target.countCards('h');
                },
                usable: 1,
                content: function () {
                    'step 0'
                    var next = player.chooseCardOL([player, target], '煮酒：请选择要交换的牌', true).set('ai', card => -get.value(card)).set('source', player);
                    next.aiCard = function (target) {
                        var hs = target.getCards('h');
                        return { bool: true, cards: [hs.randomGet()] };
                    };
                    next._args.remove('glow_result');
                    'step 1'
                    var cards = [result[0].cards, result[1].cards];
                    event.cards = cards;
                    game.loseAsync({
                        player: player,
                        target: target,
                        cards1: result[0].cards,
                        cards2: result[1].cards,
                    }).setContent('swapHandcardsx');
                    'step 2'
                    game.loseAsync({
                        gain_list: [
                            [player, cards[1].filterInD()],
                            [target, cards[0].filterInD()]
                        ],
                    }).setContent('gaincardMultiple');
                    'step 3'
                    game.delayx();
                    'step 4'
                    var card1 = cards[0][0];
                    var card2 = cards[1][0];
                    if (get.color(card1, player) == get.color(card2, target)) player.recover();
                    else {
                        player.line(target);
                        target.damage();
                    }
                },
                ai: {
                    order: 9,
                    result: { target: -1 },
                },
            },
            apphuhou: {
                audio: 2,
                trigger: { player: 'juedouBegin', target: 'juedouBegin' },
                logTarget(event, player) {
                    return event.target == player ? event.player : event.target;
                },
                forced: true,
                locked: false,
                content() {
                    var target = get.info('apphuhou').logTarget(trigger, player);
                    target.addTempSkill('apphuhou_debuff');
                    target.markAuto('apphuhou_debuff', [trigger]);
                },
                ai: {
                    directHit_ai: true,
                    skillTagFilter(player, tag, arg) {
                        if (!arg || !arg.card || !arg.target || arg.card.name != 'juedou' || game.hasPlayer(target => {
                            return get.attitude(target, arg.target) > 0 && target.countCards('hs', { name: 'wuxie' });
                        })) return false;
                    },
                    effect: {
                        target(card, player, target) {
                            if (player._apphuhou_temp || card.name != 'juedou') return;
                            player._apphuhou_temp = true;
                            var bool = (get.attitude(player, target) > 0 && get.effect(target, card, player, player) > 0);
                            delete player._apphuhou_temp;
                            if (bool) return 0;
                        },
                    },
                },
                group: ['apphuhou_wusheng', 'apphuhou_damage'],
                subSkill: {
                    debuff: {
                        charlotte: true,
                        onremove: true,
                        mod: {
                            cardRespondable(card, player) {
                                var evt = _status.event, storage = player.getStorage('apphuhou_debuff');
                                if (evt.name == 'chooseToRespond' && storage.includes(evt.getParent())) return false;
                            },
                        },
                    },
                    wusheng: {
                        audio: 'apphuhou',
                        enable: ['chooseToUse', 'chooseToRespond'],
                        filterCard(card, player) {
                            return get.type(card) == 'equip';
                        },
                        position: 'hes',
                        viewAs: { name: 'sha' },
                        viewAsFilter(player) {
                            if (!player.countCards('hes', { type: 'equip' })) return false;
                        },
                        check(card) {
                            if (ui.selected.cards.length) return 0;
                            var val = get.value(card);
                            if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
                            return 7.5 - val;
                        },
                        complexCard: true,
                        selectCard: [1, Infinity],
                        prompt: '将任意张装备牌当作【杀】使用或打出',
                        ai: {
                            respondSha: true,
                            skillTagFilter(player) {
                                if (!player.countCards('hes', { type: 'equip' })) return false;
                            },
                        },
                    },
                    damage: {
                        audio: 'apphuhou',
                        trigger: { source: 'damageBegin1' },
                        filter: function (event, player) {
                            var evt = event.getParent(), evtx = event.getParent(2);
                            if (evtx.name != 'useCard' || !['sha', 'juedou'].includes(evtx.card.name)) return false;
                            if (evtx.skill == 'apphuhou_wusheng' && (evtx.cards || []).some(i => get.type(i, false) == 'equip')) return true;
                            if (evt && evt.name == 'juedou' && player.getHistory('respond', evtxx => {
                                return evtxx.getParent(2) == evt && evtxx.skill == 'apphuhou_wusheng' && (evtxx.cards || []).length;
                            }).reduce((list, evtxx) => {
                                list.addArray(evtxx.cards || []); return list;
                            }, []).some(i => get.type(i, false) == 'equip')) return true;
                            return false;
                        },
                        forced: true,
                        locked: false,
                        logTarget: 'player',
                        content() {
                            var evt = trigger.getParent(), evtx = trigger.getParent(2);
                            if (evtx.skill == 'apphuhou_wusheng' && (evtx.cards || []).length) trigger.num += evtx.cards.filter(i => get.type(i, false) == 'equip').length;
                            if (evt && evt.name == 'juedou') trigger.num += player.getHistory('respond', evtxx => {
                                return evtxx.getParent(2) == evt && evtxx.skill == 'apphuhou_wusheng' && (evtxx.cards || []).length;
                            }).reduce((list, evtxx) => {
                                list.addArray(evtxx.cards || []); return list;
                            }, []).filter(i => get.type(i, false) == 'equip').length;
                        },
                    },
                },
            },
            appwuwei: {
                audio: 2,
                trigger: { player: 'phaseJieshuBegin' },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt2('appwuwei'));
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.logSkill('appwuwei', target);
                        player.addTempSkill('appwuwei_effect', { player: 'phaseBegin' });
                        player.markAuto('appwuwei_effect', [target]);
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '保卫$中...' },
                        trigger: { global: 'useCardToTargeted' },
                        filter: function (event, player) {
                            if (event.card.storage && event.card.storage.appwuwei_effect && event.card.storage.appwuwei_effect.includes(player)) return false;
                            return get.tag(event.card, 'damage') && event.target.hp <= player.hp && player.getStorage('appwuwei_effect').includes(event.target);
                        },
                        forced: true,
                        logTarget: 'player',
                        content() {
                            'step 0'
                            trigger.getParent().excluded.add(trigger.target);
                            game.log(trigger.card, '对', trigger.target, '无效');
                            'step 1'
                            var card = { name: 'juedou', isCard: true, storage: { appwuwei_effect: [player] } };
                            trigger.player.useCard(card, player, false);
                        },
                    },
                },
            },
            appmiaobi: {
                trigger: { player: 'useCardAfter' },
                direct: true,
                init: function (player) {
                    player.storage.appmiaobi = [];
                },
                filter: function (event, player) {
                    return player.isPhaseUsing() && get.type(event.card) == 'trick' && event.card.isCard && !player.storage.appmiaobi.includes(event.card.name) && event.cards.filterInD().length;
                },
                content: function () {
                    'step 0'
                    player.chooseTarget('妙笔：将' + get.translation(trigger.card) + '置于其中一个目标的武将牌旁', function (card, player, target) {
                        return trigger.targets.includes(target);
                    }).set('ai', target => {
                        return get.effect(target, { name: _status.event.getParent(2)._trigger.card.name }, _status.event.player);
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.logSkill('appmiaobi', target);
                        target.addSkill('appmiaobi_mark');
                        target.addToExpansion(trigger.cards.filterInD(), 'giveAuto', target).gaintag.add('appmiaobi_mark');
                        player.storage.appmiaobi.add(trigger.card.name);
                    }
                },
                group: ['appmiaobi_1', 'appmiaobi_2'],
                subSkill: {
                    1: {
                        trigger: { player: 'phaseEnd' },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.storage.appmiaobi.length > 0;
                        },
                        content: function () {
                            player.storage.appmiaobi.length = 0;
                        }
                    },
                    2: {
                        trigger: { global: 'phaseZhunbeiBegin' },
                        forced: true,
                        locked: false,
                        filter: function (event, player) {
                            return event.player.getExpansions('appmiaobi_mark').length > 0 && event.player.hasSkill('appmiaobi_mark');
                        },
                        content: function () {
                            'step 0'
                            if (trigger.player.countCards('h', { type: 'trick' })) {
                                trigger.player.chooseControl(['选项一', '选项二']).set('prompt', '请选择一项').set('prompt2', '交给' + get.translation(player) + '一张锦囊牌，或令' + get.translation(player) + '对你使用所有“妙笔”牌');
                            }
                            'step 1'
                            if (result.control && result.control == '选项一') {
                                trigger.player.chooseCard('妙笔：请交给' + get.translation(player) + '一张锦囊牌', 'h', true, (card, player) => {
                                    return get.type(card, player) == 'trick';
                                })
                            }
                            else {
                                var cardus = trigger.player.getExpansions('appmiaobi_mark');
                                if (cardus && cardus.length && trigger.player.isIn()) {
                                    var prompt = '妙笔：请选择对' + get.translation(trigger.player) + '使用一张“妙笔”牌';
                                    player.useCard(cardus[cardus.length - 1], trigger.player, false);
                                    event.goto(3);
                                }
                                else {
                                    trigger.player.removeSkill('appmiaobi_mark');
                                    event.finish();
                                }
                            }
                            'step 2'
                            if (result.bool) {
                                var card = result.cards[0];
                                trigger.player.give(card, player);
                                trigger.player.removeSkill('appmiaobi_mark');
                                event.finish();
                            }
                            'step 3'
                            if (trigger.player.getExpansions('appmiaobi_mark').length > 0) event.goto(1);
                            else {
                                trigger.player.removeSkill('appmiaobi_mark');
                                event.finish();
                            }
                        }
                    },
                    mark: {
                        marktext: '妙笔',
                        mark: true,
                        intro: {
                            content: 'expansion',
                            markcount: '',
                        },
                        onremove: function (player, skill) {
                            var cards = player.getExpansions(skill);
                            if (cards.length) player.loseToDiscardpile(cards);
                        },
                    },
                }

            },
            apphuixin: {
                trigger: { player: 'phaseBegin' },
                direct: true,
                content: function () {
                    if (player.countCards('e') % 2 == 0) player.addTempSkill('sbjizhi');
                    else player.addTempSkill('appjifeng');
                }
            },
            appjifeng: {
                audio: 2,
                enable: "phaseUse",
                filter: function (event, player) {
                    return player.countCards('h') > 0;
                },
                position: 'h',
                filterCard: true,
                usable: 1,
                check: function (card) {
                    return 10 - get.value(card)
                },
                content: function () {
                    var card = get.cardPile(function (card) {
                        return get.type2(card) == 'trick';
                    });
                    if (card) {
                        player.gain(card, 'gain2');
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        player: 1.8,
                    },
                    threaten: 0.6,
                },
            },
            appsangu: {
                trigger: { target: 'useCardToTargeted' },
                direct: true,
                init: function (player) {
                    player.storage.appsangu = 0;
                },
                content: function () {
                    'step 0'
                    player.storage.appsangu++;
                    'step 1'
                    if (player.storage.appsangu >= 3) {
                        player.logSkill('appsangu');
                        player.storage.appsangu -= 3;
                        player.addMoulue(3);
                    }
                    else event.finish();
                    'step 2'
                    var cards = get.cards(3);
                    game.cardsGotoOrdering(cards);
                    var next = player.chooseToMove();
                    next.set('list', [
                        ['牌堆顶', cards],
                        ['牌堆底'],
                    ]);
                    next.set('prompt', '三顾：点击将牌移动到牌堆顶或牌堆底');
                    next.processAI = function (list) {
                        var cards = list[0][1], player = _status.event.player;
                        var target = (_status.event.getTrigger().name == 'phaseZhunbei') ? player : player.next;
                        var att = get.sgn(get.attitude(player, target));
                        var top = [];
                        var judges = target.getCards('j');
                        var stopped = false;
                        if (player != target || !target.hasWuxie()) {
                            for (var i = 0; i < judges.length; i++) {
                                var judge = get.judge(judges[i]);
                                cards.sort(function (a, b) {
                                    return (judge(b) - judge(a)) * att;
                                });
                                if (judge(cards[0]) * att < 0) {
                                    stopped = true; break;
                                }
                                else {
                                    top.unshift(cards.shift());
                                }
                            }
                        }
                        var bottom;
                        if (!stopped) {
                            cards.sort(function (a, b) {
                                return (get.value(b, player) - get.value(a, player)) * att;
                            });
                            while (cards.length) {
                                if ((get.value(cards[0], player) <= 5) == (att > 0)) break;
                                top.unshift(cards.shift());
                            }
                        }
                        bottom = cards;
                        return [top, bottom];
                    }
                    'step 3'
                    var top = result.moved[0];
                    var bottom = result.moved[1];
                    top.reverse();
                    for (var i = 0; i < top.length; i++) {
                        ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
                    }
                    for (i = 0; i < bottom.length; i++) {
                        ui.cardPile.appendChild(bottom[i]);
                    }
                    player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
                    game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
                    game.updateRoundNumber();
                    game.delayx();
                }
            },
            appyanshi: {
                enable: 'phaseUse',
                usable: 1,
                prompt2: '从牌堆顶或牌堆底摸一张牌',
                content: function () {
                    'step 0'
                    player.chooseControl(['牌堆顶', '牌堆底']).set('prompt', get.prompt2('appyanshi'));
                    'step 1'
                    if (result.control == '牌堆顶') {
                        player.draw().gaintag = ['appyanshi'];
                        player.storage.appyanshi = 1;
                    }
                    else if (result.control == '牌堆底') {
                        player.draw('bottom').gaintag = ['appyanshi'];
                        player.storage.appyanshi = 2;
                    }
                },
                group: ['appyanshi_1', 'appyanshi_2'],
                subSkill: {
                    1: {
                        trigger: { player: 'useCardAfter' },
                        firstDo: true,
                        direct: true,
                        filter: function (event, player) {
                            return player.hasHistory('lose', function (evt) {
                                if (evt.getParent() != event) return false;
                                for (var i in evt.gaintag_map) {
                                    for (var j of evt.gaintag_map[i]) {
                                        if (j == 'appyanshi') return true;
                                    }
                                    return false;
                                }
                            });
                        },
                        content: function () {
                            'step 0'
                            player.chooseBool('演势：是否从' + (player.storage.appyanshi == 1 ? '牌堆底' : '牌堆顶') + '摸一张牌');
                            'step 1'
                            if (result.bool) {
                                player.logSkill('appyanshi');
                                if (player.storage.appyanshi == 2) {
                                    player.draw().gaintag = ['appyanshi'];
                                    player.storage.appyanshi = 1;
                                }
                                else if (player.storage.appyanshi == 1) {
                                    player.draw('bottom').gaintag = ['appyanshi'];
                                    player.storage.appyanshi = 2;
                                }
                            }
                        }
                    },
                    2: {
                        trigger: { player: 'phaseEnd' },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            player.removeGaintag('appyanshi');
                        }
                    },
                    3: {
                        trigger: { player: 'drawAfter' },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return event.getParent().name == 'appyanshi';
                        },
                        content: function () {
                            if (!trigger.gaintagFixed) trigger.gaintagFixed = [];
                            trigger.gaintagFixed = ['appyanshi'];
                            console.log(trigger);
                        }
                    },
                }
            },
            //极司马懿
            appyinren: {
                derivation: ['new_rejianxiong', 'xingshang', 'mingjian'],
                audio: 2,
                trigger: {
                    player: 'phaseUseBefore'
                },
                filter: function (event, player) {
                    return lib.skill.appyinren.derivation.some(skill => !player.hasSkill('appyinren_' + skill));
                },
                prompt2: function (event, player) {
                    return '跳过出牌阶段和弃牌阶段并获得技能【' + get.translation(lib.skill.appyinren.derivation.filter(skill => !player.hasSkill('appyinren_' + skill))[0]) + '】';
                },
                /*check: function(event, player) {
                    if (lib.skill.appyinren.derivation.filter(skill => !player.hasSkill('appyinren_' + skill))[0] != 'jianxiong') {
                        if (!player.hasFriend()) return false;
                    }
                    return player.countCards('h') <= player.getHandcardLimit() + 1;
                },*/
                content: function () {
                    trigger.cancel();
                    player.skip('phaseDiscard');
                    player.addSkillLog('appyinren_' + lib.skill.appyinren.derivation.filter(skill => !player.hasSkill('appyinren_' + skill))[0]);
                },
                subSkill: {
                    new_rejianxiong: {
                        inherit: 'new_rejianxiong'
                    },
                    xingshang: {
                        inherit: 'xingshang'
                    },
                    mingjian: {
                        inherit: 'mingjian'
                    },
                },
            },
            appduoquan: {
                audio: 2,
                trigger: {
                    player: 'phaseJieshuBegin'
                },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt2('appduoquan'), lib.filter.notMe)
                        .set('ai', target => {
                            var player = _status.event.player;
                            return -get.attitude(player, target) / Math.pow(target.countCards('hs') + 1);
                        })
                        .animate = false;
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        event.target = target;
                        var list = ['basic', 'trick', 'equip'];
                        if (!list.length) {
                            event.finish();
                            return;
                        }
                        player.viewHandcards(target);
                        player.chooseControl(list).set('prompt', '请选择一种类别').set('ai', function () {
                            var player = _status.event.player;
                            var target = _status.event.target;
                            var cards = target.getCards('h', function (card) {
                                return target.hasUseTarget(card);
                            }),
                                map = {};
                            for (var i = 0; i < cards.length; i++) {
                                map[get.type(cards[i], 'trick')] = true;
                            }
                            if (map.equip) return 'equip';
                            if (map.trick) return 'trick';
                            return 0;
                        })
                            .set('target', target);
                    } else event.finish();
                    'step 2'
                    player.logSkill('appduoquan', target);
                    player.popup(result.control);
                    game.log(player, '选择了', '#g' + get.translation(result.control) + '牌');
                    target.addSkill('appduoquan_effect', {
                        player: 'phaseUseAfter'
                    });
                    if (!target.storage.appduoquan_effect) target.storage.appduoquan_effect = {};
                    if (!target.storage.appduoquan_effect[player.playerid]) target.storage.appduoquan_effect[player.playerid] = [];
                    target.storage.appduoquan_effect[player.playerid].add(result.control);
                    target.markSkill('appduoquan_effect');
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        audio: 'appduoquan',
                        trigger: {
                            player: 'useCard'
                        },
                        filter: function (event, player) {
                            return player.isPhaseUsing();
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            var target = game.findPlayer(target => player.storage.appduoquan_effect[target.playerid] && player.storage.appduoquan_effect[target.playerid].includes(get.type2(trigger.card)));
                            if (target) {
                                target.logSkill('appduoquan_effect', player);
                                trigger.targets.length = 0;
                                trigger.all_excluded = true;
                                target.addTempSkill('appduoquan_gain');
                                trigger.appduoquan_effect = target;
                            }
                            'step 1'
                            player.removeSkill('appduoquan_effect');
                        },
                        mod: {
                            aiOrder: function (player, card, num) {
                                if (player.isPhaseUsing() && game.hasPlayer(target => {
                                    return player.storage.appduoquan_effect[target.playerid] && player.storage.appduoquan_effect[target.playerid].includes(get.type2(card));
                                })) return num / 10;
                            },
                        },
                        intro: {
                            content: function (storage, player) {
                                var str = '';
                                for (var i in storage) {
                                    var target = game.findPlayer2(target => target.playerid == i);
                                    if (!target) continue;
                                    str += get.translation(target) + '→' + get.translation(storage[i]) + '牌<br>';
                                }
                                str = str.slice(0, -4);
                                return str;
                            },
                        },
                    },
                    gain: {
                        charlotte: true,
                        trigger: {
                            global: 'cardsDiscardAfter'
                        },
                        filter: function (event, player) {
                            if (!event.cards.filterInD('d')
                                .length) return false;
                            var evt = event.getParent();
                            if (evt.name != 'orderingDiscard') return false;
                            var evtx = (evt.relatedEvent || evt.getParent());
                            return evtx.player.getHistory('useCard', evtxx => {
                                return evtx.getParent() == (evtxx.relatedEvent || evtxx.getParent()) && evtxx.appduoquan_effect && evtxx.appduoquan_effect == player;
                            })
                                .length;
                        },
                        forced: true,
                        popup: false,
                        content: function () {
                            player.gain(trigger.cards.filterInD('d'), 'gain2');
                        },
                    },
                },
            },
            appdingce: {
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                forced: true,
                locked: false,
                filter: function (event, player) {
                    return event.name != 'phase' || game.phaseNumber == 0;
                },
                content: function () {
                    player.addMoulue(3);
                },
                group: 'appdingce_draw',
                subSkill: {
                    draw: {
                        trigger: { global: 'phaseEnd' },
                        forced: true,
                        locked: false,
                        filter: function (event, player) {
                            return player.getHistory('useCard').length > 0;
                        },
                        content: function () {
                            var list = [], history = player.getHistory('useCard');
                            for (var i of history) {
                                list.add(get.type2(i.card));
                            }
                            if (list.length > 0) player.addMoulue(list.length);
                        }
                    },
                }
            },
            appsuanlue: {
                enable: 'chooseToUse',
                filter: function (event, player) {
                    var check = false;
                    player.getHistory('useSkill', function (skill) {
                        if (skill.sourceSkill == 'appsuanlue') check = true;
                    });
                    if (check) return false;
                    return player.hasMoulue() && player.getHistory('useCard').length > 0 && ['basic', 'trick'].contains(get.type(player.getHistory('useCard')[player.getHistory('useCard').length - 1].card)) && game.hasPlayer(function (current) {
                        return player.canUse(player.getHistory('useCard')[player.getHistory('useCard').length - 1].card, current);
                    });
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        var cardd = player.getHistory('useCard')[player.getHistory('useCard').length - 1].card.name;
                        if (get.type(cardd) == 'trick') list.push(['锦囊', '', cardd]);
                        else if (get.type(cardd) == 'basic') list.push(['基本', '', cardd]);
                        if (list.length == 0) {
                            return ui.create.dialog('算略无可用牌');
                        }
                        return ui.create.dialog('算略', [list, 'vcard']);
                    },
                    filter: function (button, player) {
                        return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                    },
                    check: function (button) {
                        var player = _status.event.player;
                        if (player.countCards('hs', button.link[2]) > 0) return 0;
                        if (button.link[2] == 'wugu') return 0;
                        var effect = player.getUseValue(button.link[2]);
                        if (effect > 0) return effect;
                        return 0;
                    },
                    backup: function (links, player) {
                        return {
                            filterCard: false,
                            audio: 'appsuanlue',
                            selectCard: 0,
                            popname: true,
                            check: function (card) {
                                return 6 - get.value(card);
                            },
                            position: 'hs',
                            viewAs: { name: links[0][2], nature: links[0][3] },
                            onuse: function (result, player) {
                                player.removeMoulue();
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                    },
                    ai: {
                        skillTagFilter: function (player) {
                            if (!player.countCards('hs')) return false;
                        },
                        order: 4,
                        result: {
                            player: function (player) {
                                var allshown = true, players = game.filterPlayer();
                                for (var i = 0; i < players.length; i++) {
                                    if (players[i].ai.shown == 0) {
                                        allshown = false;
                                    }
                                    if (players[i] != player && players[i].countCards('h') && get.attitude(player, players[i]) > 0) {
                                        return 1;
                                    }
                                }
                                if (allshown) return 1;
                                return 0;
                            }
                        },
                        threaten: 1.2,
                    },
                },
            },
            appmiaoji: {
                marktext: '谋略',
                intro: { content: '谋略值：#/5' },
                audio: 2,
                enable: 'chooseToUse',
                usable: 1,
                hiddenCard: function (player, name) {
                    var event = _status.event;
                    if (!event || !player.hasMoulue() || event.type == 'respondSha' || event.type == 'respondShan' || event.type == 'dying') return false;
                    if (event.type == 'wuxie' && player.countMoulue() < 2) return false;
                    var check = false;
                    player.getHistory('useSkill', function (skill) {
                        if (skill.sourceSkill == 'appmiaoji') check = true;
                    });
                    if (check) return false;
                    return true;
                },
                filter: function (event, player) {
                    return player.countMoulue() >= 1;
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        if (player.countMoulue() > 0) list.push(['锦囊', '', 'guohe']);
                        if (player.countMoulue() > 1) list.push(['锦囊', '', 'wuxie']);
                        if (player.countMoulue() > 2) list.push(['锦囊', '', 'wuzhong']);
                        if (list.length == 0) {
                            return ui.create.dialog('妙计失效了');
                        }
                        return ui.create.dialog('妙计', [list, 'vcard']);
                    },
                    filter: function (button, player) {
                        return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                    },
                    check: function (button) {
                        var player = _status.event.player;
                        if (_status.event.getParent().type != 'phase') return 1;
                        var effect = player.getUseValue(button.link[2]);
                        if (effect > 0) return effect;
                        return 0;
                    },
                    backup: function (links, player) {
                        return {
                            filterCard: true,
                            audio: 'appmiaoji',
                            selectCard: 0,
                            popname: true,
                            viewAs: {
                                name: links[0][2], nature: links[0][3], suit: "none", number: null, isCard: true,
                            },
                            onuse: function (result, player) {
                                switch (result.card.name) {
                                    case 'guohe': player.removeMoulue(); break;
                                    case 'wuxie': player.removeMoulue(2); break;
                                    case 'wuzhong': player.removeMoulue(3); break;
                                }
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '视为使用' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]);
                    }
                },
                ai: {
                    order: 12,
                    basic: {
                        useful: [6, 4, 3],
                        value: [6, 4, 3],
                    },
                    result: {
                        player: function (player) {
                            return 1;
                        }
                    },
                    threaten: 1.9,
                    expose: 0.2,
                },
            },
            appjiusong: {
                audio: 2,
                enable: "chooseToUse",
                filterCard: function (card) {
                    return get.type(card) == 'trick' || get.type(card) == 'delay';
                },
                viewAs: {
                    name: "jiu",
                },
                viewAsFilter: function (player) {
                    if (!player.countCards('h', { type: 'trick' }) && !player.countCards('h', { type: 'type' })) return false;
                    return true;
                },
                prompt: "将一张锦囊牌当酒使用",
                check: function (card) {
                    if (_status.event.type == 'dying') return 1 / Math.max(0.1, get.value(card));
                    return 4 - get.value(card);
                },
                ai: {
                    threaten: 1.5,
                    basic: {
                        useful: function (card, i) {
                            if (_status.event.player.hp > 1) {
                                if (i == 0) return 4;
                                return 1;
                            }
                            if (i == 0) return 7.3;
                            return 3;
                        },
                        value: function (card, player, i) {
                            if (player.hp > 1) {
                                if (i == 0) return 5;
                                return 1;
                            }
                            if (i == 0) return 7.3;
                            return 3;
                        },
                    },
                    order: function () {
                        return get.order({
                            name: 'sha'
                        }) + 0.2;
                    },
                    result: {
                        target: function (player, target) {
                            if (player.hp > 0 && target == player && (player.countCards('hs', 'sha') == 0 || player.getCardUsable('sha') < 1)) {
                                return "zeroplayertarget";
                            }
                            if (target && target.isDying()) return 2;
                            if (target && !target.isPhaseUsing()) return 0;
                            if (lib.config.mode == 'stone' && !player.isMin()) {
                                if (player.getActCount() + 1 >= player.actcount) return 0;
                            }
                            var shas = player.getCards('h', 'sha');
                            if (shas.length > 1 && (player.getCardUsable('sha') > 1 || player.countCards('h', 'zhuge'))) {
                                return 0;
                            }
                            shas.sort(function (a, b) {
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
                                if (player.countCards('h', 'hufu') != 1) {
                                    card = {
                                        name: 'sha'
                                    };
                                }
                            }
                            if (card) {
                                if (game.hasPlayer(function (current) {
                                    return (get.attitude(target, current) < 0 && target.canUse(card, current, null, true) && !current.hasSkillTag('filterDamage', null, {
                                        player: player,
                                        card: card,
                                        jiu: true,
                                    }) && get.effect(current, card, target) > 0);
                                })) {
                                    return 1;
                                }
                            }
                            var tri = _status.event.getTrigger();
                            if (player.hp > 0 && target == player && player.countCards('hs', 'sha') > 0 && !game.hasPlayer(function (current) {
                                return current != player && player.inRange(current) && get.attitude(player, current) < 0 && !current.hasSkill('baiyin_skill') && !current.hasSkill('rw_baiyin_skill');
                            })) {
                                return "zeroplayertarget";
                            }
                            if (player.identity == 'fan' && tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan') {
                                if (player.countCards('hs') < 3 && tri.source.previous.identity != 'fan') {
                                    return "zeroplayertarget";
                                }
                            }
                            return 0;
                        },
                    },
                    tag: {
                        save: 1,
                        recover: 0.1,
                    },
                },
                marktext: '醉',
                intro: { content: 'mark' },
                group: 'appjiusong_draw',
                subSkill: {
                    draw: {
                        audio: 'appjiusong',
                        trigger: { global: 'useCard' },
                        forced: true,
                        locked: false,
                        filter: function (event, player) {
                            return event.card.name == 'jiu' && player.countMark('appjiusong') < 3;
                        },
                        content: function () {
                            player.addMark('appjiusong');
                        }
                    }
                },
            },
            apphaotao: {
                audio: 2,
                trigger: {
                    global: "useCardToPlayer",
                },
                filter: function (event, player) {
                    return event.player != player && event.targets.length == 1 && ['basic', 'trick'].contains(get.type(event.card, false)) && player.countMark('appjiusong') > 0;
                },
                content: function () {
                    'step 0'
                    player.removeMark('appjiusong');
                    'step 1'
                    event.targ = game.players.randomGet();
                    if (trigger.target != event.targ) {
                        event.check = true;
                        game.log(trigger.player, '将', trigger.card, '的目标更改为', event.targ);
                    }
                    'step 2'
                    trigger.targets.remove(trigger.target);
                    trigger.targets.push(event.targ);
                    trigger.target = event.targ;
                    'step 3'
                    if (!event.check) {
                        var card = get.cardPile2(function (card) {
                            return get.type(card) == 'trick';
                        });
                        if (card) player.gain(card, 'gain2');
                    }
                }
            },
            appbishi: {
                audio: 2,
                mod: {
                    targetEnabled: function (card) {
                        if (get.type2(card) == 'trick' && get.tag(card, 'damage')) return false;
                    },
                },
            },
        }
};
}
