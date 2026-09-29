import providers from "../../game/card-resource-providers.js";
import { cardPackAllowed, requiredCharacterGroups, registerCardPack } from "./cardPackRuntime.js";

const pending = new WeakMap();

/** Load only shared card resources, without changing extension/general switches. */
export async function loadDependentCardResources(args, sources = providers) {
	const [lib, game, , get, , status] = args;
	const connect = lib.config.mode === "connect" || !!status?.connectMode;
	const groups = requiredCharacterGroups(lib, connect, game.players || []);
	let loaded = pending.get(lib);
	if (!loaded) pending.set(lib, loaded = new Map());
	for (const source of sources) {
		if (!source.groups.some(group => groups.has(group)) || connect && !source.connect) continue;
		if (!cardPackAllowed(source, connect ? lib.configOL?.mode || lib.config.mode : lib.config.mode)) continue;
		if (!loaded.has(source.name)) {
			const work = (async () => {
				const module = await source.load();
				const pack = await module.default(...args);
				registerCardPack(lib, game, get, { ...pack, name: source.name, dependencyOnly: true, connect: !!source.connect }, { label: source.label });
				// The lobby can resolve resources after the boot-time finishing pass.
				for (const name of Object.keys(pack.card || {})) game.finishCard?.(name);
				for (const name of Object.keys(pack.skill || {})) game.finishSkill?.(name);
			})();
			loaded.set(source.name, work);
			work.catch(() => loaded.delete(source.name));
		}
		await loaded.get(source.name);
	}
}
