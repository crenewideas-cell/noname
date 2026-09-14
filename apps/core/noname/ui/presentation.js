import { lib, game, _status } from "noname";

/** Room participants share the current menus; keep offline theme preferences. */
export function usesModernPresentation() {
	return game.online || _status.connectMode || lib.config.mode === "connect" || lib.config.presentation_style !== "classic";
}

export function applyPresentation() {
	document.documentElement.dataset.presentation = usesModernPresentation() ? "shousha" : "classic";
}
