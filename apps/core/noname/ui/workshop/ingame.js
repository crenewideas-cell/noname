import { clone, mixPart } from './schema.js';

// An in-game plan never replaces the home, mode browser or online lobby.
export const INGAME_PARTS = ['arena','cards','cardback','players','hp','buttons','menus','lines','fonts'];
export const decadeManifest = {
 format:'noname-ui-workshop',version:1,id:'builtin-decade-ingame',name:'十周年局内 UI',
 author:'短歌、萌新、橙续缘、小依；本工程展示适配',
 description:'子琪包移动版外观：铜纹背景、金色卡面及原素材动画。规则与全部操作由当前本体处理。',
 components:Object.fromEntries(INGAME_PARTS.map(id=>[id,{name:'十周年局内 UI',runtime:'decade',settings:{},assets:{},style:{}}])),
};
decadeManifest.components.arena.settings={layout:'mobile',image_background_random:false,image_background_blur:false};
decadeManifest.components.arena.options={effects:true,sound:true};

export function mixIngame(target, source) {
 for(const id of INGAME_PARTS) if(source.manifest.components[id]) {
  const previous=target.manifest.components[id];
  mixPart(target,source,id);
  // Explicit artwork/rules are user choices and survive changing the plan.
  if(previous) {
   const part=target.manifest.components[id];
   part.assets={...part.assets,...previous.assets};
   part.style={...part.style,...previous.style};
   if(previous.rules)part.rules=clone(previous.rules);
  }
 }
 return target;
}

/** Older RZSH packs only declared a lobby. Complete that absent default plan,
 * but leave any explicitly saved in-game component (even an empty one) alone.
 * Call after validation so reading an old record never mutates stored data. */
export function completeRzshIngame(pack) {
 const components=pack.manifest.components;
 if(components.home?.runtime==='rzsh'&&!INGAME_PARTS.some(id=>Object.hasOwn(components,id))) {
  mixIngame(pack,{manifest:decadeManifest,assets:{}});
 }
 return pack;
}
