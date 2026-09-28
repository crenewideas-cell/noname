/** Convert the displayed seat centres to the actual line container's CSS
 * coordinates. offsetLeft/getLeft omit per-player zoom and transforms. */
export function playerLinePath(source, target, parent) {
 if (!parent?.getBoundingClientRect) return null;
 const box=parent.getBoundingClientRect();
 const sx=box.width/parent.offsetWidth,sy=box.height/parent.offsetHeight;
 if (!(sx>0&&sy>0&&Number.isFinite(sx)&&Number.isFinite(sy))) return null;
 const centre=node=>{
  const r=node.getBoundingClientRect();
  return [(r.left+r.width/2-box.left)/sx-(parent.clientLeft||0)+(parent.scrollLeft||0),
   (r.top+r.height/2-box.top)/sy-(parent.clientTop||0)+(parent.scrollTop||0)];
 };
 const path=[...centre(source),...centre(target)];
 return path.every(Number.isFinite)?path:null;
}
