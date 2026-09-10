// Extracted from character/clan.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
			clan_wanghun: ['male', 'jin', 3, ['fuxun', 'chenya', 'clanzhongliu'], ['clan:太原王氏']],
			clan_zhongyu: ['male', 'wei', 3, ['jiejian', 'huanghan', 'clanbaozu'], ['clan:颍川钟氏']],
		},
"characterSort": {
			clan: {
				clan_wu: [],
				clan_xun: [],
				clan_han: [],
				clan_wang: [ 'clan_wanghun'],
				clan_zhong: [ 'clan_zhongyu'],
			},
		},
"characterIntro": {
			clan_wukuang: '门阀士族系列陈留吴氏的第一代，兖州陈留人，何进部将。何进谋诛宦官失败被杀后，吴匡联合曹操、袁绍等杀尽宦官，攻杀何苗。后反对曹操挟天子以令诸侯的专权。',
			clan_wanghun: '太原晋阳王氏第二代，王昶之子，西晋司徒，京陵元公，“魏晋八君子”之一。妻子为钟繇曾孙女钟琰。配合镇南将军杜预灭亡吴国，期间与王漕有矛盾。楚王司马玮发动政变时有意寻求支持，遭到严词拒绝。',
			clan_zhongyan: '门阀士族系列颍川钟氏的第五代，钟繇曾孙，王浑之妻。聪慧弘雅，博览记籍。美容止，善啸咏，礼仪法度为中表所则。有观人形骨之能，有文集五卷。',
			clan_zhongyu: '门阀士族系列颍川钟氏的第四代，钟繇之子，钟会之兄，魏国大臣。多次劝谏曹、曹爽，后参与平定诸葛诞叛乱。曾先见钟会野心并告知司马昭，保全宗族免遭株连。',
			xunshu: '荀淑（83年～149年），字季和，为郎陵侯相，颍川颍阴人（今河南省许昌市）人。汉和帝至汉桓帝时人物，以品行高洁著称。有子八人，号八龙。年轻时有高尚的德行，学问渊博，不喜欢雕章琢句，徒在文字上用功，不注重实际的学识。因此，常常被俗儒看不起。但州里却称他有知人之明。安帝时，征召任为郎中，后来再升当涂长。离职还乡里。他的孙子荀彧是曹操部下著名的谋士。',
			xuncai: '荀采（生卒年不详），字女荀，颍川人，东汉名士荀爽之女。荀采聪慧敏捷而有才艺。十七岁时，荀采嫁给阴瑜。两年后阴瑜去世。荀采不愿意改嫁，但荀爽答应把荀采嫁给同郡人郭奕。荀采趁着旁人没有防备，用粉在门上写下：“尸还阴”，而后自缢而死。',
			xuncan: '荀粲（210年—238年），字奉倩，颍川郡颍阴县（今河南省许昌市）人。三国时期曹魏大臣、玄学家，太尉荀彧幼子。个性简贵，不轻易交接常人，所交之辈皆一时俊杰。聪颖过人，善谈玄理，名噪一时。娶大将军曹洪之女为妻，生活美满。景初二年，面对妻子去世，悲痛过度而死，时年二十九，成语“荀令伤神”与之有关。',
			hanshao: '韩韶（生卒年不详），字仲黄，颍川舞阳（今河南省漯河市）人，东汉桓帝时出仕。任郡吏，有政绩，继而被征入司徒府。他公正廉明，尽心民事，视民苦如在己身，政绩卓著。汉永寿二年（公元156年），泰山贼公孙举率流寇数千骚扰嬴县，守令因不能拒敌安民，多受制裁，朝廷命尚书府从三府（司徒、司马、司空）属员中，选择能治理民事，又能拒寇入侵的官员，前往镇守。韩韶被封为“嬴长”到嬴县上任，他是莱芜历史上唯一的一位“嬴长”。',
			hanrong: '韩融（127年～196年），字元长，颍川舞阳（今属河南省漯河市）人。赢长韩韶子，献帝时大臣。中平五年（188年），融与荀爽、陈纪等十四人并博士征，不至。董卓废立，融等复俱公车征。初平元年（190年）六月，融为大鸿胪，奉命与执金吾胡母班等出使关东。献帝东迁，为李傕、郭汜等所败，融为太仆，奉命至弘农与傕、汜连和，使其放遣公卿百官及宫女妇人。',
			wukuang: '吴匡（生卒年不详），兖州陈留（今河南开封市）人。东汉末年大臣，大将军何进部将。光熹元年（公元189年），汉灵帝死后，十常侍干预朝政，大将军何进谋诛宦官，但失败被杀，吴匡联合曹操、袁绍等杀尽宦官，攻杀车骑将军何苗。兴平二年（公元195年）十月，李傕、郭汜后悔放汉献帝东归洛阳，于是联合起来追击，曹操遂起兵平乱，但在回朝后，曹操挟天子以令诸侯，实行专权，但遭到吴匡反对。',
		},
"characterReplace": {
			wuban: ['dc_wuban', 'clan_wuban', 'wuban'],
		},
"dynamicTranslate": {
			clanlianzhu: function (player) {
				if (player.storage.clanlianzhu) return '转换技，每名角色Ａ的出牌阶段限一次。阴：Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1；<span class="bluetext">阳：Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1</span>。';
				return '转换技，每名角色Ａ的出牌阶段限一次。<span class="bluetext">阴：Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1</span>；阳：Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1。';
			},
			clanguangu: function (player) {
				if (player.storage.clanguangu) return '转换技，出牌阶段限一次。阴：你可以观看牌堆顶的至多四张牌；<span class="bluetext">阳：你可以观看一名角色的至多四张手牌。</span>然后你可以使用其中的一张牌。';
				return '转换技，出牌阶段限一次。<span class="bluetext">阴：你可以观看牌堆顶的至多四张牌；</span>阳：你可以观看一名角色的至多四张手牌。然后你可以使用其中的一张牌。';
			},
		},
"translate": {
			clan_wanghun: '族王浑',
			fuxun: '抚循',
			fuxun_info: '出牌阶段限一次。你可以获得或交给一名其他角色一张手牌，然后若其手牌数与你相等且于此阶段仅以此法获得或失去过牌，你可以将一张牌当任意基本牌使用。',
			chenya: '沉雅',
			chenya_info: '当一名角色发动“出牌阶段限一次”的技能后，你可以令其重铸任意张牌名字数为X的牌（X为其手牌数）。',
			clan_zhonghui: '族钟会',
			clanyuzhi: '迂志',
			clanyuzhi_info: '锁定技，①每轮游戏开始时，你展示一张手牌并摸X张牌（X为此牌牌名字数）；②每轮游戏结束时，若你本轮使用牌的数量或上一轮因此技能摸的牌数小于X，你选择一项：1.失去1点体力；2.失去技能〖保族〗。',
			clanxieshu: '挟术',
			clanxieshu_info: '当你使用牌造成伤害后，或受到牌造成的伤害后，你可以弃置X张牌（X为此牌牌名字数）并摸等同于你已损失体力值数量张牌。',
			clan_zhongyu: '族钟毓',
			jiejian: '捷谏',
			jiejian_info: '当你每回合使用第x张牌指定目标后，你可以令其中一个目标摸x张牌。（为此牌牌名字数）',
			huanghan: '惶汗',
			huanghan_info: '当你受到牌的伤害后,你可以摸x张牌（为此牌牌名字数）并弃置你已损失体力值张牌，若不为本回合首次发动，你视为未发动宗族技，',
			clan_wuxian: '族吴苋',
			clanyirong: '移荣',
			clanyirong_info: '出牌阶段限两次。若你的手牌数：小于X，则你可以将手牌摸至X张（至多摸八张），然后X-1；大于X，则你可以将手牌弃置至X张，然后X+1。（X为你的手牌上限）',
			clanguixiang: '贵相',
			clanguixiang_info: '锁定技，你的非出牌阶段开始前，若此阶段即将成为你本回合内的第X个阶段（X为你的手牌上限），则你终止此阶段，改为进行一个出牌阶段。',
			clanmuyin: '穆荫',
			clanmuyin_info: '宗族技，准备阶段，你可以选择一名手牌上限不为全场最多的陈留吴氏角色。该角色的手牌上限+1。',
			chenliuwushi: '陈留·吴氏',
			clan_wuban: '族吴班',
			clanzhanding: '斩钉',
			clanzhanding_info: '你可以将任意张牌当做【杀】使用。你以此法使用的【杀】结算结束后，你令你的手牌上限-1，然后若你因此【杀】造成过伤害，则你将手牌摸至手牌上限（至多摸五张），否则你令此【杀】不计入次数限制。',
			clan_xunshu: '族荀淑',
			clanshenjun: '神君',
			clanshenjun_info: '当一名角色使用【杀】或普通锦囊牌时，若你手牌中有该牌名的牌，你展示之，且这些牌称为“神君”。然后本阶段结束时，你可以将等同于你“神君”数张牌当做一张“神君”牌使用。',
			clanbalong: '八龙',
			clanbalong_info: '锁定技，当你于一回合内首次{回复体力后或受到伤害后或失去体力后}，若你手牌中唯一最多的类别为锦囊牌，你展示所有手牌并摸至角色数张。',
			clandaojie: '蹈节',
			clandaojie_info: '宗族技，锁定技，当你每回合第一次使用非伤害类普通锦囊牌后，你须失去一个锁定技或失去1点体力，令一名颍川荀氏角色获得此牌对应的所有实体牌。',
			clan_xuncai: '族荀采',
			clanlieshi: '烈誓',
			clanlieshi_info: '出牌阶段，你可以选择一项：1.废除判定区并受到你造成的1点火焰伤害；2.弃置所有【闪】；3.弃置所有【杀】。然后令一名其他角色从你未选择的选项中选择一项。',
			clandianzhan: '点盏',
			clandianzhan_info: '锁定技，当你每轮第一次使用一种花色的牌后：若此牌的目标数为1，你横置此牌目标；若你有此花色的手牌，你重铸这些牌。然后你摸一张牌。',
			clanhuanyin: '还阴',
			clanhuanyin_info: '锁定技，当你进入濒死状态时，将手牌补至四张。',
			clan_xunchen: '族荀谌',
			clansankuang: '三恇',
			clansankuang_info: '锁定技，当你每轮第一次使用一种类别的牌后，你令一名其他角色交给你至少X张牌，然后于装备区或处理区内获得你使用的牌对应的所有实体牌（X为以下条件中其满足的项数：场上有牌、已受伤、体力值小于手牌数）。',
			clanbeishi: '卑势',
			clanbeishi_info: '锁定技，当一名角色失去最后的手牌后，若其是你首次发动〖三恇〗的目标角色，你回复1点体力。',
			clan_xuncan: '族荀粲',
			clanyunshen: '熨身',
			clanyunshen_info: '出牌阶段限一次。你可以令一名其他角色回复1点体力，然后选择一项：1.你视为对其使用一张冰【杀】；2.其视为对你使用一张冰【杀】。',
			clanshangshen: '伤神',
			clanshangshen_info: '当一名角色受到属性伤害后，若本回合此前没有角色或已死亡的角色受到过属性伤害，你可以进行目标角色为你的【闪电】的特殊的使用流程，然后其将手牌摸至四张。',
			clanfenchai: '分钗',
			clanfenchai_info: '锁定技，若你首次发动技能指定的异性目标角色中：存在存活角色，你的判定牌视为♥；不存在存活角色，你的判定牌视为♠。',
			clan_hanshao: '族韩韶',
			clanfangzhen: '放赈',
			clanfangzhen_info: '出牌阶段开始时，你可以横置一名角色并选择一项：1.摸两张牌，然后交给其两张牌；2.令其回复1点体力。然后第X轮游戏开始时，你失去〖放赈〗（X为其座位号）。',
			clanliuju: '留驹',
			clanliuju_info: '出牌阶段结束时，你可以与一名角色A拼点，输的角色可以使用任意张拼点牌中的非基本牌。然后若你至A的距离或A至你的距离发生了变化，你重置〖恤民〗。',
			clanxumin: '恤民',
			clanxumin_info: '宗族技，限定技，你可以将一张牌当做【五谷丰登】对任意名其他角色使用。',
			clan_hanrong: '族韩融',
			clanlianhe: '连和',
			clanlianhe_info: '出牌阶段开始时，你可以横置两名角色。这些角色于自己的下个出牌阶段结束时，若其此阶段未摸牌，其令你摸X+1张牌或交给你X-1张牌（X为其此阶段获得的牌数且至多为3）。',
			clanhuanjia: '缓颊',
			clanhuanjia_info: '出牌阶段结束时，你可以与一名角色拼点。赢的角色可以使用一张拼点牌。然后若此牌：未造成过伤害，你获得另一张拼点牌；造成过伤害，你失去一个技能。',
			clan_wukuang: '族吴匡',
			clanlianzhu: '联诛',
			clanlianzhu_info: '转换技，每名角色Ａ的出牌阶段限一次。阴：Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1；阳：Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1。',
			clan_wangling: '族王凌',
			clanbolong: '驳龙',
			clanbolong_info: '出牌阶段限一次。你可以令一名其他角色选择一项：1.你交给其一张牌，然后视为对其使用一张雷【杀】；2.交给你等同于你手牌数的牌，然后视为对你使用一张【酒】。',
			clanzhongliu: '中流',
			clanzhongliu_info: '宗族技，锁定技，当你使用牌时，若此牌对应的实体牌不全为同族角色的手牌，你重置武将牌上的技能。',
			clan_zhongyan: '族钟琰',
			clanguangu: '观骨',
			clanguangu_info: '转换技，出牌阶段限一次。阴：你可以观看牌堆顶的至多四张牌；阳：你可以观看一名角色的至多四张手牌。然后你可以使用其中的一张牌。',
			clanxiaoyong: '啸咏',
			clanxiaoyong_info: '锁定技，当你于回合内首次使用字数为X的牌时，你重置〖观骨〗（X为你上次发动〖观骨〗观看的牌数）。',
			clanbaozu: '保族',
			clanbaozu_info: '宗族技，限定技，当一名同族角色进入濒死状态时，你可以令其横置并回复1点体力。',
			clan_wangyun: '族王允',
			clanjiexuan: '解悬',
			clanjiexuan_info: '限定技，转换技，阴：你可以将一张红色牌当【顺手牵羊】使用；阳：你可以将一张黑色牌当【过河拆桥】使用。',
			clanmingjie: '铭戒',
			clanmingjie_info: '限定技，出牌阶段，你可以选择一名角色，然后直到其下回合结束时，当你使用牌时你可以指定其为额外目标。然后其下回合结束时，你可以使用本回合使用过的黑桃牌和被抵消过的牌。',
			clan_wanglun: '族王沦',
			clanqiuxin: '求心',
			clanqiuxin_info: '出牌阶段限一次，你可以令一名其他角色声明一项：1.你对其使用一张【杀】：2.你对其使用任意普通锦囊牌。你下次执行此项后视为执行另一项。',
			clanjianyuan: '簡遠',
			clanjianyuan_info: '当一名角色发动“出牌阶段限一次”的技能后，你可以令其重铸任意张牌名字数为X的牌（X为其本阶段使用牌数）。',
			clan_xunyou: '族荀攸',
			clanbaichu: '百出',
			clanbaichu_info: '锁定技，当你使用牌后，若此牌：花色和类型组合为你首次使用，你记录一张普通锦囊牌，否则于本轮获得【奇策】；以此法记录过，你摸一张牌或回复1点体力。',
			clan_wuqiao: '族吴乔',
			clanqiajue: '跒倔',
			clanqiajue_info: '摸牌阶段开始时，你可以弃置一张黑色牌并于本阶段结束时展示手牌，若点数和大于30，你的手牌上限-２，否则你执行一个额外的摸牌阶段。',
			clan_wangguang: '族王广',
			clanlilun: '离论',
			clanlilun_info: '出牌阶段限一次，你可以重铸两张同名手牌（不能是你本回合以此法重铸过的牌名的牌），然后使用其中的一张牌。',
			clanjianji: '见机',
			clanjianji_info: '限定技，一名角色的结束阶段，若其上下家均未于本回合：使用过牌，则你可以与其各摸一张牌；成为过牌的目标，则你可以视为使用一张【杀】。',
			clan_zhongyao: '族钟繇',
			clanchengqi: '承启',
			clanchengqi_info: '你可以将至少两张手牌当任意一张牌名字数不大于X的基本牌或普通锦囊牌使用（你本回合使用过的基本牌或普通锦囊牌除外；X为这些牌转化前的牌名字数之和），然后当你使用此牌时，若此牌的牌名字数等于X，你令一名角色摸一张牌。',
			clanjieli: '诫厉',
			clanjieli_info: '结束阶段，你可以观看一名角色的牌名字数最大的手牌，然后你可以用其中任意张牌交换牌堆顶的Y张牌中的等量张（Y为你本回合使用过的牌中牌名字数的最大值）。',
			clan_wangchang: '族王昶',
			clankaiji: "开济",
			clankaiji_info: "出牌阶段限一次，你可以令一名本轮未以此法指定过的角色弃置你一张手牌，然后你可以使用弃置的牌，若如此做，你摸一张牌。",
			clan_wangshen: '族王沈',
			clananran: '岸然',
			clananran_info: '出牌阶段开始时，或当你受到伤害时，你可以选择一项：1.摸X张牌（X为发动此技能的次数且至多为4）；2.令至多X名角色各摸一张牌。若如此做，获得了“岸然”牌的角色于本回合使用的下一张牌不能为“岸然”牌。',
			clangaobian: '告变',
			clangaobian_info: '锁定技，其他角色的回合结束时，若本回合仅有一名角色受到过伤害，你令受伤角色选择一项：1.使用本回合进入弃牌堆的一张【杀】；2.失去一点体力。',

			clan_wu: '陈留·吴氏',
			clan_xun: '颍川·荀氏',
			clan_han: '颍川·韩氏',
			clan_wang: '太原·王氏',
			clan_zhong: '颍川·钟氏',
		},
"skill": {
			clananran: {
				audio: 2,
				trigger: {
					player: ['phaseUseBegin', 'damageBegin']
				},
				content: function () {
					'step 0'
					var count = Math.min(4, player.countMark('clananran_used') + 1),
						list = [['draw', `摸${get.cnNumber(count)}张牌`], ['asyncDraw', `令至多${get.cnNumber(count)}名角色摸一张牌`]];
					player.chooseButton([get.prompt2('clananran'), [list, 'textbutton']]).set('ai', () => {
						var player = _status.event.player;
						if (count < 2 && game.hasPlayer(target => target != player && get.attitude(player, target) > 0)) return 'asyncDraw';
						else return 'draw';
					});
					'step 1'
					if (result.bool) {
						player.addSkill('clananran_used');
						player.addMark('clananran_used', 1, false);
						var count = Math.min(4, player.countMark('clananran_used'));
						if (result.links[0] == 'draw') {
							player.draw(count).set('gaintag', ['clananran_tag']);
							player.addTempSkill('clananran_tag', { player: 'useCardAfter' });
						} else {
							player.chooseTarget(`令至多${get.cnNumber(count)}名角色摸一张牌`, [1, count], true).set('ai', target => get.attitude(_status.event.player, target) > 0);
						}
					} else event.finish();
					'step 2'
					if (result.bool) {
						for (var target of result.targets) {
							target.draw().set('gaintag', ['clananran_tag']);
							target.addTempSkill('clananran_tag', { player: 'useCardAfter' });
						}
					}
				},
				subSkill: {
					used: {
						charlotte: true,
						onremove: true,
						intro: {
							content: '当前发动过#次【岸然】'
						},
					},
					tag: {
						charlotte: true,
						onremove: function (player) {
							player.removeGaintag('clananran_tag');
						},
						mod: {
							cardEnabled: function (card, player) {
								if (card.cards && card.cards[0] && card.cards[0].gaintag && card.cards[0].gaintag.contains('clananran_tag')) return false;
							},
							cardSavable: function (card, player) {
								if (card.cards && card.cards[0] && card.cards[0].gaintag && card.cards[0].gaintag.contains('clananran_tag')) return false;
							},
						},
					},
				},
			},
			clangaobian: {
				audio: 2,
				trigger: {
					global: 'phaseAfter'
				},
				forced: true,
				filter: function (event, player) {
					if (event.player == player) return false;
					return game.countPlayer(target => target.getHistory('damage').length) == 1;
				},
				content: function () {
					'step 0'
					event.target = game.findPlayer(target => target.getHistory('damage').length);
					event.cardsx = get.discarded().filter(c => c.name == 'sha');
					var list = [['sha', '使用本回合进入弃牌堆的一张【杀】'], ['lose', '失去一点体力']];
					event.target.chooseButton(['请选择一项', [list, 'textbutton']], true).set('filterButton', button => {
						if (button.link == 'sha') return event.cardsx.some(card => event.target.hasUseTarget(card));
						return true;
					}).set('target', event.target).set('ai', button => {
						if (_status.event.target == player) return 'lose';
						return 'sha';
					});
					'step 1'
					if (result.links[0] == 'sha') {
						event.target.chooseButton(['请使用本回合进入弃牌堆的一张【杀】', event.cardsx], true).set('filterButton', button => {
							return event.target.hasUseTarget(button);
						}).set('target', event.target).set('ai', () => 1);
					} else {
						event.target.loseHp();
						event.finish();
					}
					'step 2'
					event.target.chooseUseTarget(result.links[0], true);
				},
			},
			clankaiji: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				filterTarget: function (card, player, target) {
					return !target.hasSkill('clankaiji_air');
				},
				content: function () {
					"step 0"
					event.list = [];
					target.addTempSkill("clankaiji_air", 'roundStart');
					target.discardPlayerCard(player, 'h', true);
					"step 1"
					event.list.add(result.links[0]);
					player.chooseButton(['选择要使用的牌', event.list]).set('filterButton', button => {
						return _status.event.player.hasUseTarget(button.link);
					}).set('ai', function (button) {
						return _status.event.player.getUseValue(button.link);
					});
					"step 2"
					if (result.bool) {
						player.$gain2(result.links[0], false);
						game.delayx();
						player.chooseUseTarget(true, result.links[0], false);
						player.draw();
					} else event.finish();
				},
				subSkill: {
					air: {
						charlotte: true,
					},
				},
				ai: {
					expose: 0.3,
					threaten: 1.2,
				},
			},
			clanchengqi: {
				audio: 2,
				enable: "chooseToUse",
				filter: function (event, player) {
					return player.countCards('h') > 1;
				},
				getUsedCard: function (player) {
					var list = [];
					player.getHistory('useCard', e => {
						list.add(get.name(e.card));
					});
					return list;
				},
				hiddenCard: function (player, name) {
					return (!lib.skill.clanchengqi.getUsedCard(player).contains(name) && player.countCards('h') > 1 && lib.inpile.contains(name));
				},
				additionalSelect: function () {
					'step 0'
					player.chooseTarget('选择一名角色令其摸一张牌', 1, false).set('ai', function (target) {
						return get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						result.targets[0].draw();
					}
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [], num = 0;
						for (var j of player.getCards('h')) {
							num += get.number(j);
						}
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (lib.skill.clanchengqi.getUsedCard(player).contains(name) || num < get.translation(name).length) continue;
							if (name == 'sha') {
								list.push(['基本', '', 'sha']);
								for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
							}
							else if (get.type(name) == 'trick') list.push(['锦囊', '', name]);
							else if (get.type(name) == 'basic') list.push(['基本', '', name]);
						}
						if (list.length == 0) {
							return ui.create.dialog('承启已无可用牌');
						}
						return ui.create.dialog('承启', [list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
					},
					check: function (button) {
						var player = _status.event.player;
						if (player.countCards('hs', button.link[2]) > 0) return 0;
						if (button.link[2] == 'wugu') return 0;
						var effect = player.getUseValue(button.link[2]);
						if (effect > 0) return effect;
						return 0;
					},
					backup: function (links, player) {
						return {
							audio: 'clanchengqi',
							complexCard: true,
							filterCard: () => true,
							selectCard: function () {
								if (!ui.selected.cards || ui.selected.cards == 0) return [2, Infinity];
								else {
									var num = 0;
									for (var i of ui.selected.cards) {
										num += get.translation(get.name(i)).length;
									}
									if (num < get.translation(lib.skill.clanchengqi_backup.viewAs.name).length) return [ui.selected.cards.length + 1, Infinity];
									else return [2, Infinity];
								}
							},
							popname: true,
							check: function (card) {
								if (ui.selected.cards.length > 2) return 0;
								return 5 - get.value(card);
							},
							position: 'h',
							viewAs: { name: links[0][2], nature: links[0][3] },
							onuse: function (result, player) {
								'step 0'
								var a = get.translation(lib.skill.clanchengqi_backup.viewAs.name).length, b = 0;
								for (var i of result.cards) {
									b += get.translation(get.name(i)).length;
								}
								if (a == b) {
									var next = game.createEvent('clanchengqi_draw');
									next.player = player;
									next.setContent(lib.skill.clanchengqi.additionalSelect);
								}

							}
						}
					},
					prompt: function (links, player) {
						return '将至少两张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
					},
				},
				ai: {
					skillTagFilter: function (player) {
						if (player.countCards('h') < 2) return false;
						if (!lib.skill.clanchengqi.getUsedCard(player).contains('tao')) { }
						else if (player.isDying() && !lib.skill.clanchengqi.getUsedCard(player).contains('jiu')) { }
						else return false;
					},
					order: 3,
					result: {
						player: function (player) {
							var allshown = true, players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i].ai.shown == 0) {
									allshown = false;
								}
								if (players[i] != player && players[i].countCards('h') > 1 && get.attitude(player, players[i]) > 0) {
									return 1;
								}
							}
							if (allshown) return 1;
							return 0;
						},
					},
					threaten: 1.4,
				},
			},
			clanjieli: {
				audio: 2,
				trigger: { player: 'phaseJieshuBegin' },
				content: function () {
					'step 0'
					player.chooseTarget('你可以观看一名角色的牌名字数最大的手牌', 1, false, function (card, player, target) {
						return target.countCards('h') > 0;
					}).set('ai', function (target) {
						return -get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						event.target = result.targets[0];
						var num = 0;
						for (var i of event.target.getCards('h')) {
							if (get.translation(i.name).length > num) num = get.translation(i.name).length;
						}
						event.list = event.target.getCards('h', h => {
							return get.translation(h.name).length == num;
						});
						game.log(player, '观看了', event.target, '的部分手牌');
						player.chooseControl('ok').set('dialog', ['诫厉', event.list]);
					}
					else event.finish();
					'step 2'
					var num = 0;
					player.getHistory('useCard', e => {
						if (e.card && e.card.name) {
							if (get.translation(e.card.name).length > num) num = get.translation(e.card.name).length;
						}
					})
					if (num == 0) event.finish();
					else {
						var next = player.chooseToMove('诫厉：是否和牌堆顶' + num + '张牌交换');
						event.top = get.cards(num)
						next.set('list', [
							[get.translation(event.target) + '的牌', event.list],
							['牌堆顶的' + num + '张牌', event.top],
						]);
						next.set('filterMove', function (from, to) {
							return typeof to != 'number';
						});
						next.set('processAI', function (list) {
							var player = _status.event.player;
							var getv = function (card) {
								if (get.info(card).toself) return 0;
								return player.getUseValue(card, false);
							};
							var cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
								return getv(b) - getv(a);
							}), cards2 = cards.splice(0, event.list.length);
							return [cards2, cards];
						});
					}
					'step 3'
					if (result.bool) {
						var gains = result.moved[0], tops = result.moved[1];
						event.target.lose(event.list, ui.ordering, 'invisible');
						event.target.gain(gains, 'gain2');
						for (i = 0; i < tops.length; i++) {
							ui.cardPile.appendChild(tops[i]);
						}
					}
					'step 4'
					game.updateRoundNumber();
				}
			},
			clanlilun: {
				audio: 2,
				enable: 'phaseUse',
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				filterCard: function (card, player) {
					if (player.getStorage('clanlilun').includes(card.name)) return false;
					if (ui.selected.cards.length) {
						var cardx = ui.selected.cards[0];
						return get.name(card) == get.name(cardx);
					}
					var cards = player.getCards('h');
					for (var cardx of cards) {
						if (card != cardx) {
							if (get.name(card) == get.name(cardx)) return true;
						}
					}
					return false;
				},
				selectCard: 2,
				position: 'h',
				check: function (card) {
					const player = get.event('player');
					const value = function (card, player) {
						const num = player.getUseValue(card);
						return num > 0 ? (num + (1 / (get.value(card) || 0.5)) + 7) : 7 - get.value(card);
					};
					if (ui.selected.cards.length && value(card, player) < value(ui.selected.cards[0], player)) return 20 - get.value(card);
					return value(card, player);
				},
				complexCard: true,
				discard: false,
				lose: false,
				delay: 0,
				usable: 1,
				content: function () {
					'step 0'
					player.chongzhu(event.cards);
					player.markAuto('clanlilun', event.cards.slice().map(card => card.name));
					player.chooseButton(['离论：是否使用其中的一张牌？', event.cards]).set('filterButton', button => {
						return player.hasUseTarget(button.link);
					}).set('ai', button => {
						return get.event('player').getUseValue(button.link);
					});
					'step 1'
					if (result.bool) {
						var card = result.links[0];
						player.$gain2(card, false);
						//game.Delayx();
						player.chooseUseTarget(true, card, false);
					}
				},
				group: "clanlilun_remove",
				subSkill: {
					remove: {
						trigger: { global: 'phaseJieshuBegin' },
						charlotte: true,
						force: true,
						direct: true,
						popup: false,
						content: function () {
							player.unmarkSkill('clanlilun');
							delete player.storage.clanlilun;
						},
					}
				},
				onremove: true,
				intro: { content: '本回合已重铸过$' },
				ai: {
					result: { player: 1 },
				},
			},
			clanjianji: {
				unique: true,
				limited: true,
				audio: 2,
				priority: 10,
				trigger: { global: 'phaseJieshuBegin' },
				filter: function (event, player) {
					if (!event.player.isIn()) return false;
					const targets = game.filterPlayer(target => {
						return event.player.getPrevious() == target || event.player.getNext() == target;
					});
					if (!targets.length) return false;
					return !targets.some(target => {
						return target.getHistory('useCard').length;
					}) || (player.hasUseTarget('sha') && !targets.some(target => {
						return game.hasPlayer2(current => {
							return current.getHistory('useCard', evt => {
								return evt.targets && evt.targets.includes(target);
							}).length;
						});
					}));
				},
				skillAnimation: true,
				animationColor: 'watar',
				"prompt2": function (event, player) {
					let str = '';
					const targets = game.filterPlayer(target => {
						return event.player.getPrevious() == target || event.player.getNext() == target;
					}), bool = (!targets.some(target => {
						return target.getHistory('useCard').length;
					})), goon = (player.hasUseTarget('sha') && !targets.some(target => {
						return game.hasPlayer2(current => {
							return current.getHistory('useCard', evt => {
								return evt.targets && evt.targets.includes(target);
							}).length;
						});
					}));
					if (bool && !goon) {
						if (bool) str += '你可以';
						str += '与' + get.translation(get.translation(event.player)) + '各摸一张牌';
					}
					if (goon && !bool) {
						if (goon) str += '你可以';
						str += '视为使用一张【杀】';
					}
					if (bool && goon) {
						if (bool && goon) str += '你可以与' + get.translation(get.translation(event.player)) + '各摸一张牌';
						str += '，然后你可以视为使用一张【杀】';
					}
					return str;
				},
				check: function (event, player) {
					const targets = game.filterPlayer(target => {
						return event.player.getPrevious() == target || event.player.getNext() == target;
					}), bool = (!targets.some(target => {
						return target.getHistory('useCard').length;
					})), goon = (player.hasUseTarget('sha') && !targets.some(target => {
						return game.hasPlayer2(current => {
							return current.getHistory('useCard', evt => {
								return evt.targets && evt.targets.includes(target);
							}).length;
						});
					}));
					return (bool && (get.attitude(player, event.player) > 0 || event.player.countCards('h') > player.countCards('h'))) || (goon && player.hasValueTarget('sha'));
				},
				logTarget: 'player',
				content: function () {
					'step 0'
					player.awakenSkill('clanjianji');
					'step 1'
					var targets = game.filterPlayer(target => {
						return trigger.player.getPrevious() == target || trigger.player.getNext() == target;
					}), boolx = (!targets.some(target => {
						return target.getHistory('useCard').length;
					}));
					if (boolx) {
						player.chooseBool('是否与' + get.translation(trigger.player) + '各摸一张牌？').set('choice', get.attitude(player, trigger.player) > 0 || trigger.player.countCards('h') > player.countCards('h'));
					}
					'step 2'
					if (result.bool) {
						player.draw('nodelay');
						trigger.player.draw();
					}
					'step 3'
					var targets = game.filterPlayer(target => {
						return trigger.player.getPrevious() == target || trigger.player.getNext() == target;
					}), goon = (player.hasUseTarget('sha') && !targets.some(target => {
						return game.hasPlayer2(current => {
							return current.getHistory('useCard', evt => {
								return evt.targets && evt.targets.includes(target);
							}).length;
						});
					}));
					if (goon) player.chooseUseTarget('视为使用一张【杀】', { name: 'sha' }, true);
				},
			},
			clanqiajue: {
				audio: 2,
				trigger: { player: 'phaseDrawBefore' },
				filter: function (event, player) {
					return player.hasCard(function (card) {
						return get.color(card) == 'black';
					}, 'hes');
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseToDiscard('he', '弃置一张黑色牌', function (card, player) {
						return get.color(card) == 'black';
					});
					'step 1'
					if (result.bool) {
						player.logSkill('clanqiajue');
						player.addTempSkill('clanqiajue_sub', { player: 'phaseDiscardAfter' });
					}
				},
				subSkill: {
					sub: {
						audio: 'clanqiajue',
						trigger: { player: 'phaseDrawEnd' },
						priority: 20,
						direct: true,
						charlotte: true,
						content: function () {
							'step 0'
							player.showHandcards();
							'step 1'
							var num = 0;
							player.getCards('h').forEach((card) => { num += get.number(card) });
							if (num > 30) player.addTempSkill('clanqiajue_sub2', { player: 'phaseDiscardEnd' });
							else {
								var next = trigger.player.phaseDraw();
								event.next.remove(next);
								trigger.getParent('phase').next.push(next);
							}
						}
					},
					sub2: {
						mod: {
							maxHandcard: function (player, num) {
								return num - 2;
							},
						},
					}
				}
			},
			clanqiuxin: {
				audio: 2,
				enable: 'phaseUse',
				filterTarget: lib.filter.notMe,
				usable: 1,
				content: function () {
					'step 0'
					var str = get.translation(player);
					target.chooseControl().set('choiceList', [
						str + '下次对你使用【杀】后，其视为对你使用任意普通锦囊牌',
						str + '下次对你使用任意普通锦囊牌后，其视为对你使用【杀】',
					]).set('ai', function () {
						var target = _status.event.player;
						var player = _status.event.target;
						var num1 = get.effect(target, get.autoViewAs({ name: 'sha' }, []), player, player);
						if (!player.canUse(get.autoViewAs({ name: 'sha' }, []), target)) num1 = 0;
						var num2 = 0;
						for (var name of lib.inpile) {
							if (get.type(name) != 'trick') continue;
							if (!player.canUse(get.autoViewAs({ name: name }, []), target)) continue;
							if (num2 < get.effect(target, get.autoViewAs({ name: name }, []), player, player)) num2 = get.effect(target, get.autoViewAs({ name: name }, []), player, player);
						}
						return num1 >= num2 ? 1 : 0;
					}).set('target', player);
					'step 1'
					player.markAuto('clanqiuxin_effect', [[target, result.index]]);
					var str = '';
					switch (result.index) {
						case 0:
							str = str + '使用【杀】后，视为使用任意普通锦囊牌';
							break;
						case 1:
							str = str + '使用普通锦囊牌后，视为使用【杀】';
							break;
					}
					game.log(player, '下次对', target, str);
				},
				ai: {
					order: 12,
					result: {
						target: function (player, target) {
							var att = get.attitude(player, target);
							if (player.countCards('h') == 0) return 0;
							if (att > 0) return 6;
							if (att < 0) return -6;
							return 0;
						},
					},
				},
				group: 'clanqiuxin_effect',
				subSkill: {
					effect: {
						charlotte: true,
						intro: {
							content: function (storage, player) {
								var str = '';
								for (var i = 0; i < storage.length; i++) {
									var list = storage[i];
									var strx = ['【杀】', '任意普通锦囊牌'];
									if (list[1]) strx.reverse();
									str += '对' + get.translation(list[0]) + '使用' + strx[0] + '后，视为对其使用' + strx[1];
									str += '<br>';
								}
								str = str.slice(0, -4);
								return str;
							},
						},
						trigger: { player: 'useCardAfter' },
						filter: function (event, player) {
							if (!event.targets || !event.targets.length) return false;
							if (!player.storage.clanqiuxin_effect || player.storage.clanqiuxin_effect.length <= 0 || player.storage.clanqiuxin_effect[0][0] == undefined) return false;
							if (event.card.name == 'sha') return event.targets.some(target => {
								return player.getStorage('clanqiuxin_effect').some(list => list[0] == target && list[1] == 0);
							});
							if (get.type(event.card) == 'trick') return event.targets.some(target => {
								return player.getStorage('clanqiuxin_effect').some(list => list[0] == target && list[1] == 1);
							});
							return false;
						},
						forced: true,
						popup: false,
						content: function () {
							'step 0'
							var list;
							if (trigger.card.name == 'sha') list = player.getStorage('clanqiuxin_effect').filter(listx => trigger.targets.contains(listx[0]) && listx[1] == 0);
							if (get.type(trigger.card) == 'trick') list = player.getStorage('clanqiuxin_effect').filter(listx => trigger.targets.contains(listx[0]) && listx[1] == 1);
							var targets = list.map(listx => listx[0]);
							event.targets = targets;
							'step 1'
							var target = event.targets.shift();
							event.target = target;
							var list = [];
							for (var name of lib.inpile) {
								if (trigger.card.name == 'sha' && get.type(name) != 'trick') continue;
								if (name == 'sha' && get.type(trigger.card.name) != 'trick') continue;
								if (!player.canUse(get.autoViewAs({ name: name }, []), target)) continue;
								list.push([get.translation(get.type(name)), '', name]);
								if (name == 'sha') {
									for (var nature of lib.inpile_nature) {
										if (!player.canUse(get.autoViewAs({ name: name, nature: nature }, []), target)) continue;
										list.push([get.translation(get.type(name)), '', name, nature]);
									}
								}
							}
							if (!list.length) event.goto(3);
							else {
								player.chooseButton(['求心：视为对' + get.translation(target) + '使用一张牌', [list, 'vcard']], true).set('ai', function (button) {
									var player = _status.event.player;
									var target = _status.event.target;
									return get.effect(target, { name: button.link[2], nature: button.link[3] }, player, player);
								}).set('target', target);
							}
							'step 2'
							if (result.bool) {
								var card = {
									name: result.links[0][2],
									nature: result.links[0][2],
								};
								player.useCard(card, target, false);
								for (var i = 0; i < player.storage.clanqiuxin_effect.length; i++) {
									if (target == player.storage.clanqiuxin_effect[i][0]) {
										player.storage.clanqiuxin_effect.splice(i, 1);
										break;
									}
								}
							}
							'step 3'
							if (player.storage.clanqiuxin_effect.length == 0) player.unmarkSkill('clanqiuxin_effect');
							if (event.targets.length) event.goto(1);

						},
					},
				},
			},
			clanjianyuan: {
				trigger: {
					global: ['useSkillAfter', 'logSkill'],
				},
				filter: function (event, player) {
					if (event.type != 'player') return false;
					var skill = event.sourceSkill || event.skill;
					var info = get.info(skill);
					if (info.charlotte) return false;
					var translation = lib.translate[skill + '_info'];
					if (translation && !(/(?<!“)出牌阶段限一次/.test(translation))) return false;
					return event.player.countCards('h') > 0;
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				content: function () {
					'step 0'
					var num = 0;
					for (var phase of lib.phaseName) {
						var evt = trigger.getParent(phase);
						if (evt && evt.name == phase) {
							num += trigger.player.getHistory('useCard', evtx => evtx.getParent(phase) == evt).length;
						}
					}
					trigger.player.chooseCard('是否重铸任意张牌名字数为' + num + '的牌？', [1, Infinity], 'he', (card, player, target) => {
						if (!_status.event.cards.contains(card)) return false;
						var mod = game.checkMod(card, player, 'unchanged', 'cardChongzhuable', player);
						return mod == 'unchanged';
					}).set('ai', card => {
						var val = get.value(card);
						return 6 - val;
					}).set('cards', trigger.player.getCards('he', card => {
						return lib.skill.dcweidang.getLength(card) == num;
					}));
					'step 1'
					if (result.bool) {
						var cards = result.cards;
						trigger.player.loseToDiscardpile(cards);
						trigger.player.draw(cards.length);
					}
				},
			},
			jiejian: {
				audio: 2,
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					return player.getHistory('useCard').length == lib.skill.dcweidang.getLength(event.card) && event.targets.length > 0 && get.type(event.card) != 'equip';
				},
				mod: {
					aiOrder: (player, card, order) => {
						if (get.name(card) == 'tao' || get.name(card) == 'jiu') return 18;
					},
					aiValue: (player, card, val) => {
						if (card.name == 'tao') return 18;
					},
				},
				content: function () {
					'step 0'
					if (trigger.targets.length > 1) event.goto(1);
					else {
						player.line(trigger.targets[0]);
						trigger.targets[0].draw(lib.skill.dcweidang.getLength(trigger.card));
						event.finish();
					}
					'step 1'
					player.chooseTarget('令一名目标角色摸等同于此牌牌名张牌', true, (card, player, target) => {
						return _status.event.targets.contains(target);
					}).set('ai', target => {
						return 2 + get.attitude(_status.event.player, target);
					}).set('targets', event.getParent().getTrigger().targets);
					'step 2'
					if (result.bool) {
						var target = result.targets[0];
						player.line(target);
						target.draw(lib.skill.dcweidang.getLength(trigger.card));
					}

				},

			},
			huanghan: {
				trigger: {
					player: "damageEnd",
				},
				filter: function (event, player) {
					return get.itemtype(event.cards) == 'cards';
				},
				init: function (player) {
					if (!player.storage.huanghan) player.storage.huanghan = false;
				},
				content: function () {
					'step 0'
					player.draw(lib.skill.dcweidang.getLength(trigger.cards[0]));
					'step 1'
					player.chooseToDiscard('he', player.getDamagedHp(), true);
					'step 2'
					if (player.storage.huanghan == true && player.hasSkill('clanbaozu', null, false, false)) player.restoreSkill('clanbaozu');
					'step 3'
					player.storage.huanghan = true;
				},
				group: 'huanghan_end',
				subSkill: {
					end: {
						trigger: { global: 'phaseEnd' },
						filter: function (event, player) {
							return player.storage.huanghan == true;
						},
						charlotte: true,
						popup: false,
						silent: true,
						forced: true,
						content: function () {
							player.storage.huanghan = false;
						}
					}
				},
				ai: {
					maixie: true,
					"maixie_hp": true,
					effect: {
						target: function (card, player, target) {
							if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
							if (get.tag(card, 'damage')) return [1, lib.skill.dcweidang.getLength(card) - player.getDamagedHp() - 0.2];
						},
					},
				},
			},
			fuxun: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filterCard: true,
				position: 'h',
				discard: false,
				lose: false,
				delay: false,
				selectCard: function () {
					var player = _status.event.player;
					if (ui.selected.targets.length && !ui.selected.targets[0].countGainableCards(player, 'h')) return 1;
					return [0, 1];
				},
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					if (!ui.selected.cards.length) return target.countGainableCards(player, 'h') > 0;
					return true;
				},
				check: function (event, player) {
					var player = _status.event.player;
					if (get.attitude(player, ui.selected.targets[0]) > 0) {
						return 6 - get.value(card);
					} else {
						if (ui.selected.cards.length == 0) return 0;
					}
				},
				content: function () {
					'step 0'
					if (cards.length) {
						player.give(cards, target);
					}
					else {
						player.gainPlayerCard(target, 'h', true);
					}
					'step 1'
					var evtx = event.getParent('phaseUse');
					if (player.countCards('h') == target.countCards('h') && evtx && !target.hasHistory('lose', evt => {
						return evt.getParent(3).name != 'fuxun' && evt.getParent('phaseUse') == evtx && evt.cards2.length;
					}) && !target.hasHistory('gain', evt => {
						return evt.getParent().name != 'fuxun' && evt.getParent('phaseUse') == evtx && evt.cards.length;
					}) && player.countCards('he')) {
						var list = [];
						for (var name of lib.inpile) {
							if (get.type(name) != 'basic') continue;
							if (player.hasUseTarget({ name: name })) list.push(['基本', '', name]);
							if (name == 'sha') {
								for (var nature of lib.inpile_nature) {
									if (player.hasUseTarget({ name: name, nature: nature })) list.push(['基本', '', name, nature]);
								}
							}
						}
						if (list.length) {
							player.chooseButton(['是否将一张牌当做一种基本牌使用？', [list, 'vcard']]).set('ai', button => {
								return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3] });
							});
						}
						else event.finish();
					}
					else event.finish();
					'step 2'
					if (result.bool) {
						var card = {
							name: result.links[0][2],
							nature: result.links[0][3]
						};
						game.broadcastAll(function (card) {
							lib.skill.fuxun_backup.viewAs = card;
						}, card);
						var next = player.chooseToUse();
						next.set('openskilldialog', '将一张牌当做' + get.translation(card) + '使用');
						next.set('norestore', true);
						next.set('addCount', false);
						next.set('_backupevent', 'fuxun_backup');
						next.set('custom', {
							add: {},
							replace: { window: function () { } }
						});
						next.backup('fuxun_backup');
					}
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							if (get.attitude(player, target) > 0) return 1;
							if (get.attitude(player, target) < 0) return -0.5;
						},
					},
				},
				subSkill: {
					backup: {
						filterCard: function (card) {
							return get.itemtype(card) == 'card';
						},
						position: 'hes',
						filterTarget: lib.filter.targetEnabled,
						selectCard: 1,
						check: (card) => 6 - get.value(card),
						log: false,
						precontent: function () {
							delete event.result.skill;
						},
					},
				}
			},
			chenya: {
				audio: 2,
				trigger: {
					global: ['useSkillAfter', 'logSkill'],
				},
				filter: function (event, player) {
					if (event.type != 'player') return false;
					var skill = event.sourceSkill || event.skill;
					var info = get.info(skill);
					if (info.charlotte) return false;
					var translation = lib.translate[skill + '_info'];
					if (translation && !(/(?<!“)出牌阶段限一次/.test(translation))) return false;
					return event.player.countCards('h') > 0;
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				logTarget: 'player',
				content: function () {
					'step 0'
					var num = trigger.player.countCards('h');
					trigger.player.chooseCard('是否重铸任意张牌名字数为' + num + '的牌？', [1, Infinity], 'he', (card, player, target) => {
						if (!_status.event.cards.contains(card)) return false;
						var mod = game.checkMod(card, player, 'unchanged', 'cardChongzhuable', player);
						return mod == 'unchanged';
					}).set('ai', card => {
						var val = get.value(card);
						return 6 - val;
					}).set('cards', trigger.player.getCards('he', card => {
						return lib.skill.dcweidang.getLength(card) == num;
					}));
					'step 1'
					if (result.bool) {
						var cards = result.cards;
						trigger.player.loseToDiscardpile(cards);
						trigger.player.draw(cards.length);
					}
				}
			},
			clanyuzhi: {
				audio: 2,
				trigger: { global: 'roundStart' },
				direct: true,
				locked: true,
				content: function () {
					'step 0'
					var num1 = 0, num2 = 0, num3 = 0, bool = true;
					var history = player.actionHistory;
					for (var i = history.length - 2; i >= 0; i--) {
						for (var evt of history[i].gain) {
							if (evt.getParent().name == 'draw' && evt.getParent(2).name == 'clanyuzhi') {
								if (bool) num1 += evt.cards.length;
								else num2 += evt.cards.length;
							}
						}
						if (bool) num3 += history[i].useCard.length;
						if (history[i].isRound) {
							if (bool) bool = false;
							else break;
						}
					}
					event.num1 = num1;
					if (num1 > 0 && (num2 > 0 && num1 > num2) || num1 > num3) {
						player.logSkill('clanyuzhi');
						if (player.hasSkill('clanbaozu', null, false, false)) player.chooseBool('迂志：是否失去〖保族〗？否则失去1点体力').set('choice', player.awakenedSkills.contains('clanbaozu'));
						else event._result = { bool: false };
					}
					else event.goto(2);
					'step 1'
					if (result.bool) {
						player.removeSkill('clanbaozu');
						player.popup('保族');
						game.log(player, '失去了技能', '#g【保族】');
					}
					else player.loseHp();
					'step 2'
					if (!player.countCards('h')) event.finish();
					'step 3'
					player.chooseCard('迂志：请展示一张手牌', '摸此牌牌名字数的牌。下一轮开始时，若本轮你使用的牌数或上一轮你以此法摸的牌数小于此牌牌名字数，则你失去1点体力。', true, function (card, player) {
						var num = lib.skill.dcweidang.getLength(card);
						return typeof num == 'number' && num > 0;
					}).set('ai', function (card) {
						if (_status.event.dying && _status.event.num > 0 && lib.skill.dcweidang.getLength(card) > _status.event.num) return 1 / lib.skill.dcweidang.getLength(card);
						return lib.skill.dcweidang.getLength(card);
					}).set('dying', player.hp + player.countCards('hs', { name: ['tao', 'jiu'] }) < 1).set('num', event.num1);
					'step 4'
					if (result.bool) {
						player.logSkill('clanyuzhi');
						player.showCards(result.cards, get.translation(player) + '发动了【迂志】');
						player.draw(lib.skill.dcweidang.getLength(result.cards[0]));
						player.storage.clanyuzhi = lib.skill.dcweidang.getLength(result.cards[0]);
						player.markSkill('clanyuzhi');
					}
					else player.unmarkSkill('clanyuzhi');
				},
				ai: {
					threaten: 3,
					nokeep: true,
				},
				onremove: true,
				intro: { content: '本轮已获得#张牌' },
			},
			clanxieshu: {
				mod: {
					aiOrder: function (player, card, num) {
						if (card.name == 'tao' && player.hp > 2) return 0;
						if ((card.name == 'shan' || card.name == 'wuxie') && ((player.hp > 1 && player.countCards('h') == 1) || (player.hp > 2))) return -2;
					},
				},
				audio: 2,
				trigger: { player: 'damageEnd', source: 'damageSource' },
				filter: function (event, player) {
					if (!event.card) return false;
					var num = lib.skill.dcweidang.getLength(event.card);
					return typeof num == 'number' && num > 0 && player.countCards('he');
				},
				direct: true,
				content: function () {
					'step 0'
					var num = lib.skill.dcweidang.getLength(trigger.card), str = '';
					if (player.getDamagedHp() > 0) str += ('并摸' + get.cnNumber(player.getDamagedHp()) + '张牌');
					player.chooseToDiscard(get.prompt('clanxieshu'), '弃置' + get.cnNumber(num) + '张牌' + str, 'he', num).set('ai', function (card) {
						var player = _status.event.player;
						var num = _status.event.num;
						var num2 = player.getDamagedHp();
						if (card.name == 'zhuge' && player.countCards('he') > 1) return -Infinity;
						if (num2 < num) {
							if (num - num2 + player.countCards('h') >= player.hp) return 8 - get.value(card);
							else return 0;
						};
						if (num == num2) return lib.skill.zhiheng.check(card);
						if (num < 2) 8 - get.value(card)
						return 6 - get.value(card);
					}).set('num', num).logSkill = 'clanxieshu';
					'step 1'
					if (result.bool && player.getDamagedHp() > 0) player.draw(player.getDamagedHp());
				},
				ai: {
					threaten: 3,
					maixie: true,
					'maixie_hp': true,
				},
			},
			//族王允
			clanjiexuan: {
				audio: 2,
				enable: 'phaseUse',
				limited: true,
				zhuanhuanji: 'number',
				mark: true,
				marktext: '☯',
				intro: {
					markcount: () => 0,
					content: function (storage) {
						return '限定技，转换技，你可以将一张' + ((storage || 0) % 2 ? '黑色牌当【过河拆桥】' : '红色牌当【顺手牵羊】') + '使用。';
					},
				},
				viewAs: function (cards, player) {
					var storage = player.storage.clanjiexuan;
					var name = (storage || 0) % 2 ? 'guohe' : 'shunshou';
					return { name: name };
				},
				check: function (card) {
					var player = _status.event.player;
					var storage = player.storage.clanjiexuan;
					var name = (storage || 0) % 2 ? 'guohe' : 'shunshou';
					var fix = player.hasSkill('clanzhongliu') && get.position(card) != 'h' ? 2 : 1;
					return get.value({ name: name }, player) - get.value(card) + fix;
				},
				position: 'hes',
				filterCard: function (card, player) {
					var storage = player.storage.clanjiexuan;
					return get.color(card) == ((storage || 0) % 2 ? 'black' : 'red');
				},
				skillAnimation: true,
				animationColor: 'thunder',
				precontent: function () {
					'step 0'
					var skill = 'clanjiexuan';
					player.logSkill(skill);
					player.changeZhuanhuanji(skill);
					player.awakenSkill(skill, true);
					delete event.result.skill;
				},
				ai: {
					order: function (item, player) {
						player = player || _status.event.player;
						var storage = _status.event.player.storage.clanjiexuan;
						var name = (storage || 0) % 2 ? 'guohe' : 'shunshou';
						return get.order({ name: name }) + 0.1;
					},
				},
			},
			clanmingjie: {
				audio: 2,
				enable: 'phaseUse',
				limited: true,
				filterTarget: true,
				skillAnimation: true,
				animationColor: 'thunder',
				content: function () {
					'step 0'
					player.awakenSkill('clanmingjie');
					player.addSkill('clanmingjie_effect');
					player.markAuto('clanmingjie_effect', [target]);
					target.addTempSkill('clanmingjie_targeted', { player: 'phaseAfter' });
					target.markAuto('clanmingjie_targeted', [player]);
				},
				ai: {
					order: 10,
					result: {
						target: function (player, target) {
							if (player.getStorage('clanmingjie_effect').contains(target)) return 0;
							if (player.hasSkill('clanzhongliu') || player.hp == 1) {
								if (!player.hasCard(card => {
									var info = get.info(card);
									if (info.allowMultiple == false) return false;
									if (!lib.filter.targetEnabled2(card, player, target)) return false;
									return game.hasPlayer(current => {
										return player.canUse(card, current) && get.effect(current, card, player, player) > 0 && current != target && get.effect(target, card, player, player) > 0;
									});
								}, 'hs')) return 0;
							}
							else {
								if (player.countCards('hs', card => {
									var info = get.info(card);
									if (info.allowMultiple == false) return false;
									if (!lib.filter.targetEnabled2(card, player, target)) return false;
									return game.hasPlayer(current => {
										return player.canUse(card, current) && get.effect(current, card, player, player) > 0 && current != target && get.effect(target, card, player, player) > 0;
									});
								}) < 3) return 0;
							}
							return get.sgnAttitude(player, target);
						},
					}
				},
				subSkill: {
					effect: {
						trigger: { player: 'useCard2' },
						charlotte: true,
						filter: function (event, player) {
							var card = event.card;
							var info = get.info(card);
							if (info.allowMultiple == false) return false;
							if (event.targets && !info.multitarget) {
								if (player.getStorage('clanmingjie_effect').some(current => {
									return current.isIn() && !event.targets.contains(current) && lib.filter.targetEnabled2(card, player, current);
								})) {
									return true;
								}
							}
							return false;
						},
						prompt: '是否发动【铭戒】？',
						prompt2: function (event, player) {
							var list = player.getStorage('clanmingjie_effect').filter(target => {
								if (event.targets.contains(target) || !target.isIn()) return false;
								return lib.filter.targetEnabled2(event.card, player, target);
							});
							return '令' + get.translation(list) + '也成为' + get.translation(event.card) + '的目标';
						},
						logTarget: function (event, player) {
							return player.getStorage('clanmingjie_effect').filter(target => {
								if (event.targets.contains(target) || !target.isIn()) return false;
								return lib.filter.targetEnabled2(event.card, player, target);
							});
						},
						check: function (event, player) {
							var eff = 0;
							var list = player.getStorage('clanmingjie_effect').filter(target => {
								if (event.targets.contains(target) || !target.isIn()) return false;
								return lib.filter.targetEnabled2(event.card, player, target);
							});
							for (var i of list) eff += get.effect(i, event.card, player, player);
							return eff > 0;
						},
						content: function () {
							var list = player.getStorage('clanmingjie_effect').filter(target => {
								if (trigger.targets.contains(target) || !target.isIn()) return false;
								return lib.filter.targetEnabled2(trigger.card, player, target);
							});
							if (list.length > 0) {
								trigger.targets.addArray(list);
								game.log(list, '也成为了', trigger.card, '的目标');
							}
						},
						intro: {
							content: '使用牌时可以额外指定$为目标',
						},
						ai: {
							effect: {
								player: function (card, player, target) {
									if (_status.event.getParent('useCard', true) || _status.event.getParent('_wuxie', true)) return;
									if (player.getStorage('clanmingjie_effect').contains(target)) return [1, -0.5];
								},
							},
						},
					},
					targeted: {
						trigger: {
							player: 'phaseEnd',
						},
						filter: function (event, player) {
							return player.getStorage('clanmingjie_targeted').length;
						},
						forced: true,
						popup: false,
						onremove: ['clanmingjie_targeted', 'clanmingjie_record'],
						charlotte: true,
						group: 'clanmingjie_record',
						content: function () {
							'step 0'
							var targets = player.getStorage('clanmingjie_targeted').slice();
							targets.sortBySeat();
							event.targets = targets;
							event.targetsx = targets.slice();
							var cards = [];
							var list = player.getStorage('clanmingjie_record');
							if (list.length) {
								cards.addArray(list);
							}
							cards = cards.filterInD('d');
							if (cards.length) {
								event.cards = cards;
							}
							else event.goto(6);
							'step 1'
							event.target = targets.shift();
							event.cards2 = cards.filterInD('d');
							'step 2'
							target.chooseButton(['铭戒：是否使用这些牌？', event.cards2]).set('filterButton', button => {
								return _status.event.player.hasUseTarget(button.link);
							}).set('ai', button => {
								return _status.event.player.getUseValue(button.link);
							});
							'step 3'
							if (result.bool) {
								var card = result.links[0];
								event.cards2.remove(card);
								target.$gain2(card, false);
								game.delayx();
								target.chooseUseTarget(card, true);
							}
							else event.goto(5);
							'step 4'
							if (event.cards2.filter(card => {
								return get.position(card, true) == 'd' && target.hasUseTarget(card);
							}).length) event.goto(2);
							'step 5'
							if (targets.length) event.goto(1);
							'step 6'
							event.targetsx.forEach(target => {
								target.unmarkAuto('clanmingjie_effect', [player]);
							});
							player.removeSkill('clanmingjie_targeted');
						},
						marktext: '戒',
						intro: {
							content: '已被$指定为〖铭戒〗目标',
						},
					},
					record: {
						trigger: {
							global: ['shaMiss', 'eventNeutralized', 'useCard1', 'phaseAfter'],
						},
						silent: true,
						forced: true,
						charlotte: true,
						filter: function (event, player) {
							if (_status.currentPhase != player) return false;
							if (event.name == 'useCard') {
								return get.suit(event.card) == 'spade';
							}
							if (event.name == 'phase') return true;
							if (event.type != 'card') return false;
							return true;
						},
						content: function () {
							'step 0'
							if (trigger.name == 'phase') {
								delete player.storage.clanmingjie_record;
								return;
							}
							player.markAuto('clanmingjie_record', trigger.cards);
						}
					}
				}
			},
			//族钟琰
			clanguangu: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				zhuanhuanji: true,
				mark: true,
				marktext: '☯',
				intro: {
					content: function (storage) {
						return '转换技，出牌阶段限一次，你可以观看' + (storage ? '一名角色的至多四张手' : '牌堆顶的至多四张') + '牌，然后可以使用其中的一张牌。';
					},
				},
				filter: function (event, player) {
					if (player.storage.clanguangu) return game.hasPlayer(current => {
						return current.countCards('h');
					});
					return true;
				},
				chooseButton: {
					dialog: function (event, player) {
						var str = '观骨：';
						if (player.storage.clanguangu) str += '选择观看一名角色的手牌数';
						else str += '选择观看牌堆的牌数';
						var dialog = ui.create.dialog(str, 'hidden');
						if (player.storage.clanguangu) dialog.forceDirect = true;
						return dialog;
					},
					chooseControl: function (event, player) {
						var list = [1, 2, 3, 4].map(i => {
							return get.cnNumber(i, true);
						});
						list.push('cancel2');
						return list;
					},
					check: function (button, player) {
						var ret;
						if (!player.hasSkill('clanxiaoyong')) ret = 4;
						else {
							var list = [4, 3, 2, 1];
							player.getHistory('useCard', evt => {
								var len = lib.skill.dcweidang.getLength(evt.card);
								list.remove(len);
							});
							if (list.length) ret = list[0];
							else ret = 4;
						}
						return get.cnNumber(ret, true);
					},
					backup: function (result, player) {
						return {
							audio: 'clanguangu',
							filterCard: () => false,
							selectCard: -1,
							filterTarget: function (card, player, target) {
								if (player.storage.clanguangu) return true;
								return false;
							},
							selectTarget: function () {
								var player = _status.event.player;
								if (player.storage.clanguangu) return 1;
								return -1;
							},
							num: result.index + 1,
							content: function () {
								'step 0'
								player.changeZhuanhuanji('clanguangu');
								if (!targets.length) {
									var num = lib.skill.clanguangu_backup.num;
									var cards = get.cards(num);
									game.cardsGotoOrdering(cards);
									event.cards = cards;
									event.goto(2);
								}
								else {
									var ret;
									if (!player.hasSkill('clanxiaoyong')) ret = 4;
									else {
										var list = [4, 3, 2, 1];
										player.getHistory('useCard', evt => {
											var len = lib.skill.dcweidang.getLength(evt.card);
											list.remove(len);
										});
										if (list.length) ret = list[0];
										else ret = 4;
									}
									player.choosePlayerCard(target, 'h', true, [1, 4]).set('prompt', '观骨：观看' + get.translation(target) + '的至多四张牌').set('ai', button => {
										if (ui.selected.buttons.length >= _status.event.num) return 0;
										return Math.random();
									}).set('num', ret);
								}
								'step 1'
								if (result.bool) {
									event.cards = result.links;
								}
								else {
									event.finish();
								}
								'step 2'
								var count = cards.length;
								event.getParent().viewedCount = count;
								player.chooseButton(['观骨：是否使用其中一张牌？', cards]).set('filterButton', button => {
									var player = _status.event.player;
									var card = button.link;
									var cardx = {
										name: get.name(card, get.owner(card)),
										nature: get.nature(card, get.owner(card)),
										cards: [card],
									}
									return player.hasUseTarget(cardx, null, false);
								}).set('ai', button => {
									var len = _status.event.len;
									var card = button.link;
									var fix = 1;
									if (lib.skill.dcweidang.getLength(card) == len) fix = 2;
									return fix * _status.event.player.getUseValue(card);
								}).set('len', function () {
									if (!player.hasSkill('clanxiaoyong')) return 0;
									var list = [];
									player.getHistory('useCard', evt => {
										var len = lib.skill.dcweidang.getLength(evt.card);
										list.add(len);
									});
									if (!list.contains(count)) return count;
									if (list.length) return list.randomGet();
									return 4;
								}());
								'step 3'
								if (result.bool) {
									var card = result.links[0];
									cards.remove(card);
									var cardx = {
										name: get.name(card, get.owner(card)),
										nature: get.nature(card, get.owner(card)),
										cards: [card],
									}
									var next = player.chooseUseTarget(cardx, [card], true, false).set('oncard', (card) => {
										var owner = _status.event.getParent().owner;
										if (owner) owner.$throw(card.cards);
									});
									if (card.name != cardx.name || card.nature != cardx.nature) next.viewAs = true;
									var owner = get.owner(card);
									if (owner != player && get.position(card) == 'h') {
										next.throw = false;
										next.set('owner', owner);
									}
								}
								'step 4'
								if (!targets.length) {
									while (cards.length) ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild);
									game.updateRoundNumber();
								}
							},
							ai: {
								order: 10,
								result: {
									target: function (player, target) {
										return -Math.min(target.countCards('h'), 4) / 2;
									},
								},
							}
						}
					},
					prompt: function (result) {
						if (result.index > 0) return '点击“确定”以观看牌堆顶牌';
						return '观骨：选择观看牌的目标';
					},
				},
				subSkill: {
					backup: {},
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					}
				},
			},
			clanxiaoyong: {
				audio: 2,
				trigger: {
					player: 'useCard',
				},
				filter: function (event, player) {
					if (!player.getStat().skill.clanguangu) return false;
					var history = player.getAllHistory('useSkill', evt => {
						return evt.skill == 'clanguangu_backup';
					}).map(evt => evt.event);
					if (!history.length) return false;
					var num = 0;
					for (var i = history.length - 1; i >= 0; i--) {
						var evt = history[i];
						if (evt.viewedCount) {
							num = evt.viewedCount;
							break;
						}
					}
					if (num && lib.skill.dcweidang.getLength(event.card) == num) return true;
					return false;
				},
				forced: true,
				content: function () {
					'step 0'
					delete player.getStat().skill.clanguangu;
					game.log(player, '重置了', '#g【观骨】');
				},
				mod: {
					aiOrder: function (player, card, num) {
						if (!player.hasSkill('clanguangu') || !player.getStat().skill.clanguangu) return;
						var history = player.getAllHistory('useSkill', evt => {
							return evt.skill == 'clanguangu_backup';
						}).map(evt => evt.event);
						if (!history.length) return;
						var numx = 0;
						for (var i = history.length - 1; i >= 0; i--) {
							var evt = history[i];
							if (evt.viewedCount) {
								numx = evt.viewedCount;
								break;
							}
						}
						if (numx == lib.skill.dcweidang.getLength(card)) {
							if (!player.hasHistory('useCard', evt => {
								return numx == lib.skill.dcweidang.getLength(evt.card);
							})) {
								return num + 9;
							}
						}
					},
				}
			},
			clanbaozu: {
				audio: 2,
				audioname: ['clan_zhongyan', 'clan_zhonghui', 'clan_zhongyu', 'clan_zhongyao'],
				trigger: { global: 'dying' },
				clanSkill: true,
				limited: true,
				skillAnimation: true,
				animationColor: 'water',
				filter: function (event, player) {
					return (event.player == player || event.player.hasClan('颍川钟氏')) && event.player.hp <= 0;
				},
				logTarget: 'player',
				check: function (event, player) {
					if (get.attitude(player, event.player) < 4) return false;
					if (player.countCards('h', function (card) {
						var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
						if (mod2 != 'unchanged') return mod2;
						var mod = game.checkMod(card, player, event.player, 'unchanged', 'cardSavable', player);
						if (mod != 'unchanged') return mod;
						var savable = get.info(card).savable;
						if (typeof savable == 'function') savable = savable(card, player, event.player);
						return savable;
					}) >= 1 - event.player.hp) return false;
					if (event.player == player || event.player == get.zhu(player)) return true;
					return !player.hasUnknown();
				},
				content: function () {
					'step 0'
					player.awakenSkill('clanbaozu');
					'step 1'
					trigger.player.link(true);
					trigger.player.recover();
				},
			},
			//族王凌
			clanbolong: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return player.countCards('he') > 0;
				},
				filterTarget: lib.filter.notMe,
				content: function () {
					'step 0'
					var num = player.countCards('h');
					var str = '是否交给其' + get.cnNumber(num) + '张牌，然后视为你对其使用一张【酒】？或者点击“取消”，令其交给你一张牌，然后其视为对你使用一张雷【杀】。';
					target.chooseCard(get.translation(player) + '对你发动了【驳龙】', str, num, 'he').set('ai', card => {
						if (_status.event.canGive) return 5 + Math.max(0, 3 - _status.event.player.hp) / 1.5 - get.value(card);
						return 0;
					}).set('canGive', function () {
						if (get.attitude(target, player) > 1) return true;
						if (!player.hasSha() && player.countCards('h') <= 4) return true;
						var sha = { name: 'sha', nature: 'thunder', isCard: true };
						if (game.hasPlayer(current => {
							return player.canUse(sha, current, true, true) && get.effect(current, sha, player, target) < 0 && !current.countCards('hs', ['shan', 'caochuan']);
						})) return false;
						return true;
					}());
					'step 1'
					if (result.bool) {
						var cards = result.cards;
						target.give(cards, player);
						if (lib.filter.targetEnabled2({ name: 'jiu', isCard: true }, target, player)) target.useCard({ name: 'jiu', isCard: true }, player, false);
						event.finish();
					}
					else {
						player.chooseCard('驳龙：交给' + get.translation(target) + '一张牌', get.translation(target) + '拒绝给牌，请交给其一张牌然后视为对其使用一张雷【杀】', true, 'he');
					}
					'step 2'
					if (result.bool) {
						var cards = result.cards;
						player.give(cards, target);
						var sha = { name: 'sha', nature: 'thunder', isCard: true };
						if (player.canUse(sha, target, false, false)) player.useCard(sha, target, false);
					}
				},
				ai: {
					order: function (item, player) {
						return get.order({ name: 'jiu' }) + 0.01;
					},
					threaten: 2,
					result: {
						target: function (player, target) {
							if (player.hasCard(card => {
								return get.value(card) < 5 && !['shan', 'tao', 'jiu', 'wuxie', 'caochuan'].contains(get.name(card));
							}, 'he')) return -1;
							return 0;
						},
					}
				}
			},
			clanzhongliu: {
				audio: 2,
				audioname: ['clan_wangling', 'clan_wangyun', 'clan_wanghun', 'clan_wangguang', 'clan_wangcheng', 'clan_wangshen'],
				trigger: { player: 'useCard' },
				forced: true,
				clanSkill: true,
				filter: function (event, player) {
					if (!event.cards.length) return true;
					var cards = [];
					game.countPlayer(current => {
						if (!current.hasClan('太原王氏')) return false;
						current.getHistory('lose', evt => {
							if (event != evt.getParent()) return false;
							cards.addArray(evt.getl(current).hs);
						});
					})
					return event.cards.some(card => !cards.contains(card));
				},
				content: function () {
					'step 0'
					var skills = player.getStockSkills(true, true);
					game.expandSkills(skills);
					var resetSkills = [];
					var suffixs = ['used', 'round', 'block', 'blocker'];
					for (var skill of skills) {
						var info = get.info(skill);
						if (typeof info.usable == 'number') {
							if (player.hasSkill('counttrigger') && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
								delete player.storage.counttrigger[skill];
								resetSkills.add(skill);
							}
							if (typeof get.skillCount(skill) == 'number' && get.skillCount(skill) >= 1) {
								delete player.getStat('skill')[skill];
								resetSkills.add(skill);
							}
						}
						if (info.round && player.storage[skill + '_roundcount']) {
							delete player.storage[skill + '_roundcount'];
							resetSkills.add(skill);
						}
						if (player.awakenedSkills.contains(skill)) {
							player.restoreSkill(skill);
							resetSkills.add(skill);
						}
						for (var suffix of suffixs) {
							if (player.hasSkill(skill + '_' + suffix)) {
								player.removeSkill(skill + '_' + suffix);
								resetSkills.add(skill);
							}
						}
					}
					if (resetSkills.length) {
						var str = '';
						for (var i of resetSkills) {
							str += '【' + get.translation(i) + '】、';
						}
						game.log(player, '重置了技能', '#g' + str.slice(0, -1));
					}
				}
			},
			//族吴匡
			clanlianzhu: {
				audio: 2,
				zhuanhuanji: true,
				mark: true,
				marktext: '☯',
				intro: {
					content: function (storage) {
						var str = '转换技，每名角色Ａ的出牌阶段限一次。';
						if (!storage) str += 'Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1。';
						else str += 'Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1';
						return str;
					},
				},
				global: 'clanlianzhu_global',
				subSkill: {
					global: {
						enable: 'phaseUse',
						filter: function (event, player) {
							return game.hasPlayer(current => lib.skill.clanlianzhu_global.filterTarget(null, player, current));
						},
						filterCard: function (card, player) {
							if (!game.hasPlayer(current => {
								if (!current.hasSkill('clanlianzhu') || current.hasSkill('clanlianzhu_targeted')) return false;
								return !current.storage.clanlianzhu;
							})) return false;
							var mod = game.checkMod(card, player, 'unchanged', 'cardChongzhuable', player);
							if (mod != 'unchanged') return mod;
							return true;
						},
						selectCard: [0, 1],
						check: function (card) {
							return 5 - get.value(card);
						},
						filterTarget: function (card, player, target) {
							return target.hasSkill('clanlianzhu') && !target.hasSkill('clanlianzhu_targeted') && (!target.storage.clanlianzhu || target.storage.clanlianzhu && game.hasPlayer(current => {
								if (current == player || current == target) return false;
								return current.inRangeOf(player) || current.inRangeOf(target);
							}));
						},
						selectTarget: function () {
							var player = _status.event.player;
							var count = game.countPlayer(current => lib.skill.clanlianzhu_global.filterTarget(null, player, current));
							return count == 1 ? -1 : 1;
						},
						filterOk: function () {
							var target = ui.selected.targets[0];
							if (!target) return false;
							if (!target.storage.clanlianzhu) {
								return ui.selected.cards.length == 1;
							}
							return ui.selected.cards.length == 0;
						},
						position: 'he',
						discard: false,
						lose: false,
						delay: false,
						prompt: function () {
							var player = _status.event.player;
							var bocchi = [], kita = [];
							game.countPlayer(function (target) {
								if (target.hasSkill('clanlianzhu') && !target.hasSkill('clanlianzhu_targeted')) {
									if (target.storage.clanlianzhu) {
										if (game.hasPlayer(current => {
											if (current == player || current == target) return false;
											return current.inRangeOf(player) || current.inRangeOf(target);
										})) kita.add(target);
									}
									else {
										if (player.countCards('he') > 0) bocchi.add(target);
									}
								}
							});
							bocchi.sortBySeat();
							kita.sortBySeat();
							var str = '';
							var getn = function (target) {
								if (player == target) return '自己';
								return get.translation(target);
							}
							if (bocchi.length) {
								str += '重铸一张牌，然后令';
								bocchi.forEach((current, i) => {
									str += get.translation(current);
									if (i < bocchi.length - 1) str += '或'
								});
								str += '选择是否重铸一张牌';
								if (kita.length) str += '。<br>或者';
							}
							if (kita.length) {
								str += '令';
								kita.forEach((current, i) => {
									str += get.translation(current);
									if (i < kita.length - 1) str += '或'
								});
								str += '选择一名目标，然后对其进行集火';
							}
							str += '。';
							return str;
						},
						content: function () {
							'step 0'
							target.addTempSkill('clanlianzhu_targeted', 'phaseUseAfter');
							if (target.storage.clanlianzhu) event.goto(4);
							target.changeZhuanhuanji('clanlianzhu');
							'step 1'
							player.chongzhu(cards);
							'step 2'
							if (!target.countCards('he') && !_status.connectMode) event._result = { bool: false };
							else target.chooseCard('he', '联诛：是否重铸一张牌？', (card, player) => {
								var mod = game.checkMod(card, player, 'unchanged', 'cardChongzhuable', player);
								if (mod != 'unchanged') return mod;
								return true;
							});
							'step 3'
							if (result.bool) {
								target.chongzhu(result.cards);
								if (get.color(cards[0]) != get.color(result.cards[0])) lib.skill.chenliuwushi.change(target, -1);
							}
							event.finish();
							'step 4'
							target.chooseTarget('联诛：选择其与你使用【杀】的目标', true, (card, player, target) => {
								if (target == player || target == _status.event.sourcex) return false;
								return target.inRangeOf(player) || target.inRangeOf(_status.event.sourcex);
							}).set('ai', target => {
								return get.effect(target, { name: 'sha' }, _status.event.player, _status.event.player);
							}).set('sourcex', player);
							'step 5'
							if (result.bool) {
								var targetx = result.targets[0];
								event.targetx = targetx;
								target.line(targetx);
								event.targets = [player, target];
								event.cards = [];
								if (!event.isMine() && !event.isOnline()) game.delayx();
							}
							else event.finish();
							'step 6'
							var current = targets.shift();
							current.chooseToUse(function (card, player, event) {
								if (get.name(card) != 'sha') return false;
								return lib.filter.filterCard.apply(this, arguments);
							}, '联诛：是否对' + get.translation(event.targetx) + '使用一张杀？').set('targetRequired', true).set('complexSelect', true).set('filterTarget', function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
								return lib.filter.targetEnabled.apply(this, arguments);
							}).set('sourcex', event.targetx).set('addCount', false);
							'step 7'
							if (result.bool) cards.push(result.card);
							if (targets.length > 0) event.goto(6);
							'step 8'
							if (cards.length > 1 && get.color(cards) != 'none') lib.skill.chenliuwushi.change(target, 1);
						},
						ai: {
							order: 4.1,
							result: {
								player: function (player, target) {
									if (!target.storage.clanlianzhu && player.hasCard(card => get.value(card) < 5, 'he')) return 1;
									return 0;
								},
								target: function (player, target) {
									if (target.storage.clanlianzhu && player.hasSha()) return 1;
									return 0;
								}
							}
						}
					},
					targeted: { charlotte: true }
				}
			},
			//族韩韶
			clanfangzhen: {
				audio: 2,
				trigger: { player: 'phaseUseBegin' },
				filter: function (event, player) {
					return game.hasPlayer(current => !current.isLinked());
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt2('clanfangzhen'), (card, player, target) => {
						return !target.isLinked();
					}).set('ai', target => {
						var player = _status.event.player;
						if (_status.event.goon && target != player) {
							target.classList.add('linked');
							target.classList.add('linked2');
							try {
								var cards = player.getCards('hs', cardx => {
									return get.name(cardx) == 'sha' && lib.linked.contains(get.nature(cardx));
								});
								cards.map(i => [i, get.effect(target, i, player, player)]);
								cards.sort((a, b) => b[1] - a[1]);
							}
							catch (e) {
								target.classList.remove('linked');
								target.classList.remove('linked2');
							}
							target.classList.remove('linked');
							target.classList.remove('linked2');
							var eff = cards[0][1];
							if (eff > 0) return eff;
							return Math.max((get.effect(target, { name: 'wuzhong' }, player, player) + get.effect(player, { name: 'wuzhong' }, player, player) / 3), get.recoverEffect(target, player, player));
						}
						return Math.max((get.effect(target, { name: 'wuzhong' }, player, player) + get.effect(player, { name: 'wuzhong' }, player, player) / 3), get.recoverEffect(target, player, player));
					}).set('goon', player.countCards('hs', card => {
						return get.name(card) == 'jiu' && player.hasUseTarget(card);
					}) && player.countCards('hs', card => {
						return get.name(card) == 'sha' && lib.linked.contains(get.nature(card));
					}));
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill('clanfangzhen', target);
						player.addSkill('clanfangzhen_remove');
						player.markAuto('clanfangzhen_remove', [target.getSeatNum()]);
						target.link(true);
						var choices = ['选项一'], choiceList = [
							'摸两张牌，然后交给' + get.translation(target) + '两张牌',
							'令' + get.translation(target) + '回复1点体力'
						];
						if (target.isDamaged()) choices.push('选项二');
						else choiceList[1] = '<span style="opacity:0.5; ">' + choiceList[1] + '</span>';
						player.chooseControl(choices).set('prompt', '放赈：请选择一项').set('choiceList', choiceList).set('ai', () => {
							var player = _status.event.player, target = _status.event.getParent().target;
							if (!target.isDamaged()) return 0;
							if (get.attitude(player, target) <= 0 && player.countCards('he', card => get.value(card) < 0) >= 2) return 0;
							return (get.effect(target, { name: 'wuzhong' }, player, player) + get.effect(player, { name: 'wuzhong' }, player, player) / 3) > get.recoverEffect(target, player, player) ? 0 : 1;
						});
					}
					else event.finish();
					'step 2'
					if (result.control == '选项一') {
						player.draw(2);
						if (player == target) event.finish();
					}
					else {
						target.recover();
						event.finish();
					}
					'step 3'
					if (!player.countCards('he')) event.finish();
					else if (player.countCards('he') <= 2) event._result = { bool: true, cards: player.getCards('he') };
					else {
						player.chooseCard('放赈：交给' + get.translation(target) + '两张牌', 'he', 2, true);
					}
					'step 4'
					if (result.bool) {
						player.give(result.cards, target);
					}
				},
				ai: {
					expose: 0.2,
				},
				subSkill: {
					remove: {
						trigger: { global: 'roundStart' },
						onremove: true,
						forced: true,
						locked: false,
						charlotte: true,
						filter: function (event, player) {
							return player.getStorage('clanfangzhen_remove').contains(game.roundNumber);
						},
						content: function () {
							player.removeSkill('clanfangzhen');
						}
					}
				}
			},
			clanliuju: {
				audio: 2,
				trigger: { player: 'phaseUseEnd' },
				filter: function (event, player) {
					return game.hasPlayer(current => player.canCompare(current));
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt('clanliuju'), '与一名其他角色拼点，输的角色可以使用任意张拼点牌中的非基本牌', (card, player, target) => {
						return player.canCompare(target);
					}).set('ai', target => {
						var player = _status.event.player;
						var ts = target.getCards('h').sort((a, b) => get.number(a) - get.number(b));
						if (get.attitude(player, target) < 0) {
							var hs = player.getCards('h').sort((a, b) => get.number(a) - get.number(b));
							if (!hs.length || !ts.length) return 0;
							if (get.type(hs[0], null, false) == 'basic' && get.value(hs[0]) > 6) return 0;
							if (get.number(hs[0]) < get.number(ts[0]) || get.type(hs[0], null, false) == 'basic') return 1;
							return Math.random() - 0.7;
						}
						return get.type(ts[0]) != 'basic';
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill('clanliuju', target);
						player.chooseToCompare(target).set('small', true);
					}
					else event.finish();
					'step 2'
					if (!result.tie) {
						var loser = result.bool ? target : player;
						var cards = [];
						game.getGlobalHistory('cardMove', evt => {
							if (evt.getParent(2) == event) cards.addArray(evt.cards.filter(i => {
								return get.position(i, true) == 'd' && get.type(i, null, false) != 'basic';
							}));
						});
						event.loser = loser;
						event.distance = [get.distance(player, target), get.distance(target, player)];
						if (cards.length) event.cards = cards;
						else event.finish();
					}
					else event.finish();
					'step 3'
					var cardsx = cards.filter(i => get.position(i, true) == 'd' && event.loser.hasUseTarget(i));
					if (!cardsx.length) event.goto(6);
					else event.loser.chooseButton(['留驹：是否使用其中的一张牌？', cardsx]).set('filterButton', button => {
						return _status.event.player.hasUseTarget(button.link);
					}).set('ai', button => {
						return _status.event.player.getUseValue(button.link) + 0.1;
					});
					'step 4'
					if (result.bool) {
						var card = result.links[0];
						event.cards.remove(card);
						event.loser.$gain2(card, false);
						game.delayx();
						event.loser.chooseUseTarget(true, card, false);
					}
					else event.goto(6);
					'step 5'
					if (cards.filter(i => get.position(i, true) == 'd' && event.loser.hasUseTarget(i)).length) event.goto(3);
					'step 6'
					if (get.distance(player, target) != event.distance[0] || get.distance(target, player) != event.distance[1]) {
						player.restoreSkill('clanxumin');
						game.log(player, '重置了', '#g【恤民】');
					}
				}
			},
			clanxumin: {
				audio: 2,
				audioname: ['clan_hanshao', 'clan_hanrong'],
				enable: 'phaseUse',
				viewAs: { name: 'wugu' },
				filterCard: true,
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return player.canUse(card, target);
				},
				selectTarget: [1, Infinity],
				check: function (card) {
					return 6 - get.value(card);
				},
				position: 'he',
				limited: true,
				clanSkill: true,
				skillAnimation: true,
				animationColor: 'soil',
				precontent: function () {
					player.logSkill('clanxumin');
					player.awakenSkill('clanxumin');
					delete event.result.skill;
				},
				ai: {
					order: 7,
					result: { target: 1 }
				},
			},
			//族韩融
			clanlianhe: {
				audio: 2,
				trigger: { player: 'phaseUseBegin' },
				filter: function (event, player) {
					return game.hasPlayer(current => !current.isLinked());
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt2('clanlianhe'), 2, (card, player, target) => {
						return !target.isLinked();
					}).set('ai', target => {
						var att = get.attitude(_status.event.player, target);
						if (att > 0) att /= 1.2;
						return Math.abs(att);
					});
					'step 1'
					if (result.bool) {
						var targets = result.targets.sortBySeat();
						targets.forEach(i => i.link(true));
						player.logSkill('clanlianhe', targets);
						player.addSkill('clanlianhe_effect');
						player.markAuto('clanlianhe_effect', targets);
					}
				},
				subSkill: {
					effect: {
						trigger: { global: ['phaseUseEnd', 'die'] },
						charlotte: true,
						forced: true,
						locked: false,
						popup: false,
						onremove: true,
						filter: function (event, player) {
							return player.getStorage('clanlianhe_effect').contains(event.player);
						},
						marktext: '连',
						intro: { content: '已选择目标：$' },
						content: function () {
							'step 0'
							player.unmarkAuto('clanlianhe_effect', [trigger.player]);
							if (trigger.name == 'die') event.finish();
							'step 1'
							if (trigger.player.hasHistory('gain', evt => {
								return evt.getParent().name == 'draw' && evt.getParent('phaseUse') == trigger;
							})) event.finish();
							else {
								player.logSkill('clanlianhe_effect', trigger.player);
								var num = 0;
								trigger.player.getHistory('gain', evt => {
									if (evt.getParent('phaseUse') != trigger) return false;
									num += evt.cards.length;
								});
								num = Math.min(num, 3);
								event.num = num;
								if (num <= 1) event._result = { bool: false };
								else {
									var pos = player == trigger.player ? 'e' : 'he';
									trigger.player.chooseCard('连和：交给' + get.translation(player) + get.cnNumber(num - 1) + '张牌，或点“取消”令其摸' + get.cnNumber(num + 1) + '张牌', num - 1, pos).set('ai', card => {
										if (_status.event.draw) return 0;
										return 5 - get.value(card);
									}).set('draw', get.attitude(trigger.player, player) >= 0);
								}
							}
							'step 2'
							if (result.bool) {
								trigger.player.give(result.cards, player);
							}
							else player.draw(num + 1);
						}
					}
				}
			},
			clanhuanjia: {
				audio: 2,
				trigger: { player: 'phaseUseEnd' },
				filter: function (event, player) {
					return game.hasPlayer(current => player.canCompare(current));
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt('clanhuanjia'), '与一名其他角色拼点，赢的角色可以使用一张拼点牌。若此牌未造成过伤害，你获得另一张拼点牌，否则你失去一个技能', (card, player, target) => {
						return player.canCompare(target);
					}).set('ai', target => {
						var player = _status.event.player;
						if (get.attitude(player, target) <= 0) {
							var hs = player.getCards('h').sort((a, b) => get.number(b) - get.number(a));
							var ts = target.getCards('h').sort((a, b) => get.number(b) - get.number(a));
							if (!hs.length || !ts.length) return 0;
							if (get.number(hs[0]) > get.number(ts[0]) && (!get.tag(hs[0], 'damage') && player.hasValueTarget(hs[0]))) return 1;
							return Math.random() - 0.4;
						}
						return 0;
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill('clanhuanjia', target);
						player.chooseToCompare(target);
					}
					else event.finish();
					'step 2'
					if (!result.tie) {
						var winner = result.bool ? player : target;
						var cards = [];
						game.getGlobalHistory('cardMove', evt => {
							if (evt.getParent(3) == event) cards.addArray(evt.cards.filterInD('d'));
						});
						event.winner = winner;
						if (cards.length) event.cards = cards;
						else event.finish();
					}
					else event.finish();
					'step 3'
					var cardsx = cards.filter(i => get.position(i, true) == 'd' && event.winner.hasUseTarget(i));
					if (!cardsx.length) event.goto(6);
					else event.winner.chooseButton(['缓颊：是否使用其中的一张牌？', cardsx]).set('filterButton', button => {
						return _status.event.player.hasUseTarget(button.link);
					}).set('ai', button => {
						var damage = 1;
						if (_status.event.att > 2 && get.tag(button.link, 'damage')) damage *= 2;
						return _status.event.player.getUseValue(button.link) * damage + 0.1;
					}).set('att', get.attitude(event.winner, player));
					'step 4'
					if (result.bool) {
						var card = result.links[0];
						event.card = card;
						event.cards.remove(card);
						event.winner.$gain2(card, false);
						game.delayx();
						event.winner.chooseUseTarget(true, card, false);
					} else {
						event.finish();
					}
					'step 5'
					if (game.hasPlayer2(current => {
						return current.hasHistory('sourceDamage', evt => evt.cards && evt.cards[0] == card);
					})) {
						var skills = player.getSkills(null, false, false).filter(skill => {
							var info = get.info(skill);
							if (!info || get.is.empty(info) || info.charlotte) return false;
							return true;
						});
						player.chooseControl(skills).set('choiceList', skills.map(i => {
							return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
						})).set('displayIndex', false).set('prompt', '恤民：失去一个技能').set('ai', () => {
							var choices = _status.event.controls.slice();
							var value = (skill) => get.skillRank(skill, 'in') + get.skillRank(skill, 'out');
							choices = choices.map(skill => [skill, value(skill)]);
							var list = choices.sort((a, b) => a[1] - b[1])[0];
							if (list[1] < 2) return list[0];
							else {
								if (_status.event.controls.contains('clanxumin')) return 'clanxumin';
								return list[0];
							}
						});
					}
					else {
						player.gain(cards, 'gain2');
						event.finish();
					}
					'step 6'
					player.removeSkill(result.control);
					player.popup(result.control);
					game.log(player, '失去了技能', '#g【' + get.translation(result.control) + '】');
				},
				ai: {
					expose: 0.1,
				}
			},
			//族荀谌
			clansankuang: {
				audio: 2,
				trigger: { player: 'useCardAfter' },
				direct: true,
				forced: true,
				filter: function (event, player) {
					if (!game.hasPlayer(current => current != player)) return false;
					var card = event.card, type = get.type2(card);
					for (var i = player.actionHistory.length - 1; i >= 0; i--) {
						var history = player.actionHistory[i].useCard;
						for (var evt of history) {
							if (evt == event) continue;
							if (get.type2(evt.card) == type) return false;
						}
						if (player.actionHistory[i].isRound) break;
					}
					return true;
				},
				getNum: function (player) {
					return (player.countCards('ej') > 0) + (player.isDamaged()) + (Math.max(0, player.hp) < player.countCards('h'));
				},
				content: function () {
					'step 0'
					var cards = trigger.cards.filterInD('oe');
					player.chooseTarget('三恇：选择一名其他角色', '令其交给你至少X张牌' + (cards.length ? '，然后其获得' + get.translation(cards) : '') + '（X为以下条件中其满足的项数：场上有牌、已受伤、体力值小于手牌数）', true, lib.filter.notMe).set('ai', target => {
						var att = get.attitude(player, target), num = lib.skill.clansankuang.getNum(target);
						if (num == 0) return att;
						if (_status.event.goon) return -att;
						return -Math.sqrt(Math.abs(att)) - lib.skill.clansankuang.getNum(target);
					}).set('goon', Math.max.apply(Math, trigger.cards.map(i => get.value(i))) <= 5 || trigger.cards.filterInD('oe').length == 0)
					'step 1'
					if (result.bool) {
						var target = result.targets[0], num = lib.skill.clansankuang.getNum(target), num2 = target.countCards('he');
						event.target = target;
						player.logSkill('clansankuang', target);
						if (num == 0 || num2 == 0) event._result = { bool: false };
						else if (num2 <= num) event._result = { bool: true, cards: target.getCards('he') };
						else target.chooseCard('he', true, [num, Infinity]).set('ai', get.unuseful).set('prompt', '交给' + get.translation(player) + '至少' + get.cnNumber(num) + '张牌');
					} else event.finish();
					'step 2'
					if (result.bool) {
						var cards = result.cards;
						target.give(cards, player);
						game.delayx();
					}
					'step 3'
					if (trigger.cards.filterInD().length) target.gain(trigger.cards.filterInD(), 'gain2', 'bySelf');
					else if (trigger.cards.filterInD('e').length) target.gain(trigger.cards.filterInD('e'), get.owner(trigger.cards.filterInD('e')[0]), 'give');
				},
				ai: {
					reverseOrder: true,
					skillTagFilter: function (player) {
						if (player.getHistory('useCard', evt => get.type(evt.card) == 'equip').length > 0) return false;
					},
					effect: {
						target: function (card, player, target) {
							if (player == target && get.type(card) == 'equip' && !player.getHistory('useCard', evt => get.type(evt.card) == 'equip').length == 0) return [1, 3];
						},
					},
					threaten: 1.6,
				},
			},
			clanbeishi: {
				audio: 2,
				trigger: {
					global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
				},
				forced: true,
				filter: function (event, player) {
					var history = player.getAllHistory('useSkill', evt => evt.skill == 'clansankuang');
					if (!history.length) return false;
					var target = history[0].targets[0];
					if (target && target.countCards('h')) return false;
					var evt = event.getl(target);
					return evt && evt.hs && evt.hs.length;
				},
				content: function () {
					player.recover();
				}
			},
			//族荀淑
			clanshenjun: {
				audio: 2,
				trigger: {
					global: 'useCard',
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					return (event.card.name == 'sha' || get.type(event.card) == 'trick') && player.countCards('h', event.card.name) > 0;
				},
				content: function () {
					var cards = player.getCards('h', trigger.card.name);
					player.showCards(cards, get.translation(player) + '发动了【神君】');
					player.markSkill('clanshenjun');
					player.addGaintag(cards, 'clanshenjun');
					for (var name of lib.phaseName) {
						var evt = _status.event.getParent(name);
						if (!evt || evt.name != name) continue;
						player.addTempSkill('clanshenjun_viewAs', name + 'After');
						break;
					}
				},
				marktext: '君',
				intro: {
					markcount: function (storage, player) {
						return player.countCards('h', card => card.hasGaintag('clanshenjun'));
					},
					mark: function (dialog, content, player) {
						var cards = player.getCards('h', card => card.hasGaintag('clanshenjun'));
						if (cards.length) {
							dialog.addAuto(cards);
						}
						else return '无展示牌';
					},
				},
				subSkill: {
					viewAs: {
						trigger: { global: ['phaseZhunbeiEnd', 'phaseJudgeEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd', 'phaseJieshuEnd'] },
						filter: function (event, player) {
							return player.countCards('h', card => card.hasGaintag('clanshenjun')) > 0;
						},
						forced: true,
						charlotte: true,
						content: function () {
							'step 0'
							var cards = player.getCards('h', card => card.hasGaintag('clanshenjun'));
							var list = [], names = [];
							for (var card of cards) {
								var name = get.name(card), nature = get.nature(card);
								var namex = name + (nature ? nature : '');
								if (names.contains(namex)) continue;
								if (nature) list.push([get.type(card), '', name, nature]);
								else list.push([get.type(card), '', name]);
								names.push(namex);
							}
							list.sort((a, b) => {
								return 100 * (lib.inpile.indexOf(a[2]) - lib.inpile.indexOf(b[2])) + lib.inpile_nature.indexOf(a[3]) - lib.inpile_nature.indexOf(b[3]);
							})
							player.chooseButton(['是否将' + get.cnNumber(cards.length) + '张牌当下列一张牌使用？', [list, 'vcard']]).set('ai', function (button) {
								return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3] });
							});
							'step 1'
							if (result.bool) {
								var name = result.links[0][2], nature = result.links[0][3];
								var cards = player.getCards('h', card => card.hasGaintag('clanshenjun'));
								game.broadcastAll(function (num, card) {
									lib.skill.clanshenjun_backup.selectCard = num;
									lib.skill.clanshenjun_backup.viewAs = card;
								}, cards.length, { name: name, nature: nature });
								var next = player.chooseToUse();
								next.set('openskilldialog', '将' + get.cnNumber(cards.length) + '张牌当做' + (nature ? get.translation(nature) : '') + '【' + get.translation(name) + '】使用');
								next.set('norestore', true);
								next.set('addCount', false);
								next.set('_backupevent', 'clanshenjun_backup');
								next.set('custom', {
									add: {},
									replace: { window: function () { } }
								});
								next.backup('clanshenjun_backup');
							}
						}
					},
					backup: {
						filterCard: function (card) {
							return get.itemtype(card) == 'card';
						},
						position: 'hes',
						filterTarget: lib.filter.filterTarget,
						check: (card) => 6 - get.value(card),
						log: false,
						precontent: function () {
							delete event.result.skill;
						},
					}
				}
			},
			clanbalong: {
				audio: 2,
				trigger: {
					player: ['damageEnd', 'recoverEnd', 'loseHpEnd'],
				},
				forced: true,
				filter: function (event, player) {
					if (game.getGlobalHistory('changeHp', evt => evt.player == player).length != 1) return false;
					var cards = player.getCards('h'), map = {};
					if (!cards.length) return false;
					for (var card of cards) {
						var type = get.type2(card);
						if (typeof map[type] != 'number') map[type] = 0;
						map[type]++;
					}
					var list = [];
					for (var i in map) {
						if (map[i] > 0) list.push([i, map[i]]);
					}
					list.sort((a, b) => b[1] - a[1]);
					return list[0][0] == 'trick' && (list.length == 1 || list[0][1] > list[1][1]);
				},
				content: function () {
					player.showHandcards(get.translation(player) + '发动了【八龙】');
					player.drawTo(game.countPlayer());
				}
			},
			//族荀粲
			clanyunshen: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filterTarget: function (card, player, target) {
					return player != target && target.isDamaged();
				},
				content: function () {
					'step 0'
					target.recover();
					'step 1'
					var name = get.translation(target);
					player.chooseControl().set('choiceList', [name + '视为对你使用一张冰【杀】', '你视为对' + name + '使用一张冰【杀】']).set('prompt', '熨身：请选择一项').set('ai', () => _status.event.choice).set('choice', function () {
						var card = { name: 'sha', nature: 'ice', isCard: true };
						var eff = get.effect(player, card, target, player), eff2 = get.effect(target, card, player, player);
						if (eff > eff2) return '选项一';
						else return '选项二';
					}());
					'step 2'
					var players = [target, player];
					if (result.control == '选项二') players.reverse();
					var card = { name: 'sha', nature: 'ice', isCard: true };
					if (players[0].canUse(card, players[1], false)) players[0].useCard(card, players[1], false, 'noai');
				},
				ai: {
					order: 2,
					expose: 0.2,
					result: {
						target: function (player, target) {
							var eff = get.recoverEffect(target, player, player);
							if (eff > 0) return 1;
							else if (get.effect(target, { name: 'sha', nature: 'ice', isCard: true }, player, player) > eff) return -1;
							return 0;
						}
					}
				}
			},
			clanshangshen: {
				audio: 2,
				trigger: { global: 'damageEnd' },
				filter: function (event, player) {
					if (!event.nature || !event.player.isIn()) return false;
					return game.countPlayer2(current => {
						return current.hasHistory('damage', evt => {
							return evt.nature && evt != event;
						});
					}) == 0;
				},
				logTarget: 'player',
				check: function (event, player) {
					if (get.attitude(player, event.player) <= 2) return false;
					if (event.player.countCards('h') >= 4) return false;
					return true;
				},
				content: function () {
					'step 0'
					event.judgestr = get.translation('shandian');
					player.judge(lib.card.shandian.judge, event.judgestr).judge2 = lib.card.shandian.judge2;
					game.delayx(1.5);
					'step 1'
					var name = 'shandian';
					if (event.cancelled && !event.direct) {
						if (lib.card[name].cancel) {
							var next = game.createEvent(name + 'Cancel');
							next.setContent(lib.card[name].cancel);
							next.cards = [];
							next.card = get.autoViewAs({ name: name });
							next.player = player;
						}
					}
					else {
						var next = game.createEvent(name);
						next.setContent(function () {
							if (result.bool == false) {
								player.damage(3, 'thunder', 'nosource');
							}
						});
						next._result = result;
						next.cards = [];
						next.card = get.autoViewAs({ name: name });
						next.player = player;
					}
					'step 2'
					trigger.player.drawTo(4);
				},
				ai: { expose: 0.25 }
			},
			clanfenchai: {
				audio: 2,
				init: function (player) {
					if (player.getStorage('clanfenchai').length > 0) return;
					var history = player.getHistory('useSkill', evt => {
						if (evt.type != 'player') return false;
						var skill = evt.sourceSkill || evt.skill, targets = evt.targets;
						var info = get.info(skill);
						if (!info || info.charlotte) return false;
						if (targets && targets.length) {
							if (targets.filter(i => player.differentSexFrom(i)).length > 0) return true;
						}
						return false;
					});
					if (history.length) {
						var evt = history[0], targets = evt.targets;
						player.markAuto('clanfenchai', targets.filter(i => player.differentSexFrom(i)));
					}
				},
				trigger: {
					player: ['logSkill', 'useSkillAfter'],
				},
				forced: true,
				silent: true,
				onremove: true,
				marktext: '钗',
				intro: {
					content: (storage, player) => '对象：' + get.translation(storage),
				},
				group: 'clanfenchai_audio',
				filter: function (event, player) {
					if (event.type != 'player') return false;
					var targets = event.targets;
					if (!targets || !targets.length) return false;
					var info = get.info(event.sourceSkill || event.skill);
					if (!info || info.charlotte) return false;
					if (player.getStorage('clanfenchai').length != 0) return false;
					return targets.filter(i => player.differentSexFrom(i)).length > 0;
				},
				content: function () {
					player.markAuto('clanfenchai', trigger.targets.filter(i => player.differentSexFrom(i)));
				},
				subSkill: {
					audio: {
						audio: 'clanfenchai',
						forced: true,
						trigger: { player: 'judge' },
						filter: function (event, player) {
							return player.getStorage('clanfenchai').length;
						},
						content: function () { }
					}
				},
				mod: {
					suit: function (card, suit) {
						var player = get.owner(card) || _status.event.player;
						if (!player || !player.judging || player.judging[0] != card) return;
						var storage = player.getStorage('clanfenchai');
						if (!storage.length) return;
						return storage.filter(i => i.isIn()).length > 0 ? 'heart' : 'spade';
					}
				}
			},
			//族荀采
			clanlieshi: {
				audio: 2,
				enable: 'phaseUse',
				filter: function (event, player) {
					return !player.storage._disableJudge || player.countCards('h', card => ['sha', 'shan'].contains(get.name(card))) > 0;
				},
				chooseButton: {
					dialog: function (event, player) {
						var dialog = ui.create.dialog('烈誓：选择一项', 'hidden');
						dialog.add([lib.skill.clanlieshi.choices.slice(), 'textbutton']);
						return dialog;
					},
					filter: function (button, player) {
						var link = button.link;
						if (link == 'damage') return !player.storage._disableJudge;
						var num = player.countCards('h', link);
						return num > 0 && num == player.getDiscardableCards(player, 'h').filter(i => get.name(i) == link).length;
					},
					check: function (button) {
						var player = _status.event.player;
						switch (button.link) {
							case 'damage':
								if (get.damageEffect(player, player, player, 'fire') >= 0) return 10;
								if (player.hp >= Math.max(2, 3 - player.getFriends().length) && game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards('h', card => ['sha', 'shan'].contains(get.name(card))))) return 0.8 + Math.random();
								return 0;
							case 'shan':
								if (player.countCards('h', 'shan') == 1) return 8 + Math.random();
								return 1 + Math.random();
							case 'sha':
								if (player.countCards('h', 'sha') == 1) return 8 + Math.random();
								return 0.9 + Math.random();
						}
					},
					backup: function (links) {
						var next = get.copy(lib.skill['clanlieshi_backupx']);
						next.choice = links[0];
						return next;
					},
					prompt: function (links) {
						if (links[0] == 'damage') return '废除判定区并受到1点火焰伤害';
						return '弃置所有【' + get.translation(links[0]) + '】';
					},
				},
				choices: [
					['damage', '废除判定区并受到1点火焰伤害'],
					['shan', '弃置所有【闪】'],
					['sha', '弃置所有【杀】'],
				],
				ai: {
					order: function (item, player) {
						if (!player) return;
						var eff = get.damageEffect(player, player, player, 'fire'), disabled = !player.storage._disableJudge;
						if ((player.countCards('h', 'sha') == 1 || player.countCards('h', 'shan') == 1) && eff < 0 && !disabled) return 8;
						else if (eff >= 0 && !disabled) return 5.8;
						if (!disabled && !player.countCards('h', card => ['sha', 'shan'].contains(get.name(card)))) {
							if ((!player.hasSkill('clanhuanyin') || !player.canSave(player)) && player.hp <= 1) return 0;
							if (player.canSave(player) && player.hp == 1 && player.countCards('h') <= 1) return 2.6;
							if (player.hp < Math.max(2, 3 - player.getFriends().length) || !game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards('h', card => ['sha', 'shan'].contains(get.name(card))))) return 0;
						}
						return 2.5;
					},
					expose: 0.2,
					result: { player: 1 },
				},
				subSkill: {
					backup: {},
					backupx: {
						audio: 'clanlieshi',
						selectCard: -1,
						selectTarget: -1,
						filterCard: () => false,
						filterTarget: () => false,
						multitarget: true,
						content: function () {
							'step 0'
							var choice = lib.skill.clanlieshi_backup.choice;
							event.choice = choice;
							if (choice == 'damage') {
								player.damage('fire');
								if (!player.storage._disableJudge) player.disableJudge();
							} else {
								var cards = player.getCards('h', choice);
								if (cards.length) player.discard(cards);
							}
							'step 1'
							if (!player.isIn() || !game.hasPlayer(current => current != player)) event.finish();
							else player.chooseTarget('烈誓：令一名其他角色选择另一项', lib.filter.notMe, true).set('ai', target => {
								var player = _status.event.player, chosen = _status.event.getParent().choice, att = get.attitude(player, target);
								if (chosen == 'damage') {
									if (att > 0) return 0;
									return -att / 2 + target.countCards('h', card => ['sha', 'shan'].contains(get.name(card)));
								}
								return get.damageEffect(target, player, player, 'fire');
							});
							'step 2'
							if (result.bool) {
								var target = result.targets[0];
								event.target = target;
								player.line(target, 'fire');
								var list = [], choice = event.choice;
								var choiceList = lib.skill.clanlieshi.choices.slice();
								choiceList = choiceList.map((link, ind, arr) => {
									link = link[1];
									var ok = true;
									if (arr[ind][0] == choice) {
										link += '（' + get.translation(player) + '已选）';
										ok = false;
									}
									if (ind == 0) {
										if (target.storage._disableJudge) ok = false;
									}
									else if (ind > 0) {
										var name = ind == 1 ? 'shan' : 'sha';
										if (!target.countCards('h', name)) ok = false;
									}
									if (!ok) link = '<span style="opacity:0.5">' + link + '</span>';
									else list.push('选项' + get.cnNumber(ind + 1, true));
									return link;
								});
								if (!list.length) { event.finish(); return; }
								target.chooseControl(list).set('choiceList', choiceList).set('ai', () => {
									var controls = _status.event.controls.slice(), player = _status.event.player, user = _status.event.getParent().player;
									if (controls.length == 1) return controls[0];
									if (controls.contains('选项一') && get.damageEffect(player, user, player, 'fire') >= 0) return '选项一';
									if (controls.contains('选项一') && player.hp <= 2 && player.countCards('h', card => ['sha', 'shan'].contains(get.name(card))) <= 3) controls.remove('选项一');
									if (controls.length == 1) return controls[0];
									if (player.getCards('h', 'sha').reduce((p, c) => p + get.value(c, player), 0) > player.getCards('h', 'sha').reduce((p, c) => p + get.value(c, player), 0)) {
										if (controls.contains('选项三')) return '选项三';
									}
									else if (controls.contains('选项二')) return '选项二';
									return controls.randomGet();
								});
							} else event.finish();
							'step 3'
							if (result.control == '选项一') {
								if (!target.storage._disableJudge) target.disableJudge();
								target.damage('fire');
							}
							else {
								var cards = target.getCards('h', result.control == '选项二' ? 'shan' : 'sha');
								if (cards.length) target.discard(cards);
							}
						}
					}
				}
			},
			clandianzhan: {
				audio: 2,
				trigger: { player: 'useCardAfter' },
				forced: true,
				filter: function (event, player) {
					if (!lib.suit.contains(get.suit(event.card))) return false;
					var card = event.card, suit = get.suit(card);
					for (var i = player.actionHistory.length - 1; i >= 0; i--) {
						var history = player.actionHistory[i].useCard;
						for (var evt of history) {
							if (evt == event) continue;
							if (get.suit(evt.card) == suit) return false;
						}
						if (player.actionHistory[i].isRound) break;
					}
					return event.targets && event.targets.length == 1 && (!event.targets[0].isLinked() ||
						player.getCards('h', card => get.suit(card) == get.suit(event.card)).filter(card => {
							var mod = game.checkMod(card, player, 'unchanged', 'cardChongzhuable', player);
							if (mod != 'unchanged') return true;
							return false;
						}).length == 0);
				},
				content: function () {
					'step 0'
					if (trigger.targets && trigger.targets.length == 1) {
						trigger.targets[0].link(true);
					}
					var cards = player.getCards('h', card => get.suit(card) == get.suit(trigger.card));
					if (cards.length > 0) {
						player.loseToDiscardpile(cards);
						player.draw(cards.length);
					}
					'step 1'
					player.draw();
				}
			},
			clanhuanyin: {
				audio: 2,
				trigger: { player: 'dying' },
				forced: true,
				check: () => true,
				filter: function (event) {
					return event.player.countCards('h') < 4;
				},
				content: function () {
					player.drawTo(4);
				}
			},
			clandaojie: {
				audio: 2,
				audioname: ['clan_xunshu', 'clan_xunchen', 'clan_xuncai', 'clan_xuncan', 'clan_xunyou'],
				trigger: { player: 'useCardAfter' },
				filter: function (event, player) {
					return get.type(event.card, null, false) == 'trick' && !get.tag(event.card, 'damage') && event.cards.filterInD().length > 0 && player.getHistory('useCard', evt => {
						return get.type(evt.card, null, false) == 'trick' && !get.tag(evt.card, 'damage');
					}).indexOf(event) == 0;
				},
				forced: true,
				clanSkill: true,
				content: function () {
					'step 0'
					var skills = player.getSkills(null, false, false).filter(skill => {
						var info = get.info(skill);
						if (!info || info.charlotte || !get.is.locked(skill) || get.skillInfoTranslation(skill, player).length == 0) return false;
						return true;
					});
					player.chooseControl(skills, 'cancel2').set('choiceList', skills.map(i => {
						return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
					})).set('displayIndex', false).set('prompt', '蹈节：失去一个锁定技，或点“取消”失去1点体力').set('ai', () => {
						var player = _status.event.player, choices = _status.event.controls.slice();
						var negs = choices.filter(i => {
							var info = get.info(i);
							if (!info || !info.ai) return false;
							return info.ai.neg || info.ai.halfneg;
						});
						if (negs.length) return negs.randomGet();
						if (get.effect(player, { name: 'losehp' }, player, player) >= 0) return 'cancel2';
						if (player.hp > 3) return 'cancel2';
						return Math.random() < 0.75 ? 'clandaojie' : choices.randomGet();
					});
					'step 1'
					if (result.control != 'cancel2') {
						player.removeSkill(result.control);
						player.popup(result.control);
						game.log(player, '失去了技能', '#g【' + get.translation(result.control) + '】');
					}
					else {
						player.loseHp();
					}
					'step 2'
					var targets = game.filterPlayer(current => current == player || current.hasClan('颍川荀氏'));
					if (targets.length == 1) event._result = { bool: true, targets: targets };
					else player.chooseTarget('蹈节：将' + get.translation(trigger.cards.filterInD()) + '交给一名颍川荀氏角色', true, (card, player, target) => {
						return target == player || target.hasClan('颍川荀氏')
					}).set('ai', target => get.attitude(_status.event.player, target));
					'step 3'
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, 'green');
						target.gain(trigger.cards.filterInD(), player, 'gain2');
					}
				},
			},
			//族吴班
			clanzhanding: {
				audio: 2,
				enable: 'chooseToUse',
				viewAsFilter: function (player) {
					return player.countCards('hes') > 0;
				},
				viewAs: { name: 'sha' },
				filterCard: true,
				position: 'hes',
				selectCard: [1, Infinity],
				check: function (card) {
					return 6 - ui.selected.cards.length - get.value(card);
				},
				onuse: function (links, player) {
					player.addTempSkill('clanzhanding_effect');
				},
				ai: {
					order: 1,
					respondSha: true,
					skillTagFilter: function (player) {
						return player.countCards('hes') > 0;
					},
				},
				subSkill: {
					effect: {
						trigger: { player: 'useCardAfter' },
						forced: true,
						popup: false,
						filter: function (event, player) {
							return event.skill == 'clanzhanding';
						},
						content: function () {
							lib.skill.chenliuwushi.change(player, -1);
							if (player.hasHistory('sourceDamage', function (evt) {
								return evt.card == trigger.card;
							})) {
								var num1 = player.countCards('h'), num2 = player.getHandcardLimit();
								if (num1 < num2) player.draw(Math.min(5, num2 - num1));
							}
							else if (trigger.addCount !== false) {
								trigger.addCount = false;
								player.getStat().card.sha--;
							}
						},
					},
				},
			},
			//族吴苋
			clanyirong: {
				audio: 2,
				enable: 'phaseUse',
				usable: 2,
				filter: function (event, player) {
					var num1 = player.countCards('h'), num2 = player.getHandcardLimit();
					return num1 != num2;
				},
				selectCard: function () {
					var player = _status.event.player;
					var num1 = player.countCards('h'), num2 = player.getHandcardLimit();
					if (num1 > num2) return num1 - num2;
					return [0, 1];
				},
				filterCard: function (card, player) {
					var num1 = player.countCards('h'), num2 = player.getHandcardLimit();
					return num1 > num2;
				},
				check: function (card) {
					var player = _status.event.player;
					if (player.countCards('h', function (card) {
						return lib.skill.clanyirong.checkx(card) > 0;
					}) + 1 < (player.countCards('h') - player.getHandcardLimit())) return 0;
					return lib.skill.clanyirong.checkx(card);
				},
				checkx: function (card) {
					var num = 1;
					if (_status.event.player.getUseValue(card, null, true) <= 0) num = 1.5;
					return (15 - get.value(card)) * num;
				},
				prompt: function () {
					var player = _status.event.player;
					var num1 = player.countCards('h'), num2 = player.getHandcardLimit();
					var str = '<span class="text center">';
					if (num1 > num2) {
						str += ('弃置' + get.cnNumber(num1 - num2) + '张牌，然后手牌上限+1。')
					}
					else {
						str += ('摸' + get.cnNumber(Math.min(8, num2 - num1)) + '张牌，然后手牌上限-1。');
					}
					str += ('<br>※当前手牌上限：' + num2);
					var num3 = player.countMark('clanguixiang_count');
					if (num3 > 0) {
						str += ('；阶段数：' + num3)
					}
					str += '</span>';
					return str;
				},
				content: function () {
					'step 0'
					if (cards.length) {
						lib.skill.chenliuwushi.change(player, 1);
						event.finish();
					}
					else {
						var num1 = player.countCards('h'), num2 = player.getHandcardLimit();
						if (num1 < num2) player.draw(Math.min(8, num2 - num1));
					}
					'step 1'
					lib.skill.chenliuwushi.change(player, -1);
				},
				ai: {
					order: function (item, player) {
						var num = player.getHandcardLimit(), numx = player.countMark('clanguixiang_count');
						if (num == 5 && numx == 4 && player.getStat('skill').clanyirong) return 0;
						if (player.countCards('h') == num + 1 && num != 2 && (num <= 4 || num > 4 && numx > 4)) return 10;
						return 0.5;
					},
					result: { player: 1 },
					threaten: 5,
				},
			},
			clanguixiang: {
				audio: 2,
				init: function (player) {
					player.addSkill('clanguixiang_count');
				},
				onremove: function (player) {
					player.removeSkill('clanguixiang_count');
					var event = _status.event.getParent('phase');
					if (event) delete event._clanguixiang;
				},
				trigger: {
					player: ['phaseZhunbeiBefore', 'phaseJudgeBefore', 'phaseDrawBefore', 'phaseDiscardBefore', 'phaseJieshuBefore'],
				},
				forced: true,
				filter: function (event, player) {
					var evt = event.getParent('phase');
					if (!evt || !evt._clanguixiang) return false;
					var num1 = player.getHandcardLimit() - 1, num2 = player.countMark('clanguixiang_count');
					return num1 == num2;
				},
				content: function () {
					trigger.cancel(null, null, 'notrigger');
					var next = player.phaseUse();
					event.next.remove(next);
					trigger.getParent().next.unshift(next);
				},
				subSkill: {
					count: {
						trigger: {
							player: ['phaseZhunbeiBegin', 'phaseJudgeBegin', 'phaseDrawBegin', 'phaseDiscardBegin', 'phaseJieshuBegin', 'phaseUseBegin'],
						},
						forced: true,
						popup: false,
						lastDo: true,
						priority: -Infinity,
						content: function () {
							player.addMark('clanguixiang_count', 1, false);
						},
						group: 'clanguixiang_clear',
					},
					clear: {
						trigger: { player: 'phaseBefore' },
						forced: true,
						charlotte: true,
						popup: false,
						firstDo: true,
						priority: Infinity,
						content: function () {
							delete player.storage.clanguixiang_count;
							trigger._clanguixiang = true;
						},
					},
				},
			},
			clanmuyin: {
				audio: 2,
				clanSkill: true,
				audioname: ['clan_wuxian', 'clan_wuban', 'clan_wukuang', 'clan_wuqiao'],
				trigger: { player: 'phaseZhunbeiBegin' },
				isMax: function (player) {
					var num = player.getHandcardLimit();
					return !game.hasPlayer(function (current) {
						return current != player && current.getHandcardLimit() > num;
					});
				},
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return (current == player || current.hasClan('陈留吴氏')) && !lib.skill.clanmuyin.isMax(current);
					});
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt('clanmuyin'), '令一名陈留吴氏角色的手牌上限+1', function (card, player, current) {
						return (current == player || current.hasClan('陈留吴氏')) && !lib.skill.clanmuyin.isMax(current);
					}).set('ai', function (target) {
						return get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill('clanmuyin', target);
						lib.skill.chenliuwushi.change(target, 1);
						game.delayx();
					}
				},
			},
			chenliuwushi: {
				charlotte: true,
				change: function (player, num) {
					player.addSkill('chenliuwushi');
					var info = player.storage;
					if (typeof info.chenliuwushi != 'number') info.chenliuwushi = 0;
					info.chenliuwushi += num;
					if (info.chenliuwushi == 0) player.unmarkSkill('chenliuwushi');
					else player.markSkill('chenliuwushi');
					if (num >= 0) game.log(player, '的手牌上限', '#y+' + num);
					else game.log(player, '的手牌上限', '#g' + num);
				},
				mod: {
					maxHandcard: function (player, num) {
						var add = player.storage.chenliuwushi;
						if (typeof add == 'number') return num + add;
					},
				},
				markimage: 'image/card/handcard.png',
				intro: {
					content: function (num, player) {
						var str = '<li>手牌上限';
						if (num >= 0) str += '+';
						str += num;
						str += '<br><li>当前手牌上限：';
						str += player.getHandcardLimit();
						return str;
					},
				},
			},
			clanbaichu: {
				audio: 2,
				trigger: {
					player: "useCardAfter",
				},
				derivation: "qice",
				forced: true,
				direct: true,
				init: function (player) {
					player.storage.clanbaichu = {};
				},
				content: function () {
					'step 0'
					var suitType = [get.suit(trigger.card), get.type2(trigger.card)];
					var map = player.getStorage('clanbaichu');
					var mapV = Object.values(map).map(arr => arr.toString());
					if (mapV.includes(suitType.toString())) {
						if (!player.hasSkill('qice')) player.addTempSkill('qice', 'roundFinish');
					}
					else if (get.suit(trigger.card) != 'none') {
						event.suitType = suitType;
						var dialog = [get.prompt('clanbaichu')],
							list2 = lib.inpile.filter(function (i) {
								return get.type2(i, false) == 'trick' && !map.hasOwnProperty(i) && get.type(i, false) != 'delay';
							});
						if (list2.length) {
							dialog.push('<div class="text center">未记录</div>');
							dialog.push([list2, 'vcard']);
						}
						player.chooseButton(dialog).set('ai', function (button) {
							var player = _status.event.player, name = button.link[2];
							return get.effect(player, { name: name }, player, player) * (1 + player.countCards('hs', name));
						});
					}
					'step 1'
					if (result.bool) {
						player.logSkill('clanbaichu_mark');
						var name = result.links[0][2];
						player.storage.clanbaichu[name] = event.suitType;
						game.log(player, '记录了', '#y' + get.translation(name));
					}
					'step 2'
					if (player.storage.clanbaichu.hasOwnProperty(trigger.card.name)) player.chooseDrawRecover('###' + get.prompt('clanbaichu') + '###摸一张牌或回复1点体力', 1, true).logSkill = 'clanbaichu';
				},
				mark: true,
				marktext: "百出",
				intro: {
					name: '【百出】已记录',
					content: function (storage, player) {
						var str = '';
						for (var key in storage) {
							str += get.translation(key) + '：' + get.translation(storage[key]);
							str += '<br>';
						}
						return str;
					},
				},
			},
		}
};
}
