// Generated from 卡牌扩展.zip/(卡牌)飞龙夺凤装备.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {
        feilong:{
            name:'飞龙夺凤',
            init:'1',
        }
    }, build(config, builder) {
builder.addPack({});
builder.addPack({});
builder.card.feilong={
            fullskin:true,
			type:'equip',
			subtype:'equip1',
			image:'ext:卡牌扩展/members/import_f50243b7d4/feilong.png',
			distance:{attackFrom:-1},
			ai:{
				basic:{
					equipValue:2
				}
			},
			skills:['feilong_skill']
        }
builder.skill.feilong_skill={
			trigger:{player:'shaBegin'},
			priority:5,
			audio:'cixiong_skill',
			filter:function(event,player){
				return event.target.num('he');
			},
			check:function(event,player){
				return ai.get.attitude(player,event.target)<0;
			},
			content:function(){
				trigger.target.chooseToDiscard(true)
			},
			group:['feilong_skill2']
		}
builder.skill.feilong_skill2={
			trigger:{source:'damageAfter'},
			priority:-1,
			audio:'cixiong_skill',
			filter:function(event,player){
				if(!event.player.isDead()) return false;
				if(event.card&&event.card.name!='sha') return false;
				if(player.identity=='ye') return false;
				if(player.identity=='unknown') return false;
				var wei=get.population('wei');
				var shu=get.population('shu');
				var wu=get.population('wu');
				var qun=get.population('qun');
				if(get.population(player.group)!=Math.min(wei,shu,wu,qun)&&Math.min(wei,shu,wu,qun)!=0) return false;
				return event.player.identity!=player.identity;
			},
			content:function(){
				'step 0'
				trigger.player.revive();
				var list=[];
				for(var i in lib.character){
					if(lib.character[i].mode&&lib.character[i].mode.contains(lib.config.mode)==false) continue;
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
				'step 1'
				trigger.player.uninit();
				trigger.player.init(result.buttons[0].link,'士兵');
			}
		}
builder.translate.feilong='飞龙夺凤';
builder.translate.feilong_skill='飞龙夺凤';
builder.translate.feilong_skill2='飞龙夺凤';
builder.translate.feilong_info='当你使用【杀】指定一名角色为目标后,你可令该角色弃置一张牌。你使用【杀】杀死一名角色后,若你所属的势力是全场最少的（或之一）,你可令该角色的使用者选择是否从未使用的武将牌中选择一张与你势力相同的武将牌重新加入游戏';
var n=parseInt(config.feilong);
while(n--){
            builder.list.push(['spade',2,'feilong']);
        }
} };
}
