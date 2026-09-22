import { lib, game, ui, get } from 'noname';
import { mountPresentation } from './presentation.js';
export const type = 'extension';
const base = import.meta.url.slice(0, import.meta.url.lastIndexOf('/') + 1);
let installed;
export async function activate(manifest) {
 if(installed)return installed;
 const controller=new AbortController();let disposed=false,mounting,release,notice;
 const mount=()=> {
  if(disposed||release||mounting)return;
  mounting=mountPresentation({base,manifest,ui,get,lib,game,signal:controller.signal})
   .then(dispose=>{if(disposed)dispose();else {release=dispose;if(lib.uiWorkshop?.failedId===manifest.id){delete lib.uiWorkshop.failedId;delete lib.uiWorkshop.error;}}notice?.remove();})
   .catch(error=>{
    if(disposed)return;
    console.error('十周年局内 UI 加载失败',error);
    if(lib.uiWorkshop){lib.uiWorkshop.failedId=manifest.id;lib.uiWorkshop.error=error.message;}
    notice?.remove();notice=document.createElement('aside');notice.className='decade-error';notice.textContent='十周年局内 UI 加载失败：'+error.message;
    const retry=document.createElement('button');retry.textContent='重试';retry.onclick=mount;notice.append(retry);document.body.append(notice);
   }).finally(()=>{mounting=undefined;});
 };
 if(ui.arena)mount();else lib.arenaReady.push(mount);
 installed=()=>{if(disposed)return;disposed=true;controller.abort();release?.();notice?.remove();const index=lib.arenaReady?.indexOf(mount)??-1;if(index>=0)lib.arenaReady.splice(index,1);installed=undefined;};
 return installed;
}
export default function() {return {
 name:'十周年局内UI',editable:false,package:{nopack:true,version:'1.0.0',author:'短歌、萌新、橙续缘、小依；本工程展示适配',intro:'纯局内展示，全部规则由本体处理。'},
 async precontent(){const manifest=await(await fetch(base+'ui-workshop.json')).json();if(lib.uiWorkshop)await lib.uiWorkshop.registerExtension(manifest,'十周年局内UI');else await activate(manifest);},
 config:{apply:{name:'使用十周年局内 UI',clear:true,async onclick(){await lib.uiWorkshop.use('builtin-decade-ingame');game.reload();}}},content(){},
};}
