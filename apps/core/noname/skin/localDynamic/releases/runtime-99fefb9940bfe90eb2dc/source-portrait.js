import {compileDecadeLayer} from './source-scene.js';

// Numeric attachment names cannot establish a full-body camera. For unchanged
// source rigs, the authored avatar placement is stronger evidence than fitting
// the union of horse, cloth, water and rectangular scenery cutouts.
export function sourcePortraitLayers(entry) {
 if(!entry.legacy?.beijing||entry.models?.length!==2||entry.scene||Object.keys(entry.composition||{}).length)return null;
 // Source-coordinate raster evidence currently covers the 3.8 JSON exporter.
 // Other exporters (including 4.0 supplements with placeholder positions) do
 // not inherit this camera policy just because they also use numeric names.
 if(!entry.models.every(m=>/^3\.8\./.test(m.version||'')&&m.skeleton.endsWith('.json')))return null;
 const configs=[entry.legacy.beijing,entry.legacy];
 for(let i=0;i<2;i++) {
  const m=entry.models[i],c=configs[i];
  if(m.sceneVariant||m.layerRegistration||m.layerCoordinateMismatch||!c?.name||!m.legacy)return null;
  const suffix='/'+c.name+(c.json?'.json':'.skel');
  if(!m.skeleton.endsWith(suffix)||m.legacy.name!==c.name)return null;
  if(c.width!=null||c.height!=null||c.clip||c.clipSlots?.length)return null;
 }
 return configs.map((c,i)=>compileDecadeLayer(c,i?'primary':'background'));
}
