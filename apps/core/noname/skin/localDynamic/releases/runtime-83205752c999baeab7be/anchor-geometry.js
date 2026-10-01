// Stable attachment correspondences also work for rigs with numeric names.
// They describe geometry only; no skin identity or hand-authored offsets.
export function attachmentCenters(skeleton){
 const result=[],seen=new Set();
 for(const slot of skeleton.slots){const a=slot.attachment,key=a?.region?.name||a?.name;
  if(!a?.region||!key||seen.has(key)||/^(?:eff|effect|texiao)[/_]/i.test(key))continue;
  const v=new Float32Array(a.worldVerticesLength||8);
  if(a.worldVerticesLength)a.computeWorldVertices(slot,0,v.length,v,0,2);else a.computeWorldVertices(slot.bone.matrix||parseFloat(skeleton.data?.version)>=4.1?slot:slot.bone,v,0,2);
  let x=0,y=0;for(let i=0;i<v.length;i+=2){x+=v[i];y+=v[i+1];}x/=v.length/2;y/=v.length/2;
  if(Number.isFinite(x)&&Number.isFinite(y)){seen.add(key);result.push({key,x,y,width:0,height:0});}
 }return result;
}
const median=list=>{const sorted=[...list].sort((a,b)=>a-b),m=Math.floor(sorted.length/2);return sorted.length%2?sorted[m]:(sorted[m-1]+sorted[m])/2;};
export function alignAttachmentPoints(source,target,height){
 const lookup=new Map(target.map(p=>[p.key,p])),pairs=source.filter(p=>lookup.has(p.key)).map(p=>[p,lookup.get(p.key)]).filter(pair=>pair.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
 if(pairs.length<6)return null;
 const sample=pairs.filter((_,i)=>i%Math.max(1,Math.ceil(pairs.length/40))===0),ratios=[];
 for(let i=0;i<sample.length;i++)for(let j=i+1;j<sample.length;j++){const d=Math.hypot(sample[i][0].x-sample[j][0].x,sample[i][0].y-sample[j][0].y),t=Math.hypot(sample[i][1].x-sample[j][1].x,sample[i][1].y-sample[j][1].y);if(d>5&&t>5)ratios.push(t/d);}
 if(!ratios.length)return null;const scale=median(ratios),x=median(pairs.map(([s,t])=>t.x-s.x*scale)),y=median(pairs.map(([s,t])=>height-t.y-s.y*scale));
 const residual=pairs.map(([s,t])=>Math.hypot(x+s.x*scale-t.x,height-y-s.y*scale-t.y)).sort((a,b)=>a-b);
 const xs=pairs.map(p=>p[1].x),ys=pairs.map(p=>p[1].y),span=Math.hypot(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys));
 if(!(scale>0)||residual[Math.floor(residual.length*.75)]>Math.max(8,span*.06))return null;
 return {x,y,scale,angle:0,matches:pairs.length,residual:median(residual)};
}
