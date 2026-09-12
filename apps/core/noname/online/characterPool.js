import { lib } from "noname";
import { ONLINE_CHARACTER_PACKS, normalizeCharacterPool } from "@noname/online-protocol";

// Import dependency definitions in a fixed order on host and clients, including
// disabled packs: many built-in skills inherit from another character pack.
// Eligibility remains controlled by configOL.characterPack, not this load list.
export const onlineCharacterLoadList = () => ONLINE_CHARACTER_PACKS.map(pack => pack.id);
export const onlineCardLoadList = () => ["standard", "extra", "guozhan", "yingbian", "yongjian", "sp", "zhulu", "huodong", "xianxia"];

export function assertOnlineCharacterResources() {
	for (const id of onlineCharacterLoadList()) {
		if (!lib.connectCharacterPack.includes(id) || !Object.keys(lib.characterPack[id] || {}).length) {
			throw Object.assign(new Error("武将资源不完整，请更新联机客户端与服务端。"), { code: "CHARACTER_PACK_UNAVAILABLE" });
		}
	}
	for (const id of onlineCardLoadList()) {
		if (!lib.connectCardPack.includes(id) || !lib.cardPack[id]?.length) {
			throw Object.assign(new Error("武将所需的卡牌资源不完整，请更新联机客户端与服务端。"), { code: "CHARACTER_PACK_UNAVAILABLE" });
		}
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
