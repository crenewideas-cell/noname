import fs from 'node:fs/promises';
import path from 'node:path';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const read=async p=>JSON.parse(await fs.readFile(path.join(run,p)));
const provenance=await read('source-provenance.json'),reference=[];
const references=process.env.SKIN_COMPLETE_REFERENCES?process.env.SKIN_COMPLETE_REFERENCES.split(',').map(v=>{const [folder,count]=v.split(':');if(!folder||!(Number(count)>0))throw Error('Reference folder requires explicit expected count');return[folder,Number(count)];}):[['spine38-pma-reference',51],['spine38-historical-pma-reference',202]];
for(const [folder,expected] of references){
 const report=await read(folder+'/report.json'),runtime=await read(folder+'/provenance.json');
 if(report.length!==expected||!runtime.alphaContract)throw Error('Incomplete reference batch: '+folder);
 reference.push(...report.map(r=>({...r,referenceFile:folder+'/report.json',referenceRuntime:runtime})));
}
const out=path.join(run,process.env.SKIN_COMPLETE_OUTPUT||'complete-artwork-pma-candidate');await fs.mkdir(path.join(out,'entries'),{recursive:true});
const rows=[];
for(const r of reference){
 const row={id:r.id,status:'pending'};rows.push(row);
 try{
  if(r.status!=='captured')throw Error('Independent reference capture failed');
  if(provenance.entries.find(e=>e.id===r.id)?.category!=='20260919-supplement')throw Error('Not an uncalibrated source supplement');
  const entry=await read((process.env.SKIN_SCENE_CANDIDATE||'scene-candidate')+'/entries/'+r.id+'.json'),scene=entry.scene;
  if(scene.layers.length!==1||r.layers.length!==1)throw Error('Single layer category only');
  const c=scene.layers[0].source;
  if(c.angle||c.flipX||c.flipY||c.width||c.height||c.background||scene.layers[0].display.hideSlots.length||Object.keys(scene.actions).length)throw Error('Additional source semantics require separate validation');
  const bounds=r.layers[0].cameraBounds;if(!bounds)throw Error('Missing independent camera evidence');
  scene.provenance.placementOrigin='20260919-supplement';
  scene.provenance.referenceRuntime={commit:r.referenceRuntime.commit,sha256:r.referenceRuntime.sha256,historical:!!r.referenceRuntime.historicalReference};
  scene.viewport={policy:'complete-artwork',bounds,actionCameras:r.layers[0].actionCameras,reference:r.referenceFile,samples:r.layers[0].boundSamples,limitations:['Discrete action samples do not prove bounds between samples; continuous temporal acceptance pending',...(r.referenceRuntime.historicalReference?['Historical 2019 runtime accepts the original 3.8.75 version; latest runtime exporter warning remains recorded']:[])]};
  scene.conversions.push({rule:'uncalibrated-supplement-complete-artwork',before:scene.layers[0].placement,after:{camera:'fixed per-action union of independently rendered nontransparent source pixels'},evidence:'source-provenance.json: source explicitly describes supplement positions as needing adjustment'});
  await fs.writeFile(path.join(out,'entries',r.id+'.json'),JSON.stringify(entry));row.status='candidate';row.bounds=bounds;
 }catch(error){row.error=String(error);}
}
await fs.writeFile(path.join(out,'ids.json'),JSON.stringify(rows.filter(r=>r.status==='candidate').map(r=>r.id)));
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify({category:'Single-layer source supplements, explicit complete-artwork policy, separately recorded pinned official references',installed:false,rows},null,2));console.log(JSON.stringify({total:rows.length,candidates:rows.filter(r=>r.status==='candidate').length,pending:rows.filter(r=>r.status!=='candidate')}));
