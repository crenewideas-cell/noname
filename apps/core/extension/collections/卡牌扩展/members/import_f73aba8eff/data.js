// Generated from 绮梦千年2纯卡牌拓展.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
        "Nirvana_朗基努斯枪":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				distance:{attackFrom:-3},
				ai:{
					basic:{
						equipValue:2,
					}
				},
				skills:['Nirvana_弑圣']
			},
			     "Nirvana_雪霞狼":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				distance:{attackFrom:-3},
				ai:{
					basic:{
						equipValue:3,
					}
				},
				skills:['Nirvana_破邪']
			},
			"Nirvana_流光星陨刀":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				distance:{attackFrom:-1},
				ai:{
					basic:{
						equipValue:7,
					}
				},
				skills:['Nirvana_流星落']
			},
			"Nirvana_冈格尼尔":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				distance:{attackFrom:-3},
				ai:{
					basic:{
						equipValue:2,
					}
				},
				skills:['Nirvana_必中的贯穿']
			},
			"Nirvana_莱瓦汀":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				distance:{attackFrom:-1},
				ai:{
					basic:{
						equipValue:2,
					}
				},
				skills:['Nirvana_焚天之炎']
			},
			"Nirvana_七宗罪":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				onLose:function(){
				player.removeAdditionalSkill('Nirvana_龙血筛选');
		 },							
				distance:{attackFrom:-2},
				ai:{
					basic:{
						equipValue:3,
					}
				},
				skills:['Nirvana_龙血筛选','Nirvana_罪与罚']
			},
			"Nirvana_剑刃狮鹫":{
				fullskin:true,
				type:'equip',
				subtype:'equip4',
				distance:{globalFrom:-2},
				skills:['Nirvana_翼剑飓风']
			},
			"Nirvana_剑师护肩":{
				fullskin:true,
				type:'equip',
				subtype:'equip2',
				onEquip:function(){
						player.changeHujia();
					},
				ai:{
					basic:{
						equipValue:7.5
					}
				},
				skills:['Nirvana_霸王烈风剑']
			},
			"Nirvana_阿鼻":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				distance:{attackFrom:-2},
				ai:{
					basic:{
						equipValue:3,
					}
				},
				skills:['Nirvana_弑魂']
			},
			"Nirvana_切裂世界之剑_initial":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				onEquip:function(){
				 player.loseHp();
						player.loseMaxHp();
					},
					nomod:true,
				nopower:true,
				unique:true,
				distance:{attackFrom:-2},
				skills:['Nirvana_世界切裂','Nirvana_时空撕裂'],
				ai:{
					equipValue:6
				}
			},
			"Nirvana_切裂世界之剑_wedding":{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				distance:{attackFrom:-2},
				legend:true,
				nomod:true,
				nopower:true,
				unique:true,
				cardimage:'Nirvana_切裂世界之剑_wedding',
				skills:['Nirvana_世界切裂_断','Nirvana_世界切裂_破'],
				ai:{
					equipValue:7
				}
			},
			"Nirvana_星月幻化项链":{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				ai:{
					basic:{
						equipValue:3,
					}
				},
				skills:['Nirvana_星月幻化']
			},
			    
        },
        translate:{
        'Nirvana_朗基努斯枪':'朗基努斯枪',
        'Nirvana_弑圣_info':'因果律武器，当你使用【杀】对目标角色造成伤害时，若目标体力不大于0或为∞，你可以令其立即死亡(不结算奖惩)',
			     'Nirvana_朗基努斯枪_info':'因果律武器，当你使用【杀】对目标角色造成伤害时，若目标体力不大于0或为∞，你可以令其立即死亡(不结算奖惩)',
			     'Nirvana_雪霞狼':'雪霞狼',
        'Nirvana_破邪_info':'锁定技，你使用【杀】结算结束前，目标角色不能使用或打出手牌，且此【杀】无视其防具;并且其不能回复体力直至其回合开始',
			     'Nirvana_雪霞狼_info':'锁定技，你使用【杀】结算结束前，目标角色不能使用或打出手牌，且此【杀】无视其防具;并且其不能回复体力直至其回合开始',
			     'Nirvana_流光星陨刀':'流光星陨刀',
			     'Nirvana_流星落3':'星屑斩',
        'Nirvana_流星落_info':'锁定技，你使用的非属性【杀】均视为火【杀】，你以此法使用的火【杀】2%机率增加2/3点伤害；装备此武器后，你获得每回合使用一次【星屑斩】的能力，【星屑斩】:出牌阶段限一次，你可以指定一名攻击范围内的角色，依次将手牌中的至多3张杀对该角色使用，若杀造成了伤害，你摸一张牌',
			     'Nirvana_流光星陨刀_info':'锁定技，你使用的非属性【杀】均视为火【杀】，你以此法使用的火【杀】2%机率增加2/3点伤害；装备此武器后，你获得每回合使用一次【星屑斩】的能力，【星屑斩】:出牌阶段限一次，你可以指定一名攻击范围内的角色，依次将手牌中的至多3张杀对该角色使用，若杀造成了伤害，你摸一张牌',
			     'Nirvana_冈格尼尔':'冈格尼尔',
        'Nirvana_必中的贯穿_info':'锁定技，你使用的【杀】均转化为雷【杀】，你使用的【杀】不能被【闪】响应，你对一名角色使用【杀】造成伤害后，若其下家不是你，你对该下家造成同等伤害',
			     'Nirvana_冈格尼尔_info':'锁定技，你使用的【杀】均转化为雷【杀】，你使用的【杀】不能被【闪】响应，你对一名角色使用【杀】造成伤害后，若其下家不是你，你对该下家造成同等伤害',
			     'Nirvana_莱瓦汀':'莱瓦汀',
        'Nirvana_焚天之炎_info':'你使用的【杀】可以变成火【杀】，你以此法使用火【杀】对一名角色造成伤害时，造成的伤害数为X(X=目标体力上限-目标体力数，且X最小为1)',
			     'Nirvana_莱瓦汀_info':'你使用的【杀】可以变成火【杀】，你以此法使用火【杀】对一名角色造成伤害时，造成的伤害数为X(X=目标体力上限-目标体力数，且X最小为1)',
			     'Nirvana_七宗罪':'七宗罪',
			     'Nirvana_罪与罚_info':'你对目标使用的【杀】不会被【闪】响应，该回合内你使用【杀】没有次数限制造成的伤害翻倍',
        'Nirvana_龙血筛选_info':'出牌阶段开始时，根据X的值你拔出七宗罪其中的剑并得到对应效果(X=3*体力值-手牌数,体力值大于4则不能触发),值小于1,你流失两点体力;不小于1,日本肋差“色欲”;不小于2,亚特坎长刀“饕餮”;不小于3,苏格兰阔剑“贪婪”;不小于4,汉八方“傲慢”;不小于5,太刀“妒忌”;不小于6,斩马刀“暴怒”;不小于7,日本武士刀“懒惰”,若你拔出全部的剑，你激活炼金领域罪与罚(你对目标使用的【杀】不会被【闪】响应，该回合内你使用【杀】没有次数限制造成的伤害翻倍)，失去该装备时，以上效果一并失效',
			     'Nirvana_七宗罪_info':'出牌阶段开始时，根据X的值你拔出七宗罪其中的剑并得到对应效果(X=3*体力值-手牌数,体力值大于4则不能触发),值小于1,你流失两点体力;不小于1,日本肋差“色欲”;不小于2,亚特坎长刀“饕餮”;不小于3,苏格兰阔剑“贪婪”;不小于4,汉八方“傲慢”;不小于5,太刀“妒忌”;不小于6,斩马刀“暴怒”;不小于7,日本武士刀“懒惰”,若你拔出全部的剑，你激活炼金领域罪与罚(你对目标使用的【杀】不会被【闪】响应，该回合内你使用【杀】没有次数限制造成的伤害翻倍)，失去该装备时，以上效果一并失效',
			     'Nirvana_剑刃狮鹫':'剑刃狮鹫',
		     	'Nirvana_剑刃狮鹫_bg':'-马',
		     	'Nirvana_翼剑飓风':'翼剑飓风',
		     	'Nirvana_剑刃狮鹫_info':'装备后你获得每回合发动一次【翼剑飓风】的能力(【翼剑飓风】:你对攻击范围内的角色造成一点伤害)',
		     	'Nirvana_剑师护肩':'剑师护肩',
		     	'Nirvana_剑师护肩_bg':'肩',
		     	'Nirvana_霸王烈风剑':'霸王烈风剑',
		     	'Nirvana_剑师护肩_info':'装备时你获得1点护甲，装备后你获得每回合发动一次【霸王烈风剑】的能力(【霸王烈风剑】:若你的护甲值不为0，牺牲所有护甲发动，你选择攻击范围内的1~3名角色并对其造成一点伤害)',
		     	'Nirvana_阿鼻':'阿鼻',
        'Nirvana_弑魂_info':'当你杀死一名角色后，你获得该角色的体力上限，回复该角色的体力上限一半数的体力(向下取整)，该角色移出游戏',
			     'Nirvana_阿鼻_info':'当你杀死一名角色后，你获得该角色的体力上限，回复该角色的体力上限一半数的体力(向下取整)，该角色移出游戏',
			     'Nirvana_切裂世界之剑_initial':'切裂世界剑',
			     'Nirvana_切裂世界之剑_initial_info':'装备时流失一点体力并减1体力上限。当你对一名角色使用【杀】后，7%令敌方暂时移出游戏一回合，否则此【杀】必中且伤害翻倍<br><br>注:本局游戏中，当你累计杀死三名角色时该武器升格<br><br>小子，我看你骨骼精奇，啧，不得了啊不得了，刚才还有道灵光从你的天灵盖喷出来，必是练武奇才，将来维护宇宙正义与和平的重任就交给你了！撒，来和这把剑订下契约吧，少年<br>                                      ――某三流推销员这样诱惑道',
			     'Nirvana_切裂世界之剑_wedding':'切裂世界剑',
			     'Nirvana_切裂世界之剑_wedding_info':'你使用的【杀】无视防具，且不能被【闪】响应。当你击杀一名其他角色后，你可以令其余角色按座次逐一死亡。<br><br>世界啊，毁灭吧',
			     'Nirvana_星月幻化项链':'星月幻化链',
			     'Nirvana_星月幻化_info':'这奇怪的项链，随着时间变化会发生不同鉴定的改变',
			     'Nirvana_星月幻化项链_info':'这奇怪的项链，随着时间变化会发生不同鉴定的改变',
        },
        list:[
        ["diamond",13,"Nirvana_雪霞狼"],
        ["heart",5,"Nirvana_流光星陨刀"],
        ["club",9,"Nirvana_冈格尼尔"],
        ["spade",4,"Nirvana_莱瓦汀"],
        ["diamond",11,"Nirvana_七宗罪"],
        ["club",6,"Nirvana_剑刃狮鹫"],
        ["spade",2,"Nirvana_剑师护肩"],
        ["heart",5,"Nirvana_阿鼻"],
        ["heart",9,"Nirvana_切裂世界之剑_initial"],
        ["club",5,"Nirvana_星月幻化项链"],
        ["diamond",7,"Nirvana_朗基努斯枪"]
        ],
    });
builder.addPack({
        skill:{
           "Nirvana_弑圣":{
                trigger:{
                    source:"damage",
                },
                filter:function (event,player){
    return event.card&&(event.card.name=='sha')&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2'&&(event.player.hp<=0||event.player.hp==Infinity);
            },
                check:function (event,player){  
                 return ai.get.attitude(player,event.target)<1;
            },
                content:function (){
                player.say('圣人？也不过如此罢了！');
                trigger.player.die()._triggered=null;
    },
                ai:{
                    threaten:1.6,
                },
            },
            "Nirvana_破邪":{
				trigger:{player:'shaBegin'},
				forced:true,
				content:function(){
				//trigger.directHit=true;
					trigger.target.addTempSkill('Nirvana_破邪2','shaAfter');
					trigger.target.addTempSkill('Nirvana_破邪3','phaseBegin');
				},
				ai:{
					unequip:true,
					skillTagFilter:function(player,tag,arg){
						if(arg&&arg.name=='sha') return true;
						return false;
					}
				}
			},
	       		"Nirvana_破邪2":{
				mod:{
					cardEnabled:function(){
						return false;
					},
					cardUsable:function(){
						return false;
					},
					cardRespondable:function(){
						return false;
					},
					cardSavable:function(){
						return false;
					}
				}
			},
			          "Nirvana_破邪3":{
                trigger:{
                    player:"recoverBefore",
                },
                forced:true,
                content:function (){
     player.untrigger();
     player.finish();
},
            },
            "Nirvana_流星落":{
    trigger:{
        player:"useCardToBefore",
    },
    priority:7,
    filter:function (event,player){
        if(event.card.name=='sha'&&!event.card.nature) return true;
    },
    forced:true,
    content:function (){
        trigger.card.nature='fire';
        player.addTempSkill('Nirvana_流星落2','damageAfter');
        },
      group:"Nirvana_流星落3",
},
            "Nirvana_流星落2":{
    trigger:{
        source:"damageBefore",
    },
    forced:true,
    content:function (){
      if(Math.random()<=0.02){
    var zf=[2,3].randomGet();
    trigger.num+=(zf); 
    game.log(player,'幸运爆发召唤陨石，本次伤害额外附加'+zf+'点');
    }
    else{
    event.finish();
    }
      },
     },
     "Nirvana_流星落3":{
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					return player.canUse('sha',target);
				},
				filter:function(event,player){
					return player.countCards('h','sha')>0&&lib.filter.cardUsable({name:'sha'},player);
				},
				content:function(){
					'step 0'
					player.addSkill('Nirvana_流星落4');
					player.storage.流星落2=false;
					event.num=0;
					'step 1'
					var card=player.getCards('h','sha')[0];
					if(card){
						player.useCard(card,target);
					}
					else{
						if(player.storage.流星落2){
							player.draw();
						}
						player.removeSkill('Nirvana_流星落4');
						event.finish();
					}
					'step 2'
					if(event.num++<2&&target.isAlive()){
						event.goto(1);
					}
					else{
						if(player.storage.流星落2){
							player.draw();
						}
						player.removeSkill('Nirvana_流星落4');
					}
				},
				ai:{
					order:function(){
						return get.order({name:'sha'})+0.11;
					},
					result:{
						target:function(player,target){
							return get.effect(target,{name:'sha'},player,target);
						}
					}
				}
			},
			"Nirvana_流星落4":{
				trigger:{source:'damageEnd'},
				forced:true,
				popup:false,
				onremove:true,
				filter:function(event,player){
					return event.card&&event.card.name=='sha'&&!player.storage.流星落2;
				},
				content:function(){
					player.storage.流星落2=true;
				}
			},
			"Nirvana_焚天之炎":{
    trigger:{
        player:"useCardToBefore",
    },
    priority:7,
    filter:function (event,player){
        if(event.card.name=='sha'&&!event.card.nature) return true;
    },
    content:function (){
        trigger.card.nature='fire';
        player.addTempSkill('Nirvana_焚天之炎2','damageAfter');
        },
},
        "Nirvana_焚天之炎2":{
    trigger:{
        source:"damageBefore",
    },
    forced:true,
    content:function (){
    player.say('红莲的圣火指引我的胜利！');
    trigger.num=Math.max((trigger.player.maxHp-trigger.player.hp),1);
      },
     },
     "Nirvana_必中的贯穿":{
				trigger:{
        player:"useCardToBefore",
    },
    priority:7,
    filter:function (event,player){
        if(event.card.name=='sha') return true;
    },
				forced:true,
				content:function(){
				player.say('Gungnir, execution!');
				trigger.directHit=true;				
					player.addTempSkill('Nirvana_必中的贯穿2','damageAfter');
					if (!trigger.card.nature) trigger.card.nature='thunder';
				},
			},
				"Nirvana_必中的贯穿2":{
    trigger:{
        source:"damageEnd",
    },
    filter:function(event,player){
					return event.card&&event.card.name=='sha';
				},
    forced:true,
    content:function (){
				if(trigger.player.next!=player) trigger.player.next.damage(trigger.num);	
	     			},
     },
     "Nirvana_龙血筛选":{
     trigger:{
        player:"phaseBegin",
    },
     forced:true,
				popup:false,
				unique:true,
				derivation:['Nirvana_傲慢','Nirvana_嫉妒','Nirvana_暴怒','Nirvana_懒惰','Nirvana_贪婪','Nirvana_饕餮','Nirvana_色欲'],
				content:function(){
					player.removeAdditionalSkill('Nirvana_龙血筛选');
					if(player.hp<=4){
					var list=[],b=(trigger.player.hp*3-player.countCards('h'));
				 if(b>=7){
						list.push('Nirvana_傲慢');
					}
					if(b>=6){
						list.push('Nirvana_嫉妒');
					}
					if(b>=5){
						list.push('Nirvana_暴怒');
					}
					if(b>=4){
						list.push('Nirvana_懒惰');
					}
					if(b>=3){
						list.push('Nirvana_贪婪');
					}
					if(b>=2){
						list.push('Nirvana_饕餮');
					}
					if(b>=1){
						list.push('Nirvana_色欲');
					}
					if(list.length){
						player.addAdditionalSkill('Nirvana_龙血筛选',list);
					}
					if(b<1){
					game.log(player,'被七宗罪拒绝了');
						player.loseHp(2);
					}
					}
					else{
					event.finish();
					}
				},
     },
            "Nirvana_罪与罚":{
            priority:3,
            trigger:{player:'shaBegin'},
            forced:true,
            filter:function (event,player){
        return player.hasSkill('Nirvana_傲慢')&&player.hasSkill('Nirvana_嫉妒')&&player.hasSkill('Nirvana_暴怒')&&player.hasSkill('Nirvana_懒惰')&&player.hasSkill('Nirvana_贪婪')&&player.hasSkill('Nirvana_饕餮')&&player.hasSkill('Nirvana_色欲');
    },
           content:function(){
				         trigger.directHit=true;
				         player.addTempSkill('Nirvana_罪与罚_1');
				         },            
            },
            "Nirvana_罪与罚_1":{
							trigger:{
								source:"damageBegin",
							},
							priority:-Infinity,
							forced:true,
							content:function(){
								trigger.num=trigger.num*2;
							},
							mod:{
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return Infinity;
        },
           },
						},
            "Nirvana_傲慢":{
            priority:1,
				trigger:{source:'damageBegin'},
  	forced:true,
				filter:function(event,player){
					return (event.target.countCards('h')<player.countCards('h'))&&event.card&&(event.card.name=='sha')&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
				},
				content:function(){
					trigger.num++;
				},
            },
            "Nirvana_嫉妒":{
				trigger:{source:'damageEnd'},
				direct:true,
				filter:function(event){
					if(event._notrigger.contains(event.player)) return false;
					return event.card&&event.card.name=='sha'&&event.cards&&
					get.color(event.cards)=='red'&&event.player.countCards('e');
				},
				content:function(){
					"step 0"
					player.choosePlayerCard('e',trigger.player);
					"step 1"
					if(result.bool){
						player.logSkill('Nirvana_嫉妒');
						trigger.player.discard(result.links[0]);
						event.card=result.links[0];
					}
					else{
						event.finish();
					}
					 },
      },
            "Nirvana_暴怒":{
            priority:7,
            trigger:{player:'shaBegin'},
            forced:true,
            filter:function(event,player){
					return trigger.target.hp<player.hp;
				},
				          content:function(){
				         trigger.directHit=true;
				         },
            },
            "Nirvana_懒惰":{
				trigger:{player:'phaseDiscardBefore'},
				frequent:function(event,player){
					return !player.needsToDiscard();
				},
				content:function(){
					trigger.cancel();
				}
            },
           "Nirvana_贪婪":{
            inherit:'kuanggu',
            },
            "Nirvana_饕餮":{
            trigger:{
        player:"phaseUseBegin",
    },
            forced:true,
            content:function(){
            'step 0'
            player.draw(4);
            'step 1'
            player.chooseToDiscard(3);
              },
            },
            "Nirvana_色欲":{
            inherit:'cixiong_skill',
            },
            "Nirvana_翼剑飓风":{
    enable:"phaseUse",
    usable:1,
    round:2,
    unique:true,
    check:function (event,player){
        var active=0;
        for(var i=0;i<game.players.length;i++){
            if(game.players[i]==player) continue;
            if(!game.players[i].isOut()){
                if(ai.get.attitude(player,game.players[i])>0){
                    if(get.distance(player,game.players[i],'attack')<=1){
                        active--;
                        if(game.players[i].hp>1) active+=0.5; 
                    }
                }
                else if(ai.get.attitude(player,game.players[i])<0){
                    if(get.distance(player,game.players[i],'attack')<=1){
                        active++;
                        if(game.players[i].hp<=1) active+=0.5;
                    }
                }
            }
        }
        if(active>0) return 1;
        return 0;
    },
    content:function (){
        var targets=[];
        for(var i=0;i<game.players.length;i++){
            if(game.players[i]==player) continue;
            if(!game.players[i].isOut()){
                if(get.distance(player,game.players[i],'attack')<=1){
                    targets.push(game.players[i]);
                }
            }
        }
        for(var i=0;i<targets.length;i++){
            targets[i].damage();
        }
    },
    ai:{
        threaten:0.8,
        result:{
            target:function (card,player,target){
                if(player.hasSkill('jueqing')) return [1,-1];
                if(get.tag(card,'damage')&&ai.get.damageEffect(target,player,player)>0&&get.distance(target,player,'attack')<=1) return [1,0,0,-1.5];
            },
        },
    },
},
            "Nirvana_霸王烈风剑":{
    enable:"phaseUse",
    usable:1,
    filter:function (event,player){
        return player.hujia?true:false;
    },
    filterTarget:function (card,player,target){
        return player!=target&&get.distance(player,target,'attack')<=1;
    },
    selectTarget:function (){
        return [1,3];
    },
    contentBefore:function (){
        player.changeHujia(-player.hujia);
    },
    content:function (){
        target.damage();
    },
    ai:{
        order:9,
        result:{
            target:function (player,target){
                var eff=get.damageEffect(target,player,target)+0.5;
                if(eff>0&&eff<=0.5) return 0;
                return eff;
            },
        },
    },
},
            "Nirvana_弑魂":{
		           		trigger:{source:'dieAfter'},
		           		forced:true,
		           		content:function (){
		           		player.gainMaxHp(trigger.player.maxHp);
		           		player.recover(Math.floor(trigger.player.maxHp/2));
		           		player.$skill('阿鼻·弑魂!','fire','avatar');
		           		game.log(player,'刀灵阿鼻弑魂效果发动，',trigger.player,'被移出游戏了');
             game.removePlayer(trigger.player);
    },
            },
            "Nirvana_时空撕裂":{
            trigger:{player:'shaBegin'},
            direct:true,
            content:function(){
            if(Math.random()<=0.07){
            game.log('切裂世界剑:ikms,lets进入新世界');
            for(var i=0;i<game.players.length;i++){
            if(ai.get.attitude(player,game.players[i])<0){
              if (game.players[i]!=player){
            game.players[i].out();
            }
           }
              }
             }
              else{
              trigger.directHit=true;
              player.addTempSkill('Nirvana_时空撕裂_more','damageAfter');
              }
             },
            },
            "Nirvana_时空撕裂_more":{
							trigger:{
								source:"damageBegin",
							},
							priority:-99,
							direct:true,
							content:function(){
								trigger.num=trigger.num*2;
		 					},
							},
            "Nirvana_世界切裂":{
					          trigger:{source:'dieAfter'},
					          direct:true,
					          content:function(){
					          var card=player.getEquip('Nirvana_切裂世界之剑_initial');
					          if(card){
						if(typeof card.storage.world!='number'){
							card.storage.world=1;
						}
						else{
							card.storage.world++;
						}			          
					          if(card.storage.world>=3){
					          player.say('一直以来承蒙关照了,撒,让我们一起掀开毁灭的序幕呢');
							card.init([card.suit,card.number,'Nirvana_切裂世界之剑_wedding',card.nature]);
			           	  		}
			           	 	}
			           		},
						         },
						         "Nirvana_世界切裂_破":{
				trigger:{player:'shaBegin'},
				forced:true,
				content:function(){
				trigger.directHit=true;
				},
				ai:{
					unequip:true,
					skillTagFilter:function(player,tag,arg){
						if(arg&&arg.name=='sha') return true;
						return false;
					}
				}
			},
						         "Nirvana_世界切裂_断":{
						         trigger:{source:'dieAfter'},
						         content:function (){
                        game.countPlayer(function(current){
            if(current!=player){                
                var next=game.createEvent('die');
                 next.player=current;
                 next.source=player;
                 next.setContent('die')
            }
        });                           
                        },
						         },
						         "Nirvana_星月幻化":{
						         trigger:{player:'phaseBegin'},
          				forced:true,
	          			content:function(){
	          			var xy=[1,2,3,4].randomGet();
	          			if (xy==1) {player.draw();}
	          			if (xy==2) {player.recover();}
	          			if (xy==3) {player.changeHujia();}
	          			if (xy==4) {player.addTempSkill('shibei',{player:'phaseBegin'});}
	            			},
						         },
            "Nirvana_support":{
						trigger:{
							global:"gameStart",
						},
						forced:true,
						content:function(){
							game.broadcastAll(function(player){
								var div=ui.create.div('');
								div.style.height='20px';
								div.style.width='144px';
								div.style.left='15px';
								div.style.bottom='22px';
								player.appendChild(div);
								player.node.Nirvana_condition=div;
							},player);
						},
					},
            "Nirvana_黑魔导爆裂破":{
                nobracket:true,				
            },
            "Nirvana_ExcaliburMorgan":{
            nobracket:true,
            },
            "Nirvana_大悲撕风手":{
            nobracket:true,
            },
            "Nirvana_风刹湮罡":{
            nobracket:true,
            },
            "Nirvana_大地轰雷锤":{
            nobracket:true,
            },
            "Nirvana_疾风轰雷闪":{
            nobracket:true,
            },
            "Nirvana_横扫千军":{
            nobracket:true,
            },
            "Nirvana_暴雨疾风枪":{
            nobracket:true,
            },
            "Nirvana_圣技大十字":{
            nobracket:true,
            },
            "Nirvana_???":{
            },
            "Nirvana_¿¿¿":{
            },
            "Nirvana_纵使三度迎来落日_ex":{
            nobracket:true,
            trigger: {
					        			player: "dieBegin",
	          						},
	          						unique:true,
                  mark:true,
                  init:function (player){
                     player.storage.纵使三度迎来落日_ex=false;  
                  },   
                  filter:function(event,player){ 
                     if(player.storage.纵使三度迎来落日_ex) return false;  
                     return true;
                  },
                  direct:true,
    content:function (){
        trigger.cancel();
        player.awakenSkill('Nirvana_纵使三度迎来落日_ex');
        player.storage.纵使三度迎来落日_ex=true;
					       			player.maxHp=Infinity;
						       		player.hp=Infinity;
							       	player.node.hp.delete();
							       	player.addSkill('Nirvana_纵使三度迎来落日');
					       			},
					       			intro:{
        content:"limited",
    },
            },
            "Nirvana_纵使三度迎来落日":{
            nobracket:true,
            unique:true,
						group:["Nirvana_纵使三度迎来落日_1","Nirvana_纵使三度迎来落日_2"],
						subSkill:{
						  "1":{
								trigger:{
									player:"Nirvana_纵使三度迎来落日_exAfter",
								},
								direct:true,
								content:function(){
									player.storage.sunset=3;
									player.$skill('纵使三度迎来落日','fire','avatar');
									var interval=setInterval(function(){
										player.node.Nirvana_condition.innerHTML='<br><span style="font-weight:600;font-size:12px">还能看到'+player.storage.sunset+'次日落</span>';
										if(player.storage.sunset==0){
											player.die();
											clearInterval(interval);
										};
									},1000);
									},
									},
									"2":{
									trigger:{
									player:"phaseAfter",
								},
								direct:true,
								content:function(){
								player.storage.sunset-=1;
								player.update();
									},
								},
								 },
								  },
							"Nirvana_童女讴歌的荣华帝政":{
							nobracket:true,
							enable:"phaseUse",
    usable:1,
    unique:true,
    direct:true,
    content:function(){		
							/* Presentation uses the installed UI. */
						},
							},
            
           
        },
        translate:{
            "Nirvana_CD":"CD",
            "Nirvana_流星落3":"星屑斩",
            "Nirvana_焚天之炎":"焚天之炎",
            "Nirvana_时空撕裂_more":"残虐撕裂",
            "Nirvana_世界切裂_断":"世界切裂",
            "Nirvana_世界切裂_破":"世界切裂",
            "Nirvana_弑圣":"弑圣",
            "Nirvana_傲慢":"傲慢",
            "Nirvana_傲慢_info":"当你对一名角色使用【杀】时，若你的手牌数比该角色的手牌多，此【杀】伤害+1",
            "Nirvana_嫉妒":"嫉妒",
            "Nirvana_嫉妒_info":"当你对一名角色使用红色的【杀】造成伤害后，若该角色的装备区有牌，你可以选择弃置其中一张装备",
            "Nirvana_暴怒":"暴怒",
            "Nirvana_暴怒_info":"当你对一名角色使用【杀】时，若你的体力比该角色的体力多，此【杀】不可闪避",
            "Nirvana_懒惰":"懒惰",
            "Nirvana_懒惰_info":"你跳过你的弃牌阶段",
            "Nirvana_贪婪":"贪婪",
            "Nirvana_饕餮":"饕餮",
            "Nirvana_饕餮_info":"出牌阶段开始时，你摸四张牌然后弃置三张牌",
            "Nirvana_色欲":"色欲",
            "Nirvana_罪与罚":"罪与罚",
            "Nirvana_翼剑飓风":"翼剑飓风",
            "Nirvana_霸王烈风剑":"霸王烈风剑",
            "Nirvana_黑魔导爆裂破":"黑魔导<br>爆裂破",
            "Nirvana_黑魔导爆裂破_info":"结束阶段，你可以摸一张牌，如果你没有手牌，改为摸2张牌",
            "Nirvana_ExcaliburMorgan":"Excalibur Morgan",
            "Nirvana_ExcaliburMorgan_info":"限定技，你对全体角色造成当前轮数的伤害",
            "Nirvana_大悲撕风手":"大悲撕风手",
            "Nirvana_大悲撕风手_info":"当你对一名角色使用【杀】造成伤害后，你弃置其任意一张装备",
            "Nirvana_风刹湮罡":"风刹湮罡",
            "Nirvana_风刹湮罡_info":"出牌阶段，你可以令一名角色弃置X张牌(X为你与其体力值之差的绝对值)",
            "Nirvana_大地轰雷锤":"大地轰雷锤",
            "Nirvana_大地轰雷锤_info":"魔法攻击，攻击范围全屏。附带100%封技",
            "Nirvana_疾风轰雷闪":"疾风轰雷闪",
            "Nirvana_疾风轰雷闪_info":"物理攻击。攻击范围直线，附带击飞2格效果",
            "Nirvana_横扫千军":"横扫千军",
            "Nirvana_横扫千军_info":"物理攻击，攻击范围为以自己为中心的中圆。附带100%气绝以及击飞3格",
            "Nirvana_暴雨疾风枪":"暴雨疾风枪",
            "Nirvana_暴雨疾风枪_info":"物理攻击，攻击范围中圆",
            "Nirvana_圣技大十字":"圣技 大十字",
            "Nirvana_圣技大十字_info":"S技，物理攻击。攻击范围全屏。极高伤害",
            "Nirvana_???":"???",
            "Nirvana_???_info":"???",
            "Nirvana_¿¿¿":"???",
            "Nirvana_¿¿¿_info":"???",
            "Nirvana_纵使三度迎来落日_ex":"纵使三度迎来落日",
            "Nirvana_纵使三度迎来落日_ex_info":"限定技，锁定技，当你首次死亡时，你拒绝之，然后移除你的体力牌。你的死亡条件变更为三回合后的回合结束时死亡",
            "Nirvana_童女讴歌的荣华帝政":"童女讴歌的荣华帝政",
            "Nirvana_童女讴歌的荣华帝政_info":"招荡的黄金剧场开启时才能使用。你对所有其他角色造成火焰伤害，每回合限一次",
        },
    });

} };
}
