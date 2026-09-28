// Generated from 卡牌扩展.zip/(卡牌)许愿_娱乐向_抽奖_纯卡牌&技能.zip; registration and configuration live in cardPackRuntime.js.
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
        }).randomGet()));
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip2';
        }).randomGet()));
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip3';
        }).randomGet()));
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip4';
        }).randomGet()));
        target.equip(game.createCard(get.libCard(function(info){
            return info.subtype=='equip5';
        }).randomGet()));
        target.draw(Math.max(0,target.maxHp-target.countCards('h')))
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
        var skill=get.gainableSkills();
        skill.remove(target.getSkills());
        skill=skill.randomGet();
        target.addSkill(skill,true);
        target.popup(skill);
        game.log(target,'获得了技能','【'+get.translation(skill)+'】')
        game.delay;
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
        return !target.isMin();
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
                image:"ext:卡牌扩展/members/import_623834a3b5/tale_kongtou.png",
            },
            "tale_xuerou":{
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
        },
        translate:{
            "tale_kongtou":"空投",
            "tale_kongtou_info":"目标随机装备5张不同的装备牌，然后将手牌补充到体力上限",
            "tale_MagicBook":"魔术手札",
            "tale_MagicBook_info":"出牌阶段对自己使用，随机获得一个技能",
            "tale_yyy":"阴阳鱼",
            "tale_yyy_info":"目标逆转并明示身份",
            "tale_xuerou":"血肉结晶",
            "tale_xuerou_info":"目标弃掉所有牌，并增加等于弃牌数的体力上限，然后体力恢复至体力上限",
            "tale_yu":"玉髓",
            "tale_yu_info":"目标增加2点体力上限，并获得技能\"聚灵\"</br><b>聚灵：</b>摸牌数+2，每回合开始时回复一点体力",
            "tale_fsr":"浮生若茶",
            "tale_fsr_info":"夫天地者，万物之逆旅也；光阴者，百代之过客也。而浮生若梦，为欢几何</br><b>梦醒：</b>选择使用，人物体力、体力上限、手牌、装备牌、判定区均恢复到使用\"浮生若茶\"前的情况",
            "tale_zhengjiu":"拯救",
            "tale_zhengjiu_info":"出牌阶段对自己使用，令所有同阵营的死亡角色复活，并摸四张牌",
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
        },
        translate:{
            "tale_yu_skill":"聚灵",
            "tale_yu_skill_info":"摸牌数+2，每回合开始时回复一点体力",
            "tale_fsr_skill":"梦醒",
            "tale_fsr_skill_info":"选择使用，人物体力、体力上限、手牌、装备牌、判定区均恢复到使用\"浮生若茶\"前的情况",
        },
    });
builder.translate.tale='传说';
builder.translate._wish_import_623834a3b5='许愿';
builder.skill._wish_import_623834a3b5={
        enable:"phaseUse",
        round:1,
        filter:function(event,player){
            if(player!=game.me) return false;
            return true;
        },
        content:function(){
            'step 0'
            player.storage.round=game.roundNumber%10==0?9:0;
            player.storage.chance=30+Math.min(40,game.roundNumber*2);
            player.storage.chance=player.storage.chance/100;
            'step 1'
            if(Math.random()>player.storage.chance){
                player.gain(game.createCard(get.typeCard('basic').randomGet()),'gain2');
            }
            else{
                if(Math.random()>player.storage.chance){
                    game.playAudio('..','extension','卡牌扩展/members/import_623834a3b5','稀有'); 
                    game.me.$fullscreenpop('<span style="color:#1688F2">稀有!</span>','thunder');
                    if(Math.random()>0.6){
                        player.gain(game.createCard(get.typeCard('equip').randomGet()),'gain2');
                    }
                    else{
                        player.gain(game.createCard(get.typeCard('trick').randomGet()),'gain2');
                    }
                }
                else{
                    if(Math.random()>player.storage.chance){
                        game.playAudio('..','extension','卡牌扩展/members/import_623834a3b5','史诗'); 
                        game.me.$fullscreenpop('<span style="color:#C67ADE">史诗!</span>','thunder');
                        player.gain(game.createCard(get.typeCard('spell').randomGet()),'gain2');
                    }
                    else{
                        game.playAudio('..','extension','卡牌扩展/members/import_623834a3b5','传说'); 
                        game.me.$fullscreenpop('<span style="color:#FFDF56">哇！传说!</span>','fire');
                        player.gain(game.createCard(get.typeCard('tale').randomGet()),'gain2');
                    }
                }
            }
            'step 2'
            if(player.storage.round!=0){
                player.storage.round--;
                game.delay(0.5);
                event.goto(1);
            }
        },
    };
} };
}
