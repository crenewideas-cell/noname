/**
 * A lobby owns a draft of its preferences and metadata, never engine registries.
 * Game entry is an explicit action; merely rendering a lobby cannot install
 * skills, replace event contents, change a player's state, or register hooks.
 * This is an API boundary for bundled providers, not a sandbox for arbitrary JS.
 */
export function copySceneData(value, seen = new Map()) {
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return seen.get(value);
	if (value instanceof Map) {
		const copy = new Map(); seen.set(value, copy);
		for (const [key, item] of value) copy.set(copySceneData(key, seen), copySceneData(item, seen));
		return copy;
	}
	if (value instanceof Set) {
		const copy = new Set(); seen.set(value, copy);
		for (const item of value) copy.add(copySceneData(item, seen));
		return copy;
	}
	if (value instanceof Date) return new Date(value);
	const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
	seen.set(value, copy);
	for (const key of Object.keys(value)) copy[key] = copySceneData(value[key], seen);
	return copy;
}

export function createSceneContext(host, { settingsKey, defaults = {}, actions = {} }) {
	const { lib, game, ui, get } = host;
	const settings = copySceneData(lib.config[settingsKey] || {});
	const config = Object.assign(copySceneData(lib.config), defaults, settings);
	config.mode_config ||= {};
	// The current engine owns game options, even when an old UI saved a copy.
	config.mode = lib.config.mode;
	config.mode_config = copySceneData(lib.config.mode_config || {});
	config.characters = [...(lib.config.characters || [])];
	const pendingMode = new Map();
	// Never interpret code saved by an old client as a UI preference.
	delete config.liulikill_rz_codeFix;
	config.rz_nextIsPaiwei = false;
	const sceneLib = { config, assetURL: lib.assetURL, configprefix: lib.configprefix,
		characterDefaultPicturePath: lib.characterDefaultPicturePath,
		device: lib.device, version: lib.version,
		// Legacy factories may assign to these; they are private and never installed.
		skill: {}, card: {}, element: { player: {}, card: {}, content: {} },
		onover: [], arenaReady: [], onload: [], extensionMenu: {}, extensionPack: {},
	};
	for (const key of ["character", "characterPack", "characterSort", "translate", "rank", "group", "groupnature", "nature"]) {
		sceneLib[key] = copySceneData(lib[key] || {});
	}
	function importedMetadata() {
		return { character: Object.fromEntries(Object.entries(lib.imported.character || {}).map(([key, pack]) => [key, {
			character: copySceneData(pack.character || {}), translate: copySceneData(pack.translate || {}),
		}])) };
	}
	function refreshSort() {
		for (const pack of Object.values(lib.imported.character || {})) {
			Object.assign(sceneLib.characterSort, copySceneData(pack.characterSort || {}));
		}
	}
	sceneLib.imported = importedMetadata();
	refreshSort();
	const sceneGet = {};
	for (const key of ["cnNumber", "translation", "slimName", "rand", "itemtype", "groupnature"]) {
		if (typeof get[key] === "function") sceneGet[key] = (...args) => copySceneData(get[key](...args));
	}
	sceneGet.config = (key, mode = config.mode) => config.mode_config?.[mode]?.[key] ?? config[key];
	sceneGet.mode = () => config.mode;
	sceneGet.character = name => copySceneData(get.character(name));
	sceneGet.extensionConfig = (name, key) => config["extension_" + name + "_" + key];
	const sceneUi = { create: { div: ui.create.div.bind(ui.create), node: ui.create.node.bind(ui.create) },
		background: ui.background, dialogs: [] };
	const sceneGame = {
		documentZoom: game.documentZoom,
		addVideo() {},
		playAudio: (...args) => game.playAudio(...args),
		log: (...args) => console.info(...args),
		saveConfig(key, value, mode, callback) {
			if (typeof mode === "string") {
				(config.mode_config[mode] ||= {})[key] = copySceneData(value);
				if (!pendingMode.has(mode)) pendingMode.set(mode, {});
				pendingMode.get(mode)[key] = copySceneData(value);
			} else {
				config[key] = copySceneData(value);
				// Explicit profile / enabled-pack edits use the same saved preference
				// as the stock settings page. They do not install rules themselves.
				if (key === "characters" && Array.isArray(value) && value.every(name => Object.hasOwn(lib.characterPack, name))) {
					game.saveConfig(key, [...value]);callback?.();return;
				}
				if (key === "connect_nickname" && typeof value === "string") {
					game.saveConfig(key, value);callback?.();return;
				}
				settings[key] = copySceneData(value);
				game.saveConfig(settingsKey, settings);
			}
			callback?.();
		},
		...actions,
	};
	sceneLib.game = sceneGame;
	return { lib: sceneLib, game: sceneGame, ui: sceneUi, get: sceneGet, ai: {}, _status: {}, config,
		refreshCharacters() {
			for (const key of ["character", "characterPack", "characterSort", "translate"]) sceneLib[key] = copySceneData(lib[key] || {});
			sceneLib.imported = importedMetadata();
			refreshSort();
		},
		/** Only stock mode options chosen on the lobby's mode page may cross. */
		async commitMode(mode) {
			if (!lib.config.all.mode.includes(mode) || mode === "connect") throw new Error("当前玩法不可用");
			const options = pendingMode.get(mode) || {};
			const accepted = [];
			for (const key of [mode + "_mode", "player_number"]) {
				if (options[key] === undefined) continue;
				const definition = lib.mode?.[mode]?.config?.[key];
				// Fixed-size modes have no player-number setting to submit.
				if (!definition && key === "player_number") continue;
				const items = typeof definition?.item === "function" ? definition.item() : definition?.item;
				if (!items || !Object.hasOwn(items, options[key])) throw new Error("该模式选项不受本体支持：" + key + "=" + options[key]);
				accepted.push([key, options[key]]);
			}
			// Validate the complete draft before changing any host preference.
			for (const [key, value] of accepted) await game.promises.saveConfig(key, value, mode);
			await game.promises.saveConfig("mode", mode);
		},
	};
}
