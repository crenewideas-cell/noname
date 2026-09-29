import { lib, game, ui, get, ai, _status } from "noname";

// Imported from 势赵云.zip; author: 皓月.
const skills = {
            "hy_wuyi":{
                audio: "character/bingshi/assets/zhaoyun/audio:6",
                marktext:"武翊",
                "_updateMark":function (player) {
                    if (!player.marks || !player.marks.hy_wuyi) player.markSkill('hy_wuyi');
                    var markNode = player.marks && player.marks.hy_wuyi;
                    if (!markNode) return;
                    var names = player.storage._szy_wy_names || [];
                    var count = names.length > 4 ? 4 : names.length;
                    var host = player.node.avatar || player.node;
                    if (!host) return;

                    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

                    var layer = host.querySelector && host.querySelector('.szy-mark-layer');
                    if (!layer) {
                        layer = document.createElement('div');
                        layer.className = 'szy-mark-layer';
                        host.appendChild(layer);
                    }

                    markNode.style.display = 'none';

                    var icon = layer.querySelector('.szy-mark-img');
                    if (count > 0) {
                        var url = String(lib.assetURL || '') + 'character/bingshi/assets/zhaoyun/image/jnmb_szy_icon' + count + '.png';
                        if (!icon) {
                            icon = document.createElement('img');
                            icon.className = 'szy-mark-img';
                            icon.draggable = false;
                            layer.appendChild(icon);
                        }
                        if (icon.src != url) icon.src = url;
                        icon.style.display = '';

                        // ================= 图标位置与大小（改这里） =================
                        var ICON_LEFT  = -8;   // 左右：正数向右
                        var ICON_TOP   = 20;   // 上下：正数向下
                        var ICON_SCALE = 0.8;    // 缩放：1 为原大小
                        // ===========================================================
                        icon.style.position = 'absolute';
                        icon.style.left = ICON_LEFT + 'px';
                        icon.style.top = ICON_TOP + 'px';
                        icon.style.transform = 'scale(' + ICON_SCALE + ')';
                        icon.style.transformOrigin = 'left top';
                        icon.style.pointerEvents = 'none';
                    } else {
                        if (icon) icon.style.display = 'none';
                    }
                },
                // 停掉单次特效(狂放达)
                "_frameStopOnce":function (player) {
                    if (!player) return;
                    if (player._szytx_frameOnce) {
                        try { dcdAnim.stopSpine(player._szytx_frameOnce); } catch (e) {}
                        player._szytx_frameOnce = null;
                    }
                },
                // 停掉循环特效(狂离子)
                "_frameStopLoop":function (player) {
                    if (!player) return;
                    if (player.storage && player.storage._szytx_kuanglizi) {
                        try { dcdAnim.stopSpine(player.storage._szytx_kuanglizi); } catch (e) {}
                        delete player.storage._szytx_kuanglizi;
                    }
                },
                // 收尾：死亡 / 换局时清掉特效与外围浮层
                "_frameStopAll":function (player) {
                    if (!player) return;
                    lib.skill.hy_wuyi._frameStopOnce(player);
                    lib.skill.hy_wuyi._frameStopLoop(player);
                    if (lib.skill.hy_wuyi_handArea && lib.skill.hy_wuyi_handArea.stop) {
                        try { lib.skill.hy_wuyi_handArea.stop(player); } catch (e) {}
                    }
                    if (typeof window.szyFrameRemove === 'function') {
                        try { window.szyFrameRemove(player); } catch (e) {}
                    }
                },
                intro:{
                    name:"【武翊】已记录",
                    content:function (storage, player) {
                        var names = player.storage._szy_wy_names;
                        if (!names || !names.length) return '尚未从手牌使用或打出过基本牌';
                        return '已记录基本牌名：' + get.translation(names);
                    },
                },
                group:["hy_wuyi_count","hy_wuyi_use","hy_wuyi_limit","hy_wuyi_range","hy_wuyi_hand","hy_wuyi_effect","hy_wuyi_effect_shan","hy_wuyi_handArea"],
                subSkill:{
                    count:{
                        sub:true,
                        parentskill:"hy_wuyi",
                        charlotte:true,
                        forced:true,
                        silent:true,
                        trigger:{
                            player:["loseAfter","loseAsyncAfter"],
                        },
                        filter:function (event, player) {
                            if (!event.getl) return false;
                            var evt = event.getParent('useCard');
                            if (!evt) evt = event.getParent('respond');
                            if (!evt || evt.player != player) return false;
                            var getl = event.getl(player);
                            if (!getl || !getl.hs || !getl.hs.length) return false;
                            for (var i = 0; i < getl.hs.length; i++) {
                                if (get.type(getl.hs[i]) == 'basic') return true;
                            }
                            return false;
                        },
                        content:function () {
                            if (!player.storage._szy_wy_names) player.storage._szy_wy_names = [];
                            var names = player.storage._szy_wy_names;
                            var getl = trigger.getl(player);
                            if (!getl || !getl.hs) return;
                            var added = false;
                            for (var i = 0; i < getl.hs.length; i++) {
                                var card = getl.hs[i];
                                if (get.type(card) != 'basic') continue;
                                if (names.indexOf(card.name) >= 0) continue;
                                names.push(card.name);
                                added = true;
                            }
                            if (!added) return;
                            player.syncStorage('_szy_wy_names');
                            lib.skill.hy_wuyi._updateMark(player);
                            game.log(player, '「武翊」记录', get.translation(names), '（', names.length, '种）');

                            // ★ 每次记录：武将牌上播放一次 SS_szy_kuangfangda
                            var rawKF = window.szytx && window.szytx.SS_szy_kuangfangda;
                            if (window.dcdAnim && rawKF && rawKF.name) {
                                dcdAnim.loadSpine(rawKF.name, "skel", function() {
                                    // ================= kuangfangda 位置与大小（改这里） =================
                                    var KF_X     = 40;    // 左右：正数向右
                                    var KF_Y     = 85;    // 上下：正数向下
                                    var KF_SCALE = 0.8;   // 缩放：1 为原大小
                                    // =================================================================
                                    var sp = dcdAnim.playSpine(rawKF, {
                                        parent: player.node && (player.node.avatar || player.node),
                                        scale: KF_SCALE,
                                        x: KF_X,
                                        y: KF_Y,
                                    });
                                    player._szytx_frameOnce = sp;
                                });
                            }

                            // ★ 集齐 4 种：武将牌上循环播放 SS_szy_kuanglizi
                            if (names.length >= 4) {
                                var rawKL = window.szytx && window.szytx.SS_szy_kuanglizi;
                                if (window.dcdAnim && rawKL && rawKL.name) {
                                    dcdAnim.loadSpine(rawKL.name, "skel", function() {
                                        if (player.storage._szytx_kuanglizi) {
                                            dcdAnim.stopSpine(player.storage._szytx_kuanglizi);
                                        }
                                        // ================= kuanglizi 位置与大小（改这里） =================
                                        var KL_X     = 40;    // 左右：正数向右
                                        var KL_Y     = 85;    // 上下：正数向下
                                        var KL_SCALE = 0.8;   // 缩放：1 为原大小
                                        // ===============================================================
                                        player.storage._szytx_kuanglizi = dcdAnim.playSpine({
                                            ...rawKL,
                                            loop: true,
                                        }, {
                                            parent: player.node && (player.node.avatar || player.node),
                                            loop: true,
                                            scale: KL_SCALE,
                                            x: KL_X,
                                            y: KL_Y,
                                        });
                                    });
                                }
                                lib.skill.hy_wuyi_handArea.start(player);
                            }
                        },
                        popup:false,
                    },
                    use:{
                        sub:true,
                        parentskill:"hy_wuyi",
                        charlotte:true,
                        enable:["chooseToUse","chooseToRespond"],
                        filter:function (event, player) {
                            if (player.storage._szy_wy_round == game.roundNumber) return false;
                            if (!player.storage._szy_wy_names || player.storage._szy_wy_names.length < 1) return false;
                            if (event.filterCard({ name: 'sha', isCard: true }, player, event)) return true;
                            if (event.filterCard({ name: 'shan', isCard: true }, player, event)) return true;
                            return false;
                        },
                        chooseButton:{
                            dialog:function (event, player) {
                                var list = [];
                                if (event.filterCard({ name: 'sha', isCard: true }, player, event)) {
                                    list.push(['基本', '', 'sha']);
                                    for (var i = 0; i < lib.inpile_nature.length; i++) {
                                        var nature = lib.inpile_nature[i];
                                        if (event.filterCard({ name: 'sha', nature: nature, isCard: true }, player, event)) {
                                            list.push(['基本', '', 'sha', nature]);
                                        }
                                    }
                                }
                                if (event.filterCard({ name: 'shan', isCard: true }, player, event)) list.push(['基本', '', 'shan']);
                                var dlg = ui.create.dialog('武翊', [list, 'vcard']);
                                dlg._shoushaVertical = true;
                                dlg._shoushaOnlyUsable = true;
                                dlg._shoushaHideOk = true;
                                return dlg;
                            },
                            check:function (button) {
                                var player = _status.event.player;
                                if (_status.event.type == 'phase') return player.getUseValue({ name: button.link[2], nature: button.link[3], isCard: true });
                                return 1;
                            },
                            backup:function (links, player) {
                                return {
                                    viewAs: {
                                        name: links[0][2],
                                        nature: links[0][3],
                                        isCard: true,
                                    },
                                    filterCard: function () {
                                        return false;
                                    },
                                    selectCard: -1,
                                    popname: true,
                                    precontent: function () {
                                        player.logSkill('hy_wuyi');
                                        player.storage._szy_wy_round = game.roundNumber;
                                        player.syncStorage('_szy_wy_round');
                                        lib.skill.hy_wuyi._updateMark(player);
                                    },
                                };
                            },
                            prompt:function (links, player) {
                                return '请选择' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '的目标';
                            },
                        },
                        ai:{
                            respondSha:true,
                            respondShan:true,
                            order:12,
                            result:{
                                player:1,
                            },
                            skillTagFilter:function (player, tag) {
                                if (player.storage._szy_wy_round == game.roundNumber) return false;
                                return player.storage._szy_wy_names && player.storage._szy_wy_names.length >= 1;
                            },
                        },
                    },
                    limit:{
                        sub:true,
                        parentskill:"hy_wuyi",
                        charlotte:true,
                        silent:true,
                        mod:{
                            cardUsable:function (card, player, num) {
                                if (!player.storage._szy_wy_names || player.storage._szy_wy_names.length < 2) return;
                                if (get.type(card) != 'basic') return;
                                return Infinity;
                            },
                        },
                        forced:true,
                        popup:false,
                    },
                    range:{
                        sub:true,
                        parentskill:"hy_wuyi",
                        charlotte:true,
                        silent:true,
                        mod:{
                            targetInRange:function (card, player, target) {
                                if (!player.storage._szy_wy_names || player.storage._szy_wy_names.length < 3) return;
                                if (get.type(card) != 'basic') return;
                                return true;
                            },
                        },
                        forced:true,
                        popup:false,
                    },
                    hand:{
                        sub:true,
                        parentskill:"hy_wuyi",
                        charlotte:true,
                        forced:true,
                        silent:true,
                        trigger:{
                            player:["loseAfter","loseAsyncAfter"],
                            global:["equipAfter","addJudgeAfter","gainAfter","addToExpansionAfter"],
                        },
                        filter:function (event, player) {
                            if (!player.storage._szy_wy_names || player.storage._szy_wy_names.length < 4) return false;
                            if (event.name == 'gain' && event.player == player) return player.countCards('h') != 4;
                            if (event.name == 'equip' || event.name == 'addJudge' || event.name == 'addToExpansion') return player.countCards('h') != 4;
                            if (!event.getl) return false;
                            var evt = event.getl(player);
                            if (!evt || !evt.hs || !evt.hs.length || player.countCards('h') == 4) return false;
                            var evtx = event;
                            for (var i = 0; i < 4; i++) {
                                evtx = evtx.getParent('hy_wuyi_hand');
                                if (evtx.name != 'hy_wuyi_hand') return true;
                            }
                            return false;
                        },
                        content:function () {
                            var num = 4 - player.countCards('h');
                            if (num > 0) player.draw(num);
                            else player.chooseToDiscard('h', true, -num);
                        },
                        popup:false,
                    },
                    effect:{
                        sub:true,
                        parentskill:"hy_wuyi",
                        charlotte:true,
                        forced:true,
                        silent:true,
                        popup:false,
                        trigger:{
                            player:["useCard"],
                        },
                        filter:function (event, player) {
                            var card = event.card;
                            if (!card) return false;
                            if (card.name == 'sha') return true;
                            if (event.cards && event.cards.length) {
                                for (var i = 0; i < event.cards.length; i++) {
                                    if (event.cards[i] && event.cards[i].name == 'sha') return true;
                                }
                            }
                            return false;
                        },
                        content:function () {
                            var card = trigger.card;
                            if (!card) return;
                            var nature = card.nature;
                            if (!nature && card.cards && card.cards.length) {
                                for (var i = 0; i < card.cards.length; i++) {
                                    if (card.cards[i] && card.cards[i].nature) {
                                        nature = card.cards[i].nature;
                                        break;
                                    }
                                }
                            }
                            if (!nature && trigger.cards && trigger.cards.length) {
                                for (var j = 0; j < trigger.cards.length; j++) {
                                    if (trigger.cards[j] && trigger.cards[j].nature) {
                                        nature = trigger.cards[j].nature;
                                        break;
                                    }
                                }
                            }
                            var key = 'SS_szy_sha';
                            if (nature == 'thunder') key = 'SS_szy_sha2';
                            else if (nature == 'fire') key = 'SS_szy_sha3';
                            var data = window.szytx && window.szytx[key];
                            if (!window.dcdAnim || !data || !data.name) return;
                            dcdAnim.loadSpine(data.name, "skel", function() {
                                dcdAnim.playSpine(data, {
                                    parent: document.body,
                                    speed: 1,
                                    scale: lib.device ? 0.9 : 1,
                                });
                            });
                        },
                    },
                    effect_shan:{
                        sub:true,
                        parentskill:"hy_wuyi",
                        charlotte:true,
                        forced:true,
                        silent:true,
                        popup:false,
                        trigger:{
                            global:["useCard"],
                        },
                        filter:function (event, player) {
                            if (!event.card || event.card.name != 'shan') return false;
                            var responder = event.player;
                            if (!responder) return false;
                            if (responder.hasSkill('hy_wuyi')) return true;
                            var shaEvt = null;
                            var evt = event.getParent('useCard');
                            while (evt) {
                                if (evt.card && evt.card.name == 'sha') {
                                    shaEvt = evt;
                                    break;
                                }
                                evt = evt.getParent('useCard');
                            }
                            if (!shaEvt) return false;
                            var source = shaEvt.player;
                            if (!source || !source.hasSkill('hy_wuyi')) return false;
                            if (!shaEvt.targets || shaEvt.targets.indexOf(responder) < 0) return false;
                            return true;
                        },
                        content:function () {
                            var data = window.szytx && window.szytx.SS_szy_shan;
                            if (!window.dcdAnim || !data || !data.name) return;
                            dcdAnim.loadSpine(data.name, "skel", function() {
                                dcdAnim.playSpine(data, {
                                    parent: document.body,
                                    speed: 1,
                                    scale: lib.device ? 0.9 : 1,
                                });
                            });
                        },
                    },
                    handArea:{
                        sub:true,
                        parentskill:"hy_wuyi",
                        charlotte:true,
                        forced:true,
                        silent:true,
                        popup:false,
                        trigger:{
                            global:["gameStart","dieAfter","gainAfter","loseAfter"],
                        },
                        filter:function (event, player) {
                            if (event.name == 'dieAfter') return event.player == player;
                            return true;
                        },
                        content:function () {
                            if (trigger.name == 'dieAfter') {
                                lib.skill.hy_wuyi_handArea.stop(player);
                                return;
                            }
                            game.delay(0, 10);
                            lib.skill.hy_wuyi_handArea.update(player);
                        },
                        update:function (player) {
                            if (!player || !player.isAlive()) return;
                            var shouldPlay = player.storage._szy_wy_names && player.storage._szy_wy_names.length >= 4;
                            var playing = !!player.storage._szytx_handArea;
                            if (shouldPlay && !playing) {
                                lib.skill.hy_wuyi_handArea.start(player);
                            } else if (!shouldPlay && playing) {
                                lib.skill.hy_wuyi_handArea.stop(player);
                            }
                        },
                        start:function (player) {
                            if (player.storage._szytx_handArea) return;
                            var raw = window.szytx && window.szytx.SS_szy_handCardArea;
                            if (!window.dcdAnim || !raw || !raw.name) return;
                            dcdAnim.loadSpine(raw.name, "skel", function() {
                                if (player.storage._szytx_handArea) return;
                                var parent = player.node.handcards1 || player;
                                player.storage._szytx_handArea = dcdAnim.playSpine({
                                    ...raw,
                                    loop: true,
                                }, {
                                    parent: parent,
                                    loop: true,
                                    scale: lib.device ? 0.7 : 0.8,
                                    y: [0.77, 0.77],
                                });
                            });
                        },
                        stop:function (player) {
                            if (player.storage._szytx_handArea) {
                                dcdAnim.stopSpine(player.storage._szytx_handArea);
                                delete player.storage._szytx_handArea;
                            }
                        },
                    },
                },
            },
            "hy_cuifeng":{
                audio: "character/bingshi/assets/zhaoyun/audio:4",
                group:["hy_cuifeng_record","hy_cuifeng_reset"],
                trigger:{
                    global:"phaseEnd",
                },
                forced:true,
                popup:false,
                filter:function (event, player) {
                    if (player.storage._szy_cf_round == game.roundNumber && player.storage._szy_cf_count >= 2) return false;
                    if (event.player == player) return false;
                    return player.canUse({ name: 'juedou', isCard: true }, event.player, false);
                },
                content:function () {
                    'step 0'
                    if (player.storage._szy_cf_round != game.roundNumber) {
                        player.storage._szy_cf_round = game.roundNumber;
                        player.storage._szy_cf_count = 0;
                    }
                    event.x = player.storage.hy_cuifeng_x || 0;
                    event.targetx = trigger.player;
                    player.chooseBool('###是否发动【摧锋】?###视为对' + get.translation(trigger.player) + '使用一张伤害值+' + event.x + '的【决斗】').set('ai', function () {
                        return get.effect(event.targetx, { name: 'juedou' }, player, player) > 0;
                    });
                    'step 1'
                    if (!result.bool) {
                        event.finish();
                        return;
                    }
                    player.logSkill('hy_cuifeng', event.targetx);
                    player.storage.hy_cuifeng_bonus = event.x;
                    player.addTempSkill('hy_cuifeng_bonus', 'useCardAfter');
                    player.storage._szy_cf_count++;
                    player.syncStorage('_szy_cf_count');
                    player.useCard({ name: 'juedou', isCard: true }, event.targetx, false);
                    game.log(player, '对', event.targetx, '使用了伤害值+' + event.x + '的【决斗】');
                },
                subSkill:{
                    bonus:{
                        sub:true,
                        parentskill:"hy_cuifeng",
                        charlotte:true,
                        forced:true,
                        popup:false,
                        silent:true,
                        onremove:function (player) {
                            delete player.storage.hy_cuifeng_bonus;
                        },
                        trigger:{
                            source:"damageBegin3",
                        },
                        filter:function (event, player) {
                            var x = player.storage.hy_cuifeng_bonus;
                            if (typeof x != 'number' || x <= 0) return false;
                            if (!event.card || event.card.name != 'juedou') return false;
                            return event.source == player;
                        },
                        content:function () {
                            trigger.num += player.storage.hy_cuifeng_bonus;
                        },
                    },
                    record:{
                        sub:true,
                        parentskill:"hy_cuifeng",
                        charlotte:true,
                        forced:true,
                        popup:false,
                        silent:true,
                        trigger:{
                            global:"respond",
                        },
                        filter:function (event, player) {
                            return event.card && event.card.name == 'sha';
                        },
                        content:function () {
                            if (typeof player.storage.hy_cuifeng_x != 'number') player.storage.hy_cuifeng_x = 0;
                            player.storage.hy_cuifeng_x++;
                            player.syncStorage('hy_cuifeng_x');
                        },
                    },
                    reset:{
                        sub:true,
                        parentskill:"hy_cuifeng",
                        charlotte:true,
                        forced:true,
                        popup:false,
                        silent:true,
                        priority:-1,
                        trigger:{
                            global:"phaseBegin",
                        },
                        filter:function (event, player) {
                            return !!player.storage.hy_cuifeng_x;
                        },
                        content:function () {
                            player.storage.hy_cuifeng_x = 0;
                            player.syncStorage('hy_cuifeng_x');
                        },
                    },
                    count:{
                        sub:true,
                        parentskill:"hy_cuifeng",
                        charlotte:true,
                        forced:true,
                        popup:false,
                        silent:true,
                        trigger:{
                            global:"roundStart",
                        },
                        content:function () {
                            if (player.storage._szy_cf_round != game.roundNumber) {
                                player.storage._szy_cf_count = 0;
                            }
                        },
                    },
                },
            },
        };

let mounted = false;
export function mountEffects() {
 if (mounted || typeof document === 'undefined') return;
 mounted = true;
 const timers = [];
 const setInterval = (fn, ms) => { const id = globalThis.setInterval(fn, ms); timers.push(id); return id; };
 const listeners = [];
 const nativeWindow = globalThis.window;
 const window = new Proxy(nativeWindow, { get(target, key) { if (key === 'addEventListener') return (name, fn, ...args) => { listeners.push([name, fn]); target.addEventListener(name, fn, ...args); }; const value = Reflect.get(target, key); return typeof value === 'function' ? value.bind(target) : value; } });
 (function (config, pack) {
window.szytx = {
SS_szy_handCardArea: { name: "../../../../character/bingshi/assets/zhaoyun/animation/handCardArea/SS_szy_longlin" },
SS_szy_kuangfangda: { name: "../../../../character/bingshi/assets/zhaoyun/animation/hand/SS_szy_kuangfangda" },
SS_szy_kuanglizi: { name: "../../../../character/bingshi/assets/zhaoyun/animation/hand/SS_szy_kuanglizi" },
SS_szy_sha: { name: "../../../../character/bingshi/assets/zhaoyun/animation/sha/SS_szy_sha" },
SS_szy_sha2: { name: "../../../../character/bingshi/assets/zhaoyun/animation/sha/SS_szy_leisha" },
SS_szy_sha3: { name: "../../../../character/bingshi/assets/zhaoyun/animation/sha/SS_szy_huosha" },
SS_szy_shan: { name: "../../../../character/bingshi/assets/zhaoyun/animation/shan/SS_szy_shan" },
};
// ================= 武将牌外围特效挂载层 =================
(function () {
var FX = {
    pad: 0.18,
    zIndex: 30,
};
var HOSTS = [];
var cssLines = [
    '.szy-frame-fx {',
    '    position: absolute !important;',
    '    pointer-events: none !important;',
    '    overflow: visible !important;',
    '    background: none !important;',
    '    border: none !important;',
    '}',
];
    var st = document.createElement('style');
    st.type = 'text/css';
    st.innerHTML = cssLines.join('\n');
    document.head.appendChild(st);

    var layout = function (rec) {
        try {
            var p = rec.player, box = rec.box;
            if (!p || !p.node || !box) return;
            var base = (p.node.avatar && p.node.avatar.offsetParent) ? p.node.avatar : p.node;
            var w = base.offsetWidth || 0, h = base.offsetHeight || 0;
            if (!w || !h) return;
            var padX = w * FX.pad, padY = h * FX.pad;
            box.style.left = (base.offsetLeft - padX) + 'px';
            box.style.top = (base.offsetTop - padY) + 'px';
            box.style.width = (w + padX * 2) + 'px';
            box.style.height = (h + padY * 2) + 'px';
            box.style.zIndex = String(FX.zIndex);
        } catch (e) {}
    };
    var layoutAll = function () {
        for (var i = 0; i < HOSTS.length; i++) layout(HOSTS[i]);
    };

    window.szyFrameHost = function (player) {
        if (!player || !player.node) return null;
        if (player._szytx_frameHost) return player._szytx_frameHost;
        var anchor = player.node.avatar || player.node;
        var parent = anchor.parentNode;
        if (!parent) return null;
        var box = document.createElement('div');
        box.className = 'szy-frame-fx';
        parent.insertBefore(box, anchor.nextSibling);
        player._szytx_frameHost = box;
        var rec = { player: player, box: box };
        HOSTS.push(rec);
        layout(rec);
        if (window.ResizeObserver) {
            try { new ResizeObserver(layoutAll).observe(anchor); } catch (e) {}
        }
        return box;
    };
    window.szyFrameRemove = function (player) {
        try {
            if (!player || !player._szytx_frameHost) return;
            var box = player._szytx_frameHost;
            for (var i = HOSTS.length - 1; i >= 0; i--) {
                if (HOSTS[i].box == box) HOSTS.splice(i, 1);
            }
            if (box.parentNode) box.parentNode.removeChild(box);
        } catch (e) {}
        try { delete player._szytx_frameHost; } catch (e) {}
    };
    window.szytxStopAll = function (player) {
        try {
            if (lib.skill && lib.skill.hy_wuyi && lib.skill.hy_wuyi._frameStopAll) {
                lib.skill.hy_wuyi._frameStopAll(player);
            }
        } catch (e) {}
    };
    window.addEventListener('resize', layoutAll);
    window.addEventListener('orientationchange', function () { setTimeout(layoutAll, 300); });
    setInterval(layoutAll, 1000);
})();
(function () {
    var getImageURL = function (file) {
        return String(lib.assetURL || '') + 'character/bingshi/assets/zhaoyun/image/' + file;
    };
    var bgUnused = getImageURL('game_spellbtn_bg14.png');
    var bgActive = getImageURL('game_spellbtn_bg15.png');
    var bgUsed   = getImageURL('game_spellbtn_bg13.png');
    var css = [
        // 清掉原生按钮的背景/边框/阴影，文字保留
        '.szy-wuyi-btn {',
        '    background: none !important;',
        '    border: none !important;',
        '    box-shadow: none !important;',
        '    outline: none !important;',
        '}',
        // 用素材作背景，contain 不拉伸
        '.szy-wuyi-btn::before {',
        '    background-image: url("' + bgUnused + '") !important;',
        '    background-size: contain !important;',
        '    background-repeat: no-repeat !important;',
        '    background-position: center !important;',
        '    width: 147% !important;',
        '    height: 170% !important;',
        '    margin: 1px 12px !important;',
        '}',
        '.szy-wuyi-btn.select::before {',
        '    background-image: url("' + bgActive + '") !important;',
        '}',
        '.szy-wuyi-btn:not(.usable):not(.select)::before {',
        '    background-image: url("' + bgUsed + '") !important;',
        '}',
        // 让文字显示在素材之上
        '.szy-wuyi-btn {',
        '    position: relative !important;',
        '    z-index: 1 !important;',
        '}',
    ].join('\n');
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);
    var mark = function () {
        var all = document.querySelectorAll('.skill-control *');
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (el.childElementCount === 0 && (el.textContent || '').trim() === '武翊') {
                var p = el.parentElement;
                if (p && p.classList && !p.classList.contains('szy-wuyi-btn')) {
                    p.classList.add('szy-wuyi-btn');
                }
            }
        }
    };
    var observer = new MutationObserver(mark);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(mark, 500);
    setTimeout(mark, 1500);
    setTimeout(mark, 3000);
    mark();
})();
try {
    var SZY_IMG  = String(lib.assetURL || '') + 'character/bingshi/assets/zhaoyun/image/';
    var SZY_NAME = 'hy_zhaoyun';
    var SZY_OFFSET_X   = 0;
    var SZY_OFFSET_Y   = 8;
    var SZY_SHA_ROTATE = -90;
    var SZY_SCALE      = 0.9;
    var cssArr = [
        '.szy-custom-img {',
        '    position: absolute !important;',
        '    left: 0 !important;',
        '    top: 0 !important;',
        '    width: 100% !important;',
        '    height: 100% !important;',
        '    object-fit: fill !important;',
        '    pointer-events: none !important;',
        '    z-index: 1 !important;',
        '    transform-origin: center center !important;',
        '    transform: translate(' + SZY_OFFSET_X + 'px, ' + SZY_OFFSET_Y + 'px) scale(' + SZY_SCALE + ') !important;',
        '    display: block !important;',
        '}',
        '.szy-normal-sha .szy-custom-img {',
        '    transform: translate(' + SZY_OFFSET_X + 'px, ' + SZY_OFFSET_Y + 'px) rotate(' + SZY_SHA_ROTATE + 'deg) scale(' + SZY_SCALE + ') !important;',
        '}',
        '.card.szy-has-img .image > img:not(.szy-custom-img) {',
        '    visibility: hidden !important;',
        '}',
        '.szy-other-hand .card.szy-has-img .szy-custom-img {',
        '    display: none !important;',
        '}',
        '.szy-other-hand .card.szy-has-img .image > img:not(.szy-custom-img) {',
        '    visibility: visible !important;',
        '}',
        '.szy-mark-layer {',
        '    position: absolute !important;',
        '    left: 0 !important;',
        '    top: 0 !important;',
        '    width: 0 !important;',
        '    height: 0 !important;',
        '    overflow: visible !important;',
        '    pointer-events: none !important;',
        '    z-index: 20 !important;',
        '}',
        '.szy-mark-img {',
        '    position: absolute !important;',
        '    display: block !important;',
        '    width: auto !important;',
        '    height: auto !important;',
        '    max-width: none !important;',
        '    max-height: none !important;',
        '    margin: 0 !important;',
        '    padding: 0 !important;',
        '    border: none !important;',
        '    background: none !important;',
        '    pointer-events: none !important;',
        '}',
    ];
    var styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.innerHTML = cssArr.join('\n');
    document.head.appendChild(styleEl);
    var isZhaoyun = function (player) {
        if (!player) return false;
        return player.name == SZY_NAME || player.name1 == SZY_NAME || player.name2 == SZY_NAME;
    };
    var getCardImage = function (card) {
        if (!card) return null;
        if (card.name == 'sha') {
            if (card.nature == 'thunder') return SZY_IMG + 'card_texture_925_1_7.png';
            if (card.nature == 'fire')    return SZY_IMG + 'card_texture_925_1_6.png';
            return SZY_IMG + 'card_texture_925_1_0.png';
        }
        if (card.name == 'shan') return SZY_IMG + 'card_texture_925_2_0.png';
        return null;
    };
    var markHands = function () {
        if (!game || !game.players) return;
        for (var i = 0; i < game.players.length; i++) {
            var p = game.players[i];
            if (!p || !p.node) continue;
            var isZY = isZhaoyun(p);
            var zones = [p.node.handcards1, p.node.handcards2];
            for (var k = 0; k < zones.length; k++) {
                var z = zones[k];
                if (!z || !z.classList) continue;
                if (isZY) {
                    z.classList.remove('szy-other-hand');
                } else {
                    z.classList.add('szy-other-hand');
                }
            }
        }
    };
    var ensureImage = function (card) {
        if (!card || !card.node || !card.node.image) return;
        var img = getCardImage(card);
        if (!img) return;
        if (card.classList) card.classList.add('szy-has-img');
        if (card.name == 'sha' && !card.nature) {
            if (card.classList) card.classList.add('szy-normal-sha');
        }
        var old = card.node.image.querySelector && card.node.image.querySelector('.szy-custom-img');
        if (old) {
            if (old.src != img) old.src = img;
            return;
        }
        var newImg = document.createElement('img');
        newImg.className = 'szy-custom-img';
        newImg.src = img;
        newImg.onerror = function () { this.style.display = 'none'; };
        card.node.image.appendChild(newImg);
    };
    var scan = function () {
        try {
            if (!game || !game.players) return;
            markHands();
            for (var i = 0; i < game.players.length; i++) {
                if (!isZhaoyun(game.players[i])) continue;
                var hs = game.players[i].getCards('h');
                for (var j = 0; j < hs.length; j++) {
                    var c = hs[j];
                    if (c.name != 'sha' && c.name != 'shan') continue;
                    ensureImage(c);
                }
            }
        } catch (e) {}
    };
    scan();
    setInterval(scan, 500);
} catch (e) {}
})();
 lib.onover.push(() => { timers.forEach(globalThis.clearInterval); listeners.forEach(([name, fn]) => nativeWindow.removeEventListener(name, fn)); for (const player of [...game.players, ...game.dead]) nativeWindow.szytxStopAll?.(player); mounted = false; });
}

skills.hy_wuyi.audio = ["character/bingshi/assets/zhaoyun/audio/hy_wuyi1.mp3","character/bingshi/assets/zhaoyun/audio/hy_wuyi2.mp3","character/bingshi/assets/zhaoyun/audio/hy_wuyi3.mp3","character/bingshi/assets/zhaoyun/audio/hy_wuyi4.mp3","character/bingshi/assets/zhaoyun/audio/hy_wuyi5.mp3","character/bingshi/assets/zhaoyun/audio/hy_wuyi6.mp3"];

skills.hy_cuifeng.audio = ["character/bingshi/assets/zhaoyun/audio/hy_cuifeng1.mp3","character/bingshi/assets/zhaoyun/audio/hy_cuifeng2.mp3","character/bingshi/assets/zhaoyun/audio/hy_cuifeng3.mp3","character/bingshi/assets/zhaoyun/audio/hy_cuifeng4.mp3"];

const originalInit = skills.hy_wuyi.init;
skills.hy_wuyi.init = function(player) { originalInit?.(player); mountEffects(); };

export { skills };
export const characters = { hy_zhaoyun: {
  "sex": "male",
  "group": "shu",
  "hp": 4,
  "skills": [
    "hy_wuyi",
    "hy_cuifeng"
  ],
  "img": "character/bingshi/assets/zhaoyun/hy_zhaoyun.jpg",
  "dieAudios": [
    "character/bingshi/assets/zhaoyun/audio/die/hy_zhaoyun.mp3"
  ]
} };
export const translates = { ...{
            "hy_wuyi":"武翊",
            "hy_wuyi_info":"若你从手牌使用或打出过的基本牌名数大于等于：1，每轮限一次，你可视为使用一张【杀】或【闪】；2，你使用基本牌无次数限制；3，你使用基本牌无距离限制；4，你的手牌数始终为4。",
            "hy_cuifeng":"摧锋",
            "hy_cuifeng_info":"每轮限两次，每回合结束时，你可视为对当前回合角色使用一张伤害值+X的【决斗】（X为本回合所有角色打出【杀】的次数）。",
        }, hy_zhaoyun: "势赵云", hy_zhaoyun_prefix: '势' };
