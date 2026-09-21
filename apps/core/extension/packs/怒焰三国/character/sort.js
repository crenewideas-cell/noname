import characters from "./character.js";

const characterSort = {
	shenwuzailin: [
		"nysgs_shen_huangzhong", "nysgs_shen_sunjian", 
	],
    shenhuahuanxiang: [
    	"nysgs_huan_xiaoqiao", "nysgs_huan_daqiao", "nysgs_huan_zhangchu", 
        "nysgs_huan_caiwenji",
    ],
    moudingtianxia: [
    	"nysgs_mou_zhugeliang", "nysgs_mousimayi", "nysgs_moucaocao", 
    ],
    weizhentianxia: [
        "nysgs_wei_guanyu", 
    ],
    jiexiantupo: [],
    qifuxianding: [
        "nysgs_hujinding", "nysgs_quyi", "nysgs_zhouyi",
    ],
    zhaoxiannashi: [
        "nysgs_chenlin", "nysgs_mizhu", 
    ],
    jiangshanrugu: [
    	"nysgs_qi_liubei",
        "nysgs_qi_sunce",
        "nysgs_qi_diaochan", "nysgs_qi_zhangjiao", "nysgs_qi_dongzhuo", 
        "nysgs_qi_yuanshao", 
    ],

    beidou_ziwei: [
    	"nysgs_liubei", "nysgs_sunquan", "nysgs_caopi", 
        "nysgs_sunhao", "nysgs_liuxie", 
        "nysgs_caorui", "nysgs_caomao", 
    ],
    beidou_tanlang: [
    	"nysgs_dongzhuo", "nysgs_zhangjiao", "nysgs_caocao", 
        "nysgs_simayi", "nysgs_menghuo", "nysgs_zhurong", 
        "nysgs_lvbu", "nysgs_zhonghui", "nysgs_zhangxiu", 
    ],
    beidou_wuqu: [
        "nysgs_zhangliao", "nysgs_zhaoyun", "nysgs_machap", 
        "nysgs_wuyi", "nysgs_xusheng", "nysgs_zhanghe", 
        "nysgs_huangzhong", "nysgs_yuejin", 
    ],
    beidou_lianzhen: [
    	"nysgs_huaxiong", "nysgs_masu", "nysgs_weiyan", 
        "nysgs_dengai", "nysgs_chengyu", "nysgs_liufeng", 
        "nysgs_zhouyu", "nysgs_liufeng", "nysgs_zhouchu", 
    ],
    beidou_pojun: [
    	"nysgs_wenchou", "nysgs_xuchu", "nysgs_caoren", 
        "nysgs_yanliang", "nysgs_gaoshun", "nysgs_liuzan", 
        "nysgs_zhoutai", "nysgs_xurong", 
    ],
    beidou_jumen: [
    	"nysgs_xushu", "nysgs_maliang", "nysgs_jushou",
        "nysgs_wangji", "nysgs_qinmi", "nysgs_liru",
        "nysgs_xuyou", "nysgs_yangyi", 
    ],

    zhongtian_taiyang: [
    	"nysgs_huanggai", "nysgs_liaohua", "nysgs_xuhuang", 
        "nysgs_sunce", "nysgs_taishici", "nysgs_sunjian", 
        "nysgs_guanyinpin", "nysgs_zhuran", 
    ],
    zhongtian_taiyin: [
    	"nysgs_sunshangxiang", "nysgs_bulianshi", "nysgs_zhenji", 
        "nysgs_guozhao", "nysgs_zhaoxiang", "nysgs_caoying", 
        "nysgs_dongxie", "nysgs_beimihu", 
    ],
    zhongtian_fengge: [
    	"nysgs_zhangxingcai" , "nysgs_wuguotai" , "nysgs_lvlingqi" , 
        "nysgs_lingju" , "nysgs_dongguiren" , "nysgs_ganfuren", 
        "nysgs_mifuren", "nysgs_wuxian", "nysgs_wangyuanji", 
    ],
    zhongtian_huagai: [
        "nysgs_yuji", "nysgs_simahui", "nysgs_zuoci", 
        "nysgs_gexuan", "nysgs_guanlu", "nysgs_nanhualaoxian", 
        "nysgs_zhouqun", "nysgs_zhugeguo", "nysgs_zhangqiying",
    ],
    zhongtian_longchi: [
        "nysgs_lingtong", "nysgs_lukang", "nysgs_zhugeke",
        "nysgs_guanping", "nysgs_jiangwei", "nysgs_guansuo", 
        "nysgs_caozhi", "nysgs_zhugezhan", "nysgs_caochun",  
    ],
    zhongtian_hongluan: [
    	"nysgs_diaochan", "nysgs_xiahoushi", "nysgs_caifuren", 
    	"nysgs_sunhanhua", "nysgs_baosanniang", "nysgs_sunluban", 
        "nysgs_huaman", "nysgs_zhoufei", "nysgs_caojinyu",
    ],
    zhongtian_tianxi: [
    	"nysgs_yanghuiyu", "nysgs_zhangchangpu", "nysgs_luji", 
        "nysgs_caizhenji", "nysgs_mayunlu", "nysgs_zhangchunhua", 
   	],

    nandou_tianji: [
    	"nysgs_guojia", "nysgs_chengong", "nysgs_xunyou", 
        "nysgs_jiaxu", "nysgs_xizhicai", "nysgs_pangtong", 
        "nysgs_huangyueying", 
    ],
    nandou_tianxiang: [
    	"nysgs_fazheng", "nysgs_luxun", "nysgs_xunyu", 
        "nysgs_dongyun", "nysgs_lusu", "nysgs_chenqun", 
        "nysgs_zhugeliang", 
    ],
    nandou_tiantong: [
    	"nysgs_caochong", "nysgs_liushan", "nysgs_dongbai", 
        "nysgs_caiwenji", "nysgs_sunluyu", "nysgs_xiaoqiao", 
        "nysgs_daqiao", "nysgs_sunru", 
    ],
    nandou_qisha: [
    	"nysgs_xiahoudun", "nysgs_ganning", "nysgs_dianwei", 
        "nysgs_pangde", "nysgs_xiahouyuan", "nysgs_zhangfei", 
        "nysgs_guanyu", 
    ],
    nandou_tianfu: [
    	"nysgs_yuanshao", "nysgs_yuanshu", "nysgs_gongsunzan", 
        "nysgs_caozhang", "nysgs_lvmeng", "nysgs_liuyan", 
        "nysgs_taohuang", 
    ],
    nandou_tianliang: [
    	"nysgs_zhangzhao", "nysgs_huatuo", "nysgs_xinxianying", 
        "nysgs_caojie", "nysgs_wangyi", "nysgs_yujin", 
        "nysgs_bianfuren", "nysgs_pangdegong", 
    ],
    nandou_tiankui: [
    	"nysgs_luotong", "nysgs_zhugejin", "nysgs_lingcao", 
        "nysgs_caoang", "nysgs_liuqi", "nysgs_wu_wenyang", 
        "nysgs_wei_wenyang", "nysgs_puyuan", 
    ],
};
const list = Object.values(characterSort).flat();
for (let i in characters) {
    if (list.includes(i)) continue;
    if (i.startsWith("nysgs_mou_")) {
        characterSort.moudingtianxia.push(i);
    } else if (i.startsWith("nysgs_jie_")) {
        characterSort.jiexiantupo.push(i);
    } else {
        characterSort.zhaoxiannashi.push(i);
    }
}

const characterSortTranslate = {
	shenwuzailin: "神系列",
    shenhuahuanxiang: "幻系列",
    moudingtianxia: "谋系列",
    weizhentianxia: "威系列",
    jiexiantupo: "界限突破",
    jiangshanrugu: "起系列",
    qifuxianding: "祈福限定",
    zhaoxiannashi: "招贤纳士",
    beidou_ziwei: "北斗·紫微",
    beidou_tanlang: "北斗·贪狼",
    beidou_wuqu: "北斗·武曲",
    beidou_lianzhen: "北斗·廉贞",
    beidou_pojun: "北斗·破军",
    beidou_jumen: "北斗·巨门",
    zhongtian_taiyang: "中天·太阳",
    zhongtian_taiyin: "中天·太阴",
    zhongtian_fengge: "中天·凤阁",
    zhongtian_huagai: "中天·华盖",
    zhongtian_longchi: "中天·龙池",
    zhongtian_hongluan: "中天·红鸾",
    zhongtian_tianxi: "中天·天喜",
    nandou_tianji: "南斗·天机",
    nandou_tianxiang: "南斗·天相",
    nandou_tiantong: "南斗·天同",
    nandou_qisha: "南斗·七杀",
    nandou_tianfu: "南斗·天府",
    nandou_tianliang: "南斗·天梁",
    nandou_tiankui: "南斗·天魁",
};

export { characterSort, characterSortTranslate };
