import { lib, get } from "noname";

/** Preserve the existing shared skin preference for actual guozhan variants only. */
export function skinStorageKey(name) {
	if (name?.startsWith("gz_") && lib.characterPack.mode_guozhan?.[name]) {
		return name.startsWith("gz_shibing") ? name.slice(3, 11) : name.slice(3);
	}
	return name;
}

/** Resolve form metadata without temporarily inserting a fake playable character. */
export function portraitCharacter(name) {
	const info = get.character(name);
	if (!info.isNull) return info;
	for (const forms of Object.values(lib.characterSubstitute)) {
		const form = forms.find(item => item[0] === name);
		if (form) return get.convertedCharacter(["", "", 0, [], form[1]]);
	}
	return info;
}
