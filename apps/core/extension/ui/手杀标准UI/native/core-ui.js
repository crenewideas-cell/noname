window.shoushaCoreUI=function(lib,game,ui,get,ai,_status,bridge){
const localStorage=bridge.storage,sessionStorage=bridge.session;

if(typeof game.updateBackground !== 'function') game.updateBackground=function(){
			if(_status.videoBackground) {
			    game.videoBackground(_status.videoBackground);
			    return;
			}
			//都是一时的
			if(_status.tempVideoBackground) {
			    game.videoBackground(_status.tempVideoBackground, 200, false, 'fill');
			    return;
			}
			var background=(_status.tempBackground||lib.config.image_background);
			var ransS=function(groups) {
		        var BGset;
		        if(!game.ranBGset||!groups.contains(game.ranBGset)) {
		            BGset=groups.randomGet();
		            game.ranBGset=BGset;
		        }else {
		            BGset=game.ranBGset;
		        }
		        return BGset;
		    };
			if(background=='4') background=ransS(['1','2','3']);
			if(background=='groups') background=ransS(['wei','shu','wu','qun']);
			if(background=='groups2') background=ransS(['wei2','shu2','wu2','qun2']);
			if(background=='24st') background='24st/'+['白露', '处暑', '春分', '大寒', '大暑', '大雪', '冬至', '谷雨', '寒露', '惊蛰', '立春', '立冬', '立秋', '立夏', '芒种', '清明', '秋分', '霜降', '夏至', '小寒', '小满', '小暑', '小雪', '雨水'].randomGet();
		    let currentIndex = get.currentStyle(ui.background)['z-index'];
		    ui.background.delete();
			ui.background=ui.create.div('.background');

			if(lib.config.image_background_blur){
				ui.background.style.filter='blur(8px)';
				ui.background.style.webkitFilter='blur(8px)';
				ui.background.style.transform='scale(1.05)';
			}
			else{
				ui.background.style.filter='';
				ui.background.style.webkitFilter='';
				ui.background.style.transform='';
			}

			document.body.insertBefore(ui.background,document.body.firstChild);
			if(background.indexOf('ext:')==0){
				ui.background.setBackgroundImage('extension/'+background.slice(4));
			}
			else if(background=='default'){
				ui.background.animate('start');
				ui.background.style.backgroundImage="none";
			}
			else if(background.indexOf('custom_')==0){
				ui.background.style.backgroundImage="none";
				game.getDB('image',background,function(fileToLoad){
					if(!fileToLoad) return;
					var fileReader = new FileReader();
					fileReader.onload = function(fileLoadedEvent)
					{
						var data = fileLoadedEvent.target.result;
						ui.background.style.backgroundImage='url('+data+')';
					};
					fileReader.readAsDataURL(fileToLoad, "UTF-8");
				});
			}
			else{
				ui.background.setBackgroundImage('image/background/'+background+'.jpg');
			}
			ui.background.style.backgroundSize='cover';
			ui.background.style.backgroundPosition='50% 50%';
			//适应身份场、斗地主选将
			ui.background.style.zIndex=currentIndex;
		};
if(typeof game.updateRenku !== 'function') game.updateRenku=function(){
			game.broadcast(function(renku){
				_status.renku=renku;
			},_status.renku);
			for(var i of game.players){
				if(i.storage.renku) i.markSkill('renku');
			}
		};
if(typeof game.loseAsync !== 'function') game.loseAsync=function(arg){
			var next=game.createEvent('loseAsync');
			next.forceDie=true;
			next.getd=function(player,key,position){
				if(!position) position=ui.discardPile;
				if(!key) key='cards';
				var cards=[],event=this;
				game.checkGlobalHistory('cardMove',function(evt){
					if(evt.name!='lose'||evt.position!=position||evt.getParent()!=event) return;
					if(player&&player!=evt.player) return;
					cards.addArray(evt[key]);
				});
				return cards;
			};
			next.getl=function(player){
				const that=this;
				const map={
					player:player,
					hs:[],
					es:[],
					js:[],
					ss:[],
					xs:[],
					cards:[],
					cards2:[],
					gaintag_map:{},
				};
				player.checkHistory('lose',function(evt){
					if(evt.parent==that){
						map.hs.addArray(evt.hs);
						map.es.addArray(evt.es);
						map.js.addArray(evt.js);
						map.ss.addArray(evt.ss);
						map.xs.addArray(evt.xs);
						map.cards.addArray(evt.cards);
						map.cards2.addArray(evt.cards2);
						for(let key in evt.gaintag_map){
							if(!map.gaintag_map[key]) map.gaintag_map[key]=[];
							map.gaintag_map[key].addArray(evt.gaintag_map[key]);
						}
					}
				});
				return map;
			};
			next.getg=function(player){
				var that=this;
				var cards=[];
				player.checkHistory('gain',function(evt){
					if(evt.parent==that){
						cards.addArray(evt.cards);
					}
				});
				return cards;
			};
			if(arg&&get.is.object(arg)){
				for(var i in arg) next[i]=arg[i];
			}
			return next;
		};
if(typeof game.getRarity !== 'function') game.getRarity=function(name){
			var rank=lib.rank.rarity;
			if(rank.legend.contains(name)) return 'legend';
			if(rank.epic.contains(name)) return 'epic';
			if(rank.rare.contains(name)) return 'rare';
			if(get.mode()!='chess'&&rank.junk.contains(name)) return 'junk';
			return 'common';
		};
if(typeof game.checkGlobalHistory !== 'function') game.checkGlobalHistory=function(key,filter,last){
			if(!key) return _status.globalHistory[_status.globalHistory.length-1];
			if(!filter) return _status.globalHistory[_status.globalHistory.length-1][key];
			else{
				const history=game.getGlobalHistory(key);
				if(last){
					const lastIndex=history.indexOf(last);
					history.forEach((event,index)=>{
						if(index>lastIndex) return false;
						return filter(event);
					});
				}
				else{
					history.forEach(filter);
				}
			}
		};
if(typeof game.getGlobalHistory !== 'function') game.getGlobalHistory=function(key,filter,last){
			if(!key) return _status.globalHistory[_status.globalHistory.length-1];
			if(!filter) return _status.globalHistory[_status.globalHistory.length-1][key];
			else{
				const history=game.getGlobalHistory(key);
				if(last){
					const lastIndex=history.indexOf(last);
					return history.filter((event,index)=>{
						if(index>lastIndex) return false;
						return filter(event);
					})
				}
				return history.filter(filter);
			}
		};
if(typeof game.cardsDiscard !== 'function') game.cardsDiscard=function(cards){
			var type=get.itemtype(cards);
			if(type!='cards'&&type!='card') return;
			var next=game.createEvent('cardsDiscard');
			next.cards=type=='cards'?cards.slice(0):[cards];
			next.setContent('cardsDiscard');
			next.getd=function(player,key,position){
				return this.cards.slice(0);
			};
			return next;
		};
if(typeof game.cardsGotoOrdering !== 'function') game.cardsGotoOrdering=function(cards){
			var type=get.itemtype(cards);
			if(type!='cards'&&type!='card') return;
			var next=game.createEvent('cardsGotoOrdering');
			next.cards=type=='cards'?cards.slice(0):[cards];
			next.setContent('cardsGotoOrdering');
			return next;
		};
if(typeof game.cardsGotoSpecial !== 'function') game.cardsGotoSpecial=function(cards,bool){
			var type=get.itemtype(cards);
			if(type!='cards'&&type!='card') return;
			var next=game.createEvent('cardsGotoSpecial');
			next.cards=type=='cards'?cards.slice(0):[cards];
			if(bool=='toRenku') next.toRenku=true;
			else if(bool===false) next.notrigger=true;
			next.setContent('cardsGotoSpecial');
			return next;
		};
if(typeof game.isMine !== 'function') game.isMine=function(target){
			var player=target||_status.event?.player;
			return (player&&(player==game.me||player.isUnderControl())&&!_status.auto&&!player.isMad()&&!game.notMe);
		};
if(typeof game.checkFileList !== 'function') game.checkFileList=function(updates,proceed){
			var n=updates.length;
			if(!n){
				proceed(n);
			}
			for(var i=0;i<updates.length;i++){
				if(lib.node&&lib.node.fs){
					lib.node.fs.access(__dirname+'/'+updates[i],(function(entry){
						return function(err){
							if(!err){
								var stat=lib.node.fs.statSync(__dirname+'/'+entry);
								if(stat.size==0){
									err=true;
								}
							}
							if(err){
								n--;
								if(n==0){
									proceed();
								}
							}
							else{
								n--;
								updates.remove(entry);
								if(n==0){
									proceed();
								}
							}
						}
					}(updates[i])));
				}
				else{
					resolveLocalFileSystemURL(lib.assetURL+updates[i],(function(name){
						return function(entry){
							n--;
							updates.remove(name);
							if(n==0){
								proceed();
							}
						}
					}(updates[i])),function(){
						n--;
						if(n==0){
							proceed();
						}
					});
				}
			}
		};
if(typeof game.updateWaiting !== 'function') game.updateWaiting=function(){
			var map=[];
			for(var i=0;i<game.connectPlayers.length;i++){
				var player=game.connectPlayers[i];
				if(player.playerid){
					if(!game.onlinezhu){
						game.onlinezhu=player.playerid;
						game.send('server','changeAvatar',player.nickname,player.avatar);
						_status.onlinenickname=player.nickname;
						_status.onlineavatar=player.avatar;
					}
					map[i]=[player.nickname,player.avatar,player.playerid];
					if(player.playerid==game.onlinezhu){
						map[i].push('zhu');
					}
				}
				else if(player.classList.contains('unselectable2')){
					map[i]='disabled';
				}
				else{
					map[i]=null;
				}
			}
			game.broadcast('updateWaiting',map);
		};
if(typeof game.countChoose !== 'function') game.countChoose=function(clear){
			if(_status.imchoosing){
				return;
			}
			_status.imchoosing=true;
			if(_status.connectMode&&!_status.countDown){
				ui.timer.show();
				var num;
				//这么一大行都是为了祢衡
				if(_status.event&&_status.event.name=='chooseToUse'&&_status.event.type=='phase'&&
					_status.event.player&&_status.event.player.forceCountChoose&&
					typeof _status.event.player.forceCountChoose.phaseUse=='number'){
					num=_status.event.player.forceCountChoose.phaseUse;
				}
				else if(_status.connectMode){
					num=lib.configOL.choose_timeout;
				}
				else{
					num=get.config('choose_timeout');
				}
				game.countDown(parseInt(num),function(){
					ui.click.auto();
					ui.timer.hide();
				});
				if(!game.online&&game.me){
					if(_status.event.getParent().skillHidden){
						for(var i=0;i<game.players.length;i++){
							game.players[i].showTimer();
						}
						game.me._hide_all_timer=true;
					}
					else if(!_status.event._global_waiting){
						game.me.showTimer();
					}
				}
			}
			else if(_status.event.player.forceCountChoose&&_status.event.isMine()&&!_status.countDown){
				var info=_status.event.player.forceCountChoose;
				var num;
				if(_status.event.name=='chooseToUse'&&_status.event.type=='phase'&&typeof info.phaseUse=='number'){
					num=info.phaseUse;
				}
				else if(typeof info[_status.event.name]=='number'){
					num=info[_status.event.name]
				}
				else if(info.default){
					num=info.default;
				}
				else return;
				var finish=function(){
					if(_status.event.endButton){
						if(_status.event.skill){
							ui.click.cancel();
						}
						ui.click.cancel();
					}
					else{
						if(ui.confirm&&ui.confirm.str){
							if(ui.confirm.str.indexOf('c')!=-1){
								ui.click.cancel();
							}
							else if(ui.confirm.str.indexOf('o')!=-1){
								ui.click.ok();
							}
						}
						else if(['chooseControl','chooseBool'].contains(_status.event.name)&&_status.paused){
							_status.event.result='ai';
							game.resume();
						}
						else{
							ui.click.auto('forced');
							setTimeout(function(){
								ui.click.auto('forced');
							},200);
						}
					}
					ui.timer.hide();
				};
				if(!num){
					ui.timer.hide();
					game.uncheck();
					setTimeout(finish,200);
				}
				else{
					ui.timer.show();
					game.countDown(num,finish);
				}
			}
		};
if(typeof game.stopCountChoose !== 'function') game.stopCountChoose=function(){
			if(_status.countDown){
				clearInterval(_status.countDown);
				delete _status.countDown;
				ui.timer.hide();
			}
			if(_status.connectMode&&!game.online&&game.me){
				if(game.me._hide_all_timer){
					delete game.me._hide_all_timer;
					for(var i=0;i<game.players.length;i++){
						game.players[i].hideTimer();
					}
				}
				else if(!_status.event._global_waiting){
					game.me.hideTimer();
				}
			}
		};
if(typeof game.helaAudio !== 'function') game.helaAudio=function(){
			var str='';
			var onerror=null;
			var type='audio';
			var volume=0;
			for(var i=0;i<arguments.length;i++){
				if(arguments[i]==='background'){
				    type='background';
				}
				else if(typeof arguments[i]==='string'){
					str+='/'+arguments[i];
				}
				else if(typeof arguments[i]=='number'){
				    volume=arguments[i]/8;
				}
				else if(typeof arguments[i]=='function'){
					onended=arguments[i]
				}
			}
		    game.helaAudioMuc=document.createElement('audio');
		    game.helaAudioMuc.autoplay=true;
		    //game.helaAudioMuc.volume=lib.config.volumn_audio/8;
		    game.helaAudioMuc.volume=volume||(lib.config['volumn_'+type]/8);
		    if(str.split('/').pop().split('.').length>1){
		    	game.helaAudioMuc.src=lib.assetURL+'audio'+str;
		    }
		    else{
		    	game.helaAudioMuc.src=lib.assetURL+'audio'+str+'.mp3';
		    }
		    game.helaAudioMuc.addEventListener('ended',function(){
			    this.remove();
		    });
		    game.helaAudioMuc.onerror=function(e){
			    if(this._changed){
			    	this.remove();
			    }
			    else{
				    this.src=lib.assetURL+'audio'+str+'.ogg';
			    	this._changed=true;
			    }
		    };
		    if(onended) game.helaAudioMuc.onended=onended;
			//Some browsers do not support "autoplay", so "oncanplay" listening has been added
			game.helaAudioMuc.oncanplay=function(){
				Promise.resolve(this.play()).catch(()=>void 0);
			};
			return game.helaAudioMuc;
		};
if(typeof game.trySkillAudio !== 'function') game.trySkillAudio=function(skill,player,directaudio,forceTaixu){
			//嗨害嗨，这里改让太虚幻境可以播放适合性别的语音
			game.broadcast(game.trySkillAudio,skill,player,directaudio);
			var info=get.info(skill);
			if(!info) return;
			if(info.direct&&!directaudio) return;
			if(!lib.config.background_speak) return;
			if(lib.skill.global.contains(skill)&&!lib.skill[skill].forceaudio) return;
			//交给太虚处理啦
			if(get.mode()=='taixuhuanjing'&&lib.translate[skill]&&lib.translate[skill+'_info']&&!forceTaixu) {
			    var name=player.name||player.name1;
			    if(name&&lib.character[name]&&(name.indexOf('txhj_')==0||(window.txhj_libCharacterChg&&!(window.txhj_libCharacterChg[name]&&window.txhj_libCharacterChg[name][3]&&window.txhj_libCharacterChg[name][3].contains(skill))))) {
			        return game.tryTaixuAudio(skill,player,directaudio);
			    }
			}
			var audioname=skill;
			var audioinfo=info.audio;
			var fixednum;
			if(info.audioname2&&player&&info.audioname2[player.name]){
				audioname=info.audioname2[player.name];
				audioinfo=lib.skill[audioname].audio;
			}
			var history=[];
			while(true){//可以嵌套引用了
				if(history.contains(audioname)) break;
				history.push(audioname);
				if(typeof audioinfo=='string'&&lib.skill[audioinfo]){
					audioname=audioinfo;
					audioinfo=lib.skill[audioname].audio;
					continue;
				}
				if(Array.isArray(audioinfo)){
					audioname=audioinfo[0];
					if(!fixednum) fixednum=audioinfo[1];//数组会取第一个指定语音数
					audioinfo=lib.skill[audioname].audio;
					continue;
				}
				break;
			}
			if(Array.isArray(info.audioname)&&player){
				if(info.audioname.contains(player.name)) audioname+='_'+player.name;
				else if(info.audioname.contains(player.name1)) audioname+='_'+player.name1;
				else if(info.audioname.contains(player.name2)) audioname+='_'+player.name2;
			}
			if(typeof audioinfo=='string'){
				if(audioinfo.indexOf('ext:')!=0) return;
				audioinfo=audioinfo.split(':');
				if(audioinfo.length!=3) return;
				if(audioinfo[2]=='true') game.playAudio('..','extension',audioinfo[1],audioname);
				else{
					audioinfo[2]=parseInt(audioinfo[2]);
					if(fixednum) audioinfo[2]=Math.min(audioinfo[2],fixednum);
					if(!audioinfo[2]) return;
					game.playAudio('..','extension',audioinfo[1],audioname+Math.ceil(audioinfo[2]*Math.random()));
				}
			}
			else if(typeof audioinfo=='number'){
				if(fixednum) audioinfo=Math.min(audioinfo, fixednum);
				game.playAudio('skill',audioname+Math.ceil(audioinfo*Math.random()));
			}
			else if(audioinfo) game.playAudio('skill',audioname);
			else if(info.audio!==false) game.playSkillAudio(audioname);
		};
if(typeof game.playSkillAudio !== 'function') game.playSkillAudio=function(name,index){
			if(_status.video&&arguments[1]!='video') return;
			if(!lib.config.repeat_audio&&_status.skillaudio.contains(name)) return;
			game.addVideo('playSkillAudio',null,name);
			if(name.indexOf('|')<name.lastIndexOf('|')){
				name=name.slice(name.lastIndexOf('|')+1);
			}
			_status.skillaudio.add(name);
			setTimeout(function(){
				_status.skillaudio.remove(name);
			},1000);
			var str='audio/skill/';
			var audio=document.createElement('audio');
			audio.autoplay=true;
			audio.volume=lib.config.volumn_audio/8;
			audio.src=lib.assetURL+str+name+'.mp3';
			audio.addEventListener('ended',function(){
				this.remove();
			});
			if(typeof index!='number'){
				index=Math.ceil(Math.random()*2);
			}
			audio._changed=1;
			audio.onerror=function(){
				switch(this._changed){
					case 1:{
						audio.src=lib.assetURL+str+name+'.ogg';
						this._changed=2;
						break;
					}
					case 2:{
						audio.src=lib.assetURL+str+name+index+'.mp3';
						this._changed=3;
						break;
					}
					case 3:{
						audio.src=lib.assetURL+str+name+index+'.ogg';
						this._changed=4;
						break;
					}
					default:{
						this.remove();
					}
				}
			};
			//Some browsers do not support "autoplay", so "oncanplay" listening has been added
			audio.oncanplay=function(){
				Promise.resolve(this.play()).catch(()=>void 0);
			};
			ui.window.appendChild(audio);
		};
if(typeof game.export !== 'function') game.export=function(textToWrite,name){
			var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
			var fileNameToSaveAs = name||'noname';
			fileNameToSaveAs=fileNameToSaveAs.replace(/\\|\/|\:|\?|\"|\*|<|>|\|/g,'.');

			if(lib.device){
				var directory;
				if(lib.device=='android'){
					directory=cordova.file.externalDataDirectory;
				}
				else{
					directory=cordova.file.documentsDirectory;
				}
				window.resolveLocalFileSystemURL(directory,function(entry){
					entry.getFile(fileNameToSaveAs,{create:true},function(fileEntry){
						fileEntry.createWriter(function(fileWriter){
							fileWriter.onwriteend=function(){
								alert('文件已导出至'+directory+fileNameToSaveAs);
							}
							fileWriter.write(textFileAsBlob)
						});
					});
				});
			}
			else{
				var downloadLink = document.createElement("a");
				downloadLink.download = fileNameToSaveAs;
				downloadLink.innerHTML = "Download File";
				downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				downloadLink.click();
			}
		};
if(typeof game.multiDownload !== 'function') game.multiDownload=function(list,onsuccess,onerror,onfinish,process,dev){
			if(lib.config.dev) game.print(get.url());
			var args=Array.from(arguments);
			if(list.length<=3){
				game.multiDownload2.apply(this,args);
			}
			else{
				var num=Math.round(list.length/3);
				var left=3;
				args[3]=function(){
					left--;
					if(left==0){
						onfinish();
					}
				};
				setTimeout(function(){
					args[0]=list.slice(0,num);game.multiDownload2.apply(game,args);
				});
				setTimeout(function(){
					args[0]=list.slice(num,2*num);game.multiDownload2.apply(this,args);
				},200);
				setTimeout(function(){
					args[0]=list.slice(2*num);game.multiDownload2.apply(this,args);
				},400);
			}
		};
if(typeof game.playVideo !== 'function') game.playVideo=function(time,mode){
		    localStorage.setItem('compatiblemodeVideo',1);
			if(!_status.replayvideo){
				localStorage.setItem(lib.configprefix+'playbackmode',lib.config.mode);
			}
			game.saveConfig('mode',mode);
			localStorage.setItem(lib.configprefix+'playback',time);
			game.reload();
		};
if(typeof game.storyBackground !== 'function') game.storyBackground=function(set){
		if(_status.tempVideoBackground) {
		    _status.tempVideoBackground = undefined;
		    game.updateBackground();
		}
		if(!lib.config.image_background_story) return;
		if(!lib.config['storyBG_default']) game.saveConfig('storyBG_default',lib.config['image_background']);
			if(_status.htmlbg){
				game.saveConfig('image_background',_status.htmlbg);
			}
			else{
			    var mode=lib.config.mode;
			    if(game.storyBgMode) mode=game.storyBgMode;
			    var offline=sessionStorage.getItem('Network');
			    if(!offline) offline='basic';
			    var BGset=lib.config['storyBG_'+offline+'_'+mode];
			    if(!BGset&&lib.config['storyBG_default']) BGset=lib.config['storyBG_default'];
			    if(game.storyAimBG) BGset=game.storyAimBG;
			    if(set) BGset=set;
			    var ransS=function(groups, pre) {
			        if(!pre) pre='';
			        if(!game.ranBGset||!groups.contains(game.ranBGset)) {
			            BGset=pre+groups.randomGet();
			            game.ranBGset=BGset;
			        }else {
			            BGset=game.ranBGset;
			        }
			    };
			    if(BGset=='4') {
			        //BGset=['1','2','3'].randomGet();
			        ransS(['1','2','3']);
			    }
			    if(BGset=='groups') {
			        //BGset=['wei','shu','wu','qun'].randomGet();
			        ransS(['wei','shu','wu','qun']);
			    }
				if(BGset=='groups2') {
				    //BGset=['wei','shu','wu','qun'].randomGet()+'2';
				    ransS(['wei2','shu2','wu2','qun2']);
				}
				if(BGset=='24st') {
			        //BGset=['wei','shu','wu','qun'].randomGet();
			        ransS(['白露', '处暑', '春分', '大寒', '大暑', '大雪', '冬至', '谷雨', '寒露', '惊蛰', '立春', '立冬', '立秋', '立夏', '芒种', '清明', '秋分', '霜降', '夏至', '小寒', '小满', '小暑', '小雪', '雨水'], '24st/');
			    }
			    if(BGset) game.saveConfig('image_background',BGset);
			    game.storyAimBG=false;
			    //alert(BGset);
			}
			lib.init.background();
			game.updateBackground();
			if(localStorage.getItem('firstSTBG')!='on') localStorage.setItem('firstSTBG','on');
		};
if(typeof game.open !== 'function') game.open=function(url){
			if(lib.device){
				if(cordova.InAppBrowser){
					cordova.InAppBrowser.open(url,'_system');
				}
				else{
					ui.create.iframe(url);
				}
			}
			else{
				window.open(url);
			}
		};
if(typeof game.addVideo !== 'function') game.addVideo=function(type,player,content){
			if(_status.video||game.online) return;
			if(!_status.videoInited){
				if(type=='arrangeLib'){
					lib.video.push({
						type:type,
						player:player,
						content:content,
						delay:0
					});
				}
				return;
			}
			if(type=='storage'&&player&&player.updateMarks){
				player.updateMarks();
			}
			if(game.getVideoName){
				var time=get.time();
				if(!_status.lastVideoLog){
					_status.lastVideoLog=time;
				}
				if(get.itemtype(player)=='player'){
					player=player.dataset.position;
				}
				lib.video.push({
					type:type,
					player:player,
					content:content,
					delay:time-_status.lastVideoLog
				});
				_status.lastVideoLog=time;
			}
		};
if(typeof game.vibrate !== 'function') game.vibrate=function(time){
			if(typeof navigator.vibrate=='function'){
				navigator.vibrate(time||500);
			}
		};
if(typeof game.prompt !== 'function') game.prompt=function(){
			var str,forced,callback,noinput=false,str2='';
			for(var i=0;i<arguments.length;i++){
				if(arguments[i]=='alert'){
					forced=true;
					callback=function(){};
					noinput=true;
				}
				else if(typeof arguments[i]=='string'){
					if(arguments[i].indexOf('###')==0){
						var list=arguments[i].slice(3).split('###');
						str=list[0];
						str2=list[1];
					}
					else str=arguments[i];
				}
				else if(typeof arguments[i]=='boolean'){
					forced=arguments[i];
				}
				else if(typeof arguments[i]=='function'){
					callback=arguments[i];
				}
			}
			if(!callback){
				return;
			}
			//try{
			//	if(noinput){
			//		throw('e');
			//	}
			//	var result=prompt(str);
			//	callback(result);
			//}
			//catch(e){
				var promptContainer=ui.create.div('.popup-container',ui.window,function(){
					if(this.clicked){
						this.clicked=false;
					}
					else{
						clickCancel();
					}
				});
				var dialogContainer=ui.create.div('.prompt-container',promptContainer);
				var dialog=ui.create.div('.menubg',ui.create.div(dialogContainer),function(){
					promptContainer.clicked=true;
				});
				var strnode=ui.create.div('',str||'',dialog);
				var input=ui.create.node('input',ui.create.div(dialog));
				input.value=str2;
				if(noinput){
					input.style.display='none';
				}
				var controls=ui.create.div(dialog);
				var clickConfirm=function(){
					if(noinput){
						promptContainer.remove();
					}
					else if(input.value){
						callback(input.value);
						promptContainer.remove();
					}
				}
				var clickCancel=function(){
					if(!forced){
						callback(false);
						promptContainer.remove();
					}
				}
				var confirmNode=ui.create.div('.menubutton.large.disabled','确定',controls,clickConfirm);
				if(!forced){
					ui.create.div('.menubutton.large','取消',controls,clickCancel);
				}
				if(noinput){
					confirmNode.classList.remove('disabled');
				}
				else{
					input.onkeydown=function(e){
						if(e.keyCode==13){
							clickConfirm();
						}
						else if(e.keyCode==27){
							clickCancel();
						}
					}
					input.onkeyup=function(){
						if(input.value){
							confirmNode.classList.remove('disabled');
						}
						else{
							confirmNode.classList.remove('disabled');
						}
					}
					input.focus();
				}
			//}
		};
if(typeof game.alert !== 'function') game.alert=function(str){
			game.prompt(str,'alert');
		};
if(typeof game.print !== 'function') game.print=function(){
			if(!_status.toprint){
				_status.toprint=[];
			}
			_status.toprint.push(Array.from(arguments));
		};
if(typeof game.linexy !== 'function') game.linexy=function(path){
			const from=[path[0],path[1]],to=[path[2],path[3]];
			let total=typeof arguments[1]==='number'?arguments[1]:lib.config.duration*2,opacity=1,color=[255,255,255],dashed=false,drag=false;
			if(arguments[1]&&typeof arguments[1]=='object') Object.keys(arguments[1]).forEach(value=>{
				switch(value){
					case 'opacity':
						opacity=arguments[1][value];
						break;
					case 'color':
						color=arguments[1][value];
						break;
					case 'dashed':
						dashed=arguments[1][value];
						break;
					case 'duration':total=arguments[1][value];
				}
			});
			else if(typeof arguments[1]=='string') color=arguments[1];
			if(typeof color=='string') color=lib.lineColor.get(color)||[255,255,255];
			let node;
			if(arguments[1]=='drag'){
				color=[236,201,71];
				drag=true;
				if(arguments[2]) node=arguments[2];
				else{
					node=ui.create.div('.linexy.drag');
					node.style.left=`${from[0]}px`;
					node.style.top=`${from[1]}px`;
					node.style.background=`linear-gradient(transparent,rgba(${color.toString()},${opacity}),rgba(${color.toString()},${opacity}))`;
					if(game.chess) ui.chess.appendChild(node);
					else ui.arena.appendChild(node);
				}
			}
			else{
				node=ui.create.div('.linexy.hidden');
				node.style.left=`${from[0]}px`;
				node.style.top=`${from[1]}px`;
				node.style.background=`linear-gradient(transparent,rgba(${color.toString()},${opacity}),rgba(${color.toString()},${opacity}))`;
				node.style.transitionDuration=`${total/3000}s`;
			}
			const dy=to[1]-from[1],dx=to[0]-from[0];
			let deg=Math.atan(Math.abs(dy)/Math.abs(dx))/Math.PI*180;
			if(dx>=0) if(dy<=0) deg+=90;
			else deg=90-deg;
			else if(dy<=0) deg=270-deg;
			else deg+=270;
			if(drag){
				node.style.transform=`rotate(${(-deg)}deg)`;
				node.style.height=`${get.xyDistance(from,to)}px`;
			}
			else{
				node.style.transform=`rotate(${(-deg)}deg) scaleY(0)`;
				node.style.height=`${get.xyDistance(from,to)}px`;
				if(get.objtype(arguments[1])=='div') arguments[1].appendChild(node);
				else if(game.chess) ui.chess.appendChild(node);
				else ui.arena.appendChild(node);
				ui.refresh(node);
				node.show();
				node.style.transform=`rotate(${(-deg)}deg) scaleY(1)`;
				node.listenTransition(()=>setTimeout(()=>{
					if(!node.classList.contains('removing')) node.delete();
				},total/3));
			}
			return node;
		};
if(typeof game.readFile !== 'function') game.readFile=function(filename,callback,onerror){
			lib.node.fs.readFile(__dirname+'/'+filename,function(err,data){
				if(err){
					onerror(err);
				}
				else{
					callback(data);
				}
			});
		};
if(typeof game.writeFile !== 'function') game.writeFile=function(data,path,name,callback){
    		game.ensureDirectory(path,function(){
    		if(Object.prototype.toString.call(data)=='[object File]'){
    			var fileReader = new FileReader();
    			fileReader.onload = function(e){
    				game.writeFile(e.target.result,path,name,callback);
    			};
    			fileReader.readAsArrayBuffer(data, "UTF-8");
    		}
    		else{
    			get.zip(function(zip){
    				zip.file('i',data);
    				lib.node.fs.writeFile(__dirname+'/'+path+'/'+name,zip.files.i.asNodeBuffer(),null,callback);
    			});
    		}
    		});
    	};
if(typeof game.ensureDirectory !== 'function') game.ensureDirectory=function(list,callback,file){
			var directorylist;
			var num=0;
			if(file){
				num=1;
			}
			if(typeof list=='string'){
				directorylist=[list];
			}
			else{
				var directorylist=list.slice(0);
			}
			var access=function(str,dir,callback){
				if(dir.length<=num){
					callback();
				}
				else{
					str+='/'+dir.shift();
					lib.node.fs.access(__dirname+str,function(e){
						if(e){
							try{
								lib.node.fs.mkdir(__dirname+str,function(){
									access(str,dir,callback);
								});
							}
							catch(e){
								console.log(e);
							}
						}
						else{
							access(str,dir,callback);
						}
					});
				}
			}
			var createDirectory=function(){
				if(directorylist.length){
					access('',directorylist.shift().split('/'),createDirectory);
				}
				else{
					callback();
				}
			};
			createDirectory();
		};
if(typeof game.addCardPack !== 'function') game.addCardPack=function(pack,packagename){
			var extname=_status.extension||'扩展';
			packagename=packagename||extname;
			var packname='mode_extension_'+packagename;
			lib.cardPack[packname]=[];
			lib.translate[packname+'_card_config']=packagename;
			for(var i in pack){
				if(i=='mode'||i=='forbid') continue;
				if(i=='list'){
					for(var j=0;j<pack[i].length;j++){
						lib.card.list.push(pack[i][j]);
					}
					continue;
				}
				for(var j in pack[i]){
					if(i=='card'){
						if(pack[i][j].audio==true){
							pack[i][j].audio='ext:'+extname;
						}
						if(pack[i][j].fullskin){
							if(_status.evaluatingExtension){
								pack[i][j].image='db:extension-'+extname+':'+j+'.png';
							}
							else{
								pack[i][j].image='ext:'+extname+'/'+j+'.png';
							}
						}
						else if(pack[i][j].fullimage){
							if(_status.evaluatingExtension){
								pack[i][j].image='db:extension-'+extname+':'+j+'.jpg';
							}
							else{
								pack[i][j].image='ext:'+extname+'/'+j+'.jpg';
							}
						}
						lib.cardPack[packname].push(j);
					}
					else if(i=='skill'){
						if(typeof pack[i][j].audio=='number'||typeof pack[i][j].audio=='boolean'){
							pack[i][j].audio='ext:'+extname+':'+pack[i][j].audio;
						}
					}
					if(lib[i][j]==undefined) lib[i][j]=pack[i][j];
				}
			}
		};
if(typeof game.addSkill !== 'function') game.addSkill=function(name,info,translate,description,appendInfo){
			if(lib.skill[name]){
				return false;
			}
			if(typeof info.audio=='number'||typeof info.audio=='boolean'){
				info.audio='ext:'+_status.extension+':'+info.audio;
			}
			lib.skill[name]=info;
			lib.translate[name]=translate;
			lib.translate[name+'_info']=description;
			lib.translate[name+'_append']=appendInfo;
			return true;
		};
if(typeof game.addGlobalSkill !== 'function') game.addGlobalSkill=function(skill,player){
			var info=lib.skill[skill];
			if(!info) return false;
			lib.skill.global.add(skill);
			if(player){
				if(!lib.skill.globalmap[skill]){
					lib.skill.globalmap[skill]=[];
				}
				lib.skill.globalmap[skill].add(player);
			}
			if(info.trigger){
				var setTrigger=function(i,evt){
					var name=i+'_'+evt;
					if(!lib.hook.globalskill[name]){
						lib.hook.globalskill[name]=[];
					}
					lib.hook.globalskill[name].add(skill);
					lib.hookmap[evt]=true;
				}
				for(var i in info.trigger){
					if(typeof info.trigger[i]=='string'){
						setTrigger(i,info.trigger[i]);
					}
					else if(Array.isArray(info.trigger[i])){
						for(var j=0;j<info.trigger[i].length;j++){
							setTrigger(i,info.trigger[i][j]);
						}
					}
				}
			}
			return true;
		};
if(typeof game.removeGlobalSkill !== 'function') game.removeGlobalSkill=function(skill){
			lib.skill.global.remove(skill);
			delete lib.skill.globalmap[skill];
			for(var i in lib.hook.globalskill){
				lib.hook.globalskill[i].remove(skill);
			}
		};
if(typeof game.removeExtension !== 'function') game.removeExtension=function(extname,keepfile){
			var prefix='extension_'+extname;
			for(var i in lib.config){
				if(i.indexOf(prefix)==0){
					game.saveConfig(i);
				}
			}
			localStorage.removeItem(lib.configprefix+prefix);
			game.deleteDB('data',prefix);
			lib.config.extensions.remove(extname);
			game.saveConfig('extensions',lib.config.extensions);
			var modelist=lib.config.extensionInfo[extname];
			if(modelist){
				if(modelist.image){
					for(var i=0;i<modelist.image.length;i++){
						game.deleteDB('image','extension-'+extname+':'+modelist.image[i]);
					}
				}
				if(modelist.mode){
					for(var i=0;i<modelist.mode.length;i++){
						game.clearModeConfig(modelist.mode[i]);
					}
				}
				delete lib.config.extensionInfo[extname];
				game.saveConfig('extensionInfo',lib.config.extensionInfo);
			}
			if(game.download&&!keepfile){
				if(lib.node&&lib.node.fs){
					try {
						var deleteFolderRecursive = function(path) {
							if (lib.node.fs.existsSync(path)) {
								lib.node.fs.readdirSync(path).forEach(function(file, index){
									var curPath = path + "/" + file;
									if (lib.node.fs.lstatSync(curPath).isDirectory()) {
										deleteFolderRecursive(curPath);
									} else {
										lib.node.fs.unlinkSync(curPath);
									}
								});
								lib.node.fs.rmdirSync(path);
							}
						};
						deleteFolderRecursive(__dirname+'/extension/'+extname);
					} catch(e) {}
				}
				else{
					window.resolveLocalFileSystemURL(lib.assetURL+'extension/'+extname,function(entry){
						entry.removeRecursively();
					});
				}
			}
		};
if(typeof game.addRecentCharacter !== 'function') game.addRecentCharacter=function(){
			var list=get.config('recentCharacter')||[];
			for(var i=0;i<arguments.length;i++){
				if(lib.character[arguments[i]]){
					list.remove(arguments[i]);
					list.unshift(arguments[i]);
				}
			}
			var num=parseInt(lib.config.recent_character_number);
			if(list.length>num){
				list.splice(num);
			}
			game.saveConfig('recentCharacter',list,true);
		};
if(typeof game.codeAllFixed !== 'function') game.codeAllFixed=function(str) {
		    let code = str;
		    str = game.codeTabFixed(str);
		    str = game.codeFunctionFixed(str);
		    return str;
		};
if(typeof game.codeFunctionFixed !== 'function') game.codeFunctionFixed=function(str, enter) {
            // 匹配需要修复的模式：属性名 + 冒号 + 空格 + 相同的函数名 + 参数列表 + 函数体
            const regex = /(\w+):\s*(\w+)\s*\(([^)]*)\)\s*\{/g;
            const enterCode = enter ? (str.slice(-4)=='\n\n\n\n' ? '' : '\n\n\n\n') : '';
            
            // 替换匹配项为：属性名 + ": function(" + 参数 + ") {"
            return str.replace(regex, (match, propName, funcName, args) => {
                return `${propName}: function(${args}) {`;
            })+enterCode;
        };
if(typeof game.codeTabFixed !== 'function') game.codeTabFixed=function(str) {
            if(!window.codeTabFixDiv) {
                window.codeTabFixDiv = document.createElement('div');
            }
            if(game.全能搜索_highlight) {
                window.codeTabFixDiv.innerHTML = game.全能搜索_highlight(str);
                return window.codeTabFixDiv.textContent;
            }
            const lines = str.split('\n');
            let currentIndent = 0;
            let resultLines = [];
        
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                if (line === '') {
                    resultLines.push('');
                    continue;
                }
        
                const leftCount = (line.match(/{/g) || []).length;
                const rightCount = (line.match(/}/g) || []).length;
        
                const outputIndent = Math.max(0, currentIndent - rightCount);
                const indentedLine = ' '.repeat(outputIndent * 4) + line;
                resultLines.push(indentedLine);
        
                currentIndent = Math.max(0, currentIndent - rightCount + leftCount);
            }
        
            return resultLines.join('\n');
        };
if(typeof game.hasGoldFont !== 'function') game.hasGoldFont=function(str){
		    if(typeof str=='string'&&str.indexOf('class="goldFont"')!=-1) {
		        return true;
		    }else {
		        return false;
		    }
		};
if(typeof game.addGoldFont !== 'function') game.addGoldFont=function(str,add,oldtype,margin){
            if(!add) add='';
            if(add.indexOf('#shadow;')!=-1) add=add.replace('#shadow;','filter: drop-shadow(0 0 2px #000) drop-shadow(0 0 2px #000) drop-shadow(0 0 2px #000);');
            let marginText=margin?('margin-left: '+margin+'; margin-right: '+margin+';'):'';
            //oldtype就是屎黄色的字体
            if(oldtype) return '<span class="goldFont" style="'+add+marginText+'background-image: linear-gradient(180deg, #f0d775 30%, #ab8c31 57%, #b0a04d 67%);	font-weight:bold; -webkit-background-clip: text; -webkit-text-fill-color: transparent; white-space: nowrap; -webkit-text-stroke: 0px rgba(38,37,34,0.5); text-shadow: none;">'+str+'</span>';
            return '<span class="goldFont" style="'+add+marginText+'font-family: HYZLSJ;background-image: linear-gradient(#C8BEB4 1%,#FCF8CC 12%, #F3F0BE,#FEF5A8,#E1D275,#C9B173,#D6CB6F,#A99355,#AC9557,#A38A51,#A38A51,#B29983,#B19786,#B19786,#B19786, #9B8583 ), linear-gradient(to right,#FCF8CC , #AC9557);	font-weight:normal; -webkit-background-clip: text; -webkit-text-fill-color: transparent; white-space: nowrap; -webkit-text-stroke: 0px rgba(38,37,34,0.5); text-shadow: none;">'+str+'</span>';
        };
if(typeof game.changeToGoldTitle !== 'function') game.changeToGoldTitle=function(result,items,size,up){
            if(!lib.config.dialog_gold_title) return result;
            if(!window.decadeUI) return result;
            let noshadow=typeof items=='object'?items.noshadow:items;
            let realitems=typeof items=='object'?items:{};
            let shadow=noshadow?'':'#shadow;';
            if(!size) size=35;
            let vtCenter = 'vertical-align: middle; line-height: '+size+'px; display: inline-flex; align-items: center;';
            let icon=up?'▲':'▼';
            return game.addGoldFont(icon,'font-size:'+(size*12/30)+'px;opacity:0;'+vtCenter,false,realitems.margin)+' '+game.addGoldFont(result,'font-size:'+size+'px;'+shadow+vtCenter,false,realitems.margin)+' '+game.addGoldFont(icon,'font-size:'+(size*12/30)+'px;'+shadow+vtCenter,false,realitems.margin);
        };
if(typeof game.modeGoldTitle !== 'function') game.modeGoldTitle=function(result,noshadow,size,up){
            if(!lib.config.dialog_gold_title) return result;
            if(!window.decadeUI) return result;
            var shadow=noshadow?'':'#shadow;';
            if(!size) size=35;
            var vtCenter = 'vertical-align: middle; line-height: '+size+'px; display: inline-flex; align-items: center;';
            var icon=up?'▲':'▼';
            if(result.length<=8&&result.indexOf('选择了')==-1) {
                return game.addGoldFont(icon,'font-size:'+(size*12/30)+'px;opacity:0;'+vtCenter)+' '+game.addGoldFont(result,'font-size:'+size+'px;'+shadow+vtCenter)+' '+game.addGoldFont(icon,'font-size:'+(size*12/30)+'px;'+shadow+vtCenter);
            }else {
                return game.addGoldFont(result,'font-size:'+(size*25/30)+'px;'+shadow+vtCenter);
            }
        };
if(typeof game.createCss !== 'function') game.createCss=function(csstext,forced){
		    if(typeof csstext != 'string') return false;
		    if(!forced && game.createCssList.contains(csstext)) return style;
		    if(!forced) game.createCssList.push(csstext);
		    var style = document.createElement('style');
			style.innerHTML = csstext;
			document.head.appendChild(style);
			return style;
		};
if(typeof game.createCard !== 'function') game.createCard=function(name,suit,number,nature){
			if(typeof name=='object'){
				nature=name.nature;
				number=name.number;
				suit=name.suit;
				name=name.name;
			}
			if(typeof name!='string'){
				name='sha';
			}
			var noclick=false;
			if(suit=='noclick'){
				noclick=true;
				suit=null;
			}
			if(!suit&&lib.card[name].cardcolor){
				suit=lib.card[name].cardcolor;
			}
			if(!nature&&lib.card[name].cardnature){
				nature=lib.card[name].cardnature;
			}
			if(typeof suit!='string'){
				suit=['heart','diamond','club','spade'].randomGet();
			}
			else if(suit=='black'){
				suit=Math.random()<0.5?'club':'spade';
			}
			else if(suit=='red'){
				suit=Math.random()<0.5?'diamond':'heart';
			}
			if(typeof number!='number'&&typeof number!='string'){
				number=Math.ceil(Math.random()*13);
			}
			var card;
			if(noclick){
				card=ui.create.card(ui.special,'noclick',true);
			}
			else{
				card=ui.create.card(ui.special);
			}
			card.storage.vanish=true;
			return card.init([suit,number,name,nature]);
		};
if(typeof game.rollCard !== 'function') game.rollCard=function(cards, set = {}) {
            // 处理参数设置
            const { speed = 1, scale = 1, y = 0, checkResult = 3, cover = false, audio = true } = set;
            const effectiveScale = Math.max(0.1, Math.min(scale, 10)); // 限制缩放范围
            const effectiveSpeed = Math.max(0.1, Math.min(speed, 10)); // 限制速度范围
        
            // 创建主容器
            const container = document.createElement('div');
            container.id = 'card-container-3d';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 100;
                pointer-events: none;
                overflow: hidden;
                perspective: 1500px;
            `;
            document.body.appendChild(container);
        
            // 创建3D旋转容器
            const cardCircle = document.createElement('div');
            cardCircle.id = 'card-circle-container';
            cardCircle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform-style: preserve-3d;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
            `;
            container.appendChild(cardCircle);
            
            const cardMap = document.createElement('div');
            cardMap.id = 'card-circle-container';
            cardMap.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform-style: preserve-3d;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                z-index: 1;
            `;
            container.appendChild(cardMap);
        
            // 卡牌尺寸（根据scale参数缩放）
            const cardWidth = Math.round(120 * effectiveScale);
            const cardHeight = Math.round(180 * effectiveScale);
            const radius = Math.max(180, 80 + cards.length * 12) * effectiveScale; // 动态半径
        
            // 添加CSS样式
            const bottomPX = window.innerHeight + cardHeight + y;
            const style = document.createElement('style');
            style.textContent = `
                .card-3d {
                    position: fixed;
                    transform-style: preserve-3d;
                    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                                opacity 0.8s ease, 
                                filter 0.8s ease;
                    backface-visibility: hidden;
                    /* 初始位置在屏幕底部下方 */
                    bottom: ${-bottomPX}px;
                    left: calc(50% - ${cardWidth/2}px);
                    width: ${cardWidth}px;
                    height: ${cardHeight}px;
                }
                
                .card-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    background-size: ${cover?'cover':'contain'};
                    background-position: center;
                    background-repeat: no-repeat;
                    border-radius: 8px;
                    filter: drop-shadow(0 0 2px #000);
                    /*box-shadow: 0 8px 25px rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.15);*/
                }
                
                .card-front {
                    transform: rotateY(180deg);
                }
                
                .card-back {
                    background-color: none/*#1a1a1a*/;
                    background-image: linear-gradient(145deg, #2c2c2c 0%, #121212 100%);
                }
                
                .card-blur {
                    filter: blur(0.5px);
                }
                
                @keyframes rotateCircle {
                    from { transform: translate(-50%, -50%) rotateY(0); }
                    to { transform: translate(-50%, -50%) rotateY(360deg); }
                }
            `;
            document.head.appendChild(style);
        
            // 创建卡牌
            const cardElements = cards.map((card, i) => {
                const cardEl = document.createElement('div');
                cardEl.className = 'card-3d';
                cardEl.dataset.name = card.name;
                
                // 创建卡牌正反面
                const front = document.createElement('div');
                front.className = 'card-face card-front';
                front.style.backgroundImage = `url('${lib.assetURL}${card.front}')`;
                
                const back = document.createElement('div');
                back.className = 'card-face card-back';
                back.style.backgroundImage = `url('${lib.assetURL}${card.back}')`;
                
                cardEl.appendChild(front);
                cardEl.appendChild(back);
                cardCircle.appendChild(cardEl);
                
                // 存储卡牌数据
                cardEl.cardData = card;
                
                const fakeCard = cardEl.cloneNode(true);
                fakeCard.style.filter = 'opacity(0)';
                fakeCard.style.transform = `translate3d(0, ${-bottomPX + (cardHeight*0.5)}px, 0)`;
                fakeCard.style.transition = `transform 1.2s 0s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s linear`;
                cardMap.appendChild(fakeCard);
                cardEl.fakeCard = fakeCard;
                
                return cardEl;
            });
        
            // 飞入动画
            let flyInComplete = false;
            
            cardElements.forEach((card, i) => {
                const delay = (i + 1) * 200; // 每张卡牌延迟200ms
                //Helasisy玩卡玩上瘾了是吧
                setTimeout(() => {
                    // 计算卡牌在圆形上的位置（角度均匀分布）
                    const angle = (360 / cards.length) * i;
                    const rad = angle * (Math.PI / 180);
                    
                    // 计算3D位置 - 确保卡牌面向中心轴
                    const x = Math.sin(rad) * radius;
                    const z = Math.cos(rad) * radius;
                    
                    // 计算卡牌朝向 - 确保正面朝向中心轴
                    const rotationY = angle;
                    
                    card.style.transition = `transform 1.2s ${(i * 0.15) + 0.2}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
                    card.style.transform = `translate3d(${x}px, ${-bottomPX + (cardHeight*0.5)}px, ${z}px) rotateY(${rotationY}deg)`;
                    
                    if (audio) setTimeout(function() {
                        game.helaAudio('..','audio','rollCard','slip.mp3');
                    }, (i * 0.15) * 1000);
                    // 标记最后一张卡牌动画完成
                    /*if (i === cards.length - 1) {
                        setTimeout(() => {
                            flyInComplete = true;
                            // 开始持续旋转
                            const duration = 16 / effectiveSpeed; // 根据速度调整
                            cardCircle.style.animation = `rotateCircle ${duration}s infinite linear`;
                        }, 1200);
                    }*/
                }, delay);
            });
            setTimeout(() => {
                flyInComplete = true;
                // 开始持续旋转
                const duration = 16 / effectiveSpeed; // 根据速度调整
                cardCircle.style.animation = `rotateCircle ${duration}s infinite linear`;
            }, 200);
        
            // 返回控制对象
            return {
                cards: cardElements,
                
                draw(name) {
                    if (!flyInComplete) return;
                    
                    // 停止旋转
                    //cardCircle.style.animation = 'none';
                    
                    const targetCard0 = cardElements.find(c => c.dataset.name === name);
                    if (!targetCard0) return;
                    if (audio) game.helaAudio('..','audio','rollCard','draw.wav');
                    
                    targetCard0.style.display = 'none';
                    const targetCard = targetCard0.fakeCard;
                    
                    // 移动目标卡牌到中心并正面朝向屏幕
                    targetCard.style.zIndex = '100';
                    targetCard.style.transform = `
                        translate3d(0, ${-bottomPX + (cardHeight*0.5)}px, 300px) 
                        rotateY(${180+360}deg) 
                        scale(1.3)
                    `;//180deg
                    targetCard.style.filter = 'none';
                    //targetCard.style.opacity = '1';
                    
                    let whileTime = 1000 / Math.max(1,cardElements.length-1);
                    let timeGroups = [];
                    let index = 0;
                    for(let c=0;c<cardElements.length;c++) {
                        if(cardElements[c] === targetCard0) continue;
                        timeGroups.push(index * whileTime);
                        index++;
                    }
                    timeGroups.randomSort();
                    
                    // 其他卡牌添加模糊效果并掉落
                    cardElements.forEach(card => {
                        if (card !== targetCard0) {
                            //card.classList.add('card-blur');
                            let time = timeGroups.length?timeGroups.shift():0;
                            setTimeout(function() {
                                card.style.transition = 'transform 1.2s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 1.2s ease';
                                card.style.transform += ' translateY(150vh)';
                            },time);
                        }
                    });
                    
                    // 4.7秒后所有卡牌渐隐消失
                    const end = function() {
                        // 添加渐隐效果
                        container.style.transition = 'opacity 0.7s ease';
                        container.style.opacity = '0';
                        
                        // 清理DOM
                        setTimeout(() => {
                            if (container.parentNode) {
                                document.body.removeChild(container);
                            }
                            if (style.parentNode) {
                                document.head.removeChild(style);
                            }
                        }, 700);
                    };
                    if(typeof checkResult=='function') {
                        checkResult(end, targetCard0);
                    }else {
                        let timer = typeof checkResult=='number'?(checkResult*1000):3000;
                        setTimeout(() => {
                            end();
                        }, timer);
                    }
                },
                
                stop() {
                    // 停止旋转
                    //cardCircle.style.animation = 'none';
                    
                    let whileTime = 1000 / Math.max(1,cardElements.length);
                    let timeGroups = [];
                    for(let c=0;c<cardElements.length;c++) {
                        timeGroups.push(c * whileTime);
                    }
                    timeGroups.randomSort();
                    
                    // 所有卡牌掉落
                    cardElements.forEach(card => {
                        let time = timeGroups.length?timeGroups.shift():0;
                        setTimeout(function() {
                            card.style.transition = 'transform 1.2s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 1.2s ease';
                            card.style.transform += ' translateY(150vh)';
                            //card.style.opacity = '0.3';
                        },time);
                    });
                    
                    // 1.2秒后整个容器渐隐
                    setTimeout(() => {
                        container.style.transition = 'opacity 0.7s ease';
                        container.style.opacity = '0';
                        
                        // 清理DOM
                        setTimeout(() => {
                            if (container.parentNode) {
                                document.body.removeChild(container);
                            }
                            if (style.parentNode) {
                                document.head.removeChild(style);
                            }
                        }, 700);
                    }, 1200);
                }
            };
        };
if(typeof game.videoBackground !== 'function') game.videoBackground=function(file, smooth = 0, parent, size = 'cover') {
            const backgroundContainer = parent || ui.background;
            
            // 清除容器内可能存在的旧视频
            while (backgroundContainer.firstChild) {
                backgroundContainer.removeChild(backgroundContainer.firstChild);
            }
            
            // 创建视频元素
            const video = document.createElement('video');
            video.src = lib.assetURL + file;
            video.muted = true;
            video.autoplay = true;
            video.loop = true;
            video.playsInline = true;
            
            // 初始设置为完全透明
            Object.assign(video.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                objectFit: size,
                zIndex: '-1',
                opacity: '0',  // 初始不可见
                transition: `opacity ${smooth}ms ease-in-out`  // 设置平滑过渡
            });
            
            backgroundContainer.appendChild(video);
            
            // 添加加载完成监听器
            video.addEventListener('loadeddata', () => {
                // 延迟设置透明度确保过渡生效
                requestAnimationFrame(() => {
                    video.style.opacity = '1';
                });
            });
            
            // 添加错误处理以防加载失败
            video.addEventListener('error', () => {
                console.error('视频加载失败:', file);
                video.style.opacity = '1'; // 即使失败也显示（如果有备用内容）
            });
            
            return video;
        };
if(typeof game.delay !== 'function') game.delay=function(time,time2){
			if(_status.paused) return;
			game.pause();
			if(typeof time!='number') time=1;
			if(typeof time2!='number') time2=0;
			time=time*lib.config.duration+time2;
			if(lib.config.speed=='vvfast') time/=3;
			_status.timeout=setTimeout(game.resume,time);
		};
if(typeof game.delayx !== 'function') game.delayx=function(time,time2){
			if(typeof time!='number') time=1;
			switch(lib.config.game_speed){
				case 'vslow':time*=2.5;break;
				case 'slow':time*=1.5;break;
				case 'fast':time*=0.7;break;
				case 'vfast':time*=0.4;break;
				case 'vvfast':time*=0.2;break;
			}
			return game.delay(time,time2);
		};
if(typeof game.swapSeat !== 'function') game.swapSeat=function(player1,player2,prompt,behind,noanimate){
			if(noanimate){
				player1.style.transition='all 0s';
				player2.style.transition='all 0s';
				ui.refresh(player1);
				ui.refresh(player2);
			}
			if(behind){
				var totalPopulation=game.players.length+game.dead.length+1;
				for(var iwhile=0;iwhile<totalPopulation;iwhile++){
					if(player1.next!=player2){
						game.swapSeat(player1,player1.next,false,false);
					}
					else{
						break;
					}
				}
				if(prompt!=false){
					game.log(player1,'将座位移至',player2,'后');
				}
			}
			else{
				game.addVideo('swapSeat',null,[player1.dataset.position,player2.dataset.position]);
				var seat1=player1.seatNum;
				var seat2=player2.seatNum;
				player2.seatNum=seat1;
				player1.seatNum=seat2;
				var temp1,pos,i,num;
				temp1=player1.dataset.position;
				player1.dataset.position=player2.dataset.position;
				player2.dataset.position=temp1;
				game.arrangePlayers();
				if(!game.chess){
					if(player1.dataset.position=='0'||player2.dataset.position=='0'){
						pos=parseInt(player1.dataset.position);
						if(pos==0) pos=parseInt(player2.dataset.position);
						num=game.players.length+game.dead.length;
						for(i=0;i<game.players.length;i++){
							temp1=parseInt(game.players[i].dataset.position)-pos;
							if(temp1<0) temp1+=num;
							game.players[i].dataset.position=temp1;
						}
						for(i=0;i<game.dead.length;i++){
							temp1=parseInt(game.dead[i].dataset.position)-pos;
							if(temp1<0) temp1+=num;
							game.dead[i].dataset.position=temp1;
						}
					}
				}
				if(prompt!=false){
					game.log(player1,'和',player2,'交换了座位');
				}
			}
			if(noanimate){
				setTimeout(function(){
					player1.style.transition='';
					player2.style.transition='';
				},200);
			}
		};
if(typeof game.swapPlayerAuto !== 'function') game.swapPlayerAuto=function(player){
			if(game.modeSwapPlayer){
				game.modeSwapPlayer(player);
			}
			else{
				game.swapPlayer(player);
			}
		};
if(typeof game.checkMod !== 'function') game.checkMod=function(){
			const argumentArray=Array.from(arguments),name=argumentArray[argumentArray.length-2];
			let skills=argumentArray[argumentArray.length-1];
			if(skills.getSkills) skills=skills.getSkills();
			skills=skills.concat(lib.skill.global);
			game.expandSkills(skills);
			skills=skills.filter(skill=>{
				const info=get.info(skill);
				return (info&&info.mod&&info.mod[name]);
			})
			skills.sort((a,b)=>get.priority(a)-get.priority(b));
			const arg=argumentArray.slice(0,-2);
			skills.forEach(value=>{
				const result=get.info(value).mod[name].apply(this,arg);
				if(typeof arg[arg.length-1]!='object'&&result!=undefined) arg[arg.length-1]=result;
			});
			return arg[arg.length-1];
		};
if(typeof game.log !== 'function') game.log=function(){
			let str='',str2='',logvid=null;
			const color=new Map([
				['b','blue'],
				['y','yellow'],
				['g','green']
			]);
			Array.from(arguments).forEach(value=>{
				const itemtype=get.itemtype(value);
				if(itemtype=='player'||itemtype=='players'){
					str+=`<span class="bluetext">${get.translation(value)}</span>`;
					str2+=get.translation(value);
				}
				else if(itemtype=='cards'||itemtype=='card'||(typeof value=='object'&&value&&value.name)){
					str+=`<span class="yellowtext">${get.translation(value)}</span>`;
					str2+=get.translation(value);
				}
				else if(typeof value=='object'){
					if(value.parentNode==ui.historybar) logvid=value.logvid;
					else{
						str+=get.translation(value);
						str2+=get.translation(value);
					}
				}
				else if(typeof value=='string'){
					if(value[0]=='【'&&value[value.length-1]=='】'){
						str+=`<span class="greentext">${get.translation(value)}</span>`;
						str2+=get.translation(value);
					}
					else if(value[0]=='#'){
						str+=`<span class="${color.get(value[1])||''}text">${get.translation(value.slice(2))}</span>`;
						str2+=get.translation(value.slice(2));
					}
					else{
						str+=get.translation(value);
						str2+=get.translation(value);
					}
				}
				else{
					str+=value;
					str2+=value;
				}
			});
			const node=ui.create.div();
			node.innerHTML=lib.config.log_highlight?str:str2;
			ui.sidebar.insertBefore(node,ui.sidebar.firstChild);
			game.addVideo('log',null,lib.config.log_highlight?str:str2);
			game.broadcast((str,str2)=>game.log(lib.config.log_highlight?str:str2),str,str2);
			if(!_status.video&&!game.online){
				if(logvid) game.logv(logvid,`<div class="text center">${lib.config.log_highlight?str:str2}</div>`);
				else logvid=_status.event.getLogv();
			}
			if(lib.config.show_log=='off'||game.chess) return;
			const nodeentry=node.cloneNode(true);
			ui.arenalog.insertBefore(nodeentry,ui.arenalog.firstChild);
			if(!lib.config.clear_log) while(ui.arenalog.childNodes.length&&ui.arenalog.scrollHeight>ui.arenalog.offsetHeight){
				ui.arenalog.lastChild.remove();
			}
			if(!lib.config.low_performance){
				nodeentry.style.transition='all 0s';
				nodeentry.style.marginBottom=`-${nodeentry.offsetHeight}px`;
				ui.refresh(nodeentry);
				nodeentry.style.transition='';
				nodeentry.style.marginBottom='';
			}
			if(!lib.config.clear_log) return;
			nodeentry.timeout=setTimeout(()=>nodeentry.delete(),1000);
			Array.from(ui.arenalog.childNodes).forEach(value=>{
				if(!value.timeout) value.remove();
			});
		};
if(typeof game.putDB !== 'function') game.putDB=function(type,id,item,callback){
			if(!lib.db) return item;
			if(lib.status.reload){
				lib[_status.dburgent?'ondb2':'ondb'].push(['putDB',Array.from(arguments)]);
				return;
			}
			lib.status.reload++;
			lib.db.transaction([type],'readwrite').objectStore(type).put(item,id).onsuccess=function(){
				if(callback){
					_status.dburgent=true;
					callback.apply(this,arguments);
					delete _status.dburgent;
				}
				game.reload2();
			};
		};
if(typeof game.getDB !== 'function') game.getDB=function(type,id,callback){
			if(!lib.db){
				if(callback) callback(null);
				return;
			}
			if(!callback) return;
			if(lib.status.reload){
				lib[_status.dburgent?'ondb2':'ondb'].push(['getDB',Array.from(arguments)]);
				return;
			}
			lib.status.reload++;
			const store=lib.db.transaction([type],'readwrite').objectStore(type);
			if(id){
				store.get(id).onsuccess=e=>{
					_status.dburgent=true;
					callback(e.target.result);
					delete _status.dburgent;
					game.reload2();
				};
				return;
			}
			const obj={};
			store.openCursor().onsuccess=e=>{
				const cursor=e.target.result;
				if(cursor){
					obj[cursor.key]=cursor.value;
					cursor.continue();
					return;
				}
				_status.dburgent=true;
				callback(obj);
				delete _status.dburgent;
				game.reload2();
			}
		};
if(typeof get.priority !== 'function') get.priority=function(skill){
			const info=get.info(skill);
			if(!info) return 0;
			if(info.hasOwnProperty('_priority')) return info._priority;
			let priority=0;
			if(info.priority){
				priority=info.priority*100;
			}
			if(info.silent){
				priority++;
			}
			if(info.equipSkill) priority-=25;
			if(info.cardSkill) priority-=50;
			if(info.ruleSkill) priority-=75;
			info._priority=priority;
			return priority;
		};
if(typeof get.numOf !== 'function') get.numOf=function(obj,item){
			var num=0;
			for(var i=0;i<obj.length;i++){
				if(obj[i]==item) num++;
			}
			return num;
		};
if(typeof get.zhinangs !== 'function') get.zhinangs=function(filter){
			var list=(_status.connectMode?lib.configOL:lib.config).zhinang_tricks;
			if(!list||!list.filter||!list.length) return get.inpile('trick','trick').randomGets(3);
			if(filter===false) return list.slice(0);
			list=list.filter(function(i){
				return lib.inpile.contains(i);
			});
			if(list.length) return list;
			return get.inpile('trick','trick').randomGets(3);
		};
if(typeof get.sourceCharacter !== 'function') get.sourceCharacter=function(str){
			if(str){
				for(var i in lib.characterReplace){
					if(lib.characterReplace[i].contains(str)) return i;
				}
			}
			return str;
		};
if(typeof get.isLuckyStar !== 'function') get.isLuckyStar=function(player){
			if(player&&player.hasSkillTag('luckyStar')) return true;
			if(_status.connectMode) return false;
			return (!player||player==game.me||player.isUnderControl())&&lib.config.lucky_star==true;
		};
if(typeof get.infoHp !== 'function') get.infoHp=function(hp){
			if(typeof hp=='number') return hp;
			else if(typeof hp=='string'&&hp.indexOf('/')!=-1){
				return parseInt(hp.split('/')[0]);
			}
			return 0;
		};
if(typeof get.infoMaxHp !== 'function') get.infoMaxHp=function(hp){
			if(typeof hp=='number') return hp;
			else if(typeof hp=='string'&&hp.indexOf('/')!=-1){
				return parseInt(hp.split('/')[1]);
			}
			return 0;
		};
if(typeof get.infoHujia !== 'function') get.infoHujia=function(hp){
			if(typeof hp=='string'&&hp.indexOf('/')!=-1){
				var splited=hp.split('/');
				if(splited.length>2) return parseInt(splited[2]);
			}
			return 0;
		};
if(typeof get.autoViewAs !== 'function') get.autoViewAs=function(card,cards){
			let _card;
			if(get.itemtype(card)=='card'){
				_card={
					name:get.name(card),
					suit:get.suit(card),
					color:get.suit(card),
					number:get.number(card),
					nature:get.nature(card),
					isCard:true,
					cardid:card.cardid,
					wunature:card.wunature,
					storage:get.copy(card.storage),
				};
				if(Array.isArray(cards)) _card.cards=cards.slice(0);
				else _card.cards=[card];
			}
			else{
				_card=get.copy(card);
				if(Array.isArray(cards)){
					if(_card.cards){
						_card.cards=cards.slice(0);
					}
					else{
						_card.cards=cards.slice(0);
						if(!lib.suits.includes(_card.suit)) _card.suit=get.suit(_card);
						if(!Object.keys(lib.color).includes(_card.color)) _card.color=get.color(_card);
						if(!_card.hasOwnProperty('number')) _card.number=get.number(_card);
						if(!_card.hasOwnProperty('nature')) _card.nature=(get.nature(_card)||false);
					}
				}
			}
			const info=get.info(_card,false);
			if(info.autoViewAs){
				_card.name=info.autoViewAs;
			}
			return _card;
		};
if(typeof get.character !== 'function') get.character=function(name,num){
			let info=lib.character[name];
			if(!info){
				const pack=Object.keys(lib.characterPack).find(pack=>lib.characterPack[pack].hasOwnProperty(name));
				if(pack) info=lib.characterPack[pack][name];
			}
			if(info){
				if(typeof num=='number'){
					return info[num];
				}
				return info;
			}
			return null;
		};
if(typeof get.characterIntro !== 'function') get.characterIntro=function(name){
			if(lib.characterIntro[name]) return lib.characterIntro[name];
			var tags=get.character(name,4);
			if(tags){
				for(var i=0;i<tags.length;i++){
					if(tags[i].indexOf('des:')==0){
						return tags[i].slice(4);
					}
				}
			}
			if(name.indexOf('gz_')==0){
				name=name.slice(3);
				if(lib.characterIntro[name]) return lib.characterIntro[name];
			}
			//index改成lastIndex提高容错
			if(name.lastIndexOf('_')!=-1){
				name=name.slice(name.lastIndexOf('_')+1);
			}
			if(lib.characterIntro[name]) return lib.characterIntro[name];
			return '暂无武将介绍';
		};
if(typeof get.groupnature !== 'function') get.groupnature=function(group,method){
			var nature=lib.groupnature[group];
			if(!nature) return '';
			if(method=='raw'){
				return nature;
			}
			return nature+'mm';
		};
if(typeof get.sgn !== 'function') get.sgn=function(num){
			if(num>0) return 1;
			if(num<0) return -1;
			return 0;
		};
if(typeof get.rand !== 'function') get.rand=function(num,num2){
			if(typeof num2=='number'){
				return num+Math.floor(Math.random()*(num2-num+1));
			}
			else{
				return Math.floor(Math.random()*num);
			}
		};
if(typeof get.zip !== 'function') get.zip=function(callback){
			if(!window.JSZip){
				lib.init.js(lib.assetURL+'game','jszip',function(){
					callback(new JSZip());
				});
			}
			else{
				callback(new JSZip());
			}
		};
if(typeof get.delayx !== 'function') get.delayx=function(num,max){
			if(typeof num!='number') num=1;
			if(typeof max!='number') max=Infinity;
			switch(lib.config.game_speed){
				case 'vslow':return Math.min(max,2.5*num);
				case 'slow':return Math.min(max,1.5*num);
				case 'fast':return Math.min(max,0.7*num);
				case 'vfast':return Math.min(max,0.4*num);
				case 'vvfast':return Math.min(max,0.2*num);
				default:return Math.min(max,num);
			}
		};
if(typeof get.prompt !== 'function') get.prompt=function(skill,target,player){
			player=player||_status.event.player;
			if(target){
				var str=get.translation(target);
				if(target==player){
					str+='（你）'
				}
				return '是否对'+str+'发动【'+get.skillTranslation(skill,player)+'】？';
			}
			else{
				return '是否发动【'+get.skillTranslation(skill,player)+'】？';
			}
		};
if(typeof get.prompt2 !== 'function') get.prompt2=function(skill,target,player){
			var str=get.prompt.apply(this,arguments);
			if(!lib.translate[skill+'_info']) return str;
			return '###'+str+'###'+lib.translate[skill+'_info'];
		};
if(typeof get.url !== 'function') get.url=function(master){
			var url=lib.config.updateURL||lib.updateURL;
			if(url[url.length-1]!='/'){
				url+='/';
			}
			if(master!='nodev'){
				return url+'master/';
			}
			else{
				return url+'v'+lib.version+'/';
			}
		};
if(typeof get.playerNumber !== 'function') get.playerNumber=function(){
			var num;
			if(_status.brawl&&_status.brawl.playerNumber){
				num=_status.brawl.playerNumber
			}
			else{
				num=get.config('player_number');
			}
			return parseInt(num)||2;
		};
if(typeof get.stringify !== 'function') get.stringify=function(obj,level){
			level=level||0;
			var indent='';
			var str;
			for(var i=0;i<level;i++){
				indent+='    ';
			}
			if(get.objtype(obj)=='object'){
				str='{\n';
				for(var i in obj){
					if(/[^a-zA-Z]/.test(i)){
						str+=indent+'    "'+i+'":'+get.stringify(obj[i],level+1)+',\n';
					}
					else{
						str+=indent+'    '+i+':'+get.stringify(obj[i],level+1)+',\n';
					}
				}
				str+=indent+'}';
				return str;
			}
			else{
				if(typeof obj=='function'){
					str=obj.toString();
					str=str.replace(/\t/g,'    ');
					var i=str.lastIndexOf('\n');
					var num=0;
					for(var j=i+1;j<str.length&&str[j]==' ';j++){
						num++;
					}
					num=Math.floor(num/4);
					for(i=0;i<num-level;i++){
						str=str.replace(/\n    /g,'\n');
					}
				}
				else{
					try{
						if(Array.isArray(obj)&&obj.contains(Infinity)){
							obj=obj.slice(0);
							var rand=get.id();
							for(var i=0;i<obj.length;i++){
								if(obj[i]===Infinity){
									obj[i]=parseInt(rand);
								}
							}
							str=JSON.stringify(obj).replace(new RegExp(rand,'g'),'Infinity');
						}
						else{
							str=JSON.stringify(obj)||'';
						}
					}
					catch(e){
						str='';
					}
				}
				return str;
			}
		};
if(typeof get.copy !== 'function') get.copy=function(obj){
			if(get.objtype(obj)=='object'){
				var copy={};
				for(var i in obj){
					copy[i]=get.copy(obj[i]);
				}
				return copy;
			}
			else if(Array.isArray(obj)){
				var copy=[];
				for(var i=0;i<obj.length;i++){
					copy.push(get.copy(obj[i]));
				}
				return copy;
			}
			else{
				return obj;
			}
		};
if(typeof get.inpile !== 'function') get.inpile=function(type,filter){
			var list=[];
			if(filter=='trick'){
				for(var i=0;i<lib.inpile.length;i++){
					if(get.type(lib.inpile[i],'trick')==type) list.push(lib.inpile[i]);
				}
			}
			else{
				for(var i=0;i<lib.inpile.length;i++){
					if(typeof type=='function'){
						if(type(lib.inpile[i])){
							list.push(lib.inpile[i]);
						}
					}
					else{
						if(typeof filter=='function'&&!filter(lib.inpile[i])) continue;
						if(type.indexOf('equip')==0&&type.length==6){
							if(get.subtype(lib.inpile[i])==type) list.push(lib.inpile[i]);
						}
						else{
							if(get.type(lib.inpile[i])==type) list.push(lib.inpile[i]);
						}
					}
				}
			}
			return list;
		};
if(typeof get.libCard !== 'function') get.libCard=function(filter){
			var list=[];
			for(var i in lib.card){
				if(lib.card[i].mode&&lib.card[i].mode.contains(get.mode())==false) continue;
				// if(lib.card[i].vanish||lib.card[i].destroy) continue;
				if(lib.card[i].destroy) continue;
				if(lib.config.bannedcards.contains(i)) continue;
				if(!lib.translate[i+'_info']) continue;
				if(filter(lib.card[i],i)){
					list.push(i);
				}
			}
			return list;
		};
if(typeof get.charactersOL !== 'function') get.charactersOL=function(func){
			var list=[];
			var libCharacter={};
			for(var i=0;i<lib.configOL.characterPack.length;i++){
				var pack=lib.characterPack[lib.configOL.characterPack[i]];
				for(var j in pack){
					if(typeof func=='function'&&func(j)) continue;
					if(lib.connectBanned.contains(j)) continue;
					if(lib.character[j]) libCharacter[j]=pack[j];
				}
			}
			for(i in libCharacter){
				if(lib.filter.characterDisabled(i,libCharacter)) continue;
				list.push(i);
			}
			return list;
		};
if(typeof get.idDialog !== 'function') get.idDialog=function(id){
			for(var i=0;i<ui.dialogs.length;i++){
				if(ui.dialogs[i].videoId==id){
					return ui.dialogs[i];
				}
			}
			return null;
		};
if(typeof get.skillState !== 'function') get.skillState=function(player){
			var skills={
				global:lib.skill.global
			};
			var skillinfo={};
			for(var i in lib.playerOL){
				skills[i]={
					skills:lib.playerOL[i].skills,
					hiddenSkills:lib.playerOL[i].hiddenSkills,
					invisibleSkills:lib.playerOL[i].invisibleSkills,
					additionalSkills:lib.playerOL[i].additionalSkills,
					disabledSkills:lib.playerOL[i].disabledSkills,
					tempSkills:lib.playerOL[i].tempSkills,
					storage:lib.playerOL[i].storage,
				}
			}
			//for(var i in lib.skill){
			//	if(lib.skill[i].chooseButton&&lib.skill[i].enable){
			//		skillinfo[i]=lib.skill[i].chooseButton;
			//	}
			//}
			skills.skillinfo=skillinfo;
			if(player){
				skills.stat=player.getStat();
			}
			return skills;
		};
if(typeof get.id !== 'function') get.id=function(){
			return (Math.floor(1000000+9000000*Math.random())).toString()+(10+lib.status.globalId++);
		};
if(typeof get.zhu !== 'function') get.zhu=function(player,skill,group){
			if(typeof player=='string'){
				skill=player;
				player=null;
			}
			var mode=get.mode();
			if(mode=='identity'){
				if(_status.mode=='purple'){
					if(!player) return null;
					var zhu=game[player.identity.slice(0,1)+'Zhu'];
					if(!zhu) return null;
					if(skill&&!zhu.hasSkill(skill)) return null;
					return zhu;
				}
				if(!game.zhu) return null;
				if(skill&&!game.zhu.hasSkill(skill)) return null;
				if(game.zhu.isZhu) return game.zhu;
			}
			else if(mode=='versus'&&(_status.mode=='four'||_status.mode=='guandu')){
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].isZhu){
						if(skill&&!(game.players[i].hasSkill(skill))) continue;
						if(!player) return game.players[i];
						if(player.side==game.players[i].side){
							return game.players[i];
						}
					}
				}
			}
			else if(mode=='guozhan'){
				for(var i=0;i<game.players.length;i++){
					if(get.is.jun(game.players[i])&&!game.players[i].isUnseen()){
						if(skill&&!game.players[i].hasSkill(skill)) continue;
						if(!player) return game.players[i];
						if(player.identity==game.players[i].identity){
							return game.players[i];
						}
						else if(group&&group==game.players[i].identity){
							return game.players[i];
						}
					}
				}
			}
			return null;
		};
if(typeof get.config !== 'function') get.config=function(item,mode){
			mode=mode||lib.config.mode;
			if(!lib.config.mode_config[mode]) return;
			//双将特别注意一下
			if(item=='double_character') {
			    //斗地主（非休闲，只有单将）
			    if(mode=='doudizhu'&&_status.mode!='normal'&&_status.mode!='online') {
			        return false;
			    }
			}
			return lib.config.mode_config[mode][item];
		};
if(typeof get.rank !== 'function') get.rank=function(name,num){
			if(typeof name=='object'&&name.name){
				name=name.name;
			}
			if(num==true) num=9;
			if(typeof num!='number') num=false;
			if(name==_status.lord) return num?Math.round(7*(num-1)/8+1):'ap';
			var rank=lib.rank;
			if(lib.characterPack.standard[name]||lib.characterPack.shenhua[name]){
				var skills;
				if(lib.character[name]){
					skills=lib.character[name][3];
				}
				else{
					var tmpinfo=get.character(name);
					if(tmpinfo){
						skills=tmpinfo[3];
					}
					else{
						skills=[];
					}
				}
				for(var i=0;i<skills.length;i++){
					if(skills[i].alter&&!lib.config.vintageSkills.contains(skills[i])){
						name=lib.rank.a[0];break;
					}
				}
			}
			if(rank.s.contains(name)) return num?Math.round(8*(num-1)/8+1):'s';
			if(rank.ap.contains(name)) return num?Math.round(7*(num-1)/8+1):'ap';
			if(rank.a.contains(name)) return num?Math.round(6*(num-1)/8+1):'a';
			if(rank.am.contains(name)) return num?Math.round(5*(num-1)/8+1):'am';
			if(rank.bp.contains(name)) return num?Math.round(4*(num-1)/8+1):'bp';
			if(rank.b.contains(name)) return num?Math.round(3*(num-1)/8+1):'b';
			if(rank.bm.contains(name)) return num?Math.round(2*(num-1)/8+1):'bm';
			if(rank.c.contains(name)) return num?Math.round(1*(num-1)/8+1):'c';
			if(rank.d.contains(name)) return num?Math.round(0*(num-1)/8+1):'d';
			if(lib.character[name]&&lib.character[name][4]){
				if(lib.character[name][4].contains('boss')||
				lib.character[name][4].contains('bossallowed')||
				lib.character[name][4].contains('hiddenboss')){
					return num?Math.round(9*(num-1)/8+1):'sp';
				}
			}
			return num?Math.round(9*(num-1)/8+1):'x';
		};
if(typeof get.skillRank !== 'function') get.skillRank=function(skill,type,grouped){
			var info=lib.skill[skill];
			var player=_status.event.skillRankPlayer||_status.event.player;
			if(!info) return 0;
			if(info.ai){
				if(info.ai.halfneg) return 0;
				if(typeof info.ai.combo=='string'&&player&&!player.hasSkill(info.ai.combo)){
					return 0;
				}
				if(info.ai.neg) return -1;
			}
			var num=1;
			var threaten=1;
			if(info.ai&&info.ai.threaten){
				if(typeof info.ai.threaten=='number'){
					threaten=info.ai.threaten;
				}
				else if(typeof info.ai.threaten=='function'&&player){
					threaten=info.ai.threaten(player,player);
				}
			}
			if(type&&type.indexOf('in')!=-1){
				if(info.enable=='phaseUse') num+=0.5;
				if(info.trigger&&info.trigger.player){
					var list=Array.isArray(info.trigger.player)?info.trigger.player:[info.trigger.player];
					var add=false;
					for(var i of list){
						if(i.indexOf('phase')==0){
							num+=0.5;
							add=true;
						}
						else{
							for(var j of lib.phaseName){
								if(i.indexOf[j]==0){
									num+=0.5;
									add=true;
									break;
								}
							}
						}
						if(add) break;
					}
				}
				if(info.trigger&&((typeof info.trigger.player=='string'&&info.trigger.player.indexOf('use')==0)||info.trigger.source)){
					num+=0.3;
				}
				if(num>1&&threaten>1){
					num+=Math.sqrt(threaten)-1;
				}
			}
			if(type&&type.indexOf('out')!=-1){
				if(threaten<1){
					num*=1/Math.sqrt(threaten);
				}
				if(info.trigger){
					if(info.trigger.global){
						var list=Array.isArray(info.trigger.global)?info.trigger.global:[info.trigger.global];
						num+=Math.min(3,list.length)/10;
						for(var i of list){
							if(i.indexOf('lose')==0||i.indexOf('use')==0) num+=0.3;
							if(i.indexOf('cardsDiscard')==0) num+=0.4;
						}
					}
					if(info.trigger.target||(typeof info.trigger.player=='string'&&
					(info.trigger.player.indexOf('damage')==0||info.trigger.player.indexOf('lose')==0))) num+=0.1;
				}
				if(info.ai){
					if(info.ai.maixie||info.ai.maixie_hp||info.ai.maixie_defend){
						num+=0.5;
					}
					if(info.ai.nolose||info.ai.noh||info.ai.noe||info.ai.nodiscard){
						num+=0.3;
					}
				}
			}
			if(!grouped){
				var groups=game.expandSkills([skill]);
				groups.remove(skill);
				var ggt=[];
				for(var i=0;i<groups.length;i++){
					var gi=get.skillRank(groups[i],type,true);
					if(gi<0){
						num-=0.5;
					}
					else if(gi>1){
						ggt.push(gi);
					}
				}
				if(ggt.length){
					num+=Math.max.apply(this,ggt)-1+ggt.length/20;
				}
			}
			return num;
		};
if(typeof get.targetsInfo !== 'function') get.targetsInfo=function(targets){
			var info=[];
			for(var i=0;i<targets.length;i++){
				info.push(targets[i].dataset.position);
			}
			return info;
		};
if(typeof get.cardInfo !== 'function') get.cardInfo=function(card){
			return [card.suit,card.number,card.name,card.nature];
		};
if(typeof get.cardsInfo !== 'function') get.cardsInfo=function(cards){
			var info=[];
			for(var i=0;i<cards.length;i++){
				info.push(get.cardInfo(cards[i]));
			}
			return info;
		};
if(typeof get.verticalStr !== 'function') get.verticalStr=function(str,sp){
			if(typeof str!='string') return '';
			return Array.from(str).filter(value=>value!='`').join('');
		};
if(typeof get.numStr !== 'function') get.numStr=function(num,method){
			if(num==Infinity){
				if(method=='card') return get.selectableCards().length+ui.selected.cards.length;
				if(method=='target') return get.selectableTargets().length+ui.selected.targets.length;
				return '∞';
			}
			return num.toString();
		};
if(typeof get.rawName !== 'function') get.rawName=function(str){
			if(lib.translate[str+'_ab']) return lib.translate[str+'_ab'];
			var str2=lib.translate[str];
			if(!str2) return '';
			if(str2.indexOf('SP')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('TW')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('OL')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('JSP')==0){
				str2=str2.slice(3);
			}
			else if(str2.indexOf('☆SP')==0){
				str2=str2.slice(3);
			}
			else if(str2.indexOf('手杀')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('新杀')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('界')==0&&lib.characterPack.refresh&&lib.characterPack.refresh[str]){
				str2=str2.slice(1);
			}
			else if(str2.indexOf('旧')==0&&(lib.characterPack.old||lib.characterPack.mobile)&&(lib.characterPack.old[str]||lib.characterPack.mobile[str])){
				str2=str2.slice(1);
			}
			else if(str2.indexOf('新')==0&&(str.indexOf('re_')==0||str.indexOf('new_')==0)){
				str2=str2.slice(1);
			}
			return str2;
		};
if(typeof get.rawName2 !== 'function') get.rawName2=function(str){
			if(lib.translate[str+'_ab']) return lib.translate[str+'_ab'];
			var str2=lib.translate[str];
			if(!str2) return '';
			if(str2.indexOf('SP')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('TW')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('OL')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('JSP')==0){
				str2=str2.slice(3);
			}
			else if(str2.indexOf('☆SP')==0){
				str2=str2.slice(3);
			}
			else if(str2.indexOf('手杀')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('新杀')==0){
				str2=str2.slice(2);
			}
			return str2;
		};
if(typeof get.slimName !== 'function') get.slimName=function(str){
			var str2=lib.translate[str];
			if(lib.translate[str+'_ab']) str2=lib.translate[str+'_ab'];
			if(!str2) return '';
			if(str2.indexOf('SP')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('TW')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('OL')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('JSP')==0){
				str2=str2.slice(3);
			}
			else if(str2.indexOf('☆SP')==0){
				str2=str2.slice(3);
			}
			else if(str2.indexOf('手杀')==0){
				str2=str2.slice(2);
			}
			else if(str2.indexOf('新杀')==0){
				str2=str2.slice(2);
			}
			return get.verticalStr(str2,true);
		};
if(typeof get.time !== 'function') get.time=function(){
			if(lib.status.dateDelaying){
				return lib.getUTC(lib.status.dateDelaying)-lib.getUTC(lib.status.date)-lib.status.dateDelayed;
			}
			else{
				return lib.getUTC(new Date())-lib.getUTC(lib.status.date)-lib.status.dateDelayed;
			}
		};
if(typeof get.utc !== 'function') get.utc=function(){
			return (new Date()).getTime();
		};
if(typeof get.evtDistance !== 'function') get.evtDistance=function(e1,e2){
			var dx=(e1.clientX-e2.clientX)/game.documentZoom;
			var dy=(e1.clientY-e2.clientY)/game.documentZoom;
			return Math.sqrt(dx*dx+dy*dy);
		};
if(typeof get.xyDistance !== 'function') get.xyDistance=function(from,to){
			return Math.sqrt((from[0]-to[0])*(from[0]-to[0])+(from[1]-to[1])*(from[1]-to[1]));
		};
if(typeof get.junbaIdeFilter !== 'function') get.junbaIdeFilter=function(list) {
		    let num = game.filterPlayer().length;
		    let allow = [];
		    if(num<=2) {
		        allow = ['zhu','fan'];
		    }else if(num<=3) {
		        allow = ['zhu','nei','fan'];
		    }else {
		        allow = ['zhu','mingzhong','zhong','nei','fan']
		    }
		    return list.filter(i=>{
		        if(i=='random') return true;
		        return allow.includes(i);
		    });
		};
if(typeof get.currentStyle !== 'function') get.currentStyle=function(obj, item){
		    if(typeof obj!='object') return false;
		    let style = getComputedStyle(obj);
		    if(item) return style[item];
		    return style;
		};
if(typeof get.itemtype !== 'function') get.itemtype=function(obj){
			var i,j;
			if(typeof obj=='string'){
				if(obj.length<=5){
					var bool=true;
					for(i=0;i<obj.length;i++){
						if(/h|e|j|s|x/.test(obj[i])==false){
							bool=false;break;
						}
					}
					if(bool) return 'position';
				}
				if(lib.nature.contains(obj)) return 'nature';
			}
			if(Array.isArray(obj)&&obj.length){
				var isPlayers=true;
				for(i=0;i<obj.length;i++){
					if(get.itemtype(obj[i])!='player') {isPlayers=false;break;}
				}
				if(isPlayers) return 'players';

				var isCards=true;
				for(i=0;i<obj.length;i++){
					if(get.itemtype(obj[i])!='card') {isCards=false;break;}
				}
				if(isCards) return 'cards';

				if(obj.length==2){
					if(typeof obj[0]=='number'&&typeof obj[1]=='number'){
						if(obj[0]<=obj[1]||obj[1]<=-1) return 'select';
					}
				}

				if(obj.length==4){
					var isPosition=true;
					for(i=0;i<obj.length;i++){
						if(typeof obj[i]!='number') {isPosition=false;break;}
					}
					if(isPosition) return 'divposition';
				}
			}
			if(get.objtype(obj)=='div'){
				if(obj.classList.contains('button')) return 'button';
				if(obj.classList.contains('card')) return 'card';
				if(obj.classList.contains('player')) return 'player';
				if(obj.classList.contains('dialog')) return 'dialog';
			}
			if(get.is.object(obj)){
				if(obj.isMine==lib.element.event.isMine) return 'event';
			}
		};
if(typeof get.equipNum !== 'function') get.equipNum=function(card){
			if(get.type(card)=='equip'){
				return parseInt(get.subtype(card)[5]);
			}
			return 0;
		};
if(typeof get.objtype !== 'function') get.objtype=function(obj){
			if(Object.prototype.toString.call(obj) === '[object Array]') return 'array';
			if(Object.prototype.toString.call(obj) === '[object Object]') return 'object';
			if(Object.prototype.toString.call(obj) === '[object HTMLDivElement]') return 'div';
			if(Object.prototype.toString.call(obj) === '[object HTMLTableElement]') return 'table';
			if(Object.prototype.toString.call(obj) === '[object HTMLTableRowElement]') return 'tr';
			if(Object.prototype.toString.call(obj) === '[object HTMLTableCellElement]') return 'td';
			if(Object.prototype.toString.call(obj) === '[object HTMLBodyElement]') return 'td';
		};
if(typeof get.type !== 'function') get.type=function(obj,method,player){
			if(typeof obj=='string') obj={name:obj};
			if(typeof obj!='object') return;
			var name=get.name(obj,player);
			if(!lib.card[name]) return;
			if(method=='trick'&&lib.card[name].type=='delay') return 'trick';
			return lib.card[name].type;
		};
if(typeof get.type2 !== 'function') get.type2=function(card,player){
			return get.type(card,'trick',player);
		};
if(typeof get.subtype !== 'function') get.subtype=function(obj,player){
			if(typeof obj=='string') obj={name:obj};
			if(typeof obj!='object') return;
			var name=get.name(obj,player);
			if(!lib.card[name]) return;
			return lib.card[name].subtype;
		};
if(typeof get.name !== 'function') get.name=function(card,player){
			if(get.itemtype(player)=='player'||(player!==false&&get.position(card)=='h')){
				var owner=player||get.owner(card);
				if(owner){
					return game.checkMod(card,owner,card.name,'cardname',owner);
				}
			}
			return card.name;
		};
if(typeof get.suit !== 'function') get.suit=function(card,player){
			if(!card) return;
			if(Array.isArray(card)){
				if(card.length==1) return get.suit(card[0],player);
				return 'none';
			}
			else if(!card.hasOwnProperty('suit')&&Array.isArray(card.cards)){
				return get.suit(card.cards,player);
			}
			else{
				if(player!==false){
					const owner=player||get.owner(card);
					if(owner){
						return game.checkMod(card,card.suit,'suit',owner);
					}
				}
				if(lib.suits.contains(card.suit)) return card.suit;
				return 'none';
			}
		};
if(typeof get.color !== 'function') get.color=function(card,player){
			if(!card) return;
			if(Array.isArray(card)){
				if(!card.length) return 'none';
				const color=get.color(card[0],player);
				for(let i=1;i<card.length;i++){
					if(get.color(card[i],player)!=color) return 'none';
				}
				return color;
			}
			else if(Object.keys(lib.color).includes(card.color)){
				return card.color;
			}
			else if(Array.isArray(card.cards)&&!lib.suit.includes(card.suit)){
				return get.color(card.cards,player);
			}
			else{
				const suit=get.suit(card,player);
				for(let i in lib.color){
					if(lib.color[i].includes(suit)) return i;
				}
				return 'none';
			}
		};
if(typeof get.number !== 'function') get.number=function(card,player){
			//狗卡你是真敢出啊
			var number=null;
			if(card.hasOwnProperty('number')){
				number=card.number;
				if(typeof number!='number') number=null;
			}
			else{
				if(card.cards&&card.cards.length==1) number=get.number(card.cards[0],false);
			}
			if(player!==false){
				var owner=player||get.owner(card);
				if(owner){
					return game.checkMod(card,owner,number,'cardnumber',owner);
				}
			}
			return number;
		};
if(typeof get.nature !== 'function') get.nature=function(card,player){
			if(get.itemtype(player)=='player'||player!==false){
				var owner=get.owner(card);
				if(owner){
					return game.checkMod(card,owner,card.nature,'cardnature',owner);
				}
			}
			return card.nature;
		};
if(typeof get.cards !== 'function') get.cards=function(num,putBack){
			if(_status.waitingForCards){
				ui.create.cards.apply(ui.create,_status.waitingForCards);
				delete _status.waitingForCards;
			}
			var list=[];
			var card=false;
			if(typeof num!='number') num=1;
			if(num==0) {card=true;num=1;}
			if(num<0) num=1;
			while(num--){
				if(ui.cardPile.hasChildNodes()==false){
					game.washCard();
				}
				if(ui.cardPile.hasChildNodes()==false){
					game.over('平局');
					return [];
				}
				var cardx=ui.cardPile.removeChild(ui.cardPile.firstChild);
				cardx.original='c';
				list.push(cardx);
			}
			if(putBack){
				for(let i=list.length-1;i>=0;i--){
					ui.cardPile.insertBefore(list[i],ui.cardPile.firstChild);
				}
			}
			game.updateRoundNumber();
			if(card) return list[0];
			return list;
		};
if(typeof get.judge !== 'function') get.judge=function(card){
			if(card.viewAs) return lib.card[card.viewAs].judge;
			return get.info(card).judge;
		};
if(typeof get.judge2 !== 'function') get.judge2=function(card){
			if(card.viewAs) return lib.card[card.viewAs].judge2;
			return get.info(card).judge2;
		};
if(typeof get.distance !== 'function') get.distance=function(from,to,method){
			if(from==to) return 0;
			if(!game.players.contains(from)&&!game.dead.contains(from)) return Infinity;
			if(!game.players.contains(to)&&!game.dead.contains(to)) return Infinity;
			let player=from,m,n=1,i,fxy,txy;
			if(game.chess){
				fxy=from.getXY();
				txy=to.getXY();
				n=Math.abs(fxy[0]-txy[0])+Math.abs(fxy[1]-txy[1]);
				if(method=='raw'||method=='pure'||method=='absolute') return n;
			}
			else if(to.isMin(true)||from.isMin(true)){
				if(method=='raw'||method=='pure'||method=='absolute') return n;
			}
			else{
				let length=game.players.length;
				const totalPopulation=game.players.length+game.dead.length+1;
				for(let iwhile=0;iwhile<totalPopulation;iwhile++){
					if(player.nextSeat!=to){
						player=player.nextSeat;
						if(player.isAlive()&&!player.isOut()&&!player.hasSkill('undist')&&!player.isMin(true)) n++;
					}
					else{
						break;
					}
				}
				for(i=0;i<game.players.length;i++){
					if(game.players[i].isOut()||game.players[i].hasSkill('undist')||game.players[i].isMin(true)) length--;
				}
				if(method=='absolute') return n;
				if(from.isDead()) length++;
				if(to.isDead()) length++;
				const left=from.hasSkillTag('left_hand');
				const right=from.hasSkillTag('right_hand');
				if(left===right) n=Math.min(n,length-n);
				else if(left==true) n=length-n;
				if(method=='raw'||method=='pure') return n;
			}

			n=game.checkMod(from,to,n,'globalFrom',from);
			n=game.checkMod(from,to,n,'globalTo',to);
			m=n;
			m=game.checkMod(from,to,m,'attackFrom',from);
			m=game.checkMod(from,to,m,'attackTo',to);
			var equips1=from.getCards('e',function(card){
				return !ui.selected.cards||!ui.selected.cards.contains(card);
			}),equips2=to.getCards('e',function(card){
				return !ui.selected.cards||!ui.selected.cards.contains(card);
			});
			for(i=0;i<equips1.length;i++){
				var info=get.info(equips1[i]).distance;
				if(!info) continue;
				if(info.globalFrom){
					m+=info.globalFrom;
					n+=info.globalFrom;
				}
			}
			const attakRange=equips1.reduce((range,card)=>{
				let newRange=1;
				const info=get.info(card,false);
				if(info.distance){
					//如果存在attackRange 则通过attackRange动态获取攻击范围
					if(typeof info.distance.attackRange=='function'){
						newRange=info.distance.attackRange(card,player);
					}
					//否则采用祖宗之法
					else if(typeof info.distance.attackFrom=='number'){
						newRange-=info.distance.attackFrom;
					}
				}
				return Math.max(range,newRange)
			},1);
			m+=(1-attakRange)
			for(i=0;i<equips2.length;i++){
				var info=get.info(equips2[i]).distance;
				if(!info) continue;
				if(info.globalTo){
					m+=info.globalTo;
					n+=info.globalTo;
				}
				if(info.attaclTo){
					m+=info.attaclTo;
				}
			}
			if(method=='attack') return m;
			if(method=='unchecked') return n;
			return Math.max(1,n);
		};
if(typeof get.info !== 'function') get.info=function(item,player){
			if(typeof item=='string'){
				return lib.skill[item];
			}
			if(typeof item=='object'){
				var name=item.name;
				if(player!==false) name=get.name(item,player);
				return lib.card[name];
			}
		};
if(typeof get.select !== 'function') get.select=function(select){
			if(typeof select=='number') return [select,select];
			if(get.itemtype(select)=='select') return select;
			if(typeof select=='function') return get.select(select());
			return [1,1]
		};
if(typeof get.card !== 'function') get.card=function(original){
			if(_status.event.skill){
				var card=get.info(_status.event.skill).viewAs;
				if(typeof card=='function') card=card(ui.selected.cards,_status.event.player);
				if(card){
					return get.autoViewAs(card,ui.selected.cards);
				}
			}
			if(_status.event._get_card){
				return _status.event._get_card;
			}
			var card=ui.selected.cards[0];
			if(original) return card;
			if(card){
				card=get.autoViewAs(card,ui.selected.cards);
			}
			return card;
		};
if(typeof get.position !== 'function') get.position=function(card,ordering){
			if(get.itemtype(card)=='player') return parseInt(card.dataset.position);
			if(card.timeout&&card.destiny&&card.destiny.classList){
				if(card.destiny.classList.contains('equips')) return 'e';
				if(card.destiny.classList.contains('judges')) return 'j';
				if(card.destiny.classList.contains('expansions')) return 'x';
				if(card.destiny.classList.contains('handcards')) return card.classList.contains('glows')?'s':'h';
				if(card.destiny.id=='cardPile') return 'c';
				if(card.destiny.id=='discardPile') return 'd';
				if(card.destiny.id=='special') return 's';
				if(card.destiny.id=='ordering') return ordering?'o':'d';
				return null;
			}
			if(!card.parentNode||!card.parentNode.classList) return;
			if(card.parentNode.classList.contains('equips')) return 'e';
			if(card.parentNode.classList.contains('judges')) return 'j';
			if(card.parentNode.classList.contains('expansions')) return 'x';
			if(card.parentNode.classList.contains('handcards')) return card.classList.contains('glows')?'s':'h';
			if(card.parentNode.id=='cardPile') return 'c';
			if(card.parentNode.id=='discardPile') return 'd';
			if(card.parentNode.id=='special') return 's';
			if(card.parentNode.id=='ordering') return ordering?'o':'d';
			return null;
		};
if(typeof get.skillTranslation !== 'function') get.skillTranslation=function(str,player){
			var str2;
			if(!str) return "";
			if(str.indexOf('re')==0){
				str2=str.slice(2);
				if(str2){
					if(lib.translate[str]==lib.translate[str2]){
						if(player.hasSkill(str2)){
							return '界'+lib.translate[str];
						}
					}
				}
			}
			else if(str.indexOf('xin')==0){
				str2=str.slice(3);
				if(str2){
					if(lib.translate[str]==lib.translate[str2]){
						if(player.hasSkill(str2)){
							return '新'+lib.translate[str];
						}
					}
				}
			}
			return get.translation(str);
		};
if(typeof get.skillInfoTranslation !== 'function') get.skillInfoTranslation=function(name,player){
			if(player&&lib.dynamicTranslate[name]) return lib.dynamicTranslate[name](player,name);
			var str=lib.translate[name+'_info'];
			if(!str) return '';
			return str;
			// return str.replace(/锁定技/g,'<span class="yellowtext">锁定技</span>').
			// 	replace(/限定技/g,'<span class="yellowtext">限定技</span>').
			// 	replace(/觉醒技/g,'<span class="greentext">觉醒技</span>').
			// 	replace(/主将技/g,'<span class="bluetext">主将技</span>').
			// 	replace(/副将技/g,'<span class="bluetext">副将技</span>').
			// 	replace(/阵法技/g,'<span class="bluetext">阵法技</span>').
			// 	replace(/主公技/g,'<span class="firetext">主公技</span>');
		};
if(typeof get.prefixBoldName !== 'function') get.prefixBoldName=function(name,type,renew) {
		    if(!lib.config.prefixname_highlight) {
		        if(type=='translation'||type=='justView') return get.translation(name);
		        return get.slimName(name);
		    }
		    if(!lib.config.prefixNameShowList) {
		        lib.config.prefixNameShowList={};
		    }
		    var needToChg=false;
		    if(lib.character[name]&&lib.character[name][4]&&lib.character[name][4].contains('isExtension')) needToChg=true;
		    //character：场内角色单独渲染｜扩展角色也单独渲染｜justView新染，不覆盖
		    if(lib.config.prefixNameShowList[name]&&!renew&&type!='character'&&type!='justView'&&!needToChg) {
		        return lib.config.prefixNameShowList[name];
		    }else {
		        var nameText=lib.translate[name]?lib.translate[name]:'';
                var traText=false;
                if(get.prefixNameConfig(name,'unsave')) {
                    var prefixx=get.prefixNameConfig(name,'unsave');
                    if(type=='character') {
                        if(prefixx=='☆SP') prefixx='☆<br>SP';
                        /*var replaceSP=function(str,pre) {
                            if(str.indexOf(pre)!=-1) {
                                return str.replace(pre,'<span style="font-size: 7px">'+pre+'</span>');
                            }else {
                                return str;
                            }
                        }
                        var spname=['SP','sp','TW','tw','OL','ol'];
                        spname.forEach(sp=>{
                            prefixx=replaceSP(prefixx,sp);
                        });*/
                    }
                    traText = get.noWrapText('<span style="font-weight: bold;">'+prefixx+'</span>'+nameText.slice(get.prefixNameConfig(name,'unsave').length).replace(/<br>/g, '\n'));
                }else {
                    traText = get.noWrapText(nameText.replace(/<br>/g, '\n'));
                }
                //character：不要保存直接返回
                if(type=='character') return traText;
                //justView：不要保存直接返回
                if(type=='justView') return traText;
                
		        lib.config.prefixNameShowList[name]=traText;
		        game.saveConfig('prefixNameShowList',lib.config.prefixNameShowList);
		        let object1=Object.keys(lib.character).filter(key=>{
		            if(lib.character[key].length<5) return true;
		            return !lib.character[key][4].contains('unseen');
		        });
		        let object2=Object.keys(lib.config.prefixNameShowList);
		        let bool=object1.length>object2.length;
		        //Helasisy调整
		        if(bool) get.showNameProgress.show(object1,object2,bool);
		        return traText;
		    }
		};
if(typeof get.noWrapText !== 'function') get.noWrapText=function(str) {
		    return '<span style="white-space: keep-all;">'+str+'</span>';
		};
if(typeof get.prefixNameConfig !== 'function') get.prefixNameConfig=function(name,renew) {
		    if(!lib.config.prefixNameList) {
		        lib.config.prefixNameList={};
		    }
		    if(lib.config.prefixNameList[name]&&!renew) {
		        return lib.config.prefixNameList[name];
		    }else {
		        var gets=get.prefixName(name);
		        //unsave，新建但不保存
		        if(renew!='unsave') {
    		        lib.config.prefixNameList[name]=gets;
    		        game.saveConfig('prefixNameList',lib.config.prefixNameList);
		        }
		        return gets;
		    }
		};
if(typeof get.prefixName !== 'function') get.prefixName=function(name) {
		    if(!name) return false;
		    var allName=lib.translate[name];
		    if(!allName||!lib.character[name]) return false;
		    //新版判断：如有_prefix，直接获取
		    if(lib.translate[name+'_prefix']) {
		        var preName=lib.translate[name+'_prefix'];
		        if(allName.indexOf(preName)==0) {
    		        return preName;
    		    }
		    }
		    //特殊武将无前缀判断
			if(name.indexOf('txhj_')==0||name.indexOf('boss_')==0) {
			    return false;
			}
		    //初步判断：如有前缀，直接获取
		    var prename=get.prefixItems.detalPrename||[];
			for(var i=0;i<prename.length;i++) {
			    if(allName.indexOf(prename[i])==0) return prename[i];
			}
			//再次判断：如有_ab，将其提取
		    if(lib.translate[name+'_ab']) {
		        var abName=lib.translate[name+'_ab'];
		        if(allName.indexOf(abName)>0) {
    		        return allName.slice(0,allName.indexOf(abName));
    		    }
		    }
			//最后判断：如有真名，截断获取
			var realName=get.characterName(name);
		    if(realName&&allName.indexOf(realName)>0) {
		        return allName.slice(0,allName.indexOf(realName));
		    }
		    return false;
		};
if(typeof get.characterName !== 'function') get.characterName=function(name,dvd) {
			if(!lib.character[name]) return '某';
			var str='某';
			var doubleList=get.prefixItems.doubleList||[];
			var prename=[];
			var forbidPre=['卧龙'];
			//特殊武将无前缀判断
			if(name.indexOf('txhj_')!=0&&name.indexOf('boss_')!=0) {
    			prename=get.prefixItems.prename||[];
    			for(var i in lib.skill) {
    			    var tras=get.translation(i);
    			    if(forbidPre.contains(tras)) continue;
    			    if(tras!='') prename.push(tras);
    			}
			}
			if(name.lastIndexOf('_')!=-1) {
			    var name2=name.slice(name.lastIndexOf('_')+1);
			    if(lib.character[name2]&&get.translation(name2)!=''&&get.translation(name2)!=name2) {
			        return get.characterName(name2,dvd);
			    }
			}
			if(get.translation(name)!=''&&get.translation(name)!=name) {
			    str=get.translation(name);
			}
			if(str.length>3&&prename.contains(str.slice(0,3))) {
			    str=str.slice(3);
			}else if(str.length>2&&prename.contains(str.slice(0,2))) {
			    str=str.slice(2);
			}else if(str.length>1&&prename.contains(str.slice(0,1))) {
			    str=str.slice(1);
			}
			if(dvd) {
			    //双人的武将可随机出
				var names=[];
				var tras=[];
				var xings=[];
				var mings=[];
				if(str.length>=4&&!doubleList.contains(str.slice(0,2))) {
			    	var spl=Math.floor(str.length/2);
			        names.push(str.slice(0,spl));
			        names.push(str.slice(spl));
				}else {
					names.push(str);
				}
			    var getXM=function(str,xm){
			        var xing='';
			    	if(str.length>2&&doubleList.contains(str.slice(0,2))) {
			    	    xing=str.slice(0,2);
			    	}else {
			        	xing=str.slice(0,1);
			    	}
			    	var ming=str.slice(xing.length);
			    	if(xm=='姓') {
			        	return xing;
			    	}
			    	if(xm=='名') {
			        	return ming;
			    	}
			    };
			    names.forEach(name=>{
			    	tras.push([getXM(name,'姓'),getXM(name,'名')]);
			    	xings.push(getXM(name,'姓'));
			    	mings.push(getXM(name,'名'));
			    });
			    if(dvd=='rand') {
			        return tras.randomGet();
			    }else if(dvd=='all') {
			        return tras;
			    }else if(dvd=='姓') {
			        return xings;
			    }else if(dvd=='名') {
			        return mings;
			    }
			}
			return str;
		};
if(typeof get.translation !== 'function') get.translation=function(str,arg){
			if(str&&typeof str=='object'&&(str.name||str._tempTranslate)){
				if(str._tempTranslate) return str._tempTranslate;
				var str2;
				if(arg=='viewAs'&&str.viewAs){
					str2=get.translation(str.viewAs);
				}
				else{
					str2=get.translation(str.name);
				}
				if(str2=='杀'){
					if(str.nature=='fire'){
						str2='火'+str2;
					}
					else if(str.nature=='thunder'){
						str2='雷'+str2;
					}
					else if(str.nature=='kami'){
						str2='神'+str2;
					}
					else if(str.nature=='ice'){
						str2='冰'+str2;
					}
					else if(str.nature=='stab'){
						str2='刺'+str2;
					}
				}
				if(get.itemtype(str)=='card'||str.isCard){
					if(_status.cardtag&&str.cardid){
						var tagstr='';
						for(var i in _status.cardtag){
							if(_status.cardtag[i].contains(str.cardid)){
								tagstr+=lib.translate[i+'_tag'];
							}
						}
						if(tagstr){
							str2+='·'+tagstr;
						}
					}
					if(str.suit&&str.number){
						var cardnum=str.number||'';
						if([1,11,12,13].contains(cardnum)){
							cardnum={'1':'A','11':'J','12':'Q','13':'K'}[cardnum]
						}
						if(arg=='viewAs'&&str.viewAs!=str.name&&str.viewAs){
							str2+='（'+get.translation(str)+'）';
						}
						else{
							str2+='【'+get.translation(str.suit)+cardnum+'】';
							// var len=str2.length-1;
							// str2=str2.slice(0,len)+'<span style="letter-spacing: -2px">'+str2[len]+'·</span>'+get.translation(str.suit)+str.number;
						}
					}
				}
				return str2;
			}
			if(Array.isArray(str)){
				var str2=get.translation(str[0],arg);
				for(var i=1;i<str.length;i++){
					str2+='、'+get.translation(str[i],arg);
				}
				return str2;
			}
			if(arg=='skill'){
				if(lib.translate[str+'_ab']) return lib.translate[str+'_ab'];
				if(lib.translate[str]) return lib.translate[str].slice(0,2);
				return str;
			}
			else if(arg=='info'){
				if(lib.translate[str+'_info']) return lib.translate[str+'_info'];
				var str2=str.slice(0,str.length-1);
				if(lib.translate[str2+'_info']) return lib.translate[str2+'_info'];
				if(str.lastIndexOf('_')>0){
					str2=str.slice(0,str.lastIndexOf('_'));
					if(lib.translate[str2+'_info']) return lib.translate[str2+'_info'];
				}
				str2=str.slice(0,str.length-2);
				if(lib.translate[str2+'_info']) return lib.translate[str2+'_info'];
				if(lib.skill[str]&&lib.skill[str].prompt) return lib.skill[str].prompt;
			}
			if(lib.translate[str]){
				return lib.translate[str];
			}
			if(typeof str=='string'){
				return str;
			}
			if(typeof str=='number'||typeof str=='boolean'){
				return str.toString();
			}
			if(str&&str.toString){
				if(str.toString().indexOf('[object')==0) return '未知';
				return str.toString();
			}
			return '';
		};
if(typeof get.strNumber !== 'function') get.strNumber=function(num){
			//Helasisy修：空值返回"↕"/"?"
			switch(num){
				case 1:return 'A';
				case 11:return 'J';
				case 12:return 'Q';
				case 13:return 'K';
				default:return num?num.toString():'?';
			}
		};
if(typeof get.intNumber !== 'function') get.intNumber=function(str){
		    if(str=='∞') return Infinity;
		    if(!str||!str.length||str.length>5) return false;
		    if(str=='一百') return 100;
		    if(str[1]=='百'&&get.intNumber(str[0])!==false&&get.intNumber(str.slice(2))!==false) {
		        return get.intNumber(str[0])*100+get.intNumber(str.slice(2));
		    }
		    if(str.length==1) {
		        for(var i=0;i<=10;i++) {
		            if(get.cnNumber(i)==str||get.cnNumber(i,true)==str) return i;
		        }
		        return false;
		    }
		    if(str.length==2) {
		        if(str[0]=='零') {
		            if(get.intNumber(str[1])!==false) {
		                return get.intNumber(str[1]);
		            }
		        }
		        if(str[0]=='十') {
		            if(get.intNumber(str[1])!==false) {
		                return 10+get.intNumber(str[1]);
		            }
		        }
		        if(get.intNumber(str[0])!==false&&str[1]=='十') {
		            return get.intNumber(str[0])*10;
		        }
		        return false;
		    }
		    if(get.intNumber(str[0])!==false&&get.intNumber(str[2])!==false&&get.intNumber(str[2])!='十') {
		        return get.intNumber(str[0])*10+get.intNumber(str[2]);
		    }
		    return false;
		};
if(typeof get.rankNum !== 'function') get.rankNum=function(name) {
		    var raritys=['none','d','c','bm','b','bp','am','a','ap','s'];
		    var sts=get.rank(name);
		    var maxStar=lib.config.five_gold_sj?5:4;
		    var stn=raritys.indexOf(sts);
		    var rkn=Math.floor(maxStar*stn/raritys.length);
		    if(rkn<=0) rkn=Math.ceil(maxStar*0.5);
		    return rkn+1;
		};
if(typeof get.zhuFriendGroups !== 'function') get.zhuFriendGroups=function(fan){
		    if(get.mode()!='identity') return false;
		    if(!game.zhu||!game.zhu.group||!game.zhu.name) return false;
		    if(!lib.character||!lib.character[game.zhu.name]) return false;
		    if(!lib.character[game.zhu.name][4]||!lib.character[game.zhu.name][4].contains('zhu')) return false;
		    var groups=lib.group.slice(0);
		    if(game.zhu.name.indexOf('sb_')==0&&groups.contains(game.zhu.group)) groups.remove(game.zhu.group);
		    if(groups.contains('shen')) groups.remove('shen');
		    if(fan) return groups;
		    return [game.zhu.group];
		};
if(typeof get.cnNumber !== 'function') get.cnNumber=function(num,two){
			if(num==Infinity) return '∞';
			if(isNaN(num)) return '';
			if(typeof num!='number') return num;
			if(num<0||num>99) return num;
			if(num<=10){
				switch(num){
					case 0:return '〇';
					case 1:return '一';
					case 2:return two?'二':'两';
					case 3:return '三';
					case 4:return '四';
					case 5:return '五';
					case 6:return '六';
					case 7:return '七';
					case 8:return '八';
					case 9:return '九';
					case 10:return '十';
				}
			}
			if(num<20){
				return '十'+get.cnNumber(num-10,true);
			}
			var x=Math.floor(num/10);
			return get.cnNumber(x,true)+'十'+(num>10*x?get.cnNumber(num-10*x,true):'');
		};
if(typeof get.selectableCards !== 'function') get.selectableCards=function(sort){
			if(!_status.event.player) return[];
			var cards=_status.event.player.getCards('hes');
			var selectable=[];
			for(var i=0;i<cards.length;i++){
				if(cards[i].classList.contains('selectable')&&
					cards[i].classList.contains('selected')==false){
					selectable.push(cards[i]);
				}
			}
			if(sort){
				selectable.sort(sort);
			}
			return selectable;
		};
if(typeof get.selectableTargets !== 'function') get.selectableTargets=function(sort){
			var selectable=[];
			var players=game.players.slice(0);
			if(_status.event.deadTarget) players.addArray(game.dead);
			for(var i=0;i<players.length;i++){
				if(players[i].classList.contains('selectable')&&
					players[i].classList.contains('selected')==false){
					selectable.push(players[i]);
				}
			}
			selectable.randomSort();
			if(sort){
				selectable.sort(sort);
			}
			return selectable;
		};
if(typeof get.filter !== 'function') get.filter=function(filter,i){
			if(typeof filter=='function') return filter;
			if(i==undefined) i=0;
			var result=function(){
				if(filter==arguments[i]) return true;
				for(var j in filter){
					if(filter.hasOwnProperty(j)){
						if(get.itemtype(arguments[i])=='card'){
							if(j=='name'){
								if(Array.isArray(filter[j])){
									if(filter[j].contains(get.name(arguments[i]))==false) return false;
								}
								else if(typeof filter[j]=='string'){
									if(get.name(arguments[i])!=filter[j]) return false;
								}
							}
							else if(j=='type'){
								if(Array.isArray(filter[j])){
									if(filter[j].contains(get.type(arguments[i]))==false) return false;
								}
								else if(typeof filter[j]=='string'){
									if(get.type(arguments[i])!=filter[j]) return false;
								}
							}
							else if(j=='subtype'){
								if(Array.isArray(filter[j])){
									if(filter[j].contains(get.subtype(arguments[i]))==false) return false;
								}
								else if(typeof filter[j]=='string'){
									if(get.subtype(arguments[i])!=filter[j]) return false;
								}
							}
							else if(j=='color'){
								if(Array.isArray(filter[j])){
									if(filter[j].contains(get.color(arguments[i]))==false) return false;
								}
								else if(typeof filter[j]=='string'){
									if(get.color(arguments[i])!=filter[j]) return false;
								}
							}
							else if(j=='suit'){
								if(Array.isArray(filter[j])){
									if(filter[j].contains(get.suit(arguments[i]))==false) return false;
								}
								else if(typeof filter[j]=='string'){
									if(get.suit(arguments[i])!=filter[j]) return false;
								}
							}
							else if(j=='number'){
								if(Array.isArray(filter[j])){
									if(filter[j].contains(get.number(arguments[i]))==false) return false;
								}
								else if(typeof filter[j]=='string'){
									if(get.number(arguments[i])!=filter[j]) return false;
								}
							}
							else if(Array.isArray(filter[j])){
								if(filter[j].contains(arguments[i][j])==false) return false;
							}
							else if(typeof filter[j]=='string'){
								if(arguments[i][j]!=filter[j]) return false;
							}
						}
						else{
							if(arguments[i][j]!=filter[j]) return false;
						}
					}
				}
				return true;
			}
			result._filter_args=[filter,i];
			return result;
		};
if(typeof get.skillCount !== 'function') get.skillCount=function(skill,player){
			if(player==undefined) player=_status.event.player;
			var num=player.getStat('skill')[skill];
			if(num==undefined) return 0;
			return num;
		};
if(typeof get.owner !== 'function') get.owner=function(card,method){
			var list=game.players.concat(game.dead);
			for(var i=0;i<list.length;i++){
				if(list[i].getCards('hejsx').contains(card)) return list[i];
				if(list[i].judging[0]==card&&method!='judge') return list[i];
			}
			//for(var i=0;i<game.players.length;i++){
			//	if(game.players[i].using&&game.players[i].using.contains(card)) return game.players[i];
			//}
		};
if(typeof get.noSelected !== 'function') get.noSelected=function(){
			return (ui.selected.buttons.length+ui.selected.cards.length+ui.selected.targets.length==0)
		};
if(typeof get.population !== 'function') get.population=function(identity){
			if(identity==undefined) return game.players.length+game.dead.length;
			var i;
			var num=0;
			for(i=0;i<game.players.length;i++){
				if(game.players[i].identity==identity) num++;
			}
			return num;
		};
if(typeof get.totalPopulation !== 'function') get.totalPopulation=function(identity){
			if(identity==undefined) return game.players.length+game.dead.length;
			var i,players=game.players.concat(game.dead);
			var num=0;
			for(i=0;i<players.length;i++){
				if(players[i].identity==identity) num++;
			}
			return num;
		};
if(typeof get.cardtag !== 'function') get.cardtag=function(item,tag){
			if(item.cardid&&(get.itemtype(item)=='card'||!item.cards||!item.cards.length||item.name==item.cards[0].name)&&_status.cardtag&&_status.cardtag[tag]&&_status.cardtag[tag].contains(item.cardid)){
				return true;
			}
			if(item.cardtags&&item.cardtags.contains(tag)) return true;
			return false;
		};
if(typeof get.tag !== 'function') get.tag=function(item,tag,item2,bool){
			var result;
			if(get.info(item)&&get.info(item).ai&&get.info(item).ai.tag){
				result=get.info(item,bool).ai.tag[tag];
			}
			if(typeof result=='function') return result(item,item2);
			return result;
		};
if(typeof get.sortCard !== 'function') get.sortCard=function(sort){
			var func;
			if(sort=='type_sort'){
				func=function(card){
					var type=get.type(card,null,false);
					var subtype=get.subtype(card,false);
					if(lib.cardType[subtype]){
						return lib.cardType[subtype];
					}
					if(lib.cardType[type]){
						return lib.cardType[type];
					}
					switch(type){
						case 'basic':return 2;
						case 'chess':return 1.5;
						case 'trick':return -1;
						case 'delay':return -2;
						case 'equip':return -3;
						default:return -4;
					}
				}
			}
			else if(sort=='suit_sort'){
				func=function(card){
					if(get.suit(card)=='heart') return 2;
					if(get.suit(card)=='diamond') return 1;
					if(get.suit(card)=='spade') return -1;
					if(get.suit(card)=='club') return -2;
				}
			}
			else if(sort=='number_sort'){
				func=function(card){
					return get.number(card)-7+0.5;
				}
			}
			return func;
		};
if(typeof get.cardPile !== 'function') get.cardPile=function(name,create){
			var filter=function(card){
				if(typeof name=='string'){
					if(card.name==name){
						return true;
					}
				}
				else if(typeof name=='function'){
					if(name(card)){
						return true;
					}
				}
				return false;
			};
			if(create!='discardPile'){
				var num=get.rand(0,ui.cardPile.childNodes.length-1);
				for(var i=0;i<ui.cardPile.childNodes.length;i++){
					var j=i;
					if(j>=ui.cardPile.childNodes.length) j-=ui.cardPile.childNodes.length;
					if(filter(ui.cardPile.childNodes[j])){
						return ui.cardPile.childNodes[j];
					}
				}
			}
			if(create!='cardPile'){
				for(var i=0;i<ui.discardPile.childNodes.length;i++){
					var j=i;
					if(j>=ui.discardPile.childNodes.length) j-=ui.discardPile.childNodes.length;
					if(filter(ui.discardPile.childNodes[j])){
						return ui.discardPile.childNodes[j];
					}
				}
			}
			if(create=='field'){
				var found=null;
				game.findPlayer(function(current){
					var ej=current.getCards('ej');
					for(var i=0;i<ej.length;i++){
						if(filter(ej[i])){
							found=ej[i];
							return true;
						}
					}
				});
				return found;
			}
			if(create&&!['cardPile','discardPile','field'].contains(create)){
				return game.createCard(name);
			}
			return null;
		};
if(typeof get.cardPile2 !== 'function') get.cardPile2=function(name){
			return get.cardPile(name,'cardPile');
		};
if(typeof get.discardPile !== 'function') get.discardPile=function(name){
			return get.cardPile(name,'discardPile');
		};
if(typeof get.skillintro !== 'function') get.skillintro=function(name,learn,learn2){
			var str='';
			var infoitem=lib.character[name];
			if(!infoitem){
				for(var itemx in lib.characterPack){
					if(lib.characterPack[itemx][name]){
						infoitem=lib.characterPack[itemx][name];break;
					}
				}
			}
			var skills=infoitem[3];
			var opacity;
			for(var i=0;i<skills.length;i++){
				if(lib.translate[skills[i]]&&lib.translate[skills[i]+'_info']&&lib.skill[skills[i]]){
					if(learn&&lib.skill[skills[i]].unique&&(learn2||!lib.skill[skills[i]].gainable)){
						opacity='opacity:0.5';
					}
					else{
						opacity='';
					}
					var skilltrans=get.translation(skills[i]).slice(0,2);
					str+='<div class="skill" style="'+opacity+
					'">【'+skilltrans+'】</div><div style="'+opacity+'">'+
					get.skillInfoTranslation(skills[i])+'</div><div style="display:block;height:10px"></div>';
				}
			}
			return str;
		};
if(typeof get.storageintro !== 'function') get.storageintro=function(type,content,player,dialog,skill){
			switch(type){
				case 'mark':{
					if(content>0){
						return '共有'+content+'个标记';
					}
					return false;
				}
				case 'turn':{
					if(content>0){
						return '剩余'+content+'个回合';
					}
					return false;
				}
				case 'time':{
					if(content>0){
						return '剩余'+content+'次';
					}
					return false;
				}
				case 'limited':{
					if(content){
						return '已发动';
					}
					return '未发动';
				}
				case 'info':{
					return lib.translate[skill+'_info'];
				}
				case 'cardCount':{
					if(Array.isArray(content)){
						return '共有'+get.cnNumber(content.length)+'张牌';
					}
					return false;
				}
				case 'expansion':{
					content=player.getCards('x',function(card){
						return card.hasGaintag(skill);
					});
					if(dialog&&content.length){
						dialog.addAuto(content);
					}
					else{
						return '没有卡牌';
					}
					return false;
				}
				case 'card':case 'cards':{
					if(get.itemtype(content)=='card'){
						content=[content];
					}
					if(dialog&&get.itemtype(content)=='cards'){
						dialog.addAuto(content);
					}
					else{
						if(content&&content.length){
							return get.translation(content);
						}
					}
					if(Array.isArray(content)&&!content.length){
						return '没有卡牌';
					}
					return false;
				}
				case 'player':case 'players':{
					if(get.itemtype(content)=='player'){
						content=[content];
					}
					if(dialog&&get.itemtype(content)=='players'){
						dialog.addAuto(content);
						return false;
					}
					else{
						if(content&&content.length){
							return get.translation(content);
						}
						return false;
					}
				}
				case 'character':case 'characters':{
					if(typeof content=='string'){
						content=[content];
					}
					if(dialog&&Array.isArray(content)){
						dialog.addAuto([content,'character']);
						return false;
					}
					else{
						if(content&&content.length){
							return get.translation(content);
						}
						return false;
					}
				}
				default:{
					if(typeof type=='string'){
						type=type.replace(/#/g,content);
						type=type.replace(/&/g,get.cnNumber(content));
						type=type.replace(/\$/g,get.translation(content));
						return type;
					}
					else if(typeof type=='function'){
						return type(content,player,skill);
					}
					return false;
				}
			}
		};
if(typeof get.nodeintro !== 'function') get.nodeintro=function(node,simple,evt){
			var uiintro=ui.create.dialog('hidden','notouchscroll');
			if(node.classList.contains('player')&&!node.name){
				return uiintro;
			}
			var i,translation,intro,str;
			if(node._nointro) return;
			if(typeof node._customintro=='function'){
				if(node._customintro(uiintro,evt)===false) return;
			}
			else if(Array.isArray(node._customintro)){
				var caption=node._customintro[0];
				var content=node._customintro[1];
				if(typeof caption=='function'){
					caption=caption(node);
				}
				if(typeof content=='function'){
					content=content(node);
				}
				uiintro.add(caption);
				uiintro.add('<div class="text center" style="padding-bottom:5px">'+content+'</div>');
			}
			else if(node.classList.contains('player')||node.linkplayer){
				if(node.linkplayer){
					node=node.link;
				}
				var capt=get.translation(node.name);
				if(lib.group.contains(node.group)||get.character(node.name,1)){
					capt+='&nbsp;&nbsp;'+(lib.group.contains(node.group)?get.translation(node.group):get.translation(get.character(node.name,1)));
				}
				uiintro.add(capt);

				if(lib.characterTitle[node.name]){
					uiintro.addText(get.colorspan(lib.characterTitle[node.name]));
				}

				if(!node.noclick){
					const allShown=(node.isUnderControl()||(!game.observe&&game.me&&game.me.hasSkillTag('viewHandcard',null,node,true)));
					const shownHs=node.getShownCards();
					if(shownHs.length){
						uiintro.add('<div class="text center">明置的手牌</div>');
						uiintro.addSmall(shownHs);
						if(allShown){
							var hs=node.getCards('h');
							hs.removeArray(shownHs)
							if(hs.length){
								uiintro.add('<div class="text center">其他手牌</div>');
								uiintro.addSmall(hs);
							}
						}
					}
					else if(allShown){
						var hs=node.getCards('h');
						if(hs.length){
							uiintro.add('<div class="text center">手牌</div>');
							uiintro.addSmall(hs);
						}
					}
				}

				var skills=node.getSkills(null,false,false).slice(0);
				var skills2=game.filterSkills(skills,node);
				if(node==game.me&&node.hiddenSkills.length){
					skills.addArray(node.hiddenSkills);
				}
				for(var i in node.disabledSkills){
					if(node.disabledSkills[i].length==1&&
						node.disabledSkills[i][0]==i+'_awake'&&
						!node.hiddenSkills.contains(i)){
						skills.add(i);
					}
				}
				for(i=0;i<skills.length;i++){
					if(lib.skill[skills[i]]&&(lib.skill[skills[i]].nopop||lib.skill[skills[i]].equipSkill)) continue;
					if(lib.translate[skills[i]+'_info']){
						translation=lib.translate[skills[i]+'_ab']||get.translation(skills[i]).slice(0,2);
						if(node.forbiddenSkills[skills[i]]){
							var forbidstr='<div style="opacity:0.5"><div class="skill">【'+translation+'】</div><div>';
							if(node.forbiddenSkills[skills[i]].length){
								forbidstr+='（与'+get.translation(node.forbiddenSkills[skills[i]])+'冲突）<br>';
							}
							else{
								forbidstr+='（双将禁用）<br>';
							}
							forbidstr+=get.skillInfoTranslation(skills[i],node)+'</div></div>'
							uiintro.add(forbidstr);
						}
						else if(!skills2.contains(skills[i])){
							if(lib.skill[skills[i]].preHidden&&get.mode()=='guozhan'){
								uiintro.add('<div><div class="skill" style="opacity:0.5">【'+translation+'】</div><div><span style="opacity:0.5">'+get.skillInfoTranslation(skills[i],node)+'</span><br><div class="underlinenode on gray" style="position:relative;padding-left:0;padding-top:7px">预亮技能</div></div></div>');
								var underlinenode=uiintro.content.lastChild.querySelector('.underlinenode');
								if(_status.prehidden_skills.contains(skills[i])){
									underlinenode.classList.remove('on');
								}
								underlinenode.link=skills[i];
								underlinenode.listen(ui.click.hiddenskill);
							}
							else uiintro.add('<div style="opacity:0.5"><div class="skill">【'+translation+'】</div><div>'+get.skillInfoTranslation(skills[i],node)+'</div></div>');
						}
						else if(lib.skill[skills[i]].temp||!node.skills.contains(skills[i])||lib.skill[skills[i]].thundertext){
							if(lib.skill[skills[i]].frequent||lib.skill[skills[i]].subfrequent){
								uiintro.add('<div><div class="skill thundertext thunderauto">【'+translation+'】</div><div class="thundertext thunderauto">'+get.skillInfoTranslation(skills[i],node)+'<br><div class="underlinenode on gray" style="position:relative;padding-left:0;padding-top:7px">自动发动</div></div></div>');
								var underlinenode=uiintro.content.lastChild.querySelector('.underlinenode');
								if(lib.skill[skills[i]].frequent){
									if(lib.config.autoskilllist.contains(skills[i])){
										underlinenode.classList.remove('on');
									}
								}
								if(lib.skill[skills[i]].subfrequent){
									for(var j=0;j<lib.skill[skills[i]].subfrequent.length;j++){
										if(lib.config.autoskilllist.contains(skills[i]+'_'+lib.skill[skills[i]].subfrequent[j])){
											underlinenode.classList.remove('on');
										}
									}
								}
								if(lib.config.autoskilllist.contains(skills[i])){
									underlinenode.classList.remove('on');
								}
								underlinenode.link=skills[i];
								underlinenode.listen(ui.click.autoskill2);
							}
							else{
								uiintro.add('<div><div class="skill thundertext thunderauto">【'+translation+'】</div><div class="thundertext thunderauto">'+get.skillInfoTranslation(skills[i],node)+'</div></div>');
							}
						}
						else if(lib.skill[skills[i]].frequent||lib.skill[skills[i]].subfrequent){
							uiintro.add('<div><div class="skill">【'+translation+'】</div><div>'+get.skillInfoTranslation(skills[i],node)+'<br><div class="underlinenode on gray" style="position:relative;padding-left:0;padding-top:7px">自动发动</div></div></div>');
							var underlinenode=uiintro.content.lastChild.querySelector('.underlinenode');
							if(lib.skill[skills[i]].frequent){
								if(lib.config.autoskilllist.contains(skills[i])){
									underlinenode.classList.remove('on');
								}
							}
							if(lib.skill[skills[i]].subfrequent){
								for(var j=0;j<lib.skill[skills[i]].subfrequent.length;j++){
									if(lib.config.autoskilllist.contains(skills[i]+'_'+lib.skill[skills[i]].subfrequent[j])){
										underlinenode.classList.remove('on');
									}
								}
							}
							if(lib.config.autoskilllist.contains(skills[i])){
								underlinenode.classList.remove('on');
							}
							underlinenode.link=skills[i];
							underlinenode.listen(ui.click.autoskill2);
						}
						else if(lib.skill[skills[i]].clickable&&node.isIn()&&node.isUnderControl(true)){
							var intronode=uiintro.add('<div><div class="skill">【'+translation+'】</div><div>'+get.skillInfoTranslation(skills[i],node)+'<br><div class="menubutton skillbutton" style="position:relative;margin-top:5px">点击发动</div></div></div>').querySelector('.skillbutton');
							if(!_status.gameStarted||(lib.skill[skills[i]].clickableFilter&&!lib.skill[skills[i]].clickableFilter(node))){
								intronode.classList.add('disabled');
								intronode.style.opacity=0.5;
							}
							else{
								intronode.link=node;
								intronode.func=lib.skill[skills[i]].clickable;
								intronode.classList.add('pointerdiv');
								intronode.listen(ui.click.skillbutton);
							}
						}
						else if(lib.skill[skills[i]].nobracket){
							uiintro.add('<div><div class="skilln">'+get.translation(skills[i])+'</div><div>'+get.skillInfoTranslation(skills[i],node)+'</div></div>');
						}
						else{
							uiintro.add('<div><div class="skill">【'+translation+'】</div><div>'+get.skillInfoTranslation(skills[i],node)+'</div></div>');
						}
						if(lib.translate[skills[i]+'_append']){
							uiintro._place_text=uiintro.add('<div class="text">'+lib.translate[skills[i]+'_append']+'</div>')
						}
					}
				}
				// if(get.is.phoneLayout()){
				//     var storage=node.storage;
				//     for(i in storage){
				//      			if(get.info(i)&&get.info(i).intro){
				//      						 intro=get.info(i).intro;
				//      						 if(node.getSkills().concat(lib.skill.global).contains(i)==false&&!intro.show) continue;
				//      						 var name=intro.name?intro.name:get.translation(i);
				//      						 if(typeof name=='function'){
				//      									  name=name(storage[i],node);
				//      						 }
				//      						 translation='<div><div class="skill">『'+name.slice(0,2)+'』</div><div>';
				//      						 var stint=get.storageintro(intro.content,storage[i],node,null,i);
				//      						 if(stint){
				//      									  translation+=stint+'</div></div>';
				//      									  uiintro.add(translation);
				//      						 }
				//      			}
				//     }
				// }

				if(lib.config.right_range&&_status.gameStarted){
					uiintro.add(ui.create.div('.placeholder'));
					var table,tr,td;
					table=document.createElement('table');
					tr=document.createElement('tr');
					table.appendChild(tr);
					td=document.createElement('td');
					td.innerHTML='距离';
					tr.appendChild(td);
					td=document.createElement('td');
					td.innerHTML='手牌';
					tr.appendChild(td);
					td=document.createElement('td');
					td.innerHTML='行动';
					tr.appendChild(td);
					td=document.createElement('td');
					td.innerHTML='伤害';
					tr.appendChild(td);

					tr=document.createElement('tr');
					table.appendChild(tr);
					td=document.createElement('td');
					if(node==game.me||!game.me||!game.me.isIn()){
						td.innerHTML='-';
					}
					else{
						var dist1=get.numStr(Math.max(1,game.me.distanceTo(node)));
						var dist2=get.numStr(Math.max(1,node.distanceTo(game.me)));
						if(dist1==dist2){
							td.innerHTML=dist1;
						}
						else{
							td.innerHTML=dist1+'/'+dist2;
						}
					}
					tr.appendChild(td);
					td=document.createElement('td');
					td.innerHTML=node.countCards('h');
					tr.appendChild(td);
					td=document.createElement('td');
					td.innerHTML=node.phaseNumber;
					tr.appendChild(td);
					td=document.createElement('td');

					(function(){
						num=0;
						for(var j=0;j<node.stat.length;j++){
							if(typeof node.stat[j].damage=='number') num+=node.stat[j].damage;
						}
						td.innerHTML=num;
					}());
					tr.appendChild(td);
					table.style.width='calc(100% - 20px)';
					table.style.marginLeft='10px';

					uiintro.content.appendChild(table);
					if(!lib.config.show_favourite){
						table.style.paddingBottom='5px'
					}
				}
				if(!simple||get.is.phoneLayout()){
					var es=node.getCards('e');
					for(var i=0;i<es.length;i++){
						var cardinfo=lib.card[es[i].name];
						if(cardinfo&&cardinfo.cardPrompt) uiintro.add('<div><div class="skill">'+es[i].outerHTML+'</div><div>'+cardinfo.cardPrompt(es[i])+'</div></div>');
						else uiintro.add('<div><div class="skill">'+es[i].outerHTML+'</div><div>'+lib.translate[es[i].name+'_info']+'</div></div>');
						uiintro.content.lastChild.querySelector('.skill>.card').style.transform='';
					}
					var js=node.getCards('j');
					for(var i=0;i<js.length;i++){
						if(js[i].viewAs&&js[i].viewAs!=js[i].name){
							uiintro.add('<div><div class="skill">'+js[i].outerHTML+'</div><div>'+lib.translate[js[i].viewAs]+'：'+lib.translate[js[i].viewAs+'_info']+'</div></div>');
						}
						else{
							uiintro.add('<div><div class="skill">'+js[i].outerHTML+'</div><div>'+lib.translate[js[i].name+'_info']+'</div></div>');
						}
						uiintro.content.lastChild.querySelector('.skill>.card').style.transform='';
					}
					if(get.is.phoneLayout()){
						var markCoutainer=ui.create.div('.mark-container.marks');
						for(var i in node.marks){
							var nodemark=node.marks[i].cloneNode(true);
							nodemark.classList.add('pointerdiv');
							nodemark.link=node.marks[i];
							nodemark.style.transform='';
							markCoutainer.appendChild(nodemark);
							nodemark.listen(function(){
								uiintro.noresume=true;
								var rect=this.link.getBoundingClientRect();
								ui.click.intro.call(this.link,{
									clientX:rect.left+rect.width,
									clientY:rect.top+rect.height/2,
								});
								if(lib.config.touchscreen){
									uiintro._close();
								}
							});
						}
						if(markCoutainer.childElementCount){
							uiintro.addText('标记');
							uiintro.add(markCoutainer);
						}
					}
				}
				if(!game.observe&&_status.gameStarted&&game.me&&node!=game.me){
					ui.throwEmotion=[];
					uiintro.addText('发送交互表情');
					var click=function(){
						if(_status.dragged) return;
						if(_status.justdragged) return;
						var emotion=this.link;
						if(game.online){
							game.send('throwEmotion',node,emotion);
						}
						else game.me.throwEmotion(node,emotion);
					};
					var click2=function(){
						if(_status.dragged) return;
						if(_status.justdragged) return;
						var emotion=this.link.slice(0,-4);
						if(game.online){
							game.send('throwEmotion',node,emotion);
						}
						else game.me.throwEmotion(node,emotion);
						for(var i=0;i<15;i++){
							setTimeout(function(){
								if(game.online){
									game.send('throwEmotion',node,emotion);
								}
								else game.me.throwEmotion(node,emotion);
							},125*(i+1));
						}
					};
					var td;
					var table=document.createElement('div');
					table.classList.add('add-setting');
					table.style.margin='0';
					table.style.width='100%';
					table.style.position='relative';
					var listi=['flower','egg'];
					for(var i=0;i<listi.length;i++){
						td=ui.create.div('.menubutton.reduce_radius.pointerdiv.tdnode');
						ui.throwEmotion.add(td);
						td.link=listi[i];
						table.appendChild(td);
						td.innerHTML='<span>'+get.translation(listi[i])+'</span>';
						td.addEventListener(lib.config.touchscreen?'touchend':'click',click);
					}
					uiintro.content.appendChild(table);
					table=document.createElement('div');
					table.classList.add('add-setting');
					table.style.margin='0';
					table.style.width='100%';
					table.style.position='relative';
					var listi=['wine','shoe'];
					if(game.me.storage.zhuSkill_shanli) listi=['yuxisx','jiasuo'];
					for(var i=0;i<listi.length;i++){
						td=ui.create.div('.menubutton.reduce_radius.pointerdiv.tdnode');
						ui.throwEmotion.add(td);
						td.link=listi[i];
						table.appendChild(td);
						td.innerHTML='<span>'+get.translation(listi[i])+'</span>';
						td.addEventListener(lib.config.touchscreen?'touchend':'click',click);
					}
					uiintro.content.appendChild(table);
					table=document.createElement('div');
					table.classList.add('add-setting');
					table.style.margin='0';
					table.style.width='100%';
					table.style.position='relative';
					var listi=['flowerSpam','eggSpam'];
					for(var i=0;i<listi.length;i++){
						td=ui.create.div('.menubutton.reduce_radius.pointerdiv.tdnode');
						ui.throwEmotion.add(td);
						td.link=listi[i];
						table.appendChild(td);
						td.innerHTML='<span>'+get.translation(listi[i])+'</span>';
						td.addEventListener(lib.config.touchscreen?'touchend':'click',click2);
					}
					uiintro.content.appendChild(table);
				}
				var modepack=lib.characterPack['mode_'+get.mode()];
				if(lib.config.show_favourite&&lib.character[node.name]&&game.players.contains(node)&&
					(!modepack||!modepack[node.name])&&(!simple||get.is.phoneLayout())){
					var addFavourite=ui.create.div('.text.center.pointerdiv');
					addFavourite.link=node.name;
					if(lib.config.favouriteCharacter.contains(node.name)){
						addFavourite.innerHTML='移除收藏';
					}
					else{
						addFavourite.innerHTML='添加收藏';
					}
					addFavourite.listen(ui.click.favouriteCharacter)
					uiintro.add(addFavourite);
				}
				if(!simple||get.is.phoneLayout()){
					if((lib.config.change_skin||lib.skin)&&!node.isUnseen()){
						var num=1;
						var introadded=false;
						var createButtons=function(num,avatar2){
							if(!introadded){
								introadded=true;
								uiintro.add('<div class="text center">更改皮肤</div>');
							}
							var buttons=ui.create.div('.buttons.smallzoom.scrollbuttons');
							lib.setMousewheel(buttons);
							var nameskin=(avatar2?node.name2:node.name1);
							var nameskin2=nameskin;
							var gzbool=false;
							if(nameskin.indexOf('gz_shibing')==0){
								nameskin=nameskin.slice(3,11);
							}
							else if(nameskin.indexOf('gz_')==0){
								nameskin=nameskin.slice(3);
								gzbool=true;
							}
							for(var i=0;i<=num;i++){
								var button=ui.create.div('.button.character.pointerdiv',buttons,function(){
									if(this._link){
										if(avatar2){
											lib.config.skin[nameskin]=this._link;
											node.node.avatar2.style.backgroundImage=this.style.backgroundImage;
										}
										else{
											lib.config.skin[nameskin]=this._link;
											node.node.avatar.style.backgroundImage=this.style.backgroundImage;
										}
									}
									else{
										delete lib.config.skin[nameskin];
										if(avatar2){
											if(gzbool&&lib.character[nameskin2][4].contains('gzskin')&&lib.config.mode_config.guozhan.guozhanSkin) node.node.avatar2.setBackground(nameskin2,'character');
											else node.node.avatar2.setBackground(nameskin,'character');
										}
										else{
											if(gzbool&&lib.character[nameskin2][4].contains('gzskin')&&lib.config.mode_config.guozhan.guozhanSkin) node.node.avatar.setBackground(nameskin2,'character');
											else node.node.avatar.setBackground(nameskin,'character');
										}
									}
									game.saveConfig('skin',lib.config.skin);
								});
								button._link=i;
								if(i){
									button.setBackgroundImage('image/skin/'+nameskin+'/'+i+'.jpg');
								}
								else{
									if(gzbool&&lib.character[nameskin2][4].contains('gzskin')&&lib.config.mode_config.guozhan.guozhanSkin) button.setBackground(nameskin2,'character','noskin');
									else button.setBackground(nameskin,'character','noskin');
								}
							}
							uiintro.add(buttons);
						};
						var loadImage=function(avatar2){
							var img=new Image();
							img.onload=function(){
								num++;
								loadImage(avatar2);
							}
							img.onerror=function(){
								num--;
								if(num){
									createButtons(num,avatar2);
								}
								if(!avatar2){
									if(!node.classList.contains('unseen2')&&node.name2){
										num=1;
										loadImage(true);
									}
								}
							}
							var nameskin=(avatar2?node.name2:node.name1);
							var nameskin2=nameskin;
							var gzbool=false;
							if(nameskin.indexOf('gz_shibing')==0){
								nameskin=nameskin.slice(3,11);
							}
							else if(nameskin.indexOf('gz_')==0){
								nameskin=nameskin.slice(3);
								gzbool=true;
							}
							img.src=lib.assetURL+'image/skin/'+nameskin+'/'+num+'.jpg';
						}
						if(lib.config.change_skin){
							if(!node.isUnseen(0)){
								loadImage();
							}
							else if(node.name2){
								loadImage(true);
							}
						}
						else{
							setTimeout(function(){
								var nameskin1=node.name1;
								var nameskin2=node.name2;
								if(nameskin1&&nameskin1.indexOf('gz_')==0){
									nameskin1=nameskin1.slice(3);
								}
								if(nameskin2&&nameskin2.indexOf('gz_')==0){
									nameskin2=nameskin2.slice(3);
								}
								if(!node.isUnseen(0)&&lib.skin[nameskin1]){
									createButtons(lib.skin[nameskin1]);
								}
								if(!node.isUnseen(1)&&lib.skin[nameskin2]){
									createButtons(lib.skin[nameskin2],true);
								}
							});
						}
					}
				}

				uiintro.add(ui.create.div('.placeholder.slim'));
			}
			else if(node.classList.contains('mark')&&node.info&&
				node.parentNode&&node.parentNode.parentNode&&node.parentNode.parentNode.classList.contains('player')){
				var info=node.info;
				var player=node.parentNode.parentNode;
				if(info.name){
					if(typeof info.name=='function'){
						var named=info.name(player.storage[node.skill],player);
						if(named){
							uiintro.add(named);
						}
					}
					else{
						uiintro.add(info.name);
					}
				}
				else if(info.name!==false){
					uiintro.add(get.translation(node.skill));
				}
				if(typeof info.id=='string'&&info.id.indexOf('subplayer')==0&&
					player.isUnderControl(true)&&player.storage[info.id]&&!_status.video){
					var storage=player.storage[info.id];
					uiintro.addText('当前体力：'+storage.hp+'/'+storage.maxHp);
					if(storage.hs.length){
						uiintro.addText('手牌区');
						uiintro.addSmall(storage.hs);
					}
					if(storage.es.length){
						uiintro.addText('装备区');
						uiintro.addSmall(storage.es);
					}
				}
				if(typeof info.mark=='function'){
					var stint=info.mark(uiintro,player.storage[node.skill],player);
					if(stint){
						var placetext=uiintro.add('<div class="text" style="display:inline">'+stint+'</div>');
						if(stint.indexOf('<div class="skill"')!=0){
							uiintro._place_text=placetext;
						}
						// if(stint.length<=100){
						// 	uiintro.add('<div class="text center">'+stint+'</div>');
						// }
						// else{
						// 	uiintro.add('<div class="text">'+stint+'</div>');
						// }
					}
				}
				else{
					var stint=get.storageintro(info.content,player.storage[node.skill],player,uiintro,node.skill);
					if(stint){
						if(stint[0]=='@'){
							uiintro.add('<div class="caption">'+stint.slice(1)+'</div>');
						}
						else{
							var placetext=uiintro.add('<div class="text" style="display:inline">'+stint+'</div>');
							if(stint.indexOf('<div class="skill"')!=0){
								uiintro._place_text=placetext;
							}
						}
						// else if(stint.length<=100){
						// 	uiintro.add('<div class="text center">'+stint+'</div>');
						// }
						// else{
						// 	uiintro.add('<div class="text">'+stint+'</div>');
						// }
					}
				}
				uiintro.add(ui.create.div('.placeholder.slim'));
			}
			else if(node.classList.contains('card')){
				//卡牌长按介绍
				if(ui.arena.classList.contains('observe')&&node.parentNode.classList.contains('handcards')){
					return;
				}
				var name=node.name;
				if(node.parentNode.cardMod){
					var moded=false;
					for(var i in node.parentNode.cardMod){
						var item=node.parentNode.cardMod[i](node);
						if(Array.isArray(item)){
							moded=true;
							uiintro.add(item[0]);
							uiintro._place_text=uiintro.add('<div class="text" style="display:inline">'+item[1]+'</div>');
						}
					}
					if(moded) return uiintro;
				}
				if(node.link&&node.link.name&&lib.card[node.link.name]){
					name=node.link.name;
				}
				if(get.position(node)=='j'&&node.viewAs&&node.viewAs!=name){
					uiintro.add(get.translation(node.viewAs));
					uiintro.add('<div class="text center">（'+get.translation(get.translation(node))+'）</div>');
					// uiintro.add(get.translation(node.viewAs)+'<br><div class="text center" style="padding-top:5px;">（'+get.translation(node)+'）</div>');
					uiintro.nosub=true;
					name=node.viewAs;
				}
				else{
					uiintro.add(get.translation(node));
				}
				if(node._banning){
					var clickBanned=function(){
						var banned=lib.config[this.bannedname]||[];
						if(banned.contains(name)){
							banned.remove(name);
						}
						else{
							banned.push(name);
						}
						game.saveConfig(this.bannedname,banned);
						this.classList.toggle('on');
						if(node.updateBanned){
							node.updateBanned();
						}
					};
					var modeorder=lib.config.modeorder||[];
					for(var i in lib.mode){
						modeorder.add(i);
					}
					var list=[];
					uiintro.contentContainer.listen(function(e){
						ui.click.touchpop();
						e.stopPropagation();
					});
					for(var i=0;i<modeorder.length;i++){
						if(node._banning=='online'){
							if(!lib.mode[modeorder[i]].connect) continue;
						}
						else if(modeorder[i]=='connect'||modeorder[i]=='brawl'){
							continue;
						}
						if(lib.config.all.mode.contains(modeorder[i])){
							list.push(modeorder[i]);
						}
					}
					if(lib.card[name]&&lib.card[name].type=='trick') list.push('zhinang_tricks');
					var page=ui.create.div('.menu-buttons.configpopped',uiintro.content);
					var banall=false;
					for(var i=0;i<list.length;i++){
						var cfg=ui.create.div('.config',list[i]=='zhinang_tricks'?'设为智囊':(lib.translate[list[i]]+'模式'),page);
						cfg.classList.add('toggle');
						if(list[i]=='zhinang_tricks'){
							cfg.bannedname=((node._banning=='offline')?'':'connect_')+'zhinang_tricks';
						}
						else if(node._banning=='offline'){
							cfg.bannedname=list[i]+'_bannedcards';
						}
						else{
							cfg.bannedname='connect_'+list[i]+'_bannedcards';
						}
						cfg.listen(clickBanned);
						ui.create.div(ui.create.div(cfg));
						var banned=lib.config[cfg.bannedname]||[];
						if(banned.contains(name)==(list[i]=='zhinang_tricks')){
							cfg.classList.add('on');
							banall=true;
						}
					}
					ui.create.div('.menubutton.pointerdiv',banall?'全部禁用':'全部启用',uiintro.content,function(){
						if(this.innerHTML=='全部禁用'){
							for(var i=0;i<page.childElementCount;i++){
								if(page.childNodes[i].bannedname.indexOf('zhinang_tricks')==-1&&page.childNodes[i].bannedname&&page.childNodes[i].classList.contains('on')){
									clickBanned.call(page.childNodes[i]);
								}
							}
							this.innerHTML='全部启用';
						}
						else{
							for(var i=0;i<page.childElementCount;i++){
								if(page.childNodes[i].bannedname.indexOf('zhinang_tricks')==-1&&page.childNodes[i].bannedname&&!page.childNodes[i].classList.contains('on')){
									clickBanned.call(page.childNodes[i]);
								}
							}
							this.innerHTML='全部禁用';
						}
					}).style.marginTop='-10px';
					ui.create.div('.placeholder.slim',uiintro.content);
				}
				else{
					if(lib.translate[name+'_info']){
						if(!uiintro.nosub){
							if(get.subtype(name)=='equip1'){
								var added=false;
								if(lib.card[node.name]&&lib.card[node.name].distance){
									var dist=lib.card[node.name].distance;
									if(dist.attackFrom){
										added=true;
										uiintro.add('<div class="text center">攻击范围：'+(-dist.attackFrom+1)+'</div>');
									}
								}
								if(!added){
									uiintro.add('<div class="text center">攻击范围：1</div>');
								}
							}
							else if(get.subtype(name)){
								uiintro.add('<div class="text center">'+get.translation(get.subtype(name))+'</div>');
							}
							else if(lib.card[name]&&lib.card[name].addinfomenu){
								uiintro.add('<div class="text center">'+lib.card[name].addinfomenu+'</div>');
							}
							else if(lib.card[name]&&lib.card[name].derivation){
								if(typeof lib.card[name].derivation=='string'){
									uiintro.add('<div class="text center">来源：'+get.translation(lib.card[name].derivation)+'</div>');
								}
								else if(lib.card[name].derivationpack){
									uiintro.add('<div class="text center">来源：'+get.translation(lib.card[name].derivationpack+'_card_config')+'包</div>');
								}
							}
							else{
								if(lib.card[name].unique){
									uiintro.add('<div class="text center">特殊'+get.translation(lib.card[name].type)+'牌</div>');
								}
								else{
									if(lib.card[name].type&&lib.translate[lib.card[name].type]) uiintro.add('<div class="text center">'+get.translation(lib.card[name].type)+'牌</div>');
								}
							}
							if(lib.card[name].unique&&lib.card[name].type=='equip'){
								if(lib.cardPile.guozhan&&lib.cardPack.guozhan.contains(name)){
									uiintro.add('<div class="text center">专属装备</div>').style.marginTop='-5px';
								}
								else{
									uiintro.add('<div class="text center">特殊装备</div>').style.marginTop='-5px';
								}
							}
						}
						if(lib.card[name].cardPrompt){
							var str=lib.card[name].cardPrompt(node.link||node),placetext=uiintro.add('<div class="text" style="display:inline">'+str+'</div>');
							if(str.indexOf('<div class="skill"')!=0){
								uiintro._place_text=placetext;
							}
						}
						else if(lib.translate[name+'_info']){
							var placetext=uiintro.add('<div class="text" style="display:inline">'+lib.translate[name+'_info']+'</div>');
							if(lib.translate[name+'_info'].indexOf('<div class="skill"')!=0){
								uiintro._place_text=placetext;
							}
						}
						if(get.is.yingbianConditional(node.link||node)){
							const yingbianEffects=get.yingbianEffects(node.link||node);
							if(!yingbianEffects.length){
								const defaultYingbianEffect=get.defaultYingbianEffect(node.link||node);
								if(lib.yingbian.prompt.has(defaultYingbianEffect)) yingbianEffects.push(defaultYingbianEffect);
							}
							if(yingbianEffects.length) uiintro.add(`<div class="text" style="font-family: yuanli">应变：${yingbianEffects.map(value=>lib.yingbian.prompt.get(value)).join('；')}</div>`);
						}
						if(lib.translate[name+'_append']){
							uiintro.add('<div class="text" style="display:inline">'+lib.translate[name+'_append']+'</div>');
						}
					}
					uiintro.add(ui.create.div('.placeholder.slim'));
				}
			}
			else if(node.classList.contains('character')){
				var character=node.link,characterinfo=get.character(node.link);
				if(characterinfo&&characterinfo[1]){
					var group=get.is.double(node.link,true);
					if(group){
						var str=get.translation(character)+'&nbsp;&nbsp;';
						for(var i=0;i<group.length;i++){
							str+=get.translation(group[i]);
							if(i<group.length-1) str+='/';
						}
						uiintro.add(str);
					}
					else uiintro.add(get.translation(character)+'&nbsp;&nbsp;'+lib.translate[characterinfo[1]]);
				}
				else{
					uiintro.add(get.translation(character));
				}

				if(lib.characterTitle[node.link]){
					uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
				}

				if(node._banning){
					var clickBanned=function(){
						var banned=lib.config[this.bannedname]||[];
						if(banned.contains(character)){
							banned.remove(character);
						}
						else{
							banned.push(character);
						}
						game.saveConfig(this.bannedname,banned);
						this.classList.toggle('on');
						if(node.updateBanned){
							node.updateBanned();
						}
					};
					var modeorder=lib.config.modeorder||[];
					for(var i in lib.mode){
						modeorder.add(i);
					}
					var list=[];
					uiintro.contentContainer.listen(function(e){
						ui.click.touchpop();
						e.stopPropagation();
					});
					for(var i=0;i<modeorder.length;i++){
						if(node._banning=='online'){
							if(!lib.mode[modeorder[i]].connect) continue;
							if(!lib.config['connect_'+modeorder[i]+'_banned']){
								lib.config['connect_'+modeorder[i]+'_banned']=[];
							}
						}
						else if(modeorder[i]=='connect'||modeorder[i]=='brawl'){
							continue;
						}
						if(lib.config.all.mode.contains(modeorder[i])){
							list.push(modeorder[i]);
						}
					}
					var page=ui.create.div('.menu-buttons.configpopped',uiintro.content);
					var banall=false;
					for(var i=0;i<list.length;i++){
						var cfg=ui.create.div('.config',lib.translate[list[i]]+'模式',page);
						cfg.classList.add('toggle');
						if(node._banning=='offline'){
							cfg.bannedname=list[i]+'_banned';
						}
						else{
							cfg.bannedname='connect_'+list[i]+'_banned';
						}
						cfg.listen(clickBanned);
						ui.create.div(ui.create.div(cfg));
						var banned=lib.config[cfg.bannedname]||[];
						if(!banned.contains(character)){
							cfg.classList.add('on');
							banall=true;
						}
					}
					if(node._banning=='offline'){
						var cfg=ui.create.div('.config','随机选将可用',page);
						cfg.classList.add('toggle');
						cfg.listen(function(){
							this.classList.toggle('on');
							if(this.classList.contains('on')){
								lib.config.forbidai_user.remove(character);
							}
							else{
								lib.config.forbidai_user.add(character);
							}
							game.saveConfig('forbidai_user',lib.config.forbidai_user);
						});
						ui.create.div(ui.create.div(cfg));
						if(!lib.config.forbidai_user.contains(character)){
							cfg.classList.add('on');
						}
					}
					ui.create.div('.menubutton.pointerdiv',banall?'全部禁用':'全部启用',uiintro.content,function(){
						if(this.innerHTML=='全部禁用'){
							for(var i=0;i<page.childElementCount;i++){
								if(page.childNodes[i].bannedname&&page.childNodes[i].classList.contains('on')){
									clickBanned.call(page.childNodes[i]);
								}
							}
							this.innerHTML='全部启用';
						}
						else{
							for(var i=0;i<page.childElementCount;i++){
								if(page.childNodes[i].bannedname&&!page.childNodes[i].classList.contains('on')){
									clickBanned.call(page.childNodes[i]);
								}
							}
							this.innerHTML='全部禁用';
						}
					}).style.marginTop='-10px';
					ui.create.div('.placeholder.slim',uiintro.content);
				}
				else{
					var infoitem=get.character(character);
					var skills=infoitem[3];
					for(i=0;i<skills.length;i++){
						if(lib.translate[skills[i]+'_info']){
							translation=lib.translate[skills[i]+'_ab']||get.translation(skills[i]).slice(0,2);
							if(lib.skill[skills[i]]&&lib.skill[skills[i]].nobracket){
								uiintro.add('<div><div class="skilln">'+get.translation(skills[i])+'</div><div>'+get.skillInfoTranslation(skills[i])+'</div></div>');
							}
							else{
								uiintro.add('<div><div class="skill">【'+translation+'】</div><div>'+get.skillInfoTranslation(skills[i])+'</div></div>');
							}
							if(lib.translate[skills[i]+'_append']){
								uiintro._place_text=uiintro.add('<div class="text">'+lib.translate[skills[i]+'_append']+'</div>')
							}
						}
					}
					var modepack=lib.characterPack['mode_'+get.mode()];
					if(lib.config.show_favourite&&
					lib.character[node.link]&&(!modepack||!modepack[node.link])&&(!simple||get.is.phoneLayout())){
						var addFavourite=ui.create.div('.text.center.pointerdiv');
						addFavourite.link=node.link;
						addFavourite.style.marginBottom='15px';
						if(lib.config.favouriteCharacter.contains(node.link)){
							addFavourite.innerHTML='移除收藏';
						}
						else{
							addFavourite.innerHTML='添加收藏';
						}
						addFavourite.listen(ui.click.favouriteCharacter)
						uiintro.add(addFavourite);
					}
					else{
						uiintro.add(ui.create.div('.placeholder.slim'));
					}
					var addskin=false;
					if(node.parentNode.classList.contains('menu-buttons')){
						addskin=!lib.config.show_charactercard;
					}
					else{
						addskin=lib.config.change_skin||lib.skin;
					}
					if(addskin&&(!simple||get.is.phoneLayout())){
						var num=1;
						var introadded=false;
						var nameskin=node.link;
						var nameskin2=nameskin;
						var gzbool=false;
						if(nameskin.indexOf('gz_shibing')==0){
							nameskin=nameskin.slice(3,11);
						}
						else if(nameskin.indexOf('gz_')==0){
							nameskin=nameskin.slice(3);
							gzbool=true;
						}
						var createButtons=function(num){
							if(!num) return;
							if(!introadded){
								introadded=true;
								uiintro.add('<div class="text center">更改皮肤</div>');
							}
							var buttons=ui.create.div('.buttons.smallzoom.scrollbuttons');
							lib.setMousewheel(buttons);
							for(var i=0;i<=num;i++){
								var button=ui.create.div('.button.character.pointerdiv',buttons,function(){
									if(this._link){
										lib.config.skin[nameskin]=this._link;
										node.style.backgroundImage=this.style.backgroundImage;
										game.saveConfig('skin',lib.config.skin);
									}
									else{
										delete lib.config.skin[nameskin];
										if(gzbool&&lib.character[nameskin2][4].contains('gzskin')&&lib.config.mode_config.guozhan.guozhanSkin) node.setBackground(nameskin2,'character');
										else node.setBackground(nameskin,'character');
										game.saveConfig('skin',lib.config.skin);
									}
								});
								button._link=i;
								if(i){
									button.setBackgroundImage('image/skin/'+nameskin+'/'+i+'.jpg');
								}
								else{
									if(gzbool&&lib.character[nameskin2][4].contains('gzskin')&&lib.config.mode_config.guozhan.guozhanSkin) button.setBackground(nameskin2,'character','noskin');
									else button.setBackground(nameskin,'character','noskin');
								}
							}
							uiintro.add(buttons);
						};
						var loadImage=function(){
							var img=new Image();
							img.onload=function(){
								num++;
								loadImage();
							}
							img.onerror=function(){
								num--;
								createButtons(num);
							}
							img.src=lib.assetURL+'image/skin/'+nameskin+'/'+num+'.jpg';
						}
						if(lib.config.change_skin){
							loadImage();
						}
						else{
							setTimeout(function(){
								createButtons(lib.skin[nameskin]);
							});
						}
					}
				}
			}
			else if(node.classList.contains('equips')&&ui.arena.classList.contains('selecting')){
				(function(){
					uiintro.add('选择装备');
					uiintro.addSmall(Array.from(node.childNodes),true);
					uiintro.clickintro=true;
					ui.control.hide();
					uiintro._onclose=function(){
						ui.control.show();
					}
					var confirmbutton;
					for(var i=0;i<uiintro.buttons.length;i++){
						var button=uiintro.buttons[i];
						button.classList.add('pointerdiv');
						if(button.link.classList.contains('selected')){
							button.classList.add('selected');
						}
						button.listen(function(e){
							ui.click.card.call(this.link,'popequip');
							ui.click.window.call(ui.window,e);
							if(this.link.classList.contains('selected')){
								this.classList.add('selected');
							}
							else{
								this.classList.remove('selected');
							}
							if(ui.confirm&&ui.confirm.str&&ui.confirm.str.indexOf('o')!=-1){
								confirmbutton.classList.remove('disabled');
							}
							else{
								confirmbutton.classList.add('disabled');
							}
						});
					}
					var buttoncontainer=uiintro.add(ui.create.div());
					buttoncontainer.style.display='block';
					confirmbutton=ui.create.div('.menubutton.large.pointerdiv','确定',function(){
						if(ui.confirm&&ui.confirm.str&&ui.confirm.str.indexOf('o')!=-1){
							uiintro._clickintro();
							ui.click.ok(ui.confirm.firstChild);
						}
					},buttoncontainer);
					confirmbutton.style.position='relative';
					setTimeout(function(){
						if(ui.confirm&&ui.confirm.str&&ui.confirm.str.indexOf('o')!=-1){
							confirmbutton.classList.remove('disabled');
						}
						else{
							confirmbutton.classList.add('disabled');
						}
					},300);
				}());
			}
			else if(node.classList.contains('identity')&&node.dataset.career){
				var career=node.dataset.career;
				uiintro.add(get.translation(career));
				uiintro.add('<div class="text center" style="padding-bottom:5px">'+lib.translate['_'+career+'_skill_info']+'</div>');
			}
			else if(node.classList.contains('skillbar')){
				if(node==ui.friendBar){
					uiintro.add('友方怒气值');
					uiintro.add('<div class="text center" style="padding-bottom:5px">'+_status.friendRage+'/100</div>');
				}
				else if(node==ui.enemyBar){
					uiintro.add('敌方怒气值');
					uiintro.add('<div class="text center" style="padding-bottom:5px">'+_status.enemyRage+'/100</div>');
				}
			}
			else if(node.parentNode==ui.historybar){
				if(node.dead){
					if(!node.source||node.source==node.player){
						uiintro.add('<div class="text center">'+get.translation(node.player)+'阵亡</div>');
						uiintro.addSmall([node.player]);
					}
					else{
						uiintro.add('<div class="text center">'+get.translation(node.player)+'被'+get.translation(node.source)+'杀害</div>');
						uiintro.addSmall([node.source]);
					}
				}
				if(node.skill){
					uiintro.add('<div class="text center">'+get.translation(node.skill,'skill')+'</div>');
					uiintro._place_text=uiintro.add('<div class="text" style="display:inline">'+get.translation(node.skill,'info')+'</div>');
				}
				if(node.targets&&get.itemtype(node.targets)=='players'){
					uiintro.add('<div class="text center">目标</div>');
					uiintro.addSmall(node.targets);
				}
				if(node.players&&node.players.length>1){
					uiintro.add('<div class="text center">使用者</div>');
					uiintro.addSmall(node.players);
				}
				if(node.cards&&node.cards.length){
					uiintro.add('<div class="text center">卡牌</div>');
					uiintro.addSmall(node.cards);
				}
				for(var i=0;i<node.added.length;i++){
					uiintro.add(node.added[i]);
				}
				if(node.added.length){
					uiintro.add(ui.create.div('.placeholder.slim'));
				}
				if(uiintro.content.firstChild){
					uiintro.content.firstChild.style.paddingTop='3px';
				}
			}
			if(lib.config.touchscreen){
				lib.setScroll(uiintro.contentContainer);
			}
			return uiintro;
		};
if(typeof get.threaten !== 'function') get.threaten=function(target,player,hp){
			var threaten=1;
			var skills=target.getSkills();
			if(!player&&player!==false){
				player=_status.event.player;
			}
			for(var i=0;i<skills.length;i++){
				var info=get.info(skills[i]);
				if(info&&info.ai&&info.ai.threaten){
					if(typeof info.ai.threaten=='function'&&player){
						var tmp=info.ai.threaten(player,target);
						if(typeof tmp=='number'){
							threaten*=tmp;
						}
					}
					else if(typeof info.ai.threaten=='number'){
						threaten*=info.ai.threaten;
					}
				}
			}
			if(hp){
				switch(target.hp){
					case 0:threaten*=1.5;break;
					case 1:threaten*=1.2;break;
				}
				switch(target.countCards('h')){
					case 0:threaten*=1.5;break;
					case 1:threaten*=1.2;break;
				}
			}
			return threaten;
		};
if(typeof get.attitude !== 'function') get.attitude=function(from,to){
			if(!from||!to) return 0;
			from=from._trueMe||from;
			arguments[0]=from;
			var att=get.rawAttitude.apply(this,arguments);
			if(from.isMad()) att=-att;
			if(to.isMad()&&att>0){
				if(to.identity=='zhu'){
					att=1;
				}
				else{
					att=0;
				}
			}
			if(!_status.tempnofake){
				_status.tempnofake=true;
				if(from.ai.modAttitudeFrom){
					att=from.ai.modAttitudeFrom(from,to,att);
				}
				if(to.ai.modAttitudeTo){
					att=to.ai.modAttitudeTo(from,to,att);
				}
				delete _status.tempnofake;
			}
			return att;
		};
if(typeof get.useful !== 'function') get.useful=function(card,player){
			if(get.position(card)=='j') return -1;
			if(get.position(card)=='e') return get.equipValue(card);
			if(card._modUseful){
				return card._modUseful();
			}
			var i=0;
			if(!player) player=_status.event.player;
			if(player){
				i=player.getCards('h',card.name).indexOf(card);
				if(i<0) i=0;
			}
			var aii=get.info(card).ai;
			var useful;
			if(aii&&aii.useful) useful=aii.useful;
			else if(aii&&aii.basic) useful=aii.basic.useful;
			var result;
			if(useful==undefined) result=-1;
			else if(typeof useful=='function'){
				result=useful(card,i);
			}
			else if(typeof useful=='number') result=useful;
			else if(i<useful.length){
				result=useful[i];
			}
			else result=useful[useful.length-1];
			result=game.checkMod(player,card,result,'aiUseful',player);
			return result;
		};
if(typeof get.value !== 'function') get.value=function(card,player,method){
			var result=0;
			var value;
			if(Array.isArray(card)){
				if(!card.length) return 0;
				value=0;
				for(var i=0;i<card.length;i++){
					value+=get.value(card[i],player,method);
				}
				return value/Math.sqrt(card.length);
			}
			if(card._modValue){
				return card._modValue(player,method);
			}
			var aii=get.info(card).ai;
			if(aii&&aii.value) value=aii.value;
			else if(aii&&aii.basic) value=aii.basic.value;
			if(player==undefined||get.itemtype(player)!='player') player=_status.event.player;
			var geti=function(){
				var num=0,i;
				var cards=player.getCards('hs',card.name);
				if(cards.contains(card)){
					return cards.indexOf(card);
				}
				return cards.length;
			};
			if(typeof value=='function'){
				result=value(card,player,geti(),method);
			}
			if(typeof value=='number') result=value;
			if(Array.isArray(value)){
				if(method=='raw') result=value[0];
				var num=geti();
				if(num<value.length) result=value[num];
				else result=value[value.length-1];
			}
			result=game.checkMod(player,card,result,'aiValue',player);
			return result;
		};
if(typeof get.equipResult !== 'function') get.equipResult=function(player,target,name){
			var card=get.card();
			if(!card||card.name!=name){
				card={name:name};
			}
			var value1=get.equipValue(card,target);
			var value2=0;
			if(!player.canEquip(card)){
				if(!player.canEquip(card,true)) return 0;
				var current=target.getEquip(card);
				if(current&&current!=card){
					value2=get.equipValue(current,target);
					if(value2>0&&!target.needsToDiscard()&&!get.tag(card,'valueswap')){
						return 0;
					}
				}
			}
			return Math.max(0,value1-value2)/5;
		};
if(typeof get.equipValue !== 'function') get.equipValue=function(card,player){
			if(player==undefined||get.itemtype(player)!='player') player=get.owner(card);
			if(player==undefined||get.itemtype(player)!='player') player=_status.event.player;
			var info=get.info(card);
			if(!info.ai) return 0;
			var value=info.ai.equipValue;
			if(value==undefined){
				if(info.ai.basic&&info.ai.basic.equipValue!=undefined){
					value=info.ai.basic.equipValue;
				}
				else return 0;
			}
			if(typeof value=='number') return value;
			if(typeof value=='function') return value(card,player,null,'raw2');
			return 0;
		};
if(typeof get.order !== 'function') get.order=function(item){
			var info=get.info(item);
			if(!info) return -1;
			var aii=info.ai;
			var order;
			if(aii&&aii.order) order=aii.order;
			else if(aii&&aii.basic) order=aii.basic.order;
			if(order==undefined) return -1;
			var num=order;
			if(typeof(order)=='function'){
				num=order(item,_status.event.player);
			}
			if(typeof item=='object'&&_status.event.player){
				var player=_status.event.player;
				num=game.checkMod(player,item,num,'aiOrder',player);
			}
			return num;
		};
if(typeof get.effect_use !== 'function') get.effect_use=function(target,card,player,player2,isLink){
			var event=_status.event;
			var eventskill=null;
			if(player==undefined) player=_status.event.player;
			if(typeof card!='string'&&(typeof card!='object'||!card.name)){
				var skillinfo=get.info(event.skill);
				if(event.skill&&skillinfo.viewAs==undefined) card=_status.event.skill;
				else{
					card=get.card();
					if(skillinfo&&skillinfo.viewAs&&card.name===skillinfo.viewAs.name){
						eventskill=event.skill;
					}
				}
			}
			var info=get.info(card);
			if(typeof card=='object'&&info&&info.changeTarget){
				var targets=[target];
				info.changeTarget(player,targets);
				var eff=0;
				for(var i of targets){
					eff+=get.effect(i,card,player,player2,isLink);
				}
				return eff;
			}
			var result=get.result(card,eventskill);
			var result1=result.player_use||result.player,result2=result.target_use||result.target;
			if(typeof result1=='function') result1=result1(player,target,card,isLink);
			if(typeof result2=='function') result2=result2(player,target,card,isLink);
			
			if(typeof result1!='number') result1=0;
			if(typeof result2!='number') result2=0;
			var temp1,temp2,temp3,temp01=0,temp02=0,threaten=1;
			var skills1=player.getSkills().concat(lib.skill.global);
			game.expandSkills(skills1);
			var zerotarget=false,zeroplayer=false;
			for(var i=0;i<skills1.length;i++){
				temp1=get.info(skills1[i]).ai;
				if(temp1&&typeof temp1.effect=='object'&&typeof temp1.effect.player_use=='function'){
					temp1=temp1.effect.player_use(card,player,target,result1,isLink);
				}
				else if(temp1&&typeof temp1.effect=='object'&&typeof temp1.effect.player=='function'){
					temp1=temp1.effect.player(card,player,target,result1,isLink);
				}
				else temp1=undefined;
				if(typeof temp1=='object'){
					if(temp1.length==2||temp1.length==4){
						result1*=temp1[0];
						temp01+=temp1[1];
					}
					if(temp1.length==4){
						result2*=temp1[2];
						temp02+=temp1[3];
					}
				}
				else if(typeof temp1=='number'){
					result1*=temp1;
				}
				else if(temp1=='zeroplayer'){
					zeroplayer=true;
				}
				else if(temp1=='zerotarget'){
					zerotarget=true;
				}
				else if(temp1=='zeroplayertarget'){
					zeroplayer=true;
					zerotarget=true;
				}
			}
			if(target){
				var skills2=target.getSkills().concat(lib.skill.global);
				game.expandSkills(skills2);
				for(var i=0;i<skills2.length;i++){
					temp2=get.info(skills2[i]).ai;
					if(temp2&&temp2.threaten) temp3=temp2.threaten;
					else temp3=undefined;
					if(temp2&&typeof temp2.effect=='function'){
						if(!player.hasSkillTag('ignoreSkill',true,{
							card:card,
							target:target,
							skill:skills2[i],
							isLink:isLink,
						})) temp2=temp2.effect(card,player,target,result2,isLink);
						else temp2=undefined;
					}
					else if(temp2&&typeof temp2.effect=='object'&&typeof temp2.effect.target_use=='function'){
						if(!player.hasSkillTag('ignoreSkill',true,{
							card:card,
							target:target,
							skill:skills2[i],
							isLink:isLink,
						})) temp2=temp2.effect.target_use(card,player,target,result2,isLink);
						else temp2=undefined;
					}
					else if(temp2&&typeof temp2.effect=='object'&&typeof temp2.effect.target=='function'){
						if(!player.hasSkillTag('ignoreSkill',true,{
							card:card,
							target:target,
							skill:skills2[i],
							isLink:isLink,
						})) temp2=temp2.effect.target(card,player,target,result2,isLink);
						else temp2=undefined;
					}
					else temp2=undefined;
					if(typeof temp2=='object'){
						if(temp2.length==2||temp2.length==4){
							result2*=temp2[0];
							temp02+=temp2[1];
						}
						if(temp2.length==4){
							result1*=temp2[2];
							temp01+=temp2[3];
						}
					}
					else if(typeof temp2=='number'){
						result2*=temp2;
					}
					else if(temp2=='zeroplayer'){
						zeroplayer=true;
					}
					else if(temp2=='zerotarget'){
						zerotarget=true;
					}
					else if(temp2=='zeroplayertarget'){
						zeroplayer=true;
						zerotarget=true;
					}
					if(typeof temp3=='function'&&temp3(player,target)!=undefined){
						threaten*=temp3(player,target);
					}
					else if(typeof temp3=='object'){
						if(typeof temp3.target=='number'){
							threaten*=temp3;
						}
						else if(typeof temp3.target=='function'&&temp3(player,target)!=undefined){
							threaten*=temp3(player,target);
						}
					}
					else if(typeof temp3=='number'){
						threaten*=temp3;
					}
				}
				result2+=temp02;
				result1+=temp01;
				if(typeof card=='object'&&!result.ignoreStatus){
					if(get.attitude(player,target)<0){
						result2*=Math.sqrt(threaten);
					}
					else{
						result2*=Math.sqrt(Math.sqrt(threaten));
					}
					if(target.hp==1) result2*=2.5;
					if(target.hp==2) result2*=1.8;
					if(target.countCards('h')==0){
						if(get.tag(card,'respondSha')||get.tag(card,'respondShan')){
							result2*=1.7;
						}
						else{
							result2*=1.5;
						}
					}
					if(target.countCards('h')==1) result2*=1.3;
					if(target.countCards('h')==2) result2*=1.1;
					if(target.countCards('h')>3) result2*=0.5;
					if(target.hp==4) result2*=0.9;
					if(target.hp==5) result2*=0.8;
					if(target.hp>5) result2*=0.6;
				}
			}
			else{
				result2+=temp02;
				result1+=temp01;
			}
			if(zeroplayer) result1=0;
			if(zerotarget) result2=0;
			var final=0;
			if(player2){
				final=(result1*get.attitude(player2,player)+(target?result2*get.attitude(player2,target):0));
			}
			else final=(result1*get.attitude(player,player)+(target?result2*get.attitude(player,target):0));
			if(!isLink&&get.tag(card,'natureDamage')&&!zerotarget){
				var info=get.info(card);
				if(!info||!info.ai||!info.ai.canLink){
					if(target.isLinked()) game.countPlayer(function(current){
						if(current!=target&&current.isLinked()) final+=get.effect(current,card,player,player2,true);
					});
				}
				else if(info.ai.canLink(player,target,card)){
					game.countPlayer(function(current){
						if(current!=target&&current.isLinked()) final+=get.effect(current,card,player,player2,true);
					});
				}
			}
			return final;
		};
if(typeof get.effect !== 'function') get.effect=function(target,card,player,player2,isLink){
			var event=_status.event;
			var eventskill=null;
			if(player==undefined) player=_status.event.player;
			if(typeof card!='string'&&(typeof card!='object'||!card.name)){
				var skillinfo=get.info(event.skill);
				if(event.skill&&skillinfo.viewAs==undefined) card=_status.event.skill;
				else{
					card=get.card();
					if(skillinfo&&skillinfo.viewAs&&card.name===skillinfo.viewAs.name){
						eventskill=event.skill;
					}
				}
			}
			var result=get.result(card,eventskill);
			var result1=result.player,result2=result.target;
			if(typeof result1=='function') result1=result1(player,target,card,isLink);
			if(typeof result2=='function') result2=result2(player,target,card,isLink);
			
			if(typeof result1!='number') result1=0;
			if(typeof result2!='number') result2=0;
			var temp1,temp2,temp3,temp01=0,temp02=0,threaten=1;
			var skills1=player.getSkills().concat(lib.skill.global);
			game.expandSkills(skills1);
			var zerotarget=false,zeroplayer=false;
			for(var i=0;i<skills1.length;i++){
				temp1=get.info(skills1[i]).ai;
				if(temp1&&typeof temp1.effect=='object'&&typeof temp1.effect.player=='function'){
					temp1=temp1.effect.player(card,player,target,result1,isLink);
				}
				else temp1=undefined;
				if(typeof temp1=='object'){
					if(temp1.length==2||temp1.length==4){
						result1*=temp1[0];
						temp01+=temp1[1];
					}
					if(temp1.length==4){
						result2*=temp1[2];
						temp02+=temp1[3];
					}
				}
				else if(typeof temp1=='number'){
					result1*=temp1;
				}
				else if(temp1=='zeroplayer'){
					zeroplayer=true;
				}
				else if(temp1=='zerotarget'){
					zerotarget=true;
				}
				else if(temp1=='zeroplayertarget'){
					zeroplayer=true;
					zerotarget=true;
				}
			}
			if(target){
				var skills2=target.getSkills().concat(lib.skill.global);
				game.expandSkills(skills2);
				for(var i=0;i<skills2.length;i++){
					temp2=get.info(skills2[i]).ai;
					if(temp2&&temp2.threaten) temp3=temp2.threaten;
					else temp3=undefined;
					if(temp2&&typeof temp2.effect=='function'){
						if(!player.hasSkillTag('ignoreSkill',true,{
							card:card,
							target:target,
							skill:skills2[i],
							isLink:isLink,
						})) temp2=temp2.effect(card,player,target,result2,isLink);
						else temp2=undefined;
					}
					else if(temp2&&typeof temp2.effect=='object'&&typeof temp2.effect.target=='function'){
						if(!player.hasSkillTag('ignoreSkill',true,{
							card:card,
							target:target,
							skill:skills2[i],
							isLink:isLink,
						})) temp2=temp2.effect.target(card,player,target,result2,isLink);
						else temp2=undefined;
					}
					else temp2=undefined;
					if(typeof temp2=='object'){
						if(temp2.length==2||temp2.length==4){
							result2*=temp2[0];
							temp02+=temp2[1];
						}
						if(temp2.length==4){
							result1*=temp2[2];
							temp01+=temp2[3];
						}
					}
					else if(typeof temp2=='number'){
						result2*=temp2;
					}
					else if(temp2=='zeroplayer'){
						zeroplayer=true;
					}
					else if(temp2=='zerotarget'){
						zerotarget=true;
					}
					else if(temp2=='zeroplayertarget'){
						zeroplayer=true;
						zerotarget=true;
					}
					if(typeof temp3=='function'&&temp3(player,target)!=undefined){
						threaten*=temp3(player,target);
					}
					else if(typeof temp3=='object'){
						if(typeof temp3.target=='number'){
							threaten*=temp3;
						}
						else if(typeof temp3.target=='function'&&temp3(player,target)!=undefined){
							threaten*=temp3(player,target);
						}
					}
					else if(typeof temp3=='number'){
						threaten*=temp3;
					}
				}
				result2+=temp02;
				result1+=temp01;
				if(typeof card=='object'&&!result.ignoreStatus){
						if(get.attitude(player,target)<0){
						result2*=Math.sqrt(threaten);
					}
					else{
						result2*=Math.sqrt(Math.sqrt(threaten));
					}
					// *** continue here ***
					if(target.hp==1) result2*=2.5;
					if(target.hp==2) result2*=1.8;
					if(target.countCards('h')==0){
						if(get.tag(card,'respondSha')||get.tag(card,'respondShan')){
							result2*=1.7;
						}
						else{
							result2*=1.5;
						}
					}
					if(target.countCards('h')==1) result2*=1.3;
					if(target.countCards('h')==2) result2*=1.1;
					if(target.countCards('h')>3) result2*=0.5;
					if(target.hp==4) result2*=0.9;
					if(target.hp==5) result2*=0.8;
					if(target.hp>5) result2*=0.6;
				}
			}
			else{
				result2+=temp02;
				result1+=temp01;
			}
			if(zeroplayer) result1=0;
			if(zerotarget) result2=0;
			var final=0;
			if(player2){
				final=(result1*get.attitude(player2,player)+(target?result2*get.attitude(player2,target):0));
			}
			else final=(result1*get.attitude(player,player)+(target?result2*get.attitude(player,target):0));
			if(!isLink&&get.tag(card,'natureDamage')&&!zerotarget){
				var info=get.info(card);
				if(!info||!info.ai||!info.ai.canLink){
					if(target.isLinked()) game.countPlayer(function(current){
						if(current!=target&&current.isLinked()) final+=get.effect(current,card,player,player2,true);
					});
				}
				else if(info.ai.canLink(player,target,card)){
					game.countPlayer(function(current){
						if(current!=target&&current.isLinked()) final+=get.effect(current,card,player,player2,true);
					});
				}
			}
			return final;
		};
if(typeof get.damageEffect !== 'function') get.damageEffect=function(target,player,viewer,nature){
			if(!player){
				player=target;
			}
			if(!viewer){
				viewer=target;
			}
			var name='damage';
			if(nature=='fire'){
				name='firedamage';
			}
			else if(nature=='thunder'){
				name='thunderdamage';
			}
			else if(nature=='ice'){
				name='icedamage';
			}
			var eff=get.effect(target,{name:name},player,viewer);
			if(eff>0&&target.hujia>0) return eff/1.3;
			return eff;
		};
if(typeof get.recoverEffect !== 'function') get.recoverEffect=function(target,player,viewer){
			if(target.hp==target.maxHp) return 0;
			if(!player){
				player=target;
			}
			if(!viewer){
				viewer=target;
			}
			return get.effect(target,{name:'recover'},player,viewer);
		};
if(typeof get.buttonValue !== 'function') get.buttonValue=function(button){
			var card=button.link;
			var player=get.owner(card);
			if(!player) player=_status.event.player;
			if(player.getCards('j').contains(card)){
				var efff=get.effect(player,{
					name:card.viewAs||card.name,
					cards:[card],
				},player,player);
				if(efff>0) return 0.5;
				if(efff==0) return 0;
				return -1.5;
			}
			if(player.getCards('e').contains(card)){
				var evalue=get.value(card,player);
				if(player.hasSkillTag('noe')){
					if(evalue>=7){
						return evalue/6;
					}
					return evalue/10;
				}
				return evalue/3;
			}
			if(player.hasSkillTag('noh')) return 0.1;
			var nh=player.countCards('h');
			switch(nh){
				case 1:return 2;
				case 2:return 1.6;
				case 3:return 1;
				case 4:return 0.8;
				case 5:return 0.6;
				default:return 0.4;
			}
		};
if(typeof game.countDown !== 'function') game.countDown=function(time,onEnd){
			time=parseInt(time);
			if(!time) return;
			if(time<=0) return;
			var current=time;
			ui.timer.set(current,1);
			_status.countDown=setInterval(function(){
				if(--current){
					ui.timer.set(current,current/time);
				}
				else{
					ui.timer.set(0,0);
					clearInterval(_status.countDown);
					delete _status.countDown;
					if(onEnd) onEnd();
				}
			},1000);
		};
if(typeof game.tryTaixuAudio !== 'function') game.tryTaixuAudio=function(skill,player,directaudio){
		    var name=player.name||player.name1;
		    if(name&&game.searchBrothers(name,false,'txhj_')?.length) {
    		    var audios=game.getTaixuAudio(skill,player,directaudio);
    		    if(!audios||!audios.length) return false;
    		    var audio=audios.randomGet();
    		    var ranNum=Math.ceil(get.info(audio).audio*Math.random())||1;
    		    //game.trySkillAudio(audio,player,directaudio,true);
    		    game.playAudio('skill',audio+ranNum);
		    }else {
		        var sex=name?lib.character[name][0]:'male';
		        if(!['male','female'].contains(sex)) sex='male';
		        if(game._txmsList&&game._txmsList.contains(name)) sex='none';
		        game.playAudio('undefined',sex);
		        //由锦木千束建议，暂不搞语音
		        /*var num=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22].randomGet();
		        var sex=name?lib.character[name][0]:'male';
		        if(!['male','female'].contains(sex)) sex='male';
		        game.playAudio('voice',sex,num);*/
		    }
		};
if(typeof get.colorspan !== 'function') get.colorspan=function(str){
			if(str[0]=='#'){
				var color;
				switch(str[1]){
					case 'r':color='fire';break;
					case 'p':color='legend';break;
					case 'b':color='blue';break;
					case 'g':color='green';break;
					default:return str.slice(2);
				}
				return '<span class="'+color+'text '+color+'auto">'+str.slice(2)+'</span>';
			}
			return str;
		};
if(typeof get.result !== 'function') get.result=function(item,skill){
			var result;
			var info=get.info(item);
			if(info.ai) result=get.copy(info.ai.result);
			if(typeof(result)=='function') result=result(item);
			if(!result) result={};
			if(skill){
				var info2=get.info(skill);
				if(info2.ai){
					info2=info2.ai.result;
					for(var i in info2){
						result[i]=info2[i];
					}
				}
			}
			return result;
		};
if(typeof game.searchBrothers !== 'function') game.searchBrothers=function(name,forbidname,forbidstr){
		    if(!game._brothersList) {
		        game._brothersList={};
		    }
		    var rname=name.split('_').pop();
		    if(game._nmjsList&&game._nmjsList[name]) {
		        rname=game._nmjsList[name];
		    }
		    if(!game._brothersList[rname]) {
		        game._brothersList[rname]=[];
		    }else {
		        var rs=game._brothersList[rname].filter(n=>{
		            if(n==forbidname) return false;
		            if(forbidstr&&n.indexOf(forbidstr)!=-1) return false;
		            return true;
		        });
		        return rs;
		    }
		    for(var i in lib.character) {
		        var sname=i.split('_').pop();
		        if(sname!=rname) continue;
		        if(!lib.translate[i]) continue;
		        game._brothersList[rname].add(i);
		    }
		    var rs=game._brothersList[rname].filter(n=>{
	            if(n==forbidname) return false;
	            if(forbidstr&&n.indexOf(forbidstr)!=-1) return false;
	            return true;
	        });
	        return rs;
		};
if(typeof game.getTaixuAudio !== 'function') game.getTaixuAudio=function(skill,player,directaudio){
		    if(!game._brothersAudioList) {
		        game._brothersAudioList={};
		    }
		    var name=player.name||player.name1;
		    if(!name||!lib.character[name]) return false;
		    var rname=name.split('_').pop();
		    if(!game._brothersAudioList[rname]) {
		        game._brothersAudioList[rname]=[];
		    }else {
		        return game._brothersAudioList[rname];
		    }
		    var audios=[];
		    var names=game.searchBrothers(name,false,'txhj_');
		    if(names.length) names.forEach(n=>{
		        if(window.txhj_libCharacterChg&&window.txhj_libCharacterChg[n]&&window.txhj_libCharacterChg[n][3]) {
		            window.txhj_libCharacterChg[n][3].forEach(s=>{
    		            var info=get.info(s);
            			if(!info||!info.audio) return;
            			if(typeof info.audio!='number') return;
            			audios.add(s);
    		        });
    		        return;
		        }
		        if(!lib.character[n][3]) return;
		        lib.character[n][3].forEach(s=>{
		            var info=get.info(s);
        			if(!info||!info.audio) return;
        			if(typeof info.audio!='number') return;
        			audios.add(s);
		        });
		    });
		    game._brothersAudioList[rname]=audios;
		    return audios;
		};
};