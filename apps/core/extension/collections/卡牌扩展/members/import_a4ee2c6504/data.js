// Generated from 卡牌扩展.zip/(卡牌)毒药.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            duyao:{
                fullskin:true,
                		type:'basic',				
				toself:true,
				ai:{
					value:-5,
					useful:6,
					result:{
						player:function(player,target){
							if(player.hasSkillTag('usedu')) return 5;
							return -1;
						}
					},
					order:7.5
				},
				enable:true,
				modTarget:true,
				global:'g_duyao',
				filterTarget:function(card,player,target){
					return target==player;
				},
				delay:false,
				content:function(){},
				selectTarget:-1
            },
        },
        translate:{
            duyao:"毒药",
            "duyao_info":"",
        },
        list:[
        		['club',3,'duyao'],
			['club',9,'duyao'],
			['diamond',5,'duyao'],
			['diamond',9,'duyao'],
        ],
    });
builder.addPack({
        skill:{
            "g_duyao":{
                trigger:{
                    player:["useCardAfter","respondAfter","discardAfter"],
                },
                popup:false,
                forced:true,
                filter:function (event,player){
                    if(player.hasSkillTag('nodu')) return false;
                    if(event.cards){
                        for(var i=0;i<event.cards.length;i++){
                            if(event.cards[i].name=='duyao'&&event.cards[i].original!='j') return true;
                        }
                    }
                    return false;
                },
                content:function (){
                'step 0'
                    var num=0;
                    for(var i=0;i<trigger.cards.length;i++){
                        if(trigger.cards[i].name=='duyao'&&trigger.cards[i].original!='j') num++;
                    }
                    player.popup('毒药','wood');
                    player.loseHp(num);
                    'step 1'
                	player.gain(get.cardPile(function(card){
						return card.name=='du';
					}),'gain2');
                },
            },
        },
        translate:{
            "g_duyao":"g_duyao",
            "g_duyao_info":"",
        },
    });

} };
}
