import { lib } from "noname";
import { ONLINE_CHARACTER_PACKS, normalizeCharacterPool } from "@noname/online-protocol";

// Import dependency definitions in a fixed order on host and clients, including
// disabled packs: many built-in skills inherit from another character pack.
// Eligibility remains controlled by configOL.characterPack, not this load list.
export const onlineCharacterLoadList = () => ONLINE_CHARACTER_PACKS.map(pack => pack.id);
export const onlineCardLoadList = () => ["standard", "extra", "guozhan", "yingbian", "yongjian", "sp", "zhulu", "huodong", "xianxia"];

export function assertOnlineCharacterResources() {
	const resources = [];
	for (const id of onlineCharacterLoadList()) {
		if (!lib.imported.character?.[id]?.connect || !lib.connectCharacterPack?.includes(id) || !Object.keys(lib.characterPack[id] || {}).length) {
			resources.push(`character:${id}`);
		}
	}
	for (const id of onlineCardLoadList()) {
		// cardPack is the filtered menu list, not a manifest of loaded code.
		// A dependency with only hidden cards can legitimately have an empty list.
		if (!lib.imported.card?.[id]?.connect || !lib.connectCardPack?.includes(id) || !Array.isArray(lib.cardPack[id])) {
			resources.push(`card:${id}`);
		}
	}
	if (resources.length) {
		throw Object.assign(new Error(`联机资源未加载：${resources.join("、")}。请使用同一构建的完整联机资源。`), { code: "CHARACTER_PACK_UNAVAILABLE", resources });
	}
}

/** Runs on the host after engine loading, before admitting any player. */
export function validateHostedCharacterPool(value, capacity) {
	assertOnlineCharacterResources();
	const pool = normalizeCharacterPool(value);
	const names = new Set(pool.packs.flatMap(id => Object.keys(lib.characterPack[id])));
	if (pool.banned.some(name => !names.has(name))) return "INVALID_CHARACTER_BAN";
	const available = new Set([...names].filter(name => !lib.filter.characterDisabled(name)));
	// Count replacement families once, as the existing identity/landlord modes do.
	let count = 0;
	for (const replacements of Object.values(lib.characterReplace)) {
		if (replacements.some(name => available.has(name))) {
			count++;
			for (const name of replacements) available.delete(name);
		}
	}
	count += available.size;
	return count < capacity * 3 ? "CHARACTER_POOL_TOO_SMALL" : undefined;
}
