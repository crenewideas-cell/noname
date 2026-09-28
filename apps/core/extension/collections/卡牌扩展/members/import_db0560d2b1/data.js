// Generated from 卡牌扩展.zip/(卡牌)技能卡牌.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {"num":{"name":"卡牌比例","init":"0.05","item":{"0.02":"2%","0.05":"5%","0.1":"10%","0.2":"20%"}}}, build(config, builder) {
builder.addPack({
        card:{
        },
        translate:{
        },
        list:[],
    });
builder.addPack({
        skill:{
        },
        translate:{
        },
    });
var list=[];
var i,j,name;
for(i in lib.character){
            if((lib.config.forbidai || []).includes(i)) continue;
            if((lib.config.forbidall || []).includes(i)) continue;
            if((lib.config.banned || []).includes(i)) continue;
            if(get.convertedCharacter(lib.character[i]).trashBin&&get.convertedCharacter(lib.character[i]).trashBin.contains('forbidai')) continue;
            if(get.convertedCharacter(lib.character[i]).trashBin&&get.convertedCharacter(lib.character[i]).trashBin.contains('boss')) continue;
            if(get.convertedCharacter(lib.character[i]).trashBin&&get.convertedCharacter(lib.character[i]).trashBin.contains('hiddenboss')) continue;
            if(get.config('double_character')&&(lib.config.forbiddouble || []).includes(i)) continue;
            list.push(i);
        }
var suit=['heart','diamond','club','spade'];
for(i=0;i<list.length;i++){
            name=list[i]+'_charactercard';
            builder.card[name]={
                enable:true,
                type:'character',
                image:'character/'+list[i],
                color:'white',
                opacity:1,
                textShadow:'black 0 0 2px',
                chongzhu:true,
                filterTarget:function(card,player,target){
                    return player==target;
                },
                selectTarget:-1,
                content:function(){
                    var name=card.name.slice(0,card.name.indexOf('_charactercard'));
                    target.$gain2(card);
                    var skills=get.convertedCharacter(lib.character[name]).skills;
                    var list=[];
                    var targetskills=target.getSkills();
                    for(var j=0;j<skills.length;j++){
                        if(lib.translate[skills[j]+'_info']&&lib.skill[skills[j]]&&
                            !lib.skill[skills[j]].unique&&
                            !targetskills.contains(skills[j])){
                            list.push(skills[j]);
                        }
                    }
                    target.removeSkill('charactercard');
                    if(list.length){
                        var skill=list.randomGet();
                        target.popup(skill);
                        game.log(target,'获得技能','【'+get.translation(skill)+'】');
                        target.addAdditionalSkill('charactercard',skill);
                        target.checkMarks();
                        target.storage.charactercard=card;
                        target.addSkill('charactercard');
                    }
                    else{
                        target.draw(2);
                    }
                },
                ai:{
                    order:9,
                    result:{
                        target:(function(name){
                            return function(player,target){
                                if(target.additionalSkills.charactercard&&
                                    target.additionalSkills.charactercard.length>0) return 0;
                                return get.convertedCharacter(lib.character[name]).hp<=4?1:0;
                            }
                        }(list[i]))
                    }
                }
            };
            builder.translate[name]=get.translation(list[i]);
            builder.translate[name+'_info']=get.skillintro(list[i],true,true);
        }
builder.skill.charactercard={
            trigger:{player:'phaseUseBegin'},
            forced:true,
            popup:false,
            mark:'card',
            intro:{
                name:function(storage,player){
                    if(_status.video){
                        if(player.marks.charactercard&&player.marks.charactercard.name){
                            var name=player.marks.charactercard.name;
                            if(name){
                                name=name.slice(0,name.indexOf('_charactercard'));
                                return get.translation(name);
                            }
                        }
                        return '';
                    }
                    else{
                        return get.translation(player.additionalSkills.charactercard[0]);
                    }
                },
                content:function(storage,player){
                    if(_status.video){
                        if(player.marks.charactercard&&player.marks.charactercard.name){
                            var name=player.marks.charactercard.name;
                            if(name){
                                name=name.slice(0,name.indexOf('_charactercard'));
                                return get.skillintro(name,true,true);
                            }
                        }
                        return '';
                    }
                    else{
                        return lib.translate[player.additionalSkills.charactercard[0]+'_info'];
                    }
                },
                onunmark:function(storage,player){
                    player.removeAdditionalSkill('charactercard');
                    delete player.storage.charactercard;
                }
            },
            content:function(){
                player.removeSkill('charactercard');
            }
        };
if(!_status.video){
            list=list.randomGets(Math.ceil(lib.card.list.length*(parseFloat(config.num)||0.05)));
            for(var i=0;i<list.length;i++){
                builder.list.push([suit.randomGet(),Math.ceil(Math.random()*13),list[i]+'_charactercard']);
            }
        }
} };
}
