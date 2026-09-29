import { cardPackAllowed } from "./cardPackRuntime.js";
// Military-deck proportions and suit weights from native cardpile.
export const supplementWeights = {
	sha: { diamond: 6, club: 14, heart: 3, spade: 7 },
	huosha: { diamond: 2, heart: 3 }, leisha: { spade: 5, club: 4 },
	shan: { heart: 6, diamond: 18 }, jiu: { diamond: 1, spade: 2, club: 2 },
	tao: { heart: 9, diamond: 3 }, wanjian: { heart: 1 }, nanman: { spade: 2, club: 1 },
	guohe: { spade: 3, club: 2, heart: 1 }, shunshou: { spade: 3, diamond: 2 },
	wuxie: { heart: 2, diamond: 1, spade: 2, club: 2 }, tiesuo: { spade: 2, club: 4 },
};
const defaults = { sha: 1, huosha: 1, leisha: 1, shan: 1, wuxie: 0.5 };
const previous = new WeakMap();
const identity = card => card[2] === "sha" ? (card[3] === "fire" ? "huosha" : card[3] === "thunder" ? "leisha" : card[3] ? null : "sha") : card[2];

/** Runs after all extension arena hooks, before the mode constructs physical cards. */
export function supplementCardPile(lib, random = Math.random, { connect = false, bannedcards = [] } = {}) {
	const list = lib.card.list;
	const old = previous.get(lib);
	if (old) for (let i = list.length - 1; i >= 0; i--) if (old.has(list[i])) list.splice(i, 1);
	previous.delete(lib);
	if (lib.config.mode === "connect" || !lib.config.plays?.includes("cardpile") || lib.config.hiddenPlayPack?.includes("cardpile") || !list.length) return 0;
	const mode = connect ? lib.configOL?.mode || lib.config.mode : lib.config.mode;
	const banned = new Set([...(connect ? lib.configOL?.bannedcards || [] : lib.config.bannedcards || []), ...bannedcards]);
	const targets = [];
	for (const [id, suits] of Object.entries(supplementWeights)) {
		const name = id === "huosha" || id === "leisha" ? "sha" : id;
		if (!lib.card[name] || !cardPackAllowed(lib.card[name], mode) || banned.has(name)) continue;
		// Do not reintroduce a disabled card family (e.g. wine or elemental sha
		// from the military pack) merely because its definition was loaded.
		if (!list.some(card => identity(card) === id)) continue;
		const raw = lib.config[`cardpile_${id}_playpackconfig`];
		const value = raw == null ? defaults[id] || 0 : Number(raw);
		const factor = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : defaults[id] || 0;
		if (!factor) continue;
		const weight = Object.values(suits).reduce((sum, count) => sum + count, 0);
		targets.push({ id, name, suits: Object.entries(suits), weight, ratio: weight * factor / 160, count: list.filter(card => identity(card) === id).length });
	}
	// Solve deficits against final deck size, including existing copies. A partial
	// setting scales the target proportion; supplementation never removes cards.
	let added = 0, counts = [];
	for (let step = 0; step <= 1000; step++) {
		counts = targets.map(target => Math.max(0, Math.round((list.length + added) * target.ratio) - target.count));
		const next = Math.min(1000, counts.reduce((sum, count) => sum + count, 0));
		if (next === added) break;
		added = next;
	}
	const entries = new Set();
	const total = counts.reduce((sum, count) => sum + count, 0);
	if (total > 1000) {
		const scaled = counts.map(count => count * 1000 / total);
		counts = scaled.map(Math.floor);
		const order = scaled.map((value, index) => ({ index, remainder: value - counts[index] })).sort((a, b) => b.remainder - a.remainder);
		for (let i = 0, remaining = 1000 - counts.reduce((sum, count) => sum + count, 0); i < remaining; i++) counts[order[i].index]++;
	}
	for (let index = 0; index < targets.length; index++) {
		const target = targets[index];
		for (let n = 0; n < counts[index] && entries.size < 1000; n++) {
			let pick = random() * target.weight;
			const suit = target.suits.find(([, weight]) => (pick -= weight) < 0)?.[0] || target.suits[0][0];
			const card = [suit, Math.min(13, Math.max(1, Math.floor(random() * 13) + 1)), target.name];
			if (target.id === "huosha") card.push("fire");
			if (target.id === "leisha") card.push("thunder");
			entries.add(card);
			list.push(card);
		}
	}
	previous.set(lib, entries);
	return entries.size;
}
