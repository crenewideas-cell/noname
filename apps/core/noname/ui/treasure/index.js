import {lib,game,ui} from 'noname';
import {mountOriginalTreasure} from './original.js';
import settings from './settings.js';
import Ease from './ease.js';
import itemFiles from './item-files.json' with {type:'json'};
const itemInventory=new Set(itemFiles);

let active,stylesheet;
const base=()=>lib.assetURL+'extension/手杀标准UI/original/皮肤切换/';
export function openTreasure({PIXI}) {
 if(active?.isConnected)return active;
 if(!PIXI?.spine?.Spine||!PIXI.Scrollbox)throw Error('珍宝阁绘图库尚未就绪');
 if(!stylesheet){stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=base()+'style/cang-zhen-ge.css';document.head.append(stylesheet);}
 let root,app,closed=false;const timers=new Set(),eases=new Set(),audio=new Set();
 const owner={
  get closed(){return closed;},
  itemTexture(item){const paths=[(item.type==="wujiang"?"wujiang/":"items/")+item.id+".png","wujiang/"+item.id+".png"];const file=paths.find(path=>itemInventory.has(path));return file?base()+"images/cangZhenGe/"+file:PIXI.Texture.EMPTY;},
  attach(node){root=node;active=node;node.style.zIndex='100025';node.close=owner.close;},
  ownApp(value){app=value;},
  ease(Type){const value=new Type();eases.add(value);return value;},
  timeout(fn,delay){if(closed)return 0;const id=setTimeout(()=>{timers.delete(id);if(!closed)fn();},delay);timers.add(id);return id;},
  close(){if(closed)return;closed=true;for(const id of timers)clearTimeout(id);for(const value of eases)value.destroy();for(const node of audio){node.pause();node.removeAttribute('src');node.load();}app?.loader.reset();app?.destroy(true,{children:true});root?.remove();if(active===root)active=undefined;root?.dispatchEvent(new Event('close'));},
 };
 const skinSwitch={url:base(),czgSettings:settings,bodySize:()=>({width:document.body.offsetWidth,height:document.body.offsetHeight}),refreshDomList:(nodes,cls,current)=>nodes.forEach(node=>node.classList.toggle(cls,node===current))};
 const localGame={playAudio(path){const node=game.playAudio({path:path.replace('../extension/皮肤切换/','ext:手杀标准UI/original/皮肤切换/'),addVideo:false});if(node){audio.add(node);node.addEventListener('ended',()=>audio.delete(node),{once:true});}return node;}};
 try{return mountOriginalTreasure({PIXI,Ease,Scrollbox:{Scrollbox:PIXI.Scrollbox},skinSwitch,ui,game:localGame,window:{devicePixelRatio:window.devicePixelRatio,documentZoom:game.documentZoom},owner});}
 catch(error){owner.close();throw error;}
}
