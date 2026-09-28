// Generated from 国战专属卡牌扩展2.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
			xinchixueqingfeng:{
				mode:['guozhan'],
				type:'equip',
				fullskin:true,
				subtype:'equip1',
				distance:{attackFrom:-1},
				skills:['xinchixueqingfeng'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:6.5
				}
			},
			nanmanzhanxiang:{
				mode:['guozhan'],
				fullskin:true,
				type:'equip',
　　　　　　　　subtype:'equip4',
　　　　　　　　distance:{globalFrom:-1},
				ai:{
					basic:{
						equipValue:4.5
					}
				},
				skills:['nanmanzhanxiang_skill']
　　	    },
	        su:{
				mode:['guozhan'],
	        	fullskin:true,
	        	type:'basic',
	        	enable:true,
	        	filterTarget:function(card,player,target){
					    if(target.hp>=target.maxHp) return false;
			   		return true;
			     	},
	        	selectTarget:1,
	        	content:function(){
	        	target.recover();
	        	},
	        	ai:{
            basic:{
            order:3,
					 useful:3.5,
					 value:[8.5,6.8],
                         },
             result:{
	        	target:function (player,target){
	        	if(target.hp<5) return 5-target.hp;
	        	return 1;
	        	   	},
              },
 	        tag:{
					recover:1,
			     		}
		     		}
	     		},
			xinsadouchengbing:{
				mode:['guozhan'],
				fullskin:true,
				type:'trick',
				enable:true,
				selectTarget:-1,
				cardcolor:'red',
				toself:true,
				filterTarget:function(card,player,target){
					return target==player;
				},
				modTarget:true,
				content:function(){
					var num=Math.min(5,target.maxHp);
					if(target.group=='ye'){
						target.draw(num);
					}
					else{
						var nh=target.countCards('h');
						if(nh<num){
							target.draw(num-nh);
						}
					}
				},
				ai:{
					basic:{
						order:7.2,
						useful:4.5,
						value:9.2
					},
					result:{
						target:function(player,target){
							var num=Math.min(5,target.maxHp);
							if(target.group=='ye'){
								return Math.sqrt(num);
							}
							else{
								var nh=target.countCards('h');
								if(target==player&&player.countCards('h','xinsadouchengbing')){
									nh--;
								}
								if(nh<num){
									return Math.sqrt(num-nh);
								}
							}
							return 0;
						},
					},
					tag:{
						draw:2
					}
				}
			},
			yihuajiemu:{
				mode:['guozhan'],
				type:'trick',
				fullskin:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target!=player&&target.countCards('he');
				},
				content:function(){
					'step 0'
					if(target.hasSha()){
						target.chooseToUse({name:'sha'},'使用一张杀，或交给'+get.translation(player)+'两张牌');
					}
					else{
						event.directfalse=true;
					}
					'step 1'
					var nh=target.countCards('he');
					if((event.directfalse||!result.bool)&&nh){
						if(nh<=2){
							event.directcards=true;
						}
						else{
							target.chooseCard('he',2,true,'将两张牌交给'+get.translation(player));
						}
					}
					else{
						event.finish();
					}
					'step 2'
					if(event.directcards){
						target.give(target.getCards('he'),player);
					}
					else if(result.bool&&result.cards&&result.cards.length){
						target.give(result.cards,player);
					}
				},
				ai:{
					order:7,
					result:{
						target:function(player,target){
							if(target.hasSha()&&_status.event.getRand()<0.5) return 1;
							return -2;
						}
					}
				}
			},
			guilongzhanyuedao:{
				mode:['guozhan'],
				type:'equip',
				fullskin:true,
				subtype:'equip1',
				distance:{attackFrom:-2},
				skills:['guilongzhanyuedao'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:4.5
				}
			},
			guofengyupao:{
				mode:['guozhan'],
				type:'equip',
				fullskin:true,
				subtype:'equip2',
				nomod:true,
				nopower:true,
				unique:true,
				skills:['guofengyupao'],
				ai:{
					equipValue:9
				}
			},
			chiyanzhenhunqin:{
				mode:['guozhan'],
				type:'equip',
				fullskin:true,
				subtype:'equip1',
				distance:{attackFrom:-3},
				skills:['chiyanzhenhunqin'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:4
				}
			},
			xuwangzhimian:{
				mode:['guozhan'],
				type:'equip',
				fullskin:true,
				subtype:'equip5',
				skills:['xuwangzhimian'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:6
				}
			},
			longfenghemingjian:{
				mode:['guozhan'],
				type:'equip',
				fullskin:true,
				subtype:'equip1',
				distance:{attackFrom:-2},
				skills:['longfenghemingjian'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:5
				}
			},
			"wushuangfangtianji":{
				mode:['guozhan'],
				type:"equip",
				subtype:"equip1",
				distance:{
					attackFrom:-3,
				},
				ai:{
					basic:{
						equipValue:4.5,
					},
				},
				skills:["wushuangfangtianji_skill"],
				fullskin:true,
			},
			"hongmianbaihuapao":{
				mode:['guozhan'],
				type:"equip",
				subtype:"equip2",
				ai:{
					basic:{
						equipValue:7,
					},
				},
				skills:["hongmianbaihuapao_skill"],
				fullskin:true,
			},
			"linglongshimandai":{
				mode:['guozhan'],
				type:"equip",
				subtype:"equip2",
				ai:{
					basic:{
						equipValue:6.5,
					},
				},
				skills:["linglongshimandai_skill"],
				fullskin:true,
			},
			fengshizhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target.sieged();
				},
				selectTarget:-1,
				content:function(){
					target.addTempSkill('gztuwei',{player:'phaseEnd'});
					target.popup('gztuwei');
					game.log(target,'获得了技能','【突围】');
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:2,
					},
				}
			},
           zhonghuangzhenx:{
                type:"zhenfa",
                chongzhu:true,
                enable:true,
                enable:function (){
        return game.players.length>2;
    },
                filterTarget:function (card,player,target){
        return player.next==target||player.previous==target;
    },
                content:function (){
        game.swapSeat(player,target);
    },
                ai:{
                    basic:{
                        order:7,
                    },
                    result:{
                        target:function (player,target){
                if(player.next==target) return -1;
                if(player.previous==target) return 1;
            },
                    },
                },
                mode:["guozhan"],
                selectTarget:1,
            },
			pozhenjuex:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				notarget:true,
				content:function(){
					var targets=game.filterPlayer();
					var n=targets.length;
					while(n--){
						game.swapSeat(targets.randomGet(),targets.randomGet());
					}
				},
				mode:['guozhan'],
				ai:{
					order:8,
					result:{
						player:1,
					},
				}
			},
			changshezhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					if(player.inline()) return true;
					if(player.identity=='unknown'||player.identity=='ye') return false;
					return game.hasPlayer(function(current){
						return current!=player&&current.isFriendOf(player);
					});
				},
				notarget:true,
				content:function(){
					if(player.inline()){
						var targets=game.filterPlayer(function(current){
							return player.inline(current);
						});
						player.line(targets);
						game.asyncDraw(targets);
					}
					else if(player.getNext()){
						var list=game.filterPlayer(function(current){
							return current!=player&&current.isFriendOf(player);
						});
						if(list.length){
							list.sort(function(a,b){
								return get.distance(player,a,'absolute')-get.distance(player,b,'absolute');
							});
							player.line(list[0]);
							game.swapSeat(list[0],player.getNext(),true,true);
						}
					}
				},
				mode:['guozhan'],
				ai:{
					order:6.5,
					result:{
						player:1,
					},
					tag:{
						draw:1
					}
				}
			},
			tianfuzhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(){
					return game.hasPlayer(function(current){
						return current.isMajor();
					});
				},
				filterTarget:function(card,player,target){
					return target.isMajor()&&target.countCards('he')>0;
				},
				selectTarget:-1,
				content:function(){
					target.chooseToDiscard('he',true).delay=false;
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:-1,
					},
					tag:{
						discard:1
					}
				}
			},
			dizaizhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(){
					return game.hasPlayer(function(current){
						return current.isNotMajor();
					});
				},
				filterTarget:function(card,player,target){
					return target.isNotMajor();
				},
				selectTarget:-1,
				content:function(){
					target.draw(false);
					target.$draw();
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:1,
					},
					tag:{
						draw:1
					}
				}
			},
			fengyangzhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target.sieged();
				},
				selectTarget:-1,
				content:function(){
					target.addTempSkill('feiying',{player:'damageAfter'});
					target.popup('feiying');
					game.log(target,'获得了技能','【飞影】');
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:2,
					},
				}
			},
			yunchuizhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target.siege();
				},
				selectTarget:-1,
				content:function(){
					target.addTempSkill('wushuang',{source:'damageAfter'});
					target.popup('wushuang');
					game.log(target,'获得了技能','【无双】');
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:2,
					},
				}
			},
			qixingzhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					return player.siege()||player.sieged();
				},
				filterTarget:function(card,player,target){
					return target==player;
				},
				selectTarget:-1,
				content:function(){
					'step 0'
					event.targets=game.filterPlayer(function(current){
						return current.siege(player);
					});
					'step 1'
					if(event.targets.length){
						var current=event.targets.shift();
						player.line(current,'green');
						player.discardPlayerCard(current,true);
						event.redo();
					}
					'step 2'
					var card={name:'sha',isCard:true};
					var list=game.filterPlayer(function(current){
						return current.siege(player)&&player.canUse(card,current);
					});
					if(list.length){
						player.useCard(card,list,false);
					}
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:1,
					},
				}
			},
			shepanzhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					if(player.identity=='unknown'||player.identity=='ye') return false;
					if(get.population(player.identity)<=1) return false;
					return game.hasPlayer(function(current){
						return current!=player&&current.identity==player.identity&&!player.inline(current);
					});
				},
				notarget:true,
				content:function(){
					var targets=game.filterPlayer(function(current){
						return current.identity==player.identity;
					});
					targets.sortBySeat();
					for(var i=1;i<targets.length;i++){
						game.swapSeat(targets[i],targets[i-1].next,false);
					}
					game.log(get.translation(player.identity)+'势力角色摆成了蛇蟠阵')
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						player:1,
					},
				}
			},
			longfeizhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					return player.next.siege(player);
				},
				filterTarget:function(card,player,target){
					if(target.getCards('he').length==0) return false;
					return target==player.next||target==player.previous;
				},
				selectTarget:-1,
				content:function(){
					"step 0"
					player.choosePlayerCard(target,'he',true);
					"step 1"
					target.discard(result.buttons[0].link);
					"step 2"
					if(target==targets[targets.length-1]){
						player.draw();
					}
				},
				mode:['guozhan'],
				ai:{
					order:10,
					result:{
						target:-1,
						player:1
					},
				}
			},
			huyizhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					return player.siege(player.next)||player.siege(player.previous);
				},
				filterTarget:function(card,player,target){
					return player.siege(target);
				},
				selectTarget:-1,
				content:function(){
					"step 0"
					player.chooseCard('将一张非基本牌当作杀对'+get.translation(target)+'使用','he',function(card){
						return get.type(card)!='basic';
					}).ai=function(card){
						if(get.effect(target,{name:'sha'},player,player)>0){
							return 6-get.value(card);
						}
						return 0;
					};
					"step 1"
					if(result.bool){
						player.useCard({name:'sha'},result.cards,target,false);
					}
					"step 2"
					if(target==player.next) event.player2=player.next.next;
					else event.player2=player.previous.previous;
					event.player2.chooseCard('将一张非基本牌当作杀对'+get.translation(target)+'使用','he',function(card){
						return get.type(card)!='basic';
					}).ai=function(card){
						if(get.effect(target,{name:'sha'},event.player2,event.player2)>0){
							return 6-get.value(card);
						}
						return 0;
					};
					"step 3"
					if(result.bool){
						event.player2.useCard({name:'sha'},result.cards,target,false);
					}
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:-2,
					},
				}
			},
			niaoxiangzhenx:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					if(player.identity==target.identity) return false;
					if(target.identity=='unknown'||target.identity=='ye') return false;
					return target.identity==target.next.identity||target.identity==target.previous.identity
				},
				selectTarget:-1,
				content:function(){
					"step 0"
					var next=target.chooseToRespond({name:'shan'});
					next.ai=function(card){
						if(get.damageEffect(target,player,target)>=0) return 0;
						return 1;
					};
					next.autochoose=lib.filter.autoRespondShan;
					"step 1"
					if(result.bool==false){
						target.damage();
					}
				},
				ai:{
					basic:{
						order:9,
						useful:1
					},
					result:{
						target:-1.5,
					},
					tag:{
						respond:1,
						respondShan:1,
						damage:1,
					}
				},
				mode:['guozhan'],
			},
        },
        translate:{
			zhenfa:'阵法',
			changshezhenx:'长蛇阵',
			pozhenjuex:'破阵决',
			tianfuzhenx:'天覆阵',
			dizaizhenx:'地载阵',
			fengyangzhenx:'风扬阵',
			yunchuizhenx:'云垂阵',
			qixingzhenx:'七星阵',
			shepanzhenx:'蛇蟠阵',
			longfeizhenx:'龙飞阵',
			huyizhenx:'虎翼阵',
			niaoxiangzhenx:'鸟翔阵',
			zhonghuangzhenx:'中黄阵',
			fengshizhenx:'锋矢阵',
			zhonghuangzhenx_info:'你可以与相邻角色交换位置',
			fengshizhenx_info:'令所有被围攻角色获得技能【突围】，直到其回合结束',
			niaoxiangzhenx_info:'令所有非你阵营的队列的角色今次打出一张闪，或者受到一点伤害',
			qixingzhenx_info:'弃置所有围攻你的角色各一张牌，然后视为对所有你围攻的角色使用一张不计入出杀次数的杀',
			longfeizhenx_info:'弃置围攻你的角色各一张牌，然后摸一张牌',
			shepanzhenx_info:'令我方所有角色进入队列状态',
		    yunchuizhenx_info:'令所有围攻角色获得技能【无双】，直到其首次造成伤害',
			fengyangzhenx_info:'令所有被围攻角色获得技能【飞影】，直到其首次受到伤害',
			dizaizhenx_info:'所有小势力角色摸一张牌',
			changshezhenx_info:'若你处于队列中，与你同一队列的所有角色摸一张牌，否则将与你逆时针距离最近的同势力角色移至你下家',
　　　　　　huyizhenx_info:'你与另一围攻角色可以将一张非基本牌当作【杀】对被围攻角色使用（不计入使用次数）',
			pozhenjuex_info:'将所有角色的顺序随机重排',
			tianfuzhenx_info:'所有大势力角色弃置一张牌',
			xinsadouchengbing:'撒豆成兵',
			xinsadouchengbing_info:'出牌阶段对自己使用，若你为野心家，摸X张牌；否则将你手牌补至X；（X为你的体力上限且至多为5）',
			yihuajiemu:'移花接木',
			yihuajiemu_info:'出牌阶段对一名有牌的其他角色使用，令其使用一张【杀】，或交给你两张牌',
			su:'酥',
			su_info:'出牌阶段，选择一名角色回复一点体力',
			xiuluolianyuji:'修罗炼狱戟',
			xiuluolianyuji_info:'你使用【杀】可以额外指定任意名攻击范围内的其他角色为目标；锁定技，你使用【杀】造成的伤害+1，然后令受到伤害的角色回复1点体力',
			xuwangzhimian:'虚妄之冕',
			xuwangzhimian_info:'锁定技，摸牌阶段，你额外摸两张牌；你的手牌上限-1',
			guofengyupao:'国风玉袍',
			guofengyupao_info:'锁定技，你不能成为其他角色使用普通锦囊牌的目标',
			chiyanzhenhunqin:'赤焰镇魂琴',
			chiyanzhenhunqin_info:'锁定技，你造成的伤害均视为具有火属性',
			guilongzhanyuedao:'鬼龙斩月刀',
			guilongzhanyuedao_info:'锁定技，你使用的红色【杀】不能被【闪】响应',
			longfenghemingjian:'鸾凤和鸣剑',
			longfenghemingjian_info:'你使用的【雷杀】或【火杀】指定目标后，可令对方选择弃置一张牌或令你摸一张牌',
			"wushuangfangtianji":"无双方天戟",
			"wushuangfangtianji_info":"你使用【杀】对目标角色造成伤害后，可以摸一张牌或弃置目标角色一张牌。",
			"hongmianbaihuapao":"红棉百花袍",
			"hongmianbaihuapao_info":"锁定技，防止你受到的属性伤害。",
			"linglongshimandai":"玲珑狮蛮带",
			"linglongshimandai_info":"当其他角色使用牌指定你为唯一目标后，你可以进行一次判定，若判定结果为红桃，则此牌对你无效。",
　　　　　　nanmanzhanxiang:'南蛮象',
　　　　　　nanmanzhanxiang_info:'锁定技，你的进攻距离+1，【南蛮入侵】对你无效',
			xinchixueqingfeng:'赤血青锋',
			xinchixueqingfeng2:'赤血青锋',
			xinchixueqingfeng_info:'锁定技，你使用黑【杀】无视防具；你使用【杀】造成的伤害+1，然后令受到伤害的角色回复1点体力（无视白银狮子效果）',
        },
        list:[],
    });
builder.addPack({
        skill:{

			gztuwei:{
				audio:'xianzhen',
				mod:{
					cardUsable:function (card,player,num){
						if(player.sieged()&&typeof num=='number') return num+100;
					},
					playerEnabled:function (card,player,target){
						if(player.sieged()&&!target.siege(player)){
							var num=player.getCardUsable(card)-100;
							if(num<=0) return false;
						}
					},
				},
			},
			nanmanzhanxiang_skill:{
				trigger:{target:'useCardToBefore'},
				audio:'huoshou',
				forced:true,
				filter:function(event,player){
					return event.card.name=='nanman';
				},
				content:function(){
					trigger.cancel();
				},
			},
                xinchixueqingfeng:{
				        forced:true,
                        trigger:{
                            player:"shaBefore",
                        },
                        forced:true,
                        popup:false,
                        filter:function(event,player){ 
                return event.card&&get.color(event.card)=='black'; 
            },
                        content:function(){ 
                player.addTempSkill('unequip','shaAfter'); 
            },
				     group:'xinchixueqingfeng2',
                    },
			xinchixueqingfeng2:{
				trigger:{source:'damageBegin1'},
				forced:true,
				filter:function(event){
					return event.card&&event.card.name=='sha';
				},
				content:function(){
					trigger.num++;
					trigger.player.addSkill('xinchixueqingfeng3');
				}
			},
			xinchixueqingfeng3:{
				equipSkill:true,
				vanish:true,
				trigger:{player:'damageEnd'},
				forced:true,
				popup:false,
				content:function(){
					player.recover();
					player.removeSkill('xinchixueqingfeng3');
				}
			},
			xuwangzhimian:{
				equipSkill:true,
				trigger:{player:'phaseDrawBegin'},
				forced:true,
				content:function(){
					trigger.num+=2;
				},
				mod:{
					maxHandcard:function(player,num){
						return num-1;
					}
				}
			},
			chiyanzhenhunqin:{
				equipSkill:true,
				trigger:{source:'damageBegin1'},
				forced:true,
				content:function(){
					trigger.nature='fire';
				}
			},
			guilongzhanyuedao:{
				equipSkill:true,
				trigger:{player:'useCard'},
				forced:true,
				filter:function(event,player){
					return event.card&&event.card.name=='sha'&&get.color(event.card)=='red';
				},
				content:function(){
					trigger.directHit.addArray(game.players);
				}
			},
			guofengyupao:{
				equipSkill:true,
				mod:{
					targetEnabled:function(card,player,target,now){
					if(target.hasSkillTag('unequip2')) return false;
						if(player!=target){
							if(player.hasSkillTag('unequip',false,{
								name:card?card.name:null,
								target:player,
								card:card
							})){}
							else if(get.type(card)=='trick') return false;
						}
					}
				}
			},
			longfenghemingjian:{
				equipSkill:true,
				inherit:'cixiong_skill',
				filter:function(event,player){
					return lib.linked.contains(event.card.nature);
				},
			},
			"linglongshimandai_skill":{
				equipSkill:true,
				trigger:{
					target:"useCardToTargeted",
				},
				filter:function(event,player){
					if(event.targets&&event.targets.length>1||event.player==player) return false;
					if(player.hasSkillTag('unequip2')) return false;
					var evt=event.getParent();
					if(evt.player&&evt.player.hasSkillTag('unequip',false,{
						name:evt.card?evt.card.name:null,
						target:player,
						card:evt.card
					})) return false;
					return true;
				},
				audio:true,
				check:function(event,player){
					return get.effect(player,event.card,event.player,player)<=0;
				},
				content:function(){
					"step 0"
					player.judge('linglongshimandai',function(card){return (get.suit(card)=='heart')?1.5:-0.5});
					"step 1"
					if(result.judge>0){
						trigger.getParent().excluded.add(player);
					}
				},
				ai:{
					effect:{
						target:function(card,player,target,effect){
							if(player.hasSkillTag('unequip',false,{
								name:card?card.name:null,
								target:player,
								card:card
							})) return;
						},
					},
				},
			},
			"hongmianbaihuapao_skill":{
				equipSkill:true,
				trigger:{
					player:"damageBegin4",
				},
				filter:function(event,player){
					if(event.source&&event.source.hasSkillTag('unequip',false,{
						name:event.card?event.card.name:null,
						target:player,
						card:event.card
					})) return;
					if(event.nature) return true;
				},
				forced:true,
				content:function(){
					trigger.cancel();
				},
				ai:{
					nofire:true,
					nothunder:true,
					effect:{
						target:function(card,player,target,current){
							if(player.hasSkillTag('unequip',false,{
								name:card?card.name:null,
								target:player,
								card:card
							})) return;
							if(get.tag(card,'natureDamage')) return 'zerotarget';
						},
					},
				},
			},
			"wushuangfangtianji_skill":{
				equipSkill:true,
				trigger:{
					source:"damageSource",
				},
				filter:function(event,player){
					return event.card&&event.card.name=='sha';
				},
				content:function(){
					'step 0'
					player.line(trigger.player,'white');
					if(!trigger.player.countCards('he')){
						event.goto(1);
					}else{
						event.goto(2);
					}
					'step 1'
					player.draw();
					event.finish();
					'step 2'
					player.chooseControl('摸一张牌','弃置其一张牌',function(event,player){ 
						if(get.attitude(player,trigger.player)>2) return '摸一张牌';
						return '弃置其一张牌'; 
					}); 
					'step 3'
					if(result.control=='摸一张牌'){ 
						player.draw();
						event.finish();
					} 
					else{ 
						player.discardPlayerCard(trigger.player,'he',true); 
						event.finish();
					}   
				},
			},

        },
        translate:{
			xiuluolianyuji:'修罗炼狱戟',
			xiuluolianyuji_info:'你使用【杀】可以额外指定任意名攻击范围内的其他角色为目标；锁定技，你使用【杀】造成的伤害+1，然后令受到伤害的角色回复1点体力',
			xuwangzhimian:'虚妄之冕',
			xuwangzhimian_info:'锁定技，摸牌阶段，你额外摸两张牌；你的手牌上限-1',
			guofengyupao:'国风玉袍',
			guofengyupao_info:'锁定技，你不能成为其他角色使用普通锦囊牌的目标',
			chiyanzhenhunqin:'赤焰镇魂琴',
			chiyanzhenhunqin_info:'锁定技，你造成的伤害均视为具有火属性',
			guilongzhanyuedao:'鬼龙斩月刀',
			guilongzhanyuedao_info:'锁定技，你使用的红色【杀】不能被【闪】响应',
			longfenghemingjian:'鸾凤和鸣剑',
			longfenghemingjian_info:'你使用的【雷杀】或【火杀】指定目标后，可令对方选择弃置一张牌或令你摸一张牌',
			"linglongshimandai_skill":"玲珑狮蛮带",
			"linglongshimandai_skill_info":"当其他角色使用牌指定你为唯一目标后，你可以进行一次判定，若判定结果为红桃，则此牌对你无效。",
			"hongmianbaihuapao_skill":"红棉百花袍",
			"hongmianbaihuapao_skill_info":"锁定技，防止你受到的属性伤害。",
			"wushuangfangtianji_skill":"无双方天戟",
			"wushuangfangtianji_skill_info":"你使用【杀】对目标角色造成伤害后，可以摸一张牌或弃置目标角色一张牌。",
　　　　　　gznanmanzhanxiang_skill:'南蛮象',
			gznanmanzhanxiang_skill_info:'锁定技，你的进攻距离+1，【南蛮入侵】对你无效。',
　　　　　　nanmanzhanxiang_skill:'南蛮象',
			nanmanzhanxiang_skill_info:'锁定技，你的进攻距离+1，【南蛮入侵】对你无效',
			xinchixueqingfeng:'赤血青锋',
			xinchixueqingfeng2:'赤血青锋',
			xinchixueqingfeng_info:'你使用黑【杀】无视防具；锁定技，你使用【杀】造成的伤害+1，然后令受到伤害的角色回复1点体力',
			"gztuwei":"突围",
			"gztuwei_info":"阵法技，若你处于一个围攻关系中且你是被围攻角色，则你对围攻角色使用牌没有次数限制。",
        },
    });
if(builder.list) builder.list.push(
			['spade',5,'sha'],
			['spade',6,'sha','thunder'],
			['spade',7,'sha'],
			['spade',7,'sha','thunder',['lianheng']],
			['spade',8,'sha'],
			['spade',8,'sha'],
			['spade',9,'sha'],
			['spade',10,'sha'],
			['spade',11,'sha'],
			['club',2,'sha'],
			['club',3,'sha'],
			['club',4,'sha'],
			['club',5,'sha'],
			['club',6,'sha','thunder'],
			['club',7,'sha','thunder',['lianheng']],
			['club',8,'sha'],
			['club',8,'sha','thunder',['lianheng']],
			['club',9,'sha'],
			['club',10,'sha'],
			['club',11,'sha'],
			['club',11,'sha'],
			['diamond',2,'shan'],
			['diamond',3,'shan'],
			['diamond',4,'sha','fire'],
			['diamond',5,'sha','fire'],
			['diamond',6,'shan'],
			['diamond',7,'shan'],
			['diamond',7,'shan'],
			['diamond',8,'shan'],
			['diamond',8,'shan'],
			['diamond',9,'shan'],
			['diamond',10,'shan'],
			['diamond',10,'sha'],
			['diamond',11,'shan'],
			['diamond',11,'sha'],
			['diamond',12,'sha'],
			['diamond',13,'shan'],

			['heart',2,'shan'],
			['heart',4,'sha','fire'],
			['heart',10,'sha'],
			['heart',11,'shan'],
			['heart',12,'sha'],
			['heart',13,'shan'],
			['spade',4,'sha'],
			['spade',7,'sha'],
			['spade',8,'sha'],
			['spade',9,'sha','thunder'],
			['spade',10,'sha','thunder'],
			['spade',11,'sha','thunder',['lianheng']],
			['spade',13,'wuxie'],
			['heart',4,'shan'],
			['heart',5,'shan'],
			['heart',6,'shan'],
			['heart',7,'shan'],
			['heart',10,'sha'],
			['heart',11,'sha'],
			['club',4,'sha'],
			['club',5,'sha','thunder',['lianheng']],
			['club',6,'sha'],
			['club',7,'sha'],
			['club',8,'sha'],
			['diamond',6,'shan'],
			['diamond',7,'shan'],
			['diamond',8,'sha','fire'],
			['diamond',9,'sha','fire'],
			['diamond',11,'wuxie',null,['guo']],
			['diamond',13,'shan'],

			["diamond",1,'chiyanzhenhunqin'],
			["club",1,'xinsadouchengbing',['lianheng']],
			 ["spade",1,'changshezhenx'],
			 ["heart",1,'changshezhenx'],

			["diamond",2,'tianfuzhenx'],
			["club",2,'tianfuzhenx'],
			["spade",2,'longfenghemingjian'],
			["heart",2,'su'],

             			
             ["diamond",3,'guofengyupao'],
			//["club",3,'dizaizhenx'],
			["spade",3,'dizaizhenx'],
			["heart",3,'dizaizhenx'],

			 ["diamond",4,'fengyangzhenx'],
			 ["club",4,'fengyangzhenx'],
			 ["spade",4,'su'],
			 ["heart",4,'xuwangzhimian'],

			["diamond",5,'su'],
			["club",5,'zhonghuangzhenx'],
			["spade",5,'guilongzhanyuedao'],
			["heart",5,'zhonghuangzhenx'],


			["diamond",6,'huyizhenx'],
			["club",6,'su'],
			["heart",6,'hongmianbaihuapao'],
			["spade",6,'huyizhenx'],

			["diamond",7,'fengshizhenx'],
			["club",7,'fengshizhenx'],
			["spade",7,'linglongshimandai'],
			["heart",7,'xinsadouchengbing',['lianheng']],

			 ["diamond",8,'su'],
			 ["club",8,'yihuajiemu'],
			 ["spade",8,'shepanzhenx'],
			 ["heart",8,'shepanzhenx'],

			 ["diamond",9,'longfeizhenx'],
			 ["club",9,'longfeizhenx'],
			 ["spade",9,'xinsadouchengbing',['lianheng']],
			 ["heart",9,'yihuajiemu'],

			 ["club",10,'qixingzhenx'],
			 ["spade",10,'nanmanzhanxiang'],
			 ["diamond",10,'su'],

			["diamond",11,'xinchixueqingfeng'],
			["club",11,'su'],
			["spade",11,'niaoxiangzhenx'],
			["heart",11,'niaoxiangzhenx'],

			 ["diamond",12,'yunchuizhenx'],
			 ["club",12,'yunchuizhenx'],
			 //["spade",12,'yunchuizhenx'],
			 ["heart",12,'su'],

			 ["diamond",13,'wushuangfangtianji'],
			 ["club",13,'yihuajiemu'],
			 ["spade",13,'qixingzhenx'],
			 ["heart",13,'pozhenjuex']);
builder.list.splice(0, builder.list.length, ...builder.list.filter(row => Object.hasOwn(builder.card, row[2])));
} };
}
