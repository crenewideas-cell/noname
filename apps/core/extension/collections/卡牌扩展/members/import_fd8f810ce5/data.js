// Generated from 奇思妙想.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {
const needToRemove =function(){
        var list=[];
        for(var i=0;i<game.players.length;i++){
            var target=game.players[i];
            if(get.attitude(this,target)<=0) continue;
            if(target.isMad()&&!list.contains('zhuolangliangkuai')) list.push('zhuolangliangkuai');
            if(target.hasSkill('gw_birinongwu')&&!list.contains('haoyueliangkuai')) list.push('haoyueliangkuai');
            if(target.hasSkill('gw_ciguhanshuang')&&!list.contains('naihanliangkuai')) list.push('naihanliangkuai');
            if(target.hasSkill('gw_baobaoshu')&&!list.contains('rongyanliangkuai')) list.push('rongyanliangkuai');
        }
        if(list.length==0) return false;
        return list;
    };
return { config: {}, build(config, builder) { builder.skill.import_card_helpers = { needToRemove }; 
builder.addPack({
        card:{
            setu:{
                fullimage:true,
                enable:true,
                type:"basic",
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                toself:true,
                content:function (){
        "step 0"
        player.loseHp();
        player.draw(3);
        if(player.hasSkill('setu_skill')) event.finish();
        "step 1"
        var list=[];
        for(var i=0;i<game.players.length;i++){
            list.push(game.players[i]);
        }
        list.remove(player);
        list.sortBySeat();
        event.list=list;
        'step 2'
        event.current=event.list.shift();
        var next=event.current.chooseToRespond({color:'red'});
        next.set('ai',function(){
            var event=_status.event;
            var rand=Math.round(Math.random()*3);
            return event.player.hp-event.player.countCards('h')-rand;
        });
        /*next.set('skillwarn','替'+get.translation(player)+'打出一张闪');
        next.autochoose=lib.filter.autoRespondShan;
        next.set('source',player);*/
        'step 3'
        if(result.bool){
            event.current.addTempSkill('setu_skill',{player:"useCardEnd"});
            event.current.useCard({name:"setu",isCard:true},event.current);
        }
        if(event.list.length&&event.list.length>0){
            event.goto(2);
        }
    },
                ai:{
                    basic:{
                        order:9,
                        useful:5,
                        value:6,
                    },
                    result:{
                        player:function (player,target){
                var rand=Math.round(Math.random()*3);
                return player.hp-player.countCards('h')-rand;
            },
                    },
                },
            },
            tiewang:{
                fullskin:true,
                type:"equip",
                subtype:"equip2",
                loseDelay:false,
                skills:["tiewang_skill1","tiewang_skill2"],
                ai:{
                    order:1,
                    equipValue:function (card,player){
            if(player.hp==player.maxHp) return 5;
            if(player.countCards('h','tiewang')) return 6;
            return 0;
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
                        value:function (card,player,index,method){
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
                        target:function (player,target,card){
                return get.equipResult(player,target,card.name);
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
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            banzhuan:{
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    equipValue:function (card,player){
            var num=player.hp-1;
            if(player&&player.hasSkillTag('reverseEquip')){
                num--;
            }
            return Math.min(num,4);
        },
                    basic:{
                        equipValue:1,
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 10-get.equipValue(card,player)/20;
                }
                else{
                    return 10+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function (card,player,index,method){
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
                        target:function (player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["banzhuan_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function (){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            yinAyang:{
                audio:true,
                fullskin:true,
                type:"basic",
                enable:true,
                selectTarget:1,
                filterTarget:function (card,player,target){
        return player!=target
    },
                content:function (){
        "step 0"
        target.judge();
        'step 1'
        if(result.color=='black'){
            if(!target.storage.yinAyang_skill){
                target.storage.yinAyang_skill=0;
            }
            target.storage.yinAyang_skill++;
            target.markSkill('yinAyang_skill');
            event.trigger('yinAyang_skill');
        }
    },
                ai:{
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:1,
                    result:{
                        target:function (player,target,card,isLink){
                if(!target.storage.yinAyang_skill
                   ||target.storage.yinAyang_skill<target.hp){
                    if(get.attitude(player,target)>0){
                        return -7;
                    }
                    else{
                        return -4;
                    }
                }
                return -1;
            },
                    },
                },
            },
            buguo:{
                type:"basic",
                global:"buguo_skill",
                content:function (){
        'step 0'
        if(Array.isArray(player.storage.buguo_skill)){
            player.judge();
        }
        else{
            event.finish();
        }
        "step 1"
        if(result.color=='red'){
            player[player.storage.buguo_skill[0]](player.storage.buguo_skill[1]);
        }
        else{
            player.say("啧，，，不过如此（酸）");
        }
    },
                ai:{
                    order:1,
                    useful:6,
                    value:6,
                    result:{
                        player:function (player,target,card){
                if(Array.isArray(player.storage.buguo_skill)){
                    if(player.storage.buguo_skill[0]=='recover'
                       &&player.isHealthy()) return 0;
                    return 1;
                }
                return 0;
            },
                    },
                },
                fullimage:true,
            },
            zhenxiang:{
                type:"trick",
                global:"zhenxiang_skill",
                content:function (){
        player.say("我就是饿死，死外边，从这里跳下去，也不会吃你们一点东西！");
        game.log(get.translation(player)+"立下了flag");
        player.addSkill('zhenxiang_skill2');
    },
                ai:{
                    order:1,
                    useful:10,
                    value:5,
                    result:{
                        player:function (player,target){
                var chaofan=0;
                for(var i=0;i<player.getCards('h');i++){
                    if(game.filterPlayer(function(current){
                        return player.canUse(player.getCards('h')[i],current);
                    })) chaofan++;
                }
                return Math.floor(Math.random()*2)-chaofan;
            },
                    },
                },
                fullimage:true,
            },
            tuichang:{
                enable:true,
                type:"basic",
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                toself:true,
                content:function (){
        "step 0"
        game.checkResult=function(all){};
        player.say("带不动，告辞");
        player.die();
        "step 1"
        game.over("平局");
        setTimeout(function(){
            game.reload();
        },3000);
    },
                ai:{
                    basic:{
                        order:10,
                        useful:10,
                        value:10,
                    },
                    result:{
                        player:function (player,target){
                return -10;
                var f=game.countPlayer(function(current){
                    return get.attitude(player,current)>0;
                });
                var e=game.countPlayer(function(current){
                    return get.attitude(player,current)<0;
                });
                if(e-f>1) return 1;
                return 0;
            },
                    },
                },
                fullskin:true,
            },
            jk:{
                fullskin:true,
                type:"equip",
                subtype:"equip2",
                filterTarget:function (card,player,target){
        return player!=target;
    },
                selectTarget:1,
                toself:false,
                loseDelay:false,
                onEquip:function (){
        if(!player.name2&&player.sex!='female'){
            player.storage.jk=[player.name,player.maxHp];
            var list=get.gainableCharacters(function(info){
                return info[0]=='female';
            });
            game.log('<span class="bluetext">'+get.translation(player)+'</span>'+"被迫穿上了女装！");
            player.reinit(player.name,list.randomGet());
        }
    },
                onLose:function (){
        if(player.storage.jk&&!player.name2){
            game.log('<span class="bluetext">'+get.translation(player)+'</span>'+"的女装大佬身份暴露了！");
            player.reinit(player.name,player.storage.jk[0]);
            player.maxHp=player.storage.jk[1];
            player.update();
            delete player.storage.jk;
        }
    },
                ai:{
                    order:9.5,
                    equipValue:function (card,player){
            if(get.position(card)=='e'){
                if(player.sex!='male') return 0;
                var num=player.countCards('he',function(cardx){
                    return cardx!=card;
                });
                if(num==0) return 0;
                return 4/num;
            }
            return 1;
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
                        value:function (card,player,index,method){
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
                        keepAI:true,
                        target:function (player,target){
                if(target.sex=='male'){
                    var val=0;
                    var card=target.getEquip(2);
                    if(card) val=get.value(card);
                    var num=target.countCards('he',function(cardx){
                        return cardx!=card
                    });
                    if(num>0) val+=4/num;
                    return -val;
                }
                return 0;
            },
                    },
                },
                enable:true,
                modTarget:true,
                allowMultiple:false,
                content:function (){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
            },
            daotu:{
                type:"trick",
                global:"daotu_skill",
                content:function (){
        if(Array.isArray(player.storage.daotu_skill)){
            var fake=game.createCard(player.storage.daotu_skill[0]);
            player.gain(fake,'gain2');
        }
    },
                ai:{
                    order:10,
                    useful:5,
                    value:5,
                    result:{
                        player:function (player,target,card){
                if(Array.isArray(player.storage.daotu_skill)){
                    return player.storage.daotu_skill[1]-5;
                }
                return 0;
            },
                    },
                },
                fullskin:true,
            },
            zuoyou:{
                type:"trick",
                enable:true,
                selectTarget:1,
                filterTarget:function (card,player,target){
        return target!=player
    },
                content:function (){
        player.addSkill('zuoyou_skill');
        var num=0;
        var current=player;
        do{
            current=current.nextSeat;
            num++;
        }while(current!=target);
        if(!player.storage.zuoyou_skill) player.storage.zuoyou_skill=num;
        else player.storage.zuoyou_skill+=num;
        for(var i=0;i<num;i++){
            game.swapSeat(player,player.nextSeat,false);
        }
    },
                ai:{
                    basic:{
                        useful:5,
                        value:1,
                    },
                    order:10,
                    result:{
                        target:function (player,target){
                if(get.distance(player,target)>1) return -1;
                return 0;
            },
                    },
                },
                fullimage:true,
            },
            benniao:{
                global:["benniao_skill1","benniao_skill2"],
                type:"basic",
                ai:{
                    basic:{
                        value:10,
                    },
                },
                fullskin:true,
            },
            chaofeng:{
                type:"trick",
                global:"chaofeng_skill",
                content:function (){
        'step 0'
        if(player.storage.chaofeng_skill){
            event.target=player.storage.chaofeng_skill;
            player.say("拜托，你很弱啊");
            event.target.chooseToUse(function(card){
                return card.name=='sha';
            },get.prompt('chaofeng_skill',player),player,-1);
        }
        else event.finish();
        'step 1'
        if(result.bool){
            
        }
        else  event.target.damage(1,player);
    },
                ai:{
                    order:10,
                    useful:5,
                    value:3,
                    result:{
                        target:-2,
                        player:function (player,target,card){
                if(player.countCards('h','shan')) return 0;
                return -5;
            },
                    },
                },
                fullimage:true,
            },
            jieyuanCard:{
                type:"trick",
                enable:true,
                filterTarget:function (card,player,target){
        return (target.sex=='male'&&player.sex=='female')
            ||(target.sex=='female'&&player.sex=='male');
    },
                content:function (){
        if(target.isDamaged()) target.recover();
        if(player.isDamaged()) player.recover();
    },
                ai:{
                    order:10,
                    result:{
                        target:function (player,target){
                return target.maxHp-target.hp;
            },
                        player:function (player,target){
                return player.maxHp-player.hp;
            },
                    },
                },
                fullskin:true,
            },
            younei:{
                type:"trick",
                enable:true,
                filterTarget:true,
                content:function (){
        var nei=['nei','rnei','bnei'];
        if(nei.contains(target.identity)){
            target.identityShown=true;
            player.draw(3);
        }
        else player.chooseToDiscard(1,true);
    },
                ai:{
                    order:9,
                    result:{
                        target:-1,
                    },
                },
                fullimage:true,
            },
            tansuoshiguang:{
                toself:true,
                type:"basic",
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function (){
        'step 0'
        event.card=ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)];
        player.showCards(event.card);
        'step 1'
        if(!player.hasCard({type:get.type(event.card,'trick')})){
            event.goto(0);
            player.gain(event.card,'draw');
        }
        else{
            player.gain(event.card,'draw');
        }
    },
                ai:{
                    order:9.5,
                    value:7,
                    useful:3,
                    result:{
                        target:1,
                    },
                },
                fullskin:true,
            },
            xinhuazidian:{
                fullskin:true,
                type:"equip",
                subtype:"equip5",
                skills:["xinhuazidian_skill1","xinhuazidian_skill2"],
                onLose:function (){
        player.unmarkSkill('xinhuazidian_skill1');
    },
                filterLose:function (card,player){
        if(player.hasSkillTag('unequip2')) return false;
        return true;
    },
                ai:{
                    basic:{
                        equipValue:10,
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function (card,player,index,method){
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
                        target:function (player,target,card){
                return get.equipResult(player,target,card.name);
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
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            tongse:{
                enable:true,
                type:"basic",
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                toself:true,
                content:function (){
        player.recover();
        if(!player.hasSkill('tongse_yihua')) player.addTempSkill('tongse_yihua',{player:"damageAfter"});
    },
                ai:{
                    basic:{
                        order:10,
                        useful:7,
                        value:6,
                    },
                    result:{
                        player:function (player,target){
                if(player.isHealthy()) return 0;
                return 2;
            },
                    },
                },
                fullskin:true,
            },
            Cbaby:{
                audio:true,
                fullskin:true,
                type:"delay",
                modTarget:function (card,player,target){
        return lib.filter.judge(card,player,target);
    },
                enable:function (card,player){
        return player.canAddJudge(card);
    },
                filterTarget:function (card,player,target){
        return (lib.filter.judge(card,player,target)&&player==target);
    },
                selectTarget:[-1,-1],
                judge:function (card){
        switch(get.suit(card)){
            case 'heart':return 1;
            case 'diamond':return 0;
            default:return -6;
        }
    },
                effect:function (){
        if(result.judge>0) player.addJudgeNext(card);
        if(result.judge==0) player.addJudge(card);
        if(result.judge<0) {
            player.addJudge(card);
            player.useCard({name:'yinAyang',isCard:true},player,true);
        }
        
    },
                cancel:function (){
        player.addJudge(card);
    },
                ai:{
                    basic:{
                        order:1,
                        useful:0,
                        value:0,
                    },
                    result:{
                        target:function (player,target){
                return lib.card.shandian.ai.result.target(player,target);
            },
                    },
                },
                content:function (){
        if(lib.filter.judge(card,player,target)&&cards.length&&get.position(cards[0],true)=='o') target.addJudge(card,cards);
    },
                allowMultiple:false,
            },
            Cteen:{
                audio:true,
                fullskin:true,
                type:"delay",
                modTarget:function (card,player,target){
        return lib.filter.judge(card,player,target);
    },
                enable:function (card,player){
        return player.canAddJudge(card);
    },
                filterTarget:function (card,player,target){
        return (lib.filter.judge(card,player,target)&&player==target);
    },
                selectTarget:[-1,-1],
                judge:function (card){
        switch(get.suit(card)){
            case 'heart':return 6;
            case 'diamond':return 3;
            case 'club':return -3;
            case 'spade':return -6;
        }
    },
                effect:function (){
        switch(result.judge){
            case 6:
                player.addJudgeNext(card);
                player.recover();
                break;
            case 3:
                player.addJudge(card);
                if(player.countCards('h')){
                    var card=player.getCards('h').randomGet();
                    card.init({name:'yinAyang'});
                }
                break;
            case -3:
                player.addJudge(card);
                if(player.countCards('h')){
                    var card=player.getCards('h').randomGet();
                    card.init({name:'du'});
                }
                break;
            case -6:
                player.addJudge(card);
                if(!player.storage.yinAyang_skill){
                    player.storage.yinAyang_skill=0;
                }
                player.storage.yinAyang_skill++;
                player.markSkill('yinAyang_skill');
                event.target=player;
                event.trigger('yinAyang_skill');
        }
    },
                cancel:function (){
        player.addJudgeNext(card);
    },
                ai:{
                    basic:{
                        order:1,
                        useful:0,
                        value:0,
                    },
                    result:{
                        target:function (player,target){
                return lib.card.shandian.ai.result.target(player,target);
            },
                    },
                },
                content:function (){
        if(lib.filter.judge(card,player,target)&&cards.length&&get.position(cards[0],true)=='o') target.addJudge(card,cards);
    },
                allowMultiple:false,
            },
            xianyu:{
                type:"equip",
                subtype:"equip5",
                skills:["xianyu_skill"],
                filterTarget:function (card,player,target){
        return player!=target;
    },
                selectTarget:1,
                toself:false,
                loseDelay:false,
                ai:{
                    order:9.5,
                    equipValue:function (card,player){
            if(get.position(card)=='e'){
                if(player.sex!='male') return 0;
                var num=player.countCards('he',function(cardx){
                    return cardx!=card;
                });
                if(num==0) return 0;
                return 4/num;
            }
            return 1;
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
                        value:function (card,player,index,method){
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
                        keepAI:true,
                        target:function (player,target){
                if(target.sex=='male'){
                    var val=0;
                    var card=target.getEquip(2);
                    if(card) val=get.value(card);
                    var num=target.countCards('he',function(cardx){
                        return cardx!=card
                    });
                    if(num>0) val+=4/num;
                    return -val;
                }
                return 0;
            },
                    },
                },
                enable:true,
                modTarget:true,
                allowMultiple:false,
                content:function (){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                fullimage:true,
            },
            jingshen:{
                global:"jingshen_skill",
                type:"trick",
                enable:true,
                filterTarget:function (card,player,target){
        return target==player;
    },
                selectTarget:-1,
                content:function (){
        player.damage('nosource');
    },
                ai:{
                    value:1,
                    useful:1,
                    result:{
                        target:0,
                    },
                    order:1,
                },
                fullimage:true,
            },
        },
        translate:{
            setu:"涩兔",
            "setu_info":"流失一点体力，然后摸三张牌；其他玩家可以打出一张红色牌，视为使用一张不会触发此效果的【涩兔】</br><span style=\"color:#ADD8E6\">创意来源：俺杀</span>",
            tiewang:"铁王八",
            "tiewang_info":"锁定技，当你受到伤害时，若伤害来源的手牌数不大于3，此伤害-1；出牌阶段你只能使用一张牌。</br><span style=\"color:#ADD8E6\">创意来源：枫枫</span>",
            banzhuan:"板砖",
            "banzhuan_info":"锁定技，此牌进入你的装备区时，你受到随机1-2点伤害；出牌阶段，你可以将装备区中的此牌移动至攻击范围内的一名角色的装备区。</br><span style=\"color:#ADD8E6\">创意来源：枫枫</span>",
            yinAyang:"阴阳",
            "yinAyang_info":"出牌阶段对一名角色使用，其进行判断，若为黑色，其永久减少一点手牌上限</br><span style=\"color:#ADD8E6\">创意来源：俺杀</span>",
            buguo:"不过如此",
            "buguo_info":"当其它角色回复体力或摸牌后，你可以打出此牌，然后进行一次判定，若结果为红色，你也执行相同的效果，否则发出一条消息：不过如此</br><span style=\"color:#ADD8E6\">创意来源：枫枫</span>",
            zhenxiang:"真香定律",
            "zhenxiang_info":"出牌阶段开始时，打出此牌，表示你本回合不会使用任何一张牌，且结束阶段开始时，若你于出牌阶段没有出牌，则你随机获得一项正面效果。</br><span style=\"color:#ADD8E6\">创意来源：伯乐不在</span>",
            tuichang:"退场砒霜",
            "tuichang_info":"当你看到己方太菜，你已无力回天。你可以对自己使用；你立即死亡，且当前战绩作废，自动开启下一场。</br><span style=\"color:#ADD8E6\">创意来源：伯乐不在</span>",
            jk:"jk制服",
            "jk_info":"锁定技，当此牌进入你的装备区时，若你的性别不为女性且没有双将，则你随机变身为一名女性武将；当此牌离开你的装备区时，若你因此牌变身为女性武将，则你变回原来的武将。</br><span style=\"color:#ADD8E6\">创意来源：俺杀</span>",
            daotu:"盗图",
            "daotu_info":"当其他角色使用一张基本牌或非延时锦囊牌后使用，你获得一张此牌的复制</br><span style=\"color:#ADD8E6\">创意来源：枫枫</span>",
            zuoyou:"左右横跳",
            "zuoyou_info":"出牌阶段你可以移动到任意两个武将之间 弃牌阶段结束后返回原位</br><span style=\"color:#ADD8E6\">创意来源：南辞</span>",
            benniao:"笨鸟",
            "benniao_info":"当你拥有此牌时生效；每轮开始时，你额外开始一个回合；你的回合摸牌数始终为一</br><span style=\"color:#ADD8E6\">创意来源：俺杀</span>",
            chaofeng:"嘲讽",
            "chaofeng_info":"当你闪避其他角色对你使用的杀后，你可以打出此牌，并说一句“拜托，你很弱啊”，其需立即对你使用一张杀，否则受到一点伤害</br><span style=\"color:#ADD8E6\">创意来源：泡泡</span>",
            jieyuanCard:"结缘",
            "jieyuanCard_info":"你可以选择一名异性角色。你与其各回复一点体力。</br><span style=\"color:#ADD8E6\">创意来源：泡泡</span>",
            younei:"有内鬼",
            "younei_info":"选择一名目标，若其身份为内奸，则其明示身份，然后你摸三张牌；若其身份不为内奸，则你弃置一张牌</br><span style=\"color:#ADD8E6\">创意来源：只影</span>",
            tansuoshiguang:"探索时光",
            "tansuoshiguang_info":"出牌阶段对你自己使用，随机获得一张牌并展示之，若你手牌中不含与此牌类别相同的牌，则你重复此流程</br><span style=\"color:#ADD8E6\">创意来源：俺杀</span>",
            xinhuazidian:"禁术秘典",
            "xinhuazidian_info":"当你造成伤害，受到伤害或流失体力后，你增加等量的“魄”标记；出牌阶段，你可以消耗1~3个“魄”标记进行【炼金】</br><span style=\"color:#ADD8E6\">创意来源：南辞</span>",
            tongse:"瞳色浆果",
            "tongse_info":"出牌阶段对自己使用，回复一点体力，然后获得【瞳】标记直到受到伤害</br><span style=\"color:#ADD8E6\">创意来源：南辞</span>",
            Cbaby:"幼章鱼",
            "Cbaby_info":"出牌阶段，对你使用。将【幼章鱼】放置于你的判定区里，若判定结果：（1）为红桃，转移到下家；（2）为红方，无事发生；（3）为梅花或黑桃，你对自己使用一张【阴阳】</br><span style=\"color:#ADD8E6\">创意来源：只影</span>",
            Cteen:"青年章鱼",
            "Cteen_info":"出牌阶段，对你使用。将【青年章鱼】放置于你的判定区里，若判定结果：（1）为红桃，你回复一点体力，此牌转移到下家；（2）为红方，随机一张手牌变化为【阴阳】；（3）为梅花，随机一张手牌变化为【毒】；（4）黑桃，增加一枚【阴阳】标记</br><span style=\"color:#ADD8E6\">创意来源：只影</span>",
            xianyu:"咸鱼",
            "xianyu_info":"锁定技，你的摸牌数和手牌上限+1，且你跳过出牌阶段</br><span style=\"color:#ADD8E6\">创意来源：泡泡</span>",
            jingshen:"精神小伙",
            "jingshen_info":"出牌阶段使用，对自己造成一点伤害。此卡牌无法被弃置。</br><span style=\"color:#ADD8E6\">创意来源：潜水</span>",
        },
        list:[["heart","1","setu"],["heart","2","setu"],["club","1","tiewang"],["diamond","1","banzhuan"],["club","2","yinAyang"],["club","3","yinAyang"],["diamond","2","buguo"],["diamond","3","buguo"],["diamond","4","zhenxiang"],["diamond","5","zhenxiang"],["spade","1","tuichang"],["club","4","jk"],["diamond","6","daotu"],["club","5","daotu"],["spade","2","zuoyou"],["spade","3","benniao"],["spade","4","chaofeng"],["spade","5","chaofeng"],["heart","3","jieyuanCard"],["heart","4","jieyuanCard"],["club","5","younei"],["spade","5","younei"],["heart","5","tansuoshiguang"],["heart","6","tansuoshiguang"],["spade","6","xinhuazidian"],["club","6","xinhuazidian"],["heart","2","setu"],["club","7","tongse"],["spade","7","tongse"],["club","8","Cbaby"],["diamond","7","xianyu"],["spade","8","jingshen"]],
    });
builder.addPack({
        skill:{
            "tiewang_skill2":{
                equipSkill:true,
                trigger:{
                    player:"useCardEnd",
                },
                forced:true,
                filter:function (event,player){
        if(player!=_status.currentPhase) return false;
        if(player.countUsed()<1) return false;
        if(player.hasSkillTag('unequip2')) return false;
        if(event.source&&event.source.hasSkillTag('unequip',false,{
            name:event.card?event.card.name:null,
            target:player,
            card:event.card
        })) return false;
        return true;
    },
                content:function (){
        var evt=_status.event.getParent('phaseUse');
        if(evt&&evt.name=='phaseUse'){
            evt.skipped=true;
        }
    },
            },
            "tiewang_skill1":{
                equipSkill:true,
                trigger:{
                    player:"damageBegin4",
                },
                forced:true,
                filter:function (event,player){
        if(event.num<1) return false;
        if(player.hasSkillTag('unequip2')) return false;
        if(event.player&&event.player.hasSkillTag('unequip',false,{
            name:event.card?event.card.name:null,
            target:player,
            card:event.card
        })) return false;
        if(!event.source||event.source.countCards('h')>3)  return false;
        return true;
    },
                content:function (){
        trigger.num--;
    },
                ai:{
                    filterDamage:true,
                    skillTagFilter:function (player,tag,arg){
            if(player.hasSkillTag('unequip2')) return false;
            if(arg&&arg.player){
                if(arg.player.hasSkillTag('unequip',false,{
                    name:arg.card?arg.card.name:null,
                    target:player,
                    card:arg.card,
                })) return false;
                if(arg.player.hasSkillTag('unequip_ai',false,{
                    name:arg.card?arg.card.name:null,
                    target:player,
                    card:arg.card,
                })) return false;
                if(arg.player.hasSkillTag('jueqing',false,player)) return false;
            }
        },
                },
            },
            "banzhuan_skill":{
                enable:"phaseUse",
                popup:false,
                filter:function (event,player){
        var current=player.getEquip('equip1');
        if(!current||current.name!='banzhuan'){
            return false;
        }
        return true;
    },
                filterTarget:function (card,player,target){
        return player!=target&&player.inRange(target);;
    },
                content:function (){
        var c=player.getEquip('equip1');
        player.$give(c,target);
        target.equip(c);
    },
                ai:{
                    order:11,
                    result:{
                        target:-1,
                    },
                },
            },
            "yinAyang_skill":{
                mark:true,
                intro:{
                    content:function (storage,player){
            if(!storage) return;
            return '减少'+storage+'点手牌上限';
        },
                    markcount:function (storage,player){
            return storage;
        },
                },
            },
            "buguo_skill":{
                trigger:{
                    global:["drawAfter","recoverAfter"],
                },
                direct:true,
                filter:function (event,player){
        if(event.player==player) return false;
        if(event.parent.name=='buguo_skill') return false;
        if(player.hasCard('buguo')) return true;
        return false;
    },
                content:function (){
        'step 0'
        player.storage.buguo_skill=[trigger.name,trigger.num];
        player.chooseToUse('是否使用【不过如此】？',function(card,player){
            if(card.name!='buguo') return false;
            return lib.filter.cardEnabled(card,player,'forceEnable');
        },player,-1);
        'step 1'
        delete player.storage.buguo_skill;
    },
            },
            "zhenxiang_skill":{
                trigger:{
                    player:"phaseUseBegin",
                },
                direct:true,
                filter:function (event,player){
        if(player.hasCard('zhenxiang')) return true;
        return false;
    },
                content:function (){
        player.chooseToUse('是否使用【真香定律】？',function(card,player){
            if(card.name!='zhenxiang') return false;
            return lib.filter.cardEnabled(card,player,'forceEnable');
        },player,-1);
    },
            },
            "zhenxiang_skill2":{
                trigger:{
                    player:["useCardBegin","phaseUseEnd"],
                },
                temp:true,
                forced:true,
                content:function (){
        'step 0'
        if(trigger.name=='phaseUse'){
            player.getBuff();
            
        }
        else{
            player.say("真香！");
        }
        player.removeSkill('zhenxiang_skill2');
    },
            },
            "setu_skill":{
            },
            "daotu_skill":{
                trigger:{
                    global:"useCardEnd",
                },
                direct:true,
                filter:function (event,player){
        if(event.player==player) return false;
        var type=get.type(event.card,'trick');
        if(type!='trick'&&type!='basic') return false;
        if(player.hasCard('daotu')) return true;
        return false;
    },
                content:function (){
        'step 0'
        player.storage.daotu_skill=[
            trigger.card.name,
            get.value(trigger.card)
        ];
        player.chooseToUse('是否使用【盗图】以获取'+get.translation(trigger.card)+'的复制？',function(card,player){
            if(card.name!='daotu') return false;
            return lib.filter.cardEnabled(card,player,'forceEnable');
        },player,-1);
        'step 1'
        delete player.storage.daotu_skill;
    },
            },
            "zuoyou_skill":{
                trigger:{
                    global:"phaseDiscardEnd",
                },
                forced:true,
                silent:true,
                content:function (){
        var num=player.storage.zuoyou_skill;
        for(var i=0;i<num;i++){
            game.swapSeat(player,player.previousSeat,false);
        }
        player.removeSkill('zuoyou_skill');
        delete player.storage.zuoyou_skill;
    },
                popup:false,
            },
            "benniao_skill1":{
                trigger:{
                    global:"roundStart",
                },
                filter:function (event,player){
        if(!player.storage.round) player.storage.round=0;
        return player.hasCard('benniao')
            &&player.storage.round!=game.roundNumber
    },
                content:function (){
        player.storage.round=game.roundNumber;
        game.roundNumber--;
        player.phase();
    },
            },
            "benniao_skill2":{
                trigger:{
                    player:"phaseDrawBegin",
                },
                direct:true,
                filter:function (event,player){
        if(player.hasCard('benniao')) return true;
        return false;
    },
                content:function (){
        trigger.num=1;
        trigger._triggered=null;
    },
            },
            "chaofeng_skill":{
                trigger:{
                    global:"shaMiss",
                },
                priority:1,
                direct:true,
                filter:function (event,player){
        return player.hasCard('chaofeng')
            &&event.player!=player&&event.target==player
    },
                content:function (){
        'step 0'
        player.storage.chaofeng_skill=trigger.player;
        player.chooseToUse('是否对'+get.translation(trigger.player)+'使用【嘲讽】？',function(card,player){
            if(card.name!='chaofeng') return false;
            return lib.filter.cardEnabled(card,player,'forceEnable');
        },player,-1);
        'step 1'
        delete player.storage.chaofeng_skill;
    },
            },
            zibi:{
                trigger:{
                    player:"phaseDrawBegin",
                },
                priority:1,
                forced:true,
                content:function (){
        var num=player.getFriends().length;
        trigger.num=4-num;
        trigger._triggered=null;
    },
            },
            reqingZ:{
                locked:true,
                mod:{
                    cardname:function (card, player, name) {
            if(player.getFriends().length>0) return;
            if (lib.card[card.name].type == 'basic') return 'sha';
            if (lib.card[card.name].type == 'trick') return 'juedou';
            if (lib.card[card.name].type == 'delay') return 'guohe';
        },
                    selectTarget:function (card, player, range) {
            if(player.getFriends().length>0) return;
            range[1] = game.countPlayer();
        },
                    cardUsable:function (card, player) {
            if(player.getFriends().length>0) return;
            return true;
        },
                    targetInRange:function (card, player, target) {
            if(player.getFriends().length>0) return;
            return true;
        },
                },
            },
            kushou:{
                trigger:{
                    source:"damageBegin1",
                },
                forced:true,
                filter:function (event,player){
        return event.card&&get.type(event.card,'trick')!='basic'
    },
                content:function (){
        trigger.num--;
    },
            },
            tianranhei:{
                enable:"phaseUse",
                usable:1,
                locked:true,
                filterTarget:function (card,player,target){
        return target!=player;
    },
                selectTarget:[1,3],
                content:function (){
        "step 0"
        if(target.countCards('he')){
            var next=target.chooseControl();
            next.set('prompt',get.translation('mem_boss_wx'));
            next.set('choiceList',[
                '交给'+get.translation(player)+'一张牌','流失一点体力，然后摸一张牌'
            ],function(){
                if(target.hp>2) return 1;
                return 0;
            });
        }
        else{
            event.directfalse=true;
        };
        "step 1"
        if(event.directfalse||result.control=='选项二'){
            target.loseHp();
            target.draw();
            event.finish();
        }
        else{
            target.chooseCard('交给'+get.translation(player)+'一张牌','he',true).ai=function(card){
                return 3-get.value(card);
            }
        }
        'step 2'
        if(result.bool){
            target.$give(result.cards,player);
            player.gain(result.cards,target);
        }
    },
                ai:{
                    order:10,
                    result:{
                        target:-1,
                    },
                    threaten:0.5,
                },
            },
            tuoyan:{
                trigger:{
                    player:["phaseBegin","phaseJieshuBegin"],
                },
                direct:true,
                filter:function (event,player){
        return player.hp>3
    },
                content:function (){
        if(trigger.name=='phase') player.skip('phaseUse');
        else player.phaseUse();
    },
            },
            fenqi:{
                group:["fenqi_yingzi","fenqi_sha","fenqi_shan","fenqi_paoxiao"],
                subSkill:{
                    yingzi:{
                        trigger:{
                            player:"phaseDrawBegin2",
                        },
                        frequent:true,
                        filter:function (event,player){
                return player.hp<4&&!event.numFixed;
            },
                        content:function (){
                trigger.num++;
            },
                        sub:true,
                    },
                    sha:{
                        audio:2,
                        audioname:["re_zhaoyun"],
                        enable:["chooseToUse","chooseToRespond"],
                        filterCard:{
                            name:"shan",
                        },
                        viewAs:{
                            name:"sha",
                        },
                        viewAsFilter:function (player){
                if(!player.countCards('h','shan')) return false;
            },
                        filter:function (event,player){
                return player.hp<3;
            },
                        prompt:"将一张闪当杀使用或打出",
                        check:function (){return 1},
                        sub:true,
                        ai:{
                            basic:{
                                useful:[5,1],
                                value:[5,1],
                            },
                            order:function (item){
                    if(_status.event.player.hasSkillTag('presha',true,null,true)) return 10;
                    if(lib.linked.contains(get.nature(item))) return 3.1;
                    return 3;
                },
                            result:{
                                target:function (player,target,card,isLink){
                        if(!isLink&&player.hasSkill('jiu')&&!target.hasSkillTag('filterDamage',null,{
                            player:player,
                            card:card,
                            jiu:true,
                        })){
                            if(get.attitude(player,target)>0){
                                return -7;
                            }
                            else{
                                return -4;
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
                                thunderDamage:function (card,nature){
                        if(card.nature=='thunder') return 1;
                    },
                                poisonDamage:function (card,nature){
                        if(card.nature=='poison') return 1;
                    },
                            },
                        },
                    },
                    shan:{
                        audio:"longdan_sha",
                        audioname:["re_zhaoyun"],
                        enable:["chooseToRespond","chooseToUse"],
                        filterCard:{
                            name:"sha",
                        },
                        viewAs:{
                            name:"shan",
                        },
                        prompt:"将一张杀当闪使用或打出",
                        check:function (){return 1},
                        viewAsFilter:function (player){
                if(!player.countCards('h','sha')) return false;
            },
                        filter:function (event,player){
                return player.hp<3;
            },
                        sub:true,
                        ai:{
                            basic:{
                                useful:[7,2],
                                value:[7,2],
                            },
                            result:{
                                player:1,
                            },
                        },
                    },
                    paoxiao:{
                        audio:2,
                        firstDo:true,
                        audioname:["re_zhangfei","guanzhang","xiahouba"],
                        trigger:{
                            player:"useCard1",
                        },
                        forced:true,
                        filter:function (event,player){
                return player.hp<2&&!event.audioed
                    &&event.card.name=='sha'
                    &&player.countUsed('sha',true)>1
                    &&event.getParent().type=='phase';
            },
                        content:function (){
                trigger.audioed=true;
            },
                        sub:true,
                    },
                },
                init:function (player){
        lib.translate.fenqi_yingzi=lib.translate.yingzi;
        lib.translate.fenqi_sha=lib.translate.longdan;
        lib.translate.fenqi_shan=lib.translate.longdan;
        lib.translate.fenqi_paoxiao=lib.translate.paoxiao;
    },
                locked:true,
                mark:true,
                intro:{
                    content:function (storage,player){
            var str='暂无任何效果';
            if(player.hp<4){
                str='<li>视为拥有技能【英姿】';
            }
            if(player.hp<3){
                str+='；视为拥有技能【龙胆】';
            }
            if(player.hp<2){
                str+='；视为拥有技能【咆哮】';
            }
            return str;
        },
                },
                mod:{
                    cardUsable:function (card,player,num){
            if(player.hp<2&&card.name=='sha') return Infinity;
        },
                },
            },
            tuifan:{
                trigger:{
                    target:"useCardToTarget",
                },
                locked:true,
                direct:true,
                content:function (){
        'step 0'
        player.chooseTarget(1,false,get.prompt2('tuifan'),function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            if(target.countCards('he')==0) return false;
            var att=get.attitude(event.player,target);
            return att;
        });
        'step 1'
        if(result.bool){
            event.target=result.targets[0];
            player.logSkill('tuifan',event.target);
            event.target.chooseToDiscard(1,'he',false).set('ai',function(card){
                var val=get.value(card)/2;
                if(!player.isHealthy()&&get.color(card)=='red'){
                    return 10-val;
                }
                if(get.color(card)=='red'){
                    return -val;
                }
                return 7-val;
            });
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.bool){
            var color=get.color(result.cards[0]);
            if(color=='red'){
                player.recover();
                event.target.recover();
            }
            else{
                player.draw();
                event.target.draw();
            }
        }
    },
            },
            duanhua:{
                trigger:{
                    player:["phaseBegin","phaseJieshuBegin"],
                },
                forced:true,
                content:function (){
        'step 0'
        if(trigger.name=='phaseJieshu') event.goto(2);
        'step 1'
        var list=get.gainableSkills(function(info,skill){
            return !info.notemp&&info.enable&&info.enable=="phaseUse"&&!player.hasSkill(skill);
        });
        if(list.length){
            var skill=list.randomGet();
            player.popup(skill);
            player.addTempSkill(skill,{player:'phaseEnd'});
        }
        event.finish();
        'step 2'
        var list=get.gainableSkills(function(info,skill){
            return !info.notemp&&info.ai&&info.ai.maixie_hp&&!player.hasSkill(skill);
        });
        list.remove('guixin');
        if(list.length){
            var skill=list.randomGet();
            player.popup(skill);
            player.addTempSkill(skill,{player:'phaseBefore'});
        }
    },
            },
            "xinhuazidian_skill1":{
                trigger:{
                    player:["damageEnd","loseHpEnd"],
                    source:"damageEnd",
                },
                charlotte:true,
                onremove:function (player){
        player.unmarkSkill('xinhuazidian_skill1');
        delete player.storage.xinhuazidian_skill1;
    },
                init:function (player){
        player.markSkill('xinhuazidian_skill1');
        player.storage.xinhuazidian_skill1=0;
    },
                content:function (){
        player.storage.xinhuazidian_skill1+=trigger.num;
        player.update();
    },
                forced:true,
                mark:true,
                marktext:"魄",
                intro:{
                    name:"<span style=\"color:#2C2B2C\">精粹之魄",
                    content:function (storage){
            return '<b>您拥有的魄：</b>'+storage+'</br>——血液是灵魂的货币';
        },
                },
            },
            "xinhuazidian_skill2":{
                enable:"phaseUse",
                filter:function (event,player){
        return (player.storage.xinhuazidian_skill1
                &&player.storage.xinhuazidian_skill1>0)
    },
                init:function (){
        lib.translate.zhuolangliangkuai="浊浪量块";
        lib.translate.zhuolangliangkuai_info="解除一名角色的混乱效果";
        lib.card.zhuolangliangkuai={
            type:"yuansu",
            subtype:"yuansu1",
            fullskin:true,
            chongzhu:true,
            filterTarget:function (card,player,target){
                return target.isMad();
            },
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                target.unMad();
            },
            ai:{
                value:7,
                order:6.5,
                result:{
                    target:10,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/zhuolangliangkuai.png"
        };
        lib.translate.haoyueliangkuai="皓月量块";
        lib.translate.haoyueliangkuai_info="解除一名角色的雾效果（来自卡牌/昆特牌/蔽日浓雾）";
        lib.card.haoyueliangkuai={
            type:"yuansu",
            subtype:"yuansu1",
            fullskin:true,
            chongzhu:true,
            filterTarget:function (card,player,target){
                return target.hasSkill('gw_birinongwu');
            },
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                target.removeSkill('gw_birinongwu');
            },
            ai:{
                value:7,
                order:6.5,
                result:{
                    target:10,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/haoyueliangkuai.png"
        };
        lib.translate.naihanliangkuai="耐寒量块";
        lib.translate.naihanliangkuai_info="解除一名角色的霜效果（来自卡牌/昆特牌/刺骨寒霜&白霜）";
        lib.card.naihanliangkuai={
            type:"yuansu",
            subtype:"yuansu1",
            fullskin:true,
            chongzhu:true,
            filterTarget:function (card,player,target){
                return target.hasSkill('gw_ciguhanshuang');
            },
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                target.removeSkill('gw_ciguhanshuang');
            },
            ai:{
                value:7,
                order:6.5,
                result:{
                    target:10,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/naihanliangkuai.png"
        };
        lib.translate.rongyanliangkuai="熔岩量块";
        lib.translate.rongyanliangkuai_info="解除一名角色的雹效果（来自卡牌/昆特牌/雹暴术）";
        lib.card.rongyanliangkuai={
            type:"yuansu",
            subtype:"yuansu1",
            fullskin:true,
            chongzhu:true,
            filterTarget:function (card,player,target){
                return target.hasSkill('gw_baobaoshu');
            },
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                target.removeSkill('gw_baobaoshu');
            },
            ai:{
                value:7,
                order:6.5,
                result:{
                    target:10,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/rongyanliangkuai.png"
        };
        lib.translate.dixinliangkuai="地心量块";
        lib.translate.dixinliangkuai_info="令一名角色获得“灼”标记直到其回合结束；当其打出【闪】时，其失去“灼”标记并受到来源为你的一点火焰伤害";
        lib.card.dixinliangkuai={
            type:"yuansu",
            subtype:"yuansu1",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                target.storage.dixinliangkuai_mark=player;
                target.addTempSkill('dixinliangkuai_mark',{player:"phaseEnd"});
                target.update();
            },
            ai:{
                value:7,
                order:6.5,
                result:{
                    target:-1,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/dixinliangkuai.png"
        };
        lib.translate.yanshiliangkuai="岩石量块";
        lib.translate.yanshiliangkuai_info="令一名角色弃置若干张牌，然后获得等同于弃牌数的护甲，且至少为一";
        lib.card.yanshiliangkuai={
            type:"yuansu",
            subtype:"yuansu1",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                'step 0'
                target.chooseToDiscard('he',[0,target.countCards('he')],true).set('ai',function(card){
                    return 7-get.value(card);
                });
                'step 1'
                if(result.bool){
                    var num=Math.max(1,result.cards.length);
                    target.changeHujia(num);
                }
            },
            ai:{
                value:8,
                order:6.5,
                result:{
                    target:1,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/yanshiliangkuai.png"
        };
        lib.translate.yijiliangwan="遗迹量丸";
        lib.translate.yijiliangwan_info="令一名角色随机获得两张衍生牌";
        lib.card.yijiliangwan={
            type:"yuansu",
            subtype:"yuansu2",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                var list=[];
                for(var i in lib.card){
                    if(lib.card[i].derivation){
                        list.push(i);
                    }
                }
                if(list.length){
                    var card0=list.randomGet();
                    list.remove(card0);
                    card0=game.createCard(card0);
                    var card1=game.createCard(list.randomGet());
                    card0._destroy=true;
                    card1._destroy=true,
                    target.gain([card0,card1],'draw');
                }
            },
            ai:{
                value:7.5,
                order:6.5,
                result:{
                    target:1,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/yijiliangwan.png"
        };
        lib.translate.bishuiliangwan="碧水量丸";
        lib.translate.bishuiliangwan_info="令一名角色获得两枚“碧”标记；回合结束阶段弃置一枚标记，并摸两张牌";
        lib.card.bishuiliangwan={
            type:"yuansu",
            subtype:"yuansu2",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                if(!target.storage.bishuiliangwan_mark) target.storage.bishuiliangwan_mark=0;
                target.storage.bishuiliangwan_mark+=2;
                if(!target.hasSkill('bishuiliangwan_mark')) target.addSkill('bishuiliangwan_mark');
                target.update();
            },
            ai:{
                value:6,
                order:10,
                result:{
                    target:2,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/bishuiliangwan.png"
        };
        lib.translate.huomuliangwan="活木量丸";
        lib.translate.huomuliangwan_info="令一名角色获得两枚“活”标记；准备阶段开始时，弃置一枚标记并恢复一点体力";
        lib.card.huomuliangwan={
            type:"yuansu",
            subtype:"yuansu2",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                if(!target.storage.huomuliangwan_mark) target.storage.huomuliangwan_mark=0;
                target.storage.huomuliangwan_mark+=2;
                if(!target.hasSkill('huomuliangwan_mark')) target.addSkill('huomuliangwan_mark');
                target.update();
            },
            ai:{
                value:7.5,
                order:6.5,
                result:{
                    target:function(player,target){
                        if(target.isHealthy()) return 0;
                        return 2;
                    },
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/huomuliangwan.png"
        };
        lib.translate.feitengliangwan="沸水量丸";
        lib.translate.feitengliangwan_info="令一名角色获得两枚“沸”标记；弃牌阶段结束后，弃置一枚标记并随机弃置一张手牌";
        lib.card.feitengliangwan={
            type:"yuansu",
            subtype:"yuansu2",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                if(!target.storage.feitengliangwan_mark) target.storage.feitengliangwan_mark=0;
                target.storage.feitengliangwan_mark+=2;
                if(!target.hasSkill('feitengliangwan_mark')) target.addSkill('feitengliangwan_mark');
                target.update();
            },
            ai:{
                value:6.5,
                order:6.5,
                result:{
                    target:-1,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/feitengliangwan.png"
        };
        lib.translate.baozaonengliang="暴躁能量";
        lib.translate.baozaonengliang_info="令一名角色获得“爆”标记直到其回合结束；你的手牌均视为火焰属性，且每当使用或打出一张杀时，将对自己造成一点伤害";
        lib.card.baozaonengliang={
            type:"yuansu",
            subtype:"yuansu3",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                target.addTempSkill('baozaonengliang_mark',{player:"phaseEnd"});
            },
            ai:{
                value:9,
                order:6.5,
                result:{
                    target:-1,
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/baozaonengliang.png"
        };
        lib.translate.bianfuyaoji="蝙蝠药剂";
        lib.translate.bianfuyaoji_info="令一名角色进入潜行";
        lib.card.bianfuyaoji={
            type:"yuansu",
            subtype:"yuansu3",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                target.tempHide();
            },
            ai:{
                value:9,
                order:0.5,
                result:{
                    target:function(player,target){
                        if(target==player.next) return 0;
                        return 1;
                    },
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/bianfuyaoji.png"
        };
        lib.translate.Tvirus="病毒药剂";
        lib.translate.Tvirus_info="令一名角色的体力上限和体力调整至8，并失去所有技能，获得技能【狂骨】，【崩坏】";
        lib.card.Tvirus={
            type:"yuansu",
            subtype:"yuansu3",
            fullskin:true,
            chongzhu:true,
            filterTarget:true,
            selectTarget:1,
            toself:false,
            enable:true,
            modTarget:true,
            allowMultiple:false,
            content:function (){
                target.popup("Rua!");
                target.maxHp=8;
                target.hp=target.maxHp;
                target.removeSkill(target.getSkills());
                target.addSkill("kuanggu");
                target.addSkill("benghuai");
                target.update();
            },
            ai:{
                value:9,
                order:10,
                result:{
                    target:function(player,target){
                        if(target.hp<3) return 1;
                        return -1;
                    },
                },
            },
            image:"ext:卡牌扩展/members/import_fd8f810ce5/Tvirus.png"
        };
    },
                content:function (){
        'step 0'
        var num=player.storage.xinhuazidian_skill1
        var choiceList=[['一'],['一','二'],['一','二','三']][num<2?0:num<3?1:2];
        player.chooseControl(choiceList,true).set('prompt','选择要投入的【魄】的数量').set('choice',(!lib.skill.import_card_helpers.needToRemove.call(player)&&choiceList.length>1)?'二':'一').set('ai',function(){return _status.event.choice});
        'step 1'
        var num=result.control=='一'?1:result.control=='二'?2:3;
        player.storage.xinhuazidian_skill1-=num;
        player.update();
        var list=[];
        for(var i in lib.card){
            if(lib.card[i].subtype&&lib.card[i].subtype=="yuansu"+num){
                list.push(i);
            }
        }
        if(list.length){
            var dialog=ui.create.dialog('从列表中选择一张元素药剂牌',[list,'vcard'],'hidden');
            player.chooseButton(dialog, true).set('ai',function(button){
                var card={name:button.link[2]};
                var value=get.value(card);
                var list=lib.skill.import_card_helpers.needToRemove.call(player);
                if(list&&list.contains(button.link[2])) return value+10;
                return value;
            });
        }
        else event.finish();
        'step 2'
        if(result.bool){
            var card=game.createCard(result.buttons[0].link[2]);
            card._destroy=true,
            player.gain(card,'gain2');
        }
    },
                ai:{
                    order:0.9,
                    result:{
                        player:1,
                    },
                },
            },
            "dixinliangkuai_mark":{
                trigger:{
                    player:"useCardBegin",
                },
                forced:true,
                mark:true,
                marktext:"灼",
                nopop:true,
                intro:{
                    content:"当你打出【闪】时，你失去“灼”标记并受到一点火焰伤害",
                },
                onremove:function (player){
        player.unmarkSkill('dixinliangkuai_mark');
    },
                init:function (player){
        player.markSkill('dixinliangkuai_mark');
    },
                filter:function (event){
        return event.card.name=='shan';
    },
                content:function (){
        player.damage(1,player.storage.dixinliangkuai_mark,'fire');
        player.storage.dixinliangkuai_mark=undefined;
        delete player.storage.dixinliangkuai_mark;
        player.removeSkill('dixinliangkuai_mark');
    },
            },
            "bishuiliangwan_mark":{
                trigger:{
                    player:"phaseAfter",
                },
                forced:true,
                mark:true,
                nopop:true,
                intro:{
                    content:"回合结束阶段弃置一枚标记，并摸两张牌",
                },
                onremove:function (player){
        player.unmarkSkill('bishuiliangwan_mark');
    },
                init:function (player){
        player.markSkill('bishuiliangwan_mark');
    },
                content:function (){
        player.draw(2);
        player.storage.bishuiliangwan_mark--;
        if(player.storage.bishuiliangwan_mark<1) player.removeSkill('bishuiliangwan_mark');
        player.update();
    },
            },
            "huomuliangwan_mark":{
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                mark:true,
                nopop:true,
                onremove:function (player){
        player.unmarkSkill('huomuliangwan_mark');
    },
                init:function (player){
        player.markSkill('huomuliangwan_mark');
    },
                intro:{
                    content:"准备阶段开始时，弃置一枚标记并恢复一点体力",
                },
                content:function (){
        player.recover();
        player.storage.huomuliangwan_mark--;
        if(player.storage.huomuliangwan_mark<1) player.removeSkill('huomuliangwan_mark');
        player.update();
    },
            },
            "feitengliangwan_mark":{
                trigger:{
                    player:"phaseDiscarEnd",
                },
                forced:true,
                mark:true,
                nopop:true,
                intro:{
                    content:"弃牌阶段结束后，弃置一枚标记并随机弃置一张手牌",
                },
                onremove:function (player){
        player.unmarkSkill('feitengliangwan_mark');
    },
                init:function (player){
        player.markSkill('feitengliangwan_mark');
    },
                content:function (){
        if(player.countCards('h')) player.discard(player.getCards('h').randomGet(),true);
        player.storage.feitengliangwan_mark--;
        if(player.storage.feitengliangwan_mark<1) player.removeSkill('feitengliangwan_mark');
        player.update();
    },
            },
            "baozaonengliang_mark":{
                trigger:{
                    player:"useCardBegin",
                },
                forced:true,
                mark:true,
                nopop:true,
                intro:{
                    content:"你的手牌均视为火焰属性，且每当使用或打出一张杀时，将对自己造成一点伤害",
                },
                init:function (player){
        player.markSkill('baozaonengliang_mark');
    },
                onremove:function (player){
        player.unmarkSkill('baozaonengliang_mark');
    },
                filter:function (event){
        return event.card.name=='sha';
    },
                content:function (){
        player.damage(1,player,'fire');
    },
                mod:{
                    cardnature:function (card, player, name) {
            return 'fire';
        },
                },
            },
            "tongse_yihua":{
                enable:"phaseUse",
                filterTarget:function (card,player,target){
        return player!=target&&!target.getStat().skill.tongse_yihua;
    },
                mark:true,
                temp:true,
                onremove:function (player){
        player.unmarkSkill('tongse_yihua');
    },
                init:function (player){
        player.markSkill('tongse_yihua');
    },
                intro:{
                    mark:function (dialog,storage,player){
            var cards=player.getCards('h');
            if(cards.length) dialog.addAuto(cards);
            else return '没有手牌';
        },
                },
                content:function (){
        target.getStat().skill.tongse_yihua=1;
        player.viewHandcards(target);
    },
                ai:{
                    threaten:3,
                },
            },
            "xianyu_skill":{
                trigger:{
                    player:"phaseDrawBefore",
                },
                direct:true,
                content:function (){
        trigger.num++;
        player.skip('phaseUse');
    },
                mod:{
                    maxHandcard:function (player, num) {
            return num+1;
        },
                },
            },
            "jingshen_skill":{
                mod:{
                    cardDiscardable:function (card, player) {
            if(card.name=='jingshen') return false;
        },
                    canBeDiscarded:function (card) {
            if(card.name=='jingshen') return false;
        },
                },
            },
            shadiao:{
                trigger:{
                    player:"phaseBegin",
                },
                direct:true,
                content:function (){
        'step 0'
        trigger.cancel();
        var l0=['phaseJudge','phaseUse','phaseDiscard'];
        var l1=[];
        while(l1.length<4){
            if(l1.length==1){
                l1.push('phaseDraw');
                continue;
            }
            var c=l0.randomGet();
            l0.remove(c);
            l1.push(c);
        }
        event.shadiao=l1;
        player.logSkill('shadiao');
        'step 1'
        var c=event.shadiao.shift();
        player[c]();
        'step 2'
        if(event.shadiao.length){
            event.goto(1);
        }
    },
            },
            qiudai:{
                trigger:{
                    player:"damageBegin3",
                },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt2('qiudai'),[1,3],function(card,player,target){
            return target!=player;
        },false).ai=function(target){
            var att=get.attitude(player,target);
            if(att>0&&player.hp<=trigger.num){
                return 3;
            }
            return 1;
        };
        "step 1"
        if(result.bool){
            result.targets.sortBySeat();
            event.targets=result.targets;
            player.logSkill(event.name,result.targets);
        }
        else{
            event.finish();
        }
        'step 2'
        if(event.num==undefined){
            event.num=0;
        }
        else{
            event.num++;
        }
        if(event.num<event.targets.length){
            var temp=event.targets[event.num];
            var next=temp.chooseControl();
            next.set('prompt','要对'+get.translation(event.card)+'做什么呢？');
            next.set('choiceList',['令'+get.translation(player)+'摸一张牌','替'+get.translation(player)+'承受'+trigger.num+'点伤害']);
            next.ai=function(){
                var att=get.attitude(event.target,player);
                if(att>0&&player.hp<=trigger.num){
                    return 1;
                }
                return 0;
            };
        }
        else{
            event.finish();
        }
        'step 3'
        if(result.control=='选项一'){
            player.draw();
            event.goto(2);
        }
        else{
            trigger.cancel();
            event.target.line(player);
            event.target.damage(trigger.num,trigger.source,trigger.nature);
            event.finish();
        }
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(!target.hasFriend()) return;
                    var num=1;
                    if(get.attitude(player,target)>0){
                        if(player.needsToDiscard()){
                            num=0.7;
                        }
                        else{
                            num=0.5;
                        }
                    }
                    if(target.hp>=4) return [1,num*2];
                    if(target.hp==3) return [1,num*1.5];
                    if(target.hp==2) return [1,num*0.5];
                }
            },
                    },
                },
            },
        },
        translate:{
            "tiewang_skill2":"铁王八",
            "tiewang_skill2_info":"",
            "tiewang_skill1":"铁王八",
            "tiewang_skill1_info":"",
            "banzhuan_skill":"板砖",
            "banzhuan_skill_info":"",
            "yinAyang_skill":"阴阳",
            "yinAyang_skill_info":"",
            "buguo_skill":"不过如此",
            "buguo_skill_info":"",
            "zhenxiang_skill":"真香定律",
            "zhenxiang_skill_info":"",
            "zhenxiang_skill2":"真香flag",
            "zhenxiang_skill2_info":"",
            "setu_skill":"涩兔",
            "setu_skill_info":"",
            "daotu_skill":"盗图",
            "daotu_skill_info":"",
            "zuoyou_skill":"左右横跳",
            "zuoyou_skill_info":"",
            "benniao_skill1":"笨鸟",
            "benniao_skill1_info":"",
            "benniao_skill2":"笨鸟",
            "benniao_skill2_info":"",
            "chaofeng_skill":"嘲讽",
            "chaofeng_skill_info":"",
            zibi:"自闭",
            "zibi_info":"锁定技，你的摸牌数锁定为4-你的队友人数",
            reqingZ:"热情",
            "reqingZ_info":"锁定技，当你没有队友时，你的基本牌视为【杀】，非延时牌视为【决斗】，延时锦囊牌视为【过河】，且你出牌没有上限，没有距离限制，目标数不限",
            kushou:"苦手",
            "kushou_info":"锁定技，你的非基本牌造成的伤害始终-1",
            tianranhei:"天然",
            "tianranhei_info":"出牌阶段，你可以令至多三名角色选择：（1）交给你一张牌；（2）流失一点体力，然后摸一张牌",
            tuoyan:"拖延",
            "tuoyan_info":"当你的体力不小于4时，你的出牌阶段移至你的回合结束时",
            fenqi:"奋起",
            "fenqi_info":"当你的血量少于4时，你视为拥有技能【英姿】；当你的血量少于3时，你视为拥有技能【龙胆】；当你的血量少于2时，你视为拥有技能【咆哮】",
            tuifan:"蜕变",
            "tuifan_info":"锁定技，当你被选定为目标时，你可以令一名其他角色选择弃置一张牌，若此牌颜色为红色，你与其回复一点体力，否则你与其摸一张牌",
            duanhua:"遁化",
            "duanhua_info":"锁定技，回合开始时，你随机获得一项主动技直到回合结束；回合结束时，你随机获得一项卖血技直到回合开始",
            "xinhuazidian_skill1":"元素魔盒",
            "xinhuazidian_skill1_info":"",
            "xinhuazidian_skill2":"炼金",
            "xinhuazidian_skill2_info":"",
            "dixinliangkuai_mark":"地心量块",
            "dixinliangkuai_mark_info":"",
            "bishuiliangwan_mark":"碧水量丸",
            "bishuiliangwan_mark_info":"",
            "huomuliangwan_mark":"活木量丸",
            "huomuliangwan_mark_info":"",
            "feitengliangwan_mark":"沸水量丸",
            "feitengliangwan_mark_info":"",
            "baozaonengliang_mark":"暴躁能量",
            "baozaonengliang_mark_info":"",
            "tongse_yihua":"瞳色浆果",
            "tongse_yihua_info":"锁定技，你的手牌始终对人可见；你可以查看一名角色的手牌，每名角色限一次",
            "xianyu_skill":"咸鱼",
            "xianyu_skill_info":"",
            "jingshen_skill":"精神小伙",
            "jingshen_skill_info":"",
            shadiao:"沙雕",
            "shadiao_info":"你将随机执行你的出牌，判定，弃牌阶段",
            qiudai:"求带",
            "qiudai_info":"当你受到伤害时，你可以令至多三名角色选择一项：1.令你摸一张牌，2.替你承受伤害，然后终止询问",
        },
    });
builder.translate.zhi='智';
builder.translate.yuansu='元素药剂';
builder.translate.yuansu1='微弱药剂';
builder.translate.yuansu2='强效药剂';
builder.translate.yuansu3='异常药剂';
builder.skill._yinAyang_import_fd8f810ce5={
        mod:{
            maxHandcard: function(player, num) {
                if(!player.storage.yinAyang_skill) return;
                return num-player.storage.yinAyang_skill;
            }
        },
    }
builder.skill._BornC_import_fd8f810ce5={
        trigger:{
            player:"phaseUseBegin",
        },
        direct:true,
        content:function(){
            var card=player.getCards('h','Cbaby')[0];
            if(card){
                game.log(player,'被',card,"蛊惑了");
                player.addJudge(card);
            }
        }
    };
builder.skill._feedC_import_fd8f810ce5={
        trigger:{
            target:"yinAyang_skill",
        },
        direct:true,
        content:function(){
            var card=player.getCards('j','Cbaby')[0];
            if(card){
                game.log(player,'向',card,"献祭了灵魂");
                if(player.storage.yinAyang_skill>2) card.init({name:'Cteen'});
                player.addJudge(card);
            }
        }
    };
builder.skill._equipbanzhuan_import_fd8f810ce5={
        trigger:{
            player:"equipEnd",
        },
        forced:true,
        silent:true,
        filter:function(event,player){
            return event.card.name=='banzhuan'&&player.isAlive();
        },
        content:function(){
            'step 0'
            var next=player.chooseToRespond({name:'shan'});
            next.autochoose=lib.filter.autoRespondSha;
            'step 1'
            if(!result.bool){
                var num=Math.random()*5;
                num=num>1?2:1;
                if(num==2) player.popup("暴击！");
                player.damage(num);
            }
        },
    }
} };
}
