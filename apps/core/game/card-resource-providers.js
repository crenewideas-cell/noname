/** Resource declarations only; dependency resolution is shared by all factions. */
export default [
	{
		name: "shared_immortal_cards",
		label: "仙势力配套牌",
		groups: ["qingyao_xian"],
		connect: false,
		load: () => import("../extension/collections/清瑶葭绮/members/假装无敌/cards.js"),
	},
];
