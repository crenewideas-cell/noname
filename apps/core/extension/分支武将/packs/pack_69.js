// Extracted from mode/single.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"skill": {
			manyi:{
				audio:2,
				trigger:{target:'useCardToBefore'},
				forced:true,
				filter:function(event,player){
					return event.card.name=='nanman';
				},
				content:function(){
					trigger.cancel();
				},
				ai:{
					effect:{
						target:function(card){
							if(card.name=='nanman') return 'zerotarget';
						},
					},
				},
				group:'manyi2',
			},
			manyi2:{
				trigger:{
					player:'enterGame',
					global:'gameDrawAfter',
				},
				direct:true,
				content:function(){
					player.chooseUseTarget('nanman',get.prompt('manyi'),'视为使用一张【南蛮入侵】').logSkill='manyi';
				},
			},
			wanrong:{
				audio:2,
				trigger:{target:'useCardToTargeted'},
				frequent:true,
				filter:function(event,player){
					return event.card.name=='sha';
				},
				content:function(){
					player.draw();
				},
			},
			sgzhiheng:{
				audio:'zhiheng',
				inherit:'zhiheng',
				selectCard:[1,2],
				prompt:'弃置至多两张牌并摸等量的牌',
			},
			xiechan:{
				audio:2,
				limited:true,
				enable:'phaseUse',
				skillAnimation:true,
				animationColor:'water',
				filterTarget:function(card,player,target){
					return target!=player&&player.canCompare(target);
				},
				content:function(){
					'step 0'
					player.awakenSkill('xiechan');
					player.chooseToCompare(target);
					'step 1'
					if(result.bool) player.useCard({name:'juedou'},target,'noai');
					else target.useCard({name:'juedou'},player,'noai');
				},
				ai:{
					order:1,
					result:{
						target:function(player,target){
							if(player.countCards('h',function(card){
								return get.value(card)<=5&&get.number(card)>=12;
							})&&get.effect(target,{name:'juedou'},player,player)>0) return -1;
							return 0;
						},
					},
				},
			},
			huwei:{
				audio:2,
				trigger:{
					player:'enterGame',
					global:'gameDrawAfter',
				},
				direct:true,
				content:function(){
					player.chooseUseTarget('shuiyanqijunx',get.prompt('huwei'),'视为使用一张【水淹七军】').logSkill='huwei';
				},
			},
			sgkuanggu:{
				audio:'kuanggu',
				trigger:{source:'damageSource'},
				frequent:true,
				filter:function(event,player){
					return player.isDamaged();
				},
				content:function(){
					'step 0'
					player.judge(function(result){
						return get.color(result)=='black'?2:-2;
					});
					'step 1'
					if(result.bool==true) player.recover();
				},
			},
			suzi:{
				inherit:'xingshang',
			},
			cangji:{
				trigger:{player:'die'},
				filter:function(event,player){
					return player.countCards('e')>0;
				},
				forceDie:true,
				skillAnimation:true,
				animationColor:'orange',
				content:function(){
					var cards=player.getCards('e');
					player.cangji_yozuru=cards;
					player.lose(cards,ui.special);
					player.addSkill('cangji_yozuru');
				},
				subSkill:{
					yozuru:{
						sub:true,
						charlotte:true,
						superCharlotte:true,
						trigger:{player:'enterGame'},
						forced:true,
						popup:false,
						//onremove:true,
						content:function(){
							var cards=player.cangji_yozuru.slice(0);
							for(var i=0;i<cards.length;i++){
								player.equip(cards[i]);
							}
							player.removeSkill('cangji_yozuru');
							delete player.cangji_yozuru;
						},
					},
				},
			},
			sgrenwang:{
				audio:2,
				trigger:{target:'useCardToTargeted'},
				direct:true,
				filter:function(event,player){
					return event.player!=player&&event.player.isPhaseUsing()&&(event.card.name=='sha'||get.type(event.card)=='trick');
				},
				content:function(){
					if(!player.hasSkill('sgrenwang_one')) player.addTempSkill('sgrenwang_one','phaseUseEnd');
					else if(trigger.player.countDiscardableCards(player,'he')){
						player.discardPlayerCard(trigger.player,'he',get.prompt('sgrenwang')).logSkill=['sgrenwang',trigger.player];
					}
				},
			},
			sgrenwang_one:{},
			sgduanliang:{
				group:'sgduanliang_gdm',
				audio:'duanliang1',
				enable:'chooseToUse',
				filterCard:function(card){
					if(get.type(card)!='basic'&&get.type(card)!='equip') return false;
					return get.color(card)=='black';
				},
				filter:function(event,player){
					return player.hasSkill('sgduanliang_sss')&&player.countCards('he',{type:['basic','equip'],color:'black'})
				},
				position:'he',
				viewAs:{name:'bingliang'},
				prompt:'将一黑色的基本牌或装备牌当兵粮寸断使用',
				check:function(card){return 6-get.value(card)},
				ai:{
					order:9
				},
				subSkill:{
					gdm:{
						trigger:{player:'useCardToPlayered'},
						forced:true,
						silent:true,
						popup:false,
						content:function(){
							if(trigger.target!=player) player.addTempSkill('sgduanliang_sss');
						},
					},
					sss:{},
				},
			},
			sgqingguo:{
				audio:'qingguo',
				enable:['chooseToRespond','chooseToUse'],
				filterCard:true,
				viewAs:{name:'shan'},
				viewAsFilter:function(player){
					if(!player.countCards('e')) return false;
				},
				prompt:'将一张装备区中的牌当闪使用或打出',
				position:'e',
				check:function(){return 1},
				ai:{
					order:0.5,
					respondShan:true,
					skillTagFilter:function(player){
						if(!player.countCards('e')) return false;
					},
					effect:{
						target:function(card,player,target,current){
							if(target.countCards('e')&&get.tag(card,'respondShan')&&current<0) return 0.6
						}
					}
				}
			},
			pianyi:{
				audio:2,
				trigger:{player:'enterGame'},
				forced:true,
				filter:function(event,player){
					return event.getParent('phase').player==player.enemy;
				},
				content:function(){
					var evt=_status.event.getParent('phase');
					if(evt){
						game.log(player,'结束了',evt.player,'的回合');
						game.resetSkills();
						_status.event=evt;
						_status.event.finish();
						_status.event.untrigger(true);
					}
				},
			},
			yinli:{
				audio:2,
				trigger:{global:'loseEnd'},
				filter:function(event,player){
					if(event.player==player||event.player!=_status.currentPhase||event.getParent().name=='useCard') return false;
					for(var i=0;i<event.cards.length;i++){
						if(get.type(event.cards[i])=='equip'&&get.position(event.cards[i])=='d') return true;
					}
					return false;
				},
				frequent:true,
				content:function(){
					var list=[];
					for(var i=0;i<trigger.cards.length;i++){
						if(get.type(trigger.cards[i])=='equip'&&get.position(trigger.cards[i])=='d') list.push(trigger.cards[i]);
					}
					if(list.length) player.gain(list,'gain2');
				},
			},
			shenju:{
				audio:2,
				mod:{
					maxHandcard:function(player,num){
						if(player.enemy&&player.enemy.hp) return num+player.enemy.hp;
					}
				},
			},
			
			_changeHandcard:{
				trigger:{global:'gameDrawAfter'},
				silent:true,
				popup:false,
				filter:function(event,player){
					return _status.mode=='changban'&&player.maxHp<=3;
				},
				content:function(){
					'step 0'
					player.chooseBool('是否更换手牌？').ai=function(){
						var hs=player.getCards('h');
						return get.value(hs,'raw')<6*hs;
					};
					'step 1'
					if(result.bool){
						var hs=player.getCards('h');
						player.lose(hs,ui.special);
						event.hs=hs;
					}
					else event.finish();
					'step 2'
					var hs=event.hs;
					player.draw(hs.length,'nodelay');
					for(var i=0;i<hs.length;i++){
						hs[i].fix();
						ui.cardPile.insertBefore(hs[i],ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
					}
				},
			},
		},
"translate": {
			zhu:"先",
			fan:"后",
			zhu2:"先手",
			fan2:"后手",
			normal2:'新1v1',
			changban2:'血战长坂坡',
			dianjiang2:'点将单挑',
			
			manyi:'蛮裔',
			manyi_info:'锁定技，【南蛮入侵】对你无效。当你登场时，你可以视为使用一张【南蛮入侵】。',
			wanrong:'婉容',
			wanrong_info:'当你成为【杀】的目标后，你可以摸一张牌。',
			sgzhiheng:'制衡',
			sgzhiheng_info:'出牌阶段限一次，你可以弃置至多两张牌，然后摸等量的牌。',
			xiechan:'挟缠',
			xiechan_info:'限定技，出牌阶段，你可以和对手拼点。若你赢/没赢，你/其视为对其/你使用一张【决斗】。',
			huwei:'虎威',
			huwei_info:'当你登场时，你可以视为使用一张【水淹七军】。',
			sgkuanggu:'狂骨',
			sgkuanggu_info:'当你造成伤害后，若你已受伤，你可以进行判定：若结果为黑色，你回复1点体力。',
			suzi:'肃资',
			cangji:'藏机',
			cangji_info:'当你死亡时，你可以将装备区内的所有牌移动到游戏外。若如此做，你的下一名角色登场时，你将这些牌置入你的装备区。',
			sgrenwang:'仁望',
			sgrenwang_info:'当你于一名其他角色的出牌阶段内成为该角色使用的【杀】或普通锦囊牌的目标后，若此牌不是其本阶段内对你使用的第一张【杀】或普通锦囊牌，则你可以弃置该角色的一张牌。',
			sgduanliang:'断粮',
			sgduanliang_info:'出牌阶段，若你本回合内使用牌指定过其他角色为目标，则你可以将一张黑色基本牌或装备牌当做【兵粮寸断】使用。',
			sgqingguo:'倾国',
			sgqingguo_info:'你可以将一张装备区内的牌当做【闪】使用或打出。',
			pianyi:'翩仪',
			pianyi_info:'锁定技，当你于对手的回合内登场时，你结束此回合。',
			yinli:'姻礼',
			yinli_info:'其他角色的装备牌于其回合内进入弃牌堆后，你可以获得之。',
			shenju:'慎拒',
			shenju_info:'锁定技，你的手牌上限+X（X为你对手的体力值）。',
		}
};
}
