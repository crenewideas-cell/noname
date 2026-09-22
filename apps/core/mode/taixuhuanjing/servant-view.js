import {lib, subscribePresentation} from 'noname';

let library, current;
async function rendererLibrary() {
 return library ||= Promise.all([import('./spine.js'),import('./animation-renderer.js')])
  .then(([spine,renderer])=>renderer.createAnimationRenderer(spine.default));
}

/** Drawing only. Choosing a skin or constructing a servant never installs rules. */
export class ServantView {
 constructor(name) {
  current?.dispose();current=this;
  this.nickName=name;this.setData();
  this.unsubscribe=subscribePresentation(message=>{
   if(!this.node?.isConnected || !this.match || this.hidden)return;
   if(message.type==='card')this.playAction('jinnang1');
   if(message.type==='damage')this.playAction('shouji1');
  });
 }
 setData() {
  this.stop();this.data=window.txhj.servantData.servant[this.nickName];
  this.textName=this.data.textName;this.grade=this.data.grade;
  this.name=window.txhjPack.path+'/image/servant/picture/'+this.nickName+'.png';
 }
 chooseingPlay(node) { this.mount(node,'chooseServant'); }
 consoledeskPlay(node) { this.match=false;this.zuoDian?.remove();this.mount(node,'consoledesk'); }
 initZuodian() {
  this.match=true;
  if(!this.zuoDian?.isConnected) {
   this.zuoDian=document.createElement('div');this.zuoDian.className='taixuhuanjing_wait';
   this.zuoDian.onclick=()=>this.randomPlayAction();document.body.append(this.zuoDian);
  }
  this.mount(this.zuoDian,'match');
 }
 async mount(node,scene) {
  this.stop();this.node=node;this.hidden=false;
  const token=this.token, name=this.nickName;
  node.style.backgroundImage=`url("${this.name}")`;node.style.backgroundSize='contain';
  node.style.backgroundRepeat='no-repeat';node.style.backgroundPosition='center';
  if(lib.config.animation===false || lib.config.low_performance)return;
  try {
   const {AnimationPlayer}=await rendererLibrary();
   if(token!==this.token || !node.isConnected)return;
   const renderer=this.renderer=new AnimationPlayer(window.txhjPack.path+'/image/servant/',node);
   renderer.canvas.className='taixuhuanjing-servant-canvas';
   renderer.canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
   renderer.canvas.setAttribute('aria-hidden','true');
   if(!renderer.gl)throw new Error('WebGL unavailable');
   const draw=renderer.render;
   renderer.render=time=>{
    if(token!==this.token)return;
    if(!node.isConnected){this.stop();return;}
    try{draw.call(renderer,time);}catch(error){this.stop();console.warn('侍灵动画无法绘制',error);}
   };
   await new Promise((resolve,reject)=>renderer.loadSpine(name,'skel',resolve,reject));
   if(token!==this.token || !node.isConnected)return;
   const mobile=!!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i);
   const placement=(mobile?this.data:this.data.pc)?.[scene] || this.data[scene];
   this.sprite=renderer.playSpine({name,loop:true,action:this.data.action || 'daiji1',...placement});
   if(this.sprite)node.style.backgroundImage='none';
  } catch(error) {if(token===this.token){this.stop();console.warn('侍灵使用静态立绘',error);}}
 }
 playAction(action) {
  if(!this.sprite || this.hidden)return;
  const skeleton=this.sprite.skeleton;
  if(skeleton?.data?.findAnimation(action)) {
   this.sprite.setAction(action);
   skeleton.state.addAnimation(0,'daiji1',true,0);
  }
 }
 randomPlayAction() {
  const data=window.txhj.servantData.action[this.nickName] || {},actions=[];
  for(const [name,count] of Object.entries(data))if(!['jingzhi','zuodian','gongji'].includes(name))for(let i=1;i<=count;i++)if(name+i!=='daiji1')actions.push(name+i);
  if(actions.length)this.playAction(actions[Math.floor(Math.random()*actions.length)]);
 }
 hide() {this.hidden=true;if(this.node)this.node.style.visibility='hidden';}
 show() {this.hidden=false;if(this.node)this.node.style.visibility='';}
 stop() {
  this.token=(this.token || 0)+1;
  if(this.node?.isConnected && this.name)this.node.style.backgroundImage=`url("${this.name}")`;
  const renderer=this.renderer;this.renderer=this.sprite=undefined;
  if(!renderer)return;
  cancelAnimationFrame(renderer.requestId);
  for(const release of [()=>renderer.stopSpineAll(),()=>renderer.canvas.remove(),()=>renderer.spine.assetManager?.dispose?.(),()=>renderer.gl?.getExtension('WEBGL_lose_context')?.loseContext()])try{release();}catch{}
 }
 dispose() {this.stop();this.unsubscribe?.();this.zuoDian?.remove();}
}
