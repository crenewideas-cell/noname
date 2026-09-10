// Extracted from extension/EpicFX/extension.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
          "k_shenlusu": ['male', 'shen', 3,['k_tamo','shendingzhou','shenzhimou'],['wu']],
        },
"translate": {...{
          "k_shichangshi": "十常侍",
          "k_shenlusu": "神鲁肃",
        },...{},...{
          k_danggu: '党锢',
          k_danggu_info: '锁定技。①游戏开始时，你获得十张“常侍”牌，然后你进行一次结党。②当你修整结束后，你进行一次结党并摸两张牌。③若你有亮出的“常侍”牌，你视为拥有这些牌的技能。',
          k_danggu_faq: '关于结党',
          k_danggu_faq_info: '<br>系统随机选择一张未亮出过的“常侍”牌，然后选择四张未亮出过的“常侍”牌（若剩余“常侍”牌中有「高望」，则必定出现）。你观看前者，然后从后者中选择一名与前者互相认可的“常侍”牌（不认可的“常侍”牌为不可选状态），你选择这两张牌。然后若此时不为双将模式，你将这两张武将牌作为你的武将牌（不移除原有技能）；否则你获得这两张武将牌上的技能。',
          k_mowang: '殁亡',
          k_mowang_info: '锁定技。①当你死亡前，若你有未亮出的“常侍”牌且体力上限大于0，你将死亡改为修整至你的下个回合开始前，然后你复原武将牌，且不于此次死亡事件中进行展示身份牌、检测游戏胜利条件与执行奖惩的流程。②回合结束后，你死亡。',
          k_mowang_faq: '关于修整',
          k_mowang_faq_info: '<br>将武将牌移出游戏（视为你存活）。当该角色修整结束，其移回游戏。',
          "k_tamo": "榻谟",
          "k_tamo_info": "游戏开始时，你可以重新分配所有非主公角色的座次。",
          "buff_30001": "如虎添翼",
          // "buff_30001_info": "出牌阶段开始前，你有10/20/40/60/80/100%的几率摸两张牌.",
          "buff_30002": "虎威",
          // "buff_30002_info": "你于回合内使用第一张[杀]时，若你本回合获得牌数不小于x (x为你的当前体力值)，则你此[杀]不可响应且伤害+1.",
          "buff_30009": "花容月貌",
          // "buff_30009_info": "每轮限一次，当男性角色受到伤害后，你回复一点体力并摸一张牌.",
          "buff_30010": "娇面",
          "buff_30003": "金鸡独立",
          "buff_30004": "乐不可支",
          "buff_30005": "饞嘴王",
          "buff_30006": "祥云瑞氣",
          "buff_30007": "神妙",
          "buff_30008": "洞若观火",
          "buff_30011": "神鬼不测",
          "buff_30012": "反计",
          "buff_30013": "天外之火",
          "buff_30015": "神勇",
          "buff_30016": "攫戾執猛",
          "buff_30019": "狐火灵气",
          "buff_30019_disable": "狐火灵气",
          "buff_30020": "秘思",
          "buff_30021": "九尾之命",
          "buff_30017": "矢无虚发",
          "buff_30018": "弓上弦",
          "buff_30024": "雷奔云谲",
          "buff_30025": "紫电",
          "buff_30026": "迅雷风烈",
          "buff_30031": "弓上弦",
          "buff_30031": "倚天拔地",
          "buff_30032": "蛇影",
          "buff_30033": "玄冥真主",
          "buff_30029": "弄鬼掉猴",
          "buff_30030": "捣蛋",
          "buff_30027": "承天之佑",
          "buff_30028": "守护",
          "buff_30034": "麒麟之姿",
          "buff_30035": "掌火",
          "buff_30036": "腾焰飞芒",
          "buff_30037": "慷慨鸭昂",
          "buff_30038": "鸭立",
          "buff_30039": "轻舞飞扬",
          "buff_30040": "勇猛直前",
          "buff_30041": "忠誌",
          "buff_30044": "披坚执锐",
          "buff_30045": "轻健",
          "buff_30046": "巧捷万端",
          "buff_30042": "娉婷万種",
          "buff_30043": "依人",
          "buff_30042": "慧心巧思",
          "buff_30043": "清婉",
          "buff_30055": "巧拙守真",
          "buff_30056": "兕袭",
          "buff_30057": "丰收瑞鸣",
          "buff_30058": "安康",
          "buff_30061": "风云变色",
          "buff_30062": "鸣嗷",
          "buff_30063": "披星戴月",
          "buff_30068": "永恒烈日",
          "buff_30069": "三足",
          "buff_30070": "赤地千里",
        }},
"card": {},
"skill": {
            "k_danggu": {
            audio: 2,
            trigger: {
              player: 'enterGame',
              global: 'phaseBefore',
            },
            filter: function (event, player) {
              return event.name != 'phase' || game.phaseNumber == 0;
            },
            derivation: 'k_danggu_faq',
            forced: true,
            unique: true,
            onremove: function (player) {
              delete player.storage.k_danggu;
              delete player.storage.k_danggu_current;
            },
            popups: {
              scstaoluan: "你可以将一张牌当任意一张牌使用。",
              scschiyan: "你使用杀可以暂时扣置目标角色牌，若装备和手牌数均大于对方，则额外造成伤害。",
              scszimou: "你使用第2,4,6张牌时，可以获得额外的牌。",
              scspicai: "你可以进行判定，若花色不相同可以一直判定，直至花色相同，然后可以把判定牌交给一名角色。",
              scsyaozhuo: "出牌阶段限一次，你可以选择一名其他角色拼点：若你赢，跳过其下一个摸牌阶段：若你没赢。你须弃置一张杀。",
              scsxiaolu: "出牌阶段限一次，你可以摸三张牌，然后你选择一项：弃置三张手牌，或将三张手牌交给一名其他角色。",
              scskuiji: "你可以观看一名角色手牌，并与其一共弃置四张不同花色的牌。",
              scschihe: "你使用杀可以从牌堆项翻牌，每张花色与杀相同的牌便使此杀伤害＋1，翻出的牌也会限制对方响应此杀。",
              scsniqu: "对一名角色造成火焰伤害。",
              scsanruo: "可以转化手牌应对各种攻势并不断获得其他角色的手牌。",
            },
            lines:{
              scs_zhangrang: "吾乃当今帝父，汝岂配与我同列？",
              scs_zhaozhong: "汝此等语，何不以溺自照？",
              scs_sunzhang: "闻谤而怒，见欲而喜，汝万万不能啊！",
              scs_bilan: "吾虽鄙夫，亦远胜尔等狂叟！",
              scs_xiayun: "宁享短福，莫为汝等庸奴！",
              scs_hankui: "贪财好贿，其罪尚小，不敬不逊，却为大逆！",
              scs_lisong: "区区不才可为帝之耳目，试问汝有何能？",
              scs_duangui: "哼！不过襟裾牛马，衣冠狗彘耳！",
              scs_guosheng: "此昏聩之徒，吾羞与为伍！",
              scs_gaowang: "若非吾之相助，汝安有今日？",
            },
            changshi: [
              ['scs_zhangrang', 'scstaoluan'],
              ['scs_zhaozhong', 'scschiyan'],
              ['scs_sunzhang', 'scszimou'],
              ['scs_bilan', 'scspicai'],
              ['scs_xiayun', 'scsyaozhuo'],
              ['scs_hankui', 'scsxiaolu'],
              ['scs_lisong', 'scskuiji'],
              ['scs_duangui', 'scschihe'],
              ['scs_guosheng', 'scsniqu'],
              ['scs_gaowang', 'scsanruo']
            ],
            conflictMap: {
              scs_zhangrang: [],
              scs_zhaozhong: [],
              scs_sunzhang: [],
              scs_bilan: ['scs_hankui'],
              scs_xiayun: [],
              scs_hankui: ['scs_bilan'],
              scs_lisong: [],
              scs_duangui: ['scs_guosheng'],
              scs_guosheng: ['scs_duangui'],
              scs_gaowang: ['scs_hankui', 'scs_duangui', 'scs_guosheng', 'scs_bilan'],
            },
            group: 'k_danggu_back',
            content: function () {
              'step 0'
              if (!ui.scsPage) {
                // EpicFX.initSCSAnim();
                const scsPage = document.createElement("div");
                scsPage.classList.add("scsPage");
                scsPage.style.display = "none";
                ui.scsPage = scsPage;
                ui.window.appendChild(scsPage);
                const scsDialog = new EpicFX.utils.scsDialog();
                scsDialog.create();
                player.scsDialog = scsDialog;
                player.xz = dui.element.create("characterXZ", player);
                player.xz.xzz = dui.element.create("characterXZImg", player.xz, "img");
                player.xz.xzz.src = `${EpicFX.extensionPath}asset/img/base/game_ud_waiting.png`;
                player.xz.lc = dui.element.create("characterLC", player.xz);
                player.xz.lc.p = dui.element.create("characterLC", player.xz.lc, "p");
                player.xz.lc.p.textContent = "1";
                player.xz.lc.img = dui.element.create("characterLCImg", player.xz.lc, "img");
                player.xz.lc.img.src = `${EpicFX.extensionPath}asset/img/base/game_ud_turn_flag.png`;
                ui.popups = new EpicFX.utils.popup(undefined, undefined, ui.window, undefined);
              }
              var list = lib.skill.k_danggu.changshi.map(i => i[0]);
              player.markAuto('k_danggu', list);
              game.broadcastAll(function (player, list) {
                var cards = [];
                for (var i = 0; i < list.length; i++) {
                  var cardname = 'huashen_card_' + list[i];
                  lib.card[cardname] = {
                    fullimage: true,
                    image: 'character/' + list[i]
                  }
                  lib.translate[cardname] = get.rawName2(list[i]);
                  cards.push(game.createCard(cardname, '', ''));
                }
                player.$draw(cards, 'nobroadcast');
              }, player, list);
              if (!_status.characterlist) lib.skill.pingjian.initList();
                // 手杀UI专属技能按钮，用来查看化身
                var func = function(id, cards) {
                    var dialog = ui.create.dialognew('#huashen', [cards, 'character']);
                    dialog.videoId = id;
                    var eventtitle = ui.create.div('.newTitle1', dialog);
                    eventtitle.innerHTML = '党锢';
                    var sanjiao = ui.create.div('.newTitlexg', dialog);
                    sanjiao.addEventListener('click', function() {
                        if (dialog.classList.contains('open')) {
                            dialog.classList.remove('open');
                            sanjiao.style.transform = "rotate(0deg)";
                            dialog.style.top = "10%";
                        } else {
                            dialog.classList.add('open');
                            sanjiao.style.transform = "rotate(180deg)";
                            dialog.style.top = "50%";
                        }
                    });
                    return dialog;
                };
                if (ui.skillControl && ui.skillControl.node && ui.skillControl.node.enable && !ui.skillControl.node.enable.querySelector('[data-id=k_danggu_dialog]') && ui.updateSkillControl)
                    {
                        var create = function (){
                            if (ui.skillControl && ui.skillControl.node) {
                                if (ui.skillControl.node.enable 
                                    && !ui.skillControl.node.enable.querySelector('[data-id=k_danggu_dialog]')
                                    && game.me == player) {                            
                                    var btn = ui.create.div(
                                        '.skillitem.usable', 
                                        ui.skillControl.node.enable, 
                                        '党锢', 
                                        0,
                                        function (){
                                            if (_status._dangguDialog) {
                                                _status._dangguDialog.close();
                                                delete _status._dangguDialog;
                                            } else _status._dangguDialog = func(null, player.storage.k_danggu);
                                        }
                                    );
                                    var btn_child = ui.create.div('.skillitem-child', btn, '党锢');
                                    btn.dataset.id = 'k_danggu_dialog';
                                    btn.classList.remove = function (){};
                                    if (btn) ui.skillControl.node.enable.style.width = ui.skillControl.node.enable.childNodes.length > 2 ? '200px' : '120px';
                                };
                                if (ui.skillControl.node.trigger
                                    && ui.skillControl.node.trigger.querySelector('[data-id=k_danggu]')
                                    && game.me == player) 
                                    ui.skillControl.node.trigger.querySelector('[data-id=k_danggu]').remove();
                            };
                        }
                        , original = ui.updateSkillControl;
                        create();
                        ui.updateSkillControl = function (){
                            var result = original.apply(this, arguments);
                            create();
                            return result;
                        };
                    };
              'step 1'
              var next = game.createEvent('k_danggu_clique');
              next.player = player;
              next.setContent(lib.skill.k_danggu.contentx);
            },
            contentx: function () {
              'step 0'
              var list = player.getStorage('k_danggu');
              var first = list.randomRemove(1)[0];
              event.first = first;
              // game.broadcastAll(function (changshi) {
              //   if (lib.config.background_speak) game.playAudio('skill', changshi + '_enter');
              // }, first);
              if (lib.skill.k_danggu.isSingleShichangshi(player)) {
                game.broadcastAll(function (player, first) {
                  if (!player.name2) player.smoothAvatar(false);
                  player.name1 = first;
                  EpicFX.scs.name1 = first;
                  // player.node.avatar.setBackground(first, 'character');
                  player.node.avatar.setBackgroundImage(`extension/EpicFX/asset/img/scs/${first}.jpg`);
                  player.node.name.innerHTML = get.slimName(first);
                  delete player.name2;
                  player.smoothAvatar(true);
                  player.node.avatar2.classList.add('hidden');
                  player.classList.remove('fullskin2');
                  player.node.name2.innerHTML = '';
                  if (player == game.me && ui.fakeme) {
                    ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                  }
                }, player, first);
              }
              if (list.contains('scs_gaowang')) {
                var others = list.filter(changshi => {
                  return changshi != 'scs_gaowang';
                }).randomGets(3);
                others.push('scs_gaowang');
                others.randomSort();
              } else {
                var others = list.randomGets(4);
              }
              if (player == game.me) {
                game.pause();
                let charZhu = new EpicFX.utils.characterCard(first,`${EpicFX.extensionPath}asset/img/scs/${first}.jpg`,"qun", lib.skill.k_danggu.lines[first], "k_shichangshi");
                charZhu.create(player.scsDialog.zhu);
                charZhu.addListener("click", function (e) {
                  let target = e.target.closest(".KCharacter").obj;
                  if (target) {
                    let skillName;
                    let len = lib.skill.k_danggu.changshi.length;
                    for (let j = 0; j < len; j++) {
                      if (lib.skill.k_danggu.changshi[j][0] == target.sourceName) {
                        skillName = lib.skill.k_danggu.changshi[j][1];
                        break;
                      }
                    }
                    let str1 = get.translation(skillName);
                    let str2 = lib.skill.k_danggu.popups[skillName];
                    ui.popups.setPopup(str1,str2,{
                      x: e.clientX / game.documentZoom,
                      y: e.clientY / game.documentZoom
                    });
                    ui.popups.popup();
                  }
                })
                player.scsDialog.charZhu = charZhu;
                player.scsDialog.charFu = {};
                let disapprove = 0;
                for (let i = 0; i < others.length; i++) {
                  let temp = others[i];
                  let charFu = new EpicFX.utils.characterCard(temp,`${EpicFX.extensionPath}asset/img/scs/${temp}.jpg`,"qun", lib.skill.k_danggu.lines[temp], "k_shichangshi");
                  if (EpicFX.utils.checkConflict(lib.skill.k_danggu.conflictMap,first,temp)) {
                    charFu.lock(true);
                    disapprove++;
                  }
                  charFu.create(player.scsDialog.fu);
                  charFu.addListener("click",function (e) {
                    let target = e.target.closest(".KCharacter").obj;
                    if (target) {
                      if (!target.isLock) {
                        let skillName;
                        let len = lib.skill.k_danggu.changshi.length;
                        for (let j = 0; j < len; j++) {
                          if (lib.skill.k_danggu.changshi[j][0] == target.sourceName) {
                            skillName = lib.skill.k_danggu.changshi[j][1];
                            break;
                          }
                        }
                        let str1 = get.translation(skillName);
                        let str2 = lib.skill.k_danggu.popups[skillName];
                        ui.popups.setPopup(str1,str2,{
                          x: e.clientX / game.documentZoom,
                          y: e.clientY / game.documentZoom
                        });
                        ui.popups.popup();
                        if (!player.scsDialog.target) {
                          target.selectDiv.style.opacity = "1";
                          player.scsDialog.target = target;
                        } else if (player.scsDialog.target != target) {
                          player.scsDialog.target.selectDiv.style.opacity = "0";
                          target.selectDiv.style.opacity = "1";
                          player.scsDialog.target = target;
                        } else if (player.scsDialog.target == target) {
                          event.chosen = target.sourceName;
                          ui.popups.hide();
                          player.scsDialog.show();
                          game.resume();
                        }
                      } else {
                        target.say();
                      }
                    }
                  })
                  player.scsDialog.charFu[temp] = charFu;
                }
                if (disapprove == others.length) {
                  for (let key in player.scsDialog.charFu) {
                    player.scsDialog.charFu[key].lock(false);
                  }
                }
                result.bool = true;
                player.scsDialog.show(true);
              } else {
                var next = player.chooseButton([
                  '党锢：请选择结党对象',
                  [[first], 'character'],
                  '<div class="text center">可选常侍</div>',
                  [others, 'character']
                ], true);
                next.set('filterButton', button => {
                  if (_status.event.canChoose.contains(button.link)) return true;
                  return false;
                })
                next.set('canChoose', function () {
                  var list = others.filter(changshi => {
                    var map = lib.skill.k_danggu.conflictMap;
                    var names = map[first];
                    return !names.contains(changshi);
                  });
                  if (list.length == 0) return others.randomGets(1);
                  return list;
                }());
                next.set('ai', button => {
                  if (button.link == 'scs_gaowang') return 10;
                  return Math.random() * 10;
                })
              }
              'step 1'
              if (result.bool || event.chosen) {
                var first = event.first;
                var chosen = event.chosen || result.links[0];
                var skills = [];
                var list = lib.skill.k_danggu.changshi;
                var changshis = [event.first, chosen];
                player.unmarkAuto('k_danggu', [chosen]);
                player.storage.k_danggu_current = changshis;
                for (var changshi of changshis) {
                  for (var cs of list) {
                    if (changshi == cs[0]) skills.push(cs[1]);
                  }
                }
                if (lib.skill.k_danggu.isSingleShichangshi(player)) {
                  game.broadcastAll(function (player, chosen) {
                    player.node.name2.setBackgroundImage(`extension/EpicFX/asset/img/base/${player.group}_name2.png`);
                    player.name2 = chosen;
                    EpicFX.scs.name2 = chosen;
                    player.classList.add('fullskin2');
                    player.node.avatar2.classList.remove('hidden');
                    // player.node.avatar2.setBackground(chosen, 'character');
                    player.node.avatar2.setBackgroundImage(`extension/EpicFX/asset/img/scs/${chosen}.jpg`);
                    player.node.name2.innerHTML = get.slimName(chosen);
                    if (player == game.me && ui.fakeme) {
                      ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                    }
                  }, player, chosen);
                }
                game.log(player, '选择了常侍', '#y' + get.translation(changshis));
                // game.broadcastAll(function (changshi) {
                //   if (lib.config.background_speak) game.playAudio('skill', changshi + '_enter');
                // }, chosen);
                if (skills.length) {
                  player.addAdditionalSkill('k_danggu', skills);
                  game.log(player, '获得了技能', '#g' + get.translation(skills));
                  player.popup(skills);
                }
              }
            },
            isSingleShichangshi: function (player) {
              var map = lib.skill.k_danggu.conflictMap;
              return player.name == 'k_shichangshi' && (map[player.name1] && map[player.name2] || map[player.name1] && !player.name2 || !player.name1 && !player.name2 || player.name == player.name1 && !player.name2);
            },
            mod: {
              aiValue: function (player, card, num) {
                if (['shan', 'tao', 'wuxie', 'caochuan'].contains(card.name)) return num / 10;
              },
              aiUseful: function () {
                return lib.skill.k_danggu.mod.aiValue.apply(this, arguments);
              },
            },
            intro: {
              mark: function (dialog, storage, player) {
                dialog.addText('剩余常侍');
                dialog.addSmall([storage, 'character']);
                if (player.storage.k_danggu_current) {
                  dialog.addText('当前常侍');
                  dialog.addSmall([player.storage.k_danggu_current, 'character']);
                }
              }
            },
            subSkill: {
              back: {
                audio: 'k_danggu',
                trigger: {global: 'restEnd'},
                filter: function (event, player) {
                  return event.getTrigger().player == player;
                },
                forced: true,
                content: function () {
                  var next = game.createEvent('k_danggu_clique');
                  next.player = player;
                  next.setContent(lib.skill.k_danggu.contentx);
                  player.draw(2);
                }
              }
            }
          },
           "k_mowang": {
            audio: 2,
            trigger: {player: 'dieBefore'},
            filter: function (event, player) {
              return player.getStorage('k_danggu').length && event.getParent().name != 'giveup' && player.maxHp > 0;
            },
            derivation: 'k_mowang_faq',
            forced: true,
            direct: true,
            priority: 15,
            group: ['k_mowang_die', 'k_mowang_return', 'k_mowang_die2'],
            content: function () {
              if (_status.k_mowang_return && _status.k_mowang_return[player.playerid]) {
                trigger.cancel();
              } else {
                player.logSkill('k_mowang');
                // game.broadcastAll(function () {
                //   if (lib.config.background_speak) game.playAudio('die', 'shichangshiRest');

                // });
                trigger.setContent(lib.skill.k_mowang.dieContent);
                trigger.includeOut = true;
              }
            },
            dieContent: function () {
              'step 0'
              event.forceDie = true;
              if (source) {
                game.log(player, '被', source, '杀害');
                if (source.stat[source.stat.length - 1].kill == undefined) {
                  source.stat[source.stat.length - 1].kill = 1;
                } else {
                  source.stat[source.stat.length - 1].kill++;
                }
              } else {
                game.log(player, '阵亡');
              }
              if (player.isIn() && (!_status.k_mowang_return || !_status.k_mowang_return[player.playerid])) {
                player.node.hp.hide();
                player.xz.style.display = "block";
                EpicFX.huihe.referNode = player.xz.lc.img;
                dcdAnim.playSpine(EpicFX.huihe);
                event.reserveOut = true;
                game.log(player, '进入了修整状态');
                game.log(player, '移出了游戏');
                 game.log(player, '进入了修整状态');
                game.log(player, '移出了游戏');
                if(player == game.me){
                var wenzi = document.createElement("div");
                wenzi.classList.add("scswenzi");
          wenzi.insertAdjacentHTML("afterbegin", "稍后你可返回战局,不要离开");
               ui.arena.appendChild(wenzi);
               }
                //game.addGlobalSkill('k_mowang_return');
                if (!_status.k_mowang_return) _status.k_mowang_return = {};
                _status.k_mowang_return[player.playerid] = 1;
              } else event.finish();
              if (!game.countPlayer()) game.over();
              else if (player.hp != 0) {
                player.changeHp(0 - player.hp, false).forceDie = true;
              }
              game.broadcastAll(function (player) {
                if (player.isLinked()) {
                  if (get.is.linked2(player)) {
                    player.classList.toggle('linked2');
                  } else {
                    player.classList.toggle('linked');
                  }
                }
                if (player.isTurnedOver()) {
                  player.classList.toggle('turnedover');
                }
              }, player);
              game.addVideo('link', player, player.isLinked());
              game.addVideo('turnOver', player, player.classList.contains('turnedover'));
              'step 1'
              event.trigger('die');
              'step 2'
              if (event.reserveOut) {
                if (!game.reserveDead) {
                  for (var mark in player.marks) {
                    if (mark == 'k_danggu') continue;
                    player.unmarkSkill(mark);
                  }
                  var count = 1;
                  var list = Array.from(player.node.marks.childNodes);
                  if (list.some(i => i.name == 'k_danggu')) count++;
                  while (player.node.marks.childNodes.length > count) {
                    var node = player.node.marks.lastChild;
                    if (node.name == 'k_danggu') {
                      node = node.previousSibling;
                    }
                    node.remove();
                  }
                  game.broadcast(function (player, count) {
                    while (player.node.marks.childNodes.length > count) {
                      var node = player.node.marks.lastChild;
                      if (node.name == 'k_danggu') {
                        node = node.previousSibling;
                      }
                      node.remove();
                    }
                  }, player, count);
                }
                for (var i in player.tempSkills) {
                  player.removeSkill(i);
                }
                var skills = player.getSkills();
                for (var i = 0; i < skills.length; i++) {
                  if (lib.skill[skills[i]].temp) {
                    player.removeSkill(skills[i]);
                  }
                }
                event.cards = player.getCards('hejsx');
                if (event.cards.length) {
                  player.discard(event.cards).forceDie = true;
                }
              }
              'step 3'
              if (event.reserveOut) {
                game.broadcastAll(function (player, list) {
                  player.classList.add('out');
                  player.classList.add('scsOut');
                  if (!player.name2) player.smoothAvatar(false);
                  player.name1 = player.name;
                  player.smoothAvatar(false);
                  player.node.avatar.setBackgroundImage(`extension/EpicFX/asset/img/scs/${player.name}_dead.jpg`);
                  player.node.avatar.style.opacity = "0.3";
                  player.node.name.innerHTML = get.slimName(player.name);
                  delete player.name2;
                  player.smoothAvatar(true);
                  player.node.avatar2.classList.add('hidden');
                  player.classList.remove('fullskin2');
                  player.node.name2.innerHTML = '';
                  if (player == game.me && ui.fakeme) {
                    ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                  }
                  // if (list.contains(player.name1) || player.name1 == 'k_shichangshi') {
                  //   player.smoothAvatar(false);
                  //   player.node.avatar.setBackgroundImage(`extension/EpicFX/asset/img/scs/${player.name1}_dead.jpg`);
                  // }
                  // if (list.contains(player.name2) || player.name2 == 'k_shichangshi') {
                  //   player.smoothAvatar(true);
                  //   player.node.avatar2.setBackgroundImage(`extension/EpicFX/asset/img/scs/${player.name2}_dead.jpg`);
                  // }
                }, player, lib.skill.k_danggu.changshi.map(i => i[0]));
              }
              if (source && lib.config.border_style == 'auto' && (lib.config.autoborder_count == 'kill' || lib.config.autoborder_count == 'mix')) {
                switch (source.node.framebg.dataset.auto) {
                  case 'gold':
                  case 'silver':
                    source.node.framebg.dataset.auto = 'gold';
                    break;
                  case 'bronze':
                    source.node.framebg.dataset.auto = 'silver';
                    break;
                  default:
                    source.node.framebg.dataset.auto = lib.config.autoborder_start || 'bronze';
                }
                if (lib.config.autoborder_count == 'kill') {
                  source.node.framebg.dataset.decoration = source.node.framebg.dataset.auto;
                } else {
                  var dnum = 0;
                  for (var j = 0; j < source.stat.length; j++) {
                    if (source.stat[j].damage != undefined) dnum += source.stat[j].damage;
                  }
                  source.node.framebg.dataset.decoration = '';
                  switch (source.node.framebg.dataset.auto) {
                    case 'bronze':
                      if (dnum >= 4) source.node.framebg.dataset.decoration = 'bronze';
                      break;
                    case 'silver':
                      if (dnum >= 8) source.node.framebg.dataset.decoration = 'silver';
                      break;
                    case 'gold':
                      if (dnum >= 12) source.node.framebg.dataset.decoration = 'gold';
                      break;
                  }
                }
                source.classList.add('topcount');
              }
            },
            subSkill: {
              die: {
                audio: 'k_mowang',
                trigger: {player: 'phaseAfter'},
                forced: true,
                forceDie: true,
                content: function () {
                  'step 0'
                  if (lib.skill.k_danggu.isSingleShichangshi(player)) {
                    if (!player.getStorage('k_danggu').length) {
                      game.broadcastAll(function (player) {
                        player.name1 = player.name;
                        player.smoothAvatar(false);
                        // player.node.avatar.setBackground(player.name + '_dead', 'character');
                        player.node.avatar.setBackgroundImage(`extension/EpicFX/asset/img/scs/${player.name}_dead.jpg`);
                        player.node.name.innerHTML = get.slimName(player.name);
                        delete player.name2;
                        player.classList.remove('fullskin2');
                        player.node.avatar2.classList.add('hidden');
                        player.node.name2.innerHTML = '';
                        if (player == game.me && ui.fakeme) {
                          ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                        }
                      }, player);
                    }
                  }
                  if (!player.getStorage('k_danggu').length) {
                    game.delay();
                  }
                  'step 1'
                  player.die();
                },
              },
              return: {
                trigger: {player: 'phaseBefore'},
                forced: true,
                charlotte: true,
                silent: true,
                forceDie: true,
                forceOut: true,
                filter: function (event, player) {
                  return !event._k_mowang_return && event.player.isOut() && _status.k_mowang_return[event.player.playerid];
                },
                content: function () {
                  'step 0'
                  trigger._k_mowang_return = true;
                  // 重生特效
                  player.xz.style.display = null;
                  EpicFX.fuhuo.referNode = player;
                  dcdAnim.playSpine(EpicFX.fuhuo);
                  game.broadcastAll(function (player) {
                    player.classList.remove('out');
                    player.node.avatar.style.opacity = null;
                    player.node.hp.show();
                  }, trigger.player);
                                    game.log(trigger.player, '移回了游戏');
                                  if(player == game.me){
                  var wenzixiaoshi = document.getElementsByClassName('scswenzi')[0];          
               if (wenzixiaoshi) {
					wenzixiaoshi.parentNode.removeChild(wenzixiaoshi);
			//	ui.arena.removeChild(wenzixiaoshi);
							}
							}
                  delete _status.k_mowang_return[trigger.player.playerid];
                  trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
                  game.broadcastAll(function (player) {
                    if (player.name1 == 'k_shichangshi') {
                      player.smoothAvatar(false);
                      player.node.avatar.setBackground(player.name1, 'character');
                    }
                    if (player.name2 == 'k_shichangshi') {
                      player.smoothAvatar(true);
                      player.node.avatar2.setBackground(player.name2, 'character');
                    }
                  }, trigger.player);
                  'step 1'
                  event.trigger('restEnd');
                }
              },
              die2: {
                trigger: {player: 'dieBefore'},
                forced: true,
                direct: true,
                content: function () {
                  game.pause();
                  ui.scsPage.style.display = "block";
                  ui.scsPage.style.opacity = 1;
                  EpicFX.scs.over = !player.getStorage('k_danggu').length;
                  EpicFX.playSCSAnim(EpicFX.scs.name1, EpicFX.scs.name2);
                  player.scsDialog.zhu.innerHTML = '';
                  player.scsDialog.charZhu = null;
                  player.scsDialog.fu.innerHTML = '';
                  player.scsDialog.charFu = null;
                }
              }
            }
          },
          "k_tamo":{
            audio:2,
            trigger:{
              global:'phaseBefore',
              player:'enterGame',
            },
            firstDo:true,
            init: function (player) {
              player.storage.k_tamo_trunChanged = false;
            },
            filter:function(event,player){
              return (event.name!='phase'||game.phaseNumber==0) && !player.storage.k_tamo_trunChanged;
            },
            content:function(){
              let players = game.players.concat(game.dead);
              players.sort((a, b) => a.seat - b.seat);
              console.log(trigger);
              var slsDialog = new EpicFX.utils.slsDialog(players, player, event, trigger);
              player.slsDialog = slsDialog;
              game.pause();
              if (player != game.me || !event.isMine()) {
                slsDialog.app.style.display = "none";
                setTimeout(()=> {
                  slsDialog.auto();
                },1500);
              }
            }
          },
          "buff_30001": {
            trigger: {
              player: 'phaseUseBefore'
              // player: 'phaseUseBegin'
            },
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (EpicFX.servant.skillCanBeUsed(player == game.me)) {
                if (player["buff_30001"]) {
                  player["buff_30001"] = false;
                  return true;
                }
                return EpicFX.servant.probabilityOfBuff(1);
              } else return false;
            },
            content: function () {
              player.draw(2);
              if (player.buff && player.buff["buff_30001"]) {
                player.buff["buff_30001"].update();
              }
            }
          },
          "buff_30002": {
            trigger: {
              player: 'useCardToPlayered'
            },
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              if (event.card.name != 'sha') return false;
              var list = [];
              player.getHistory('gain', function (evt) {
                if (evt && evt.cards) {
                  for (var i = 0; i < evt.cards.length; i++) {
                    list.add(evt.cards[i]);
                  }
                }
              });
              return list.length >= player.hp && player.countUsed('sha') <= 1;
            },
            content: function () {
              var target = trigger.target;
              trigger.directHit.add(target);
              var id = target.playerid;
              var map = trigger.customArgs;
              if (!map[id]) map[id] = {};
              if (!map[id].extraDamage) map[id].extraDamage = 0;
              map[id].extraDamage++;
              if (player.buff && player.buff["buff_30002"]) {
                player.buff["buff_30002"].update();
              }
            }
          },
          "buff_30009": {
            trigger: {global: 'damageEnd'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (EpicFX.servant.skillCanBeUsed(player == game.me)) {
                return event.player.hasSex('male') && player.storage["buff_30009"] && EpicFX.servant.probabilityOfBuff(2);
              }
              return false;
            },
            content: function () {
              player.recover();
              player.draw();
              player.storage["buff_30009"] = false;
              if (player.buff && player.buff["buff_30009"]) {
                player.buff['buff_30009'].update();
              }
            },
            group: ['buff_30009_over'],
            subSkill: {
              over: {
                trigger: {global: ['roundStart']},
                popup: false,
                forced: true,
                charlotte: true,
                filter: function (event, player) {
                  if (EpicFX.servant.skillCanBeUsed(player == game.me)) {
                    return !player.storage["buff_30009"];
                  }
                  return false;
                },
                content: function () {
                  player.storage["buff_30009"] = true;
                }
              }
            }
          },
          "buff_30010": {
            trigger: {player: 'phaseDiscardEnd'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              return EpicFX.servant.skillCanBeUsed(player == game.me);
            },
            content: function () {
              player.draw(2);
              if (player.buff && player.buff["buff_30010"]) {
                player.buff['buff_30010'].update();
              }
            }
          },
          "buff_30003": {
            trigger: {player: 'dying'},
            forced: true,
            charlotte: true,
            init: function (player) {
              player["buff_30003"] = false;
            },
            filter: function (event, player) {
              if (player["buff_30003"]) return false;
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return EpicFX.servant.probabilityOfBuff(1);
            },
            content: function () {
              var num = 1 - player.hp;
              if (num) player.recover(num);
              player["buff_30003"] = true;
              if (player.buff && player.buff["buff_30003"]) {
                player.buff['buff_30003'].update();
              }
            }
          },
          // "buff_30004": {
          //   trigger: {
          //     target: "useCardToTargeted"
          //   },
          //   direct: true,
          //   charlotte: true,
          //   usable: 1,
          //   filter: function (event, player) {
          //     return event.target == player && get.type(event.card) == 'basic';
          //   },
          //   content: function () {
          //     player.getHistory('custom').push({"buff_30004": true, e: trigger.getParent()});
          //   },
          //   group: ['buff_30004_after'],
          //   subSkill: {
          //     after: {
          //       trigger: {
          //         global: ['useCardAfter']
          //       },
          //       direct: true,
          //       charlotte: true,
          //       usable: 1,
          //       filter: function (event, player) {
          //         var damage = player.getHistory('damage', function (evt) {
          //           return event.card && evt.card == event.card;
          //         }).length;
          //         var s = player.getHistory('custom', function (evt) {
          //           return evt["buff_30004"] && evt.e == event;
          //         }).length;
          //         return !damage && s;
          //       },
          //       content: function () {
          //         player.draw();
          //         player.logSkill('txhj_aleSkill1');
          //
          //         if (player.buff) {
          //           player.buff['txhj_aleSkill1'].update();
          //         }
          //       }
          //     }
          //   }
          // },
          "buff_30004": {
            trigger: {global: 'useCardAfter'},
            forced: true,
            charlotte: true,
            usable: 1,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              if (get.type(event.card) != 'basic') return false;
              let res1 = event.player.getHistory("useCard", function (evt) {
                return get.type(evt.card) == 'basic' && evt.targets.contains(player);
              });
              let res = event.player.getHistory("sourceDamage", function (evt) {
                return evt.card == event.card;
              });
              return res1.length == 1 && res.length == 0 && event.targets.contains(player) && EpicFX.servant.probabilityOfBuff(1);
            },
            content: function () {
              player.draw();
              if (player.buff && player.buff["buff_30004"]) {
                player.buff['buff_30004'].update();
              }
            }
          },
          "buff_30005": {
            trigger: {player: 'phaseZhunbeiBegin'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player.isDamaged() && !player.isMaxHp();
            },
            content: function () {
              player.recover();
              if (player.buff && player.buff["buff_30005"]) {
                player.buff['buff_30005'].update();
              }
            }
          },
          "buff_30006": {
            trigger: {
              player: "phaseUseEnd",
            },
            forced: true,
            filter: function (event, player, target) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return game.hasPlayer(function (target) {
                return target.isEnemiesOf(player) && target.countCards('h') < player.countCards('h');
              }) && EpicFX.servant.probabilityOfBuff(3);
            },
            content: function () {
              "step 0"
              var players = game.filterPlayer(function (current) {
                return current.countCards('h') <= player.countCards('h') && current.isEnemiesOf(player);
              });
              players.remove(player);
              event.players = players;
              player.line(players, 'green');
              "step 1"
              if (event.players.length) {
                var current = event.players.shift();
                current.damage(1, 'fire');
                if (player.buff && player.buff["buff_30006"]) {
                  player.buff['buff_30006'].update();
                }
                event.redo();
              }
            },
            ai: {
              threaten: 3.7,
            },
          },
          "buff_30007": {
            trigger: {
              player: ['phaseBegin', 'phaseEnd']
            },
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player.countCards('h') > 0;
            },
            forced: true,
            charlotte: true,
            content: function () {
              "step 0"
              event.numm = player.countCards('h') % 2;
              event.list1 = player.getEnemies().sortBySeat();
              event.list2 = player.getFriends().sortBySeat();
              "step 1"
              if (event.numm == 1 && event.list2.length) {
                var target = event.list2.randomGet(1);
                game.log('神妙·奇:随机令一名我方角色摸一张牌');
                player.line(target, 'green');
                target.draw();
              } else if (event.list1.length) {
                var target = event.list1.randomGet(1);
                game.log('神妙·偶:随机令一名敌方角色随机弃置一张牌');
                player.line(target, 'green');
                target.discard(target.getCards('he').randomGet());
              }
              if (player.buff && player.buff["buff_30007"]) {
                player.buff['buff_30007'].update();
              }
            },
          },
          "buff_30008": {
            trigger: {target: 'useCardToTargeted'},
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return get.type(event.card) == 'trick' && event.player != player;
            },
            forced: true,
            charlotte: true,
            content: function () {
              "step 0"
              player.judge(function (result) {
                if (get.color(result) == 'red') return 2;
                return -1;
              }).judge2 = function (result) {
                return result.bool;
              };
              "step 1"
              if (result.bool) {
                trigger.getParent().excluded.add(player);
                player.gain(trigger.parent.cards, "gain2");
                if (player.buff && player.buff["buff_30008"]) {
                  player.buff['buff_30008'].update();
                }
              }
            }
          },
          "buff_30011": {
            trigger: {target: 'useCardToTargeted'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return EpicFX.servant.probabilityOfBuff(1) && get.type(event.card) == 'trick' && event.player != player && event.targets.length == 1;
            },
            content: function () {
              "step 0"
              player.judge(function (result) {
                if (get.color(result) == 'black') return 2;
                return -1;
              }).judge2 = function (result) {
                return result.bool;
              };
              "step 1"
              if (result.bool) {
                trigger.targets.remove(player);
                trigger.getParent().triggeredTargets2.remove(player);
                trigger.untrigger();
                if (trigger.parent.card.name == "jiedao" && trigger.player.getEquip(1) == null) {
                  event.finish();
                }
                player.useCard(trigger.parent.card, trigger.player);
                if (player.buff && player.buff["buff_30011"]) {
                  player.buff['buff_30011'].update();
                }
              }
            }
          },
          "buff_30012": {
            trigger: {player: 'damageEnd'},
            usable: 1,
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.source && event.source != player && event.source.isAlive();
            },
            content: function () {
              player.useCard({name: 'sha', isCard: true}, trigger.source);
              if (player.buff && player.buff["buff_30012"]) {
                player.buff['buff_30012'].update();
              }
            },
            group: ['buff_30012_recover'],
            subSkill: {
              recover: {
                trigger: {source: 'damageAfter'},
                forced: true,
                popup: false,
                charlotte: true,
                filter: function (event, player) {
                  if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
                  return event.parent.parent.parent.name == 'buff_30012';
                },
                content: function () {
                  player.recover();
                  if (player.buff && player.buff["buff_30012"]) {
                    player.buff['buff_30012'].update();
                  }
                }
              }
            }
          },
          "buff_30013": {
            trigger: {source: 'damageEnd'},
            usable: 1,
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return true;
            },
            content: function () {
              "step 0"
              player.judge();
              "step 1"
              if (result.color == 'red') {
                player.draw(2);
              } else if (result.color == 'black') {
                player.gainPlayerCard(trigger.player, 'he', true);
              }
              if (player.buff && player.buff["buff_30013"]) {
                player.buff['buff_30013'].update();
              }
            }
          },
          "buff_30015": {
            trigger: {
              player: 'loseAfter',
              global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter']
            },
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              var evt = event.getl(player);
              return evt && evt.player == player && evt.es && evt.es.length > 0;
            },
            content: function () {
              "step 0"
              event.list = player.getEnemies().sortBySeat();
              "step 1"
              if (event.list.length) {
                var target = event.list.shift();
                target.damage();
                event.redo();
                if (player.buff && player.buff["buff_30015"]) {
                  player.buff['buff_30015'].update();
                }
              }
            },
          },
          "buff_30016": {
            trigger: {
              player: 'phaseDrawBegin2'
            },
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return !event.numFixed;
            },
            content: function () {
              trigger.num += player.countCards('e');
              if (player.buff && player.buff["buff_30016"]) {
                player.buff['buff_30016'].update();
              }
            },
            mod: {
              cardUsable: function (card, player, num) {
                if (EpicFX.servant.skillCanBeUsed(player == game.me) && card.name == 'sha') {
                  return num + player.countCards('e');
                }
              },
              maxHandcardBase: function (player, num) {
                if (EpicFX.servant.skillCanBeUsed(player == game.me)) {
                  return num + player.countCards('e');
                }
              }
            }
          },
          "buff_30019": {
            forced: true,
            charlotte: true,
            trigger: {global: 'phaseBegin'},
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player != event.player && EpicFX.servant.probabilityOfBuff(1);
            },
            content: function () {
              if (!trigger.player.storage.buff_30019_disable) trigger.player.storage.buff_30019_disable = [];
              trigger.player.storage.buff_30019_disable.push(player);
              trigger.player.addTempSkill('buff_30019_disable', 'phaseAfter');
            },
          },
          "buff_30019_disable": {
            trigger: {
              player: 'useCardToTarget'
            },
            priority: -7,
            filter: function (event, player) {
              return event.targets.length == 1 && event.targets.contains(player.storage.buff_30019_disable[0]) && get.type(event.card, "trick") == 'trick';
            },
            content: function () {
              trigger.excluded.add(player.storage.buff_30019_disable[0]);
              if (get.type(trigger.card, 'delay') == "delay") {
                var owner = get.owner(trigger.card);
                if (owner && owner.getCards('hej').contains(trigger.card)) owner.lose(trigger.card, ui.discardPile);
                else game.cardsDiscard(trigger.card);
                game.log(trigger.card, '进入了弃牌堆');
              }
              if (player.storage.buff_30019_disable[0].buff) {
                player.storage.buff_30019_disable[0].buff['buff_30019'].update();
              }
            },
            forced: true,
            onremove: true,
            charlotte: true,
            mark: true,
            marktext: "失",
            intro: {
              content: "本回合内对$使用锦囊牌会失效.",
            },
          },
          "buff_30020": {
            forced: true,
            charlotte: true,
            trigger: {global: 'useCard'},
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              if (player != _status.currentPhase || event.player == player) return false;
              let res = event.player.getHistory("useCard", function (evt) {
                return get.type(evt.card) != 'trick';
              });
              return res.length == 1;
            },
            content: function () {
              trigger.targets = [];
              trigger.all_excluded = true;
              if (player.buff && player.buff["buff_30020"]) {
                player.buff['buff_30020'].update();
              }
            }
          },
          "buff_30021": {
            forced: true,
            charlotte: true,
            trigger: {player: 'damageEnd'},
            init: function (player) {
              player.storage.buff_30021_count = 0;
            },
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.num > 0 && player.storage.buff_30021_count < 9;
            },
            content: function () {
              let count = (9 - player.storage.buff_30021_count) * trigger.num;
              player.draw(count);
              player.storage.buff_30021_count++;
              if (player.buff && player.buff["buff_30021"]) {
                player.buff['buff_30021'].update();
              }
            }
          },
          "buff_30017": {
            trigger: {
              global: "useCardAfter",
            },
            usable: 1,
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.player != player && get.type(event.card) == 'trick' && event.targets.contains(player) && event.player.getHistory("sourceDamage", function (evt) {
                return evt.card == event.card && evt.player == player;
              }).length == 0 && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function () {
              if (player.hp < player.maxHp) {
                player.recover();
                game.log(player, '发动【矢无虚发】回复了一点体力');
              } else {
                player.draw();
                game.log(player, '未受伤。摸了一张牌');
              }
              if (player.buff && player.buff["buff_30017"]) {
                player.buff['buff_30017'].update();
              }
            },
          },
          "buff_30018": {
            trigger: {player: 'phaseJieshuBegin'},
            forced: true,
            unique: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return game.hasPlayer(function (current) {
                return current != player && current.countCards('h');
              });
            },
            content: function () {
              "step 0"
              var players = game.filterPlayer(function (current) {
                return current != player && current.countCards('e') <= player.countCards('e');
              });
              event.players = players;
              player.line(players, 'green');
              "step 1"
              if (event.players.length) {
                var current = event.players.shift();
                var hs = current.getCards('h')
                if (hs.length) {
                  var card = hs.randomGet();
                  player.gain(card, current);
                  current.$giveAuto(card, player);
                }
                event.redo();
              }
              if (player.buff && player.buff["buff_30018"]) {
                player.buff['buff_30018'].update();
              }
            }
          },
          "buff_30024": {
            trigger: {player: 'damageEnd'},
            forced: true,
            unique: true,
            charlotte: true,
            usable: 1,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return _status.currentPhase != player && !event.nature && event.source && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function () {
              player.useCard({name: 'sha', nature: 'thunder', isCard: true}, trigger.source);
              if (player.buff && player.buff["buff_30024"]) {
                player.buff['buff_30024'].update();
              }
            }
          },
          "buff_30025": {
            trigger: {player: 'phaseAfter'},
            forced: true,
            unique: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              let count = 0;
              event["buff_30025"] = player.getEnemies();
              event["buff_30025"].forEach(e => {
                if (e.isDamaged()) count++;
              });
              return count;
            },
            content: function () {
              let len = trigger["buff_30025"].length;
              trigger["buff_30025"].forEach(e => {
                e.damage(len == 1 ? 2 : 1, 'thunder', player);
              });
              if (player.buff && player.buff["buff_30025"]) {
                player.buff['buff_30025'].update();
              }
            }
          },
          "buff_30026": {
            trigger: {source: 'damageEnd'},
            forced: true,
            unique: true,
            charlotte: true,
            usable: 1,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.player != player && event.nature == "thunder";
            },
            content: function () {
              player.recover();
              player.draw(2);
              if (player.buff && player.buff["buff_30026"]) {
                player.buff['buff_30026'].update();
              }
            }
          },
          "buff_30031": {
            trigger: {
              global: "recoverEnd",
            },
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return EpicFX.servant.probabilityOfBuff(2) && event.player != player && !player.isHealthy();
            },
            content: function () {
              player.recover();
              if (player.buff && player.buff["buff_30031"]) {
                player.buff['buff_30031'].update();
              }
            },
          },
          //蛇影
          "buff_30032": {
            trigger: {
              player: "loseAfter",
            },
            usable: 1,
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              if (event.name != 'lose' || event.type != 'discard') return false;
              var evt = event.getl(player);
              return evt && evt.player == player && evt.hs && evt.hs.length > 0;
            },
            content: function () {
              "step 0"
              player.draw(Math.ceil(trigger.getl(player).hs.length / 2));
              event.count = Math.ceil(trigger.getl(player).hs.length / 2);
              "step 1"
              event.list = player.getEnemies().sortBySeat();
              "step 2"
              if (event.list.length) {
                var target = event.list.shift();
                player.line(target, 'green');
                target.damage(1, true);
                event.count--;
                if (event.count > 0) {
                  event.redo();
                } else {
                  event.finish();
                }
              }
              if (player.buff && player.buff["buff_30032"]) {
                player.buff['buff_30032'].update();
              }
            },
          },
          //玄冥真主
          "buff_30033": {
            trigger: {
              target: "useCardToTargeted",
            },
            forced: true,
            charlotte: true,
            filter: function (event, player, card) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return get.number(event.card) <= player.countCards('h') && get.type(event.card, 'trick') == 'trick' && event.player != player && event.targets && event.targets.length;
            },
            content: function () {
              trigger.cancel();
              trigger.targets.remove(player);
              trigger.getParent().triggeredTargets2.remove(player);
              trigger.untrigger();
              if (player.buff && player.buff["buff_30033"]) {
                player.buff['buff_30033'].update();
              }
            },
          },
          "buff_30029": {
            trigger: {player: 'phaseBegin'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return EpicFX.servant.probabilityOfBuff(2);
            },
            content: function () {
              player.useCard({name: 'nanman'}, game.filterPlayer(function (current) {
                return current != player;
              }));
              if (player.buff && player.buff["buff_30029"]) {
                player.buff['buff_30029'].update();
              }
            },
            group: ['buff_30029_damage'],
            subSkill: {
              damage: {
                trigger: {global: 'damageAfter'},
                forced: true,
                charlotte: true,
                filter: function (event, player) {
                  if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
                  return event.card && event.card.name == "nanman" && player.getHistory('sourceDamage', function (evt) {
                    return evt.card == event.card;
                  }).length > 0;
                },
                content: function () {
                  player.draw(trigger.num);
                  if (player.buff && player.buff["buff_30029"]) {
                    player.buff['buff_30029'].update();
                  }
                }
              }
            }
          },
          "buff_30030": {
            trigger: {source: 'damageAfter'},
            usable: 1,
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.player.isAlive() && event.player.countCards("he") > 0;
            },
            content: function () {
              player.gainPlayerCard(trigger.player, 'he', true);
              if (player.buff && player.buff["buff_30030"]) {
                player.buff['buff_30030'].update();
              }
            }
          },
          "buff_30027": {
            trigger: {player: 'damageAfter'},
            usable: 1,
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return _status.currentPhase != player && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function () {
              player.draw(2);
              if (player.buff && player.buff["buff_30027"]) {
                player.buff['buff_30027'].update();
              }
            }
          },
          "buff_30028": {
            trigger: {player: 'gainAfter'},
            usable: 1,
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              let evt = event.getParent('phaseDraw');
              return Object.keys(evt).length == 0 && event.getg(player).length > 1;
            },
            content: function () {
              let players = [];
              player.getFriends().forEach(e => {
                if (!e.isHealthy()) players.push(e);
              });
              if (players.length) players.randomGet().recover();
              if (player.buff && player.buff["buff_30028"]) {
                player.buff['buff_30028'].update();
              }
            }
          },
          "buff_30034": {
            trigger: {player: 'phaseDrawEnd'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              event.gains = player.getHistory('gain', function (evt) {
                if (evt.getParent().name != 'draw' || evt.getParent('phaseDraw') != event) return false;
                return true;
              });
              return event.gains.length && event.gains[0].parent.num > 0 && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function () {
              player.draw(trigger.gains[0].parent.num);
              if (player.buff && player.buff["buff_30034"]) {
                player.buff['buff_30034'].update();
              }
            }
          },
          "buff_30035": {
            trigger: {source: 'damageEnd'},
            usable: 2,
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.nature == 'fire';
            },
            content: function () {
              player.recover();
              player.gainPlayerCard(trigger.player, 'he', true);
              if (player.buff && player.buff["buff_30035"]) {
                player.buff['buff_30035'].update();
              }
            }
          },
          "buff_30036": {
            trigger: {player: ['phaseUseBegin', 'phaseUseEnd']},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return true;
            },
            content: function () {
              player.useCard({name: 'huogong', isCard: true}, player.getEnemies().randomGet());
              if (player.buff && player.buff["buff_30036"]) {
                player.buff['buff_30036'].update();
              }
            }
          },
          "buff_30037": {
            trigger: {
              player: 'useCard',
              target: "useCardToTargeted"
            },
            usable: 4,
            forced: true,
            charlotte: true,
            init: function (player) {
              player.storage["buff_30037_count"] = 0;
            },
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              if (event.name == 'useCard') {
                return get.color(event.card) == "red" && EpicFX.servant.probabilityOfBuff(2);
              }
              return event.player != player && get.color(event.card) == "red" && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function () {
              player.draw(1).gaintag = ["buff_30037"];
              player.storage["buff_30037_count"]++;
              if (player.buff && player.buff["buff_30037"]) {
                player.buff['buff_30037'].update();
              }
            },
            group: ["buff_30037_damage"],
            subSkill: {
              damage: {
                trigger: {
                  player: 'gainAfter',
                },
                forced: true,
                charlotte: true,
                filter: function (event, player) {
                  if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
                  return player.storage["buff_30037_count"] >= 4;
                },
                content: function () {
                  let p = player.getEnemies().randomGet();
                  if (p) p.damage();
                  player.storage["buff_30037_count"] = 0;
                  if (player.buff && player.buff["buff_30037"]) {
                    player.buff['buff_30037'].update();
                  }
                }
              }
            }
          },
          "buff_30038": {
            trigger: {
              player: "dying"
            },
            forced: true,
            charlotte: true,
            init: function (player) {
              player.storage["buff_30038"] = false;
            },
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return !player.storage["buff_30038"];
            },
            content: function () {
              'step 0'
              var num = 1 - player.hp;
              if (num) player.recover(num);
              player.update();
              'step 1'
              player.addTempSkill("buff_30038_protected", {player: "phaseBegin"});
              player.storage["buff_30038"] = true;
            }
          },
          "buff_30038_protected": {
            trigger: {
              player: ['damageBegin3', 'loseHpBefore', 'recoverBefore']
            },
            forced: true,
            charlotte: true,
            mark: true,
            marktext: "保",
            intro: {
              content: '你不能失去/回复体力和受到伤害'
            },
            content: function () {
              trigger.cancel();
            },
          },
          "buff_30039": {
            trigger: {player: 'phaseEnd'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player.getStat('damage') && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function () {
              player.draw(1, true);
              if (player.buff && player.buff["buff_30039"]) {
                player.buff['buff_30039'].update();
              }
            },
          },
          "buff_30040": {
            trigger: {player: 'useCardToPlayered'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.card.name == 'sha' && EpicFX.servant.probabilityOfBuff(1);
            },
            content: function () {
              player.draw(1, true);
              if (player.buff && player.buff["buff_30040"]) {
                player.buff['buff_30040'].update();
              }
            },
          },
          "buff_30041": {
            trigger: {player: 'damageBegin4'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.num > 1;
            },
            content: function () {
              trigger.num--;
              if (player.buff && player.buff["buff_30041"]) {
                player.buff['buff_30041'].update();
              }
            },
          },
          "buff_30044": {
            trigger: {source: 'damageEnd'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return EpicFX.servant.probabilityOfBuff(1);
            },
            content: function () {
              player.recover();
              if (player.buff && player.buff["buff_30044"]) {
                player.buff['buff_30044'].update();
              }
            },
          },
          "buff_30045": {
            trigger: {player: 'damageEnd'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return true;
            },
            content: function () {
              player.gainMaxHp(1);
              if (player.buff && player.buff["buff_30045"]) {
                player.buff['buff_30045'].update();
              }
            },
          },
          "buff_30046": {
            trigger: {player: 'phaseEnd'},
            forced: true,
            charlotte: true,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player.getHistory("useCard", function (evt) {
                return get.number(evt.card);
              }).length;
            },
            content: function () {
              let evts = player.getHistory("useCard", function (evt) {
                return get.number(evt.card);
              });

              function sum(arr) {
                let evt = [...new Set(arr.map(obj => get.number(obj.card)))];
                return evt.length;
              }

              let num = sum(evts);
              player.draw(num);
              let enemies = player.getEnemies();
              if (enemies.length < num) num = enemies.length;
              for (let i = 0; i < num; i++) {
                enemies[i].damage(1, player);
              }
              if (player.buff && player.buff["buff_30046"]) {
                player.buff['buff_30046'].update();
              }
            },
          },
          "buff_30042": {
            trigger: {player: 'damageEnd'},
            forced: true,
            charlotte: true,
            usable: 1,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.num > 0 && EpicFX.servant.probabilityOfBuff(1);
            },
            content: function () {
              player.draw(trigger.num);
              if (player.buff && player.buff["buff_30042"]) {
                player.buff['buff_30042'].update();
              }
            },
          },
          "buff_30043": {
            trigger: {player: 'gainAfter'},
            forced: true,
            charlotte: true,
            usable: 2,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.getParent('draw').num >= 2;
            },
            content: function () {
              let friends = [];
              player.getFriends().forEach(e => {
                if (!e.isHealthy()) friends.push(e);
              });
              if (friends.length) friends.randomGet().recover();
              if (player.buff && player.buff["buff_30043"]) {
                player.buff['buff_30043'].update();
              }
            },
          },
          "buff_30047": {
            trigger: {
              global: 'addJudgeBefore',
            },
            forced: true,
            charlotte: true,
            usable: 1,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.player != player && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function () {
              player.getEnemies().randomGet().loseHp();
              if (player.buff && player.buff["buff_30047"]) {
                player.buff['buff_30047'].update();
              }
            },
          },
          "buff_30048": {
            trigger: {
              player: 'phaseEnd',
            },
            forced: true,
            charlotte: true,
            usable: 1,
            filter: function (event, player) {
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return true;
            },
            content: function () {
              player.drawTo((player.hp > 5 ? 5 : player.hp));
              if (player.buff && player.buff["buff_30048"]) {
                player.buff['buff_30048'].update();
              }
            },
          },
          "buff_30055": {
            usable:2,
            trigger:{
              player:'loseAfter',
              global:['equipAfter','addJudgeAfter','gainAfter','loseAsyncAfter','addToExpansionAfter'],
            },
            forced: true,
            charlotte: true,
            filter:function(event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              if(player==_status.currentPhase) return false;
              if(event.name=='gain'&&event.player==player) return false;
              var evt=event.getl(player);
              return evt&&evt.cards2&&evt.cards2.length>0 && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              if(_status.currentPhase.countGainableCards(player,'he')>0) player.gainPlayerCard(_status.currentPhase,'he',true);
            }
          },
          "buff_30056": {
            usable:1,
            trigger:{
              player:'gainAfter',
              global:'loseAsyncAfter',
            },
            forced: true,
            charlotte: true,
            filter:function(event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              var cards=event.getg(player);
              if(!cards.length) return false;
              return game.hasPlayer(current=>{
                return event.getl(current).cards2.length;
              });
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              "step 0"
              player.judge(function () {
                return 1;
              });
              "step 1"
              if (result.suit === "heart") {
                player.recover();
                player.gain(result.card,'gain2');
              } else {
                trigger.source.damage(player);
              }
            }
          },
          "buff_30057": {
            trigger:{
              player:'damageEnd',
              source:'damageSource',
            },
            forced:true,
            charlotte: true,
            init: function (player) {
              player.storage["buff_30057_use"] = 0;
              player.storage["buff_30057_draw"] = 0;
            },
            filter:function(event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player.storage["buff_30057_use"] < 2 && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              player.draw();
              player.storage["buff_30057_use"]++;
              player.storage["buff_30057_draw"]++;
            },
            group: ["buff_30057_twodraw", "buff_30057_clear"],
            subSkill: {
              twodraw: {
                forced:true,
                charlotte: true,
                trigger:{
                  player:'gainAfter',
                },
                filter:function(event,player){
                  return event.parent.parent.name == "buff_30057" && player.storage["buff_30057_draw"] >= 2 && EpicFX.servant.skillCanBeUsed(player == game.me);
                },
                content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                  player.recover();
                  player.storage["buff_30057_draw"] = 0;
                }
              },
              clear: {
                trigger:{global:'roundStart'},
                forced:true,
                charlotte: true,
                content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                  player.storage["buff_30057_use"] = 0;
                }
              }
            }
          },
          "buff_30058" : {
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            charlotte:true,
            filter:function (event,player){
              return EpicFX.servant.skillCanBeUsed(player == game.me);
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              player.draw(2);
              if (player.isHealthy()) {
                let cards1 = player.getCards('j');
                if (cards1.length) {
                  player.discard(cards1, player, true);
                }
              }
            }
          },
          "buff_30061": {
            trigger:{global:'phaseZhunbeiBegin'},
            forced:true,
            charlotte:true,
            filter:function(event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player!=event.player && EpicFX.servant.probabilityOfBuff(2);
            },
            logTarget:'player',
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              player.useCard({name:'sha'},trigger.player).logSkill='buff_30061';
            }
          },
          "buff_30062": {
            usable:1,
            trigger:{
              player:"useCard2",
            },
            forced:true,
            charlotte:true,
            filter:function (event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player.getHistory('useCard',function(evtx){
                return evtx.card && evtx.card.name === "sha";
              },event).length === 1;
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              trigger.baseDamage++;
            }
          },
          "buff_30063": {
            trigger:{
              source:'damageSource',
            },
            forced:true,
            charlotte:true,
            init: function (player) {
              player.storage["buff_30063_drawCount"] = 0;
            },
            filter:function (event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return event.card&&event.card.name=='sha'&&player.storage["buff_30063_drawCount"] < 5;
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              player.draw(player.getHistory("useCard",function (evt) {
                return evt.card && evt.card.name === "sha";
              }).length);
              player.storage["buff_30063_drawCount"]++;
            },
            group: ["buff_30063_clear"],
            subSkill: {
              clear: {
                trigger:{global:'phaseEnd'},
                forced:true,
                charlotte:true,
                filter:function (event,player){
                  return EpicFX.servant.skillCanBeUsed(player == game.me);
                },
                content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                  player.storage["buff_30063_drawCount"] = 0;
                }
              }
            }
          },
          "buff_30068": {
            trigger:{player:'dying'},
            forced:true,
            charlotte:true,
            init: function (player) {
              player.storage["buff_30068_count"] = 0;
            },
            filter:function(event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              return player.storage["buff_30068_count"] === 0 && EpicFX.servant.probabilityOfBuff(2);
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              player.recover(player.maxHp);
              player.storage["buff_30068_count"]++;
            }
          },
          "buff_30069": {
            mod:{
              maxHandcardBase:function(player,num){
                return player.maxHp;
              },
            },
            trigger:{player:'useCardAfter'},
            forced:true,
            charlotte:true,
            filter:function(event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              if(_status.currentPhase!=player) return false;
              let type=get.type(event.card,'trick');
              return EpicFX.servant.probabilityOfBuff(2) && player.getHistory('custom',function(evt){
                return evt["buff_30069_name"]==type;
              }).length==0;
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              "step 0"
              player.loseHp();
              "step 1"
              player.draw(Math.min(player.getDamagedHp(), 9));
              player.getHistory('custom').push({"buff_30069_name":get.type(trigger.card,'trick')});
            }
          },
          "buff_30070": {
            trigger:{global:'phaseAfter'},
            forced:true,
            charlotte:true,
            filter:function(event,player){
              if (!EpicFX.servant.skillCanBeUsed(player == game.me)) return false;
              let arr = [];
              let e = player.getHistory("lose",function (evt) {
                let r = evt.getParent("phaseDiscard");
                if (Object.keys(r).length === 0) {
                  arr.addArray(evt.cards2);
                  return 1;
                } else return 0;
              });
              let res = arr.length > player.hp;
              if (res) {
                event.drawNum = arr.length;
              }
              return res;
            },
            content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
              player.draw(trigger.drawNum);
            }
          }
        }
};
}
