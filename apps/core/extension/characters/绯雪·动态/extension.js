export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"绯雪·动态",content:function(config,pack){

},precontent:function(){
    lib.init.css(lib.assetURL + "extension/绯雪·动态/", "extension");

},help:{},config:{},package:{
    character:{
        character:{
            "feixue_changshi":["female","qun",4,["feixue_wanxue","feixue_jianxin"],["ext:绯雪·动态/image/character/feixue_changshi.jpg","isExtension","forbidai"]],
            "feixue_yuqiu":["female","qun",4,["feixue_zhaoshen","feixue_shuangtian"],["ext:绯雪·动态/image/character/feixue_yuqiu.jpg","isExtension","forbidai"]],
        },
        translate:{
            "feixue_changshi":"绯雪·常世身",
            "feixue_yuqiu":"绯雪·预求身",
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
            "feixue_wanxue":{
                marktext:"常世我身",
                intro:{
                    name:"常世我身",
                    content:function(storage,player,event){
            var str='<li>『心念』：'
            str+=player.countMark('feixue_xinnian')||0;
            str+='/300<br><li>『寒意』：';
            str+=player.countMark('feixue_hanyi')||0;
            str+='/300<br><li>『武霜·居合』：';
            str+=player.countMark('feixue_wushuangjuhe')||0;
            str+='/3<br><li>『淬寒·枯霜』：';
            str+=player.countMark('feixue_cuihankushuang')||0;
            str+='/3<br><li>『锻雪·归刃』：';
            str+=player.countMark('feixue_duanxueguiren')||0;
            str+='/3';
            return str;
        },
                },
                init:function(player,skill){
        player.markSkill("feixue_wanxue");
    },
                onremove:function(player){
        player.unmarkSkill("feixue_wanxue");
    },
                group:["feixue_wanxue_useCard","feixue_wanxue_phaseEnd"],
                enable:"phaseUse",
                filter:function(event,player){
        return (player.getCards('hs',i=>player.countCards('hs',{name:i.name})>1).length>0||player.countCards('hs',{type:'equip'})>1)&&
                event.filterCard({name:'sha'},player,event)&&player.countMark('feixue_xinnian')>=300;
    },
                prompt:"是否消耗300点『心念』将手牌中的两张同名牌或两张装备牌当做一张可以指定至多3名目标角色的冰【杀】使用",
                filterCard:function(card,player){
        if(ui.selected.cards.length){
            var cardx=ui.selected.cards[0];
            if(get.type(cardx)=='equip') return get.type(card)=='equip';
            return get.name(card)==get.name(cardx);
        }
        var cards=player.getCards('hs');
        for(var cardx of cards){
             if(card!=cardx){
                if(get.type(cardx)=='equip'&&get.type(card)=='equip') return true;
                if(get.name(card)==get.name(cardx)) return true;
            }
        }
        return false;
    },
                selectCard:2,
                position:"hs",
                complexCard:true,
                selectTarget:[1,3],
                viewAs:{
                    name:"sha",
                    nature:"ice",
                },
                precontent:function(){
        'step 0'
        /*特效来了*/

        game.playAudio('../extension/绯雪·动态/audio/skill/feixue_wanxue.mp3');
        var image=ui.create.div(ui.window);
        image.classList.add('feixue_wanxue_effect');
        image.style.backgroundImage=`url('${lib.assetURL}extension/绯雪·动态/image/GIF/feixue_wanxue.gif?t=${Date.now()}')`;
        var shade=ui.create.div(ui.window);
        shade.classList.add('feixue_wanxue_shadow');
        setTimeout(function(){
            if(image) image.remove();
            if(shade) shade.remove();
        },2200);
        /*特效走了*/
        game.delay(4);
        player.removeMark('feixue_xinnian',300);
        player.markSkill("feixue_wanxue");
        player.storage.feixue_jianxin=true;

    },
                subSkill:{
                    useCard:{
                        trigger:{
                            player:"useCard",
                        },
                        direct:true,
                        filter:function (event,player){
                var evt=event.getParent('phaseUse');
                return player.getHistory('useCard',function(evtx){
                    return evtx.getParent('phaseUse')==evt;
                },event).length%3==0;
            },
                        content:function(){
                var list=[];
                var num=Math.min(100,300-player.countMark('feixue_xinnian'));
                    if(num>0){
                        player.addMark('feixue_xinnian',num);
                        game.delayx();
                    }
                player.markSkill("feixue_wanxue");
                player.gain(trigger.cards,'gain2');
                player.gain(get.cards()[0],'gain2');
                player.gain(get.bottomCards()[0],'gain2');
                player.chooseToDiscard(true);
            },
                        "_priority":0,
                        sub:true,
                        parentskill:"feixue_wanxue",
                    },
                    phaseEnd:{
                        trigger:{
                            global:"phaseEnd",
                        },
                        direct:true,
                        content:function(){
                var cards=[];
                game.getGlobalHistory('cardMove',function(evt){
                    if(evt.name=='lose'){
                        if(evt.getParent(3)&&evt.getParent(3).name=='icesha_skill'){
                            for(var i of evt.cards){
                                if(get.position(i,true)=='d'){
                                    cards.push(i);
                                }
                            }
                        }
                    }
                });
                if(cards.length>0){
                    player.gain(cards.filterInD('d'),'gain2');
                    game.log(player,'获得了弃牌堆中',cards.length,'张因冰属性伤害而弃置的牌');
                }
            },
                        sub:true,
                        parentskill:"feixue_wanxue",
                        "_priority":0,
                    },
                },
                "_priority":0,
                ai:{
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
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
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "feixue_xinnian":{
                charlotte:true,
                sub:true,
                "_priority":0,
            },
            "feixue_jianxin":{
                charlotte:true,
                group:["feixue_jianxin_phaseEnd"],
                enable:"phaseUse",
                usable:1,
                filterCard:function() { return false; },
                selectCard:[-2,-1],
                direct:true,
                init:function(player,skill){
        player.storage.feixue_jianxin=false;

    },
                filter:function(event,player){
        return player.storage.feixue_jianxin==true;
    },
                content:function () {
        'step 0'
        /*特效来了*/

        game.playAudio('../extension/绯雪·动态/audio/skill/feixue_jianxin.mp3');
        var image=ui.create.div(ui.window);
        image.classList.add('feixue_jianxin_effect');
        image.style.backgroundImage=`url('${lib.assetURL}extension/绯雪·动态/image/GIF/feixue_jianxin.gif?t=${Date.now()}')`;
        var shade=ui.create.div(ui.window);
        shade.classList.add('feixue_jianxin_shadow');
        setTimeout(function(){
            if(image) image.remove();
            if(shade) shade.remove();
        },4200);
        /*特效走了*/
        game.delay(6);
        var num=Math.min(3,3-player.countMark('feixue_wushuangjuhe'));
            if(num>0){
                player.addMark('feixue_wushuangjuhe',num);
                game.delayx();
            }
        var num=Math.min(100,300-player.countMark('feixue_hanyi'));
            if(num>0){
                player.addMark('feixue_hanyi',num);
                game.delayx();
            }
        player.removeMark('feixue_xinnian',300);
        player.markSkill("feixue_wanxue");
        player.reinit("feixue_changshi","feixue_yuqiu");
    },
                subSkill:{
                    phaseEnd:{
                        trigger:{
                            global:"phaseAfter",
                        },
                        direct:true,
                        content:function () {
                player.storage.feixue_jianxin=false;

            },
                        sub:true,
                        parentskill:"feixue_jianxin",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            "feixue_wushuangjuhe":{
                charlotte:true,
                sub:true,
                "_priority":0,
            },
            "feixue_zhaoshen":{
                marktext:"预求我身",
                intro:{
                    name:"预求我身",
                    content:function(storage,player){
            var str='<li>『心念』：';
            str+=player.countMark('feixue_xinnian')||0;
            str+='/300<br><li>『寒意』：';
            str+=player.countMark('feixue_hanyi')||0;
            str+='/300<br><li>『武霜·居合』：';
            str+=player.countMark('feixue_wushuangjuhe')||0;
            str+='/3<br><li>『淬寒·枯霜』：';
            str+=player.countMark('feixue_cuihankushuang')||0;
            str+='/3<br><li>『锻雪·归刃』：';
            str+=player.countMark('feixue_duanxueguiren')||0;
            str+='/3';
            return str;
        },
                },
                init:function(player,skill){
        player.markSkill("feixue_zhaoshen");
        player.storage.feixue_zhaoshen_shaMiss=['equip','trick','basic'];
    },
                onremove:function(player){
        player.unmarkSkill("feixue_zhaoshen");
    },
                group:["feixue_zhaoshen_shaMiss","feixue_zhaoshen_phaseEnd","feixue_zhaoshen_useCard","feixue_zhaoshen_damageSource","feixue_zhaoshen_roundStart"],
                enable:["chooseToRespond","chooseToUse"],
                filter:function(event,player){
        return player.getCards('hs',card=>get.tag(card,'damage')).length>0;
    },
                prompt:"是否将一张伤害牌当做【闪】使用或打出",
                filterCard:function(card,player){
        return get.tag(card,'damage');
    },
                selectCard:1,
                position:"hs",
                viewAs:{
                    name:"shan",
                    storage:{
                        "feixue_zhaoshen":true,
                    },
                    isCard:true,
                },
                precontent:function(){
    },
                subSkill:{
                    useCard:{
                        trigger:{
                            player:"useCard",
                        },
                        direct:true,
                        filter:function (event,player){
                return player.isPhaseUsing();
            },
                        content:function(){
                var num=Math.min(20,300-player.countMark('feixue_hanyi'));
                    if(num>0){
                        player.addMark('feixue_hanyi',num);
                        game.delayx();
                    }
                player.markSkill("feixue_zhaoshen");

                var evt=trigger.getParent('phaseUse');
                if(player.getHistory('useCard',function(evtx){
                    return evtx.getParent('phaseUse')==evt;
                },trigger).length%5==0){
                    player.storage.feixue_zhaoshen_useCard=trigger.card;
                }
            },
                        priority:-999,
                        "_priority":-99900,
                        sub:true,
                        parentskill:"feixue_zhaoshen",
                    },
                    damageSource:{
                        trigger:{
                            source:"damageSource",
                        },
                        filter:function(event, player) {
                return event.card==player.storage.feixue_zhaoshen_useCard;
            },
                        direct:true,
                        content:function(){
                var num=Math.min(100,300-player.countMark('feixue_hanyi'));
                    if(num>0){
                        player.addMark('feixue_hanyi',num);
                        game.delayx();
                    }
                player.markSkill("feixue_zhaoshen");
                player.storage.feixue_zhaoshen_useCard=[];
            },
                        "_priority":0,
                        sub:true,
                        parentskill:"feixue_zhaoshen",
                    },
                    shaMiss:{
                        trigger:{
                            global:"shaMiss",
                        },
                        direct:true,
                        filter:function (event,player){
                var list=['equip','trick','basic'];
                return event.target==player&&event.player!=player&&
                    event.responded.card&&event.responded.card.storage&&
                    event.responded.card.storage.feixue_zhaoshen&&
                    list.contains(player.storage.feixue_zhaoshen_shaMiss[0])&&
                    player.countMark('feixue_hanyi')>=100;
            },
                        logTarget:"target",
                        content:function(){
                'step 0'
                var list=player.storage.feixue_zhaoshen_shaMiss;
                player.chooseCard('hes','是否将一张牌当做冰【杀】对'+get.translation(trigger.player)+'使用',function(card,player){
                    return player.canUse(get.autoViewAs({name:'sha',nature:'ice'},[card]),_status.event.target,false)&&
                        (list.contains(get.type2(card)));
                }).set('target',trigger.player).set('ai',function(card){
                    if(get.effect(_status.event.target,get.autoViewAs({name:'sha',nature:'ice'},[card]),player)<=0) return false;
                    return 6-get.value(card);
                });
                'step 1'
                if(result.bool){
                    player.useCard(get.autoViewAs({name:'sha',nature:'ice'},result.cards),result.cards,false,trigger.player);
                    player.removeMark('feixue_hanyi',100);
                    player.removeMark('feixue_wushuangjuhe',1);
                    var num=Math.min(1,3-player.countMark('feixue_cuihankushuang'));
                    if(num>0){
                        player.addMark('feixue_cuihankushuang',num);
                        game.delayx();
                    }
                    player.markSkill("feixue_zhaoshen");
                    var count=[];
                    if(player.storage.feixue_zhaoshen_shaMiss){
                        for(var i of player.storage.feixue_zhaoshen_shaMiss){
                            if(get.type2(result.cards[0])!=i){
                                count.push(i)
                            }
                        }
                    }
                    player.storage.feixue_zhaoshen_shaMiss=count;
                }else{
                    event.finish();
                }
                'step 2'
                if(player.countMark('feixue_hanyi')>=100){
                    event.goto(0);
                }
            },
                        "_priority":0,
                        sub:true,
                        parentskill:"feixue_zhaoshen",
                    },
                    roundStart:{
                        trigger:{
                            global:"roundStart",
                        },
                        direct:true,
                        content:function(){
                player.storage.feixue_zhaoshen_shaMiss=['equip','trick','basic'];
            },
                        "_priority":0,
                        sub:true,
                        parentskill:"feixue_zhaoshen",
                    },
                    phaseEnd:{
                        trigger:{
                            global:"phaseEnd",
                        },
                        direct:true,
                        content:function(){
                var cards=[];
                game.getGlobalHistory('cardMove',function(evt){
                    if(evt.name=='lose'){
                        if(evt.getParent(3)&&evt.getParent(3).name=='icesha_skill'){
                            for(var i of evt.cards){
                                if(get.position(i,true)=='d'){
                                    cards.push(i);
                                }
                            }
                        }
                    }
                });
                if(cards.length>0){
                    player.gain(cards.filterInD('d'),'gain2');
                    game.log(player,'获得了弃牌堆中',cards.length,'张因冰属性伤害而弃置的牌');
                }
            },
                        sub:true,
                        parentskill:"feixue_zhaoshen",
                        "_priority":0,
                    },
                },
                "_priority":0,
                ai:{
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
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
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                        player:1,
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "feixue_hanyi":{
                charlotte:true,
                sub:true,
                "_priority":0,
            },
            "feixue_cuihankushuang":{
                charlotte:true,
                sub:true,
                "_priority":0,
            },
            "feixue_shuangtian":{
                charlotte:true,
                derivation:["feixue_guiren"],
                group:["feixue_shuangtian_useCard"],
                enable:"phaseUse",
                filter:function(event,player){
        return (player.getCards('hs',i=>player.countCards('hs',{name:i.name})>1).length>0||player.countCards('hs',{type:'equip'})>1)&&
                event.filterCard({name:'sha'},player,event)&&player.countMark('feixue_cuihankushuang')>=3;
    },
                prompt:"是否消耗3层『淬寒·枯霜』将手牌中的两张同名牌或两张装备牌当做一张可以指定任意名目标角色的冰【杀】使用",
                filterCard:function(card,player){
        if(ui.selected.cards.length){
            var cardx=ui.selected.cards[0];
            if(get.type(cardx)=='equip') return get.type(card)=='equip';
            return get.name(card)==get.name(cardx);
        }
        var cards=player.getCards('hs');
        for(var cardx of cards){
             if(card!=cardx){
                if(get.type(cardx)=='equip'&&get.type(card)=='equip') return true;
                if(get.name(card)==get.name(cardx)) return true;
            }
        }
        return false;
    },
                selectCard:2,
                position:"hs",
                complexCard:true,
                selectTarget:[1,Infinity],
                viewAs:{
                    name:"sha",
                    nature:"ice",
                },
                precontent:function(){
        'step 0'
        /*特效来了*/

        game.playAudio('../extension/绯雪·动态/audio/skill/feixue_shuangtian.mp3');
        var image=ui.create.div(ui.window);
        image.classList.add('feixue_shuangtian_effect');
        image.style.backgroundImage=`url('${lib.assetURL}extension/绯雪·动态/image/GIF/feixue_shuangtian.gif?t=${Date.now()}')`;
        var shade=ui.create.div(ui.window);
        shade.classList.add('feixue_shuangtian_shadow');
        setTimeout(function(){
            if(image) image.remove();
            if(shade) shade.remove();
        },3000);
        /*特效走了*/
        game.delay(5);
        player.removeMark('feixue_cuihankushuang',3);
        player.markSkill("feixue_zhaoshen");
    },
                subSkill:{
                    useCard:{
                        trigger:{
                            player:"useCard",
                        },
                        direct:true,
                        filter:function (event,player){
                return event.skill=='feixue_shuangtian'
            },
                        content:function(){
                trigger.directHit.addArray(game.players);
                var num=Math.min(1,3-player.countMark('feixue_duanxueguiren'));
                    if(num>0){
                        player.addMark('feixue_duanxueguiren',num);
                        game.delayx();
                    }
                player.markSkill("feixue_zhaoshen");
                player.addSkill('feixue_guiren');
            },
                        "_priority":0,
                        sub:true,
                        parentskill:"feixue_shuangtian",
                    },
                },
                "_priority":0,
                ai:{
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
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
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "feixue_duanxueguiren":{
                charlotte:true,
                sub:true,
                "_priority":0,
            },
            "feixue_guiren":{
                charlotte:true,
                enable:"phaseUse",
                usable:1,
                init:function(player,skill){
        player.removeSkill('feixue_shuangtian');
    },
                direct:true,
                content:function(){
        'step 0'
        var num=player.countMark('feixue_duanxueguiren');
        var controls=Array.from({length:num+1},(_,i)=>String(i));
        player.chooseControl(controls,'cancel2')
            .set('prompt','选择消耗的『锻雪·归刃』层数')
            .set('ai',()=>_status.event.controls.length-2);
        'step 1'
        if(result.control!='cancel2'){
            event.feixueLayers=Number(result.control);
            /*特效来了*/

            game.playAudio('../extension/绯雪·动态/audio/skill/feixue_guiren.mp3');
            var image=ui.create.div(ui.window);
            image.classList.add('feixue_guiren_effect');
            image.style.backgroundImage=`url('${lib.assetURL}extension/绯雪·动态/image/GIF/feixue_guiren.gif?t=${Date.now()}')`;
            var shade=ui.create.div(ui.window);
            shade.classList.add('feixue_guiren_shadow');
            setTimeout(function(){
                if(image) image.remove();
                if(shade) shade.remove();
            },5500);
            /*特效走了*/
            game.delay(9);
            if(event.feixueLayers>0){
                player.removeMark('feixue_duanxueguiren',event.feixueLayers);
            }
            var num=1;
            if(event.feixueLayers==1){
                var num=2;
            }
            if(event.feixueLayers==2){
                var num=4;
            }
            if(event.feixueLayers==3){
                var num=8;
            }
            for (var i of game.players){
                if(i!=player){i.damage(num,'ice');}
            }
            player.removeMark('feixue_hanyi',300);
            player.reinit("feixue_yuqiu","feixue_changshi");
            player.removeSkill('feixue_guiren');
        }else{
            delete player.getStat().skill.feixue_guiren;
        }

    },
                "_priority":0,
            },
        },
        translate:{
            "feixue_wanxue":"挽雪",
            "feixue_wanxue_info":"当你于出牌阶段内使用第3的倍数张牌时获得100点『心念』并获得此牌，然后获得牌堆顶与牌堆底各一张牌并弃置一张手牌。 <br>出牌阶段，你可以消耗300点『心念』将手牌中的两张同名牌或两张装备牌当做一张冰【杀】对至多3名角色使用。然后解锁〖见心〗直到本回合结束。 <br>每回合结束时，你获得弃牌堆中于本回合内因冰属性伤害而被弃置的所有牌。",
            "feixue_xinnian":"心念",
            "feixue_xinnian_info":"",
            "feixue_jianxin":"见心",
            "feixue_jianxin_info":"常态锁定无法使用。出牌阶段限一次，你可以获得3层『武霜·居合』并清除所有『心念』。然后进入『预求身』并获得100点『寒意』。",
            "feixue_wushuangjuhe":"武霜·居合",
            "feixue_wushuangjuhe_info":"",
            "feixue_zhaoshen":"照身",
            "feixue_zhaoshen_info":"当你于出牌阶段内使用牌时获得20点『寒意』。若此牌为本阶段内你使用的第5的倍数张牌，则此牌造成伤害后额外获得100点『寒意』。 <br>你可以将手牌中的一张伤害牌当做【闪】使用或打出。因此成功闪避后，你可以消耗100点『寒意』将一张牌当做冰【杀】对其使用（每轮每种类型的牌各限一次）并消耗1层『武霜·居合』获得1层『淬寒·枯霜』，然后若你的『寒意』仍不低于100点，则重复此流程。 <br>每回合结束时，你获得弃牌堆中于本回合内因冰属性伤害而被弃置的所有牌。",
            "feixue_hanyi":"寒意",
            "feixue_hanyi_info":"",
            "feixue_cuihankushuang":"淬寒·枯霜",
            "feixue_cuihankushuang_info":"",
            "feixue_shuangtian":"霜天",
            "feixue_shuangtian_info":"出牌阶段，你可以消耗3层『淬寒·枯霜』将手牌中的两张同名牌或两张装备牌当做一张冰【杀】对任意名角色使用且无法被响应。然后你获得1层『锻雪·归刃』并将〖霜天〗变更为〖归刃〗。",
            "feixue_duanxueguiren":"锻雪·归刃",
            "feixue_duanxueguiren_info":"",
            "feixue_guiren":"归刃",
            "feixue_guiren_info":"出牌阶段限一次，你可以消耗任意层『锻雪·归刃』对所有角色造成1点冰属性伤害，且每消耗1层『锻雪·归刃』伤害值就*2。然后你清除所有『寒意』并退出『预求身』。",
        },
    },
    intro:"绯雪的常世身与预求身，附带技能动画及音频。",
    author:"※势运乾坤",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}};
