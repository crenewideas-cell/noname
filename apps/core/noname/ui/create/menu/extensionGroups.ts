import groups from "../../../../game/extension-groups.json";
import restructure from "../../../../game/extension-restructure.json";
import apk from "../../../../game/apk-extension-cleanup.json";
import characterGroups from "../../../../game/character-menu-groups.json";
import catalogue from "../../../../game/extension-catalog.json";
import installed from "../../../../game/organized-extensions.json";

/** Resolve existing registered packs; opening settings never imports extension code. */
export function extensionCharacterPacks(name: string, lib: any): { mode: string; characters: string[] }[] {
	const entry = installed.find(item => item.name === name);
	const declared = entry && "characterPacks" in entry ? entry.characterPacks : [];
	const names = new Set([name, `mode_extension_${name}`, ...declared]);
	const prefix = `extension/${name}/`;
	for (const [mode, characters] of Object.entries(lib.characterPack) as [string, Record<string, any>][]) {
		if (["mode_favourite", "mode_banned"].includes(mode)) continue;
		// Runtime ownership also covers newly imported packs absent from the catalogue.
		if (lib.characterPackExtension?.[mode] === name) names.add(mode);
		else if (Object.values(characters).some(character => character?.img?.startsWith(prefix)
			|| (character?.trashBin || character?.[4] || []).some((tag: unknown) => typeof tag === "string"
				&& (tag.startsWith(`ext:${name}/`) || tag.startsWith(`img:${prefix}`))))) names.add(mode);
	}
	const seen = new Set<string>();
	const result: { mode: string; characters: string[] }[] = [];
	const add = (mode: string, ids: string[]) => {
		const characters = ids.filter(id => !seen.has(id));
		if (!characters.length) return;
		characters.forEach(id => seen.add(id));
		result.push({ mode, characters });
	};
	for (const mode of names) add(mode, Object.keys(lib.characterPack[mode] || {}));
	// Consolidated imports may intentionally reuse a built-in character instead
	// of registering a duplicate definition (e.g. 新诸葛果 → mobile/mb_zhugeguo).
	const reused = new Set<string>(entry?.characters || []);
	for (const [mode, characters] of Object.entries(lib.characterPack)) {
		if (["mode_favourite", "mode_banned"].includes(mode)) continue;
		add(mode, Object.keys(characters || {}).filter(id => reused.has(id)));
	}
	return result;
}

export function extensionExpectsCharacters(name: string): boolean {
	const entry = installed.find(item => item.name === name);
	return !!(entry?.characters?.length || (entry && "characterPacks" in entry && entry.characterPacks?.length));
}

export interface ExtensionMenuGroup {
	name: string;
	members: string[];
}

/** A presentation-only grouping: never rename, load, remove, or enable a pack. */
export function groupExtensionMenus(modes: readonly string[]): (string | ExtensionMenuGroup)[] {
	modes = modes.filter(mode => !mode.startsWith("extension_") || !restructure.removed.includes(mode.slice(10)));
	const available = new Set(modes);
	const owners = new Map<string, ExtensionMenuGroup>();
	// Only installed extensions have settings entries. Activity subpacks still use
	// their source extension's settings, while standalone extensions follow the menu group.
	// UI and uncategorized extensions stay directly accessible as individual entries.
	const categories = { characters: "独立武将", packs: "武将扩展包", collections: "合并扩展包" };
	const settingsGroups = Object.entries(categories).map(([category, name]) => ({
		name,
		members: modes.filter(mode => mode.startsWith("extension_")).map(mode => mode.slice(10)).filter(identity => {
			if (identity === "卡牌扩展") return false;
			if (identity === "键社") return category === "collections";
			const entry = catalogue.find(item => item.name === identity);
			return (entry?.category || "imports") === category;
		}),
	}));
	for (const group of settingsGroups) {
		// An independently installed extension with the same name takes precedence.
		if (available.has(`extension_${group.name}`)) continue;
		const members = group.members.map(name => `extension_${name}`).filter(mode => available.has(mode) && !owners.has(mode));
		if (!members.length) continue;
		const entry = { name: group.name, members };
		for (const mode of members) owners.set(mode, entry);
	}
	const result: (string | ExtensionMenuGroup)[] = [];
	const emitted = new Set<ExtensionMenuGroup>();
	for (const mode of modes) {
		const group = owners.get(mode);
		if (!group) result.push(mode);
		else if (!emitted.has(group)) {
			// Keep both top-level and member order consistent with extensionSort.
			result.push({ name: group.name, members: modes.filter(item => owners.get(item) === group) });
			emitted.add(group);
		}
	}
	return result;
}

export function characterMenuOwner(mode: string): string | undefined {
	const name = mode.replace(/^mode_extension_/, "");
	for (const group of characterGroups.groups) if (group.members.includes(name)) return group.name;
	if (name in restructure.merged) return name;
	for (const group of groups) if (group.members.includes(name)) return group.name;
	if (name === "假装无敌Pack") return "清瑶葭绮";
	if (["wandian", "yunchou"].includes(name)) return "群雄并起";
	for (const [target, members] of Object.entries(restructure.merged)) {
		if (name !== target && members.includes(name)) return characterGroups.groups.find(group => group.members.includes(target))?.name || target;
	}
}

/** Pure metadata: building a menu must never execute an extension factory. */
export function mergedMenuSections(name: string) {
	if (name === "手杀武将") return [
		{ name: "原有手杀武将", prefix: "original_", keys: [] as string[] },
		...apk.merged.map(item => ({ name: item.name, prefix: `${item.key}_`, keys: [item.key] })),
		{ name: "手杀补全", prefix: "merged_completion_", keys: ["merged_completion"] },
	];
	return (restructure.merged[name] || []).map((member, index) => ({ name: member, prefix: `member_${index}_`, keys: [] as string[] }));
}

/** DOM state is separate from game configuration; opening menus cannot enable packs. */
export function createPackSubmenu(parent: HTMLElement, title: string, key: string) {
	const details = document.createElement("details");
	details.className = "pack-submenu";
	details.dataset.packSubmenu = key;
	const summary = document.createElement("summary");
	summary.textContent = title;
	details.append(summary);
	try { details.open = sessionStorage.getItem(`noname.menu.${key}`) === "open"; } catch { /* Storage can be unavailable. */ }
	details.addEventListener("toggle", () => {
		try { sessionStorage.setItem(`noname.menu.${key}`, details.open ? "open" : "closed"); } catch { /* Menu still works. */ }
	});
	parent.append(details);
	return details;
}
