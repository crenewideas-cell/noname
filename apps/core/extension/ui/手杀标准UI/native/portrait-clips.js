// Rounded contours in normalized coordinates keep the portrait and its frame
// aligned at every player zoom. Only the picture is clipped, not HP/ornaments.
export function installPortraitClips() {
 const ns='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(ns,'svg');
 svg.setAttribute('width','0');svg.setAttribute('height','0');
 svg.style.cssText='position:absolute;pointer-events:none';
 svg.setAttribute('aria-hidden','true');
 const defs=document.createElementNS(ns,'defs');svg.append(defs);
 const paths={
  'ss-solo-clip':'M.08 0 H.92 Q1 0 1 .045 V.955 Q1 1 .92 1 H.08 Q0 1 0 .955 V.18 Q0 .14 .065 .125 Q.10 .115 .065 .10 Q0 .085 0 .045 Q0 0 .08 0 Z',
  'ss-left-clip':'M.16 0 H1 V1 H.16 Q0 1 0 .955 V.18 Q0 .14 .13 .125 Q.20 .115 .13 .10 Q0 .085 0 .045 Q0 0 .16 0 Z',
  'ss-right-clip':'M0 0 H.84 Q1 0 1 .045 V.955 Q1 1 .84 1 H0 Z',
 };
 for(const [id,d] of Object.entries(paths)){
  const clip=document.createElementNS(ns,'clipPath'),path=document.createElementNS(ns,'path');
  clip.id=id;clip.setAttribute('clipPathUnits','objectBoundingBox');path.setAttribute('d',d);clip.append(path);defs.append(clip);
 }
 document.body.append(svg);
 return()=>svg.remove();
}
