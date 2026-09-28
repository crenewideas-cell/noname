// Generated from 8张随机获得技能卡（锦囊牌）.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {}, build(config, builder) {
builder.addPack({
        card:{
            "W_miji":{
                type:"trick",
                enable:true,
                selectTarget:-1,
                toself:true,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                content:function (){        
   var skills=[]; 
   for(var i in lib.character){ 
   for(var j=0;j<lib.character[i][3].length;j++){ 
   var info=lib.skill[lib.character[i][3][j]];
   if(info&&(info.gainable||!info.unique)){
   skills.add(lib.character[i][3][j]); 
                  }
                } 
              }
   var link=skills.randomGet();                   
    player.addSkill(link);
    // player.mark(link,{name:get.translation(link),content:lib.translate[link+'_info']     });
    //               player.logSkill('dunwu');
   game.log(player,'获得技能','【'+get.translation(link)+'】');
     },
                ai:{
                    order:9,
                    result:{
                        target:1,
                    },
                    value:10,
                },
                fullskin:true,
            },
        },
        translate:{
            "W_miji":"秘籍",
            "W_miji_info":"出牌阶段，对自己使用。你随机获得一个技能。",
        },
        list:[["heart","13","W_miji"],["diamond","13","W_miji"],["club","13","W_miji"],["spade","13","W_miji"],["spade","13","W_miji"],["club","13","W_miji"],["diamond","13","W_miji"],["heart","13","W_miji"]],
    });
builder.addPack({
        skill:{
        },
        translate:{
        },
    });

} };
}
