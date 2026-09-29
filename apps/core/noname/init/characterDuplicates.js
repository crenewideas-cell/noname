const aliasTag = "sameNameAlias:";
const tagsOf = character => character[4] || character.trashBin || [];
const skillsOf = character => character.skills || character[3] || [];
const hidden = character => character.isUnseen || tagsOf(character).includes("unseen");
export const isDuplicateCharacter = character => tagsOf(character).some(tag => typeof tag === "string" && tag.startsWith(aliasTag));

// Read stored translations only: extension accessors may execute gameplay code.
function displayName(translations, id) {
	const value = Object.getOwnPropertyDescriptor(translations || {}, id)?.value;
	return typeof value === "string"
		? value
				.replace(/<[^>]*>/g, "")
				.replace(/&nbsp;|\u00a0/g, " ")
				.trim()
		: "";
}

/** Merge within ONE extension pack. Old IDs stay callable by event scripts. */
export function mergeDuplicateCharacters(pack, fallbackTranslations = {}) {
	const groups = new Map(),
		aliases = new Map();
	for (const [id, character] of Object.entries(pack.character || {})) {
		// Originally hidden transformations are not duplicate selectable characters.
		if (hidden(character) && !isDuplicateCharacter(character)) continue;
		const name = displayName(pack.translate, id) || displayName(fallbackTranslations, id);
		if (!name) continue;
		if (!groups.has(name)) groups.set(name, []);
		groups.get(name).push([id, character]);
	}
	for (const members of groups.values()) {
		if (members.length < 2) continue;
		const canonical = members.find(([, character]) => !hidden(character))?.[0];
		if (!canonical) continue;
		const skills = [...new Set(members.flatMap(([, character]) => skillsOf(character)))];
		for (const [id, original] of members) {
			// A definition can be shared with another pack. Never mutate that object.
			const character = Array.isArray(original) ? original.slice() : Object.assign(Object.create(Object.getPrototypeOf(original)), original);
			const tags = tagsOf(original).filter(tag => typeof tag !== "string" || !tag.startsWith(aliasTag));
			if (id !== canonical) {
				aliases.set(id, canonical);
				if (!tags.includes("unseen")) tags.push("unseen");
				tags.push(aliasTag + canonical);
			}
			if (Array.isArray(character)) {
				character[3] = [...skills];
				character[4] = tags;
			} else {
				character.skills = [...skills];
				character.trashBin = [...(original.trashBin || []).filter(tag => typeof tag !== "string" || !tag.startsWith(aliasTag)), ...(id !== canonical ? [aliasTag + canonical] : [])];
				if (id !== canonical) character.isUnseen = true;
			}
			pack.character[id] = character;
		}
	}
	function updateSort(groups) {
		return Object.fromEntries(Object.entries(groups).map(([key, value]) => [key, Array.isArray(value) ? [...new Set(value.map(id => aliases.get(id) || id))] : value && typeof value === "object" ? updateSort(value) : value]));
	}
	if (aliases.size && pack.characterSort) pack.characterSort = updateSort(pack.characterSort);
	return aliases;
}
