// Generated from 卡牌扩展.zip/(卡牌)PUBG卡包.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            "pubg_bd":{
                type:"basic",
                subtype:"PUBG专属道具",
                toself:true,
                enable:function (card,player){
        return player.hp<player.maxHp;
    },
                savable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player&&target.hp<target.maxHp;
    },
                modTarget:function (card,player,target){
        return target.hp<target.maxHp;
    },
                content:function (){
        target.recover();
    },
                ai:{
                    basic:{
                        order:function (card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[8,6.5,5,4],
                        value:[8,6.5,5,4],
                    },
                    result:{
                        target:function (player,target){
                // if(player==target&&player.hp<=0) return 2;
                var nd=player.needsToDiscard();
                var keep=false;
                if(nd<=0){
                    keep=true;
                }
                else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
                    keep=true;
                }
                var mode=get.mode();
                if(target.hp>=2&&keep&&target.hasFriend()){
                    if(target.hp>2||nd==0) return 0;
                    if(target.hp==2){
                        if(game.hasPlayer(function(current){
                            if(target!=current&&get.attitude(target,current)>=3){
                                if(current.hp<=1) return true;
                                if((mode=='identity'||mode=='versus'||mode=='chess')&&current.identity=='zhu'&&current.hp<=2) return true;
                            }
                        })){
                            return 0;
                        }
                    }
                }
                if(target.hp<0&&target!=player&&target.identity!='zhu') return 0;
                var att=get.attitude(player,target);
                if(att<3&&att>=0&&player!=target) return 0;
                var tri=_status.event.getTrigger();
                if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
                        var num=game.countPlayer(function(current){
                            if(current.identity=='fan'){
                                return current.countCards('h','tao');
                            }
                        });
                        if(num>1&&player==target) return 2;
                        return 0;
                    }
                }
                if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
                        return 0;
                    }
                }
                if(mode=='stone'&&target.isMin()&&
                player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&
                tri.source!=target.getEnemy()){
                    return 0;
                }
                return 2;
            },
                    },
                    tag:{
                        recover:1,
                        save:1,
                    },
                },
                fullimage:true,
            },
            "pubg_ylb":{
                type:"basic",
                subtype:"PUBG专属道具",
                toself:true,
                enable:function (card,player){
        return player.hp<player.maxHp;
    },
                savable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player&&target.hp<target.maxHp;
    },
                modTarget:function (card,player,target){
        return target.hp<target.maxHp;
    },
                content:function (){
        target.recover(2);
    },
                ai:{
                    basic:{
                        order:function (card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[8,6.5,5,4],
                        value:[8,6.5,5,4],
                    },
                    result:{
                        target:function (player,target){
                // if(player==target&&player.hp<=0) return 2;
                var nd=player.needsToDiscard();
                var keep=false;
                if(nd<=0){
                    keep=true;
                }
                else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
                    keep=true;
                }
                var mode=get.mode();
                if(target.hp>=2&&keep&&target.hasFriend()){
                    if(target.hp>2||nd==0) return 0;
                    if(target.hp==2){
                        if(game.hasPlayer(function(current){
                            if(target!=current&&get.attitude(target,current)>=3){
                                if(current.hp<=1) return true;
                                if((mode=='identity'||mode=='versus'||mode=='chess')&&current.identity=='zhu'&&current.hp<=2) return true;
                            }
                        })){
                            return 0;
                        }
                    }
                }
                if(target.hp<0&&target!=player&&target.identity!='zhu') return 0;
                var att=get.attitude(player,target);
                if(att<3&&att>=0&&player!=target) return 0;
                var tri=_status.event.getTrigger();
                if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
                        var num=game.countPlayer(function(current){
                            if(current.identity=='fan'){
                                return current.countCards('h','tao');
                            }
                        });
                        if(num>1&&player==target) return 2;
                        return 0;
                    }
                }
                if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
                        return 0;
                    }
                }
                if(mode=='stone'&&target.isMin()&&
                player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&
                tri.source!=target.getEnemy()){
                    return 0;
                }
                return 2;
            },
                    },
                    tag:{
                        recover:1,
                        save:1,
                    },
                },
                fullimage:true,
            },
            "pubg_ylx":{
                type:"basic",
                subtype:"PUBG专属道具",
                toself:true,
                enable:function (card,player){
        return player.hp<player.maxHp;
    },
                savable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player&&target.hp<target.maxHp;
    },
                modTarget:function (card,player,target){
        return target.hp<target.maxHp;
    },
                content:function (){
        target.recover(3);
    },
                ai:{
                    basic:{
                        order:function (card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[8,6.5,5,4],
                        value:[8,6.5,5,4],
                    },
                    result:{
                        target:function (player,target){
                // if(player==target&&player.hp<=0) return 2;
                var nd=player.needsToDiscard();
                var keep=false;
                if(nd<=0){
                    keep=true;
                }
                else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
                    keep=true;
                }
                var mode=get.mode();
                if(target.hp>=2&&keep&&target.hasFriend()){
                    if(target.hp>2||nd==0) return 0;
                    if(target.hp==2){
                        if(game.hasPlayer(function(current){
                            if(target!=current&&get.attitude(target,current)>=3){
                                if(current.hp<=1) return true;
                                if((mode=='identity'||mode=='versus'||mode=='chess')&&current.identity=='zhu'&&current.hp<=2) return true;
                            }
                        })){
                            return 0;
                        }
                    }
                }
                if(target.hp<0&&target!=player&&target.identity!='zhu') return 0;
                var att=get.attitude(player,target);
                if(att<3&&att>=0&&player!=target) return 0;
                var tri=_status.event.getTrigger();
                if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
                        var num=game.countPlayer(function(current){
                            if(current.identity=='fan'){
                                return current.countCards('h','tao');
                            }
                        });
                        if(num>1&&player==target) return 2;
                        return 0;
                    }
                }
                if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
                        return 0;
                    }
                }
                if(mode=='stone'&&target.isMin()&&
                player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&
                tri.source!=target.getEnemy()){
                    return 0;
                }
                return 2;
            },
                    },
                    tag:{
                        recover:1,
                        save:1,
                    },
                },
                fullimage:true,
            },
            "pubg_nlyl":{
                type:"basic",
                subtype:"PUBG专属道具",
                enable:true,
                toself:true,
                filterTarget:function (card,player,target){
        return target==player;
    },
                selectTarget:-1,
                modTarget:true,
                content:function (){
        target.changeHujia(Math.min(1,player.maxHp-player.hujia));
    },
                ai:{
                    value:[6,1],
                    useful:1,
                    order:2,
                    result:{
                        target:1,
                    },
                },
                fullimage:true,
            },
            "pubg_zty":{
                type:"basic",
                subtype:"PUBG专属道具",
                enable:true,
                toself:true,
                filterTarget:function (card,player,target){
        return target==player;
    },
                selectTarget:-1,
                modTarget:true,
                content:function (){
        target.changeHujia(Math.min(2,player.maxHp-player.hujia));
    },
                ai:{
                    value:[6,1],
                    useful:1,
                    order:2,
                    result:{
                        target:1,
                    },
                },
                fullimage:true,
            },
            "pubg_ssxs":{
                type:"basic",
                subtype:"PUBG专属道具",
                enable:true,
                toself:true,
                filterTarget:function (card,player,target){
        return target==player;
    },
                selectTarget:-1,
                modTarget:true,
                content:function (){
        target.changeHujia(Math.min(3,player.maxHp-player.hujia));
    },
                ai:{
                    value:[6,1],
                    useful:1,
                    order:2,
                    result:{
                        target:1,
                    },
                },
                fullimage:true,
            },
            "pubg_sl":{
                type:"trick",
                subtype:"PUBG专属道具",
                enable:true,
                selectTarget:1,
                filterTarget:true,
                changeTarget:function (player,targets){
        game.filterPlayer(function(current){
            return get.distance(targets[0],current,'pure')==1;
        },targets);
    },
                reverseOrder:true,
                content:function (){
        "step 0"
        target.chooseToDiscard([1,2],'he').ai=function(card){
            if(get.damageEffect(target,player,target,'thunder')>=0){
                if(target.hasSkillTag('maixie')){
                    if(ui.selected.cards.length) return 0;
                }
                else{
                    return 0;
                }
            }
            if(player.hasSkillTag('notricksource')) return 0;
            if(target.hasSkillTag('notrick')) return 0;
            if(card.name=='tao') return 0;
            if(target.hp==1&&card.name=='jiu') return 0;
            if(get.type(card)!='basic'){
                return 10-get.value(card);
            }
            return 8-get.value(card);
        };
        "step 1"
        if(!result.bool||result.cards.length<2){
            if(result.bool) target.damage(2-result.cards.length,'thunder');
            else target.damage(2,'thunder');
        }
    },
                ai:{
                    value:[5,1],
                    useful:[3,1],
                    result:{
                        player:function (player,target){
                return game.countPlayer(function(current){
                    if(current==target||(get.distance(target,current,'pure')==1)){
                        return -get.sgn(get.attitude(player,current));
                    }
                });
            },
                    },
                    order:1.2,
                },
                fullimage:true,
            },
            "pubg_pdg":{
                type:"equip",
                subtype:"PUBG专属装备",
                skills:["pubg_pdg_skill"],
                ai:{
                    basic:{
                        equipValue:6,
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function (card,player){
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
                if(typeof equipValue=='function') return equipValue(card,player)-value;
                if(typeof equipValue!='number') equipValue=0;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function (player,target){
                return get.equipResult(player,target,name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function (){
        target.equip(card);
    },
                toself:true,
                fullimage:true,
            },
            "pubg_jlf":{
                fullskin:true,
                type:"equip",
                subtype:"PUBG专属装备",
                skills:["pubg_jlf_skill"],
                ai:{
                    basic:{
                        equipValue:6,
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function (card,player){
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
                if(typeof equipValue=='function') return equipValue(card,player)-value;
                if(typeof equipValue!='number') equipValue=0;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function (player,target){
                return get.equipResult(player,target,name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function (){
        target.equip(card);
    },
                toself:true,
            },
            "pubg_s686":{
                type:"equip",
                subtype:"PUBG专属枪械",
                ai:{
                    equipValue:function (card,player){
            if(!game.hasPlayer(function(current){
                return player.canUse('sha',current)&&get.effect(current,{name:'sha'},player,player)<0;
            })){
                return 1;
            }
            if(player.hasSha()&&_status.currentPhase==player){
                if(player.getEquip('zhuge')||player.getCardUsable('sha')==0){
                    return 10;
                }
            }
            var num=player.countCards('h','sha');
            if(num>1) return 4+num;
            return 2+num;
        },
                    basic:{
                        equipValue:5,
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function (card,player){
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
                if(typeof equipValue=='function') return equipValue(card,player)-value;
                if(typeof equipValue!='number') equipValue=0;
                return equipValue-value;
            },
                    },
                    tag:{
                        valueswap:1,
                    },
                    result:{
                        target:function (player,target){
                return get.equipResult(player,target,name);
            },
                    },
                },
                skills:["pubg_s686_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function (){
        target.equip(card);
    },
                toself:true,
                fullimage:true,
            },
            "pubg_98k":{
                type:"equip",
                subtype:"PUBG专属枪械",
                distance:{
                    attackFrom:-4,
                },
                ai:{
                    basic:{
                        equipValue:3,
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function (card,player){
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
                if(typeof equipValue=='function') return equipValue(card,player)-value;
                if(typeof equipValue!='number') equipValue=0;
                return equipValue-value;
            },
                    },
                    result:{
                        target:function (player,target){
                return get.equipResult(player,target,name);
            },
                    },
                },
                skills:["pubg_98k_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function (){
        target.equip(card);
    },
                toself:true,
                fullimage:true,
            },
            "pubg_kt":{
                type:"trick",
                subtype:"PUBG专属道具",
                enable:true,
                selectTarget:-1,
                toself:true,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                content:function (){
        target.draw(5);
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:5,
                    },
                },
                fullimage:true,
            },
            "pubg_sjt":{
                type:"equip",
                subtype:"PUBG专属装备",
                skills:["pubg_sjt_skill"],
                ai:{
                    equipValue:6,
                },
                fullimage:true,
            },
        },
        translate:{
            "pubg_bd":"绷带",
            "pubg_bd_info":"出牌阶段，对自己使用，回复一点体力。",
            "pubg_ylb":"医疗包",
            "pubg_ylb_info":"出牌阶段，对自己使用，回复两点体力。",
            "pubg_ylx":"医疗箱",
            "pubg_ylx_info":"出牌阶段，对自己使用，回复三点体力。",
            "pubg_nlyl":"能量饮料",
            "pubg_nlyl_info":"出牌阶段对自己使用，获得一点护甲，护甲最大值不超过体力上限",
            "pubg_zty":"止痛药",
            "pubg_zty_info":"出牌阶段对自己使用，获得两点护甲，护甲最大值不超过体力上限",
            "pubg_ssxs":"肾上腺素",
            "pubg_ssxs_info":"出牌阶段对自己使用，获得三点护甲，护甲最大值不超过体力上限",
            "pubg_sl":"手雷",
            "pubg_sl_info":"对一名角色使用，令目标及其上下位角色弃置0~2张牌，并受到2-X点雷电伤害，X为其弃置的手牌数",
            "pubg_pdg":"平底锅",
            "pubg_pdg_info":"锁定技，每当你即将受到伤害，有三分之一的概率免疫该伤害",
            "pubg_jlf":"吉利服",
            "pubg_jlf_info":"锁定技，若你在出牌阶段没有使用手牌，则可获得暂时获得[隐匿]<li>隐匿：锁定技，你不能成为其他角色选择的目标",
            "pubg_s686":"s686",
            "pubg_s686_info":"攻击范围1，锁定技，你的杀造成的伤害+1",
            "pubg_98k":"98k",
            "pubg_98k_info":"攻击范围5；锁定技，你使用【杀】无视目标防具，若目标角色未损失体力值，此【杀】伤害+1",
            "pubg_kt":"空投",
            "pubg_kt_info":"出牌阶段，对你使用。你摸五张牌。",
            "pubg_sjt":"三级头",
            "pubg_sjt_info":"锁定技，当你受到致命伤害时，保留1点体力，然后失去此装备",
        },
        list:[["heart","1","pubg_bd"],["heart","2","pubg_bd"],["heart","3","pubg_bd"],["heart","4","pubg_ylb"],["heart","5","pubg_ylb"],["heart","6","pubg_ylx"],["diamond","1","pubg_nlyl"],["diamond","2","pubg_nlyl"],["diamond","3","pubg_nlyl"],["diamond","4","pubg_zty"],["diamond","5","pubg_zty"],["diamond","6","pubg_ssxs"],["club","1","pubg_sl"],["club","3","pubg_sl"],["club","5","pubg_sl"],["spade","1","pubg_pdg"],["spade","3","pubg_jlf"],["spade","5","pubg_s686"],["spade","7","pubg_98k"],["diamond","7","pubg_kt"],["spade","13","pubg_sjt"]],
    });
builder.addPack({
        skill:{
            "pubg_pdg_skill":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
        if(Math.random()>1/3) return false;
        return true;
    },
                content:function (){
        trigger.cancel();
    },
            },
            "pubg_jlf_skill":{
                skillAnimation:true,
                forced:true,
                trigger:{
                    player:"phaseDiscardBefore",
                },
                filter:function (event,player){
        return player.countUsed()==0;
    },
                content:function (){
        player.addTempSkill('pubg_yn',{player:'phaseBegin'});
    },
            },
            "pubg_yn":{
                mark:true,
                mod:{
                    targetEnabled:function (card,player,target){
            if(player!=target) return false;
        },
                },
            },
            "pubg_s686_skill":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
        return event.card&&event.card.name=='sha'&&_status.currentPhase==player;
    },
                content:function (){
        trigger.num++;
    },
            },
            "pubg_98k_skill":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event){
        return event.card&&event.card.name=='sha'&&event.player.isHealthy();
    },
                content:function (){
        trigger.num++;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                    effect:{
                        player:function (card,player,target){
                if(card.name=='sha'&&target.isHealthy()&&get.attitude(player,target)>0){
                    return [1,-2];
                }
            },
                    },
                },
            },
            "pubg_sjt_skill":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                audio:"ext:卡牌扩展/members/import_c7cbfaa078:true",
                filter:function (event,player){
        if(event.num>=player.hp) return true;
        return false;
    },
                priority:-10,
                content:function (){
        trigger.num=player.hp-1;
        var card=player.getEquip('pubg_sjt');
        if(card){
            player.discard(card);
        };
    },
            },
        },
        translate:{
            "pubg_pdg_skill":"平底锅",
            "pubg_pdg_skill_info":"锁定技，每当你即将受到伤害，有三分之一的概率免疫该伤害",
            "pubg_jlf_skill":"吉利服",
            "pubg_jlf_skill_info":"锁定技，若你在出牌阶段没有使用手牌，则可获得暂时获得[隐匿]<li>隐匿：锁定技，你不能成为其他角色选择的目标",
            "pubg_yn":"隐匿",
            "pubg_yn_info":"锁定技，你不能成为其他角色选择的目标",
            "pubg_s686_skill":"s686",
            "pubg_s686_skill_info":"锁定技，你的杀造成的伤害+1",
            "pubg_98k_skill":"98k",
            "pubg_98k_skill_info":"攻击范围5；锁定技，你使用【杀】无视目标防具，若目标角色未损失体力值，此【杀】伤害+1",
            "pubg_sjt_skill":"三级头",
            "pubg_sjt_skill_info":"锁定技，当你受到致命伤害时，保留1点体力，然后失去此装备",
        },
    });
builder.skill._pubg_recover_import_c7cbfaa078={
        trigger:{
            player:'phaseBegin',
        },
        forced:true,
        locked:true,
        popup:false,
        content:function(){
            if(player.hujia>0){
                player.changeHujia(-1);
                if(player.hp>0&&player.hp<player.maxHp){player.recover()}
            };
        },
    };
} };
}
