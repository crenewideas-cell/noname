// Generated from 卡牌扩展.zip/(卡牌)装备牌.zip; registration and configuration live in cardPackRuntime.js.
export default function(lib, game, ui, get, ai, _status) {

return { config: {
        silunche:{
            name:'四轮车',
            init:'1',
        }
,        
        yitianjian:{
            name:'倚天剑',
            init:'1',
        }
,
        qixingbaodao:{
            name:'七星宝刀',
            init:'2',
        }
,
        zhanshezhijian:{
            name:'斩蛇之剑',
            init:'1',
        }
,
        yangyoujizhigong:{
            name:'养由基之弓',
            init:'1',
        }
,   
        juchidao:{
            name:'锯齿刀',
            init:'1',
        }
,
         mozi:{
            name:'墨子',
            init:'1',
        }
,    
         feidao:{
            name:'飞刀',
            init:'3',
        }
,
         sunzibingfa:{
            name:'孙子兵法',
            init:'1',
        }
,   
         hanfeizi:{
            name:'韩非子',
            init:'1',
        }  
,   
         zhanguoce:{
            name:'战国策',
            init:'1',
        }
, 
         dunjiatianshu:{
            name:'遁甲天书',
            init:'1',
        } 
, 
         liji:{
            name:'礼记',
            init:'2',
        }
,       
         pibian:{
            name:'皮鞭',
            init:'1',
        }  
,   
         taipingyaoshu:{
            name:'太平要术',
            init:'1',
        }
, 
         qingnangshu:{
            name:'青囊书',
            init:'1',
        }  
,   
         sanhuangneiwen:{
            name:'三皇内文',
            init:'1',
        }
,  
         shiji:{
            name:'史记',
            init:'1',
        }  
,        shijing:{
            name:'诗经',
            init:'1',
        }  
, 
         zuoshichunqiu:{
            name:'左氏春秋',
            init:'1',
        }  
, 
         taixuanshengfu:{
            name:'太玄生符',
            init:'1',
        } 
, 
          yijing:{
            name:'易经',
            init:'1',
        }
,   
          huaji:{
            name:'滑稽',
            init:'1',
        }
,                                     
    }, build(config, builder) {
builder.addPack({});
builder.addPack({});
builder.card.silunche={
            fullimage:true,
			type:'equip',
			subtype:'equip3',
			distance:{globalTo:2},
			image:'ext:卡牌扩展/members/import_99a4e1e597/silunche.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['kongcheng']
        }
builder.translate.silunche='四轮车';
builder.translate.kongcheng='空城';
builder.translate.silunche_info='其他角色与你的距离+2, 当你没有手牌时，你不能成为杀和决斗的目标';
var n=parseInt(config.silunche);
while(n--){
            builder.list.push(['spade',12,'silunche']);
        }
builder.card.yitianjian={
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			image:'ext:卡牌扩展/members/import_99a4e1e597/yitianjian.png',
			distance:{attackFrom:-1},
			ai:{
				basic:{
					equipValue:8
				}
			},
			skills:['yitianjian_skill']
        }
builder.skill.yitianjian_skill={
			trigger:{player:'shaHit'},
			filter:function(event,player){
				return event.target.get('e',{subtype:['equip1','equip2']}).length>0
			},
			direct:true,
			audio:true,
			content:function(){
				"step 0"
				var att=(ai.get.attitude(player,trigger.target)<=0);
				var next=player.chooseButton();
				next.set('att',att);
				next.set('createDialog',['选择要弃置的装备',trigger.target.get('e',{subtype:['equip1','equip2']})]);
				next.set('ai',function(button){
					if(_status.event.att) return ai.get.buttonValue(button);
					return 0;
				});
				"step 1"
				if(result.bool){
					player.logSkill('yitianjian_skill');
					trigger.target.discard(result.links[0]);
				}
			}
		},
        builder.translate.yitianjian='倚天剑';
builder.translate.yitianjian_skill='倚天剑';
builder.translate.yitianjian_info=' 当你使用杀对目标造成伤害后,你可以弃掉其装备区内的武器或防具';
var n=parseInt(config.yitianjian);
while(n--){
            builder.list.push(['spade',13,'yitianjian']);
        }
builder.card.qixingbaodao={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/qixingbaodao.png',
			ai:{
				basic:{
					equipValue:6
				}
			},
			skills:['qixingbaodao_skill']
        }
builder.skill.qixingbaodao_skill={
			trigger:{
   player:"shaMiss",
},
   priority:-1,
   content:function (){
   player.discard(player.get('e',{subtype:['equip5']}));
   player.draw(2);
},
}
builder.translate.qixingbaodao='七星宝刀';
builder.translate.qixingbaodao_skill='七星宝刀';
builder.translate.qixingbaodao_info=' 当你使用的杀被闪避后,你可以弃置这张七星宝刀,然后你摸两张牌';
var n=parseInt(config.qixingbaodao);
while(n--){
            builder.list.push(['spade',9,'qixingbaodao']);
        }
builder.card.zhanshezhijian={
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			image:'ext:卡牌扩展/members/import_99a4e1e597/zhanshezhijian.png',
			distance:{attackFrom:-2},
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['zhanshezhijian_skill']
        }
builder.skill.zhanshezhijian_skill={
			trigger:{player:'shaBegin'},
		 forced:true,
			content:function(){
		trigger.directHit=true;
},
		  mod:{
        globalTo:function (from,to,distance){
        return distance-1
        },
        },
		}
builder.translate.zhanshezhijian='斩蛇之剑';
builder.translate.zhanshezhijian_skill='斩蛇之剑';
builder.translate.zhanshezhijian_info='你的杀无法闪避,当【斩蛇之剑】于你的装备区时，你的防御距离减一';
var n=parseInt(config.zhanshezhijian);
while(n--){
            builder.list.push(['heart',13,'zhanshezhijian']);
        }
builder.card.yangyoujizhigong={
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			distance:{attackFrom:-5},
			image:'ext:卡牌扩展/members/import_99a4e1e597/yangyoujizhigong.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['luanji']
        }
builder.translate.yangyoujizhigong='养由基之弓';
builder.translate.luanji='乱击';
builder.translate.yangyoujizhigong_info='把俩张相同花色的手牌当做万箭齐发使用';
var n=parseInt(config.yangyoujizhigong);
while(n--){
            builder.list.push(['spade',10,'yangyoujizhigong']);
        }
builder.card.juchidao={
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			distance:{attackFrom:-1},
			image:'ext:卡牌扩展/members/import_99a4e1e597/juchidao.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['wushuang']
        }
builder.translate.juchidao='锯齿刀';
builder.translate.wushuang='无双';
builder.translate.juchidao_info='自带无双，这还要我解释么。。。_(:з」∠)_';
var n=parseInt(config.juchidao);
while(n--){
            builder.list.push(['club',9,'juchidao']);
        }
builder.card.mozi={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/mozi.png',
			ai:{
				basic:{
					equipValue:12
				}
			},
			skills:['mozi_skill']
        }
builder.skill.mozi_skill={
  trigger:{
  target:"shaBefore",
},
  forced:true,
  filter:function (event,player){
return (event.card.name=='sha'&&get.color(event.card)=='red')
},
  content:function (){
   trigger.untrigger();
   trigger.finish();
},
}
builder.translate.mozi='墨子';
builder.translate.mozi_skill='墨子';
builder.translate.mozi_info='红色的杀对你无效';
var n=parseInt(config.mozi);
while(n--){
            builder.list.push(['club',13,'mozi']);
        }
builder.card.feidao={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/feidao.png',
			ai:{
				basic:{
					equipValue:7
				}
			},
			skills:['feidao_skill']
        }
builder.skill.feidao_skill={
   trigger:{
   player:"shaMiss",
},
   priority:-1,
   content:function (){
   "step 0"
   player.discard(player.get('e',{subtype:['equip5']}));
   "step 1"
   player.draw();
   trigger.target.damage();
},
}
builder.translate.feidao='飞刀';
builder.translate.feidao_skill='飞刀';
builder.translate.feidao_info='你的回合开始时，你可以弃置这张牌，对一名角色造成一点伤害，然后你摸一张牌';
var n=parseInt(config.feidao);
while(n--){
            builder.list.push(['diamond',3,'feidao']);
        }
builder.card.sunzibingfa={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/sunzibingfa.png',
			ai:{
				basic:{
					equipValue:12
				}
			},
			skills:['jizhan']
        }
builder.translate.sunzibingfa='孙子兵法';
builder.translate.jizhan='疾战';
builder.translate.sunzibingfa_info='出牌阶段限一次，你可以将移动到任意一名角色的前一位，视为对其使用了一张杀';
var n=parseInt(config.sunzibingfa);
while(n--){
            builder.list.push(['diamond',13,'sunzibingfa']);
        }
builder.card.hanfeizi={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/hanfeizi.png',
			ai:{
				basic:{
					equipValue:13
				}
			},
			skills:['qiangyun']
        }
builder.translate.hanfeizi='韩非子';
builder.translate.qiangyun='强运';
builder.translate.hanfeizi_info='当你失去最后一张手牌时,你摸俩张牌';
var n=parseInt(config.hanfeizi);
while(n--){
            builder.list.push(['spade',5,'hanfeizi']);
        }
builder.card.zhanguoce={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/zhanguoce.png',
			ai:{
				basic:{
					equipValue:13
				}
			},
			skills:['zhanguoce_skill']
        }
builder.skill.zhanguoce_skill={
   mod:{
     selectTarget:function (card,player,range){
if(card.name=='sha'&&range[1]!=-1) range[1]=Infinity;
},
}
}
builder.translate.zhanguoce='战国策';
builder.translate.zhanguoce_skill='战国策';
builder.translate.zhanguoce_info='锁定技,你的杀可指定的目标无数量限制。';
var n=parseInt(config.zhanguoce);
while(n--){
            builder.list.push(['club',13,'zhanguoce']);
        }
builder.card.dunjiatianshu={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
					distance:{globalFrom:-1},
							distance:{globalTo:1},
			image:'ext:卡牌扩展/members/import_99a4e1e597/dunjiatianshu.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['dunjiatianshu_skill']
        }
builder.skill.dunjiatianshu_skill={},
        builder.translate.dunjiatianshu='遁甲天书';
builder.translate.dunjiatianshu_skill='遁甲天书';
builder.translate.dunjiatianshu_info='等效于+1-1马';
var n=parseInt(config.dunjiatianshu);
while(n--){
            builder.list.push(['diamond',13,'dunjiatianshu']);
        }
builder.card.liji={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/liji.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['lirang']
        }
builder.translate.liji='礼记';
builder.translate.lirang='礼让';
builder.translate.liji_info='你可以将你弃置的卡牌交给一名其他角色 ';
var n=parseInt(config.liji);
while(n--){
            builder.list.push(['heart',5,'liji']);
        }
builder.card.pibian={
            fullimage:true,
			type:'equip',
			subtype:'equip4',
			distance:{globalFrom:-2},
			image:'ext:卡牌扩展/members/import_99a4e1e597/pibian.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['pibian_skill']
        }
builder.skill.pibian_skill={
   mod:{
attackFrom:function(){
return -Infinity; 
}
}
},
        builder.translate.pibian='皮鞭';
builder.translate.pibian_skill='皮鞭';
builder.translate.pibian_info='锁定技,你使用的杀无距离限制。';
var n=parseInt(config.pibian);
while(n--){
            builder.list.push(['diamond',2,'pibian']);
        }
builder.card.taipingyaoshu={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/taipingyaoshu.png',
			ai:{
				basic:{
					equipValue:12
				}
			},
			skills:['taipingyaoshu_skill']
        }
builder.skill.taipingyaoshu_skill={
  trigger:{
player:"damageBefore",
},
forced:true,
unique:true,
filter:function (event){
return event.nature;
},
content:function (){
trigger.untrigger();
trigger.finish();
player.recover();
},
},
        builder.translate.taipingyaoshu='太平要术';
builder.translate.taipingyaoshu_skill='太平要术';
builder.translate.taipingyaoshu_info='锁定技,你收到的属性伤害改为回复一点体力';
var n=parseInt(config.taipingyaoshu);
while(n--){
            builder.list.push(['heart',12,'taipingyaoshu']);
        }
builder.card.qingnangshu={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/qingnangshu.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['qingnang']
        }
builder.translate.qingnangshu='青囊书';
builder.translate.qingnang='青囊';
builder.translate.qingnangshu_info='自带青囊';
var n=parseInt(config.qingnangshu);
while(n--){
            builder.list.push(['heart',13,'qingnangshu']);
        }
builder.card.sanhuangneiwen={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/sanhuangneiwen.png',
			ai:{
				basic:{
					equipValue:15
				}
			},
			skills:['sanhuangneiwen_skill']
        }
builder.skill.sanhuangneiwen_skill={
   trigger:{
global:"judgeEnd",
},
frequent:true,
filter:function (event,player){
return get.position(event.result.card)=='d'&&event.position==ui.discardPile;
},
content:function (){
player.gain(trigger.result.card);
player.$gain2(trigger.result.card);
},
},
        builder.translate.sanhuangneiwen='三皇内文';
builder.translate.sanhuangneiwen_skill='三皇内文';
builder.translate.sanhuangneiwen_info='每当场上有角色的判定牌生效，你立即获得它(天妒优先级更高)';
var n=parseInt(config.sanhuangneiwen);
while(n--){
            builder.list.push(['diamond',13,'sanhuangneiwen']);
        }
builder.card.shiji={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/shiji.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['tianshu']
        }
builder.translate.shiji='史记';
builder.translate.tianshu='天书';
builder.translate.shiji_info='出牌阶段，你可以弃置一张手牌，并获得场上一名存活角色的一项技能直到你的下一出牌阶段开始';
var n=parseInt(config.shiji);
while(n--){
            builder.list.push(['diamond',8,'shiji']);
        }
builder.card.shijing={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/shijing.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['duishi']
        }
builder.translate.shijing='诗经';
builder.translate.duishi='对诗';
builder.translate.shijing_info='出牌阶段，你可以弃置一张手牌，并指定一名有手牌的角色弃置一张与之花色相同的手牌，否则你获得其一张牌。若其弃置了手牌，你可对一名其他目标再发动一次';
var n=parseInt(config.shijing);
while(n--){
            builder.list.push(['club',8,'shijing']);
        }
builder.card.zuoshichunqiu={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/zuoshichunqiu.png',
			ai:{
				basic:{
					equipValue:10
				}
			},
			skills:['luoyi2']
        }
builder.translate.zuoshichunqiu='左氏春秋';
builder.translate.luoyi2='春秋';
builder.translate.zuoshichunqiu_info='你的杀伤害加一';
var n=parseInt(config.zuoshichunqiu);
while(n--){
            builder.list.push(['spade',9,'zuoshichunqiu']);
        }
builder.card.taixuanshengfu={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/taixuanshengfu.png',
			ai:{
				basic:{
					equipValue:30
				}
			},
			skills:['taixuanshengfu_skill']
        }
builder.skill.taixuanshengfu_skill={
   trigger:{
player:"phaseEnd",
},
direct:true,
filter:function (event,player){
return !player.getStat('damage');
},
content:function (){
'step 0'
player.chooseTarget('是否发动【太玄生符】？').ai=function(target){
var att=ai.get.attitude(player,target);
if(att>1&&target.hp<=1){
att+=2;
}
return att;
};
'step 1'
if(result.bool){
event.target=result.targets[0];
player.logSkill('taixuanshengfu_skill',event.target);
if(event.target.hp<event.target.maxHp){
event.target.chooseControl('增加一点体力上限','recover_hp',function(event,target){
if(target.hp>=2||target.hp>=target.maxHp-1) return '增加一点体力上限';
if(target.hp==2&&target.num('h')==0) return '增加一点体力上限';
return 'recover_hp';
});
}
else{
event.target.gainMaxHp();
event.finish();
}
}
else{
event.finish();
}
'step 2'
if(result.control=='增加一点体力上限'){
event.target.gainMaxHp();
}
else{
event.target.recover();
}
},
},
        builder.translate.taixuanshengfu='太玄生符';
builder.translate.taixuanshengfu_skill='太玄生符';
builder.translate.taixuanshengfu_info='回合结束阶段，若你没有于本回合内造成伤害，你可以令一名角色增加一点体力上限或回复一点体力';
var n=parseInt(config.taixuanshengfu);
while(n--){
            builder.list.push(['heart',1,'taixuanshengfu']);
        }
builder.card.yijing={
            fullimage:true,
			type:'equip',
			subtype:'equip5',
			image:'ext:卡牌扩展/members/import_99a4e1e597/yijing.png',
			ai:{
				basic:{
					equipValue:15
				}
			},
			skills:['guanxing']
        }
builder.translate.yijing='易经';
builder.translate.guanxing='观星';
builder.translate.yijing_info='自带观星';
var n=parseInt(config.yijing);
while(n--){
            builder.list.push(['club',8,'yijing']);
        }
builder.card.huaji={
            fullimage:true,
			type:'equip',
			subtype:'equip1',
			image:'ext:卡牌扩展/members/import_99a4e1e597/huaji.png',
			ai:{
				basic:{
					equipValue:30
				}
			},
			skills:['huaji_skill']
        }
builder.skill.huaji_skill={
   trigger:{
player:"recoverEnd",
},
filter:function (event,player){
return get.itemtype(event.cards)=='cards'&&get.position(event.cards[0])=='d';
},
content:function (){
player.gain(trigger.cards);
player.$gain2(trigger.cards);
},
ai:{
maixie:true,
effect:{
target:function (card,player){
if(player.skills.contains('jueqing')) return [1,-1];
if(get.tag(card,'recover')) return [1,0.5];
},
},
},
},
        builder.translate.huaji='滑稽';
builder.translate.huaji_skill='滑稽';
builder.translate.huaji_info='你可以立即获得使你回复体力的牌';
var n=parseInt(config.huaji);
while(n--){
            builder.list.push(['heart',6,'huaji']);
        }
} };
}
