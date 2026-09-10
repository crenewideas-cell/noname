import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { sourceRoot, coreRoot, files } from './auditBranchCharacters.js';

// Content files are copied exclusively. Existing paths are never overwritten.
const hash = (b: Buffer) => crypto.createHash('sha256').update(b).digest('hex');
const output = path.join(coreRoot,'extension/分支武将');
const manifest: any[] = [];
const roots=['audio','image',...['EpicFX','Thunder','假装无敌','太虚幻境'].map(n=>'extension/'+n)];
for(const root of roots) for(const file of files(path.join(sourceRoot,root))) {
 const rel=path.relative(sourceRoot,file).replaceAll('\\','/');
 // Qingyao's animation/gameAsset/images trees are UI, skin and menu libraries;
 // its character factory uses root portraits and audio instead. Do not bundle
 // a second 10 GiB copy of those unrelated UI libraries.
 if(/^extension\/假装无敌\/(?:animation|gameAsset|images|手杀结算面板|手杀武将详细框)\//.test(rel)) continue;
 if(!/\.(?:jpg|jpeg|png|webp|gif|svg|mp3|ogg|wav|webm|mp4|json|atlas|skel|bin)$/i.test(file)) continue;
 const source=fs.readFileSync(file), sha256=hash(source);
 const installed = rel.replace(/^extension\/假装无敌\//, 'extension/清瑶葭绮/members/假装无敌/');
 const existing = path.join(coreRoot,installed);
 const shared = rel.startsWith('extension/') && fs.existsSync(existing) && hash(fs.readFileSync(existing)) === sha256;
 const intended = shared ? installed : rel.startsWith('extension/') ? 'extension/分支武将/assets/'+rel : rel;
 const dest=path.join(coreRoot,intended);
 let status='added', target=intended;
 if(fs.existsSync(dest)) {
  if(hash(fs.readFileSync(dest))===sha256)status='identical';
  else {status='preserved-conflict';target='extension/分支武将/assets/'+rel;}
 }
 const actual=path.join(coreRoot,target);
 if(!fs.existsSync(actual)){fs.mkdirSync(path.dirname(actual),{recursive:true});fs.copyFileSync(file,actual,fs.constants.COPYFILE_EXCL);}
 if(hash(fs.readFileSync(actual))!==sha256)throw new Error('Asset verification failed: '+target);
 manifest.push({source:rel,target,status,bytes:source.length,sha256});
}
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'asset-map.js'),`// Source paths resolve to preserved branch resources; existing assets are untouched.\nexport default ${JSON.stringify(Object.fromEntries(manifest.map(x=>[x.source,x.target])))};\n`);
fs.writeFileSync(path.join(output,'assets-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({files:manifest.length,bytes:manifest.reduce((n,x)=>n+x.bytes,0),status:manifest.reduce((r,x)=>(r[x.status]=(r[x.status]||0)+1,r),{})}));
