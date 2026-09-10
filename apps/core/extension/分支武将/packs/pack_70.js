// Extracted from mode/versus.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"skill": {
			versus_viewHandcard:{
				ai:{
					viewHandcard:true,
					skillTagFilter:function(player,tag,target){
						return player.side==target.side;
					},
				},
			},
			huoshaowuchao:{
				trigger:{global:'damageBefore'},
				silent:true,
				firstDo:true,
				filter:function(event,player){
					return !lib.linked.contains(event.nature);
				},
				content:function(){
					trigger.nature='fire';
				},
			},
			liangcaokuifa:{
				trigger:{player:['useCardAfter','phaseDrawBegin']},
				silent:true,
				filter:function(event,player){
					if(event.name=='phaseDraw') return true;
					return player.getHistory('sourceDamage',function(evt){
						return evt.card==event.card;
					}).length>0;
				},
				content:function(){
					if(trigger.name=='phaseDraw') trigger.num--;
					else player.draw();
				},
			},
			zhanyanliangzhuwenchou:{
				trigger:{player:'phaseBegin'},
				silent:true,
				content:function(){
					'step 0'
					player.chooseUseTarget({
						name:'juedou',
						isCard:true,
						storage:{nowuxie:true}
					},
					'选择一名角色，视为对其使用【决斗】','或点【取消】失去1点体力');
					'step 1'
					if(!result.bool) player.loseHp();
				},
			},
			shishengshibai:{
				mod:{
					aiOrder:function(player,card,num){
						if(_status.shishengshibai&&_status.shishengshibai%10==9){
							if(['sha','tao','guohe','shunshou','tunliang','wuzhong','juedou','yuanjun'].contains(card.name)) return num+15;
						}
					},
				},
				trigger:{
					player:'useCard1',
				},
				silent:true,
				content:function(){
					if(event.triggername=='useCard1'){
						if(!_status.shishengshibai) _status.shishengshibai=0;
						_status.shishengshibai++;
						game.broadcastAll(function(num){
							if(ui.guanduInfo) ui.guanduInfo.innerHTML='当前事件：十胜十败（'+num+'）';
						},_status.shishengshibai);
						if(_status.shishengshibai%10==0&&trigger.targets&&trigger.targets.length>0&&!['delay','equip'].contains(get.type(trigger.card))){
							trigger.effectCount++;
						}
					}
				},
				ai:{
					result:{
						player:function(card,player,target){
							if(_status.shishengshibai&&_status.shishengshibai%10==9&&card.name=='tiesuo') return 'zerotarget';
						},
					},
				},
			},
			wenji:{
				trigger:{global:'phaseUseBegin'},
				filter:function(event,player){
					return event.player.side==player.side&&event.player!=player&&event.player.countCards('h');
				},
				logTarget:'player',
				check:function(event,player){
					return event.player.needsToDiscard(1)||event.player.countCards('h')>player.countCards('h')+1||player.hp==1;
				},
				content:function(){
					'step 0'
					trigger.player.chooseCard('将一张手牌交给'+get.translation(player),true).ai=function(card){
						if(get.type(card)=='trick') return 8-get.value(card);
						return 6-get.value(card);
					}
					'step 1'
					if(result.bool&&result.cards.length){
						player.gain(result.cards,trigger.player,'give');
						if(get.type(result.cards[0])=='trick'){
							player.addTempSkill('wenji2',{player:'phaseBegin'});
						}
					}
				}
			},
			wenji2:{
				mark:true,
				intro:{
					content:'非队友角色计算与你的距离+1'
				},
				mod:{
					globalTo:function(from,to,distance){
						if(from.side!=to.side){
							return distance+1;
						}
					}
				}
			},
			tunjiang:{
				trigger:{player:'phaseEnd'},
				direct:true,
				filter:function(event,player){
					return !player.getStat('damage')&&player.countUsed()>=2;
				},
				content:function(){
					'step 0'
					var target=null;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==player.side&&game.players[i]!=player){
							target=game.players[i];break;
						}
					}
					if(target){
						event.target=target;
						player.chooseControl('cancel2',function(){
							if(target.countCards('h')>=player.countCards('h')){
								return 1;
							}
							return 0;
						}).set('prompt',get.prompt('xingzhao')).set('choiceList',[
							'摸两张牌','令'+get.translation(target)+'摸两张牌'
						]);
					}
					else{
						player.chooseBool(get.prompt('xingzhao'));
					}
					'step 1'
					if(event.target){
						if(result.index==0){
							player.logSkill('xingzhao');
							player.draw(2);
						}
						else if(result.index==1){
							player.logSkill('xingzhao',event.target);
							event.target.draw(2);
						}
					}
					else{
						if(result.bool){
							player.logSkill('xingzhao');
							player.draw(2);
						}
					}
				}
			},
			xingzhao:{
				inherit:'xunxun',
				mark:true,
				intro:{
					content:function(storage,player){
						var num=0;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==player.side){
								num+=game.players[i].storage.longchuanzhibao;
							}
						}
						var str='无技能';
						if(num>=1){
							str='具有技能“恂恂”';
						}
						if(num>=2){
							str+='；当你或队友使用装备牌时，其摸一张牌';
						}
						if(num>=3){
							str+='；你和队友跳过判定阶段';
						}
						return str;
					}
				},
				filter:function(event,player){
					var num=0;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==player.side){
							if(game.players[i].storage.longchuanzhibao) return true;
						}
					}
					return false;
				},
				global:['xingzhao2','xingzhao3']
			},
			xingzhao2:{
				trigger:{player:'useCard'},
				forced:true,
				filter:function(event,player){
					if(get.type(event.card)!='equip') return false;
					var num=0,bool=false;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==player.side){
							num+=game.players[i].storage.longchuanzhibao;
							if(game.players[i].hasSkill('xingzhao')){
								bool=true;
							}
						}
					}
					return bool&&num>=2;
				},
				content:function(){
					player.draw();
				}
			},
			xingzhao3:{
				trigger:{player:'phaseJudgeBefore'},
				forced:true,
				filter:function(event,player){
					var num=0,bool=false;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side==player.side){
							num+=game.players[i].storage.longchuanzhibao;
							if(game.players[i].hasSkill('xingzhao')){
								bool=true;
							}
						}
					}
					return bool&&num>=3;
				},
				content:function(){
					trigger.cancel();
					game.log(player,'跳过了判定阶段');
				}
			},
			xionghuangjiu:{
				trigger:{source:'damageBegin1'},
				filter:function(event,player){
					return event.card&&event.card==player.storage.xionghuangjiu&&event.notLink();
				},
				forced:true,
				content:function(){
					trigger.num++;
				},
				temp:true,
				vanish:true,
				onremove:function(player){
					game.addVideo('jiuNode',player,false);
					if(player.node.jiu){
						player.node.jiu.delete();
						player.node.jiu2.delete();
						delete player.node.jiu;
						delete player.node.jiu2;
					}
					delete player.storage.xionghuangjiu;
				},
				group:['xionghuangjiu2','xionghuangjiu3']
			},
			xionghuangjiu2:{
				trigger:{player:'useCardAfter',global:'phaseAfter'},
				priority:2,
				filter:function(event,player){
					if(event.name=='useCard') return (event.card&&event.card==player.storage.xionghuangjiu);
					return true;
				},
				forced:true,
				popup:false,
				audio:false,
				content:function(){
					game.broadcastAll(function(player){
						player.removeSkill('xionghuangjiu');
					},player);
				},
			},
			xionghuangjiu3:{
				trigger:{player:'useCard'},
				silent:true,
				filter:function(event,player){
					return !player.storage.xionghuangjiu;
				},
				content:function(){
					player.storage.xionghuangjiu=trigger.card;
				}
			},
			longchuanzhibao:{
				mark:'auto',
				nopop:true,
				init:function(player){
					player.storage.longchuanzhibao=0;
				},
				intro:{
					content:function(storage,player){
						var str='已有'+storage+'个龙船至宝，'+get.translation(player.side)+'势力共有';
						var num=storage;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].side==player.side&&game.players[i]!=player){
								num+=game.players[i].storage.longchuanzhibao;break;
							}
						}
						str+=num+'个龙船至宝。新一轮开始时，拥有至少4个龙船至宝的势力获胜';
						return str;
					}
				},
				trigger:{source:'damageEnd'},
				silent:true,
				filter:function(event,player){
					return event.player.storage.longchuanzhibao>0;
				},
				content:function(){
					player.gainZhibao(1,trigger.player);
					game.delay();
				},
				group:'longchuanzhibao_over',
				subSkill:{
					over:{
						trigger:{player:'roundStart'},
						silent:true,
						filter:function(){
							var map={wei:0,shu:0,wu:0,qun:0};
							for(var i=0;i<game.players.length;i++){
								var current=game.players[i];
								map[current.side]+=current.storage.longchuanzhibao;
								if(map[current.side]>=4){
									_status.winside=current.side;
									return true;
								}
							}
						},
						content:function(){
							for(var i=0;i<game.players.length;i++){
								game.players[i].classList.remove('current_action');
							}
							var me=game.me._trueMe||game.me;
							game.over(_status.winside==me.side);
						}
					}
				}
			},
			//剑阁技能
			boss_xiaorui:{
				trigger:{global:'damageSource'},
				forced:true,
				logTarget:'source',
				filter:function(event,player){
					var target=event.source;
					return target&&target==_status.currentPhase&&target.isAlive()&&target.isFriendOf(player)&&event.card&&event.card.name=='sha'&&event.getParent().type=='card';
				},
				content:function(){
					var source=trigger.source;
					source.addTempSkill('boss_xiaorui2');
					source.addMark('boss_xiaorui2',1,false);
				}
			},
			boss_xiaorui2:{
				onremove:true,
				charlotte:true,
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha') return num+player.countMark('boss_xiaorui2');
					},
				},
			},
			boss_huchen:{
				trigger:{
					player:'phaseDrawBegin2',
					source:'dieAfter',
				},
				forced:true,
				filter:function(event,player){
					if(event.name=='die') return event.player.isEnemyOf(player);
					return !event.numFixed&&player.countMark('boss_huchen')>0;
				},
				content:function(){
					if(trigger.name=='die') player.addMark('boss_huchen',1);
					else trigger.num+=player.countMark('boss_huchen');
				},
				intro:{
					content:'已斩杀过$名敌将',
				},
			},
			boss_fengjian:{
				trigger:{source:'damageSource'},
				forced:true,
				filter:function(event,player){
					return event.player.isAlive();
				},
				logTarget:'player',
				content:function(){
					trigger.player.addTempSkill('boss_fengjian2',{player:'phaseAfter'});
					trigger.player.markAuto('boss_fengjian2',[player]);
				},
			},
			boss_fengjian2:{
				onremove:true,
				intro:{
					content:'不能对$使用牌',
				},
				mod:{
					playerEnabled:function(card,player,target){
						if(player.getStorage('boss_fengjian2').contains(target)) return false;
					},
				},
			},
			boss_keding:{
				trigger:{player:'useCard2'},
				direct:true,
				filter:function(event,player){
					if(!event.targets||event.targets.length!=1) return false;
					var card=event.card;
					if(card.name!='sha'&&get.type(card)!='trick')return false;
					var info=get.info(card);
					if(info.allowMultiple==false) return false;
					if(!player.countCards('h')) return false;
					if(!info.multitarget){
						if(game.hasPlayer(function(current){
							return !event.targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&lib.filter.targetInRange(card,player,current);
						})){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var card=trigger.card;
					var prompt2='弃置任意张手牌，并为'+get.translation(card)+'增加等量的目标';
					var targets=game.filterPlayer(function(current){
						return !trigger.targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&lib.filter.targetInRange(card,player,current);
					});
					var max=0;
					if(!trigger.targets[0].hasSkill('heiguangkai_skill')) max=targets.filter(function(target){
						return get.effect(target,card,player,player)>0;
					}).length;
					player.chooseCardTarget({
						prompt:get.prompt('boss_keding'),
						prompt2:prompt2,
						selectCard:function(){
							var player=_status.event.player;
							var targets=_status.event.targets;
							return [Math.max(1,ui.selected.targets.length),Math.min(targets.length,player.countCards('h'))];
						},
						selectTarget:function(){
							return ui.selected.cards.length;
						},
						position:'h',
						filterCard:lib.filter.cardDiscardable,
						filterTarget:function(card,player,target){
							return _status.event.targets.contains(target);
						},
						targets:targets,
						ai1:function(card){
							if(ui.selected.cards.length>=_status.event.max) return 0;
							return 5-get.value(card);
						},
						ai2:function(target){
							if(target.hasSkill('heiguangkai_skill')) return 0;
							var trigger=_status.event.getTrigger();
							var player=_status.event.player;
							return get.effect(target,trigger.card,player,player);
						},
						max:max,
					});
					'step 1'
					if(result.bool){
						player.logSkill('boss_keding',result.targets);
						player.discard(result.cards);
						trigger.targets.addArray(result.targets);
					}
				},
			},
			boss_bashi:{
				filter:function(event,player){
					return event.player!=player&&event.card&&(event.card.name=='sha'||get.type(event.card)=='trick')&&!player.isTurnedOver();
				},
				logTarget:'player',
				check:function(event,player){
					if(event.getParent().excluded.contains(player)) return false;
					if(get.attitude(player,event.player)>0){
						return false;
					}
					if(get.tag(event.card,'respondSha')){
						if(player.countCards('h',{name:'sha'})==0){
							return true;
						}
					}
					else if(get.tag(event.card,'respondShan')){
						if(player.countCards('h',{name:'shan'})==0){
							return true;
						}
					}
					else if(get.tag(event.card,'damage')){
						if(event.card.name=='shuiyanqijunx') return player.countCards('e')<2;
						return true;
						//if(player.countCards('h')<2) return true;
					}
					return false;
				},
				trigger:{target:'useCardToTargeted'},
				content:function(){
					player.turnOver();
					trigger.getParent().excluded.add(player);
				},
			},
			boss_danjing:{
				trigger:{global:'dying'},
				filter:function(event,player){
					return player.hp>1&&event.player.hp<1&&event.player.isFriendOf(player);
				},
				check:function(event,player){
					var target=event.player;
					return get.attitude(player,target)>0&&lib.filter.cardSavable({name:'tao',isCard:true},player,target);
				},
				logTarget:'player',
				content:function(){
					'step 0'
					player.loseHp();
					'step 1'
					var card={name:'tao',isCard:true};
					if(lib.filter.cardSavable(card,player,trigger.player)) player.useCard(card,trigger.player);
				},
			},
			boss_jiaoxie:{
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return lib.skill.boss_jiaoxie.filterTarget(null,player,current);
					});
				},
				filterTarget:function(card,player,target){
					return target.isEnemyOf(player)&&target.type=='mech'&&target.countCards('he')>0;
				},
				content:function(){
					'step 0'
					if(!target.countCards('he')) event.finish();
					else target.chooseCard('he',true,'将一张牌交给'+get.translation(player));
					'step 1'
					if(result.bool){
						player.gain(result.cards,target,'give');
					}
				},
				ai:{
					order:9,
					result:{
						target:function(player,target){
							if(target.countCards('e',function(card){
								return get.value(card,target)<=0;
							})>0) return 1;
							return -1;
						},
					},
				},
			},
			boss_didongjg:{
				trigger:{player:'phaseEnd'},
				direct:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_didongjg'),function(card,player,target){
						return target.isEnemyOf(player);
					}).ai=function(target){
						var att=get.attitude(player,target);
						if(target.isTurnedOver()){
							if(att>0){
								return att+5;
							}
							return -1;
						}
						if(player.isTurnedOver()){
							return 5-att;
						}
						return -att;
					};
					"step 1"
					if(result.bool){
						player.logSkill('boss_didongjg',result.targets);
						result.targets[0].turnOver();
					}
				},
				ai:{
					threaten:1.7
				}
			},
			boss_lianyujg:{
				trigger:{player:'phaseEnd'},
				unique:true,
				content:function(){
					"step 0"
					event.players=game.filterPlayer(function(current){
					    return current.isEnemyOf(player);
					});
					"step 1"
					if(event.players.length){
						var current=event.players.shift();
						player.line(current,'fire');
						current.damage('fire');
						event.redo();
					}
				},
				ai:{
					threaten:2
				}
			},
			boss_mojianjg:{
				trigger:{player:'phaseUseBegin'},
				content:function(){
					var list=game.filterPlayer(function(current){
						return player.canUse('wanjian',current)&&current.isEnemyOf(player);
					});
					list.sort(lib.sort.seat);
					player.useCard({name:'wanjian'},list);
				},
				ai:{
					threaten:1.8
				}
			},
			boss_qiwu:{
				audio:true,
				trigger:{player:'useCard'},
				direct:true,
				filter:function(event,player){
					if(get.suit(event.card)=='club'){
						return game.hasPlayer(function(current){
							return current.isFriendOf(player)&&current.isDamaged();
						});
					}
					return false;
				},
				content:function(){
					"step 0"
					var noneed=(trigger.card.name=='tao'&&trigger.targets[0]==player&&player.hp==player.maxHp-1);
					player.chooseTarget(get.prompt('boss_qiwu'),function(card,player,target){
						return target.hp<target.maxHp&&target.isFriendOf(player);
					}).ai=function(target){
						var num=get.attitude(player,target);
						if(num>0){
							if(noneed&&player==target){
								num=0.5;
							}
							else if(target.hp==1){
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
						player.logSkill('qiwu',result.targets);
						result.targets[0].recover();
					}
				},
				ai:{
					expose:0.3,
					threaten:1.5
				}
			},
			boss_tianyujg:{
				audio:true,
				trigger:{player:'phaseEnd'},
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isEnemyOf(player)&&!current.isLinked();
					});
				},
				content:function(){
					"step 0"
					event.targets=game.filterPlayer();
					event.targets.sort(lib.sort.seat);
					"step 1"
					if(event.targets.length){
						var target=event.targets.shift();
						if(!target.isLinked()&&target.isEnemyOf(player)){
							player.line(target,'green');
							target.link();
						}
						event.redo();
					}
				}
			},
			boss_jueji:{
				audio:2,
				trigger:{global:'phaseDrawBegin'},
				filter:function(event,player){
					if(event.player.isFriendOf(player)){
						return false;
					}
					return event.num>0&&event.player!=player&&event.player.hp<event.player.maxHp;
				},
				logTarget:'player',
				content:function(){
					player.line(trigger.player,'green');
					trigger.num--;
				},
				ai:{
					expose:0.2,
					threaten:1.4
				}
			},
			boss_huodi:{
				audio:2,
				trigger:{player:'phaseEnd'},
				direct:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isFriendOf(player)&&current.isTurnedOver();
					});
				},
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_huodi'),function(card,player,target){
						return !target.isFriendOf(player);
					}).ai=function(target){
						if(target.isTurnedOver()) return 0;
						return -get.attitude(player,target);
					};
					"step 1"
					if(result.bool){
						player.logSkill('boss_huodi',result.targets);
						result.targets[0].turnOver();
					}
				},
				ai:{
					expose:0.2
				}
			},
			boss_chuanyun:{
				audio:true,
				trigger:{player:'phaseEnd'},
				direct:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_chuanyun'),function(card,player,target){
						return player.hp<target.hp;
					}).ai=function(target){
						return get.damageEffect(target,player,player);
					}
					"step 1"
					if(result.bool){
						player.logSkill('boss_chuanyun',result.targets);
						result.targets[0].damage();
					}
				},
			},
			boss_leili:{
				audio:2,
				trigger:{source:'damageEnd'},
				direct:true,
				filter:function(event){
					return event.card&&event.card.name=='sha';
				},
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_leili'),function(card,player,target){
						if(target==trigger.player) return false;
						return target.isEnemyOf(player);
					}).ai=function(target){
						return get.damageEffect(target,player,player,'thunder');
					}
					"step 1"
					if(result.bool){
						player.logSkill('boss_leili',result.targets);
						result.targets[0].damage('thunder');
					}
				},
				ai:{
					expose:0.2,
					threaten:1.3
				}
			},
			boss_fengxing:{
				audio:true,
				trigger:{player:'phaseBegin'},
				direct:true,
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('boss_fengxing'),function(card,player,target){
						if(target.isFriendOf(player)) return false;
						return lib.filter.targetEnabled({name:'sha'},player,target);
					}).ai=function(target){
						return get.effect(target,{name:'sha'},player);
					}
					"step 1"
					if(result.bool){
						player.logSkill('boss_fengxing');
						player.useCard({name:'sha'},result.targets,false);
					}
				},
				ai:{
					expose:0.2,
					threaten:1.3
				}
			},
			boss_xuanlei:{
				audio:true,
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isEnemyOf(player)&&current.countCards('j');
					});
				},
				content:function(){
					"step 0"
					event.targets=game.filterPlayer(function(current){
						return current.isEnemyOf(player)&&current.countCards('j');
					});
					event.targets.sort(lib.sort.seat);
					player.line(event.targets,'thunder');
					"step 1"
					if(event.targets.length){
						event.targets.shift().damage('thunder');
						event.redo();
					}
				}
			},
			boss_fanshi:{
				audio:true,
				trigger:{player:'phaseEnd'},
				forced:true,
				check:function(){
					return false;
				},
				content:function(){
					player.loseHp();
				}
			},
			boss_skonghun:{
				audio:true,
				trigger:{player:'phaseUseBegin'},
				filter:function(event,player){
					var num=player.maxHp-player.hp;
					if(num==0) return false;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].side!=player.side){
							num--;
						}
					}
					return num>=0;
				},
				forced:true,
				content:function(){
					'step 0'
					var targets=game.filterPlayer(function(current){
						return current.isEnemyOf(player);
					});
					targets.sort(lib.sort.seat);
					event.targets=targets;
					player.line(targets,'thunder');
					event.num=targets.length;
					'step 1'
					if(event.targets.length){
						event.targets.shift().damage('thunder');
						event.redo();
					}
					'step 2'
					player.recover(event.num);
				},
				ai:{
					threaten:function(player,target){
						if(target.hp==1) return 2;
						if(target.hp==2&&game.players.length<8) return 1.5;
						return 0.5;
					},
				}
			},
			boss_chiying:{
				audio:2,
				trigger:{global:'damageBegin4'},
				forced:true,
				filter:function(event,player){
					if(event.num<=1) return false;
					return event.player.isFriendOf(player);
				},
				content:function(){
					trigger.num=1;
				}
			},
			boss_jingfan:{
				global:'boss_jingfan2',
			},
			boss_jingfan2:{
				mod:{
					globalFrom:function(from,to,distance){
						if(to.isEnemyOf(from)) return;
						var players=game.filterPlayer();
						for(var i=0;i<players.length;i++){
							if(players[i].hasSkill('boss_jingfan')&&
								players[i].isFriendOf(from)&&players[i]!=from){
								return distance-1;
							}
						}
					}
				}
			},
			boss_lingyu:{
				trigger:{player:'phaseEnd'},
				check:function(event,player){
					if(player.isTurnedOver()) return true;
					var num=0,players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].hp<players[i].maxHp&&
							players[i].isFriendOf(player)&&get.recoverEffect(players[i])>0){
							if(players[i].hp==1){
								return true;
							}
							num++;
							if(num>=2) return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					player.turnOver();
					'step 1'
					var list=game.filterPlayer(function(current){
						return current.isDamaged()&&current.isFriendOf(player);
					});
					player.line(list,'green');
					event.targets=list;
					'step 2'
					if(event.targets.length){
						event.targets.shift().recover();
						event.redo();
					}
				},
				ai:{
					threaten:1.5,
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
			boss_zhenwei:{
				global:'boss_zhenwei2',
				ai:{
					threaten:1.5
				}
			},
			boss_zhenwei2:{
				mod:{
					globalTo:function(from,to,distance){
						if(to.isFriendOf(from)) return;
						var players=game.filterPlayer();
						for(var i=0;i<players.length;i++){
							if(players[i].hasSkill('boss_zhenwei')&&
								players[i].isFriendOf(to)&&players[i]!=to){
								return distance+1;
							}
						}
					}
				}
			},
			boss_benlei:{
				mode:['versus'],
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					if(_status.mode!='jiange') return false;
					var players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].type=='mech'&&players[i].isEnemyOf(player)){
							return true;
						}
					}
				},
				content:function(){
					var target=game.findPlayer(function(current){
						return current.type=='mech'&&current.isEnemyOf(player);
					});
					if(target){
						player.line(target,'thunder');
						target.damage(Math.random()>0.4?2:3,'thunder');
					}
				},
				ai:{
					threaten:function(player,target){
						if(_status.mode=='jiange'){
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].type=='mech'&&game.players[i].isEnemyOf(target)){
									return 2;
								}
							}
						}
						return 1;
					}
				}
			},
			boss_nailuo:{
				trigger:{player:'phaseEnd'},
				check:function(event,player){
					if(player.isTurnedOver()) return true;
					var num=0,players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].isEnemyOf(player)){
							var es=players[i].getCards('e');
							for(var j=0;j<es.length;j++){
								switch(get.subtype(es[j])){
									case 'equip1':num+=1;break;
									case 'equip2':num+=2;break;
									case 'equip3':num+=2;break;
									case 'equip4':num+=1;break;
									case 'equip5':num+=1.5;break;
								}
							}
						}
					}
					if(_status.mode=='jiange'){
						for(var i=0;i<players.length;i++){
							if(players[i].isFriendOf(player)&&players[i].hasSkill('huodi')){
								return num>0;
							}
						}
					}
					return num>=4;
				},
				filter:function(event,player){
					var players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].isEnemyOf(player)&&players[i].countCards('e')){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					player.turnOver();
					'step 1'
					event.targets=get.players();
					'step 2'
					if(event.targets.length){
						var current=event.targets.shift();
						if(current.isEnemyOf(player)){
							var es=current.getCards('e');
							if(es.length){
								current.discard(es);
								player.line(current,'green');
							}
						}
						event.redo();
					}
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
			boss_tanshi:{
				trigger:{player:'phaseEnd'},
				forced:true,
				check:function(){
					return false;
				},
				filter:function(event,player){
					return player.countCards('h')>0;
				},
				content:function(){
					player.chooseToDiscard('h',true);
				}
			},
			boss_tunshi:{
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					var nh=player.countCards('h');
					return game.hasPlayer(function(current){
						return current.isEnemyOf(player)&&current.countCards('h')>nh;
					});
				},
				content:function(){
					'step 0'
					var nh=player.countCards('h');
					var targets=game.filterPlayer(function(current){
						return current.isEnemyOf(player)&&current.countCards('h')>nh;
					});
					targets.sort(lib.sort.seat);
					event.targets=targets;
					'step 1'
					if(event.targets.length){
						var current=event.targets.shift();
						current.damage();
						player.line(current,'thunder');
						event.redo();
					}
				}
			},
			boss_jiguan:{
				mod:{
					targetEnabled:function(card,player,target){
						if(card.name=='lebu'){
							return false;
						}
					}
				}
			},
			boss_gongshenjg:{
				audio:2,
				trigger:{player:'phaseEnd'},
				mode:['versus'],
				filter:function(event,player){
					if(_status.mode!='jiange') return false;
					var players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].type=='mech'){
							if(players[i].isEnemyOf(player)) return true;
							if(players[i].hp<players[i].maxHp) return true;
						}
					}
					return false;
				},
				content:function(){
					var enemy,players=game.filterPlayer();
					for(var i=0;i<players.length;i++){
						if(players[i].type=='mech'){
							if(players[i].isFriendOf(player)){
								if(players[i].hp<players[i].maxHp){
									player.line(players[i],'green');
									players[i].recover();
									return;
								}
							}
							else{
								enemy=players[i];
							}
						}
					}
					if(enemy){
						player.line(enemy,'fire');
						enemy.damage('fire');
					}
				},
			},
			boss_jingmiao:{
				trigger:{global:'useCardAfter'},
				filter:function(event,player){
					return event.player.isEnemyOf(player)&&event.card.name=='wuxie';
				},
				logTarget:'player',
				check:function(event,player){
					return get.attitude(player,event.player)<0;
				},
				content:function(){
					player.line(trigger.player,'green');
					trigger.player.loseHp();
				},
				ai:{
					expose:0.2,
					threaten:1.3
				}
			},
			boss_zhinang:{
				trigger:{player:'phaseBegin'},
				frequent:true,
				content:function(){
					"step 0"
					event.cards=get.cards(5);
					event.cards2=[];
					for(var i=0;i<event.cards.length;i++){
						var type=get.type(event.cards[i],'trick');
						if(type=='trick'||type=='equip'){
							event.cards2.push(event.cards[i]);
						}
					}
					if(!event.isMine()||event.cards2.length==0){
						player.showCards(event.cards);
					}
					"step 1"
					if(event.cards2.length==0){
						event.finish();
					}
					else{
						var dialog=ui.create.dialog('将三张牌中的锦囊牌或装备牌交给一己方名角色','hidden');
						dialog.add(event.cards);
						for(var i=0;i<dialog.buttons.length;i++){
							if(event.cards2.contains(dialog.buttons[i].link)){
								dialog.buttons[i].style.opacity=1;
							}
							else{
								dialog.buttons[i].style.opacity=0.5;
							}
						}
						var next=player.chooseTarget(true,dialog,function(card,player,target){
							return target.isFriendOf(player);
						});
						next.ai=function(target){
							var att=get.attitude(player,target);
							if(att>0&&target.hasJudge('lebu')){
								return 0.1;
							}
							if(player.countCards('h')>player.hp){
								if(target==player) return Math.max(1,att-2);
							}
							if(target==player) return att+5;
							return att;
						}
					}
					"step 2"
					if(result&&result.targets&&result.targets.length){
						event.target=result.targets[0];
					}
					if(event.cards2.length){
						player.line(event.target,'green');
						event.target.gain(event.cards2,'gain2','log');
					}
				},
				ai:{
					threaten:1.3
				}
			},
			boss_biantian4:{
				trigger:{player:'dieBegin'},
				forced:true,
				popup:false,
				content:function(){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].hasSkill('boss_biantian3')){
							game.players[i].removeSkill('boss_biantian3');
							game.players[i].popup('boss_biantian3');
						}
						if(game.players[i].hasSkill('boss_biantian2')){
							game.players[i].removeSkill('boss_biantian2');
							game.players[i].popup('boss_biantian2');
						}
					}
				}
			},
			boss_biantian:{
				trigger:{player:'phaseBegin'},
				forced:true,
				unique:true,
				audio:false,
				group:'boss_biantian4',
				content:function(){
					"step 0"
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].hasSkill('boss_biantian3')){
							game.players[i].removeSkill('boss_biantian3');
							game.players[i].popup('boss_biantian3');
						}
						if(game.players[i].hasSkill('boss_biantian2')){
							game.players[i].removeSkill('boss_biantian2');
							game.players[i].popup('boss_biantian2');
						}
					}
					player.judge(function(card){
						var color=get.color(card);
						if(color=='black') return 1;
						if(color=='red') return 0;
						return -1;
					});
					"step 1"
					var targets=[],players=game.filterPlayer();
					if(result.color=='red'){
						game.trySkillAudio('boss_biantianx2');
						for(var i=0;i<players.length;i++){
							if(!players[i].isFriendOf(player)){
								players[i].addSkill('boss_biantian3');
								players[i].popup('kuangfeng');
								targets.push(players[i]);
							}
						}
						player.logSkill('kuangfeng',targets,'fire');
					}
					else if(result.color=='black'){
						game.trySkillAudio('boss_biantianx1');
						for(var i=0;i<players.length;i++){
							if(players[i].isFriendOf(player)){
								players[i].addSkill('boss_biantian2');
								players[i].popup('dawu');
								targets.push(players[i]);
							}
						}
						player.logSkill('dawu',targets,'thunder');
					}
				},
				ai:{
					threaten:1.6
				}
			},
			boss_biantian2:{
				audio:false,
				trigger:{player:'damageBefore'},
				filter:function(event){
					if(event.nature!='thunder') return true;
					return false;
				},
				forced:true,
				mark:true,
				marktext:'雾',
				intro:{
					content:'已获得大雾标记'
				},
				content:function(){
					trigger.cancel();
				},
				ai:{
					nofire:true,
					nodamage:true,
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'damage')&&!get.tag(card,'thunderDamage')) return [0,0];
						}
					}
				}
			},
			boss_biantian3:{
				trigger:{player:'damageBegin3'},
				filter:function(event){
					if(event.nature=='fire') return true;
					return false;
				},
				mark:true,
				marktext:'风',
				intro:{
					content:'已获得狂风标记'
				},
				forced:true,
				content:function(){
					trigger.num++;
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'fireDamage')) return 1.5;
						}
					}
				}
			},
			boss_jizhen:{
				audio:2,
				trigger:{player:'phaseEnd'},
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.isFriendOf(player)&&current.isDamaged();
					});
				},
				content:function(){
					var list=game.filterPlayer(function(current){
						return current.isFriendOf(player)&&current.isDamaged();
					});
					if(list.length){
						player.line(list,'green');
						game.asyncDraw(list);
					}
				},
				ai:{
					threaten:1.4
				}
			},
			boss_lingfeng:{
				audio:2,
				trigger:{player:'phaseDrawBefore'},
				content:function(){
					"step 0"
					trigger.cancel();
					event.cards=get.cards(2);
					player.showCards(event.cards);
					"step 1"
					if(get.color(event.cards[0])!=get.color(event.cards[1])){
						player.chooseTarget('是否令一名敌方角色失去1点体力？',function(card,player,target){
							return !target.isFriendOf(player);
						}).ai=function(target){
							return -get.attitude(player,target);
						}
					}
					"step 2"
					if(result.bool&&result.targets&&result.targets.length){
						player.line(result.targets,'green');
						result.targets[0].loseHp();
					}
					"step 3"
					player.gain(event.cards);
					player.$draw(event.cards);
					game.delay();
				},
				ai:{
					threaten:1.4
				}
			},
			boss_yuhuojg:{
				audio:true,
				trigger:{player:'damageBegin2'},
				filter:function(event){
					return event.nature=='fire';
				},
				forced:true,
				content:function(){
					trigger.cancel();
				},
				ai:{
					nofire:true,
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'fireDamage')) return 0;
						}
					}
				}
			},
			boss_tianyun:{
				trigger:{player:'phaseEnd'},
				direct:true,
				content:function(){
					"step 0"
					event.forceDie=true;
					player.chooseTarget(get.prompt('boss_tianyun'),function(card,player,target){
						return target.isEnemyOf(player);
					}).ai=function(target){
						if(player.hp<=1) return 0;
						if(get.attitude(player,target)>-3) return 0;
						var eff=get.damageEffect(target,player,player,'fire');
						if(eff>0){
							return eff+target.countCards('e')/2;
						}
						return 0;
					}
					"step 1"
					if(result.bool){
						player.logSkill('boss_tianyun',result.targets,'fire');
						player.loseHp();
						event.target=result.targets[0];
					}
					else{
						event.finish();
					}
					"step 2"
					if(event.target){
						event.target.damage(Math.random()>0.4?2:3,'fire');
					}
					"step 3"
					if(event.target){
						var es=event.target.getCards('e');
						if(es.length){
							event.target.discard(es);
						}
					}
				},
				ai:{
					threaten:2
				}
			},
			versus_ladder:{
				trigger:{global:['damageEnd','recoverEnd','dieEnd','gainEnd','phaseDiscardEnd']},
				silent:true,
				filter:function(event,player){
					if(!_status.ladder) return false;
					if(event._ladder_mmr_counted) return false;
					if(!event.source) return false;
					return event.source==game.me||event.player==game.me;
				},
				content:function(){
					switch(event.triggername){
						case 'damageEnd':{
							if(trigger.source.side!=trigger.player.side){
								if(trigger.source==game.me){
									_status.ladder_mmr+=0.5*Math.max(1,trigger.num);
								}
								else{
									_status.ladder_mmr+=0.2*Math.max(1,trigger.num);
								}
							}
							break;
						}
						case 'recoverEnd':{
							if(trigger.source!=trigger.player){
								if(trigger.source==game.me){
									if(trigger.player.side==game.me.side){
										_status.ladder_mmr+=0.5*trigger.num;
									}
									else{
										_status.ladder_mmr-=0.3*trigger.num;
									}
								}
							}
							else{
								_status.ladder_mmr+=0.3*trigger.num;
							}
							break;
						}
						case 'dieEnd':{
							if(trigger.source==game.me&&trigger.player.side!=game.me.side){
								_status.ladder_mmr+=2;
							}
							break;
						}
						case 'gainEnd':{
							if(trigger.cards&&trigger.cards.length){
								if(trigger.source==game.me&&trigger.player!=game.me){
									if(trigger.player.side==game.me.side){
										_status.ladder_mmr+=0.3*trigger.cards.length;
									}
									else{
										_status.ladder_mmr-=0.1*trigger.cards.length;
									}
								}
								else{
									if(trigger.source){
										if(trigger.source.side!=game.me.side){
											_status.ladder_mmr+=0.3*trigger.cards.length;
										}
									}
									else{
										_status.ladder_mmr+=0.1*trigger.cards.length;
									}
								}
							}
							break;
						}
						case 'phaseDiscardEnd':{
							if(trigger.player==player){
								if(trigger.cards&&trigger.cards.length){
									_status.ladder_mmr-=0.2*trigger.cards.length;
								}
							}
							break;
						}
					}
					trigger._ladder_mmr_counted=true;
				}
			}
		},
"translate": {
			zhu:'主',
			zhong:'忠',
			truezhu:"帅",
			falsezhu:"将",
			trueZhu:"帅",
			falseZhu:"将",
			trueZhong:"兵",
			falseZhong:"卒",
			trueColor:"zhu",
			falseColor:"wei",
			versus_zhu_config:'启用主将',
			versus_only_zhu_config:'只当主将',
			versus_main_zhu_config:'主将死亡后结束',
			versus_assign_enemy_config:'指定对手',
			versus_cross_seat_config:'交叉座位',
			versus_random_seat_config:'随机座位',
			versus_noreplace_end_config:'无替补时结束',
			versus_single_control_config:'单人控制',
			seat_order_config:'座位排列',
			versus_first_less_config:'先手少摸牌',
			versus_reward_config:'杀敌摸牌',
			versus_punish_config:'杀死队友',
			versus_number_config:'对阵人数',
			replace_number_config:'替补人数',
			choice_config:'候选人数',
			mode_versus_character_config:'剑阁武将',
			mode_versus_card_config:'同舟共济',

			tangzi:'唐咨',
			liuqi:'刘琦',

			wenji:'问计',
			wenji2:'问计',
			wenji_info:'队友的出牌阶段开始时，你可令其交给你一张手牌，若此牌为锦囊牌，则非队友角色计算与你的距离+1直到你的下个回合开始',
			tunjiang:'屯江',
			tunjiang_info:'结束阶段开始时，若你于本回合的出牌阶段使用过至少两张牌且未造成过伤害，你可以选择一项：1.你摸两张牌；2.队友摸两张牌',
			xingzhao:'兴棹',
			xingzhao2:'兴棹',
			xingzhao3:'兴棹',
			xingzhao_bg:'棹',
			xingzhao_info:'锁定技，若你和队友持有的龙船至宝数合计为：1个以上，你具有技能“恂恂”；2个以上，当你或队友使用装备牌时，其摸一张牌；3个以上，你和队友跳过判定阶段',

			boss_liedixuande:'烈帝玄德',
			boss_gongshenyueying:'工神月英',
			boss_tianhoukongming:'天侯孔明',
			boss_yuhuoshiyuan:'浴火士元',
			boss_qiaokuijunyi:'巧魁儁乂',
			boss_jiarenzidan:'佳人子丹',
			boss_duanyuzhongda:'断狱仲达',
			boss_juechenmiaocai:'绝尘妙才',

			boss_jileibaihu:'机雷白虎',
			boss_yunpingqinglong:'云屏青龙',
			boss_lingjiaxuanwu:'灵甲玄武',
			boss_chiyuzhuque:'炽羽朱雀',
			boss_fudibian:'缚地狴犴',
			boss_tuntianchiwen:'吞天螭吻',
			boss_shihuosuanni:'食火狻猊',
			boss_lieshiyazi:'裂石睚眦',
			
			boss_kumuyuanrang:'枯目元让',
			boss_baijiwenyuan:'百计文远',
			boss_yihanyunchang:'翊汉云长',
			boss_fuweizilong:'扶危子龙',

			boss_xiaorui:'骁锐',
			boss_xiaorui2:'骁锐',
			boss_xiaorui_info:'友方角色于其回合内使用【杀】造成伤害后，其使用【杀】的次数+1。',
			boss_huchen:'虎臣',
			boss_huchen_info:'锁定技，你摸牌阶段摸牌数+X（X为你击杀的敌方角色数）。',
			boss_fengjian:'封缄',
			boss_fengjian2:'封缄',
			boss_fengjian_info:'受到你伤害的角色于其下个回合结束前，无法使用牌指定你为目标。',
			boss_keding:'克定',
			boss_keding_info:'当你使用【杀】或普通锦囊牌仅指定唯一目标时，你可以弃置任意张手牌，为其指定等量的额外目标。',
			boss_bashi:'拔矢',
			boss_bashi_info:'每当你成为其他角色使用的杀或普通锦囊牌的目标时，你可以从正面翻至背面，若如此做，此牌对你无效。',
			boss_danjing:'啖睛',
			boss_danjing_info:'友方角色进入濒死状态时，若你的体力值大于1，你可以失去1点体力，视为对其使用一张【桃】。',
			boss_jiaoxie:'缴械',
			boss_jiaoxie_info:'出牌阶段限一次，你可令敌方守城器械交给你一张牌。',
			boss_lianyujg:'炼狱',
			boss_lianyujg_info:'结束阶段，你可以对所有敌方角色造成1点火焰伤害',
			boss_didongjg:'地动',
			boss_didongjg_info:'结束阶段，你可以选择一名敌方角色将其武将牌翻面',
			boss_mojianjg:'魔箭',
			boss_mojianjg_info:'出牌阶段开始时，你可以对所有敌方角色使用一张万箭齐发',
			boss_jiguan:'机关',
			boss_jiguan_info:'锁定技，你不能成为【乐不思蜀】的目标',
			boss_lingyu:'灵愈',
			boss_lingyu_info:'结束阶段，你可以将自己的武将牌翻面，然后令所有已受伤的己方其他角色回复1点体力',
			boss_tianyun:'天陨',
			boss_tianyun_info:'结束阶段，你可以失去1点体力，然后令一名敌方角色随机受到2~3点火焰伤害并弃置其装备区里的所有牌。',
			boss_zhenwei:'镇卫',
			boss_zhenwei_info:'锁定技，其他己方角色的防御距离+1',
			boss_benlei:'奔雷',
			boss_benlei_info:'锁定技，准备阶段，你对敌方攻城器械随机造成2~3点雷电伤害。',
			boss_nailuo:'奈落',
			boss_nailuo_info:'结束阶段，你可以将你的武将牌翻面，令所有敌方角色弃置装备区内的所有牌',
			boss_tanshi:'贪食',
			boss_tanshi_info:'锁定技，结束阶段开始时，你须弃置一张手牌',
			boss_tunshi:'吞噬',
			boss_tunshi_info:'锁定技，准备阶段，你对所有手牌数量大于你的敌方角色造成1点伤害',
			boss_yuhuojg:'浴火',
			boss_yuhuojg_info:'锁定技，每当你受到火焰伤害时，防止此伤害',
			boss_qiwu:'栖梧',
			boss_qiwu_info:'每当你使用一张梅花牌，你可以令一名友方角色回复一点体力',
			boss_tianyujg:'天狱',
			boss_tianyujg_info:'锁定技，结束阶段，你令所有未横置的敌方角色横置',
			boss_gongshenjg:'工神',
			boss_gongshenjg_info:'结束阶段，若已方器械已受伤，你可以为其回复一点体力；否则你可以对敌方器械造成一点火焰伤害',
			boss_zhinang:'智囊',
			boss_zhinang_info:'准备阶段，你可以亮出牌堆顶的五张牌，你可以将其中锦囊或装备牌交给一名己方角色',
			boss_jingmiao:'精妙',
			boss_jingmiao_info:'锁定技，每当敌方角色使用的无懈可击生效后，你令其失去1点体力',
			boss_biantian:'变天',
			boss_biantian_info:'锁定技，准备阶段，你进行一次判定，若为红色，直到下个回合开始前，令敌方所有角色处于“狂风”状态，若为黑色，直到下个回合开始前，令己方所有角色处于“大雾”状态',
			boss_biantian2:'大雾',
			boss_biantian3:'狂风',
			boss_lingfeng:'灵锋',
			boss_lingfeng_info:'摸牌阶段，你可以改为亮出牌堆顶的两张牌，然后获得之，若这些牌的颜色不同，你令一名敌方角色失去1点体力',
			boss_jizhen:'激阵',
			boss_jizhen_info:'锁定技，结束阶段，你令所有已受伤的己方角色摸一张牌',
			boss_huodi:'惑敌',
			boss_huodi_info:'结束阶段，若有武将牌背面朝上的己方角色，你可以令一名敌方角色将其武将牌翻面',
			boss_jueji:'绝汲',
			boss_jueji_info:'敌方角色摸牌阶段，若其已受伤，你可以令其少摸一张牌',
			boss_chuanyun:'穿云',
			boss_chuanyun_info:'结束阶段，你可以对体力比你多的一名其他角色造成1点伤害',
			boss_leili:'雷厉',
			boss_leili_info:'每当你的[杀]造成伤害后，你可以对另一名敌方角色造成1点雷电伤害',
			boss_fengxing:'风行',
			boss_fengxing_info:'准备阶段，你可以选择一名敌方角色，若如此做，视为对其使用了一张[杀]',
			boss_skonghun:'控魂',
			boss_skonghun_info:'出牌阶段开始时，若你已损失体力值不小于敌方角色数，你可以对所有敌方角色各造成1点雷电伤害，然后你恢复X点体力（X为受到伤害的角色数）',
			boss_fanshi:'反噬',
			boss_fanshi_info:'锁定技，结束阶段，你失去1点体力',
			boss_xuanlei:'玄雷',
			boss_xuanlei_info:'锁定技，准备阶段，令所有判定区内有牌的敌方角色受到1点雷电伤害',
			boss_chiying:'持盈',
			boss_chiying_info:'锁定技，每当己方角色受到多于1伤害时，你防止其余伤害',
			boss_jingfan:'惊帆',
			boss_jingfan_info:'锁定技，己方其他角色的进攻距离+1',
			longchuanzhibao:'龙船至宝',
			longchuanzhibao_bg:'船',
			zong:'粽',
			zong_info:'1. 出牌阶段对自己使用，回复1点体力；2. 自己或队友濒死时对其使用，目标角色回复1点体力',
			xionghuangjiu:'雄黄酒',
			xionghuangjiu_info:'1. 出牌阶段对自己使用，本回合使用的下一张【杀】伤害+1；若队友已死亡，改为使本回合使用的下一张牌伤害+1；2. 自己濒死时使用，回复1点体力',
			tongzhougongji:'同舟共济',
			tongzhougongji_info:'出牌阶段使用，选择一项：1.摸X张牌（X为你所在势力拥有的龙船至宝数）；2.你和队友各摸一张牌',
			lizhengshangyou:'力争上游',
			lizhengshangyou_info:'出牌阶段对所有角色使用，若目标角色的势力拥有龙船至宝，其回复1点体力，若目标角色的势力没有龙船至宝，其弃置一张牌',
			tunliang:'屯粮',
			tunliang_info:'出牌阶段，对至多三名角色使用。目标角色各摸一张牌。',
			yuanjun:'援军',
			yuanjun_info:'出牌阶段，对至多两名已受伤的角色使用。目标角色回复1点体力。',
			huoshaowuchao:'火烧乌巢',
			huoshaowuchao_info:'锁定技，本局游戏内造成的无属性伤害均视为火属性。',
			liangcaokuifa:'粮草匮乏',
			liangcaokuifa_info:'锁定技，所有角色摸牌阶段的额定摸牌数-1。当一名角色使用的牌结算完成后，若其因此牌造成了伤害，则其摸一张牌。',
			zhanyanliangzhuwenchou:'斩颜良诛文丑',
			zhanyanliangzhuwenchou_info:'锁定技，一名角色的回合开始时，其选择一项：视为使用一张不可被【无懈可击】响应的【决斗】，或失去1点体力。',
			shishengshibai:'十胜十败',
			shishengshibai_info:'锁定技，一名角色使用牌时，若此牌是整局游戏使用的第整十张牌且此牌不为延时锦囊牌或装备牌，则此牌所有目标角色再次成为此牌的目标角色。',
		}
};
}
