import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

export const packName = '棕色尘埃扩展';
const hash = value => createHash('sha256').update(value).digest('hex');
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const write = async (file, data) => { await fs.mkdir(path.dirname(file), {recursive:true}); await fs.writeFile(file, JSON.stringify(data, null, 2)+'\n'); };
const slash = value => value.replaceAll('\\','/');
// Same preference order as the source gallery's chooseIdleAnimation.
export function galleryIdle(names, declared) {
  return names.find(n=>/^idle$/i.test(n)) || names.find(n=>/^loop$/i.test(n)) ||
    names.find(n=>/(?:^|[_\-.])(idle|loop|stand|standby|wait|home)(?:$|[_\-.\d])/i.test(n)) ||
    (names.includes(declared)&&!/^(click|touch|tap|press|poke|in|out|intro|appear|exit|land|down|up)/i.test(declared)?declared:null) ||
    names.find(n=>!/^(click|touch|tap|press|poke|in|out|intro|appear|exit|land|down|up)/i.test(n)) || names[0];
}
export function sourcePath(value) {
  const relative = slash(value).replace(/^\//,'');
  if (!relative || relative.split('/').some(part=>part==='..'||part==='.') || path.isAbsolute(relative) || relative.includes(':')) throw Error('无效源路径：'+value);
  return relative;
}
export function atlasPages(text) {
  const lines=text.split(/\r?\n/), pages=[];
  for(let i=0;i<lines.length;i++) if(lines[i].trim()&&(i===0||!lines[i-1].trim())&&/\.(png|jpe?g|webp)$/i.test(lines[i].trim())) pages.push(lines[i].trim());
  return pages;
}
async function walk(root) {
  const files=[];
  for(const entry of await fs.readdir(root,{withFileTypes:true}).catch(e=>{if(e.code==='ENOENT')return [];throw e;})) {
    const file=path.join(root,entry.name);
    if(entry.isDirectory())files.push(...await walk(file));else if(entry.isFile())files.push(file);
  }
  return files;
}
export async function collectGallery(root) {
  const characters=await read(path.join(root,'data/character_index.json'));
  const others=await read(path.join(root,'data/other_index.json'));
  const mods=await read(path.join(root,'data/mod_runtime_index.json'));
  const records=[],costumes=new Map(),metadata=new Set(['data/character_index.json','data/other_index.json','data/mod_runtime_index.json','data/mod_catalog.json']);
  for(const character of characters.characters) {
    const metaPath=sourcePath(character.metaPath), base=path.posix.dirname(metaPath);
    const meta=await read(path.join(root,metaPath));
    const manifestPath=base+'/runtime/resource_manifest.json', manifest=await read(path.join(root,manifestPath));
    metadata.add(metaPath);metadata.add(manifestPath);
    for(const costume of meta.costumes)costumes.set(String(costume.gameId),{character:character.name,characterId:character.id,sex:meta.character.gender,costume:costume.name,costumeCode:costume.code});
    for(const scope of manifest.scopes)for(const asset of scope.allSpineEntries||scope.spineEntries||[]) {
      const category=asset.categoryLabel||'角色主 Spine';
      records.push({asset,categoryPath:['角色',character.name,scope.costumeName||scope.label,category],category:category==='角色主 Spine'?'角色':category,
        character:character.name,characterId:character.id,sex:meta.character.gender,costume:scope.costumeName||scope.label,costumeCode:scope.costumeCode,
        originalTitle:(scope.costumeName||scope.label)+' · '+(asset.label||asset.bundle),sourceId:character.id+':'+scope.id+':'+asset.bundle,voiceRoot:base+'/runtime/voice'});
    }
  }
  for(const other of others.items) {
    const metaPath=sourcePath(other.metaPath),meta=await read(path.join(root,metaPath));metadata.add(metaPath);
    for(const asset of meta.spineEntries||[])records.push({asset,category:other.categoryLabel,categoryPath:['其他',other.categoryLabel,other.name],character:other.name,
      originalTitle:other.name+(meta.spineEntries.length>1?' · '+(asset.label||asset.bundle):''),sourceId:other.id+':'+asset.bundle});
  }
  const modRows=[...(mods.characters||[]).flatMap(x=>x.mods||[]),...(mods.archives||[]).flatMap(x=>x.mods||[]),...(mods.standalone||[]),...(mods.mod2Standalone||[])];
  for(const mod of modRows) {
    if(!mod.spineAsset)throw Error('Mod 缺少运行清单：'+mod.modId);
    const bundle=mod.canonicalBundleName||mod.bundleName, costumeId=bundle.match(/(?:^|_)char(\d{6})/i)?.[1], owner=costumes.get(costumeId);
    // The original page calls Shared Mod "Mod"; retain packageName separately.
    const category=mod.packageName==='Shared Mod'?'Mod':mod.packageName||mod.categoryLabel||'Mod';
    records.push({asset:mod.spineAsset,category,categoryPath:[category,owner?.character||bundle,owner?.costume||bundle,mod.displayLabel],character:owner?.character||bundle,
      sex:owner?.sex,costume:owner?.costume,costumeCode:owner?.costumeCode,originalTitle:mod.displayLabel,sourceId:mod.modId,
      mod:{id:mod.modId,packageName:mod.packageName,sourceLabel:mod.sourceLabel,displayLabel:mod.displayLabel,targetBundle:mod.targetBundle,canonicalBundleName:bundle,sourceRefs:mod.sourceRefs}});
  }
  return {records,metadata};
}

export async function buildGallery({source='temp/动态皮包/棕色尘埃图鉴',destination='temp/动态皮包/棕色尘埃扩展',plan=false}={}) {
  source=path.resolve(source);destination=path.resolve(destination);
  if(source===destination||destination.startsWith(source+path.sep))throw Error('输出不能覆盖源图鉴');
  const {records,metadata}=await collectGallery(source),files=new Map(),entries=[],seen=new Set(),issues=[];
  let audit;
  try{audit=await read(path.join(destination,'model-audit.json'));}catch(e){if(e.code!=='ENOENT')throw e;}
  const audited=new Map((audit?.results||[]).map(row=>[row.id,row]));
  async function add(relative) {
    relative=sourcePath(relative);const stat=await fs.stat(path.join(source,relative));
    if(!stat.isFile()||!stat.size)throw Error('源资源为空：'+relative);
    files.set(relative,{source:relative,file:'assets/'+relative,size:stat.size});return 'assets/'+relative;
  }
  const voiceCache=new Map();
  for(const record of records) {
    const asset=record.asset, skeleton=sourcePath(asset.skeletonJson?.url||asset.skeletonBinary?.url||asset.binaryUrl),atlas=sourcePath(asset.atlasText?.url||asset.atlasUrl);
    const identity=record.sourceId+'\0'+skeleton;
    if(seen.has(identity))throw Error('重复源条目：'+identity);seen.add(identity);
    const bytes=await fs.readFile(path.join(source,skeleton)),atlasText=await fs.readFile(path.join(source,atlas),'utf8');
    const version=skeleton.endsWith('.json')?JSON.parse(bytes).skeleton?.spine:bytes.subarray(0,128).toString('latin1').match(/[234]\.\d+\.\d+/)?.[0];
    if(!/^4\.1\./.test(version||''))throw Error('未经验证的版本：'+skeleton+' '+version);
    const fingerprint=hash(Buffer.concat([bytes,Buffer.from(atlasText)]));
    const id='bd2_'+hash(identity).slice(0,20),parsed=audited.get(id);
    if(parsed&&parsed.fingerprint!==fingerprint)throw Error('模型审核已过期：'+id);
    const model={skeleton:await add(skeleton),atlas:await add(atlas),version,role:'Ren',layerOrder:0};
    const pages=atlasPages(atlasText);if(!pages.length)throw Error('图集没有贴图页：'+atlas);
    const missing=[];
    for(const page of pages) {
      const file=path.posix.join(path.posix.dirname(atlas),page);
      try{await add(file);}catch(e){if(e.code!=='ENOENT')throw e;missing.push(file);}
    }
    if(asset.defaultSkin)model.skin=asset.defaultSkin;
    const animation=galleryIdle(parsed?.animations?.map(a=>a.name)||asset.animations||[],asset.defaultAnimation||asset.spineUnity?.materialPolicy?.unityStartingAnimation);
    if(animation)model.animation=animation;
    const category=packName+' · '+record.category;
    const entry={id,type:'spine',character:record.character,title:packName+' · '+record.originalTitle,originalTitle:record.originalTitle,
      group:'bd2:'+record.category+':'+(record.characterId||record.character),libraryGroup:category,category:record.category,categoryPath:record.categoryPath,
      sex:record.sex==='女'?'female':record.sex==='男'?'male':'unknown',characterIds:[],models:[model],motions:parsed?.animations?.map(x=>x.name)||asset.animations||[],
      source:{gallery:'棕色尘埃图鉴',id:record.sourceId,skeleton,atlas,fingerprint,categoryPath:record.categoryPath,mod:record.mod},
      costume:record.costume,costumeCode:record.costumeCode};
    if(animation)entry.idle=animation;
    try{await fs.access(path.join(destination,'previews',id+'.png'));entry.thumbnail='previews/'+id+'.png';}catch(e){if(e.code!=='ENOENT')throw e;}
    if(missing.length||parsed?.error){entry.available=false;entry.unavailableReason=missing.length?'源图鉴缺少贴图：'+missing.join('、'):parsed.error.split('\n')[0];issues.push({id,reason:entry.unavailableReason});}
    if(record.voiceRoot) {
      if(!voiceCache.has(record.voiceRoot))voiceCache.set(record.voiceRoot,(await walk(path.join(source,record.voiceRoot))).filter(f=>/\.(wav|mp3|ogg)$/i.test(f)).map(f=>slash(path.relative(source,f))));
      const voices=[];
      for(const file of voiceCache.get(record.voiceRoot)) {
        // Costume interaction lines remain attached to their original costume.
        const scope=file.match(/\/costume_(\d+)\//)?.[1];if(scope&&Number(scope)!==record.costumeCode)continue;
        voices.push({file:await add(file),label:path.posix.basename(file,path.posix.extname(file)),language:/\/jp\//.test(file)?'jp':/\/zh\//.test(file)?'zh':'unknown',skinLabel:record.costume});
      }
      if(voices.length){entry.voiceFile='voices/'+id+'.json';if(!plan)await write(path.join(destination,entry.voiceFile),voices);}
    }
    entries.push(entry);
  }
  // Account for every physical atlas, including files absent from gallery menus.
  const physical=(await Promise.all(['source','mods'].map(dir=>walk(path.join(source,dir))))).flat();
  const unusedAtlases=physical.filter(file=>file.endsWith('.atlas')&&!files.has(slash(path.relative(source,file)))).map(file=>slash(path.relative(source,file)));
  const counts=Object.fromEntries([...new Set(entries.map(e=>e.category))].map(category=>[category,entries.filter(e=>e.category===category).length]));
  const summary={name:packName,entries:entries.length,categories:counts,files:files.size,bytes:[...files.values()].reduce((n,f)=>n+f.size,0),unusedAtlases,issues};
  if(plan)return summary;
  for(const relative of metadata){const target=path.join(destination,'source-metadata',relative);await fs.mkdir(path.dirname(target),{recursive:true});await fs.copyFile(path.join(source,relative),target);}
  let copied=0;
  for(const row of files.values()) {
    const buffer=await fs.readFile(path.join(source,row.source));row.sha256=hash(buffer);
    const target=path.join(destination,row.file);await fs.mkdir(path.dirname(target),{recursive:true});
    let existing;try{existing=await fs.stat(target);}catch(e){if(e.code!=='ENOENT')throw e;}
    if(!existing||existing.size!==buffer.length||hash(await fs.readFile(target))!==row.sha256)await fs.writeFile(target,buffer);
    if(++copied%500===0)console.log('素材',copied,'/',files.size);
  }
  await write(path.join(destination,'catalog.json'),{name:packName,version:'1.0.0',categories:Object.keys(counts).map(name=>({name,label:packName+' · '+name})),entries});
  await write(path.join(destination,'迁移报告.json'),summary);
  await write(path.join(destination,'资源校验.json'),{algorithm:'sha256',files:[...files.values()]});
  await fs.writeFile(path.join(destination,'安装与使用说明.txt'),[
    '棕色尘埃扩展 — 本地动态皮肤资源包','',
    '在工程根目录执行 pnpm skins:import。导入器读取本目录的 catalog.json。',
    '游戏内：皮肤管理 → 动态资源与分配 → 载入 / 刷新动态资源库 → 选择棕色尘埃扩展。',
    '通过分组筛选角色、剧情、NPC、Mod、Mod2；名称与原分类保留，显示名增加棕色尘埃扩展前缀。',
    '所有条目初始为游离动皮，可预览并分配给选定武将。不会按名字自动绑定三国武将。',
    '每个源变体都有独立 ID。骨骼、贴图和语音原样复制，资源校验.json 记录 SHA-256。',
    'source-metadata 保存原始分类、角色和 Mod 清单；categoryPath 保留角色→服装→形态层级。',
    '本包使用工程共享播放器，无需启动原图鉴、安装其 node_modules 或执行其启动脚本。',
    '生成器：node scripts/build-browndust-skins.mjs；审核：node scripts/audit-browndust-skins.mjs。',
    '通过审核后再次运行生成器写入已核对的默认动作，再导入。',''
  ].join('\n'));
  if(audit)await finalizeGallery(destination);
  return await read(path.join(destination,'迁移报告.json'));
}
export async function finalizeGallery(root='temp/动态皮包/棕色尘埃扩展') {
  const catalog=await read(path.join(root,'catalog.json')),audit=await read(path.join(root,'model-audit.json'));
  const parsed=new Map(audit.results.map(e=>[e.id,e]));
  let rendered=new Map();try{const report=await read(path.join(root,'render-audit.json'));rendered=new Map(report.results.map(e=>[e.id,e]));}catch(e){if(e.code!=='ENOENT')throw e;}
  let updated=0;
  for(const entry of catalog.entries){
    const result=parsed.get(entry.id);if(!result||result.fingerprint!==entry.source.fingerprint)throw Error('缺少有效解析证据：'+entry.id);
    if(result.error){entry.available=false;entry.unavailableReason=result.error.split('\n')[0];}
    if(result.animations){entry.motions=result.animations.map(a=>a.name);const idle=galleryIdle(entry.motions);if(entry.idle!==idle)updated++;entry.idle=idle;entry.models[0].animation=idle;}
    if(entry.unavailableReason)entry.unavailableReason=entry.unavailableReason.split('\n')[0];
    const render=rendered.get(entry.id);
    if(render?.fingerprint&&render.fingerprint!==entry.source.fingerprint)throw Error('播放校验已过期：'+entry.id);
    if(render?.error){entry.available=false;entry.unavailableReason='播放校验：'+render.error.split('\n')[0];}
    try{await fs.access(path.join(root,'previews',entry.id+'.png'));entry.thumbnail='previews/'+entry.id+'.png';}catch(e){if(e.code!=='ENOENT')throw e;}
  }
  await write(path.join(root,'catalog.json'),catalog);
  const report=await read(path.join(root,'迁移报告.json'));report.issues=catalog.entries.filter(e=>e.available===false).map(e=>({id:e.id,title:e.title,reason:e.unavailableReason}));report.available=catalog.entries.length-report.issues.length;await write(path.join(root,'迁移报告.json'),report);
  const csvCell=value=>'"'+String(value??'').replaceAll('"','""')+'"';
  const csv=[['分类','角色','服装','名称','原 Mod 包名','ID','状态','原因'],...catalog.entries.map(e=>[e.libraryGroup,e.character,e.costume,e.title,e.source.mod?.packageName,e.id,e.available===false?'待修复 / 待配置':'可用',e.unavailableReason])];
  await fs.writeFile(path.join(root,'皮肤目录.csv'),'\ufeff'+csv.map(row=>row.map(csvCell).join(',')).join('\r\n'));
  return {entries:catalog.entries.length,updated,thumbnails:catalog.entries.filter(e=>e.thumbnail).length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)console.log(JSON.stringify(process.argv.includes('--catalog-only')?await finalizeGallery():await buildGallery({plan:process.argv.includes('--plan')}),null,2));
