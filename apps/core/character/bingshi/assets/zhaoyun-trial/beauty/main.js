(function () {
    'use strict';
    window.sztyMountBeauty = function (lib, game, ui, get, _status) {
        if (window.sztyBeauty && !window.sztyBeauty.stopped) return;
        if (window.sztyBeauty && lib.onover) {
            var oldHook = lib.onover.indexOf(window.sztyBeauty.stop);
            if (oldHook !== -1) lib.onover.splice(oldHook, 1);
        }
        var base = lib.assetURL + 'character/bingshi/assets/zhaoyun-trial/beauty/';
        var files = {
            sha: 'sha/SS_szy_sha', fire: 'sha/SS_szy_huosha',
            thunder: 'sha/SS_szy_leisha', shan: 'shan/SS_szy_shan', hand: 'handCardArea/SS_szy_longlin'
        };
        // 特效缩放：这里可以分别调。
        // 所有特效复用十周年已有画布；不再为雷杀或手牌区域创建 WebGL 上下文。
        var effectScale = { sha: 10.0, fire: 10.0, thunder: 10.0, shan: 10.0, hand: 2.00 };
        var seen = new WeakSet(), caches = new WeakMap(), waiting = [], active = [];
        var hand = null, handLoading = null, currentPlayer = null;
        var epoch = 0, timers = new Set();
        var maxCardEffects = 6;
        var lastCardSize = null;
        // 按钮外观统一由 beauty/theme.css 管理；此处仅维护状态与防闪监听。
        var api = window.sztyBeauty = { stopped: false };

        function isZhao(player) {
            return player && [player.name, player.name1, player.name2].indexOf('szty_zhaoyun') !== -1;
        }
        function localZhao() {
            return isZhao(game.me) && (!game.me.isIn || game.me.isIn()) && !game.observe && !_status.over;
        }
        function visible(node) {
            if (!node || !node.isConnected || !node.getBoundingClientRect) return false;
            var r = node.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
        }
        function handArea() {
            return [ui.handcards1Container, ui.handcards1, game.me && game.me.node && game.me.node.handcards1].find(visible);
        }
        function nativePlayer() {
            var player = (window.decadeUI && window.decadeUI.animation) || window.dcdAnim;
            if (!player || !player.loadSpine || !player.playSpine || !player.prepSpine || !player.stopSpine) return null;
            if (window.duicfg && !window.duicfg.gameAnimationEffect) return null;
            if (player.gl && player.gl.isContextLost && player.gl.isContextLost()) return null;
            return player;
        }
        function report(error) { console.warn('[势赵云美化]', error); }
        function later(fn, delay) {
            var id = setTimeout(function () { timers.delete(id); if (!api.stopped) fn(); }, delay);
            timers.add(id);
            return id;
        }
        function stopRecord(record) {
            if (!record || record.stopped) return;
            record.stopped = true;
            // 只停止本拓展持有的动画节点，绝不清空/销毁十周年共享画布。
            try { record.player.stopSpine(record.sprite); } catch (error) { report(error); }
            var index = active.indexOf(record);
            if (index !== -1) active.splice(index, 1);
            if (hand === record) hand = null;
        }
        function suspend() {
            epoch++;
            timers.forEach(clearTimeout); timers.clear();
            waiting.length = 0;
            active.slice().forEach(stopRecord);
            hand = null; handLoading = null;
        }

        // 十周年播放器会自动加自己的素材目录前缀，必须传相对路径。
        // 根据实际前缀计算，不假定它在固定的三级目录中。
        function resourceName(player, type) {
            var prefix = player.spine && player.spine.assetManager && player.spine.assetManager.pathPrefix;
            if (typeof prefix !== 'string') throw new Error('未找到十周年 UI 动画素材目录');
            var from = new URL(prefix || './', document.baseURI);
            // Both variants ship byte-identical animation bundles; reuse one copy.
            var to = new URL(lib.assetURL + 'character/bingshi/assets/zhaoyun/animation/' + files[type], document.baseURI);
            if (from.origin !== to.origin) throw new Error('动画素材与游戏不在同一来源');
            var a = from.pathname.split('/'), b = to.pathname.split('/');
            a.pop();
            while (a.length && b.length && a[0] === b[0]) { a.shift(); b.shift(); }
            return a.map(function () { return '..'; }).concat(b).join('/');
        }
        function prepare(player, type) {
            var cache = caches.get(player);
            if (!cache) { cache = {}; caches.set(player, cache); }
            if (cache[type]) return cache[type];
            cache[type] = new Promise(function (resolve, reject) {
                var name;
                try { name = resourceName(player, type); } catch (e) { reject(e); return; }
                function ready() {
                    try {
                        var skeleton = player.prepSpine(name);
                        if (!skeleton || !skeleton.bounds) throw new Error('骨骼准备失败：' + type);
                        var size = skeleton.bounds.size;
                        if (!size || !isFinite(size.x) || !isFinite(size.y) || size.x <= 0 || size.y <= 0) throw new Error('骨骼尺寸异常：' + type);
                        var animation = skeleton.data && skeleton.data.animations && skeleton.data.animations.find(function (item) { return item.name === skeleton.defaultAction; });
                        resolve({ name: name, type: type, bounds: skeleton.bounds, action: skeleton.defaultAction, duration: animation && animation.duration });
                    } catch (e) { reject(e); }
                }
                if (player.hasSpine && player.hasSpine(name)) ready();
                else player.loadSpine(name, 'skel', ready, function () { reject(new Error('素材加载失败：' + type)); });
            });
            return cache[type];
        }
        function playedNode(event) {
            var nodes = event.player && event.player.node;
            var cards = [event.card].concat(event.cards || []);
            for (var i = 0; i < cards.length; i++) {
                var node = cards[i] && cards[i].clone;
                if (!visible(node) || node.closest('.handcards,.hand-cards')) continue;
                if (nodes && ((nodes.handcards1 && nodes.handcards1.contains(node)) || (nodes.handcards2 && nodes.handcards2.contains(node)))) continue;
                return node;
            }
            return null;
        }
        function cardSize(node) {
            if (visible(node)) {
                var rect = node.getBoundingClientRect();
                lastCardSize = { width: rect.width, height: rect.height };
                return lastCardSize;
            }
            if (lastCardSize) return lastCardSize;
            // 纯虚拟牌可能没有 clone：用实际牌面尺寸，不能用视口尺寸。
            var cards = document.querySelectorAll('.card.thrown,.handcards .card,.hand-cards .card');
            for (var i = 0; i < cards.length; i++) {
                if (visible(cards[i])) {
                    var r = cards[i].getBoundingClientRect();
                    return { width: r.width, height: r.height };
                }
            }
            return { width: 108, height: 150 };
        }
        function position(asset, node, loop, type, fixedSize) {
            var rect = visible(node) ? node.getBoundingClientRect() : null;
            var dimensions = fixedSize || (loop && rect ? rect : cardSize(node));
            var width = dimensions.width, height = dimensions.height;
            var size = asset.bounds.size, offset = asset.bounds.offset;
            var effectType = type || asset.type;
            var rate = loop ? effectScale.hand : (effectScale[effectType] || 1);
            var scale = Math.min(width / size.x, height / size.y) * rate;
            return {
                parent: rect ? node : undefined, follow: true, scale: scale,
                x: [-(offset.x + size.x / 2) * scale, 0.5],
                y: [-(offset.y + size.y / 2) * scale, 0.5]
            };
        }
        function play(player, asset, node, loop, type, owner) {
            if (api.stopped || document.hidden || _status.over || nativePlayer() !== player || (node && !visible(node)) ||
                (loop && !localZhao())) return null;
            if (!loop) {
                var cards = active.filter(function (r) { return !r.loop; });
                while (cards.length >= maxCardEffects) stopRecord(cards.shift());
            }
            var fixedSize = loop ? null : cardSize(node);
            var options = {
                name: asset.name, action: asset.action, loop: loop, speed: 1,
                onupdate: function () {
                    if (node && !visible(node)) { this.opacity = 0; return; }
                    var p = position(asset, node, loop, type, fixedSize);
                    this.referNode = p.parent; this.scale = p.scale; this.x = p.x; this.y = p.y;
                }
            };
            var sprite = player.playSpine(options, position(asset, node, loop, type, fixedSize));
            if (!sprite) return null;
            var record = { player: player, sprite: sprite, node: node, loop: loop, owner: owner,
                expires: loop ? Infinity : Date.now() + Math.max(1500, Math.min(10000, ((asset.duration || 4) + 1) * 1000)) };
            active.push(record);
            return record;
        }
        function runCard(job, player) {
            var version = epoch, deadline = Date.now() + 180;
            function valid() {
                return !api.stopped && version === epoch && !document.hidden && !_status.over &&
                    nativePlayer() === player && Date.now() - job.time < 10000;
            }
            function locate() {
                if (!valid()) return;
                var node = playedNode(job.event);
                if (!node && Date.now() < deadline) { later(locate, 30); return; }
                prepare(player, job.type).then(function (asset) {
                    // 加载完成时牌面已被移除就放弃，不能复活过期特效。
                    if (valid() && (!node || visible(node))) play(player, asset, node, false, job.type, job.event.player);
                }).catch(report);
            }
            locate();
        }
        api.card = function (event) {
            if (api.stopped || _status.over || document.hidden || !event || !isZhao(event.player) || !event.card || seen.has(event)) return;
            var name = get.name(event.card), type;
            if (name === 'shan') type = 'shan';
            else if (name === 'sha') {
                var nature = get.nature ? get.nature(event.card) : event.card.nature;
                var list = Array.isArray(nature) ? nature : String(nature || '').split(/[|,]/);
                type = list.indexOf('fire') !== -1 ? 'fire' : list.indexOf('thunder') !== -1 ? 'thunder' : 'sha';
            } else return;
            seen.add(event);
            waiting.push({ event: event, type: type, time: Date.now() });
            tick();
        };

        function restoreButton(node) {
            node.querySelectorAll('.szty-label').forEach(function (label) {
                label.replaceWith.apply(label, Array.from(label.childNodes));
            });
            node.classList.remove('szty-button', 'szty-solid');
            node.removeAttribute('data-szty-state');
            if (node.style.removeProperty) {
                ['font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing', 'font-color', 'text-shadow', 'text-stroke', 'text-background', 'text-fill'].forEach(function (name) {
                    node.style.removeProperty('--szty-' + name);
                });
            }
        }
        function buttonId(node) {
            return node.dataset.id || node.dataset.skill || node.link || '';
        }
        function updateButtons() {
            var root = document.documentElement;
            var enabledBeauty = localZhao();
            if (root.classList.contains('szty-beauty-buttons') !== !!enabledBeauty) {
                root.classList.toggle('szty-beauty-buttons', !!enabledBeauty);
            }
            var nodes = Array.from(document.querySelectorAll('.skill-control [data-id],.skill-control [data-skill],.skill-controlzuoshou [data-id],.skill-controlzuoshou [data-skill],.control>div'));
            // 不再每轮先显示后隐藏：UI 的观察器会因反复改属性重新布局。
            if (!localZhao()) {
                document.querySelectorAll('.szty-button').forEach(restoreButton);
                document.querySelectorAll('.szty-button-hidden').forEach(function (node) {
                    node.classList.remove('szty-button-hidden');
                });
                return;
            }
            var candidates = [];
            nodes.forEach(function (node) {
                var id = buttonId(node);
                if (/^szty_cuifeng(_|$)/.test(id)) {
                    if (node.classList.contains('szty-button')) restoreButton(node);
                    // 摧锋保留 UI 原来的技能文字和说明，不作为美化按钮。
                    if (node.classList.contains('szty-button-hidden')) node.classList.remove('szty-button-hidden');
                } else if (/^szty_wuyi(_|$)/.test(id)) {
                    candidates.push(node);
                }
            });
            function displayed(node) {
                if (!node.isConnected || node.style.display === 'none') return false;
                if (getComputedStyle(node).visibility === 'hidden') return false;
                // 对我们隐藏的副本只检查其父容器，不必先改动 DOM 才能判断。
                return node.classList.contains('szty-button-hidden') ? visible(node.parentNode) : visible(node);
            }
            // 优先使用 UI 的主动技能入口；原生入口仅作后备，避免两套按钮重叠。
            function priority(node) {
                var id = buttonId(node);
                var score = id === 'szty_wuyi_virtual' ? 20 : id === 'szty_wuyi_virtual_backup' ? 15 : id === 'szty_wuyi' ? 0 : -100;
                if (node.closest('.skill-control,.skill-controlzuoshou')) score += 5;
                return score;
            }
            var shown = candidates.filter(displayed).filter(function (node) { return priority(node) >= 0; });
            shown.sort(function (a, b) { return priority(b) - priority(a); });
            var node = shown[0];
            candidates.forEach(function (item) {
                if (item !== node) {
                    if (item.classList.contains('szty-button')) restoreButton(item);
                    if (!item.classList.contains('szty-button-hidden')) item.classList.add('szty-button-hidden');
                } else if (item.classList.contains('szty-button-hidden')) {
                    item.classList.remove('szty-button-hidden');
                }
            });
            if (!node) return;
            var id = buttonId(node);
            var eventSkill = _status.event && _status.event.skill;
            var selected = node.classList.contains('select') || node.classList.contains('selected') || /^szty_wuyi_virtual(_|$)/.test(eventSkill || '');
            var native = [ui.skills, ui.skills2, ui.skills3].indexOf(node.parentNode) !== -1;
            var activeSkill = /^szty_wuyi_virtual(_|$)/.test(id);
            var enabled = activeSkill && !node.classList.contains('disabled') && !node.classList.contains('unselectable') && (node.classList.contains('usable') || (native && node.parentNode.style.display !== 'none'));
            if (!node.classList.contains('szty-button')) node.classList.add('szty-button');
            var state = selected ? 'selected' : enabled ? 'enabled' : 'disabled';
            if (node.dataset.sztyState !== state) node.dataset.sztyState = state;
            Array.from(node.childNodes).forEach(function (child) {
                if (child.nodeType !== 3 || !child.textContent.trim()) return;
                var label = document.createElement('span'); label.className = 'szty-label';
                child.replaceWith(label); label.appendChild(child);
            });
        }
        function tick() {
            if (api.stopped) return;
            if (_status.over) { api.stop(); return; }
            refreshButtons();
            var player = document.hidden ? null : nativePlayer();
            if (player !== currentPlayer) {
                if (currentPlayer) suspend();
                currentPlayer = player;
            }
            if (!player) return;
            active.slice().forEach(function (record) {
                if (record.sprite.completed || record.player !== player || (record.node && !visible(record.node)) ||
                    (record.owner && record.owner.isIn && !record.owner.isIn()) || Date.now() >= record.expires ||
                    (record.loop && (!localZhao() || record.node !== handArea()))) stopRecord(record);
            });
            waiting.splice(0).forEach(function (job) {
                if (Date.now() - job.time < 10000) runCard(job, player);
            });
            var node = localZhao() && handArea();
            if (!node) { stopRecord(hand); handLoading = null; return; }
            if (hand && !hand.sprite.completed) return;
            if (handLoading && handLoading.node === node && handLoading.player === player) return;
            var token = handLoading = { player: player, node: node, epoch: epoch };
            prepare(player, 'hand').then(function (asset) {
                if (handLoading === token && token.epoch === epoch && !api.stopped && !document.hidden &&
                    localZhao() && node === handArea() && nativePlayer() === player) hand = play(player, asset, node, true, 'hand', game.me);
            }).catch(report).then(function () { if (handLoading === token) handLoading = null; });
        }
        function visibilityChanged() {
            if (document.hidden) suspend();
            else tick();
        }
        api.stop = function () {
            if (api.stopped) return;
            api.stopped = true;
            clearInterval(timer);
            if (buttonObserver) buttonObserver.disconnect();
            document.removeEventListener('visibilitychange', visibilityChanged);
            window.removeEventListener('pagehide', api.stop);
            suspend();
            currentPlayer = null;
            document.documentElement.classList.remove('szty-beauty-buttons');
            document.querySelectorAll('.szty-button').forEach(restoreButton);
            document.querySelectorAll('.szty-button-hidden').forEach(function (node) { node.classList.remove('szty-button-hidden'); });
        };
        function observeButtons() {
            if (buttonObserver && !api.stopped) buttonObserver.observe(document.documentElement, {
                subtree: true, childList: true, attributes: true,
                attributeFilter: ['class', 'style', 'data-id', 'data-skill']
            });
        }
        function refreshButtons() {
            // 暂停监听自身的 DOM 修改，防止按钮恢复/包装形成连续微任务占满主线程。
            if (buttonObserver) buttonObserver.disconnect();
            try { updateButtons(); } finally { observeButtons(); }
        }
        // MutationObserver 在浏览器绘制前处理节点创建和属性重置，不再等下一次定时器。
        var buttonObserver = null;
        if (typeof MutationObserver !== 'undefined') {
            var buttonArea = '.skill-control,.skill-controlzuoshou,.control';
            function affectsButtons(node) {
                return node && node.nodeType === 1 &&
                    ((node.matches && node.matches(buttonArea)) ||
                    (node.closest && node.closest(buttonArea)) ||
                    (node.querySelector && node.querySelector(buttonArea)));
            }
            buttonObserver = new MutationObserver(function (records) {
                if (api.stopped) return;
                var dirty = records.some(function (record) {
                    if (record.type === 'attributes') {
                        var target = record.target;
                        return target.matches(buttonArea) || !!target.closest(buttonArea);
                    }
                    return affectsButtons(record.target) ||
                        Array.from(record.addedNodes).some(affectsButtons) ||
                        Array.from(record.removedNodes).some(affectsButtons);
                });
                if (dirty) refreshButtons();
            });
            buttonObserver.observe(document.documentElement, {
                subtree: true, childList: true, attributes: true,
                attributeFilter: ['class', 'style', 'data-id', 'data-skill']
            });
        }
        document.addEventListener('visibilitychange', visibilityChanged);
        window.addEventListener('pagehide', api.stop);
        var timer = setInterval(tick, 150);
        (lib.onover || (lib.onover = [])).push(api.stop);
        (window.sztyBeautyPending || []).splice(0).forEach(api.card);
        tick();
    };
})();
