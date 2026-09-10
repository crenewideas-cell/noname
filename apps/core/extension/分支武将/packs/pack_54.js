// Extracted from mode/brawl.js; legacy startup and engine/UI patches are not executed.
export default function(lib, game, ui, get, ai, _status) {
return {
"skill": {
   								_lingli_damage:{},
   								_lingli:{
   								 mark:true,
   								 marktext:'灵',
   								 popup:'聚灵',
   								 intro:{
   								 	name:'灵力',
   								 	content:'当前灵力点数：# / 5',
   								 },
   								},
   								_lingli_round:{},
   								_lingli_draw:{},
   								_lingli_save:{},
   								hhzz_noCard:{},
   								hhzz_huilei:{
   									skillAnimation:true,
   								},
   								hhzz_youlian:{
   									skillAnimation:true,
   								},
   								hhzz_zhencang:{},
   								hhzz_huizhen:{},
   								hhzz_jubao:{},
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
											nei:' ',
											nei2:' ',
											hhzz_shiona:'汐奈',
											hhzz_kanade:'立华奏',
											hhzz_takaramono1:'坚实宝箱',
											hhzz_takaramono2:'普通宝箱',
   								hhzz_toulianghuanzhu:'偷梁换柱',
   								hhzz_fudichouxin:'釜底抽薪',
   								hhzz_toulianghuanzhu_info:'出牌阶段，对一名角色使用，随机更换其一个技能。可重铸。',
   								hhzz_fudichouxin_info:'出牌阶段，对一名角色使用，随机弃置其一个技能。',
										}
};
}
