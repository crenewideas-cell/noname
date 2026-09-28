import { lib, game, ui, get } from "noname";
const ig = "ext:云中守望/assets/card/";
const card = {
	swe_congyuwan: {
		derivation: "swe_congyu",
		type: "equip",
		subtype: "equip1",
		cardcolor: "club",
		cardnumber: 7,
		equipDelay: false,
		image: true,
		fullskin: true,
		distance: {
			attackFrom: -0,
			attackRange: (card2, player) => {
				const card = player.getCards("e", c => c.name == "swe_congyuwan")[0];
				if (card) {
					const ren = card.storage.swe_renling;
					if (ren) return ren.maxHp || 1;
				}
				return 1;
			}
		},
		cardPrompt(card) {
			const ren = card?.storage?.swe_renling;
			const range = ren ? Math.max(1, ren.maxHp) : 1;
			return `当前攻击范围：<span class="thundertext">${range}</span>。<br>${lib.translate.swe_congyuwan_info}`;
		},
		skills: ["swe_congyuwan"],
		ai: {
			equipValue: 7,
			basic: {
				equipValue: 7
			}
		}
	},
	swjw_zhili: {
		derivation: "swjw_lugushou",
		type: "equip",
		subtype: "equip1",
		cardcolor: "spade",
		cardnumber: 5,
		equipDelay: false,
		image: true,
		fullskin: true,
		distance: { attackFrom: -2 },
		skills: ["swjw_zhili_skill"],
		ai: { equipValue: 8, basic: { equipValue: 8 } },
	},
	swjw_pujian: {
		derivation: "swjw_tianshangke",
		type: "equip",
		subtype: "equip1",
		cardcolor: "spade",
		cardnumber: 1,
		global: ["swjw_pujian_yi", "swjw_pujian_er"],
		equipDelay: false,
		image: true,
		fullskin: true,
		distance: { attackFrom: -0 },
		filterTarget(card2, player, target) {
			if (player != target) return false;
			if (target.canEquip(card2, true)) return true;
			return card2.name == "swjw_pujian" && target.hasDisabledSlot(1);
		},
		async onEquip(event, trigger, player) {
			const { card } = event;
			if (card && card.storages?.length) {
				player.directgains(card.storages, null, "swjw_pujian_sha");
			}
		},
		async onLose(event, trigger, player) {
			const { card } = event;
			if (!card || !card.storages || !card.storages.length) return;
			if ((!event.getParent(3) || event.getParent(3).name !== "swapEquip") && (event.getParent().type !== "equip" || event.getParent().swapEquip)) {
				player.lose(card.storages, ui.discardPile);
				player.$throw(card.storages, 1e3);
				game.log(card, "掉落了", card.storages);
				card.storages.length = 0;
			} else {
				player.lose(card.storages, ui.special);
			}
		},
		clearLose: true,
		skills: ["swjw_pujian_skill", "swjw_pujian_clear"],
		ai: { equipValue: 6, basic: { equipValue: 6 } },
	},
};

const translate = {
	swe_congyuwan: "丛雨丸",
	swe_congyuwan_info: "①此武器攻击范围等同于刃灵的体力上限，默认为1。<br>②你不是其他武器牌的合法目标且该武器无法被替换。<br>③你不能将装备区内的此武器当作其他牌使用或打出。<br>④当你使用【杀】时，刃灵为你选择一项：<br>1.锈刀：令此【杀】无效且从牌堆或弃牌堆中获得一张普通锦囊牌。<br>2.除祟：令目标弃置所有非基本牌。<br>3.附神：令目标不可响应且此【杀】伤害+1。<br>4.共进：令攻击范围内的所有角色均成为此【杀】的目标。",
	swjw_zhili: "支离",
	swjw_zhili_info: "锁定技，你使用的伤害值大于1的【杀】不可被响应。",
	swjw_pujian: "朴剑",
	swjw_pujian_info: "此武器不受武器栏废除影响且使用时恢复武器栏。当你获得【杀】时，你可以将这些【杀】置于此武器上；你可以如手牌般使用或打出此武器上的牌。当此武器离开你的装备区时，若你为云中天上氏角色，废除你的武器栏。",
	swjw_pujian_sha: "朴剑",
};

const list = Object.keys(card);
for(let name of list) {
	const cd = card[name];
	if(cd.image === true) {
		cd.image = ig + name + ".png";
	}
	else if(typeof cd.image === "string") {
		cd.image = ig + cd.image;
	}
}

export default {
	card,
	translate
};
