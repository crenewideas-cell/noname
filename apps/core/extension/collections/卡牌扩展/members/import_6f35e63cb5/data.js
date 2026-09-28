// Generated from 卡牌扩展.zip/(卡牌)逃离灵异学校(修).zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {"sd":{"name":"圣代木勺","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"wlx":{"name":"物理学圣剑","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"dt":{"name":"旧学校地图","init":"1","item":{"0":"〇张","1":"一张"}},"tsq":{"name":"铁丝钳","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"cs":{"name":"磁石吊坠","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"jz":{"name":"折叠锯子","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"qz":{"name":"一字起","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"chzj":{"name":"彩虹之镜","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"jjs":{"name":"结晶石","init":"2","item":{"0":"〇张","1":"一张","2":"两张"}},"lxx":{"name":"旅行箱","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"xk":{"name":"等级星卡","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"ys":{"name":"未知的钥匙","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"yzb":{"name":"圆珠笔","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"zz":{"name":"诅咒之符","init":"1","item":{"0":"〇张","1":"一张","2":"两张"}},"hong":{"name":"虹","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"miwu":{"name":"迷雾","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"shuizhiwu":{"name":"水之污","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"huiyi":{"name":"回忆","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"zaihui":{"name":"再会","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"shufu":{"name":"迷之束缚","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"youqing":{"name":"友情","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"hushen":{"name":"护身","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"gongxiang":{"name":"生命共享","init":"3","item":{"0":"〇张","1":"一张","3":"三张","5":"五张"}},"yimeng":{"name":"一梦","init":"1","item":{"0":"〇张","1":"一张","3":"三张"}}}, build(config, builder) {
builder.addPack({
        card:{
        },
        translate:{
        },
        list:[],
    });
builder.addPack({
        skill:{
            chupaibuneng:{
                mark:true,
                intro:{
                    content:"不能使用或打出牌",
                },
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
                    targetInRange:function (card){
                    return false;
                },
                },
            },
            "灵异_强攻":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
  return event.num>=1;
},
                title:function (){
return '<div class="text center" style="color:black">'+'可有可无之人';
},
                content:function (){
player.draw(2);
trigger.player.popup('呵，死小鬼');
game.log(player,':不要错过吾辈的表现');
            },
            },
            "灵异_策划":{
                audio:"ext:卡牌扩展/members/import_6f35e63cb5:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                check:function (event,player){
var pl=get.skillOwner('guzheng');
if(pl&&pl.isF(player)) return 1;
if(player.num('h','nanman')||player.num('h','wanjian')) return 1;
if(get.maxUse(player)>=player.num('h')*2/3) return 1;
if(player.hp==1) return 1;
if(player.hasShaTarget()&&(player.num('e','zhuge')||player.num('h','jiu'))) return 1;
if(player.num('h','tao')&&!player.isDamaged()) return 0;
return 0;
},
                content:function (){
player.recover();
trigger.player.popup('愚蠢');
game.log(player,':让你们见识一下什么才是真正的鬼畜道');
player.addTempSkill('jigong2','phaseAfter');
},
            },
            "灵异_补天":{
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                filter:function (event,player){
return player.num('h')>0;
},
                filterTarget:function (card,player,target){
return player!=target&&target.num('he')>0;
},
                check:function (card){
return 7-ai.get.value(card);
},
                selectTarget:[1,2],
                content:function (){
target.recover();
target.draw(target.hp);
},
            },
            "灵异_结合":{
                trigger:{
                    player:"damageBefore",
                },
                priority:6,
                filter:function (event, player) {
 if (!player.isZhu) return false;
 if (player.hp > 4) return false;
 for (var i = 0; i < game.players.length; i++) {
 if (game.players[i] != player) return true;
 }
 return false;
 },
                unique:true,
                content:function () {
 'step 0'
 var targets = get.players();
 targets.remove(player);
 event.targets = targets;
 'step 1'
 if (event.targets.length) {
 var current = event.targets.shift();
 if (current.group == 'shu') {
 current.chooseBool('是否令' + get.translation(player) + '防止伤害？').ai = function () {
 return ai.get.attitude(current, player) > 2;
 }
 event.current = current;
 }
 else {
 event.redo();
 }
 }
 else {
 event.finish();
 }
 'step 2'
 if (result.bool) {
 trigger.player = event.current;
 event.current.line(player, 'green');
 game.log(event.current, '令', player, '防止伤害');
 event.current.storage.sanying_jiehe = player;
 event.current.addSkill('sanying_jiehe_draw');
event.current.draw(0);
 }
 else event.goto(1);
 },
                subSkill:{
                    draw:{
                        trigger:{
                            player:"damageEnd",
                        },
                        popup:false,
                        forced:true,
                        content:function () {
 player.draw(player.storage.sanying_jiehe.hp);
 delete player.storage.sanying_jiehe;
 player.removeSkill('sanying_jiehe_draw');
 },
                        sub:true,
                    },
                },
            },
            "灵异_天石":{
                audio:"ext:卡牌扩展/members/import_6f35e63cb5:4",
                trigger:{
                    global:"dieBefore",
                },
                filter:function (event,player){
return event.player.hp<=0&&player.num('he')>0;
},
                direct:true,
                check:function (event,player){
var att1=ai.get.attitude(player,event.player);
var att2=ai.get.attitude(player,event.source);
return att1>att2&&att1>=0;
},
                content:function (){
"step 0"
var next=player.chooseToDiscard('he','是否发动【天石】？');
next.set('ai',ai.get.unuseful2);
next.set('logSkill','天石');
"step 1"
if(result.bool){
trigger.player.judge();
}
else{
event.finish();
}
"step 2"
switch(get.suit(result.card)){
case 'heart':trigger.player.recover(1-player.hp);break;
case 'diamond':trigger.player.draw(2);
trigger.untrigger();
trigger.finish();break;
case 'club':player.draw(2);break;
case 'spade':trigger.source.loseMaxHp();break;
}
},
                ai:{
                    expose:0.3,
                },
            },
            "灵异_阴谋":{
                trigger:{
                    player:"useCard",
                },
                direct:true,
                filter:function (event){
return get.type(event.card,'trick')=='trick';
},
                content:function (){
"step 0"
player.chooseTarget('是否发动【阴谋】？').ai=function(target){
var num=ai.get.attitude(player,target);
if(num>0){
if(target==player){
num++;
}
if(target.hp==1){
num+=3;
}
else if(target.hp==2){
num+=1;
}
}
return num;
}
"step 1"
if(result.bool){
player.logSkill('lingzhou',result.targets);
var target=result.targets[0];
if(target.hp<target.maxHp){
target.chooseControl('draw_card','recover_hp',function(event,target){
if(target.hp>=3&&target.num('h')<target.hp) return 'draw_card';
return 'recover_hp';
});
event.target=target;
}
else{
target.draw();
event.finish();
}
}
else{
event.finish();
}
"step 2"
if(result.control=='draw_card'){
event.target.draw();
}
else{
event.target.recover();
}
},
                ai:{
                    expose:0.2,
                    threaten:1.5,
                },
            },
            "灵异_诡计":{
                mod:{
                    selectTarget:function (card,player,range){
           if(card.name=='sha') range[1]+=2;
    },
                },
            },
            "灵异_诡计2":{
                trigger:{
                    player:"useCardBegin",
                },
                direct:true,
                filter:function (event,player){
        return event.targets.length==1&&get.type(event.card)=='trick'&&get.color(event.card)=='black';
    },
                position:"he",
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('灵异_诡计2'),function(card,player,target){
            var trigger=_status.event.getTrigger();
            return lib.filter.filterTarget(trigger.card,player,target)&&target!=trigger.targets[0];
        }).set('ai',function(target){
            var trigger=_status.event.getTrigger();
            var player=_status.event.player;
            return get.effect(target,trigger.card,player,player);
        });
        "step 1"
        if(result.bool){
            trigger.targets.push(result.targets[0]);
            player.logSkill('灵异_诡计2',result.targets);
        }
    },
            },
            "傲慢":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                frequent:true,
                filter:function (event,player){
if(player.get('e','2')) return false;
return true;
},
                content:function (){
player.draw(2);
trigger.player.popup('愚民就是矫情');
game.log(player,':哼……愚民就是这么不可理喻');
},
            },
            "隐瞒":{
                trigger:{
                    target:"shaBefore",
                },
                forced:true,
                filter:function (event,player){
if(player.get('e','2')) return false;
return (event.card.name=='sha'&&get.color(event.card)=='black')
},
                title:function (){
return '<div class="text center" style="color:black">'+'扭曲人格';
},
                content:function (){
trigger.untrigger();
trigger.finish();
trigger.player.popup('哼');
game.log(player,':愚民，离我和丽香姐远点');
},
                ai:{
                    effect:{
                        target:function (card,player,target){
if(target.get('e','2')) return;
if(card.name=='sha'&&get.color(card)=='black') return 'zerotarget';
},
                    },
                },
            },
            "沉睡":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
return !player.isTurnedOver();
},
                filterTarget:function (card,player,target){
return !target.isTurnedOver()&&player!=target;
},
                content:function (){
'step 0'
if(!player.isTurnedOver()){
player.turnOver();
}
'step 1'
if(!target.isTurnedOver()){
target.discard(target.get('he'));
}
},
                ai:{
                    order:1,
                    expose:0.2,
                    result:{
                        target:function (player,target){
if(ai.get.attitude(player,target)<-3&&player.identity!='zhu'){
return -1;
}
return 0;
},
                    },
                },
            },
            "异魂":{
                trigger:{
                    player:["damageBefore","loseHpBefore"],
                },
                forced:true,
                priority:10,
                title:function (){
return '<div class="text center" style="color:black">'+'无缘的异体者';
},
                content:function (){
trigger.untrigger();
trigger.finish();
player.draw();
trigger.player.popup('记住哦');
game.log(player,':千夏，如果有一天我消失了，不要来找我，一定不要……');
},
                mod:{
                    maxHandcard:function (player,num){
return num+3;
},
                },
            },
            "统魂":{
                trigger:{
                    player:"damageEnd",
                    target:"shaBegin",
                },
                priority:9,
                check:function (event,player){
return ai.get.attitude(player,event.source)<0;
},
                filter:function (event){
return event&&event.source;
},
                title:function (){
return '<div class="text center" style="color:black">'+'阴沉之眼';
},
                content:function (){
trigger.source.showHandcards();
trigger.source.addTempSkill('chupaibuneng');
trigger.player.popup('……');
game.log(player,':没事，就别和我说话');
},
                ai:{
                    threaten:0.6,
                },
            },
            "灵刃":{
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                position:"he",
                filterTarget:function (card,player,target){
return player!=target&&target.num('he')>0;
},
                check:function (card){
if(get.type(card)=='equip'){
var distance=get.info(card).distance;
if(distance){
if(distance.attackFrom<0||distance.globalFrom<0) return 10;
}
}
return 7-ai.get.value(card);
},
                content:function (){
"step 0"
event.type=get.type(cards[0],'trick');
var dme=ai.get.damageEffect(target,player,target);
target.chooseToDiscard('h',function(card){
return get.type(card,'trick')==event.type;
},'弃置一张牌'+get.translation(event.type)+'牌，或受流失一点体力并让来源恢复一点体力').ai=function(card){
if(dme<0){
return 8-ai.get.value(card);
}
return 0;
}
"step 1"
if(!result.bool){
target.loseHp();
player.recover();
}
},
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){
return ai.get.damageEffect(target,player);
},
                    },
                    threaten:2,
                    expose:0.2,
                },
            },
            "勇毅":{
                trigger:{
                    global:"shaHit",
                },
                forced:true,
                filter:function (event,player){
return _status.currentPhase!=player;
},
                title:function (){
return '<div class="text center" style="color:black">'+'毅勇谊长';
},
                content:function (){
var card;
for(var i=0;i<ui.cardPile.childNodes.length;i++){
if(ui.cardPile.childNodes[i].name=='wuxie'){
card=ui.cardPile.childNodes[i];
break;
}
}
if(card){
game.log(player,'：雾岛同学，你的旅行箱有很别致的轱辘呢');
player.gain(card);
player.$gain2(card);
game.log(player,'获得了',card);
trigger.player.popup('哎!这是轱辘呢');
}
else{
var card;
for(var i=0;i<ui.cardPile.childNodes.length;i++){
if(get.type(ui.cardPile.childNodes[i])=='trick'||get.type(ui.cardPile.childNodes[i])=='delay'){
card=ui.cardPile.childNodes[i];
break;
}
}
if(card){
game.log(trigger.player,'：诶，这不是旅行箱吗？为什么没有轱辘');
player.gain(card);
player.$gain2(card);
game.log(player,'获得了',card);
trigger.player.popup('怎么会!');
}
}
},
            },
            "应变":{
                enable:"phaseUse",
                filter:function (event,player){
return player.num('h','wuxie')>0;
},
                chooseButton:{
                    dialog:function (){
var list=[];
for(var i in lib.card){
if(!lib.translate[i+'_info']) continue;
if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
if(lib.card[i].type=='basic') list.push(['basic','',i]);
}
return ui.create.dialog('应变:请选择想要使用的基本牌',[list,'vcard']);
},
                    filter:function (button,player){
return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
},
                    check:function (button){
var player=_status.event.player;
var shaTarget=false;
for(var i=0;i<game.players.length;i++){
if(player.canUse('sha',game.players[i])&&ai.get.effect(game.players[i],{name:'sha'},player)>0){
shaTarget=true;
}
}
if(player.isDamaged()) return (button.link[2]=='tao')?1:-1;
if(shaTarget&&player.num('h','sha')&&!player.num('h','jiu')) return (button.link[2]=='jiu')?1:-1;
if(shaTarget&&!player.num('h','sha')) return (button.link[2]=='sha')?1:-1;
return 0;
},
                    backup:function (links,player){
return {
filterCard:{name:'wuxie'},
audio:1,
popname:true,
ai1:function(card){
return 8-ai.get.value(card);
},
viewAs:{name:links[0][2]},
}
},
                    prompt:function (links,player){
return '将一张无懈可击当'+get.translation(links[0][2])+'使用';
},
                },
                ai:{
                    order:6,
                    result:{
                        player:function (player){
if(player.isDamaged()) return 2;
return player.num('h','wuxie')-1;
},
                    },
                },
                group:["应变_sha","应变_shan","应变_tao"],
                subSkill:{
                    sha:{
                        audio:1,
                        enable:["chooseToRespond","chooseToUse"],
                        filterCard:{
                            name:"wuxie",
                        },
                        viewAs:{
                            name:"sha",
                        },
                        filter:function (event,player){
if(!player.num('h',{name:'wuxie'})) return false;
return event.parent.name!='phaseUse';
},
                        prompt:"将一张无懈可击当【杀】使用或打出",
                        check:function (card){
var player=_status.event.player;
if(player.num('h','sha')) return 6-ai.get.value(card);
return 7-ai.get.value(card);
},
                        ai:{
                            skillTagFilter:function (player){
if(!player.num('h',{name:'wuxie'})) return false;
},
                            respondSha:true,
                            useful:[10,8],
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
                        sub:true,
                    },
                    shan:{
                        audio:1,
                        enable:["chooseToRespond","chooseToUse"],
                        filterCard:{
                            name:"wuxie",
                        },
                        viewAs:{
                            name:"shan",
                        },
                        filter:function (event,player){
if(!player.num('h',{name:'wuxie'})) return false;
return event.parent.name!='phaseUse';
},
                        prompt:"将一张无懈可击当【闪】使用或打出",
                        check:function (card){
var player=_status.event.player;
if(player.num('h','shan')) return 6-ai.get.value(card);
return 7-ai.get.value(card);
},
                        ai:{
                            skillTagFilter:function (player){
if(!player.num('h',{name:'wuxie'})) return false;
},
                            respondShan:true,
                            useful:[10,8],
                            basic:{
                                useful:[7,2],
                                value:[7,2],
                            },
                        },
                        sub:true,
                    },
                    tao:{
                        audio:1,
                        enable:["chooseToRespond","chooseToUse"],
                        filterCard:{
                            name:"wuxie",
                        },
                        viewAs:{
                            name:"tao",
                        },
                        filter:function (event,player){
if(!player.num('h',{name:'wuxie'})) return false;
return event.parent.name!='phaseUse';
},
                        prompt:"将一张无懈可击当【桃】使用或打出",
                        check:function (card,player){
var player=_status.event.player;
if(player.num('h','tao')) return 6-ai.get.value(card);
return 7-ai.get.value(card);
},
                        ai:{
                            skillTagFilter:function (player){
if(!player.num('h',{name:'wuxie'})) return false;
},
                            save:true,
                            useful:[10,8],
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
                        sub:true,
                    },
                },
            },
            "灵异_看破":{
                filter:function (event,player){
return event.player!=player&&event.card&&(get.type(event.card)=='delay'||get.type(event.card)=='trick');
},
                check:function (event,player){
if(ai.get.attitude(player,event.player)>0){
return false;
}
if(get.tag(event.card,'respondSha')){
if(player.num('h',{name:'sha'})==0){
return true;
}
}
else if(get.tag(event.card,'respondShan')){
if(player.num('h',{name:'shan'})==0){
return true;
}
}
else if(get.tag(event.card,'damage')){
if(player.num('h')<2) return true;
}
else if(event.card.name=='shunshou'&&player.hp>2){
return true;
}
return false;
},
                priority:10,
                trigger:{
                    target:"useCardToBefore",
                },
                usable:1,
                content:function (){
"step 0"
"step 1"
trigger.untrigger();
trigger.finish();
"step 2"
if(trigger.player.num('he')){
player.addTempSkill('chupaibuneng');
}
},
                ai:{
                    expose:0.3,
                },
            },
            "求证":{
                unique:true,
                enable:"phaseUse",
                usable:1,
                intro:{
                    content:"",
                },
                mark:true,
                filterTarget:function (card,player,target){
return player!=target&&target.num('h');
},
                content:function (){
"step 0"
player.chooseCardButton(target,target.get('h')).filterButton=function(button){
return get.type(button.link)=='trick';
}
"step 1"
if(result.bool){
player.gain(result.links[0]);
target.$give(1,player);
target.damage();
game.delay(0,500);
}
},
                ai:{
                    order:11,
                    result:{
                        target:-1,
                        player:1,
                    },
                    threaten:1.3,
                },
            },
            "退思":{
                mod:{
                    globalTo:function (from,to,distance){
var n=0;
if(to.isZhu){
for(var i=0;i<game.dead.length;i++){
if(to!=game.dead[i]&&game.dead[i].group=='qun') n+=1;
}
}
return distance+n;
},
                },
            },
        },
        translate:{
            chupaibuneng:"出牌禁止",
            "灵异_强攻":"强攻",
            "灵异_强攻_info":"锁定技，每当你对一名角色造成多于1伤害时，你摸两张牌",
            "灵异_策划":"策划",
            "灵异_策划_info":"出牌阶段开始时，你可以恢复一点体力。若如此做，此回合你的手牌上限改为X(X为你此阶段造成的伤害数)",
            "灵异_补天":"补天",
            "灵异_补天_info":"出牌阶段限一次，你可以弃置一张手牌，然后指定至多两名角色令其各恢复一点体力并摸一张牌",
            "灵异_结合":"皆合",
            "灵异_结合_info":"主公技，当你受到伤害时，若你体力值不大于4，你可以让场上其他角色选择是否替你承担此伤害；若有角色替你承担伤害，则伤害结算后该角色摸等同于你体力值的牌。",
            "灵异_天石":"天石",
            "灵异_天石_info":"一名角色即将死亡时，你可以弃一张牌，并令其进行一次判定，判定结果为：♥该角色回复至1点体力；♦︎该角色摸两张牌并防止死亡；♣你摸两张牌；♠伤害来源减少一点体力上限",
            "灵异_阴谋":"阴谋",
            "灵异_阴谋_info":"每当你使用或打出一张非延时锦囊，可令一名角色恢复一点体力或摸一张牌",
            "灵异_诡计":"诡计",
            "灵异_诡计_info":"你使用的杀可指定至多2名角色为目标，你使用黑色锦囊牌可以后可以再指定一名目标",
            "灵异_诡计2":"诡计",
            "灵异_诡计2_info":"",
            "傲慢":"傲慢",
            "傲慢_info":"锁定技，你没有防具时，回合开始你摸2张牌",
            "隐瞒":"隐瞒",
            "隐瞒_info":"锁定技，你没有防具时，黑色的杀对你无效",
            "沉睡":"沉睡",
            "沉睡_info":"出牌阶段你可以翻面，然后弃置一名角色所有牌",
            "异魂":"异魂",
            "异魂_info":"锁定技，你免疫受到的伤害和体力流失并摸一张牌",
            "统魂":"统魂",
            "统魂_info":"每当你受到一次伤害或被杀指定时，可以令伤害来源展示手牌并不能使用或打出其手牌直到回合结束",
            "灵刃":"灵刃",
            "灵刃_info":"出牌阶段限1次，你可以弃置一张牌，并令一名角色弃置一张相同类别的牌，不然则受到1点体力流失伤害然后你回复1点体力",
            "勇毅":"勇毅",
            "勇毅_info":"锁定技，你的回合外，一名角色被杀命中后，你获得一张无懈可击",
            "应变":"应变",
            "应变_info":"你可以将无懈可击当任意基本牌使用",
            "灵异_看破":"看破",
            "灵异_看破_info":"每当你受到其他角色的选定后，你可以使用这个技能取消，然后你不可以使用任何卡牌直到此角色回合结束",
            "求证":"求证",
            "求证_info":"出牌阶段，你可以观看一名角色的手牌，并获得其中一张锦囊牌并若你获得则令其受到一点伤害，否则结算完毕.每阶段限一次。",
            "退思":"退思",
            "退思_info":"场上每有一个群势力角色阵亡时，你与其他角色的距离永远+1",
        },
    });
var list=[];
var n;
n=parseInt(config.sd);
while(n--){
            list.push(['spade',5,'sd']);
        }
n=parseInt(config.wlx);
while(n--){
            list.push(['spade',3,'wlx']);
        }
n=parseInt(config.dt);
while(n--){
            list.push(['spade',9,'dt']);
        }
n=parseInt(config.tsq);
while(n--){
            list.push(['spade',13,'tsq']);
        }
n=parseInt(config.cs);
while(n--){
            list.push(['spade',1,'cs']);
        }
n=parseInt(config.jz);
while(n--){
            list.push(['spade',12,'jz']);
        }
n=parseInt(config.qz);
while(n--){
            list.push(['spade',11,'qz']);
        }
n=parseInt(config.chzj);
while(n--){
            list.push(['spade',6,'chzj']);
        }
n=parseInt(config.jjs);
while(n--){
            list.push(['spade',7,'jjs']);
        }
n=parseInt(config.lxx);
while(n--){
            list.push(['spade',12,'lxx']);
        }
n=parseInt(config.xk);
while(n--){
            list.push(['spade',3,'xk']);
        }
n=parseInt(config.ys);
while(n--){
            list.push(['spade',7,'ys']);
        }
n=parseInt(config.yzb);
while(n--){
            list.push(['spade',6,'yzb']);
        }
n=parseInt(config.zz);
while(n--){
            list.push(['spade',10,'zz']);
        }
n=parseInt(config.hong);
while(n--){
            list.push(['spade',13,'hong']);
        }
n=parseInt(config.miwu);
while(n--){
            list.push(['spade',11,'miwu']);
        }
n=parseInt(config.shuizhiwu);
while(n--){
            list.push(['spade',2,'shuizhiwu']);
        }
n=parseInt(config.huiyi);
while(n--){
            list.push(['spade',1,'huiyi']);
        }
n=parseInt(config.zaihui);
while(n--){
            list.push(['spade',5,'zaihui']);
        }
n=parseInt(config.shufu);
while(n--){
            list.push(['spade',4,'shufu']);
        }
n=parseInt(config.youqing);
while(n--){
            list.push(['spade',8,'youqing']);
        }
n=parseInt(config.hushen);
while(n--){
            list.push(['spade',1,'hushen']);
        }
n=parseInt(config.gongxiang);
while(n--){
            list.push(['spade',9,'gongxiang']);
        }
n=parseInt(config.yimeng);
while(n--){
            list.push(['spade',10,'yimeng']);
        }
builder.addPack({
            card:{
                sd:{
            fullimage:true,
			type:'equip',
			subtype:'equip2',
			skills:['sd_skill']
,
			ai:{
				basic:{
					equipValue:7
				}
			},
                },
                wlx:{
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			distance:{attackFrom:-5},
			skills:['wlx_skill']
,
			ai:{
				basic:{
					equipValue:4
				}
			},
                },
                dt:{
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			skills:['dt_skill']
,
			ai:{
				basic:{
					equipValue:8
				}
			},
                },
                tsq:{
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			distance:{attackFrom:-2}, 
			skills:['tsq_skill']
,
			ai:{
				basic:{
					equipValue:9
				}
			},
                },
              cs:{
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			distance:{attackFrom:-1}, 
			skills:['cs_skill']
,
			ai:{
				basic:{
					equipValue:2
				}
			},
                },
                jz:{
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			distance:{attackFrom:-2},
			skills:['jz_skill']
,
			ai:{
				basic:{
					equipValue:9
				}
			},
                },
                qz:{
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			distance:{attackFrom:-1},
			skills:['qz_skill']
,
			ai:{
				basic:{
					equipValue:4
				}
			},
                },
                chzj:{
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			skills:['chzj_skill']
,
			ai:{
				basic:{
					equipValue:9
				}
			},
                },
                jjs:{
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			skills:['jjs_skill']
,
			ai:{
				basic:{
					equipValue:3
				}
			},
                },
                lxx:{
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			skills:['lxx_skill']
,
			ai:{
				basic:{
					equipValue:9
				}
			},
                },
                xk:{
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			skills:['xk_skill']
,
			ai:{
				basic:{
					equipValue:5
				}
			},
                },
                ys:{
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			skills:['ys_skill']
,
			ai:{
				basic:{
					equipValue:8
				}
			},
                },
                yzb:{
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			skills:['yzb_skill']
,
			ai:{
				basic:{
					equipValue:3
				}
			},
                },
                zz:{
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			skills:['zz_skill']
,
			ai:{
				basic:{
					equipValue:9
				}
			},
                },
                hong:{
            fullimage:true,
            enable:true,
            type:'basic',
            selectTarget:-1,
            filterTarget:function (card,player,target){
return player!=target&&get.distance(player,target,'attack')<1;
},
            content:function(){
          player.useCard({name:'tao'},target,false);
            },
        ai:{
              basic:{
                    order:3,
                         },
             result:{
                   player:1,
                         },
               },
                },
                miwu:{
            fullimage:true,
            enable:true,
            type:'basic',
            selectTarget:1,
            filterTarget:function (card,player,target){
return player!=target&&target.num('he');
},
            content:function(){
          target.discard(target.get('he').randomGet());
		  target.draw();
          player.recover(); 
            },
        ai:{
              basic:{
                    order:9,
                         },
             result:{
                   target:-1,
                         },
               },
                },
                shuizhiwu:{
            fullimage:true,
            enable:true,
            type:'trick',
            selectTarget:-1,
            filterTarget:function (card,player,target){
return target.num('e')>0;
},
            content:function(){
           target.draw(2);
          target.addTempSkill('chupaibuneng');
            },
        ai:{

				order:9,

				result:{

					target:function(player,target){

						if(target.num('j')) return -1;

						return 0;

					}

				},

				tag:{

					multitarget:1,

					multineg:1

				}

			},
                },
                huiyi:{
            fullimage:true,
            enable:true,
            type:'trick',
            selectTarget:1,
            filterTarget:function (card,player,target){
return player!=target;
},
            content:function(){
          target.phase();
            },
        ai:{
              basic:{
                    order:1,
                         },
             result:{
                   target:1,
                         },
               },
                },
                zaihui:{
            fullimage:true,
            enable:true,
            type:'trick',
            selectTarget:-1,
            filterTarget:function (card,player,target){
return player==target;
},
            content:function(){
          'step 0'
          player.draw();
          'step 1'
          player.showHandcards();
          if(player.num('h',{color:'red'})>player.num('h',{color:'black'})){
             player.recover(player.maxHp-player.hp);
             player.recover();
              }
             else{
             player.damage();
                }
            },
        ai:{
              basic:{
                    order:7,
                         },
             result:{
                   player:2,
                         },
               },
                },
                shufu:{
            fullimage:true,
            enable:true,
            type:'trick',
            filterTarget:function (card,player,target){
return target.num('h');
},
            content:function(){
          target.draw(target.num('h'));
          target.addTempSkill('chupaibuneng');
            },
        ai:{
              basic:{
                    order:10.5,
                         },
             result:{
                   target:function (player,target){
return target.num('h');
},
                         },
               },
                },
                youqing:{
            fullimage:true,
            enable:true,
            type:'trick',
            selectTarget:1,
            filterTarget:function (card,player,target){
return player!=target&&target.num('hej');
},
            content:function(){
          target.recover();
target.draw();
player.draw();
player.recover();
            },
        ai:{
              basic:{
                    order:1,
                         },
             result:{
                   target:1,
                         },
               },
                },
                hushen:{
            fullimage:true,
            enable:true,
            type:'trick',
            filterTarget:function (card,player,target){
return target.num('h');
},
            content:function(){
          target.damage();
          target.changeHujia(2);
         },
        ai:{
              basic:{
                    order:1,
                         },
             result:{
                   target:1,
                         },
               },
                },
                gongxiang:{
            fullimage:true,
            enable:true,
            type:'trick',
            filterTarget:function (card,player,target){
return target!=player;
},
            content:function(){
          num=Math.ceil((target.hp+player.hp)/2);
          player.hp=num;
          player.update();
          target.hp=num;
          target.update();
		  game.log(player,'和',target,'的体力值均调整为'+num+'点')
            },
        ai:{
              basic:{
                    order:9.5,
                         },
             result:{
                   target:function (player,target){
if(player.hp>target.hp&&Math.ceil((target.hp+player.hp)/2)>target.hp) return 5;
if(player.hp<target.hp&&Math.ceil((target.hp+player.hp)/2)<target.hp) return -2;
},
                         },
               },
                },
                yimeng:{
            fullimage:true,
            enable:true,
            type:'basic',
            selectTarget:1,
            filterTarget:function (card,player,target){
return player!=target&&target.num('he');
},
            content:function(){
          target.showHandcards();
          player.draw();
            }, 
        ai:{
              basic:{
                    order:1,
                         },
             result:{
                   target:-10,
                         },
               },
                },				
            },
            translate:{
                sd:'圣代木勺',
                sd_info:'这是一个很久以前孤芳自赏的女生的遗物，里面残存了对男生的怨念与仇恨(男性的杀对你无效)',
                wlx:'物理学圣剑',
                wlx_info:'传说中最强的神器，拥有最高的攻击距离，轻轻一用力就可以达到伤人的地步(受到伤害时弃置一张牌，对伤害来源造成一点伤害)',
                dt:'旧学校地图',
                dt_info:'这个学校的地图，似乎有什么模糊的字显示在背面——千万别去…。这个可以加速或减速发现吗？(体力大于二时攻击距离+1，体力小于二时防御距离+1)',
                tsq:'铁丝钳',
                tsq_info:'一把崭新的铁丝钳，是最近有人拿来做什么事的，要得到它必须舍弃自己的防具。它也同时是至关重要的物品(你使用的杀直接命中，但必须卸下自己的防具。)',
                cs:'磁石吊坠',
                cs_info:'用已有物拼接的小物件，可以用于吸附细小的东西，但好像会它更会吸附其他的……(当你造成伤害时，你可以防止此伤害并得到目标的一张任意区域的牌)',
                jz:'折叠锯子',
                jz_info:'力量惊人的家伙，或许可以清理一切障碍，这是被一个叫伊东的老师带来的。或许它也是很重要的物品(你造成伤害时，弃置一张牌可令该伤害+1)',
                qz:'一字起',
                qz_info:'这是唯一一个能砸开结晶石的物品，但是它似乎也无法完胜结晶石(你造成伤害时弃置此武器，让目标弃置所有装备)',
                chzj:'彩虹之镜',
                chzj_info:'带有诅咒的护身之镜。当中可以困住恶灵。很重要的物品，虽然已经碎了以往的效果，但依然能激发千夏无穷的勇气(得到其他角色使用的无懈可击)',
                jjs:'结晶石',
                jjs_info:'在化学实验中结成的结晶，它见证了一段真实的感情诞生和灭亡。那段感情是否还在等待？或许它能给我们答案(受到伤害时可以弃置一张装备回复一点体力)',
                lxx:'旅行箱',
                lxx_info:'被雾岛小枝带来的旅行箱，能容纳许许多多的东西，与此同时，它似乎还在吸收看不见的东西(装备它时，手牌上限+2。在回合结束时额外摸两张牌)',
                xk:'等级星卡',
                xk_info:'一份要求苛刻至极的借书清单，对于任何意外都概不负责。似乎它的列出者一直都在等待它(你被卡牌指定时，可弃置一张装备或判定区的牌取消之。你不能接受延时锦囊)',
                ys:'未知的钥匙',
                ys_info:'专门来破除符咒的钥匙，一旦用它破除符咒，会发生可怕的事。因该是很重要的东西(出牌阶段可以弃置一名角色的一张黑色牌，然后你摸两张牌)',
                yzb:'圆珠笔',
                yzb_info:'伪装成圆珠笔的钢笔，不知道它的主人为何要这么做。而且它居然是要吸收粉笔粉才能写出字来的奇怪钢笔(准备阶段你摸两张牌)',
                zz:'诅咒之符',
                zz_info:'用来封印谁的符咒，可能是不想让重要的人看到的地方被封印了。毕竟贴它的地方一丝邪恶的气息都没有。这应该也是很重要的东西(装备它后跳过判定阶段，且不会用光自己的牌)',
                hong:'虹',
                hong_info:'视为对攻击范围内所有角色使用桃',
                miwu:'迷雾',
                miwu_info:'随机弃置目标一张牌，然后其摸一张牌你回复一点体力',
                shuizhiwu:'水之污',
                shuizhiwu_info:'所有装备区内有牌的角色摸两张牌，但此角色无法再在你的回合使用任何牌(包括你也无法使用)',
                huiyi:'回忆',
                huiyi_info:'令目标进行额外的回合',
                zaihui:'再会',
                zaihui_info:'你摸一张牌并展示手牌，若红色牌多于黑色牌，你回复所有体力并手牌翻倍；若黑色牌不少于红色牌，你流失一点体力',
                shufu:'迷之束缚',
                shufu_info:'令目标手牌数翻倍但不可打出任何手牌',
                youqing:'友情',
                youqing_info:'你与目标恢复一点体力并摸一张牌',
                hushen:'护身',
                hushen_info:'你对目标造成一点伤害，然后其得到两点护甲',
                gongxiang:'灵魂共享',
                gongxiang_info:'平衡你与目标的体力（向上取整）',
                yimeng:'一梦',
                yimeng_info:'出牌阶段，令一名角色展示所有手牌，然后你摸一张牌',
            }, 
            list:list
        });
builder.skill.sd_skill={
			 mod:{
targetEnabled:function(card,player,target){
if(card.name=='sha'&&player.sex=='male') return false;
}
} 
		}
builder.translate.sd_skill='圣代木勺';
builder.skill.wlx_skill={
			 trigger:{player:"damageEnd",},
			priority:5,
        filter:function(event,player){
        return player.num('h');
        },
			content:function(){
           'step 0'
				 player.chooseToDiscard('h',true)
           'step 1'
           trigger.source.damage();
			}, 
		}
builder.translate.wlx_skill='物理学圣剑';
builder.skill.dt_skill={
			 mod:{
				globalFrom:function(from,to,current){
					if(from.hp>2) return current-1;
				},
				globalTo:function(from,to,current){
					if(to.hp<=2) return current+1;
				},
			},
			ai:{
				threaten:0.8
			}, 
		}
builder.translate.dt_skill='旧学院地图';
builder.skill.tsq_skill={
			 trigger:{player:"shaBegin",},
			priority:5,
			content:function(){
           'step 0'
				trigger.directHit=true;
           'step 1'
player.discard(player.get('e',{subtype:['equip2']}));
			}, 
		}
builder.translate.tsq_skill='铁丝钳';
builder.skill.cs_skill={
			 trigger:{
source:"damageBefore",
},
check:function (event,player){
if(ai.get.damageEffect(event.player,player,player)<0) return true;
if(ai.get.attitude(player,event.player)>0&&event.player.num('h')) return true;
var cards=event.player.get('e');
for(var i=0;i<cards.length;i++){
if(ai.get.equipValue(cards[i])>=6) return true;
}
return false;
},
content:function (){
if(trigger.player.num('hej')){
player.gainPlayerCard(trigger.player,'hej',true);
}
trigger.untrigger();
trigger.finish();
},
		}
builder.translate.cs_skill='磁石吊坠';
builder.skill.jz_skill={
			 trigger:{source:'damageBegin'},
			direct:true,
			content:function(){
				"step 0"
				player.chooseToDiscard('是否弃置一张牌使伤害+1？','he').ai=function(card){
					if(ai.get.attitude(player,trigger.player)<0){
						return 7-ai.get.value(card);
					}
				}
				"step 1"
				if(result.bool){
					player.logSkill('jz_skill');
					trigger.num++;
				}
			},
			ai:{
				threaten:1.8
			}, 
		}
builder.translate.jz_skill='折叠锯子';
builder.skill.qz_skill={
			 trigger:{source:'damageEnd'},
			// group:'unequip',
			check:function(event,player){
				return ai.get.attitude(player,event.player)<0;
			},
			direct:true,
			filter:function(event,player){
				return event.player.num('e');
			},
			content:function(){
				"step 0"
				var att=ai.get.attitude(player,trigger.player);
				var next=player.chooseToDiscard('e','是否发动【一字起】？');
				next.ai=function(card){
					if(att<0) return 7-ai.get.value(card);
					return -1;
				}
				next.logSkill=['qz_skill',trigger.player];
				"step 1"
				if(result.bool){
					trigger.player.discard(trigger.player.get('e'));
				}
			},
			ai:{
				expose:0.3
			}, 
		}
builder.translate.qz_skill='一字起';
builder.skill.chzj_skill={
			 trigger:{global:'useCard'},
			filter:function(event,player){
				if(event.card.name!='wuxie') return false;
				if(event.player==player) return false;
				if(event.cards){
					for(var i=0;i<event.cards.length;i++){
						if(get.position(event.cards[i])=='d') return true;
					}
				}
				return false;
			},
			frequent:true,
			content:function(){
				var cards=trigger.cards.slice(0);
				for(var i=0;i<cards.length;i++){
					if(get.position(cards[i])!='d'){
						cards.splice(i--,1);
					}
				}
				game.delay(0.5);
				player.gain(cards,'gain2');
			}, 
		}
builder.translate.chzj_skill='彩虹之镜';
builder.skill.jjs_skill={
			 trigger:{player:"damageEnd",},
			priority:5,
        filter:function(event,player){
        return player.num('h');
        },
			content:function(){
           'step 0'
				 player.recover();
           'step 1'
           trigger.player.chooseToDiscard('e',true);
			}, 
		}
builder.translate.jjs_skill='结晶石';
builder.skill.lxx_skill={
			 trigger:{player:'phaseEnd',},
			priority:5,
			content:function(){
				player.draw(2)
			},
		  mod:{
        maxHandcard:function
        (player,num){ 
        return num+2; 
        },
        }, 
		}
builder.translate.lxx_skill='旅行箱';
builder.skill.xk_skill={
			 group:'swd_wuxie',
			direct:true,
			filter:function(event,player){
				return event.player!=player&&player.num('ej')>1;
			},
			trigger:{target:'useCardToBefore'},
			content:function(){
				"step 0"
				var next=player.chooseToDiscard('是否弃置一张装备或判定区的牌使'+get.translation(trigger.card)+'失效？','ej',1);
				next.logSkill='xk_skill';
				next.ai=function(card){
					if(ai.get.effect(player,trigger.card,trigger.player,player)<0){
						if(get.tag(trigger.card,'respondSha')&&player.num('h','sha')) return 0;
						if(get.tag(trigger.card,'respondShan')&&player.num('h','shan')) return 0;
						return 4-ai.get.value(card);
					}
					return 0;
				}
				"step 1"
				if(result.bool){
					trigger.untrigger();
					trigger.finish();
				}
			}, 
		}
builder.translate.xk_skill='等级星卡';
builder.skill.ys_skill={
			 enable:"phaseUse",
usable:1,
filterTarget:function (card,player,target){
return player!=target&&target.num('hej');
},
content:function (){
"step 0"
player.chooseCardButton(target,target.get('hej')).set('filterButton',function(button){
return get.color(button.link)=='black';
});
"step 1"
if(result.bool){
target.discard(result.links[0]);
player.draw(2);
}
},
ai:{
order:11,
result:{
target:function (player,target){
return -target.num('hej');
},
},
threaten:1.1,
}, 
		}
builder.translate.ys_skill='未知的钥匙';
builder.skill.yzb_skill={
			 trigger:{
player:"phaseBegin",
},
forced:true,
content:function (){
player.draw(2);
},
		}
builder.translate.yzb_skill='圆珠笔';
builder.skill.zz_skill={
			 group:["lianying"],
trigger:{
player:"phaseJudgeBefore",
},
forced:true,
content:function (){
trigger.untrigger();
trigger.finish();
}, 
		}
builder.translate.zz_skill='诅咒之符';
builder.skill._youqing_import_6f35e63cb5={
			trigger:{global:'damageEnd'},
			direct:true,
			filter:function(event,player){
				if(event.player==player) return false;
				if(!event.player.isAlive()) return false;
				if(player.num('h','yxcc')) return true;
				var mn=player.get('e','5');
			 if(mn&&mn.name=='muniu'&&mn.cards&&mn.cards.length){	
				for(var i=0;i<mn.cards.length;i++){
						if(mn.cards[i].name=='yxcc') return true;
					}
				}
				return false;
			},
			content:function(){
				player.chooseToUse('是否对'+get.translation(trigger.player)+'使用野性穿刺？',function(card,player){
					if(card.name!='yxcc') return false;	
				var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
					if(mod!='unchanged') return mod;
					return true;
				},
trigger.player,-1);
			}
		}
builder.skill._yimeng_import_6f35e63cb5={
			trigger:{global:'phaseEnd'},
        popup:false,
        forced:true,
			filter:function(event,player){
				if(event.player.storage.yydgj) return true;
			},

			content:function(){
					if(trigger.player.identity!='nei'){
					trigger.player.storage.yydgj=false;
					trigger.player.identity='nei';
					trigger.player.setIdentity('nei');
					trigger.player.identityShown=true;
					}
					else{
					trigger.player.storage.yydgj=false;
					trigger.player.discard(trigger.player.get('he'));
					trigger.player.loseHp();
					}
			}
		}
} };
}
