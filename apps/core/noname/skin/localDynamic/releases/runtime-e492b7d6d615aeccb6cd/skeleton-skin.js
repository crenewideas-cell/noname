// An exported Spine skin is a set of attachments, distinct from a catalog skin.
// Never combine competing variants or infer a choice from their names.
export function chooseSkeletonSkin(data,requested,attachmentTypes){
 const skins=data.skins||[];
 if(requested!=null){
  if(typeof requested!=='string'||!skins.some(s=>s.name===requested))throw Error('声明的骨骼皮肤不存在：'+requested);
  return{name:requested,rule:'explicit-source-skin'};
 }
 const drawable=skin=>skin?.getAttachments().some(({attachment:a})=>a.type===attachmentTypes.Region||a.type===attachmentTypes.Mesh);
 if(drawable(data.defaultSkin))return{name:null,rule:'renderable-default-skin'};
 const alternatives=skins.filter(drawable);
 if(alternatives.length===1)return{name:alternatives[0].name,rule:'unique-renderable-skin-with-empty-default'};
 return{name:null,rule:alternatives.length?'ambiguous-variants-retain-source-default':'no-renderable-skin'};
}
