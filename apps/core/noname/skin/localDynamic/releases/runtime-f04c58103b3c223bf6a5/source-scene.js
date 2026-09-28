// Source contract for the decade dynamicSkin.js coordinate vocabulary.
// Compiling preserves source facts; it does not certify an authored viewport
// or authorize model replacement, inferred layer alignment, or camera crops.
const coordinateFields=['x','y','width','height'];
const number=(value,name,fallback)=>{
 if(value==null)return fallback;
 if(typeof value!=='number'||!Number.isFinite(value))throw Error('无效动态皮肤数值：'+name);
 return value;
};
export function coordinate(value,extent,fallback=extent/2){
 if(value==null)return fallback;
 if(Array.isArray(value)){
  if(value.length!==2)throw Error('坐标必须是固定像素和容器比例两项');
  return number(value[0],'offset',0)+number(value[1],'fraction',0)*extent;
 }
 return number(value,'coordinate',fallback);
}
export function compileDecadeLayer(config,role){
 if(!config||typeof config.name!=='string'||!config.name)throw Error('图层缺少源模型名');
 const c=structuredClone(config);
 for(const field of coordinateFields)if(c[field]!=null)coordinate(c[field],1);
 const declaredAction=c.action??c.animation;
 if(declaredAction!=null&&typeof declaredAction!=='string'&&!(Array.isArray(declaredAction)&&declaredAction.every(a=>typeof a==='string')))throw Error('无效动作声明');
 return{role,resource:{name:c.name,format:c.json?'json':'binary'},source:c,
  placement:{x:c.x??[0,.5],y:c.y??[0,.5],scale:number(c.scale,'scale',1),angle:number(c.angle,'angle',0),width:c.width,height:c.height},
  playback:{declaredAction:declaredAction??null,speed:number(c.speed,'speed',1)},
  display:{opacity:number(c.opacity,'opacity',1),flipX:!!c.flipX,flipY:!!c.flipY,hideSlots:c.hideSlots??[],clipSlots:c.clipSlots??[],clip:c.clip??null}};
}
export function compileDecadeScene(source,provenance){
 if(!provenance?.sourceConfigHash)throw Error('场景必须有源配置身份');
 const layers=[];if(source.beijing?.name)layers.push(compileDecadeLayer(source.beijing,'background'));
 layers.push(compileDecadeLayer(source,'primary'));
 if(source.qianjing?.name)layers.push(compileDecadeLayer(source.qianjing,'foreground'));
 return{protocol:'noname-source-scene/1',sourceFamily:'decade-dynamicSkin',provenance:structuredClone(provenance),source:structuredClone(source),layers,
  actions:Object.fromEntries(['chuchang','gongji','teshu','shan','special','zhishixian'].filter(k=>source[k]!=null).map(k=>[k,structuredClone(source[k])])),
  viewport:{status:'requires-source-evidence'},conversions:[],unverifiedRules:[],acceptance:'pending'};
}
export function layoutDecadeLayer(layer,{width,height,dpr=1,referenceHeight},bounds){
 if(!(width>0&&height>0&&dpr>0))throw Error('无效逻辑画框');
 // The caller must supply its separately evidenced viewport policy.
 if(referenceHeight!=null&&!(referenceHeight>0))throw Error('无效来源参考高度');
 const p=layer.placement,x=coordinate(p.x,width),y=coordinate(p.y,height);
 let scale=p.scale*(referenceHeight==null?1:height/referenceHeight);
 const factors=[];
 if(p.width!=null){if(!(bounds?.width>0))throw Error('宽度适配缺少骨骼边界');factors.push(coordinate(p.width,width)/bounds.width);}
 if(p.height!=null){if(!(bounds?.height>0))throw Error('高度适配缺少骨骼边界');factors.push(coordinate(p.height,height)/bounds.height);}
 if(factors.length)scale*=Math.min(...factors);
 const angle=p.angle*Math.PI/180,c=Math.cos(angle)*scale,s=Math.sin(angle)*scale;
 const logical=[c,s,-s,c,x,y];
 return{logical,device:logical.map(n=>n*dpr),origin:'bottom-left',order:'translate * uniform-scale * rotate',scale,x,y,angle:p.angle,dpr};
}
export function transformPoint(matrix,x,y){return{x:matrix[0]*x+matrix[2]*y+matrix[4],y:matrix[1]*x+matrix[3]*y+matrix[5]};}

// Explicit complete-artwork presentation for source supplements whose placement
// is documented as uncalibrated. Bounds are supplied by a recorded reference
// capture, never inferred from face names or resampled on each animation frame.
export function layoutCompleteArtwork(bounds,{width,height,dpr=1}){
 if(!bounds||![bounds.x,bounds.y,bounds.width,bounds.height,width,height,dpr].every(Number.isFinite)||!(bounds.width>0&&bounds.height>0&&width>0&&height>0&&dpr>0))throw Error('完整场景缺少有限参考边界');
 const scale=Math.min(width/bounds.width,height/bounds.height),x=width/2-(bounds.x+bounds.width/2)*scale,y=height/2-(bounds.y+bounds.height/2)*scale;
 const logical=[scale,0,0,scale,x,y];
 return{logical,device:logical.map(n=>n*dpr),origin:'bottom-left',order:'contain fixed reference bounds',scale,x,y,angle:0,dpr};
}
