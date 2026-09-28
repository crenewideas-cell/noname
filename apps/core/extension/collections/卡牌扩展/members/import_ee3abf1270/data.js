// Generated from 阵面对决.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            "zhen_fanjianzhishu":{
                audio:true,
                enable:function(){
        return game.countPlayer()>2;
    },
                chongzhu:function(){
        return game.countPlayer()<=2;
    },
                singleCard:true,
                type:"trick",
                selectTarget:2,
                complexTarget:true,
                multitarget:true,
                targetprompt:["拿牌","出杀"],
                filterTarget:function(card,player,target){
        if(target==player) return false;
        if(ui.selected.targets.length==1){
            if(!target.countGainableCards(ui.selected.targets[0],'he')) return false;
            return target.canUse({name:'sha'},ui.selected.targets[0]);
        }
        return true;
    },
                content:function(){
        'step 0'
        event.target1=target;
        event.target2=event.addedTarget;
        'step 1'
        event.target1.gainPlayerCard('he',event.target2,true);
        'step 2'
        event.target2.useCard({name:'sha'},false,event.target1);
    },
                ai:{
                    order:2.5,
                    value:[4,1],
                    useful:1,
                    wuxie:function(){
            return 0;
        },
                    result:{
                        target:function(player,target){
                var att=get.attitude(player,target);
                if(ui.selected.targets.length==0){
                    return att>0?-2:-1;
                }
                else{
                    return get.effect(target,{name:'sha'},ui.selected.targets[0],target);
                }
            },
                    },
                },
                fullimage:true,
            },
            "zhen_jiejingzhou":{
                audio:true,
                type:"trick",
                enable:true,
                selectTarget:1,
                filterTarget:function(card,player,target){
        if(player==target) return false;
        return target.countGainableCards(player,'e')>0;
    },
                content:function(){
        if(target.countGainableCards(player,'e')){
            player.gainPlayerCard('e',target,true);
        }
    },
                ai:{
                    order:7,
                    value:4,
                    useful:2,
                    result:{
                        target:function(player,target){
                if(target.getEquip('baiyin')&&target.isDamaged()&&get.recoverEffect(target,player,player)>0){
                    if(target.hp==1&&!target.hujia) return 1.6;
                    if(target.hp==2) return 0.01;
                    return 0;
                }
                return -1.5;
            },
                    },
                    tag:{
                        loseCard:1,
                    },
                },
                fullimage:true,
            },
            "zhen_liejiasuo":{
                audio:true,
                type:"trick",
                enable:true,
                selectTarget:1,
                filterTarget:function(card,player,target){
        if(player==target) return false;
        if(!target.getEquip(2)&&target.isLinked()) return false;
        return true;
    },
                content:function(){
        if(target.getEquip(2)&&!target.hasSkill('fangjushixiao_fang')){
            target.addTempSkill('fangjushixiao_fang',{player:"phaseBefore"});
            for(var i=0;i<game.players.length;i++){
                if(game.players[i]!=target&&!game.players[i].hasSkill('fangjushixiao_equip')){
                    game.players[i].addSkill('fangjushixiao_equip');
                }
            }
        }else{
            target.link(true);
        }
    },
                ai:{
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    result:{
                        target:function(player,target){
                if(!target.getEquip(2)&&target.isLinked()) return 0;
                return -1.5;
            },
                    },
                },
                fullimage:true,
            },
            "zhen_bazhenyanwu":{
                audio:true,
                type:"trick",
                enable:true,
                filterTarget:function(card,player,target){
        return !target.hasSkill('zhen_bazhenyanwu_skill');
    },
                selectTarget:1,
                content:function(){
        target.$gain2(cards);
        target.storage.zhen_bazhenyanwu_skill=card;
        target.storage.zhen_bazhenyanwu_skill_markcount=2;
        target.addSkill('zhen_bazhenyanwu_skill');
    },
                ai:{
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    result:{
                        target:1,
                    },
                },
                fullimage:true,
            },
            "zhen_bamenjinsuo":{
                fullimage:true,
                audio:true,
                type:"trick",
                enable:true,
                filterTarget:function(card,player,target){
        return target!=player&&!target.hasSkill('zhen_bamenjinsuo_skill');
    },
                selectTarget:1,
                content:function(){
        target.addTempSkill("zhen_bamenjinsuo_skill",{player:'phaseAfter'});
    },
                ai:{
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    result:{
                        target:-1,
                    },
                },
            },
            "zhen_anduchencang":{
                fullimage:true,
                audio:true,
                type:"trick",
                enable:true,
                filterTarget:function(card,player,target){
        return target!=player&&!target.hasSkill('zhen_anduchencang_skill_to');
    },
                selectTarget:1,
                content:function(){
        player.draw();
        player.addTempSkill("zhen_anduchencang_skill_go");
        target.storage.zhen_anduchencang_skill_to=player;
        target.addTempSkill("zhen_anduchencang_skill_to");
    },
                ai:{
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    tag:{
                        draw:1,
                    },
                    result:{
                        player:function(player,target){
                if(get.distance(player,target)<=1&&game.hasPlayer(function(current){
                    return get.distance(player,current)>1;
                })) return 0;
                var hs=player.getCards('h','shunshou');
                if(hs.length&&player.canUse(hs[0],target,false)){
                    return 1;
                }
                var geteff=function(current){
                    return player.canUse('sha',current,false,true)&&get.effect(current,{name:'sha'},player,player)>0;
                }
                if(player.hasSha()&&geteff(target)){
                    var num=game.countPlayer(function(current){
                        return current!=player&&get.distance(player,current)<=1&&geteff(current);
                    });
                    if(num==0){
                        if(game.hasPlayer(function(current){
                            return player.canUse('sha',current)&&geteff(current)&&current!=target;
                        })){
                            return 1;
                        }
                    }
                    else if(num==1){
                        return 1;
                    }
                }
                return 1;
            },
                    },
                },
            },
            "zhen_huntianshengyi":{
                audio:true,
                type:"equip",
                subtype:"equip5",
                skills:["zhen_huntianshengyi_skill"],
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    return equipValue(card,player)-value;
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "zhen_tongguiyujin":{
                fullimage:true,
                audio:true,
                type:"trick",
                enable:true,
                selectTarget:1,
                filterTarget:function(card,player,target){
        return player!=target;
    },
                content:function(){
        'step 0'
        target.damage('nocard',player);
        'step 1'
        game.delay();
        if(target.isAlive()){
            target.line(player);
            player.damage('nocard',target);
        }else{
            player.damage('nocard','nosource');
        }  
    },
                ai:{
                    order:7,
                    value:4,
                    useful:2,
                    result:{
                        target:function(player,target){
                if(player.hp<2) return 0;
                if(target.hp>=player.hp) return 0;
                return -1;
            },
                    },
                    tag:{
                        damage:1,
                    },
                },
            },
            "zhen_yunliangche":{
                type:"equip",
                subtype:"equip5",
                onLose:function(){
        if((event.getParent(2)&&event.getParent(2).name!='swapEquip')&&event.parent.type!='equip'
           &&player.countCards('he')){
            player.logSkill('zhen_yunliangche_skill_die');
            player.chooseToDiscard(true,'he');  
        }       
    },
                filterLose:function(card,player){
        return 
    },
                clearLose:true,
                equipDelay:false,
                loseDelay:false,
                skills:["zhen_yunliangche_skill"],
                ai:{
                    equipValue:7.5,
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    return equipValue(card,player)-value;
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "zhen_weiya":{
                audio:true,
                type:"trick",
                enable:true,
                filterTarget:function(card,player,target){
        return player==target&&!player.hasSkill('zhen_weiya_skill');
    },
                selectTarget:-1,
                content:function(){
        target.addTempSkill('zhen_weiya_skill',{player:'phaseBefore'});
    },
                ai:{
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    result:{
                        player:1,
                    },
                },
                fullimage:true,
            },
            "zhen_xiepo":{
                fullimage:true,
                audio:true,
                type:"trick",
                enable:true,
                selectTarget:1,
                filterTarget:function(card,player,target){
        return player!=target;
    },
                content:function(){
        'step 0'
        var hs=target.countCards('he');
        if(hs<2){
            target.damage();
            event.finish();
            return;
        }else{
            target.chooseControlList(['交出两张卡牌','受到一点伤害'],true).set('ai',function(event,player){
                if(player.hp==player.maxHp) return 1;
                return 0;
            });
        }
        'step 1'
        if(result.index==1){
            target.damage();
            event.finish();
            return;
        }else{
            target.chooseCard('he',2,true);
        }
        'step 2'
        if(result.cards){
            player.gain(result.cards,target,'giveAuto');
        }
    },
                ai:{
                    order:7,
                    value:4,
                    useful:2,
                    result:{
                        target:function(player,target){
                return -1.5;
            },
                    },
                    tag:{
                        damage:1,
                    },
                },
            },
            "zhen_xiadu":{
                fullimage:true,
                audio:true,
                type:"trick",
                enable:true,
                selectTarget:1,
                filterTarget:function(card,player,target){
        return player!=target;
    },
                content:function(){
        if(Math.random()<4/5){
            if(target.countCards('he')){
                target.randomDiscard();
            }else{
                game.log('但是',target,'没有牌可弃了...')
            }
        }
        if(Math.random()<4/5) target.loseHp();
    },
                ai:{
                    jueqing:true,
                    order:7,
                    value:4,
                    useful:2,
                    result:{
                        target:function(player,target){
                return -2;
            },
                    },
                    tag:{
                        damage:1,
                    },
                },
            },
            "zhen_qingnangshucanye":{
                audio:true,
                type:"equip",
                subtype:"equip5",
                skills:["zhen_qingnangshucanye_skill"],
                ai:{
                    equipValue:7,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:7,
                        value:function(card,player,index,method){
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    return equipValue(card,player)-value;
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "zhen_biyuejing":{
                type:"equip",
                subtype:"equip2",
                ai:{
                    basic:{
                        equipValue:function(card,player){
                if(player&&player.sex=='female'){
                    return 7.5;
                }
                else{
                    return 0;
                }
            },
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    return equipValue(card,player)-value;
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["zhen_biyuejing_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "zhen_dingxinwan":{
                audio:true,
                type:"basic",
                enable:true,
                filterTarget:function(card,player,target){
        return !target.hasSkill('zhen_dingxinwan_skill');
    },
                selectTarget:1,
                content:function(){
        target.addSkill('zhen_dingxinwan_skill');
    },
                ai:{
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    result:{
                        target:function(player,target){
                if(target.isDamaged()) return 2;
                return 1;
            },
                    },
                },
                fullimage:true,
            },
            "zhen_huxinjing":{
                type:"equip",
                subtype:"equip2",
                skills:["zhen_huxinjing_skill"],
                ai:{
                    basic:{
                        equipValue:6,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    return equipValue(card,player)-value;
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "zhen_baodiaogong":{
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-4,
                },
                ai:{
                    basic:{
                        equipValue:3,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    return equipValue(card,player)-value;
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["zhen_baodiaogong_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "zhen_huansuokai":{
                type:"equip",
                subtype:"equip2",
                onEquip:function(){
        if(player.isLinked()) player.link(false);
    },
                equipDelay:false,
                loseDelay:false,
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    return equipValue(card,player)-value;
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["zhen_huansuokai_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "zhen_yitianjian":{
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-2,
                },
                ai:{
                    basic:{
                        equipValue:2,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    return equipValue(card,player)-value;
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["zhen_yitianjian_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
        },
        translate:{
            "zhen_fanjianzhishu":"反间之书",
            "zhen_fanjianzhishu_info":"出牌阶段，对两名其他角色使用。前者获得后者一张牌，后者视为对前者使用一张【杀】。游戏人数小于3人时，你可以重铸此牌。",
            "zhen_jiejingzhou":"借荆州",
            "zhen_jiejingzhou_info":"出牌阶段，对一名装备区里有牌的其他角色使用。你获得其装备区里的一张牌。",
            "zhen_liejiasuo":"裂甲索",
            "zhen_liejiasuo_info":"出牌阶段，对一名其他角色使用。若其装备区里有防具牌且没有失效，其防具牌失效直到回合开始，否则，其武将牌横置。",
            "zhen_bazhenyanwu":"八阵演武",
            "zhen_bazhenyanwu_info":"出牌阶段，对一名角色使用。当其成为【杀】的目标后，其摸一张牌。该效果限两次。 ",
            "zhen_bamenjinsuo":"八门金锁",
            "zhen_bamenjinsuo_info":"出牌阶段，对一名其他角色使用。其下个出牌阶段不能使用【杀】。 ",
            "zhen_anduchencang":"暗度陈仓",
            "zhen_anduchencang_info":"出牌阶段，对一名其他角色使用。你摸一张牌，然后本回合你与其距离为1。",
            "zhen_huntianshengyi":"混天昇仪",
            "zhen_huntianshengyi_info":"出牌阶段，你可以回复一点体力或摸两张牌。如若此做，你弃置装备区里的【混天昇仪】。",
            "zhen_tongguiyujin":"同归于尽",
            "zhen_tongguiyujin_info":"出牌阶段，对一名其他角色使用。你对其造成1点伤害，然后若其没有死亡，其对你造成1点伤害。否则，你受到1点无来源的伤害。",
            "zhen_yunliangche":"运粮车",
            "zhen_yunliangche_info":"锁定技，摸牌阶段，你多摸一张牌；结束阶段，你可以将此装备移动至一名其他角色的装备区里；当你不因移动而失去装备区里的【运粮车】时，你弃置一张牌。",
            "zhen_weiya":"威压",
            "zhen_weiya_info":"出牌阶段，对自己使用。直到你的下个回合开始前，体力值不大于你的角色不能对你使用【杀】。",
            "zhen_xiepo":"胁迫",
            "zhen_xiepo_info":"出牌阶段，对一名其他角色使用。令其交给你两张牌，否则你对其造成1点伤害。",
            "zhen_xiadu":"下毒",
            "zhen_xiadu_info":"出牌阶段，对一名其他角色使用。其有80％概率随机弃置一张牌或失去一点体力。",
            "zhen_qingnangshucanye":"青囊书残页",
            "zhen_qingnangshucanye_info":"出牌阶段限一次，你可以弃置一张红色手牌并令一名角色回复一点体力。",
            "zhen_biyuejing":"闭月镜",
            "zhen_biyuejing_info":"锁定技，结束阶段，若你为女性角色，你摸一张牌。若你体力值为全场最少或之一，你回复一点体力。",
            "zhen_dingxinwan":"定心丸",
            "zhen_dingxinwan_info":"出牌阶段，对一名角色使用。防止其受到的下次伤害直到其回合开始。其回合开始时，若其没有失去此效果，其回复一点体力。",
            "zhen_huxinjing":"护心镜",
            "zhen_huxinjing_info":"当你受到伤害时，若伤害值大于或等于你的体力值，则你可以将【护心镜】置入弃牌堆，然后防止此伤害。",
            "zhen_baodiaogong":"宝雕弓",
            "zhen_baodiaogong_info":"当你使用【杀】对一名其他角色造成伤害时，你可以弃置其一张牌。",
            "zhen_huansuokai":"环锁铠",
            "zhen_huansuokai_info":"锁定技，当此牌置入你装备区时，若你已横置，你重置武将牌；你不会被横置且不会受到无属性伤害；当你受到属性伤害时，你令该伤害+1。",
            "zhen_yitianjian":"倚天剑",
            "zhen_yitianjian_info":"当你使用【杀】对目标角色造成伤害后，你可以摸一张牌或回复一点体力。",
        },
        list:[["spade","3","zhen_fanjianzhishu"],["club","3","zhen_fanjianzhishu"],["diamond","7","zhen_fanjianzhishu"],["diamond","5","zhen_jiejingzhou"],["spade","8","zhen_jiejingzhou"],["club","4","zhen_jiejingzhou"],["heart","4","zhen_liejiasuo"],["club","6","zhen_liejiasuo"],["spade","6","zhen_liejiasuo"],["club","13","zhen_bazhenyanwu"],["spade","12","zhen_bazhenyanwu"],["spade","13","zhen_bamenjinsuo"],["club","12","zhen_bamenjinsuo"],["spade","6","zhen_anduchencang"],["club","6","zhen_anduchencang"],["diamond","6","zhen_anduchencang"],["diamond","5","zhen_huntianshengyi"],["spade","1","zhen_tongguiyujin"],["club","1","zhen_tongguiyujin"],["club","5","zhen_yunliangche"],["spade","7","zhen_weiya"],["heart","4","zhen_weiya"],["club","10","zhen_weiya"],["club","11","zhen_xiepo"],["spade","11","zhen_xiepo"],["diamond","11","zhen_xiepo"],["diamond","8","zhen_xiadu"],["spade","9","zhen_xiadu"],["spade","7","zhen_xiadu"],["spade","4","zhen_xiadu"],["heart","5","zhen_qingnangshucanye"],["diamond","2","zhen_biyuejing"],["heart","6","zhen_dingxinwan"],["heart","7","zhen_dingxinwan"],["heart","8","zhen_dingxinwan"],["diamond","9","zhen_dingxinwan"],["diamond","10","zhen_dingxinwan"],["club","2","zhen_huxinjing"],["diamond","5","zhen_baodiaogong"],["spade","2","zhen_huansuokai"],["club","2","zhen_huansuokai"],["club","6","zhen_yitianjian"]],
    });
builder.addPack({
        skill:{
            fangjushixiao:{
                subSkill:{
                    equip:{
                        ai:{
                            unequip:true,
                            skillTagFilter:function(player,tag,arg){
                    if(arg&&arg.target&&arg.target.hasSkill('fangjushixiao_fang')) return true;
                    return false;
                },
                        },
                        sub:true,
                    },
                    fang:{
                        mark:true,
                        marktext:"破",
                        onremove:function(player){
                player.unmarkSkill('fangjushixiao_fang');
                for(var i=0;i<game.players.length;i++){
                    if(!game.players[i].hasSkill('fangjushixiao_fang')&&game.players[i].hasSkill('fangjushixiao_equip')){
                        game.players[i].removeSkill('fangjushixiao_equip');
                    }else if(!player.hasSkill('fangjushixiao_equip')){
                        player.addSkill('fangjushixiao_equip');
                    }
                }
            },
                        intro:{
                            content:"防具失效直到回合开始",
                        },
                        ai:{
                            "unequip2":true,
                        },
                        sub:true,
                    },
                },
            },
            "zhen_bamenjinsuo_skill":{
                mark:true,
                marktext:"锁",
                nopop:true,
                intro:{
                    content:"不能使用杀直到下一个回合结束",
                },
                onremove:true,
                mod:{
                    cardEnabled:function(card){
            if(card.name=='sha') return false;
        },
                },
            },
            "zhen_bazhenyanwu_skill":{
                mark:"card",
                marktext:"阵",
                trigger:{
                    target:"useCardToTarget",
                },
                filter:function(event,player){
        if(event.card.name!='sha') return false;
        return true;
    },
                forced:true,
                popup:false,
                nopop:true,
                intro:{
                    content:function(storage,player){
            return '当你成为【杀】的目标时，你摸一张牌（剩余'+player.storage.zhen_bazhenyanwu_skill_markcount+'次）'
        },
                },
                content:function(){
        player.draw();
        player.storage.zhen_bazhenyanwu_skill_markcount--;
        if(player.storage.zhen_bazhenyanwu_skill_markcount==0){
            delete player.storage.zhen_bazhenyanwu_skill;
            delete player.storage.zhen_bazhenyanwu_skill_markcount;
            player.removeSkill('zhen_bazhenyanwu_skill');
        }else{
            player.updateMarks();
        }
    },
            },
            "zhen_anduchencang_skill":{
                subSkill:{
                    go:{
                        onremove:true,
                        mod:{
                            globalFrom:function(from,to){
                    if(to.hasSkill('zhen_anduchencang_skill_to')){
                        return -Infinity;
                    }
                },
                        },
                        sub:true,
                    },
                    to:{
                        mark:"character",
                        onremove:true,
                        intro:{
                            content:"$计算与你的距离为1",
                        },
                        sub:true,
                    },
                },
            },
            "zhen_huntianshengyi_skill":{
                audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                equipSkill:true,
                enable:"phaseUse",
                usable:1,
                content:function (){
        'step 0'
        player.chooseDrawRecover(2,true);
        'step 1'
        var card=player.getEquip('zhen_huntianshengyi');
        if(card){
            player.discard(card);
        }
    },
                ai:{
                    result:{
                        player:2,
                    },
                    order:7.2,
                    tag:{
                        recover:1,
                        draw:2,
                    },
                },
            },
            "zhen_yunliangche_skill":{
                audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                equipSkill:true,
                trigger:{
                    player:"phaseJieshuBegin",
                },
                direct:true,
                content:function(){
        'step 0'
        var players=game.filterPlayer(function(current){
            if(!current.getEquip(5)&&current!=player&&!current.isTurnedOver()&&get.attitude(player,current)>=3&&get.attitude(current,player)>=3){
                return true;
            }
        });
        players.sort(lib.sort.seat);
        var choice=players[0];
        var next=player.chooseTarget('是否移动【运粮车】？',function(card,player,target){
            return !target.isMin()&&player!=target&&target.isEmpty(5);
        });
        next.set('ai',function(target){
            return target==_status.event.choice?1:-1;
        });
        next.set('choice',choice);
        "step 1"
        if(result.bool&&result.targets){
            var target=result.targets[0];
            var card=player.getEquip(5);
            player.logSkill('zhen_yunliangche_skill');
            player.line(target);
            game.log(player,'将','#g【运粮车】','移动给了',target);
            target.equip(card);
            player.$give(card,target);
            game.delay();
        }
    },
                group:["zhen_yunliangche_skill_draw"],
                subSkill:{
                    draw:{
                        equipSkill:true,
                        trigger:{
                            player:"phaseDrawBegin2",
                        },
                        forced:true,
                        content:function(){
                trigger.num++;
            },
                        sub:true,
                    },
                    die:{
                        audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                        sub:true,
                    },
                },
            },
            "zhen_weiya_skill":{
                mark:true,
                intro:{
                    content:"体力值不大于你的角色不能对你使用【杀】直到回合开始",
                },
                mod:{
                    targetEnabled:function(card,player,target,now){
            if(target.hp>=player.hp){
                if(card.name=='sha') return false;
            }
        },
                },
            },
            "zhen_qingnangshucanye_skill":{
                audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                equipSkill:true,
                enable:"phaseUse",
                usable:1,
                check:function(card){
        return 9-get.value(card)
    },
                filter:function(event,player){
        return player.countCards('he',{color:'red'})>0;
    },
                filterCard:{
                    color:"red",
                },
                prompt:"弃置一张红色手牌并令一名角色回复一点体力",
                filterTarget:function(card,player,target){
        return target.isDamaged();
    },
                content:function(){
        target.recover();
    },
                ai:{
                    order:3,
                    result:{
                        target:function(player,target){
                if(target.hp==1) return 5;
                if(player==target&&player.countCards('h')>player.hp) return 5;
                return 2;
            },
                    },
                    tag:{
                        recover:1,
                    },
                },
            },
            "zhen_biyuejing_skill":{
                audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                equipSkill:true,
                trigger:{
                    player:"phaseJieshuBegin",
                },
                filter:function(event,player){
        return player.sex=='female';
    },
                forced:true,
                content:function(){
        player.draw();
        if(player.isMinHp()) player.recover();
    },
            },
            "zhen_dingxinwan_skill":{
                mark:true,
                marktext:"防",
                intro:{
                    content:"防止下次受到的伤害",
                },
                trigger:{
                    player:["damageBegin4","phaseBefore"],
                },
                forced:true,
                content:function (){
        if(event.triggername=='damageBegin4'){
            trigger.cancel();
            player.removeSkill('zhen_dingxinwan_skill');
        }else{
            if(player.isDamaged()) player.recover();
            player.removeSkill('zhen_dingxinwan_skill');
        }
    },
            },
            "zhen_huxinjing_skill":{
                audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                equipSkill:true,
                trigger:{
                    player:"damageBegin4",
                },
                filter:function(event,player){
        if(player.hasSkillTag('unequip2')) return false;
        if(event.source&&event.source.hasSkillTag('unequip',false,{
            name:event.card?event.card.name:null,
            target:player,
            card:event.card
        })) return false;
        return event.num>=player.hp;
    },
                content:function(){
        trigger.cancel();
        var e2=player.getEquip('zhen_huxinjing');
        if(e2){
            player.discard(e2);
        }
    },
            },
            "zhen_baodiaogong_skill":{
                audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                equipSkill:true,
                trigger:{
                    source:"damageBegin2",
                },
                check:function(event,player){
        return get.attitude(player,event.player)<=0;
    },
                filter:function(event,player){
        return event.card&&event.card.name=='sha'&&event.player!=player&&event.player.countDiscardableCards(player,'he');
    },
                logTarget:"player",
                content:function(){
        player.discardPlayerCard(trigger.player,'弃置'+get.translation(trigger.player)+'一张牌',true).set('ai',function(button){
            if(get.position(button.link)=='e'){
                if(get.subtype(button.link)=='equip2')    return 2*get.value(button.link);
                return get.value(button.link);
            }
            return 1;
        });
    },
            },
            "zhen_huansuokai_skill":{
                audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                equipSkill:true,
                trigger:{
                    player:["damageBegin3","damageBegin4","linkBegin"],
                },
                forced:true,
                filter:function (event,player,name){
        if(player.hasSkillTag('unequip2')) return false;
        if(event.source&&event.source.hasSkillTag('unequip',false,{
            name:event.card?event.card.name:null,
            target:player,
            card:event.card
        })) return false;
        if(name=='damageBegin3'&&event.nature) return true;
        if(name=='damageBegin4'&&!event.nature) return true;
        if(name=='linkBegin'&&!player.isLinked()&&!player.hasSkill('nzry_jieying')) return true;
        return false;
    },
                content:function (){
        if(event.triggername=='damageBegin4'||event.triggername=='linkBegin') trigger.cancel();
        if(event.triggername=='damageBegin3') trigger.num++;
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                if((get.tag(card,'fireDamage')||get.tag(card,'thunderDamage'))&&current<0){
                    return 2;
                } 
                if(get.tag(card,'damage')&&!card.nature) return 'zerotarget';
                if(card.name=='tiesuo') return 'zeroplayertarget';
            },
                    },
                },
            },
            "zhen_yitianjian_skill":{
                audio:"ext:卡牌扩展/members/import_ee3abf1270:true",
                trigger:{
                    source:"damageSource",
                },
                filter:function (event,player){
        return event.getParent().name=='sha'&&event.notLink();
    },
                direct:true,
                content:function (){
        player.chooseDrawRecover().set('logSkill','zhen_yitianjian_skill').set('prompt2','倚天剑：摸一张牌或回复1点体力');
    },
            },
        },
        translate:{
            fangjushixiao:"防具失效",
            "fangjushixiao_info":"",
            "zhen_bamenjinsuo_skill":"八门金锁",
            "zhen_bamenjinsuo_skill_info":"",
            "zhen_bazhenyanwu_skill":"八阵演武",
            "zhen_bazhenyanwu_skill_info":"",
            "zhen_anduchencang_skill":"暗度陈仓",
            "zhen_anduchencang_skill_info":"",
            "zhen_huntianshengyi_skill":"混天昇仪",
            "zhen_huntianshengyi_skill_info":"",
            "zhen_yunliangche_skill":"运粮车",
            "zhen_yunliangche_skill_info":"",
            "zhen_weiya_skill":"威压",
            "zhen_weiya_skill_info":"",
            "zhen_qingnangshucanye_skill":"青囊书残页",
            "zhen_qingnangshucanye_skill_info":"",
            "zhen_biyuejing_skill":"闭月镜",
            "zhen_biyuejing_skill_info":"",
            "zhen_dingxinwan_skill":"定心丸",
            "zhen_dingxinwan_skill_info":"",
            "zhen_huxinjing_skill":"护心镜",
            "zhen_huxinjing_skill_info":"当你受到伤害时，若伤害值大于或等于你的体力值，则你可以将【护心镜】置入弃牌堆，然后防止此伤害。",
            "zhen_baodiaogong_skill":"宝雕弓",
            "zhen_baodiaogong_skill_info":"当你使用【杀】对一名其他角色造成伤害时，你可以弃置其一张牌。",
            "zhen_huansuokai_skill":"环锁铠",
            "zhen_huansuokai_skill_info":"锁定技，当此牌置入你装备区时，若你已横置，你重置武将牌；你不会被横置且不会受到无属性伤害；当你受到属性伤害时，你令该伤害+1。",
            "zhen_yitianjian_skill":"倚天剑",
            "zhen_yitianjian_skill_info":"当你使用【杀】对目标角色造成伤害后，你可以摸一张牌或回复一点体力。",
        },
    });

} };
}
