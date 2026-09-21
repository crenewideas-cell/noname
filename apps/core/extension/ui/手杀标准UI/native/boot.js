// The original loading scene's artwork, idle animation, scale and tips.
(function(){
 if(!window.PIXI?.spine)return;
 const tips=['三国杀是一款流行的桌面卡牌游戏，基于三国历史背景。','在三国杀中，玩家需要策略地使用各种角色卡牌来击败对手。','诸葛亮、曹操和刘备是三国杀中的著名角色。','游戏中的卡牌包括杀、闪、桃等各种不同的功能。','每位角色都有独特的技能和特点，增加了游戏的变化性。','三国杀的策略性和战术性使其成为一款受欢迎的卡牌游戏。','在三国杀中，胜利需要巧妙地使用卡牌和角色技能。','游戏中的合作和背叛元素增加了战局的紧张感。'];
 const app=new PIXI.Application({width:innerWidth,height:innerHeight,backgroundAlpha:0,resolution:devicePixelRatio||1,autoDensity:true,antialias:true});
 document.body.append(app.view);
 const loader=new PIXI.Loader();let logo;
 loader.add('loading','./original/如真似幻/spine/loding.skel').load((_,resources)=>{
  if(!resources.loading.spineData)return;
  logo=new PIXI.spine.Spine(resources.loading.spineData);logo.state.setAnimation(0,'idle',true);app.stage.addChild(logo);resize();document.getElementById('still').remove();
 });
 function resize(){app.renderer.resize(innerWidth,innerHeight);if(logo){logo.position.set(innerWidth*.5,innerHeight*.5);logo.scale.set(.8*innerHeight/514);}}
 addEventListener('resize',resize);
 const timer=setInterval(()=>{document.getElementById('tip').textContent=tips[Math.floor(Math.random()*tips.length)];},1000);
 addEventListener('pagehide',()=>{clearInterval(timer);removeEventListener('resize',resize);loader.destroy();app.destroy(true,{children:true,texture:true,baseTexture:true});},{once:true});
})();
