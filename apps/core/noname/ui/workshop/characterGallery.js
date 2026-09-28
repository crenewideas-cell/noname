/** Display-only regrouping. Keep engine pack identities, skills and assets intact. */
export function characterGalleryPacks(packs) {
	const source = packs.zerongPack || packs.mode_extension_zerongPack;
	if (!source) return packs;
	const result = { ...packs };
	delete result.zerongPack;
	delete result.mode_extension_zerongPack;
	const other = packs.huodongcharacter || {};
	result.huodongcharacter = {
		...other,
		character: { ...source.character, ...other.character },
		translate: { ...source.translate, ...other.translate, huodongcharacter_character_config: "其他武将" },
	};
	return result;
}
