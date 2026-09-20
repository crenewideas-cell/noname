/** Data-only UI packages. No game rules, extension switches or executable code. */
export const FORMAT = "noname-ui-workshop";
export const VERSION = 1;
export const MAX_BYTES = 128 * 1024 * 1024;
export const MAX_ASSETS = 512;
export const PARTS = {
	home: { name: "主界面 / 启动入口", settings: ["ui_workshop_home_style"], slots: ["background"] },
	modes: { name: "模式选择", settings: ["splash_style"], slots: [], map: "mode" },
	lobby: { name: "联机大厅 / 房间", settings: [], slots: ["background"] },
	arena: { name: "对局背景 / 布局", settings: ["theme", "layout", "image_background", "image_background_blur", "image_background_random", "phonelayout"], slots: ["background"] },
	cards: { name: "卡牌正面", settings: ["card_style", "hide_card_image"], slots: ["texture"], map: "card" },
	cardback: { name: "卡牌背面", settings: ["cardback_style"], slots: ["texture", "alternate"] },
	buttons: { name: "按钮 / 操作控件", settings: ["control_style"], slots: ["texture"] },
	menus: { name: "菜单 / 弹窗", settings: ["menu_style", "radius_size"], slots: ["texture"] },
	players: { name: "武将框 / 选将外观", settings: ["player_style", "border_style", "player_border", "presentation_style"], slots: ["texture", "frame"] },
	hp: { name: "体力图标", settings: ["hp_style"], slots: ["high", "mid", "low", "lost"] },
	lines: { name: "攻击 / 拖拽指示线", settings: ["zhishixian"], slots: ["texture"] },
	fonts: { name: "界面字体", settings: ["global_font", "name_font", "identity_font", "cardtext_font"], slots: ["font"] },
};
export const SETTING_KEYS = Object.values(PARTS).flatMap(part => part.settings);
export const BOOL_KEYS = ["image_background_blur", "image_background_random", "phonelayout", "hide_card_image"];
export const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", avif: "image/avif", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf" };
export const PROPERTIES = ["color", "background-color", "background-image", "border-color", "border-radius", "border-width", "border-style", "box-shadow", "text-shadow", "font-size", "font-weight", "letter-spacing", "line-height", "text-align", "padding", "margin", "gap", "row-gap", "column-gap", "display", "position", "inset", "top", "right", "bottom", "left", "overflow", "overflow-x", "overflow-y", "grid-template-columns", "grid-template-rows", "grid-auto-flow", "grid-column", "grid-row", "flex-direction", "flex-wrap", "flex", "order", "justify-content", "align-items", "align-self", "background-size", "background-position", "background-repeat", "width", "max-width", "min-width", "height", "min-height", "max-height", "opacity", "transform", "transform-origin", "transition"];
export const clone = value => JSON.parse(JSON.stringify(value));
export const newId = () => `ui-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
const record = value => value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const text = (value, length) => typeof value === "string" && value.length <= length && !/[\u0000-\u001f]/.test(value);
export function assetPath(path) {
	return typeof path === "string" && /^assets\/[a-zA-Z0-9_-]+\.(png|jpe?g|webp|gif|avif|woff2?|ttf|otf)$/.test(path);
}
export function validateManifest(input) {
	assert(record(input) && input.format === FORMAT && input.version === VERSION, "不是支持的 UI 套装清单（需要 noname-ui-workshop v1）");
	assert(JSON.stringify(input).length <= 1024 * 1024, "套装清单不能超过 1 MB");
	assert(Object.keys(input).every(key => ["format", "version", "id", "name", "author", "description", "components"].includes(key)), "套装含有不支持的清单字段");
	assert(text(input.id, 100) && /^[a-zA-Z0-9_-]+$/.test(input.id), "套装 ID 无效");
	assert(text(input.name, 80) && input.name.trim(), "请填写套装名称（最多 80 字）");
	assert(text(input.author || "", 100) && text(input.description || "", 1000), "作者或说明过长");
	assert(record(input.components), "套装缺少部件清单");
	assert(Object.keys(input.components).length <= Object.keys(PARTS).length, "部件数量无效");
	for (const [id, part] of Object.entries(input.components)) {
		assert(Object.hasOwn(PARTS, id) && record(part), `不支持的 UI 部件：${id}`);
		assert(Object.keys(part).every(key => ["name", "settings", "assets", "style", "rules"].includes(key)), `部件 ${id} 含有不支持的字段`);
		assert(text(part.name || "", 100), "部件名称无效");
		assert(record(part.settings || {}) && record(part.assets || {}) && record(part.style || {}), `部件 ${id} 格式无效`);
		for (const [key, value] of Object.entries(part.settings || {})) {
			assert(PARTS[id].settings.includes(key), `UI 套装不能修改配置：${key}`);
			assert(BOOL_KEYS.includes(key) ? typeof value === "boolean" : typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value), `配置 ${key} 无效`);
		}
		for (const [slot, path] of Object.entries(part.assets || {})) {
			assert(PARTS[id].slots.includes(slot) || (PARTS[id].map && new RegExp(`^${PARTS[id].map}:[a-zA-Z0-9_-]{1,100}$`).test(slot)), `不支持的素材位置：${id}/${slot}`);
			assert(assetPath(path), `素材路径无效：${path}`);
			const isFont = /\.(woff2?|ttf|otf)$/.test(path);
			assert((slot === "font") === isFont, `素材类型与位置不匹配：${slot}`);
		}
		validateStyle(part.style || {});
		assert(Array.isArray(part.rules || []) && (part.rules || []).length <= 100, "自定义样式规则过多");
		for (const rule of part.rules || []) {
			assert(record(rule) && text(rule.selector, 240) && /^[a-zA-Z0-9_.#\-\s>+~:[\]="'()*^$|]+$/.test(rule.selector), "自定义样式选择器无效（不支持逗号、转义和规则块）");
			assert(record(rule.style), "自定义样式内容无效");
			assert(Object.keys(rule).every(key => ["selector", "style"].includes(key)), "样式规则含有不支持的字段");
			validateStyle(rule.style);
		}
	}
	return clone(input);
}
function validateStyle(style) {
	for (const [key, value] of Object.entries(style)) {
		assert(PROPERTIES.includes(key), `不支持的外观属性：${key}`);
		assert(typeof value === "string" && value.length <= 240 && !/[;{}@\\<>\u0000-\u001f]/.test(value) && !/url\s*\(|expression\s*\(|javascript|!important/i.test(value), `外观属性值无效：${key}`);
		if (globalThis.CSS?.supports) assert(CSS.supports(key, value), `浏览器不支持外观属性值：${key} = ${value}`);
	}
}
export function referencedAssets(manifest) {
	return [...new Set(Object.values(manifest.components).flatMap(part => Object.values(part.assets || {})))];
}
export function validateRecord(input) {
	const manifest = validateManifest(input.manifest);
	assert(record(input.assets), "套装缺少素材数据");
	const assets = {};
	let bytes = 0;
	const paths = referencedAssets(manifest);
	assert(paths.length <= MAX_ASSETS, `每套最多 ${MAX_ASSETS} 个素材`);
	for (const path of paths) {
		const blob = input.assets[path];
		assert(blob instanceof Blob && blob.size > 0, `素材缺失或为空：${path}`);
		bytes += blob.size;
		assert(bytes <= MAX_BYTES, "素材总大小不能超过 128 MB");
		assets[path] = blob;
	}
	return { manifest, assets };
}
export function emptyPack(name = "我的 UI 搭配") {
	return { manifest: { format: FORMAT, version: VERSION, id: newId(), name, author: "", description: "", components: Object.fromEntries(Object.keys(PARTS).map(id => [id, { name: PARTS[id].name, settings: {}, assets: {}, style: {} }])) }, assets: {} };
}
/** Copy the bytes as well as the component, so deleting its source never breaks a mix. */
export function mixPart(target, source, id) {
	assert(Object.hasOwn(PARTS, id) && source.manifest.components[id], "此套装没有该部件");
	const part = clone(source.manifest.components[id]);
	for (const [slot, path] of Object.entries(part.assets || {})) {
		const name = `assets/${newId()}.${path.split(".").pop()}`;
		target.assets[name] = source.assets[path];
		part.assets[slot] = name;
	}
	target.manifest.components[id] = part;
	return target;
}
