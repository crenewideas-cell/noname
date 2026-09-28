// Generated from 卡牌扩展.zip/(卡牌)杀.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            xinleisha:{
                audio:true,
                fullskin:true,
                cardnature:"thunder",
                nature:"thunder",
                type:"basic",
                enable:true,
                usable:1,
                range:{
                    attack:1,
                },
                selectTarget:1,
                filterTarget:function (card,player,target){return player!=target},
                content:function (){
        "step 0"
        if(typeof event.shanRequired!='number'||!event.shanRequired||event.shanRequired<0){
            event.shanRequired=1;
        }
        var evt=event.getParent('useCard')
        if(evt&&(typeof evt.baseDamage=='number'&&evt.baseDamage>0)){
           event.baseDamage=evt.baseDamage;
        }
        else event.baseDamage=2;
        if(typeof event.extraDamage!='number'){
            event.extraDamage=0;
        }
        "step 1"
        if(event.directHit){
            event._result={bool:false};
        }
        else if(event.skipShan){
            event._result={bool:true};
        }
        else{
            var next=target.chooseToRespond({name:'shan'});
            if(event.shanRequired>1){
                next.set('prompt2','（共需打出'+event.shanRequired+'张闪）');
            }
            next.set('ai',function(card){
                var target=_status.event.player;
                var evt=_status.event.getParent();
                if(_status.event.shanRequired>1&&target.countCards('h','shan')<_status.event.shanRequired){
                    return -1
                }
                if(target.hasSkillTag('useShan')){
                    return 11-get.value(card);
                }
                if(target.hasSkillTag('noShan')){
                    return -1;
                }
                if(get.damageEffect(target,evt.player,target,evt.card.nature)>=0) return -1;
                return 11-get.value(card);
            }).set('shanRequired',event.shanRequired);
            next.autochoose=lib.filter.autoRespondShan;
        }
        "step 2"
        if(result.bool==false){
            event.trigger('shaHit');
        }
        else{
            event.shanRequired--;
            if(event.shanRequired>0){
                event.goto(1);
            }
            else{
                event.trigger('shaMiss');
                event.responded=result;
            }
        }
        "step 3"
        if(result.bool==false&&!event.unhurt){
            target.damage('thunder',event.baseDamage+event.extraDamage);
            player.getStat().card.xinhuosha++;
            event.result={bool:true}
            event.trigger('shaDamage');
        }
        else{
            event.result={bool:false}
            event.trigger('shaUnhirt');
        }
    },
                ai:{
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (){
            if(_status.event.player.hasSkillTag('presha',true,null,true)) return 10;
            return 3;
        },
                    result:{
                        target:function (player,target){
                if(player.hasSkill('jiu')&&!target.getEquip('baiyin')){
                    if(get.attitude(player,target)>0){
                        return -6;
                    }
                    else{
                        return -3;
                    }
                }
                return -1.5;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function (card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function (card){
                if(card.nature) return 1;
            },
                        thunderDamage:function (card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function (card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            xinhuosha:{
                audio:true,
                fullskin:true,
                cardnature:"fire",
                nature:"fire",
                type:"basic",
                enable:true,
                usable:1,
                range:{
                    attack:1,
                },
                selectTarget:1,
                filterTarget:function (card,player,target){return player!=target},
                content:function (){
        "step 0"
        if(typeof event.shanRequired!='number'||!event.shanRequired||event.shanRequired<0){
            event.shanRequired=1;
        }
        var evt=event.getParent('useCard')
        if(evt&&(typeof evt.baseDamage=='number'&&evt.baseDamage>0)){
           event.baseDamage=evt.baseDamage;
        }
        else event.baseDamage=3;
        if(typeof event.extraDamage!='number'){
            event.extraDamage=0;
        }
        "step 1"
        if(event.directHit){
            event._result={bool:false};
        }
        else if(event.skipShan){
            event._result={bool:true};
        }
        else{
            var next=target.chooseToRespond({name:'shan'});
            if(event.shanRequired>1){
                next.set('prompt2','（共需打出'+event.shanRequired+'张闪）');
            }
            next.set('ai',function(card){
                var target=_status.event.player;
                var evt=_status.event.getParent();
                if(_status.event.shanRequired>1&&target.countCards('h','shan')<_status.event.shanRequired){
                    return -1
                }
                if(target.hasSkillTag('useShan')){
                    return 11-get.value(card);
                }
                if(target.hasSkillTag('noShan')){
                    return -1;
                }
                if(get.damageEffect(target,evt.player,target,evt.card.nature)>=0) return -1;
                return 11-get.value(card);
            }).set('shanRequired',event.shanRequired);
            next.autochoose=lib.filter.autoRespondShan;
        }
        "step 2"
        if(result.bool==false){
            event.trigger('shaHit');
        }
        else{
            event.shanRequired--;
            if(event.shanRequired>0){
                event.goto(1);
            }
            else{
                event.trigger('shaMiss');
                event.responded=result;
            }
        }
        "step 3"
        if(result.bool==false&&!event.unhurt){
            target.damage('fire',event.baseDamage+event.extraDamage);
            player.getStat().card.xinleisha++;
            event.result={bool:true}
            event.trigger('shaDamage');
        }
        else{
            event.result={bool:false}
            event.trigger('shaUnhirt');
        }
    },
                ai:{
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (){
            if(_status.event.player.hasSkillTag('presha',true,null,true)) return 10;
            return 3;
        },
                    result:{
                        target:function (player,target){
                if(player.hasSkill('jiu')&&!target.getEquip('baiyin')){
                    if(get.attitude(player,target)>0){
                        return -6;
                    }
                    else{
                        return -3;
                    }
                }
                return -1.5;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function (card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function (card){
                if(card.nature) return 1;
            },
                        fireDamage:function (card,nature){
                if(card.nature=='fire') return 1;
            },
                        poisonDamage:function (card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
        },
        translate:{
            xinleisha:"雷杀",
            "xinleisha_info":"出牌阶段，对攻击范围内的一名角色使用，令其打出一张【闪】或受到两点【雷】属性伤害。",
            xinhuosha:"火杀",
            "xinhuosha_info":"出牌阶段，对攻击范围内的一名角色使用，令其打出一张【闪】或受到三点【火】伤害。",
        },
        list:[],
    });
builder.addPack({
        skill:{
        },
        translate:{
        },
    });

} };
}
