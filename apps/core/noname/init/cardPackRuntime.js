/** The single registration/configuration path for built-in and extension cards. */
import { subscribePresentation } from "../ui/presentationEvents.js";

const registrations = new WeakMap();
const artwork = new WeakMap();

const unique = (list, value) => {
	if (!list.includes(value)) list.push(value);
};

export const cardPackId = name => name.replace(/^mode_extension_/, "");

// Untyped derivation tokens are valid; lifecycle functions and skill objects are not cards.
export function isCardDefinition(value) {
	return !!value && typeof value === "object" && !Array.isArray(value)
		&& !value.cardSkill && !(!value.type && (value.mod || value.trigger));
}

export function normalizeCardImage(image) {
	// Legacy skill cards used the element.setBackground path syntax.
	return typeof image === "string" && /^character\/[^/]+$/.test(image)
		? image.replace(/^character\//, "character:") : image;
}

export function isCardPackEnabled(lib, name, connect = lib.config.mode === "connect") {
	name = cardPackId(name);
	return connect ? !(lib.config.connect_cards || []).includes(name) : (lib.config.cards || []).includes(name);
}

export function setCardPackEnabled(lib, game, name, enabled, connect = false) {
	const key = connect ? "connect_cards" : "cards";
	const values = (lib.config[key] ||= []);
	const include = connect ? !enabled : enabled;
	for (const id of (Array.isArray(name) ? name : [name]).map(cardPackId)) {
		if (include) unique(values, id);
		else if (values.includes(id)) values.splice(values.indexOf(id), 1);
	}
	return game.saveConfig(key, values);
}

function initializeExtensionSwitch(lib, game, name, extension, defaultEnabled) {
	const key = `@Experimental.extension.${name}.card`;
	if (lib.config[key]) return;
	const legacy = lib.config[`extension_${extension}_cards_enable`];
	const aliases = (lib.config.cards ||= []);
	const oldId = `mode_extension_${name}`;
	const enabled = aliases.includes(name) || aliases.includes(oldId) || aliases.includes(extension) || aliases.includes(`mode_extension_${extension}`) || (legacy ?? defaultEnabled);
	if (aliases.includes(oldId)) aliases.splice(aliases.indexOf(oldId), 1);
	setCardPackEnabled(lib, game, name, enabled);
	lib.config[key] = true;
	game.saveConfig(key, true);
}

export function cardPackAllowed(pack, mode) {
	const modes = value => (typeof value === "string" ? [value] : value);
	return (!pack.mode || modes(pack.mode).includes(mode)) && !modes(pack.forbid)?.includes(mode);
}

function normalizeSkill(skill, extension) {
	if (!skill || typeof skill !== "object") return;
	if (typeof skill.audio === "number" || typeof skill.audio === "boolean") skill.audio = `ext:${extension}:${Number(skill.audio)}`;
	for (const child of Object.values(skill.subSkill || {})) normalizeSkill(child, extension);
}

/** Keeps source piles immutable and preserves intentional repeated card tuples. */
export function registerCardPack(lib, game, get, pack, options = {}) {
	const { extension = pack.extension, database = false, defaultEnabled = true, legacyExtension = extension } = options;
	const name = cardPackId(options.name || pack.name || extension);
	if (extension) initializeExtensionSwitch(lib, game, name, legacyExtension, defaultEnabled);
	const connect = lib.config.mode === "connect";
	const allowed = cardPackAllowed(pack, lib.config.mode);
	const enabled = allowed && isCardPackEnabled(lib, name);
	lib.cardPackInfo[name] = pack;
	lib.cardPack[name] ||= [];
	if (lib.config.all) unique((lib.config.all.cards ||= []), name);
	if (extension) (lib.cardPackExtension ||= {})[name] = legacyExtension;
	lib.translate[`${name}_card_config`] = pack.translate?.[pack.name] || options.label || lib.translate[`${name}_card_config`] || name;
	if (pack.connect === true) unique((lib.connectCardPack ||= []), name);

	for (const section of ["card", "skill", "translate", "help"]) {
		lib[section] ||= {};
		for (const [id, original] of Object.entries(pack[section] || {})) {
			if (section === "card" && !isCardDefinition(original)) continue;
			if (section === "translate" && id === pack.name) continue;
			if (section === "skill" && id.startsWith("_") && !original.forceLoad && (!enabled || (connect && !pack.connect))) continue;
			let item = original;
			if (section === "card") {
				const presentation = pack.cardPresentation?.[id];
				if (presentation) item = { ...item, ...presentation };
				if (normalizeCardImage(item.image) !== item.image) item = { ...item, image: normalizeCardImage(item.image), fullimage: true };
			}
			if (section === "card" && !item.hidden && (pack.translate?.[`${id}_info`] || extension)) unique(lib.cardPack[name], id);
			if (lib[section][id] != null) continue; // Existing definitions and translations win together.
			if (extension && ["card", "skill"].includes(section)) {
				item = get.copy(item);
				if (section === "skill") normalizeSkill(item, extension);
				else {
					if (item.audio === true) item.audio = `ext:${extension}`;
					if (!item.image && (item.fullskin || item.fullimage)) {
						const file = `${id}.${item.fullskin ? "png" : "jpg"}`;
						item.image = database ? `db:extension-${extension}:${file}` : `ext:${extension}/${file}`;
					}
				}
			}
			if (section === "skill" && connect && !pack.connect && !item.forceLoad) item = { nopop: item.nopop, derivation: item.derivation };
			const descriptor = Object.getOwnPropertyDescriptor(pack[section], id);
			Object.defineProperty(lib[section], id, { ...descriptor, ...("value" in descriptor ? { value: item } : {}) });
			if (section === "card" && item.derivation) unique((lib.cardPack.mode_derivation ||= []), id);
		}
	}

	let state = registrations.get(lib);
	if (!state) registrations.set(lib, (state = new Map()));
	const previous = state.get(name);
	// Some extensions call addCardPack repeatedly with fragments of the same pack.
	const seen = previous?.seen || new WeakSet();
	if (seen.has(pack)) return;
	seen.add(pack);
	const source = typeof pack.list === "function" ? pack.list() : pack.list || [];
	if (!Array.isArray(source)) throw new TypeError(`卡牌包 ${name} 的 list 必须是数组`);
	const pile = [...(previous?.source || []), ...get.copy(source)];
	lib.cardPile[name] = get.copy(pile);
	if (connect) {
		lib.cardPackList ||= {};
		if (pack.connect && allowed) lib.cardPackList[name] = get.copy(pile);
	} else {
		// Replace only the exact tuples previously contributed by this pack.
		const oldEntries = new Set(previous?.entries || []);
		for (let i = lib.card.list.length - 1; i >= 0; i--) if (oldEntries.has(lib.card.list[i])) lib.card.list.splice(i, 1);
		const banned = lib.config.bannedpile?.[name] || [];
		const entries = enabled ? get.copy([...pile.filter((_, i) => !banned.includes(i)), ...(lib.config.addedpile?.[name] || [])]) : [];
		// Extension content registers after the boot-time alias normalization.
		// Normalize edited elemental attacks here too, or they never become cards.
		const natures = { huosha: "fire", leisha: "thunder", icesha: "ice", cisha: "stab", kamisha: "kami" };
		for (const entry of entries) {
			if (Object.hasOwn(natures, entry[2])) {
				entry[3] = natures[entry[2]];
				entry[2] = "sha";
			}
		}
		lib.card.list.push(...entries);
		state.set(name, { seen, source: pile, entries, extension });
		return;
	}
	state.set(name, { seen, source: pile, entries: [], extension });
}

/** A configured replacement deck still honors the pack switch and pile editor. */
export function replaceCardPackPile(lib, game, get, name, list) {
	if (!isCardPackEnabled(lib, name) || lib.config.mode === "connect") return false;
	const states = registrations.get(lib);
	const previous = states?.get(name);
	if (!previous) return false;
	previous.source = [];
	const pack = { ...lib.cardPackInfo[name], name, list };
	registerCardPack(lib, game, get, pack);
	lib.card.list = [...states.get(name).entries];
	for (const [id, state] of states) if (id !== name && state.extension) lib.card.list.push(...state.entries);
	return true;
}

/** Legacy addCard is a small pack fragment, never a second deck insertion path. */
export function singleCardPack(name, card, info = {}) {
	const suits = info.color === "red" ? ["heart", "diamond"] : info.color === "black" ? ["club", "spade"] : ["heart", "spade", "diamond", "club"];
	const list = Array.from({ length: Math.max(0, Math.min(1000, Math.floor(Number(info.number) || 0))) }, () => [suits[Math.floor(Math.random() * suits.length)], Math.ceil(Math.random() * 13), name]);
	return { card: { [name]: card }, translate: { [name]: info.translate || name, [`${name}_info`]: info.description || "" }, list };
}

/** Data collector used by imported sources; it cannot register or change the live deck. */
export function createCardPackBuilder(lib = {}) {
	const pack = { card: {}, skill: {}, translate: {}, list: [] };
	for (const key of ["card", "skill", "translate"]) if (lib[key]) Object.setPrototypeOf(pack[key], lib[key]);
	return {
		...pack,
		addPack(data) {
			for (const section of ["card", "skill", "translate"]) Object.assign(pack[section], data[section]);
			pack.list.push(...(typeof data.list === "function" ? data.list() : data.list || []));
		},
		addCard(name, card, info) {
			this.addPack(singleCardPack(name, card, info));
		},
		finish() {
			return pack;
		},
	};
}

/** Shared configuration adapter and lifecycle for the imported card collection. */
export function createCardCollection(name, sources, args, assets = [], presentation = {}) {
	const [lib, game, ui, get] = args;
	const members = sources.map(source => ({ ...source, data: source.create(...args) }));
	const artChoices = Object.fromEntries(assets.filter(item => item.kind === "art").map(item => [item.id, item.label]));
	const iceChoices = Object.fromEntries(assets.filter(item => item.kind === "ice").map(item => [item.id, item.label]));
	const config = {
		cardArt: { name: "导入卡面", init: "off", item: { off: "沿用当前卡面", ...artChoices }, restart: true },
		iceArt: { name: "冰杀卡面", init: "off", item: { off: "沿用当前卡面", ...iceChoices }, restart: true },
		olEffects: { name: "OL 卡牌序列帧特效", init: false, restart: true },
		instructions: { name: "卡包开关与牌堆在「卡牌」页设置；以下参数重启后生效。王者魔戒缺少王者荣耀系统，暂不可用。", clear: true, nopointer: true },
	};
	for (const member of members) {
		for (const [key, option] of Object.entries(member.data.config || {})) {
			if (!("init" in option)) continue;
			const mergedKey = `${member.id}_${key}`;
			const oldKey = `extension_${member.name}_${key}`;
			config[mergedKey] = { ...option, name: `${member.name} · ${option.name}`, init: lib.config[`extension_${name}_${mergedKey}`] ?? lib.config[oldKey] ?? option.init, restart: true };
			if (!option.item && typeof option.init === "string" && /^\d+$/.test(option.init)) {
				config[mergedKey].item = Object.fromEntries([...new Set(["0", "1", "2", "3", "5", "7", "10", option.init, String(config[mergedKey].init)])].map(value => [value, `${value}张`]));
			}
			delete config[mergedKey].onclick; // All writes use the engine's standard configuration control.
		}
	}
	return {
		name,
		editable: false,
		config,
		package: { intro: "导入卡包统一使用卡牌页开关和牌堆设置；具体参数在本页调整，重启生效。", author: "原扩展作者 / PXLNGU 整理", version: "1.0", nopack: true },
		content(settings = {}) {
			installCardPackArtwork(lib, ui, name, assets, settings);
			const errors = [];
			for (const member of members) {
				const options = {};
				for (const [key, option] of Object.entries(member.data.config || {})) {
					let value = settings[`${member.id}_${key}`] ?? config[`${member.id}_${key}`]?.init ?? option.init;
					if (option.item && !(value in option.item)) value = option.init;
					if (!option.item && typeof option.init === "string" && /^\d+$/.test(option.init)) value = String(Math.max(0, Math.min(1000, Math.floor(Number(value) || 0))));
					options[key] = value;
					lib.config[`extension_${name}_${member.id}_${key}`] = value;
				}
				const register = () => {
					const builder = createCardPackBuilder(lib);
					member.data.build(options, builder);
					const pack = { ...builder.finish(), name: member.id, connect: false, cardPresentation: presentation[member.id], ...member.constraints };
					registerCardPack(lib, game, get, pack, { extension: `${name}/members/${member.id}`, legacyExtension: member.name, name: member.id, label: member.name, defaultEnabled: false });
				};
				if (member.deferred) lib.arenaReady.push(register);
				else
					try {
						register();
					} catch (cause) {
						errors.push(new Error(`${member.name}：${cause.message}`, { cause }));
					}
			}
			if (errors.length) throw new AggregateError(errors, errors.map(error => error.message).join("\n"));
		},
	};
}

/** Mode-owned decks can opt specific packs in without patching that mode's rules. */
export function applyModeCardPacks(lib, get) {
	for (const [name, state] of registrations.get(lib) || []) {
		const pack = lib.cardPackInfo[name];
		if (!pack.modePile || !cardPackAllowed(pack, lib.config.mode) || !isCardPackEnabled(lib, name)) continue;
		if (state.entries.length && !state.entries.some(entry => lib.card.list.includes(entry))) {
			state.entries = get.copy(state.entries);
			lib.card.list.push(...state.entries);
		}
	}
}

export function resolveCardPackImage(lib, name, nature) {
	const state = artwork.get(lib);
	if (!state) return;
	return (
		(name === "sha" &&
		String(nature || "")
			.split("|")
			.includes("ice")
			? state.ice
			: undefined) || state.images[name]
	);
}

function installCardPackArtwork(lib, ui, name, assets, settings) {
	artwork.get(lib)?.dispose?.();
	const state = { images: {}, ice: undefined, dispose: undefined };
	const url = (asset, file) => `extension/${name}/assets/${asset.id}/${file}`;
	for (const asset of assets) {
		if (asset.id === settings.cardArt && asset.kind === "art") for (const [card, file] of Object.entries(asset.cards)) state.images[card] = url(asset, file);
		if (asset.id === settings.iceArt && asset.kind === "ice") state.ice = url(asset, asset.files[0]);
	}
	if (settings.olEffects) {
		const frames = {};
		for (const asset of assets.filter(item => item.kind === "frames")) for (const [card, files] of Object.entries(asset.frames)) frames[card] = files.map(file => lib.assetURL + url(asset, file));
		const active = new Set();
		const stop = subscribePresentation(message => {
			if (message.type !== "card" || message.action !== "use" || !frames[message.card]?.length || !ui.arena?.isConnected || active.size >= 4) return;
			const files = frames[message.card];
			const img = document.createElement("img");
			img.alt = "";
			img.style.cssText = "position:absolute;left:50%;top:50%;width:220px;height:300px;object-fit:contain;transform:translate(-50%,-50%);pointer-events:none;z-index:30";
			ui.arena.appendChild(img);
			let timer,
				index = 0;
			const cleanup = () => {
				clearTimeout(timer);
				img.remove();
				active.delete(cleanup);
			};
			active.add(cleanup);
			img.onerror = cleanup;
			const next = () => {
				if (!img.isConnected || index >= files.length) return cleanup();
				img.src = files[index++];
				timer = setTimeout(next, 50);
			};
			next();
		});
		state.dispose = () => {
			stop();
			for (const cleanup of active) cleanup();
		};
	}
	artwork.set(lib, state);
}
