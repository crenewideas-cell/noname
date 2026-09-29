// Required by 少女清瑶·望遥. Extracted from the local legacy SWD pack (GPL-3.0).
// Only definitions are installed; these cards are not added to the normal draw pile.
export const artifactNames = ["donghuangzhong","fuxiqin","kunlunjingc","xuanyuanjian","pangufu","shennongding","lianyaohu","haotianta","nvwashi","kongdongyin"];
export default function createArtifacts(lib, game, ui, get, ai, _status) {
const pack = { card: {donghuangzhong:{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				nomod:true,
				nopower:true,
				unique:true,
				skills:['donghuangzhong'],
				ai:{
					equipValue:7
				}
			},
fuxiqin:{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				skills:['kongxin'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:6
				}
			},
kunlunjingc:{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				skills:['kunlunjingc'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:6
				}
			},
xuanyuanjian:{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				nomod:true,
				nopower:true,
				unique:true,
				skills:['xuanyuanjian','xuanyuanjian2','xuanyuanjian3'],
				enable:function(card,player){
					return (player.hasSkill('xuanyuan') || player.hasSkill('ymwangyao'))||player.hp>2;
				},
				distance:{attackFrom:-2},
				onEquip:function(){
					if(!(player.hasSkill('xuanyuan') || player.hasSkill('ymwangyao'))&&player.hp<=2){
						player.discard(card);
					}
					else{
						player.changeHujia();
					}
				},
				ai:{
					equipValue:9
				}
			},
pangufu:{
				fullskin:true,
				type:'equip',
				subtype:'equip1',
				skills:['pangufu'],
				nomod:true,
				nopower:true,
				unique:true,
				distance:{attackFrom:-3},
				ai:{
					equipValue:8
				}
			},
shennongding:{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				skills:['shennongding'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:6
				}
			},
lianyaohu:{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				equipDelay:false,
				loseDelay:false,
				nomod:true,
				nopower:true,
				unique:true,
				onEquip:function(){
					player.markSkill('lianyaohu_skill');
				},
				onLose:function(){
					player.unmarkSkill('lianyaohu_skill');
				},
				clearLose:true,
				ai:{
					equipValue:6
				},
				skills:['lianhua','shouna','lianyaohu_skill']
			},
haotianta:{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				skills:['haotianta'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:7
				}
			},
nvwashi:{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				skills:['nvwashi'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:5
				}
			},
kongdongyin:{
				fullskin:true,
				type:'equip',
				subtype:'equip5',
				skills:['kongdongyin'],
				nomod:true,
				nopower:true,
				unique:true,
				ai:{
					equipValue:function(card,player){
						if(player.hp==2) return 7;
						if(player.hp==1) return 10;
						return 5;
					},
					basic:{
						equipValue:7
					}
				}
			}},
skill: {donghuangzhong:{
				trigger:{player:'phaseEnd'},
				direct:true,
				filter:function(event,player){
					return player.countCards('h',{color:'red'})>0;
				},
				content:function(){
					'step 0'
					player.chooseCardTarget({
						filterTarget:true,
						filterCard:function(card,player,event){
							if(get.color(card)!='red') return false;
							return lib.filter.cardDiscardable(card,player,event);
						},
						ai1:function(card){
							return 8-get.useful(card);
						},
						ai2:function(target){
							return -get.attitude(player,target);
						},
						prompt:get.prompt('donghuangzhong')
					});
					'step 1'
					if(result.bool){
						player.logSkill('donghuangzhong',result.targets);
						player.discard(result.cards);
						event.target=result.targets[0];
					}
					else{
						event.finish();
					}
					'step 2'
					var target=event.target;
					var list=[];
					for(var i=0;i<lib.inpile.length;i++){
						var info=lib.card[lib.inpile[i]];
						if(info.type=='delay'&&!info.cancel&&!target.hasJudge(lib.inpile[i])){
							list.push(lib.inpile[i]);
						}
					}
					if(list.length){
						var card=game.createCard(list.randomGet());
						target.addJudge(card);
						target.$draw(card);
						game.delay();
					}
				}
			},
kongxin:{
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					return player.canCompare(target);
				},
				filter:function(event,player){
					return player.countCards('h')&&game.hasPlayer(function(current){
						return player.canCompare(current);
					});
				},
				content:function(){
					"step 0"
					player.chooseToCompare(target);
					"step 1"
					if(result.bool){
						event.bool=true;
						player.chooseTarget('选择一个目标视为'+get.translation(target)+'对其使用一张杀',function(card,player,target2){
							return player!=target2&&target.canUse('sha',target2);
						}).ai=function(target2){
							return get.effect(target2,{name:'sha'},target,player);
						}
					}
					else{
						target.discardPlayerCard(player);
					}
					"step 2"
					if(event.bool&&result.bool){
						target.useCard({name:'sha'},result.targets);
					}
				},
				ai:{
					order:7,
					result:{
						target:function(player,target){
							if(player.countCards('h')<=1) return 0;
							if(get.attitude(player,target)>=0) return 0;
							if(game.hasPlayer(function(current){
								return (player!=current&&target.canUse('sha',current)&&
									get.effect(current,{name:'sha'},target,player)>0)
							})){
								return -1;
							}
							return 0;
						}
					}
				}
			},
kunlunjingc:{
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.countCards('h')>0;
				},
				delay:false,
				content:function(){
					'step 0'
					var cards=get.cards(3);
					event.cards=cards;
					player.chooseCardButton('选择一张牌',cards,true);
					'step 1'
					event.card=result.links[0];
					player.chooseCard('h',true,'用一张手牌替换'+get.translation(event.card));
					'step 2'
					if(result.bool){
						event.cards[event.cards.indexOf(event.card)]=result.cards[0];
						player.lose(result.cards,ui.special);
						var cardx=ui.create.card();
						cardx.classList.add('infohidden');
						cardx.classList.add('infoflip');
						player.$throw(cardx,1000,'nobroadcast');
					}
					else{
						event.finish();
					}
					'step 3'
					player.gain(event.card);
					player.$draw();
					for(var i=event.cards.length-1;i>=0;i--){
						event.cards[i].fix();
						ui.cardPile.insertBefore(event.cards[i],ui.cardPile.firstChild);
					}
					game.delay();
				},
				ai:{
					order:10,
					result:{
						player:1
					}
				}
			},
xuanyuanjian:{
				trigger:{player:'changeHp'},
				forced:true,
				popup:false,
				filter:function(event,player){
					return !(player.hasSkill('xuanyuan') || player.hasSkill('ymwangyao'))&&player.hp<=2
				},
				content:function(){
					var e1=player.getEquip('xuanyuanjian');
					if(e1){
						player.discard(e1);
					}
				},
				ai:{
					threaten:1.5
				}
			},
xuanyuanjian2:{
				trigger:{source:'damageBefore'},
				forced:true,
				filter:function(event){
					return event.notLink();
				},
				content:function(){
					trigger.num++;
					trigger._xuanyuanjian=true;
					if(!trigger.nature) trigger.nature='thunder';
				}
			},
xuanyuanjian3:{
				trigger:{source:'damageAfter'},
				forced:true,
				popup:false,
				filter:function(event,player){
					return event._xuanyuanjian&&!(player.hasSkill('xuanyuan') || player.hasSkill('ymwangyao'));
				},
				content:function(){
					player.loseHp();
				}
			},
pangufu:{
				trigger:{source:'damageEnd'},
				forced:true,
				priority:55,
				filter:function(event){
					if(event._notrigger.contains(event.player)) return false;
					return event.player.countCards('he')>0;
				},
				content:function(){
					trigger.player.chooseToDiscard(true,'he');
				}
			},
shennongding:{
				enable:'phaseUse',
				usable:1,
				filterCard:true,
				selectCard:2,
				check:function(card){
					if(get.tag(card,'recover')>=1) return 0;
					return 7-get.value(card);
				},
				filter:function(event,player){
					return player.hp<player.maxHp&&player.countCards('h')>=2;
				},
				content:function(){
					player.recover();
				},
				ai:{
					result:{
						player:function(player){
							return get.recoverEffect(player);
						}
					},
					order:2.5
				}
			},
lianyaohu_skill:{
				mark:true,
				intro:{
					content:function(storage,player){
						var card=player.getEquip('lianyaohu');
						if(card&&card.storage.shouna&&card.storage.shouna.length){
							return '共有'+get.cnNumber(card.storage.shouna.length)+'张牌';
						}
						return '共有〇张牌';
					},
					mark:function(dialog,storage,player){
						var card=player.getEquip('lianyaohu');
						if(card&&card.storage.shouna&&card.storage.shouna.length){
							dialog.addAuto(card.storage.shouna);
						}
						else{
							return '共有〇张牌';
						}
					},
					markcount:function(storage,player){
						var card=player.getEquip('lianyaohu');
						if(card&&card.storage.shouna) return card.storage.shouna.length;
						return 0;
					}
				}
			},
lianhua:{
				enable:'phaseUse',
				filter:function(event,player){
					var hu=player.getEquip('lianyaohu');
					if(hu&&hu.storage.shouna&&hu.storage.shouna.length>1){
						return true;
					}
					return false;
				},
				usable:1,
				delay:false,
				content:function(){
					"step 0"
					event.hu=player.getEquip('lianyaohu');
					player.chooseCardButton('弃置两张壶中的牌，然后从牌堆中获得一张类别不同的牌',2,event.hu.storage.shouna).ai=function(){
						return 1;
					}
					"step 1"
					if(result.bool){
						var type=[];
						player.$throw(result.links);
						game.log(player,'弃置了',result.links);
						for(var i=0;i<result.links.length;i++){
							event.hu.storage.shouna.remove(result.links[i]);
							result.links[i].discard();
							type.add(get.type(result.links[i],'trick'));
						}
						for(var i=0;i<ui.cardPile.childNodes.length;i++){
							if(!type.contains(get.type(ui.cardPile.childNodes[i],'trick'))){
								player.gain(ui.cardPile.childNodes[i],'gain');
								break;
							}
						}
					}
					else{
						player.getStat('skill').lianhua--;
					}
				},
				ai:{
					order:11,
					result:{
						player:1
					}
				}
			},
shouna:{
				enable:'phaseUse',
				filter:function(event,player){
					return player.countCards('h')>0;
				},
				usable:1,
				filterCard:true,
				check:function(card){
					return 6-get.value(card);
				},
				filterTarget:function(card,player,target){
					return target!=player&&target.countCards('h')>0;
				},
				content:function(){
					'step 0'
					var card=target.getCards('h').randomGet();
					var hu=player.getEquip('lianyaohu');
					if(card&&hu){
						if(!hu.storage.shouna){
							hu.storage.shouna=[];
						}
						target.$give(card,player);
						target.lose(card,ui.special);
						event.card=card;
						event.hu=hu;
					}
					'step 1'
					if(!event.card.destroyed){
						event.hu.storage.shouna.push(event.card);
						player.updateMarks();
					}
				},
				ai:{
					order:5,
					result:{
						target:function(player,target){
							return -1/Math.sqrt(1+target.countCards('h'));
						}
					}
				}
			},
haotianta:{
				trigger:{global:'judgeBefore'},
				direct:true,
				content:function(){
					"step 0"
					event.cards=get.cards(2);
					player.chooseCardButton(true,event.cards,'昊天塔：选择一张牌作为'+get.translation(trigger.player)+'的'+trigger.judgestr+'判定结果').ai=function(button){
						if(get.attitude(player,trigger.player)>0){
							return 1+trigger.judge(button.link);
						}
						if(get.attitude(player,trigger.player)<0){
							return 1-trigger.judge(button.link);
						}
						return 0;
					};
					"step 1"
					if(!result.bool){
						event.finish();
						return;
					}
					player.logSkill('haotianta',trigger.player);
					var card=result.links[0];
					event.cards.remove(card);
					var judgestr=get.translation(trigger.player)+'的'+trigger.judgestr+'判定';
					event.videoId=lib.status.videoId++;
					event.dialog=ui.create.dialog(judgestr);
					event.dialog.classList.add('center');
					event.dialog.videoId=event.videoId;

					game.addVideo('judge1',player,[get.cardInfo(card),judgestr,event.videoId]);
					for(var i=0;i<event.cards.length;i++) event.cards[i].discard();
					// var node=card.copy('thrown','center',ui.arena).animate('start');
					var node;
					if(game.chess){
						node=card.copy('thrown','center',ui.arena).animate('start');
					}
					else{
						node=player.$throwordered(card.copy(),true);
					}
					node.classList.add('thrownhighlight');
					ui.arena.classList.add('thrownhighlight');
					if(card){
						trigger.cancel();
						trigger.result={
							card:card,
							judge:trigger.judge(card),
							node:node,
							number:get.number(card),
							suit:get.suit(card),
							color:get.color(card),
						};
						if(trigger.result.judge>0){
							trigger.result.bool=true;
							trigger.player.popup('洗具');
						}
						if(trigger.result.judge<0){
							trigger.result.bool=false;
							trigger.player.popup('杯具');
						}
						game.log(trigger.player,'的判定结果为',card);
						trigger.direct=true;
						trigger.position.appendChild(card);
						game.delay(2);
					}
					else{
						event.finish();
					}
					"step 2"
					ui.arena.classList.remove('thrownhighlight');
					event.dialog.close();
					game.addVideo('judge2',null,event.videoId);
					ui.clear();
					var card=trigger.result.card;
					trigger.position.appendChild(card);
					trigger.result.node.delete();
					game.delay();
				},
				ai:{
					tag:{
						rejudge:1
					}
				}
			},
nvwashi:{
				trigger:{global:'dying'},
				priority:6,
				filter:function(event,player){
					return event.player.hp<=0&&player.hp>1;
				},
				check:function(event,player){
					return get.attitude(player,event.player)>=3&&!event.player.hasSkillTag('nosave');
				},
				logTarget:'player',
				content:function(){
					"step 0"
					trigger.player.recover();
					"step 1"
					player.loseHp();
				},
				ai:{
					threaten:1.2,
					expose:0.2
				}
			},
kongdongyin:{
				trigger:{player:'dieBefore'},
				forced:true,
				filter:function(event,player){
					return player.maxHp>0;
				},
				content:function(){
					trigger.cancel();
					player.hp=1;
					player.draw();
					player.discard(player.getCards('e',{subtype:'equip5'}));
					game.delay();
				}
			}},
translate: {donghuangzhong:'东皇钟',
xuanyuanjian:'轩辕剑',
xuanyuanjian2:'轩辕剑',
pangufu:'盘古斧',
lianyaohu:'炼妖壶',
lianyaohu_skill:'炼妖壶',
lianyaohu_skill_bg:'壶',
haotianta:'昊天塔',
fuxiqin:'伏羲琴',
shennongding:'神农鼎',
kongdongyin:'崆峒印',
kunlunjingc:'昆仑镜',
nvwashi:'女娲石',
donghuangzhong_bg:'钟',
lianyaohu_bg:'壶',
haotianta_bg:'塔',
fuxiqin_bg:'琴',
shennongding_bg:'鼎',
kongdongyin_bg:'印',
kunlunjingc_bg:'镜',
nvwashi_bg:'石',
kongxin:'控心',
lianhua:'炼化',
lianhua_info:'出牌阶段限一次，你可以弃置两张炼妖壶中的牌，从牌堆中获得一张与弃置的牌类别均不相同的牌',
shouna:'收纳',
shouna_info:'出牌阶段限一次，你可以弃置一张手牌，并将一名其他角色的一张手牌置入炼妖壶',
donghuangzhong_info:'结束阶段，你可以弃置一张红色手牌，并选择一名角色将一张随机单体延时锦囊置入其判定区',
xuanyuanjian_info:'装备时获得一点护甲；每当你即将造成一次伤害，你令此伤害加一并变为雷属性，并在伤害结算后流失一点体力。任何时候，若你体力值不超过2，则立即失去轩辕剑',
pangufu_info:'锁定技，每当你造成一次伤害，受伤角色须弃置一张牌',
haotianta_info:'锁定技，任意一名角色进行判定前，你观看牌堆顶的2张牌，并选择一张作为判定结果，此结果不可被更改，也不能触发技能',
shennongding_info:'出牌阶段，你可以弃置两张手牌，然后回复一点体力。每阶段限一次',
kongdongyin_info:'令你抵挡一次死亡，将体力回复至1，并摸一张牌，发动后进入弃牌堆',
kunlunjingc_info:'出牌阶段限一次，你可以观看牌堆顶的三张牌，然后用一张手牌替换其中的一张',
nvwashi_info:'当一名角色濒死时，若你的体力值大于1，你可以失去一点体力并令其回复一点体力',
kongxin_info:'出牌阶段限一次，你可以与一名其他角色进行拼点，若你赢，你可以指定另一名角色视为对方对该角色使用一张杀，否则对方可弃置你一张牌',
fuxiqin_info:'出牌阶段限一次，你可以与一名其他角色进行拼点，若你赢，你可以指定另一名角色视为对方对该角色使用一张杀，否则对方可弃置你一张牌',
lianyaohu_info:'出牌阶段各限一次，你可以选择一项：1.弃置一张手牌，并将一名其他角色的一张手牌置入炼妖壶；2.弃置两张炼妖壶中的牌，从牌堆中获得一张与弃置的牌类别均不相同的牌'}, list: [] };
for (const id of artifactNames) {
    pack.card[id].image = `ext:清瑶葭绮/members/假装无敌/artifacts/${id}.png`;
    pack.card[id].qingyaoXian = true;
    pack.card[id].derivation = "qy_qyshaonvqingyao";
}
return pack;
}
