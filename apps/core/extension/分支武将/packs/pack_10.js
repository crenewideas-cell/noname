// Extracted from character/jiangshan.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"character": {
            jsrg_simazhao: ['male', 'wei', 4, ['jsrgqiantun', 'jsrgweisi', 'jsrgxiezheng', 'jsrgzhaoxiong'], ['doublegroup:wei:qun', 'border:wei:jin', 'groupcolor:wei:jin', 'zhu', 'transform:[jsrg_simazhao,jsrg_simazhao2]']],
            jsrg_simazhao2: ['male', 'jin', 4, ['jsrgqiantun', 'jsrgweisi', 'jsrgxiezheng', 'jsrgdangyi'], ['doublegroup:wei:qun', 'border:wei:jin', 'groupcolor:wei:jin', 'zhu', 'transform:[jsrg_simazhao,jsrg_simazhao2]', 'unseen']],
            jsrg_yangqiu: ["male", "qun", 4, ["jsrgsaojian"]],
            jsrg_xiahourong: ["male", "wei", 4, ["jsrgfenjian", "fenjian"]],
            jsrg_huangfusong: ['male', 'qun', 4, ['jsrgguanhuo', 'jsrgjuxia']],
            jsrg_xushao: ['male', 'qun', 3, ['jsrgyingmen', 'jsrgpingjian']],
            jsrg_dongbai: ['female', 'qun', 3, ['jsrgshichong', 'jsrglianzhu']],
            jsrg_qiaoxuan: ['male', 'qun', 3, ['jsrgjuezhi', 'jsrgjizhao']],
            jsrg_kongrong: ['male', 'qun', 3, ['jsrglirang', 'jsrgzhengyi']],

            jsrg_zhugeliang: ['male', 'shu', 3, ['jsrgwentian', 'jsrgchushi', 'jsrgyinlue']],
            jsrg_jiangwei: ['male', 'shu', 4, ['jsrgqianfa', 'jsrgfumou', 'jsrgxuanfeng']],
            jsrg_guozhao: ["female", "wei", 3, ["jsrgpianchong", "zunwei"], ['character:guozhao']],
        },
"characterSort": {
            jiangshan: {
                offline_qi: [
                    "jsrg_huangfusong",
                    "jsrg_xushao",
                    "jsrg_dongbai",
                    "jsrg_qiaoxuan",
                    "jsrg_kongrong",
                ],
                offline_cheng: [
                ],
                offline_zhuan: [
                    "jsrg_xiahourong",
                    "jsrg_pangtong",
                ],
                offline_he: [
                    "jsrg_zhugeliang",
                    "jsrg_jiangwei",
                    "jsrg_weiwenzhugezhi",
                    "jsrg_zhangxuan",
                    "jsrg_guozhao",
                ],
                offline_xing: [
                    'jsrg_simazhao',
                    'jsrg_simazhao2',
                ],
                offline_shuai: [
                    "jsrg_yangqiu",
                ],
            },
        },
"characterFilter": {},
"characterTitle": {
            jsrg_xiahouen: '江山如故·转',
            jsrg_sunshangxiang: '江山如故·转',
            jsrg_liuhong: '江山如故·起',
            jsrg_hejin: '江山如故·起',
            jsrg_sunjian: '江山如故·起',
            jsrg_huangfusong: '江山如故·起',
            jsrg_xushao: '江山如故·起',
            jsrg_dongbai: '江山如故·起',
            jsrg_qiaoxuan: '江山如故·起',
            jsrg_yangbiao: '江山如故·起',
            jsrg_kongrong: '江山如故·起',
            jsrg_zhujun: '江山如故·起',
            jsrg_liubei: '江山如故·起',
            jsrg_wangyun: '江山如故·起',
            jsrg_liuyan: '江山如故·起',
            jsrg_caocao: '江山如故·起',
            jsrg_nanhualaoxian: '江山如故·起',
            jsrg_sunce: '江山如故·承',
            jsrg_xuyou: '江山如故·承',
            jsrg_lvbu: '江山如故·承',
            jsrg_zhanghe: '江山如故·承',
            jsrg_zoushi: '江山如故·承',
            jsrg_guanyu: '江山如故·承',
            jsrg_chendeng: '江山如故·承',
            jsrg_zhenji: '江山如故·承',
            jsrg_zhangliao: '江山如故·承',
            jsrg_xugong: '江山如故·承',
            jsrg_chunyuqiong: '江山如故·承',
            jsrg_guojia: '江山如故·转',
        },
"characterIntro": {
            lougui: "娄圭，字子伯，荆州南阳郡（治今河南南阳）人。曹魏时期著名谋士、将军，娄圭年轻时与曹操有交情，曾经随曹操平定冀州，南征刘表，击破马超，立有功劳，连曹操都感叹他的计谋。 后来曹操和他的儿子们一起出去游玩，娄圭当时也一起随行。因言语不当，被南郡（治今湖北荆州）人习授举报，曹操认为有意诽谤，遭杀害。在小说《三国演义》里，娄圭被设定为京兆人（今陕西西安），隐居终南山，道号“梦梅居士”。于第59回登场。",
            xiahourong: "夏侯荣（207年—219年） ，字幼权，名将夏侯渊之子。建安二十四年（219年）汉中之战，父亲夏侯渊战死后，夏侯荣不愿逃跑，随后拔剑冲入敌阵，战死。",
            guoxun: "郭脩（？～253年），一作郭循，字孝先，凉州西平人，三国时期曹魏官员。原为曹魏中郎，被蜀汉将领姜维俘虏后降蜀汉，任左将军，后来刺杀了蜀汉大将军费祎。被曹魏追封为长乐乡侯，谥曰威侯。",
            sunjun: "孙峻（219年-256年10月19日），字子远，扬州吴郡富春（今浙江省杭州市）人，昭义中郎将孙静曾孙，定武中郎将孙暠之孙，散骑侍郎孙恭之子。三国时期吴国宗室、权臣。孙峻从小弓马娴熟，胆量非凡。孙权晚年时，孙峻担任武卫都尉，掌握军权，然后又任侍中，开始涉足朝政。孙权临终前，孙峻接受遗诏同诸葛恪、滕胤共同辅佐朝政。此后，其身兼武卫将军，一直主持宫廷的值班、守卫等要害部门，并被封为都乡侯。孙峻生性喜好专断，容不下诸葛恪，于是与吴主孙亮密谋发动政变，在酒宴中设伏兵杀死诸葛恪。孙峻谋杀诸葛恪之后，升任丞相、大将军，督察内外一切军务，假节，晋封富春侯。此后，孙峻独揽朝政。孙峻在任职期间，滥施刑杀，淫乱宫女，和全公主孙鲁班私通。五凤元年（254年），吴侯孙英企图谋杀孙峻，后来事情被泄露，孙英自杀。时隔一年，吴国将军孙仪、张怡、林恂等人乘蜀国使节来访之机，共同谋划诛杀孙峻。后被孙峻发觉，孙仪自杀，林恂等被认为有罪诛死。太平元年（256年），孙峻梦见被诸葛恪所击，因惊悸恐惧发病而死，时年38岁。",
            sunluban_sunluyu: "孙鲁班，孙权之女。孙鲁班与孙权二子孙和不睦。孙权长子孙登死后，孙和被立为太子。孙鲁班向孙权进谗言废孙和太子之位，孙和被废后忧愤而死。<br>孙鲁育，又名小虎，孙权与步练师之女。吴后期，孙鲁班诬陷孙鲁育参与谋反，于是孙峻杀害了孙鲁育。",
            jsrg_caocao: "初平元年二月，董卓徙天子都长安，焚洛阳宫室，众诸侯畏卓兵强，莫敢进。操怒斥众人:“为人臣而临此境，当举义兵以诛暴乱，大众已合，诸君何疑？此一战而天下定矣！”遂引兵汴水，遇卓将徐荣，大破之。操迎天子，攻吕布，伐袁术，安汉室，拜为征西将军。是时，袁绍兼四州之地，将攻许都。操欲扫清寰宇，兴复汉室，遂屯兵官渡。既克绍，操曰：“若天命在吾，吾为周文王矣。”",
            jsrg_sunce: "建安五年，操、绍相拒于官渡，孙策欲阴袭许昌，迎汉帝，遂密治兵，部署诸将。未发，会为许贡门客所刺，将计就计，尽托江东于权，诈死以待天时。八月，操、绍决战，孙策亲冒矢石，斩将刈旗，得扬、豫之地。曹操败走冀、青，刘备远遁荆、益。而后历时七年，孙策三分天下已有其二，帝于洛阳，建霸王未竟之功业。权表求吴王，封为仲帝，共治天下。",
            jsrg_guojia: "初平元年二月，郭嘉拜见袁绍，闻曹操怒斥众诸侯，乃对曰：“董卓于汴水或有埋伏，慎之！”曹操未从，果败于徐荣。三月，曹操与郭嘉论天下事：“使孤成大业者，必此人也。”郭嘉从破袁绍，讨谭、尚，连战数克，计定辽东。时年三十八，征乌桓归途郭嘉因劳染疾，命悬之际竟意外饮下柳皮醋水而愈。建安十三年，曹操屯兵赤壁，郭嘉识破连环之计，议上中下三策，可胜刘备。尚未献策，曹操便决意采纳上策，“奉孝之才，足胜孤百倍，卿言上策，如何不取？”由此，赤壁战后曹操尽得天下。",
            jsrg_zhugeliang: "建兴六年春，汉丞相诸葛亮使赵云、邓芝为先锋，马谡为副将拒箕谷，牵制曹真主力。自率三十万大军攻祁山，三郡叛魏应亮，关中响震。曹叡命张郃拒亮，亮使定军山降将姜维与郃战于街亭，张郃久攻不下。后曹真强攻赵云军，赵云死战，坚守箕谷，马谡、邓芝当场战死忠勇殉国。……既克张郃，曹真溃逃，曹叡弃守长安，迁都邺城。十月，司马懿击退孙权，回援曹真。而后三年，丞相所到之处，无不望风而降，皆箪食壶浆，以迎汉军。尽收豫、徐、兖、并之地，建兴十年春，司马懿父子三人死于诸葛武侯火计，同年，孙权上表称臣，至此四海清平，大汉一统。而后诸葛亮荐蒋琬为丞相，姜维为大将军，自回隆中归隐，后主挽留再三，皆不受。魏延亦辞官相随，侍奉左右。后主时有不决之事，便往隆中拜访相父，均未得面，童子答曰外出云游，遗数锦囊，拆而视之，皆治国之良策也。",
            jsrg_wenyang: "文鸯（238年—291年），一作文淑，字次骞，小名阿鸯，世称文鸯， 谯郡（今安徽亳州市）人。魏末晋初名将，曹魏扬州刺史文钦之子。文鸯骁勇善战，依附大将军曹爽，效忠于王室。司马师废黜皇帝曹芳后，随父联合毌丘俭于淮南起兵勤王。兵败之后，向南投奔吴国。诸葛诞发动淮南叛乱，奉命率军驰援。双方发生内讧，父亲为诸葛诞所害，遂降于司马昭，封关内侯。西晋建立后，任平虏护军。咸宁三年（277年），拜平西将军、都督凉秦雍州三州军事，大破鲜卑首领秃发树机能，名震天下，迁使持节、护东夷校尉、监辽东军事。",
        },
"characterPrefix": {
            jsrg_caojiewangfu: '合',
            jsrg_chenfan: '衰',
            jsrg_yl_luzhi: '衰',
            jsrg_songhuanghou: '衰',
            jsrg_sunjun: '合',
            jsrg_caofang: '合',
            jsrg_guoxun: '合',
            jsrg_xiahourong: '转',
            jsrg_limi: '兴',
        },
"translate": {
            jsrg_ying: '影',
            jsrg_ying_info: '均为黑桃A的基本牌，不能使用或打出，没有任何效果。游戏外无限量供应；当【影】进入弃牌堆后改为移出游戏；一名角色获得【影】默认从游戏外获得。',
            //江山如故
            jsrg_liuhong: '起刘宏',
            jsrgchaozheng: '朝争',
            jsrgchaozheng_info: '准备阶段，你可以令所有其他角色议事。若结果为：红色，意见为红色的角色各回复1点体力；黑色，意见为红色的角色各失去1点体力。然后若所有意见均相同，你摸X张牌（X为此次议事的角色数）。',
            jsrgshenchong: '甚宠',
            jsrgshenchong_info: '限定技，出牌阶段，你可以令一名其他角色获得〖飞扬〗、〖跋扈〗。若如此做，当你死亡时，其失去所有技能并弃置所有手牌。',
            jsrgjulian: '聚敛',
            jsrgjulian_info: '主公技，①其他群势力角色每回合限两次。当其不于摸牌阶段且不因〖聚敛〗摸牌后，其可以摸一张牌。②结束阶段，你可以获得所有其他群势力角色各一张牌。',
            jsrgfeiyang: '飞扬',
            jsrgfeiyang_info: '判定阶段开始时，若你的判定区里有牌，你可以弃置两张手牌并弃置你判定区里的一张牌。',
            jsrgbahu: '跋扈',
            jsrgbahu_info: '锁定技，①准备阶段，你摸一张牌。②你使用【杀】的次数上限+1。',
            jsrg_hejin: '起何进',
            jsrgzhaobing: '诏兵',
            jsrgzhaobing_info: '结束阶段，你可以弃置所有手牌，然后令至多X名其他角色依次选择一项：1.正面向上交给你一张【杀】；2.失去1点体力（X为你本次弃置的牌数）。',
            jsrgzhuhuan: '诛宦',
            jsrgzhuhuan_info: '准备阶段，你可以展示所有手牌并弃置所有【杀】，然后令一名其他角色选择一项：1.弃置等量的牌，然后受到1点伤害；2.令你摸等量的牌，然后你回复1点体力。',
            jsrgyanhuo: '延祸',
            jsrgyanhuo_info: '锁定技，当你死亡时，你增加如下全局技能：当有角色使用【杀】时，此【杀】的伤害值基数+1。',
            jsrg_sunjian: '起孙坚',
            jsrgpingtao: '平讨',
            jsrgpingtao_info: '出牌阶段限一次。你可以令一名其他角色选择一项：1.交给你一张牌，然后你于此回合使用【杀】的次数上限+1；2.令你视为对其使用一张【杀】。',
            jsrgjuelie: '绝烈',
            jsrgjuelie_info: '①当你造成渠道为【杀】的伤害时，若你的手牌数或体力值最小，此伤害+1。②当你使用【杀】指定一名角色为目标后，你可以弃置任意张牌，然后弃置其等量的牌。',
            jsrg_huangfusong: '起皇甫嵩',
            jsrgguanhuo: '观火',
            jsrgguanhuo_info: '①出牌阶段，你可以视为使用一张【火攻】。②当你因〖观火①〗使用的【火攻】结算结束后，若此牌未造成过伤害，且：若{你此阶段发动〖观火①〗的次数为1，则你于此阶段造成渠道为【火攻】的伤害时，此伤害+1}，否则你失去〖观火〗。',
            jsrgjuxia: '居下',
            jsrgjuxia_info: '每回合限一次。当其他角色使用牌指定你为目标后，若其技能数多于你，其可以令此牌对你无效，然后令你摸两张牌。',
            jsrg_xushao: '许劭',
            jsrgyingmen: '盈门',
            jsrgyingmen_info: '锁定技，①游戏开始时，你将武将牌堆中随机四张武将牌置于你的武将牌上，称为“访客”。②回合开始时，若你的“访客”数小于4，你随机从武将牌堆中将“访客”补至四张。',
            jsrgpingjian: '评鉴',
            jsrgpingjian_info: '你可以于满足你“访客”上的一个无技能标签或仅有锁定技标签的技能条件的时机发动此技能，然后你选择移去一张“访客”。若移去的是本次发动技能的“访客”，你摸一张牌。',
            jsrg_dongbai: '起董白',
            jsrgshichong: '恃宠',
            jsrgshichong_info: '转换技，当你使用牌指定其他角色为唯一目标后，阴：你可以获得目标角色一张手牌；阳：目标角色可以交给你一张手牌。',
            jsrglianzhu: '连诛',
            jsrglianzhu_info: '出牌阶段限一次。你可以展示一张黑色手牌并交给一名其他角色，然后视为你对所有与其势力相同的其他角色依次使用一张【过河拆桥】。',
            jsrg_qiaoxuan: '起桥玄',
            jsrgjuezhi: '绝质',
            jsrgjuezhi_info: '①当你失去一张装备区里的装备牌后，你可以废除对应的装备栏。②你的回合每阶段限一次。当你使用牌对目标角色造成伤害时，你令此伤害+X（X为其装备区里的牌与你已废除的装备栏中相同副类别的数量）。',
            jsrgjizhao: '急召',
            jsrgjizhao_info: '准备阶段或结束阶段，你可以令一名角色选择一项：1.使用一张手牌；2.令你可以移动其区域里的一张牌。',
            jsrg_yangbiao: '起杨彪',
            jsrgzhaohan: '昭汉',
            jsrgzhaohan_info: '准备阶段，若本局游戏：未洗过牌，你回复1点体力；洗过牌，你失去1点体力。',
            jsrgrangjie: '让节',
            jsrgrangjie_info: '当你受到1点伤害后，你可以移动场上的一张牌，然后你可以于弃牌堆中选择获得一张本回合进入弃牌堆且与此牌花色相同的牌。',
            jsrgyizheng: '义争',
            jsrgyizheng_info: '出牌阶段限一次。你可以与一名手牌数大于你的角色拼点。若你：赢，其跳过下一个摸牌阶段；没赢，其可以对你造成至多2点伤害。',
            jsrg_kongrong: '起孔融',
            jsrglirang: '礼让',
            jsrglirang_info: '每轮限一次。其他角色的摸牌阶段开始时，你可以交给其两张牌。然后此回合的弃牌阶段结束时，你可以获得所有其于此阶段因弃置进入弃牌堆的牌。',
            jsrgzhengyi: '争义',
            jsrgzhengyi_info: '当你每回合首次受到伤害时，本轮因〖礼让〗获得过牌的其他角色可以将此伤害转移给其。',
            jsrg_zhujun: '起朱儁',
            jsrgfendi: '分敌',
            jsrgfendi_tag: '分敌',
            jsrgfendi_info: '每回合限一次。当你使用【杀】指定唯一目标后，你可以展示其任意张手牌，令其不能使用或打出对应实体牌不全为这些牌的牌直到此【杀】结算结束。然后当此【杀】对其造成伤害后，你获得这些牌。',
            jsrgjuxiang: '拒降',
            jsrgjuxiang_info: '当你不于摸牌阶段获得牌后，你可以弃置之，令当前回合角色于此回合额定的出牌阶段内使用【杀】的次数上限+X（X为你以此法弃置的牌的花色数）。',
            jsrg_liubei: '起刘备',
            jsrgjishan: '积善',
            jsrgjishan_info: '①每回合限一次。当一名角色受到伤害时，你可以失去1点体力并防止此伤害，然后你与其各摸一张牌。②每回合限一次。当你造成伤害后，你可以令一名体力值最小且你对其发动过〖积善①〗的角色回复1点体力。',
            jsrgzhenqiao: '振鞘',
            jsrgzhenqiao_info: '锁定技，①你的攻击范围+1。②当你使用【杀】指定目标后，若你的武器栏为空且未废除，你令此【杀】的效果额外结算一次。',
            jsrg_wangyun: '起王允',
            jsrgshelun: '赦论',
            jsrgshelun_info: '出牌阶段限一次。你可以选择一名你攻击范围内的角色，然后令除其外所有手牌数不大于你的角色议事。若结果为：红色，你弃置其一张牌；黑色，你对其造成1点伤害。',
            jsrgfayi: '伐异',
            jsrgfayi_info: '当你议事结算结束后，你可以对一名意见与你不同的角色造成1点伤害。',
            jsrg_liuyan: '起刘焉',
            jsrgtushe: '图射',
            jsrgtushe_info: '当你使用非装备牌指定目标后，你可以展示所有手牌。若你没有基本牌，你可以摸X张牌（X为此牌指定的目标数）。',
            jsrgtongjue: '通绝',
            jsrgtongjue_info: '主公技，出牌阶段限一次。你可以将任意张牌交给等量名其他群势力角色。然后你不能使用牌指定这些角色为目标直到回合结束。',
            jsrg_caocao: '起曹操',
            jsrgzhenglve: '政略',
            jsrgzhenglve_info: '①主公的回合结束时，你可以摸一张牌，然后令一名没有“猎”标记的角色获得“猎”（若主公本回合没有造成过伤害，则改为两名）。②你对有“猎”的角色使用牌无距离和次数限制。③每回合限一次。当你对有“猎”的角色造成伤害后，你可以摸一张牌并获得造成此伤害的牌。',
            jsrghuilie: '会猎',
            jsrghuilie_info: '觉醒技，准备阶段，若有“猎”的角色数大于2，你减1点体力上限，然后获得〖平戎〗和〖飞影〗。',
            jsrgpingrong: '平戎',
            jsrgpingrong_info: '每轮限一次。一名角色的回合结束时，你可以移去一名角色的“猎”，然后你于此回合后执行一个额外回合。该回合结束后，若你于此回合未造成过伤害，你失去1点体力。',
            jsrg_nanhualaoxian: '起南华老仙',
            jsrgshoushu: '授术',
            jsrgshoushu_info: '锁定技，①每轮开始时，若游戏内没有【太平要术】，你可以从游戏外将【太平要术】置于一名角色的装备区内。②当【太平要术】离开一名角色的装备区后，你令此牌销毁。',
            jsrgxundao: '寻道',
            jsrgxundao_info: '当你的判定牌生效前，你可以令至多两名角色依次弃置一张牌，然后你选择一张以此法弃置且位于弃牌堆中的牌代替此判定牌。',
            jsrglinghua: '灵化',
            jsrglinghua_info: '①准备阶段，你可以进行目标角色为你的【闪电】的特殊的使用流程。若你未因此受到伤害，你可以令一名角色回复1点体力。②结束阶段，你可以进行目标角色为你且判定效果反转的【闪电】的特殊的使用流程。若你未因此受到伤害，你可以对一名角色造成1点雷电伤害。',
            sbyingmen: '盈门',
            sbyingmen_info: '锁定技，①游戏开始时，你将武将牌堆中随机四张武将牌置于你的武将牌上，称为“访客”。②回合开始时，若你的“访客”数小于4，你随机从武将牌堆中将“访客”补至四张。',
            sbpingjian: '评鉴',
            sbpingjian_info: '你可以于满足你“访客”上的一个无技能标签或仅有锁定技标签的技能条件的时机发动此技能，然后你选择移去一张“访客”。若移去的是本次发动技能的“访客”，则你于此技能结算结束时摸一张牌。',
            jsrg_sunshangxiang: '转孙尚香',
            jsrgjiaohao: '骄豪',
            jsrgjiaohao_info: '其他角色出牌阶段限一次，其可以将手牌中的一张装备牌置于你的装备区内；准备阶段，你获得X张【影】(x为你空置的装备栏数的一半且向上取整)。',
            jsrgguiji: '闺忌',
            jsrgguiji_info: '每回合限一次，出牌阶段，你可以与一名手牌数小于你的男性角色交换手牌，然后其下个出牌阶段结束时，你可以与其交换手牌。',
            jsrg_xiahouen: '转夏侯恩',
            jsrghujian: '护剑',
            jsrghujian_info: '游戏开始时，你从游戏外获得一张【赤血青锋】；一名角色回合结束时，此回合最后一名使用或打出过牌的角色可以获得弃牌堆中的【赤血青锋】。',
            jsrgshili: '恃力',
            jsrgshili_info: '出牌阶段限一次，你可将一张手牌中的装备牌当【决斗】使用。',
            jsrg_sunce: '梦孙策',
            jsrgduxing: '独行',
            jsrgduxing_info: '出牌阶段限一次。你可以视为使用一张可以指定任意名目标角色的【决斗】，且所有目标角色的手牌均视为【杀】直到此牌结算结束。',
            jsrgzhiheng: '猘横',
            jsrgzhiheng_info: '锁定技，当你因执行牌的效果对目标角色造成伤害时，若其于此回合响应过你使用过的牌，此伤害+1。',
            jsrgzhasi: '诈死',
            jsrgzhasi_info: '限定技，当你受到伤害值不小于你的体力值的伤害时，你可以防止此伤害，然后失去〖猘横〗并获得〖制衡〗。然后你不计入距离和座次计算直到你对其他角色使用牌后或当你受到伤害后。',
            jsrgbashi: '霸世',
            jsrgbashi_info: '主公技，当你需要打出【杀】或【闪】时，你可以令其他吴势力角色选择是否打出一张【杀】或【闪】。若有角色响应，则视为你打出了一张【杀】或【闪】。',
            jsrg_xuyou: '承许攸',
            jsrglipan: '离叛',
            jsrglipan_info: '回合结束时，你可以变更势力，然后摸X张牌并执行一个额外的出牌阶段。此阶段结束时，所有与你势力相同的角色依次可以将一张牌当【决斗】对你使用（X为与你势力相同的其他角色数）。',
            jsrgqingxi: '轻袭',
            jsrgqingxi_info: '群势力技，出牌阶段每名角色限一次。你可以选择一名手牌数小于你的角色，你将手牌数弃置至与其相同，然后视为对其使用一张刺【杀】。',
            jsrgjinmie: '烬灭',
            jsrgjinmie_info: '魏势力技，出牌阶段限一次。你可以选择一名手牌数大于你的角色，你视为对其使用一张火【杀】。当此牌造成伤害后，你将其手牌数弃置至与你相同。',
            jsrg_lvbu: '承吕布',
            jsrgwuchang: '无常',
            jsrgwuchang_info: '锁定技，①当你获得其他角色的牌后，你变更势力为与其相同。②当你使用【杀】或【决斗】对与你势力相同的目标角色造成伤害时，此伤害+1，然后变更势力为群。',
            jsrgqingjiao: '轻狡',
            jsrgqingjiao_info: '群势力技，出牌阶段各限一次。你可以将一张牌当【推心置腹】/【趁火打劫】对一名手牌数大于/小于你的角色使用。',
            jsrgchengxu: '乘虚',
            jsrgchengxu_info: '蜀势力技，与你势力相同的其他角色不能响应你使用的牌。',
            jsrg_zhanghe: '承张郃',
            jsrgqiongtu: '穷途',
            jsrgqiongtu_info: '群势力技，每回合限一次。你可以将一张非基本牌置于武将牌上视为使用一张【无懈可击】。若此牌生效，你摸一张牌，否则你变更势力为魏并获得所有“穷途”牌。',
            jsrgxianzhu: '先著',
            jsrgxianzhu_info: '魏势力技，你可以将一张普通锦囊牌当无次数限制的【杀】使用。当此牌对唯一目标造成伤害后，你视为对该角色使用一张此普通锦囊牌。',
            jsrg_zoushi: '承邹氏',
            jsrgguyin: '孤吟',
            jsrgguyin_info: '准备阶段，你可以翻面，且令所有其他男性角色依次选择是否翻面。然后你和所有背面朝上的角色轮流各摸一张牌，直到你们累计以此法得到X张牌（X为场上存活角色与死亡角色中男性角色数）。',
            jsrgzhangdeng: '帐灯',
            jsrgzhangdeng_info: '①当一名武将牌背面朝上的角色需要使用【酒】时，若你的武将牌背面朝上，其可以视为使用之。②当一名角色于一回合第二次发动〖帐灯①〗时，你将武将牌翻面至正面朝上。',
            jsrg_guanyu: '承关羽',
            jsrgguanjue: '冠绝',
            jsrgguanjue_info: '锁定技，当你使用或打出有花色的牌时，你令所有其他角色于此回合内不能使用或打出该花色的牌。',
            jsrgnianen: '念恩',
            jsrgnianen_info: '你可以将一张牌当任意基本牌使用或打出，然后若此牌不为红色或你以此法使用或打出的牌不为普通【杀】，则直到此回合结束，该技能失效且你视为拥有〖马术〗。',
            jsrg_chendeng: '承陈登',
            jsrglunshi: '论势',
            jsrglunshi_info: '出牌阶段限一次。你可以令一名角色摸等同于其攻击范围内角色数的牌（至多摸至五张），然后其弃置等同于攻击范围内含有其的角色数的牌。',
            jsrgguitu: '诡图',
            jsrgguitu_info: '准备阶段，你可以交换场上的两张武器牌，然后攻击范围以此法减少的角色回复1点体力。',
            jsrg_zhenji: '承甄姬',
            jsrgjixiang: '济乡',
            jsrgjixiang_info: '回合内每种牌名限一次。当一名其他角色需要使用或打出一张基本牌时，你可以弃置一张牌令其视为使用或打出之，然后你摸一张牌并令〖称贤〗于此阶段可发动次数上限+1。',
            jsrgchengxian: '称贤',
            jsrgchengxian_info: '出牌阶段限两次。你可以将一张手牌当一张本回合未以此法使用过的普通锦囊牌使用（此转化牌须与以此法转化的手牌的合法目标数相同）。',
            jsrg_zhangliao: '承张辽',
            jsrgzhengbing: '整兵',
            jsrgzhengbing_info: '群势力技，出牌阶段限三次。你可以重铸一张牌，若此牌为：【杀】，你本回合手牌上限+2；【闪】，你摸一张牌；【桃】，你变更势力为魏。',
            jsrgtuwei: '突围',
            jsrgtuwei_info: '魏势力技，出牌阶段开始时，你可以获得攻击范围内任意名角色各一张牌。然后此回合结束时，这些角色中未于本回合受到过伤害的角色依次获得你的一张牌。',
            jsrg_xugong: '承许贡',
            jsrgbiaozhao: '表召',
            jsrgbiaozhao_info: '准备阶段，你可以选择两名其他角色A和B。直到你的下回合开始时或你死亡后，A对B使用牌无次数和距离限制，且B对你使用的牌造成的伤害+1。',
            jsrgyechou: '业仇',
            jsrgyechou_info: '当你死亡时，你可以令一名其他角色获得如下效果：当其受到伤害值不小于其体力值的伤害时，其令此伤害翻倍。',
            jsrg_chunyuqiong: '承淳于琼',
            jsrgcangchu: '仓储',
            jsrgcangchu_info: '一名角色的结束阶段，你可以令至多X名角色各摸一张牌，若X大于存活角色数，则改为各摸两张牌（X为你于此回合得到的牌数）。',
            jsrgshishou: '失守',
            jsrgshishou_info: '锁定技，①当你使用【酒】时，你摸三张牌，然后你本回合不能再使用牌。②当你受到火焰伤害后，你令〖仓储〗失效直到你的下回合结束后。',
            jsrg_guojia: '梦郭嘉',
            jsrgqingzi: '轻辎',
            jsrgqingzi_info: '准备阶段，你可以弃置任意名其他角色装备区内的各一张解，然后这些角色获得【神速】直到你的下回合开始。',
            jsrgdingce: '定策',
            jsrgdingce_info: '当你受到伤害后，你可以弃置你和伤害来源各一张手牌，若送两张牌颜色相同，视为你使用一张【洞烛先机】。',
            jsrgzhenfeng: '针锋',
            jsrgzhenfeng_info: '出牌阶段每种类型的牌限一次，你可以视为使用一张存活角色技能中包合的牌名（无次数距离限制且须为基本牌或普通锦囊牌）；当此牌对该角色生效后，你对其造成1点伤害。',
            jsrg_zhangfei: "转张飞",
            jsrgbaohe: "暴喝",
            jsrgbaohe_info: "一名角色的出牌阶段结束时，你可以弃置两张牌，然后视为你对攻击范围内包含其的所有角色使用一张【杀】。当一名角色使用牌响应此【杀】后，此【杀】对后续目标角色造成的伤害+1。",
            jsrgxushi: "虚势",
            jsrgxushi_info: "出牌阶段限一次。你可以交给任意名角色各一张牌，然后你获得两倍数量的【影】。",
            jsrg_machao: '转马超',
            jsrgzhuiming: '追命',
            jsrgzhuiming_info: '当你使用【杀】指定唯一目标后，你可以声明一种颜色并令目标弃置任意张牌，然后你展示目标一张牌，若此牌颜色与你声明的相同，则此【杀】不计入次数限制，不可被响应且伤害+1。',
            jsrg_lougui: "转娄圭",
            jsrgshacheng: "沙城",
            jsrgshacheng_info: "①游戏开始时，你将牌堆顶的两张牌置于武将牌上，称为“城”。②当一名角色使用【杀】结算结束后，你可以移去一张“城”，令此牌的其中一名目标角色摸X张牌（X为该角色本回合失去过的牌数且至多为5）。",
            jsrgninghan: "凝寒",
            jsrgninghan_info: "锁定技。①所有角色手牌中的♣【杀】均视为冰【杀】。②当一名角色受到冰冻伤害后，你将造成此伤害的牌对应的实体牌置入“城”。",
            jsrg_zhangren: "转张任",
            jsrgfuni: "伏匿",
            jsrgfuni_info: "锁定技。①你的攻击范围终值为0。②一轮游戏开始时，你令任意名角色获得共计X张【影】（X为存活角色数的一半，向上取整）。③当有牌进入弃牌堆后，若其中有【影】，你于本回合使用牌无距离限制且不能被响应。",
            jsrgchuanxin: "穿心",
            jsrgchuanxin_info: "一名角色的结束阶段，你可以将一张牌当【杀】使用。当一名角色受到渠道为此【杀】的伤害时，此伤害+Y（Y为其本回合回复过的体力值）。",
            jsrg_huangzhong: "转黄忠",
            jsrgcuifeng: "摧锋",
            jsrgcuifeng_info: "限定技。出牌阶段，你可以视为使用一张单目标的伤害类牌（无距离限制）。此回合结束时，若此牌未造成伤害或造成的伤害值大于1，你重置〖摧锋〗。",
            jsrgdengnan: "登难",
            jsrgdengnan_info: "限定技。出牌阶段，你可以视为使用一张非伤害类普通锦囊牌。此回合结束时，若此牌的目标均于此回合受到过伤害，你重置〖登难〗。",
            jsrg_xiahourong: "转夏侯荣",
            jsrg_xiahourong_prefix: "转",
            jsrgfenjian: "奋剑",
            jsrgfenjian_info: "每回合各限一次。当你需要对其他角色使用【决斗】或【桃】时，你可以令你本回合受到的伤害+1，视为使用之。",
            jsrg_pangtong: "转庞统",
            jsrgmanjuan: "漫卷",
            jsrgmanjuan_info: "若你没有手牌，你可以如手牌般使用或打出于本回合进入弃牌堆的牌（每种点数每回合限一次）。",
            jsrgyangming: "养名",
            jsrgyangming_info: "出牌阶段限一次。你可以与一名角色拼点，若其：没赢，你可以与其重复此流程；赢，其摸X张牌，然后你回复1点体力（X为其此阶段没赢的次数）。",
            jsrg_hansui: "转韩遂",
            jsrgniluan: "逆乱",
            jsrgniluan_info: "准备阶段，你可以选择一项：1.弃置一张牌，对一名未对你造成过伤害的角色造成1点伤害；2.令一名对你造成过伤害的角色摸两张牌。",
            jsrghuchou: "互雠",
            jsrghuchou_info: "锁定技。当你对最后对你使用伤害类牌的角色造成伤害时，此伤害+1。",
            jsrgjiemeng: "皆盟",
            jsrgjiemeng_info: "主公技，锁定技。所有群势力角色至其他角色的距离-X（X为群势力角色数）。",
            jsrg_zhangchu: "转张楚",
            jsrghuozhong: "惑众",
            jsrghuozhong_info: "所有角色出牌阶段限一次。其可以将一张黑色非锦囊牌当【兵粮寸断】置于其判定区，然后令你摸两张牌。",
            jsrgrihui: "日彗",
            jsrgrihui_info: "①当你使用【杀】对目标角色造成伤害后，你可以令判定区有牌的其他角色各摸一张牌。②你于一回合内对判定区没有牌的角色使用的第一张【杀】无任何次数限制。",
            jsrg_fanjiangzhangda: "转范强张达",
            jsrgfushan: "负山",
            jsrgfushan_info: "出牌阶段开始时，所有其他角色可以依次交给你一张牌并令你此阶段使用【杀】的次数上限+1。此阶段结束时，若你使用【杀】的次数未达到上限且此阶段以此法交给你牌的角色均存活，你失去2点体力，否则你将手牌摸至体力上限。",
            jsrg_zhugeliang: '梦诸葛亮',
            jsrgwentian: '问天',
            jsrgwentian_info: '每回合限一次，你的任意阶段开始时，你可以观看牌堆顶的五张牌，然后将其中一张牌交给一名其他角色，其余牌以任意顺序放回牌堆顶或者牌堆底。你可以将牌堆顶的牌当【无懈可击】/【火攻】使用，然后若此牌不为黑色/红色，本技能于本轮内失效。',
            jsrgchushi: '出师',
            jsrgchushi_info: '出牌阶段限一次，你可以和主公角色议事，若结果为：红色，你与其各摸一张牌，然后重复此流程，直到你们手牌数之和不小于7；黑色，当你于本轮内造成属性伤害时，伤害+1。',
            jsrgyinlue: '隐略',
            jsrgyinlue_info: '每轮每项各限一次，当一名角色受到火焰/雷电伤害时，你可以防止之，然后令你于此回合结束后执行一个只有摸牌/弃牌阶段的额外回合。',
            jsrg_jiangwei: '合姜维',
            jsrgqianfa: '矜伐',
            jsrgqianfa_info: '出牌阶段限一次，你可以展示一张手牌，然后令所有体力上限不大于你的角色议事，若结果与此牌颜色相同，你令至多两名角色将手牌摸至体力上限，不同，你获得两张【影】，若没有角色与你的意见相同，你可以变更势力。',
            jsrgfumou: '复谋',
            jsrgfumou_info: '魏势力技，议事结束后，与你意见不同的角色本回合不能使用或打出与其意见牌颜色相同的牌，你可以将一张【影】当【出其不意】对其中一名角色使用。',
            jsrgxuanfeng: '选锋',
            jsrgxuanfeng_info: '蜀势力技，你可以将一张【影】当无距离次数限制的刺【杀】使用。',
            jsrg_sunluban_sunluyu: '孙鲁班&孙鲁育',
            jsrgdaimou: '殆谋',
            jsrgdaimou_info: '每回合各限一次，当一名角色使用【杀】指定其他角色/你为目标时，你可以用牌堆顶的牌蓄谋/你须弃置你区域里的一张蓄谋牌。',
            jsrgfangjie: '芳洁',
            jsrgfangjie_info: '准备阶段，若你没有蓄谋牌，你回复1点体力并摸一张牌，否则你可以弃置任意张你区域里的蓄谋牌并失去此技能。',
            jsrg_zhaoyun: '合赵云',
            jsrglonglin: '龙临',
            jsrglonglin_info: '当其他角色于其出牌阶段首次使用【杀】指定目标后，你可以弃置一张牌令此【杀】无效，然后其可以视为对你使用一张【决斗】，你以此法造成伤害后，其本阶段不能再使用手牌。',
            jsrgzhendan: '镇胆',
            jsrgzhendan_info: '你可以将一张非基本手牌当任意基本牌使用或打出;当你受到伤害后或每轮结束时你摸X张牌，此技能本轮失效(X为本轮所有角色执行过的回合数目至多为5)。',
            jsrg_luxun: '合陆逊',
            jsrgyoujin: '诱进',
            jsrgyoujin_info: '出牌阶段开始时，你可以与一名角色拼点，双方本回合不能使用或打出点数小于各自拼点牌的手牌，赢的角色视为对没赢的角色使用一张【杀】。',
            jsrgdailao: '待劳',
            jsrgdailao_info: '出牌阶段，若你没有可以使用的手牌，你可以展示所有手牌并摸两张牌，然后结束此回合。',
            jsrgzhubei: '逐北',
            jsrgzhubei_info: '锁定技，你对本回含受到过伤害/失去过最后手牌的角色造成的伤害+1/使用牌无次数限制。',
            jsrg_simayi: '合司马懿',
            jsrgyingshi: '鹰眎',
            jsrgyingshi_info: '当你翻面时，你可以观看牌堆底的三张牌(若死亡角色数大于2改为五张)，然后将其中任意张牌以任意顺序放回牌堆顶，其余牌以任意顺序放回牌堆底。',
            jsrgtuigu: '蜕骨',
            jsrgtuigu_info: '回合开始时，你可以翻面令你本回合的手牌上限+X，然后摸X张牌并视为使用一张【解甲归田】(目标角色不能使用这些装备牌直到其回合结束，X为场上角色数的一半，向下取整);每轮结束时，若你本轮未行动过，你执行一个额外回合;当你失去装备区里的牌后，你回复1点体力。',
            jsrg_guoxun: "合郭循",
            jsrgeqian: "遏前",
            jsrgeqian_info: "①结束阶段，你可以蓄谋任意次。②当你使用【杀】或蓄谋牌指定其他角色为唯一目标后，你可以令此牌不计入次数限制并获得目标一张牌，然后其可以令你本回合至其的距离+2。",
            jsrgfusha: "伏杀",
            jsrgfusha_info: "限定技。出牌阶段，若你的攻击范围内仅有一名角色，你可以对其造成X点伤害（X为你的攻击范围，至多为游戏人数）。",
            jsrg_caofang: '合曹芳',
            jsrgzhaotu: '诏图',
            jsrgzhaotu_info: '每轮限一次，你可以将一张红色非锦囊牌当【乐不思蜀】使用，此回合结束后，目标执行一个手牌上限-2的额外回合。',
            jsrgjingju: '惊惧',
            jsrgjingju_info: '你可以将其他角色判定区里的一张牌移至你的判定区里，视为你使用一张基本牌。',
            jsrgweizhui: '危坠',
            jsrgweizhui_info: '主公技，其他魏势力角色结束阶段，其可以将一张黑色手牌当【过河拆桥】对你使用。',
            jsrg_sunjun: "合孙峻",
            jsrgyaoyan: "邀宴",
            jsrgyaoyan_info: "准备阶段，你可以令所有角色依次选择是否于回合结束时议事，若议事结果为：红色，你获得任意名未议事的角色各一张手牌；黑色，你可以对一名议事的角色造成2点伤害。",
            jsrgbazheng: "霸政",
            jsrgbazheng_info: "当你参与的议事展示意见时，本回合受到过你伤害的角色意见视为与你相同。",
            jsrg_liuyong: "合刘永",
            jsrgdanxin: "丹心",
            jsrgdanxin_info: "你可以将一张牌当【推心置腹】使用，你展示以此法交出与得到的牌，以此法得到♥牌的角色回复1点体力，然后你至目标角色的距离+1直到回合结束。",
            jsrgfengxiang: "封乡",
            jsrgfengxiang_info: "锁定技。当你受到伤害后，你与一名其他角色交换装备区里的所有牌。若你装备区里的牌因此减少，你摸等同于减少牌数的牌。",
            jsrg_weiwenzhugezhi: "合卫温诸葛直",
            jsrgfuhai: "浮海",
            jsrgfuhai_info: "出牌阶段限一次。你可以令所有有手牌的其他角色同时展示一张手牌，然后你选择一个方向并摸X张牌（X为该方向上的角色展示的点数连续严格递增或严格递减的牌数，至少为1）。",
            jsrg_zhangxuan: "合张嫙",
            jsrgtongli: "同礼",
            jsrgtongli_info: "当你于出牌阶段内使用基本牌或普通锦囊牌指定第一个目标后，若你手牌中的花色数和你于本阶段内使用过的牌数相等，则你可以展示所有手牌，令此牌额外结算一次。",
            jsrgshezang: "奢葬",
            jsrgshezang_info: "每轮限一次。当你或你回合内的其他角色进入濒死状态时，你可以亮出牌堆顶的四张牌，获得其中任意张花色各不相同的牌。",
            jsrg_gaoxiang: "合高翔",
            jsrgchiying: "驰应",
            jsrgchiying_info: "出牌阶段限一次。你可以选择一名角色，令其攻击范围内的其他角色依次弃置一张牌。若以此法弃置的基本牌数不大于其体力值，其获得这些基本牌。",
            jsrg_guozhao: "合郭照",
            jsrgpianchong: "偏宠",
            jsrgpianchong_info: "一名角色的结束阶段，若你于此回合内失去过牌，你可以判定。若结果为红色/黑色，你摸此回合进入弃牌堆的红色/黑色牌数量的牌。",
            jsrgzunwei: "尊位",
            jsrgzunwei_info: "出牌阶段限一次。你可以选择一名其他角色并选择执行一项，然后移除该选项：1.将手牌数摸至与该角色相同（最多摸五张）；2.将其装备牌移至你的装备区，直到你装备区的牌数不少于其；3.将体力值回复至与该角色相同。",
            jsrg_songhuanghou: "衰宋皇后",
            jsrgzhongzen: "众谮",
            jsrgzhongzen_info: "锁定技。①弃牌阶段开始时，你令所有手牌数小于你的角色各交给你一张手牌。②弃牌阶段结束时，若你本阶段弃置的♠牌数大于你的体力值，则你弃置所有牌。",
            jsrgxuchong: "虚宠",
            jsrgxuchong_info: "当你成为牌的目标后，你可以选择一项：⒈摸一张牌；⒉令当前回合角色本回合的手牌上限+2。选择完成后，你获得一张【影】。",
            jsrg_yl_luzhi: "衰卢植",
            jsrgruzong: "儒宗",
            jsrgruzong_info: "回合结束时，若你本回合使用牌指定过的目标角色仅有一名，则你可以将手牌数摸至与其相同。若该角色为你自己，则你可以改为令任意名其他角色将手牌摸至与你相同（均至多摸五张）。",
            jsrgdaoren: "蹈刃",
            jsrgdaoren_info: "出牌阶段限一次，你可以将一张手牌交给一名其他角色，然后对你与其攻击范围内均包含的所有角色各造成１点伤害。",
            jsrg_chenfan: "衰陈蕃",
            jsrggangfen: "刚忿",
            jsrggangfen_info: "当手牌数大于你的角色使用【杀】指定其他角色为目标时，你可以成为此【杀】的额外目标，并令所有其他角色也选择是否如此做。然后使用者展示其手牌，若其黑色手牌数小于目标数，则取消此【杀】的所有目标。",
            jsrgdangren: "当仁",
            jsrgdangren_info: "转换技。阳：当你需要对自己使用【桃】时，你可以视为使用之。阴：当你可以对其他角色使用【桃】时，你须视为使用之。",
            jsrg_zhangjiao: "衰张角",
            jsrgxiangru: "相濡",
            jsrgxiangru_info: "当一名已受伤的其他角色／你受到致命伤害时，你／已受伤的其他角色可以交给伤害来源两张牌，然后防止此伤害。",
            jsrgwudao: "悟道",
            jsrgwudao_info: "觉醒技。一名角色进入濒死状态时，若你没有手牌，则你加１点体力上限并回复１点体力，然后获得〖惊雷〗。",
            jsrgjinglei: "惊雷",
            jsrgjinglei_info: "准备阶段，你可以选择一名其他角色，然后选择任意名手牌数之和小于其的角色，令这些角色依次对其造成１点雷属性伤害。",
            jsrg_liubiao: "衰刘表",
            jsrgyansha: "宴杀",
            jsrgyansha_info: "准备阶段，你可以视为对任意名角色使用【五谷丰登】。此牌结算结束后，所有非目标角色可以依次将一张装备牌当作【杀】对其中一名目标角色使用(无距离限制)。",
            jsrgqingping: "清平",
            jsrgqingping_info: "结束阶段，若你攻击范围内的角色均有手牌且手牌数均不大于你，则你可以摸等同于这些角色数的牌。",
            jsrg_dongzhuo: "衰董卓",
            jsrgguanshi: "观势",
            jsrgguanshi_info: "出牌阶段限一次，你可以将【杀】当作【火攻】对任意名角色使用。当此【火攻】对一名目标角色结算结束后，若未对其造成伤害，则此牌对其余目标角色改为以【决斗】的形式结算。",
            jsrgcangxiong: "藏凶",
            jsrgcangxiong_info: "当你因弃置或被其他角色得到牌而失去一张牌后，你可以用此牌蓄谋。然后若此时在你的出牌阶段内，则你摸一张牌。",
            jsrgjiebing: "劫柄",
            jsrgjiebing_info_identity: "觉醒技。准备阶段，若你的蓄谋牌数不小于主公的体力值，则你加２点体力上限并回复２点体力，然后获得〖暴威〗。",
            jsrgjiebing_info: "觉醒技。准备阶段，若你的蓄谋牌数不小于一号位的体力值，则你加２点体力上限并回复２点体力，然后获得〖暴威〗。",
            jsrgbaowei: "暴威",
            jsrgbaowei_info: "锁定技。结束阶段，若本回合内使用或打出过牌的其他角色数：大于２，则你失去２点体力；不大于２，则你对其中一名角色造成２点伤害。",
            jsrg_caojiewangfu: "衰曹节王甫",
            jsrgzonghai: "纵害",
            jsrgzonghai_info: "每轮限一次，当有其他角色进入濒死状态时，你可以令其选择至多两名角色。未被选择的角色不能于此次濒死结算中使用牌，且此次濒死状态结算结束后，你对其选择的角色各造成１点伤害。",
            jsrgjueyin: "绝禋",
            jsrgjueyin_info: "当你于一回合内首次受到伤害后，你可以摸三张牌，然后本回合内所有角色受到的伤害+1。",
            jsrg_huangzhong: "转黄忠",
            jsrgcuifeng: "摧锋",
            jsrgcuifeng_info: "限定技。出牌阶段，你可以视为使用一张单目标的伤害类牌（无距离限制）。此回合结束时，若此牌未造成伤害或造成的伤害值大于1，你重置〖摧锋〗。",
            jsrgdengnan: "登难",
            jsrgdengnan_info: "限定技。出牌阶段，你可以视为使用一张非伤害类普通锦囊牌。此回合结束时，若此牌的目标均于此回合受到过伤害，你重置〖登难〗。",
            jsrg_yangqiu: "衰阳球",
            jsrg_yangqiu_prefix: "衰",
            jsrgsaojian: "扫奸",
            jsrgsaojian_info: "出牌阶段限一次，你可以观看一名其他角色的手牌并选择其中一张，然后其重复弃置一张手牌（至多五张）直至其弃置了你展示的牌。然后若其手牌数大于你，你失去点体力。",
            jsrg_zhanghuan: "衰张奂",
            jsrg_zhanghuan_prefix: "衰",
            jsrgzhushou: "诛首",
            jsrgzhushou_info: "一名角色的回合结束时，若你于本回合内失去过牌，则你可以选择弃牌堆中本回合置入的点数唯一最大的牌，并对本回合失去过此牌的一名角色造成1点伤害。",
            jsrgyangge: "扬戈",
            jsrgyangge_mizhao: "密诏",
            jsrgyangge_info: "每轮限一次。体力值最低的其他角色可以于其出牌阶段内对你发动〖密诏〗。",
            jsrg_sunjun: "合孙峻",
            jsrgyaoyan: "邀宴",
            jsrgyaoyan_info: "准备阶段，你可以令所有角色依次选择是否于回合结束时议事，若议事结果为：红色，你获得任意名未议事的角色各一张手牌；黑色，你可以对一名议事的角色造成2点伤害。",
            jsrgbazheng: "霸政",
            jsrgbazheng_info: "当你参与的议事展示意见时，本回合受到过你伤害的角色意见视为与你相同。",
            jsrg_dengai: "兴邓艾",
            jsrgpiqi: "辟奇",
            jsrgpiqi_info: "出牌阶段限两次，你可以视为使用一张无距离限制的【顺手牵羊】（不能指定相同目标），与目标距离1以内的角色本回合可以将【闪】当【无懈可击】使用。",
            jsrgzhoulin: "骤临",
            jsrgzhoulin_info: "你使用【杀】对一名角色造成伤害时，若本回合开始时其不在你攻击范围内，此伤害+1。",
            jsrg_wenyang: "兴文鸯",
            jsrgfuzhen: "覆阵",
            jsrgfuzhen_info: "准备阶段，你可失去一点体力视为使用一张可指定至多三名角色且无距离限制的雷【杀】，然后你选择其中一名角色（仅你可见），此【杀】结算后：①你摸造成伤害数张牌；②若未对选择角色造成伤害，则你视为对此【杀】目标再次使用一张雷【杀】。",
            jsrg_tufashujineng: "兴秃发树机能",
            jsrgqinrao: "侵扰",
            jsrgqinrao_info: "其他角色的出牌阶段开始时，你可以将一张牌当作【决斗】对其使用。此牌结算过程中，若其手牌中有可打出的【杀】，则其必须打出；否则其展示手牌。",
            jsrgfuran: "复燃",
            jsrgfuran_info: "当你受到有来源造成的伤害后，若你不在其攻击范围内，则你可以于本回合结束时回复1点体力。",
            jsrg_simaliang: "兴司马亮",
            jsrg_simaliang_prefix: "兴",
            jsrgsheju: "慑惧",
            jsrgsheju_info: "锁定技，当你使用【杀】指定唯一目标后/成为【杀】的唯一目标后，你与目标角色/此牌使用者议事，若结果为黑色，则双方各减1点体力上限；否则意见为黑色的角色摸两张牌。",
            jsrgzuwang: "族望",
            jsrgzuwang_info: "锁定技，准备阶段和结束阶段，你将手牌数摸至体力上限。",
            jsrg_zhugedan: "兴诸葛诞",
            jsrgzuozhan: "坐瞻",
            jsrgzuozhan_info: "游戏开始时，你选择你与至多两名其他角色，你的攻击范围+X（X为选择角色中最高的体力值且至多为5）。一名“坐瞻”角色死亡后，你令一名存活的“坐瞻”角色从弃牌堆获得至多X张牌名各不相同的基本牌。",
            jsrgcuibing: "摧冰",
            jsrgcuibing_info: "锁定技，出牌阶段结束时，你将手牌摸或弃至X张（X为你攻击范围内的角色且至多为5）。若你因此弃置了牌，你弃置场上至多等量张牌，否则跳过本回合弃牌阶段。",
            jsrglangan: "阑干",
            jsrglangan_info: "锁定技，其他角色死亡后，你回复1点体力并摸两张牌，然后你的攻击范围-1（至多减3）。",
            jsrg_wangjun: '兴王濬',
            jsrgchengliu: '乘流',
            jsrgchengliu_info: '准备阶段，你可以对一名装备区内牌数小于你的角色造成1点伤害，然后你可以弃置装备区内的一张牌，对一名本回合未以此法选择过的角色重复此流程。',
            jsrgjianlou: '舰楼',
            jsrgjianlou_info: '每回合限一次，当一张装备牌进入弃牌堆时，你可以弃置一张牌并获得之，然后若此牌对应的装备栏中没有牌，你使用之。',
            jsrg_simazhao: '梦司马昭',
            jsrg_simazhao2: '梦司马昭',
            jsrg_simazhao_ab: '兴司马昭',
            jsrg_simazhao2_ab: '兴司马昭',
            jsrgqiantun: '谦吞',
            jsrgqiantun_info: '魏势力技，出牌阶段限一次，你可以令一名其他角色展示至少一张手牌，并与其拼点，其本次拼点牌只能从展示牌中选择。若你赢，你获得其展示的手牌；若你没赢，你获得其未展示的手牌。然后你展示手牌。',
            jsrgweisi: '威肆',
            jsrgweisi_info: '晋势力技，出牌阶段限一次，你可以选择一名其他角色，令其选择其任意张手牌移出游戏直到回合结束，然后视为对其使用一张【决斗】，此牌对其造成伤害后，你获得其所有手牌。',
            jsrgxiezheng: '挟征',
            jsrgxiezheng_info: '结束阶段，你可以今至多三名角色依次将一张手牌置于牌堆顶，然后视为你使用一张【兵临城下】，结算后若未造成伤害，你失去1点体力。',
            jsrgzhaoxiong: '昭凶',
            jsrgzhaoxiong_info: '持恒技，限定技，准备阶段，若你已受伤且发动过技能“挟征”，你可以将势力变更为晋，然后你获得技能“荡异”。',
            jsrgdangyi: '荡异',
            jsrgdangyi_info: '主公技，当你造成伤害时，你可以令此伤害值+1，本局游戏限X次（X为你获得此技能时已损失体力值+1）。',
            jsrg_limi: "兴李密",
            jsrgciyin: "辞应",
            jsrgciyin_info: "每回合限一次，你可以将至少X张牌当作任意基本牌使用或打出（X为此回合未进入过弃牌堆的花色数且至少为1）。此牌结算完成后，若本回合所有花色的牌均进入过弃牌堆，你将手牌摸至体力上限。",
            jsrgchendu: "陈笃",
            jsrgchendu_info: "锁定技，你的牌因使用、打出或弃置而进入弃牌堆时，若这些牌的数量大于你的体力值，你将这些牌交给至多等量名其他角色（若不为你的回合，选择的角色需包括当前回合角色）。",
            jsrg_malong: '兴马隆',
            jsrgfennan: '奋难',
            jsrgfennan_info: '出牌阶段限X次。你可令一名角色选择一项：令你翻面，然后你移动其场上一张本回合未移动过的牌，或令你观看并重铸其至多三张手牌。',
            jsrgxunji: '勋济',
            jsrgxunji_info: '结束阶段，若你于本回合对回合内你使用牌指定过的其他角色均造成过伤害，你可将弃牌堆中本回合造成伤害的牌分配给至多等量角色各一张。',

            offline_qi: '江山如故·起',
            offline_cheng: '江山如故·承',
            offline_zhuan: '江山如故·转',
            offline_he: '江山如故·合',
            offline_xing: '江山如故·兴',
            offline_shuai: '江山如故·衰',
        },
"skill": {
            jsrgfennan: {
                audio: 2,
                enable: 'phaseUse',
                filter: function (event, player) {
                    return player.countMark('jsrgfennanx') < player.countCards('e');
                },
                selectTarget: 1,
                filterTarget: true,
                prompt: '令一名角色选择一项：你移动其场上牌，或你重铸其手牌',
                content: function () {
                    'step 0'
                    var list = [];
                    event.num = player.countCards('e');
                    player.addMark('jsrgfennanx', 1);
                    list.push('翻面并移动你场上的一张牌');
                    list.push('观看并重铸你至多3张手牌');
                    target.chooseControl(list)
                        .set('prompt', '请选择一项令' + get.translation(player) + '执行')
                        .set('ai', function () {
                            return list.randomGet();
                        });
                    'step 1'
                    if (result.control == '翻面并移动你场上的一张牌') {
                        player.turnOver();
                        player.chooseTarget(1, function (card, player, current) {
                            return target != current;
                        }, true)
                            .set('ai', target => {
                                return get.attitude(_status.event.player, target);
                            })
                            .set('prompt', '请选择1名角色，将' + get.translation(target) + '场上的1张牌移至其他区域');
                    } else {
                        if (target.countCards('h') == 0) {
                            event.finish();
                            return;
                        }
                        player.choosePlayerCard('h', [1, 3], target, true)
                            .set('prompt', "请重铸其中的至多3张牌");
                        event.goto(4);
                    }
                    'step 2'
                    if (result.bool) {
                        event.togain = result.targets[0];
                        event.targets = [target, event.togain];
                        var filter = card => (get.position(card) == 'e' && event.togain.isEmpty(get.subtype(card)) || event.togain.canAddJudge(card)) && !player.getStorage('jsrgfennan')
                            .contains(card);
                        var map = new Map();
                        var filtermap = button => player.getStorage('jsrgfennan')
                            .contains(button.link);
                        var filtermap2 = button => !target.getCards('ej')
                            .contains(button.link);
                        map.set(filtermap, '本回合移动过');
                        map.set(filtermap2, '');
                        if (target.getCards('ej')
                            .filter(filter)
                            .length == 0) event.finish();
                        else player.chooseToDisplace(event.targets, 'ej', true)
                            .set('prompt', '请选择1名角色，将' + get.translation(target) + '场上的1张牌移至其他区域')
                            .set('filterMap', map)
                            .set('ai', function (button) {
                                return get.effect(event.togain, button.link, event.togain, event.togain);
                            });
                    }
                    'step 3'
                    if (result.bool && result.links.length) {
                        for (var i = 0; i < result.links.length; i++) {
                            var filter = current => current.getCards('ej')
                                .contains(result.links[i]);
                            var togives = event.targets.filter(filter),
                                togive = togives[0],
                                togain = togive == event.targets[0] ? event.targets[1] : event.targets[0];
                            if (get.position(result.links[i]) == 'e') togain.equip(result.links[i]);
                            else if (result.links[i].viewAs) {
                                togain.addJudge({
                                    name: result.links[i].viewAs
                                }, [result.links[i]]);
                            } else togain.addJudge(result.links[i].viewAs || result.links[i]);
                            if (!player.storage.jsrgfennan) player.storage.jsrgfennan = [];
                            player.storage.jsrgfennan.push(result.links[i]);
                            game.log(togive, '的', result.links[i], '被移动给了', togain);
                        }
                    }
                    event.finish();
                    'step 4'
                    if (result.bool) {
                        target.loseToDiscardpile(result.links)
                            .delay = false;
                        target.draw(result.links.length);
                    }
                },
                group: ['jsrgfennan_clear', 'jsrgfennan_remove'],
                subSkill: {
                    clear: {
                        trigger: {
                            player: 'phaseAfter'
                        },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.getStorage('jsrgfennan');
                        },
                        content: function () {
                            delete player.storage.jsrgfennan;
                        },
                    },
                    remove: {
                        trigger: {
                            player: 'phaseUseAfter'
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            player.removeMark('jsrgfennanx', player.countMark('jsrgfennanx'));
                        }
                    },
                },
            },
            jsrgxunji: {
                audio: 2,
                trigger: {
                    player: 'phaseJieshuBegin'
                },
                delay: false,
                filter: function (event, player) {
                    var filter = current => current != player && player.hasHistory('useCard', function (evt) {
                        return evt.targets.contains(current);
                    });
                    var players = game.players.slice()
                        .concat(game.dead);
                    if (players.filter(filter)
                        .length == 0) return false;
                    var cards = [];
                    players.forEach(function (current) {
                        current.getHistory('damage', function (evt) {
                            var filter = card => !cards.contains(card) && get.position(card, true) == 'd';
                            cards.addArray(evt.cards.filter(filter));
                        });
                    });
                    var bool = true;
                    players.filter(filter)
                        .forEach(function (current) {
                            if (!player.hasHistory('sourceDamage', function (evt) {
                                return evt.player == current;
                            })) bool = false;
                        });
                    return cards.length > 0 && bool;
                },
                prompt: '你是否发动勋济',
                content: function () {
                    'step 0'
                    var players = game.players.slice()
                        .concat(game.dead);
                    event.cards = [];
                    players.forEach(function (current) {
                        current.getHistory('damage', function (evt) {
                            var filter = card => !event.cards.contains(card) && get.position(card, true) == 'd';
                            event.cards.addArray(evt.cards.filter(filter));
                        });
                    });
                    window._updateCardnumberBan = true;
                    event.map = new Map();
                    event.VirtualCards = [];
                    event.VirtualCardsCopy = [];
                    for (var i = 0; i < event.cards.length; i++) {
                        var card = game.createCard(
                            event.cards[i].name,
                            get.suit(event.cards[i]),
                            get.number(event.cards[i]),
                            event.cards[i].nature);
                        card.storage.VirtualRef = i;
                        event.VirtualCards.push(card);
                    }
                    'step 1'
                    event.PlayerCards = player.getCards('hs');
                    if (event.PlayerCards.length) for (var card of event.PlayerCards) card.remove();
                    if (event.VirtualCards.length) player.directgain2(event.VirtualCards, null, null);
                    'step 2'
                    if (!event.reset) event.reset = ui.create.control('重置', function () {
                        event.map.clear();
                        var containers = document.querySelectorAll('.virtualContainer');
                        for (var container of containers) container.remove();
                        event.VirtualCards.addArray(event.VirtualCardsCopy);
                        event.VirtualCardsCopy = [];
                        ui.click.cancel();
                    });
                    if (!event.confirm) event.confirm = ui.create.control('确定', function () {
                        if (ui.selected.cards.length == 0 || ui.selected.targets.length == 0) return;
                        ui.click.ok();
                    });
                    if (!event.desist) event.desist = ui.create.control('结束分配', function () {
                        event.VirtualCardsCopy.addArray(event.VirtualCards);
                        event.VirtualCards = [];
                        ui.click.cancel();
                    });
                    'step 3'
                    player.chooseCardTarget({
                        prompt: '你可以将其中的牌分配给任意名角色各一张',
                        forced: true,
                        filterTarget: function (card, player, target) {
                            var keys = Array.from(event.map.keys());
                            game.filterPlayer(function (current) {
                                if (keys.contains(current)) {
                                    var node;
                                    if (current.node.prompt) {
                                        node = current.node.prompt;
                                        node.innerHTML = '';
                                        node.className = 'damage normal-font damageadded';
                                    } else {
                                        node = ui.create.div('.damage.normal-font', current);
                                        current.node.prompt = node;
                                        ui.refresh(node);
                                        node.classList.add('damageadded');
                                    }
                                    node.style.zIndex = '200';
                                    var biaoji = ui.create.div('.yiyoubiaoji', node);
                                    biaoji.style.left = '55%'
                                    biaoji.style.top = "15px";
                                    var ff = '已分配过牌';
                                    for (var j = 0; j < ff.length; j++) biaoji.innerHTML += ff[j] + '<br>';
                                }
                            });
                            return !keys.contains(target);
                        },
                        filterCard: function (card) {
                            return event.VirtualCards.contains(card);
                        },
                        selectCard: function () {
                            if ((ui.selected.cards.length == 0 || ui.selected.targets.length == 0) && !event.confirm.classList.contains('gray')) event.confirm.classList.add('gray');
                            if (ui.selected.cards.length > 0 && ui.selected.targets.length > 0 && event.confirm.classList.contains('gray')) event.confirm.classList.remove('gray');
                            if (event.VirtualCardsCopy.length == 0 && !event.reset.classList.contains('distype')) event.reset.classList.add('distype');
                            if (event.VirtualCardsCopy.length > 0 && event.reset.classList.contains('distype')) event.reset.classList.remove('distype');
                            return 1;
                        },
                        ai1: function (card) {
                            return 6 - get.value(card);
                        },
                        ai2: function (target) {
                            var att = get.attitude(player, target);
                            if (target.hasSkillTag('nogain')) att /= 9;
                            return 4 + att;
                        },
                    })
                        .set('autox', true);
                    'step 4'
                    if (result.bool) {
                        var target = result.targets[0];
                        var ResultCard = [];
                        for (var card of result.cards) {
                            ResultCard.push(event.cards[card.storage.VirtualRef]);
                            event.VirtualCards.remove(card);
                            event.VirtualCardsCopy.push(card);
                            var virtualContainer = ui.create.div('.virtualContainer', card);
                            ui.create.div('.virtualText', virtualContainer)
                                .innerHTML = '已分配给';
                            ui.create.div('.virtualName', virtualContainer)
                                .innerHTML = get.translation(target);
                        }
                        event.map.get(target) ? event.map.set(target, event.map.get(target)
                            .addArray(ResultCard)) : event.map.set(target, ResultCard);
                    }
                    'step 5'
                    if (event.VirtualCards.length > 0) event.goto(3);
                    else {
                        if (event.confirm) event.confirm.remove();
                        if (event.reset) event.reset.remove();
                        if (event.desist) event.desist.remove();
                        for (var card of event.VirtualCardsCopy) card.remove();
                        if (event.PlayerCards.length) for (var card of event.PlayerCards) player.node.handcards1.appendChild(card);
                        if (window._updateCardnumberBan) delete window._updateCardnumberBan;
                        var keys = Array.from(event.map.keys());
                        keys.sortBySeat();
                        for (var key of keys) if (key.isIn()) key == game.me ? key.gain(event.map.get(key), player)
                            .nodelay = true : key.gain(event.map.get(key), player, 'gain2')
                                .nodelay = true;
                    }
                },
            },
            jsrgciyin: {
                audio: 2,
                enable: ['chooseToUse', 'chooseToRespond'],
                usable: 1,
                hiddenCard: function (player, name) {
                    if (get.type(name) == 'basic' && lib.inpile.contains(name) && Math.max(lib.skill.dcqinshen.getNum(), 1) <= player.countCards('he')) return true;
                },
                filter: function (event, player) {
                    if (event.responded || event.jsrgciyin) return false;
                    if (Math.max(lib.skill.dcqinshen.getNum(), 1) > player.countCards('he')) return false;
                    for (var i of lib.inpile) {
                        if (get.type(i) == 'basic' && event.filterCard({
                            name: i
                        }, player, event)) return true;
                    }
                    return false;
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];

                        for (var i of lib.inpile) {
                            if (get.type(i) != 'basic') continue;
                            var card = {
                                name: i,
                                isCard: true
                            };
                            if (event.filterCard(card, player, event)) list.push(['基本', '', i]);
                            if (i == 'sha') {
                                for (var j of lib.inpile_nature) {
                                    card.nature = j;
                                    if (event.filterCard(card, player, event)) list.push(['基本', '', i, j]);
                                }
                            }
                        }
                        if (list.length == 0) {
                            return ui.create.dialog('辞应已无可用牌');
                        }
                        return ui.create.dialog('辞应', [list, 'vcard'], 'hidden')
                    },
                    check: function (button) {
                        if (button.link[2] == 'shan') return 3;
                        var player = _status.event.player;
                        if (button.link[2] == 'jiu') {
                            if (player.getUseValue({
                                name: 'jiu'
                            }) <= 0) return 0;
                            if (player.countCards('h', 'sha')) return player.getUseValue({
                                name: 'jiu'
                            });
                        }
                        return player.getUseValue({
                            name: button.link[2],
                            nature: button.link[3]
                        }) / 4;
                    },
                    backup: function (links, player) {
                        return {
                            selectCard: () => [Math.max(1, lib.skill.dcqinshen.getNum()), player.countCards('he')],
                            filterCard: true,
                            popname: true,
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                jsrgciyin: true,
                            },
                            position: 'he',
                            check: function (card) {
                                var player = _status.event.player;
                                if (player.countCards('he') <= lib.skill.dcqinshen.getNum() || (ui.selected.cards.length)) return -1;
                                if (lib.skill.jsrgciyin_backup.viewAs.name == 'jiu' && !player.countCards('h', function (cardx) {
                                    return card != cardx && !ui.selected.cards.contains(cardx) && get.name(cardx, player) == 'sha';
                                })) return 0;
                                return Math.max(0.01, 6 - get.value(card));
                            },
                        }
                    },
                    prompt: function (links, player) {
                        var name = links[0][2];
                        var nature = links[0][3];
                        return '将至少' + get.cnNumber(Math.max(lib.skill.dcqinshen.getNum(), 1)) + '张牌当做' + (get.translation(nature) || '') + get.translation(name) + '使用';
                    },
                },
                group: ['jsrgciyin_draw', 'jsrgciyin_mark'],
                subSkill: {
                    backup: {
                        audio: 'jsrgciyin'
                    },
                    draw: {
                        charlotte: true,
                        trigger: {
                            global: ["cardsDiscardAfter"]
                        },
                        forced: true,
                        filter(event, player) {
                            const evt = event.getParent();
                            if (evt.name != "orderingDiscard") return false;
                            const evtx = evt.relatedEvent || evt.getParent();
                            if (evtx.skill != "jsrgciyin_backup" || evtx.player != player) return false;
                            let suits = [];
                            game.getGlobalHistory("cardMove", function (evt) {
                                if (suits.length >= 4) return;
                                if (evt.name == "lose") {
                                    if (evt.position == ui.discardPile) {
                                        for (var i of evt.cards) suits.add(get.suit(i, false));
                                    }
                                } else {
                                    if (evt.name == "cardsDiscard") {
                                        for (var i of evt.cards) suits.add(get.suit(i, false));
                                    }
                                }
                            });
                            return suits.length >= 4 && player.countCards("h") < player.maxHp;
                        },
                        content: function () {
                            player.drawTo(player.maxHp);
                        },
                    },
                    mark: {
                        trigger: {
                            global: ['phaseAfter', 'loseAfter', 'cardsDiscardAfter'],
                        },
                        forced: true,
                        firstDo: true,
                        silent: true,
                        filter: function (event, player) {
                            if (event.name == 'phase') return true;
                            if (event.name == 'lose') return event.position == ui.discardPile;
                            return true;
                        },
                        content: function () {
                            if (trigger.name == 'phase') {
                                player.unmarkSkill('jsrgciyin_mark');
                                return;
                            }
                            var suits = [];
                            game.getGlobalHistory('cardMove', function (evt) {
                                if (suits.length >= 4) return;
                                if (evt.name == 'lose') {
                                    if (evt.position == ui.discardPile) {
                                        for (var i of evt.cards) suits.add(get.suit(i, false));
                                    }
                                } else {
                                    if (evt.name == 'cardsDiscard') {
                                        for (var i of evt.cards) suits.add(get.suit(i, false));
                                    }
                                }
                            });
                            player.storage.jsrgciyin_mark = suits;
                            player.markSkill('jsrgciyin_mark');
                        },
                        intro: {
                            onunmark: true,
                            content: '本回合已有$花色的牌进入过弃牌堆',
                        },
                    },
                },
            },
            jsrgchendu: {
                audio: 2,
                trigger: {
                    global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter']
                },
                filter: function (event, player, name) {
                    if (name == "cardsDiscardAfter") {
                        const evt = event.getParent();
                        if (evt.name != "orderingDiscard") return false;
                        const evtx = evt.relatedEvent || evt.getParent();
                        if (!["useCard", "respond"].includes(evtx.name) || evtx.player != player) return false;
                        return event.cards.filterInD("d").length > player.hp;
                    }
                    if (event.type != "discard" || event.getlx === false) return false;
                    let evt = event.getl(player);
                    if (!evt || !evt.cards2 || !evt.cards2.length) return false;
                    return evt.cards2.length > player.hp;
                },
                forced: true,
                locked: true,
                content: function () {
                    'step 0'
                    event.boolx = _status.currentPhase && _status.currentPhase.isIn();
                    let cardsy;
                    if (trigger.name == 'cardsDiscard') cardsy = trigger.cards.filterInD('d');
                    else {
                        let players = game.players.slice().concat(game.dead);
                        cardsy = players.reduce((list, player) => {
                            const evt = trigger.getl(player);
                            if (evt && evt.cards2 && evt.cards2.length) {
                                return list.addArray(evt.cards2);
                            }
                            return list;
                        }, []).filterInD('d');
                    }
                    event.cards = cardsy;
                    if (_status.connectMode) game.broadcastAll(function () {
                        _status.noclearcountdown = true
                    });
                    event.given_map = {};
                    'step 1'
                    if (event.cards.length > 1) {
                        player.chooseCardButton('陈笃：请选择要分配的牌', true, event.cards, [1, event.cards.length]).set('ai', function (button) {
                            if (ui.selected.buttons.length) return 0;
                            return get.value(button.link, _status.event.player);
                        });
                    } else if (event.cards.length == 1) event._result = {
                        links: event.cards.slice(0),
                        bool: true
                    };
                    else event.finish();
                    'step 2'
                    if (result.bool) {
                        var cards = result.links;
                        event.cards2 = cards;
                        player.chooseTarget('选择一名角色获得' + get.translation(cards), function (card, player, target) {
                            var evt = _status.event.getParent();
                            var cards = evt.cards,
                                cards2 = evt.cards2.slice();
                            if (cards.removeArray(cards2).length > 0 || !evt.boolx) return true;
                            return target == _status.currentPhase;
                        }, event.cards.length == 1).set('ai', function (target) {
                            var att = get.attitude(_status.event.player, target);
                            if (_status.event.enemy) return Math.max(0.01, 100 - att);
                            else if (att > 0) return Math.max(0.1, att / (1 + target.countCards('h') + (_status.event.getParent().given_map[target.playerid] || 0)));
                            else return Math.max(0.01, (100 + att) / 100);
                        }).set('enemy', get.value(cards[0], player, 'raw') < 0);
                    }
                    'step 3'
                    if (result.bool) {
                        var cards = event.cards2;
                        event.cards.removeArray(cards);
                        event.togive = cards.slice(0);
                        if (result.targets.length) {
                            if (result.targets[0] == _status.currentPhase) event.boolx = false;
                            var id = result.targets[0].playerid,
                                map = event.given_map;
                            if (!map[id]) map[id] = [];
                            map[id].addArray(event.togive);
                        }
                        if (event.cards.length > 0) event.goto(1);
                    } else event.goto(1);
                    'step 4'
                    if (_status.connectMode) game.broadcastAll(function () {
                        delete _status.noclearcountdown;
                        game.stopCountChoose()
                    });
                    var list = [];
                    for (var i in event.given_map) {
                        var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
                        player.line(source, 'green');
                        list.push([source, event.given_map[i]]);
                        game.log(source, '获得了', event.given_map[i]);
                    }
                    game.loseAsync({
                        gain_list: list,
                        giver: player,
                        animate: 'gain2',
                    }).setContent('gaincardMultiple');
                },
            },
            //玄司马昭
            jsrgqiantun: {
                audio: 4,
                enable: 'phaseUse',
                usable: 1,
                groupSkill: true,
                filter: function (event, player) {
                    if (player.group != 'wei') return false;
                    return game.hasPlayer(current => player.canCompare(current));
                },
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return target != player && player.canCompare(target);
                },
                prompt: '选择1名角色，令其展示手牌',
                content: function () {
                    'step 0'
                    target.chooseCard('h', [1, Infinity], true).set('prompt', '展示至少1张手牌').set('ai', card => {
                        const {
                            player, maxNum, minNum
                        } = event.target;
                        if (maxNum > 12) return 2;
                        if (minNum < 2) {
                            if (get.number(card, player) == minNum) return 2;
                            return 0;
                        }
                        if ([minNum, maxNum].some(num => get.number(card, player) == num)) return 1;
                        return Math.random() - 0.5;
                    });
                    'step 1'
                    if (result.bool) {
                        event.cards = result.cards;
                        target.showCards(event.cards);
                        if (event.cards.length > 1) {
                            target.chooseButton(['请选择要用来拼点的展示牌', event.cards], true).set('ai', function (button) {
                                return Math.random();
                            });
                        } else {
                            result.links = event.cards;
                        }
                    }
                    'step 2'
                    var next = player.chooseToCompare(target);
                    if (!next.fixedResult) next.fixedResult = {};
                    next.fixedResult[target.playerid] = result.links[0];
                    'step 3'
                    if (result.bool) player == game.me ? player.gain(event.cards, target) : player.gain(event.cards, target, 'giveAuto');
                    else {
                        var filter = card => !event.cards.contains(card);
                        var togains = target.getCards('h').filter(filter);
                        if (togains.length > 0) player == game.me ? player.gain(togains, target) : player.gain(togains, target, 'giveAuto');
                    }
                    'step 4'
                    player.showCards(player.getCards('h'));
                },
                ai: {
                    order: 8,
                    result: {
                        target: -1,
                    },
                },
            },
            jsrgxiezheng: {
                audio: 2,
                audioname: ['jsrg_simazhao2'],
                trigger: {
                    player: 'phaseJieshuBegin'
                },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseTarget([1, 3], (card, player, target) => {
                        return target.countCards('h') > 0;
                    }).set('ai', target => {
                        if (!_status.event.goon) return 0;
                        return 2 - get.attitude(_status.event.player, target);
                    }).set('prompt', '你可令至多3名角色将1张手牌置于牌堆顶').set('goon', 3 / 2 < game.countPlayer(current => {
                        return 2 - get.attitude(player, current) > 0;
                    }));
                    'step 1'
                    if (result.bool) {
                        player.storage.jsrgxiezheng = true;
                        event.targets = result.targets;
                        event.targets.sortBySeat();
                        player.logSkill('jsrgxiezheng', event.targets);
                        event.num = 0;
                    } else event.finish();
                    'step 2'
                    if (event.num < event.targets.length) {
                        event.targets[event.num].chooseCard('h', true).set('prompt', '将1张手牌置于牌堆顶');
                    } else {
                        player.chooseUseTarget({
                            name: 'binglinchengxiax'
                        }, true).set('prompt', '亮出牌堆顶的四张牌，对目标使用其中的【杀】');
                        event.finish();
                    }
                    'step 3'
                    if (result.bool) {
                        event.targets[event.num].lose(result.cards, ui.cardPile, 'insert');
                        event.num++;
                    }
                    'step 4'
                    game.updateRoundNumber();
                    event.goto(2);
                },
                group: 'jsrgxiezheng_effect',
                subSkill: {
                    effect: {
                        trigger: {
                            player: 'showCardsAfter'
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.getParent().name == 'binglinchengxiax' && event.getParent(4).name == 'jsrgxiezheng';
                        },
                        content: function () {
                            var filter = card => card.name == 'sha';
                            var effectCards = trigger.cards.filter(filter);
                            if (effectCards.length > 0) {
                                for (var card of effectCards) {
                                    if (!card.storage) card.storage = {};
                                    card.storage.jsrgxiezheng = true;
                                }
                            }
                            player.addSkill('jsrgxiezheng_damage');
                            player.addSkill('jsrgxiezheng_settle');
                        },
                    },
                    damage: {
                        trigger: {
                            global: 'damageAfter',
                        },
                        filter: function (event, player) {
                            return event.card && event.card.name == 'sha' && event.card.storage && event.card.storage.jsrgxiezheng == true;
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            trigger.getParent(2).player.removeSkill('jsrgxiezheng_damage');
                            trigger.getParent(2).player.removeSkill('jsrgxiezheng_settle');
                        },
                    },
                    settle: {
                        audio: 'jsrgxiezheng',
                        trigger: {
                            player: 'useCardAfter'
                        },
                        frequent: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return event.card && event.card.name == 'binglinchengxiax' && event.getParent(2).name == 'jsrgxiezheng';
                        },
                        content: function () {
                            player.removeSkill('jsrgxiezheng_damage');
                            player.removeSkill('jsrgxiezheng_settle');
                            player.loseHp();
                        },
                    },
                },
            },
            jsrgzhaoxiong: {
                audio: 2,
                trigger: {
                    player: 'phaseZhunbeiBegin'
                },
                limited: true,
                delay: false,
                skillAnimation: true,
                animationColor: 'fire',
                owner: 'jsrg_simazhao',
                filter: function (event, player) {
                    return player.isDamaged() && player.storage.jsrgxiezheng == true;
                },
                prompt: '你是否发动昭凶',
                content: function () {
                    player.awakenSkill('jsrgzhaoxiong');
                    player.swapBackground('jsrgzhaoxiong');
                    player.changeGroup('qun');
                    player.removeSkill('jsrgqiantun');
                    player.addSkill('jsrgweisi');
                    player.addSkill('jsrgdangyi');
                },
                ai: {
                    order: 15,
                    result: {
                        player: function (player) {
                            if (player.hasValueTarget(card) > 3 || player.maxHp - player.hp >= 3) return 5;
                            return 0;
                        }
                    }
                },
            },
            jsrgweisi: {
                audio: 3,
                enable: 'phaseUse',
                usable: 1,
                groupSkill: true,
                selectTarget: 1,
                filter: function (event, player) {
                    if (player.group != 'qun') return false;
                    return true;
                },
                filterTarget: function (card, player, target) {
                    return target != player && target.countCards('h') > 0;
                },
                prompt: '你可发动威肆，令一名角色选择任意张手牌移出游戏',
                content: function () {
                    'step 0'
                    target.chooseCard('h', [1, Infinity], true).set('prompt', '选择任意张手牌移出游戏').set('ai', card => {
                        return -get.value(card);
                    });
                    'step 1'
                    if (result.bool) {
                        game.cardsGotoSpecial(result.cards);
                        target.addSkill('jsrgweisi_gain');
                        if (player.canUse('juedou', target, false)) {
                            player.addTempSkill('jsrgweisi_damage', 'jsrgweisiAfter');
                            player.useCard({
                                name: 'juedou',
                                isCard: true
                            }, target, false);
                        }
                    }
                },
                subSkill: {
                    gain: {
                        trigger: {
                            global: 'phaseEnd'
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            player.removeSkill('jsrgweisi_gain');
                            var evts = game.getGlobalHistory('cardMove', function (evt) {
                                return evt.getParent().name == 'jsrgweisi' && evt.getParent().target == player;
                            });
                            var cards = [];
                            for (var i = evts.length - 1; i >= 0; i--) {
                                var evt = evts[i];
                                for (var card of evt.cards) cards.push(card);
                            }
                            if (cards.length > 0) player.gain(cards);
                        },
                    },
                    damage: {
                        audio: 'jsrgweisi',
                        trigger: {
                            source: 'damageSource'
                        },
                        frequent: true,
                        charlotte: true,
                        logTarget: 'player',
                        filter: function (event, player) {
                            return event.card && event.card.name == 'juedou' && event.getParent(3).name == 'jsrgweisi' && event.player.isIn();
                        },
                        content: function () {
                            player.removeSkill('jsrgweisi_damage');
                            var cards = trigger.player.getCards('h');
                            if (cards.length > 0) player == game.me ? player.gain(cards, trigger.player) : player.gain(cards, trigger.player, 'giveAuto');
                        },
                    },
                },
            },
            jsrgdangyi: {
                audio: 2,
                trigger: {
                    source: 'damageBegin1'
                },
                delay: false,
                zhuSkill: true,
                filter: function (event, player) {
                    return player.hasSkill('jsrgdangyi') && player.countMark('jsrgdangyix') > 0;
                },
                init: function (player) {
                    player.addMark('jsrgdangyix', player.getDamagedHp() + 1);
                },
                prompt: '你可发动荡异，令此伤害+1',
                content: function () {
                    player.removeMark('jsrgdangyix', 1);
                    trigger.num++;
                },
                ai: {
                    order: 9,
                    result: {
                        target: -1,
                    },
                },
            },
            //兴王濬
            jsrgchengliu: {
                audio: 2,
                trigger: {
                    player: 'phaseZhunbeiBegin'
                },
                direct: true,
                filter: function (event, player) {
                    return player.countCards('e') > 0;
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(function (card, player, target) {
                        return target != player && target.countCards('e') < player.countCards('e');
                    }).set('prompt', '你可以对一名装备区内牌数小于你的角色造成1点伤害');
                    'step 1'
                    if (result.bool) {
                        player.logSkill('jsrgchengliu', result.targets[0]);
                        if (!player.storage.jsrgchengliu) player.storage.jsrgchengliu = [];
                        player.storage.jsrgchengliu.add(result.targets[0]);
                        player.addSkill('jsrgchengliu_clear');
                        player.addSkill('jsrgchengliu_redo');
                        result.targets[0].damage(1, player);
                    } else event.finish();
                },
                subSkill: {
                    clear: {
                        trigger: {
                            player: 'phaseAfter'
                        },
                        filter: function (event, player) {
                            return player.getStorage('jsrgchengliu');
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            player.removeSkill('jsrgchengliu_clear');
                            delete player.storage.jsrgchengliu;
                        },
                    },
                    redo: {
                        trigger: {
                            player: 'jsrgchengliuAfter'
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.removeSkill('jsrgchengliu_redo');
                            player.chooseToDiscard('e').set('prompt', '你可以弃置装备区内的1张牌，重复此流程').set('ai', function (card) {

                            }).set('logSkill', 'jsrgchengliu');
                            'step 1'
                            if (result.bool) player.chooseTarget(function (card, player, target) {
                                return target != player && target.countCards('e') < player.countCards('e') && !player.getStorage('jsrgchengliu').contains(target);
                            }).set('prompt', '你可以对一名装备区内牌数小于你的角色造成1点伤害');
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                player.logSkill('jsrgchengliu', result.targets[0]);
                                if (!player.storage.jsrgchengliu) player.storage.jsrgchengliu = [];
                                player.storage.jsrgchengliu.add(result.targets[0]);
                                result.targets[0].damage(1, player);
                            }
                        },
                    },
                },
            },
            jsrgjianlou: {
                audio: 2,
                trigger: {
                    global: ['useCardAfter', 'loseAfter', 'cardsDiscardAfter', 'loseAsyncAfter', 'equipAfter']
                },
                usable: 1,
                direct: true,
                filter: function (event, player) {
                    if (event.name == 'useCard') {
                        if (!event.card.isCard) return false;
                        var cards = event.cards.filterInD();
                        if (!cards.filter(function (card) {
                            return get.type(card, false) == 'equip';
                        }).length) return false;
                    } else if (event.name != 'cardsDiscard') {
                        var cards = event.getd(null, 'cards2').filter(function (card) {
                            if (get.position(card, true) != 'd') return false;
                            var type = get.type(card, false);
                            return type == 'equip';
                        });
                        if (!cards.length) return false;
                    } else {
                        var evtx = event.getParent();
                        if (evtx.name != 'orderingDiscard') return false;
                        var evt2 = (evtx.relatedEvent || evtx.getParent());
                        if (evt2.name != 'phaseJudge') return;
                        var cards = event.cards.filter(function (card) {
                            if (get.position(card, true) != 'd') return false;
                            var type = get.type(card, false);
                            return type == 'equip';
                        });
                        if (!cards.length) return false;
                    }
                    return true;
                },
                content: function () {
                    'step 0'
                    player.chooseToDiscard('he').set('prompt', '你可以弃置1张牌并获得装备牌').set('ai', function (card) {

                    }).set('logSkill', 'jsrgjianlou');
                    'step 1'
                    if (result.bool) {
                        var cards;
                        var filter = card => get.type(card, false) == 'equip';
                        if (trigger.name == 'useCard') {
                            cards = trigger.cards.filterInD().filter(filter);
                        } else if (trigger.name != 'cardsDiscard') {
                            cards = trigger.getd().filter(function (card) {
                                if (card.original == 'j' || get.position(card, true) != 'd') return false;
                                var type = get.type(card, false);
                                return type == 'equip';
                            });
                        } else {
                            cards = trigger.cards.filter(function (card) {
                                if (get.position(card, true) != 'd') return false;
                                var type = get.type(card, false);
                                return type == 'equip';
                            });
                        }
                        player == game.me ? player.gain(cards[0]) : player.gain(cards[0], 'gain2');
                        event.cards = cards;
                    } else {
                        player.storage.counttrigger.jsrgjianlou--;
                        event.finish();
                    }
                    'step 2'
                    var name = get.info(event.cards[0]).subtype;
                    if (name) name = parseInt(name[5]);
                    if (player.getCards('h').contains(event.cards[0]) && !player.getEquip(name)) player.chooseUseTarget(event.cards[0], 'nopopup', true);
                },
            },
            jsrgzuozhan: {
                audio: 2,
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                forced: true,
                filter: function (event, player) {
                    return event.name != "phase" || game.phaseNumber == 0;
                },
                direct: true,
                intro: {
                    content: '已选择$为〖坐瞻〗目标',
                },
                content: function () {
                    'step 0'
                    player.markAuto('jsrgzuozhan', [player]);
                    player.chooseTarget([1, 2], true, get.prompt2("jsrgzuozhan"), lib.filter.notMe);
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets.sortBySeat();
                        player.logSkill('jsrgzuozhan', targets);
                        for (var i of targets) player.markAuto('jsrgzuozhan', [i]);
                        var list = targets.filter(target => {
                            var num = target.hp;
                            return targets.every(targetx => {
                                return targetx.hp <= num;
                            });
                        });
                        if (list.length) {
                            event.list = list;
                            event.current = event.list.shift();
                        } else event.finish();
                        player.addMark("jsrgzuozhan_range", Math.min(Math.max(event.current.hp, player.hp), 5));
                        game.delayx();
                    }
                },
                group: ["jsrgzuozhan_range", "jsrgzuozhan_gain"],
                subSkill: {
                    range: {
                        intro: {
                            content: function (storage, player) {
                                var num = player.countMark('jsrgzuozhan_range');
                                return '攻击范围' + (num >= 0 ? '+' : '') + num;
                            }
                        },
                        mod: {
                            attackRange: function (player, num) {
                                return num + player.countMark('jsrgzuozhan_range');
                            },
                        },
                    },
                    gain: {
                        trigger: {
                            global: "dieAfter",
                        },
                        filter(event, player) {
                            if (!player.getStorage("jsrgzuozhan").includes(event.player)) return false;
                            return game.hasPlayer(current => current.isIn() && player.getStorage("jsrgzuozhan").includes(current));
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.chooseTarget("坐瞻：令一名“坐瞻”角色获得" + player.countMark("jsrgzuozhan_range") + "张不同牌名的基本牌", true).set("filterTarget", (card, player, target) => {
                                return target.isIn() && player.getStorage("jsrgzuozhan").includes(target);
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                let cards = [],
                                    num = player.countMark("jsrgzuozhan_range");
                                while (cards.length < num) {
                                    const card = get.discardPile(card => {
                                        if (get.type(card) != "basic") return false;
                                        if (!cards.length) return true;
                                        return cards.every(cardx => cardx.name != card.name);
                                    });
                                    if (card) cards.add(card);
                                    else break;
                                }
                                if (cards.length) target.gain(cards, "gain2");
                            }
                        },
                    },
                },
            },
            jsrgcuibing: {
                trigger: {
                    player: "phaseUseEnd",
                },
                forced: true,
                content: function () {
                    'step 0'
                    var num = Math.min(5, game.countPlayer(current => player.inRange(current)));
                    var numx = player.countCards("h");
                    if (numx <= num) {
                        player.drawTo(num);
                        player.addTempSkill("jsrgcuibing_keji");
                        event.finish();
                    } else {
                        var discard = numx - num;
                        player.chooseToDiscard("h", discard, true);
                        event.count = discard;
                    }
                    'step 1'
                    event.count--;
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
                        player.logSkill('jsrgcuibing');
                        event.goto(1);
                    }
                },
                subSkill: {
                    keji: {
                        trigger: {
                            player: "phaseDiscardBefore"
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            trigger.cancel();
                        },
                    },
                },
            },
            jsrglangan: {
                audio: 2,
                trigger: {
                    global: "dieAfter"
                },
                forced: true,
                content: function () {
                    player.recover();
                    player.draw(2);
                    if (player.countMark("jsrglangan") < 3) player.removeMark("jsrgzuozhan_range", 1, false);
                    player.addMark("jsrglangan", 1, false);
                },
            },
            //司马亮
            jsrgsheju: {
                audio: 2,
                trigger: {
                    player: "useCardToPlayered",
                    target: "useCardToTargeted",
                },
                filter: function (event, player) {
                    if ([event.player, event.target].some(target => {
                        return !target.isIn() || !target.countCards("h");
                    }))
                        return false;
                    return event.card.name === "sha" && event.targets.length === 1;
                },
                forced: true,
                logTarget: function (event, player) {
                    return event.player === player ? event.target : event.player;
                },
                content: function () {
                    var targets = [trigger.player, trigger.target];
                    player.chooseToDebate(targets.filter(i => i.isIn()).sortBySeat()).set('callback', lib.skill.jsrgsheju.callback);
                },
                callback: function () {
                    var result = event.debateResult;
                    if (result.bool) {
                        if (result.opinion === "black") {
                            for (const i of result.targets) {
                                i.loseMaxHp();
                            }
                        } else {
                            if (result.black.length) {
                                const targets = result.black.map(i => i[0]);
                                if (targets.length == 1) targets[0].draw(2);
                                else {
                                    game.asyncDraw(targets, 2);
                                    game.delayx();
                                }
                            }
                        }
                    }
                },
            },
            jsrgzuwang: {
                audio: 2,
                trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
                filter: function (event, player) {
                    return player.countCards("h") < player.maxHp;
                },
                forced: true,
                content: function () {
                    player.drawTo(player.maxHp);
                },
            },
            jsrgqinrao: {
                audio: 2,
                trigger: {
                    global: 'phaseUseBegin'
                },
                direct: true,
                preHidden: true,
                filter: function (event, player) {
                    var target = event.player;
                    return target != player && target.isIn() && player.countCards('he') > 0 && player.canUse({
                        name: 'juedou'
                    }, target, false);
                },
                content: function () {
                    'step 0'
                    player.chooseCard('he', get.prompt('jsrgqinrao', trigger.player), '将一张牌当做【决斗】对其使用', function (card, player) {
                        return player.canUse(get.autoViewAs({
                            name: 'juedou'
                        }, [card]), _status.event.target, false);
                    }).set('target', trigger.player).set('ai', function (card) {
                        if (get.effect(_status.event.target, get.autoViewAs({
                            name: 'juedou'
                        }, [card]), player) <= 0) return false;
                        return 6 - get.value(card);
                    }).setHiddenSkill(event.name);
                    'step 1'
                    if (result.bool) {
                        player.useCard(get.autoViewAs({
                            name: 'juedou'
                        }, result.cards), result.cards, false, trigger.player, 'jsrgqinrao');
                        trigger.player.addTempSkill('jsrgqinrao_effect');
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        direct: true,
                        trigger: {
                            player: 'chooseToRespondBefore'
                        },
                        forced: true,
                        popup: false,
                        content: function () {
                            if (player.hasCard(card => {
                                return get.name(card) === "sha";
                            }, "h")) {
                                trigger.forced = true;
                            } else player.showHandcards();
                        },
                    },
                },
            },
            jsrgfuran: {
                audio: 2,
                trigger: { player: "damageEnd" },
                filter(event, player) {
                    return event.source.isIn() && !event.source.inRange(player);
                },
                frequent: true,
                logTarget: "source",
                content: function () {
                    player.addTempSkill("jsrgfuran_recover");
                    player.addMark("jsrgfuran_recover", 1, false);
                },
                subSkill: {
                    recover: {
                        charlotte: true,
                        onremove: true,
                        trigger: { global: "phaseEnd" },
                        forced: true,
                        popup: false,
                        intro: { content: "本回合结束时回复#点体力" },
                        content: function () {
                            player.recover(player.countMark("jsrgfuran_recover"));
                        },
                    },
                },
            },
            jsrgfuzhen: {
                audio: 2,
                trigger: {
                    player: "phaseZhunbeiBegin"
                },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseTarget([1, 3], '覆阵：视为对至多三名其他角色使用一张雷属性【杀】', function (card, player, target) {
                        return target != player && player.canUse({
                            name: 'sha',
                            isCard: true,
                            nature: 'thunder',
                        }, target, false);
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        event.players = game.filterPlayer(function (current) {
                            return current.isEnemyOf(player);
                        });
                        if (!player.hasFriend() || event.players.length < 2) {
                            var num = 2;
                        } else {
                            var num = 1;
                        }
                        if (player.countCards('hs', {
                            name: 'tao'
                        }) + player.countCards('hs', {
                            name: 'jiu'
                        }) + player.hp <= num) return false;
                        return get.effect(target, {
                            name: 'sha',
                            nature: 'thunder'
                        }, player, player) > 0;
                    });
                    'step 1'
                    if (result.bool) {
                        event.targets = result.targets.sortBySeat();
                        var list = [];
                        if (result.targets[0]) list.push(result.targets[0]);
                        if (result.targets[1]) list.push(result.targets[1]);
                        if (result.targets[2]) list.push(result.targets[2]);
                        player.storage.jsrgfuzhen_damage = [];
                        player.logSkill('jsrgfuzhen');
                        player.chooseControl(list).set("prompt", '选择一名角色，若【覆阵】未对其造成伤害，则视为对' + get.translation(list) + '再次使用一张雷【杀】').set('ai', function (player) {
                            var target = [];
                            if (result.targets[0]) target.push(result.targets[0]);
                            if (result.targets[1]) target.push(result.targets[1]);
                            if (result.targets[2]) target.push(result.targets[2]);
                            return target.randomGet(1);
                        });
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (result.control) {
                        player.loseHp();
                        player.storage.jsrgfuzhen_damage = result.control;
                        var targets = event.targets.filter(function (target) {
                            return player.canUse('sha', target, false);
                        });
                        if (targets.length > 0) {
                            player.useCard({
                                name: 'sha',
                                isCard: true,
                                nature: 'thunder',
                                storage: {
                                    jsrgfuzhen: true
                                },
                            }, targets);
                        }
                    }
                },
                group: ["jsrgfuzhen_damage", "jsrgfuzhen_draw"],
                subSkill: {
                    damage: {
                        trigger: {
                            source: "damageBegin",
                        },
                        filter: function (event, player) {
                            return event.card && event.card.storage && event.card.storage.jsrgfuzhen && event.card.name == 'sha' && event.num;
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            if (!trigger.getParent(2).totalDamage) trigger.getParent(2).totalDamage = 0;
                            trigger.getParent(2).totalDamage += trigger.num;
                        },
                        sub: true,
                    },
                    draw: {
                        trigger: {
                            player: "useCardAfter",
                        },
                        filter: function (event, player) {
                            return event.card && event.card.storage && event.card.storage.jsrgfuzhen && event.card.name == 'sha';
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            if (trigger.totalDamage > 0) player.draw(trigger.totalDamage);
                            if (player.getHistory('sourceDamage', function (evt) {
                                return player.storage.jsrgfuzhen_damage.contains(evt.player);
                            }).length == 0) {
                                var card = {
                                    name: 'sha',
                                    nature: 'thunder',
                                    isCard: true,
                                };
                                targets = [];
                                for (var i = 0; i < trigger.targets.length; i++) {
                                    if (trigger.targets[i].isAlive()) {
                                        targets.push(trigger.targets[i]);
                                    }
                                }
                                player.useCard(card, targets, false);
                            }
                        },
                        sub: true,
                    },
                },
            },
            jsrgpiqi: {
                audio: 2,
                enable: "phaseUse",
                usable: 2,
                filterTarget: function (card, player, target) {
                    return !player.getStorage('jsrgpiqi_clear').contains(target) && lib.filter.targetEnabled({
                        name: 'shunshou'
                    }, player, target);
                },
                content: function () {
                    'step 0'
                    player.addTempSkill('jsrgpiqi_clear');
                    player.markAuto('jsrgpiqi_clear', [target]);
                    'step 1'
                    for (const i of game.filterPlayer(current => get.distance(target, current) <= 1).sortBySeat()) {
                        if (!i.hasSkill('jsrgpiqi_kanpo')) {
                            i.addTempSkill("jsrgpiqi_kanpo")
                        }
                    }
                    'step 2'
                    player.useCard({
                        name: 'shunshou',
                        isCard: true
                    }, target);
                },
                subSkill: {
                    clear: {
                        charlotte: true,
                        onremove: true,
                    },
                    kanpo: {
                        enable: "chooseToUse",
                        filterCard(card) {
                            return get.name(card) == "shan";
                        },
                        viewAsFilter(player) {
                            return player.countCards("hes", "shan") > 0;
                        },
                        viewAs: {
                            name: "wuxie"
                        },
                        position: "hes",
                        prompt: "将一张闪当无懈可击使用",
                        check(card) {
                            const tri = _status.event.getTrigger();
                            if (tri && tri.card && tri.card.name == "chiling") return -1;
                            return 8 - get.value(card);
                        },
                    },
                },
            },
            jsrgzhoulin: {
                trigger: {
                    player: 'phaseBegin'
                },
                filter(event, player, name) {
                    return game.hasPlayer(current => !player.inRange(current) && current != player);
                },
                direct: true,
                content: function () {
                    player.addTempSkill('jsrgzhoulin_clear');
                    for (const i of game.filterPlayer(current => !player.inRange(current) && current != player).sortBySeat()) {
                        if (!player.getStorage('jsrgzhoulin_clear').contains(i)) {
                            player.markAuto('jsrgzhoulin_clear', [i]);
                        }
                    }
                },
                group: ['jsrgzhoulin_damage'],
                subSkill: {
                    clear: {
                        charlotte: true,
                        onremove: true,
                        intro: {
                            content: "本回合对$使用杀造成伤害+1",
                        },
                    },
                    damage: {
                        audio: 2,
                        trigger: {
                            source: 'damageBegin1',
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.player && player.getStorage('jsrgzhoulin_clear').contains(event.player) && event.card && event.card.name == 'sha';
                        },
                        content: function () {
                            trigger.num++;
                        }
                    },
                },
            },
            jsrgyaoyan: {
                audio: 2,
                trigger: { player: "phaseZhunbeiBegin" },
                prompt: "是否发动【邀宴】？",
                content: function () {
                    'step 0'
                    event.targets = game.filterPlayer().sortBySeat()
                    event.playerNum = event.targets.length
                    'step 1'
                    event.currentPlayer = event.targets[event.targets.length - event.playerNum]
                    var target = event.currentPlayer
                    target.chooseBool(`是否响应${get.translation(player)}的【邀宴】，于回合结束参与议事？`).set("ai", () => Math.random() < 0.5);
                    'step 2'
                    var target = event.currentPlayer
                    if (result.bool) {
                        player.addTempSkill('jsrgyaoyan_hold')
                        player.markAuto("jsrgyaoyan_hold", [target])
                        target.popup("同意", "wood");
                        game.log(target, "#g同意", "参加", player, "的议事");
                    }
                    else {
                        target.popup("拒绝", "fire");
                        target.addTempSkill('jsrgyaoyan_air');
                        game.log(target, "#r拒绝", "参加", player, "的议事");
                    }
                    'step 3'
                    if (event.playerNum > 1) {
                        event.playerNum--
                        event.goto(1)
                    }
                },
                subSkill: {
                    air: { charlotte: true, },
                    hold: {
                        trigger: { player: "phaseEnd" },
                        charlotte: true,
                        forced: true,
                        popup: false,
                        onremove: true,
                        filter(event, player) {
                            return player.getStorage("jsrgyaoyan_hold").some(i => i.isIn());
                        },
                        content: function () {
                            'step 0'
                            player.chooseToDebate(player.getStorage("jsrgyaoyan_hold").filter(i => i.isIn())).set("callback", function () {
                                var result = event.debateResult;
                                if (result.bool && result.opinion) {
                                    var opinion = result.opinion;
                                    if (opinion == 'red') {
                                        event.getParent(2).drawc = true;
                                    } else {
                                        event.getParent(2).damagec = true;
                                    }
                                }
                            });
                            'step 1'
                            if (event.drawc) {
                                player.chooseTarget("获得任意名未议事的角色的各一张手牌", [1, Infinity], true, function (card, player, target) {
                                    return target.hasSkill('jsrgyaoyan_air') && target.countGainableCards(player, "h");
                                });
                            } else {
                                event.goto(3);
                            }
                            'step 2'
                            if (result.bool) {
                                const targets = result.targets;
                                targets.sortBySeat();
                                player.line(targets, "green");
                                for (const current of targets) {
                                    player.gainPlayerCard(current, "h", true);
                                }
                            }
                            'step 3'
                            if (event.damagec) {
                                player.chooseTarget("是否对一名议事的角色造成2点伤害？", true, function (card, player, target) {
                                    return !target.hasSkill('jsrgyaoyan_air');
                                });
                            } else {
                                return event.finish();
                            }
                            "step 4"
                            if (result.bool) {
                                player.line(targets);
                                var target = result.targets[0];
                                target.damage(2);
                            }
                        }
                    }
                }
            },
            jsrgzhushou: {
                trigger: { global: "phaseEnd" },
                filter(event, player) {
                    if (!player.getHistory("lose").length) return false;
                    const card = lib.skill.jsrgzhushou.getMaxCard();
                    if (!card) return false;
                    return game.hasPlayer(current => {
                        return current.hasHistory("lose", evt => {
                            return evt.cards2 && evt.cards2.includes(card);
                        });
                    });
                },
                frequent: true,
                content: function () {
                    'step 0'
                    const card = lib.skill.jsrgzhushou.getMaxCard();
                    const targets = game.filterPlayer(current => {
                        return current.hasHistory("lose", evt => {
                            return evt.cards2 && evt.cards2.includes(card);
                        });
                    });
                    player.chooseTarget(get.prompt("jsrgzhushou"), `选择一名本回合内失去过${get.translation(card)}的角色，对其造成1点伤害。`, (card, player, target) => {
                        return _status.event.targets.includes(target);
                    }).set("targets", targets).set('ai', function (target) {
                        var player = _status.event.player;
                        return ai.get.damageEffect(target, player, player);
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        event.target = target;
                        player.showCards(event.cards, `${get.translation(player)}发动了【诛首】`);
                        target.damage("nocard");
                    }
                },
                getMaxCard() {
                    let cardsLost = [];
                    game.getGlobalHistory("cardMove", evt => {
                        if (evt.name === "cardsDiscard" || (evt.name === "lose" && evt.position === ui.discardPile)) {
                            cardsLost.addArray(evt.cards);
                        }
                    });
                    cardsLost = cardsLost.filterInD("d");
                    let max = 0;
                    return cardsLost.reduce(
                        (maxCard, card) => {
                            const num = get.number(card, false);
                            if (num > max) {
                                max = num;
                                return card;
                            } else if (num === max) {
                                return void 0;
                            }
                            return maxCard;
                        },
                        void 0
                    );
                },
            },
            jsrgyangge: {
                global: "jsrgyangge_mizhao",
                derivation: "mizhao",
                subSkill: {
                    mizhao: {
                        //直接继承mizhao
                        inherit: "mizhao",
                        usable: void 0,
                        filter(event, player) {
                            return player.countCards("h") > 0 && player.isMinHp() && game.hasPlayer(current => lib.skill.jsrgyangge_mizhao.filterTarget(void 0, player, current));
                        },
                        filterTarget(card, player, target) {
                            if (player === target) return false;
                            return target.hasSkill("jsrgyangge") && !target.hasMark("jsrgyangge");
                        },
                        check: function (card) {
                            if (player.countCards("h") > 2 || player.hp <= 2) return false;
                            game.countPlayer(function (current) {
                                if (current != player && current.hasSkill('jsrgyangge') && !current.hasMark("jsrgyangge")) {
                                    if (get.attitude(player, current) > 0) return 1;
                                }
                            })
                        },
                        prompt() {
                            const player = get.player();
                            const targets = game.filterPlayer(current => lib.skill.jsrgyangge_mizhao.filterTarget(void 0, player, current));
                            return `对${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}发动【密诏】`;
                        },
                    },
                },
            },
            jsrgsaojian: {
                audio: 2,
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return game.hasPlayer(current => current != player && current.countCards("h") > 0);
                },
                filterTarget(card, player, target) {
                    return target != player && target.countCards("h") > 0;
                },
                content: function () {
                    'step 0'
                    var target = event.target;
                    var cards = target.getCards('h');
                    player.chooseButton([get.translation(target) + '的手牌', cards], true).set('ai', function (button) {
                        return Math.random();
                    });
                    'step 1'
                    if (result.bool) {
                        player.storage.jsrgsaojian = [target, result.links[0]];
                        event.num = 0;
                    }
                    'step 2'
                    if (event.num <= 5) {
                        target.chooseToDiscard(1, 'h', true);
                        event.num++;
                    } else event.goto(4);
                    'step 3'
                    var list = player.storage.jsrgsaojian;
                    if (list && target == list[0] && target.getCards('h').contains(list[1])) event.goto(2);
                    'step 4'
                    if (target.countCards("h") > player.countCards("h")) player.loseHp();
                },
                ai: {
                    order: 9,
                    result: {
                        player: function (player, target) {
                            if (player.hp == 1 && (target.countCards("h") + 5) > player.countCards("h")) return -10;
                            if ((target.countCards("h") + 5) > player.countCards("h")) return -1;
                        },
                        target: function (player, target) {
                            return -target.countCards("h");
                        },
                    },
                    threaten: 1,
                    expose: 0.3,
                },
            },
            jsrgcuifeng: {
                audio: 2,
                enable: 'phaseUse',
                limited: true,
                skillAnimation: true,
                animationColor: 'thunder',
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        for (var name of lib.inpile) {
                            var info = lib.card[name];
                            if (!info || info.notarget || (info.selectTarget && info.selectTarget != 1) || !get.tag({ name: name }, "damage")) continue;
                            if (name == "sha") {
                                list.push(["基本", "", "sha"]);
                                for (var nature of lib.inpile_nature) list.push(["基本", "", name, nature]);
                            } else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
                            else if (get.type(name) == "basic") list.push(["基本", "", name]);
                        }
                        return ui.create.dialog("摧锋", [list, "vcard"]);
                    },
                    check: function (button) {
                        var name = button.link[2];
                        return name == 'sha' ? 2.5 : 0;
                        return name == 'huogong' ? 2 : 0;
                    },
                    backup: function (links, player) {
                        return {
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                storage: { jsrgcuifeng: true },
                                isCard: true,
                            },
                            filterCard: () => false,
                            selectCard: -1,
                            popname: true,
                            precontent: function () {
                                var skill = 'jsrgcuifeng';
                                player.awakenSkill(skill, true);
                                player.addTempSkill('jsrgcuifeng_buff');
                                delete event.result.skill;
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '请选择' + get.translation(links[0][2]) + '的目标';
                    },
                },
                mod: {
                    targetInRange: card => {
                        if (card.storage && card.storage.jsrgcuifeng) return true;
                    },
                },
                ai: {
                    order: function (item, player) {
                        return get.order({
                            name: 'sha'
                        });
                    },
                    result: {
                        player: 1,
                    },
                    threaten: 1,
                    expose: 0.3,
                },
                subSkill: {
                    buff: {
                        trigger: { player: 'useCardAfter' },
                        forced: true,
                        charlotte: true,
                        filter: function (event, player) {
                            if (event.card && event.card.storage && event.card.storage.jsrgcuifeng) {
                                var num = 0;
                                player.getHistory("sourceDamage", function (evt) {
                                    if (evt.card && evt.card == event.card) {
                                        num += evt.num;
                                    }
                                });
                                return num != 1;
                            }
                            return false;
                        },
                        content: function () {
                            player.addTempSkill('jsrgcuifeng_effect');
                        },
                    },
                    effect: {
                        audio: 'jxzhaoluan',
                        trigger: {
                            player: 'phaseEnd',
                        },
                        forced: true,
                        silent: true,
                        content: function () {
                            player.restoreSkill("jsrgcuifeng");
                            game.log(player, "重置了", "#g【摧锋】");
                        },
                    },
                },
            },
            jsrgdengnan: {
                audio: 2,
                enable: 'phaseUse',
                limited: true,
                skillAnimation: true,
                animationColor: 'thunder',
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        for (var name of lib.inpile) {
                            var info = lib.card[name];
                            if (!info || info.type != "trick" || info.notarget || get.tag({ name: name }, "damage")) continue;
                            list.push(["锦囊", "", name]);
                        }
                        return ui.create.dialog('登难', [list, 'vcard']);
                    },
                    check: function (button) {
                        var name = button.link[2];
                        if (_status.event.player.hasSkill('jsrgcuifeng')) return name == 'tiesuo' ? 3 : 0;
                        return name == 'shunshou' ? 3 : 0;
                        return name == 'guohe' ? 2.5 : 0;
                        return name == 'wuzhong' ? 2 : 0;
                    },
                    backup: function (links, player) {
                        return {
                            viewAs: {
                                name: links[0][2],
                                isCard: true,
                            },
                            filterCard: () => false,
                            selectCard: -1,
                            popname: true,
                            precontent: function () {
                                var skill = 'jsrgdengnan';
                                player.awakenSkill(skill, true);
                                player.addTempSkill('jsrgdengnan_add');
                                player.addTempSkill('jsrgdengnan_effect');
                                delete event.result.skill;
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '请选择' + get.translation(links[0][2]) + '的目标';
                    },
                },
                ai: {
                    order: function (item, player) {
                        return get.order({
                            name: 'tiesuo'
                        });
                    },
                    result: {
                        player: 1,
                    },
                    threaten: 1,
                    expose: 0.3,
                },
                subSkill: {
                    effect: {
                        audio: 'jxzhaoluan',
                        trigger: {
                            player: 'phaseEnd',
                        },
                        forced: true,
                        filter: function (event, player) {
                            return !game.hasPlayer(function (current) {
                                return current.hasSkill('jsrgdengnan_threaten');
                            });
                        },
                        content: function () {
                            player.restoreSkill("jsrgdengnan");
                            game.log(player, "重置了", "#g【登难】");
                        },
                    },
                    add: {
                        trigger: { player: 'useCardToPlayered' },
                        forced: true,
                        content: function () {
                            player.line(trigger.targets);
                            var targets = trigger.targets.sortBySeat();
                            targets.forEach(function (target) {
                                target.addTempSkill('jsrgdengnan_threaten');
                            });
                            player.removeSkill('jsrgdengnan_add');
                        },
                    },
                    threaten: {
                        charlotte: true,
                        trigger: { player: 'damageEnd' },
                        firstDo: true,
                        forced: true,
                        popup: false,
                        content: function () {
                            player.removeSkill('jsrgdengnan_threaten');
                        },
                        ai: {
                            threaten: 10
                        },
                        mark: true,
                        intro: {
                            content: '还没受到伤害'
                        },
                    },
                },
            },
            jsrgzonghai: {
                trigger: { global: "dying" },
                logTarget: "player",
                filter: function (event, player) {
                    return event.player !== player && event.player.hp <= 0;
                },
                round: 1,
                content: function () {
                    'step 0'
                    player.addTempSkill('jsrgzonghai_force');
                    var target = trigger.player;
                    target.chooseTarget(true, [1, 2], "请选择至多两名角色", `${get.translation(player)}对你发动了【纵害】。你可以选择至多两名角色，只有这两名角色可以使用牌拯救你，且当此次濒死结算结束后，这两名角色均会受到来自${get.translation(player)}的1点伤害。`);
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets.sortBySeat();
                        player.line(targets, 'thunder');
                        for (var i of targets) {
                            i.addMark("jsrgzonghai");
                        }
                        'step 2'
                        for (var j of game.filterPlayer().sortBySeat()) {
                            if (!j.hasMark('jsrgzonghai')) j.addTempSkill('jsrgzonghai_blocker');
                        }
                    }
                },
                subSkill: {
                    blocker: {
                        charlotte: true,
                        onremove: true,
                        mod: {
                            cardSavable: function (card, player) {
                                if (card.name == 'tao' || card.name == 'jiu' && player.isDying()) return false;
                            },
                            cardEnabled: function (card, player) {
                                if (card.name == 'tao' || card.name == 'jiu' && player.isDying()) return false;
                            }
                        },
                    },
                    mark: {
                        charlotte: true,
                        mark: true,
                        marktext: '纵害',
                        onremove: true,
                        intro: {
                            name: '纵害',
                            content: 'mark'
                        }
                    },
                    marked: { charlotte: true },
                    force: {
                        trigger: { global: "dyingAfter" },
                        forced: true,
                        content: function () {
                            for (var i of game.filterPlayer().sortBySeat()) {
                                if (i.hasMark('jsrgzonghai'))
                                    i.damage('nocard');
                                i.removeMark('jsrgzonghai');
                            }
                        },
                    },
                },
                check: function (event, player) {
                    return get.attitude(player, event.player) < 0;
                },
            },
            jsrgjueyin: {
                trigger: { player: "damageEnd" },
                filter(event, player) {
                    return player.getHistory("damage")[0] === event;
                },
                content: function () {
                    player.draw(3);
                    var targets = game.filterPlayer().sortBySeat();
                    targets.forEach(current => {
                        current.addTempSkill("jsrgjueyin_damage");
                        current.addMark("jsrgjueyin_damage", 1, false);
                    });
                },
                subSkill: {
                    damage: {
                        onremove: true,
                        charlotte: true,
                        trigger: { player: "damageBegin1" },
                        forced: true,
                        content: function () {
                            trigger.num++;
                        },
                        intro: {
                            content: "本回合受到的伤害+#",
                        },
                    },
                },
            },
            jsrgfuni: {
                audio: 2,
                trigger: { global: "roundStart" },
                group: ["jsrgfuni_unlimit", "jsrgfuni_zero"],
                forced: true,
                direct: true,
                frequent: true,
                content: function () {
                    'step 0'
                    var count = Math.ceil(game.countPlayer() / 2);
                    player.drawShadow('jsrg_ying', 'spade', 1, count);
                    'step 1'
                    var num = Math.ceil(game.countPlayer() / 2);
                    if (num) {
                        player.chooseCardTarget({
                            prompt: '是否将任意张影交给其他角色？',
                            prompt2: '操作提示：先按顺序选中所有要给出的手牌，然后再按顺序选择等量的目标角色',
                            selectCard: [1, num],
                            selectTarget: function () {
                                return ui.selected.cards.length;
                            },
                            filterCard: function (card) {
                                return card.name == 'jsrg_ying';
                            },
                            complexSelect: true,
                            filterOk: function () {
                                return ui.selected.cards.length == ui.selected.targets.length;
                            },
                        }).set('ai', function (target) {
                            return -target.countCards('h');
                        });
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (result.bool && result.cards.length > 0) {
                        var list = [];
                        for (var i = 0; i < result.targets.length; i++) {
                            var target = result.targets[i];
                            var card = result.cards[i];
                            list.push([target, card]);
                            player.line(target);
                        }
                        game.loseAsync({
                            gain_list: list,
                            player: player,
                            cards: result.cards,
                            giver: player,
                            animate: 'giveAuto',
                        }).setContent('gaincardMultiple');
                    } else {
                        event.finish();
                    }
                    'step 3'
                    if (player.countCards('h', function (card) { return card.name == 'jsrg_ying'; }) > 0) {
                        event.goto(1);
                    }
                },

                subSkill: {
                    zero: {
                        priority: Infinity,
                        mod: {
                            attackRange: () => 0,
                        },
                    },
                    unlimit: {
                        trigger: {
                            global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"],
                        },
                        filter: function (event, player) {
                            return event.getd().some(i => get.name(i, false) == "jsrg_ying");
                        },
                        forced: true,
                        content: function () {
                            player.addTempSkill("jsrgfuni_buff");
                        },
                    },
                    buff: {
                        charlotte: true,
                        trigger: { player: "useCard1" },
                        forced: true,
                        popup: false,
                        content: function () {
                            trigger.directHit.addArray(game.players);
                            // game.log(trigger.card, "不可被响应");
                        },
                        mark: true,
                        intro: {
                            content: "使用牌无距离限制且不能被响应",
                        },
                        mod: {
                            targetInRange: () => true,
                        },
                    },
                },
            },
            jsrgchuanxin: {
                audio: 2,
                trigger: { global: "phaseJieshuBegin" },
                filter: function (event, player) {
                    return player.countCards("hes") && game.hasPlayer(current =>
                        player.canUse({
                            name: "sha",
                            storage: { jsrgchuanxin: true },
                        }, current)
                    );
                },
                direct: true,
                content: function () {
                    var next = player.chooseToUse();
                    next.set("openskilldialog", `###${get.prompt("jsrgchuanxin")}###将一张牌当【杀】使用，且当一名角色受到此【杀】伤害时，此伤害+X（X为其本回合回复过的体力值）。`);
                    next.set("norestore", true);
                    next.set("_backupevent", "jsrgchuanxin_backup");
                    next.set("addCount", false);
                    next.set("logSkill", "jsrgchuanxin");
                    next.set("custom", {
                        add: {},
                        replace: { window: function () { } },
                    });
                    next.backup("jsrgchuanxin_backup");
                },
                subSkill: {
                    backup: {
                        filterCard: function (card) {
                            return get.itemtype(card) == "card";
                        },
                        viewAs: {
                            name: "sha",
                            storage: { jsrgchuanxin: true },
                        },
                        selectCard: 1,
                        position: "hes",
                        ai1: function (card) {
                            var player = get.player();
                            var maxVal = 5.5;
                            if (get.name(card, false) == "jsrg_ying" && player.hasSkill("jsrgchuanxin")) maxVal -= 3;
                            return maxVal - get.value(card);
                        },
                        precontent: function () {
                            delete event.result.skill;
                            player.addTempSkill("jsrgchuanxin_add");
                        },
                    },
                    add: {
                        trigger: { global: "damageBegin3" },
                        filter: function (event, player) {
                            if (!event.card || !event.card.storage || !event.card.storage.jsrgchuanxin) return false;
                            if (event.getParent().type != "card") return false;
                            var num = 0;
                            game.getGlobalHistory('changeHp', evt => {
                                if (evt.getParent().name == 'recover') num += evt.num;
                            });
                            return num > 0;
                        },
                        forced: true,
                        charlotte: true,
                        content: function () {
                            var num = game.getGlobalHistory("changeHp", evt => {
                                return evt.getParent().name == "recover" && evt.player == trigger.player;
                            }).map(evt => evt.num).reduce((p, c) => p + c, 0);
                            trigger.num += num;
                            game.log(trigger.card, "的伤害+" + num);
                        },
                    },
                },
            },
            jsrgeqian: {
                audio: 2,
                trigger: { player: "useCardToPlayered" },
                filter: function (event, player) {
                    if (!event.isFirstTarget || event.targets.length != 1 || event.target == player) return false;
                    if (event.card.name == "sha") return true;
                    return event.getParent(3).name == "jsrgdaimou2_execute";
                },
                prompt2: function (event, player) {
                    return `令${get.translation(event.card)}不计入次数限制，且你获得${get.translation(event.target)}一张牌，然后其可以令你本回合至其的距离+2`;
                },
                group: ['jsrgeqian_prepare'/*, 'jsrgdaimou2'*/],
                logTarget: "target",
                content: function () {
                    'step 0'
                    if (trigger.addCount !== false) {
                        trigger.addCount = false;
                        var stat = player.getStat().card,
                            name = trigger.card.name;
                        if (typeof stat[name] == "number") stat[name]--;
                    }
                    player.gainPlayerCard(trigger.target, "he", true);
                    'step 1'
                    trigger.target.chooseBool(`是否令${get.translation(player)}至你的距离于本回合内+2？`).set("ai", () => true);
                    'step 2'
                    if (result.bool) {
                        player.addTempSkill("jsrgeqian_distance");
                        if (!player.storage.jsrgeqian_distance) player.storage.jsrgeqian_distance = {};
                        var id = trigger.target.playerid;
                        if (typeof player.storage.jsrgeqian_distance[id] != "number") player.storage.jsrgeqian_distance[id] = 0;
                        player.storage.jsrgeqian_distance[id] += 2;
                        player.markSkill("jsrgeqian_distance");
                    }
                },
                subSkill: {
                    prepare: {
                        trigger: { player: 'phaseJieshuBegin' },
                        direct: true,
                        filter: function (event, player) {
                            return player.countCards('he') > 0;
                        },
                        content: function () {
                            'step 0'
                            player.chooseCard(get.prompt("jsrgeqian"), "你可以蓄谋任意张牌", [1, player.countCards('he')], 'he');
                            'step 1'
                            if (result.cards && result.cards.length) {
                                let cards = result.cards.slice();
                                if (cards.length === 0) return;
                                cards.forEach(function (card) {
                                    if (!card.gaintagFixed) {
                                        card.gaintagFixed = [];
                                    }
                                    card.gaintagFixed.add('schemeJudge');
                                    player.addJudge({ name: 'jsrgjudge_card' }, [card]);
                                });
                            }
                        },
                    },
                    distance: {
                        onremove: true,
                        charlotte: true,
                        mod: {
                            globalFrom: function (player, target, distance) {
                                if (!player.storage.jsrgeqian_distance) return;
                                var dis = player.storage.jsrgeqian_distance[target.playerid];
                                if (typeof dis == "number") return distance + dis;
                            },
                        },
                        intro: {
                            content: function (storage, player) {
                                if (!storage) return;
                                var map = _status.connectMode ? lib.playerOL : game.playerMap;
                                var str = `你本回合：`;
                                for (const id in storage) {
                                    str += "<li>至" + get.translation(map[id]) + "的距离+" + storage[id];
                                }
                                return str;
                            },
                        },
                    },
                },
            },
            jsrgfusha: {
                audio: 2,
                enable: "phaseUse",
                limited: true,
                skillAnimation: true,
                animationColor: "fire",
                filter: function (event, player) {
                    return game.countPlayer(current => {
                        return player.inRange(current);
                    }) == 1;
                },
                filterTarget: function (card, player, target) {
                    return player.inRange(target);
                },
                selectTarget: -1,
                content: function () {
                    player.awakenSkill("jsrgfusha");
                    target.damage(Math.min(game.countPlayer(), player.getAttackRange()));
                },
                ai: {
                    order: 1,
                    result: {
                        target: -2,
                    },
                },
            },
            jsrgguanshi: {
                enable: "phaseUse",
                usable: 1,
                viewAs: { name: "huogong" },
                viewAsFilter: function (player) {
                    return player.hasCard(card => get.name(card) === "sha", "hs");
                },
                filterCard: function (card) {
                    return get.name(card) === "sha";
                },
                selectTarget: [1, Infinity],
                onuse: function (result, player) {
                    player.addTempSkill("jsrgguanshi_effect");
                },
                position: "hs",
                ai: {
                    order: 9,
                    result: {
                        player: 1,
                        target: -1
                    }
                },
                subSkill: {
                    effect: {
                        trigger: {
                            player: ["useCardToBefore", "useCardToAfter", "useCardToExcluded", "useCardToOmitted", "useCardToCancelled"],
                        },
                        forced: true,
                        charlotte: true,
                        popup: false,
                        silent: true,
                        filter: function (event, player, name) {
                            if (event.type !== "card" || event.skill !== "jsrgguanshi") return false;
                            var isUnhurted = event.card.storage && event.card.storage.jsrgguanshi;
                            if (name === "useCardToBefore") return isUnhurted;
                            return !isUnhurted && event.target && !player.hasHistory("sourceDamage", evt => {
                                return evt.card === event.card && evt.getParent() === event;
                            });
                        },
                        content: function () {
                            if (event.triggername === "useCardToBefore") {
                                trigger.setContent(lib.card.juedou.content);
                            } else {
                                var card = trigger.card;
                                if (!card.storage) card.storage = {};
                                card.storage.jsrgguanshi = true;
                            }
                        },
                    },
                },
            },
            jsrgcangxiong: {
                audio: 2,
                trigger: {
                    player: ['loseAfter', 'cardsDiscardAfter', 'loseAsyncAfter', 'equipAfter'],
                },
                forced: true,
                locked: false,
                filter: function (event, player) {
                    if (event.name !== 'cardsDiscard') {
                        if (event.position !== ui.discardPile) return false;
                        if (!game.hasPlayer(current => {
                            const evt = event.getl(current);
                            return evt.cards && evt.cards.length > 0;
                        })) return false;
                    } else {
                        var evt = event.getParent();
                        if (evt.relatedEvent && evt.relatedEvent.name === 'useCard') return false;

                    }
                    return true;
                },
                content: function () {
                    let cards = trigger.cards.slice();
                    if (cards.length === 0) return;
                    cards.forEach(function (card) {
                        if (!card.gaintagFixed) {
                            card.gaintagFixed = [];
                        }
                        card.gaintagFixed.add('schemeJudge');
                        player.addJudge({ name: 'jsrgjudge_card' }, [card]);
                    });
                    if (player.isPhaseUsing()) {
                        player.draw();
                    }
                },
                group: ['jsrgcangxiong_gain'/*, 'jsrgdaimou2'*/],
                subSkill: {
                    gain: {
                        audio: 2,
                        trigger: {
                            global: 'gainEnd'
                        },
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            if (player == event.player) return false;
                            var evt = event.getl(player);
                            return evt && evt.cards2 && evt.cards2.length > 0;
                        },
                        content: function () {
                            let cards = trigger.cards.slice();
                            if (cards.length === 0) return;
                            cards.forEach(function (card) {
                                if (!card.gaintagFixed) {
                                    card.gaintagFixed = [];
                                }
                                card.gaintagFixed.add('schemeJudge');
                                player.addJudge({ name: 'jsrgjudge_card' }, [card]);
                            });
                            if (player.isPhaseUsing()) {
                                player.draw();
                            }
                        },
                    },
                },
            },
            jsrgjiebing: {
                derivation: "jsrgbaowei",
                trigger: { player: "phaseZhunbeiBegin" },
                forced: true,
                juexingji: true,
                skillAnimation: true,
                animationColor: "gray",
                filter: function (event, player) {
                    var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
                    if (!zhu || !zhu.isIn()) return false;
                    return zhu && player.countCards("j", card => {
                        return (card.viewAs || card.name) == "jsrgjudge_card";
                    }) >= zhu.hp;
                },
                content: function () {
                    player.awakenSkill("jsrgjiebing");
                    player.gainMaxHp(2);
                    player.recover(2);
                    player.addSkill("jsrgbaowei");
                },
            },
            jsrgbaowei: {
                trigger: { player: "phaseJieshuBegin" },
                forced: true,
                filter: function (event, player) {
                    return game.hasPlayer(current => {
                        return current !== player && (current.getHistory("useCard").length > 0 || current.getHistory("respond").length > 0);
                    });
                },
                content: function () {
                    'step 0'
                    var targets = game.filterPlayer(current => {
                        return current !== player && (current.getHistory("useCard").length > 0 || current.getHistory("respond").length > 0);
                    });
                    if (targets.length > 2) {
                        player.loseHp(2);
                        event.finish();
                    } else {
                        player.chooseTarget("对一名角色造成2点伤害", function (card, player, target) {
                            return target !== player && game.hasPlayer(current => current !== target) && (target.getHistory("useCard").length > 0 || target.getHistory("respond").length > 0);
                        }).set("ai", function (target) {
                            return get.attitude(player, target);
                        }).set("prompt", "对一名角色造成2点伤害").set("filterTarget", function (card, player, target) {
                            return target !== player && game.hasPlayer(current => current !== target) && (target.getHistory("useCard").length > 0 || target.getHistory("respond").length > 0);
                        });
                    }
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.logSkill('jsrgbaowei', target);
                        target.damage(2);
                    }
                },
            },
            jsrgyansha: {
                trigger: {
                    player: "phaseZhunbeiBegin"
                },
                content: function () {
                    'step 0'
                    player.addTempSkill('jsrgyansha_force');
                    player.chooseTarget(get.prompt("jsrgyansha"), "你可以选择任意名角色，视为对这些角色使用【五谷丰登】，然后未被选择的角色依次可以将一张装备牌当作【杀】对目标角色使用。", [1, Infinity], (card, player, target) => {
                        return player.canUse({
                            name: "wugu",
                            isCard: true
                        }, target);
                    });
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets.slice(0).sortBySeat();
                        player.useCard({
                            name: "wugu",
                            isCard: true
                        }, targets);
                        for (var target of targets) {
                            target.addMark("jsrgyansha");
                        }
                        for (var i of game.filterPlayer().sortBySeat()) {
                            if (!i.hasMark('jsrgyansha')) i.addTempSkill('jsrgyansha_blocker');
                        }
                    }
                },
                subSkill: {
                    blocker: {
                        charlotte: true,
                        trigger: {
                            global: "phaseZhunbeiBegin"
                        },
                        popup: false,
                        forced: true,
                        mod: {
                            targetInRange: function (card) {
                                if (card.name == 'sha') return true;
                            },
                        },
                        filterCard(card) {
                            return get.type(card) === "equip";
                        },
                        filterTarget: function (card, player, target) {
                            return target != player && player.canUse({
                                name: 'sha'
                            }, target) && target.hasMark("jsrgyansha");
                        },
                        content: function () {
                            'step 0'
                            player.chooseCardTarget({
                                prompt: `是否将一张装备牌当作【杀】对目标角色使用？`,
                                position: "hes",
                                filterCard(card) {
                                    return get.type(card) === "equip";
                                },
                                filterTarget: function (card, player, target) {
                                    return target != player && player.canUse({
                                        name: 'sha'
                                    }, target) && target.hasMark("jsrgyansha");
                                },
                            });

                            'step 1'
                            if (result.bool) {
                                player.useCard({
                                    name: 'sha'
                                }, result.cards, result.targets);
                                player.removeSkill('jsrgyansha_blocker');
                            } else event.finish();
                            player.removeSkill('jsrgyansha_blocker');
                        },
                    },
                    force: {
                        trigger: {
                            player: "phaseEnd"
                        },
                        forced: true,
                        content: function () {
                            for (var i of game.filterPlayer().sortBySeat()) {
                                if (i.hasMark('jsrgyansha')) i.removeMark('jsrgyansha');
                            }
                        },
                    },
                }
            },
            jsrgqingping: {
                trigger: {
                    player: "phaseJieshuBegin"
                },
                frequent: true,
                filter: function (event, player) {
                    var targets = game.filterPlayer(current => player.inRange(current)),
                        hs = player.countCards("h");
                    return targets.length > 0 && targets.every(current => current.countCards("h") <= hs);
                },
                content: function () {
                    player.draw(game.countPlayer(current => player.inRange(current)));
                },
            },
            jsrgxiangru: {
                trigger: {
                    global: "damageBegin2"
                },
                direct: true,
                filter: function (event, player) {
                    if (event.player.hp + event.player.hujia > event.num) return false;
                    var source = event.source;
                    if (!source || !source.isIn()) return false;
                    if (player !== event.player) {
                        return event.player.isDamaged() && player !== source && player.countCards("he") > 1;
                    }
                    return game.hasPlayer(current => {
                        return current !== source && current !== player && current.isDamaged() && current.countCards("he") >= 1 && event.source && event.source.isIn();
                    });
                },
                content: function () {
                    'step 0'
                    if (trigger.player != player) {
                        player.chooseCard('he', '选择两张牌交给' + get.translation(trigger.source) + '令' + get.translation(trigger.player) + '免疫此致命伤害？', 2, false).set('ai', function (card) {
                            if (get.attitude(trigger.player, _status.event.player) < 0) return -1;
                            return 8 - get.value(card)
                        });
                    } else {
                        event.goto(2);
                    }
                    'step 1'
                    if (result.bool) {
                        player.logSkill('jsrgxiangru', trigger.player);
                        player.give(result.cards, trigger.source);
                        trigger.cancel();
                        event.finish();
                    }
                    'step 2'
                    event.targets = game.filterPlayer(function (current) {
                        return current.isDamaged();
                    });
                    event.targets.remove(player);
                    event.targets.remove(trigger.source);
                    'step 3'
                    if (event.targets.length) {
                        event.current = event.targets.shift();
                        if (event.current.countCards('he') > 1) {
                            event.current.chooseCard('he', '选择两张牌交给' + get.translation(trigger.source) + '令' + get.translation(trigger.player) + '免疫此致命伤害？', 2, false).set('ai', function (card) {
                                if (get.attitude(trigger.player, _status.event.player) < 0) return -1;
                                return 8 - get.value(card)
                            });
                        }
                    } else {
                        event.finish();
                    }
                    'step 4'
                    if (result.bool) {
                        event.current.logSkill('jsrgxiangru', player);
                        event.current.give(result.cards, trigger.source);
                        trigger.cancel();
                        event.finish();
                    } else {
                        event.goto(3);
                    }
                },
                ai: {
                    filterDamage: true,
                },
            },
            jsrgwudao: {
                derivation: "jsrgjinglei",
                trigger: {
                    global: "dying"
                },
                forced: true,
                juexingji: true,
                skillAnimation: true,
                animationColor: "gray",
                filter: function (event, player) {
                    return player.countCards("h") === 0;
                },
                content: function () {
                    player.awakenSkill("jsrgwudao");
                    player.gainMaxHp();
                    player.recover();
                    player.addSkill("jsrgjinglei");
                },
            },
            jsrgjinglei: {
                trigger: {
                    player: "phaseZhunbeiBegin"
                },
                filter: function (event, player) {
                    return game.hasPlayer(current => !current.isMinHandcard());
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt("jsrgjinglei"), "选择一名其他角色，令任意名手牌数之和小于其的角色各对其造成1点雷属性伤害", (card, player, target) => {
                        return !target.isMinHandcard();
                    }).set("ai", target => {
                        if (get.attitude(player, target) >= 0) return false;
                        return get.damageEffect(target, player, player, "thunder") * Math.sqrt(target.countCards("h"));
                    });

                    'step 1'
                    if (result.bool) {
                        event.target = result.targets[0];
                        event.maxmium = event.target.countCards("h");
                        player.chooseTarget(true, '选择任意名手牌数之和小于' + event.maxmium + '的角色', [1, Infinity], (card, player, target) => {
                            var selected = ui.selected.targets;
                            return selected.reduce((p, c) => p + c.countCards("h"), target.countCards("h")) < event.maxmium;
                        }).set("ai", target => {
                            return 1 / (1 + target.countCards("h"));
                        });
                    } else {
                        event.finish();
                    }

                    'step 2'
                    if (result.bool) {
                        event.sources = result.targets;
                        event.sources.sortBySeat();
                        player.line(event.sources, "thunder");
                        for (var source of event.sources) {
                            if (!source.isIn() || !event.target.isIn()) continue;
                            event.target.damage(source, "thunder");
                        }
                    }
                }
            },
            jsrggangfen: {
                trigger: {
                    global: "useCardToPlayer"
                },
                filter: function (event, player) {
                    if (event.card.name !== "sha") return false;
                    if (event.player === player || event.player.countCards("h") <= player.countCards("h")) return false;
                    return !event.targets.includes(player) && lib.filter.targetEnabled(event.card, event.player, player);
                },
                logTarget: "player",
                prompt2(event, player) {
                    return `你可以成为该角色使用的${get.translation(event.card)}的额外目标，并令所有其他角色也选择是否成为此牌的目标。然后该角色展示所有手牌，若其中的黑色牌数量小于此牌目标数，则此牌无效。`;
                },
                check(event, player) {
                    if (
                        event.targets.reduce((p, c) => {
                            return p + get.effect_use(c, event.card, event.player, player) > 0;
                        }, 0) >= 0) return false;
                    return game.countPlayer(current => event.targets.includes(current) || get.attitude(current, player) > 0) > event.player.countCards("h");
                },
                content: function () {
                    trigger.targets.add(player);
                    var source = trigger.player;
                    var targets = game.filterPlayer(current => {
                        return current !== player && current !== source && !trigger.targets.includes(current) && lib.filter.targetEnabled(trigger.card, source, current);
                    }).sortBySeat();
                    for (var target of targets) {
                        var bool = target.chooseBool(`是否也成为${get.translation(trigger.card)}的目标？`, `若最终目标数大于${get.translation(source)}手牌中的黑色牌数，则此牌无效。`).ai;
                        if (bool) {
                            target.addExpose(0.15);
                            target.chat("我也上！");
                            target.line(source);
                            trigger.targets.add(target);
                            game.log(target, "也成为了", trigger.card, "的目标");
                        }
                    }
                    source.showHandcards();
                    var blackNum = source.countCards("h", card => get.color(card, source) === "black");
                    if (blackNum < trigger.targets.length) {
                        trigger.getParent().all_excluded = true;
                        trigger.targets.length = 0;
                        trigger.untrigger();
                    }
                },
                ai: {
                    expose: 0.2,
                    threaten: 4.5,
                },
            },


            jsrgdangren: {
                zhuanhuanji: true,
                enable: "chooseToUse",
                filter: function (event, player) {
                    if (player.storage.jsrgdangren) return false;
                    var card = get.autoViewAs({
                        name: "tao",
                        isCard: true
                    });
                    return event.filterCard(card, player, event) && event.filterTarget(card, player, player);
                },
                viewAs: {
                    name: "tao",
                    isCard: true
                },
                filterTarget(card, player, target) {
                    return target === player;
                },
                selectTarget: -1,
                filterCard() {
                    return false;
                },
                selectCard: -1,
                check() {
                    var player = get.player();
                    if (player.isDying()) return true;
                    return (
                        game.countPlayer(current => {
                            return current.hp <= 2 && get.attitude(player, current) > 0;
                        }) > game.countPlayer(current => {
                            return current.hp <= 2 && get.attitude(player, current) <= 0;
                        }));
                },
                prompt: "视为对自己使用【桃】",
                precontent: function () {
                    player.logSkill("jsrgdangren");
                    player.changeZhuanhuanji("jsrgdangren");
                    delete event.result.skill;
                },
                hiddenCard(player, name) {
                    return name === "tao";
                },
                mark: true,
                marktext: "☯",
                intro: {
                    content: function (storage) {
                        if (storage) return "当你可以对其他角色使用【桃】时，你须视为使用之。";
                        return "当你需要对自己使用【桃】时，你可以视为使用之";
                    },
                },
                group: ["jsrgdangren_force"],
                subSkill: {

                    force: {
                        trigger: {
                            player: "chooseToUseBegin"
                        },
                        filter: function (event, player) {
                            if (event.responded || !player.storage.jsrgdangren) return false;
                            var card = get.autoViewAs({
                                name: "tao",
                                isCard: true
                            });
                            if (!event.filterCard(card, player, event)) return false;
                            var backup = _status.event;
                            _status.event = event;
                            var hasTarget = game.hasPlayer(current => {
                                return current !== player && event.filterTarget(card, player, current);
                            });
                            _status.event = backup;
                            return hasTarget;
                        },
                        forced: true,
                        content: function () {
                            var card = {
                                name: "tao",
                                isCard: true
                            };
                            var targets = game.filterPlayer(current => {
                                return current.isDying() && current !== player;
                            });
                            if (targets.length) {
                                player.useCard(card, targets);
                                player.changeZhuanhuanji("jsrgdangren");
                            }
                        },
                    },
                },
            },

            jsrgruzong: {
                trigger: {
                    player: "phaseEnd"
                },
                filter: function (event, player) {
                    var target = lib.skill.jsrgruzong.getTarget(player);
                    if (!target) return false;
                    var hs = player.countCards("h");
                    if (target !== player) return target.countCards("h") > hs;
                    return true;
                },
                getTarget: function (player) {
                    var targets = player.getHistory('useCard').map(ev => ev.targets).flat();
                    return targets.length === 1 ? targets[0] : null;
                },
                content: function () {
                    'step 0'
                    var target = lib.skill.jsrgruzong.getTarget(player);
                    var hs = player.countCards("h");
                    if (target !== player) {
                        var diff = target.countCards("h") - hs;
                        if (diff > 0) {
                            player.draw(Math.min(diff, 5));
                        }
                        event.finish();
                    } else {
                        player.chooseTarget('选择任意名其他角色令其将手牌摸至与你相同（至多摸五张）', [1, game.countPlayer() - 1], function (card, player, target) {
                            return target !== player && target.countCards("h") < player.countCards("h");
                        }).set('ai', target => -get.attitude(player, target));
                    }
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets;
                        game.asyncDraw(targets, Math.min(player.countCards("h") - targets[0].countCards("h"), 5));
                    }
                }
            },
            jsrgdaoren: {
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return player.countCards("h") > 0;
                },
                filterCard: true,
                position: "h",
                discard: false,
                lose: false,
                delay: false,
                filterTarget: lib.filter.notMe,
                check: function (card) {
                    return 6 - get.value(card);
                },
                content: function () {
                    var target = event.target;
                    player.give(event.cards, target);
                    var targets = game.filterPlayer(current => {
                        return player.inRange(current) && target.inRange(current);
                    }).sortBySeat();
                    for (var current of targets) {
                        player.line(current);
                        current.damage("nocard");
                    }
                },
                ai: {
                    order: 2,
                    result: {
                        player: function (player, target) {
                            var targets = game.filterPlayer(current => {
                                return player.inRange(current) && target.inRange(current);
                            });
                            if (targets.length === 0) return false;
                            return targets.reduce((p, c) => {
                                var eff = get.damageEffect(c, player, player);
                                if (eff < 0 && c.hp <= 2) {
                                    var att = get.attitude(player, c);
                                    if (att > 0) eff *= Math.sqrt(att);
                                }
                                return p + eff;
                            }, 0);
                        },
                    },
                },
            },
            jsrgzhongzen: {
                trigger: {
                    player: "phaseDiscardBegin"
                },
                forced: true,
                filter: function (event, player) {
                    var hs = player.countCards("h");
                    return game.hasPlayer(current => {
                        if (current === player) return false;
                        var hs2 = current.countCards("h");
                        return hs2 > 0 && hs2 < hs;
                    });
                },
                logTarget(event, player) {
                    var hs = player.countCards("h");
                    return game.filterPlayer(current => {
                        if (current === player) return false;
                        var hs2 = current.countCards("h");
                        return hs2 > 0 && hs2 < hs;
                    });
                },
                content: function () {
                    var player = this.player;
                    var hs = player.countCards("h");


                    var targets = game.filterPlayer(current => {
                        if (current === player) return false;
                        var hs2 = current.countCards("h");
                        return hs2 > 0 && hs2 < hs;
                    });


                    targets.forEach(target => {
                        var card = target.getCards("h")[0];
                        if (card) {
                            player.gain(card, "gain2");
                            target.$give(1, player);
                        }
                    });
                },
                group: "jsrgzhongzen_discard",
                subSkill: {
                    discard: {
                        trigger: {
                            player: "phaseDiscardEnd"
                        },
                        forced: true,
                        filter: function (event, player) {
                            if (player.countCards("he") === 0) return false;
                            var cards = [];
                            player.getHistory("lose", evt => {
                                if (evt.type === "discard" && evt.getParent("phaseDiscard") === event) cards.addArray(evt.cards);
                            });
                            return (
                                cards.length > player.hp && cards.reduce((num, card) => {
                                    if (num <= player.hp && get.suit(card, false) === "spade") num++;
                                    return num;
                                }, 0) > player.hp);
                        },
                        content: function () {
                            player.chooseToDiscard(true, "he", player.countCards("he"));
                        },
                    },
                },
            },
            jsrgxuchong: {
                audio: 2,
                trigger: {
                    target: "useCardToTargeted"
                },
                logTarget: "player",
                content: function () {
                    "step 0"
                    var current = _status.currentPhase;
                    player.chooseControl().set('choiceList', [
                        `令${get.translation(current)}本回合的手牌上限+2`,
                        '摸一张牌'
                    ]);
                    "step 1"
                    if (result.index === 0) {

                        trigger.player.addTempSkill("jsrgxuchong_effect");
                        trigger.player.addMark("jsrgxuchong_effect", 2, false);
                    } else {
                        player.draw();
                    }
                    player.drawShadow('jsrg_ying', 'spade', 1, 1);
                },
                subSkill: {
                    effect: {
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.countMark("jsrgxuchong_effect");
                            },
                        },
                        onremove: true,
                        charlotte: true,
                        intro: {
                            content: "手牌上限+#",
                        },
                    },
                },
            },
            jsrgchiying: {
                audio: 2,
                enable: 'phaseUse',
                usable: 1,
                filterTarget: function (card, player, target) {
                    return true;
                },
                content: function () {
                    'step 0'
                    var targets = game.filterPlayer(current => current.inRangeOf(target) && current != player).sortBySeat(player);
                    event.targets = targets;
                    'step 1'
                    var current = targets.shift();
                    if (current && current.countCards('he')) current.chooseToDiscard('驰应：请弃置一张牌', 'he', true);
                    if (targets.length) event.redo();
                    'step 2'
                    var cards = [];
                    game.getGlobalHistory('cardMove', evt => {
                        if (evt.getParent(3) == event) {
                            cards.addArray(evt.cards.filter(card => get.type(card) == 'basic'));
                        }
                    });
                    cards = cards.filterInD('d');
                    if (cards.length) {
                        if (target != player) {
                            target.gain(cards, 'gain2');
                        } else {
                            if (cards.length <= target.hp) {
                                target.gain(cards, 'gain2');
                            }
                        }
                    }
                },
                ai: {
                    order: 6,
                    result: {
                        target: function (player, target) {
                            var targets = game.filterPlayer(current => current.inRange(target) && current != player);
                            var eff = 0;
                            for (var targetx of targets) {
                                var effx = get.effect(targetx, {
                                    name: 'guohe_copy2'
                                }, player, target);
                                if (get.attitude(player, targetx) < 0) effx /= 2;
                                eff += effx;
                            }
                            return (target == player ? 0.5 : 1) * eff * (get.attitude(player, target) <= 0 ? 0.75 : 1);
                        }
                    }
                }
            },
            jsrghuozhong: {
                audio: "dcjizhong",
                global: "jsrghuozhong_g",
                subSkill: {
                    g: {
                        audio: "dcjizhong",
                        enable: "phaseUse",
                        usable: 1,
                        filter: function (event, player) {
                            if (player.hasJudge("bingliang")) return false;
                            if (!game.hasPlayer(current => current.hasSkill("jsrghuozhong"))) return false;
                            return player.countCards("hes", card => get.color(card) == "black" && get.type2(card) != "trick") > 0;
                        },
                        viewAs: {
                            name: "bingliang"
                        },
                        position: "hes",
                        discard: false,
                        prompt: function () {
                            var list = game.filterPlayer(target => {
                                return target.hasSkill("jsrghuozhong");
                            });
                            return `将一张黑色非锦囊牌当【兵粮寸断】置于自己的判定区，然后令${get.translation(list)}${list.length > 1 ? "中的一人" : ""}摸两张牌。`;
                        },
                        filterCard: function (card, player, event) {
                            return get.color(card) == "black" && get.type2(card) != "trick" && player.canAddJudge({
                                name: "bingliang",
                                cards: [card]
                            });
                        },
                        selectTarget: -1,
                        filterTarget: function (card, player, target) {
                            return player == target;
                        },
                        check: function (card) {
                            return 6 - get.value(card);
                        },
                        precontent: function () {
                            var targets = game.filterPlayer(current => current.hasSkill("jsrghuozhong"));
                            var result;
                            if (targets.length) {
                                result = {
                                    bool: true,
                                    targets: targets
                                };
                            } else {

                                result = player.chooseTargetSync("请选择一名传教士，发动其的【惑众】", true, function (card, player, target) {
                                    return targets.includes(target);
                                });
                                result.targets = targets;
                            }
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill("jsrghuozhong", target);
                                var next = game.createEvent("jsrghuozhong_draw", false);
                                next.set("player", player);
                                next.set("target", target);
                                event.next.remove(next);
                                event.getParent().after.push(next);
                                next.setContent(function () {
                                    target.draw(2);
                                });
                            }
                        },
                        ai: {
                            result: {
                                player: function (player) {
                                    if (game.hasPlayer(current => get.attitude(player, current) > 2 && current.hasSkill("jsrghuozhong"))) return 1;
                                    return 0;
                                },
                            },
                            order: 9,
                        },
                    },
                },
            },

            jsrgfushan: {
                audio: 2,
                trigger: {
                    player: "phaseUseBegin"
                },
                forced: true,
                locked: false,
                filter: function (event, player) {
                    return game.hasPlayer((i) => i != player)
                },
                content: function () {
                    'step 0'
                    event.targets = game.filterPlayer((i) => i != player).sortBySeat()
                    event.playerNum = event.targets.length;
                    'step 1'
                    event.currentPlayer = event.targets[event.targets.length - event.playerNum]
                    var target = event.currentPlayer
                    if (!target.countCards('he')) {
                        event._result = {
                            bool: false
                        }
                    } else {
                        target.chooseCard('he', '交给' + get.translation(player) + '一张牌并令其此阶段使用【杀】的次数上限+1').set('ai', function (card) {
                            var player = _status.event.player,
                                target = _status.event.getParent().player,
                                val = get.value(card)
                            if (get.attitude(player, target) > 0) {
                                if (get.name(card, target) == 'sha' && target.hasValueTarget(card)) return 30 - val
                                return 20 - val
                            }
                            return -val
                        })
                    }
                    'step 2'
                    var target = event.currentPlayer
                    if (result.bool) {
                        player.addTempSkill('jsrgfushan_sha')
                        player.addMark('jsrgfushan_sha', 1, false)
                        target.give(result.cards, player)
                        if (!player.hasSkill('jsrgfushan_loseOrDraw')) player.addSkill('jsrgfushan_loseOrDraw')
                        player.markAuto("jsrgfushan_given", [target])
                    }
                    'step 3'
                    if (event.playerNum > 1) {
                        event.playerNum--;
                        event.goto(1)
                    }
                },
                subSkill: {
                    sha: {
                        charlotte: true,
                        onremove: true,
                        marktext: '血',
                        intro: {
                            content: '多杀#刀，誓诛环眼贼！'
                        },
                        mod: {
                            cardUsable: function (card, player, num) {
                                if (card.name == 'sha') return num + player.countMark('jsrgfushan_sha')
                            },
                        },
                    },
                    loseOrDraw: {
                        trigger: {
                            player: "phaseUseAfter"
                        },
                        onremove: true,
                        charlotte: true,
                        forced: true,
                        popup: false,
                        content: function () {
                            if (
                                player.getCardUsable("sha", true) > player.getHistory("useCard", evt => {
                                    return evt.getParent("phaseUse") == trigger && evt.card.name == "sha" && evt.addCount !== false
                                }).length && player.storage.jsrgfushan_given && player.storage.jsrgfushan_given.every(i => i.isIn())) {
                                player.loseHp(2)
                            } else {
                                player.drawTo(player.maxHp)
                            }
                            delete player.storage.jsrgfushan_given
                            player.removeSkill('jsrgfushan_loseOrDraw')
                        },
                    },
                },
            },

            jsrgfenjian: {
                audio: 2,
                enable: 'chooseToUse',
                usable: 1,
                locked: false,
                group: ['jsrgfenjian_fenjian'],
                filter: function (event, player) {
                    if (!event.filterCard || !event.filterCard({
                        name: 'juedou'
                    }, player, event)) return false;
                    return player.hp > 0;
                },
                filterTarget: function (card, player, target) {
                    return lib.filter.targetEnabled({
                        name: 'juedou'
                    }, player, target);
                },
                viewAs: {
                    name: 'juedou',
                    isCard: true
                },
                filterCard: () => false,
                log: false,
                selectCard: -1,
                precontent: function () {
                    player.logSkill("jsrgfenjian");
                    player.addTempSkill("jsrgfenjian_effect");
                    player.addMark("jsrgfenjian_effect", 1, false);
                },
                content: function () {
                    //player.logSkill('dbzhuifeng');
                    player.useCard({
                        name: 'juedou',
                        isCard: true
                    }, target);
                },
                ai: {
                    order: function () {
                        return get.order({
                            name: 'juedou'
                        }) - 0.5;
                    },
                },
                subSkill: {
                    effect: {
                        audio: "jsrgfenjian",
                        charlotte: true,
                        trigger: {
                            player: "damageBegin2"
                        },
                        forced: true,
                        onremove: true,
                        content: function () {
                            trigger.num += player.countMark("jsrgfenjian_effect");
                        },
                        intro: {
                            content: "本回合受到的伤害+#"
                        },
                    },
                    fenjian: {
                        audio: 'jsrgfenjian',
                        trigger: {
                            global: 'dying'
                        },
                        //priority:6,
                        usable: 1,
                        filter: function (event, player) {
                            return event.player != player;
                        },
                        check: function (event, player) {
                            if (get.attitude(player, event.player) < 0) return false;
                            if (player.countCards('h', {
                                name: ['tao', 'jiu']
                            }) + event.player.hp < 0) return false;
                            return true;
                        },
                        content: function () {
                            'step 0'
                            player.logSkill("jsrgfenjian");
                            player.addTempSkill("jsrgfenjian_effect");
                            player.addMark("jsrgfenjian_effect", 1, false);
                            'step 1'
                            trigger.player.recover();
                        },

                    },
                },
            },

            jsrgrihui: {
                audio: "dcrihui",
                locked: false,
                trigger: {
                    source: "damageSource"
                },
                filter: function (event, player) {
                    return (
                        event.getParent().type == "card" && event.card && event.card.name == "sha" && game.hasPlayer((current) => {
                            return current != player && current.countCards("j");
                        }));
                },
                prompt: "是否发动【日彗】？",
                prompt2: function (event, player) {
                    var list = game.filterPlayer((current) => {
                        return current != player && current.countCards("j");
                    });
                    return `令${get.translation(list)}${list.length > 1 ? "各" : ""}摸一张牌。`;
                },
                logTarget: function (event, player) {
                    return game.filterPlayer((current) => {
                        return current != player && current.countCards("j");
                    });
                },
                group: "jsrgrihui_sha",
                content: function () {
                    game.asyncDraw(lib.skill.jsrgrihui.logTarget(trigger, player));
                },
                mod: {
                    cardUsableTarget: function (card, player, target) {
                        if (card.name == "sha" && !player.getStorage("jsrgrihui_targeted").includes(target)) return true;
                    },
                },
                subSkill: {
                    sha: {
                        trigger: {
                            player: "useCardToPlayered"
                        },
                        forced: true,
                        silent: true,
                        firstDo: true,
                        content: function () {
                            player.addTempSkill("jsrgrihui_targeted");
                            player.markAuto("jsrgrihui_targeted", trigger.target);
                        },
                    },
                    targeted: {
                        charlotte: true,
                        onremove: true,
                    },
                },
            },
            //"准备阶段，你可以选择一项：1.弃置一张牌，对一名未对你造成过伤害的角色造成1点伤害；2.令一名对你造成过伤害的角色摸两张牌。",
            jsrgniluan: {
                audio: "niluan",
                trigger: {
                    player: "phaseZhunbeiBegin"
                },
                direct: true,
                content: function () {
                    "step 0";
                    var damaged = game.filterPlayer((current) => {
                        return current.hasAllHistory("sourceDamage", (evt) => evt.player == player);
                    });
                    var undamaged = game.filterPlayer().removeArray(damaged);
                    player.chooseCardTarget({
                        prompt: get.prompt("jsrgniluan"),
                        prompt2: `${undamaged.length
                            ? "选择一张牌弃置并选择一名未对你造成过伤害的角色，你对其造成1点伤害"
                            : ""
                            }${undamaged.length && damaged.length ? "；<br>或" : ""}${damaged.length ? "仅选择一名对你造成过伤害的角色，你令其摸两张牌" : ""
                            }。`,
                        damaged: damaged,
                        filterCard: lib.filter.cardDiscardable,
                        selectCard: function () {
                            if (damaged.length === 0) return 1;
                            if (damaged.length === game.countPlayer()) return 0;
                            return [0, 1];
                        },
                        position: "he",
                        filterTarget: function (card, player, target) {
                            return damaged.includes(target) ^ (ui.selected.cards.length > 0);
                        },
                        selectTarget: 1,
                    });
                    "step 1";
                    if (result.bool) {
                        var cards = result.cards,
                            target = result.targets[0];
                        player.logSkill("jsrgniluan", target);
                        if (cards && cards.length) {
                            player.discard(cards);
                            game.delayex();
                            target.damage();
                        } else {
                            target.draw(2);
                        }
                    }
                },
            },
            jsrghuchou: {
                audio: 2,
                trigger: {
                    source: "damageBegin1"
                },
                filter: function (event, player) {
                    var history = _status.globalHistory;
                    for (var i = history.length - 1; i >= 0; i--) {
                        var evts = history[i]["useCard"];
                        for (var j = evts.length - 1; j >= 0; j--) {
                            var evt = evts[j];
                            var card = evt.card,
                                targets = evt.targets;
                            if (!get.tag(card, "damage") || !targets.includes(player)) continue;
                            return event.player == evt.player;
                        }
                    }
                    return false;
                },
                forced: true,
                content: function () {
                    trigger.num++;
                },
                ai: {
                    damageBonus: true,
                    skillTagFilter: (player, tag, arg) => {
                        if (tag === "damageBonus" && arg && arg.target) {
                            var history = _status.globalHistory;
                            for (var i = history.length - 1; i >= 0; i--) {
                                var evts = history[i]["useCard"];
                                for (var j = evts.length - 1; j >= 0; j--) {
                                    var evt = evts[j];
                                    var card = evt.card,
                                        targets = evt.targets;
                                    if (!get.tag(card, "damage") || !targets.includes(player)) continue;
                                    return arg.target === evt.player;
                                }
                            }
                            return false;
                        }
                    },
                    effect: {
                        player: (card, player, target) => {
                            if (
                                get.tag(card, "damage") && target && lib.skill.jsrghuchou.ai.skillTagFilter(player, "damageBonus", {
                                    card: card,
                                    target: target,
                                }) && !target.hasSkillTag("filterDamage", null, {
                                    player: player,
                                    card: card,
                                })) return [1, 0, 2, 0];
                        },
                    },
                },
            },
            jsrgjiemeng: {
                audio: 2,
                zhuSkill: true,
                forced: true,
                init: (player) => {
                    if (player.hasZhuSkill("jsrgjiemeng")) game.addGlobalSkill("jsrgjiemeng_effect");
                },
                onremove: () => {
                    if (!game.hasPlayer((i) => i.hasZhuSkill("jsrgjiemeng"), true)) game.removeGlobalSkill("jsrgjiemeng_effect");
                },
                subSkill: {
                    effect: {
                        mod: {
                            globalFrom: function (from, to, distance) {
                                if (from.group != "qun") return;
                                if (to.hasZhuSkill("jsrgjiemeng")) return;
                                return distance - game.countPlayer((current) => current.group == "qun");
                            },
                        },
                        trigger: {
                            player: "dieAfter"
                        },
                        filter: () => {
                            return !game.hasPlayer((i) => i.hasZhuSkill("jsrgjiemeng"), true);
                        },
                        silent: true,
                        forceDie: true,
                        content: () => {
                            game.removeGlobalSkill("jsrgjiemeng_effect");
                        },
                    },
                },
            },
            jsrgyangming: {
                audio: 2,
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return game.hasPlayer((current) => {
                        return player.canCompare(current);
                    });
                },
                filterTarget: function (card, player, current) {
                    return player.canCompare(current);
                },
                content: function () {
                    "step 0";
                    event.num = 0;
                    "step 1";
                    player.chooseToCompare(target).set(
                        "small",
                        get.attitude(player, target) > 0 && (player.countCards("h", (card) => {
                            return get.value(card) < 6;
                        }) <= 1 || target.countCards("h", (card) => {
                            return get.value(card) < 6;
                        }) <= 1));
                    "step 2";
                    if (result.winner != target) {
                        if (!player.canCompare(target)) event._result = {
                            bool: false
                        };
                        else player.chooseBool("是否与其重复此拼点流程？").set("ai", () => get.event("bool")).set("bool", get.effect(target, "jsrgyangming", player, player) > 0);
                        event.num++;
                    } else {
                        if (event.num) target.draw(event.num);
                        player.recover();
                        event.finish();
                    }
                    "step 3";
                    if (result.bool) {
                        event.goto(1);
                    }
                },
                ai: {
                    order: 1,
                    expose: 0.15,
                    result: {
                        target: function (player, target) {
                            var maxnum = 0;
                            var cards2 = target.getCards("h");
                            for (var i = 0; i < cards2.length; i++) {
                                if (get.number(cards2[i]) > maxnum) {
                                    maxnum = get.number(cards2[i]);
                                }
                            }
                            if (maxnum > 10) maxnum = 10;
                            if (maxnum < 5 && cards2.length > 1) maxnum = 5;
                            var cards = player.getCards("h");
                            for (var i = 0; i < cards.length; i++) {
                                if (get.number(cards[i]) < maxnum) return 1;
                            }
                            return 0;
                        },
                    },
                },
            },
            jsrgbaohe: {
                audio: 2,
                trigger: {
                    global: "phaseUseEnd"
                },
                filter: function (event, player) {
                    return (
                        player.countCards("he") >= 2 && game.hasPlayer((current) => {
                            return current.inRange(event.player) && player.canUse("sha", current, false);
                        }));
                },
                direct: true,
                content: function () {
                    "step 0";
                    player.chooseToDiscard(get.prompt2("jsrgbaohe"), 2, "he").set("ai", (card) => {
                        var val = _status.event.val;
                        if (val > 20) return 6 - get.value(card);
                        if (val > 0) return 4 - get.value(card);
                        return 0;
                    }).set(
                        "val",
                        game.filterPlayer((current) => {
                            return (
                                current.inRange(trigger.player) && player.canUse("sha", current, false));
                        }).map((i) => get.effect(i, {
                            name: "sha"
                        }, player, player)).reduce((p, c) => {
                            return p + c;
                        }, 0)).set("logSkill", "jsrgbaohe");
                    "step 1";
                    if (result.bool) {
                        var targets = game.filterPlayer((current) => {
                            return current.inRange(trigger.player) && player.canUse("sha", current, false);
                        });
                        if (targets.length) {
                            game.delayex();
                            player.useCard({
                                name: "sha",
                                isCard: true,
                                storage: {
                                    jsrgbaohe: true
                                }
                            },
                                targets,
                                false);
                            player.addTempSkill("jsrgbaohe_add");
                        }
                    }
                },
                subSkill: {
                    add: {
                        audio: "jsrgbaohe",
                        trigger: {
                            global: "useCard",
                        },
                        charlotte: true,
                        forced: true,
                        filter: function (event, player) {
                            var evt = event.getParent(3),
                                respondTo = event.respondTo;
                            if (
                                evt.name != "useCard" || !Array.isArray(respondTo) || !respondTo[1].storage || !respondTo[1].storage.jsrgbaohe) return false;
                            return evt.targets.length > evt.num + 1;
                        },
                        logTarget: function (event) {
                            var evt = event.getParent(3);
                            return evt.targets.slice(evt.num + 1);
                        },
                        content: function () {
                            "step 0";
                            var evt = trigger.getParent(3);
                            var targets = evt.targets.slice(evt.num + 1);
                            var map = evt.customArgs;
                            for (var target of targets) {
                                var id = target.playerid;
                                if (!map[id]) map[id] = {};
                                if (typeof map[id].extraDamage != "number") {
                                    map[id].extraDamage = 0;
                                }
                                map[id].extraDamage++;
                            }
                            game.delayx();
                        },
                    },
                },
            },
            jsrgxushi: {
                audio: 2,
                enable: "phaseUse",
                usable: 1,
                filterCard: true,
                filterTarget: lib.filter.notMe,
                selectCard: [1, Infinity],
                selectTarget: [1, Infinity],
                position: "he",
                filterOk: function () {
                    return ui.selected.cards.length == ui.selected.targets.length;
                },
                check: function (card) {
                    var player = get.player();
                    if (
                        ui.selected.cards.length >= game.countPlayer((current) => {
                            return current != player && get.attitude(player, current) > 0;
                        })) return 0;
                    return 5 - get.value(card);
                },
                prompt: "按顺序选择卡牌和角色，并将卡牌交给对应顺序的角色。然后你获得两倍数量的【影】。",
                complexSelect: true,
                multitarget: true,
                multiline: true,
                discard: false,
                lose: false,
                delay: false,
                contentBefore: function () {
                    event.getParent()._jsrgxushi_targets = targets.slice();
                },
                content: function () {
                    "step 0";
                    var targets = event.getParent()._jsrgxushi_targets;
                    var list = [];
                    for (var i = 0; i < targets.length; i++) {
                        var target = targets[i];
                        var card = cards[i];
                        list.push([target, card]);
                        player.line(target);
                    }
                    game.loseAsync({
                        gain_list: list,
                        player: player,
                        cards: cards,
                        giver: player,
                        animate: "giveAuto",
                    }).setContent("gaincardMultiple");
                    "step 1";
                    player.drawShadow('jsrg_ying', 'spade', 1, 2 * cards.length); // 获得两倍数量的【影】
                },
                ai: {
                    order: 2.5,
                    result: {
                        target: function (player, target) {
                            var card = ui.selected.cards[ui.selected.targets.length];
                            if (!card) return 0;
                            if (get.value(card) < 0) return -1;
                            if (get.value(card) < 1.5 && player.hasSkill("jsrgbaohe")) return (get.sgnAttitude(player, target) + 0.01) / 5;
                            return Math.sqrt(5 - Math.min(4, target.countCards("h")));
                        },
                    },
                },
            },
            jsrgpianchong: {
                audio: "pianchong",
                trigger: {
                    global: "phaseJieshuBegin"
                },
                filter: function (event, player) {
                    return player.getHistory("lose").length;
                },
                frequent: true,
                content: function () {
                    "step 0"
                    player.judge();
                    "step 1"
                    var num = 0;
                    event.color = result.color;
                    game.getGlobalHistory("cardMove", function (evt) {
                        if (evt.name != "cardsDiscard") {
                            if (evt.name != "lose" || evt.position != ui.discardPile) return;
                        }
                        num += evt.cards.filter(function (card) {
                            return get.color(card, false) == result.color;
                        }).length;
                    });
                    if (num > 0) player.draw(num);
                },
            },
            jsrgshacheng: {
                audio: 2,
                trigger: {
                    global: "useCardAfter"
                },
                filter: function (event, player) {
                    if (event.card.name !== "sha") return false;
                    return event.targets.some(i => i.isIn() && i.hasHistory("lose", evt => evt.cards2.length)) && player.getExpansions("jsrgshacheng").length;
                },
                direct: true,
                group: "jsrgshacheng_build",
                content: function () {
                    "step 0";
                    if (_status.connectMode) {
                        game.broadcastAll(() => {
                            _status.noclearcountdown = true;
                        });
                    }
                    var targets = trigger.targets.filter(i => i.isIn() && i.hasHistory("lose", evt => evt.cards2.length));
                    var result = player.chooseTarget(get.prompt("jsrgshacheng"), "令一名目标角色摸X张牌，然后移去一张“城”（X为对应角色本回合失去过的牌数且至多为5）", function (card, player, target) {
                        return targets.includes(target);
                    }).set("targets", targets).set("targetx", (() => {
                        var info = [];
                        targets.filter(target => {
                            var att = get.attitude(player, target);
                            if (att <= 0) return false;
                            if (Math.abs(att) > 1) att = Math.sign(att) * Math.sqrt(Math.abs(att));
                            info.push([
                                target,
                                att * target.getHistory("lose").map(evt => evt.cards2.length).reduce((p, c) => p + c, 0),
                            ]);
                            return false;
                        });
                        if (!info.length) return null;
                        info.sort((a, b) => b[1] - a[1])[0];
                        if (info[1] <= 0) return null;
                        return info[0];
                    })());
                    "step 1";
                    if (result && result.bool) {
                        event.target = result.targets[0];
                        var cards = player.getExpansions("jsrgshacheng");
                        if (cards.length === 1) event._result = {
                            bool: true,
                            links: cards
                        };
                        else player.chooseButton(["沙城：移去一张“城”", cards], true);
                    } else {
                        if (_status.connectMode) {
                            game.broadcastAll(() => {
                                delete _status.noclearcountdown;
                                game.stopCountChoose();
                            });
                        }
                        event.finish();
                    }
                    "step 2";
                    if (_status.connectMode) {
                        game.broadcastAll(() => {
                            delete _status.noclearcountdown;
                            game.stopCountChoose();
                        });
                    }
                    if (result && result.bool) {
                        player.logSkill("jsrgshacheng", target);
                        player.loseToDiscardpile(result.links);
                        target.draw(
                            Math.min(
                                5,
                                target.getHistory("lose").map(evt => evt.cards2.length).reduce((p, c) => p + c, 0)));
                    }
                },
                marktext: "城",
                intro: {
                    content: "expansion",
                    markcount: "expansion",
                },
                onremove: function (player, skill) {
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                subSkill: {
                    build: {
                        trigger: {
                            global: "phaseBefore",
                            player: "enterGame",
                        },
                        forced: true,
                        locked: false,
                        filter: function (event, player) {
                            return event.name !== "phase" || game.phaseNumber === 0;
                        },
                        content: function () {
                            var cards = get.cards(2);
                            player.addToExpansion(cards, "gain2").gaintag.add("jsrgshacheng");
                        },
                    },
                },
            },
            jsrgninghan: {
                name: "凝寒",
                audio: 2,
                init: function (player) {
                    game.addGlobalSkill("jsrgninghan_frozen");
                },
                onremove: function (player) {
                    if (!game.hasPlayer(current => current != player && current.hasSkill("jsrgninghan"))) {
                        game.removeGlobalSkill("jsrgninghan_frozen");
                    }
                },
                trigger: {
                    global: "damageEnd"
                },
                filter: function (event, player) {
                    if (!event.nature || event.nature !== "ice") return false;
                    return event.cards && event.cards.filterInD().length;
                },
                forced: true,
                content: function () {
                    var cards = trigger.cards.filterInD();
                    player.addToExpansion(cards, "gain2").gaintag.add("jsrgshacheng");
                },
                subSkill: {
                    frozen: {
                        mod: {
                            cardnature: function (card, player) {
                                if (card.name === "sha" && get.suit(card) === "club") return "ice";
                            },
                            aiOrder: function (player, card, num) {
                                if (num && card.name === "sha" && get.nature(card) === "ice") {
                                    var fz = game.findPlayer(current => current.hasSkill("jsrgninghan"));
                                    if (fz) return num + 0.15 * Math.sign(get.attitude(player, fz));
                                }
                            }
                        },
                        trigger: {
                            player: "dieAfter"
                        },
                        filter: function (event, player) {
                            return !game.hasPlayer(current => current != player && current.hasSkill("jsrgninghan"));
                        },
                        silent: true,
                        forceDie: true,
                        content: function () {
                            game.removeGlobalSkill("jsrgninghan_frozen");
                        }
                    }
                },
                ai: {
                    combo: "jsrgshacheng"
                }
            },
            //刘备
            jsrgjishan: {
                audio: 2,
                trigger: {
                    global: 'damageBegin4'
                },
                usable: 1,
                filter: function (event, player) {
                    return player.hp > 0;
                },
                logTarget: 'player',
                onremove: true,
                prompt2: '失去1点体力并防止此伤害，然后你与其各摸一张牌',
                check: function (event, player) {
                    return get.damageEffect(event.player, event.source, player, event.nature) * Math.sqrt(event.num) <= get.effect(player, {
                        name: 'losehp'
                    }, player, player);
                },
                group: 'jsrgjishan_recover',
                content: function () {
                    'step 0'
                    trigger.cancel();
                    player.loseHp();
                    player.markAuto('jsrgjishan', [trigger.player]);
                    'step 1'
                    if (player.isIn() && trigger.player.isIn()) {
                        var targets = [player, trigger.player];
                        targets.sortBySeat(_status.currentPhase);
                        targets[0].draw('nodelay');
                        targets[1].draw();
                    }
                },
                intro: {
                    content: '已帮助$抵挡过伤害'
                },
                ai: {
                    expose: 0.2
                },
                subSkill: {
                    recover: {
                        audio: 'jsrgjishan',
                        trigger: {
                            source: 'damageSource'
                        },
                        filter: function (event, player) {
                            return game.hasPlayer(current => {
                                return current.isMinHp() && player.getStorage('jsrgjishan').contains(current);
                            });
                        },
                        usable: 1,
                        direct: true,
                        content: function () {
                            'step 0'
                            player.chooseTarget(get.prompt('jsrgjishan_recover'), '令一名体力值最小且你对其发动过〖积善①〗的角色回复1点体力', (card, player, target) => {
                                return target.isMinHp() && player.getStorage('jsrgjishan').contains(target);
                            }).set('ai', target => {
                                return get.recoverEffect(target, _status.event.player, _status.event.player);
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('jsrgjishan_recover', target);
                                target.recover();
                            } else player.storage.counttrigger.jsrgjishan_recover--;
                        }
                    }
                }
            },
            jsrgzhenqiao: {
                audio: 2,
                trigger: {
                    player: 'useCardToTargeted'
                },
                forced: true,
                shaRelated: true,
                filter: function (event, player) {
                    return event.isFirstTarget && event.card.name == 'sha' && !player.getEquip(1) && !player.isDisabled(1);
                },
                content: function () {
                    trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
                    trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
                },
                ai: {
                    effect: {
                        target: function (card, player, target) {
                            if (player._jsrgzhenqiao_aiChecking) return;
                            if (target == player && get.subtype(card) == 'equip1' && !player.getEquip(1)) {
                                player._jsrgzhenqiao_aiChecking = true;
                                var eff = get.effect(target, card, player, player);
                                delete player._jsrgzhenqiao_aiChecking;
                                if (eff < 3) return 'zerotarget';
                            }
                        }
                    }
                },
                mod: {
                    attackRange: function (player, num) {
                        return num + 1;
                    },
                }
            },
            jsrgyingmen: {
                audio: 2,
                trigger: {
                    global: "phaseBefore",
                    player: ["enterGame", "phaseBegin"],
                },
                forced: true,
                filter: function (event, player, name) {
                    if (player.getStorage("jsrgyingmen").length >= 4) return false;
                    if (name == "phaseBefore") return game.phaseNumber == 0;
                    return event.name != "phase" || event.player == player;
                },
                update: function (player) {
                    var id = player.playerid;
                    var characters = player.getStorage("jsrgyingmen");
                    var skillName = "jsrgpingjian_" + id;
                    var skillsx = [],
                        skillsx2 = [];
                    var map = {};
                    var skillsy = lib.skill[skillName] ? lib.skill[skillName].group : [];
                    for (var name of characters) {
                        var skills = lib.character[name][3].slice();
                        skills = skills.filter((skill) => {
                            var list = get.skillCategoriesOf(skill, player);
                            list.removeArray(["锁定技", "Charlotte"]);
                            if (list.length) return false;
                            var info = get.info(skill);
                            return info && (!info.unique || info.gainable);
                        });
                        game.expandSkills(skills);
                        for (var i = 0; i < skills.length; i++) {
                            var skill = skills[i];
                            var info = get.info(skill);
                            if (info.silent || info.charlotte) continue;
                            if (!info.forced && !info.frequent && (!info.mod || (info.charlotte && info.mod)))
                                continue;
                            var infox = get.copy(info);
                            var newname = skill + "_" + id;
                            map[newname] = infox;
                            if (info.audio) infox.audio = typeof info.audio != "number" ? info.audio : skill;
                            // if(infox.group) delete infox.group;
                            if (infox.frequent) delete infox.frequent;
                            if (infox.forceDie) delete infox.forceDie;
                            var popup = infox.popup;
                            if (infox.forced && infox.direct) {
                                delete infox.direct;
                                infox.popup = false;
                            }
                            if (infox.forced && !infox.prompt2) {
                                var skillx = skill;
                                while (true) {
                                    var prompt2 = lib.translate[skillx + "_info"];
                                    if (prompt2 && prompt2.length) {
                                        infox.prompt2 = prompt2;
                                        break;
                                    }
                                    var ind = skillx.lastIndexOf("_");
                                    if (ind == -1) break;
                                    skillx = skillx.slice(0, ind);
                                }
                            }
                            if (popup != false && !infox.silent) infox.forced = false;
                            if (!infox.charlotte && infox.mod) delete infox.mod;
                            skillsx2.add(skill);
                            skills[i] = newname;
                        }
                        if (skills.length) {
                            skillsx.addArray(skills);
                        }
                    }
                    var skillsRemoving = skillsy.removeArray(skillsx);
                    player.removeSkill(skillsRemoving);
                    game.broadcastAll(
                        function (name, skillsx, skillsx2, id, map) {
                            for (var i in map) lib.skill[i] = map[i];
                            lib.skill[name] = {
                                unique: true,
                                group: skillsx,
                            };
                            lib.translate[name] = "评鉴";
                            for (var i of skillsx2) {
                                lib.translate[i + "_" + id] = lib.translate[i];
                                lib.translate[i + "_" + id + "_info"] = lib.translate[i + "_info"];
                            }
                        },
                        skillName,
                        skillsx,
                        skillsx2,
                        id,
                        map
                    );
                    player.addSkill(skillName);
                    player.addSkill("jsrgpingjian_blocker");
                    player.addSkillTrigger(skillName);
                },
                bannedList: ["zishu", "weishu", "xinfu_zhanji", "kyouko_rongzhu"],
                content: function () {
                    "step 0";
                    if (!_status.characterlist) lib.skill.pingjian.initList();
                    var num = player.getStorage("jsrgyingmen").length;
                    var list = [];
                    _status.characterlist.randomSort();
                    for (var i = 0; i < _status.characterlist.length; i++) {
                        var name = _status.characterlist[i];
                        var skills = lib.character[name][3].slice();
                        if (
                            skills.some((skill) => {
                                return lib.skill.jsrgyingmen.bannedList.includes(skill);
                            })
                        )
                            continue;
                        list.push(name);
                        _status.characterlist.remove(name);
                        if (list.length >= 4 - num) break;
                    }
                    if (list.length) {
                        player.markAuto("jsrgyingmen", list);
                        if (player.hasSkill("jsrgpingjian", null, false, false))
                            lib.skill.jsrgyingmen.update(player);
                        game.log(player, "将", "#g" + get.translation(list), "置为", "#y访客");
                        game.broadcastAll(
                            function (player, list) {
                                var cards = [];
                                for (var i = 0; i < list.length; i++) {
                                    var cardname = "huashen_card_" + list[i];
                                    lib.card[cardname] = {
                                        fullimage: true,
                                        image: "character:" + list[i],
                                    };
                                    lib.translate[cardname] = get.rawName2(list[i]);
                                    cards.push(game.createCard(cardname, "", ""));
                                }
                                player.$draw(cards, "nobroadcast");
                            },
                            player,
                            list
                        );
                    }
                },
                ai: {
                    combo: "jsrgpingjian",
                },
                marktext: "客",
                intro: {
                    name: "访客(盈门/评鉴)",
                    mark: function (dialog, storage, player) {
                        dialog.addText("剩余“访客”");
                        if (storage) dialog.addSmall([storage, "character"]);
                        else dialog.addText("无");
                    },
                },
            },
            jsrgpingjian: {
                audio: 2,
                trigger: { player: ["logSkill", "useSkillAfter"] },
                forced: true,
                locked: false,
                onremove: function (player) {
                    player.removeSkill("jsrgpingjian_" + player.playerid);
                },
                filter: function (event, player) {
                    var skill = event.skill,
                        name = event.event ? event.event.name : "";
                    var visitors = player.getStorage("jsrgyingmen");
                    for (var visitor of visitors) {
                        var skills = lib.character[visitor][3].slice();
                        game.expandSkills(skills);
                        var info = get.info(skill);
                        if (info && (info.charlotte || info.silent)) continue;
                        if (
                            skills.some((skillx) => {
                                return (
                                    skill.indexOf(skillx) == 0 ||
                                    name.indexOf(skillx + "_" + player.playerid) == 0
                                );
                            })
                        )
                            return true;
                    }
                    return false;
                },
                content: function () {
                    "step 0";
                    var current;
                    var skill = trigger.skill,
                        name = trigger.event ? trigger.event.name : "";
                    var visitors = player.getStorage("jsrgyingmen");
                    for (var visitor of visitors) {
                        var skills = lib.character[visitor][3].slice();
                        game.expandSkills(skills);
                        var info = get.info(skill);
                        if (info && info.charlotte) continue;
                        if (
                            skills.some((skillx) => {
                                return (
                                    skill.indexOf(skillx) == 0 ||
                                    name.indexOf(skillx + "_" + player.playerid) == 0
                                );
                            })
                        ) {
                            current = visitor;
                            break;
                        }
                    }
                    event.current = current;
                    player
                        .chooseButton(
                            [
                                '###评鉴：移去一名访客###<div class="text center">若移去的访客为' +
                                get.translation(current) +
                                "，则你摸一张牌</div>",
                                [player.getStorage("jsrgyingmen"), "character"],
                            ],
                            true
                        )
                        .set("ai", (button) => {
                            if (button.link == _status.event.toremove) return 1;
                            return Math.random();
                        })
                        .set(
                            "toremove",
                            (function () {
                                var list = player.getStorage("jsrgyingmen");
                                var rand = Math.random();
                                if (rand < 0.33) return list[0];
                                if (rand < 0.66) return current;
                                return list.randomGet();
                            })()
                        );
                    "step 1";
                    if (result.bool) {
                        var visitor = result.links[0];
                        game.log(player, "从", "#y访客", "中移去了", "#g" + get.translation(visitor));
                        player.popup(visitor);
                        player.unmarkAuto("jsrgyingmen", [visitor]);
                        _status.characterlist.add(visitor);
                        if (visitor == event.current) player.draw();
                        lib.skill.jsrgyingmen.update(player);
                    }
                },
                subSkill: {
                    blocker: {
                        init: function (player, skill) {
                            player.addSkillBlocker(skill);
                        },
                        onremove: function (player, skill) {
                            player.removeSkillBlocker(skill);
                        },
                        charlotte: true,
                        locked: true,
                        skillBlocker: function (skill, player) {
                            if (skill != "jsrgpingjian_" + player.playerid) return false;
                            if (player._jsrgpingjian_blockerChecking) return;
                            player._jsrgpingjian_blockerChecking = true;
                            var own = player.hasSkill("jsrgpingjian");
                            delete player._jsrgpingjian_blockerChecking;
                            return !own;
                        },
                    },
                },
            },
            jsrgzhaotu: {
                audio: 2,
                filter: function (event, player) {
                    return player.hasCard((card) => (get.type2(card) != 'trick' && get.color(card) == 'red'), 'hes') && !player.hasSkill('jsrgzhaotu_block');
                },
                enable: "chooseToUse",
                filterCard: function (card) {
                    return get.color(card) == 'red' && get.type2(card) != 'trick';
                },
                position: "hes",
                viewAs: {
                    name: "lebu",
                },
                prompt: "将一张红色非锦囊牌当乐不思蜀使用",
                check: function (card) {
                    return 8 - get.value(card)
                },
                onuse: function (event, player) {
                    player.addSkill('jsrgzhaotu_block')
                },
                ai: {
                    threaten: 1.5,
                    basic: {
                        order: 1,
                        useful: 1,
                        value: 8,
                    },
                    result: {
                        ignoreStatus: true,
                        target: function (player, target) {
                            var num = target.hp - target.countCards('h') - 2;
                            if (num > -1) return -0.01;
                            if (target.hp < 3) num--;
                            if (target.isTurnedOver()) num /= 2;
                            var dist = get.distance(player, target, 'absolute');
                            if (dist < 1) dist = 1;
                            return num / Math.sqrt(dist) * get.threaten(target, player);
                        },
                    },
                    tag: {
                        skip: "phaseUse",
                    },
                },
                group: ['jsrgzhaotu_refresh', 'jsrgzhaotu_use'],
                subSkill: {
                    block: {
                        charlotte: true
                    },
                    refresh: {
                        trigger: {
                            global: 'roundFinish'
                        },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.hasSkill('jsrgzhaotu_block')
                        },
                        content: function () {
                            player.removeSkill('jsrgzhaotu_block')
                        }
                    },
                    use: {
                        trigger: {
                            player: 'useCardToTargeted'
                        },
                        direct: true,
                        filter: function (event, player) {
                            return event.skill == 'jsrgzhaotu' && event.target;
                        },
                        content: function () {
                            trigger.target.addSkill('jsrgzhaotu_awake');
                        }
                    },
                    awake: {
                        trigger: {
                            global: 'phaseEnd'
                        },
                        direct: true,
                        charlotte: true,
                        onremove: true,
                        mod: {
                            maxHandcard: function (player, num) {
                                return num - 2;
                            },
                        },
                        content: function () {
                            player.addSkill('jsrgzhaotu_mod');
                            player.removeSkill('jsrgzhaotu_awake');
                            player.insertPhase();
                        }
                    },
                    mod: {
                        mod: {
                            maxHandcard: function (player, num) {
                                return num - 2;
                            },
                        },
                        trigger: {
                            player: 'phaseEnd'
                        },
                        direct: true,
                        charlotte: true,
                        onremove: true,
                        content: function () {
                            player.removeSkill('jsrgzhaotu_mod');
                        }
                    }
                }

            },
            jsrgjingju: {
                enable: "chooseToUse",
                hiddenCard: function (player, name) {
                    if (get.type(name) != 'basic') return false;
                    return !player.storage._disableJudge && game.hasPlayer(function (current) {
                        return current != player && current.countCards('j', function (card) {
                            return player.canAddJudge(card);
                        }) > 0;
                    });
                },
                filter: function (event, player) {
                    return !player.storage._disableJudge && game.hasPlayer(function (current) {
                        return current != player && current.countCards('j', function (card) {
                            return player.canAddJudge(card);
                        }) > 0;
                    })
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var vcards = [];
                        for (var name of lib.inpile) {
                            if (get.type(name) != 'basic') continue;
                            var card = {
                                name: name,
                                isCard: true
                            };
                            if (event.filterCard(card, player, event)) vcards.push(['基本', '', name]);
                            if (name == 'sha') {
                                for (var nature of lib.inpile_nature) {
                                    card.nature = nature;
                                    if (event.filterCard(card, player, event)) vcards.push(['基本', '', name, nature]);
                                }
                            }
                        }
                        return ui.create.dialog('惊惧', [vcards, 'vcard'], 'hidden');
                    },
                    check: function (button) {
                        var player = _status.event.player;
                        var card = {
                            name: button.link[2],
                            nature: button.link[3]
                        };
                        if ((game.hasPlayer(function (current) {
                            return current.countCards('j') > 0 && get.attitude(player, current) > 0;
                        }) || (player.hp < 1)) && game.hasPlayer(function (current) {
                            return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
                        })) {
                            switch (button.link[2]) {
                                case 'tao':
                                    return 5;
                                case 'jiu':
                                    return 3.01;
                                case 'shan':
                                    return 3.01;
                                case 'sha':
                                    if (button.link[3] == 'fire') return 2.95;
                                    else if (button.link[3] == 'fire') return 2.92;
                                    else return 2.9;
                            }
                        }
                        return 0;
                    },
                    backup: function (links, player) {
                        return {
                            check: function (card) {
                                return 1 / Math.max(0.1, get.value(card));
                            },
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                suit: 'none',
                                number: null,
                                isCard: false,
                            },
                            filterCard: () => false,
                            selectCard: 0,
                            popname: true,
                            ignoreMod: true,
                            precontent: function () {
                                'step 0'
                                player.chooseTarget(function (card, player, target) {
                                    return target != player && target.countCards('j', function (card) {
                                        return player.canAddJudge(card);
                                    }) > 0;
                                }, '将一名其他角色判定区内的一张牌移动到你的判定区内', true);
                                'step 1'
                                if (result.bool) {
                                    var target = result.targets[0];
                                    player.logSkill('jsrgjingju', target);
                                    event.target = target;
                                    player.choosePlayerCard(target, 'j', true).set('filterButton', function (button) {
                                        return _status.event.player.canAddJudge(button.link);
                                    })
                                } else event.finish();
                                'step 2'
                                if (result.bool && result.cards && result.cards.length) {
                                    var card = result.cards[0];
                                    target.$give(card, player);
                                    game.delayx();
                                    var name = card.viewAs || card.name;
                                    if (card.name != name) {
                                        player.addJudge(name, card);
                                    } else {
                                        player.addJudge(card);
                                    }
                                }

                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '选择一名角色成为' + get.translation(links[0][3] || '') + get.translation(links[0][2]) + '的目标';
                    },
                },
                ai: {
                    order: function () {
                        var player = _status.event.player;
                        if (get.effect(player, {
                            name: 'jiu'
                        }) > 0) {
                            return 3.1;
                        }
                        return 2.9;
                    },
                    respondSha: true,
                    fireAttack: true,
                    respondShan: true,
                    save: true,
                    skillTagFilter: function (player, tag, arg) {
                        if (tag == 'fireAttack') return true;
                    },
                    result: {
                        player: function (player) {
                            if (_status.event.type == 'dying') {
                                return get.attitude(player, _status.event.dying);
                            } else {
                                return 1;
                            }
                        },
                    },
                },

            },
            jsrgweizhui: {
                zhuSkill: true,
                unique: true,
                trigger: {
                    global: 'phaseEnd'
                },
                filter: function (event, player) {
                    return event.player.group == 'wei' && event.player != player && event.player.hasCard((card) => (get.color(card) == 'black'), 'h') && player.hasZhuSkill('jsrgweizhui');
                },
                direct: true,
                content: function () {
                    'step 0'
                    var next = trigger.player.chooseToUse();
                    next.set('openskilldialog', '危坠：是否将一张黑色牌当作【过河拆桥】对' + get.translation(player) + '使用？');
                    next.set('norestore', true);
                    next.set('_backupevent', 'jsrgweizhuix');
                    next.set('custom', {
                        add: {},
                        replace: {
                            window: function () { }
                        }
                    });
                    next.backup('jsrgweizhuix');
                    next.set('targetRequired', true);
                    next.set('complexSelect', true);
                    next.set('filterTarget', function (card, player, target) {
                        if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
                        return lib.filter.targetEnabled.apply(this, arguments);
                    });
                    next.set('sourcex', player);
                    next.set('addCount', false);
                    next.logSkill = 'jsrgweizhui';
                }
            },
            jsrgweizhuix: {
                viewAs: {
                    name: 'guohe'
                },
                filterCard: {
                    color: 'black'
                },
                position: 'h',
                selectCard: 1,
                check: function (card) {
                    return 8 - get.value(card)
                },
            },
            jsrgyingshi: {
                trigger: {
                    player: 'turnOverEnd'
                },
                frequent: true,
                content: function () {
                    'step 0'
                    var num = game.dead.length > 2 ? 5 : 3;
                    var cards = get.bottomCards(num, true);
                    game.cardsGotoOrdering(cards);
                    var next = player.chooseToMove();
                    next.set('list', [
                        ['牌堆顶'],
                        ['牌堆底', cards],
                    ]);
                    next.set('prompt', '鹰眎：点击将牌移动到牌堆顶或牌堆底');
                    next.processAI = function (list) {
                        var cards = list[1][1],
                            player = _status.event.player;
                        var top = [];
                        var judges = player.getCards('j');
                        var stopped = false;
                        if (!player.hasWuxie()) {
                            for (var i = 0; i < judges.length; i++) {
                                var judge = get.judge(judges[i]);
                                cards.sort(function (a, b) {
                                    return judge(b) - judge(a);
                                });
                                if (judge(cards[0]) < 0) {
                                    stopped = true;
                                    break;
                                } else {
                                    top.unshift(cards.shift());
                                }
                            }
                        }
                        var bottom;
                        if (!stopped) {
                            cards.sort(function (a, b) {
                                return get.value(b, player) - get.value(a, player);
                            });
                            while (cards.length) {
                                if (get.value(cards[0], player) <= 5) break;
                                top.unshift(cards.shift());
                            }
                        }
                        bottom = cards;
                        return [top, bottom];
                    }
                    'step 1'
                    var top = result.moved[0];
                    var bottom = result.moved[1];
                    top.reverse();
                    for (var i = 0; i < top.length; i++) {
                        ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
                    }
                    for (i = 0; i < bottom.length; i++) {
                        ui.cardPile.appendChild(bottom[i]);
                    }
                    player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
                    game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
                    game.updateRoundNumber();
                    game.delayx();
                },
            },
            jsrgtuigu: {
                trigger: {
                    player: 'phaseBegin'
                },
                filter: function (event, player) {
                    return !player.isTurnedOver();
                },
                init: function (player) {
                    player.storage.jsrgtuigu = 0
                },
                getX: function () {
                    return Math.floor(game.players.length / 2);
                },
                content: function () {
                    'step 0'
                    player.turnOver();
                    player.addTempSkill('jsrgtuigu_mod', 'phaseEnd');
                    player.storage.jsrgtuigu = lib.skill.jsrgtuigu.getX();
                    'step 1'
                    player.draw(lib.skill.jsrgtuigu.getX());
                    player.chooseUseTarget('jiejia', '视为使用一张【解甲归田】');
                },
                ai: {
                    basic: {
                        useful: 1.5,
                        value: 3,
                    },
                    result: {
                        player: function (player, target) {
                            return lib.card.jiejia.ai.result.player.apply(this, arguments) + Math.floor(game.players.length / 4);
                        },
                    }
                },
                group: ['jsrgtuigu_phase', 'jsrgtuigu_equip', 'jsrgtuigu_gain'],
                subSkill: {
                    mod: {
                        mod: {
                            maxHandcard: function (player, num) {
                                return num + player.storage.jsrgtuigu;
                            },
                        },
                        onremove: function (player) {
                            player.storage.jsrgtuigu = 0;
                        }
                    },
                    phase: {
                        trigger: {
                            global: 'roundFinish'
                        },
                        forced: true,
                        locked: false,
                        filter: function (event, player) {
                            return lib.skill.dcjinjie.hasPhase(player);
                        },
                        content: function () {
                            player.insertPhase();
                        },
                    },
                    equip: {
                        trigger: {
                            player: "loseAfter",
                            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
                        },
                        forced: true,
                        locked: false,
                        filter: function (event, player) {
                            var evt = event.getl(player);
                            return evt && evt.player == player && evt.es && evt.es.length > 0;
                        },
                        content: function () {
                            player.recover();
                        }
                    },
                    gain: {
                        trigger: {
                            global: ["gainAfter", "loseAsyncAfter"],
                        },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return event.getParent().name == 'jiejia' && event.getParent(4).name == 'jsrgtuigu';
                        },
                        content: function () {
                            trigger.player.addSkill('jsrgtuigu_forbid');
                            trigger.cards.forEach(function (card) {
                                card.gaintag.add('jsrgtuigu');
                            });
                        }
                    },
                    forbid: {
                        mod: {
                            cardEnabled2: function (card) {
                                if (card.hasGaintag('jsrgtuigu')) return false;
                            },
                        },
                        trigger: {
                            player: 'phaseEnd'
                        },
                        direct: true,
                        charlotte: true,
                        onremove: function (player) {
                            player.removeGaintag('jsrgtuigu');
                        },
                        content: function () {
                            player.removeSkill('jsrgtuigu_forbid');
                        }
                    },
                }
            },
            jsrgyoujin: {
                trigger: {
                    player: 'phaseUseBegin',
                },
                filter: function (event, player) {
                    return game.hasPlayer(function (current) {
                        return player.canCompare(current);
                    });
                },
                content: function () {
                    "step 0"
                    player.chooseTarget(get.prompt('jsrgdailao'), function (card, player, target) {
                        return player.canCompare(target);
                    }).set('ai', function (target) {
                        return -get.attitude(_status.event.player, target);
                    });
                    "step 1"
                    if (result.bool) {
                        player.line(result.targets, 'green');
                        player.chooseToCompare(result.targets[0]);
                        event.target = result.targets[0];
                    } else {
                        event.finish();
                    }
                    "step 2"
                    if (result.winner) {
                        result.winner.useCard({ name: 'sha' }, result.winner == player ? event.target : player);
                    }
                    player.storage.compareNumber = result.num1
                    event.target.storage.compareNumber = result.num2

                    player.addTempSkill('jsrgyoujin_cardMod', { global: 'phaseAfter' });
                    event.target.addTempSkill('jsrgyoujin_cardMod', { global: 'phaseAfter' });
                },
                subSkill: {
                    cardMod: {
                        onremove: function (player) {
                            delete player.storage.compareNumber;
                        },
                        mod: {
                            cardEnabled: function (card, player) {
                                if (get.number(card) < player.storage.compareNumber) {
                                    return false;
                                }
                            },
                            cardUsable: function (card, player) {
                                if (get.number(card) < player.storage.compareNumber) {
                                    return false;
                                }
                            },
                            cardRespondable: function (card, player) {
                                if (get.number(card) < player.storage.compareNumber) {
                                    return false;
                                }
                            },
                            cardSavable: function (card, player) {
                                if (get.number(card) < player.storage.compareNumber) {
                                    return false;
                                }
                            },
                        },
                    },
                },
            },
            // 出牌阶段，若你没有可以使用的手牌，你可以展示所有手牌并摸两张牌，然后结束此回合。
            jsrgdailao: {
                enable: 'phaseUse', // 在出牌阶段可以使用
                usable: 1, // 每阶段限一次
                filter: function (event, player) {
                    var cards = player.getCards('hs');
                    for (var card of cards) {
                        if (event.filterCard(card, player, event)) {
                            return false;
                        }
                    }
                    return true; // 玩家手牌数必须大于0
                },
                content: function () {
                    "step 0"
                    player.showHandcards(); // 展示所有手牌
                    "step 1"
                    player.draw(2); // 摸两张
                    "step 2"
                    // 结束此回合
                    var evt = event.getParent("phase");
                    if (evt) {
                        game.resetSkills();
                        _status.event = evt;
                        _status.event.finish();
                        _status.event.untrigger(true);
                    }
                },
                ai: {
                    order: 1, // 技能优先级
                    result: {
                        player: function (player) {
                            if (player.countCards('h') > 2) {
                                return 1; // 当手牌较多时，使用技能
                            }
                            return 0; // 否则不使用
                        }
                    },
                    threaten: 1.5, // 对手感到的威胁
                },
            },
            // 锁定技，你对本回含受到过伤害/失去过最后手牌的角色 造成的伤害+1/使用牌无次数限制。
            jsrgzhubei: {
                locked: true,
                group: ['jsrgzhubei_lose', 'jsrgzhubei_damage'],
                subSkill: {
                    lose: {
                        trigger: {
                            global: ['loseAfter', 'loseAsyncAfter'],
                        },
                        direct: true,
                        content: function () {
                            if (trigger.name == 'loseAsync') {
                                var target = trigger.player || trigger.getParent().target;
                                if (target && target.countCards('h') == 0) {
                                    target.addTempSkill('jsrgzhubei_loseAllHCard', {
                                        global: 'phaseAfter'
                                    });
                                }
                            } else {
                                if (trigger.player.countCards('h') == 0) {
                                    trigger.player.addTempSkill('jsrgzhubei_loseAllHCard', {
                                        global: 'phaseAfter'
                                    });
                                }
                            }
                        },
                        sub: true,
                    },
                    loseAllHCard: {
                        sub: true,
                    },
                    damage: {
                        locked: true,
                        trigger: {
                            source: 'damageBegin3'
                        },
                        filter: function (event, player) {
                            return event.player.getHistory('damage') && event.player.getHistory('damage').length;
                        },
                        content: function () {
                            trigger.num++;
                        },
                    },
                },
                mod: {
                    cardUsableTarget: function (card, player, target) {
                        if (target.hasSkill('jsrgzhubei_loseAllHCard')) return true;
                    },
                },
            },
            // 合赵云
            jsrglonglin: {
                trigger: {
                    global: 'useCardToPlayered',
                },
                filter: function (event, player) {
                    if (get.name(event.card) != 'sha') {
                        return false;
                    }
                    if (player.isPhaseUsing()) {
                        return false;
                    }
                    return !player.hasHistory('useCard', function (evtx) {
                        return evtx != event && get.name(evtx.card, false) == 'sha' && evtx.getParent('phaseUse') == evt;
                    }, event);
                },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseToDiscard('he', '弃置一张牌令此【杀】无效').set('ai', function (card) {
                        return 6 - get.value(card);
                    });
                    'step 1'
                    if (result.bool) {
                        trigger.getParent().cancel();
                        trigger.player.useCard({ name: 'juedou' }, player, false);
                    }
                },
                group: 'jsrglonglin_damage',
                subSkill: {
                    damage: {
                        trigger: {
                            source: 'damageSource',
                        },
                        filter: function (event, player) {
                            if (player == event.player) return false;
                            return event.card && event.card.name == 'juedou' && event.getParent(3).name == 'jsrglonglin';
                        },
                        forced: true,
                        content: function () {
                            trigger.player.addTempSkill('jsrglonglin_nouse');
                        },
                    },
                    nouse: {
                        mark: true,
                        intro: {
                            content: "本阶段不能再使用手牌",
                        },
                        mod: {
                            cardEnabled: function () {
                                return false;
                            },
                            cardUsable: function () {
                                return false;
                            },
                            cardSavable: function () {
                                return false;
                            },
                        },
                    },
                },
            },
            jsrgzhendan: {
                audio: 2,
                enable: ["chooseToUse", "chooseToRespond"],
                filter: function (event, player) {
                    if (event.type == "wuxie") return false;
                    return !player.hasSkill('jsrgzhendan_used') && player.countCards("hs", (card) => {
                        return get.type2(card) != "basic";
                    });
                },
                hiddenCard: function (player, name) {
                    return get.type(name) == "basic" && player.countCards("hs") > 0;
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var vcards = [];
                        for (var name of lib.inpile) {
                            if (get.type(name) != 'basic') continue;
                            var card = {
                                name: name,
                                isCard: true
                            };
                            if (event.filterCard(card, player, event)) vcards.push(['基本', '', name]);
                            if (name == 'sha') {
                                for (var nature of lib.inpile_nature) {
                                    card.nature = nature;
                                    if (event.filterCard(card, player, event)) vcards.push(['基本', '', name, nature]);
                                }
                            }
                        }
                        return ui.create.dialog("镇胆", [vcards, "vcard"]);
                    },
                    check: function (button) {
                        var player = _status.event.player;
                        var card = {
                            name: button.link[2],
                            nature: button.link[3]
                        };
                        if (game.hasPlayer(function (current) {
                            return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
                        })) {
                            switch (button.link[2]) {
                                case 'tao':
                                    return 5;
                                case 'jiu':
                                    return 3.01;
                                case 'shan':
                                    return 3.01;
                                case 'sha':
                                    if (button.link[3] == 'fire') return 2.95;
                                    else if (button.link[3] == 'fire') return 2.92;
                                    else return 2.9;
                            }
                        }
                        return 0;
                    },
                    backup: function (links, player) {
                        return {
                            popname: true,
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3]
                            },
                            filterCard(card, player) {
                                return get.type2(card) != "basic";
                            },
                            selectCard: 1,
                            position: "hs",
                            check: function (card, player, target) {
                                return 8 - get.value(card);
                            },
                        };
                    },
                    prompt: function (links, player) {
                        return "将一张非基本手牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
                    },
                },
                ai: {
                    order: 4,
                    useful: [5, 1, 0.5, 0.5],
                    value: [5, 1, 0.5, 0.5],
                    respondSha: true,
                    respondShan: true,
                    basic: {
                        useful: [5, 1, 0.5, 0.5],
                        value: [5, 1, 0.5, 0.5]
                    },
                    skillTagFilter: function (player) {
                        if (!player.countCards('hes') || player.hasSkill('jsrgzhendan_used')) return false;
                    },
                    result: {
                        player: function (player) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                group: ['jsrgzhendan_draw', 'jsrgzhendan_roundUpdate'],
                subSkill: {
                    draw: {
                        trigger: {
                            player: 'damageEnd',
                            global: 'roundFinish',
                        },
                        direct: true,
                        filter: function (event, player) {
                            return !player.hasSkill('jsrgzhendan_used');
                        },
                        content: function (trigger, player, name, event) {
                            'step 0'
                            var drawCount = Math.min(player.countMark('jsrgzhendan_draw'), 5);
                            player.draw(drawCount);
                            'step 1'
                            if (event.triggername != 'roundFinish') {
                                player.addTempSkill('jsrgzhendan_used', 'roundStart');
                            } else {
                                player.storage.jsrgzhendan_draw = 0;
                                player.updateMark();
                            }
                        },
                        sub: true,
                        mark: true,
                        marktext: "镇胆",
                        intro: {
                            name: '镇胆',
                            content: "镇胆：$",
                        },
                    },
                    roundUpdate: {
                        init: function (player) {
                            player.storage.jsrgzhendan_draw = 0;
                        },
                        trigger: {
                            global: ['phaseAfter'],
                        },
                        filter: function (event, player) {
                            return player.countMark('jsrgzhendan_draw') <= 5;
                        },
                        priority: -100,
                        direct: true,
                        silent: true,
                        charlotte: true,
                        content: function () {
                            player.addMark('jsrgzhendan_draw');
                        },
                        sub: true,
                    },
                    used: {
                        onremove: function (player) {
                            player.storage.jsrgzhendan_draw = 0;
                            player.updateMark()
                        },
                        popup: false,
                        sub: true,
                    },
                },
            },
            // 孙鲁育
            // 每回合各限一次，当一名角色使用【杀】指定其他角色/你为目标时，你可以用牌堆顶的牌蓄谋/你须弃置你区域里的一张蓄谋牌。
            jsrgdaimou: {
                group: ['jsrgdaimou_player', 'jsrgdaimou_target'/*, 'jsrgdaimou2'*/],
                subSkill: {
                    // 当一名角色使用【杀】指定其他角色，你可以用牌堆顶的牌蓄谋
                    player: {
                        trigger: {
                            global: 'useCardToTargeted',
                        },
                        usable: 1,
                        filter: function (event, player) {
                            // 当目标不是自己时，可以蓄谋
                            return get.name(event.card) == 'sha' && event.target != player;
                        },
                        prompt: '是否发动【殆谋】，从牌堆顶获得一张【蓄谋】牌',
                        content: function () {
                            player.addXumou(get.cards(1));
                        },
                        effect: {
                            target: function (card, player, target) {
                                if (get.type(card) == 'delay' && target.hasJudge('jsrgjudge_card')) return [0, 0, 0, 0.1];
                            }
                        },
                        sub: true,
                    },
                    // 当一名角色使用【杀】指你为目标时，你须弃置你区域里的一张蓄谋牌
                    target: {
                        trigger: {
                            target: 'useCardToTargeted',
                        },
                        usable: 1,
                        direct: true,
                        filter: function (event, player) {
                            return get.name(event.card) == 'sha' && player.hasXumou();
                        },
                        content: function () {
                            'step 0'
                            player.chooseCardButton(player.getXumou(), '请弃置一张【蓄谋】牌', true, 1);
                            'step 1'
                            var link = result.links[0];
                            player.lose(link);
                            game.log(player, '移除了', '#y【蓄谋】', link);
                        },
                        sub: true,
                    },
                },
            },
            // 准备阶段，若你没有蓄谋牌，你回复1点体力并摸一张牌，否则你可以弃置任意张你区域里的蓄谋牌并失去此技能。
            jsrgfangjie: {
                trigger: {
                    player: 'phaseZhunbeiBegin',
                },
                direct: true,
                content: function () {
                    'step 0'
                    if (!player.hasXumou()) {
                        // 没有蓄谋牌，回复1点体力并摸一张牌
                        player.logSkill('jsrgfangjie');
                        player.recover();
                        player.draw();
                        event.finish();
                    } else {
                        // 有蓄谋牌，可以选择弃置任意张蓄谋牌
                        player.chooseCardButton(player.getXumou(), '请选择要弃置的【谋】', [0, player.countXumou()]);
                    }
                    'step 1'
                    if (result.bool) {
                        var links = result.links;
                        player.lose(links, 'visible', ui.ordering);
                        player.removeSkill('jsrgfangjie');
                    }
                },
                ai: {
                    threaten: 1.2
                },
            },
            jsrgdanxin: {
                enable: "chooseToUse",
                viewAs: {
                    name: "tuixinzhifu",
                    storage: {
                        jsrgdanxin: true
                    },
                },
                filterCard: true,
                position: "hes",
                precontent: function () {
                    player.addTempSkill("jsrgdanxin_effect");
                },
                subSkill: {
                    effect: {
                        audio: "jsrgdanxin",
                        trigger: {
                            global: "gainAfter",
                        },
                        filter: function (event, player) {
                            var level = event.player != player ? 1 : 2;
                            if (event.player != player && event.getParent(level).name != "tuixinzhifu") return false;
                            if (event.player == player && event.getParent(level).name != "tuixinzhifu") return false;
                            var card = event.getParent(level + 1).card;
                            return card && card.storage && card.storage.jsrgdanxin;
                        },
                        forced: true,
                        popup: false,
                        charlotte: true,
                        content: function (event, trigger, player) {
                            var level = trigger.player != player ? 1 : 2;
                            var {
                                targets
                            } = trigger.getParent(level + 1);
                            player.showCards(trigger.cards);
                            if (trigger.cards.some((card) => get.suit(card) == "heart")) {
                                var owners = trigger.cards.filter((card) => get.suit(card) == "heart").map((card) => get.owner(card));
                                for (var owner of owners) {
                                    if (owner && owner.isIn()) owner.recover();
                                }
                            }
                            if (trigger.player == player) return;
                            player.addTempSkill("jsrgdanxin_distance");
                            if (!player.storage.jsrgdanxin_distance) player.storage.jsrgdanxin_distance = {};
                            var id = targets[0].playerid;
                            if (typeof player.storage.jsrgdanxin_distance[id] != "number") player.storage.jsrgdanxin_distance[id] = 0;
                            player.storage.jsrgdanxin_distance[id]++;
                            player.markSkill("jsrgdanxin_distance");
                        },
                    },
                    distance: {
                        onremove: true,
                        charlotte: true,
                        mod: {
                            globalFrom(player, target, distance) {
                                if (!player.storage.jsrgdanxin_distance) return;
                                var dis = player.storage.jsrgdanxin_distance[target.playerid];
                                if (typeof dis == "number") return distance + dis;
                            },
                        },
                        intro: {
                            content: function (storage, player) {
                                if (!storage) return;
                                var map = _status.connectMode ? lib.playerOL : game.playerMap;
                                var str = `你本回合：`;
                                for (var id in storage) {
                                    str += "<li>至" + get.translation(map[id]) + "的距离+" + storage[id];
                                }
                                return str;
                            },
                        },
                    },
                },
            },
            jsrgfengxiang: {
                audio: "fengxiang",
                trigger: {
                    player: "damageEnd"
                },
                forced: true,
                direct: true,
                filter: function (event, player) {
                    return game.hasPlayer((current) => {
                        return current.countCards("e");
                    });
                },
                content: function () {
                    "step 0"
                    player.chooseTarget(get.prompt('jsrgfengxiang'), "封乡：与一名其他角色交换装备区里的所有牌", (card, player, target) => {
                        return target.countCards("e") + player.countCards("e") > 0 && player != target;
                    }, true).set("ai", (target) => {
                        var player = get.player();
                        var att = get.attitude(player, target);
                        var delta = get.value(target.getCards("e"), player) - get.value(player.getCards("e"), player);
                        if (att > 0) {
                            if (delta < 0) delta += att / 3;
                        } else {
                            if (delta < 0) delta -= att / 3;
                        }
                        return delta;
                    });
                    "step 1"
                    if (result.bool) {
                        player.swapEquip(result.targets[0]);
                    }
                    'step 2'
                    var num = player.countCards("e");
                    var delta = num - result.targets[0].countCards("e");
                    if (delta > 0) player.draw(delta);
                },
            },

            // 谋姜维
            jsrgqianfa: {
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return player.countCards('h') > 0;
                },
                filterCard: true,
                position: "h",
                discard: false,
                lose: false,
                delay: false,
                check: function (card) {
                    return 15 - get.value(card)
                },
                prompt: "展示一张手牌，然后开始议事",
                content: function () {
                    'step 0'
                    result.cards = cards[0];
                    player.showCards(result.cards);
                    'step 1'
                    if (result.bool) {
                        event.color = get.color(result.cards[0]);
                    }
                    var targets = game.filterPlayer(current => {
                        return current.maxHp <= player.maxHp;
                    });
                    player.chooseToDebate(targets).set('callback', function () {
                        var result = event.debateResult,
                            color = event.getParent(2).color,
                            player = event.player;
                        if (result.bool && result.opinion) {
                            if (result.opinion == color) {
                                event.getParent(2).huoshengDraw = true;
                            } else player.drawShadow('jsrg_ying', 'spade', 1, 2);
                        }
                        if ((result.red.length == 1 && result.red[0][0] == player) || (result.black.length == 1 && result.black[0][0] == player)) {
                            event.getParent(2).onlyOne = true;
                        }
                    })
                    'step 2'
                    if (event.huoshengDraw) {
                        player.chooseTarget('选择至多2名角色，令其将手牌摸至体力上限', [1, 2]);
                    } else {
                        event.goto(4);
                    }
                    'step 3'
                    if (result.bool) {
                        result.targets.forEach(function (target) {
                            target.draw(target.maxHp - target.countCards('h'));
                        })
                    }
                    'step 4'
                    if (event.onlyOne) {
                        var list = lib.group.slice();
                        list.remove(player.group);
                        var getV = function (group) {
                            var val = 1;
                            if (group == 'wei' || group == 'shu') val++;
                            game.countPlayer(current => {
                                if (current.group != group) return false;
                                var att = get.attitude(player, current);
                                if (att > 0) val++;
                                else if (att == 0) val += 0.5;
                                else val--;
                            });
                            return val;
                        };
                        var maxGroup = list.slice().sort((a, b) => {
                            return getV(b) - getV(a);
                        })[0];
                        list.push('cancel2');
                        player.chooseControl(list).set('prompt', get.prompt('jsrgqianfa')).set('prompt2', '变更为另一个势力').set('ai', () => {
                            return _status.event.choice;
                        }).set('choice', maxGroup);
                    } else {
                        return event.finish();
                    }
                    'step 5'
                    var group = result.control;
                    if (group == 'cancel2') {
                        return event.finish();
                    }
                    player.popup(group + '2', get.groupnature(group, 'raw'));
                    player.changeGroup(group);
                },
            },
            jsrgfumou: {
                trigger: {
                    global: "chooseToDebateAfter",
                },
                filter: function (event, player) {
                    if (!event.targets.contains(player) || !player.group != 'wei') return false;
                    if (event.red.map(i => i[0]).contains(player)) return event.black.length;
                    if (event.black.map(i => i[0]).contains(player)) return event.red.length;
                    return false;
                },
                direct: true,
                content: function () {
                    var targets = [],
                        color = '';
                    if (trigger.red.map(i => i[0]).contains(player)) {
                        targets = trigger.black;
                        color = 'black';
                    }
                    if (trigger.black.map(i => i[0]).contains(player)) {
                        targets = trigger.red;
                        color = 'red';
                    }
                    targets.forEach(function (target) {
                        target.storage.jsrgfumoux = color;
                        target.addSkill('jsrgfumou_forbid');
                    })
                },
                group: ['jsrgfumou_recollect', 'jsrgfumou_view'],
                subSkill: {
                    forbid: {
                        mod: {
                            cardEnabled2: function (card, player) {
                                if (target.storage.jsrgfumoux == get.color(card)) return false;
                            },
                            cardRespondable: function (card, player) {
                                if (target.storage.jsrgfumoux == get.color(card)) return false;
                            },
                            cardSavable: function (card, player) {
                                if (target.storage.jsrgfumoux == get.color(card)) return false;
                            },
                        },
                        onremove: function (player) {
                            delete player.storage.jsrgfumoux;
                        },
                    },
                    recollect: {
                        trigger: {
                            player: 'phaseEnd'
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            game.players.forEach(function (current) {
                                if (current.hasSkill('jsrgfumou_forbid')) current.removeSkill('jsrgfumou_forbid');
                            })
                        }
                    },
                    view: {
                        enable: "chooseToUse",
                        filter: function (event, player) {
                            return player.group == 'wei';
                        },
                        filterCard: function (card) {
                            return card.name == 'jsrg_ying';
                        },
                        position: "h",
                        viewAs: {
                            name: "chuqibuyi",
                        },
                        viewAsFilter: function (player) {
                            if (!player.countCards('h', {
                                name: 'jsrg_ying'
                            })) return false;
                        },
                        prompt: "将一张【影】当出其不意使用",
                        check: function (card) {
                            return 12 - get.value(card)
                        },
                    },
                },
            },
            jsrgxuanfeng: {
                enable: "chooseToUse",
                locked: false,
                filter: function (event, player) {
                    return player.group == 'shu';
                },
                mod: {
                    targetInRange: function (card, player, target) {
                        if (card.jsrgxuanfeng) return true;
                    },
                    cardUsable: function (card, player, target) {
                        if (card.jsrgxuanfeng) return Infinity;
                    },
                },
                viewAsFilter: function (player) {
                    return player.hasCard(function (card) {
                        return card.name == 'jsrg_ying';
                    }, 'hs');
                },
                position: "hs",
                filterCard: {
                    name: "jsrg_ying",
                },
                viewAs: {
                    name: "sha",
                    nature: 'stab',
                    jsrgxuanfeng: true,
                },
                check: function (card) {
                    return 8 - get.value(card);
                },
                ai: {
                    order: function (item, player) {
                        return get.order({
                            name: 'sha'
                        }) - 1;
                    },
                },
            },
            jsrgwentian: {
                trigger: {
                    player: ['phaseZhunbeiBegin', 'phaseJudgeEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd', 'phaseJieshuEnd']
                },
                filter: function (event, player) {
                    return !player.hasSkill('jsrgwentian_block1') && !player.hasSkill('jsrgwentian_block2');
                },
                prompt2: '你可以观看牌堆顶的五张牌，然后将其中一张牌交给一名其他角色，其余牌以任意顺序放回牌堆顶或者牌堆底',
                content: function () {
                    'step 0'
                    var cards = get.cards(5);
                    event.cards = cards;
                    player.addTempSkill('jsrgwentian_block1', 'phaseEnd');
                    player.chooseButton(['问天：请选择要交出的牌', cards], 1, true).set('ai', function (button) {
                        return _status.event.player.getUseValue(button.link);
                    });
                    'step 1'
                    if (result.bool) {
                        player.$throw(result.links, 1000);
                        event.cards = event.cards.filter(item => !result.links.includes(item));
                        event.gives = result.links;
                        player.chooseTarget('选择一名其他角色', 1, true, (card, player, target) => {
                            return target != player;
                        }).set('ai', function (target) {
                            return get.attitude(_status.event.player, target) > 0;
                        });
                    } else event.finish();
                    'step 2'
                    if (result.bool) {
                        result.targets[0].gain(event.gives, player, 'gain2').giver = player;
                    }
                    'step 3'
                    game.delayx();
                    game.updateRoundNumber();
                    'step 4'
                    game.cardsGotoOrdering(event.cards);
                    var next = player.chooseToMove();
                    next.set('list', [
                        ['牌堆顶', event.cards],
                        ['牌堆底'],
                    ]);
                    next.set('prompt', '问天：点击将牌移动到牌堆顶或牌堆底');
                    next.processAI = function (list) {
                        var cards = list[0][1],
                            player = _status.event.player;
                        var top = [];
                        var judges = player.getCards('j');
                        var stopped = false;
                        if (!player.hasWuxie()) {
                            for (var i = 0; i < judges.length; i++) {
                                var judge = get.judge(judges[i]);
                                cards.sort(function (a, b) {
                                    return judge(b) - judge(a);
                                });
                                if (judge(cards[0]) < 0) {
                                    stopped = true;
                                    break;
                                } else {
                                    top.unshift(cards.shift());
                                }
                            }
                        }
                        var bottom;
                        if (!stopped) {
                            cards.sort(function (a, b) {
                                return get.value(b, player) - get.value(a, player);
                            });
                            while (cards.length) {
                                if (get.value(cards[0], player) <= 5) break;
                                top.unshift(cards.shift());
                            }
                        }
                        bottom = cards;
                        return [top, bottom];
                    }
                    'step 5'
                    var top = result.moved[0];
                    var bottom = result.moved[1];
                    top.reverse();
                    for (var i = 0; i < top.length; i++) {
                        ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
                    }
                    for (i = 0; i < bottom.length; i++) {
                        ui.cardPile.appendChild(bottom[i]);
                    }
                    player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
                    game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
                    game.updateRoundNumber();
                    game.delayx();
                },
                group: ['jsrgwentian_use', 'jsrgwentian_use2', 'jsrgwentian_refresh', 'jsrgwentian_refresh2'],
                subSkill: {
                    block1: {
                        charlotte: true
                    },
                    block2: {
                        charlotte: true
                    },
                    use: {
                        enable: 'chooseToUse',
                        filter: function (event, player) {
                            var filter = event.filterCard;
                            if (filter({
                                name: 'huogong'
                            }, player, event) && !player.hasSkill('jsrgwentian_block2')) return true;
                            return false;
                        },
                        hiddenCard: function (player, name) {
                            if (name == 'huogong') return true;
                        },
                        delay: false,
                        onChooseToUse: function (event) {
                            if (game.online || !event.player.hasSkill('jsrgwentian_use')) return;
                            var cards = [];
                            for (var i = 0; i < 1; i++) {
                                var card = ui.cardPile.childNodes[i];
                                if (card) cards.push(card);
                                else break;
                            }
                            event.set('jsrgwentian_use', cards);
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var dialog = ui.create.dialog('问天', 'hidden');
                                if (event.jsrgwentian_use && event.jsrgwentian_use.length) dialog.add(event.jsrgwentian_use);
                                else dialog.addText('牌堆无牌');
                                dialog.forceDirect = true;
                                return dialog;
                            },
                            forced: true,
                            check: function (button) {
                                var player = _status.event.player;
                                var effect = player.getUseValue('huogong') + 1;
                                if (effect > 0) return effect;
                                return 0;
                            },
                            backup: function (links, player) {
                                return {
                                    filterCard: function () {
                                        return false
                                    },
                                    selectCard: -1,
                                    viewAs: {
                                        name: 'huogong',
                                        cards: links,
                                        isCard: true
                                    },
                                    forced: true,
                                    precontent: function () {
                                        delete event.result.skill;
                                        event.getParent().addCount = false;
                                        var cards = event.result.card.cards
                                        var name = 'huogong';
                                        event.result.cards = event.result.card.cards;
                                        event.result.card.name = name;
                                        game.delayx();
                                        if (event.result.cards[0].suit != 'heart' && event.result.cards[0].suit != 'diamond') player.addSkill('jsrgwentian_block2');
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                return '选择【火攻】的目标';
                            },
                        },
                    },
                    use2: {
                        enable: 'chooseToUse',
                        filter: function (event, player) {
                            var filter = event.filterCard;
                            if (filter({
                                name: 'wuxie'
                            }, player, event) && !player.hasSkill('jsrgwentian_block2')) return true;
                            return false;
                        },
                        hiddenCard: function (player, name) {
                            if (name == 'wuxie') return true;
                        },
                        delay: false,
                        onChooseToUse: function (event) {
                            if (game.online || !event.player.hasSkill('jsrgwentian_use2')) return;
                            var cards = [];
                            for (var i = 0; i < 1; i++) {
                                var card = ui.cardPile.childNodes[i];
                                if (card) cards.push(card);
                                else break;
                            }
                            event.set('jsrgwentian_use2', cards);
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var dialog = ui.create.dialog('问天', 'hidden');
                                if (event.jsrgwentian_use2 && event.jsrgwentian_use2.length) dialog.add(event.jsrgwentian_use);
                                else dialog.addText('牌堆无牌');
                                dialog.forceDirect = true;
                                return dialog;
                            },
                            check: function (button) {
                                return 1;
                            },
                            forced: true,
                            forceDirect: true,
                            backup: function (links, player) {
                                return {
                                    filterCard: function () {
                                        return false
                                    },
                                    selectCard: -1,
                                    viewAs: {
                                        name: 'wuxie',
                                        cards: links,
                                        isCard: true
                                    },
                                    precontent: function () {
                                        delete event.result.skill;
                                        event.getParent().addCount = false;
                                        var cards = event.result.card.cards
                                        var name = 'wuxie';
                                        event.result.cards = event.result.card.cards;
                                        event.result.card.name = name;
                                        game.delayx();
                                        if (event.result.cards[0].suit != 'spade' && event.result.cards[0].suit != 'club') player.addSkill('jsrgwentian_block2');
                                    },
                                }
                            },
                        },
                    },
                    backup: {
                        sourceSkill: 'jsrgwentian_use',
                        precontent: function () {
                            delete event.result.skill;
                            var name = event.result.card.name;
                            event.result.cards = event.result.card.cards;
                            event.result.card = get.autoViewAs(event.result.cards[0]);
                            event.result.card.name = name;
                        },
                        filterCard: function () {
                            return false
                        },
                        selectCard: -1,
                    },
                    refresh: {
                        trigger: {
                            global: 'roundFinish'
                        },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.hasSkill('jsrgwentian_block2')
                        },
                        content: function () {
                            player.removeSkill('jsrgwentian_block2')
                        }
                    },
                    refresh2: {
                        trigger: {
                            player: 'phaseEnd'
                        },
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.hasSkill('jsrgwentian_block1')
                        },
                        content: function () {
                            player.removeSkill('jsrgwentian_block1')
                        }
                    },
                }
            },
            // 出牌阶段限一次，你可以和主公角色议事，若结果为：红色，你与其各摸一张牌，然后重复此流程，直到你们手牌数之和不小于7；黑色，当你于本轮内造成属性伤害时，伤害+1。
            jsrgchushi: {
                enable: 'phaseUse',
                usable: 1,
                filter: function (event, player) {
                    if (!game.hasPlayer(current => current == game.zhu && current != player)) {
                        return false;
                    }
                    if (player.countCards('h') == 0) {
                        return false
                    }
                    return game.zhu.countCards('h') > 0;
                },
                content: function () {
                    'step 0'
                    var targets = game.filterPlayer(current => {
                        return current == game.zhu || current == player;
                    });
                    player.chooseToDebate(targets).set('callback', function () {
                        var result = event.debateResult;
                        if (result.bool && result.opinion) {
                            var opinion = result.opinion,
                                player = event.player;
                            if (opinion == 'red') {
                                event.getParent(2).drawc = true;
                            } else {
                                player.addSkill('jsrgchushi_power');
                            }
                        }
                    }).set('ai', card => {
                        var player = _status.event.player;
                        var val = 1;
                        var color;
                        if (player.countCards('h') + game.zhu.countCards('h') <= 7) color = 'red';
                        else color = 'black';
                        if (get.color(card) == color) val += 10;
                        return val;
                    });
                    'step 1'
                    if (event.drawc && (player.countCards('h') + game.zhu.countCards('h')) <= 7) {
                        player.draw();
                        game.zhu.draw();
                    } else {
                        event.finish();
                    }
                    'step 2'
                    if (event.drawc && (player.countCards('h') + game.zhu.countCards('h')) <= 7) {
                        event.goto(1);
                    } else {
                        event.finish();
                    }
                },
                ai: {
                    order: function (item, player) {
                        return 1;
                    },
                    result: {
                        player: function (player, target) {
                            if (get.attitude(player, game.zhu) > 0) return 1;
                        },
                    },
                },
                group: 'jsrgchushi_cancel',
                subSkill: {
                    cancel: {
                        trigger: {
                            global: 'roundStart'
                        },
                        firstDo: true,
                        direct: true,
                        charlotte: true,
                        filter: function (event, player) {
                            return player.hasSkill('jsrgchushi_power')
                        },
                        content: function () {
                            player.removeSkill('jsrgchushi_power');
                        }
                    },
                    power: {
                        trigger: {
                            source: "damageBegin2",
                        },
                        forced: true,
                        onremove: true,
                        filter: function (event, player) {
                            return event.nature && event.nature != undefined;
                        },
                        content: function () {
                            trigger.num++;
                        }
                    }
                }
            },
            jsrgyinlue: {
                init: function (player) {
                    player.storage.jsrgyinlue1 = 0;
                    player.storage.jsrgyinlue2 = 0;
                },
                trigger: {
                    global: 'damageBegin3'
                },
                filter: function (event, player) {
                    if (!event.nature) return false;
                    if (event.nature == 'fire') return player.storage.jsrgyinlue1 == 0;
                    else if (event.nature == 'thunder') return player.storage.jsrgyinlue2 == 0;
                },
                check: function (event, player) {
                    return get.attitude(player, event.player) > 0;
                },
                prompt: function (event, player) {
                    var str = '';
                    if (event.nature == 'fire') str += '是否发动【隐略】令' + get.translation(event.player) + '免疫此次火焰伤害，然后你于此回合结束后执行一个额外摸牌阶段？'
                    if (event.nature == 'thunder') str += '是否发动【隐略】令' + get.translation(event.player) + '免疫此次雷电伤害，然后你于此回合结束后执行一个额外弃牌阶段？'
                    return str;
                },
                content: function () {
                    if (trigger.nature == 'fire') {
                        player.addSkill('jsrgyinlue_fire');
                        player.storage.jsrgyinlue1 = 1;
                    } else if (trigger.nature == 'thunder') {
                        player.addSkill('jsrgyinlue_thunder');
                        player.storage.jsrgyinlue2 = 1;
                    }
                    trigger.cancel();
                },
                subSkill: {
                    fire: {
                        trigger: {
                            global: 'phaseEnd'
                        },
                        forced: true,
                        charlotte: true,
                        content: function () {
                            var next = player.phaseDraw();
                            event.next.remove(next);
                            trigger.getParent().next.push(next);
                            player.removeSkill('jsrgyinlue_fire');
                        },
                        sub: true,
                    },
                    thunder: {
                        trigger: {
                            global: 'phaseEnd'
                        },
                        forced: true,
                        charlotte: true,
                        content: function () {
                            var next = player.phaseDiscard();
                            event.next.remove(next);
                            trigger.getParent().next.push(next);
                            player.removeSkill('jsrgyinlue_thunder');
                        },
                        sub: true,
                    },
                    start: {
                        trigger: {
                            global: 'roundStart'
                        },
                        direct: true,
                        charlotte: true,
                        content: function () {
                            player.storage.jsrgyinlue1 = 0;
                            player.storage.jsrgyinlue2 = 0;
                        },
                        sub: true,
                    },
                },
            },
            jsrgzhuiming: {
                audio: 2,
                trigger: {
                    player: 'useCardToPlayered',
                },
                filter: function (event, player) {
                    if (event.card.name != 'sha') return false;
                    return event.isFirstTarget && event.targets.length == 1 && event.target.isIn();
                },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseControl(['黑色', '红色'], 'cancel2').set('ai', () => {
                        return '红色'
                    }).set('prompt', '追命：是否声明一种颜色并令' + get.translation(trigger.target) + '弃置任意张牌');
                    'step 1'
                    if (result.control == '黑色') event.color = 'black';
                    else if (result.control == '红色') event.color = 'red';
                    else event.finish();
                    'step 2'
                    trigger.target.chooseToDiscard('是否弃置任意张牌', [1, player.countCards('he')], 'he', false);
                    'step 3'
                    if (trigger.target.countCards('he') > 0) player.choosePlayerCard('he', trigger.target, true);
                    else event.finish();
                    'step 4'
                    var card = result.cards[0];
                    trigger.target.showCards(card, '追命');
                    if (get.color(card) == event.color) {
                        if (trigger.addCount !== false) {
                            trigger.addCount = false;
                            trigger.player.getStat().card.sha--;
                        }
                        trigger.directHit.add(trigger.target);
                        trigger.getParent().baseDamage++;
                    }
                },
            },
            jsrgqingzi: {
                audio: 2,
                trigger: {
                    player: 'phaseZhunbeiBegin'
                },
                filter: function (event, player) {
                    return game.hasPlayer(current => {
                        if (current == player) return false;
                        return current.countCards('e') > 0;
                    })
                },
                derivation: 'xinshensu',
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt('jsrgqingzi'), '弃置任意名其他角色装备区里的一张牌，然后令这些角色获得〖神速〗直到你的下回合开始', [1, Infinity], (card, player, target) => {
                        return target != player && target.countCards('e') > 0;
                    }).set('ai', target => {
                        var player = _status.event.player;
                        return target.hasCard(card => {
                            return get.value(card, target) > 3 || target.hp == 1 && get.value(card, target) > 0;
                        });
                    });
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets.slice();
                        targets.sortBySeat();
                        event.targets = targets;
                        event.num = 0;
                        player.logSkill('jsrgqingzi', targets);
                        player.addSkill('jsrgqingzi_clear');
                    } else event.finish();
                    'step 2'
                    var target = targets[num];
                    if (target.countCards('e') > 0) {
                        player.discardPlayerCard(target, 'e', true);
                        target.addAdditionalSkill('jsrgqingzi_' + player.playerid, 'xinshensu');
                        player.markAuto('jsrgqingzi_clear', [target]);
                    }
                    event.num++;
                    if (event.num < targets.length) event.redo();
                },
                subSkill: {
                    clear: {
                        audio: 'jsrgqingzi',
                        charlotte: true,
                        trigger: {
                            global: 'die',
                            player: 'phaseBegin',
                        },
                        forced: true,
                        popup: false,
                        forceDie: true,
                        onremove: true,
                        filter: function (event, player) {
                            if (event.name == 'die') {
                                return player == event.player || player.getStorage('jsrgqingzi_clear').contains(event.player);
                            }
                            return player.getStorage('jsrgqingzi_clear').length > 0;
                        },
                        content: function () {
                            'step 0'
                            var targets = player.getStorage('jsrgqingzi_clear');
                            if (trigger.name == 'die' && player == trigger.player) {
                                for (var target of targets) {
                                    target.removeAdditionalSkill(`jsrgqingzi_${player.playerid}`);
                                }
                                player.removeSkill('jsrgqingzi_clear');
                                event.finish();
                                return;
                            }
                            if (trigger.name == 'phase') event.targets = targets.slice(0).sortBySeat();
                            else event.targets = [trigger.player];
                            'step 1'
                            var target = targets.shift();
                            var storage = player.getStorage('jsrgqingzi_clear');
                            if (storage.contains(target)) {
                                storage.remove(target);
                                target.removeAdditionalSkill(`jsrgqingzi_${player.playerid}`);
                            }
                            if (targets.length > 0) {
                                event.redo();
                            } else if (!storage.length) {
                                player.removeSkill('jsrgqingzi_clear');
                            }
                        },
                    },
                },
            },
            jsrgdingce: {
                audio: 2,
                trigger: {
                    player: 'damageEnd'
                },
                filter: function (event, player) {
                    if (!event.source || !event.source.isIn()) return false;
                    return player.countCards('he') > 0 && event.source.countCards('he') > 0;
                },
                direct: true,
                init: function (player) {
                    if (!lib.inpile.includes('dongzhuxianji')) lib.inpile.add('dongzhuxianji');
                },
                content: function () {
                    'step 0'
                    var target = trigger.source;
                    event.target = target;
                    player.chooseToDiscard(get.prompt('jsrgdingce', target), '弃置你与其的各一张手牌。若这两张牌颜色相同，你视为使用一张【洞烛先机】。').set('logSkill', ['jsrgdingce', target]);
                    'step 1'
                    if (result.bool) {
                        event.card = result.cards[0];
                        if (target.countDiscardableCards(player, 'h')) {
                            var next = player.discardPlayerCard(target, 'h', true);
                            if (target == player) next.set('ai', button => {
                                var card = button.link;
                                return (get.color(card, false) == _status.event.color ? 7.5 : 5) - get.value(card);
                            }).set('color', get.color(event.card, false));
                        } else event.finish();
                    } else event.finish();
                    'step 2'
                    if (result.bool) {
                        var card = result.cards[0];
                        if (get.color(event.card, false) == get.color(card, false)) {
                            game.delayex();
                            player.chooseUseTarget('dongzhuxianji', true);
                        }
                    }
                },

            },
            jsrgzhenfeng: {
                enable: 'phaseUse',
                direct: true,
                filter: function (event, player) {
                    return !player.storage.jsrgzhenfeng1 || (player.storage.jsrgzhenfeng1[0] != 1 || player.storage.jsrgzhenfeng1[1] != 1);
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var map = {};
                        for (var j = 0; j < game.players.length; j++) {
                            var play = game.players[j];
                            for (var i = 0; i < lib.inpile.length; i++) {
                                if (get.type(lib.inpile[i]) == 'delay' || get.type(lib.inpile[i]) == 'equip') continue;
                                if (player.storage.jsrgzhenfeng1 && player.storage.jsrgzhenfeng1[0] == 1 && get.type(lib.inpile[i]) == 'basic') continue;
                                if (player.storage.jsrgzhenfeng1 && player.storage.jsrgzhenfeng1[1] == 1 && get.type(lib.inpile[i]) == 'trick') continue;
                                var trans = '【' + get.translation(lib.inpile[i]) + '】';
                                var list2 = play.getSkillProperty(trans);
                                if (list2.length > 0) {
                                    if (!map.hasOwnProperty(lib.inpile[i])) {
                                        map[lib.inpile[i]] = [play];
                                    } else {
                                        map[lib.inpile[i]].add(play);
                                    }
                                }
                            }
                        }
                        if (!player.storage.jsrgzhenfeng2) player.storage.jsrgzhenfeng2 = {};
                        player.storage.jsrgzhenfeng2 = map;
                        var cardsx = Object.keys(map).filter(i => player.hasUseTarget(i));
                        return ui.create.dialog('针锋', [cardsx, 'vcard']);
                    },
                    backup: function (links, player) {
                        return {
                            filterCard: false,
                            audio: 'jsrgzhenfeng',
                            selectCard: 0,
                            popname: true,
                            check: function (card) {
                                return 6 - get.value(card);
                            },
                            viewAs: {
                                name: links[0][2]
                            },
                            precontent: function () {
                                event.getParent().addCount = false;
                            },
                            onuse: function (result, player) {
                                if (!player.storage.jsrgzhenfeng1) player.storage.jsrgzhenfeng1 = [0, 0];
                                switch (get.type(result.card.name)) {
                                    case 'basic':
                                        player.storage.jsrgzhenfeng1[0] = 1;
                                        break;
                                    default:
                                        player.storage.jsrgzhenfeng1[1] = 1;
                                        break;
                                }
                            },
                        }
                    },
                },
                group: ['jsrgzhenfeng_end', 'jsrgzhenfeng_back'],
                subSkill: {
                    back: {
                        sub: true,
                        popup: false,
                        charlotte: true,
                        direct: true,
                        trigger: {
                            player: 'useCardToBegin'
                        },
                        filter: function (event, player) {
                            return event.getParent().skill == 'jsrgzhenfeng_backup' && player.storage.jsrgzhenfeng2 && event.targets;
                        },
                        content: function () {
                            'step 0'
                            var targ = [];
                            for (var i = 0; i < trigger.targets.length; i++) {
                                if (player.storage.jsrgzhenfeng2[trigger.card.name].contains(trigger.targets[i])) {
                                    targ.add(trigger.targets[i]);
                                }
                            }
                            if (targ.length > 0) {
                                player.logSkill('jsrgzhenfeng', targ);
                                for (var j = 0; j < targ.length; j++) {
                                    targ[j].damage();
                                }
                            }
                            event.targ = targ;
                            'step 1'
                            if (event.targ.length > 0) game.delay(1);
                            delete player.storage.jsrgzhenfeng2;
                        }
                    },
                    end: {
                        sub: true,
                        popup: false,
                        charlotte: true,
                        forced: true,
                        trigger: {
                            player: 'phaseUseEnd'
                        },
                        filter: function (event, player) {
                            return player.storage.jsrgzhenfeng1;
                        },
                        content: function () {
                            delete player.storage.jsrgzhenfeng1;
                        }
                    },
                },
            },
            jsrgguanjue: {
                audio: 2,
                trigger: {
                    player: ["useCard", "respond"],
                },
                filter: function (event, player) {
                    return lib.suit.contains(get.suit(event.card));
                },
                forced: true,
                content: function () {
                    'step 0'
                    var targets = game.filterPlayer(current => current != player);
                    var suit = get.suit(trigger.card);
                    for (var target of targets) {
                        target.addTempSkill('jsrgguanjue_ban');
                        target.markAuto('jsrgguanjue_ban', [suit]);
                    }
                },
                subSkill: {
                    ban: {
                        onremove: true,
                        charlotte: true,
                        mod: {
                            cardEnabled: function (card, player) {
                                if (player.getStorage('jsrgguanjue_ban').contains(get.suit(card))) return false;
                            },
                            cardRespondable: function (card, player) {
                                if (player.getStorage('jsrgguanjue_ban').contains(get.suit(card))) return false;
                            },
                            cardSavable: function (card, player) {
                                if (player.getStorage('jsrgguanjue_ban').contains(get.suit(card))) return false;
                            },
                        },
                        mark: true,
                        marktext: "绝",
                        intro: {
                            content: "本回合内不能使用或打出$的牌",
                        },
                        sub: true,
                    },
                },
            },
            jsrgnianen: {
                audio: 2,
                enable: ["chooseToUse", "chooseToRespond"],
                filter: function (event, player) {
                    if (!player.countCards('hes')) return false;
                    if (player.hasSkill('jsrgnianen_blocker')) return false;
                    for (var name of lib.inpile) {
                        if (get.type2(name) != 'basic') continue;
                        var card = {
                            name: name
                        };
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
                derivation: "mashu",
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        for (var name of lib.inpile) {
                            if (name == 'sha') {
                                if (event.filterCard({
                                    name: name
                                }, player, event)) list.push(['基本', '', 'sha']);
                                for (var nature of lib.inpile_nature) {
                                    if (event.filterCard({
                                        name: name,
                                        nature: nature
                                    }, player, event)) list.push(['基本', '', 'sha', nature]);
                                }
                            } else if (get.type(name) == 'basic' && event.filterCard({
                                name: name
                            }, player, event)) list.push(['基本', '', name]);
                        }
                        var dialog = ui.create.dialog('念恩', [list, 'vcard']);
                        dialog.direct = true;
                        return dialog;
                    },
                    filter: function (button, player) {
                        return _status.event.getParent().filterCard({
                            name: button.link[2],
                            nature: button.link[3]
                        }, player, _status.event.getParent());
                    },
                    check: function (button) {
                        if (_status.event.getParent().type != 'phase') return 1;
                        var player = _status.event.player;
                        if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].contains(button.link[2])) return 0;
                        return player.getUseValue({
                            name: button.link[2],
                            nature: button.link[3],
                        });
                    },
                    backup: function (links, player) {
                        return {
                            audio: 'jsrgnianen',
                            filterCard: true,
                            popname: true,
                            check: function (card) {
                                return 8 - get.value(card);
                            },
                            position: 'hes',
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3]
                            },
                            precontent: function () {
                                delete event.result.skill;
                                var card = event.result.card;
                                if (get.color(card, player) != 'red' || get.name(card) != 'sha' || get.nature(card)) {
                                    player.addTempSkill('jsrgnianen_blocker');
                                    player.addAdditionalSkill('jsrgnianen_blocker', 'mashu');
                                }
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                    },
                },
                hiddenCard: function (player, name) {
                    if (!lib.inpile.contains(name)) return false;
                    var type = get.type2(name);
                    return type == 'basic' && player.countCards('hes') > 0 && !player.hasSkill('jsrgnianen_blocker');
                },
                ai: {
                    fireAttack: true,
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter: function (player) {
                        if (!player.countCards('hes') || player.hasSkill('jsrgnianen_blocker')) return false;
                    },
                    order: 1,
                    result: {
                        player: function (player) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                subSkill: {
                    blocker: {
                        charlotte: true,
                        mark: true,
                        marktext: "恩",
                        intro: {
                            content: "视为拥有〖马术〗",
                        },
                        sub: true,
                        parentskill: "jsrgnianen",
                    },
                },
            },
            jsrgjixiang: {
                audio: 2,
                trigger: {
                    global: ["chooseToUseBegin", "chooseToRespondBegin"],
                },
                filter: function (event, player) {
                    if (player != _status.currentPhase) return false;
                    if (player == event.player) return false;
                    if (!player.countCards('he')) return false;
                    for (var name of lib.inpile) {
                        if (get.type(name) != 'basic') continue;
                        if (player.getStorage('jsrgjixiang_used').contains(name)) continue;
                        var card = {
                            name: name
                        };
                        if (event.filterCard(card, event.player, event)) return true;
                        if (name == 'sha') {
                            for (var nature of lib.inpile_nature) {
                                card.nature = nature;
                                if (event.filterCard(card, event.player, event)) return true;
                            }
                        }
                    }
                    return false;
                },
                direct: true,
                global: "jsrgjixiang_save",
                content: function () {
                    'step 0'
                    var list = [];
                    for (var name of lib.inpile) {
                        if (get.type(name) != 'basic') continue;
                        var card = {
                            name: name
                        };
                        if (trigger.filterCard(card, trigger.player, trigger)) list.push(name);
                    }
                    var listx = [];
                    for (var name of list) {
                        if (player.getStorage('jsrgjixiang_used').contains(name)) continue;
                        listx.push([get.type2(name), '', name]);
                        if (name == 'sha') {
                            for (var nature of lib.inpile_nature) {
                                if (trigger.filterCard({
                                    name: name,
                                    nature: nature
                                }, player, trigger)) {
                                    listx.push([get.type2(name), '', name, nature]);
                                }
                            }
                        }
                    }
                    var evt = trigger.getParent();
                    var names = '';
                    for (var i = 0; i < list.length; i++) {
                        names += '【' + get.translation(list[i]) + '】';
                        names += i < list.length - 2 ? '、' : '或';
                    }
                    names = names.slice(0, names.length - 1);
                    var reason = (trigger.name == 'chooseToUse' ? '使用' : '打出');
                    var used = player.getStorage('jsrgjixiang_used').filter(name => list.contains(name));
                    var str = get.translation(trigger.player) + (evt.card ? '因' + get.translation(evt.card) : '') + '需要' + reason + '一张' + names + '，是否弃置一张牌视为其' + reason + '之' + (used.length ? ('（你不能以此法令其' + reason + get.translation(used) + '）') : '') + '？若如此做，你摸一张牌并令〖称贤〗此阶段可发动次数上限+1。';
                    event.str = str;
                    if (!listx.length) event.finish();
                    if (listx.length == 1) event._result = {
                        bool: true,
                        links: listx
                    };
                    else {
                        event.asked = true;
                        player.chooseButton([
                            '###' + get.prompt('jsrgjixiang', trigger.player) + '###<div class="text center">' + str + '</div>', [listx, 'vcard']
                        ]).set('ai', () => Math.random() + 1);
                    }
                    'step 1'
                    if (result.bool) {
                        var name = result.links[0][2],
                            nature = result.links[0][3];
                        var card = {
                            name: name,
                            nature: nature,
                            isCard: true
                        };
                        event.card = card;
                        var reason = (trigger.name == 'chooseToUse' ? '使用' : '打出');
                        var prompt = event.asked ?
                            '济乡：是否弃置一张牌' + (trigger.filterTarget ? '并选择目标角色' : '') + '？' : get.prompt('jsrgjixiang', trigger.player);
                        var str = event.asked ? '若如此做，视为' + get.translation(trigger.player) + reason + get.translation(card) + '，然后你摸一张牌并令〖称贤〗此阶段可发动次数上限+1。' : event.str;
                        var evt = trigger.getParent();
                        var next = player.chooseCardTarget({
                            prompt: prompt,
                            prompt2: str,
                            filterCard: lib.filter.cardDiscardable,
                            position: 'he',
                            goon: get.attitude(player, trigger.player) > 1 && (evt.card ? get.effect(trigger.player, evt.card, evt.player, player) < 0 : get.effect(trigger.player, {
                                name: list[0]
                            }, trigger.player, player) > 0),
                            ai1: function (card) {
                                if (_status.event.goon) return 6 - get.value(card);
                                return 0;
                            },
                            _get_card: card,
                        });
                        var keys = ['filterTarget', 'selectTarget', 'ai2'];
                        for (var key of keys) delete next[key];
                        for (var i in trigger) {
                            if (!next.hasOwnProperty(i)) next[i] = trigger[i];
                        }
                        next.filterTargetx = trigger.filterTarget || (() => false);
                        next.filterTarget = function (card, player, target) {
                            var filter = this.filterTargetx;
                            if (typeof filter != 'function') filter = (() => filter);
                            card = _status.event._get_card;
                            player = _status.event.getTrigger().player;
                            return this.filterTargetx.apply(this, arguments);
                        };
                        if (typeof next.selectTarget != 'number' && typeof next.selectTarget != 'function' && get.itemtype(next.selectTarget) != 'select') next.selectTarget = -1;
                    } else event.finish();
                    'step 2'
                    if (result.bool) {
                        var cardx = result.cards[0];
                        var targets = result.targets || [];
                        event.targets = targets;
                        player.logSkill('jsrgjixiang', trigger.player);
                        player.addTempSkill('jsrgjixiang_used');
                        player.markAuto('jsrgjixiang_used', [card.name]);
                        player.discard(cardx);
                        trigger.untrigger();
                        trigger.set('responded', true);
                        var result = {
                            bool: true,
                            card: card
                        };
                        if (targets.length) result.targets = targets;
                        trigger.result = result;
                        player.draw();
                        var phaseName;
                        for (var name of lib.phaseName) {
                            var evt = trigger.getParent(name);
                            if (!evt || evt.name != name) continue;
                            phaseName = name;
                            break;
                        }
                        if (phaseName) {
                            player.addTempSkill('jsrgjixiang_add', phaseName + 'After');
                            player.addMark('jsrgjixiang_add', 1, false);
                        }
                    }
                },
                subSkill: {
                    used: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        marktext: "乡",
                        intro: {
                            content: "已触发过牌名：$",
                        },
                        sub: true,
                        parentskill: "jsrgjixiang",
                    },
                    add: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        intro: {
                            markcount: (storage, player) => 2 + (storage || 0),
                            content: (storage, player) => '〖称贤〗剩余可发动次数为' + (2 + (storage || 0)),
                        },
                        sub: true,
                        parentskill: "jsrgjixiang",
                    },
                    save: {
                        charlotte: true,
                        ai: {
                            save: true,
                            skillTagFilter: function (player, arg, target) {
                                return _status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill('jsrgjixiang') && _status.currentPhase.countCards('he');
                            },
                        },
                        sub: true,
                        parentskill: "jsrgjixiang",
                    },
                },
            },
            jsrgchengxian: {
                audio: 2,
                enable: "phaseUse",
                filter: function (event, player) {
                    if (!player.countCards('hs')) return false;
                    if (2 + player.countMark('jsrgjixiang_add') <= 0) return false;
                    for (var name of lib.inpile) {
                        if (get.type(name) != 'trick') continue;
                        if (player.getStorage('jsrgchengxian_used').contains(name)) continue;
                        if (event.filterCard({
                            name: name
                        }, player, event)) return true;
                    }
                    return false;
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        for (var name of lib.inpile) {
                            if (player.getStorage('jsrgchengxian_used').contains(name)) continue;
                            var info = get.info({
                                name: name
                            });
                            if (!info || info.type != 'trick') continue;
                            if (info.notarget) continue;
                            if (!info.selectTarget) continue;
                            if (get.type(name) == 'trick' && event.filterCard({
                                name: name
                            }, player, event)) list.push(['锦囊', '', name]);
                        }
                        var dialog = ui.create.dialog('称贤', [list, 'vcard']);
                        return dialog;
                    },
                    filter: function (button, player) {
                        return _status.event.getParent().filterCard({
                            name: button.link[2],
                            nature: button.link[3]
                        }, player, _status.event.getParent());
                    },
                    check: function (button) {
                        if (_status.event.getParent().type != 'phase') return 1;
                        var player = _status.event.player;
                        if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].contains(button.link[2])) return 0;
                        return player.getUseValue({
                            name: button.link[2],
                            nature: button.link[3],
                        });
                    },
                    backup: function (links, player) {
                        return {
                            audio: 'jsrgchengxian',
                            filterCard: function (card, player) {
                                var num = game.countPlayer(current => {
                                    return player.canUse(card, current);
                                });
                                if (!num) return false;
                                var cardx = get.copy(lib.skill.jsrgchengxian_backup.viewAs);
                                cardx.cards = [card];
                                var num2 = game.countPlayer(current => {
                                    return player.canUse(cardx, current);
                                });
                                return num == num2;
                            },
                            popname: true,
                            check: function (card) {
                                return 8 - get.value(card);
                            },
                            position: 'hs',
                            viewAs: {
                                name: links[0][2]
                            },
                            precontent: function () {
                                player.logSkill('jsrgchengxian');
                                player.addTempSkill('jsrgjixiang_add');
                                if (typeof player.storage.jsrgjixiang_add != 'number') player.storage.jsrgjixiang_add = 0;
                                player.storage.jsrgjixiang_add--;
                                player.addTempSkill('jsrgchengxian_used');
                                player.markAuto('jsrgchengxian_used', [event.result.card.name]);
                                delete event.result.skill;
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '将一张合法目标数与' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '相同的手牌当此牌使用';
                    },
                },
                getNumber: function (card, player) {
                    var rangex = null;
                    var info = get.info(card);
                    if (!info) return null;
                    if (info.notarget) return null;
                    if (info.selectTarget != undefined) {
                        var select = get.select(info.selectTarget);
                        if (select[0] < 0) {
                            if (!info.toself) {
                                var count = game.countPlayer(current => {
                                    return lib.filter.targetEnabled(card, player, current);
                                });
                            } else count = 1;
                            rangex = [count, count];
                        } else rangex = select;
                    }
                    return rangex;
                },
                ai: {
                    order: 1,
                    result: {
                        player: function (player) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                subSkill: {
                    used: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        intro: {
                            content: "已使用过$",
                        },
                        sub: true,
                        parentskill: "jsrgchengxian",
                    },
                },
            },
            jsrgduxing: {
                audio: 2,
                enable: "phaseUse",
                viewAs: {
                    name: "juedou",
                    storage: {
                        jsrgduxing: true,
                    },
                    isCard: true,
                },
                viewAsFilter: function (player) {
                    if (player.hasSkill('jsrgduxing_used')) return false;
                },
                filterCard: () => false,
                selectCard: -1,
                selectTarget: [1, Infinity],
                precontent: function () {
                    player.logSkill('jsrgduxing');
                    delete event.result.skill;
                    var targets = event.result.targets;
                    for (var target of targets) {
                        target.addTempSkill('jsrgduxing_allsha');
                    }
                    player.addTempSkill('jsrgduxing_restore');
                    player.addTempSkill('jsrgduxing_used', 'phaseUseAfter');
                },
                ai: {
                    order: 5,
                    result: {
                        target: function (player, target) {
                            var eff = Math.sign(get.effect(target, {
                                name: 'juedou'
                            }, player, player));
                            if (player.hasSkillTag('directHit_ai', true, {
                                target: target,
                                card: {
                                    name: 'juedou'
                                },
                            }, true) || ui.selected.targets.concat(target).reduce((p, c) => {
                                return p + c.countCards('h');
                            }, 0) < player.countCards('h', 'sha')) {
                                return -eff;
                            }
                            return eff;
                        },
                        player: function (player, target, card) {
                            if (
                                player.hasSkillTag(
                                    'directHit_ai',
                                    true, {
                                    target: target,
                                    card: card
                                },
                                    true)) {
                                return 0;
                            }
                            if (get.damageEffect(target, player, target) > 0 && get.attitude(player, target) > 0) {
                                return 0;
                            }
                            var hs1 = target.countCards('hs', 'sha');
                            var hs2 = player.countCards('hs', 'sha');
                            if (hs1 > hs2 + 1) {
                                return -2;
                            }
                            if (player.hp == 1 && hs2 == 0 && hs1 >= 1) {
                                return -2;
                            }
                            var hsx1 = target.countCards('hs');
                            var hsx2 = player.countCards('hs');
                            if (hsx1.length == 0) {
                                return 0;
                            }
                            if (hsx1 > 3 && hs2 == 0) {
                                return -2;
                            }
                            if (hs2 >= 3 && hsx1 <= hsx2) {
                                return 0;
                            }
                            return -0.5;
                        },
                    },
                    wuxie: function (target, card, player, viewer) {
                        if (player == game.me && get.attitude(viewer, player) > 0) {
                            return 0;
                        }
                    },
                    basic: {
                        order: 5,
                        useful: 1,
                        value: 5.5,
                    },
                    tag: {
                        respond: 2,
                        respondSha: 2,
                        damage: 1,
                    },
                },
                subSkill: {
                    allsha: {
                        charlotte: true,
                        mod: {
                            cardname: function (card, player, name) {
                                return 'sha';
                            },
                        },
                        sub: true,
                        parentskill: "jsrgduxing",
                    },
                    used: {
                        charlotte: true,
                        sub: true,
                        parentskill: "jsrgduxing",
                    },
                    restore: {
                        charlotte: true,
                        trigger: {
                            global: "useCardAfter",
                        },
                        forced: true,
                        popup: false,
                        forceDie: true,
                        forceOut: true,
                        filter: function (event, player) {
                            return event.card.name == 'juedou' && event.card.storage && event.card.storage.jsrgduxing;
                        },
                        content: function () {
                            game.countPlayer(current => {
                                current.removeSkill('jsrgduxing_allsha');
                            }, true);
                        },
                        sub: true,
                        parentskill: "jsrgduxing",
                    },
                },
            },
            jsrgzhiheng: {
                audio: 2,
                trigger: {
                    source: "damageBegin1",
                },
                forced: true,
                filter: function (event, player) {
                    if (event.getParent().type != 'card') return false;
                    var respondEvts = [];
                    respondEvts.addArray(event.player.getHistory('useCard')).addArray(event.player.getHistory('respond'));
                    respondEvts = respondEvts.filter(i => i.respondTo).map(evt => evt.respondTo);
                    return respondEvts.some(list => {
                        return list[0] == player;
                    });
                },
                content: function () {
                    trigger.num++;
                },
            },
            jsrgzhasi: {
                audio: 2,
                trigger: {
                    player: "damageBegin4",
                },
                limited: true,
                skillAnimation: true,
                animationColor: "wood",
                filter: function (event, player) {
                    return event.num >= player.hp;
                },
                content: function () {
                    player.awakenSkill('jsrgzhasi');
                    trigger.cancel();
                    player.removeSkill('jsrgzhiheng');
                    game.log(player, '失去了技能', '#g【猘横】');
                    player.addSkillLog('rezhiheng');
                    player.addSkill('jsrgzhasi_undist');
                },
                subSkill: {
                    undist: {
                        inherit: "undist",
                        charlotte: true,
                        trigger: {
                            player: ["useCardAfter", "damageEnd"],
                        },
                        filter: function (event, player) {
                            if (event.name == 'useCard') return event.targets.some(target => {
                                return target != player;
                            });
                            return true;
                        },
                        forced: true,
                        popup: false,
                        content: function () {
                            player.removeSkill('jsrgzhasi_undist');
                        },
                        mark: true,
                        intro: {
                            content: "诈死中，不计入距离和座次的计算",
                        },
                        sub: true,
                        parentskill: "jsrgzhasi",
                    },
                },
                mark: true,
                intro: {
                    content: "limited",
                },
                init: function (player, skill) {
                    player.storage[skill] = false;
                },
            },
            jsrgbashi: {
                audio: 2,
                trigger: {
                    player: "chooseToRespondBefore",
                },
                zhuSkill: true,
                filter: function (event, player) {
                    if (event.responded) return false;
                    if (player.storage.jsrgbashiing) return false;
                    if (!player.hasZhuSkill('jsrgbashi')) return false;
                    if (!event.filterCard({
                        name: 'sha'
                    }, player, event) && !event.filterCard({
                        name: 'shan'
                    }, player, event)) return false;
                    return game.hasPlayer(function (current) {
                        return current != player && current.group == 'wu';
                    });
                },
                check: function (event, player) {
                    if (get.damageEffect(player, event.player, player) >= 0) return false;
                    return true;
                },
                content: function () {
                    'step 0'
                    event.targets = game.filterPlayer();
                    'step 1'
                    var target = event.targets.shift();
                    event.target = target;
                    if (!target) event.finish();
                    else if (!target.isIn() || target == player) event.redo();
                    else if (target.group == 'wu') {
                        if ((target == game.me && !_status.auto) || (
                            get.attitude(target, player) > 2) || target.isOnline()) {
                            player.storage.jsrgbashiing = true;
                            var list = ['sha', 'shan'].filter(name => trigger.filterCard({
                                name: name
                            }, player, trigger));
                            var names = list.map(i => '【' + i + '】').join('或');
                            var next = target.chooseToRespond('是否替' + get.translation(player) + '打出一张【杀】／【闪】？', {
                                name: list
                            });
                            next.set('ai', function () {
                                var event = _status.event;
                                return (get.attitude(event.player, event.source) - 2);
                            });
                            next.set('skillwarn', '替' + get.translation(player) + '打出一张【杀】／【闪】');
                            next.autochoose = function () {
                                if (!lib.filter.autoRespondSha.apply(this, arguments)) return false;
                                return lib.filter.autoRespondShan.apply(this, arguments);
                            };
                            next.set('source', player);
                        }
                    }
                    'step 2'
                    delete player.storage.jsrgbashiing;
                    if (result.bool) {
                        event.finish();
                        var name = result.card.name;
                        trigger.result = {
                            bool: true,
                            card: {
                                name: name,
                                isCard: true
                            }
                        };
                        trigger.responded = true;
                        trigger.animate = false;
                        if (typeof target.ai.shown == 'number' && target.ai.shown < 0.95) {
                            target.ai.shown += 0.3;
                            if (target.ai.shown > 0.95) target.ai.shown = 0.95;
                        }
                    } else {
                        event.goto(1);
                    }
                },
                ai: {
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter: function (player, tag, arg) {
                        if (arg == 'use') return false;
                        if (player.storage.jsrgbashiing) return false;
                        if (!player.hasZhuSkill('jsrgbashi')) return false;
                        return game.hasPlayer(function (current) {
                            return current != player && current.group == 'wu';
                        });
                    },
                },
            },
            jsrglipan: {
                audio: 2,
                trigger: {
                    player: "phaseEnd",
                },
                direct: true,
                content: function () {
                    'step 0'
                    var list = lib.group.slice();
                    list.remove(player.group);
                    var getV = function (group) {
                        var val = 1;
                        if (group == 'wei' || group == 'qun') val++;
                        game.countPlayer(current => {
                            if (current.group != group) return false;
                            var att = get.attitude(player, current);
                            if (att > 0) val++;
                            else if (att == 0) val += 0.5;
                            else val--;
                        });
                        return val;
                    };
                    var maxGroup = list.slice().sort((a, b) => {
                        return getV(b) - getV(a);
                    })[0];
                    list.push('cancel2');
                    player.chooseControl(list).set('prompt', get.prompt('jsrglipan')).set('prompt2', '变更为另一个势力').set('ai', () => {
                        return _status.event.choice;
                    }).set('choice', maxGroup);
                    'step 1'
                    var group = result.control;
                    if (group == 'cancel2') player.logSkill('jsrglipan');
                    player.popup(group + '2', get.groupnature(group, 'raw'));
                    player.changeGroup(group);
                    var num = game.countPlayer(current => {
                        return current.group == group && current != player;
                    });
                    if (num > 0) player.draw(num);
                    var next = player.phaseUse();
                    next.jsrglipan = true;
                    event.next.remove(next);
                    trigger.next.push(next);
                    player.addTempSkill('jsrglipan_backfire');
                },
                subSkill: {
                    backfire: {
                        trigger: {
                            player: "phaseUseEnd",
                        },
                        charlotte: true,
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            return event.jsrglipan;
                        },
                        content: function () {
                            'step 0'
                            var targets = game.filterPlayer(current => {
                                return current.group == player.group;
                            });
                            targets.sortBySeat();
                            event.targets = targets;
                            'step 1'
                            var target = targets.shift();
                            event.target = target;
                            if (target && target.isIn() && target.canUse({
                                name: 'juedou'
                            }, player)) {
                                target.chooseCardTarget({
                                    position: 'hes',
                                    prompt: '是否将一张牌当【决斗】对' + get.translation(player) + '使用？',
                                    filterCard: function (card, player) {
                                        return player.canUse(get.autoViewAs({
                                            name: 'juedou'
                                        }, [card]), _status.event.getParent().player);
                                    },
                                    filterTarget: function (card, player, target) {
                                        var source = _status.event.getParent().player;
                                        if (target != source && !ui.selected.targets.contains(source)) return false;
                                        card = get.autoViewAs({
                                            name: 'juedou'
                                        }, [card]);
                                        return lib.filter.filterTarget.apply(this, arguments);
                                    },
                                    selectTarget: function () {
                                        var card = get.card(),
                                            player = get.player();
                                        if (!card) return;
                                        card = get.autoViewAs({
                                            name: 'juedou'
                                        }, [card]);
                                        var range = [1, 1];
                                        game.checkMod(card, player, range, 'selectTarget', player);
                                        return range;
                                    },
                                    ai1: function (card) {
                                        var player = _status.event.player,
                                            target = _status.event.getParent().player;
                                        var eff = get.effect(target, get.autoViewAs({
                                            name: 'juedou'
                                        }, [card]), player, player);
                                        if (eff <= 0) return 0;
                                        return (player.hp == 1 ? 10 : 6) - get.value(card);
                                    },
                                    ai2: function (target) {
                                        if (target == _status.event.getParent().player) return 100;
                                        return get.effect(target, {
                                            name: 'juedou'
                                        }, _status.event.player);
                                    }
                                });
                            }
                            'step 2'
                            if (result.bool) {
                                var cards = result.cards;
                                var cardx = get.autoViewAs({
                                    name: 'juedou'
                                }, cards);
                                var targets = result.targets.filter(targetx => {
                                    return target.canUse(cardx, targetx);
                                });
                                if (targets.length) target.useCard(cardx, cards, targets);
                            }
                            if (targets.length) event.goto(1);
                        },
                        sub: true,
                        parentskill: "jsrglipan",
                    },
                },
            },
            jsrgqingxi: {
                audio: 2,
                enable: "phaseUse",
                filter: function (event, player) {
                    if (player.group != 'qun') return false;
                    return game.hasPlayer(current => lib.skill.jsrgqingxi.filterTarget('', player, current));
                },
                groupSkill: true,
                filterTarget: function (card, player, target) {
                    if (target.countCards('h') >= player.countCards('h')) return false;
                    return !player.getStorage('jsrgqingxi_used').contains(target);
                },
                content: function () {
                    'step 0'
                    player.addTempSkill('jsrgqingxi_used', 'phaseUseAfter');
                    player.markAuto('jsrgqingxi_used', [target]);
                    var num = player.countCards('h') - target.countCards('h');
                    if (num > 0) player.chooseToDiscard(num, true, '轻袭：弃置' + get.cnNumber(num) + '张手牌');
                    'step 1'
                    var card = {
                        name: 'sha',
                        nature: 'stab',
                        isCard: true,
                    };
                    if (player.canUse(card, target, false)) player.useCard(card, target, false);
                },
                ai: {
                    order: 8,
                    result: {
                        target: function (player, target) {
                            var num = target.countCards('h') - player.countCards('h');
                            var cnt = player.countCards('h', card => {
                                return get.value(card) < 5;
                            });
                            if (cnt < num) return 0;
                            var eff = get.effect(target, {
                                name: 'sha',
                                nature: 'stab'
                            }, player, target);
                            return Math.sign(eff) / Math.sqrt(num);
                        },
                    },
                },
                subSkill: {
                    used: {
                        onremove: true,
                        charlotte: true,
                        sub: true,
                        parentskill: "jsrgqingxi",
                    },
                },
            },
            jsrgjinmie: {
                audio: 2,
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    if (player.group != 'wei') return false;
                    return game.hasPlayer(current => current.countCards('h') > player.countCards('h'));
                },
                groupSkill: true,
                filterTarget: function (card, player, target) {
                    return target.countCards('h') > player.countCards('h');
                },
                content: function () {
                    'step 0'
                    var card = {
                        name: 'sha',
                        nature: 'fire',
                        storage: {
                            jsrgjinmie: target
                        },
                        isCard: true,
                    };
                    if (player.canUse(card, target, false)) {
                        player.useCard(card, target, false);
                        player.addTempSkill('jsrgjinmie_effect');
                    }
                },
                ai: {
                    order: 0.5,
                    result: {
                        target: function (player, target) {
                            var eff = get.effect(target, {
                                name: 'sha',
                                nature: 'fire'
                            }, player, target) / 30;
                            if (!target.mayHaveShan()) eff *= 2;
                            var del = target.countCards('h') - player.countCards('h') + 1.5;
                            eff *= Math.sqrt(del);
                            return eff;
                        },
                    },
                },
                subSkill: {
                    effect: {
                        trigger: {
                            source: "damageSource",
                        },
                        filter: function (event, player) {
                            return event.card && event.card.storage && event.card.storage.jsrgjinmie && event.card.storage.jsrgjinmie.isIn();
                        },
                        forced: true,
                        popup: false,
                        charlotte: true,
                        content: function () {
                            'step 0'
                            var target = trigger.card.storage.jsrgjinmie;
                            var del = target.countCards('h') - player.countCards('h');
                            if (del > 0) {
                                player.line(target);
                                player.discardPlayerCard(target, 'h', true, del);
                            }
                            // else if(del<0){
                            //     player.line(target);
                            //     target.draw(-del);
                            // }
                        },
                        sub: true,
                        parentskill: "jsrgjinmie",
                    },
                },
            },
            jsrgwuchang: {
                audio: 2,
                trigger: {
                    player: "gainAfter",
                    global: "loseAsyncAfter",
                },
                forced: true,
                filter: function (event, player) {
                    var cards = event.getg(player);
                    if (!cards.length) return false;
                    return game.hasPlayer(current => {
                        if (current == player) return false;
                        return event.getl(current).cards2.length;
                    });
                },
                group: "jsrgwuchang_add",
                content: function () {
                    'step 0'
                    var targets = game.filterPlayer(current => {
                        if (current == player) return false;
                        return trigger.getl(current).cards2.length;
                    });
                    var target = targets[0];
                    player.changeGroup(target.group);
                    player.popup(target.group + '2', get.groupnature(target.group, 'raw'));
                },
                subSkill: {
                    add: {
                        trigger: {
                            source: "damageBegin1",
                        },
                        filter: function (event, player) {
                            if (!event.card || !['sha', 'juedou'].contains(event.card.name) || event.getParent().type != 'card') return false;
                            return event.player.group == player.group;
                        },
                        forced: true,
                        content: function () {
                            'step 0'
                            trigger.num++;
                            var group = 'qun';
                            player.changeGroup(group);
                            player.popup(group + '2', get.groupnature(group, 'raw'));
                        },
                        sub: true,
                        parentskill: "jsrgwuchang",
                    },
                },
            },
            jsrgqingjiao: {
                audio: 2,
                enable: "phaseUse",
                filter: function (event, player) {
                    if (player.group != 'qun') return false;
                    if (!player.countCards('hes')) return false;
                    return !player.hasSkill('jsrgqingjiao_tuixinzhifu') && game.hasPlayer(current => {
                        return current.countCards('h') > player.countCards('h');
                    }) || !player.hasSkill('jsrgqingjiao_chenghuodajie') && game.hasPlayer(current => {
                        return current.countCards('h') < player.countCards('h');
                    });
                },
                groupSkill: true,
                position: "hes",
                filterCard: true,
                selectCard: 1,
                discard: false,
                lose: false,
                delay: false,
                filterTarget: function (card, player, target) {
                    var mod = game.checkMod(ui.selected.cards[0], player, 'unchanged', 'cardEnabled2', player);
                    if (!mod) return false;
                    var del = target.countCards('h') - player.countCards('h');
                    if (del == 0) return false;
                    var name = del > 0 ? 'tuixinzhifu' : 'chenghuodajie';
                    if (player.hasSkill('jsrgqingjiao_' + name)) return false;
                    return player.canUse({
                        name: name,
                        cards: ui.selected.cards
                    }, target);
                },
                content: function () {
                    var del = target.countCards('h') - player.countCards('h');
                    var name = del > 0 ? 'tuixinzhifu' : 'chenghuodajie';
                    player.useCard({
                        name: name
                    }, target, cards);
                    player.addTempSkill('jsrgqingjiao_' + name, 'phaseUseAfter');
                },
                subSkill: {
                    tuixinzhifu: {
                        charlotte: true,
                        sub: true,
                        parentskill: "jsrgqingjiao",
                    },
                    chenghuodajie: {
                        charlotte: true,
                        sub: true,
                        parentskill: "jsrgqingjiao",
                    },
                },
            },
            jsrgchengxu: {
                audio: 2,
                trigger: {
                    player: "useCard",
                },
                forced: true,
                filter: function (event, player) {
                    if (player.group != 'shu') return false;
                    return game.hasPlayer(current => {
                        return current != player && current.group == player.group;
                    });
                },
                groupSkill: true,
                content: function () {
                    trigger.directHit.addArray(game.filterPlayer(current => {
                        return current != player && current.group == player.group;
                    }));
                },
                ai: {
                    "directHit_ai": true,
                    skillTagFilter: function (player, tag, arg) {
                        return player.group == 'shu' && player.group == arg.target.group;
                    },
                },
            },
            jsrgqiongtu: {
                audio: 2,
                enable: "chooseToUse",
                groupSkill: true,
                viewAs: {
                    name: "wuxie",
                    suit: "none",
                    number: null,
                    isCard: true,
                },
                filter: function (event, player) {
                    return player.group == 'qun' && !player.hasSkill('jsrgqiongtu_check');
                },
                viewAsFilter: function (player) {
                    return player.group == 'qun' && !player.hasSkill('jsrgqiongtu_check');
                },
                filterCard: function (card) {
                    return get.type(card) != 'basic';
                },
                position: "he",
                popname: true,
                ignoreMod: true,
                precontent: function () {
                    'step 0'
                    player.logSkill('jsrgqiongtu');
                    delete event.result.skill;
                    var card = event.result.cards[0];
                    event.card = card;
                    event.result.card = {
                        name: event.result.card.name,
                        storage: {
                            jsrgqiongtu: true
                        },
                        isCard: true,
                    };
                    event.result.cards = [];
                    player.addToExpansion(card, player, 'give').gaintag.add('jsrgqiongtu');
                    player.addTempSkill('jsrgqiongtu_check');
                },
                marktext: "途",
                intro: {
                    content: "expansion",
                    markcount: "expansion",
                },
                onremove: function (player, skill) {
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                    delete player.storage[skill];
                },
                subSkill: {
                    check: {
                        trigger: {
                            global: "useCardAfter",
                        },
                        filter: function (event, player) {
                            return event.card.name == 'wuxie' && event.card.storage && event.card.storage.jsrgqiongtu;
                        },
                        forced: true,
                        popup: false,
                        charlotte: true,
                        content: function () {
                            'step 0'
                            game.delayx();
                            var evt = trigger.getParent(4),
                                state;
                            if (evt.name == 'phaseJudge') {
                                state = evt.cancelled;
                            } else {
                                state = evt._neutralized;
                            }
                            if (state) {
                                player.draw();
                            } else {
                                player.changeGroup('wei');
                                var cards = player.getExpansions('jsrgqiongtu');
                                if (cards.length) player.gain(cards, 'gain2');
                            }
                        },
                        sub: true,
                        parentskill: "jsrgqiongtu",
                    },
                },
                ai: {
                    basic: {
                        useful: [6, 4, 3],
                        value: [6, 4, 3],
                    },
                    result: {
                        player: 1,
                    },
                    expose: 0.2,
                },
            },
            jsrgxianzhu: {
                audio: 2,
                enable: "chooseToUse",
                filter: function (event, player) {
                    return player.group == 'wei' && player.hasCard(card => {
                        return _status.connectMode || get.type(card) == 'trick';
                    }, 'hs');
                },
                groupSkill: true,
                viewAs: {
                    name: "sha",
                    storage: {
                        jsrgxianzhu: true,
                    },
                },
                position: "hs",
                filterCard: function (card) {
                    return get.type(card) == 'trick';
                },
                check: function (card) {
                    var player = _status.event.player;
                    var cardx = {
                        name: 'sha',
                        storage: {
                            jsrgxianzhu: true
                        },
                        cards: [card],
                    }
                    if (game.hasPlayer(current => {
                        return player.canUse(cardx, current) && get.effect(current, card, player, player) > 0 && get.effect(current, cardx, player, player) > 0;
                    })) return 15 - get.value(card);
                    return 0;
                },
                onuse: function (links, player) {
                    player.addTempSkill('jsrgxianzhu_after');
                },
                mod: {
                    cardUsable: function (card) {
                        if (card.storage && card.storage.jsrgxianzhu) return Infinity;
                    },
                },
                subSkill: {
                    after: {
                        trigger: {
                            global: "damageSource",
                        },
                        filter: function (event, player) {
                            var targets = event.getParent(2).targets;
                            if (!targets || targets.length != 1) return false;
                            if (!event.card || !event.card.storage || !event.card.storage.jsrgxianzhu) return false;
                            var target = event.player,
                                card = event.cards[0];
                            if (!target.isIn()) return false;
                            if (get.type(card) != 'trick') return false;
                            if (!player.canUse(card, target, false)) return false;
                            return true;
                        },
                        forced: true,
                        charlotte: true,
                        group: "jsrgxianzhu_inf",
                        content: function () {
                            var card = {
                                name: trigger.cards[0].name,
                                isCard: true,
                            }
                            player.useCard(card, trigger.player, false);
                            game.delayx();
                        },
                        sub: true,
                        parentskill: "jsrgxianzhu",
                    },
                    inf: {
                        trigger: {
                            player: "useCard1",
                        },
                        forced: true,
                        popup: false,
                        firstDo: true,
                        filter: function (event, player) {
                            if (event.card.storage && event.card.storage.jsrgxianzhu && event.addCount !== false) return true;
                            return false;
                        },
                        content: function () {
                            trigger.addCount = false;
                            var stat = player.getStat().card,
                                name = trigger.card.name;
                            if (typeof stat[name] == 'number') stat[name]--;
                        },
                        sub: true,
                        parentskill: "jsrgxianzhu",
                    },
                },
                ai: {
                    yingbian: function (card, player, targets, viewer) {
                        if (get.attitude(viewer, player) <= 0) return 0;
                        var base = 0,
                            hit = false;
                        if (get.cardtag(card, 'yingbian_hit')) {
                            hit = true;
                            if (targets.filter(function (target) {
                                return target.hasShan() && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.nature(card)) > 0;
                            })) base += 5;
                        }
                        if (get.cardtag(card, 'yingbian_all')) {
                            if (game.hasPlayer(function (current) {
                                return !targets.contains(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                            })) base += 5;
                        }
                        if (get.cardtag(card, 'yingbian_damage')) {
                            if (targets.filter(function (target) {
                                return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan() || player.hasSkillTag('directHit_ai', true, {
                                    target: target,
                                    card: card,
                                }, true)) && !target.hasSkillTag('filterDamage', null, {
                                    player: player,
                                    card: card,
                                    jiu: true,
                                })
                            })) base += 5;
                        }
                        return base;
                    },
                    canLink: function (player, target, card) {
                        if (!target.isLinked() && !player.hasSkill('wutiesuolian_skill')) return false;
                        if (target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                            target: target,
                            card: card,
                        }, true)) return false;
                        if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
                        return true;
                    },
                    basic: {
                        useful: [5, 3, 1],
                        value: [5, 3, 1],
                    },
                    order: function (item, player) {
                        if (player.hasSkillTag('presha', true, null, true)) return 10;
                        if (lib.linked.contains(get.nature(item))) {
                            if (game.hasPlayer(function (current) {
                                return current != player && current.isLinked() && player.canUse(item, current, null, true) && get.effect(current, item, player, player) > 0 && lib.card.sha.ai.canLink(player, current, item);
                            }) && game.countPlayer(function (current) {
                                return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
                            }) > 1) return 3.1;
                            return 3;
                        }
                        return 3.05;
                    },
                    result: {
                        target: function (player, target, card, isLink) {
                            var eff = function () {
                                if (!isLink && player.hasSkill('jiu')) {
                                    if (!target.hasSkillTag('filterDamage', null, {
                                        player: player,
                                        card: card,
                                        jiu: true,
                                    })) {
                                        if (get.attitude(player, target) > 0) {
                                            return -7;
                                        } else {
                                            return -4;
                                        }
                                    }
                                    return -0.5;
                                }
                                return -1.5;
                            }();
                            if (!isLink && target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                                target: target,
                                card: card,
                            }, true)) return eff / 1.2;
                            return eff;
                        },
                    },
                    tag: {
                        respond: 1,
                        respondShan: 1,
                        damage: function (card) {
                            if (card.nature == 'poison') return;
                            return 1;
                        },
                        natureDamage: function (card) {
                            if (card.nature) return 1;
                        },
                        fireDamage: function (card, nature) {
                            if (card.nature == 'fire') return 1;
                        },
                        thunderDamage: function (card, nature) {
                            if (card.nature == 'thunder') return 1;
                        },
                        poisonDamage: function (card, nature) {
                            if (card.nature == 'poison') return 1;
                        },
                    },
                },
            },
            jsrgguyin: {
                audio: 2,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                check: function (event, player) {
                    return player.isTurnedOver() || game.countPlayer2(current => current.hasSex('male')) >= 2;
                },
                content: function () {
                    'step 0'
                    player.turnOver();
                    'step 1'
                    var targets = game.filterPlayer(current => current != player && current.hasSex('male'));
                    event.targets = targets;
                    player.line(targets);
                    game.delayx();
                    'step 2'
                    var target = targets.shift();
                    event.target = target;
                    target.chooseBool('是否响应' + get.translation(player) + '的【孤吟】？', '你可以翻面。').set('ai', () => {
                        return _status.event.bool;
                    }).set('bool', function () {
                        return target.isTurnedOver() || get.attitude(target, player) > 0 && (game.countPlayer2(current => current.hasSex('male')) >= 3 || target.hp <= 1 && player.hasSkill('jsrgzhangdeng'));
                    }());
                    'step 3'
                    if (result.bool) {
                        target.turnOver();
                    }
                    if (targets.length) event.goto(2);
                    'step 4'
                    var targets = game.filterPlayer(current => {
                        return current == player || current.isTurnedOver();
                    });
                    event.targets = targets;
                    event.num = 0;
                    event.index = 0;
                    'step 5'
                    var target = targets[event.index];
                    if (target.isIn()) {
                        target.draw();
                        if (target == player) event.num++;
                    }
                    event.index++;
                    if (event.index >= targets.length) event.index = 0;
                    'step 6'
                    if (event.num >= game.countPlayer2(current => current.hasSex('male'))) event.finish();
                    else event.goto(5);
                },
            },
            jsrgzhangdeng: {
                audio: 2,
                trigger: {
                    global: "logSkill",
                },
                filter: function (event, player) {
                    return event.player.getHistory('useSkill', evt => {
                        return evt.skill == 'jsrgzhangdeng_jiu';
                    }).map(evt => evt.event).indexOf(event.log_event) == 1;
                },
                global: "jsrgzhangdeng_jiu",
                forced: true,
                locked: false,
                content: function () {
                    player.turnOver(false);
                },
                subSkill: {
                    jiu: {
                        audio: "jsrgzhangdeng",
                        enable: "chooseToUse",
                        filter: function (event, player) {
                            return player.isTurnedOver() && game.hasPlayer(current => {
                                return current.hasSkill('jsrgzhangdeng');
                            });
                        },
                        viewAs: {
                            name: "jiu",
                            isCard: true,
                        },
                        viewAsFilter: function (player) {
                            return player.isTurnedOver() && game.hasPlayer(current => {
                                return current.hasSkill('jsrgzhangdeng');
                            });
                        },
                        filterCard: () => false,
                        selectCard: -1,
                        precontent: function () {
                            player.logSkill('jsrgzhangdeng_jiu');
                            var targets = game.filterPlayer(current => {
                                return current.hasSkill('jsrgzhangdeng');
                            });
                            player.line(targets[0]);
                            delete event.result.skill;
                        },
                        sub: true,
                        parentskill: "jsrgzhangdeng",
                        ai: {
                            basic: {
                                useful: function (card, i) {
                                    if (_status.event.player.hp > 1) {
                                        if (i == 0) return 4;
                                        return 1;
                                    }
                                    if (i == 0) return 7.3;
                                    return 3;
                                },
                                value: function (card, player, i) {
                                    if (player.hp > 1) {
                                        if (i == 0) return 5;
                                        return 1;
                                    }
                                    if (i == 0) return 7.3;
                                    return 3;
                                },
                            },
                            order: function () {
                                return get.order({
                                    name: 'sha'
                                }) + 0.2;
                            },
                            result: {
                                target: function (player, target) {
                                    if (target && target.isDying()) return 2;
                                    if (target && !target.isPhaseUsing()) return 0;
                                    if (lib.config.mode == 'stone' && !player.isMin()) {
                                        if (player.getActCount() + 1 >= player.actcount) return 0;
                                    }
                                    var shas = player.getCards('h', 'sha');
                                    if (shas.length > 1 && (player.getCardUsable('sha') > 1 || player.countCards('h', 'zhuge'))) {
                                        return 0;
                                    }
                                    shas.sort(function (a, b) {
                                        return get.order(b) - get.order(a);
                                    })
                                    var card;
                                    if (shas.length) {
                                        for (var i = 0; i < shas.length; i++) {
                                            if (lib.filter.filterCard(shas[i], target)) {
                                                card = shas[i];
                                                break;
                                            }
                                        }
                                    } else if (player.hasSha() && player.needsToDiscard()) {
                                        if (player.countCards('h', 'hufu') != 1) {
                                            card = {
                                                name: 'sha'
                                            };
                                        }
                                    }
                                    if (card) {
                                        if (game.hasPlayer(function (current) {
                                            return (get.attitude(target, current) < 0 && target.canUse(card, current, null, true) && !current.hasSkillTag('filterDamage', null, {
                                                player: player,
                                                card: card,
                                                jiu: true,
                                            }) && get.effect(current, card, target) > 0);
                                        })) {
                                            return 1;
                                        }
                                    }
                                    return 0;
                                },
                            },
                            tag: {
                                save: 1,
                                recover: 0.1,
                            },
                        },
                    },
                },
            },
            jsrglunshi: {
                audio: 2,
                enable: "phaseUse",
                usable: 1,
                filterTarget: function (card, player, target) {
                    return game.hasPlayer(current => {
                        return current.inRangeOf(target);
                    });
                },
                content: function () {
                    'step 0'
                    var num = game.countPlayer(current => {
                        return current.inRangeOf(target);
                    });
                    var len = target.countCards('h');
                    num = Math.max(0, Math.min(len + num, 5) - len);
                    if (num > 0) target.draw(num);
                    'step 1'
                    var num = game.countPlayer(current => {
                        return current.inRange(target);
                    });
                    if (num > 0) target.chooseToDiscard(num, 'he', true, get.translation(player) + '对你发动了【论势】', '请弃置' + get.cnNumber(num) + '张牌');
                },
                ai: {
                    order: 6,
                    result: {
                        target: function (player, target) {
                            var num1 = game.countPlayer(current => {
                                return current.inRangeOf(target);
                            }),
                                num2 = game.countPlayer(current => {
                                    return current.inRange(target);
                                });
                            var len = target.countCards('h');
                            num1 = Math.max(0, Math.min(len + num1, 5) - len);
                            return (num1 - num2 + 1) / 2;
                        },
                    },
                },
            },
            jsrgguitu: {
                audio: 2,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                direct: true,
                filter: function (event, player) {
                    return game.countPlayer(current => {
                        return current.getCards('equip1').length;
                    }) >= 2;
                },
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt2('jsrgguitu'), (card, player, target) => {
                        return target.getEquip(1);
                    }, 2).set('ai', target => {
                        var sign = -1;
                        var val = 0;
                        if (ui.selected.targets.length) {
                            sign = 1;
                            var targetx = ui.selected.targets[0];
                            var cards = targetx.getCards('equip1');
                            var list = cards.map(card => {
                                return [card, get.value(card, targetx)];
                            });
                            list.sort((a, b) => {
                                return b[1] - a[1];
                            });
                            val = get.attitude(_status.event.player, targetx) * list[0][1];
                        }
                        var cards = target.getCards('equip1');
                        var list = cards.map(card => {
                            return [card, get.value(card, target)];
                        });
                        list.sort((a, b) => {
                            return b[1] - a[1];
                        });
                        return get.attitude(_status.event.player, target) * list[0][1] * sign - val;
                    });
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets.slice();
                        targets.sortBySeat();
                        event.targets = targets;
                        player.logSkill('jsrgguitu', targets);
                        event.rangeList = targets.map(target => {
                            return target.getAttackRange();
                        });
                        var weapons = [];
                        for (var target of targets) {
                            weapons.addArray(target.getCards('e', function (card) {
                                return get.subtype(card) == 'equip1';
                            }));
                        }
                        event.weapon = weapons;
                        game.log(event.weapon);
                    } else event.finish();
                    'step 2'
                    event.targets[0].lose(event.weapon[0], ui.ordering, 'visible');
                    event.targets[1].lose(event.weapon[1], ui.ordering, 'visible');
                    event.targets[0].$give(event.weapon[0], event.targets[1], false);
                    event.targets[1].$give(event.weapon[1], event.targets[0], false);
                    'step 3'
                    if (get.position(event.weapon[1], true) == 'o') event.targets[0].equip(event.weapon[1]);
                    if (get.position(event.weapon[0], true) == 'o') event.targets[1].equip(event.weapon[0]);
                    'step 4'
                    var rangeList = targets.map(target => {
                        return target.getAttackRange();
                    });
                    for (var i = 0; i < targets.length; i++) {
                        if (rangeList[i] < event.rangeList[i]) {
                            targets[i].recover();
                        }
                    }

                },
            },
            jsrgzhengbing: {
                audio: 2,
                enable: "phaseUse",
                usable: 3,
                filter: function (event, player) {
                    return player.group == 'qun';
                },
                filterCard: true,
                check: function (card) {
                    var extra = 0;
                    if (get.name(card) == 'tao' || get.name(card) == 'shan') extra += 1;
                    if (get.name(card) == 'sha') extra += 1.5;
                    return 6 - get.value(card) + extra;
                },
                position: "he",
                groupSkill: true,
                lose: false,
                discard: false,
                delay: false,
                content: function () {
                    'step 0'
                    player.loseToDiscardpile(cards);
                    player.draw();
                    switch (get.name(cards[0])) {
                        case 'sha':
                            player.addTempSkill('jsrgzhengbing_sha');
                            player.addMark('jsrgzhengbing_sha', 2, false);
                            break;
                        case 'shan':
                            player.draw();
                            break;
                        case 'tao':
                            player.changeGroup('wei');
                    }
                },
                ai: {
                    order: 7,
                    result: {
                        player: 1,
                    },
                },
                subSkill: {
                    sha: {
                        charlotte: true,
                        onremove: true,
                        mod: {
                            maxHandcard: function (player, num) {
                                return num + player.countMark('jsrgzhengbing_sha');
                            },
                        },
                        intro: {
                            content: "手牌上限+#",
                        },
                        sub: true,
                    },
                },
            },
            jsrgtuwei: {
                audio: 2,
                trigger: {
                    player: "phaseUseBegin",
                },
                filter: function (event, player) {
                    return player.group == 'wei' && game.hasPlayer(current => {
                        return player.inRange(current) && current.countGainableCards(player, 'he') > 0;
                    });
                },
                groupSkill: true,
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt('jsrgtuwei'), '获得攻击范围内任意名角色的各一张牌。然后回合结束时这些角色中未受过伤害的角色依次获得你的一张牌。', (card, player, target) => {
                        return player.inRange(target) && target.countGainableCards(player, 'he') > 0;
                    }, [1, Infinity]).set('ai', target => {
                        var player = _status.event.player;
                        return get.effect(target, {
                            name: 'shunshou'
                        }, player, player);
                    }).set('damage', player.hasCard(card => {
                        return player.hasValueTarget(card) && get.tag(card, 'damage');
                    }, 'hs'));
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets.slice();
                        targets.sortBySeat();
                        player.logSkill('jsrgtuwei', targets);
                        player.gainMultiple(result.targets, 'he');
                        player.addTempSkill('jsrgtuwei_backfire');
                        player.markAuto('jsrgtuwei_backfire', targets);
                    }
                },
                subSkill: {
                    backfire: {
                        audio: "jsrgtuwei",
                        trigger: {
                            player: "phaseEnd",
                        },
                        charlotte: true,
                        onremove: true,
                        forced: true,
                        filter: function (event, player) {
                            return player.getStorage('jsrgtuwei_backfire').some(target => {
                                return !target.getHistory('damage').length && target.isIn();
                            });
                        },
                        content: function () {
                            'step 0'
                            var targets = player.getStorage('jsrgtuwei_backfire').filter(target => {
                                return !target.getHistory('damage').length && target.isIn();
                            });
                            event.targets = targets.sortBySeat();
                            'step 1'
                            var target = targets.shift();
                            if (target.isIn() && player.countGainableCards(target, 'he')) {
                                target.line(player);
                                target.gainPlayerCard(player, true, 'he');
                            }
                            if (player.countCards('he') && targets.length) event.redo();
                        },
                        ai: {
                            effect: {
                                player: function (card, player, target) {
                                    if (player != target && get.tag(card, 'damage') && target && player.getStorage('jsrgtuwei_backfire').contains(target) && !target.getHistory('damage').length) return [1, 1, 1, 0];
                                },
                            },
                        },
                        sub: true,
                        parentskill: "jsrgtuwei",
                    },
                },
            },
            jsrgbiaozhao: {
                audio: 2,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                filter: function (event, player) {
                    return game.countPlayer(current => current != player) >= 2;
                },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt2('jsrgbiaozhao'), lib.filter.notMe, 2).set('ai', target => {
                        var player = _status.event.player;
                        var att = get.attitude(player, target);
                        if (!ui.selected.targets.length) return att * (Math.sqrt(target.countCards('hs')) + 0.1);
                        return -att / Math.sqrt(target.countCards('hs') + 0.1);
                    }).set('targetprompt', ['用牌无限制', '打你变疼']);
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets;
                        player.logSkill('jsrgbiaozhao', targets);
                        player.addTempSkill('jsrgbiaozhao_syujin', {
                            player: ['phaseBegin', 'die']
                        });
                        if (!player.storage.jsrgbiaozhao_syujin) player.storage.jsrgbiaozhao_syujin = [];
                        player.storage.jsrgbiaozhao_syujin.push(targets);
                        targets[0].addSkill('jsrgbiaozhao_A');
                        targets[0].markAuto('jsrgbiaozhao_A', [targets[1]]);
                        targets[1].addSkill('jsrgbiaozhao_B');
                        targets[1].addMark('jsrgbiaozhao_B' + player.playerid, 1, false);
                        targets[1].markAuto('jsrgbiaozhao_B', [player]);
                    }
                },
                subSkill: {
                    syujin: {
                        charlotte: true,
                        onremove: function (player, skill) {
                            var list = player.storage.jsrgbiaozhao_syujin;
                            for (var targets of list) {
                                targets[0].unmarkAuto('jsrgbiaozhao_A', [targets[1]]);
                                targets[1].unmarkAuto('jsrgbiaozhao_B', [player]);
                                delete targets[1].storage['jsrgbiaozhao_B' + player.playerid];
                                if (!targets[0].getStorage('jsrgbiaozhao_A')) targets[0].removeSkill('jsrgbiaozhao_A');
                                if (!targets[1].getStorage('jsrgbiaozhao_B')) targets[1].removeSkill('jsrgbiaozhao_B');
                            }
                            delete player.storage.jsrgbiaozhao_syujin;
                        },
                        sub: true,
                        parentskill: "jsrgbiaozhao",
                    },
                    A: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        marktext: "表",
                        intro: {
                            content: "对$使用牌无次数和距离限制",
                        },
                        mod: {
                            targetInRange: function (card, player, target) {
                                if (player.getStorage('jsrgbiaozhao_A').contains(target)) return true;
                            },
                            cardUsableTarget: function (card, player, target) {
                                if (player.getStorage('jsrgbiaozhao_A').contains(target)) return true;
                            },
                        },
                        sub: true,
                        parentskill: "jsrgbiaozhao",
                    },
                    B: {
                        trigger: {
                            source: "damageBegin1",
                        },
                        charlotte: true,
                        forced: true,
                        onremove: function (player, skill) {
                            for (var i in player.storage) {
                                if (i.indexOf('jsrgbiaozhao_B') == 0) delete player.storage[i];
                            }
                        },
                        filter: function (event, player) {
                            return event.card && player.getStorage('jsrgbiaozhao_B').contains(event.player);
                        },
                        content: function () {
                            trigger.num += player.countMark('jsrgbiaozhao_B' + trigger.player.playerid) || 1;
                        },
                        mark: true,
                        marktext: "召",
                        intro: {
                            content: function (storage, player) {
                                var str = '';
                                for (var target of storage) {
                                    str += '对' + get.translation(target) + '使用牌造成的伤害+' + player.countMark('jsrgbiaozhao_B' + target.playerid);
                                }
                                return str;
                            },
                        },
                        sub: true,
                        parentskill: "jsrgbiaozhao",
                    },
                },
            },
            jsrgyechou: {
                audio: 2,
                trigger: {
                    player: "die",
                },
                forceDie: true,
                direct: true,
                skillAnimation: true,
                animationColor: "wood",
                content: function () {
                    'step 0'
                    player.chooseTarget(get.prompt2('jsrgyechou'), lib.filter.notMe).set('ai', target => {
                        var player = _status.event.player;
                        return -get.attitude(player, target);
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.logSkill('jsrgyechou', target);
                        target.addSkill('jsrgyechou_effect');
                        target.addMark('jsrgyechou_effect', 1, false);
                    }
                },
                subSkill: {
                    effect: {
                        trigger: {
                            player: "damageBegin3",
                        },
                        filter: function (event, player) {
                            return event.num >= player.hp;
                        },
                        forced: true,
                        charlotte: true,
                        onremove: true,
                        content: function () {
                            trigger.num *= 2 * player.countMark('jsrgyechou_effect');
                        },
                        mark: true,
                        marktext: "仇",
                        intro: {
                            content: "当你受到伤害值不小于体力值的伤害时，此伤害翻&倍",
                        },
                        ai: {
                            effect: {
                                target: function (card, player, target) {
                                    if (get.tag(card, 'damage')) {
                                        if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                                        if (target.hp == 1) return 2;
                                    }
                                },
                            },
                        },
                        sub: true,
                        parentskill: "jsrgyechou",
                    },
                },
            },
            jsrgcangchu: {
                audio: "recangchu",
                trigger: {
                    global: "phaseJieshuBegin",
                },
                filter: function (event, player) {
                    if (player.hasSkill('jsrgshishou_blocker')) return false;
                    return player.getHistory('gain').length;
                },
                direct: true,
                content: function () {
                    'step 0'
                    var num = 0;
                    player.getHistory('gain', evt => {
                        num += evt.cards.length;
                    });
                    event.num = num;
                    player.chooseTarget(get.prompt('jsrgcangchu'), '令至多' + get.cnNumber(num) + '名角色各摸' + get.cnNumber(num > game.countPlayer() ? 2 : 1) + '张牌', [1, num]).set('ai', target => {
                        var player = _status.event.player;
                        return get.attitude(player, target) / Math.sqrt(target.countCards('hs') + 1);
                    });
                    'step 1'
                    if (result.bool) {
                        var targets = result.targets.slice();
                        targets.sortBySeat();
                        player.logSkill('jsrgcangchu', targets);
                        game.asyncDraw(targets, num > game.countPlayer() ? 2 : 1);
                        game.delayex();
                    }
                },
            },
            jsrgshishou: {
                audio: "reshishou",
                trigger: {
                    player: "useCard",
                },
                forced: true,
                filter: function (event, player) {
                    return event.card.name == 'jiu';
                },
                group: "jsrgshishou_burn",
                content: function () {
                    'step 0'
                    player.draw(3);
                    player.addTempSkill('jsrgshishou_nouse');
                },
                mod: {
                    aiOrder: function (player, card, num) {
                        if (card.name == 'jiu') return 0.01;
                    },
                },
                ai: {
                    effect: {
                        "player_use": function (card, player, target) {
                            if (card.name == 'jiu') return [1, 1];
                        },
                    },
                },
                subSkill: {
                    nouse: {
                        charlotte: true,
                        mod: {
                            cardEnabled: function (card, player) {
                                return false;
                            },
                            cardUsable: function (card, player) {
                                return false;
                            },
                            cardSavable: function (card, player) {
                                return false;
                            },
                        },
                        mark: true,
                        marktext: "失",
                        intro: {
                            content: "喝醉了，不能再使用牌",
                        },
                        sub: true,
                        parentskill: "jsrgshishou",
                    },
                    burn: {
                        audio: "reshishou",
                        trigger: {
                            player: "damageEnd",
                        },
                        forced: true,
                        filter: function (event, player) {
                            return event.nature == 'fire';
                        },
                        content: function () {
                            player.addTempSkill('jsrgshishou_blocker', {
                                player: 'phaseEnd'
                            });
                        },
                        sub: true,
                        parentskill: "jsrgshishou",
                    },
                    blocker: {
                        charlotte: true,
                        mark: true,
                        marktext: "守",
                        intro: {
                            content: "〖仓储〗失效直到下回合结束",
                        },
                        sub: true,
                        parentskill: "jsrgshishou",
                    },
                },
            },
            jsrghujian: {
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                forced: true,
                locked: false,
                filter: function (event, player) {
                    return event.name != 'phase' || game.phaseNumber == 0;
                },
                content: function () {
                    player.drawShadow('chixueqingfeng', 'spade', 6);
                },
                group: ['jsrghujian_gain', 'jsrghujian_use'],
                subSkill: {
                    gain: {
                        trigger: {
                            global: 'phaseEnd'
                        },
                        filter: function (event, player) {
                            if (ui.discardPile.childNodes.length <= 0) return false;
                            var play = false,
                                card = false;
                            game.hasPlayer((current) => {
                                if (current.hasSkill('jsrghujian_r')) play = true;
                            });
                            var card = get.discardPile(function (card) {
                                return card.name == 'chixueqingfeng';
                            });
                            if (card) card = true;
                            return play && card;
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            var name;
                            var play = game.hasPlayer(current => {
                                if (current.hasSkill('jsrghujian_r')) {
                                    name = current;
                                    return true;
                                };
                            });
                            if (play) {
                                event.name = name;
                                player.chooseBool('是否令' + get.translation(name) + '获得【赤血青峰】').set('ai', () => {
                                    var player = _status.event.player;
                                    var target = _status.currentPhase;
                                    return get.attitude(player, target) > 0;
                                });
                            }
                            'step 1'
                            if (result.bool) {
                                var card = get.discardPile(function (card) {
                                    return card.name == 'chixueqingfeng';
                                });
                                if (card) event.name.gain(card, 'gain2');
                            }
                        }
                    },
                    use: {
                        trigger: {
                            global: ['useCard', 'respond'],
                        },
                        forced: true,
                        charlotte: true,
                        popup: false,
                        silent: true,
                        content: function () {
                            'step 0'
                            game.hasPlayer(current => {
                                if (current.hasSkill('jsrghujian_r')) current.removeSkill('jsrghujian_r');
                            });
                            'step 1'
                            trigger.player.addTempSkill('jsrghujian_r', 'phaseBegin');
                        }
                    },
                    r: {
                        charlotte: true
                    }
                },
            },
            jsrgshili: {
                enable: 'phaseUse',
                viewAs: {
                    name: "juedou",
                },
                usable: 1,
                filterCard: function (card) {
                    return get.type(card) == 'equip';
                },
                position: 'h',
                ai: {
                    result: {
                        player: 0.6
                    },
                    order: 16,
                }
            },
            jsrgguiji: {
                enable: 'phaseUse',
                usable: 1,
                filter: function (event, player) {
                    return game.hasPlayer((current) => lib.skill.jsrgguiji.filterTarget(null, player, current));
                },
                filterTarget: function (card, player, target) {
                    return target != player && target.countCards('h') < player.countCards('h') && target.sex == 'male';
                },
                content: function () {
                    player.swapHandcards(target);
                    target.addSkill('jsrgguiji_husband');
                },
                ai: {
                    order: 1,
                    expose: 0.3,
                    result: {
                        target: function (player, target) {
                            if (get.attitude(player, target) < 0 && player.countCards('h', {
                                name: 'jsrg_ying'
                            }) > target.countCards('h') && target.countCards('h') > player.countCards('h', function (card) {
                                return get.name(card) != 'jsrg_ying'
                            }) && player.countCards('h', {
                                name: 'jsrg_ying'
                            }) > player.countCards('h', function (card) {
                                return get.name(card) != 'jsrg_ying'
                            }) && !player.countCards('h', {
                                name: 'tao'
                            }) && !player.countCards('h', {
                                name: 'jiu'
                            })) {
                                if (get.mode() == 'doudizhu' && target.identify == 'zhu' && target.countCards('j') >= 1 && target.countCards('h') < 2) return 0;
                                return -1;
                            }
                            if (get.attitude(player, target) > 0 && player.countCards('h', function (card) {
                                return get.name(card) != 'jsrg_ying'
                            }) >= target.countCards('h')) return 1;
                        },
                    },
                },
                group: 'jsrgguiji_swap',
                subSkill: {
                    husband: {
                        charlotte: true
                    },
                    swap: {
                        trigger: {
                            global: 'phaseUseEnd'
                        },
                        filter: function (event, player) {
                            return event.player != player && event.player.hasSkill('jsrgguiji_husband');
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            trigger.player.removeSkill('jsrgguiji_husband');
                            player.chooseBool('闺忌：是否和' + get.translation(trigger.player) + '交换手牌？').set('ai', () => {
                                var player = _status.event.player;
                                var target = _status.currentPhase;
                                return target.countCards('h') - player.countCards('h');
                            })
                            'step 1'
                            if (result.bool) {
                                player.swapHandcards(trigger.player);
                            }
                        }
                    }
                },
            },
            jsrgjiaohao: {
                trigger: {
                    player: 'phaseZhunbeiBegin'
                },
                forced: true,
                locked: false,
                filter: function (event, player) {
                    return 5 - player.countDisabled() - player.countCards('e') > 0;
                },
                content: function () {
                    var number = Math.ceil((5 - player.countDisabled() - player.countCards('e')) / 2);
                    player.drawShadow('jsrg_ying', 'spade', 1, number);
                },
                global: 'jsrgjiaohao_input',
                subSkill: {
                    input: {
                        enable: "phaseUse",
                        filter: function (event, player) {
                            if (player.hasSkill('jsrgjiaohao_f') || player.hasSkill('jsrgjiaohao')) return false;
                            return player.countCards('h', {
                                type: 'equip'
                            }) && game.hasPlayer(function (current) {
                                return current.hasSkill('jsrgjiaohao');
                            });
                        },
                        filterCard: function (card) {
                            return get.type(card) == 'equip';
                        },
                        filterTarget: function (card, player, target) {
                            if (!target.hasSkill('jsrgjiaohao') || target == player) return false;
                            return target.isEmpty(get.subtype(card));
                        },
                        selectCard: 1,
                        log: false,
                        delay: false,
                        discard: false,
                        lose: false,
                        position: "h",
                        content: function () {
                            "step 0"
                            player.logSkill('jsrgjiaohao', event.target);
                            player.addTempSkill('jsrgjiaohao_f', 'phaseUseEnd');
                            player.give(cards, event.target);
                            "step 1"
                            if (event.target.getCards('he').contains(cards[0])) {
                                event.target.equip(cards[0]);
                            } else {
                                event.finish();
                            }
                        },
                        ai: {
                            expose: 0.1
                        },
                    },
                    f: {
                        charlotte: true
                    },
                },
            },
            g_ying: {
                trigger: {
                    global: ["loseEnd", "cardsDiscardEnd"],
                },
                cardSkill: true,
                filter: function (event, player) {
                    var cs = event.cards;
                    for (var i = 0; i < cs.length; i++) {
                        if (cs[i].name.indexOf('jsrg_ying') == 0 && get.position(cs[i], true) == 'd') return true;
                    }
                    return false;
                },
                forced: true,
                popup: false,
                content: function () {
                    var list = [];
                    var cs = trigger.cards;
                    for (var i = 0; i < cs.length; i++) {
                        if (cs[i].name.indexOf('jsrg_ying') == 0 && get.position(cs[i], true) == 'd') {
                            list.push(cs[i]);
                        }
                    }
                    game.cardsGotoSpecial(list);
                    game.log(list, '已被移出游戏');
                },
            },
        },
"card": {
            jsrgjudge_card: {
                type: 'delay',
                judge: function (card) {
                    return 0;
                },
                nojudge: true,
                effect: function () { },
                ai: {
                    basic: {
                        order: 1,
                        useful: 1,
                        value: 8,
                    },
                    result: {
                        target: 1
                    },
                }
            },
            jsrg_ying: {
                type: 'basic',
                suit: 'spade',
                fullskin: true,
                notarget: true,
                enable: false,
                respond: false,
                content: function () { },
                global: 'g_ying',
                ai: { value: 0 },
            },
        }
};
}
