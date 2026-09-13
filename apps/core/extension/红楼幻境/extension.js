export const type = "extension";

export default function (lib, game, ui, get, ai, _status) {
    const bond = player => player.getStorage("hlhj_mushi")[0];
    const threshold = () => Math.max(8, game.countPlayer() * 2);
    const ordinary = (card, player) => get.position(card) === "h" &&
        get.owner(card) === player && !card.hasGaintag("hlhj_hua") &&
        card.name !== "hlhj_qingsi" && (lib.card[card.name]?.type === "basic" ||
            lib.card[card.name]?.subtype === "equip1");
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
        // A real card-name change also updates the face and serialized card data.
        // Never retain an original-name fallback on an independent 情思 card.
        const change = function (cards) {
            for (const card of cards) {
                const id = card.cardid;
                const tags = card.gaintag.slice();
                card.init([card.suit, card.number, "hlhj_qingsi"]);
                card.cardid = id;
                card.addGaintag(tags);
            }
        };
        change(cards);
        // Private hands must not be broadcast to other seats. Public use/gain
        // messages will reveal the converted name when the card is revealed.
        player.send(change, cards);
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
        const cards = player.getCards("h");
        // 规则要求弃置全部手牌，不受主动弃牌选择的限制。
        if (cards.length) await player.discard(cards);
        if (player.isIn()) await player.die();
    }
    async function tears(player, amount) {
        if (!player.isIn() || player.storage.hlhj_dreaming || amount <= 0) return;
        player.addMark("hlhj_lei", amount);
        sync(player, "hlhj_lei", player.countMark("hlhj_lei"));
        if (player.hasSkill("hlhj_mushi")) {
            const result = await player.chooseTarget(`木石前缘：可令自己或木石缘摸${amount}张牌（选自己后弃置一张情思）`,
                function (card, player, target) {
                    return target === player || target === player.getStorage("hlhj_mushi")[0];
                }).set("ai", target => get.attitude(_status.event.player, target)).forResult();
            if (result.bool && result.targets[0]?.isIn() && player.isIn()) {
                const target = result.targets[0];
                player.logSkill("hlhj_mushi", target);
                await target.draw(amount);
                if (target === player && player.isIn()) {
                    convertHand(player);
                    await discardQingsi(player);
                }
            }
        }
        await dream(player);
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
        return target?.isIn() && event.player !== player && event.target === player &&
            !event.targets.includes(target) &&
            lib.filter.targetEnabled(event.card, event.player, target) &&
            player.hasCard(card => get.name(card, player) === "hlhj_qingsi" &&
                lib.filter.cardRespondable(card, player), "h");
    }
    const skill = {
        hlhj_jiangzhu: {
            locked: true,
            init(player) { convertHand(player); },
            mod: {
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
            trigger: { target: "useCardToTarget" },
            direct: true,
            priority: 10,
            filter: canRedirect,
            async content(event, trigger, player) {
                const target = bond(player);
                const result = await player.chooseToRespond({
                    prompt: `情思：打出一张【情思】，将${get.translation(trigger.card)}对你的目标转移给${get.translation(target)}`,
                    position: "h",
                    filterCard(card, player) { return get.name(card, player) === "hlhj_qingsi"; },
                    ai(card) {
                        const evt = _status.event;
                        return evt.hlhj_effect > 0 ? 8 - get.value(card) : 0;
                    },
                }).set("hlhj_effect", get.effect(target, trigger.card, trigger.player, player) -
                    get.effect(player, trigger.card, trigger.player, player)).forResult();
                if (!result.bool || !target.isIn() || !player.isIn()) return;
                const use = trigger.getParent();
                if (!use.targets.includes(player) || use.targets.includes(target) ||
                    !lib.filter.targetEnabled(trigger.card, trigger.player, target)) return;
                player.logSkill("hlhj_jiangzhu", target);
                use.triggeredTargets2.remove(player);
                use.targets.remove(player);
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
                if (result.bool) setBond(player, result.targets[0]);
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
                // Set the new bond only after the mandatory cost has left hand.
                await player.discard(card);
                if (player.isIn() && target.isIn() && !player.getCards("h").includes(card)) {
                    player.logSkill("hlhj_mushi", target);
                    setBond(player, target);
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
                    `葬花：选择一张弃牌，获得它及${count - 1}张复制花（回合结束转为泪）`, cards,
                ]).set("ai", () => {
                    const p = _status.event.player;
                    return p.countCards("h") < p.hp + 3 ? 1 : 0;
                }).forResult();
                if (!result.bool || get.position(result.links[0], true) !== "d" || !player.isIn()) return;
                player.logSkill("hlhj_xiangduan");
                step(player, "hlhj_flower_step");
                const original = result.links[0];
                const flowers = [original];
                for (let i = 1; i < count; i++) {
                    const copy = game.createCard2(original.name, original.suit, original.number, original.nature);
                    // Copies must remain usable as the original card, including
                    // equipment and delayed tricks. Destroy only upon discard,
                    // never on moving into ordering/equipment/judgement areas.
                    copy.destroyed = "discardPile";
                    flowers.push(copy);
                }
                const next = player.gain(flowers, "gain2");
                next.gaintag.add("hlhj_hua");
                await next;
            },
            group: ["hlhj_hua", "hlhj_turn"],
            onremove(player) {
                player.removeGaintag("hlhj_hua");
            },
        },
        hlhj_hua: {
            charlotte: true,
            trigger: { global: "phaseAfter" },
            forced: true,
            filter(event, player) { return player.hasCard(card => card.hasGaintag("hlhj_hua"), "h"); },
            async content(event, trigger, player) {
                const flowers = player.getCards("h", card => card.hasGaintag("hlhj_hua"));
                const amount = flowers.length;
                await player.loseToDiscardpile(flowers);
                await tears(player, amount);
            },
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
                sync(player, "hlhj_lei", player.countMark("hlhj_lei"));
            },
        },
        hlhj_guimeng: {
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
            },
        },
        hlhj_yiyuan: {
            trigger: { player: "damageEnd" },
            forced: true,
            filter(event, player) { return player.isIn() && player.isDamaged(); },
            async content(event, trigger, player) { await player.recover(); },
            mark: true,
            marktext: "愿",
            intro: { content: "受到伤害后回复1点体力；每个角色回合限一次，可代替其他角色承受一次伤害。" },
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
                trigger.hlhj_guarded = true;
                trigger.player = player;
            },
        },
    };
    const translate = {
        hlhj_jiangzhu: "绛珠仙子",
        hlhj_jiangzhu_info: "锁定技，你的非花基本手牌和武器手牌转化为独立牌【情思】，保留花色与点数，不再具有原牌效果。花牌保留原牌名、属性和效果。情思只能用于自身的目标转移效果或技能要求的弃置，不能当作原牌使用或打出。装备区内的武器不转化。",
        hlhj_qingsi_redirect: "情思",
        hlhj_mushi: "木石前缘",
        hlhj_mushi_info: "游戏开始时，选择一名角色为木石缘（不限性别，可以是自己）。你的回合开始时，你可弃置一张情思，改选一名不同角色为木石缘。当你获得泪时，可令自己或存活的木石缘摸等量牌；若选择自己，摸牌后须弃置一张情思（若没有可弃置的情思则不弃）。可以取消摸牌。",
        hlhj_mushi_change: "木石·换缘",
        hlhj_mushiyuan: "木石缘",
        hlhj_mushi_bg: "缘",
        hlhj_mushiyuan_bg: "木石",
        hlhj_mushiyuan_info: "你是标识所列角色的木石缘。其换缘或死亡后，移除对应关系。",
        hlhj_xiangduan: "香断谁怜",
        hlhj_xiangduan_info: "其他角色弃置牌后，你可发动“葬花”：获得其中仍在弃牌堆的一张牌并加手牌标记“花”。本回合第N次葬花额外获得N−1张同名、同花色、同点数、同属性的复制花。花可按原牌正常使用或打出，离手即失去花标记。每个角色回合结束后，你将手中剩余的所有花置入弃牌堆，并获得等量泪。复制牌进入弃牌堆时销毁，正常使用、装备或判定不提前销毁。",
        hlhj_hua: "花",
        hlhj_hua_bg: "花",
        hlhj_lei: "泪",
        hlhj_lei_bg: "泪",
        hlhj_xiaoxiang: "潇湘妃子",
        hlhj_xiaoxiang_info: "木石缘与其他角色间发生牌的转移，或成为其他角色使用红色牌的目标时，你可获得泪，本回合实际发动依次获得1、2、3…枚（每次转移事件或每次使用红色牌计一次；取消不递增）。木石缘以你为用牌目标时，你须失去泪，本回合依次为1、2、3…枚，最低为0；实际失泪后才递增。得泪与失泪独立计数，每个角色回合开始时重置。",
        hlhj_xiaoxiang_loss: "潇湘·失泪",
        hlhj_guimeng: "绛珠归梦",
        hlhj_guimeng_info: "泪达到场上存活角色数×2（至少8）时，你须弃置所有手牌并立即死亡，不进入濒死求桃。你死亡前，可令存活的木石缘永久获得【绛珠遗愿】，也可取消。人数减少导致阈值降低时也会检查。",
        hlhj_guimeng_gift: "绛珠归梦",
        hlhj_yiyuan: "绛珠遗愿",
        hlhj_yiyuan_info: "锁定技，受到伤害后，若你仍存活，回复1点体力。每个角色回合限一次，伤害结算前，你可以代替一名其他角色成为此次伤害的承受者；一次伤害只能被遗愿转移一次。致命伤害仍须先完成濒死结算。",
        hlhj_yiyuan_guard: "遗愿·代伤",
    };
    return {
        name: "红楼幻境",
        editable: false,
        connect: true,
        content() {},
        precontent() {
            game.addGroup("hlhj_ming", "命", "命", { color: "#b88caa" });
        },
        config: {},
        help: { "红楼幻境": "命运体系 · 绛珠仙子·黛玉。规则细节及安装说明见扩展内 README.md。" },
        package: {
            character: {
                connect: true,
                character: {
                    hlhj_daiyu: {
                        sex: "female", group: "hlhj_ming", hp: 3,
                        skills: ["hlhj_jiangzhu", "hlhj_mushi", "hlhj_xiangduan", "hlhj_xiaoxiang", "hlhj_guimeng"],
                        img: "extension/红楼幻境/hlhj_daiyu.svg", dieAudios: [],
                    },
                },
                translate: { hlhj_daiyu: "绛珠仙子·黛玉", hlhj_mingyun: "命运" },
                characterSort: { "红楼幻境": { hlhj_mingyun: ["hlhj_daiyu"] } },
                characterIntro: { hlhj_daiyu: "命运体系 · 情感辅助。以情生泪，以泪渡情，最终以自身命运成全知己。" },
            },
            card: {
                connect: true,
                card: {
                    hlhj_qingsi: {
                        type: "basic", enable: false,
                        fullskin: true, image: "ext:红楼幻境/hlhj_qingsi.png",
                        global: "hlhj_qingsi_redirect",
                        ai: { basic: { useful: 5, value: 5 } },
                    },
                },
                translate: { hlhj_qingsi: "情思", hlhj_qingsi_info: "独立基本牌。当你成为其他角色使用牌的目标时，你可打出此牌，将其中对你的目标改为木石缘；木石缘须存活、合法且尚未成为此牌目标，忽略距离。不能当作转化前的原牌使用或打出。" },
                list: [],
            },
            skill: { skill, translate },
            intro: "命运体系 · 绛珠仙子·黛玉。以情生泪，以泪渡情。",
            author: "红楼幻境", version: "1.2.1", diskURL: "", forumURL: "",
        },
        files: { character: ["hlhj_daiyu.svg"], card: ["hlhj_qingsi.png"], skill: [], audio: [] },
    };
}
