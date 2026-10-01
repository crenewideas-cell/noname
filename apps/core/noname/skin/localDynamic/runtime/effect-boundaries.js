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
 const fade=Math.max(3,Math.min(16,Math.round(Math.min(width,height)*.06)));
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  let distance=fade;
  for(const edge of edges)distance=Math.min(distance,edge==='left'?x:edge==='right'?width-1-x:edge==='top'?y:height-1-y);
  if(distance>=fade)continue;
  const t=distance/fade,alpha=t*t*(3-2*t),i=(y*width+x)*4;
  pixels[i+3]=Math.round(pixels[i+3]*alpha);
  if(premultiplied)for(let c=0;c<3;c++)pixels[i+c]=Math.round(pixels[i+c]*alpha);
 }
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
  const edges=clippedEffectEdges(data.data,w,h);if(!edges.length)continue;
  if(!output){output=document.createElement('canvas');output.width=width;output.height=height;paint=output.getContext('2d');paint.drawImage(source,0,0);output.skinEffectEdges=[];}
  featherEffectPixels(data.data,w,h,edges,premultiplied);paint.putImageData(data,x,y);output.skinEffectEdges.push({name:r.name,edges});
 }
 return output||source;
}
