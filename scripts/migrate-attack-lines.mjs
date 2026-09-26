// Import only the supplied artwork; never evaluate either legacy extension.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import JSZip from '../apps/core/node_modules/jszip/lib/index.js';
const zipPath='temp/指示线.zip',reference='temp/三国杀·琉璃版5.5/resources/app/extension/祖安武将/extension.js';
const goldPath='temp/三国杀·琉璃版5.5/resources/app/extension/祖安武将/pointer/yulongLineXy/line.png';
const archive=new JSZip(await fs.readFile(zipPath)),root='apps/core/image/pointer/migrated';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const records=[];
for(const name of ['yulongLineXy','jingdianLineXy','baojilinexy']){
 const source=`pointer/${name}/line.png`,bytes=archive.files[source].asNodeBuffer(),file=`${root}/${name}/line.png`;
 await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes);
 records.push({source,file:file.slice('apps/core/'.length),sha256:hash(bytes)});
}
if(hash(await fs.readFile(goldPath))!==records.find(row=>row.source.includes('yulongLineXy')).sha256)throw Error('Reference gold artwork differs from ZIP; import the reference separately.');
await fs.writeFile(`${root}/SOURCE.json`,JSON.stringify({
 sources:[{file:reference,sha256:hash(await fs.readFile(reference)),implementation:'default guanjie -> yulongLineXy for local player; gold texture, height 60, time 1400ms'},
 {file:zipPath,sha256:hash(await fs.readFile(zipPath)),scriptSha256:hash(archive.files['extension.js'].asNodeBuffer())}],
 handLineArtwork:{source:goldPath,sha256:hash(await fs.readFile(goldPath)),configKey:'Liuli',label:'手杀指示线'},
 credits:'原作者：琉璃版 5.5 祖安武将指示线（原注释致谢扩展OL、玄武江湖）；指示线扩展（原注释致谢极光的扩展OL、玄武江湖）',
 notes:'ZIP 仅包含三张 line.png；没有 0–7.png 帧序列。移植已有线条，不请求缺失帧，也不执行原扩展的规则钩子或 eval。暴击素材可单独选择。',
 resources:records,
},null,2)+'\n');
console.log(`Imported ${records.length} original attack-line textures (SHA-256 recorded).`);
