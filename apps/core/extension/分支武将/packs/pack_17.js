// Extracted from character/shangbing.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
            sbfm_jiangwei: ['male', 'shu', 4, ['sbfmzhuri', 'sbfmranji']],
            sbfm_guanyu: ['male', 'shu', 4, ['sbfmfumeng', 'sbfmguidao']],
            sbfm_sb_guanyu: ['male', 'shu', 4, ['sbfmweilin', 'sbfmduoshou']],
            sbfm_taishici: ['male', 'wu', 4, ['sbfmdulie', 'sbfmdouchan']],
            sbfm_yuanshao: ['male', 'qun', 4, ['sbfmyufeng', 'sbfmhetao', 'sbfmshenli', 'sbfmshishou'], ['zhu', 'transform:[sbfm_yuanshao,sbfm_yuanshao2]']],
            sbfm_dengai: ["male", "wei", 4, ['oljiewan', 'olpixian']],
            sbfm_pangtong: ['male', 'shu', 3, ['sbfmhongtu', 'sbfmqiwu']],
            sbfm_yuanshu: ['male', 'qun', 4, ['sbfmjinming', 'sbfmxiaoshi', 'sbfmyanliang'], ['zhu']],
            sbfm_sunjian: ['male', 'wu', '4/5', ['sbfmhulie', 'sbfmyipo']],
            sbfm_kongrong: ['male', 'qun', 4, ['sbfmliwen', 'sbfmzhengyi']],
            sbfm_huaxiong: ["male", "qun", 6, ["sbfmbojue", "sbfmyangwei"]],
            sbfm_dongzhuo: ['male', 'qun', 5, ['sbfmguanbian', 'sbfmxiongni', 'sbfmfengshang', 'sbfmzhibing'], ['zhu']],
        },
"characterSort": {
            shangbing: {
                sbfm_mou: ['sbfm_jiangwei', 'sbfm_pangtong'],
                sbfm_wu: ['sbfm_sb_guanyu', 'sbfm_dongzhuo'],
                sbfm_ren: ['sbfm_kongrong'],
                sbfm_wei: ['sbfm_taishici', 'sbfm_yuanshao', 'sbfm_sunjian', 'sbfm_huaxiong'],
                sbfm_da: ['sbfm_yuanshu'],
                sbfm_trash: ['sbfm_guanyu'],
            }
        },
"characterTitle": {
            sbfm_jiangwei: 'OL·谋',
            sbfm_guanyu: 'OL谋关羽废案',
            sbfm_yuanshao: 'OL·谋'
        },
"characterIntro": {},
"characterPrefix": {
            sbfm_yuanshao2: '谋'
        },
"dynamicTranslate": {},
"translate": {
            sbfm_jiangwei: '谋姜维',
            sbfmzhuri: '逐日',
            sbfmzhuri_info: '你的一个阶段结束时，若你的手牌数于此阶段内变化过，你可以与一名其他角色拼点，若你：赢，你可以使用其中一张拼点牌；没赢，你失去1点体力或失去此技能直到回合结束。',
            sbfmranji: '燃己',
            sbfmranji_info: '限定技，结束阶段，若你本回合使用过牌的阶段数不小于/不大于你的体力值，你可以获得技能“困奋”/“诈降”。若如此做，你将手牌或体力值调整至上限，然后你不能回复体力直到你杀死一名角色。',
            sbfm_guanyu: '谋关羽',
            sbfmfumeng: '赴梦',
            sbfmfumeng_info: '每轮开始时，你可令任意张手牌视为【杀】。',
            sbfmguidao: '归刀',
            sbfmguidao_info: '出牌阶段，你可以重铸两张牌视为使用【决斗】（重铸的【杀】须比本回合上次多），目标角色受到此牌伤害时，猜测你手牌中【杀】与非【杀】牌哪个数量多，猜测错误则此【决斗】伤害+1。',
            sbfm_sb_guanyu: '谋关羽',
            sbfmweilin: '威临',
            sbfmweilin_info: '每名角色的回合限一次，你可以将一张牌当【杀】或【酒】使用，且目标角色与此牌颜色相同的手牌视为【杀】直到本回合结束。',
            sbfmduoshou: '夺首',
            sbfmduoshou_info: '锁定技，你于每名角色的回合内使用的首张红色牌无视距离；首张基本牌不计次数；首次造成伤害后摸一张牌。',
            sbfm_taishici: '谋太史慈',
            sbfmdulie: '笃烈',
            sbfmdulie_info: '每回合限一次，当你成为其他角色使用基本牌或普通锦囊牌的唯一目标时，你可以令此牌效果执行两次，然后你摸X张牌（X为你的攻击范围且至多为5）。',
            sbfmdouchan: '斗缠',
            sbfmdouchan_info: '锁定技，准备阶段，你从牌堆中获得一张【决斗】，否则你的攻击范围和出牌阶段使用的【杀】的次数+1(增加次数不超过游戏人数）。',
            sbfm_yuanshao: '谋袁绍',
            sbfm_yuanshao2: '谋袁绍',
            sbfmyufeng: '玉锋',
            sbfmyufeng_info: '锁定技，游戏开始时，将【思召剑】置入你的装备区。',
            sbfmhetao: '合讨',
            sbfmhetao_info: '当其他角色使用牌指定大于一个目标后，你可以弃置一张与此牌颜色相同的牌，令此牌对其中一名目标生效两次，对其余目标无效。',
            sbfmshenli: '神离',
            sbfmshenli_info: '出牌阶段限一次，当你使用【杀】指定目标后，可以令所有其他角色均成为此【杀】的目标，然后若此【杀】造成的伤害值：大于你的手牌数，你摸伤害值数张牌（至多摸五张）；大于你的体力值，你对相同目标再次使用此【杀】。',
            sbfmshishou: '士首',
            sbfmshishou_info: '主公技，若你的装备区没有武器牌，当其他群势力角色失去装备区内的牌后，可以将【思召剑】置入你的装备区。',
            sizhaojian: '思召剑',
            sizhao_skill: '思召',
            sizhaojian_info: '目标角色只能使用不小于你的【杀】点数的【闪】响应你使用的【杀】。',
            sbfm_dengai: "谋邓艾",
            oljiewan: "解腕",
            oljiewan_info: "出牌阶段限一次，你可以减1点体力上限以检索一张伤害类锦囊，然后你可令手牌中的一张伤害牌于本回合内造成的伤害+1。",
            olpixian: "僻险",
            olpixian_info: "锁定技，出牌阶段结束时，若你的体力值不为全场最高，你加1点体力上限或回复1点体力。",
            sbfm_pangtong: '谋庞统',
            sbfmhongtu: '鸿图',
            sbfmhongtu_info: '每阶段结束时，若你本阶段获得过至少两张牌，你可以摸三张牌，展示三张手牌，令一名其他角色选择是否使用其中一张牌。若其未以此法使用牌，则你对其与你各造成1点火焰伤害，否则你随机弃置其中的另一张牌，然后若其使用的牌的点数于展示的牌的所有点数中：为唯一最大，其视为拥有技能【飞军】直到其下个回合结束；不为最大或最小，其视为拥有技能【潜袭】直到其下个回合结束；为唯一最小，其手牌上限+2直到其下个回合结束。',
            sbfmqiwu: '栖梧',
            sbfmqiwu_info: '当你每回合第一次受到伤害时，若你计算与伤害来源的距离不大于你的攻击范围，你可以弃置一张红色牌，防止此伤害。',
            sbfm_sunjian: '谋孙坚',
            sbfmhulie: '虎烈',
            sbfmhulie_info: '每回合各限一次，你使用【杀】或【决斗】仅指定一名角色为目标后，你可令此牌伤害+1。若此牌未造成伤害，你可令目标角色视为对你使用一张【杀】。',
            sbfmyipo: '毅魄',
            sbfmyipo_info: '你的体力值变化后，若当前体力值大于0且为你首次达到，你可以选择一名角色并选择一项：1.令其摸X张牌，然后弃置一张牌；2.令其摸一张牌，然后弃置X张牌（X为你已损失体力值且至少为1）。',
            sbfm_huaxiong: "谋华雄",
            sbfmbojue: "搏决",
            sbfmbojue_info: "出牌阶段限两次，你可以选择一名其他角色，然后同时与其选择摸一张牌或弃置一张牌，然后若你与其的手牌数之和的变化值为：0，你与其依次弃置对方一张牌；2，你与其依次视为对对方使用一张【杀】。",
            sbfmyangwei: "扬威",
            sbfmyangwei_info: "锁定技。①当你于一回合不因摸牌阶段获得至少两张牌后，你下次造成的伤害+1。②当你于一回合不因弃牌阶段弃置至少两张牌后，你下次受到的伤害+1。",
            sbfm_dongzhuo: '谋董卓',
            sbfmguanbian: '观变',
            sbfmguanbian_info: '锁定技，①游戏开始时，你令：1.你的手牌上限+X（X为游戏人数）；2.其他角色计算与你的距离+X；3.你计算与其他角色的距离+X；②当你发动’凶逆”后，或你发动’封赏”后，或第一轮结束时，你失去此技能。',
            sbfmxiongni: '凶逆',
            sbfmxiongni_info: '出牌阶段开始时，你可以弃置一张牌，令所有其他角色依次选择一项：1.弃置一张与此牌花色相同的牌；2.受到你对其造成的1点伤害。',
            sbfmfengshang: '封赏',
            sbfmfengshang_info: '出牌阶段限一次，或当一名角色进入濒死状态时，你可以选择本回合进入弃牌堆的两张花色相同的牌，交给两名角色其中各一张牌。若你未获得，你视为使用一张不计入次数的【酒】。',
            sbfmzhibing: '执柄',
            sbfmzhibing_info: '主公技，锁定技，每项各限一次，准备阶段，若其他群势力角色累计使用过的黑色牌的数量至少为：3，你加1点体力上限并回复1点体力；6，你获得技能“焚城”；9，你获得技能“崩坏”。',
            sbfm_kongrong: '谋孔融',
            sbfmliwen: '立文',
            sbfmliwen_info: '①游戏开始时，你获得3个“贤”标记；②当你使用牌时，若此牌与本回合被使用的上一张牌类别或花色相同，你获得1个“贤”标记（一名角色至多拥有5个“贤”标记）；③回合结束时，你依次执行以下所有项：1.可以交给任意名“贤”标记数小于3的其他角色各1个“贤”标记；2.令有“贤”标记的角色按拥有的“贤”标记数从多到少的顺序依次使用一张手牌或令你移去其所有“贤”标记（当一名角色的任意个“贤”标记被移去时，你摸等量张牌）。',
            sbfmzhengyi: '争义',
            sbfmzhengyi_info: '当一名有“贤”标记的角色受到普通伤害时，其他所有有“贤”标记的角色同时选择是否防止此伤害，体力最大的选择是的角色于此次伤害结算后失去等量的体力。',
            sbfm_yuanshu: '谋袁术',
            sbfmjinming: '矜名',
            sbfmjinming_info: '锁定技，回合开始时，你选择一项条件：1.回复过1点体力；2.弃置过两张牌；3.使用过三种类型的牌；4.造成过4点伤害。然后此回合结束时，你摸X张牌，若本回合未满足条件，则你删除对应“矜名”选项（X为你上次“矜名”选择的选项序号数）。',
            sbfmxiaoshi: '枭噬',
            sbfmxiaoshi_info: '出牌阶段限一次，你使用的基本牌或普通锦囊牌可以额外指定一个目标（无距离限制），若此牌未造成伤害，你失去1点体力或令其中一个目标摸X张牌（X为你上次“矜名”选择的选项序号数）。',
            sbfmyanliang: '厌粱',
            sbfmyanliang_info: '主公技，其他群势力角色的出牌阶段限一次，其可以交给你一张装备牌，视为使用一张【酒】。',

            sbfm_mou: '谋定天下',
            sbfm_wu: '武定乾坤',
            sbfm_ren: '施仁布德',
            sbfm_wei: '奋勇扬威',
            sbfm_da: '达权通变',
            sbfm_trash: '上兵伐谋·前尘',
        },
"skill": {
            //谋袁术
            sbfmjinming: {
                audio: 2,
                trigger: {
                    player: 'phaseBegin'
                },
                init: function (player) {
                    player.storage.sbfmjinming = [];
                },
                filter: function (event, player) {
                    if (!player.storage.sbfmjinming) player.storage.sbfmjinming = [];
                    return player.getStorage('sbfmjinming').length < 4;
                },
                forced: true,
                direct: true,
                content: function () {
                    'step 0'
                    var list = ['选项一', '选项二', '选项三', '选项四'].filter((key, index) => !player.getStorage('sbfmjinming').includes(index + 1));
                    player.chooseControl(list)
                        .set('choiceList', ['回复过1点体力', '弃置过两张牌', '使用过三种类型的牌', '造成过4点伤害'])
                        .set('prompt', get.prompt('sbfmjinming'))
                        .set('ai', () => {
                            if (list.includes('选项三') && ['trick', 'equip'].every(type => player.countCards('h', card => get.type2(card) == type && player.getUseValue(card) > 0))) return '选项三';
                            if (list.includes('选项四') && player.countCards('h', card => player.getUseValue(card) > 0)) return '选项四';
                            return list.randomGet();
                        });
                    'step 1'
                    var map = new Map([
                        ['选项一', '回复过1点体力'],
                        ['选项二', '弃置过2张牌'],
                        ['选项三', '使用过3种类型的牌'],
                        ['选项四', '造成过4点伤害']
                    ]);
                    //player.addTempSkill('sbfmjinming_mission');
                    player.storage.sbfmjinming_mission = map.get(result.control);
                    player.markSkill('sbfmjinming_mission');
                },
                group: ['sbfmjinming_mission'],
                subSkill: {
                    mission: {
                        trigger: {
                            player: 'phaseEnd'
                        },
                        charlotte: true,
                        forced: true,
                        checkMission: function (player, key) {
                            var num = 0;
                            switch (key) {
                                case 1:
                                    game.getGlobalHistory('changeHp', evt => {
                                        if (evt.player == player && evt.getParent().name == 'recover' && evt.num > 0) num += evt.num;
                                    });
                                    break;
                                case 2:
                                    player.getHistory('lose', evt => {
                                        if (evt.type == 'discard' && evt.cards2?.length) num += evt.cards2.length;
                                    });
                                    break;
                                case 3:
                                    var types = [];
                                    player.getHistory('useCard', evt => {
                                        let type = get.type2(evt.card);
                                        if (!types.includes(type)) types.add(type);
                                    });
                                    num = types.length;
                                    break;
                                case 4:
                                    player.getHistory('sourceDamage', evt => {
                                        if (evt.num > 0) num += evt.num;
                                    });
                                    break;
                            }
                            return num;
                        },
                        content: function () {
                            'step 0'
                            var key = ['回复过1点体力', '弃置过2张牌', '使用过3种类型的牌', '造成过4点伤害'].indexOf(player.storage.sbfmjinming_mission);
                            key++;
                            player.draw(key);
                            event.key = key;
                            'step 1'
                            if (lib.skill.sbfmjinming_mission.checkMission(player, event.key) < event.key) {
                                player.popup('失败', 'fire');
                                player.storage.sbfmjinming.add(event.key);
                                game.log(player, '删除了', '#g【矜名】', '的选项', `#y${player.storage.sbfmjinming_mission}`);
                            } else {
                                player.popup('成功', 'wood');
                            }
                        },
                        intro: {
                            markcount: function (storage, player) {
                                if (!storage) return null;
                                var map = new Map([
                                    ['回复过1点体力', '回复体力'],
                                    ['弃置过2张牌', '弃置牌'],
                                    ['使用过3种类型的牌', '使用牌'],
                                    ['造成过4点伤害', '造成伤害']
                                ]);
                                return map.get(storage);
                            },
                            content: function (storage, player) {
                                if (!storage) return '本回合没有〖矜名〗目标';
                                var map = new Map([
                                    ['回复过1点体力', `回复过${lib.skill.sbfmjinming_mission.checkMission(player, 1)}点体力`],
                                    ['弃置过2张牌', `弃置过${lib.skill.sbfmjinming_mission.checkMission(player, 2)}张牌`],
                                    ['使用过3种类型的牌', `使用过${lib.skill.sbfmjinming_mission.checkMission(player, 3)}种类型的牌`],
                                    ['造成过4点伤害', `造成过${lib.skill.sbfmjinming_mission.checkMission(player, 4)}点伤害`]
                                ]);
                                return `本回合需要${storage}，目前${map.get(storage)}`;
                            },
                        },
                    },
                },
                ai: {
                    combo: 'sbfmxiaoshi'
                },
            },
            sbfmxiaoshi: {
                audio: 2,
                trigger: {
                    player: 'useCard2'
                },
                usable: 1,
                direct: true,
                filter: function (event, player) {
                    if (!player.isPhaseUsing() || !player.storage.sbfmjinming_mission || !event.targets) return false;
                    if (get.type(event.card) != 'basic' && get.type(event.card) != 'trick') return false;
                    return game.hasPlayer(p => {
                        return !event.targets.contains(p) && lib.filter.targetEnabled2(event.card, player, p);
                    });
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt('sbfmxiaoshi'), '选择一名其他角色成为此牌额外目标', function (card, player, target) {
                        var targets = _status.event.getParent()._trigger.targets, card = _status.event.getParent()._trigger.card;
                        return targets && !targets.contains(target) && lib.filter.targetEnabled2(card, player, target);
                    }).set('ai', target => {
                        var trigger = _status.event.getTrigger();
                        return get.effect(target, trigger.card, trigger.player, _status.event.player);
                    });
                    'step 1'
                    if (result.bool) {
                        player.logSkill('sbfmxiaoshi', result.targets);
                        trigger.targets.addArray(result.targets);
                        //player.addTempSkill('sbfmxiaoshi_damage');
                        //player.markAuto('sbfmxiaoshi_damage', [trigger.card]);
                        trigger.sbfmxiaoshi = true;
                    }
                    else {
                        console.log(player.getHistory('useSkill'))
                        player.storage.counttrigger.sbfmxiaoshi--;
                    }
                },
                group: ['sbfmxiaoshi_damage'],
                subSkill: {
                    damage: {
                        trigger: {
                            player: 'useCardAfter'
                        },
                        charlotte: true,
                        forced: true,
                        locked: false,
                        filter: function (event, player) {
                            return player.storage.sbfmjinming_mission && event.sbfmxiaoshi && !game.hasPlayer2(current => current.hasHistory('damage', evt => evt.card == event.card));
                        },
                        content: function () {
                            'step 0'
                            event.key = ['回复过1点体力', '弃置过2张牌', '使用过3种类型的牌', '造成过4点伤害'].indexOf(player.storage.sbfmjinming_mission);
                            event.key++;
                            player.chooseTarget(get.prompt('sbfmxiaoshi'), '选择其中一名目标摸' + event.key + '张牌，若取消则失去1点体力', (card, player, target) => {
                                return trigger.targets.includes(target);
                            });
                            'step 1'
                            if (result.bool) result.targets[0].draw(event.key);
                            else player.loseHp();
                        },
                    },
                },
                ai: {
                    combo: 'sbfmjinming'
                },
            },
            sbfmyanliang: {
                audio: 2,
                zhuSkill: true,
                global: 'sbfmyanliang_give',
                subSkill: {
                    used: {
                        charlotte: true
                    },
                    give: {
                        audio: 'sbfmyanliang',
                        enable: 'phaseUse',
                        usable: 1,
                        discard: false,
                        lose: false,
                        delay: false,
                        line: true,
                        prepare: function (cards, player, targets) {
                            targets[0].logSkill('sbfmyanliang');
                        },
                        prompt: function () {
                            var player = _status.event.player;
                            var list = game.filterPlayer(target => {
                                return target != player && target.hasZhuSkill('sbfmyanliang', player) && !target.hasSkill('sbfmyanliang_used');
                            });
                            let str = '将一张装备牌交给' + get.translation(list);
                            if (list.length > 1) str += '中的一人';
                            str += '，然后视为使用一张【酒】';
                            return str;
                        },
                        filter: function (event, player) {
                            if (player.group != 'qun') return false;
                            if (player.countCards('he', card => lib.skill.sbfmyanliang_give.filterCard(card))) return false;
                            if (!player.canUse({ name: 'jiu', isCard: true }, player, true, true)) return false;
                            return game.hasPlayer(target => lib.skill.sbfmyanliang_give.filterTarget(null, player, target));
                        },
                        filterCard: function (card) {
                            return get.type(card) == 'equip';
                        },
                        filterTarget: function (card, player, target) {
                            return target != player && target.hasZhuSkill('sbfmyanliang', player) && !target.hasSkill('sbfmyanliang_used');
                        },
                        content: function () {
                            player.give(cards, target);
                            player.useCard({ name: 'jiu', isCard: true }, player);
                            target.addTempSkill('sbfmyanliang_used', 'phaseUseEnd');
                        },
                        ai: {
                            expose: 0.3,
                            order: function () {
                                return get.order({ name: 'jiu' }) + 0.2;
                            },
                            result: {
                                target: 5,
                            },
                        },
                    },
                },
            },
            //谋孔融
            sbfmliwen: {
                audio: 2,
                trigger: {
                    player: 'phaseEnd'
                },
                filter: function (event, player) {
                    return game.hasPlayer(current => current.hasMark('sbfmliwen'));
                },
                forced: true,
                locked: false,
                content: function () {
                    'step 0'
                    if (player.hasMark('sbfmliwen') && game.hasPlayer(t => t != player && t.countMark('sbfmliwen') < 5)) {
                        player.chooseTarget('是否发动【立文】？', '将任意枚“贤”标记分配给任意其他角色', (card, player, target) => target !== player && target.countMark('sbfmliwen') < 5)
                            .set('ai', target => get.attitude(_status.event.player, target) * (target.countCards('h') + 1));
                    } else event.goto(2);
                    'step 1'
                    if (result.bool) {
                        player.line(result.targets[0]);
                        player.removeMark('sbfmliwen', 1);
                        result.targets[0].addMark('sbfmliwen', 1);
                        if (player.hasMark('sbfmliwen') && game.hasPlayer(t => t != player && t.countMark('sbfmliwen') < 5)) event.goto(0);
                    } else event.goto(2);

                    'step 2'
                    event.targets = game.filterPlayer(target => target.hasMark('sbfmliwen')).sort((a, b) => b.countMark('sbfmliwen') - a.countMark('sbfmliwen'));
                    if (!event.targets.length) return;
                    player.line(event.targets);
                    'step 3'
                    event.current = event.targets.shift();
                    event.current.chooseToUse(function (card) {
                        var evt = _status.event;
                        if (!lib.filter.cardEnabled(card, evt.player, evt)) return false;
                        return get.position(card) == 'h';
                    }, '###立文###<div class="text center">使用一张手牌，或移去所有“贤”标记并令' + get.translation(player) + '摸等量的牌</div>')
                        .set('addCount', false);
                    'step 4'
                    if (!result.bool) {
                        var num = event.current.countMark('sbfmliwen');
                        event.current.clearMark('sbfmliwen');
                        player.draw(num);
                    }
                    'step 5'
                    if (event.targets.length) event.goto(3);
                },
                intro: {
                    name2: '贤',
                    content: 'mark',
                },
                marktext: '贤',
                group: ['sbfmliwen_init', 'sbfmliwen_gain'],
                subSkill: {
                    init: {
                        audio: 'sbfmliwen',
                        trigger: {
                            global: 'phaseBefore',
                            player: 'enterGame'
                        },
                        filter: function (event, player) {
                            return event.name != 'phase' || game.phaseNumber == 0;
                        },
                        forced: true,
                        locked: false,
                        content: function () {
                            player.addMark('sbfmliwen', 3);
                        },
                    },
                    gain: {
                        audio: 'sbfmliwen',
                        trigger: {
                            player: 'useCard'
                        },
                        filter: function (event, player) {
                            if (player.countMark('sbfmliwen') >= 5) return false;
                            var history = player.getHistory('useCard');
                            if (history.length <= 1) return false;
                            var evt = history[history.length - 2];
                            if (!evt || !evt.card) return false;
                            return get.suit(evt.card) == get.suit(event.card) || get.type2(evt.card) == get.type2(event.card);
                        },
                        forced: true,
                        locked: false,
                        content: function () {
                            player.addMark('sbfmliwen', 1);
                        },
                        mod: {
                            aiOrder(player, card, num) {
                                if (typeof card == 'object' && _status.currentPhase === player) {
                                    const evt = player.getLastUsed(1);
                                    if (evt && evt.card && ((get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) || (evt.card.number && evt.card.number == get.number(card)))) {
                                        return num + 10;
                                    }
                                }
                            },
                        },
                    },
                },
                ai: {
                    threaten: 3
                },
            },
            sbfmzhengyi: {
                audio: 2,
                trigger: {
                    global: 'damageBegin4'
                },
                filter: function (event, player) {
                    return !event.nature && event.player && event.player.hasMark('sbfmliwen') && game.hasPlayer(target => target != event.player && target.hasMark('sbfmliwen'));
                },
                logTarget: function (event, player) {
                    return game.hasPlayer(target => target != event.player && target.hasMark('sbfmliwen'));
                },
                direct: true,
                content: function () {
                    'step 0'
                    event.targets = game.filterPlayer(target => target != trigger.player && target.hasMark('sbfmliwen'));
                    event.resultx = [];
                    'step 1'
                    event.current = event.targets.shift();
                    event.current.chooseBool()
                        .set('prompt', '是否失去' + trigger.num + '点体力，为' + get.translation(trigger.player) + '取消此次伤害？')
                        .set('choice', (function (player, trigger) {
                            var target = trigger.player, eff1 = get.damageEffect(target, trigger.source, player);
                            if (trigger.num > 1) eff1 = Math.min(-1, eff1) * trigger.num;
                            var eff2 = get.effect(player, { name: 'losehp' }, player, player) * trigger.num;
                            return eff2 > eff1;
                        })(player, trigger));
                    'step 2'
                    if (result.bool) event.resultx.push(event.current);
                    if (event.targets.length) event.goto(1);
                    'step 3'
                    if (event.resultx.length) {
                        player.logSkill('sbfmzhengyi');
                        trigger.cancel();
                        for (var i of event.resultx) {
                            if (event.resultx.includes(i) && i.hp == Math.max(...event.resultx.slice().map(i => i.hp))) i.loseHp(trigger.num);
                        }
                    }
                },
            },
            sbfmguanbian: {
                audio: 2,
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                forced: true,
                filter: function (event, player) {
                    return (event.name != 'phase' || game.phaseNumber == 0);
                },
                content: function () {
                    if (!player.storage.sbfmguanbian) player.storage.sbfmguanbian = game.players.length;
                    player.addSkill("sbfmguanbian_1");
                },
                onremove: function (player) {
                    player.removeSkill('sbfmguanbian_1');
                },
                group: ["sbfmguanbian_2"],
                subSkill: {
                    "1": {
                        mod: {
                            globalFrom: function (from, to, distance) {
                                if (from.storage.sbfmguanbian) return distance + from.storage.sbfmguanbian;
                            },
                            globalTo: function (from, to, distance) {
                                if (to.storage.sbfmguanbian) return distance + to.storage.sbfmguanbian;
                            },
                            maxHandcard: function (player, num) {
                                if (player.storage.sbfmguanbian) return num + player.storage.sbfmguanbian;
                            },
                        },
                        sub: true,
                        parentskill: "sbfmguanbian",
                    },
                    "2": {
                        trigger: {
                            player: ["logSkill", "useSkillAfter"],
                            global: "roundFinish",
                        },
                        silent: true,
                        firstDo: true,
                        noHidden: true,
                        forced: true,
                        popup: false,
                        filter: function (event, player, name) {
                            if (name == 'roundFinish') return game.roundNumber == 2;
                            if (event.type != 'player') return false;
                            var skill = event.sourceSkill || event.skill;
                            return skill == 'sbfmfengshang' || skill == 'sbfmxiongni';
                        },
                        content: function () {
                            player.removeSkill('sbfmguanbian');
                        },
                        sub: true,
                        parentskill: "sbfmguanbian",
                    },
                },
            },
            sbfmxiongni: {
                trigger: {
                    player: "phaseUseBegin",
                },
                audio: 2,
                direct: true,
                filter: function (event, player) {
                    return player.countDiscardableCards(player, 'he')
                },
                content: function () {
                    'step 0'
                    var targets = game.filterPlayer();
                    targets.remove(player);
                    targets.sort(lib.sort.seat);
                    event.targets = targets;
                    player.chooseToDiscard('he', get.prompt('sbfmxiongni')).logSkill = ['sbfmxiongni', targets];
                    'step 1'
                    if (result.bool) {
                        event.count = 0;
                        event.suit = get.suit(result.cards[0]);
                    }
                    else event.finish();
                    'step 2'
                    event.targetx = event.targets[event.count];
                    event.targetx.chooseToDiscard('he', { suit: event.suit }, '弃置一张' + (get.translation(event.suit)) + '牌，否则' + (get.translation(player)) + '对你造成一点伤害');
                    'step 3'
                    if (!result.bool) event.targetx.damage();
                    event.count++;
                    'step 4'
                    if (event.count < event.targets.length) event.goto(2);
                },
            },
            sbfmfengshang: {
                audio: 2,
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    var suit = []; var cards = [];
                    game.getGlobalHistory('cardMove', evt => {
                        if (evt.name == 'lose' && evt.position == ui.discardPile || evt.name == 'cardsDiscard') {
                            cards.addArray(evt.cards.filterInD('d'));
                            for (var i of evt.cards.filterInD('d')) {
                                suit.add(get.suit(i));
                            }
                        }
                    });
                    return cards.length != suit.length;
                },
                content: function () {
                    'step 0'
                    var cards = [];
                    game.getGlobalHistory('cardMove', evt => {
                        if (evt.name == 'lose' && evt.position == ui.discardPile || evt.name == 'cardsDiscard') {
                            cards.addArray(evt.cards.filterInD('d'));
                        }
                    });
                    if (cards.length) {
                        player.chooseButton(['封赏：选择两张花色相同的牌', cards], true, 2).set('filterButton', function (button) {
                            if (!ui.selected.buttons.length) return true;
                            return get.suit(button.link) == get.suit(ui.selected.buttons[0].link);
                        }).set('ai', button => {
                            return get.value(button.link, _status.event.player);
                        });
                    }
                    'step 1'
                    if (result.bool) {
                        event.cards = result.links;
                        player.chooseTarget('请选择两名角色。先选择的角色获得' + get.translation(result.links[0]) + '，后选的角色获得' + get.translation(result.links[1]) + '', true, 2);
                    }
                    else event.finish();
                    'step 2'
                    if (result.bool) {
                        result.targets[0].gain(event.cards[0], 'gain2');
                        result.targets[1].gain(event.cards[1], 'gain2');
                        if (!result.targets.contains(player)) player.useCard({ name: 'jiu' }, player, false);
                    }
                },
                group: ["sbfmfengshang_1"],
                subSkill: {
                    "1": {
                        audio: 'sbfmfengshang',
                        trigger: {
                            global: "dying",
                        },
                        direct: true,
                        filter: function (event, player) {
                            var suit = []; var cards = [];
                            game.getGlobalHistory('cardMove', evt => {
                                if (evt.name == 'lose' && evt.position == ui.discardPile || evt.name == 'cardsDiscard') {
                                    cards.addArray(evt.cards.filterInD('d'));
                                    for (var i of evt.cards.filterInD('d')) {
                                        suit.add(get.suit(i));
                                    }
                                }
                            });
                            return cards.length != suit.length;
                        },
                        content: function () {
                            'step 0'
                            var cards = [];
                            game.getGlobalHistory('cardMove', evt => {
                                if (evt.name == 'lose' && evt.position == ui.discardPile || evt.name == 'cardsDiscard') {
                                    cards.addArray(evt.cards.filterInD('d'));
                                }
                            });
                            if (cards.length) {
                                player.chooseButton(['封赏：选择两张花色相同的牌', cards], 2).set('filterButton', function (button) {
                                    if (!ui.selected.buttons.length) return true;
                                    return get.suit(button.link) == get.suit(ui.selected.buttons[0].link);
                                }).set('ai', button => {
                                    return get.value(button.link, _status.event.player);
                                });
                            }
                            'step 1'
                            if (result.bool) {
                                event.cards = result.links;
                                player.chooseTarget('请选择两名角色。先选择的角色获得' + get.translation(result.links[0]) + '，后选的角色获得' + get.translation(result.links[1]) + '', true, 2);
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                result.targets[0].gain(event.cards[0], 'gain2');
                                result.targets[1].gain(event.cards[1], 'gain2');
                                if (!result.targets.contains(player)) player.useCard({ name: 'jiu' }, player, false);
                            }
                        },
                        sub: true,
                        parentskill: "sbfmguanbian",
                    },
                },
            },
            sbfmzhibing: {
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                audio: 2,
                forced: true,
                zhuSkill: true,
                init: function (player, skill) {
                    if (!player.storage[skill]) player.storage[skill] = [3, 6, 9];
                },
                filter: function (event, player) {
                    var num = 0;
                    for (var i of game.filterPlayer(current => {
                        return current.group == 'qun' && current != player;
                    })) num += i.getAllHistory('useCard', function (evt) {
                        return get.color(evt.card) == 'black'
                    }).length;
                    return player.storage.sbfmzhibing.length && num >= player.storage.sbfmzhibing[0];
                },
                content: function () {
                    var num = 0;
                    for (var i of game.filterPlayer(current => {
                        return current.group == 'qun' && current != player;
                    })) num += i.getAllHistory('useCard', function (evt) {
                        return get.color(evt.card) == 'black'
                    }).length;
                    for (var i of player.storage.sbfmzhibing) {
                        if (num >= i) {
                            player.storage.sbfmzhibing.remove(i);
                            if (i == 3) {
                                player.gainMaxHp();
                                player.recover();
                            }
                            if (i == 6) player.addSkill("dcfencheng");
                            if (i == 9) player.addSkill("benghuai");
                        }
                    }
                },
            },
            sbfmbojue: {
                audio: 2,
                enable: 'phaseUse',
                usable: 2,
                filterTarget: lib.filter.notMe,
                contentBefore: function () {
                    event.getParent()._sbfmbojue1_targets = [];
                    event.getParent()._sbfmbojue2_targets = [];
                },
                content: function () {
                    'step 0'
                    if (!target.isIn()) {
                        event.finish();
                        return;
                    }
                    event.target = target;
                    target.chooseControl().set('choiceList', [
                        '令自己摸一张牌',
                        '令自己弃一张牌',
                    ]);
                    'step 1'
                    if (result.index == 0) {
                        event.getParent()._sbfmbojue1_targets.push(target);
                    } else {
                        event.getParent()._sbfmbojue2_targets.push(target);
                    }
                    'step 2'
                    player.chooseControl().set('choiceList', [
                        '令自己摸一张牌',
                        '令自己弃一张牌',
                    ]);
                    'step 3'
                    if (result.index == 0) {
                        event.getParent()._sbfmbojue1_targets.push(player);
                    } else {
                        event.getParent()._sbfmbojue2_targets.push(player);
                    }
                    'step 4'
                    var targetsx = event.getParent()._sbfmbojue1_targets;
                    var targetsy = event.getParent()._sbfmbojue2_targets;
                    for (var i of targetsx) i.draw();
                    for (var i of targetsy) i.chooseToDiscard('he', true);
                    var num = Math.abs(targetsx.length - targetsy.length);
                    if (num === 0) {
                        if (target.countCards('he') > 0) {
                            player.discardPlayerCard(target, "he", true);
                        }
                        if (player.countCards('he') > 0) {
                            target.discardPlayerCard(player, "he", true);
                        }
                    } else {
                        var cardx = {
                            name: "sha",
                            isCard: true
                        };
                        if (player.canUse(cardx, target)) player.useCard(cardx, target);
                        if (target.canUse(cardx, player)) target.useCard(cardx, player);
                    }
                },
                ai: {
                    order: 8,
                    result: {
                        player: 1
                    },
                },
            },
            sbfmyangwei: {
                audio: 2,
                trigger: {
                    global: 'phaseEnd'
                },
                forced: true,
                filter: function (event, player) {
                    return player.hasMark('sbfmyangwei_1') || player.hasMark('sbfmyangwei_2');
                },
                content: function () {
                    if (player.hasMark('sbfmyangwei_1'))
                        player.removeMark('sbfmyangwei_1', player.countMark('sbfmyangwei_1'));
                    if (player.hasMark('sbfmyangwei_2'))
                        player.removeMark('sbfmyangwei_2', player.countMark('sbfmyangwei_2'));
                },
                group: ['sbfmyangwei_1', 'sbfmyangwei_2'],
                subSkill: {
                    1: {
                        trigger: {
                            player: ['gainAfter'],
                        },
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            if (event.getParent().name !== "draw" || event.getParent("phaseDraw").player === player) return false;
                            return true;
                        },
                        content: function () {
                            player.addMark('sbfmyangwei_1');
                            if (player.countMark('sbfmyangwei_1') === 2) {

                                player.addSkill('sbfmyangwei_3');
                                player.addMark('sbfmyangwei_3');
                            } else event.finish();
                        },
                    },
                    2: {
                        trigger: {
                            player: "loseAfter",
                            global: "loseAsyncAfter",
                        },
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            if (event.type != "discard" || event.getlx === false || event.getParent("phaseDiscard").player === player) return false;

                            return true;
                        },
                        content: function () {
                            player.addMark('sbfmyangwei_2');
                            if (player.countMark('sbfmyangwei_2') === 2) {

                                player.addSkill('sbfmyangwei_4');
                                player.addMark('sbfmyangwei_4');
                            } else event.finish();
                        },
                    },
                    3: {
                        charlotte: true,
                        onremove: true,
                        trigger: {
                            source: "damageBegin1"
                        },
                        forced: true,
                        audio: 'sbfmyangwei',
                        content: function () {
                            trigger.num += player.countMark('sbfmyangwei_3');
                            player.removeSkill('sbfmyangwei_3');
                        },
                        intro: {
                            name: "增伤+",
                            content: "下次造成的伤害+#",
                        },
                    },
                    4: {
                        charlotte: true,
                        onremove: true,
                        trigger: {
                            player: "damageBegin2"
                        },
                        forced: true,
                        audio: 'sbfmyangwei',
                        content: function () {
                            trigger.num += player.countMark('sbfmyangwei_4');
                            player.removeSkill('sbfmyangwei_4');
                        },
                        intro: {
                            name: "受伤+",
                            content: "下次受到的伤害+#",
                        },
                    },
                },
            },
            sbfmhulie: {
                audio: 3,
                group: ['sbfmhulie_sha', 'sbfmhulie_juedou', 'sbfmhulie_damage', 'sbfmhulie_done'],
                subSkill: {
                    sha: {
                        usable: 1,
                        trigger: { player: 'useCardToPlayered' },
                        filter: function (event, player) {
                            return event.targets.length == 1 && event.card.name == 'sha';
                        },
                        check: function (event, player, target) {
                            return get.attitude(player, event.target) < 0;
                        },
                        prompt: function (event, player) {
                            var str = '';
                            str += '是否对' + get.translation(event.target) + '发动【虎烈】令' + get.translation(event.card) + '对其造成的伤害加一？'
                            return str;
                        },
                        content: function () {
                            trigger.getParent().skill = 'sbfmhulie';
                        }
                    },
                    juedou: {
                        usable: 1,
                        trigger: { player: 'useCardToPlayered' },
                        filter: function (event, player) {
                            return event.targets.length == 1 && event.card.name == 'juedou';
                        },
                        check: function (event, player, target) {
                            return get.attitude(player, event.target) < 0;
                        },
                        prompt: function (event, player) {
                            var str = '';
                            str += '是否对' + get.translation(event.target) + '发动【虎烈】令' + get.translation(event.card) + '对其造成的伤害加一？'
                            return str;
                        },
                        content: function () {
                            trigger.getParent().skill = 'sbfmhulie';
                        }
                    },
                    damage: {
                        charlotte: true,
                        direct: true,
                        silent: true,
                        trigger: { source: 'damageBegin' },
                        filter: function (event, player) {
                            return event.getParent().skill == 'sbfmhulie';
                        },
                        content: function () {
                            trigger.num++;
                            trigger.getParent(2).sbfmhulie_damage = true;
                        }
                    },
                    done: {
                        charlotte: true,
                        direct: true,
                        silent: true,
                        priority: 5,
                        trigger: { player: 'useCardAfter' },
                        filter: function (event, player) {
                            return event.skill == 'sbfmhulie' && !event.sbfmhulie_damage && event.targets[0] && event.targets[0].isIn() && event.targets[0].canUse('sha', player);
                        },
                        content: function () {
                            'step 0'
                            player.chooseBool('是否令' + get.translation(trigger.targets[0]) + '视为对你使用【杀】').set('ai', () => { return false });
                            'step 1'
                            if (result.bool) {
                                trigger.targets[0].useCard({ name: 'sha' }, player);
                            }
                        }
                    },
                }
            },
            sbfmyipo: {
                audio: 3,
                trigger: { player: 'changeHp' },
                init: function (player) {
                    if (!player.storage.sbfmyipo) player.storage.sbfmyipo = [];
                },
                filter: function (event, player) {
                    return !player.storage.sbfmyipo.contains(player.hp) && player.hp > 0;
                },
                forced: true,
                locked: false,
                content: function () {
                    'step 0'
                    player.storage.sbfmyipo.add(player.hp);
                    player.chooseTarget('选择一名角色发动〖毅魄〗', 1, false).set('ai', target => {
                        return get.attitude(_status.event.player, target);
                    });
                    'step 1'
                    if (result.bool) {
                        event.number = Math.max(player.maxHp - player.hp, 1), event.target = result.targets[0];
                        player.chooseControl().set('choiceList', [
                            '令' + get.translation(event.target) + '摸' + event.number + '张牌并弃置1张牌',
                            '令' + get.translation(event.target) + '摸1张牌并弃置' + event.number + '张牌'
                        ]).set('ai', function () {
                            if (get.attitude(_status.event.player, _status.event.target) > 0) return '选项一';
                            return '选项二';
                        });
                    }
                    else event.finish();
                    'step 2'
                    if (result.index == 0) {
                        event.target.draw(event.number);
                        if (event.target.countCards('he') > 0) event.target.chooseToDiscard(1, true, '弃置1张牌', 'he');
                    }
                    else {
                        event.target.draw();
                        if (event.target.countCards('he') > 0) event.target.chooseToDiscard(Math.min(event.target.countCards('he'), event.number), true, '弃置' + event.number + '张牌', 'he');
                    }
                },
                group: 'sbfmyipo_init',
                subSkill: {
                    init: {
                        trigger: { global: 'roundStart' },
                        direct: true,
                        charlotte: true,
                        silent: true,
                        firstDo: true,
                        priority: Infinity,
                        filter: function (event, player) {
                            return game.roundNumber == 1 && player.storage.sbfmyipo;
                        },
                        content: function () {
                            player.storage.sbfmyipo.add(player.hp);
                        }
                    }
                }
            },
            sbfmhongtu: {
                audio: 6,
                trigger: {
                    global: ['phaseZhunbeiEnd', 'phaseJudgeEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd', 'phaseJieshuEnd']
                },
                filter: function (event, player) {
                    if (game.hasPlayer(current => {
                        return current !== player;
                    }) < 1) return;
                    let count = 0;
                    player.getHistory('gain', evt => {
                        if (evt.getParent(event.name) !== event) return;
                        count += evt.cards.length;
                    });
                    return count >= 2;
                },
                check: function (event, player) {
                    if (game.hasPlayer(current => {
                        return current !== player && get.attitude(player, current) > 0;
                    })) return true;
                    const eff = get.damageEffect(player, player, player, 'fire');
                    if (game.hasPlayer(current => {
                        return (
                            get.damageEffect(current, player, player, 'fire') > eff && player.countCards('h', card => {
                                return !current.hasUseTarget(card);
                            }) >= 2 + (player.hp > 1)
                        );
                    })) return true;
                    return false;
                },
                content: function () {
                    'step 0'
                    player.draw(3);
                    'step 1'
                    if (player.countCards('h') < 3) return;
                    player.chooseCardTarget({
                        filterCard: true,
                        selectCard: 3,
                        position: 'h',
                        filterTarget: lib.filter.notMe,
                        forced: true,
                        prompt: '鸿图：请展示三张手牌并选择一名角色',
                        prompt2: '你选择的角色须选择是否使用其中的一张牌，并令你随机弃置其中的另一张牌。',
                        hasFriend: game.hasPlayer(current => {
                            return current !== player && get.attitude(player, current) > 0;
                        }),
                        ai1: function (card) {
                            const player = _status.event.player, val = player.getUseValue(card);
                            if (_status.event.hasFriend) {
                                if (ui.selected.cards.some(cardx => {
                                    return player.getUseValue(cardx) > 5;
                                })) return -val - get.value(card);
                                return val - 5;
                            }
                            if (game.hasPlayer(current => {
                                return get.attitude(_status.event.player, current) < 0 && !current.hasUseTarget(card);
                            })) return 100 - val;
                            return -val;
                        },
                        ai2: function (target) {
                            const att = get.attitude(_status.event.player, target);
                            if (!ui.selected.cards.length) return 0;
                            if (ui.selected.cards.every(card => !target.hasUseTarget(card))) {
                                return 10 * (get.damageEffect(target, player, player, 'fire') - get.damageEffect(player, player, player, 'fire'));
                            }
                            return Math.max(...ui.selected.cards.map(card => target.getUseValue(card) * att));
                        },
                    });
                    'step 2'
                    if (result.bool) {
                        event.cards = result.cards, event.target = result.targets[0];
                    } else event.finish();
                    'step 3'
                    var target = event.target;
                    player.line(target, 'green');
                    player.showCards(event.cards, `${get.translation(player)}对${get.translation(target)}发动了【鸿图】`);
                    target.chooseButton([`鸿图：是否使用${get.translation(player)}展示的其中一张牌？`, event.cards]).set('filterButton', button => {
                        var player = _status.event.getParent().player, card = button.link;
                        var cardx = get.autoViewAs({ name: get.name(card), nature: get.nature(card) }, [card]);
                        return player.hasUseTarget(cardx, null, false);
                    })
                        .set('ai', button => {
                            return _status.event.getParent().player.getUseValue(button.link);
                        });
                    'step 4'
                    if (result.bool) {
                        event.cardx = result.links[0];
                        event.cards.remove(event.cardx);
                    } else {
                        for (var current of [target, player]) {
                            if (!current.isIn()) continue;
                            player.line(current, 'fire');
                            current.damage('fire');
                        }
                        event.finish();
                    }
                    'step 5'
                    var cardx = get.autoViewAs({ name: get.name(event.cardx), nature: get.nature(event.cardx) }, [event.cardx]);
                    const owner = get.owner(event.cards);
                    var next = target.chooseUseTarget(cardx, [event.cardx], true, false).set('throw', false).set('owner', owner).set('oncard', card => {
                        const owner = _status.event.getParent().owner;
                        if (owner) owner.$throw(card.cards);
                    });
                    if (event.cardx.name === cardx.name && get.nature(event.cardx) == get.nature(cardx)) next.set('viewAs', false);
                    'step 6'
                    if (result.bool) {
                        var restCards = event.cards.filter(card => {
                            return get.owner(card) === player && get.position(card) === 'h' && lib.filter.cardDiscardable(card, player, 'sbfmqiwu');
                        });
                        if (restCards.length) {
                            player.discard(restCards.randomGet());
                        }
                        var num = get.number(event.cardx, player);
                        if (event.cards.every(cardx => {
                            if (cardx === event.cardx) return true;
                            return get.number(cardx) < num;
                        })) {
                            target.addAdditionalSkill('sbfmhongtu', 'nzry_feijun');
                            target.addSkill('sbfmhongtu_remove');
                        }
                        else if (event.cards.every(cardx => {
                            if (cardx === event.cardx) return true;
                            return get.number(cardx) > num;
                        })) {
                            target.addSkill('sbfmhongtu_limit');
                            if (!target.storage.sbfmhongtu_limit) target.storage.sbfmhongtu_limit = [0, 0];
                            target.storage.sbfmhongtu_limit[0] += 2;
                        }
                        else {
                            target.addAdditionalSkill('sbfmhongtu', 'qianxi');
                            target.addSkill('sbfmhongtu_remove');
                        }
                    } else event.finish();
                },
                derivation: ['nzry_feijun', 'qianxi'],
                subSkill: {
                    limit: {
                        trigger: {
                            player: 'phaseEnd'
                        },
                        charlotte: true,
                        silent: true,
                        lastDo: true,
                        forced: true,
                        popup: false,
                        content: function () {
                            player.storage.sbfmhongtu_limit = [player.storage.sbfmhongtu_limit[1], 0];
                            if (!player.storage.sbfmhongtu_limit[0]) player.removeSkill('sbfmhongtu_limit');
                        },
                        mod: {
                            maxHandcard: function (player, num) {
                                return num + player.storage.sbfmhongtu_limit[0];
                            },
                        },
                        mark: true,
                        markimage: 'image/card/handcard.png',
                        intro: {
                            content: function (storage, player) {
                                return '手牌上限+' + storage;
                            },
                        },
                    },
                    remove: {
                        trigger: {
                            player: 'phaseEnd'
                        },
                        firstDo: true,
                        priority: Infinity,
                        forced: true,
                        popup: false,
                        charlotte: true,
                        content: function () {
                            player.removeAdditionalSkill('sbfmhongtu');
                            player.removeSkill('sbfmhongtu_remove');
                        },
                    },
                },
            },
            sbfmqiwu: {
                audio: 6,
                trigger: {
                    player: 'damageBegin4'
                },
                filter: function (event, player) {
                    if (player.hasSkill('sbfmqiwu_disable') || player.getHistory('damage').length != 0) return false;
                    if (!event.source) return false;
                    if (event.source != player && !event.source.inRange(player)) return false;
                    if (player.countCards('he', { color: 'red' }) < 1) return false;
                    return true;
                },
                content: function () {
                    'step 0'
                    player.chooseToDiscard(get.prompt('sbfmqiwu'), `你可以弃置一张红色牌，防止${get.translation(trigger.source)}对你造成的${trigger.num}点伤害。`, { color: 'red' }, 'he')
                        .set('ai', card => {
                            if (_status.event.goon) return 6 - get.value(card);
                            return 0;
                        }).set('goon', get.damageEffect(player, trigger.source, player) < 0);
                    'step 1'
                    if (result.bool) {
                        player.addTempSkill('sbfmqiwu_disable');
                        trigger.cancel();
                    }
                },
                subSkill: {
                    disable: {
                        mark: true,
                        intro: {
                            content: '本回合已发动'
                        },
                        sub: true,
                    },
                },
            },
            oljiewan: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                content: function () {
                    "step 0"
                    player.loseMaxHp();
                    var card = get.cardPile(function (card) {
                        var type = get.type(card, false);
                        if (type != 'trick') return false;
                        return get.tag(card, 'damage') > 0;
                    });
                    if (card) player.gain(card, 'gain2');
                    "step 1"
                    player.chooseCard('h', true, '解腕：请选择一张伤害类手牌，令此牌本回合造成伤害+1', function (card, player) {
                        var type = get.type(card, false);
                        if (type != 'basic' && type != 'trick') return false;
                        return get.tag(card, 'damage') > 0;
                    }).set('ai', (card) => 6 - get.value(card));
                    "step 2"
                    if (result.bool) {
                        player.addGaintag(result.cards, 'oljiewan');
                        player.addTempSkill("oljiewan_damage");
                        player.addTempSkill("oljiewan_2");
                    }
                },
                subSkill: {
                    damage: {
                        audio: "oljiewan",
                        trigger: { player: "useCard" },
                        forced: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.hasHistory("lose", evt => {
                                if (evt.getParent() !== event) return false;
                                return Object.values(evt.gaintag_map).some(tags => tags.includes("oljiewan"));
                            });
                        },
                        content: function () {
                            game.countPlayer(function (current) {
                                current.addTempSkill("oljiewan_1");
                            });
                        },
                    },
                    1: {
                        audio: "oljiewan",
                        trigger: {
                            player: "damageBegin4",
                        },
                        forced: true,
                        charlotte: true,
                        logTarget: "player",
                        content: function () {
                            trigger.num++;
                            player.removeSkill("oljiewan_1");
                        },
                    },
                    2: {
                        trigger: {
                            player: "useCardAfter",
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        charlotte: true,
                        filter: function (event, player) {
                            return event.notLink();
                        },
                        content: function () {
                            game.countPlayer(function (current) {
                                current.removeSkill("oljiewan_1");
                            });
                        },
                    },
                },
            },
            olpixian: {
                audio: 2,
                trigger: {
                    player: "phaseUseEnd",
                },
                filter: function (event, player) {
                    return !player.isMaxHp();
                },
                forced: true,
                content: function () {
                    'step 0'
                    var list = [];
                    list.push('回复1点体力');
                    list.push('增加1点体力上限');
                    player.chooseControl(list, true).set('ai', function () {
                        if (player.hp < player.maxHp) return '回复1点体力';
                        return '增加一点体力上限';
                    });
                    'step 1'
                    if (result.control == '回复1点体力') {
                        player.recover();
                    }
                    'step 2'
                    if (result.control == '增加1点体力上限') {
                        player.gainMaxHp();
                    }
                },
            },
            sbfmyufeng: {
                audio: 2,
                trigger: {
                    global: "phaseBefore",
                },
                filter: function (event, player) {
                    return game.phaseNumber == 0;
                },
                forced: true,
                content: function () {
                    player.equip(player.drawShadow('sizhaojian', 'diamond', 6));
                }
            },
            sbfmshenli: {
                audio: 2,
                audioname: 'sbfm_yuanshao2',
                shaRelated: true,
                owner: 'sbfm_yuanshao',
                trigger: {
                    player: "useCardToPlayered",
                },
                filter: function (event, player) {
                    return event.card.name == 'sha' && player.getHistory('useSkill', function (c) {
                        return c.skill == 'sbfmshenli'
                    }).length == 0 && event.targets;
                },
                content: function () {
                    game.players.forEach(function (c) {
                        if (c != player) trigger.targets.add(c);
                    })
                    trigger.getParent().skill = 'sbfmshenli';
                    player.swapBackground('sbfmshenli', 0);
                },
                group: ['sbfmshenli_1', 'sbfmshenli_2'],
                subSkill: {
                    1: {
                        trigger: {
                            source: "damageBegin",
                        },
                        filter: function (event, player) {
                            return event.card && event.card.name == 'sha' && event.getParent().skill == 'sbfmshenli' && event.num;
                        },
                        direct: true,
                        content: function () {
                            if (!trigger.getParent(2).totalDamage) trigger.getParent(2).totalDamage = 0;
                            trigger.getParent(2).totalDamage += trigger.num;
                        }
                    },
                    2: {
                        trigger: { player: 'useCardAfter' },
                        filter: function (event, player) {
                            return event.card && event.card.name == 'sha' && event.totalDamage;
                        },
                        direct: true,
                        content: function () {
                            if (trigger.totalDamage > player.countCards('h')) player.draw(Math.min(5, trigger.totalDamage));
                            if (trigger.totalDamage > player.hp) {
                                player.useCard(trigger.card, trigger.targets, false);
                            }
                        }
                    }
                },

            },
            sbfmhetao: {
                audio: 2,
                audioname: 'sbfm_yuanshao2',
                trigger: {
                    global: 'useCard'
                },
                direct: true,
                owner: 'sbfm_yuanshao',
                filter: function (event, player) {
                    return event.card && event.card.suit && player.countCards('h', { color: get.color(event.card) }) && event.targets && event.targets.length > 1 && event.player != player;
                },
                content: function () {
                    'step 0'
                    player.chooseToDiscard('he', '弃置一张' + get.translation(get.color(trigger.card)) + '牌', function (card) {
                        return get.color(card) == get.color(trigger.card);
                    }).set('ai', function (card) {
                        var player = _status.event.player;
                        var check = game.hasPlayer(function (c) {
                            return _status.event.getParent()._trigger.targets.contains(c) && get.attitude(c, player) < 0;
                        })
                        return (check ? 8 : 0) - get.value(card);
                    })
                    'step 1'
                    if (result.bool) {
                        player.chooseTarget('选择其中一名目标，令' + get.translation(trigger.card.name) + '对其结算两次', 1, true, (card, player, target) => {
                            return trigger.targets.contains(target);
                        }).set('ai', target => {
                            return -get.attitude(_status.event.player, target);
                        });
                    }
                    else event.finish();
                    'step 2'
                    if (result.bool) {
                        trigger.targets.length = 0;
                        player.logSkill('sbfmhetao', result.targets[0]);
                        trigger.targets.add(result.targets[0]);
                        trigger.effectCount++;
                        player.swapBackground('sbfmshenli', 1);
                    }
                },
                ai: {
                    expose: 0.6
                }
            },
            sbfmshishou: {
                audio: 2,
                zhuSkill: true,
                trigger: {
                    global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
                },
                direct: true,
                filter: function (event, player) {
                    if (!event.player || event.player == player || !event.player.isIn()) return false;
                    var evt = event.getl(event.player);
                    return evt && evt.es && evt.es.length > 0 && player.hasZhuSkill('sbfmshishou') && game.phaseNumber > 0;
                },
                content: function () {
                    'step 0'
                    trigger.player.chooseBool('是否发动【士首】，令' + get.translation(player) + '获得【思召剑】').set('choice', get.attitude(trigger.player, player) > 0);
                    'step 1'
                    if (result.bool) {
                        var card = get.cardPile2(function (card) {
                            return card.name == 'sizhaojian';
                        });
                        if (card) {
                            player.gain(card, 'gain2');
                            player.equip(card);
                        }
                        else {
                            var card2 = get.discardPile(function (card) {
                                return card.name == 'sizhaojian';
                            });
                            if (card2) {
                                player.gain(card2, 'gain2');
                                player.equip(card2);
                            }
                            else trigger.player.popup('装备失败');
                        }
                    }
                }
            },
            sizhao_skill: {
                equipSkill: true,
                audio: true,
                trigger: {
                    player: "useCardToTargeted",
                },
                filter: function (event) {
                    return event.card.name == 'sha' && event.card.number;
                },
                forced: true,
                logTarget: "target",
                content: function () {
                    'step 0'
                    trigger.target.addTempSkill('sizhao_skill2');
                    'step 1'
                    trigger.target.storage.sizhao_skill = trigger.card.number;
                },
                ai: {
                    skillTagFilter: function (player, tag, arg) {
                        if (arg && arg.name == 'sha') return true;
                        return false;
                    },
                    aiValue: (player, card, val) => {
                        var num = get.number(card);
                        if (get.number(card) && card.name == 'sha') return val + (get.number(card));
                    },
                },
            },
            sizhao_skill2: {
                firstDo: true,
                init: function (player, skill) {
                    if (!player.storage.sizhao_skill) player.storage.sizhao_skill = 0
                },
                trigger: {
                    player: ["damage", "damageCancelled", "damageZero"],
                    source: ["damage", "damageCancelled", "damageZero"],
                    target: ["shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized"],
                    global: ["useCardEnd"],
                },
                charlotte: true,
                filter: function (event, player) {
                    return player.storage.sizhao_skill && event.card && (event.name != 'damage' || event.notLink());
                },
                silent: true,
                forced: true,
                popup: false,
                priority: 12,
                content: function () {
                    player.removeSkill('sizhao_skill');
                },
                onremove: function (player) {
                    delete player.storage.sizhao_skill;
                },
                mod: {
                    cardEnabled: function (card, player) {
                        if (card.number < player.storage.sizhao_skill) return false;
                    },
                },
                marktext: "※",
                intro: {
                    content: function (storage, player) {
                        return '不能使用点数小于' + player.storage.sizhao_skill + '的【闪】';
                    },
                },
            },
            sbfmdulie: {
                audio: 2,
                trigger: { global: 'useCardToTargeted' },
                filter: function (event, player) {
                    return (get.type(event.card) == 'trick' || get.type(event.card) == 'basic') && event.targets.length == 1 && event.targets[0] == player && player.getHistory('useSkill', function (evt) {
                        return evt.name == 'sbfmdulie'
                    }).length == 0 && event.player != player;
                },
                content: function () {
                    trigger.getParent().effectCount += 1;
                    player.draw(Math.min(player.getAttackRange(true), 5));
                }
            },
            sbfmdouchan: {
                audio: 2,
                trigger: { player: 'phaseZhunbeiBegin' },
                forced: true,
                locked: true,
                init: function (player) {
                    player.storage.sbfmdouchan = 0;
                },
                content: function () {
                    var card = get.cardPile2(function (i) {
                        return get.name(i) == 'juedou';
                    });
                    if (card) player.gain(card, 'gain2');
                    else {
                        if (player.storage.sbfmdouchan < game.players.length) player.storage.sbfmdouchan++;
                    }
                },
                mod: {
                    attackRange: (player, num) => {
                        return num + player.storage.sbfmdouchan;
                    },
                    cardUsable: function (card, player, num) {
                        if (card.name == 'sha') return num + player.storage.sbfmdouchan;
                    },
                }
            },
            sbfmweilin: {
                audio: 2,
                enable: 'chooseToUse',
                filter: function (event, player) {
                    return player.countCards('h') > 0 && player.getHistory('useSkill', function (e) {
                        return e.skill == 'sbfmweilin_backup'
                    }).length == 0;
                },
                hiddenCard: function (player, name) {
                    return name == 'sha' && name == 'jiu';
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        list.push(['基本', '', 'sha']);
                        for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
                        list.push(['基本', '', 'jiu']);
                        return ui.create.dialog('威临', [list, 'vcard']);
                    },
                    filter: function (button, player) {
                        return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                    },
                    check: function (button) {
                        var player = _status.event.player;
                        if (player.countCards('hs', button.link[2]) > 0) return 0;
                        var effect = player.getUseValue(button.link[2]);
                        if (effect > 0) return effect;
                        return 0;
                    },
                    backup: function (links, player) {
                        return {
                            filterCard: true,
                            audio: 'sbfmweilin',
                            selectCard: 1,
                            popname: true,
                            check: function (card) {
                                return 6 - get.value(card);
                            },
                            position: 'hes',
                            viewAs: { name: links[0][2], nature: links[0][3] },
                            onuse: function (result, player) {
                                //player.storage.taoluan.add(result.card.name);
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                    },
                },
                group: 'sbfmweilin_use',
                subSkill: {
                    use: {
                        trigger: { player: 'useCard' },
                        direct: true,
                        filter: function (event, player) {
                            return event.skill == 'sbfmweilin_backup' && event.targets && event.card && event.card.suit;
                        },
                        content: function () {
                            trigger.targets[0].storage.sbfmweilin_suit = trigger.card.suit;
                            trigger.targets[0].addTempSkill('sbfmweilin_suit', 'phaseEnd');
                        },
                    },
                    suit: {
                        onremove: function (player) {
                            delete player.storage.sbfmweilin_suit;
                        },
                        charlotte: true,
                        mod: {
                            cardname: function (card, player) {
                                if ((player.storage.sbfmweilin_suit == 'heart' || player.storage.sbfmweilin_suit == 'diamond') && get.color(card) == 'red') return 'sha';
                                if ((player.storage.sbfmweilin_suit == 'spade' || player.storage.sbfmweilin_suit == 'club') && get.color(card) == 'black') return 'sha';
                            },
                            cardnature: function (card, player) {
                                if ((player.storage.sbfmweilin_suit == 'heart' || player.storage.sbfmweilin_suit == 'diamond') && get.color(card) == 'red') return 'false';
                                if ((player.storage.sbfmweilin_suit == 'spade' || player.storage.sbfmweilin_suit == 'club') && get.color(card) == 'black') return 'false';
                            },
                        },
                    }
                }
            },
            sbfmduoshou: {
                audio: 2,
                mod: {
                    targetInRange: function (card, player, target) {
                        if (get.color(card) == 'red' && player.getHistory('useCard', function (e) {
                            return e.card && get.color(e.card) == 'red';
                        }).length == 0) {
                            return true;
                        }
                    },
                    cardUsable: function (card, player, num) {
                        if (player.getHistory('useCard', function (e) {
                            return e.card && get.type(e.card) == 'basic' && e.card.name;
                        }).length > 0) {
                            var cd = player.getHistory('useCard', function (e) {
                                return e.card && get.type(e.card) == 'basic' && e.card.name;
                            })[0].card.name;
                            if (card.name == cd && player.getHistory('useCard', function (e) {
                                return e.card && e.card.name == cd;
                            }).length == 1) return num + 1;
                        }
                    },
                },
                forced: true,
                trigger: {
                    source: "damageSource",
                },
                filter: function (event, player) {
                    return player.getHistory('gain', (e) => {
                        return e.getParent(2).name == 'sbfmduoshou'
                    }).length == 0;
                },
                content: function () {
                    player.draw();
                }
            },
            sbfmzhuri: {
                direct: true,
                lastDo: true,
                init: function (player) {
                    player.storage.sbfmzhuri_count = 0;
                },
                trigger: {
                    player: ['phaseZhunbeiEnd', 'phaseJudgeEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd', 'phaseJieshuEnd'],
                },
                filter: function (event, player) {
                    return player.storage.sbfmzhuri_count - player.countCards('h') != 0 && !player.hasSkill('sbfmzhuri_rec');
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt('sbfmzhuri'), false, (card, player, target) => {
                        return player.canCompare(target);
                    }).set('ai', (target) => -get.attitude(target, _status.event.player));
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        event.target = target;
                        player.logSkill('sbfmzhuri', target);
                        player.chooseToCompare(target);
                    }
                    else event.finish();
                    'step 2'
                    if (result.bool) {
                        var cards = [];
                        game.getGlobalHistory('cardMove', evt => {
                            if (evt.getParent(3) == event) cards.addArray(evt.cards.filterInD('d'));
                        });
                        if (cards.length) {
                            event.cards = cards;
                        }
                        else event.finish();
                    }
                    else {
                        player.chooseControl(['失去1点体力', '本回合失去逐日']).set('ai', () => {
                            if (_status.event.getParent('phaseDiscard')) return '本回合失去逐日';
                            if (_status.event.player.hp > 2) return '失去1点体力';
                            return '本回合失去逐日';
                        });
                    }
                    'step 3'
                    if (result && result.control) {
                        if (result.control == '失去1点体力') player.loseHp();
                        else player.addTempSkill('sbfmzhuri_rec', 'phaseEnd');
                        event.finish();
                    }
                    else {
                        var cardsx = event.cards.filter(i => get.position(i, true) == 'd' && player.hasUseTarget(i));
                        if (!cardsx.length) event.finish();
                        else player.chooseButton(['请使用一张拼点牌', cardsx]).set('filterButton', button => {
                            return _status.event.player.hasUseTarget(button.link);
                        })
                    }
                    'step 4'
                    if (result.bool) {
                        var card = result.links[0];
                        player.chooseUseTarget(true, card, false);
                    }
                },
                group: 'sbfmzhuri_act',
                subSkill: {
                    rec: { charlotte: true },
                    act: {
                        forced: true,
                        charlotte: true,
                        popup: false,
                        firstDo: true,
                        trigger: {
                            player: ['phaseZhunbeiBegin', 'phaseJudgeBegin', 'phaseDrawBegin', 'phaseUseBegin', 'phaseDiscardBegin', 'phaseJieshuBegin'],
                        },
                        content: function () {
                            player.storage.sbfmzhuri_count = player.countCards('h');
                        }
                    }
                }
            },
            sbfmranji: {
                limited: true,
                trigger: { player: 'phaseJieshuBegin' },
                priority: 9,
                direct: true,
                record: function (player) {
                    var phase = {}
                    for (var i = 0; i < lib.phaseName.length; i++) phase[lib.phaseName[i]] = [];
                    player.getHistory('useCard', function (evt) {
                        for (var i in phase) {
                            if (evt.getParent(i) && evt.getParent(i).name && lib.phaseName.contains(i)) phase[i].add(evt);
                        }
                    })
                    var num = 0;
                    for (var i in phase) {
                        if (phase[i].length > 0) num++;
                    }
                    return num;
                },
                intro: {
                    content: function (storage, player) {
                        if (!player.awakenedSkills.includes('sbfmranji')) {
                            if (lib.skill.sbfmranji.record(player) == 0) return '本回合没有阶段使用过牌';
                            return '本回合已有' + lib.skill.sbfmranji.record(player) + '个阶段使用过牌';
                        }
                    }
                },
                content: function () {
                    'step 0'
                    var prompt = '是否发动燃己，获得';
                    var num = lib.skill.sbfmranji.record(player);
                    event.num = num;
                    if (num > player.hp) prompt += '【困奋】';
                    else if (num < player.hp) prompt += '【诈降】';
                    else prompt += '【困奋】和【诈降】';
                    player.chooseBool(prompt);
                    'step 1'
                    if (result.bool) {
                        player.awakenSkill('sbfmranji');
                        player.logSkill('sbfmranji');
                        if (event.num >= player.hp) {
                            player.addSkill('kunfen');
                            if (!player.storage.kunfen) player.storage.kunfen = true;
                        }
                        if (event.num <= player.hp) player.addSkill('zhaxiang');
                        player.chooseControl(['手牌', '体力']).set('prompt', '选择一项调整至上限');
                    }
                    else event.finish();
                    'step 2'
                    if (result.control == '手牌') {
                        var hn = player.countCards('h');
                        if (hn > player.getHandcardLimit()) player.chooseToDiscard('h', hn - player.getHandcardLimit(), true);
                        if (hn < player.getHandcardLimit()) player.draw(player.getHandcardLimit() - hn);
                    }
                    else {
                        if (player.hp < player.maxHp) player.recover(player.maxHp - player.hp);
                    }
                    'step 3'
                    player.addTempSkill('sbfmranji_fob', {
                        source: 'dieAfter',
                    });
                    player.buff.forbidRecover = true;
                },
                subSkill: {
                    fob: {
                        charlotte: true,
                        silent: true,
                        onremove: function (player) {
                            delete player.buff.forbidRecover;
                        }
                    },
                }
            },
            sbfmfumeng: {
                audio: 2,
                trigger: { global: 'roundStart' },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseCard('h', get.prompt('sbfmfumeng'), '选择任意张牌令其视为【杀】', [1, player.countCards('h')]).set('ai', function (card) {
                        return 5.5 - get.value(card);
                    });
                    'step 1'
                    if (result.bool) {
                        result.cards.forEach((card) => { card.addGaintag('sbfmfumeng') });
                    }
                },
                mod: {
                    cardname: function (card, player) {
                        if (card.hasGaintag('sbfmfumeng')) return 'sha';
                    },
                    cardnature: function (card, player) {
                        if (card.hasGaintag('sbfmfumeng')) return false;
                    },
                }
            },
            sbfmguidao: {
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player) {
                    return (!player.storage.sbfmguidao || player.storage.sbfmguidao < 2) && game.hasPlayer(function (cur) {
                        return player.canUse('juedou', cur);
                    }) && player.countCards('he') >= 2;
                },
                selectCard: 2,
                complexCard: true,
                position: 'he',
                filterCard: function (card, player, event) {
                    if (ui.selected.cards.length) {
                        if (player.storage.sbfmguidao == 1 || (player.storage.sbfmguidao == 0 && get.name(ui.selected.cards[0]) != 'sha')) return get.name(card) == 'sha';
                        else return true;
                    }
                    else {
                        if (player.storage.sbfmguidao == 1) return get.name(card) == 'sha';
                        else return true;
                    }
                },
                filterTarget: function (card, player, target) {
                    return player.canUse('juedou', target);
                },
                discard: false,
                lose: false,
                visible: true,
                content: function () {
                    'step 0'
                    player.chongzhu(cards);
                    var num = 0;
                    cards.forEach(function (card) {
                        if (get.name(card) == 'sha') num++
                    });
                    player.storage.sbfmguidao = num;
                    'step1'
                    if (player.canUse('juedou', target, false)) player.useCard(false, target, {
                        name: 'juedou',
                        isCard: false,
                    }, 'noai')
                },
                group: ['sbfmguidao_1', 'sbfmguidao_2'],
                subSkill: {
                    1: {
                        trigger: { player: 'phaseEnd' },
                        priority: 20,
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.storage.sbfmguidao;
                        },
                        content: function () {
                            delete player.storage.sbfmguidao;
                        }
                    },
                    2: {
                        trigger: { source: 'damageBegin' },
                        direct: true,
                        filter: function (event, player) {
                            return event.card.name == 'juedou' && event.player != player && event.getParent(3).name == 'sbfmguidao';
                        },
                        content: function () {
                            'step 0'
                            trigger.player.chooseControl(['杀', '非杀']).set('prompt', '猜测' + get.translation(player) + '手牌中【杀】与非【杀】的数量哪个多').set('ai', function (card) {
                                var num = [1, 2].randomGet();
                                if (num == 1) return '杀';
                                else return '非杀';
                            });
                            'step 1'
                            var sha = 0, feisha = 0;
                            player.getCards().forEach(function (card) {
                                if (card.name == 'sha') sha++;
                                else feisha++;
                            });
                            if ((sha > feisha && result.control == '非杀') || (feisha > sha && result.control == '杀')) {
                                game.log(trigger.player, '猜测错误');
                                trigger.num++;
                            }
                        }
                    },
                }
            },
        },
"card": {
            sizhaojian: {
                derivation: 'sbfm_yuanshao',
                type: 'equip',
                fullskin: true,
                subtype: 'equip1',
                distance: { attackFrom: -1 },
                skills: ['sizhao_skill'],
                ai: {
                    equipValue: 7.8
                }
            }
        }
};
}
