game.import("extension", function (lib, game, ui, get, ai, _status) {
    window.xixiguagua = {
        name: "标记补充",
        url: lib.assetURL + "extension/手杀标准UI/original/标记补充",
        huanfu: {
            name: "../../../标记补充/animation/huanfu",
        },//国战亮将        
        SSZBB_dizhu_jineng: {
            name: "../../../标记补充/animation/SSZBB_dizhu_jineng",
            speed: 0.8,
        },//地主金光        
        SS_PaijuTubiao_Hujia: {
            name: "../../../标记补充/animation/SS_PaijuTubiao_Hujia",
            speed: 0.5,
        },//获得护甲和失去护甲        
        aar_longxingzhixiang: {
            name: "../../../标记补充/animation/aar_longxingzhixiang",
            speed: 0.5,
        }, //伤害牌龙头
        diankuangtulu: {
            name: "../../../标记补充/animation/diankuangtulu",
        },//癫狂屠戮
        wanjunqushou: {
            name: "../../../标记补充/animation/wanjunqushou",
        },//无双
        Xmiaoshouhuichun: {
            name: "../../../标记补充/animation/Xmiaoshouhuichun",
        },//妙手回春
        Xyishugaochao: {
            name: "../../../标记补充/animation/Xyishugaochao",
        },//医术高超
        effect_loseHp: {
            name: "../../../标记补充/animation/effect_loseHp",
            speed: 0.8, 
        },//失去体力
        mianshang: {
            name: "../../../标记补充/animation/mianshang",
            speed: 0.8, 
        },//免伤
        shuzi: {
            name: "../../../标记补充/animation/shuzi",
            speed: 0.8,
        },//伤害数字
        effect_jiu: {
            name: "../../../标记补充/animation/effect_jiu",
            speed: 0.7,
        },//酒
        effect_tao: {
            name: "../../../标记补充/animation/effect_tao",
            speed: 0.7,
        },//桃
        sha: {
            name: "../../../标记补充/animation/sha",
            speed: 0.7,
        },//杀
        effect_shan: {
            name: "../../../标记补充/animation/effect_shan",
            speed: 0.7,
        },//闪
        effect_wuzhongshengyou: {
            name: "../../../标记补充/animation/effect_wuzhongshengyou",
            speed: 1.3,
        },//无中生有
        effect_wugufengdeng: {
            name: "../../../标记补充/animation/effect_wugufengdeng",
            speed: 0.7,
        },//五谷
        effect_nanmanruqin: {
            name: "../../../标记补充/animation/effect_nanmanruqin",
        },//南蛮入侵
        effect_wanjianqifa_full: {
            name: "../../../标记补充/animation/effect_wanjianqifa_full",
            speed: 0.7, 
        },//万箭齐发
        SSZBB_DDZ_eff_juedou: {
            name: "../../../标记补充/animation/SSZBB_DDZ_eff_juedou",
        },//决斗
        effect_wuxiekeji: {
            name: "../../../标记补充/animation/effect_wuxiekeji",
        },//无懈可击
        zbwq: {
            name: "../../../标记补充/animation/zbwq",
        },
        zb: {
            name: "../../../标记补充/animation/zbwq",
        },
        zbfym: {
            name: "../../../标记补充/animation/zbwq",
        },
        zbjgm: {
            name: "../../../标记补充/animation/zbwq",
        },
        zbbw: {
            name: "../../../标记补充/animation/zbwq",
        },
        effect_wenheluanwu: {
            name: "../../../标记补充/animation/effect_wenheluanwu",
        },//文和乱武
        effect_haolingtianxia: {
            name: "../../../标记补充/animation/effect_haolingtianxia",
        },//号令天下
        effect_kefuzhongyuan: {
            name: "../../../标记补充/animation/effect_kefuzhongyuan",
        },//克复中原
        effect_guguoanbang: {
            name: "../../../标记补充/animation/effect_guguoanbang",
        },//固国安帮
        SF_jiesuan_eff_zczgshengli: {
            name: "../../../标记补充/animation/SF_jiesuan_eff_zczgshengli",
        },//十周年主公结算        
        SF_jiesuan_eff_fanzeishengli: {
            name: "../../../标记补充/animation/SF_jiesuan_eff_fanzeishengli",
        },//十周年反贼结算
        SF_jiesuan_eff_neijianshengli: {
            name: "../../../标记补充/animation/SF_jiesuan_eff_neijianshengli",
        },//十周年内奸结算
        Xshengli: {
            name: "../../../标记补充/animation/Xshengli",
        },//胜利
        Xnoshengli: {
            name: "../../../标记补充/animation/Xnoshengli",
        },//失败和平局
        XXshengli: {
            name: "../../../标记补充/animation/XXshengli",
            speed: 1, 
        },//手杀胜利
        XXshibai: {
            name: "../../../标记补充/animation/XXshibai",
            speed: 0.6, 
        },//手杀失败
        XXpingju: {
            name: "../../../标记补充/animation/XXpingju",
            speed: 0.7, 
        },//手杀平局
        arr_0_gaipan: {
            name: "../../../标记补充/animation/arr_0_gaipan",
        },//改判
        arr_1_gaipan: {
            name: "../../../标记补充/animation/arr_1_gaipan",
        },//改判
        arr_2_gaipan: {
            name: "../../../标记补充/animation/arr_2_gaipan",
        },//改判
        arr_3_gaipan: {
            name: "../../../标记补充/animation/arr_3_gaipan",
        },//改判
        SS_eff_xianqu: {
            name: "../../../标记补充/animation/SS_eff_xianqu",
        },//先驱
        SSZBB_PJN_yexinjia: {
            name: "../../../标记补充/animation/SSZBB_PJN_yexinjia",
        },//野心家
        SS_eff_yinyangyu: {
            name: "../../../标记补充/animation/SS_eff_yinyangyu",
        },//阴阳鱼
        SS_eff_zhulianbihe: {
            name: "../../../标记补充/animation/SS_eff_zhulianbihe",
        },//珠联璧合        
        jianguo: {
            name: "../../../标记补充/animation/jianguo",
        },//建国
        aozhan: {
            name: "../../../标记补充/animation/aozhan",
        },//鏖战
        aozhan_huo: {
            name: "../../../标记补充/animation/aozhan_huo",
        },//鏖战背景
        shoushajisha: {
            name: "../../../标记补充/animation/shoushajisha",
            speed: 1.3, 
        },//手杀击杀
        erlianzhan: {
            name: "../../../标记补充/animation/erlianzhan",
        },//二连斩
        sanlianzhan: {
            name: "../../../标记补充/animation/sanlianzhan",
        },//三连斩
        silianzhan: {
            name: "../../../标记补充/animation/silianzhan",
        },//四连斩
        wulianzhan: {
            name: "../../../标记补充/animation/wulianzhan",
        },//五连斩
        liulianzhan: {
            name: "../../../标记补充/animation/liulianzhan",
        },//六连斩
        qilianzhan: {
            name: "../../../标记补充/animation/qilianzhan",
        },//七连斩
        jiubuff: {
            name: "../../../标记补充/animation/jiubuff",
        },//酒buff
        huihekaishi: {
            name: "../../../标记补充/animation/huihekaishi",
        },//回合开始       
        shunshouqianyang: {
            name: "../../../标记补充/animation/shunshouqianyang",
            speed: 0.8, 
        },//顺手牵羊
        effect_guohechaiqiao: {
            name: "../../../标记补充/animation/effect_guohechaiqiao",
        },//过河拆桥
        chenzhu: {
            name: "../../../标记补充/animation/chenzhu",
            loop: true,
        },//城主
        weimingzhong: {
            name: "../../../标记补充/animation/weimingzhong",
        },//🐏袭
        shimingjishibai: {
            name: "../../../标记补充/animation/shimingjishibai",
        },//使命失败
        qingyushibai: {
            name: "../../../标记补充/animation/qingyushibai",
        },//清玉失败
        mibeishibai: {
            name: "../../../标记补充/animation/mibeishibai",
        },//密备失败
        kuanshi: {
            name: "../../../标记补充/animation/kuanshi",
        },//宽释
        chuhaishibai: {
            name: "../../../标记补充/animation/chuhaishibai",
        },//除害失败
        mouyi: {
            name: "../../../标记补充/animation/mouyi",
        },//谋奕 
        chengchi: {
            name: "../../../标记补充/animation/chengchi",
        },//守邺 
        fuzi: {
            name: "../../../标记补充/animation/fuzi",
            speed: 0.6,
        }, //斧子
        dao: {
            name: "../../../标记补充/animation/dao",
            speed: 0.7,
        }, //刀
        jian: {
            name: "../../../标记补充/animation/jian",
            speed: 0.7,
        }, //剑        
        baoji: {
            name: "../../../标记补充/animation/baoji",
            speed: 0.4,
        }, //暴击
        huoshouji: {
            name: "../../../标记补充/animation/huoshouji",
            speed: 0.5,
        }, //火受击
        leishouji: {
            name: "../../../标记补充/animation/leishouji",
            speed: 0.5,
        }, //雷受击     
        huodao: {
            name: "../../../标记补充/animation/fire_daojianfu",
            speed: 0.6,
        }, //火刀剑斧
        leidao: {
            name: "../../../标记补充/animation/SSXF_SX_guanjielei",
            speed: 0.7,
        }, //雷刀剑斧
        bingdao: {
            name: "../../../标记补充/animation/ice_daojianfu",
            speed: 0.6,
        }, //冰刀剑斧
        leifu: {
            name: "../../../标记补充/animation/lei_daojianfu",
            speed: 0.7,
        }, //雷斧  
        wanjian: {
            name: "../../../标记补充/animation/wanjian",
            speed: 0.75,
        }, //万剑受击
        nanman: {
            name: "../../../标记补充/animation/nanman",
            speed: 0.75,
        }, //南蛮受击
        huogong: {
            name: "../../../标记补充/animation/SSZBB_DDZ_eff_huogong",
            speed: 0.75,
        }, //火攻受击
        juedou: {
            name: "../../../标记补充/animation/aar_juedoushouji",
            speed: 0.75,
        }, //决斗受击
        putong: {
            name: "../../../标记补充/animation/effect_shoujidonghua",
            speed: 0.75,
        }, //普通受击
        huo: {
            name: "../../../标记补充/animation/fire",
            speed: 0.75,
        }, //普通火受击
        lei: {
            name: "../../../标记补充/animation/thunder",
            speed: 0.75,
        }, //普通雷受击
        SS_smz_fadongjineng: {
            name: "../../../标记补充/animation/SS_smz_fadongjineng",
        },//昭凶特效
        SS_cmmask: {
            name: "../../../标记补充/animation/SS_cmmask",
        },//视频特效（参照曹髦）
        SS_junei_wolongyancechenggong: {
            name: "../../../标记补充/animation/SS_junei_wolongyancechenggong",
        },//卧龙演测成功
        SS_wolongyance_beitu: {
            name: "../../../标记补充/animation/SS_wolongyance_beitu",
        },//卧龙演测
        SS_wolongyance_kongqiu: {
            name: "../../../标记补充/animation/SS_wolongyance_kongqiu",
        },//卧龙演测
        SS_wolongyance_shiti: {
            name: "../../../标记补充/animation/SS_wolongyance_shiti",
        },//卧龙演测
        SS_wolongyance_qixing: {
            name: "../../../标记补充/animation/SS_wolongyance_qixing",
        },//卧龙演测
        scs_bagua: {
            name: "../../../标记补充/animation/SS_scs_bagua",
        }, //十常侍八卦
        scs_bgf: {
            name: "../../../标记补充/animation/SS_scs_bgfw",
            speed: 1.7,
        }, //十常侍八卦符
        scs_qjf: {
            name: "../../../标记补充/animation/SS_scs_bgrw",
        }, //十常侍全家福
    };
    return {
        name: "标记补充",
        content: function (config, pack) {
            //引入css
            lib.init.css(lib.assetURL + 'extension/手杀标准UI/original/标记补充', 'extension');
            lib.init.css(lib.assetURL + 'extension/手杀标准UI/original/标记补充', 'mark');
            window.numToGuanjie=function(num,to){
                var str=['shibing','shifuzhang','baifuzhang','qianfuzhang','xiaowei','xianfengjiangjun','zhongjunjiangjun','lingjunjiangjun','biaoqijiangjun','dajiangjun','dayuanshuai','taixuhuanjing','boss_zhong','boss_zhu'];
                if(!to) {
                    if(str[num-1]) {
                        return str[num-1];
                    }else {
                        return 'none';
                    }
                }else {
                    return str.indexOf(num)+1;
                }
            }
            var createCss=function(csstext){
    		    if(typeof csstext != 'string') return false;
    		    var style = document.createElement('style');
    			style.innerHTML = csstext;
    			document.head.appendChild(style);
    			return style;
    		};
    		var loadImage=function(img){
    		    var div=ui.create.div();
    		    div.style.backgroundImage=`url('${lib.assetURL}extension/手杀标准UI/original/标记补充/animation/${img}.png')`;
    		    return div;
    		};
    		loadImage('iceEffect');
    		loadImage('iceMagic');
    		loadImage('iceDamage');
    		createCss(`.hlss_bjbc_body {
                width: 100%;
                height: 100%;
                left: 0%;
                top: 0%;
            }`);
    		createCss(`.hlss_bjbc_IceMagic {
                background-image: url(${lib.assetURL}extension/手杀标准UI/original/标记补充/animation/iceMagic.png);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                width: 100%;
                height: 100%;
                left: 50%;
                top: 50%;
                opacity: 0;
                visibility: hidden;
                transform: translate(-50%, -50%) scale(1.5);
                animation-fill-mode: forwards;
                animation: hlss_bjbc_IceMagicAnimation 1s 1 linear 0.4s;
            }`);
            createCss(`@keyframes hlss_bjbc_IceMagicAnimation {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(1);
                }
                50% {
                    opacity: 1;
                    visibility: visible;
                    transform: translate(-50%, -50%) scale(1.5);
                }
                100% {
                    opacity: 0;
                    visibility: visible;
                    transform: translate(-50%, -50%) scale(2);
                }
            }`);
    		createCss(`.hlss_bjbc_IceDamageBreak {
                background-image: url(${lib.assetURL}extension/手杀标准UI/original/标记补充/animation/iceEffect.png);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                width: 100%;
                height: 100%;
                left: 43%;
                top: 47%;
                opacity: 0;
                visibility: hidden;
                transform: translate(-50%, -50%) scale(1.5);
                animation-fill-mode: forwards;
                animation: hlss_bjbc_IceBreakAnimation 0.7s 1 linear 0.7s;
            }`);
            createCss(`@keyframes hlss_bjbc_IceBreakAnimation {
                0% {
                    opacity: 0;
                    visibility: visible;
                    filter: brightness(2);
                }
                20% {
                    opacity: 1;
                    visibility: visible;
                    filter: brightness(1.5);
                }
                100% {
                    opacity: 0;
                    visibility: visible;
                    filter: brightness(1);
                }
            }`);
            createCss(`.hlss_bjbc_IceDamageEffect {
                background-image: url(${lib.assetURL}extension/手杀标准UI/original/标记补充/animation/iceDamage.png);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                width: 100%;
                height: 100%;
                left: 50%;
                top: 50%;
                opacity: 0;
                visibility: hidden;
                transform: translate(-50%, -50%);
                animation-fill-mode: forwards;
                animation: hlss_bjbc_IceDamageAnimation 0.7s 1 linear 0.55s;
            }`);
            createCss(`@keyframes hlss_bjbc_IceDamageAnimation {
                0% {
                    transform: translate(-50%, -50%) scale(0.3);
                    opacity: 0;
                    filter: blur(3px) brightness(1) drop-shadow(0 0 2.5px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
                10% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.5;
                    filter: blur(2px) brightness(1) drop-shadow(0 0 2px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
                25% {
                    transform: translate(-50%, -50%) scale(1.3);
                    opacity: 1;
                    filter: blur(0px) brightness(1) drop-shadow(0 0 1.5px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
                45% {
                    transform: translate(-50%, -50%) scale(1.8);
                    opacity: 0.7;
                    filter: blur(0.5px) brightness(2) drop-shadow(0 0 1px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2.3);
                    opacity: 0;
                    filter: blur(1px) brightness(1.5) drop-shadow(0 0 0.5px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
            }`);
            createCss(`.hlss_bjbc_IceDamageEffect2 {
                background-image: url(${lib.assetURL}extension/手杀标准UI/original/标记补充/animation/iceDamage.png);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                width: 100%;
                height: 100%;
                left: 50%;
                top: 50%;
                opacity: 0;
                visibility: hidden;
                transform: translate(-50%, -50%);
                animation-fill-mode: forwards;
                animation: hlss_bjbc_IceDamageAnimation2 0.7s 1 linear 0.55s;
            }`);
            createCss(`@keyframes hlss_bjbc_IceDamageAnimation2 {
                0% {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                    filter: blur(1px) brightness(1) drop-shadow(0 0 2.7px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
                10% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.5;
                    filter: blur(0.5px) brightness(1) drop-shadow(0 0 2.2px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
                25% {
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 1;
                    filter: blur(0px) brightness(1) drop-shadow(0 0 1.7px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
                45% {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0.7;
                    filter: blur(0.5px) brightness(3) drop-shadow(0 0 1.2px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2.5);
                    opacity: 0;
                    filter: blur(1.5px) brightness(2.5) drop-shadow(0 0 0.7px rgba(0, 155, 255, 1));
                    visibility: visible;
                }
            }`);
            createCss(`.hlss_bjbc_IceDamagePlayerEffect {
                animation-fill-mode: forwards;
                animation: hlss_bjbc_IceDamagePlayerAnimation 1s 0.7 ease-out;
            }`);
            createCss(`@keyframes hlss_bjbc_IceDamagePlayerAnimation {
                0% {
                    filter: brightness(1);
                }
                15% {
                    filter: brightness(2);
                }
                100% {
                    filter: brightness(1);
                }
            }`);
            //暴击伤害特效
            createCss(`.hlss_bjbc_baoji {
                background-image: url(${lib.assetURL}extension/手杀标准UI/original/标记补充/animation/baoji.png);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                width: 100%;
                height: 100%;
                left: 65%;
                top: 50%;
                opacity: 0;
                visibility: hidden;
                transform: translate(-50%, -50%) scale(1.5);
                animation-fill-mode: forwards;
                animation: hlss_bjbc_baojiAnimation 3.5s 1 ease 0.4s;
            }`);
            createCss(`@keyframes hlss_bjbc_baojiAnimation {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0);
                }
                15% {
                    opacity: 1;
                    visibility: visible;
                    transform: translate(-50%, -50%) scale(1.2);
                }
                100% {
                    opacity: 0;
                    visibility: visible;
                    transform: translate(-50%, -50%) scale(1.3);
                }
            }`);
            //特效部分
            if (config.doudizhu_guanqiuxiaoguo) {
                //飞扬跋扈特效
                lib.skill._xigua_feiyanbahu_ = {
                    trigger: {
                        global: "gameStart",
                    },
                    silent: true,
                    forced: true,
                    charlotte: true,
                    content: function () {
                  //  player.addSkill('qiangwu');
                        setTimeout(function () {
                            if (player.identity == 'zhu' && lib.config.mode == 'doudizhu' && game.me == player) {
                                //自己跋扈
                                var zibahu = ui.create.div('.zibahu', player);
                                var fubahu = ui.create.div('.fubahu', zibahu);
                                ui.create.div('.fubahux', fubahu);
                                //自己飞扬
                                var zifeiyan = ui.create.div('.zifeiyan', player);
                                var fufeiyan = ui.create.div('.fufeiyan', zifeiyan);
                                ui.create.div('.fufeiyanx', fufeiyan);
                                game.playAudio('../extension/手杀标准UI/original/标记补充/audio/doudizhu_specialSpell.mp3');
                                setTimeout(function () {
                                    dcdAnim.loadSpine(xixiguagua.SSZBB_dizhu_jineng.name, "skel", function () {
                                        //dcdAnim.playSpine(xixiguagua.SSZBB_dizhu_jineng, { speed: 0.8, scale: 0.8, x: [0, 0.89], y: [0, 0.96], parent: player });
                                        dcdAnim.playSpine(xixiguagua.SSZBB_dizhu_jineng, { speed: 0.8, scale: 0.8, x: [0, 0.92], y: [0, 0.96], parent: player });
                                    });
                                    ui.create.div('.dizhukuang', player);
                                }, 1510);
                            }
                            if (player.identity == 'zhu' && lib.config.mode == 'doudizhu' && game.me != player) {
                                //ai跋扈
                                var aizibahu = ui.create.div('.aizibahu', player);
                                var aifubahu = ui.create.div('.aifubahu', aizibahu);
                                ui.create.div('.aifubahux', aifubahu);
                                //ai飞扬
                                var aizifeiyan = ui.create.div('.aizifeiyan', player);
                                var aifufeiyan = ui.create.div('.aifufeiyan', aizifeiyan);
                                ui.create.div('.aifufeiyanx', aifufeiyan);
                                game.playAudio('../extension/手杀标准UI/original/标记补充/audio/doudizhu_specialSpell.mp3');
                                setTimeout(function () {
                                    dcdAnim.loadSpine(xixiguagua.SSZBB_dizhu_jineng.name, "skel", function () {
                                        //dcdAnim.playSpine(xixiguagua.SSZBB_dizhu_jineng, { speed: 0.8, scale: 0.8, x: [0, 0.89], y: [0, 0.96], parent: player });
                                        dcdAnim.playSpine(xixiguagua.SSZBB_dizhu_jineng, { speed: 0.8, scale: 0.8, x: [0, 0.92], y: [0, 0.96], parent: player });
                                    });
                                    ui.create.div('.dizhukuang', player);
                                }, 1510);
                            }
                        }, 2000);
                        var pp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].randomGet();
                        if(player==game.me) pp=11;
                        var xx = ['国服', '省', '区', '市', '街道', '村', '乡', '镇', '县'];
                        xx = xx.randomGets(1).sort();
                        var xxx = ['第一', '第二', '第三', '第四', '第五', '第六'];
                        xxx = xxx.randomGets(1).sort();
                        if(player!=game.me) {
                            if(get.mode()=='boss') {
                                if(['zhu','zhong'].contains(player.identity)) {
                                    player.guanjie='boss_'+player.identity;
                                    if(player.identity=='zhu') player.level=500;
                                    else player.level=220;
                                }
                            }
                            if(player.guanjie) {
                                pp=window.numToGuanjie(player.guanjie,true);
                            }else {
                                player.guanjie=window.numToGuanjie(pp);
                            }
                        }
                        //官阶特效                                    
                        ui.create.div('.offical_icon_' + pp, player);
                        if(!player.guanjie||player.guanjie.indexOf('boss_')!=0) {
                            ui.create.div('.offical_icon_guang', player);
                        }else {
                            ui.create.div('.offical_icon_guang2', player);
                        }
                        //国服标志
                        if (lib.config.mode != 'guozhan') {
                            var guofudiyi = ui.create.div('.guofudiyi' + pp, player);
                            if (pp == 1 || pp == 2 || pp == 3) {
                                guofudiyi.innerHTML = xx + xxx + get.translation(player);
                            }
                        }
                      if (lib.config.mode == 'doudizhu' || lib.config.mode == 'versus' && get.config('versus_mode') == 'two') {
                      if(player==game.me){
                      var  targets=player.getEnemies();
                       for (var i of targets) {                   
                        var bg = ui.create.div('.direnbiaozhi_bg',i);
                        ui.create.div('.direnbiaozhi',bg);
                        var drbzwz = ui.create.div('.direnwenzi',bg);         
                    //    drbzwz.innerHTML='敌人';                   
                        }
                        }
                        }
                        
                    },
                };
            };
            if (config.huajiatexiao) {
                //获得护甲特效
                lib.element.content.changeHujia = function () {
                    player.hujia += num;
                    if (num > 0) {
                        game.log(player, '获得了' + get.cnNumber(num) + '点护甲');
                        dcdAnim.loadSpine(xixiguagua.SS_PaijuTubiao_Hujia.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.SS_PaijuTubiao_Hujia, { action: "play", speed: 0.5, scale: 0.8, x: [0, 0.09], y: [0, 0.46], parent: player });//原版scale: 1, x: [0, 0.1], y: [0, 0.45]
                        });
                    }
                    if (player.hujia <= 0) {
                        player.hujia = 0;
                        if (num < 0) { event.trigger('clearHujia') };
                    }
                    player.update();
                },
                    //失去护甲特效
                    /*lib.skill._shiqihujia_ = {
                        trigger: {
                            player: "damageBegin4",
                        },
                        silent: true,
                        charlotte: true,
                        forced: true,
                        content: function () {
                            if (player.hujia > 0) {
                      dcdAnim.loadSpine(xixiguagua.SS_PaijuTubiao_Hujia.name, "skel", function () {
                      dcdAnim.playSpine(xixiguagua.SS_PaijuTubiao_Hujia, { action: "play1", speed: 0.5, scale: 0.8, x: [0, 0.09], y: [0, 0.46], parent: player });});//原版 - scale : 1 x: [0, 0.1], y: [0, 0.45]
                if (!trigger.nature) {
                decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', speed: 0.6 }, { scale: 0.7, parent: player });
                }
                if (trigger.nature == 'fire') {
                decadeUI.animation.playSpine({ name: 'huo_daojianfu', action: 'play3', speed: 0.6 }, { scale: 0.6, parent: player });
                }
                if (trigger.nature == 'thunder') {
                decadeUI.animation.playSpine({ name: 'lei_daojianfu', action: 'play3', speed: 0.6 }, { scale: 0.6, parent: player });
                }
                if(trigger.num>1){
                decadeUI.animation.playSpine({ name:'baoji',  speed:0.4}, {scale: 0.6,x:[0,0.55],parent: player});//暴击特效
                }
                    // 护甲音效        
                 if(player.hujia > 0&&trigger.num==1&&!trigger.nature){
                game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_normal.mp3');}
                 if(player.hujia > 0&&trigger.num>1&&!trigger.nature){
                game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_normal2.mp3');}      
                if(player.hujia > 0&&trigger.num==1&&trigger.nature == 'fire'){
                game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_huo.mp3');}      
                if(player.hujia > 0&&trigger.num>1&&trigger.nature == 'fire'){
                game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_huo2.mp3');}
                if(player.hujia > 0&&trigger.num==1&&trigger.nature == 'thunder'){
                game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_lei.mp3');}            
                if(player.hujia > 0&&trigger.num>1&&trigger.nature == 'thunder'){
                game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_lei2.mp3');}                            
                }                
                        },
                    };*/
                //整肃修改
                lib.skill.zhengsu = {
                    trigger: { player: 'phaseDiscardEnd' },
                    forced: true,
                    charlotte: true,
                    filter: function (event, player) {
                        return (player.storage.zhengsu_leijin || player.storage.zhengsu_bianzhen || player.storage.zhengsu_mingzhi);
                    },
                    content: function () {
                        player.chooseDrawRecover(2, '整肃奖励：摸两张牌或回复1点体力');
                    },
                    subSkill: {
                        leijin: {
                            mark: true,
                            trigger: { player: 'useCard1' },
                            lastDo: true,
                            charlotte: true,
                            forced: true,
                            popup: false,
                            init: function (player) {
                                var zsbgxx = document.querySelector('.zhengsubeijing');
                                var zsbggg = document.querySelector('.zhengsubeijingx');
                                if (!zsbgxx) {
                                    player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijing', ui.arena);
                                    player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
                                    player.storage.zhengsu_leijingua2 = true;
                                } else if (!zsbggg) {
                                    player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijingx', ui.arena);
                                    player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
                                    player.storage.zhengsu_leijingua3 = true;
                                } else {
                                    player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijingg', ui.arena);
                                    player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
                                }
                            },
                            onremove: function (player) {
                                var zsbgxx = document.querySelector('.zhengsubeijing');
                                var zsbggg = document.querySelector('.zhengsubeijingx');
                                var zsbgxg = document.querySelector('.zhengsubeijingg');
                                if (zsbgxx) { zsbgxx.parentNode.removeChild(zsbgxx); }
                                if (zsbggg) { zsbggg.parentNode.removeChild(zsbggg); }
                                if (zsbgxg) { zsbgxg.parentNode.removeChild(zsbgxg); }
                                delete player.storage.zhengsu_leijin_markcount;
                                delete player.storage.zhengsu_leijingua2;
                                delete player.storage.zhengsu_leijingua3;
                                delete player.storage.zhengsu_leijin;
                            },
                            filter: function (event, player) {
                                return player.isPhaseUsing() && player.storage.zhengsu_leijin !== false;
                            },
                            content: function () {
                                var list = player.getHistory('useCard', function (evt) {
                                    return evt.isPhaseUsing(player);
                                });
                                var goon = true;
                                for (var i = 0; i < list.length; i++) {
                                    var num = get.number(list[i].card);
                                    if (typeof num != 'number') {
                                        goon = false;
                                        break;
                                    }
                                    if (i > 0) {
                                        var num2 = get.number(list[i - 1].card);
                                        if (typeof num2 != 'number' || num2 >= num) {
                                            goon = false;
                                            break;
                                        }
                                    }
                                    if (goon == true && list.length <= 2) {
                                        player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (3 - list.length) + '张牌' + '<br>出牌点数大于' + get.number(list[i].card);
                                    } else if (goon == true && list.length > 2) {
                                        player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌点数大于' + get.number(list[i].card);
                                    }
                                }
                                if (!goon) {
                                    game.broadcastAll(function (player) {
                                        player.storage.zhengsu_leijin = false;
                                        if (player.marks.zhengsu_leijin) player.marks.zhengsu_leijin.firstChild.innerHTML = '整肃 失败';
                                        delete player.storage.zhengsu_leijin_markcount;
                                        if (player.storage.zhengsu_leijingua2) {
                                            var zsbgxx = document.querySelector('.zhengsubeijing');
                                            if (zsbgxx) { zsbgxx.parentNode.removeChild(zsbgxx); }
                                        } else if (player.storage.zhengsu_leijingua3) {
                                            var zsbggg = document.querySelector('.zhengsubeijingx');
                                            if (zsbggg) { zsbggg.parentNode.removeChild(zsbggg); }
                                        } else {
                                            var zsbgxg = document.querySelector('.zhengsubeijingg');
                                            if (zsbgxg) { zsbgxg.parentNode.removeChild(zsbgxg); }
                                        }
                                    }, player);
                                }
                                else {
                                    if (list.length > 2) {
                                        player.storage.zhengsu_leijin = true;
                                        //if(player.name==)						
                                        // game.broadcastAll(function(player,num){
                                        // //	if(player.marks.zhengsu_leijin) player.marks.zhengsu_leijin.firstChild.innerHTML='整肃 成功';        
                                        // player.storage.zhengsu_leijin=true;
                                        // player.storage.zhengsu_leijin_markcount=num;
                                        // },player,num);
                                    }
                                    // else game.broadcastAll(function(player,num){
                                    // player.storage.zhengsu_leijin_markcount=num;
                                    // },player,num);
                                }
                                // player.markSkill('zhengsu_leijin');
                            },
                            marktext: '整肃 擂进',
                            intro: {
                                name: '整肃 擂进',
                                content: '<li>条件：回合内所有于出牌阶段使用的牌点数递增且不少于三张。',
                            },
                        },
                        bianzhen: {
                            mark: true,
                            trigger: { player: 'useCard1' },
                            firstDo: true,
                            charlotte: true,
                            forced: true,
                            popup: false,
                            init: function (player) {
                                var zsbgxx = document.querySelector('.zhengsubeijing');
                                var zsbggg = document.querySelector('.zhengsubeijingx');
                                if (!zsbgxx) {
                                    player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijing', ui.arena);
                                    player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
                                    player.storage.zhengsu_bianzhengua2 = true;
                                } else if (!zsbggg) {
                                    player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijingx', ui.arena);
                                    player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
                                    player.storage.zhengsu_bianzhengua3 = true;
                                } else {
                                    player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijingg', ui.arena);
                                    player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
                                }
                            },
                            onremove: function (player) {
                                var zsbgxx = document.querySelector('.zhengsubeijing');
                                var zsbggg = document.querySelector('.zhengsubeijingx');
                                var zsbgxg = document.querySelector('.zhengsubeijingg');
                                if (zsbgxx) { zsbgxx.parentNode.removeChild(zsbgxx); }
                                if (zsbggg) { zsbggg.parentNode.removeChild(zsbggg); }
                                if (zsbgxg) { zsbgxg.parentNode.removeChild(zsbgxg); }
                                delete player.storage.zhengsu_bianzhen;
                                delete player.storage.zhengsu_bianzhengua2;
                                delete player.storage.zhengsu_bianzhengua3;
                            },
                            filter: function (event, player) {
                                return player.isPhaseUsing() && player.storage.zhengsu_bianzhen !== false;
                            },
                            content: function () {
                                var list = player.getHistory('useCard', function (evt) {
                                    return evt.isPhaseUsing();
                                });
                                var str= '', goon = true, suit = get.suit(list[0].card, false);
                                /*if(get.translation(suit)=="♥"){str="<span style='color:red;-webkit-text-stroke: 0.6px white;text-shadow:0 0 5px white;width:10px;'>♥</span>️️";}
                                if(get.translation(suit)=="♠"){str="<span style='color:black;-webkit-text-stroke: 0.6px white;text-shadow:0 0 5px white;width:10px;'>♠️</span>️️";}
                                if(get.translation(suit)=="♣"){str="<span style='color:black;-webkit-text-stroke: 0.6px white;text-shadow:0 0 5px white;width:10px;'>♣️</span>️️";}
                                if(get.translation(suit)=="♦"){str="<span style='color:red;-webkit-text-stroke: 0.6px white;text-shadow:0 0 5px white;width:10px;'>♦️</span>️️";}*/
                                //修了
                                if(suit=='heart'){str="<span style='color:red;-webkit-text-stroke: 0.6px white;text-shadow:0 0 5px white;width:10px;'>♥</span>️️";}
                                if(suit=='spade'){str="<span style='color:black;-webkit-text-stroke: 0.6px white;text-shadow:0 0 5px white;width:10px;'>♠️</span>️️";}
                                if(suit=='club'){str="<span style='color:black;-webkit-text-stroke: 0.6px white;text-shadow:0 0 5px white;width:10px;'>♣️</span>️️";}
                                if(suit=='diamond'){str="<span style='color:red;-webkit-text-stroke: 0.6px white;text-shadow:0 0 5px white;width:10px;'>♦️</span>️️";}
                                if (goon == true && list.length <= 1) {
                                    player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (2 - list.length) + '张牌' + '<br>出牌花色为' + str;
                                } else if (goon == true && list.length > 1) {
                                    player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌花色为' + str;
                                }
                                if (suit == 'none') {
                                    goon = false;
                                }
                                else {
                                    for (var i = 1; i < list.length; i++) {
                                        if (get.suit(list[i]) != suit) {
                                            goon = false;
                                            break;
                                        }                               
                                        if (goon == true && list.length <= 1) {
                                            player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (2 - list.length) + '张牌' + '<br>出牌花色为' + str;/*get.translation(get.suit(list[i]));*/
                                        } else if (goon == true && list.length > 1) {
                                            player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌花色为' +str;/* get.translation(get.suit(list[i]));*/
                                        }                            
                                    }
                                }
                                if (!goon) {
                                    game.broadcastAll(function (player) {
                                        player.storage.zhengsu_bianzhen = false;
                                        if (player.marks.zhengsu_bianzhen) player.marks.zhengsu_bianzhen.firstChild.innerHTML = '整肃 失败';
                                        if (player.storage.zhengsu_bianzhengua2) {
                                            var zsbgxx = document.querySelector('.zhengsubeijing');
                                            if (zsbgxx) { zsbgxx.parentNode.removeChild(zsbgxx); }
                                        } else if (player.storage.zhengsu_bianzhengua3) {
                                            var zsbggg = document.querySelector('.zhengsubeijingx');
                                            if (zsbggg) { zsbggg.parentNode.removeChild(zsbggg); }
                                        } else {
                                            var zsbgxg = document.querySelector('.zhengsubeijingg');
                                            if (zsbgxg) { zsbgxg.parentNode.removeChild(zsbgxg); }
                                        }
                                    }, player);
                                }
                                else {
                                    if (list.length > 1) {
                                        player.storage.zhengsu_bianzhen = true;
                                    }
                                }
                            },
                            marktext: '整肃 变阵',
                            intro: {
                                name: '整肃 变阵',
                                content: '<li>条件：回合内所有于出牌阶段使用的牌花色相同且不少于两张。',
                            },
                        },
                        mingzhi: {
                            mark: true,
                            trigger: { player: 'loseAfter' },
                            firstDo: true,
                            charlotte: true,
                            forced: true,
                            popup: false,
                            init: function (player) {
                                var zsbgxx = document.querySelector('.zhengsubeijing');
                                var zsbggg = document.querySelector('.zhengsubeijingx');
                                if (!zsbgxx) {
                                    player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijing', ui.arena);
                                    player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
                                    player.storage.zhengsu_mingzhigua2 = true;
                                } else if (!zsbggg) {
                                    player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijingx', ui.arena);
                                    player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
                                    player.storage.zhengsu_mingzhigua3 = true;
                                } else {
                                    player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijingg', ui.arena);
                                    player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
                                }
                            },
                            onremove: function (player) {
                                var zsbgxx = document.querySelector('.zhengsubeijing');
                                var zsbggg = document.querySelector('.zhengsubeijingx');
                                var zsbgxg = document.querySelector('.zhengsubeijingg');
                                if (zsbgxx) { zsbgxx.parentNode.removeChild(zsbgxx); }
                                if (zsbggg) { zsbggg.parentNode.removeChild(zsbggg); }
                                if (zsbgxg) { zsbgxg.parentNode.removeChild(zsbgxg); }
                                delete player.storage.zhengsu_mingzhi_list;
                                delete player.storage.zhengsu_mingzhi;
                                delete player.storage.zhengsu_mingzhi_markcount;
                                delete player.storage.zhengsu_mingzhigua2;
                                delete player.storage.zhengsu_mingzhigua3;
                            },
                            filter: function (event, player) {
                                if (player.storage.zhengsu_mingzhi === false || event.type != 'discard') return false;
                                var evt = event.getParent('phaseDiscard');
                                return evt && evt.player == player;
                            },
                            content: function () {
                                var goon = true, list = [];
                                player.getHistory('lose', function (event) {
                                    if (!goon || event.type != 'discard') return false;
                                    var evt = event.getParent('phaseDiscard');
                                    if (evt && evt.player == player) {
                                        for (var i of event.cards2) {
                                            var suit = get.suit(i, player);
                                            if (list.contains(suit)) {
                                                goon = false;
                                                break;
                                            }
                                            else list.push(suit);
                                        }
                                    }
                                });
                                if (!goon) {
                                    game.broadcastAll(function (player) {
                                        player.storage.zhengsu_mingzhi = false;
                                        if (player.marks.zhengsu_mingzhi) player.marks.zhengsu_mingzhi.firstChild.innerHTML = '整肃 失败';
                                        if (player.storage.zhengsu_mingzhigua2) {
                                            var zsbgxx = document.querySelector('.zhengsubeijing');
                                            if (zsbgxx) { zsbgxx.parentNode.removeChild(zsbgxx); }
                                        } else if (player.storage.zhengsu_mingzhigua3) {
                                            var zsbggg = document.querySelector('.zhengsubeijingx');
                                            if (zsbggg) { zsbggg.parentNode.removeChild(zsbggg); }
                                        } else {
                                            var zsbgxg = document.querySelector('.zhengsubeijingg');
                                            if (zsbgxg) { zsbgxg.parentNode.removeChild(zsbgxg); }
                                        }
                                        delete player.storage.zhengsu_mingzhi_list;
                                    }, player);
                                }
                                else {
                                    if (list.length > 1) {
                                        game.broadcastAll(function (player, list) {
                                            if (player.marks.zhengsu_mingzhi) player.marks.zhengsu_mingzhi.firstChild.innerHTML = '整肃 成功';
                                            player.storage.zhengsu_mingzhi = true;
                                            player.storage.zhengsu_mingzhi_list = list;
                                            player.storage.zhengsu_mingzhi_markcount = list.length;
                                        }, player, list);
                                    }
                                    else game.broadcastAll(function (player, list) {
                                        player.storage.zhengsu_mingzhi_list = list;
                                        player.storage.zhengsu_mingzhi_markcount = list.length;
                                    }, player, list);
                                }
                                player.markSkill('zhengsu_mingzhi');
                            },
                            marktext: '整肃 鸣止',
                            intro: {
                                name: '整肃 鸣止',
                                content: '<li>条件：回合内所有于弃牌阶段弃置的牌花色均不相同且不少于两张。',
                            },
                        },
                    },
                };
                //张琪英改判特效
                lib.skill.zhenyi_spade = {
                    trigger: {
                        global: "judge",
                    },
                    direct: true,
                    filter: function (event, player) {
                        return player.hasMark('xinfu_falu_spade');
                    },
                    content: function () {
                        "step 0"
                        var str = get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
                            get.translation(trigger.player.judging[0]) + '，是否发动【真仪】，弃置「紫薇♠」标记并修改判定结果？';
                        player.chooseControl('spade', 'heart', 'diamond', 'club', 'cancel2').set('prompt', str).set('ai', function () {
                            var judging = _status.event.judging;
                            var trigger = _status.event.getTrigger();
                            var res1 = trigger.judge(judging);
                            var list = lib.suit.slice(0);
                            var attitude = get.attitude(player, trigger.player);
                            if (attitude == 0) return 0;
                            var getj = function (suit) {
                                return trigger.judge({
                                    name: get.name(judging),
                                    nature: get.nature(judging),
                                    suit: suit,
                                    number: 5,
                                })
                            };
                            list.sort(function (a, b) {
                                return (getj(b) - getj(a)) * get.sgn(attitude);
                            });
                            if ((getj(list[0]) - res1) * attitude > 0) return list[0];
                            return 'cancel2';
                        }).set('judging', trigger.player.judging[0]);
                        "step 1"
                        if (result.control != 'cancel2') {
                            //decadeUI.animation.playSpine({ name: 'arr_' + result.index + '_gaipan', speed: 0.8, }, { scale: 0.8, x: [0, 0.5], });
                            dcdAnim.loadSpine(xixiguagua['arr_' + result.index + '_gaipan'].name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua['arr_' + result.index + '_gaipan'], {  speed: 0.8, scale: 0.8, x: [0, 0.5] });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/ziweigaipan.mp3');
                            game.delay(2.5);
                            game.log(result.index);
                            player.addExpose(0.25);
                            player.removeMark('xinfu_falu_spade');
                            player.unmarkSkill('xinfu_falu_spade1');
                            player.logSkill('xinfu_zhenyi', trigger.player);
                            player.popup(result.control);
                            game.log(player, '将判定结果改为了', '#y' + get.translation(result.control + 2) + 5);
                            trigger.fixedResult = {
                                suit: result.control,
                                color: get.color({ suit: result.control }),
                                number: 5,
                            };
                        }
                    },
                    ai: {
                        rejudge: true,
                        tag: {
                            rejudge: 1,
                        },
                        expose: 0.5,
                    },
                };
                //小乔红颜
                lib.skill.xinhongyan = {
                    audio: 2,
                    mod: {
                        suit: function (card, suit) {
                            if (suit == 'spade') return 'heart';
                        },
                    },
                    trigger: {
                        global: "judge",
                    },
                    direct: true,
                    filter: function (event, player) {
                        if (event.fixedResult && event.fixedResult.suit) return event.fixedResult.suit == 'heart';
                        return get.suit(event.player.judging[0], event.player) == 'heart';
                    },
                    content: function () {
                        "step 0"
                        var str = '红颜：' + get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
                            get.translation(trigger.player.judging[0]) + '，请将其改为一种花色';
                        player.chooseControl('spade', 'heart', 'diamond', 'club').set('prompt', str).set('ai', function () {
                            var judging = _status.event.judging;
                            var trigger = _status.event.getTrigger();
                            var res1 = trigger.judge(judging);
                            var list = lib.suit.slice(0);
                            var attitude = get.attitude(player, trigger.player);
                            if (attitude == 0) return 0;
                            var getj = function (suit) {
                                return trigger.judge({
                                    name: get.name(judging),
                                    nature: get.nature(judging),
                                    suit: suit,
                                    number: get.number(judging),
                                })
                            };
                            list.sort(function (a, b) {
                                return (getj(b) - getj(a)) * get.sgn(attitude);
                            });
                            return list[0];
                        }).set('judging', trigger.player.judging[0]);
                        "step 1"
                        if (result.control != 'cancel2') {
                            player.addExpose(0.25);
                            player.popup(result.control);
                            game.log(player, '将判定结果改为了', '#y' + get.translation(result.control + 2));
                          //  decadeUI.animation.playSpine({ name: 'arr_' + result.index + '_gaipan', speed: 0.8, }, { scale: 0.8, x: [0, 0.5], });
                            dcdAnim.loadSpine(xixiguagua['arr_' + result.index + '_gaipan'].name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua['arr_' + result.index + '_gaipan'], {  speed: 0.8, scale: 0.8, x: [0, 0.5] });                            
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/ziweigaipan.mp3');
                            game.delay(2.5);
                            if (!trigger.fixedResult) trigger.fixedResult = {};
                            trigger.fixedResult.suit = result.control;
                            trigger.fixedResult.color = get.color({ suit: result.control });
                        }
                    },
                    ai: {
                        rejudge: true,
                        tag: {
                            rejudge: 0.4,
                        },
                        expose: 0.5,
                    },
                };
            };//其他修改尾巴
            /*-------------------------------------------------------*/
            //国战美化
            if (lib.config.mode == 'guozhan' && config.guozhanmeihua) {
                lib.skill._guozhanChooseControlCHG={
                    trigger:{
                        player:['chooseControlBefore','chooseControlEnd',
                        'chooseToDiscardBefore','chooseToDiscardEnd',
                        'chooseToUseBefore','chooseToUseEnd'],
                    },
                    direct:true,
                    firstDo:true,
                    filter:function(event,player) {
                        if(!(window.gzbjbg&&player==game.me)) return false;
                        return true;
                    },
                    content:function(){
                        window.gzbjbg.style.transition='all 0.2s';
                        //AI代选弃牌移动一下
                        if(event.triggername.indexOf('chooseToDiscard')==0) {
                            if(!trigger.selectCard) return;
                            var range=get.select(trigger.selectCard);
                            if(!(range[1]>1&&typeof trigger.selectCard!='function')) return;
                        }
                        //五谷丰登的无懈移动一下
                        if(event.triggername.indexOf('chooseToUse')==0) {
                            if(!ui.tempnowuxie) return;
                        }
                        if(event.triggername.indexOf('Before')!=-1) {
                            window.gzbjbg.style.opacity=0.8;
                            window.gzbjbg.style.pointerEvents='none';
                            window.gzbjbg.style.transform='scale(0.8) translate(-10%, -100%)';
                        }else {
                            window.gzbjbg.style.opacity=1;
                            window.gzbjbg.style.pointerEvents='';
                            window.gzbjbg.style.transform='';
                            //window.setSitGZBJ(window.gzbjbg);
                        }
                    },
                }
                window.setSitGZBJ=function(node) {
                    node.style.opacity=0;
                    node.style.pointerEvents='none';
                    var zoom='calc(34.5% - 32px)';
                    switch(lib.config.ui_zoom){
					case 'esmall':zoom='calc(37% - 64px)';break;
					case 'vsmall':zoom='calc(39.5% - 64px)';break;
					case 'small':zoom='calc(40% - 64px)';break;
					/*case 'big':zoom=1.05;break;
					case 'vbig':zoom=1.1;break;
					case 'ebig':zoom=1.2;break;
					case 'eebig':zoom=1.5;break;
					case 'eeebig':zoom=1.8;break;
					case 'eeeebig':zoom=2;break;*/
					default:zoom='calc(35% - 32px)';
				    };
				    node.style.bottom=zoom;
				    node.style.transition='all 0.2s';
				    setTimeout(function(){
				        node.style.opacity=1;
				    },0);
                };
                window.removeGZBJ_BG=function(){
                    if(!window.gzbjbg) return;
                    window.gzbjbg.style.transition='all 0.4s';
                    setTimeout(function(){
				        window.gzbjbg.style.opacity=0;
				        setTimeout(function(){
				            if(!window.gzbjbg) return;
				            window.gzbjbg.remove();
                            window.gzbjbg = null;
                        },450);
				    },0);
                };
                window.createGZBJ=function(node,mode,player){
                    node.style.opacity=0;
                    node.style.transform='scale(1.3)';
                    node.style.transition='all 0.2s';
                    if(player) {
                        if(!player.gzbjList) player.gzbjList=[];
                        player.gzbjList.add(node);
                    }
                    setTimeout(function(){
                        node.style.opacity=1;
                        if(mode&&mode=='ai') {
                            node.style.transform='scale(1,1.05)';
                        }else {
                            node.style.transform='scale(1)';
                        }
                    },0);
                };
                window.removeGZBJ=function(node,mode){
                    node.style.transition='all 0.3s';
                    setTimeout(function(){
                        if(!node) return;
                        node.style.opacity=0;
                        if(!mode) node.style.transform='scale(1.3)';
                        if(!mode) node.style.filter='brightness(3)';
                        //node.parentNode.removeChild(node);
                        setTimeout(function(){
                            if(!node||!node.parentNode) return;
                            node.parentNode.removeChild(node);
                        },350);
                    },0);
                };
                //分离先驱野心家标记
                lib.element.player.$showCharacter = function (num, log) {
                    var showYe = false;
                    if (num == 0 && !this.isUnseen(0)) {
                        return;
                    }
                    if (num == 1 && !this.isUnseen(1)) {
                        return;
                    }
                    if (!this.isUnseen(2)) {
                        return;
                    }
                    game.addVideo('showCharacter', this, num);
                    if (this.identity == 'unknown' || ((num == 0 || num == 2) && lib.character[this.name1][1] == 'ye')) {
                        this.group = this.getGuozhanGroup(num);
                        this._group = this.group;
                        if ((num == 0 || num == 2) && lib.character[this.name1][1] == 'ye') {
                            this.identity = 'ye';
                            if (!this._ye) {
                                this._ye = true;
                                showYe = true;
                            }
                        }
                        else if (get.is.jun(this.name1) && this.isAlive()) {
                            this.identity = this.group;
                        }
                        else if (this.wontYe(this.group)) {
                            this.identity = this.group;
                        }
                        else {
                            this.identity = 'ye';
                        }
                        this.setIdentity(this.identity);
                        this.ai.shown = 1;
                        this.node.identity.classList.remove('guessing');

                        if (_status.clickingidentity && _status.clickingidentity[0] == this) {
                            for (var i = 0; i < _status.clickingidentity[1].length; i++) {
                                _status.clickingidentity[1][i].delete();
                                _status.clickingidentity[1][i].style.transform = '';
                            }
                            delete _status.clickingidentity;
                        }
                        game.addVideo('setIdentity', this, this.identity);
                    }
                    var skills;
                    switch (num) {
                        case 0:
                            if (log !== false) game.log(this, '展示了主将', '#b' + this.name1);
                            this.name = this.name1;
                            skills = lib.character[this.name][3];
                            this.sex = lib.character[this.name][0];
                            this.classList.remove('unseen');
                            decadeUI.animation.playSpine({ name: 'huanfu', speed: 0.8, }, { scale: 0.5, parent: this });                            
                            break;
                        case 1:
                            if (log !== false) game.log(this, '展示了副将', '#b' + this.name2);
                            skills = lib.character[this.name2][3];
                            if (this.sex == 'unknown') this.sex = lib.character[this.name2][0];
                            if (this.name.indexOf('unknown') == 0) this.name = this.name2;
                            this.classList.remove('unseen2');
                            decadeUI.animation.playSpine({ name: 'huanfu', speed: 0.8, }, { scale: 0.5, parent: this });                                                   
                            break;
                        case 2:
                            if (log !== false) game.log(this, '展示了主将', '#b' + this.name1, '、副将', '#b' + this.name2);
                            this.name = this.name1;
                            skills = lib.character[this.name][3].concat(lib.character[this.name2][3]);
                            this.sex = lib.character[this.name][0];
                            this.classList.remove('unseen');
                            this.classList.remove('unseen2');
                            decadeUI.animation.playSpine({ name: 'huanfu', speed: 0.8, }, { scale: 0.5, parent: this });                            
                            break;
                    }
                    game.broadcast(function (player, name, sex, num, identity, group) {
                        player.identityShown = true;
                        player.group = group;
                        player.name = name;
                        player.sex = sex;
                        player.node.identity.classList.remove('guessing');
                        switch (num) {
                            case 0: player.classList.remove('unseen'); break;
                            case 1: player.classList.remove('unseen2'); break;
                            case 2: player.classList.remove('unseen'); player.classList.remove('unseen2'); break;
                        }
                        player.ai.shown = 1;
                        player.identity = identity;
                        player.setIdentity(identity);
                        if (_status.clickingidentity && _status.clickingidentity[0] == player) {
                            for (var i = 0; i < _status.clickingidentity[1].length; i++) {
                                _status.clickingidentity[1][i].delete();
                                _status.clickingidentity[1][i].style.transform = '';
                            }
                            delete _status.clickingidentity;
                        }
                    }, this, this.name, this.sex, num, this.identity, this.group);
                    this.identityShown = true;
                    for (var i = 0; i < skills.length; i++) {
                        this.hiddenSkills.remove(skills[i]);
                        this.addSkill(skills[i]);
                    }
                    this.checkConflict();
                    if (!this.viceChanged) {
                        var initdraw = get.config('initshow_draw');
                        if (_status.connectMode) initdraw = lib.configOL.initshow_draw;
                        if (!_status.initshown && !_status.overing && initdraw != 'off' && this.isAlive() && _status.mode != 'mingjiang') {
                            this.popup('首亮');
                            if (initdraw == 'draw') {
                                game.log(this, '首先明置武将，得到奖励');
                                game.log(this, '摸了两张牌');
                                this.draw(2).log = false;
                            }
                            else {
                                this.addMark('xianqu_mark', 1, false);
                                //获得先驱标记
                                if (game.me == this) {
                                    if (!window.gzbjbg) {
                                        window.gzbjbg = ui.create.div('.biaojibeijing', ui.arena);
                                        window.setSitGZBJ(window.gzbjbg);
                                    }
                                    var crt=ui.create.div('.xianqubiaoji', window.gzbjbg);
                                    window.createGZBJ(crt);
                                } else {
                                    var crt=ui.create.div('.xianqubiaojiai', this);
                                    window.createGZBJ(crt,'ai',this);
                                }
                            }
                            _status.initshown = true;
                        }
                        if (!this.isUnseen(2) && !this._mingzhied) {
                            this._mingzhied = true;
                            if (this.singleHp) {
                                this.doubleDraw();
                            }
                            if (this.perfectPair()) {
                                var next = game.createEvent('guozhanDraw');
                                next.player = this;
                                next.setContent('zhulian');
                            }
                        }
                        if (showYe) {
                            this.addMark('yexinjia_mark', 1, false);
                            //获得野心家标记
                            if (game.me == this) {
                                if (!window.gzbjbg) {
                                    window.gzbjbg = ui.create.div('.biaojibeijing', ui.arena);
                                    window.setSitGZBJ(window.gzbjbg);
                                }
                                var crt=ui.create.div('.yexinjiabiaoji', window.gzbjbg);
                                window.createGZBJ(crt);
                            } else {
                                var crt=ui.create.div('.aiyexinjiabiaoji', this);
                                window.createGZBJ(crt,'ai',this);
                            }

                        }
                    }
                    game.tryResult();
                },
                    //国战分离调虎离山
                    lib.skill.diaohulishan = {
                        trigger: { player: ['damageBegin3', 'loseHpBefore', 'recoverBefore'] },
                        forced: true,
                        popup: false,
                        init: function (player) {
                            var dhls = ui.create.div('.diaohulishanbeijing', player);
                            dhls.style.opacity=0;
                            dhls.style.transition='all 0.7s';
                            setTimeout(function(){
                                dhls.style.opacity=1;
                            },0);
                            player.mark_dhls=dhls;
                        },
                        onremove: function (player) {
                            /*var scdhls = document.querySelector('.diaohulishanbeijing');
                            if (scdhls) {
                                scdhls.style.opacity=0;
                                scdhls.parentNode.opacity=0;
                                setTimeout(function(){
                                    var scdhls = document.querySelector('.diaohulishanbeijing');
                                    if(scdhls&&scdhls.parentNode) scdhls.parentNode.removeChild(scdhls);
                                },1000);
                                //scdhls.parentNode.removeChild(scdhls);
                            }*/
                            if(player.mark_dhls) {
                                var scdhls=player.mark_dhls;
                                scdhls.style.opacity=0;
                                setTimeout(function(){
                                    var scdhls = player.mark_dhls;
                                    if(scdhls) player.removeChild(scdhls);
                                    player.mark_dhls=false;
                                },1000);
                            }
                        },
                        content: function () {
                            trigger.cancel();
                        },
                        mod: {
                            cardEnabled: function () {
                                return false;
                            },
                            cardSavable: function () {
                                return false;
                            },
                            targetEnabled: function () {
                                return false;
                            },
                        },
                        group: 'undist',
                        ai: {
                            effect: {
                                target: function (card, player, target) {
                                    if (get.tag(card, 'recover') || get.tag(card, 'damage')) return 'zeroplayertarget';
                                },
                            },
                        },
                    };
                //分离阴阳鱼标记
                lib.element.content.doubleDraw = function () {
                    if (!player.hasMark('yinyang_mark')) player.addMark('yinyang_mark', 1, false);
                    if (game.me == player) {
                        if (!window.gzbjbg) {
                            window.gzbjbg = ui.create.div('.biaojibeijing', ui.arena);
                            window.setSitGZBJ(window.gzbjbg);
                        }
                        var crt=ui.create.div('.yingyanyubiaoji', window.gzbjbg);
                        window.createGZBJ(crt);
                    } else {
                        var crt=ui.create.div('.aiyingyanyubiaoji', player);
                        window.createGZBJ(crt,'ai',player);
                    }
                };
                //分离珠联璧合标记
                lib.element.content.zhulian = function () {
                    player.popup('珠联璧合');
                    if (!player.hasMark('zhulianbihe_mark')) {
                        player.addMark('zhulianbihe_mark', 1, false);
                        if (game.me == player) {
                            if (!window.gzbjbg) {
                                window.gzbjbg = ui.create.div('.biaojibeijing', ui.arena);
                                window.setSitGZBJ(window.gzbjbg);
                            }
                            var crt=ui.create.div('.zhulianbihebiaoji', window.gzbjbg);
                            window.createGZBJ(crt);
                        } else {
                            var crt=ui.create.div('.aizhulianbihebiaoji', player);
                            window.createGZBJ(crt,'ai',player);
                        }
                    }
                };
                //国战标记技能
                lib.skill._guozhan_marks = {
                    ruleSkill: true,
                    enable: 'phaseUse',
                    filter: function (event, player) {
                        return player.hasMark('yexinjia_mark') || player.hasMark('xianqu_mark') || player.hasMark('yinyang_mark') || player.hasMark('zhulianbihe_mark');
                    },
                    chooseButton: {
                        dialog: function (event, player) {
                            return ui.create.dialog('###国战标记###弃置一枚对应的标记，发动其对应的效果');
                        },
                        chooseControl: function (event, player) {
                            var list = [], bool = player.hasMark('yexinjia_mark');
                            if (bool || player.hasMark('xianqu_mark')) list.push('先驱');
                            if (bool || player.hasMark('zhulianbihe_mark')) {
                                list.push('珠联(摸牌)');
                                if (event.filterCard({ name: 'tao', isCard: true }, player, event)) list.push('珠联(桃)');
                            }
                            if (bool || player.hasMark('yinyang_mark')) list.push('阴阳鱼');
                            list.push('cancel2');
                            return list;
                        },
                        check: function () {
                            var player = _status.event.player, bool = player.hasMark('yexinjia_mark');
                            if ((bool || player.hasMark('xianqu_mark')) && (4 - player.countCards('h')) > 1) return '先驱';
                            if (bool || player.hasMark('zhulianbihe_mark')) {
                                if (_status.event.getParent().filterCard({ name: 'tao', isCard: true }, player, event) && get.effect_use(player, { name: 'tao' }, player) > 0) return '珠联(桃)';
                                if (player.getHandcardLimit() - player.countCards('h') > 1 && !game.hasPlayer(function (current) {
                                    return current != player && current.isFriendOf(player) && current.hp + current.countCards('h', 'shan') <= 2;
                                })) return '珠联(摸牌)';
                            }
                            if (player.hasMark('yinyang_mark') && player.getHandcardLimit() - player.countCards('h') > 0) return '阴阳鱼';
                            return 'cancel2';
                        },
                        backup: function (result, player) {
                            switch (result.control) {
                                case '珠联(桃)': return get.copy(lib.skill._zhulianbihe_mark_tao);
                                case '珠联(摸牌)': return {
                                    content: function () {
                                        if (player.hasMark('zhulianbihe_mark')) {
                                            if (game.me == player) {
                                                var zlbh = document.querySelector('.zhulianbihebiaoji');
                                                if (zlbh) { 
                                                    //zlbh.parentNode.removeChild(zlbh);
                                                    window.removeGZBJ(zlbh);
                                                }
                                            } else {
                                                var aizlbh = document.querySelector('.aizhulianbihebiaoji');
                                                if (aizlbh) {
                                                    //aizlbh.parentNode.removeChild(aizlbh);
                                                    window.removeGZBJ(aizlbh);
                                                }
                                            }
                                        } else if (player.hasMark('yexinjia_mark') && player.hasMark('zhulianbihe_mark') < 1) {
                                            if (game.me == player) {
                                                var yxjx = document.querySelector('.yexinjiabiaoji');
                                                if (yxjx) {
                                                    //yxjx.parentNode.removeChild(yxjx);
                                                    window.removeGZBJ(yxjx);
                                                }
                                            } else {
                                                var aiyxjx = document.querySelector('.aiyexinjiabiaoji');
                                                if (aiyxjx) {
                                                    //aiyxjx.parentNode.removeChild(aiyxjx);
                                                    window.removeGZBJ(aiyxjx);
                                                }
                                            }
                                        }
                                        player.draw(2);
                                        player.removeMark(player.hasMark('zhulianbihe_mark') ? 'zhulianbihe_mark' : 'yexinjia_mark', 1);
                                        if (game.me == player && player.hasMark('yexinjia_mark') < 1 && player.hasMark('xianqu_mark') < 1 && player.hasMark('yinyang_mark') < 1 && player.hasMark('zhulianbihe_mark') < 1) {
                                            /*window.gzbjbg.remove();
                                            window.gzbjbg = null;*/
                                            window.removeGZBJ_BG();
                                        }
                                    },
                                };
                                case '阴阳鱼': return {
                                    content: function () {
                                        if (player.hasMark('yinyang_mark')) {
                                            if (game.me == player) {
                                                var yyy = document.querySelector('.yingyanyubiaoji');
                                                if (yyy) {
                                                    //yyy.parentNode.removeChild(yyy);
                                                    window.removeGZBJ(yyy);
                                                }
                                            } else {
                                                var aiyyy = document.querySelector('.aiyingyanyubiaoji');
                                                if (aiyyy) {
                                                    //aiyyy.parentNode.removeChild(aiyyy);
                                                    window.removeGZBJ(aiyyy);
                                                }
                                            }
                                        } else if (player.hasMark('yexinjia_mark') && player.hasMark('yinyang_mark') < 1) {
                                            if (game.me == player) {
                                                var yxjx = document.querySelector('.yexinjiabiaoji');
                                                if (yxjx) {
                                                    //yxjx.parentNode.removeChild(yxjx);
                                                    window.removeGZBJ(yxjx);
                                                }
                                            } else {
                                                var aiyxjx = document.querySelector('.aiyexinjiabiaoji');
                                                if (aiyxjx) {
                                                    //aiyxjx.parentNode.removeChild(aiyxjx);
                                                    window.removeGZBJ(aiyxjx);
                                                }
                                            }
                                        }
                                        player.draw();
                                        player.removeMark(player.hasMark('yinyang_mark') ? 'yinyang_mark' : 'yexinjia_mark', 1);
                                        if (game.me == player && player.hasMark('yexinjia_mark') < 1 && player.hasMark('xianqu_mark') < 1 && player.hasMark('yinyang_mark') < 1 && player.hasMark('zhulianbihe_mark') < 1) {
                                            /*window.gzbjbg.remove();
                                            window.gzbjbg = null;*/
                                            window.removeGZBJ_BG();
                                        }
                                    }
                                };
                                case '先驱': return { content: lib.skill.xianqu_mark.content };
                            }
                        },
                    },
                    ai: {
                        order: 1,
                        result: {
                            player: 1,
                        },
                    },
                };
                //先驱
                lib.skill.xianqu_mark = {
                    // intro:{
                    // content:"◇出牌阶段，你可以弃置此标记，然后将手牌摸至四张并观看一名其他角色的一张武将牌。",
                    // },
                    content: function () {
                        "step 0"
                        if (player.hasMark('xianqu_mark')) {
                            if (game.me == player) {
                                var xq = document.querySelector('.xianqubiaoji');
                                if (xq) {
                                    //xq.parentNode.removeChild(xq);
                                    window.removeGZBJ(xq);
                                }
                            } else {
                                var aixq = document.querySelector('.xianqubiaojiai');
                                if (aixq) {
                                    //aixq.parentNode.removeChild(aixq);
                                    window.removeGZBJ(aixq);
                                }
                            }
                        } else if (player.hasMark('yexinjia_mark') && player.hasMark('xianqu_mark') < 1) {
                            if (game.me == player) {
                                var yxjx = document.querySelector('.yexinjiabiaoji');
                                if (yxjx) {
                                    //yxjx.parentNode.removeChild(yxjx);
                                    window.removeGZBJ(yxjx);
                                }
                            } else {
                                var aiyxjx = document.querySelector('.aiyexinjiabiaoji');
                                if (aiyxjx) {
                                    //aiyxjx.parentNode.removeChild(aiyxjx);
                                    window.removeGZBJ(aiyxjx);
                                }
                            }
                        }
                        player.removeMark(player.hasMark('xianqu_mark') ? 'xianqu_mark' : 'yexinjia_mark', 1);
                        if (game.me == player && player.hasMark('yexinjia_mark') < 1 && player.hasMark('xianqu_mark') < 1 && player.hasMark('yinyang_mark') < 1 && player.hasMark('zhulianbihe_mark') < 1) {
                            /*window.gzbjbg.remove();
                            window.gzbjbg = null;*/
                            window.removeGZBJ_BG();
                        }
                        var num = 4 - player.countCards('h');
                        if (num) player.draw(num);
                        "step 1"
                        if (game.hasPlayer(function (current) {
                            return current != player && current.isUnseen(2);
                        })) player.chooseTarget('是否观看一名其他角色的一张暗置武将牌？', function (card, player, target) {
                            return target != player && target.isUnseen(2);
                        }).set('ai', function (target) {
                            if (target.isUnseen()) {
                                var next = _status.event.player.getNext();
                                if (target != next) return 10;
                                return 9;
                            }
                            return -get.attitude(_status.event.player, target);
                        });
                        else event.finish();
                        "step 2"
                        if (result.bool) {
                            event.target = result.targets[0];
                            player.line(event.target, 'green');
                            var controls = [];
                            if (event.target.isUnseen(0)) controls.push('主将');
                            if (event.target.isUnseen(1)) controls.push('副将');
                            if (controls.length > 1) {
                                player.chooseControl(controls);
                            }
                            if (controls.length == 0) event.finish();
                        }
                        else {
                            player.removeSkill('xianqu_mark');
                            event.finish();
                        }
                        "step 3"
                        if (result.control) {
                            if (result.control == '主将') {
                                player.viewCharacter(event.target, 0);
                            }
                            else {
                                player.viewCharacter(event.target, 1);
                            }
                        }
                        else if (target.isUnseen(0)) {
                            player.viewCharacter(event.target, 0);
                        }
                        else {
                            player.viewCharacter(event.target, 1);
                        }
                    },
                };
                lib.skill.zhulianbihe_mark = {};
                lib.skill.yinyang_mark = {};
                lib.skill.yexinjia_mark = {};
                lib.translate._guozhan_marks_backup = '标记';
                lib.translate._guozhan_marks = '标记';
                //珠联璧合回血
                lib.skill._zhulianbihe_mark_tao = {
                    ruleSkill: true,
                    enable: "chooseToUse",
                    filter: function (event, player) {
                        return event.type != 'phase' && (player.hasMark('zhulianbihe_mark') || player.hasMark('yexinjia_mark'));
                    },
                    viewAsFilter: function (player) {
                        return player.hasMark('zhulianbihe_mark') || player.hasMark('yexinjia_mark');
                    },
                    viewAs: {
                        name: "tao",
                        isCard: true,
                    },
                    filterCard: function () { return false },
                    selectCard: -1,
                    precontent: function () {
                        if (player.hasMark('zhulianbihe_mark')) {
                            if (game.me == player) {
                                var zlbhx = document.querySelector('.zhulianbihebiaoji');
                                if (zlbhx) {
                                    //zlbhx.parentNode.removeChild(zlbhx);
                                    window.removeGZBJ(zlbhx);
                                }
                            } else {
                                var aizlbhx = document.querySelector('.aizhulianbihebiaoji');
                                if (aizlbhx) {
                                    //aizlbhx.parentNode.removeChild(aizlbhx);
                                    window.removeGZBJ(aizlbhx);
                                }
                            }
                        }
                        else if (player.hasMark('yexinjia_mark') && player.hasMark('zhulianbihe_mark') < 1) {
                            if (game.me == player) {
                                var yxjx = document.querySelector('.yexinjiabiaoji');
                                if (yxjx) {
                                    //yxjx.parentNode.removeChild(yxjx);
                                    window.removeGZBJ(yxjx);
                                }
                            } else {
                                var aiyxjx = document.querySelector('.aiyexinjiabiaoji');
                                if (aiyxjx) {
                                    //aiyxjx.parentNode.removeChild(aiyxjx);
                                    window.removeGZBJ(aiyxjx);
                                }
                            }
                        }
                        player.removeMark(player.hasMark('zhulianbihe_mark') ? 'zhulianbihe_mark' : 'yexinjia_mark', 1);
                        if (game.me == player && player.hasMark('yexinjia_mark') < 1 && player.hasMark('xianqu_mark') < 1 && player.hasMark('yinyang_mark') < 1 && player.hasMark('zhulianbihe_mark') < 1) {
                            /*window.gzbjbg.remove();
                            window.gzbjbg = null;*/
                            window.removeGZBJ_BG();
                        }
                    },
                };
                //阴阳鱼手牌上限		
                lib.skill._yinyang_mark_add = {
                    ruleSkill: true,
                    trigger: {
                        player: "phaseDiscardBegin",
                    },
                    filter: function (event, player) {
                        return (player.hasMark('yinyang_mark') || player.hasMark('yexinjia_mark')) && player.needsToDiscard();
                    },
                    prompt: function (event, player) {
                        return '是否弃置一枚【' + (player.hasMark('yinyang_mark') ? '阴阳鱼' : '野心家') + '】标记，使本回合的手牌上限+2？';
                    },
                    content: function () {
                        if (player.hasMark('yinyang_mark')) {
                            if (game.me == player) {
                                var yyyx = document.querySelector('.yingyanyubiaoji');
                                if (yyyx) {
                                    //yyyx.parentNode.removeChild(yyyx);
                                    window.removeGZBJ(yyyx);
                                }
                            } else {
                                var aiyyyx = document.querySelector('.aiyingyanyubiaoji');
                                if (aiyyyx) {
                                    //aiyyyx.parentNode.removeChild(aiyyyx);
                                    window.removeGZBJ(aiyyyx);
                                }
                            }
                        }
                        else if (player.hasMark('yexinjia_mark') && player.hasMark('yinyang_mark') < 1) {
                            if (game.me == player) {
                                var yxjx = document.querySelector('.yexinjiabiaoji');
                                if (yxjx) {
                                    //yxjx.parentNode.removeChild(yxjx);
                                    window.removeGZBJ(yxjx);
                                }
                            } else {
                                var aiyxjx = document.querySelector('.aiyexinjiabiaoji');
                                if (aiyxjx) {
                                    //aiyxjx.parentNode.removeChild(aiyxjx);
                                    window.removeGZBJ(aiyxjx);
                                }
                            }
                        }
                        player.addTempSkill('yinyang_add', 'phaseAfter');
                        player.removeMark(player.hasMark('yinyang_mark') ? 'yinyang_mark' : 'yexinjia_mark', 1);
                        if (game.me == player && player.hasMark('yexinjia_mark') < 1 && player.hasMark('xianqu_mark') < 1 && player.hasMark('yinyang_mark') < 1 && player.hasMark('zhulianbihe_mark') < 1) {
                            /*window.gzbjbg.remove();
                            window.gzbjbg = null;*/
                            window.removeGZBJ_BG();
                        }
                    },
                };
                //国战死亡失去标记		
                lib.skill._guozhan_diebiaoji_ = {
                    trigger: { player: 'dieAfter' },
                    forced: true,
                    silent: true,
                    forceDie: true,
                    content: function () {
                        if (game.me == player) {
                            var yyy = document.querySelector('.yingyanyubiaoji');
                            if (yyy) {
                                //yyy.parentNode.removeChild(yyy);
                                window.removeGZBJ(yyy,'die');
                            }
                            var zlbh = document.querySelector('.zhulianbihebiaoji');
                            if (zlbh) {
                                //zlbh.parentNode.removeChild(zlbh);
                                window.removeGZBJ(zlbh,'die');
                            }
                            var xq = document.querySelector('.xianqubiaoji');
                            if (xq) {
                                //xq.parentNode.removeChild(xq);
                                window.removeGZBJ(xq,'die');
                            }
                            var yxj = document.querySelector('.yexinjiabiaoji');
                            if (yxj) {
                                //yxj.parentNode.removeChild(yxj);
                                window.removeGZBJ(yxj,'die');
                            }
                            if (window.gzbjbg) {
                                /*window.gzbjbg.remove();
                                window.gzbjbg = null;*/
                                window.removeGZBJ_BG();
                            }
                        }else {
                            if(player.gzbjList) {
                                for(var i=0;i<player.gzbjList.length;i++) {
                                    window.removeGZBJ(player.gzbjList[i],'aidie');
                                }
                            }
                        }
        /*else{
        var aiyyy=document.querySelector('.aiyingyanyubiaoji');		
        if (aiyyy) {aiyyy.parentNode.removeChild(aiyyy);}
        var aizlbh=document.querySelector('.aizhulianbihebiaoji');		
        if (aizlbh) {aizlbh.parentNode.removeChild(aizlbh);}
        var aixq=document.querySelector('.xianqubiaojiai');		
        if (aixq) {aixq.parentNode.removeChild(aixq);}
        var aiyxj=document.querySelector('.aiyexinjiabiaoji');		
        if (aiyxj) {aiyxj.parentNode.removeChild(aiyxj);}        
        }*/
                    },
                };
                //国战阵法
                lib.skill._guozhan_duiweibiaoji_gua_ = {
                    trigger: { global: ['showCharacterAfter', 'dieAfter', 'phaseZhunbeiAfter'] },
                    forced: true,
                    silent: true,
                    filter: function (event, player) {
                        return lib.config.mode == 'guozhan';
                    },
                    content: function () {
                        var shang = player.getPrevious()?get.translation(player.getPrevious().group):'未知';
                        var xia = player.getNext()?get.translation(player.getNext().group):'未知';
                        var ziji = get.translation(player.group);
                        if ((xia == ziji && xia != '未知' && ziji != '未知') || (shang == ziji && shang != '未知' && ziji != '未知')) {
                            if (ziji == '魏') { ui.create.div('.guozhanweidui', player); }
                            if (ziji == '蜀') { ui.create.div('.guozhanshudui', player); }
                            if (ziji == '吴') { ui.create.div('.guozhanwudui', player); }
                            if (ziji == '群') { ui.create.div('.guozhanqundui', player); }
                            if (ziji == '晋') { ui.create.div('.guozhanjindui', player); }
                        }
                        //围
                        if (shang == xia && shang != ziji && xia != ziji && shang != '未知' && xia != '未知' && player.getPrevious() != player.getNext()) {
                            ui.create.div('.guozhanwei', player);
                        }
                    },
                };
                //删除阵法
                lib.skill._guozhan_duiweibiaoji_gua_gua_ = {
                    trigger: { global: ['showCharacterEnd', 'dieEnd', 'phaseZhunbeiEnd'] },
                    forced: true,
                    silent: true,
                    forceDie: true,
                    filter: function (event, player) {
                        return lib.config.mode == 'guozhan';
                    },
                    content: function () {
                        //有时候player.getPrevious()这些会出现null值，暂改修复
                        var shang = player.getPrevious()?get.translation(player.getPrevious().group):false;
                        var xia = player.getNext()?get.translation(player.getNext().group):false;
                        var ziji = get.translation(player.group);
                        //if(xia!=ziji&&xia!='未知'&&ziji!='未知'&&shang!=ziji&&shang!='未知'){     
                        for (var i = 0; i < 3; i++) {
                            var scweidui = document.querySelector('.guozhanweidui');
                            if (scweidui) { scweidui.parentNode.removeChild(scweidui); }
                            var scwudui = document.querySelector('.guozhanwudui');
                            if (scwudui) { scwudui.parentNode.removeChild(scwudui); }
                            var scshudui = document.querySelector('.guozhanshudui');
                            if (scshudui) { scshudui.parentNode.removeChild(scshudui); }
                            var scqundui = document.querySelector('.guozhanqundui');
                            if (scqundui) { scqundui.parentNode.removeChild(scqundui); }
                            var scjindui = document.querySelector('.guozhanjindui');
                            if (scjindui) { scjindui.parentNode.removeChild(scjindui); }
                        }
                        // }           
                        // if(shang!=xia && shang!=ziji && xia!=ziji && shang!='未知' && xia!='未知'){
                        for (var i = 0; i < 3; i++) {
                            var scwei = document.querySelector('.guozhanwei');
                            if (scwei) { scwei.parentNode.removeChild(scwei); }
                        }
                        //  }        
                    },
                };
                //军令特效     
                lib.translate.junling = '\0';
                lib.element.content.chooseJunlingFor = function () {
                    'step 0'
                    var list = ['junling1', 'junling2', 'junling3', 'junling4', 'junling5', 'junling6'];
                    list = list.randomGets(2).sort();
                    var dialog = ui.create.dialog('<b><font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>军令<img src=' + lib.assetURL + 'extension/手杀标准UI/original/标记补充/image/' + 'arrow.png' + ' style=;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', [list, 'vcard']);
                    dialog.classList.add('fullheight');
                    for (var i = 0; i < list.length; i++) {
                        var dd = dialog.querySelector('[data-card-name="' + list[i] + '"]');
                        dd.setBackgroundImage('extension/手杀标准UI/original/标记补充/group/junling_front.png');
                        dd.style.width = '130px';
                        dd.style.height = '230px';
                        dd.style.top = '30px';
                        dd.classList.add('none');
                    }
                    if (game.me == player) {
                        setTimeout(function () {
                            for (var i = 0; i < list.length; i++) {
                                var dd = dialog.querySelector('[data-card-name="' + list[i] + '"]');
                                dd.setBackgroundImage('none');
                            }
                            decadeUI.animation.playSpine({ name: 'SSZBB_PJN_junling', speed: 0.7, }, { scale: 0.75, x: [0, 0.55], y: [0, 0.58] });
                            decadeUI.animation.playSpine({ name: 'SSZBB_PJN_junling', speed: 0.7, }, { scale: 0.75, x: [0, 0.45], y: [0, 0.58] });
                        },1000);
                        setTimeout(function () {
                            for (var i = 0; i < list.length; i++) {
                                var dd = dialog.querySelector('[data-card-name="' + list[i] + '"]');
                                dd.setBackgroundImage('extension/手杀标准UI/original/标记补充/group/' + list[i] + '.png');
                                dd.style.width = '130px';
                                dd.style.height = '245px';
                                dd.style.top = '25px';
                            }
                        }, 1600);
                    }
                    player.chooseButton(1, dialog, true).set('ai', function (button) {
                        return get.junlingEffect(_status.event.player, button.link[2], _status.event.getParent().target, [], _status.event.player);
                    });
                    'step 1'
                    event.result = {
                        junling: result.links[0][2],
                        targets: [],
                    };
                    if (result.links[0][2] == 'junling1') player.chooseTarget('选择一名角色，做为若该军令被执行，受到伤害的角色', true).set('ai', function (_target) {
                        return get.damageEffect(_target, target, player);
                    });
                    'step 2'
                    if (result.targets.length) {
                        player.line(result.targets, 'green');
                        event.result.targets = result.targets;
                    }
                };
                //建国特效        
                lib.game.showYexings = function () {
                    if (_status.showYexings) return;
                    _status.showYexings = true;
                    var next = game.createEvent('showYexings', false);
                    next.setContent(function () {
                        'step 0'
                        event.targets = game.filterPlayer(function (current) {
                            return lib.character[current.name1][1] == 'ye';
                        }).sortBySeat(_status.currentPhase);
                        event.targets2 = [];
                        'step 1'
                        var target = targets.shift();
                        event.target = target;
                        target.chooseBool('是否【暴露野心】，展示主将并继续战斗？', '若选择“否”，则视为本局游戏失败');
                        'step 2'
                        if (result.bool) {
                            event.targets2.push(target);
                            //	target.$fullscreenpop('暴露野心','thunder');
                            game.log(target, '暴露了野心');
                            target.showCharacter(0);
                            //	game.delay(2);
                            if (targets.length) event.goto(1);
                            else if (game.players.length < 3) {
                                delete _status.showYexings;
                                event.finish();
                            }
                        }
                        else {
                            if (targets.length) event.goto(1);
                            else {
                                var winner = game.findPlayer(function (current) {
                                    return lib.character[current.name1][1] != 'ye';
                                });
                                if (winner) {
                                    game.broadcastAll(function (id) {
                                        game.winner_id = id;
                                    }, winner.playerid);
                                    game.checkResult();
                                }
                                delete _status.showYexings;
                                event.finish();
                            }
                        }
                        'step 3'
                        var source = event.targets2.shift();
                        event.source = source;
                        var targets = game.filterPlayer(function (current) {
                            return current.identity != 'ye' && current != source && !get.is.jun(current) && !event.targets2.contains(current) && !current.storage.yexinjia_friend;
                        }).sortBySeat(source);
                        if (!targets.length) {
                            delete _status.showYexings;
                            event.finish();
                        }
                        else {
                            event.targets = targets;
                            source.chooseBool('是否发起【拉拢人心】？', '令所有其他不为君主/暴露野心家的角色依次选择是否与你结盟。第一个选择加入的人将势力和胜利条件改为与你相同');
                        }
                        'step 4'
                        if (!result.bool) {
                            if (event.targets2.length) event.goto(3);
                            return;
                        }
                        'step 5'
                        var target = targets.shift();
                        event.target = target;
                        source.line(target, 'green');
                        target.chooseBool('是否响应' + get.translation(source) + '发起的【拉拢人心】？', '将势力改为野心家，且视为和该角色阵营相同').set('ai', function () {
                            if (game.players.length < 4) return true;
                            if (game.players.length < 5) return Math.random() < 0.5;
                            return Math.random() < 0.3;
                        });
                        'step 6'
                        if (result.bool) {
                            target.chat('加入');
                            var list = ['qin', 'qi', 'chu', 'yan', 'zhao', 'han', 'jing', 'hang', 'xia', 'shang', 'zhou', 'liang'];
                            //var dialog = ui.create.dialog('<b><font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>请选择国籍<img src=' + lib.assetURL + 'extension/手杀标准UI/original/标记补充/image/' + 'arrow.png' + ' style=;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', [list, 'vcard']);
                            var dialog = ui.create.dialog(game.changeToGoldTitle('请选择国籍'), [list, 'vcard']);
                            source.chooseButton(1, dialog).set('ai', () => (list.randomGet()));
                            for (var i = 0; i < list.length; i++) {
                                var dd = dialog.querySelector('[data-card-name="' + list[i] + '"]');
                                dd.setBackgroundImage('extension/手杀标准UI/original/标记补充/group/' + list[i] + 'x.png');
                                dd.style.width = '130px';
                                dd.style.height = '130px';
                                dd.style['border-radius'] = '100%';
                                dd.style['background-size'] = "100% 100%";
                                dd.style.margin = '15px';
                                dd.classList.add('none');
                            }
                        }
                        else {
                            target.chat('拒绝');
                            game.delay(1.5);
                            if (targets.length) event.goto(5);
                            else event.goto(8);
                        }
                        'step 7'
                        game.broadcastAll(function (player, target, text) {
                            player.identity = 'ye';
                            source.setIdentity(text, 'ye');
                            player.setIdentity(text, 'ye');
                            player.storage.yexinjia_friend = target;
                        }, target, source, result.links[0][2]);
                        //_status.yexinjia_list.remove(result.control);
                        target.markSkill('yexinjia_friend');
                        source.removeMark('yexinjia_mark', 1);
                        target.drawTo(4);
                        target.recover();
                        'step 8'
                        if (event.targets2.length) { event.goto(3); }
                        else {
                            delete _status.showYexings;
                            //decadeUI.animation.playSpine({ name: 'jianguo', speed: 1, }, { scale: 1 });
                            dcdAnim.loadSpine(xixiguagua.jianguo.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.jianguo, { speed: 1, scale: 1 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/yexinjia.mp3');
                            game.delay(4);
                            if (game.me == source) {
                                var yxjxx = document.querySelector('.yexinjiabiaoji');
                                if (yxjxx) { yxjxx.parentNode.removeChild(yxjxx); }
                            } else {
                                var aiyxjxx = document.querySelector('.aiyexinjiabiaoji');
                                if (aiyxjxx) { aiyxjxx.parentNode.removeChild(aiyxjxx); }
                            }
                            if (game.me == source && source.hasMark('yexinjia_mark') < 1 && source.hasMark('xianqu_mark') < 1 && source.hasMark('yinyang_mark') < 1 && source.hasMark('zhulianbihe_mark') < 1) {
                                /*window.gzbjbg.remove();
                                window.gzbjbg = null;*/
                                window.removeGZBJ_BG();
                            }
                        }
                    });
                };
                //鏖战模式
                lib.skill._aozhan_judge = {
                    trigger: {
                        player: "phaseBefore",
                    },
                    forced: true,
                    priority: 22,
                    filter: function (event, player) {
                        if (get.mode() != 'guozhan') return false;
                        if (_status.connectMode && !lib.configOL.aozhan) return false;
                        else if (!_status.connectMode && !get.config('aozhan')) return false;
                        if (_status._aozhan) return false;
                        if (game.players.length > 4) return false;
                        if (game.players.length > 3 && game.players.length + game.dead.length <= 7) return false;
                        for (var i = 0; i < game.players.length; i++) {
                            for (var j = i + 1; j < game.players.length; j++) {
                                if (game.players[i].isFriendOf(game.players[j])) return false;
                            }
                        }
                        return true;
                    },
                    content: function () {
                        //decadeUI.animation.playSpine({ name: 'aozhan', speed: 1, }, { scale: 1.2 });
                        dcdAnim.loadSpine(xixiguagua.aozhan.name, "skel", function () {
                        dcdAnim.playSpine(xixiguagua.aozhan, { speed: 1, scale: 1.2 });
                        });
                        game.playAudio('../extension/手杀标准UI/original/标记补充/audio/aozhan.mp3');
                        //decadeUI.animation.playSpine({ name: 'aozhan_huo', speed: 0.9, loop: true, }, { scale: 0.95 });
                        dcdAnim.loadSpine(xixiguagua.aozhan_huo.name, "skel", function () {
                        xixiguagua.aozhan_huo.loop=true;
                        dcdAnim.playSpine(xixiguagua.aozhan_huo, { speed: 0.9, scale: 0.95 });
                        });
                        game.delay(2.5);
                        var color = get.groupnature(player.group, "raw");
                        if (player.isUnseen()) color = 'fire';
                        //	player.$fullscreenpop('鏖战模式',color); 
                        game.broadcastAll(function () {
                            _status._aozhan = true;
                            ui.aozhan = ui.create.div('.touchinfo.left', ui.window);
                            //	ui.aozhan.innerHTML='鏖战模式';
                            if (ui.time3) ui.time3.style.display = 'none';
                            ui.aozhanInfo = ui.create.system('鏖战模式', null, true);
                            lib.setPopped(ui.aozhanInfo, function () {
                                var uiintro = ui.create.dialog('hidden');
                                uiintro.add('鏖战模式');
                                var list = [
                                    '当游戏中仅剩四名或更少角色时（七人以下游戏时改为三名或更少），若此时全场没有超过一名势力相同的角色，则从一个新的回合开始，游戏进入鏖战模式直至游戏结束。',
                                    '在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。',
                                    '进入鏖战模式后，即使之后有两名或者更多势力相同的角色出现，仍然不会取消鏖战模式。'
                                ];
                                var intro = '<ul style="text-align:left;margin-top:0;width:450px">';
                                for (var i = 0; i < list.length; i++) {
                                    intro += '<li>' + list[i];
                                }
                                intro += '</ul>'
                                uiintro.add('<div class="text center">' + intro + '</div>');
                                var ul = uiintro.querySelector('ul');
                                if (ul) {
                                    ul.style.width = '180px';
                                }
                                uiintro.add(ui.create.div('.placeholder'));
                                return uiintro;
                            }, 250);
                            game.playBackgroundMusic();
                        });
                        game.countPlayer(function (current) { current.addSkill('aozhan') });
                    },
                };

            };//国战美化尾
            //体力样式
            if (config.guozhanmeihua) {
                var nochg=false;
                if(!lib.config.hp_style_bjbcmeihuaGZ) {game.saveConfig('hp_style_bjbcmeihuaGZ','bround');nochg=true;}
                if(!lib.config.hp_style_bjbcmeihua) {game.saveConfig('hp_style_bjbcmeihua','glass');nochg=true;}
                if(lib.config.hp_style&&!nochg) {
                    if(lib.config.hp_style_lastguozhan) {
                         game.saveConfig('hp_style_bjbcmeihuaGZ',lib.config.hp_style);
                    }else {
                         game.saveConfig('hp_style_bjbcmeihua',lib.config.hp_style);
                    }
                }
                if (lib.config.mode == 'guozhan') {
                    if(lib.config.hp_style_bjbcmeihuaGZ) lib.configMenu.appearence.config.hp_style.onclick(lib.config.hp_style_bjbcmeihuaGZ);
                    lib.skill._guozhanhalfchghp = {
                        trigger: {
                            player: 'enterGame',
                            global: ["gameStart",'gameDrawBefore'],
                        },
                        filter: function (event, player) {
                            return player==game.players[0]&&lib.config.hp_style&&['bxinglass','bround'].contains(lib.config.hp_style);
                        },
                        silent: true,
                        charlotte: true,
                        forced: true,
                        content: function () {
                            var oldstyle=lib.config.hp_style;
                            lib.configMenu.appearence.config.hp_style.onclick(oldstyle.slice(1));
                            game.saveConfig('hp_style',oldstyle);
                        },
                    };
                    game.saveConfig('hp_style_lastguozhan',true);
                } else {
                    if(lib.config.hp_style_bjbcmeihua) lib.configMenu.appearence.config.hp_style.onclick(lib.config.hp_style_bjbcmeihua);
                    //lib.configMenu.appearence.config.hp_style.onclick('glass');
                    game.saveConfig('hp_style_lastguozhan',false);
                }
            };
            //体力翻倍
            if (config.xlfbmoshi) {
                lib.skill._xigua_xueliangfanbei_ = {
                    trigger: {
                        global: "gameStart",
                    },
                    silent: true,
                    charlotte: true,
                    forced: true,
                    content: function () {
                        player.gainMaxHp(player.hp);
                        player.recover(player.hp);
                    },
                };
            };
            //摸牌翻倍
            if (config.mpfbmoshi) {
                lib.skill._xigua_mopaifanbei_ = {
                    trigger: {
                        player: "phaseDrawBegin2",
                    },
                    silent: true,
                    charlotte: true,
                    forced: true,
                    content: function () {
                        trigger.num += 2;
                    },
                };
            };
            //主亡忠继
            if (config.zhujizhongwang && lib.config.mode == 'identity') {
                lib.skill._xigua_zhuwanzhongji_ = {
                    charlotte: true,
                    trigger: {
                        global: "dieBegin",
                    },
                    forced: true,
                    filter: function (event, player) {
                        return event.player.identity == 'zhu' && (player.identity == 'zhong' || player.identity == 'mingzhong');
                    },
                    logTarget: "player",
                    content: function () {
                        game.broadcastAll(function (player, target) {
                            target.identity = player.identity;
                            if (player.identity == 'mingzhong') game.zhong = target;
                            delete target.isZhu;
                            player.identity = 'zhu';
                            game.zhu = player;
                            player.showIdentity();
                            target.showIdentity();
                        }, player, trigger.player);
                        event.trigger('zhuUpdate');
                    },
                };
            };

            //手杀击杀特效
            if (config.shoushajishatexiao) {
                lib.skill._shoushajisha_ = {
                    trigger: {
                        source: "dieBegin",
                    },
                    silent: true,
                    charlotte: true,
                    forced: true,
                    priority: 2022,
                    content: function () {
              if (!player.storage._shoushajisha_) player.storage._shoushajisha_ = 0;
                        player.storage._shoushajisha_++
                        //一破
               if (player.storage._shoushajisha_ == 1) {
                            if (player.storage._shoushajisha_3 == true) { event.finish(); return; }
                            for (var i of game.players) i.storage._shoushajisha_3 = true;
                            //decadeUI.animation.playSpine({
                            //    name: 'shoushajisha', action: "yipo",
                            //    scale: 0.8,
                            //});
                            dcdAnim.loadSpine(xixiguagua.shoushajisha.name, "skel", function () {
                                xixiguagua.shoushajisha.action = 'play1';
                                dcdAnim.playSpine(xixiguagua.shoushajisha, { scale: 0.8 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/a_yipo.mp3');
                            //游戏暂停
                            game.delay(4);
                        }
                        //双连
                        if (player.storage._shoushajisha_ == 2) {
                            //decadeUI.animation.playSpine({
                            //    name: 'shoushajisha', action: "shuanglian",
                            //    scale: 0.8
                            //});
                            dcdAnim.loadSpine(xixiguagua.shoushajisha.name, "skel", function () {
                                xixiguagua.shoushajisha.action = 'play2';
                                dcdAnim.playSpine(xixiguagua.shoushajisha, { scale: 0.8 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/a_shuanglian.mp3');
                            //二连斩
                            //decadeUI.animation.playSpine({ name: 'erlianzhan', speed: 0.8, },
                            //    { scale: 0.7, parent: player });
                            dcdAnim.loadSpine(xixiguagua.erlianzhan.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.erlianzhan, { speed: 0.8, scale: 0.7, parent: player });
                            });
                            game.delay(4);
                        }
                        //三连
                        if (player.storage._shoushajisha_ == 3) {
                            //decadeUI.animation.playSpine({
                            //    name: 'shoushajisha', action: "sanlian",
                            //    scale: 0.8
                            //});
                            dcdAnim.loadSpine(xixiguagua.shoushajisha.name, "skel", function () {
                                xixiguagua.shoushajisha.action = 'play3';
                                dcdAnim.playSpine(xixiguagua.shoushajisha, { scale: 0.8 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/a_sanlian.mp3');
                            //三连斩
                            //decadeUI.animation.playSpine({ name: 'sanlianzhan', speed: 0.8, },
                            //    { scale: 0.7, parent: player });
                            dcdAnim.loadSpine(xixiguagua.sanlianzhan.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.sanlianzhan, { speed: 0.8, scale: 0.7, parent: player });
                            });
                            game.delay(4.2);
                        }
                        //四连
                        if (player.storage._shoushajisha_ == 4) {
                            //decadeUI.animation.playSpine({
                            //    name: 'shoushajisha', action: "silian",
                            //    scale: 0.8
                            //});
                            dcdAnim.loadSpine(xixiguagua.shoushajisha.name, "skel", function () {
                                xixiguagua.shoushajisha.action = 'play4';
                                dcdAnim.playSpine(xixiguagua.shoushajisha, { scale: 0.8 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/a_silian.mp3');
                            //四连斩
                            //decadeUI.animation.playSpine({ name: 'silianzhan', speed: 0.8, },
                            //    { scale: 0.7, parent: player });
                            dcdAnim.loadSpine(xixiguagua.silianzhan.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.silianzhan, { speed: 0.8, scale: 0.7, parent: player });
                            });
                            game.delay(4.2);
                        }
                        //五连
                        if (player.storage._shoushajisha_ == 5) {
                            //decadeUI.animation.playSpine({
                            //    name: 'shoushajisha', action: "wulian",
                            //    scale: 0.8, speed: 0.9
                            //});
                            dcdAnim.loadSpine(xixiguagua.shoushajisha.name, "skel", function () {
                                xixiguagua.shoushajisha.speed = 0.8;
                                xixiguagua.shoushajisha.action = 'play5';
                                dcdAnim.playSpine(xixiguagua.shoushajisha, { scale: 0.8 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/a_wulian.mp3');
                            //五连斩
                            //decadeUI.animation.playSpine({ name: 'wulianzhan', speed: 0.8, },
                            //    { scale: 0.7, parent: player });
                            dcdAnim.loadSpine(xixiguagua.wulianzhan.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.wulianzhan, { speed: 0.8, scale: 0.7, parent: player });
                            });
                            game.delay(4.2);
                        }
                        //六连
                        if (player.storage._shoushajisha_ == 6) {
                            //decadeUI.animation.playSpine({
                            //    name: 'shoushajisha', action: "liulian",
                            //    scale: 0.8, speed: 0.9
                            //});
                            dcdAnim.loadSpine(xixiguagua.shoushajisha.name, "skel", function () {
                                xixiguagua.shoushajisha.speed = 0.8;
                                xixiguagua.shoushajisha.action = 'play6';
                                dcdAnim.playSpine(xixiguagua.shoushajisha, { scale: 0.8 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/a_liulian.mp3');
                            //六连斩
                            //decadeUI.animation.playSpine({ name: 'liulianzhan', speed: 0.8, },
                            //    { scale: 0.7, parent: player });
                            dcdAnim.loadSpine(xixiguagua.liulianzhan.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.liulianzhan, { speed: 0.8, scale: 0.7, parent: player });
                            });
                            game.delay(4.2);
                        }
                        //七连
                        if (player.storage._shoushajisha_ >= 7) {
                            //decadeUI.animation.playSpine({
                            //    name: 'shoushajisha', action: "qilian",
                            //    scale: 0.8, speed: 0.9
                            //});
                            dcdAnim.loadSpine(xixiguagua.shoushajisha.name, "skel", function () {
                                xixiguagua.shoushajisha.speed = 0.8;
                                xixiguagua.shoushajisha.action = 'play7';
                                dcdAnim.playSpine(xixiguagua.shoushajisha, { scale: 0.8 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/a_qilian.mp3');
                            //七连斩
                            //decadeUI.animation.playSpine({ name: 'qilianzhan', speed: 0.8, },
                            //    { scale: 0.7, parent: player });
                            dcdAnim.loadSpine(xixiguagua.qilianzhan.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.qilianzhan, { speed: 0.8, scale: 0.7, parent: player });
                            });
                            game.delay(4.2);
                        }
                    },
                };
                lib.skill._shoushajisha_delete_ = {
                    trigger: {
                        player: "phaseJieshuBegin",
                    },
                    silent: true,
                    charlotte: true,
                    forced: true,
                    content: function () {
                        delete player.storage._shoushajisha_;
                    },
                };
                //癫狂屠戮
                lib.skill._diankuangtulu_gua = {
                    trigger: {
                        source: 'damageBegin4',
                    },
                    charlotte: true,
                    forced: true,
                    filter: function (event, player) {
                        return event.num == 3;
                    },
                    content: function () {
                        //   decadeUI.animation.playSpine({ name:'diankuangtulu',scale: 0.5,});
                        dcdAnim.loadSpine(xixiguagua.diankuangtulu.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.diankuangtulu, { scale: 0.55,y: [0, 0.47] });
                        });
                        game.playAudio('../extension/手杀标准UI/original/标记补充/audio/diankuangtulu.mp3');
                    },
                };

                //无双万军取首
                lib.skill._wanjunqushou_gua = {
                    trigger: {
                        source: 'damageBegin4',
                    },
                    charlotte: true,
                    forced: true,
                    filter: function (event, player) {
                        return event.num >= 4;
                    },
                    content: function () {
                        //decadeUI.animation.playSpine({ name:'wanjunqushou',scale: 0.5,y: [0, 0.75],});
                        dcdAnim.loadSpine(xixiguagua.wanjunqushou.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.wanjunqushou, { scale: 0.7 });
                        });
                        game.playAudio('../extension/手杀标准UI/original/标记补充/audio/wanjunqushou.mp3');
                    },
                };
                //判定医术高超和妙手回春
                lib.skill._o_o_recovertrigger = {
                    trigger: {
                        player: 'recoverEnd'
                    }, //自己回复体力后
                    direct: true,
                    filter: function (event, player) {
                        return event.source;
                    },
                    content: function () {
                        if (_status.currentPhase == player && trigger.source == player) { //如果是自己回合给自己回血
                            if (player.storage.o_o_yishugaochao == undefined) player.storage.o_o_yishugaochao = 0;
                            var bo = player.storage.o_o_yishugaochao >= 3;
                            player.storage.o_o_yishugaochao += trigger.num;
                            if (!bo && player.storage.o_o_yishugaochao >= 3) {
                                _status.event.trigger('o_oyishugaochao');
                            }
                        }
                        if (trigger.source != player && trigger.num >= player.hp && player.hp > 0) { //如果其他角色给自己回复不小于当前体力的体力值，且自己体力大于0
                            if (trigger.source.storage.o_o_miaoshouhuichun == undefined) trigger.source.storage.o_o_miaoshouhuichun = 0;
                            trigger.source.storage.o_o_miaoshouhuichun++;
                            if (trigger.source.storage.o_o_miaoshouhuichun >= 3) {
                                _status.event.trigger('o_omiaoshouhuichun');
                            }
                        }
                    },
                    group: '_o_o_recovertrigger_Delete',
                    subSkill: {
                        Delete: {
                            trigger: {
                                player: ['phaseEnd', 'roundStart']
                            },
                            direct: true,
                            filter: function (event, player) {
                                if (player.storage.o_o_yishugaochao) return true;
                                if (player.storage.o_oshousha_jisha) return true;
                                return event.name != "phase" && player.storage.o_o_miaoshouhuichun;
                            },
                            content: function () {
                                delete player.storage.o_o_yishugaochao;
                                if (trigger.name != 'phase') delete player.storage.o_o_miaoshouhuichun;
                            },
                        }
                    }
                }
                //妙手回春
                lib.skill._o_o_miaoshouhuichun = { //一轮救了3次以上其他角色
                    trigger: {
                        player: 'o_omiaoshouhuichun'
                    },
                    priority: 523,
                    forced: true,
                    content: function () {
                        // decadeUI.animation.playSpine({ name:'Xmiaoshouhuichun',scale: 0.45,y: [0, 0.5]});
                        dcdAnim.loadSpine(xixiguagua.Xmiaoshouhuichun.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.Xmiaoshouhuichun, { scale: 0.45 });
                        });
                        game.playAudio('../extension/手杀标准UI/original/十周年UI/audio/miaoshouhuichun.mp3');
                    },
                };
                //医术高超
                lib.skill._o_o_yishugaochao = { //每回合一次，自己回合内给自己回复3点以上体力
                    trigger: {
                        player: 'o_oyishugaochao'
                    },
                    priority: 523,
                    forced: true,
                    content: function () {
                        //   decadeUI.animation.playSpine({ name:'Xyishugaochao',scale: 0.8});
                        dcdAnim.loadSpine(xixiguagua.Xyishugaochao.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.Xyishugaochao, { scale: 0.8 });
                        });
                        game.playAudio('../extension/手杀标准UI/original/十周年UI/audio/yishugaochao.mp3');
                    },
                };

                //流失体力
                lib.skill._losehp_ = {
                    trigger: {
                        player: 'loseHpBegin'
                    },
                    forced: true,
                    content: function () {
                        //     decadeUI.animation.playSpine({ name:'effect_loseHp', speed:0.8},{ scale: 0.6,parent: player });
                        dcdAnim.loadSpine(xixiguagua.effect_loseHp.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.effect_loseHp, { speed: 0.8, scale: 0.6, parent: player });
                        });
                        game.playAudio('../extension/手杀标准UI/original/十周年UI/audio/effect_loseHp.mp3');
                    },
                },

                    //免伤特效
                    lib.skill._mianshang_ = {
                        trigger: {
                            player: ['damageZero', 'damageCancelled'],
                        },
                        forced: true,
                        content: function () {
                            //   decadeUI.animation.playSpine({ name:'mianshang',speed:0.8,},{ scale: 0.75,parent: player });     
                            dcdAnim.loadSpine(xixiguagua.mianshang.name, "skel", function () {
                                //dcdAnim.playSpine(xixiguagua.mianshang, { scale: 0.75, parent: player });
                                //位置和大小微调了下
                                dcdAnim.playSpine(xixiguagua.mianshang, { scale: 0.77, x: [0, 0.525], y: [0, 0.49], parent: player });
                            });
                        },
                    },
                    //伤害数字2
                    lib.skill._player_baojiA = {
                        trigger: {
                            player: 'damageBegin4'
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event) {
                            return event.num > 1 && event.num <= 2;
                        },
                        content: function () {
                            //decadeUI.animation.playSpine({ name:'shuzi',action:"2",speed:0.8,},{ scale: 0.6,parent: player });
                            dcdAnim.loadSpine(xixiguagua.shuzi.name, "skel", function () {
                                xixiguagua.shuzi.action = '2';
                                dcdAnim.playSpine(xixiguagua.shuzi, { speed: 0.8, scale: 0.6, parent: player });
                            });
                        },
                    },
                    //伤害数字3
                    lib.skill._player_baojiB = {
                        trigger: {
                            player: 'damageBegin4'
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event) {
                            return event.num > 2 && event.num <= 3;
                        },
                        content: function () {
                            dcdAnim.loadSpine(xixiguagua.shuzi.name, "skel", function () {
                                xixiguagua.shuzi.action = '3';
                                dcdAnim.playSpine(xixiguagua.shuzi, { speed: 0.8, scale: 0.6, parent: player });
                            });
                        },
                    },
                    //伤害数值4
                    lib.skill._player_baojiC = {
                        trigger: {
                            player: 'damageBegin4'
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event) {
                            return event.num > 3 && event.num <= 4;
                        },
                        content: function () {
                            dcdAnim.loadSpine(xixiguagua.shuzi.name, "skel", function () {
                                xixiguagua.shuzi.action = '4';
                                dcdAnim.playSpine(xixiguagua.shuzi, { speed: 0.8, scale: 0.6, parent: player });
                            });
                        },
                    },
                    //伤害数字5
                    lib.skill._player_baojiD = {
                        trigger: {
                            player: 'damageBegin4'
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event) {
                            return event.num > 4 && event.num <= 5;
                        },
                        content: function () {
                            dcdAnim.loadSpine(xixiguagua.shuzi.name, "skel", function () {
                                xixiguagua.shuzi.action = '5';
                                dcdAnim.playSpine(xixiguagua.shuzi, { speed: 0.8, scale: 0.6, parent: player });
                            });
                        },
                    },
                    //伤害数值6
                    lib.skill._player_baojiE = {
                        trigger: {
                            player: 'damageBegin4'
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event) {
                            return event.num > 5 && event.num <= 6;
                        },
                        content: function () {
                            dcdAnim.loadSpine(xixiguagua.shuzi.name, "skel", function () {
                                xixiguagua.shuzi.action = '6';
                                dcdAnim.playSpine(xixiguagua.shuzi, { speed: 0.8, scale: 0.6, parent: player });
                            });
                        },
                    },
                    //伤害数值7
                    lib.skill._player_baojiF = {
                        trigger: {
                            player: 'damageBegin4'
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event) {
                            return event > 6 && event.num <= 7;
                        },
                        content: function () {
                            dcdAnim.loadSpine(xixiguagua.shuzi.name, "skel", function () {
                                xixiguagua.shuzi.action = '7';
                                dcdAnim.playSpine(xixiguagua.shuzi, { speed: 0.8, scale: 0.6, parent: player });
                            });
                        },
                    },
                    //伤害数值8
                    lib.skill._player_baojiG = {
                        trigger: {
                            player: 'damageBegin4'
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event) {
                            return event.num > 7 && event.num <= 8;
                        },
                        content: function () {
                            dcdAnim.loadSpine(xixiguagua.shuzi.name, "skel", function () {
                                xixiguagua.shuzi.action = '8';
                                dcdAnim.playSpine(xixiguagua.shuzi, { speed: 0.8, scale: 0.6, parent: player });
                            });
                        },
                    },
                    //伤害数值9
                    lib.skill._player_baojiH = {
                        trigger: {
                            player: 'damageBegin4'
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event) {
                            return event.num > 8 && event.num <= 9;
                        },
                        content: function () {
                            dcdAnim.loadSpine(xixiguagua.shuzi.name, "skel", function () {
                                xixiguagua.shuzi.action = '9';
                                dcdAnim.playSpine(xixiguagua.shuzi, { speed: 0.8, scale: 0.6, parent: player });
                            });
                        },
                    },
                //酒特效开始
                lib.skill._jiubuff_ = {
                    trigger: {
                        player: 'useCard'
                    },                   
                    firstDo: true,
                    charlotte: true,
                    filter: function (event, player) {
                        return (event.card && (event.card.name == 'jiu') && !player.isDying());
                    },
                    forced: true,
                    popup: false,
                    audio: false,
                    content: function () {
                        if (player.storage._jiubuff_ == undefined) {
                            dcdAnim.loadSpine(xixiguagua.jiubuff.name, "skel", function () {
                            xixiguagua.jiubuff.loop=true;
                                player.storage._jiubuff_ = dcdAnim.playSpine(xixiguagua.jiubuff, { scale: 0.48, x: [0, 0.52], y: [0, 0.52], parent: player });
                            });
                        }
                    },
                },
                    //酒特效消失//
                    lib.skill._jiubuff_xiaoshi_ = {
                        trigger: {
                            player: ["useCard", "dieAfte"],
                            global:["phaseAfter"],
                        },
                        priority: 20,
                        firstDo: true,
                        forceDie: true,
                        charlotte: true,
                        filter: function (event, player) {
                            if (event.name == "phase" || event.name == "die") return true;
                            if (event.name == 'useCard') return (event.card && (event.card.name == 'sha'));
                            else return true;
                        },
                        forced: true,
                        popup: false,
                        audio: false,
                        content: function () {
                            if (player.storage._jiubuff_ != undefined) {
                                decadeUI.animation.stopSpine(player.storage._jiubuff_);
                                player.storage._jiubuff_ = undefined;
                            }
                        },
                    };
                //武将扫光
                lib.skill._player_game_guagua = {
                    trigger: {
                        player: 'phaseZhunbeiBegin'
                    },
                    forced: true,
                    charlotte: true,
                    content: function () {
                        var filledCount=get.rankNum(player.name);
                        if (filledCount == 1) {
                            dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                xixiguagua.huihekaishi.action = 'yixing';
                                dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                            });
                        }
                        if (filledCount == 2) {
                            dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                xixiguagua.huihekaishi.action = 'erxing';
                                dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                            });
                        }
                        if (filledCount == 3) {
                            dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                xixiguagua.huihekaishi.action = 'sanxing';
                                dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                            });
                        }
                        if (filledCount == 4) {
                            dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                xixiguagua.huihekaishi.action = 'sixing';
                                dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                            });
                        }
                        if (filledCount == 5) {
                            dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                xixiguagua.huihekaishi.action = 'wuxing';
                                dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                            });
                        }
                        game.delay(0.5);
                    },
                    //星级扫光改为强度评价
                    /*content: function () {                        
                        if(lib.config.five_gold_sj) {
                            if (game.getRarity(player.name) == "junk") {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'yixing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                            if (game.getRarity(player.name) == "common") {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'erxing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                            if (game.getRarity(player.name) == "rare") {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'sanxing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                            if (game.getRarity(player.name) == "epic") {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'sixing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                            if (game.getRarity(player.name) == "legend") {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'wuxing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                        }else {
                            var rareNum=0;
                            switch(game.getRarity(player.name)) {
                                case 'legend':
                                    rareNum++;
                                case 'epic':
                                    rareNum++;
                                case 'rare':
                                    rareNum++;
                                case 'common':
                                    rareNum++;
                                default:
                                    rareNum++;
                                break;
                            }
                            var totalCount=4;
                            var filledCount=Math.floor(0.5+(rareNum*4/5));
                            if (filledCount == 1) {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'yixing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                            if (filledCount == 2) {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'erxing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                            if (filledCount == 3) {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'sanxing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                            if (filledCount >= 4) {
                                dcdAnim.loadSpine(xixiguagua.huihekaishi.name, "skel", function () {
                                    xixiguagua.huihekaishi.action = 'sixing';
                                    dcdAnim.playSpine(xixiguagua.huihekaishi, { speed: 2, scale: 2, parent: player });
                                });
                            }
                        }
                        game.delay(0.5);
                    },*/
                };
                //国战获得标记特效
                lib.skill._guozhan_quanjubiaoji_guagua = {
                    trigger: {
                        player: 'addMark',
                    },
                    silent: true,
                    charlotte: true,
                    forced: true,
                    content: function () {
                        if (trigger.markname == 'xianqu_mark') {
                            //decadeUI.animation.playSpine({ name: 'SS_eff_xianqu', speed: 1, }, { scale: 0.7 }); game.delay(2.5);
                            dcdAnim.loadSpine(xixiguagua.SS_eff_xianqu.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.SS_eff_xianqu, { speed: 1, scale: 0.7});
                            }); game.delay(2.5);
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/xianqu.mp3');
                        }
                        if (trigger.markname == 'yexinjia_mark') {
                            //decadeUI.animation.playSpine({ name: 'SSZBB_PJN_yexinjia', speed: 1, }, { scale: 0.7, y: [0, 0.65] }); game.delay(2.5);
                            dcdAnim.loadSpine(xixiguagua.SSZBB_PJN_yexinjia.name, "skel", function () {
                             dcdAnim.playSpine(xixiguagua.SSZBB_PJN_yexinjia, { speed: 1, scale: 0.7, y: [0, 0.65] });
                            });
                            game.delay(2.5);
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/yexinjia.mp3');
                        }
                        if (trigger.markname == 'yinyang_mark') {
                            //decadeUI.animation.playSpine({ name: 'SS_eff_yinyangyu', speed: 1, }, { scale: 0.7 }); game.delay(2.5);
                            dcdAnim.loadSpine(xixiguagua.SS_eff_yinyangyu.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.SS_eff_yinyangyu, { speed: 1, scale: 0.7 });
                            });
                            game.delay(2.5);
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/yinyangyu.mp3');
                        }
                        if (trigger.markname == 'zhulianbihe_mark') {
                            //decadeUI.animation.playSpine({ name: 'SS_eff_zhulianbihe', speed: 1, }, { scale: 0.7 }); 
                            dcdAnim.loadSpine(xixiguagua.SS_eff_zhulianbihe.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.SS_eff_zhulianbihe, { speed: 1, scale: 0.7 });
                            });
                            game.delay(2.5);
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/zhulianbihe.mp3');
                        }
                    },
                };
            };
            if (config.shiyongkapaitixiao) {
                //卡牌特效                    
                lib.skill._shiyongkapaitexiao_ = {
                    trigger: {
                        player: ['useCardBegin', 'respondBegin'],
                    },
                    firstDo: true,
                    charlotte: true,
                    forced: true,
                    content: function () {
                        // //红杀
                        // if(trigger.card.name=='sha' && get.color(trigger.card)=='red' && !trigger.card.nature){ 
                        // decadeUI.animation.playSpine({ name:'effect_hongsha', speed:0.7},{ scale: 0.8,x:[0,0.55],parent: player });
                        // }
                        // //黑杀
                        // if(trigger.card.name=='sha' && get.color(trigger.card)=='black' && !trigger.card.nature){
                        // decadeUI.animation.playSpine({ name:'effect_heisha', speed:0.7},{ scale: 0.8,x:[0,0.55],parent: player });
                        // }
                        // //雷杀
                        // if(trigger.card.name=='sha' && trigger.card.nature=='thunder'){
                        // decadeUI.animation.playSpine({ name:'effect_leisha', speed:0.7},{ scale: 0.8,x:[0,0.55],parent: player });
                        // }
                        // //火杀
                        // if(trigger.card.name=='sha' && trigger.card.nature=='fire'){
                        // decadeUI.animation.playSpine({ name:'effect_huosha', speed:0.7},{ scale: 0.8,x:[0,0.55],parent: player });
                        // }
                        //杀
                        if (trigger.card.name == 'sha' && get.type(trigger.card) == 'basic') {
                            dcdAnim.loadSpine(xixiguagua.sha.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.sha, { speed: 1, scale: 1.5, parent: player });
                            });
                            //   decadeUI.animation.playSpine({ name:'sha', speed:1},{ scale: 1.5,parent: player });
                        }
                        //闪
                        if (trigger.card.name == 'shan' && get.type(trigger.card) == 'basic') {
                            dcdAnim.loadSpine(xixiguagua.effect_shan.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.effect_shan, { speed: 1, scale: 1.5, parent: player });
                            });
                            // decadeUI.animation.playSpine({ name:'effect_shan', speed:1},{ scale: 1.5,parent: player });
                        }
                        //桃
                        if (trigger.card.name == 'tao' && get.type(trigger.card) == 'basic') {
                            dcdAnim.loadSpine(xixiguagua.effect_tao.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.effect_tao, { speed: 0.7, scale: 0.8, parent: player });
                            });
                            // decadeUI.animation.playSpine({ name:'effect_tao', speed:0.7},{ scale: 0.8,parent: player });         
                        }
                        //酒
                        if (trigger.card.name == 'jiu' && get.type(trigger.card) == 'basic') {
                            dcdAnim.loadSpine(xixiguagua.effect_jiu.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.effect_jiu, { speed: 0.7, scale: 0.8, x: [0, 0.58], parent: player });
                            });
                            //  decadeUI.animation.playSpine({ name:'effect_jiu', speed:0.7},{ scale: 0.8,x:[0,0.58],parent: player });
                        }
                        //无中生有
                        if (trigger.card.name == 'wuzhong' && get.type(trigger.card) == 'trick') {
                            dcdAnim.loadSpine(xixiguagua.effect_wuzhongshengyou.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.effect_wuzhongshengyou, { speed: 1.3, scale: 0.6, x: [0, 0.55], parent: player });
                            });
                            // decadeUI.animation.playSpine({ name:'effect_wuzhongshengyou', speed:0.7},{ scale: 1,x:[0,0.55],parent: player });
                        }
                        //五谷丰登
                        if (trigger.card.name == 'wugu' && get.type(trigger.card) == 'trick') {
                        dcdAnim.loadSpine(xixiguagua.effect_wugufengdeng.name, "skel", function () {
                            for (var i of game.players) {
                                    dcdAnim.playSpine(xixiguagua.effect_wugufengdeng, { speed: 0.7, scale: 0.7, x: [0, 0.55], parent: i });
                                    }
                                });                            
                        }
                        //南蛮入侵
                        if (trigger.card.name == 'nanman' && get.type(trigger.card) == 'trick') {
                            //decadeUI.animation.playSpine({ name: 'effect_nanmanruqin', scale: 0.8 },);
                            dcdAnim.loadSpine(xixiguagua.effect_nanmanruqin.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.effect_nanmanruqin, { scale: 0.8 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_nanmanruqin.mp3');
                        }
                        //万剑齐发
                        if (trigger.card.name == 'wanjian' && get.type(trigger.card) == 'trick') {
                            //decadeUI.animation.playSpine({ name: 'effect_wanjianqifa_full', scale: 1 },);
                            dcdAnim.loadSpine(xixiguagua.effect_wanjianqifa_full.name, "skel", function () {                            
                            dcdAnim.playSpine(xixiguagua.effect_wanjianqifa_full, { scale: 0.9,y:[0,0.4]});
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_wanjianqifa_full.mp3');
                        }
                        //决斗
                        if (trigger.card.name == 'juedou' && get.type(trigger.card) == 'trick') {
                            //decadeUI.animation.playSpine({ name: 'SSZBB_DDZ_eff_juedou', scale: 1 },);
                            dcdAnim.loadSpine(xixiguagua.SSZBB_DDZ_eff_juedou.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.SSZBB_DDZ_eff_juedou, { scale: 1 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/SSZBB_DDZ_eff_juedou.mp3');
                        }
                        //无懈可击
                        if (trigger.card.name == 'wuxie' && get.type(trigger.card) == 'trick') {
                            //decadeUI.animation.playSpine({ name: 'effect_wuxiekeji', speed: 1, }, { scale: 0.7, parent: player });
                            //  decadeUI.animation.playSpine({ name:'effect_wuxiekeji',action:"play2",speed:1,},{ scale: 0.7,parent: player });   
                            dcdAnim.loadSpine(xixiguagua.effect_wuxiekeji.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.effect_wuxiekeji, { speed: 1, scale: 0.7, parent: player });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_wuxiekeji.mp3');
                        }
                        //武器
if (get.subtype(trigger.card) == 'equip1') {
    setTimeout(function () {
        dcdAnim.loadSpine(xixiguagua.zbwq.name, "skel", function () {
            dcdAnim.playSpine(xixiguagua.zbwq, { speed: 1.0, scale: 0.47, x: [76, 0], y: [44, 0],parent: player });
        });
    }, 1000);
}
//防具
if (get.subtype(trigger.card) == 'equip2') {
    setTimeout(function () {
        dcdAnim.loadSpine(xixiguagua.zb.name, "skel", function () {
            dcdAnim.playSpine(xixiguagua.zb, { speed: 1.0, scale: 0.47, x: [76, 0], y: [28, 0],parent: player });
        });
    }, 1000);
}
//防御马
if (get.subtype(trigger.card) == 'equip3') {
    setTimeout(function () {
        dcdAnim.loadSpine(xixiguagua.zbfym.name, "skel", function () {
            dcdAnim.playSpine(xixiguagua.zbfym, { speed: 1.0, scale: 0.47, x: [49, 0], y: [10, 0],parent: player });
        });
    }, 1000);
}
//进攻马
if (get.subtype(trigger.card) == 'equip4') {
    setTimeout(function () {
        dcdAnim.loadSpine(xixiguagua.zbjgm.name, "skel", function () {
            dcdAnim.playSpine(xixiguagua.zbjgm, { speed: 1.0, scale: 0.47, x: [102, 0], y: [10, 0],parent: player });
        });
    }, 1000);
}
//宝物
if (get.subtype(trigger.card) == 'equip5') {
    setTimeout(function () {
        dcdAnim.loadSpine(xixiguagua.zbbw.name, "skel", function () {
            dcdAnim.playSpine(xixiguagua.zbbw, { speed: 1.0, scale: 0.47, x: [76, 0], y: [60, 0],parent: player });
        });
    }, 1000);
}
                        //文和乱武
                        if (trigger.card.name == 'gz_wenheluanwu' && get.type(trigger.card) == 'trick') {
                            //decadeUI.animation.playSpine({ name: 'effect_wenheluanwu', scale: 1 },);
                            dcdAnim.loadSpine(xixiguagua.effect_wenheluanwu.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.effect_wenheluanwu, { scale: 1 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_wenheluanwu.mp3');
                        }
                        //固国安邦
                        if (trigger.card.name == 'gz_guguoanbang' && get.type(trigger.card) == 'trick') {
                            //decadeUI.animation.playSpine({ name: 'effect_guguoanbang', scale: 1 },);
                            dcdAnim.loadSpine(xixiguagua.effect_guguoanbang.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.effect_guguoanbang, { scale: 1 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_guguoanbang.mp3');
                        }
                        //克复中原
                        if (trigger.card.name == 'gz_kefuzhongyuan' && get.type(trigger.card) == 'trick') {
                            //decadeUI.animation.playSpine({ name: 'effect_kefuzhongyuan', scale: 1 },);
                            dcdAnim.loadSpine(xixiguagua.effect_kefuzhongyuan.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.effect_kefuzhongyuan, { scale: 1 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_kefuzhongyuan.mp3');
                        }
                        //号令天下
                        if (trigger.card.name == 'gz_haolingtianxia' && get.type(trigger.card) == 'trick') {
                            //decadeUI.animation.playSpine({ name: 'effect_haolingtianxia', scale: 1 },);
                            dcdAnim.loadSpine(xixiguagua.effect_haolingtianxia.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.effect_haolingtianxia, { scale: 1 });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_haolingtianxia.mp3');
                        }
                    },
                };

                // 成为目标时
                lib.skill._shiyongkapaitexiao_xi_gua_ = {
                    trigger: {
                        target: "useCardToTargeted",
                    },
                    charlotte: true,
                    forced: true,
                    popup: false,
                    audio: false,
                    content: function () {
                        //过河拆桥
                        if (trigger.card.name == 'guohe' && get.type(trigger.card) == 'trick') {
                            dcdAnim.loadSpine(xixiguagua.effect_guohechaiqiao.name, "skel", function () {
                                xixiguagua.effect_guohechaiqiao.action = "zizouqi_guohechaiqiao_futou";
                                dcdAnim.playSpine(xixiguagua.effect_guohechaiqiao, { scale: 0.75, speed: 1, parent: player });
                            });
                            dcdAnim.loadSpine(xixiguagua.effect_guohechaiqiao.name, "skel", function () {
                                xixiguagua.effect_guohechaiqiao.action = "zizouqi_guohechaiqiao_qiao";
                                dcdAnim.playSpine(xixiguagua.effect_guohechaiqiao, { scale: 1, speed: 1, parent: player });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/guohechaiqiao.mp3');
                        }
                        //顺手牵羊
                        if (trigger.card.name == 'shunshou' && get.type(trigger.card) == 'trick') {
                             /*dcdAnim.loadSpine(xixiguagua.shunshouqianyang.name, "skel", function () {
                                xixiguagua.shunshouqianyang.action = "yang";
                                xixiguagua.shunshouqianyang.loop = true;
                                var shunshou = dcdAnim.playSpine(xixiguagua.shunshouqianyang, { scale: 0.75, speed: 0.75, parent: player });
                                var y1 = trigger.player.offsetLeft;
                                var x1 = trigger.player.offsetTop;
                                var y = player.offsetLeft;
                                var x = player.offsetTop;
                                var xx = Math.atan2((y1 - y), x1 - x);
                                var yy = radiansToDegrees(xx);
                                shunshou.rotateTo(yy);
                                shunshou.moveTo(-(player.offsetLeft - trigger.player.offsetLeft - 70), (player.offsetTop - trigger.player.offsetTop + 90), 1000);
                                shunshou.oncomplete = function () {
                                    decadeUI.animation.stopSpine(this);
                                    this.oncomplete = null;
                                };
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/shunshouqianyang.mp3');*/
                            dcdAnim.loadSpine(xixiguagua.shunshouqianyang.name, "skel", function () {
                                xixiguagua.shunshouqianyang.action = "yang";
                                xixiguagua.shunshouqianyang.loop = true;
                            
                                const playerRect = player.getBoundingClientRect();
                                const triggerRect = trigger.player.getBoundingClientRect();
                            
                                const startX = triggerRect.left + triggerRect.width/2;
                                const startY = triggerRect.top + triggerRect.height/2;
                                const endX = playerRect.left + playerRect.width/2;
                                const endY = playerRect.top + playerRect.height/2;
                            
                                const line = document.createElement('img');
                                line.src = lib.assetURL + 'extension/手杀标准UI/original/标记补充/image/sheng.png';
                                Object.assign(line.style, {
                                    position: 'fixed',
                                    left: startX + 'px',
                                    top: startY + 'px',
                                    transformOrigin: '0 50%',
                                    pointerEvents: 'none',
                                    zIndex: 7,
                                    opacity: '0',
                                    transition: 'opacity 0.3s ease-out',
                                    willChange: 'transform, opacity'
                                });
                            
                                const deltaX = endX - startX;
                                const deltaY = endY - startY;
                                const distance = Math.sqrt(deltaX**2 + deltaY**2);
                                const angle = Math.atan2(deltaY, deltaX);
                                const angleSheep = Math.atan2(-deltaY, deltaX);
                            
                                line.style.transform = `rotate(${angle}rad)`;
                                line.style.width = distance + 'px';
                                line.style.height = '10px';
                            
                                document.body.appendChild(line);
                            
                                requestAnimationFrame(() => {
                                    line.style.opacity = '1';
                                });
                            
                                var shunshou = dcdAnim.playSpine(xixiguagua.shunshouqianyang, { 
                                    scale: 0.75, 
                                    speed: 0.75, 
                                    parent: player 
                                });
                            
                                const duration = 1000;
                                const startTime = Date.now();
                                function easeProgress(tInput) {
                                    const p1 = { x: 0.25, y: 0.1 };
                                    const p2 = { x: 0.25, y: 1 };
                                    const calcBezier = (t, a, b, c, d) => {
                                        return ((a * Math.pow(1 - t, 3)) +
                                                (b * 3 * t * Math.pow(1 - t, 2)) +
                                                (c * 3 * Math.pow(t, 2) * (1 - t)) +
                                                (d * Math.pow(t, 3)));
                                    };
                                    let low = 0, high = 1, t = tInput;
                                    for (let i = 0; i < 10; i++) {
                                        const x = calcBezier(t, 0, p1.x, p2.x, 1);
                                        if (Math.abs(x - tInput) < 1e-5) break;
                                        if (x > tInput) high = t;
                                        else low = t;
                                        t = (high + low) / 2;
                                    }
                                    return Math.min(1, Math.max(0, calcBezier(t, 0, p1.y, p2.y, 1)));
                                }
                            
                                function updateLine() {
                                    const elapsed = Date.now() - startTime;
                                    const progress = Math.min(elapsed / duration, 1);
                                    line.style.transform = `rotate(${angle}rad) scaleX(${1 - easeProgress(progress)})`;
                                    if (progress < 1) {
                                        requestAnimationFrame(updateLine);
                                    }
                                }
                            
                                if(typeof shunshou=='object') {
                                    // 关键修改：调整旋转角度以对准方向
                                    shunshou.rotateTo(radiansToDegrees(angleSheep - Math.PI/2)); // 增加π/2弧度以校正方向
                                    /*shunshou.moveTo(
                                        -(player.offsetLeft - trigger.player.offsetLeft - 70),
                                        (player.offsetTop - trigger.player.offsetTop + 90),
                                        duration
                                    );*/
                                    shunshou.moveTo(
                                        -(endX - startX - (playerRect.width/2)),
                                        (endY - startY + (playerRect.height/2)),
                                        duration
                                    );
                                
                                    requestAnimationFrame(updateLine);
                                
                                    shunshou.oncomplete = function () {
                                        decadeUI.animation.stopSpine(this);
                                        this.oncomplete = null;
                                        line.style.transition = 'opacity 0.2s';
                                        line.style.opacity = '0';
                                        setTimeout(() => {
                                            line.parentNode?.removeChild(line);
                                        }, 200);
                                    };
                                }else {
                                    line.parentNode?.removeChild(line);
                                }
                            });
                            
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/shunshouqianyang.mp3');
                        }
                    },
                };
                //指示线伤害牌特效
                lib.skill._shanghaipaishiyongtexiao_ = {
                    trigger: {
                        player: 'useCardBegin',
                    },
                    priority: 100,
                    firstDo: true,
                    charlotte: true,
                    forced: true,
                    popup: false,
                    audio: false,
                    content: function () {
                        if (get.tag(trigger.card, 'damage')) {
                            if (player != game.me) {
                                dcdAnim.loadSpine(xixiguagua.aar_longxingzhixiang.name, "skel", function () {
                                    dcdAnim.playSpine(xixiguagua.aar_longxingzhixiang, { speed: 0.5, scale: 0.6, parent: player });
                                });
                            }
                            if (player == game.me) {
                                dcdAnim.loadSpine(xixiguagua.aar_longxingzhixiang.name, "skel", function () {
                                    dcdAnim.playSpine(xixiguagua.aar_longxingzhixiang, { speed: 0.4, scale: 0.6, x: [0, -3.5], y: [0, 1], parent: player });
                                });
                            }
                        }
                    },
                }
                //游戏结束时执行          
                // lib.onover.push(function (bool) {
                // for (var i of game.players) {
                    // if (i.storage._jiubuff_ != undefined) {
                        // decadeUI.animation.stopSpine(i.storage._jiubuff_);
                        // i.storage._jiubuff_ = undefined;
                    // }
                    // if (i.storage._jiuwo_ != undefined) {
                        // decadeUI.animation.stopSpine(i.storage._jiuwo_);
                        // i.storage._jiuwo_ = undefined;    
                    // }   
                    // }             
                // });                               
            };
            //==========随机刀剑斧==========//
            if (lib.config['extension_标记补充_daojianfu'] == "shousha") {
            lib.skill._player_daojianfu_xxgg_fuzi_ = {
                trigger: {
                    player: 'damageBegin4'
                },
                charlotte: true,
                forced: true,
                content: function () {
                        let pt = trigger.source;
                        let mma, mmb, mmc, mmd, mme;
                        if (pt && !pt.storage.shoujitype) {
                            pt.storage.shoujitype = ['dao', 'jian', 'fuzi', 'no'].randomGet();
                            if(/*pt == game.me && */lib.config['extension_标记补充_daojianfu_type']!="random") {
                                pt.storage.shoujitype = lib.config['extension_标记补充_daojianfu_type'];
                            }
                        }
                        if (!pt) mma = 'jian';
                        else mma = pt.storage.shoujitype;

                        if (mma == 'dao') mmb = ['play', 'play2'], mmc = ['play', 'play2'];
                        if (mma == 'fuzi') mmb = ['play3', 'play4'], mmc = ['play3', 'play4'];
                        if (mma == 'jian') mmb = ['play5', 'play6'], mmc = ['play5', 'play6'];
                        if (mma == 'no') mmb = ['play5', 'play6'], mmc = ['play5', 'play6'];
                        if (trigger.num <= 1) {
                            if (!trigger.nature) {
                                if (mma == 'dao') {
                                    dcdAnim.loadSpine(xixiguagua.dao.name, "skel", function () {
                                        xixiguagua.dao.action = "play";
                                        dcdAnim.playSpine(xixiguagua.dao, { scale: 0.8, y: [0, 0.55], parent: player });
                                    });
                                }
                                else if (mma == 'jian') {
                                    dcdAnim.loadSpine(xixiguagua.jian.name, "skel", function () {
                                        xixiguagua.jian.action = "play";
                                        dcdAnim.playSpine(xixiguagua.jian, { scale: 0.8, parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {
                                    dcdAnim.loadSpine(xixiguagua.fuzi.name, "skel", function () {
                                        xixiguagua.fuzi.action = "play";
                                        dcdAnim.playSpine(xixiguagua.fuzi, { scale: 0.7, x: [0, 0.55], y: [0, 0.485], parent: player });
                                    });
                                }
                                else if (mma == 'no') {
                                    dcdAnim.loadSpine(xixiguagua.putong.name, "skel", function () {
                                        xixiguagua.putong.action = "play1";
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.putong, { scale: 1.2, x: [0, 0.55], y: [0, 0.485], parent: player });
                                        }, 200);
                                    });
                                }
                               // game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage.mp3');
                            }
                            if (trigger.nature == 'fire') {
                                if (mma == 'dao') {//火刀
                                    dcdAnim.loadSpine(xixiguagua.dao.name, "skel", function () {
                                        xixiguagua.dao.action = "play";
                                        dcdAnim.playSpine(xixiguagua.dao, { scale: 0.8, y: [0, 0.55], parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.huoshouji.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.huoshouji, {
                                                scale: 0.5,
                                                y: [0, 0.58],
                                                parent: player
                                            });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'jian') {//火剑
                                    dcdAnim.loadSpine(xixiguagua.jian.name, "skel", function () {
                                        xixiguagua.jian.action = "play";
                                        dcdAnim.playSpine(xixiguagua.jian, { scale: 0.8, parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.huoshouji.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.huoshouji, {
                                                scale: 0.5,
                                                y: [0, 0.58],
                                                parent: player
                                            });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'fuzi') {//火斧
                                    dcdAnim.loadSpine(xixiguagua.fuzi.name, "skel", function () {
                                        xixiguagua.fuzi.action = "play";
                                        dcdAnim.playSpine(xixiguagua.fuzi, { scale: 0.7, x: [0, 0.55], y: [0, 0.485], parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.huoshouji.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.huoshouji, {
                                                scale: 0.5,
                                                y: [0, 0.58],
                                                parent: player
                                            });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'no') {//普通火受击
                                    dcdAnim.loadSpine(xixiguagua.huo.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.huo, { scale: 0.75, x: [0, 0.25], y: [0, 0.25], parent: player });
                                        }, 200);
                                    });
                                }
                               // game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_fire.mp3');
                            };
                            if (trigger.nature == 'thunder') {
                                if (mma == 'dao') {//雷刀
                                    dcdAnim.loadSpine(xixiguagua.dao.name, "skel", function () {
                                        xixiguagua.dao.action = "play";
                                        dcdAnim.playSpine(xixiguagua.dao, { scale: 0.8, y: [0, 0.55], parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.lei.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine({ name: xixiguagua.lei.name, opacity: 1.5, action: "dian" }, { scale: 0.8, parent: player });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'jian') {//雷剑
                                    dcdAnim.loadSpine(xixiguagua.jian.name, "skel", function () {
                                        xixiguagua.jian.action = "play";
                                        dcdAnim.playSpine(xixiguagua.jian, { scale: 0.8, parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.lei.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine({ name: xixiguagua.lei.name, opacity: 1.5, action: "dian" }, { scale: 0.8, parent: player });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'fuzi') {//雷斧
                                    dcdAnim.loadSpine(xixiguagua.fuzi.name, "skel", function () {
                                        xixiguagua.fuzi.action = "play";
                                        dcdAnim.playSpine(xixiguagua.fuzi, { scale: 0.7, x: [0, 0.55], y: [0, 0.485], parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.lei.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine({ name: xixiguagua.lei.name, opacity: 1.5, action: "dian" }, { scale: 0.8, parent: player });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'no') {//普通雷受击
                                    dcdAnim.loadSpine(xixiguagua.lei.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine({ name: xixiguagua.lei.name, opacity: 1.5, action: "gonjian" }, { scale: 0.4, x: [0, 0.25], y: [0, 0.25], parent: player });
                                        }, 200);
                                    });
                                }
                               // game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_thunder.mp3');
                            };
                        }
                        // 两点伤害                   
                        else if (trigger.num > 1) {
                            dcdAnim.loadSpine(xixiguagua.baoji.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.baoji, {
                                    scale: 0.6,
                                    x: [0, 0.55],
                                    parent: player
                                });
                            });
                            if (!trigger.nature) {
                                if (mma == 'dao') {
                                    dcdAnim.loadSpine(xixiguagua.dao.name, "skel", function () {
                                        xixiguagua.dao.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.dao, { scale: 0.8, y: [0, 0.58], parent: player });
                                    });
                                }
                                else if (mma == 'jian') {
                                    dcdAnim.loadSpine(xixiguagua.jian.name, "skel", function () {
                                        xixiguagua.jian.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.jian, { scale: 0.8, parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {
                                    dcdAnim.loadSpine(xixiguagua.fuzi.name, "skel", function () {
                                        xixiguagua.fuzi.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.fuzi, { scale: 0.7, x: [0, 0.55], y: [0, 0.485], parent: player });
                                    });
                                }
                                else if (mma == 'no') {
                                    dcdAnim.loadSpine(xixiguagua.putong.name, "skel", function () {
                                        xixiguagua.putong.action = "play1";
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.putong, { scale: 1.2, x: [0, 0.55], y: [0, 0.485], parent: player });
                                        }, 200);
                                    });
                                }
                              //  game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage2.mp3');
                            }
                            if (trigger.nature == 'fire') {
                                if (mma == 'dao') {//火刀
                                    dcdAnim.loadSpine(xixiguagua.dao.name, "skel", function () {
                                        xixiguagua.dao.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.dao, { scale: 0.8, y: [0, 0.58], parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.huoshouji.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.huoshouji, {
                                                scale: 0.5,
                                                y: [0, 0.58],
                                                parent: player
                                            });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'jian') {//火剑
                                    dcdAnim.loadSpine(xixiguagua.jian.name, "skel", function () {
                                        xixiguagua.jian.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.jian, { scale: 0.8, parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.huoshouji.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.huoshouji, {
                                                scale: 0.5,
                                                y: [0, 0.58],
                                                parent: player
                                            });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'fuzi') {//火斧
                                    dcdAnim.loadSpine(xixiguagua.fuzi.name, "skel", function () {
                                        xixiguagua.fuzi.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.fuzi, { scale: 0.7, x: [0, 0.55], y: [0, 0.485], parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.huoshouji.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.huoshouji, {
                                                scale: 0.5,
                                                y: [0, 0.58],
                                                parent: player
                                            });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'no') {//普通火受击
                                    dcdAnim.loadSpine(xixiguagua.huo.name, "skel", function () {
                                        // xixiguagua.huo.action = "play";
                                        setTimeout(function () {
                                            dcdAnim.playSpine(xixiguagua.huo, { scale: 0.75, x: [0, 0.25], y: [0, 0.25], parent: player });
                                        }, 200);
                                    });
                                }
                              //  game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_fire2.mp3');
                            };
                            if (trigger.nature == 'thunder') {
                                if (mma == 'dao') {//雷刀
                                    dcdAnim.loadSpine(xixiguagua.dao.name, "skel", function () {
                                        xixiguagua.dao.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.dao, { scale: 0.8, y: [0, 0.58], parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.lei.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine({ name: xixiguagua.lei.name, opacity: 1.5, action: "dian" }, { scale: 0.8, parent: player });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'jian') {//雷剑
                                    dcdAnim.loadSpine(xixiguagua.jian.name, "skel", function () {
                                        xixiguagua.jian.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.jian, { scale: 0.8, parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.lei.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine({ name: xixiguagua.lei.name, opacity: 1.5, action: "dian" }, { scale: 0.8, parent: player });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'fuzi') {//雷斧
                                    dcdAnim.loadSpine(xixiguagua.fuzi.name, "skel", function () {
                                        xixiguagua.fuzi.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.fuzi, { scale: 0.7, x: [0, 0.55], y: [0, 0.485], parent: player });
                                    });
                                    dcdAnim.loadSpine(xixiguagua.lei.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine({ name: xixiguagua.lei.name, opacity: 1.5, action: "dian" }, { scale: 0.8, parent: player });
                                        }, 300);
                                    });
                                }
                                else if (mma == 'no') {//普通雷受击
                                    dcdAnim.loadSpine(xixiguagua.lei.name, "skel", function () {
                                        setTimeout(function () {
                                            dcdAnim.playSpine({ name: xixiguagua.lei.name, opacity: 1.5, action: "gonjian" }, { scale: 0.4, x: [0, 0.25], y: [0, 0.25], parent: player });
                                        }, 200);
                                    });
                                }
                               // game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_thunder2.mp3');
                            }
                        };
                    }
                }
            } else if (lib.config['extension_标记补充_daojianfu'] == "4.5") {
            
            /*lib.element.player.$damage = function (source) {
                var me = this;
                var animation = function() {
                    if (get.itemtype(source) == 'player') {
                        game.addVideo('damage', me, source.dataset.position);
                    } else {
                        game.addVideo('damage', me);
                    }
                    game.broadcast(function(player, source){
                        player.$damage(source);
                    }, me, source);
                    
                    me.queueCssAnimation('player-hurt 0.3s');
                }
                if(me.$damageDelay) {
                    setTimeout(function() {
                        animation();
                    }, 1000);
                }else {
                    animation();
                }
            };*///移到十周年UI了
            lib.skill._player_daojianfu_xxgg_fuzi_ = {
                trigger: {
                    player: 'damageBegin4'
                },
                charlotte: true,
                forced: true,
                content: function () {
                        if(!player.$damageDelay||player.$damageDelay<0) {
                            player.$damageDelay = 0;
                        }
                        player.$damageDelay += 1;
                        setTimeout(function() {
                            player.$damageDelay--;
                        },1000);
                        let pt = trigger.source;
                        let mma, mmb, mmc, mmd, mme;
                        if (pt && !pt.storage.shoujitype) {
                            pt.storage.shoujitype = ['dao', 'jian', 'fuzi'].randomGet();
                            if(/*pt == game.me && */lib.config['extension_标记补充_daojianfu_type']!="random") {
                                pt.storage.shoujitype = lib.config['extension_标记补充_daojianfu_type'];
                            }
                        }
                        if (!pt) mma = 'jian';
                        else mma = pt.storage.shoujitype;

                        if (mma == 'dao') mmb = ['play', 'play2'], mmc = ['play', 'play2'];
                        if (mma == 'fuzi') mmb = ['play3', 'play4'], mmc = ['play3', 'play4'];
                        if (mma == 'jian') mmb = ['play5', 'play6'], mmc = ['play5', 'play6'];
                        if (trigger.parent && (trigger.parent.name == 'nanman' || trigger.parent.name == 'wanjian' || trigger.parent.name == 'huogong' || trigger.parent.name == 'juedou')) {
                            dcdAnim.loadSpine(xixiguagua[trigger.parent.name].name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua[trigger.parent.name], {
                                    scale: 0.6,
                                    x: [0, 0.55],
                                    y: [0, 0.485],
                                    parent: player
                                });
                            });
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/' + trigger.parent.name + '.mp3');
                            if (trigger.num > 1) game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage2.mp3');
                        } else if (trigger.parent && trigger.parent.name == 'shandian') {
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/' + trigger.parent.name + '.mp3');
                        } // 一点伤害  
                        else if (trigger.num <= 1) {

                            if (!trigger.nature) {
                                //无属性刀
                                if (mma == 'dao') {
                                    dcdAnim.loadSpine(xixiguagua.dao.name, "skel", function () {
                                        xixiguagua.dao.action = "play";
                                        dcdAnim.playSpine(xixiguagua.dao, { scale: 0.7, y: [0, 0.55], parent: player });
                                    });
                                }
                                else if (mma == 'jian') {
                                    dcdAnim.loadSpine(xixiguagua.jian.name, "skel", function () {
                                        xixiguagua.jian.action = "play";
                                        dcdAnim.playSpine(xixiguagua.jian, { scale: 0.7, parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {
                                    dcdAnim.loadSpine(xixiguagua.fuzi.name, "skel", function () {
                                        xixiguagua.fuzi.action = "play";
                                        dcdAnim.playSpine(xixiguagua.fuzi, { scale: 0.6, x: [0, 0.55], y: [0, 0.485], parent: player });
                                    });
                                }
                             //   game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage.mp3');
                            }
                            if (trigger.nature == 'fire') {
                                if (mma == 'dao') {//火刀
                                    dcdAnim.loadSpine(xixiguagua.huodao.name, "skel", function () {
                                        xixiguagua.huodao.action = "play";
                                        dcdAnim.playSpine(xixiguagua.huodao, { scale: 0.7, parent: player });
                                    });
                                }
                                else if (mma == 'jian') {//火剑
                                    dcdAnim.loadSpine(xixiguagua.huodao.name, "skel", function () {
                                        xixiguagua.huodao.action = "play5";
                                        dcdAnim.playSpine(xixiguagua.huodao, { scale: 0.7, parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {//火斧
                                    dcdAnim.loadSpine(xixiguagua.huodao.name, "skel", function () {
                                        xixiguagua.huodao.action = "play3";
                                        dcdAnim.playSpine(xixiguagua.huodao, { scale: 0.7, parent: player });
                                    });
                                }
                                dcdAnim.loadSpine(xixiguagua.huoshouji.name, "skel", function () {
                                    setTimeout(function () {
                                        dcdAnim.playSpine(xixiguagua.huoshouji, {
                                            scale: 0.5,
                                            y: [0, 0.58],
                                            parent: player
                                        });
                                    }, 300);
                                });
                              //  game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_fire.mp3');
                            };
                            if (trigger.nature == 'thunder') {
                                if (mma == 'dao') {//雷刀
                                    dcdAnim.loadSpine(xixiguagua.leidao.name, "skel", function () {
                                        xixiguagua.leidao.action = "play";
                                        dcdAnim.playSpine(xixiguagua.leidao, { scale: 0.6, y: [0, 0.55], parent: player });
                                    });
                                }
                                else if (mma == 'jian') {//雷剑
                                    dcdAnim.loadSpine(xixiguagua.leidao.name, "skel", function () {
                                        xixiguagua.leidao.action = "play5";
                                        dcdAnim.playSpine(xixiguagua.leidao, { scale: 0.65, y: [0, 0.55], parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {//雷斧
                                    dcdAnim.loadSpine(xixiguagua.leifu.name, "skel", function () {
                                        xixiguagua.leifu.action = "play3";
                                        dcdAnim.playSpine(xixiguagua.leifu, { scale: 0.7, parent: player });
                                    });
                                }
                                dcdAnim.loadSpine(xixiguagua.leishouji.name, "skel", function () {
                                    setTimeout(function () {
                                        dcdAnim.playSpine(xixiguagua.leishouji, {
                                            scale: 0.6,
                                            y: [0, 0.58],
                                            parent: player
                                        });
                                    }, 300);
                                });
                              //  game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_thunder.mp3');
                            };
                            if (trigger.nature == 'ice') {
                                if (mma == 'dao') {//冰刀
                                    dcdAnim.loadSpine(xixiguagua.bingdao.name, "skel", function () {
                                        xixiguagua.bingdao.action = "play";
                                        dcdAnim.playSpine(xixiguagua.bingdao, { scale: 0.7, parent: player });
                                    });
                                }
                                else if (mma == 'jian') {//冰剑
                                    if(player.node.iceDamageBreak) {
                                        player.removeChild(player.node.iceDamageBreak);
                                    }
                                    var div=ui.create.div(player);
                                    div.style.zIndex=105;
                                    div.classList.add('hlss_bjbc_IceDamageBreak');
                                    player.node.iceDamageBreak=div;
                                    dcdAnim.loadSpine(xixiguagua.bingdao.name, "skel", function () {
                                        xixiguagua.bingdao.action = "play5";
                                        dcdAnim.playSpine(xixiguagua.bingdao, { scale: 0.7, parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {//冰斧
                                    dcdAnim.loadSpine(xixiguagua.bingdao.name, "skel", function () {
                                        xixiguagua.bingdao.action = "play3";
                                        dcdAnim.playSpine(xixiguagua.bingdao, { scale: 0.7, parent: player });
                                    });
                                }
                                //冰淇淋
                                if(player.node.iceDamageEffect) {
                                    player.removeChild(player.node.iceDamageEffect);
                                    player.node.iceDamageEffect=undefined;
                                }
                                //if(player.classList.contains('hlss_bjbc_IceDamagePlayerEffect')) player.classList.remove('hlss_bjbc_IceDamagePlayerEffect');
                                if(player.node.iceDamageEffect) {
                                    player.removeChild(player.node.iceDamageEffect);
                                }
                                var div=ui.create.div(player);
                                div.style.zIndex=100;
                                div.classList.add('hlss_bjbc_body');
                                var div2=ui.create.div(div);
                                div2.classList.add('hlss_bjbc_IceMagic');
                                div2.style.zIndex=1;
                                var div3=ui.create.div(div);
                                div3.classList.add('hlss_bjbc_IceDamageEffect');
                                div3.style.zIndex=5;
                                player.node.iceDamageEffect=div;
                                //player.classList.add('hlss_bjbc_IceDamagePlayerEffect');
                                /*dcdAnim.loadSpine(xixiguagua.bingshouji.name, "skel", function () {
                                    setTimeout(function () {
                                        dcdAnim.playSpine(xixiguagua.bingshouji, {
                                            scale: 0.5,
                                            y: [0, 0.58],
                                            parent: player
                                        });
                                    }, 300);
                                });*/
                              //  game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_ice.mp3');
                            };
                        }
                        // 两点伤害                   
                        else if (trigger.num > 1) {
                            /*dcdAnim.loadSpine(xixiguagua.baoji.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.baoji, {
                                    scale: 0.6,
                                    x: [0, 0.55],
                                    parent: player
                                });
                            });*/
                            if (!trigger.nature) {
                                if (mma == 'dao') {
                                    dcdAnim.loadSpine(xixiguagua.dao.name, "skel", function () {
                                        xixiguagua.dao.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.dao, { scale: 0.7, y: [0, 0.58], parent: player });
                                    });
                                }
                                else if (mma == 'jian') {
                                    dcdAnim.loadSpine(xixiguagua.jian.name, "skel", function () {
                                        xixiguagua.jian.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.jian, { scale: 0.6, parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {
                                    dcdAnim.loadSpine(xixiguagua.fuzi.name, "skel", function () {
                                        xixiguagua.fuzi.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.fuzi, { scale: 0.6, x: [0, 0.55], y: [0, 0.485], parent: player });
                                    });
                                }
                             //   game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage2.mp3');
                            }
                            if (trigger.nature == 'fire') {
                                if (mma == 'dao') {//火刀
                                    dcdAnim.loadSpine(xixiguagua.huodao.name, "skel", function () {
                                        xixiguagua.huodao.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.huodao, { scale: 0.65, parent: player });
                                    });
                                }
                                else if (mma == 'jian') {//火剑
                                    dcdAnim.loadSpine(xixiguagua.huodao.name, "skel", function () {
                                        xixiguagua.huodao.action = "play6";
                                        dcdAnim.playSpine(xixiguagua.huodao, { scale: 0.65, parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {//火斧
                                    dcdAnim.loadSpine(xixiguagua.huodao.name, "skel", function () {
                                        xixiguagua.huodao.action = "play4";
                                        dcdAnim.playSpine(xixiguagua.huodao, { scale: 0.6, parent: player });
                                    });
                                }
                                dcdAnim.loadSpine(xixiguagua.huoshouji.name, "skel", function () {
                                    setTimeout(function () {
                                        dcdAnim.playSpine(xixiguagua.huoshouji, {
                                            scale: 0.5,
                                            y: [0, 0.58],
                                            parent: player
                                        });
                                    }, 300);
                                });
                             //   game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_fire2.mp3');
                            };
                            if (trigger.nature == 'thunder') {
                                if (mma == 'dao') {//雷刀
                                    dcdAnim.loadSpine(xixiguagua.leidao.name, "skel", function () {
                                        xixiguagua.leidao.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.leidao, { scale: 0.6, y: [0, 0.55], parent: player });
                                    });
                                }
                                else if (mma == 'jian') {//雷剑
                                    dcdAnim.loadSpine(xixiguagua.leidao.name, "skel", function () {
                                        xixiguagua.leidao.action = "play6";
                                        dcdAnim.playSpine(xixiguagua.leidao, { scale: 0.65, y: [0, 0.55], parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {//雷斧
                                    dcdAnim.loadSpine(xixiguagua.leifu.name, "skel", function () {
                                        xixiguagua.leifu.action = "play4";
                                        dcdAnim.playSpine(xixiguagua.leifu, { scale: 0.6, parent: player });
                                    });
                                }
                                dcdAnim.loadSpine(xixiguagua.leishouji.name, "skel", function () {
                                    setTimeout(function () {
                                        dcdAnim.playSpine(xixiguagua.leishouji, {
                                            scale: 0.6,
                                            y: [0, 0.55],
                                            parent: player
                                        });
                                    }, 300);
                                });
                             //   game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_thunder2.mp3');
                            }
                            if (trigger.nature == 'ice') {
                                if (mma == 'dao') {//冰刀
                                    dcdAnim.loadSpine(xixiguagua.bingdao.name, "skel", function () {
                                        xixiguagua.bingdao.action = "play2";
                                        dcdAnim.playSpine(xixiguagua.bingdao, { scale: 0.65, parent: player });
                                    });
                                }
                                else if (mma == 'jian') {//冰剑
                                    if(player.node.iceDamageBreak) {
                                        player.removeChild(player.node.iceDamageBreak);
                                    }
                                    var div=ui.create.div(player);
                                    div.style.zIndex=105;
                                    div.classList.add('hlss_bjbc_IceDamageBreak');
                                    player.node.iceDamageBreak=div;
                                    dcdAnim.loadSpine(xixiguagua.bingdao.name, "skel", function () {
                                        xixiguagua.bingdao.action = "play6";
                                        dcdAnim.playSpine(xixiguagua.bingdao, { scale: 0.65, parent: player });
                                    });
                                }
                                else if (mma == 'fuzi') {//冰斧
                                    dcdAnim.loadSpine(xixiguagua.bingdao.name, "skel", function () {
                                        xixiguagua.bingdao.action = "play4";
                                        dcdAnim.playSpine(xixiguagua.bingdao, { scale: 0.6, parent: player });
                                    });
                                }
                                //冰淇淋
                                if(player.node.iceDamageEffect) {
                                    player.removeChild(player.node.iceDamageEffect);
                                    player.node.iceDamageEffect=undefined;
                                }
                                //if(player.classList.contains('hlss_bjbc_IceDamagePlayerEffect')) player.classList.remove('hlss_bjbc_IceDamagePlayerEffect');
                                if(player.node.iceDamageEffect) {
                                    player.removeChild(player.node.iceDamageEffect);
                                }
                                var div=ui.create.div(player);
                                div.style.zIndex=100;
                                div.classList.add('hlss_bjbc_body');
                                var div2=ui.create.div(div);
                                div2.classList.add('hlss_bjbc_IceMagic');
                                div2.style.zIndex=1;
                                var div3=ui.create.div(div);
                                div3.classList.add('hlss_bjbc_IceDamageEffect2');
                                div3.style.zIndex=5;
                                player.node.iceDamageEffect=div;
                                /*dcdAnim.loadSpine(xixiguagua.bingshouji.name, "skel", function () {
                                    setTimeout(function () {
                                        dcdAnim.playSpine(xixiguagua.bingshouji, {
                                            scale: 0.5,
                                            y: [0, 0.58],
                                            parent: player
                                        });
                                    }, 300);
                                });*/
                             //   game.playAudio('../extension/手杀标准UI/original/标记补充/audio/damage_ice2.mp3');
                            }
                        };
                        if(trigger.num>1) {
                            if(player.node.doubleDamageEffect) {
                                player.removeChild(player.node.doubleDamageEffect);
                                player.node.doubleDamageEffect=undefined;
                            }
                            var div=ui.create.div(player);
                                div.style.zIndex=99;
                                div.classList.add('hlss_bjbc_baoji');
                            player.node.doubleDamageEffect=div;
                        }
                        /*if(lib.config['extension_标记补充_huajiatexiao']) {
                            // 护甲音效        
                            if(player.hujia > 0&&trigger.num==1&&!trigger.nature){
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_normal.mp3');}
                            if(player.hujia > 0&&trigger.num>1&&!trigger.nature){
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_normal2.mp3');}      
                            if(player.hujia > 0&&trigger.num==1&&trigger.nature == 'fire'){
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_huo.mp3');}      
                            if(player.hujia > 0&&trigger.num>1&&trigger.nature == 'fire'){
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_huo2.mp3');}
                            if(player.hujia > 0&&trigger.num==1&&trigger.nature == 'thunder'){
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_lei.mp3');}            
                            if(player.hujia > 0&&trigger.num>1&&trigger.nature == 'thunder'){
                            game.playAudio('../extension/手杀标准UI/original/标记补充/audio/raw_hit_shield_lei2.mp3');}
                        }*/
                    },
                }
            } else {}
            //==========随机刀剑斧==========//
            //游戏结算
            lib.onover.push(function (bool) {
                if (config.youxishengfu == 'identity') {
                    if (bool === true) {
                        if (game.me.identity == 'fan' && lib.config.mode == 'identity') {
         dcdAnim.loadSpine(xixiguagua.SF_jiesuan_eff_fanzeishengli.name, "skel", function () {
         dcdAnim.playSpine(xixiguagua.SF_jiesuan_eff_fanzeishengli, { scale: 1 });
                            });
                        } else if (game.me.identity == 'nei' && lib.config.mode == 'identity') {
                            dcdAnim.loadSpine(xixiguagua.SF_jiesuan_eff_neijianshengli.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.SF_jiesuan_eff_neijianshengli, { scale: 1 });
                            });
                        } else if (game.me.identity == 'zhong' && lib.config.mode == 'identity') {                       
                            dcdAnim.loadSpine(xixiguagua.SF_jiesuan_eff_zczgshengli.name, "skel", function () {
                                xixiguagua.SF_jiesuan_eff_zczgshengli.action = "play";
                                dcdAnim.playSpine(xixiguagua.SF_jiesuan_eff_zczgshengli, { scale: 1 });
                            });
                        } else if (game.me.identity == 'zhu' && lib.config.mode == 'identity') {
                            dcdAnim.loadSpine(xixiguagua.SF_jiesuan_eff_zczgshengli.name, "skel", function () {
                                xixiguagua.SF_jiesuan_eff_zczgshengli.action = "play3";
                                dcdAnim.playSpine(xixiguagua.SF_jiesuan_eff_zczgshengli, { scale: 1 });
                            });
                        }
                        else if (lib.config.mode != 'identity') {
                            dcdAnim.loadSpine(xixiguagua.Xshengli.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.Xshengli, { scale: 1 });
                            });
                        }
                    }
                    else if (bool === false) {
                        dcdAnim.loadSpine(xixiguagua.Xnoshengli.name, "skel", function () {
                            xixiguagua.Xnoshengli.action = "play";
                            dcdAnim.playSpine(xixiguagua.Xnoshengli, { scale: 1 });
                        });
                    } else {
                        dcdAnim.loadSpine(xixiguagua.Xnoshengli.name, "skel", function () {
                            xixiguagua.Xnoshengli.action = "play3";
                            dcdAnim.playSpine(xixiguagua.Xnoshengli, { scale: 1 });
                        });
                    }
                }  
                if (config.youxishengfu == 'mobileMode') {
                    if (bool == true) {                        
                        dcdAnim.loadSpine(xixiguagua.XXshengli.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.XXshengli, { scale: 1, x: [0, 0.52], y: [0, 0.3], });
                        });
                    }
                    else if (bool == false) {
                        dcdAnim.loadSpine(xixiguagua.XXshibai.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.XXshibai, { scale: 1.5, speed: 0.4});
                        });
                    }
                    else {
                        dcdAnim.loadSpine(xixiguagua.XXpingju.name, "skel", function () {
                            dcdAnim.playSpine(xixiguagua.XXpingju, {scale: 1, speed: 0.4 });
                        });
                    }
                }
            });

            if (config.xinshadoudizhu) {
                //兵临城下斗地主修改
                if (lib.config.mode == 'doudizhu') {
                    if (get.config('doudizhu_mode') == 'binglin') {
                        ui.background.style.setProperty("z-index", "6");
                    }
                }
                lib.skill._binglintu = {
                    forced: true,
                    trigger: {
                        global: ["gameStart", "roundStart"],
                        player: 'enterGame',
                    },
                    content: function () {
                        if (lib.config.mode == 'doudizhu') {
                            if (get.config('doudizhu_mode') == 'binglin') {
                                if (event.triggername == 'gameStart') {
                                    ui.background.style.setProperty("z-index", "-1");
                                }
                                if (event.triggername == 'gameStart') {

                                    if (game.zhuSkill == 'zhuSkill_jiangling') {
                                        var skill = document.createElement('img');
                                        skill.setAttribute("id", "hh");
                                        skill.src = lib.assetURL + "extension/手杀标准UI/original/标记补充/image/binglin_jiangling.png";
                                        skill.style.cssText =
                                            "--w: 200px;--h: 80px;width: var(--w);height: var(--h);position: absolute;top: 0px;left:780px;z-index:1"
                                        document.body.appendChild(skill);
                                        //var div1 = document.getElementsByTagName("div");
                                        //div1[0].appendChild(skill);
                                    }
                                    else if (game.zhuSkill == 'zhuSkill_xiangyang') {
                                        var skill = document.createElement('img');
                                        skill.setAttribute("id", "hh");
                                        skill.src = lib.assetURL + "extension/手杀标准UI/original/标记补充/image/binglin_xiangyang.png";
                                        skill.style.cssText =
                                            "--w: 200px;--h: 80px;width: var(--w);height: var(--h);position: absolute;top: 0px;left:780px;z-index:1"
                                        document.body.appendChild(skill);
                                        //var div1 = document.getElementsByTagName("div");
                                        //div1[0].appendChild(skill);
                                    }
                                    else if (game.zhuSkill == 'zhuSkill_fancheng') {
                                        var skill = document.createElement('img');
                                        skill.src = lib.assetURL + "extension/手杀标准UI/original/标记补充/image/binglin_fancheng.png";
                                        skill.setAttribute("id", "hh");
                                        skill.style.cssText =
                                            "--w: 200px;--h: 80px;width: var(--w);height: var(--h);position: absolute;top: 0px;left:780px;z-index:1"//pointer-events:none;display: block; 
                                        document.body.appendChild(skill);
                                        //var div1 = document.getElementsByTagName("div");
                                        //div1[0].appendChild(skill);
                                    }
                                }
                                if (game.roundNumber == 3) {
                                    var img = document.getElementById("hh");
                                    img.parentNode.removeChild(img);//通过父节点删除子节点
                                }
                                if (game.roundNumber == 3) {
                                    var jianxi = document.createElement('img');
                                    jianxi.src = lib.assetURL + "extension/手杀标准UI/original/标记补充/image/binglin_jianxi.png";
                                    jianxi.style.cssText =
                                        "--w: 200px;--h: 80px;width: var(--w);height: var(--h);position: absolute;top: 0px;left:780px;z-index:1";
                                    document.body.appendChild(jianxi);
                                }
                            }
                        }
                    },
                }
                if (lib.config.mode == 'doudizhu') {
                    if (get.config('doudizhu_mode') == 'binglin') {
                        var cb = ui.create.node('img');
                        cb.setAttribute("id", "gg");
                        cb.src = lib.assetURL + 'extension/手杀标准UI/original/标记补充/image/出兵50.png';
                        cb.style.cssText = "--w: 80px;--h: 40px;width: var(--w);height: var(--h);position: absolute;top: 60px;left:120px;z-index:1";
                        document.body.appendChild(cb);
                    }
                }
                lib.skill._dysp = {
                    trigger: {
                        global: 'gameStart',
                    },
                    forced: true,
                    direct: true,
                    content: function () {
                        if (lib.config.mode == 'doudizhu') {
                            if (get.config('doudizhu_mode') == 'binglin') {
                                /*var num = ['1', '2', '3'];*/
                                if (game.me.identity != 'zhu') {
                                    var sp = document.createElement('img');
                                    sp.src = lib.assetURL + 'extension/手杀标准UI/original/标记补充/image/duiyoushoupai.png';
                                    sp.style.cssText = "--w: 60px;--h: 40px;width: var(--w);height: var(--h);position: absolute;top: 20px;left:120px;z-index:1";
                                    document.body.appendChild(sp);
                                }
                            }
                        }
                    }
                }
                lib.game.chooseCharacterBinglin = function () {
                    var next = game.createEvent('chooseCharacter', false);
                    next.setContent(function () {
                        "step 0"
                        game.no_continue_game = true;
                        lib.init.onfree();
                        "step 1"
                        ui.arena.classList.add('choose-character');
                        game.zhuSkill = 'zhuSkill_' + ['xiangyang', 'jiangling', 'fancheng'].randomGet();
                        var i;
                        event.list = [];
                        event.map = {};
                        for (i in lib.character) {
                            if (lib.filter.characterDisabled(i)) continue;
                            event.list.push(i);
                        }
                        event.list.randomSort();
                        _status.characterlist = event.list.slice(0);
                        for (var player of game.players) {
                            event.map[player.playerid] = event.list.randomRemove(4);
                        }
                        event.controls = ['放弃出兵', '出兵50', '出兵100', '出兵150'];
                        event.dialog = ui.create.dialog('本局城池：' + get.translation(game.zhuSkill), [event.map[game.me.playerid], 'character']);
                        event.start = game.players.randomGet();
                        event.current = event.start;
                        game.delay(8);
                        "step 2"
                        event.current.classList.add('glow_phase');
                        if (event.current == game.me) event.dialog.content.firstChild.innerHTML = '是否出兵？';
                        else {
                            event.dialog.content.firstChild.innerHTML = '请等待其他玩家出兵';
                            game.delay(2);
                        }
                        event.current.chooseControl(event.controls).set('ai', function () {
                            return _status.event.getParent().controls.randomGet();
                        });
                        "step 3"
                        event.current.classList.remove('glow_phase');
                        event.current._control = result.control;
                        event.current.chat(result.control);
                        if (result.control == '出兵150') {
                            game.bonusNum = 3;
                            if (document.getElementById("gg")) {
                                var img1 = document.getElementById("gg");
                                img1.parentNode.removeChild(img1);
                            }
                            var cb = ui.create.node('img');
                            cb.src = lib.assetURL + 'extension/手杀标准UI/original/标记补充/image/出兵150.png';
                            cb.style.cssText = "--w: 80px;--h: 40px;width: var(--w);height: var(--h);position: absolute;top: 60px;left:120px;z-index:1";
                            document.body.appendChild(cb);
                            game.zhu = event.current;
                            return;
                        }
                        else if (result.control != '放弃出兵') {
                            event.controls.splice(1, event.controls.indexOf(result.control));
                            /*event.controls.unshift('放弃出兵');*/
                            event.tempDizhu = event.current;
                            if (result.control == '出兵100') {
                                game.bonusNum = 2;

                                if (document.getElementById("gg")) {
                                    var img2 = document.getElementById("gg");
                                    img2.parentNode.removeChild(img2);
                                }
                                var cb = ui.create.node('img');
                                cb.src = lib.assetURL + 'extension/手杀标准UI/original/标记补充/image/出兵100.png';
                                cb.style.cssText = "--w: 80px;--h: 40px;width: var(--w);height: var(--h);position: absolute;top: 60px;left:120px;z-index:1";
                                document.body.appendChild(cb);
                            }
                        }
                        event.current = event.current.next;
                        if (event.current == event.start) {
                            game.zhu = event.tempDizhu || event.start.previous;
                        }
                        else event.goto(2);
                        if (event.current == event.start.previous && !event.tempDizhu) event.controls.remove('放弃出兵');
                        "step 4"
                        for (var player of game.players) {
                            player.identity = player == game.zhu ? 'zhu' : 'fan';
                            player.showIdentity();
                        }

                        /**/
                        var shang = game.me.getNext();
                        var xia = game.me.getPrevious();
                        if (lib.config.mode != 'doudizhu') return;
                        if (xia.identity == 'zhu') {
                            xia.style.right = '45%';
                            xia.style.left = 'auto';
                            xia.style.top = 'auto';
                            shang.style.left = 'auto';
                            shang.style.top = 'calc(50% - 140px)';
                            shang.style.right = '2.5%';
                        }
                        else if (shang.identity == 'zhu') {
                            shang.style.left = '45%';
                            shang.style.right = 'auto';
                            shang.style.top = 'auto';
                            xia.style.left = '0';
                            xia.style.top = 'calc(50% - 140px)';
                            xia.style.right = 'auto';
                        }
                        else if (game.me.identity == 'zhu') {
                            shang.style.left = 'auto';
                            shang.style.top = 'calc(50% - 140px)';
                            shang.style.right = '2.5%';
                            xia.style.left = '0';
                            xia.style.top = 'calc(50% - 140px)';
                            xia.style.right = 'auto';
                        }
                        /* */
                        event.dialog.close();
                        event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
                        "step 5"
                        var list = ['请选择你的武将', [event.map[game.me.playerid], 'character']];
                        if (game.me.identity == 'fan') {
                            var friend = game.findPlayer(function (current) {
                                return current != game.me && current.identity == 'fan';
                            });
                            list.push('<div class="text center">队友的选将框</div>');
                            list.push([event.map[friend.playerid], 'character']);
                        }
                        game.me.chooseButton(list, true).set('list', event.map[game.me.playerid]).set('filterButton', function (button) {
                            return _status.event.list.contains(button.link);
                        });
                        "step 6"
                        game.me.init(result.links[0]);
                        for (var player of game.players) {
                            if (player != game.me) player.init(event.map[player.playerid].randomGet());
                            if (player == game.zhu) {
                                player.addSkill(game.zhuSkill);
                                //decadeUI.animation.playSpine({ name: 'chenzhu', speed: 1, loop: true, }, { scale: 0.5, parent: player });
                                dcdAnim.loadSpine(xixiguagua.chenzhu.name, "skel", function () {
                                    dcdAnim.playSpine(xixiguagua.chenzhu, { speed: 1, scale: 0.5, parent: player });
                                });
                            }
                            else player.addSkill('binglin_neihong');
                        }
                        game.zhu.hp++;
                        game.zhu.maxHp++;
                        game.zhu.update();
                        for (var i = 0; i < game.players.length; i++) {
                            _status.characterlist.remove(game.players[i].name1);
                            _status.characterlist.remove(game.players[i].name2);
                        }
                        setTimeout(function () {
                            ui.arena.classList.remove('choose-character');
                        }, 500);
                    });
                }
            };
            //标记部分
            if (config.biaojixiugai) {
                lib.arenaReady.push(function () {
                    //狼袭特效
                    lib.skill.xinfu_langxi = {
                        audio: 2,
                        trigger: {
                            player: "phaseZhunbeiBegin",
                        },
                        direct: true,
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return current != player && current.hp <= player.hp;
                            });
                        },
                        content: function () {
                            "step 0"
                            player.chooseTarget(get.prompt('xinfu_langxi'), '对一名体力值不大于你的其他角色造成0-2点随机伤害', function (card, player, target) {
                                return target.hp <= player.hp && target != player;
                            }).set('ai', function (target) {
                                var player = _status.event.player;
                                return get.damageEffect(target, player, player);
                            });
                            "step 1"
                            if (result.bool && result.targets && result.targets.length) {
                                player.logSkill('xinfu_langxi', result.targets);
                                var num = [1, 2, 0].randomGet();
                                if (get.isLuckyStar(player)) num = 2;
                                player.line(result.targets[0], 'green');
                                result.targets[0].damage(num);
                                if (num == 0) {
                                    //  图片效果未命中
                                    //    ui.create.div('.weimingzhong',result.targets[0]);
                                    //    骨骼效果未命中
                                    //decadeUI.animation.playSpine({ name: 'weimingzhong', speed: 1 }, { scale: 0.8, parent: result.targets[0] });
                                    dcdAnim.loadSpine(xixiguagua.weimingzhong.name, "skel", function () {
                                        dcdAnim.playSpine(xixiguagua.weimingzhong, { scale: 0.8, speed: 1,parent: result.targets[0] });
                                    });
                                }
                            }
                        },
                        ai: {
                            expose: 0.25,
                            threaten: 1.7,
                        },
                    }
                    //破围特效
                    lib.skill.tspowei = {
                        audio: 3,
                        dutySkill: true,
                        forced: true,
                        trigger: {
                            global: "damageEnd",
                        },
                        logTarget: "player",
                        filter: function (event, player) {
                            return event.player && event.player.isIn() && event.player.hasMark('dulie');
                        },
                        content: function () {
                            trigger.player.removeMark('dulie', trigger.player.countMark('dulie'));
                        },
                        derivation: "shenzhu",
                        group: ["tspowei_init", "tspowei_move", "tspowei_achieve", "tspowei_fail", "tspowei_use"],
                        subSkill: {
                            use: {
                                audio: "tspowei",
                                trigger: {
                                    global: "phaseBegin",
                                },
                                direct: true,
                                filter: function (event, player) {
                                    return event.player != player && event.player.hasMark('dulie') &&
                                        (player.countCards('h') > 0 || player.hp >= event.player.hp && event.player.countCards('h') > 0);
                                },
                                content: function () {
                                    'step 0'
                                    var list = [], target = trigger.player, choiceList = [
                                        '弃置一张牌并对其造成1点伤害',
                                        '获得其一张手牌',
                                    ];
                                    event.target = target;
                                    if (player.hasCard(function (card) {
                                        return lib.filter.cardDiscardable(card, player, 'tspowei_use');
                                    }, 'h')) list.push('选项一');
                                    else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + '</span>';
                                    if (player.hp >= target.hp && target.countCards('h') > 0) list.push('选项二');
                                    else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + '</span>';
                                    player.chooseControl(list, 'cancel2').set('prompt', get.prompt('tspowei', target)).set('choiceList', choiceList).set('ai', function () {
                                        var evt = _status.event.getParent();
                                        if (evt.player.hasCard(function (card) {
                                            return lib.filter.cardDiscardable(card, evt.player, 'tspowei_use') && get.value(card, evt.player) < 7;
                                        }, 'h') && get.damageEffect(evt.target, evt.player, evt.player) > 0) return '选项一';
                                        if (evt.player.hp >= evt.target.hp && evt.target.countCards('h') > 0 && get.attitude(evt.player, evt.target) <= 0 && !evt.target.hasSkillTag('noh')) return '选项二';
                                        return 'cancel2';
                                    });
                                    'step 1'
                                    if (result.control != 'cancel2') {
                                        if (result.control == '选项二') {
                                            player.logSkill('tspowei', target);
                                            player.gainPlayerCard(target, 'h', true);
                                            event.goto(3);
                                        }
                                    }
                                    else event.finish();
                                    'step 2'
                                    player.chooseToDiscard('h', true).logSkill = ['tspowei_use', target];
                                    target.damage();
                                    'step 3'
                                    player.addTempSkill('tspowei_inRange');
                                },
                                ai: {
                                    expose: 0.2,
                                },
                                sub: true,
                            },
                            inRange: {
                                charlotte: true,
                                mod: {
                                    inRangeOf: function (from, to) {
                                        if (from == _status.currentPhase) return true;
                                    },
                                },
                                sub: true,
                            },
                            init: {
                                audio: "tspowei",
                                trigger: {
                                    global: "phaseBefore",
                                    player: "enterGame",
                                },
                                forced: true,
                                filter: function (event, player) {
                                    return event.name != 'phase' || game.phaseNumber == 0;
                                },
                                logTarget: function (event, player) {
                                    return game.filterPlayer((current) => current != player && !current.hasMark('dulie'));
                                },
                                content: function () {
                                    var list = game.filterPlayer((current) => current != player && !current.hasMark('dulie')).sortBySeat();
                                    for (var i of list) i.addMark('dulie', 1, false);
                                },
                                sub: true,
                            },
                            move: {
                                audio: "tspowei",
                                trigger: {
                                    player: "phaseBegin",
                                },
                                forced: true,
                                filter: function (event, player) {
                                    return game.hasPlayer((current) => current != player && current.hasMark('dulie'));
                                },
                                content: function () {
                                    var list = game.filterPlayer((current) => current != player && current.hasMark('dulie')).sortBySeat();
                                    var map = {};
                                    for (var i of list) {
                                        var num = i.countMark('dulie');
                                        i.removeMark('dulie', num);
                                        map[i.playerid] = num;
                                    }
                                    for (var i of list) {
                                        var next = i.next;
                                        if (next == player) next = next.next;
                                        next.addMark('dulie', map[i.playerid]);
                                    }
                                },
                                sub: true,
                            },
                            achieve: {
                                audio: "tspowei1",
                                trigger: {
                                    player: "phaseBegin",
                                },
                                forced: true,
                                skillAnimation: true,
                                animationColor: "metal",
                                filter: function (event, player) {
                                    return !game.hasPlayer(function (current) {
                                        return current.hasMark('dulie');
                                    });
                                },
                                content: function () {
                                    game.log(player, '成功完成使命');
                                    player.awakenSkill('tspowei');
                                    player.shixiaoSkill('tspowei');
                                    player.addSkillLog('shenzhu');
                                },
                                sub: true,
                            },
                            fail: {
                                audio: "tspowei2",
                                trigger: {
                                    player: "dying",
                                },
                                forced: true,
                                content: function () {
                                    'step 0'
                                    game.log(player, '使命失败');
                                    //decadeUI.animation.playSpine({ name: 'shimingjishibai', speed: 1, }, { scale: 0.8, x: [0, 0.55], parent: player });
                                    dcdAnim.loadSpine(xixiguagua.shimingjishibai.name, "skel", function () {
                                        dcdAnim.playSpine(xixiguagua.shimingjishibai, { scale: 0.8, speed: 1, x: [0, 0.55], parent: player });
                                    });
                                    player.awakenSkill('tspowei');
                                    player.failSkill('tspowei');
                                    player.shixiaoSkill('tspowei');
                                    if (player.hp < 1) player.recover(1 - player.hp);
                                    'step 1'
                                    var num = player.countCards('e');
                                    if (num > 0) player.chooseToDiscard('e', true, num);
                                },
                                sub: true,
                            },
                        },
                    }
                    //清玉特效   
                    lib.skill.qingyu = {
                        audio: 2,
                        dutySkill: true,
                        trigger: {
                            player: "damageBegin2",
                        },
                        forced: true,
                        filter: function (event, player) {
                            return player.countCards('he', function (card) {
                                return lib.filter.cardDiscardable(card, player, 'qingyu');
                            }) > 1;
                        },
                        content: function () {
                            trigger.cancel();
                            player.chooseToDiscard(2, 'he', true);
                        },
                        group: ["qingyu_achieve", "qingyu_fail"],
                        subSkill: {
                            achieve: {
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                forced: true,
                                skillAnimation: true,
                                animationColor: "fire",
                                filter: function (event, player) {
                                    return player.isHealthy() && player.countCards('h') == 0;
                                },
                                content: function () {
                                    game.log(player, '成功完成使命');
                                    player.awakenSkill('qingyu');
                                    player.shixiaoSkill('qingyu');
                                    player.addSkillLog('xuancun');
                                },
                                sub: true,
                            },
                            fail: {
                                trigger: {
                                    player: "dying",
                                },
                                forced: true,
                                content: function () {
                                    game.log(player, '使命失败');
                                    //decadeUI.animation.playSpine({ name: 'qingyushibai', speed: 1, }, { scale: 0.8, x: [0, 0.55], parent: player });
                                    dcdAnim.loadSpine(xixiguagua.qingyushibai.name, "skel", function () {
                                        dcdAnim.playSpine(xixiguagua.qingyushibai, { scale: 0.8, speed: 1, x: [0, 0.55], parent: player });
                                    });
                                    player.awakenSkill('qingyu');
                                    player.failSkill('qingyu');
                                    player.shixiaoSkill('qingyu');
                                    player.loseMaxHp();
                                },
                                sub: true,
                            },
                        },
                        derivation: "xuancun",
                    }
                    //秘备特效
                    lib.skill.mibei = {
                        audio: 2,
                        trigger: {
                            player: "useCardAfter",
                        },
                        dutySkill: true,
                        forced: true,
                        skillAnimation: true,
                        animationColor: "water",
                        filter: function (event, player) {
                            if (!player.storage.xingqi || !player.storage.xingqi.length) return false;
                            var map = { basic: 0, trick: 0, equip: 0 };
                            for (var i of player.storage.xingqi) {
                                var type = get.type(i);
                                if (typeof map[type] == 'number') map[type]++;
                            }
                            for (var i in map) {
                                if (map[i] < 2) return false;
                            }
                            return true;
                        },
                        content: function () {
                            'step 0'
                            game.log(player, '成功完成使命');
                            player.awakenSkill('mibei');
                            player.shixiaoSkill("mibei");
                            var list = ['basic', 'equip', 'trick'], cards = [];
                            for (var i of list) {
                                var card = get.cardPile2(function (card) {
                                    return get.type(card) == i;
                                });
                                if (card) cards.push(card);
                            }
                            if (cards.length) player.gain(cards, 'gain2');
                            'step 1'
                            player.addSkill('xinmouli');
                        },
                        group: ["mibei_fail", "mibei_silent"],
                        derivation: "xinmouli",
                        subSkill: {
                            silent: {
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                silent: true,
                                lastDo: true,
                                filter: function (event, player) {
                                    return !player.getStorage('xingqi').length;
                                },
                                content: function () {
                                    player.addTempSkill('mibei_mark');
                                },
                                charlotte: true,
                                sub: true,
                                forced: true,
                                popup: false,
                            },
                            mark: {
                                sub: true,
                            },
                            fail: {
                                trigger: {
                                    player: "phaseJieshuBegin",
                                },
                                forced: true,
                                filter: function (event, player) {
                                    return !player.getStorage('xingqi').length && player.hasSkill('mibei_mark');
                                },
                                content: function () {
                                    game.log(player, '使命失败');
                                    /*decadeUI.animation.playSpine({ name: 'mibeishibai', speed: 1, }, { scale: 0.8, x: [0, 0.55], parent: player });*/
                                    dcdAnim.loadSpine(xixiguagua.mibeishibai.name, "skel", function () {
                                        dcdAnim.playSpine(xixiguagua.mibeishibai, { scale: 0.8, speed: 1, x: [0, 0.55], parent: player });
                                    });
                                    player.shixiaoSkill("mibei");
                                    player.awakenSkill('mibei');
                                    player.failSkill('mibei');
                                    player.loseMaxHp();
                                },
                                sub: true,
                            },
                        },
                    }
                    //国战篇
                    lib.skill.fz_new_rewusheng = {
                        audio: true,
                        inherit: "new_rewusheng",
                        mark: true,
                        marktext: "眩惑 关羽武圣",
                        intro: { name: '眩惑', content: 'info', },
                        mod: {
                            targetInRange: function (card) {
                                if (get.suit(card) == 'diamond' && card.name == 'sha') return true;
                            },
                        },
                        locked: false,
                        audioname: ["re_guanyu", "guanzhang", "jsp_guanyu", "guansuo"],
                        enable: ["chooseToRespond", "chooseToUse"],
                        filterCard: function (card, player) {
                            if (get.zhu(player, 'shouyue')) return true;
                            return get.color(card) == 'red';
                        },
                        position: "hes",
                        viewAs: {
                            name: "sha",
                        },
                        viewAsFilter: function (player) {
                            if (get.zhu(player, 'shouyue')) {
                                if (!player.countCards('hes')) return false;
                            }
                            else {
                                if (!player.countCards('hes', { color: 'red' })) return false;
                            }
                        },
                        prompt: "将一张红色牌当杀使用或打出",
                        check: function (card) {
                            var val = get.value(card);
                            if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
                            return 5 - val;
                        },
                        ai: {
                            respondSha: true,
                            skillTagFilter: function (player) {
                                if (get.zhu(player, 'shouyue')) {
                                    if (!player.countCards('hes')) return false;
                                }
                                else {
                                    if (!player.countCards('hes', { color: 'red' })) return false;
                                }
                            },
                            yingbian: function (card, player, targets, viewer) {
                                if (get.attitude(viewer, player) <= 0) return 0;
                                var base = 0, hit = false;
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
                                                }
                                                else {
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
                    }
                    lib.skill.fz_gzpaoxiao = {
                        audio: true,
                        inherit: "gzpaoxiao",
                        mark: true,
                        marktext: "眩惑 张飞咆哮",
                        intro: { name: '眩惑', content: 'info', },
                        trigger: {
                            player: "useCard",
                        },
                        filter: function (event, player) {
                            if (_status.currentPhase != player) return false;
                            if (event.card.name != 'sha') return false;
                            var history = player.getHistory('useCard', function (evt) {
                                return evt.card.name == 'sha';
                            });
                            return history && history.indexOf(event) == 1;
                        },
                        forced: true,
                        preHidden: true,
                        content: function () {
                            player.draw();
                        },
                        mod: {
                            cardUsable: function (card, player, num) {
                                if (card.name == 'sha') return Infinity;
                            },
                        },
                        ai: {
                            unequip: true,
                            skillTagFilter: function (player, tag, arg) {
                                if (!get.zhu(player, 'shouyue')) return false;
                                if (arg && arg.name == 'sha') return true;
                                return false;
                            },
                        },
                    }
                    lib.skill.fz_new_longdan = {
                        audio: true,
                        mark: true,
                        marktext: "眩惑 赵云龙胆",
                        intro: { name: '眩惑', content: 'info', },
                        group: ["fz_new_longdan_sha", "fz_new_longdan_shan", "fz_new_longdan_draw", "fz_new_longdan_shamiss", "fz_new_longdan_shanafter"],
                        subSkill: {
                            shanafter: {
                                sub: true,
                                audio: "fz_new_longdan",
                                trigger: {
                                    player: "useCard",
                                },
                                filter: function (event, player) {
                                    return event.skill == 'fz_new_longdan_shan' && event.getParent(2).name == 'sha';
                                },
                                direct: true,
                                content: function () {
                                    "step 0"
                                    player.chooseTarget("是否发动【龙胆】令一名其他角色回复1点体力？", function (card, player, target) {
                                        return target != _status.event.source && target != player && target.isDamaged();
                                    }).set('ai', function (target) {
                                        return get.attitude(_status.event.player, target);
                                    }).set('source', trigger.getParent(2).player);
                                    "step 1"
                                    if (result.bool && result.targets && result.targets.length) {
                                        player.logSkill('fz_new_longdan', result.targets[0]);
                                        result.targets[0].recover();
                                    }
                                },
                            },
                            shamiss: {
                                sub: true,
                                audio: "fz_new_longdan",
                                trigger: {
                                    player: "shaMiss",
                                },
                                direct: true,
                                filter: function (event, player) {
                                    return event.skill == 'fz_new_longdan_sha';
                                },
                                content: function () {
                                    "step 0"
                                    player.chooseTarget("是否发动【龙胆】对一名其他角色造成1点伤害？", function (card, player, target) {
                                        return target != _status.event.target && target != player;
                                    }).set('ai', function (target) {
                                        return -get.attitude(_status.event.player, target);
                                    }).set('target', trigger.target);
                                    "step 1"
                                    if (result.bool && result.targets && result.targets.length) {
                                        player.logSkill('fz_new_longdan', result.targets[0]);
                                        result.targets[0].damage();
                                    }
                                },
                            },
                            draw: {
                                trigger: {
                                    player: ["useCard", "respond"],
                                },
                                audio: "fz_new_longdan",
                                forced: true,
                                locked: false,
                                filter: function (event, player) {
                                    if (!get.zhu(player, 'shouyue')) return false;
                                    return event.skill == 'fz_new_longdan_sha' || event.skill == 'fz_new_longdan_shan';
                                },
                                content: function () {
                                    player.draw();
                                    //player.storage.fanghun2++;
                                },
                                sub: true,
                            },
                            sha: {
                                audio: "fz_new_longdan",
                                enable: ["chooseToUse", "chooseToRespond"],
                                filterCard: {
                                    name: "shan",
                                },
                                viewAs: {
                                    name: "sha",
                                },
                                viewAsFilter: function (player) {
                                    if (!player.countCards('hs', 'shan')) return false;
                                },
                                prompt: "将一张闪当杀使用或打出",
                                position: "hs",
                                check: function () { return 1 },
                                ai: {
                                    effect: {
                                        target: function (card, player, target, current) {
                                            if (get.tag(card, 'respondSha') && current < 0) return 0.6
                                        },
                                    },
                                    respondSha: true,
                                    skillTagFilter: function (player) {
                                        if (!player.countCards('hs', 'shan')) return false;
                                    },
                                    order: function () {
                                        return get.order({ name: 'sha' }) + 0.1;
                                    },
                                    yingbian: function (card, player, targets, viewer) {
                                        if (get.attitude(viewer, player) <= 0) return 0;
                                        var base = 0, hit = false;
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
                                                        }
                                                        else {
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
                                sub: true,
                            },
                            shan: {
                                audio: "fz_new_longdan",
                                enable: ["chooseToRespond", "chooseToUse"],
                                filterCard: {
                                    name: "sha",
                                },
                                viewAs: {
                                    name: "shan",
                                },
                                position: "hs",
                                prompt: "将一张杀当闪使用或打出",
                                check: function () { return 1 },
                                viewAsFilter: function (player) {
                                    if (!player.countCards('hs', 'sha')) return false;
                                },
                                ai: {
                                    respondShan: true,
                                    skillTagFilter: function (player) {
                                        if (!player.countCards('hs', 'sha')) return false;
                                    },
                                    effect: {
                                        target: function (card, player, target, current) {
                                            if (get.tag(card, 'respondShan') && current < 0) return 0.6
                                        },
                                    },
                                    order: 3,
                                    basic: {
                                        useful: [7, 5.1, 2],
                                        value: [7, 5.1, 2],
                                    },
                                    result: {
                                        player: 1,
                                    },
                                },
                                sub: true,
                            },
                        },
                    }
                    lib.skill.fz_new_tieji = {
                        audio: true,
                        inherit: "new_tieji",
                        mark: true,
                        marktext: "眩惑 马超铁骑",
                        intro: { name: '眩惑', content: 'info', },
                        trigger: {
                            player: "useCardToPlayered",
                        },
                        check: function (event, player) {
                            return get.attitude(player, event.target) < 0;
                        },
                        filter: function (event) {
                            return event.card.name == 'sha';
                        },
                        logTarget: "target",
                        content: function () {
                            "step 0"
                            var target = trigger.target;
                            var controls = [];
                            if (get.zhu(player, 'shouyue')) {
                                if (!target.isUnseen(0)) target.addTempSkill('fengyin_main');
                                if (!target.isUnseen(1)) target.addTempSkill('fengyin_vice');
                                event.goto(2);
                            }
                            if (!target.isUnseen(0) && !target.hasSkill('fengyin_main')) controls.push("主将");
                            if (!target.isUnseen(1) && !target.hasSkill('fengyin_vice')) controls.push("副将");
                            if (controls.length > 0) {
                                if (controls.length == 1) event._result = { control: controls[0] };
                                else {
                                    player.chooseControl(controls).set('ai', function () {
                                        var choice = '主将';
                                        var skills = lib.character[target.name2][3];
                                        for (var i = 0; i < skills.length; i++) {
                                            var info = get.info(skills[i]);
                                            if (info && info.ai && info.ai.maixie) {
                                                choice = '副将'; break;
                                            }
                                        }
                                        return choice;
                                    }).set('prompt', '请选择一个武将牌，令' + get.translation(target) + '该武将牌上的非锁定技全部失效。');
                                }
                            }
                            else event.goto(2);
                            "step 1"
                            if (result.control) {
                                player.popup(result.control, 'fire');
                                var target = trigger.target;
                                if (result.control == "主将") target.addTempSkill("fengyin_main");
                                else target.addTempSkill("fengyin_vice");
                            }
                            "step 2"
                            player.judge(function () { return 0 });
                            "step 3"
                            var suit = get.suit(result.card);
                            var target = trigger.target;
                            var num = target.countCards('h', 'shan');
                            target.chooseToDiscard('请弃置一张' + get.translation(suit) + '牌，否则不能使用闪抵消此杀', 'he', function (card) {
                                return get.suit(card) == _status.event.suit;
                            }).set('ai', function (card) {
                                var num = _status.event.num;
                                if (num == 0) return 0;
                                if (card.name == 'shan') return num > 1 ? 2 : 0;
                                return 8 - get.value(card);
                            }).set('num', num).set('suit', suit);
                            "step 4"
                            if (!result.bool) {
                                trigger.getParent().directHit.add(trigger.target);
                            }
                        },
                    }
                    lib.skill.fz_liegong = {
                        audio: true,
                        mark: true,
                        marktext: "眩惑 黄忠烈弓",
                        intro: { name: '眩惑', content: 'info', },
                        inherit: "liegong",
                        shaRelated: true,
                        audioname: ["re_huangzhong"],
                        trigger: {
                            player: "useCardToPlayered",
                        },
                        check: function (event, player) {
                            return get.attitude(player, event.target) <= 0;
                        },
                        logTarget: "target",
                        filter: function (event, player) {
                            if (event.card.name != 'sha') return false;
                            var length = event.target.countCards('h');
                            return (length >= player.hp || length <= player.getAttackRange());
                        },
                        preHidden: true,
                        content: function () {
                            trigger.getParent().directHit.push(trigger.target);
                        },
                        locked: false,
                        mod: {
                            attackRange: function (player, distance) {
                                if (get.zhu(player, 'shouyue')) return distance + 1;
                            },
                        },
                        ai: {
                            "directHit_ai": true,
                            skillTagFilter: function (player, tag, arg) {
                                if (get.attitude(player, arg.target) > 0 || arg.card.name != 'sha') return false;
                                var length = arg.target.countCards('h');
                                return (length >= player.hp || length <= player.getAttackRange());
                            },
                        },
                    }
                    lib.skill.fz_xinkuanggu = {
                        audio: true,
                        inherit: "xinkuanggu",
                        mark: true,
                        marktext: "眩惑 魏延狂骨",
                        intro: { name: '眩惑', content: 'info', },
                        trigger: {
                            source: "damageSource",
                        },
                        filter: function (event, player) {
                            return get.distance(player, event.player) <= 1 && event.num > 0;
                        },
                        direct: true,
                        audioname: ["re_weiyan", "ol_weiyan"],
                        preHidden: true,
                        content: function () {
                            'step 0'
                            event.num = trigger.num;
                            'step 1'
                            var choice;
                            if (player.isDamaged() && get.recoverEffect(player) > 0 && (player.countCards('hs', function (card) {
                                return card.name == 'sha' && player.hasValueTarget(card);
                            }) >= player.getCardUsable('sha'))) {
                                choice = 'recover_hp';
                            }
                            else {
                                choice = 'draw_card';
                            }
                            var next = player.chooseDrawRecover(get.prompt(event.name)).set('logSkill', event.name).set('prompt2', '摸一张牌或回复1点体力');
                            next.set('choice', choice);
                            next.set('ai', function () {
                                return _status.event.getParent().choice;
                            });
                            next.setHiddenSkill('xinkuanggu');
                            'step 2'
                            if (result.control != 'cancel2') {
                                event.num--;
                                if (event.num > 0) {
                                    event.goto(1);
                                }
                            }
                        },
                    }
                    //国战法正累死人
                    //普通篇
                    lib.skill.rekuanshi = {
                        audio: "kuanshi",
                        trigger: {
                            player: "phaseJieshuBegin",
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.chooseTarget(get.prompt2('rekuanshi')).set('animate', false).set('ai', function (target) {
                                var att = get.attitude(player, target);
                                if (target.hp < 3) att /= 1.5;
                                return att;
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('rekuanshi');
                                player.addTempSkill('rekuanshi_effect', { player: 'phaseBegin' });
                                player.storage.rekuanshi_effect = result.targets[0];
                                if (player == game.me || player.isUnderControl()) {
                                    player.storage.rekuanshi_mark = '';
                                    player.addTempSkill("rekuanshi_mark", { player: 'phaseBegin' });
                                    player.markSkill("rekuanshi_mark", '', '宽释 ' + get.translation(result.targets[0]));
                                }
                                game.delayx();
                            }
                        },
                        subSkill: {
                            mark: { intro: {}, sub: true, },
                            effect: {
                                audio: "kuanshi",
                                trigger: {
                                    global: "damageEnd",
                                },
                                forced: true,
                                charlotte: true,
                                logTarget: "player",
                                filter: function (event, player) {
                                    if (event.player != player.storage.rekuanshi_effect || event.player.isHealthy()) return false;
                                    var history = event.player.getHistory('damage', null, event), num = 0;
                                    for (var i of history) num += i.num;
                                    return num > 1 && (num - event.num) < 2;
                                },
                                content: function () {
                                    trigger.player.recover();
                                    //decadeUI.animation.playSpine({ name: 'kuanshi', speed: 1, }, { scale: 0.8, x: [0, 0.55], parent: player });
                                    dcdAnim.loadSpine(xixiguagua.kuanshi.name, "skel", function () {
                                        dcdAnim.playSpine(xixiguagua.kuanshi, { scale: 0.8, speed: 1, x: [0, 0.55], parent: player });
                                    });
                                    player.unmarkSkill('rekuanshi_mark')
                                    player.removeSkill('rekuanshi_effect');
                                },
                                sub: true,
                            },
                        },
                    }
                    lib.skill.kuanshi = {
                        audio: 2,
                        trigger: {
                            player: "phaseJieshuBegin",
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.chooseTarget(get.prompt2('kuanshi')).set('ai', function (target) {
                                if (get.attitude(_status.event.player, target) > 0) {
                                    return 1 / Math.sqrt(target.hp + 1);
                                }
                                return 0;
                            }).animate = false;
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('kuanshi');
                                target.storage.kuanshi2 = player;
                                target.addSkill('kuanshi2');
                                if (player == game.me || player.isUnderControl()) {
                                    player.storage.kuanshi_mark = '';
                                    player.addTempSkill("kuanshi_mark", { player: 'phaseZhunbeiBegin' });
                                    player.markSkill("kuanshi_mark", '', '宽释 ' + get.translation(target));
                                }
                            }
                        },
                        subSkill: {
                            mark: { intro: {}, sub: true, },
                            mark2: { mark: true, marktext: "宽释 生效", intro: { name: '宽释 生效' }, sub: true, },
                        },
                    }

                    lib.skill.kuanshi2 = {
                        trigger: {
                            player: "damageBegin4",
                        },
                        forced: true,
                        filter: function (event, player) {
                            return event.num > 1;
                        },
                        content: function () {
                            trigger.cancel();
                            player.storage.kuanshi2.skip('phaseDraw');
                            player.storage.kuanshi2.unmarkSkill("kuanshi_mark");
                            player.storage.kuanshi2.addTempSkill("kuanshi_mark2", { player: 'phaseZhunbeiBegin' });
                            player.removeSkill('kuanshi2');
                            //decadeUI.animation.playSpine({ name: 'kuanshi', speed: 1, }, { scale: 1, parent: player });
                            dcdAnim.loadSpine(xixiguagua.kuanshi.name, "skel", function () {
                                dcdAnim.playSpine(xixiguagua.kuanshi, { scale: 1, speed: 1,  parent: player });
                            });
                            game.delay(1);
                        },
                        group: "kuanshi2_remove",
                        onremove: true,
                        subSkill: {
                            remove: {
                                trigger: {
                                    global: ["phaseZhunbeiBegin", "dieAfter"],
                                },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.player == player.storage.kuanshi2;
                                },
                                content: function () {
                                    //player.removeSkill('kuanshi2');
                                    player.storage.kuanshi2.unmarkSkill("kuanshi_mark2");
                                    player.storage.kuanshi2.unmarkSkill("kuanshi_mark");
                                    player.removeSkill('kuanshi2');
                                },
                                sub: true,
                            },
                        },
                    }
                    lib.skill.shouxi = {
                        audio: 2,
                        trigger: {
                            target: "useCardToTargeted",
                        },
                        direct: true,
                        init: function (player) {
                            if (!player.storage.shouxi) player.storage.shouxi = [];
                        },
                        filter: function (event, player) {
                            return event.card.name == 'sha' && event.player.isAlive();
                        },
                        content: function () {
                            'step 0'
                            var list = lib.inpile.filter(function (i) {
                                if (player.storage.shouxi.contains(i)) return false;
                                var type = get.type(i);
                                if (type == 'basic' || type == 'trick') return true;
                                return false;
                            });
                            for (var i = 0; i < list.length; i++) {
                                list[i] = [get.type(list[i]), '', list[i]];
                            }
                            player.chooseButton([get.prompt('shouxi', trigger.player), [list, 'vcard']]).set('ai', function (button) {
                                return Math.random();
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('shouxi');
                                var name = result.links[0][2];
                                event.vcard = result.links;
                                event.cardname = name;
                                player.storage.shouxi.add(name);
                                player.addSkill("shouxi_mark");
                                player.addMark("shouxi_mark");
                            }
                            else {
                                event.finish();
                            }
                            'step 2'
                            var name = event.cardname;
                            trigger.player.chooseToDiscard(function (card) {
                                return card.name == _status.event.cardname;
                            }).set('ai', function (card) {
                                if (_status.event.att < 0) {
                                    return 10 - get.value(card);
                                }
                                return 0;
                            }).set('att', get.attitude(trigger.player, player)).set('cardname', name).set('dialog', ['守玺：请弃置一张【' + get.translation(name) + '】，否则此【杀】对' + get.translation(player) + '无效', [event.vcard, 'vcard']]);
                            'step 3'
                            if (result.bool == false) {
                                trigger.excluded.push(player);
                            }
                            else {
                                trigger.player.gainPlayerCard(player);
                            }
                        },
                        ai: {
                            effect: {
                                target: function (card, player, target, current) {
                                    if (card.name == 'sha' && get.attitude(player, target) < 0) {
                                        return 0.3;
                                    }
                                },
                            },
                        },
                        subSkill: {
                            mark: {
                                intro: {
                                    content: function (s, p) {
                                        var str = '已记录牌名：'
                                        str += get.translation(p.storage.shouxi);
                                        return str;
                                    },
                                }, sub: true,
                            },
                        },
                    }
                    //除害（周处）
                    lib.skill.rechuhai = {
                        audio: "chuhai",
                        inherit: "chuhai",
                        dutySkill: true,
                        locked: true,
                        group: ["rechuhai_add", "rechuhai_achieve", "rechuhai_fail"],
                        derivation: "zhangming",
                        prompt: "与一名其他角色进行拼点",
                        subSkill: {
                            add: {
                                trigger: {
                                    player: "compare",
                                },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.getParent().name == 'rechuhai' && event.num1 < 13 && player.countCards('e') < 4;
                                },
                                content: function () {
                                    var num = 4 - player.countCards('e');
                                    game.log(player, '的拼点牌点数+', num);
                                    trigger.num1 = Math.min(13, trigger.num1 + num);
                                },
                                sub: true,
                            },
                            achieve: {
                                audio: "rechuhai",
                                trigger: {
                                    player: "equipAfter",
                                },
                                forced: true,
                                skillAnimation: true,
                                animationColor: "wood",
                                filter: function (event, player) {
                                    return player.countCards('e') > 2;
                                },
                                content: function () {
                                    player.awakenSkill('rechuhai');
                                    player.shixiaoSkill("rechuhai");
                                    game.log(player, '成功完成使命');
                                    if (player.isDamaged()) player.recover(player.maxHp - player.hp);
                                    player.removeSkill('xianghai');
                                    player.addSkill('zhangming');
                                },
                                sub: true,
                            },
                            fail: {
                                trigger: {
                                    player: "chooseToCompareAfter",
                                },
                                forced: true,
                                filter: function (event, player) {
                                    return event.getParent().name == 'rechuhai' && event.num1 < 7 && !event.result.bool;
                                },
                                content: function () {
                                    player.awakenSkill('rechuhai');
                                    player.shixiaoSkill("rechuhai");
                                    player.failSkill('rechuhai');
                                    game.log(player, '使命失败');
                                    //decadeUI.animation.playSpine({ name: 'chuhaishibai', speed: 1, }, { scale: 0.8, x: [0, 0.55], parent: player });
                                    dcdAnim.loadSpine(xixiguagua.chuhaishibai.name, "skel", function () {
                                        dcdAnim.playSpine(xixiguagua.chuhaishibai, { scale: 0.8, speed: 1, x: [0, 0.55], parent: player });
                                    });
                                },
                                sub: true,
                            },
                            mark: {
                                mark: true,
                                marktext: '除害',
                                intro: {
                                },
                                sub: true,
                            },
                        },
                        enable: "phaseUse",
                        usable: 1,
                        filter: function (event, player) {
                            return !player.hasSkillTag('noCompareSource');
                        },
                        filterTarget: function (card, player, target) {
                            return target != player && target.countCards('h') > 0 &&
                                !target.hasSkillTag('noCompareTarget');
                        },
                        content: function () {
                            'step 0'
                            player.draw();
                            'step 1'
                            if (player.canCompare(target)) player.chooseToCompare(target);
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                player.storage.chuhai2 = target;
                                player.addTempSkill('chuhai2', 'phaseUseEnd');
                                target.addTempSkill('rechuhai_mark', 'phaseUseEnd')
                                if (target.countCards('h') > 0) {
                                    player.viewHandcards(target);
                                    var types = [], cards = [], hs = target.getCards('h');
                                    for (var i of hs) {
                                        types.add(get.type2(i, target));
                                    }
                                    for (var i of types) {
                                        var card = get.cardPile(function (card) {
                                            return get.type2(card, false) == i;
                                        });
                                        if (card) cards.push(card);
                                    }
                                    if (cards.length) player.gain(cards, 'gain2', 'log');
                                }
                            }
                        },
                        ai: {
                            order: 9,
                            result: {
                                target: function (player, target) {
                                    if (player.countCards('hs', function (card) {
                                        return get.tag(card, 'damage') > 0 && player.canUse(card, target, null, true) &&
                                            get.effect(target, card, player, player) > 0 && player.hasValueTarget(card, null, true);
                                    }) > 0) return -3;
                                    return -1;
                                },
                            },
                        },
                    };
                    //曹婴-凌人
                    lib.skill.xinfu_lingren = {
                        usable: 1,
                        audio: 2,
                        trigger: {
                            player: "useCardToPlayered",
                        },
                        direct: true,
                        filter: function (event, player) {
                            if (get.tag(event.card, 'damage')) return true;
                            return false;
                        },
                        content: function () {
                            'step 0'
                            event.count = 0;
                            player.chooseTarget(get.prompt('xinfu_lingren'), '选择一名目标角色并猜测其手牌构成', function (card, player, target) {
                                return _status.event.targets.contains(target);
                            }).set('ai', function (target) {
                                return 2 - get.attitude(_status.event.player, target);
                            }).set('targets', trigger.targets);
                            'step 1'
                            if (result.targets || (event.targets && event.count < event.targets.length)) {
                                if (!event.targets) event.targets = result.targets;
                                player.logSkill(event.name, event.targets[event.count]);
                                var target = event.targets[event.count];
                                event.target = target;
                                event.choice = {
                                    basic: false,
                                    trick: false,
                                    equip: false,
                                }
                                var list = [];
                                list.push(['', '', 'basic']);
                                list.push(['', '', 'trick']);
                                list.push(['', '', 'equip']);
                                var choice = [];
                                var rand1 = 0.95;
                                if (!target.countCards('h', { type: ['basic'] })) rand1 = 0.05;
                                if (!target.countCards('h')) rand1 = 0;
                                if (Math.random() < rand1) choice.add('basic');
                                var rand2 = 0.9;
                                if (!target.countCards('h', { type: ['trick', 'delay'] })) rand2 = 0.1;
                                if (!target.countCards('h')) rand2 = 0;
                                if (Math.random() < rand2) choice.add('trick');
                                var rand3 = 0.75;
                                if (!target.countCards('h', { type: ['equip'] })) rand3 = 0.25;
                                if (!target.countCards('h')) rand3 = 0;
                                if (Math.random() < rand3) choice.add('equip');
                                var dialog = ui.create.dialog('凌人', [list, 'vcard']);
                                dialog.classList.add('big');
                                for (var i = 0; i < 3; i++) {
                                    var dd = document.querySelector('[data-card-name="' + list[i][2] + '"]');
                                    dd.style['background-size'] = "100% 100%";
                                    dd.style['margin-left'] = "10px";
                                    dd.classList.add('none');
                                    dd.setBackgroundImage('extension/手杀标准UI/original/标记补充/mark/' + list[i][2] + '.png');
                                };
                                if (!event.isMine() && choice.length == 0) event.goto(3);
                                player.chooseButton([0, 3], dialog).set('ai', function (button) {
                                    var select = _status.event.button;
                                    if (select.length == 0) return 0;
                                    return select.contains(button.link[2]);
                                }).set('button', choice);
                            } else {
                                player.storage.counttrigger.xinfu_lingren--;
                                event.finish();
                            }
                            'step 2'
                            if (result.bool) {
                                for (var i = 0; i < result.links.length; i++) {
                                    event.choice[result.links[i][2]] = true;
                                }
                            } else {
                                player.storage.counttrigger.xinfu_lingren--;
                                event.finish();
                            }
                            'step 3'
                            game.delay();
                            var reality = {
                                basic: true,
                                trick: true,
                                equip: true,
                            }
                            var he = event.targets[event.count].getCards('h');
                            for (var i = 0; i < he.length; i++) {
                                reality[get.type(he[i], 'trick')] = false;
                            }
                            event.num = 0;
                            var tl = ['basic', 'trick', 'equip'];
                            for (var i = 0; i < tl.length; i++) {
                                if (event.choice[tl[i]] == reality[tl[i]]) event.num++;
                            }
                            'step 4'
                            player.popup('猜对' + get.cnNumber(event.num) + '项');
                            game.log(player, '猜对了' + get.cnNumber(event.num) + '项');
                            if (event.num > 0) {
                                target.addTempSkill('lingren_adddamage');
                                target.storage.lingren = {
                                    card: trigger.card,
                                    //player:event.targett,
                                }
                            }
                            if (event.num > 1) player.draw(2);
                            if (event.num > 2) {
                                player.addTempSkill('lingren_jianxiong', { player: 'phaseBegin' });
                                player.addTempSkill('lingren_xingshang', { player: 'phaseBegin' });
                            }
                        },
                        ai: {
                            threaten: 2.4,
                        },
                    };
                    //谋马超   铁骑
                    lib.skill.sbtieji = {
                        audio: 1,
                        trigger: {
                            player: 'useCardToPlayered'
                        },
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
                            dcdAnim.loadSpine(xixiguagua.mouyi.name, "skel")
                            'step 1'
                            if (result.bool) {
                                if (result.player == 'db_def1') {
                                    player.gainPlayerCard(target, 'he', true);
                                    xixiguagua.mouyi.action = 'play3';
                                    game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_jizhitu_zhiqudiying_1.mp3');
                                    dcdAnim.playSpine(xixiguagua.mouyi, { scale: 0.8 });
                                    game.delay(3.5);
                                } else {
                                    player.draw(2);
                                    xixiguagua.mouyi.action = 'play6';
                                    game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_jizhitu_raozhenpidi_1.mp3');
                                    dcdAnim.playSpine(xixiguagua.mouyi, { scale: 0.8 });
                                    game.delay(3.5);
                                }
                            }else {
                                if (result.player=='db_def1') {
                                    xixiguagua.mouyi.action = 'play4';
                                    game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_jizhitu_zhiqudiying_2.mp3');
                                    dcdAnim.playSpine(xixiguagua.mouyi, { scale: 0.8 });
                                    game.delay(3.5);
                                } else {
                                    xixiguagua.mouyi.action = 'play5';
                                    game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_jizhitu_raozhenpidi_2.mp3');
                                    dcdAnim.playSpine(xixiguagua.mouyi, { scale: 0.8 });
                                    game.delay(3.5);
                                }
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
                    }
                    //==========断粮==========//
                    lib.skill.sbduanliang = {
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
                            dcdAnim.loadSpine(xixiguagua.mouyi.name, "skel")
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
                                    xixiguagua.mouyi.action = 'play7';
                                    game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_jizhitu_duanliangchenggon_1.mp3');
                                    dcdAnim.playSpine(xixiguagua.mouyi, { scale: 0.8 });
                                    game.delay(3.5);
                                }
                                else {
                                    var card = { name: 'juedou', isCard: true };
                                    if (player.canUse(card, target)) player.useCard(card, target);
                                    xixiguagua.mouyi.action = 'play1';
                                    game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_jizhitu_leigujinjun_1.mp3');
                                    dcdAnim.playSpine(xixiguagua.mouyi, { scale: 0.8 });
                                    game.delay(3.5);
                                }
                            } else {
                                if (result.player=='db_def1') {
                                    xixiguagua.mouyi.action = 'play8';
                                    game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_jizhitu_duanliangchenggon_2.mp3');
                                    dcdAnim.playSpine(xixiguagua.mouyi, { scale: 0.8 });
                                    game.delay(3.5);
                                } else {
                                    xixiguagua.mouyi.action = 'play2';
                                    game.playAudio('../extension/手杀标准UI/original/标记补充/audio/effect_jizhitu_leigujinjun_2.mp3');
                                    dcdAnim.playSpine(xixiguagua.mouyi, { scale: 0.8 });
                                    game.delay(3.5);
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
                    }
                    //==========断粮==========//
                    //==========守邺==========//
                    lib.skill.shouye = {
                        audio: 2,
                        group: "shouye_after",
                        trigger: {
                            target: "useCardToTarget",
                        },
                        filter: function (event, player) {
                            return event.player != player && event.targets.length == 1;
                        },
                        check: function (event, player) {
                            if (event.player == game.me || event.player.isOnline()) return get.attitude(player, event.player) < 0;
                            return get.effect(player, event.card, event.player, player) < 0;
                        },
                        usable: 1,
                        logTarget: "player",
                        content: function () {
                            'step 0'
                            player.line(trigger.player, 'green');
                            player.chooseToDuiben(trigger.player);
                            dcdAnim.loadSpine(xixiguagua.chengchi.name, "skel")
                            'step 1'
                            var animation1;
                            if (result.bool) {
                                trigger.targets.remove(player);
                                trigger.getParent()
                                    .triggeredTargets2.remove(player);
                                trigger.getParent()
                                    .shouyeer = player;
                                xixiguagua.chengchi.action = 'play';
                                dcdAnim.playSpine(xixiguagua.chengchi);
                                game.delay(3.5);
                            } else {
                                xixiguagua.chengchi.action = 'play2';
                                dcdAnim.playSpine(xixiguagua.chengchi);
                                game.delay(3.5);
                            }
                        },
                        subSkill: {
                            after: {
                                sub: true,
                                trigger: {
                                    global: "useCardAfter",
                                },
                                forced: true,
                                silent: true,
                                popup: false,
                                filter: function (event, player) {
                                    if (event.shouyeer != player) return false;
                                    if (event.cards) {
                                        for (var i = 0; i < event.cards.length; i++) {
                                            if (event.cards[i].isInPile()) return true;
                                        }
                                    }
                                    return false;
                                },
                                content: function () {
                                    var list = [];
                                    for (var i = 0; i < trigger.cards.length; i++) {
                                        if (trigger.cards[i].isInPile()) {
                                            list.push(trigger.cards[i]);
                                        }
                                    }
                                    player.gain(list, 'gain2', 'log');
                                },
                            },
                        },
                    }
                    //==========守邺==========//
                    //==========殁亡==========//
lib.skill.mbmowang = {
    audio: 2,
    trigger: { player: 'dieBefore' },
    filter: function (event, player) {
        return player.getStorage('mbdanggu').length && event.getParent().name != 'giveup' && player.maxHp > 0;
    },
    derivation: 'mbmowang_faq',
    forced: true,
    direct: true,
    priority: 15,
    group: ['mbmowang_die', 'mbmowang_return'],
    content: function () {
        if (_status.mbmowang_return && _status.mbmowang_return[player.playerid]) {
            trigger.cancel();
        }
        else {
            player.logSkill('mbmowang');
            game.broadcastAll(function () {
                if (lib.config.background_speak) game.playAudio('die', 'shichangshiRest');
            });
            trigger.setContent(lib.skill.mbmowang.dieContent);
            trigger.includeOut = true;
        }
    },
    dieContent: function () {
        'step 0'
        event.forceDie = true;
        if (source) {
            game.log(player, '被', source, '杀害');
            if (source.stat[source.stat.length - 1].kill == undefined) {
                source.stat[source.stat.length - 1].kill = 1;
            }
            else {
                source.stat[source.stat.length - 1].kill++;
            }
        }
        else {
            game.log(player, '阵亡');
        }
        if (player.isIn() && (!_status.mbmowang_return || !_status.mbmowang_return[player.playerid])) {
            event.reserveOut = true;
            game.log(player, '进入了修整状态');
            game.log(player, '移出了游戏');
            //game.addGlobalSkill('mbmowang_return');
            if (!_status.mbmowang_return) _status.mbmowang_return = {};
            _status.mbmowang_return[player.playerid] = 1;
        }
        else event.finish();
        if (!game.countPlayer()) game.over();
        else if (player.hp != 0) {
            player.changeHp(0 - player.hp, false).forceDie = true;
        }
        game.broadcastAll(function (player) {
            if (player.isLinked()) {
                if (get.is.linked2(player)) {
                    player.classList.toggle('linked2');
                }
                else {
                    player.classList.toggle('linked');
                }
            }
            if (player.isTurnedOver()) {
                player.classList.toggle('turnedover');
            }
        }, player);
        game.addVideo('link', player, player.isLinked());
        game.addVideo('turnOver', player, player.classList.contains('turnedover'));
        'step 1'
        event.trigger('die');
        'step 2'
        if (event.reserveOut) {
            if (!game.reserveDead) {
                for (var mark in player.marks) {
                    if (mark == 'mbdanggu') continue;
                    player.unmarkSkill(mark);
                }
                var count = 1;
                var list = Array.from(player.node.marks.childNodes);
                if (list.some(i => i.name == 'mbdanggu')) count++;
                while (player.node.marks.childNodes.length > count) {
                    var node = player.node.marks.lastChild;
                    if (node.name == 'mbdanggu') {
                        node = node.previousSibling;
                    }
                    node.remove();
                }
                game.broadcast(function (player, count) {
                    while (player.node.marks.childNodes.length > count) {
                        var node = player.node.marks.lastChild;
                        if (node.name == 'mbdanggu') {
                            node = node.previousSibling;
                        }
                        node.remove();
                    }
                }, player, count);
            }
            for (var i in player.tempSkills) {
                player.removeSkill(i);
            }
            var skills = player.getSkills();
            for (var i = 0; i < skills.length; i++) {
                if (lib.skill[skills[i]].temp) {
                    player.removeSkill(skills[i]);
                }
            }
            event.cards = player.getCards('hejsx');
            if (event.cards.length) {
                player.discard(event.cards).forceDie = true;
            }
        }
        'step 3'
        if (event.reserveOut) {
            game.broadcastAll(function (player, list) {
                player.classList.add('out');
                if (list.contains(player.name1) || player.name1 == 'shichangshi') {
                    player.smoothAvatar(false);
                    player.node.avatar.setBackground(player.name1 + '_dead', 'character');
                }
                if (list.contains(player.name2) || player.name2 == 'shichangshi') {
                    player.smoothAvatar(true);
                    player.node.avatar2.setBackground(player.name2 + '_dead', 'character');
                }
            }, player, lib.skill.mbdanggu.changshi.map(i => i[0]));
        }
        if (source && lib.config.border_style == 'auto' && (lib.config.autoborder_count == 'kill' || lib.config.autoborder_count == 'mix')) {
            switch (source.node.framebg.dataset.auto) {
                case 'gold': case 'silver': source.node.framebg.dataset.auto = 'gold'; break;
                case 'bronze': source.node.framebg.dataset.auto = 'silver'; break;
                default: source.node.framebg.dataset.auto = lib.config.autoborder_start || 'bronze';
            }
            if (lib.config.autoborder_count == 'kill') {
                source.node.framebg.dataset.decoration = source.node.framebg.dataset.auto;
            }
            else {
                var dnum = 0;
                for (var j = 0; j < source.stat.length; j++) {
                    if (source.stat[j].damage != undefined) dnum += source.stat[j].damage;
                }
                source.node.framebg.dataset.decoration = '';
                switch (source.node.framebg.dataset.auto) {
                    case 'bronze': if (dnum >= 4) source.node.framebg.dataset.decoration = 'bronze'; break;
                    case 'silver': if (dnum >= 8) source.node.framebg.dataset.decoration = 'silver'; break;
                    case 'gold': if (dnum >= 12) source.node.framebg.dataset.decoration = 'gold'; break;
                }
            }
            source.classList.add('topcount');
        }
    },
    subSkill: {
        die: {
            audio: 'mbmowang',
            trigger: { player: 'phaseAfter' },
            forced: true,
            forceDie: true,
            content: function () {
                'step 0'
                if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
                    if (!player.getStorage('mbdanggu').length) {
                        game.broadcastAll(function (player) {
                            player.name1 = player.name;
                            player.smoothAvatar(false);
                            player.node.avatar.setBackground(player.name + '_dead', 'character');
                            player.node.name.innerHTML = get.slimName(player.name);
                            delete player.name2;
                            player.classList.remove('fullskin2');
                            player.node.avatar2.classList.add('hidden');
                            player.node.name2.innerHTML = '';
                            if (player == game.me && ui.fakeme) {
                                ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                            }
                            if(window.doubleKuang) window.doubleKuang(player,true);
                        }, player);
                    }
                }
                if (!player.getStorage('mbdanggu').length) {
                    game.delay();
                    setTimeout(function () {
                        dcdAnim.loadSpine(xixiguagua.scs_qjf.name, "skel", function () {
                            xixiguagua.scs_qjf.action = 'play1';
                            dcdAnim.playSpine(xixiguagua.scs_qjf, { speed: 1, scale: 0.8 });
                        });
                    }, 2000);
                }
                'step 1'
                player.die();
                dcdAnim.loadSpine(xixiguagua.scs_bagua.name, "skel", function () {
                    xixiguagua.scs_bagua.action = 'play1';
                    dcdAnim.playSpine(xixiguagua.scs_bagua, { speed: 1, scale: 0.8 });
                });
                dcdAnim.loadSpine(xixiguagua.scs_bgf.name, "skel", function () {
                    xixiguagua.scs_bgf.action = 'play';
                    dcdAnim.playSpine(xixiguagua.scs_bgf, { scale: 0.8 });
                });
                setTimeout(function () {
                    dcdAnim.loadSpine(xixiguagua.scs_bagua.name, "skel", function () {
                        xixiguagua.scs_bagua.action = 'play3';
                        dcdAnim.playSpine(xixiguagua.scs_bagua, { speed: 1, scale: 0.8 });
                    });
                }, 1000);
                game.delay(4.5);
            },
        },
        return: {
            trigger: { player: 'phaseBefore' },
            forced: true,
            charlotte: true,
            silent: true,
            forceDie: true,
            forceOut: true,
            filter: function (event, player) {
                return !event._mbmowang_return && event.player.isOut() && _status.mbmowang_return[event.player.playerid];
            },
            content: function () {
                'step 0'
                trigger._mbmowang_return = true;
                game.broadcastAll(function (player) {
                    player.classList.remove('out');
                }, trigger.player);
                game.log(trigger.player, '移回了游戏');
                delete _status.mbmowang_return[trigger.player.playerid];
                trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
                game.broadcastAll(function (player) {
                    if (player.name1 == 'shichangshi') {
                        player.smoothAvatar(false);
                        player.node.avatar.setBackground(player.name1, 'character');
                    }
                    if (player.name2 == 'shichangshi') {
                        player.smoothAvatar(true);
                        player.node.avatar2.setBackground(player.name2, 'character');
                    }
                }, trigger.player);
                'step 1'
                event.trigger('restEnd');
            }
        }
    }
}
//==========殁亡==========//
                });
            }
            if (config.jinengxiugai) {
                lib.translate.discretesidi_info = '当你使用除延时锦囊牌外的牌结算结束后，可以选择一名未指定“司敌”目标的其他角色，并为其指定一名“司敌”目标角色（仅你可见）。当其使用第一张除延时锦囊牌外的牌仅指定“司敌”目标为唯一目标时（否则清除你为其指定的“司敌”目标角色），若目标：为你，你摸一张牌；不为你，你选择一项：1.取消之，然后若此时场上没有角色处于濒死状态，你对其造成1点伤害；2.你摸两张牌。然后清除你为其指定的“司敌”目标角色。'
                lib.translate.qiaosi_info = '出牌阶段限一次，你可以表演“水转百戏图”来赢取相应的牌，然后你选择一项：1.弃置等量的牌；2.将等量的牌交给一名其他角色。'
                lib.skill.wengua = {
                    audio: 2,
                    group: ["wengua5"],
                }
                lib.skill.wengua5 = {
                    trigger: {
                        global: "phaseZhunbeiBegin",
                    },
                    forced: true,
                    audio: false,
                    content: function () {
                        trigger.player.addTempSkill('wengua2');
                    },
                }
                // lib.skill.zuoxing={
                // enable:"phaseUse",
                // usable:1,
                // filter:function(event,player){    
                // for(var i of lib.inpile){
                // if(get.type(i)=='trick'&&event.filterCard({name:i,isCard:true},player,event)) return true;            
                // if(player.storage.zuoxing.maxHp==1) return false;
                // }
                // return false;        
                // },
                // chooseButton:{
                // dialog:function(event,player){
                // var list=[];
                // for(var i of lib.inpile){
                // if(get.type(i)=='trick'&&event.filterCard({name:i,isCard:true},player,event)) list.push(['锦囊','',i]);
                // }
                // return ui.create.dialog('佐幸',[list,'vcard']);
                // },
                // check:function(button){
                // return _status.event.player.getUseValue({name:button.link[2],isCard:true});
                // },
                // backup:function(links,player){
                // return {
                // viewAs:{
                // name:links[0][2],
                // isCard:true,
                // },                
                // filterCard:()=>false,
                // selectCard:-1,
                // popname:true,
                // precontent:function(){
                // player.logSkill('zuoxing');
                // player.storage.zuoxing.loseMaxHp();
                // //delete event.result.skill;
                // },
                // }
                // },
                // prompt:function(links,player){
                // return '请选择'+get.translation(links[0][2])+'的目标';
                // },
                // },
                // ai:{
                // order:1,
                // result:{
                // player:1,
                // },
                // },
                // }

                // lib.translate.zuoxing_info='出牌阶段限一次，若神郭嘉存活且体力上限大于1，则你可以令其减1点体力上限，视为你使用一张普通锦囊牌。'
            }
            if (config.zhijiechifa) {
                //修改苦肉时机
                lib.skill.kurou = {
                    audio: 2,
                    enable: "phaseUse",
                    direct: true,
                    content: function () {
                        player.logSkill('kurou');
                        player.loseHp(1);
                        player.draw(2);
                    },
                    ai: {
                        basic: {
                            order: 1,
                        },
                        result: {
                            player: function (player) {
                                if (player.countCards('h') >= player.hp - 1) return -1;
                                if (player.hp < 3) return -1;
                                return 1;
                            },
                        },
                    },
                }
                //修改重铸时机
                lib.skill._chongzhu = {
                    enable: 'phaseUse',
                    logv: false,
                    visible: true,
                    direct: true,
                    prompt: '将要重铸的牌置入弃牌堆并摸一张牌',
                    filter: function (event, player) {
                        return player.hasCard(function (card) {
                            return lib.skill._chongzhu.filterCard(card, player);
                        });
                    },
                    filterCard: function (card, player) {
                        var mod = game.checkMod(card, player, 'unchanged', 'cardChongzhuable', player);
                        if (mod != 'unchanged') return mod;
                        var info = get.info(card);
                        if (typeof info.chongzhu == 'function') {
                            return info.chongzhu(event, player);
                        }
                        return info.chongzhu;
                    },
                    prepare: function (cards, player) {
                        player.$throw(cards, 1000);
                        game.log(player, '将', cards, '置入了弃牌堆');
                    },
                    check: function (card) {
                        return 1;
                    },
                    discard: false,
                    loseTo: 'discardPile',
                    delay: 0.5,
                    content: function () {
                        "step 0"
                        if (lib.config.mode == 'stone' && _status.mode == 'deck' &&
                            !player.isMin() && get.type(cards[0]).indexOf('stone') == 0) {
                            var list = get.stonecard(1, player.career);
                            if (list.length) {
                                player.gain(game.createCard(list.randomGet()), 'draw');
                            }
                            else {
                                player.draw({ drawDeck: 1 })
                            }
                        }
                        else if (get.subtype(cards[0]) == 'spell_gold') {
                            var list = get.libCard(function (info) {
                                return info.subtype == 'spell_silver';
                            });
                            if (list.length) {
                                player.gain(game.createCard(list.randomGet()), 'draw');
                            }
                            else {
                                player.draw();
                            }
                        }
                        else if (get.subtype(cards[0]) == 'spell_silver') {
                            var list = get.libCard(function (info) {
                                return info.subtype == 'spell_bronze';
                            });
                            if (list.length) {
                                player.gain(game.createCard(list.randomGet()), 'draw');
                            }
                            else {
                                player.draw();
                            }
                        }
                        else {
                            player.draw();
                        }
                    },
                    ai: {
                        basic: {
                            order: 6
                        },
                        result: {
                            player: 1,
                        },
                    }
                }
            }

            // 弧度转换为角度
            radiansToDegrees = function (radians) {
                const degrees = radians % (2 * Math.PI);
                return degrees * 180 / Math.PI;
            };
            lib.translate.heart='♥️';
            lib.translate.diamond='♦️';
            lib.translate.spade='♠️️';
            lib.translate.club='♣️️';
            lib.card.zhengsu_leijin = { fullskin: true }
            lib.card.zhengsu_mingzhi = { fullskin: true }
            lib.card.zhengsu_bianzhen = { fullskin: true }
            //名称重置
            //张仲景
            lib.translate.zhangzhongjing = '张仲景';
            lib.translate.old_zhangzhongjing = '旧张仲景';
            //蔡文姬
            lib.translate.caiwenji = '蔡文姬';
            lib.translate.re_caiwenji = '界蔡文姬';
            lib.translate.ol_caiwenji = 'OL蔡文姬';
            lib.translate.sp_caiwenji = 'SP蔡文姬';
            lib.translate.WEI_sp_caiwenji = '欢乐蔡文姬';
            lib.translate.WEI_sp_caiwenji_ab = '蔡文姬';
            lib.translate.yue_caiwenji = '乐蔡文姬';
            //严白虎
            lib.translate.yanbaihu = '严白虎';
            //甄姬
            lib.translate.zhenji = '甄姬';
            lib.translate.re_zhenji = '界甄姬';
            lib.translate.shen_zhenji = '神甄姬';
            lib.translate.diy_zhenji = '甄姬';
            lib.translate.sb_zhenji = '谋甄姬';
            lib.translate.jsrg_zhenji = '承甄姬';
            lib.translate.jsrg_zhenji_ab = '甄姬';
            lib.translate.yj_zhenji = '用间甄姬';
            lib.translate.yj_zhenji_ab = '甄姬';
            //伏皇后
            lib.translate.fuhuanghou = '伏皇后';
            lib.translate.re_fuhuanghou = '新杀伏皇后';
            lib.translate.xin_fuhuanghou = '界伏皇后';
            lib.translate.sp_fuhuanghou = 'SP伏皇后';
            lib.translate.old_fuhuanghou = '旧伏皇后';
            //吉平
            lib.translate.sp_jiben = 'SP吉平';
            lib.translate.dc_jiben = '吉平';
            //步练师
            lib.translate.dc_bulianshi = '新杀步练师';
            lib.translate.re_bulianshi = '界步练师';
            //星武将
            lib.translate.yj_zhanghe = "星张郃";
            lib.translate.yj_xuhuang = "星徐晃";
            lib.translate.yj_ganning = "星甘宁";
            lib.translate.yj_huangzhong = "星黄忠";
            lib.translate.yj_zhangliao = "星张辽";
            lib.translate.yj_weiyan = "星魏延";
            //花鬘
            lib.translate.sp_huaman = "花鬘";
            lib.translate.huaman = "新杀花鬘";
            //鲍三娘
            lib.translate.re_baosanniang = "鲍三娘";
            lib.translate.baosanniang = "OL鲍三娘";
            lib.translate.xin_baosanniang = "新杀鲍三娘";
            //骆统
            lib.translate.dc_luotong = "新杀骆统";
            //sp武将
            lib.translate.sp_caoren = 'SP曹仁';
            lib.translate.jsp_guanyu = 'SP关羽';
            lib.translate.sp_jiangwei = 'SP姜维';
            lib.translate.sp_jiaxu = 'SP贾诩';
            lib.translate.sp_pangde = 'SP庞德';
            lib.translate.sp_sunshangxiang = 'SP孙尚香';  
            lib.translate.sp_pangtong = 'SP庞统';
            lib.translate.sp_diaochan = 'SP貂蝉';
            lib.translate.sp_dongzhuo = 'SP董卓';
            lib.translate.sp_fuhuanghou = 'SP伏皇后';
            lib.translate.sp_fuwan = 'SP伏完';
            lib.translate.jsp_huangyueying = 'SP黄月英';
            lib.translate.sp_machao = 'SP马超';
            lib.translate.sp_menghuo = 'SP孟获';
            lib.translate.sp_taishici = 'SP太史慈';
            lib.translate.sp_yuanshu = 'SP袁术';
            lib.translate.sp_zhanghe = 'SP张郃';
            lib.translate.sp_zhangliao = 'SP张辽';
            lib.translate.sp_zhaoyun = 'SP赵云';
            lib.translate.sp_ol_zhanghe = 'SP张郃';

        }, precontent: function () {
        }, config: {
            jinengxiugai: {
                name: '技能修改和技能描述修改',
                init: true,
                intro: "修改部分武将技能和描述，同步手杀，重启生效。",
            },
            biaojixiugai: {
                name: '标记修改(含国战)',
                init: true,
                intro: "修改部分武将标记，同步手杀，重启生效。",
            },
            zhijiechifa: {
                name: '时机修改',
                init: true,
                intro: "修改部分武将时机，同步手杀，重启生效。",
            },
            doudizhu_guanqiuxiaoguo: {
                name: '入场特效',
                init: true,
                intro: "斗地主光球，入场官阶，入场国标重启生效。",
            },
            huajiatexiao: {
                name: '其他美化',
                init: true,
                intro: "整肃，护甲特效及音效，重启生效。",
            },
            guozhanmeihua: {
                name: '国战美化',
                init: true,
                intro: "关于国战的一些美化，如建国，军令，标记等，重启生效。",
            },
            shoushajishatexiao: {
                name: '全局特效',
                init: true,
                intro: "击杀特效，癫狂无双等，重启生效。",
            },
            shiyongkapaitixiao: {
                name: '使用卡牌特效',
                init: true,
                intro: "杀闪桃酒等，重启生效。",
            },
            youxishengfu: {
                name: '游戏胜负特效',
                init: "off",
                item: {
                    "identity": "十周年结算",
                    "mobileMode": "手杀结算",
                    "off": "关闭",
                },
                intro: "胜利以及失败的特效，十周年结算特效仅适用于身份模式",
                unshow:true,//隐藏这个设置
            },
            daojianfu:{
                name: '<b><font color=\"#FF9000\">开启刀剑斧特效(需重启)',
                intro: '<b><font color=\"#FF9000\">此选项可以开启刀剑斧特效，重启生效',
                init: "4.5",
                item:{
                    "shousha":'手杀经典',
                    "4.5":'手杀4.5版',
                    "off":'关闭',
                },
            },
            daojianfu_type:{
                name: '<b><font color=\"#FF9000\">指定刀剑斧特效(需重启)',
                intro: '<b><font color=\"#FF9000\">此选项可以指定随机刀剑斧特效，根据个人喜好自行切换，重启生效',
                init: "random",
                item:{
                    "random":'随机特效',
                    "no":'指定无',
                    "dao":'指定刀',
                    "jian":'指定剑',
                    "fuzi":'指定斧',
                },
            },
            xinshadoudizhu: {
                name: '兵临城下斗地主修改',
                init: false,
                intro: "不建议手杀ui下开启，兵临城下界面美化。",
            },

            xlfbmoshi: {
                name: '血量翻倍模式',
                init: false,
                intro: "所有模式生效，体力上限翻倍，重启生效。",
            },
            mpfbmoshi: {
                name: '摸牌翻倍模式',
                init: false,
                intro: "所有模式生效，摸牌阶段多摸2张牌，重启生效。",
            },
            zhujizhongwang: {
                name: '主亡忠继模式',
                init: false,
                intro: "身份模式生效，主公死了由忠臣继承，重启生效。",
            },
        }, help: {}, package: {
            character: {
                character: {
                },
                translate: {
                },
            },
            card: {
                card: {
                },
                translate: {
                },
                list: [],
            },
            skill: {
                skill: {
                },
                translate: {
                },
            },
            intro: "********************************************************<b><br><font color=\"#FF9000\">修改了一些技能标记和特效，建议配合 无名补丁 使用<br><font color=\"#00FFFF\">修改了一些技能和时机，同步手杀<br><span style='color:gold'>增加了手杀斗地主的光球效果<br>优化了国战美化，2V2美化，仁库整肃分离，全局特效<br><font color=\"#FFFFFF\">感谢以下大佬们的帮助和素材...<br><font color=\"#98FB98\"><img style=width:50px;border-radius:100%; src=" + lib.assetURL + "extension/手杀标准UI/original/标记补充/mingxie/zhenglao.jpg></img>蒸佬<img style=width:50px;border-radius:100%; src=" + lib.assetURL + "extension/手杀标准UI/original/标记补充/mingxie/luobo.jpg></img>萝卜<img style=width:50px;border-radius:100%; src=" + lib.assetURL + "extension/手杀标准UI/original/标记补充/mingxie/mingyue.jpg></img>明月栖木<img style=width:50px;border-radius:100%; src=" + lib.assetURL + "extension/手杀标准UI/original/标记补充/mingxie/wanzhou.jpg></img>晚舟<br><img style=width:50px;border-radius:100%; src=" + lib.assetURL + "extension/手杀标准UI/original/标记补充/mingxie/yaoyao.jpg></img>瑶瑶混日子</b><br><font color=\"#FFFFFF\">********************************************************<br>",
            author: "<img style=width:50px;border-radius:100%; src=" + lib.assetURL + "extension/手杀标准UI/original/标记补充/mingxie/xigua.jpg></img>   <b><samp id='西瓜'><small><strong>西瓜</strong></small></samp></body><style>#西瓜{animation:xiguabiaoqian 20s linear 1.5s infinite;font-family:shousha;font-size:40px;text-align: center; color: #FFFFCC;text-shadow:-1.3px 0px 2.2px #000, 0px -1.3px 2.2px #000, 1.3px 0px 2.2px #000 ,0px 1.3px 2.2px #000;}@keyframes xiguabiaoqian{0% {color:#99FF00;opacity:1;}9%{opacity:0;}18%{color: #FF0000;opacity:1;}27%{opacity:0;}36% {color:#0000FF;opacity:1;}45%{opacity:0;}54%{color: #FFFF99;opacity:1;}63%{opacity:0;}72%{color:#FF6600;opacity:1;}81%{opacity:0;}90%{color: #FF0000;opacity:1;}99%{opacity:0;}}</style>",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        }, files: { "character": [], "card": [], "skill": [] }
    }
})