// Generated from 卡牌扩展.zip/(卡牌)四海珍寶.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            "兴魏之扇":{
                type:"equip",
                subtype:"equip5",
                skills:["huituo"],
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
                image:"ext:神君∞扩展/天道之书.png",
                ai:{
                },
                fullskin:true,
            },
            "救命稻草":{
                type:"equip",
                subtype:"equip5",
                skills:["救命稻草"],
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
                image:"ext:四海珍寶/兴魏之扇.png",
                ai:{
                },
                fullskin:true,
            },
            "奇士之道":{
                type:"equip",
                subtype:"equip5",
                skills:["贾诩"],
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
                image:"ext:四海珍寶/兴魏之扇.png",
                ai:{
                    basic:{
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
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
                fullskin:true,
            },
            "趁危之计":{
                type:"equip",
                subtype:"equip5",
                skills:["趁危","跳摸"],
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
                image:"ext:四海珍寶/救命稻草.png",
                ai:{
                    basic:{
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
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
                fullimage:true,
            },
            "黄金滑稽":{
                type:"equip",
                subtype:"equip5",
                vanish:true,
                destroy:"寻宝",
                skills:["黄金滑稽","zhaxiang"],
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
                image:"ext:四海珍寶/趁危之计.png",
                ai:{
                    basic:{
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
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
                fullskin:true,
            },
            "常青草":{
                type:"equip",
                subtype:"equip5",
                skills:["翻连摸牌","失血摸牌"],
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
                image:"ext:四海珍寶/趁危之计.png",
                ai:{
                    basic:{
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
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
                fullimage:true,
            },
            "权宜之计":{
                type:"equip",
                subtype:"equip5",
                skills:["权宜之计"],
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
                image:"ext:四海珍寶/趁危之计.png",
                ai:{
                    basic:{
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
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
                fullimage:true,
            },
            "男人的马":{
                type:"equip",
                subtype:"equip5",
                skills:["reyingzi","mashu"],
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
                image:"ext:四海珍寶/趁危之计.png",
                ai:{
                    basic:{
                        order:function (card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
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
                fullskin:true,
            },
        },
        translate:{
            "兴魏之扇":"兴魏之扇",
            "兴魏之扇_info":"你视为拥有技能“恢拓”。",
            "救命稻草":"救命稻草",
            "救命稻草_info":"锁定技，当你进入濒死状态时，你摸两张牌。",
            "奇士之道":"奇士之道",
            "奇士之道_info":"你视为拥有技能“帷幕”，“缜略”。",
            "趁危之计":"趁危之计",
            "趁危之计_info":"锁定技，你跳过摸牌阶段；一名角色回合开始时，若其已受伤，你摸两张牌",
            "黄金滑稽":"黄金滑稽",
            "黄金滑稽_info":"滑天下之大稽",
            "常青草":"常青草",
            "常青草_info":"锁定技，当一名角色武将牌翻面，横置，或复原后，你摸一张牌；当一名角色回复体力后，你摸一张牌。",
            "权宜之计":"权宜之计",
            "权宜之计_info":"若你已受伤，你可以跳过摸牌阶段然后回复一点体力。结束阶段，你可以令一名其他角色获得技能放逐直至其回合结束；你可以失去一点体力并摸一张牌，然后令一名其他角色失去一点体力并摸两张牌。",
            "男人的马":"男人的马",
            "男人的马_info":"属于男人的马(你视为拥有\"英姿\"，\"马术\")",
        },
        list:[["heart","6","兴魏之扇"],["spade","3","救命稻草"],["diamond","12","兴魏之扇"],["club","12","奇士之道"],["heart","1","奇士之道"],["club","4","趁危之计"],["heart","13","权宜之计"],["club","1","奇士之道"],["club","8","常青草"],["heart","9","男人的马"],["club","11","男人的马"]],
    });
builder.addPack({
        skill:{
            "救命稻草":{
                audio:"ext:四海珍寶:2",
                trigger:{
                    player:"dying",
                },
                forced:true,
                priority:10,
                content:function (){
                 player.draw(2);
    },
                sub:true,
            },
            "贾诩":{
                forced:true,
                group:["zhenlue","weimu"],
            },
            "跳摸":{
                trigger:{
                    player:"phaseDrawBefore",
                },
                forced:true,
                content:function (){
        trigger.cancel();
    },
                ai:{
                    noh:true,
                },
            },
            "救命":{
                trigger:{
                    player:["loseEnd","phaseBefore"],
                },
                forced:true,
                filter:function (event,player){
        return !player.getEquip(5);
    },
                content:function (){
        
        player.$fullscreenpop('吾已习得天道','water');       game.delay(0.8) ;
        
            player.useCard(game.createCard('奇士之道','diamond',13),player);
        
        
            
        
    },
            },
            "趁危":{
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.isAlive()&&event.player.hp<event.player.maxHp;
    },
                forced:true,
                content:function (){player.$fullscreenpop('趁人之危','fire');       player.draw(2);
    },
            },
            "翻连摸牌":{
                audio:"ext:有无名扩展:2",
                trigger:{
                    global:["turnOverAfter","linkAfter"],
                },
                filter:function (event,player){
        if(event.name=='link') return true;
        return true;
    },
                forced:true,
                check:function (event,player){
        return get.attitude(player,event.player)>0;
    },
                content:function (){
        player.draw();
    },
                ai:{
                    expose:0.2,
                },
            },
            "变忠臣":{
                unique:true,
                enable:"phaseUse",
                audio:"ext:无名扩展:3",
                animationColor:" thunder",
                skillAnimation:"legend",
                filter:function (event,player){
        return !player.storage.ayeyannnnn1;
    },
                init:function (player){
        player.storage.ayeyannnnn1=false;
    },
                filterTarget:function (card,player,target){
      //  var length=ui.selected.cards.length;
     //   return (length==0);
        
        
        return target.identity!='zhu'; 
    },
                mark:true,
                line:"fire",
                check:function (){return -1},
                selectTarget:function (){
      //  if(ui.selected.cards.length==4) return 1;
     //   if(ui.selected.cards.length==0) return [1,8];
     //   game.uncheck('target');
        return [1,8];
    },
                content:function (){
        player.awakenSkill('变忠臣');
        player.storage.ayeyannnnn1=true;
    /*    if(cards.length==4){
            player.loseHp(0);
            target.identity='zhong' ; target.setIdentity();
        }
        else{*/
        target.identity='zhong' ;
        target.setIdentity();
       // }
    },
                intro:{
                    content:"limited",
                },
                ai:{
                    order:1,
                    result:{
                        target:function (player,target){
              //  if(target.hasSkillTag('nofire')) return 0;
                if(lib.config.mode=='versus') return -1;
          //      if(player.hasUnknown()) return -1;
                return get.damageEffect(target,player);
            },
                    },
                },
            },
            "变反贼":{
                unique:true,
                enable:"phaseUse",
                audio:"ext:无名扩展:3",
                animationColor:" thunder",
                skillAnimation:"legend",
                filter:function (event,player){
        return !player.storage.ayeyannnnn11;
    },
                init:function (player){
        player.storage.ayeyannnnn11=false;
    },
                filterTarget:function (card,player,target){
      //  var length=ui.selected.cards.length;
        return target.identity!='zhu';         
        //(length==0);
    },
                mark:true,
                line:"fire",
                check:function (){return -1},
                selectTarget:function (){
      //  if(ui.selected.cards.length==4) return 1;
     //   if(ui.selected.cards.length==0) return [1,8];
     //   game.uncheck('target');
        return [1,8];
    },
                content:function (){
        player.awakenSkill('变反贼');
        player.storage.ayeyannnnn11=true;
    /*    if(cards.length==4){
            player.loseHp(0);
            target.identity='zhong' ; target.setIdentity();
        }
        else{*/
       
        
        target.identity='fan' ;
        target.setIdentity();
      
    },
                intro:{
                    content:"limited",
                },
                ai:{
                    order:1,
                    result:{
                        target:function (player,target){
              //  if(target.hasSkillTag('nofire')) return 0;
                if(lib.config.mode=='versus') return -1;
              //  if(player.hasUnknown()) return 0;
                return get.damageEffect(target,player);
            },
                    },
                },
            },
            "变身份":{
                forced:true,
                group:["变反贼","变忠臣"],
            },
            "掉死":{
                trigger:{
                    player:"damageEnd",
                },
                forced:true,
                filter:function (event,player){
        return !player.hasSkill("变身份");
            
            
        },
                content:function (){
        player.addTempSkill("yijue2");
        player.loseHp(player.hp);
    },
            },
            "回活":{
                trigger:{
                    player:"dyingAfter",
                },
                priority:10,
                filter:function (event,player){
        return event.player.isAlive()&&!player.hasSkill("变身份");
    },
                forced:true,
                content:function (){
         player.recover(player.maxHp);
      //  player.removeSkill("掉死");
        player.addSkill("变身份");
       // player.removeSkill("黄金滑稽");
    },
            },
            "黄金滑稽":{
                forced:true,
                group:["掉死","回活"],
            },
            "权宜之计":{
                forced:true,
                group:["shifang","shimoer","quanyi1"],
            },
            "失摸":{
                trigger:{
                    player:["loseBefore"],
                },
                forced:true,
                filter:function (event,player){
        return player.getEquip(5)&&!player.hasSkill("sg");
    },
                content:function () {
        
     player.addSkill("sg") ;
        
        
    },
            },
            sg:{
            },
            "xunbao1":{
                trigger:{
                    global:"gameStart",
                    player:"enterGame",
                },
                forced:true,
                filter:function (event,player){
        return !player.getEquip(5);
    },
                content:function (){var num=[1,2,0,1,1,2,1,1,1,1].randomGet();
        
     //   player.$fullscreenpop('吾已习得天道','water');       game.delay(0.8) ;
        
         //   player.useCard(game.createCard('恢拓甲','diamond',13),player);
        var equip5=get.cardPile(function(card){
            return get.subtype(card)=='equip5';
        });
                        
         if(num==0){
          player.useCard(game.createCard('黄金滑稽','diamond',1),player);   
             
         }               
                        
                        
     else{      if(!equip5){
            player.popup('寻宝失败');
            game.log('牌堆中无宝物');
         //   event.finish();
          //  return;
        }
        
     else{    player.$draw(equip5);
        player.equip(equip5);
        player.$fullscreenpop('四海珍宝皆在囊中','water');         
        
        game.delay(1.1);        
          }      }
        
    },
            },
            "xunbao22":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.hp>1;
    },
                content:function (){var num=[1,2,0,1,1,2,1,1,1,1].randomGet();
        
     //   player.$fullscreenpop('吾已习得天道','water');       game.delay(0.8) ;
        
         //   player.useCard(game.createCard('恢拓甲','diamond',13),player);
        var equip5=get.cardPile(function(card){
            return get.subtype(card)=='equip5';
        });player.loseHp();
                        
       if (num==0) {
           
        player.useCard(game.createCard('黄金滑稽','diamond',1),player);   
           
           
       }               
       else{                  
                        
                        
        if(!equip5){
            player.popup('寻宝失败');
            game.log('牌堆中无宝物');
       //     event.finish();
          //  return;
        }
   else{    
            player.gain(equip5,'gain2','log');
     //   target.equip(equip5);
        player.$fullscreenpop('四海珍宝皆在囊中','water');         
        
        game.delay(1.1);        
           }    } 
        
    },
                ai:{
                    maihp:true,
                },
            },
            "xunbao3":{
                trigger:{
                    player:["loseEnd"],
                },
                filter:function (event,player){
        return !player.getEquip(5)&&player.hasSkill("sg")&&player.hp>1;
    },
                content:function (){var num=[1,2,0,1,1,2,1,1,1,1].randomGet();
        
     //   player.$fullscreenpop('吾已习得天道','water');       game.delay(0.8) ;
        
         //   player.useCard(game.createCard('恢拓甲','diamond',13),player);
        var equip5=get.cardPile(function(card){
            return get.subtype(card)=='equip5';
        });player.loseHp();player.addTempSkill("yijue2");
        
        player.removeSkill("sg");
         if(num==0)  {player.useCard(game.createCard('黄金滑稽','diamond',1),player);}             
                        
      else{
          
                       
                        
        if(!equip5){
            player.popup('寻宝失败');
            game.log('牌堆中无宝物');
         //   event.finish();
          //  return;
        }
        
     else{    player.$draw(equip5);
        player.equip(equip5);
        player.$fullscreenpop('四海珍宝皆在囊中','water');         
        
        game.delay(1.1);        
       
           
       }   }   
        
    },
                ai:{
                    noh:true,
                    nos:true,
                    result:{
                        player:function (player){
            if(player.hp<=2) return 0;
            if(player.hp==3) return target.hp<=2?-1:0;
              //  if(player.hp==1)
            return -1;
                
                
            },
                    },
                },
            },
            "_xunbaox":{
                forced:true,
                group:["xunbao1","xunbao22","xunbao3","失摸"],
            },
            "失血摸牌":{
                trigger:{
                    global:"loseHpEnd",
                },
                forced:true,
                popup:false,
                priority:12,
                check:function (){
        return false;
    },
                filter:function (event,player){
        return true;
    },
                content:function (){
       
            player.draw();
        
    },
            },
            "quanyi1":{
                trigger:{
                    player:"phaseDrawBefore",
                },
                filter:function (event,player){
        return player.hp<player.maxHp;
      //  storage.sywj_huaiju==undefined||player.storage.sywj_huaiju==0;
    },
                content:function (){
        trigger.cancel();
      player.recover();
    },
            },
            shifang:{
                forced:true,
                trigger:{
                    player:"phaseEnd",
                },
                priority:111,
                content:function (){
         "step 0"
        player.chooseTarget('是否令一名其他角色失去一点体力并获得技能放逐直至其回合结束',function(card,player,target){return target!=player;
           });
                                                                         
                                                                         
                                                                         
                                                                         
                                                                         
                                                                         
                                                                         
         
        
        "step 1"
   if(result.bool)   {
       
    
        target=result.targets[0];target.loseHp();target.addTempSkill('fangzhu',{player:'phaseEnd'});
        
      //  result=null;
          }
    },
            },
            shimoer:{
                forced:true,
                trigger:{
                    player:"phaseEnd",
                },
                priority:11,
                content:function (){
         "step 0"
        player.chooseTarget('是否令一名其他角色失去一点体力并摸两张牌',function(card,player,target){return target!=player;
           });
                                                                         
                                                                         
                                                                         
                                                                         
                                                                         
                                                                         
                                                                         
         
        
        "step 1"
        if(result.bool)   {        
        target=result.targets[0];player.loseHp(1);player.draw(1);
        target.loseHp(1);target.draw(2);
        
      //  result=null;
      }  
    },
            },
        },
        translate:{
            "救命稻草":"救命稻草",
            "救命稻草_info":"",
            "贾诩":"贾诩",
            "贾诩_info":"",
            "跳摸":"跳摸",
            "跳摸_info":"",
            "救命":"救命",
            "救命_info":"锁定技，若你的装备区里没有【天道之书】，你使用之。",
            "趁危":"趁危",
            "趁危_info":"",
            "翻连摸牌":"翻连摸牌",
            "翻连摸牌_info":"",
            "变忠臣":"变忠臣",
            "变忠臣_info":"限定技，出牌阶段，你可以令除主公外任意名角色将身份牌替换为忠臣。",
            "变反贼":"变反贼",
            "变反贼_info":"限定技，出牌阶段，你可以令除主公外任意名角色将身份牌替换为反贼。",
            "变身份":"变身份",
            "变身份_info":"改变身份",
            "掉死":"掉死",
            "掉死_info":"受伤濒死",
            "回活":"回活",
            "回活_info":"濒死回满",
            "黄金滑稽":"黄金滑稽",
            "黄金滑稽_info":"",
            "权宜之计":"权宜之计",
            "权宜之计_info":"",
            "失摸":"失摸",
            "失摸_info":"",
            sg:"sg",
            "sg_info":"",
            "xunbao1":"寻宝",
            "xunbao1_info":"游戏开始时，若你的装备区里没有宝物牌，你随机使用牌堆中的一张宝物牌。",
            "xunbao22":"寻宝",
            "xunbao22_info":"出牌阶段限一次，若你的体力值大于1，你可以失去一点体力并进行一次寻宝。",
            "xunbao3":"寻宝",
            "xunbao3_info":"当你失去装备区中的宝物牌时，若你没有宝物牌且你的体力值大于1，你可以失去一点体力并随机使用牌堆中的一张宝物牌，如若次做，本回合你所有非锁定技失效且不能使用手牌",
            "_xunbaox":"寻宝",
            "_xunbaox_info":"游戏开始时，你从牌堆中随机获得一张宝物牌并使用之",
            "失血摸牌":"失血摸牌",
            "失血摸牌_info":"",
            "quanyi1":"权宜之计",
            "quanyi1_info":"若你已受伤，你可以跳过摸牌阶段然后回复一点体力。",
            shifang:"权宜之计",
            "shifang_info":"",
            shimoer:"权宜之计",
            "shimoer_info":"",
        },
    });

} };
}
