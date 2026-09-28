// Generated from 卡牌扩展.zip/(卡牌)祈愿_娱乐向.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            "tale_kongtou":{
                fullskin:true,
                enable:true,
                vanish:true,
                type:"tale",
                filterTarget:function (card,player,target){
        return !target.isMin();
    },
                content:function (){
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip1';
        }).remove('gw_dieyi_equip1','feichu_equip1').randomGet()));
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip2';
        }).remove('gw_dieyi_equip2','feichu_equip2').randomGet()));
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip3';
        }).remove('gw_dieyi_equip3','feichu_equip3').randomGet()));
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip4';
        }).remove('gw_dieyi_equip4','feichu_equip4').randomGet()));
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip5';
        }).remove('gw_dieyi_equip5','feichu_equip5').randomGet()));
        target.draw(Math.max(0,target.maxHp-target.countCards('h')));
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
            },
            "tale_MagicBook":{
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
        player.addSkill('tale_mb_skill');
    },
                ai:{
                    order:1,
                    result:{
                        target:1,
                    },
                },
            },
            "tale_yyy":{
                fullskin:true,
                enable:true,
                vanish:true,
                type:"tale",
                filterTarget:function (card,player,target){
        return !target.isMin()&&game.zhu;
    },
                content:function (){
        'step 0'
        if(target.identity=='zhong'){
            target.identity='fan';
            target.setIdentity('fan');
        }
        else{
            if(target.identity=='fan'){
                target.identity='zhong';
                target.setIdentity('zhong');
            }
            else{
                if(target.identity=='zhu'){
                    target.identity='nei';
                    target.setIdentity('nei');
                }
                else{
                    game.zhu.identity='nei';
                    game.zhu.setIdentity('nei');
                    target.identity='zhu';
                    target.setIdentity('zhu');
                }
            }
        }
        target.identityShown=true;
        'step 1'
        if(_status.brawl&&_status.brawl.checkResult){
            _status.brawl.checkResult();
            return;
        }
        if(!game.zhu){
            if(get.population('fan')==0){
                switch(game.me.identity){
                    case 'fan':game.over(false);break;
                    case 'zhong':game.over(true);break;
                    default:game.over();break;
                }
            }
            else if(get.population('zhong')==0){
                switch(game.me.identity){
                    case 'fan':game.over(true);break;
                    case 'zhong':game.over(false);break;
                    default:game.over();break;
                }
            }
            return;
        }
        if(game.zhu.isAlive()&&get.population('fan')+get.population('nei')>0) return;
        if(game.zhong){
            game.zhong.identity='zhong';
        }
        game.showIdentity();
        if(game.me.identity=='zhu'||game.me.identity=='zhong'){
            if(game.zhu.classList.contains('dead')){
                game.over(false);
            }
            else{
                game.over(true);
            }
        }
        else if(game.me.identity=='nei'){
            if(game.players.length==1&&game.me.isAlive()){
                game.over(true);
            }
            else{
                game.over(false);
            }
        }
        else{
            if((get.population('fan')+get.population('zhong')>0||get.population('nei')>1)&&game.zhu.classList.contains('dead')){
                    game.over(true);
            }
            else{
                game.over(false);
            }
        }
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
                image:"ext:许愿/tale_kongtou.png",
            },
            "tale_yu":{
                fullskin:true,
                enable:true,
                vanish:true,
                type:"tale",
                filterTarget:function (card,player,target){
        return !target.isMin();
    },
                content:function (){
        target.gainMaxHp(2);
        target.addSkill('tale_yu_skill');
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
            },
            "tale_fsr":{
                enable:true,
                vanish:true,
                type:"tale",
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                content:function (){
        target.addSkill('tale_fsr_skill');
        target.storage.hp=target.hp;
        target.storage.maxHp=target.maxHp;
        target.storage.h=target.getCards('h');
        target.storage.e=target.getCards('e');
        target.storage.j=target.getCards('j');
    },
                ai:{
                    order:1,
                    result:{
                        target:1,
                    },
                },
                fullimage:true,
            },
            "tale_zhengjiu":{
                enable:true,
                vanish:true,
                type:"tale",
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                content:function (){
        var target=player;
        var layer=0;
        //player.say('target='+get.translation(target.name));
        do{
            if(target.identity==player.identity&&player.identity!='nei'){
                layer=1;
            }
            if(target.identity=='zhong'&&player.identity=='zhu'){
                layer=1;
            }
            if(target.isDead()&&layer==1){
                target.revive(target.maxHp);
                target.draw(4);
                target.update();
            }
            layer=0;
            target=target.previousSeat;
            game.delay(0.5);
        }while(target!=player);
    },
                ai:{
                    order:1,
                    result:{
                        target:1,
                    },
                },
                fullimage:true,
            },
            "tale_life":{
                fullskin:true,
                enable:true,
                vanish:true,
                type:"tale",
                filterTarget:function (card,player,target){
        return !target.isMin();
    },
                content:function (){
        var cards=target.getCards('hej');
        if(cards.length){
            target.lose(cards)._triggered=null;
        }
        target.gainMaxHp(cards.length);
        target.recover(cards.length+target.maxHp);
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
            },
            "tale_wuse":{
                type:"basic",
                toself:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player&&card.storage.skill;
    },
                content:function (){
        target.addSkill(card.storage.skill);
        //target.say(get.translation(card.storage.skill));
    },
                ai:{
                    basic:{
                        order:10,
                        useful:10,
                        value:10,
                    },
                    result:{
                        target:1,
                    },
                },
                fullskin:true,
            },
        },
        translate:{
            "tale_kongtou":"空投",
            "tale_kongtou_info":"目标随机装备5张不同的装备牌，然后将手牌补充到体力上限",
            "tale_MagicBook":"魔术手札",
            "tale_MagicBook_info":"出牌阶段对自己使用，获得技能[刻印]",
            "tale_yyy":"阴阳鱼",
            "tale_yyy_info":"目标逆转并明示身份",
            "tale_yu":"玉髓",
            "tale_yu_info":"目标增加2点体力上限，并获得技能\"聚灵\"</br><b>聚灵：</b>摸牌数+2，每回合开始时回复一点体力",
            "tale_fsr":"浮生若茶",
            "tale_fsr_info":"夫天地者，万物之逆旅也；光阴者，百代之过客也。而浮生若梦，为欢几何</br><b>梦醒：</b>选择使用，人物体力、体力上限、手牌、装备牌、判定区均恢复到使用\"浮生若茶\"前的情况",
            "tale_zhengjiu":"拯救",
            "tale_zhengjiu_info":"出牌阶段对自己使用，令所有同阵营的死亡角色复活，并摸四张牌",
            "tale_life":"生命誓言",
            "tale_life_info":"目标弃掉所有牌，并增加等于弃牌数的体力上限，然后体力恢复至体力上限",
            "tale_wuse":"无色晶体",
            "tale_wuse_info":"完全不知道有什么用Õ_Õ",
        },
        list:[],
    });
builder.addPack({
        skill:{
            "tale_yu_skill":{
                trigger:{
                    player:"phaseDrawBegin2",
                },
                frequent:true,
                content:function (){
        player.recover();
        trigger.num+=2;
    },
            },
            "tale_fsr_skill":{
                enable:"chooseToUse",
                locked:true,
                content:function (){
        var cards=player.getCards('hej');
        if(cards.length){
            player.lose(cards)._triggered=null;
        }
        player.hp=player.storage.hp;
        player.maxHp=player.storage.maxHp;
        player.directgain(player.storage.h);
        for(var i=0;i<player.storage.e.length;i++){
            player.equip(game.createCard(player.storage.e[i]))
        }
        for(i=0;i<player.storage.j.length;i++){
            player.useCard(game.createCard(player.storage.j[i]),player)
        }
        player.removeSkill('tale_fsr_skill');
        player.update();
    },
            },
            soul:{
                mark:true,
                marktext:"魂",
                intro:{
                    name:"<span style=\"color:#B22222\">荣耀之魂",
                    content:function (storage){
            return '<b>您拥有的魂心数：</b>'+storage+'</br>——血液是灵魂的货币';
        },
                },
            },
            "tale_mb_skill":{
                trigger:{
                    global:"useSkillEnd",
                },
                filter:function (event,player){
        return player.countCards('h')>0
    },
                mark:true,
                intro:{
                    content:"知识就是力量，法国就是培根",
                },
                content:function (){
        var card=player.getCards('h').randomGet();
        card.init([card.suit,card.number,'tale_wuse']);
        card.storage.skill=trigger.skill;
        card.node.name.innerHTML=get.translation(trigger.skill);
    },
            },
        },
        translate:{
            "tale_yu_skill":"聚灵",
            "tale_yu_skill_info":"摸牌数+2，每回合开始时回复一点体力",
            "tale_fsr_skill":"梦醒",
            "tale_fsr_skill_info":"选择使用，人物体力、体力上限、手牌、装备牌、判定区均恢复到使用\"浮生若茶\"前的情况",
            soul:"荣耀之魂",
            "soul_info":"血液是灵魂的货币",
            "tale_mb_skill":"刻印",
            "tale_mb_skill_info":"当场上有角色使用主动技能时，若你的手牌数不为零，则你可以随机令一张手牌转化为该技能",
        },
    });
builder.translate.tale='传说';
builder.translate._xianji_import_c8b8f5fc7d='献祭';
builder.translate._zhaohuan_import_c8b8f5fc7d='祈愿';
builder.translate._shilian_import_c8b8f5fc7d='十连';
builder.skill._xianji_import_c8b8f5fc7d={
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
            if(!player.storage.soul||!player.storage.jilv){
                player.storage.soul=0;
                player.markSkill('soul');
                player.storage.jilv=0.4;
            }
            player.storage.soul++;
            player.markSkill('soul');
        },
        group:"_xianji_import_c8b8f5fc7d_gz",
        subSkill:{
            gz:{
                silent:true,
                trigger:{
                    player:"phaseBegin",
                },
                popup:false,
                forced:true,
                filter:function(event,player){
                    return player==game.me
                },
                content:function(){
                    if(!player.storage.soul||!player.storage.jilv){
                        player.storage.soul=0;
                        player.markSkill('soul');
                        player.storage.jilv=0.4;
                    }
                    player.storage.soul++;
                    player.markSkill('soul');
                },
                sub:true,
            },
        },
    }
builder.skill._zhaohuan_import_c8b8f5fc7d={
        enable:"phaseUse",
        filter:function(event,player){
            if(player==game.me&&player.storage.soul>0) return true;
            return false;
        },
        content:function(){
            player.storage.soul--;
            if(Math.random()>player.storage.jilv){
                player.gain(game.createCard(get.typeCard('basic').remove('du').randomGet()),'gain2');
            }
            else{
                if(Math.random()>player.storage.jilv){
                    game.playAudio('..','extension','卡牌扩展/members/import_c8b8f5fc7d','稀有'); 
                    game.me.$fullscreenpop('<span style="color:#1688F2">稀有!</span>','thunder');
                    if(Math.random()>0.6){
                        player.gain(game.createCard(get.typeCard('equip').randomGet()),'gain2');
                    }
                    else{
                        player.gain(game.createCard(get.typeCard('trick').randomGet()),'gain2');
                    }
                }
                else{
                    if(Math.random()>player.storage.jilv){
                        game.playAudio('..','extension','卡牌扩展/members/import_c8b8f5fc7d','史诗'); 
                        game.me.$fullscreenpop('<span style="color:#C67ADE">史诗!</span>','thunder');
                        player.gain(game.createCard(get.typeCard('spell').randomGet()),'gain2');
                    }
                    else{
                        game.playAudio('..','extension','卡牌扩展/members/import_c8b8f5fc7d','传说'); 
                        game.me.$fullscreenpop('<span style="color:#FFDF56">哇！传说!</span>','fire');
                        player.gain(game.createCard(get.typeCard('tale').randomGet()),'gain2');
                    }
                }
            }
        },
    }
builder.skill._shilian_import_c8b8f5fc7d={
        enable:"phaseUse",
        filter:function(event,player){
            if(player==game.me&&player.storage.soul>9) return true;
            return false;
        },
        content:function(){
            'step 0'
            player.storage.jilv=0.6;
            player.storage.soul-=10;
            player.storage.round=10;
            'step 1'
            if(Math.random()>player.storage.jilv){
                player.gain(game.createCard(get.typeCard('basic').remove('du').randomGet()),'gain2');
            }
            else{
                if(Math.random()>player.storage.jilv){
                    game.playAudio('..','extension','卡牌扩展/members/import_c8b8f5fc7d','稀有'); 
                    game.me.$fullscreenpop('<span style="color:#1688F2">稀有!</span>','thunder');
                    if(Math.random()>0.6){
                        player.gain(game.createCard(get.typeCard('equip').randomGet()),'gain2');
                }
                    else{
                        player.gain(game.createCard(get.typeCard('trick').randomGet()),'gain2');
                    }
                }
                else{
                    if(Math.random()>player.storage.jilv){
                        game.playAudio('..','extension','卡牌扩展/members/import_c8b8f5fc7d','史诗'); 
                        game.me.$fullscreenpop('<span style="color:#C67ADE">史诗!</span>','thunder');
                        player.gain(game.createCard(get.typeCard('spell').randomGet()),'gain2');
                    }
                    else{
                        game.playAudio('..','extension','卡牌扩展/members/import_c8b8f5fc7d','传说'); 
                        game.me.$fullscreenpop('<span style="color:#FFDF56">哇！传说!</span>','fire');
                        player.gain(game.createCard(get.typeCard('tale').randomGet()),'gain2');
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
            player.storage.jilv=0.4;
        },
    }
} };
}
