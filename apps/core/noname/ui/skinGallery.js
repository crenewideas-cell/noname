import { lib, get } from "noname";
import { getSkinService } from "../skin/index.js";
import { createSkinGallery } from "../skin/gallery.js";

let activeGallery;
export function openSkinGallery(character, onApply) {
	activeGallery?.close();
	const characters = Object.keys(lib.character).filter(id => !get.character(id).isUnseen);
	if (character && !characters.includes(character)) characters.unshift(character);
	activeGallery = createSkinGallery({
		characters,
		initialCharacter: character,
		store: getSkinService(),
		label: id => get.translation(id),
		enabled: () => lib.config.change_skin !== false,
		portrait(node, id, path) {
			node.replaceChildren();
			node.setBackground(id, "character", "noskin");
			if (path) {
				// Separate layer: a late database original cannot overwrite the preview skin.
				const overlay = document.createElement("div");
				overlay.style.cssText = "position:absolute;inset:0;border-radius:inherit;background-size:cover;background-position:inherit;pointer-events:none";
				overlay.setAttribute("aria-hidden", "true");
				overlay.setBackgroundImage(path);
				node.append(overlay);
			}
		},
		onApply,
	});
	return activeGallery;
}
