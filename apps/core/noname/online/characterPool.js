import { lib, _status } from "noname";
import { ONLINE_CHARACTER_PACKS, normalizeCharacterPool } from "@noname/online-protocol";
import { importCharacterPack } from "../init/import.js";

// Import dependency definitions in a fixed order on host and clients, including
// disabled packs: many built-in skills inherit from another character pack.
// Eligibility remains controlled by configOL.characterPack, not this load list.
export const onlineCharacterLoadList = () => ONLINE_CHARACTER_PACKS.map(pack => pack.id);
export const onlineCardLoadList = () => ["standard", "extra", "guozhan", "yingbian", "yongjian", "sp", "zhulu", "huodong", "xianxia"];

export const minimumCharacterPoolSize = capacity => capacity * 3;
let catalogLoading;
export async function loadOnlineCharacterCatalog() {
	if (!catalogLoading) catalogLoading = (async () => {
		await Promise.all(ONLINE_CHARACTER_PACKS.filter(pack => !lib.imported.character?.[pack.id]).map(pack => importCharacterPack(pack.id)));
		await Promise.all(_status.importing?.character || []);
		return { ...lib.imported.character };
	})().finally(() => { catalogLoading = undefined; });
	return catalogLoading;
}
function countFamilies(names, replacements) {
	const available = new Set(names);
	let count = 0;
	for (const family of Object.values(replacements)) {
		if (family.some(name => available.has(name))) {
			count++;
			for (const name of family) available.delete(name);
		}
	}
	return count + available.size;
}

/** Lobby preview uses imported definitions, even before the arena loads them. */
export function inspectCharacterPool(value, capacity, modeId, catalog = lib.imported.character) {
	const minimum = minimumCharacterPoolSize(capacity);
	if (!value.packs.length) return { valid: false, count: 0, minimum, message: "请至少选择一个武将包" };
	if (value.packs.some(id => !catalog?.[id]?.character)) return { valid: false, count: 0, minimum, message: "武将目录尚未完整加载，暂不能保存或开局" };
	const characters = Object.assign({}, ...value.packs.map(id => catalog[id].character));
	const definitions = Object.values(catalog || {});
	const replacements = Object.assign({}, lib.characterReplace, ...definitions.map(pack => pack.characterReplace || {}));
	const filters = Object.assign({}, lib.characterFilter, ...definitions.map(pack => pack.characterFilter || {}));
	const banned = new Set([...value.banned, ...lib.connectBanned, ...definitions.flatMap(pack => pack.connectBanned || [])]);
	const available = Object.keys(characters).filter(id => {
		const info = new lib.element.Character(characters[id]);
		// These are characterDisabled's restrictions for supported single-general rooms.
		return !info.isUnseen && !info.isAiForbidden && !info.isBoss && !info.isHiddenBoss && !lib.config.forbidai.includes(id) && !banned.has(id) && (!filters[id] || filters[id](modeId));
	});
	const count = modeId === "identity" ? available.length : countFamilies(available, replacements);
	return { valid: count >= minimum, count, minimum, message: count < minimum ? `当前仅 ${count} 个有效选项，${capacity} 人场至少需要 ${minimum} 个；请增加武将包或减少禁将。` : "武将数量满足开局要求" };
}

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
	const count = lib.configOL.mode === "identity" ? available.size : countFamilies(available, lib.characterReplace);
	return count < minimumCharacterPoolSize(capacity) ? "CHARACTER_POOL_TOO_SMALL" : undefined;
}
