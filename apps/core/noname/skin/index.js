import { lib, game, get } from "noname";
import { createSkinService } from "./service.js";
import { skinCatalog } from "./catalog.js";
import { save } from "../util/config.js";
import { skinStorageKey } from "./portrait.js";
import { managedPortrait, managedToken, skinEnabled } from "./management.js";

let service;
const skinListeners = new Set();
export function subscribeCharacterSkins(listener) {
	skinListeners.add(listener);
	return () => skinListeners.delete(listener);
}
export function refreshCharacterSkins() {
	for (const node of document.querySelectorAll("[data-skin-character]")) {
		try {
			if (node.isConnected) node.setBackground(node.dataset.skinCharacter, "character");
		} catch (error) {
			console.warn("武将立绘刷新失败", node.dataset.skinCharacter, error);
		}
	}
	for (const listener of skinListeners) {
		try { listener(); } catch (error) { console.warn("皮肤界面刷新失败", error); }
	}
}
export function getSkinService() {
	if (!service) {
		service = createSkinService({
			config: () => lib.config,
			characterKey: skinStorageKey,
			// Use the existing persistence backend directly: saveConfig does not return its promise.
			save: (key, value) => save(key, "config", value),
			directory: name => get.skinPath(name),
			readDirectory: path =>
				new Promise((resolve, reject) => {
					const timer = setTimeout(() => reject(new Error("皮肤目录读取超时")), 4000);
					try {
						game.getFileList(
							path,
							(_folders, files) => {
								clearTimeout(timer);
								resolve(files);
							},
							error => {
								clearTimeout(timer);
								reject(error);
							}
						);
					} catch (error) {
						clearTimeout(timer);
						reject(error);
					}
				}),
			exists: path =>
				new Promise(resolve => {
					const image = new Image();
					const timer = setTimeout(() => done(false), 5000);
					const done = value => {
						clearTimeout(timer);
						image.onload = image.onerror = null;
						resolve(value);
					};
					image.onload = () => done(true);
					image.onerror = () => done(false);
					image.src = lib.assetURL + path;
				}),
			substitutes: name => (lib.characterSubstitute[skinStorageKey(name)] || []).map(item => item[0]),
			refresh: refreshCharacterSkins,
		});
		service.register("core", name => skinCatalog[skinStorageKey(name)] || []);
		service.register("skin-sets", async name => {
			const {getSkinManagement} = await import('./managementRuntime.js');
			const key = skinStorageKey(name);
			return getSkinManagement().listSets().flatMap(set => {
				const entry = set.entries[key];
				return entry && !entry.classic && skinEnabled(lib.config,key,'static',entry.path) && skinEnabled(lib.config,key,'static',managedToken(set.id)) ? [{...entry, source:set.name}] : [];
			});
		});
		service.register("managed-selection", name => {
			const entry = lib.config.skin_management?.selections?.[skinStorageKey(name)];
			return entry?.path && managedPortrait(lib.config,skinStorageKey(name)) ? [entry] : [];
		});
		service.register('loose-and-extra', async name => {
			const {getSkinManagement}=await import('./managementRuntime.js');
			const key=skinStorageKey(name);
			return getSkinManagement().listAssets(key).filter(asset=>skinEnabled(lib.config,key,'static',asset.token)&&skinEnabled(lib.config,key,'static',asset.path)).map(asset=>({...asset,source:asset.set?'套装补充原画':'游离原画'}));
		});
		// Every UI commits to the same store, including the core skin picker.
		const revisions = new Map();
		service.apply = async (name, path) => {
			const key = skinStorageKey(name), revision = (revisions.get(key) || 0) + 1;
			revisions.set(key, revision);
			const {getSkinManagement, relatedCharacters} = await import('./managementRuntime.js');
			const manager = getSkinManagement();
			await manager.ready;
			const entry = path == null ? null : (await service.list(name)).skins.find(skin => skin.id === path);
			if(path != null && !entry)throw Error('该皮肤已不可用，请刷新列表');
			if(revisions.get(key) !== revision || lib.config.change_skin === false)return false;
			const set = entry && manager.listSets().find(set => set.entries[key]?.path === entry.path);
			const asset=manager.listAssets(key).find(asset=>asset.path===entry?.path);
			if(asset)await manager.select(key,{...asset,assetId:asset.id},relatedCharacters([key]));
			else if(set)await manager.applySet(set.id, [key]);
			else await manager.select(key, entry, relatedCharacters([key]));
			return true;
		};
		// PIXI portrait consumers use this getter rather than the DOM resolver.
		service.current = name => managedPortrait(lib.config, skinStorageKey(name));
	}
	return service;
}
