// Extracted from extension/Thunder/extension.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
            th_sp_zhugeliang: ['male', 'shu', 3, ['thhuoji', 'thkanpo'], ['die_audio']],
            th_zhugeliang: ['male', 'shu', 3, ['thguanxing', 'thkongcheng'], ['die_audio', 'unseen']],
          },
"characterSort": {
            thunder: {
              thgame: [
              ],
              thbeauty: [ 'th_sp_zhugeliang', 'th_zhugeliang'],
              thother: [],
            },
          },
"characterTitle": {

          },
"characterIntro": {

          },
"characterReplace": {
            lukai: ['lukai', 'th_lukai'],
            guanning: ['guanning', 'th_guanning'],
            sunhanhua: ['sunhanhua', 'th_sunhanhua'],
            puyuan: ['puyuan', 'ol_puyuan', 'th_puyuan'],
            pangdegong: ['re_pangdegong', 'pangdegong', 'th_pangdegong'],
            zhengxuan: ['zhengxuan', 'th_zhengxuan'],
            mamidi: ['mamidi', 'xin_mamidi', 'th_mamidi'],
            nanhualaoxian: ['re_nanhualaoxian', 'nanhualaoxian', 'th_nanhualaoxian'],
            majun: ['majun', 'th_majun'],
            zhouqun: ['zhouqun', 'th_zhouqun'],
            wanglang: ['wanglang', 'th_wanglang'],
            liuhui: ['liuhui', 'th_liuhui'],
            shen_zhouyu: ['shen_zhouyu', 'th_shen_zhouyu'],
          },
"dynamicTranslate": {

          },
"translate": {
            'tang': '唐',
            'han': '汉',
            thgame: '小游戏武将',
            thbeauty: '技能美化',
            thother: '其他特色',
            th_guanning: '管宁',
            th_dunshi: '遁世',
            th_dunshi_info: '每回合限一次，你可视为使用或打出一张【杀】，【闪】，【桃】或【酒】。然后当前回合角色本回合下次造成伤害时，你选择两项：</br>1.防止此伤害，选择1个包含“仁义礼智信”的技能令其获得；</br>2.减1点体力上限并摸X张牌（X为你选择3的次数）；</br>3.删除你本次视为使用的牌名。',
            th_lukai: '陆凯',
            th_bushi: '卜筮',
            th_zhongzhuang: '忠壮',
            th_bushi_info: '锁定技，你使用♠牌无次数限制；你使用或打出♦牌后，摸两张牌；当你成为♣牌的目标后/结束阶段，获得一张♥牌。准备阶段，你重新分配四花色。',
            th_zhongzhuang_info: '锁定技，当你造成伤害时，若你的攻击范围大于3，则你只能造成1点伤害；若你的攻击范围小于3，则此伤害+1。',
            th_caohua: '曹华',
            th_caiyi_info: '转换技，结束阶段，你可令一名角色选择一项执行后移除：阳：回复X点体力；摸X张牌；复原武将牌；随机执行一个已移除的阳选项。阴：受到X点伤害；弃X张牌；翻面并横置；随机执行一个已移除的阴选项。（X为该状态剩余选项数量）',
            th_guili_info: '你的第一个回合开始时，你选择一名其他角色，该角色每轮第一个回合结束后，若其本回合未造成伤害，你执行一个额外回合。',
            th_caiyi: '彩翼',
            th_guili: '归离',
            th_chongxu: '冲虚',
            th_sunhanhua: '孙寒华',
            th_chongxu_info: '出牌阶段限一次，你可以进行一次“集灵”来获得分数，然后你可以用分数升级“妙剑”、升级“莲华”或摸牌。',
            th_puyuan: '蒲元',
            th_shengong: '神工',
            th_shengong_info: '出牌阶段各限一次，你可以弃置一张武器牌/防具牌/坐骑牌/宝物牌，进行一次【锻造】，选择一张武器牌/防具牌/宝物牌置于一名角色的装备区（替换原装备）。以此法获得的装备牌进入弃牌堆时销毁之，以此法销毁牌的回合的结束阶段，你摸一张牌。',
            th_pangdegong: '庞德公',
            th_pingcai: '评才',
            th_pingcai_info: '出牌阶段限一次，你可以挑选一个宝物，擦拭掉其上面的灰尘。如果擦拭成功，你可以根据宝物类型执行对应的效果。',
            th_zhengxuan: '郑玄',
            th_zhengjing: '整经',
            th_zhengjing2: '整经',
            th_zhengjing_info: '出牌阶段限一次，你可以整理一次经典，并将你整理出的任意张牌置于一名角色的武将牌上，称为“经”，然后你获得剩余的牌。武将牌上有“经”的角色的准备阶段，其获得所有“经”，然后跳过判定阶段和摸牌阶段。',
            th_mamidi: '马日磾',
            th_chengye: '承业',
            th_buxu: '补续',
            th_chengye_info: '锁定技，①当其他角色使用一张非转化牌结算结束后，或一张其他角色区域内的装备牌或延时锦囊牌进入弃牌堆后，若你有对应的“六经”处于缺失状态，你将此牌置于你的武将牌上，称为“典”；②出牌阶段开始时，若你的“六经”均未处于缺失状态，你获得所有“典”。',
            th_buxu_info: '出牌阶段，若你拥有技能“承业”，你可以弃置X张牌并选择一种你缺失的“六经”，然后从牌堆或弃牌堆中随机获得一张对应此“六经”的牌加入“典”中（X为你本阶段此前发动过此技能的次数+1）。',
            th_nanhualaoxian: '南华老仙',
            th_yufeng: '御风',
            th_yufeng_info: '出牌阶段限一次，你可以进行一次御风飞行。若失败，你摸X张牌；若成功，你可选择至多X名其他角色，其下一个准备阶段进行判定：若结果为黑色，其跳过出牌和弃牌阶段；若结果为红色，其跳过摸牌阶段（若选择角色数不足X，则多余的分数改为摸牌，X为御风飞行得分）。',
            th_tianshu: '天书',
            th_tianshu_info: "出牌阶段开始时，若【太平要术】不在游戏内，在牌堆或弃牌堆中，你可以弃置一张牌，并选择1名角色，其将获得【“<a id='thsi_taipingyaoshu' style='color:unset' href=\"javascript:window._Thunder.skillTips(get.translation('th_taipingyaoshu_info'),'thsi_taipingyaoshu');\">太平要术※</a>”】并使用之。",
            th_majun: '马钧',
            th_qiaosi: '巧思',
            th_qiaosi_info: '出牌阶段限一次，你可以表演“水转百戏图”来赢取相应的牌，然后你选择一项：1.弃置等量的牌；2.将等量的牌交给一名其他角色。',
            th_jingxie: '精械',
            th_jingxie_info: "出牌阶段，你可以展示你手牌区或装备区里的一张防具牌或【诸葛连弩】，然后将此牌的牌名和技能分别作修改。<br>当你进入濒死状态时，你可以重铸一张防具牌。若如此做，你将体力回复至1点。<br>精械升级如下：<br>诸葛连弩→<a id='thsi_zhuge' style='color:unset' href=\"javascript:window._Thunder.skillTips('攻击范围3，你使用【杀】无次数限制。','thsi_zhuge');\">元戎精械弩※</a><br>八卦阵→<a id='thsi_bagua' style='color:unset' href=\"javascript:window._Thunder.skillTips('当你需要使用或打出一张【闪】时，你可以进行判定：若判定结果不为黑桃，则视为你使用或打出了一张【闪】。','thsi_bagua');\">先天八卦阵※</a><br>仁王盾→<a id='thsi_renwang' style='color:unset' href=\"javascript:window._Thunder.skillTips('\\u9501定技，黑色【杀】及红桃【杀】对你无效。','thsi_renwang');\">仁王金刚盾※</a><br>白银狮子→<a id='thsi_baiyin' style='color:unset' href=\"javascript:window._Thunder.skillTips('\\u9501定技，当你受到伤害时，若此伤害多于1点，则防止多余的伤害；当你失去装备区里的【白银狮子】时，你回复1点体力，然后摸两张牌。','thsi_baiyin');\">照月狮子盔※</a><br>藤甲→<a id='thsi_tengjia' style='color:unset' href=\"javascript:window._Thunder.skillTips('【南蛮入侵】、【万箭齐发】和普通【杀】对你无效；当你受到火焰伤害时，此伤害+1；当你进入连环状态前，你防止此次操作。','thsi_tengjia');\">桐油百韧甲※</a>",
            th_zhouqun: '周群',
            th_tiansuan: '天算',
            th_tiansuan_info: '每轮限一次，出牌阶段，玩家抽取一个“命运签”（在抽签开始前，玩家可以悄悄作弊，额外放入一个“命运签”增加其抽中的机会）。然后玩家选择一名角色，其获得命运签的效果直到玩家的下回合开始。若其获得的是“上上签”，玩家观看其手牌并从其区域内获得一张牌；若其获得的是“上签”，玩家从其处获得一张牌。<br>“命运签”：<br>上上签：防止受到的伤害。<br>上签：受到伤害时，若伤害值大于1，则将伤害值改为1；每受到一点伤害后，玩家摸一张牌。<br>中签：受到伤害时，将伤害改为火焰伤害，若此伤害值大于1，则将伤害值改为1。<br>下签：受到伤害时，伤害值＋1。<br>下下签：受到伤害时，伤害值＋1；不能使用【桃】和【酒】。',
            th_tiansuan2_0: '天算 上上签',
            th_tiansuan2_1: '天算 上签',
            th_tiansuan2_2: '天算 中签',
            th_tiansuan2_damage: '命运签',
            th_tiansuan2_fire: '命运签',
            th_tiansuan2_3: '天算 下签',
            th_tiansuan2_4: '天算 下下签',
            th_wanglang: '王朗',
            th_gushe: '鼓舌',
            th_gushe_info: '出牌阶段，若X小于7，则你可以用一张手牌与至多三名角色同时拼点，然后依次结算拼点结果，没赢的角色选择一项：1.弃置一张牌；2.令你摸一张牌。若你没赢，你获得一个“饶舌”标记。当你获得第7个“饶舌”标记时，你死亡。（X为你的“饶舌”标记数与本回合因“鼓舌”拼点而胜利的次数之和）',
            th_liuhui: '刘徽',
            th_geyuan: '割圆',
            th_geyuan_info: '锁定技。①游戏开始时，你将从A至K的所有整数排列为一个环形链表，称为“圆环之理”。②当有一张牌进入弃牌堆后，若此牌的点数在“圆环之理”内，且“圆环之弧”为空或此牌的点数与“圆环之弧”两端的点数相邻，则你将此牌的点数记录进“圆环之弧”；然后若“圆环之弧”与“圆环之理”长度相同，则你从“圆环之理”中移除“圆环之弧”记录的第一个和最后一个数字A和B（当“圆环之理”长度不大于3时则不移除），清空“圆环之弧”，获得场上和牌堆中所有点数为A和B的牌。',
            th_jieshu: '解术',
            th_jieshu_info: '锁定技。①所有点数不在“圆环之理”中的牌不计入你的手牌上限。②当你使用牌时，若“圆环之弧”为空或此牌的点数与“圆环之弧”两端的点数相邻，则你摸一张牌。',
            th_gusuan: '股算',
            th_gusuan_info: '觉醒技。一名角色的回合结束时，若你的“圆环之理”长度为3，则你减1点体力上限并修改〖割圆〗。',
            th_geyuan_magica: '割圆·改',
            th_geyuan_magica_info: '锁定技。当有一张牌进入弃牌堆后，若此牌的点数在“圆环之理”内，且“圆环之弧”为空或此牌的点数与“圆环之弧”两端的点数相邻，则你将此牌的点数记录进“圆环之弧”；然后若“圆环之弧”与“圆环之理”长度相同，则你清空“圆环之弧”并选择至多三名角色，这些角色中的第一名角色摸三张牌，第二名角色弃置四张牌，第三名角色将其手牌与牌堆底的五张牌交换。',
            th_shen_zhouyu: '神周瑜',
            th_yeyan: '业炎',
            th_yeyan_info: '限定技，出牌阶段，你可以选择至多三名角色，对这些角色造成共计至多3点火焰伤害（若你将对一名角色分配2点或更多火焰伤害，你须先弃置四张花色各不相同的手牌并失去3点体力）。',
            th_sp_zhugeliang: '谋诸葛亮',
            th_zhugeliang: '谋诸葛亮',
            th_sp_zhugeliang_prefix: '谋',
            th_zhugeliang_prefix: '谋',
            'thhuoji': '火计',
            'thkanpo': '看破',
            'thguanxing': '观星',
            'thkongcheng': '空城',
            thhuoji_info: '使命技。①使命：出牌阶段限一次。你可以对一名其他角色造成1点火焰伤害，然后你对所有与其势力相同的不为其的其他角色各造成1点火焰伤害。②成功：准备阶段，若你本局游戏已造成的火焰伤害不小于本局游戏总角色数，则你失去〖火计〗和〖看破〗，然后获得〖观星〗和〖空城〗。③失败：使命成功前进入濒死状态。',
            thkanpo_info: '①一轮游戏开始时，你清除〖看破①〗记录的牌名，然后你可以依次记录共计三个未于本次清除过的非装备牌牌名（对其他角色不可见）。②当其他角色使用你〖看破①〗记录过的牌名的牌时，你可以移去一个〖看破①〗中的此牌名的记录，令此牌无效。',
            thguanxing_info: '①准备阶段，你将所有“星”置入弃牌堆，将牌堆顶的X张牌置于你的武将牌上，称为“星”。然后你可以将任意张“星”置于牌堆顶（X为你此次移去的“星”数+1且至多为7，若你此前未发动过〖观星①〗则X为7）。②结束阶段，若你未于本回合的准备阶段将“星”置于过牌堆顶，你可以将任意张“星”置于牌堆顶。③你可以如手牌般使用或打出“星”。',
            thkongcheng_info: '锁定技。当你受到伤害时，若你有〖观星〗，且若你：有“星”，你判定，若结果点数不大于你的“星”数，此伤害-1；没有“星”，此伤害+1。',
          },
"skill": {
            //管宁
            th_dunshi: {
              audio: "ext:Thunder/audio/skill:2",
              hiddenCard: function (player, name) {
                return player.storage.th_dunshi.contains(name) && !player.hasSkill('th_dunshi_used');
              },
              init: function (player) {
                player.storage.th_dunshi = ['sha', 'shan', 'tao', 'jiu'];
                player.storage.dunshiChooseThree = 0;
                player.storage.th_dunshiDelete = []
              },
              enable: ['chooseToUse', 'chooseToRespond'],
              filter: function (event, player) {
                if (player.hasSkill('th_dunshi_used')) return false;
                for (var i of lib.inpile) {
                  if (player.storage.th_dunshi.contains(i) && event.filterCard({
                    name: i,
                  }, player, event)) return true;
                }
                return false;
              },
              ai: {
                order: function () {
                  if (_status.event.player.storage.th_dunshi.contains('sha')) return get.order({ name: 'sha' }) + 0.5;
                  return 1;
                },
                respondShan: true,
                respondSha: true,
                result: {
                  player: function (player) {
                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                    return 1;
                  },
                },
              },
              getSkillRank: function (target, skill) {
                switch (get.translation(skill)) {
                  case '仁政':
                    return 3;
                  case '仁心':
                    return 1;
                  case '仁德':
                    return 2;
                  case '义从':
                    return 1.8;
                  case '天义':
                    return 2;
                  case '举义':
                    if (target.maxHp < 5) {
                      return 0.8;
                    } else {
                      return target.maxHp - 3;
                    }
                  case '义襄':
                    return 3;
                  case '义舍':
                    return 0.5;
                  case '礼下':
                    return 0.75;
                  case '礼赂':
                    return 10;
                  case '遗礼':
                    return -1;
                  case '智愚':
                    return 1.5;
                  case '集智':
                    if (target.countCards('h') > 3) return 3;
                    return 2.5;
                  case '同礼':
                    return 4;
                  case '智迟':
                    if (target.hp > 4) return 2.2;
                    return 3.5;
                  case '遣信':
                    return 0.75;
                  default:
                    return get.skillRank(skill, 'in') + get.skillRank(skill, 'out');
                }
              },
              chooseButton: {
                dialog: function (event, player) {
                  var list = [];
                  for (var i of lib.inpile) {
                    if (player.storage.th_dunshi.contains(i) && event.filterCard({
                      name: i,
                    }, player, event)) {
                      list.push(['基本', '', i]);
                    }
                  }
                  return ui.create.dialog('遁世', [list, 'vcard'], 'hidden');
                },
                check: function (button) {
                  var player = _status.event.player;
                  if (_status.event.getParent().type != 'phase') return 1;
                  return player.getUseValue({ name: button.link[2] }) + 1;
                },
                backup: function (links, player) {
                  return {
                    audio: 'th_dunshi',
                    popname: true,
                    filterCard: function (card) { return false },
                    selectCard: -1,
                    viewAs: {
                      name: links[0][2],
                    },
                    onuse: function (result, player) {
                      player.storage.th_dunshi_temp = result.card.name;
                      player.addTempSkill('th_dunshi_used');
                      player.addTempSkill('th_dunshi_effect');
                      _status.currentPhase.addTempSkill('th_dunshi_Ai');
                    },
                    onrespond: function () { return lib.skill.th_dunshi_backup.onuse.apply(this, arguments) },
                  }
                },
              },
              subSkill: {
                mark: {
                  mark: true,
                  intro: {
                    content: function (storage, player) {
                      return '已删除牌名：' + get.translation(player.storage.th_dunshiDelete);
                    }
                  }
                },
                backup: {},
                used: { onremove: true },
                Ai: {
                  ai: {
                    effect: {
                      player: function (card, player, target) {
                        if (get.tag(card, 'damage') && get.attitude(player, target) >= 0 && player.hasSkill('th_dunshi_effect')) return [0, 0.1, 0, 0.1];
                      }
                    }
                  },
                },
                effect: {
                  trigger: { global: 'damageBegin2' },
                  forced: true,
                  filter: function (event, player) {
                    return event.source && event.source.isIn() && event.source == _status.currentPhase;
                  },
                  onremove: function (player) { delete player.storage.th_dunshi_temp },
                  content: function () {
                    'step 0'
                    event.addIndex = 0;
                    'step 1'
                    var list = [
                      '防止此伤害，选择1个包含“仁义礼智信”的技能令' + get.translation(_status.currentPhase) + '获得',
                      '减1点体力上限并摸' + player.storage.dunshiChooseThree + '张牌',
                      '删除你本次视为使用或打出的牌名（' + get.translation(player.storage.th_dunshi_temp) + '）',
                    ];
                    if (event.choice != undefined) list.splice(event.choice, 1);
                    event.videoId = lib.status.videoId++;
                    var func = function (id, bool) {
                      var choiceList = ui.create.dialog('遁世：选择一项执行：', 'forcebutton');
                      choiceList.videoId = id;
                      for (var i = 0; i < list.length; i++) {
                        var str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
                        str += list[i];
                        str += '</div>';
                        var next = choiceList.add(str);
                        next.firstChild.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
                        next.firstChild.link = i;
                        if (lib.element.Button) Object.setPrototypeOf(next, lib.element.Button.prototype);
                        choiceList.buttons.add(next.firstChild);
                      }
                      return choiceList;
                    };
                    if (player.isOnline2()) {
                      player.send(func, event.videoId);
                    }
                    event.dialog = func(event.videoId);
                    if (player != game.me || _status.auto) {
                      event.dialog.style.display = 'none';
                    }
                    var next = player.chooseButton();
                    next.set('dialog', event.videoId);
                    next.set('selectButton', 1);
                    next.set('forced', true);
                    next.set('ai', function (button) {
                      var num = 0;
                      if (event.choice != undefined && button.link >= event.choice) num = 1;
                      switch (button.link + num) {
                        case 0:
                          {
                            if (get.attitude(player, _status.currentPhase) > 0) return 2.5 + Math.random();
                            else if (player.storage.th_dunshi.length <= 2) return 0.5 + Math.random();
                            return 0;
                          }
                        case 1:
                          {
                            if (player.maxHp <= 2 || player.storage.dunshiChooseThree == 0) return 0;
                            return Math.random();
                          }
                        case 2:
                          {
                            if (player.storage.th_dunshi_temp == 'tao' || player.storage.th_dunshi_temp == 'shan') return 0;
                            return 1.2 + Math.random();
                          }
                      }
                    });
                    'step 2'
                    if (player.isOnline2()) {
                      player.send('closeDialog', event.videoId);
                    }
                    event.dialog.close();
                    var map = [
                      function (trigger, player, event) {
                        trigger.cancel();
                        var next = game.createEvent('th_dunshi_getSkill');
                        next.player = player;
                        next.setContent(lib.skill.th_dunshi.contentx);
                      },
                      function (trigger, player, event) {
                        player.loseMaxHp();
                        player.draw(player.storage.dunshiChooseThree);
                      },
                      function (trigger, player, event) {
                        game.log(player, '删除了', '#g【遁世】', '的牌名', '#y【' + get.translation(player.storage.th_dunshi_temp) + '】')
                        player.storage.th_dunshi.remove(player.storage.th_dunshi_temp);
                        player.storage.th_dunshiDelete.push(player.storage.th_dunshi_temp);
                        player.markSkill('th_dunshi_mark');
                        player.storage.dunshiChooseThree++;
                      },
                    ];
                    var num = 0;
                    if (event.choice != undefined && result.links[0] >= event.choice) num = 1;
                    map[result.links[0] + num](trigger, player, event);
                    event.choice = result.links[0];
                    'step 3'
                    event.addIndex++;
                    if (event.addIndex < 2) event.goto(1);
                    'step 4'
                    player.removeSkill('th_dunshi_effect');
                  }
                }
              },
              getSkill: function (config, target) {
                var map = {};
                if (config) {
                  var str = '仁义礼智信';
                  var list = [],
                    list2 = [];
                  for (var i in lib.character) {
                    if (lib.filter.characterDisabled(i) || lib.filter.characterDisabled2(i)) continue;
                    list.push(i);
                  }
                  for (var i of list) {
                    for (var j of lib.character[i][3]) {
                      var info = get.translation(j);
                      for (var k of str) {
                        if (info.indexOf(k) != -1) {
                          var bool1 = true;
                          if (target) {
                            var skills = target.getSkills();
                            if (target.disabledSkills) {
                              for (var dis in target.disabledSkills) {
                                skills.push(dis);
                              }
                            }
                            for (var ski of skills) {
                              if (get.translation(ski) == get.translation(j)) bool1 = false;
                            }

                          }
                          if (!map[info] && bool1) map[info] = [];
                          if (bool1) map[info].push(j);
                        }
                      }
                    }
                  }
                } else {
                  var skillList = ['renzheng', 'tongli', 'renxin', 'rerende', 'yicong', 'new_yijue', 'tianyi', 'juyi', 'reyixiang', 'lixia', 'cslilu', 'zhiyu', 'xinfu_qianxin', 'zhichi', 'rejizhi', 'yishe', 'nzry_yili'];
                  for (var i of skillList) {
                    var info = get.translation(i);
                    var bool1 = true;
                    if (target) {
                      var skills = target.getSkills();
                      if (target.disabledSkills) {
                        for (var dis in target.disabledSkills) {
                          skills.push(dis);
                        }
                      }

                      for (var ski of skills) {
                        if (get.translation(ski) == get.translation(i)) bool1 = false;
                      }
                    }
                    if (!map[info] && bool1) map[info] = [];
                    if (bool1) map[info].push(i);
                  }
                }
                return map;
              },
              contentx: function () {
                'step 0'
                var skills = lib.skill.th_dunshi.getSkill(lib.config['extension_Thunder_guanning'], _status.currentPhase);
                if (!Object.keys(skills).length) {
                  event.finish();
                  return;
                } else {
                  while (Object.keys(skills).length > Math.min(3, Object.keys(skills).length)) {
                    var a = Math.floor(Math.random() * Object.keys(skills).length);
                    delete skills[Object.keys(skills)[a]];
                  }
                }
                var list = [],
                  list1 = Object.keys(skills),
                  list2 = [],
                  a = [0, 0, 0, 0, 0, 0];
                for (var i in skills) {
                  list2.push(get.skillInfoTranslation(skills[i][0], player));
                }
                for (var i = 0; i < list1.length; i++) {
                  list[i] = '【' + list1[i];
                  if (skills[list1[i]].length > 1) list[i] += '1'
                  list[i] += '】' + list2[i];
                  if (skills[list1[i]].length > 1) list[i] += '　　<span class="yellowtext">(点击切换)</span>';
                }
                var switchToAuto = function () {
                  _status.imchoosing = false;
                  var list = [];
                  for (var i in skills) {
                    list.push(skills[i][0]);
                  }
                  var aiSkill = () => list.slice().sort((a, b) => {
                    return get.sgn(get.attitude(player, _status.currentPhase)) * (lib.skill.th_dunshi.getSkillRank(_status.currentPhase, b) - lib.skill.th_dunshi.getSkillRank(_status.currentPhase, a));
                  })[0];
                  event._result = {
                    bool: true,
                    skill: aiSkill(),
                  };
                  if (event.dialog) event.dialog.close();
                  if (event.control) event.control.close();
                };
                event.videoId = lib.status.videoId++;
                var chooseButton = function (player, id) {
                  var choiceList = ui.create.dialog('遁世：请选择令' + get.translation(_status.currentPhase) + '获得的技能：');
                  choiceList.videoId = id;
                  choiceList.classList.add('fullwidth');
                  event.dialog = choiceList;
                  event._result.skill = skills[list1[0]][0];
                  for (var i = 0; i < list.length; i++) {
                    var str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
                    str += list[i];
                    str += '</div>';
                    var next = choiceList.add(str);
                    if (i == 0) next.firstChild.classList.add('bluebg');
                    next.firstChild.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                      if (_status.dragged) return;
                      if (_status.justdragged) return;
                      _status.tempNoButton = true;
                      setTimeout(function () {
                        _status.tempNoButton = false;
                      }, 500);
                      var nodes = this.parentNode.parentNode.childNodes;
                      for (var node of nodes) {
                        if (node.childNodes[0] && node.childNodes[0].classList && node.childNodes[0].classList.contains('bluebg')) node.childNodes[0].classList.remove('bluebg');
                      }
                      this.classList.add('bluebg');
                      var link = this.link;
                      a[link]++;
                      var num = a[link] % skills[list1[link]].length;
                      if (this.innerHTML.indexOf('点击切换') != -1) {
                        list2[link] = get.skillInfoTranslation(skills[list1[link]][num], player);
                        this.innerHTML = this.innerHTML.replace(/【\S+　　/, '【' + list1[link] + (num + 1) + '】' + list2[link] + '　　');
                      }
                      event._result.skill = skills[list1[link]][num];
                    });
                    next.firstChild.link = i;
                    if (lib.element.Button) Object.setPrototypeOf(next, lib.element.Button.prototype);
                    choiceList.buttons.add(next.firstChild);
                  }
                  event.switchToAuto = function () {
                    _status.imchoosing = false;
                    var list = [];
                    for (var i in skills) {
                      list.push(skills[i][0]);
                    }
                    var aiSkill = () => list.slice().sort((a, b) => {
                      return get.sgn(get.attitude(player, _status.currentPhase)) * (lib.skill.th_dunshi.getSkillRank(_status.currentPhase, b) - lib.skill.th_dunshi.getSkillRank(_status.currentPhase, a));
                    })[0];
                    event._result = {
                      bool: true,
                      skill: aiSkill(),
                    };
                    if (event.dialog) event.dialog.close();
                    if (event.control) event.control.close();
                  };
                  event.control = ui.create.control('ok', function (link) {
                    var result = event._result;
                    result.bool = true;
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  });
                  for (var i = 0; i < event.dialog.buttons.length; i++) {
                    event.dialog.buttons[i].classList.add('selectable');
                  }
                  game.pause();
                  game.countChoose();
                };
                if (event.isMine()) {
                  chooseButton(player, event.videoId);
                } else if (event.isOnline()) {
                  event.player.send(chooseButton, event.player, event.videoId);
                  event.player.wait();
                  game.pause();
                } else {
                  switchToAuto();
                }
                'step 1'
                player.line(_status.currentPhase, 'green');
                _status.currentPhase.addSkillLog(result.skill);
              }
            },

            // 怀旧陆凯                by cop
            th_bushi: {
              audio: "ext:Thunder/audio/skill:2",
              init: function (player) {
                if (!player.storage.th_bushi) player.storage.th_bushi = ['spade', 'diamond', 'club', 'heart'];
              },
              trigger: {
                player: 'phaseZhunbeiBegin',
              },
              forced: true,
              group: ['th_bushi_draw', 'th_bushi_gain'],
              content: function () {
                'step 0'
                if (player.isUnderControl()) {
                  game.swapPlayerAuto(player);
                }
                var switchToAuto = function () {
                  _status.imchoosing = false;
                  event._result = {
                    bool: true,
                    suits: lib.suit.slice().randomSort()
                  };
                  if (event.dialog) event.dialog.close();
                  if (event.control) event.control.close();
                };

                var chooseButton = function (player) {
                  var event = _status.event;
                  player = player || event.player;
                  event._result.suits = [];
                  var suits = ['spade', 'heart', 'club', 'diamond'];
                  var prompt = ['你使用', '牌无次数限制；你使用或打出', '牌后，摸两张牌；当你成为', '牌的目标后/结束阶段，获得一张', '牌。'];
                  var texts = [
                    '花色A',
                    '花色B',
                    '花色C',
                    '花色D',
                  ]
                  var updatePrompt = function () {
                    var str = '';
                    prompt.forEach((txt, ind) => {
                      str += txt;
                      if (ind < 4) str += event._result.suits[ind] ? get.translation(event._result.suits[ind]) : '[' + texts[ind] + ']的';
                    })
                    event.promptNode.innerHTML = str;
                  }

                  if (!event._result) event._result = {};
                  event._result.damage = [];
                  var dialog = ui.create.dialog('【卜筮】请分配花色', 'forcebutton', 'hidden');
                  event.dialog = dialog;

                  dialog.addText(texts[i]);
                  event.promptNode = dialog.content.querySelector('.text');

                  for (var i = 0; i < texts.length; i++) {
                    dialog.addText(texts[i]);
                    var table = document.createElement('div');
                    table.classList.add('add-setting');
                    table.style.margin = '0';
                    table.style.width = '100%';
                    table.style.position = 'relative';
                    table._index = i;
                    for (var j = 0; j < suits.length; j++) {
                      var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                      td.link = suits[j];
                      table.appendChild(td);
                      td.innerHTML = '' + get.translation(suits[j]) + '';
                      td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                        if (_status.dragged) return;
                        if (_status.justdragged) return;
                        _status.tempNoButton = true;
                        setTimeout(function () {
                          _status.tempNoButton = false;
                        }, 500);
                        var link = this.link;
                        var index = this.parentNode._index;

                        // if (event._result.suits.contains(link)) return;
                        var current = this.parentNode.querySelector('.bluebg');
                        if (current) {
                          current.classList.remove('bluebg');
                        }
                        var btnGroups = event.dialog.content.querySelectorAll('.add-setting');
                        btnGroups.forEach(btns => {
                          var btn = btns.querySelector('.bluebg');
                          if (btn && btn.link == link) {
                            btn.classList.remove('bluebg');
                            delete event._result.suits[btns._index];
                          }
                        })
                        this.classList.add('bluebg');
                        event._result.suits[index] = link;
                        updatePrompt();
                      });
                    }
                    dialog.content.appendChild(table);
                    // dialog.add('　　');
                  }
                  dialog.add('　　');
                  updatePrompt();
                  event.dialog.open();

                  event.switchToAuto = function () {
                    _status.imchoosing = false;
                    event._result = {
                      bool: true,
                      suits: lib.suit.slice().randomSort()
                    };
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                  };
                  event.control = ui.create.control('ok', function (link) {
                    var result = event._result;
                    if (!result.suits || !result.suits.length) return;
                    if (result.suits.filter(i => i).length != 4) return;
                    result.bool = true;
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  });
                  for (var i = 0; i < event.dialog.buttons.length; i++) {
                    event.dialog.buttons[i].classList.add('selectable');
                  }
                  game.pause();
                  game.countChoose();
                };
                if (event.isMine()) {
                  chooseButton(player, targets);
                } else if (event.isOnline()) {
                  event.player.send(chooseButton, event.player, event.players);
                  event.player.wait();
                  game.pause();
                } else {
                  switchToAuto();
                }
                'step 1'
                var result = event.result || result;
                player.storage.th_bushi = result.suits.slice();
                game.log(player, '选择了', '#y' + get.translation(result.suits));
              },
              mod: {
                cardUsable: function (card, player, num) {
                  if (!player.storage.th_bushi) return;
                  if (get.suit(card, player) == player.storage.th_bushi[0]) return Infinity;
                },
              },
              subSkill: {
                draw: {
                  trigger: {
                    player: ['useCardAfter', 'respondAfter'],
                  },
                  audio: 'th_bushi',
                  forced: true,
                  filter: function (event, player) {
                    if (!player.storage.th_bushi) return false;
                    return get.suit(event.card) == player.storage.th_bushi[1];
                  },
                  content: function () {
                    player.draw(2);
                  }
                },
                gain: {
                  trigger: {
                    player: 'phaseJieshuBegin',
                    target: 'useCardToTargeted'
                  },
                  audio: 'th_bushi',
                  forced: true,
                  filter: function (event, player) {
                    if (!player.storage.th_bushi) return false;
                    if (event.name == 'phaseJieshu') return true;
                    return get.suit(event.card) == player.storage.th_bushi[2];
                  },
                  content: function () {
                    var card = get.cardPile(card => get.suit(card, false) == player.storage.th_bushi[3]);
                    if (card) player.gain(card, 'log', 'gain2');
                    game.updateRoundNumber();
                  }
                }
              }
            },
            th_zhongzhuang: {
              trigger: {
                source: ['damageBegin1', 'damageBegin2'],
              },
              forced: true,
              audio: "ext:Thunder/audio/skill:2",
              filter: function (event, player, name) {
                var range = player.getAttackRange();
                if (name == 'damageBegin1') {
                  return range < 3;
                }
                return event.num > 1 && range > 3;
              },
              content: function () {
                if (event.triggername == 'damageBegin1') {
                  trigger.num++;
                } else {
                  trigger.num = 1;
                }
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (card.name == 'jiu' && target != _status.event.dying && target.getAttackRange() > 3) return 'zeroplayertarget';
                  },
                },
              },
            },

            //曹华
            th_caiyi: {
              trigger: { player: 'phaseJieshuBegin' },
              zhuanhuanji: true,
              init: function (player) {
                player.storage.th_caiyiyang = [1, 1, 1, 2];
                player.storage.th_caiyiyin = [1, 1, 1, 2]
              },
              marktext: '☯',
              mark: true,
              intro: {
                content: function (storage, player) {
                  return storage ? '当前为伤害型' : '当前为回复型';
                },
              },
              filter: function (event, player) {
                var str, num = 0;
                if (player.storage.th_caiyi) str = 'th_caiyiyin';
                else str = 'th_caiyiyang';
                for (var i = 0; i < player.storage[str].length; i++) {
                  if (player.storage[str][i] == 0) num++;
                }
                return num < 4;
              },
              direct: true,
              audio: "ext:Thunder/audio/skill:2",
              content: function () {
                'step 0'
                player.chooseTarget(get.prompt('th_caiyi')).set('prompt2', player.storage.th_caiyi ? '当前为伤害型选项：' : '当前为回复型选项：').ai = (target) => {
                  if (player.storage.th_caiyi) return -get.attitude(player, target) + target.countCards('he');
                  else {
                    if (!game.hasPlayer(function (current) {
                      return get.attitude(player, current) > 0 && current.isDamaged();
                    })) return 0;
                    return get.attitude(player, target) + target.getDamagedHp();
                  }
                }
                'step 1'
                if (result.bool) {
                  var list = [],
                    str;
                  if (player.storage.th_caiyi) {
                    str = 'th_caiyiyin';
                    list = ['受到X点伤害', '弃X张牌', '翻面并横置', '随机执行一个已移除的阴选项'];
                  } else {
                    str = 'th_caiyiyang';
                    list = ['回复X点体力', '摸X张牌', '复原武将牌', '随机执行一个已移除的阳选项'];
                  }
                  player.logSkill('th_caiyi', result.targets[0]);
                  result.targets[0].thcaiyi(list, str, player);
                  player.changeZhuanhuanji('th_caiyi');
                }
              }
            },
            th_guili: {
              audio: "ext:Thunder/audio/skill:2",
              trigger: { player: 'phaseBegin' },
              direct: true,
              filter: function (event, player) {
                return player.phaseNumber == 1 && !player.storage.th_guili;
              },
              audio: "ext:Thunder/audio/skill:2",
              content: function () {
                'step 0'
                player.chooseTarget('请选择【归离】的目标', '其每轮第一个回合结束后，若其本回合未造成伤害，你执行一个额外回合。', lib.filter.notMe, true).set('ai', function (target) {
                  return game.players.randomGet();
                });
                'step 1'
                if (result.bool) {
                  var target = result.targets[0];
                  player.logSkill('th_guili', target);
                  player.addSkill('th_guili_effect');
                  player.storage.th_guili = target;
                  player.markSkill('th_guili');
                  game.delayx();
                }
              },
              intro: { content: '已指定$为目标' },
              subSkill: {
                effect: {
                  trigger: { global: 'phaseEnd' },
                  filter: function (event, player) {
                    if (event.player != player.storage.th_guili || player.hasSkill('th_guili_acted')) return false;
                    return !event.player.getHistory('sourceDamage').length;
                  },
                  forced: true,
                  content: function () {
                    player.addTempSkill('th_guili_acted', 'roundStart');
                    game.log(player, '执行一个额外的回合');
                    player.insertPhase();
                  }
                },
                acted: {}
              }
            },

            //孙寒华
            th_chongxu: {
              init: function (player) {
                if (!lib.config['extension_Thunder_shhbiaoji']) return;
                lib.translate.miaojian = '妙剑' + (player.countMark('miaojian') + 1) + '级';
                lib.translate.shhlianhua = '莲华' + (player.countMark('shhlianhua') + 1) + '级';
              },
              usable: 1,
              enable: 'phaseUse',
              audio: "ext:Thunder/audio/skill:2",
              filter: function (event, player) {
                if (!window.chongxuxiao) {
                  window.chongxuxiao = true;
                  dcdAnim.loadSpine(window._Thunder.assets.shhfaqi.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.shhdaoju.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.shhjiesuan.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.shh.name, "skel");
                  _ThAnim.loadSpine(window._Thunder.thAssets.shhchangjing.name, "skel");
                }
                return true;
              },
              content: function () {
                "step 0"
                game.thunderForbidTouch();
                if (duilib && duilib.ease) {
                  _status.old_duiease = duilib.ease;
                  duilib.ease = function (fraction) {
                    if (!duilib.b3ease) duilib.b3ease = new duilib.CubicBezierEase(0.1, 0.1, 0.1, 0.1);
                    return duilib.b3ease.ease(fraction);
                  }
                }
                game.pause();
                event.blackbg = ui.create.div('.th-dibeijing', document.body);
                var thunderCanvas = document.getElementById('thunderDecadeUI-canvas');
                if (thunderCanvas) {
                  var widthClip = (document.body.offsetWidth * 0.5 - 398) + 'px';
                  var heightClip = (document.body.offsetHeight * 0.5 - 187) + 'px';
                  thunderCanvas.style['clip-path'] = 'inset(0 ' + widthClip + ' ' + heightClip + ')';
                }
                let num = 0
                let timer = game.thunderInterval(function () {
                  num += 0.1;
                  event.blackbg.style.background = 'rgba(0,0,0,' + num + ')';
                  if (num == 0.7) {
                    game.playAudio('..', 'extension', 'Thunder', 'audio', 'chongxu', 'lotus_fly');
                    game.thunderClearInterval(timer);
                    var x = player.offsetLeft + player.offsetWidth * 0.5 + 20, y = document.body.offsetHeight - player.offsetTop - player.offsetHeight * 0.5 - 20;
                    var faqi = dcdAnim.playSpine({ name: window._Thunder.assets.shhfaqi.name, loop: true }, { x: x, y: y, scale: 0.5 });
                    setTimeout(function () {
                      faqi.moveTo(document.body.offsetWidth * 0.48, document.body.offsetHeight * 0.49, 400);
                      faqi.onupdate = function () {
                        if (this.timestepMap.x.completed && this.timestepMap.y.completed && !this._over) {
                          this._over = true;
                          this.setAction('play2');
                          this.scaleTo(1.4, 150);
                          this.loop = false;
                          var that = this;
                          event.bgSpine = _ThAnim.loopSpine({ name: window._Thunder.thAssets.shhchangjing.name, opacity: 0 }, { y: document.body.offsetHeight * 0.5 + 7, scale: 0 });
                          event.bgSpine.scaleTo(0.72, 490);
                          event.bgSpine.fadeTo(1, 1000);
                          event.bgSpine.onupdate = function () {
                            if (!this.alreadyLoad) {
                              this.alreadyLoad = true;
                              event.bg = ui.create.div('.th-newcxbg', event.blackbg);
                            }
                          }
                          this.oncomplete = function () {
                            game.resume();
                            dcdAnim.stopSpine(that);
                          }
                        }
                      }
                    }, 200)
                  }
                }, 100)
                "step 1"
                game.pause();
                var lTimer = null, rTimer = null;
                _status.started = false;
                _status.finished = false;
                _status.cxdropTimer = null;
                event.score = 0;
                dcdAnim.playSpine({ name: window._Thunder.assets.shhfaqi.name, action: 'play3', speed: 0.5 }, { x: document.body.offsetWidth * 0.49, y: document.body.offsetHeight * 0.5 - 160, scale: 0.8 });
                var shhx = document.body.offsetWidth * 0.49;
                var shhy = document.body.offsetHeight * 0.5 - 170;
                var shh = dcdAnim.loopSpine({ name: window._Thunder.assets.shh.name, opacity: 0 }, { x: shhx, y: shhy, scale: 0.72 });
                setTimeout(function () {
                  shh.fadeTo(1, 100);
                }, 600);
                var daojishiNum = 2;
                var daojishibg = ui.create.div('.th-cxdaojishi', document.body);
                var daojishiT = ui.create.div('', daojishibg);
                daojishiT.innerHTML = '倒计时：' + daojishiNum;
                var daojishi = game.thunderInterval(() => {
                  daojishiNum--;
                  daojishiT.textContent = '倒计时：' + daojishiNum;
                  if (daojishiNum == 0) {
                    game.thunderClearInterval(daojishi);
                    setTimeout(function () {
                      daojishibg.remove();
                      _status.started = true;
                      addDrop();
                    }, 500)
                  }
                }, 1000); //倒计时时间
                var shhSpeed = 24 + (parseInt(lib.config['extension_Thunder_gameSpeed']) - 4) * 2;
                var harassTips1 = ui.create.div('.th-hT1', document.body, '选择释放天雷或降下莲华');
                if (player == game.me) harassTips1.hide();
                var harassTips2 = ui.create.div('.th-hT2', document.body, '点击任意位置释放天雷或降下莲华');
                harassTips2.hide();
                shh.moveRight = function () {
                  if (shh.flipX) shh.flipX = false;
                  shhx += 10;
                  if (shhx > document.body.offsetWidth * 0.5 + 330) shhx = document.body.offsetWidth * 0.5 + 330;
                  shh.moveTo(shhx, shhy, shhSpeed);
                }
                shh.moveLeft = function () {
                  shh.flipX = true;
                  shhx -= 10;
                  if (shhx < document.body.offsetWidth * 0.5 - 330) shhx = document.body.offsetWidth * 0.5 - 330;
                  shh.moveTo(shhx, shhy, shhSpeed);
                }
                var scorceBg = ui.create.div('.th-cxscbg', document.body);     //生成计分板
                var h1 = ui.create.div('', scorceBg);
                h1.style.left = '96px';
                h1.style.top = '50px';
                h1.innerHTML = '+1分';
                var h2 = ui.create.div('', scorceBg);
                h2.style.left = '96px';
                h2.style.top = '83px';
                h2.innerHTML = '-1分';
                var h3 = ui.create.div('', scorceBg);
                h3.style.left = '42px';
                h3.style.top = '18px';
                h3.innerHTML = '总得分：';
                var scoreText = ui.create.div('', scorceBg);
                scoreText.style.left = '115px';
                scoreText.style.top = '18px';
                scoreText.innerHTML = event.score;
                function defaultevent(e) {
                  game.thunderClearInterval(lTimer);
                  game.thunderClearInterval(rTimer);
                  e.preventDefault();
                }
                var drops = [], goodDrops = [], badDrops = [];
                var lBtn = ui.create.div('.th-cxlbtn', document.body);         //生成左按钮
                if (player == game.me) lBtn.classList.add('self')
                else {
                  var item1 = ui.create.div('', lBtn);
                  item1.style.cssText = 'height:90%;width: 90%;position: absolute;top: 19px;left: 5px;background-repeat:no-repeat;background-size: 100%';
                  item1.style.backgroundImage = 'url(' + lib.assetURL + 'extension/Thunder/image/chongxu/SS_ShhXyx_daoju-play2.png)';
                }
                var dropY = document.body.offsetHeight * 0.5 + 213;
                class Drop {
                  constructor(x, lotus) {
                    this.x = x;
                    this.y = dropY;
                    this.newY = dropY;
                    this.lotus = lotus;
                    this.hitted = false;
                    this.entity = dcdAnim.loopSpine(window._Thunder.assets.shhdaoju, { x: this.x, y: dropY, scale: 0.77 });
                    this.create();
                  }
                  getAction() {
                    if (!this.lotus) {
                      let type = Math.random();
                      if (type > 0.5) return 5;
                      else if (type > 0.1) return 3;
                      else return 1;
                    } else return this.lotus;
                  }
                  create() {
                    this.entity;
                    this.action = this.getAction();
                    this.dropSpeed = (this.action > 4 ? 3 : 5) + Math.round(Math.random() * 10) / 10;
                    this.entity.setAction('play' + (this.action == 1 ? '' : this.action));
                    if (this.action > 3) badDrops.push(this);
                    else goodDrops.push(this);
                    drops.push(this);
                    let reflection = dcdAnim.playSpine(window._Thunder.assets.shhdaoju, { x: this.x - 5, y: dropY - 393, scale: 0.77 });
                    reflection.setAction('play' + (this.action + 1));
                    setTimeout(function () {
                      dcdAnim.stopSpine(reflection);
                    }, 1000);
                  }
                  hit() {
                    if (this.action == 5) {
                      event.score = Math.max(event.score - 1, 0);
                      this.entity.setAction('play8');
                      dcdAnim.playSpine({ name: window._Thunder.assets.shhdaoju.name, action: 'play9' }, { x: shhx, y: shhy, scale: 0.6 });
                    } else {
                      this.entity.setAction('play7');
                      event.score = Math.min(event.score + 1, 5);
                    }
                    game.playAudio('..', 'extension', 'Thunder', 'audio', 'chongxu', 'chongXu_daoju' + this.action);
                    this.remove();
                    scoreText.innerHTML = event.score;
                    if (event.score >= 5) chongxuEnd(cxTime);
                  }
                  remove(rightnow) {
                    this.hitted = true;
                    let that = this;
                    setTimeout(function () {
                      dcdAnim.stopSpine(that.entity);
                    }, rightnow ? 0 : 200);
                    drops.remove(this);
                    goodDrops.remove(this);
                    badDrops.remove(this);
                  }
                }
                let dropMove = new game.thunderRAF(function () {
                  drops.forEach(i => {
                    i.newY = Math.max(dropY - 365, i.newY - i.dropSpeed);
                    i.entity.updateTimeStep('y', i.y, i.newY, 16);
                    if (i.newY == dropY - 365 && !i.hitted) i.remove(true);
                    if (i.newY < document.body.offsetHeight * 0.5 - 20 && i.x > shhx - 70 && i.x < shhx + 70 && !i.hitted) {
                      i.hit();
                    }
                    i.entity.y = i.y = i.newY;
                  })
                })
                var shhMove = new game.thunderRAF(function () { });
                if (player == game.me) {
                  document.onkeydown = function (e) {
                    if (e.repeat || !_status.started) return;
                    var evt = e || window.event;
                    switch (evt.keyCode) {
                      case 37: {
                        if (event.rightKeying) return;
                        event.leftKeying = true;
                        shh.moveLeft();
                        shhMove = game.thunderRAF(shh.moveLeft);
                        break;
                      }
                      case 39: {
                        if (event.leftKeying) return;
                        event.rightKeying = true;
                        shh.moveRight();
                        shhMove = game.thunderRAF(shh.moveRight);
                      }
                    }
                  }
                  document.onkeyup = function (e) {
                    var evt = e || window.event;
                    switch (evt.keyCode) {
                      case 37: {
                        event.leftKeying = false;
                        break;
                      }
                      case 39: {
                        event.rightKeying = false;
                      }
                    }
                    shhMove.stop = true;
                  }
                }
                lBtn.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function (e) {
                  if (!game.me.isIn()) return;
                  document.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', defaultevent, false);
                  e.stopPropagation();
                  if (player == game.me) {
                    if (!_status.started) return;
                    shh.moveLeft();
                    shhMove = game.thunderRAF(shh.moveLeft);
                  } else {
                    if (!event.cxHarass) {
                      harassTips1.hide();
                      harassTips2.show();
                    }
                    if (event.cxHarass != 3) {
                      event.cxHarass = 3;
                      this.addBlock();
                    }
                  }
                })
                lBtn.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
                  document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', defaultevent);
                  shhMove.stop = true;
                })
                var rBtn = ui.create.div('.th-cxrbtn', document.body);         //生成右按钮
                if (player == game.me) rBtn.classList.add('self')
                else {
                  var item2 = ui.create.div('', rBtn);
                  item2.style.cssText = 'height: 88%;width: 88%;position: absolute;top: 7px;left: 7px;background-repeat:no-repeat;background-size: 100%;'
                  item2.style.backgroundImage = 'url(' + lib.assetURL + 'extension/Thunder/image/chongxu/SS_ShhXyx_daoju-play3.png)';
                }
                rBtn.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function (e) {
                  if (!game.me.isIn()) return;
                  document.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', defaultevent, false);
                  e.stopPropagation();
                  if (player == game.me) {
                    if (!_status.started) return;
                    shh.moveRight();
                    shhMove = game.thunderRAF(shh.moveRight);
                  } else {
                    if (!event.cxHarass) {
                      harassTips1.hide();
                      harassTips2.show();
                    }
                    if (event.cxHarass != 5) {
                      event.cxHarass = 5;
                      this.addBlock();
                    }
                  }
                })
                rBtn.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
                  document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', defaultevent);
                  shhMove.stop = true;
                })
                lBtn.cd = rBtn.cd = function () {
                  this.cded = true;
                  let mengban1 = ui.create.div('.th-cxmianban', this);
                  let mengban2 = ui.create.div('.th-cxmianban.right', this);
                  var cd1 = ui.create.div('.th-cxcd', mengban1);
                  var cd2 = ui.create.div('.th-cxcd.right', mengban2);
                  cd1.style.animation = 'th-cxcd 1s linear forwards';
                  cd1.addEventListener('animationend', function () {
                    cd2.style.animation = 'th-cxcd 1s linear forwards';
                    cd2.addEventListener('animationend', function () {
                      mengban1.remove();
                      mengban2.remove();
                    })
                  });
                  let that = this;
                  setTimeout(function () {
                    that.cded = false;
                  }, 2000);
                }
                lBtn.addBlock = rBtn.addBlock = function () {
                  var blocks = document.getElementsByClassName('th-cxblock');
                  if (blocks) {
                    for (var i = 0; i < blocks.length; i++) {
                      blocks[i].remove();
                    }
                  }
                  ui.create.div('.th-cxblock', this);
                }
                event.bg.addEventListener(lib.config.touchscreen ? 'touchstart' : 'click', function (e) {
                  e.stopPropagation();
                  if (!game.me.isIn() || !_status.started || _status.finished || !event.cxHarass || lBtn.cded || rBtn.cded) return;
                  harassTips2.hide();
                  var evt = e || window.event;
                  var touchX = lib.config.touchscreen ? evt.touches[0].clientX : evt.clientX;
                  var touchY = lib.config.touchscreen ? evt.touches[0].clientY : evt.clientY;
                  if (touchX - this.offsetLeft * game.documentZoom < 80 * game.documentZoom || touchX - this.offsetLeft * game.documentZoom > 875 * game.documentZoom || touchY - this.offsetTop * game.documentZoom < 31.5 * game.documentZoom || touchY - this.offsetTop * game.documentZoom > 435.5 * game.documentZoom) return;
                  if (touchX - this.offsetLeft * game.documentZoom < 130 * game.documentZoom) touchX = 130 * game.documentZoom + this.offsetLeft * game.documentZoom;
                  if (touchX - this.offsetLeft * game.documentZoom > 832 * game.documentZoom) touchX = 832 * game.documentZoom + this.offsetLeft * game.documentZoom;
                  var harassLight = ui.create.div('.th-harasslight', document.body);
                  var harassLightX = touchX / game.documentZoom - 30;
                  harassLight.style.left = harassLightX + 'px';
                  harassLight.addEventListener('animationend', function () {
                    this.remove();
                  })
                  new Drop(touchX / game.documentZoom, event.cxHarass);
                  lBtn.cd();
                  rBtn.cd();
                })

                function addDrop() {
                  game.thunderClearInterval(_status.cxdropTimer);
                  _status.cxdropTimer = game.thunderInterval(function () {
                    let dropx = Math.random() * 702 + document.body.offsetWidth * 0.5 - 349;
                    new Drop(dropx);
                  }, Math.random() * 300 + 350);
                }
                var cxTime = game.thunderCreateTimer(150, chongxuEnd);
                function chongxuEnd(timer) {
                  _status.finished = true;
                  rBtn.remove();
                  lBtn.remove();
                  scorceBg.remove();
                  game.thunderClearInterval(timer[1]);
                  timer[0].remove();
                  harassTips1.remove();
                  harassTips2.remove();
                  shhMove.stop = true;
                  dropMove.stop = true;
                  game.thunderClearInterval(_status.cxdropTimer);
                  game.thunderClearInterval(lTimer);
                  game.thunderClearInterval(rTimer);
                  game.thunderClearInterval(shhAutoMove);
                  dcdAnim.stopSpine(shh);
                  drops.forEach(i => dcdAnim.stopSpine(i.entity));
                  game.resume();
                }

                var shhAutoMove = new game.thunderRAF(function () {
                  if (!_status.started || event.isMine()) return;
                  if (!_status.finished) {
                    goodDrops.sort(function (a, b) {
                      return a.y - b.y;
                    });
                    if (goodDrops.length) {
                      var xh = goodDrops[0].x;
                      if (goodDrops[0].action < 5) {
                        if (shhx - 10 > xh) shh.moveLeft();
                        else if (shhx + 10 < xh) shh.moveRight();
                      } else {
                        if (Math.abs(shhx - xh) < 15) shh.moveRight();
                      }
                    }
                  } else shhAutoMove.stop = true;
                })
                "step 2"
                game.pause();
                if (_status.old_duiease) duilib.ease = _status.old_duiease;
                event.resultBg = ui.create.div('.th-cxresultload', document.body)
                if (event.score == 5) game.playAudio('..', 'extension', 'Thunder', 'audio', 'chongxu', 'Five_lotus');
                var bigCircle = ui.create.div('.th-cxcircle', event.resultBg);
                var scorebg = ui.create.div('.th-cxscorebg', event.resultBg);
                var scoreText = ui.create.div('', scorebg);
                scoreText.style.cssText = 'left:34px;top:7px;';
                scoreText.innerHTML = '总得分：' + event.score;
                var evaluate = '';
                switch (event.score) {
                  case 5: evaluate = '大音希声大象无形'; break;
                  case 3: case 4: evaluate = '此间奥妙似有所得'; break;
                  default: evaluate = '实难<br>参悟天机';
                }
                var evaText = ui.create.div('.th-cxevaluate', bigCircle);
                evaText.innerHTML = evaluate;
                var actionName;
                if (event.score >= 3) {
                  var actionName = 'shengli';
                } else {
                  var actionName = 'shibai';
                }
                event.shh = dcdAnim.loopSpine({ name: window._Thunder.assets.shh.name, action: actionName }, { x: document.body.offsetWidth * 0.5 - 220, y: document.body.offsetHeight * 0.5 - 130, scale: 0.7 });
                event.shh.onupdate = function () {
                  let entry = this.skeleton.state.tracks[0];
                  if (!this._changed && entry.trackTime >= 0.7 * entry.animationEnd) {
                    this._changed = true;
                    this.setAction(actionName + '_loop');
                  }
                }
                var lianhuas = [];
                for (var i = 0; i < 5; i++) {
                  var x = Math.sin(i * Math.PI / 180 * 72) * 110 + document.body.offsetWidth * 0.5 + 54;
                  var y = 110 * Math.cos(i * Math.PI / 180 * 72) + document.body.offsetHeight * 0.5 - 2;
                  let lianhua = dcdAnim.playSpine({ name: window._Thunder.assets.shhjiesuan.name, speed: 0.5 }, { x: x, y: y, scale: 0.75 });
                  lianhuas.push(lianhua);
                  if (event.score > i) lianhua.setAction('play1');
                  else lianhua.setAction('play2');
                  lianhua.onupdate = function () {
                    let entry = this.skeleton.state.tracks[0];
                    if (entry.trackTime >= 0.9 * entry.animationEnd) this.speed = 0;
                  }
                }
                var cxTimer = game.thunderCreateTimer(30, function () {
                  game.thunderClearInterval(cxTimer[1]);
                  lianhuas.forEach(i => dcdAnim.stopSpine(i));
                  scorebg.remove();
                  bigCircle.remove();
                  cxTimer[0].remove();
                  if (_status.qhly_skillTest) {
                    _status.qhly_skillTest = false;
                    dcdAnim.stopSpine(event.shh);
                    _ThAnim.stopSpineAll();
                    event.resultBg.remove();
                    event.blackbg.remove();
                    event.finish();
                  }
                  game.resume();
                });
                'step 3'
                var result = event._result;
                if (event.isMine()) {
                  game.pause();
                  var selectBg = ui.create.div('.th-cxbgdh', event.resultBg);
                  var resultText = ui.create.div('.th-cxresulttext', selectBg);
                  resultText.innerHTML = '剩余' + event.score + '分';
                  function checkCanBeSel(button) {
                    if (!button) return;
                    if (button.classList.contains('select')) return;
                    if (event.score >= button.cxcost) {
                      var skill = parseInt(button.id.substring(11));
                      if ((skill == 0 && !player.storage.miaojian || skill == 0 && player.storage.miaojian && player.storage.miaojian < 2) || (skill == 1 && !player.storage.shhlianhua || skill == 1 && player.storage.shhlianhua && player.storage.shhlianhua < 2) || skill == 2) button.classList.remove('disable');
                      else button.classList.add('disable');
                    }
                    else button.classList.add('disable');
                  }
                  resultText.refresh = function () {
                    var resultContent = '';
                    for (var j = 0; j < 3; j++) {
                      var selectx = document.getElementById('th-cxselect' + j);
                      if (selectx) {
                        checkCanBeSel(selectx);
                        if (selectx.classList.contains('select')) {
                          if (j == 0) resultContent += '升级技能“妙剑” ';
                          else if (j == 1) resultContent += '升级技能“莲华” ';
                          else if (j == 2) resultContent += '摸' + (event.doubleDraw ? 2 : 1) + '张牌 ';
                        }
                      }
                    }
                    resultContent += '剩余' + (event.doubleDraw ? event.score - 2 : event.score) + '分';
                    resultText.innerHTML = resultContent;
                  }
                  for (let i = 0; i < 3; i++) {
                    let select = ui.create.div('.th-cxselect', selectBg);
                    select.id = 'th-cxselect' + i;
                    select.cxcost = i == 2 ? 2 : 3;
                    select.classList.add('style' + i);
                    setTimeout(function () {
                      select.style.transform = 'scale(5.2) translate(' + (40 + i * 20) + 'px, -13px)';
                    }, 50);
                    select.listen(function () {
                      if (this.classList.contains('disable')) return;
                      if (this.classList.contains('select')) {
                        this.classList.remove('select');
                        event.score += this.cxcost;
                        if (document.getElementById('th-cxselect2').classList.contains('select') && event.score >= 2) event.doubleDraw = true;
                        else event.doubleDraw = false;
                      } else {
                        game.playAudio('..', 'extension', 'Thunder', 'audio', 'chongxu', 'Select_rewards');
                        dcdAnim.playSpine({ name: window._Thunder.assets.shhjiesuan.name, action: 'play3' }, { x: document.body.offsetWidth * 0.5 - 89 + parseInt(this.id.substring(11)) * 164, y: document.body.offsetHeight * 0.5 + 20.5, scale: 0.78 })
                        this.classList.add('select');
                        event.score -= this.cxcost;
                        if (this.cxcost == 2 && event.score >= 2) event.doubleDraw = true;
                        else event.doubleDraw = false;
                      }
                      resultText.refresh();
                    });
                    checkCanBeSel(select);
                  }
                  event.control = ui.create.control('ok', 'cancel2', function (link) {
                    if (game.thunderHasExt('十周年')) {
                      var con = document.getElementById('dui-controls');
                      con.classList.remove('th-confirmdown2');
                    }
                    if (link == 'ok') {
                      result.bool = true;
                      if (resultText.innerHTML.indexOf('妙剑') != -1) result.select = 1;
                      if (resultText.innerHTML.indexOf('莲华') != -1) result.select = 2;
                      if (resultText.innerHTML.indexOf('摸') != -1) result.draw = 1 + Math.floor(event.score / 2);
                    }
                    game.resume();
                  });
                  if (game.thunderHasExt('十周年')) {
                    var con = document.getElementById('dui-controls');
                    con.classList.add('th-confirmdown2');
                  }
                } else {
                  result.bool = true;
                  if (event.score >= 3) {
                    if (!player.storage.miaojian || player.storage.miaojian && player.storage.miaojian < 2) {
                      event.score -= 2;
                      result.select = 1;
                    }
                    else if (!player.storage.shhlianhua || player.storage.shhlianhua && player.storage.shhlianhua < 2) {
                      event.score -= 2;
                      result.select = 2;
                    }
                  }
                  if (event.score >= 2) {
                    result.draw = Math.floor(event.score / 2);
                  }
                }
                'step 4'
                dcdAnim.stopSpine(event.shh);
                _ThAnim.stopSpineAll();
                event.resultBg.remove();
                event.blackbg.remove();
                game.thunderAllowTouch();
                var thunderCanvas = document.getElementById('thunderDecadeUI-canvas');
                if (thunderCanvas) thunderCanvas.style['clip-path'] = 'none';
                if (event.control) event.control.close();
                if (result.bool) {
                  if (result.select) {
                    var skill = result.select == 1 ? 'miaojian' : 'shhlianhua';
                    player.addMark(skill, 1, false);
                    if (lib.config['extension_Thunder_shhbiaoji']) {
                      if (result.select == 1 && player == game.me) lib.translate.miaojian = '妙剑' + (player.countMark('miaojian') + 1) + '级';
                      else if (result.select == 2) {
                        if (player == game.me) lib.translate.shhlianhua = '莲华' + (player.countMark('shhlianhua') + 1) + '级';
                        var marks = player.querySelectorAll('.mark-text');
                        if (marks.length) {
                          for (var i = 0; i < marks.length; i++) {
                            if (marks[i].innerHTML && marks[i].innerHTML.indexOf('莲华') == 0) {
                              marks[i].innerHTML = '莲华' + (player.countMark('shhlianhua') + 1) + '级';
                            }
                          }
                        }
                      }
                    }
                    game.log(player, '升级了技能', '#g【' + get.translation(skill) + '】');
                  }
                  if (result.draw) player.draw(result.draw);
                }
              },
              ai: {
                order: 10,
                result: {
                  player: 1,
                },
              },
            },

            //蒲元
            th_shengong: {
              audio: "ext:Thunder/audio/skill:2",
              enable: 'phaseUse',
              usable: 3,
              filter: function (event, player) {
                var list = ['equip1', 'equip2', 'others'];
                for (var i = 0; i < list.length; i++) {
                  if (player.hasSkill('th_shengong_' + list[i], null, null, false)) list.splice(i--, 1);
                }
                if (!list.length) return false;
                return player.hasCard(function (card) {
                  var type = get.type(card);
                  if (type != 'equip') return false;
                  var subtype = get.subtype(card);
                  if (subtype != 'equip1' && subtype != 'equip2') subtype = 'others';
                  return list.contains(subtype);
                }, 'eh');
              },
              filterCard: function (card, player) {
                var type = get.type(card);
                if (type != 'equip') return false;
                var subtype = get.subtype(card);
                if (subtype != 'equip1' && subtype != 'equip2') subtype = 'others';
                return !player.hasSkill('th_shengong_' + subtype, null, null, false);
              },
              position: 'he',
              check: function (card) {
                var val = 7.52 - get.value(card);
                if (val <= 0) return 0;
                var player = _status.event.player;
                if (player.getStorage('th_shengong_destroy').contains(card)) val += 2;
                return val;
              },
              datie: function (type, player, count, dialog, img, tiehua, changeNum, changeT, tiechui, total) {
                var card = get.cards()[0];
                if (!_status.shengongCards) _status.shengongCards = [];
                _status.shengongCards.push(card);
                var changeD = type == 'help' ? '助力点数：' : '妨害点数：';
                var xishu1 = type == 'help' ? 0 : 284;
                var xishu2 = type == 'help' ? 124 : 441;
                var xishu3 = count > 3 ? count - 4 : count;
                var xishu4 = count > 3 ? 1 : 0;
                var info = [card.suit || '', card.number || '', card.name || '', card.nature || ''];
                var currentCard = [ui.create.card(dialog, 'noclick', true).init(info)];
                currentCard[0].id = type + 'Cards' + count;
                currentCard[0].classList.add('th-currentcard');

                if (count < 3) {
                  for (var i = 0; i <= count; i++) {
                    var changeCard = document.getElementById(type + 'Cards' + i);
                    var num = 169 - count * 40 + 79 * i + xishu1;
                    changeCard.style.left = num + 'px';
                    changeCard.style.display = 'inline-block';
                  }
                } else {
                  for (var i = 0; i <= count; i++) {
                    var changeCard = document.getElementById(type + 'Cards' + i);
                    var num = 89 + 158 / count * i + xishu1;
                    changeCard.style.left = num + 'px';
                    changeCard.style.display = 'inline-block';
                  }
                }

                changeNum += card.number;
                var str = changeNum > 9 ? '' : ' ';
                changeT.textContent = changeD + str + changeNum;

                game.thunderCreateHead(player, dialog, 36, xishu2 + xishu3 * 45, 308 + xishu4 * 40, 'ol');


                if (count != 0 || type != 'help') {
                  var tiechuiAni = type == 'help' ? 'tiechui1' : 'tiechui2';
                  //tiechui.id = 'tiechui' + total;
                  tiechui.style.display = 'block';
                  tiechui.style.animation = 'th-' + tiechuiAni + ' 0.4s';
                  img.setAttribute('src', lib.assetURL + 'extension/Thunder/image/shengong/shengong_' + type + '2.png');
                  game.playAudio('..', 'extension', 'Thunder', 'audio', 'shengong', 'shengong_datie');
                  tiechui.addEventListener('animationend', function () {
                    tiehua.style.display = 'block';
                    setTimeout(function () {
                      img.setAttribute('src', lib.assetURL + 'extension/Thunder/image/shengong/shengong_' + type + '1.png');
                      tiehua.style.display = 'none';
                    }, 100)
                    tiechui.style.display = 'none';
                  })
                }

                return changeNum;
              },
              content: function () {
                'step 0'
                game.pause();
                var helpNum = 0, hamperNum = 0, count1 = 1, count2 = 0, total = 1;
                event.datietai = ui.create.div('.th-sgdatietai', document.body);
                var shoushaJDT = document.getElementById('jindutiao');
                if (shoushaJDT) {
                  shoushaJDT.style.cssText += 'transition:none;';
                  shoushaJDT.hide();
                }
                var str = (lib.translate[player.name] || get.rawName(player)) + '弃置【' + get.translation(cards[0].name) + '】发动铸造，请选择<span style="color:#795022">助力</span>或<span style="color:#51789F">妨害</span>之';
                var titleT = ui.create.div('.th-dazaotaitopic', event.datietai);
                titleT.innerHTML = str;

                var helpT = ui.create.div('.th-shengongtext', event.datietai);
                helpT.innerHTML = '助力点数： 0';

                var hamperT = ui.create.div('.th-shengongtext.harm', event.datietai);
                hamperT.innerHTML = '妨害点数： 0';

                var tiechui1 = ui.create.div('.th-tiechui', event.datietai);

                var tiechui2 = ui.create.div('.th-tiechui.right', event.datietai);

                var tiezhan1 = ui.create.div('.th-tiezhan', event.datietai);
                tiezhan1.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                  if (!event.Chosen && player != game.me && game.me.isIn()) {
                    helpNum = lib.skill.th_shengong.datie('help', game.me, count1, event.datietai, tiezhan1, tiehua1, helpNum, helpT, tiechui1, total);
                    game.log(game.me, '助力了锻造');
                    if (player != game.me && player.ai.shown < 0.6) game.me.addExpose(0.6);
                    event.Chosen = true;
                    count1++;
                    total++;
                  }
                })
                var tiezhan2 = ui.create.div('.th-tiezhan.right', event.datietai);
                tiezhan2.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                  if (!event.Chosen && player != game.me && game.me.isIn()) {
                    hamperNum = lib.skill.th_shengong.datie('hamper', game.me, count2, event.datietai, tiezhan2, tiehua2, hamperNum, hamperT, tiechui2, total);
                    game.log(game.me, '妨害了锻造');
                    if (player != game.me && player.ai.shown < 0.6) game.me.addExpose(0.6);
                    event.Chosen = true;
                    count2++;
                    total++;
                  }
                })

                var sgTime = ui.create.div('.th-shengongtime', event.datietai);
                ui.create.div('.th-sgtimeborder', sgTime);
                ui.create.div('.th-sgtimecover', sgTime);

                var tiehua1 = ui.create.div('.th-tiehua', event.datietai);
                var tiehua2 = ui.create.div('.th-tiehua', event.datietai);
                tiehua2.style.left = '394px';

                helpNum = lib.skill.th_shengong.datie('help', player, 0, event.datietai, tiezhan1, tiehua1, 0, helpT, tiechui1, 0);
                for (let a = 0; a < game.players.length; a++) {
                  if (game.players[a] == player || game.players[a] == game.me) continue;
                  var delay = Math.floor(Math.random() * 7 + 2) * 500;
                  if (get.attitude(game.players[a], player) > 0) {
                    setTimeout(function () {
                      helpNum = lib.skill.th_shengong.datie('help', game.players[a], count1, event.datietai, tiezhan1, tiehua1, helpNum, helpT, tiechui1, total);
                      count1++;
                      total++;
                      game.log(game.players[a], '助力了锻造');
                      game.players[a].addExpose(0.6);
                    }, delay);
                  } else if (get.attitude(game.players[a], player) < 0) {
                    setTimeout(function () {
                      hamperNum = lib.skill.th_shengong.datie('hamper', game.players[a], count2, event.datietai, tiezhan2, tiehua2, hamperNum, hamperT, tiechui2, total);
                      count2++;
                      total++;
                      game.log(game.players[a], '妨害了锻造');
                      game.players[a].addExpose(0.6);
                    }, delay);
                  } else {
                    var ran = Math.random();
                    if (ran > 0.9) {
                      setTimeout(function () {
                        hamperNum = lib.skill.th_shengong.datie('hamper', game.players[a], count2, event.datietai, tiezhan2, tiehua2, hamperNum, hamperT, tiechui2, total);
                        count2++;
                        total++;
                        game.log(game.players[a], '妨害了锻造');
                        game.players[a].addExpose(0.6);
                      }, delay);
                    } else if (ran < 0.11) {
                      setTimeout(function () {
                        helpNum = lib.skill.th_shengong.datie('help', game.players[a], count1, event.datietai, tiezhan1, tiehua1, helpNum, helpT, tiechui1, total);
                        count1++;
                        total++;
                        game.log(game.players[a], '助力了锻造');
                        game.players[a].addExpose(0.6);
                      }, delay);
                    }
                  }
                }
                setTimeout(function () {
                  let wid = document.body.offsetWidth * 0.5, hei = document.body.offsetHeight * 0.5 + 50;
                  var win = helpNum >= hamperNum ? -155 : 136;
                  dcdAnim.loadSpine(window._Thunder.assets.shengong_ying.name, "skel", function () {
                    dcdAnim.playSpine({ name: window._Thunder.assets.shengong_ying.name, speed: 1.3 }, { x: [wid + win, 0], y: hei })
                  })
                  game.playAudio('..', 'extension', 'Thunder', 'audio', 'shengong', 'shengong_datie');
                  event._result = {
                    bool: true,
                    helpNum: helpNum,
                    hamperNum: hamperNum,
                  }
                  if (shoushaJDT) shoushaJDT.show();
                  game.resume();
                }, 7000);
                'step 1'
                game.delay(5);
                if (_status.shengongCards) {
                  game.cardsGotoOrdering(_status.shengongCards);
                  delete _status.shengongCards;
                }
                'step 2'
                event.datietai.remove();
                game.pause();
                var str = "shengong_shibai";
                if (result.hamperNum == 0) str = "shengong_wanmei";
                else if (result.helpNum >= result.hamperNum) str = 'shengong_chenggong';
                game.playAudio('..', 'extension', 'Thunder', 'audio', 'shengong', str);
                dcdAnim.loadSpine(window._Thunder.assets[str].name, "skel", function () {
                  dcdAnim.playSpine(window._Thunder.assets[str]);
                })
                setTimeout(function () {
                  game.resume();
                }, 3000);
                'step 3'
                event.duanzao_result = 0, str = '【神工】锻造失败：';
                if (result.hamperNum == 0) {
                  event.duanzao_result = 2;
                  str = '【神工】锻造大成功：';
                } else if (result.helpNum >= result.hamperNum) {
                  event.duanzao_result = 1;
                  str = '【神工】锻造成功：';
                }
                var subtype = get.subtype(cards[0]);
                if (subtype != 'equip1' && subtype != 'equip2') subtype = 'others';
                player.addTempSkill('th_shengong_' + subtype, 'phaseUseAfter');
                var card_map = {
                  equip1: ['wushuangfangtianji', 'guilongzhanyuedao', 'chixueqingfeng', 'bintieshuangji', 'wutiesuolian', 'wuxinghelingshan'],
                  equip2: ['linglongshimandai', 'hongmianbaihuapao', 'qimenbagua', 'guofengyupao', 'huxinjing', 'heiguangkai'],
                  others: ['shufazijinguan', 'xuwangzhimian', 'tianjitu', 'taigongyinfu', 'sanlve', 'zhaogujing'],
                };
                if (!_status.th_shengong_map) _status.th_shengong_map = {};
                if (!_status.th_shengong_maken) _status.th_shengong_maken = {};
                var list = card_map[subtype];
                for (var i = 0; i < list.length; i++) {
                  var name = list[i];
                  if (!lib.card[name] || _status.th_shengong_map[name]) {
                    list.splice(i--, 1);
                  }
                }
                if (!list.length) event.finish();
                else player.chooseButton([str, [list.randomGets(event.duanzao_result + 1), 'vcard']], true).set('ai', function (button) {
                  return get.value({ name: button.link[2] }, player, 'raw');
                });
                'step 4'
                var name = result.links[0][2];
                var card;
                if (_status.th_shengong_maken[name]) card = _status.th_shengong_maken[name];
                else {
                  card = game.createCard2(name);
                  _status.th_shengong_maken[name] = card;
                }
                event.card = card;
                player.addSkill('th_shengong_destroy');
                player.markAuto('th_shengong_destroy', [card]);
                var subtype = get.subtype(card);
                if (!game.hasPlayer(function (current) {
                  return !current.isDisabled(subtype);
                })) {
                  event.finish();
                  return;
                }
                player.chooseTarget(true, '将' + get.translation(card) + '置于一名角色的装备区内', function (card, player, target) {
                  return !target.isDisabled(_status.event.subtype);
                }).set('subtype', subtype).set('ai', function (target) {
                  var card = _status.event.getParent().card, player = _status.event.player;
                  return get.effect(target, card, player, player);
                });
                'step 5'
                if (result.bool) {
                  _status.th_shengong_map[card.name] = true;
                  var target = result.targets[0];
                  player.line(target, 'green');
                  target.$gain2(card);
                  game.delayx();
                  target.equip(card);
                }
              },
              ai: {
                order: 10,
                result: { player: 1 },
              },
              subSkill: {
                equip1: { charlotte: true },
                equip2: { charlotte: true },
                others: { charlotte: true },
                destroy: {
                  trigger: { global: ['loseEnd', 'cardsDiscardEnd'] },
                  forced: true,
                  charlotte: true,
                  popup: false,
                  onremove: true,
                  filter: function (event, player) {
                    if (event.name == 'lose' && event.position != ui.discardPile) return false;
                    var storage = player.storage.th_shengong_destroy;
                    if (!storage) return false;
                    for (var i of event.cards) {
                      if (storage.contains(i)) return true;
                    }
                    return false;
                  },
                  content: function () {
                    var cards = [];
                    var storage = player.storage.th_shengong_destroy;
                    for (var i of trigger.cards) {
                      if (storage.contains(i)) {
                        delete _status.th_shengong_map[i.name];
                        storage.remove(i);
                        cards.push(i);
                      }
                    }
                    game.cardsGotoSpecial(cards);
                    game.log(cards, '被移出了游戏');
                    player.addTempSkill('th_shengong_draw');
                    player.addMark('th_shengong_draw', cards.length, false);
                    if (!storage.length) player.removeSkill('th_shengong_destroy');
                  },
                },
                draw: {
                  audio: 'th_shengong',
                  trigger: { global: 'phaseJieshuBegin' },
                  forced: true,
                  charlotte: true,
                  onremove: true,
                  filter: function (event, player) {
                    return player.countMark('th_shengong_draw') > 0;
                  },
                  content: function () {
                    player.draw(player.countMark('th_shengong_draw'));
                  },
                },
              },
            },

            //庞德公
            th_pingcai: {
              wolong_card: function () {
                'step 0'
                var ingame = game.hasPlayer(function (current) {
                  return ['sp_zhugeliang', 're_sp_zhugeliang', 'ol_sp_zhugeliang', 'prp_zhugeliang'].contains(current.name) || ['sp_zhugeliang', 're_sp_zhugeliang', 'ol_sp_zhugeliang', 'prp_zhugeliang'].contains(current.name2);
                }) ? true : false;
                var prompt = '请选择';
                prompt += ingame ? '至多两名' : '一名';
                prompt += '角色，对其造成1点火焰伤害';
                var range = ingame ? [1, 2] : [1, 1]
                player.chooseTarget(prompt, range).set('ai', function (target) {
                  var player = _status.event.player;
                  return get.damageEffect(target, player, player, 'fire');
                });
                'step 1'
                if (result.bool && result.targets.length) {
                  player.line(result.targets, 'fire');
                  result.targets.sortBySeat();
                  for (var i = 0; i < result.targets.length; i++) {
                    result.targets[i].damage('fire');
                  }
                }
              },
              fengchu_card: function () {
                'step 0'
                var ingame = game.hasPlayer(function (current) {
                  return ['re_pangtong', 'pangtong', 'ol_pangtong'].contains(current.name) || ['re_pangtong', 'pangtong', 'ol_pangtong'].contains(current.name2);
                }) ? true : false;
                var prompt = '请选择';
                prompt += ingame ? '至多四名' : '至多三名';
                prompt += '要横置的角色';
                var range = ingame ? [1, 4] : [1, 3]
                player.chooseTarget(prompt, range).set('ai', function (target) {
                  var player = _status.event.player;
                  return get.effect(target, { name: 'tiesuo' }, player, player)
                });
                'step 1'
                if (result.bool && result.targets.length) {
                  player.line(result.targets, 'green');
                  result.targets.sortBySeat();
                  for (var i = 0; i < result.targets.length; i++) {
                    result.targets[i].link();
                  }
                }
              },
              xuanjian_card: function () {
                'step 0'
                event.ingame = game.hasPlayer(function (current) {
                  return ['re_xushu', 'xin_xushu', 'xushu', 'dc_xushu'].contains(current.name) || ['re_xushu', 'xin_xushu', 'xushu', 'dc_xushu'].contains(current.name2);
                }) ? true : false;
                var prompt = '请选择一名角色，令其回复一点体力并摸一张牌';
                prompt += event.ingame ? '，然后你摸一张牌。' : '。';
                player.chooseTarget(prompt).set('ai', function (target) {
                  var player = _status.event.player;
                  return get.attitude(player, target) * (target.isDamaged() ? 2 : 1);
                });
                'step 1'
                if (result.bool && result.targets.length) {
                  var target = result.targets[0];
                  player.line(target, 'thunder');
                  target.draw();
                  target.recover();
                  if (event.ingame) player.draw();
                }
              },
              shuijing_card: function () {
                'step 0'
                event.ingame = game.hasPlayer(function (current) {
                  return current.name == 'simahui' || current.name2 == 'simahui';
                }) ? true : false;
                var prompt = '将一名角色装备区中的';
                prompt += event.ingame ? '一张牌' : '防具牌';
                prompt += '移动到另一名角色的装备区中';
                var next = player.chooseTarget(2, function (card, player, target) {
                  if (ui.selected.targets.length) {
                    if (!_status.event.ingame) {
                      return target.isEmpty(2) ? true : false;
                    }
                    var from = ui.selected.targets[0];
                    if (target.isMin()) return false;
                    var es = from.getCards('e');
                    for (var i = 0; i < es.length; i++) {
                      if (['equip3', 'equip4'].contains(get.subtype(es[i])) && target.getEquip('liulongcanjia')) continue;
                      if (es[i].name == 'liulongcanjia' && target.countCards('e', { subtype: ['equip3', 'equip4'] }) > 1) continue;
                      if (target.isEmpty(get.subtype(es[i]))) return true;
                    }
                    return false;
                  }
                  else {
                    if (!event.ingame) {
                      if (target.getEquip(2)) return true;
                      return false;
                    }
                    return target.countCards('e') > 0;
                  }
                });
                next.set('ingame', event.ingame)
                next.set('ai', function (target) {
                  var player = _status.event.player;
                  var att = get.attitude(player, target);
                  if (ui.selected.targets.length == 0) {
                    if (att < 0) {
                      if (game.hasPlayer(function (current) {
                        if (get.attitude(player, current) > 0) {
                          var es = target.getCards('e');
                          for (var i = 0; i < es.length; i++) {
                            if (['equip3', 'equip4'].contains(get.subtype(es[i])) && current.getEquip('liulongcanjia')) continue;
                            else if (es[i].name == 'liulongcanjia' && target.countCards('e', { subtype: ['equip3', 'equip4'] }) > 1) continue;
                            else if (current.isEmpty(get.subtype(es[i]))) return true;
                          }
                          return false;
                        }
                      })) return -att;
                    }
                    return 0;
                  }
                  if (att > 0) {
                    var es = ui.selected.targets[0].getCards('e');
                    var i;
                    for (i = 0; i < es.length; i++) {
                      if (['equip3', 'equip4'].contains(get.subtype(es[i])) && target.getEquip('liulongcanjia')) continue;
                      if (es[i].name == 'liulongcanjia' && target.countCards('e', { subtype: ['equip3', 'equip4'] }) > 1) continue;
                      if (target.isEmpty(get.subtype(es[i]))) break;
                    }
                    if (i == es.length) return 0;
                  }
                  return -att * get.attitude(player, ui.selected.targets[0]);
                });
                next.set('multitarget', true);
                next.set('targetprompt', ['被移走', '移动目标']);
                next.set('prompt', prompt);
                'step 1'
                if (result.bool) {
                  player.line2(result.targets, 'green');
                  event.targets = result.targets;
                }
                else event.finish();
                'step 2'
                game.delay();
                'step 3'
                if (targets.length == 2) {
                  if (!event.ingame) {
                    event._result = {
                      bool: true,
                      links: [targets[0].getEquip(2)],
                    };
                  }
                  else {
                    player.choosePlayerCard('e', true, function (button) {
                      return get.equipValue(button.link);
                    }, targets[0]).set('targets0', targets[0]).set('targets1', targets[1]).set('filterButton', function (button) {
                      var targets1 = _status.event.targets1;
                      if (['equip3', 'equip4'].contains(get.subtype(button.link)) && targets1.getEquip('liulongcanjia')) return false;
                      if (button.link.name == 'liulongcanjia' && targets1.countCards('e', { subtype: ['equip3', 'equip4'] }) > 1) return false;
                      return !targets1.countCards('e', { subtype: get.subtype(button.link) });

                    });
                  }
                }
                else event.finish();
                'step 4'
                if (result.bool && result.links.length) {
                  var link = result.links[0];
                  if (get.position(link) == 'e') event.targets[1].equip(link);
                  else if (link.viewAs) event.targets[1].addJudge({ name: link.viewAs }, [link]);
                  else event.targets[1].addJudge(link);
                  event.targets[0].$give(link, event.targets[1], false)
                  game.delay();
                }
              },
              audio: "ext:Thunder/audio/skill:true",
              enable: "phaseUse",
              direct: true,
              filter: function (event, player) { return !player.hasSkill('th_pingcai_used') },
              content: function () {
                'step 0'
                var list2 = ['wolong_card', 'fengchu_card', 'shuijing_card', 'xuanjian_card'];
                var result = event._result;
                if (_status.qhly_skillTest) {
                  result.bool = true;
                  result.index = Math.floor(Math.random() * 4);
                  result.type = list2[result.index];
                }
                else if (event.isMine()) {
                  game.pause();
                  var chooseBg = ui.create.div('.th-pcchoosebg', document.body);
                  if (game.thunderIsPhone()) chooseBg.classList.add('mobile');
                  var leftBtn = ui.create.div('.th-pcleft', chooseBg);
                  leftBtn.style.filter = 'grayscale(100%)';
                  var rightBtn = ui.create.div('.th-pcright', chooseBg);
                  var chooseType = ui.create.div('.th-pcchoosetype', chooseBg);
                  var index = 0;
                  var list = ['卧龙', '凤雏', '水镜', '玄剑'];
                  chooseType.innerHTML = list[index];
                  leftBtn.listen(function () {
                    if (index == 0) return;
                    index--;
                    if (index == 0) leftBtn.style.filter = 'grayscale(100%)';
                    else leftBtn.style.filter = 'none';
                    if (index == 3) rightBtn.style.filter = 'grayscale(100%)';
                    else rightBtn.style.filter = 'none';
                    chooseType.innerHTML = list[index];
                  });
                  rightBtn.listen(function () {
                    if (index == 3) return;
                    index++;
                    if (index == 0) leftBtn.style.filter = 'grayscale(100%)';
                    else leftBtn.style.filter = 'none';
                    if (index == 3) rightBtn.style.filter = 'grayscale(100%)';
                    else rightBtn.style.filter = 'none';
                    chooseType.innerHTML = list[index];
                  })
                  event.control = ui.create.control('ok', 'cancel2', function (link) {
                    if (link == 'ok') {
                      result.bool = true;
                      result.index = index;
                      result.type = list2[index];
                    } else result.bool = false;
                    chooseBg.remove();
                    game.resume();
                  });
                } else {
                  var aiIndex = Array(4).fill(0.6);
                  if (game.hasPlayer(function (current) {
                    return get.damageEffect(current, player, player, 'fire') > 0;
                  })) aiIndex[0] = 1 + Math.random();
                  else aiIndex[0] = 0.5;
                  if (game.hasPlayer(function (current) {
                    return current.isDamaged() && current.hp < 3 && get.attitude(player, current) > 1;
                  })) aiIndex[3] = 1.2 + Math.random()
                  else aiIndex[3] = 1;
                  if (game.hasPlayer(function (current) {
                    var att = get.sgn(get.attitude(player, current));
                    if (att != 0) {
                      var es = current.getCards('e');
                      for (var i = 0; i < es.length; i++) {
                        if (game.hasPlayer(function (current2) {
                          if (get.sgn(get.value(es[i], current)) != -att || get.value(es[i], current) < 5) return false;
                          var att2 = get.sgn(get.attitude(player, current2));
                          if (att == att2 || att2 != get.sgn(get.effect(current2, es[i], player, current2))) return false;
                          return current != current2 && !current2.isMin() && current2.isEmpty(get.subtype(es[i]));
                        })) {
                          return true;
                        }
                      }
                    }
                  })) aiIndex[2] = 1 + Math.random();
                  else aiIndex[2] = 0.5;
                  result.bool = true;
                  result.index = aiIndex.indexOf(Math.max.apply(null, aiIndex));
                  result.type = list2[result.index];
                }
                'step 1'
                if (event.control) event.control.remove();
                if (result.bool) {
                  game.thunderForbidTouch();
                  player.addTempSkill('th_pingcai_used', 'phaseUseEnd');
                  if (!_status.qhly_skillTest) player.logSkill('th_pingcai');
                  game.pause();
                  var name = result.type;
                  event.cardname = name;
                  var imageList = [[38, 10, 277, 320], [50, 3, 272, 356], [22, 47, 318, 266], [100, 0, 164, 360]];
                  //var pixIndex = Array(4).fill([]);
                  event.pingcai_delayed = true;
                  event.thpingcaiFinished = false;
                  var event = _status.event;
                  _status.th_pingcai_finished = false;
                  event.dialog = ui.create.div('.th-pingcaiBg', document.body);
                  event.switchToAuto = function () {
                    if (event.cxTime) {
                      game.thunderClearInterval(event.cxTime[1]);
                      event.cxTime[0].remove();
                    }
                    event.tipTime.stop = true;
                    canvas3.remove();
                    canvas.remove();
                    _status.thpingcaiTips = true;
                    if (event.thpingcaiFinished || !event.isMine()) {
                      event.thpingcaiFinished = true;
                      game.playAudio('..', 'extension', 'Thunder', 'audio', 'pingcai', 'onwipesucess');
                      dcdAnim.loadSpine(window._Thunder.assets.pdgguang.name, "skel", function () {
                        dcdAnim.playSpine(window._Thunder.assets.pdgguang, { scale: 0.6 });
                      })
                    } else {
                      canvas2.remove();
                      game.playAudio('..', 'extension', 'Thunder', 'audio', 'pingcai', 'onwipefail');
                      dcdAnim.loadSpine(window._Thunder.assets[result.type].name, "skel", function () {
                        dcdAnim.playSpine(window._Thunder.assets[result.type], { scale: 0.8 });
                      })
                    }
                    event._result = {
                      bool: event.thpingcaiFinished,
                    };
                    setTimeout(function () {
                      game.thunderAllowTouch();
                      game.resume();
                    }, 1000)
                    _status.th_pingcai_finished = true;
                  };
                  var canvas = document.createElement('canvas');
                  var canvas2 = document.createElement('canvas');
                  var canvas3 = document.createElement('canvas');

                  event.dialog.appendChild(canvas2);
                  if (event.isMine()) event.dialog.appendChild(canvas);
                  event.dialog.appendChild(canvas3);

                  canvas.style.cssText = 'position:absolute;width:450px;height:450px;left:calc(50% - 225px);top:calc(50% - 225px);'
                  canvas.width = 450;
                  canvas.height = 450;

                  canvas2.style.cssText = 'pointer-events:none;position:absolute;width:360px;height:360px;left:calc(50% - 180px);top:calc(50% - 180px);'
                  canvas2.width = 360;
                  canvas2.height = 360;

                  canvas3.style.cssText = 'pointer-events:none;position:absolute;width:450px;height:450px;left:calc(50% - 225px);top:calc(50% - 225px);'
                  canvas3.width = 450;
                  canvas3.height = 450;

                  var ctx = canvas.getContext('2d');
                  var ctx2 = canvas2.getContext('2d');
                  var ctx3 = canvas3.getContext('2d');

                  event.tipTime = {};
                  var tipFrame = 0;
                  var tipImg = new Image();
                  tipImg.src = lib.assetURL + 'extension/Thunder/image/pingcai/shou.png';
                  var tipX = 0, tipY = 0;
                  event.tipTime = new game.thunderRAF(function () {
                    var data1 = ctx.getImageData(imageList[result.index][0] + 45, imageList[result.index][1] + 45, imageList[result.index][2], imageList[result.index][3]).data;
                    var data2 = ctx2.getImageData(imageList[result.index][0], imageList[result.index][1], imageList[result.index][2], imageList[result.index][3]).data;
                    var sum = 0;
                    for (var i = 3; i < data1.length; i += 40) {
                      if (data1[i] == 0 && data2[i] != 0) {
                        sum++;
                      }
                    }
                    if (sum >= imageList[result.index][4] * 0.85) {
                      event.thpingcaiFinished = true;
                      if (!_status.th_pingcai_finished) {
                        _status.th_pingcai_finished = true;
                        event.switchToAuto();
                      }
                    }
                    if (!_status.thpingcaiTips || _status.qhly_skillTest) {
                      canvas3.height = canvas3.height;
                      if (!event.tipUp) {
                        tipX = 140 + Math.sin(tipFrame) * 100 + Math.random() * 100;
                        tipY = 20 + tipFrame * 3;
                      } else {
                        tipX -= 20;
                        tipY -= 40;
                      }
                      ctx3.drawImage(tipImg, tipX, tipY, 50, 50);
                      if (tipY >= 400 && tipX >= 260) {
                        event.tipUp = true;
                      }
                      if (tipY <= 20) {
                        event.tipUp = false;
                        tipFrame = (tipY - 20) / 3;
                      }
                      tipFrame++;
                    }
                  })
                  var img = new Image();

                  if (event.isMine()) {
                    var mouse = null;
                    var lastMouse = null;
                    var img2 = new Image();
                    img2.src = lib.assetURL + 'extension/Thunder/image/pingcai/cover.png';
                    img2.onload = function () {
                      ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);
                      img.src = lib.assetURL + 'extension/Thunder/image/pingcai/' + result.type + '.png';
                      img.onload = function () {
                        ctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas2.width, canvas2.height);
                        var data = ctx2.getImageData(imageList[result.index][0], imageList[result.index][1], imageList[result.index][2], imageList[result.index][3]).data;
                        var sum = 0;
                        for (var i = 3; i < data.length; i += 40) {
                          if (data[i] > 0) {
                            sum++
                            //pixIndex[result.index].push(i);
                          }
                        }
                        imageList[result.index].push(sum);
                      }
                    }
                    function onMove(x, y) {
                      if (mouse) {
                        lastMouse = mouse;
                      }
                      mouse = {
                        x: x,
                        y: y,
                      };
                      drawLine();
                    }
                    function drawLine() {
                      if (!mouse) return;
                      if (lastMouse) {
                        ctx.lineWidth = 48;
                        ctx.lineCap = 'round';
                        ctx.moveTo(lastMouse.x, lastMouse.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                      } else {
                        ctx.arc(mouse.x, mouse.y, 24, 0, 2 * Math.PI);
                        ctx.fill();
                      }
                    }
                    canvas.onmousedown = function (ev) {
                      if (_status.th_pingcai_finished) return;
                      canvas.onmousemove = function (e) {
                        if (_status.th_pingcai_finished) return;
                        ctx.beginPath();
                        ctx.globalCompositeOperation = 'destination-out';
                        onMove(e.offsetX / game.documentZoom, e.offsetY / game.documentZoom);
                      }
                    }
                    canvas.ontouchstart = function (ev) {
                      if (_status.th_pingcai_finished) return;
                      canvas.ontouchmove = function (e) {
                        if (_status.th_pingcai_finished) return;
                        ctx.beginPath();
                        var rect = canvas.getBoundingClientRect();
                        var X = ((e.touches[0].clientX / game.documentZoom - rect.left) / rect.width * canvas.width);
                        var Y = ((e.touches[0].clientY / game.documentZoom - rect.top) / rect.height * canvas.height);
                        ctx.globalCompositeOperation = 'destination-out';
                        onMove(X, Y);
                      }
                    }
                    event.cxTime = game.thunderCreateTimer(200, event.switchToAuto, null, 700, 6, 130);
                    canvas.onmouseup = function (ev) {
                      canvas.onmousemove = null;
                    }
                    canvas.ontouchend = function (ev) {
                      canvas.ontouchmove = null;
                    }
                  } else {
                    img.src = lib.assetURL + 'extension/Thunder/image/pingcai/' + result.type + '.png';
                    img.onload = function () {
                      ctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas2.width, canvas2.height);
                      // var data = ctx2.getImageData(imageList[result.index][0], imageList[result.index][1], imageList[result.index][2], imageList[result.index][3]).data;
                      // var sum = 0;
                      // for (var i = 3; i < data.length; i += 40) {
                      //     if (data[i] > 0) {
                      //         sum++
                      //         pixIndex[result.index].push(i);
                      //     }
                      // }
                      // imageList[result.index].push(sum);
                    }
                    event.switchToAuto();
                  }
                } else {
                  event.finish();
                }

                'step 2'
                if (_status.qhly_skillTest) {
                  _status.qhly_skillTest = false;
                  if (event.dialog) event.dialog.remove();
                  event.finish();
                  return;
                }
                var result = event.result || result;
                if (!result) result = { bool: false };
                event._result = result;
                _status.th_pingcai_finished = true;
                if (event.dialog) event.dialog.remove();
                delete event.pingcai_delayed;
                game.delay(2.5);
                "step 3"
                if (result.bool) {
                  player.logSkill('th_pcaudio_' + event.cardname);
                  event.insert(lib.skill.th_pingcai[event.cardname], {
                    player: player,
                  });
                }
              },
              ai: {
                order: 7,
                fireAttack: true,
                threaten: 1.7,
                result: {
                  player: 1,
                },
              },
              subSkill: {
                used: {}
              }
            },
            th_pcaudio_wolong_card: {
              audio: "ext:Thunder/audio/skill:true",
            },
            th_pcaudio_fengchu_card: {
              audio: "ext:Thunder/audio/skill:true",
            },
            th_pcaudio_shuijing_card: {
              audio: "ext:Thunder/audio/skill:true",
            },
            th_pcaudio_xuanjian_card: {
              audio: "ext:Thunder/audio/skill:true",
            },

            //郑玄
            th_zhengjing: {
              audio: "ext:Thunder/audio/skill:2",
              enable: 'phaseUse',
              usable: 1,
              direct: true,
              // init: function () {
              //     game.thunderLoadFont({ url: lib.assetURL + 'extension/Thunder/assets/th-poem.woff2', cssValue: 'th-poem' });
              //     game.thunderLoadFont({ url: lib.assetURL + 'extension/Thunder/assets/th-zhongli.woff2', cssValue: 'th-zhongli' });
              // },
              filter: function (event, player) {
                if (!window.zhengjingxiao) {
                  window.zhengjingxiao = true;
                  dcdAnim.loadSpine(window._Thunder.assets.zj_jihuo.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.zj_mianban.name, "skel");
                }
                return true;
              },
              content: function () {
                'step 0'
                game.thunderForbidTouch();
                game.pause();
                _status.startCut = false;
                _status.fruitCutting = false;
                _status.thzjFinished = false;
                _status.thzhengjingfirstload = false;
                _status.threpeatAudio = lib.config.repeat_audio;
                lib.config.repeat_audio = false;
                var cards = [];
                var names = [];
                while (true) {
                  var card = get.cardPile(function (carde) {
                    return carde.name != 'du' && !names.contains(carde.name);
                  });
                  if (card) {
                    cards.push(card);
                    names.push(card.name);
                    if (_status.qhly_skillTest) {
                      if (cards.length >= 5) break;
                    }
                    else if (get.mode() == 'doudizhu') {
                      if (cards.length == 1 && !get.isLuckyStar(player) && Math.random() < 0.33) break;
                      if (cards.length == 2 && !get.isLuckyStar(player) && Math.random() < 0.5) break;
                      if (cards.length >= 3) break;
                    }
                    else {
                      if (cards.length == 3 && !get.isLuckyStar(player) && Math.random() < 0.33) break;
                      if (cards.length == 4 && !get.isLuckyStar(player) && Math.random() < 0.5) break;
                      if (cards.length >= 5) break;
                    }
                  }
                  else break;
                };
                if (!cards.length) { event.finish(); return; };
                event.blackbg = ui.create.div('.th-dibeijing', document.body);
                event.blackbg.style.background = 'rgba(0,0,0,0.7)';
                event.shoushaJDT = document.getElementById('jindutiao');
                if (event.shoushaJDT) {
                  event.shoushaJDT.style.cssText += 'transition:none';
                  event.shoushaJDT.hide();
                }
                var zjBg = dcdAnim.playSpine(window._Thunder.assets.zj_mianban, { y: document.body.offsetHeight * 0.5 + 40, scale: 0.7 });
                _status.thzhengjingDaojishi = _status.thzhengjingDaojishiTotal = 520;
                setTimeout(function () {
                  zjBg.clip = {
                    x: [0, -0.01],
                    y: 0,
                    width: [0, 0.25],
                    height: [0, 1],
                    clipParent: true
                  }
                }, 2200);
                setTimeout(function () {
                  player.thunderFruit(cards);
                }, 2100);
                'step 1'
                event.blackbg.remove();
                game.thunderAllowTouch();
                if (_status.threpeatAudio) lib.config.repeat_audio = _status.threpeatAudio;
                if (_status.qhly_skillTest) {
                  _status.qhly_skillTest = false;
                  event.finish();
                  return;
                } else {
                  _status.firstZhengjing = true;
                  if (result.bool) {
                    event.cards = result.cards;
                    game.cardsGotoOrdering(event.cards);
                  } else event.finish();
                }
                'step 2'
                game.updateRoundNumber();
                if (event.shoushaJDT) event.shoushaJDT.show();
                player.chooseTarget('将整理出的经典置于一名角色的武将牌上', true).set('ai', function (target) {
                  if (target.hasSkill('xinfu_pdgyingshi')) return 0;
                  var player = _status.event.player;
                  var att = get.attitude(player, target);
                  return -att;
                });
                'step 3'
                if (result.bool) {
                  player.logSkill('th_zhengjing', target);
                  var target = result.targets[0];
                  event.target = target;
                  player.line(target, 'thunder');
                }
                'step 4'
                if (event.cards.length == 1) {
                  event._result = { bool: true, moved: [cards, []] };
                  return;
                }
                var next = player.chooseToMove('整经：请分配整理出的经典', true);
                next.set('list', [
                  ['置于' + get.translation(target) + '的武将牌上', event.cards],
                  ['自己获得'],
                ]);
                next.set('filterMove', function (from, to, moved) {
                  if (moved[0].length == 1 && to == 1 && from.link == moved[0][0]) return false;
                  return true;
                });
                next.set('filterOk', function (moved) {
                  return moved[0].length > 0;
                });
                next.set('processAI', function (list) {
                  var cards = list[0][1].slice(0).sort(function (a, b) {
                    return get.value(a) - get.value(b);
                  });
                  return [cards.splice(0, 1), cards];
                })
                'step 5'
                if (result.bool) {
                  var cards = result.moved[0], gains = result.moved[1];
                  target.addSkill('th_zhengjing2');
                  target.addToExpansion(cards, 'gain2').gaintag.add('th_zhengjing2');
                  if (gains.length) player.gain(gains, 'gain2');
                }
              },
              ai: {
                order: 10,
                result: { player: 1 },
                threaten: 3.2,
              }
            },
            th_zhengjing2: {
              trigger: { player: 'phaseZhunbeiBegin' },
              forced: true,
              charlotte: true,
              intro: { content: 'expansion', markcount: 'expansion' },
              onremove: function (player, skill) {
                var cards = player.getExpansions(skill);
                if (cards.length) player.loseToDiscardpile(cards);
              },
              content: function () {
                'step 0'
                player.gain(player.getExpansions('th_zhengjing2'), 'gain2');
                player.skip('phaseJudge');
                player.skip('phaseDraw');
                'step 1'
                player.removeSkill('th_zhengjing2');
              },
            },

            //马日磾
            th_chengye: {
              audio: "ext:Thunder/audio/skill:2",
              liujing_filter: [
                function (card) {
                  return get.type(card, false) == 'trick' && get.tag(card, 'damage', null, false) > 0;
                },
                (card) => get.type(card, false) == 'basic',
                (card) => get.name(card, false) == 'wuxie',
                (card) => get.name(card, false) == 'wuzhong',
                (card) => get.name(card, false) == 'lebu',
                (card) => get.type(card, false) == 'equip',
              ],
              getLiujing: function (player, index) {
                var filter = lib.skill.th_chengye.liujing_filter[index], expansion = player.getExpansions('th_chengye');
                for (var i of expansion) {
                  if (filter(i)) return i;
                }
                return false;
              },
              trigger: { global: ['useCardAfter', 'loseAfter', 'cardsDiscardAfter'] },
              forced: true,
              filter: function (event, player) {
                if (player == event.player) return false;
                if (event.name == 'useCard') {
                  if (!event.card.isCard) return false;
                  var cards = event.cards.filterInD();
                  if (!cards.length) return false;
                }
                else if (event.name == 'lose') {
                  if (event.position != ui.discardPile) return false;
                  var cards = event.cards2.filter(function (card) {
                    if (get.position(card, true) != 'd') return false;
                    var type = get.type(card, false);
                    return type == 'delay' || type == 'equip';
                  });
                  if (!cards.length) return false;
                }
                else {
                  var evtx = event.getParent();
                  if (evtx.name != 'orderingDiscard') return false;
                  var evt2 = (evtx.relatedEvent || evtx.getParent());
                  if (evt2.name != 'phaseJudge' || evt2.player == player) return;
                  var cards = event.cards.filter(function (card) {
                    if (get.position(card, true) != 'd') return false;
                    var type = get.type(card, false);
                    return type == 'delay';
                  });
                  if (!cards.length) return false;
                }
                for (var i = 0; i < 6; i++) {
                  if (lib.skill.th_chengye.getLiujing(player, i)) continue;
                  for (var j of cards) {
                    if (lib.skill.th_chengye.liujing_filter[i](j)) return true;
                  }
                }
                return false;
              },
              content: function () {
                var cards, cards2 = [];
                if (trigger.name == 'useCard') {
                  cards = trigger.cards.filterInD();
                }
                else if (trigger.name == 'lose') {
                  cards = trigger.cards2.filter(function (card) {
                    if (get.position(card, true) != 'd') return false;
                    var type = get.type(card, false);
                    return type == 'delay' || type == 'equip';
                  });
                }
                else {
                  cards = trigger.cards.filter(function (card) {
                    if (get.position(card, true) != 'd') return false;
                    var type = get.type(card, false);
                    return type == 'delay';
                  });
                }
                for (var i = 0; i < 6; i++) {
                  if (lib.skill.th_chengye.getLiujing(player, i)) continue;
                  for (var j of cards) {
                    if (lib.skill.th_chengye.liujing_filter[i](j)) {
                      cards.remove(j);
                      cards2.push(j);
                      break;
                    }
                  }
                  if (!cards.length) break;
                }
                player.addToExpansion(cards2, 'gain2').gaintag.add('th_chengye');
              },
              onremove: function (player, skill) {
                var cards = player.getExpansions(skill);
                if (cards.length) player.loseToDiscardpile(cards);
              },
              marktext: '典',
              intro: {
                name: '承业',
                markcount: 'expansion',
                content: 'expansion',
                mark: function (dialog, storage, player) {
                  var liujing = ['诗', '书', '礼', '易', '乐', '春秋'];
                  var liujingdian = ['伤害锦囊牌', '基本牌', '无懈可击', '无中生有', '乐不思蜀', '装备牌'];
                  var bg = ui.create.div('.th-dibeijing', document.body);
                  bg.style.cssText += 'font-family:"th-zhongli";font-size:15px';
                  bg.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
                    this.remove();
                  });
                  var buxu = game.thunderDialog(bg, { height: 282, width: 860, title: '承业' });
                  var dianbg = ui.create.div('.th-mamididian', buxu.container);
                  for (var i = 0; i < 6; i++) {
                    var paizi = ui.create.div('.th-mamidipaizi', dianbg);
                    paizi.style.left = (4.5 + (i % 3) * 30.8) + '%';
                    paizi.style.top = (i > 2 ? 46 : 3) + '%';
                    paizi.innerHTML = liujing[i];
                    var card = lib.skill.th_chengye.getLiujing(player, i);
                    if (!card) {
                      var tips = ui.create.div('.th-mamiditips', dianbg);
                      tips.style.left = (12.5 + (i % 3) * 30.8) + '%';
                      tips.style.top = (i > 2 ? 61 : 16) + '%';
                      var str = "缺少<br>";
                      str += liujingdian[i];
                      tips.innerHTML = str;
                    } else {
                      var info = [card.suit || undefined, card.number || undefined, card.name || undefined, card.nature || undefined];
                      var smCard = ui.create.card(dianbg, 'noclick', true).init(info);
                      smCard.classList.add('th-zjcard');
                      if (game.thunderIsPhone()) smCard.classList.add('dui-mobile');
                      smCard.style.left = (11 + (i % 3) * 30.8) + '%';
                      smCard.style.top = (i > 2 ? 37 : -6.5) + '%';
                      smCard.style.transform = 'scale(0.6)';
                    }
                  }
                },
              },
              group: ['th_chengye_gain', 'th_chengye_look'],
              subSkill: {
                gain: {
                  trigger: { player: 'phaseUseBegin' },
                  forced: true,
                  filter: function (event, player) {
                    return player.getExpansions('th_chengye').length >= 6;
                  },
                  content: function () {
                    player.gain(player.getExpansions('th_chengye'), 'gain2');
                  },
                },
                look: {
                  enable: 'phaseUse',
                  direct: true,
                  delay: false,
                  content: function () {
                    var liujing = ['诗', '书', '礼', '易', '乐', '春秋'];
                    var liujingdian = ['伤害锦囊牌', '基本牌', '无懈可击', '无中生有', '乐不思蜀', '装备牌'];
                    event.bg = ui.create.div('.th-dibeijing', document.body);
                    event.bg.style.cssText += 'font-family:"th-zhongli";font-size:15px';
                    event.bg.style.zIndex = 8;
                    event.bg.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
                      this.remove();
                      event.finish();
                    });
                    var buxu = game.thunderDialog(event.bg, { height: 282, width: 860, title: '承业' });
                    var dianbg = ui.create.div('.th-mamididian', buxu.container);
                    for (var i = 0; i < 6; i++) {
                      var paizi = ui.create.div('.th-mamidipaizi', dianbg);
                      paizi.style.left = (4.5 + (i % 3) * 30.8) + '%';
                      paizi.style.top = (i > 2 ? 46 : 3) + '%';
                      paizi.innerHTML = liujing[i];
                      var card = lib.skill.th_chengye.getLiujing(player, i);
                      if (!card) {
                        var tips = ui.create.div('.th-mamiditips', dianbg);
                        tips.style.left = (12.5 + (i % 3) * 30.8) + '%';
                        tips.style.top = (i > 2 ? 61 : 16) + '%';
                        var str = "缺少<br>";
                        str += liujingdian[i];
                        tips.innerHTML = str;
                      } else {
                        var info = [card.suit || undefined, card.number || undefined, card.name || undefined, card.nature || undefined];
                        var smCard = ui.create.card(dianbg, 'noclick', true).init(info);
                        smCard.classList.add('th-zjcard');
                        if (game.thunderIsPhone()) smCard.classList.add('dui-mobile');
                        smCard.style.left = (11 + (i % 3) * 30.8) + '%';
                        smCard.style.top = (i > 2 ? 37 : -6.5) + '%';
                        smCard.style.transform = 'scale(0.6)';
                      }
                    }
                  },
                }
              },
            },
            th_buxu: {
              audio: "ext:Thunder/audio/skill:2",
              enable: 'phaseUse',
              filter: function (event, player) {
                var num = (player.getStat('skill').th_buxu || 0) + 1;
                return player.countCards('he') >= num && player.getExpansions('th_chengye').length < 6;
              },
              selectCard: function () {
                var player = _status.event.player;
                return (player.getStat('skill').th_buxu || 0) + 1;
              },
              filterCard: true,
              position: 'he',
              prompt: function () {
                var player = _status.event.player;
                var str = '你可发动补续，弃置';
                str += (player.getStat('skill').th_buxu || 0) + 1;
                str += '张牌，将1张典置于武将牌上';
                return str;
              },
              check: function (card) {
                var player = _status.event.player;
                if (player.needsToDiscard() > ui.selected.cards.length) return 10 / Math.max(0.1, get.value(card));
                return 5 - (player.getStat('skill').th_buxu || 0) - get.value(card);
              },
              content: function () {
                'step 0'
                if (event.isMine()) {
                  game.pause();
                  var liujing = ['诗', '书', '礼', '易', '乐', '春秋'];
                  var liujingdian = ['伤害锦囊牌', '基本牌', '无懈可击', '无中生有', '乐不思蜀', '装备牌'];
                  event.bg = ui.create.div('.th-dibeijing', document.body);
                  event.bg.style.cssText += 'font-family:"th-zhongli";font-size:15px';
                  var buxu = game.thunderDialog(event.bg, { height: 300, width: 860, title: '补续' });
                  var dianbg = ui.create.div('.th-mamididian', buxu.container);
                  dianbg.style.height = '86%';
                  event.shoushaJDT = document.getElementById('jindutiao');
                  if (event.shoushaJDT) {
                    event.shoushaJDT.style.cssText += 'transition:none';
                    event.shoushaJDT.hide();
                  }
                  for (var i = 0; i < 6; i++) {
                    var paizi = ui.create.div('.th-mamidipaizi', dianbg);
                    paizi.style.left = (4.5 + (i % 3) * 30.8) + '%';
                    paizi.style.top = (i > 2 ? 46 : 3) + '%';
                    paizi.innerHTML = liujing[i];
                    var card = lib.skill.th_chengye.getLiujing(player, i);
                    if (!card) {
                      var tips = ui.create.div('.th-mamiditips', dianbg);
                      tips.style.left = (12.5 + (i % 3) * 30.8) + '%';
                      tips.style.top = (i > 2 ? 54 : 9) + '%';
                      var str = "选择<br>";
                      str += liujingdian[i];
                      tips.innerHTML = str;
                      var buBtn = ui.create.div('.th-mamidibu', dianbg);
                      buBtn.style.left = (18.3 + (i % 3) * 30.8) + '%';
                      buBtn.style.top = (i > 2 ? 68 : 24) + '%';
                      //buBtn.innerHTML = '补';
                      buBtn.id = i;
                      buBtn.listen(function () {
                        var filter = lib.skill.th_chengye.liujing_filter[this.id];
                        var card = get.cardPile(filter);
                        if (card) {
                          player.addToExpansion(card, 'gain2').gaintag.add('th_chengye');
                        } else {
                          game.log('剩余牌堆中没有你需要的牌');
                          player.getStat('skill').th_buxu--;
                        }
                        game.thunderClearInterval(time[1]);
                        game.resume();
                      });
                    } else {
                      var info = [card.suit || undefined, card.number || undefined, card.name || undefined, card.nature || undefined];
                      var smCard = ui.create.card(dianbg, 'noclick', true).init(info);
                      smCard.classList.add('th-zjcard');
                      if (game.thunderIsPhone()) smCard.classList.add('dui-mobile');
                      smCard.style.left = (11 + (i % 3) * 30.8) + '%';
                      smCard.style.top = (i > 2 ? 37 : -6.5) + '%';
                      smCard.style.transform = 'scale(0.6)';
                    }
                  }
                  var tishi = ui.create.div('.th-mamiditishi', buxu.container);
                  tishi.style.fontSize = Math.round(document.body.offsetWidth * 0.014) + 'px';
                  tishi.innerHTML = '你发动了<span style="color:#67ac9a">补续</span>，选择1种六经并将1张对应的典置于武将牌上';
                  var time = game.thunderCreateTimer(480, function () {
                    game.thunderClearInterval(time[1]);
                    time[0].remove();
                    var indexList = [], filter, index, card;
                    for (var i = 0; i < 6; i++) {
                      if (!lib.skill.th_chengye.getLiujing(player, i)) indexList.push(i);
                    }
                    if (indexList.length) {
                      index = indexList.randomGet();
                    }
                    filter = lib.skill.th_chengye.liujing_filter[index];
                    var card = get.cardPile(filter);
                    if (card) {
                      player.addToExpansion(card, 'gain2').gaintag.add('th_chengye');
                    } else {
                      game.log('剩余牌堆中没有你需要的牌');
                      player.getStat('skill').th_buxu--;
                    }
                    game.resume();
                  }, event.bg);
                  time[0].style.top = /* ((document.body.offsetHeight - 360) * 0.4 + document.body.offsetWidth * 0.052 + 265) + 'px'*/ 'calc(40% + 200px)';
                  time[0].style.left = 'calc(50% - var(--w) * 0.5 - 2px)';
                  buxu.onResize.push(function () {
                    if (buxu.isMin) time[0].style.top = /* (3 + document.body.offsetHeight * 0.6 + document.body.offsetWidth * 0.036) + 'px' */'calc(50% + 120px)';
                    else time[0].style.top = 'calc(40% + 200px)';
                  })
                } else {
                  var indexList = [], filter, index, card;
                  for (var i = 0; i < 6; i++) {
                    if (!lib.skill.th_chengye.getLiujing(player, i)) indexList.push(i);
                  }
                  if (indexList.length) {
                    index = indexList.randomGet();
                  }
                  filter = lib.skill.th_chengye.liujing_filter[index];
                  var card = get.cardPile(filter);
                  if (card) {
                    player.addToExpansion(card, 'gain2').gaintag.add('th_chengye');
                  } else {
                    game.log('剩余牌堆中没有你需要的牌');
                    player.getStat('skill').th_buxu--;
                  }
                  event.finish();
                }
                'step 1'
                if (event.shoushaJDT) event.shoushaJDT.show();
                event.bg.remove();
              },
              ai: {
                combo: 'th_chengye',
                order: 0.2,
                result: { player: 1 },
              },
            },

            //南华老仙
            th_yufeng: {
              audio: "ext:Thunder/audio/skill:2",
              enable: 'phaseUse',
              init: function (player) { player.storage.th_yufeng = 1 },
              usable: 1,
              filter: function (event, player) {
                if (!window.yufengxiao) {
                  window.yufengxiao = true;
                  dcdAnim.loadSpine(_Thunder.assets.yf_shibaixing.name, "skel");
                  dcdAnim.loadSpine(_Thunder.assets.yf_shenglixing.name, "skel");
                  _ThAnim.loadSpine(_Thunder.thAssets.yf_daojishi.name, "skel");
                  _ThAnim.loadSpine(_Thunder.thAssets.yf_xingpo.name, "skel");
                  _ThAnim.loadSpine(_Thunder.thAssets.yf_nanhua.name, "skel");
                }
                return true;
              },
              content: function () {
                'step 0'
                //2400*866
                game.thunderForbidTouch();
                game.pause();
                if (duilib && duilib.ease) {
                  _status.old_duiease = duilib.ease;
                  duilib.ease = function (fraction) {
                    if (!duilib.b3ease) duilib.b3ease = new duilib.CubicBezierEase(0.1, 0.1, 0.1, 0.1);
                    return duilib.b3ease.ease(fraction);
                  }
                }
                var blackbg = ui.create.div('.th-dibeijing', document.body);
                blackbg.style.background = 'rgba(0,0,0,0.7)';
                var shoushaJDT = document.getElementById('jindutiao');
                if (shoushaJDT) {
                  shoushaJDT.style.cssText += 'transition:none;';
                  shoushaJDT.hide();
                }
                var frame = 0;
                var commentFrame = 0;
                var resultFrame = 0;
                var timerFrame = 550;
                event.score = 0;
                var resultType = '';
                var comment = '';
                var cT, cM, bL;//结算标题，面板，大老仙
                //关卡数据:类型，X坐标，Y坐标，宽度，高度
                var stageList = [[[7, 214, 296, 240, 218], [4, 418, 202, 30, 30], [2, 606, 6, 350, 132], [10, 496, -8, 128, 112], [5, 632, 263, 250, 198], [12, 909, -35, 190, 198], [4, 958, 308, 30, 30], [1, 1106, -95, 495, 207], [3, 1667, 48, 280, 107], [12, 1283, 365, 190, 190], [11, 1489, -4, 217, 200], [9, 1863, 40, 145, 172]],
                [[5, 165, 342, 250, 198], [7, 220, 296, 240, 218], [4, 442, 261, 30, 30], [12, 427, -70, 190, 198], [12, 463, 370, 185, 180], [6, 610, 195, 264, 280], [2, 606, 6, 350, 132], [11, 905, -27, 217, 200], [4, 962, 220, 30, 30], [10, 1018, 335, 128, 112], [10, 1200, 104, 124, 112], [5, 1243, 300, 250, 210], [1, 1106, -95, 495, 207], [3, 1622, 83, 266, 107], [10, 1540, -7, 128, 114], [10, 1868, 82, 127, 115], [7, 1647, 224, 240, 218], [4, 1900, 312, 30, 30]]];
                var goodJump = [[[526, 450, 429, 385, 310, 275, 205, 140, 80], [523, 450, 404, 387, 310, 248, 195, 135, 75]],
                [[518, 450, 419, 408, 326, 325, 313, 246, 208, 145, 140, 135, 59, 44], [520, 450, 415, 402, 399, 320, 318, 252, 215, 146, 128, 62]]];
                var badJump = [[[529, 426, 450], [529, 450, 413, 392, 336], [519, 517, 411], [517, 452, 413, 385, 321, 291, 249]],
                [[520, 450], [518, 450, 419, 408, 330, 325, 265], [527, 456, 405, 384, 326], [516, 455, 419, 405, 324, 286, 280], [520, 458, 446]]];
                var totalScore = 3;
                if (!_status.qhly_skillTest) totalScore = Math.max(2, player.storage.th_yufeng);
                var starNum = 0;
                var starTotal = totalScore;
                var stage = stageList[totalScore - 2];
                var yfbg = document.createElement('canvas');
                yfbg.classList.add('th-yufengbg');
                yfbg.style.setProperty('--w', document.body.offsetWidth + 'px');
                var ctx = yfbg.getContext('2d');
                yfbg.width = window.innerWidth * 2;
                yfbg.height = Math.ceil(yfbg.width * 0.3617);
                var canvasScale = yfbg.width / 1200;
                yfbg.renderList = [];
                blackbg.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function (e) {
                  e.stopPropagation();
                  if (!event.isMine()) return;
                  if (!event.loaded || event.yfFinished || laoxian.stageStep > 2) return;
                  game.playAudio('..', 'extension', 'Thunder', 'audio', 'yufeng', 'yufeng_fly');
                  isDown = false;
                  lxSpeed = 3;
                  laoxian.setAction('qitiao');
                })
                var aiJump = [];
                var randomLimit = totalScore > 2 ? 0.65 : 0.9;
                if (Math.random() < randomLimit) aiJump = goodJump[totalScore - 2].randomGet();
                else aiJump = badJump[totalScore - 2].randomGet();
                document.body.appendChild(yfbg);
                var resultbg = document.createElement('canvas');
                var ctx2 = resultbg.getContext('2d');
                resultbg.classList.add('th-yfresultbg');
                resultbg.style.setProperty('--w', document.body.offsetWidth + 'px');
                resultbg.width = yfbg.width;
                resultbg.height = Math.ceil(yfbg.width * 0.4);
                document.body.appendChild(resultbg);
                var bgImg = new Image();
                bgImg.src = lib.assetURL + 'extension/Thunder/image/yufeng/yufengbg.jpg';
                bgImg.onload = function () {
                  ctx.drawImage(this, 0, 0, 1659, 600, 0, 0, yfbg.width, yfbg.height);
                }
                var yfItems = [];
                for (var i = 0; i < 13; i++) {
                  yfItems[i] = new Image();
                  yfItems[i].src = lib.assetURL + 'extension/Thunder/image/yufeng/bg' + i + '.png';
                }
                yfItems[13] = new Image();
                yfItems[13].src = lib.assetURL + 'extension/Thunder/image/effect/blank.png';
                var timer = new Image();
                timer.src = lib.assetURL + 'extension/Thunder/image/effect/time.png';
                var timecover = new Image();
                timecover.src = lib.assetURL + 'extension/Thunder/image/effect/timeX.png';
                var laoxianX = window.innerWidth * 0.09 / game.documentZoom;
                var laoxianY = (window.innerHeight * 0.5 + yfbg.height * 0.085) / game.documentZoom;
                var laoxianWidth = window.innerWidth * 0.05 / game.documentZoom;
                var laoxianHeight = yfbg.height * 0.075 / game.documentZoom;
                var newLaoxianX = laoxianX, newLaoxianY = laoxianY;
                var laoxian = _ThAnim.loopSpine(_Thunder.thAssets.yf_nanhua, { x: laoxianX, y: laoxianY, height: laoxianHeight });
                laoxian.stageStep = 1;
                var lxSpeed = 0, isDown = false;
                var lxX = 0, lxY = 0, lxW = 0, lxH = 0;//老仙在画布上的坐标
                var vc = document.createElement('canvas');
                var vi = vc.getContext('2d');
                vc.classList.add('th-yufengbg');
                vc.style.setProperty('--w', document.body.offsetWidth + 'px');
                vc.width = yfbg.width * 0.25;
                vc.height = yfbg.height * 0.25;
                function drawVirtual(img, x, y, width, height) {
                  vi.clearRect(0, 0, vc.width, vc.height);
                  vi.save();
                  vi.drawImage(img, x * 0.25, y * 0.25, width * 0.25, height * 0.25);
                  vi.restore();
                }
                function getInRect(x1, y1, x2, y2, x3, y3, x4, y4) {//x,y,x+w,y+h
                  return [Math.max(x1, x3), Math.max(y1, y3), Math.min(x2, x4), Math.min(y2, y4)];
                }
                var laoxianImg = new Image();
                laoxianImg.src = lib.assetURL + 'extension/Thunder/image/yufeng/nanhua.png';
                (function () {
                  var drawItem = function (thunder) {
                    var type = thunder[0] < 4 ? 'grass' : 'stone';
                    if (thunder[0] == 4) type = 'star';
                    var item = {
                      id: type,
                      left: thunder[1] * canvasScale,
                      top: thunder[2] * canvasScale,
                      width: thunder[3] * canvasScale,
                      height: thunder[4] * canvasScale,
                      canHit: type > 3,
                      img: yfItems[thunder[0]],
                      hited: false,
                      check: function () { },
                    }
                    function render() {
                      var x = item.left - 1.44 * frame * canvasScale;
                      var y = item.top;
                      ctx.drawImage(item.img, x, y, item.width, item.height);
                      if (item.hited) {
                        if (item.id == 'star') {
                          //yfbg.renderList.remove(render);
                          item.id = 'grass';
                          item.img = yfItems[13];
                          game.playAudio('..', 'extension', 'Thunder', 'audio', 'yufeng', 'yufeng_getStar');
                          event.score++;
                          let xingpo = _ThAnim.playSpine(_Thunder.thAssets.yf_xingpo, { x: (x * 0.5 + item.width * 0.25) / game.documentZoom, y: ((window.innerHeight + yfbg.height * 0.5) * 0.5 - y * 0.5 - item.height * 0.25) / game.documentZoom, height: item.height * 2 });
                          if (laoxian.stageStep != 2) xingpo.moveTo((x * 0.5 - item.width * 0.5) / game.documentZoom, null, 400);
                        } else if (item.id != 'grass') laoxian.isDead = true;
                      }
                      if (item.id != 'grass') {
                        // //测试片段
                        // ctx.strokeStyle = 'black';
                        // ctx.beginPath();
                        // ctx.strokeRect(x, y, item.width, item.height);
                        // ctx.closePath();
                        // //测试片段
                        var rect = getInRect(lxX, lxY, lxX + lxW, lxY + lxH, x, y, x + item.width, y + item.height);
                        if (rect[0] < rect[2] && rect[1] < rect[3]) {
                          // ctx.strokeStyle = 'red';
                          // ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
                          if (item.id == 'star') item.hited = true;
                          else {
                            drawVirtual(item.img, x, y, item.width, item.height);
                            var data1 = vi.getImageData(rect[0] * 0.25, rect[1] * 0.25, rect[2] * 0.25, rect[3] * 0.25).data;
                            drawVirtual(laoxianImg, lxX, lxY, lxW, lxH);
                            var data2 = vi.getImageData(rect[0] * 0.25, rect[1] * 0.25, rect[2] * 0.25, rect[3] * 0.25).data;
                            for (var i = 3; i < data1.length; i += 4) {
                              if (data1[i] > 0 && data2[i] > 0) {
                                item.hited = true;
                              }
                            }
                          };
                        }
                      }
                    }
                    yfbg.renderList.push(render);
                  }
                  for (var i = 0; i < stage.length; i++) {
                    drawItem(stage[i]);
                  }
                })();

                var yfRender = new game.thunderRAF(yfdrawList), stars = [];
                function yfdrawList() {
                  yfbg.height = yfbg.height;
                  resultbg.height = resultbg.height;
                  if (event.loaded && !laoxian.isDead) {
                    if (laoxian.stageStep != 2) frame += 2.5;
                    timerFrame = Math.max(0, --timerFrame);
                  }
                  ctx.drawImage(bgImg, frame, 0, 1659, 600, 0, 0, yfbg.width, yfbg.height);
                  if (!event.yfFinished) {
                    ctx2.drawImage(timer, Math.round(318 * canvasScale), Math.round(440 * canvasScale), Math.round(566 * canvasScale), Math.round(20 * canvasScale));
                    ctx2.drawImage(timecover, 0, 0, timecover.width * (timerFrame / 550), timecover.height, Math.round(320 * canvasScale), Math.round(442 * canvasScale), Math.round(562 * canvasScale * (timerFrame / 550)), Math.round(16 * canvasScale));
                  }
                  yfbg.renderList.forEach(function (fn) {
                    fn();
                  });
                  if (!event.isMine() && aiJump.contains(timerFrame)) {
                    lxSpeed = 3;
                    game.playAudio('..', 'extension', 'Thunder', 'audio', 'yufeng', 'yufeng_fly');
                    laoxian.setAction('qitiao');
                  }
                  //老仙移动
                  if (!laoxian.isDead && event.loaded && laoxian.stageStep < 3 && !event.yfFinished) {
                    if (lxSpeed < -0.35) isDown = true;
                    if (isDown) {
                      lxSpeed -= 0.1;
                      lxSpeed = Math.max(-6, lxSpeed);
                    } else {
                      lxSpeed -= 0.15;
                    }
                    if (lxSpeed <= 0) laoxian.setAction('xialuo');
                    if (laoxian.stageStep == 2) newLaoxianX += 2 * canvasScale / game.documentZoom;
                    if (laoxian.stageStep < 3) newLaoxianY += lxSpeed * canvasScale / game.documentZoom;
                    laoxian.updateTimeStep('x', laoxianX, newLaoxianX, 16.67);
                    laoxian.x = newLaoxianX;
                    laoxian.updateTimeStep('y', laoxianY, newLaoxianY, 16.67);
                    laoxian.y = newLaoxianY;
                    // //测试片段
                    // ctx.strokeStyle = 'black';
                    // ctx.beginPath();
                    lxX = (laoxianX * 2 - laoxianWidth * 1.4) * game.documentZoom;
                    lxY = window.innerHeight + yfbg.height - (laoxianY * 2 + laoxianHeight * 7.6) * game.documentZoom;
                    lxW = laoxianWidth * 2 * game.documentZoom;
                    lxH = laoxianHeight * 2.28 * game.documentZoom
                    // ctx.strokeRect(lxX, lxY, lxW, lxH);
                    // ctx.closePath();
                    // //测试片段
                  }
                  if (!event.loaded && !event.firstLoad) {
                    event.firstLoad = true;
                    let daojishi = _ThAnim.playSpine(_Thunder.thAssets.yf_daojishi, { scale: canvasScale * 0.5 });
                    daojishi.oncomplete = function () { event.loaded = true }
                  }
                  if (event.yfFinished && comment.length) {
                    if (!event.firstComment) {
                      cT = new Image();
                      cT.src = lib.assetURL + 'extension/Thunder/image/yufeng/' + resultType + 'Title.png';
                      cM = new Image();
                      cM.src = lib.assetURL + 'extension/Thunder/image/yufeng/' + resultType + 'Bg.png';
                      bL = new Image();
                      bL.src = lib.assetURL + 'extension/Thunder/image/yufeng/nanhuaResult.png';
                      event.firstComment = true;
                    } else {
                      ctx2.save();
                      ctx2.beginPath();
                      ctx2.shadowBlur = 5;
                      ctx2.shadowOffsetY = 3;
                      ctx2.shadowColor = "gray";
                      ctx2.drawImage(cT, yfbg.width - commentFrame * canvasScale, 144 * canvasScale, 375 * canvasScale, 36 * canvasScale);
                      ctx2.closePath();
                      ctx2.beginPath();
                      if (resultType == 'fail') {
                        ctx2.shadowColor = "black";
                        ctx2.shadowBlur = 40;
                        ctx2.shadowOffsetX = 5;
                        ctx2.shadowOffsetY = 5;
                      } else ctx2.restore();
                      ctx2.drawImage(cM, 0, 0, cM.width * ((resultFrame - 8) / 15), cM.height, 510 * canvasScale, 180 * canvasScale, 340 * ((resultFrame - 8) / 15) * canvasScale, 140 * canvasScale);
                      if (resultFrame >= 23) {
                        ctx2.fillStyle = 'white';
                        ctx2.font = 20 * canvasScale + "px 'shousha'";
                        ctx2.fillText(comment, 680 * canvasScale - comment.length * 10 * canvasScale, 260 * canvasScale);
                      }
                      ctx2.closePath();
                      if (resultType == 'fail') ctx2.restore();
                      ctx2.save();
                      ctx2.globalAlpha = Math.min(1, resultFrame / 8);
                      ctx2.drawImage(bL, 290 * canvasScale, 106 * canvasScale, 280 * canvasScale, 230 * canvasScale);
                      ctx2.restore();
                    }
                    commentFrame += 30;
                    if (resultFrame >= 23 && !event.kuangAsset) {
                      event.kuangAsset = true;
                      var kuangScale = resultType == 'win' ? 0.36 : 0.41;
                      dcdAnim.loadSpine(_Thunder.assets['yf_' + resultType + 'kuang'].name, "skel", function () {
                        dcdAnim.playSpine({ name: _Thunder.assets['yf_' + resultType + 'kuang'].name, speed: 0.9 }, { x: 345 * canvasScale / game.documentZoom, y: 159 * canvasScale / game.documentZoom, scale: kuangScale * canvasScale / game.documentZoom, parent: resultbg });
                      })
                    }
                    if (starTotal > 0 && (resultFrame == 26 || resultFrame == 28 || resultFrame == 30)) {
                      let starScale = starNum > 0 ? 0.325 : 0.35;
                      let star = dcdAnim.playSpine({ name: _Thunder.assets['yf_' + (starNum > 0 ? 'shengli' : 'shibai') + 'xing'].name }, { x: (345 + totalScore * 15 - starTotal * 30) * canvasScale / game.documentZoom, y: 160 * canvasScale / game.documentZoom, scale: starScale * canvasScale / game.documentZoom, parent: resultbg });
                      star.onupdate = function () {
                        var entry = this.skeleton.state.tracks[0];
                        if (entry.trackTime >= 0.9 * entry.animationEnd) {
                          this.speed = 0;
                        }
                      }
                      stars.push(star);
                      starNum--;
                      starTotal--;
                    }
                    if (commentFrame > 728) {
                      commentFrame = 728;
                      if (!event.zitiAssets) {
                        event.zitiAssets = true;
                        var zitiScale = resultType == 'win' ? 0.34 : 0.38;
                        dcdAnim.loadSpine(_Thunder.assets['yf_' + resultType + 'ziti'].name, "skel", function () {
                          dcdAnim.playSpine({ name: _Thunder.assets['yf_' + resultType + 'ziti'].name, speed: 0.9 }, { x: 345 * canvasScale / game.documentZoom, y: 117.5 * canvasScale / game.documentZoom, scale: zitiScale * canvasScale / game.documentZoom, parent: resultbg });
                        })
                      }
                    }
                    resultFrame++;
                    if (resultFrame >= 120 && !event.thunder) {
                      event.thunder = true;
                      yufengEnd();
                    }
                  }

                  if (frame == 800) {
                    laoxian.stageStep = 2;
                  }
                  if (!event.yfFinished && (laoxianX >= yfbg.width * 0.3725 / game.documentZoom || laoxian.isDead)) {
                    if (!laoxian.isDead && event.score) {
                      laoxian.setAction('fei');
                      laoxian.stageStep = 3;
                    } else laoxian.isDead = true;
                    setResult();
                  }
                }
                function setResult() {
                  event.yfFinished = true;
                  starNum = event.score;
                  event._result = {
                    bool: !laoxian.isDead && event.score,
                  }
                  resultType = event._result.bool ? 'win' : 'fail';
                  game.playAudio('..', 'extension', 'Thunder', 'audio', 'yufeng', 'yufeng_' + resultType);
                  comment = '“满载而归，哈哈哈”';
                  if (event.score == 0) comment = '“惜哉，未能窥见星辰”';
                  else if (laoxian.isDead) comment = '“风紧，赶紧跑”';
                  else if (totalScore > event.score) comment = '“星辰已纳入囊中”';
                }
                function yufengEnd() {
                  yfRender.stop = true;
                  game.thunderAllowTouch();
                  blackbg.remove();
                  yfbg.remove();
                  resultbg.remove();
                  _ThAnim.stopSpineAll();
                  stars.forEach(i => dcdAnim.stopSpine(i));
                  game.resume();
                  if (shoushaJDT) shoushaJDT.show();
                }
                laoxian.onupdate = function () {
                  if (this.timestepMap.x) {
                    laoxianX = this.timestepMap.x.current;
                    laoxianY = this.timestepMap.y.current;
                    if (this.timestepMap.y.current + laoxianHeight * 0.5 >= ((window.innerHeight + yfbg.height * 0.5) * 0.5 - 0) / game.documentZoom || this.timestepMap.y.current - laoxianHeight * 0.8 <= ((window.innerHeight + yfbg.height * 0.5) * 0.5 - yfbg.height * 0.5) / game.documentZoom) {
                      this.isDead = true;
                    }
                  }
                }
                'step 1'
                if (_status.old_duiease) duilib.ease = _status.old_duiease;
                if (result.bool && !_status.qhly_skillTest) {
                  player.storage.th_yufeng = Math.min(3, ++player.storage.th_yufeng);
                  player.chooseTarget('你可令至多' + event.score + '名角色跳过出牌弃牌或摸牌阶段', [1, event.score], function (card, player, target) {
                    return target != player && !target.hasSkill('yufeng2');
                  }).set('ai', function (target) {
                    var player = _status.event.player;
                    var att = -get.attitude(player, target), attx = att * 2;
                    if (att <= 0 || target.hasSkill('xinfu_pdgyingshi')) return 0;
                    if (target.hasJudge('lebu')) attx -= att;
                    if (target.hasJudge('bingliang')) attx -= att;
                    return attx / Math.max(2.25, Math.sqrt(target.countCards('h') + 1));
                  });
                } else {
                  if (!_status.qhly_skillTest) {
                    player.storage.th_yufeng = 1;
                    if (event.score) player.draw(event.score);
                  } else _status.qhly_skillTest = false;
                  event.finish();
                }
                'step 2'
                if (result.bool) {
                  result.targets.sortBySeat();
                  player.line(result.targets, 'green');
                  game.log(result.targets, '获得了', '#y“御风”', '效果');
                  for (var i of result.targets) i.addSkill('yufeng2');
                  if (event.score > result.targets.length) player.draw(event.score - result.targets.length);
                }
                else player.draw(event.score);
              },
              ai: {
                order: 10,
                result: { player: 1 },
                threaten: 3.2,
              }
            },
            th_tianshu: {
              audio: "ext:Thunder/audio/skill:2",
              trigger: { player: 'phaseUseBegin' },
              filter: function (event, player) {
                return player.countCards('he') > 0 && !game.hasPlayer(function (current) {
                  return current.countCards('hejsx', 'th_taipingyaoshu');
                });
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseCardTarget({
                  prompt: '你可弃置1张牌令1名角色装备【太平要术】',
                  filterCard: true,
                  position: 'he',
                  filterTarget: true,
                  ai1: (card) => 6 - get.value(card),
                  ai2: function (target) {
                    return get.attitude(_status.event.player, target) > 0 && target.getUseValue({ name: 'th_taipingyaoshu' });
                  },
                });
                'step 1'
                if (result.bool) {
                  player.logSkill('th_tianshu');
                  player.discard(result.cards[0]);
                  if (!lib.inpile.contains('th_taipingyaoshu')) {
                    lib.inpile.push('th_taipingyaoshu');
                    event.card = game.createCard2('th_taipingyaoshu', 'heart', 3);
                  }
                  else {
                    event.card = get.cardPile(function (card) {
                      return card.name == 'th_taipingyaoshu';
                    });
                  }
                  if (!event.card) event.finish();
                  else result.targets[0].gain(event.card, 'gain2');
                } else event.finish();
                'step 2'
                if (result.targets[0].getCards('h').contains(card) && get.name(card, target) == 'th_taipingyaoshu') result.targets[0].chooseUseTarget(card, 'nopopup', true);
                dcdAnim.loadSpine(_Thunder.assets.tpys.name, "skel", function () {
                  dcdAnim.playSpine(_Thunder.assets.tpys, { parent: result.targets[0], scale: 0.8 });
                })
              },
            },
            th_g_taipingyaoshu_ai: {
              ai: {
                effect: {
                  player: function (card, player) {
                    if (player.hasSkill('wendao')) return;
                    if (card.name == 'th_taipingyaoshu' && game.hasPlayer(function (current) {
                      return current.hasSkill('wendao') && get.attitude(player, current) <= 0;
                    })) {
                      return [0, 0, 0, 0];
                    }
                  }
                }
              }
            },
            th_taipingyaoshu: {
              equipSkill: true,
              mod: {
                maxHandcard: function (player, num) {
                  if (get.mode() == 'guozhan') {
                    if (player.hasSkill('huangjintianbingfu')) {
                      num += player.getExpansions('huangjintianbingfu').length;
                    }
                    return num + game.countPlayer(function (current) {
                      return current.isFriendOf(player);
                    });
                  }
                  return num + game.countGroup() - 1;
                }
              },
              trigger: { player: 'damageBegin4' },
              filter: function (event, player) {
                if (player.hasSkillTag('unequip2')) return false;
                if (event.source && event.source.hasSkillTag('unequip', false, {
                  name: event.card ? event.card.name : null,
                  target: player,
                  card: event.card
                })) return false;
                if (event.nature) return true;
              },
              forced: true,
              content: function () {
                trigger.cancel();
              },
              ai: {
                nofire: true,
                nothunder: true,
                effect: {
                  target: function (card, player, target, current) {
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
                    if (get.tag(card, 'natureDamage')) return 'zerotarget';
                    if (card.name == 'tiesuo') {
                      return [0, 0];
                    }
                  }
                }
              }
            },
            th_g_taipingyaoshu: {},


            //马钧
            th_qiaosi: {
              audio: "ext:Thunder/audio/skill:2",
              usable: 1,
              enable: 'phaseUse',
              // init: function () {
              //     game.thunderLoadFont({ url: lib.assetURL + 'extension/Thunder/assets/th-zhongli.woff2', cssValue: 'th-zhongli' });
              //     game.thunderLoadFont({ url: lib.assetURL + 'font/shousha.ttf', cssValue: 'shousha' });
              // },
              filter: function (event, player) {
                if (!window.qiaosixiao) {
                  window.qiaosixiao = true;
                  dcdAnim.loadSpine(_Thunder.assets.qs_tishi.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.qs_0.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.qs_1.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.qs_2.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.qs_3.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.qs_4.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.qs_5.name, "skel");
                  dcdAnim.loadSpine(_Thunder.assets.qs_guang.name, "skel");
                }
                return true;
              },
              content: function () {
                'step 0'
                game.pause();
                game.thunderForbidTouch();
                event.threpeatAudio = lib.config.repeat_audio;
                lib.config.repeat_audio = false;
                event.canvas = document.createElement('canvas');
                event.canvas.classList.add('th-szbxtbg');
                event.canvas.id = 'th-szbxt';
                event.canvas.width = 945;
                event.canvas.height = 540;
                document.body.appendChild(event.canvas);
                event.ctx = event.canvas.getContext('2d');
                event.ctx.font = '28px "shousha"';
                event.ctx.strokeStyle = 'black';
                event.ctx.fillStyle = 'white';
                event.ctx.lineWidth = 3;
                event.shoushaJDT = document.getElementById('jindutiao');
                if (event.shoushaJDT) {
                  event.shoushaJDT.style.cssText += 'transition:none;';
                  event.shoushaJDT.hide();
                }
                var H = 0;
                event._result = {
                  bool: false,
                  index: [],
                }
                var frame = 380;
                var num = 0;
                var balls = [[], [], [], [], [], []];
                event.blackbg = ui.create.div('.th-dibeijing', document.body);
                event.blackbg.style.cssText += 'background:rgba(0,0,0,0.4);font-family:"th-zhongli";font-size:15px';
                var bxtbg = new Image();
                if (player == game.me) bxtbg.src = lib.assetURL + 'extension/Thunder/image/qiaosi/baixitu_bg.png';
                else bxtbg.src = lib.assetURL + 'extension/Thunder/image/qiaosi/baixitu_view_bg2.png';
                event.canvas.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function (e) {
                  if (event.bxtFinished || !event.isMine()) return;
                  if (lib.config.touchscreen) {
                    //var rect = event.canvas.getBoundingClientRect();
                    var x = ((e.touches[0].clientX - event.canvas.offsetLeft * game.documentZoom) / game.documentZoom);
                    var y = ((e.touches[0].clientY - event.canvas.offsetTop * game.documentZoom) / game.documentZoom);
                  } else {
                    var x = e.clientX / game.documentZoom - event.canvas.offsetLeft;
                    var y = e.clientY / game.documentZoom - event.canvas.offsetTop;
                  }
                  if (tipAnim) dcdAnim.stopSpine(tipAnim);
                  if (y > 170 || y < 110) return;
                  for (let i = 0; i < 6; i++) {
                    if (x < 120 + i * 131 || x > 180 + i * 131) continue;
                    clickPipe(i);
                  }
                })
                function clickPipe(index) {
                  if (player == game.me) game.playAudio('..', 'extension', 'Thunder', 'audio', 'qiaosi', 'water');
                  bxtInfo[index][3] = true;
                  bxtInfo[index][2].speed = 1;
                }
                function rotateCanvas(x, y, angle, img, size) {
                  event.ctx.save();
                  event.ctx.translate(x, y);
                  event.ctx.rotate(angle)
                  event.ctx.drawImage(img, 0, 0, img.width, img.height, -size * 0.5, -size * 0.5, size * 3.1, size);
                  event.ctx.restore();
                }
                function getRandom(min, max) {
                  return Math.random() * (max - min);
                }
                function createBall(init_x, init_y, init_w, num) {
                  for (var i = 0; i < num; i++) {
                    const width = init_w * 0.45;
                    let dx = -width * 0.2 + i * Math.random() * 4;
                    let dy = 2 + Math.random() * 2;
                    for (let j = 0; j < 3; j++) {
                      balls.push(new ball(init_x + Math.sin(i), init_y + j * 5, dx, dy, width));
                    }
                  }
                }
                function ball(init_x, init_y, dx, dy, width) {
                  this.x = init_x;
                  this.y = init_y;
                  this.color = '#497cab';
                  this.dx = dx;
                  this.dy = dy;
                  this.draw = function () {
                    event.ctx.save();
                    event.ctx.beginPath();
                    event.ctx.fillStyle = this.color;
                    event.ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
                    event.ctx.fill();
                    event.ctx.closePath();
                    event.ctx.restore();
                  }
                  this.update = function () {
                    const xLeft = this.x + this.dx - 2.5;
                    const xRight = this.x + this.dx + 2.5;
                    //const yBottom = this.y + this.dy + this.radius + g;
                    this.dy += getRandom(1, 3);
                    if (xLeft < init_x - width || xRight > init_x + width) {
                      this.dx = -this.dx;
                    }
                    this.y += this.dy;
                    this.x += this.dx;
                    if (this.y <= 360) this.draw();
                    else balls.remove(this);
                  }
                }
                var bxtInfo = [];
                const characterPercent = [22.1, 48.2, 100, 100, 41.3, 20.2];
                for (var i = 0; i < 6; i++) {
                  bxtInfo[i] = [0, 0, null, false, characterPercent[i], false];
                }
                var pipe = new Image();
                pipe.src = lib.assetURL + 'extension/Thunder/image/qiaosi/baixitu_water_pip.png';
                var pipebg = new Image();
                pipebg.src = lib.assetURL + 'extension/Thunder/image/qiaosi/baixitu_water_bg.png';
                var disc = new Image();
                disc.src = lib.assetURL + 'extension/Thunder/image/qiaosi/baixitu_onoff_bg.png';
                var handle = new Image();
                handle.src = lib.assetURL + 'extension/Thunder/image/qiaosi/baixitu_onoff_handle.png';
                event.timer = new Image();
                event.timer.src = lib.assetURL + 'extension/Thunder/image/effect/time.png';
                event.timecover = new Image();
                event.timecover.src = lib.assetURL + 'extension/Thunder/image/effect/timeX.png';
                var timetotal = frame;
                var tipAnim = null;
                bxtbg.onload = function () {
                  H = bxtbg.height * event.canvas.width / bxtbg.width;
                  event.bgLoaded = true;
                }
                var bxtRender = new game.thunderRAF(function () {
                  if (!event.bgLoaded) return;
                  event.ctx.clearRect(0, 0, event.canvas.width, event.canvas.height);
                  event.ctx.drawImage(bxtbg, 0, (event.canvas.height - H) * 0.5, event.canvas.width, H);
                  for (let i = 0; i < 6; i++) {
                    let index = i > 2 ? 6 - i : i + 1;
                    let pipewidth = Math.max(12, index * 8);
                    if (player == game.me) {
                      event.ctx.drawImage(pipebg, 149 - pipewidth * 0.5 + i * 130, 140, pipewidth, 260);
                      event.ctx.drawImage(pipe, 0, 0, 10, pipe.height, 146 - pipewidth * 0.5 + i * 130, 140, 10, 260);
                      event.ctx.drawImage(pipe, 11, 0, 10, pipe.height, 142 + pipewidth * 0.5 + i * 130, 140, 10, 260);
                      event.ctx.drawImage(disc, 118 + i * 130, 109, 62, 62);
                      rotateCanvas(149 + i * 130, 140, bxtInfo[i][0], handle, 14);
                      if (bxtInfo[i][0] >= Math.PI * 2) {
                        bxtInfo[i][0] = 0;
                        bxtInfo[i][3] = false;
                      }

                      let str = Math.round(bxtInfo[i][1]) + '%';
                      event.ctx.strokeText(str, 136 + i * 130 - str.length * 0.5 * 8, 500);
                      event.ctx.fillText(str, 136 + i * 130 - str.length * 0.5 * 8, 500);

                      if (!_status.szbxtFirst) {
                        _status.szbxtFirst = true;
                        tipAnim = dcdAnim.loopSpine({ name: _Thunder.assets.qs_tishi.name, loopCount: 2 }, { x: 409, y: 402, scale: 0.6, parent: event.canvas });
                      }
                    }
                    if (bxtInfo[i][3] == true) {
                      bxtInfo[i][0] += Math.PI / (index * 15);
                      bxtInfo[i][1] += bxtInfo[i][4] / (index * 30);
                      if (player == game.me) {
                        createBall(149 + i * 130, 160 + Math.random(), pipewidth, index);
                      }
                      if (bxtInfo[i][1] >= 100) {
                        bxtInfo[i][1] = 100;
                        if (!bxtInfo[i][5]) {
                          bxtInfo[i][5] = true;
                          num++;
                          game.playAudio('..', 'extension', 'Thunder', 'audio', 'qiaosi', 'qs_' + i);
                          if (player == game.me) dcdAnim.playSpine(_Thunder.assets.qs_guang, { x: 149 + i * 130, y: 56, scale: 0.9, parent: event.canvas });
                          bxtInfo[i][2].setAction('TeShu');
                        }
                      }
                    }
                    if (!event.characterLoad) {
                      let X = player == game.me ? (149 + i * 130) : (158 + i * 128);
                      let Y = player == game.me ? 64 : 110;
                      bxtInfo[i][2] = dcdAnim.loopSpine({ name: window._Thunder.assets['qs_' + i].name, speed: 0 }, { x: X, y: Y, scale: 0.75, parent: event.canvas });
                    }
                  }
                  if (player == game.me) balls.forEach(e => { if (e.update) e.update() });
                  event.ctx.drawImage(event.timer, 245, 514, 458, 22);
                  event.ctx.drawImage(event.timecover, 0, 0, event.timecover.width * (frame / timetotal), event.timecover.height, 247, 516, 454 * (frame / timetotal), 18);
                  event.characterLoad = true;
                  frame--;
                  if (frame == 0 || num == 3) {
                    num = 100;
                    bxtRender.stop = true;
                    event.bxtFinished = true;
                    var scuess = [];
                    bxtInfo.forEach((item, index) => {
                      if (item[5] == true) scuess.push(index);
                    })
                    event._result = {
                      bool: scuess.length > 0,
                      index: scuess,
                    }
                    if (!scuess.length) game.playAudio('..', 'extension', 'Thunder', 'audio', 'qiaosi', 'fail');
                    bxtInfo.forEach(i => dcdAnim.stopSpine(i[2]));
                    game.resume();
                  }
                  if (!event.isMine() && !event.bxtFinished && event.characterLoad && frame % 20 == 0) {
                    var randClick = get.rand(0, 5);
                    clickPipe(randClick);
                  }
                });
                'step 1'
                lib.config.repeat_audio = event.threpeatAudio;
                if (player == game.me) {
                  game.pause();
                  var frame = 100, timetotal = 100;
                  var resultbg = new Image();
                  resultbg.src = lib.assetURL + 'extension/Thunder/image/qiaosi/baixitu_view_bg2.png';
                  var character = [];
                  var H = 0;
                  resultbg.onload = function () {
                    H = resultbg.height * event.canvas.width / resultbg.width;
                  }
                  var bxtRender = new game.thunderRAF(function () {
                    event.ctx.clearRect(0, 0, event.canvas.width, event.canvas.height);
                    event.ctx.drawImage(resultbg, 0, (event.canvas.height - H) * 0.5, event.canvas.width, H);
                    event.ctx.drawImage(event.timer, 245, 514, 458, 22);
                    event.ctx.drawImage(event.timecover, 0, 0, event.timecover.width * (frame / timetotal), event.timecover.height, 247, 516, 454 * (frame / timetotal), 18);
                    frame--;
                    if (frame == 0) {
                      bxtRender.stop = true;
                      character.forEach(i => dcdAnim.stopSpine(i));
                      //dcdAnim.stopSpineAll();
                      game.resume();
                    }
                  })
                  for (var i = 0; i < 6; i++) {
                    character[i] = dcdAnim.loopSpine({ name: window._Thunder.assets['qs_' + i].name, speed: 0 }, { x: 158 + i * 128, y: 110, scale: 0.75, parent: event.canvas });
                    if (result.bool) {
                      if (result.index.contains(i)) {
                        game.playAudio('..', 'extension', 'Thunder', 'audio', 'qiaosi', 'qs_' + i);
                        character[i].speed = 1;
                        character[i].setAction('TeShu');
                      }
                    }
                  }
                  if (!result.bool) {
                    setTimeout(function () {
                      game.playAudio('..', 'extension', 'Thunder', 'audio', 'qiaosi', 'fail');
                    }, 1000);
                  }

                }
                'step 2'
                event.canvas.remove();
                event.blackbg.style.background = 'rgba(0,0,0,0)';
                var list = result.index;
                var cards = [];
                var list2 = [];
                if (list.contains(0)) {
                  list2.push('trick');
                  list2.push('trick');
                }
                if (list.contains(1)) {
                  if (list.contains(0)) list2.push(['sha', 'jiu']);
                  else list2.push(Math.random() < 0.66 ? 'equip' : ['sha', 'jiu']);
                }
                if (list.contains(2)) {
                  list2.push([Math.random() < 0.66 ? 'sha' : 'jiu'])
                }
                if (list.contains(3)) {
                  list2.push([Math.random() < 0.66 ? 'shan' : 'tao'])
                }
                if (list.contains(4)) {
                  if (list.contains(5)) list2.push(['shan', 'tao']);
                  else list2.push(Math.random() < 0.66 ? 'trick' : ['shan', 'tao']);
                }
                if (list.contains(5)) {
                  list2.push('equip');
                  list2.push('equip');
                }
                while (list2.length) {
                  var filter = list2.shift();
                  var card = get.cardPile(function (x) {
                    if (cards.contains(x)) return false;
                    if (typeof filter == 'string' && get.type(x, 'trick') == filter) return true;
                    if (typeof filter == 'object' && filter.contains(x.name)) return true;
                  });
                  if (card) cards.push(card);
                  else {
                    var card = get.cardPile(function (x) {
                      return !cards.contains(x);
                    });
                    if (card) cards.push(card);
                  }
                }
                if (cards.length) {
                  game.pause();
                  event.cards = cards;
                  event.num = cards.length;
                  var bxtShow = game.thunderDialog(event.blackbg, { width: 790, height: 160, title: '巧思' });
                  if (bxtShow.theme == 'shousha') ui.create.div('.th-bxttips', bxtShow.container, '手牌');
                  var showCard = ui.create.div('.buttons', bxtShow.container);
                  if (bxtShow.theme == 'decade') showCard.style.backgroundColor = 'rgba(162, 133, 91, 0.4)';
                  else showCard.style.backgroundColor = 'rgba(76, 65, 59, 0.4)';
                  showCard.classList.add('popup');
                  showCard.classList.add('th-yuqiAll', 'th-bxtcards');
                  if (bxtShow.theme == 'shousha') showCard.style.cssText += 'margin-right:30%';
                  if (game.thunderIsPhone()) {
                    showCard.style.setProperty('--z', 0.8);
                  }
                  ui.create.buttons(event.cards, 'card', showCard);
                  var time = game.thunderCreateTimer(40, function () {
                    game.thunderClearInterval(time[1]);
                    time[0].remove();
                    event.blackbg.remove();
                    console.log(555555)
                    game.resume();
                  }, event.blackbg);
                  time[0].style.top = ((document.body.offsetHeight - 160) * 0.4 + document.body.offsetWidth * 0.052 + 150) + 'px';
                  time[0].style.left = 'calc(50% - var(--w) * 0.5 - 2px)';
                  bxtShow.onResize.push(function () {
                    if (bxtShow.isMin) time[0].style.top = (3 + document.body.offsetHeight * 0.6 + document.body.offsetWidth * 0.036) + 'px';
                    else time[0].style.top = ((document.body.offsetHeight - 160) * 0.4 + document.body.offsetWidth * 0.052 + 150) + 'px';
                  })
                } else {
                  event.blackbg.remove();
                  event.finish();
                }
                'step 3'
                game.thunderAllowTouch();
                if (event.shoushaJDT) event.shoushaJDT.show();
                player.gain(event.cards, 'gain2');
                player.chooseControl('交出' + event.num + '张牌', '弃置' + event.num + '张牌', true).set('ai', function () {
                  if (game.hasPlayer(function (current) {
                    return current != player && get.attitude(player, current) > 2;
                  })) return 0;
                  return 1;
                });
                'step 4'
                if (result.index == 0) {
                  player.chooseCardTarget({
                    position: 'he',
                    filterCard: true,
                    selectCard: event.num,
                    filterTarget: function (card, player, target) {
                      return player != target;
                    },
                    ai1: function (card) {
                      return 1;
                    },
                    ai2: function (target) {
                      var att = get.attitude(_status.event.player, target);
                      if (target.hasSkillTag('nogain')) att /= 10;
                      if (target.hasJudge('lebu')) att /= 5;
                      return att;
                    },
                    prompt: '选择1名角色，并选择' + get.cnNumber(event.num) + '张牌交给他',
                    forced: true,
                  });
                }
                else {
                  player.chooseToDiscard(event.num, true, 'he');
                  event.finish();
                }
                'step 5'
                if (result.bool) {
                  var target = result.targets[0];
                  player.give(result.cards, target);
                }
              },
              ai: {
                order: 7.5,
                result: {
                  player: 1,
                },
              },
            },
            th_jingxie: {
              audio: "ext:Thunder/audio/skill:2",
              enable: 'phaseUse',
              group: 'th_jingxie_recover',
              position: "he",
              filter: function (event, player) {
                var he = player.getCards('he');
                for (var i = 0; i < he.length; i++) {
                  if (["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].contains(he[i].name)) return true;
                }
                return false;
              },
              filterCard: function (card) {
                return ["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].contains(card.name);
              },
              discard: false,
              lose: false,
              delay: false,
              check: function () {
                return 1;
              },
              content: function () {
                game.pause();
                var card2 = cards[0];
                var bool = (get.position(card2) == 'e');
                if (bool) player.removeEquipTrigger(card2);
                $thunderThrow(card2);
                if (player == game.me) {
                  for (var i of player.getCards('h')) {
                    if (i == card2) {
                      ui.handcards1.removeChild(i);
                      ui.updatehl();
                    }
                  }
                }
                function $thunderThrow(card, nosource) {
                  var player = _status.event.player;
                  var duiMod = (game.me == player && !nosource);
                  var cardx;
                  var clone;

                  var hand = dui.boundsCaches.hand;
                  hand.check();
                  cardx = card;
                  if (cardx) {
                    clone = cardx.copy('thrown');
                    if (duiMod && !bool) {
                      clone.tx = Math.round(hand.x + card.tx);
                      clone.ty = Math.round(hand.y + 30 + card.ty);
                      clone.scaled = true;
                      clone.throwordered = true;
                      clone.style.transform = 'translate(' + clone.tx + 'px,' + clone.ty + 'px) scale(' + hand.cardScale + ')';
                    }
                    cardx = clone;
                  } else {
                    cardx = dui.element.create('card infohidden infoflip');
                    cardx.moveTo = lib.element.card.moveTo;
                    cardx.moveDelete = lib.element.card.moveDelete;
                  }
                  card = cardx;
                  $thunderThrow2(card, nosource);
                }
                function $thunderThrow2(card, nosource) {
                  var player = _status.event.player;
                  if (card.throwordered == undefined) {
                    var x, y;
                    var bounds = dui.boundsCaches.arena;
                    if (!bounds.updated)
                      bounds.update();

                    player.checkBoundsCache();
                    if (nosource) {
                      x = ((bounds.width - bounds.cardWidth) / 2 - bounds.width * 0.08);
                      y = ((bounds.height - bounds.cardHeight) / 2);
                    } else {
                      x = ((player.cacheWidth - bounds.cardWidth) / 2 + player.cacheLeft);
                      y = ((player.cacheHeight - bounds.cardHeight) / 2 + player.cacheTop);
                    }

                    x = Math.round(x);
                    y = Math.round(y);

                    card.tx = x;
                    card.ty = y;
                    card.scaled = true;
                    card.classList.add('thrown');
                    card.style.transform = 'translate(' + x + 'px, ' + y + 'px)' + 'scale(' + bounds.cardScale + ')';
                  } else {
                    card.throwordered = undefined;
                  }

                  if (card.fixed)
                    return ui.arena.appendChild(card);

                  var before;
                  for (var i = 0; i < ui.thrown; i++) {
                    if (ui.thrown[i].parentNode == ui.arena) {
                      before = ui.thrown[i];
                      break;
                    }
                  }

                  var tagNode = card.querySelector('.used-info');
                  if (tagNode == null)
                    tagNode = card.appendChild(dui.element.create('used-info'));

                  card.$usedtag = tagNode;
                  ui.thrown.unshift(card);
                  if (before)
                    ui.arena.insertBefore(before, card);
                  else
                    ui.arena.appendChild(card);
                  dui.queueNextFrameTick(dui.layoutDiscard, dui);
                  return card;
                }
                function layoutHandDraws(cards) {
                  var bounds = dui.boundsCaches.hand;
                  bounds.check();

                  var x, y;
                  var pw = bounds.width;
                  var ph = bounds.height;
                  var cw = bounds.cardWidth;
                  var ch = bounds.cardHeight;
                  var cs = bounds.cardScale;
                  var csw = cw * cs;
                  var xStart, xMargin;

                  var draws = [];
                  var card;
                  var clone;
                  var source = cards.duiMod;
                  if (source && source != game.me) {
                    source.checkBoundsCache();
                    xMargin = 27;
                    xStart = source.cacheLeft - bounds.x - csw / 2 - (cw - csw) / 2;
                    var totalW = xMargin * cards.length + (csw - xMargin);
                    var limitW = source.cacheWidth + csw;
                    if (totalW > limitW) {
                      xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
                    } else {
                      xStart += (limitW - totalW) / 2;
                    }

                    y = Math.round((source.cacheTop - bounds.y - 30 + (source.cacheHeight - ch) / 2));
                    for (var i = 0; i < cards.length; i++) {
                      x = Math.round(xStart + i * xMargin);
                      card = cards[i];
                      card.tx = x;
                      card.ty = y;
                      card.fixed = true;
                      card.scaled = true;
                      card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
                    }
                    return;
                  } else {
                    for (var i = 0; i < cards.length; i++) {
                      card = cards[i];
                      clone = card.clone;
                      if (clone && !clone.fixed && clone.parentNode == ui.arena) {
                        x = Math.round(clone.tx - bounds.x);
                        y = Math.round(clone.ty - (bounds.y + 30));
                        card.tx = x;
                        card.ty = y;
                        card.scaled = true;
                        card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
                        clone.remove();
                      } else {
                        draws.push(card);
                      }
                    }
                  }

                  y = Math.round(-ch * cs * 2);
                  xMargin = csw * 0.5;
                  xStart = (pw - xMargin * (draws.length + 1)) / 2 - (cw - csw) / 2;
                  for (var i = 0; i < draws.length; i++) {
                    x = Math.round(xStart + i * xMargin);
                    card = draws[i];
                    card.tx = x;
                    card.ty = y;
                    card.scaled = true;
                    card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
                  }
                }
                player.thunderDirectgain = function (cards, broadcast, gaintag) {
                  var player = this;
                  var handcards = player.node.handcards1;
                  var handcards2 = player.node.handcards2;
                  var fragment = document.createDocumentFragment();
                  var fragment2 = document.createDocumentFragment();

                  var card;

                  var hs = this.getCards('hs');
                  for (var i = 0; i < cards.length; i++) {
                    card = cards[i];
                    card.fix();
                    if (hs.contains(cards[i])) {
                      cards.splice(i--, 1);
                      continue;
                    }
                    if (gaintag)
                      card.addGaintag(gaintag);
                    var sort = lib.config.sort_card(cards[i]);

                    if (get.is.singleHandcard() || sort > 0) {
                      fragment.insertBefore(card, fragment.firstChild);
                    } else {
                      fragment2.insertBefore(card, fragment.firstChild);
                    }
                  }
                  if (player == game.me) {
                    layoutHandDraws(cards.reverse());
                    dui.queueNextFrameTick(dui.layoutHand, dui);
                  }
                  var s = player.getCards('s');
                  if (s.length) {
                    var found = false;
                    for (var i = 0; i < handcards.childElementCount; i++) {
                      if (handcards.childNodes[i] == s[0]) {
                        handcards.insertBefore(fragment, s[0]);
                        found = true;
                        break;
                      }
                    }
                    if (!found) {
                      handcards.appendChild(fragment);
                    }
                  } else {
                    handcards.appendChild(fragment);
                  }
                  s = player.getCards('s');
                  if (s.length) {
                    var found = false;
                    for (var i = 0; i < handcards2.childElementCount; i++) {
                      if (handcards2.childNodes[i] == s[0]) {
                        handcards2.insertBefore(fragment2, s[0]);
                        found = true;
                        break;
                      }
                    }
                    if (!found) {
                      handcards2.appendChild(fragment2);
                    }
                  } else {
                    handcards2.appendChild(fragment2);
                  }

                  if (this == game.me || _status.video) ui.updatehl();
                  if (!_status.video) {
                    game.addVideo('directgain', this, get.cardsInfo(cards));
                    this.update();
                  }

                  if (broadcast !== false)
                    game.broadcast(function (player, cards) {
                      player.directgain(cards);
                    }, this, cards);
                  return this;
                }
                function $thunderGain2(cards) {
                  var type = get.itemtype(cards);
                  if (type != 'cards') {
                    if (type != 'card')
                      return;

                    type = 'cards';
                    cards = [cards];
                  }

                  game.broadcast(function (cards) {
                    $thunderGain2(cards);
                  }, cards);

                  var gains = [];
                  var draws = [];

                  var card;
                  var clone;
                  for (var i = 0; i < cards.length; i++) {
                    clone = cards[i].clone;
                    card = cards[i].copy('thrown', 'gainingcard');
                    card.fixed = true;
                    if (clone && clone.parentNode == ui.arena) {
                      card.scaled = true;
                      card.style.transform = clone.style.transform;
                      gains.push(card);
                    } else {
                      draws.push(card);
                    }
                    clone.remove();
                  }

                  if (gains.length)
                    game.addVideo('gain2', player, get.cardsInfo(gains));

                  if (draws.length)
                    game.addVideo('drawCard', player, get.cardsInfo(draws));

                  if (cards.duiMod && player == game.me)
                    return;

                  cards = gains.concat(draws);
                  dui.layoutDrawCards(draws, player, true);

                  var fragment = document.createDocumentFragment();
                  for (var i = 0; i < cards.length; i++)
                    fragment.appendChild(cards[i]);

                  ui.arena.appendChild(fragment);
                  dui.queueNextFrameTick(function () {
                    dui.layoutDrawCards(cards, player);
                    dui.delayRemoveCards(cards, 460, 220);
                  });
                }
                dcdAnim.loadSpine(_Thunder.assets['jx_' + cards[0].name].name, "skel", function () {
                  dcdAnim.playSpine({ name: _Thunder.assets['jx_' + cards[0].name].name });
                })
                setTimeout(function () {
                  card2.init([card2.suit, card2.number, 'rewrite_' + card2.name]);
                  if (bool) {
                    $thunderGain2(card2);
                    game.playAudio('effect', get.subtype(card2));
                  }
                  else player.thunderDirectgain([card2]);
                  game.resume();
                }, 1200)
                game.addVideo('skill', player, ['th_jingxie', [bool, get.cardInfo(card2)]])
                if (bool) {
                  var info = get.info(card2);
                  if (info.skills) {
                    for (var i = 0; i < info.skills.length; i++) {
                      player.addSkillTrigger(info.skills[i]);
                    }
                  }
                }
              },
              ai: {
                basic: {
                  order: 10,
                },
                result: {
                  player: 1,
                },
              },
              subSkill: {
                recover: {
                  audio: 'th_jingxie',
                  trigger: { player: 'dying' },
                  filter: function (event, player) {
                    return player.countCards('he', function (card) {
                      return get.subtype(card) == 'equip2';
                    }) > 0;
                  },
                  direct: true,
                  content: function () {
                    'step 0'
                    player.chooseCard('你可以重铸一个防具，然后将你体力回复至1点', 'he', function (card, player, target) {
                      return get.subtype(card) == 'equip2';
                    }).ai = () => 1;
                    'step 1'
                    if (result.bool) {
                      player.loseToDiscardpile(result.cards);
                      player.draw();
                    } else event.finish();
                    'step 2'
                    var num = 1 - player.hp;
                    if (num) player.recover(num);
                  },
                }
              }
            },

            //周群
            th_tiansuan: {
              audio: "ext:Thunder/audio/skill:2",
              enable: "phaseUse",
              filter: function (event, player) {
                if (!window.tiansuanxiao) {
                  window.tiansuanxiao = true;
                  dcdAnim.loadSpine(window._Thunder.assets.qiuqian.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.qiuqianyan.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.zhongqian.name, "skel");
                  dcdAnim.loadSpine(window._Thunder.assets.hengfu.name, "skel");
                }
                return !player.storage.th_tiansuan2;
              },
              // init: function () {
              //     game.thunderLoadFont({ url: lib.assetURL + 'font/shousha.ttf', cssValue: 'shousha' });
              //     game.thunderLoadFont({ url: lib.assetURL + 'extension/Thunder/assets/th-zhongli.woff2', cssValue: 'th-zhongli' });
              // },
              content: function () {
                'step 0'
                game.thunderForbidTouch();
                game.pause();
                _status.imchoosing = true;
                event.ditu = new Image();
                event.ditu.src = lib.assetURL + 'extension/Thunder/image/tiansuan/ditu.png';
                event.bgcanvas = document.createElement('canvas');
                event.bgcanvas.classList.add('th-tiansuantipbg');
                event.bgcanvas.style.zIndex = 8;
                document.body.appendChild(event.bgcanvas);
                event.canvas = document.createElement('canvas');
                event.canvas.classList.add('th-tiansuantipbg');
                document.body.appendChild(event.canvas);
                event.bgcanvas.width = event.bgcanvas.clientWidth;
                event.bgcanvas.height = event.bgcanvas.clientHeight;
                event.canvas.width = event.canvas.clientWidth;
                event.canvas.height = event.canvas.clientHeight;
                event.ctx = event.canvas.getContext('2d');
                event.bgctx = event.bgcanvas.getContext('2d');
                game.countChoose();
                event.ditu.onload = function () {
                  if (event.isMine()) {
                    event.dibeijing = ui.create.div('.th-dibeijing', document.body);
                    var dialog = game.thunderDialog(event.dibeijing, { height: 330, title: '天算' });
                    var qianBg = ui.create.div('.th-qianbg', dialog.container);
                    var selIndex = null;
                    event._result = {
                      bool: false,
                      index: null,
                    }
                    ui.create.div('.th-qiuqiantip', dialog.container, '你可以复制一个签，增加其被抽中的机会');
                    for (let i = 0; i < 5; i++) {
                      var qian = ui.create.div('.th-tiansuanqian', qianBg);
                      qian.style.backgroundImage = 'url(' + lib.assetURL + 'extension/Thunder/image/tiansuan/mingyunqian_' + i + '.png)';
                      qian.id = 'th-tiansuanqian' + i;
                      qian.style.left = (110 + i * 80) + 'px';
                      qian.listen(function () {
                        if (this.classList.contains('sel')) return;
                        for (var j = 0; j < 5; j++) {
                          var temp = document.getElementById('th-tiansuanqian' + j);
                          if (temp) temp.classList.remove('sel')
                        }
                        this.classList.add('sel');
                        selIndex = parseInt(this.id.charAt(this.id.length - 1));
                      })
                    }
                    event.control = ui.create.control('ok', 'cancel2', function (link) {
                      if (game.thunderHasExt('十周年')) {
                        var con = document.getElementById('dui-controls');
                        con.classList.remove('th-confirmdown');
                      }
                      if (link == 'ok') {
                        event._result = {
                          bool: true,
                          index: selIndex != null ? selIndex : null,
                        }
                      }
                      game.resume();
                    });
                    if (game.thunderHasExt('十周年')) {
                      var con = document.getElementById('dui-controls');
                      con.classList.add('th-confirmdown');
                    }
                  } else {
                    event._result = {
                      bool: true,
                      index: [0, 4].randomGet(),
                    }
                    game.resume();
                  }
                }
                'step 1'
                game.pause();
                function writeTip(str, x, y) {
                  event.ctx.clearRect(x - 100, y - 100, 500, 300);
                  event.ctx.font = '900 15px "shousha"';
                  event.ctx.fillStyle = '#6e5e40';
                  if (str.length > 20) {
                    var str1 = str.substring(0, 20);
                    var str2 = str.substring(20);
                    event.ctx.fillText(str1, x, y);
                    event.ctx.fillText(str2, x, y + 18);
                  }
                  else event.ctx.fillText(str, x + ((20 - str.length) * 7.5), y + 8);
                }
                function nextStep() {
                  event.bgcanvas.remove();
                  if (event.isMine()) {
                    dcdAnim.stopSpine(event.zhongqian);
                    dcdAnim.stopSpine(event.qiuqianEnd);
                    dcdAnim.stopSpine(event.qiuqianyan);
                    event.hengfu.moveTo(null, document.body.offsetHeight * 0.5, 500);
                    event.hengfu.onupdate = function () {
                      this.speed = 0;
                      writeTip(lib.skill['th_tiansuan2_' + num].intro.content, event.canvas.width * 0.5 - 150, document.body.offsetHeight - this.timestepMap.y.current);
                      if (this.timestepMap.y.completed && !this.nextstep) {
                        this.nextstep = true;
                        game.resume();
                      }
                    }
                  } else game.resume();
                }
                var list = [0, 1, 1, 2, 2, 2, 3, 3, 4];
                if (result.index) list.push(result.index);
                var num = list.randomGet();
                event.num = num;
                game.log(player, '抽取出了', '#g' + lib.skill['th_tiansuan2_' + num].name);
                if (event.dibeijing) event.dibeijing.remove();
                if (event.control) event.control.remove();
                var qianImg = new Image();
                qianImg.src = lib.assetURL + 'extension/Thunder/image/tiansuan/jgqian' + num + '.png';
                event.bgctx.drawImage(event.ditu, event.bgcanvas.width * 0.5 - 400, event.bgcanvas.height * 0.5 - 213.3, 800, 426.6);
                game.playAudio('../extension/Thunder/audio/tiansuan/yaoqian.mp3');
                var qiuqian = dcdAnim.playSpine(window._Thunder.assets.qiuqian, { scale: 0.7 });
                event.qiuqianyan = dcdAnim.loopSpine(window._Thunder.assets.qiuqianyan, { scale: 0.65, x: event.bgcanvas.width * 0.5 - 177, y: event.bgcanvas.height * 0.5 - 35 });
                qiuqian.oncomplete = function () {
                  game.playAudio('../extension/Thunder/audio/tiansuan/zhongqian.mp3');
                  event.qiuqianEnd = dcdAnim.playSpine({ name: window._Thunder.assets.qiuqian.name, action: 'play2' }, { scale: 0.7, y: event.bgcanvas.height * 0.5 + 5 });
                  event.qiuqianEnd.onupdate = function () {
                    var entry1 = this.skeleton.state.tracks[0];
                    if (!this._animEnd && entry1.trackTime >= 0.98 * entry1.animationEnd) {
                      this.speed = 0;
                      this._animEnd = true;
                    }
                  }
                  event.zhongqian = dcdAnim.loopSpine(window._Thunder.assets.zhongqian, { scale: 0.7, parent: document.body });
                  var skeletons = event.zhongqian.skeleton;
                  var slots = skeletons.findSlot('jgqian3');
                  var attachments = slots.getAttachment();
                  var regions = decadeUI.animation.createTextureRegion(qianImg);
                  var scaleQ = 1.17;
                  attachments.width = regions.width * scaleQ / 1.15;
                  attachments.height = regions.height * scaleQ / 1.15;
                  attachments.setRegion(regions);
                  attachments.updateOffset();
                  event.zhongqian.onupdate = function () {
                    var entry2 = this.skeleton.state.tracks[0];
                    if (!this._animEnd && entry2.trackTime >= 0.7 * entry2.animationEnd) {
                      this._animEnd = true;
                      this.setAction('play2');
                      event.hengfu = dcdAnim.playSpine({ name: window._Thunder.assets.hengfu.name, speed: 0.7 }, { y: document.body.offsetHeight * 0.5 - 120, scale: 0.7 });
                      event.hengfu.onupdate = function () {
                        var entry3 = this.skeleton.state.tracks[0];
                        if (!this._tipLoad && entry3.trackTime >= 0.9 * entry3.animationEnd) {
                          this._tipLoad = true;
                          this.speed = 0;
                          writeTip(lib.skill['th_tiansuan2_' + num].intro.content, event.canvas.width * 0.5 - 150, document.body.offsetHeight * 0.5 + 120);
                          setTimeout(nextStep, 100);
                        }
                      }
                    }
                  }
                }
                'step 2'
                game.thunderAllowTouch();
                player.chooseTarget(true, '令一名角色获得“' + lib.skill['th_tiansuan2_' + num].name + '”').set('ai', lib.skill['th_tiansuan2_' + num].aiCheck);
                'step 3'
                dcdAnim.stopSpine(event.zhongqian);
                dcdAnim.stopSpine(event.qiuqianEnd);
                dcdAnim.stopSpine(event.qiuqianyan);
                dcdAnim.stopSpine(event.hengfu);
                event.canvas.remove();
                if (result.bool) {
                  var target = result.targets[0];
                  player.line(target, 'green');
                  game.log(player, '令', target, '获得了命运签');
                  player.storage.th_tiansuan2 = target;
                  player.storage.th_tiansuan3 = 'th_tiansuan2_' + num;
                  player.addTempSkill('th_tiansuan2', { player: 'phaseBegin' });
                  target.addSkill('th_tiansuan2_' + num);
                  if (num < 2 && target.countGainableCards(player, target == player ? 'e' : 'he') > 0) {
                    var next = player.gainPlayerCard(target, target == player ? 'e' : 'he', true);
                    if (num == 0) next.visible = true;
                  }
                  else game.delayx();
                }
              },
              ai: {
                order: 7,
                result: {
                  player: 1,
                },
              },
            },
            th_tiansuan2: {
              charlotte: true,
              onremove: function (player, skill) {
                if (player.storage.th_tiansuan2) player.storage.th_tiansuan2.removeSkill(player.storage.th_tiansuan3);
                delete player.storage.th_tiansuan2;
                delete player.storage.th_tiansuan3;
              },
            },
            th_tiansuan2_0: {
              name: '上上签',
              trigger: { player: 'damageBegin4' },
              forced: true,
              charlotte: true,
              content: function () {
                trigger.cancel();
              },
              mark: true,
              intro: {
                content: '当你受到伤害时，防止此伤害。',
              },
              aiCheck: function (target) {
                if (target.hasSkill('th_tiansuan2_0')) return 0;
                var player = _status.event.player;
                var att = get.attitude(player, target);
                if (target.countCards('e', function (card) {
                  return get.value(card, target) <= 0;
                })) att *= 2;
                return att / Math.sqrt(Math.max(1, target.hp));
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'damage') && !player.hasSkillTag('jueqing', false, target)) return 'zerotarget';
                  }
                },
              },
            },
            th_tiansuan2_1: {
              name: '上签',
              trigger: { player: 'damageBegin4' },
              forced: true,
              charlotte: true,
              filter: function (event, player) {
                return event.num > 1;
              },
              content: function () {
                trigger.num = 1;
              },
              group: 'th_tiansuan2_damage',
              mark: true,
              intro: {
                content: '当你受到伤害时，你令伤害值改为1；当你受到1点伤害后，你摸一张牌。',
              },
              aiCheck: function (target) {
                if (target.hasSkill('th_tiansuan2_1')) return 0;
                var player = _status.event.player;
                var att = get.attitude(player, target);
                if (target.countCards('e', function (card) {
                  return get.value(card, target) <= 0;
                })) att *= 2;
                if (target.hp == 1) return att / 2;
                return att / Math.sqrt(Math.max(1, target.hp));
              },
              ai: {
                filterDamage: true,
                skillTagFilter: function (player, tag, arg) {
                  if (arg && arg.player) {
                    if (arg.player.hasSkillTag('jueqing', false, player)) return false;
                  }
                },
                effect: {
                  target: function (card, player, target, current) {
                    if (target && target.hp > 1 && get.tag(card, 'damage') && !player.hasSkillTag('jueqing', false, target)) return 0.8;
                  }
                },
              },
            },
            th_tiansuan2_damage: {
              trigger: { player: 'damageEnd' },
              charlotte: true,
              content: function () {
                player.draw(trigger.num);
              },
            },
            th_tiansuan2_2: {
              name: '中签',
              trigger: { player: 'damageBegin4' },
              forced: true,
              charlotte: true,
              filter: function (event, player) {
                return event.num > 1;
              },
              content: function () {
                trigger.num = 1;
              },
              mark: true,
              intro: {
                content: '当你受到伤害时，你令伤害属性改为火属性并将伤害值改为1。',
              },
              aiCheck: function (target) {
                if (target.hasSkill('th_tiansuan2_2')) return 0;
                var player = _status.event.player;
                target.addSkill('th_tiansuan2_ai');
                var num = get.damageEffect(target, player, player, 'fire');
                target.removeSkill('th_tiansuan2_ai');
                return num;
              },
              group: ['th_tiansuan2_fire', 'th_tiansuan2_ai'],
            },
            th_tiansuan2_ai: {
              ai: {
                filterDamage: true,
                skillTagFilter: function (player, tag, arg) {
                  if (arg && arg.player) {
                    if (arg.player.hasSkillTag('jueqing', false, player)) return false;
                  }
                },
              },
            },
            th_tiansuan2_fire: {
              trigger: { player: 'damageBefore' },
              forced: true,
              charlotte: true,
              filter: function (event, player) {
                return event.nature != 'fire';
              },
              content: function () {
                trigger.nature = 'fire';
              },
            },
            th_tiansuan2_3: {
              name: '下签',
              trigger: { player: 'damageBegin3' },
              forced: true,
              charlotte: true,
              content: function () {
                trigger.num++;
              },
              mark: true,
              intro: {
                content: '当你受到伤害时，你令此伤害+1。',
              },
              aiCheck: function (target) {
                if (target.hasSkill('th_tiansuan2_3')) return 0;
                var player = _status.event.player;
                var att = get.attitude(player, target);
                return -att / Math.sqrt(Math.max(1, target.hp));
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'damage') && !player.hasSkillTag('jueqing', false, target) && current < 0) return 1.3;
                  }
                },
              },
            },
            th_tiansuan2_4: {
              name: '下下签',
              trigger: { player: 'damageBegin3' },
              forced: true,
              charlotte: true,
              content: function () {
                trigger.num++;
              },
              mod: {
                cardEnabled: function (card, player) {
                  if (card.name == 'tao' || card.name == 'jiu') return false;
                },
                cardSavable: function (card, player) {
                  if (card.name == 'tao' || card.name == 'jiu') return false;
                },
              },
              mark: true,
              intro: {
                content: '当你受到伤害时，你令此伤害+1。你不能使用【酒】或【桃】。',
              },
              aiCheck: function (target) {
                if (target.hasSkill('th_tiansuan2_4')) return 0;
                var player = _status.event.player;
                var att = get.attitude(player, target);
                return -att / Math.sqrt(Math.max(1, target.hp));
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'damage') && !player.hasSkillTag('jueqing', false, target) && current < 0) return 1.3;
                  }
                },
              },
            },

            //王朗
            th_gushe: {
              audio: "ext:Thunder/audio/skill:2",
              enable: 'phaseUse',
              filterTarget: function (card, player, target) {
                return player.canCompare(target);
              },
              selectTarget: [1, 3],
              filter: function (event, player) {
                return (player.countMark('th_gushe') + player.countMark('th_gushe2') < 7) && player.countCards('h') > 0;
              },
              multitarget: true,
              multiline: true,
              content: function () {
                player.addTempSkill('th_gushe2');
                player.chooseToCompare(targets).callback = lib.skill.th_gushe.callback;
              },
              intro: {
                name: '饶舌',
                content: 'mark'
              },
              callback: function () {
                'step 0'
                if (event.num1 <= event.num2) {
                  game.delay();
                  player.addMark('th_gushe', 1);
                  if (player.countMark('th_gushe') >= 7) {
                    game.pause();
                    var frame = 0, handle = -1;
                    var bg = ui.create.div('.th-dibeijing', document.body);
                    bg.style.pointerEvents = 'none';
                    var weizhi1 = target.getBoundingClientRect(), weizhi2 = player.getBoundingClientRect();
                    var dead = game.thunderRAF(function () {
                      handle++;
                      if (handle % 2 != 0) return;
                      //let x1 = weizhi1.left + 20 + Math.round(Math.random() * (weizhi1.width - 40)), y1 = weizhi1.top + Math.round(Math.random() * (weizhi1.height - 40));
                      let x1 = weizhi1.left + Math.round(weizhi1.width * 0.5), y1 = weizhi1.top + Math.round(weizhi1.height * 0.5);
                      let x2 = weizhi2.left + 20 + Math.round(Math.random() * (weizhi2.width - 60)), y2 = weizhi2.top + Math.round(Math.random() * (weizhi2.height - 60));
                      let moveX = x2 - x1, moveY = y2 - y1;
                      let zi = ui.create.div('.th-jicizi', bg);
                      zi.id = 'th_jici' + frame;
                      zi.style.cssText += 'left:' + x1 + 'px;top:' + y1 + 'px;background-image:url("' + lib.assetURL + 'extension/Thunder/image/jici/' + frame + '.png")';
                      document.styleSheets[0].insertRule(`@keyframes th_jici${frame}-1{
                                        0%{}
                                        100%{
                                            transform:translate(${moveX}px,${moveY}px);
                                        }
                                    }`)
                      document.styleSheets[0].insertRule(`@keyframes th_jici${frame}-2{
                                        0%{
                                            transform:translate(${moveX}px,${moveY}px);
                                            opacity: 1;
                                        }
                                        100%{
                                            transform:translate(${moveX}px,${moveY}px) scale(1.5);
                                            opacity: 0.2;
                                        }
                                    }`)

                      zi.style.animation = zi.id + '-1 0.3s linear forwards';
                      // zi.on("timeupdate", function(event){
                      //     var currentTime = parseInt(this.currentTime()); //当前时间
                      //     var duration = this.duration(); //视频时常
                      //     if(currentTime/duration==0.6){
                      //         if (this.id == 'thjici0') dcdAnim.playSpine({ name: window._Thunder.assets.wanglangdead.name, action: 'play1', speed: 2 }, { parent: player, scale: 0.4 });
                      //         dcdAnim.playSpine({ name: window._Thunder.assets.wanglangdead.name, action: 'play2' }, { x: x2, y: document.body.offsetHeight - y2, scale: 0.6 });
                      //     }
                      //     else if(currentTime/duration==1){
                      //         this.remove();
                      //         if (this.id == 'thjici13') {
                      //             bg.remove();
                      //             game.resume();
                      //             player.die();
                      //         }
                      //     }
                      // })
                      zi.addEventListener('animationend', function () {
                        if (!this.animationStep) this.animationStep = 0;
                        if (this.animationStep == 0) {

                          dcdAnim.loadSpine(window._Thunder.assets.wanglangdead.name, "skel", function () {
                            dcdAnim.playSpine({ name: window._Thunder.assets.wanglangdead.name, action: 'play2' }, { x: x2 + 10 / game.documentZoom, y: document.body.offsetHeight - y2 - 40 / game.documentZoom, scale: 0.6 });
                          })
                          if (this.id == 'th_jici0') {
                            game.playAudio('..', 'extension', 'Thunder', 'audio', 'jici', 'effect_curse_to_die');
                            dcdAnim.loadSpine(window._Thunder.assets.wanglangdead.name, "skel", function () {
                              dcdAnim.playSpine({ name: window._Thunder.assets.wanglangdead.name, action: 'play1', speed: 2 }, { parent: player, scale: 0.4 });
                            })
                          }
                          this.style.animation = this.id + '-2 0.5s linear forwards';
                          this.animationStep++;
                        } else {
                          if (this.id == 'th_jici13') {
                            bg.remove();
                            player.die();
                            game.resume();
                          }
                          this.remove();
                        }
                        // if (this.id == 'thjici0') dcdAnim.playSpine({ name: window._Thunder.assets.wanglangdead.name, action: 'play1', speed: 2 }, { parent: player, scale: 0.4 });
                        // dcdAnim.playSpine({ name: window._Thunder.assets.wanglangdead.name, action: 'play2' }, { x: x2, y: document.body.offsetHeight - y2, scale: 0.6 });
                        // this.remove();
                        // if (this.id == 'thjici13') {
                        //     bg.remove();
                        //     game.resume();
                        //     player.die();
                        // }
                      })
                      frame++;
                      if (frame == 14) dead.stop = true;
                    })
                  }
                }
                else player.addMark('th_gushe2', 1, false);
                'step 1'
                if (event.num1 >= event.num2) {
                  target.chooseToDiscard('he', '弃置一张牌，或令' + get.translation(player) + '摸一张牌').set('ai', function (card) {
                    if (_status.event.goon) return 6 - get.value(card);
                    return 0;
                  }).set('goon', get.attitude(target, player) < 0);
                }
                else event.goto(3);
                'step 2'
                if (!result.bool) {
                  player.draw();
                }
                'step 3'
                if (event.num1 <= event.num2) {
                  player.chooseToDiscard('he', '弃置一张牌，或摸一张牌').set('ai', function () { return -1; });
                }
                else event.finish();
                'step 4'
                if (!result.bool) player.draw();
              },
              ai: {
                order: 7,
                result: {
                  target: function (player, target) {
                    var num = ui.selected.targets.length + 1;
                    if (num + player.countMark('th_gushe') <= 6) return -1;
                    var hs = player.getCards('h');
                    for (var i = 0; i < hs.length; i++) {
                      if (get.value(hs[i]) <= 6) {
                        switch (hs[i].number) {
                          case 13: return -1;
                          case 12: if (player.countMark('th_gushe') + num <= 8) return -1; break;
                          case 11: if (player.countMark('th_gushe') + num <= 7) return -1; break;
                          default: if (hs[i].number > 5 && player.countMark('th_gushe') + num <= 6) return -1;
                        }
                      }
                    }
                    return 0;
                  },
                }
              },
              marktext: '饶',
            },
            th_gushe2: {
              charlotte: true,
              onremove: true,
            },

            //刘徽
            th_geyuan: {
              audio: "ext:Thunder/audio/skill:2",
              trigger: {
                global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter', 'equipAfter'],
              },
              forced: true,
              filter: function (event, player) {
                var cards = event.getd();
                for (var i of cards) {
                  if (lib.skill.th_geyuan.filterNumber(player, get.number(i, false))) return true;
                }
                return false;
              },
              content: function () {
                'step 0'
                event.cards = trigger.getd();
                'step 1'
                var card = false;
                for (var i of cards) {
                  if (lib.skill.th_geyuan.filterNumber(player, get.number(i, false))) {
                    card = i;
                    cards.remove(card);
                    break;
                  }
                }
                if (card) {
                  var number = get.number(card, false);
                  game.log(player, '将', '#y' + get.strNumber(number), '记录为', '#g“圆环之弧”');
                  player.markAuto('th_geyuan_homura', [number]);
                  player.markSkill('th_geyuan');
                  if (player.getStorage('th_geyuan').length > player.getStorage('th_geyuan_homura').length) {
                    if (cards.length > 0) event.redo();
                    else event.finish()
                  }
                  else if (player.storage.th_gusuan) event.goto(5);
                }
                else event.finish();
                'step 2'
                var list = player.getStorage('th_geyuan_homura');
                var num1 = list[0], num2 = list[list.length - 1];
                event.cards2 = [];
                var lose_list = [], players = game.filterPlayer();
                for (var current of players) {
                  var cards = current.getCards('ej', function (card) {
                    var num = get.number(card);
                    return num == num1 || num == num2;
                  });
                  if (cards.length > 0) {
                    current.$throw(cards);
                    lose_list.push([current, cards]);
                    event.cards2.addArray(cards);
                  }
                }
                if (lose_list.length) {
                  event.lose_list = lose_list;
                  game.loseAsync({
                    lose_list: lose_list,
                  }).setContent('chooseToCompareLose');
                }
                'step 3'
                var list = player.getStorage('th_geyuan_homura');
                var num1 = list[0], num2 = list[list.length - 1];
                var cards = event.cards2;
                for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                  var card = ui.cardPile.childNodes[i];
                  var number = get.number(card, false);
                  if (number == num1 || number == num2) cards.push(card);
                }
                if (cards.length > 0) {
                  if (event.lose_list) game.delayx();
                  player.gain(cards, 'gain2');
                }
                'step 4'
                var list = player.getStorage('th_geyuan_homura');
                var num1 = list[0], num2 = list[list.length - 1];
                player.storage.th_geyuan_homura = [];
                game.log(player, '清空了', '#g“圆环之弧”');
                if (player.getStorage('th_geyuan').length > 3) {
                  player.unmarkAuto('th_geyuan', [num1, num2]);
                  game.log(player, '从', '#g“圆环之理”', '中移除了', '#y' + get.strNumber(num1), '和', '#y' + get.strNumber(num2));
                }
                player.markSkill('th_geyuan');
                event.finish();
                'step 5'
                player.chooseTarget('割圆：选择至多三名角色', '第一名角色摸三张牌，第二名角色弃置四张牌，第三名角色将所有手牌与牌堆底的牌交换', true, [1, 3]);
                'step 6'
                if (result.bool) {
                  var targets = result.targets;
                  event.targets = targets;
                  player.line(targets);
                  targets[0].draw(3);
                  if (targets.length < 2) event.goto(4);
                }
                else event.goto(4);
                'step 7'
                if (targets[1].countCards('he') > 0) targets[1].chooseToDiscard('he', true, 4);
                if (targets.length < 3) event.goto(4);
                'step 8'
                var target = targets[2];
                var cards = get.bottomCards(5);
                game.cardsGotoOrdering(cards);
                var hs = target.getCards('h');
                if (hs.length > 0) target.lose(hs, ui.cardPile);
                target.gain(cards, 'draw');
                event.goto(4);
              },
              group: 'th_geyuan_qyubee',
              filterNumber: function (player, num) {
                var list1 = player.getStorage('th_geyuan');
                var list2 = player.getStorage('th_geyuan_homura');
                if (!list1.contains(num)) return false;
                if (!list2.length) return true;
                if (list2.contains(num)) return false;
                var madoka = list1.indexOf(num);
                for (var i of list2) {
                  var homura = list1.indexOf(i);
                  var dist = Math.abs(madoka - homura);
                  if (dist == 1 || dist == list1.length - 1) return true;
                }
                return false;
              },
              subSkill: {
                qyubee: {
                  audio: 'th_geyuan',
                  trigger: {
                    global: 'phaseBefore',
                    player: 'enterGame',
                  },
                  forced: true,
                  filter: function (event, player) {
                    return (event.name != 'phase' || game.phaseNumber == 0) && !player.storage.th_gusuan;
                  },
                  content: function () {
                    var list = [];
                    for (var i = 1; i <= 13; i++) {
                      list.push(i);
                    }
                    list.randomSort();
                    player.storage.th_geyuan = list;
                    player.markSkill('th_geyuan');
                    var str = '#y';
                    for (var i = 0; i < 13; i++) {
                      str += get.strNumber(list[i]);
                      if (i != 12) str += ',';
                    }
                    game.log(player, '将', '#y“圆环之理”', '赋值为', str);
                  },
                },
              },
              intro: {
                name: '圆环之理',
                markcount: function (storage, player) {
                  var list1 = player.getStorage('th_geyuan');
                  var list2 = player.getStorage('th_geyuan_homura');
                  if (!list2.length) return;
                  function isLianxu(a) {
                    var isLianxu = true;
                    if (a.length == 1) return true;
                    for (var i = 1; i < a.length; i++) {
                      if (a[i] - a[i - 1] != 1) isLianxu = false;
                    }
                    return isLianxu;
                  }
                  var list = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
                  var hasIndex = [], noIndex = [];
                  var result1, result2;
                  for (var i = 0; i < list1.length; i++) {
                    if (list2.contains(list1[i])) hasIndex.push(i);
                    else noIndex.push(i);
                  }
                  if (isLianxu(noIndex)) {
                    result1 = list1[noIndex[0]];
                    result2 = list1[noIndex[noIndex.length - 1]];
                  } else {
                    result1 = list1[hasIndex[0] - 1];
                    result2 = list1[hasIndex[hasIndex.length - 1] + 1];
                  }
                  if (result1 == result2) result1 = 0;
                  return list[result1] + list[result2];
                },
                mark: function (dialog, storage, player) {
                  var list = storage;
                  if (!storage || !storage.length) return '（圆环之理尚不存在）';
                  var list2 = player.getStorage('th_geyuan_homura');
                  var centerX = 168, centerY = 142, radius = 130;
                  var radian = Math.PI * 2 / list.length;
                  var fulllist = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
                  var bg = ui.create.div('.th-dibeijing', document.body);
                  bg.style.cssText += 'font-family:"th-zhongli";font-size:15px;z-index:15;';
                  bg.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
                    this.remove();
                  });
                  var geyuan = game.thunderDialog(bg, { height: 366, width: 640, title: '割圆' });
                  var geyuanbg = ui.create.div('.th-geyuanbg', geyuan.container);
                  for (var i = 0; i < list.length; i++) {
                    var td = ui.create.div('.th-geyuanitem', geyuanbg);
                    var num = ui.create.div('', td);
                    num.style.cssText = 'position:absolute;width:60px;height:60px;background-size:100% 100%;background-image:url("' + lib.assetURL + 'extension/Thunder/image/geyuan/' + fulllist[list[i] - 1] + '.png");'
                    if (list2.contains(list[i])) td.classList.add('sel');
                    td.style.left = (centerX + radius * Math.sin(radian * i)) + 'px';
                    td.style.top = (centerY - radius * Math.cos(radian * i)) + 'px';
                  }
                },
              },
            },
            th_jieshu: {
              audio: "ext:Thunder/audio/skill:2",
              trigger: { player: ['useCard', 'respond'] },
              forced: true,
              filter: function (event, player) {
                var num = get.number(event.card, false);
                if (typeof num != 'number') return false;
                return lib.skill.th_geyuan.filterNumber(player, num)
              },
              content: function () {
                player.draw();
              },
              mod: {
                ignoredHandcard: function (card, player) {
                  if (!player.getStorage('th_geyuan').contains(get.number(card))) return true;
                },
                cardDiscardable: function (card, player, name) {
                  if (name == 'phaseDiscard' && !player.getStorage('th_geyuan').contains(get.number(card))) return false;
                },
              },
            },
            th_gusuan: {
              audio: "ext:Thunder/audio/skill:2",
              trigger: { global: 'phaseEnd' },
              forced: true,
              juexingji: true,
              skillAnimation: true,
              animationColor: 'soil',
              filter: function (event, player) {
                return player.getStorage('th_geyuan').length == 3;
              },
              content: function () {
                player.awakenSkill('th_gusuan');
                player.storage.th_gusuan = true;
                player.loseMaxHp();
              },
              ai: { combo: 'th_geyuan' },
              derivation: 'th_geyuan_magica',
            },

            //神周瑜
            th_yeyan: {
              forceDie: true,
              enable: 'phaseUse',
              audio: "ext:Thunder/audio/skill:3",
              limited: true,
              skillAnimation: true,
              animationColor: 'fire',
              direct: true,
              choose4Cards: function (event, player) {
                let cards = player.getCards('h');
                let selectCards = [];
                let suits = [];
                let hasSelected = [];
                for (let i of cards) {
                  let suit = get.suit(i, player);
                  if (suit && !suits.contains(suit)) {
                    selectCards.push(i);
                    suits.push(suit)
                  }
                  if (i.classList.contains('selected')) hasSelected.push(i);
                }

                if (hasSelected.length == 4) return hasSelected;
                if (suits.length == 4) return selectCards;
                return false;
              },
              content: function () {
                'step 0'
                if (event.isMine()) {
                  window.qhly_forbidPlayerWindow = true;
                  event.targets = [];
                  game.thunderForbidTouch();
                  function knock(node1, node2) {
                    var obj1 = node1.getBoundingClientRect(), obj2 = node2.getBoundingClientRect();
                    if (obj2.left > obj1.right || obj2.right < obj1.left || obj2.top > obj1.bottom || obj2.bottom < obj1.top + 60) return false;
                    return true;
                  }
                  var yeyanDialogHeight = 240 * (game.thunderIsPhone() ? 0.66 : 0.88) + 40;
                  var yeyanpartWidth = game.thunderIsPhone() ? 600 : 780;
                  event.dibeijing = ui.create.div('.th-dibeijing', document.body);
                  event.dibeijing.style.pointerEvents = 'none';
                  var yeyan = game.thunderDialog(event.dibeijing, { height: yeyanDialogHeight, width: yeyanpartWidth, title: '业炎', fullWidth: false });
                  yeyan.container.style.cssText += 'justify-content:space-around;pointer-events:visible;';
                  yeyan.onResize.push(function () { event.dibeijing.style.pointerEvents = 'none' })
                  var fires = [], flames = [];
                  for (var i = 0; i < 3; i++) {                                       //绘制对话框
                    fires[i] = ui.create.div('.th-yeyanfire', yeyan.container);
                    fires[i].id = 'th-yeyanfires' + i;
                    fires[i].style.setProperty('--w', document.body.offsetWidth * 0.08 + 'px');
                    flames[i] = ui.create.div('.th-yeyanflame', fires[i]);
                    flames[i].id = 'th-yeyanflames' + i;
                    flames[i].style.setProperty('--w', document.body.offsetWidth * 0.08 + 'px');
                    flames[i].restore = function () {
                      let num = +this.id.substr(-1);
                      let fire = document.querySelector(`#th-yeyanfires${num}`)
                      this.style.setProperty('--str', "'×1 '");
                      this.style.setProperty('--c', 'red');
                      this.style.setProperty('--ani', 'th-yeyanflame 0.2s infinite');
                      this.style.transform = 'none';
                      this.classList.remove('extinguish');
                      fire.style.setProperty('--str', "'拖动分配'");
                      fire.style.setProperty('--c', "#9c603e");
                    }
                    flames[i].addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function (e) {
                      if (this.classList.contains('extinguish')) return;
                      let num = +this.id.substr(-1);
                      event._yeyanBeginMove = num;
                      document.querySelector('#th-yeyanfires' + num).style.setProperty('--str', ' ');
                      event._yeyanX = lib.config.touchscreen ? (e.touches[0].clientX / game.documentZoom) : (e.clientX / game.documentZoom);
                      event._yeyanY = lib.config.touchscreen ? (e.touches[0].clientY / game.documentZoom) : (e.clientY / game.documentZoom);
                    });
                  }
                  event.yeyanmove = function (e) {
                    if (typeof event._yeyanBeginMove != 'number') return;
                    let flame = document.querySelector(`#th-yeyanflames${event._yeyanBeginMove}`);
                    let x = lib.config.touchscreen ? (e.touches[0].clientX / game.documentZoom) : (e.clientX / game.documentZoom);
                    let y = lib.config.touchscreen ? (e.touches[0].clientY / game.documentZoom) : (e.clientY / game.documentZoom);
                    flame.style.transform = `translate(${x - event._yeyanX}px,${y - event._yeyanY}px)`;
                  }
                  event.yeyanend = function (e) {
                    delete event._yeyanTarget;
                    if (typeof event._yeyanBeginMove != 'number') return;
                    let flame = document.querySelector(`#th-yeyanflames${event._yeyanBeginMove}`);
                    let fire = document.querySelector('#th-yeyanfires' + event._yeyanBeginMove);
                    for (let k of game.players) {
                      if (k == player) continue;
                      if (knock(flame, k)) {
                        if (k._thyeyanfires && k._thyeyanfires.length) {
                          if (lib.skill.th_yeyan.choose4Cards(event, player).length) event._yeyanTarget = k;
                        }
                        else event._yeyanTarget = k;
                      }
                    }
                    if (event._yeyanTarget) {
                      event.targets.add(event._yeyanTarget);
                      event.recheckCards = true;
                      if (!event._yeyanTarget._thyeyanfires || !event._yeyanTarget._thyeyanfires.length) {
                        event._yeyanTarget._thyeyanfires = [event._yeyanBeginMove];
                        ui.create.div('.th-yeyanflame.wanjia', event._yeyanTarget);
                        game.check();
                      } else {
                        event._yeyanTarget._thyeyanfires.add(event._yeyanBeginMove);
                        let fire = event._yeyanTarget.querySelector('.th-yeyanflame');
                        if (fire) fire.style.setProperty('--str', `"${event._yeyanTarget._thyeyanfires.length}"`);
                        event.needCards = true;
                        game.check();
                      }
                      fire.style.setProperty('--str', `"${get.translation(event._yeyanTarget)}×1"`);
                      fire.style.setProperty('--c', 'gray');
                      flame.style.setProperty('--str', ' ');
                      flame.style.setProperty('--ani', 'th-yeyanflame2 0s forwards');
                      flame.classList.add('extinguish');
                    } else {
                      fire.style.setProperty('--str', '"拖动分配"');
                    }
                    flame.style.transform = `none`;
                    delete event._yeyanBeginMove;
                    delete event._yeyanTarget;
                  }
                  event.playerListen = function (e) {
                    if (!this.player._thyeyanfires || !this.player._thyeyanfires.length) return;
                    let num = this.player._thyeyanfires.pop();
                    let flame = document.querySelector('#th-yeyanflames' + num);
                    if (flame) flame.restore();
                    let fire = this.player.querySelector('.th-yeyanflame');
                    event.recheckCards = true;
                    if (fire) {
                      if (!this.player._thyeyanfires.length) {
                        fire.remove();
                        event.targets.remove(this.player);
                      }
                      else {
                        if (this.player._thyeyanfires.length < 2) {
                          event.needCards = false;
                        }
                        fire.style.setProperty('--str', `"${this.player._thyeyanfires.length}"`)
                      }
                    }
                    if (!event.needCards) game.uncheck();
                    game.check();
                  }
                  document.addEventListener(lib.config.touchscreen ? 'touchmove' : 'mousemove', event.yeyanmove);
                  document.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', event.yeyanend);
                  for (let j of game.players) {
                    j.node.avatar.player = j;
                    j._thyeyanfires = [];
                    j.node.avatar.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', event.playerListen);
                  }
                  player.chooseCard('h', function (card) {
                    if (!event.targets.length || !event.needCards) return false;
                    if (event.recheckCards) {
                      var cards = lib.skill.th_yeyan.choose4Cards(event, player);
                      if (cards.length) {
                        ui.selected.cards = cards;
                        for (var m of cards) {
                          m.classList.add('selected');
                          m.updateTransform(true);
                        }
                      }
                      event.recheckCards = false;
                    }
                    var suit = get.suit(card);
                    for (var i = 0; i < ui.selected.cards.length; i++) {
                      if (get.suit(ui.selected.cards[i]) == suit) return false;
                    }
                    return true;
                  }).set('prompt', '').set('complexCard', true).set('selectCard', function () {
                    if (event.targets.length) {
                      for (var i of event.targets) {
                        if (i._thyeyanfires && i._thyeyanfires.length > 1) return [4, 4];
                      }
                      return [0, Infinity];
                    }
                    return [Infinity, Infinity];
                  }).ai = (card) => 1;
                  var con = document.getElementById('dui-controls');
                  con.classList.add('th-confirmdown2');
                } else {
                  var players = game.filterPlayer(function (current) {
                    return get.damageEffect(current, player)
                  });
                  if (players.length) players.sort(function (a, b) {
                    return get.attitude(player, a) - get.attitude(player, b)
                  })
                  var cards = lib.skill.th_yeyan.choose4Cards(event, player);
                  if (cards.length) {
                    if (players.length) {
                      if (game.me.identity == 'fan' && players.contains(game.zhu)) {
                        event.targets = [players.shift()];
                        event.targets[0]._thyeyanfires = [0, 1, 2];
                      } else if (players.length > 1) {
                        event.targets = [players.shift(), players.shift()];
                        event.targets[0]._thyeyanfires = [0, 1];
                        event.targets[1]._thyeyanfires = [2];
                      }
                      event.needCards = true;
                      event._result = {
                        bool: true,
                        cards: cards,
                      }
                    }
                  } else {
                    if (players.length > 1) {
                      event.targets = [players.shift(), players.shift()];
                      event.targets[0]._thyeyanfires = [0];
                      event.targets[1]._thyeyanfires = [1];
                      if (players.length) {
                        event.targets.push(players.shift());
                        event.targets[2]._thyeyanfires = [2];
                      }
                    }
                    event._result = {
                      bool: true,
                    }
                  }
                }
                'step 1'
                game.thunderAllowTouch();
                var con = document.getElementById('dui-controls');
                con.classList.remove('th-confirmdown2');
                delete window.qhly_forbidPlayerWindow;
                if (event.dibeijing) event.dibeijing.remove();
                document.removeEventListener(lib.config.touchscreen ? 'touchmove' : 'mousemove', event.yeyanmove);
                document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', event.yeyanend);
                for (var i of game.players) {
                  i.node.avatar.removeEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', event.playerListen);
                }
                var flames = document.querySelectorAll('.th-yeyanflame');
                for (var i of flames) {
                  i.remove();
                }
                if (event.targets && event.targets.length && result.bool) {
                  event.targets.sortBySeat();
                  if (event.needCards) {
                    player.discard(result.cards);
                    player.loseHp(3);
                  }
                  player.awakenSkill('th_yeyan');
                  player.logSkill('th_yeyan', event.targets)
                } else event.finish();
                'step 2'
                for (var i = 0; i < event.targets.length; i++) {
                  event.targets[i].damage(event.targets[i]._thyeyanfires.length, 'fire');
                }
              },
              ai: {
                order: function (item, player) {
                  var cards = lib.skill.th_yeyan.choose4Cards(event, player);
                  if (cards) return 10;
                  return 1
                },
                fireAttack: true,
                result: {
                  player: function (player, target) {
                    var cards = lib.skill.th_yeyan.choose4Cards(_status.event, player);
                    if (cards.length) {
                      if (game.hasPlayer(function (current) {
                        return get.damageEffect(current, player)
                      })) return 1;
                    } else if (game.filterPlayer(function (current) {
                      return get.damageEffect(current, player)
                    }).length > 1) return 1;
                    return 0;
                  }
                }
              }
            },

            //谋诸葛亮
            thhuoji: {
              audio: "ext:Thunder/audio/skill:2",
              enable: 'phaseUse',
              filterTarget: lib.filter.notMe,
              prompt: '选择一名其他角色，对其与其势力相同的所有其他角色各造成1点火属性伤害',
              usable: 1,
              line: 'fire',
              content: function () {
                'step 0'
                target.damage('fire');
                'step 1'
                var targets = game.filterPlayer(current => {
                  if (current == player || current == target) return false;
                  return current.group == target.group;
                });
                if (targets.length) {
                  game.delayx();
                  player.line(targets, 'fire');
                  targets.forEach(i => i.damage('fire'));
                }
              },
              ai: {
                order: 7,
                fireAttack: true,
                result: {
                  target: function (player, target) {
                    var att = get.attitude(player, target);
                    return get.sgn(att) * game.filterPlayer(current => {
                      if (current == player) return false;
                      return current.group == target.group;
                    }).reduce((num, current) => num + get.damageEffect(current, player, player, 'fire'), 0);
                  },
                },
              },
              derivation: ['thguanxing', 'thkongcheng'],
              group: ['thhuoji_achieve', 'thhuoji_fail', 'thhuoji_mark'],
              subSkill: {
                achieve: {
                  audio: 'thhuoji',
                  trigger: { player: 'phaseZhunbeiBegin' },
                  filter: function (event, player) {
                    return player.getAllHistory('sourceDamage', evt => evt.hasNature('fire')).reduce((num, evt) => num + evt.num, 0) >= game.players.length + game.dead.length;
                  },
                  forced: true,
                  locked: false,
                  skillAnimation: true,
                  animationColor: 'fire',
                  content: function () {
                    player.awakenSkill('thhuoji');
                    game.log(player, '成功完成使命');
                    var list = [];
                    if (player.name && get.character(player.name)[3].includes('thhuoji')) list.add(player.name);
                    if (player.name1 && get.character(player.name1)[3].includes('thhuoji')) list.add(player.name1);
                    if (player.name2 && get.character(player.name2)[3].includes('thhuoji')) list.add(player.name2);
                    if (list.length) list.forEach(name => player.reinit(name, 'th_zhugeliang'));
                    else {
                      player.removeSkill(['thhuoji', 'thkanpo']);
                      player.addSkill(['thguanxing', 'thkongcheng']);
                    }
                  },
                },
                fail: {
                  audio: 'thhuoji',
                  trigger: { player: 'dying' },
                  forced: true,
                  locked: false,
                  content: function () {
                    player.awakenSkill('thhuoji');
                    game.log(player, '使命失败');
                  },
                },
                mark: {
                  charlotte: true,
                  trigger: { source: 'damage' },
                  filter: function (event, player) {
                    return event.hasNature('fire');
                  },
                  firstDo: true,
                  forced: true,
                  popup: false,
                  content: function () {
                    player.addTempSkill('thhuoji_count', { player: ['thhuoji_achieveBegin', 'thhuoji_failBegin'] });
                    player.storage.thhuoji_count = player.getAllHistory('sourceDamage', evt => evt.hasNature('fire')).reduce((num, evt) => num + evt.num, 0);
                    player.markSkill('thhuoji_count');
                  },
                },
                count: {
                  charlotte: true,
                  intro: { content: '本局游戏已造成过#点火属性伤害' },
                },
              },
            },
            thkanpo: {
              audio: "ext:Thunder/audio/skill:2",
              trigger: { global: 'roundStart' },
              forced: true,
              locked: false,
              content: function () {
                'step 0'
                game.thunderForbidTouch();
                var storage = player.getStorage('thkanpo').slice();
                if (storage.length) {
                  player.unmarkAuto('thkanpo', storage);
                }
                const list = get.inpileVCardList(info => {
                  if (info[2] == 'sha' && info[3]) return false;
                  return info[0] != 'equip';
                });
                event.dbg = ui.create.div('.th-dibeijing', document.body);
                var links = [];
                var buttons = [];
                if (event.isMine()) {
                  game.pause();
                  game.countChoose();
                  _status.imchoosing = true;
                  event.dialog = game.thunderDialog(event.dbg, { width: 700, height: 300, title: '看破' });
                  var basicBg = ui.create.div('.th-kanpoBb', event.dialog.container);
                  var trickBg = ui.create.div('.th-kanpoTb', event.dialog.container);
                  ui.create.confirm("c");
                  var fullNum = 3;
                  event.control = ui.create.control('清除选择', 'stayleft', function () {
                    fullNum = 3;
                    buttons.forEach(i => { i.selectNum = 0; i.classList.remove('select') });
                    buttons = [];
                    links = [];
                    this.hide();
                  })
                  event.control.hide();
                  list.forEach((i, e) => {
                    var bg = trickBg;
                    if (i[0] == 'basic') bg = basicBg;
                    let vc = game.thunderCreateVCard(i, bg, function () {
                      if (this.classList.contains('selectless')) return;
                      if (this.selectNum === undefined) this.selectNum = 0;
                      if (this.selectNum < 3 && fullNum > 0) {
                        fullNum--;
                        this.selectNum++;
                        this.style.setProperty('--c', `"×${this.selectNum}"`);
                        if (!this.classList.contains('select')) this.classList.add('select');
                        links.push(i);
                        buttons.add(this);
                        ui.create.confirm("oc");
                        event.control.show();
                      }
                    });
                    if (storage.contains(i[2])) vc.classList.add('selectless')
                  })
                  event.custom.replace.confirm = function (bool) {
                    if (bool) event._result = {
                      bool: true,
                      links: links,
                    };
                    else event._result = { bool: false };
                    if (ui.confirm) ui.confirm.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  }
                  var con = document.getElementById('dui-controls');
                  con.classList.add('th-confirmdown');
                } else {
                  event.dbg.remove();
                  var aiList = ['sha', 'shan', 'tao', 'jiu', 'lebu', 'wuxie'];
                  while (links.length < Math.min(3, game.players.length)) {
                    var link = aiList.randomGet();
                    if (link == 'lebu' && links.contains('lebu')) continue;
                    if (!storage.contains(link)) links.push(link);
                  }
                  links = links.map(n => ['', '', n]);
                  event._result = {
                    bool: true,
                    links: links,
                  }
                }
                'step 1'
                game.thunderAllowTouch();
                event.dbg.remove();
                if (event.dialog) event.dialog.remove();
                var con = document.getElementById('dui-controls');
                con.classList.remove('th-confirmdown');
                if (result.bool) {
                  var names = result.links.map(link => link[2]);
                  player.setStorage('thkanpo', names);
                  player.markSkill('thkanpo');
                }
              },
              marktext: '破',
              intro: {
                markcount: function (storage, player) {
                  if (player.isUnderControl(true)) return storage.length;
                  return '?';
                },
                mark: function (dialog, content, player) {
                  if (player.isUnderControl(true)) {
                    const storage = player.getStorage('thkanpo');
                    dialog.addText('已记录牌名：');
                    dialog.addSmall([storage, 'vcard']);
                  }
                  else {
                    return `${get.translation(player)}记录了一些牌名`;
                  }
                },
              },
              group: 'thkanpo_kanpo',
              subSkill: {
                kanpo: {
                  audio: 'thkanpo',
                  trigger: { global: 'useCard' },
                  filter: function (event, player) {
                    return event.player != player && player.getStorage('thkanpo').includes(event.card.name);
                  },
                  prompt2: function (event, player) {
                    return '移除' + get.translation(event.card.name) + '的记录，令' + get.translation(event.card) + '无效';
                  },
                  check: function (event, player) {
                    var effect = 0;
                    if (event.card.name == 'wuxie' || event.card.name == 'shan') {
                      if (get.attitude(player, event.player) < -1) effect = -1;
                    }
                    else if (event.targets && event.targets.length) {
                      for (var i = 0; i < event.targets.length; i++) {
                        effect += get.effect(event.targets[i], event.card, event.player, player);
                      }
                    }
                    if (effect < 0) {
                      if (event.card.name == 'sha') {
                        var target = event.targets[0];
                        if (target == player) return !player.countCards('h', 'shan');
                        else return target.hp == 1 || (target.countCards('h') <= 2 && target.hp <= 2);
                      }
                      else return true;
                    }
                    return false;
                  },
                  logTarget: 'player',
                  content: function () {
                    player.unmarkAuto('thkanpo', [trigger.card.name]);
                    trigger.targets.length = 0;
                    trigger.all_excluded = true;
                  },
                },
              },
            },
            thguanxing: {
              audio: "ext:Thunder/audio/skill:2",
              trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
              filter: function (event, player) {
                return event.name == 'phaseZhunbei' || (player.hasSkill('thguanxing_on') && player.countCards('s', card => card.hasGaintag('thguanxing')));
              },
              forced: true,
              locked: false,
              content: function () {
                'step 0'
                if (trigger.name == 'phaseJieshu') {
                  event.goto(2);
                  return;
                }
                var cards = player.getCards('s', card => card.hasGaintag('thguanxing'));
                if (cards.length) player.loseToDiscardpile(cards);
                var bool = player.getAllHistory('useSkill', evt => evt.skill == 'thguanxing').length > 1;
                event.num = Math.min(7, bool ? cards.length + 1 : 7);
                'step 1'
                var cards2 = get.cards(num);
                player.$gain2(cards2, false);
                game.log(player, '将', cards2, '置于了武将牌上');
                player.loseToSpecial(cards2, 'thguanxing').visible = true;
                player.markSkill('thguanxing');
                'step 2'
                var cards = player.getCards('s', card => card.hasGaintag('thguanxing'));
                if (cards.length) {
                  player.chooseToMove().set('list', [
                    ['你的“星”', cards],
                    ['牌堆顶'],
                  ]).set('prompt', '观星：点击将牌移动到牌堆顶').set('processAI', function (list) {
                    var cards = list[0][1].slice(), player = _status.event.player;
                    var name = _status.event.getTrigger().name;
                    var target = (name == 'phaseZhunbei' ? player : player.getNext());
                    var top = [], att = get.sgn(get.attitude(player, target));
                    var judges = target.getCards('j');
                    if (att != 0 && (target != player || !player.hasWuxie())) {
                      for (var i = 0; i < judges.length; i++) {
                        var judge = get.judge(judges[i]) * att;
                        cards.sort((a, b) => judge(b) - judge(a));
                        if (judge(cards[0]) > 0) top.unshift(cards.shift());
                        else break;
                      }
                    }
                    return [cards, top];
                  }).set('filterOk', function (moved) {
                    return moved[1].length;
                  });
                }
                else event._result = { bool: false };
                'step 3'
                if (result.bool) {
                  var cards = result.moved[1];
                  player.loseToDiscardpile(cards, ui.cardPile, 'insert').log = false;
                  game.log(player, '将', cards, '置于了牌堆顶');
                }
                else if (trigger.name == 'phaseZhunbei') player.addTempSkill('thguanxing_on');
              },
              group: 'thguanxing_unmark',
              subSkill: {
                on: { charlotte: true },
                unmark: {
                  trigger: { player: 'loseAfter' },
                  filter: function (event, player) {
                    if (!event.ss || !event.ss.length) return false;
                    return !player.countCards('s', card => card.hasGaintag('thguanxing'));
                  },
                  charlotte: true,
                  forced: true,
                  silent: true,
                  content: function () {
                    player.unmarkSkill('thguanxing');
                  },
                },
              },
              marktext: '星',
              intro: {
                mark: function (dialog, storage, player) {
                  var cards = player.getCards('s', card => card.hasGaintag('thguanxing'));
                  if (!cards || !cards.length) return;
                  dialog.addAuto(cards);
                },
                markcount: function (storage, player) {
                  return player.countCards('s', card => card.hasGaintag('thguanxing'));
                },
                onunmark: function (storage, player) {
                  var cards = player.getCards('s', card => card.hasGaintag('thguanxing'));
                  if (cards.length) player.loseToDiscardpile(cards);
                },
              },
              mod: {
                aiOrder: function (player, card, num) {
                  var cards = player.getCards('s', card => card.hasGaintag('thguanxing'));
                  if (get.itemtype(card) == 'card' && card.hasGaintag('thguanxing')) return num + (cards.length > 1 ? 0.5 : -0.0001);
                },
              },
            },
            thkongcheng: {
              audio: "ext:Thunder/audio/skill:2",
              trigger: { player: ['damageBegin3', 'damageBegin4'] },
              filter: function (event, player, name) {
                if (!player.hasSkill('thguanxing')) return false;
                const num = player.countCards('s', card => card.hasGaintag('thguanxing'));
                if (name == 'damageBegin3' && !num) return true;
                if (name == 'damageBegin4' && num) return true;
                return false;
              },
              forced: true,
              content: function () {
                'step 0'
                var num = player.countCards('s', card => card.hasGaintag('thguanxing'));
                if (!num && event.triggername == 'damageBegin3') {
                  trigger.increase('num');
                }
                else if (num && event.triggername == 'damageBegin4') {
                  player.judge(function (result) {
                    if (get.number(result) <= get.player().countCards('s', card => card.hasGaintag('thguanxing'))) return 2;
                    return -1;
                  }).set('judge2', result => result.bool).set('callback', function () {
                    if (event.judgeResult.number <= player.countCards('s', card => card.hasGaintag('thguanxing'))) {
                      event.getParent('thkongcheng').getTrigger().decrease('num');
                    }
                  });
                }
              },
            },














          }
};
}
