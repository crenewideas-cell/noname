import { lib, game, ui, _status } from "noname";
import { importExtension } from "./import.js";
import { loadCharacter, loadCard, loadExtension } from "./loading.js";

// Extension factories share _status.extension. Serialize imports across switches.
let queue: Promise<unknown> = Promise.resolve();
const pending = new Map<string, Promise<void>>();

export function refreshExtensionCharacters(name: string) {
	const packs = lib.characterPack as Record<string, Record<string, import("../library/element/character.js").Character>>;
	const owned = Object.keys(lib.characterPackExtension || {}).filter(pack => lib.characterPackExtension[pack] === name);
	for (const pack of owned) {
		const enabled = lib.config[`extension_${name}_enable`] !== false && lib.config.characters.includes(pack);
		for (const [id, character] of Object.entries(packs[pack] || {})) {
			if (enabled) lib.character[id] ??= character;
			else {
				const shared = Object.entries(packs).some(([other, characters]) => other !== pack
					&& lib.config.characters.includes(other) && characters[id]
					&& (!lib.characterPackExtension?.[other] || lib.config[`extension_${lib.characterPackExtension[other]}_enable`] !== false));
				if (!shared) delete lib.character[id];
			}
		}
		for (const update of ui.updateCharacterPackMenu) update(pack);
	}
	for (const update of ui.updateCharacterPackMenu) update("");
}

/** Load newly enabled content into the current lobby, once per application session. */
export function enableExtensionRuntime(name: string): Promise<void> {
	if (pending.has(name)) return pending.get(name)!;
	const job = queue.then(async () => {
		if (!lib.config[`extension_${name}_enable`]) return;
		if (lib.extensionPack[name]?.code && !lib.extensionPack[name].runtimeFailed) { refreshExtensionCharacters(name); return; }
		const previousExtension = _status.extension;
		const previousEvaluation = _status.evaluatingExtension;
		// Boot consumes these queues; late extension modules still append to them.
		lib.onload ||= [];
		lib.onprepare ||= [];
		lib.arenaReady ||= [];
		const onloads = new Set(lib.onload);
		const extensions = new Set(lib.extensions || []);
		const prepares = new Set(lib.onprepare || []);
		const characters = new Map(Object.entries(lib.imported.character || {}));
		const cards = new Map(Object.entries(lib.imported.card || {}));
		const skills = new Set(Object.keys(lib.skill));
		const waiting = { character: _status.importing?.character?.length || 0, card: _status.importing?.card?.length || 0 };
		let extensionLoading = _status.extensionLoading?.length || 0;
		const register = async () => {
			// Factories can enqueue nested imports without returning their promises.
			for (const type of ["character", "card"]) {
				while (waiting[type] !== (_status.importing?.[type]?.length || 0)) {
					const imports = (_status.importing?.[type] || []).slice(waiting[type]);
					waiting[type] += imports.length;
					await Promise.all(imports);
				}
			}
			for (const [id, pack] of Object.entries(lib.imported.character || {})) {
				if (characters.get(id) === pack) continue;
				if (!lib.characterPack[id]) loadCharacter(pack);
				characters.set(id, pack);
			}
			for (const [id, pack] of Object.entries(lib.imported.card || {})) {
				if (cards.get(id) === pack) continue;
				if (!lib.cardPack[id]) loadCard(pack);
				cards.set(id, pack);
			}
		};
		try {
			_status.loadingExtensionRuntime = name;
			await importExtension(name, true);
			while (extensionLoading !== (_status.extensionLoading?.length || 0)) {
				const imports = (_status.extensionLoading || []).slice(extensionLoading);
				extensionLoading += imports.length;
				await Promise.all(imports);
			}
			if (!lib.extensionPack[name]?.code) throw new Error("扩展未完成加载");
			for (const prepare of lib.onprepare || []) if (!prepares.has(prepare)) await prepare();
			await register();
			for (const extension of lib.extensions || []) if (!extensions.has(extension)) await loadExtension(extension);
			await register();
			for (const skill of Object.keys(lib.skill)) if (!skills.has(skill)) game.finishSkill(skill);
			for (const onload of lib.onload) if (!onloads.has(onload)) await onload();
			refreshExtensionCharacters(name);
			for (const update of ui.updateCardPackMenu) for (const pack of Object.keys(lib.cardPack)) update(pack);
		} catch (error) {
			console.error(`扩展「${name}」实时加载失败`, error);
			if (lib.extensionPack[name]) lib.extensionPack[name].runtimeFailed = true;
			throw error;
		} finally {
			delete _status.loadingExtensionRuntime;
			if (previousExtension === undefined) delete _status.extension; else _status.extension = previousExtension;
			if (previousEvaluation === undefined) delete _status.evaluatingExtension; else _status.evaluatingExtension = previousEvaluation;
		}
	}).finally(() => pending.delete(name));
	pending.set(name, job);
	queue = job.catch(() => {});
	return job;
}
