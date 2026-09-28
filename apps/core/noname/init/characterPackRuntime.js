/** One persisted selection for every extension character-pack registration API. */
export function initializeCharacterPack(lib, game, name, extension) {
	if (!extension) return;
	(lib.characterPackExtension ||= {})[name] = extension;
	const choice = lib.config.character_pack_choices?.[name];
	if (typeof choice === "boolean") {
		const selected = lib.config.characters || [];
		if (selected.includes(name) !== choice) game.saveConfig("characters", choice ? [...selected, name] : selected.filter(id => id !== name));
	}
	const key = `@Experimental.extension.${name}.character`;
	if (lib.config[key]) return;
	const selected = (lib.config.characters ||= []).slice();
	const legacy = lib.config[`extension_${extension}_characters_enable`];
	const alias = `mode_extension_${name}`;
	const enabled = choice ?? (legacy !== false || selected.includes(name) || selected.includes(alias));
	const next = selected.filter(id => id !== alias);
	if (enabled && !next.includes(name)) next.push(name);
	game.saveConfig("characters", next);
	game.saveConfig(key, true);
}

/** Keep an explicit menu choice even when old extension code appends itself again. */
export function rememberCharacterPackChoices(lib, game, names, enabled) {
	const choices = { ...lib.config.character_pack_choices };
	for (const name of names) choices[name] = typeof enabled === "function" ? enabled(name) : enabled;
	game.saveConfig("character_pack_choices", choices);
}
