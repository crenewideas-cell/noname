// Extracted from character/sb.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
			sb_handang: ["male", "wu", 4, ["sbgongji", "sbjiefan"]],
			sb_sp_zhugeliang: ["male", "shu", 3, ["sb_huoji", "sb_kanpo"], ['transform:[sb_sp_zhugeliang,sb_zhugeliang]']],
			sb_zhugeliang: ['male', 'shu', 3, ['sb_guanxing', 'sb_kongcheng'], ['unseen', 'transform:[sb_sp_zhugeliang,sb_zhugeliang]']],
			sb_yl_luzhi: ['male', 'qun', 3, ['sbmingren', 'sbzhenliang']],
			sb_zhanghe: ['male', 'wei', 4, ['sbqiaobian']],
			sp_yangwan: ['female', 'qun', 3, ['spmingxuan', 'spxianchou']],
			sb_chengong: ['male', 'qun', 3, ['sbmingce', 'sbzhichi']],
		},
"characterSort": {
			sb: {
				sb_zhi: [],
				sb_shi: [ 'sb_chengong', 'sb_sp_zhugeliang', 'sb_handang'],
				sb_tong: [ 'sp_yangwan'],
				sb_yu: [ 'sb_yl_luzhi'],
				sb_neng: [ 'sb_zhanghe'],
			}
		},
"characterPrefix": {
			sb_yl_luzhi: '谋',
			sp_yangwan: '谋',
		},
"dynamicTranslate": {
			sbkeji: function (player) {
				return '①出牌阶段' + (player.storage.sbkeji ? '' : '各') + '限一次。你可以选择一项：1.弃置一张手牌，然后获得1点护甲；2.失去1点体力，然后获得2点护甲。②你的手牌上限+X（X为你的护甲数）。③若你不为正在结算濒死流程的角色，你不能使用【桃】。';
			},
			sblongdan: function (player) {
				if (player.hasSkill('sblongdan_mark', null, null, false)) return '蓄力技（1/3）。①你可以消耗1点蓄力值，将一张基本牌当做任意基本牌使用或打出，然后摸一张牌。②一名角色的回合结束时，你获得1点蓄力值。';
				return '蓄力技（1/3）。①你可以消耗1点蓄力值，将【杀】当做【闪】或将【闪】当做【杀】使用或打出，然后摸一张牌。②一名角色的回合结束时，你获得1点蓄力值。';
			},
			sblianhuan: function (player) {
				var str = '①出牌阶段，你可以重铸一张♣手牌。②出牌阶段限一次。你可以将一张♣手牌当【铁索连环】使用。';
				if (!player.storage.sblianhuan) str += '③当你使用【铁索连环】时，你可以失去1点体力，然后当此牌指定第一个目标后，你随机弃置每名不处于连环状态的目标角色一张手牌。';
				else str += '③当你使用【铁索连环】时，你可以额外指定任意名角色为目标。④当你使用【铁索连环】指定第一个目标后，你随机弃置每名不处于连环状态的目标角色一张手牌。';
				return str;
			},
			sbjiang: function (player) {
				var str = '①当你使用【决斗】或红色【杀】指定目标后，或当你成为【决斗】或红色【杀】的目标后，你摸一张牌。②当你使用【决斗】时，你可以额外指定一名目标，然后你失去1点体力。③出牌阶段限';
				if (player.countMark('sbjiang')) str += 'X次。你可以将所有手牌当【决斗】使用（X为场上其他吴势力角色数+1）。';
				else str += '一次。你可以将所有手牌当【决斗】使用。';
				return str;
			},
			sbfangzhu: function (player) {
				if (get.mode() != 'doudizhu') return '出牌阶段限一次，若你有“行殇”，你可以选择一名其他角色，移去任意数量的“颂”令其执行对应的一个选项：<li>1枚：<br>直到其下回合结束，其不能使用除基本牌以外的手牌<li>2枚：直到其下回合结束<br>①其不可响应另一名角色使用的牌<br>②其不能使用除锦囊牌以外的手牌<li>3枚：<br>①其翻面<br>②直到其下回合结束，其不能使用除装备牌以外的手牌。';
				return '出牌阶段限一次，若你有“行殇”，你可以选择一名其他角色，移去任意数量的“颂”令其执行对应的一个选项：<li>1枚：<br>直到其下回合结束，其不能使用除基本牌以外的手牌<li>2枚：直到其下回合结束<br>①其不可响应另一名角色使用的牌<br>②其不能使用除锦囊牌以外的手牌<li>3枚<br>①其翻面<br>②直到其下回合结束，其不能使用除装备牌以外的手牌。';
			},
		},
"translate": {
			sp_yangwan: '谋杨婉',
			spmingxuan: '瞑昡',
			spmingxuan_info: '锁定技，出牌阶段开始时，你须选择至多X张花色各不相同的手牌（X为未选择过选项一的角色），将这些牌随机交给这些角色中的等量角色。然后这些角色依次选择一项：⒈对你使用一张【杀】。⒉交给你一张牌，然后你摸一张牌。',
			spxianchou: '陷仇',
			spxianchou_info: '当你受到有来源的伤害后，你可选择一名不为伤害来源的其他角色。该角色可以弃置一张牌，然后视为对伤害来源使用一张【杀】（无距离限制）。若其因此【杀】造成了伤害，则其摸一张牌，你回复1点体力。',
			liucheng: '谋刘赪',
			splveying: '掠影',
			splveying_info: '锁定技，①每回合限两次，当你使用【杀】指定目标后，你获得一个“椎”。②当你使用的【杀】结算结束后，若你的“椎”数大于1，则你弃置两个“椎”并摸一张牌，然后可以视为使用一张【过河拆桥】。',
			spyingwu: '莺舞',
			spyingwu_info: '若你拥有〖掠影〗，则：①每回合限两次，当你使用非伤害类普通锦囊牌指定目标后，你获得一个“椎”。②当你使用的非伤害类普通锦囊牌结算结束后，若你的“椎”数大于1，则你弃置两个“椎”并摸一张牌，然后可以视为使用一张【杀】。',
			sb_huangzhong: '谋黄忠',
			sbliegong: '烈弓',
			sbliegong_info: '①若你的装备区内没有武器牌，则你手牌区内所有【杀】的属性视为无属性。②当你使用牌时，或成为其他角色使用牌的目标后，你记录此牌的花色。③当你使用【杀】指定唯一目标后，若你〖烈弓②〗的记录不为空，则你可亮出牌堆顶的X张牌（X为你〖烈弓②〗记录过的花色数-1），令此【杀】的伤害值基数+Y（Y为亮出牌中被〖烈弓②〗记录过花色的牌的数量），且目标角色不能使用〖烈弓②〗记录过花色的牌响应此【杀】。此【杀】使用结算结束后，你清除〖烈弓②〗的记录。',
			sb_huaxiong: '谋华雄',
			sbyangwei: '扬威',
			sbyangwei_info: '出牌阶段，你可以摸两张牌，令此技能于你的下下个结束阶段前失效，且你获得如下效果直到回合结束：使用【杀】无距离限制，次数上限+1且无视防具。',
			sb_yujin: '谋于禁',
			sbxiayuan: '狭援',
			sbxiayuan_info: '每轮限一次。其他角色受到伤害后，若其因此伤害触发过护甲效果且其没有护甲，则你可弃置两张手牌，令其获得X点护甲（X为其因此伤害触发护甲效果而失去的护甲数量）。',
			sbjieyue: '节钺',
			sbjieyue_info: '结束阶段，你可以令一名其他角色获得1点护甲。然后其可以交给你一张牌。',
			sb_lvmeng: '谋吕蒙',
			sbkeji: '克己',
			sbkeji_info: '①出牌阶段各限一次。你可以选择一项：1.弃置一张手牌，然后获得1点护甲；2.失去1点体力，然后获得2点护甲。②你的手牌上限+X（X为你的护甲数）。③若你不为正在结算濒死流程的角色，你不能使用【桃】。',
			sbdujiang: '渡江',
			sbdujiang_info: '觉醒技，准备阶段，若你的护甲数不少于3，你获得〖夺荆〗，修改〖克己①〗为“出牌阶段限一次”。',
			sbduojing: '夺荆',
			sbduojing_info: '当你使用【杀】指定目标时，你可以失去1点护甲。然后令此【杀】无视防具，你获得目标角色一张牌，本回合使用【杀】的次数上限+1。',
			sb_sunshangxiang: '谋孙尚香',
			sbjieyin: '结姻',
			sbjieyin_info: '使命技，①游戏开始时，你令一名其他角色获得1枚“助”。②出牌阶段开始时，有“助”的角色选择一项：1.交给你X张手牌（X=min(2,其手牌数)且至少为1），然后获得1点护甲；2.令你将“助”移动给另一名其他角色，或移去其“助”（若其此前获得过“助”，则只能移去）。③失败：当一名角色死亡后，若其于死亡时有“助”，或当你因〖结姻②〗移去“助”后，你将势力改为吴，回复1点体力，获得所有“妆”并减1点体力上限。',
			sbliangzhu: '良助',
			sbliangzhu_info: '蜀势力技，出牌阶段限一次，你可以将一名其他角色装备区里的一张牌置于武将牌上，称为“妆”，然后有“助”的角色须选择回复1点体力或摸两张牌。',
			sbxiaoji: '枭姬',
			sbxiaoji_info: '吴势力技，当你失去装备区里的一张牌后，你摸两张牌，然后可以弃置场上的一张牌。',
			sb_sunquan: '谋孙权',
			sbzhiheng: '制衡',
			sbzhiheng_info: '出牌阶段限一次。你可以弃置任意张牌并摸等量的牌，若你以此法弃置的牌包括你所有手牌，则你多摸X张牌（X为你的“业”数+1），并弃1枚“业”。',
			sbtongye: '统业',
			sbtongye_info: '锁定技，结束阶段，你猜测场上装备牌数与你下一个准备阶段的场上装备牌数是否相等，并获得以下效果：你下一个准备阶段，若你猜对且“业”数小于2，你获得1枚“业”；若你猜错，你弃1枚“业”。',
			sbjiuyuan: '救援',
			sbjiuyuan_info: '主公技，锁定技，①其他吴势力角色使用【桃】时，你摸一张牌。②其他吴势力角色对你使用的【桃】的回复量+1。',
			sb_huanggai: '谋黄盖',
			sbkurou: '苦肉',
			sbkurou_info: '①出牌阶段开始时，你可以交给其他角色一张牌，若此牌于对方手牌区内为【桃】或【酒】，你失去2点体力，否则你失去1点体力。②当你失去1点体力后，你获得2点护甲。',
			sbzhaxiang: '诈降',
			sbzhaxiang_info: '锁定技，①摸牌阶段，你多摸X张牌。②你每回合使用的前X张牌无距离与次数限制且不能被响应（X为你已损失的体力值）。',
			sb_zhouyu: '谋周瑜',
			sbyingzi: '英姿',
			sbyingzi_info: '锁定技，摸牌阶段，你多摸X张牌，且令你本回合手牌上限+X（X为以下条件中你满足的项数：手牌数不小于2、体力值不小于2、装备区里的牌数不小于1）。',
			sbfanjian: '反间',
			sbfanjian_info: '出牌阶段，你可以声明一个花色并选择一张牌和一名其他角色（每种花色的牌每回合限一次）。其须选择一项：1.猜测此牌花色与你所声明花色是否相同；2.翻面。然后其正面向上获得此牌。若其选择猜测且猜测错误，其失去1点体力，否则其令你〖反间〗于本回合失效。',
			sb_caoren: '谋曹仁',
			sbjushou: '据守',
			sbjushou_info: '①出牌阶段限一次。若你的武将牌正面朝上，你可以弃置至多两张牌，然后你翻面并获得等量护甲。②当你受到伤害后，若你的武将牌背面朝上，你选择一项：1.翻面；2.获得1点护甲。③当你翻面后，若你的武将牌正面朝上，你摸X张牌（X为你的护甲数）。',
			sbjiewei: '解围',
			sbjiewei_info: '出牌阶段限一次。你可以失去1点护甲并选择一名其他角色。你观看其手牌并获得其中一张。',
			sb_xiahoushi: '谋夏侯氏',
			sbqiaoshi: '樵拾',
			sbqiaoshi_info: '每回合限一次。当你受到其他角色造成的伤害后，其可以令你回复等同于此次伤害值的体力，然后其摸两张牌。',
			sbyanyu: '燕语',
			sbyanyu_info: '①出牌阶段限两次。你可以弃置一张【杀】，然后摸一张牌。②出牌阶段结束时，你可以令一名其他角色摸3X张牌（X为你于此阶段发动〖燕语①〗的次数）。',
			sb_zhangjiao: '谋张角',
			sbleiji: '雷击',
			sbleiji_info: '出牌阶段，你可以选择一名其他角色并弃4枚“道兵”，对其造成1点雷电伤害。',
			sbguidao: '鬼道',
			sbguidao_info: '①游戏开始时，你获得4枚“道兵”标记。②“道兵”上限为8。③一名角色受到属性伤害后，你获得2枚“道兵”。④当你受到伤害时，你可以弃2枚“道兵”并防止此伤害。然后若当前回合角色不为你，〖鬼道③〗于你下回合开始前无效。',
			sbhuangtian: '黄天',
			sbhuangtian_info: '主公技，锁定技，①回合开始时，若本回合为你的第一个回合且游戏轮数为1，且游戏内没有【太平要术】，你装备【太平要术】。②其他群势力角色造成伤害后，若你拥有〖鬼道〗，你获得1枚“道兵”。',
			sb_caocao: '谋曹操',
			sbjianxiong: '奸雄',
			sbjianxiong_info: '①游戏开始时，你可获得至多2枚“治世”标记。②当你受到伤害后，你可获得伤害牌，摸1-X张牌（X为“治世”数），然后你可弃1枚“治世”。',
			sbqingzheng: '清正',
			sbqingzheng_info: '出牌阶段开始时，你可以弃置3-X种花色的所有手牌（X为“治世”数），并观看一名有手牌的其他角色的手牌，你弃置其中一种花色的所有牌。若其被弃置的牌数小于你以此法弃置的牌数，你对其造成1点伤害。然后若X小于2且你拥有技能〖奸雄〗，你可以获得1枚“治世”。',
			sbhujia: '护驾',
			sbhujia_info: '主公技，每轮限一次。当你受到伤害时，你可以将此伤害转移给一名其他魏势力角色。',
			sb_zhenji: '谋甄姬',
			sbluoshen: '洛神',
			sbluoshen_info: '准备阶段，你可以选择一名角色。从其开始按逆时针方向的X名其他角色依次执行（X为角色数的一半，向上取整）：展示一张手牌，若此牌为黑色，你获得之且此牌不计入本回合手牌上限；若此牌为红色，其弃置之。',
			sb_ganning: '谋甘宁',
			sbqixi: '奇袭',
			sbqixi_info: '出牌阶段限一次。若你有手牌，你可以令一名其他角色猜测你手牌中最多的花色。若其猜对，你展示所有手牌；若其猜错，你可令其从其未选择过的花色中再次猜测，重复此流程。然后你弃置其区域内的X张牌（X为其于本次〖奇袭〗中猜错的次数+1）。',
			sbfenwei: '奋威',
			sbfenwei_info: '限定技，①出牌阶段，你可以将至多三张牌分别置于等量名角色的武将牌上，称为“威”，然后你摸等量牌。②当一名角色成为锦囊牌的目标时，若其有“威”，你须选择：1.令其获得其“威”；2.令其移去“威”，并取消此目标。',
			sb_machao: '谋马超',
			sbtieji: '铁骑',
			sbtieji_info: '当你使用【杀】指定其他角色为目标后，你可以令目标角色不能响应此【杀】，且其所有非锁定技失效直到回合结束。然后你与其进行谋弈。若你赢，且你选择的选项为：“直取敌营”，则你获得其一张牌；“扰阵疲敌”，你摸两张牌。',
			sb_xuhuang: '谋徐晃',
			sbduanliang: '断粮',
			sbduanliang_info: '出牌阶段限一次。你可以与一名其他角色进行谋弈。若你赢，且你选择的选项为：“围城断粮”，若其判定区没有【兵粮寸断】，你将牌堆顶牌当【兵粮寸断】对其使用，否则你获得其一张牌；“擂鼓进军”，你视为对其使用一张【决斗】。',
			sbshipo: '势迫',
			sbshipo_info: '结束阶段，你可以令一名体力少于你的角色或所有判定区有【兵粮寸断】的其他角色选择一项：1.交给你一张手牌；2.受到1点伤害。所有目标角色选择完成后，你可以将任意张你以此法获得的牌交给一名其他角色。',
			sb_zhangfei: '谋张飞',
			sbpaoxiao: '咆哮',
			sbpaoxiao_info: '锁定技，①你使用【杀】无次数限制。②若你的装备区内有武器牌，则你使用【杀】无距离限制。③当你于出牌阶段内使用第二张及以后【杀】时，你获得如下效果：{此【杀】不可被响应且伤害值基数+1；此【杀】指定目标后，目标角色的非锁定技于本回合内失效；此【杀】造成伤害后，若目标角色存活，则你失去1点体力并随机弃置一张手牌。}',
			sbxieji: '协击',
			sbxieji_info: '准备阶段开始时，你可以和一名其他角色进行协力。其的下个结束阶段开始时，若你与其协力成功，则你可以选择至多三名其他角色。你对这些角色视为使用一张【杀】，且当此【杀】因执行牌面效果造成伤害后，你摸X张牌（X为伤害值）。',
			sb_zhaoyun: '谋赵云',
			sblongdan: '龙胆',
			sblongdan_info: '蓄力技（1/3）。①你可以消耗1点蓄力值，将【杀】当做【闪】或将【闪】当做【杀】使用或打出，然后摸一张牌。②一名角色的回合结束时，你获得1点蓄力值。',
			sbjizhu: '积著',
			sbjizhu_info: '准备阶段开始时，你可以和一名其他角色进行协力。其的下个结束阶段开始时，若你与其协力成功，则你修改〖龙胆〗直到你的下个结束阶段开始。',
			sblongdan_shabi: '龙胆',
			sblongdan_shabi_info: '蓄力技（1/3）。①你可以消耗1点蓄力值，将一张基本牌当做任意基本牌使用或打出，然后摸一张牌。②一名角色的回合结束时，你获得1点蓄力值。',
			sb_liubei: '谋刘备',
			sbrende: '仁德',
			sbrende_info: '①出牌阶段每名角色限一次。你可以将任意张牌交给一名其他角色，然后你获得等量“仁望”标记（至多为8）。②每回合限一次。你可以移去2枚“仁望”，视为使用或打出一张基本牌。③出牌阶段开始时，你获得2枚“仁望”。',
			sbzhangwu: '章武',
			sbzhangwu_info: '限定技，出牌阶段，你可以令所有于本局游戏成为过〖仁德①〗目标的其他角色依次交给你X张牌，然后你回复3点体力并失去〖仁德〗（X为游戏轮数-1，且至多为3）。',
			sbjijiang: '激将',
			sbjijiang_info: '主公技，出牌阶段结束时，你可以选择一名体力值不小于你的其他蜀势力角色A和一名在A攻击范围内的角色B。A选择一项：1.视为对B使用一张【杀】；2.下一个出牌阶段开始前，跳过此阶段。',
			sb_jiangwei: '谋姜维',
			sbtiaoxin: '挑衅',
			sbtiaoxin_info: '蓄力技（4/4）。①出牌阶段限一次。你可以选择至多X名角色（X为你的蓄力值），令这些角色选择一项：1.对你使用一张【杀】（无距离限制）；2.交给你一张牌。然后你消耗等同于你选择的目标数的蓄力值。②当你于弃牌阶段弃置牌后，你获得等量蓄力值。',
			sbzhiji: '志继',
			sbzhiji_info: '觉醒技，准备阶段，若你因〖挑衅①〗消耗过至少4点蓄力值，你减1点体力上限，令至少一名角色获得“北伐”标记并获得如下效果直到你的下回合开始：其使用牌只能指定你或其为目标。',
			sb_fazheng: '谋法正',
			sbxuanhuo: '眩惑',
			sbxuanhuo_info: '①出牌阶段限一次。你可以将一张牌交给一名没有“眩”标记的其他角色，然后令其获得“眩”标记。②当有“眩”的其他角色于摸牌阶段外获得牌后，若你以此法于其本次获得“眩”的期间内获得其的牌数小于5，你随机获得其一张手牌。',
			sbenyuan: '恩怨',
			sbenyuan_info: '锁定技，准备阶段，若场上存在有“眩”的角色，你移去该角色的“眩”，且你于其本次获得“眩”的期间内获得其的牌数：不小于3，你交给其两张牌；小于3，其失去1点体力，你回复1点体力。',
			sb_chengong: '谋陈宫',
			sbmingce: '明策',
			sbmingce_info: '①出牌阶段限一次。你可以将一张牌交给一名其他角色，其选择一项：1.失去1点体力，令你摸两张牌并获得1枚“策”；2.摸一张牌。②出牌阶段开始时，你可以移去所有“策”并对一名其他角色造成等量伤害。',
			sbzhichi: '智迟',
			sbzhichi_info: '锁定技，当你受到伤害后，防止你本回合受到的伤害。',
			sb_yuanshao: '谋袁绍',
			sbluanji: '乱击',
			sbluanji_info: '①出牌阶段限一次。你可以将两张手牌当【万箭齐发】使用。②当其他角色因响应你使用的【万箭齐发】而打出【闪】时，你摸一张牌。',
			sbxueyi: '血裔',
			sbxueyi_info: '主公技，锁定技，①你的手牌上限+2X（X为场上其他群势力角色数）。②当你使用牌指定其他群势力角色为目标后，你摸一张牌。',
			sb_diaochan: '谋貂蝉',
			sblijian: '离间',
			sblijian_info: '出牌阶段限一次。你可以选择至少两名其他角色并弃置X张牌（X为你选择的角色数-1）。然后每名你选择的角色依次视为对这些角色中与其逆时针座次最近的另一名角色使用一张【决斗】。',
			sbbiyue: '闭月',
			sbbiyue_info: '锁定技，结束阶段，你摸Y张牌（Y为本回合受到过伤害的角色数+1且至多为5）。',
			sb_pangtong: '谋庞统',
			sblianhuan: '连环',
			sblianhuan_info: '①出牌阶段，你可以重铸一张♣手牌。②出牌阶段限一次。你可以将一张♣手牌当【铁索连环】使用。③当你使用【铁索连环】时，你可以失去1点体力，然后当此牌指定第一个目标后，你随机弃置每名不处于连环状态的目标角色一张手牌。',
			sblianhuan_lv2: '连环·改',
			sblianhuan_lv2_info: '①出牌阶段，你可以重铸一张♣手牌。②出牌阶段限一次。你可以将一张♣手牌当【铁索连环】使用。③当你使用【铁索连环】时，你可以额外指定任意名角色为目标。④当你使用【铁索连环】指定第一个目标后，你随机弃置每名不处于连环状态的目标角色一张手牌。',
			sbniepan: '涅槃',
			sbniepan_info: '限定技，当你处于濒死状态时，你可以弃置区域里的所有牌，摸三张牌，将体力回复至3点，复原武将牌，然后修改〖连环〗。',
			sb_sunce: '谋孙策',
			sbjiang: '激昂',
			sbjiang_info: '①当你使用【决斗】或红色【杀】指定目标后，或当你成为【决斗】或红色【杀】的目标后，你摸一张牌。②当你使用【决斗】时，你可以额外指定一名目标，然后你失去1点体力。③出牌阶段限一次。你可以将所有手牌当【决斗】使用。',
			sbhunzi: '魂姿',
			sbhunzi_info: '觉醒技，当你脱离濒死状态后，你减1点体力上限，获得1点护甲，摸两张牌。然后你获得〖英姿〗和〖英魂〗。',
			sbzhiba: '制霸',
			sbzhiba_info: '主公技，限定技，当你进入濒死状态时，你可以回复X点体力并修改〖激昂③〗为“出牌阶段限X次”（X为场上其他吴势力角色数+1）。然后其他吴势力角色依次受到1点无来源伤害，且当有角色因此死亡后，你摸三张牌。',
			sb_daqiao: '谋大乔',
			sbguose: '国色',
			sbguose_info: '出牌阶段限四次。你可以选择一项：1.将一张♦牌当【乐不思蜀】使用；2.弃置场上一张【乐不思蜀】。然后你摸两张牌并弃置一张牌。',
			sbliuli: '流离',
			sbliuli_info: '当你成为【杀】的目标时，你可以弃置一张牌并选择你攻击范围内的一名不为此【杀】使用者的角色，将此【杀】转移给该角色。若你以此法弃置了♥牌，则你可以令一名不为此【杀】使用者的其他角色获得“流离”标记，且移去场上所有其他的“流离”（每回合限一次）。有“流离”的角色回合开始时，其移去其“流离”并执行一个额外的出牌阶段。',
			sb_liubiao: '谋刘表',
			sbzishou: '自守',
			sbzishou_info: '锁定技，其他角色的结束阶段，若其与你于本局游戏内均未对对方造成过伤害，其须交给你一张牌。',
			sbzongshi: '宗室',
			sbzongshi_info: '锁定技，每名角色限一次。当你受到伤害后，你令伤害来源弃置所有手牌。',
			sb_zhurong: '谋祝融',
			sblieren: '烈刃',
			sblieren_info: '当你使用【杀】指定唯一目标后，你可以摸一张牌并与其拼点。若你赢，此【杀】结算结束后，你可以对另一名其他角色造成1点伤害。',
			sbjuxiang: '巨象',
			sbjuxiang_info: '锁定技，①【南蛮入侵】对你无效。②当其他角色使用【南蛮入侵】结算结束后，你获得此牌对应的所有实体牌。③结束阶段，若你未于本回合使用过【南蛮入侵】，你可以将一张游戏外的随机【南蛮入侵】（共八张）交给一名角色。',
			sb_menghuo: '谋孟获',
			sbhuoshou: '祸首',
			sbhuoshou_info: '锁定技，①【南蛮入侵】对你无效。②当其他角色使用【南蛮入侵】指定第一个目标后，你代替其成为此牌的伤害来源。③出牌阶段开始时，你随机获得弃牌堆中的一张【南蛮入侵】。④出牌阶段，若你于此阶段使用过【南蛮入侵】，你不能使用【南蛮入侵】。',
			sbzaiqi: '再起',
			sbzaiqi_info: '蓄力技（1/7）。①弃牌阶段结束时，你可以消耗任意点蓄力值并选择等量名角色，然后令这些角色选择一项：1.令你摸一张牌；2.弃置一张牌，然后你回复1点体力。②每回合限一次。当你造成伤害后，你获得1点蓄力值。',
			sb_zhanghe: '谋张郃',
			sbqiaobian: '巧变',
			sbqiaobian_info: '每回合限一次：<br>你可以跳过判定阶段，然后流失1点体力，并选择一名其他角色，将你判定区里的所有牌置入其判定区（若无法置入则弃置）。<br>你可以跳过摸牌阶段，下回合的准备阶段摸五张牌并回复1点体力。<br>你可以跳过出牌阶段和弃牌阶段，将手牌弃至6张，然后你可以移动场上一张牌。',
			sb_xiaoqiao: '谋小乔',
			sbtianxiang: '天香',
			sbtianxiang_info: '准备阶段，你清除场上所有“天香”标记，并摸等量的牌。出牌阶段限三次，你可将一张红色牌交给一名没有“天香”标记的其他角色，开令其获得对应花色的“天香”标记，当你受到伤常时，你可以选择一名拥有“天香”标记的角色，移除其“天香”标记并根据移除的“天香”花色发动：红桃，你防止此伤害，然后令其受到防止伤害的来源角色造成的1点伤害；方块，其交给你两张牌。',
			sbhongyan: '红颜',
			sbhongyan_info: '锁定技、你的手牌和判定牌中的黑桃牌只能当做红桃牌。当一张判定牌生效前，如果此判定牌为红桃，你将判定结果改为由你指定的一种花色',
			sb_yl_luzhi: '谋卢植',
			sbmingren: '明任',
			sbmingren_info: '游戏开始时，你摸三张牌，然后将一张手牌置于你的武将牌上，称为“任”。结束阶段，你可以用一张手牌替换“任”。',
			sbzhenliang: '贞良',
			sbzhenliang_info: '转换技，阳：出牌阶段限一次，你可以选择一名攻击范围内的其他角色并弃置X张与“任”颜色相同的牌对其造成1点伤害（X为你与其体力值之差且至少为1)；阴：你的回合外，当一名角色使用或打出的牌结算结束后，若此牌与“任”类别相同，则你可令至多两名角色摸两张牌。',
			sb_sp_zhugeliang: '谋诸葛亮',
			sbhuoji: '火计',
			sbhuoji_info: '使命技，出牌阶段限一次，你可以对一个势力的所有其他角色各造成1点火焰伤害（你不会成为此技能包含的目标角色）。成功：准备阶段，若你于本局对其他角色造成过至少X点火焰伤害（X为本局游戏人数），你将此武将转换为谋诸葛亮（暮年）（失去〖火计〗和〖看破〗，获得〖观星〗和〖空城〗）。失败：当你进入濒死状态时，使命失败。',
			sbkanpo: '看破',
			sbkanpo_info: '每轮开始时，你清除上轮被记录过的牌名，然后你记录至多三种本轮未被清除过牌牌名的非装备牌牌名（可以同时记录多个同一种牌名）。每当有角色于本轮使用“看破”记录的牌名时，你可以移去一个对应牌名的记录取消之。',
			sb_huangyueying: '谋黄月英',
			sbjizhi: '集智',
			sbjizhi_info: '锁定技，当你使用普通锦囊牌时，你摸一张牌且此牌不计入本回合手牌上限。',
			sbqicai: '奇才',
			sbqicai_backup: '奇才',
			sbqicai_info: '出牌阶段限一次，你可以将你手牌中的/弃牌堆的装备牌置入一名其他角色的装备栏（每种牌名限一次）。若你以此法将防具牌置入目标角色的装备区，则其接下来获得的三张锦囊牌须交给你。',
			sb_guanyu: '谋关羽',
			sbwusheng: '武圣',
			sbwusheng_info: '你可以将一张手牌当任意一种【杀】使用或打出。出牌阶段开始时，你可以选择一名非主公角色，本阶段：你可以对其使用至多3张【杀】且无距离限制；当你使用【杀】指定其为目标后，你摸2张牌。',
			sbyijue: '义绝',
			sbyijue_info: '锁定技，每名角色限一次，当你于回合内对其他角色造成致命伤害时，防止之，然后本回合当你使用牌指定其为目标时，取消之。 ',
			sb_caopi: '谋曹丕',
			sbxingshang: '行殇',
			sbxingshang_info: '当一名角色死亡时或受到伤害后(每回合限一次)，你获得两个“颂”标记（你至多拥有9个“颂”标记）。出牌阶段限两次，你选择一名角色，移去任意数量的“颂”令其执行对应的一个选项：<li>2枚：<br>①复原武将牌<br>②摸X张牌（X为本局已死亡角色数，至少为2且至多为5）<li>5枚：<br>①若选择的角色体力上限不大于9，其回复1点体力并增加1点体力上限，然后随机恢复一个被废除的装备栏<br>②若选择的角色为你，则可追思一名未被追思过的已阵亡角色的武将牌上的技能，然后你失去武将牌上的其他所有技能。',
			sbxingshang_use_info: '出牌阶段限两次，你选择一名角色，移去任意数量的“颂”令其执行对应的一个选项：<li>2枚：<br>①复原武将牌；<br>②摸X张牌（X为本局已死亡角色数，至少为2且至多为5）<li>5枚：<br>①若选择的角色体力上限不大于9，其回复1点体力并增加1点体力上限，然后随机恢复一个被废除的装备栏<br>②若选择的角色为你，则可追思一名未被追思过的已阵亡角色的武将牌上的技能，然后你失去武将牌上的其他所有技能。',
			sbfangzhu: '放逐',
			sbfangzhu_info: '出牌阶段限一次，若你有“行殇”，你可以选择一名其他角色，移去任意数量的“颂”令其执行对应的一个选项：<li>1枚：<br>直到其下回合结束，其不能使用除基本牌以外的手牌<li>2枚：直到其下回合结束<br>①其武将技能失效<br>②其不可响应另一名角色使用的牌<br>③其不能使用除锦囊牌以外的手牌<li>3枚：<br>①其翻面；<br>②直到其下回合结束，其不能使用除装备牌以外的手牌。',
			sbsongwei: '颂威',
			sbsongwei_info: '主公技，出牌阶段开始时，若你有“行殇”，你获得X枚“颂”标记(X为本局游戏其他魏势力角色数的两倍)。每局游戏限一次，你可于出牌阶段令一名其他魏势力角色失去其武将牌上的所有技能。',
			sbsongwei_dabian_info: '每局游戏限一次，你可于出牌阶段令一名其他魏势力角色失去其武将牌上的所有技能。',
			sb_zhugeliang: "谋诸葛亮",
			sb_huoji: "火计",
			sb_huoji_info: "使命技，出牌阶段限一次，你可以选择一名其他角色，对其及其同势力的其他角色各造成1点火焰伤害。成功：准备阶段，若你对其他角色造成过至少X点火焰伤害（X为本局人数），你失去“火计”和“看破”，获得“观星”和“空城”。失败：进入濒死状态。",
			sb_kanpo: "看破",
			sb_kanpo_info: "每轮开始时，你清除此技能记录的牌名，然后你可以记录任意个与上次记录均不相同的牌名（可同名且每局至多三个）。当其他角色使用你记录牌名的牌时，你可以移除一个对应牌名的记录，令此牌无效并摸一张牌。",
			sb_guanxing: "观星",
			sb_guanxing_info: "准备阶段，你移去所有“星”，并将牌堆顶X张牌置于武将牌上（X为7-此前准备阶段此技能发动次数的三倍），称为“星”，然后你可以选择一项：1.将任意张“星”置于牌堆顶；2.结束阶段，你可以将任意张“星”置于牌堆顶。你可以将“星”如手牌般使用或打出。",
			sb_kongcheng: "空城",
			sb_kongcheng_info: "锁定技，当你受到伤害时，若你：有“星”，你判定，若结果点数小于等于“星”数，此伤害-1；没有“星”，此伤害+1。",
			sb_gaoshun: '谋高顺',
			sbxianzhen: '陷阵',
			sbxianzhen_info: '出牌阶段限一次，你可选择一名其他角色。本阶段你对其使用牌无距离限制，且你对其使用【杀】时，你可与其拼点：若你赢，则你对其造成1点伤害（每回合限一次），然后此【杀】无视防具、不计入次数；若其拼点牌为【杀】，则你获得之。',
			sbjinjiu: '禁酒',
			sbjinjiu_info: '锁定技，你的【酒】只能当做普通【杀】使用或打出；当你受到【酒】【杀】造成的伤害时，此伤害调整为1；你的回合内，其他角色无法使用【酒】。与你拼点的角色拼点牌亮出后，若此牌为【酒】，则此牌的点数调整为1。',
			sb_xiahoudun: '谋夏侯惇',
			sbganglie: '刚烈',
			sbganglie_info: '出牌阶段，你可以选择一名本局游戏对你造成过伤害且未以此法选择过的角色，你对其造成2点伤害。',
			sbqingjian: '清俭',
			sbqingjian_info: '①当有一张牌不因使用而进入弃牌堆后，若你的“清俭”数小于X，你将此牌置于你的武将牌上，称为“清俭”（X为你的体力值-1，且至少为1）。②出牌阶段结束时，你将所有“清俭”分配给任意角色。',
			sb_gongsunzan: "谋公孙瓒",
			sbyicong: "义从",
			sbyicong_info: "蓄力技（2/4）。每轮开始时，你可以消耗至多x点蓄力值并选择一项：⒈直至本轮结束，你与其他角色距离-x，并将牌堆中的一张【杀】置于武将牌上，称为“扈”；⒉直至本轮结束，其他角色与你距离+x，，并将牌堆中的一张【闪】置于武将牌上，称为“扈”。你至多拥有四张“扈”，当你需要使用或打出手牌时，你可以将“扈”视为你的牌使用或打出。",
			sbqiaomeng: "趫猛",
			sbqiaomeng_info: "当你使用【杀】对一名角色造成伤害后，若你拥有技能“义从”，你可选择一项：⒈弃置其区域内的一张牌并摸一张牌；⒉获得2点蓄力值。",
			sb_handang: "谋韩当",
			sbgongji: "弓骑",
			sbgongji_info: "你的攻击范围+4。出牌阶段开始时，你可以弃置一张牌，若如此做，则此阶段你使用的牌其他角色只能使用或打出虚拟牌或与你弃置牌颜色相同的手牌响应。",
			sbjiefan: "解烦",
			sbjiefan_info: "出牌阶段限一次，你可指定一名角色，令其选择一项：⒈攻击范围内含有其的角色依次弃置一张牌；⒉其摸等同于攻击范围内含有其的角色数的牌；背水：此技能失效直至你杀死一名角色。",
			sb_luxun: "谋陆逊",
			sbqianxun: "谦逊",
			sbqianxun_info: "当一张锦囊牌对你生效时，若此牌名未记录且你不是使用者，则你记录之，然后可将至多X张牌置于你的武将牌上，此回合结束时获得（X为“谦逊”记录的牌名数且至多为5）。出牌阶段开始时，你可以移去一个记录的普通锦囊牌牌名，视为使用此牌。",
			sblianying: "连营",
			sblianying_info: "其他角色的回合结束时，你可以观看牌堆顶的X张牌，然后将这些牌交给任意角色（X为你本回合失去的牌数，至多为5）。",
			sb_jiaxu: '谋贾诩',
			sbwansha: '完杀',
			sbwansha_info: '你的回合内，不处于濒死状态的其他角色不能使用【桃】。一名角色进入濒死状态时，你可观看其手牌并选择其中的零至两张牌，然后其须选择一项：1.由你将被选择的牌分配给其以外的角色；2.弃置所有未被选择的牌。',
			sbluanwu: '乱武',
			sbluanwu_info: '限定技，出牌阶段，你可令所有其他角色除非对各自距离最小的另一名其他角色使用一张【杀】，否则失去1点体力。',
			sbweimu: '帷幕',
			sbweimu_info: '锁定技，你成为黑色锦囊牌的目标时，取消之。',
			sb_zhugejin: '谋诸葛瑾',
			sbhuanshi: '缓释',
			sbhuanshi_tag: '牌堆顶',
			sbhuanshi_info: '当一名角色的判定牌生效前，你观看牌堆顶的一张牌，然后可以用此牌或手牌中的一张替换之。',
			sbhongyuan: '弘援',
			sbhongyuan_info: '蓄力技(1/3)。当你一次获得不少于两张牌时，你可以消耗1点蓄力点令至多两名角色各摸一张牌。当一名其他角色一次失去不少于两张牌时，你可以消耗1点蓄力点令其摸两张牌。',
			sbmingzhe: '明哲',
			sbmingzhe_info: '锁定技，每轮限两次。当你于回合外失去牌时，你选择一名角色，若其有蓄力技，令其获得1点蓄力点，若你失去的牌中有非基本牌，则其摸一张牌。',
			sb_guojia: '谋郭嘉',
			sbtiandu: '天妒',
			sbtiandu_info: '转换技，出牌阶段开始时，阳：你可弃置两张手牌，然后视为使用一张普通锦囊牌；阴：你进行判定并获得此判定牌：若结果与你本局游戏发动“天妒”弃置过的牌花色相同，你受到1点无来源伤害。',
			sbyiji: '遗计',
			sbyiji_info: '当你受到伤害后，你可以摸两张牌，然后你可以将至多等量张手牌交给任意名其他角色。当你每轮首次进入濒死状态时，你可以摸一张牌，然后你可以将至多等量张手牌交给任意名其他角色。',
			sb_zhangliao: '谋张辽',
			sbtuxi: '突袭',
			sbtuxi_info: '你的回合内限两次，当你不因此技能获得牌后，你可将其中任意数量的牌置入弃牌堆，然后获得至多X名其他角色各一张手牌（X为你此次置入弃牌堆的牌数）。',
			sbdengfeng: '登锋',
			sbdengfeng_info: '准备阶段，你可选择一名其他角色并选择一项：1.选择其装备区里的至多一张牌，令其获得之；2.你从牌堆中获得一张【杀】；背水：失去1点体力。',

			sb_zhi: '谋攻篇·知',
			sb_shi: '谋攻篇·识',
			sb_tong: '谋攻篇·同',
			sb_yu: '谋攻篇·虞',
			sb_neng: '谋攻篇·能',
		},
"skill": {
			//谋张辽
			sbtuxi: {
				audio: 2,
				usable: 2,
				trigger: {
					player: 'gainAfter',
					global: 'loseAsyncAfter',
				},
				filter: function (event, player) {
					if (!game.hasPlayer(current => current != player && current.countCards('h') > 0)) return false;
					return event.player == player && event.getg(event.player).length > 0 && event.getParent(3).name != 'sbtuxi' && _status.currentPhase == player;
				},
				content: function () {
					'step 0'
					player.chooseCard([1, Infinity], 'h', (card, player) => {
						return trigger.getg(player).contains(card);
					}, true)
						.set('prompt', '将本次获得的任意张牌置于弃牌堆，然后获得至多等量名其他角色的各一张手牌')
						.set('ai', card => {
							if (game.hasPlayer(function (current) {
								return current != player && current.countCards('h') > 0 && get.attitude(player, current) <= 0;
							})) return 7.5 - get.value(card);
						});
					'step 1'
					if (result.bool) {
						event.cards = result.cards;
						player.chooseTarget([1, event.cards.length], function (card, player, target) {
							return target != player && target.countCards('h') > 0;
						}, true)
							.set('prompt', `获得至多${get.cnNumber(event.cards.length)}名其他角色的各一张手牌`)
							.set('ai', target => {
								var att = get.attitude(_status.event.player, target);
								if (target.hasSkill('tuntian')) return att / 10;
								return 1 - att;
							});
					}
					'step 2'
					event.targets = result.targets;
					event.targets.sortBySeat();
					player.logSkill('sbtuxi', event.targets);
					player.loseToDiscardpile(event.cards);
					player.gainMultiple(event.targets.sortBySeat());
				},
			},
			sbdengfeng: {
				audio: 2,
				trigger: {
					player: 'phaseZhunbeiBegin'
				},
				content: function () {
					'step 0'
					player.chooseTarget(lib.filter.notMe, get.prompt2('sbdengfeng'))
						.set('ai', target => {
							var player = _status.event.player, att = get.attitude(player, target), equips = target.getCards('e');
							if ((equips.some(card => get.equipValue(card, target) <= 4) && att > 0) || (equips.some(card => get.equipValue(card, target) > 7) && att < 0)) return 10;
							return 1;
						});
					'step 1'
					if (result.bool) {
						event.target = result.targets[0];
						var list = [];
						if (event.target.countCards('e')) list.push('选项一');
						list.push('选项二');
						list.push('背水！');
						list.push('cancel2');
						player.chooseControl(list)
							.set('choiceList', [`令${get.translation(event.target)}获得其装备区的一张牌`, '获得牌堆中的一张【杀】', '背水！失去1点体力并执行所有选项'])
							.set('prompt', get.prompt('sbdengfeng', event.target))
							.set('target', event.target)
							.set('ai', () => {
								var player = _status.event.player, target = _status.event.target, att = get.attitude(player, target);
								const bool1 = (target.getCards('e').some(card => get.equipValue(card, target) <= 4) && att > 0) || (target.getCards('e').some(card => get.equipValue(card, target) > 7) && att < 0);
								const bool2 = !player.countCards('hs', { name: 'sha' }) || player.hasSkill('sbtuxi');
								if (bool1 && bool2 && (player.getHp() > 2 || get.effect(player, { name: 'losehp' }, player, player) > 0)) return '背水！';
								if (bool1) return '选项一';
								if (bool2) return '选项二';
								return 'cancel2';
							});
					}
					'step 2'
					if (result.control != 'cancel2') {
						player.logSkill('sbdengfeng', event.target);
						if (result.control == '选项一' && event.target.countCards('e')) player.choosePlayerCard(event.target, true, 'e', `选择${get.translation(event.target)}的一张装备牌令其获得之`);
						else if (result.control == '选项二') {
							var card = get.cardPile2(function (card) {
								return card.name == 'sha';
							});
							if (card) {
								player == game.me ? player.gain(card)
									.nodelay = true : player.gain(card, 'draw')
										.nodelay = true;
							} else game.log('牌堆中没有', '#a' + '杀', 'visible');
							event.finish();
						} else {
							if (event.target.countCards('e') > 0) player.choosePlayerCard(event.target, true, 'e', `选择${get.translation(event.target)}的一张装备牌令其获得之`);
							event.goto(4);
						}
					} else event.goto(0);
					'step 3'
					if (result.bool) {
						event.target.gain(result.links, 'giveAuto');
						event.finish();
					}
					'step 4'
					if (result.bool) event.target.gain(result.links, 'giveAuto');
					var card = get.cardPile2(function (card) {
						return card.name == 'sha';
					});
					if (card) {
						player == game.me ? player.gain(card)
							.nodelay = true : player.gain(card, 'draw')
								.nodelay = true;
					} else game.log('牌堆中没有', '#a' + '杀', 'visible');
					player.loseHp();
				},
			},
			//谋郭嘉
			sbtiandu: {
				audio: 2,
				trigger: {
					player: 'phaseUseBegin'
				},
				zhuanhuanji: true,
				filter: function (event, player) {
					if (player.storage.sbtiandu) return true;
					return player.countCards('h', card => _status.connectMode || lib.filter.cardDiscardable(card, player)) > 1;
				},
				content: function () {
					'step 0'
					if (!player.storage.sbtiandu) player.chooseToDiscard('h', 2)
						.set('prompt', '你是否发动天妒，弃置2张手牌并视为使用普通锦囊牌')
						.set('logSkill', 'sbtiandu')
						.set('ai', card => {
							var player = _status.event.player;
							var list = get.inpileVCardList(info => {
								if (info[0] != 'trick') return false;
								return player.hasUseTarget({ name: info[2], nature: info[3], isCard: true });
							});
							if (!list.length) return 0;
							if (player.storage.sbtiandux && player.storage.sbtiandux.includes(get.suit(card, player))) return 1;
							return 6 - get.value(card);
						});
					else {
						player.logSkill('sbtiandu');
						player.changeZhuanhuanji('sbtiandu');
						if (!player.storage.sbtiandux) player.storage.sbtiandux = [];
						player.judge(function (card) {
							var suit = get.suit(card);
							if (player.storage.sbtiandux.includes(suit)) return -2;
							return 0;
						}).judge2 = function (result) {
							return result.bool == false ? true : false;
						};
						event.goto(4);
					}
					'step 1'
					if (result.bool) {
						player.changeZhuanhuanji('sbtiandu');
						if (!player.storage.sbtiandux) player.storage.sbtiandux = [];
						for (var card of result.cards) player.storage.sbtiandux.add(get.suit(card));
					}
					'step 2'
					var list = [];
					for (var i of lib.inpile) {
						if (get.type(i) == 'trick' && get.type(i) != 'delay') list.push(['锦囊', '', i]);
					}
					player.chooseButton(['遗计：视为使用其中一张锦囊牌', [list, 'vcard']])
						.set('filterButton', button => {
							return game.hasPlayer(function (current) {
								return player.canUse(button.link[2], current);
							});
						})
						.set('ai', button => {
							var player = _status.event.player;
							return player.getUseValue({ name: button.link[2], nature: button.link[3] });
						});
					'step 3'
					if (result.bool) player.chooseUseTarget({ name: result.links[0][2] });
					event.finish();
					'step 4'
					if ([result.card].filterInD('d')) player == game.me ? player.gain(result.card) : player.gain(result.card, 'gain2');
					if (player.storage.sbtiandux && player.storage.sbtiandux.contains(result.suit)) player.damage('nosource');
				},
				marktext: '☯',
				intro: {
					mark: function (dialog, storage, player) {
						dialog.addText('出牌阶段开始时，' + (storage ? '你进行判定并获得判定牌，然后若判定结果与你本局游戏因〖天妒〗弃置的牌花色相同，你受到1点无来源伤害。' : '你可以弃置两张手牌，然后视为使用一张普通锦囊牌'));
						if (player.storage.sbtiandux) dialog.addText('已记录花色：' + player.storage.sbtiandux.join(''));
					},
				},
			},
			sbyiji: {
				audio: 2,
				trigger: {
					player: ['damageEnd', 'dying_first']
				},
				content: function () {
					'step 0'
					event.num = trigger.name == 'damage' ? 2 : 1;
					player.draw(event.num);
					'step 1'
					player.chooseCardTarget({
						filterCard: function (card) {
							return get.itemtype(card) == 'card' && !card.hasGaintag('reyiji_tag');
						},
						filterTarget: lib.filter.notMe,
						selectCard: [1, event.num],
						prompt: '是否将最多' + get.cnNumber(event.num) + '张手牌交给至多' + get.cnNumber(event.num) + '名其他角色？',
						ai1: function (card) {
							if (!ui.selected.cards.length) return 1;
							return 0;
						},
						ai2: function (target) {
							var player = _status.event.player,
								card = ui.selected.cards[0];
							var val = target.getUseValue(card);
							if (!target.hasJudge('lebu')) {
								if (val > 0) return val * get.attitude(player, target) * 2;
								return get.value(card, target) * get.attitude(player, target);
							}
						},
					});
					'step 2'
					if (result.bool) {
						event.num -= result.cards.length;
						result.targets[0].gain(result.cards, player, 'giveAuto');
						if (event.num > 0) event.goto(1);
					}
				},
				group: 'sbyiji_dying',
				subSkill: {
					dying: {
						trigger: {
							player: 'dying'
						},
						round: 1,
						charlotte: true,
						forced: true,
						silent: true,
						content: function () {
							event.trigger('dying_first');
						},
					},
				},
				ai: {
					maixie: true,
					"maixie_hp": true,
					result: {
						effect: function (card, player, target) {
							if (get.tag(card, 'damage')) {
								if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								var num = 1;
								if (get.attitude(player, target) > 0) {
									if (player.needsToDiscard()) {
										num = 0.7;
									}
									else {
										num = 0.5;
									}
								}
								if (player.hp >= 4) return [1, num * 2];
								if (target.hp == 3) return [1, num * 1.5];
								if (target.hp == 2) return [1, num * 0.5];
							}
						},
					},
					threaten: 0.6,
				},
			},
			//谋诸葛瑾
			sbhuanshi: {
				audio: 2,
				trigger: {
					global: 'judge'
				},
				forced: true,
				logTarget: 'player',
				content: function () {
					'step 0'
					event.cardsx = get.cards(1, true)
					if (event.cardsx.length) player.directgains(event.cardsx, null, 'sbhuanshi_tag');
					'step 1'
					player.chooseCard(`${get.translation(trigger.player)}的${(trigger.judgestr || '')}判定为${get.translation(trigger.player.judging[0])}，${get.prompt('sbhuanshi')}`, 'hs', card => {
						var player = _status.event.player;
						var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
						if (mod2 != 'unchanged') return mod2;
						var mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
						if (mod != 'unchanged') return mod;
						return true;
					})
						.set('judging', trigger.player.judging[0])
						.set('cardPilex', event.cardsx)
						.set('ai', card => {
							var trigger = _status.event.getTrigger(), player = _status.event.player;
							var judging = _status.event.judging, result = trigger.judge(card) - trigger.judge(judging), attitude = get.attitude(player, trigger.player);
							if (attitude == 0 || result == 0) return 0;
							if (_status.event.cardPilex.includes(card)) return attitude > 0 ? result : -result;
							if (attitude > 0) {
								return result - get.value(card) / 2;
							} else {
								return -result - get.value(card) / 2;
							}
						});
					'step 2'
					if (result.bool) {
						player.respond(result.cards, 'sbhuanshi', 'highlight', 'noOrdering');
					} else event.goto(4);
					'step 3'
					if (result.bool) {
						if (trigger.player.judging[0].clone) {
							trigger.player.judging[0].clone.classList.remove('thrownhighlight');
							game.broadcast(function (card) {
								if (card.clone) {
									card.clone.classList.remove('thrownhighlight');
								}
							}, trigger.player.judging[0]);
							game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
						}
						game.cardsDiscard(trigger.player.judging[0]);
						trigger.player.judging[0] = result.cards[0];
						trigger.orderingCards.addArray(result.cards);
						game.log(trigger.player, '的判定牌改为', result.cards[0]);
					}
					'step 4'
					event.cardsx = player.getCards('s', card => card.hasGaintag('sbhuanshi_tag'));
					if (event.cardsx.length) {
						if (player.isOnline2()) {
							player.send(function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) ui.updatehl();
							}, event.cardsx, player);
						}
						event.cardsx.forEach(i => i.delete());
						if (player == game.me) ui.updatehl();
					}
					game.delay(2);
				},
				ai: {
					rejudge: true,
					tag: {
						rejudge: 1,
					},
				},
			},
			sbhongyuan: {
				audio: 2,
				trigger: {
					player: 'gainAfter',
					global: 'loseAsyncAfter',
				},
				direct: true,
				chargeSkill: true,
				getLimit: 3,
				filter: function (event, player) {
					var cards = event.getg(player);
					return cards && cards.length >= 2 && player.countMark('charge') > 0;
				},
				content: function () {
					'step 0'
					player.chooseTarget([1, 2])
						.set('prompt', '你可以消耗1点蓄力点令至多2名角色各摸1张牌')
						.set('ai', function (target) {
							return get.attitude(_status.event.player, target);
						});
					'step 1'
					if (result.bool) {
						result.targets.sortBySeat();
						player.removeMark('charge', 1);
						player.logSkill('sbhongyuan', result.targets);
						for (var target of result.targets) target.draw(1);
					}
				},
				group: ['sbhongyuan_draw', 'sbhongyuan_start'],
				subSkill: {
					start: {
						trigger: {
							player: 'enterGame',
							global: 'phaseBefore',
						},
						direct: true,
						filter: function (event, player) {
							return (event.name != 'phase' || game.phaseNumber == 0);
						},
						content: function () {
							player.addMark('charge', 1);
						},
					},
					draw: {
						audio: 'sbhongyuan',
						trigger: {
							global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncTrigger', 'addToExpansionAfter'],
						},
						delay: false,
						filter: function (event, player) {
							var evt = event.getParent();
							if (evt && evt.name == 'useCard' && evt.card && get.type(evt.card) == 'equip') return false;
							var current = event.name == 'loseAsync' ? event.lose_list[event.loseAsyncCount][0] : event.player;
							var evt = event.getl(current);
							return evt && evt.cards2 && evt.cards2.length >= 2 && player != current && player.countMark('charge') > 0 && current.isIn();
						},
						logTarget: function (event, player) {
							var current = event.name == 'loseAsync' ? event.lose_list[event.loseAsyncCount][0] : event.player;
							return current;
						},
						prompt: function (event, player) {
							var current = event.name == 'loseAsync' ? event.lose_list[event.loseAsyncCount][0] : event.player;
							return '你可以消耗1点蓄力点令' + get.translation(current) + '摸2张牌';
						},
						check: function (event, player) {
							var current = event.name == 'loseAsync' ? event.lose_list[event.loseAsyncCount][0] : event.player;
							return get.attitude(player, current) > 0;
						},
						content: function () {
							player.removeMark('charge', 1);
							var current = trigger.name == 'loseAsync' ? trigger.lose_list[trigger.loseAsyncCount][0] : trigger.player;
							current.draw(2);
						},
					},
				},
			},
			sbmingzhe: {
				audio: 2,
				round: 2,
				trigger: {
					player: 'loseAfter',
					global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					var evt = event.getl(player);
					return _status.currentPhase != player && evt && evt.cards2 && evt.cards2.length > 0;
				},
				content: function () {
					'step 0'
					player.chooseTarget(1, true)
						.set('prompt', `选择一名角色令其摸${trigger.getl(player).cards2.some(card => get.type(card) != 'basic') ? '1' : '0'}张牌，若其有蓄力技则其+1蓄力点`)
						.set('ai', function (target) {
							return get.attitude(_status.event.player, target);
						});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						if (trigger.getl(player).cards2.some(card => get.type(card) != 'basic')) target.draw();
						var chargeSKills = target.getSkills(null, false, false).filter(function (i) {
							var info = get.info(i);
							return info && info.chargeSkill && info.getLimit && info.getLimit - player.countMark('charge') > 0;
						});
						if (chargeSKills.length) player.addMark('charge', 1);
					}
				},
				mark: false,
			},
			//谋贾诩
			sbwansha: {
				audio: 2,
				trigger: {
					global: 'dying'
				},
				priority: 15,
				forced: true,
				locked: false,
				filter: function (event, player, name) {
					return _status.currentPhase == player && event.player != player;
				},
				content: function () { },
				global: 'sbwansha_ban',
				group: 'sbwansha_effect',
				subSkill: {
					gain: {
						audio: 1
					},
					effect: {
						audio: 'sbwansha',
						trigger: {
							global: 'dyingBefore'
						},
						delay: false,
						logTarget: function (event, player) {
							return event.player;
						},
						filter: function (event, player) {
							if (event.player == player && game.countPlayer(function (current) {
								return current != player;
							}) <= 0) return false;
							return event.player.hp <= 0 && event.player.countCards('h') > 0;
						},
						prompt: function (event, player) {
							return '你是否发动完杀，观看' + get.translation(event.player) + '的手牌并选择效果';
						},
						check: function (event, player) {
							return get.attitude(player, event.player) < 0;
						},
						content: function () {
							'step 0'
							var cards = trigger.player.getCards('h');
							player.chooseButton(['完杀：选择其中0至2张牌，然后令其选择一项', cards, 'hidden'], [0, 2])
								.set('ai', function (button) {
									let player = _status.event.player, target = trigger.player, name = get.name(button.link), val = get.value(button.link, player), att = get.attitude(player, trigger.player);
									if (name === 'tao') return val + 2 * Math.min(3, -att);
									if (name === 'jiu' && target.hp < 1) return val + 2 * (2.8 - target.hp);
									if (name === 'wuxie' && player.countCards('j') && !player.hasWuxie()) return val + 5;
									return 1 - val * att;
								});
							'step 1'
							if (result.bool) {
								event.cards = result.links;
								var list = [];
								list.push('分配选择的牌');
								list.push('弃置未选择的牌');
								trigger.player.chooseControl(list)
									.set('prompt', '你须选择一项：1.' + get.translation(player) + '分配选择的牌；2.弃置未选择的牌')
									.set('ai', function () {
										var links = result.links;
										if (2 * links.length <= trigger.player.countCards("h") || get.attitude(trigger.player, player) > 0) return "分配选择的牌"
										return "弃置未选择的牌";
									});
							}
							'step 2'
							if (result.control == '弃置未选择的牌') {
								var discards = [];
								for (var card of trigger.player.getCards('h')) if (!event.cards.contains(card)) discards.push(card);
								if (discards.length > 0) trigger.player.discard(discards, 'passive');
								event.finish();
							} else {
								if (event.cards.length > 1) player.chooseCardButton('完杀：请选择要分配的牌', true, event.cards, [1, event.cards.length]).set('ai', function (button) {
									if (ui.selected.buttons.length == 0) return 1;
									return 0;
								});
								else if (event.cards.length == 1) event._result = { links: event.cards.slice(0), bool: true };
								else event.finish();
							}
							'step 3'
							if (result.bool) {
								event.cards.removeArray(result.links);
								event.togive = result.links.slice(0);
								player.chooseTarget('选择一名角色获得' + get.translation(result.links), true, function (card, player, target) {
									return target != trigger.player;
								}).set('ai', function (target) {
									var att = get.attitude(_status.event.player, target);
									if (_status.event.enemy) {
										return -att;
									}
									else if (att > 0) {
										return att / (1 + target.countCards('h'));
									}
									else {
										return att / 100;
									}
								}).set('enemy', get.value(event.togive[0], player, 'raw') < 0);
							}
							'step 4'
							if (result.targets.length) {
								var id = result.targets[0].playerid, map = event.given_map;
								game.log(result.targets[0], '获得了' + get.cnNumber(event.togive.length) + '张', '#g“完杀牌”');
								if (!map[id]) map[id] = [];
								map[id].addArray(event.togive);
							}
							if (cards.length > 0) event.goto(1);
						},
					},
				},
			},
			sbwansha_ban: {
				mod: {
					cardSavable: function (card, player) {
						if (!_status.currentPhase) return;
						if (_status.currentPhase.isIn() && _status.currentPhase.hasSkill('sbwansha') && _status.currentPhase != player) {
							if (card.name == 'tao' && !player.isDying()) return false;
						}
					},
					cardEnabled: function (card, player) {
						if (!_status.currentPhase) return;
						if (_status.currentPhase.isIn() && _status.currentPhase.hasSkill('sbwansha') && _status.currentPhase != player) {
							if (card.name == 'tao' && !player.isDying()) return false;
						}
					}
				}
			},
			sbluanwu: {
				audio: 2,
				inherit: 'luanwu',
			},
			sbweimu: {
				audio: 2,
				trigger: {
					target: 'useCardToTarget'
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.card && (get.type(event.card.viewAs ? event.card.viewAs : event.card) == 'trick' || get.type(event.card.viewAs ? event.card.viewAs : event.card) == 'delay') && get.color(event.card) == 'black';
				},
				content: function () {
					trigger.targets.remove(player);
					trigger.getParent()
						.triggeredTargets2.remove(player);
					trigger.untrigger();
				},
				subSkill: {
					gain: {
						audio: 1
					},
				},
			},
			//谋陆逊
			sbqianxun: {
				audio: 2,
				trigger: {
					target: "useCardToBegin",
					player: "judgeBefore",
				},
				filter: function (event, player) {
					if (!event.card || player.getStorage("sbqianxun").includes(event.card.viewAs || event.card.name)) return false;
					if (event.getParent().name == "phaseJudge") return true;
					if (event.name == "judge") return false;
					if (get.type(event.card) == "trick" && event.player != player) return true;
				},
				forced: true,
				locked: false,
				content: function () {
					"step 0"
					player.markAuto("sbqianxun", [trigger.card.viewAs || trigger.card.name]);
					if (player.countCards("he")) {
						var num = Math.min(5, player.getStorage("sbqianxun").length);
						player.chooseCard(get.prompt(event.name), "将至多" + get.cnNumber(num) + "张牌置于武将牌上", "he", [1, num]).set("ai", function (card) {
							return 4 - get.value(card);
						});
					}
					"step 1"
					if (result.bool) {
						player.addToExpansion(result.cards, "giveAuto", player).gaintag.add("sbqianxun_gain");
						player.addSkill("sbqianxun_gain");
					}
				},
				onremove: true,
				marktext: "谦逊牌名",
				intro: {
					content: "已记录牌名：$",
				},
				group: "sbqianxun_use",
				subSkill: {
					use: {
						audio: "sbqianxun",
						trigger: {
							player: "phaseUseBegin",
						},
						filter: function (event, player) {
							return player.getStorage("sbqianxun").some(name => {
								if (get.type(name) != "trick") return false;
								return player.hasUseTarget(name);
							});
						},
						content: function () {
							"step 0"
							var list = player.getStorage("sbqianxun").filter(name => get.type(name) == "trick").map(name => ["锦囊", "", name]);
							player.chooseButton([get.prompt("sbqianxun"), "视为使用一张已记录的普通锦囊牌", [list, "vcard"]]).set("ai", function (button) {
								var card = { name: button.link[2], isCard: true };
								return player.getUseValue(card);
							}).set("filterButton", function (button) {
								var card = { name: button.link[2], isCard: true };
								return player.hasUseTarget(card);
							});
							"step 1"
							if (result.bool) {
								var name = result.links[0][2];
								player.unmarkAuto("sbqianxun", [name]);
								var card = { name: name, isCard: true };
								player.chooseUseTarget(card, true);
								game.log(player, '移去了一个', '#g【谦逊记录的(' + get.translation(name) + ')】');
							}
						},
					},
					gain: {
						trigger: {
							global: "phaseEnd",
						},
						forced: true,
						charlotte: true,
						content: function (event, trigger, player) {
							var cards = player.getExpansions("sbqianxun_gain");
							if (cards.length) player.gain(cards, "draw");
							player.removeSkill("sbqianxun_gain");
						},
						marktext: "谦逊牌",
						intro: {
							mark: function (dialog, storage, player) {
								var cards = player.getExpansions("sbqianxun_gain");
								if (player.isUnderControl(true)) dialog.addAuto(cards);
								else return "共有" + get.cnNumber(cards.length) + "张牌";
							},
						},
					},
				},
			},
			sblianying: {
				audio: 2,
				trigger: {
					global: "phaseEnd",
				},
				filter: function (event, player) {
					if (player == event.player) return false;
					return player.getHistory("lose", evt => evt.cards2 && evt.cards2.length).length;
				},
				content: function () {
					"step 0"
					var num = 0;
					player.getHistory("lose", evt => {
						if (evt.cards2) num += evt.cards2.length;
					});
					num = Math.min(5, num);
					event.cards = game.cardsGotoOrdering(get.cards(num)).cards;
					if (_status.connectMode) game.broadcastAll(function () { _status.noclearcountdown = true });
					event.given_map = {};
					'step 1'
					if (event.cards.length > 1) {
						player.chooseCardButton('谦逊：请选择要分配的牌', true, event.cards, [1, event.cards.length]).set('ai', function (button) {
							if (ui.selected.buttons.length == 0) return 1;
							return 0;
						});
					}
					else if (event.cards.length == 1) {
						event._result = { links: event.cards.slice(0), bool: true };
					}
					else {
						event.finish();
					}
					'step 2'
					if (result.bool) {
						event.cards.removeArray(result.links);
						event.togive = result.links.slice(0);
						player.chooseTarget('选择一名角色获得' + get.translation(result.links), true).set('ai', function (target) {
							var att = get.attitude(_status.event.player, target);
							if (_status.event.enemy) {
								return -att;
							}
							else if (att > 0) {
								return att / (1 + target.countCards('h'));
							}
							else {
								return att / 100;
							}
						}).set('enemy', get.value(event.togive[0], player, 'raw') < 0);
					}
					'step 3'
					if (result.targets.length) {
						var id = result.targets[0].playerid, map = event.given_map;
						game.log(result.targets[0], '获得了' + get.cnNumber(event.togive.length) + '张', '#g“谦逊牌”');
						if (!map[id]) map[id] = [];
						map[id].addArray(event.togive);
					}
					if (cards.length > 0) event.goto(1);
					'step 4'
					if (_status.connectMode) {
						game.broadcastAll(function () { delete _status.noclearcountdown; game.stopCountChoose() });
					}
					var list = [];
					for (var i in event.given_map) {
						var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						player.line(source, 'green');
						list.push([source, event.given_map[i]]);
					}
					game.loseAsync({
						gain_list: list,
						giver: player,
						animate: 'draw',
					}).setContent('gaincardMultiple');
				},
			},
			//谋公孙瓒
			//义从
			sbyicong: {
				audio: 2,
				trigger: {
					global: "roundStart",
				},
				init: function (player) {
					player.addMark("charge", 2);
				},
				filter: function (event, player) {
					return player.hasMark("charge");
				},
				direct: true,
				chargeSkill: true,
				getLimit: 4,
				content: function () {
					'step 0'
					var list = [];
					for (var i = 1; i <= player.countMark("charge"); i++) {
						list.push(i);
					};
					player.chooseControl(list, '取消').set('prompt', '你可发动义从，消耗任意蓄力点并调整距离');
					'step 1'
					if (result.control && result.control != '取消') {
						player.storage.sbyicong_num = result.control;
						var num = result.control;
						player.chooseControl('距离-' + num, '距离+' + num).set('prompt', '你发动了义从，请选择一项调整距离的方式').set('ai', function () {
							if (player.isHealthy()) return '距离-' + num;
							else return '距离+' + num;
						});
					} else {
						event.finish();
					};
					'step 2'
					if (result.control) {
						player.logSkill("sbyicong");
						player.removeMark("charge", player.getStorage("sbyicong_num"));
						if (result.control.includes('距离-')) {
							player.addTempSkill("sbyicong_to", "roundStart");
							var name = "sha";
						} else if (result.control.includes('距离+')) {
							player.addTempSkill("sbyicong_from", "roundStart");
							var name = "shan";
						};
						if (player.countCards("s", function (card) {
							return card.hasGaintag("sbyicong");
						}) < 4) {
							var card = get.cardPile2(name);
							if (card) {
								game.log(player, "将", card, "置于武将牌上");
								player.loseToSpecial([card], "sbyicong").visible = true;
								player.markSkill("sbyicong");
							};
						};
					};
				},
				marktext: '扈',
				intro: {
					name: "义从",
					mark: function (dialog, storage, player) {
						dialog.addAuto(player.getCards('s', function (card) {
							return card.hasGaintag('sbyicong');
						}));
					},
					markcount: function (storage, player) {
						return player.countCards('s', function (card) {
							return card.hasGaintag("sbyicong");
						});
					},
					onunmark: function (storage, player) {
						var cards = player.getCards('s', function (card) {
							return card.hasGaintag('sbyicong');
						});
						if (cards.length) {
							player.lose(cards, ui.discardPile);
							player.$throw(cards, 1000);
							game.log(cards, '进入了弃牌堆');
						}
					},
				},
				mod: {
					aiOrder: function (player, card, num) {
						if (get.itemtype(card) == 'card' && card.hasGaintag('sbyicong')) return num + 0.5;
					},
				},
				subSkill: {
					to: {
						charlotte: true,
						mod: {
							globalFrom(from, to, distance) {
								return distance - from.getStorage("sbyicong_num");
							},
						},
					},
					from: {
						charlotte: true,
						mod: {
							globalTo(from, to, distance) {
								return distance + to.getStorage("sbyicong_num");
							},
						},
					},
				},
			},
			//趫猛
			sbqiaomeng: {
				audio: 2,
				trigger: {
					source: "damageSource",
				},
				filter: function (event, player) {
					if (!event.card || event.card.name !== "sha") return false;
					return player.hasSkill("sbyicong");
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseControl('弃目标牌并摸牌', '获得蓄力点', '取消').set('prompt', "你可选择一项：1.弃置" + get.translation(trigger.player) + "区域内的1张牌并摸1张牌；2.获得3蓄力点");
					'step 1'
					if (result.control) {
						if (result.control == '弃目标牌并摸牌') {
							player.logSkill("sbqiaomeng", trigger.player);
							player.discardPlayerCard(trigger.player, "hej", true);
							player.draw();
						} else if (result.control == '获得蓄力点') {
							player.logSkill("sbqiaomeng");
							var num = Math.min(3, lib.skill.sbyicong.getLimit - player.countMark("charge"));
							if (num > 0) player.addMark("charge", num);
						} else {
							event.finish();
						};
					};
				},
			},

			//韩当
			//弓骑
			sbgongji: {
				audio: 2,
				mod: {
					attackRange: (player, num) => num + 4,
				},
				trigger: {
					player: "phaseUseBegin",
				},
				direct: true,
				locked: false,
				content: function () {
					'step 0'
					player.chooseToDiscard('你可弃置1张牌，此阶段对应颜色方可响应你的牌', 'he').set('ai', function (card) {
						if (get.position(card) == 'h' && get.color(card) == 'black' && get.value(card) <= 6) return 10;
						if (get.position(card) == 'h' && get.color(card) == 'red' && get.value(card) <= 6) return 5;
						return -1;
					});
					'step 1'
					if (result.bool) {
						player.logSkill("sbgongji");
						var color = get.color(result.cards[0]);
						for (var target of game.filterPlayer(current => current != player)) {
							target.storage.sbgongji_jin = color;
						};
						player.addTempSkill("sbgongji_use", "phaseUseEnd");
						if (color == 'red') {
							var str = '弓骑 红色'
						} else if (color == 'black') {
							var str = '弓骑 黑色'
						} else {
							var str = '弓骑 无色'
						};
						player.markSkill("sbgongji_use", "弓骑", str);
					};
				},
				subSkill: {
					use: {
						trigger: {
							player: "useCardToPlayer",
						},
						direct: true,
						firstDo: true,
						onremove: true,
						content: function () {
							for (var players of game.filterPlayer(current => current != player)) {
								players.addTempSkill("sbgongji_jin");
							};
						},
					},
					jin: {
						mod: {
							cardEnabled2: function (card, player) {
								if (!_status.dying.length && get.color(card) != player.storage.sbgongji_jin && get.position(card) == 'h') return false;
							},
						},
						trigger: {
							global: "useCardAfter",
						},
						filter: function (event, player) {
							return (_status.currentPhase && event.player == _status.currentPhase);
						},
						direct: true,
						firstDo: true,
						charlotte: true,
						content: function () {
							player.removeSkill('sbgongji_jin');
						},
					},
				},
			},

			//解烦
			sbjiefan: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filterTarget: true,
				filter: function (event, player) {
					return !player.hasSkill('sbjiefan_used');
				},
				content: function () {
					'step 0'
					event.targets = game.filterPlayer(current => {
						return current.inRange(target);
					});
					event.num = event.targets.length;
					target.chooseControl("背水", "摸" + event.num + "张牌", "其他角色弃1张牌").set('prompt', "摸" + event.num + "张牌，或让能攻击到你的角色弃1张牌");
					'step 1'
					if (result.control) {
						game.log(target, "选择了", "#g" + result.control);
						if (result.control.includes("背水")) {
							for (var current of event.targets) {
								current.chooseToDiscard("解烦：请选择弃置1张牌", "he", true);
							};
							target.draw(event.num);
							player.addTempSkill("sbjiefan_used", { source: "die" });
						} else if (result.control.includes("摸")) {
							target.draw(event.num);
						} else if (result.control == "其他角色弃1张牌") {
							for (var current of event.targets) {
								current.chooseToDiscard(get.translation(player) + "发动了解烦，须选择弃置1张牌", "he", true);
							};
						};
					};
				},
				subSkill: {
					used: { charlotte: true },
				},
				ai: {
					order: 10,
					result: {
						target: 1,
						player: 1,
					},
				},
			},
			//谋夏侯惇
			sbganglie: {
				audio: 2,
				enable: 'phaseUse',
				filterTarget: function (card, player, target) {
					var targets = [], ganglied = [];
					var history = player.getAllHistory();
					for (var i = history.length - 1; i >= 0; i--) {
						if (history[i].damage) {
							history[i].damage.forEach(evt => {
								if (evt.source && evt.source != player && !targets.includes(evt.source)) targets.push(evt.source);
							});
						}
						if (history[i].useSkill) {
							history[i].useSkill.forEach(evt => {
								if (evt.skill == 'sbganglie' && evt.targets && evt.targets.length && !ganglied.includes(evt.targets[0])) ganglied.push(evt.targets[0]);
							});
						}
					}
					return targets.includes(target) && !ganglied.includes(target);
				},
				content: function () {
					event.targets[0].damage(2);
				},
				ai: {
					order: 6,
					result: {
						target: -2,
					}
				},
			},
			sbqingjian: {
				audio: 2,
				trigger: {
					global: ['loseAfter', 'cardsDiscardAfter', 'loseAsyncAfter', 'equipAfter'],
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					if (player.getExpansions('sbqingjian').length >= Math.max(1, player.hp - 1)) return false;
					if (event.name !== 'cardsDiscard') {
						if (event.position !== ui.discardPile) return false;
						if (!game.hasPlayer(current => {
							const evt = event.getl(current);
							return evt.cards && evt.cards.length > 0;
						})) return false;
					}
					else {
						const evt = event.getParent();
						if (evt.relatedEvent && evt.relatedEvent.name === 'useCard') return false;
					}
					return true;
				},
				group: 'sbqingjian_give',
				content: function (event, trigger, player) {
					let cards = trigger.cards.slice();
					const maxNum = Math.max(1, player.hp - 1);
					const myLen = player.getExpansions('sbqingjian').length, cardsLen = trigger.cards.length;
					const overflow = myLen + cardsLen - maxNum;
					if (overflow > 0) cards.randomRemove(overflow);
					const next = player.addToExpansion(cards, 'gain2');
					next.gaintag.add('sbqingjian');
				},
				marktext: '俭',
				intro: {
					content: 'expansion',
					markcount: 'expansion',
				},
				subSkill: {
					give: {
						audio: 'sbqingjian',
						trigger: { player: 'phaseUseEnd' },
						filter: function (event, player) {
							return player.getExpansions('sbqingjian').length > 0;
						},
						forced: true,
						locked: false,
						content: function (event, trigger, player) {
							'step 0'
							event.cards = player.getExpansions('sbqingjian').slice();
							if (event.cards.length > 1) player.chooseCardButton('将所有“清俭”交给任意名角色', true, event.cards, [1, event.cards.length]).set('ai', () => ui.selected.buttons.length ? 0 : 1);
							else if (event.cards.length == 1) event._result = { links: event.cards.slice(0), bool: true };
							'step 1'
							if (result.bool) {
								event.cards.removeArray(result.links);
								event.togive = result.links.slice(0);
								player.chooseTarget('将' + get.translation(result.links) + '交给一名角色', true).set('ai', target => {
									var att = get.attitude(_status.event.player, target);
									if (_status.event.enemy) return -att;
									else if (att > 0) return att / (1 + target.countCards('h'));
									else return att / 100;
								}).set('enemy', get.value(event.togive[0], player, 'raw') < 0);
							}
							'step 2'
							if (result.targets.length) {
								result.targets[0].gain(event.togive, 'draw').giver = player;
								player.line(result.targets[0], 'green');
								game.log(result.targets[0], '获得了' + get.cnNumber(event.togive.length) + '张', '#g“清俭牌”');
								if (event.cards.length) event.goto(0);
							}
						}
					},
				},
			},
			sbxianzhen: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filterTarget: lib.filter.notMe,
				content: function () {
					player.storage.sbxianzhen_a = target;
					player.addTempSkill('sbxianzhen_a');
					player.addTempSkill('sbxianzhen_c');
				},
				subSkill: {
					a: {
						audio: 'sbxianzhen',
						charlotte: true,
						mark: true,
						marktext: '陷阵',
						intro: {
							markcount: function (storage, player) {
								return get.translation(storage);
							}
						},
						onremove: function (player) {
							delete player.storage.sbxianzhen_a;
						},
						mod: {
							targetInRange: function (card, player, target) {
								if (target == player.storage.sbxianzhen_a) {
									return true;
								}
							},
						},
						trigger: { player: 'useCardToTarget' },
						filter: function (event, player) {
							return event.card && event.card.name == 'sha' && event.target == player.storage.sbxianzhen_a && player.canCompare(event.target);
						},
						'prompt': '是否和目标拼点',
						content: function () {
							'step 0'
							player.chooseToCompare(trigger.target);
							'step 1'
							if (result.bool) {
								if (!player.hasSkill('sbxianzhen_f')) {
									player.addTempSkill('sbxianzhen_f');
									trigger.target.damage();
								}
								event.getParent(4).sbxianzhen = true;
								player.addTempSkill('sbxianzhen_r');
								trigger.target.addTempSkill('qinggang2');
								trigger.target.storage.qinggang2.add(trigger.card);
								trigger.target.markSkill('qinggang2');
							}
						}
					},
					c: {
						charlotte: true,
						direct: true,
						trigger: {
							player: ["chooseToCompareAfter", "compareMultipleAfter"],
							target: ["chooseToCompareAfter", "compareMultipleAfter"],
						},
						filter: function (event, player) {
							if (event.preserve) return false;
							if (!event.compareName || event.compareName != 'sbxianzhen_a') return false;
							if (player == event.player) {
								return get.name(event.card2) == 'sha';
							}
							else {
								return get.name(event.card1) == 'sha';
							}
						},
						content: function () {
							if (player == trigger.player) {
								player.gain(trigger.card2, 'gain2', 'log');
							}
							else {
								player.gain(trigger.card1, 'gain2', 'log');
							}
						}


					},
					f: { charlotte: true },
					r: {
						trigger: {
							player: "useCardAfter",
						},
						forced: true,
						popup: false,
						charlotte: true,
						onremove: true,
						filter: function (event, player) {
							return event.card.name == 'sha' && event.sbxianzhen;
						},
						content: function () {
							if (trigger.addCount !== false) {
								trigger.addCount = false;
								trigger.player.getStat().card.sha--;
							}
							player.removeSkill('sbxianzhen_r');
						},
					},
				},
				ai: {
					expose: 0.6,
					order: 10,
					result: {
						target: function (target) {
							var player = _status.event.player;
							return get.effect(target, { name: 'sha' }, player, player) + 1;
						}
					}
				},
			},
			sbjinjiu: {
				audio: 2,
				global: "decadejinjiu_global",
				mod: {
					cardname: function (card) {
						if (card.name == 'jiu') return 'sha';
					},
				},
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				audio: true,
				filter: function (event, player) {
					return event.getParent('useCard')?.jiu;
				},
				content: function () {
					trigger.num = 1;
				},
				ai: {
					filterDamage: true,
				},
				group: 'sbjinjiu_c',
				subSkill: {
					c: {
						trigger: {
							player: "compare",
							target: "compare",
						},
						forced: true,
						charlotte: true,
						filter: function (event, player) {
							if (event.player == player) {
								return get.name(event.card2) == 'jiu'
							}
							else return get.name(event.card1) == 'jiu'
						},
						content: function () {
							if (player == trigger.player) {
								trigger.num2 = 1;
							}
							else trigger.num2 = 1;
							game.log(player, '将目标的拼点牌点数改为1');
						}
					}
				}
			},
			sb_huoji: {
				audio: 2,
				dutySkill: true,
				locked: true,
				group: ["sb_huoji_achieve", "sb_huoji_fail", "sb_huoji_fire"],
				derivation: ["sb_guanxing", "sb_kongcheng"],
				prompt: "对一名其他角色以及其同势力角色造成一点火焰伤害",
				owner: "sb_sp_zhugeliang",
				subSkill: {
					achieve: {
						audio: "sb_huoji",
						trigger: {
							player: "phaseZhunbeiBegin",
						},
						forced: true,
						skillAnimation: true,
						animationColor: "fire",
						filter: function (event, player) {
							return player.storage.sb_huoji >= game.countPlayer2();
						},
						content: function () {
							player.awakenSkill('sb_huoji');
							game.log(player, '成功完成使命');
							player.removeSkill(['sb_huoji', 'sb_kanpo']);
							player.addSkill(['sb_guanxing', 'sb_kongcheng']);
							player.swapBackground('sb_huoji');
						},
					},
					fail: {
						audio: "sb_huoji",
						trigger: {
							player: "dying",
						},
						forced: true,
						content: function () {
							game.log(player, '使命失败');
							player.awakenSkill('sb_huoji');
						},
						sub: true,
					},
					fire: {
						trigger: {
							source: "damageEnd",
						},
						forced: true,
						filter: function (event, player) {
							return event.nature == 'fire' && player.storage.sb_huoji < game.countPlayer2();
						},
						content: function () {
							player.storage.sb_huoji++;
							player.syncStorage('sb_huoji');
						},
						sub: true,
					}
				},
				mark: true,
				marktext: "火计",
				intro: {
					name: "火计",
					content: "当前已造成#次火焰伤害",
				},
				init: function (player) {
					if (!player.storage.sb_huoji) player.storage.sb_huoji = 0;
				},
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					target.damage(1, 'fire');
					var targets = game.filterPlayer();
					for (var i = 0; i < targets.length; i++) {
						if (targets[i] != player && targets[i] != target && targets[i].group == target.group) {
							targets[i].damage(1, "fire");
						}
					}
				},
				ai: {
					order: function (item, player) {
						return get.order({
							name: 'tiesuo'
						}) - 0.5;
					},
					fireAttack: true,
					result: {
						target: function (player, target, current) {
							var dy = game.countPlayer(function (current) {
								if (current != player && current != target && !current.hasSkillTag('nodamage')) {
									return current.group == target.group && get.attitude(player, current) > 0;
								}
							});
							var dr = game.countPlayer(function (current) {
								if (current != player && current != target && !current.hasSkillTag('nodamage')) {
									return current.group == target.group && get.attitude(player, current) < 0;
								}
							});
							var cxdy = game.countPlayer(function (current) {
								if (current != player && current != target && !current.hasSkillTag('nodamage')) {
									return current.group == target.group && get.attitude(player, current) > 0 && (current.hp <= 1 || current.hp <= 2 && current.getEquip('tengjia'));
								}
							});
							if (cxdy == 0 && dr > dy) return get.damageEffect(target, player) + (dr - dy);
							if (cxdy == 0 && dr == dy) return 2 / get.damageEffect(target, player);
						},
					},
				},
			},
			sb_kanpo: {
				audio: 2,
				trigger: {
					global: "roundStart",
				},
				mark: true,
				marktext: "看破",
				onremove: true,
				intro: {
					content: function (storage, player) {
						if (player == game.me || player.isUnderControl()) {
							var str = '【看破】已记录';
							for (var i = 0; i < storage.length; i++) {
								str += ('' + get.translation(player.storage.sb_kanpo[i]) + '');
								if (i < storage.length - 1) str += ', ';
							}
							str += ''
							return str;
						}
					},
				},
				init: function (player) {
					if (!player.storage.sb_kanpo) player.storage.sb_kanpo = [];
					if (!player.storage.sb_kanpo2) player.storage.sb_kanpo2 = [];
				},
				content: function () {
					'step 0'
					var list1 = [],
						list2 = [],
						list3 = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						var type = get.type(lib.inpile[i]);
						if (type == 'basic') {
							list1.push(['基本', '', lib.inpile[i]]);
						} else if (type == 'trick') {
							list2.push(['锦囊', '', lib.inpile[i]]);
						} else if (type == 'delay') {
							list3.push(['锦囊', '', lib.inpile[i]]);
						}
					}
					player.chooseButton([get.prompt('sb_kanpo'), [list1.concat(list2).concat(list3), 'vcard']]).set('filterButton', function (button) {
						var player = _status.event.player;
						if (player.storage.sb_kanpo2 && player.storage.sb_kanpo2.contains(button.link[2])) return false;
						return true;
					}).set('ai', function (button) {
						var rand = _status.event.rand;
						switch (button.link[2]) {
							case 'sha':
								return 5 + rand[1];
							case 'tao':
								return 4 + rand[2];
							case 'lebu':
								return 3 + rand[3];
							case 'shan':
								return 4.5 + rand[4];
							case 'wuzhong':
								return 4 + rand[5];
							case 'shunshou':
								return 3 + rand[6];
							case 'nanman':
								return 2 + rand[7];
							case 'wanjian':
								return 2 + rand[8];
							default:
								return rand[0];
						}
					}).set('rand', [Math.random(), Math.random(), Math.random(), Math.random(),
					Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]);
					'step 1'
					if (result.bool) {
						event.cardname = result.links[0][2];
						player.storage.sb_kanpo.push(event.cardname);
						player.syncStorage('sb_kanpo');
						player.markSkill('sb_kanpo');
						if (player.storage.sb_kanpo.length < 3) event.goto(0);
					} else {
						event.finish();
					}
					'step 2'
					player.storage.sb_kanpo2.length = 0;
					for (var i = 0; i < player.storage.sb_kanpo.length; i++) {
						player.storage.sb_kanpo2.push(player.storage.sb_kanpo[i]);
					}
				},
				group: ["sb_kanpo_use", "sb_kanpo_clear"],
				subSkill: {
					clear: {
						trigger: {
							global: "roundStart",
						},
						forced: true,
						silent: true,
						popup: false,
						firstDo: true,
						filter: function (event, player) {
							return player.storage.sb_kanpo && player.storage.sb_kanpo.length > 0;
						},
						content: function () {
							player.storage.sb_kanpo.length = 0;
						},
						sub: true,
					},
					use: {
						trigger: {
							global: "useCard",
						},
						audio: "sb_kanpo",
						filter: function (event, player) {
							if (event.player == player) return false;
							return player.storage.sb_kanpo && player.storage.sb_kanpo.contains(event.card.name) && event.player.getHistory('lose', function (evt) {
								return evt.getParent() == event && evt.hs && evt.hs.length == event.cards.length;
							}).length;
						},
						direct: true,
						content: function () {
							"step 0"
							var effect = 0;
							if (trigger.card.name == 'wuxie' || trigger.card.name == 'shan') {
								if (get.attitude(player, trigger.player) < -1) {
									effect = -1;
								}
							} else if (trigger.targets && trigger.targets.length) {
								for (var i = 0; i < trigger.targets.length; i++) {
									effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
								}
							}
							var str = '看破：是否令' + get.translation(trigger.player);
							if (trigger.targets && trigger.targets.length) {
								str += '对' + get.translation(trigger.targets);
							}
							str += '使用的' + get.translation(trigger.card) + '失效？'
							var next = player.chooseBool(str, function () {
								var player = _status.event.player;
								var trigger = _status.event.getTrigger();
								if (get.attitude(player, trigger.player) < 0) {
									if (trigger.card.name == 'sha') {
										var target = trigger.targets[0];
										if (target == player) {
											return !player.countCards('h', 'shan');
										} else {
											return get.attitude(player, target) > 0 || target.hp == 1 || (target.countCards('h') <= 2 && target.hp <= 2);
										}
									} else {
										return true;
									}
								}
								return false;
							});
							next.set('effect', effect);
							"step 1"
							if (result.bool) {
								player.logSkill('sb_kanpo', trigger.player);
								var index = player.storage.sb_kanpo.indexOf(trigger.card.name);
								if (index != -1) {
									player.storage.sb_kanpo.splice(index, 1);
									if (player.storage.sb_kanpo.length == 0) {
										player.unmarkSkill('sb_kanpo');
									} else {
										player.syncStorage('sb_kanpo');
										player.markSkill('sb_kanpo');
									}
								}
								trigger.targets.length = 0;
								trigger.all_excluded = true;
								player.draw();
							}
						},
						ai: {
							threaten: 1.8,
							expose: 0.3,
						},
						sub: true,
					},
				},
			},
			sb_guanxing: {
				audio: 2,
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				init: function (player) {
					if (!player.storage.sb_guanxing) player.storage.sb_guanxing = 0;
				},
				filter: function (event, player) {
					return player.storage.sb_guanxing < 3;
				},
				content: function () {
					'step 0'
					var cards = player.getCards('s', function (card) {
						return card.hasGaintag('sb_guanxing');
					});
					if (cards.length) player.loseToDiscardpile(cards);
					player.loseToSpecial(get.cards(7 - player.storage.sb_guanxing * 3), 'sb_guanxing').visible = true;
					player.storage.sb_guanxing++;
					'step 1'
					var choiceList = [
						'将任意张“星”置于牌堆顶',
						'结束阶段，你可以将任意张“星”置于牌堆顶'
					];
					var next = player.chooseControl('cancel2');
					next.set('choiceList', choiceList);
					next.set('prompt', get.prompt('sb_guanxing'));
					next.set('ai', function () { return false });
					'step 2'
					if (result.control != 'cancel2') {
						player.logSkill('sb_guanxing');
						if (result.index == 0) {
							var cards = player.getCards('s', function (card) {
								return card.hasGaintag('sb_guanxing');
							});
							var next = player.chooseToMove('观星：将任意张牌置于牌堆顶', true);
							next.set('list', [
								['本次弃置的牌', cards],
								['牌堆顶'],
							]);
							next.set('filterOk', function (moved) {
								return moved[1].length > 0;
							});
							next.set('processAI', function (list) {
								var cards = list[0][1].slice(0), cards2 = cards.filter(function (i) {
									return get.type(i, false) == 'equip';
								}), cards3;
								if (cards2.length) {
									cards3 = cards2.randomGet();
								}
								else cards3 = cards.randomGet();
								return [[], [cards3]];
							})
						} else {
							player.addTempSkill('sb_guanxing_push');
						}
					}
					'step 3'
					if (result.bool) {
						var cards = result.moved[1];
						game.log(player, '将', cards, '置于了牌堆顶');
						while (cards.length) ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild)
					}
				},
				mark: true,
				marktext: "星",
				intro: {
					mark: function (dialog, storage, player) {
						dialog.addAuto(player.getCards('s', function (card) {
							return card.hasGaintag('sb_guanxing');
						}));
					},
					markcount: function (storage, player) {
						return player.getCards('s', function (card) {
							return card.hasGaintag('sb_guanxing');
						}).length;
					},
					onunmark: function (storage, player) {
						var cards = player.getCards('s', function (card) {
							return card.hasGaintag('sb_guanxing');
						});
						if (cards.length) {
							player.lose(cards, ui.discardPile);
							player.$throw(cards, 1000);
							game.log(cards, '进入了弃牌堆');
						}
					},
				},
				mod: {
					aiOrder: function (player, card, num) {
						if (get.itemtype(card) == 'card' && card.hasGaintag('sb_guanxing')) return num + 0.5;
					},
				},
				subSkill: {
					push: {
						audio: "guanxing",
						trigger: {
							player: "phaseJieshuBegin",
						},
						filter: function (event, player) {
							return player.getCards('s', function (card) {
								return card.hasGaintag('sb_guanxing');
							}).length > 0;
						},
						check: function (event, player) {
							return false;
						},
						content: function () {
							'step 0'
							var cards = player.getCards('s', function (card) {
								return card.hasGaintag('sb_guanxing');
							});
							var next = player.chooseToMove('观星：将任意张牌置于牌堆顶', true);
							next.set('list', [
								['星', cards],
								['牌堆顶'],
							]);
							next.set('filterOk', function (moved) {
								return moved[1].length > 0;
							});
							next.set('processAI', function (list) {
								var cards = list[0][1].slice(0), cards2 = cards.filter(function (i) {
									return get.type(i, false) == 'equip';
								}), cards3;
								if (cards2.length) {
									cards3 = cards2.randomGet();
								}
								else cards3 = cards.randomGet();
								return [[], [cards3]];
							})
							'step 1'
							if (result.bool) {
								var cards = result.moved[1];
								game.log(player, '将', cards, '置于了牌堆顶');
								while (cards.length) ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild)
							}
						},
						sub: true,
					},
				},
			},
			sb_kongcheng: {
				audio: 2,
				trigger: {
					player: "damageBegin",
				},
				forced: true,
				direct: true,
				filter: function (event, player) {
					return player.getCards('s', function (card) {
						return card.hasGaintag('sb_guanxing');
					}).length > 0;
				},
				content: function () {
					'step 0'
					if (player.getCards('s', function (card) {
						return card.hasGaintag('sb_guanxing');
					}).length > 0) {
						player.judge(function (card) {
							var number = get.number(card);
							if (number <= player.getCards('s', function (card) {
								return card.hasGaintag('sb_guanxing');
							}).length) return 1;
							else return -1;
							return 0;
						});
					} else {
						trigger.num++;
					}
					'step 1'
					if (result.number <= player.getCards('s', function (card) {
						return card.hasGaintag('sb_guanxing');
					}).length) trigger.num--;
				},
			},
			sbxingshang: {
				audio: 2,
				trigger: { global: ['damageEnd'] },
				filter: function (event, player) {
					if (player.countMark("sbxingshang") >= get.info("sbxingshang").getLimit) return false;
					return !player.hasSkill('sbxingshang_air');
				},
				forced: true,
				locked: false,
				content: function () {
					player.addTempSkill('sbxingshang_air');
					player.addMark("sbxingshang", Math.min(2, get.info("sbxingshang").getLimit - player.countMark("sbxingshang"))
					);
				},
				marktext: '颂',
				intro: { content: 'mark' },
				getLimit: 9,
				group: ['sbxingshang_use', 'sbxingshang_die'],
				subSkill: {
					air: {},
					die: {
						trigger: { global: ['die'] },
						auido: "sbxingshang",
						filter: function (event, player) {
							if (player.countMark("sbxingshang") >= get.info("sbxingshang").getLimit) return false;
							return true;
						},
						forced: true,
						locked: false,
						content: function () {
							player.addMark("sbxingshang", Math.min(2, get.info("sbxingshang").getLimit - player.countMark("sbxingshang")));
						},
					},
					use: {
						enable: 'phaseUse',
						usable: 2,
						filter: function (event, player) {
							return player.countMark('sbxingshang') >= 2;
						},
						filterTarget: 1,
						direct: true,
						content: function () {
							'step 0'
							player.chooseButton(['请选择【行殇】要执行的效果', [
								[
									['sbxingshang1_1', '移除两枚〖颂〗：令' + get.translation(target) + '摸' + get.cnNumber(Math.min((Math.max(game.dead.length, 2)), 5)) + '张牌'],
									['sbxingshang1_2', '移除两枚〖颂〗：令' + get.translation(target) + '复原武将牌'],
									['sbxingshang1_3', '移除五枚〖颂〗：令' + get.translation(target) + '增加一点体力上限并回复一点体力，然后随机恢复一个已废除的装备栏'],
									['sbxingshang1_4', '移除五枚〖颂〗：追思一名已死亡武将'],
								], 'textbutton'
							]], true).set('filterButton', function (button) {
								var player = _status.event.player;
								if (button.link == 'sbxingshang1_3' && (target.maxHp >= 9 || player.countMark('sbxingshang') < 5)) return false;
								if (button.link == 'sbxingshang1_4' && (player.countMark('sbxingshang') < 5 || target != player || game.dead.length == 0)) return false;
								return true;
							}).set('ai', function (button) {
								var player = _status.event.player;
								if (button.link == 'sbxingshang1_1') return 2;
								if (button.link == 'sbxingshang1_2' && target.isTurnedOver() && get.attitude(player, target) > 3) return 2.5;
								if (button.link == 'sbxingshang1_3' && player.countMark('sbxingshang') > 5 && target.maxHp < 9) return 5;
								if (button.link == 'sbxingshang1_4' && player.countMark('sbxingshang') > 5 && target.maxHp >= 9 && game.dead.length <= 2) return 3;
							}).set('selectButton', 1);
							'step 1'
							if (result.bool) {
								player.logSkill('sbxingshang')
								var choices = result.links;
								if (choices.contains('sbxingshang1_1')) {
									player.removeMark('sbxingshang', 2);
									target.draw(Math.min((Math.max(game.dead.length, 2)), 5));
									event.finish();
								}
								if (choices.contains('sbxingshang1_2')) {
									player.removeMark('sbxingshang', 2);
									if (target.isLinked()) target.link();
									if (target.isTurnedOver()) target.turnOver();
									event.finish();
								}
								if (choices.contains('sbxingshang1_3')) {
									player.removeMark('sbxingshang', 5);
									if (target.maxHp < 9) {
										target.gainMaxHp();
										target.recover();
									}
									if (target.storage.disableEquip != undefined && target.storage.disableEquip.length > 0) {
										var list = [];
										for (var i = 1; i < 6; i++) {
											if (!target.isDisabled(i)) continue;
											list.push('equip' + i);
										}
										target.enableEquip(list.randomGet());
									}
									event.finish();
								}
								if (choices.contains('sbxingshang1_4')) {
									player.removeMark('sbxingshang', 5);
									event.goto(2);
								}
							} else {
								event.finish();
								delete player.getStat('skill').sbxingshang_use;
							}
							'step 2'
							if (target == player && game.dead.length > 0 && game.hasPlayer2(function (current) {
								return game.dead.includes(current) && current.canZhuisi();
							})) {
								var list = [];
								game.dead.forEach(function (current) {
									if (current != player && current.canZhuisi()) list.add([current, get.translation(current)]);
								});
								player.chooseButton([get.prompt('sbxingshang'),
									'选择要追思的武将',
								[list, 'textbutton']], true).set('ai', function (button) {
									return list.randomGet();
								}).set('selectButton', 1);
							}
							else event.finish();
							'step 3'
							if (result.bool) {
								var death = result.links[0].name;
								if (lib.character[death] && lib.character[death][3].length) {
									for (var i of lib.character[death][3]) {
										player.addSkill(i);
									}
									_status.zhuisi.add(result.links);
									if (lib.character[player.name] && lib.character[player.name][3].length) {
										for (var j of lib.character[player.name][3]) {
											player.removeSkill(j);
										}
									}
								}
							}
						},
						ai: {
							order: 7.5,
							result: {
								player: -0.1,
								target: 1.1,
							}
						},
						sub: true,
					},
				},
			},
			sbfangzhu: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return player.hasSkill('sbxingshang') && player.countMark('sbxingshang') >= 1;
				},
				filterTarget: lib.filter.notMe,
				direct: true,
				content: function () {
					'step 0'
					var list = [];
					for (var i = 1; i <= player.countMark('sbxingshang'); i++) {
						var list2 = [i];
						switch (i) {
							case 1:
								list2.push('1枚：直到' + get.translation(target) + '下回合结束，其不能使用除基本牌以外的手牌');
								list.push(list2);
								break;
							case 2:
								if (get.mode() != 'doudizhu') {
									list2.push('2枚：直到' + get.translation(target) + '下回合结束<br>①其武将技能失效<br>②不可响应另一名角色使用的牌<br>③不能使用除锦囊牌以外的手牌');
								} else {
									list2.push('2枚：直到' + get.translation(target) + '下回合结束<br>①不可响应另一名角色使用的牌<br>②不能使用除锦囊牌以外的手牌');
								}
								list.push(list2);
								break;
							case 3:
								if (get.mode() != 'doudizhu') {
									list2.push('3枚：<br>①' + get.translation(target) + '翻面<br>②直到' + get.translation(target) + '下回合结束，其不能使用装备牌以外的手牌');
								}
								list.push(list2);
								break;
						}
					}
					player.chooseButton([get.prompt('sbxingshang'),
						'移除任意数量的“颂”标记并执行对应选项',
					[list, 'textbutton']]).set('ai', function (button) {
						var player = _status.event.player;
						return list.randomGet();
					}).set('selectButton', 1);
					'step 1'
					if (result.bool) {
						if (result.links == 1) {
							player.removeMark('sbxingshang', 1);
							event.goto(2);
						}
						else if (result.links == 2) {
							player.removeMark('sbxingshang', 2);
							event.goto(3);
						}
						else if (result.links == 3) {
							player.removeMark('sbxingshang', 3);
							event.goto(6);
						}
						player.logSkill('sbfangzhu');
					} else {
						event.finish();
						delete player.getStat('skill').sbfangzhu;
					}
					'step 2'
					target.addTempSkill('sbfangzhu_4', { player: 'phaseEnd' });
					target.storage.sbfangzhu_4.add('basic');
					target.updateMarks('sbfangzhu_4');
					event.finish();
					'step 3'
					player.chooseButton(['请选择【放逐】执行效果', [
						[
							['sbfangzhu2_1', '令' + get.translation(target) + '技能失效'],
							['sbfangzhu2_2', '令' + get.translation(target) + '不可响应另一名角色使用的牌'],
							['sbfangzhu2_3', '令' + get.translation(target) + '不能使用除锦囊牌以外的手牌'],
						], 'textbutton'
					]], true).set('filterButton', function (button) {
						var player = _status.event.player;
						var skill = target.getSkills(null, false, false).filter(function (i) {
							var info = get.info(i);
							return info && !info.charlotte;
						});
						if (button.link == 'sbfangzhu2_1' && skill.length == 0) return false;
						if (button.link == 'sbfangzhu2_1' && get.mode() == 'doudizhu') return false;
						return true;
					}).set('ai', function (button) {
						if (button.link == 'sbfangzhu2_2') return 0.5;
						if (button.link == 'sbfangzhu2_1') return 1.5;
						if (button.link == 'sbfangzhu2_3' && target.countCards('h') > 3) return 2;
						if (button.link == 'sbfangzhu2_3') return 1;
					}).set('selectButton', 1);
					'step 4'
					var choices = result.links;
					if (choices.contains('sbfangzhu2_1')) {
						target.addTempSkill('baiban', { player: 'phaseEnd' });
						event.finish();
					}
					else if (choices.contains('sbfangzhu2_3')) {
						target.addTempSkill('sbfangzhu_5', { player: 'phaseEnd' });
						target.storage.sbfangzhu_5.add('trick');
						target.updateMarks('sbfangzhu_5');
						event.finish();
					}
					else {
						player.chooseTarget(function (card, player, target) {
							return target != _status.event.getParent().target;
						}, true, '请选择一名角色令' + get.translation(target) + '不能响应其使用的牌').ai = function (target) {
							var player = _status.event.player;
							if (target == player) return get.attitude(player, target) * 2;
							return get.attitude(player, target);
						};
					}
					'step 5'
					if (result.bool) {
						target.addTempSkill('sbfangzhu_1', { player: 'phaseEnd' });
						target.storage.sbfangzhu1 = result.targets[0];
						result.targets[0].addSkill('sbfangzhu_2');
						result.targets[0].storage.sbfangzhu2 = target;
					}
					event.finish();
					'step 6'
					player.chooseButton(['请选择【放逐】执行效果', [
						[
							['sbfangzhu3_1', '令' + get.translation(target) + '翻面'],
							['sbfangzhu3_2', '令' + get.translation(target) + '不能使用除装备牌以外的手牌'],
						], 'textbutton'
					]], true).set('filterButton', function (button) {
						var player = _status.event.player;
						return true;
					}).set('ai', function (button) {
						if (button.link == 'sbfangzhu3_2' && target.countCards('h') >= 3) return 3;
						if (button.link == 'sbfangzhu3_1' && get.attitude(player, target) < 0 && !target.isTurnedOver()) return 2;
						if (button.link == 'sbfangzhu3_2') return 1;
					}).set('selectButton', 1);
					'step 7'
					var choices = result.links;
					if (choices.contains('sbfangzhu3_1')) {
						target.turnOver(true);
						event.finish();
					}
					else {
						target.addTempSkill('sbfangzhu_3', { player: 'phaseEnd' });
						target.storage.sbfangzhu_3.add('equip');
						target.updateMarks('sbfangzhu_3');
					}
				},
				ai: {
					order: 12,
					result: {
						player: 0.1,
						target: -2,
					}
				},
				subSkill: {
					1: {
						onremove: function (player) {
							game.players.forEach(function (current) {
								delete player.storage.sbfangzhu1;
								if (current.hasSkill('sbfangzhu_2') && current.storage.sbfangzhu2 == player) current.removeSkill('sbfangzhu_2');
							});
						},
						mark: true,
						marktext: "放逐",
						charlotte: true,
						intro: {
							content: function (storage, player) {
								return '<div>不能响应' + (get.translation(player.storage.sbfangzhu1)) + '使用的牌。';
							},
						},
					},
					2: {
						trigger: { player: 'useCard' },
						content: function () {
							trigger.directHit.add(player.storage.sbfangzhu2);
						},
						direct: true,
						charlotte: true,
						onremove: function (player) {
							delete player.storage.sbfangzhu2;
						},
					},
					3: {
						mark: true,
						marktext: "放逐",
						intro: {
							content: '只能使用手中的装备牌直到回合结束',
							markcount: '装备',
						},
						unique: true,
						charlotte: true,
						onremove: true,
						init: function (player, skill) {
							if (!player.storage[skill]) player.storage[skill] = [];
						},
						mod: {
							cardEnabled: function (card, player) {
								if (!player.getStorage('sbfangzhu_3').includes(get.type2(card))) return false;
							},
							cardSavable: function (card, player) {
								if (!player.getStorage('sbfangzhu_3').includes(get.type2(card))) return false;
							},
						},
					},
					4: {
						mark: true,
						marktext: "放逐",
						intro: {
							content: '只能使用手中的基本牌直到回合结束',
							markcount: '基本',
						},
						unique: true,
						charlotte: true,
						onremove: true,
						init: function (player, skill) {
							if (!player.storage[skill]) player.storage[skill] = [];
						},
						mod: {
							cardEnabled: function (card, player) {
								if (!player.getStorage('sbfangzhu_4').includes(get.type2(card))) return false;
							},
							cardSavable: function (card, player) {
								if (!player.getStorage('sbfangzhu_4').includes(get.type2(card))) return false;
							},
						},
					},
					5: {
						mark: true,
						marktext: "放逐",
						intro: {
							content: '只能使用手中的锦囊牌直到回合结束',
							markcount: '锦囊',
						},
						unique: true,
						charlotte: true,
						onremove: true,
						init: function (player, skill) {
							if (!player.storage[skill]) player.storage[skill] = [];
						},
						mod: {
							cardEnabled: function (card, player) {
								if (!player.getStorage('sbfangzhu_5').includes(get.type2(card))) return false;
							},
							cardSavable: function (card, player) {
								if (!player.getStorage('sbfangzhu_5').includes(get.type2(card))) return false;
							},
						},
					},
				}
			},
			sbsongwei: {
				audio: 2,
				trigger: { player: 'phaseUseBegin' },
				zhuSkill: true,
				filter: function (event, player) {
					if (player.countMark("sbxingshang") >= get.info("sbxingshang").getLimit) return false;
					return player.hasSkill('sbxingshang') && game.hasPlayer(function (current) {
						return current.group == 'wei' && current != player
					}) && player.hasZhuSkill('sbsongwei');
				},
				direct: true,
				content: function () {
					var num = 0;
					game.players.forEach(function (cur) {
						if (cur.group == 'wei' && cur != player) num++;
					})
					player.addMark(
						"sbxingshang",
						Math.min(
							get.info("sbxingshang").getLimit - player.countMark("sbxingshang"),
							2 * game.countPlayer((target) => target.group == "wei" && target != player)
						)
					);
				},
				group: 'sbsongwei_dabian',
				subSkill: {
					dabian: {
						enable: 'phaseUse',
						auido: "sbsongwei",
						filter: function (event, player) {
							if (player.storage.sbsongwei_dabian) return false;
							return game.hasPlayer(function (cur) {
								return cur.group == 'wei' && cur != player
							}) && player.hasZhuSkill('sbsongwei');
						},
						filterTarget: function (card, player, target) {
							return target.group == 'wei' && target != player
						},
						content: function () {
							if (lib.character[target.name] && lib.character[target.name][3].length) {
								for (var i of lib.character[target.name][3]) {
									target.removeSkill(i)
								}
								player.storage.sbsongwei_dabian = true;
							}
							target.markSkill("sbsongwei_dabian");
						},
						ai: {
							order: 7,
							result: {
								player: -1,
								target: -2,
							}
						},
						sub: true,
					},
				},
			},
			sbwusheng: {
				audio: 2,
				enable: ["chooseToRespond", "chooseToUse"],
				init: function (player) {
					player.storage.sbwusheng;
				},
				hiddenCard: function (player, name) {
					if (name == 'sha') return true;
				},
				filter: function (event, player) {
					return event.type != 'wuxie' && event.type != 'respondShan' && player.countCards('h') > 0;
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (name == 'sha') {
								list.push(['基本', '', 'sha']);
								for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
							}
						}
						return ui.create.dialog('武圣', [list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
					},
					check: function (button) {
						var player = _status.event.player;
						if (player.countCards('h', button.link[2]) > 0) return 2;
						var effect = player.getUseValue(button.link[2]);
						if (effect > 0) return effect;
						return 0;
					},
					backup: function (links, player) {
						return {
							filterCard: true,
							audio: 'sbwusheng',
							selectCard: 1,
							popname: true,
							check: function (card) {
								return 10 - get.value(card);
							},
							position: 'h',
							viewAs: { name: links[0][2], nature: links[0][3] },
						}
					},
					prompt: function (links, player) {
						return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
					},
				},
				group: 'sbwusheng_shabi',
				subSkill: {
					shabi: {
						trigger: { player: 'phaseUseBegin' },
						filter: function (event, player) {
							return game.hasPlayer(function (current) { return current.identity != 'zhu' });
						},
						direct: true,
						content: function () {
							'step 0'
							player.chooseTarget('武圣：请选择一名非主公角色', '本阶段你可以对其使用至多3张【杀】且无距离限制', false, (card, player, target) => {
								if (get.mode() == 'identity') return target != player && target.identity != 'zhu';
								else return target != player;
							}).set('ai', target => {
								var att = get.attitude(_status.event.player, target);
								var cg = target.maxHp - target.hp;
								return -att + cg;
							});
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill('sbwusheng', target);
								player.storage.sbwusheng = target;
								player.addTempSkill('sbwusheng_shabi2', 'phaseUseEnd');
							}
						},
					},
					shabi2: {
						charlotte: true,
						mod: {
							targetInRange: function (card, player, target) {
								if (target == player.storage.sbwusheng) return true;
							},
							cardUsableTarget: function (card, player, target) {
								if (player.getHistory('useCard', function (e) {
									return e.targets.contains(target) && e.card.name == 'sha';
								}).length < 3 && card.name == 'sha' && target == player.storage.sbwusheng) return true;
							},
						},
						trigger: {
							player: "useCardToBegin",
						},
						audio: "sbwusheng",
						shaRelated: true,
						direct: true,
						filter: function (event, player) {
							return event.card.name == 'sha' && event.target == player.storage.sbwusheng;
						},
						content: function () {
							player.draw(2);
						}
					}
				},
				ai: {
					order: 6.5,
					result: {
						player: 1.2,
					},
					threaten: 1.6,
				},
			},
			sbyijue: {
				forced: true,
				init: function (player) {
					player.storage.sbyijue = [];
				},
				trigger: { source: 'damageBefore' },
				filter: function (event, player) {
					return event.player.hp <= event.num && !player.storage.sbyijue.includes(event.player) && player == _status.currentPhase;
				},
				content: function () {
					trigger.cancel();
					player.storage.sbyijue.push(trigger.player);
					trigger.player.addTempSkill('sbyijue_run', 'phaseEnd');
				},
				subSkill: {
					run: {
						forced: true,
						charlotte: true,
						direcr: true,
						mark: true,
						marktext: '义绝',
						intro: { content: '被关羽释放' },
						trigger: {
							target: "useCardToTarget",
						},
						filter: function (event, player) {
							return (event.target == player || (event.targets && event.targets.contains(player))) && _status.currentPhase.hasSkill('sbyijue');
						},
						content: function () {
							trigger.getParent().excluded.add(player);
						},
						ai: {
							effect: {
								target: function (card, player, target, current) {
									return 'zeroplayertarget';
								},
							},
						},
					},
				},
			},
			sbqicai: {
				audio: 2,
				enable: 'phaseUse',
				locked: false,
				usable: 1,
				mod: {
					targetInRange: function (card, player, target) {
						if (get.type2(card) == 'trick') return true;
					},
				},
				init: function (player) {
					player.storage.sbqicai = [];
					player.storage.sbqicai2 = new Map();
				},
				filter: function (event, player) {
					if (!game.hasPlayer(target => target != player && target.isEmpty(2))) return false;
					return (player.countCards('h', card => lib.skill.sbqicai.filterCardx(card, player)) || Array.from(ui.discardPile.childNodes).filter(card => lib.skill.sbqicai.filterCardx(card, player)));
				},
				filterCardx: function (card, player) {
					if (player.storage.sbqicai.includes(card.name)) return false;
					return get.type(card) == 'equip';
				},
				chooseButton: {
					dialog: function (event, player) {
						const list1 = player.getCards('h', card => lib.skill.sbqicai.filterCardx(card, player));
						const list2 = Array.from(ui.discardPile.childNodes).filter(card => lib.skill.sbqicai.filterCardx(card, player));
						var dialog = ui.create.dialog('###奇才###<div class="text center">请选择一张装备牌置入一名其他角色的装备区</div>');
						if (list1.length) {
							dialog.add('<div class="text center">手牌区</div>');
							dialog.add(list1);
						}
						if (list2.length) {
							dialog.add('<div class="text center">弃牌堆</div>');
							dialog.add(list2);
							if (list1.length) dialog.classList.add('fullheight');
						}
						return dialog;
					},
					backup: function (links, player) {
						return {
							audio: 'sbqicai',
							card: links[0],
							filterCard: function (card, player) {
								var cardx = lib.skill.sbqicai_backup.card;
								if (get.owner(cardx)) return card == cardx;
								return false;
							},
							selectCard: -1,
							filterTarget: function (card, player, target) {
								return target != player && target.canEquip(lib.skill.sbqicai_backup.card);
							},
							check: () => 1,
							discard: false,
							lose: false,
							prepare: function (cards, player, targets) {
								if (cards && cards.length) player.$give(cards, targets[0], false);
							},
							content: function () {
								if (!cards || !cards.length) {
									cards = [lib.skill.sbqicai_backup.card];
									target.$gain2(cards);
									game.delayx();
								}
								player.storage.sbqicai.add(cards[0].name);
								target.equip(cards[0]);
								if (player.storage.sbqicai2.has(target)) {
									var st = player.storage.sbqicai2.get(target)[1] + 3;
									player.storage.sbqicai2.set(target, [target.name, 3]);
								}
								else {
									player.storage.sbqicai2.set(target, [target.name, 3]);
								}
							},
							ai: {
								result: {
									target: function (player, target) {
										var att = get.attitude(player, target);
										if (att > 0) return 1.5;
										if (att < 0) return -1.5;
										return 0;
									},
								},
							},
						}
					},
					prompt: function (links, player) {
						return '请选择置入' + get.translation(links) + '的角色';
					},
				},
				ai: {
					order: 7,
					result: {
						player: function (player) {
							return 1;
						},
					},
				},
				marktext: '奇才',
				mark: true,
				intro: {
					markcount: function (storage, player) {
						return '';
					},
					content: function (storage, player) {
						var str = '当前已交出' + get.translation(storage);
						if (player.storage.sbqicai2.size > 0) {
							player.storage.sbqicai2.forEach((value, key) => {
								str += '<br>' + get.translation(value[0]) + '还欠你' + value[1] + '张锦囊牌';
							});
						}
						return str;
					}
				},
				group: 'sbqicai_gain',
				subSkill: {
					gain: {
						audio: 'sbqicai',
						trigger: { global: ['gainAfter', 'loseAsyncAfter'] },
						filter: function (event, player) {
							if (player.storage.sbqicai2.size == 0) return false;
							return game.hasPlayer(function (current) {
								if (!event.getg(current).length || !player.storage.sbqicai2.has(current)) return false;
								return event.getg(current).some(card => get.type(card) == 'trick' && lib.filter.canBeGained(card, current, player));
							});
						},
						forced: true,
						direct: true,
						charlotte: true,
						content: function () {
							'step 0'
							if (!event.checkedTargets) event.checkedTargets = [];
							var target = game.findPlayer(function (current) {
								if (!trigger.getg(current).length || !player.storage.sbqicai2.has(current)) return false;
								if (event.checkedTargets.includes(current)) return false;
								return trigger.getg(current).some(card => get.type(card) == 'trick' && lib.filter.canBeGained(card, current, player));
							});
							if (!target) {
								event.finish();
								return;
							}
							event.target = target;
							player.logSkill('sbqicai', target);
							event.checkedTargets.add(target);
							var cards = trigger.getg(target).filter(card => get.type(card) == 'trick' && lib.filter.canBeGained(card, target, player));
							if (cards.length >= player.storage.sbqicai2.get(target)[1]) {
								player.storage.sbqicai2.delete(target);
								event._result = { bool: true, links: cards };
							}
							else {
								var num = player.storage.sbqicai2.get(target)[1];
								player.storage.sbqicai2.set(target, [target.name, num - cards.length]);
								target.chooseButton(['奇才：将其中' + get.cnNumber(num) + '张牌交给' + get.translation(player), cards], num, true).set('ai', function (button) {
									return get.value(button.link) * get.sgn(_status.event.att);
								}).set('att', get.attitude(target, player));
							}
							'step 1'
							if (result.bool) {
								game.delay(0.5);
								target.give(result.links, player);
							}
							event.goto(0);
						},
					},
				},
			},
			sbjizhi: {
				audio: 2,
				trigger: { player: 'useCard' },
				filter: function (event, player) {
					return get.type(event.card) == 'trick';
				},
				forced: true,
				content: function () {
					player.draw().gaintag = ['sbjizhi'];
					player.addTempSkill('sbjizhi_mark')
				},
				subSkill: {
					mark: {
						charlotte: true,
						onremove: function (player) {
							player.removeGaintag('sbjizhi');
						},
						mod: {
							ignoredHandcard: function (card, player) {
								if (card.hasGaintag('sbjizhi')) return true;
							},
							cardDiscardable: function (card, player, name) {
								if (name == 'phaseDiscard' && card.hasGaintag('sbjizhi')) return false;
							},
						},
					},
				},
			},
			//谋卢植
			sbmingren: {
				audio: 'sbmingren_1',
				marktext: '任',
				intro: {
					content: 'expansion',
					markcount: 'expansion',
				},
				onremove: function (player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				group: ['sbmingren_1', 'sbmingren_2'],
				subSkill: {
					1: {
						audio: 2,
						trigger: {
							global: 'phaseBefore',
							player: 'enterGame',
						},
						forced: true,
						locked: false,
						filter: function (event, player) {
							return (event.name != 'phase' || game.phaseNumber == 0) && !player.getExpansions('sbmingren').length;
						},
						content: function () {
							'step 0'
							player.draw(3);
							'step 1'
							if (!player.countCards('h')) event.finish();
							else player.chooseCard('h', '将一张手牌置于武将牌上，称为“任”', true).set('ai', function (card) {
								return 6 - get.value(card);
							});
							'step 2'
							if (result.bool) {
								player.addToExpansion(result.cards[0], player, 'give', 'log').gaintag.add('sbmingren');
							};
						},
					},
					2: {
						audio: 2,
						trigger: {
							player: 'phaseJieshuBegin',
						},
						filter: function (event, player) {
							return player.countCards('h') > 0 && player.getExpansions('sbmingren').length > 0;
						},
						direct: true,
						content: function () {
							'step 0'
							player.chooseCard('h', '是否用一张手牌替换“任”（' + get.translation(player.getExpansions('sbmingren')[0]) + '）？').set('ai', function (card) {
								var player = _status.event.player;
								var color = get.color(card);
								if (color == get.color(player.getExpansions('sbmingren')[0])) return false;
								var num = 0;
								var list = [];
								player.countCards('h', function (cardx) {
									if (cardx != card || get.color(cardx) != color) return false;
									if (list.contains(cardx.name)) return false;
									list.push(cardx.name);
									switch (cardx.name) {
										case 'wuxie': num += (game.countPlayer() / 2.2); break;
										case 'caochuan': num += 1.1; break;
										case 'shan': num += 1; break;
									}
								});
								return num * (30 - get.value(card));
							});
							'step 1'
							if (result.bool) {
								player.logSkill('sbmingren');
								player.addToExpansion(result.cards[0], 'log', 'give', player).gaintag.add('sbmingren');
								var card = player.getExpansions('sbmingren')[0];
								if (card) player.gain(card, 'gain2');
							};
						},
					},
				},
				ai: {
					combo: 'sbzhenliang',
				},
			},
			sbzhenliang: {
				mark: true,
				locked: false,
				zhuanhuanji: true,
				marktext: '☯',
				intro: {
					content: function (storage, player, skill) {
						if (player.storage.sbzhenliang == true) return '你的回合外，当一名角色使用或打出的牌结算结束后，若此牌与“任”类别相同，则你可令至多两名角色摸两张牌。';
						return '出牌阶段限一次，你可以选择一名攻击范围内的其他角色并弃置X张与“任”颜色相同的牌对其造成1点伤害（X为你与其体力值之差且至少为1）。';
					},
				},
				group: ["sbzhenliang_1", "sbzhenliang_2"],
				subSkill: {
					1: {
						prompt: '弃置X张与“任”颜色相同的牌（X为你与其体力值之差且至少为1），并对攻击范围内的一名角色造成1点伤害。',
						audio: 2,
						enable: 'phaseUse',
						filter: function (event, player) {
							if (player.storage.sbzhenliang) return false;
							var storage = player.getExpansions('sbmingren');
							if (!storage.length) return false;
							var color = get.color(storage[0]);
							if (player.countCards('he', function (card) {
								return get.color(card) == color;
							}) == 0) return false;
							return game.hasPlayer(function (current) {
								return player.inRange(current);
							});
						},
						position: 'he',
						filterCard: function (card, player) {
							return get.color(card) == get.color(player.getExpansions('sbmingren')[0]);
						},
						filterTarget: function (card, player, target) {
							return player.inRange(target) && ui.selected.cards.length == Math.max(1, Math.abs(player.hp - target.hp));
						},
						selectCard: [1, Infinity],
						check: function (card) {
							return 6.5 - get.value(card);
						},
						content: function () {
							player.changeZhuanhuanji('sbzhenliang');
							target.damage('nocard');
						},
						ai: {
							order: 7,
							result: {
								player: function (player, target) {
									return get.damageEffect(target, player, player);
								},
							},
						},
					},
					2: {
						audio: 2,
						trigger: {
							global: ['useCardAfter', 'respondAfter'],
						},
						filter: function (event, player) {
							if (_status.currentPhase == player || !player.storage.sbzhenliang) return false;
							var card = player.getExpansions('sbmingren')[0];
							return card && get.type2(event.card) == get.type2(card);
						},
						direct: true,
						content: function () {
							"step 0"
							player.chooseTarget(get.prompt('sbzhenliang'), '令至多两名角色摸两张牌', [1, 2]).ai = function (target) {
								if (target.hasSkillTag('nogain')) return 0.1;
								var att = get.attitude(player, target);
								return att * (Math.max(5 - target.countCards('h'), 2) + 3);
							};
							"step 1"
							if (result.bool) {
								player.changeZhuanhuanji('sbzhenliang');
								player.logSkill('sbzhenliang', result.targets);
								game.asyncDraw(result.targets, 2);
							}
						},
					},
				},
				ai: {
					combo: 'sbmingren',
				},
			},
			sbtianxiang: {
				audio: 2,
				enable: 'phaseUse',
				usable: 3,
				discard: false,
				filter: function (event, player) {
					return game.hasPlayer(current => {
						return !current.hasMark('sbtianxiang_heart') || !current.hasMark('sbtianxiang_diamond');
					})
				},
				filterCard: function (card, player) {
					return get.color(card, player) == 'red';
				},
				filterTarget: function (card, player, target) {
					return target != player && !target.hasMark('sbtianxiang_heart') && !target.hasMark('sbtianxiang_diamond');
				},
				prompt: '将一张红色牌交给一名角色并令其获得此花色的“天香”标记',
				content: function () {
					player.give(cards, target);
					var suit = get.suit(cards[0], player);
					target.addMark('sbtianxiang_' + suit);
				},
				ai: {
					order: 3,
					result: { target: -0.6 },
				},
				group: ['sbtianxiang_draw', 'sbtianxiang_tianxiang'],
				subSkill: {
					heart: {
						marktext: '天香',
						intro: {
							markcount: function (storage, player) {
								return '♥';
							},
							content: function (storage, player) { return ''; }
						},
					},
					diamond: {
						marktext: '天香',
						intro: {
							markcount: function (storage, player) {
								return '♦';
							},
							content: function (storage, player) { return ''; }
						},
					},
					draw: {
						trigger: { player: 'phaseZhunbeiBegin' },
						locked: false,
						forced: true,
						filter: function (event, player) {
							return game.hasPlayer(current => {
								return current.hasMark('sbtianxiang_heart') || current.hasMark('sbtianxiang_diamond');
							})
						},
						content: function () {
							var num = game.countPlayer(current => {
								return current.hasMark('sbtianxiang_heart') || current.hasMark('sbtianxiang_diamond');
							});
							game.players.forEach(current => {
								if (current.hasMark('sbtianxiang_heart')) current.removeMark('sbtianxiang_heart');
								if (current.hasMark('sbtianxiang_diamond')) current.removeMark('sbtianxiang_diamond');
							})
							player.draw(num);
						}
					},
					tianxiang: {
						audio: 'sbtianxiang',
						trigger: {
							player: "damageBegin3",
						},
						direct: true,
						filter: function (event, player) {
							return game.hasPlayer(current => {
								return current.hasMark('sbtianxiang_heart') || current.hasMark('sbtianxiang_diamond');
							})
						},
						content: function () {
							'step 0'
							player.chooseTarget('天香：是否发动〖天香〗并选择一名有“天香”标记的其他角色', function (card, player, target) {
								return target != player & (target.hasMark('sbtianxiang_heart') || target.hasMark('sbtianxiang_diamond'))
							}).set('ai', function (target) {
								var player = _status.event.player;
								return -get.attitude(player, target);
							});
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill('sbtianxiang', target);
								if (target.hasMark('sbtianxiang_heart')) {
									target.removeMark('sbtianxiang_heart');
									trigger.num = 0;
									target.damage(trigger.source);
									event.finish();
								}
								if (target.hasMark('sbtianxiang_diamond')) {
									target.removeMark('sbtianxiang_diamond');
									event.target = target;
									target.chooseCard(Math.min(2, target.countCards('he')), 'he', '天香：请交给' + get.translation(player) + '两张牌', true);
								}
							}
							'step 2'
							if (result.bool) {
								event.target.give(result.cards, player);
							}
						}
					},
				},
			},
			sbqiaobian: {
				audio: 2,
				trigger: { player: ['phaseJudgeBefore', 'phaseDrawBefore', 'phaseUseBefore'] },
				usable: 1,
				direct: true,
				content: function () {
					'step 0'
					switch (trigger.name) {
						case 'phaseJudge':
							player.chooseTarget(get.prompt('sbqiaobian'), '失去1点体力并跳过判定阶段，将判定区里的牌移动给一名其他角色', lib.filter.notMe).set('ai', function (target) {
								var player = _status.event.player;
								if (player.hp + player.countCards('h', function (card) {
									var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
									if (mod2 != 'unchanged') return mod2;
									var mod = game.checkMod(card, player, player, 'unchanged', 'cardSavable', player);
									if (mod != 'unchanged') return mod;
									var savable = get.info(card).savable;
									if (typeof savable == 'function') savable = savable(card, player, player);
									return savable;
								}) <= 1) return 0;
								var eff = 0;
								for (var card of player.getCards('j')) {
									var cardx;
									if (card.viewAs) cardx = get.autoViewAs({ name: card.viewAs }, [card]);
									else cardx = card;
									if (target.canAddJudge(cardx)) eff += get.effect(target, cardx, player, player);
									else eff -= get.attitude(player, target) / 114514;
								}
								return eff;
							}).setHiddenSkill('sbqiaobian');
							break;
						case 'phaseDraw':
							player.chooseBool(get.prompt('sbqiaobian'), '跳过摸牌阶段，于下个准备阶段摸五张牌并回复1点体力').setHiddenSkill('sbqiaobian');
							break;
						case 'phaseUse':
							var num = (player.countCards('h') - 6);
							if (num <= 0) player.chooseBool(get.prompt('sbqiaobian'), '跳过出牌阶段和弃牌阶段，将手牌弃至6张，然后移动场上的一张牌').set('choice', player.canMoveCard(true)).setHiddenSkill('sbqiaobian');
							else player.chooseToDiscard(get.prompt('sbqiaobian'), num, '弃置' + get.cnNumber(num) + '张手牌并跳过出牌阶段和弃牌阶段，然后移动场上的一张牌').set('ai', function (card) {
								var player = _status.event.player;
								if (!player.canMoveCard(true) || player.countCards('hs', card => player.hasValueTarget(card)) >= 9) return 0;
								return 7 - get.value(card);
							}).setHiddenSkill('sbqiaobian').logSkill = 'sbqiaobian';
							break;
					}
					'step 1'
					if (result.bool) {
						trigger.cancel();
						switch (trigger.name) {
							case 'phaseJudge':
								var target = result.targets[0];
								player.logSkill('sbqiaobian', target);
								player.loseHp();
								game.log(player, '跳过了判定阶段');
								for (var card of player.getCards('j')) {
									if (target.canAddJudge(card)) {
										player.$give(card, target, false);
										if (card.viewAs) target.addJudge({ name: card.viewAs }, [card]);
										else target.addJudge(card);
									}
									else player.discard(card);
								}
								break;
							case 'phaseDraw':
								player.logSkill('sbqiaobian');
								game.log(player, '跳过了摸牌阶段');
								player.addSkill('sbqiaobian_draw');
								break;
							case 'phaseUse':
								if (!result.cards || !result.cards.length) player.logSkill('sbqiaobian', target);
								player.skip('phaseDiscard');
								game.log(player, '跳过了出牌阶段');
								game.log(player, '跳过了弃牌阶段');
								player.moveCard();
								break;
						}
					}
					else player.storage.counttrigger.sbqiaobian--;
				},
				subSkill: {
					draw: {
						charlotte: true,
						mark: true,
						intro: { content: '准备阶段摸五张牌并回复1点体力' },
						audio: 'sbqiaobian',
						trigger: { player: 'phaseZhunbeiBegin' },
						forced: true,
						content: function () {
							player.removeSkill('sbqiaobian_draw');
							player.draw(5);
							player.recover();
						},
					},
				},
			},
			sbhuoshou: {
				audio: 2,
				trigger: {
					player: 'phaseUseBegin',
				},
				filter: function (event, player) {
					return true;
				},
				forced: true,
				onremove: true,
				group: ['sbhuoshou_cancel', 'sbhuoshou_source', 'sbhuoshou_nanmaned'],
				content: function () {
					'step 0'
					var card = get.discardPile(card => {
						return card.name == 'nanman';
					});
					if (card) {
						player.gain(card, 'gain2');
					}
					else {
						game.log('但是弃牌堆里并没有', '#y南蛮入侵', '！');
						player.addMark('sbhuoshou', 1, false);
					}
				},
				subSkill: {
					cancel: {
						audio: 'sbhuoshou',
						trigger: { target: 'useCardToBefore' },
						forced: true,
						priority: 15,
						filter: function (event, player) {
							return (event.card.name == 'nanman');
						},
						content: function () {
							trigger.cancel();
						},
					},
					source: {
						audio: 'sbhuoshou',
						trigger: { global: 'useCardToPlayered' },
						forced: true,
						filter: function (event, player) {
							return event.isFirstTarget && event.card && event.card.name == 'nanman' && event.player != player;
						},
						content: function () {
							trigger.getParent().customArgs.default.customSource = player;
						}
					},
					nanmaned: {
						trigger: {
							player: 'useCard1',
						},
						filter: function (event, player) {
							return event.card.name == 'nanman';
						},
						forced: true,
						popup: false,
						charlotte: true,
						content: function () {
							'step 0'
							player.addTempSkill('sbhuoshou_ban', 'phaseUseAfter');
						}
					},
					ban: {
						charlotte: true,
						intro: {
							content: '此阶段不能再使用【南蛮入侵】',
						}
					},
				},
				mod: {
					cardEnabled: function (card, player) {
						if (player.hasSkill('sbhuoshou_ban') && card.name == 'nanman') return false;
					},
				},
				ai: {
					threaten: 1.9,
				}
			},
			sbzaiqi: {
				audio: 2,
				trigger: {
					player: 'phaseDiscardEnd',
				},
				chargeSkill: true,
				getLimit: 7,
				filter: function (event, player) {
					return player.hasMark('charge');
				},
				group: 'sbzaiqi_backflow',
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt('sbzaiqi'), '选择任意名角色并消耗等量蓄力值，令这些角色选择一项：1.令你摸一张牌；2.弃置一张牌，然后你回复1点体力', [1, player.countMark('charge')]).set('ai', function (target) {
						var player = _status.event.player;
						return get.attitude(player, target) + player.getDamagedHp() * 3.5;
					});
					'step 1'
					if (result.bool) {
						var targets = result.targets;
						targets.sortBySeat();
						event.targets = targets;
						player.logSkill('sbzaiqi', targets);
						player.removeMark('charge', targets.length);
					}
					else event.finish();
					'step 2'
					var target = targets.shift();
					event.target = target;
					if (!target.countCards('he')) event._result = { bool: false };
					else target.chooseToDiscard(get.translation(player) + '对你发动了【再起】', '是否弃置一张牌令其回复1点体力？或者点击“取消”，令该角色摸一张牌。', 'he').set('ai', card => {
						var eff = _status.event.eff, att = _status.event.att;
						if (eff > 0 && att > 0 || eff <= 0 && att < 0) return 5.5 - get.value(card);
						return 0;
					}).set('eff', get.recoverEffect(player, player, target)).set('att', get.attitude(target, player));
					'step 3'
					target.line(player);
					if (result.bool) {
						player.recover();
					}
					else {
						player.draw();
					}
					game.delayex();
					if (targets.length) event.goto(2);
				},
				subSkill: {
					backflow: {
						audio: 'sbzaiqi',
						trigger: {
							player: 'enterGame',
							source: 'damageSource',
							global: 'phaseBefore',
						},
						usable: 1,
						forced: true,
						locked: false,
						filter: function (event, player) {
							if (event.name == 'damage') return true;
							return (event.name != 'phase' || game.phaseNumber == 0);
						},
						content: function () {
							if (lib.skill.sbzaiqi.getLimit - player.countMark('charge') > 0) player.addMark('charge', 1);
						}
					}
				}
			},
			//祝融
			sblieren: {
				audio: 2,
				trigger: { player: 'useCardToPlayered' },
				filter: function (event, player) {
					return event.targets.length == 1 && event.card.name == 'sha' && !player.hasSkillTag('noCompareSource') && event.target != player && event.target.countCards('h') > 0 && !event.target.hasSkillTag('noCompareTarget');
				},
				check: function (event, player) {
					return get.attitude(player, event.target) < 0 || game.hasPlayer(current => {
						return get.damageEffect(current, player, player) > 0;
					});
				},
				shaRelated: true,
				logTarget: 'target',
				content: function () {
					'step 0'
					player.draw();
					'step 1'
					if (player.canCompare(trigger.target)) player.chooseToCompare(trigger.target);
					'step 2'
					if (result.bool) {
						player.addTempSkill('sblieren_damage');
						if (!trigger.card.storage) trigger.card.storage = {};
						trigger.card.storage.sblieren = [player, trigger.target];
					}
				},
				subSkill: {
					damage: {
						trigger: { global: 'useCardAfter' },
						filter: function (event, player) {
							return event.card.name == 'sha' && event.card.storage && event.card.storage.sblieren && event.card.storage.sblieren[0] == player && game.hasPlayer(current => {
								return !event.card.storage.sblieren.contains(current);
							});
						},
						direct: true,
						charlotte: true,
						content: function () {
							'step 0'
							var target = trigger.card.storage.sblieren[1];
							player.chooseTarget('烈刃：是否对除' + get.translation(target) + '外的一名其他角色造成1点伤害？', (card, player, target) => {
								return target != _status.event.targeted && target != player;
							}).set('targeted', target);
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill('sblieren_damage', target);
								target.damage();
							}
						}
					}
				}
			},
			sbjuxiang: {
				audio: 2,
				trigger: {
					player: 'phaseJieshuBegin',
				},
				forced: true,
				direct: true,
				filter: function (event, player) {
					return !player.hasHistory('useCard', evt => evt.card.name == 'nanman') && (!_status.sbjuxiang_nanman || _status.sbjuxiang_nanman.length);
				},
				group: ['sbjuxiang_cancel', 'sbjuxiang_gain'],
				content: function () {
					'step 0'
					if (!_status.sbjuxiang_nanman) {
						_status.sbjuxiang_nanman = [];
						var numbers = [7, 9, 11, 13], suits = ['spade', 'club'];
						for (var num of numbers) {
							for (var suit of suits) {
								_status.sbjuxiang_nanman.push({ name: 'nanman', number: num, suit: suit });
							}
						}
						game.broadcastAll(function () {
							if (!lib.inpile.contains('nanman')) {
								lib.inpile.add('nanman');
							}
						});
					}
					player.chooseTarget(get.prompt('sbjuxiang'), '将游戏外的随机一张【南蛮入侵】交给一名角色（剩余' + get.cnNumber(_status.sbjuxiang_nanman.length) + '张）').set('ai', target => {
						var player = _status.event.player;
						return Math.max(0, target.getUseValue({ name: 'nanman' })) * get.attitude(player, target) * (target == player ? 0.5 : 1);
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill('sbjuxiang', target);
						if (!_status.sbjuxiang_nanman.length) return;
						var info = _status.sbjuxiang_nanman.randomRemove();
						var card = game.createCard2(info);
						target.gain(card, 'gain2').giver = player;
					}
				},
				ai: {
					expose: 0.05,
					effect: {
						target: function (card) {
							if (card.name == 'nanman') return [0, 1];
						}
					}
				},
				subSkill: {
					cancel: {
						audio: 'sbjuxiang',
						trigger: { target: 'useCardToBefore' },
						forced: true,
						priority: 15,
						filter: function (event, player) {
							return event.card.name == 'nanman';
						},
						content: function () {
							trigger.cancel();
						}
					},
					gain: {
						audio: 'sbjuxiang',
						trigger: { global: 'useCardAfter' },
						forced: true,
						filter: function (event, player) {
							return event.card.name == 'nanman' && event.player != player && event.cards.filterInD().length;
						},
						content: function () {
							player.gain(trigger.cards.filterInD(), 'gain2');
						}
					}
				}
			},

			sbjiang: {
				audio: 2,
				trigger: {
					player: 'useCardToPlayered',
					target: 'useCardToTargeted',
				},
				shaRelated: true,
				filter: function (event, player) {
					if (!(event.card.name == 'juedou' || (event.card.name == 'sha' && get.color(event.card) == 'red'))) return false;
					return true;
				},
				frequent: true,
				onremove: true,
				group: ['sbjiang_add', 'sbjiang_qiben'],
				content: function () {
					player.draw();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (card.name == 'sha' && get.color(card) == 'red') return [1, 0.6];
						},
						player: function (card, player, target) {
							if (card.name == 'sha' && get.color(card) == 'red') return [1, 1];
						}
					}
				},
				subSkill: {
					add: {
						audio: 'sbjiang',
						trigger: { player: 'useCard2' },
						direct: true,
						filter: function (event, player) {
							if (event.card.name != 'juedou') return false;
							var info = get.info(event.card);
							if (info.allowMultiple == false) return false;
							if (event.targets && !info.multitarget) {
								if (game.hasPlayer(function (current) {
									return !event.targets.contains(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
								})) {
									return true;
								}
							}
							return false;
						},
						content: function () {
							'step 0'
							var prompt2 = '为' + get.translation(trigger.card) + '额外指定一个目标，然后失去1点体力';
							player.chooseTarget(get.prompt('sbjiang_add'), function (card, player, target) {
								var player = _status.event.player;
								if (_status.event.targets.contains(target)) return false;
								return lib.filter.targetEnabled2(_status.event.card, player, target);
							}).set('prompt2', prompt2).set('ai', function (target) {
								var trigger = _status.event.getTrigger();
								var player = _status.event.player;
								var eff = get.effect(target, trigger.card, player, player);
								if (player.hasZhuSkill('sbzhiba') && !player.hasMark('sbjiang')) return eff;
								if (eff + get.effect(player, { name: 'losehp' }, player) / 8 > 0) return eff;
								return 0;
							}).set('targets', trigger.targets).set('card', trigger.card);
							'step 1'
							if (result.bool) {
								if (!event.isMine() && !event.isOnline()) game.delayx();
								event.targets = result.targets;
							}
							else {
								event.finish();
							}
							'step 2'
							if (event.targets) {
								player.logSkill('sbjiang_add', event.targets);
								trigger.targets.addArray(event.targets);
								player.loseHp();
							}
						}
					},
					qiben: {
						audio: 'sbjiang',
						enable: 'phaseUse',
						viewAs: { name: 'juedou' },
						filterCard: true,
						position: 'h',
						selectCard: -1,
						prompt: function () {
							var player = _status.event.player;
							var limit = (player.hasMark('sbjiang') ? (game.countPlayer(current => {
								return current.group == 'wu' && current != player;
							}) + 1) : 1);
							return '出牌阶段限' + get.cnNumber(limit) + '次。你可以将所有手牌当【决斗】使用';
						},
						filter: function (event, player) {
							var limit = player.hasMark('sbjiang') ? (game.countPlayer(current => {
								return current.group == 'wu' && current != player;
							}) + 1) : 1;
							if ((player.getStat('skill').sbjiang_qiben || 0) >= limit) return false;
							var hs = player.getCards('h');
							if (!hs.length) return false;
							for (var i = 0; i < hs.length; i++) {
								var mod2 = game.checkMod(hs[i], player, 'unchanged', 'cardEnabled2', player);
								if (mod2 === false) return false;
							}
							return event.filterCard(get.autoViewAs({ name: 'juedou' }, hs));
						},
						ai: { order: 0.001 },
					}
				},
			},
			sbhunzi: {
				audio: 2,
				trigger: { player: 'dyingAfter' },
				juexingji: true,
				forced: true,
				skillAnimation: true,
				animationColor: 'wood',
				derivation: ['sbyingzi', 'gzyinghun'],
				content: function () {
					'step 0'
					player.awakenSkill('sbhunzi');
					player.loseMaxHp();
					'step 1'
					player.changeHujia(1, null, true);
					'step 2'
					player.draw(2);
					'step 3'
					player.addSkillLog('sbyingzi');
					player.addSkillLog('gzyinghun');
				},
				ai: {
					threaten: function (player, target) {
						if (target.hp == 1) return 2;
						return 0.5;
					},
					maixie: true,
					effect: {
						target: function (card, player, target) {
							if (!target.hasFriend() || target.hp > 1) return;
							if (get.tag(card, 'damage') == 1 && (target.hasZhuSkill('sbzhiba') || player.countCards('hs', 'tao') + target.countCards('hs', ['tao', 'jiu']) > 0) &&
								!target.isTurnedOver() && _status.currentPhase != target && get.distance(_status.currentPhase, target, 'absolute') <= 3) return [0.5, 1];
						}
					}
				}
			},
			sbzhiba: {
				audio: 2,
				trigger: { player: 'dying' },
				filter: function (event, player) {
					if (!player.hasZhuSkill('sbzhiba')) return false;
					return player.hp <= 0;
				},
				zhuSkill: true,
				limited: true,
				skillAnimation: true,
				animationColor: 'wood',
				content: function () {
					'step 0'
					player.awakenSkill('sbzhiba');
					event.targets = game.filterPlayer(current => {
						return current.group == 'wu' && current != player;
					}).sortBySeat(_status.currentPhase);
					var num = event.targets.length + 1;
					if (num > 0) player.recover(num);
					player.addMark('sbjiang', 1, false);
					player.addTempSkill('sbzhiba_draw');
					if (!event.targets.length) event.finish();
					'step 1'
					var target = targets.shift();
					target.damage('nosource');
					if (targets.length) event.redo();
				},
				subSkill: {
					draw: {
						trigger: { global: 'dieAfter' },
						filter: function (event, player) {
							return event.getParent(3).name == 'sbzhiba';
						},
						forced: true,
						charlotte: true,
						content: function () {
							player.draw(3);
						}
					}
				}
			},
			//大乔
			sbguose: {
				audio: 2,
				enable: 'phaseUse',
				usable: 4,
				discard: false,
				lose: false,
				delay: false,
				filter: function (event, player) {
					return player.countCards('hes', { suit: 'diamond' }) > 0 || game.hasPlayer(function (current) {
						return current.hasJudge('lebu');
					});
				},
				position: 'hes',
				filterCard: { suit: 'diamond' },
				selectCard: [0, 1],
				filterTarget: function (card, player, target) {
					if (!ui.selected.cards.length) {
						if (target.hasJudge('lebu')) return true;
						return false;
					}
					if (player == target) return false;
					var mod = game.checkMod(ui.selected.cards[0], player, 'unchanged', 'cardEnabled2', player);
					if (!mod) return false;
					return player.canUse({ name: 'lebu', cards: ui.selected.cards }, target);
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					'step 0'
					if (target.hasJudge('lebu')) {
						target.discard(target.getJudge('lebu'));
					}
					else {
						player.useCard({ name: 'lebu' }, target, cards).audio = false;
					}
					'step 1'
					player.draw(2);
					player.chooseToDiscard(true, 'he', '国色：请弃置一张牌');
				},
				ai: {
					result: {
						target: function (player, target) {
							if (target.hasJudge('lebu') && get.attitude(player, target) > 0) return 2;
							if (!target.hasJudge('lebu')) return -1;
						}
					},
					order: 9,
				}
			},
			sbliuli: {
				audio: 2,
				inherit: 'liuli',
				group: 'sbliuli_heart',
				subSkill: {
					heart: {
						trigger: { player: 'logSkill' },
						filter: function (event, player) {
							if (event.skill != 'sbliuli') return false;
							if (player.hasSkill('sbliuli_used')) return false;
							var evt = event.log_event;
							return player.hasHistory('lose', evtx => {
								return evtx.getParent(2) == evt && get.suit(evtx.cards[0]) == 'heart';
							});
						},
						direct: true,
						content: function () {
							'step 0'
							var sourcex = trigger.log_event.getTrigger().player;
							player.chooseTarget('流离：是否令一名不为' + get.translation(sourcex) + '的其他角色获得“流离”标记？', (card, player, target) => {
								return target != player && target != _status.event.sourcex;
							}).set('ai', target => {
								return get.attitude(_status.event.player, target);
							}).set('sourcex', sourcex);
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								player.line(target, 'green');
								game.countPlayer(i => i.removeSkill('sbliuli_dangxian'));
								target.addSkill('sbliuli_dangxian');
								player.addTempSkill('sbliuli_used');
							}
						}
					},
					used: { charlotte: true },
					dangxian: {
						trigger: { player: 'phaseBegin' },
						forced: true,
						charlotte: true,
						mark: true,
						marktext: '流',
						intro: { content: '回合开始时，执行一个额外的出牌阶段' },
						content: function () {
							var next = player.phaseUse();
							event.next.remove(next);
							trigger.next.push(next);
							player.removeSkill('sbliuli_dangxian');
						}
					}
				}
			},
			//刘表
			sbzishou: {
				audio: 2,
				trigger: { global: 'phaseJieshuBegin' },
				filter: function (event, player) {
					if (player == event.player) return false;
					if (!event.player.countCards('he')) return false;
					return !event.player.hasAllHistory('sourceDamage', evt => {
						return evt.player == player;
					}) && !event.player.hasAllHistory('damage', evt => {
						return evt.source == player;
					});
				},
				forced: true,
				logTarget: 'player',
				content: function () {
					'step 0'
					trigger.player.chooseCard(true, get.translation(player) + '对你发动了【自守】', '交给其一张牌', 'he');
					'step 1'
					if (result.bool) {
						trigger.player.give(result.cards, player);
					}
				},
				ai: {
					threaten: 3,
				}
			},
			sbzongshi: {
				audio: 2,
				trigger: { player: 'damageEnd' },
				filter: function (event, player) {
					if (!event.source || !event.source.isIn()) return false;
					return !player.getStorage('sbzongshi').contains(event.source);
				},
				forced: true,
				onremove: true,
				logTarget: 'source',
				content: function () {
					trigger.source.chooseToDiscard(true, trigger.source.countCards('h'));
					player.markAuto('sbzongshi', [trigger.source]);
				},
				intro: {
					content: '已宗室目标：$'
				},
				ai: {
					threaten: 0.5,
					effect: {
						target: function (card, player, target, current) {
							if (player._sbzongshi_aiChecking) return;
							if (!get.tag(card, 'damage')) return;
							var cards = player.getCards('h');
							if (!target.hasFriend()) return;
							player._sbzongshi_aiChecking = true;
							var value = cards.reduce((p, c) => {
								return p + get.value(c);
							}, 0);
							delete player._sbzongshi_aiChecking;
							if (cards.length > 5 || value > 5 * cards.length) return [1, 0, 0, -cards.length / 2];
							return [1, 0, 0, -0.5];
						}
					}
				}
			},
			//貂蝉
			sblijian: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return game.countPlayer(current => {
						return current != player;
					}) > 1;
				},
				filterCard: true,
				selectCard: [1, Infinity],
				position: 'he',
				filterTarget: lib.filter.notMe,
				selectTarget: function () {
					return ui.selected.cards.length + 1;
				},
				filterOk: function () {
					return ui.selected.targets.length == ui.selected.cards.length + 1;
				},
				multiline: true,
				content: function () {
					var targetx = targets.slice().sortBySeat(target)[1];
					var card = { name: 'juedou', isCard: true };
					if (target.canUse(card, targetx)) target.useCard(card, targetx);
				},
				ai: {
					threaten: 3,
					order: 7,
					result: { target: -1 }
				}
			},
			sbbiyue: {
				audio: 2,
				trigger: { player: 'phaseJieshuBegin' },
				forced: true,
				content: function () {
					player.draw(Math.min(5, game.countPlayer(current => {
						return current.getHistory('damage').length > 0;
					}) + 1));
				}
			},
			//陈宫
			sbmingce: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				position: 'he',
				filter: function (event, player) {
					return player.countCards('he') > 0;
				},
				filterCard: true,
				check: function (card) {
					return 8 - get.value(card)
				},
				filterTarget: lib.filter.notMe,
				selectTarget: 1,
				discard: false,
				lose: false,
				delay: false,
				onremove: true,
				group: 'sbmingce_hit',
				content: function () {
					'step 0'
					player.give(cards, target);
					'step 1'
					var choices = ['选项二'];
					var choiceList = [
						'失去1点体力，令' + get.translation(player) + '摸两张牌并获得1枚“策”',
						'摸一张牌'
					];
					if (target.hp > 0) choices.unshift('选项一');
					else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + '</span>';
					target.chooseControl(choices).set('choiceList', choiceList).set('prompt', get.translation(player) + '对你发动了【明策】，请选择一项').set('ai', () => {
						return _status.event.choice;
					}).set('choice', target.hp <= 0 || ((target.hp + target.countCards('hs', 'tao') > 2 && get.attitude(target, player) > 0) || get.effect(target, { name: 'losehp' }, target, target) > 0) && target.hp > 0 ? 0 : 1);
					'step 2'
					if (result.control == '选项一') {
						target.loseHp();
						player.draw(2);
					}
					else {
						target.draw();
						event.finish();
					}
					'step 3'
					player.addMark('sbmingce', 1);
				},
				marktext: '笨',
				intro: {
					name: '策(明策)',
					name2: '策',
					content: 'mark'
				},
				ai: {
					result: {
						player: 0.5,
						target: 1,
					},
					order: 8.5,
					expose: 0.2
				},
				subSkill: {
					hit: {
						audio: 'sbmingce',
						trigger: { player: 'phaseUseBegin' },
						filter: function (event, player) {
							return player.hasMark('sbmingce');
						},
						direct: true,
						content: function () {
							'step 0'
							var num = player.countMark('sbmingce');
							event.num = num;
							player.chooseTarget(get.prompt('sbmingce'), '移去所有“策”，对一名其他角色造成' + num + '点伤害', lib.filter.notMe).set('ai', target => {
								var player = _status.event.player;
								var eff = get.damageEffect(target, player, player);
								var num = player.countMark('sbmingce');
								if (target.hasSkillTag('filterDamage', null, { player: player })) num = 1;
								return eff * num;
							});
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill('sbmingce_hit', target);
								player.removeMark('sbmingce', num);
								target.damage(num);
							}
						}
					}
				}
			},
			sbzhichi: {
				audio: 2,
				trigger: { player: 'damageEnd' },
				forced: true,
				content: function () {
					player.addTempSkill('sbzhichi_muteki');
				},
				subSkill: {
					muteki: {
						audio: 'sbzhichi',
						trigger: { player: 'damageBegin4' },
						charlotte: true,
						forced: true,
						group: 'sbzhichi_egg',
						content: function () {
							trigger.cancel();
						},
						mark: true,
						intro: { content: '我无敌啦！' },
						ai: {
							maixie: true,
							maixie_hp: true,
							nofire: true,
							nothunder: true,
							nodamage: true,
							effect: {
								target: function (card, player, target, current) {
									if (get.tag(card, 'damage')) return 'zeroplayertarget';
								}
							},
						}
					},
					egg: {
						trigger: { player: 'die' },
						charlotte: true,
						forced: true,
						silent: true,
						forceDie: true,
						content: function () {
							player.chat('你是真滴牛批');
						}
					}
				}
			},
			//袁绍
			sbluanji: {
				audio: 2,
				enable: 'phaseUse',
				trigger: { global: 'respond' },
				viewAs: { name: 'wanjian' },
				forced: true,
				locked: false,
				filter: function (event, player) {
					if (event.name == 'chooseToUse') return player.countCards('hs') > 1 && !player.hasSkill('sbluanji_used');
					var evt = event.getParent(2);
					return evt.name == 'wanjian' && evt.getParent().player == player && event.player != player;
				},
				filterCard: true,
				selectCard: 2,
				position: 'hs',
				prompt: '将两张手牌当【万箭齐发】使用',
				check: function (card) {
					var player = _status.event.player;
					var targets = game.filterPlayer(function (current) {
						return player.canUse('wanjian', current);
					});
					var num = 0;
					for (var i = 0; i < targets.length; i++) {
						var eff = get.sgn(get.effect(targets[i], { name: 'wanjian' }, player, player));
						if (targets[i].hp == 1) {
							eff *= 1.5;
						}
						if (get.attitude(player, targets[i]) == 0 || targets[i].group == 'qun') {
							eff += 0.5;
						}
						num += eff;
					}
					if (!player.needsToDiscard(-1)) {
						if (targets.length >= 7) {
							if (num < 1) return 0;
						}
						else if (targets.length >= 5) {
							if (num < 0.5) return 0;
						}
					}
					return 6 - get.value(card);
				},
				content: function () {
					player.draw();
				},
				precontent: function () {
					player.addTempSkill('sbluanji_used', 'phaseUseAfter');
				},
				ai: {
					threaten: 1.6,
				},
				subSkill: { used: { charlotte: true } }
			},
			sbxueyi: {
				audio: 2,
				trigger: { player: 'useCardToTargeted' },
				filter: function (event, player) {
					return player.hasZhuSkill('sbxueyi') && event.target != player && event.target.group == 'qun';
				},
				zhuSkill: true,
				forced: true,
				logTarget: 'target',
				content: function () {
					player.draw();
				},
				mod: {
					maxHandcard: function (player, num) {
						if (player.hasZhuSkill('sbxueyi')) {
							return num + 2 * game.countPlayer(current => player != current && current.group == 'qun');
						}
					}
				},
				ai: {
					effect: {
						player: function (card, player, target) {
							if (player != target && target && target.group == 'qun' && card.name != 'tao') return [1, 0.1];
						},
					},
				}
			},
			//庞统
			sblianhuan: {
				audio: 2,
				enable: 'phaseUse',
				filterCard: { suit: 'club' },
				filter: function (event, player) {
					return player.countCards('hes', { suit: 'club' });
				},
				filterTarget: function (card, player, target) {
					if (player.hasSkill('sblianhuan_blocker')) return false;
					if (!ui.selected.cards.length) return false;
					card = get.autoViewAs({ name: 'tiesuo' }, [ui.selected.cards[0]]);
					return player.canUse(card, target);
				},
				selectCard: 1,
				position: 'hs',
				derivation: 'sblianhuan_lv2',
				selectTarget: function () {
					var card = get.card(), player = get.player();
					if (player.hasSkill('sblianhuan_blocker')) return 0;
					if (card == undefined) return;
					var range = [0, 2];
					game.checkMod(card, player, range, 'selectTarget', player);
					return range;
				},
				filterOk: function () {
					var card = ui.selected.cards[0];
					if (!card) return false;
					if (get.position(card) == 's' && !ui.selected.targets.length) return false;
					return true;
				},
				check: function (card) {
					return 6 - get.value(card);
				},
				prompt: function () {
					var player = _status.event.player, use = !player.hasSkill('sblianhuan_blocker');
					return '重铸一张♣手牌' + (use ? '；或将一张♣手牌当【铁索连环】使用' : '');
				},
				group: ['sblianhuan_use', 'sblianhuan_add', 'sblianhuan_discard2'],
				multitarget: true,
				multiline: true,
				discard: false,
				lose: false,
				delay: false,
				content: function () {
					'step 0'
					if (targets.length) {
						player.addTempSkill('sblianhuan_blocker', 'phaseUseAfter');
						var card = get.autoViewAs({ name: 'tiesuo' }, cards);
						player.useCard(card, cards, targets);
					}
					else {
						player.loseToDiscardpile(cards);
						player.draw(cards.length);
					}
				},
				subSkill: {
					blocker: { charlotte: true },
					use: {
						audio: 'sblianhuan',
						trigger: { player: 'useCard' },
						filter: function (event, player) {
							return event.card.name == 'tiesuo' && !player.storage.sblianhuan;
						},
						check: function (event, player) {
							var eff = 0, targets = event.targets.filter(i => !i.isLinked());
							for (var target of targets) {
								eff += get.attitude(player, target);
							}
							return eff < -1;
						},
						prompt2: '失去1点体力，然后当此牌指定第一个目标后，你随机弃置所有不处于连环状态的目标角色各一张手牌',
						content: function () {
							'step 0'
							player.loseHp();
							'step 1'
							if (!trigger.card.storage) trigger.card.storage = {};
							trigger.card.storage.sblianhuan = true;
							trigger._sblianhuan = true;
							player.addTempSkill('sblianhuan_discard', 'phaseUseAfter');
						}
					},
					discard: {
						trigger: { global: 'useCardToPlayered' },
						forced: true,
						locked: false,
						popup: false,
						charlotte: true,
						filter: function (event, player) {
							return event.isFirstTarget && event.card.storage && event.card.storage.sblianhuan;
						},
						content: function () {
							'step 0'
							event.targets = trigger.targets.filter(i => !i.isLinked());
							player.logSkill('sblianhuan_discard', event.targets);
							'step 1'
							var target = targets.shift();
							var cards = target.getCards('h', card => {
								return lib.filter.cardDiscardable(card, player, 'sblianhuan');
							});
							if (cards.length > 0) {
								player.line(target);
								target.discard(cards.randomGet());
							}
							if (targets.length) event.redo();
						}
					},
					add: {
						trigger: { player: 'useCard2' },
						filter: function (event, player) {
							return event.card.name == 'tiesuo' && player.storage.sblianhuan && game.hasPlayer(current => {
								return !event.targets.contains(current) && player.canUse(event.card, current);
							});
						},
						direct: true,
						content: function () {
							'step 0'
							player.chooseTarget(get.prompt('sblianhuan_add'), '为' + get.translation(trigger.card) + '额外指定任意个目标', [1, Infinity], function (card, player, target) {
								return !_status.event.sourcex.contains(target) && player.canUse(_status.event.card, target);
							}).set('sourcex', trigger.targets).set('ai', function (target) {
								var player = _status.event.player;
								return get.effect(target, _status.event.card, player, player);
							}).set('card', trigger.card);
							'step 1'
							if (result.bool) {
								if (!event.isMine() && !event.isOnline()) game.delayx();
								event.targets = result.targets;
							}
							else {
								event.finish();
							}
							'step 2'
							player.logSkill('sblianhuan_add', event.targets);
							trigger.targets.addArray(event.targets);
						}
					},
					discard2: {
						trigger: { player: 'useCardToPlayered' },
						forced: true,
						locked: false,
						popup: false,
						filter: function (event, player) {
							return event.isFirstTarget && event.card.name == 'tiesuo' && player.storage.sblianhuan && !event.getParent()._sblianhuan;
						},
						content: function () {
							'step 0'
							event.targets = trigger.targets.filter(i => !i.isLinked());
							player.logSkill('sblianhuan_discard2', event.targets);
							'step 1'
							var target = targets.shift();
							var cards = target.getCards('h', card => {
								return lib.filter.cardDiscardable(card, player, 'sblianhuan');
							});
							if (cards.length > 0) {
								player.line(target);
								target.discard(cards.randomGet());
							}
							if (targets.length) event.redo();
						}
					},
				}
			},
			sbniepan: {
				audio: 2,
				enable: 'chooseToUse',
				mark: true,
				skillAnimation: true,
				animationStr: '涅盘',
				limited: true,
				animationColor: 'orange',
				filter: function (event, player) {
					return event.type == 'dying' && player == event.dying;
				},
				content: function () {
					'step 0'
					player.awakenSkill('sbniepan');
					player.discard(player.getCards('hej'));
					'step 1'
					player.draw(3);
					'step 2'
					if (player.hp < 3) player.recover(3 - player.hp);
					'step 3'
					player.turnOver(false);
					'step 4'
					player.link(false);
					'step 5'
					player.storage.sblianhuan = true;
					game.log(player, '修改了', '#g【连环】');
				},
				ai: {
					order: 1,
					skillTagFilter: function (player, arg, target) {
						if (player != target || player.storage.sbniepan) return false;
					},
					save: true,
					result: {
						player: function (player) {
							if (player.hp <= 0) return 10;
							return 0;
						}
					},
					threaten: function (player, target) {
						if (!target.storage.sbniepan) return 0.6;
					}
				}
			},
			//法正
			sbxuanhuo: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				group: 'sbxuanhuo_rob',
				filterTarget: function (card, player, target) {
					return !target.hasMark('sbxuanhuo_mark') && player != target;
				},
				filterCard: true,
				position: 'he',
				discard: false,
				lose: false,
				delay: false,
				onremove: function (player) {
					delete player.storage.sbxuanhuo;
					player.unmarkSkill('sbxuanhuo');
				},
				check: function (card) {
					return 6.5 - get.value(card);
				},
				content: function () {
					'step 0'
					player.give(cards, target);
					if (player.storage.sbxuanhuo && player.storage.sbxuanhuo[target.playerid]) delete player.storage.sbxuanhuo[target.playerid];
					'step 1'
					target.addMark('sbxuanhuo_mark');
					var history = target.getAllHistory('lose');
					if (history.length) {
						history[history.length - 1].sbxuanhuo_mark = true;
					}
				},
				getNum: function (current, skill) {
					var num = 0;
					var history = current.getAllHistory('lose');
					if (history.length) {
						for (var i = history.length - 1; i >= 0; i--) {
							var evt = history[i];
							if (evt.sbxuanhuo_mark) break;
							if (typeof skill == 'string') {
								if (evt.getParent(2).name == skill) num += evt.cards2.length;
							}
							else {
								var evtx = evt.getParent(), player = skill;
								if (evtx.name == 'gain') {
									var cards = evtx.cards;
									if (evtx.player == player && cards.length > 0) num += cards.length;
								}
								else if (evtx.name == 'loseAsync') {
									if (evtx.type != 'gain' || evtx.giver) return false;
									var cards = evtx.getl(current).cards2;
									var cardsx = evtx.getg(player);
									if (cardsx.length > 0) num += cardsx.length;
								}
							}
						}
					}
					return num;
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							return -Math.sqrt(Math.max(target.hp, 1));
						}
					}
				},
				marktext: '惑',
				intro: {
					content: function (storage, player) {
						if (!storage || get.is.empty(storage)) return '未获得过牌';
						var map = (_status.connectMode ? lib.playerOL : game.playerMap);
						var str = '已获得过';
						for (var i in storage) {
							str += get.translation(map[i]) + '的' + get.cnNumber(storage[i]) + '张牌、';
						}
						return str.slice(0, -1);
					}
				},
				subSkill: {
					mark: {
						marktext: '眩',
						intro: {
							name: '眩惑',
							name2: '眩',
							markcount: () => 0,
							content: '已获得“眩”标记',
						}
					},
					rob: {
						audio: 'sbxuanhuo',
						trigger: {
							global: ['gainAfter', 'loseAsyncAfter'],
						},
						forced: true,
						locked: false,
						direct: true,
						filter: function (event, player) {
							var evt = event.getParent('phaseDraw');
							if (evt && evt.name == 'phaseDraw') return false;
							return game.hasPlayer(current => {
								if (!event.getg(current).length || !current.hasMark('sbxuanhuo_mark')) return false;
								if (evt && evt.player == current) return false;
								if (lib.skill.sbxuanhuo.getNum(current, 'sbxuanhuo_rob') >= 5) return false;
								return current.hasCard(card => lib.filter.canBeGained(card, current, player), 'he');
							});
						},
						content: function () {
							'step 0'
							var evt = trigger.getParent('phaseDraw');
							var targets = game.filterPlayer(current => {
								if (!trigger.getg(current).length || !current.hasMark('sbxuanhuo_mark')) return false;
								if (evt && evt.player == current) return false;
								if (lib.skill.sbxuanhuo.getNum(current, 'sbxuanhuo_rob') >= 5) return false;
								return current.hasCard(card => lib.filter.canBeGained(card, current, player), 'he');
							});
							event.targets = targets;
							'step 1'
							var target = targets.shift();
							player.logSkill('sbxuanhuo', target);
							var hs = target.getCards('h', card => lib.filter.canBeGained(card, target, player));
							if (hs.length) {
								player.gain(hs.randomGet(), target, 'giveAuto');
								if (!player.storage.sbxuanhuo) player.storage.sbxuanhuo = {};
								player.storage.sbxuanhuo[target.playerid] = lib.skill.sbxuanhuo.getNum(target, 'sbxuanhuo_rob') + 1;
								player.markSkill('sbxuanhuo');
							}
							if (targets.length > 0) event.redo();
						},
					}
				}
			},
			sbenyuan: {
				audio: 2,
				forced: true,
				direct: true,
				trigger: { player: 'phaseZhunbeiBegin' },
				filter: function (event, player) {
					return game.hasPlayer(current => current.hasMark('sbxuanhuo_mark'));
				},
				content: function () {
					'step 0'
					var targets = game.filterPlayer(current => current.hasMark('sbxuanhuo_mark'));
					event.targets = targets;
					'step 1'
					var target = targets.shift();
					event.target = target;
					player.logSkill('sbenyuan', target);
					target.removeMark('sbxuanhuo_mark', target.countMark('sbxuanhuo_mark'));
					game.players.forEach(current => {
						var storage = current.storage.sbxuanhuo;
						if (storage && storage[target.playerid]) delete storage[target.playerid];
						if (storage && get.is.empty(storage)) {
							delete current.storage.sbxuanhuo;
							current.unmarkSkill('sbxuanhuo');
						}
					});
					var num = lib.skill.sbxuanhuo.getNum(target, player);
					if (num >= 3) {
						var cards = player.getCards('he');
						if (!cards.length) event._result = { bool: false };
						else if (cards.length <= 2) event._result = { bool: true, cards: cards };
						else player.chooseCard('恩怨：交给' + get.translation(target) + '两张牌', true, 2, 'he');
					}
					else {
						target.loseHp();
						player.recover();
						event.goto(3);
					}
					'step 2'
					if (result.bool) player.give(result.cards, target);
					'step 3'
					if (targets.length) event.goto(1);
				}
			},
			//姜维
			sbtiaoxin: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				chargeSkill: true,
				getLimit: 4,
				filter: function (event, player) {
					return player.hasMark('charge');
				},
				filterTarget: lib.filter.notMe,
				selectTarget: function () {
					return [1, _status.event.player.countMark('charge')];
				},
				multiline: true,
				group: 'sbtiaoxin_backflow',
				content: function () {
					'step 0'
					target.chooseToUse(function (card, player, event) {
						if (get.name(card) != 'sha') return false;
						return lib.filter.filterCard.apply(this, arguments);
					}, '挑衅：对' + get.translation(player) + '使用一张杀，或交给其一张牌').set('targetRequired', true).set('complexSelect', true).set('filterTarget', function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
						return lib.filter.targetEnabled.apply(this, arguments);
					}).set('sourcex', player);
					'step 1'
					if (!result.bool && target.countCards('he') > 0) {
						target.chooseCard('he', '交给' + get.translation(player) + '一张牌', true);
					}
					else event.finish();
					'step 2'
					if (result.bool) {
						target.give(result.cards, player);
					}
				},
				contentAfter: function () {
					player.removeMark('charge', targets.length);
				},
				ai: {
					threaten: 1.2,
					order: 4,
					expose: 0.2,
					result: {
						target: function (player, target) {
							if (target.countGainableCards(player, 'he') == 0) return 0;
							return -1;
						},
						player: function (player, target) {
							if (!target.canUse('sha', player)) return 0;
							if (target.countCards('h') == 0) return 0;
							if (target.countCards('h') == 1) return -0.1;
							if (player.hp <= 2) return -2;
							if (player.countCards('h', 'shan') == 0) return -1;
							return -0.5;
						}
					},
				},
				subSkill: {
					backflow: {
						audio: 'sbtiaoxin',
						trigger: {
							player: ['loseAfter', 'enterGame'],
							global: ['loseAsyncAfter', 'phaseBefore']
						},
						forced: true,
						filter: function (event, player) {
							if (player.countMark('charge') >= lib.skill.sbtiaoxin.getLimit) return false;
							if (event.name.indexOf('lose') == 0) {
								if (event.type != 'discard') return false;
								var evt = event.getParent('phaseDiscard');
								return evt && evt.player == player && event.getl(player).cards2.length > 0;
							}
							else {
								return (event.name != 'phase' || game.phaseNumber == 0);
							}
						},
						content: function () {
							var num = Math.min(lib.skill.sbtiaoxin.getLimit - player.countMark('charge'), trigger.name.indexOf('lose') == 0 ? trigger.getl(player).cards2.length : lib.skill.sbtiaoxin.getLimit);
							if (num > 0) player.addMark('charge', num);
						}
					}
				}
			},
			sbzhiji: {
				audio: 2,
				trigger: { player: 'phaseZhunbeiBegin' },
				juexingji: true,
				forced: true,
				skillAnimation: true,
				animationColor: 'fire',
				filter: function (event, player) {
					var len = 0;
					player.getAllHistory('useSkill', evt => {
						if (evt.skill != 'sbtiaoxin') return false;
						len += evt.targets.length;
					});
					return len >= 4;
				},
				content: function () {
					'step 0'
					player.awakenSkill('sbzhiji');
					player.loseMaxHp();
					'step 1'
					player.chooseTarget('志继：令至少一名角色获得“北伐”标记', true, [1, Infinity]).set('ai', target => -get.attitude(player, target));
					'step 2'
					if (result.bool) {
						player.line(result.targets, 'fire');
						result.targets.forEach(target => {
							target.addAdditionalSkill('sbzhiji_' + player.playerid, 'sbzhiji_beifa');
							target.markAuto('sbzhiji_beifa', [player]);
						});
						player.addTempSkill('sbzhiji_clear', { player: 'phaseBegin' });
						if (!event.isMine() && !event.isOnline()) game.delayx();
					}
				},
				subSkill: {
					beifa: {
						charlotte: true,
						mark: true,
						marktext: '伐',
						intro: {
							name: '北伐',
							name2: '北伐',
							content: '使用牌只能指定$和自己为目标',
						},
						mod: {
							playerEnabled: function (card, player, target) {
								if (player != target && !player.getStorage('sbzhiji_beifa').contains(target)) return false;
							}
						}
					},
					clear: {
						charlotte: true,
						onremove: function (player) {
							game.countPlayer(function (current) {
								current.removeAdditionalSkill('sbzhiji_' + player.playerid);
							});
						}
					}
				}
			},
			//刘备
			sbrende: {
				audio: 3,
				enable: ['chooseToUse', 'chooseToRespond'],
				maxNum: 8,
				filter: function (event, player) {
					if (event.type == 'wuxie' || player.hasSkill('sbrende_used')) return false;
					if (player.countMark('sbrende') < 2) return false;
					for (var name of lib.inpile) {
						if (get.type(name) != 'basic') continue;
						var card = { name: name, isCard: true };
						if (event.filterCard(card, player, event)) return true;
						if (name == 'sha') {
							for (var nature of lib.inpile_nature) {
								card.nature = nature;
								if (event.filterCard(card, player, event)) return true;
							}
						}
					}
					return false;
				},
				group: ['sbrende_give', 'sbrende_gain'],
				chooseButton: {
					dialog: function (event, player) {
						var dialog = ui.create.dialog('仁德');
						if (event.type == 'phase') {
							dialog._chosenOpt = [];
							var table = document.createElement('div');
							table.classList.add('add-setting');
							table.style.margin = '0';
							table.style.width = '100%';
							table.style.position = 'relative';
							var list = ['视为使用基本牌', '交给其他角色牌'];
							for (var i of list) {
								var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
								td.innerHTML = '<span>' + i + '</span>';
								td.link = i;
								if (i == list[0]) {
									td.classList.add('bluebg');
									dialog._chosenOpt.add(td);
								}
								td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
									if (_status.dragged) return;
									if (_status.clicked) return;
									if (_status.justdragged) return;
									_status.tempNoButton = true;
									_status.clicked = true;
									setTimeout(function () {
										_status.tempNoButton = false;
									}, 500);
									var link = this.link;
									if (link == '交给其他角色牌') game.uncheck();
									var current = this.parentNode.querySelector('.bluebg');
									if (current) {
										current.classList.remove('bluebg');
										dialog._chosenOpt.remove(current);
									}
									dialog._chosenOpt.add(this);
									this.classList.add('bluebg');
									game.check();
								});
								table.appendChild(td);
								dialog.buttons.add(td);
							}
							dialog.content.appendChild(table);
						}
						var cards = [];
						for (var name of lib.inpile) {
							if (get.type(name) != 'basic') continue;
							var card = { name: name, isCard: true };
							if (event.filterCard(card, player, event)) cards.push(['基本', '', name]);
							if (name == 'sha') {
								for (var nature of lib.inpile_nature) {
									card.nature = nature;
									if (event.filterCard(card, player, event)) cards.push(['基本', '', name, nature]);
								}
							}
						}
						dialog.add([cards, 'vcard'])
						return dialog;
					},
					check: function (button, player) {
						if (typeof button.link == 'string') return -1;
						if (_status.event.getParent().type != 'phase') return 1;
						return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3] });
					},
					select: function () {
						var opts = _status.event.dialog._chosenOpt;
						return opts && opts.length && opts[0].link == '交给其他角色牌' ? 0 : 1;
					},
					backup: function (links, player) {
						var isUse = links.length == 1;
						var backup = get.copy(lib.skill['sbrende_' + (isUse ? 'use' : 'give')]);
						if (isUse) backup.viewAs = { name: links[0][2], nature: links[0][3], isCard: true };
						return backup;
					},
					prompt: function (links, player) {
						var isUse = links.length == 1;
						return (isUse ? ('移去2枚“仁望”，视为使用或打出' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]))
							: '###仁德###出牌阶段每名角色限一次。你可以将任意张牌交给一名其他角色，然后你获得等量“仁望”标记（至多为' + lib.skill.sbrende.maxNum + '）');
					}
				},
				hiddenCard: function (player, name) {
					return get.type(name) == 'basic' && player.countMark('sbrende') > 1 && player.hasSkill('sbrende_used');
				},
				marktext: '仁',
				intro: {
					name: '仁望',
					name2: '仁望',
					content: 'mark',
				},
				ai: {
					respondSha: true,
					respondShan: true,
					save: true,
					skillTagFilter: function (player) {
						return player.countMark('sbrende') > 1 && !player.hasSkill('sbrende_used');
					},
					order: function (item, player) {
						if (_status.event.type == 'phase' && lib.skill.sbzhangwu.ai.result.player(player) > 0) return 9.1;
						return 0.5;
					},
					result: {
						player: function (player) {
							if (_status.event.dying) {
								return get.attitude(player, _status.event.dying);
							}
							return _status.event.type == 'phase' && player.countMark('sbrende') <= 2 ? 0 : 1;
						},
					},
				},
				subSkill: {
					backup: {},
					used: { charlotte: true },
					given: { onremove: true },
					use: {
						audio: 'sbrende',
						filterCard: () => false,
						selectCard: -1,
						popname: true,
						precontent: function () {
							player.logSkill('sbrende_use');
							delete event.result.skill;
							player.removeMark('sbrende', 2);
							player.addTempSkill('sbrende_used');
						}
					},
					give: {
						audio: 'sbrende',
						enable: 'phaseUse',
						filterCard: true,
						selectCard: [1, Infinity],
						position: 'he',
						discard: false,
						lose: false,
						delay: false,
						filter: function (event, player) {
							return player.countMark('sbrende') < 2 || player.hasSkill('sbrende_used');
						},
						filterTarget: function (card, player, target) {
							if (player.getStorage('sbrende_given').contains(target)) return false;
							return player != target;
						},
						prompt: function (event) {
							return '出牌阶段每名角色限一次。你可以将任意张牌交给一名其他角色，然后你获得等量“仁望”标记（至多为' + lib.skill.sbrende.maxNum + '）';
						},
						check: function (card) {
							var player = get.owner(card);
							if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
							if (ui.selected.cards.length + player.countMark('sbrende') > lib.skill.sbrende.maxNum) return 0;
							if (!ui.selected.cards.length && card.name == 'du') return 20;
							if (ui.selected.cards.length >= Math.max(2, player.countCards('he') - player.hp)) return 0;
							if (player.countCards('he') <= 1) {
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (players[i].hasSkill('haoshi') &&
										!players[i].isTurnedOver() &&
										!players[i].hasJudge('lebu') &&
										get.attitude(player, players[i]) >= 3 &&
										get.attitude(players[i], player) >= 3) {
										return 11 - get.value(card);
									}
								}
								if (player.countCards('he') > player.hp) return 10 - get.value(card);
								if (player.countCards('he') > 2) return 6 - get.value(card);
								return -1;
							}
							return 18 - (ui.selected.cards.length + player.countMark('sbrende')) - get.value(card);
						},
						content: function () {
							player.addTempSkill('sbrende_given', 'phaseUseAfter');
							player.markAuto('sbrende_given', [target]);
							player.markAuto('sbrende_givenx', [target]);
							player.give(cards, target);
							var num = Math.min(lib.skill.sbrende.maxNum - player.countMark('sbrende'), cards.length);
							if (num > 0) player.addMark('sbrende', num);
						},
						ai: {
							order: function (skill, player) {
								return player.countMark('sbrende') < 2 ? 6.8 : 5.8;
							},
							result: {
								target: function (player, target) {
									if (!player.hasFriend() && player.hasSkill('sbzhangwu') && ui.selected.cards.length &&
										get.value(ui.selected.cards[0]) > (lib.skill.sbzhangwu.filterTarget(null, player, target) ? 3 : 5)) return -0.1;
									if (target.hasSkillTag('nogain')) return 0;
									if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
										if (target.hasSkillTag('nodu')) return 0;
										return -10;
									}
									if (target.hasJudge('lebu')) return 0;
									var nh = target.countCards('h');
									return Math.max(1, 5 - nh);
								}
							},
							threaten: 1.1
						},
					},
					gain: {
						audio: 'sbrende',
						trigger: { player: 'phaseUseBegin' },
						forced: true,
						locked: false,
						filter: function (event, player) {
							return player.countMark('sbrende') < lib.skill.sbrende.maxNum;
						},
						content: function () {
							var num = Math.min(lib.skill.sbrende.maxNum - player.countMark('sbrende'), 2);
							if (num > 0) player.addMark('sbrende', num);
						}
					},
				},
			},
			sbzhangwu: {
				audio: 2,
				enable: 'phaseUse',
				skillAnimation: 'epic',
				animationColor: 'orange',
				limited: true,
				filter: function (event, player) {
					if (game.roundNumber <= 1) return false;
					if (!game.hasPlayer(current => lib.skill.sbzhangwu.filterTarget(null, player, current))) return false;
					return true;
				},
				filterTarget: function (card, player, target) {
					if (target == player) return false;
					return player.getStorage('sbrende_givenx').contains(target);
				},
				selectTarget: [-1, -2],
				multiline: true,
				content: function () {
					'step 0'
					player.awakenSkill('sbzhangwu');
					var num = Math.min(game.roundNumber - 1, 3);
					var cards = target.getCards('he'), count = cards.length;
					if (count == 0) event.finish();
					else if (count <= num) event._result = { bool: true, cards: cards };
					else target.chooseCard('章武：交给' + get.translation(player) + get.cnNumber(num) + '张牌', true, 'he', num);
					'step 1'
					if (result.bool) {
						target.give(result.cards, player);
					}
				},
				contentAfter: function () {
					'step 0'
					player.recover(3);
					'step 1'
					player.removeSkill('sbrende');
					game.log(player, '失去了技能', '#g【' + get.translation('sbrende') + '】');
					game.delayx();
				},
				ai: {
					order: 9,
					combo: 'sbrende',
					result: {
						player: function (player, target) {
							var targets = game.filterPlayer(current => lib.skill.sbzhangwu.filterTarget(null, player, current));
							if (!targets.length) return 0;
							var eff = 0;
							for (var target of targets) {
								eff += get.effect(target, { name: 'shunshou_copy2' }, player, player);
							}
							eff += 15 - 5 * Math.max(0, 3 - player.getDamagedHp());
							return eff > 15 ? 1 : 0;
						},
					}
				}
			},
			sbjijiang: {
				audio: 2,
				trigger: { player: 'phaseUseEnd' },
				zhuSkill: true,
				unique: true,
				direct: true,
				filter: function (event, player) {
					if (!player.hasZhuSkill('sbjijiang')) return false;
					return game.hasPlayer(current => {
						if (current.group != 'shu' || player == current || current.hp < player.hp) return false;
						return game.hasPlayer(currentx => current.inRange(currentx));
					});
				},
				content: function () {
					'step 0'
					var next = player.chooseTarget(get.prompt2('sbjijiang'), 2);
					next.set('filterTarget', (card, player, target) => {
						if (!ui.selected.targets.length) return true;
						var current = ui.selected.targets[0];
						if (current.group == 'shu' && current.hp >= player.hp && current != player) {
							return current.inRange(target);
						}
						else {
							return target.group == 'shu' && target.hp >= player.hp && target.inRange(current) && target != player;
						}
					})
					next.set('targetprompt', target => {
						var player = _status.event.player;
						if (target.group == 'shu' && target.hp >= player.hp && target != player && !ui.selected.targets.some(i => {
							return i != target && i.hp >= player.hp && i.group == 'shu';
						})) return '进行选择';
						return '出杀对象';
					});
					next.set('ai', target => {
						var player = _status.event.player;
						if (ui.selected.targets.length) {
							var current = ui.selected.targets[0];
							if (current.group == 'shu' && current.hp >= player.hp && current != player) {
								return -get.attitude(player, target);
							}
							return Math.abs(get.attitude(player, current));
						}
						else {
							if (target.group == 'shu' && target.hp >= player.hp && target != player && game.hasPlayer(current => {
								return get.attitude(player, current) < 0;
							})) return 10;
							return 1;
						}
					})
					'step 1'
					if (result.bool) {
						var targets = result.targets;
						event.targets = targets;
						if (targets[0].group != 'shu' || targets[0].hp < player.hp || targets[0] == player) targets.reverse();
						player.logSkill('sbjijiang', targets, false);
						player.line2(targets);
						var choiceList = [
							'视为对' + get.translation(targets[1]) + '使用一张【杀】',
							'你的下一个出牌阶段开始前，跳过此阶段'
						];
						targets[0].chooseControl().set('choiceList', choiceList).set('ai', () => {
							return _status.event.choice;
						}).set('choice', get.effect(targets[1], { name: 'sha' }, targets[0], targets[0]) > get.effect(targets[0], { name: 'lebu' }, targets[0], targets[0]) ? 0 : 1);
					}
					else event.finish();
					'step 2'
					if (result.index == 0) {
						targets[0].useCard({ name: 'sha', isCard: true }, targets[1], false);
					}
					else {
						targets[0].addSkill('sbjijiang_skip');
					}
				},
				subSkill: {
					skip: {
						trigger: { player: 'phaseUseBefore' },
						charlotte: true,
						forced: true,
						content: function () {
							trigger.cancel();
							player.removeSkill('sbjijiang_skip');
						}
					},
				}
			},
			//赵云
			sblongdan: {
				audio: 2,
				enable: ['chooseToUse', 'chooseToRespond'],
				chargeSkill: true,
				getLimit: 3,
				filter: function (event, player) {
					if (event.type == 'wuxie' || !player.hasMark('charge')) return false;
					var marked = player.hasSkill('sblongdan_mark', null, null, false);
					for (var name of lib.inpile) {
						if (!marked && name != 'sha' && name != 'shan') continue;
						if (get.type(name) != 'basic') continue;
						if (player.hasCard(lib.skill.sblongdan.getFilter(name, player), 'hs')) {
							if (event.filterCard({ name: name }, player, event)) return true;
							if (marked && name == 'sha') {
								for (var nature of lib.inpile_nature) {
									if (event.filterCard({ name: name, nature: nature }, player, event)) return true;
								}
							}
						}
					}
					return false;
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						var marked = player.hasSkill('sblongdan_mark', null, null, false);
						for (var name of lib.inpile) {
							if (!marked && name != 'sha' && name != 'shan') continue;
							if (get.type(name) != 'basic') continue;
							if (player.hasCard(lib.skill.sblongdan.getFilter(name, player), 'hs')) {
								if (event.filterCard({ name: name }, player, event)) list.push(['基本', '', name]);
								if (marked && name == 'sha') {
									for (var nature of lib.inpile_nature) {
										if (event.filterCard({ name: name, nature: nature }, player, event)) list.push(['基本', '', name, nature])
									}
								}
							}
						}
						return ui.create.dialog('龙胆', [list, 'vcard'], 'hidden');
					},
					check: function (button) {
						if (_status.event.getParent().type != 'phase') return 1;
						var player = _status.event.player, card = { name: button.link[2], nature: button.link[3] };
						if (card.name == 'jiu' && Math.min(player.countMark('charge'), player.countCards('h', { type: 'basic' })) < 2) return 0;
						return player.getUseValue(card, null, true);
					},
					backup: function (links, player) {
						return {
							viewAs: {
								name: links[0][2],
								nature: links[0][3],
							},
							filterCard: lib.skill.sblongdan.getFilter(links[0][2], player),
							position: 'he',
							popname: true,
							check: function (card) {
								return 6 / Math.max(1, get.value(card));
							},
							precontent: function () {
								player.removeMark('charge', 1);
								player.addTempSkill('sblongdan_draw');
							},
						}
					},
					prompt: function (links, player) {
						var marked = player.hasSkill('sblongdan_mark', null, null, false);
						var card = {
							name: links[0][2],
							nature: links[0][3],
							isCard: true,
						};
						if (marked) return '将一张基本牌当做' + get.translation(card) + '使用';
						return '将一张' + (card.name == 'sha' ? '闪' : '杀') + '当做' + get.translation(card) + '使用';
					},
				},
				hiddenCard: function (player, name) {
					if (get.type(name) != 'basic' || !player.hasMark('charge')) return false;
					var marked = player.hasSkill('sblongdan_mark', null, null, false);
					if (!marked && name != 'sha' && name != 'shan') return false;
					return player.hasCard(lib.skill.sblongdan.getFilter(name, player), 'hs');
				},
				ai: {
					respondSha: true,
					respondShan: true,
					skillTagFilter: function (player, tag) {
						return lib.skill.sblongdan.hiddenCard(player, tag == 'respondSha' ? 'sha' : 'shan')
					},
					order: 9,
					result: {
						player: function (player) {
							if (_status.event.dying) return get.attitude(player, _status.event.dying);
							return 1;
						},
					},
				},
				getFilter: function (name, player) {
					if (!player.hasSkill('sblongdan_mark', null, null, false)) {
						if (name == 'sha') return { name: 'shan' };
						if (name == 'shan') return { name: 'sha' };
						return (() => false);
					}
					return { type: 'basic' };
				},
				group: 'sblongdan_charge',
				onremove: function (player) {
					player.removeSkill('sblongdan_mark');
				},
				subSkill: {
					backup: { audio: 'sblongdan' },
					mark: { charlotte: true },
					draw: {
						charlotte: true,
						trigger: { player: ['useCardAfter', 'respondAfter'] },
						forced: true,
						popup: false,
						filter: function (event, player) {
							return event.skill == 'sblongdan_backup';
						},
						content: function () {
							player.draw();
						},
					},
					charge: {
						audio: 'sblongdan',
						trigger: {
							global: ['phaseBefore', 'phaseEnd'],
							player: 'enterGame',
						},
						forced: true,
						filter: function (event, player, name) {
							if (player.countMark('charge') >= lib.skill.sblongdan.getLimit) return false;
							return (name != 'phaseBefore' || game.phaseNumber == 0);
						},
						content: function () {
							player.addMark('charge', 1);
						},
					},
				},
			},
			sbjizhu: {
				audio: 2,
				trigger: { player: 'phaseZhunbeiBegin' },
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(lib.filter.notMe, get.prompt('sbjizhu'), '和一名其他角色进行“协力”').set('ai', function (target) {
						return get.threaten(target) * Math.sqrt(1 + target.countCards('h')) * ((target.isTurnedOver() || target.hasJudge('lebu')) ? 0.1 : 1);
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill('sbjizhu', target);
						player.chooseCooperationFor(target, 'sbjizhu').set('ai', function (button) {
							var base = 0;
							switch (button.link) {
								case 'cooperation_damage': base = 0.1; break;
								case 'cooperation_draw': base = 0.6; break;
								case 'cooperation_discard': base = 0.1; break;
								case 'cooperation_use': base = 0.6; break;
							}
							return base + Math.random();
						});
						player.addAdditionalSkill('cooperation', 'sbjizhu_effect');
					}
					else event.finish();
					'step 2'
					game.delayx();
				},
				subSkill: {
					effect: {
						audio: 'sbjizhu',
						charlotte: true,
						trigger: { global: 'phaseJieshuBegin' },
						forced: true,
						logTarget: 'player',
						filter: function (event, player) {
							return player.checkCooperationStatus(event.player, 'sbjizhu') && player.hasSkill('sblongdan', null, null, false);
						},
						content: function () {
							game.log(player, '和', trigger.player, '的协力成功');
							player.addTempSkill('sblongdan_mark', { player: 'phaseJieshuBegin' });
							game.delayx();
						},
					},
				},
				derivation: 'sblongdan_shabi',
			},
			//张飞
			sbpaoxiao: {
				audio: 2,
				mod: {
					cardUsable: function (card) {
						if (card.name == 'sha') return Infinity;
					},
					targetInRange: function (card, player, target) {
						if (card.name == 'sha' && player.getEquip(1)) return true;
					},
				},
				trigger: { player: 'useCard' },
				forced: true,
				filter: function (event, player) {
					if (event.card.name != 'sha') return false;
					var evt = event.getParent('phaseUse');
					if (!evt || evt.player != player) return false;
					return player.hasHistory('useCard', function (evtx) {
						return evtx != event && evtx.card.name == 'sha' && evtx.getParent('phaseUse') == evt;
					}, event);
				},
				content: function () {
					if (!trigger.card.storage) trigger.card.storage = {};
					trigger.card.storage.sbpaoxiao = true;
					trigger.baseDamage++;
					trigger.directHit.addArray(game.players);
					player.addTempSkill('sbpaoxiao_effect', 'phaseUseAfter');
				},
				subSkill: {
					effect: {
						charlotte: true,
						trigger: { player: 'useCardToPlayered' },
						forced: true,
						popup: false,
						filter: function (event, player) {
							return event.card.storage && event.card.storage.sbpaoxiao && event.target.isIn();
						},
						content: function () {
							trigger.target.addTempSkill('fengyin');
						},
						group: 'sbpaoxiao_recoil',
					},
					recoil: {
						charlotte: true,
						trigger: { source: 'damageSource' },
						forced: true,
						filter: function (event, player) {
							return event.card && event.card.storage && event.card.storage.sbpaoxiao && event.player.isIn();
						},
						content: function () {
							'step 0'
							player.loseHp();
							'step 1'
							var hs = player.getCards('h', function (card) {
								return lib.filter.cardDiscardable(card, player, 'sbpaoxiao_recoil');
							});
							if (hs.length > 0) player.discard(hs.randomGet());
						},
					},
				},
			},
			sbxieji: {
				audio: 3,
				trigger: { player: 'phaseZhunbeiBegin' },
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(lib.filter.notMe, get.prompt('sbxieji'), '和一名其他角色进行“协力”').set('ai', function (target) {
						return get.threaten(target) * Math.sqrt(1 + target.countCards('h')) * ((target.isTurnedOver() || target.hasJudge('lebu')) ? 0.1 : 1);
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill('sbxieji', target);
						//选择对方的协击条件
						player.chooseCooperationFor(target, 'sbxieji').set('ai', function (button) {
							var base = 0;
							switch (button.link) {
								case 'cooperation_damage': base = 0.8; break;
								case 'cooperation_draw': base = 0.1; break;
								case 'cooperation_discard': base = 0.1; break;
								case 'cooperation_use': base = 0.1; break;
							}
							return base + Math.random();
						});
						//保证技能cooperation被移除之后 失去该技能
						player.addAdditionalSkill('cooperation', 'sbxieji_effect');
					}
					else event.finish();
					'step 2'
					game.delayx();
				},
				subSkill: {
					effect: {
						audio: 'sbxieji',
						charlotte: true,
						trigger: { global: 'phaseJieshuBegin' },
						direct: true,
						filter: function (event, player) {
							//判断自己是否有目标为该角色 且已经完成的协力记录
							return player.checkCooperationStatus(event.player, 'sbxieji');
						},
						content: function () {
							'step 0'
							game.log(player, '和', trigger.player, '的协力成功');
							player.chooseTarget('协击：请选择【杀】的目标', '你和' + get.translation(trigger.player) + '协力成功，可以视为对至多三名其他角色使用一张【杀】，且此【杀】造成伤害时，你摸等同于伤害值的牌', [1, 3], true, function (card, player, target) {
								return player.canUse('sha', target, false);
							}).set('ai', function (target) {
								var player = _status.event.player;
								return get.effect(target, { name: 'sha' }, player, player);
							});
							'step 1'
							if (result.bool) {
								player.addTempSkill('sbxieji_reward', 'sbxieji_effectAfter');
								player.useCard({
									name: 'sha',
									isCard: true,
									storage: { sbxieji: true },
								}, 'sbxieji_effect', result.targets);
							}
						},
					},
					reward: {
						charlotte: true,
						trigger: { source: 'damageSource' },
						forced: true,
						popup: false,
						filter: function (event, player) {
							return event.card && event.card.storage && event.card.storage.sbxieji && event.getParent().type == 'card';
						},
						content: function () {
							player.draw(trigger.num);
						},
					},
				},
			},
			//徐晃
			sbduanliang: {
				audio: 1,
				enable: 'phaseUse',
				usable: 1,
				filterTarget: lib.filter.notMe,
				content: function () {
					'step 0'
					player.chooseToDuiben(target).set('title', '谋弈').set('namelist', [
						'固守城池', '突出重围', '围城断粮', '擂鼓进军'
					]).set('ai', button => {
						var source = _status.event.getParent().player, target = _status.event.getParent().target;
						if (get.effect(target, { name: 'juedou' }, source, source) >= 10 && button.link[2] == 'db_def2' && Math.random() < 0.5) return 10;
						return 1 + Math.random();
					});
					'step 1'
					if (result.bool) {
						if (result.player == 'db_def1') {
							if (target.hasJudge('bingliang')) player.gainPlayerCard(target, 'he', true);
							else {
								if (ui.cardPile.childNodes.length > 0) {
									if (player.canUse(get.autoViewAs({ name: 'bingliang' }, [ui.cardPile.firstChild]), target, false)) {
										player.useCard({ name: 'bingliang' }, target, get.cards());
									}
								}
							}
						}
						else {
							var card = { name: 'juedou', isCard: true };
							if (player.canUse(card, target)) player.useCard(card, target);
						}
					}
				},
				ai: {
					threaten: 1.2,
					order: 5.5,
					result: {
						player: 1,
						target: -1
					}
				},
				subSkill: {
					true1: { audio: true },
					true2: { audio: true },
					false: { audio: true },
				}
			},
			sbshipo: {
				audio: 2,
				trigger: { player: 'phaseJieshuBegin' },
				direct: true,
				filter: function (event, player) {
					return game.hasPlayer(current => {
						return current.hp < player.hp || current.hasJudge('bingliang');
					});
				},
				content: function () {
					'step 0'
					var list = [];
					var choiceList = ['选择一名体力少于你的角色', '选择所有判定区有兵粮寸断的其他角色'];
					var bool = false, bool2 = false;
					game.filterPlayer(current => {
						if (current.hp < player.hp) bool = true;
						if (current.hasJudge('bingliang')) bool2 = true;
					});
					if (bool) list.push('选项一');
					else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + '</span>';
					if (bool2) list.push('选项二');
					else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + '</span>';
					if (_status.connectMode) game.broadcastAll(function () { _status.noclearcountdown = true });
					player.chooseControl(list, 'cancel2').set('prompt', get.prompt2('sbshipo')).set('choiceList', choiceList).set('ai', () => {
						return _status.event.choice;
					}).set('choice', (function () {
						var eff = 0, eff2 = 0;
						if (!list.contains('选项一')) eff = Infinity;
						if (!list.contains('选项二')) eff2 = Infinity;
						game.countPlayer(current => {
							if (current.hp < player.hp) {
								var effx = get.attitude(player, current) / Math.sqrt(Math.max(0.1, 2 * current.hp + current.countCards('h')));
								if (effx < eff) eff = effx;
							}
							if (current.hasJudge('bingliang')) eff2 += get.attitude(player, current) / Math.sqrt(Math.max(0.1, 2 * current.hp + current.countCards('h')));
						});
						if (eff > 0 && eff2 > 0) return 'cancel2';
						return eff < eff2 ? '选项一' : '选项二';
					})());
					'step 1'
					if (result.control == 'cancel2') {
						game.broadcastAll(function () { delete _status.noclearcountdown; game.stopCountChoose() });
						event.finish(); return;
					}
					if (result.control == '选项一') {
						player.chooseTarget('选择一名体力少于你的角色', (card, player, target) => target.hp < player.hp, true).set('ai', target => -get.attitude(player, target) / Math.sqrt(Math.max(0.1, 2 * target.hp + target.countCards('h'))));
					}
					else {
						event._result = { bool: true, targets: game.filterPlayer(current => current.hasJudge('bingliang')) };
					}
					'step 2'
					game.broadcastAll(function () { delete _status.noclearcountdown; game.stopCountChoose() });
					if (result.bool) {
						var targets = result.targets;
						player.logSkill('sbshipo', targets);
						event.targets = targets.sortBySeat();
						event.cards = [];
					}
					else event.finish();
					'step 3'
					var target = event.targets.shift();
					event.target = target;
					target.chooseCard('交给' + get.translation(player) + '一张手牌，或受到1点伤害').set('ai', card => {
						var player = _status.event.player, source = _status.event.getParent().player;
						if (get.damageEffect(player, source, player) > 0) return 0;
						if (get.attitude(player, source) > 0) return 1;
						if (get.tag(card, 'recover') > 0) return 0;
						return (player.hp < 2 ? 7 : 5.5) - get.value(card);
					});
					'step 4'
					if (result.bool) {
						event.cards.addArray(result.cards);
						target.give(result.cards, player);
					}
					else {
						target.damage();
					}
					'step 5'
					if (event.targets.length) event.goto(3);
					else {
						var cards = event.cards.filter(card => get.owner(card) == player && get.position(card) == 'h');
						if (!cards.length) event.finish();
						else event.cards = cards;
					}
					'step 6'
					player.chooseCardTarget({
						filterCard: function (card, player, target) {
							return _status.event.getParent().cards.contains(card);
						},
						filterTarget: lib.filter.notMe,
						selectCard: [1, event.cards.length],
						prompt: '是否将任意张获得的牌交给一名其他角色？',
						ai1: function (card) {
							var player = _status.event.player;
							var val = player.getUseValue(card);
							if (val > 0) return 2;
							if (player.hp <= 2 && val == 0 && get.value(card) > 5) return 0;
							return Math.random() > 0.5 ? 1 : 0;
						},
						ai2: function (target) {
							var player = _status.event.player, cards = ui.selected.cards;
							var val = 0;
							for (var card of cards) {
								val += target.getUseValue(card);
							}
							if (val > 0) return val * get.attitude(player, target) * 2;
							return get.value(card, target) * get.attitude(player, target);
						},
					});
					'step 7'
					if (result.bool) {
						var cards = result.cards, target = result.targets[0];
						player.give(cards, target);
					}
				}
			},
			//马超
			sbtieji: {
				audio: 1,
				trigger: { player: 'useCardToPlayered' },
				logTarget: 'target',
				filter: function (event, player) {
					return player != event.target && event.card.name == 'sha' && event.target.isIn();
				},
				check: function (event, player) {
					return get.attitude(player, event.target) < 0;
				},
				content: function () {
					'step 0'
					var target = trigger.target;
					event.target = target;
					target.addTempSkill('fengyin');
					trigger.directHit.add(target);
					player.chooseToDuiben(target).set('title', '谋弈').set('namelist', [
						'出阵迎战', '拱卫中军', '直取敌营', '扰阵疲敌'
					]);
					'step 1'
					if (result.bool) {
						if (result.player == 'db_def1') player.gainPlayerCard(target, 'he', true);
						else player.draw(2);
					}
				},
				shaRelated: true,
				ai: {
					ignoreSkill: true,
					skillTagFilter: function (player, tag, arg) {
						if (tag == 'directHit_ai') {
							return get.attitude(player, arg.target) <= 0;
						}
						if (!arg || arg.isLink || !arg.card || arg.card.name != 'sha') return false;
						if (!arg.target || get.attitude(player, arg.target) >= 0) return false;
						if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || get.is.locked(arg.skill) || !arg.target.getSkills(true, false).contains(arg.skill)) return false;
					},
					directHit_ai: true,
				},
				subSkill: {
					true1: { audio: true },
					true2: { audio: true },
					false: { audio: true },
				}
			},
			//甘宁
			sbqixi: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				filterTarget: lib.filter.notMe,
				content: function () {
					'step 0'
					event.list = lib.suit.slice();
					event.suits = [];
					event.num = 0;
					var cards = player.getCards('h'), map = {}, max = -Infinity;
					for (var card of cards) {
						var suit = get.suit(card, player);
						if (!map[suit]) map[suit] = 0;
						map[suit]++;
						if (map[suit] > max) max = map[suit];
					}
					for (var i in map) {
						if (map[i] == max) event.suits.push(i);
					}
					'step 1'
					target.chooseControl(event.list).set('prompt', '奇袭：猜测' + get.translation(player) + '手牌中最多的花色').set('ai', () => {
						var player = _status.event.getParent().player, controls = _status.event.controls;
						if (player.countCards('h') <= 3 && controls.contains('diamond') && Math.random() < 0.3) return 'diamond';
						return controls.randomGet();
					});
					'step 2'
					var control = result.control;
					target.chat('我猜是' + get.translation(control) + '！');
					game.log(target, '猜测为', '#y' + control);
					if (!event.isMine() && !event.isOnline()) game.delayx();
					'step 3'
					var control = result.control;
					if (!event.suits.contains(control)) {
						player.chat('猜错了！');
						game.log(target, '猜测', '#y错误');
						event.num++;
						event.list.remove(control);
						player.chooseBool('是否令其重新选择一个花色继续猜测？').set('ai', () => 1);
					}
					else {
						player.chat(event.num == 0 ? '这么准？' : '猜对了！');
						game.log(target, '猜测', '#g正确');
						player.showHandcards();
						event.goto(4);
					}
					'step 4'
					if (result.bool) {
						event.goto(1);
					}
					'step 5'
					if (target.countDiscardableCards(player, 'hej')) {
						player.line(target);
						player.discardPlayerCard(target, event.num + 1, true, 'hej');
					}
				},
				ai: {
					order: 10,
					result: {
						player: 1,
						target: function (player, target) {
							return get.effect(target, { name: 'guohe' }, player, target) * (5 - get.attitude(player, target) / 2);
						}
					}
				}
			},
			sbfenwei: {
				audio: 2,
				enable: 'phaseUse',
				filter: function (event, player) {
					return player.countCards('he') > 0;
				},
				skillAnimation: true,
				animationColor: 'wood',
				limited: true,
				position: 'he',
				filterCard: true,
				selectCard: [1, 3],
				filterTarget: true,
				selectTarget: function () {
					return ui.selected.cards.length;
				},
				delay: false,
				discard: false,
				lose: false,
				complexSelect: true,
				filterOk: function () {
					return ui.selected.targets.length == ui.selected.cards.length;
				},
				multitarget: true,
				multiline: true,
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					'step 0'
					player.awakenSkill('sbfenwei');
					for (var i = 0; i < cards.length; i++) {
						targets[i].addToExpansion(cards[i], player, 'give').gaintag.add('sbfenwei_effect');
					}
					'step 1'
					player.addSkill('sbfenwei_effect');
					player.draw(cards.length);
				},
				intro: {
					content: 'limited'
				},
				ai: {
					order: 6.9,
					result: {
						target: function (player, target) {
							if (game.hasPlayer(current => {
								return get.rawAttitude(player, current) > 0 && current != player && get.attitude(player, current) <= 0;
							}) && game.countPlayer(current => {
								return get.attitude(player, current) > 0;
							}) <= 2) return 0;
							return 1;
						},
					}
				},
				subSkill: {
					effect: {
						audio: 'sbfenwei',
						trigger: {
							global: 'useCardToTarget',
						},
						charlotte: true,
						forced: true,
						filter: function (event, player) {
							return event.target.getExpansions('sbfenwei_effect').length > 0 && get.type2(event.card) == 'trick';
						},
						content: function () {
							'step 0'
							var choiceList = ['令' + get.translation(trigger.target) + '获得其“威”', '移去' + get.translation(trigger.target) + '的“威”，取消' + get.translation(trigger.card) + '对其的目标'];
							player.chooseControl().set('choiceList', choiceList).set('prompt', '奋威：请选择一项').set('ai', () => {
								var player = _status.event.player, evt = _status.event.getTrigger();
								if (get.effect(evt.target, evt.card, evt.player, player) < -10) return 1;
								return 0;
							});
							'step 1'
							var cards = trigger.target.getExpansions('sbfenwei_effect');
							if (result.index == 0) {
								trigger.target.gain(cards, 'gain2', 'fromStorage');
							}
							else {
								trigger.target.loseToDiscardpile(cards);
								trigger.targets.remove(trigger.target);
								trigger.getParent().triggeredTargets2.remove(trigger.target);
								trigger.untrigger();
							}
						},
						marktext: '威',
						intro: {
							name: '威',
							markcount: 'expansion',
							content: 'expansion',
						},
					}
				}
			},
			//甄宓
			sbluoshen: {
				audio: 2,
				trigger: { player: 'phaseZhunbeiBegin' },
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt2('sbluoshen')).set('ai', target => {
						var eff = 0;
						var num = Math.ceil(game.countPlayer() / 2), players = game.filterPlayer(current => current != player).sortBySeat(target).slice(0, num);
						for (var targetx of players) {
							eff += get.attitude(player, targetx) * Math.sqrt(targetx.countCards('h'));
						}
						return 1 - eff;
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill('sbluoshen', target);
						player.addTempSkill('sbluoshen_add');
						event.targets = game.filterPlayer(current => current != player).sortBySeat(target).slice(0, Math.ceil(game.countPlayer() / 2));
					} else event.finish();
					'step 2'
					var target = event.targets.shift();
					event.target = target;
					player.line(target);
					if (!target.countCards('h')) event._result = { bool: false };
					else target.chooseCard('展示一张手牌', true).set('ai', card => {
						var val = _status.event.goon ? 15 : 5;
						if (get.color(card) == 'black') return val - get.value(card);
						return 7 - get.value(card);
					}).set('goon', get.attitude(target, player) > 0);
					'step 3'
					if (result.bool) {
						var card = result.cards[0];
						target.showCards(card, get.translation(target) + '【洛神】展示');
						if (get.color(card) == 'black') {
							player.gain(card, target, 'give', 'bySelf').gaintag.add('sbluoshen');
						}
						else if (get.color(card) == 'red') {
							target.discard(card);
						}
					}
					'step 4'
					if (targets.length) event.goto(2);
				},
				subSkill: {
					add: {
						mod: {
							ignoredHandcard: function (card, player) {
								if (card.hasGaintag('sbluoshen')) {
									return true;
								}
							},
							cardDiscardable: function (card, player, name) {
								if (name == 'phaseDiscard' && card.hasGaintag('sbluoshen')) {
									return false;
								}
							},
						},
						onremove: function (player) {
							player.removeGaintag('sbluoshen');
						},
					}
				}
			},
			//曹操
			sbjianxiong: {
				audio: 2,
				trigger: { player: 'damageEnd' },
				group: 'sbjianxiong_mark',
				filter: function (event, player) {
					return get.itemtype(event.cards) == 'cards' && event.cards.some(i => get.position(i, true) == 'o') || 1 - player.countMark('sbjianxiong') > 0;
				},
				prompt2: function (event, player) {
					var gain = get.itemtype(event.cards) == 'cards' && event.cards.some(i => get.position(i, true) == 'o'), draw = 1 - player.countMark('sbjianxiong');
					var str = '';
					if (gain) str += '获得' + get.translation(event.cards);
					if (gain && draw > 0) str += '并';
					if (draw > 0) str += '摸' + get.cnNumber(1 - player.countMark('sbjianxiong')) + '张牌';
					if (player.countMark('sbjianxiong')) str += '，然后可以弃1枚“治世”';
					return str;
				},
				content: function () {
					'step 0'
					if (get.itemtype(trigger.cards) == 'cards' && trigger.cards.some(i => get.position(i, true) == 'o')) {
						player.gain(trigger.cards, 'gain2');
					}
					var num = player.countMark('sbjianxiong');
					if (1 - num > 0) {
						player.draw(1 - num, 'nodelay');
					}
					if (!num) event.finish();
					'step 1'
					player.chooseBool('是否弃1枚“治世”？').set('ai', () => {
						var player = _status.event.player, current = _status.currentPhase;
						if (get.distance(current, player, 'absolute') > 3 && player.hp <= 2) return true;
						return false;
					});
					'step 2'
					if (result.bool) {
						player.removeMark('sbjianxiong', 1);
					}
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target: function (card, player, target) {
							if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
							if (get.tag(card, 'damage') && player != target) {
								var cards = card.cards, evt = _status.event;
								if (evt.player == target && card.name == 'damage' && evt.getParent().type == 'card') cards = evt.getParent().cards.filterInD();
								if (target.hp <= 1) return;
								if (get.itemtype(cards) != 'cards') return;
								for (var i of cards) {
									if (get.name(i, target) == 'tao') return [1, 5];
								}
								if (get.value(cards, target) >= (7 + target.getDamagedHp())) return [1, 3];
								return [1, 0.55 + 0.05 * Math.max(0, 1 - target.countMark('sbjianxiong'))];
							}
						}
					}
				},
				marktext: '治',
				intro: {
					name: '治世',
					name2: '治世',
					content: 'mark',
				},
				subSkill: {
					mark: {
						audio: 'sbjianxiong',
						trigger: { global: 'phaseBefore', player: 'enterGame' },
						forced: true,
						filter: function (event, player) {
							return (event.name != 'phase' || game.phaseNumber == 0);
						},
						content: function () {
							'step 0'
							var map = {};
							var list = [];
							for (var i = 1; i <= 2; i++) {
								var cn = get.cnNumber(i, true);
								map[cn] = i;
								list.push(cn);
							}
							event.map = map;
							list.push('cancel2');
							player.chooseControl(list, function () {
								return get.cnNumber(2, true);
							}).set('prompt', '奸雄：获得任意枚“治世”标记');
							'step 1'
							if (result.control != 'cancel2') player.addMark('sbjianxiong', event.map[result.control]);
						}
					}
				},
			},
			sbqingzheng: {
				audio: 2,
				trigger: { player: 'phaseUseBegin' },
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				direct: true,
				content: function () {
					'step 0'
					var num = 3 - player.countMark('sbjianxiong');
					var prompt = '###' + get.prompt('sbqingzheng') + '###弃置' + get.cnNumber(num) + '种花色的所有牌';
					var next = player.chooseButton([prompt, [lib.suit.map(i => ['', '', 'lukai_' + i]), 'vcard']], num);
					next.set('filterButton', button => {
						var player = _status.event.player;
						var cards = player.getCards('h', { suit: button.link[2].slice(6) });
						return cards.length > 0 && cards.filter(card => lib.filter.cardDiscardable(card, player, 'sbqingzheng')).length == cards.length;
					});
					next.set('ai', button => {
						var player = _status.event.player;
						return player.countMark('sbjianxiong') * 15 - player.getCards('h', { suit: button.link[2].slice(6) }).map(i => get.value(i)).reduce((p, c) => p + c, 0);
					});
					next.set('custom', {
						replace: {
							button: function (button) {
								if (!_status.event.isMine()) return;
								if (button.classList.contains('selectable') == false) return;
								var cards = _status.event.player.getCards('h', { suit: button.link[2].slice(6) });
								if (cards.length) {
									var chosen = cards.filter(i => ui.selected.cards.contains(i)).length == cards.length;
									if (chosen) {
										ui.selected.cards.removeArray(cards);
										cards.forEach(card => {
											card.classList.remove('selected');
											card.updateTransform(false);
										});
									} else {
										ui.selected.cards.addArray(cards);
										cards.forEach(card => {
											card.classList.add('selected');
											card.updateTransform(true);
										});
									}
								}
								if (button.classList.contains('selected')) {
									ui.selected.buttons.remove(button);
									button.classList.remove('selected');
									if (_status.multitarget || _status.event.complexSelect) {
										game.uncheck();
										game.check();
									}
								}
								else {
									button.classList.add('selected');
									ui.selected.buttons.add(button);
								}
								var custom = _status.event.custom;
								if (custom && custom.add && custom.add.button) {
									custom.add.button();
								}
								game.check();
							}
						},
						add: next.custom.add
					});
					'step 1'
					if (result.bool) {
						var cards = result.cards;
						if (!cards.length) {
							var suits = result.links.map(i => i[2].slice(6));
							cards = player.getCards('h', card => suits.contains(get.suit(card, player)));
						}
						event.cards = cards;
						if (!cards.length) event.finish();
						else player.chooseTarget('清正：观看一名其他角色的手牌并弃置其中一种花色的所有牌', (card, player, target) => {
							return target != player && target.countCards('h');
						}).set('ai', target => {
							var player = _status.event.player, att = get.attitude(player, target);
							if (att >= 0) return 0;
							return 1 - att / 2 + Math.sqrt(target.countCards('h'));
						});
					} else event.finish();
					'step 2'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill('sbqingzheng', target);
						player.discard(cards);
						var list = [];
						var dialog = ['清正：弃置' + get.translation(target) + '一种花色的所有牌'];
						for (var suit of lib.suit.concat('none')) {
							if (target.countCards('h', { suit: suit })) {
								dialog.push('<div class="text center">' + get.translation(suit + '2') + '牌</div>');
								dialog.push(target.getCards('h', { suit: suit }));
								list.push(suit);
							}
						}
						if (list.length) {
							player.chooseControl(list).set('dialog', dialog).set('ai', () => {
								return _status.event.control;
							}).set('control', (() => {
								var getv = (cards) => cards.map(i => get.value(i)).reduce((p, c) => p + c, 0);
								return list.sort((a, b) => {
									return getv(target.getCards('h', { suit: b })) - getv(target.getCards('h', { suit: a }));
								})[0];
							})());
						}
					} else event.finish();
					'step 3'
					var cards2 = target.getCards('h', { suit: result.control });
					event.cards2 = cards2;
					target.discard(cards2, 'notBySelf').set('discarder', player);
					'step 4'
					if (event.cards2.length < cards.length) target.damage();
					'step 5'
					if (player.countMark('sbjianxiong') < 2 && player.hasSkill('sbjianxiong')) {
						player.chooseBool('是否获得1枚“治世”？').set('ai', () => Math.random() < 0.5 ? 0 : 1);
					} else event.finish();
					'step 6'
					if (result.bool) {
						player.addMark('sbjianxiong', 1);
					}
				},
				ai: { combo: 'sbjianxiong' }
			},
			sbhujia: {
				audio: 2,
				trigger: { player: 'damageBegin4' },
				zhuSkill: true,
				direct: true,
				filter: function (event, player) {
					return !player.hasSkill('sbhujia_used') && game.hasPlayer(current => {
						return current != player && current.group == 'wei' && player.hasZhuSkill('sbhujia', current);
					});
				},
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt('sbhujia'), '将' + get.translation(trigger.source) + '即将对你造成的' + trigger.num + '点伤害转移给一名其他魏势力角色', (card, player, target) => {
						return target != player && target.group == 'wei' && player.hasZhuSkill('sbhujia', target);
					}).set('ai', target => {
						var player = _status.event.player, evt = _status.event.getTrigger();
						return get.damageEffect(target, evt.source, player, evt.nature) - _status.event.eff;
					}).set('eff', get.damageEffect(player, trigger.source, player, trigger.nature));
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill('sbhujia', target);
						player.addTempSkill('sbhujia_used', 'roundStart');
						trigger.cancel();
						if (trigger.source) target.damage(trigger.source, trigger.nature, trigger.num).set('card', trigger.card).set('cards', trigger.cards);
						else target.damage('nosource', trigger.nature, trigger.num).set('card', trigger.card).set('cards', trigger.cards);
					}
				},
				ai: {
					maixie_defend: true,
					effect: {
						target: function (card, player, target) {
							if (player.hasSkillTag('jueqing', false, target)) return;
							if (get.tag(card, 'damage') && !target.hasSkill('sbhujia_used') && game.hasPlayer(current => {
								return current != target && current.group == 'wei' && target.hasZhuSkill('sbhujia', current);
							})) return 0.8;
						}
					},
					threaten: function (player, target) {
						if (target.countCards('h') == 0) return 2;
					}
				},
				subSkill: {
					used: { charlotte: true },
				},
			},
			//张角
			sbleiji: {
				audio: 2,
				enable: 'phaseUse',
				filter: function (event, player) {
					return player.countMark('sbguidao') >= 4;
				},
				filterTarget: lib.filter.notMe,
				content: function () {
					player.removeMark('sbguidao', 4);
					target.damage('thunder');
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target, 'thunder');
						}
					}
				}
			},
			sbguidao: {
				audio: 2,
				trigger: {
					global: ['phaseBefore', 'damageEnd'],
					player: 'enterGame',
				},
				forced: true,
				locked: false,
				group: 'sbguidao_defend',
				filter: function (event, player) {
					if (player.countMark('sbguidao') >= 8) return false;
					if (event.name == 'damage') return event.nature && !player.hasSkill('sbguidao_forbid');
					return (event.name != 'phase' || game.phaseNumber == 0);
				},
				content: function () {
					var num = 2;
					if (trigger.name != 'damage') num += 2;
					num = Math.min(8 - player.countMark('sbguidao'), num);
					player.addMark('sbguidao', num);
				},
				marktext: '兵',
				intro: {
					name: '道兵',
					name2: '道兵',
					content: '共有$枚“道兵”',
				},
				subSkill: {
					defend: {
						audio: 'sbguidao',
						trigger: { player: 'damageBegin4' },
						filter: function (event, player) {
							return player.countMark('sbguidao') >= 2;
						},
						prompt2: '弃2枚“道兵”，防止伤害',
						check: function (event, player) {
							return event.num >= 2 || player.hp <= event.num;
						},
						content: function () {
							trigger.cancel();
							player.removeMark('sbguidao', 2);
							if (player != _status.currentPhase) {
								player.addTempSkill('sbguidao_forbid', { player: 'phaseBegin' });
							}
						},
					},
					forbid: { charlotte: true },
				}
			},
			sbhuangtian: {
				audio: 2,
				trigger: {
					player: 'phaseBegin',
				},
				forced: true,
				zhuSkill: true,
				group: 'sbhuangtian_mark',
				filter: function (event, player) {
					if (player.phaseNumber > 1 || game.phaseNumber > 1) return false;
					if (!player.hasZhuSkill('sbhuangtian')) return false;
					return !game.hasPlayer(function (current) {
						return current.countCards('hej', 'taipingyaoshu');
					}) && !Array.from(ui.cardPile.childNodes).concat(Array.from(ui.discardPile.childNodes)).concat(Array.from(ui.ordering.childNodes)).map(i => i.name).contains('taipingyaoshu');
				},
				content: function () {
					'step 0'
					if (!lib.inpile.contains('taipingyaoshu')) {
						lib.inpile.push('taipingyaoshu');
					}
					event.card = game.createCard2('taipingyaoshu', 'heart', 3);
					'step 1'
					if (card) player.equip(card);
				},
				subSkill: {
					mark: {
						trigger: {
							global: 'damageSource',
						},
						forced: true,
						zhuSkill: true,
						filter: function (event, player) {
							if (!player.hasZhuSkill('sbhuangtian') || !player.hasSkill('sbguidao', null, false, false)) return false;
							if (!event.source || player == event.source || event.source.group != 'qun') return false;
							if (player.hasSkill('sbguidao') && player.countMark('sbguidao') >= 8) return false;
							// if(player.countMark('sbhuangtian_count')>999) return false;
							return true;
						},
						content: function () {
							player.addMark('sbguidao', 1);
							// player.addTempSkill('sbhuangtian_count','roundStart');
							// player.addMark('sbhuangtian_count',1,false);
						}
					},
					count: { onremove: true }
				}
			},
			//夏侯氏
			sbqiaoshi: {
				audio: 2,
				trigger: { player: 'damageEnd' },
				usable: 1,
				direct: true,
				filter: function (event, player) {
					return event.source && event.source != player && event.source.isIn();
				},
				content: function () {
					'step 0'
					trigger.source.chooseBool('樵拾：是否令' + get.translation(player) + '回复' + trigger.num + '点体力，然后你摸两张牌？').set('ai', () => {
						return _status.event.bool;
					}).set('bool', get.recoverEffect(player, trigger.source, trigger.source) + get.effect(trigger.source, { name: 'wuzhong' }, trigger.source) > 5);
					'step 1'
					if (result.bool) {
						player.logSkill('sbqiaoshi');
						trigger.source.line(player, 'green');
						player.recover(trigger.num);
						trigger.source.draw(2);
					}
					else player.storage.counttrigger.sbqiaoshi--;
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, 'damage')) {
								if (get.attitude(target, player) <= 0 || target == player) return;
								if (target.storage.counttrigger && target.storage.counttrigger.sbqiaoshi) return;
								if (target.hp <= 1 && !player.canSave(target)) return;
								return [0, 0.5, 0, 0.5];
							}
						},
					},
				}
			},
			sbyanyu: {
				enable: 'phaseUse',
				usable: 2,
				filterCard: { name: 'sha' },
				selectCard: 1,
				group: 'sbyanyu_draw',
				check: () => 1,
				content: function () {
					player.draw();
				},
				subSkill: {
					draw: {
						trigger: { player: 'phaseUseEnd' },
						filter: function (event, player) {
							return player.getHistory('useSkill', evt => {
								if (evt.skill != 'sbyanyu') return false;
								var evtx = evt.event.getParent('phaseUse');
								if (!evtx || evtx != _status.event.getParent('phaseUse')) return;
								return true;
							}).length;
						},
						direct: true,
						content: function () {
							'step 0'
							event.num = 3 * player.getHistory('useSkill', evt => {
								if (evt.skill != 'sbyanyu') return false;
								var evtx = evt.event.getParent('phaseUse');
								if (!evtx || evtx != _status.event.getParent('phaseUse')) return;
								return true;
							}).length;
							player.chooseTarget(get.prompt('sbyanyu'), '令一名其他角色摸' + get.cnNumber(event.num) + '张牌', lib.filter.notMe).set('ai', target => {
								var player = _status.event.player;
								return get.effect(target, { name: 'wuzhong' }, player, player);
							});
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill('sbyanyu_draw', target);
								target.draw(num);
							}
						}
					}
				},
				ai: {
					order: function (obj, player) {
						if (game.hasPlayer(current => current != player && get.attitude(player, current) > 0) && player.getHistory('useSkill', evt => {
							if (evt.skill != 'sbyanyu') return false;
							var evtx = evt.event.getParent('phaseUse');
							if (!evtx || evtx != _status.event.getParent('phaseUse')) return;
							return true;
						}).length < 2) return 9;
						return 2;
					},
					result: {
						player: 1
					},
				}
			},
			//曹仁
			sbjushou: {
				audio: 3,
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return !player.isTurnedOver();
				},
				filterCard: true,
				selectCard: [1, 2],
				check: function (card) {
					if (ui.selected.cards.length + _status.event.player.hujia >= 5) return 0;
					return 6.5 - get.value(card);
				},
				position: 'he',
				group: ['sbjushou_damage', 'sbjushou_draw'],
				content: function () {
					player.turnOver();
					player.changeHujia(cards.length, null, true);
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					}
				},
				subSkill: {
					damage: {
						audio: 'sbjushou',
						trigger: {
							player: 'damageEnd',
						},
						filter: function (event, player) {
							return player.isTurnedOver();
						},
						direct: true,
						content: function () {
							'step 0'
							player.chooseControl('翻面', '获得1点护甲', 'cancel2').set('ai', () => {
								if (_status.event.player.hujia >= 3) return 0;
								return 1;
							}).set('prompt', get.prompt('sbjushou')).set('prompt2', '选择一项');
							'step 1'
							if (result.control == 'cancel2') {
								event.finish();
								return;
							}
							player.logSkill('sbjushou');
							if (result.control == '翻面') {
								player.turnOver();
							}
							else {
								player.changeHujia(1, null, true);
							}
						},
						ai: {
							effect: {
								target: function (card, player, target) {
									if (!target.isTurnedOver()) return;
									if (get.tag(card, 'damage')) {
										if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
										if ((card.name == 'sha' && !player.hasSkill('jiu')) || target.hasSkillTag('filterDamage', null, {
											player: player,
											card: card,
										})) return 'zerotarget';
									}
								},
							},
						},
					},
					draw: {
						audio: 'sbjushou',
						trigger: { player: 'turnOverAfter' },
						forced: true,
						locked: false,
						filter: function (event, player) {
							return !player.isTurnedOver() && player.hujia > 0;
						},
						content: function () {
							player.draw(player.hujia);
						},
					}
				}
			},
			sbjiewei: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return player.hujia > 0;
				},
				filterTarget: function (card, player, target) {
					return target != player && target.countCards('h');
				},
				content: function () {
					player.changeHujia(-1);
					player.gainPlayerCard(target, 'visible', true, 'h').set('ai', function (button) {
						return get.value(button.link, _status.event.target);
					});
				},
				ai: {
					order: 8,
					result: {
						target: -1,
					}
				}
			},
			//周瑜
			sbyingzi: {
				audio: 2,
				audioname: ['sb_sunce'],
				trigger: { player: 'phaseDrawBegin2' },
				forced: true,
				getNum: function (player) {
					return (player.countCards('h') >= 2) + (player.hp >= 2) + (player.countCards('e') >= 1);
				},
				filter: function (event, player) {
					return !event.numFixed && lib.skill.sbyingzi.getNum(player) > 0;
				},
				content: function () {
					var num = lib.skill.sbyingzi.getNum(player);
					trigger.num += num;
					player.addTempSkill('sbyingzi_limit');
					player.addMark('sbyingzi_limit', num, false);
				},
				ai: {
					threaten: 2
				},
				subSkill: {
					limit: {
						charlotte: true,
						forced: true,
						onremove: true,
						marktext: '英',
						intro: {
							content: '本回合手牌上限+#',
						},
						mod: {
							maxHandcard: function (player, num) {
								return num + player.countMark('sbyingzi_limit');
							}
						},
					}
				}
			},
			sbfanjian: {
				audio: 2,
				enable: 'phaseUse',
				usable: 5,
				filter: function (event, player) {
					return !player.hasSkill('sbfanjian_ban');
				},
				chooseButton: {
					dialog: function () {
						return ui.create.dialog('###反间###' + get.translation('sbfanjian_info'));
					},
					chooseControl: function (event, player) {
						var suits = lib.suit.slice();
						suits.push('cancel2');
						return suits;
					},
					check: function (event, player) {
						var suits = lib.suit.slice();
						suits = suits.filter(suit => !player.getStorage('sbfanjian_guessed').contains(suit));
						return suits.randomGet();
					},
					backup: function (result, player) {
						return {
							audio: 'sbfanjian',
							filterCard: function (card, player) {
								return !player.getStorage('sbfanjian_guessed').contains(get.suit(card, player));
							},
							suit: result.control,
							position: 'h',
							filterTarget: lib.filter.notMe,
							check: function (card) {
								return 6 - get.value(card);
							},
							discard: false,
							lose: false,
							delay: false,
							content: function () {
								'step 0'
								var suit = get.suit(cards, player);
								event.claimSuit = lib.skill.sbfanjian_backup.suit;
								event.cardSuit = suit;
								player.addTempSkill('sbfanjian_guessed');
								var claim = get.translation(event.claimSuit + '2');
								player.chat('我声明' + claim);
								game.log(player, '声明了', '#y' + claim);
								var choiceList = ['猜测此牌花色为' + claim, '猜测此牌花色不为' + claim, '不猜测，你翻面并令其〖反间〗失效'];
								target.chooseControl().set('choiceList', choiceList).set('prompt', get.translation(player) + '对你发动了【反间】并选择了一张牌，请选择一项').set('ai', () => {
									var player = _status.event.player, user = _status.event.getParent().player, claim = _status.event.getParent().claimSuit, suit = _status.event.getParent().cardSuit;
									if (player.isTurnedOver()) return 2;
									var lose = get.effect(player, { name: 'losehp' }, user, player);
									if (user.getStorage('sbfanjian_guessed').contains(claim) && claim == suit) return lose <= 0 ? 0 : 1;
									if (get.attitude(player, user) > 0) return 0;
									var list = [0, 1];
									if (player.hp <= 1 && player.getFriends().length > 0) list.push(2);
									return list.randomGet();
								});
								'step 1'
								player.markAuto('sbfanjian_guessed', [event.cardSuit]);
								if (result.index == 2) {
									game.log(target, '选择', '#y不猜测');
									target.chat('不猜！');
									target.turnOver();
								}
								else {
									var claim = get.translation(event.claimSuit + '2');
									target.chat('我猜花色' + (result.index == 1 ? '不' : '') + '为' + claim);
									game.log(target, '猜测花色', '#g' + (result.index == 1 ? '不' : '') + '为' + claim);
								}
								if (event.isMine() && !event.isOnline()) game.delayx();
								'step 2'
								target.gain(cards, player, 'giveAuto', 'bySelf');
								'step 3'
								if (result.index == 0 && event.claimSuit != event.cardSuit || result.index == 1 && event.claimSuit == event.cardSuit) {
									game.log(target, '猜测', '#y错误');
									target.loseHp();
								}
								else {
									if (result.index != 2) game.log(target, '猜测', '#g正确');
									player.addTempSkill('sbfanjian_ban');
								}
							},
							ai: {
								result: {
									target: function (player, target) {
										if (!ui.selected.cards.length) return 0;
										var val = get.value(ui.selected.cards, target);
										if (val < 0) return val + get.effect(target, { name: 'losehp' }, player, target);
										if (val > 5 || get.value(ui.selected.cards, player) > 5) return target.isTurnedOver() ? 5 : 0;
										return get.effect(target, { name: 'losehp' }, player, target);
									},
								},
							},
						}
					},
					prompt: function (result) {
						return '你选择了' + get.translation(result.control) + '，请选择一张手牌和【反间】的目标';
					},
				},
				subSkill: {
					guessed: { onremove: true, charlotte: true },
					ban: { charlotte: true },
					backup: {},
				},
				ai: {
					order: 4,
					result: { player: 1 }
				}
			},
			//黄盖
			sbkurou: {
				audio: 2,
				trigger: { player: 'phaseUseBegin' },
				direct: true,
				group: 'sbkurou_gain',
				content: function () {
					'step 0'
					player.chooseCardTarget({
						prompt: get.prompt('sbkurou'),
						prompt2: '交给其他角色一张牌，若此牌为【桃】或【酒】，你失去2点体力，否则你失去1点体力',
						filterCard: true,
						position: 'he',
						filterTarget: lib.filter.notMe,
						ai1: function (card) {
							if (player.hp <= 1 && !player.canSave(player) || player.hujia >= 5) return 0;
							if (get.value(card, player) > 6 && !game.hasPlayer(current => {
								return current != player && get.attitude(current, player) > 0 && !current.hasSkillTag('nogain');
							})) return 0;
							if (player.hp >= 2 && (card.name == 'tao' || (card.name == 'jiu' && player.countCards('hs', cardx => {
								return cardx != card && get.tag(cardx, 'save');
							}))) && player.hujia <= 1) return 10;
							if (player.hp <= 1 && !player.canSave(player)) return 0;
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2: function (target) {
							var player = _status.event.player, att = get.attitude(player, target);
							if (ui.selected.cards.length) {
								var val = get.value(ui.selected.cards[0]);
								att *= val >= 0 ? 1 : -1;
							}
							if (target.hasSkillTag('nogain')) att /= 9;
							return 15 + att;
						},
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0], card = result.cards[0];
						player.logSkill('sbkurou', target);
						player.give(card, target);
						player.loseHp(['tao', 'jiu'].contains(get.name(card, target)) ? 2 : 1);
					}
				},
				subSkill: {
					gain: {
						audio: 'sbkurou',
						trigger: { player: 'loseHpEnd' },
						forced: true,
						locked: false,
						filter: function (event, player) {
							return player.isIn() && player.hujia < 5;
						},
						content: function () {
							'step 0'
							event.count = trigger.num;
							'step 1'
							player.changeHujia(2, null, true);
							'step 2'
							if (--event.count > 0) {
								player.logSkill('sbkurou_gain');
								event.goto(1);
							}
						},
						ai: {
							maihp: true,
							effect: function (card, player, target) {
								if (get.tag(card, 'damage')) {
									if (player.hasSkillTag('jueqing', false, target)) return [1, 1];
									return 1.2;
								}
								if (get.tag(card, 'loseHp')) {
									if (target.hp <= 1 || target.hujia >= 5) return;
									return [1, 1];
								}
							}
						}
					},
				}
			},
			sbzhaxiang: {
				audio: 2,
				trigger: { player: 'useCard' },
				forced: true,
				group: 'sbzhaxiang_draw',
				filter: function (event, player) {
					return player.getHistory('useCard').length <= player.getDamagedHp();
				},
				content: function () {
					trigger.directHit.addArray(game.filterPlayer());
				},
				ai: {
					threaten: 1.5,
					directHit_ai: true,
					skillTagFilter: function (player, tag, arg) {
						return player.countUsed() < player.getDamagedHp();
					},
				},
				mod: {
					targetInRange: function (card, player) {
						if (player.countUsed() < player.getDamagedHp()) return true;
					},
					cardUsable: function (card, player) {
						if (player.countUsed() < player.getDamagedHp()) return Infinity;
					},
					aiOrder: function (player, card, num) {
						if (player.countUsed() >= player.getDamagedHp()) return;
						var numx = get.info(card).usable;
						if (typeof numx == 'function') numx = num(card, player);
						if (typeof numx == 'number') return num + 10;
					},
				},
				subSkill: {
					draw: {
						audio: 'sbzhaxiang',
						trigger: { player: 'phaseDrawBegin2' },
						forced: true,
						filter: function (event, player) {
							return !event.numFixed && player.getDamagedHp() > 0;
						},
						content: function () {
							trigger.num += player.getDamagedHp();
						},
						ai: {
							effect: {
								target: function (card, player, target) {
									if (get.tag(card, 'recover') && player.hp >= player.maxHp - 1 && player.maxHp > 1) return [0, 0];
								}
							}
						}
					}
				}
			},
			//孙权
			sbzhiheng: {
				audio: 2,
				audioname: ['shen_caopi'],
				enable: 'phaseUse',
				usable: 1,
				position: 'he',
				filterCard: lib.filter.cardDiscardable,
				discard: false,
				lose: false,
				delay: false,
				selectCard: [1, Infinity],
				prompt: function (event) {
					var count = _status.event.player.countMark('sbtongye');
					var str = '出牌阶段限一次。你可以弃置任意张牌并摸等量的牌，若你以此法弃置的牌包括你所有手牌，则你多摸' + get.cnNumber(count + 1) + '张牌';
					if (count > 0) str += '，并弃1枚“业”';
					str += '。';
					return str;
				},
				check: function (card) {
					var player = _status.event.player;
					if (get.position(card) == 'h' && !player.countCards('h', 'du') && (player.hp > 2 || !player.countCards('h', function (card) {
						return get.value(card) >= 8;
					}))) {
						return 1;
					}
					return 6 - get.value(card);
				},
				content: function () {
					'step 0'
					player.discard(cards);
					event.num = 1;
					var hs = player.getCards('h');
					if (!hs.length) event.num = 0;
					for (var i = 0; i < hs.length; i++) {
						if (!cards.contains(hs[i])) {
							event.num = 0; break;
						}
					}
					'step 1'
					var all = event.num;
					player.draw((all ? 1 + player.countMark('sbtongye') : 0) + cards.length);
					if (all) player.removeMark('sbtongye', 1);
				},
				ai: {
					order: 1,
					result: {
						player: 1
					},
					threaten: 1.56
				},
			},
			sbtongye: {
				audio: 2,
				trigger: { player: 'phaseJieshuBegin' },
				forced: true,
				onremove: true,
				content: function () {
					'step 0'
					player.chooseControl('变化', '不变').set('prompt', '统业：猜测场上装备数是否于你下回合准备阶段前发生变化').set('ai', () => (game.countPlayer() <= 4 ? Math.random() : 1) < 0.4);
					'step 1'
					if (result.control == '变化') {
						player.addSkill('sbtongye_change', 1);
						player.chat('变！');
					} else {
						player.addSkill('sbtongye_nochange', 1);
						player.chat('不变！');
					}
					var num = game.filterPlayer().map(i => i.countCards('e')).reduce((p, c) => p + c, 0);
					player.removeMark('sbtongye_count', player.countMark('sbtongye_count'), false);
					if (num > 0) player.addMark('sbtongye_count', num, false);
					player.addSkill('sbtongye_settle');
				},
				marktext: '业',
				intro: {
					name: '统业',
					name2: '业',
					content: 'mark',
				},
				subSkill: {
					broadcast: {
						trigger: {
							global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
						},
						charlotte: true,
						silent: true,
						filter: function (event, player) {
							var num = 0;
							game.countPlayer(function (current) {
								var evt = event.getl(current);
								if (evt && evt.es) num += evt.es.length;
							});
							if (event.name == 'equip') num--;
							return num != 0;
						},
						content: function () {
							if (player.hasSkill('sbtongye_change')) player.markSkill('sbtongye_change');
							if (player.hasSkill('sbtongye_nochange')) player.markSkill('sbtongye_nochange');
						},
					},
					settle: {
						audio: 'sbtongye',
						init: function (player) {
							player.addSkill('sbtongye_broadcast');
						},
						trigger: { player: 'phaseZhunbeiBegin' },
						forced: true,
						charlotte: true,
						filter: function (event, player) {
							return player.hasSkill('sbtongye_change') || player.hasSkill('sbtongye_nochange');
						},
						content: function () {
							var delta = game.filterPlayer().map(i => i.countCards('e')).reduce((p, c) => p + c, 0) - player.countMark('sbtongye_count');
							if (player.hasSkill('sbtongye_change') && delta != 0 || player.hasSkill('sbtongye_nochange') && delta == 0) {
								game.log(player, '猜测', '#g正确');
								if (player.countMark('sbtongye') < 2) player.addMark('sbtongye', 1);
							} else {
								game.log(player, '猜测', '#y错误');
								player.removeMark('sbtongye', 1);
							}
							player.removeSkill('sbtongye_change');
							player.removeSkill('sbtongye_nochange');
							player.removeSkill('sbtongye_settle');
							player.removeSkill('sbtongye_broadcast');
						}
					},
					change: {
						charlotte: true,
						mark: true,
						marktext: '变',
						intro: {
							markcount: function (storage, player) {
								return game.filterPlayer().map(i => i.countCards('e')).reduce((p, c) => p + c, 0) - player.countMark('sbtongye_count');
							},
							mark: function (dialog, storage, player) {
								dialog.addText(get.translation(player) + '猜测场上装备数发生变化');
								var delta = game.filterPlayer().map(i => i.countCards('e')).reduce((p, c) => p + c, 0) - player.countMark('sbtongye_count');
								if (delta == 0) dialog.addText('(当前未发生变化)');
								else dialog.addText('(当前已' + (delta > 0 ? '增加' : '减少') + get.cnNumber(Math.abs(delta)) + '张装备牌)');
							}
						}
					},
					nochange: {
						charlotte: true,
						mark: true,
						marktext: '<span style="text-decoration:line-through;">变</span>',
						intro: {
							markcount: function (storage, player) {
								return game.filterPlayer().map(i => i.countCards('e')).reduce((p, c) => p + c, 0) - player.countMark('sbtongye_count');
							},
							mark: function (dialog, storage, player) {
								dialog.addText(get.translation(player) + '猜测场上装备数不发生变化');
								var delta = game.filterPlayer().map(i => i.countCards('e')).reduce((p, c) => p + c, 0) - player.countMark('sbtongye_count');
								if (delta == 0) dialog.addText('(当前未发生变化)');
								else dialog.addText('(当前已' + (delta > 0 ? '增加' : '减少') + get.cnNumber(Math.abs(delta)) + '张装备牌)');
							}
						}
					},
				}
			},
			sbjiuyuan: {
				audio: 2,
				trigger: { global: 'useCard' },
				forced: true,
				zhuSkill: true,
				group: 'sbjiuyuan_recover',
				filter: function (event, player) {
					return event.card.name == 'tao' && player != event.player && event.player.group == 'wu' &&
						event.player.isIn() && player.hasZhuSkill('sbjiuyuan', event.player);
				},
				content: function () {
					player.draw();
				},
				subSkill: {
					recover: {
						audio: 'sbjiuyuan',
						trigger: { target: 'taoBegin' },
						zhuSkill: true,
						forced: true,
						filter: function (event, player) {
							if (event.player == player) return false;
							if (!player.hasZhuSkill('sbjiuyuan', event.player)) return false;
							if (event.player.group != 'wu') return false;
							return true;
						},
						content: function () {
							trigger.baseDamage++;
						}
					}
				},
			},
			//孙尚香
			sbjieyin: {
				trigger: { player: 'phaseUseBegin' },
				forced: true,
				locked: false,
				dutySkill: true,
				group: ['sbjieyin_init', 'sbjieyin_fail'],
				filter: function (event, player) {
					return game.hasPlayer(current => current.hasMark('sbjieyin_mark'));
				},
				content: function () {
					'step 0'
					var targets = game.filterPlayer(current => current.hasMark('sbjieyin_mark'));
					event.targets = targets;
					'step 1'
					var target = targets.shift();
					event.target = target;
					var str = target.hasSkill('sbjieyin_marked') ? '移去' : '移动或移去';
					var num = Math.min(2, Math.max(1, target.countCards('h')));
					target.chooseCard('交给' + get.translation(player) + get.cnNumber(num) + '张手牌，然后获得1点护甲；或令其' + str + '你的所有“助”标记', num).set('ai', card => {
						if (_status.event.goon) return 100 - get.value(card);
						return 0;
					}).set('goon', get.attitude(target, player) > 1);
					'step 2'
					if (result.bool) {
						target.give(result.cards, player);
						target.changeHujia(1, null, true);
						event.goto(4);
					} else {
						if (!game.hasPlayer(current => current != player && current != target) || target.hasSkill('sbjieyin_marked')) event._result = { bool: false };
						else player.chooseTarget('结姻：是否移动' + get.translation(target) + '的“助”？', (card, player, target) => {
							return target != player && target != _status.event.getParent().target;
						}).set('ai', target => get.attitude(_status.event.player, target) - 1);
						target.addSkill('sbjieyin_marked');
					}
					'step 3'
					if (result.bool) {
						var targetx = result.targets[0];
						var num = target.countMark('sbjieyin_mark');
						target.removeSkill('sbjieyin_mark');
						targetx.addSkill('sbjieyin_mark');
						targetx.addMark('sbjieyin_mark', num, false);
						player.line2([target, targetx], 'green');
						game.log(player, '将', target, '的' + get.cnNumber(num) + '枚“助”移动至', targetx);
					} else {
						target.removeSkill('sbjieyin_mark');
						game.log(player, '移去了', target, '的' + get.cnNumber(num) + '枚“助”');
						game.createEvent('sbjieyin_fail').setContent(lib.skill.sbjieyin_fail.content).player = player;
					}
					'step 4'
					if (targets.length) event.goto(1);
				},
				subSkill: {
					fail: {
						audio: 'sbjieyin',
						trigger: { global: 'dieAfter' },
						dutySkill: true,
						forced: true,
						locked: false,
						direct: true,
						filter: function (event, player) {
							return event.player.hasMark('sbjieyin_mark');
						},
						content: function () {
							player.logSkill('sbjieyin_fail');
							player.awakenSkill('sbjieyin');
							game.log(player, '使命失败');
							player.changeGroup('wu');
							player.recover();
							player.gain(player.getExpansions('sbliangzhu'), 'gain2');
							player.loseMaxHp();
						}
					},
					mark: {
						charlotte: true,
						mark: true,
						marktext: '助',
						onremove: true,
						intro: {
							name: '结姻(助)',
							name2: '助',
							content: 'mark'
						}
					},
					marked: { charlotte: true },
					init: {
						audio: 'sbjieyin',
						trigger: {
							global: 'phaseBefore',
							player: 'enterGame',
						},
						forced: true,
						locked: false,
						direct: true,
						dutySkill: true,
						filter: function (event, player) {
							return game.hasPlayer(current => current != player) && (event.name != 'phase' || game.phaseNumber == 0);
						},
						content: function () {
							'step 0'
							player.chooseTarget('结姻：令一名其他角色获得1枚“助”', lib.filter.notMe, true).set('ai', target => get.attitude(_status.event.player, target));
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill('sbjieyin_init', target);
								target.addSkill('sbjieyin_mark');
								target.addMark('sbjieyin_mark', 1);
							}
							'step 2'
							game.delayx();
						}
					},
				}
			},
			sbliangzhu: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return player.group == 'shu' && game.hasPlayer(current => current != player && current.countCards('e'));
				},
				groupSkill: true,
				filterTarget: function (card, player, target) {
					return target.countCards('e') && target != player;
				},
				content: function () {
					'step 0'
					player.choosePlayerCard(target, 'e', true);
					'step 1'
					if (result.bool) {
						player.addToExpansion(result.cards, target, 'give').gaintag.add('sbliangzhu');
					} else event.finish();
					'step 2'
					for (var target of game.filterPlayer(current => current.hasMark('sbjieyin_mark'))) {
						target.chooseDrawRecover(2, true);
					}
				},
				marktext: '妆',
				intro: {
					name: '良助(妆)',
					name2: '妆',
					content: 'expansion',
					markcount: 'expansion',
				},
				onremove: function (player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				ai: {
					order: 9,
					result: {
						player: function (player) {
							var num = 0, targets = game.filterPlayer(current => current.hasMark('sbjieyin_mark'));
							for (var current of targets) {
								num += get.effect(current, { name: 'wuzhong' }, player, player);
							}
							if (num > 0) return 3;
							return 1;
						},
						target: -1,
					}
				}
			},
			sbxiaoji: {
				audio: 2,
				audioname: ['sp_sunshangxiang', 're_sunshangxiang', 'db_sunshangxiang'],
				trigger: {
					player: 'loseAfter',
					global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
				},
				forced: true,
				locked: false,
				groupSkill: true,
				filter: function (event, player) {
					if (player.group != 'wu') return false;
					var evt = event.getl(player);
					return evt && evt.player == player && evt.es && evt.es.length > 0;
				},
				content: function () {
					'step 0'
					event.count = trigger.getl(player).es.length;
					'step 1'
					event.count--;
					player.draw(2);
					player.chooseTarget('是否弃置场上的一张牌？', (card, player, target) => {
						return target.countDiscardableCards(player, 'ej');
					}).set('ai', target => {
						var player = _status.event.player;
						var att = get.attitude(player, target);
						if (att > 0 && (target.countCards('j') > 0 || target.countCards('e', function (card) {
							return get.value(card, target) < 0;
						}))) return 2;
						if (att < 0 && target.countCards('e') > 0 && !target.hasSkillTag('noe')) return -1;
						return 0;
					});
					'step 2'
					if (result.bool) {
						player.discardPlayerCard(result.targets[0], 'ej', true);
					}
					'step 3'
					if (event.count > 0) {
						player.logSkill('sbxiaoji');
						event.goto(1);
					}
				},
				ai: {
					noe: true,
					reverseEquip: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.type(card) == 'equip' && !get.cardtag(card, 'gifts')) return [1, 3];
						}
					}
				},
			},
			//吕蒙
			sbkeji: {
				audio: 2,
				enable: 'phaseUse',
				filterCard: true,
				selectCard: function () {
					var player = _status.event.player;
					if (player.hasSkill('sbkeji_discard')) return [0, 0];
					if (player.hasSkill('sbkeji_losehp')) return [1, 1];
					return [0, 1];
				},
				locked: false,
				usable: 2,
				prompt: function (event) {
					var player = _status.event.player, str = '出牌阶段' + (player.storage.sbkeji ? '' : '各') + '限一次。你可以';
					var discard = player.hasSkill('sbkeji_discard'), losehp = player.hasSkill('sbkeji_losehp');
					if (!discard) str += '弃置一张手牌并获得1点护甲';
					if (!losehp) str += (!discard ? '，或' : '') + '点击“确定”失去1点体力并获得2点护甲';
					return str;
				},
				filter: function (event, player) {
					return (player.getStat('skill').sbkeji || 0) < (player.storage.sbkeji ? 1 : 2);
				},
				check: function (card) {
					var player = _status.event.player;
					if (_status.event.player.hp <= 2 && player.canSave(player) && player.hujia <= 3) return 0;
					return 6 - get.value(card);
				},
				content: function () {
					'step 0'
					if (cards.length) {
						player.changeHujia(1, null, true);
						player.addTempSkill('sbkeji_discard', 'phaseUseAfter');
						event.finish();
					}
					else {
						player.loseHp();
					}
					'step 1'
					player.changeHujia(2, null, true);
					player.addTempSkill('sbkeji_losehp', 'phaseUseAfter');
				},
				mod: {
					maxHandcard: function (player, num) {
						return num + player.hujia;
					},
					cardEnabled: function (card, player) {
						if (player != _status.event.dying && card.name == 'tao') return false;
					},
					cardSavable: function (card, player) {
						if (player != _status.event.dying && card.name == 'tao') return false;
					},
				},
				ai: {
					order: 1,
					result: {
						player: function (player, target) {
							if (player.hujia >= 5) return 0;
							if (player.hp <= 2 && !player.canSave(player) && !player.hasCard(card => {
								return lib.filter.cardDiscardable(card, player, 'sbkeji') && get.value(card) < 6;
							}, 'h')) {
								return 0;
							}
							return 1;
						}
					},
				},
				subSkill: {
					discard: { charlotte: true },
					losehp: { charlotte: true },
				}
			},
			sbdujiang: {
				audio: 2,
				trigger: { player: 'phaseZhunbeiBegin' },
				derivation: 'sbduojing',
				juexingji: true,
				forced: true,
				skillAnimation: true,
				animationColor: 'wood',
				filter: function (event, player) {
					return player.hujia >= 3;
				},
				content: function () {
					player.awakenSkill('sbdujiang');
					player.addSkillLog('sbduojing');
					player.storage.sbkeji = true;
				}
			},
			sbduojing: {
				audio: 2,
				trigger: { player: 'useCardToPlayer' },
				filter: function (event, player) {
					return player.hujia > 0 && event.card.name == 'sha';
				},
				check: function (event, player) {
					return event.target.countGainableCards(player, 'he') > 0 || player.countCards('hs', { name: 'sha' }) > 0;
				},
				logTarget: 'target',
				content: function () {
					'step 0'
					player.changeHujia(-1);
					if (!trigger.card.storage) trigger.card.storage = {};
					trigger.card.storage.sbduojing = true;
					'step 1'
					var target = trigger.target;
					if (target.countGainableCards(player, 'he') > 0) player.gainPlayerCard(target, 'he', true);
					player.addTempSkill('sbduojing_add', 'phaseUseAfter');
					player.addMark('sbduojing_add', 1, false);
					player.markSkill('sbduojing_add');
				},
				subSkill: {
					add: {
						charlotte: true,
						marktext: '夺',
						onremove: true,
						intro: {
							content: '本阶段使用杀次数上限+$'
						},
						mod: {
							cardUsable: function (card, player, num) {
								if (card.name == 'sha') return num + player.countMark('sbduojing_add');
							},
						},
					},
				},
				ai: {
					unequip: true,
					unequip_ai: true,
					skillTagFilter: function (player, tag, arg) {
						if (player.hujia <= 0) return;
						if (tag == 'unequip' && (!arg || !arg.card || !arg.card.storage || !arg.card.storage.sbduojing)) return false;
						if (tag == 'unequip_ai' && (!arg || arg.name != 'sha')) return false;
					},
				},
			},
			//于禁
			sbxiayuan: {
				audio: 2,
				trigger: { global: 'damageEnd' },
				direct: true,
				filter: function (event, player) {
					return event.hujia && !event.player.hujia && event.player.isIn() && player.countCards('h') > 1 && !player.hasSkill('sbxiayuan_round', null, false, false);
				},
				content: function () {
					'step 0'
					player.addTempSkill('sbxiayuan_round', 'roundStart');
					player.chooseToDiscard(2, 'h', get.prompt('sbxiayuan', trigger.player), '弃置两张手牌，令其获得' + get.cnNumber(trigger.hujia) + '点护甲').set('goon', get.attitude(player, trigger.player) > 0).set('ai', function (card) {
						if (!_status.event.goon) return 0;
						if (get.attitude(_status.event.player, trigger.player) > 0) return 5 - get.value(card);
						return 0;
					}).logSkill = ['sbxiayuan', trigger.player];
					'step 1'
					if (result.bool) {
						var target = trigger.player;
						target.changeHujia(trigger.hujia, null, true);
						game.delayx();
					}
					else player.removeSkill('sbxiayuan_round');
				},
				subSkill: { round: { charlotte: true } },
				ai: { expose: 0.2 },
			},
			sbjieyue: {
				audio: 4,
				trigger: { player: 'phaseJieshuBegin' },
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(lib.filter.notMe, get.prompt('sbjieyue'), '令一名其他角色获得1点护甲，然后该角色可以交给你一张牌。').set('ai', function (target) {
						return get.attitude(_status.event.player, target) / Math.sqrt(Math.min(1, target.hp + target.hujia));
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill('sbjieyue', target);
						target.changeHujia(1, null, true);
						target.chooseCard('he', '是否交给' + get.translation(player) + '一张牌？').set('ai', (card) => 0.1 - get.value(card));
					}
					else event.finish();
					'step 2'
					if (result.bool) {
						target.give(result.cards, player);
					}
				},
				ai: {
					threaten: 2.7,
					expose: 0.2,
				},
			},
			//华雄
			sbyangwei: {
				audio: 2,
				enable: 'phaseUse',
				filter: function (event, player) {
					return !player.hasSkill('sbyangwei_counter', null, null, false);
				},
				content: function () {
					player.draw(2);
					player.addTempSkill('sbyangwei_effect');
					player.addSkill('sbyangwei_counter');
				},
				ai: {
					order: 9,
					result: { player: 1 },
				},
				subSkill: {
					effect: {
						audio: 'sbyangwei',
						equipSkill: false,
						inherit: 'qinggang_skill',
						charlotte: true,
						nopop: true,
						mod: {
							targetInRange: function (card) {
								if (card.name == 'sha') return true;
							},
							cardUsable: function (card, player, num) {
								if (card.name == 'sha') return num + 1;
							},
						},
						mark: true,
						marktext: '威',
						intro: { content: '使用【杀】的次数上限+1且无距离限制且无视防具' },
					},
					counter: {
						trigger: { player: 'phaseJieshu' },
						silent: true,
						popup: false,
						forced: true,
						charlotte: true,
						onremove: true,
						content: function () {
							if (!player.storage.sbyangwei_counter) player.storage.sbyangwei_counter = true;
							else player.removeSkill('sbyangwei_counter');
						},
					},
				},
			},
			//黄忠
			sbliegong: {
				audio: 2,
				mod: {
					cardnature: function (card, player) {
						if (!player.getEquip(1) && get.name(card, player) == 'sha') return false;
					},
				},
				trigger: { player: 'useCardToPlayered' },
				filter: function (event, player) {
					return !event.getParent()._sbliegong_player && event.targets.length == 1 && event.card.name == 'sha' && player.getStorage('sbliegong').length > 0;
				},
				prompt2: function (event, player) {
					var str = '', storage = player.getStorage('sbliegong');
					if (storage.length > 1) {
						str += ('展示牌堆顶的' + get.cnNumber(storage.length - 1) + '张牌并增加伤害；且');
					}
					str += ('令' + get.translation(event.target) + '不能使用花色为');
					for (var i = 0; i < storage.length; i++) {
						str += get.translation(storage[i]);
					}
					str += ('的牌响应' + get.translation(event.card));
					return str;
				},
				logTarget: 'target',
				locked: false,
				check: function (event, player) {
					var target = event.target;
					if (get.attitude(player, target) > 0) return false;
					if (target.hasSkillTag('filterDamage', null, {
						player: player,
						card: event.card,
					})) return false;
					var storage = player.getStorage('sbliegong');
					if (storage.length >= 4) return true;
					if (storage.length < 3) return false;
					if (target.hasShan()) return storage.contains('heart') && storage.contains('diamond');
					return true;
				},
				content: function () {
					var storage = player.getStorage('sbliegong').slice(0);
					var num = storage.length - 1;
					var evt = trigger.getParent();
					if (num > 0) {
						if (typeof evt.baseDamage != 'number') evt.baseDamage = 1;
						var cards = get.cards(num);
						player.showCards(cards.slice(0), get.translation(player) + '发动了【烈弓】');
						while (cards.length > 0) {
							var card = cards.pop();
							if (storage.contains(get.suit(card, false))) evt.baseDamage++;
							ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
						}
						game.updateRoundNumber();
					}
					evt._sbliegong_player = player;
					player.addTempSkill('sbliegong_clear');
					var target = trigger.target;
					target.addTempSkill('sbliegong_block');
					if (!target.storage.sbliegong_block) target.storage.sbliegong_block = [];
					target.storage.sbliegong_block.push([evt.card, storage]);
					lib.skill.sbliegong.updateBlocker(target);
				},
				updateBlocker: function (player) {
					var list = [], storage = player.storage.sbliegong_block;
					if (storage && storage.length) {
						for (var i of storage) list.addArray(i[1]);
					}
					player.storage.sbliegong_blocker = list;
				},
				ai: {
					threaten: 3.5,
					directHit_ai: true,
					halfneg: true,
					skillTagFilter: function (player, tag, arg) {
						if (arg && arg.card && arg.card.name == 'sha') {
							var storage = player.getStorage('sbliegong');
							if (storage.length < 3 || !storage.contains('heart') || !storage.contains('diamond')) return false;
							var target = arg.target;
							if (target.hasSkill('bagua_skill') || target.hasSkill('bazhen') || target.hasSkill('rw_bagua_skill')) return false;
							return true;
						}
						return false;
					},
				},
				intro: {
					content: '已记录花色：$',
					onunmark: true,
				},
				group: 'sbliegong_count',
				subSkill: {
					clear: {
						trigger: { player: 'useCardAfter' },
						forced: true,
						charlotte: true,
						popup: false,
						filter: function (event, player) {
							return event._sbliegong_player == player;
						},
						content: function () {
							player.unmarkSkill('sbliegong');
						},
					},
					block: {
						mod: {
							cardEnabled: function (card, player) {
								if (!player.storage.sbliegong_blocker) return;
								var suit = get.suit(card);
								if (suit == 'none') return;
								var evt = _status.event;
								if (evt.name != 'chooseToUse') evt = evt.getParent('chooseToUse');
								if (!evt || !evt.respondTo || evt.respondTo[1].name != 'sha') return;
								if (player.storage.sbliegong_blocker.contains(suit)) return false;
							},
						},
						trigger: {
							player: ['damageBefore', 'damageCancelled', 'damageZero'],
							target: ['shaMiss', 'useCardToExcluded', 'useCardToEnd'],
							global: ['useCardEnd'],
						},
						forced: true,
						firstDo: true,
						charlotte: true,
						onremove: function (player) {
							delete player.storage.sbliegong_block;
							delete player.storage.sbliegong_blocker;
						},
						filter: function (event, player) {
							if (!event.card || !player.storage.sbliegong_block) return false;
							for (var i of player.storage.sbliegong_block) {
								if (i[0] == event.card) return true;
							}
							return false;
						},
						content: function () {
							var storage = player.storage.sbliegong_block;
							for (var i = 0; i < storage.length; i++) {
								if (storage[i][0] == trigger.card) {
									storage.splice(i--, 1);
								}
							}
							if (!storage.length) player.removeSkill('sbliegong_block');
							else lib.skill.sbliegong.updateBlocker(target);
						},
					},
					count: {
						trigger: {
							player: 'useCard',
							target: 'useCardToTargeted',
						},
						forced: true,
						filter: function (event, player, name) {
							if (name != 'useCard' && player == event.player) return false;
							var suit = get.suit(event.card);
							if (!lib.suit.contains(suit)) return false;
							if (player.storage.sbliegong && player.storage.sbliegong.contains(suit)) return false;
							return true;
						},
						content: function () {
							player.markAuto('sbliegong', [get.suit(trigger.card)]);
						},
					},
				},
			},
			//刘赪
			splveying: {
				audio: 2,
				trigger: { player: 'useCardAfter' },
				forced: true,
				filter: function (event, player) {
					return event.card.name == 'sha' && player.countMark('splveying') > 1;
				},
				content: function () {
					'step 0'
					player.removeMark('splveying', 2);
					player.draw();
					'step 1'
					player.chooseUseTarget('guohe');
				},
				marktext: '椎',
				intro: {
					name: '椎(掠影/莺舞)',
					name2: '椎',
					content: 'mark',
				},
				group: 'splveying_add',
				subSkill: {
					add: {
						trigger: { player: 'useCardToPlayered' },
						forced: true,
						usable: 2,
						filter: function (event, player) {
							return event.card.name == 'sha' && player.isPhaseUsing();
						},
						content: function () {
							player.addMark('splveying', 1);
						},
					},
				},
			},
			spyingwu: {
				group: 'spyingwu_add',
				audio: 2,
				trigger: { player: 'useCardAfter' },
				forced: true,
				locked: false,
				filter: function (event, player) {
					return player.hasSkill('splveying') && (get.type(event.card) == 'trick' && !get.tag(event.card, 'damage')) && player.countMark('splveying') > 1;
				},
				content: function () {
					player.removeMark('splveying', 2);
					player.draw();
					player.chooseUseTarget('sha', false);
				},
				ai: { combo: 'splveying' },
				subSkill: {
					add: {
						trigger: { player: 'useCardToPlayered' },
						forced: true,
						locked: false,
						usable: 2,
						filter: function (event, player) {
							return player.hasSkill('splveying') && (get.type(event.card) == 'trick' && !get.tag(event.card, 'damage')) && player.isPhaseUsing();
						},
						content: function () {
							player.addMark('splveying', 1);
						},
					},
				},
			},
			//杨婉
			spmingxuan: {
				audio: 2,
				trigger: { player: 'phaseUseBegin' },
				forced: true,
				filter: function (event, player) {
					var list = player.getStorage('spmingxuan');
					return player.countCards('h') > 0 && game.hasPlayer(function (current) {
						return current != player && !list.contains(current);
					});
				},
				content: function () {
					'step 0'
					var suits = [], hs = player.getCards('h');
					for (var i of hs) suits.add(get.suit(i, player));
					var list = player.getStorage('spmingxuan'), num = Math.min(suits.length, game.countPlayer(function (current) {
						return current != player && !list.contains(current);
					}));
					player.chooseCard('h', true, [1, num], '瞑昡：请选择至多' + get.cnNumber(num) + '张花色各不相同的手牌', function (card, player) {
						if (!ui.selected.cards.length) return true;
						var suit = get.suit(card);
						for (var i of ui.selected.cards) {
							if (get.suit(i, player) == suit) return false;
						}
						return true;
					}).set('complexCard', true).set('ai', (card) => 6 - get.value(card));
					'step 1'
					if (result.bool) {
						var list = player.getStorage('spmingxuan'), cards = result.cards.randomSort();
						var targets = game.filterPlayer((current) => (current != player && !list.contains(current))).randomGets(cards.length).sortBySeat();
						player.line(targets, 'green');
						var map = [];
						for (var i = 0; i < targets.length; i++) {
							map.push([targets[i], cards[i]]);
						}
						game.loseAsync({
							gain_list: map,
							player: player,
							cards: cards,
							giver: player,
							animate: 'giveAuto',
						}).setContent('gaincardMultiple');
						event.targets = targets;
						event.num = 0;
					}
					else event.finish();
					'step 2'
					game.delayx();
					'step 3'
					if (num < targets.length) {
						var target = targets[num];
						event.num++;
						if (target.isIn()) {
							event.target = target;
							target.chooseToUse(function (card, player, event) {
								if (get.name(card) != 'sha') return false;
								return lib.filter.filterCard.apply(this, arguments);
							}, '对' + get.translation(player) + '使用一张杀，否则交给其一张牌，且其摸一张牌').set('targetRequired', true).set('complexSelect', true).set('filterTarget', function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
								return lib.filter.targetEnabled.apply(this, arguments);
							}).set('sourcex', player).set('addCount', false);
						}
						else {
							if (event.num < targets.length) event.redo();
							else event.finish();
						}
					}
					'step 4'
					if (result.bool) {
						player.markAuto('spmingxuan', [target]);
						if (event.num < targets.length) event.goto(3);
						else event.finish();
					}
					else {
						var he = target.getCards('he');
						if (he.length) {
							if (he.length == 1) event._result = { bool: true, cards: he };
							else target.chooseCard('he', true, '交给' + get.translation(player) + '一张牌')
						}
						else {
							if (event.num < targets.length) event.goto(3);
							else event.finish();
						}
					}
					'step 5'
					if (result.bool) {
						target.give(result.cards, player);
						player.draw();
					}
					if (event.num < targets.length) event.goto(3);
				},
				intro: { content: '已被$使用过杀' },
			},
			spxianchou: {
				audio: 2,
				trigger: { player: 'damageEnd' },
				direct: true,
				filter: function (event, player) {
					return event.source && event.source.isIn() && game.hasPlayer(function (current) {
						return current != player && current != event.source;
					});
				},
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt2('spxianchou'), function (card, player, target) {
						return target != player && target != _status.event.getTrigger().source;
					}).set('ai', function (target) {
						return get.attitude(target, _status.event.player) * Math.sqrt(target.countCards('he'));
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill('spxianchou', target);
						player.line2([target, trigger.source]);
						target.chooseToDiscard('he', '是否弃置一张牌，视为对' + get.translation(trigger.source) + '使用一张【杀】？').set('ai', function (card) {
							if (_status.event.goon) return 8 - get.value(card);
							return 0;
						}).set('goon', ((target.canUse('sha', trigger.source, false) ? get.effect(trigger.source, { name: 'sha', isCard: true }, target, target) : 0) + get.recoverEffect(player, target, target)) > 0);
					}
					else event.finish();
					'step 2'
					if (result.bool) {
						if (target.canUse('sha', trigger.source, false)) target.useCard({ name: 'sha', isCard: true }, trigger.source, false);
						else event.finish();
					}
					else event.finish();
					'step 3'
					if (target.hasHistory('sourceDamage', function (evt) {
						var card = evt.card;
						if (!card || card.name != 'sha') return false;
						var evtx = evt.getParent('useCard');
						return evtx.card == card && evtx.getParent() == event;
					})) {
						target.draw();
						player.recover();
					}
				},
			},
		}
};
}
