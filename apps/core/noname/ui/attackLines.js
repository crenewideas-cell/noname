/** Visual-only ports of 琉璃版 5.5 祖安武将's gold line and 指示线.zip.
 * Coordinates stay in the engine's arena/chess container, including zoom.
 * No skill registration, rule hooks, gameplay delays or legacy eval. */
const textures = {
	// Keep the persisted Liuli key as an alias, so existing saved packs upgrade.
	// The reference's default 官阶 route uses this 60px gold artwork for game.me.
	Liuli: { folder: "yulongLineXy", height: 60 },
	ZipYulong: { folder: "yulongLineXy", height: 50 },
	ZipJingdian: { folder: "jingdianLineXy", height: 60 },
	ZipBaoji: { folder: "baojilinexy", height: 60 },
};
const active = new Map();
let currentStyle;

export function clearAttackLines() {
	for (const [node, animations] of active) {
		for (const animation of animations) animation.cancel();
		node.remove();
	}
	active.clear();
}

export function renderAttackLine({ style, path, parent, assetURL = "", duration, opacity = 1 }) {
	if (!parent || !Array.isArray(path) || path.length !== 4 || !path.every(Number.isFinite)) return null;
	const [x, y, tx, ty] = path, distance = Math.hypot(tx - x, ty - y);
	if (!distance || !textures[style]) return null;
	if (currentStyle !== style) { clearAttackLines(); currentStyle = style; }
	const node = document.createElement("div"), angle = Math.atan2(ty - y, tx - x) * 180 / Math.PI;
	node.className = "migrated-attack-line";
	node.dataset.lineStyle = style;
	node.setAttribute("aria-hidden", "true");
	const texture = textures[style], height = texture.height, width = distance + 2;
	Object.assign(node.style, {
		position: "absolute", pointerEvents: "none", zIndex: "1000", margin: "0", padding: "0", border: "0",
		left: `${x}px`, top: `${y - 30}px`, width: `${width}px`, height: `${height}px`,
		transformOrigin: "0 50%", transform: `rotate(${angle}deg) scaleX(0)`,
		opacity: String(Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 1),
		background: `url(${JSON.stringify(assetURL + "image/pointer/migrated/" + texture.folder + "/line.png")}) 0 0 / 100% 100% no-repeat`,
	});
	parent.appendChild(node);
	const total = Number.isFinite(duration) && duration > 0 ? Math.max(100, Math.min(100000, duration)) : 1400;
	const transform = (shift, scale) => `rotate(${angle}deg) translateX(${shift}px) scaleX(${scale})`;
	// Original gold texture animation: 50ms delay, ease-out/return, fade at 1050ms.
	const keyframes = [
		{ transform: transform(0, 0), offset: 0 },
		{ transform: transform(0, 0), offset: 50 / 1400, easing: "ease" },
		{ transform: transform(0, 1), offset: (50 + 950 * 2 / 3) / 1400, easing: "ease" },
		{ transform: transform(width - Math.pow(128 ** 2 + 40.5 ** 2, .1), .01), offset: 1000 / 1400 },
		{ transform: transform(width - Math.pow(128 ** 2 + 40.5 ** 2, .1), .01), offset: 1 },
	];
	const animations = [node.animate(keyframes, { duration: total, fill: "both" })];
	animations.push(node.animate([
		{ opacity: node.style.opacity, offset: 0 },
		{ opacity: node.style.opacity, offset: .75, easing: "ease" },
		{ opacity: 0, offset: 1 },
	], { duration: total, fill: "both" }));
	active.set(node, animations);
	const cleanup = () => { for (const animation of animations) animation.cancel(); node.remove(); active.delete(node); };
	// One compositor animation per line; no per-line frame loops or timers.
	Promise.all(animations.map(animation => animation.finished)).then(cleanup, cleanup);
	return node;
}
