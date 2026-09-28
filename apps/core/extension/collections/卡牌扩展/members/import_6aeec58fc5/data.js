// Generated from 虚实篇.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
					card:{
						zou_cxy:{
							fullimage:true,
							type:"basic",
							selectTarget:-1,
							filterTarget:function(card,player,target){
								return target==player;
							},
							global:["zou_skill"],
							content:function(){}, 
							ai:{
								useful:7,
								value:7,
								result:{
									player:1
								},
							},
						},
						liang_cxy:{
							fullimage:true,
							type:"basic",
							selectTarget:-1,
							filterTarget:function(card,player,target){
								return target==player;
							},
							global:["liang_skill"],
							content:function(){},
							ai:{
								useful:1,
								value:function(player){
									return 1 + player.num('h') - player.getHandcardLimit();
								},
								result:{
									player:1,
									target:1,
								},
							},
						},
						jin_cxy:{
							fullimage:true,
							type:"basic",
							selectTarget:1,
							global:["jin_skill"],
							content:function(){},
							ai:{
								useful:10,
								value:10,
							},
						},
						diaobingqianjiang_cxy:{
							fullimage:true,
							type:"trick",
							enable:true,
							selectTarget:-1,
							filterTarget:function(card,player,target){
								return true;
							},
							contentBefore:function(){
								game.delay();
								var cards=get.cards(game.countPlayer()%2==0?game.countPlayer()/2:(game.countPlayer()-1)/2);
								var dialog=ui.create.dialog('调兵遣将',cards,true);
								_status.dieClose.push(dialog);
								dialog.videoId=lib.status.videoId++;
								game.addVideo('cardDialog',null,['调兵遣将',get.cardsInfo(cards),dialog.videoId]);
								event.getParent().preResult=dialog.videoId;
							},
							content:function(){
								"step 0"
								for(var i=0;i<ui.dialogs.length;i++){
									if(ui.dialogs[i].videoId==event.preResult){
										event.dialog=ui.dialogs[i];break;
									}
								}
								if(!event.dialog||!target.countCards('h')){
									event.finish();
									return;
								}
								var minValue=20;
								var hs=target.getCards('h');
								for(var i=0;i<hs.length;i++){
									minValue=Math.min(minValue,get.value(hs[i],target));
								}
								if(target.isUnderControl(true)){
									event.dialog.setCaption('选择一张牌并用一张手牌替换之');
								}
								var next=target.chooseButton(function(button){
									return get.value(button.link,_status.event.player)-minValue;
								});
								next.set('dialog',event.preResult);
								next.set('closeDialog',false);
								next.set('dialogdisplay',true);
								"step 1"
								event.dialog.setCaption('调兵遣将');
								if(result.bool){
									event.button=result.buttons[0];
									target.chooseCard('用一张牌牌替换'+get.translation(result.links),true).ai=function(card){
										return -get.value(card);
									}
								}
								else{
									target.popup('不换');
									event.finish();
								}
								"step 2"
								if(result.bool){
									target.lose(result.cards,ui.special);
									target.$throw(result.cards);

									game.log(target,'用',result.cards,'替换了',event.button.link);
									target.gain(event.button.link);
									target.$gain2(event.button.link);
									event.dialog.buttons.remove(event.button);
									event.dialog.buttons.push(ui.create.button(result.cards[0],'card',event.button.parentNode));
									event.button.remove();
								}
								"step 3"
								game.delay(2);
							},
							contentAfter:function(){
								'step 0'
								event.dialog=get.idDialog(event.preResult);
								if(!event.dialog){
									event.finish();
									return;
								}
								var nextSeat=_status.currentPhase.next;
								var att=get.attitude(player,nextSeat);
								if(player.isUnderControl(true)&&!_status.auto){
									event.dialog.setCaption('将任意张牌以任意顺序置于牌堆顶（先选择的在上）');
								}
								var next=player.chooseButton([1,event.dialog.buttons.length],event.dialog);
								next.ai=function(button){
									if(att>0){
										return get.value(button.link,nextSeat)-5;
									}
									else{
										return 5-get.value(button.link,nextSeat);
									}
								}
								next.set('closeDialog',false);
								next.set('dialogdisplay',true);
								'step 1'
								if(result&&result.bool&&result.links&&result.links.length){
									for(var i=0;i<result.buttons.length;i++){
										event.dialog.buttons.remove(result.buttons[i]);
									}
									var cards=result.links.slice(0);
									while(cards.length){
										ui.cardPile.insertBefore(cards.pop(),ui.cardPile.firstChild);
									}
									game.log(player,'将'+get.cnNumber(result.links.length)+'张牌置于牌堆顶');
								}
								for(var i=0;i<event.dialog.buttons.length;i++){
									ui.discardPile.appendChild(event.dialog.buttons[i].link);
								}
								'step 2'
								var dialog=event.dialog;
								dialog.close();
								_status.dieClose.remove(dialog);
								game.addVideo('cardDialog',null,event.preResult);
							},
							ai:{
								wuxie:function(){
									return 0;
								},
								basic:{
									order:2,
									useful:[3,1],
									value:[5,1]
								},
								result:{
									player:1,
									target:function(player,target){
										if(target.countCards('h')==0) return 0;
										return (Math.sqrt(target.countCards('h'))-get.distance(player,target,'absolute')/game.countPlayer()/3)/2;
									}
								},
								tag:{
									loseCard:1,
									multitarget:1
								}
							}
						},
						yuqinguzong_cxy:{
							fullimage:true,
							type:"trick",
							enable:true,
							selectTarget:1,
							filterTarget:function(card,player,target){
								return target!=player;
							},
							content:function(){
								"step 0"
								target.draw();
								"step 1"
								var list = [
									["锦囊","","guohe"],
									["锦囊","","juedou"],
									["锦囊","","huogong"],
								];
								var next = player.chooseButton(["欲擒故纵：选择以下一张锦囊，视为对"+get.translation(target)+"使用",[list,'vcard']],true);
								next.filterButton=function(button){
									return player.canUse({name:button.link[2]},target);
								};
								next.ai = function(button){
									if(button.link[2]=="huogong"){
										return Math.max(1,get.effect(target,{name:button.link[2]},player,player));
									}
									return get.effect(target,{name:button.link[2]},player,player);
								};
								"step 2"
								player.useCard({name:result.links[0][2]},target);
							},
							ai:{
								basic:{
									order:8,
									useful:1,
									value:4,
								},
								result:{
									target:function(player,target){
										if(get.attitude(player,target)>2)return 1;
										var maxEffect = 0;
										maxEffect = Math.max(maxEffect,get.effect(target,{name:"guohe"},player,player));
										maxEffect = Math.max(maxEffect,get.effect(target,{name:"juedou"},player,player));
										maxEffect = Math.max(maxEffect,get.effect(target,{name:"huogong"},player,player));
										return maxEffect - 1.5;
									}
								},
							},
						},
						youdishenru_cxy:{
							fullimage:true,
							type:"trick",
							global:["youdishenru_skill"],
							ai:{
								value:[5,1],
								useful:[5,1],
								order:1,
								wuxie:function(target,card,player,current,state){
									return -state*get.attitude(player,current);
								},
								result:{
									player:function(player){
										if(_status.event.parent.youdiinfo&&
											get.attitude(player,_status.event.parent.youdiinfo.source)<=0){
											return 1;
										}
										return 0;
									}
								}
							},
						},
						shuiyanqijun_cxy:{
							fullimage:true,
							type:'trick',
							enable:true,
							selectTarget:-1,
							filterTarget:function(card,player,target){
								return target!=player;
							},
							contentBefore:function(){
								"step 0"
								if(player.num('h')){
									player.chooseCard("水淹七军：请展示一张手牌",true).ai=function(event,player){
										if(get.type(card)=="trick"||get.type(card)=="delay")return 10;
										if(get.type(card)=="equip")return 8;
										return 2;
									};
								}
								else {
									event.finish();
								}
								"step 1"
								player.showCards(result.cards);
								switch(get.type(result.cards[0])){
									case "trick":
									case "delay":
										lib.storage.nowType = ["trick","delay"];
										break;
									default:
										lib.storage.nowType = [get.type(result.cards[0])];
										break;
								}
							},
							content:function(){
								"step 0"
								var PLAYER = player;
								if(lib.storage.nowType){
									target.chooseToDiscard("水淹七军：弃置一张同类别的牌或受1点伤害",function(card){
										return lib.storage.nowType.contains(get.type(card));
									}).ai=function(card){
										if(player.hp==1)return 10 - get.value(card);
										if(get.damageEffect(player,PLAYER,player)>0)return 0;
										return 6 - get.value(card);
									};
								}
								else {
									event.finish();
								}
								"step 1"
								if(!result.bool){
									target.damage(player);
								}
							},
							contentAfter:function(){
								delete lib.storage.nowType;
							},
							ai:{
								basic:{
									order:5,
									useful:1,
									value:5,
								},
								result:{
									target:-1.5,
								},
								tag:{
									damage:1,
								},
							},
						},
						caochuanjiejian_cxy:{
							fullimage:true,
							type:"trick",
							enable:true,
							selectTarget:1,
							filterTarget:function(card,player,target){
								return target!=player&&target.num('h');
							},
							content:function(){
								"step 0"
								var PLAYER = player;
								target.chooseCard("草船借箭：交给"+get.translation(player)+"一张杀(若未火杀则其受到你一点火属性伤害)或展示所有手牌并被弃置一张",'h',{name:"sha"}).ai=function(card){
									if(get.attitude(player,PLAYER)>2){
										if(card.nature=='fire'){
											return get.damageEffect(PLAYER,player,player,"fire")>0?2.5:0;
										}
										return 2;
									}
									else {
										if(card.nature=='fire'){
											return get.damageEffect(PLAYER,player,player,"fire")>0?2.5:0;
										}
										return player.countCards('h',function(card){
											return get.value(card)>7;
										})?0:2;
									}
								};
								"step 1"
								if(result.bool){
									target.$give(result.cards[0],player);
									player.gain(result.cards[0],target);
									if(result.cards[0].nature=='fire'){
										target.line(player,"fire");
										player.damage("fire",target);
									}
									event.finish();
								}
								else {
									target.showHandcards();
								}
								"step 2"
								player.chooseCardButton("弃置"+get.translation(target)+"的一张手牌",target.getCards('h'),true).ai=function(button){
									return get.attitude(player,target)>2?10-get.value(card):get.value(card);
								};
								"step 3"
								target.discard(result.links[0]);
							},
							ai:{
								basic:{
									order:9.5,
									useful:4.5,
									value:4,
								},
								result:{
									player:1,
									target:-1,
								},
							},
						},
						wangmeizhike_cxy:{
							fullimage:true,
							type:"trick",
							enable:true,
							selectTarget:1,
							filterTarget:true,
							content:function(){
								"step 0"
								if(!game.hasPlayer(function(current){
									return current.num('h')<target.num('h');
								})){
									target.draw(2);
								}
								"step 1"
								if(!game.hasPlayer(function(current){
									return current.hp<target.hp;
								})){
									target.recover();
								}
							},
							ai:{
								basic:{
									order:1,
									useful:6.5,
									value:6.5,
								},
								result:{
									target:function(player,target){
										var card = game.hasPlayer(function(current){
											return current.num('h')<target.num('h');
										})?0:2;
										var hp = game.hasPlayer(function(current){
											return current.hp<target.hp;
										})?0:2;
										return card + hp;
									}
								},
							},
						},
						yangjingxurui_cxy:{
							fullimage:true,
							type:"delay",
							enable:true,
							selectTarget:1,
							filterTarget:function(card,player,target){
								return (lib.filter.judge(card,player,target)&&player!=target);
							},
							judge:function(card){
								return get.suit(card)=='diamond'?0:2;
							},
							effect:function(){
								if(result.bool){
									player.skip("phaseDiscard");
									player.storage.yangjingxurui_card = card;
									player.addSkill("yanjingxurui_skill");
								}
							},
							ai:{
								basic:{
									order:2,
									useful:1,
									value:1,
								},
								result:{
									target:1,
								},
							},
						},
						baihu_cxy:{
							fullimage:true,
							type:"equip",
							subtype:"equip3",
							distance:{globalTo:2},
							ai:{
								basic:{
									equipValue:10,
								}
							},
						},
						huxinjing_cxy:{
							fullimage:true,
							type:"equip",
							subtype:"equip2",
							onLose:function(){
								player.draw();
							},
							skills:['huxinjingc_skill'],
							ai:{
								basic:{
									equipValue:6.5,
								}
							},
						},
						riyueji_cxy:{
							fullimage:true,
							type:"equip",
							subtype:"equip1",
							distance:{attackFrom:-1},
							skills:['riyueji_skill'],
							ai:{
								basic:{
									equipValue:2,
								}
							},
						},
						nanmanzhanxiang_cxy:{
							fullimage:true,
							type:"equip",
							subtype:"equip4",
							distance:{globalfrom:1},
							skills:['nanmanzhanxiang_skill'],
							ai:{
								basic:{
									equipValue:5,
								}
							},
						},
						fashiche_cxy:{
							fullimage:true,
							type:"equip",
							subtype:"equip1",
							distance:{attackFrom:-6},
							skills:['fashiche_skill'],
							ai:{
								basic:{
									equipValue:5,
								}
							},
						},
						liannuzhanche_cxy:{
							fullimage:true,
							type:"equip",
							subtype:"equip5",
							skills:['liannuzhanche_skill'],
							ai:{
								basic:{
									equipValue:7,
								}
							},
						},
					},
					translate:{
						zou_cxy:"走",
						liang_cxy:"粮",
						jin_cxy:"金",
						dusha:"毒杀",
						diaobingqianjiang_cxy:"调兵遣将",
						yuqinguzong_cxy:"欲擒故纵",
						youdishenru_cxy:"诱敌深入",
						shuiyanqijun_cxy:"水淹七军",
						caochuanjiejian_cxy:"草船借箭",
						wangmeizhike_cxy:"望梅止渴",
						yangjingxurui_cxy:"养精蓄锐",
						baihu_cxy:"白鹄",
						huxinjing_cxy:"护心镜",
						riyueji_cxy:"日月戟",
						nanmanzhanxiang_cxy:"南蛮战象",
						fashiche_cxy:"发石车",
						liannuzhanche_cxy:"连弩战车",
						"liannuzhanche_cxy_info":"锁定技，你计算与其他角色的距离时视为1；你的防御距离+1；出牌阶段，你使用杀的次数限制+1。",
						"fashiche_cxy_info":"锁定技，当你使用杀指定一名角色为目标时，令你攻击范围内的其他角色也成为此杀的目标。",
						"nanmanzhanxiang_cxy_info":"你的进攻距离+1；锁定技，南蛮入侵对你无效。",
						"riyueji_cxy_info":"当你受到伤害后，你可以防止此伤害，然后弃置此装备。锁定技，当你失去装备区的护心镜时，你摸一张牌。",
						"huxinjing_cxy_info":"当你受到伤害后，你可以防止此伤害，然后弃置此装备。锁定技，当你失去装备区的护心镜时，你摸一张牌。",
						"baihu_cxy_info":"你的防御距离+2",
						"yangjingxurui_cxy_info":"出牌阶段，对一名其他角色使用。若判定结果不为方片，目标角色跳过弃牌阶段，并于此阶段结束时将此牌置入判定区。",
						"wangmeizhike_cxy_info":"出牌阶段，对一名角色使用。若目标角色是手牌最少的角色，该角色摸两张牌。若目标角色为体力值最少的角色，该角色回复1点体力。",
						"caochuanjiejian_cxy_info":"出牌阶段，对有手牌的一名其他角色使用。目标角色选择一项：1.交给你一张杀(若为火杀，则其对你造成1点火属性伤害)；2.展示所有手牌，并令你弃置其中一张牌。",
						"shuiyanqijun_cxy_info":"出牌阶段，对所有其他角色使用。你展示一张手牌，目标角色需弃置一张与此牌类别相同的牌，否则受到1点伤害。",
						"youdishenru_cxy_info":"每当以你为目标的杀生效后，使用此牌令此杀失效。然后此杀的使用者选择一项：1.对你使用一张杀(若未造成伤害则重复此流程)；2.受到你造成的1点伤害。",
						"yuqinguzong_cxy_info":"出牌阶段，对一名其他角色使用。目标角色摸一张牌，然后你选择视为对其使用一张：过河拆桥、决斗或火攻。",
						"diaobingqianjiang_cxy_info":"出牌阶段，对所有角色使用。你亮出牌堆顶的x张牌(x为存活人数的一半，向下取整)。每名角色可以用一张手牌替换其中的一张牌。执行完毕后，你可以将其中任意张牌以任意顺序置于牌堆顶，然后弃置其余的牌。",
						"jin_cxy_info":"当你受到伤害时，对伤害来源使用。目标角色获得此牌，然后你防止此伤害。",
						"liang_cxy_info":"弃牌阶段开始时，对你使用。目标角色摸一张牌并跳过弃牌阶段。",
						"zou_cxy_info":"每当你成为杀或普通锦囊牌的目标后，对你使用。目标角色展示所有手牌，然后此牌对该角色无效。",
					},
					list:[
						["diamond",1,"liang_cxy"],
						["diamond",2,"jin_cxy"],
						["diamond",3,"shan"],
						["diamond",4,"diaobingqianjiang_cxy"],
						["diamond",5,"baihu_cxy"],
						["diamond",6,"zou_cxy"],
						["diamond",7,"yuqinguzong_cxy"],
						["diamond",8,"yuqinguzong_cxy"],
						["diamond",9,"sha"],
						["diamond",10,"liang_cxy"],
						["diamond",11,"shan"],
						["diamond",12,"sanjian"],
						["diamond",13,"caochuanjiejian_cxy"],
						["heart",1,"huxinjing_cxy"],
						["heart",2,"jin_cxy"],
						["heart",3,"zou_cxy"],
						["heart",4,"diaobingqianjiang_cxy"],
						["heart",5,"tao"],
						["heart",6,"shan"],
						["heart",7,"tao"],
						["heart",8,"yuqinguzong_cxy"],
						["heart",9,"sha","poison"],
						["heart",10,"liang_cxy"],
						["heart",11,"yangjingxurui_cxy"],
						["heart",12,"wuxie"],
						["heart",13,"riyueji_cxy"],
						["club",1,"shuiyanqijun_cxy"],
						["club",2,"sha","poison"],
						["club",3,"zou_cxy"],
						["club",4,"sha","poison"],
						["club",5,"zou_cxy"],
						["club",6,"sha"],
						["club",7,"shuiyanqijun_cxy"],
						["club",8,"wangmeizhike_cxy"],
						["club",9,"youdishenru_cxy"],
						["club",10,"sha","poison"],
						["club",11,"wangmeizhike_cxy"],
						["club",12,"riyueji_cxy"],
						["club",13,"nanmanzhanxiang_cxy"],
						["spade",1,"shuiyanqijun_cxy"],
						["spade",2,"sha","poison"],
						["spade",3,"zou_cxy"],
						["spade",4,"tiesuo"],
						["spade",5,"fashiche_cxy"],
						["spade",6,"zou_cxy"],
						["spade",7,"qibaodao"],
						["spade",8,"yuqinguzong_cxy"],
						["spade",9,"sha","poison"],
						["spade",10,"liannuzhanche_cxy"],
						["spade",11,"youdishenru_cxy"],
						["spade",12,"youdishenru_cxy"],
						["spade",13,"caochuanjiejian_cxy"],
					],
				});
builder.addPack({
					skill:{
						zou_skill:{
							trigger:{target:"useCardToBefore"},
							filter:function(event,player){
								if(player.countCards("he",{name:"zou_cxy"})==0){
									return false;
								}
								return event.card.name=="sha"||get.type(event.card)=="trick";
							},
							direct:true,
							content:function(){
								"step 0"
								player.chooseToUse("是否对"+get.translation(player)+"(你)使用[走]？<p>你将展示所有手牌，然后"+get.translation(trigger.card)+"对你无效</p>",{name:"zou_cxy"},player,-1).set("ai1",function(card){
									if(trigger.card.name=="sha"&&player.countCards("he",{name:"shan"}))return 0;
									return get.effect(player,trigger.card,trigger.player,player)<0?2:0;
								});
								"step 1"
								if(result.bool){
									player.showHandcards();
								}
								else {
									event.finish();
								}
								"step 2"
								trigger.untrigger();
								trigger.finish();
							},
						},
						liang_skill:{
							trigger:{player:"phaseDiscardBegin"},
							filter:function(event,player){
								return player.countCards("h",{name:"liang_cxy"});
							},
							direct:true,
							content:function(){
								"step 0"
								player.chooseToUse("是否对"+get.translation(player)+"(你)使用[粮]？<p>你将摸一张牌并跳过弃牌阶段</p>",{name:"liang_cxy"},player,-1).ai1=function(card){
									return 2;
								};
								"step 1"
								if(result.bool){
									player.draw();
								}
								else {
									event.finish();
								}
								"step 2"
								trigger.untrigger();
								trigger.finish();
							},
						},
						jin_skill:{
							trigger:{player:"damageBefore"},
							filter:function(event,player){
								return event.source&&event.source.isAlive()&&player.countCards('h','jin_cxy');
							},
							direct:true,
							content:function(){
								"step 0"
								player.chooseToUse("是否对"+get.translation(trigger.source)+"使用[金]？<p>"+get.translation(trigger.source)+"获得你使用的[金]，然后你防止此次伤害</p>",{name:"jin_cxy"},trigger.source,-1).ai1=function(card){
									return get.damageEffect(player,trigger.source,player)<0?2:0;
								};
								"step 1"
								if(result.bool){
									event.target = trigger.source;
									event.card = result.cards[0];
									trigger.untrigger();
									trigger.finish();
								}
								else {
									event.finish();
								}
								"step 2"
								event.target.$gain2(result.cards[0]);
								event.target.gain(result.cards[0]);
							},
						},
						dusha_skill:{
							init:function(player,skill){
								var skills=player.getSkills(true,false);
								player.disableSkill(skill,skills);
							},
							onremove:function(player,skill){
								player.enableSkill(skill);
							},
							locked:true,
							mark:true,
							marktext:"毒",
							intro:{
								name:"毒杀",
								content:function(storage,player,skill){
									var list=[];
									for(var i in player.disabledSkills){
										if(player.disabledSkills[i].contains(skill)){
											list.push(i)
										}
									}
									if(list.length){
										var str='失效技能：';
										for(var i=0;i<list.length;i++){
											if(lib.translate[list[i]+'_info']){
												str+=get.translation(list[i])+'、';
											}
										}
										return str.slice(0,str.length-1);
									}
								}
							}
						},
						youdishenru_skill:{
							trigger:{target:"useCardToBefore"},
							filter:function(event,player){
								return event.card.name=="sha"&&player.countCards("h","youdishenru_cxy");
							},
							direct:true,
							content:function(){
								"step 0"
								player.chooseToUse("是否使用[诱敌深入]？",{name:"youdishenru_cxy"}).ai1=function(card){
									return get.effect(player,trigger.card,trigger.player,player)<0?2:0;
								};
								"step 1"
								if(result.bool){
									event.player = trigger.player;
									event.player.addTempSkill("youdishenru2",{source:"damageEnd"});
									trigger.untrigger();
									trigger.finish();
								}
								else {
									event.finish();
								}
								"step 2"
								event.player.chooseToUse("诱敌深入：对"+get.translation(player)+"使用一张[杀]或受1点伤害",{name:"sha"},player);
								"step 3"
								if(!result.bool){
									event.player.damage(player);
									event.player.removeSkill("youdishenru2");
									event.finish();
								}
								else {
									if(event.player.hasSkill("youdishenru2")){
										event.goto(2);
									}
									else {
										event.finish();
									}
								}
							}
						},
						youdishenru2:{},
						yanjingxurui_skill:{
							trigger:{player:"phaseJudgeAfter"},
							direct:true,
							content:function(){
								player.addJudgeNext(player.storage.yangjingxurui_card);
								player.removeSkill("yanjingxurui_skill");
							}
						},
						huxinjingc_skill:{
							trigger:{player:"damageBegin"},
							check:function(event,player){
								if(player.hp==1)return true;
								if(event.num>1)return true;
								if(get.damageEffect(player,event.source,player)>0)return false;
								if(player.hp>2)return false;
								return true;
							},
							content:function(){
								"step 0"
								player.discard(player.getEquip(2));
								"step 1"
								trigger.untrigger();
								trigger.finish();
							}
						},
						riyueji_skill:{
							trigger:{player:"useCard"},
							filter:function(event,player){
								return event.card.name=="sha"&&event.targets;
							},
							direct:true,
							content:function(){
								"step 0"
								player.chooseTarget("是否发动日月戟？<p>额外指定一名目标(无距离限制)，然后弃置此装备</p>",function(card,player,target){
									return !trigger.targets.contains(target)&&player.canUse(trigger.card,target);
								}).ai=function(target){
									return get.effect(target,trigger.card,player,player);
								};
								"step 1"
								if(result.bool){
									player.logSkill("riyueji_skill",result.targets);
									trigger.targets.push(result.targets[0]);
									trigger.targets.sort(lib.sort.seat);
								}
								else {
									event.finish();
								}
								"step 2"
								player.discard(player.getEquip(1));
							},
						},
						nanmanzhanxiang_skill:{
							trigger:{target:"useCardBefore"},
							forced:true,
							filter:function(event,player){
								return event.card.name=="nanman";
							},
							content:function(){
								trigger.untrigger();
								trigger.finish();
							}
						},
						fashiche_skill:{
							trigger:{player:"useCard"},
							filter:function(event,player){
								return event.card.name=="sha"&&event.targets;
							},
							forced:true,
							content:function(){
								"step 0"
								for(var i=0;i<game.players.length;i++){
									if(get.distance(player,game.players[i],'attack')>1)continue;
									if(trigger.targets.contains(game.players[i]))continue;
									if(!player.canUse(trigger.card,game.players[i]))continue;
									player.line(game.players[i]);
									trigger.targets.push(game.players[i]);
								}
								"step 1"
								trigger.targets.sort(lib.sort.seat);
							},
						},
						liannuzhanche_skill:{
							mod:{
								globalFrom:function(from,to,distance){
									return 1;
								},
								globalTo:function(from,to,distance){
									return distance+1;
								},
								cardUsable:function(card,player,num){
									if(card.name=='sha') return num+1;
								}
							},
						},
					},
					translate:{
						nanmanzhanxiang_skill:"南蛮战象",
						huxinjingc_skill:"护心镜",
						riyueji_skill:"日月戟",
						fashiche_skill:"发石车",
						liannuzhanche_skill:"连弩战车",
					},
				});

} };
}
