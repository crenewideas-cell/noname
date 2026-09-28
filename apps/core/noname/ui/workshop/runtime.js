/** Self-contained: this exact renderer is included in exported Noname extensions. */
export function mountAppearance(manifest, resolveAsset, root = document.head, scope = ":is(#ui-workshop-custom, :root) ") {
	// One extra ID worth of specificity makes explicit workshop overrides win
	// over a provider's default skin, including styles loaded after this sheet.
	// :root is the matching branch; no synthetic gameplay node is created.
	const areas = {
		home: ["#splash"], modes: ["#splash .lobby-modes", "#splash .session-entry > div[link]"],
		lobby: [".online-lobby", ".online-dialog"], arena: ["#window", "body > .background"],
		cards: ["#window .card:not(.infohidden):not(:empty)"], cardback: ["#window .card.infohidden", "#window .card:empty"],
		buttons: ["#window .control", "#window #system > div > div", ".menubutton", "#splash button", ".online-dialog button"],
		menus: [".menu", ".menubg", "#window > .dialog"], players: ["#window .player"],
		hp: ["#window .hp > div"], lines: [".linexy:not(.hidden):not(.removing)"], fonts: ["#window", "#splash", ".online-dialog", ".menu"],
	};
	const style = document.createElement("style");
	style.dataset.uiWorkshop = manifest.id;
	const rules = [];
	// Exclude host-owned visibility states in every authored selector. A fixed
	// specificity mask alone can be defeated by a rule with repeated IDs.
	const protectedNodes = [".hidden", ".hidden *", ".removing", ".removing *", ".card.infohidden > *", ".card.infohidden > * *"];
	// Lobby settings and its tool menu are host-owned, shared by every skin.
	protectedNodes.push('.lobby-settings-page .menu', '.lobby-settings-page .menu *', '.lobby-tool-menu', '.lobby-tool-menu *');
	// Reference-lobby cards/navigation are atlas artwork, including their text.
	// Generic button palettes (also old saved/mixed packs) must not erase the
	// image or change its crop. Other lobby and in-game controls stay editable.
	for (const node of ['.reference-lobby .lobby-atlas-card', '.reference-lobby .session-bar button']) protectedNodes.push(node, node + ' *');
	// Management and online flows use the same host UI regardless of the game skin.
	for (const surface of ['.lobby-surface', '.skin-manager', '.online-lobby', '.online-dialog', '.online-game-status', '.online-game-notice', '.shousha-native-confirm']) protectedNodes.push(surface, surface + ' *');
	for (const [states, children] of [
		[".unseen,.unseen_v,.unseen_show", ".avatar,.name:not(.name2)"],
		[".unseen2,.unseen2_v,.unseen2_show", ".avatar2,.name2"],
	]) {
		const node = `:is(${states}) > :is(${children})`;
		protectedNodes.push(node, `${node} *`);
	}
	const guard = `:not(:is(${protectedNodes.join(",")}))`;
	const guarded = selector => {
		const pseudo = selector.search(/::|:(?:before|after|first-line|first-letter)\b/);
		return pseudo < 0 ? selector + guard : selector.slice(0, pseudo) + guard + selector.slice(pseudo);
	};
	const add = (selectors, properties) => {
		if (!selectors.length || !properties) return;
		const values = Object.entries(properties).map(([key, value]) => `${key}:${value} !important`).join(";");
		if (values) rules.push(`${selectors.map(selector => `${scope}${guarded(selector)}`).join(",")}{${values}}`);
	};
	const image = path => `url(${JSON.stringify(resolveAsset(path))})`;
	for (const [id, part] of Object.entries(manifest.components)) {
		let selectors = areas[id];
		// An in-game provider's explicit overrides must not recolor its lobby.
		if (part.runtime === 'decade') {
			const ingame = {arena:['#arena'],buttons:['#arena .control','#control .control','#system > div > div'],menus:['body[data-decade-parts] .menu','#arena > .dialog'],fonts:['#arena','#control','#system']};
			selectors = ingame[id] || selectors;
		}
		if (!selectors) continue;
		add(selectors, part.style);
		for (const rule of part.rules || []) add(selectors.map(selector => `${selector} ${rule.selector}`), rule.style);
		const assets = part.assets || {};
		if (assets.background || assets.texture) add(selectors, { "background-image": image(assets.background || assets.texture), "background-size": part.style?.["background-size"] || (["cards", "cardback", "lines"].includes(id) ? "100% 100%" : "cover"), "background-position": part.style?.["background-position"] || "center" });
		if (id === "players" && assets.frame) add(["#window .player > .framebg"], { "background-image": image(assets.frame), "background-size": "100% 100%", display: "block" });
		if (id === "cardback" && assets.alternate) add(["#window .card.infohidden:not(.infoflip)"], { "background-image": image(assets.alternate) });
		if (id === "cards") for (const [slot, path] of Object.entries(assets)) {
			if (!slot.startsWith("card:")) continue;
			const selector = `#window .card[data-card-name="${slot.slice(5)}"]:not(.infohidden):not(:empty)`;
			add([selector], { "background-image": image(path), "background-size": "100% 100%" });
			add([`${selector} > .image`, `${selector} > .background`], { "background-image": "none" });
		}
		if (id === "modes") for (const [slot, path] of Object.entries(assets)) {
			if (!slot.startsWith("mode:")) continue;
			const mode = slot.slice(5);
			add([`#splash [data-ui-mode="${mode}"] .lobby-art`], { content: image(path) });
			add([`#splash [link="${mode}"] > .avatar`], { "background-image": image(path) });
		}
		if (id === "hp") for (const key of ["high", "mid", "low", "lost"]) {
			if (assets[key]) add([key === "lost" ? "#window .hp:not(.text) > .lost" : `#window .hp:not(.text)[data-condition="${key}"] > div:not(.lost)`], { "background-image": image(assets[key]), "background-size": "100% 100%" });
		}
		if (id === "lines" && part.style?.color && !assets.texture) add(selectors, { background: `linear-gradient(transparent,${part.style.color},${part.style.color})` });
		if (id === "fonts" && assets.font) {
			const family = `ui-workshop-${manifest.id}`;
			rules.push(`@font-face{font-family:"${family}";src:${image(assets.font)};font-display:swap}`);
			add(selectors.flatMap(selector => [selector, `${selector} *`]), { "font-family": `"${family}",sans-serif` });
		}
	}
	// User-authored descendant styles must not override the core's information
	// masks. Keep the stock self/replay dimming and unknown-general placeholder.
	const privacyScope = ":is(#ui-workshop-private#ui-workshop-private#ui-workshop-private, :root) ";
	const protect = (selectors, values) => rules.push(`${selectors.map(selector => privacyScope + selector).join(",")}{${values}}`);
	protect([".card.infohidden > div"], "visibility:hidden!important");
	protect([".unseen > .avatar", ".unseen > .name:not(.name2)", ".unseen2 > .avatar2", ".unseen2 > .name2"], "opacity:0!important");
	protect([
		'#arena:not(.observe) .player[data-position="0"].unseen > .avatar',
		'#arena:not(.observe) .player[data-position="0"].unseen2 > .avatar2',
		'#arena:not(.observe) .player[data-position="0"].unseen > .name:not(.name2):not(.name_seat)',
		'#arena:not(.observe) .player[data-position="0"].unseen2 > .name2',
		'#arena:not(.observe) .unseen_v > .avatar', '#arena:not(.observe) .unseen2_v > .avatar2',
		'#arena:not(.observe) .unseen_v > .name:not(.name2):not(.name_seat)', '#arena:not(.observe) .unseen2_v > .name2',
	], "opacity:.2!important");
	const unknown = new URL("image/character/hidden_image.jpg", root.ownerDocument.baseURI).href;
	protect(['#arena:not(.observe) .player:not([data-position="0"]).unseen_show > .avatar', '#arena:not(.observe) .player:not([data-position="0"]).unseen2_show > .avatar2'], `opacity:1!important;background-image:url(${JSON.stringify(unknown)})!important`);
	style.textContent = rules.join("\n");
	root.appendChild(style);
	const htmlStyle = root.ownerDocument.documentElement.style;
	const previous = {};
	for (const key of ["color", "width", "opacity"]) {
		const value = manifest.components.lines?.style?.[key];
		if (!value) continue;
		const variable = `--ui-workshop-line-${key}`;
		previous[variable] = htmlStyle.getPropertyValue(variable);
		htmlStyle.setProperty(variable, value);
	}
	return () => {
		style.remove();
		for (const [key, value] of Object.entries(previous)) { if (value) htmlStyle.setProperty(key, value); else htmlStyle.removeProperty(key); }
	};
}

/** Canvas drag feedback shares the chosen colors without changing target selection. */
export function styleDragLine(ctx) {
	const style = document.documentElement.style;
	const color = style.getPropertyValue("--ui-workshop-line-color");
	const width = style.getPropertyValue("--ui-workshop-line-width");
	const opacity = style.getPropertyValue("--ui-workshop-line-opacity");
	if (color) ctx.strokeStyle = color;
	if (/^\d+(\.\d+)?px$/.test(width)) ctx.lineWidth = Math.max(1, Math.min(30, parseFloat(width)));
	if (opacity && Number.isFinite(parseFloat(opacity))) ctx.globalAlpha = Math.max(0, Math.min(1, parseFloat(opacity)));
}

/** Source 十周年UI/splash.js: solid gold drag arrows. Geometry is supplied by
 * the host's existing selection path; this renderer never selects a target. */
export function drawThemedDragLine(ctx, {start, pointer, selected, multitarget, full}) {
	if (![document.body.dataset.decadeParts,document.body.dataset.shoushaParts].some(parts=>parts?.split(' ').includes('lines'))) return false;
	ctx.save();
	ctx.setLineDash([]);ctx.lineWidth=3;ctx.shadowBlur=5;ctx.shadowColor='rgba(255,215,0,.3)';
	const segment=(from,to)=>{
		if (!from||!to||from[0]===to[0]&&from[1]===to[1]) return;
		const gradient=ctx.createLinearGradient(...from,...to);gradient.addColorStop(0,'transparent');gradient.addColorStop(1,'yellow');ctx.strokeStyle=gradient;
		const angle=Math.atan2(to[1]-from[1],to[0]-from[0]),length=8;
		ctx.beginPath();ctx.moveTo(...from);ctx.lineTo(...to);
		ctx.moveTo(to[0]-length*Math.cos(angle+Math.PI/6),to[1]-length*Math.sin(angle+Math.PI/6));ctx.lineTo(...to);
		ctx.lineTo(to[0]-length*Math.cos(angle-Math.PI/6),to[1]-length*Math.sin(angle-Math.PI/6));ctx.stroke();
	};
	let from=start;
	for (const point of selected) {segment(multitarget?from:start,point);if(point)from=point;}
	if (!full) segment(multitarget?from:start,pointer);
	ctx.restore();return true;
}
