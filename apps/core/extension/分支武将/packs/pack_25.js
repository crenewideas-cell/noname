// Extracted from character/wei.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
			wei_zhangliao: ['male', 'qun', 4, ['weiyuxi', 'weiporong']],
		},
"characterSort": {
			wei: {
				weizhentianxia: ['wei_zhangliao'],
				junweigaishi: [],
			},
		},
"characterIntro": {
			wei_zhangliao: '雁门关外秋风凉，文远横刀战意磅<br>铁骑如飞踏敌阵，长枪似电扫豺狼。<br>山河壮丽展雄姿，壮士慷慨胡虏丧。<br>北马南窥死声尽，当效卫霍美名扬。',
		},
"translate": {
			wei_zhangliao: '威张辽',
			weiyuxi: '驭袭',
			weiyuxi_info: '当你造成或受到伤害时，你可以摸一张牌（你使用这些牌无次数限制）。',
			weiporong: '破戎',
			weiporong_info: '连招技，（伤害牌+【杀】），你可以获得目标角色与其的相邻角色的各一张手牌并令此【杀】额外对其结算一次。',

			weizhentianxia: '威震天下',
			junweigaishi: '君威盖世',
		},
"skill": {
			weiyuxi: {
				audio: 2,
				trigger: {
					player: 'damageEnd',
					source: 'damageEnd'
				},
				content: function () {
					player.draw().gaintag = ['weiyuxi'];
				},
				mod: {
					cardUsable: function (card, player) {
						if (card.cards && card.cards[0].hasGaintag('weiyuxi')) return Infinity;
					},
				},
			},
			weiporong: {
				audio: 2,
				comboSkill: true,
				precastDelay: function (card) {
					return get.tag(card, 'damage');
				},
				postcastDelay: 'sha',
				trigger: { player: 'useCard' },
				filter: function (event, player) {
					return player.canUseComboSkill(this) && event.targets;
				},
				content: function () {
					'step 0'
					trigger.comboSkill = true;
					var list = [];
					for (var i of trigger.targets) {
						if (i.previous != player) list.add(i.previous);
						list.add(i);
						if (i.next != player) list.add(i.next);
					}
					player.gainMultiple(list);
					'step 1'
					trigger.effectCount++;
				}
			},
		}
};
}
