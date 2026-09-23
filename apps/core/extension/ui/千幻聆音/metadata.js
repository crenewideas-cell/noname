import {lib, get as hostGet} from 'noname';

// Lobby packs are imported as metadata before their gameplay skills are installed.
// Read them locally; browsing a skin must not register a pack's rules globally.
export function skillInfo(name) {
 if(lib.skill[name])return lib.skill[name];
 for(const pack of Object.values(lib.imported.character||{}))if(pack.skill?.[name])return pack.skill[name];
}
export const get=new Proxy(hostGet,{get(target,key){
 if(key==='info')return (item,player)=>typeof item==='string'?skillInfo(item)||{}:target.info(item,player);
 return Reflect.get(target,key,target);
}});
