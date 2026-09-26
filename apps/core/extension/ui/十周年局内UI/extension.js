import { lib, game, ui, get } from 'noname';
import { mountPresentation, preparePresentation } from './presentation.js';
export const type = 'extension';
const base = import.meta.url.slice(0, import.meta.url.lastIndexOf('/') + 1);
let installed;
export async function activate(manifest) {
 if(installed)return installed;
 const controller=new AbortController();let disposed=false,mounting,release,notice,prepared;
 const gate=document.createElement('style');
 gate.textContent='body[data-decade-loading] #arena{visibility:hidden!important}';
 document.head.append(gate);
 document.body.setAttribute('data-decade-loading','');
 const showError=error=>{
    if(disposed)return;
    console.error('十周年局内 UI 加载失败',error);
    if(lib.uiWorkshop){lib.uiWorkshop.failedId=manifest.id;lib.uiWorkshop.error=error.message;}
    notice?.remove();notice=document.createElement('aside');notice.className='decade-error';notice.textContent='十周年局内 UI 加载失败：'+error.message;
    const retry=document.createElement('button');retry.textContent='重试';retry.onclick=mount;notice.append(retry);document.body.append(notice);
 };
 const mount=()=> {
  if(disposed||release)return;
  if(mounting)return mounting;
  document.body.setAttribute('data-decade-loading','');
  mounting=(async()=>{
   prepared ||= await preparePresentation({base,signal:controller.signal});
   if(disposed){prepared.style.remove();return;}
   if(!ui.arena)return;
   const dispose=await mountPresentation({base,manifest,ui,get,lib,game,signal:controller.signal,prepared});
   if(disposed){dispose();return;}
   release=dispose;notice?.remove();document.body.removeAttribute('data-decade-loading');
   if(lib.uiWorkshop?.failedId===manifest.id){delete lib.uiWorkshop.failedId;delete lib.uiWorkshop.error;}
  })().catch(showError).finally(()=>{mounting=undefined;});
  return mounting;
 };
 installed=()=>{if(disposed)return;disposed=true;controller.abort();release?.();prepared?.style.remove();notice?.remove();gate.remove();document.body.removeAttribute('data-decade-loading');const index=lib.arenaReady?.indexOf(mount)??-1;if(index>=0)lib.arenaReady.splice(index,1);installed=undefined;};
 const dispose=installed;
 // Await assets while the selected lobby is being initialized, then attach
 // only when the arena exists. Direct starts and lobby starts use this path.
 try{prepared=await preparePresentation({base,signal:controller.signal});}catch(error){showError(error);}
 if(disposed){prepared?.style.remove();return dispose;}
 if(ui.arena)await mount();else lib.arenaReady.push(mount);
 return dispose;
}
export default function() {return {
 name:'十周年局内UI',editable:false,package:{nopack:true,version:'1.0.0',author:'短歌、萌新、橙续缘、小依；本工程展示适配',intro:'纯局内展示，全部规则由本体处理。'},
 async precontent(){const manifest=await(await fetch(base+'ui-workshop.json')).json();if(lib.uiWorkshop)await lib.uiWorkshop.registerExtension(manifest,'十周年局内UI');else await activate(manifest);},
 config:{apply:{name:'使用十周年局内 UI',clear:true,async onclick(){await lib.uiWorkshop.use('builtin-decade-ingame');game.reload();}}},content(){},
};}
