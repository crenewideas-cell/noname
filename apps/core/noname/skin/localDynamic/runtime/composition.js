// Reviewed presentation metadata for exports whose avatar parameters and raw
// artwork use different coordinate systems. Never change the skeleton itself.
export function compositionFor(entry) {
  return entry.composition || {};
}
// An entrance camera is a one-shot action, not a background's idle loop.
// Respect every other declared animation, including custom idle names.
export function idleAnimation(model, names, background=false) {
  if(background&&/^(chuchang|entrance|appear|intro)$/i.test(model.animation||'')){
    const idle=names.find(n=>/^(beijing|background|idle|normal|daiji|stand)$/i.test(n));
    if(idle)return idle;
  }
  return names.includes(model.animation)?model.animation:names.find(n=>/^(idle|normal|daiji|play|stand)$/i.test(n))||names[0];
}
// Some standalone avatar rigs explicitly pair an image backdrop with a
// rectangular body mask. That mask is their authored viewport; smoke beyond
// it must not widen the camera and expose the internally cut body textures.
export function portraitClipBounds(entry, skeleton) {
  if(!entry.staticBackground||entry.models?.length!==1||!skeleton)return;
  if(!skeleton.data.animations.some(a=>/(?:^|_)(?:touxiang|avatar|portrait)(?:_|$)/i.test(a.name)))return;
  if(/(?:touxiang|avatar|portrait)/i.test(entry.models[0].animation||''))return;
  const boxes=[];
  for(const slot of skeleton.slots){
    const a=slot.attachment;
    if(!a?.endSlot||a.worldVerticesLength!==8)continue;
    const start=skeleton.slots.indexOf(slot),end=skeleton.slots.findIndex(s=>s.data===a.endSlot);
    if(end-start<5)continue;
    const v=new Float32Array(8);a.computeWorldVertices(slot,0,8,v,0,2);
    const xs=v.filter((_,i)=>i%2===0),ys=v.filter((_,i)=>i%2===1),x=Math.min(...xs),y=Math.min(...ys);
    const width=Math.max(...xs)-x,height=Math.max(...ys)-y;
    let area=0;for(let i=0;i<4;i++){const j=(i+1)%4;area+=v[i*2]*v[j*2+1]-v[j*2]*v[i*2+1];}
    if(width>0&&height>0&&Math.abs(area)/2>=width*height*.995)boxes.push({x,y,width,height});
  }
  return boxes.length===1?boxes[0]:undefined;
}
// The legacy avatar origin encodes which part of a wide scene contains the
// character. Reuse that focus without rotating/scaling individual scene layers.
// 180 is the reference height used by the existing Qianhuan avatar adapter.
export function sceneFocus(entry, bounds, aspect, subjectX) {
  const meta=entry.models?.at(-1),config=meta?.legacy;
  if(!entry.legacy?.beijing||!config||compositionFor(entry).focus)return bounds;
  if(meta.sceneVariant&&!Number.isFinite(subjectX))return bounds;
  const height=180,width=height*aspect,scale=config.scale||1;
  const coord=(v,size)=>Array.isArray(v)?v[0]+v[1]*size:typeof v==='number'?v:size/2;
  const centerX=Number.isFinite(subjectX)?subjectX:bounds.x+bounds.width/2+(width/2-coord(config.x,width))/scale;
  const cropWidth=Math.min(bounds.width,bounds.height*aspect);
  // Keep the camera inside the painting. Vertical framing remains the full
  // background height so avatar edits cannot expose off-painting cut edges.
  const x=Math.max(bounds.x+cropWidth/2,Math.min(bounds.x+bounds.width-cropWidth/2,centerX));
  return {...bounds,x:x-bounds.width/2};
}
// Prefer an explicitly named face mesh as the portrait's horizontal anchor.
// Numeric/unnamed rigs retain the focus supplied by their avatar configuration.
export function subjectBounds(skeleton, transform={}, allowCompactPrefix=false) {
  if(!skeleton)return;
  if(allowCompactPrefix){const known=subjectBounds(skeleton,transform);if(known)return known;}
  const candidates=[];
  const names=skeleton.slots.map(s=>s.attachment?.name?.split('/').at(-1)||'');
  for(const slot of skeleton.slots){
    const a=slot.attachment,name=a?.name?.split('/').at(-1)||'';
    // Accept the exporter prefixes for the person's head, not arbitrary
    // *-tou suffixes (companions/animals can have much larger head meshes).
    const plain=/^(?:(?:r|mr|ren|renwu|tou\d*|head\d*|face\d*)[_-]?)?(?:\d+[_-]?)?(?:tou|lian|head|face|naodai|mianbu|头|脸)(?:[_-]?\d+)?$/i.test(name);
    const prefix=name.match(/^(.*[_-])(?:tou|lian|head|face|naodai|mianbu)(?:[_-]?\d+)?$/i)?.[1]
      ||(allowCompactPrefix&&name.match(/^([a-z]{1,3})(?:tou|lian|head|face)(?:[_-]?\d+)?$/i)?.[1]);
    const mainPrefix=prefix&&names.filter(n=>n.startsWith(prefix)).length>=Math.max(5,names.length*.35);
    if(!a?.region||(!plain&&!mainPrefix)||slot.color?.a===0||a.color?.a===0)continue;
    const v=new Float32Array(a.worldVerticesLength||8);
    if(a.worldVerticesLength)a.computeWorldVertices(slot,0,a.worldVerticesLength,v,0,2);else a.computeWorldVertices(slot.bone.matrix||parseFloat(skeleton.data?.version)>=4.1?slot:slot.bone,v,0,2);
    const xs=v.filter((_,i)=>!(i%2)),ys=v.filter((_,i)=>i%2);
    const box={x:Math.min(...xs),y:Math.min(...ys)};
    box.width=Math.max(...xs)-box.x;box.height=Math.max(...ys)-box.y;
    candidates.push({area:box.width*box.height,box:transformBounds(box,transform)});
  }
  candidates.sort((a,b)=>b.area-a.area);
  const box=candidates[0]?.box;if(box)return box;
  // Numeric attachment names carry no facial semantics. A named body chain
  // still supplies a torso anchor; scenery branches must not shift its center.
  if(names.filter(n=>/^\d+(?:[_-]\d+)*$/.test(n)).length>names.length*.5){
    const bone=skeleton.bones?.find(b=>b.data.length>0&&/^(?:xingxiang|zhixin|renwu)\d*$/i.test(b.data.name));
    if(bone)return transformBounds({x:bone.worldX,y:bone.worldY,width:0,height:0},transform);
  }
}
export function faceAnchor(skeleton, transform={}) {
  const box=subjectBounds(skeleton,transform);
  return box?box.x+box.width/2:undefined;
}
export function inferredAvatarZoom(entry, layer) {
  const m=entry.models?.at(-1);
  return !!(m&&!m.sceneVariant&&!m.layerRegistration&&/(?:^|\/)daiji2\.(?:skel|json)$/i.test(m.skeleton)&&layer?.scale>1);
}
export function cameraSubjectX(entry, subject) {
  if(!subject)return;
  const x=entry.models?.at(-1)?.legacy?.x;
  // A numeric bone is a torso hint, not a detected face. An explicit off-frame
  // avatar placement deliberately looks toward the edge of a wide scene.
  if(!subject.width&&!subject.height&&Array.isArray(x)&&(x[1]<0||x[1]>1))return;
  return subject.x+subject.width/2;
}
export function avatarLayerTransform(entry, index, bounds, background) {
  const explicit=compositionFor(entry).layers?.[index];
  if(explicit)return explicit;
  if(!index||!entry.legacy?.beijing||!background)return undefined;
  if(entry.models[index].layerRegistration)return entry.models[index].layerRegistration.transform;
  const variant=entry.models[index].sceneVariant;
  if(variant?.restoresLimbs||variant?.restoresCoverage)return variant.transform;
  if(variant?.transform){
    const models=entry.models.map((m,i)=>i===index?{...m,skeleton:variant.source,sceneVariant:undefined}:m);
    const outer=avatarLayerTransform({...entry,models},index,variant.avatarBounds,background)||{};
    const a=variant.transform,scale=outer.scale??1,angle=(outer.angle||0)*Math.PI/180;
    return {scale:scale*a.scale,angle:(outer.angle||0)+(a.angle||0),x:(outer.x||0)+scale*(Math.cos(angle)*a.x-Math.sin(angle)*a.y),y:(outer.y||0)+scale*(Math.sin(angle)*a.x+Math.cos(angle)*a.y)};
  }
  if(variant)return undefined;
  const config=entry.models[index].legacy||{},bg=entry.models[0].legacy||{};
  const ratio=(config.scale||1)/(bg.scale||1);
  // daiji2 is the compact avatar export; a full scene (daiji / XingXiang)
  // already shares its background's coordinates. A UI/edition flag cannot
  // identify this distinction and must not change otherwise identical rigs.
  const avatarExport=/(?:^|\/)daiji2\.(?:skel|json)$/i.test(entry.models[index].skeleton||'');
  const avatarPresentation=entry.models[index].avatarPresentation??!!config.shizhounian;
  if(avatarExport&&avatarPresentation&&bounds.height<background.height*.8&&ratio>1.3){
    const scale=Math.min(ratio,background.height/bounds.height*1.4);
    const top=background.y+background.height*.94;
    return {scale,y:Math.min(0,top-(bounds.y+bounds.height)*scale)};
  }
  if(bounds.height>background.height*1.8&&ratio<.7)return {scale:ratio};
}
// A background rig can contain cloth/effects outside the base painting or
// several scrolling copies of that painting. Those are not camera extents.
export function paintingBounds(skeleton, subject) {
  if(!skeleton)return null;
  const slots=skeleton.slots.filter(s=>s.attachment?.region&&s.data.blendMode===0&&(s.color?.a??1)>.05&&(s.attachment.color?.a??1)>.05);
  const counts=new Map();for(const s of slots)counts.set(s.attachment.name,(counts.get(s.attachment.name)||0)+1);
  const area=s=>s.attachment.region.width*s.attachment.region.height;
  const ranked=[...slots].sort((a,b)=>area(b)-area(a));
  const named=s=>!/(?:^|[_/-])(?:tx|effect|particle)(?:[_/-]|\d|$)/i.test(s.attachment.name)&&/(?:^|[_/-])(?:\d*bg|background|beijing)(?:[_\d-]|$)/i.test(s.attachment.name);
  let candidates=slots.filter(s=>named(s)||(counts.get(s.attachment.name)>1&&s.attachment.region.width>=s.attachment.region.height*.95&&area(s)>=area(ranked[0])*.35));
  // A numeric base image overwhelmingly larger than all its effect textures is
  // also unambiguous. Composite scenery with several large pieces is left intact.
  if(!candidates.length&&ranked.length&&(!ranked[1]||area(ranked[0])>=area(ranked[1])*4))candidates=[ranked[0]];
  if(!candidates.length)return null;
  candidates.sort((a,b)=>b.attachment.region.width*b.attachment.region.height-a.attachment.region.width*a.attachment.region.height);
  const name=candidates[0].attachment.name;
  const boxes=candidates.filter(s=>s.attachment.name===name).map(slot=>{
    const a=slot.attachment,v=new Float32Array(a.worldVerticesLength||8);
    if(a.worldVerticesLength)a.computeWorldVertices(slot,0,a.worldVerticesLength,v,0,2);else a.computeWorldVertices(slot.bone.matrix||parseFloat(skeleton.data?.version)>=4.1?slot:slot.bone,v,0,2);
    const xs=[],ys=[];for(let i=0;i<v.length;i+=2){xs.push(v[i]);ys.push(v[i+1]);}
    const x=Math.min(...xs),y=Math.min(...ys);return {x,y,width:Math.max(...xs)-x,height:Math.max(...ys)-y};
  });
  const result={...boxes[0]};
  if(boxes.length>1){
    const sorted=[...boxes].sort((a,b)=>a.x-b.x),tolerance=Math.max(result.width,result.height)*.04;
    const left=Math.max(...boxes.map(b=>b.x)),bottom=Math.max(...boxes.map(b=>b.y));
    const right=Math.min(...boxes.map(b=>b.x+b.width)),top=Math.min(...boxes.map(b=>b.y+b.height));
    // Some exporters stack slightly scaled copies for a moving backdrop. Fit
    // their shared painted area, not the decorative objects outside it.
    if(right>left&&top>bottom&&(right-left)*(top-bottom)>=Math.min(...boxes.map(b=>b.width*b.height))*.8)
      return {x:left,y:bottom,width:right-left,height:top-bottom};
    // Repeated leaves, ornaments and characters are not a scrolling backdrop.
    if(!sorted.every((b,i)=>Math.abs(b.y-result.y)<tolerance&&Math.abs(b.width-result.width)<tolerance&&Math.abs(b.height-result.height)<tolerance&&(!i||Math.abs(b.x-sorted[i-1].x-result.width)<tolerance)))return null;
  }
  if(boxes.length>1&&subject){
    const left=Math.min(...boxes.map(b=>b.x)),right=Math.max(...boxes.map(b=>b.x+b.width));
    result.x=Math.max(left,Math.min(right-result.width,subject.x+subject.width/2-result.width/2));
  }
  return result;
}
export function transformBounds(bounds, transform = {}) {
  const scale = transform.scale ?? 1, angle = (transform.angle || 0) * Math.PI / 180;
  const c = Math.cos(angle) * scale, s = Math.sin(angle) * scale;
  const points = [[bounds.x, bounds.y], [bounds.x + bounds.width, bounds.y],
    [bounds.x, bounds.y + bounds.height], [bounds.x + bounds.width, bounds.y + bounds.height]]
    .map(([x, y]) => [c * x - s * y + (transform.x || 0), s * x + c * y + (transform.y || 0)]);
  const x = Math.min(...points.map(p => p[0])), y = Math.min(...points.map(p => p[1]));
  return { x, y, width: Math.max(...points.map(p => p[0])) - x, height: Math.max(...points.map(p => p[1])) - y };
}
