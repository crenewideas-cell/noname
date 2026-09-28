/** Own shared profile/treasure sessions once, even when a provider reopens one. */
export function createLobbyViews({ lib, openCharacter, openTreasure, graphics, showCharacters, syncFavorites }) {
	const sessions = new Map();
	let disposed = false, characterPage;
	function own(view, profile = false) {
		if (disposed) { view.close(); return view; }
		if (sessions.has(view)) return view;
		const favorites = JSON.stringify(lib.config.favouriteCharacter || []);
		const closed = () => {
			sessions.delete(view);
			if (profile && !disposed) syncFavorites?.([...(lib.config.favouriteCharacter || [])], favorites !== JSON.stringify(lib.config.favouriteCharacter || []));
		};
		sessions.set(view, closed);
		view.addEventListener('close', closed, { once: true });
		return view;
	}
	return {
		get characterPage() { return characterPage; },
		set characterPage(value) { characterPage = value; },
		character(name, page = characterPage || lib.config.qhly_listdefaultpage || 'introduce') {
			if (disposed) return;
			return own(openCharacter(name, undefined, page), true);
		},
		characters() { if (!disposed) { characterPage = undefined; showCharacters(); } },
		skins() { if (!disposed) { characterPage = 'skin'; showCharacters(); return this.character(undefined, 'skin'); } },
		treasure() { if (!disposed) return own(openTreasure({ PIXI: graphics() })); },
		closeAll() {
			for (const [view, listener] of sessions) { view.removeEventListener('close', listener); view.close(); }
			sessions.clear(); characterPage = undefined;
		},
		destroy() { if (!disposed) { disposed = true; this.closeAll(); } },
	};
}
