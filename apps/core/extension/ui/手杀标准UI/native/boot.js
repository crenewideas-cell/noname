// The host supplies its module URL so exported providers can live at any depth.
const {createLobbyElements}=await import(/* @vite-ignore */ new URLSearchParams(location.search).get('elements') || '/noname/ui/lobbyElements.js');
// The original loading scene's artwork, idle animation, scale and tips.
(function(){
 if(!window.PIXI?.spine)return;
 const sceneUI=createLobbyElements(PIXI,'shousha');
 const app=new PIXI.Application({width:innerWidth,height:innerHeight,backgroundAlpha:0,resolution:devicePixelRatio||1,autoDensity:true,antialias:true});
 document.body.append(app.view);
 const loader=new PIXI.Loader();let logo;
 loader.add('loading','./original/如真似幻/spine/loding.skel').load((_,resources)=>{
  if(!resources.loading.spineData)return;
  logo=sceneUI.idle(resources.loading.spineData,app.screen);app.stage.addChild(logo);resize();document.getElementById('still').remove();
 });
 function resize(){app.renderer.resize(innerWidth,innerHeight);if(logo)sceneUI.positionIdle(logo,app.screen,{scale:.8*innerHeight/514});}
 addEventListener('resize',resize);
 const timer=setInterval(()=>{document.getElementById('tip').textContent=sceneUI.randomTip(8);},1000);
 addEventListener('pagehide',()=>{clearInterval(timer);removeEventListener('resize',resize);loader.destroy();app.destroy(true,{children:true,texture:true,baseTexture:true});},{once:true});
})();
