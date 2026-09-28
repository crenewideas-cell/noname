// Character skills can replace ui.background or update its inline image.
// Observe that existing contract instead of letting a UI skin paint over it.
let release;
export function installArenaBackground({ ui }) {
	release?.();
	const body = document.body, arena = ui.arena;
	if (!arena) return;
	const originalImage = ui.background?.style.backgroundImage || '';
	const keys = ['--arena-scene-image', '--arena-scene-size', '--arena-scene-position'];
	const previous = keys.map(key => [key, body.style.getPropertyValue(key)]);
	let background, stopped = false;
	const imageObserver = new MutationObserver(refresh);
	function refresh() {
		if (stopped) return;
		if (!arena.isConnected) { dispose(); return; }
		if (background !== ui.background) {
			imageObserver.disconnect(); background = ui.background;
			if (background) imageObserver.observe(background, { attributes: true, attributeFilter: ['style'] });
		}
		const image = background?.style.backgroundImage || '';
		const overlay = body.querySelector(':scope > [data-character-backdrop="ready"]');
		const changed = !!image && image !== 'none' && image !== originalImage;
		body.toggleAttribute('data-arena-scene', changed || !!overlay);
		if (changed) {
			body.style.setProperty(keys[0], image);
			body.style.setProperty(keys[1], background.style.backgroundSize || 'cover');
			body.style.setProperty(keys[2], background.style.backgroundPosition || 'center');
		} else {
			for (const key of keys) body.style.removeProperty(key);
		}
	}
	const observer = new MutationObserver(records => {
		if (records.some(record => record.target === body || record.target === arena.parentElement ||
			record.attributeName === 'data-character-backdrop')) refresh();
	});
	function dispose() {
		if (stopped) return;
		stopped = true; imageObserver.disconnect(); observer.disconnect();
		body.removeAttribute('data-arena-scene');
		for (const [key, value] of previous) {
			if (value) body.style.setProperty(key, value); else body.style.removeProperty(key);
		}
	}
	release = dispose;
	observer.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-character-backdrop'] });
	refresh();
}
