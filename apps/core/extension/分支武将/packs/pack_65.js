// Extracted from mode/chess.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"skill": {
			_tempobstacle:{
				trigger:{player:'phaseAfter'},
				silent:true,
				content:function(){
					var list=game.obstacles.slice(0);
					for(var i=0;i<list.length;i++){
						if(typeof list[i].tempObstacle=='number'){
							if(--list[i].tempObstacle==0){
								game.removeObstacle(list[i]);
							}
						}
					}
				}
			},
			_attackmove:{
				trigger:{player:'damage'},
				silent:true,
				priority:50,
				filter:function(event,player){
					if(!event.source) return false;
					if(get.distance(event.source,player,'pure')>2) return false;
					var xy1=event.source.getXY();
					var xy2=player.getXY();
					var dx=xy2[0]-xy1[0];
					var dy=xy2[1]-xy1[1];
					// if(dx*dy!=0) return false;
					if(dx==0&&Math.abs(dy)==2){
						dy/=2;
					}
					if(dy==0&&Math.abs(dx)==2){
						dx/=2;
					}
					return player.movable(dx,dy);
				},
				content:function(){
					var xy1=trigger.source.getXY();
					var xy2=player.getXY();
					var dx=xy2[0]-xy1[0];
					var dy=xy2[1]-xy1[1];
					if(dx==0&&Math.abs(dy)==2){
						dy/=2;
					}
					if(dy==0&&Math.abs(dx)==2){
						dx/=2;
					}
					if(player.movable(dx,dy)){
						player.move(dx,dy);
					}
				}
			},
			dubiaoxianjing:{
				global:'dubiaoxianjing2'
			},
			dubiaoxianjing2:{
				trigger:{player:'phaseAfter'},
				forced:true,
				popup:false,
				filter:function(event,player){
					if(player.hp<=1) return false;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_dubiaoxianjing'){
							return get.chessDistance(game.treasures[i],player)<=2;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var source=null;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_dubiaoxianjing'){
							source=game.treasures[i];break;
						}
					}
					if(source){
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player,'thunder');
						if(lib.config.animation&&!lib.config.low_performance){
							setTimeout(function(){
								source.$epic2();
							},300);
						}
						game.delay(2);
					}
					else{
						event.finish();
					}
					'step 1'
					game.log('毒镖陷阱发动');
					player.damage('nosource');
					player.draw(2);
				}
			},
			jiqishi:{
				global:'jiqishi2'
			},
			jiqishi2:{
				trigger:{player:'phaseAfter'},
				forced:true,
				popup:false,
				filter:function(event,player){
					if(player.hp==player.maxHp) return false;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_jiqishi'){
							return get.chessDistance(game.treasures[i],player)<=2;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var source=null;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_jiqishi'){
							source=game.treasures[i];break;
						}
					}
					if(source){
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player,'thunder');
						if(lib.config.animation&&!lib.config.low_performance){
							setTimeout(function(){
								source.$epic2();
							},300);
						}
						game.delay(2);
					}
					else{
						event.finish();
					}
					'step 1'
					game.log('集气石发动');
					player.recover('nosource');
					var he=player.getCards('he');
					if(he.length){
						player.discard(he.randomGets(2));
					}
				}
			},
			wuyashenxiang:{
				global:'wuyashenxiang2'
			},
			wuyashenxiang2:{
				trigger:{player:'phaseAfter'},
				forced:true,
				popup:false,
				filter:function(event,player){
					if(player.hp>1) return false;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_wuyashenxiang'){
							return get.chessDistance(game.treasures[i],player)<=3;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var source=null;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_wuyashenxiang'){
							source=game.treasures[i];break;
						}
					}
					if(source){
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player,'thunder');
						if(lib.config.animation&&!lib.config.low_performance){
							setTimeout(function(){
								source.$epic2();
							},300);
						}
						game.delay(2);
					}
					else{
						event.finish();
					}
					'step 1'
					game.log('乌鸦神像发动');
					player.recover('nosource');
					// player.draw();
					var card=get.cardPile(function(c){
						return get.type(c)=='delay';
					});
					if(card){
						player.addJudge(card);
					}
				}
			},
			shenpanxianjing:{
				global:'shenpanxianjing2'
			},
			shenpanxianjing2:{
				trigger:{player:'phaseAfter'},
				forced:true,
				popup:false,
				filter:function(event,player){
					var nh=player.countCards('h');
					if(!nh) return false;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_shenpanxianjing'){
							for(var j=0;j<game.players.length;j++){
								if(game.players[j].countCards('h')>nh) return false;
							}
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var source=null;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_shenpanxianjing'){
							source=game.treasures[i];break;
						}
					}
					if(source){
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player,'thunder');
						if(lib.config.animation&&!lib.config.low_performance){
							setTimeout(function(){
								source.$epic2();
							},300);
						}
						game.delay(2);
					}
					else{
						event.finish();
					}
					'step 1'
					game.log('审判之刃发动');
					var hs=player.getCards('h');
					if(hs.length){
						player.discard(hs.randomGet());
					}
				}
			},
			shiyuansu:{
				global:'shiyuansu2'
			},
			shiyuansu2:{
				trigger:{player:'damageAfter'},
				forced:true,
				popup:false,
				filter:function(event,player){
					if(event.num<2) return false;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_shiyuansu'){
							return true;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					game.delayx();
					'step 1'
					var source=null;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_shiyuansu'){
							source=game.treasures[i];break;
						}
					}
					if(source){
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player,'thunder');
						if(lib.config.animation&&!lib.config.low_performance){
							setTimeout(function(){
								source.$epic2();
							},300);
						}
						game.delay(2);
					}
					else{
						event.finish();
					}
					'step 2'
					game.log('石元素像发动');
					player.changeHujia();
				}
			},
			shenmidiaoxiang:{
				global:'shenmidiaoxiang2'
			},
			shenmidiaoxiang2:{
				trigger:{player:'phaseAfter'},
				forced:true,
				popup:false,
				filter:function(event,player){
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_shenmidiaoxiang'){
							return player.canMoveTowards(game.treasures[i])&&
								get.chessDistance(game.treasures[i],player)>3;
						}
					}
					return false;
				},
				content:function(){
					'step 0'
					var source=null;
					for(var i=0;i<game.treasures.length;i++){
						if(game.treasures[i].name=='treasure_shenmidiaoxiang'){
							source=game.treasures[i];break;
						}
					}
					if(source){
						event.source=source;
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player,'thunder');
						if(lib.config.animation&&!lib.config.low_performance){
							setTimeout(function(){
								source.$epic2();
							},300);
						}
						game.delay(2);
					}
					else{
						event.finish();
					}
					'step 1'
					game.log('神秘雕像发动');
					player.moveTowards(event.source);
				}
			},
			arenaAdd:{
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return _status.enterArena&&player.side==game.me.side&&game.data.arena.arenachoice.length>game.data.arena.dead.length;
				},
				direct:true,
				delay:0,
				preservecancel:true,
				content:function(){
					"step 0"
					var list=game.data.arena.arenachoice.slice(0);
					for(var i=0;i<game.data.arena.dead.length;i++){
						list.remove(game.data.arena.dead[i]);
					}
					event.dialog=ui.create.dialog('选择一个出场武将',[list,'character']);
					game.pause();
					_status.imchoosing=true;
					event.custom.replace.button=function(button){
						event.choice=button.link;
						game.resume();
					}
					event.custom.replace.confirm=game.resume;
					event.switchToAuto=game.resume;
					"step 1"
					if(ui.confirm){
						ui.confirm.classList.add('removing');
					}
					_status.imchoosing=false;
					event.dialog.close();
					if(event.choice){
						var name=event.choice;
						game.addChessPlayer(name);
						game.data.arena.dead.push(name);
						game.saveData();
						if(!_status.arenaAdd){
							_status.arenaAdd=[];
						}
						_status.arenaAdd.push(name);
						game.delay();
					}
					else{
						player.getStat('skill').arenaAdd--;
					}
				},
			},
			leader_zhaoxiang:{
				unique:true,
				enable:'phaseUse',
				usable:1,
				promptfunc:function(event,player){
					var targets=[];
					var skill=lib.skill.leader_zhaoxiang;
					for(var i=0;i<game.players.length;i++){
						if(!game.data.character.contains(game.players[i].name)&&game.players[i].side!=player.side){
							targets.push(game.players[i]);
						}
					}
					var str=lib.translate.leader_zhaoxiang_info;
					if(targets.length){
						str='<p style="text-align:center;line-height:20px;margin-top:0">⚑ '+game.data.dust+
						'</p><p style="text-align:center;line-height:20px;margin-top:8px">'
						for(var i=0;i<targets.length;i++){
							str+='<span style="width:120px;display:inline-block;text-align:right">'+get.translation(targets[i])+
							'：</span><span style="width:120px;display:inline-block;text-align:left">'+
							(skill.chance(targets[i],player)*100).toFixed(2)+'%</span><br>';
						}
						str+='</p>'
					}
					return str;
				},
				chance:function(target,player){
					var chance;
					var renyi=player.hasSkill('leader_renyi');
					switch(target.hp){
						case 1:chance=0.7;break;
						case 2:chance=0.4;break;
						default:chance=0.2;break;
					}
					switch(target.countCards('he')){
						case 0:break;
						case 1:chance/=1.2;break;
						case 2:chance/=1.4;break;
						case 3:chance/=1.7;break;
						default:chance/=2;break;
					}
					switch(game.getRarity(target.name)){
						case 'common':{
							if(renyi) chance*=2;
							break;
						}
						case 'rare':{
							chance/=2;
							if(renyi) chance*=2;
							break;
						}
						case 'epic':{
							chance/=5;
							if(renyi) chance*=1.5;
							break;
						}
						case 'legend':{
							chance/=15;
							if(renyi) chance*=1.2;
							break;
						}
					}
					return Math.min(1,chance);
				},
				filter:function(){
					return game.data.dust>=10;
				},
				filterTarget:function(card,player,target){
					return game.isChessNeighbour(player,target)&&!game.data.character.contains(target.name);
				},
				content:function(){
					var chance=lib.skill.leader_zhaoxiang.chance(target,player);
					game.changeDust(-10);
					if(Math.random()<chance){
						_status.zhaoxiang=target.name;
						game.data.character.add(target.name);
						game.saveData();
						game.over();
					}
					else{
						game.log('招降',target,'失败')
						player.popup('招降失败');
						player.damage(target);
					}
				}
			},
			leader_xiaoxiong:{
				unique:true,
				forced:true,
				trigger:{source:'damageSource'},
				filter:function(event,player){
					return event.num>0;
				},
				content:function(){
					switch(_status.difficulty){
						case 'leader_easy':game.reward+=2*trigger.num;break;
						case 'leader_medium':game.reward+=4*trigger.num;break;
						case 'leader_hard':game.reward+=6*trigger.num;break;
					}
				}
			},
			leader_renyi:{
				unique:true,
			},
			leader_mouduan:{
				unique:true,
				global:'leader_mouduan2'
			},
			leader_mouduan2:{
				mod:{
					chessMove:function(player,current){
						if(player.side&&player.name!=_status.lord) return current+1;
					}
				}
			},
			leader_zhenlve:{
				trigger:{global:'useCard1'},
				unique:true,
				charlotte:true,
				firstDo:true,
				forced:true,
				popup:false,
				filter:function(event,player){
					return get.type(event.card)=='trick'&&event.player.isFriendOf(player);
				},
				content:function(){
					trigger.nowuxie=true;
				},
			},
			tongshuai:{
				unique:true,
				forbid:['guozhan'],
				init:function(player){
					player.storage.tongshuai={
						list:[],
						owned:{},
						player:player,
						get:function(num){
							if(typeof num!='number') num=1;
							var player=this.player;
							while(num--){
								var name=player.storage.tongshuai.unowned.shift();
								if(!name) return;
								var skills=lib.character[name][3].slice(0);
								for(var i=0;i<skills.length;i++){
									var info=lib.skill[skills[i]];
									if(info.unique&&!info.gainable){
										skills.splice(i--,1);
									}
								}
								player.storage.tongshuai.owned[name]=skills;
								game.addVideo('chess_tongshuai',player,player.storage.tongshuai.owned);
							}
						}
					}
				},
				group:['tongshuai1','tongshuai2','tongshuai3'],
				intro:{
					content:function(storage,player){
						var str='';
						var slist=storage.owned;
						var list=[];
						for(var i in slist){
							list.push(i);
						}
						if(list.length){
							str+=get.translation(list[0]);
							for(var i=1;i<list.length;i++){
								str+='、'+get.translation(list[i]);
							}
						}
						var skill=player.additionalSkills.tongshuai[0];
						if(skill){
							str+='<p>当前技能：'+get.translation(skill);
						}
						return str;
					},
					mark:function(dialog,content,player){
						var slist=content.owned;
						var list=[];
						for(var i in slist){
							list.push(i);
						}
						if(list.length){
							dialog.addSmall([list,'character']);
						}
						var skill=player.additionalSkills.tongshuai[0];
						if(skill){
							dialog.add('<div><div class="skill">【'+get.translation(skill)+
							'】</div><div>'+lib.translate[skill+'_info']+'</div></div>');
						}
					}
				},
				// mark:true
			},
			tongshuai1:{
				trigger:{global:'gameStart'},
				forced:true,
				popup:false,
				priority:10,
				content:function(){
					for(var i=0;i<game.data.character.length;i++){
						var skills=lib.character[game.data.character[i]][3]
						var add=false;
						for(var j=0;j<skills.length;j++){
							var info=lib.skill[skills[j]];
							if(info.gainable||!info.unique){
								add=true;break;
							}
						}
						if(add){
							player.storage.tongshuai.list.push(game.data.character[i]);
						}
					}
					for(var i=0;i<game.players.length;i++){
						player.storage.tongshuai.list.remove([game.players[i].name]);
						player.storage.tongshuai.list.remove([game.players[i].name1]);
						player.storage.tongshuai.list.remove([game.players[i].name2]);
					}
					player.storage.tongshuai.unowned=player.storage.tongshuai.list.slice(0);
					player.storage.tongshuai.unowned.sort(lib.sort.random);
					if(player.storage.tongshuai.unowned.length>1){
						player.storage.tongshuai.get(2);
					}
					else if(player.storage.tongshuai.unowned.length==1){
						player.storage.tongshuai.get();
					}
					else{
						player.removeSkill('tongshuai');
					}
				}
			},
			tongshuai2:{
				audio:2,
				trigger:{player:['phaseBegin','phaseEnd'],global:'gameStart'},
				filter:function(event,player,name){
					if(!player.hasSkill('tongshuai')) return false;
					if(name=='phaseBegin'&&game.phaseNumber==1) return false;
					return true;
				},
				priority:-9,
				forced:true,
				popup:false,
				content:function(){
					var slist=player.storage.tongshuai.owned;
					var list=[];
					for(var i in slist){
						list.push(i);
					}
					if(event.isMine()){
						event.dialog=ui.create.dialog('选择获得一项技能',[list,'character']);
						if(trigger.name=='game'){
							event.control=ui.create.control();
						}
						else{
							event.control=ui.create.control(['cancel']);
						}
						event.clickControl=function(link){
							if(link!='cancel'){
								var currentname=event.dialog.querySelector('.selected.button').link;
								var mark=player.marks.tongshuai;
								if(!mark){
									player.markSkill('tongshuai');
									mark=player.marks.tongshuai;
									if(mark.firstChild){
										mark.firstChild.remove();
									}
								}
								mark.setBackground(currentname,'character');

								player.addAdditionalSkill('tongshuai',link);
								game.addVideo('chess_tongshuai_skill',player,[currentname,link]);
								player.logSkill('tongshuai2');
								game.log(player,'获得技能','【'+get.translation(link)+'】');
								player.popup(link);

								for(var i=0;i<event.dialog.buttons.length;i++){
									if(event.dialog.buttons[i].classList.contains('selected')){
										var name=event.dialog.buttons[i].link;
										player.sex=lib.character[name][0];
										player.group=lib.character[name][1];
										// player.node.identity.style.backgroundColor=get.translation(player.group+'Color');
										break;
									}
								}
							}
							ui.auto.show();
							event.dialog.close();
							event.control.close();
							_status.imchoosing=false;
							game.resume();
						};
						event.control.custom=event.clickControl;
						ui.auto.hide();
						_status.imchoosing=true;
						game.pause();
						for(var i=0;i<event.dialog.buttons.length;i++){
							event.dialog.buttons[i].classList.add('selectable');
						}
						event.custom.replace.button=function(button){
							if(button.classList.contains('selected')){
								button.classList.remove('selected');
								if(trigger.name=='game'){
									event.control.style.opacity=0;
								}
								else{
									event.control.replace(['cancel']);
								}
							}
							else{
								for(var i=0;i<event.dialog.buttons.length;i++){
									event.dialog.buttons[i].classList.remove('selected');
								}
								button.classList.add('selected');
								event.control.replace(slist[button.link]);
								if(trigger.name=='game'&&getComputedStyle(event.control).opacity==0){
									event.control.style.transition='opacity 0.5s';
									ui.refresh(event.control);
									event.control.style.opacity=1;
									event.control.style.transition='';
									ui.refresh(event.control);
								}
								else{
									event.control.style.opacity=1;
								}
							}
							event.control.custom=event.clickControl;
						}
						event.custom.replace.window=function(){
							for(var i=0;i<event.dialog.buttons.length;i++){
								if(event.dialog.buttons[i].classList.contains('selected')){
									event.dialog.buttons[i].classList.remove('selected');
									if(trigger.name=='game'){
										event.control.style.opacity=0;
									}
									else{
										event.control.replace(['cancel']);
									}
									event.control.custom=event.clickControl;
									return;
								}
							}
						}
					}
					else{
						event.finish();
					}
				}
			},
			tongshuai3:{
				unique:true,
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					return player.storage.tongshuai&&player.storage.tongshuai.unowned&&player.storage.tongshuai.unowned.length>0;
				},
				content:function(){
					player.storage.tongshuai.get();
				}
			},
			cangming:{
				enable:'phaseUse',
				usable:1,
				unique:true,
				filter:function(event,player){
					if(player.isTurnedOver()) return false;
					var suits=[];
					var hs=player.getCards('h');
					for(var i=0;i<hs.length;i++){
						suits.add(get.suit(hs[i]));
						if(suits.length>=4) return true;
					}
					return false;
				},
				filterCard:function(card){
					var suit=get.suit(card);
					for(var i=0;i<ui.selected.cards.length;i++){
						if(suit==get.suit(ui.selected.cards[i])) return false;
					}
					return true;
				},
				complexCard:true,
				selectCard:4,
				check:function(card){
					return 10-get.value(card);
				},
				filterTarget:function(card,player,target){
					return player!=target;
				},
				selectTarget:-1,
				content:function(){
					target.goMad();
					if(!player.isTurnedOver()){
						player.turnOver();
					}
					player.addSkill('cangming2');
				},
				ai:{
					order:10,
					effect:{
						player:function(card,player){
							var num=0;
							for(var i=0;i<game.players.length;i++){
								if(get.attitude(player,game.players[i])<0){
									num++;
									if(num>1) break;
								}
							}
							if(num<=1) return;
							if(_status.currentPhase==player&&player.countCards('h')<player.hp&&player.hp>=6){
								if(typeof card=='string') return;
								if(card.name=='wuzhong') return;
								if(card.name=='shunshou') return;
								if(card.name=='yuanjiao') return;
								if(card.name=='yiyi') return;
								if(!player.hasSkill('cangming2')) return 'zeroplayertarget';
							}
						}
					},
					result:{
						target:function(player){
							var num=0;
							for(var i=0;i<game.players.length;i++){
								if(get.attitude(player,game.players[i])<0){
									num++;
									if(num>1) break;
								}
							}
							if(num<=1) return 0;
							return -10;
						}
					}
				},
			},
			cangming2:{
				trigger:{player:'phaseZhunbeiBegin'},
				forced:true,
				popup:false,
				content:function(){
					for(var i=0;i<game.players.length;i++){
						game.players[i].unMad();
					}
					player.removeSkill('cangming2');
				}
			},
			boss_moyan:{
				trigger:{player:'phaseEnd'},
				forced:true,
				unique:true,
				content:function(){
					"step 0"
					event.players=get.players(player);
					"step 1"
					if(event.players.length){
						event.players.shift().damage('fire');
						event.redo();
					}
				},
			},
			boss_stonebaolin:{
				inherit:'juece',
			},
			boss_stoneqiangzheng:{
				trigger:{player:'phaseJieshuBegin'},
				forced:true,
				unique:true,
				filter:function(event,player){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=player&&game.players[i].countCards('h')) return true;
					}
					return false;
				},
				content:function(){
					"step 0"
					var players=get.players(player);
					players.remove(player);
					event.players=players;
					player.line(players,'green');
					"step 1"
					if(event.players.length){
						var current=event.players.shift();
						var hs=current.getCards('h')
						if(hs.length){
							var card=hs.randomGet();
							player.gain(card,current);
							current.$giveAuto(card,player);
						}
						event.redo();
					}
				}
			},
			guanchuan:{
				trigger:{player:'useCardToPlayer'},
				getTargets:function(player,target){
					var targets=[];
					var pxy=player.getXY();
					var txy=target.getXY();
					var dx=txy[0]-pxy[0];
					var dy=txy[1]-pxy[1];
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=player&&game.players[i]!=target){
							var axy=game.players[i].getXY();
							var dx2=axy[0]-pxy[0];
							var dy2=axy[1]-pxy[1];
							if(dx*dx2<0) continue;
							if(dy*dy2<0) continue;
							if(dx==0){
								if(dx2==0){
									targets.push(game.players[i]);
								}
							}
							else if(dx2!=0){
								if(dy2/dx2==dy/dx){
									targets.push(game.players[i]);
								}
							}
						}
					}
					return targets;
				},
				filter:function(event,player){
					if(event.targets.length!=1||event.card.name!='sha') return false;
					return lib.skill.guanchuan.getTargets(player,event.targets[0]).length>0;
				},
				check:function(event,player){
					var targets=lib.skill.guanchuan.getTargets(player,event.targets[0]);
					var eff=0;
					for(var i=0;i<targets.length;i++){
						eff+=get.effect(targets[i],event.card,player,player);
					}
					return eff>0;
				},
				content:function(){
					var targets=lib.skill.guanchuan.getTargets(player,trigger.targets[0]);
					for(var i=0;i<targets.length;i++){
						trigger.targets.push(targets[i]);
					}
					player.logSkill('guanchuan',targets);
				}
			},
			sanjiansheji:{
				enable:'phaseUse',
				filter:function(event,player){
					return player.countCards('h','sha')>1&&lib.filter.filterCard({name:'sha'},player);
				},
				filterCard:{name:'sha'},
				selectCard:2,
				check:function(card){
					var num=0;
					var player=_status.event.player;
					for(var i=0;i<game.players.length;i++){
						if(lib.filter.targetEnabled({name:'sha'},player,game.players[i])&&
						get.effect(game.players[i],{name:'sha'},player)>0){
							num++;
							if(num>1) return 8-get.value(card);
						}
					}
					return 0;
				},
				selectTarget:[1,Infinity],
				discard:false,
				prepare:'throw',
				filterTarget:function(card,player,target){
					return lib.filter.targetEnabled({name:'sha'},player,target)&&
					get.distance(player,target,'pure')<=5;
				},
				content:function(){
					targets.sort(lib.sort.seat);
					player.useCard({name:'sha'},cards,targets,'luanjian').animate=false;
				},
				multitarget:true,
				ai:{
					order:function(){
						return get.order({name:'sha'})+0.1;
					},
					result:{
						target:function(player,target){
							return get.effect(target,{name:'sha'},player,target);
						}
					},
					effect:{
						player:function(card,player){
							if(_status.currentPhase!=player) return;
							if(card.name=='sha'&&player.countCards('h','sha')<2&&player.countCards('h')<=player.hp){
								var num=0;
								var player=_status.event.player;
								for(var i=0;i<game.players.length;i++){
									if(lib.filter.targetEnabled({name:'sha'},player,game.players[i])&&
									get.attitude(player,game.players[i])<0){
										num++;
										if(num>1) return 'zeroplayertarget';
									}
								}
							}
						}
					},
				}
			},
			zhiming:{
				trigger:{source:'damageBegin1'},
				filter:function(event,player){
					return get.distance(event.player,player,'attack')>1&&event.card&&event.card.name=='sha';
				},
				forced:true,
				content:function(){
					trigger.num++;
				}
			},
			lianshe:{
				mod:{
					cardUsable:function(card,player,num){
						if(card.name=='sha'){
							return num+player.getHistory('useCard',function(evt){
								return evt.card.name!='sha';
							}).length;
						}
					},
				},
				trigger:{player:'useCard'},
				frequent:true,
				filter:function(event,player){
					return event.card&&event.card.name=='sha'&&player.getHistory('useCard',function(evt){
						return evt.card.name=='sha';
					})[0]==event;
				},
				content:function(){
					player.draw();
				},
				ai:{
					threaten:1.5,
				}
			},
			pianyi:{
				direct:true,
				filter:function(event,player){
					return !player.getStat('damage');
				},
				content:function(){
					"step 0"
					player.chooseToMoveChess(2,get.prompt('pianyi'));
					"step 1"
					if(result.bool){
						player.logSkill('pianyi');
					}
				}
			},
			lingdong:{
				trigger:{player:'phaseJieshuBegin'},
				direct:true,
				filter:function(event,player){
					return player.getHistory('useCard',function(evt){
						return evt.card.name=='sha';
					}).length>0;
				},
				content:function(){
					"step 0"
					player.chooseToMoveChess(player.getHistory('useCard',function(evt){
						return evt.card.name=='sha';
					}).length,get.prompt('lingdong'));
					"step 1"
					if(result.bool){
						player.logSkill('lingdong');
					}
				}
			},
			_noactpunish:{
				trigger:{player:'useCard'},
				filter:function(event,player){
					return _status.currentPhase==player&&event.targets&&(event.targets.length>1||event.targets[0]!=player);
				},
				forced:true,
				popup:false,
				content:function(){
					player.addTempSkill('noactpunish');
				}
			},
			noactpunish:{},
			_chess_chuzhang:{
				enable:'phaseUse',
				usable:1,
				direct:true,
				delay:false,
				preservecancel:true,
				filter:function(event,player){
					var num=0;
					var xy=player.getXY();
					var neighbour;
					neighbour=player.getNeighbour(-1,0);
					if(neighbour&&typeof neighbour.tempObstacle!='number'&&game.obstacles.contains(neighbour)){
						num++;
					}
					else if(xy[0]==0){
						num++;
					}
					neighbour=player.getNeighbour(1,0);
					if(neighbour&&typeof neighbour.tempObstacle!='number'&&game.obstacles.contains(neighbour)){
						num++;
					}
					else if(xy[0]+1>=ui.chesswidth){
						num++;
					}
					neighbour=player.getNeighbour(0,-1);
					if(neighbour&&typeof neighbour.tempObstacle!='number'&&game.obstacles.contains(neighbour)){
						num++;
					}
					else if(xy[1]==0){
						num++;
					}
					neighbour=player.getNeighbour(0,1);
					if(neighbour&&typeof neighbour.tempObstacle!='number'&&game.obstacles.contains(neighbour)){
						num++;
					}
					else if(xy[1]+1>=ui.chessheight){
						num++;
					}
					return num>=3;
				},
				content:function(){
					'step 0'
					event.obstacles=[];
					event.movemap={};
					var neighbour;
					neighbour=player.getNeighbour(-1,0);
					if(neighbour&&typeof neighbour.tempObstacle!='number'&&game.obstacles.contains(neighbour)){
						event.obstacles.push(neighbour);
						if(player.movable(-2,0)){
							event.movemap['[-1,0]']=neighbour;
						}
					}
					neighbour=player.getNeighbour(1,0);
					if(neighbour&&typeof neighbour.tempObstacle!='number'&&game.obstacles.contains(neighbour)){
						event.obstacles.push(neighbour);
						if(player.movable(2,0)){
							event.movemap['[1,0]']=neighbour;
						}
					}
					neighbour=player.getNeighbour(0,-1);
					if(neighbour&&typeof neighbour.tempObstacle!='number'&&game.obstacles.contains(neighbour)){
						event.obstacles.push(neighbour);
						if(player.movable(0,-2)){
							event.movemap['[0,-1]']=neighbour;
						}
					}
					neighbour=player.getNeighbour(0,1);
					if(neighbour&&typeof neighbour.tempObstacle!='number'&&game.obstacles.contains(neighbour)){
						event.obstacles.push(neighbour);
						if(player.movable(0,2)){
							event.movemap['[0,1]']=neighbour;
						}
					}
					if(!event.obstacles.length){
						event.finish();
						return;
					}
					else if(event.obstacles.length==1){
						event.obstacle=event.obstacles[0];
					}
					else if(event.isMine()){
						for(var i=0;i<event.obstacles.length;i++){
							event.obstacles[i].classList.add('glow');
						}
						event.chooseObstacle=true;
						game.pause();
						_status.imchoosing=true;
						event.dialog=ui.create.dialog('移动一个与你相邻的路障');
						event.dialog.add('<div class="text">'+lib.translate._chess_chuzhang_info+'</div>');
						event.custom.replace.confirm=function(){
							player.getStat().skill._chess_chuzhang--;
							event.cancelled=true;
							game.resume();
						};
					}
					'step 1'
					if(ui.confirm){
						ui.confirm.classList.add('removing');
					}
					_status.imchoosing=false;
					if(!event.cancelled){
						if(!event.obstacle){
							event.obstacle=event.obstacles.randomGet();
						}
						var moved=false;
						for(var i in event.movemap){
							if(event.movemap[i]==event.obstacle){
								var xy=JSON.parse(i);
								if(game.moveObstacle(event.obstacle,xy[0],xy[1])){
									moved=true;
									break;
								}
							}
						}
						if(!moved){
							game.removeObstacle(event.obstacle);
						}
						player.popup('除障');
						game.delay();
					}
					for(var i=0;i<event.obstacles.length;i++){
						event.obstacles[i].classList.remove('glow');
					}
					if(event.dialog){
						event.dialog.close();
					}
				},
				ai:{
					result:{
						player:1
					},
					order:7.5
				}
			},
			_phasequeue:{
				trigger:{player:'phaseBegin'},
				forced:true,
				popup:false,
				content:function(){
					var current=ui.chessinfo.firstChild.querySelector('.glow2');
					if(current){
						current.classList.remove('glow2');
					}
					if(player.instance){
						player.instance.classList.add('glow2');
						ui.chessinfo.firstChild.scrollTop=player.instance.offsetTop-8;
					}
				}
			},
			_chessmove:{
				enable:'phaseUse',
				usable:1,
				direct:true,
				delay:false,
				preservecancel:true,
				filter:function(event,player){
					if(!player.movable(0,1)&&!player.movable(0,-1)&&
						!player.movable(1,0)&&!player.movable(-1,0)){
						return false;
					}
					var move=2;
					move=game.checkMod(player,move,'chessMove',player);
					return move>0;
				},
				content:function(){
					"step 0"
					var move=2;
					move=game.checkMod(player,move,'chessMove',player);
					player.chooseToMoveChess(move).phasing=true;
					"step 1"
					if(ui.confirm){
						ui.confirm.classList.add('removing');
					}
					if(!result.bool){
						var skill=player.getStat().skill;
						skill._chessmove--;
						if(typeof skill._chessmovetried=='number'){
							skill._chessmovetried++;
						}
						else{
							skill._chessmovetried=1;
						}
					}
				},
				ai:{
					order:5,
					result:{
						playerx:function(player){
							if(get.mode()=='tafang'&&_status.enemies.contains(player)){
								return 1;
							}
							var nh=player.countCards('h');
							if(!player.countCards('h','sha')&&
							!player.countCards('h','shunshou')&&
							!player.countCards('h','bingliang')){
								if(nh<=Math.min(3,player.hp)) return Math.random()-0.3;
								else if(nh<=Math.min(2,player.hp)) return Math.random()-0.4;
								return Math.random()-0.5;
							}
							var neighbour;
							neighbour=player.getNeighbour(0,1);
							if(neighbour&&game.players.contains(neighbour)&&neighbour.side!=player.side){
								if(get.distance(player,neighbour,'attack')<1) return 1;
								return 0;
							}
							neighbour=player.getNeighbour(0,-1);
							if(neighbour&&game.players.contains(neighbour)&&neighbour.side!=player.side){
								if(get.distance(player,neighbour,'attack')<1) return 1;
								return 0;
							}
							neighbour=player.getNeighbour(1,0);
							if(neighbour&&game.players.contains(neighbour)&&neighbour.side!=player.side){
								if(get.distance(player,neighbour,'attack')<1) return 1;
								return 0;
							}
							neighbour=player.getNeighbour(-1,0);
							if(neighbour&&game.players.contains(neighbour)&&neighbour.side!=player.side){
								if(get.distance(player,neighbour,'attack')<1) return 1;
								return 0;
							}
							return 1;
						},
						player:function(player){
							if(player.getStat().skill._chessmovetried>=10){
								return 0;
							}
							var x=lib.skill._chessmove.ai.result.playerx(player);
							if(player.isMad()) return -x;
							return x;
						}
					}
				}
			},
			_chesscenter:{
				trigger:{player:['phaseBegin','useCardBegin','useSkillBegin','respondBegin','damageBegin','loseHpBegin'],
				target:'useCardToBegin'},
				forced:true,
				priority:100,
				popup:false,
				content:function(){
					player.chessFocus();
				},
			},
			boss_bfengxing:{
				mod:{
					chessMove:function(player,current){
						return current+2;
					},
					attackFrom:function(from,to,current){
						return current-2;
					},
				},
				trigger:{player:'phaseDrawBegin2'},
				forced:true,
				filter:function(event){
					return !event.numFixed;
				},
				content:function(){
					trigger.num+=2;
				}
			},
			boss_chiyu:{
				enable:'phaseUse',
				usable:1,
				filterCard:{color:'red'},
				nodelay:true,
				check:function(card){return 8-get.value(card);},
				filterTarget:function(card,player,target){
					return get.distance(player,target)<=5&&player!=target;
				},
				filter:function(event,player){
					return player.countCards('h',{color:'red'})>0;
				},
				selectTarget:-1,
				content:function(){
					target.damage('fire');
				},
				line:'fire',
				ai:{
					order:1,
					result:{
						target:function(player,target){
							return get.damageEffect(target,player,target,'fire');
						}
					}
				}
			},
			boss_tenglong:{
				enable:'phaseUse',
				usable:1,
				position:'he',
				filterCard:{type:'equip'},
				init:function(player){
					for(var i=1;i<6;i++){
						player.$disableEquip('equip'+i);
					};
				},
				check:function(card){
					var player=_status.currentPhase;
					if(player.countCards('he',{subtype:get.subtype(card)})>1){
						return 12-get.equipValue(card);
					}
					return 8-get.equipValue(card);
				},
				filter:function(event,player){
					return player.countCards('he',{type:'equip'});
				},
				filterTarget:function(card,player,target){
					return player!=target&&get.distance(player,target)<=2;
				},
				content:function(){
					target.damage(3,'fire');
				},
				ai:{
					order:9,
					result:{
						target:function(player,target){
							return get.damageEffect(target,player,target,'fire');
						}
					}
				}
			},
			boss_wuying:{
				mod:{
					globalTo:function(from,to,distance){
						return distance+2;
					},
					chessMove:function(player,current){
						return current-1;
					}
				}
			},
			boss_wushang:{
				trigger:{player:'phaseZhunbeiBegin'},
				forced:true,
				filter:function(event,player){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=player&&game.players[i].countCards('h')&&
							get.distance(player,game.players[i])<=5){
							return true;
						}
					}
					return false;
				},
				content:function(){
					"step 0"
					var players=[];
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=player&&game.players[i].countCards('h')&&
							get.distance(player,game.players[i])<=5){
							players.push(game.players[i]);
						}
					}
					players.sort(lib.sort.seat);
					event.players=players;
					"step 1"
					if(event.players.length){
						event.current=event.players.shift();
						event.current.chooseCard('神天并地：交给'+get.translation(player)+'一张手牌',true);
					}
					else{
						event.finish();
					}
					"step 2"
					if(result.cards.length){
						player.gain(result.cards,event.current);
						event.current.$give(1,player);
						event.goto(1);
					}
				}
			}
		},
"translate": {
			zhu_config:'启用主将',
			main_zhu_config:'启用副将',
			noreplace_end_config:'无替补时结束',
			reward_config:'杀敌摸牌',
			punish_config:'杀死队友',
			seat_order_config:'行动顺序',
			battle_number_config:'对战人数',
			replace_number_config:'替补人数',
			first_less_config:'先手少摸牌',
			single_control_config:'单人控制',
			additional_player_config:'无尽模式',
			choice_number_config:'无尽模式候选',

			friend:'友',
			enemy:'敌',
			neutral:'中',
			trueColor:"zhu",
			falseColor:"wei",
			_chessmove:'移动',
			leader:'君主',
			combat:'对阵',
			chessscroll_speed_config:'边缘滚动速度',
			chess_character_config:'战棋武将',
			only_chess_character_config:'只用战棋武将',
			chess_ordered_config:'指定行动顺序',
			chess_mode_config:'游戏模式',
			chess_leader_save_config:'选择历程',
			chess_leader_clear_config:'清除进度',
			save1:'一',
			save2:'二',
			save3:'三',
			save4:'四',
			save5:'五',

			leader_2:' ',
			leader_2_bg:'二',
			leader_3:' ',
			leader_3_bg:'三',
			leader_5:' ',
			leader_5_bg:'五',
			leader_8:' ',
			leader_8_bg:'八',

			leader_easy:' ',
			leader_easy_bg:'简单',
			leader_medium:' ',
			leader_medium_bg:'普通',
			leader_hard:' ',
			leader_hard_bg:'困难',

			chess_caocao:'曹操',
			chess_xunyu:'荀彧',
			chess_simayi:'司马懿',
			chess_xiahoudun:'夏侯惇',
			chess_dianwei:'典韦',
			chess_xuzhu:'许褚',
			chess_zhangliao:'张辽',
			chess_jiaxu:'贾诩',

			chess_liubei:'刘备',
			chess_guanyu:'关羽',
			chess_zhangfei:'张飞',
			chess_zhaoyun:'赵云',
			chess_machao:'马超',
			chess_huangzhong:'黄忠',
			chess_maliang:'马良',
			chess_zhugeliang:'诸葛亮',

			chess_sunquan:'孙权',
			chess_zhouyu:'周瑜',
			chess_lvmeng:'吕蒙',
			chess_huanggai:'黄盖',
			chess_lusu:'鲁肃',
			chess_luxun:'陆逊',
			chess_ganning:'甘宁',
			chess_taishici:'太史慈',

			chess_lvbu:'吕布',
			chess_sunshangxiang:'孙尚香',
			chess_diaochan:'貂蝉',
			chess_huatuo:'华佗',
			chess_zhangjiao:'张辽',
			chess_menghuo:'孟获',

			chess_dongzhuo:'董卓',
			chess_xingtian:'刑天',
			chess_jinchidiao:'金翅雕',
			chess_beimingjukun:'北溟巨鲲',
			chess_wuzhaojinlong:'五爪金龙',

			treasure_dubiaoxianjing:'毒镖陷阱',
			treasure_jiqishi:'集气石',
			treasure_shenmidiaoxiang:'神秘雕像',
			treasure_shenpanxianjing:'审判之刃',
			treasure_shiyuansu:'石元素',
			treasure_wuyashenxiang:'乌鸦神像',

			dubiaoxianjing:'飞刃',
			dubiaoxianjing_info:'距离两格体力值大于1的角色在回合结束后受到一点伤害，然后摸两张牌',
			jiqishi:'集气',
			jiqishi_info:'距离两格以内的已受伤角色在回合结束后回复一点体力，然后弃置两张牌',
			shenmidiaoxiang:'秘咒',
			shenmidiaoxiang_info:'距离三格以外的所有角色在回合结束后强制向此处移动一格',
			shenpanxianjing:'审判',
			shenpanxianjing_info:'在任意一名角色回合结束后，若没有其他角色手牌数比其多，随机弃置其一张手牌',
			shiyuansu:'护体',
			shiyuansu_info:'任意一名角色一次性受到不少于两点伤害后，使其获得一点护甲',
			wuyashenxiang:'厄音',
			wuyashenxiang_info:'距离3格以内的角色在其回合结束后，若体力值不大于1，令其回复一点体力，然后将牌堆中的一张延时锦囊牌置于其判定区',

			leader_caocao:'曹操',
			leader_liubei:'刘备',
			leader_sunquan:'孙权',
			leader_yuri:'由理',
			leader_xiaoxiong:'枭雄',
			leader_xiaoxiong_info:'当你造成伤害后，获胜后会得到一定数量的额外金币奖励。',
			leader_renyi:'仁义',
			leader_renyi_info:'你招降敌将的成功率大幅增加。',
			leader_mouduan:'谋断',
			leader_mouduan_info:'其他友方角色回合内的行动范围+1。',
			leader_zhenlve:'缜略',
			leader_zhenlve_info:'友方角色使用的普通锦囊牌不可被【无懈可击】响应。',

			tongshuai:'统率',
			tongshuai_info:'准备阶段和结束阶段，你可以选择一名未上场的已方武将的一个技能作为你的技能',
			leader_zhaoxiang:'招降',
			leader_zhaoxiang_info:'出牌阶段限一次，你可以尝试对相邻敌方武将进行招降，若成功，你获得该武将并立即结束本局游戏，若失败，你受到一点伤害。每发动一次消耗10招募令。',

			common:'普通',
			rare:'精品',
			epic:'史诗',
			legend:'传说',

			chess_shezhang:'设置路障',
			chess_shezhang_info:'选择一名角色，在其四周设置临时路障，持续X回合（X为存活角色数）。',
			chess_chuzhang:'清除路障',
			chess_chuzhang_info:'将与你相邻的路障向后推移一格，每影响一个路障你摸一张牌。',

			_chess_chuzhang:'除障',
			_chess_chuzhang_info:'出牌阶段限一次，若你周围四格至少有三个为障碍或在边缘外，你可以选择将其中一个障碍向后推移一格（若无法推移则改为清除之）。',

			arenaAdd:'援军',
			arenaAdd_info:'出牌阶段限一次，你可以令一名未出场的已方角色加入战场。战斗结束后，该角色无论是否存活均不能再次出场。',

			pianyi:'翩仪',
			pianyi_info:'结束阶段，若你于本回合内未造成过伤害，你获得一次移动机会。',
			lingdong:'灵动',
			lingdong_info:'结束阶段，你可以移动至多X格（X为你本回合内使用【杀】的次数）。',
			lianshe:'箭舞',
			lianshe_info:'当你于一回合内首次使用【杀】时，你可以摸一张牌；你的回合内，当你使用一张不为【杀】的牌时，你令本回合内使用【杀】的次数上限+1。',
			zhiming:'穿杨',
			zhiming_info:'锁定技，当你使用【杀】造成伤害时，若你不在目标角色的攻击范围内，此伤害+1。',
			sanjiansheji:'散箭',
			sanjiansheji_info:'你可以将两张【杀】当做【杀】使用，你以此法使用的【杀】可以指定距离5格内的角色为目标。',
			guanchuan:'强弩',
			guanchuan_info:'当你使用【杀】指定唯一目标后，你可令攻击射线内的其他角色也成为此【杀】的目标。',

			boss_stoneqiangzheng:'强征',
			boss_stoneqiangzheng_info:'锁定技，结束阶段，你获得所有其他角色的各一张手牌。',
			boss_stonebaolin:'暴凌',
			boss_moyan:'魔焰',
			boss_moyan_info:'锁定技，结束阶段，你对场上所有角色造成1点火焰伤害。',

			cangming:'颠动沧溟',
			cangming_info:'出牌阶段限一次，你可弃置四张花色不同的手牌并将武将牌翻至背面，然后令所有其他角色进入混乱状态直到你的下一回合开始。',
			boss_bfengxing:'风行',
			boss_bfengxing_info:'锁定技，摸牌阶段，你多摸两张牌；你的攻击范围+2；你回合内的移动距离+2。',
			boss_chiyu:'炽羽',
			boss_chiyu_info:'出牌阶段限一次，你可以弃置一张红色牌，对距离5以内的所有其他角色各造成一点火焰伤害。',
			boss_tenglong:'腾龙八齐',
			boss_tenglong_info:'锁定技，你废除你的装备区；出牌阶段限一次，你可以弃置一张装备牌并对一名距离你2以内的其他角色造成3点火焰伤害。',
			boss_wushang:'神天并地',
			boss_wushang_info:'锁定技，准备阶段，距离你5以内的所有其他角色需交给你一张手牌。',
			boss_wuying:'无影',
			boss_wuying_info:'锁定技，你回合内的移动距离-1；其他角色至你的距离+2。',

			chess_default:'常规',
			chess_boss:'魔王',
			chess_leader:'君主',

			mode_chess_character_config:'战棋模式',
			mode_chess_card_config:'战棋模式',
		}
};
}
