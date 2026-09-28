// Some source atlases extend one pixel past the physical image. The official
// WebGL runtime samples that pixel with CLAMP_TO_EDGE. PIXI rejects the frame
// before rendering. Reproduce the same edge sample in a private canvas without
// rewriting source assets, changing region geometry, or patching PIXI globally.
export function inspectAtlasPages(PIXI,text){
 const textures=[],pages=new Map();
 try{
  let complete=false;
  const atlas=new PIXI.spine.TextureAtlas(text,(name,callback)=>{
   // Metadata-only base texture. No GPU allocation or image is created.
   const texture=new PIXI.BaseTexture(null,{width:1048576,height:1048576});textures.push(texture);callback(texture);
  },()=>{complete=true;});
  if(!complete)throw Error('图集元数据未同步解析');
  for(const page of atlas.pages)pages.set(page.name,{width:0,height:0,declaredWidth:page.width===1048576?null:page.width,declaredHeight:page.height===1048576?null:page.height,repeat:page.uWrap!==PIXI.WRAP_MODES.CLAMP||page.vWrap!==PIXI.WRAP_MODES.CLAMP});
  for(const region of atlas.regions){const p=pages.get(region.page.name),f=region.texture.frame;if(f.x<0||f.y<0)throw Error('图集区域使用负像素坐标');p.width=Math.max(p.width,Math.ceil(f.x+f.width));p.height=Math.max(p.height,Math.ceil(f.y+f.height));}
  return pages;
 }finally{for(const texture of textures)texture.destroy();}
}
// Spine 4.0 calculates atlas UVs against the declared page size, even when
// the supplied image is resized. Keep those logical coordinates in PIXI;
// upload the original image unchanged. This is not edge padding or a repair
// of image content. A private base texture avoids changing another atlas user.
export function declaredAtlasSize(PIXI,base,extent){
 const width=extent?.declaredWidth,height=extent?.declaredHeight;
 if(!(width>0&&height>0))throw Error('4.0图集缺少有效声明尺寸');
 if(extent.width>width||extent.height>height)throw Error('4.0图集区域超出声明尺寸');
 if(width===base.realWidth&&height===base.realHeight)return base;
 const source=base.resource?.source;if(!source)throw Error('图集尺寸约定缺少源图像');
 const logical=new PIXI.BaseTexture(source,{resolution:1,scaleMode:base.scaleMode,mipmap:base.mipmap,wrapMode:base.wrapMode,alphaMode:base.alphaMode});
 logical.setSize(width,height,1);
 logical.skinAtlasCompatibility={rule:'spine40-declared-page-uv',sourceSize:{width:base.realWidth,height:base.realHeight},declaredSize:{width,height}};
 base.destroy();return logical;
}
export function clampAtlasEdge(PIXI,base,extent){
 if(!extent)return base;
 const width=base.realWidth,height=base.realHeight,extraX=Math.max(0,extent.width-width),extraY=Math.max(0,extent.height-height);
 if(!extraX&&!extraY)return base;
 if(extraX>1||extraY>1||extent.repeat)throw Error(`图集区域越界：贴图 ${width}×${height}，区域要求 ${extent.width}×${extent.height}`);
 const source=base.resource?.source;if(!source)throw Error('图集边界兼容缺少源图像');
 const canvas=document.createElement('canvas');canvas.width=width+extraX;canvas.height=height+extraY;
 const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);
 if(extraX)ctx.drawImage(source,width-1,0,1,height,width,0,1,height);
 if(extraY)ctx.drawImage(source,0,height-1,width,1,0,height,width,1);
 if(extraX&&extraY)ctx.drawImage(source,width-1,height-1,1,1,width,height,1,1);
 const padded=PIXI.BaseTexture.from(canvas,{resolution:base.resolution,scaleMode:base.scaleMode,mipmap:base.mipmap,wrapMode:base.wrapMode,alphaMode:base.alphaMode});
 padded.skinAtlasCompatibility={rule:'one-pixel-clamp-to-edge',sourceSize:{width,height},virtualSize:{width:canvas.width,height:canvas.height}};
 base.destroy();return padded;
}
