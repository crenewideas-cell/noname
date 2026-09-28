import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {compileDecadeScene} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
import {compileSourceActions} from '../apps/core/noname/skin/localDynamic/runtime/source-actions.js';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const animationReference=process.env.SKIN_ANIMATION_REFERENCE?JSON.parse(await fs.readFile(process.env.SKIN_ANIMATION_REFERENCE)):[];
const binaryReference=process.env.SKIN_BINARY_REFERENCE?(await fs.readFile(process.env.SKIN_BINARY_REFERENCE,'utf8')).trim().split('\n').map(JSON.parse):[];
const family=process.env.SKIN_REFERENCE_FAMILY||'3.8';
if(!['3.6','3.8','4.0'].includes(family))throw Error('Unsupported source scene family');
const out=path.join(run,process.env.SKIN_CANDIDATE_LABEL||'scene-candidate');await fs.mkdir(path.join(out,'entries'),{recursive:true});
const results=[];const sha=b=>createHash('sha256').update(b).digest('hex');
for(const e of inventory.entries.filter(e=>e.pack==='无名杀基础扩展')){
 const row={id:e.id,status:'outside-category'};results.push(row);
 if(!e.sourceModelFacts.length||!e.sourceModelFacts.every(m=>m.version?.startsWith(family+'.')&&(family!=='3.8'||m.format==='json')))continue;
 row.status='requires-review';
 try{
  if(e.catalogAvailable===false)throw Error('Existing unavailable entry retained, not activated');
  if(new Set(e.sourceConfigs.map(c=>JSON.stringify(c.config))).size!==1)throw Error('Missing or differing owner source configs');
  const config=e.sourceConfigs[0].config;
  const reference=animationReference.find(r=>r.id===e.id&&r.status==='captured'&&r.sourceConfigHash===e.sourceConfigHash);
  const scene=compileDecadeScene(config,{sourceConfigHash:e.sourceConfigHash,sourceFile:e.sourceConfig.path,owners:e.sourceConfigs.map(c=>c.owner)});
  if(scene.layers.length!==e.sourceModels.length)throw Error('Additional layer resources require inventory verification');
  if(scene.layers.some(l=>l.display.clip||l.display.clipSlots.length||Array.isArray(l.playback.declaredAction)))throw Error('Clip/action sequence not validated in this category');
  const models=[],allAnimations=[];
  for(let i=0;i<e.sourceModels.length;i++){
   const m=e.sourceModels[i],facts=e.sourceModelFacts[i];if(facts.error)throw Error(facts.error);
   for(const [relative,expected] of [[m.skeleton,facts.skeleton.sha256],[m.atlas,facts.atlas.sha256]]){
    const installed=path.resolve('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展',relative);
    if(sha(await fs.readFile(installed))!==expected)throw Error('Installed source identity differs: '+relative);
   }
   const referenceLayer=reference?.layers.find(l=>l.name===scene.layers[i].resource.name&&l.version===facts.version);
   const binary=binaryReference.find(r=>r.referenceStatus==='decoded'&&r.localStatus==='decoded'&&r.structureMatches&&r.skeletonSHA256===facts.skeleton.sha256&&r.atlasSHA256===facts.atlas.sha256&&r.version===facts.version);
   const animations=facts.animations||referenceLayer?.animations?.map(a=>a.name)||binary?.animations?.map(a=>a.name);
   if(!animations?.length)throw Error('Source animations require independent binary decode');
   allAnimations.push(...animations);
   const declared=scene.layers[i].playback.declaredAction;if(declared&&!animations.includes(declared))throw Error('Declared action missing: '+declared);
   models.push({...m,version:facts.version,animation:declared||animations[0],skin:m.legacy?.skin});
  }
  scene.viewport={referenceHeight:180,policy:'qianhuan-native-height-ratio',evidence:'apps/core/extension/ui/千幻聆音/dynamic-core.js uses node.clientHeight / 180; matrix contract verified against APNode',status:'candidate policy; not certified as universal author viewport'};
  if(reference)scene.provenance.animationReference={report:process.env.SKIN_ANIMATION_REFERENCE,sourceConfigHash:reference.sourceConfigHash};
  if(family==='3.6')scene.provenance.binaryReference={report:process.env.SKIN_BINARY_REFERENCE,limitation:'Animations from local decode whose structure was compared with official Java; independent raster and source viewport certification remain pending'};
  if(process.env.SKIN_SOURCE_ACTIONS==='1'){
   scene.actionContract=compileSourceActions(scene);
   for(const action of scene.actionContract.records.filter(a=>a.status==='candidate'))allAnimations.push(action.command);
  }
  const entry={...e.catalog,...e.effective,type:'spine',legacy:structuredClone(config),models,scene,idle:models.at(-1).animation,motions:[...new Set(allAnimations)]};
  delete entry.composition;delete entry.inferredBackground;
  await fs.writeFile(path.join(out,'entries',e.id+'.json'),JSON.stringify(entry));row.status='candidate';row.layers=models.length;row.sourceConfigHash=e.sourceConfigHash;
 }catch(error){row.reason=String(error);}
}
const ids=results.filter(r=>r.status==='candidate').map(r=>r.id);
await fs.writeFile(path.join(out,'ids.json'),JSON.stringify(ids));
const report={category:'source-declared Spine '+family+' layers with one unambiguous source config',entries:results.length,candidates:ids.length,requiresReview:results.filter(r=>r.status==='requires-review').length,productionInstalled:false,acceptance:'coordinate candidate only; actions, raster correctness and full category acceptance pending',results};
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,results:undefined}));
