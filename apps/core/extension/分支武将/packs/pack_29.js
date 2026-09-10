// Extracted from character/xinghuoliaoyuan.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
			dc_xh_zhangzhao: ['male', 'wu', 3, ['dcxhzhongyan', 'dcxhjinglun']],
			dc_xh_fazheng: ['male', 'shu', 3, ['dcxhzhiji', 'dcxhanji']],
			dc_xh_xunyu: ['male', 'wei', 3, ['dcxhanshu', 'dcxhkuangzuo']],
			dc_xh_dongzhuo: ['male', 'qun', 5, ['dcweilin', 'dczhangrong', 'dchaoshou'], ['zhu']],
			dc_xh_sunshangxiang: ['female', 'wu', 3, ['dcsaying', 'dcjiaohao']],
			dc_xh_sunjian: ['male', 'qun', "4/5", ['dc_ruijun', 'dc_gangyi']],
			dc_xh_zhangchunhua: ['female', 'wei', 3, ['dcxhliangyan', 'dcxhminghui']],
			dc_xh_yuanshao: ['male', 'qun', 4, ['dcxhxiaoyan', 'dcxhzongshi', 'dcxhjiaowang', 'dcxhaoshi'], ['zhu']],
			dc_xh_yuanshu: ['male', 'qun', 4, ['dccanxi', 'dcpizhi', 'dczhonggu'], ['zhu']],
			dc_xh_caoren: ['male', 'wei', 4, ['dcsujun', 'dclifeng']],
			liuyao: ["male", "qun", 4, ["xinfu_kannan"]],
		},
"characterSort": {
			xinghuoliaoyuan: {
				dcxh_tianliang: [],
				dcxh_tianji: [],
				dcxh_tiantong: [],
				dcxh_tianxiang: [ 'liuyao'],
				dcxh_qisha: [],
				dcxh_yuheng: ['dc_xh_caoren', 'dc_xh_zhangchunhua'],
				dcxh_tianshu: ['dc_xh_yuanshu', 'dc_xh_dongzhuo', 'dc_xh_yuanshao', 'dc_xh_zhangzhao'],
				dcxh_kaiyang: ['dc_xh_sunjian'],
				dcxh_yaoguang: ['dc_xh_sunshangxiang'],
				dcxh_tianxuan: ['dc_xh_xunyu', 'dc_xh_fazheng'],
			},
		},
"characterTitle": {},
"characterIntro": {
			dc_xh_zhangzhao: '北斗为帝车之象，一天枢、二天璇、三天玑、四天权、五玉衡、六开阳、七摇光。天璇，又名巨门，善才辩，视为吉星，应星之人性格耿直，常直言不讳。<br>汉末，张昭为避战乱南渡至扬州，孙策创业时，任命其为长史，将文武之事都委任于张昭，临终前更是将孙权托付给张昭。张昭严正，敢于直言谏净，一生以忠于孙氏基业为任，但因其与孙权在个性、军政策略等方面的深层矛盾，使其以“入宫则拜孤，出宫则拜君”的地位，却终身不得任丞相。',
			dc_xh_fazheng: '北斗为帝车之象，一天枢、二天璇、三天玑、四天权、五玉衡、六开阳、七摇光。天璇者，巨门也，应星之人机警明机。<br>定军沙场双旗扬，孝直奇谋胜四方。<br>计佐老将勇无敌，夏侯将败命已亡。<br>慧眼如炬识时机，智计百出敌难当。<br>功成名就传千古，英名永垂耀八荒。',
			dc_xh_xunyu: '北斗为帝车之象，一天枢、二天璇、三天玑、四天权、五玉衡、六开阳、七摇光。天璇，又名巨门，善才辩，视为吉星，应星之人性格耿直，常直言不讳。<br>战云密布官渡前，令君筹谋夜未眠。<br>袁绍势强横河北，曹公志远定中原.<br>劝君勿惧敌锋锐，兵法在心胜万千。<br>天时地利皆相与，人和更在主公贤。<br>一战功成天下定，青史留名万古传。',
			dc_xh_dongzhuo: '北斗为帝车之象，一天枢、二天璇、三天玑、四天权、五玉衡、六开阳、七摇光。天枢者，名魁，字贪狼。<br>汉季失权柄，董卓乱天常。<br>志欲图篡弑，先害诸贤良。<br>逼迫迁旧邦，拥主以自疆。<br>海内兴义师，欲共讨不祥。<br>卓众来东下，金甲耀日光。<br>平土人脆弱，来兵皆胡羌。',
			dc_xh_zhangchunhua: '北斗为帝车之象，一天枢、二天璇、三天玑、四天权、五玉衡、六开阳、七摇光。玉衡者，字廉贞，性暴烈，顺九天而调阴阳。<br>贤内良助似明珠，温柔贤淑貌亦殊。<br>持家有道心如水，贤夫教子德如瑶。<br>曾弑间侍情意重，曾经和鸣恩爱笃。<br>奈何万事兴旺日，却为痴氓道老物。',
			dc_xh_caoren: '北斗为帝车之象，一天枢、二天璇、三天玑、四天权、五玉衡、六开阳、七摇光。玉衡者，字廉贞，具威权，可维序。曹仁，字子孝，沛国谯人，曹操从弟，少时不修行检，做了大将后变得严整自律，奉法守令。<br>曹仁跟随曹操南征北战多年，为曹魏立下汗马功劳。<br>赤壁之战兵败后，曹仁镇守江陵与周瑜拖了一年之久，为曹操重整旗鼓赢得了宝贵的时间，又在渭南破马超，并在裴樊之战中挡住了关羽的进攻。<br>魏国建立后曹仁拜车骑将军，统率荆州、扬州、益州军事，晋封陈侯，曹不代汉建魏，封曹仁为大将军，又迁大司马。',
			dc_xh_yuanshao: '北斗为帝车之象，一天枢、二天璇、三天玑、四天权、五玉衡、六开阳、七摇光。天枢者，名魁，字贪狼。<br>豪门望族袁家子，英勇善战天下知。<br>胸怀壮志吞山河，气吞万里势如驰。<br>群雄逐鹿中原起，江左英豪竞相齐。<br>天不假年英魂逝，功名利禄化尘泥。',
			dc_xh_yuanshu: '北斗为帝车之象，一天枢、二天璇、三天玑、四天权、五玉衡、六开阳、七摇光。天枢者，名魁，字贪狼。<br>袁术，字公路，汝南汝阳人，袁逢之嫡次子，袁绍之弟。<br>初平元年，与袁绍、曹操等同时起兵，共讨董卓。后与袁绍对立，被袁绍、曹操击败，率余众奔九江，割据扬州。<br>建安二年称帝，建号仲氏。此后袁术奢侈荒淫，横征暴敛，使江淮地区残破不堪，民多饥死,部众离心。后为吕布、曹操所破，元气大伤，只得流落疆野。<br>当时军中仅有麦屑三十斛，时六月盛暑，袁术欲得蜜浆解渴，又无蜜，叹息良久；乃大咤曰：“袁术怎么会到这个地步！” 最后呕血斗余而死。',
			wangcan: "王粲（177年－217年2月17日），字仲宣。山阳郡高平县（今山东微山两城镇）人。东汉末年文学家，“建安七子”之一，太尉王龚曾孙、司空王畅之孙。",
			re_jsp_pangtong: "庞统，字士元，襄阳（治今湖北襄阳）人。三国时刘备帐下谋士，官拜军师中郎将。才智与诸葛亮齐名，人称“凤雏”。在进围雒县时，统率众攻城，不幸被流矢击中去世，时年三十六岁。追赐统为关内侯，谥曰靖侯。庞统死后，葬于落凤庞统墓坡。",
			lvdai: "吕岱（161年－256年），字定公，广陵海陵（今江苏如皋）人。三国时期吴国重臣、将领。吕岱一生戮力奉公，为孙吴开疆拓土，功勋赫赫。太平元年（256年），吕岱去世，年九十六。",
			lvqian: "吕虔（生卒年不详），字子恪。任城国（今山东济宁东南）人。汉末至三国曹魏时期将领。 吕虔有勇有谋，曹操在兖州时，任命他为从事，率领家丁驻守湖陆。后升任泰山太守，与夏侯渊共同镇压济南等地的黄巾军。被推举为秀才，加任骑都尉，仍管辖泰山郡。 曹丕继任魏王后，加吕虔为裨将军，封益寿亭侯。再升任徐州刺史，加任威虏将军。任用王祥为别驾，将民政事务都委托于他，为世人所称赞。曹叡继位后，改封万年亭侯。吕虔死后，其子吕翻世袭万年亭侯。",
			panjun: "潘濬（一作潘浚）（？－239年），字承明。武陵郡汉寿县（今湖南汉寿）人。三国时期吴国重臣，蜀汉大司马蒋琬的表弟。 潘濬为人聪察，对问有机理，拜大儒宋忠为师，得到“建安七子”之一的王粲赏识。不到三十，即被荆州牧刘表任命为江夏从事，因按杀贪污的沙羡长而闻名。建安十六年（211年），被刘备任命为荆州治中从事，与守臣关羽不睦。建安二十四年（219年），孙权得荆州，拜潘濬为辅军中郎将。又迁奋威将军，封常迁亭侯。孙权称帝后，拜少府，进封刘阳侯，又改太常。黄龙三年（231年），授假节，与吕岱率军五万平五溪蛮夷叛乱，经三年而斩获数万，使得一方宁静。潘濬为人刚正不阿，在吕壹弄权时，屡请孙权将其诛杀。甚至想亲手击杀吕壹，使吕壹对他非常畏惧。 赤乌二年（239年），潘濬去世。",
			duji: "杜畿 （jī）（163年—224年），字伯侯，京兆杜陵（今陕西西安东南）人。东汉末及三国时曹魏官吏及将领。西汉御史大夫杜延年的后代。历官郡功曹、守郑县令，善于断案。荀彧将他举荐给曹操，曹操任命他为司空司直，调任护羌校尉，使持节领西平太守。 曹丕受禅登基后，封杜畿为丰乐亭侯。官至尚书仆射。后在陶河试航时遇上大风沉没，杜畿淹死，死时六十二岁，曹丕为之涕泣，追赠其为太仆，谥戴侯。",
			zhoufang: "周鲂（生卒年不详），字子鱼。吴郡阳羡县（今江苏宜兴）人。三国时期吴国将领。周鲂年少时好学，被举为孝廉。历任宁国县长、怀安县长、钱塘侯相，一月之内，便斩杀作乱的彭式及其党羽，因而升任丹阳西部都尉。彭绮率数万人反叛时，周鲂被任命为鄱阳太守，与胡综共同将其生擒，因功加职昭义校尉。后诈降曹休，诱其率军接应，使曹休在石亭之战中一败涂地，战后因功被加职为裨将军，封关内侯。贼帅董嗣凭险骚扰豫章等郡，周鲂派间谍将其诱杀，不费兵卒即安定数郡。周鲂在鄱阳赏罚分明、恩威并施，于任职十三年后去世。",
			yanjun: "严畯（生卒年不详），字曼才，彭城（治今江苏徐州）人，三国时期孙吴官员、学者。性情忠厚，待人以诚。少好学，精通《诗》、《书》、《三礼》，又好《说文》。避乱江东，与诸葛瑾、步骘是好朋友，被张昭推荐给孙权作骑都尉、从事中郎。建安二十二年（217年），横江将军鲁肃去世，孙权打算让严畯接替其位。严畯很有自知之明，知道自己没有能力对抗在荆州的关羽和北面的曹魏，便坚决不接受此任命。后来担任尚书令。严畯享年七十八岁。著有《孝经传》、《潮水论》。",
			liuyao: "刘繇（yáo，一读yóu）（156年－197年），字正礼。东莱牟平（今山东牟平）人。东汉末年宗室、大臣，汉末群雄之一，齐悼惠王刘肥之后，太尉刘宠之侄。<br>刘繇最初被推举为孝廉，授郎中。任下邑县长时，因拒郡守请托而弃官。后被征辟为司空掾属，除授侍御史，因战乱而不到任，避居淮浦。兴平元年（194年），被任命为扬州刺史。他先后与袁术、孙策交战，一度被朝廷加授为扬州牧、振武将军，但最终还是败归丹徒。此后，刘繇又击破反叛的笮融，旋即病逝，年四十二。",
			liuyan: "刘焉（？－194年），字君郎（《华阳国志》又作君朗）。江夏郡竟陵县（今湖北省天门市）人。东汉末年宗室、军阀，汉末群雄之一，西汉鲁恭王刘余之后。<br>刘焉初以汉朝宗室身份，拜为中郎，历任雒阳令、冀州刺史、南阳太守、宗正、太常等官。因益州刺史郄俭在益州大肆聚敛，贪婪成风，加上当时天下大乱。刘焉欲取得一安身立命之所，割据一方，于是向朝廷求为益州牧，封阳城侯，前往益州整饬吏治。郄俭为黄巾军所杀，刘焉进入益州，派张鲁盘踞汉中，张鲁截断交通，斩杀汉使，从此益州与中央道路不通。刘焉进一步对内打击地方豪强，巩固自身势力，益州因而处于半独立的状态。兴平元年（194年），刘焉因背疮迸发而逝世，其子刘璋继领益州牧。",
		},
"characterReplace": {
			duji: ['re_duji', 'duji', 'ns_duji'],
			sp_taishici: ['re_sp_taishici', 'sp_taishici'],
			mazhong: ['mazhong', 're_mazhong'],
			wenpin: ['re_wenpin', 'wenpin'],
			liuyan: ['jsrg_liuyan', 'liuyan'],
		},
"characterPrefix": {
			dc_xh_caoren: '星',
		},
"perfectPair": {
			lijue: ['guosi', 'jiaxu'],
			zhangji: ['zhangxiu', 'drlt_zhangxiu', 'zoushi'],
			xf_sufei: ['ganning'],
			simahui: ['pangdegong'],
			zhangqiying: ['zhanglu'],
			pangtong: ['zhugejin'],
			taishici: ['liuyao', 'kongrong'],
		},
"translate": {
			xinghuoliaoyuan: '星汉灿烂',
			"sp_taishici": "SP太史慈",
			wangcan: "王粲",
			"re_jsp_pangtong": "SP庞统",
			lvdai: "吕岱",
			"re_zhangliang": "张梁",
			lvqian: "吕虔",
			panjun: "潘濬",
			duji: "杜畿",
			zhoufang: "周鲂",
			yanjun: "严畯",
			liuyao: "刘繇",
			liuyan: "刘焉",
			"xinfu_guolun": "过论",
			"xinfu_guolun_info": "出牌阶段限一次，你可以展示一名其他角色的手牌，然后展示你的一张牌。你与其交换这两张牌，然后展示的牌点数较小的角色摸一张牌。",
			"xinfu_zhanji": "展骥",
			"xinfu_zhanji_info": "锁定技，你的出牌阶段内，当你因摸牌且不是因为此技能效果而获得牌时，你额外摸一张牌。",
			"xinfu_songsang": "送丧",
			"xinfu_songsang_info": "限定技，其他角色死亡时，你可以回复一点体力（若你未受伤，则改为加一点体力上限）；然后获得技能〖展骥〗。",
			"xinfu_jixu": "击虚",
			"xinfu_jixu_info": "出牌阶段限一次，若你有手牌，你可以令任意名体力值相等的其他角色猜测你的手牌中是否有【杀】。然后，你摸X张牌（X为猜错的角色数）。若你有【杀】，则你本回合内使用【杀】时，所有这些角色均成为【杀】的目标；若你没有【杀】，则你弃置所有这些角色的各一张牌。若X为零，你结束出牌阶段。",
			"jixu_sha": "击虚",
			"jixu_sha_info": "",
			"xinfu_sanwen": "散文",
			"xinfu_sanwen_info": "每回合限一次。当你获得牌后，若你的原手牌中有与这些牌名称相同的牌，则你可以展示这些牌，弃置新得到的同名牌并摸两倍的牌。",
			"xinfu_qiai": "七哀",
			"xinfu_qiai_info": "限定技，当你进入濒死状态时，你可以令所有其他角色依次交给你一张牌。",
			"xinfu_denglou": "登楼",
			"xinfu_denglou_info": "限定技，结束阶段，若你没有手牌，则你可以观看牌堆顶的四张牌，依次使用其中的所有基本牌（不能使用则弃置），然后获得其余的牌。",
			"qinguo_use": "勤国",
			"qinguo_use_info": "",
			"xinfu_qinguo": "勤国",
			"xinfu_qinguo_info": "当你使用的装备牌结算完成时，你可以视为使用一张【杀】；当你因使用或失去装备牌导致装备区内牌的数量发生变化后，若你装备区内牌的数量等于你的体力值，则你回复1点体力。",
			"qinguo_lose": "勤国",
			"qinguo_lose_info": "",
			"xinfu_jijun": "集军",
			"xinfu_jijun_info": "当你于回合内使用非装备牌或武器牌指定目标后，若你是此牌的目标，你可以进行一次判定。然后，你将判定牌置于自己的武将牌上，称之为「方」。",
			"xinfu_fangtong": "方统",
			"xinfu_fangtong_info": "结束阶段，你可以弃置总点数之和为36的一张牌与任意张「方」，并对一名其他角色造成3点雷电伤害。",
			"xinfu_weilu": "威虏",
			"xinfu_weilu_info": "锁定技，当你受到伤害后，伤害来源获得一枚「虏」。你的下个出牌阶段开始时，所有有「虏」的角色将体力失去至1点。此阶段结束后，这些角色回复以此法失去的体力。",
			"weilu_effect": "威虏",
			"weilu_effect_info": "",
			"weilu_effect2": "威虏",
			"weilu_effect2_info": "",
			"xinfu_zengdao": "赠刀",
			"xinfu_zengdao_info": "限定技，出牌阶段，你可以将装备区内的任意张牌置于一名其他角色的武将牌旁，称之为“刀”。该角色造成伤害时，其须移去一张“刀”，然后此伤害+1。",
			"xinfu_zengdao2": "赠刀",
			"xinfu_zengdao2_info": "",
			"xinfu_guanwei": "观微",
			"xinfu_guanwei_info": "每回合限一次。一名角色的出牌阶段结束时，若其本回合使用过两张以上的牌且这些牌均有花色且花色均相同，则你可以弃置一张牌，令其摸两张牌并进行一个额外的出牌阶段。",
			"xinfu_gongqing": "公清",
			"xinfu_gongqing_info": "锁定技，当你受到伤害时，若伤害来源的攻击范围：<3，则你令此伤害的数值减为1。>3，你令此伤害+1。",
			"xinfu_andong": "安东",
			"xinfu_andong_info": "当你受到伤害时，你可以令伤害来源选择一项：1.令你观看其的手牌并获得其中的所有红桃牌；2.防止此伤害，然后其本回合内的红桃手牌不计入手牌上限。",
			"xinfu_yingshi": "应势",
			"xinfu_yingshi_info": "出牌阶段开始时，若场上的所有角色均没有「酬」，则你可以将所有的红桃牌置于一名其他角色的武将牌旁，称之为「酬」。有「酬」的角色受到「杀」的伤害/死亡时，伤害来源/你获得其中的一张/所有的「酬」。",
			"yingshi_heart": "应势",
			"yingshi_heart_info": "",
			"yingshi_die": "应势",
			"yingshi_die_info": "",
			"xinfu_duanfa": "断发",
			"xinfu_duanfa_info": "出牌阶段，你可以弃置任意张黑色牌，然后摸等量的牌。（每回合内限X张，X为你的体力上限）",
			"xinfu_youdi": "诱敌",
			"xinfu_youdi_info": "结束阶段开始时，你可以令一名其他角色弃置你的一张手牌，若此牌：不为黑色，你摸一张牌。不为【杀】，你获得该角色的一张牌。",
			"xinfu_guanchao": "观潮",
			"xinfu_guanchao_info": "出牌阶段开始时，你可以选择获得一项效果直到回合结束：1.当你使用牌时，若你此阶段使用过的所有牌的点数为递增，你摸一张牌；2.当你使用牌时，若你此阶段使用过的所有牌的点数为递减，你摸一张牌。",
			"xinfu_xunxian": "逊贤",
			"xinfu_xunxian_info": "每回合限一次。当你使用或打出的牌结算完成后，你可以将其对应的所有实体牌交给一名手牌数或体力值大于你的角色。",
			"xinfu_kannan": "戡难",
			"xinfu_kannan_info": "出牌阶段限X次，你可以与一名本回合内未成为过〖戡难〗目标的角色拼点。若你赢，你使用的下一张【杀】的伤害值基数+1，且你本回合内不能再发动〖戡难〗。若你没赢，其使用的下一张【杀】的伤害值基数+1。（X为你的体力值）。",
			"kannan_eff": "戡难",
			"kannan_eff_info": "",
			"xinfu_tushe": "图射",
			"xinfu_tushe_info": "当你使用非装备牌指定目标后，若你没有基本牌，则你可以摸X张牌。（X为此牌指定的目标数）",
			"xinfu_limu": "立牧",
			"xinfu_limu_info": "出牌阶段，你可以将一张♦牌当做【乐不思蜀】对自己使用，然后回复1点体力。只要你的判定区内有牌，你对攻击范围内的其他角色使用牌便没有次数和距离限制。",
			xinyingshi: '应势',
			xinyingshi_info: '出牌阶段开始时，若场上所有角色的武将牌上均没有“酬”，则你可以将任意张牌置于一名角色的武将牌上，称为“酬”。若如此做：当有角色使用牌对有“酬”的角色造成伤害后，其可以获得一张“酬”，并获得牌堆中所有与“酬”花色点数均相同的牌；有“酬”的角色死亡时，你获得其所有“酬”。',
			dc_xh_caoren: '星曹仁',
			dcsujun: '肃军',
			dcsujun_info: '当你使用一张牌时，若你手牌中基本牌与非基本牌的数量相等，你可以摸两张牌。',
			dclifeng: '砺锋',
			dclifeng_info: '你可将一张本回合未使用过的颜色的手牌当不计次数的【杀】或【无懈可击】使用。',
			dc_xh_yuanshu: '星袁术',
			dccanxi: '残玺',
			dccanxi_info: '锁定技，游戏开始时，你获得场上各势力的“玺角”标记(每少一个“玺角”则增加1点体力上限)。每轮开始时，你选择一个“玺角”并选择一个效果生效直到下轮开始。1.妄生：与生效“玺角”势力相同的角色每回合首次造成的伤害+1；计算与其他角色的距离-1。2.向死：与生效“玺角”势力相同的其他角色每回合首次回复体力后，失去1点体力；每回合对你使用的第一张牌无效。',
			dcpizhi: '圮秩',
			dcpizhi_info: '锁定技，结束阶段，你摸X张牌；有角色死亡时，若其势力与生效“玺角”的势力相同或其是该势力最后一名角色，失去该“玺角”，然后摸X张牌并回复1点体力（x为你失去的“玺角”数）。',
			dczhonggu: '冢骨',
			dczhonggu_info: '主公技，锁定技，游戏轮数大于等于群势力角色数时，你摸牌阶段摸牌数+2，反之-1。',
			dc_xh_yuanshao: '星袁绍',
			dcxhxiaoyan: '硝焰',
			dcxhxiaoyan_info: '游戏开始时，所有其他角色各受到你造成的1点火焰伤害，然后这些角色可以依次交给你一张牌并回复1点体力。',
			dcxhzongshi: '纵势',
			dcxhzongshi_info: '出牌阶段，你可以展示一张基本牌或普通锦囊牌，然后将此花色的所有其他手牌当此牌使用，且目标数可以改为以此法使用的牌数。',
			dcxhjiaowang: '骄妄',
			dcxhjiaowang_info: '锁定技，每轮结束时，若本轮没有角色死亡，你失去1点体力并发动“硝焰”。',
			dcxhaoshi: '傲势',
			dcxhaoshi_info: '主公技，其他群势力角色的出牌阶段限一次，其可以交给你一张手牌，然后你可以发动一次“纵势”。',
			dc_xh_zhangchunhua: '星张春华',
			dcxhliangyan: '梁燕',
			dcxhliangyan_info: '出牌阶段限一次，你可以选择一名其他角色，你摸/弃至多两张牌，该角色弃/摸等量的牌。然后若你与其手牌数相同，以此法摸牌的角色跳过下一个弃牌阶段。',
			dcxhminghui: '明慧',
			dcxhminghui_info: '每个回合结束时：若你手牌数全场最少，你可以视为使用一张无距离限制的【杀】；若你手牌数全场最多，且场上所有角色都有手牌，你可以将手牌弃置至不为全场最多，然后令一名角色回复1点体力。',
			dc_xh_sunjian: '星孙坚',
			dc_ruijun: '锐军',
			dc_ruijun_info: '出牌阶段，当你本阶段第一次使用牌指定其他角色为目标后，你可以摸已损失的体力值数+1张牌，然后本阶段：1.除该角色外的其他角色均视为不在你的攻击范围内，你对其使用牌无距离限制；2.当你对该角色造成伤害时，此伤害改为X（X为你上一次对其造成的伤害+1，且至多为5）。',
			dc_gangyi: '刚毅',
			dc_gangyi_info: '锁定技，①你的回合内，若你本回合未造成过伤害，你不能使用【桃】；②当你处于濒死状态时，所有角色对你使用的【桃】或【酒】的回复值+1。',
			dc_xh_sunshangxiang: '星孙尚香',
			dcsaying: '飒影',
			dcsaying_info: '每轮每种牌名限一次，当你需要使用一张【杀】或【闪】时，你可以使用一张装备牌，然后视为使用之；当你需要使用一张【桃】或【酒】时，你可以收回装备区里的一张牌，然后视为使用之。',
			dcjiaohao: '骄豪',
			dcjiaohao_info: '出牌阶段限一次，你可以与装备区牌数小于等于你的角色拼点，然后你可以令拼点赢的角色获得拼点的牌或者令其使用一张【杀】。',
			dc_xh_dongzhuo: '星董卓',
			dcweilin: '威临',
			dcweilin_info: '锁定技。当你于回合内对一名其他角色造成伤害时，若其本回合未受到过伤害，且你本回合使用的牌数大于等于其体力值，则此伤害+1。',
			dczhangrong: '掌戎',
			dczhangrong_info: '准备阶段，你可以选择令至多X名体力值大于等于你的角色各失去1点体力或令至多X名手牌数大于等于你的角色各弃置一张手牌（X为你的体力值）。若如此做，你摸等同于选择角色数的牌，且本回合结束时，若这些角色中存在本回合未受到过伤害的角色，则你失去1点体力。',
			dchaoshou: '豪首',
			dchaoshou_info: '主公技。其他群势力角色使用【酒】结算完毕后，其可以令你回复1点体力。',
			dc_xh_xunyu: '星荀彧',
			dcxhanshu: '安庶',
			dcxhanshu_info: '每轮结束时，你可以在弃牌堆中随机选择每种牌名的基本牌各一张，将这些牌置于牌堆顶并视为使用一张【五谷丰登】（你在自己或已受伤的角色中选择一名角色，从其开始结算）。然后直到下轮结束前，当一名角色失去以此法获得的牌后，你可以于当前回合结束时令其将手牌摸至体力上限（至多摸至五）。',
			dcxhkuangzuo: '匡祚',
			dcxhkuangzuo_info: '限定技，出牌阶段，你可以选择两名角色，前者获得技能“承奉”（若其为主公且没有主公技，其获得技能“统荫”），后者将每种花色的各一张牌置于前者的武将牌上，称为“匡祚”。',
			dcxhchengfeng: '承奉',
			dcxhchengfeng_info: '每回合限一次，当一张牌即将对你生效时，你可以将一张红色/黑色的“匡祚”当【闪】/【无懈可击】使用。然后若“匡祚”包含的颜色数小于2，你可以将牌堆顶的一张牌置入“匡祚”。',
			dcxhtongyin: '统荫',
			dcxhtongyin_info: '主公技，当你受到其他角色使用牌造成的伤害后，若其与你势力相同/不同，则你可以将对你造成伤害的牌/该角色的一张牌置入“匡祚”。',
			dc_xh_zhangzhao: '星张昭',
			dcxhzhongyan: '忠言',
			dcxhzhongyan_info: '出牌阶段限一次，你可展示牌堆顶三张牌，然后令一名角色将一张手牌与其中一张牌交换。然后若这些牌颜色相同，其回复1点体力或获得场上一张牌。然后若该角色不为你，你执行其未执行的一项。',
			dcxhjinglun: '经纶',
			dcxhjinglun_info: '每回合限一次，当你距离1以内的角色造成伤害后，你可以令其摸X张牌并对其发动〖忠言〗（X为其装备区的牌数）。',
			dc_xh_fazheng: '星法正',
			dcxhzhiji: '知机',
			dcxhzhiji_info: '准备阶段，你可以弃置任意张手牌，将手牌摸至五张。若此次的弃牌数大于/等于/小于摸牌数，你可以对至多X名其他角色各造成1点伤害/你本回合使用牌不能被响应/你本回合的手牌上限+2（X为弃牌数减摸牌数）。',
			dcxhanji: '谙计',
			dcxhanji_info: '锁定技，当一名角色使用牌后，若与之相同花色的牌本轮被使用的次数最少，你摸一张牌。',

			dcxh_tianliang: '星火燎原·天梁',
			dcxh_tianji: '星火燎原·天机',
			dcxh_tiantong: '星火燎原·天同',
			dcxh_tianxiang: '星火燎原·天相',
			dcxh_qisha: '星火燎原·七杀',
			dcxh_yuheng: '星河璀璨·玉衡',
			dcxh_tianshu: '星河璀璨·天枢',
			dcxh_kaiyang: '星河璀璨·开阳',
			dcxh_yaoguang: '星河璀璨·瑶光',
			dcxh_tianxuan: '星河璀璨·天璇',
		},
"skill": {
			//星法正
			dcxhzhiji: {
				audio: 2,
				trigger: {
					player: 'phaseZhunbeiBegin'
				},
				filter: function (event, player) {
					return player.hasCard(card => lib.filter.cardDiscardable(card, player), 'h');
				},
				content: function () {
					'step 0'
					player.chooseToDiscard(get.prompt2('dcxhzhiji'), [1, Infinity])
						.set('logSkill', 'dcxhzhiji')
						.set('complexCard', true)
						.set('ai', card => {
							var player = _status.event.player;
							switch (get.sgn(player.countCards('h') - 5)) {
								case 1:
									const num = game.countPlayer(target => target !== player && get.damageEffect(target, player, player) > 0);
									if (ui.selected.cards.length < num) return 8 - get.value(card);
									return 0;
								default:
									return lib.skill.zhiheng.check(card);
							}
						});
					'step 1'
					if (result.bool) {
						event.cardsx = result.cards;
						player.drawTo(5);
						game.delayx();
					}
					'step 2'
					var num = event.cardsx.length - (result || []).length;
					if (num > 0) {
						player.chooseTarget(`是否对至多${num}名其他角色各造成1点伤害？`, lib.filter.notMe, [1, num]).set('ai', target => {
							var player = _status.event.player;
							return get.damageEffect(target, player, player);
						});
					} else if (num == 0) {
						player.addTempSkill('dcxhzhiji_directHit');
						event.finish();
					} else if (num < 0) {
						player.addTempSkill('dcxhzhiji_hand');
						player.addMark('dcxhzhiji_hand', 2, false);
						event.finish();
					}
					'step 3'
					if (result.bool) {
						var targets = result.targets.sortBySeat();
						player.line(targets);
						for (var targetx of targets) targetx.damage();
					}
				},
				subSkill: {
					directHit: {
						audio: 'dcxhzhiji',
						trigger: {
							player: 'useCard'
						},
						charlotte: true,
						forced: true,
						content: function () {
							trigger.directHit.addArray(game.players);
							game.log(trigger.cards, '不可被响应');
						}
					},
					hand: {
						charlotte: true,
						onremove: true,
						mod: {
							maxHandcard: function (player, num) {
								return num + player.countMark('dcxhzhiji_hand');
							}
						},
						markimage: 'image/card/handcard.png',
						intro: {
							content: '手牌上限+#'
						},
					},
				},
			},
			dcxhanji: {
				audio: 2,
				trigger: {
					global: 'useCard'
				},
				filter: function (event, player) {
					var history = [], map = {}, suits = lib.suit.slice();
					suits.forEach(suit => {
						map[suit] = 0;
					});
					for (var i = player.actionHistory.length - 1; i >= 0; i--) {
						if (_status.globalHistory[i].useCard) history.addArray(_status.globalHistory[i].useCard);
						if (_status.globalHistory[i].isRound) break;
					}
					history.forEach(evt => {
						var suit = get.suit(evt.card)
						map[suit]++;
					});
					return map[get.suit(event.card)] == Math.min(...Object.values(map));
				},
				forced: true,
				logTarget: 'player',
				content: function () {
					player.draw();
				},
				ai: {
					threaten: 2
				},
			},
			//星张昭
			dcxhzhongyan: {
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return game.hasPlayer((current) => lib.skill.dcxhzhongyan.filterTarget(null, player, current));
				},
				filterTarget: function (card, player, target) {
					return target.countCards('h') > 0;
				},
				content: function () {
					'step 0'
					var cards = get.cards(3);
					player.showCards(cards, get.translation(player) + "发动了【忠言】");
					var hs = target.getCards('h');
					if (hs.length != 0) {
						for (var i = cards.length - 1; i >= 0; i--) {
							ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
						}
						game.updateRoundNumber();
						var dialog = ['忠言：选择要交换的牌', '<div class="text center">' + get.translation(target) + '的手牌</div>', hs, '<div class="text center">牌堆顶</div>', cards];
						target.chooseButton(dialog, 2).set('filterButton', function (button) {
							if (ui.selected.buttons.length) return get.position(button.link) != get.position(ui.selected.buttons[0].link);
							return true;
						}).set('cards1', hs).set('cards2', cards);
					} else event.finish();
					'step 1'
					if (result.bool) {
						var cards = result.links;
						if (get.position(cards[0]) != 'h') cards.reverse();
						var next = target.lose(cards[0], ui.cardPile);
						next.insert_index_card = cards[1];
						next.insert_index = function (event) {
							return event.insert_index_card;
						}
						target.gain(cards[1], 'draw');
					} else event.finish();
					'step 2'
					game.updateRoundNumber();
					var cards = get.cards(3);
					var list = [];
					for (var i = 0; i < cards.length; i++) {
						list.add(get.color(cards[i]));
					}
					if (list.length != 1) {
						event.finish();
					}
					'step 3'
					var goon = game.hasPlayer(i => i.countGainableCards(target, "ej"));
					event.goon = goon;
					var choices = [];
					var choiceList = ["回复1点体力", "获得场上一张牌"];
					if (target.isDamaged()) choices.push("选项一");
					else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
					if (goon) choices.push("选项二");
					else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
					if (!choices.length && target != player && player.isDamaged()) {
						player.recover();
						event.finish();
					} else if (choices.length) {
						target.chooseControl(choices)
							.set("choiceList", choiceList)
							.set("prompt", "忠言：请选择一项")
							.set("ai", () => {
								var player = get.player();
								var eff2 = get.recoverEffect(player, player, player);
								return eff2 ? 0 : 1;
							})
					} else {
						event.finish();
					}
					'step 4'
					if (result.control == "选项一") {
						target.recover();
						if (event.goon && target != player) event.goto(6);
					} else {
						target.chooseTarget("获得一名角色场上的一张牌", true, (card, player, target) => {
							var targetx = _status.event.targetx;
							return target.countGainableCards(targetx, "ej") > 0;
						})
							.set("ai", target => {
								var player = get.player();
								let att = get.attitude(player, target);
								if (att < 0) att = -Math.sqrt(-att);
								else att = Math.sqrt(att);
								return att * lib.card.shunshou.ai.result.target(player, target);
							})
							.set("targetx", target);
					}
					'step 5'
					if (result.bool) {
						target.gainPlayerCard(result.targets[0], "ej", true);
						if (target != player && player.isDamaged()) player.recover();
					}
					event.finish();
					'step 6'
					player.chooseTarget("获得一名角色场上的一张牌", true, (card, player, target) => {
						var targetx = _status.event.targetx;
						return player.countGainableCards(targetx, "ej") > 0;
					})
						.set("ai", target => {
							var player = get.player();
							let att = get.attitude(player, target);
							if (att < 0) att = -Math.sqrt(-att);
							else att = Math.sqrt(att);
							return att * lib.card.shunshou.ai.result.target(player, target);
						})
						.set("targetx", player);
					'step 7'
					if (result.bool) {
						player.gainPlayerCard(result.targets[0], "ej", true);
					}
				},
			},
			dcxhjinglun: {
				audio: 2,
				trigger: {
					global: "damageSource",
				},
				filter: function (event, player) {
					var target = event.source;
					return target && target.isIn() && get.distance(player, target) <= 1;
				},
				check: function (event, player) {
					return get.attitude(player, event.source) > 0;
				},
				usable: 1,
				logTarget: "source",
				content: function () {
					var target = trigger.source,
						num = target.countCards("e");
					if (num) target.draw(num);
					player.useSkill("dcxhzhongyan", [target]);
				},
			},
			//星荀彧
			dcxhanshu: {
				audio: 2,
				trigger: {
					global: 'roundFinish'
				},
				filter: function (event, player) {
					return game.roundNumber > 0;
				},
				content: function () {
					'step 0'
					game.players.forEach(current => current.removeSkill('dcxhanshu_tag'));
					var cards = [], names = [];
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						var card = ui.discardPile.childNodes[i];
						if (get.type(card, false) == 'basic' && !names.contains(card.name)) {
							cards.push(card);
							names.push(card.name);
						}
					}
					if (cards.length) {
						for (var i = cards.length - 1; i >= 0; i--) {
							cards[i].fix();
							ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
						}
						game.updateRoundNumber();
					}
					'step 1'
					game.players.forEach(current => current.addTempSkill('dcxhanshu_tag', 'roundStart'));
					player.chooseUseTarget({ name: 'wugu', isCard: true }, true);
				},
				group: ['dcxhanshu_wugu', 'dcxhanshu_draw', 'dcxhanshu_draw2'],
				subSkill: {
					wugu: {
						trigger: {
							global: 'wuguContentBeforeBegin'
						},
						filter: function (event, player) {
							return event.getParent(3).name == 'dcxhanshu';
						},
						forced: true,
						silent: true,
						popup: false,
						content: function () {
							'step 0'
							player.chooseTarget('请选择开始结算的角色', true, function (card, player, target) {
								return game.filterPlayer(current => current == player || current.isDamaged()).includes(target);
							}).set('ai', target => {
								return get.attitude(_status.event.player, target);
							});
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								trigger.getParent().targets = trigger.getParent().targets.sortBySeat(target);
								trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.sortBySeat(target);
							}
						},
					},
					draw: {
						audio: 'dcxhanshu',
						trigger: {
							global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
						},
						init: function (player) {
							player.storage.dcxhanshu_draw = [];
						},
						filter: function (event, player) {
							var evt = event.getl(event.player);
							if (!event.player || !evt || !evt.hs || !evt.hs.length) return false;
							if (event.name == 'lose') {
								for (var i in event.gaintag_map) {
									if (event.gaintag_map[i].contains('dcxhanshu')) return true;
								}
								return false;
							}
							return event.player.hasHistory('lose', function (evt) {
								if (event != evt.getParent()) return false;
								for (var i in evt.gaintag_map) {
									if (evt.gaintag_map[i].contains('dcxhanshu')) return true;
								}
								return false;
							});
						},
						charlotte: true,
						direct: true,
						silent: true,
						content: function () {
							player.storage.dcxhanshu_draw.add(trigger.player);
						}

					},
					draw2: {
						audio: 'dcxhanshu',
						direct: true,
						charlotte: true,
						silent: true,
						trigger: { global: 'phaseEnd' },
						filter: function (event, player) {
							return player.storage.dcxhanshu_draw && player.storage.dcxhanshu_draw.length;
						},
						content: function () {
							'step 0'
							player.chooseTarget('安庶：选择将手牌摸至体力上限（至多摸五张）的角色', [1, player.storage.dcxhanshu_draw.length], false, function (card, player, target) {
								return player.storage.dcxhanshu_draw.contains(target);
							}).set('ai', target => {
								return get.attitude(player, target) > 0;
							});
							'step 1'
							if (result.bool) {
								player.logSkill('dcxhanshu');
								result.targets.sortBySeat();
								for (var i of result.targets) i.drawTo(Math.min(player.maxHp, 5));
							}
							player.storage.dcxhanshu_draw = [];
						}
					},
					tag: {
						trigger: {
							player: 'gainAfter'
						},
						filter: function (event, player) {
							return event.getParent('dcxhanshu', true) && event.getParent('wugu', true);
						},
						charlotte: true,
						direct: true,
						silent: true,
						onremove: function (player) {
							player.removeGaintag('dcxhanshu');
						},
						content: function () {
							trigger.cards.forEach(card => card.addGaintag('dcxhanshu'));
						},
					},
				},
			},
			dcxhkuangzuo: {
				audio: 2,
				enable: 'phaseUse',
				limited: true,
				skillAnimation: true,
				animationColor: 'water',
				filterTarget: function (event, player, target) {
					if (ui.selected.targets.length) {
						return target.countCards('he') > 0;
					}
					return true;
				},
				selectTarget: 2,
				targetprompt: ['获得技能', '放置手牌'],
				multitarget: true,
				content: function () {
					'step 0'
					player.awakenSkill('dcxhkuangzuo');
					targets[0].addSkill('dcxhchengfeng');
					if (get.mode() == 'identity' && targets[0].identity == 'zhu' && target.getSkills(null, false, false).filter(skill => {
						return lib.skill[skill] && lib.skill[skill].zhuSkill;
					}).length > 0) {
						targets[0].addSkill('dcxhtongyin');
					}
					'step 1'
					var suits = [];
					for (var card of targets[1].getCards('he')) suits.add(get.suit(card));
					targets[1].chooseCard('he', true, suits.length)
						.set('complexCard', true)
						.set('filterCard', card => {
							return ui.selected.cards.every(cardx => get.suit(cardx) != get.suit(card));
						});
					'step 2'
					if (result.bool) {
						var next = targets[0].addToExpansion(result.cards, targets[1], 'give');
						next.gaintag.add('dcxhchengfeng');
					}
				},
				ai: {
					order: 10,
					result: {
						target: 1,
					},
				},
				derivation: ['dcxhchengfeng', 'dcxhtongyin'],
			},
			dcxhchengfeng: {
				audio: 2,
				usable: 1,
				enable: 'chooseToUse',
				filter: function (event, player) {
					for (const name of ['shan', 'wuxie']) {
						if (name == 'wuxie') {
							var info = event.info_map;
							if (info && player != info.target) continue;
						}
						else if (!event.respondTo) continue;
						var color = name == 'shan' ? 'red' : 'black';
						if (!event.filterCard({ name: name }, player, event)) continue;
						if (player.getExpansions('dcxhchengfeng').some(card => get.color(card) == color)) return true;
					}
					return false;
				},
				chooseButton: {
					dialog: function (event, player) {
						return ui.create.dialog('承奉', player.getExpansions('dcxhchengfeng'), 'hidden');
					},
					filter: function (button, player) {
						var card = button.link;
						if (!game.checkMod(card, player, 'unchanged', 'cardEnabled2', player)) return false;
						var evt = _status.event.getParent();
						var name = get.color(card) == 'red' ? 'shan' : 'wuxie';
						return evt.filterCard(get.autoViewAs({ name: name }, [card]), player, evt);
					},
					check: function (button) {
						if (_status.event.getParent().type != 'phase') return 1;
						var player = _status.event.player;
						return player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					},
					backup: function (links, player) {
						return {
							audio: 'dcxhchengfeng',
							selectCard: -1,
							position: 'x',
							filterCard: function (card) {
								return lib.skill.dcxhchengfeng_backup && card == lib.skill.dcxhchengfeng_backup.card
							},
							viewAs: function (cards, player) {
								var name = get.color(cards[0]) == 'red' ? 'shan' : 'wuxie';
								return { name: name };
							},
							card: links[0],
						};
					},
					prompt: function (links, player) {
						return '将一张基本牌当做' + get.translation(links[0][2]) + '使用';
					},
				},
				hiddenCard: function (player, name) {
					var color = name == 'shan' ? 'red' : 'black';
					if (player.getExpansions('dcxhchengfeng').some(card => get.color(card) == color)) return true;
				},
				marktext: '匡',
				intro: {
					name: '匡祚',
					markcount: 'expansion',
					content: 'expansion',
				},
				ai: {
					respondShan: true,
					skillTagFilter: function (player, tag) {
						if (player.getExpansions('dcxhchengfeng').some(card => get.color(card) == 'red')) return true;
					},
					order: 1,
					result: {
						player: function (player) {
							if (_status.event.dying) return get.attitude(player, _status.event.dying);
							return 1;
						},
					},
				},
				group: 'dcxhchengfeng_use',
				subSkill: {
					backup: {},
					use: {
						trigger: {
							player: 'useCardAfter'
						},
						filter: function (event, player) {
							var colors = [];
							for (let card of player.getExpansions('dcxhchengfeng')) colors.add(get.color(card));
							return event.skill == 'dcxhchengfeng_backup' && colors.length < 2;
						},
						prompt2: '将牌堆顶一张牌置入“匡祚”',
						content: function () {
							player.addToExpansion(get.cards(1), 'gain2').gaintag.add('dcxhchengfeng');
						},
					},
				},
			},
			dcxhtongyin: {
				audio: 2,
				zhuSkill: true,
				trigger: {
					player: 'damageEnd'
				},
				filter: function (event, player) {
					if (!event.source || !event.card) return false;
					if (event.source == player) return false;
					if (event.source.group == player.group) return event.cards?.length;
					return event.source.countCards('he');
				},
				logTarget: 'source',
				content: function () {
					'step 0'
					if (trigger.source.group == player.group) {
						var next = player.addToExpansion(trigger.cards, 'gain2');
						next.gaintag.add('dcxhchengfeng');
						return;
					} else {
						player.choosePlayerCard(trigger.source, 'he', true);
					}
					'step 1'
					if (result.bool) {
						var next = player.addToExpansion(result.cards, trigger.source, 'give');
						next.gaintag.add('dcxhchengfeng');
					}
				},
			},
			dcweilin: {
				audio: 2,
				trigger: { source: 'damageBegin1' },
				filter: function (event, player) {
					return !event.player.getHistory('damage').length && player.getHistory('useCard').length >= event.player.hp;
				},
				forced: true,
				logTarget: 'player',
				content: function () {
					trigger.num++;
				},
			},
			dczhangrong: {
				audio: 2,
				trigger: { player: 'phaseZhunbeiBegin' },
				filter: function (event, player) {
					return player.hp > 0;
				},
				direct: true,
				content: function () {
					'step 0'
					var list = ['发动掌戎', 'cancel2'];
					player.chooseControl(list).set('prompt', get.prompt2('dczhangrong'));
					'step 1'
					if (result.control != 'cancel2') {
						player.logSkill('dczhangrong');
						player.chooseControl('弃置手牌', '失去体力').set('prompt', '请选择一种效果');
					} else {
						event.finish();
					}
					'step 2'
					event.choice = (result.control == '弃置手牌');
					var num = player.hp;
					if (event.choice) {
						player.chooseTarget('请选择弃牌的目标', [1, Math.max(1, num)], true, function (card, player, target) {
							return target.countCards("h") >= Math.max(1, player.countCards("h"));
						}).set('ai', function (target) {
							return -get.attitude(player, target);
						});
					} else {
						player.chooseTarget('请选择失去体力的目标', [1, Math.max(1, num)], true, function (card, player, target) {
							return target.hp >= player.hp;
						}).set('ai', function (target) {
							var player = _status.event.player;
							return -get.attitude(player, target);
						});
					}
					'step 3'
					if (result.bool) {
						var targets = result.targets.sortBySeat();
						player.logSkill('dczhangrong', targets);
						targets.forEach(function (target) {
							target.addTempSkill('dczhangrong_threaten');
							if (event.choice) {
								target.chooseToDiscard('h', true);
							} else {
								target.loseHp();
							}
						});
						player.draw(targets.length);
					}
				},
				ai: {
					threaten: 10,
					combo: 'minijishi',
				},
				group: ['dczhangrong_lose'],
				global: 'dczhangrong_check',
				subSkill: {
					check: {
						mod: {
							canBeDiscarded: function (card, player, target) {
								if (!_status.dczhangrong_check) return;
								if (player.hasSkill('dczhangrong') && get.position(card) != 'h') return false;
							},
						},
					},
					threaten: {
						charlotte: true,
						trigger: { player: 'damageEnd' },
						firstDo: true,
						forced: true,
						popup: false,
						content: function () {
							player.removeSkill('dczhangrong_threaten');
						},
						ai: {
							threaten: 10
						},
						mark: true,
						intro: {
							content: '还没受到伤害'
						},
					},
					lose: {
						trigger: { player: 'phaseEnd' },
						forced: true,
						filter: function (event, player) {
							return game.hasPlayer(function (current) {
								return current.hasSkill('dczhangrong_threaten');
							});
						},
						content: function () {
							player.loseHp();
						},
						mark: true,
						marktext: '!',
						intro: {
							content: '还有没受到伤害的！'
						},
					},
				},
			},
			dchaoshou: {
				unique: true,
				audio: 2,
				trigger: { global: 'useCardAfter' },
				filter: function (event, player) {
					return player.hasZhuSkill('dchaoshou') && event.player != player && event.card.name == 'jiu' && player.isDamaged() && event.player.group == 'qun';
				},
				direct: true,
				zhuSkill: true,
				content: function () {
					'step 0'
					trigger.player.chooseBool('是否对' + get.translation(player) + '发动【豪首】？', '令其回复1点体力').set('ai', function () {
						var evt = _status.event;
						return get.attitude(evt.player, evt.getParent().player) > 0;
					});
					'step 1'
					if (result.bool) {
						player.logSkill('dchaoshou');
						trigger.player.line(player, 'green');
						player.recover();
					}
				},
			},
			dcsaying: {
				audio: 2,
				init: function (player) {
					player.storage.dcsaying = []
				},
				filter: function (event, player) {
					return player.storage.dcsaying && player.storage.dcsaying.length < 4;
				},
				enable: ["chooseToUse", "chooseToRespond"],
				hiddenCard: function (player, name) {
					if (player.countCards('e') && (name == 'tao' || name == 'jiu') && !player.storage.dcsaying.contains(name)) return true;
					var e = false;
					if (!player.getCards('h') || player.getCards('h').length == 0 || player.storage.dcsaying.contains(name)) return false;
					for (var i of player.getCards('h')) {
						if (get.type(i) == 'equip') {
							e = true;
							break;
						}
					}
					return e && (name == 'sha' || name == 'shan');
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						var e = false;
						for (var i of player.getCards('h')) {
							if (get.type(i) == 'equip') {
								e = true;
								break;
							}
						}
						if (e) {
							if (!player.storage.dcsaying.contains('sha')) {
								list.push(['基本', '', 'sha']);
								for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
							}
							if (!player.storage.dcsaying.contains('shan')) list.push(['基本', '', 'shan']);
						}
						if (player.countCards('e')) {
							if (!player.storage.dcsaying.contains('tao')) list.push(['基本', '', 'tao']);
							if (!player.storage.dcsaying.contains('jiu')) list.push(['基本', '', 'jiu']);
						}
						if (list.length == 0) {
							return ui.create.dialog('飒影已无可用牌');
						}
						return ui.create.dialog('飒影', [list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
					},
					check: function (button) {
						var player = _status.event.player;
						var effect = player.getUseValue(button.link[2]);
						if (effect > 0) return effect;
						return 0;
					},
					backup: function (links, player) {
						return {
							filterCard: true,
							audio: 'dcsaying',
							selectCard: 0,
							popname: true,
							check: () => true,
							viewAs: { name: links[0][2], nature: links[0][3] },
							precontent: function () {
								'step 0'
								var card = event.result.card;
								if (card.name == 'sha' || card.name == 'shan') {
									player.chooseCard(true, 'h', '选择使用一张装备牌', function (card, player) {
										return get.type(card) == 'equip';
									})
								}
								else event.goto(2);
								'step 1'
								if (result.bool) {
									player.equip(result.cards[0]);
									event.finish();
								}
								'step 2'
								player.chooseCard(true, 'e', '选择收回一张装备牌');
								'step 3'
								if (result.bool) {
									player.gain(result.cards, 'gain2');
								}
							},
							onuse: function (result, player) {
								player.storage.dcsaying.add(result.card.name);
							},
						}
					},
					prompt: function (links, player) {
						return '视为使用' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]);
					},
				},
				group: 'dcsaying_1',
				subSkill: {
					1: {
						trigger: { global: 'roundStart' },
						direct: true,
						charlotte: true,
						content: function () { player.storage.dcsaying = [] }
					}
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.storage.dcsaying || player.storage.dcsaying.length >= 4) return false;
						if (!player.storage.dcsaying.contains('tao')) { }
						else if (player.isDying() && !player.storage.dcsaying.contains('jiu')) { }
						else return false;
					},
					order: 8,
					result: {
						player: 1,
					},
					threaten: 1.2,
				},
			},
			dcjiaohao: {
				audio: 2,
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return game.hasPlayer(p => {
						return player.canCompare(p) && player.countCards('e') >= p.countCards('e')
					}) && player.countCards('h');
				},
				filterTarget: function (card, player, target) {
					return target != player && player.canCompare(target) && target.countCards('e') <= player.countCards('e');
				},
				content: function () {
					'step 0'
					player.chooseToCompare(target);
				},
				group: 'dcjiaohao_1',
				subSkill: {
					1: {
						trigger: {
							player: "chooseToCompareAfter",
						},
						direct: true,
						filter: function (event, player) {
							return event.compareName == 'dcjiaohao' && event.result && event.result.num1 != event.result.num2;
						},
						content: function () {
							'step 0'
							var p;
							if (trigger.result.bool) p = player;
							else p = trigger.target;
							event.p = p;
							player.chooseControl(['获得拼点牌', '使用一张【杀】', 'cancel2']).set('prompt2', ('令' + get.translation(p) + '执行一项'));
							'step 1'
							if (result.control == 'cancel2') event.finish();
							else {
								if (result.control == '获得拼点牌') {
									event.p.gain([trigger.result.player, trigger.result.target], 'gain2');
								}
								else event.p.chooseToUse('选择使用一张【杀】', function (card, player, event) {
									if (get.name(card) != 'sha') return false;
									return lib.filter.filterCard.apply(this, arguments);
								}).set('targetRequired', true).set('complexSelect', true);
							}
						}
					}
				},
				ai: {
					order: 9,
					result: {
						player: 2,
						target: -1,
					}
				}
			},
			dc_ruijun: {
				audio: 2,
				trigger: {
					player: "useCardToPlayered",
				},
				filter: function (event, player) {
					var evt = event.getParent('phaseUse');
					if (!evt || evt.player != player) return false;
					if (event.target == player) return false;
					if (player.getHistory('useCard', function (evtx) {
						return evtx.getParent('phaseUse') == evt && evtx != event.getParent() && evtx.targets && evtx.targets.length && evtx.targets.some(i => i != player);
					}, event.getParent()).length) return false;
					return true;

				},
				usable: 1,
				direct: true,
				content: function () {
					"step 0"
					player.chooseTarget(get.prompt('dc_ruijun'), '选择一名目标，本阶段获得对其伤害递加', function (card, player, target) {
						return _status.event.targets.contains(target);
					}).set('targets', trigger.targets);
					"step 1"
					if (result.bool && result.targets && result.targets.length) {
						var target = result.targets[0];
						player.logSkill('dc_ruijun', target);
						player.draw(player.getDamagedHp() + 1);
						player.addTempSkill('dc_ruijun_effect', { player: 'phaseUseAfter' });
						player.markAuto("dc_ruijun_effect", [target]);
						game.players.forEach(p => {
							if (p != player) p.addTempSkill('dc_ruijun_a', 'phaseEnd');
							if (p == target) p.storage.dc_ruijun_t = true;
						})
					}
				},
				subSkill: {
					effect: {
						trigger: {
							source: "damageBegin1",
						},
						charlotte: true,
						forced: true,
						mod: {
							targetInRange: function (card, player, target) {
								if (player.getStorage('dc_ruijun_effect').includes(target)) return true;
							},
						},
						onremove: true,
						filter: function (event, player) {
							var evt = event.getParent('phaseUse');
							if (!evt || evt.player != player) return false;
							return event.player.storage.dc_ruijun_t === true;
						},
						content: function () {
							var num = 1;
							player.getHistory("sourceDamage", evt => {
								if (evt.getParent('phaseUse') == trigger.getParent('phaseUse') && evt.source === player && evt.player === trigger.player) num += evt.num;
							});
							trigger.num = Math.min(5, num);
						},
					},
					a: {
						mod: {
							inRangeOf: function (from, to) {
								if (from.hasSkill('dc_ruijun')) {
									if (to.storage.dc_ruijun_t) return true;
									return false;
								};
							},
						},
						onremove: function (player) {
							if (player.storage.dc_ruijun_t) delete player.storage.dc_ruijun_t;
						}
					}
				},
			},
			dc_gangyi: {
				audio: 2,
				trigger: {
					player: "recoverBegin",
				},
				forced: true,
				filter(event, player) {
					const evt = event.getParent(3);
					if (!player.isDying() || evt.type !== "dying") return false;
					return ["tao", "jiu"].includes(event.getParent().name);
				},
				content: function () {
					trigger.num++;
				},
				mod: {
					cardEnabled: function (card, player) {
						if (!player.getHistory('sourceDamage').length && _status.currentPhase === player && card.name == 'tao') return false;
					},
					cardSavable: function (card, player) {
						if (!player.getHistory('sourceDamage').length && _status.currentPhase === player && card.name == 'tao') return false;
					},
				},
			},
			dcxhliangyan: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return game.hasPlayer(function (c) {
						return c != player;
					})
				},
				filterTarget: function (card, player, target) {
					return player != target;
				},
				content: function () {
					'step 0'
					player.chooseControl().set('prompt', '选择一项').set('choiceList', [
						'弃置2张牌', '弃置1张牌', '摸2张牌', '摸1张牌']).set('ai', () => {
							return 2
						});
					'step 1'
					switch (result.index) {
						case 0:
							event.c = 2;
							player.chooseToDiscard('弃置2张牌', 'he', 2, true);
							break;
						case 1:
							event.c = 1;
							player.chooseToDiscard('弃置1张牌', 'he', 1, true);
							break;
						case 2:
							event.c = -2;
							player.draw(2);
							break;
						case 3:
							event.c = -1;
							player.draw(1);
							break;
					}
					if (event.c > 0) target.draw(event.c);
					else target.chooseToDiscard(('弃置' + (-event.c) + '张牌'), -event.c, 'he', true);
					'step 2'
					if (player.countCards('h') == target.countCards('h')) {
						if (event.c > 0) {
							target.addSkill('dcxhliangyan_x');
						} else {
							player.addSkill('dcxhliangyan_x');
						}
					}
				},
				subSkill: {
					x: {
						direct: true,
						charlotte: true,
						mark: true,
						marktext: "梁燕",
						onremove: true,
						intro: {
							content: "跳过下个弃牌阶段",
						},
						trigger: {
							player: "phaseDiscardBefore",
						},
						content: function () {
							trigger.cancel();
							player.removeSkill('dcxhliangyan_x');
						},
						sub: true,
					},
				},
				ai: {
					order: 12,
					result: {
						player: 2,
						target: -2,
					},
				},
			},
			dcxhminghui: {
				audio: 2,
				trigger: {
					global: 'phaseEnd',
				},
				filter: function (event, player) {
					return (player.isMaxHandcard() && !game.hasPlayer(function (current) {
						return current.countCards('h') == 0;
					})) || player.isMinHandcard();
				},
				check: function (event, player) {
					return game.hasPlayer(p => get.attitude(player, p) > 0 && p.isDamaged()) || game.hasPlayer(p => p != player && get.attitude(player, p) < 0 && player.canUse('sha', p));
				},
				prompt: function (event, player) {
					var str1 = '';
					var str2 = '';
					if (player.isMaxHandcard() && !game.hasPlayer(function (current) {
						return current.countCards('h') == 0;
					})) {
						str1 += '你可将手牌弃至不为全场最多，然后令一名角色恢复一点体力。'
					}
					if (player.isMinHandcard()) {
						str2 += '你可视为使用一张无视距离的【杀】。'
					}
					return str1 + str2;
				},
				content: function () {
					'step 0'
					if (player.isMaxHandcard() && !game.hasPlayer(function (current) {
						return current.countCards('h') == 0;
					})) {
						player.storage.dcxhminghui1 = false;
					}
					if (player.isMinHandcard()) {
						player.storage.dcxhminghui2 = false;
					}
					if (player.storage.dcxhminghui1 == false && player.storage.dcxhminghui2 == false) {
						player.chooseControl().set('prompt', '选择要执行的效果').set('choiceList', [
							'弃置牌令一名角色回复体力', '视为使用一张无视距离的杀']).set('ai', () => {
								return [0, 1].randomGet();
							});
					} else {
						if (player.storage.dcxhminghui1 == false) {
							event.goto(2);
							player.storage.dcxhminghui2 = true;
						}
						if (player.storage.dcxhminghui2 == false) {
							player.storage.dcxhminghui1 = true;
							event.goto(5);
						}
					}
					'step 1'
					switch (result.index) {
						case 0:
							event.goto(2);
							break;
						case 1:
							event.goto(5);
							break;
					}
					'step 2'
					if (player.storage.dcxhminghui1 == false) {
						var num = 0;
						for (var i of game.players) {
							if (i.countCards('h') > num && i != player) num = i.countCards('h');
						}
						event.num = player.countCards('h') - num + 1;
						player.chooseToDiscard('是否发动【明慧】弃置至少' + event.num + '张手牌，然后令一名角色恢复一点体力', 'h', [event.num, player.countCards('h')]).set('ai', function (card) {
							if (game.hasPlayer(function (current) {
								return get.attitude(player, current) > 0 && get.recoverEffect(current, player, player) > 0 && current.isDamaged();
							})) {
								return 7 - ai.get.value(card);
							} else return false;
						});
						player.storage.dcxhminghui1 = true;
					} else {
						if (player.storage.dcxhminghui2 == false) event.goto(5);
					}
					'step 3'
					if (result.bool) {
						if (game.hasPlayer(play => play.isDamaged())) {
							player.chooseTarget('令一名角色回复1点体力', true, function (card, player, target) {
								return target.isDamaged();
							}).set('ai', function (target) {
								return get.attitude(player, target) && get.recoverEffect(target, player, player) > 0;
							});
						} else {
							if (player.storage.dcxhminghui2 == false) event.goto(5);
						}
					} else {
						if (player.storage.dcxhminghui2 == false) event.goto(5);
					}
					'step 4'
					if (result.bool) {
						result.targets[0].recover();
					}
					'step 5'
					if (player.storage.dcxhminghui2 == false) {
						player.chooseUseTarget('是否发动【明慧】视为使用一张无视距离的【杀】？', {
							name: 'sha'
						}, 'nodistance');
						player.storage.dcxhminghui2 = true;
						if (player.storage.dcxhminghui1 == false) event.goto(2);
					}
				},
			},
			dcxhxiaoyan: {
				audio: 2,
				trigger: {
					global: 'phaseBefore'
				},
				filter: function (event, player) {
					return game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				content: function () {
					'step 0'
					event.hit = player.next;
					'step 1'
					if (event.hit != player) {
						event.hit.damage('fire');
						game.delay(0.5);
						event.hit = event.hit.next;
						event.goto(1);
					}
					'step 2'
					event.current = player.next;
					'step 3'
					if (event.current != player) {
						event.current.chooseCard('he', '是否交给' + get.translation(player) + '一张牌并回复1点体力').set('ai', function (card) {
							var player = _status.event.player, yuanshao = _status.event.getParent().player;
							if (get.attitude(player, yuanshao) > 0 && player.isDamaged()) return get.value(card) - 2;
							else if (player.getDamagedHp() >= 2) return 6 - get.value(card);
							else return 0;
						});
					}
					else event.finish();
					'step 4'
					if (result.bool) {
						event.current.give(result.cards, player, 'giveAuto');
						event.current.recover();
					}
					event.current = event.current.next;
					event.goto(3);
				}
			},
			dcxhjiaowang: {
				audio: 2,
				forced: true,
				init: function (player) { player.storage.dcxhjiaowang = true },
				trigger: { global: 'roundFinish' },
				filter: function (event, player) {
					return player.storage.dcxhjiaowang;
				},
				content: function () {
					player.loseHp();
					var next = game.createEvent('dcxhjiaowang_xiaoyan')
					next.player = player;
					next.setContent(lib.skill.dcxhxiaoyan.content);
				},
				group: ['dcxhjiaowang_1', 'dcxhjiaowang_2'],
				subSkill: {
					1: {
						trigger: { global: 'die' },
						direct: true,
						charlotte: true,
						filter: function (event, player) {
							return player.storage.dcxhjiaowang;
						},
						content: function () {
							player.storage.dcxhjiaowang = false;
						}
					},
					2: {
						trigger: { global: 'roundStart' },
						direct: true,
						charlotte: true,
						filter: function (event, player) {
							return !player.storage.dcxhjiaowang;
						},
						content: function () {
							player.storage.dcxhjiaowang = true;
						}
					}
				}
			},
			dcxhzongshi: {
				audio: 2,
				enable: 'phaseUse',
				filter: function (event, player) {
					return player.countCards('h');
				},
				filterCard: function (card, player) {
					return player.countCards('h', { suit: get.suit(card) }) > 1 && game.hasPlayer(function (target) {
						return player.canUse(card, target, true);
					}) && (get.type(card) == 'basic' || get.type(card) == 'trick') && player.getCardUsable(card);
				},
				position: "h",
				discard: false,
				lose: false,
				delay: false,
				check: function (card) {
					return 15 - get.value(card)
				},
				prompt: "展示一张要使用的手牌",
				content: function () {
					'step 0'
					if (cards) {
						result.cards = cards[0];
					} else {
						player.chooseCard(get.prompt2('dcxhzongshi'), function (card) {
							return player.countCards('h', { suit: get.suit(card) }) > 1 && game.hasPlayer(function (target) {
								return player.canUse(card, target, true);
							}) && (get.type(card) == 'basic' || get.type(card) == 'trick') && player.getCardUsable(card);
						}).set('ai', function (card) {
							return 15 - get.value(card)
						});
					}
					'step 1'
					if (result.bool) {
						result.cards = result.cards[0];
					}
					if (result.cards) {
						player.showCards(result.cards);
						player.addTempSkill('dcxhzongshi_1', 'useCardAfter');
					} else {
						event.finish();
					}
					'step 2'
					var list = [];
					player.countCards('h', function (card) {
						if (get.suit(card) == get.suit(result.cards) && card != result.cards) list.add(card);
					})
					player.chooseUseTarget({ name: get.name(result.cards), nature: get.nature(result.cards) }, list, 'nodistance').set('addCount', true).forced = false;
					player.storage.dcxhzongshi = list.length;
				},
				subSkill: {
					1: {
						trigger: {
							player: 'useCardToTarget'
						},
						direct: true,
						init: function (player) {
							player.storage.dcxhzongshi = 0;
						},
						onremove: function (player) {
							delete player.storage.dcxhzongshi;
						},
						filter: function (event, player) {
							if (!event.targets || !event.targets.contains(event.target) || !event.isFirstTarget) return false;
							if (event.targets.length == 1 && player.storage.dcxhzongshi == 1) return false;
							var info = get.info(event.card);
							// return info.type == 'trick' || info.type == 'basic';
							// var info = get.info(event.card);
							if (info.allowMultiple == false) return false;
							if (event.targets && !info.multitarget) {
								if (game.hasPlayer(function (current) {
									return !event.targets.contains(current) && lib.filter.targetEnabled2(event.card, event.player, current);
								})) {
									return game.hasPlayer(function (current) {
										return !event.targets.contains(current) && lib.filter.targetEnabled2(event.card, event.player, current);
									});
								}
							}
							return true;
						},
						content: function () {
							'step 0'
							if (trigger.targets.length == 1) {
								var num = player.storage.dcxhzongshi - 1;
							} else {
								var num = player.storage.dcxhzongshi;
							}
							player.chooseTarget(get.prompt('dcxhzongshi'), '是否为' + get.translation(trigger.card) + '指定至多' + Math.max(1, num) + '个目标', [1, Math.max(1, num)], function (card, player, target) {
								var trigger = _status.event.getTrigger();
								if (trigger.targets.length == 1) {
									return !trigger.targets.contains(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
								} else {
									return trigger.targets.contains(target);
								}
							}).set('ai', function (target) {
								var player = _status.event.player;
								return get.effect(target, _status.event.card, player, player);
							}).set('card', trigger.card);
							'step 1'
							if (result.bool) {
								result.targets.forEach(function (current) {
									player.line(current);
								})
								if (trigger.targets.length == 1) {
									trigger.targets.addArray(result.targets);
								} else {
									trigger.targets.length = 0;
									trigger.targets.addArray(result.targets);
								}
							}
						}
					}
				}
			},
			dcxhaoshi: {
				audio: 2,
				zhuSkill: true,
				unique: true,
				global: 'dcxhaoshi_glob',
				subSkill: {
					glob: {
						enable: 'phaseUse',
						usable: 1,
						discard: false,
						lose: false,
						line: true,
						delay: false,
						filter: function (event, player) {
							return player.group == 'qun' && game.zhu && game.zhu != player && game.zhu.hasZhuSkill('dcxhaoshi') && player.countCards('h') > 0;
						},
						filterCard: true,
						selectCard: 1,
						position: 'h',
						check: function (card) {
							return 7 - get.value(card)
						},
						content: function () {
							'step 0'
							player.give(cards, game.zhu, 'giveAuto');
							game.zhu.logSkill('dcxhaoshi');
							'step 1'
							var next = game.createEvent('dcxhaoshi_zongshi');
							next.player = game.zhu;
							next.setContent(lib.skill.dcxhzongshi.content);
						},
						ai: {
							expose: 0.3,
							order: 10,
							result: {
								player: function (player, target) {
									if (get.attitude(player, game.zhu) > 0) return 0.5;
								},
								target: 3,
							},
						},
					}
				}
			},
			dccanxi: {
				audio: 2,
				trigger: {
					global: 'roundStart',
				},
				filter: function (event, player) {
					return player.storage.dccanxi_group;
				},
				forced: true,
				init: function (player) {
					player.storage.dccanxi_use = [];
				},
				content: function () {
					'step 0'
					player.storage.dccanxi_use = [];
					if (player.storage.dccanxi_group.length <= 0) {
						player.markAuto('dccanxi_use');
						event.finish();
					}
					player.chooseButton(['残玺', '请选择一项效果',
						[[
							['wangsheng', '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【妄生】</div><div>被选择势力角色每回合首次造成的伤害+1且计算与其他角色间的距离-1</div></div>'],
							['xiangsi', '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【向死】</div><div>其他被选择势力角色每回合首次回复体力后失去1点体力且每回合对你使用的第一张牌无效</div></div>']
						], 'textbutton']], true).set('selectButton', 1);
					'step 1'
					if (result.bool) {
						player.storage.dccanxi_use.add(result.links[0]);
						event.effect = result.links[0];
						player.chooseControl(player.storage.dccanxi_group).set('prompt', '请选择一个势力');
					}
					else event.finish();
					'step 2'
					if (result.control) {
						player.storage.dccanxi_use.add(result.control);
						console.log(player.storage.dccanxi_use);
						game.log(player, '号令', '#y' + player.storage.dccanxi_use[1], '势力角色进入', player.storage.dccanxi_use[0] == 'wangsheng' ? '#y妄生' : '#g向死', '状态');
						player.markAuto('dccanxi_use');
					}
				},
				group: ['dccanxi_start', 'dccanxi_wangsheng', 'dccanxi_xiangsi', 'dccanxi_use'],
				global: 'dccanxi_effect',
				subSkill: {
					use: {
						marktext: '玺',
						intro: {
							markcount: '',
							content: function (storage, player) {
								if (!storage || storage.length == 0) return '没有蜜水了！';
								var str = '号令：本轮' + get.translation(storage[1]) + '势力的';
								if (storage[0] == 'xiangsi') str += '其他';
								str += '角色';
								switch (storage[0]) {
									case 'wangsheng': str += '每回合首次造成的伤害+1，与其他角色距离-1。'; break;
									case 'xiangsi':
										str = str + '每回合首次回复体力后，失去1点体力；每回合对' + get.translation(player) + '使用的第一张牌无效。';
										break;
								}
								return str;
							},
						},
					},
					start: {
						trigger: {
							global: 'gameStart',
						},
						forced: true,
						priority: 1,
						filter: function (event, player) {
							return event.name != 'phase' || game.phaseNumber == 0;
						},
						content: function () {
							var group = [];
							for (var i = 0; i < game.players.length; i++) {
								if (!group.contains(game.players[i].group)) group.add(game.players[i].group);
							}
							game.log(player, '收集了', group, '势力的玉玺');
							if (!player.storage.dccanxi_group) player.storage.dccanxi_group = group;
							var num = 5 - group.length;
							player.gainMaxHp(num);
						},
					},
					wangsheng: {
						charlotte: true,
						trigger: { global: 'damageBegin1' },
						filter: function (event, player) {
							if (!player.storage.dccanxi_use || player.storage.dccanxi_use[0] != 'wangsheng') return false;
							return event.source && event.source.group == player.storage.dccanxi_use[1] && event.source.getHistory('sourceDamage').length == 0;
						},
						forced: true,
						logTarget: 'source',
						content: function () {
							trigger.num++;
						},
					},
					xiangsi: {
						charlotte: true,
						onremove: true,
						trigger: { global: 'recoverEnd' },
						filter: function (event, player) {
							if (!player.storage.dccanxi_use || player.storage.dccanxi_use[0] != 'xiangsi' || event.player.group != player.storage.dccanxi_use[1] || event.player == player) return false;
							return game.getGlobalHistory('changeHp', evt => evt.player == event.player).length == 1;
						},
						forced: true,
						logTarget: 'player',
						content: function () {
							trigger.player.loseHp();
						},
					},
					cancel: {
						charlotte: true,
						trigger: { global: 'useCard' },
						filter: function (event, player) {
							if (!event.targets || !event.targets.includes(player) || !player.storage.dccanxi_use || player.storage.dccanxi_use[0] != 'xiangsi' || event.player.group != player.storage.dccanxi_use[1] || event.player == player) return false;
							return event.player.getHistory('useCard', evt => evt.targets && evt.targets.includes(player)).indexOf(event) == 0;
						},
						forced: true,
						logTarget: 'player',
						content: function () {
							trigger.cancel();
						},
					},
					effect: {
						mod: {
							globalFrom: function (from, to, distance) {
								if (game.hasPlayer(target => { target.storage.dccanxi_use && target.storage.dccanxi_use[0] != 'wangsheng' && target.storage.dccanxi_use[1] == from.group })) return distance - 1;
							},
						},
					},
				},
			},
			dcpizhi: {
				audio: 2,
				trigger: {
					player: 'phaseEnd',
					global: 'die',
				},
				init: function (player) {
					player.storage.dcpizhi = 0;
				},
				filter: function (event, player) {
					if (!game.hasPlayer(current => current != event.player && current.group == event.player.group)) return true;
					return player.storage.dccanxi_group.length > 0 && player.storage.dccanxi_use;
				},
				forced: true,
				content: function () {
					'step 0'
					if (trigger.name == 'die' && trigger.player.group == player.storage.dccanxi_use[1]) {
						let index = player.storage.dccanxi_group.indexOf(trigger.player.group);
						if (index !== -1) {
							player.storage.dccanxi_group.splice(index, 1);
							player.storage.dcpizhi++;
							game.log('玉玺的一角破碎了');
						}
					}
					else if (trigger.name == 'die') {
						let index = player.storage.dccanxi_group.indexOf(trigger.player.group);
						if (index !== -1) {
							player.storage.dccanxi_group.splice(index, 1);
							player.storage.dcpizhi++;
							game.log('玉玺的一角破碎了');
						}
					}
					'step 1'
					player.draw(player.storage.dcpizhi);
					'step 2'
					if (player.isDamaged() && trigger.name == "die")
						player.recover();
				},
				intro: { content: '已失去#个“玺角”' },
			},
			dczhonggu: {
				unique: true,
				audio: 2,
				trigger: { player: 'phaseDrawBegin2' },
				filter: function (event, player) {
					return player.hasZhuSkill('dczhonggu');
				},
				forced: true,
				zhuSkill: true,
				content: function () {
					var num = (game.roundNumber >= game.countPlayer(current => current.group == 'qun') ? 2 : -1);
					trigger.num += num;
				},
			},
			dclifeng: {
				audio: 2,
				enable: 'chooseToUse',
				filter: function (event, player) {
					if (event.type == 'respondShan') return false;
					var list = [];
					game.players.forEach(function (current) {
						current.getHistory('useCard', function (evt) {
							if (!list.contains(get.color(evt.card))) list.push(get.color(evt.card));
						});
					})
					return list.length < 2;
				},
				hiddenCard: function () { return true },
				chooseButton: {
					dialog: function (event, player) {
						var list = [['基本', '', 'sha'], ['锦囊', '', 'wuxie']]
						return ui.create.dialog('砺锋', [list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								var list = [];
								game.players.forEach(function (current) {
									current.getHistory('useCard', function (evt) {
										if (!list.contains(get.color(evt.card))) list.push(get.color(evt.card));
									});
								})
								if (list.contains('red')) return get.color(card) == 'black';
								if (list.contains('black')) return get.color(card) == 'red';
								return true;
							},
							audio: 'dclifeng',
							selectCard: 1,
							popname: true,
							check: function (card) {
								return 6 - get.value(card);
							},
							position: 'h',
							viewAs: { name: links[0][2] },
							precontent: function () {
								event.getParent().addCount = false;
							},
						}
					},
					prompt: function (links, player) {
						return '将一张牌当做' + (get.translation(links[0][2])) + '使用';
					},
					check: function (card) { return 8 - get.value(card) },
				},
				mod: {
					aiValue: function (player, card, num) {
						if (card.name != 'sha') return;
						var geti = function () {
							var cards = player.getCards('he', function (card) {
								return card.name == 'sha';
							});
							if (cards.contains(card)) {
								return cards.indexOf(card);
							}
							return cards.length;
						};
						return Math.max(num, [7, 5, 5, 3][Math.min(geti(), 3)]);
					},
					aiUseful: function () {
						return lib.skill.dclifeng.mod.aiValue.apply(this, arguments);
					},
				},
				ai: {
					presha: true,
				},
			},
			dcsujun: {
				audio: 2,
				trigger: { player: 'useCard' },
				filter: function (event, player) {
					return player.countCards('h', { type: 'basic' }) * 2 == player.countCards('h');
				},
				content: function () {
					player.draw(2);
				},
				mod: {
					aiOrder: function (player, card, num) {
						if (player.countCards('h', {
							type: 'basic'
						}) * 2 > player.countCards('h')) {
							if (get.type(card) == 'basic') return num + 10;
						} else {
							if (get.type(card) == 'basic') return num - 10;
						}
					},
				},
			},
			xinyingshi: {
				audio: 'xinfu_yingshi',
				trigger: { player: 'phaseUseBegin' },
				direct: true,
				filter: function (event, player) {
					return player.countCards('he') > 0 && !game.hasPlayer(function (current) {
						return current.getExpansions('xinyingshi_cards').length > 0;
					});
				},
				content: function () {
					'step 0'
					player.chooseCardTarget({
						filterCard: true,
						filterTarget: lib.filter.notMe,
						selectCard: [1, player.countCards('he')],
						position: 'he',
						prompt: get.prompt('xinyingshi'),
						prompt2: '将任意张牌置于一名其他角色的武将牌上作为“酬”',
						ai1: function (card) {
							return 1 - player.getUseValue(card);
						},
						ai2: function (target) {
							var player = _status.event.player;
							return (1 + game.countPlayer(function (current) {
								return get.attitude(player, current) > 0 && current.inRange(target) && get.damageEffect(target, current, player) > 0;
							})) * -get.attitude(player, target);
						},
					});
					'step 1'
					if (result.bool) {
						var target = result.targets[0], cards = result.cards;
						player.logSkill('xinyingshi', target);
						target.addSkill('xinyingshi_cards');
						target.addToExpansion(player, 'give', cards).gaintag.add('xinyingshi_cards');
						target.storage.xinyingshi_source = player;
					}
				},
				subSkill: {
					cards: {
						trigger: { player: 'damageSource' },
						forced: true,
						charlotte: true,
						filter: function (event, player) {
							return event.source && event.source.isIn() && event.card && event.getParent().type == 'card' &&
								player.getExpansions('xinyingshi_cards').length;
						},
						logTarget: 'source',
						content: function () {
							'step 0'
							event.target = trigger.source;
							event.target.chooseButton(['应势：请选择你的赏金', player.getExpansions('xinyingshi_cards')]);
							'step 1'
							if (result.bool) {
								var cards = [result.links[0]];
								for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
									var card = ui.cardPile.childNodes[i];
									if (card.number == cards[0].number && card.suit == cards[0].suit) cards.push(card);
								}
								player.$give(cards[0], target);
								if (cards.length > 1) {
									setTimeout(function () {
										target.$gain2(cards.slice(1));
									}, get.delayx(200, 200));
									game.log(target, '从牌堆获得了', cards.slice(1))
								}
								game.delay(0, get.delayx(500, 500));
								target.gain(cards);
							}
							'step 2'
							if (!player.getExpansions('xinyingshi_cards').length) player.removeSkill('xinyingshi_cards');
						},
						marktext: '酬',
						intro: {
							content: 'expansion',
							markcount: 'expansion',
						},
						ai: { threaten: 3 },
						group: 'xinyingshi_regain',
						onremove: function (player, skill) {
							var cards = player.getExpansions(skill);
							if (cards.length) player.loseToDiscardpile(cards);
							delete player.storage.xinyingshi_source;
						},
					},
					regain: {
						trigger: { player: 'die' },
						forced: true,
						charlotte: true,
						forceDie: true,
						filter: function (event, player) {
							return player.storage.xinyingshi_source && player.storage.xinyingshi_source.isIn() && player.getExpansions('xinyingshi_cards').length > 0;
						},
						content: function () {
							player.storage.xinyingshi_source.gain(player.getExpansions('xinyingshi_cards'), player, 'give', 'bySelf');
						},
					},
				},
			},
			xinfu_guolun: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				filterTarget: function (card, player, target) {
					return target != player && target.countCards('h') > 0;
				},
				content: function () {
					'step 0'
					player.choosePlayerCard(target, true, 'h');
					'step 1'
					event.cardt = result.cards[0];
					target.showCards(event.cardt);
					player.chooseCard('he').set('ai', function (card) {
						var event = _status.event.getParent(), player = event.player;
						var numt = get.number(event.cardt);
						var att = get.attitude(player, target);
						var value = get.value(event.cardt);
						var num = get.number(card);
						if (num < numt || att > 2) return value + 6 - get.value(card);
						else if (num == numt) return value - get.value(card);
						return -1;
					});
					'step 2'
					if (!result.bool) event.finish();
					else {
						player.showCards(result.cards);
						event.cardp = result.cards[0];
					}
					'step 3'
					player.swapHandcards(target, [event.cardp], [event.cardt]);
					'step 4'
					var nump = get.number(event.cardp, player);
					var numt = get.number(event.cardt, target);
					if (nump < numt) {
						player.draw();
					}
					else if (nump > numt) {
						target.draw();
					}
				},
				ai: {
					threaten: 1.5,
					order: 8,
					result: {
						player: function (player, target) {
							if (get.attitude(player, target) > 0) return 1.5;
							return 0.5;
						},
					},
				},
			},
			"xinfu_zhanji": {
				audio: 2,
				trigger: {
					player: "gainAfter",
				},
				forced: true,
				filter: function (event, player) {
					if (!player.isPhaseUsing()) return false;
					return event.getParent().name == 'draw' && event.getParent(2).name != 'xinfu_zhanji';
				},
				content: function () {
					player.draw('nodelay');
				},
			},
			"xinfu_songsang": {
				limited: true,
				skillAnimation: true,
				animationColor: 'wood',
				audio: 2,
				derivation: "xinfu_zhanji",
				trigger: { global: "dieAfter" },
				logTarget: 'player',
				content: function () {
					player.awakenSkill('xinfu_songsang');
					if (player.isDamaged()) {
						player.recover();
					}
					else player.gainMaxHp();
					player.addSkill('xinfu_zhanji');
				},
			},
			"xinfu_jixu": {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					if (ui.selected.targets.length) {
						return target.hp == ui.selected.targets[0].hp;
					}
					return true;
				},
				selectTarget: [1, Infinity],
				multitarget: true,
				multiline: true,
				content: function () {
					"step 0"
					targets.sort(lib.sort.seat);
					"step 1"
					if (!event.num) event.num = 0;
					if (!event.caicuolist) event.caicuolist = [];
					targets[event.num].chooseBool("是否押杀？").ai = function (event, player) {
						var evt = _status.event.getParent();
						if (get.attitude(targets[event.num], evt.player) > 0) return evt.player.countCards('h', 'sha') ? false : true;
						return Math.random() < 0.5;
					};
					"step 2"
					if (result.bool) {
						targets[event.num].chat('有杀');
						game.log(targets[event.num], '认为', player, '#g有杀');
						if (!player.countCards('h', 'sha')) event.caicuolist.add(targets[event.num]);
					} else {
						targets[event.num].chat('没杀');
						game.log(targets[event.num], '认为', player, '#y没有杀');
						if (player.countCards('h', 'sha')) event.caicuolist.add(targets[event.num]);
					}
					event.num++;
					game.delay();
					if (event.num < targets.length) event.goto(1);
					"step 3"
					player.popup(player.countCards('h', 'sha') ? "有杀" : "没杀");
					game.log(player, player.countCards('h', 'sha') ? "有杀" : "没杀");
					if (event.caicuolist.length == 0) {
						var evt = _status.event.getParent('phaseUse');
						if (evt && evt.name == 'phaseUse') {
							evt.skipped = true;
							event.finish();
						}
					}
					else {
						player.draw(event.caicuolist.length)
						if (player.countCards('h', 'sha')) {
							player.addTempSkill('jixu_sha');
							player.storage.jixu_sha = event.caicuolist;
							event.finish();
						}
						else event.num = 0;
					}
					"step 4"
					if (event.num < event.caicuolist.length) {
						var target = event.caicuolist[event.num];
						player.discardPlayerCard(true, 'he', target);
						event.num++;
						event.redo();
					}
				},
				ai: {
					order: function () {
						return get.order({ name: 'sha' }) + 0.1;
					},
					result: {
						target: function (player, target) {
							var raweffect = function (player, target) {
								if (player.countCards('h', 'sha')) {
									return get.effect(target, { name: 'sha' }, player, target);
								}
								else {
									var att = get.attitude(player, target);
									var nh = target.countCards('h');
									if (att > 0) {
										if (target.getEquip('baiyin') && target.isDamaged() &&
											get.recoverEffect(target, player, player) > 0) {
											if (target.hp == 1 && !target.hujia) return 1.6;
											if (target.hp == 2) return 0.01;
											return 0;
										}
									}
									var es = target.getCards('e');
									var noe = (es.length == 0 || target.hasSkillTag('noe'));
									var noe2 = (es.length == 1 && es[0].name == 'baiyin' && target.isDamaged());
									var noh = (nh == 0 || target.hasSkillTag('noh'));
									if (noh && (noe || noe2)) return 0;
									if (att <= 0 && !target.countCards('he')) return 1.5;
									return -1.5;
								}
							}
							var num = game.countPlayer(function (current) {
								return current != player && current.hp == target.hp && (raweffect(player, current) * get.attitude(player, current)) > 0
							});
							return raweffect(player, target) * Math.max(0, num - 1);
						},
					},
					expose: 0.4,
				},
			},
			"jixu_sha": {
				audio: "xinfu_jixu",
				trigger: {
					player: "useCard",
				},
				onremove: function (player) {
					delete player.storage.jixu_sha;
				},
				filter: function (event, player) {
					if (event.card.name == 'sha') {
						return game.hasPlayer(function (current) {
							return current != player && player.storage.jixu_sha.contains(current) && !event.targets.contains(current);
						});
					}
					return false;
				},
				forced: true,
				silent: true,
				popup: false,
				content: function () {
					player.logSkill("xinfu_jixu");
					for (var i = 0; i < player.storage.jixu_sha.length; i++) {
						if (!trigger.targets.contains(player.storage.jixu_sha[i]) && player.canUse('sha', player.storage.jixu_sha[i], false)) {
							player.line(player.storage.jixu_sha[i], trigger.card.nature);
							trigger.targets.push(player.storage.jixu_sha[i]);
						}
					}
				},
			},
			xinfu_sanwen: {
				audio: 2,
				usable: 1,
				trigger: {
					player: "gainAfter",
					global: 'loseAsyncAfter',
				},
				filter: function (event, player) {
					var cards = event.getg(player);
					if (!cards || !cards.length) return false;
					var namelist = [];
					var namedlist = [];
					for (var i = 0; i < cards.length; i++) {
						namelist.add(get.name(cards[i]));
					}
					var hs = player.getCards('h');
					for (var j = 0; j < hs.length; j++) {
						if (namelist.contains(get.name(hs[j])) && !cards.contains(hs[j])) return true;
					}
					return false;
				},
				content: function () {
					'step 0'
					var namelist = [];
					var namedlist = [];
					var nameddlist = [];
					var namedddlist = [];
					var cards = trigger.getg(player)
					for (var i = 0; i < cards.length; i++) {
						namelist.add(get.name(cards[i]));
					}
					var hs = player.getCards('h');
					for (var j = 0; j < hs.length; j++) {
						if (namelist.contains(get.name(hs[j])) && !cards.contains(hs[j])) {
							namedlist.push(hs[j]);
							namedddlist.add(get.name(hs[j]));
						}
					}
					for (var k = 0; k < cards.length; k++) {
						if (namedddlist.contains(get.name(cards[k]))) nameddlist.push(cards[k]);
					}
					var showlist = namedlist.concat(nameddlist);
					player.showCards(showlist);
					player.discard(nameddlist);
					player.draw(2 * nameddlist.length);
				},
			},
			"xinfu_qiai": {
				skillAnimation: true,
				animationColor: 'gray',
				trigger: { player: "dying" },
				limited: true,
				audio: 2,
				content: function () {
					"step 0"
					player.awakenSkill('xinfu_qiai');
					event.targets = game.filterPlayer(function (current) {
						return current != player;
					}).sortBySeat();
					if (!event.targets.length) event.finish();
					"step 1"
					event.current = event.targets.shift();
					if (!event.current.countCards('he')) event.goto(3);
					else event.current.chooseCard('交给' + get.translation(player) + '一张牌', 'he', true).set('ai', function (card) {
						var evt = _status.event.getParent();
						if (get.attitude(_status.event.player, evt.player) > 2) {
							if (card.name == 'jiu') return 120;
							if (card.name == 'tao') return 110;
						}
						return 100 - get.value(card);
					});
					"step 2"
					if (result.bool && result.cards && result.cards.length) {
						event.current.give(result.cards, player);
					}
					"step 3"
					if (event.targets.length > 0) event.goto(1);
				},
			},
			"xinfu_denglou": {
				audio: 2,
				trigger: {
					player: "phaseJieshuBegin",
				},
				limited: true,
				filter: function (event, player) {
					return player.countCards('h') == 0;
				},
				skillAnimation: true,
				animationColor: 'gray',
				marktext: "登",
				content: function () {
					"step 0"
					player.awakenSkill('xinfu_denglou');
					event.cards = get.cards(4);
					event.gains = []
					event.discards = []
					var content = ['牌堆顶的四张牌', event.cards];
					game.log(player, '观看了', '#y牌堆顶的四张牌');
					player.chooseControl('ok').set('dialog', content);
					"step 1"
					if (get.type(event.cards[0]) != "basic") {
						event.gains.push(event.cards[0]);
						event.cards.remove(event.cards[0]);
					}
					else {
						var bool = game.hasPlayer(function (current) {
							return player.canUse(event.cards[0], current);
						});
						if (bool) {
							player.chooseUseTarget(event.cards[0], true, false);
						}
						else event.discards.push(event.cards[0]);
						event.cards.remove(event.cards[0]);
					}
					"step 2"
					if (event.cards.length) event.goto(1);
					else {
						if (event.gains.length) player.gain(event.gains, 'gain2');
						if (event.discards.length) {
							player.$throw(event.discards);
							game.cardsDiscard(event.discards);
						}
					}
				},
			},
			qinguo_use: { audio: 2 },
			"xinfu_qinguo": {
				group: "xinfu_qinguo_recover",
				audio: 'qinguo_use',
				subfrequent: ['recover'],
				trigger: {
					player: "useCardEnd",
				},
				filter: function (event, player) {
					return get.type(event.card) == 'equip';
				},
				direct: true,
				content: function () {
					player.chooseUseTarget({ name: 'sha' }, get.prompt('xinfu_qinguo'), '视为使用一张【杀】', false).logSkill = 'xinfu_qinguo';
				},
				subSkill: {
					recover: {
						audio: 'qinguo_use',
						trigger: {
							player: 'loseAfter',
							global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
						},
						prompt: '是否发动【勤国】回复1点体力？',
						filter: function (event, player) {
							if (player.isHealthy() || player.countCards('e') != player.hp) return false;
							var evt = event.getl(player);
							if (event.name == 'equip' && event.player == player) return !evt || evt.cards.length != 1;
							return evt && evt.es.length;
						},
						frequent: true,
						content: function () {
							player.recover();
						},
					},
				},
			},
			xinfu_jijun: {
				ai: {
					reverseEquip: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.type(card) == 'equip' && player == target && player == _status.currentPhase && get.subtype(card) == 'equip1') return [1, 3];
						},
					},
				},
				audio: 2,
				trigger: {
					player: "useCardToPlayered",
				},
				frequent: true,
				filter: function (event, player) {
					if (player != _status.currentPhase) return false;
					if (event.getParent().triggeredTargets3.length > 1) return false;
					if (get.type(event.card) == 'equip' && get.subtype(event.card) != 'equip1') return false;
					if (event.targets.contains(player)) return true;
					return false;
				},
				callback: function () {
					player.addToExpansion(card, 'gain2').gaintag.add('xinfu_jijun');
				},
				content: function () {
					player.judge(function (card) {
						return 1;
					}).callback = lib.skill.xinfu_jijun.callback;
				},
				onremove: function (player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				intro: {
					content: 'expansion',
					markcount: 'expansion',
					mark: function (dialog, content, player) {
						var content = player.getExpansions('xinfu_jijun');
						if (content && content.length) {
							dialog.addAuto(content);
							if (player == game.me || player.isUnderControl()) {
								var list = lib.skill.xinfu_fangtong.getAuto(player);
								if (list.length > 0) {
									dialog.addText('<li>推荐方案：' + get.translation(list[0]) + '+ ' + get.translation(list.slice(1)));
								}
							}
						}
					},
				},
				marktext: "方",
			},
			xinfu_fangtong: {
				getAuto: function (player) {
					var hs = player.getCards('he');
					var ss = player.getExpansions('xinfu_jijun');
					var bool = false, max = Math.pow(2, ss.length), index, i;
					for (i = 0; i < hs.length; i++) {
						for (var j = 1; j < max; j++) {
							var num = get.number(hs[i]);
							index = j.toString(2);
							while (index.length < ss.length) {
								index = ('0' + index);
							}
							for (var k = 0; k < ss.length; k++) {
								if (index[k] == '1') num += get.number(ss[k]);
							}
							if (num == 36) {
								bool = true;
								break;
							}
						}
						if (bool) break;
					}
					if (!bool) return [];
					var list = [hs[i]];
					for (var k = 0; k < ss.length; k++) {
						if (index[k] == '1') list.push(ss[k]);
					}
					return list;
				},
				audio: 2,
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter: function (event, player) {
					return player.countCards('he') > 0 && player.getExpansions('xinfu_jijun').length > 0;
				},
				direct: true,
				skillAnimation: true,
				animationColor: 'metal',
				content: function () {
					'step 0'
					var info = ['是否发动【方统】？'];
					info.push('<div class="text center">' + get.translation(player) + '的“方”</div>');
					info.push(player.getExpansions('xinfu_jijun'));
					if (player.countCards('h')) {
						info.push('<div class="text center">' + get.translation(player) + '的手牌区</div>');
						info.push(player.getCards('h'));
					}
					if (player.countCards('e')) {
						info.push('<div class="text center">' + get.translation(player) + '的装备区</div>');
						info.push(player.getCards('e'));
					}
					var next = player.chooseButton();
					next.set('createDialog', info);
					next.set('selectButton', function () {
						var num = 0;
						for (var i = 0; i < ui.selected.buttons.length; i++) {
							num += get.number(ui.selected.buttons[i]);
						}
						if (num == 36) return ui.selected.buttons.length;
						return ui.selected.buttons.length + 2;
					});
					next.set('filterButton', function (button) {
						var player = _status.event.player, cards = player.getExpansions('xinfu_jijun');
						if (ui.selected.buttons.length) {
							if (!cards.contains(button.link)) return false;
						}
						else if (cards.contains(button.link)) return false;
						var num = 0;
						for (var i = 0; i < ui.selected.buttons.length; i++) {
							num += get.number(ui.selected.buttons[i]);
						}
						return get.number(button.link) + num <= 36;
					});
					next.set('autolist', lib.skill.xinfu_fangtong.getAuto(player));
					next.set('processAI', function () {
						if (_status.event.autolist && _status.event.autolist.length > 0) {
							return {
								bool: true,
								links: _status.event.autolist,
							}
						}
						return { bool: false };
					});
					next.set('complexSelect', true);
					'step 1'
					if (result.bool) {
						player.logSkill('xinfu_fangtong');
						var tothrow = [];
						var cards = result.links.slice(0);
						for (var i = 0; i < cards.length; i++) {
							if (get.position(cards[i]) == 'x') {
								tothrow.push(cards[i]);
							}
							else {
								player.discard(cards[i]).delay = false;
							}
						}
						player.loseToDiscardpile(tothrow);
						player.chooseTarget('选择一个目标并对其造成3点雷电伤害', true, function (card, player, target) {
							return target != player;
						}).set('ai', function (target) {
							return get.damageEffect(target, _status.event.player, _status.event.player, 'thunder');
						});
					}
					else {
						event.finish();
					}
					'step 2'
					var target = result.targets[0];
					player.line(target, 'thunder');
					target.damage(3, 'thunder');
				},
			},
			xinfu_weilu: {
				audio: 2,
				trigger: {
					player: "damageEnd",
				},
				filter: function (event, player) {
					return event.source && event.source.isIn() && !player.getStorage('xinfu_weilu_effect').contains(event.source)
				},
				check: function (event, player) {
					return (get.effect(target, { name: 'losehp' }, player, player) >= 0);
				},
				forced: true,
				logTarget: "source",
				content: function () {
					player.addTempSkill('xinfu_weilu_effect', { player: 'die' });
					player.markAuto('xinfu_weilu_effect', [trigger.source]);
					game.delayx();
				},
				ai: {
					maixie_defend: true,
					threaten: 0.85,
					effect: {
						target: function (card, player, target) {
							if (player.hasSkillTag('jueqing', false, target)) return;
							return 0.9;
						},
					},
				},
				subSkill: {
					effect: {
						audio: 'xinfu_weilu',
						trigger: { player: 'phaseUseBegin' },
						charlotte: true,
						forced: true,
						logTarget: function (event, player) {
							return player.getStorage('xinfu_weilu_effect').filter(function (current) {
								return current.isIn() && current.hp > 1;
							});
						},
						content: function () {
							'step 0'
							var targets = player.getStorage('xinfu_weilu_effect');
							player.removeSkill('xinfu_weilu_effect');
							event.targets = targets.sortBySeat();
							'step 1'
							var target = targets.shift();
							if (target.isIn() && target.hp > 1) {
								event._delay = true;
								var num = target.hp - 1;
								player.markAuto('xinfu_weilu_recover', [[target, num]]);
								target.loseHp(num);
							}
							if (targets.length > 0) event.redo();
							else if (!event._delay) event.finish();
							'step 2'
							player.addTempSkill('xinfu_weilu_recover', { player: ['phaseUseAfter', 'phaseAfter'] });
							game.delayx();
						},
						onremove: true,
						intro: { content: '已将$列入“威虏”战略打击目标' },
					},
					recover: {
						audio: 'xinfu_weilu',
						charlotte: true,
						trigger: { player: 'phaseUseEnd' },
						forced: true,
						filter: function (event, player) {
							var targets = player.getStorage('xinfu_weilu_recover');
							for (var i of targets) {
								if (i[0].isIn() && i[0].isDamaged()) return true;
							}
							return false;
						},
						onremove: true,
						logTarget: function (event, player) {
							var logs = [], targets = player.getStorage('xinfu_weilu_recover');
							for (var i of targets) {
								if (i[0].isIn() && i[0].isDamaged()) logs.add(i[0]);
							}
							return logs;
						},
						content: function () {
							'step 0'
							event.list = player.getStorage('xinfu_weilu_recover').slice(0);
							event.list.sort(function (a, b) {
								return lib.sort.seat(a[0], b[0]);
							});
							'step 1'
							var group = event.list.shift();
							if (group[0].isIn() && group[0].isDamaged()) {
								group[0].recover(group[1]);
								event._delay = true;
							}
							if (event.list.length > 0) event.redo();
							else if (!event._delay) event.finish();
							'step 2'
							game.delayx();
						},
					},
				},
			},
			xinfu_zengdao: {
				audio: 2,
				limited: true,
				enable: "phaseUse",
				filter: function (event, player) {
					;
					return player.countCards('e') > 0;
				},
				filterTarget: lib.filter.notMe,
				skillAnimation: true,
				animationColor: 'thunder',
				position: "e",
				filterCard: true,
				selectCard: [1, Infinity],
				discard: false,
				lose: false,
				content: function () {
					player.awakenSkill('xinfu_zengdao');
					target.addToExpansion(cards, player, 'give').gaintag.add('xinfu_zengdao2');
					target.addSkill('xinfu_zengdao2');
				},
			},
			xinfu_zengdao2: {
				trigger: { source: 'damageBegin1' },
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return player.getExpansions('xinfu_zengdao2').length > 0;
				},
				content: function () {
					'step 0'
					player.chooseCardButton('将一张“刀”置入弃牌堆', player.getExpansions('xinfu_zengdao2'), true);
					'step 1'
					if (result.bool) {
						trigger.num++;
						player.loseToDiscardpile(result.links);
					}
				},
				marktext: "刀",
				intro: {
					content: 'expansion',
					markcount: 'expansion',
					onunmark: function (storage, player) {
						player.removeSkill('xinfu_zengdao2');
					},
				},
			},
			xinfu_guanwei: {
				audio: 2,
				usable: 1,
				trigger: {
					global: "phaseUseEnd",
				},
				filter: function (event, player) {
					var history = event.player.getHistory('useCard');
					var num = 0;
					var suit = false;
					for (var i = 0; i < history.length; i++) {
						var suit2 = get.suit(history[i].card);
						if (!lib.suit.contains(suit2)) return false;
						if (suit && suit != suit2) return false;
						suit = suit2;
						num++;
					}
					return num > 1;
				},
				direct: true,
				global: 'xinfu_guanwei_ai',
				content: function () {
					'step 0'
					var target = trigger.player;
					player.chooseToDiscard('he', get.prompt('xinfu_guanwei', trigger.player), '弃置一张牌，令其摸两张牌并进行一个额外的出牌阶段。').set('ai', function (card) {
						if (get.attitude(_status.event.player, _status.event.targetx) < 1) return 0;
						return 9 - get.value(card);
					}).set('logSkill', ['xinfu_guanwei', target]).set('targetx', target);
					'step 1'
					if (result.bool) {
						player.line(trigger.player, 'green');
						trigger.player.draw(2);
					}
					else {
						player.storage.counttrigger.xinfu_guanwei--;
						event.finish();
					}
					'step 2'
					var next = trigger.player.phaseUse();
					event.next.remove(next);
					trigger.getParent('phase').next.push(next);
				},
				ai: {
					expose: 0.5,
				},
				subSkill: {
					ai: {
						ai: {
							effect: {
								player_use: function (card, player, target) {
									if (typeof card != 'object' || !player.isPhaseUsing()) return;
									var hasPanjun = game.hasPlayer(function (current) {
										return current.hasSkill('xinfu_guanwei') && (!current.storage.counttrigger || !current.storage.counttrigger.xinfu_guanwei) &&
											get.attitude(current, player) >= 1 && current.hasCard(function (card) {
												return get.value(card) < 7 || (current != game.me && !current.isUnderControl() && !current.isOnline()) && get.value(card) < 9;
											}, 'he');
									});
									if (!hasPanjun) return;
									var suitx = get.suit(card);
									var history = player.getHistory('useCard');
									if (!history.length) {
										var val = 0;
										if (player.hasCard(function (cardx) {
											return get.suit(cardx) == suitx && card != cardx && (!card.cards || !card.cards.contains(cardx)) && player.hasValueTarget(cardx);
										}, 'hs')) val = [2, 0.1];
										if (val) return val;
										return;
									}
									var num = 0;
									var suit = false;
									for (var i = 0; i < history.length; i++) {
										var suit2 = get.suit(history[i].card);
										if (!lib.suit.contains(suit2)) return;
										if (suit && suit != suit2) return;
										suit = suit2;
										num++;
									}
									if (suitx == suit && num == 1) return [1, 0.1];
									if (suitx != suit && (num > 1 || num <= 1 && player.hasCard(function (cardx) {
										return get.suit(cardx) == suit && player.hasValueTarget(cardx);
									}, 'hs'))) return 'zeroplayertarget';
								},
							},
						},
					}
				},
			},
			xinfu_gongqing_gz_panjun: { audio: 2 },
			"xinfu_gongqing": {
				audio: 2,
				audioname2: { gz_panjun: 'xinfu_gongqing_gz_panjun' },
				trigger: {
					player: ["damageBegin3", "damageBegin4"],
				},
				forced: true,
				filter: function (event, player, name) {
					if (!event.source) return false;
					var range = event.source.getAttackRange();
					if (name == 'damageBegin3') return range > 3;
					return event.num > 1 && range < 3;
				},
				preHidden: true,
				content: function () {
					trigger.num = event.triggername == 'damageBegin4' ? 1 : trigger.num + 1;
				},
				ai: {
					filterDamage: true,
					skillTagFilter: function (player, tag, arg) {
						if (arg && arg.player) {
							if (arg.player.hasSkillTag('jueqing', false, player)) return false;
							if (arg.player.getAttackRange() < 3) return true;
						}
						return false;
					}
				},
			},
			"xinfu_andong": {
				subSkill: {
					add: {
						sub: true,
						mod: {
							ignoredHandcard: function (card, player) {
								if (get.suit(card) == 'heart') {
									return true;
								}
							},
							cardDiscardable: function (card, player, name) {
								if (name == 'phaseDiscard' && get.suit(card) == 'heart') return false;
							},
						},
					},
				},
				audio: 2,
				trigger: {
					player: "damageBegin4",
				},
				filter: function (event, player) {
					return get.itemtype(event.source) == 'player';
				},
				logTarget: "source",
				content: function () {
					"step 0"
					if (!trigger.source.countCards('h')) event._result = { index: 1 };
					else trigger.source.chooseControlList(
						['令' + get.translation(player) + '观看你的手牌，并获得其中所有的红桃牌。',
						'防止即将对' + get.translation(player) + '造成的伤害，并使自己本回合内的红桃手牌不计入手牌上限。'],
						true).set('ai', function (event, player) {
							var target = _status.event.getParent().player;
							var player = _status.event.player;
							if (get.attitude(player, target) > 0) return 1;
							return 0;
						});
					"step 1"
					if (result.index == 1) {
						trigger.cancel();
						trigger.source.addTempSkill('xinfu_andong_add');
						event.finish();
					} else {
						player.viewHandcards(trigger.source);
					}
					"step 2"
					var cards = trigger.source.getCards('h');
					var togain = []
					for (var i = 0; i < cards.length; i++) {
						if (get.suit(cards[i]) == 'heart') togain.push(cards[i]);
					}
					if (togain.length) player.gain(togain, trigger.source, 'giveAuto', 'bySelf');
				},
			},
			xinfu_yingshi: {
				audio: 2,
				group: ["yingshi_die"],
				trigger: {
					player: "phaseUseBegin",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards('he', { suit: 'heart' }) > 0 && !game.hasPlayer(function (current) {
						return current.hasSkill('yingshi_heart');
					});
				},
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt2('xinfu_yingshi'), function (card, player, target) {
						return target != player;
					}).set('ai', function () {
						return -1;
					});
					'step 1'
					if (result.bool) {
						var cards = player.getCards('he', { suit: 'heart' });
						var target = result.targets[0];
						player.logSkill('xinfu_yingshi', target);
						target.addSkill('yingshi_heart');
						target.addToExpansion(cards, player, 'give').gaintag.add('xinfu_yingshi');
					}
				},
				marktext: '酬',
				intro: {
					markcount: 'expansion',
					content: 'expansion',
					onunmark: function (storage, player) {
						player.removeSkill('yingshi_heart');
					},
				}
			},
			yingshi_heart: {
				charlotte: true,
				trigger: { player: 'damageEnd' },
				filter: function (event, player) {
					return event.source && event.source.isIn()
						&& event.card && event.card.name == 'sha'
						&& player.getExpansions('xinfu_yingshi').length > 0;
				},
				forced: true,
				logTarget: 'source',
				content: function () {
					'step 0'
					trigger.source.chooseCardButton('应势：选择获得一张“酬”', player.getExpansions('xinfu_yingshi'), true);
					'step 1'
					if (result.bool) {
						trigger.source.gain(result.links, player, 'give');
					}
				},
			},
			yingshi_die: {
				audio: 'xinfu_yingshi',
				forced: true,
				trigger: { global: 'die' },
				logTarget: 'player',
				filter: function (event, player) {
					return event.player.getExpansions('xinfu_yingshi').length > 0;
				},
				content: function () {
					var target = trigger.player;
					player.gain(target.getExpansions('xinfu_yingshi'), target, 'give', 'bySelf');
				},
			},
			"xinfu_duanfa": {
				init: function (player) {
					player.storage.xinfu_duanfa = 0;
				},
				audio: 2,
				enable: "phaseUse",
				position: "he",
				filter: function (card, player) {
					return player.storage.xinfu_duanfa < player.maxHp;
				},
				filterCard: function (card) {
					return get.color(card) == 'black';
				},
				selectCard: function () {
					var player = _status.event.player;
					return [1, player.maxHp - player.storage.xinfu_duanfa];
				},
				check: function (card) {
					return 6 - get.value(card)
				},
				delay: false,
				content: function () {
					player.draw(cards.length);
					player.storage.xinfu_duanfa += cards.length;
				},
				group: "xinfu_duanfa_clear",
				subSkill: {
					clear: {
						trigger: {
							player: "phaseBefore",
						},
						forced: true,
						silent: true,
						popup: false,
						content: function () {
							player.storage.xinfu_duanfa = 0;
						},
						sub: true,
					},
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			"xinfu_youdi": {
				audio: 2,
				trigger: {
					player: "phaseJieshuBegin",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				content: function () {
					"step 0"
					player.chooseTarget(get.prompt2('xinfu_youdi'), function (card, player, target) {
						return player != target;
					}).set('ai', function (target) {
						var player = _status.event.player;
						if (player.countCards('h', 'sha') > player.countCards('h') / 3 && player.countCards('h', { color: 'red' }) > player.countCards('h') / 2) return 0;
						if (target.countCards('he') == 0) return 0.1;
						return -get.attitude(_status.event.player, target);
					});
					"step 1"
					if (result.bool) {
						game.delay();
						player.logSkill('xinfu_youdi', result.targets);
						event.target = result.targets[0];
						event.target.discardPlayerCard(player, 'h', true);
					}
					else {
						event.finish();
					}
					"step 2"
					if (get.color(result.links[0]) != 'black') player.draw('nodelay');
					if (result.links[0].name != 'sha' && event.target.countCards('he')) {
						player.gainPlayerCard('he', event.target, true);
					}
				},
				ai: {
					expose: 0.3,
					threaten: 1.4,
				},
			},
			"xinfu_guanchao": {
				subSkill: {
					dizeng: {
						mark: true,
						marktext: "增",
						intro: {
							content: "单调递增",
						},
						trigger: {
							player: "useCard",
						},
						audio: "xinfu_guanchao",
						forced: true,
						mod: {
							aiOrder: function (player, card, num) {
								if (typeof card.number != 'number') return;
								var history = player.getHistory('useCard', function (evt) {
									return evt.isPhaseUsing();
								});
								if (history.length == 0) return num + 10 * (14 - card.number);
								var num = get.number(history[0].card);
								if (!num) return;
								for (var i = 1; i < history.length; i++) {
									var num2 = get.number(history[i].card);
									if (!num2 || num2 <= num) return;
									num = num2;
								}
								if (card.number > num) return num + 10 * (14 - card.number);
							},
						},
						filter: function (event, player) {
							var history = player.getHistory('useCard', function (evt) {
								return evt.isPhaseUsing();
							});
							if (history.length < 2) return false;
							var num = get.number(history[0].card);
							if (!num) return false;
							for (var i = 1; i < history.length; i++) {
								var num2 = get.number(history[i].card);
								if (!num2 || num2 <= num) return false;
								num = num2;
							}
							return true;
						},
						content: function () {
							player.draw();
						},
						sub: true,
					},
					dijian: {
						mark: true,
						marktext: "减",
						intro: {
							content: "单调递减",
						},
						init: function (player) {
							player.storage.guanchao = 0;
						},
						onremove: function (player) {
							delete player.storage.guanchao;
						},
						trigger: {
							player: "useCard",
						},
						audio: "xinfu_guanchao",
						forced: true,
						mod: {
							aiOrder: function (player, card, num) {
								if (typeof card.number != 'number') return;
								var history = player.getHistory('useCard', function (evt) {
									return evt.isPhaseUsing();
								});
								if (history.length == 0) return num + 10 * card.number;
								var num = get.number(history[0].card);
								if (!num) return;
								for (var i = 1; i < history.length; i++) {
									var num2 = get.number(history[i].card);
									if (!num2 || num2 >= num) return;
									num = num2;
								}
								if (card.number < num) return num + 10 * card.number;
							},
						},
						filter: function (event, player) {
							var history = player.getHistory('useCard', function (evt) {
								return evt.isPhaseUsing();
							});
							if (history.length < 2) return false;
							var num = get.number(history[0].card);
							if (!num) return false;
							for (var i = 1; i < history.length; i++) {
								var num2 = get.number(history[i].card);
								if (!num2 || num2 >= num) return false;
								num = num2;
							}
							return true;
						},
						content: function () {
							player.draw();
						},
						sub: true,
					},
				},
				audio: 2,
				trigger: {
					player: "phaseUseBegin",
				},
				direct: true,
				content: function () {
					'step 0'
					var list = ['递增', '递减', '取消'];
					player.chooseControl(list).set('prompt', get.prompt2('xinfu_guanchao')).set('ai', function () {
						return [0, 1].randomGet();
					});
					'step 1'
					switch (result.control) {
						case '递增': {
							player.logSkill('xinfu_guanchao');
							player.addTempSkill('xinfu_guanchao_dizeng', 'phaseUseEnd');
							break;
						}
						case '递减': {
							player.logSkill('xinfu_guanchao');
							player.addTempSkill('xinfu_guanchao_dijian', 'phaseUseEnd');
							break;
						}
						case '取消': {
							break;
						}
					}
				},
			},
			"xinfu_xunxian": {
				usable: 1,
				audio: 2,
				trigger: {
					player: ["useCardAfter", "respond"],
				},
				filter: function (event, player) {
					if (get.itemtype(event.cards) != 'cards') return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].isInPile()) {
							return true;
						}
					}
					return false;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget(get.prompt2('xinfu_xunxian'), function (card, player, target) {
						if (target == player) return false;
						return target.countCards('h') > player.countCards('h') || Math.max(0, target.hp) > Math.max(0, player.hp);
					}).set('ai', function (target) {
						var att = get.attitude(_status.event.player, target);
						if (att < 3) return 0;
						if (target.hasJudge('lebu')) {
							att /= 5;
						}
						if (target.hasSha() && _status.event.sha) {
							att /= 5;
						}
						if (_status.event.wuxie && target.needsToDiscard(1)) {
							att /= 5;
						}
						return att / (1 + get.distance(player, target, 'absolute'));
					}).set('sha', trigger.cards[0].name == 'sha').set('wuxie', trigger.cards[0].name == 'wuxie');
					'step 1'
					if (result.bool) {
						var list = [];
						for (var i = 0; i < trigger.cards.length; i++) {
							if (trigger.cards[i].isInPile()) {
								list.push(trigger.cards[i]);
							}
						}
						player.logSkill('xinfu_xunxian', result.targets[0]);
						result.targets[0].gain(list, 'gain2');
					}
				},
				ai: {
					expose: 0.3,
				},
			},
			"xinfu_kannan": {
				audio: 2,
				subSkill: {
					phase: {
						sub: true,
					},
				},
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.hasSkill('xinfu_kannan_phase')) return false;
					if (player.getStat().skill.xinfu_kannan >= player.hp) return false;
					return player.countCards('h') > 0;
				},
				filterTarget: function (card, player, target) {
					if (target.hasSkill('xinfu_kannan_phase')) return false;
					return player.canCompare(target);
				},
				ai: {
					order: function () {
						return get.order({ name: 'sha' }) + 0.4;
					},
					result: {
						target: function (player, target) {
							if (player.hasCard(function (card) {
								if (get.position(card) != "h") return false;
								var val = get.value(card);
								if (val < 0) return true;
								if (val <= 5) {
									return card.number >= 12;
								}
								if (val <= 6) {
									return card.number >= 13;
								}
								return false;
							})) return -1;
							return 0;
						},
					},
				},
				content: function () {
					'step 0'
					player.chooseToCompare(target);
					'step 1'
					if (result.bool) {
						player.addTempSkill('xinfu_kannan_phase');
						if (!player.hasSkill('kannan_eff')) {
							player.addSkill('kannan_eff');
						} else {
							if (!player.storage.kannan_eff) player.storage.kannan_eff = 0;
						}
						player.storage.kannan_eff++;
						player.markSkill('kannan_eff');
					}
					else {
						target.addTempSkill('xinfu_kannan_phase');
						if (!target.hasSkill('kannan_eff')) {
							target.addSkill('kannan_eff');
						}
						else {
							if (!target.storage.kannan_eff) player.storage.kannan_eff = 0;
							//target.storage.kannan_eff++;
							//target.markSkill('kannan_eff');
						}
						target.storage.kannan_eff++;
						target.markSkill('kannan_eff');
					}
				},
			},
			"kannan_eff": {
				mark: true,
				intro: {
					content: "下一张杀的伤害基数+#",
				},
				trigger: {
					player: "useCard",
				},
				filter: function (event) {
					return event.card && event.card.name == 'sha';
				},
				forced: true,
				content: function () {
					if (!trigger.baseDamage) trigger.baseDamage = 1;
					trigger.baseDamage += player.storage.kannan_eff;
					player.removeSkill('kannan_eff');
				},
				init: function (player) {
					player.storage.kannan_eff = 0;
				},
				onremove: function (player) {
					delete player.storage.kannan_eff;
				},
				ai: {
					damageBonus: true,
				},
			},
			"xinfu_tushe": {
				audio: 2,
				trigger: {
					player: "useCardToPlayered",
				},
				frequent: true,
				filter: function (event, player) {
					if (get.type(event.card) == 'equip') return false;
					if (event.getParent().triggeredTargets3.length > 1) return false;
					return event.targets.length > 0 && !player.countCards('h', { type: 'basic', });
				},
				content: function () {
					player.draw(trigger.targets.length);
				},
				ai: {
					presha: true,
					pretao: true,
					threaten: 1.8,
				},
			},
			"xinfu_limu": {
				mod: {
					targetInRange: function (card, player, target) {
						if (player.countCards('j') && player.inRange(target)) {
							return true;
						}
					},
					cardUsableTarget: function (card, player, target) {
						if (player.countCards('j') && player.inRange(target)) return true;
					},
					aiValue: function (player, card, num) {
						if (card.name == 'zhangba') return 15;
						if (player.getEquip('zhangba') && player.countCards('hs') > 1 && ['shan', 'tao'].contains(card.name)) return 0;
						if (card.name == 'shan' || card.name == 'tao') return num / 2;
					},
				},
				locked: false,
				audio: 2,
				enable: "phaseUse",
				discard: false,
				filter: function (event, player) {
					if (player.hasJudge('lebu')) return false;
					return player.countCards('hes', { suit: 'diamond' }) > 0;
				},
				viewAs: { name: 'lebu' },
				//prepare:"throw",
				position: "hes",
				filterCard: function (card, player, event) {
					return get.suit(card) == 'diamond' && player.canAddJudge({ name: 'lebu', cards: [card] });
				},
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				check: function (card) {
					var player = _status.event.player;
					if (!player.getEquip('zhangba') && player.countCards('hs', 'sha') < 2) {
						if (player.countCards('h', function (cardx) {
							return cardx != card && cardx.name == 'shan';
						}) > 0) return 0;
						var damaged = player.maxHp - player.hp - 1;
						var ts = player.countCards('h', function (cardx) {
							return cardx != card && cardx.name == 'tao';
						});
						if (ts > 0 && ts > damaged) return 0;
					}
					if (card.name == 'shan') return 15;
					if (card.name == 'tao') return 10;
					return 9 - get.value(card);
				},
				onuse: function (links, player) {
					var next = game.createEvent('limu_recover', false, _status.event.getParent());
					next.player = player;
					next.setContent(function () { player.recover() });
				},
				ai: {
					result: {
						target: 1,
					},
					order: 12,
				},
			},
		}
};
}
