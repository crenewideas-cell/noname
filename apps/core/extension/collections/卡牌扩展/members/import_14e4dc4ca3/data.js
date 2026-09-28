// Generated from 秘籍卡.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            mijljgj:{
                type:"秘藉",
                enable:true,
                filterTarget:function (card,player,target){
        return !target.hasSkill('mijljgj')&&target==player;
      
    },
                content:function (){
        target.$gain2(cards);
        target.storage.mijljgj=card;
        target.storage.mijljgj_markcount=1;
        target.addSkill('mijljgj');
        target.addSkill('jgj1');
        target.addTempSkill('jjf','phaseBegin');                                                                                    
    },
                ai:{
                    order:2,
                    value:5,
                    result:{
                        target:1,
                    },
                },
                selectTarget:1,
                fullimage:true,
            },
            mijlxtj:{
                type:"秘藉",
                enable:true,
                filterTarget:function (card,player,target){
        return !target.hasSkill('mijlxtj')&&target==player;
       
    },
                content:function (){
        target.$gain2(cards);
        target.storage.mijlxtj=card;
        target.storage.mijlxtj_markcount=1;
        target.turnOver();
        target.draw(target.hp);
        target.addSkill('mijlxtj');
      
                                                                                         
    },
                ai:{
                    order:2,
                    value:5,
                    result:{
                        target:1,
                    },
                },
                selectTarget:1,
                fullimage:true,
            },
            mijlyyj:{
                type:"秘藉",
                enable:function (card,player){
        return  !player.countUsed();
        
    },
                filterTarget:function (card,player,target){
        return !target.hasSkill('mijlyyj')&&target==player;    
      
    },
                content:function (){
        target.$gain2(cards);
        target.storage.mijlyyj=card;
        target.storage.mijlyyj_markcount=1;
        target.addSkill('mijlyyj');
        target.addSkill('yyj1');                                                                                          
    },
                ai:{
                    order:2,
                    value:5,
                    result:{
                        target:1,
                    },
                },
                selectTarget:1,
                fullimage:true,
            },
            mijlxyj:{
                type:"秘藉",
                enable:true,
                filterTarget:function (card,player,target){
        return !target.hasSkill('mijlxyj')&&target==player;
        
    },
                content:function (){
        'step 0'
target.$gain2(cards);
target.addSkill('xyj1');
target.addSkill('xyj2');
target.addSkill('mijlxyj');
  target.damage(target.hp-1);
 target.draw(target.maxHp-target.countCards('h'));  
        'step 1'
        var a=target.storage.xyj1-target.hp
target.draw(a);
    },
                ai:{
                    order:2,
                    value:5,
                    result:{
                        target:1,
                    },
                },
                selectTarget:1,
                fullimage:true,
            },
            mijwlsj:{
                type:"秘藉",
                enable:true,
                filterTarget:function (card,player,target){
        return !target.hasSkill('mijwlsj')&&target==player;
      
    },
                content:function (){
        target.$gain2(cards);        
        target.addSkill('mijwlsj');                                                                                      
    },
                ai:{
                    order:2,
                    value:5,
                    result:{
                        target:1,
                    },
                },
                selectTarget:1,
                fullimage:true,
            },
            mijwwdg:{
                type:"秘藉",
                enable:true,
                filterTarget:function (card,player,target){
        return !target.hasSkill('mijwwdg')&&target==player;
      
    },
                content:function (){
        target.$gain2(cards);        
        target.addSkill('mijwwdg');  
        target.addSkill('wd2');  
    },
                ai:{
                    order:2,
                    value:5,
                    result:{
                        target:1,
                    },
                },
                selectTarget:1,
                fullimage:true,
            },
        },
        translate:{
            mijljgj:"金刚经",
            "mijljgj_info":"你的防御距离加1直到你的下个回合开始。你的下个回合开始时若你未受到属性伤害，将此牌弃置并进行一次判定，若结果为方块，你受到非属性伤害减一直到游戏结束，若为红桃，你增加两点体力上限并回复两点体力，并摸恢复体力数的牌，若结果为黑色，当前回合你的手牌上限减2。",
            mijlxtj:"先天经",
            "mijlxtj_info":"你的武将牌翻面并摸等同于你当前体力值的牌。你的回合开始时将此牌弃置，若你有手牌，将之全部弃置，并判定x次，每有一张判定牌与你的弃置牌花色相同你增加一点体力上限并摸两张牌（x为你弃置牌数且最多为4）。",
            mijlyyj:"阴阳经",
            "mijlyyj_info":"此牌需在出牌阶段第一张打出否则无效，当前回合你的牌不可指定其他角色为目标，但你回合内摸牌时额外摸一张，当前回合你跳过弃牌阶段，下个回合开始时将此牌弃置，进行两次判定，若均为红色，你回合内摸牌额外摸一张直到游戏结束，你的手牌上限加2；若均为黑色，你的黑色牌均可当杀使用，且无视距离与防具，并可额外指定一名目标，使用杀的次数限制加2，回合结束时你每杀死一名角色则你可以摸取等同其体力上限的牌数；若颜色均不同，你摸等同你体力值的牌数，弃牌阶段额外弃置等同你体力上限的牌数，你的回合内每张同名牌只能打出一次。",
            mijlxyj:"玄玉经",
            "mijlxyj_info":"将你的体力值扣减为一，你无法恢复更多的体力。将你的手牌补充至你的体力上限，且你每额外扣减了一点体力额外摸一张牌。你跳过你的摸牌和弃牌阶段，你每打出使用或失去一张牌时须摸一张牌。其他角色使用牌指定你时，你可进行一次判定，并可弃置一张与判定结果花色或点数相同的牌使之无效。你处于濒死时你需额外恢复一点体力。你的回合开始时你可弃置x张花色不同的牌保留该效果x回合。",
            mijwlsj:"灵速决",
            "mijwlsj_info":"其他角色计算与你的攻击距离时减一，每当其他角色使用牌指定你时，你可以摸一张牌，若此时你的手牌数大于你的体力上限你需弃置一张牌。你的回合开始时，若你未受到伤害，你可以抽取任意名角色各一张牌，你使用牌时无视与其他角色的距离直到你受到伤害。你的回合结束时可以弃置x张牌，摸x＋1张牌。",
            mijwwdg:"五毒功",
            "mijwwdg_info":"你将五枚毒印记置于你的判定区中，当你失去体力时你防止之，改为恢复一点体力或摸一张牌，直到毒印记从场上全部弃置。你的回合内，你每使用一张牌，可以将一枚毒印记移动到任意一名角色的判定区内，该角色判定阶段需进行x次判定，然后该角色需弃置x张与判定结果花色相同的手牌（x为毒印记数量），每少弃一张则失去一点体力。当你受到一点伤害或失去最后的手牌时，你须弃置一枚毒印记。你每弃置一枚毒印记你摸两张牌。",
        },
        list:[],
    });
builder.addPack({
        skill:{
            jjf:{
                mod:{
                    globalTo:function (from,to,distance){
            return distance+1;
        },
                },
            },
            jgjjg:{
                trigger:{
                    player:"damageBefore",
                },
                filter:function (event){
        return !event.nature;
    },
                frequent:true,
                content:function (){
        trigger.num-=1;
    },
            },
            "jgj1":{
                mark:true,
                init:function (player){
    player.storage.jgj1=0;
      },
                trigger:{
                    player:"damageBefore",
                },
                filter:function (event){
        return event.nature;
    },
                forced:true,
                content:function (){
        player.storage.jgj1+=1;
    },
            },
            jgjh:{
                trigger:{
                    player:"recoverBefore",
                },
                frequent:true,
                content:function (){
        var a=trigger.num;
        player.draw(a);
        player.removeSkill('jgjh'); 
    },
            },
            jgjj:{
                mod:{
                    maxHandcard:function (player,num){
            return num-=2;
        },
                },
            },
            mijljgj:{
                trigger:{
                    player:"phaseBegin",
                },
                mark:"card",
                intro:{
                    content:function (storage){
   '金刚经'     },
                },
                frequent:true,
                filter:function (event,player){
        return player.storage.jgj1==0;    
    },
                content:function (){     
        card=get.cards()[0];
        player.$throw(card);
        if(get.suit(card)=='heart'){
      player.gainMaxHp(2);
            player.addSkill('jgjh');
      player.recover(2);            
 }    
        if(get.suit(card)=='diamond'){
            player.addSkill('jgjjg');
        }
        if(get.color(card)=='black'){
           player.addTempSkill('jgjj','phaseEnd');         
        }
        player.storage.mijljgj_markcount--;
        if(player.storage.mijljgj_markcount==0){
            delete player.storage.mijljgj;
            delete player.storage.mijljgj_markcount;
            player.removeSkill('jgj1');
            player.removeSkill('mijljgj');
        }
        
    },
            },
            mijlxtj:{
                trigger:{
                    player:"phaseBegin",
                },
                mark:"card",
                intro:{
                    content:function (storage){
   '先天经'     },
                },
                frequent:true,
                filter:function (event,player){
        return player.countCards('h')>0;  
    },
                content:function (){
          'step 0'
        event.cards=player.getCards("h");
var nu=event.cards.length;
event.num=nu>4?4:nu;
event.suit=[];
for(var i=0;i<nu;i++){
var suit=get.suit(event.cards[i]);
event.suit.add(suit);
}
player.discard(event.cards);
            'step 1'
if(event.num>0){
 card=get.cards()[0];
        player.$throw(card);
var s=get.suit(card);
if(event.suit.contains(s)){ player.gainMaxHp();
player.draw(2);
}
}
  'step 2'
    if(event.num>0){
event.num--;
event.goto(1);}
          'step 3'
        player.storage.mijlxtj_markcount--;
          if(player.storage.mijlxtj_markcount==0){
            delete player.storage.mijlxtj;
            delete player.storage.mijlxtj_markcount;          
            player.removeSkill('mijlxtj');
        }
    },
            },
            "yyj1":{
                mod:{
                    cardEnabled:function (card,player){
             return false;
        },
                    cardUsable:function (card,player){
            return false;
        },
                    cardRespondable:function (card,player){
        return false;
        },
                    cardSavable:function (card,player){
             return false;
        },
                },
                group:["yyj1_1","yyj1_2"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseDiscardBefore",
                        },
                        frequent:true,
                        content:function (){
        trigger.cancel();
    },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"drawBegin",
                        },
                        filter:function (event,player){
        return _status.currentPhase==player;
    },
                        frequent:true,
                        content:function (){
        player.draw()._triggered=null;
    },
                        sub:true,
                    },
                },
            },
            mijlyyj:{
                trigger:{
                    player:"phaseBegin",
                },
                mark:"card",
                intro:{
                    content:function (storage){
   '阴阳经'     },
                },
                frequent:true,
                content:function (){
       card=get.cards()[0];
        b=get.cards()[0];
        player.$throw(card);
        if(get.color(card)=='red'){    
            player.$throw(b);
             if(get.color(b)=='red'){
                  player.addSkill('yyj2') 
              }
             if(get.color(b)=='black'){
                player.addTempSkill('yyj4','phaseEnd');
                var a=player.maxHp;
                player.draw(a);              
            }
      
        }
          if(get.color(card)=='black'){
     player.$throw(b);
              if(get.color(b)=='black'){
                    player.addTempSkill('yyj3','phaseAfter');   
              }
            if(get.color(b)=='red'){
                player.addTempSkill('yyj4','phaseEnd');  
                var a=player.maxHp;
                player.draw(a);                
            }
         
        }
    },
            },
            "yyj2":{
                mod:{
                    maxHandcard:function (player,num){          
            return num+2;
        },
                },
                trigger:{
                    player:"drawBegin",
                },
                filter:function (event,player){
        return _status.currentPhase==player;
    },
                frequent:true,
                content:function (){
        player.draw()._triggered=null;
    },
            },
            "yyj3":{
                mod:{
                    selectTarget:function (card,player,range){
            if(card.name=='sha'&&get.color(card)=='black'&&range[1]!=-1) range[1]+=1;
        },
                    targetInRange:function (card,player,target,now){
            if(card.name=='sha'&&get.color(card)=='black') return true;
        },
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+=2;
        },
                },
                group:["yyj6","yyj5"],
                enable:"chooseToUse",
                filterCard:function (card,player){
        return get.color(card)=='black';
    },
                position:"he",
                viewAs:{
                    name:"sha",
                },
                check:function (card){return 4-get.value(card)},
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            
            if(arg&&arg.name=='sha'&&get.color(arg)=='black') return true;
            return false;
        },
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
                        thunderDamage:function (card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function (card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "yyj4":{
                mod:{
                    cardEnabled:function (card,player){
            if(_status.currentPhase!=player)return;
            if(player.getStat().card[card.name]) return false;
        },
                },
                trigger:{
                    player:"phaseDiscardEnd",
                },
                forced:true,
                content:function (){
        var a=player.maxHp;
        player.chooseToDiscard(a,true);
        
    },
            },
            "yyj5":{
                mark:true,
                init:function (player){
        player.storage.yyj5=0;
    },
                trigger:{
                    source:"dieAfter",
                },
                forced:true,
                content:function (){
        var a=event.player.MaxHp
        player.storage.yyj5+=a;
    },
            },
            "yyj6":{
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                content:function (){
        var num=player.storage.yyj5;
        player.draw(num);
    },
            },
            mijlxyj:{
                trigger:{
                    player:"phaseBegin",
                },
                priority:5,
                mark:true,
                init:function (player){
        player.storage.mijlxyj=1;
        player .syncStorage( 'mijlxyj' )
    },
                intro:{
                    content:"剩#个回合有效",
                },
                forced:true,
                content:function (){
       player.skip('phaseDraw');
        player.skip('phaseDiscard');
        player.storage.mijlxyj-=1;
    },
                group:["mijlxyj_1","mijlxyj_2","mijlxyj_3","mijlxyj_4"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"loseBegin",
                        },
                        frequent:true,
                        content:function (){
                for(var i=0;i<trigger.cards.length;i++){
        player.draw()
                }
    },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            target:"useCardToBefore",
                        },
                        filter:function (event,player){
        return event.player!=player;
    },
                        content:function (){   
                 'step 0'
event.card=get.cards()[0];
                player.$throw(event.card);
event.num=get.number(event.card);
           event.a=get.suit(event.card);     
player.chooseToDiscard("he",function(card){
return get.number(card)==event.num||get.suit(card)==event.a;
});
                 'step 1'
                  if(result.bool){
                      trigger.cancel();
                  }
            },
                        sub:true,
                    },
                    "3":{
                        trigger:{
                            player:"recoverBefore",
                        },
                        usable:1,
                        forced:true,
                        filter:function (event,player){
                if(player.hp<=0) return true;                     
    },
                        content:function (){
                trigger.num-=1;
        
    },
                        sub:true,
                    },
                    "4":{
                        trigger:{
                            player:"recoverBefore",
                        },
                        forced:true,
                        filter:function (event,player){
                if(player.hp>0) return true;                     
    },
                        content:function (){
                 trigger.cancel();       
    },
                        sub:true,
                    },
                },
            },
            "xyj1":{
                mark:true,
                init:function (player){
        player.storage.xyj1=player.hp;
    },
                trigger:{
                    player:"phaseBefore",
                },
                content:function (){
        'step 0'
        player.chooseToDiscard("he",[1,4],
                               function (card){
        var suit=get.suit(card);
        for(var i=0;i<ui.selected.cards.length;i++){
             
            if(get.suit(ui.selected.cards[i])==suit) return false;
        }
        return true;
    });
                       'step 1'
                    if(result.bool){
       player.storage.mijlxyj+=result.cards.length;
                    }
        player.removeSkill('xyj1');
    },
            },
            "xyj2":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                priority:10,
                filter:function (event,player){       
        return player.storage.mijlxyj<=0;
    },
                content:function (){
        player.removeSkill('mijlxyj');
        player.removeSkill('xyj2');
    },
            },
            mijwlsj:{
                mod:{
                    globalTo:function (from,to,distance){
            return distance-1;
        },
                    targetInRange:function (card,player){
            if(player.isHealthy()) return true;
        },
                },
                trigger:{
                    target:"useCardToBefore",
                },
                filter:function (event,player){
        return event.player!=player;
    },
                frequent:true,
                content:function (){
        'step 0'
        player.draw();
            'step 1'
            if(player.countCards('h')>player.maxHp){
          player.chooseToDiscard("he",true);    
            }            
    },
                group:["mijwlsj_1","mijwlsj_2"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseBegin",
                        },
                        direct:true,
                        filter:function (event,player){
        return player.isHealthy();
    },
                        content:function (){
        'step 0'
        var check;
        var i,num=game.countPlayer(function(current){
            return current!=player&&current.countCards('he')&&get.attitude(player,current)<=3;
        });
        check=(num>=2);
        player.chooseTarget([1,19],function(card,player,target){
            return target.countCards('he')>0&&player!=target;
        },function(target){
            if(!_status.event.aicheck) return 0;
            var att=get.attitude(_status.event.player,target);
            if(target.hasSkill('tuntian')) return att/10;
            return 1-att;
        }).set('aicheck',check);
            'step 1'
        if(result.bool&&result.targets){
            player.line(result.targets,'green');
            event.targets=result.targets;
            event.targets.sort(lib.sort.seat);
            event.gained=event.targets.length;
        }
        else{
            event.finish();
        }
        'step 2'
        if(event.targets.length){
            player.gainPlayerCard(event.targets.shift(),'hej',true);
            event.redo();
        }
        'step 3'
        game.delay();
    },
                        ai:{
                            threaten:1.6,
                            expose:0.2,
                        },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"phaseEnd",
                        },
                        frequent:true,
                        content:function (){
                'step 0'
        player.chooseToDiscard("he",[1,Infinity]);
                   'step 1'
                    if(result.bool){
        player.draw(result.cards.length+1)}
    },
                        sub:true,
                    },
                },
            },
            mijwwdg:{
                mark:true,
                init:function (player){
        player.storage.mijwwdg=5;
        player .syncStorage( 'mijwwdg' )
    },
                intro:{
                    content:"剩#个毒印记",
                },
                trigger:{
                    player:"loseHpBefore",
                },
                filter:function (event,player){
 return player.storage.mijwwdg>0;    
    },
                forced:true,
                content:function (){      
        'step 0'
        trigger.cancel();          
          player.chooseControl('摸牌','回血');
             'step 1'
        if(result.control=='获牌'){player.draw();};
        if(result.control=='回血'){player.recover();};    
    },
                group:"mijwwdg_1",
                subSkill:{
                    "1":{
                        trigger:{
                            player:"useCardAfter",
                        },
                        filter:function (event,player){
 return player.storage.mijwwdg>0;    
    },
                        content:function (){
                  'step 0'                  
        player.chooseTarget();
        player.storage.mijwwdg-=1;
                'step 1'          
              if(result.bool){   
                  var target=result.targets[0];
                  player.logSkill('五毒',target);
                  target.addSkill('wd1'); 
                  target.storage.wd1+=1;
             };
    },
                        sub:true,
                    },
                },
            },
            "wd1":{
                mark:true,
                init:function (player){
        player.storage.wd1=0;
        player .syncStorage( 'wd1' )
    },
                intro:{
                    content:"已获得#毒印记",
                },
                trigger:{
                    player:"phaseJudgeBegin",
                },
                forced:true,
                content:function (){      
          'step 0'
        player.storage.wd1-=1;
        player.judge();
        'step 1'  
        event.a=get.suit(result.card);  
        player.chooseToDiscard("he",function(card){
return get.suit(card)==event.a;
});
         'step 2'  
        if(result.bool==false){
            player.loseHp();
        }
          'step 3'    
          if(player.storage.wd1>0){
event.goto(0);}
    },
                group:"wd1_1",
                subSkill:{
                    "1":{
                        trigger:{
                            player:["phaseEnd","phaseBefore"],
                        },
                        filter:function (event,player){
 return player.storage.wd1<=0;    
    },
                        forced:true,
                        content:function (){
        player.removeSkill('wd1');
    },
                        sub:true,
                    },
                },
            },
            "wd2":{
                trigger:{
                    player:["phaseEnd","phaseBefore"],
                },
                filter:function (event,player){
 return player.storage.mijwwdg<=0;    
    },
                forced:true,
                content:function (){
        player.removeSkill('mijwwdg');
        player.removeSkill('wd2');
    },
                group:["wd2_1","wd2_2"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"loseEnd",
                        },
                        forced:true,
                        filter:function (event,player){
        if(player.countCards('h')) return false;
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='h'&&player.storage.mijwwdg>0  ) return true;
        }
        return false;
    },
                        content:function (){
        player.storage.mijwwdg-=1;    
                player.draw(2);
    },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"damageEnd",
                        },
                        forced:true,
                        filter:function (event,player){
 return player.storage.mijwwdg>0;    
    },
                        content:function (){
                var a=trigger.num;
        player.storage.mijwwdg-=a; 
                player.draw(2*a);
    },
                        sub:true,
                    },
                },
            },
        },
        translate:{
            jjf:"金刚经",
            "jjf_info":"锁定技，你的防御距离+1",
            jgjjg:"jgjjg",
            "jgjjg_info":"",
            "jgj1":"jgj1",
            "jgj1_info":"",
            jgjh:"jgjh",
            "jgjh_info":"你受到非属性伤害减一",
            jgjj:"jgjj",
            "jgjj_info":"",
            mijljgj:"金刚经",
            "mijljgj_info":"你的防御距离加1直到你的下个回合开始。你的下个回合开始时若你未受到属性伤害，将此牌弃置并进行一次判定，若结果为方块，你受到非属性伤害减一直到游戏结束，若为红桃，你增加两点体力上限并回复两点体力，并摸恢复体力数的牌，若结果为黑色，当前回合你的手牌上限减2。",
            mijlxtj:"先天经",
            "mijlxtj_info":"你的武将牌翻面并摸等同于你当前体力值的牌。你的回合开始时将此牌弃置，若你有手牌，将之全部弃置，并判定x次，每有一张判定牌与你的弃置牌花色相同你增加一点体力上限并摸两张牌（x为你弃置牌数且最多为4）。",
            "yyj1":"阴阳经",
            "yyj1_info":"你的牌不可指定其他角色为目标，但你回合内摸牌时额外摸一张，当前回合你跳过弃牌阶段",
            mijlyyj:"阴阳经",
            "mijlyyj_info":"此牌需在出牌阶段第一张打出否则无效，当前回合你的牌不可指定其他角色为目标，但你回合内摸牌时额外摸一张，当前回合你跳过弃牌阶段，下个回合开始时将此牌弃置，进行两次判定，若均为红色，你回合内摸牌额外摸一张直到游戏结束，你的手牌上限加2；若均为黑色，你的黑色牌均可当杀使用，且无视距离与防具，并可额外指定一名目标，使用杀的次数限制加2，回合结束时你每杀死一名角色则你可以摸取等同其体力上限的牌数；若颜色均不同，你摸等同你体力值的牌数，弃牌阶段额外弃置等同你体力上限的牌数，你的回合内每张同名牌只能打出一次。",
            "yyj2":"阴阳经",
            "yyj2_info":"在你的回合内摸牌时额外摸一张牌",
            "yyj3":"阴阳经",
            "yyj3_info":"你的黑色牌均可当杀使用，且无视距离与防具，并可额外指定一名目标，使用杀的次数限制加2，回合结束时你每杀死一名角色则你可以摸取等同其体力上限的牌数",
            "yyj4":"阴阳经",
            "yyj4_info":"",
            "yyj5":"yyj5",
            "yyj5_info":"",
            "yyj6":"yyj6",
            "yyj6_info":"",
            mijlxyj:"玄玉经",
            "mijlxyj_info":"",
            "xyj1":"xyj1",
            "xyj1_info":"",
            "xyj2":"xyj2",
            "xyj2_info":"",
            mijwlsj:"灵速决",
            "mijwlsj_info":"",
            mijwwdg:"五毒功",
            "mijwwdg_info":"",
            "wd1":"wd1",
            "wd1_info":"",
            "wd2":"wd2",
            "wd2_info":"",
        },
    });

} };
}
