export const dynamicKey=(pack,id)=>JSON.stringify([pack,id]);
const cache=new WeakMap();
export function dynamicOwners(config,pack,entry){
 const source=config.skin_management?.dynamicAssignments;
 let index=cache.get(config);
 if(!index||index.source!==source){
  index={source,replaced:new Set(),assigned:new Map()};
  for(const [name,binding]of Object.entries(source||{})){
   if(binding.mode==='replace')index.replaced.add(name);
   for(const skin of binding.skins||[]){const key=dynamicKey(skin.pack,skin.id);if(!index.assigned.has(key))index.assigned.set(key,[]);index.assigned.get(key).push(name);}
  }
  cache.set(config,index);
 }
 return [...new Set([...(entry.characterIds||[]).filter(name=>!index.replaced.has(name)),...(index.assigned.get(dynamicKey(pack,entry.id))||[])])];
}
