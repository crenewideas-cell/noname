app.import(function (lib, game, ui, get, ai, _status, app) {
  var plugin = {
    name: 'character',
    filter: function () {
      return !['chess', 'tafang', 'stone', 'connect'].contains(get.mode());
    },
    content: function (next) {
      app.waitAllFunction([
        function (next) {

          next();
        },

        function (next) {
          lib.init.css(lib.assetURL + 'extension/手杀标准UI/original/' + app.name + '/' + plugin.name, 'main1', next);
        },
      ], next);
      window.shoushaCharacters=[];
      game.getFileList('image/character',function(folders,files){
          window.shoushaCharacters=[];
          for(var i=0;i<files.length;i++) {
              if(files[i].indexOf('.jpg')==-1) continue;
              if(files[i].indexOf('_nebula')!=-1) continue;
              var name=files[i].slice(0,-4);
              if(lib.character[name]&&(!lib.character[name][4]||!lib.character[name][4].contains('unseen'))) {
                  window.shoushaCharacters.add(name);
              }
          }
      });
    },
    precontent: function () {
      app.reWriteFunction(lib, {
        setIntro: [function (args, node) {
          if (get.itemtype(node) === 'player') {
            if (lib.config.touchscreen) {
              lib.setLongPress(node, plugin.click.playerIntro);
            } else {
              if (lib.config.right_info) {
                node.oncontextmenu = plugin.click.playerIntro;
              }
            }
            return node;
          }
        }],
      });
      window.guanjies=['shibing','shifuzhang','baifuzhang','qianfuzhang','xiaowei','xianfengjiangjun','zhongjunjiangjun','lingjunjiangjun','biaoqijiangjun','dajiangjun','dayuanshuai'];
      window.getNumGuanjie=function(name,num){
        if(num) {
            var str='未知';
            if(window.guanjies[name]) str=window.guanjies[name];
            return str;
        }else {
            return window.guanjies.indexOf(name)+1;
        }
      }
      window.translateGuanjie=function(name){
          var str='未知';
          if(name=='boss') str='试炼武将';
          if(name=='boss_zhu') str='试炼领主';
          if(name=='boss_zhong') str='试炼随从';
          if(name=='taixuhuanjing') str='太虚幻境';
          if(name=='dayuanshuai') str='大元帅';
          if(name=='dajiangjun') str='大将军';
          if(name=='biaoqijiangjun') str='骠骑将军';
          if(name=='lingjunjiangjun') str='领军将军';
          if(name=='zhongjunjiangjun') str='中军将军';
          if(name=='xianfengjiangjun') str='先锋将军';
          if(name=='xiaowei') str='校尉';
          if(name=='qianfuzhang') str='千夫长';
          if(name=='baifuzhang') str='百夫长';
          if(name=='shifuzhang') str='十夫长';
          if(name=='shibing') str='士兵';
          return str;
      }


    },

    click: {
      identity: function (e) {
        e.stopPropagation();
        var player = this.parentNode;
        if (!game.getIdentityList) return;
        if (player.node.guessDialog) {
          player.node.guessDialog.classList.toggle('hidden');
        } else {
          var list = game.getIdentityList(player);
          if (!list) return;
          var guessDialog = ui.create.div('.guessDialog', player);
          var container = ui.create.div(guessDialog);

          lib.setScroll(guessDialog);
          player.node.guessDialog = guessDialog;
        }
      },
      playerIntro: function (e) {
        e.stopPropagation();

        //如果开着动皮编辑就不要乱动
        if (_status.bigEditing) return false;
        
        if (plugin.playerDialog) {
          return plugin.playerDialog.show(this);
        }

        var container = ui.create.div('.popup-container.hidden', ui.window, function (e) {
          if (e.target === container) {
            container.hide();
            game.resume2();
            window.chgRoundMenu=false;
            //ui.roundmenu.style.pointerEvents='';
          }
        });
        window.chgRoundMenu=function() {
            container.hide();
            game.resume2();
            window.chgRoundMenu=false;
        };
        //ui.roundmenu.style.pointerEvents='none';
        
        /*clickOpens.style.opacity=0;
        clickOpens.style.transform='scale(0.5)';
        clickOpens.style.transition='all 0.3s';*/
        var dialog = ui.create.div('.character-dialog.popped', container);
        container.dialogs=dialog;
        var clickOpens = ui.create.div('.clicks', dialog);
        var guanjie = ui.create.div('.guanjie', dialog);
        var guanjietext = ui.create.div('.guanjietext', dialog);
        var xinxi = ui.create.div('.xinxi', dialog);
        var rightPane = ui.create.div('.right', dialog);

        var xing = ui.create.div('.xing', dialog);
        var biankuangname = ui.create.div('.biankuangname', dialog);
        var mingcheng = ui.create.div('.mingcheng', dialog);


        var dengji = ui.create.div('.dengji', dialog);



        //胜率
        var shenglv = ui.create.div('.shenglv', dialog);

        //逃率
        var taolv = ui.create.div('.taolv', dialog);
        var createButton = function (name, parent) {
          if (!name) return;
          if (!lib.character[name]) return;
          var button = ui.create.button(name, 'character', parent, true);
        };

        container.show = function (player) {
          var name = player.name1 || player.name;
          var name2 = player.name2;
          /*if (player.classList.contains('unseen') && player !== game.me) {
            name = 'unknown';
          }
          if (player.classList.contains('unseen2') && player !== game.me) {
            name2 = 'unknown';
          }*/
          if (player.isUnseen(0) && player != game.me) {
            name = 'unknown';
          }
          if (player.isUnseen(1) && player != game.me) {
            name2 = 'unknown';
          }

          //var url = extensionPath + 'character/images/name2_' + value + '.png';
          if (lib.config.extension_手杀ui_ZLLT == true) {
            var biankuang = ui.create.div('.biankuang', dialog);
          } else {
            var biankuang = ui.create.div('.biankuang2', dialog);
          }

          var group=(!player.group||player.group=='')?'unknown':player.group;
          biankuang.setBackgroundImage('extension/手杀标准UI/original/手杀ui/character/images/name2_'+group+'.png');

          var num = 1, rarity = game.getRarity(name);
          switch (rarity) {
            case 'legend':
              num = 5;
              break;
            case 'epic':
              num = 4;
              break;
            case 'rare':
              num = 3;
              break;
            case 'junk':
              num = 2;
              break;
            default:
              num = 1;
              break;
          }
          for (var numKey = 0; numKey < num; numKey++)
            ui.create.div('.item', xing);

          //角色名-资料页
          biankuangname.innerText = get.translation(name);

          //mingcheng.innerText = get.translation(name);
          if(player==game.me) {
              mingcheng.innerText = lib.config.connect_nickname;
          }else if(player.nickname) {
              mingcheng.innerText = player.nickname;
          }else {
              mingcheng.innerText = get.translation(name);
          }
          mingcheng.style.cssText = "display: block;position: absolute;top: 14px;right: 423px;font-size:23px;color:#4B3B30;text-shadow:none;font-weight:bold;font-family: 'FZLBJW';z-index:68"

          if(get.mode()=='boss'&&!player.guanjie&&['zhu','zhong'].contains(player.identity)) {
              if(player.identity=='zhu') {
                  player.guanjie='boss_zhu';
                  player.level=500;
              }else {
                  player.guanjie='boss_zhong';
                  player.level=220;
              }
          }
          guanjietext.innerText='大将军';
          if(player==game.me) {
              guanjietext.innerText='大元帅';
              guanjie.setBackgroundImage("extension/手杀标准UI/original/手杀ui/character/images/n_dayuanshuai.png");
          }else if(player.guanjie) {
              var ssrt='extension/手杀标准UI/original/手杀ui/character/images/n_';
              if(window.translateGuanjie(player.guanjie)!='未知') {
                  guanjietext.innerText=window.translateGuanjie(player.guanjie);
                  guanjie.setBackgroundImage(ssrt+player.guanjie+'.png');
              }
          }
          
          //角色等级 
          if(!player.ss_dialog_dengji) {
              if(player==game.me) {
                  player.level=220;
                  player.ss_dialog_dengji=220;
              }else if(player.level) {
                  player.ss_dialog_dengji=player.level;
              }else if(player.guanjie) {
                  player.level=Math.min(220,100+window.getNumGuanjie(player.guanjie)*10+Math.floor(Math.random()*50));
                  player.ss_dialog_dengji=player.level;
              }else {
                  player.ss_dialog_dengji = Math.floor(Math.random() * (200 - 20 + 1) + 20);
                  player.level=player.ss_dialog_dengji;
              }
          }
          //dengji.innerText = num = Math.floor(Math.random() * (200 - 1 + 1) + 1);
          dengji.innerText = player.ss_dialog_dengji;
          dengji.style.cssText = "display: block;position: absolute;top: 14px;right: 333px;font-size:24px;font-family:'shousha';color: white; !important; z-index:68"


          if(!player.ss_dialog_shenglv) player.ss_dialog_shenglv=(num = Math.floor(Math.random() * (99 - 0 + 1) + 0)) + '.' + (num = Math.floor(Math.random() * (99 - 0 + 1) + 0)) + '%';
          shenglv.innerText = '胜率：'+player.ss_dialog_shenglv;
          //shenglv.innerText = (num = Math.floor(Math.random() * (99 - 0 + 1) + 0)) + '.' + (num = Math.floor(Math.random() * (99 - 0 + 1) + 0)) + '%';
          shenglv.style.cssText = "display: block;position: absolute;top: 108px;left: 30px;font-size:27px;font-family:'shousha';color: white; webkit-text-stroke:0.5px black !important; z-index:68"

          if(!player.ss_dialog_taolv) player.ss_dialog_taolv=(num = Math.floor(Math.random() * (99 - 0 + 1) + 0)) + '.' + (num = Math.floor(Math.random() * (99 - 0 + 1) + 0)) + '%';
          taolv.innerText = '逃率：'+player.ss_dialog_taolv;
          //taolv.innerText = (num = Math.floor(Math.random() * (99 - 0 + 1) + 0)) + '.' + (num = Math.floor(Math.random() * (99 - 0 + 1) + 0)) + '%';
          taolv.style.cssText = "display: block;position: absolute;top: 108px;left: 235px;font-size:27px;font-family:'shousha';color: white; webkit-text-stroke:0.5px black !important; z-index:68"

          var shanchang = get.config('recentCharacter');
          if (lib.config.extension_手杀ui_ZLLT == true) {
            var leftPane = ui.create.div('.left', dialog);
          } else {
            var leftPane = ui.create.div('.left2', dialog);
          }

          if(name=='unknown') {
              leftPane.style.backgroundImage = 'url('+lib.assetURL+'extension/手杀标准UI/original/十周年UI/assets/image/unknown.png)';
          }else {
              leftPane.style.backgroundImage = player.node.avatar.style.backgroundImage;
          }
          createButton(name, leftPane.firstChild);
          createButton(name2, leftPane.firstChild);
          dialog.classList.add('single');
          /*setTimeout(function(){
             clickOpens.style.opacity=1;
             clickOpens.style.transform='';
          },200);*/
          if(player.isUnseen(2)&&player!=game.me) {
              clickOpens.style.filter='grayscale(1) brightness(0.8)';
          }

          clickOpens.onclick = function () {
            if(player.isUnseen(2)&&player!=game.me) return;
            var popuperContainer = ui.create.div('.popup-container', { background: "rgb(0,0,0,0)" }, ui.window);
            popuperContainer.addEventListener('click', event => {
              event.stopPropagation();
              popuperContainer.delete(200);
            });
            var bigdialog = ui.create.div('.bigdialog', popuperContainer);

            var kuangkuang1 = ui.create.div('.kuangkuang1', bigdialog);
            var kuangkuang2 = ui.create.div('.kuangkuang2', bigdialog);
            var kuangkuang3 = ui.create.div('.kuangkuang3', bigdialog);
            var kuangkuang4 = ui.create.div('.kuangkuang4', bigdialog);

            var shanchang1 = ui.create.div('.shanchang1', bigdialog);
            var shanchang2 = ui.create.div('.shanchang2', bigdialog);
            var shanchang3 = ui.create.div('.shanchang3', bigdialog);
            var shanchang4 = ui.create.div('.shanchang4', bigdialog);
            var shanchangss=[shanchang1,shanchang2,shanchang3,shanchang4];
            var minixingxiang = ui.create.div('.minixingxiang', bigdialog);
            var jingji = ui.create.div('.jingji', bigdialog);
            var xingbie = ui.create.div('.xingbie', bigdialog);
            var useless = ui.create.div('.useless', bigdialog);
            var useless2 = ui.create.div('.useless2', bigdialog);
            if(player.nickname) {
              var playernicks=player.nickname;
            }else {
              var playernicks=get.translation(innerText = num = ["氪金抽66", "卡宝真可爱", "蒸蒸日上", "√卡视我如父", "麒麟弓免疫枸杞", "坏可宣（老坏批）", "六千大败而归",
              "开局酒古锭", "遇事不决刷个乐", "见面两刀喜相逢", "改名出66", "时代的六万五", "韩旭", "司马长衫", "ogx",
              "狗卡不如无名杀", "王八万", "一拳兀突骨", "开局送神将", "丈八二桃", "装甲车车", "等我喝口酒", "Samuri", "马",
              "Log-Frunki", "aoe银钱豹", "没有丈八就托管", "无中yyds", "给咸鱼鸽鸽打call", "小零二哟～", "长歌最帅了",
              "大猫有侠者之风", "布灵布灵❤️", "我爱～摸鱼🐠～", "小寻寻真棒", "呲牙哥超爱笑", "是俺杀哒", "阿七阿七",
              "祖安·灰晖是龙王", "吃颗桃桃好遗计", "好可宣✓良民", "藏海表锅好", "金乎？木乎？水乎！！", "无法也无天", "西风不识相",
              "神秘喵酱", "星城在干嘛？", "子鱼今天摸鱼了吗？", "阳光苞里有阳光", "诗笺的小裙裙", "轮回中的消逝", "乱踢jb的云野",
              "小一是不是...是不是...", "美羊羊爱瑟瑟", "化梦的星辰", "杰哥带你登dua郎", "世中君子人", "叹年华未央", "短咕咕",
              "洛天依？！", "黄老板是好人～", "来点瑟瑟文和", "鲨鱼配辣椒", "萝卜～好萝卜", "废城君", "E佬细节鬼才",
              "感到棘手要怀念谁？", "半价小薯片", "JK欧拉欧拉欧拉", "新年快乐", "乔姐带你飞", "12345678？", "缘之空", "小小恐龙", "教主：杀我！", "才思泉涌的司马", "我是好人", "喜怒无常的大宝", "黄赌毒", "阴间杀～秋", "敢于劈瓜的关羽", "暮暮子"].randomGet(1));
            }
            var wanjiaming = ui.create.div('.wanjiaming', bigdialog, player === game.me ? lib.config.connect_nickname : playernicks);
            if(!player.ss_dialog_vip) {
                //player.ss_dialog_vip=['无名杀会员', '手机三国杀会员', '三国杀ol会员', '三国杀十周年会员', '怒焰三国杀会员', '欢乐三国杀会员', '阵面对决会员']).randomGet(1);
                player.ss_dialog_vip=(num =['乱世豪杰','群雄逐鹿','三分天下','智勇双全','赤壁烽火','锦绣江山','龙争虎斗','天下无双','六出祁山','黄巾之乱','官渡之战','千里单骑']).randomGet(1)+'会员';
                if(player==game.me) player.ss_dialog_vip='琉璃三国会员';
            }
            var gonghui = ui.create.div('.gonghui', bigdialog, get.translation(innerText = '(' + player.ss_dialog_vip + ')'));
            var xianhua = ui.create.div('.xianhua', bigdialog, get.translation(innerText = '鲜花' + (num = Math.floor(Math.random() * (999 - 1 + 1) + 1))));
            var jidan = ui.create.div('.jidan', bigdialog, get.translation(innerText = '鸡蛋' + (num = Math.floor(Math.random() * (999 - 1 + 1) + 1))));
            var fenxiang = ui.create.div('.fenxiang', bigdialog, get.translation(innerText = '分享'));
            var zhanshi = ui.create.div('.zhanshi', bigdialog, get.translation(innerText = '展示(诏令-1)'));



            //var shanchang = get.config('recentCharacter');
            var shanchang = ["sp_diaochan", "sp_zhaoyun", "sp_sunshangxiang", "sp_caoren", "sp_jiangwei", "sp_machao", "sp_caiwenji", "jsp_guanyu", "jsp_huangyueying", "sp_pangde", "sp_jiaxu", "yuanshu", 'sp_zhangliao', 'sp_ol_zhanghe', 'wulan', 'leitong', 'huaman', 'wangshuang', 'wenyang', 're_liuzan', 'caobuxing', 're_maliang', 'xin_baosanniang', 're_xinxianying', 'dongxie', 'guozhao', 'fanyufeng', 'ruanyu', 'liangxing', 're_dongzhao', 'yangwan', 're_panshu', 'dufuren', 'zhouyi', 'lvlingqi', 're_kanze', 'caojinyu', "caocao", "simayi", "xiahoudun", "zhangliao", "xuzhu", "guojia", "zhenji", "liubei", "guanyu", "zhangfei", "zhugeliang", "zhaoyun", "machao", "huangyueying", "sunquan", "ganning", "lvmeng", "huanggai", "zhouyu", "daqiao", "luxun", "sunshangxiang", "huatuo", "lvbu", "diaochan"];
            //var jingjitu = ['jingji1', 'jingji2', 'jingji3', 'jingji4'];
            //var xingbietu = ['xingbie1', 'xingbie2'];
            if(!player.ss_dialog_jingjitu) {
                player.ss_dialog_jingjitu=['jingji1', 'jingji2', 'jingji3', 'jingji4'].randomGet();
                if(player==game.me) player.ss_dialog_jingjitu='jingji4';
            }
            if(!player.ss_dialog_xingbietu) {
                player.ss_dialog_xingbietu=['xingbie1', 'xingbie2'].randomGet();
                if(player==game.me) player.ss_dialog_xingbietu='xingbie1';
            }
            if(window.shoushaCharacters) {
                shanchang=window.shoushaCharacters;
            }
            if(!player.ss_dialog_shanchang) {
                player.ss_dialog_shanchang=shanchang.randomGets(5);
            }
            //var shanchanglist=player.ss_dialog_shanchang;
            /*shanchang1.setBackgroundImage("image/character/" + shanchang.randomGet() + ".jpg");
            shanchang2.setBackgroundImage("image/character/" + shanchang.randomGet() + ".jpg");
            shanchang3.setBackgroundImage("image/character/" + shanchang.randomGet() + ".jpg");
            shanchang4.setBackgroundImage("image/character/" + shanchang.randomGet() + ".jpg");*/
            /*shanchang1.setBackgroundImage("image/character/" + player.ss_dialog_shanchang[0] + ".jpg");
            shanchang2.setBackgroundImage("image/character/" + player.ss_dialog_shanchang[1] + ".jpg");
            shanchang3.setBackgroundImage("image/character/" + player.ss_dialog_shanchang[2] + ".jpg");
            shanchang4.setBackgroundImage("image/character/" + player.ss_dialog_shanchang[3] + ".jpg");*/
            for(var i=0;i<shanchangss.length;i++) {
                var meme=shanchangss[i];
                var img=player.ss_dialog_shanchang[i];
                var sex=lib.character[img][0];
                meme.style.backgroundImage = [
					`url("${lib.assetURL}image/character/${img}.jpg")`,
					`url("${lib.assetURL}image/character/default_silhouette_${sex}.jpg")`,
					`url("${lib.assetURL}image/character/default_silhouette_male.jpg")`,
				].join(",");
				//底图：避免武将图丢失的空白
            }
            useless.setBackgroundImage("extension/手杀标准UI/original/手杀ui/character/images/useless.png");
            useless2.setBackgroundImage("extension/手杀标准UI/original/手杀ui/character/images/useless2.png");
            minixingxiang.style.backgroundImage = player.node.avatar.style.backgroundImage;
            //jingji.setBackgroundImage('extension/手杀标准UI/original/手杀ui/character/images/' + jingjitu.randomGet() + '.png');
            //xingbie.setBackgroundImage('extension/手杀标准UI/original/手杀ui/character/images/' + xingbietu.randomGet() + '.png');
            jingji.setBackgroundImage('extension/手杀标准UI/original/手杀ui/character/images/' + player.ss_dialog_jingjitu + '.png');
            xingbie.setBackgroundImage('extension/手杀标准UI/original/手杀ui/character/images/' + player.ss_dialog_xingbietu + '.png');
          }

          rightPane.innerHTML = '<div></div>';
          lib.setScroll(rightPane.firstChild);
          var hSkills = player.getCards('h');
          var eSkills = player.getCards('e');
          if(player==game.me) {
              var oSkills = player.getSkills(true, false, false).slice(0);
          }else {
              var oSkills = player.getSkills(null, false, false).slice(0);
          }
          var judges = player.getCards('j');

          /*if (!player.noclick && (player.isUnderControl() || (!game.observe && game.me && game.me.hasSkillTag('viewHandcard', null, player, true)))) {
            ui.create.div('.xcaption', '手牌区域', rightPane.firstChild);
            hSkills.forEach(function (item) {
              ui.create.div('.xskill', '<div data-color>' + get.translation(item) + ' </div>', rightPane.firstChild);
            });
          }*/

          if (oSkills.length) {
            ui.create.div('.xcaption', '武将技能', rightPane.firstChild);
            oSkills.forEach(function (name) {
              var translation = lib.translate[name];
              if (translation && lib.translate[name + '_info'] && translation != '' && lib.translate[name + '_info'] != '') {
                if (!player.getSkills().contains(name) || player.awakenedSkills.contains(name)) ui.create.div('.xskill', '<div data-color>' + '<span style="opacity:0.5">' + '【' + translation + '】' + '</span>' + '</div>' + '<div>' + '<span style="opacity:0.5">' + get.skillInfoTranslation(name, player) + '</span>' + '</div>', rightPane.firstChild);
                else ui.create.div('.xskill', '<div data-color>【' + translation + '】</div>' + '<div>' + get.skillInfoTranslation(name, player) + '</div>', rightPane.firstChild);
              }
            });
          }

          if (judges.length) {
            ui.create.div('.xcaption', '判定区域', rightPane.firstChild);
            judges.forEach(function (card) {
              ui.create.div('.xskill', '<div data-color>' + get.translation(card) + '</div><div>' + get.translation((card.viewAs || card.name) + '_info') + '</div>', rightPane.firstChild);
            });
          }

          if (eSkills.length) {
            ui.create.div('.xcaption', '装备区域', rightPane.firstChild);
            eSkills.forEach(function (item) {
              if(get.translation(item).indexOf('】')==-1) {
                  ui.create.div('.xskill', '<div data-color>' + get.translation(item) + '【◈】</div><div>' + get.translation(item.name + '_info') + '</div>', rightPane.firstChild);
              }else {
                  ui.create.div('.xskill', '<div data-color>' + get.translation(item) + '</div><div>' + get.translation(item.name + '_info') + '</div>', rightPane.firstChild);
              }
            });
          }



          container.classList.remove('hidden');
          game.pause2();
        };
        plugin.characterDialog = container;
        container.show(this);
      },
    },

  };
  return plugin;
});
