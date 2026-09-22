// Migrated from 太虚幻境 2.0.3.4 (琉璃版 5.5), GPL-3.0. Shared core mode; never loaded by a UI provider.
import {lib, game, ui, get, ai, _status} from "noname";
export default function createDefinition() { return {
        name: 'taixuhuanjing',
        start:function(){
            "step 0"
            _status.mode = 'taixuhuanjing';
            lib.init.onfree();
            "step 1"
            if (lib.config.taixuhuanjingNode==undefined) {
                lib.config.taixuhuanjingNode={
                    use:{},/*常用武将*/
                    forbidden:[],/*过滤部分问答*/
                };
                game.saveConfig('taixuhuanjingNode',lib.config.taixuhuanjingNode);
                game.updateModeData();
            };
            if (lib.config.taixuhuanjing==undefined) {
                game.updateModeData();
            }
            _status.TaiXuHuanJingGame = {
                event:null,
                number:2,
                premise:'',
                enemy:[],
                friend:[],
                cards:[],
                skills:[],
                return:null,
            }
            "step 2"
            game.pause();
            game.taixuhuanjingHome();
        },
        init: function () {
            document.interval = setInterval(function(){
                if (_status.modeNode==undefined) return;
                if (_status.modeNode.score==undefined) return;
                if (_status.modeNode.score.time==undefined) return;
                if ( _status.gameStart == true && _status.enterGame == true ){
                    _status.modeNode.score.time++;
                }
            },1000);
        },

        game:{
            transitionAnimation:function(){
                var dialog = ui.create.div('.taixuhuanjing_transitionDialog');
                document.body.appendChild(dialog);
                var topBody = ui.create.div('.taixuhuanjing_transitionDialogTopBody',dialog);
                var bottomLeft1 = ui.create.div('.taixuhuanjing_transitionDialogBottomLeft1',dialog);
                var bottomRight1 = ui.create.div('.taixuhuanjing_transitionDialogBottomRight1',dialog);
                var bottomLeft2 = ui.create.div('.taixuhuanjing_transitionDialogBottomLeft2',dialog);
                var bottomRight2 = ui.create.div('.taixuhuanjing_transitionDialogBottomRight2',dialog);
                setTimeout(function(){
                    dialog.delete();
                },2600);
            },
            gameDraw:function(begin){
                if (get.mode() != 'taixuhuanjing') return;
                var next = game.createEvent('gameDraw');
                next.begin = begin;
                next.setContent(function(){
                    "step 0"
                    game.me.maxHp = lib.config.taixuhuanjing.maxHp;
                    game.me.hp = lib.config.taixuhuanjing.hp;
                    var target = event.begin;
                    while(true){
                        var num1 = 4;
                        if(target==game.me){
                            if (lib.config.taixuhuanjing.minHs>=0) {
                                num1 = lib.config.taixuhuanjing.minHs;
                            }
                        } else if (target.exten) {
                            num1 = target.exten.minHs;
                            if (lib.config.taixuhuanjing.rank>4) {
                                num1+=3;
                            } else if (lib.config.taixuhuanjing.rank>3) {
                                num1+=2;
                            } else if (lib.config.taixuhuanjing.rank>2) {
                                num1+=1;
                            }
                            if (lib.config.taixuhuanjing.effect=='chongfenbeizhan') {
                                num1+=2;
                            } else if (lib.config.taixuhuanjing.effect=='cangcuchuji') {
                                num1-=3;
                            } 
                        }
                        if(target==game.me&&lib.config.taixuhuanjing.buff.includes('buff_txhj_pofuchenzhou')){
                            num1 = 1;
                        }
                        if(target==game.me&&num1 != game.me.maxHp&&lib.config.taixuhuanjing.buff.includes('buff_txhj_fuzu')){
                            num1 = game.me.maxHp;
                        }
                        target.directgain(get.cards(num1));
                        target = target.next;
                        if(target == event.begin)break;
                    };
                    if (lib.config.taixuhuanjing.equip1!=null) {
                        var equip1 = lib.config.taixuhuanjing.equip1;
                        var info = get.translation(equip1);
                        if (info) {
                            game.me.equip(game.createCard(equip1.name,equip1.suit,equip1.number));
                        }
                    }
                    if (lib.config.taixuhuanjing.equip2!=null) {
                        var equip2 = lib.config.taixuhuanjing.equip2;
                        var info = get.translation(equip2);
                        if (info) {
                            game.me.equip(game.createCard(equip2.name,equip2.suit,equip2.number));
                        }
                    }
                    if (lib.config.taixuhuanjing.equip3!=null) {
                        var equip3 = lib.config.taixuhuanjing.equip3;
                        var info = get.translation(equip3);
                        if (info) {
                            game.me.equip(game.createCard(equip3.name,equip3.suit,equip3.number));
                        }
                    }
                    if (lib.config.taixuhuanjing.equip4!=null) {
                        var equip4 = lib.config.taixuhuanjing.equip4;
                        var info = get.translation(equip4);
                        if (info) {
                            game.me.equip(game.createCard(equip4.name,equip4.suit,equip4.number));
                        }
                    }
                    event.shouqika = lib.config.taixuhuanjing.adjust;
                    "step 1"
                    if (game.me.storage.seat==0&&event.shouqika>0) {
                        game.me.chooseBool('可以免费使用'+event.shouqika+'次手气卡，是否更换手牌？');
                        event.shouqika--;
                    } else {
                        event.goto(3);
                    }
                    "step 2"
                    if(result.bool){
                        var hs = game.me.getCards('h');
                        game.addVideo('lose',game.me,[get.cardsInfo(hs),[],[]]);
                        for(var i=0;i<hs.length;i++){
                            hs[i].discard(false);
                        }
                        game.me.directgain(get.cards(hs.length));
                        if (event.shouqika>0) {
                            event.goto(1);
                        }
                    }
                    'step 3'
                    var hs1 = [];
                    var list = _status.TaiXuHuanJingGame.cards.slice(0);
                    for (var i = 0; i < list.length; i++) {
                        hs1.push(game.createCard(list[i].name,list[i].suit,list[i].number,list[i].nature));
                    }
                    var hs2 = [];
                    var hs = game.me.getCards('h');
                    game.addVideo('lose',game.me,[get.cardsInfo(hs),[],[]]);
                    for(var i=0;i<hs.length;i++){
                        hs2.push(hs[i]);
                        hs[i].discard(false);
                    };
                    if(hs1.length){
                        game.me.directgain(hs1);
                    }
                    var hs3 = game.me.getCards('h');
                    for(var i=0;i<hs3.length;i++){
                        hs3[i].addGaintag('牌库');
                    };
                    if(hs2.length){
                        game.me.directgain(hs2);
                    }
                    "step 4"
                    var equips0 = [];
                    var equips1 = [];
                    var equips2 = [];
                    var equips3 = [];
                    for (var i = 0; i < txhjPack.cardPack.length; i++) {
                        equips0.push(txhjPack.cardPack[i].cardID);
                        var num = get.cardRank(txhjPack.cardPack[i].cardID);
                        if (num>=3) {
                            if (lib.translate[txhjPack.cardPack[i].cardID]&&get.type(txhjPack.cardPack[i].cardID)=='equip') {
                                if (get.subtype(txhjPack.cardPack[i].cardID)=='equip1') {
                                    equips1.push(txhjPack.cardPack[i].cardID);
                                } else if (get.subtype(txhjPack.cardPack[i].cardID)=='equip2') {
                                    equips2.push(txhjPack.cardPack[i].cardID);
                                } else {
                                    equips3.push(txhjPack.cardPack[i].cardID);
                                }
                            }
                        }
                    }
                    for(var i=0;i<game.players.length;i++){
                        if (game.players[i]!=game.me) {
                            if (game.players[i].exten) {
                                var exten = game.players[i].exten;
                                if (exten.maxHp) {
                                    game.players[i].maxHp += exten.maxHp;
                                    game.players[i].hp += exten.maxHp;
                                }
                                if (exten.cards.length) {
                                    var hs3 = [];
                                    for (var h = 0; h < exten.cards.length; h++) {
                                        hs3.push(game.createCard(exten.cards[h]));
                                    }
                                    if(hs3.length){
                                        game.players[i].directgain(hs3);
                                    }
                                }
                                if (exten.skills.length) {
                                    for (var ii = 0; ii < exten.skills.length; ii++) {
                                        game.players[i].addSkill(exten.skills[ii]);
                                    }
                                }
                                if (exten.equip.length) {
                                    for (var e = 0; e < exten.equip.length; e++) {
                                        game.players[i].equip(game.createCard(exten.equip[e]));
                                    }
                                }
                                if (game.players[i].side==false&&lib.config.taixuhuanjing.rank>1) {
                                    game.players[i].maxHp ++;
                                    game.players[i].hp ++;
                                }
                                if (game.players[i].side==false&&lib.config.taixuhuanjing.rank>2) {
                                    game.players[i].addSkill('reyingzi');
                                    game.players[i].addSkill('mashu');
                                }
                                var typelist = ['equip1','equip2','equip3'];
                                typelist.randomSort();
                                if (lib.config.taixuhuanjing.effect=='huanjingcaoge') {
                                    var equip = typelist.shift();
                                    if (equip=='equip1') {
                                        var equip1 = equips1.randomGet(1);
                                        game.players[i].equip(game.createCard(equip1));
                                        equips1.remove(equip1);
                                    }
                                    if (equip=='equip2') {
                                        var equip2 = equips2.randomGet(1);
                                        game.players[i].equip(game.createCard(equip2));
                                        equips2.remove(equip2);
                                    }
                                    if (equip=='equip3') {
                                        var equip3 = equips3.randomGet(1);
                                        game.players[i].equip(game.createCard(equip3));
                                        equips3.remove(equip3);
                                    }
                                } else {
                                    typelist.remove(typelist.randomGet());
                                }
                                if (game.players[i].side==false&&lib.config.taixuhuanjing.rank>3) {
                                    while(typelist.length){
                                        var equip = typelist.shift();
                                        if (equip=='equip1') {
                                            var equip1 = equips1.randomGet(1);
                                            game.players[i].equip(game.createCard(equip1));
                                            equips1.remove(equip1);
                                        }
                                        if (equip=='equip2') {
                                            var equip2 = equips2.randomGet(1);
                                            game.players[i].equip(game.createCard(equip2));
                                            equips2.remove(equip2);
                                        }
                                        if (equip=='equip3') {
                                            var equip3 = equips3.randomGet(1);
                                            game.players[i].equip(game.createCard(equip3));
                                            equips3.remove(equip3);
                                        }
                                    }
                                }
                            }
                        }
                        if (game.players[i]!=game.me&&lib.config.taixuhuanjing.effect=='lingqiyiman') {
                            game.players[i].maxHp+=2;
                            game.players[i].hp+=2;
                        } else if (game.players[i]!=game.me&&lib.config.taixuhuanjing.effect=='lingqikuijie') {
                            game.players[i].maxHp-=1;
                            game.players[i].hp-=1;
                        } else if (game.effectPack[lib.config.taixuhuanjing.effect]&&game.effectPack[lib.config.taixuhuanjing.effect].skill.length) {
                            var skills = game.effectPack[lib.config.taixuhuanjing.effect].skill.slice(0);
                            for (var ii = 0; ii < skills.length; ii++) {
                                if (game.players[i]!=game.me&&!game.players[i].hasSkill(skills[ii])) {
                                    game.players[i].addSkill(skills[ii]);
                                }
                            }
                        }
                        game.players[i].update();
                    }
                    'step 5'
                    var event1 = _status.TaiXuHuanJingGame.event;
                    var premise = _status.TaiXuHuanJingGame.premise;
                    game.messagePopup(''+premise+'');
                    
                });
            },
        },
        skill:{},
        characterPack:{},
        translate:{},
        cardPack:{},
        posmap:{},
    }; }
