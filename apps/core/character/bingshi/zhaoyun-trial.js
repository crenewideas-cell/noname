import { lib, game, ui, get, ai, _status } from "noname";

// Imported from 势赵云体验.zip; author: 体验版.
const skills = {
                    szty_wuyi: {
                        audio: 'character/bingshi/assets/zhaoyun-trial:6',
                        trigger: { player: ['useCard', 'respond'] }, forced: true,
                        init: function (player) { if (!player.storage.szty_wuyi) player.storage.szty_wuyi = []; },
                        count: function (player) { return (player.storage.szty_wuyi || []).length; },
                        fromHand: function (event, player) {
                            if (!event.cards || !event.cards.length) return false;
                            // 转化牌须有实际从手牌区支出的素材；不把纯虚拟牌计入。
                            return player.getHistory('lose', function (evt) {
                                return evt.getParent() == event && evt.hs && evt.hs.some(function (card) { return event.cards.indexOf(card) >= 0; });
                            }).length > 0;
                        },
                        filter: function (event, player) {
                            return get.type(event.card) == 'basic' &&
                                (player.storage.szty_wuyi || []).indexOf(get.name(event.card)) < 0 &&
                                lib.skill.szty_wuyi.fromHand(event, player);
                        },
                        content: function () {
                            if (!player.storage.szty_wuyi) player.storage.szty_wuyi = [];
                            player.storage.szty_wuyi.add(get.name(trigger.card));
                            player.syncStorage('szty_wuyi');
                            player.markSkill('szty_wuyi');
                            if (lib.skill.szty_wuyi.count(player) >= 4) player.addSkill('szty_wuyi_balance');
                        },
                        mark: true, marktext: '翊',
                        intro: { content: function (storage, player) {
                            var names = player.storage.szty_wuyi || [];
                            return '本局已记录：' + (names.length ? get.translation(names) : '无') + '<br>已解锁 ' + Math.min(4, names.length) + ' 档效果';
                        } },
                        group: ['szty_wuyi_virtual', 'szty_wuyi_unlock', 'szty_beauty_cards'],
                        mod: {
                            cardUsable: function (card, player) { if (lib.skill.szty_wuyi.count(player) >= 2 && get.type(card) == 'basic') return Infinity; },
                            targetInRange: function (card, player) { if (lib.skill.szty_wuyi.count(player) >= 3 && get.type(card) == 'basic') return true; },
                            maxHandcardBase: function (player) { if (lib.skill.szty_wuyi.count(player) >= 4) return 4; }
                        },
                        subSkill: {
                            unlock: {
                                trigger: { player: ['useCardAfter', 'respondAfter'] }, forced: true, silent: true,
                                filter: function (event, player) { return lib.skill.szty_wuyi.count(player) >= 4 && player.countCards('h') != 4; },
                                content: function () { lib.skill.szty_wuyi_balance.adjust(player); }
                            },
                            virtual: {
                                audio: 'szty_wuyi', enable: ['chooseToUse', 'chooseToRespond'],
                                canActivate: function (player) { return lib.skill.szty_wuyi.count(player) >= 1 && player.storage.szty_wuyi_round != game.roundNumber; },
                                filter: function (event, player) {
                                    return lib.skill.szty_wuyi_virtual.canActivate(player) && ['sha', 'shan'].some(function (name) { return event.filterCard({name: name, isCard: true}, player, event); });
                                },
                                chooseButton: {
                                    dialog: function (event, player) {
                                        var list = ['sha', 'shan'].filter(function (name) { return event.filterCard({name: name, isCard: true}, player, event); });
                                        return ui.create.dialog('武翊：每轮可虚拟使用或打出一次杀／闪', [list.map(function (name) { return ['基本', '', name]; }), 'vcard']);
                                    },
                                    check: function (button) { return _status.event.player.getUseValue({name: button.link[2]}); },
                                    backup: function (links) {
                                        return {
                                            audio: 'szty_wuyi', filterCard: function () { return false; }, selectCard: -1,
                                            viewAs: {name: links[0][2], isCard: true},
                                            onuse: function (result, player) { player.storage.szty_wuyi_round = game.roundNumber; },
                                            onrespond: function (result, player) { player.storage.szty_wuyi_round = game.roundNumber; }
                                        };
                                    },
                                    prompt: function (links) { return '武翊：视为使用或打出【' + get.translation(links[0][2]) + '】'; }
                                },
                                hiddenCard: function (player, name) { return ['sha', 'shan'].indexOf(name) >= 0 && lib.skill.szty_wuyi_virtual.canActivate(player); },
                                ai: { order: 3, respondSha: true, respondShan: true, skillTagFilter: function (player) { return lib.skill.szty_wuyi_virtual.canActivate(player); }, result: {player: 1} }
                            }
                        }
                    },
                    szty_beauty_cards: {
                        trigger: { player: ['useCard', 'respond'] },
                        forced: true, silent: true, popup: false, charlotte: true,
                        filter: function (event) { return event.card && ['sha', 'shan'].indexOf(get.name(event.card)) !== -1; },
                        content: function () {
                            if (window.sztyBeauty) window.sztyBeauty.card(trigger);
                            else (window.sztyBeautyPending || (window.sztyBeautyPending = [])).push(trigger);
                        }
                    },
                    szty_wuyi_balance: {
                        trigger: { global: ['gainAfter', 'loseAfter', 'loseAsyncAfter', 'equipAfter', 'addToExpansionAfter'] },
                        forced: true, silent: true, charlotte: true,
                        filter: function (event, player) { return player.isIn() && player.hasSkill('szty_wuyi') && lib.skill.szty_wuyi.count(player) >= 4 && player.countCards('h') != 4; },
                        adjust: function (player) {
                            var num = player.countCards('h');
                            if (num < 4) player.draw(4 - num);
                            else if (num > 4) player.chooseToDiscard('h', num - 4, true, '武翊：将手牌弃至四张');
                        },
                        content: function () { lib.skill.szty_wuyi_balance.adjust(player); }
                    },
                    szty_cuifeng: {
                        audio: 'character/bingshi/assets/zhaoyun-trial:4',
                        trigger: { global: 'phaseEnd' }, direct: true,
                        used: function (player) { return player.storage.szty_cuifeng_round == game.roundNumber ? (player.storage.szty_cuifeng_used || 0) : 0; },
                        filter: function (event, player) {
                            return event.player != player && event.player.isIn() && lib.skill.szty_cuifeng.used(player) < 2 && player.canUse({name:'juedou',isCard:true},event.player);
                        },
                        content: function () {
                            'step 0';
                            event.x = player.storage.szty_cuifeng_sha || 0;
                            player.chooseBool('摧锋：是否对' + get.translation(trigger.player) + '使用伤害值为' + (1 + event.x) + '的【决斗】？').set('ai', function () {
                                var evt = _status.event.getParent();
                                return get.effect(evt._trigger.player, {name:'juedou'}, _status.event.player, _status.event.player) > 0;
                            });
                            'step 1';
                            if (!result.bool || !trigger.player.isIn() || !player.canUse({name:'juedou',isCard:true},trigger.player)) { event.finish(); return; }
                            player.logSkill('szty_cuifeng', trigger.player);
                            var used = lib.skill.szty_cuifeng.used(player);
                            player.storage.szty_cuifeng_round = game.roundNumber;
                            player.storage.szty_cuifeng_used = used + 1;
                            var next = player.useCard({name:'juedou',isCard:true}, trigger.player);
                            next.baseDamage = 1 + event.x;
                        },
                        group: ['szty_cuifeng_count', 'szty_cuifeng_reset'],
                        subSkill: {
                            count: {
                                trigger: { global: 'respond' }, forced: true, silent: true,
                                filter: function (event) { return get.name(event.card) == 'sha'; },
                                content: function () { player.storage.szty_cuifeng_sha = (player.storage.szty_cuifeng_sha || 0) + 1; }
                            },
                            reset: {
                                trigger: { global: 'phaseBefore' }, forced: true, silent: true, firstDo: true, priority: 100,
                                content: function () { player.storage.szty_cuifeng_sha = 0; }
                            }
                        }
                    }
                };

let mounted = false;
export function mountEffects() {
 if (mounted || typeof document === 'undefined') return;
 mounted = true;
 window.sztyBeautyPending = [];
 lib.init.css(lib.assetURL + 'character/bingshi/assets/zhaoyun-trial/beauty/', 'theme');
 lib.init.js(lib.assetURL + 'character/bingshi/assets/zhaoyun-trial/beauty/', 'main', () => window.sztyMountBeauty?.(lib, game, ui, get, _status));
 lib.onover.push(() => { mounted = false; window.sztyBeautyPending = []; });
}

skills.szty_wuyi.audio = ["character/bingshi/assets/zhaoyun-trial/szty_wuyi1.mp3","character/bingshi/assets/zhaoyun-trial/szty_wuyi2.mp3","character/bingshi/assets/zhaoyun-trial/szty_wuyi3.mp3","character/bingshi/assets/zhaoyun-trial/szty_wuyi4.mp3","character/bingshi/assets/zhaoyun-trial/szty_wuyi5.mp3","character/bingshi/assets/zhaoyun-trial/szty_wuyi6.mp3"];

skills.szty_cuifeng.audio = ["character/bingshi/assets/zhaoyun-trial/szty_cuifeng1.mp3","character/bingshi/assets/zhaoyun-trial/szty_cuifeng2.mp3","character/bingshi/assets/zhaoyun-trial/szty_cuifeng3.mp3","character/bingshi/assets/zhaoyun-trial/szty_cuifeng4.mp3"];

const originalInit = skills.szty_wuyi.init;
skills.szty_wuyi.init = function(player) { originalInit?.(player); mountEffects(); };

export { skills };
export const characters = { szty_zhaoyun: {
  "sex": "male",
  "group": "shu",
  "hp": 4,
  "skills": [
    "szty_wuyi",
    "szty_cuifeng"
  ],
  "img": "character/bingshi/assets/zhaoyun-trial/ex_shi_zhaoyun.png",
  "dieAudios": [
    "character/bingshi/assets/zhaoyun/audio/die/hy_zhaoyun.mp3"
  ]
} };
export const translates = { ...{
                    szty_wuyi: '武翊', szty_wuyi_virtual: '武翊', szty_wuyi_balance: '武翊',
                    szty_wuyi_info: '若你从手牌使用或打出过的基本牌名数大于等于：1.每轮限一次，你可视为使用一张【杀】或【闪】；2.你使用基本牌无次数限制；3.你使用基本牌无距离限制；4.你的手牌数始终为4。',
                    szty_cuifeng: '摧锋',
                    szty_cuifeng_info: '每轮限两次，每回合结束时，你可视为对当前回合角色使用一张伤害值+X的【决斗】（X为本回合所有角色打出【杀】的次数）。'
                }, szty_zhaoyun: "势赵云·体验", szty_zhaoyun_prefix: '势' };
