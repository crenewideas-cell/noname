import { installCharacterAppearance } from "./appearance.js";
import { themes } from "./theme/catalog.js";
import { installVoiceRuntime, voiceFiles } from "./voice/runtime.js";
import { daiyuVoice } from "./voice/daiyu.js";
import { createBaoyu } from "./baoyu.js";

export const type = "extension";

export default function (lib, game, ui, get, ai, _status, appearancePaths = {
    theme: "extension/红楼幻境/theme/",
    original: "extension/红楼幻境/hlhj_daiyu.svg",
}) {
    const bond = player => player.getStorage("hlhj_mushi")[0];
    const threshold = () => Math.max(16, game.countPlayer() * 4);
    // Per-player resolution guard, never persisted or shared between Daiyus.
    const mushiPaying = new WeakSet();
    const voiceSpec = daiyuVoice(appearancePaths.theme);
    const speak = (player, name, options) => game.hlhjVoice?.emit(player, "hlhj_daiyu", name, options);
    const voiceScope = (player, name, event) => game.hlhjVoice?.scope(player, "hlhj_daiyu", name, event);
    function resolveIdentity() {
        if (get.mode() !== "identity") return;
        // Identity is drafted before characters. Finalize the restriction after
        // both generals are known, before role skills, starting cards and replay.
        const restricted = player => [player.name, player.name1, player.name2].some(name => ["hlhj_daiyu", "hlhj_baoyu"].includes(name));
        for (const player of game.players) {
            if (!restricted(player) || !["nei", "rNei", "bNei"].includes(player.identity)) continue;
            const previous = player.identity;
            const allowed = previous === "nei" ? ["zhong", "fan", "commoner"] :
                [previous[0] + "Zhong", previous[0] + "Ye"];
            const target = game.players.filter(current => !restricted(current) &&
                !current.special_identity && allowed.includes(current.identity)).randomGet();
            // Preserve the identity pool whenever possible; never displace a
            // monarch, revealed loyalist or special-role seat. In custom games
            // with no eligible seat, the restriction takes precedence over quota.
            const identity = target?.identity || (previous === "nei" ? "fan" : previous[0] + "Zhong");
            const changes = target ? [[player, identity], [target, previous]] : [[player, identity]];
            for (const [current, nextIdentity] of changes) {
                current.identity = nextIdentity;
                const refresh = function (current, identity) {
                    current.identity = identity;
                    if (current === game.me || current.identityShown) {
                        current.setIdentity();
                        current.node.identity.classList.remove("guessing");
                    }
                };
                refresh(current, nextIdentity);
                // Only the affected seat receives its hidden role; normal mode
                // state synchronization below handles reconnect and AI state.
                if (current.identityShown) game.broadcast(refresh, current, nextIdentity);
                else current.send(refresh, current, nextIdentity);
            }
        }
    }
    const ordinary = (card, player) => get.position(card) === "h" &&
        get.owner(card) === player &&
        card.name !== "hlhj_qingsi" && (lib.card[card.name]?.type === "basic" ||
            lib.card[card.name]?.subtype === "equip1" || !!get.tag({ name: card.name, nature: card.nature }, "damage"));
    const sync = (player, key, value) => {
        player.storage[key] = value;
        player.syncStorage(key);
        // syncStorage only records replay data; remote seats need this update too.
        game.broadcast(function (target, name, data) {
            target.storage[name] = data;
            target.updateMarks();
        }, player, key, value);
    };
    const step = (player, key) => {
        const value = (player.storage[key] || 0) + 1;
        sync(player, key, value);
        return value;
    };
    const canDiscardQingsi = (card, player) => get.name(card, player) === "hlhj_qingsi" &&
        lib.filter.cardDiscardable(card, player, "hlhj_mushi");
    function convertHand(player) {
        const cards = player.getCards("h", card => ordinary(card, player));
        if (!cards.length) return;
        // Store the physical identity before conversion. The hand still contains
        // real 情思; only a return to a pile restores the underlying physical card.
        const sources = cards.map(card => ({
            face: [card.suit, card.number, card.name, card.nature],
            temporary: !!card.storage?.hlhj_temporary || card.destroyed === "discardPile",
            previousSource: card.storage?.hlhj_qingsi_source,
            previousDestroyed: card.storage?.hlhj_qingsi_destroyed,
        }));
        const change = function (cards, sources) {
            for (let index = 0; index < cards.length; index++) {
                const card = cards[index];
                const id = card.cardid;
                const tags = card.gaintag.slice();
                if (card.name !== "hlhj_qingsi") card.storage.hlhj_qingsi_destroyed = card.destroyed;
                card.storage.hlhj_qingsi_source = sources[index];
                card.init([card.suit, card.number, "hlhj_qingsi"]);
                card.cardid = id;
                card.addGaintag(tags);
            }
        };
        change(cards, sources);
        // Private hands must not be broadcast to other seats. Public use/gain
        // messages will reveal the converted name when the card is revealed.
        player.send(change, cards, sources);
        // Conversion depends on a private hand: only its owner hears this cue.
        if (game.hlhjVoice?.entered.has(player)) speak(player, "convert", { private: true });
    }
    function qingsiReturn(card, position, player, event) {
        if (position !== "discardPile" && position !== "cardPile") return false;
        const source = card.storage.hlhj_qingsi_source;
        // Generated cards have no place in the physical deck. Never restore a
        // generated copy into an extra basic/weapon card during a reshuffle.
        if (!source || source.temporary || card.storage.hlhj_temporary) return true;
        const id = card.cardid, tags = card.gaintag.slice();
        const previousDestroy = card.storage.hlhj_qingsi_destroyed;
        delete card.storage.hlhj_qingsi_source;
        delete card.storage.hlhj_qingsi_destroyed;
        if (source.previousSource) card.storage.hlhj_qingsi_source = source.previousSource;
        if (source.previousDestroyed !== undefined) card.storage.hlhj_qingsi_destroyed = source.previousDestroyed;
        delete card.destroyed;
        card.init(source.face); card.cardid = id; card.addGaintag(tags);
        if (previousDestroy !== undefined) card.destroyed = previousDestroy;
        // Normal movement serialization sends the restored identity when public;
        // do not broadcast a face-down return to the draw pile to other seats.
        return card.willBeDestroyed(position, player, event);
    }
    function flowerCopy(original, randomType) {
        let name = original.name;
        // Exact copies never draw from the random pool. In random-type mode,
        // draw independently for every bonus card, with replacement.
        if (randomType) {
            const type = get.type2(original, false);
            const names = [...new Set([original.name, ...lib.inpile.filter(name =>
                get.type2(name, false) === type && !lib.card[name]?.derivation)])];
            name = names.randomGet();
        }
        const copy = game.createCard2(name, original.suit, original.number, name === original.name ? original.nature : undefined);
        copy.storage.hlhj_temporary = true;
        copy.destroyed = (card, position) => position === "discardPile" || position === "cardPile";
        return copy;
    }
    function setBond(player, target) {
        const previous = bond(player);
        if (previous) {
            const sources = previous.getStorage("hlhj_mushiyuan").filter(source => source !== player);
            sync(previous, "hlhj_mushiyuan", sources);
            if (sources.length) previous.markSkill("hlhj_mushiyuan");
            else previous.removeSkill("hlhj_mushiyuan");
        }
        sync(player, "hlhj_mushi", target ? [target] : []);
        if (target) {
            target.addSkill("hlhj_mushiyuan");
            const sources = target.getStorage("hlhj_mushiyuan").slice();
            if (!sources.includes(player)) sources.push(player);
            sync(target, "hlhj_mushiyuan", sources);
            target.markSkill("hlhj_mushiyuan");
            player.markSkill("hlhj_mushi");
            player.line(target, "pink");
        } else player.unmarkSkill("hlhj_mushi");
    }
    async function discardQingsi(player) {
        if (!player.hasCard(card => canDiscardQingsi(card, player), "h")) return;
        await player.chooseToDiscard("木石前缘：弃置一张【情思】", "h", true)
            .set("filterCard", function (card, player) {
                return get.name(card, player) === "hlhj_qingsi" && lib.filter.cardDiscardable(card, player, "hlhj_mushi");
            });
    }
    async function dream(player) {
        if (!player.isIn() || player.storage.hlhj_dreaming || !player.hasSkill("hlhj_guimeng")) return;
        if (player.countMark("hlhj_lei") < threshold()) return;
        sync(player, "hlhj_dreaming", true);
        player.logSkill("hlhj_guimeng");
        speak(player, "dream");
        const cards = player.getCards("h");
        // 规则要求弃置全部手牌，不受主动弃牌选择的限制。
        if (cards.length) await player.discard(cards);
        if (player.isIn()) await player.die();
    }
    async function tears(player, amount) {
        if (!player.isIn() || player.storage.hlhj_dreaming || amount <= 0) return;
        player.addMark("hlhj_lei", amount);
        sync(player, "hlhj_lei", player.countMark("hlhj_lei"));
        if (player.hasSkill("hlhj_mushi") && !mushiPaying.has(player)) {
            const result = await player.chooseTarget(`木石前缘：可令自己或木石缘摸${amount}张牌（选自己后弃置一张情思）`,
                function (card, player, target) {
                    return target === player || target === player.getStorage("hlhj_mushi")[0];
                }).set("ai", target => get.attitude(_status.event.player, target)).forResult();
            if (result.bool && result.targets[0]?.isIn() && player.isIn()) {
                const target = result.targets[0];
                player.logSkill("hlhj_mushi", target);
                speak(player, target === player ? "selfDraw" : "bondDraw");
                await target.draw(amount);
                if (target === player && player.isIn()) {
                    convertHand(player);
                    // Paying with a flower still grants tears and checks 归梦,
                    // but must not recursively offer another draw-and-discard.
                    mushiPaying.add(player);
                    try {
                        await discardQingsi(player);
                    } finally {
                        mushiPaying.delete(player);
                    }
                }
            }
        }
        await dream(player);
    }
    function lostFlowerCount(loss) {
        // Count each actual loss once, regardless of its reason or destination.
        // getl() hides getlx:false child losses, so read the loss snapshot itself.
        // Tags have already been removed from the cards by this point.
        return Object.values(loss.gaintag_map || {}).filter(tags => tags.includes("hlhj_hua")).length;
    }
    function discarded(event, player) {
        if (event.type !== "discard" || event.getlx === false) return [];
        // loseAsync 的子 lose 由父事件统一处理，避免同一批弃牌重复葬花。
        if (event.name === "lose" && event.getParent()?.name === "loseAsync") return [];
        const cards = [];
        for (const current of [...game.players, ...game.dead]) {
            if (current === player) continue;
            const loss = event.getl?.(current);
            for (const card of loss?.cards2 || []) {
                if (get.position(card, true) === "d" && !cards.includes(card)) cards.push(card);
            }
        }
        return cards;
    }
    // Only follow the movement's own children, not skills triggered during it.
    function inMovement(child, root) {
        while (child && ["gain", "lose", "loseAsync", "swapHandcards"].includes(child.name)) {
            if (child === root) return true;
            child = child.getParent();
        }
        return false;
    }
    function movementCards(event, current, kind) {
        const cards = new Set(kind === "gain" ? event.getg?.(current) || [] :
            event.getl?.(current)?.cards || event.getl?.(current)?.cards2 || []);
        // loseAsync.getl only collects direct losses. Gains from several owners
        // can instead contain their losses one level below the gain children.
        for (const entry of current.getHistory(kind)) {
            if (inMovement(entry, event)) {
                for (const card of entry.cards || []) cards.add(card);
            }
        }
        return cards;
    }
    function transfer(event, player) {
        const target = bond(player);
        if (!target?.isIn()) return false;
        // Coalesce batch gains and hand swaps at their completed parent event.
        const parent = event.getParent();
        if (parent?.name === "swapHandcards" || (event.name === "gain" && parent?.name === "loseAsync")) return false;
        const gained = movementCards(event, target, "gain");
        const lost = movementCards(event, target, "lose");
        return [...game.players, ...game.dead].some(current => {
            if (current === target) return false;
            return [...movementCards(event, current, "lose")].some(card => gained.has(card)) ||
                [...movementCards(event, current, "gain")].some(card => lost.has(card));
        });
    }
    function canRedirect(event, player) {
        const target = bond(player);
        return target?.isIn() && target !== player && event.player !== player && event.target === player &&
            event.targets.includes(player) &&
            player.hasCard(card => get.name(card, player) === "hlhj_qingsi" &&
                lib.filter.cardRespondable(card, player), "h");
    }
    const skill = {
        hlhj_jiangzhu: {
            locked: true,
            init(player) { convertHand(player); },
            mod: {
                handcardGain(player) { convertHand(player); },
                cardname(card, player) { if (ordinary(card, player)) return "hlhj_qingsi"; },
                cardnature(card, player) { if (ordinary(card, player)) return false; },
            },
            group: ["hlhj_qingsi_redirect", "hlhj_jiangzhu_convert"],
        },
        hlhj_jiangzhu_convert: {
            charlotte: true,
            trigger: { player: ["gainAfter", "enterGame"], global: ["loseAsyncAfter", "gameDrawAfter", "phaseBefore"] },
            forced: true,
            silent: true,
            firstDo: true,
            priority: 50,
            filter(event, player) { return player.hasCard(card => ordinary(card, player), "h"); },
            async content(event, trigger, player) { convertHand(player); },
        },
        hlhj_qingsi_redirect: {
            mod: {
                ignoredHandcard(card, player) {
                    if (get.name(card, player) === "hlhj_qingsi") return true;
                },
                cardDiscardable(card, player, reason) {
                    if (reason === "phaseDiscard" && get.name(card, player) === "hlhj_qingsi") return false;
                },
            },
            trigger: { target: "useCardToTarget" },
            direct: true,
            priority: 10,
            filter: canRedirect,
            async content(event, trigger, player) {
                const target = bond(player);
                voiceScope(player, "qingsi", event);
                const result = await player.chooseToRespond({
                    prompt: `情思：可打出一张【情思】，将${get.translation(trigger.card)}对你的这一次效果转移给${get.translation(target)}${trigger.targets.includes(target) ? "（其额外承受一次效果）" : ""}`,
                    position: "h",
                    filterCard(card, player) { return get.name(card, player) === "hlhj_qingsi"; },
                    ai(card) {
                        const evt = _status.event;
                        return evt.hlhj_effect > 0 ? 8 - get.value(card) : 0;
                    },
                }).set("hlhj_effect", get.effect(target, trigger.card, trigger.player, player) -
                    get.effect(player, trigger.card, trigger.player, player)).forResult();
                // Losing a flower-tagged 情思 can itself cause 归梦. A completed
                // response still transfers its effect to the captured living bond.
                if (!result.bool || !target.isIn()) return;
                const use = trigger.getParent();
                const index = use.targets.indexOf(player);
                if (index < 0) return;
                player.logSkill("hlhj_jiangzhu", target);
                speak(player, "qingsi");
                // Replace this occurrence, not all occurrences of the same target.
                // Preserve duplicates: area tricks must resolve the transferred
                // effect in addition to the bond's original effect.
                const triggeredIndex = use.triggeredTargets2.indexOf(player);
                if (triggeredIndex >= 0) use.triggeredTargets2.splice(triggeredIndex, 1);
                use.targets.splice(index, 1);
                use.targets.push(target);
            },
        },
        hlhj_mushi: {
            trigger: { global: "phaseBefore", player: "enterGame" },
            forced: true,
            filter(event, player) {
                return !player.storage.hlhj_mushi_chosen && (event.name !== "phase" || game.phaseNumber === 0);
            },
            async content(event, trigger, player) {
                sync(player, "hlhj_mushi_chosen", true);
                const result = await player.chooseTarget("木石前缘：选择一名角色作为木石缘", true,
                    (card, player, target) => target.isIn())
                    .set("ai", target => get.attitude(_status.event.player, target)).forResult();
                if (result.bool) { setBond(player, result.targets[0]); speak(player, "bond"); }
            },
            marktext: "缘",
            intro: { content: "players" },
            group: ["hlhj_lei", "hlhj_turn", "hlhj_mushi_change", "hlhj_mushi_clear"],
            onremove(player) { setBond(player, null); },
        },
        hlhj_mushiyuan: {
            charlotte: true,
            mark: true,
            marktext: "木石",
            intro: {
                name: "木石缘",
                content(storage) {
                    return Array.isArray(storage) && storage.length ? `你是${get.translation(storage)}的【木石缘】。` : "木石缘";
                },
            },
            onremove: true,
        },
        hlhj_mushi_change: {
            trigger: { player: "phaseBegin" },
            direct: true,
            filter(event, player) {
                return player.hasCard(card => canDiscardQingsi(card, player), "h") && game.hasPlayer(target => target !== bond(player));
            },
            async content(event, trigger, player) {
                const result = await player.chooseCardTarget({
                    prompt: "木石前缘：可弃置一张【情思】，重新指定木石缘",
                    position: "h", selectCard: 1, selectTarget: 1,
                    filterCard(card, player) {
                        return get.name(card, player) === "hlhj_qingsi" && lib.filter.cardDiscardable(card, player, "hlhj_mushi");
                    },
                    filterTarget(card, player, target) { return target !== player.getStorage("hlhj_mushi")[0]; },
                    ai1: card => 6 - get.value(card),
                    ai2(target) {
                        const p = _status.event.player, old = p.getStorage("hlhj_mushi")[0];
                        return get.attitude(p, target) - (old?.isIn() ? get.attitude(p, old) : 0);
                    },
                }).forResult();
                if (!result.bool) return;
                const target = result.targets[0], card = result.cards[0];
                if (!target?.isIn() || !player.getCards("h").includes(card) || !canDiscardQingsi(card, player)) return;
                voiceScope(player, "changeBond", event);
                // Set the new bond only after the mandatory cost has left hand.
                await player.discard(card);
                if (player.isIn() && target.isIn() && !player.getCards("h").includes(card)) {
                    player.logSkill("hlhj_mushi", target);
                    setBond(player, target);
                    speak(player, "changeBond");
                }
            },
        },
        hlhj_mushi_clear: {
            trigger: { player: "dieAfter" },
            forced: true, silent: true, forceDie: true,
            async content(event, trigger, player) { setBond(player, null); },
        },
        hlhj_lei: {
            charlotte: true,
            marktext: "泪",
            intro: {
                name: "绛珠之泪",
                content(storage, player) {
                    return `共有${player.countMark("hlhj_lei")}枚泪；归梦阈值：${threshold()}。<br>本回合下次潇湘得泪：${(player.storage.hlhj_gain_step || 0) + 1}；下次失泪：${(player.storage.hlhj_loss_step || 0) + 1}。`;
                },
            },
        },
        hlhj_turn: {
            charlotte: true,
            trigger: { global: "phaseBefore" },
            forced: true,
            silent: true,
            firstDo: true,
            priority: 100,
            async content(event, trigger, player) {
                for (const key of ["hlhj_flower_step", "hlhj_gain_step", "hlhj_loss_step", "hlhj_wish_used"]) sync(player, key, 0);
            },
        },
        hlhj_xiangduan: {
            trigger: { global: ["loseAfter", "loseAsyncAfter"] },
            direct: true,
            filter(event, player) { return discarded(event, player).length > 0; },
            async content(event, trigger, player) {
                const cards = discarded(trigger, player);
                if (!cards.length) return;
                const count = (player.storage.hlhj_flower_step || 0) + 1;
                const result = await player.chooseButton([
                    `葬花：选择一张弃牌，然后选择“复制原牌”或“随机同类型牌”。你获得原牌及${count - 1}张复制牌，存活且不为你自己的木石缘获得${count}张复制牌`, cards,
                ]).set("ai", () => {
                    const p = _status.event.player;
                    return p.countCards("h") < p.hp + 3 ? 1 : 0;
                }).forResult();
                if (!result.bool || get.position(result.links[0], true) !== "d" || !player.isIn()) return;
                const original = result.links[0];
                const choice = await player.chooseControl("复制原牌", "随机同类型牌", "cancel2")
                    .set("prompt", `葬花：选择【${get.translation(original)}】的复制方式`)
                    .set("prompt2", "本次你与木石缘的所有复制牌采用同一种方式：复制原牌，保留原牌的牌名、花色、点数和属性；随机同类型牌，则每张分别独立随机。取消不计发动次数。")
                    .set("choice", 0)
                    .set("ai", () => 0).forResult();
                if (!["复制原牌", "随机同类型牌"].includes(choice.control) ||
                    get.position(original, true) !== "d" || !player.isIn()) return;
                const randomType = choice.control === "随机同类型牌";
                player.logSkill("hlhj_xiangduan");
                step(player, "hlhj_flower_step");
                // Capture the recipient and card face before Daiyu's gain changes
                // basic/weapon cards into 情思 or a gain trigger changes the bond.
                const target = bond(player);
                const shared = target?.isIn() && target !== player ? Array.from({ length: count }, () => flowerCopy(original, randomType)) : [];
                voiceScope(player, "collect", event);
                const flowers = [original];
                for (let i = 1; i < count; i++) {
                    flowers.push(flowerCopy(original, randomType));
                }
                const next = player.gain(flowers, "gain2");
                // Finish card-name conversion at gainAfter before adding the flower tag.
                next.set("hlhj_flower_owner", player);
                await next;
                // Match Daiyu's original plus all bonus copies. Every shared card
                // uses the same temporary-card destruction rule as her copies.
                // A self-bond is a single recipient and never doubles the reward.
                if (shared.length) {
                    if (target.isIn()) { await target.gain(shared, "gain2"); speak(player, "share"); }
                    else for (const card of shared) card.selfDestroy(event);
                } else speak(player, "collect");
            },
            group: ["hlhj_hua", "hlhj_hua_gain", "hlhj_turn"],
            onremove(player) {
                player.removeGaintag("hlhj_hua");
            },
        },
        hlhj_hua_gain: {
            charlotte: true,
            trigger: { player: "gainAfter" },
            forced: true,
            silent: true,
            firstDo: true,
            priority: 40,
            filter(event, player) { return event.hlhj_flower_owner === player; },
            async content(event, trigger, player) {
                // 花 is a tag on the resulting card; it never restores its former name.
                if (player.hasSkill("hlhj_jiangzhu")) convertHand(player);
                const flowers = trigger.cards.filter(card => get.owner(card) === player && get.position(card) === "h");
                if (flowers.length) player.addGaintag(flowers, "hlhj_hua");
            },
        },
        hlhj_hua: {
            charlotte: true,
            trigger: { player: "loseAfter" },
            forced: true,
            firstDo: true,
            priority: 30,
            filter(event, player) { return !player.storage.hlhj_dreaming && lostFlowerCount(event) > 0; },
            async content(event, trigger, player) {
                if (!mushiPaying.has(player)) speak(player, "flowerLost");
                await tears(player, lostFlowerCount(trigger));
            },
        },
        hlhj_zanghuayin: {
            enable: "phaseUse",
            filter(event, player) {
                return _status.currentPhase === player && player.hasCard(card => card.hasGaintag("hlhj_hua"), "h");
            },
            position: "h",
            filterCard(card) { return card.hasGaintag("hlhj_hua"); },
            selectCard: [1, Infinity],
            discard: false,
            lose: false,
            delay: false,
            prompt: "葬花吟：将任意数量的花牌置入弃牌堆，失去的每张花立即获得一枚泪",
            check(card) {
                const player = _status.event.player;
                if (player.countMark("hlhj_lei") + ui.selected.cards.length + 1 >= threshold()) return 0;
                return 7 - get.value(card);
            },
            async content(event, trigger, player) {
                const flowers = event.cards.filter(card => get.owner(card) === player &&
                    get.position(card) === "h" && card.hasGaintag("hlhj_hua"));
                // The common flower-loss trigger grants tears; do not grant them twice.
                if (flowers.length) { speak(player, "bury"); await player.loseToDiscardpile(flowers); }
            },
            ai: { order: 2, result: { player: 1 } },
        },
        hlhj_xiaoxiang: {
            trigger: { global: ["gainAfter", "loseAsyncAfter", "swapHandcardsAfter", "useCardToTargeted"] },
            direct: true,
            filter(event, player) {
                if (player.storage.hlhj_dreaming) return false;
                if (event.name !== "useCardToTargeted") return transfer(event, player);
                const target = bond(player);
                return target?.isIn() && event.target === target && event.player !== target &&
                    event.targets.includes(target) && get.color(event.card, event.player) === "red" &&
                    !(event.getParent().hlhj_red_seen || []).includes(player.playerid);
            },
            async content(event, trigger, player) {
                if (trigger.name === "useCardToTargeted") {
                    (trigger.getParent().hlhj_red_seen ??= []).push(player.playerid);
                }
                const amount = (player.storage.hlhj_gain_step || 0) + 1;
                const reason = trigger.name === "useCardToTargeted" ? "木石缘成为红色牌的目标" : "木石缘与其他角色发生牌的转移";
                const result = await player.chooseBool(`潇湘妃子：${reason}，是否获得${amount}枚【泪】？`)
                    .set("choice", player.countMark("hlhj_lei") + amount < threshold()).forResult();
                if (!result.bool || !player.isIn() || player.storage.hlhj_dreaming) return;
                player.logSkill("hlhj_xiaoxiang");
                speak(player, "tearsGain");
                await tears(player, step(player, "hlhj_gain_step"));
            },
            group: ["hlhj_xiaoxiang_loss", "hlhj_turn"],
        },
        hlhj_xiaoxiang_loss: {
            trigger: { target: "useCardToTarget" },
            forced: true,
            priority: 20,
            filter(event, player) {
                return event.player === bond(player) && player.countMark("hlhj_lei") > 0 &&
                    !(event.getParent().hlhj_loss_seen || []).includes(player.playerid);
            },
            async content(event, trigger, player) {
                (trigger.getParent().hlhj_loss_seen ??= []).push(player.playerid);
                player.removeMark("hlhj_lei", Math.min(player.countMark("hlhj_lei"), step(player, "hlhj_loss_step")));
                speak(player, "tearsLost");
                sync(player, "hlhj_lei", player.countMark("hlhj_lei"));
            },
        },
        hlhj_guimeng: {
            appearanceThreshold: threshold,
            trigger: { global: ["dieAfter", "phaseBefore", "enterGame"] },
            forced: true,
            silent: true,
            filter(event, player) { return !player.storage.hlhj_dreaming && player.countMark("hlhj_lei") >= threshold(); },
            async content(event, trigger, player) { await dream(player); },
            group: "hlhj_guimeng_gift",
            derivation: "hlhj_yiyuan",
        },
        hlhj_guimeng_gift: {
            trigger: { player: "dieBefore" },
            direct: true,
            forceDie: true,
            priority: 100,
            filter(event, player) { return bond(player)?.isIn() && !player.storage.hlhj_gifted; },
            async content(event, trigger, player) {
                const target = bond(player);
                const result = await player.chooseBool(`绛珠归梦：是否令${get.translation(target)}获得【绛珠遗愿】？`)
                    .set("forceDie", true).set("choice", get.attitude(player, target) > 0).forResult();
                if (!result.bool || !target?.isIn()) return;
                sync(player, "hlhj_gifted", true);
                player.logSkill("hlhj_guimeng", target);
                target.addSkill("hlhj_yiyuan");
                speak(player, "gift");
            },
        },
        hlhj_yiyuan: {
            trigger: { player: "damageEnd" },
            forced: true,
            filter(event, player) { return player.isIn() && player.isDamaged(); },
            async content(event, trigger, player) { speak(player, "recover"); await player.recover(); },
            mark: true,
            marktext: "愿",
            intro: { content: "锁定技，当你受到伤害后，若你存活，你回复1点体力。每回合限一次，当其他角色受到伤害时，你可以将此伤害转移给你（同一次伤害不能重复转移）。" },
            group: ["hlhj_yiyuan_guard", "hlhj_turn"],
        },
        hlhj_yiyuan_guard: {
            trigger: { global: "damageBegin4" },
            direct: true,
            priority: 10,
            filter(event, player) {
                return event.player !== player && event.num > 0 && !player.storage.hlhj_wish_used && !event.hlhj_guarded;
            },
            async content(event, trigger, player) {
                const result = await player.chooseBool(`绛珠遗愿：代替${get.translation(trigger.player)}承受${trigger.num}点伤害？`)
                    .set("choice", get.attitude(player, trigger.player) > 0 && player.hp > trigger.num).forResult();
                if (!result.bool || !player.isIn()) return;
                sync(player, "hlhj_wish_used", 1);
                player.logSkill("hlhj_yiyuan", trigger.player);
                speak(player, "guard");
                trigger.hlhj_guarded = true;
                trigger.player = player;
            },
        },
    };
    const baoyu = createBaoyu(lib, game, ui, get, ai, _status, sync);
    Object.assign(skill, baoyu.skills);
    // Skill activation visuals still use logSkill; semantic cues above replace
    // native filename guessing, including inherited 遗愿 on another general.
    for (const info of Object.values(skill)) info.audio = false;
    const translate = {
        hlhj_jiangzhu: "绛珠仙子",
        hlhj_jiangzhu_info: "锁定技，你的身份不能分配为内奸。基本牌、伤害牌和武器牌进入你的手牌后，转化为【情思】，保留花色和点数。【情思】不计入手牌上限，且不因手牌上限而弃置。转化牌进入牌堆或弃牌堆时恢复原牌；额外生成的牌则销毁。",
        hlhj_qingsi_redirect: "情思",
        hlhj_mushi: "木石前缘",
        hlhj_mushi_info: "①游戏开始时，你选择一名角色成为你的“木石缘”。②回合开始时，你可以弃置一张【情思】，令另一名角色成为你的“木石缘”。③当你获得“泪”时，你可以令你或存活的“木石缘”摸等量的牌。若你以此法摸牌，你须弃置一张【情思】（无可弃置的【情思】则不弃置；此弃牌结算期间获得的“泪”不触发此项效果）。",
        hlhj_mushi_change: "木石·换缘",
        hlhj_mushiyuan: "木石缘",
        hlhj_mushi_bg: "缘",
        hlhj_mushiyuan_bg: "木石",
        hlhj_mushiyuan_info: "你是标记所示角色的“木石缘”。其重新指定“木石缘”或死亡后，移除此关系。",
        hlhj_xiangduan: "香断谁怜",
        hlhj_xiangduan_info: "①当其他角色弃置牌后，你可以选择其中一张仍在弃牌堆的牌，并选择“复制原牌”或“随机同类型牌”。你获得原牌及X张复制牌（X为本回合此项发动次数减一）；若你的“木石缘”存活且不为你，其获得与你以此法获得牌数相同的复制牌。本次双方的复制牌均按你所选方式生成：复制原牌时，牌名、花色、点数和属性均与原牌相同；随机同类型牌时，每张独立随机，允许重复，类型按基本牌、锦囊牌（含延时锦囊）、装备牌区分。取消不计次数。你以此法获得的牌结算〖绛珠仙子〗后，标记为“花”。②当你失去“花”时，你获得等量的“泪”，并移去这些牌的“花”标记。③随机同类型的复制牌保留所选弃牌的花色、点数，同名时保留属性，异名时无属性；所有复制牌进入牌堆或弃牌堆时销毁。",
        hlhj_zanghuayin: "葬花吟",
        hlhj_zanghuayin_info: "出牌阶段，你可以将任意张标记为“花”的手牌置入弃牌堆，然后依〖香断谁怜〗获得等量的“泪”。",
        hlhj_hua: "花",
        hlhj_hua_bg: "花",
        hlhj_lei: "泪",
        hlhj_lei_bg: "泪",
        hlhj_xiaoxiang: "潇湘妃子",
        hlhj_xiaoxiang_info: "①当你的“木石缘”与其他角色之间发生牌的转移后，或成为其他角色使用红色牌的目标后，你可以获得X枚“泪”（同一次牌的转移或使用仅触发一次）。②当你成为“木石缘”使用牌的目标时，若你有“泪”，你失去Y枚“泪”（不足则全部失去）。X、Y分别为本回合对应项的发动次数。",
        hlhj_xiaoxiang_loss: "潇湘·失泪",
        hlhj_guimeng: "绛珠归梦",
        hlhj_guimeng_info: "①锁定技，当你的“泪”数不小于X时，你弃置所有手牌，然后死亡（X为场上存活角色数的四倍，且至少为16）。②你死亡前，可以令存活的“木石缘”获得〖绛珠遗愿〗。",
        hlhj_guimeng_gift: "绛珠归梦",
        hlhj_yiyuan: "绛珠遗愿",
        hlhj_yiyuan_info: "①锁定技，当你受到伤害后，若你存活，你回复1点体力。②每回合限一次，当其他角色受到伤害时，你可以将此伤害转移给你（同一次伤害不能重复转移）。",
        hlhj_yiyuan_guard: "遗愿·代伤",
        ...baoyu.translate,
    };
    return {
        name: "红楼幻境",
        editable: false,
        connect: true,
        content() {},
        precontent() {
            game.addGroup("hlhj_ming", "命", "命", { color: "#b88caa" });
            game.addGroup("hlhj_qing", "情", "情", { color: "#c97989" });
            game.hlhjResolveIdentity = resolveIdentity;
            const voices = installVoiceRuntime(lib, game, ui, get, _status);
            voices.register(voiceSpec);
            skill._hlhj_voice_events = voices.ruleSkill;
            installCharacterAppearance(lib, game, ui, get, _status, appearancePaths);
        },
        config: {
            voices: {
                name: "当前角色配音 · 开关 / 音量 / 字幕 / 试听", clear: true,
                onclick() { game.hlhjVoice?.open(); },
            },
            appearance: {
                name: "当前角色风华 · 原画 / 背景 / 音乐",
                clear: true,
                onclick() { game.hlhjAppearance?.open(); },
            },
        },
        help: { "红楼幻梦": "命运系 · 绛珠仙子；情缘系 · 绛洞花主。规则细节及安装说明见扩展内 README.md。" },
        package: {
            character: {
                connect: true,
                character: {
                    hlhj_daiyu: {
                        sex: "female", group: "hlhj_ming", hp: 3,
                        skills: ["hlhj_jiangzhu", "hlhj_mushi", "hlhj_xiangduan", "hlhj_zanghuayin", "hlhj_xiaoxiang", "hlhj_guimeng"],
                        img: appearancePaths.theme + "daiyu-bamboo.png", dieAudios: [],
                    },
                    hlhj_baoyu: {
                        sex: "male", group: "hlhj_qing", hp: 4, maxHp: 4,
                        skills: ["hlhj_baoyu_jiangzhu", "hlhj_xianyu", "hlhj_gongdu", "hlhj_mengyou", "hlhj_qingyu", "hlhj_duzhuan"],
                        // No invented portrait or audio path; reserve a blank image.
                        img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='420'/%3E", dieAudios: [],
                    },
                },
                translate: { hlhj_daiyu: "绛珠仙子", hlhj_baoyu: "绛洞花主", hlhj_mingyun: "命运", hlhj_qingyuan: "情缘" },
                characterSort: { "红楼幻境": { hlhj_mingyun: ["hlhj_daiyu"], hlhj_qingyuan: ["hlhj_baoyu"] } },
                characterIntro: {
                    hlhj_daiyu: "命运体系 · 情感辅助。以情生泪，以泪渡情，最终以自身命运成全知己。",
                    hlhj_baoyu: "情缘系 · 贾宝玉。衔玉入尘，借笺问情；梦中见命，花前留诔。以通灵宝玉护身，以西厢共读相知，以芙蓉诔悼念亡友。原画、配音等素材待补。",
                },
            },
            card: {
                connect: true,
                card: {
                    ...baoyu.cards,
                    hlhj_qingsi: {
                        type: "basic", enable: false,
                        fullskin: true, image: "ext:红楼幻境/hlhj_qingsi.png",
                        destroy: qingsiReturn, destroyLog: false,
                        global: "hlhj_qingsi_redirect",
                        ai: { basic: { useful: 5, value: 5 } },
                    },
                },
                translate: { ...baoyu.translate, hlhj_qingsi: "情思", hlhj_qingsi_info: "当你成为其他角色使用牌的目标时，你可以打出此牌，将该牌对你的此次效果转移给存活且不为你的“木石缘”，无视目标限制；若其已是目标，则额外结算一次。此牌不计入手牌上限，且不因手牌上限而弃置，不能主动使用或作为转化前的牌使用。进入牌堆或弃牌堆时，转化牌恢复原牌，额外生成的牌销毁。" },
                list: [],
            },
            skill: { skill, translate },
            intro: "命运系 · 绛珠仙子；情缘系 · 绛洞花主。以情生泪，以玉护花，以书结缘。",
            author: "红楼幻梦", version: "1.3.4", diskURL: "", forumURL: "",
        },
        files: {
            character: ["hlhj_daiyu.svg", "theme/daiyu-bamboo.png", "theme/daiyu-dream.png",
                ...Object.values(themes).flatMap(theme => [theme.image, theme.poster, theme.portrait?.image].filter(Boolean).map(file => "theme/" + file))],
            video: Object.values(themes).flatMap(theme => [theme.video, theme.portrait?.video].filter(Boolean).map(file => "theme/" + file)),
            card: ["hlhj_qingsi.png"], skill: [], audio: [
                ...Object.values(themes).flatMap(theme => theme.tracks.map(track => "theme/" + track)),
                ...Object.values(voiceSpec.clips).flatMap(clip => voiceFiles(clip).map(file => "theme/voices/hlhj_daiyu/" + file)),
            ],
        },
    };
}
