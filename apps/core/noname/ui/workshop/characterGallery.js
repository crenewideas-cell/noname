import { isDuplicateCharacter } from "../../init/characterDuplicates.js";

/** Display-only regrouping. Compatibility IDs never become extra gallery cards. */
export function characterGalleryPacks(packs) {
	const result = Object.fromEntries(Object.entries(packs).map(([name, pack]) => [name, {
		...pack, character: Object.fromEntries(Object.entries(pack.character || {}).filter(([, character]) => !isDuplicateCharacter(character))),
	}]));
	const source = result.zerongPack || result.mode_extension_zerongPack;
	if (!source) return result;
	delete result.zerongPack;
	delete result.mode_extension_zerongPack;
	const other = result.huodongcharacter || {};
	result.huodongcharacter = {
		...other,
		character: { ...source.character, ...other.character },
		translate: { ...source.translate, ...other.translate, huodongcharacter_character_config: "其他武将" },
	};
	return result;
}
