// 绛洞花主：规则与素材分离，原画、卡面插画和配音均可后续补入。
export function createBaoyu(lib, game, ui, get, ai, _status, sync) {
    const readers = owner => owner.getStorage("hlhj_gongdu");
    const partner = owner => readers(owner)[0];
    const pages = owner => owner.getStorage("hlhj_book_pages");
    const jade = owner => owner.getStorage("hlhj_jade")[0];
    const memorials = owner => owner.getStorage("hlhj_furonglei");
    const owners = player => game.filterPlayer(owner => owner.hasSkill("hlhj_gongdu") &&
        partner(owner)?.isIn() && (owner === player || partner(owner) === player));
    const availablePages = owner => pages(owner).filter(page => owner.getExpansions("hlhj_book").includes(page.card));
    const isLetter = card => card.name === "hlhj_qingjian";
    const isDamageHand = (card, player) => get.owner(card) === player && get.position(card) === "h" &&
        !isLetter(card) && !!get.tag({ name: card.name, nature: card.nature }, "damage");
    const basicNames = () => lib.inpile.filter(name => lib.card[name]?.type === "basic" &&
        !["hlhj_qingsi", "hlhj_qingjian"].includes(name));
    const epitaphNames = () => lib.inpile.filter(name => ["basic", "trick"].includes(lib.card[name]?.type) &&
        !get.tag({ name }, "damage") && !["hlhj_qingsi", "hlhj_qingjian"].includes(name));

    function convertHand(player) {
        const cards = player.getCards("h", card => isDamageHand(card, player));
        if (!cards.length) return;
        const change = function (cards) {
            for (const card of cards) {
                const id = card.cardid, tags = card.gaintag.slice();
                card.storage.hlhj_qingjian_source = {
                    face: [card.suit, card.number, card.name, card.nature],
                    temporary: !!card.storage.hlhj_temporary,
                };
                card.storage.hlhj_qingjian_destroyed = card.destroyed;
                card.init([card.suit, card.number, "hlhj_qingjian"]);
                card.cardid = id;
                card.addGaintag(tags);
            }
        };
        change(cards);
        player.send(change, cards);
    }
    function letterReturn(card, position, player, event) {
        if (!["discardPile", "cardPile"].includes(position)) return false;
        const source = card.storage.hlhj_qingjian_source;
        if (!source || source.temporary || card.storage.hlhj_temporary) return true;
        const id = card.cardid, tags = card.gaintag.slice();
        const previous = card.storage.hlhj_qingjian_destroyed;
        delete card.storage.hlhj_qingjian_source;
        delete card.storage.hlhj_qingjian_destroyed;
        delete card.destroyed;
        card.init(source.face);
        card.cardid = id;
        card.addGaintag(tags);
        if (previous !== undefined) card.destroyed = previous;
        return card.willBeDestroyed(position, player, event);
    }
    // A letter can respond with Sha/Shan, but using it may only target oneself.
    // In particular it cannot save another dying character with Tao.
    function letterAllowed(event, player, card) {
        if (event.dying && event.dying !== player) return false;
        if (!event.filterCard(card, player, event)) return false;
        if (event.name === "chooseToRespond") return true;
        const info = lib.card[card.name];
        if (info.notarget) return true;
        return lib.filter.targetEnabled2(card, player, player) &&
            (!event.filterTarget || event.filterTarget(card, player, player));
    }
    function basicOptions(event, player, material) {
        const result = [];
        for (const name of basicNames()) {
            const natures = name === "sha" ? [undefined, ...(lib.inpile_nature || [])] : [undefined];
            for (const nature of natures) {
                const card = get.autoViewAs({ name, nature, storage: { hlhj_letter: true } }, material ? [material] : []);
                if (letterAllowed(event, player, card)) result.push(["基本", "", name, nature]);
            }
        }
        return result;
    }
    function jadeWorks(holder, source, card) {
        return holder?.isIn() && holder.hasSkill("hlhj_moshi", null, false) &&
            !holder.hasSkillTag("unequip2") && !source?.hasSkillTag("unequip", false, {
                target: holder, card, name: card?.name,
            });
    }
    function guardedJade(owner, source, card) {
        const item = jade(owner), holder = item && get.owner(item);
        return item && holder && get.position(item) === "e" && holder.getCards("e").includes(item) &&
            jadeWorks(holder, source, card) && lib.filter.cardDiscardable(item, holder, "hlhj_mengyou") ? item : null;
    }
    async function endReading(owner, recipient) {
        const book = availablePages(owner), other = partner(owner);
        sync(owner, "hlhj_gongdu", []);
        sync(owner, "hlhj_book_pages", []);
        sync(owner, "hlhj_book_session", (owner.storage.hlhj_book_session || 0) + 1);
        owner.unmarkSkill("hlhj_book");
        if (other) {
            const sources = other.getStorage("hlhj_readers").filter(current => current !== owner);
            sync(other, "hlhj_readers", sources);
            if (!sources.length) other.removeSkill("hlhj_readers");
        }
        // Clear the relation before moving cards: gain/lose skills may re-enter.
        const groups = new Map();
        for (const page of book) {
            const target = recipient || page.contributor;
            if (!groups.has(target)) groups.set(target, []);
            groups.get(target).push(page.card);
        }
        for (const [target, cards] of groups) {
            if (target?.isIn()) await target.gain(cards, owner, "give");
            else await owner.loseToDiscardpile(cards);
        }
    }
    async function addPages(owner, contributor, cards) {
        const session = owner.storage.hlhj_book_session;
        await owner.addToExpansion(cards, contributor, "give").gaintag.add("hlhj_book");
        const added = cards.filter(card => owner.getExpansions("hlhj_book").includes(card));
        if (session !== owner.storage.hlhj_book_session || !partner(owner)?.isIn() || !owner.isIn()) {
            if (added.length) {
                if (contributor.isIn()) await contributor.gain(added, "gain2");
                else await owner.loseToDiscardpile(added);
            }
            return;
        }
        sync(owner, "hlhj_book_pages", [...pages(owner), ...added.map(card => ({ card, contributor }))]);
        owner.markSkill("hlhj_book");
    }
    function bookLink(link, meta) {
        // Button options use tuples of primitives/references so hosted choices
        // can match the server's canonical option after serialization.
        return [...link, [meta.owner, meta.card, meta.contributor, meta.session, !!meta.letter, meta.epitaph ?? -1]];
    }
    function bookMeta(link) {
        const [owner, card, contributor, session, letter, epitaph] = link[4];
        return { owner, card, contributor, session, letter, ...(epitaph >= 0 ? { epitaph } : {}) };
    }
    function bookOptions(event, player) {
        const list = [];
        for (const owner of owners(player)) for (const page of availablePages(owner)) {
            if (game.checkMod(page.card, player, "unchanged", "cardEnabled2", player) === false) continue;
            const meta = { owner, card: page.card, contributor: page.contributor, session: owner.storage.hlhj_book_session };
            if (isLetter(page.card)) {
                for (const link of basicOptions(event, player, page.card)) list.push(bookLink(link, { ...meta, letter: true }));
            } else {
                const card = get.autoViewAs(page.card);
                if (event.filterCard(card, player, event)) {
                    list.push(bookLink([get.type(page.card), "", card.name, card.nature], meta));
                }
            }
            if (owner.hasSkill("hlhj_duzhuan") && owner.storage.hlhj_epitaph_round !== game.roundNumber) {
                memorials(owner).forEach((memorial, index) => {
                    const card = get.autoViewAs({ name: memorial.name }, [page.card]);
                    if (event.filterCard(card, player, event)) {
                        list.push(bookLink([get.type(card), "", memorial.name, undefined], { ...meta, epitaph: index }));
                    }
                });
            }
        }
        return list;
    }
    async function prepareBook(event, trigger, player) {
        const meta = event.result.card.storage.hlhj_read;
        const owner = meta.owner;
        if (!owner.isIn() || !partner(owner)?.isIn() ||
            ![owner, partner(owner)].includes(player) || owner.storage.hlhj_book_session !== meta.session ||
            !availablePages(owner).some(page => page.card === meta.card) ||
            (meta.epitaph !== undefined && owner.storage.hlhj_epitaph_round === game.roundNumber)) {
            event.result.bool = false;
            return;
        }
        // Move the actual page, never a copy. Use/respond consumes this material.
        event.result.cards = [meta.card];
        event.result.card.cards = [meta.card];
        sync(owner, "hlhj_book_pages", pages(owner).filter(page => page.card !== meta.card));
        if (meta.epitaph !== undefined) sync(owner, "hlhj_epitaph_round", game.roundNumber);
        // useCard/respond already move material from its real owner to ordering.
        // Moving it here would let precontent's ordering cleanup discard it early.
    }
    async function finishBook(event, trigger, player) {
        const meta = trigger.card.storage.hlhj_read;
        if (trigger.hlhj_read_finished) return;
        trigger.hlhj_read_finished = true;
        if (meta.contributor !== player && meta.contributor.isIn()) await meta.contributor.draw();
        const owner = meta.owner;
        if (!owner.isIn() || !player.isIn() || !partner(owner)?.isIn() ||
            owner.storage.hlhj_book_session !== meta.session) return;
        const result = await player.chooseCard("h", "共读西厢：可将一张手牌置为新书，否则结束共读")
            .set("ai", card => 5 - get.value(card)).forResult();
        if (owner.storage.hlhj_book_session !== meta.session) return;
        if (result.bool && owner.isIn() && partner(owner)?.isIn()) await addPages(owner, player, result.cards);
        else await endReading(owner);
    }
    // Tombs remain attached to the dead seat, and the owner's mark holds the
    // same public record for modes which hide dead player nodes.
    function showMemorial(dead, owner, name) {
        if (!dead?.node || typeof document === "undefined") return;
        dead._hlhjMemorials ||= new Map();
        let node = dead._hlhjMemorials.get(owner.playerid);
        if (!node) {
            node = document.createElement("div");
            node.className = "hlhj-furonglei";
            node.style.cssText = "position:absolute;left:4px;right:4px;bottom:4px;z-index:8;padding:5px 2px;border:1px solid #a48d70;border-radius:3px;background:#ede3d1;color:#624852;font:14px serif;text-align:center;pointer-events:none;line-height:1.4";
            dead.appendChild(node);
            dead._hlhjMemorials.set(owner.playerid, node);
        }
        node.textContent = "芙蓉诔 · " + get.translation(name);
        node.title = get.translation(owner) + "悼" + get.translation(dead);
    }
    function updateMemorial(owner, dead, name) {
        showMemorial(dead, owner, name);
        game.broadcast(function (dead, owner, name) {
            lib.skill.hlhj_furonglei.showMemorial(dead, owner, name);
        }, dead, owner, name);
    }
    async function chooseEpitaph(player, prompt, forced = false) {
        const names = epitaphNames();
        if (!names.length) return null;
        const result = await player.chooseButton([prompt, [names.map(name => [get.type(name), "", name]), "vcard"]], forced)
            .set("ai", button => ["tao", "wuzhong", "wuxie", "shan"].includes(button.link[2]) ? 2 : 1).forResult();
        return result.bool ? result.links[0][2] : null;
    }
    async function clearDream(owner) {
        const cards = owner.getExpansions("hlhj_dream");
        sync(owner, "hlhj_dream_target", []);
        if (cards.length) await owner.loseToDiscardpile(cards);
        owner.unmarkSkill("hlhj_dream");
    }
    async function placeDream(player, card) {
        // The generic expansion animation broadcasts card faces. Move the real
        // card privately and send only an opaque ID to the other seats instead.
        await player.lose([card], ui.special).set("type", "loseToExpansion").set("getlx", false);
        if (!player.isIn() || get.position(card, true) !== "s") {
            if (get.position(card, true) === "s") await game.cardsDiscard([card]);
            return false;
        }
        player.$addToExpansion([card], false, ["hlhj_dream"]);
        game.broadcast(function (player, card) {
            player.$addToExpansion([card], false, ["hlhj_dream"]);
        }, player, "_noname_card:" + JSON.stringify([card.cardid, null, null, null, null]));
        player.send(function (player, cards) {
            player.$addToExpansion(cards, false, ["hlhj_dream"], false);
        }, player, [card]);
        return true;
    }
    const skills = {
        hlhj_xianyu: {
            locked: true,
            init: convertHand,
            mod: {
                handcardGain: convertHand,
                cardname(card, player) { if (isDamageHand(card, player)) return "hlhj_qingjian"; },
                cardnature(card, player) { if (isDamageHand(card, player)) return false; },
            },
            group: ["hlhj_xianyu_start", "hlhj_xianyu_convert", "hlhj_xianyu_recall", "hlhj_qingjian_use"],
        },
        hlhj_xianyu_start: {
            trigger: { global: "phaseBefore", player: "enterGame" },
            forced: true, silent: true, firstDo: true, priority: 80,
            filter(event, player) { return !player.storage.hlhj_jade_created; },
            async content(event, trigger, player) {
                sync(player, "hlhj_jade_created", true);
                const card = game.createCard2("hlhj_tonglingbaoyu", "heart", 1);
                card.storage.hlhj_jade_owner = player.playerid;
                sync(player, "hlhj_jade", [card]);
                player.markSkill("hlhj_jade");
                if (player.canEquip(card, true)) await player.equip(card);
                else await player.gain(card, "gain2");
            },
        },
        hlhj_xianyu_convert: {
            trigger: { player: ["gainAfter", "enterGame"], global: ["gameDrawAfter", "loseAsyncAfter", "phaseBefore"] },
            forced: true, silent: true, firstDo: true, priority: 49,
            filter(event, player) { return player.hasCard(card => isDamageHand(card, player), "h"); },
            async content(event, trigger, player) { convertHand(player); },
        },
        hlhj_xianyu_recall: {
            trigger: { global: "phaseBefore" },
            direct: true, priority: 20,
            filter(event, player) {
                const card = jade(player);
                return card && !(get.owner(card) === player && get.position(card) === "e") &&
                    !card._selfDestroyed && !!card.parentNode && player.canEquip(card, true);
            },
            async content(event, trigger, player) {
                const result = await player.chooseBool("衔玉而生：收回并装备与你关联的通灵宝玉？")
                    .set("choice", true).forResult();
                const card = jade(player);
                if (result.bool && player.isIn() && card?.parentNode && !card._selfDestroyed && player.canEquip(card, true)) {
                    player.logSkill("hlhj_xianyu");
                    await player.equip(card);
                }
            },
        },
        hlhj_jade: {
            charlotte: true, marktext: "玉",
            intro: { content: "cards", name: "关联的通灵宝玉" },
        },
        hlhj_qingjian_use: {
            enable: ["chooseToUse", "chooseToRespond"],
            filter(event, player) {
                return player.hasCard(isLetter, "h") && basicOptions(event, player).length > 0;
            },
            chooseButton: {
                dialog(event, player) { return ui.create.dialog("情笺：当基本牌对自己使用或打出", [basicOptions(event, player), "vcard"], "hidden"); },
                check(button) { return _status.event.getParent().type === "phase" ? _status.event.player.getUseValue({ name: button.link[2] }) : 1; },
                backup(links) {
                    return {
                        audio: false, position: "h", filterCard: isLetter, selectCard: 1,
                        viewAs: { name: links[0][2], nature: links[0][3], storage: { hlhj_letter: true } },
                        filterTarget(card, player, target) {
                            return target === player && lib.filter.targetEnabled2(card, player, target);
                        },
                        check: card => 7 - get.value(card),
                    };
                },
                prompt(links) { return "将一张情笺当作【" + get.translation(links[0][2]) + "】对自己使用或打出"; },
            },
            hiddenCard(player, name) { return basicNames().includes(name) && player.hasCard(isLetter, "h"); },
            mod: {
                ignoredHandcard(card) { if (isLetter(card)) return true; },
                cardDiscardable(card, player, reason) { if (reason === "phaseDiscard" && isLetter(card)) return false; },
                playerEnabled(card, player, target) { if (card.storage?.hlhj_letter && target !== player) return false; },
            },
            ai: {
                order: 4, respondSha: true, respondShan: true, save: true,
                skillTagFilter(player, tag, arg) {
                    if (!player.hasCard(isLetter, "h")) return false;
                    if (tag === "save" && arg !== player) return false;
                },
                result: { player: 1 },
            },
        },
        hlhj_moshi: {
            equipSkill: true, trigger: { player: "damageBegin4" }, forced: true,
            filter(event, player) { return event.num > 0 && jadeWorks(player, event.source, event.card); },
            async content(event, trigger, player) { trigger.num--; },
            ai: { effect: { target(card, player, target) { if (get.tag(card, "damage") && jadeWorks(target, player, card)) return 0.5; } } },
        },
        hlhj_gongdu: {
            enable: "phaseUse", usable: 1, position: "h", selectCard: [1, Infinity],
            filter(event, player) { return player.countCards("h") > 0 && game.hasPlayer(current => current !== player); },
            filterCard: true, filterTarget(card, player, target) { return target !== player; },
            discard: false, lose: false, delay: false,
            async content(event, trigger, player) {
                await endReading(player);
                const target = event.targets[0];
                const cards = event.cards.filter(card => player.getCards("h").includes(card));
                if (!player.isIn() || !target.isIn() || !cards.length) return;
                sync(player, "hlhj_gongdu", [target]);
                target.addSkill("hlhj_readers");
                sync(target, "hlhj_readers", [...new Set([...target.getStorage("hlhj_readers"), player])]);
                target.markSkill("hlhj_readers");
                await addPages(player, player, cards);
            },
            global: ["hlhj_read", "hlhj_read_after"],
            group: ["hlhj_read_cleanup"],
            onremove(player) {
                const next = game.createEvent("hlhj_endReading");
                next.player = player;
                next.setContent(async (event, trigger, player) => { await endReading(player); });
            },
            ai: { order: 3, result: { target: 1 }, check: card => 5 - get.value(card) },
        },
        hlhj_book: {
            charlotte: true, marktext: "书",
            intro: {
                name: "共读西厢",
                mark(dialog, storage, player) {
                    if (partner(player)) dialog.addText("共读者：" + get.translation(partner(player)));
                    for (const page of availablePages(player)) {
                        dialog.addText("放入者：" + get.translation(page.contributor));
                        dialog.add([page.card]);
                    }
                },
                markcount(storage, player) { return availablePages(player).length; },
            },
        },
        hlhj_readers: { charlotte: true, marktext: "读", intro: { content: "players", name: "与你共读的绛洞花主" } },
        hlhj_read: {
            enable: ["chooseToUse", "chooseToRespond"],
            filter(event, player) { return bookOptions(event, player).length > 0; },
            chooseButton: {
                dialog(event, player) {
                    const dialog = ui.create.dialog("共读西厢：选择书页及读法", "hidden");
                    for (const link of bookOptions(event, player)) {
                        const meta = bookMeta(link);
                        dialog.addText(get.translation(meta.owner) + "的书 · " + get.translation(meta.contributor) + "放入【" +
                            get.translation(meta.card) + "】" + (meta.epitaph !== undefined ? " · 诔文（每轮共限一次）" : ""));
                        dialog.add([[link], "vcard"]);
                    }
                    return dialog;
                },
                check(button) { return _status.event.getParent().type === "phase" ? _status.event.player.getUseValue({ name: button.link[2] }) : 1; },
                backup(links) {
                    const link = links[0], meta = bookMeta(link);
                    const info = {
                        audio: false, filterCard: () => false, selectCard: -1,
                        viewAs: {
                            name: link[2], nature: link[3], suit: meta.card.suit, number: meta.card.number,
                            cards: [meta.card], storage: { hlhj_read: meta, hlhj_letter: !!meta.letter },
                        },
                        precontent: prepareBook,
                    };
                    if (meta.letter) info.filterTarget = (card, player, target) =>
                        target === player && lib.filter.targetEnabled2(card, player, target);
                    return info;
                },
                prompt(links) { return "使用或打出书页：【" + get.translation(links[0][2]) + "】"; },
            },
            hiddenCard(player, name) {
                return owners(player).some(owner => availablePages(owner).some(page => page.card.name === name ||
                    (isLetter(page.card) && basicNames().includes(name)) ||
                    (owner.hasSkill("hlhj_duzhuan") && owner.storage.hlhj_epitaph_round !== game.roundNumber && memorials(owner).some(item => item.name === name))));
            },
            ai: { order: 4, respondSha: true, respondShan: true, save: true,
                skillTagFilter(player, tag) { return skills.hlhj_read.hiddenCard(player, tag === "respondSha" ? "sha" : tag === "respondShan" ? "shan" : "tao"); },
                result: { player: 1 } },
        },
        hlhj_read_after: {
            charlotte: true, trigger: { player: ["useCardAfter", "respondAfter"] },
            forced: true, silent: true, forceDie: true,
            filter(event) { return !!event.card?.storage?.hlhj_read && !event.hlhj_read_finished; },
            content: finishBook,
        },
        hlhj_read_cleanup: {
            charlotte: true, trigger: { global: ["dieBegin", "dieAfter", "removePlayerAfter"] },
            forced: true, silent: true, forceDie: true, priority: -20,
            filter(event, player) {
                return partner(player) && (event.player === player || event.player === partner(player));
            },
            async content(event, trigger, player) {
                // Partner's dieBegin is reserved for 杜撰芙蓉, before death discards.
                if (trigger.name === "die" && event.triggername === "dieBegin" &&
                    trigger.player === partner(player) && player.hasSkill("hlhj_duzhuan")) return;
                await endReading(player);
            },
        },
        hlhj_mengyou: {
            trigger: { player: "phaseJieshuBegin" }, direct: true,
            filter(event, player) { return player.hasCard(isLetter, "h"); },
            async content(event, trigger, player) {
                const result = await player.chooseCardTarget({
                    prompt: "梦游太虚：将一张情笺置为梦，守护你或当前共读者（替换旧梦）",
                    position: "h", filterCard: isLetter,
                    filterTarget(card, player, target) { return target === player || target === player.getStorage("hlhj_gongdu")[0]; },
                    ai1: card => 5 - get.value(card), ai2: target => get.attitude(_status.event.player, target),
                }).forResult();
                if (!result.bool) return;
                player.logSkill("hlhj_mengyou", result.targets);
                await clearDream(player);
                if (!player.isIn() || !result.targets[0].isIn()) return;
                if (await placeDream(player, result.cards[0])) {
                    sync(player, "hlhj_dream_target", result.targets);
                    player.markSkill("hlhj_dream");
                }
            },
            group: ["hlhj_mengyou_reveal", "hlhj_dream_clear"],
            onremove(player) {
                const next = game.createEvent("hlhj_clearDream");
                next.player = player;
                next.setContent(async (event, trigger, player) => { await clearDream(player); });
            },
        },
        hlhj_dream: {
            charlotte: true, marktext: "梦",
            intro: {
                name: "太虚之梦",
                mark(dialog, storage, player) {
                    dialog.addText("守护：" + get.translation(player.getStorage("hlhj_dream_target")));
                    if (player.isUnderControl(true)) dialog.add(player.getExpansions("hlhj_dream"));
                    else dialog.addText("一张背面朝上的情笺");
                },
                markcount(storage, player) { return player.getExpansions("hlhj_dream").length; },
            },
        },
        hlhj_mengyou_reveal: {
            trigger: { global: "useCardToTargeted" }, forced: true,
            filter(event, player) {
                return event.target === player.getStorage("hlhj_dream_target")[0] && event.player !== event.target &&
                    get.tag(event.card, "damage") && player.getExpansions("hlhj_dream").length > 0;
            },
            async content(event, trigger, player) {
                const card = player.getExpansions("hlhj_dream")[0];
                const color = get.color(card, false);
                sync(player, "hlhj_dream_target", []);
                await player.showCards([card], "梦游太虚：展示梦");
                if (["red", "black"].includes(color) && color === get.color(trigger.card, trigger.player) &&
                    guardedJade(player, trigger.player, trigger.card)) {
                    const result = await player.chooseBool("梦游太虚：弃置关联的通灵宝玉，令此牌对" + get.translation(trigger.target) + "无效？")
                        .set("choice", get.effect(trigger.target, trigger.card, trigger.player, player) < 0).forResult();
                    const item = guardedJade(player, trigger.player, trigger.card);
                    if (result.bool && item) {
                        const holder = get.owner(item);
                        const loss = holder.discard(item);
                        await loss;
                        // A discard-trigger skill may immediately gain the jade.
                        // The paid cost remains valid after such a transfer.
                        if (holder.getHistory("lose").some(entry => entry.getParent() === loss && entry.cards2?.includes(item))) {
                            trigger.getParent().excluded.add(trigger.target);
                        }
                    }
                }
                await clearDream(player);
            },
        },
        hlhj_dream_clear: {
            charlotte: true, trigger: { global: ["dieBegin", "removePlayerAfter"] },
            forced: true, silent: true, forceDie: true,
            filter(event, player) {
                return event.player === player || event.player === player.getStorage("hlhj_dream_target")[0];
            },
            async content(event, trigger, player) { await clearDream(player); },
        },
        hlhj_qingyu: {
            trigger: { global: "damageBegin4" }, direct: true, priority: -1,
            filter(event, player) {
                return event.num > 0 && partner(player)?.isIn() && availablePages(player).length > 0 &&
                    [player, partner(player)].includes(event.player);
            },
            async content(event, trigger, player) {
                const other = trigger.player === player ? partner(player) : player;
                const result = await player.chooseBool("情与不情：将全部书交给" + get.translation(other) + "，令此次伤害减少1点并结束共读？")
                    .set("choice", get.attitude(player, trigger.player) > 0).forResult();
                if (!result.bool || !other.isIn() || !availablePages(player).length) return;
                player.logSkill("hlhj_qingyu", trigger.player);
                trigger.num--;
                await endReading(player, other);
            },
        },
        hlhj_duzhuan: {
            trigger: { global: "dieBegin" }, forced: true, priority: 10,
            filter(event, player) { return player.isIn() && event.player === partner(player); },
            async content(event, trigger, player) {
                const dead = trigger.player;
                const name = await chooseEpitaph(player, "杜撰芙蓉：为共读者声明一种非伤害基本牌或普通锦囊牌", true);
                if (name) {
                    sync(player, "hlhj_furonglei", [...memorials(player), { dead, seat: dead.getSeatNum(), name }]);
                    player.markSkill("hlhj_furonglei");
                    updateMemorial(player, dead, name);
                }
                await endReading(player);
            },
            group: ["hlhj_duzhuan_rewrite"],
        },
        hlhj_duzhuan_rewrite: {
            trigger: { global: "phaseBegin" }, direct: true,
            filter(event, player) { return memorials(player).length > 0 && [player, partner(player)].includes(event.player); },
            async content(event, trigger, player) {
                // The character whose turn begins writes the epitaph.
                const writer = trigger.player;
                for (let index = 0; index < memorials(player).length; index++) {
                    const memorial = memorials(player)[index];
                    const name = await chooseEpitaph(writer, "芙蓉诔（" + get.translation(memorial.dead) + "）：可重写诔文，当前为【" + get.translation(memorial.name) + "】");
                    if (!name || !player.isIn()) continue;
                    const list = memorials(player).slice();
                    list[index] = { ...memorial, name };
                    sync(player, "hlhj_furonglei", list);
                    player.markSkill("hlhj_furonglei");
                    updateMemorial(player, memorial.dead, name);
                }
            },
        },
        hlhj_furonglei: {
            charlotte: true, marktext: "诔", showMemorial,
            intro: {
                name: "芙蓉诔",
                content(storage, player) {
                    return memorials(player).map(item => "第" + item.seat + "席 · " + get.translation(item.dead) + "：诔文【" + get.translation(item.name) + "】").join("<br>") +
                        "<br>本轮诔文" + (player.storage.hlhj_epitaph_round === game.roundNumber ? "已使用" : "未使用") + "；你与共读者共享一次。";
                },
            },
        },
    };
    for (const info of Object.values(skills)) info.audio = false;
    const cards = {
        hlhj_qingjian: {
            type: "basic", enable: false, fullskin: false,
            destroy: letterReturn, destroyLog: false, global: "hlhj_qingjian_use",
            ai: { basic: { useful: 7, value: 7 } },
        },
        hlhj_tonglingbaoyu: {
            type: "equip", subtype: "equip5", fullskin: false,
            derivation: "hlhj_baoyu", skills: ["hlhj_moshi"],
            enable: true, selectTarget: -1, filterTarget: (card, player, target) => player === target,
            modTarget: true, toself: true,
            async content(event, trigger, player) { await event.target.equip(event.card); },
            ai: { basic: { equipValue: 8, order: 9, useful: 6, value: 8 }, result: { target: 2 } },
        },
        // A rules card for inspection; memorials are seat objects, never deck cards.
        hlhj_furonglei: { type: "hlhj_memorial", enable: false, fullskin: false, derivation: "hlhj_baoyu" },
    };
    const translate = {
        hlhj_xianyu: "衔玉而生",
        hlhj_xianyu_info: "①游戏开始时，生成唯一一张与你关联的【通灵宝玉】，装备之（宝物栏不可用时改为获得）。每名角色的回合开始前，若此玉未装备在你身上，你可以收回并装备它。②锁定技，你的伤害手牌转化为【情笺】，保留花色、点数；玉离身不影响此效果。",
        hlhj_xianyu_recall: "衔玉·归玉", hlhj_jade: "通灵宝玉",
        hlhj_qingjian: "情笺", hlhj_qingjian_use: "情笺",
        hlhj_qingjian_info: "专属基本牌。可当作任意基本牌对自己使用或打出，遵循该牌的使用、响应条件，不能以其他角色为使用目标。不计入手牌上限，且不因手牌上限而弃置；仍是实际手牌。保留原牌花色、点数；实体转化牌进入牌堆或弃牌堆时恢复原牌，生成的复制牌则销毁。",
        hlhj_tonglingbaoyu: "通灵宝玉",
        hlhj_tonglingbaoyu_info: "专属宝物·红桃A。每名绛洞花主仅关联一张实体，可正常获得、弃置、转移或替换，召回权属于关联者。装备技能〖莫失莫忘〗：当装备者即将受到伤害时，令此次伤害减少1点。仅在装备区且装备效果有效时可减伤或用于梦游太虚；仅持于手中不生效。",
        hlhj_moshi: "莫失莫忘", hlhj_moshi_info: "锁定技，当你即将受到伤害时，若此装备效果有效，令此次伤害减少1点。",
        hlhj_gongdu: "共读西厢",
        hlhj_gongdu_info: "出牌阶段限一次，你可以将任意张手牌正面朝上置为“书”，选择一名其他角色与你共读，同时只能与一人共读。双方均可按牌的规则使用或打出书页。结算后，若使用者不是该页的放入者，放入者摸一张牌；然后使用者可以将一张手牌置为新书，否则结束共读。共读结束时，未用的书归还放入者；更换共读者先结束原共读。",
        hlhj_book: "书", hlhj_read: "共读·用书", hlhj_readers: "共读者", hlhj_read_after: "共读·续页",
        hlhj_mengyou: "梦游太虚",
        hlhj_mengyou_info: "结束阶段开始时，你可以将一张【情笺】背面朝上置为“梦”（替换旧梦），选定你或当前存活的共读者。其下一次成为其他角色使用的伤害牌的目标时，展示梦；若二者颜色相同，你可以弃置处于装备区且装备效果有效的关联【通灵宝玉】，令此牌对其无效。此后弃置梦。",
        hlhj_dream: "梦", hlhj_mengyou_reveal: "梦游·护梦",
        hlhj_qingyu: "情与不情",
        hlhj_qingyu_info: "当你或共读者即将受到伤害时，若有书，你可以将全部书交给其中未受此次伤害的一方，令此次伤害减少1点，然后结束共读。",
        hlhj_duzhuan: "杜撰芙蓉",
        hlhj_duzhuan_info: "当共读者死亡时，在其死亡位置留下与你和其关联的“芙蓉诔”，并结束共读。你为其声明一种非伤害基本牌或普通锦囊牌名，称为“诔文”。你或当前共读者的回合开始时，当前回合角色可以重写诔文。每轮限一次（双方及各座芙蓉诔共享次数），你或当前共读者可以将一页书当作诔文使用或打出，结算后仍按共读西厢处理。",
        hlhj_duzhuan_rewrite: "芙蓉·重书", hlhj_furonglei: "芙蓉诔", hlhj_memorial: "纪念物",
        hlhj_furonglei_info: "专属场上纪念物，不进入牌堆，也不占装备栏。记录绛洞花主、亡故共读者、死亡座次与诔文。诔文须为非伤害基本牌或普通锦囊牌。绛洞花主与当前共读者可用一页书代之，每轮共享一次，并照常结算摸牌、续页或结束共读。",
    };
    return { skills, cards, translate };
}
