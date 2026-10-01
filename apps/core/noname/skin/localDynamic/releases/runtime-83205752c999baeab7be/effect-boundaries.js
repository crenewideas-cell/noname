// Source effects can end at a visibly opaque atlas edge. Feather only those
// cut edges, in a private upload; body/scenery textures and source files stay intact.
export function clippedEffectEdges(pixels,width,height){
 if(width<16||height<16)return [];
 let transparent=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<8)transparent++;
 if(transparent<width*height*.1)return [];
 const edges=[];
 for(const side of ['left','right','top','bottom']){
  const length=side==='left'||side==='right'?height:width;let run=0,longest=0;
  for(let n=0;n<length;n++){
   const x=side==='left'?0:side==='right'?width-1:n,y=side==='top'?0:side==='bottom'?height-1:n;
   run=pixels[(y*width+x)*4+3]>=64?run+1:0;longest=Math.max(longest,run);
  }
  if(longest>=Math.max(8,length*.22))edges.push(side);
 }
 return edges;
}
export function featherEffectPixels(pixels,width,height,edges,premultiplied=false){
 const fade=Math.max(4,Math.min(32,Math.round(Math.min(width,height)*.12)));
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  let distance=fade;
  for(const edge of edges)distance=Math.min(distance,edge==='left'?x:edge==='right'?width-1-x:edge==='top'?y:height-1-y);
  if(distance>=fade)continue;
  const t=distance/fade,alpha=t*t*(3-2*t),i=(y*width+x)*4;
  pixels[i+3]=Math.round(pixels[i+3]*alpha);
  if(premultiplied)for(let c=0;c<3;c++)pixels[i+c]=Math.round(pixels[i+c]*alpha);
 }
}
export function softenCutContours(pixels,width,height,premultiplied=false){
 // A cut can lie inside transparent padding (and may be diagonal). Locate
 // only abrupt alpha jumps; smoothly fading smoke has no such boundary.
 const limit=Math.max(4,Math.min(32,Math.round(Math.min(width,height)*.12))),distance=new Uint8Array(width*height).fill(255);let seeds=0;
 for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
  const i=y*width+x;if(pixels[i*4+3]>8)continue;
  if([i-1,i+1,i-width,i+width].some(j=>pixels[j*4+3]>=64)){distance[i]=0;seeds++;}
 }
 if(seeds<Math.max(12,Math.min(width,height)*.25))return false;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=y*width+x;distance[i]=Math.min(distance[i],x?distance[i-1]+1:255,y?distance[i-width]+1:255);}
 for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){const i=y*width+x;distance[i]=Math.min(distance[i],x<width-1?distance[i+1]+1:255,y<height-1?distance[i+width]+1:255);}
 for(let i=0;i<distance.length;i++)if(distance[i]<limit){const t=distance[i]/limit,alpha=t*t*(3-2*t);pixels[i*4+3]=Math.round(pixels[i*4+3]*alpha);if(premultiplied)for(let c=0;c<3;c++)pixels[i*4+c]=Math.round(pixels[i*4+c]*alpha);}
 return true;
}
export function prepareEffectPage(source,regions,pageWidth,pageHeight,premultiplied=false){
 const named=r=>/(?:^|\/)(?:fx[_/]|eff(?:ect)?[_/]|tx[_/]|chuchang\d*\/)/i.test(r.name);
 const effects=regions.filter(r=>named(r)||/^\d+(?:_\d+)*$/.test(r.name));
 if(!effects.length)return source;
 const width=source.naturalWidth||source.width,height=source.naturalHeight||source.height,sx=width/pageWidth,sy=height/pageHeight;
 const sample=document.createElement('canvas'),ctx=sample.getContext('2d',{willReadFrequently:true});let output,paint;
 for(const r of effects){
  const x=Math.round(r.x*sx),y=Math.round(r.y*sy),w=Math.round((r.rotate?r.height:r.width)*sx),h=Math.round((r.rotate?r.width:r.height)*sy);
  if(w<16||h<16||x<0||y<0||x+w>width||y+h>height)continue;
  sample.width=w;sample.height=h;ctx.drawImage(source,x,y,w,h,0,0,w,h);
  const data=ctx.getImageData(0,0,w,h);
  if(!named(r)){let max=0,clear=0;for(let i=3;i<data.data.length;i+=4){max=Math.max(max,data.data[i]);if(data.data[i]<16)clear++;}if(max>=240||clear<w*h*.5)continue;}
  const edges=clippedEffectEdges(data.data,w,h),contour=softenCutContours(data.data,w,h,premultiplied);if(!edges.length&&!contour)continue;
  if(!output){output=document.createElement('canvas');output.width=width;output.height=height;paint=output.getContext('2d');paint.drawImage(source,0,0);output.skinEffectEdges=[];}
  featherEffectPixels(data.data,w,h,edges,premultiplied);paint.putImageData(data,x,y);output.skinEffectEdges.push({name:r.name,edges,contour});
 }
 return output||source;
}
