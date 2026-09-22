export function createModeConfig(game) { return {
            quankuo:{
                name:'全扩将池',
                init:false,
                intro:'解除所有选择的限制',
            },
            suiji:{
                name:'随机将池',
                init:true,
                intro:'仅「全扩奖池」关闭时生效：在可选的将池内每个势力随机抽取14名武将提供选择（神势力抽取7名）',
            },
            pingheng:{
                name:'限制将池',
                init:true,
                intro:'仅「随机奖池」开启时生效：将池内随机抽取武将的星级不会超过该赛季解锁的难度',
            },
            star: {
				init: 0,
				intro: "每个武将星级的设置",
				name: "武将星级",
				item: {
					0: "系统默认",
					1: "全部一星",
					2: "全部二星",
					3: "全部三星",
					4: "全部四星",
					5: "全部五星",
				}
         	},
            deleteModeNode:{
                name:'重置记录',
                init:false,
                restart:true,
                unfrequent:true,
                intro:'删除所有统计记录',
                onclick: function(bool) {
                    if (bool) {
                        var src = "是否删除所有记录并重新启动游戏？";
                            var d = confirm(src);
                            if (d == true) {
                               game.saveConfig('taixuhuanjingNode', undefined)
                               game.saveConfig('taixuhuanjing', undefined);
                               game.saveConfig('txhj_collect', undefined);
                               game.reload()
                            }
                            /*confirms(src,function(){
                                game.saveConfig('taixuhuanjingNode', undefined)
                                game.saveConfig('taixuhuanjing', undefined);
                                game.reload()
                            });*/
                    }
                }
            },
            
        }; }
