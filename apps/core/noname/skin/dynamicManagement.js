import {lib,game,ui,_status} from 'noname';
import {save} from '../util/config.js';
import {installLocalDynamicPacks} from './localDynamic/index.js';

export async function dynamicSkins(character){
 const hub=await installLocalDynamicPacks({lib,game,ui,_status,openCharacterSkins:(...args)=>import('./qianhuan/index.js').then(module=>module.openCharacterSkins(...args))});
 await hub.ensureCharacter?.(character);
 return hub.listSkins?.(character)||[];
}
export async function enableDynamicPack(name){
 await save('extension_'+name+'_enable','config',true);lib.config['extension_'+name+'_enable']=true;
 game.localDynamicSkinTestHub?.invalidateCatalog();game.localDynamicSkinTestHub?.refresh();
}
export function previewDynamicSkin(character,skin){
 const hub=game.localDynamicSkinTestHub,dialog=document.createElement('dialog');dialog.className='skin-manager skin-dynamic-preview';
 const title=document.createElement('h2');title.textContent=skin.name;
 const portrait=document.createElement('div');portrait.className='skin-dynamic-preview-stage';portrait.dataset.qhlyPreviewDynamic='true';
 const close=document.createElement('button');close.textContent='关闭预览';close.onclick=()=>dialog.close();
 dialog.append(title,portrait,close);document.body.append(dialog);dialog.showModal();
 hub?.mount(portrait,character,skin.token.replace(/\.png$/,''));
 if(!hub?.previews.has(portrait))portrait.textContent='当前动态播放已关闭。请在游戏设置中开启动画、关闭低性能模式，并启用动态皮肤后再预览。';
 dialog.addEventListener('close',()=>{hub?.stopPreview(portrait);dialog.remove();},{once:true});
 return dialog;
}
