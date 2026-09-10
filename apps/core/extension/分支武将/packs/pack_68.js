// Extracted from mode/identity.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"skill": {
			yexinbilu:{
				enable:'phaseUse',
				filter:function(event,player){
					return player.identity=='rYe'||player.identity=='bYe';
				},
				skillAnimation:'legend',
				animationColor:'thunder',
				content:function(){
					game.removeGlobalSkill('yexinbilu');
					player.yexinbilu();
				},
				ai:{
					order:10,
					result:{
						player:function(player){
							return 1-game.countPlayer(function(current){
								return current!=player&&(current.identity=='rYe'||current.identity=='bYe')&&(current==game.me||current.isOnline());
							})
						},
					},
				},
			},
			identity_junshi:{
				name:'军师',
				mark:true,
				intro:{
					content:'准备阶段开始时，可以观看牌堆顶的三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底'
				},
				trigger:{player:'phaseZhunbeiBegin'},
				silent:true,
				content:function(){
					"step 0"
					var cards=get.cards(3);
					game.cardsGotoOrdering(cards);
					var next=player.chooseToMove();
					next.set('list',[
						['牌堆顶',cards],
						['牌堆底'],
					]);
					next.set('prompt','观星：点击将牌移动到牌堆顶或牌堆底');
					next.processAI=function(list){
						var cards=list[0][1],player=_status.event.player;
						var top=[];
						var judges=player.getCards('j');
						var stopped=false;
						if(!player.hasWuxie()){
							for(var i=0;i<judges.length;i++){
								var judge=get.judge(judges[i]);
								cards.sort(function(a,b){
									return judge(b)-judge(a);
								});
								if(judge(cards[0])<0){
									stopped=true;break;
								}
								else{
									top.unshift(cards.shift());
								}
							}
						}
						var bottom;
						if(!stopped){
							cards.sort(function(a,b){
								return get.value(b,player)-get.value(a,player);
							});
							while(cards.length){
								if(get.value(cards[0],player)<=5) break;
								top.unshift(cards.shift());
							}
						}
						bottom=cards;
						return [top,bottom];
					}
					"step 1"
					var top=result.moved[0];
					var bottom=result.moved[1];
					top.reverse();
					for(var i=0;i<top.length;i++){
						ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
					}
					for(i=0;i<bottom.length;i++){
						ui.cardPile.appendChild(bottom[i]);
					}
					player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(bottom.length)+'下');
					game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
					game.updateRoundNumber();
					game.delayx();
				}
			},
			identity_dajiang:{
				name:'大将',
				mark:true,
				intro:{
					content:'手牌上限+1'
				},
				mod:{
					maxHandcard:function(player,num){
						return num+1;
					}
				}
			},
			identity_zeishou:{
				name:'贼首',
				mark:true,
				intro:{
					content:'手牌上限-1'
				},
				mod:{
					maxHandcard:function(player,num){
						return num-1;
					}
				}
			},
			dongcha:{
				trigger:{player:'phaseBegin'},
				direct:true,
				unique:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.countCards('ej');
					});
				},
				forceunique:true,
				content:function(){
					'step 0'
					player.chooseTarget(get.prompt('dongcha'),function(card,player,target){
						return target.countCards('ej')>0;
					}).set('ai',function(target){
						var player=_status.event.player;
						var att=get.attitude(player,target);

						if(att>0){
							var js=target.getCards('j');
							if(js.length){
								var jj=js[0].viewAs?{name:js[0].viewAs}:js[0];
								if(jj.name=='guohe'||js.length>1||get.effect(target,jj,target,player)<0){
									return 2*att;
								}
							}
							if(target.getEquip('baiyin')&&target.isDamaged()&&
								get.recoverEffect(target,player,player)>0){
								if(target.hp==1&&!target.hujia) return 1.6*att;
								if(target.hp==2) return 0.01*att;
								return 0;
							}
						}
						var es=target.getCards('e');
						var noe=target.hasSkillTag('noe');
						var noe2=(es.length==1&&es[0].name=='baiyin'&&target.isDamaged());
						if(noe||noe2) return 0;
						if(att<=0&&!es.length) return 1.5*att;
						return -1.5*att;
					});
					'step 1'
					if(result.bool){
						event.target=result.targets[0];
						event.target.addExpose(0.1);
						player.logSkill('dongcha',event.target);
						game.delayx();
					}
					else{
						event.finish();
					}
					'step 2'
					if(event.target){
						player.discardPlayerCard('ej',true,event.target);
					}
				},
				group:['dongcha_begin','dongcha_log'],
				subSkill:{
					begin:{
						trigger:{global:'gameStart'},
						forced:true,
						popup:false,
						content:function(){
							var list=[];
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].identity=='fan'){
									list.push(game.players[i]);
								}
							}
							var target=list.randomGet();
							player.storage.dongcha=target;
							if(!_status.connectMode){
								if(player==game.me){
									target.setIdentity('fan');
									target.node.identity.classList.remove('guessing');
									target.fanfixed=true;
									player.line(target,'green');
									player.popup('dongcha');
								}
							}
							else{
								player.chooseControl('ok').set('dialog',[get.translation(target)+'是反贼',[[target.name],'character']]);
							}
						}
					},
					log:{
						trigger:{player:'useCard'},
						forced:true,
						popup:false,
						filter:function(event,player){
							return event.targets.length==1&&event.targets[0]==player.storage.dongcha&&event.targets[0].ai.shown<0.95;
						},
						content:function(){
							trigger.targets[0].addExpose(0.2);
						}
					}
				}
			},
			sheshen:{
				trigger:{global:'dieBefore'},
				forced:true,
				unique:true,
				forceunique:true,
				filter:function(event,player){
					return event.player==game.zhu&&player.hp>0;
				},
				logTarget:'player',
				content:function(){
					'step 0'
					trigger.player.gainMaxHp();
					'step 1'
					var dh=player.hp-trigger.player.hp;
					if(dh>0){
						trigger.player.recover(dh);
					}
					'step 2'
					var cards=player.getCards('he');
					if(cards.length){
						trigger.player.gain(cards,player);
						player.$giveAuto(cards,trigger.player);
					}
					'step 3'
					trigger.cancel();
					player.die();
				}
			}
		},
"translate": {
			zhu:"主",
			zhong:"忠",
			mingzhong:"忠",
			nei:"内",
			fan:"反",
			cai:"猜",
			cai2:"猜",
			rZhu:"主",
			rZhong:"忠",
			rNei:"内",
			rYe:"野",
			rZhu2:"主帅",
			rZhong2:"前锋",
			rNei2:"细作",
			rYe2:"野心家",
			bZhu:"主",
			bZhong:"忠",
			bNei:"内",
			bYe:"野",
			bZhu2:"主帅",
			bZhong2:"前锋",
			bNei2:"细作",
			bYe2:"野心家",
			zhu2:"主公",
			zhong2:"忠臣",
			mingzhong2:"明忠",
			nei2:"内奸",
			fan2:"反贼",
			random2:"随机",
			identity_junshi_bg:'师',
			identity_dajiang_bg:'将',
			identity_zeishou_bg:'首',
			identity_junshi:'军师',
			identity_dajiang:'大将',
			identity_zeishou:'贼首',
			ai_strategy_1:'均衡',
			ai_strategy_2:'偏反',
			ai_strategy_3:'偏主',
			ai_strategy_4:'酱油',
			ai_strategy_5:'天使',
			ai_strategy_6:'仇主',
			dongcha:'洞察',
			dongcha_info:'游戏开始时，随机一名反贼的身份对你可见；准备阶段，你可以弃置场上的一张牌',
			sheshen:'舍身',
			sheshen_info:'锁定技，主公处于濒死状态即将死亡时，令主公+1体力上限，回复体力至X点（X为你的体力值数），获得你的所有牌，然后你死亡',
			yexinbilu:'野心毕露',
		}
};
}
