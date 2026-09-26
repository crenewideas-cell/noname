import { emptyPack } from './schema.js';

/** Restore the engine's own desktop UI, using its existing layouts and assets.
 * An empty pack only inherits the last preferences (including phone layout);
 * it cannot restore the native toolbar and hand area after a different layout.
 * Defaults come from game/config.json and library/index.js; no renderer or CSS.
 */
export function nativePack() {
	const pack = emptyPack('本体内置 UI');
	Object.assign(pack.manifest, {
		id: 'builtin-native', author: '无名杀本体',
		description: '恢复本体现有的顶部工具栏、武将布局和底部手牌区，使用本体原有样式与素材。',
	});
	const settings = {
		arena: { theme: 'simple', layout: 'long2', phonelayout: false, image_background: 'default', image_background_random: false, image_background_blur: false, show_cardpile_number: true, cardshape: 'oblong' },
		cards: { card_style: 'default', hide_card_image: false },
		cardback: { cardback_style: 'liusha' },
		players: { player_style: 'default', border_style: 'auto', player_border: 'slim', player_height: 'default' },
		hp: { hp_style: 'glass' },
		buttons: { control_style: 'default', show_pause: true, show_auto: true, show_volumn: true, show_cardpile: true, show_commonCardpile: true, show_sortcard: true },
		menus: { menu_style: 'music', radius_size: 'reduce' },
		lines: { zhishixian: 'default' },
	};
	for (const [id, value] of Object.entries(settings)) pack.manifest.components[id].settings = value;
	return pack;
}
