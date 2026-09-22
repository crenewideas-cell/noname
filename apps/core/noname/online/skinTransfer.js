import {lib,game} from 'noname';
import {activeId,readPack,receiveOnlinePack} from '../ui/workshop/service.js';
import {validateManifest,validateRecord,referencedAssets,MIME,MAX_BYTES,MAX_ASSETS} from '../ui/workshop/schema.js';

const booleanKeys=['rzsh_cards','rzsh_mvp','ss_effects','ss_dynamic'];
function preferences(source){
 if(!source||typeof source!=='object')source={};
 const result={};
 for(const key of booleanKeys)if(typeof source[key]==='boolean')result[key]=source[key];
 if(source.ss_dynamic_skins&&typeof source.ss_dynamic_skins==='object'){
  result.ss_dynamic_skins=Object.fromEntries(Object.entries(source.ss_dynamic_skins).filter(([key,value])=>/^[a-zA-Z0-9_-]{1,100}$/.test(key)&&typeof value==='string'&&value.length<=100).slice(0,5000));
 }
 for(const key of ['uiStyles','rzsh_head','rzshbgm','rzsh_wjbg','rszh_ideimg']){
  if(typeof source[key]==='string'&&source[key].length<=150)result[key]=source[key];
 }
 return result;
}
function dataURL(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});}
/** Data only, transferred locally by the native launcher, never sent to the server. */
export async function exportOnlineSkin(){
 const id=activeId(),pack=id?await readPack(id):null,assets={};
 if(pack)for(const [path,blob] of Object.entries(pack.assets))assets[path]=await dataURL(new Blob([blob],{type:MIME[path.split('.').pop()]}));
 return JSON.stringify({version:1,manifest:pack?.manifest||null,assets,settings:preferences(lib.config.ui_workshop_shousha_settings)});
}
export async function importOnlineSkin(params){
 const token=params.get('skin');if(!token)return;
 if(!/^[a-f0-9-]{36}$/.test(token))throw new Error('联机皮肤凭据无效');
 const response=await fetch(`/_ui-skin/${token}`,{cache:'no-store'});
 if(!response.ok)throw new Error('本地皮肤传递失败，请关闭联机窗口后重新进入');
 const source=await response.json();
 if(source.version!==1)throw new Error('不支持的联机皮肤数据');
 let pack;
 if(source.manifest){
  const manifest=validateManifest(source.manifest),paths=referencedAssets(manifest),assets={};let bytes=0;
  if(paths.length>MAX_ASSETS)throw new Error('联机皮肤素材过多');
  for(const path of paths){
   const value=source.assets?.[path],mime=MIME[path.split('.').pop()];
   if(typeof value!=='string'||!value.startsWith(`data:${mime};base64,`))throw new Error('联机皮肤素材格式无效');
   const encoded=value.slice(value.indexOf(',')+1);
   bytes+=Math.floor(encoded.length*3/4);if(bytes>MAX_BYTES+MAX_ASSETS*2)throw new Error('联机皮肤素材过大');
   const binary=atob(encoded),buffer=Uint8Array.from(binary,char=>char.charCodeAt(0));
   assets[path]=new Blob([buffer],{type:mime});
  }
  pack=validateRecord({manifest,assets});
  // One replaceable transfer slot; never overwrite the user's own online packs.
  pack.manifest.id='builtin-online-transfer';
 }
 // The default selection and provider settings also commit together.
 await receiveOnlinePack(pack,preferences(source.settings));
 params.delete('skin');
}
