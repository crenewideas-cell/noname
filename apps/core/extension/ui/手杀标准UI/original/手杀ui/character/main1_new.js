//首先感谢夜雨触花开，🦘，四月，萌佬提供素材和建议
app.import(function (lib, game, ui, get, ai, _status, app) {
  //技能标记isEnable会识别成主动技，这里修正了奇谋
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
          lib.init.css(lib.assetURL + 'extension/手杀标准UI/original/' + app.name + '/' + plugin.name, 'main1_new', next);
        },
      ], next);
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
        window.checkShoushaInfoHD=function(name,node) {
            if(lib.character[name]&&lib.character[name][4]&&lib.character[name][4].indexOf('No_Outcrop')!=-1) {
                var disPec=(168/191);
                game.createCss(`.No_OutcropShoushaInfo {
                    height: ${255*disPec}px !important;
                }`);
                node.classList.add('No_OutcropShoushaInfo');
            }else {
                node.classList.remove('No_OutcropShoushaInfo');
            }
        };
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
      window.processStr = function(card, equip) {
            let suit = '';
            let str = get.translation(card, equip ? undefined : 'viewAs');
            // 第一步：提取【】中的内容并删除该部分
            const suitRegex = /【(.*?)】/;
            const suitMatch = str.match(suitRegex);
            if (suitMatch) {
                suit = suitMatch[1];
                str = str.replace(suitRegex, ''); // 仅删除第一个匹配的【】
            }
        
            // 第二步：处理（）中的内容
            let name = '';
            let addition = '';
            const additionRegex = /^(.*?)（([^）]*)）/; // 匹配第一个完整的（）
            const additionMatch = str.match(additionRegex);
            
            if (additionMatch) {
                name = additionMatch[1];
                addition = additionMatch[2];
            } else {
                name = str; // 没有（）时直接使用剩余字符串
            }
        
            // 组合结果
            let result = '【'+ name + suit +'】';
            if (addition) {
                result += `（${addition}）`;
            }
            return result;
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
            container.style.transition = 'all 0.3s ease';//container.style.transition = 'none';
            container.hide();
            if(ui.roundmenu) ui.roundmenu.show();
            game.resume2();
          }
        });
        container.style.backgroundColor = 'rgba(0,0,0,0.6)';
        var dialog = ui.create.div('.character-dialog.popped', container);
        game.createCss(`.hideDialogCT {
            opacity: 0;
            transform: scale(1.2);
        }`);

        var createButton = function (name, parent) {
          if (!name) return;
          if (!lib.character[name]) return;
          var button = ui.create.button(name, 'character', parent, true);
        };

        container.show = function (player) {
          if(ui.roundmenu) ui.roundmenu.hide();
          container.classList.add('hideDialogCT');
          setTimeout(function() {
            container.classList.remove('hideDialogCT');
          });
          var name = player.name1 || player.name;
          var name2 = player.name2;
          if (player.classList.contains('unseen') && player !== game.me) {
            name = 'unknown';
          }
          if (player.classList.contains('unseen2') && player !== game.me) {
            name2 = 'unknown';
          }
        var shadowTop = ui.create.div('.shadowTop', dialog);
        var playerName = ui.create.div('.name', shadowTop);        
        var officialContainer = ui.create.div('.officialContainer', shadowTop);
        var redMap = ui.create.div('.redMap', officialContainer);  
        
        
        if(get.mode()=='boss'&&!player.guanjie&&['zhu','zhong'].contains(player.identity)) {
              if(player.identity=='zhu') {
                  player.guanjie='boss_zhu';
                  player.level=500;
              }else {
                  player.guanjie='boss_zhong';
                  player.level=220;
              }
          }
          var guanjieTxt='大将军';
          if(player==game.me) {
              guanjieTxt='大元帅';
              //guanjie.setBackgroundImage("extension/手杀标准UI/original/手杀ui/character/images/n_dayuanshuai.png");
          }else if(player.guanjie) {
              var ssrt='extension/手杀标准UI/original/手杀ui/character/images/n_';
              if(window.translateGuanjie(player.guanjie)!='未知') {
                  guanjieTxt=window.translateGuanjie(player.guanjie);
                  //guanjie.setBackgroundImage(ssrt+player.guanjie+'.png');
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
        
        
        //var levelNum = Math.floor(Math.random() * 200) + 1;  
        var levelNum = player.ss_dialog_dengji;
        if (player == game.me) {
          playerName.innerHTML = `${lib.config.connect_nickname}&nbsp;&nbsp;<span style='color: #FBCE08;'>LV:&nbsp;${levelNum}</span>`;
        } else {
          if(player.nickname) {
            playerName.innerHTML = `${player.nickname}&nbsp;&nbsp;<span style='color: #FBCE08;'>LV:&nbsp;${levelNum}</span>`;
          }else {
            playerName.innerHTML = `${get.translation(name)}&nbsp;&nbsp;<span style='color: #FBCE08;'>LV:&nbsp;${levelNum}</span>`;
          }
        }
        var officials = ['士兵','十夫长','百夫长','千夫长','校尉','先锋将军','中军将军','领军将军','骠骑将军','大将军','大元帅'];
        var official = ui.create.div('.official', shadowTop); 
        var officialName = ui.create.div('.officialName', redMap);
        var randomIndex = Math.floor(Math.random() * officials.length);
        //var selectedOfficial = officials[randomIndex];
        var selectedOfficial = guanjieTxt;
            officialName.innerText = selectedOfficial;
            official.setBackgroundImage('extension/手杀标准UI/original/手杀ui/character/images/official/' + selectedOfficial + '.png');
        var winPercent = ui.create.div('.winPercent', shadowTop);
        winPercent.innerHTML = '胜&nbsp;&nbsp;率：';   
        var runPercent = ui.create.div('.runPercent', shadowTop);
        runPercent.innerHTML = '逃&nbsp;&nbsp;率：';   
        const gameRecord = lib.config.gameRecord[lib.config.mode];
        let winRate;
        if (gameRecord&&gameRecord.str&&gameRecord.str.match) {
            const wins = gameRecord.str.match(/(\d+)胜/g).map(win => parseInt(win));
            const losses = gameRecord.str.match(/(\d+)负/g).map(loss => parseInt(loss));
            const totalWins = wins.reduce((acc, win) => acc + win, 0);
            const totalLosses = losses.reduce((acc, loss) => acc + loss, 0);
            const totalGames = totalWins + totalLosses;
            winRate = (totalWins / totalGames) * 100;
        } else {
            if(!player.winPercentage) player.winPercentage=getRandomPercentage();
            winRate = player.winPercentage;
        }
        function numberToImages(number) {
            var numberStr = number.toString();
            var imageHTML = '';
            for (var i = 0; i < numberStr.length; i++) {
                var char = numberStr[i];
                var imgSrc = lib.assetURL + "extension/手杀标准UI/original/手杀ui/character/images/num/" + char + ".png";
                imageHTML += '<img src="' + imgSrc + '" alt="' + char + '" style="width:38px; height:52px; margin-right:-9px;">';
            }
            var percentImgSrc = lib.assetURL + "extension/手杀标准UI/original/手杀ui/character/images/num/%25.png";
            imageHTML += '<img src="' + percentImgSrc + '" alt="%" style="width:38px; height:52px;">';
            return imageHTML;
        }
        function getRandomPercentage() {
            return (Math.random() * 100).toFixed(2);
        }
        var winPercentage;
        var runPercentage;
        if (player == game.me) {
            winPercentage = Math.floor(winRate*100)/100;
            //winRate.toFixed(2);
            runPercentage = '0';
        } else {
            if(!player.winPercentage) player.winPercentage=getRandomPercentage();
            if(!player.runPercentage) player.runPercentage=getRandomPercentage();
            winPercentage = player.winPercentage;
            runPercentage = player.runPercentage;
        }
        winPercent.innerHTML += '<div style="margin-top:-45px;margin-left:98px; display:flex; align-items:flex-start;">' + numberToImages(winPercentage) + '</div>';
        runPercent.innerHTML += '<div style="margin-top:-45px;margin-left:98px; display:flex; align-items:flex-start;">' + numberToImages(runPercentage) + '</div>';
        var btn = document.createElement('div');
        btn.className = 'btn';
        var span = document.createElement('span');
        span.className = 'blur-text';
        span.innerHTML = '查看名片';
        btn.appendChild(span);
        shadowTop.appendChild(btn);
        btn.addEventListener('click', function() {
            game.playAudio('../extension/手杀标准UI/original/十周年UI/audio/Label.mp3');
            if(game.qhly_open_new) {
                game.qhly_open_new(name, lib.config.qhly_doubledefaultpage ? lib.config.qhly_doubledefaultpage : 'skill', shadowTop);
                game.qhly_refresh_temp = function() {
                    if(typeof wujiangImage=='object') {
                        if (player.classList.contains('unseen') && player !== game.me) {
                         wujiangImage.style.backgroundImage = '';
                        } else {
                         wujiangImage.style.backgroundImage = player.node.avatar.style.backgroundImage;  
                         window.checkShoushaInfoHD(name,wujiangImage);
                        }
                    }
                    if(typeof wujiangImage2=='object') {
                        if (player.classList.contains('unseen2') && player !== game.me) {
                         wujiangImage2.style.backgroundImage = '';
                        } else {
                         wujiangImage2.setBackground(name2, 'character');
                         window.checkShoushaInfoHD(name2,wujiangImage2);
                        }
                    }
                }
            }
        });
        var shadowDown = ui.create.div('.shadowDown', dialog);
        var character = ui.create.div('.character', shadowDown);
        //这里写国战以外的，国战需要单独处理
        if(lib.config.mode != 'guozhan'){
        //单将        
        if(!name2){
        //var group = player.group;
        var group=(!player.group||player.group=='')?'name_guozhan_unknown':('name2_'+player.group);
        var wujiangkuang = ui.create.div('.wujiangkuang', character);
        wujiangkuang.setBackgroundImage(`extension/手杀标准UI/original/手杀ui/character/images/character/${group}.png`);
        var wujiangName = ui.create.div('.wujiangName', wujiangkuang);
        if (player.classList.contains('unseen') && player !== game.me) {
        wujiangName.innerHTML = "隐匿";
        } else {
        //wujiangName.innerHTML = get.translation(name);
        wujiangName.innerHTML = get.prefixBoldName(name,'translation');
        }
var wujiangstar = ui.create.div('.wujiangstar', wujiangkuang);
var rarity = game.getRarity(name);

function addStars(totalCount, filledCount) {
    if(!lib.config.five_gold_sj) {
        totalCount=4;
        filledCount=Math.floor(0.5+(filledCount*4/5));
    }
    for (var i = 0; i < filledCount; i++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element filled-star';
        wujiangstar.appendChild(starElement);
    }
    for (var j = filledCount; j < totalCount; j++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element empty-star';
        wujiangstar.appendChild(starElement);
    }
}
function addStarsP(name) {
    var totalCount=4;
    if(lib.config.five_gold_sj) {
        totalCount=5;
    }
    var filledCount=get.rankNum(name);
    for (var i = 0; i < filledCount; i++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element filled-star';
        wujiangstar.appendChild(starElement);
    }
    for (var j = filledCount; j < totalCount; j++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element empty-star';
        wujiangstar.appendChild(starElement);
    }
}
if (!(player.classList.contains('unseen') && player !== game.me)) {
/*if (rarity == 'legend') {
    addStars(5, 5);
} else if (rarity == 'epic') {
    addStars(5, 4);
} else if (rarity == 'rare') {
    addStars(5, 3);
} else if (rarity == 'common') {
    addStars(5, 2);
} else {
    addStars(5, 1);
}*/
addStarsP(name);
}
var wujiangImage = ui.create.div('.wujiangImage', wujiangkuang);
if (player.classList.contains('unseen') && player !== game.me) {
 wujiangImage.style.backgroundImage = '';
} else {
 wujiangImage.style.backgroundImage = player.node.avatar.style.backgroundImage;  
 window.checkShoushaInfoHD(name,wujiangImage);
}

//调用千幻函数获取皮肤数量
if (!(player.classList.contains('unseen') && player !== game.me) && lib.config.extension_千幻聆音_enable) {
game.qhly_getSkinList(name, function (ret, list) {
    if (Array.isArray(list) && list.length !== 0) {
    var skinCount = list.length;
    var skinShadow = ui.create.div('.skinShadow', wujiangkuang);
    var skinIcon = ui.create.div('.skinIcon', skinShadow);
    var skinNum = ui.create.div('.skinNum', skinShadow);
    skinNum.innerHTML = `${skinCount}/${skinCount}`;
    var skinClick = ui.create.div('.skinClick', wujiangImage);
    skinClick.addEventListener('click', function() {
                if (container) {
        container.style.transition = 'all 0.3s ease';//container.style.transition = 'none';
        container.hide();
        if(ui.roundmenu) ui.roundmenu.show();
        game.resume2();
                }
                game.pause2();
                
                game.qhly_open_small(name, null);

                // 检测皮肤框状态
                function checkSkinChangeWindow() {
                    if (!_status.qhly_open) {
                        game.resume2(); 
                        return;
                    }
                    requestAnimationFrame(checkSkinChangeWindow);
                }
                
                // 开始检测皮肤框状态
                requestAnimationFrame(checkSkinChangeWindow);
            });
    }
}, false);
}
 
 var skillwenzi = ui.create.div('.skillwenzi', shadowDown);
 if(lib.config.mode == 'doudizhu') skillwenzi.innerHTML = '武将技能·斗地主';
 else if(lib.config.mode == 'identity') skillwenzi.innerHTML = '武将技能·身份';
 else if(lib.config.mode == 'versus') skillwenzi.innerHTML = '武将技能·2v2';
 else if(lib.config.mode == 'single') skillwenzi.innerHTML = '武将技能·1v1';
        var skillsarea = ui.create.div('.ss-skillsarea', shadowDown);
        skillsarea.innerHTML = '<div></div>';
lib.setScroll(skillsarea.firstChild);
//原版的写法会让隐匿技直接寄了，这里修改一下
//var oSkills = player.skills.slice(0);
//没有临时技就略显幽默了
if(player==game.me) {
  var oSkills = player.getSkills(true, false, false).slice(0);
}else {
  var oSkills = player.getSkills(null, false, false).slice(0);
}
if (player.classList.contains('unseen')&&player == game.me) {
    //player.removeSkill('g_hidden_ai');
    for (var i of player.getSkills(lib.character[name])) {
        oSkills.add(i);
    }
}
 var yinniwenzi = ui.create.div('.yinniwenzi', shadowDown);
 if (player.classList.contains('unseen') && player !== game.me) {
 yinniwenzi.innerHTML = '该武将拥有隐匿技，<br>技能已隐藏';
 } else {
 yinniwenzi.innerHTML = '';
 }

            if (oSkills.length) {
                oSkills.forEach(function(name) {
                var translation = lib.translate[name];
                    if (translation && lib.translate[name + '_info'] && translation != '' && lib.translate[name + '_info'] != '') {
                        var imgSrc = lib.assetURL + 'extension/手杀标准UI/original/手杀ui/character/images/';
                        var skillHtml = '<div data-color>【' + get.translation(name) + '】</div>' +
                                        '<div>' + get.skillInfoTranslation(name, player) + '</div>';
                        
                        //这个是临时技能/失效技能
                        if (!(player.skills.contains(name)) || (player.awakenedSkills.contains(name)/* && !lib.skill[name].limited*/)) {
                            var tempHtml = '<div data-color style="opacity: 0.7;">【' + get.translation(name) + '】</div>' +
                                        '<div style="opacity: 0.7;">' + get.skillInfoTranslation(name, player) + '</div>';
                            let textH = '技';
                            if(player.awakenedSkills.contains(name)) {
                                textH = '禁';
                            }else if(!player.skills.contains(name)) {
                                textH = '临';
                            }
                            let kongbai = ui.create.div('.xskill', `<div><img src=${imgSrc}kongbai.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);z-index:0;/><div style="color:rgba(255,255,255,0.8);text-align:center;align-items:center;z-index:1;position:absolute;left:0px;top:0px;width:36.5px;height:36.5px;font-size:20px;text-shadow:0 0 3px rgb(0,0,0);">${textH}</div></div>` + tempHtml, skillsarea.firstChild);
                        } else if (get.info(name).enable||get.info(name).isEnable) {
                            ui.create.div('.xskill', '<img src=' + imgSrc + 'zhudong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);/>' + skillHtml, skillsarea.firstChild);
                        } else {
                            ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);/>' + skillHtml, skillsarea.firstChild);
                        }
                    }
                });
            }
            var judges = player.getCards('j');
            var eSkills = player.getCards('e');
            if (judges.length) {
                ui.create.div('.skill-area-wenzi', '判定区域', skillsarea.firstChild).classList.add('ej-area-wenzi');
                judges.forEach(function(card) {
                    ui.create.div('.xskill', `<div data-color>${window.processStr(card)}</div><div>${get.translation((card.viewAs || card.name) + '_info')}</div>`, skillsarea.firstChild);
                });
            }
            if (eSkills.length) {
                ui.create.div('.skill-area-wenzi', '装备区域', skillsarea.firstChild).classList.add('ej-area-wenzi');
                eSkills.forEach(function(item) {
                    ui.create.div('.xskill', `<div data-color>${window.processStr(item, true)}</div><div>${get.translation(item.name + '_info')}</div>`, skillsarea.firstChild);
                });
            }
        } else {
        //双将     
        var group1 = lib.character[name][1];
        var group2 = lib.character[name2][1];
        var wujiangkuang1 = ui.create.div('.wujiangkuang', character);
        var wujiangkuang2 = ui.create.div('.wujiangkuang2', character);
        wujiangkuang1.setBackgroundImage(`extension/手杀标准UI/original/手杀ui/character/images/character/name2_${group1}.png`);  
        wujiangkuang2.setBackgroundImage(`extension/手杀标准UI/original/手杀ui/character/images/character/name2_${group2}.png`);  
        var wujiangName1 = ui.create.div('.wujiangName', wujiangkuang1);
        var wujiangName2 = ui.create.div('.wujiangName2', wujiangkuang2);
        if (player.classList.contains('unseen') && player !== game.me) {
        wujiangName1.innerHTML = "隐匿";
        } else {
        //wujiangName1.innerHTML = get.translation(name);
        wujiangName1.innerHTML = get.prefixBoldName(name,'translation');
        }
        if (player.classList.contains('unseen2') && player !== game.me) {
        wujiangName2.innerHTML = "隐匿";
        } else {
        //wujiangName2.innerHTML = get.translation(name2);
        wujiangName2.innerHTML = get.prefixBoldName(name2,'translation');
        }        
        
var wujiangstar1 = ui.create.div('.wujiangstar', wujiangkuang1);
var wujiangstar2 = ui.create.div('.wujiangstar2', wujiangkuang2);
var rarity1 = game.getRarity(name);
var rarity2 = game.getRarity(name2);

function addStars(wujiangstar, totalCount, filledCount) {
    if(!lib.config.five_gold_sj) {
        totalCount=4;
        filledCount=Math.floor(0.5+(filledCount*4/5));
    }
    for (var i = 0; i < filledCount; i++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element filled-star';
        wujiangstar.appendChild(starElement);
    }
    for (var j = filledCount; j < totalCount; j++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element empty-star';
        wujiangstar.appendChild(starElement);
    }
}
function addStarsP(wujiangstar, name) {
    var totalCount=4;
    if(lib.config.five_gold_sj) {
        totalCount=5;
    }
    var filledCount=get.rankNum(name);
    for (var i = 0; i < filledCount; i++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element filled-star';
        wujiangstar.appendChild(starElement);
    }
    for (var j = filledCount; j < totalCount; j++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element empty-star';
        wujiangstar.appendChild(starElement);
    }
}

if (!(player.classList.contains('unseen') && player !== game.me)) {
    /*if (rarity1 == 'legend') {
        addStars(wujiangstar1, 5, 5);
    } else if (rarity1 == 'epic') {
        addStars(wujiangstar1, 5, 4);
    } else if (rarity1 == 'rare') {
        addStars(wujiangstar1, 5, 3);
    } else if (rarity1 == 'common') {
        addStars(wujiangstar1, 5, 2);
    } else {
        addStars(wujiangstar1, 5, 1);
    }*/
    addStarsP(wujiangstar1, name);
}

if (!(player.classList.contains('unseen2') && player !== game.me)) {
    /*if (rarity2 == 'legend') {
        addStars(wujiangstar2, 5, 5);
    } else if (rarity2 == 'epic') {
        addStars(wujiangstar2, 5, 4);
    } else if (rarity2 == 'rare') {
        addStars(wujiangstar2, 5, 3);
    } else if (rarity2 == 'common') {
        addStars(wujiangstar2, 5, 2);
    } else {
        addStars(wujiangstar2, 5, 1);
    }*/
    addStarsP(wujiangstar2, name2);
}
var wujiangImage = ui.create.div('.wujiangImage', wujiangkuang1);
var wujiangImage2 = ui.create.div('.wujiangImage2', wujiangkuang2);
if (!(player.classList.contains('unseen') && player !== game.me) && lib.config.extension_千幻聆音_enable) {
    game.qhly_getSkinList(name, function (ret, list) {
        if (Array.isArray(list) && list.length !== 0) {
            var skinCount = list.length;
            var skinShadow1 = ui.create.div('.skinShadow', wujiangkuang1);
            var skinIcon1 = ui.create.div('.skinIcon', skinShadow1);
            var skinNum1 = ui.create.div('.skinNum', skinShadow1);
            skinNum1.innerHTML = `${skinCount}/${skinCount}`;
            var skinClick1 = ui.create.div('.skinClick', wujiangImage);
                skinClick1.addEventListener('click', function() {
                if (container) {
        container.style.transition = 'all 0.3s ease';//container.style.transition = 'none';
        container.hide();
        if(ui.roundmenu) ui.roundmenu.show();
        game.resume2();
                }
                game.pause2();
                
                game.qhly_open_small(name, null);

                // 检测皮肤框状态
                function checkSkinChangeWindow() {
                    if (!_status.qhly_open) {
                        game.resume2(); 
                        return;
                    }
                    requestAnimationFrame(checkSkinChangeWindow);
                }
                
                // 开始检测皮肤框状态
                requestAnimationFrame(checkSkinChangeWindow);
            });
        }
    }, false);
}

if (!(player.classList.contains('unseen2') && player !== game.me) && lib.config.extension_千幻聆音_enable) {
    game.qhly_getSkinList(name2, function (ret, list) {
        if (Array.isArray(list) && list.length !== 0) {
            var skinCount = list.length;
            var skinShadow2 = ui.create.div('.skinShadow', wujiangkuang2);
            var skinIcon2 = ui.create.div('.skinIcon', skinShadow2);
            var skinNum2 = ui.create.div('.skinNum', skinShadow2);
            skinNum2.innerHTML = `${skinCount}/${skinCount}`;
            var skinClick2 = ui.create.div('.skinClick2', wujiangImage2);
                skinClick2.addEventListener('click', function() {
                if (container) {
        container.style.transition = 'all 0.3s ease';//container.style.transition = 'none';
        container.hide();
        if(ui.roundmenu) ui.roundmenu.show();
        game.resume2();
                }
                game.pause2();
                
                game.qhly_open_small(name2, null);

                // 检测皮肤框状态
                function checkSkinChangeWindow() {
                    if (!_status.qhly_open) {
                        game.resume2(); 
                        return;
                    }
                    requestAnimationFrame(checkSkinChangeWindow);
                }
                
                // 开始检测皮肤框状态
                requestAnimationFrame(checkSkinChangeWindow);
            });
        }
    }, false);
}
if (player.classList.contains('unseen') && player !== game.me) {
 wujiangImage.style.backgroundImage = '';
} else {
 wujiangImage.style.backgroundImage = player.node.avatar.style.backgroundImage;  
 window.checkShoushaInfoHD(name,wujiangImage);
}
if (player.classList.contains('unseen2') && player !== game.me) {
 wujiangImage2.style.backgroundImage = '';
} else {
 wujiangImage2.setBackground(name2, 'character');
 window.checkShoushaInfoHD(name2,wujiangImage2);
} 
 var skillwenzi = ui.create.div('.skillwenzi', shadowDown);
 if(lib.config.mode == 'doudizhu') skillwenzi.innerHTML = '武将技能·斗地主';
 else if(lib.config.mode == 'identity') skillwenzi.innerHTML = '武将技能·身份';
 else if(lib.config.mode == 'versus') skillwenzi.innerHTML = '武将技能·2v2';
 else if(lib.config.mode == 'single') skillwenzi.innerHTML = '武将技能·1v1';
        var skillsarea = ui.create.div('.ss-skillsarea', shadowDown);
        skillsarea.style.left = '46%';
        skillsarea.style.width = '53%';
        skillsarea.innerHTML = '<div></div>';
lib.setScroll(skillsarea.firstChild);

var oSkills = player.skills.slice(0);
if (player.classList.contains('unseen')&&player == game.me) {
    //player.removeSkill('g_hidden_ai');
    for (var i of player.getSkills(lib.character[name])) {
        oSkills.add(i);
    }
}
if (player.classList.contains('unseen2')&&player == game.me) {
    //player.removeSkill('g_hidden_ai');
    for (var i of player.getSkills(lib.character[name2])) {
        oSkills.add(i);
    }
}
//先注释，否则可能会出未知问题
/* var yinniwenzi = ui.create.div('.yinniwenzi', shadowDown);
 if (player.classList.contains('unseen') && player !== game.me) {
 yinniwenzi.innerHTML = '该武将拥有隐匿技，<br>技能已隐藏';
 } else {
 yinniwenzi.innerHTML = '';
 }*/

/*if (oSkills.length) {
    oSkills.forEach(function(name) {
    var translation = lib.translate[name];
              if (translation && lib.translate[name + '_info'] && translation != '' && lib.translate[name + '_info'] != '') {
        var imgSrc = lib.assetURL + 'extension/手杀标准UI/original/手杀ui/character/images/';
        var skillHtml = '<div data-color>【' + get.translation(name) + '】</div>' +
                        '<div>' + get.skillInfoTranslation(name, player) + '</div>';
        
        if (!(player.skills.contains(name)) || (player.awakenedSkills.contains(name) && !lib.skill[name].limited)) {
            ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
        } else if (get.info(name).enable||get.info(name).isEnable) {
            ui.create.div('.xskill', '<img src=' + imgSrc + 'zhudong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
        } else {
            ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
        }
        }
    });
}*/
            if (oSkills.length) {
                oSkills.forEach(function(name) {
                var translation = lib.translate[name];
                    if (translation && lib.translate[name + '_info'] && translation != '' && lib.translate[name + '_info'] != '') {
                        var imgSrc = lib.assetURL + 'extension/手杀标准UI/original/手杀ui/character/images/';
                        var skillHtml = '<div data-color>【' + get.translation(name) + '】</div>' +
                                        '<div>' + get.skillInfoTranslation(name, player) + '</div>';
                        
                        //这个是临时技能/失效技能
                        if (!(player.skills.contains(name)) || (player.awakenedSkills.contains(name)/* && !lib.skill[name].limited*/)) {
                            var tempHtml = '<div data-color style="opacity: 0.7;">【' + get.translation(name) + '】</div>' +
                                        '<div style="opacity: 0.7;">' + get.skillInfoTranslation(name, player) + '</div>';
                            let textH = '技';
                            if(player.awakenedSkills.contains(name)) {
                                textH = '禁';
                            }else if(!player.skills.contains(name)) {
                                textH = '临';
                            }
                            let kongbai = ui.create.div('.xskill', `<div><img src=${imgSrc}kongbai.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);z-index:0;/><div style="color:rgba(255,255,255,0.8);text-align:center;align-items:center;z-index:1;position:absolute;left:0px;top:0px;width:36.5px;height:36.5px;font-size:20px;text-shadow:0 0 3px rgb(0,0,0);">${textH}</div></div>` + tempHtml, skillsarea.firstChild);
                        } else if (get.info(name).enable||get.info(name).isEnable) {
                            ui.create.div('.xskill', '<img src=' + imgSrc + 'zhudong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);/>' + skillHtml, skillsarea.firstChild);
                        } else {
                            ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);/>' + skillHtml, skillsarea.firstChild);
                        }
                    }
                });
            }
            var judges = player.getCards('j');
            var eSkills = player.getCards('e');
            if (judges.length) {
                ui.create.div('.skill-area-wenzi', '判定区域', skillsarea.firstChild).classList.add('ej-area-wenzi');
                judges.forEach(function(card) {
                    ui.create.div('.xskill', `<div data-color>${window.processStr(card)}</div><div>${get.translation((card.viewAs || card.name) + '_info')}</div>`, skillsarea.firstChild);
                });
            }
            if (eSkills.length) {
                ui.create.div('.skill-area-wenzi', '装备区域', skillsarea.firstChild).classList.add('ej-area-wenzi');
                eSkills.forEach(function(item) {
                    ui.create.div('.xskill', `<div data-color>${window.processStr(item, true)}</div><div>${get.translation(item.name + '_info')}</div>`, skillsarea.firstChild);
                });
            }
        }
        } else {
        //国战
        var wujiangkuang1 = ui.create.div('.wujiangkuang', character);
        var wujiangkuang2 = ui.create.div('.wujiangkuang2', character);
        if(name != 'unknown'){
        var group1 = lib.character[name][1];
          wujiangkuang1.setBackgroundImage(`extension/手杀标准UI/original/手杀ui/character/images/character/name_guozhan_${group1}.png`);  
          }
        else {
        wujiangkuang1.setBackgroundImage(`extension/手杀标准UI/original/手杀ui/character/images/character/name_guozhan_unknown.png`);  
        }
        if(name2 != 'unknown'){
        var group2 = lib.character[name2][1];
         wujiangkuang2.setBackgroundImage(`extension/手杀标准UI/original/手杀ui/character/images/character/name_guozhan_${group2}.png`);  
       } else {
       wujiangkuang2.setBackgroundImage(`extension/手杀标准UI/original/手杀ui/character/images/character/name_guozhan_unknown.png`);  
       }
        var wujiangName1 = ui.create.div('.wujiangName', wujiangkuang1);
        var wujiangName2 = ui.create.div('.wujiangName2', wujiangkuang2);
        if (player.classList.contains('unseen') && player !== game.me) {
        wujiangName1.innerHTML = "主将";
        } else {
        //wujiangName1.innerHTML = get.translation(name);
        wujiangName1.innerHTML = get.prefixBoldName(name,'translation');
        }
        if (player.classList.contains('unseen2') && player !== game.me) {
        wujiangName2.innerHTML = "副将";
        } else {
        //wujiangName2.innerHTML = get.translation(name2);
        wujiangName2.innerHTML = get.prefixBoldName(name2,'translation');
        }        
        
var wujiangstar1 = ui.create.div('.wujiangstar', wujiangkuang1);
var wujiangstar2 = ui.create.div('.wujiangstar2', wujiangkuang2);
var rarity1 = game.getRarity(name);
var rarity2 = game.getRarity(name2);

function addStars(wujiangstar, totalCount, filledCount) {
    for (var i = 0; i < filledCount; i++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element filled-star';
        wujiangstar.appendChild(starElement);
    }
    for (var j = filledCount; j < totalCount; j++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element empty-star';
        wujiangstar.appendChild(starElement);
    }
}
function addStarsP(wujiangstar, name) {
    var totalCount=4;
    if(lib.config.five_gold_sj) {
        totalCount=5;
    }
    var filledCount=get.rankNum(name);
    for (var i = 0; i < filledCount; i++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element filled-star';
        wujiangstar.appendChild(starElement);
    }
    for (var j = filledCount; j < totalCount; j++) {
        var starElement = document.createElement('div');
        starElement.className = 'star-element empty-star';
        wujiangstar.appendChild(starElement);
    }
}

if (!(player.classList.contains('unseen') && player !== game.me)) {
    /*if (rarity1 == 'legend') {
        addStars(wujiangstar1, 5, 5);
    } else if (rarity1 == 'epic') {
        addStars(wujiangstar1, 5, 4);
    } else if (rarity1 == 'rare') {
        addStars(wujiangstar1, 5, 3);
    } else if (rarity1 == 'common') {
        addStars(wujiangstar1, 5, 2);
    } else {
        addStars(wujiangstar1, 5, 1);
    }*/
    addStarsP(wujiangstar1, name);
}

if (!(player.classList.contains('unseen2') && player !== game.me)) {
    /*if (rarity2 == 'legend') {
        addStars(wujiangstar2, 5, 5);
    } else if (rarity2 == 'epic') {
        addStars(wujiangstar2, 5, 4);
    } else if (rarity2 == 'rare') {
        addStars(wujiangstar2, 5, 3);
    } else if (rarity2 == 'common') {
        addStars(wujiangstar2, 5, 2);
    } else {
        addStars(wujiangstar2, 5, 1);
    }*/
    addStarsP(wujiangstar2, name2);
}
var wujiangImage = ui.create.div('.wujiangImage', wujiangkuang1);
var wujiangImage2 = ui.create.div('.wujiangImage2', wujiangkuang2);
if (player.classList.contains('unseen') && player !== game.me) {
 wujiangImage.style.backgroundImage = '';
} else {
 wujiangImage.style.backgroundImage = player.node.avatar.style.backgroundImage;  
 window.checkShoushaInfoHD(name,wujiangImage);
 }
if (player.classList.contains('unseen2') && player !== game.me) {
 wujiangImage2.style.backgroundImage = '';
} else {
 wujiangImage2.setBackground(name2, 'character'); ;  
 window.checkShoushaInfoHD(name2,wujiangImage2);
} 
if (!(player.classList.contains('unseen') && player !== game.me) && lib.config.extension_千幻聆音_enable) {
    game.qhly_getSkinList(name, function (ret, list) {
        if (Array.isArray(list) && list.length !== 0) {
            var skinCount = list.length;
            var skinShadow1 = ui.create.div('.skinShadow', wujiangkuang1);
            var skinIcon1 = ui.create.div('.skinIcon', skinShadow1);
            var skinNum1 = ui.create.div('.skinNum', skinShadow1);
            skinNum1.innerHTML = `${skinCount}/${skinCount}`;
            var skinClick1 = ui.create.div('.skinClick', wujiangImage);
            
            skinClick1.addEventListener('click', function() {
                if (container) {
        container.style.transition = 'all 0.3s ease';//container.style.transition = 'none';
        container.hide();
        if(ui.roundmenu) ui.roundmenu.show();
        game.resume2();
                }
                game.pause2();
                
                game.qhly_open_small(name, null);

                // 检测皮肤框状态
                function checkSkinChangeWindow() {
                    if (!_status.qhly_open) {
                        game.resume2(); 
                        return;
                    }
                    requestAnimationFrame(checkSkinChangeWindow);
                }
                
                // 开始检测皮肤框状态
                requestAnimationFrame(checkSkinChangeWindow);
            });
        }
    }, false);
}

if (!(player.classList.contains('unseen2') && player !== game.me) && lib.config.extension_千幻聆音_enable) {
    game.qhly_getSkinList(name2, function (ret, list) {
        if (Array.isArray(list) && list.length !== 0) {
            var skinCount = list.length;
            var skinShadow2 = ui.create.div('.skinShadow', wujiangkuang2);
            var skinIcon2 = ui.create.div('.skinIcon', skinShadow2);
            var skinNum2 = ui.create.div('.skinNum', skinShadow2);
            skinNum2.innerHTML = `${skinCount}/${skinCount}`;
            var skinClick2 = ui.create.div('.skinClick2', wujiangImage2);
            
            skinClick2.addEventListener('click', function() {
                if (container) {
                        container.style.transition = 'all 0.3s ease';//container.style.transition = 'none';
                        container.hide();
                        if(ui.roundmenu) ui.roundmenu.show();
                        game.resume2();
                }
                
                game.pause2();
                
                game.qhly_open_small(name2, null);

                // 检测皮肤框状态
                function checkSkinChangeWindow() {
                    if (!_status.qhly_open) {
                        game.resume2(); // 恢复游戏
                        return;
                    }
                    requestAnimationFrame(checkSkinChangeWindow);
                }
                
                // 开始检测皮肤框状态
                requestAnimationFrame(checkSkinChangeWindow);
            });
        }
    }, false);
}
 var skillwenzi = ui.create.div('.skillwenzi', shadowDown);
 skillwenzi.innerHTML = '武将技能·国战';
        var skillsarea = ui.create.div('.ss-skillsarea', shadowDown);
        skillsarea.style.left = '46%';
        skillsarea.style.width = '53%';
        skillsarea.innerHTML = '<div></div>';
lib.setScroll(skillsarea.firstChild);

var oSkills = player.skills.slice(0);
if (player.classList.contains('unseen')&&player == game.me) {
    //player.removeSkill('g_hidden_ai');
    for (var i of player.getSkills(lib.character[name])) {
        oSkills.add(i);
    }
}
if (player.classList.contains('unseen2')&&player == game.me) {
    //player.removeSkill('g_hidden_ai');
    for (var i of player.getSkills(lib.character[name2])) {
        oSkills.add(i);
    }
}
//先注释，否则可能会出未知问题
/* var yinniwenzi = ui.create.div('.yinniwenzi', shadowDown);
 if (player.classList.contains('unseen') && player !== game.me) {
 yinniwenzi.innerHTML = '该武将拥有隐匿技，<br>技能已隐藏';
 } else {
 yinniwenzi.innerHTML = '';
 }*/
            if (oSkills.length) {
                oSkills.forEach(function(name) {
                var translation = lib.translate[name];
                    if (translation && lib.translate[name + '_info'] && translation != '' && lib.translate[name + '_info'] != '') {
                        var imgSrc = lib.assetURL + 'extension/手杀标准UI/original/手杀ui/character/images/';
                        var skillHtml = '<div data-color>【' + get.translation(name) + '】</div>' +
                                        '<div>' + get.skillInfoTranslation(name, player) + '</div>';
                        
                        //这个是临时技能/失效技能
                        if (!(player.skills.contains(name)) || (player.awakenedSkills.contains(name)/* && !lib.skill[name].limited*/)) {
                            var tempHtml = '<div data-color style="opacity: 0.7;">【' + get.translation(name) + '】</div>' +
                                        '<div style="opacity: 0.7;">' + get.skillInfoTranslation(name, player) + '</div>';
                            let textH = '技';
                            if(player.awakenedSkills.contains(name)) {
                                textH = '禁';
                            }else if(!player.skills.contains(name)) {
                                textH = '临';
                            }
                            let kongbai = ui.create.div('.xskill', `<div><img src=${imgSrc}kongbai.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);z-index:0;/><div style="color:rgba(255,255,255,0.8);text-align:center;align-items:center;z-index:1;position:absolute;left:0px;top:0px;width:36.5px;height:36.5px;font-size:20px;text-shadow:0 0 3px rgb(0,0,0);">${textH}</div></div>` + tempHtml, skillsarea.firstChild);
                        } else if (get.info(name).enable||get.info(name).isEnable) {
                            ui.create.div('.xskill', '<img src=' + imgSrc + 'zhudong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);/>' + skillHtml, skillsarea.firstChild);
                        } else {
                            ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;transform:translateY(-1px);/>' + skillHtml, skillsarea.firstChild);
                        }
                    }
                });
            }
            var judges = player.getCards('j');
            var eSkills = player.getCards('e');
            if (judges.length) {
                ui.create.div('.skill-area-wenzi', '判定区域', skillsarea.firstChild).classList.add('ej-area-wenzi');
                judges.forEach(function(card) {
                    ui.create.div('.xskill', `<div data-color>${window.processStr(card)}</div><div>${get.translation((card.viewAs || card.name) + '_info')}</div>`, skillsarea.firstChild);
                });
            }
            if (eSkills.length) {
                ui.create.div('.skill-area-wenzi', '装备区域', skillsarea.firstChild).classList.add('ej-area-wenzi');
                eSkills.forEach(function(item) {
                    ui.create.div('.xskill', `<div data-color>${window.processStr(item, true)}</div><div>${get.translation(item.name + '_info')}</div>`, skillsarea.firstChild);
                });
            }
            /*if (oSkills.length) {
                oSkills.forEach(function(name) {
                var translation = lib.translate[name];
                          if (translation && lib.translate[name + '_info'] && translation != '' && lib.translate[name + '_info'] != '') {
                    var imgSrc = lib.assetURL + 'extension/手杀标准UI/original/手杀ui/character/images/';
                    var skillHtml = '<div data-color>【' + get.translation(name) + '】</div>' +
                                    '<div>' + get.skillInfoTranslation(name, player) + '</div>';
                    
                    if (!(player.skills.contains(name)) || (player.awakenedSkills.contains(name) && !lib.skill[name].limited)) {
                        ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                    } else if (get.info(name).enable||get.info(name).isEnable) {
                        ui.create.div('.xskill', '<img src=' + imgSrc + 'zhudong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                    } else {
                        ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                    }
                    }
                });
            }       
            var judges = player.getCards('j');
            var eSkills = player.getCards('e');
            if (judges.length) {
                ui.create.div('.skill-area-wenzi', '判定区域', skillsarea.firstChild).classList.add('ej-area-wenzi');
                judges.forEach(function(card) {
                    ui.create.div('.xskill', `<div data-color>${window.processStr(card)}</div><div>${get.translation((card.viewAs || card.name) + '_info')}</div>`, skillsarea.firstChild);
                });
            }
            if (eSkills.length) {
                ui.create.div('.skill-area-wenzi', '装备区域', skillsarea.firstChild).classList.add('ej-area-wenzi');
                eSkills.forEach(function(item) {
                    ui.create.div('.xskill', `<div data-color>${window.processStr(item, true)}</div><div>${get.translation(item.name + '_info')}</div>`, skillsarea.firstChild);
                });
            }*/
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
