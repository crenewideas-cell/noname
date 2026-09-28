// Generated from 卡牌扩展.zip/(卡牌)dota装备.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            noshengjian:{
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-8,
                },
                ai:{
                    basic:{
                        equipValue:2,
                    },
                },
                skills:["noshengjian_skill"],
                fullimage:true,
            },
            nokongao:{
                type:"equip",
                subtype:"equip2",
                onEquip:function (){
        player.gainMaxHp();
        player.markSkill('nokongao_skill');
    },
                onLose:function (){
        player.loseMaxHp();
        player.unmarkSkill('nokongao_skill');
    },
                ai:{
                    basic:{
                        equipValue:2.5,
                    },
                },
                skills:["nokongao_skill"],
                fullimage:true,
            },
            nolinken:{
                type:"equip",
                subtype:"equip2",
                ai:{
                    basic:{
                        equipValue:5,
                    },
                },
                skills:["nolinken_skill"],
                fullimage:true,
            },
            nobizhang:{
                fullimage:true,
                type:"equip",
                subtype:"equip5",
                ai:{
                    basic:{
                        equipValue:2,
                    },
                },
                skills:["nobizhang_skill"],
            },
            noxiwa:{
                type:"equip",
                subtype:"equip2",
                ai:{
                    basic:{
                        equipValue:6,
                    },
                },
                skills:["noxiwa_skill"],
                fullimage:true,
            },
            nobaoshi:{
                type:"equip",
                subtype:"equip5",
                ai:{
                    basic:{
                        equipValue:1,
                    },
                },
                skills:["nobaoshi_skill"],
                fullimage:true,
            },
        },
        translate:{
            noshengjian:"圣剑",
            "noshengjian_info":"<font color=#0f0>锁定技</font> 你造成的伤害+1；当你受到伤害后，伤害来源获得此牌",
            nokongao:"恐鳌之心",
            "nokongao_info":"<font color=#0f0>锁定技</font> 当你装备此牌时，你增加一点体力上限;当你失去此牌时，你失去一点体力上限。当你连续超过五个回合未受到过伤害，你回复一点体力",
            nolinken:"林肯法球",
            "nolinken_info":"<font color=#0f0>锁定技</font> 当你于所有角色的回合内第一次成为锦囊牌的目标时，取消之",
            nobizhang:"臂章",
            "nobizhang_info":"<font color=#0f0>锁定技</font> 回合开始时，你失去一点体力;回合结束时，若你已受伤，则你回复2点体力",
            noxiwa:"西瓦",
            "noxiwa_info":"<font color=#0f0>锁定技</font> 你不能成为[杀]的目标",
            nobaoshi:"宝石",
            "nobaoshi_info":"出牌阶段限一次，你可以观看一名其他角色的手牌",
        },
        list:[["heart","13","noshengjian"],["heart","7","nokongao"],["club","7","nolinken"],["diamond","7","nobizhang"],["spade","6","noxiwa"],["club","6","nobaoshi"],["heart","13","noshengjian"],["heart","7","nokongao"],["club","7","nolinken"],["diamond","7","nobizhang"],["spade","6","noxiwa"],["club","6","nobaoshi"]],
    });
builder.addPack({
        skill:{
            "noshengjian_skill":{
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
        return event.source&&event.source.isAlive();
    },
                forced:true,
                content:function (){
        var card = player.getCards('e',{name:'noshengjian'});
        trigger.source.gain(card);
        trigger.source.$gain2(card,player);
    },
                group:"noshengjian_skill_Damage",
                subSkill:{
                    Damage:{
                        trigger:{
                            source:"damageBefore",
                        },
                        priority:8,
                        forced:true,
                        content:function (){
                trigger.num++;
            },
                    },
                },
            },
            "nokongao_skill":{
                init:function (player){
        player.storage.nokongao_skill=0;
    },
                mark:true,
                marktext:"恐",
                intro:{
                    content:function (storage,player){
            return '已持续'+player.storage.nokongao_skill+'个回合未受到伤害';
        },
                },
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                content:function (){
        player.storage.nokongao_skill++;
        player.syncStorage('nokongao_skill');
        if(player.storage.nokongao_skill>=5)
            player.recover();
    },
                group:"nokongao_skill_Damage",
                subSkill:{
                    Damage:{
                        trigger:{
                            player:"damageEnd",
                        },
                        filter:function (event,player){
                return player.storage.nokongao_skill;
            },
                        forced:true,
                        content:function (){
                player.storage.nokongao_skill=0;
                player.syncStorage('nokongao_skill');
            },
                    },
                },
            },
            "nolinken_skill":{
                trigger:{
                    target:"useCardToBefore",
                },
                filter:function (event,player){
        return get.type(event.card)=='trick'||get.type(event.card)=='delay';
    },
                usable:1,
                forced:true,
                content:function (){
        trigger.untrigger();
        trigger.finish();
    },
            },
            "nobizhang_skill":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                content:function (){
        player.loseHp();
    },
                group:"nobizhang_skill_End",
                subSkill:{
                    End:{
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        filter:function (event,player){
                return player.isDamaged();
            },
                        content:function (){
                player.recover(2);
            },
                    },
                },
            },
            "noxiwa_skill":{
                mod:{
                    targetEnabled:function (card){
            if(card.name=='sha')return false;
        },
                },
            },
            "nobaoshi_skill":{
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return target!=player&&target.countCards('h');
    },
                logTarget:"target",
                content:function (){
        if(player==game.me){
            player.chooseCardButton('【宝石】<p>'+get.translation(target)+'的手牌</p>',target.getCards('h'),0,true).set('filterButton',function(button){
                return false;
            });
        }
        else
            event.finish();
    },
            },
        },
        translate:{
            "noshengjian_skill":"圣剑",
            "noshengjian_skill_info":"",
            "nokongao_skill":"恐鳌之心",
            "nokongao_skill_info":"",
            "nolinken_skill":"林肯法球",
            "nolinken_skill_info":"",
            "nobizhang_skill":"臂章",
            "nobizhang_skill_info":"",
            "noxiwa_skill":"西瓦",
            "noxiwa_skill_info":"",
            "nobaoshi_skill":"宝石",
            "nobaoshi_skill_info":"",
        },
    });

} };
}
