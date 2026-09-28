import { lib, game, ui, get, ai, _status } from "./utils.js";
export function content(config, pack) {

    if (lib.rank) { //武将评级
        lib.rank.rarity.junk.addArray([//废物
            "hx_yuwenfang", "hx_zhairang", "hx_sanghongyang", "hx_sangchong", "hx_qieyinyue", "hx_ruji", "hx_hugai", "hx_shenwansan", "hx_yanshifan", "hx_sizhu", "hx_jiezhou", "hx_duanmuci", "hx_zhaogou", "hx_wusong", "hx_liye", "hx_niezheng", "hx_wsfr", "hx_weijie", "hx_zhouxing", "hx_xuetao", "hx_yanzhaowang", "hx_fankuai", "hx_chaocuo", "hx_dongfangshuo", "hx_zhuyingtai", "hx_jiananfeng",]); 

        lib.rank.rarity.rare.addArray([//稀有
            "hx_chunyutiying", "hx_guoxing", "hx_tiandan", "hx_cixi", "hx_sunquan", "hx_hulvguang", "hx_zhangfei", "hx_hanqinhu", "hx_liyuanba", "hx_fansheng", "hx_zhangsanfeng", "hx_qiuying", "hx_lisi", "hx_suqinzhangyi", "hx_huangdaopo", "hx_jiajing", "hx_lubing", "hx_yuyunwen", "hx_zhendexiu", "hx_zhaozhen", "hx_qinjiushao", "hx_liuyan", "hx_nieyinniang", "hx_xuyougong", "hx_liyu", "hx_yelvhongji", "hx_liurushi", "hx_zhaoguangyi", "hx_zhaomengfu", "hx_xieziran", "hx_yuji", "hx_zhujinzhen", "hx_zhushuzhen", "hx_daxiaoqiao", "hx_liutaozhi", "hx_zhuqizhen", "hx_liyiji", "hx_heruobi",
        ]); 

        lib.rank.rarity.epic.addArray([//史诗
            "hx_licunxiao", "shen_wenzhong", "hx_wangzhaojun", "hx_sxfr", "hx_lianghongyu", "hx_diaochan", "hx_yanshi", "hun_yaosong", "hx_liue", "hx_dengsui", "hx_xiayuanji", "hx_liubowen", "hx_zhangxiaoniangzi", "hx_maxiuying", "hx_gehong", "hx_wangwenqing", "hx_wanganshi", "hx_gaochanggong", "hx_zhuwenzheng", "hx_nuerhachi", "hx_chenqing", "hx_yinlihua", "hx_mayuan", "hun_zhangbin", "hx_xuerengui", "hx_liubei", "hx_wanzhener", "hx_zhouyouwang", "hx_zhuwen", "hx_wangyanzhang", "hx_tuolei", "hx_daji", "hx_luban", "hx_goujian", "hx_caozhi", "hx_yangzaixing", "hx_zhuxi", "hx_bisheng", "hx_xumiaoyun", "hx_wanmizhai", "hx_tianrangju", "hx_xiedaoyun", "hx_yinzhen", "hx_lilongji", "hx_zhuyoujian", "hx_yangyuhuan", "hx_guoguofuren", "hx_gaoyanggongzhu", "hx_fuchahuanghou", "hx_yaoguangxiao", "hun_liguangbi", "hun_chengtang", "hx_shaoyong", "hun_zhouyu", "hun_luxun", "hx_lishangyin", "hun_simayi", "hx_shikuang", "hx_xiaomohe", "hx_fengyuan", "hx_hongchengchou", "hx_peiju", "hx_nangongchangwan", "hx_luoguanzhong", "hx_wangzhi", "hx_bigan", "hx_peimin", "hx_boya", "hx_zhuzaiyu", "hx_shiwansui", "sj_lishunchen", "hx_diwulun", "hx_weirui",
        ]); 

        lib.rank.rarity.legend.addArray([//传说
            "hun_lishimin", "hun_zhuyuanzhang", "hun_yingzheng", "hun_liuche", "hun_hanxin", "hun_baiqi", "hun_lijing", "hun_xuda", "hun_zhangliang", "hun_jiangziya", "hun_wangmeng", "hun_libi", "hun_yaoguangxiao", "hun_murongke", "hun_jichang", "hun_wuqi", "hun_yuefei", "hun_jifa", "hun_shangyang", "hun_wangjian", "hun_liubang", "hun_xiaohe", "hun_huoguang", "hun_liuxiu", "hun_caocao", "hun_zhaokuangyin", "hun_yingji", "hun_zhuyuanzhang", "hun_hubilie", "hun_zhudi", "hun_wangyangming", "hun_qijiguang", "hun_zhangjuzheng", "hun_guoziyi", "hun_maozedong", "hun_limu", "hun_lvzhi", "hun_dayuxia", "hun_fangdu", "hx_simazhou", "hun_mozi", "hun_guanzhong", "hun_wuzetian", "hun_baozheng", "hun_sudongpo", "hun_liqingzhao", "hun_liuyu", "hun_fanli", "hun_yiyin", "hx_yishuo", "hx_fengdao", "mo_anlushan", "mo_lilinfu", "mo_houjing", "sp_yingzheng", "sp_liuche", "sp_lishimin", "sp_zhuchongba", "hx_taoyuanming", "hx_ouyezi", "hx_wuzixu", "hx_panjinlian", "hx_zhangheng", "hx_fukangan", "hx_tandaoji", "sj_niudun", "sj_zhende", "sj_nandinggeer", "sj_jinzhengen", "sj_jiafeiji", "hun_guanyu", "hx_tanyunxian", "hun_weixiaokuan", "hun_yangjian", "hx_huishi", "hx_duguqieluo", "shen_zmsj", "hun_gaojiong", "hun_libai", "hx_zhangsunsheng", "hun_sudingfang", "hx_hairui", "hx_liurengui", "hun_changyuchun", "hx_liwenzhong", "hun_zhugeliang", "hx_liumuzhi", "hx_chenqingzhi", "hun_xuanye", "hun_hongli", "hx_zhanglihua", "hx_wangmang", "hx_mengguang", "hun_murongchui", "hun_cuihao", "hun_tuobatao", "hx_yuqian", "hun_lianpo", "hun_tiemuzhen", "hun_huangdi", "hx_chuzhuangwang", "hun_laozi", "hun_kongzi", "hun_zhuangzi", "hun_guiguzi", "hx_fengxiaolian", "hx_panyunu", "hun_menggong", "hx_yanghui", "shen_mzsj", "mo_dongzhuo", "mo_weizhongxian", "hun_miyue", "hun_fanzhongyan", "hun_bianque", "hun_sunwu", "hun_sunbin", "hx_panan", "hx_huineng", "mo_houjing", "hun_guorong", "hun_zhaopu", "hun_xiangyu", "hun_huoqubing", "hun_xiaochuo", "hun_sunzhongshan", "mo_zyz", "hun_zhude"
        ]); //传说

    }


    //———————————————————血杀暗杀语音播放路径以及代码配置——————————————————

    lib.skill._GXS_cardaud = {
        trigger: {
            player: "useCardBegin",
        },
        silent: true,
        charlotte: true,
        priority: null,
        firstDo: true,
        filter(event, player) {
            return event.card.name == 'sha' && (event.card.nature == "GXS_blood" || event.card.nature == "GXS_darkness");
        },
        content() {
            trigger.audio = false;
            if (trigger.card.nature == "GXS_blood") {
                game.playAudio("../extension/华夏风云/audio/card/", (player.sex == "female" ? "nv_sha_GXS_blood" : "nan_sha_GXS_blood"));
            } else {
                game.playAudio("../extension/华夏风云/audio/card/", (player.sex == "female" ? "nv_sha_GXS_darkness" : "nan_sha_GXS_darkness"));
            }
        }
    };


    lib.skill._GXS_bsha = {
        trigger: {
            source: "damage",
        },
        silent: true,
        charlotte: true,
        priority: 999,
        filter(event, player) {
            return event.nature == "GXS_blood";
        },
        content() {
            player.recover(trigger.num);
        },
    };
    
    lib.skill._GXS_dsha = {
        trigger: {
            source: "damageBefore",
        },
        forced: true,
        silent: true,
        filter(event) {
            return event.nature == "GXS_darkness";
        },
        content() {
            trigger.player.addTempSkill("GXSshadiao", "shaAfter");
        },
    };

    lib.skill.GXSshadiao = {
        init(player, skill) {
            player.addSkillBlocker(skill);
        },
        onremove(player, skill) {
            player.removeSkillBlocker(skill);
        },
        charlotte: true,
        locked: true,
        skillBlocker(skill, player) {
            if (skill == "hun_yongle" || skill == "hun_buyi") {
                return false;
            }
            return skill != "GXSshadiao" && lib.skill[skill] && !lib.skill[skill].charlotte && !player.isDying();
        },
    };

    lib.skill._GXS_psha = {
        trigger: {
            source: "damageAfter",
        },
        filter(event) {
            return event.nature == "GXS_poison" && event.player.isAlive();
        },
        forced: true,
        silent: true,
        popup: false,
        content() {
            trigger.player.addMark('_GXS_tudu', trigger.num, false);
            game.log(trigger.player, "获得了" + get.cnNumber(trigger.num) + "层【毒】");
        },
    };
    lib.skill._GXS_tudu = {
        charlotte: true,
        onremove: true,
        forced: true,
        silent: true,
        popup: false,
        marktext: "中毒",
        intro: {
            name: "毒",
            content: "共有#层毒",
        },
        trigger: {
            player: ["damageEnd", "phaseEnd"],
        },
        filter(event, player) {
            if (event.name == 'damage') {
                return event.nature == "GXS_poison" && player.hasMark("_GXS_tudu");
            }
            return (player.getHistory('useCard').length + player.getHistory('respond').length) < player.countMark('_GXS_tudu') || player.countMark('_GXS_tudu');
        },
        async content(event, trigger, player) {
            switch (trigger.name) {
                case 'damage':
                    player.addMark(event.name, 1, false);
                    game.log(player, "获得了一层【毒】");
                    break;
                case 'phase':
                    if ((player.getHistory('useCard').length + player.getHistory('respond').length) < player.countMark(event.name)) {
                        await player.loseHp();
                    }
                    player.removeMark(event.name, 1);
                    break;
                default:
                    break;
            }
        }
    };
    
    //生死簿shengsibu//
    lib.skill.global.push("hx_shengsibu_destroy");

    //lib.nature.addArray(["GXS_blood", "GXS_darkness", "GXS_poison"]);
    lib.nature.set("GXS_blood");
    lib.nature.set("GXS_darkness");
    lib.nature.set("GXS_poison");
    lib.card.sha.nature.addArray(["GXS_blood", "GXS_darkness", "GXS_poison"]);
    lib.linked.addArray(["GXS_blood", "GXS_darkness", "GXS_poison"]);
    lib.translate.GXS_blood = "血";
    lib.translate.GXS_darkness = "暗";
    lib.translate.GXS_poison = "毒";
    lib.translate.GXS_bloodsha = "血杀";
    lib.natureBg.set("GXS_blood", "extension/华夏风云/image/cardpic/dz_xuesha.png");
    lib.translate.GXS_darknesssha = "暗杀";
    lib.natureBg.set("GXS_darkness", "extension/华夏风云/image/cardpic/dz_ansha.png");
    lib.translate.GXS_poisonsha = "毒杀";
    lib.natureBg.set("GXS_poison", "extension/华夏风云/image/cardpic/dz_dusha.png");




};
