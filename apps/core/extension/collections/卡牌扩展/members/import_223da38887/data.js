// Generated from 卡牌扩展.zip/(卡牌)天藏卡牌.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            探听:{
                audio:"true",
                enable:true,
                type:"trick",
                filterTarget:true,
                content:function (){player.viewCards('观看'+get.translation(targets[0])+'的手牌',targets[0].get('h'));
    },
                fullskin:false,
                ai:{
                    threaten:1.5,
                    result:{
                        target:function (player,target){
                return -target.num('h');
            },
                    },
                    order:10,
                    expose:0.4,
                },
            },
            仙露:{
                audio:true,
                type:"basic",
                enable:true,
                selectTarget:1,
                filterTarget:function (card,player,target){
return player==target;
},
                content:function (){
         target.gainMaxHp();
         target.recover();
},
                fullskin:false,
                ai:{
                    basic:{
                        order:7,
                        value:7,
                    },
                    result:{
                        player:1,
                    },
                },
            },
            仙人之力:{
                type:"trick",
                enable:true,
                filterTarget:function (card,player,target){
        return !target.storage.xianrenzhili;
    },
                content:function (){
        target.gainMaxHp();
        target.recover();
        target.draw(2);
        target.storage.huanwu=true;
        target.mark('xianrenzhili',{
            name:'仙人之力',
            content:'已发动'
        });
        game.addVideo('mark',target,{
            name:'仙人之力',
            content:'已发动',
            id:'xianrenzhili'
        });
    },
                ai:{
                    threaten:1.2,
                    result:{
                        target:function (player,target){
                return 1/target.hp;
            },
                    },
                    order:10,
                    expose:0.3,
                },
                audio:true,
                fullskin:false,
            },
            施毒:{
                fullskin:false,
                type:"delay",
                enable:function (card,player){
        return (lib.filter.judge(card,player,player));
    },
                filterTarget:function (card,player,target){
            return (lib.filter.judge(card,player,target)&&player!=target);    
    },
                judge:function (card){
        if(get.color(card)=='black') return -3;
        return 0;
    },
                effect:function (){
            if(result.judge) player.damage(1,'poison','nosource');
     },
                ai:{
                    basic:{
                        order:1,
                    },
                    result:{
                        target:-1,
                    },
                },
                content:function (){
        target.addJudge(card,cards);
    },
            },
            斩:{
                audio:true,
                fullskin:false,
                type:"basic",
                enable:true,
                selectTarget:1,
                filterTarget:function (card,player,target){                            if(get.distance(player,target,'attack')>1) return false;
        return target!=player;
    },
                modTarget:true,
                content:function (){
        "step 0"
        var next=target.chooseToRespond({name:'shan'});
        next.set('ai',function(card){
            var evt=_status.event.getParent();
            if(ai.get.damageEffect(evt.target,evt.player,evt.target)>=0) return 0;
                                return 1;
        });                next.autochoose=lib.filter.autoRespondShan;
        "step 1"
        if(result.bool==false){
            target.loseMaxHp();
        }
    },
                ai:{
                    basic:{
                        order:7.1,
                        useful:1,
                        value:7,
                    },
                    result:{
                        target:function (player,target){
if(target.maxHp<4) return target.maxHp-5;
return -1;
},
                    },
                },
            },
        },
        translate:{
            探听:"探听",
            探听_info:"出牌阶段，你可以观看一名角色手牌。",
            仙露:"仙露",
            仙露_info:"使目标增加一点体力上限",
            仙人之力:"仙人之力",
            仙人之力_info:"令一名角色增加一点体力上限，回复一点体力，并摸两张牌（每名角色限发动一次）",
            施毒:"施毒",
            施毒_info:"出牌阶段，对除你以外的任意一名角色使用。将【施毒】置于该角色判定区里，若判定结果为♠♣则该角色受到一点毒伤害，弃置它，若判定结果为♥♦，则直接弃置它",
            斩:"斩",
            斩_info:"出牌阶段，对攻击范围内的一名角色使用，目标必须使用一张【闪】来抵消，否则扣减一点体力上限",
        },
        list:[["spade","12","探听"],["club","11","探听"],["heart","1","仙露"],["diamond","5","仙露"],["heart","13","仙人之力"],["club","9","探听"],["club","11","探听"],["diamond","12","仙露"],["heart","13","仙人之力"],["spade","1","施毒"],["spade","6","施毒"],["club","11","施毒"],["diamond","7","斩"],["spade","7","斩"],["spade","4","斩"]],
    });
builder.addPack({
        skill:{
        },
        translate:{
        },
    });

} };
}
