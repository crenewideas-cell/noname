import { lib, game, get } from "noname";
import { createSkinService } from "./service.js";
import { skinCatalog } from "./catalog.js";
import { save } from "../util/config.js";
import { skinStorageKey } from "./portrait.js";

let service;
export function refreshCharacterSkins() {
	for (const node of document.querySelectorAll("[data-skin-character]")) {
		try {
			if (node.isConnected) node.setBackground(node.dataset.skinCharacter, "character");
		} catch (error) {
			console.warn("武将立绘刷新失败", node.dataset.skinCharacter, error);
		}
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
	}
	return service;
}
