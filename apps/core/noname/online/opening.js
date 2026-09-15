import { lib, game } from "noname";

// The host owns every opening session. Clients receive display data and submit
// actions; they never roll candidates, change a hand, or extend a deadline.
export function installOpeningFlow(request, setStage, swapHand, rules, refresh) {
    game.onlineOpening = {
        async characters(players, { pool, count = 1 }) {
            const shuffled = [...new Set(pool)].randomSort();
            const context = { deadline: Date.now() + rules.openingTimeout * 1000, claimed: new Set(), sessions: new Map(), dirty: false, completed: 0 };
            const stage = () => setStage({ phase: "character", simultaneous: true, completed: context.completed, total: players.length, deadline: context.deadline });
            stage();
            // Batch anonymous availability updates. No seat, identity or player-to-
            // general mapping is published until the ordinary final reveal.
            const timer = setInterval(() => {
                if (!context.dirty) return;
                context.dirty = false;
                for (const [player, snapshot] of context.sessions) refresh(player, snapshot());
                stage();
            }, 300);
            try {
                const results = await Promise.all(players.map(async (player, index) => {
                    const personal = rules.characterPoolMode === "partitioned" ? shuffled.filter((_, i) => i % players.length === index) : shuffled;
                    const result = await this.character(player, {
                        pool: personal, initial: personal.randomGets(3), count, title: "选择你的武将", context,
                    });
                    context.completed++; context.dirty = true;
                    return [player.playerid, result];
                }));
                return Object.fromEntries(results);
            } finally { clearInterval(timer); setStage(null); }
        },
        async character(player, { pool, initial, count = 1, title, position, total, context }) {
            const all = [...new Set(pool)].filter(id => lib.character[id]);
            let candidates = [...new Set(initial)].filter(id => all.includes(id));
            if (!candidates.length) candidates = all.slice(0, Math.max(3, count));
            const freeChoose = !!context || rules.freeChoose;
            let remaining = rules.characterRerolls, mode = context ? "all" : "candidates";
            const deadline = context?.deadline || Date.now() + rules.openingTimeout * 1000;
            const available = () => all.filter(id => !context?.claimed.has(id));
            const replenish = () => {
                const ids = available();
                candidates = candidates.filter(id => ids.includes(id));
                if (candidates.length < count) {
                    candidates = ids.slice(0, Math.max(3, count));
                }
            };
            const claim = links => {
                if (context) {
                    for (const id of links) context.claimed.add(id);
                    context.dirty = true;
                }
            };
            const fallback = () => {
                const result = [];
                const allowed = available();
                for (const id of candidates.concat(allowed)) {
                    if (!allowed.includes(id)) continue;
                    if (!result.includes(id)) result.push(id);
                    if (result.length === count) break;
                }
                if (result.length !== count) throw new Error("点将候选武将不足");
                return { bool: true, links: result };
            };
            let notice = "";
            const snapshot = () => {
                replenish();
                return { phase: "character", title, candidates, characters: mode === "all" && freeChoose ? available() : candidates,
                    mode, count, freeChoose, remaining, deadline, fallback: fallback().links,
                    simultaneous: !!context, poolMode: rules.characterPoolMode, notice };
            };
            if (!context) setStage({ phase: "character", actor: player.nickname, position, total, deadline });
            try { while (Date.now() < deadline) {
                const data = snapshot(), allowed = data.characters;
                context?.sessions.set(player, snapshot);
                const result = await request(player, data, result => {
                    if (!["confirm", "reroll", "all", "candidates"].includes(result.control)) throw new Error("无效选将操作");
                    if (result.control === "reroll" && !remaining) throw new Error("换将次数已用完");
                    if (result.control === "all" && !freeChoose) throw new Error("房主未开启主公点将");
                    if (result.control === "confirm") {
                        // Snapshot updates can add replacement candidates without
                        // changing the token. Validate against the live private pool.
                        const current = mode === "all" && freeChoose ? all : [...new Set(allowed.concat(candidates))];
                        if (result.links?.length !== count || result.links.some(id => !all.includes(id)) ||
                            new Set(result.links).size !== count) throw new Error("请选择有效且不重复的武将");
                        if (result.links.some(id => context?.claimed.has(id))) {
                            result.control = "refresh"; delete result.links;
                            notice = "所选武将已被抢先锁定，请重新选择；不扣换候选次数。";
                        } else {
                            if (result.links.some(id => !current.includes(id))) throw new Error("请选择当前候选武将");
                            claim(result.links); // Atomic reservation, before resolving the request.
                        }
                    } else if (result.links?.length) throw new Error("操作中不应包含选将结果");
                });
                context?.sessions.delete(player);
                if (!result) break;
                if (result.control === "confirm") {
                    return { bool: true, links: result.links };
                }
                if (result.control === "reroll") {
                    remaining--;
                    const ids = available();
                    const fresh = ids.filter(id => !candidates.includes(id));
                    const size = Math.min(ids.length, Math.max(3, count));
                    const rolled = fresh.randomGets(size);
                    if (rolled.length < size) rolled.addArray(ids.filter(id => !rolled.includes(id)).randomGets(size - rolled.length));
                    candidates = rolled;
                    mode = "candidates";
                } else if (result.control !== "refresh") mode = result.control;
            }
            const result = fallback(); claim(result.links); return result;
            } finally { context?.sessions.delete(player); if (!context) setStage(null); }
        },
        async handcards(players, drawEvent) {
            if (!rules.mulligan) { setStage(null); return; }
            const deadline = Date.now() + rules.openingTimeout * 1000;
            let completed = 0;
            const update = () => setStage({ phase: "mulligan", completed, total: players.length, deadline });
            update();
            try {
                await Promise.all(players.map(async player => {
                    let remaining = rules.mulligan;
                    while (Date.now() < deadline && player.countCards("h")) {
                        const data = { phase: "mulligan", title: "开局手气卡", remaining, deadline,
                            hand: player.getCards("h"), character: player.name1 || player.name };
                        const result = await request(player, data, result => {
                            if (!["mulligan", "keep"].includes(result.control) || result.links?.length) throw new Error("无效换牌操作");
                            if (result.control === "mulligan" && !remaining) throw new Error("手气卡次数已用完");
                        });
                        if (!result || result.control === "keep") break;
                        remaining--;
                        swapHand(player, drawEvent);
                        // Keep the new hand visible even after the final redraw.
                        // Each player may confirm independently of slower seats.
                    }
                    completed++; update();
                }));
            } finally { setStage(null); }
        },
    };
}
