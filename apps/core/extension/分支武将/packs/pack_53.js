// Extracted from mode/brawl.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"skill": {
								_lingli_damage:{
									trigger:{source:'damage'},
									forced:true,
									popup:false,
									filter:function(event,player){
										return event.player==player._toKill;
									},
									content:function(){
										game.log(player,'对击杀目标造成了伤害');
										player.changeLingli(trigger.num);
									},
								},
								_lingli:{
								 mark:true,
								 marktext:'灵',
								 popup:'聚灵',
								 intro:{
								 	name:'灵力',
								 	content:'当前灵力点数：# / 5',
								 },
								 trigger:{
								 	player:'phaseBeginStart',
								 },
								 prompt:'是否消耗2点灵力获得一个技能？',
								 filter:function(event,player){
								 	return player.storage._lingli>1;
								 },
								 check:function(event,player){
								 	return player.skillH.length<3;
								 },
								 content:function(){
								 	'step 0'
								 	player.changeLingli(-2);
								 	'step 1'
								 	event.skills=lib.huanhuazhizhan.skills;
								 	var skills=event.skills;
								 	skills.randomSort();
								 	var list=[];
								 	for(var i=0;i<skills[i].length;i++){
								 		if(!player.skillH.contains(skills[i])) list.push(skills[i]);
								 		if(list.length==3) break;
								 	}
								 	if(!list.length){event.finish();return;}
								 	if(player.storage._lingli>0)	list.push('刷新');
								 	event.list=list;
								 	var dialog=game.getSkillDialog(event.list,'选择获得一个技能');
								 	player.chooseControl(event.list).set('ai',function(){
								 		return 0;
								 	}).dialog=dialog;
								 	'step 2'
							 		if(result.control=='刷新'){
							 			player.changeLingli(-1);
							 			event.goto(1);
							 			return;
							 		}
							 		event.skill=result.control;
							 		if(player.skillH.length==3){
									 	event.lose=true;
											player.chooseControl(player.skillH).prompt='选择失去1个已有技能';
							 		}
								 	'step 3'
								 	if(event.lose) player.removeSkillH(result.control);
								 	player.addSkillH(event.skill);
								 },
								},
								_lingli_round:{
									trigger:{global:'roundStart'},
									forced:true,
									popup:false,
									filter:function(event,player){
										return _status._aozhan!=true&&game.roundNumber>1;
									},
									content:function(){
										player.changeLingli(1);
									},
								},
								_lingli_draw:{
									enable:'phaseUse',
									filter:function(event,player){
										return player.storage._lingli>0;
									},
									content:function(){
										player.changeLingli(-1);
										player.draw();
									},
									delay:0,
									ai:{
										order:10,
										result:{
											player:function(player){
												return (player.storage._lingli-2*(3-player.skillH.length))>0?1:0;
											},
										},
									},
								},
								_lingli_save:{
									trigger:{target:'useCardToTargeted'},
									forced:true,
									popup:false,
									filter:function(event,player){
										return event.card.name=='tao'&&player==event.player._toSave;
									},
									content:function(){
										game.log(trigger.player,'帮助了保护目标');
										trigger.player.changeLingli(1);
									},
								},
								_hhzz_qiankunbagua:{
									trigger:{player:'phaseAfter'},
									forced:true,
									forceDie:true,
									popup:false,
									filter:function(event,player){
										return _status._aozhan&&!player.getStat('damage')&&player.isAlive()||event._lastDead!=undefined;
									},
									content:function(){
										'step 0'
										if(_status._aozhan&&!player.getStat('damage')){
											player.loseHp();
											player.changeLingli(1);
											game.log(player,'本回合内未造成伤害，触发死战模式惩罚');
										}
										if(trigger._lastDead==undefined) event.goto(2);
										'step 1'
										var type=get.rand(1,8);
										event.type=type;
										trigger._lastDead.playerfocus(1200);
										player.$fullscreenpop('乾坤八卦·'+['离','坎','乾','震','兑','艮','巽','坤'][type-1],get.groupnature(trigger._lastDead.group,'raw'));
										game.delay(1.5);
										'step 2'
										var type=event.type;
										switch(type){
											case 1:{
												game.countPlayer(function(current){
													current.loseHp();
												});
												break;
											}
											case 2:{
												game.countPlayer(function(current){
													current.draw(2,'nodelay');
												});
												break;
											}
											case 3:{
												trigger._lastDead.revive(3);
												trigger._lastDead.draw(3);
												break;
											}
											case 4:{
												game.countPlayer(function(current){
													var he=current.getCards('he');
													if(he.length) current.discard(he.randomGet()).delay=false;
												});
												break;
											}
											case 5:{
												game.countPlayer(function(current){
													current.changeLingli(1);
												});
												break;
											}
											case 6:{
												var cards=[];
												game.countPlayer(function(current){
													var card=get.cardPile(function(card){
														return !cards.contains(card)&&get.type(card)=='equip';
													});
													if(card){
														cards.push(card);
														current.$gain(card,'gain2')
														current.gain(card);
													}
												});
												break;
											}
											case 7:{
												game.countPlayer(function(current){
													if(current.skillH.length<3){
														var skills=lib.huanhuazhizhan.skills;
														skills.randomSort();
														for(var i=0;i<skills.length;i++){
															if(!current.skillH.contains(skills[i])){
																current.addSkillH(skills[i]);
																break;
															}
														}
													}
												});
												break;
											}
											case 8:{
												trigger._lastDead.revive(null,false);
												trigger._lastDead.uninit();
												trigger._lastDead.init(['hhzz_shiona','hhzz_kanade','hhzz_takaramono1','hhzz_takaramono2'].randomGet());
												trigger._lastDead.skillH=lib.character[trigger._lastDead.name][3].slice(0);
												trigger._lastDead.addSkill('hhzz_noCard');
												break;
											}
										}
										'step 3'
										if(game.playerx().length<=4&&!_status._aozhan){
											game.countPlayer2(function(current){
												delete current._toKill;
												delete current._toSave;
											});
											ui.huanhuazhizhan.innerHTML='死战模式';
											_status._aozhan=true;
											game.playBackgroundMusic();
											trigger._lastDead.$fullscreenpop('死战模式',get.groupnature(trigger._lastDead.group,'raw')||'fire');
										}
										else game.randomMission();
									},
								},
								hhzz_noCard:{
									mod:{
										cardEnabled:function(){return false},
										cardSavable:function(){return false},
										cardRespondable:function(){return false},
									},
								},
								hhzz_huilei:{
									trigger:{player:'die'},
									forced:true,
									forceDie:true,
									skillAnimation:true,
									logTarget:'source',
									filter:function(event,player){
										return event.source!=undefined;
									},
									content:function(){
										var source=trigger.source;
										var cards=source.getCards('he');
										if(cards.length) source.discard(cards);
									},
									ai:{
										effect:{
											target:function(card,player,target){
												if(get.tag(card,'damage')) return [-5,0];
											}
										}
									}
								},
								hhzz_youlian:{
									trigger:{player:'die'},
									forced:true,
									forceDie:true,
									skillAnimation:true,
									logTarget:'source',
									filter:function(event,player){
										return event.source!=undefined;
									},
									content:function(){
										var source=trigger.source;
										var cards=source.getCards('he');
										if(cards.length) source.discard(cards);
										var skills=source.skillH;
										if(skills.length) source.removeSkillH(skills.randomGet());
									},
									ai:{
										effect:{
											target:function(card,player,target){
												if(get.tag(card,'damage')) return [-5,0];
											}
										}
									}
								},
								hhzz_zhencang:{
									trigger:{player:'die'},
									forced:true,
									filter:function(event,player){
										return event.source!=undefined;
									},
									forceDie:true,
									logTarget:'source',
									content:function(){
										var source=trigger.source;
										source.draw();
										if(source.skillH.length==3) source.removeSkillH(source.skillH.randomGet());
										var skills=lib.huanhuazhizhan.skills;
										skills.randomSort();
										for(var i=0;i<skills.length;i++){
											if(!source.skillH.contains(skills[i])){
												source.addSkillH(skills[i]);
												break;
											}
										}
									},
								},
								hhzz_huizhen:{
									trigger:{player:'die'},
									forced:true,
									forceDie:true,
									logTarget:'source',
									filter:function(event,player){
										return event.source!=undefined;
									},
									content:function(){
										var source=trigger.source;
										source.draw(3);
										if(source.skillH.length==3) source.removeSkillH(source.skillH.randomGet());
										var skills=lib.huanhuazhizhan.skills;
										skills.randomSort();
										for(var i=0;i<skills.length;i++){
											if(!source.skillH.contains(skills[i])){
												source.addSkillH(skills[i]);
												break;
											}
										}
									},
								},
								hhzz_jubao:{
									trigger:{player:'damage'},
									forced:true,
									logTarget:'source',
									filter:function(event,player){
										return event.source!=undefined&&player.countCards('he')>0;
									},
									content:function(){
										var cards=player.getCards('he');
										cards.randomSort();
										cards=cards.slice(0,trigger.num);
										trigger.source.gain('give',cards,player);
									},
									ai:{
										effect:{
											target:function(card,player,target){
												if(get.tag(card,'damage')) return [15,0];
											}
										}
									}
								},
							},
"translate": {
								_lingli:'聚灵',
								_lingli_bg:'灵',
								_lingli_draw:'聚灵',
								hhzz_huilei:'挥泪',
								hhzz_youlian:'犹怜',
								hhzz_zhencang:'珍藏',
								hhzz_huizhen:'汇珍',
								hhzz_jubao:'聚宝',
								hhzz_huilei_info:'锁定技，杀死你的角色弃置所有的牌。',
								hhzz_youlian_info:'锁定技，杀死你的角色弃置所有牌并随机失去一个技能。',
								hhzz_zhencang_info:'锁定技，杀死你的角色摸一张牌并随机获得一个技能(已满则先随机移除一个)。',
								hhzz_huizhen_info:'锁定技，杀死你的角色摸三张牌并随机获得一个技能(已满则先随机移除一个)。',
								hhzz_jubao_info:'锁定技，当你受到伤害的点数确定时，伤害来源随机获得你区域内的X张牌（X为伤害点数）。',
								hhzz_shiona:'汐奈',
								hhzz_kanade:'立华奏',
								hhzz_takaramono1:'坚实宝箱',
								hhzz_takaramono2:'普通宝箱',
								hhzz_toulianghuanzhu:'偷梁换柱',
								hhzz_fudichouxin:'釜底抽薪',
								hhzz_toulianghuanzhu_info:'出牌阶段，对一名角色使用，随机更换其一个技能。可重铸。',
								hhzz_fudichouxin_info:'出牌阶段，对一名角色使用，随机弃置其一个技能。',
								nei:' ',
								nei2:' ',
								刷新_info:'消耗1点灵力值，刷新上述技能',
							}
};
}
