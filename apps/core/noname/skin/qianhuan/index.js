import { lib, get } from 'noname';
import { getSkinService, subscribeCharacterSkins } from '../index.js';
import { createQianhuanView } from './view.js';
let active;
export function openCharacterSkins(character) {
 active?.close();
 const characters=[...new Set([...Object.keys(lib.character),...Object.values(lib.characterPack).flatMap(pack=>Object.keys(pack))])].filter(id=>!get.character(id).isUnseen);
 // Do not inject hidden or nonexistent characters supplied by an old UI.
 const prefix=import.meta.env?.VITE_PUBLIC_ONLINE==='1'?'ui-skins':'extension';
 active=createQianhuanView({characters,initialCharacter:character,label:id=>get.translation(id),store:getSkinService(),
  enabled:()=>lib.config.change_skin!==false,subscribe:subscribeCharacterSkins,
  asset:path=>`${lib.assetURL}${prefix}/手杀标准UI/original/千幻聆音/${path}`,
  portrait(node,id,path){
   node.replaceChildren();node.setBackground(id,'character','noskin');
   if(path){const image=document.createElement('div');image.className='qhly-preview-image';image.setBackgroundImage(path);node.append(image);}
  },
 });
 return active;
}
