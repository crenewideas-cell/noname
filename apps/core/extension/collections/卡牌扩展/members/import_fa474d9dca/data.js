// Generated from 超越人类.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {"wish": {
            name: "光辉十连",
            intro: "每回合获得荣耀之魂x1，当造成或受到伤害时，获得等量荣耀之魂</br>回合内可以消耗一枚荣耀之魂进行一次召唤，随机获得一张牌，十连可以提高出现好牌的机率",
            init: false,
        },
"cure": {
            name: "痛楚平分",
            intro: "当场上有角色濒死时，你可以选择失去一点护甲/体力/体力上限(优先选择前者)，然后令其回复一点体力",
            init: false,
        },
"planet": {
            name: "星体投射",
            intro: "始终跳过判定阶段与弃牌阶段",
            init: false,
        },
"prototype": {
            name: "黑光病毒",
            intro: "当场上有角色死亡时（无论是否被你击杀），你选择获取其一项技能，然后增加一点体力上限并回复x点体力，x为3与其体力上限的最小值",
            init: false,
        },
"sakura": {
            name: "妖刀红樱",
            intro: "回合开始时，若未装备妖刀红樱，则获得并装备</br><li>造成的伤害增加x/10，然后回复等量体力，获得等同于回复溢出值的护甲 ，x为累计造成伤害，均向上取整<li>不进入牌堆，且失去该装备后你摸两张牌",
            init: false,
        },
"Gr": {
            name: "伪黄金律",
            intro: "你摸牌时更容易获得好牌",
            init: false,
        },
"IN": {
            name: "妹子泡面",
            intro: "增加3种基础牌，各一张加入牌堆",
            init: false,
        },
"undead": {
            name: "十二试炼",
            intro: "当你受到伤害时</br>①若此伤害不小于你的体力值，且之前未记录过<b>来源牌</b>，则你取消此次伤害，回复体力至体力上限，补充手牌至手牌上限，并记录此次伤害<b>来源牌</b>。仅能发动12次</br>②若之前记录过<b>来源牌</b>，则此伤害-X，X为13-记录过的次数",
            init: false,
        },
"prophet": {
            name: "预知未来",
            intro: "当需要判定时，或你摸牌前，你可以观看牌堆顶X张牌，并决定顺序，X取你的体力值与存活人数之间的较大值(玩起来很心累，建议不要开)",
            init: false,
        },
"balance": {
            name: "均衡教派",
            intro: "你的手牌锁定为4张不同花色的牌，若不足，则补充，若超出，则随机弃置",
            init: false,
        },
"GoldFinger": {
            name: "点石为金",
            intro: "出牌阶段，你可以获取一名本回合内你未以此法选择的其他角色区域里的一张牌A，然后从列出的三张牌中选择一张牌B，将牌A转化为牌B使用。此牌结算后，若为非装备牌，则转化回牌A，否则将在失去此牌时转化回牌A",
            init: false,
        },
"sort": {
            name: "自动整理",
            intro: "自动整理手牌，可以不用，但不能没有",
            init: false,
        },
"DaqiaoDiss": {
            name: "大乔末路",
            intro: "当玩家判定延时锦囊时，可以取消判定并选择若干目标添加相同锦囊",
            init: false,
        },
"qunouDiss": {
            name: "孤胆英雄",
            intro: "玩家的摸牌数，回复量，伤害值额外增加X，X为敌对的角色数减去友善的角色数",
            init: false,
        }}, build(config, builder) {
builder.addPack({
        card:{
        },
        translate:{
        },
        list:[],
    });
builder.addPack({
        skill:{
        },
        translate:{
        },
    });
builder.translate._shilian_import_fa474d9dca='光辉十连';
builder.translate._cure_import_fa474d9dca='痛楚平分';
builder.translate._planet_import_fa474d9dca='星体投射';
builder.translate._prototype_import_fa474d9dca='黑光病毒';
builder.translate._sakura_import_fa474d9dca='妖刀红樱';
builder.translate._Gr_import_fa474d9dca='伪黄金律';
builder.translate._undead_import_fa474d9dca='十二试炼';
builder.translate._undead2_import_fa474d9dca='十二试炼';
builder.translate._prophet_import_fa474d9dca='预知未来';
builder.translate._balance_import_fa474d9dca='均衡教派';
builder.translate._GoldFinger_import_fa474d9dca='点石为金';
builder.translate._NoU='超越空白';
builder.translate._sort_import_fa474d9dca='自动整理';
builder.translate._DaqiaoDiss_import_fa474d9dca="大乔末路";
builder.translate._qunouDiss_import_fa474d9dca="孤胆英雄";
builder.translate._xianji_import_fa474d9dca='献祭';
builder.translate._zhaohuan_import_fa474d9dca='召唤';
builder.translate.tale='传说';
builder.translate.SurpassHumankind_wulaiyuan='无来源';
builder.translate.SurpassHumankind_cherry_mark="妖刀";
builder.translate.SurpassHumankind_undead="十二试炼";
builder.translate.SurpassHumankind_cherry_skill="红樱";
builder.translate.SurpassHumankind_cherry_skill_info="<span style=\"color:#B0171F\">烙印着血的教诲</span><li>造成的伤害增加x/10，然后回复等量体力，获得等同于回复溢出值的护甲 ，x为累计造成伤害，均向上取整<li>不进入牌堆，且失去该装备后摸两张牌";
builder.translate.SurpassHumankind_mb_skill="手札";
builder.translate.SurpassHumankind_mb_skill_info="锁定技，回合开始和结束时，你获得一张卡面信息带有【】字的锦囊牌，【】内容根据游戏轮数，在【区域】，【伤害】之间切换<li>锁定技，你的锦囊牌不计入手牌上限";
builder.translate.SurpassHumankind_soul="荣耀之魂";
builder.translate.SurpassHumankind_fsr_skill="梦醒";
builder.translate.SurpassHumankind_fsr_skill_info="选择使用，人物体力、体力上限、手牌、装备牌、判定区均恢复到使用“浮生若茶”前的情况";
builder.translate.SurpassHumankind_yu_skill="聚灵";
builder.translate.SurpassHumankind_yu_skill_info="摸牌阶段额外摸两张牌，然后回复一点体力";
builder.skill.SurpassHumankind_yu_skill={
        trigger:{
            player:"phaseDrawBegin2",
        },
        frequent:true,
        content:function (){
            player.recover();
            trigger.num+=2;
        },
    };
builder.skill.SurpassHumankind_fsr_skill={
        enable:"chooseToUse",
        locked:true,
        filter:function (event,player){
            if(event.type=='dying'){
                if(player!=event.dying) return false;
                return true;
            }
            if(_status.currentPhase==game.me) return true;
            return false;
        },
        content:function (){
            'step 0'
            var cards=player.getCards('hej');
            if(cards.length){
                player.lose(cards)._triggered=null;
            }
            game.delay(0.5);
            'step 1'
            player.hp=player.storage.hp;
            player.maxHp=player.storage.maxHp;
            player.directgain(player.storage.h);
            for(var i=0;i<player.storage.e.length;i++){
                player.equip(game.createCard(player.storage.e[i]));
            }
            for(i=0;i<player.storage.j.length;i++){
                player.useCard(game.createCard(player.storage.j[i]),player);
            }
            player.removeSkill('SurpassHumankind_fsr_skill');
            player.update();
        },
    };
builder.skill.SurpassHumankind_soul={
        mark:true,
        marktext:"魂",
        intro:{
            name:"<span style=\"color:#B22222\">荣耀之魂",
            content:function (storage){
                return '<b>您拥有的魂心数：</b>'+storage+'</br>——血液是灵魂的货币';
            },
        },
    };
builder.skill.SurpassHumankind_mb_skill={
        trigger:{
            player:["phaseBegin","phaseEnd"],
        },
        nobracket:true,
        forced:true,
        content:function (){
            var c=get.typeCard('trick');
            var t=lib.translate;
            var l=[];
            var w=[['伤','害'],['区','域']][game.roundNumber%2==0?1:0];
            for(var i=0;i<c.length;i++){
                var str=t[c[i]+'_info'];
                for(var j=0;j<str.length;j++){
                    if(str[j]==w[0]&&str[j+1]==w[1]){
                        l.push(c[i]);
                        break;
                    }
                }
            }
            var card=game.createCard(l.randomGet());
            player.gain(card,'gain2');
        },
        mod:{
            ignoredHandcard:function (card, player) {
                if (get.type(card,'trick')=='trick') return true;
            },
        },
    };
builder.skill.SurpassHumankind_cherry_skill={
        trigger:{
            source:"damageBefore",
        },
        forced:true,
        priority:null,
        filter:function (event,player){
            return event.player!=player;
        },
        content:function (){
            'step 0'
            if(player!=game.me){
                player.say('<span style="color:#B0171F">烙印着血的教诲!</span>');
                game.delay(0.5);
                player.discard(player.getCards('he'));
                player.maxHp=1;
                trigger.cancel();
                event.finish();
            }
            'step 1'
            if(!player.storage.SurpassHumankind_cherry_mark){
                player.storage.SurpassHumankind_cherry_mark=0;
                player.markSkill('SurpassHumankind_cherry_mark');
            }
            trigger.num+=Math.ceil(player.storage.SurpassHumankind_cherry_mark/10);
            player.storage.SurpassHumankind_cherry_mark+=trigger.num;
            player.changeHujia(Math.max(0,trigger.num+player.hp-player.maxHp));
            player.recover(trigger.num);
        },
    };
builder.skill.SurpassHumankind_undead={
        mark:true,
        intro:{
            content:"cards",
        },
    };
builder.skill.SurpassHumankind_cherry_mark={
        mark:true,
        intro:{
            content:function (storage,player){
                return '额外造成'+Math.ceil(storage/10)+'点伤害';
            },
        },
    };
if(config.wish){
        builder.skill._xianji_import_fa474d9dca={
            // Resource bookkeeping is automatic, not a player-ordered activation.
            silent:true,
            trigger:{
                player:"damageEnd",
                source:"damageEnd",
            },
            forced:true,
            popup:false,
            filter:function(event,player){
                return player==game.me
            },
            content:function(){
                if(!player.storage.SurpassHumankind_soul){
                    player.storage.SurpassHumankind_soul=0;
                    player.markSkill('SurpassHumankind_soul');
                }
                player.storage.SurpassHumankind_soul+=trigger.num;
                player.markSkill('SurpassHumankind_soul');
            },
            group:"_xianji_import_fa474d9dca_gz",
            subSkill:{
                gz:{
                    trigger:{
                        global:"roundStart",
                    },
                    silent:true,
                    filter:function(event,player){
                        return player==game.me;
                    },
                    content:function(){
                        if(!player.storage.SurpassHumankind_soul){
                            player.storage.SurpassHumankind_soul=0;
                            player.markSkill('SurpassHumankind_soul');
                        }
                        player.storage.SurpassHumankind_soul++;
                        player.markSkill('SurpassHumankind_soul');
                    },
                    forced:true,
                    sub:true,
                },
            },
        }
        builder.skill._zhaohuan_import_fa474d9dca={
            enable:"phaseUse",
            filter:function(event,player){
                if(player==game.me&&player.storage.SurpassHumankind_soul>0) return true;
                return false;
            },
            content:function(){
                if(lib.config["extension_卡牌扩展_import_fa474d9dca_Gr"]){var jilv=0.5}
                else{var jilv=0.3}
                player.storage.SurpassHumankind_soul--;
                if(Math.random()>jilv){
                    var list0=get.typeCard('basic');
                    var list=[];
                    for(var i=0;i<list0.length;i++){
                        if(get.value({name:list0[i]})>0) {
                            list.push(list0[i]);
                        }
                    }
                    player.gain(game.createCard(list.randomGet()),'gain2');
                }
                else{
                    if(Math.random()>jilv){
                        game.playAudio('..','extension','卡牌扩展/members/import_fa474d9dca','稀有'); 
                        game.me.$fullscreenpop('<span style="color:#1688F2">稀有!</span>','thunder');
                        if(Math.random()>0.6){
                            var list0=get.typeCard('equip');
                            var list=[];
                            for(var i=0;i<list0.length;i++){
                                if(get.value({name:list0[i]})>0) {
                                    list.push(list0[i]);
                                }
                            }
                            player.gain(game.createCard(list.randomGet()),'fromStorage');
                        }
                        else{
                            var list0=get.typeCard('trick');
                            var list=[];
                            for(var i=0;i<list0.length;i++){
                                if(get.value({name:list0[i]})>0) {
                                    list.push(list0[i]);
                                }
                            }
                            player.gain(game.createCard(list.randomGet()),'fromStorage');
                        }
                    }
                    else{
                        if(Math.random()>jilv){
                            var list=get.typeCard('spell');
                            game.playAudio('..','extension','卡牌扩展/members/import_fa474d9dca','史诗'); 
                            game.me.$fullscreenpop('<span style="color:#C67ADE">史诗!</span>','thunder');
                            player.gain(game.createCard(list.randomGet()),'fromStorage');
                        }
                        else{
                            var list=get.typeCard('tale');
                            game.playAudio('..','extension','卡牌扩展/members/import_fa474d9dca','传说'); 
                            game.me.$fullscreenpop('<span style="color:#FFDF56">哇！传说!</span>','fire');
                            player.gain(game.createCard(list.randomGet()),'fromStorage');
                        }
                    }
                }
            },
        }
        builder.skill._shilian_import_fa474d9dca={
            enable:"phaseUse",
            filter:function(event,player){
                if(player==game.me&&player.storage.SurpassHumankind_soul>9) return true;
                return false;
            },
            content:function(){
                'step 0'
                if(lib.config["extension_卡牌扩展_import_fa474d9dca_Gr"]){var jilv=0.7}
                else{var jilv=0.5}
                player.storage.SurpassHumankind_soul-=10;
                player.storage.round=10;
                event.jilv=jilv;
                'step 1'
                if(Math.random()>event.jilv){
                    player.gain(game.createCard(get.typeCard('basic').remove('du').randomGet()),'fromStorage');
                }
                else{
                    if(Math.random()>event.jilv){
                        game.playAudio('..','extension','卡牌扩展/members/import_fa474d9dca','稀有'); 
                        game.me.$fullscreenpop('<span style="color:#1688F2">稀有!</span>','thunder');
                        if(Math.random()>0.6){
                            player.gain(game.createCard(get.typeCard('equip').randomGet()),'fromStorage');
                    }
                        else{
                            player.gain(game.createCard(get.typeCard('trick').randomGet()),'fromStorage');
                        }
                    }
                    else{
                        if(Math.random()>event.jilv){
                            game.playAudio('..','extension','卡牌扩展/members/import_fa474d9dca','史诗'); 
                            game.me.$fullscreenpop('<span style="color:#C67ADE">史诗!</span>','thunder');
                            player.gain(game.createCard(get.typeCard('spell').randomGet()),'fromStorage');
                        }
                        else{
                            game.playAudio('..','extension','卡牌扩展/members/import_fa474d9dca','传说'); 
                            game.me.$fullscreenpop('<span style="color:#FFDF56">哇！传说!</span>','fire');
                            player.gain(game.createCard(get.typeCard('tale').randomGet()),'fromStorage');
                        }
                    }
                }
                game.delay(1);
                player.storage.round--;
                'step 2'
                if(player.storage.round!=0){
                    game.delay(0.8);
                    event.goto(1);
                }
            },
        }
        builder.addCard('SurpassHumankind_zhengjiu',{
            type:"tale",
            toself:true,
            enable:true,
            selectTarget:-1,
            filterTarget:function (card,player,target){
                return target==player;
            },
            content:function (){
                var target=player;
                do{
                    if(target.isDead()&&
                       player.onmyside(target)==true){
                        target.revive(target.maxHp);
                        target.draw(4);
                        target.update();
                    }
                    target=target.previousSeat;
                    game.delay(0.5);
                }while(target!=player);
            },
            fullskin:true,
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_zhengjiu.png",
        },{
            translate:'拯救',
            description:'出牌阶段对自己使用，令所有同阵营的死亡角色复活，并摸四张牌',
        });
        builder.addCard('SurpassHumankind_dream',{
            type:"tale",
            toself:true,
            enable:true,
            selectTarget:-1,
            filterTarget:function (card,player,target){
                return target==player;
            },
            content:function (){
                target.addSkill('SurpassHumankind_fsr_skill');
                target.storage.hp=target.hp;
                target.storage.maxHp=target.maxHp;
                target.storage.h=target.getCards('h');
                target.storage.e=target.getCards('e');
                target.storage.j=target.getCards('j');
            },
            fullskin:true,
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_dream.png",
        },{
            translate:'浮生若梦',
            description:'夫天地者，万物之逆旅也；光阴者，百代之过客也。而浮生若梦，为欢几何',
        });
        builder.addCard('SurpassHumankind_life',{
            fullskin:true,
            enable:true,
            vanish:true,
            type:"tale",
            filterTarget:function (card,player,target){
                return !target.isMin();
            },
            selectTarget:1,
            content:function (){
                var cards=target.getCards('hej');
                if(cards.length){
                    target.lose(cards)._triggered=null;
                }
                var num=Math.min(5,cards.length);
                target.gainMaxHp(num);
                target.hp=target.maxHp;
            },
            ai:{
                order:9,
                value:6,
                useful:2,
                result:1,
                tag:{
                    norepeat:1,
                },
            },
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_life.png",
        },{
            translate:'生命誓言',
            description:'目标弃掉所有牌，并增加X点体力上限，然后体力恢复至体力上限，X取5和弃牌数的最小值',
        });
        builder.addCard('SurpassHumankind_yu',{
            fullskin:true,
            enable:true,
            vanish:true,
            type:"tale",
            filterTarget:function (card,player,target){
                return !target.isMin();
            },
            content:function (){
                target.gainMaxHp();
                target.addSkill('SurpassHumankind_yu_skill');
            },
            ai:{
                order:9,
                value:6,
                useful:2,
                result:1,
                tag:{
                    norepeat:1,
                },
            },
            selectTarget:1,
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_yu.png",
        },{
            translate:'玉髓',
            description:'目标增加一点体力上限，并获得技能【聚灵】',
        });
        builder.addCard('SurpassHumankind_yyy',{
            fullskin:true,
            enable:true,
            vanish:true,
            type:"tale",
            filterTarget:function (card,player,target){
                if(!target.isMin()&&game.zhu) return true
                if(player==target) return true
                return false
            },
            selectTarget:1,
            content:function (){
                player.bietianshen(target);
            },
            ai:{
                order:9,
                value:6,
                useful:2,
                result:1,
                tag:{
                    norepeat:1,
                },
            },
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_yyy.png",
        },{
            translate:'阴阳鱼',
            description:'目标身份变为友军并明示身份，并进行一次游戏结算判定',
        });
        builder.addCard('SurpassHumankind_MagicBook',{
            fullskin:true,
            enable:true,
            vanish:true,
            type:"tale",
            selectTarget:-1,
            filterTarget:function (card,player,target){
                return target==player;
            },
            modTarget:true,
            content:function (){
                player.addSkill('SurpassHumankind_mb_skill');
            },
            ai:{
                order:1,
                result:{
                    target:1,
                },
            },
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_MagicBook.png",
        },{
            translate:'魔术手札',
            description:'出牌阶段对自己使用，获得技能【手札】',
        });
    }
if(config.cure){
        builder.skill._cure_import_fa474d9dca={
            enable:"chooseToUse",
            filter:function (event,player){
                if(player!=game.me) return false;
                if(event.type!='dying') return false;
                return true;
            },
            filterTarget:function (card,player,target){
                return target==_status.event.dying;
            },
            selectTarget:-1,
            content:function(){
                if(player.hujia>0){
                    player.changeHujia(-1);
                }
                else{
                    if(player.hp>1){
                        player.loseHp()
                    }
                    else{
                        player.loseMaxHp()
                    }
                }
                target.recover();
            },
            ai:{
                order:10,
                save:true,
                result:{
                    target:3,
                },
                threaten:3,
            },
        }
    }
if(config.planet){
        builder.skill._planet_import_fa474d9dca={
            trigger:{
                player:"phaseBefore",
            },
            forced:true,
            locked:true,
            filter:function (event,player){
                if(player!=game.me) return false;
                return true;
            },
            content:function(){
                player.skip('phaseJudge');
                player.skip('phaseDiscard');
            },
        }
    }
if(config.prototype){
        builder.skill._prototype_import_fa474d9dca={
            trigger:{
                global:"dieAfter",
            },
            forced:true,
            unique:true,
            filter:function (event,player){
                if(player!=game.me) return false;
                return true;
            },
            content:function (){
                'step 0'
                player.gainMaxHp();
                player.recover(Math.min(3,trigger.player.maxHp));
                'step 1'
                var list=lib.character[trigger.player.name][3];
                if(list.length==0){event.finish();}
                else{event.list=list;}
                'step 2'
                var list=event.list;
                event.skillai=function(){
                    return get.max(list,get.skillRank,'item');
                };
                if(event.isMine()){
                    var dialog=ui.create.dialog('forcebutton');
                   dialog.add('选择获得一项技能');
                    var clickItem=function(){
                        _status.event._result=this.link;
                        dialog.close();
                        game.resume();
                    };
                    for(var i=0;i<list.length;i++){
                        if(lib.translate[list[i]+'_info']){
                            var translation=get.translation(list[i]);
                            if(translation[0]=='新'&&translation.length==3){
                                translation=translation.slice(1,3);
                            }
                            else{
                                translation=translation.slice(0,2);
                            }
                            var item=dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【'+translation+'】</div><div>'+lib.translate[list[i]+'_info']+'</div></div>');
                            item.firstChild.addEventListener('click',clickItem);
                            item.firstChild.link=list[i];
                        }
                    }
                    dialog.add(ui.create.div('.placeholder'));
                    event.switchToAuto=function(){
                        event._result=event.skillai();
                        dialog.close();
                        game.resume();
                    };
                    _status.imchoosing=true;
                    game.pause();
                }
                else{
                    event._result=event.skillai();
                }
                'step 3'
                _status.imchoosing=false;
                var link=result;
                player.addSkill(link);
                //
            },
            ai:{
                threaten:1.5,
            },
        }
    }
if(config.sakura){
        builder.skill._sakura_import_fa474d9dca={
            trigger:{
                player:"phaseBegin",
            },
            forced:true,
            locked:true,
            filter:function (event,player){
                return player==game.me;
            },
            content:function(){
                if(!player.getEquip('SurpassHumankind_cherry')){
                    player.useCard(game.createCard('SurpassHumankind_cherry'),player)
                }
            },
        }
        builder.addCard('SurpassHumankind_cherry',{
            fullskin:true,
            vanish:true,
            type:"equip",
            subtype:"equip1",
            onLose:function (){
                player.draw(2);
            },
            distance:{
                attackFrom:-3,
            },
            skills:["SurpassHumankind_cherry_skill","SurpassHumankind_cherry_mark"],
            enable:true,
            toself:true,
            filterTarget:function (card,player,target){
                return player==target;
            },
            selectTarget:-1,
            modTarget:true,
            content:function (){
                target.equip(card);
            },
            ai:{
                order:10,
                result:{
                    target:1,
                },
            },
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_cherry.png",
        },{
            translate:'红樱',
            description:'<span style="color:#B0171F">烙印着血的教诲</span>  <li>造成的伤害增加x/10，然后回复等量体力，获得等同于回复溢出值的护甲 ，x为累计造成伤害，均向上取整<li>不进入牌堆，且失去该装备后摸两张牌',
        });
    }
if(config.Gr){
        builder.skill._Gr_import_fa474d9dca={
            trigger:{
                player:"drawBegin",
            },
            forced:true,
            popup:false,
            filter:function (event,player){
                return player==game.me&&ui.cardPile.childElementCount>1;
            },
            content:function (){
                var value=get.value(ui.cardPile.firstChild);
                var num=Math.min(20,ui.cardPile.childElementCount);
                var list=[],list2=[];
                for(var i=1;i<num;i++){
                    var val=get.value(ui.cardPile.childNodes[i]);
                    if(val>value){
                        list.push(ui.cardPile.childNodes[i]);
                        if(val>value+1&&val>=8){
                            list2.push(ui.cardPile.childNodes[i]);
                        }
                    }
                }
                var card;
                if(list2.length){
                    card=list2.randomGet();
                }
                else if(list.length){
                    card=list.randomGet();
                }
                if(card){
                    ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
                }
            },
        }
    }
if(config.IN){
        builder.addCard('SurpassHumankind_in1',{
            fullskin:true,
            type:"basic",
            cardcolor:"red",
            toself:true,
            enable:true,
            selectTarget:-1,
            filterTarget:function (card,player,target){
                return target==player;
            },
            content:function(){
                target.together();
            },
            ai:{
                value:8,
                useful:[6,1],
                result:{
                    target:5,
                },
                order:0.6,
            },
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_in1.png",
        },{
            translate:'妹子泡面',
            description:'增加一名女性副将，若已有副将则改为摸三张牌',
            number:1,
        });
        builder.addCard('SurpassHumankind_in2',{
            fullskin:true,
            type:"basic",
            cardcolor:"red",
            toself:true,
            enable:true,
            selectTarget:-1,
            filterTarget:function (card,player,target){
                return target==player;
            },
            content:function(){
                target.together();
            },
            ai:{
                value:8,
                useful:[6,1],
                result:{
                    target:5,
                },
                order:0.6,
            },
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_in2.png",
        },{
            translate:'妹子泡面',
            description:'增加一名女性副将，若已有副将则改为摸三张牌',
            number:1,
        });
        builder.addCard('SurpassHumankind_in3',{
            fullskin:true,
            type:"basic",
            cardcolor:"red",
            toself:true,
            enable:true,
            selectTarget:-1,
            filterTarget:function (card,player,target){
                return target==player;
            },
            content:function(){
                target.together();
            },
            ai:{
                value:8,
                useful:[6,1],
                result:{
                    target:5,
                },
                order:0.6,
            },
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_in3.png",
        },{
            translate:'妹子泡面',
            description:'增加一名女性副将，若已有副将则改为摸三张牌',
            number:1,
        });
    }
if(config.undead){
        builder.addCard('SurpassHumankind_wulaiyuan',{
            fullskin:true,
            type:"mem",
            image:"ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_wulaiyuan.png",
        },{
            translate:'无来源',
            description:'此伤害没有来源卡牌',
        });
        builder.skill._undead_import_fa474d9dca={
            trigger:{
                player:["damageBefore","loseHpBefore"],
            },
            forced:true,
            priority:1,
            filter:function(event,player){
                if(player!=game.me) return false;
                game.log("event.name=",event.name);
                if(event.name=='damage'
                   &&event.num<player.hp+player.hujia) return false;
                if(event.name=='loseHp'
                   &&event.num<player.hp) return false;
                game.log("event.num=",event.num);
                if(!player.storage.SurpassHumankind_undead) player.storage.SurpassHumankind_undead=[];
                if(player.storage.SurpassHumankind_undead.length>11) return false;
                if(!event.card){
                    if(event.name=='loseHp') var c=game.createCard("du");
                    else var c=game.createCard("SurpassHumankind_wulaiyuan");
                }
                else{var c=game.createCard(event.card.name);}
                game.log("c=",c);
                for(var i=0;i<player.storage.SurpassHumankind_undead.length;i++){
                    if(player.storage.SurpassHumankind_undead[i].name==c.name) return false;
                }
                return true;
            },
            content:function(){
                'step 0'
                if(!trigger.card){
                    if(trigger.name=='loseHp') var c=game.createCard("du");
                    else var c=game.createCard("SurpassHumankind_wulaiyuan");
                }
                else{var c=game.createCard(trigger.card.name);}
                if(!player.storage.SurpassHumankind_undead) player.storage.SurpassHumankind_undead=[];
                player.storage.SurpassHumankind_undead.push(c);
                player.markSkill('SurpassHumankind_undead');
                'step 1'
                trigger.cancel();
                player.discard(player.getCards('hej'))._triggered=null;
                player.turnOver(false);
                player.link(false);
                player.recover(player.maxHp-player.hp);
                player.draw(player.maxHp);
                player.$skill('十二试炼','legend','metal');
                player.update();
            },
        };
        builder.skill._undead2_import_fa474d9dca={
            trigger:{
                player:["damageBefore","loseHpBefore"],
            },
            silent:true,
            priority:1,
            filter:function(event,player){
                if(player!=game.me) return false;
                if(!player.storage.SurpassHumankind_undead) return false;
                if(!event.card){
                    if(event.name=='loseHp') var c=game.createCard("du");
                    else var c=game.createCard("SurpassHumankind_wulaiyuan");
                }
                else{var c=event.card;}
                for(var i=0;i<player.storage.SurpassHumankind_undead.length;i++){
                    if(player.storage.SurpassHumankind_undead[i].name==c.name) return true;
                }
                return false;
            },
            content:function(){
                player.logSkill('_undead_import_fa474d9dca');
                trigger.num-=13-player.storage.SurpassHumankind_undead.length;
                trigger.num=trigger.num<0?0:trigger.num;
                trigger._triggered=null;
            },
        }
    }
if(config.prophet){
        builder.skill._prophet_import_fa474d9dca={
            trigger:{
                global:"judgeBefore",
                player:"drawBegin",
            },
            filter:function(event,player){
                return player==game.me
            },
            content:function (){
                "step 0"
                if(player.isUnderControl()){
                    game.modeSwapPlayer(player);
                }
                var num=Math.max(player.hp,game.countPlayer());
                var cards=get.cards(num);
                event.cards=cards;
                var switchToAuto=function(){
                    _status.imchoosing=false;
                    if(event.dialog) event.dialog.close();
                    if(event.control) event.control.close();
                    var top=[];
                    var judges=player.node.judges.childNodes;
                    var stopped=false;
                    if(!player.hasWuxie()){
                        for(var i=0;i<judges.length;i++){
                            var judge=get.judge(judges[i]);
                            cards.sort(function(a,b){
                                return judge(b)-judge(a);
                            });
                            if(judge(cards[0])<0){
                                stopped=true;break;
                            }
                            else{
                                top.unshift(cards.shift());
                            }
                        }
                    }
                    var bottom;
                    if(!stopped){
                        cards.sort(function(a,b){
                            return get.value(b,player)-get.value(a,player);
                        });
                        while(cards.length){
                            if(get.value(cards[0],player)<=5) break;
                            top.unshift(cards.shift());
                        }
                    }
                    bottom=cards;
                    for(var i=0;i<top.length;i++){
                        ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
                    }
                    for(i=0;i<bottom.length;i++){
                        ui.cardPile.appendChild(bottom[i]);
                    }
                    player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(bottom.length)+'下');
                    game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
                    game.delay(2);
                };
                var chooseButton=function(online,player,cards){
                    var event=_status.event;
                    player=player||event.player;
                    cards=cards||event.cards;
                    event.top=[];
                    event.bottom=[];
                    event.status=true;
                    event.dialog=ui.create.dialog('按顺序选择置于牌堆顶的牌（先选择的在上）',cards);
                    for(var i=0;i<event.dialog.buttons.length;i++){
                        event.dialog.buttons[i].classList.add('pointerdiv');
                    }
                    event.switchToAuto=function(){
                        event._result='ai';
                        event.dialog.close();
                        event.control.close();
                        _status.imchoosing=false;
                    },
                    event.control=ui.create.control('ok','pileTop','pileBottom',function(link){
                        var event=_status.event;
                        if(link=='ok'){
                            if(online){
                                event._result={
                                    top:[],
                                    bottom:[]
                                }
                                for(var i=0;i<event.top.length;i++){
                                    event._result.top.push(event.top[i].link);
                                }
                                for(var i=0;i<event.bottom.length;i++){
                                    event._result.bottom.push(event.bottom[i].link);
                                }
                            }
                            else{
                                var i;
                                for(i=0;i<event.top.length;i++){
                                    ui.cardPile.insertBefore(event.top[i].link,ui.cardPile.firstChild);
                                }
                                for(i=0;i<event.bottom.length;i++){
                                    ui.cardPile.appendChild(event.bottom[i].link);
                                }
                                for(i=0;i<event.dialog.buttons.length;i++){
                                    if(event.dialog.buttons[i].classList.contains('glow')==false&&
                                        event.dialog.buttons[i].classList.contains('target')==false)
                                    ui.cardPile.appendChild(event.dialog.buttons[i].link);
                                }
                                player.popup(get.cnNumber(event.top.length)+'上'+get.cnNumber(event.cards.length-event.top.length)+'下');
                                game.log(player,'将'+get.cnNumber(event.top.length)+'张牌置于牌堆顶');
                            }
                            event.dialog.close();
                            event.control.close();
                            game.resume();
                            _status.imchoosing=false;
                        }
                        else if(link=='pileTop'){
                            event.status=true;
                            event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆顶的牌';
                        }
                        else{
                            event.status=false;
                            event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆底的牌';
                        }
                    })
                    for(var i=0;i<event.dialog.buttons.length;i++){
                        event.dialog.buttons[i].classList.add('selectable');
                    }
                    event.custom.replace.button=function(link){
                        var event=_status.event;
                        if(link.classList.contains('target')){
                            link.classList.remove('target');
                            event.top.remove(link);
                        }
                        else if(link.classList.contains('glow')){
                            link.classList.remove('glow');
                            event.bottom.remove(link);
                        }
                        else if(event.status){
                            link.classList.add('target');
                            event.top.unshift(link);
                        }
                        else{
                            link.classList.add('glow');
                            event.bottom.push(link);
                        }
                    }
                    event.custom.replace.window=function(){
                        for(var i=0;i<_status.event.dialog.buttons.length;i++){
                            _status.event.dialog.buttons[i].classList.remove('target');
                            _status.event.dialog.buttons[i].classList.remove('glow');
                            _status.event.top.length=0;
                            _status.event.bottom.length=0;
                        }
                    }
                    game.pause();
                    game.countChoose();
                };
                event.switchToAuto=switchToAuto;

                if(event.isMine()){
                    chooseButton();
                    event.finish();
                }
                else if(event.isOnline()){
                    event.player.send(chooseButton,true,event.player,event.cards);
                    event.player.wait();
                    game.pause();
                }
                else{
                    event.switchToAuto();
                    event.finish();
                }
                "step 1"
                if(event.result=='ai'||!event.result){
                    event.switchToAuto();
                }
                else{
                    var top=event.result.top||[];
                    var bottom=event.result.bottom||[];
                    for(var i=0;i<top.length;i++){
                        ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
                    }
                    for(i=0;i<bottom.length;i++){
                        ui.cardPile.appendChild(bottom[i]);
                    }
                    for(i=0;i<event.cards.length;i++){
                        if(!top.contains(event.cards[i])&&!bottom.contains(event.cards[i])){
                            ui.cardPile.appendChild(event.cards[i]);
                        }
                    }
                    player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(event.cards.length-top.length)+'下');
                    game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
                    game.updateRoundNumber();
                    game.delay(2);
                }
            },
        }
    }
if(config.balance){
        builder.skill._balance_import_fa474d9dca={
            trigger:{
                player:["gainEnd","loseEnd"],
            },
            forced:true,
            filter:function(event,player){
                return player==game.me
            },
            content:function(){
                var cards=player.getCards('h');
                var heart=[];
                var diamond=[];
                var club=[];
                var spade=[];
                var that;
                for(var i=0;i<cards.length;i++){
                    if(get.suit(cards[i])=='heart'){
                        heart.push(cards[i]);
                    }
                    if(get.suit(cards[i])=='diamond'){
                        diamond.push(cards[i]);
                    }
                    if(get.suit(cards[i])=='club'){
                        club.push(cards[i]);
                    }
                    if(get.suit(cards[i])=='spade'){
                        spade.push(cards[i]);
                    }
                }
                if(heart.length!=1){
                    if(heart.length>1){
                        do{
                            that=heart.randomGet();
                            player.lose(that)._triggered=null;
                            heart.remove(that);
                        }while(heart.length!=1);
                    }
                    else{
                        that=get.cardPile2(function(card){
                            return get.suit(card)=='heart';
                        });
                        player.gain(that,'draw')._triggered=null;
                    }
                }
                if(diamond.length!=1){
                    if(diamond.length>1){
                        do{
                            that=diamond.randomGet();
                            player.lose(that)._triggered=null;
                            diamond.remove(that);
                        }while(diamond.length!=1);
                    }
                    else{
                        that=get.cardPile2(function(card){
                            return get.suit(card)=='diamond';
                        });
                        player.gain(that,'draw')._triggered=null;
                    }
                }
                if(club.length!=1){
                    if(club.length>1){
                        do{
                            that=club.randomGet();
                            player.lose(that)._triggered=null;
                            club.remove(that);
                        }while(club.length!=1);
                    }
                    else{
                        that=get.cardPile2(function(card){
                            return get.suit(card)=='club';
                        });
                        player.gain(that,'draw')._triggered=null;
                    }
                }
                if(spade.length!=1){
                    if(spade.length>1){
                        do{
                            that=spade.randomGet();
                            player.lose(that)._triggered=null;
                            spade.remove(that);
                        }while(spade.length!=1);
                    }
                    else{
                        that=get.cardPile2(function(card){
                            return get.suit(card)=='spade';
                        });
                        player.gain(that,'draw')._triggered=null;
                    }
                }
            },
        }
    }
if(config.GoldFinger){
        builder.skill._GoldFinger_import_fa474d9dca={
            enable: "phaseUse",
            filter:function(event,player){
                var ts=game.findPlayer(function(current){
                    return current!=player&&!current.getStat().card.xianshu&&current.countCards('hej')>0;
                });
                if(!ts) return false;
                return player==game.me;
            },
            filterTarget: function(card, player, target) {
                if (player == target) return false;
                if(target.getStat().card.xianshu) return false;
                return target.countCards('hej')>0;
            },
            selectTarget: 1,
            content: function() {
                'step 0'
                target.getStat().card.xianshu=1;
                event.type=['basic','trick','equip','food','jiguan'].randomGet();
                player.chooseCardButton(1, target.getCards('hej'), true);
                'step 1'
                if (result.bool) {
                    event.card = result.links[0];
                    target.$give(event.card, player);
                    player.gain(event.card, target)
                }
                event.card.storage.xs=event.card.name;
                'step 2'
                var list0 = get.typeCard(event.type);
                var list=[];
                var temp;
                for(var j=0;j<list0.length;j++){
                    temp=list0.randomGet();
                    list0.remove(temp);
                    if (game.findPlayer(function(target) {
                        return player.canUse(temp, target)
                    })){
                        list.push(temp);
                    }
                    if(list.length>2) break;
                }
                var dialog = ui.create.dialog('选择一张'+get.translation(event.type)+'牌', [list, 'vcard'], 'hidden');
                player.chooseButton(dialog, true).set('ai',function(button) {
                    var card = {
                        name: button.link[2]
                    };
                    var value = get.value(card);
                    return value;
                });
                'step 3'
                if (result.bool) {
                    if(lib.card[result.buttons[0].link[2]].type=='equip'){
                        lib.card['xianshu_'+result.buttons[0].link[2]]=lib.card[result.buttons[0].link[2]];
                        lib.card['xianshu_'+result.buttons[0].link[2]].image='ext:卡牌扩展/members/import_fa474d9dca/SurpassHumankind_wulaiyuan.png';
                        
            lib.card['xianshu_'+result.buttons[0].link[2]].fullskin=true;
                        lib.translate['xianshu_'+result.buttons[0].link[2]]=lib.translate[result.buttons[0].link[2]];
                        lib.translate['xianshu_'+result.buttons[0].link[2]+'_info']=lib.translate[result.buttons[0].link[2]+'_info'];
                        lib.card['xianshu_'+result.buttons[0].link[2]]['onLose']=function(){
                            event.card.init(game.createCard(event.card.storage.xs,event.card.suit,event.card.number,event.card.nature));
                        }
                        event.card.init(game.createCard('xianshu_'+result.buttons[0].link[2],event.card.suit,event.card.number,event.card.nature));
                    }
                    else{
                        event.card.init(game.createCard(result.buttons[0].link[2],event.card.suit,event.card.number,event.card.nature));
                    }
                }
                'step 4'
                player.chooseUseTarget(true,event.card);
                'step 5'
                if(get.type(event.card,'trick')!='equip'){
                    event.card.init(game.createCard(event.card.storage.xs,get.suit(event.card),event.card.number,event.card.nature));
                }
            },
        }
    }
if(config.sort){
        builder.skill._sort_import_fa474d9dca={
            trigger:{
                player:"gainEnd",
            },
            forced:true,
            silent:true,
            firstDo:true,
            filter:function(event,player){
                if(player==game.me) player.sortCard();
                return;
            },
        }
    }
if(config.DaqiaoDiss){
        builder.skill._DaqiaoDiss_import_fa474d9dca={
            trigger:{
                player:"judgeBegin",
            },
            forced:true,
            filter:function(event,player){
                return player==game.me&&event.card
            },
            content:function(){
                'step 0'
                player.chooseTarget([1,Infinity],function(card,player,target){
                    return target!=player
                },false);
                'step 1'
                if(result.bool){
                    var targets=result.targets;
                    player.line(targets);
                    var a=trigger.card.name;
                    var b=get.suit(trigger.card);
                    var c=trigger.card.number;
                    var d=trigger.card.nature;
                    while(targets.length){
                        var fake=game.createCard(a,b,c,d);
                        targets.shift().addJudge(fake);
                    }
                    trigger.cancel();
                    trigger.card.remove();
                }
            },
        };
    }
;
if(config.qunouDiss){
        builder.skill._qunouDiss_import_fa474d9dca={
            trigger:{
                player:["drawBegin","recoverBegin"],
                source:"damageBegin",
            },
            silent:true,
            filter:function(event,player){
                return player==game.me
            },
            content:function(){
                var f=game.countPlayer(function(target){
                    return get.attitude(target,player)>0;
                });
                var e=game.countPlayer(function(target){
                    return get.attitude(target,player)<0;
                });
                if(f<e){
                    trigger.num+=e-f;
                    player.logSkill('_qunouDiss_import_fa474d9dca');
                }
            },
        };
    }
;
} };
}
