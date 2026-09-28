import { game, ui, _status, ai, lib, get } from "noname";
import { swTool } from "../../main/swTool.js";
const ea = swTool.audioSrc;
import character from "./character.js";
import skill from "./skill.js";
import card from "./card.js";
const DIY = {
	name: 'swDIY',
	connect: true,
	character,
	skill,
	card: card.card,
	characterSubstitute: {
		swq_xindong: [
			["swq_xindong_shadow", ["img: swq_xindong_shadow.jpg"]],
		],
		swlu_xindong: [
			["swlu_xindong_shadow", ["img: swlu_xindong_shadow.jpg"]],
		],
		swe_congyu: [
			["swe_congyu_weapon", ["img: swe_congyu_weapon.jpg"]],
			["swe_congyu_fail", ["img: swe_congyu_fail.jpg"]],
			["swe_congyu_archive", ["img: swe_congyu_archive.jpg"]],
		],
		swe_shenshanshi: [
			["swe_shenshanshi_guiji", ["img: swe_shenshanshi_guiji.jpg"]],
			["swe_shenshanshi_fail", ["img: swe_shenshanshi_fail.jpg"]],
		],
		swyz_shiqikuangsan: [
			["swyz_shiqikuangsan_lingzhuang", ["img: swyz_shiqikuangsan_lingzhuang.jpg"]],
		],
	},
	characterSort: {
		swDIY: {
			swQQGroup: ["swq_aoliao", "swq_lugushou", "swq_xindong", "swq_sunyuning", "swq_florian", "swq_shouwang", "swq_muxue", "swq_tianshangke", "swq_suier", "swq_xietaobao", "swq_shuisi", "swq_fenglinghuoshan", "swq_xuanchang"],
			swQQGroupLu: ["swlu_lugushou", "swlu_sunyuning", "swlu_xindong", "swlu_tianshangke", "swlu_shuisi"],
			swguise: ["swx_lugushou", "swx_tianshangke", "swx_shuisi", "swx_fenglinghuoshan"],
			swyigou: ["swyg_jushou", "swyg_guojia", "swyg_xunyu", "swyg_caojinyu", "swyg_hanxiandi", "swyg_xiaoqiao", "swyg_sunluyu", "swyg_liubei", "swyg_zhangwen"],
			sweryou: ["swe_nanali", "swe_katixiya", "swe_yidemeita", "swe_congyu", "swe_hequanfeiai", "swe_shenshanshi", "swe_minglaibaiyu", "swe_shuisi", "swe_fuxuan", "swe_xiaochun"],
			swyuechao: ["swyc_lugushou", "swyc_os"],
			swbiye: ["swby_lugushou", "swby_shouwang"],
			swjwzaohua: ["swjw_lugushou", "swjw_tianshangke"],
			swyz: ["swyz_yuanyizhezhi", "swyz_bentiaoerya", "swyz_shiqikuangsan", "swyz_bingyachuansisinai", "swyz_wuheqinli", "swyz_xinggongliucan", "swyz_jingyeqizui", "swyz_bawushuangjiang", "swyz_bawuyejushi", "swyz_bawuxixian", "swyz_youxiaomeijiu", "swyz_yedaoshenshixiang"],
		}
	},
	//武将介绍
	characterIntro: {
		swq_aoliao: '又名老弟，无名杀主群创始人之一。唉，今天又被朗神鸽了。',
		swq_lugushou: '又名🦌🥁✋，鹿关手。闹麻了。',
		swq_xindong: '太阳系地球人，未知年-未知年，每晚准时开房，快来挨打吧！',
		swq_sunyuning: '逃跑男，坑队友男。黑猫白猫，不如孙玉凝喵~',
		swq_florian: '旧时代的阴兵房主。',
		swq_shouwang: '孩子们，牢大可以复活了。',
		swq_tianshangke: '天上客自设。',
		swq_suier: '岁儿，原名冰糖不是⑨。穿梭于时间的少女，拥有回溯的能力。',
		swq_xietaobao: '执子之手，与子偕老。',
		swq_shuisi: '给你一记大肘击。',
		swq_fenglinghuoshan: '二次元瑙玛了。',
		swq_xuanchang: '来自玄敞港区的艾伦·萨姆纳级驱逐舰——拉菲II，舷号DD-724。在冲绳海域挨了数架特攻机与炸弹的轮番撞击仍未沉没，由此得名「不死之船」。平日里一副没睡醒的模样，炮声一响却比谁都精神。',

		swx_lugushou: '我说强而不阴你二龙吗？',
		swx_shuisi: "我说让我先发育一会",
		swx_fenglinghuoshan: " ",

		swlu_lugushou: '又名🦌🥁✋，鹿关手。哎，被做局了孩子们。前辈们，请把力量借给我吧！',
		swlu_sunyuning: '其实...人家是小男生！才不会坑人什么的呢~',
		swlu_xindong: '鹿帝心动，每夜准时开房，快来挨打吧！',
		swlu_shuisi: "三个技能，治好你十八年的羊尾。",
		swlu_tianshangke: "卸甲，卸甲！！",
		swyg_hanxiandi: '汉献帝刘协（181年4月2日—234年4月21日），字伯和，东汉末代皇帝。' +
			'刘协出生时母亲王美人遭何皇后毒杀，于是董太后亲自抚养刘协，号称“董侯”。初平元年（190年），随董卓迁往长安。兴平二年（195年），车驾东归。护驾途中，诸将专权，相互攻伐，肆意妄为，最终使得朝廷在建安元年（196年）被曹操控制。同年，迁都许县，正式挟天子以令诸侯。建安十三年（208年），刘协罢免三公，册立曹操为丞相，后又封曹操为魏公。建安二十五年（220年），魏王曹操薨逝，曹丕逼迫刘协禅位，正式建立曹魏，刘协被废为山阳公。',
		swyg_zhangwen: '张温（？—191年11月5日），字伯慎。南阳穰（今河南邓县）人，东汉末年大臣。' +
			'张温年少时负盛名，曾被曹腾提拔，后升任大司农，成为帝国最高财政长官。中平元年（184年）二月，灵帝任命大司农张温为司空。中平二年（185年）八月，转任左车骑将军，率军征讨北宫伯玉。张温率军驻扎在美阳（今陕西武功西北），时边章、韩遂也进军美阳，张温与他们交战失利。后张温又派董卓率军前去讨伐羌族的先零部落。' +
			'中平三年（186年），灵帝任命张温为太尉，在京城以外任命三公，由张温开始。同年，征召张温回京城洛阳。中平四年（187年），李相如、马腾相继率军造反。灵帝见凉州叛军去而复归，始知张温并没有平定叛乱，当即免去他的太尉之职。' +
			'东汉献帝初平二年（191年），张温被董卓笞杀于市。',
		swe_katixiya: '卡提希娅是游戏《鸣潮》及其衍生作品中的角色。鸣式利维亚坦所创造的共鸣者。据传故乡在拂风水畔。凡于隐海修会任职的高阶教士，都会领受新的“名号”，传说中的“圣女”芙露德莉斯，领受新名前的本名是“卡提希娅”。但卡提希娅其实并非人们口中流传的岁主选中的圣女，而是由来自深海的鸣式“利维亚坦”创造的共鸣者。',
		swe_fuludelisi: '芙露德莉斯是游戏《鸣潮》及其衍生作品中的角色。本名卡提希娅，因鸣式"利维亚坦"的共鸣选择脱离凡人身份，其成长历程被揭示为多方势力操控的产物。在成为隐海修会"圣女"期间，曾于二十年前以自我献祭方式完成黑潮封印，该事件至今仍在游戏世界观中产生深远影响。档案资料暗示其神圣表象下保留着农家少女时期的性格特质，这在醉酒事件中得到戏剧化呈现。',
		swe_nanali: "娜娜莉·柯林斯是游戏《异环》中的主角，她外形可爱，佩戴眼镜，拥有红发与猫耳，常以黑色长款外套出镜。性格兼具领袖的严苛与伙伴的温情。其战斗技能伤害高、范围广，普通攻击为柯林斯秘传技法，变轨攻击为柯林斯·嗷呜术，终极技能为柯林斯·终极术可向前方挥出带有火焰效果的重拳。她还能发动“一代目的权柄”状态，获得无视重力限制行走于物体表面的能力",
		swe_yidemeita: "“古旧天剑·伊德梅塔”是《影之诗》第六弹卡包“天启契约”（2026年2月26日上线）中皇家职业的珍藏级卡片；其设计由画师こーやふ操刀，常被玩家昵称为“皇妈妈”或“伊德梅塔剑”。‌‌",
		swe_congyu: "丛雨，恋爱冒险游戏《千恋*万花》及其衍生作品中的角色，寄宿于神刀“丛雨丸”中的灵魂一般的存在。虽然存在了近500年，普通人却看不到她。有着和外表一样孩子气的一面，也拥有和年龄相符的成熟的一面。虽然是不可思议的存在，却很害怕幽灵。",
		swe_hequanfeiai: "和泉妃爱是Madosoft开发的恋爱冒险游戏《常軌脱離Creative》及其衍生作品的女主角，外文名いずみひより（Izumi Hiyori），别名小泉妃爱（艺名）、妃爱、富婆妹，由柳ひとみ（PC版）和户田惠（移植版及动画版）配音。该角色设定为16岁女性，生日9月5日，是主人公智宏的妹妹兼童星出身的声优界代表人物，擅长家务与猜拳，尤其偏爱哥哥烹制的炒饭",
		swe_minglaibaiyu: "鸣濑白羽是Key社游戏《Summer Pockets》及其增强版《Summer Pockets REFLECTION BLUE》中的核心女主角，17岁，身高155cm，由声优小原好美配音。她是岛上一位不常表露感情、怕生的少女，亲近的人只有祖父鸣濑小鸠。拥有预知未来片段的家族遗传能力，尤其预见到自己将在祭典中溺亡，视其为诅咒。父母双亡、朋友坠崖等创伤使她形成自己是带来不幸的存在的自我认知，刻意与他人保持距离。通过男主角鹰原羽依里的陪伴，她逐渐敞开心扉，最终以行动打破宿命。在后续剧情中她在生下女儿羽未后去世，女儿通过时间轮回能力拯救了她。在Key社25周年角色总选举中位列第5名。",
		swe_shenshanshi: "神山识，女，游戏《Summer Pockets》衍生作《Summer Pockets REFLECTION BLUE》中追加的角色，首次登场于2020年6月26日发行的PC版，由ファイルーズあい配音。作为升级版新增女主角，她的路线与野村美希、水织静久晋升为可攻略角色同步实装。 神山识生日为7月4日，年龄14岁，身高144cm，体重36kg，三围73/54/74，是一名来到鸟白岛、喜欢旅行的少女，在全国各地收集鬼的传说。她以“喂，你知道这个岛上住着的鬼吗？”为口头禅，追寻鬼的踪迹，实则以之窥探风土。虽自称首次登岛，却似熟知地形，出没于隐秘之境。生存技能卓越，主食寻觅有道，然岛上屡现饿倒之态。唯日式饭团可驯服其胃，是其喜欢的食物。 在故事中，神山识作为意识体，其存在是整座小岛故事乃至AKLA和pocket线得以存在的基石。在面临消除姬公主历史后拯救所有岛民还是留在当下的抉择时，她选择了前者，最终被羽依里从海中救出。",
		swyc_lugushou: "传说月不是月亮的月，潮也不是潮水的潮~",
		swyc_os: "前辈今天还是好女孩吗？",
		swby_lugushou: "懂你意思。",
		swby_shouwang: "我是脆皮别打我。",
		swjw_lugushou: "孩子们我有最新的动图技术。",
		swjw_tianshangke: "孩子们我不装了我是阴间武将。",
		swyz_yuanyizhezhi: "鸢一折纸，日本轻小说《约会大作战》及其衍生作品的女主角之一。11月11日出生，A型血，身高152厘米，三围75/55/79厘米，有着一头白发，是像人偶一样的无性格少女，是五河士道名义上的女友。陆上自卫队的对精灵部队AST的队员，阶级是上士。父母因精灵现身而死，极度憎恨精灵，以消灭精灵为目标而奋斗着。自身精灵化后，借用<十二之弹>回到过去，发现了父母死亡真相而精神崩溃，导致灵结晶反转。对整个天宫市展开无差别的全方位攻击，之后被士道拯救并改变过去。",
		swyz_bentiaoerya: "本条二亚，女，轻小说《约会大作战》及其衍生作品中的角色。世界上第二个被确认的精灵，知晓初始精灵的存在。在小说第7卷起就被提及，在小说第13卷正式登场，是在士道面前出现的第九位精灵。拥有一头灰色短发，蓝绿色眼睛，常佩戴一副红色眼镜，自称“只爱二次元”。约28年前成为精灵，年龄约45岁，因为成为精灵肉体停止增长而保留了17岁的外貌。生活自理能力极差，是个酒鬼。",
		swyz_shiqikuangsan: "时崎狂三，日本轻小说《约会大作战》及其衍生作品中的角色。是士道所遭遇的唯一没有在初次就封印灵力的“最恶的精灵”，在偶然现身于人间的众多精灵当中，是能够从邻界以自己的意志现身的特异存在，甚至会有意地去杀人。为了有足够的灵力能让<刻刻帝>的“十二之弹”发动，回到三十年前始源精灵的出现并亲自解决她，而不停地杀人和吸收别人的时间。",
		swyz_bingyachuansisinai: "冰芽川四糸乃是轻小说《约会大作战》及其衍生作品中的角色，由野水伊织配音。作为第二位登场的精灵，其识别名为〈隐居者（Hermit）〉，灵装为饰有兔耳的绿色斗篷〈神威灵装·四番（El）〉，天使为冰结傀儡（Zadkiel），可操控冰水并展开冻结灵力事物的寒气结界。外表为蓝发法国娃娃般少女，携带有独立人格的兔子手偶四糸奈",
		swyz_wuheqinli: "五河琴里，轻小说《约会大作战》及其衍生作品中的女主角之一。五河士道的义妹，精灵组织“Ratatoskr”的司令官，同时还是拥有精灵之力的人类，识别代号〈炎魔（Efreet）〉。能够通过变换黑白两色的发带来转变性格，白色发带为粘人爱哭的“妹妹模式”；黑色发带为抖S、毒舌的“司令官模式”。从小与哥哥士道一同长大，彼此之间培养了良好的感情，在士道眼中是一个粘人的妹妹。喜欢士道，对士道的好感值一直都处于最高状态。",
		swyz_xinggongliucan: "星宫六喰（ほしみや むくろ），橘公司所著轻小说《约会大作战》及其衍生作品中的角色。出现在五河士道面前的第十个精灵，登场于小说第十四卷。拉塔托斯克首次侦测到的精灵，拥有着金黄色长卷发及琥珀般的眼睛，身材娇小但胸部丰满。灵装是一件粉紫色旗袍。语气古风。因为封闭了自己的心灵而无法理解寂寞的心情，对在地球生活毫无兴趣。十分重视她的金色长发。",
		swyz_jingyeqizui: "镜野七罪，橘公司所著轻小说《约会大作战》及其衍生作品中的角色。由真野步配音。五河士道遇见的第七只精灵，有着像在绿色的长发下嵌着翠玉石般瞳孔的20多岁左右的如同人造品般的女性外表，但这是靠灵力变身后的样子。其本体则是一个和四糸乃同样娇小的萝莉体型，有着一头未经梳理而显得蓬松散乱的绿发。心理过分自卑，对任何事物都抱有消极的态度，亦有十分严重的被害妄想症，心里承受能力极差，个性孤僻。",
		swyz_bawuyejushi: "八舞耶俱矢，轻小说《约会大作战》及其衍生作品中的角色。第五位登场的精灵，是被称为“狂战士（Berserk）”的风之精灵中的一个。有着橙色的头发和水银色的瞳孔，头发在脑后盘起，体态较为纤细，个性活泼，总是一种女王般高高在上高傲强势的态度，还会用一种像戏剧般的措辞说话，不过这只是为了让自己有作为精灵的威严而故意为之。在情绪激动时会变回普通的说话方式，兴奋时有“～da shi”作为语尾的口癖。",
		swyz_bawuxixian: "八舞夕弦，轻小说《约会大作战》及其衍生作品中的角色。第五位登场的精灵，是被称为“狂战士”的风之精灵中的一个。金橙色的长发绑成三股长辫的少女，体态较为丰满，有着和八舞耶俱矢比起来更好的身材，但常常无精打采似的眯起眼睛,与耶倶矢个性相反般的冷静温驯。灵装的枷锁位置和耶俱矢的相反，绑在左手腕和左脚腕。谈吐的方式很文静并有自己的方式，在说话的开头会以两个字来表示主旨，以这样奇特的方式说话。",
		swyz_bawushuangjiang: "“八舞”是小说第5卷中出现在五河士道面前的精灵，操纵风的双子精灵之一。在世界各地现界的双子精灵，原本是同一个精灵，但在某次现界时分裂成耶倶矢和夕弦两个个体，虽然两者意识个体皆为独立，但严格来讲还算是同一个存在。两人都有著橘色的头发和水银般的眼睛，脸型更像同个模子刻的，但发型体型跟性格却是大不相同。",
		swyz_youxiaomeijiu: "诱宵美九，轻小说《约会大作战》及其衍生作品中的女主角之一。出现在五河士道面前的第六个精灵，识别名为Diva（歌姬） 平时生活中是一名学生，有着紫银的头发和浅紫色的瞳，以及说话不紧不慢的特点。真实身份是和五河琴里一样被赋予精灵之力的人类。极度厌恶男性，非常喜欢女性，即百合的精灵。",
		swyz_yedaoshenshixiang: "夜刀神十香是日本轻小说《约会大作战》及其衍生作品中的女主角之一，识别代号为〈公主（Princess）〉，由井上麻里奈配音。作为首个与主角五河士道相遇的精灵，拥有及膝黑色长发与水晶色眼眸，因长期遭受人类攻击而产生敌意，后通过士道获得姓名并逐渐接纳人类世界。其灵装为紫色公主礼服造型的〈神威灵装·十番〉，天使为双刃巨剑〈鏖杀公〉，反转后显现魔王〈暴虐公〉",
		swe_shuisi: " ",
		swe_fuxuan: "符玄是米哈游出品的游戏《崩坏：星穹铁道》及其衍生作品中的五星角色，命途为存护，战斗属性为量子。她是仙舟「罗浮」的太卜司之首，出身玉阙仙舟观星士世家，凭借额间法眼与穷观阵为仙舟占算航路、预卜吉凶，坚信自己所做的便是事情的最优解，一直等待着将军景元承诺的退位让贤。",
		swe_xiaochun: "小春，游戏《卡厄思梦境》中的角色。于《第七史诗》七周年和本家进行联动。就读于海军士官学院，是学生会成员。性格温柔，但一旦生气就会变得无人可挡。看似娇小甜美，实则是个超级大胃王，尤其喜欢甜食1。在游戏的“创伤单元码”玩法中，以她为例的剧情拥有多分支选择，会影响结局走向。",
	},
	//武将替换
	characterReplace: {
		//swq_lugushou: ["swlu_lugushou", "swq_lugushou"],
	},
	//翻译统一规范：
	//技能名用〖〗，牌名用【】，标记用“”，特殊区域的牌用「」
	translate: {
		swDIY: '云中守望',
		swQQGroup: 'Q群风云传',
		swQQGroupLu: 'Q群-鹿天帝包',
		swguise: '玫瑰血色包',
		swyigou: '异构奇英录',
		sweryou: '二元同人创',
		swyuechao: '假日月潮包',
		swbiye: '碧野栖鸾包',
		swjwzaohua: "剑挽造化篇",
		swyz: '约会大作战',

		//Q群风云传
		swq_aoliao: "奥利奥",
		swq_zhitian: "知天",
		swq_zhitian_backup: "知天",
		swq_zhitian_info: `①你可以将牌堆顶的牌当任意基本牌或普通锦囊牌使用，若此牌牌名不同于你使用的牌名，${get.poptip("swq_zhitian")}于本回合失效且你失去一点体力。②当你的体力值变化时，你可以观看牌堆顶X张牌（X为你变化后的体力值+2），并以任意顺序将牌置于牌堆顶或者牌堆底。`,
		swq_jincui: "尽瘁",
		swq_jincui_info: "限定技，出牌阶段，你可以失去1点体力并选择一名其他角色，然后亮出牌堆顶的七张牌，依次对其使用其中的【杀】。结算完毕后若该角色未因此死亡，则你失去1个“灯”，反之，若仍有未使用的牌，你可以从中选择一张并获得之。",
		swq_qideng: "七灯",
		swq_qideng_info: "锁定技，游戏开始时，你获得七个“灯”。当你进入濒死状态时，若你有“灯”，你须回复体力至1点并移除等同于回复量的“灯”（不足则全移除），否则你失去1点体力。",

		swq_shouwang: "守望",
		[`#${ea}swq_shouwang/swq_shouwang:die`]: "为了那孩子的...笑容...",
		swq_zhongyuan: "终愿",
		swq_zhongyuan_gain_backup: "终愿",
		swq_zhongyuan_info: `${get.poptip("rule_chihengji")}。①每名角色的出牌阶段限一次，其可以失去任意点体力，若如此做，其摸等量张牌，你获得等同其失去体力数两倍的“许愿值”（上限为12）并恢复1点体力。②若你的“许愿值”不小于1/2/3/4/5，你视为拥有${get.poptip("swq_houzai")}/${get.poptip("swq_lieqi")}/${get.poptip("swq_youquan")}/${get.poptip("swq_shengxi")}/${get.poptip("swq_shenguang")}。`,
		[`#${ea}swq_shouwang/swq_zhongyuan1`]: "寻求光的人们，以自己的手开辟道路吧！",
		[`#${ea}swq_shouwang/swq_zhongyuan2`]: "愿你们好运。",
		swq_shenguang: "神光",
		swq_shenguang_info: `${get.poptip("rule_chihengji")}，限定技。出牌阶段，你可以消耗5点“许愿值”并选择一名角色，若该角色已死亡，则令其以5点体力值复活，反之，令其恢复至5点体力；然后其获得“免疫”（直到下个回合开始免疫所有伤害）并摸三张牌。`,
		[`#${ea}swq_shouwang/swq_shenguang1`]: "现在，这些闪耀的人们凭借自己的力量向前迈进了一步。",
		swq_shengxi: "生息",
		swq_shengxi_info: `${get.poptip("rule_chihengji")}，限定技。当你即将死亡时，你可以消耗4点“许愿值”取消之并恢复体力至体力上限。`,
		[`#${ea}swq_shouwang/swq_shengxi1`]: "请悔改你们的愚行。",
		swq_youquan: "幽泉",
		swq_youquan_info: `${get.poptip("rule_chihengji")}，当你受到伤害后，你可以消耗3点“许愿值”令至多两名已受伤角色恢复1点体力。`,
		[`#${ea}swq_shouwang/swq_youquan1`]: "耀眼之光，倾注而下。",
		swq_lieqi: "烈祈",
		swq_lieqi_info: `${get.poptip("rule_chihengji")}，当你造成伤害后，你可以消耗2点“许愿值”令一名角色获得一个随机的伤害性技能直到其回合结束。`,
		[`#${ea}swq_shouwang/swq_lieqi1`]: "西边的耀眼野兽啊。",
		swq_houzai: "厚载",
		swq_houzai_info: `${get.poptip("rule_chihengji")}，每回合限一次，你可以消耗1点“许愿值”，将一张装备牌当做任意基本牌或普通锦囊牌使用或打出并摸两张牌。`,
		[`#${ea}swq_shouwang/swq_houzai1`]: "没有时间犹豫了。",
		swq_xinsui: "心随",
		swq_xinsui_info: "主公技，其他key势力角色的回合开始时，你获得1点“许愿值”。",

		swq_lugushou: '陆古寿',
		swq_duannian: '断念',
		swq_duannian_info: `持恒技，限定技，当你脱离濒死状态时，你可以选择依次执行至多X项：1.摸剩余选项张牌并回复1点体力；2.重置该技能并删除最后一个选项；3.获得一名其他角色的一个技能；4.升级${get.poptip("swq_jifeng")}。（X为距你上次发动此技能后进入濒死状态的次数）`,
		swq_jifeng: '讥讽',
		swq_jifeng_info: `出牌阶段，你可以摸一张牌并对自己造成1点伤害，然后与一名其他未处于${get.poptip("swq_jifeng")}失效状态的角色拼点，若你赢，你令其非锁定技失效直到其的下个回合开始；反之，你的非锁定技失效直到你的下个回合开始。若你因此技能进入濒死，你将体力值回复至1点。`,
		swq_jifeng_lv2: '讥讽2级',
		swq_jifeng_lv2_info: `出牌阶段，你可以摸两张牌并对自己造成1点伤害，然后与一名其他未处于${get.poptip("swq_jifeng")}失效状态的角色拼点，若你赢，你令其非Charlotte技失效直到其的下个回合开始；反之，你的非锁定技失效直到你的下个回合开始。若你因此技能进入濒死，你将体力值回复至1点。`,
		// swq_jifeng_lv3: '讥讽3级',
		// swq_jifeng_lv3_info: '出牌阶段，你可以摸两张牌并与一名其他未处于〖讥讽〗失效状态的角色拼点，若你赢，你令其非Charlotte技失效直到其的下个回合开始；反之，你的〖绝境〗〖讥讽〗失效直到你的下个回合开始。',
		swq_juejing: '绝境',
		swq_juejingGlobal: '绝境',
		swq_juejing_info: `此技能仅失效时生效。每回合限一次，当你进入濒死状态时，你可以将体力回复至1点并摸两张牌，然后重置你因${get.poptip("swq_jifeng")}的失效状态。`,//②出牌阶段限一次，你可以对自己造成1点伤害。
		swq_juejingGlobal_info: `此技能仅失效时生效。①每回合限一次，当你进入濒死状态时，你可以将体力回复至1点并摸两张牌，然后重置你因${get.poptip("swq_jifeng")}的失效状态。②出牌阶段限一次，你可以对自己造成1点伤害。`,
		swq_juejing_lv2: '绝境',
		swq_juejing_lv2_info: `此技能仅失效时生效。每回合限两次，当你进入濒死状态时，你可以将体力回复至1点并摸两张牌，然后重置你因${get.poptip("swq_jifeng")}的失效状态。`,//②出牌阶段限一次，你可以对自己造成1点伤害。

		swq_xindong: '心动',
		swq_qingnian: '倾念',
		visible_swq_qingnian: '倾念',
		swq_qingnian_info: '转换技。①游戏开始时，你可以转换此技能状态；②每回合限三次，当你不因使用而失去手牌时，你可以：阳，将手牌摸至体力上限并随机明置一名其他角色的X张手牌；阴，明置一张手牌并弃置一名其他角色的至多X张牌，然后你将被弃置的牌以任意顺序置于牌堆顶或牌堆底。（X为你本次失去牌的数量）',
		swq_lunqi: '论契',
		swq_lunqi_info: '出牌阶段限一次，你可以弃置一种花色的所有手牌，令所有角色参与议事（若你有明置的手牌，则你只能使用明置的手牌议事），然后你可以交换任意两名角色的至多X张手牌。（X为红黑意见之差的绝对值）',
		swq_xinci: '心赐',
		visible_swq_xinci: '心赐',
		swq_xinci_info: '主公技，其他key势力角色的回合开始时，你可以将一张手牌交给该角色并明置之。然后此回合结束时，若其于此回合没有回复过体力，你失去1点体力。',
		swq_sunyuning: '孙玉凝',
		swq_wudu: '巫毒',
		swq_wudu_info: '①游戏开始时，你将游戏中存在的各种身份的身份牌各八张加入牌堆。你可以重铸身份牌。摸到身份牌的效果对你无效。②出牌阶段限一次，你可以向牌堆中添加X张任意花色和点数的一种身份牌（X为存活人数）。',
		swq_yuyin: '御因',
		swq_yuyin_info: '持恒技，其他角色的回合结束时，若本回合有身份牌进入弃牌堆，你观看其手牌并可以视为使用其中一张牌（其手牌中的身份牌根据以下规则于此流程中视为：主公，【推心置腹】；忠臣，【无中生有】；反贼，【奇正相生】；内奸，【万箭齐发】；其他，【铁索连环】），然后你摸一张牌。',
		swq_florian: 'Florian',
		swq_yinbing: '阴兵',
		swq_yinbing_info: '锁定技，你的回合外，当有角色即将发生不因此技能的死亡时，你摸一张牌并取消之。准备阶段，你可以令一名体力值不大于0的角色执行濒死阶段；然后所有体力值不大于0的角色死亡。',
		swq_lingcan: '凌残',
		swq_lingcan_info: '锁定技。①当你使用牌时，你令所有体力值小于你的其他角色不能使用或打出牌响应此牌；你对体力值大于你的角色造成的伤害+1。②每回合限一次，当有其他角色进入濒死状态时，你可以将一张基本牌当做冰【杀】对其使用，若你以此法造成伤害，你恢复1点体力，反之，其恢复1点体力。',
		swq_tianshangke: '天上客',
		swq_gushou: '固守',
		swq_gushou_info: '锁定技。你废除武器栏。每回合每名角色限一次，当你攻击范围内的角色受到伤害后，你摸一张牌，然后选择令你至其他角色的相互距离+1或-1（每回合每名角色限一次）。',
		swq_buce: '步测',
		swq_buce_info: '转换技，每名角色的回合开始时，你可以：阳，摸X张牌并令你至其他角色的距离-X（X为你与当前回合角色的距离）；阴，弃置至多Y张牌并令你至其他角色的距离+Y（Y为你弃置的牌数且至多为你的体力上限）。',
		swq_xiaobing: '销兵',
		swq_xiaobing_info: '当你失去手牌区内的武器牌时，你摸等同于这些牌中字数最大的牌。',
		swq_tsk_distance: '距离修正',
		swq_suier: "岁儿",
		[`#${ea}swq_suier/swq_suier:die`]: "时间到了……",
		swq_suier_prefix: "神",
		swq_wanxiang: "万象",
		swq_wanxiang_info: "连招技（基本牌+锦囊牌）。你可以令一名角色将X张牌置于你的武将牌上称为「象」（X为此锦囊牌的目标数），然后若你的「象」数量大于场上存活人数，此技能于本回合失效。你的回合开始时，你获得所有「象」，然后卜算等量张牌。",
		[`#${ea}swq_suier/swq_wanxiang1`]: "来啦！",
		[`#${ea}swq_suier/swq_wanxiang2`]: "一起来玩吧！",
		swq_wendao: "问道",
		swq_wendao_info: "转换技，每回合每项各限一次，当你成为体力值不小于你的其他角色使用牌的目标后，你可以：阳，失去1点体力并视为使用一张无距离限制的雷【杀】；阴，回复1点体力并视为使用一张目标须包含自己的【铁索连环】。",
		[`#${ea}swq_suier/swq_wendao1`]: "轮到我了！",
		[`#${ea}swq_suier/swq_wendao2`]: "为什么要这么粗暴呢？",
		swq_dingxu: "定序",
		swq_dingxu_info: `持恒技，限定技。①首轮游戏开始时或有角色脱离濒死状态后，你可以记录场上所有角色的角色名称、体力值与体力上限、部分技能状态、所有区域牌，你最多以此法保留最新的两份状态。②出牌阶段/当有角色即将死亡时，你可以/取消之并可以将全场存活角色的状态回溯至任意记录，回溯过程排除${get.poptip("swq_wanxiang")}和${get.poptip("swq_dingxu")}，然后你令一名角色获得所有「象」并于当前回合结束后获得一个额外回合。`,
		[`#${ea}swq_suier/swq_dingxu1`]: "大家都要遵守游戏规则哦！",
		[`#${ea}swq_suier/swq_dingxu2`]: "然后...时间开始流动！",

		swq_xietaobao: "屑桃宝",
		[`#${ea}swq_xietaobao/swq_xietaobao:die`]: "白头吟，伤离别...",
		swq_xiangfu: "相赴",
		swq_xiangfu_info: "每轮各限一次，当你需要使用或打出【杀】/【酒】/【闪】/【桃】时，你可以选择一名与你手牌数差值为3及以上/2/1/0的其他角色，若你们手牌数不相等，你们中手牌数较多的角色弃置一张手牌，手牌数较少的角色摸一张牌，然后你视为使用或打出之。",
		[`#${ea}swq_xietaobao/swq_xiangfu1`]: "邂逅相遇，与子偕臧。",
		[`#${ea}swq_xietaobao/swq_xiangfu2`]: "君子如玉，乱我心曲。",
		swq_zhishou: "执手",
		swq_zhishou_info: `当你对其他角色发动${get.poptip("swq_xiangfu")}后，你可以令其视为拥有${get.poptip("swq_xiangfu")}直至你再次发动此技能。若你本局游戏发动过此技能且只发动过一次，你使用牌无距离和次数限制。`,
		[`#${ea}swq_xietaobao/swq_zhishou1`]: "愿得一人心，白首不相离。",

		swq_shuisi: "睡死",
		[`#${ea}swq_shuisi/swq_shuisi:die`]: "下次再玩吧~",
		swq_xinjie: "新界",
		swq_xinjie_info: "出牌阶段限一次，或当你响应其他角色使用的牌时，你可以令一名角色执行一项：1.失去1点体力然后回复1点体力；2.回复1点体力然后失去1点体力。若其体力值相比执行前，减少：你摸一张牌；相等：你从牌堆中获得除本次响应牌类型（若有）的其他类型牌各一张；增加：你视为对自己使用一张冰【杀】。",
		[`#${ea}swq_shuisi/swq_xinjie1`]: "不可思议的世界，绝妙的世界！",
		swq_duwo: "独我",
		swq_duwo_info: "锁定技。①你无法响应自己使用的牌。②若你于一回合中体力值未发生过变化，你手牌中的锦囊牌均视为【无懈可击】，基本牌均视为【闪】。③你死亡时，你选择一名其他角色获得此技能。",
		[`#${ea}swq_shuisi/swq_duwo1`]: "我必须要改变这个世界！",
		swq_shuigu: "睡梏",
		swq_shuigu_info: "限定技，其他角色进入濒死状态时，你可以失去1点体力并对其造成X点伤害（X为其本局游戏进入濒死状态的次数），若其于脱离濒死前死亡，你重置此技能。",
		[`#${ea}swq_shuisi/swq_shuigu1`]: "剑术我也很擅长哦！",

		swq_fenglinghuoshan: "风灵火山",
		[`#${ea}swq_fenglinghuoshan/swq_fenglinghuoshan:die`]: "呜呜……这，这样子不好吧……",
		swq_fengling: "风灵",
		swq_fengling_info: "当你使用♣牌指定角色为目标时，你可以令其将区域内的所有牌洗回牌堆并摸等量张牌。",
		[`#${ea}swq_fenglinghuoshan/swq_fengling1`]: "请，请退后吧！",
		[`#${ea}swq_fenglinghuoshan/swq_fengling2`]: "裙子不要紧吧…",
		swq_liantian: "连天",
		swq_liantian_info: `每回合限一次，出牌阶段或有角色的${get.poptip({
			id: "twguose_tip",
			name: "受伤状态",
			type: "character",
			info: "即未受伤/受伤的状态，受伤状态变化后即体力值/上限变化后，若该状态发生变化。",
		})}改变时，你可以与一名本回合未选择过的其他角色拼点，拼点前你与其各选择一项：1.将你的拼点点数+3或-3；2.将本次拼点规则改为小点获胜；3.拼点时将你的拼点牌与牌堆顶的牌交换。若你赢或你与其选择的选项相同，你横置其并从牌堆或弃牌堆中随机获得一张♣牌，此技能视为未发动过；反之，你弃置一张手牌。当你因此技能失去最后的手牌时，你将手牌摸至体力上限。`,
		[`#${ea}swq_fenglinghuoshan/swq_liantian1`]: "对面原来来真的吗？！",
		[`#${ea}swq_fenglinghuoshan/swq_liantian2`]: "虽然不太明白，上啊！",
		swq_huoshan: "火山",
		swq_huoshan_info: "锁定技，当牌堆的牌数量增加时，你须选择一项：1.对体力值最高或处于横置状态的一名角色造成1点火焰伤害；2.令你该技能下一次造成的伤害+1且无法选择此项。",
		[`#${ea}swq_fenglinghuoshan/swq_huoshan1`]: "感觉我好像变聪明了！",
		[`#${ea}swq_fenglinghuoshan/swq_huoshan2`]: "呐呐，你是在找什么东西吧？",
		swq_shiyun: "势蕴",
		swq_shiyun_info: "主公技，游戏开始时，你从牌堆获得等同于场上key势力角色数张♣牌，并将这些牌置于武将牌上，你可以如手牌般使用或打出这些牌。",
		[`#${ea}swq_fenglinghuoshan/swq_shiyun1`]: "我不想拖大家后腿……我要振作起来才行！",

		swq_xuanchang: "玄敞",
		[`#${ea}swq_xuanchang/swq_xuanchang:die`]: "唔，让指挥官担心了……放心，拉菲不会气馁的，嗯。",
		swq_suibo: "随波",
		swq_suibo_info:"锁定技，若上一张牌的使用者不是你，你可以将一张非基本牌当上一张牌的同名牌使用，然后你摸一张牌并明置一名其他角色的一张随机手牌；反之，你的所有非基本牌均视为【闪】。",
		[`#${ea}swq_xuanchang/swq_suibo1`]: "指挥官，叫醒拉菲……是有什么事情呢……？",
		[`#${ea}swq_xuanchang/swq_suibo2`]: "……所以，再睡一会儿也是可以的吧？",
		swq_zhuliu: "逐流",
		swq_zhuliu_info:"①其他角色的出牌阶段结束时，你可以将手牌数调整至与其相同（至多摸5张）并可以使用一张手牌；②每种牌名每轮限一次，你可以将一张手牌当一张被明置的非装备牌使用。",
		[`#${ea}swq_xuanchang/swq_zhuliu1`]: "只要还能开火，我就不会放弃。",
		[`#${ea}swq_xuanchang/swq_zhuliu2`]: "“不死之船”，不会轻易沉没。",
		swq_gongjin: "共进",
		swq_gongjin_info:"出牌阶段每项各限一次：1.你可以明置至多X名其他角色各一张未明置的随机手牌，若这些牌的类型均相同，你可以观看并重铸其中一名目标区域内至多X张牌，并明置以此法得到的牌。2.你可以令至多X名其他角色可以视为使用一张被明置的【杀】或普通锦囊牌。（X为你当前体力值+1）",
		[`#${ea}swq_xuanchang/swq_gongjin1`]: "……总之，要先打败敌人……速战速决……",
		[`#${ea}swq_xuanchang/swq_gongjin2`]: "拉菲和指挥官，现在都很精神……！",
		swq_gongjin_use: "共进",
		visible_swq_suibo: "随波",
		visible_swq_gongjin: "共进",

		//Q群风云传-鹿天帝分包
		swlu_lugushou: '鹿帝陆古寿',
		swlu_lugushou_prefix: '鹿帝',
		[`#${ea}swlu_lugushou/swlu_lugushou:die`]: "终于，解脱了…",
		swlu_mengyan: '梦衍',
		swlu_mengyan_info: `锁定技。①当你造成/受到伤害后，若受伤角色/伤害来源不为你，你可以获得等量个受伤角色/伤害来源的“碎片”。②出牌阶段限三次，你可以移去一种“碎片”，获得一个与该角色同名、体力和体力上限为其初始的一半（向下取整且至多为3）、技能列表与其当前相同（非衍生技）、初始手牌数为移去的“碎片”数的随从，然后你调遣至此随从（当该随从被销毁时，该随从对应角色的所有非锁定技于本回合失效）；${get.poptip("luguan")}：你失去1点体力上限并可以对一名其他角色造成1点伤害。③当你不因${get.poptip("swlu_mengyan")}销毁而失去随从时，你须选择执行和上一次选择不同的一项：1.横置并弃置两张手牌。2.失去1点体力。3.失去1点体力上限。`,
		[`#${ea}swlu_lugushou/swlu_mengyan1`]: "剑出无回！",
		[`#${ea}swlu_lugushou/swlu_mengyan2`]: "飞光流泻！",
		[`#${ea}swlu_lugushou/swlu_mengyan3`]: "就让这一轮月华…",
		swlu_xiaqi: '遐启',
		swlu_xiaqi_info: `使命技，成功：当你触发“${get.poptip("luguan")}”后，你增加2点体力上限并回复1点体力，获得所有其他角色的${get.poptip("swlu_mengyan")}“碎片”各两个。失败：若你成功达成使命前死亡，取消之并减少1点体力上限、回复体力至1点，然后你可以触发一次${get.poptip("swlu_mengyan")}②。`,
		[`#${ea}swlu_lugushou/swlu_xiaqi1`]: "照彻万川！",
		swlu_submengyan: '梦衍',
		swlu_submengyan_info: '锁定技。①当你造成伤害后，若受伤角色不为你，你可以获得等量个受伤角色的“碎片”。②出牌阶段，你可以销毁此随从。',
		[`#${ea}swlu_lugushou/swlu_submengyan1`]: "剑出无回！",
		[`#${ea}swlu_lugushou/swlu_submengyan2`]: "飞光流泻！",
		swlu_sunyuning: '鹿帝孙玉凝',
		swlu_sunyuning_prefix: '鹿帝',
		[`#${ea}swlu_sunyuning/swlu_sunyuning:die`]: "眼睛...睁不开了…",
		swlu_yuqian: "迂迁",
		swlu_yuqian_info: "①游戏开始时，你可以令所有非主公身份角色同时将身份交给下家；所有角色将初始手牌交给下家。②每轮限一次，其他角色获得你的牌后，你可以翻面并选择获得其手牌区或装备区内的所有牌。",
		[`#${ea}swlu_sunyuning/swlu_yuqian1`]: "果然需要我出手嘛！",
		[`#${ea}swlu_sunyuning/swlu_yuqian2`]: "哼，就包在我身上！",
		swlu_lvshu: "律枢",
		swlu_lvshu_info: `锁定技，当你的体力值变化时，根据变化后的值执行以下效果：大于等于3，你重置【迂迁②】；等于2，你重置武将牌；小于等于1，你可以将任意张牌交给一名其他角色，你的非Charlotte技于本轮失效。${get.poptip("luguan")}：你减1点体力上限并可以令一名角色翻面。`,
		[`#${ea}swlu_sunyuning/swlu_lvshu1`]: "从哪里来的？",
		[`#${ea}swlu_sunyuning/swlu_lvshu2`]: "没躲开...",
		swlu_xucheng: "虚承",
		swlu_xucheng_info: "持恒技，一名其他角色的回合结束时，若其装备区或手牌区没有牌，你可以选择一项执行：1.将手牌数调整至与该角色体力上限相同并翻面（至多摸五张）；2.观看该角色的手牌并可以视为使用其的一张牌；3.使用一张手牌。此技能结算期间，你与该角色的距离视为1。",
		[`#${ea}swlu_sunyuning/swlu_xucheng1`]: "我可不好欺负！",
		[`#${ea}swlu_sunyuning/swlu_xucheng2`]: "胜负还没分呢！",
		swlu_xindong: "鹿帝心动",
		swlu_xindong_prefix: "鹿帝",
		swlu_kuiqing: "葵倾",
		swlu_kuiqing_info: `转换技。①游戏开始时，你可以转换此技能状态；②每回合限三次，阳：当有花色相同的牌被连续使用后，你可以将手牌调整至体力上限并选择一名其他角色的至多X张未拥有此法标记的手牌，这些牌被标记为“葵倾”且于本轮中无法被使用、打出或弃置；阴：当有转化或虚拟牌被使用时，你可以将手牌调整至1并选择一名其他角色，令其于下个回合开始前使用的前X次牌无效。（X为你手牌调整前后的差值-1且至少为1）；${get.poptip("luguan")}：你减1点体力上限并将体力恢复至上限。`,
		swlu_kongxian: "空弦",
		swlu_kongxian_info: `其他角色的回合结束时，若其：1.手牌数大于体力值，你可以令一名角色展示一张基本或普通锦囊牌并视为使用之；2.本回合未造成伤害，你可以使用本回合进入弃牌堆的一张牌。${get.poptip("rule_chengshi")}：这些牌无法被响应。`,
		swlu_xinqi: "心启",
		swlu_xinqi_info: "主公技，其他key势力角色的回合开始时，你可以转换你的一个转换技状态。",
		swlu_tianshangke: "鹿帝天上客",
		swlu_tianshangke_prefix: "鹿帝",
		// [`#${ea}swlu_tianshangke/swlu_tianshangke:die`]: "",
		swlu_qiujian: "囚剑",
		swlu_qiujian_info: `出牌阶段限三次，你可以废除你的一个装备栏并指定一名其他角色，你亮出牌堆顶的X*Y张牌（X/Y为你已/未废除的装备栏数且至少为1）并可以对其使用其中一张伤害牌，然后你获得剩余非伤害牌。${get.poptip("luguan")}：你减1点体力上限并将“获得剩余非伤害牌”的效果改为“与其交换装备栏废除状态”。`,
		// [`#${ea}swlu_tianshangke/swlu_qiujian1`]: "",
		// [`#${ea}swlu_tianshangke/swlu_qiujian2`]: "",
		swlu_bishen: "闭神",
		swlu_bishen_info: "你的额定回合结束时，你可以令一名角色执行一个无法使用和打出手牌的额外回合。其于该回合结束时可以选择至多X个装备栏随机获得并使用一张装备（X为其本回合获得牌的次数），装备前若装备栏被废除，优先恢复之。",
		// [`#${ea}swlu_tianshangke/swlu_bishen1`]: "",
		// [`#${ea}swlu_tianshangke/swlu_bishen2`]: "",
		swlu_shuisi: "鹿帝睡死",
		swlu_shuisi_prefix: "鹿帝",
		swlu_pianyu: "偏予",
		swlu_pianyu_info: "其他角色的回合开始时，你可以摸一张牌并回复1点体力，然后交给其一张基本/普通锦囊牌。当其于本回合使用普通锦囊/基本牌时：若你不是此牌的目标，你成为其目标；若你已是此牌的目标，此牌对你额外结算一次。",
		swlu_juejie: "绝界",
		swlu_juejie_info: `转换技。每回合限三次，当你受到基本/普通锦囊牌的伤害后，阳：你可以从牌堆中获得一张普通锦囊/基本牌；阴：你可以令一名角色使用其手牌中的一张普通锦囊/基本牌。${get.poptip("luguan")}：你减1点体力上限，防止你本回合受到的伤害并获得一张基本牌和普通锦囊牌。`,
		swlu_shuiyu: "睡圄",
		swlu_shuiyu_info: "限定技。当其他角色脱离濒死状态后，若你未对其发动过此技能，你可以令其摸X张牌并防止其本回合受到的伤害（X为其脱离濒死的次数），其于当前回合结束后进行一个额外回合且于额外回合结束后失去所有体力。若其于该回合内杀死过角色，你重置此技能。",
		//Q群风云传-玫瑰血色包
		sw_xuesha_buff: '血祭',
		swx_lugushou: '瑰血陆古寿',
		[`#${ea}swx_lugushou/swx_lugushou:die`]: "不能停...不能停下！",
		swx_wudouwawa: "巫毒娃娃",
		swx_lugushou_prefix: '瑰血',
		swx_xuezu: '血族',
		swx_xuezu_info: '锁定技，游戏开始时，你将八张血【杀】加入牌堆。当有角色使用血【杀】造成伤害后，你回复1点体力。',
		swx_mieyi: '灭意',
		swx_mieyi_info: '每回合每项各限一次。1.当一名角色回复体力时，若其体力值为全场最大或等于体力上限，你可以令其对自己造成1点伤害且本回合出杀次数+1。2.当一名角色受到伤害后，若其体力值为全场最小或等于1，你可以令其回复1点体力并从牌堆中获得一张血【杀】。',
		[`#${ea}swx_lugushou/swx_mieyi1`]: "你无处可逃！",
		[`#${ea}swx_lugushou/swx_mieyi2`]: "剑下草芥。",
		swx_jihun: "祭魂",
		swx_jihun_info: "限定技，当有其他角色受到自己造成的伤害后，若场上没有你以此法创造的“巫毒娃娃”，你可以在你的上家或下家创造一个无身份阵营、无技能、与其状态相同的“巫毒娃娃”，“巫毒娃娃”与该角色其中一方受到伤害/回复体力后，另一方受到等量无来源伤害/回复等量体力，“巫毒娃娃”死亡后，该角色失去全部体力。“巫毒娃娃”无法进行回合与使用牌，且存在期间，你视为拥有该角色的所有非衍生技能。当你或该角色死亡时，销毁“巫毒娃娃”。",
		[`#${ea}swx_lugushou/swx_jihun1`]: "多添一条亡魂罢了。",
		swx_jihun_doll_lock: "娃娃",

		swx_tianshangke: "瑰血天上客",
		swx_xuezu2: '血族',
		swx_xuezu2_info: '锁定技，游戏开始时，你将八张血【杀】加入牌堆。当有角色使用血【杀】造成伤害后，你随机获得一张装备牌。',
		swx_tianshangke_prefix: "瑰血",
		swx_mengmu: "蒙目",
		swx_mengmu_info: "锁定技。①你的攻击范围始终等于你的体力值；②你的【闪】均视为血【杀】；③当你攻击范围内的角色增加/减少时，你获得因此进入/离开你攻击范围的其他角色各一张牌，然后你可以使用一张计入次数的【杀】。",
		swx_xiake: "侠客",
		swx_xiake_info: `使命技。当你击杀一名角色后，成功：你失去${get.poptip("swx_mengmu")}并获得${get.poptip("swx_jianchu")}。失败：你的攻击范围小于1时，你废除武器栏。`,
		swx_jianchu: "剑出",
		swx_jianchu_info: "锁定技。①你的攻击范围为无穷大；②你使用【杀】无次数限制且造成伤害后摸一张牌；③当你使用【杀】时，你移出游戏直到此【杀】结算完毕。",

		swx_shuisi: "瑰血睡死",
		swx_shuisi_prefix: "瑰血",
		swx_xuezu3: "血族",
		swx_xuezu3_info: "锁定技，游戏开始时，你将八张血【杀】加入牌堆。当有角色受到伤害后，你使其获得等量个“瑰痕”，若伤害来源为其自己，额外获得一次。",
		swx_sijie: "思界",
		swx_sijie_info: "每名角色每回合限一次，当你/有“瑰痕”的角色使用牌指定有“瑰痕”的角色/你后，你移除其所有“瑰痕”，然后观看牌堆顶X+<span class='bluetext'>0</span>张牌（X为移除的“瑰痕”数），获得其中至多<span class='yellowtext'>1</span>张，其余牌以任意顺序置于牌堆顶或牌堆底。每当移除八个“瑰痕”标记，你从牌堆获得一张血【杀】并选择一项：1.此技能的蓝色数字+1（至多4）；2.此技能的黄色数字+1（至多4）。",
		swx_shuizhi: "睡桎",
		swx_shuizhi_info: "限定技，其他角色进入濒死状态时，你可以移除其所有“瑰痕”，展示并弃置牌堆底等量张牌，若其中黑色牌多于红色牌，你对其造成X点伤害（X为其本局进入濒死状态的次数）。若其于脱离濒死前死亡或你未对其造成伤害，你重置此技能。",
		swx_guihen: "瑰痕",
		swx_fenglinghuoshan: "瑰血风灵火山",
		swx_fenglinghuoshan_prefix: "瑰血",
		// 阵亡语音复用风灵火山原版既有条目（#${ea}swq_fenglinghuoshan/swq_fenglinghuoshan:die），此处不重复定义；
		// 三个技能与原版不同名、无对应语音文件，故技能不写 audio、不加语音 key。
		swx_fenglinghuoshan_xuezu: "血族",
		swx_fenglinghuoshan_xuezu_info: "锁定技，游戏开始时，你将八张血【杀】加入牌堆。当其他角色受到自己造成的伤害后，你获得一点护甲。",
		swx_fenglinghuoshan_b: "待定B",
		swx_fenglinghuoshan_b_info: "①每轮开始时，你秘密选择一名其他角色并从1~你初始体力上限中选择一个数字，并清除上一次的记录。②每回合限一次，当你选择的角色对你使用过你选择数字张牌后，你与其失去你选择数字点体力值；此过程中你与其无法回复体力，死亡时改为扣除一点体力上限，并将体力值与手牌数调整至选择数字。然后你可重新选择并移除之前的选择。本轮结束时若未触发过②，你获得其一点体力上限。",
		swx_fenglinghuoshan_c: "待定C",
		swx_fenglinghuoshan_c_info: "出牌阶段，你可以执行其中一项：1.你对自己造成X点伤害，然后增加一点体力上限（X为本技能本回合发动次数）；2.你扣除一点体力上限，选择一名其他角色，其下一张可以指定你为目标的牌必须指定你为目标（对同一角色重复选择可叠加）。",

		//Q群风云传-假日月潮包
		swyc_lugushou: '月潮陆古寿',
		swyc_lugushou_prefix: '月潮',
		[`#${ea}swyc_lugushou/swyc_lugushou:die`]: "无趣。",
		visible_swyc_skillcard: '技能',
		swyc_chaoyuan: '潮渊',
		swyc_chaoyuan_info: `潮涌技。你的回合开始时，你可以调整你的技能列表顺序。每回合限三次，${get.poptip("swyc_chaoqi")}：你可以指定一名其他角色，视为对其使用一张水【杀】，若此杀造成伤害，你令其从牌堆或弃牌堆随机装备一件防具，反之，你从牌堆或弃牌堆随机装备一件武器；${get.poptip("swyc_chaoluo")}：你可以指定一名其他角色，其视为对你使用一张水【杀】，若此杀未造成伤害，你移除其技能列表的第一项技能并添加至你的手牌，反之，其移除你技能列表的第一项技能并添加至其的手牌。（${get.poptip("swyc_jinengpai")}）`,
		swyc_zhuiyun: '追云',
		swyc_zhuiyun_info: `锁定技，当有角色失去技能后，若其非衍生技能数小于其武将牌上技能数，其回复1点体力，然后你令系统随机检索出三张拥有发动时机为当你造成伤害后/当你受到伤害后/出牌阶段的技能的武将牌，你选择其中一个技能，其获得之。`,
		[`#${ea}swyc_lugushou/swyc_zhuiyun1`]: "乘月返真。",
		[`#${ea}swyc_lugushou/swyc_zhuiyun2`]: "有人声的地方，分外聒噪。",
		swyc_huaquan: '化泉',
		swyc_huaquan_info: `①游戏开始时，你移除本技能，令该技能以${get.poptip("swyc_jinengpai")}的形式加入手牌。②每回合限一次，你可以将一张${get.poptip("swyc_jinengpai")}或两张同类型手牌当做任意基本牌使用。`,
		[`#${ea}swyc_lugushou/swyc_huaquan1`]: "我以月色为剑。",
		[`#${ea}swyc_lugushou/swyc_huaquan2`]: "现在退下，我便饶你一命。",

		swyc_os: '月潮欧丝',
		swyc_os_prefix: '月潮',
		[`#${ea}swyc_os/swyc_os:die`]: "你很强啊！",
		swyc_yongguan: "泳冠",
		swyc_yongguan_info: `锁定技，当你因属性伤害而进入濒死状态时，你恢复体力至1点并对体力值唯一最高的其他角色发动一次${get.poptip("swyc_jiurang")}。`,
		[`#${ea}swyc_os/swyc_yongguan1`]: "其实，我现在有点飘飘然呢~",
		[`#${ea}swyc_os/swyc_yongguan2`]: "就算是在玩，也要全力以赴！",
		swyc_zhanxin: "崭新",
		swyc_zhanxin_info: `当有角色受到火属性伤害后，你可以对自己造成1点水属性伤害，然后获得持续2回合的${get.poptip("swwz_info")}：${get.poptip("swwz_zhanxinshaonv_os")}，若已有纹章则改为增加1回合。`,
		[`#${ea}swyc_os/swyc_zhanxin1`]: "怎么样，可爱吗？",
		[`#${ea}swyc_os/swyc_zhanxin2`]: "超级，感谢！",
		swyc_jiurang: "就让",
		swyc_jiurang_info: "出牌阶段限一次，你可以获得至多体力值名其他角色的各一张手牌，然后你依次交给以此法失去伤害牌的角色各一张牌并横置等量名角色，这些角色各从牌堆或弃牌堆中随机使用一张装备牌。",
		[`#${ea}swyc_os/swyc_jiurang1`]: "和你一起，度过特别的时光！",
		[`#${ea}swyc_os/swyc_jiurang2`]: "我以你为傲！",
		swyc_shapai: "沙排",
		swyc_shapai_info: `潮涌技。你的回合开始时，你可以调整你的技能列表顺序。每回合限三次，${get.poptip("swyc_chaoqi")}：你可以选择一名其他角色，你选择一项：1.摸两张牌；2.视为对对方使用一张水属性【决斗】。其选择另一项，然后你与其依次结算。${get.poptip("swyc_chaoluo")}：你可以选择一名其他角色，你选择一项：1.获得的下两张牌视为无次数限制的火【杀】；2.横置并重铸两张牌，若重铸的两张牌类型相同，则受到你造成的1点水属性伤害。其选择另一项，然后你与其依次结算。`,
		[`#${ea}swyc_os/swyc_shapai1`]: "我要全力以赴了！",
		[`#${ea}swyc_os/swyc_shapai2`]: "我要传达给你！",
		[`#${ea}swyc_os/swyc_shapai3`]: "这是前辈我的真本事！",

		//Q群风云传-碧野栖鸾包
		swby_lugushou: '碧野陆古寿',
		swby_lugushou_prefix: '碧野',
		[`#${ea}swyc_lugushou/swyc_lugushou:die`]: "无趣。",
		swby_fangcao: '芳草',
		swby_fangcao_info: '每轮开始时，若你未以此法记录过牌名，则你可以记录至多四个基本牌或普通锦囊牌牌名。每回合限一次，你可视为使用或打出一张记录的牌名并于此牌结算后选择此牌目标中一名未拥有“青青草原”标记的角色，你令其获得“青青草原”标记直到本轮结束，若此牌无目标且你未拥有标记，则标记你自己。当有“青青草原”标记的角色受到伤害时，你防止之并选择任意项：1.移除“青青草原”标记；2.系统从技能名或技能描述中含“藏/荐/英/营/草”之一的技能中随机选择三个其未拥有的技能，然后你令伤害来源获得其中一个技能；3.从记录中删除对其使用的牌名；4.废除你的一个装备栏，若均已废除，则改为你失去全部体力。若你选择的项数小于3，则你减少小于数点体力上限。',
		[`#${ea}swby_lugushou/swby_fangcao1`]: "赏玩之余，便别无他用。",
		[`#${ea}swby_lugushou/swby_fangcao2`]: "往日种种，正如铭刻此身的伤痕。",
		swby_qiluan: '栖鸾',
		swby_qiluan_info: '每三轮限一次，当有角色的回合结束时，你可以对自己造成1点伤害并执行一个额外的出牌阶段，你无法于此阶段使用【杀】且其他角色的所有非锁定技于此阶段失效。',
		[`#${ea}swby_lugushou/swby_qiluan1`]: "剑刃上的返照，映出诸多过往。",

		//碧野守望
		swby_shouwang: '碧野守望',
		swby_shouwang_prefix: '碧野',
		swby_zhezhi: '折枝',
		swby_zhezhi_info: '每回合限一次，当你需要使用【桃】或【酒】时，你可以弃置一至四张花色互异的手牌并将手牌摸至体力上限，根据你此次弃置的花色数，若不小于：1.视为使用之；2.此牌目标获得一个随机伤害性技能直到其回合结束；3.此牌额外结算一次；4.你额外摸四张牌。你因此技能获得的牌于你的回合结束前不计入手牌上限。',
		swby_hongwang: '鸿望',
		swby_hongwang_info: `锁定技。①你的【桃】和【酒】目标数改为1，且可以指定其他角色为目标；若你使用的【桃】或【酒】指定了其他角色，你回复1点体力。②由你回复的体力改为向上${get.poptip("jingmotiaozheng")}等量数值。`,
		swby_chunsheng: '春生',
		swby_chunsheng_info: '限定技，出牌阶段，你可以选择包含死亡角色在内的至多三名角色，令这些角色依次回复1点体力并摸一张牌；若其已死亡，则改为令其复活为1点体力并摸一张牌。',
		swby_zhezhi_hand: '折枝',

		//Q群风云传-剑挽造化篇
		swjw_lugushou: "剑挽陆古寿",
		swjw_lugushou_prefix: "剑挽",
		swjw_jianche: "剑恻",
		swjw_jianche_info: `锁定技。①游戏开始时，你将${get.poptip("swjw_zhili")}置入你的装备区。②当有不因此技能使用的【杀】被抵消后，你将此【杀】对应的所有实体牌置于你的武将牌上，称为「剑」。当「剑」牌中的花色数达到3种及以上时，你将这些牌当做无视距离且基础伤害值为牌数量的雷【杀】使用。`,
		swjw_feihua: "飞花",
		swjw_feihua_info: `出牌阶段限一次，你可以令一名角色对其下家使用牌堆中的一张【杀】（无规则限制），若如此做，其选择一项：1.令下家继续此流程。2.弃置所有手牌（无牌则不弃）并终止此流程。技能结算期间每当有角色因此法受到伤害时，若${get.poptip("swjw_zhili")}位于牌堆或弃牌堆，你装备之，反之，你摸两张牌。`,
		swjw_binzang: "殡葬",
		swjw_binzang_info: "锁定技，当你杀死其他角色后，你选择一项：1.获得其武将牌上的所有技能。2.摸三张牌。",
		swjw_zhili_skill: "支离",
		swjw_tianshangke: "剑挽天上客",
		swjw_tianshangke_prefix: "剑挽",
		//[`#${ea}swjw_tianshangke/swjw_tianshangke:die`]: "",
		swjw_xuren: "蓄刃",
		swjw_xuren_info: "其他角色的出牌阶段开始时，你可以获得一张【杀】，然后你可以对其使用任意张【杀】（无距离限制），当你本回合因此首次造成伤害时，你令伤害+X（X为距你上次受到伤害后/游戏开始时，你连续拒绝发动此技能的次数）。若如此做，直到你的下个回合开始前，你不能再发动此技能。",
		//[`#${ea}swjw_tianshangke/swjw_xuren1`]: "",
		//[`#${ea}swjw_tianshangke/swjw_xuren2`]: "",
		swjw_yangbing: "养兵",
		swjw_yangbing_info: `游戏开始时，你将${get.poptip("swjw_pujian")}置入你的装备区。当你于回合外使用牌时，若${get.poptip("swjw_pujian")}位于牌堆或弃牌堆，你装备之；否则，你可以将手牌数调整到体力上限（至多摸5张）。`,
		//[`#${ea}swjw_tianshangke/swjw_yangbing1`]: "",
		//[`#${ea}swjw_tianshangke/swjw_yangbing2`]: "",
		swjw_zhufeng: "铸锋",
		swjw_zhufeng_info: "锁定技，当你杀死其他角色后，你选择一项：1.增加等同于该角色体力上限一半（向下取整）点体力上限；2.你本局游戏造成的伤害增加1点。",
		//[`#${ea}swjw_tianshangke/swjw_zhufeng1`]: "",
		//[`#${ea}swjw_tianshangke/swjw_zhufeng2`]: "",
		swjw_xuren_count: "蓄刃",
		swjw_zhufeng_add: "铸锋",
		swjw_pujian_skill: "朴剑",
		swjw_pujian_skill_info: "当你获得【杀】时，你可以将这些【杀】置于朴剑上，你可以如手牌般使用或打出朴剑上的牌。",
		//异构奇英录
		swyg_jushou: '异构沮授',
		swyg_jushou_prefix: '异构',
		swyg_jianying: '渐营',
		swyg_jianying_info: `每当你于出牌阶段内使用牌时，根据此牌字数与此阶段你使用的上一张牌的字数关系，你可以触发指定效果：相同，你摸一张牌；相差为1，你本回合使用的下一张牌无距离和次数限制；相差为2或更多，你重置${get.poptip("swyg_quanlue")}。`,
		swyg_quanlue: '权略',
		swyg_quanlue_info: '出牌阶段限一次，你可以弃置一张牌，然后从牌堆中获得一张任意字数的牌。',
		swyg_shibei: '矢北',
		swyg_shibei_info: '锁定技，当你于一回合内第一次受到伤害后，你回复1点体力；当你于一回合内第二次受到伤害后，你失去1点体力并摸一张牌。',

		swyg_guojia: '异构郭嘉',
		swyg_guojia_prefix: '异构',
		swyg_shisheng: '十胜',
		swyg_shisheng_info: `出牌阶段限一次，你可与一名其他角色比较手牌数、血量、装备区牌数，然后你依次执行以下选项中的前X项：1.获得技能${get.poptip("tiandu")}直到再发动此技能。2.摸两张牌。3.回复1点体力。（X为比较中你大于其的次数）。`,
		swyg_shibai: '十败',
		swyg_shibai_info: `当你受到伤害后，你可以在${get.poptip("new_reyiji")}、${get.poptip("oljieming")}、${get.poptip("refankui")}、${get.poptip("new_rejianxiong")}、${get.poptip("chouce")}中选择一个发动。`,

		swyg_xunyu: '异构荀彧',
		swyg_xunyu_prefix: '异构',
		swyg_zaifu: '宰辅',
		swyg_zaifu_info: '当你受到伤害后，你可以令一名角色将手牌调整至体力上限（至多摸五张），若以此法摸牌，你将摸到的牌标记为“宰辅”，有角色失去过“宰辅”牌的回合结束时，你可以令一名角色视为对另一名角色使用一张随机的伤害类锦囊牌；若以此法弃牌，则你可以分配其中至多X张牌（X为其体力值）。',
		swyg_dingce: '定策',
		swyg_dingce_info: '①你可将一张牌当做任意同字数且你未记录过的任意基本牌或普通锦囊牌使用或打出，然后你记录之。②准备阶段，你可在记录中减少一种普通锦囊牌牌名。',

		swyg_caojinyu: '异构曹金玉',
		swyg_caojinyu_prefix: '异构',
		swyg_yuqi: '隅泣',
		swyg_shanshen_tag: '隅泣',
		swyg_yuqi_info: '当你受到伤害后，你可弃置至多X名角色的一张手牌（X为你的体力上限），若弃置的牌中有【杀】或【桃】，你可以使用之（每回合各限使用一次），然后你将未使用的牌置于你的武将牌上，称为「隅泣」。',
		swyg_shanshen: '善身',
		swyg_shanshen_info: '准备阶段，你可以任意将你的牌与「隅泣」牌交换，然后根据「隅泣」中伤害牌和其他牌的大小关系触发指定效果：大于，则你本回合：使用【杀】的次数加一，使用的第一张【杀】不可响应；等于：你摸两张牌并跳过本回合的弃牌阶段；小于：你回复一点体力且本回合无法对其他角色使用手牌。',
		swyg_xianjing: '娴静',
		swyg_xianjing_info: '觉醒技，当你武将牌上的「隅泣」数量大于等于7时，你增加一点体力上限并回复一点体力，然后你可以弃置任意数量的「隅泣」并摸两倍数量的牌。',

		swyg_hanxiandi: '异构汉末献帝',
		swyg_hanxiandi_prefix: '异构',
		swyg_modi: '末帝',
		swyg_modi_info: '锁定技，其他角色的回合开始时，其可交给你一张牌然后你摸一张牌并交给其一张牌，否则其需对除你以外的角色使用一张【杀】或失去1点体力。',
		swyg_zhaoling: '诏令',
		swyg_zhaoling_tag: '诏令',
		swyg_zhaoling_info: '出牌阶段限三次，你可将任意张牌交给一名其他角色，称为“诏令”。当有角色使用或打出“诏令”后你摸一张牌并获得一枚“汉”标记',
		swyg_fuhan: '复汉',
		swyg_fuhan_info: `觉醒技，准备阶段，若你的“汉”数量大于等于场上势力数，你增加三点体力上限并回复1点体力，失去${get.poptip("swyg_modi")}并获得技能${get.poptip("swyg_tianzi")}`,
		swyg_tianzi: '天子',
		swyg_tianzi_info: '锁定技，摸牌阶段摸牌时，你额外摸等同于你体力值张牌（至多多摸三张）；你使用牌无距离限制；你始终跳过弃牌阶段。',
		swyg_handi: '汉帝',
		swyg_handi_info: '主公技，每回合限一次，当有角色使用“诏令”后，其使用的下一张牌无距离和次数限制',

		swyg_xiaoqiao: '异构小乔',
		swyg_xiaoqiao_prefix: '异构',
		swyg_sunluyu: "异构孙鲁育",
		swyg_sunluyu_prefix: "异构",
		swyg_meibu: "魅步",
		swyg_meibu_info:
			"其他角色的出牌阶段开始时，你可以弃置一张牌，令该角色弃置所有伤害牌，若其未因此弃牌，你摸一张牌。",
		swyg_mumu: "穆穆",
		swyg_mumu_info:
			"每回合每项各限一次，当你使用装备牌时，你可以改为将其置入其他角色的装备区并摸两张牌；当其他角色使用装备牌时，你可以将目标改为你，然后你无法响应其对你使用的牌直到回合结束。",
		swyg_tianxiang: '天香',
		swyg_tianxiang_info: '锁定技。①当你即将受到伤害时，若你有手牌，你可以展示所有手牌，若花色均为♥，则你将此伤害转移给一名其他角色、摸两张牌并使手牌上限-1；反之，你可以重铸至多X+1张手牌（X为你的手牌上限和体力值之差）。②当你受到伤害后，你的手牌上限增加等量值。',
		swyg_hongyan: '红颜',
		swyg_hongyan_info: '锁定技，你获得以下前X+1项效果：你区域内的①♠②♣③♦牌和对应花色的判定牌均视为♥。（X为你的手牌上限和体力值之差）',

		swyg_liubei: '异构刘备',
		swyg_liubei_prefix: '异构',
		swyg_huairen: '怀仁',
		swyg_huairen_info: '每轮开始时，你可令至多三名角色获得“民”标记直至本轮结束。拥有“民”标记的角色获得以下效果：①每轮限一次，当其受到伤害时，你可失去1点体力防止此伤害并摸两张牌；②每轮限一次，当其造成伤害时，你回复1点体力，若你未受伤，则改为摸两张牌。',
		swyg_huairen_min: '民',
		swyg_gongji: '共济',
		swyg_gongji_info: `锁定技，每回合限一次，当一名有“民”标记的角色使${get.poptip("swyg_huairen")}两项均执行后，你令其的${get.poptip("swyg_huairen")}效果视为未发动过。`,

		swyg_zhangwen: '异构张温',
		swyg_zhangwen_prefix: '异构',
		[`#${ea}swyg_zhangwen/swyg_zhangwen:die`]: "一朝纵虎，终被虎噬矣。",
		swyg_zhaotao: '召讨',
		[`#${ea}swyg_zhangwen/swyg_zhaotao1`]: "大军压境，速溃其守！",
		[`#${ea}swyg_zhangwen/swyg_zhaotao2`]: "文武并进，共图肃清。",
		swyg_zhaotao_info: '当你使用牌指定其他角色为目标后，你可选择一项：1.依次弃置目标区域内一张牌；2.令一名其他角色摸X张牌（X为此牌目标数）。',
		swyg_lvwang: '虑望',
		[`#${ea}swyg_zhangwen/swyg_lvwang1`]: "威名素著，不可不防。",
		[`#${ea}swyg_zhangwen/swyg_lvwang2`]: "且留余地，以安其行。",
		swyg_lvwang_info: '每回合每项各限一次：1.一名角色于摸牌阶段外获得牌时，你可以弃置其区域内至多两张牌；2.一名角色弃置牌后，你可以令其摸两张牌。',

		// 二游同人创
		swe_nanali: "娜娜莉",
		[`#${ea}swe_nanali/swe_nanali:die`]: "这样，一点都不酷……",
		swe_quanbing: "权柄",
		swe_quanbing_info: "当你有体力值变化的回合结束时，你可以观看牌堆顶五张牌，若其中有伤害牌，你展示之并选择一项令一名角色执行：1.依次使用其中的伤害牌（无距离限制），然后失去等同于以此法造成伤害数的体力；2.弃置其中的伤害牌，然后回复1点体力。",
		[`#${ea}swe_nanali/swe_quanbing1`]: "来点惊喜！",
		[`#${ea}swe_nanali/swe_quanbing2`]: "看我厉害！",
		swe_zhongji: "终极",
		swe_zhongji_info: "蓄力技（0/∞）。一轮游戏开始时，你选择一项：本轮当有1.造成伤害/2.未造成伤害的伤害牌进入弃牌堆后，你获得等量蓄力值；若你的蓄力值不小于游戏人数，你消耗全部蓄力值并获得上轮1.造成伤害/2.未造成伤害且进入弃牌堆的伤害牌（每张牌每局游戏限获得一次），称为“副手”。你的“副手”不计入手牌上限且不参与此技能的蓄力值结算；当你使用不含“副手”的实体牌结算完毕后，你可以使用一张“副手”牌。",
		swe_zhongji_fushou: "副手",
		[`#${ea}swe_nanali/swe_zhongji1`]: "全体！听我指挥！",
		[`#${ea}swe_nanali/swe_zhongji2`]: "副手，该我们救场了！",
		swe_katixiya: '卡提希娅',
		[`#${ea}katixiya/katixiya:die`]: "巡礼的终点……",
		swe_fengdu: '奉读',
		swe_fengdu_info: '①每回合限两次，你使用牌指定其他角色为唯一目标或成为其他角色使用牌的唯一目标时，你可以选择一项：1.令此牌额外增加一个目标；2.令此牌回复值/伤害值+1。若你选择的选项与你上一次选择的不同，你摸一张牌并获得“神权剑”。②当你造成或受到大于1的伤害后，你获得“异权剑”。',
		[`#${ea}katixiya/swe_fengdu1`]: "坠落吧，恶徒！",
		[`#${ea}katixiya/swe_fengdu2`]: "别想逃离！",
		swe_yijian: '以剑',
		swe_yijian_info: '出牌阶段限一次，你可以令一名角色从牌堆中获得其手牌中没有的花色的牌各一张，若其获得了两张及以上的牌，你获得“人权剑”。',
		[`#${ea}katixiya/swe_yijian1`]: "涤除不净。",
		[`#${ea}katixiya/swe_yijian2`]: "高天沉垂。",
		swe_qiyuan: '祈愿',
		swe_qiyuan_info: `限定技，出牌阶段，若你本回合使用过四种花色的牌或拥有全部剑影，你可以将体力降低调整至体力上限的一半（不足则不执行）并将武将牌替换为${get.poptip({
			id: "swe_fuludelisi_pop",
			name: "芙露德莉斯",
			type: "character",
			dialog: "characterDialog",
		})}。`,
		[`#${ea}katixiya/swe_qiyuan1`]: "汪洋，没向我身。",
		[`#${ea}katixiya/swe_qiyuan2`]: "真容，于此展露。",

		swe_fuludelisi: '芙露德莉斯',
		[`#${ea}katixiya/fuludelisi:die`]: "剑身，已然折断。",
		swe_jueyi: '决意',
		swe_jueyi_info: `持恒技。①你切换至此角色后，根据你切换前拥有的剑影获得以下效果：神权剑，获得30点“决意”，当你受到伤害时，你可以弃置一张装备牌防止之；异权剑，获得30点“决意”，你造成的伤害+1；人权剑，获得30点“决意”，你始终跳过判定和弃牌阶段。效果均至多存在两轮。②每当你失去最后一种花色的手牌后/造成大于1的伤害后/武将状态发生改变后，你获得20/30/40点“决意”（上限为120点）。③若你的决意不小于120点，你视为拥有${get.poptip("swe_chaonu")}。`,
		[`#${ea}katixiya/swe_jueyi1`]: "裁罚净罪！",
		[`#${ea}katixiya/swe_jueyi2`]: "涛澜无恕！",
		[`#${ea}katixiya/swe_jueyi3`]: "毁灭，敲响。",
		[`#${ea}katixiya/swe_jueyi4`]: "潮涌，覆落。",
		swe_jueyi_jump: '人权之心',
		swe_jueyi_damage: '异权之力',
		swe_jueyi_immunity: '神权之意',
		swe_chaonu: '潮怒',
		swe_chaonu_info: `持恒技，限定技，出牌阶段，你可以消耗120点“决意”并选择一名其他角色，你对其造成X点伤害，（X为其手牌中的花色数且至少为1），然后你失去所有${get.poptip("swe_jueyi")}①中的效果，将武将牌替换为${get.poptip({
			id: "swe_katixiya_pop",
			name: "卡提希娅",
			type: "character",
			dialog: "characterDialog",
		})}并回复1点体力。`,
		[`#${ea}katixiya/swe_chaonu1`]: "此剑，斩灭诸恶！",
		[`#${ea}katixiya/swe_chaonu2`]: "狂澜，分割天地！",
		swe_yidemeita: "伊德梅塔",
		[`#${ea}swe_yidemeita/swe_yidemeita:die`]: "真拿你没办法呢...",
		swe_tianjian: "天剑",
		[`#${ea}swe_yidemeita/swe_tianjian1`]: "妈妈的拥抱，便是爱的秘术。",
		[`#${ea}swe_yidemeita/swe_tianjian2`]: "在毁灭中创造，妈妈也很近擅长哦。",
		swe_tianjian_info: "首轮游戏开始时，你从牌堆的前一半中选择X张基本或普通锦囊牌（X为场上男性角色数量且至少为3）并将这些牌置于你的武将牌上，你可以如手牌般使用或打出这些牌。",
		swe_tianqi: "天启",
		swe_tianqi_info: `${get.poptip("swe_xinyang")}。①你可以以${get.poptip("swe_baoneng")}的形式使用手牌，若如此做，此牌结算后你发动一次X为1的${get.poptip("swe_tianjian")}。②信仰：当你累积爆能五次后，你向${get.poptip("swe_tianqi")}①的句末添加“并增加1点体力上限、回复1点体力”。`,
		swe_tianqi_info_faith: `${get.poptip("swe_xinyang")}。①你可以以${get.poptip("swe_baoneng")}的形式使用手牌，若如此做，此牌结算后你发动一次X为1的${get.poptip("swe_tianjian")}并增加1点体力上限、回复1点体力。②信仰：已达成。`,
		[`#${ea}swe_yidemeita/swe_tianqi1`]: "对你的疼爱还不够呢。",
		[`#${ea}swe_yidemeita/swe_tianqi2`]: "嗯，不错哦。",
		[`#${ea}swe_yidemeita/swe_tianqi3`]: "就让妈妈来为你创造吧。",
		swe_baoneng: "爆能",
		swe_baoneng_info: "将两张同名牌当作一张该牌名牌使用，若如此做，此牌额外结算一次。",

		swe_congyu: "丛雨",
		swe_congyu_prefix: "神",
		[`#${ea}swe_congyu/swe_congyu:die`]: "呜呜、所以、这样、就好...",
		swe_renling: "刃灵",
		swe_renling_info: `锁定技。①游戏开始时，你将${get.poptip("swe_congyuwan")}置入一名角色的装备区并作为刃灵与该武器绑定。②你的回合开始时，若与你绑定的${get.poptip("swe_congyuwan")}不位于你的武器栏，你将之置于你的武器栏；你的回合结束时，你可以将之置于任意一名其他角色的武器栏。③当与你绑定的${get.poptip("swe_congyuwan")}置入弃牌堆后，你弃置一张牌并将之置于你的武器栏。`,
		swe_renling_append: '<span style="font-family: yuanli">无论丛雨丸位于何处，丛雨需要时都可以寻到。</span>',
		[`#${ea}swe_congyu/swe_renling1`]: "哼，不要把本座当做小孩子。",
		[`#${ea}swe_congyu/swe_renling2`]: "好，加油吧，主人。",
		[`#${ea}swe_congyu/swe_renling3`]: "胸部只不过是装饰品而已，年轻男性就是不懂这个道理。",
		[`#${ea}swe_congyu/swe_renling4`]: "你打算抛弃丛雨丸吗？主人...",
		swe_wangyue: "望月",
		swe_wangyue_info: `使命技。①其他角色计算与你的距离+(X-1)，你的手牌上限+X（X为与你绑定的${get.poptip("swe_congyuwan")}的攻击范围且至少为1），攻击范围内不包含你的角色无法使用伤害牌指定你为目标。②当你进入濒死状态时，你可以令一名角色使用一张手牌，若此牌为【杀】且该角色为你或其装备着${get.poptip("swe_congyuwan")}，你回复体力至1点。③成功：一名角色的回合结束时，若你执行过${get.poptip("swe_congyuwan")}的全部四个选项，你增加1点体力上限并回复1点体力、失去【刃灵】并与${get.poptip("swe_congyuwan")}解绑，然后更名为有地绫并获得技能【悦愉】和【执心】。④失败：当${get.poptip("swe_congyuwan")}累积进入四次弃牌堆后，此技能失去使命技标签。`,
		swe_wangyue_append: '<span style="font-family: yuanli">月亮啊，不变的只有你一个啊......</span>',
		[`#${ea}swe_congyu/swe_wangyue1`]: "打起精神来！要笑着面对困难！",
		[`#${ea}swe_congyu/swe_wangyue2`]: "月亮啊，不变的只有你一个啊...",
		swe_yueyu: "悦愉",
		swe_yueyu_info: "出牌阶段限一次，你可以与一名其他角色交换手牌，手牌数量因此增加的角色失去X点体力值，因此减少的角色摸Y张牌（X为增加的数量且至多为其体力上限点，若为你则至多为1点；Y为减少的数量且至多为其体力上限点，若为你则无限制）；前后无变化，你与其各回复1点体力并摸体力上限张牌（至多摸五张）。",
		[`#${ea}swe_congyu/swe_yueyu1`]: "只限今晚，本座允许你。",
		[`#${ea}swe_congyu/swe_yueyu2`]: "那时本座真的很开心！",
		swe_zhixin: "执心",
		swe_zhixin_info: `持恒技，每名角色于其回合中首次使用牌时，你可以令此牌无效/额外结算一次，若如此做，当你于本回合下一次受到伤害时，取消之/其的手牌上限于本回合+1。`,
		[`#${ea}swe_congyu/swe_zhixin1`]: "闭、闭嘴，主人！",
		[`#${ea}swe_congyu/swe_zhixin2`]: "主人你把嘴巴张开就行，本座喂你！",
		swe_Dfeiaoleituo: '残影的菲奥雷托',
		swe_epicseven: '七诗',
		swe_epicseven_info: '规则技，①未进行过回合的游戏开始时，你将游戏的回合顺序改为行动条形式（所有角色根据其速度推进行动条，行动条达到100%即下一个进行回合的角色）。所有角色默认初始速度为100，你初始速度为116。②所有角色的装备区内每存在一件装备，速度+5。',

		swe_hequanfeiai: "和泉妃爱",
		[`#${ea}swe_hequanfeiai/swe_hequanfeiai:die`]: "依赖哥哥...对哥哥撒娇...",
		swe_chijia: "持家",
		[`#${ea}swe_hequanfeiai/swe_chijia1`]: "欢迎回家，欢迎回家，欢迎回家！",
		[`#${ea}swe_hequanfeiai/swe_chijia2`]: "呀！显然回来晚了，我这就去做晚饭~",
		swe_chijia_info: "出牌阶段限三次，或当你受到伤害后每回合限一次，你可以重复选择是否亮出牌堆顶的一张牌，然后你指定两种不同花色的亮出牌：获得其中一种花色的所有牌，并将另一种花色的所有牌交给一名其他角色。亮出过程中若数量最多的两种花色牌数之和大于你本轮此技能发动次数，你终止此流程且此技能于本轮失效。",
		swe_chenxiang: "沉香",
		[`#${ea}swe_hequanfeiai/swe_chenxiang1`]: "哥哥，保护好我！嘿哟嘿哟~",
		[`#${ea}swe_hequanfeiai/swe_chenxiang2`]: "出门的亲亲~啾~",
		swe_chenxiang_info: "每轮每种牌名各限一次，你可以将一张【闪】当作任意普通锦囊牌使用或打出，若如此做，此技能于你再使用X次牌之前失效（X为此牌目标数+本回合此技能发动次数），且你对所有目标角色各造成1点伤害。",//若你使用此牌时是此牌目标角色之一，你重置〖持家〗。






		// 神山识
		swe_shenshanshi: "神山识",
		[`#${ea}swe_shenshanshi/swe_shenshanshi:die`]: "ごめんよ、今から行くところがあるんだ。",
		swe_zhuogui: "捉鬼",
		[`#${ea}swe_shenshanshi/swe_zhuogui1`]: "嬉しかったぜ。",
		[`#${ea}swe_shenshanshi/swe_zhuogui2`]: "いつからかこう呼ばれるようになったんだ。",
		swe_zhuogui_info: "当你使用牌指定其他角色为目标时，你可以获得其区域内的一张牌，然后此技能无法再对其发动直到其下次使用牌指定你。",
		swe_zhuogui_append: '<span style="font-family: yuanli">你知道鬼的传说吗？</span>',
		swe_guiji: "鬼姬",
		[`#${ea}swe_shenshanshi/swe_guiji1`]: "時代が変わっても策は変わらない。",
		[`#${ea}swe_shenshanshi/swe_guiji2`]: "でも、僕は幸運だったんだ。",
		swe_guiji_info: `使命技，当你获得牌时，若你手牌中没有与这些牌任一同名的牌，你可以选择获得一项未获得的效果：<br>
		1.航行技：你始终跳过判定和弃牌阶段。<br>
		2.冰鬼姬：当有角色失去牌时/受到伤害时，若其因此可弃置牌数/当前体力值小于所需值，则你可将效果修改为摸等量牌/回复等量体力。<br>
		3.火绳枪：当你造成非虚拟伤害时，你可以额外视为对其造成2X点伤害（X为伤害值）。<br>
		4.灯笼海：每回合限一次，当有角色受到非虚拟伤害时，你可以重新指定一名其他角色作为伤害来源。<br>
		成功：当你获得所有效果后，你变更武将原画为\"鬼姬\"并获得技能${get.poptip("swe_yujie")}。失败：结束阶段，若你没有手牌，你减1点体力上限、回复1点体力并删除${get.poptip("swe_zhuogui")}的发动限制。`,
		swe_hangxingji: "航行技",
		swe_hangxingji_info2: "你始终跳过判定和弃牌阶段。",
		swe_bingguiji: "冰鬼姬",
		swe_bingguiji_info2: "当有角色需要选牌弃置时/受到伤害时，若其因此可弃置牌数/当前体力值小于所需值，则你可将效果修改为摸等量牌/回复等量体力。",
		swe_huoshengqiang: "火绳枪",
		swe_huoshengqiang_info2: "当你造成非虚拟伤害时，你可以额外视为对其造成过2X点伤害（X为伤害值）。",
		swe_denglonghai: "灯笼海",
		swe_denglonghai_info2: "每回合限一次，当有角色受到伤害时，你可以重新指定一名其他角色作为伤害来源。",
		swe_yujie: "御结",
		swe_yujie_tag: "御结",
		swe_yujie_info: "你的回合结束时或每轮开始时，你可以重新指定一名其他角色，你们可以互将对方的手牌如自己的手牌般使用或打出。",
		swe_yujie_append: '<span style="font-family: yuanli">来吧，羽依里。用你的手，让我变成真正的鬼吧！</span>',

		// 鸣濑白羽
		swe_minglaibaiyu: "鸣濑白羽",
		swe_minglaibaiyu_prefix: "羽",
		[`#${ea}swe_minglaibaiyu/swe_minglaibaiyu:die`]: "我、我才没哭！",
		swe_yuzhao: "预兆",
		[`#${ea}swe_minglaibaiyu/swe_yuzhao1`]: "我担心这事真的会发生。",
		[`#${ea}swe_minglaibaiyu/swe_yuzhao2`]: "那个梦实在是太真实了。",
		swe_yuzhao_info: "当一名角色的判定牌生效前，你可以选择一项：1.观看牌堆顶的三张牌，打出其中一张牌代替之。2.选择并打出一张任意花色和点数的虚拟牌代替之，若如此做，你重新获得仅有选项一的此技能。",
		swe_chunbai: "纯白",
		[`#${ea}swe_minglaibaiyu/swe_chunbai1`]: "要向神明立誓，就不能是假装的。",
		[`#${ea}swe_minglaibaiyu/swe_chunbai2`]: "我也！！喜欢————上你了！",
		swe_chunbai_info: "锁定技，当你受到伤害时，取消之，改为流失1点体力并摸一张牌。",
		swe_kaoyu: "烤鱼",
		[`#${ea}swe_minglaibaiyu/swe_kaoyu1`]: "要吃吗？",
		[`#${ea}swe_minglaibaiyu/swe_kaoyu2`]: "为、为什么要两眼放光啊！",
		swe_kaoyu_info: "每回合限一次，你可以将本回合内获得的所有牌当任意基本牌使用。",
		swe_guying: "孤影",
		[`#${ea}swe_minglaibaiyu/swe_guying1`]: "让你...算计我！",
		[`#${ea}swe_minglaibaiyu/swe_guying2`]: "我劝你最好回头。",
		swe_guying_info: "当你需要响应其他角色使用的目标包含你的牌时，若你未响应此牌，你可以与其各进行一次伤害为2的虚拟闪电判定，若为本回合偶数次发动，则判定结果均反转。然后你技能列表上的第一个未失效技能于本回合失效。",

		// 睡死
		swe_shuisi: "睡死",
		[`#${ea}swe_shuisi/swe_shuisi:die`]: "",
		swe_fenke: "分刻",
		[`#${ea}swe_shuisi/swe_fenke1`]: "",
		[`#${ea}swe_shuisi/swe_fenke2`]: "",
		swe_fenke_info: "①游戏开始时，你获得判定、摸牌、出牌、弃牌标记。②拥有你标记的当前回合角色回合结束后，你执行一个同名阶段。③每轮开始时，你可移动一枚标记至其他角色处。",
		swe_dunyi: "遁逸",
		[`#${ea}swe_shuisi/swe_dunyi1`]: "",
		[`#${ea}swe_shuisi/swe_dunyi2`]: "",
		swe_dunyi_info: `每回合限一次，你的阶段开始前，你可以跳过此阶段，然后选择一项执行：1.你的下个判定阶段发动${get.poptip("swe_siming")}时可选择一名其他玩家一同进行判定；2.你的下个摸牌阶段摸牌时额外摸X张牌；3.你的下个出牌阶段使用过三种类别的牌后令一名其他角色流失一点体力；4.明置一名角色X张手牌，这些牌本轮无法被弃置。（X为你已损失体力值且至少为1）`,
		swe_siming: "司命",
		[`#${ea}swe_shuisi/swe_siming1`]: "",
		[`#${ea}swe_shuisi/swe_siming2`]: "",
		swe_siming_info: `锁定技，①判定阶段，你进行判定，若判定结果为♠，你受到2点无来源伤害。②摸牌阶段结束时，若你当前手牌数为全场唯一最高，你重铸一种你拥有的类别的所有手牌。③出牌阶段结束时，若你未对其他角色造成过伤害，你可移动一枚标记至其他角色处并摸一张不计入上限的牌。④弃牌阶段结束时，你令一名本轮未以此法选择过的其他角色进行弃牌阶段，若其弃置的牌中包含三种类别，你与其各增加1点体力上限。`,

		// 符玄
		swe_fuxuan: "符玄",
		[`#${ea}swe_fuxuan/swe_fuxuan:die`]: "事已前定…么……",
		swe_pitai: "否泰",
		[`#${ea}swe_fuxuan/swe_pitai1`]: "阴阳变转，生生不绝。",
		[`#${ea}swe_fuxuan/swe_pitai2`]: "物皆自成，无所不利。",
		[`#${ea}swe_fuxuan/swe_pitai3`]: "风云不测，若涉渊水。",
		swe_pitai_info: "每轮每项各限一次，当你的体力值/手牌数变化为全场最小/最少时，你可以将之调整至全场最大/最多。",
		swe_qiongguan: "穷观",
		[`#${ea}swe_fuxuan/swe_qiongguan1`]: "上下象易。",
		[`#${ea}swe_fuxuan/swe_qiongguan2`]: "相与为一。",
		[`#${ea}swe_fuxuan/swe_qiongguan3`]: "以额间之眼观之…",
		[`#${ea}swe_fuxuan/swe_qiongguan4`]: "世间万物自有其法……",
		swe_qiongguan_info: "判定阶段，你可以卜算X（X为场上人数）；结束阶段，你可以选择至多三名其他角色，直到你下次选择，每回合限一次，当其中有角色受到伤害时，你可以将此伤害转移给你。",

		// 小春
		swe_xiaochun: "小春",
		[`#${ea}swe_xiaochun/swe_xiaochun:die`]: "",
		swe_maodian: "锚点",
		[`#${ea}swe_xiaochun/swe_maodian1`]: "这会让移动变得很困难哦~",
		[`#${ea}swe_xiaochun/swe_maodian2`]: "真的会很痛的哦~",
		swe_maodian_info: "锁定技。①游戏开始时，你获得1点护甲；若你有护甲，你始终跳过你的判定阶段。②当你使用或打出存在实体牌的【杀】时，你令一名角色获得1点护甲。③你对有护甲的角色造成的伤害+2X（X为其护甲数）。",
		swe_maopao: "锚炮",
		[`#${ea}swe_xiaochun/swe_maopao1`]: "靠实力说话，全力出击！",
		[`#${ea}swe_xiaochun/swe_maopao2`]: "我说过的，工作违规是要受处罚的~",
		swe_maopao_info: "每回合限一次，当你需要使用单目标伤害牌时，你可以将体力值调整至与护甲数相同，视为使用之并选择至多X项（X为你因此调整的体力值）：1.你与此牌目标各获得1点护甲；2.目标非锁定技于本回合失效；3.摸护甲数张牌；4.此技能视为未发动过。若你因此回复过体力，你于当前回合结束时失去回复数一半（向上取整）的护甲。",

		sw_shenshouwang: "神守望",
		sw_shenshouwang_prefix: "神",
		sw_tonghun: "同婚",
		sw_tonghun_info: "游戏开始时，你可以选择一名其他角色与其获得一枚“嫁”，然后本局游戏其恢复体力时你回复等量体力，其摸牌时你摸等量的牌。",

		sw_shouwang: "守望",
		sw_tongpin: "同嫁",
		sw_tongpin2: "同嫁",
		sw_tongpin_info: `①出牌阶段限一次，你可以翻面并选择一名其他角色使其获得一枚“同嫁”标记，拥有“同嫁”标记的角色回合内【杀】使用次数+1，【杀】的伤害+1。<br>
							②每轮限一次，拥有“同嫁”标记的角色即将受到伤害时，你可以弃置X张牌（X为伤害数），将伤害转移自己。<br>
							③拥有“同嫁”标记的角色受到伤害后，其移除“同嫁”标记，你复原你的武将牌。若你本轮未发动过【同嫁②】，你回复1点体力。<br>
							④若场上存在“同嫁”标记，你的武将状态无法被更改，当你受到伤害时，防止之。
							`,
		sw_kelian: "惜玉",
		sw_kelian_info: "锁定技。当你即将受到伤害前，你令伤害来源跳过下个摸牌阶段，且直到你的下个回合开始，你计算与其他角色距离+X（X为累积总伤害点数）。",

		sw_lutiandilang: "鹿天帝朗",
		sw_lutiandilang_prefix: "鹿天帝",
		sw_renjie: "戒忍",
		sw_renjie_info: "锁定技。当你即将造成伤害时，取消之，并获得等同于伤害数量两倍的“精气”。当你受到伤害时，获得一枚“精气“（“精气“上限为5）。你每次受到的伤害最多不会超过2点。你的手牌上限+X（X为“精气”标记个数）。",
		sw_sanyang: "散阳",
		sw_sanyang_info: "当你成为任意牌的目标时，若你有“精气”，你可以弃置一枚“精气”，取消此牌的所有目标。",
		sw_luguan: "鹿关",
		sw_luguan_info: `出牌阶段限一次。你可以弃置所有“精气”并表演鹿关，根据你鹿关完成的速度和弃置的“精气”数量对一名其他玩家等比造成0-2点火焰伤害（完成速度越快，标记越多，伤害越高），然后根据其性别额外执行如下效果：<br>
							①含女性：若其没有技能【害羞】，其获得之。<br>
							②其他：若其没有技能【愤懑】，其获得之。<br>
							当你在一局游戏中第三次使用该技能并结算完毕后，你死亡。<br>
							`,
		sw_xinhuo: "心火",
		sw_xinhuo_info: "锁定技。每当你使用偶数次牌时，你令武将牌上的前一个未失效的技能失效直到你的回合开始/回合结束。然后你摸等同于你当前失效技能个数的牌。当你因为【心火】导致此技能失效时，你减一点体力上限。",
		sw_haixiu: "害羞",
		sw_haixiu_info: "锁定技。每当你获得牌后，你获得等同于获得牌数的“害羞”标记。每获得8个害羞标记，你失去一点体力。",
		sw_fenmen: "愤懑",
		sw_fenmen_info: "锁定技。每当你造成伤害后，你获得等同于造成伤害数的“愤懑”标记。每获得3个愤懑标记，你失去一点体力。",

		sw_shenqinlang: "神秦朗",
		sw_shenqinlang_prefix: "神",
		sw_nanchong: "男宠",
		sw_nanchong_info: "当你使用牌后，你可以将手牌摸至或弃置至你的体力上限数。然后若你以此法：得到牌，你的体力上限-1；失去牌，你的体力上限+1。",
		sw_weige: "伟哥",
		sw_weige_info: "每回合限两次。当你造成或受到伤害后，你可以将体力上限重置为 7，令伤害来源弃置至多X张牌，然后你摸Y张牌（X为你以此法变化的体力上限且至少为1，Y为X减其以此法弃置的牌数）。",

		sw_gushenlangfeite: "股神朗菲特",
		sw_gushenlangfeite_prefix: "股神",
		sw_shangshi: "上市",
		sw_shangshi_info: "①你的回合结束时，你可以选择至多<span class=thundertext>3</span>张牌置于你的武将牌上并摸等量的牌，称为股，若你至少选择了一张牌入股且你没有护甲，你获得一点护甲。若你没有选择任何牌，则你可以进行一次判定并将判定牌置入股。②其他角色的回合开始时，若你的武将牌上有股，你令其选择一项：1.选择一张牌入股2.流失<span class=firetext>3</span>点体力。然后其进行一次判定，你将其选择的牌和判定牌置入股。③你的手牌上限始终+X（X为【上市①】中的数字）",
		sw_kaipan: "开盘",
		sw_kaipan_info: "锁定技。你的回合开始时，若你有股，你需猜测股票的涨跌情况并展示所有股，分别统计红色牌和黑色牌点数之和，若①红色牌点数和大于黑色牌点数和(涨)，所有入股角色摸等同于入股红色牌数量乘2的牌，且你1.猜测正确：你获得【金睛】【资本】直到回合结束。2.猜测错误：你令【上市①】中的数字减1。②黑色牌点数和大于等于红色牌点数数量的和(跌)，所有入股角色失去等同于入股红色牌数量的体力，且你1.猜测正确：你回复1点体力，获得技能【反馈】直到你的下回合开始。2.猜测错误：你令【上市②】中的数字减1。结算完毕后你弃置所有股。",
		sw_ziben: "资本",
		sw_ziben_info: "当你对其他角色造成伤害后，你可以获得目标区域内的一张牌。",

		sw_shenaoliao: "神奥利奥",
		sw_shenaoliao_prefix: "神",
		sw_kanpo: "看破",
		sw_kanpo_info: `①一轮游戏开始时，你清除${get.poptip("sw_kanpo")}①记录的牌名，然后你可以依次记录任意个牌名（对其他角色不可见），每轮至多记录4个牌名，总共最多记录12个牌名。若你没有记录次数，则你失去${get.poptip("sw_kanpo")}，从剩余牌堆中获得所有智囊牌各一张，并获得技能${get.poptip("swq_jincui")}。②其他角色使用你${get.poptip("sw_kanpo")}①记录过的牌名的牌时，你可以移去一个${get.poptip("sw_kanpo")}①中的此牌名的记录令此牌无效，然后你摸一张牌。`,
		sw_zhinang: "智囊",
		sw_zhinang_info: "锁定技。当你使用非虚拟非转化且对应实体牌为1的智囊锦囊牌时，系统从技能描述中包含“无懈可击|过河拆桥|顺手牵羊|无中生有|乐不思蜀”字样的技能中随机选择三个你未拥有的技能，然后你令自己获得其中一个技能",
		sw_shenjincui: "尽瘁",
		sw_shenjincui_info: "锁定技。准备阶段，若牌堆剩余智囊数：大于9，你加一点体力上限并摸一张牌;大于等于7，你使用【杀】的次数上限+1;小于7，你减一点体力上限且至多减至三",



		sw_hepingshizhelang: "和平使者朗",
		sw_gugu: "咕咕",
		sw_gugu_info: "①游戏开始时/结束阶段，你可以将一张♦牌当做【乐不思蜀】对自己使用，然后摸1张牌。②当你成为牌的目标时，若目标数为1且你的判定区有牌，你令此牌无效。",
		sw_heping: "和平",
		sw_heping_info: "锁定技。游戏开始时，你令所有存活且未拥有“和平”的角色获得“和平”标记，拥有“和平”标记角色的♠牌和♠判定牌的花色视为♥，♣牌和♣判定牌的花色视为♦。你的♦牌不计入手牌上限。",
		sw_shangzhuo: "上桌",
		sw_shangzhuo_info: "觉醒技。当你受到伤害后，你须废除自己的判定区，然后将武将牌替换为从X张武将牌中选择的一张（X为你的手牌数+1），并将体力和体力上限调整至3点，回复1点体力。",








		// 约会大作战
		swyz_keyword_dualside: "关于『双面武将』",
		swyz_keyword_dualside_info: "<li>根据角色的两种翻面状态，应用分别两张武将牌的技能，独立计算体力值。<br>当角色翻面后，根据当前翻面状态切换对应面的武将牌、更换相应技能并调整体力与体力上限。</li><br><br>",
		visible_swyz: "明置牌",
		// 鸢一折纸
		swyz_yuanyizhezhi: "鸢一折纸",
		[`#${ea}swyz_yuanyizhezhi/swyz_yuanyizhezhi:die`]: "",

		swyz_tianyi: "天翼",
		swyz_tianyi_info: "你使用牌指定其他角色为目标后，你可以令任意个目标无效，这些角色各弃置一张牌。",
		swyz_shengmian: "圣冕",
		swyz_shengmian_info: "锁定技，其他角色失去最后的手牌时，你摸一张牌。",
		swyz_rilun: "日轮",
		swyz_rilun_info: "每回合限一次，你可以将一张♦手牌当做【万箭齐发】使用。",
		swyz_paoguan: "炮冠",
		swyz_paoguan_info: "限定技，出牌阶段，你可以弃置至少一张花色不同的手牌，对攻击范围内的一名角色造成等量伤害。其他角色各可弃置两张牌令伤害值-1。",

		// 本条二亚
		[`#${ea}swyz_yuanyizhezhi/swyz_tianyi1`]: "",
		[`#${ea}swyz_yuanyizhezhi/swyz_tianyi2`]: "",
		[`#${ea}swyz_yuanyizhezhi/swyz_shengmian1`]: "",
		[`#${ea}swyz_yuanyizhezhi/swyz_shengmian2`]: "",
		[`#${ea}swyz_yuanyizhezhi/swyz_rilun1`]: "",
		[`#${ea}swyz_yuanyizhezhi/swyz_rilun2`]: "",
		[`#${ea}swyz_yuanyizhezhi/swyz_paoguan1`]: "",
		[`#${ea}swyz_yuanyizhezhi/swyz_paoguan2`]: "",

		swyz_bentiaoerya: "本条二亚",
		[`#${ea}swyz_bentiaoerya/swyz_bentiaoerya:die`]: "",

		swyz_xiaolan: "晓览",
		swyz_xiaolan_info: "你可以明置一张♦手牌并跳过摸牌阶段，然后观看牌堆（无序），从其中获得一至两张牌，这些牌本回合不计入手牌上限。",
		swyz_niegao: "嗫告",
		swyz_niegao_info: "攻击范围内有你的角色每回合第一次使用牌A时，若牌A为主动即时牌，你可以明置一张主动牌B，令其为牌A按牌B主动使用的方式重新指定目标。",
		[`#${ea}swyz_bentiaoerya/swyz_niegao1`]: "",
		[`#${ea}swyz_bentiaoerya/swyz_niegao2`]: "",
		// 时崎狂三


		swyz_shiqikuangsan: "时崎狂三",
		[`#${ea}swyz_shiqikuangsan/swyz_shiqikuangsan:die`]: "士道...",
		swyz_lingli: "灵力",
		swyz_zidan: "子弹",

		swyz_shiyu: "食域",
		swyz_shiyu_info: `${get.poptip("swyz_lingyuji")}。未拥有${get.poptip("swyz_shiyu")}的角色对未拥有${get.poptip("swyz_shiyu")}的角色造成的伤害改为流失等量体力。`,
		swyz_shiyan: "时魇",
		swyz_shiyan_info: `${get.poptip("swyz_lingnengji")}（12/24）。你的“时间”描述等同于“灵力”。①当有角色失去体力时，你获得等量“时间”。②刻刻帝（Zaphkiel）：你首次召唤时，从牌堆获得A-Q点数的牌各一张置于武将牌上，称为“子弹”。出牌阶段限一次，你可以将任意张手牌置于武将牌上。你可以${get.poptip("swyz_xiaohao")}一张“子弹”点数为X的牌或使用1点“灵力”来发动${get.poptip("swyz_shidanxiaoguo")}（X为时弹序号）。`,
		swyz_shidan_I: "一弹",
		swyz_shidan_I_info: "出牌阶段限一次，你可以令你本回合使用牌无距离限制。",
		swyz_shidan_II: "二弹",
		swyz_shidan_II_info: "出牌阶段限一次，你可以令一名其他角色攻击距离-1直到其下回合结束。",
		swyz_shidan_III: "三弹",
		swyz_shidan_III_info: "每回合限一次，当你造成伤害后，你可以额外造成1点同属性伤害。",
		swyz_shidan_IV: "四弹",
		swyz_shidan_IV_info: "每回合限一次，当你受到伤害后，你可以恢复1点体力。",
		swyz_shidan_V: "五弹",
		swyz_shidan_V_info: "判定阶段开始时，你可以卜算4。",
		swyz_shidan_VI: "六弹",
		swyz_shidan_VI_info: "弃牌阶段开始时，你可以跳过此阶段，若你的手牌数小于等于手牌上限，你额外获得一个出牌阶段。",
		swyz_shidan_VII: "七弹",
		swyz_shidan_VII_info: "当你响应牌后，你可以令当前回合角色使用的下一张牌无效。",
		swyz_shidan_VIII: "八弹",
		swyz_shidan_VIII_info: "当你翻面或跳过阶段时，你可以取消之。",
		swyz_shidan_IX: "九弹",
		swyz_shidan_IX_info: "当你不因摸牌阶段和此技能而获得牌时，你可以摸两张牌并弃置一张牌。",
		swyz_shidan_X: "十弹",
		swyz_shidan_X_info: "当你不因弃牌阶段和此技能而弃置牌时，你可以弃置一名角色的一张牌。",
		swyz_shidan_XI: "十一弹",
		swyz_shidan_XI_info: `当你令其他角色进入濒死时，你可以令其与你拼点，若你赢，你获得1点“时间”，且你可以额外扣除11点“时间”令其直接死亡，若如此做，消散天使。`,
		swyz_shidan_XII: "十二弹",
		swyz_shidan_XII_info: `当你进入濒死时，你可以与一名其他角色拼点，若你赢，你获得1点“时间”，且你可以额外扣除12点“时间”将体力值与手牌数调整至游戏开始，若如此做，消散天使。`,
		[`#${ea}swyz_shiqikuangsan/swyz_shiyan1`]: "时间不能摆脱命运的枷锁。",
		[`#${ea}swyz_shiqikuangsan/swyz_shiyan2`]: "偶尔像这样感觉还不错。",
		[`#${ea}swyz_shiqikuangsan/swyz_shiyan3`]: "啊呵呵，还请多多关照啊。",
		[`#${ea}swyz_shiqikuangsan/swyz_shiyan4`]: "感觉很寂寞呢。",


		// 氷芽川四糸乃


		swyz_bingyachuansisinai: "氷芽川四糸乃",
		[`#${ea}swyz_bingyachuansisinai/swyz_bingyachuansisinai:die`]: "",

		swyz_bingyachuansisinai_ab: "四糸乃",
		swyz_xueyin: "雪吟",
		swyz_xueyin_info: "当你弃置其他角色区域内的牌后，你可以摸两张牌，然后交给其一张手牌。",
		swyz_hanqiao: "寒峭",
		swyz_hanqiao_info: "你可以将一张♣牌当做冰【杀】使用。此牌对目标角色结算完后，其可以“响应此牌”的形式打出一张【闪】并回复1点体力。",
		swyz_dongjie: "冻结",
		swyz_dongjie_info: "锁定技，若你已受伤，其他角色在你的回合内不能使用牌。",

		// 五河琴里
		[`#${ea}swyz_bingyachuansisinai/swyz_xueyin1`]: "",
		[`#${ea}swyz_bingyachuansisinai/swyz_xueyin2`]: "",
		[`#${ea}swyz_bingyachuansisinai/swyz_hanqiao1`]: "",
		[`#${ea}swyz_bingyachuansisinai/swyz_hanqiao2`]: "",
		[`#${ea}swyz_bingyachuansisinai/swyz_dongjie1`]: "",
		[`#${ea}swyz_bingyachuansisinai/swyz_dongjie2`]: "",

		swyz_wuheqinli: "五河琴里",
		[`#${ea}swyz_wuheqinli/swyz_wuheqinli:die`]: "",

		swyz_chongran: "重燃",
		swyz_chongran_info: "锁定技，当你不因使用或打出而失去暗置牌后，从弃牌堆中获得并明置之。当你受到伤害后，你摸一张牌并明置之。",
		swyz_yanxi: "炎息",
		swyz_yanxi_info: "你可以将两张明置牌当做【酒】使用并摸一张牌。【酒】的伤害加成对你的伤害类锦囊牌同样生效。",
		swyz_chizhuo: "炽灼",
		swyz_chizhuo_info: "你可以将一张♣牌当做【火攻】使用。当目标角色因此【火攻】展示牌时，你弃置之并摸一张牌。",

		// 星宫六喰
		[`#${ea}swyz_wuheqinli/swyz_chongran1`]: "",
		[`#${ea}swyz_wuheqinli/swyz_chongran2`]: "",
		[`#${ea}swyz_wuheqinli/swyz_yanxi1`]: "",
		[`#${ea}swyz_wuheqinli/swyz_yanxi2`]: "",
		[`#${ea}swyz_wuheqinli/swyz_chizhuo1`]: "",
		[`#${ea}swyz_wuheqinli/swyz_chizhuo2`]: "",

		swyz_xinggongliucan: "星宫六喰",
		[`#${ea}swyz_xinggongliucan/swyz_xinggongliucan:die`]: "",

		swyz_bisuo: "闭锁",
		swyz_bisuo_info: "每回合限一次，你攻击范围内的角色进行第X个阶段前，你可以回复1点体力，令其跳过此阶段。（X为你已损失的体力值）",
		swyz_xinyao: "心钥",
		swyz_xinyao_info: `锁定技，①除濒死状态外，你也可成为其他角色使用【桃】的目标。②当其他角色令你回复体力后，本局游戏内，由其选择你是否对其发动${get.poptip("swyz_bisuo")}。`,
		swyz_fengjie: "封解",
		swyz_fengjie_info: "当你回复所有体力后，你可以失去任意点体力，摸等量张牌。然后你可以减1点体力上限，直到你下个回合结束前，你使用牌不能被响应。",

		// 镜野七罪
		[`#${ea}swyz_xinggongliucan/swyz_bisuo1`]: "",
		[`#${ea}swyz_xinggongliucan/swyz_bisuo2`]: "",
		[`#${ea}swyz_xinggongliucan/swyz_xinyao1`]: "",
		[`#${ea}swyz_xinggongliucan/swyz_xinyao2`]: "",

		swyz_jingyeqizui: "镜野七罪",
		[`#${ea}swyz_jingyeqizui/swyz_jingyeqizui:die`]: "",

		swyz_jingxiang: "镜像",
		swyz_jingxiang_info: "锁定技，①其他角色每回合第一次使用非装备牌后，你获得一张【影】并使之视为此牌名的牌。②你使用♠牌后，该技能本回合失效（因此获得的【影】“视为”修正也会失效）。",
		swyz_fangxing: "仿形",
		swyz_fangxing_info: "每轮开始时，你可以将两张手牌交给一名其他角色，获得其武将牌的一个技能直到你下次发动之或本轮结束。",

		// 八舞耶俱矢
		[`#${ea}swyz_jingyeqizui/swyz_jingxiang1`]: "",
		[`#${ea}swyz_jingyeqizui/swyz_jingxiang2`]: "",
		[`#${ea}swyz_jingyeqizui/swyz_fangxing1`]: "",
		[`#${ea}swyz_jingyeqizui/swyz_fangxing2`]: "",

		swyz_bawuyejushi: "八舞耶俱矢",
		[`#${ea}swyz_bawuyejushi/swyz_bawuyejushi:die`]: "",

		swyz_jufeng: "飓风",
		swyz_jufeng_info: "你使用♠牌指定唯一目标后，你可以令其横置并将区域内的所有牌洗入牌堆，然后摸等量张牌。",
		swyz_jichi: "疾驰",
		swyz_jichi_info: "锁定技，你使用的牌无距离次数限制；当每回合累计有八张牌进入弃牌堆后，你翻面并结束当前阶段与回合（不终止当前其余结算）。",

		// 八舞夕弦
		[`#${ea}swyz_bawuyejushi/swyz_jufeng1`]: "",
		[`#${ea}swyz_bawuyejushi/swyz_jufeng2`]: "",
		[`#${ea}swyz_bawuyejushi/swyz_jichi1`]: "",
		[`#${ea}swyz_bawuyejushi/swyz_jichi2`]: "",

		swyz_bawuxixian: "八舞夕弦",
		[`#${ea}swyz_bawuxixian/swyz_bawuxixian:die`]: "",

		swyz_xieliao: "解镣",
		swyz_xieliao_info: "当你需要使用【闪】或【无懈可击】时，你可以重置当前回合角色，视为使用之。",
		swyz_tianji: "天际",
		swyz_tianji_info: "锁定技，每回合限一次，当你使用或打出牌响应其他角色后，你摸两张牌；本回合结束后，你翻面。",

		// 八舞姊妹
		[`#${ea}swyz_bawuxixian/swyz_xieliao1`]: "",
		[`#${ea}swyz_bawuxixian/swyz_xieliao2`]: "",
		[`#${ea}swyz_bawuxixian/swyz_tianji1`]: "",
		[`#${ea}swyz_bawuxixian/swyz_tianji2`]: "",

		swyz_bawushuangjiang: "八舞耶俱矢&八舞夕弦",
		[`#${ea}swyz_bawushuangjiang/swyz_bawushuangjiang:die`]: "",

		swyz_bawushuangjiang_ab: "八舞姊妹",
		swyz_shuangsheng: "双生",
		swyz_shuangsheng_info: `锁定技，①游戏开始时，你将此武将牌更换为${get.poptip({ id: "swyz_bawuyejushi", name: "八舞耶俱矢", type: "character", dialog: "characterDialog" })}或${get.poptip({ id: "swyz_bawuxixian", name: "八舞夕弦", type: "character", dialog: "characterDialog" })}，若你没有背面武将，将另一张武将牌作为背面武将。②若你有存活的背面武将，翻面状态不会使你跳过回合。`,
		swyz_shuangsheng2: "双生",
		swyz_shuangsheng2_info: "锁定技，若你有存活的背面武将，翻面状态不会使你跳过回合。",

		// 诱宵美九

		swyz_youxiaomeijiu: "诱宵美九",
		[`#${ea}swyz_youxiaomeijiu/swyz_youxiaomeijiu:die`]: "",

		swyz_hexian: "和弦",
		swyz_hexian_info: "每张牌限一次，你使用即时牌结算完后，手牌数等于你的其他角色可以“响应此牌”的形式使用一张即时牌。",
		swyz_xiezou: "协奏",
		swyz_xiezou_info: "锁定技，当你使用或打出牌响应或被响应其他角色后，你向对方以双方使用或打出的牌发起拼点，赢的角色摸一张牌；若拼点牌不含♥♠以外的花色，你摸一张牌。",

		// 夜刀神十香
		[`#${ea}swyz_youxiaomeijiu/swyz_hexian1`]: "",
		[`#${ea}swyz_youxiaomeijiu/swyz_hexian2`]: "",
		[`#${ea}swyz_youxiaomeijiu/swyz_xiezou1`]: "",
		[`#${ea}swyz_youxiaomeijiu/swyz_xiezou2`]: "",

		swyz_yedaoshenshixiang: "夜刀神十香",
		[`#${ea}swyz_yedaoshenshixiang/swyz_yedaoshenshixiang:die`]: "",

		swyz_zhongjian: "终剑",
		swyz_zhongjian_info: "你可以展示手牌，将其中数量最多（或之一）的一种花色所有牌当做【杀】使用，此牌伤害基值为X（X为对应实体牌数，且至多为游戏轮数）。",
		swyz_aosha: "鏖杀",
		swyz_aosha_info: "结束阶段，若本回合有四种花色的牌进入弃牌堆，则你可以获得一个只有摸牌阶段和出牌阶段的额外回合。",


		[`#${ea}swyz_yedaoshenshixiang/swyz_zhongjian1`]: "",
		[`#${ea}swyz_yedaoshenshixiang/swyz_zhongjian2`]: "",
		[`#${ea}swyz_yedaoshenshixiang/swyz_aosha1`]: "",
		[`#${ea}swyz_yedaoshenshixiang/swyz_aosha2`]: "",


	},
	dynamicTranslate: {
		swx_sijie(player) {
			const vp = player.countMark("swx_sijie_viewplus");
			const gp = player.countMark("swx_sijie_gainplus");
			return `每名角色每回合限一次，当你/有“瑰痕”的角色使用牌指定有“瑰痕”的角色/你后，你移除其所有“瑰痕”，然后观看牌堆顶X+<span class="bluetext">${vp}</span>张牌（X为移除的“瑰痕”数），获得其中至多<span class="yellowtext">${1 + gp}</span>张，其余牌以任意顺序置于牌堆顶或牌堆底。每当移除八个“瑰痕”标记，你从牌堆获得一张血【杀】并选择一项：1.此技能的蓝色数字+1（至多4）；2.此技能的黄色数字+1（至多4）。`;
		},
		swlu_juejie(player, skill) {
			const bool = player.storage[skill];
			let yang = "你从牌堆中获得一张普通锦囊/基本牌", yin = "你令一名角色使用其手牌中的一张普通锦囊/基本牌";
			if (bool) {
				yin = `<span class="bluetext">${yin}</span>`;
			} else {
				yang = `<span class="firetext">${yang}</span>`;
			}
			return `转换技。每回合限三次，当你受到基本/普通锦囊牌的伤害后，阳：${yang}；阴：${yin}。${get.poptip("luguan")}：你减1点体力上限，防止你本回合受到的伤害并获得一张基本牌和普通锦囊牌。`;
		},
		swe_wangyue(player) {
			if (player.storage.swe_wangyue_noDuty) {
				const p = get.poptip("swe_congyuwan");
				return `其他角色计算与你的距离+X，你的手牌上限+X（X为与你绑定的${p}的攻击范围且至少为1），攻击范围内不包含你的角色无法使用伤害牌指定你为目标。当你进入濒死状态时，你可以令一名角色使用一张手牌，若此牌为【杀】且该角色为你或其装备着${p}，你回复体力至1点。`;
			}
			return lib.translate.swe_wangyue_info;
		},
		sw_shangshi(player) {
			var info = lib.skill.sw_shangshi.getInfo(player);
			return "①你的回合结束时，你可以选择至多<span class=thundertext>" + info[0] + "</span>张牌置于你的武将牌上并摸等量的牌，称为股，若你至少选择了一张牌入股且你没有护甲，你获得一点护甲。若你没有选择任何牌，则你可以进行一次判定并将判定牌置入股。②其他角色的回合开始时，若你的武将牌上有股，你令其选择一项：1.选择一张牌入股2.流失<span class=firetext>" + info[1] + "</span>点体力。然后其进行一次判定，你将其选择的牌和判定牌置入股。③你的手牌上限始终+等同于【上市①】中的数字";
		},
		swq_jifeng(player) {
			if (player.getStorage("swq_jifeng", 0) == 0) return get.skillInfoTranslation("swq_jifeng");
			else return get.skillInfoTranslation("swq_jifeng_lv2");
		},
		swq_duannian(player) {
			let list = ["1.摸剩余选项张牌并回复1点体力", "2.重置该技能并删除最后一个选项", "3.获得一名其他角色的一个技能", `4.升级${get.poptip("swq_jifeng")}`];
			const num = player.getStorage("swq_duannian_dnum", 0);
			list.length = list.length - num;
			return `持恒技，限定技，当你脱离濒死状态时，你可以选择依次执行至多X项：${list.join(';')}。（X为距你上次发动此技能后进入濒死状态的次数）`;
		},
		swq_juejing(player) {
			if (player.getStorage("swq_juejing", 0) == 0) return get.skillInfoTranslation("swq_juejing");
			else return get.skillInfoTranslation("swq_juejing_lv2");
		},
		swq_qingnian(player) {
			if (!player.storage.swq_qingnian) return `转换技。①游戏开始时，你可以转换此技能状态；②每回合限三次，当你不因使用而失去手牌时，你可以：<span class="firetext">阳，将手牌摸至体力上限并随机明置一名其他角色的X张手牌；</span>阴，明置一张手牌并弃置一名其他角色的至多X张牌，然后你将被弃置的牌以任意顺序置于牌堆顶或牌堆底。（X为你本次失去牌的数量）`;
			return `转换技。①游戏开始时，你可以转换此技能状态；②每回合每项各限一次，当你不因使用而失去手牌时，你可以：阳，将手牌摸至体力上限并随机明置一名其他角色的X张手牌；<span class="bluetext">阴，明置一张手牌并弃置一名其他角色的至多X张牌，然后你将被弃置的牌以任意顺序置于牌堆顶或牌堆底。</span>（X为你本次失去牌的数量）`;
		},
		swq_buce(player) {
			if (!player.storage.swq_buce) return `转换技，每名角色的回合开始时，你可以：<span class="firetext">阳，摸X张牌并令你至其他角色的距离-X；</span>阴，弃置至多Y张牌并令你至其他角色的距离+Y。（X为你与当前回合角色的距离，Y为你弃置的牌数且至多为你的体力上限）`;
			return `转换技，每名角色的回合开始时，你可以：阳，摸X张牌并令你至其他角色的距离-X；<span class="bluetext">阴，弃置至多Y张牌并令你至其他角色的距离+Y。</span>（X为你与当前回合角色的距离，Y为你弃置的牌数且至多为你的体力上限）`;
		},
		swlu_kuiqing(player) {
			const luguan = get.poptip("luguan");
			if (!player.storage.swlu_kuiqing) {
				return `转换技。①游戏开始时，你可以转换此技能状态；②每回合限三次，<span class="firetext">阳：当有花色相同的牌被连续使用后，你可以将手牌调整至体力上限并选择一名其他角色的至多X张未拥有此法标记的手牌，这些牌被标记为“葵倾”且于本轮中无法被使用、打出或弃置；</span>阴：当有转化或虚拟牌被使用时，你可以将手牌调整至1并选择一名其他角色，令其于下个回合开始前使用的前X次牌无效。（X为你手牌调整前后的差值-1且至少为1）；${luguan}：你减1点体力上限并将体力恢复至上限。`;
			}
			return `转换技。①游戏开始时，你可以转换此技能状态；②每回合限三次，阳：当有花色相同的牌被连续使用后，你可以将手牌调整至体力上限并选择一名其他角色的至多X张未拥有此法标记的手牌，这些牌被标记为“葵倾”且于本轮中无法被使用、打出或弃置；<span class="bluetext">阴：当有转化或虚拟牌被使用时，你可以将手牌调整至1并选择一名其他角色，令其于下个回合开始前使用的前X次牌无效。</span>（X为你手牌调整前后的差值-1且至少为1）；${luguan}：你减1点体力上限并将体力恢复至上限。`;
		},
		swq_wendao(player) {
			if (!player.storage.swq_wendao) {
				return `转换技，每回合每项各限一次，当你成为体力值不小于你的其他角色使用牌的目标后，你可以：<span class="firetext">阳，失去1点体力并视为使用一张无距离限制的雷【杀】；</span>阴，回复1点体力并视为使用一张目标须包含自己的【铁索连环】。`;
			}
			return `转换技，每回合每项各限一次，当你成为体力值不小于你的其他角色使用牌的目标后，你可以：阳，失去1点体力并视为使用一张无距离限制的雷【杀】；<span class="bluetext">阴，回复1点体力并视为使用一张目标须包含自己的【铁索连环】。</span>`;
		},
		swyg_hongyan(player) {
			const num = Math.abs(player.getHandcardLimit() - player.getHp()) + 1 || 1;
			const lists = ["①♠", "②♣", "③♦"];
			const quoted = lists.map((opt, i) => (i < num ? `<span class=thundertext>${opt}</span>` : opt));
			return `锁定技，你获得以下前X+1项效果：你区域内的${quoted.join("")}牌和对应花色的判定牌均视为♥。（X为你的手牌上限和体力值之差且至少为1）`;
		},
		swe_tianqi(player) {
			if (player.storage.swe_tianqi_faith) {
				return lib.translate.swe_tianqi_info_faith;
			}
			return lib.translate.swe_tianqi_info;
		},
		swe_yuzhao(player) {
			if (player.getStorage("swe_yuzhao", false)) {
				return "当一名角色的判定牌生效前，你可以观看牌堆顶的三张牌，打出其中一张牌代替之。";
			}
			return lib.translate.swe_yuzhao_info;
		},
	},
	func: function () {
		lib.namePrefix.set('异构', {
			color: "#e7c3ff",
			nature: "thundermm",
			showName: '异',
		})
		lib.namePrefix.set('鹿帝', {
			getSpan: () => {
				const span = document.createElement("span");
				span.style.fontFamily = "NonameSuits";
				span.textContent = "🦌";
				return span.outerHTML;
			},
		})
		lib.namePrefix.set('瑰血', {
			getSpan: () => {
				const span = document.createElement("span");
				span.style.fontFamily = "NonameSuits";
				span.textContent = "🌹";
				return span.outerHTML;
			},
		})
		lib.namePrefix.set("月潮", {
			getSpan: () => {
				const span = document.createElement("span");
				span.style.fontFamily = "NonameSuits";
				span.textContent = "🌊";
				return span.outerHTML;
			},
		});
		lib.namePrefix.set("碧野", {
			getSpan: () => {
				const span = document.createElement("span");
				span.style.fontFamily = "NonameSuits";
				span.textContent = "🌿";
				return span.outerHTML;
			},
		});
		lib.namePrefix.set("剑挽", {
			getSpan: () => {
				const span = document.createElement("span");
				span.style.fontFamily = "NonameSuits";
				span.textContent = "🗡️";
				return span.outerHTML;
			},
		});
		swTool.addGroup("sw_blood", '血', '血庭', { color: '#9a1111' });
		if (!lib.group.includes("key")) {
			lib.group.add("key");
		}
		swTool.addNature(
			'sw_xue',
			'血',
			{ linked: false, order: 60, lineColor: [154, 17, 17], color: '#9a1111' },
			"rgba(154,17,17,1)",
			"出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点血属性伤害。若你造成血属性伤害，你回复1点体力，然后你可以选择对自己造成1点伤害，若如此做，你摸1张牌且本回合出杀次数+1。"
		)
		swTool.addNature(
			'sw_shui',
			'水',
			{ linked: true, order: 50, lineColor: [0, 161, 233], color: '#00A1E9' },
			"rgba(40,243,223,1)",
		)
		lib.poptip.add({
			id: "luguan",
			name: "鹿关",
			info: "常写为鹿关X，鹿天帝包专有名词。当你于一回合内首次使用该技能或该分支达到X次时，触发对应效果。（X默认为3）",
		});
		lib.poptip.add({
			id: "swyc_chaoqi",
			name: "潮起",
			info: "当你发动技能时，若此次发动的技能与上一次发动的技能在技能列表中的相对位置相邻，且此次发动的技能在顺序中更靠后，则触发对应效果（不计算衍生技与潮起落）。",
		});
		lib.poptip.add({
			id: "swyc_chaoluo",
			name: "潮落",
			info: "当你发动技能时，若此次发动的技能与上一次发动的技能在技能列表中的相对位置相邻，且此次发动的技能在顺序中更靠前，则触发对应效果（不计算衍生技与潮起落）。",
		});
		lib.poptip.add({
			id: "swe_baoneng",
			name: "爆能",
			info: "将两张同名牌当作一张该牌名牌使用，若如此做，此牌额外结算一次。",
		});
		lib.poptip.add({
			id: "swe_xinyang",
			name: "信仰技",
			info: "达成信仰条件可以获得效果强化的技能类型。",
		});
		lib.poptip.add({
			id: "swwz_info",
			name: "纹章",
			info: "buff效果的一种。",
		});
		lib.poptip.add({
			id: "swwz_zhanxinshaonv_os",
			name: "崭新的少女·欧丝",
			info: "有角色的回合结束时，若你的手牌数不大于体力值，你摸已损失体力值张牌（至少为1，至多为5），反之，你回复1点体力。",
		});
		lib.poptip.add({
			id: "jingmotiaozheng",
			name: "静默调整",
			info: "不触发任何技能的调整。",
		});
		lib.poptip.add({
			id: "swyc_jinengpai",
			name: "技能牌",
			info: "技能牌为始终明置的手牌且持有时-1手牌上限（无论多少），获得/失去技能牌的角色获得/失去该技能，当技能牌进入弃牌堆时，该技能返回原拥有者。",
		});
		// 约会大作战分包关键词
		lib.poptip.add({
			id: "swyz_lingnengji",
			name: "灵能技",
			info: "持恒技的子类，部分效果需要召唤天使才可以使用的技能。每轮开始时或你的回合开始时，可以召唤天使。天使存在期间，每个回合结束时，扣除等同于召唤天使数量的“灵力”，若此时“灵力”不大于0，天使自动消散，否则你可以手动消散。灵能上限取所有拥有灵能技灵能上限的和。",
		});
		lib.poptip.add({
			id: "swyz_xiaohao",
			name: "消耗",
			info: "将被消耗的牌移出游戏。",
		});
		lib.poptip.add({
			id: "swyz_lingyuji",
			name: "领域技",
			info: "角色存活时始终存在的光环效果。",
		});
		lib.poptip.add({
			id: "swyz_shidanxiaoguo",
			name: "时弹效果",
			info: `————————————<br>————————————<br>————————————<br>————————————<br><li>I之弹<br>-${lib.translate["swyz_shidan_I_info"]}</li><li>II之弹<br>-${lib.translate["swyz_shidan_II_info"]}</li><li>III之弹<br>-${lib.translate["swyz_shidan_III_info"]}</li><li>IV之弹<br>-${lib.translate["swyz_shidan_IV_info"]}</li><li>V之弹<br>-${lib.translate["swyz_shidan_V_info"]}</li><li>VI之弹<br>-${lib.translate["swyz_shidan_VI_info"]}</li><li>VII之弹<br>-${lib.translate["swyz_shidan_VII_info"]}</li><li>VIII之弹<br>-${lib.translate["swyz_shidan_VIII_info"]}</li><li>IX之弹<br>-${lib.translate["swyz_shidan_IX_info"]}</li><li>X之弹<br>-${lib.translate["swyz_shidan_X_info"]}</li><li>XI之弹<br>-${lib.translate["swyz_shidan_XI_info"]}</li><li>XII之弹<br>-${lib.translate["swyz_shidan_XII_info"]}</li>`,
		});
		lib.translate["swyz_shuangsheng_append"] = `<span style="font-family: yuanli">
			&emsp;八舞耶俱矢&ensp;体力：4/4
			<br><br><b>【${get.poptip("swyz_jufeng")}》</b>
			${lib.translate["swyz_jufeng_info"]}
			<br><br><b>【${get.poptip("swyz_jichi")}》</b>
			${lib.translate["swyz_jichi_info"]}
			<br><br>&emsp;&ensp;八舞夕弦&ensp;体力：4/4
			<br><br><b>【${get.poptip("swyz_xieliao")}》</b>
			${lib.translate["swyz_xieliao_info"]}
			<br><br><b>【${get.poptip("swyz_tianji")}》</b>
			${lib.translate["swyz_tianji_info"]}
		</span>`;
	},
}
if ("character" in DIY) {
	const list = Object.values(DIY.character);
	for (let item of list) {
		if ("img" in item && !item.img.includes("/")) {
			item.img = swTool.characterImageSrc + item.img;
		}
	}
}
if ("characterSubstitute" in DIY) {
	const list = Object.values(DIY.characterSubstitute);
	for (let item of list) {
		if (Array.isArray(item)) {
			for (let i = 0; i < item.length; i++) {
				const subItem = item[i];
				if (Array.isArray(subItem) && subItem.length > 1) {
					if (Array.isArray(subItem[1])) {
						for (let j = 0; j < subItem[1].length; j++) {
							if (subItem[1][j].startsWith("img:") && !subItem[1][j].includes("/")) {
								subItem[1][j] = "img: " + swTool.characterImageSrc + subItem[1][j].slice(4).trim();
							}
						}
					} else {
						const j = subItem[1];
						if (j.startsWith("img:") && !j.includes("/")) {
							subItem[1] = "img: " + swTool.characterImageSrc + j.slice(4).trim();
						}
					}
				}
			}
		}
	}

}

if (card.translate) {
	Object.assign(DIY.translate, card.translate);
}

for (const group of Object.values(DIY.characterSort)) {
	for (const key of Object.keys(group)) group[key] = group[key].filter(id => Object.hasOwn(character, id));
}
export { DIY };
