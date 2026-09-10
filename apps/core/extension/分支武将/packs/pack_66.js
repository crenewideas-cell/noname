// Extracted from mode/doudizhu.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"skill": {
			binglin_bingjin:{
				trigger:{player:'phaseEnd'},
				forced:true,
				ruleSkill:true,
				filter:function(event,player){
					return _status.mode=='binglin'&&game.roundNumber>14;
				},
				content:function(){
					player.loseHp();
				},
			},
			zhuSkill_xiangyang:{
				trigger:{player:'phaseEnd'},
				charlotte:true,
				direct:true,
				content:function(){
					'step 0'
					player.chooseControl('摸牌阶段','出牌阶段','cancel2').set('prompt','襄阳：是否执行一个额外的阶段？');
					'step 1'
					if(result.control!='cancel2'){
						player.logSkill(event.name);
						var next=player[result.index?'phaseUse':'phaseDraw']();
						event.next.remove(next);
						trigger.next.push(next);
					}	
				},
			},
			zhuSkill_jiangling:{
				trigger:{player:'phaseUseBegin'},
				direct:true,
				charlotte:true,
				content:function(){
					'step 0'
					player.chooseControl('加目标','多刀','取消').set('prompt',get.prompt2('zhuSkill_jiangling')).set('ai',()=>(3-game.countPlayer()));
					'step 1'
					if(result.index<2){
						player.logSkill('zhuSkill_jiangling');
						player.addTempSkill('zhuSkill_jiangling'+result.index,'phaseUseAfter');
					game.log(player,'选择了','#y'+result.control,'的效果');
					}
				},
			},
			zhuSkill_jiangling0:{
				trigger:{player:'useCard2'},
				direct:true,
				charlotte:true,
				filter:function(event,player){
					if(event.card.name!='sha'&&get.type(event.card)!='trick') return false;
					if(!event.targets||event.targets.length!=1) return false;
					var info=get.info(event.card);
					if(info.allowMultiple==false) return false;
					if(event.targets&&!info.multitarget){
						if(game.hasPlayer(function(current){
							return !event.targets.contains(current)&&lib.filter.targetEnabled2(event.card,player,current)&&lib.filter.targetInRange(event.card,player,current);
						})){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var prompt2='为'+get.translation(trigger.card)+'增加一个目标'
					player.chooseTarget(get.prompt('zhuSkill_jiangling'),function(card,player,target){
						var player=_status.event.player;
						if(_status.event.targets.contains(target)) return false;
						return lib.filter.targetEnabled2(_status.event.card,player,target)&&lib.filter.targetInRange(_status.event.card,player,target);
					}).set('prompt2',prompt2).set('ai',function(target){
						var trigger=_status.event.getTrigger();
						var player=_status.event.player;
						return get.effect(target,trigger.card,player,player)*(_status.event.targets.contains(target)?-1:1);
					}).set('targets',trigger.targets).set('card',trigger.card);
					'step 1'
					if(result.bool){
						if(!event.isMine()&&!event.isOnline()) game.delayx();
						event.targets=result.targets;
					}
					else{
						event.finish();
					}
					'step 2'
					if(event.targets){
						player.logSkill('zhuSkill_jiangling',event.targets);
						if(trigger.targets.contains(event.targets[0])) trigger.targets.removeArray(event.targets);
						else{
							//trigger.directHit.addArray(event.targets);
							trigger.targets.addArray(event.targets);
						}
					}
				},
			},
			zhuSkill_jiangling1:{
				charlotte:true,
				mod:{
					cardUsable:function(card,player){
						if(card.name=='sha'||get.type(card)=='trick') return Infinity;
					},
				},
			},
			zhuSkill_fancheng:{
				enable:'phaseUse',
				limited:true,
				charlotte:true,
				skillAnimation:true,
				animationColor:'gray',
				content:function(){
					'step 0'
					player.awakenSkill('zhuSkill_fancheng');
					player.chooseControl('杀','其他').set('prompt','选择要强化的伤害').set('ai',()=>get.rand(0,1));
					'step 1'
					player.addSkill('zhuSkill_fancheng'+result.index);
					game.log(player,'本局游戏内',result.index?'#g杀以外':'#y杀','的伤害+1');
				},
				ai:{
					order:100,
					result:{player:100},
				},
			},
			zhuSkill_fancheng0:{
				trigger:{source:'damageBegin2'},
				forced:true,
				charlotte:true,
				filter:function(event,player){
					return event.player!=player&&event.card&&event.card.name=='sha'&&event.getParent().name=='sha';
				},
				logTarget:'player',
				content:function(){
					trigger.num++;
				},
				mark:true,
				marktext:'殺',
				intro:{content:'因执行【杀】的效果对其他角色造成的伤害+1'},
			},
			zhuSkill_fancheng1:{
				trigger:{source:'damageBegin2'},
				forced:true,
				charlotte:true,
				filter:function(event,player){
					return event.player!=player&&(!event.card||event.card.name!='sha');
				},
				logTarget:'player',
				content:function(){
					trigger.num++;
				},
				mark:true,
				marktext:'谋',
				intro:{content:'不因【杀】对其他角色造成的伤害+1'},
			},
			binglin_shaxue:{
				init:function(player,skill){
					player.addMark(skill,3,false);
				},
				trigger:{player:'damageBegin3'},
				forced:true,
				charlotte:true,
				filter:function(event,player){
					return event.source&&player!=event.source&&player.identity==event.source.identity&&player.countMark('binglin_shaxue')>0;
				},
				content:function(){
					trigger.cancel();
					player.removeMark('binglin_shaxue',1,false);
					trigger.source.removeMark('binglin_shaxue',1,false);
				},
				intro:{content:'剩余次数：#'},
				ai:{
					viewHandcard:true,
					skillTagFilter:function(player,tag,arg){
						return player!=arg&&arg.hasSkill('binglin_shaxue');
					},
				},
			},
			binglin_neihong:{charlotte:true},
			toushiche_skill:{
				trigger:{player:'phaseJieshuBegin'},
				forced:true,
				equipSkill:true,
				filter:function(event,player){
				 return lib.skill.toushiche_skill.logTarget(null,player).length>0;
				},
				logTarget:function(event,player){
					var hs=player.countCards('h');
					return game.filterPlayer(function(current){
						return current!=player&&current.countCards('h')>hs;
					});
				},
				content:function(){
					'step 0'
					event.targets=lib.skill.toushiche_skill.logTarget(null,player).sortBySeat();
					'step 1'
					var target=targets.shift();
					if(target.countCards('h')>0) target.chooseToDiscard('h',true);
					if(targets.length) event.redo();
				},
			},
			online_gongshoujintui:{
				enable:'chooseToUse',
				filter:function(event,player){
					var cards=player.getCards('hs');
					for(var i of cards){
						var name=get.name(i,player);
						if(name=='gongshoujianbei'){
							if(event.filterCard({
								name:'wanjian',
								isCard:true,
								cards:[i],
							},player,event)||event.filterCard({
								name:'taoyuan',
								isCard:true,
								cards:[i],
							},player,event)) return true;
						}
						if(name=='jintuiziru'){
							if(event.filterCard({
								name:'nanman',
								isCard:true,
								cards:[i],
							},player,event)||event.filterCard({
								name:'wugu',
								isCard:true,
								cards:[i],
							},player,event)) return true;
						}
					}
					return false;
				},
				chooseButton:{
					dialog:function(event,player){
						var list=[];
						if(player.countCards('hs','gongshoujianbei')){
							list.push(['锦囊','','wanjian']);
							list.push(['锦囊','','taoyuan']);
						}
						if(player.countCards('hs','jintuiziru')){
							list.push(['锦囊','','nanman']);
							list.push(['锦囊','','wugu']);
						}
						return ui.create.dialog('攻守兼备/进退自如',[list,'vcard'],'hidden');
					},
					filter:function(button,player){
						var name=button.link[2];
						var rawname=((name=='wanjian'||name=='taoyuan')?'gongshoujianbei':'jintuiziru');
						var cards=player.getCards('hs');
						var evt=_status.event.getParent();
						for(var i of cards){
							if(get.name(i,player)==rawname&&evt.filterCard({
								name:name,
								isCard:true,
								cards:[i],
							},player,evt)) return true;
						}
						return false;
					},
					check:function(button){
						return _status.event.player.getUseValue({name:button.link[2],isCard:true});
					},
					backup:function(links){
						var name=links[0][2];
						var rawname=((name=='wanjian'||name=='taoyuan')?'gongshoujianbei':'jintuiziru');
						return {
							popname:true,
							viewAs:{name:name,isCard:true},
							filterCard:{name:rawname},
							ai1:()=>1,
						}
					},
					prompt:function(links){
						var name=links[0][2];
						var rawname=((name=='wanjian'||name=='taoyuan')?'gongshoujianbei':'jintuiziru');
						return '将一张'+get.translation(rawname)+'当做'+get.translation(name)+'使用';
					}
				},
				ai:{
					order:10,
					result:{
						player:1,
					},
				},
			},
			doudizhu_cardPile:{
				intro:{
					content:'cardCount',
				},
			},
			kaihei:{
				enable:'phaseUse',
				filter:function(event,player){
					return player==game.zhu&&game.hasPlayer(function(current){
						return lib.skill.kaihei.filterTarget(null,player,current);
					});
				},
				filterTarget:function(card,player,target){
					return player!=target&&!target.storage.kaihei&&target.countGainableCards(player,'he')>0;
				},
				content:function(){
					'step 0'
					player.gainPlayerCard(target,[1,2],'he',true);
					target.storage.kaihei=true;
					'step 1'
					if(!result.bool||!result.cards.length){
						event.finish();return;
					}
					var num=result.cards.length;
					var hs=player.getCards('he');
					if(hs.length){
						if(hs.length<=num) event._result={bool:true,cards:hs};
						else player.chooseCard('he',true,num,'选择交给'+get.translation(target)+get.cnNumber(num)+'张牌');
					}
					else event.finish();
					'step 2'
					if(result.bool&&result.cards&&result.cards.length) player.give(result.cards,target);
				},
				ai:{
					viewHandcard:true,
					skillTagFilter:function(player,tag,target){
						if(player==target||player.identity!='fan'||target.identity!='fan') return false;
					},
				},
			},
			feiyang:{
				trigger:{player:'phaseJudgeBegin'},
				charlotte:true,
				direct:true,
				filter:function(event,player){
					return _status.mode!='online'&&_status.mode!='binglin'&&player==game.zhu&&player.countCards('j')&&player.countCards('h')>1;
				},
				content:function(){
					"step 0"
					player.chooseToDiscard('h',2,get.prompt('feiyang'),'弃置两张手牌，然后弃置判定区里的一张牌').set('logSkill','feiyang').set('ai',function(card){
						if(_status.event.goon) return 6-get.value(card);
						return 0;
					}).set('goon',player.hasCard(function(card){
						return get.effect(player,{
							name:card.viewAs||card.name,
							cards:[card],
						},player,player)<0;
					},'j'));
					"step 1"
					if(result.bool){
						player.discardPlayerCard(player,'j',true);
					}
				},
			},
			bahu:{
				trigger:{player:'phaseZhunbeiBegin'},
				charlotte:true,
				forced:true,
				filter:function(event,player){
					return _status.mode!='online'&&_status.mode!='binglin'&&player==game.zhu;
				},
				content:function(){
					player.draw();
				},
				mod:{
					cardUsable:function(card,player,num){
						if(_status.mode!='online'&&_status.mode!='binglin'&&player==game.zhu&&card.name=='sha') return num+1;
					},
				},
			},
			diqi_skill:{
				trigger:{player:'damageBegin2'},
				filter:function(event,player){
					var card=player.getEquip('diqi');
					return get.itemtype(card)=='card'&&lib.filter.cardDiscardable(card,player,'diqi_skill');
				},
				check:function(event,player){
					return event.num>=Math.min(player.hp,2);
				},
				prompt2:function(event,player){
					return '弃置'+get.translation(player.getEquip('diqi'))+'并防止即将受到的'+get.cnNumber(event.num)+'点伤害';
				},
				content:function(){
					player.discard(player.getEquip('diqi'));
					trigger.cancel();
				},
				ai:{
					filterDamage:true,
					skillTagFilter:function(player,tag,arg){
						if(arg&&arg.player){
							if(arg.player.hasSkillTag('jueqing',false,player)) return false;
						}
					},
				},
			},
			online_aozhan:{
				trigger:{player:'phaseBefore'},
				forced:true,
				popup:false,
				firstDo:true,
				filter:function(event,player){
					return !_status._aozhan&&game.roundNumber>10;
				},
				content:function(){
					var color=get.groupnature(player.group,"raw");
					if(player.isUnseen()) color='fire';
					player.$fullscreenpop('鏖战模式',color); 
					game.broadcastAll(function(){
						_status._aozhan=true;
						ui.aozhan=ui.create.div('.touchinfo.left',ui.window);
						ui.aozhan.innerHTML='鏖战模式';
						if(ui.time3) ui.time3.style.display='none';
						ui.aozhanInfo=ui.create.system('鏖战模式',null,true);
						lib.setPopped(ui.aozhanInfo,function(){
							var uiintro=ui.create.dialog('hidden');
							uiintro.add('鏖战模式');
							var list=[
								'从第11轮开始，游戏将进入〔鏖战模式〕。',
								'在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。',
							];
							var intro='<ul style="text-align:left;margin-top:0;width:450px">';
							for(var i=0;i<list.length;i++){
								intro+='<li>'+list[i];
							}
							intro+='</ul>'
							uiintro.add('<div class="text center">'+intro+'</div>');
							var ul=uiintro.querySelector('ul');
							if(ul){
								ul.style.width='180px';
							}
							uiintro.add(ui.create.div('.placeholder'));
							return uiintro;
						},250);
						game.playBackgroundMusic();
					});
					game.removeGlobalSkill('online_aozhan');
					game.countPlayer(function(current){current.addSkill('aozhan')});
				},
			},
			online_juzhong:{
				trigger:{global:'useCard'},
				direct:true,
				ruleSkill:true,
				filter:function(event,player){
					return _status.mode=='online'&&!event.all_excluded&&event.player.isFriendOf(player)&&event.player!=player&&lib.skill.online_juzhong.infos[event.card.name]&&player.hasCard(function(card){
						if(_status.connectMode) return true;
						return get.name(card,player)==event.card.name;
					},'h');
				},
				content:function(){
					'step 0'
					player.chooseToDiscard('是否响应【聚众】？',get.translation(trigger.player)+'使用了'+get.translation(trigger.card)+'。你可弃置一张名称相同的牌，令'+lib.skill.online_juzhong.infos[trigger.card.name][0],function(card,player){
						return get.name(card,player)==_status.event.getTrigger().card.name;
					}).set('ai',lib.skill.online_juzhong.infos[trigger.card.name][2]).logSkill=['_juzhong',trigger.player];
					'step 1'
					if(result.bool){
						lib.skill.online_juzhong.infos[trigger.card.name][1]();
						if(!event.goon) event.finish();
					}
					else event.finish();
					'step 2'
					trigger.player.chooseTarget('你可选择一名角色，弃置其的一张牌',function(card,player,target){
						return target.countDiscardableCards(player,'he')>0;
					}).set('ai',function(target){
						var player=_status.event.player;
						return get.effect(target,{name:'guohe_copy2'},player,player);
					});
					'step 3'
					if(result.bool){
						var target=result.targets[0];
						trigger.player.line(target,'green');
						trigger.player.discardPlayerCard(target,true,'he');
					}
				},
				infos:{
					sha:['此【杀】的伤害值基数+1。',function(){
						var evt=_status.event._trigger;
						if(!evt.baseDamage) evt.baseDamage=1;
						evt.baseDamage++;
					},function(card){
						var evt=_status.event.getTrigger();
						if(!evt.targets.length) return 0;
						if(evt.targets[0].hasShan()||evt.targets[0].hasSkillTag('filterDamage',null,{
							player:evt.targets[0],
							card:evt.card,
						})) return 0;
						return 1;
					}],
					shan:['其可弃置一名角色的一张牌。',function(){
						_status.event.goon=true;
					},function(card){
						if(game.zhu.countCards('he',function(card){
							return get.value(card,game.zhu)>=6;
						})) return 7-get.value(card);
						if(game.zhu.countCards('he',function(card){
							return get.value(card,game.zhu)>0
						})) return 5-get.value(card);
						return 0;
					}],
					tao:['其摸两张牌。',function(){
						_status.event._trigger.player.draw(2);
					},function(card){
						return 6-get.value(card);
					}],
					jiu:['其本回合的伤害值或回复值+1。',function(){
						var player=_status.event._trigger.player;
						player.addTempSkill('juzhong_jiu');
						player.addMark('juzhong_jiu',1,false);
					},function(card){
						return 6-get.value(card);
					}],
				},
				ai:{
					viewHandcard:true,
					skillTagFilter:function(player,tag,target){
						if(_status.mode!='online'||player==target||player.identity!=target.identity) return false;
					},
				},
			},
			juzhong_jiu:{
				trigger:{
					player:'recoverBegin',
					source:'damageBegin1',
				},
				forced:true,
				popup:false,
				content:function(){
					trigger.num+=player.countMark('juzhong_jiu');
				},
				onremove:true,
				intro:{content:'本回合的伤害值和回复值+#'},
			},
			online_zhadan_button:{
				trigger:{
					global:'gameDrawAfter',
					player:['gainEnd','loseEnd'],
				},
				firstDo:true,
				forced:true,
				charlotte:true,
				popup:false,
				silent:true,
				filter:function(event,player){
					if(_status.mode!='online'||(player!=game.me&&!player.isOnline())) return;
					if(event.name!='lose') return !player.hasZhadan&&player.countCards('hs','zhadan')>0;
					return player.hasZhadan&&!player.countCards('hs','zhadan');
				},
				content:function(){
					if(!player.hasZhadan){
						player.hasZhadan=true;
						if(player==game.me) lib.skill.online_zhadan_button.initZhadan();
						else player.send(function(){lib.skill.online_zhadan_button.initZhadan()});
					}
					else{
						delete player.hasZhadan;
						if(player==game.me) lib.skill.online_zhadan_button.removeZhadan();
						else player.send(function(){lib.skill.online_zhadan_button.removeZhadan()});
					}
				},
				initZhadan:function(){
					ui.zhadan_button=ui.create.control('激活炸弹','stayleft',function(){
						if(this.classList.contains('hidden')) return;
						this.classList.toggle('glow');
						if(this.classList.contains('glow')&&_status.event.type=='zhadan'&&
						_status.event.isMine()&&ui.confirm&&_status.imchoosing){
							ui.click.cancel(ui.confirm.lastChild);
						}
					});
				},
				removeZhadan:function(){
					if(ui.zhadan_button){
						ui.zhadan_button.remove();
						delete ui.zhadan_button;
					}
				},
			},
			online_zhadan:{
				trigger:{player:'useCard'},
				priority:5,
				popup:false,
				forced:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.hasCard(function(card){
							if(get.name(card)!='zhadan') return false;
							return lib.filter.cardEnabled(card,player,'forceEnable');
						},'hs');
					});
				},
				forceLoad:true,
				content:function(){
					'step 0'
					event.source=trigger.player;
					event.card=trigger.card;
					event.targets=trigger.targets;
					event._global_waiting=true;
					event.filterCard=function(card,player){
						if(get.name(card)!='zhadan'||get.itemtype(card)!='card') return false;
						return lib.filter.cardEnabled(card,player,'forceEnable');
					};
					event.send=function(player,card,source,targets,id,id2,skillState){
						if(skillState){
							player.applySkills(skillState);
						}
						if(player==game.me&&ui.zhadan_button&&!ui.zhadan_button.classList.contains('glow')){
							_status.event._result={bool:false};
							if(game.online){
								_status.event._resultid=id;
								game.resume();
							}
							return;
						}
						var str=get.translation(source);
						if(targets&&targets.length){
							str+='对'+get.translation(targets);
						}
						str+='使用了';
						str+=get.translation(card);
						str+='，是否对其使用【炸弹】？';

						var next=player.chooseToUse({
							filterCard:function(card,player){
								if(get.name(card)!='zhadan'||get.itemtype(card)!='card') return false;
								return lib.filter.cardEnabled(card,player,'forceEnable');
							},
							prompt:str,
							_global_waiting:true,
							ai1:function(card){
								var evt=_status.event.getParent('_zhadan')._trigger,player=_status.event.player;
								if(!evt) return 0;
								if(get.attitude(player,evt.player)>0) return 0;
								var eff=0;
								if(!targets.length) return Math.random()-0.5;
								for(var i of targets) eff-=get.effect(i,evt.card,evt.player,player);
								return eff-8;
							},
							source:source,
							source2:targets,
							id:id,
							id2:id2,
							type:'zhadan',
						});
						next.set('respondTo',[source,card]);

						if(game.online){
							_status.event._resultid=id;
							game.resume();
						}
						else{
							next.nouse=true;
						}
					};
					'step 1'
					var list=game.filterPlayer(function(current){
						return current.hasCard(function(card){
							if(get.name(card)!='zhadan') return false;
							return lib.filter.cardEnabled(card,player,'forceEnable');
						},'hs');
					});
					event.list=list;
					event.id=get.id();
					list.sort(function(a,b){
						return get.distance(event.source,a,'absolute')-get.distance(event.source,b,'absolute');
					});
					'step 2'
					if(event.list.length==0){
						event.finish();
					}
					else if(_status.connectMode&&(event.list[0].isOnline()||event.list[0]==game.me)){
						event.goto(4);
					}
					else{
						event.current=event.list.shift();
						event.send(event.current,event.card,event.source,event.targets,event.id,trigger.parent.id);
					}
					'step 3'
					if(result.bool){
						event.zhadanresult=event.current;
						event.zhadanresult2=result;
						if(event.current!=game.me&&!event.current.isOnline()) game.delayx();
						event.goto(8);
					}
					else{
						event.goto(2);
					}
					'step 4'
					var id=event.id;
					var sendback=function(result,player){
						if(result&&result.id==id&&!event.zhadanresult&&result.bool){
							event.zhadanresult=player;
							event.zhadanresult2=result;
							game.broadcast('cancel',id);
							if(_status.event.id==id&&_status.event.name=='chooseToUse'&&_status.paused){
								return (function(){
									event.resultOL=_status.event.resultOL;
									ui.click.cancel();
									if(ui.confirm) ui.confirm.close();
								});
							}
						}
						else{
							if(_status.event.id==id&&_status.event.name=='chooseToUse'&&_status.paused){
								return (function(){
									event.resultOL=_status.event.resultOL;
								});
							}
						}
					};

					var withme=false;
					var withol=false;
					var list=event.list;
					for(var i=0;i<list.length;i++){
						if(list[i].isOnline()){
							withol=true;
							list[i].wait(sendback);
							list[i].send(event.send,list[i],event.card,event.source,event.targets,event.id,trigger.parent.id,get.skillState(list[i]));
							list.splice(i--,1);
						}
						else if(list[i]==game.me){
							withme=true;
							event.send(list[i],event.card,event.source,event.targets,event.id,trigger.parent.id);
							list.splice(i--,1);
						}
					}
					if(!withme){
						event.goto(6);
					}
					if(_status.connectMode){
						if(withme||withol){
							for(var i=0;i<game.players.length;i++){
								game.players[i].showTimer();
							}
						}
					}
					event.withol=withol;
					'step 5'
					if(result&&result.bool&&!event.zhadanresult){
						game.broadcast('cancel',event.id);
						event.zhadanresult=game.me;
						event.zhadanresult2=result;
					}
					'step 6'
					if(event.withol&&!event.resultOL){
						game.pause();
					}
					'step 7'
					for(var i=0;i<game.players.length;i++){
						game.players[i].hideTimer();
					}
					'step 8'
					if(event.zhadanresult){
						event.zhadanresult.$fullscreenpop('炸弹',get.groupnature(event.zhadanresult));
						var next=event.zhadanresult.useResult(event.zhadanresult2);
						next.respondTo=[trigger.player,trigger.card];
						game.bonusNum*=2;
						game.updateRoundNumber();
					}
				}
			},
		},
"translate": {
			zhu:"主",
			fan:"反",
			zhu2:"地主",
			fan2:"农民",
			random2:"随机",
			feiyang:"飞扬",
			bahu:"跋扈",
			feiyang_info:"判定阶段开始时，若你的判定区有牌，则你可以弃置两张手牌，然后弃置你判定区的一张牌。每回合限一次。",
			bahu_info:"锁定技，准备阶段开始时，你摸一张牌。出牌阶段，你可以多使用一张【杀】。",
			kaihei:'强易',
			kaihei_info:'出牌阶段，你可以获得一名其他角色的至多两张牌，然后交给其等量的牌。每名角色每局游戏限一次。',
			doudizhu_cardPile:'底牌',
			online_gongshoujintui:'攻守进退',
			gongshoujianbei:'攻守兼备',
			gongshoujianbei_info:'出牌阶段，你可选择：①将此牌当做【万箭齐发】使用。②将此牌当做【桃园结义】使用。',
			jintuiziru:'进退自如',
			jintuiziru_info:'出牌阶段，你可选择：①将此牌当做【南蛮入侵】使用。②将此牌当做【五谷丰登】使用。',
			diqi:'地契',
			diqi_skill:'地契',
			diqi_info:'当你受到伤害时，你可以弃置此牌，防止此伤害。当此牌离开你的装备区后，销毁之。',
			_juzhong:'聚众',
			juzhong_jiu:'聚众',
			zhadan:'炸弹',
			zhadan_info:'当一张牌被使用时，对此牌使用。取消此牌的所有目标，且本局游戏的底价翻倍。',
			jiwangkailai:'继往开来',
			jiwangkailai_info:'出牌阶段，对包含你自己在内的一名角色使用。目标角色选择一项：①弃置所有手牌，然后摸等量的牌。②将所有手牌当做一张不为【继往开来】的普通锦囊牌使用。',
			zhuSkill_xiangyang:'襄阳',
			zhuSkill_xiangyang_info:'回合结束时，你可获得一个额外的出牌阶段或摸牌阶段。',
			zhuSkill_jiangling:'江陵',
			zhuSkill_jiangling0:'江陵',
			zhuSkill_jiangling1:'江陵',
			zhuSkill_jiangling_info:'出牌阶段开始时，你可选择一项：①本阶段内使用【杀】或普通锦囊牌选择唯一目标时可增加一个目标。②本阶段内使用【杀】或普通锦囊牌无次数限制。',
			zhuSkill_fancheng:'樊城',
			zhuSkill_fancheng0:'樊城',
			zhuSkill_fancheng1:'樊城',
			zhuSkill_fancheng_info:'限定技，出牌阶段，你可选择获得一项效果直到游戏结束：①因执行【杀】的效果而对其他角色造成的伤害+1。②对其他角色造成的渠道不为【杀】的伤害+1。',
			binglin_shaxue:'歃血',
			binglin_shaxue_info:'锁定技，每局游戏限三次，当你受到队友造成的伤害时，你防止此伤害。',
			binglin_neihong:'内讧',
			binglin_neihong_info:'锁定技，当你杀死队友后，你所在的阵营视为游戏失败。',
			baiyidujiang:'白衣渡江',
			baiyidujiang_info:'出牌阶段，对地主使用。你选择一项：①令其将手牌数摸至全场最多。②令其将手牌数弃置至全场最少。',
			shuiyanqijuny:'水淹七军',
			shuiyanqijuny_info:'出牌阶段，对至多两名角色使用。目标角色受到1点雷属性伤害，然后若其：是此牌的使用者选择的第一个目标，其弃置一张牌；不是第一个目标，其摸一张牌。',
			luojingxiashi:'落井下石',
			luojingxiashi_info:'出牌阶段，对所有其他的已受伤角色使用。目标角色受到1点伤害。',
			binglinchengxia:'兵临城下',
			binglinchengxia_info:'出牌阶段，对一名其他角色使用。将此牌横置于目标角色的判定区内。目标角色于判定阶段进行判定，若判定结果不为♦，则其弃置装备区内的所有牌或受到1点伤害。',
			toushiche:'投石车',
			toushiche_skill:'投石车',
			toushiche_info:'锁定技，结束阶段开始时，你令所有手牌数大于你的角色依次弃置一张手牌。',
			binglin_bingjin:'兵尽',
		}
};
}
