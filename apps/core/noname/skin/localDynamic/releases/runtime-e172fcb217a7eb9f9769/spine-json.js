// A few 3.8-labelled exports retain the older name-keyed skins container.
// Convert only that container; leave attachment data, timelines and the
// declared version unchanged. The conversion is recorded by the caller.
export function normalizeSpineJson(input){
 const skins=input?.skins;
 if(!/^3\.8\./.test(input?.skeleton?.spine||'')||!skins||Array.isArray(skins))return{data:input,conversion:null};
 if(typeof skins!=='object')throw Error('Spine skins不是合法容器');
 const entries=Object.entries(skins);
 for(const [name,attachments] of entries)if(!name||!attachments||typeof attachments!=='object'||Array.isArray(attachments))throw Error('Spine命名skin缺少附件映射');
 return{data:{...input,skins:entries.map(([name,attachments])=>({name,attachments}))},conversion:{rule:'spine38-named-skins-container',skinNames:entries.map(([name])=>name),version:input.skeleton.spine}};
}
