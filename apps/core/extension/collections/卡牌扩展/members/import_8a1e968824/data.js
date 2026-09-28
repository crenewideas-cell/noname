// Generated from 民间卡牌.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {
        minjianjiben:{
            name:'民间基本',
            init:true
        },		
        minjianjinnang:{
            name:'民间锦囊',
            init:true
        },		
        minjianwuqi:{
            name:'民间武器',
            init:true
        },		
        minjianzhuangbei:{
            name:'民间装备',
            init:true
        },		
        changjing:{
            name:'场景卡牌',
            init:true
        },		
    }, build(config, builder) {
builder.addPack({});
builder.addPack({});
if(config.minjianjiben){	
       	builder.addPack({
              	card:{	

//毒桃
	        	bxyr_dutao:{
            audio:true,
            fullskin:true,
            type:'basic',
            content:function(){
            target.damage(1,'poison');
             },
             ai:{
              basic:{
             useful:3,
             value:4,
              order:1,
               },
                result:{
         target:function (player,target){
        if(!target.hasSkillTag('nopoison')) return -1;
              return 0;
                    },
                  },
		     		tag:{
					damage:1,
					poisonDamage:1,
		          	},
               },
             },
//粮
	        	bxyr_liang:{
	        	audio:true,
	        	fullskin:true,
	        	type:'basic',
            content:function(){
	        	target.draw();
	        	target.addTempSkill('bxyr_liang','phaseEnd');
            },
	        	ai:{
             basic:{
      			order:1,
			  		useful:0.4,
				value:function(target,player){	
      if(player.num('h')>player.getHandcardLimit()){
						return player.num('h')-player.getHandcardLimit()+player.num('h')/2+1;
					}
					return player.num('h');
				},
        },
             result:{
                   target:1,
                  },
 		     		tag:{
					draw:1,
		         		},
              },
             },
//酥
	        	bxyr_su:{
	        	audio:true,
	        	fullskin:true,
	        	type:'basic',
	        	enable:true,
	        	filterTarget:function(card,player,target){
					    if(target.hp>=target.maxHp) return false;
			   		return true;
			     	},
	        	selectTarget:[1,2],
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
//斩
	        	bxyr_zhan:{
						audio:true,
						fullskin:true,
						type:'basic',
						enable:true,
						selectTarget:1,
						filterTarget:function(card,player,target){							if(get.distance(player,target,'attack')>1) return false;
							return target!=player;
						},	
						modTarget:true,
						content:function(){
	        	"step 0"
				var next=target.chooseToRespond({name:'shan'});
				next.set('ai',function(card){
					var evt=_status.event.getParent();
					if(ai.get.damageEffect(evt.target,evt.player,evt.target)>=0) return 0;
										return 1;
	        	});	
	      next.autochoose=lib.filter.autoRespondShan;
	        	"step 1"
	        	if(result.bool==false){
	        	  target.loseMaxHp();
	        	}
	        },
	        	ai:{
	        	basic:{
	        	order:7.1,
	        	useful:1.5,
	        	value:7,
	        	},
	        	result:{
	        	target:function (player,target){
	        	if(target.maxHp<4) return target.maxHp-5;
	        	return -1;
	        		        	},
           	          }
		       				},
	        	   },




             },
				skill:{			
            _bxyr_loseMaxHp:{
 						trigger:{player:'loseMaxHpBefore'},
						forced:true,	
						popup:false,					
						silent:true,
 						content:function(){
            player.logSkill('bxyr_loseMaxHp');          
             }          
           },
           bxyr_loseMaxHp:{
           audio:true,
           },
_yr_dutao:{
						trigger:{global:'dying'},
						priority:200,
						direct:true,
						filter:function(event,player){
				if(!event.player.isAlive()) return false;
				if(player.num('h','bxyr_dutao')) return true;
				var mn=player.get('e','5');
			 if(mn&&mn.name=='muniu'&&mn.cards&&mn.cards.length){	
				for(var i=0;i<mn.cards.length;i++){
						if(mn.cards[i].name=='bxyr_dutao') return true;
					}
				}
				return false;
			},
						content:function(){
				player.chooseToUse('是否给'+get.translation(trigger.player)+'吃毒桃？',function(card,player){
					if(card.name!='bxyr_dutao') return false;	
				var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
					if(mod!='unchanged') return mod;
					return true;
				},
trigger.player,-1);
						  },
						},
//粮
						bxyr_liang:{
						mod:{						
						maxHandcard:function(player,num){
						return num+=Infinity;
		    				}
				  		}
						},
						_bxyr_liang:{
						trigger:{player:'phaseDiscardBefore'},
						direct:true,
						filter:function(event,player){
						if(!event.player.isAlive()) return false;
						if(player.num('h','bxyr_liang')) return true;
				var mn=player.get('e','5');			 if(mn&&mn.name=='muniu'&&mn.cards&&mn.cards.length){	
				for(var i=0;i<mn.cards.length;i++){
						if(mn.cards[i].name=='bxyr_liang') return true;
					}
				}
				return false;
			},
						content:function(){
						player.chooseToUse('是否对'+get.translation(trigger.player)+'使用粮？',function(card,player){
					if(card.name!='bxyr_liang') return false;	
				var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
					if(mod!='unchanged') return mod;
					return true;
				},
trigger.player,-1);
							}
						},


				},
                translate:{
		 bxyr_dutao_bg:'桃',
		 bxyr_dutao:'毒桃',
		 bxyr_liang_bg:'粮',
		 bxyr_liang:'粮',
		 bxyr_su_bg:'酥',
		 bxyr_su:'酥',
		 bxyr_zhan_bg:'斩',
		 bxyr_zhan:'斩',

//毒桃
		 bxyr_dutao_info:'任何角色进入濒死状态时对其使用，使用后，立即对其造成一点追加伤害',

//粮
		 bxyr_liang_info:'弃牌阶段开始，对你使用，你摸一张牌，然后你无手牌上限，直到回合结束',

//酥
		 bxyr_su_info:'出牌阶段，选择最多两名角色各回复一点体力',

//斩
		 bxyr_zhan_info:'出牌阶段，对攻击范围内的一名角色使用，目标必须使用一张【闪】来抵消，否则扣减一点体力上限',
              },
				list:[

['heart',2,'bxyr_su'],
['heart',4,'bxyr_su'],
['heart',6,'bxyr_zhan'],
['heart',7,'bxyr_liang'],
['heart',9,'bxyr_liang'],
['heart',9,'bxyr_su'],
['heart',10,'bxyr_su'],
['heart',12,'bxyr_zhan'],
['heart',13,'bxyr_su'],
['spade',3,'bxyr_dutao','poison'],
['spade',4,'bxyr_dutao','poison'],
['spade',4,'bxyr_su'],
['spade',5,'bxyr_dutao','poison'],
['spade',5,'bxyr_zhan'],
['spade',6,'bxyr_dutao','poison'],
['spade',7,'bxyr_dutao','poison'],
['spade',9,'bxyr_dutao','poison'],
['spade',9,'bxyr_zhan'],
['spade',11,'bxyr_su'],
['spade',12,'bxyr_dutao','poison'],
['spade',12,'bxyr_liang'],
['spade',13,'bxyr_liang'],
['club',2,'bxyr_liang'],
['club',4,'bxyr_dutao','poison'],
['club',4,'bxyr_zhan'],
['club',5,'bxyr_liang'],
['club',6,'bxyr_dutao','poison'],
['club',6,'bxyr_zhan'],
['club',8,'bxyr_zhan'],
['club',9,'bxyr_liang'],
['club',10,'bxyr_zhan'],
['club',12,'bxyr_dutao','poison'],
['club',12,'bxyr_liang'],
['diamond',1,'bxyr_zhan'],
['diamond',1,'bxyr_liang'],
['diamond',2,'bxyr_su'],
['diamond',3,'bxyr_zhan'],
['diamond',4,'bxyr_liang'],
['diamond',10,'bxyr_su'],
				]	
       	 	},'民间基本');		
		}
if(config.minjianjinnang){	
       	builder.addPack({
              	card:{	

//单刀赴会
	        	bxyr_dandaofuhui:{
	        	audio:true,
	        	fullskin:true,
	        	type:'trick',
	        	ai:{
	        	basic:{
	        		useful:[10,7.5],
	        		value:[10,7.5]
	            	}
	          	}
	        	},
//刮骨疗毒
	      		bxyr_guaguliaodu:{
	        	audio:true,
	      		fullskin:true,
            enable:true,
            type:'trick',
	      		filterTarget:true,
            content:function(){
	    			target.recover();
	    			player.damage(target);
            }, 
			ai:{
				basic:{
					order:4.1,
					useful:1,
					value:3,
		      		},
				result:{
					player:function(player,target){
						return ai.get.damageEffect(player,target);
	        				},
					target:function(player,target){
						return ai.get.recoverEffect(target,player);
	        				}
	        			}
		      		},
				tag:{
					recover:1,
					damage:1,
		  		    }
	      		},
//黄巾起义
	      		bxyr_huangjinqiyi:{
	        	audio:true,
	      		fullskin:true,
            enable:true,
            type:'trick',
            selectTarget:-1,
	      		filterTarget:function (card,player,target){
	      		return player==target;
	      		},
            content:function(){
          target.showHandcards();
          if(target.num('h',{name:'shan'})<=0){
             target.draw(3);
              }
            }, 
			ai:{
				basic:{
					order:7.1,
					useful:1,
					value:function(event,player){
						if(!player.num('h',{name:'shan'})) return 10;
						return 2.9;
	        				}
		      		},
				result:{
					target:function(player){
						if(!player.num('h',{name:'shan'})) return 1;
						return 0;
	        				}
	        			}
		      		},
				tag:{
					draw:3
		  		    }
	      		},
//火烧赤壁
	        	bxyr_huoshaochibi:{
						audio:true,
	      		fullskin:true,
            enable:true,
            type:'trick',
            selectTarget:-1,
			filterTarget:function(card,player,target){
				if(player==target) return false;
				return (target.num('hej')>=0);
			},
			content:function(){
           "step 0"
				target.judge(function(card){
if(get.color(card)=='red'&&!target.hasSkillTag('nofire')) return -6;
					return 0;
				});
           "step 1"
      if(result.color=='red'){
   target.damage('fire',1);
           }
			},
			ai:{
				wuxie:function(target,card,player,viewer){
					if(ai.get.attitude(viewer,target)>0&&target.hasSkillTag('nofire')){
						if(target.hp==1||Math.random()<0.7) return 0;
					}
				},
				basic:{
					order:9,
					useful:1,
					value:4,
				},
				result:{
					target:function(player,target){
						var num=0;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].ai.shown==0) num++;
						}
						if(num>1) return 0;
						var nh=target.hp;
						if(get.mode()=='identity'){
					  if(target.isZhu&&nh<=1&&!target.hasSkillTag('nofire')) return -100;
						}
						if(get.mode()=='guozhan'){
					  if(target.identity==player.identity&&nh<=1&&!target.hasSkillTag('nofire')) return -3;
						}
						if(nh==1&&!target.hasSkillTag('nofire')) return -1.7;
						if(nh!=1&&!target.hasSkillTag('nofire')) return -1.3;
						return 0;
					},
				},
				tag:{
					respond:1,
					damage:1,
					fireDamage:1,
					natureDamage:1,
					multitarget:1,
					multineg:1,
			}
		},
},
//偷袭		
            bxyr_touxi:{
            fullskin:true,
            type:'trick',
            content:function(){
            if(target.num('h')){
            	player.gainPlayerCard('h',target,true);
            	}
            },
            ai:{
            	order:1,
            	useful:6,
            	value:6,
            	result:{
            	target:-1
            	},
            	tag:{
            		loseCard:1
            	}
             }
            },
//望梅止渴
            bxyr_wangmeizhike:{
						audio:true,
	      		fullskin:true,
            enable:true,
            type:'trick',
	    	  	filterTarget:true,
            content:function(){
            "step 0"
				target.judge(function(card){
if(get.suit(card)=='club'&&target.hp<target.maxHp) return 9;
if(get.suit(card)=='club'&&target.hp>=target.maxHp) return 0;
					return 1;
				});
           "step 1"
      if(result.suit=='club'){
				target.recover();
                 }
       if(result.suit!='club'){
             target.draw();
           }
			},
      ai:{
              basic:{
			    		useful:3,
				    	value:1,
              order:9,
                         },
             result:{
        target:function (player,target){
if(target.hp<target.maxHp) return target.maxHp-target.hp;
return 0.5;
                              },
                         },
		     		tag:{
					draw:1,
		         		},
              },
            },
//陷阵
        		bxyr_xianzhen:{
						audio:true,
	       		fullskin:true,
            enable:true,
            type:'trick',
            selectTarget:-1,
						filterTarget:function(card,player,target){
							return target!=player;
						},
						modTarget:true,	
			content:function(){
				if(target.num('hej')){					player.discardPlayerCard('hej',target,true);
				}
			},
			ai:{
				basic:{
					order:9,
					useful:1,
					value:6,
				},
				result:{
					target:function(player,target){
						var es=target.get('e');
						var nh=target.num('h');
						var noe=(es.length==0||target.hasSkillTag('noe'));
						var noe2=(es.length==1&&es[0].name=='baiyin'&&target.hp<target.maxHp);
						var noh=(nh==0||target.hasSkillTag('noh'));
						if(noh&&noe) return 0;
						if(noh&&noe2) return 0.01;
						if(ai.get.attitude(player,target)<=0) return (target.num('he'))?-1.5:1.5;
						var js=target.get('j');
						if(js.length){
							var jj=js[0].viewAs?{name:js[0].viewAs}:js[0];
							if(jj.name=='guohe') return 3;
							if(js.length==1&&ai.get.effect(target,jj,target,player)>=0){
								return -1.5;
							}
							return 2;
						}
						return -1.5;
					},
				},
				tag:{
					loseCard:1,
				}
			}
		},
//卸甲归田
            bxyr_xiejiaguitian:{
            fullskin:true,
            enable:true,
            type:'trick',
            filterTarget:true,
            content:function(){
       target.discard(target.get('e').randomGets(Infinity));
            },
        ai:{
              basic:{
					useful:1,
					value:5,
          order:10,
                         },
             result:{
            target:function (player,target){
 						var value=0,i;
						var cards=target.get('e');
						for(i=0;i<cards.length;i++){
							value+=ai.get.value(cards[i]);
						}
             return -value;
                  },
                },
              },
            },
//夜观天象
            bxyr_yeguantianxiang:{
            fullskin:true,
            enable:true,
            type:'trick',
	      		filterTarget:function(card,player,target){
				if(player==target) return false;
				return (target.num('h')>0);
	      		},
            content:function(){
        player.viewCards('夜观天象',target.get('h'));
            },
        ai:{
              basic:{
					value:2,
          order:10,
                         },
             result:{
            target:function (player,target){
            var nh=target.num('h');
            if(!nh) return 0;
            if(nh>=2) return -nh;
            return -1;
                  },
                },
              },
            },
//八门金锁
            bxyr_bamenjinsuo:{
            fullskin:true,
            type:'delay',
			enable:function(card,player){
				return (lib.filter.judge(card,player,player));
			},
			filterTarget:function(card,player,target){
				return (lib.filter.judge(card,player,target)&&player!=target);	
		},
            judge:function(card){
            if(get.suit(card)!='diamond') return -3;
	       			return 0;
            },
			effect:function(){
				if(result.judge) player.addTempSkill('bxyr_bamenjinsuo','phaseAfter');
         },
 			ai:{
				basic:{
					order:1,
					useful:0.5,
					value:3,
				},
				result:{
					target:function(player,target){
						var num=target.hp-target.num('h')-2;
						if(num>-1) return -0.01;
						if(target.hp<3) num--;
						if(target.isTurnedOver()) num/=2;
						var dist=get.distance(player,target,'absolute');
						if(dist<1) dist=1;
						return num/Math.sqrt(dist);
					}
				},
				tag:{
        globalFrom:Infinity
				}
			}
		},
 //施毒
            bxyr_shidu:{
						audio:true,
	      		fullskin:true,
            type:'delay',
		     	enable:function(card,player){
      				return (lib.filter.judge(card,player,player));
        			},
     			filterTarget:function(card,player,target){
				return (lib.filter.judge(card,player,target)&&player!=target);	
      		},
    			judge:function(card){
   				if(get.suit(card)=='spade'||get.suit(card)=='club') return -3;
	  			return 0;
	     		},
     			effect:function(){
		if(result.judge) player.damage(1,'poison','nosource');
         },
        ai:{
              basic:{
		    			order:1,
		    			useful:0.5,
    					value:4,
                         },
              result:{
        target:function (player,target){
        if(target.hp<3&&!target.hasSkillTag('nopoison')) return target.hp-5;
        if(!target.hasSkillTag('nopoison')) return -1;
              return 0;
                              },
                         },
		     		tag:{
					damage:1,
					poisonDamage:1,
		         		},
               },
              },



              },
				skill:{	
//单刀赴会
	          _bxyr_dandaofuhui:{ 
	          trigger:{ 
	          global:'damageBefore', 
	          }, 
	          forced:true, 
						priority:-Infinity,
						filter:function(event,player){ 
						if(!event.player.isAlive()) return false;						if(player.num('h','bxyr_dandaofuhui')&&player!=_status.currentPhase&&get.distance(player,event.player,'attack')<=1) return true; 
				var mn=player.get('e','5');			 if(mn&&mn.name=='muniu'&&mn.cards&&mn.cards.length){	 
				for(var i=0;i<mn.cards.length;i++){						if(mn.cards[i].name=='bxyr_dandaofuhui'&&player!=_status.currentPhaseget.distance(player,event.player,'attack')<=1) return true; 
					} 
				} 
				return false; 
			}, 
	          content:function(){ 
	        	'step 0'
				var next=player.chooseToRespond({name:'bxyr_dandaofuhui'},'单刀赴会：是否打出一张单刀赴会'+'防止'+get.translation(trigger.player)+'受到的伤害');
				next.set('ai',function(card){
					var player=_status.event.player;            if(trigger.num>0&&ai.get.attitude(_status.event.player,trigger.player)>0)  return trigger.num;
           return 0;
	        	});	
	        	'step 1'
	        	if(result.bool){
		    		trigger.untrigger();
			    	trigger.finish();
	            	}
	            }, 
	          }, 
//偷袭		
            _bxyr_touxi:{
            trigger:{global:'phaseEnd'},
            direct:true,
            filter:function(event,player){
            if(event.player==player) return false;
			if(get.distance(player,event.player,'attack')>1) return false;
	    			if(!event.player.num('h')) return false;
				if(player.num('h','bxyr_touxi')) return true;
				var mn=player.get('e','5');				if(mn&&mn.name=='muniu'&&mn.cards&&mn.cards.length){
					for(var i=0;i<mn.cards.length;i++){
						if(mn.cards[i].name=='bxyr_touxi') return true;
					}
				}
				return false;
			},
			content:function(){			player.chooseToUse(get.prompt('bxyr_touxi',trigger.player).replace(/发动/,'使用'),function(card,player){
					if(card.name!='bxyr_touxi') return false;
					var mod=game.checkMod(card,player,'unchanged','cardEnabled',player.get('s'));
					if(mod!='unchanged') return mod;
					return true;
				},trigger.player,-1).targetRequired=true;
			}
		},
//八门金锁
            bxyr_bamenjinsuo:{
            mod:{
            globalFrom:function (from,to,distance){
            return distance+Infinity;
                }
              }
            }, 

				},
                translate:{
		 bxyr_dandaofuhui_bg:'赴',
		 bxyr_dandaofuhui:'单刀赴会',
		 bxyr_guaguliaodu_bg:'刮',
		 bxyr_guaguliaodu:'刮骨疗毒',
		 bxyr_huangjinqiyi_bg:'起',
     bxyr_huangjinqiyi:'黄巾起义',
		 bxyr_huoshaochibi_bg:'烧',
		 bxyr_huoshaochibi:'火烧赤壁',
     bxyr_touxi_bg:'襲',
     bxyr_touxi:'偷袭',
 		 bxyr_wangmeizhike_bg:'梅',
 		 bxyr_wangmeizhike:'望梅止渴',
		 bxyr_xianzhen_bg:'陷',
		 bxyr_xianzhen:'陷阵',
		 bxyr_xiejiaguitian_bg:'卸',
		 bxyr_xiejiaguitian:'卸甲归田',
     bxyr_yeguantianxiang:'觀',
     bxyr_yeguantianxiang:'夜观天象',
		 bxyr_bamenjinsuo_bg:'锁',
		 bxyr_bamenjinsuo:'八门金锁',
		 bxyr_shidu_bg:'施',
		 bxyr_shidu:'施毒',

//单刀赴会
//		 bxyr_dandaofuhui_info:'非自己的回合，抵消你攻击范围内的任意一名角色受到的一次伤害。',
		 bxyr_dandaofuhui_info:'你的回合外，当你攻击范围内的任意一名角色受到伤害时，你可以打出此牌防止该伤害。',

//刮骨疗毒
//		 bxyr_guaguliaodu_info:'出牌阶段，对任一角色使用，该角色回复一点体力，并对你造成一点伤害。',
		 bxyr_guaguliaodu_info:'出牌阶段，对任意一名角色使用，该角色回复一点体力，并对你造成一点伤害。',

//黄巾起义
//		 bxyr_huangjinqiyi_info:'出牌阶段，你展示手牌，若手牌中没有闪，你摸三张牌',
		 bxyr_huangjinqiyi_info:'出牌阶段，对你使用，你展示手牌，若手牌中没有闪，你摸三张牌',

//火烧赤壁
//		 bxyr_huoshaochibi_info:'其他角色各进行一次判定，结果为红色的受到一点火属性伤害',
		 bxyr_huoshaochibi_info:'出牌阶段，对所有其他角色使用，每名目标角色各进行一次判定，结果为红色受到一点火属性伤害',

//偷袭
//     bxyr_touxi_info:'当你攻击范围内一名其他角色的回合结束阶段结束时，你获得其一张手牌。',
     bxyr_touxi_info:'当你攻击范围内一名其他角色的回合结束时，对其使用，你获得其一张手牌。',

//望梅止渴
		 bxyr_wangmeizhike_info:'出牌阶段，对任意一名角色使用该角色立即判定，若结果为♣，则目标回复一点体力，若不是♣，摸一张牌',

//陷阵
		 bxyr_xianzhen_info:'出牌阶段，对所有其他角色使用，由你弃掉每名目标角色区域里的一张牌',
 
//卸甲归田
//		 bxyr_xiejiaguitian_info:'弃置一名角色装备区里的所有牌',
		 bxyr_xiejiaguitian_info:'出牌阶段，对一名角色使用，目标弃置装备区里的所有牌',

//夜观天象
     bxyr_yeguantianxiang_info:'出牌阶段，对除你以外的任意一名有手牌的角色使用，你立即观看一次目标的手牌。',

//八门金锁
		 bxyr_bamenjinsuo_info:'出牌阶段，对除你以外的任意一名角色使用。将【八门金锁】置于该角色判定区里，若判定结果不为♦则该角色自己的当前回合与所有其它角色距离无限',

//施毒
		 bxyr_shidu_info:'出牌阶段，对除你以外的任意一名角色使用。将【施毒】置于该角色判定区里，若判定结果为♠♣则该角色受到一点毒伤害，弃置它，若判定结果为♥♦，则直接弃置它',

             },
				list:[
['heart',1,'bxyr_dandaofuhui'],
['heart',1,'bxyr_wangmeizhike'],
['heart',3,'bxyr_huoshaochibi','fire'],
['heart',3,'bxyr_xiejiaguitian'],
['heart',4,'bxyr_guaguliaodu'],
['heart',5,'bxyr_huoshaochibi','fire'],
['heart',6,'bxyr_guaguliaodu'],
['heart',7,'bxyr_wangmeizhike'],
['heart',8,'bxyr_bamenjinsuo'],
['heart',10,'bxyr_dandaofuhui'],
['heart',11,'bxyr_dandaofuhui'],
['heart',11,'bxyr_huoshaochibi','fire'],
['spade',3,'bxyr_shidu','poison'],
['spade',3,'bxyr_huangjinqiyi'],
['spade',5,'bxyr_huangjinqiyi'],
['spade',6,'bxyr_huangjinqiyi'],
['spade',6,'bxyr_xianzhen'],
['spade',7,'bxyr_shidu','poison'],
['spade',7,'bxyr_dandaofuhui'],
['spade',9,'bxyr_xiejiaguitian'],
['spade',10,'bxyr_xiejiaguitian'],
['spade',10,'bxyr_shidu','poison'],
['spade',11,'bxyr_yeguantianxiang'],
['club',2,'bxyr_shidu','poison'],
['club',3,'bxyr_wangmeizhike'],
['club',5,'bxyr_wangmeizhike'],
['club',6,'bxyr_touxi'],
['club',7,'bxyr_huangjinqiyi'],
['club',7,'bxyr_xianzhen'],
['club',9,'bxyr_wangmeizhike'],
['club',9,'bxyr_xiejiaguitian'],
['club',10,'bxyr_touxi'],
['club',11,'bxyr_xianzhen'],
['club',11,'bxyr_yeguantianxiang'],
['club',13,'bxyr_xianzhen'],
['club',13,'bxyr_touxi'],
['diamond',2,'bxyr_guaguliaodu'],
['diamond',3,'bxyr_bamenjinsuo'],
['diamond',5,'bxyr_dandaofuhui'],
['diamond',7,'bxyr_bamenjinsuo'],
['diamond',8,'bxyr_yeguantianxiang'],
['diamond',9,'bxyr_huoshaochibi','fire'],
['diamond',9,'bxyr_touxi'],
['diamond',10,'bxyr_yeguantianxiang'],
['diamond',11,'bxyr_guaguliaodu'],
['diamond',12,'bxyr_bamenjinsuo'],
['diamond',13,'bxyr_guaguliaodu'],
				]	
       	 	},'民间锦囊');		
		}
if(config.minjianwuqi){	
       	builder.addPack({
              	card:{	
//穿云剑
	        	bxyr_chuanyunjian:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-1},
	        	skills:['bxyr_chuanyunjian'],
	        		ai:{
				order:function(target,player){					if(player.hasSkill('wang_huaxiong_shanshi')){
						return 0;
					}
					return 7;
				},
				basic:{
					equipValue:function(card,player){
						if(player.hasSkill('wang_huaxiong_shanshi')) return -200;
						return 6;
	        				}
	        			}
	        		},
	        	},
//鬼龙斩月刀
	        	bxyr_guilongzhanyuedao:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-2},
	        	skills:['bxyr_guilongzhanyuedao'],
	       ai:{
				basic:{
					equipValue:function(card,player){
            if(player.storage.shuangxiong=='black') return 5+player.num('h');
            if(player.storage.shuangxiong=='red') return 0-player.num('h');
						if(player.hasSkill('bxyr_mingguangkai')) return 11;
						if(player.hasSkill('tuntian')) return -9;
						if(player.hasSkill('jijiu')) return 9;
						if(player.hasSkill('zaiqi')) return 8.5;
						if(player.hasSkill('luoshen')||player.hasSkill('qixi')||player.hasSkill('ganglie')) return -6;
						if(player.hasSkill('wusheng')||player.hasSkill('tianxiang')) return 8;
						if(player.hasSkill('duanliang')||player.hasSkill('lianhuan')||player.hasSkill('qingguo')||player.hasSkill('guidao')||player.hasSkill('guose')) return -5;
						if(player.hasSkill('tieji')) return 7;
					return 3;
	        	      }
	        			}
	        		},
	        	},
//枷锁
	        	bxyr_jiasuo:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
 	        	skills:['bxyr_jiasuo'],
	        	ai:{
	        	basic:{
	        	order:1,
					equipValue:function(card,player){
       var equip1=player.get('e','1');
  if(equip1&&equip1.name=='bxyr_jiasuo') return -20;
						return 7;
		 	 	  				}
		  					}
	          	},
	        	},
//姬神弓
	        	bxyr_jishengong:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-4},
	        	skills:['bxyr_jishengong'],
	        	ai:{
	       		basic:{
	        		equipValue:8
	        	    }
	          	},
	        	},
//开天斧
	        	bxyr_kaitianfu:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-2},
	        	skills:['bxyr_kaitianfu'],
	        	ai:{
	       			basic:{
	        			equipValue:5
	      				}
	        		},
	       		},
//裂天斧
	        	bxyr_lietianfu:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-3},
	        	onLose:function(){
	   				player.storage.bxyr_lietianfu=0;
     player.unmarkSkill('bxyr_lietianfu');
	        	},
	        	onEquip:function(){
	   				player.storage.bxyr_lietianfu=0;
	          player.markSkill('bxyr_lietianfu');
	        	},
	        	skills:['bxyr_lietianfu'],
	        	ai:{
	        	basic:{
	        	equipValue:7
	            	}
	           	},
	        	},
//烈焰之弓
	        	bxyr_lieyanzhigong:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-4},
	        	skills:['bxyr_lieyanzhigong','bxyr_lieyanzhigong2'],
	        	ai:{
					    basic:{
					       equipValue:6
			        	}
		        	},
	        	},
//灵越剑
	        	bxyr_lingyuejian:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-1},
	        	skills:['bxyr_lingyuejian'],
	        		ai:{
				order:function(target,player){					if(player.hasSkill('wang_huaxiong_shanshi')){
						return 0;
					}
					return 4;
				},
				basic:{
					equipValue:function(card,player){
						if(player.hasSkill('wang_huaxiong_shanshi')) return -200;
						return 4;
	        				}
	        			}
	        		},
	        	},
//流焰玄火扇
	        	bxyr_liuyanxuanhuoshan:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-2},
	        	skills:['bxyr_liuyanxuanhuoshan'],
	        	ai:{
			       	basic:{
						   equipValue:5
			        	}
		        	},
	        	},
//蛮骨魔琴
	        	bxyr_mangumoqin:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-3},
	        	skills:['bxyr_mangumoqin'],
	        	ai:{
		     			basic:{
		     				equipValue:6
			        	}
		        	},
	        	},
//魔龙斩月
	        	bxyr_molongzhanyue:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-1},
	        	skills:['bxyr_molongzhanyue'],
	        	ai:{
				     	basic:{
		     				equipValue:5
			        	}
		        	},
	        	},
//破魔刀
	        	bxyr_pomodao:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-1},
	        	skills:['bxyr_pomodao'],
	        	ai:{
	        		basic:{
		      			equipValue:3
	        			}
		        	},
	        	},
//七星宝刀
	        	bxyr_qixingbaodao:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-1},
	        	skills:['bxyr_qixingbaodao','bxyr_qixingbaodao2','bxyr_qixingbaodao3'],
	        	ai:{


				     	basic:{
		     				equipValue:6
			        	}
		        	},
	        	},
//铁骨扇
	        	bxyr_tiegushan:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	skills:['bxyr_tiegushan','bxyr_tiegushan2'],
	        	ai:{
		     			basic:{
					equipValue:function(card,player){
						if(player.hasSkill('paoxiao')) return 13;
             return 7.9;
                  }
	        			}
	        		},
	        	},
//天霜凝碧杖
	        	bxyr_tianshuangningbizhang:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-2},
	        	skills:['bxyr_tianshuangningbizhang'],
	        	ai:{
		     			basic:{
		     				equipValue:3
	        			}
	        		},
	        	},
//投石车
	        	bxyr_toushiche:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-5},
			onLose:function(){
				player.storage.bxyr_toushiche=0;
  			},
			onEquip:function(){
				player.storage.bxyr_toushiche=0;
         },
         skills:['bxyr_toushiche','bxyr_toushiche2','bxyr_toushiche3'],
	        		ai:{
	        	basic:{
					equipValue:function(card,player){
				if(player.storage.bxyr_toushiche==2)  return 4;
				if(player.storage.bxyr_toushiche==1)  return 5;
         return 6.5;
          	       }
					     	}
				     	},
		     		},
//舞踏扇
	        	bxyr_wutashan:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-2},
	        	skills:['bxyr_wutashan'],
	        	ai:{
	        		basic:{
	        			equipValue:5
	        			}
	        		},
	        	},
//吟龙琴
	        	bxyr_yinlongqin:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-3},
	        	skills:['bxyr_yinlongqin'],
	        		ai:{
	        	basic:{
					equipValue:function(card,player){
            if(player.hasSkill('luanji')) return 10;
            if(player.hasSkill('shuangxiong')) return 8;
           if(player.hasSkill('huoji')) return 7;
          return 6.5;
          	       }
					     	}
				     	},
		     		},
//倚天剑
		     		bxyr_yitianjian:{
   					fullskin:true,
			   		type:"equip",
   					subtype:"equip1",
			   		distance:{attackFrom:-1},
   					skills:['bxyr_yitianjian'],
			   		ai:{
   						basic:{
   							equipValue:3
	   					}
   					},
   				},
//月食弓
	        	bxyr_yueshigong:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-4},
	        	skills:['bxyr_yueshigong'],
	        ai:{
    				basic:{
		    			equipValue:8
	        			}
	        		},
	        	},
//战魂刀
	        	bxyr_zhanhundao:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-1},
	        	skills:['bxyr_zhanhundao'],
	       		ai:{
	        		basic:{
	      				equipValue:6
	        			}
	        		},
	        	},
//镇魂琴
	        	bxyr_zhenhunqin:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-3},
	        	skills:['bxyr_zhenhunqin'],
	        	ai:{
	        		basic:{
	        			equipValue:5
	        			}
	        		},
	        	},
//重弩
	        	bxyr_zhongnu:{
	        	fullskin:true,
	        	type:"equip",
	        	subtype:"equip1",
	        	distance:{attackFrom:-2},
	        	skills:['bxyr_zhongnu'],
	        	ai:{
				     	basic:{
					    	equipValue:4
			        	}
		        	},
	        	},




              },
				skill:{			
//穿云剑
	        	bxyr_chuanyunjian:{
            trigger:{
            source:"damageBefore",
            },
            forced:true,
            filter:function (event){
       return event.card&&event.card.name=='sha';
            },
            content:function (){
            trigger.untrigger();
            trigger.finish();
            trigger.player.loseMaxHp();
                }
 	        	},
//飞龙夺凤
            bxyr_feilongduofeng:{
						trigger:{player:'shaBegin'},
						priority:5,
						audio:2,
						filter:function(event,player){
							return event.target.num('he');
						},
						check:function(event,player){
							if(event.target.hasSkillTag('noh')) return false;
							return ai.get.attitude(player,event.target)<=0;
						},
						content:function(){
							trigger.target.chooseToDiscard(true)
						},
						group:['bxyr_feilongduofeng2']
            },
            bxyr_feilongduofeng2:{
						trigger:{source:'damageAfter'},
						priority:-1,
						audio:2,
						filter:function(event,player){ 
						if(!event.player.isDead()) return false; 
						if(!event.card||event.card.name!='sha') return false; 
						if(player.identity=='unknown') return false; 
						return !game.hasPlayer(function(target){
							return target.group!=player.group&&(game.countPlayer(function(target1){
								return target1.group==target.group;
							})<game.countPlayer(function(target2){
								return target2.group==player.group;
							}));
						});
						},
						content:function(){
							'step 0'
							trigger.player.revive();
              trigger.player.chooseControl('确定','取消',function(){
                return 2>1?'确定':'取消';
            }).set('prompt','【飞龙夺凤】<br><br><div class="text center">是否选择一张和'+get.translation(player)+'相同势力的武将牌重新加入游戏');
							'step 1'
     if(result.control=='取消'){
							trigger.player.die()._triggered=null;     
              event.finish();
              return;
      }
     if(result.control=='确定'){
							var list=[];
							for(var i in lib.character){								if(lib.character[i].mode&&lib.character[i].mode.contains(lib.config.mode)==false) continue;
								if(lib.character[i][1]!=player.group) continue;
								if(i!='list') list.push(i);
							}
							for(var j=0;j<game.players.length;j++){
								list.remove([game.players[j].name]);
								list.remove([game.players[j].name2]);
							}
							trigger.player.chooseButton(ui.create.dialog([list,'character']),true,function(button){
								var i=Math.floor(Math.random()*list.length);	
								return list[i];
							})
          }
							'step 2'
							trigger.player.uninit();
							trigger.player.init(result.buttons[0].link);
							if(get.mode()=='guozhan'){
								trigger.player._group=player.identity;
								trigger.player.setIdentity(player.identity);						
								trigger.player.identity=player.identity;
						    	}

                }
              },
//鬼龙斩月刀
            bxyr_guilongzhanyuedao:{
            mod:{
            suit:function (card,suit){
            return 'heart';
                }
              }
        		},
//枷锁
            bxyr_jiasuo:{
           group:['bxyr_jiasuo2'],
 	      		mod:{
				cardEnabled:function(card,player){
   if(card.name=='tao'||card.name=='jiu') return false;
        				}
	        		}
            },
            _bxyr_jiasuo:{
            enable:"phaseUse",
             filter:function (event,player){
          return player.num('h',{name:'bxyr_jiasuo'})>0;
            },
            filterCard:function (card){
              return card.name=='bxyr_jiasuo';
             },
             check:function (card){
                return 100-ai.get.value(card);
             },
            filterTarget:function (card,player,target){
               return true;
            },
            content:function (){
             target.equip(cards[0]);
             },
             discard:false,
              prepare:function (cards,player,targets){
               player.$give(cards,targets[0],false);
             },
             ai:{
             basic:{
            order:10,
            },
        result:{
					target:function(player,target){
           var equip1=player.get('e','1');
						if(equip1&&equip1.name=='bxyr_jiaoliao') return -20;
						if(target.num('e','1')) return -2;
						return -1
          					}
                 }
               }
             },
            bxyr_jiasuo2:{
      			trigger:{player:'phaseUseBefore'},
	      		filter:function(event,player){
				return player.num('e',{name:'bxyr_jiasuo'})&&player.num('e',{name:'bxyr_jiaoliao'});
			},
      			forced:true,
      			content:function(){
   					trigger.untrigger();
	  				trigger.finish();
              }
             },
//姬神弓
            bxyr_jishengong:{
            trigger:{
            source:"damageBegin",
            },
            direct:true,
            audio:true,
            filter:function (event){
            return event.card&&event.card.name=='sha'&&event.player.num('e');
            },
            content:function (){
            player.gainPlayerCard('e',trigger.player);
              }
         		},
//开天斧
		         bxyr_kaitianfu:{
          	 trigger:{player:'shaMiss'},
            audio:true,
       		   direct:true,
            filter:function(event,player){
            return player.num('h','sha')>0;
            },
            content:function(){
            "step 0"
            var next=player.chooseToDiscard('开天斧：是否弃置一张杀对其造成一点伤害？',{name:'sha'});
next.set('ai',function(card){
					if(ai.get.attitude(trigger.target,player)<0) return 9-ai.get.value(card);
					if(ai.get.attitude(trigger.target,player)=0) return 7-ai.get.value(card);
             return -ai.get.value(card);
            });
            next.logSkill='bxyr_kaitianfu';		
            "step 1"
            if(result.bool){
            trigger.target.damage();			
                 }
	         		 } 
            },
//裂天斧
 		         bxyr_lietianfu:{
               unique:true,
               init:function(player){
               player.storage.bxyr_lietianfu=0;
               },
             enable:'phaseUse',
            audio:true,
            content:function(){
            player.loseHp(1);
            player.storage.bxyr_lietianfu++;
	       		},
       			ai:{
   				basic:{
					order:builder.card.sha.ai.order+0.2,
     				},
				result:{
					player:function(player){
							if(player.hasSkill('zhaxiang')&&player>=2) return 1;
           if(player.storage.bxyr_lietianfu>=2||player.hp<3) return 0;
						if(lib.config.mode=='stone'&&!player.isMin()){
							if(player.getActCount()+1>=player.actcount) return 0;
						}
						var shas=player.get('h','sha');
						if(shas.length>1){
							if(player.num('e','zhuge')) return 1;
							if(player.hasSkill('paoxiao')) return 1;
						}
						var card;
						if(shas.length){
							for(var i=0;i<shas.length;i++){
								if(lib.filter.filterCard(shas[i],player)){
									card=shas[i];break;
								}
							}
						}
						if(card){
							for(var i=0;i<game.players.length;i++){
if(ai.get.attitude(player,game.players[i])<0&&player.canUse(card,game.players[i],true,true)&&!game.players[i].num('e','baiyin')){
if(ai.get.effect(game.players[i],card,player)>0) return 1;
								}
							}
						}
               return 0;
					}
				},
			},
			intro:{
				content:function(storage){
					return '已增加'+storage+'点伤害';
				}
			},
			group:['bxyr_lietianfu2','bxyr_lietianfu3']
		},
            bxyr_lietianfu2:{
            trigger:{source:'damageBegin'},
            filter:function(event){
            return event.card&&(event.card.name=='sha');
            },
            forced:true,
            content:function(){
            trigger.num+=player.storage.bxyr_lietianfu;
           		}
         		},
            bxyr_lietianfu3:{
            trigger:{player:'phaseEnd'},
            frequent:true,
            content:function(){
            player.storage.bxyr_lietianfu=0;
	    			player.update(); 
          			}
             },
//烈焰之弓
            bxyr_lieyanzhigong:{
            trigger:{source:'damageBegin'},
            filter:function(event){
			 return event.card&&event.card.nature=='fire'&&event.card.name=='sha';
            },
            forced:true,
            content:function(){
            trigger.num++;
              }
            },
            bxyr_lieyanzhigong2:{
            trigger:{player:'shaBegin'},
            filter:function(event){
            if(event.card.nature=='fire') return true;
            },
            forced:true,
            content:function(){
            trigger.directHit=true;
              }
            },
//灵越剑
            bxyr_lingyuejian:{
            trigger:{source:'damageBefore'},
            forced:true,
            priority:Infinity,
            content:function(){
            trigger.source=undefined;
              }
            },
//流焰玄火扇
            bxyr_liuyanxuanhuoshan:{
            trigger:{source:'damageBegin'},
            filter:function(event){
				return event.card&&(event.card.name=='sha');
            },
            forced:true,
            content:function(){
            "step 0"
            player.judge(function(card){
            if(get.suit(card)=='heart') return 2;
					return 0;
            });
            "step 1"
            if(result.bool){
             trigger.num++;
         				}
         			}
            },
//蛮骨魔琴
            bxyr_mangumoqin:{
            enable:'phaseUse',
            filterCard:function(card,player){
 return get.suit(card)=='spade'&&card.name=='sha';
            },
            position:'h',
            viewAs:{name:'juedou'},
prompt:'蛮骨魔琴:你可以把一张♠花色的【杀】当做【决斗】使用。',
        check:function(card){return 6-ai.get.value(card)},
            ai:{
	   			order:9
              }
            },
//魔龙斩月
            bxyr_molongzhanyue:{
            mod:{
            selectTarget:function (card,player,range){
            if(card.name=='sha') range[1]=2;
                }
              }
            },
//破魔刀
            bxyr_pomodao:{
            trigger:{player:'juedou'},
            forced:true,
            filter:function(event,player){
				return event.turn!=player;
            },
            content:function(){
            trigger.directHit=true;
            },
            ai:{
	           	result:{
					target:function(card,player,target){
						if(card.name=='juedou'&&target.num('h')>0) return [1,0,0,-1];
	             		}
            		}
	            }
            },
//七星宝刀
            bxyr_qixingbaodao:{
            trigger:{source:'damageBegin'}, 
            filter:function(event){
			 return event.card&&event.card.nature=='fire'&&event.card.name=='sha'; 
            }, 
            check:function(event,player){
				return (ai.get.attitude(player,event.player)<=0);
            },
            content:function(){ 
        player.discardPlayerCard('h',trigger.player,true); 
              }
            },
            bxyr_qixingbaodao2:{
            trigger:{source:'damageBegin'}, 
            filter:function(event,card){
 return event.card&&event.card.nature=='thunder'&&event.card.name=='sha'; 
            }, 
            check:function(event,player){
				return (ai.get.attitude(player,event.player)>0&&event.player.classList.contains('turnedover')||ai.get.attitude(player,event.player)>0&&!event.player.classList.contains('turnedover'));
            },
            content:function(){ 
            var cards=get.cards();
            player.showCards(cards);
            result.cards=cards;
            if(get.suit(cards[0],'suit')=='spade'){
            trigger.player.turnOver();
                }
              },
            },
            bxyr_qixingbaodao3:{
            trigger:{
            player:"shaMiss",
            },
            filter:function(event){			if(event.card.nature=='wind'&&event.card.name=='sha') return true; 
            }, 
            check:function(event,player){
				return (ai.get.attitude(player,event.target)<=0);
            },
            content:function(){ 
              }
            },
//天霜凝碧杖
            bxyr_tianshuangningbizhang:{
            mod:{
            suit:function(card,suit){
					if(suit=='spade') return 'club';
		         		}
		         	}

            },
//铁骨扇
            bxyr_tiegushan:{
            enable:'phaseUse', 
			usable:1,
            filter:function(card,player,target){ 
         	return lib.filter.filterCard({name:'sha'},player); 
            }, 
            filterTarget:function(card,player,target){ 
				return player.canUse({name:'sha'},target); 
            }, 
            content:function(){ 
            "step 0" 
            player.judge(function(card){ 
            if(get.color(card)=='black') return 0.5; 
					return 0; 
            }); 
            "step 1" 
            if(result.bool){
            player.useCard({name:'sha'},target); 
              } 
            }, 
            ai:{
            	basic:{

     					order:3.1
	     			},
     				result:{
					target:function(player,target){
						if(player.hasSkill('jiu')&&!target.num('e','baiyin')){
							if(ai.get.attitude(player,target)>0){
								return -6;
							}
							else{
								return -3;
							}
						}
						return -1.5;
					},
				},
				tag:{
					respond:1,
					respondShan:1,
					damage:function(card){
						if(card.nature=='poison') return;
						return 1;
					},
					natureDamage:function(card){
						if(card.nature) return 1;
					},
					fireDamage:function(card,nature){
						if(card.nature=='fire') return 1;
					},
					thunderDamage:function(card,nature){
						if(card.nature=='thunder') return 1;
					},
					poisonDamage:function(card,nature){
						if(card.nature=='poison') return 1;
            		}
           		}
             }
            },
            bxyr_tiegushan2:{
			trigger:{player:'chooseToRespondBegin'},
			usable:1,
            filter:function(event,player){
				if(event.responded) return false;
				if(!event.filterCard({name:'sha'})) return false;
				return true;
            },
            audio:true,
            check:function(event,player){				if(ai.get.damageEffect(player,event.player,player)>=0) return false;
				return true;
			},
            content:function(){
            "step 0"
            player.judge('bxyr_tiegushan',function(card){return (get.color(card)=='black')?1.5:-0.5});
            "step 1"
            if(result.judge>0){
  					trigger.untrigger();
  					trigger.responded=true;
	  				trigger.result={bool:true,card:{name:'sha'}}
	      			}
	       		},
            ai:{
            effect:{
					target:function(card,player,target,effect){
						if(get.tag(card,'respondSha')) return 0.5;
	            		}
            		}
            	}
            },
//投石车
            bxyr_toushiche:{
		        trigger:{player:'shaBegin'},
		        filter:function(event,player){
			if(player==_status.currentPhase) return true;
		        },
            audio:true,
		        forced:true,
            content:function(){
            player.storage.bxyr_toushiche=2;
            trigger.directHit=true;
	           	 }
             },
            bxyr_toushiche2:{
		        trigger:{player:'phaseDiscardBegin'},
		        filter:function(event,player){
			if(player.storage.bxyr_toushiche>0) return true;
		        },
            audio:true,
		        forced:true,
            content:function(){
            player.storage.bxyr_toushiche--;
	           	 }
             },
            bxyr_toushiche3:{
            mod:{
        cardEnabled:function (card,player){
if(card.name=='sha'&&player.storage.bxyr_toushiche>0) return false;
        },
        cardUsable:function (card,player){
if(card.name=='sha'&&player.storage.bxyr_toushiche>0) return false;
        },
        cardRespondable:function (card,player){
if(card.name=='sha'&&player.storage.bxyr_toushiche>0) return false;
                },
              },
            },
//舞踏扇
		        bxyr_wutashan:{
		        enable:['chooseToUse'],
		        filterCard:{name:'shan'},
		        viewAs:{name:'sha',nature:'thunder'},
		        viewAsFilter:function(player){
						if(!player.num('h','shan')) return false;
					},
		        prompt:'将一张闪当雷杀使用或打出',
		        check:function(){return 1},
		        ai:{
						effect:{							target:function(card,player,target,current){								if(get.tag(card,'respondSha')&&current<0) return 0.6
							}
						},
						respondSha:true,
						skillTagFilter:function(player){
							if(!player.num('h','shan')) return false;
						},
						order:4,
						useful:-1,
						value:-1
		        	}
 		        },
//吟龙琴
		        bxyr_yinlongqin:{
            trigger:{
            source:"damageBefore",
            },
            audio:true,
            priority:15,
            filter:function (event,player){
            return get.type(event.card,'trick')=='trick';
            },
            content:function (){
            player.draw();
              }
        		},
//倚天剑
        		bxyr_yitianjian:{
        		trigger:{
        		player:['useCard','respond']},
        		frequent:true,
        		filter:function (event){
        		return event.card.name=='sha';
        		},
        		content:function (){
        		player.draw();
          		}
        		},
//月食弓
		        bxyr_yueshigong:{
		        trigger:{
		        player:"shaMiss",
		        },
		        priority:-1,
            direct:true,
            audio:true,
		        filter:function (event){
		        return event.target.num('e')>0;
		        },
		        content:function (){
		        player.gainPlayerCard('e',trigger.target);
		          }
		        }, 
//战魂刀
		        bxyr_zhanhundao:{
		        trigger:{
		        source:"damageEnd",
		        },
		        forced:true,
		        audio:true,
		        filter:function (event){
		        return event.card&&event.card.name=='sha'&&event.player.num('h');
		        },
		        content:function (){
		        player.gainPlayerCard('h',trigger.player,true);
		          }
		        },
//镇魂琴
		        bxyr_zhenhunqin:{
		        trigger:{player:'useCardToBefore'},
		        priority:7,
		        filter:function(event,player){
				if(event.card.name=='sha'&&!event.card.nature) return true;
			},
		        audio:true,
		        check:function(event,player){
				var att=ai.get.attitude(player,event.target);
				if(event.target.hasSkillTag('nothunder')){
					return att>0;
				}
				return att<=0;
			},
		        content:function(){
		        trigger.card.nature='thunder';
		          }
		        },
//重弩
		        bxyr_zhongnu:{
		        trigger:{player:'shaBegin'},
		        forced:true,
		        filter:function (event,player){
		        return (event.card.name=='sha'&&get.color(event.card)=='red'&&!event.directHit)
		        },			
		        content:function(){
		        "step 0"
				var next=trigger.target.chooseToRespond({name:'shan'});
		        next.autochoose=lib.filter.autoRespondShan;
		        next.ai=function(card){
					if(trigger.target.num('h','shan')>1){
						return ai.get.unuseful2(card);
					}
					return -1;
				};
				"step 1"
		        if(result.bool==false){
		        trigger.untrigger();
		        trigger.directHit=true;
			        	}
			        }
		        },


				},
                translate:{




		 bxyr_chuanyunjian_bg:'穿',
		 bxyr_chuanyunjian:'穿云剑',
		 bxyr_feilongduofeng:'飞龙夺凤',
		 bxyr_guilongzhanyuedao_bg:'鬼',
		 bxyr_guilongzhanyuedao:'鬼龙斩月刀',
     bxyr_jiasuo_bg:'锁',
     _bxyr_jiasuo:'枷锁',
     bxyr_jiasuo:'枷锁',
     bxyr_jiasuo2:'枷锁',
		 bxyr_jishengong_bg:'姬',
		 bxyr_jishengong:'姬神弓',
		 bxyr_kaitianfu_bg:'開',
		 bxyr_kaitianfu:'开天斧',
		 bxyr_lietianfu_bg:'裂',
		 bxyr_lietianfu:'裂天斧',
		 bxyr_lieyanzhigong_bg:'焰',
		 bxyr_lieyanzhigong:'烈焰之弓',
		 bxyr_lingyuejian_bg:'霊',
		 bxyr_lingyuejian:'灵越剑',
		 bxyr_liuyanxuanhuoshan_bg:'流',
		 bxyr_liuyanxuanhuoshan:'流焰玄火扇',
		 bxyr_mangumoqin_bg:'蛮',
		 bxyr_mangumoqin:'蛮骨魔琴',
		 bxyr_molongzhanyue_bg:'魔',
		 bxyr_molongzhanyue:'魔龙斩月',
		 bxyr_pomodao_bg:'破',
		 bxyr_pomodao:'破魔刀',
     bxyr_qixingbaodao_bg:'寶',
     bxyr_qixingbaodao:'七星宝刀',
     bxyr_qixingbaodao2:'七星宝刀',
     bxyr_qixingbaodao3:'七星宝刀',
     bxyr_tiegushan_bg:'鐡',
     bxyr_tiegushan:'铁骨扇',
     bxyr_tiegushan2:'铁骨扇',
		 bxyr_tianshuangningbizhang_bg:'凝',
		 bxyr_tianshuangningbizhang:'天霜凝碧杖',
		 bxyr_toushiche_bg:'車',
		 bxyr_toushiche:'投石车',
		 bxyr_wutashan_bg:'舞',
		 bxyr_wutashan:'舞踏扇',
		 bxyr_yinlongqin_bg:'吟',
		 bxyr_yinlongqin:'吟龙琴',
     bxyr_yitianjian_bg:'倚',
     bxyr_yitianjian:'倚天剑',
		 bxyr_yueshigong_bg:'食',
		 bxyr_yueshigong:'月食弓',
		 bxyr_zhanhundao_bg:'戰',
		 bxyr_zhanhundao:'战魂刀',
		 bxyr_zhenhunqin_bg:'镇',
		 bxyr_zhenhunqin:'镇魂琴',
		 bxyr_zhongnu_bg:'重',
		 bxyr_zhongnu:'重弩',

//穿云剑
		 bxyr_chuanyunjian_info:'锁定技，当你使用杀造成伤害时防止该伤害，改为令扣减1点体力上限',
//飞龙夺凤	 
		 bxyr_feilongduofeng_info:'当你使用【杀】指定一名角色为目标后，你可令该角色弃置一张牌。当你使用【杀】令其他角色进入濒死状态时，你可以获得其一张手牌',

//鬼龙斩月刀
//		 bxyr_guilongzhanyuedao_info:'◆你的所有牌均可视为红桃花色',
		 bxyr_guilongzhanyuedao_info:'◆锁定技，你的所有牌均视为♥花色',

//枷锁
     bxyr_jiasuo_info:'出牌阶段，你可将其置于任意一名角色的装备区里(弃置原武器)。<br>◆锁定技，你只有濒死阶段才能使用【桃】或【酒】。<br>◆锁定技，若同时装备【脚镣】、【枷锁】，跳过你的出牌阶段',

//姬神弓
		 bxyr_jishengong_info:'◆你使用【杀】对一名造成伤害时，你可以获得对方装备区里的一张牌',

//开天斧
		 bxyr_kaitianfu_info:'◆当你打出的【杀】被闪避后，可在丢弃一张【杀】使目标受到1点伤害',

//裂天斧
		 bxyr_lietianfu_info:'出牌阶段:可主动失去1点血，本回合你使用【杀】所造成的伤害+1',

//烈焰之弓
		 bxyr_lieyanzhigong_info:'◆锁定技，你使用的火杀不可被闪避，且伤害+1',

//灵越剑
		 bxyr_lingyuejian_info:'◆锁定技，你造成的伤害无伤害来源',

//流焰玄火扇
//		 bxyr_liuyanxuanhuoshan_info:'◆当你的【杀】对目标角色造成伤害时进行判定，判定结果为红桃，则伤害+1',
		 bxyr_liuyanxuanhuoshan_info:'◆锁定技，当你的【杀】对目标角色造成伤害时进行判定，判定结果为红桃，则伤害+1',

//蛮骨魔琴
//		 bxyr_mangumoqin_info:'◆你可将黑桃花色的【杀】当做【单挑】使用',
		 bxyr_mangumoqin_info:'◆你可将黑桃花色的【杀】当做【决斗】使用',

//魔龙斩月
//		 bxyr_molongzhanyue_info:'◆锁定技，你的【杀】最多可制定两个目标',
		 bxyr_molongzhanyue_info:'◆你的【杀】最多可指定两个目标',

//破魔刀
//		 bxyr_pomodao_info:'◆你所指定【单挑】的角色均不能出【杀】抵御。',
		 bxyr_pomodao_info:'◆锁定技，你使用【决斗】时目标不能打出【杀】抵御',

//七星宝刀
     bxyr_qixingbaodao_info:'◆1.当你使用【火杀】造成伤害时，你可弃对方一张手牌。<br>2.当你使用【雷杀】造成伤害时，可从牌堆亮出一张牌若为♠，目标武将牌翻面。<br>3.当你使用【风杀】被【闪】抵消时，你可进行判定，若为♦，对目标角色造成一点风属性伤害',

//铁骨扇
//		 bxyr_tiegushan_info:'◆每当你使用或打出一张【杀】时，你可以进行判定，结果为黑色时，视为你使用或打出了一张【杀】。',
		 bxyr_tiegushan_info:'◆每当你需要使用或打出一张【杀】时，你可以进行一次判定，结果为黑色时，视为你使用或打出了一张【杀】',

//天霜凝碧杖
//		 bxyr_tianshuangningbizhang_info:'◆你的黑桃牌均视为草花牌',
		 bxyr_tianshuangningbizhang_info:'◆锁定技，你的黑桃牌均视为草花牌',

//投石车
//     bxyr_toushiche_info:'锁定技，出牌阶段你对角色使用【杀】，则。1.你使用的【杀】不可闪避，2.直至你下个回合的弃牌阶段，如果你没有失去【投石车】，则你不能使用或打出【杀】。（包括【决斗】和【南蛮入侵】）。',
    bxyr_toushiche_info:'锁定技，出牌阶段你对角色使用【杀】，则。<br>1.你使用的【杀】不可闪避<br>2.直至你下个回合的弃牌阶段，如果你没有失去【投石车】，则你不能使用或打出【杀】',

//舞踏扇
		 bxyr_wutashan_info:'◆你可将【闪】可当做雷属性的【杀】使用',

//吟龙琴
		 bxyr_yinlongqin_info:'你使用的非延时锦囊造成伤害时你摸一张牌',

//倚天剑
//		 bxyr_yitianjian_info:'◆任何时候，你每打出一张【杀】，则立即摸1张手牌',
		 bxyr_yitianjian_info:'◆锁定技，你每使用或打出一张【杀】，则立即摸1张牌',

//月食弓
		 bxyr_yueshigong_info:'当你使用的【杀】被【闪】抵消时，你可以获得被杀者装备区里的一张牌',

//战魂刀
//		 bxyr_zhanhundao_info:'锁定技:当你使用【杀】造成伤害后，你立即获得对方一张手牌',
		 bxyr_zhanhundao_info:'◆锁定技，当你使用【杀】造成伤害后，你获得目标一张手牌',

//镇魂琴
		 bxyr_zhenhunqin_info:'◆你可以将你的任一普通【杀】当着雷电伤害的【杀】使用',

//重弩
//		 bxyr_zhongnu_info:'◆你打出的红色【杀】均需要两张【闪】才能闪避',
		 bxyr_zhongnu_info:'◆锁定技，你使用的红色【杀】均需要两张【闪】才能闪避',
              },
				list:[
['heart',3,'bxyr_qixingbaodao'],
['heart',5,'bxyr_jishengong'],
['heart',5,'bxyr_lieyanzhigong','fire'],
['heart',11,'bxyr_liuyanxuanhuoshan'],
['heart',13,'bxyr_pomodao'],
['spade',1,'bxyr_chuanyunjian','fire'],
//['spade',2,'bxyr_feilongduofeng'],
['spade',1,'bxyr_zhanhundao'],
['spade',2,'bxyr_toushiche'],
['spade',4,'bxyr_yueshigong'],
['spade',8,'bxyr_yinlongqin'],
['spade',8,'bxyr_tianshuangningbizhang'],
['club',1,'bxyr_tiegushan'], 
['club',2,'bxyr_jiasuo'], 
['club',3,'bxyr_zhenhunqin','thunder'], 
['club',3,'bxyr_lingyuejian'], 
['club',3,'bxyr_mangumoqin'], 
['club',8,'bxyr_molongzhanyue'], 
['diamond',6,'bxyr_wutashan','thunder'],
['diamond',7,'bxyr_guilongzhanyuedao','fire'],
['diamond',8,'bxyr_yitianjian'],
['diamond',11,'bxyr_kaitianfu'],
['diamond',12,'bxyr_zhongnu'],
['diamond',13,'bxyr_lietianfu'],
				]	
       	 	},'民间武器');		
		}
if(config.minjianzhuangbei){	
       	builder.addPack({
              	card:{	
//百花裙
 					bxyr_baihuaqun:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					onLose:function(){
				  player.draw(2);
			    },
 					skills:['bxyr_baihuaqun'],
 					ai:{
 					basic:{
					equipValue:11
 					    }
 				  	}
 					},
//脚镣
 					bxyr_jiaoliao:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					skills:['bxyr_jiaoliao'],
	        	ai:{
	        	basic:{
	        	order:1,
					equipValue:function(card,player){
       var equip2=player.get('e','2');
  if(equip2&&equip2.name=='bxyr_jiaoliao') return -20;
						return 7;
		 	 	  				}
		  					}
	          	},
	        	},
//留龙玉令
 					bxyr_liulongyuling:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					onLose:function(){
            for(var i=0;i<game.dead.length;i++){
                if(game.dead[i].group==player.group){
 				player.storage.bxyr_liulongyuling++;
               }
            }
 					if(player.hasSkill('jun_huitian')){
 					player.logSkill('jun_huitian');
player.draw(Math.max(player.storage.bxyr_liulongyuling+1,2));
 					}			
 					if(!player.hasSkill('jun_huitian')){
player.draw(Math.max(player.storage.bxyr_liulongyuling,1));
 					}			
				player.storage.bxyr_liulongyuling=0;
 					},
 					onEquip:function(){
				player.storage.bxyr_liulongyuling=0;
 					},
 					skills:['bxyr_liulongyuling'],
 					ai:{
 						basic:{
 						equipValue:7
		 					}
	 					}
 					},
//明光凯
 					bxyr_mingguangkai:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					skills:['bxyr_mingguangkai'],
 					ai:{
 					basic:{
					equipValue:10
		 					}
		 				}
		 			},
//魔王桂冠
 					bxyr_mowangguiguan:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					onLose:function(){
				player.loseHp(3);
			},
 					skills:['bxyr_mowangguiguan'],
 					tag:{
 					loseHp:3,
 					},
 					ai:{
 				order:9.5,
				basic:{
					equipValue:function(card,player){
var equip2=player.get('e','2');
if(equip2&&equip2.name=='bxyr_mowangguiguan') return 20;
						if(player.hp<=1||player.hp>=5) return 15;
						return 0;
		 						}
		 					}
	 					},
 					},
//炮烙
 					bxyr_paoluo:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					skills:['bxyr_paoluo'],
 					ai:{
				  basic:{
					equipValue:7
				 			}
			 			},
	 				},
//七星袍
 					bxyr_qixingpao:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					skills:['bxyr_qixingpao'],
 					ai:{
				  basic:{
					equipValue:7
				 			}

			 			},
	 				},
//圣光白衣
 					bxyr_shengguangbaiyi:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					skills:['bxyr_shengguangbaiyi'],
 					ai:{
				  basic:{
					equipValue:7
	 						} 
		 				}
		 			},
//天机琴
 					bxyr_tianjiqin:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					onLose:function(){
          player.removeSkill('bxyr_tianjiqin2');
          player.removeSkill('bxyr_tianjiqin3');
    			},
 					skills:['bxyr_tianjiqin'],
 					ai:{
				  basic:{
					equipValue:6
	 						} 
		 				}
		 			},
//卧龙四轮车
 					bxyr_wolongsilunche:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					skills:['bxyr_wolongsilunche'],
 					ai:{
 						basic:{
 							equipValue:7
 							},
 						},
 					},
//邪神面具
 					bxyr_xieshenmianju:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					skills:['bxyr_xieshenmianju'],
 					ai:{
				 	 order:9.5,
			  	basic:{
					equipValue:function(card,player){
						if(!player.isTurnedOver()) return 6;
						if(player.isTurnedOver()) return -10;
						return 0;
 					     }
 					    }
 					}, 					
 					},
//玄武护臂
           bxyr_xuanwuhubi:{
			     fullskin:true,
     			type:"equip",
     			subtype:"equip2",
     			onEquip:function(){
            player.gainMaxHp();
    			},
 					onLose:function(){
            player.loseMaxHp();
    			},
       enable:function(card,player){
				return !player.isZhu;
			},
			ai:{
				order:9.5,
				basic:{
					equipValue:function(card,player){
						if(player.hasSkill('zaiqi')||player.hasSkill('yinghun')||player.hasSkill('miji')||player.hasSkill('shangshi')||player.hasSkill('ganlu')||player.hasSkill('quji')||player.hasSkill('xueji')) return 7;
						return 4;
           			}
           		}
           	},
           },
//折戟盾
 					bxyr_zhejidun:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip2",
 					skills:['bxyr_zhejidun'],
 					ai:{
 					basic:{
					equipValue:4
 							},
 						},
 					},
//奔雷
 					bxyr_benlei:{
 					fullskin:true,
 					type:'equip',
 					subtype:'equip3',
 					distance:{globalTo:1},
			          	ai:{
				          	basic:{
				          		equipValue:6
			          	}
		          }						
 					},
//汗血
 					bxyr_hanxue:{
 					fullskin:true,
 					type:'equip',
 					subtype:'equip4',
			    distance:{globalFrom:-1},
			          	ai:{
				          	basic:{
				          		equipValue:5
			          	}
		          }						
 					},
//猴子
 					bxyr_houzi:{
          fullskin:true,
		      type:'equip',
			    subtype:'equip4',
			    skills:['bxyr_houzi'],
			    distance:{globalFrom:-1},
			          	ai:{
				          	basic:{
				          		equipValue:8
			          	}
		          }						
					},
//青囊书
 					bxyr_qingnangshu:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip5",
 					skills:['bxyr_qingnangshu'],
            ai:{
            basic:{
				  	equipValue:7.5
                }
              },
            },
//铜雀赋
 					bxyr_tongquefu:{
 					fullskin:true,
 					type:"equip",
 					subtype:"equip5",
 					skills:['bxyr_tongquefu'],
 					ai:{
 					basic:{
					equipValue:function(card,player){
           var num=0;
						for(var i=0;i<game.players.length;i++){
							if(player!=game.players[i]&&game.players[i].sex=='female'&&player.sex=='male'&&ai.get.attitude(game.players[i],player)<=0||player!=game.players[i]&&game.players[i].sex=='male'&&player.sex=='female'&&ai.get.attitude(game.players[i],player)<=0) num+=2;
				       		}
						for(var i=0;i<game.players.length;i++){
							if(player!=game.players[i]&&game.players[i].sex==player.sex&&ai.get.attitude(game.players[i],player)<=0||player!=game.players[i]&&game.players[i].sex==player.sex&&ai.get.attitude(game.players[i],player)<=0) num--;
				       		}
      return 4+num;
                }
 	  					},
 	  				},
 	    		},

              },
				skill:{			
//百花裙
            bxyr_baihuaqun:{
            trigger:{player:'damageBefore'},
            filter:function (event,player){
				if(event.source&&event.source.num('s','unequip')) return;
				if(event.player.hp==1) return true;
            },

            forced:true,
	      		audio:true,
            content:function(){
            trigger.untrigger();
            trigger.finish();
            },
            ai:{
            nofire:true,
            nothunder:true,
            nodamage:true,
            effect:{
				target:function(card,player,target,current){
						if(get.tag(card,'damage')&&target.hp==1) return 'zerotarget';
					}
				},
			},
 		},
//留龙玉令
            bxyr_liulongyuling:{
            trigger:{player:'damageBefore'},
            filter:function (event,player){
				if(event.source&&event.source.num('s','unequip')) return;
				if(event.player.hp==1&&!event.nature) return true;
            },
            forced:true,
            priority:-10,
            content:function(){
            trigger.num--;
            },
 			ai:{
				effect:{
				target:function(card,player,target,current){
          if(!get.tag(card,'natureDamage')&&target.hp==1) return [0,0];
					}
				},
			},
    },
//脚镣
            bxyr_jiaoliao:{
            group:['bxyr_jiaoliao2'],
	      		mod:{
				cardEnabled:function(card,player){
   if(card.name=='tao'||card.name=='jiu') return false;
        				}
	        		}
            },
            bxyr_jiaoliao2:{
      			trigger:{player:'phaseUseBefore'},
	      		filter:function(event,player){
				return player.num('e',{name:'bxyr_jiasuo'})&&player.num('e',{name:'bxyr_jiaoliao'});
			},
      			forced:true,
      			content:function(){
   					trigger.untrigger();
	  				trigger.finish();
              }
             },
            _bxyr_jiaoliao:{
            enable:"phaseUse",
             filter:function (event,player){
          return player.num('h',{name:'bxyr_jiaoliao'})>0;
            },
            filterCard:function (card){
              return card.name=='bxyr_jiaoliao';
             },
             check:function (card){
                return 100-ai.get.value(card);
             },
            filterTarget:function (card,player,target){
               return !target.get('e','2');
            },
            content:function (){
             target.equip(cards[0]);
             },
             discard:false,
              prepare:function (cards,player,targets){
               player.$give(cards,targets[0],false);
             },
             ai:{
             basic:{
            order:10,
            },
        result:{
					target:function(player,target){
           var equip1=player.get('e','1');
						if(equip1&&equip1.name=='bxyr_jiasuo') return -20;
						return -1
          					}
                 }
               }
             },
           _bxyr_jiaoliao2:{
 	               },
//明光凯
            bxyr_mingguangkai:{
            trigger:{
            global:"phaseBegin",
            },
            content:function (){
            "step 0"
            player.judge(function(card){
if(get.suit(card)=='heart'&&player.hp<player.maxHp) return 2;
					return 0;
				});
            "step 1"
            if(result.bool){
	     			 player.recover();
			          	}
           			}
              },
//魔王桂冠
            bxyr_mowangguiguan:{
            trigger:{player:'damageBefore'},
            forced:true,
            content:function(){
            trigger.untrigger();
            trigger.finish();
            },
            ai:{
            nofire:true,
            nothunder:true,
            nodamage:true,
            effect:{
				target:function(card,player,target,current){
						if(get.tag(card,'damage')) return [0,0];
if(player==target&&get.subtype(card)=='equip2'){
							if(ai.get.equipValue(card)<=15) return 0;
                    }
					        }
				        },
              },
            },
//炮烙
           bxyr_paoluo:{
            trigger:{
            player:"damageBefore",
            },
	      		audio:true,
			  		direct:true,
            content:function (){
 	    			"step 0"
				player.chooseTarget('是否发动【炮烙】？',function(card,player,target){
					return get.distance(player,target,'attack')<=1;
				}).ai=function(target){
					var player=_status.event.player;
					if(ai.get.attitude(_status.event.player,target)>0) return 0;
if(ai.get.attitude(_status.event.player,target)<0&&target.num('h')<=5) return 7-target.num('h');
						return 1;
					}
    				"step 1"
              if(result.bool==false){
               event.finish();
               return;
               }					 
              var target=result.targets[0];
               event.target=target;
               player.line(target,'green');
		    			player.logSkill('bxyr_paoluo',target);
               target.chooseCard('h','【炮烙】<br><br><div class="text center">交给'+get.translation(player)+'一张手牌，或失去一点体力。',function(card,player,target){
				return true;
				}).set('ai',function(card){					if(ai.get.attitude(_status.event.player,_status.event.getParent().player)>0){
						return 11-ai.get.value(card);
					}
if(ai.get.attitude(_status.event.player,_status.event.getParent().player)<=0){
						return 9-ai.get.value(card);
                 }
               });
               'step 2'
               var target=event.target;
               if(result.bool){
               player.gain(result.cards);
               target.$give(result.cards,player);
                 }
               else{
               target.loseHp();
               }
             }
            },
//七星袍
            bxyr_qixingpao:{
            trigger:{
            player:"damageBefore",
            },
	      		audio:true,
            forced:true,
            filter:function (event){
return event.nature=='thunder'||event.nature=='fire'||event.nature=='poison';
            },
            content:function (){
            trigger.untrigger();
            trigger.finish();
            game.log(player,'免疫此伤害');
            },
			ai:{
				nofire:true,
				nothunder:true,
				nopoison:true,
				effect:{
					target:function(card,player,target,current){
						if(get.tag(card,'natureDamage')) return 'zerotarget';
						if(card.name=='tiesuo'){
							return [0,0];
						}
					}
				}
			}
		},
//圣光白衣
            bxyr_shengguangbaiyi:{
            trigger:{
            target:"shaBefore",
            },
	      		audio:true,
            forced:true,
            filter:function (event,player){
            return (event.card.name=='sha'&&get.color(event.card)=='red'&&!event.parent.player.num('s','unequip'))
},
            content:function (){
            trigger.untrigger();
            trigger.finish();
            },
            ai:{
				effect:{
					target:function(card,player){
						var equip1=player.get('e','1');
						if(equip1&&equip1.name=='qinggang') return 1;
						if(player.num('s','unequip')) return;						if(card.name=='sha'&&get.color(card)=='red') return 'zerotarget';

					}
				}
			},
            group:['bxyr_shengguangbaiyi2']
 		},
            bxyr_shengguangbaiyi2:{
            mod:{
            maxHandcard:function(player,num){
            return num+=2;
            }
          }
        },
//天机琴
            bxyr_tianjiqin:{
            trigger:{target:'shaBegin'},
            forced:true,
            silent:true,
            audio:false,
            popup:false,
            content:function(){
            player.addTempSkill('bxyr_tianjiqin2');
            player.addTempSkill('bxyr_tianjiqin3');
              }
            },
            bxyr_tianjiqin2:{
            trigger:{player:'damageBegin'},
            forced:true,
            popup:false,
			filter:function(event){
				return event.card&&(event.card.name=='sha');
			},
            content:function(){
       			player.removeSkill('bxyr_tianjiqin2');
	       		player.removeSkill('bxyr_tianjiqin3');
            	}
            },
            bxyr_tianjiqin3:{
            trigger:{target:'shaEnd'},
            forced:true,
            filter:function (event,player){
            return player.hasSkill('bxyr_tianjiqin2');
            },
            content:function(){				
             player.recover(); 
             player.removeSkill('bxyr_tianjiqin2');
             player.removeSkill('bxyr_tianjiqin3');
              }
            },
//卧龙四轮车
            bxyr_wolongsilunche:{
            trigger:{
            target:"useCardToBefore",
            },
            forced:true,
            priority:15,
            filter:function (event,player){
return (get.type(event.card)=='trick'&&get.color(event.card)=='black');
             },
            content:function (){
            game.log(player,'发动了卧龙四轮车，',trigger.card,'对',trigger.target,'失效');
            trigger.untrigger();
            trigger.finish();
            },
            ai:{
           effect:{
        target:function (card,player,target,current){
   if(get.type(card)=='trick'&&get.color(card)=='black')             return 'zeroplayertarget';
                  },
                },
              },
            },
//邪神面具
            bxyr_xieshenmianju:{
            trigger:{player:'turnOverBefore'},
            forced:true,
            audio:true,
  					content:function(){
						trigger.untrigger();
						trigger.finish();
					},
			ai:{
				noturnOver:true,
				effect:{
					target:function(card,player,target,current){
						if(get.tag(card,'turnOver')) return [0,0];
					}
				}
			},
					group:['bxyr_xieshenmianju2'],
				},
            bxyr_xieshenmianju2:{
            trigger:{player:'damageBegin'},
            forced:true,
            audio:true,
            filter:function(event,player){
            if(event.num<=1) return false;
            if(event.parent.player.num('s','unequip')) return false;
				return true;
			},
            priority:-10,
            content:function(){
            trigger.num--;
             }
           },
//玄武护臂
           _bxyr_xuanwuhubi:{
	     		enable:'phaseUse',
 					filter:function(event,player){
 						return player.isZhu&&player.num('h',{name:'bxyr_xuanwuhubi'});
 					},
       		content:function(){
	        	'step 0'
				var next=player.chooseToRespond({name:'bxyr_xuanwuhubi'},'玄武护臂：是否打出一张玄武护臂'+'令'+get.translation(player)+'回复一点体力。');
				next.set('ai',function(card){
           return ai.get.recoverEffect(player);
	        	});	
	        	'step 1'
	        	if(result.bool){
		     		player.recover();
	          	}
	       		},
               ai:{
               	result:{
       		player:function(player){
						return ai.get.recoverEffect(player);
           					}
                 	},
	             	order:2.5
             }
           },
//折戟盾
           bxyr_zhejidun:{
           trigger:{
           player:"damageEnd",
           },
           filter:function (event,player){
           return (event.source!=undefined);
           },
           check:function(event,player){
				return (ai.get.attitude(player,event.source)<=0);
           },
           content:function(){
trigger.source.discard(trigger.source.get('e',{subtype:'equip1'}));
           },
           	ai:{
				result:{
					target:function(card,player,target){
						if(player.skills.contains('jueqing')) return [1,-1];
if(player.num('e',{subtype:'equip1'})>0) return [1,0,0,-1.5];
             		}
           		}
           	}
          },
//猴子
            bxyr_houzi:{
            trigger:{
            global:"useCardToBegin",
            },
	      		audio:true,
 					filter:function(event,player){
							var card=player.get('e','4');
							if(card){
								var name=card.name;								if(event.name=='tao'&&get.itemtype(event.cards)=='cards'&&get.position(event.cards[0])=='d'&&event.player!=player&&name&&name.indexOf('bxyr_houzi')!=-1) return true;
							}
							return false;
						},		
			check:function(event,player){
				return ai.get.attitude(player,event.player)<=0;
			},                       
            content:function (){
            "step 0"
 	          trigger.untrigger();
            trigger.finish();
           "step 1"
           player.discard(player.get('e','4'));
           "step 2"
             player.gain(trigger.cards);
            player.$gain2(trigger.cards);
               } 
             },
//青囊书
            bxyr_qingnangshu:{
            trigger:{player:'phaseBegin'},
            forced:true,
            content:function(){
            player.recover();
              }
            },
//铜雀赋
            bxyr_tongquefu:{
            trigger:{
            target:"shaBefore",
            },
            forced:true,
			filter:function(event,player){	if(event.target.sex=='male'&&event.player.sex=='female') return true;
if(event.target.sex=='female'&&event.player.sex=='male') return true;				return false;
            },
            content:function (){
            trigger.untrigger();
            trigger.finish();
            },
            ai:{
            effect:{
target:function (card,player,target,current){
if(target.sex=='male'&&player.sex=='female'&&card.name=='sha'||target.sex!='male'&&player.sex!='female'&&card.name=='sha') return 'zeroplayertarget';
                  },
                },
              },
            },





				},
                translate:{
 
bxyr_baihuaqun_bg:'裙',
bxyr_baihuaqun:'百花裙',
bxyr_jiaoliao_bg:'镣',
_bxyr_jiaoliao:'脚镣',
bxyr_jiaoliao:'脚镣',
bxyr_jiaoliao2:'脚镣',
bxyr_liulongyuling_bg:'留',
bxyr_liulongyuling:'留龙玉令',
bxyr_mingguangkai_bg:'光',
bxyr_mingguangkai:'明光凯',
bxyr_mowangguiguan_bg:'冠',
bxyr_mowangguiguan:'魔王桂冠',
bxyr_paoluo_bg:'炮',
bxyr_paoluo:'炮烙',
bxyr_qixingpao_bg:'袍',
bxyr_qixingpao:'七星袍',
bxyr_shengguangbaiyi_bg:'圣',
bxyr_shengguangbaiyi:'圣光白衣',
bxyr_tianjiqin_bg:'幾',
bxyr_tianjiqin:'天机琴',
bxyr_tianjiqin3:'天机琴',
bxyr_wolongsilunche_bg:'卧',
bxyr_wolongsilunche:'卧龙四轮车',
bxyr_xieshenmianju_bg:'邪',
bxyr_xieshenmianju:'邪神面具',
bxyr_xuanwuhubi_bg:'玄',
bxyr_xuanwuhubi:'玄武护臂',
_bxyr_xuanwuhubi:'玄武护臂',
bxyr_zhejidun_bg:'折',
bxyr_zhejidun:'折戟盾',
bxyr_benlei_bg:'+马',
bxyr_benlei:'奔雷',
bxyr_hanxue_bg:'-马',
bxyr_hanxue:'汗血',
bxyr_houzi_bg:'猴',
bxyr_houzi:'猴子',
bxyr_qingnangshu_bg:'囊',
bxyr_qingnangshu:'青囊书',
bxyr_tongquefu_bg:'赋',
bxyr_tongquefu:'铜雀赋',

//百花裙
		 bxyr_baihuaqun_info:'◆锁定技，当你体力等于一时，任何伤害对你无效。当你失去装备区的【百花裙】时，你可以摸两张牌',

//脚镣 /*<br>◆锁定技，当你需要使用或打出【闪】时，需要连续打出或使用两张【闪】。*/
    bxyr_jiaoliao_info:'出牌阶段，你可以将其置于任意一名装备区没有防具的角色的装备区里。<br>当装备区里的【脚镣】被其他防具替换时，拥有者可以将其收为手牌。<br>◆锁定技，若你同时装备【脚镣】，【枷锁】，跳过你的出牌阶段',

//留龙玉令
    bxyr_liulongyuling_info:'◆锁定技，你受到非属性伤害时若你的体力值为1，此伤害-1。<br>◆锁定技，当你失去装备区的【留龙玉令】时你摸x张牌（x为与你势力相同的已死亡角色数且至少为一）',

//明光凯
		 bxyr_mingguangkai_info:'◆每个回合摸牌阶段前，你都可以进行一次判定，若为红桃，恢复一点血',

//魔王桂冠
		 bxyr_mowangguiguan_info:'锁定技，防止你受到的任何伤害，当你失去装备区的该牌时，你失去3点体力',

//炮烙
//     bxyr_paoluo_info:'◆每当你受到伤害时，可选择攻击范围内的一名角色给你一张手牌，否则该角色减少一点体力',
     bxyr_paoluo_info:'◆每当你受到伤害时，可选择攻击范围内的一名角色令其选择是否交给你一张手牌，若不给该角色失去一点体力',

//七星袍
		 bxyr_qixingpao_info:'◆锁定技，所有属性伤害对你无效',

//圣光白衣
		 bxyr_shengguangbaiyi_info:'◆锁定技，红色【杀】对你无效，你的手牌上限+2',

//天机琴
//     bxyr_tianjiqin_info:'当以你为目标的一张杀没有对你造成伤害后，你立即回复一点体力',
     bxyr_tianjiqin_info:'◆锁定技，当以你为目标的一张【杀】没有对你造成伤害后，你立即回复一点体力',

//卧龙四轮车
//		 bxyr_wolongsilunche_info:'◆黑色的锦囊对你无效',
		 bxyr_wolongsilunche_info:'◆锁定技，黑色的锦囊对你无效',

//邪神面具 
		 bxyr_xieshenmianju_info:'◆锁定技，你每次受到大于等于2点伤害时，该伤害-1<br>◆锁定技，武将牌不能被翻面',

//玄武护臂
//		 bxyr_xuanwuhubi_info:'血量上限+1，主公无法装备，但可以打出此牌，恢复1点血（不能进行濒死回复）',
		 bxyr_xuanwuhubi_info:'装备时体力上限+1，主公无法装备，但可以出牌阶段打出此牌，恢复1点体力',

//折戟盾
		 bxyr_zhejidun_info:'其他角色对你造成伤害后，可以让对方弃掉所装备的武器',

//奔雷
     bxyr_benlei_info:'其他角色计算与你的距离时，始终+1',

//汗血
     bxyr_hanxue_info:'你计算与其他角色的距离，始终-1',

//猴子
      bxyr_houzi_info:'你计算与其他角色的距离，始终-1 装备后，当场上有其他角色使用【桃】时，你可以弃掉【猴子】，阻止【桃】的结算并将其收为手牌。',

//青囊书
//		 bxyr_qingnangshu_info:'◆佩戴后，每回合开始时恢复一点体力',
		 bxyr_qingnangshu_info:'◆锁定技，佩戴后，每回合开始时恢复一点体力',

//铜雀赋
		 bxyr_tongquefu_info:'◆锁定技，佩戴后，异性角色对你使用的【杀】无效',

              },
				list:[
['heart',8,'bxyr_qingnangshu','poison'],
['spade',1,'bxyr_qixingpao'],
['spade',2,'bxyr_baihuaqun'],
['spade',4,'bxyr_paoluo'],
['spade',8,'bxyr_mowangguiguan'],
['club',1,'bxyr_liulongyuling'],
['club',5,'bxyr_xuanwuhubi'],
['club',8,'bxyr_wolongsilunche'],
['club',8,'bxyr_benlei','thunder'],
['club',13,'bxyr_zhejidun'],
['club',11,'bxyr_jiaoliao'],
['diamond',4,'bxyr_shengguangbaiyi'],
['diamond',4,'bxyr_hanxue','fire'],
['diamond',5,'bxyr_houzi'],
['diamond',6,'bxyr_xieshenmianju'],
['diamond',7,'bxyr_tongquefu'],
['diamond',8,'bxyr_mingguangkai'],
['diamond',12,'bxyr_tianjiqin'],
				]	
       	 	},'民间装备');
		}
if(config.changjing){	
       	builder.addPack({
              	card:{	

//长坂坡
	        	bxyr_changbanpo:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	      		chongzhu:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_changbanpo.jpg');
          lib.config.image_background='bxyr_changbanpo';
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                         },
             result:{
	        	target:function (player,target){
            if(target.group=='shu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='shu')	return 1;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//长坂桥
	        	bxyr_changbanqiao:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	      		chongzhu:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_changbanqiao.jpg');
     lib.config.image_background='bxyr_changbanqiao';
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                         },
             result:{
	        	target:function (player,target){
            if(target.group=='shu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='shu')	return 1;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//赤壁
	        	bxyr_chibi:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	      		chongzhu:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_chibi.jpg');
          lib.config.image_background='bxyr_chibi';
if((target.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='wei')&&!target.isLinked()){
                  target.link();
				  		}     
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                         },
              result:{
	        	target:function (player,target){
            if(target.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='wei')	return -1;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//凤仪亭
	        	bxyr_fengyiting:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	      		chongzhu:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_fengyiting.jpg');
          lib.config.image_background='bxyr_fengyiting';
 if((target.group=='qun'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='qun')&&target.sex=='female'){
                target.recover();
 				  		}     
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                         },
              result:{
	        	target:function (player,target){
            if(target.group=='qun'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='qun')	return 1;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//华容道
	        	bxyr_huarongdao:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		chongzhu:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_huarongdao.jpg');
          lib.config.image_background='bxyr_huarongdao';
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                        },
             result:{
	        	target:function (player,target){
            if(target.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='wei')	return 2;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//巨鹿
	        	bxyr_julu:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		chongzhu:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_julu.jpg');
          lib.config.image_background='bxyr_julu';
if((target.group=='qun'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='qun')){
                  target.draw(2);
                }
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                        },
             result:{
	        	target:function (player,target){
            if(target.group=='qun'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='qun')	return 2;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//上方谷
	        	bxyr_shangfanggu:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		chongzhu:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_shangfanggu.jpg');
          lib.config.image_background='bxyr_shangfanggu';
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                        },
             result:{
	        	target:function (player,target){
            if(target.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='wei')	return 1;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//檀溪
	        	bxyr_tanxi:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		chongzhu:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_tanxi.jpg');
          lib.config.image_background='bxyr_tanxi';
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                        },
             result:{
	        	target:function (player,target){
            if(target.group=='shu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='shu')	return 1;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//铜雀台
	        	bxyr_tongquetai:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		chongzhu:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_tongquetai.jpg');
          lib.config.image_background='bxyr_tongquetai';
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                        },
             result:{
	        	target:function (player,target){
            if(target.group=='wu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='wu')	return -1;
	        	return 0;
	        	   	},
              },
		     		}
	     		},
//逍遥津
	        	bxyr_xiaoyaojin:{
	        	audio:true,
	        	fullskin:true,
	        	type:'changjing',
	        	enable:true,
	      		chongzhu:true,
	      		selectTarget:-1,
	      		filterTarget:true,
	        	content:function(){
ui.background.setBackgroundImage('extension/卡牌扩展/members/import_8a1e968824/bxyr_xiaoyaojin.jpg');
          lib.config.image_background='bxyr_xiaoyaojin';
	        	},
	        	ai:{
            basic:{
            order:10,
            value:4,
            useful:1,
                        },
             result:{
	        	target:function (player,target){
            if(target.group=='wu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='wu')	return -1;
	        	return 0;
	        	   	},
              },
		     		}
	     		},




             },
				skill:{		
	
//长坂桥
           _bxyr_changbanqiao:{
			      mod:{
	      			globalFrom:function(from,to,distance){				if(lib.config.image_background=='bxyr_changbanqiao'&&(from.group=='wei'&&to.group=='shu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&from.identity=='wei'&&to.identity=='shu'))	return distance+1;
									},
	      				}
 		      		},
//长坂坡
           _bxyr_changbanpo:{
     			trigger:{player:'useCard'},
	     		forced:true,
					popup:false,
	        priority:10,
		     	filter:function(event,player){
     if(lib.config.image_background!='bxyr_changbanpo')	return false;
		     		return event.card.name=='sha'&&(player.group=='shu'&&event.targets&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&player.identity=='shu'&&event.targets);
	 	     	},
	     		content:function(){
       for(var i=0;i<trigger.targets.length;i++){
            if(trigger.targets[i].group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&trigger.targets[i].identity=='wei'){    
		     		player.addTempSkill('unequip','shaAfter');
            }
           }       
	     		},
			      mod:{
       targetEnabled:function(card,player,target,now){
if(lib.config.image_background=='bxyr_changbanpo'&&(target.group=='wu'&&player.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&target.identity=='wu'&&player.identity=='wei')){
						if(card.name=='wanjian') return false;
	    		  				}
	      					}
	      				}
 		      		},
//赤壁
            _bxyr_chibi:{
					  trigger:{source:'damageBefore'},
						forced:true,
						popup:false,
	          filter:function(event,player){
     if(lib.config.image_background!='bxyr_chibi')	return false;
				return (player.group=='wu'&&event.player.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&player.identity=='wu'&&event.player.identity=='wei')&&event.card&&get.color(event.card)=='red';
		             	},
								content:function(){
									trigger.nature='fire';
								}
		      		},
//凤仪亭
           _bxyr_fengyiting:{
					  trigger:{source:'damageBegin'},
						forced:true,
						popup:false,
	          filter:function(event,player){
     if(lib.config.image_background!='bxyr_fengyiting')	return false;
				return (player.group=='qun'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&player.identity=='qun')&&event.card&&event.card.name=='juedou'&&player!=event.player;
		             	},
								content:function(){
									trigger.num++;
								}
 		      		},
//华容道
           _bxyr_huarongdao:{
			      mod:{
       targetEnabled:function(card,player,target,now){
if(lib.config.image_background=='bxyr_huarongdao'&&(player.group=='shu'&&target.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&player.identity=='shu'&&target.identity=='wei')&&(target.hp<player.hp||target.hp==1)){
						if(card.name=='sha'||card.name=='juedou') return false;
	    		  				}
	      					}
	      				}
 		      		},
//巨鹿
           _bxyr_julu:{
     			enable:['chooseToRespond'],
	     		filter:function(event,player){
     				return lib.config.image_background=='bxyr_julu'&&(player.group=='qun'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&player.identity=='qun');
     			},
	     		filterCard:function(card){
     				return get.suit(card)=='heart';
     			},
     			viewAs:{name:'shan'},
     			viewAsFilter:function(player){
     				if(!player.num('h',{suit:'heart'})) return false;
	     		},
	     		prompt:'将一张红桃牌当闪打出',
     			check:function(){return 1},
     			ai:{
     				respondShan:true,
     				skillTagFilter:function(player){
	     				if(!player.num('h',{suit:'heart'})) return false;
	     			},
     				result:{
		     			target:function(card,player,target,current){
	     					if(get.tag(card,'respondShan')&&current<0) return 0.6
     					}
     				}
     			}
     		},
//上方谷
           _bxyr_shangfanggu:{
            trigger:{source:'damageBefore'},
						forced:true,
						popup:false,
 		    		priority:-1,
	          filter:function(event,player){
     if(lib.config.image_background!='bxyr_shangfanggu')	return false;
				return (player.group=='shu'&&event.player.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&player.identity=='shu'&&event.player.identity=='wei')&&event.nature=='fire';
		             	},
            content:function(){
            "step 0"
            trigger.player.judge(function(card){
            if(get.color(card)=='red') return 2;
            if(get.color(card)=='black') return -2;
					return 0;
            });
            "step 1"
            if(result.color=='red'){
             trigger.num++;
          				}
            if(result.color=='black'){
	    			trigger.untrigger();
	    			trigger.finish();
          				}
          			}
 		      		},
           _bxyr_shangfanggu2:{
					  trigger:{source:'damageBefore'},
						forced:true,
						popup:false,
	          filter:function(event,player){
     if(lib.config.image_background!='bxyr_shangfanggu')	return false;
				return (player.group=='shu'&&event.player.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&player.identity=='shu'&&event.player.identity=='wei')&&event.card&&get.color(event.card)=='red';
		             	},
								content:function(){
									trigger.nature='fire';
								}
 		      		},
//檀溪
           _bxyr_tanxi:{
			      mod:{
	      			globalFrom:function(from,to,distance){				if(lib.config.image_background=='bxyr_tanxi'&&(from.group=='qun'&&to.group=='shu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&from.identity=='qun'&&to.identity=='shu'))	return distance+1;
				},
       targetEnabled:function(card,player,target,now){
if(lib.config.image_background=='bxyr_tanxi'&&target.num('e',{name:'dilu'})){
						if(card.name=='sha') return false;
	    		  				}
	      					}
	      				}
 		      		},
//铜雀台
           _bxyr_tongquetai:{
	     		trigger:{player:'shaBegin'},
     			forced:true,
					popup:false,
	     		filter:function(event,player){
	     			return lib.config.image_background=='bxyr_tongquetai'&&!event.directHit&&event.target.sex=='female'&&(event.target.group=='wu'&&player.group=='wei'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&event.target.identity=='wu'&&player.identity=='wei');
	     		},
		     	content:function(){
	     			"step 0"
				var next=trigger.target.chooseToRespond({name:'shan'});
		     		next.autochoose=lib.filter.autoRespondShan;
		     		next.ai=function(card){
		     			if(trigger.target.num('h','shan')>1){
	     					return ai.get.unuseful2(card);
		     			}
	     				return -1;
	     			};
	     			"step 1"
	     			if(result.bool==false){
  					trigger.untrigger();
		  			trigger.directHit=true;
	   				}
			   	},
		     	mod:{
	     		suit:function(card,suit){
if(lib.config.image_background=='bxyr_tongquetai'&&(_status.event.player.group=='wu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&_status.event.player.identity=='wu')) return 'club';
		      				}
	      				}
 		      		},
//逍遥津
            _bxyr_xiaoyaojin:{
					  trigger:{source:'damageBegin'},
						forced:true,
						popup:false,
	          filter:function(event,player){
     if(lib.config.image_background!='bxyr_xiaoyaojin')	return false;
				return (player.group=='wei'&&event.player.group=='wu'&&lib.config.mode!='guozhan'||lib.config.mode=='guozhan'&&player.identity=='wei'&&event.player.identity=='wu')&&event.card&&event.card.name=='sha'&&player.num('h')<event.player.num('h');
		             	},
								content:function(){
								trigger.num++;
								}
		      		},




 

				},
                translate:{

changjing:'场景',

bxyr_changbanqiao_bg:'桥',
bxyr_changbanpo_bg:'坡',
bxyr_chibi_bg:'壁',
bxyr_fengyiting_bg:'亭',
bxyr_huarongdao_bg:'道',
bxyr_julu_bg:'鹿',
bxyr_shangfanggu_bg:'谷',
bxyr_tanxi_bg:'檀',
bxyr_tongquetai_bg:'台',
bxyr_xiaoyaojin_bg:'津',

bxyr_changbanqiao:'长坂桥',
bxyr_changbanpo:'长坂坡',
bxyr_chibi:'赤壁',
bxyr_fengyiting:'凤仪亭',
bxyr_huarongdao:'华容道',
bxyr_julu:'巨鹿',
bxyr_shangfanggu:'上方谷',
bxyr_tanxi:'檀溪',
bxyr_tongquetai:'铜雀台',
bxyr_xiaoyaojin:'逍遥津',



_bxyr_julu:'巨鹿',
_bxyr_shangfanggu:'上方谷',


//长坂桥
		 bxyr_changbanqiao_info:'<span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，场上魏势力计算与蜀势力角色的距离+1',
//长坂坡
		 bxyr_changbanpo_info:'<span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，场上蜀国势力的角色，对魏势力的角色使用【杀】时，无视防具<br><span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，魏国势力的角色使用【万箭齐发】，不能指定蜀势力角色作为目标',
//赤壁
		 bxyr_chibi_info:'横置所有未横置的魏势力角色的武将牌<br><span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，吴势力角色使用红色牌对魏势力角色造成的伤害均视为火焰伤害',
//凤仪亭
		 bxyr_fengyiting_info:'所有群势力女性角色回复1点体力<br><span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，群势力角色使用【决斗】对其他角色造成伤害时，该伤害+1',
//华容道
		 bxyr_huarongdao_info:'<span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，蜀势力角色不能对体力值小于自己或体力值为1的魏势力角色使用【杀】和【决斗】',
//巨鹿
		 bxyr_julu_info:'群势力角色各摸两张牌<br><span class="bluetext" style="color:#FF6633">场景技'+'</span>，群势力角色可以将红桃手牌当作【闪】使用或打出',
//上方谷
		 bxyr_shangfanggu_info:'<span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，当蜀势力角色对魏势力角色造成火焰伤害时，该魏势力角色须进行一次判定，若结果为红色，则该伤害+1；若结果为黑色，防止该伤害<br><span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，蜀势力角色使用红色牌对魏势力角色造成的伤害均视为火焰伤害',
//檀溪
		 bxyr_tanxi_info:'<span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，场上群势力计算与蜀势力角色的距离+1<br><span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，装备着【的卢】的角色不能成为【杀】的目标',
//铜雀台
		 bxyr_tongquetai_info:'<span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，吴势力角色的所有牌均视为梅花牌<br><span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，当魏势力角色使用杀指定一名吴势力女性角色为目标后，该角色需要依次使用两张【闪】才能抵消',
//逍遥津
		 bxyr_xiaoyaojin_info:'<span class="bluetext" style="color:#FF6633">场景技'+'</span>，锁定技，一名魏势力角色使用【杀】对吴势力角色造成伤害时，若其手牌数小于该吴势力角色，此伤害+1',



              },
				list:[
['heart',2,'bxyr_tanxi'],
['heart',4,'bxyr_julu'],
['heart',5,'bxyr_chibi','fire'],
['heart',7,'bxyr_changbanpo'],
['heart',9,'bxyr_shangfanggu'],
['heart',12,'bxyr_tongquetai'],
['heart',12,'bxyr_fengyiting'],
['spade',5,'bxyr_chibi','fire'],
['spade',10,'bxyr_changbanqiao'],
['spade',11,'bxyr_tongquetai'],
['spade',12,'bxyr_huarongdao'],
['spade',13,'bxyr_julu'],
['spade',13,'bxyr_tanxi'],
['club',1,'bxyr_shangfanggu'],
['club',4,'bxyr_xiaoyaojin'],
['club',5,'bxyr_fengyiting'],
['club',7,'bxyr_changbanpo'],
['diamond',5,'bxyr_changbanqiao'],
['diamond',6,'bxyr_huarongdao'],
['diamond',9,'bxyr_xiaoyaojin'],

				]	
       	 	},'场景卡牌');		
		}
} };
}
