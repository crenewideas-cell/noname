import fs from 'node:fs/promises';
import path from 'node:path';
import {randomInt, randomUUID, createHash} from 'node:crypto';
import keyCharacters from '../apps/core/character/key/character.js';

const core=path.resolve('apps/core');
const nuyanRoot=path.join(core,'extension/packs/怒焰三国');
const nuyanManifest=path.join(nuyanRoot,'image/skin-sets/manifest.json');
const qingshanSource=path.resolve('temp/静态皮肤_青山抚媚');
const keySource=path.resolve('temp/静态皮肤_KEY社');
const keyRoot=path.join(core,'extension/packs/键社/image/skin-sets');
const keyResourceRoot='extension/键社/image/skin-sets/';
const keyManifest=path.join(keyRoot,'manifest.json');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readJSON=async file=>JSON.parse(await fs.readFile(file,'utf8'));
async function writeText(file,text){
 const temporary=file+'.'+randomUUID()+'.tmp';
 try{
  await fs.writeFile(temporary,text,{flag:'wx'});
  await fs.rename(temporary,file);
 }finally{await fs.unlink(temporary).catch(error=>{if(error.code!=='ENOENT')throw error;});}
}
const writeJSON=(file,data)=>writeText(file,JSON.stringify(data,null,2)+'\n');
async function files(root,prefix=''){
 const result=[];
 for(const item of await fs.readdir(path.join(root,prefix),{withFileTypes:true})){
  const relative=path.posix.join(prefix,item.name);
  if(item.isDirectory())result.push(...await files(root,relative));
  else if(/\.(jpe?g|png|webp)$/i.test(item.name))result.push(relative);
 }
 return result;
}
async function copyVerified(source,destination){
 const bytes=await fs.readFile(source);await fs.mkdir(path.dirname(destination),{recursive:true});
 try{await fs.writeFile(destination,bytes,{flag:'wx'});}catch(error){if(error.code!=='EEXIST'||hash(await fs.readFile(destination))!==hash(bytes))throw error;}
 if(hash(await fs.readFile(destination))!==hash(bytes))throw Error('复制校验失败：'+destination);
 return hash(bytes);
}

async function supplementNuyan(){
 const manifest=await readJSON(nuyanManifest),current=manifest.sets.find(set=>set.id==='nuyan-qingshan'),old=manifest.sets.find(set=>set.id==='nuyan-original');
 const additions=[['nysgs_yangwan','怒焰杨婉'],['nysgs_malingli','怒焰马伶俐'],['nysgs_huan_sunshangxiang','怒焰幻孙尚香'],['nysgs_zhurong','怒焰祝融']];
 const pool=(await files(qingshanSource)).filter(file=>/\.jpg$/i.test(file));
 const used=new Set(manifest.allocations.map(row=>row.sha256));
 for(const [id,name] of additions){
  if(current.entries[id])continue;
  let relative,sha256;
  do{if(!pool.length)throw Error('没有足够的独立 JPG 原画');relative=pool.splice(randomInt(pool.length),1)[0];sha256=hash(await fs.readFile(path.join(qingshanSource,relative)));}while(used.has(sha256));
  used.add(sha256);
  const destination='qingshan/'+id+'.jpg',originalDestination='image/character/'+id+'.jpg';
  await copyVerified(path.join(qingshanSource,relative),path.join(nuyanRoot,'image/skin-sets',destination));
  await copyVerified(path.join(qingshanSource,relative),path.join(nuyanRoot,originalDestination));
  const ids=id==='nysgs_zhurong'?[id,'nysgs_jie_zhurong']:[id];
  for(const character of ids){
   current.entries[character]={name:'青山抚媚',path:'extension/怒焰三国/image/skin-sets/'+destination};
   // No historical original exists for these four: the new base portrait is the fallback.
   old.entries[character]={name:'补全原画',path:'extension/怒焰三国/'+originalDestination};
   manifest.characters[character]={name:character===id?name:'怒焰界祝融',sex:'female',form:false};
  }
  manifest.allocations.push({characters:ids,source:relative,random:true,destination,sha256,originalDestination,supplement:true});
  manifest.femaleCharacters+=ids.length;
  manifest.randomAssigned++;manifest.remainingSourceCount--;
  await writeJSON(nuyanManifest,manifest);
 }
 console.log('怒焰补全：4 张新原画、5 个武将 ID；剩余资源',manifest.remainingSourceCount);
}

async function importKey(){
 const translations=await fs.readFile(path.join(core,'character/key/translate.js'),'utf8');
 const names=Object.fromEntries([...translations.matchAll(/^\s*(\w+):\s*"([^"\r\n]+)"/gm)].map(match=>[match[1],match[2]]));
 const normalize=name=>name.normalize('NFKC').replaceAll('瀬','濑');
 const aliases={'之濑琴美':'key_kotomi','松下五段':'key_godan','纹希·文德斯':'key_tsumugi'};
 const nameToIds=new Map();
 for(const id of Object.keys(keyCharacters))if(names[id]){
  const name=normalize(names[id]);nameToIds.set(name,[...(nameToIds.get(name)||[]),id]);
 }
 let manifest;
 try{manifest=await readJSON(keyManifest);}catch(error){if(error.code!=='ENOENT')throw error;}
 manifest??={version:1,pack:'键社',packId:'key',resourceRoot:keyResourceRoot,sourceDirectory:'temp/静态皮肤_KEY社',characters:{},allocations:[],sets:[]};
 const current=manifest.sets.find(set=>set.id==='key-key-studio')||{id:'key-key-studio',name:'键社 · 键社新装',pack:'键社',packId:'key',entries:{}};
 const old=manifest.sets.find(set=>set.id==='key-original')||{id:'key-original',name:'键社 · 旧版皮肤',pack:'键社',packId:'key',entries:{}};
 const planned=[];
 const sourceFiles=await files(keySource);
 let duplicates=0;
 for(const file of sourceFiles){
  const sourceName=path.basename(file,path.extname(file)),alias=aliases[sourceName];
  const ids=alias?[alias]:nameToIds.get(normalize(sourceName));
  if(ids?.length!==1)throw Error('无法唯一映射中文名称：'+file);
  const id=ids[0],name=id==='key_umi'?'加藤羽未':normalize(names[id]);
  const previous=manifest.allocations.find(row=>row.character===id);
  if(previous){
   if(previous.source!==file||hash(await fs.readFile(path.join(keySource,file)))!==previous.sha256)throw Error('已分配武将的源图发生变化，请明确是否替换：'+file);
   if(hash(await fs.readFile(path.join(keyRoot,previous.destination)))!==previous.sha256)throw Error('已分配目标图片发生变化：'+id);
   duplicates++;continue;
  }
  if(planned.some(row=>row.id===id))throw Error('同一武将有多个源文件：'+id);
  const originalId=id==='key_umi2'?'key_umi':id;
  await fs.access(path.join(core,'image/character',originalId+'.jpg'));
  const match=alias?'显式名称映射':sourceName===names[id]?'exact':'NFKC／瀬濑字形归一';
  planned.push({file,id,name,sourceName,originalId,match});
 }
 await fs.mkdir(keyRoot,{recursive:true});
 for(const {file,id,name,sourceName,originalId,match} of planned){
  const destination='new/'+id+path.extname(file).toLowerCase();
  const sha256=await copyVerified(path.join(keySource,file),path.join(keyRoot,destination));
  const originalDestination='original/'+id+'.jpg';
  const originalSha256=await copyVerified(path.join(core,'image/character',originalId+'.jpg'),path.join(keyRoot,originalDestination));
  current.entries[id]={name:name+' · 键社新装',path:keyResourceRoot+destination};
  old.entries[id]={name:id===originalId?'经典原画':'经典原画（共用羽未原画）',path:keyResourceRoot+originalDestination};
  manifest.characters[id]={name,sex:keyCharacters[id].sex,form:!!keyCharacters[id].isUnseen,displayName:name};
  manifest.allocations.push({source:file,sourceName,character:id,characterName:name,destination,sha256,match,originalId,originalDestination,originalSha256});
 }
 for(const set of [old,current])if(set.entries.key_umi&&set.entries.key_umi2)set.entries.key_umi.variants={key_umi2:set.entries.key_umi2.path};
 for(const set of [old,current])for(const [id,character] of Object.entries(keyCharacters)){
  const form=character.dualSideCharacter;
  if(!character.isUnseen&&form&&set.entries[id]&&set.entries[form])set.entries[id].variants={...set.entries[id].variants,[form]:set.entries[form].path};
 }
 manifest.sets=[old,current];manifest.initialSourceCount??=sourceFiles.length;
 manifest.allocatedSourceCount=manifest.allocations.length;
 manifest.missingCharacters=Object.keys(keyCharacters).filter(id=>!current.entries[id]).map(id=>({id,name:normalize(names[id]||id)}));
 await writeJSON(keyManifest,manifest);await writeMapping(manifest);
 console.log('键社映射完成：新增',planned.length,'张，重复素材',duplicates,'张；累计',manifest.allocations.length,'张；缺少',manifest.missingCharacters.length,'名角色');
 console.log('尚缺：'+(manifest.missingCharacters.map(row=>row.name+'（'+row.id+'）').join('、')||'无'));
}

async function writeMapping(manifest){
 const count=manifest.allocations.length;
 const lines=['# 键社 · 键社新装：中文名称映射','',
  `在皮肤管理器选择“键社”，点击“键社 · 键社新装 → 一键应用整套”。也可切换到“键社 · 旧版皮肤”。新套装覆盖 ${count} 个角色 ID，其余键社角色保留原选择。`,'',
  '来源：`temp/静态皮肤_KEY社`。映射依据本体 `character/key/translate.js`，使用精确名称、NFKC 和“瀬／濑”字形归一，以及下述显式名称映射，未进行随机匹配。所有图片原样复制，清单保存 SHA-256。使用 `--consume` 时，仅在确认已导入图片一致后移除 temp 源文件。','',
  '名称差异：`之濑琴美 → 一之濑琴美（key_kotomi）`、`松下五段 → 松下护騨（key_godan）`、`纹希·文德斯 → 紬文德斯（key_tsumugi）`。神山识的兼容字形、露娜 Q 的全角字形由 NFKC 归一。','',
  '| 源文件 | 中文显示名称 | 武将 ID | 目标文件 |','| --- | --- | --- | --- |',
  ...manifest.allocations.map(row=>`| ${row.source} | ${row.characterName} | \`${row.character}\` | \`${row.destination}\` |`),'',
  '套装文件位于 `apps/core/extension/packs/键社/image/skin-sets/`，`new/` 存新图，`original/` 存旧图；完整映射和哈希记录在同目录的 `manifest.json`。两套图片均随扩展携带，与怒焰三国使用相同的扩展资源路径、套装清单和管理服务。','',
  '“加藤うみ”精确匹配 `key_umi`，皮肤管理器中以中文“加藤羽未”显示；“鹰原羽未”单独匹配隐藏形态 `key_umi2`，两张图片不会混用。单独应用加藤羽未的新套装时，也会应用对应的鹰原羽未形态图片；恢复或禁用时一并处理。','',
  '本体没有 `image/character/key_umi2.jpg`，旧套装已复制 `key_umi.jpg` 为扩展内的 `original/key_umi2.jpg`，导出时无需引用本体原画。新套装始终使用提供的“鹰原羽未.jpg”。“水瀬秋子”“七瀬留美”分别归一为“水濑秋子”“七濑留美”。','',
  '继续导入键社并移除已分配源文件：`node scripts/complete-static-skin-sets.mjs --key-only --consume`；省略 `--consume` 则保留源文件。现有清单会增量补充；重复素材不会重复分配，已分配武将的不同图片会提示冲突而不覆盖。','',
  '## 尚未获得新套装的人物','',
  `键社共有 ${Object.keys(keyCharacters).length} 个角色 ID，已覆盖 ${count} 个，尚缺 ${manifest.missingCharacters.length} 个。`,'',
  ...(manifest.missingCharacters.length?['| 人物名称 | 武将 ID |','| --- | --- |',...manifest.missingCharacters.map(row=>`| ${row.name} | \`${row.id}\` |`)]:['无，当前键社全部角色及隐藏形态均已有新套装图片。']),''];
 await writeText(path.resolve('docs/key-skin-mapping.md'),lines.join('\n'));
 const readme=path.join(keyRoot,'../../README.md');
 const text=await fs.readFile(readme,'utf8');
 await writeText(readme,text.replace(/：\d+ 张随包携带的旧图/g,`：${count} 张随包携带的旧图`).replace(/：\d+ 张键社新装/g,`：${count} 张键社新装`));
}

async function consume(keyOnly=false){
 const nuyan=keyOnly?{allocations:[]}:await readJSON(nuyanManifest),key=await readJSON(keyManifest);
 const moves=[...nuyan.allocations.filter(row=>row.supplement).map(row=>({sourceRoot:qingshanSource,from:row.source,to:path.join(nuyanRoot,'image/skin-sets',row.destination),original:path.join(nuyanRoot,row.originalDestination),sha256:row.sha256})),...key.allocations.map(row=>({sourceRoot:keySource,from:row.source,to:path.join(keyRoot,row.destination),sha256:row.sha256}))];
 // Verify every destination and every remaining source before removing any source.
 for(const item of moves){
  item.source=path.resolve(item.sourceRoot,item.from);
  if(!item.source.startsWith(item.sourceRoot+path.sep))throw Error('源文件超出指定 temp 目录');
  for(const dest of [item.to,item.original].filter(Boolean))if(hash(await fs.readFile(dest))!==item.sha256)throw Error('目标校验失败：'+dest);
  try{if(hash(await fs.readFile(item.source))!==item.sha256)throw Error('源文件已变化：'+item.source);}catch(error){if(error.code!=='ENOENT')throw error;}
 }
 for(const item of moves)await fs.unlink(item.source).catch(error=>{if(error.code!=='ENOENT')throw error;});
 console.log('已移除已分配的 temp 素材；键社共',key.allocations.length,'条映射，其余资源保留');
}
if(process.argv.includes('--key-only')){await importKey();if(process.argv.includes('--consume'))await consume(true);}
else if(process.argv.includes('--consume'))await consume();else{await supplementNuyan();await importKey();}
