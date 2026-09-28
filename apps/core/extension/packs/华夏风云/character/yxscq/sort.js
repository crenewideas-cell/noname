const characterSort = {
    yxscq_xx: [],
    /*hx_junlintianxia: ["sp_yingzheng", "sp_liuche", "sp_lishimin", "hx_wangmang", "hx_sunquan", "hx_zhuwen", "hx_yanzhaowang", "hx_yelvhongji", "hx_zhaoguangyi", "hx_zhaozhen", "hx_zhaogou", "hx_sizhu", "hx_liue", "hx_jiezhou", "hx_jiajing", "hx_goujian", "hx_fengtaihou", "hx_dengsui", "hx_chuzhuangwang", "hx_cixi",, "hx_zhouyouwang", "hx_liyu", "hx_tuolei", "hx_tuohuantiemuer", "hx_liubei", "hx_jiananfeng", "hx_mingyuzhen", "hx_suirenshi", "hx_gaohuan", "hx_wanyanliang", "hx_huhai", "hx_zhuyunwen", "hx_lilongji", "hx_yangxingmi", "hx_nuerhachi", "hx_zhuqizhen",],
    
    hx_weijirenchen: ["hx_chenqingzhi", "hx_chenping", "hx_diqing", "hx_dongfangshuo", "hx_fuhao", "hx_daji", "hx_fansui", "hx_fankuai", "hx_duguqieluo", "hx_guoguofuren", "hx_gaoyanggongzhu", "hx_yangyuhuan", "hx_fengdao", "hx_hanqinhu", "hx_jiangwei", "hx_shiwansui", "hx_hongchengchou", "hx_hairui", "hx_hulvguang", "hx_liangji", "hx_caozhi", "hx_baoshuya", "hx_yuanchonghuan", "hx_liuchuyu", "hx_liubowen", "hx_sunce", "hx_fansheng", "hx_lisi", "hx_zhaofeiyan", "hx_diwulun", "hx_lianghongyu", "hx_liuyan", "hx_gexiaoe", "hx_liurengui", "hx_gaosiji", "hx_caobin", "hx_liumuzhi", "hx_lulingxuan", "hx_lubing", "hx_liwenzhong", "hx_mayuan", "hx_gongzhiqi", "hx_maxiuying", "hx_panyunu", "hx_qieyinyue", "hx_qinjiushao", "hx_zhouyafu", "hx_ruji", "hx_juxin", "hx_sanghongyang", "hx_suqinzhangyi", "hx_sxfr", "hx_wsfr", "hx_tandaoji", "hx_wangyanzhang", "hx_tiandan", "sp_lishimin", "sp_zhaokuangyin", "hx_tianrangju", "hx_wangzhaojun", "hx_wanzhener", "hx_chaocuo", "hx_weirui", "hx_xiaji", "hx_caoren", "hx_zhuzaiyu", "hx_wuzixu", "hx_xuerengui", "hx_xiayuanji", "hx_xumiaoyun", "hx_yangzaixing", "hx_yanghui", "hx_yaoguangxiao", "hx_yuchigong", "hx_yishuo", "hx_yuyunwen", "hx_yuqian", "hx_wanyanzongwang", "hx_zhangheng", "hx_guoxing", "hx_zhangfei", "hx_zhangxun", "hx_zhengxiu", "hx_zhuxi", "hx_zhuwenzheng", "hx_zhendexiu", "hx_fengxiaolian", "hx_fukangan", "hx_gaochanggong", "hx_dubo", "hx_zhuwenzheng", "hx_zhendexiu", "hx_licunxiao", "hx_liyuanba", "hx_shikuang", "hx_guojia", "hx_wanganshi", "hx_songci", "hx_wentianxiang", "hx_xuyougong", "hx_xiaomeiniang", "hx_wangxuance", "hx_yanshifan", "hx_yinlihua", "hx_yuwenfang", "hx_yuji", "hx_zhaomengfu", "hx_zhaohede", "hx_zhangsunsheng", "hx_zhouxing", "hx_liutaozhi", "hx_fanlihua", "hx_bigan", "hx_liyiji", "hx_heruobi", "hx_songyu",],
    
    hx_guofuminan: ["sp_zhuchongba", "hx_bisheng", "hx_bianque", "hx_zhujinzhen", "hx_taoyuanming", "hx_shaoyong", "hx_daxiaoqiao", "hx_baogu", "hx_tanyunxian", "hx_zhangxiaoniangzi", "hx_xiedaoyun", "hx_xieziran", "hx_xuetao", "hx_zhangsanfeng", "hx_zhushuzhen", "hx_luoguanzhong", "hx_zhuyingtai", "hx_wusong", "hx_weijie", "hx_panan", "hx_panjinlian", "hx_shenwansan", "hx_diaochan", "hx_sangchong", "hx_ouyezi", "hx_jingke", "hx_niezheng", "hx_nieyinniang", "hx_liye", "hx_wangzhi", "hx_wangwenqing", "hx_linlingsu", "hx_liurushi", "hx_suzhipo", "hx_boya", "hx_huineng", "hx_xianying", "hx_lishangyin", "hx_huangdaopo", "hx_gehong", "hx_duanmuci", "hx_yanshi", "hx_chunyutiying", "hx_qiuying", "hx_mengguang", "hx_luban", "hx_wanmizhai", "hx_zhairang", "hx_banchao",],
    
    hun_douhunjuexing: ["hun_yingzheng", "hun_liuche", "hun_lishimin", "hun_zhuyuanzhang", "hun_liubang", "hun_liuxiu", "hun_zhaokuangyin", "hun_hubilie", "hun_xuanye", "hun_yangjian", "hun_zhudi", "hun_tiemuzhen", "hun_liuyu", "hun_wuzetian", "hun_hanxin", "hun_baiqi", "hun_lijing", "hun_yuefei", "hun_xuda", "hun_huoqubing", "hun_sudingfang", "hun_changyuchun", "hun_dayuxia", "hun_xiaohe", "hun_zhangjuzheng", "hun_mozi", "hun_guanzhong", "hun_shangyang", "hun_gaojiong", "hun_fangdu", "hun_yaosong", "hun_jiangziya", "hun_zhangliang", "hun_chengtang", "hun_guiguzi", "hun_laozi", "hun_kongzi", "hun_cuihao", "hun_zhangbin", "hun_yaoguangxiao", "hun_jichang", "hun_zhouyu", "hun_caocao", "hun_luxun", "hun_guanyu", "hun_wangmeng", "hun_murongke", "hun_murongchui", "hun_sunwu", "hun_wuqi", "hun_wangjian", "hun_lianpo", "hun_limu", "hun_guoziyi", "hun_liguangbi", "hun_libi", "hun_wangyangming", "hun_xiangyu", "hun_baozheng", "hun_zhuangzi", "hun_yiyin", "hun_fanli", "hun_tuobatao", "hun_sudongpo", "hun_guorong", "hun_jifa", "hun_simayi", "hun_menggong", "hun_huoguang", "hun_liqingzhao", "hun_lvzhi", "hun_huangdi", "hun_sunzhongshan", "hun_maozedong", "hun_bianque", "hun_fanzhongyan", "hun_hongli", "hun_libai", "hun_miyue", "hun_xiaochuo", "hun_sunbin", "hun_weixiaokuan", "hun_yingji", "hun_zhude", "hun_zhaopu", "hun_qijiguang"],
    
    sj_shijieyingxiong: ["sj_niudun", "sj_nandinggeer", "sj_lishunchen", "sj_jiafeiji", "sj_zhende", "sj_jinzhengen",],
    
    mo_luanshimowang: ["mo_anlushan", "mo_houjing", "mo_zhaogao", "mo_erzhurong", "mo_zyz", "mo_lilinfu",],
    
    shen_shenhuajianglin: ["shen_mzsj", "shen_jbsj", "shen_lgsj", "shen_zmsj", "shen_tangsanzang", "shen_zhubajie", "shen_nezha", "shen_huozhurong", "shen_zhongkui", "shen_wenzhong",],*/
    
    
    yxs_jichupian: ["yxs_lishimin", "yxs_liubang", "yxs_tiemuzhen", "yxs_baosi", "yxs_bianque", "yxs_chensheng", "yxs_caocao", "yxs_goujian", "yxs_chenyuanyuan", "yxs_guanyu", "yxs_huamulan", "yxs_hanxin", "yxs_likui", "yxs_lishishi", "yxs_luzhishen", "yxs_liubowen", "yxs_murong", "yxs_renhuanzhi", "yxs_qinqiong", "yxs_shiqian", "yxs_shangyang", "yxs_wusong", "yxs_songjiang", "yxs_tantaiming", "yxs_xiangyu", "yxs_xishi", "yxs_wuzetian", "yxs_yuji", "yxs_yangyanzhao", "yxs_yuefei", "yxs_yingzheng", "yxs_zhaofeiyan", "yxs_zhaokuangyin", "yxs_zzdirenjie", "yxs_zzhangsanfeng",],
    
    yxs_qinglongzz: ["yxs_zhugeliang", "yxs_zhuyuanzhang", "yxs_lianpo", "yxs_luban", "yxs_chengyaojin","yxs_jingke", "yxs_panan", "yxs_xiaoqiao", "yxs_lvzhi", "yxs_lizicheng"],
    yxs_baihuzz: ["yxs_liuche", "yxs_sunwu", "yxs_kangxi", "yxs_mozi", "yxs_liyu","yxs_linchong", "yxs_diaochan", "yxs_zhangfei", "yxs_yangyuhuan", "yxs_libai"],
    yxs_zhuquezz: ["yxs_yangguang", "yxs_zhaoyong", "yxs_sunquan", "yxs_wangzhaojun", "yxs_luocheng","yxs_muguiying", "yxs_baiqi", "yxs_guiguzi", "yxs_bole", "yxs_tangbohu"],
    yxs_xuanwuzz: ["yxs_wenjiang", "yxs_xuanzang", "yxs_liubei", "yxs_qihuangong", "yxs_liguang","yxs_liqingzhao", "yxs_jifa", "yxs_dongfangshuo", "yxs_baozheng", "yxs_kongzi"],
    yxs_shijiepian: ["GXS_napolun", "GXS_kaisa", "yxs_nandinggeer", "GXS_luobinhan", "GXS_sbdks","GXS_zhende", "GXS_fuermosi", "GXS_aijiyanhou", "GXS_zhitianxinchang", "GXS_mingcheng"],
    
    yxs_douhunpian:["yxshunlinchong","yxshundiaochan","yxshuncaocao","yxshundirenjie","yxshunguiguzi","yxshunliubang","yxshunluocheng","yxshunmozi","yxshunsunwu","yxshunxiangyu","yxshunxiaoqiao","yxshunyangyuhuan","yxshunzhangfei","yxshunsunquan"],    
    
    yingxiongchuanqi: ["yxsxiaotaihou", "yxslanlingwang", "yxswusangui", "yxszhurong", "yxsyuwenhuaji","yxsmenghuo", "yxsshangzhou", "yxsdaji", "yxsliji", "yxsgaoqiu", "yxsxiaozhuang", "yxsmoxi", "yxsaobai", "yxsxiajie","yxsweizhongxian", "GXS_dymiyue", "yxsnvwa", "yxsnianshou", "yxszhaoyun", "yxstaipinggongzhu", "yxswenjiang", "yxs_qinglong", "yxs_baihu", "yxs_zhuque", "yxs_xuanwu"],
    
    yxs_shouyou: ["yxs_liugongquan", "GXS_zhubajie", "GXS_change", "GXS_dycaiwenji", "GXS_jqzhangliang","GXS_dyzhangyi", "yxs_xweizheng", "yxs_wudaozi", "yxs_xlixian", "yxs_ymachao", "yxs_simayi", "yxs_xunyu", "yxs_mahuanghou", "yxs_zhebie","yxs_houyi", "yxs_zhouyu", "yxs_huoqubing", "GXS_huoguang", "yxs_chenajiao", "yxs_fuxi", "yxs_huangdi", "yxs_bswangmang", "yxs_wxwangmang", "yxs_bsdongzhuo", "yxs_bsanlushan", "yxs_cqkongrong", "yxs_dianwei", "yxs_changhuihan", "yxs_jieyouhan", "yxs_zhangqianhan", "yxs_dongfangshuosy", "yxs_dufu", "yxs_xiaohehan", "yxs_zhangzhongjinghan", "yxs_huangyueying", "yxs_lichunfengtang", "yxs_lvbu", "yxs_miyue", "yxs_xguoziyi", "yxs_xiaoshimei", "yxs_xtaipinggongzhu", "yxs_xuanzang", "yxs_xshenwansan", "yxs_xuhuang", "yxs_yuantiangang", "yxs_zhougong", "yxs_yuenv", "GXS_xuanzang", "yxs_weiqing", "yxs_shangguan", "yxs_zhangliao", "yxs_sunshangxiang", "yxs_qiuchuji", "yxs_weizifu", "yxs_zhengchenggong"],
    
    yxs_xiaochengxu: ["GXS_rebianque", 'GXS_vxluocheng', 'GXS_vxyangguang', 'GXS_vxxiaotaihou', 'GXS_vxdirenjie', 'GXS_vxguiguzi', "GXS_vxdiaochan", "GXS_yuantiangang", 'GXS_vxpanan', 'GXS_vxmenghuo', 'GXS_vxhanxin', 'GXS_daji', "GXS_vxlvbu", "GXS_yuwenhuaji", 'GXS_vxmuguiying', 'GXS_zhuowenjun', 'GXS_simaxiangru', "GXS_vxzhaoyong", "GXS_vxbaiqi", 'GXS_vxkangxi', 'GXS_xuxiake', 'GXS_vxchengyaojin', "GXS_vxsunwu", "GXS_vxbole", "GXS_vxsunquan", "GXS_xiaohe", "GXS_vxlinchong", "GXS_dayu", "GXS_vxkongzi", "GXS_mengtian", 'GXS_huoqubing', 'yxs_huangzhong', 'yxs_lusu', 'yxs_zhangheng', 'yxs_zhanheng', 'yxs_wxlanlingwang', 'yxs_gongsunchujiu', 'GXS_vxwenjiang', 'GXS_vxzhurong', 'GXS_vxwangzhaojun', "GXS_vxzhaoyun", 'GXS_vxhuamulan', 'GXS_zhangsunhuanghou', 'GXS_vxlikui', "GXS_vxmurong", 'GXS_vxmozi', 'GXS_vxzhangfei', 'GXS_moxi', 'GXS_miyue', "GXS_vxliuche", "GXS_jiangshang", "GXS_vxlanlingwang", 'GXS_shangguanwaner', 'GXS_vxzhangliang', 'GXS_quyuan', 'GXS_weiqing', 'GXS_liqingzhao', 'GXS_vxlvzhi', 'GXS_vxlibai', 'GXS_dufu', 'GXS_weizifu', 'GXS_luobinwang', 'GXS_vxwuzetian', "GXS_vxxiaoqiao", "GXS_fanli", 'GXS_zhouyu', 'GXS_vxlianpochar', 'GXS_simayi', 'GXS_vxmachao', 'GXS_yuenv', 'GXS_xunzi', 'GXS_zhangyi', 'GXS_linxiangru', 'GXS_wangjian', 'GXS_suqin', 'GXS_lvbuwei', 'GXS_zhangliao', 'GXS_fanzeng', 'GXS_vxcaiwenji', 'GXS_vxxiaozhuang', 'GXS_vxzhubajie', 'GXS_vxchange', 'GXS_vxwusangui', 'GXS_vxtangbohu', 'GXS_fusu', 'GXS_guanzhong', 'GXS_vxtaipinggongzhu', 'GXS_lianghongyu', 'GXS_zhuzhishan', 'GXS_maosui', 'GXS_mengchang', 'GXS_niezheng', 'GXS_gaojianli', 'GXS_hairui', 'GXS_hanshizhong', 'GXS_tantaiming', 'GXS_yangyanzhao', 'GXS_pusongling', 'GXS_shenwansan', 'GXS_nieyinniang', 'GXS_shesaihua', 'GXS_vxhuangdi', 'GXS_gehong', 'GXS_wangxizhi', 'GXS_vxqinliangyu', 'GXS_zhuangzhou', 'GXS_xiaoshimei', 'GXS_songci', 'GXS_zhebie', 'GXS_zhudi', 'GXS_weizheng', 'GXS_wangyangming', 'GXS_xiangyu', 'GXS_wusong', 'GXS_yangyuhuan', 'GXS_yingzheng', 'GXS_tiemuzhen', 'GXS_shangzhou', 'GXS_renhuanzhi', 'GXS_qihuangong', 'GXS_lizicheng', 'GXS_lishimin', 'GXS_luzhishen', 'GXS_liji', 'GXS_baozheng', 'GXS_jifa', 'GXS_guanyu', 'GXS_jingke', 'GXS_liubowen', 'GXS_goujian', 'GXS_liguang', 'GXS_zhaokuangyin', 'GXS_chairong', 'GXS_zuti', 'GXS_zuchongzhi', 'GXS_zhouchu', 'GXS_zhangzhongjing', 'GXS_zhaokuo', 'jd_zhuyoujian', 'GXS_yuxuanji', 'yxs_yanzhaowang', 'GXS_zhangjuzheng', 'yxs_yueyi', 'ysunshangxiang', 'yxs_zhangxianzhong', 'yyxs_yangsu', 'GXS_xlishizhen', 'GXS_xzhangqian', 'GXS_xlimu', 'yxs_wuqi', 'GXS_wuyong', 'GXS_vxzouji', 'GXS_wanganshi', 'yxs_vxyuanshoucheng', 'yxs_vxxunyu', 'yxs_vxhuangyueying', 'GXS_vxlixian', 'GXS_vxliugongquan', 'yxs_vxqijiguang', 'GXS_vxhouyi', 'GXS_tianji', 'GXS_vxdianwei', 'yxs_jiaxu', 'GXS_shenkuo', 'yxs_vlijing', 'yxs_maowenlong', 'GXS_pingyang', 'yxs_lichunfeng', 'GXS_huangchao', 'GXS_hanfeizi', 'yxs_jiangwei', 'GXS_geshuhan', 'yxs_hongfunv', 'yxs_wxxishi', "yxs_liuyusong", "yxs_wxlidingguo", "yxs_wxliubei", "yxs_wxyanying", "yxs_wxgaoyingxiang", 'GXS_guoziyi', 'GXS_chengying', 'yxs_caogui', "yxs_xiangliang", "yxs_douying", "yxs_changhui", "yxs_dongzhongshu", 'GXS_fuxi', 'yxs_wangmang', 'yxs_fengliao', 'yxs_jieyougongzhu',],
    
    
    
    /*yxs_daiding: ["hx_changyuchun", "hx_daiding", "hx_qijiguang", "sp_zhudi", "hx_cangjie"],*/
    
    
    
};

const characterSortTranslate = {
    yxscq_xx: "<font color=#FF3300>等待分包</font>",
    
               //华夏风云//
    /*hx_junlintianxia: "华夏风云.君临天下",
    hx_weijirenchen: "华夏风云.位极人臣",
    hx_guofuminan: "华夏风云.物阜民安",
    hun_douhunjuexing: "华夏风云.魂落九天",
    sj_shijieyingxiong: "世界英雄",
    mo_luanshimowang: "华夏风云.乱世魔王",
    shen_shenhuajianglin: "华夏风云.神话降临",*/
               
               //英雄杀//
    yxs_jichupian: "英雄杀【基础篇】",
    yxs_qinglongzz: "英雄杀【青龙之章】",
    yxs_baihuzz: "英雄杀【白虎之章】",
    yxs_zhuquezz: "英雄杀【朱雀之章】",
    yxs_xuanwuzz: "英雄杀【玄武之章】",
    yxs_douhunpian: "英雄杀【斗魂篇】",
    yxs_shijiepian: "英雄杀【世界篇】",
    
    yingxiongchuanqi: "英雄传奇",
    
    yxs_shouyou: "英雄杀手游",
    
    yxs_xiaochengxu: "英雄杀小程序",
    
    
    /*yxs_daiding: "废案/代办",*/
    
    
};

export { characterSort, characterSortTranslate };