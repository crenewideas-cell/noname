import { lib } from "noname";

/** Presentation is a local preference, independent of the room's rules. */
export function usesModernPresentation() {
	return lib.config.presentation_style !== "classic";
}

export function applyPresentation() {
	document.documentElement.dataset.presentation = usesModernPresentation() ? "shousha" : "classic";
}
