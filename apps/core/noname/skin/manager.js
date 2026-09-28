import {lib, game} from 'noname';
import {getSkinManagement, managementCharacters, relatedCharacters, captureSkinEntries, managedCharacterName, managedCharacterNames, managedCharacterSex, setSkinSystemEnabled} from './managementRuntime.js';
import {managedSelection, managedToken, skinEnabled} from './management.js';
import {saveSkinImage,readSkinArchive} from './setFiles.js';
import {reviewSkinImport} from './importDialog.js';
import {createAssetManager} from './assetManager.js';
import {createDynamicLibraryPanel} from './dynamicLibraryPanel.js';
import {dynamicSkins,enableDynamicPack,previewDynamicSkin} from './dynamicManagement.js';

let active;
const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
export function openSkinManager(character) {
 if(active?.isConnected){active.focus();return active;}
 const manager=getSkinManagement(),groups=managementCharacters();
 const selected=new Set(),skinSelected=new Set();let focused=character,revision=0,busy=false,page=0,selectedSet,skinType='all';
 const dialog=element('dialog','skin-manager');active=dialog;
 const head=element('header','skin-manager-head'),title=element('h2','','皮肤管理'),close=element('button','','关闭');close.onclick=()=>dialog.close();head.append(title,close);
 const help=element('details','skin-manager-help');help.append(element('summary','','套装与归档说明'));
 const helpList=element('ul');for(const text of ['基础套装永久保留，缺少原画时自动补全。','应用套装后更新默认形象，仍可为单个武将选择皮肤。','删除的内容会归档，可在页面下方找回。'])helpList.append(element('li','',text));help.append(helpList);
 const filters=element('div','skin-manager-filters');
 const pack=element('select'),search=element('input'),gender=element('select');
 pack.setAttribute('aria-label','扩展包');search.setAttribute('aria-label','搜索武将');search.placeholder='搜索武将名称或 ID';gender.setAttribute('aria-label','性别');
 for(const group of groups)pack.add(new Option(group.name,group.id));
 pack.value=groups.find(group=>group.id!=='all'&&group.characters.includes(character))?.id||groups.find(group=>group.name.includes('怒焰'))?.id||groups[0]?.id||'';
 focused ||= groups.find(group=>group.id===pack.value)?.characters[0];
 for(const [value,label] of [['','全部性别'],['female','女武将'],['male','男武将']])gender.add(new Option(label,value));
 filters.append(pack,search,gender);
 const layout=element('div','skin-manager-layout'),left=element('section','skin-manager-characters'),right=element('section','skin-manager-detail');
 const selectionBar=element('div','skin-manager-toolbar'),count=element('span'),grid=element('div','skin-manager-grid'),pages=element('div','skin-manager-toolbar');
 const toolbar=element('div','skin-manager-toolbar'),sets=element('div','skin-manager-sets'),detail=element('div','skin-manager-skins');
 const status=element('p','skin-manager-status','选择武将后可批量操作；点击“查看皮肤”管理单张皮肤。');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const button=(text,handler,parent)=>{const node=element('button','',text);node.onclick=handler;parent.append(node);return node;};
 const masterLabel=element('label'),master=element('input');master.type='checkbox';master.checked=lib.config.change_skin!==false;masterLabel.append(master,element('span','','开启换肤'));filters.append(masterLabel);
 master.onchange=()=>run(()=>setSkinSystemEnabled(master.checked),master.checked?'换肤已开启':'换肤已关闭，所有选择均保留');
 const filtered=()=>{const query=search.value.trim().toLowerCase();return (groups.find(group=>group.id===pack.value)?.characters||[]).filter(id=>{
  return (!gender.value||managedCharacterSex(id)===gender.value)&&(!query||(id+' '+managedCharacterName(id)).toLowerCase().includes(query));
 });};
 const targets=()=>{if(!selected.size)throw Error('请先勾选武将');return relatedCharacters([...selected]);};
 async function run(task,message){
  if(busy)return;busy=true;dialog.classList.add('is-busy');status.textContent='正在保存，请稍候…';
  for(const node of [head,filters,toolbar,layout])node.inert=true;
  try{const result=await task();status.textContent=typeof message==='function'?message(result):message;render();await renderSkins(focused);}catch(error){status.textContent=error.message;}
  finally{busy=false;dialog.classList.remove('is-busy');for(const node of [head,filters,toolbar,layout])node.inert=false;}
 }
 const assets=createAssetManager({manager,groups,focused:()=>focused,selected:()=>selected,pack:()=>pack.value,currentSet:()=>selectedSet,run});
 const dynamicLibrary=createDynamicLibraryPanel({manager,groups,focused:()=>focused,selected:()=>selected,pack:()=>pack.value,run});
 const viewTabs=element('nav','skin-manager-view-tabs');
 const switchView=dynamic=>{
  sets.hidden=assets.node.hidden=detail.hidden=dynamic;dynamicLibrary.node.hidden=!dynamic;
  layout.classList.toggle('is-dynamic',dynamic);
  staticTab.classList.toggle('is-active',!dynamic);dynamicTab.classList.toggle('is-active',dynamic);
  if(dynamic)dynamicLibrary.show();
 };
 const staticTab=button('原画与套装',()=>switchView(false),viewTabs),dynamicTab=button('动态资源与分配',()=>switchView(true),viewTabs);staticTab.classList.add('is-active');
 button('全选筛选结果',()=>{filtered().forEach(id=>selected.add(id));render();},selectionBar);
 button('清空选择',()=>{selected.clear();render();},selectionBar);selectionBar.append(count);
 for(const [kind,label] of [['static','静态'],['dynamic','动态']])for(const enabled of [true,false])button((enabled?'启用':'禁用')+label,()=>run(()=>manager.setEnabled(targets(),kind,enabled),'已'+(enabled?'启用':'禁用')+'所选武将的'+label+'皮肤'),toolbar);
 button('恢复默认形象',()=>run(()=>manager.restoreDefault(targets()),'已恢复所选武将应用套装时的默认形象'),toolbar);
 button('恢复个人选择',()=>run(()=>manager.clear(targets()),'已恢复应用套装前的个人皮肤选择'),toolbar);
 button('上一页',()=>{page=Math.max(0,page-1);render();},pages);
 const pageLabel=element('span');pages.append(pageLabel);button('下一页',()=>{page=Math.min(Math.ceil(filtered().length/48)-1,page+1);render();},pages);
 function render(){
  master.checked=lib.config.change_skin!==false;
  const ids=filtered();page=Math.max(0,Math.min(page,Math.ceil(ids.length/48)-1));grid.replaceChildren();
  count.textContent=`已选 ${selected.size} / 筛选 ${ids.length}`;pageLabel.textContent=`${page+1} / ${Math.max(1,Math.ceil(ids.length/48))}`;
  for(const id of ids.slice(page*48,page*48+48)){
   const card=element('article','skin-manager-character');card.dataset.character=id;
   const label=element('label'),check=element('input');check.type='checkbox';check.checked=selected.has(id);check.setAttribute('aria-label','选择 '+managedCharacterName(id));
   check.onchange=()=>{check.checked?selected.add(id):selected.delete(id);count.textContent=`已选 ${selected.size} / 筛选 ${ids.length}`;dynamicLibrary.refresh();};
   label.append(check,element('strong','',managedCharacterName(id)));
   const portrait=element('div','skin-manager-character-portrait');portrait.setAttribute('aria-hidden','true');portrait.setBackground?.(id,'character');
   const state=managedSelection(lib.config,id);card.append(portrait,label,element('small','',id),element('span','skin-manager-current',state?.name||lib.config.skin?.[id]?.[0]||'经典形象'));
   card.append(element('small','',`静态${skinEnabled(lib.config,id,'static')?'启用':'禁用'} · 动态${skinEnabled(lib.config,id,'dynamic')?'启用':'禁用'}`));
   button('查看皮肤',()=>{focused=id;skinSelected.clear();renderSets();void renderSkins(id);},card);grid.append(card);
  }
  renderSets();
 }
 function renderSets(){
  sets.replaceChildren(element('h3','','皮肤套装'));
  const available=manager.listSets().filter(set=>pack.value==='all'||set.packId===pack.value||set.packId==='all');
  if(!available.some(set=>set.id===selectedSet))selectedSet=available[0]?.id;
  const chooser=element('select');chooser.setAttribute('aria-label','选择皮肤套装');chooser.className='skin-manager-set-select';
  for(const set of available)chooser.add(new Option(set.name+(set.base?'（受保护）':set.firstExtension?'（首套保留）':''),set.id));
  chooser.value=selectedSet||'';chooser.onchange=()=>{selectedSet=chooser.value;renderSets();};sets.append(chooser);
  const set=available.find(set=>set.id===selectedSet);
  if(set){
   const row=element('div','skin-manager-set');
   row.append(element('small','',`${Object.keys(set.entries).length} 位武将${set.base?' · 基础套装及内容不可删除':set.firstExtension?' · 套装不可删除，内容可增删':' · 自定义内容可编辑'}`));
   button('一键应用整套',()=>run(()=>manager.applySet(set.id),'已应用 '+set.name+'；缺少原画的武将使用基础套装'),row);
   button('应用到所选',()=>run(()=>manager.applySet(set.id,targets()),'已将 '+set.name+' 应用到所选武将'),row);sets.append(row);
   if(!set.base){
    const edit=element('div','skin-manager-preset'),rename=element('input');rename.value=set.name;rename.setAttribute('aria-label','套装名称');edit.append(rename);
    button('保存名称',()=>run(()=>manager.renameSet(set.id,rename.value),'套装已重命名'),edit);
    if(!set.firstExtension)button('删除套装',()=>{
     if(confirm(`删除“${set.name}”？原画将归档到 temp，应用此套装的武将将回退基础套装。`))void run(()=>manager.deleteSet(set.id),path=>'套装已归档：'+path);
    },edit);sets.append(edit);
    const actions=element('div','skin-manager-toolbar');
    const pick=(accept,onFile)=>{const input=element('input');input.type='file';input.accept=accept;input.hidden=true;input.onchange=()=>{const file=input.files[0];input.remove();if(file)onFile(file);};input.oncancel=()=>input.remove();dialog.append(input);input.click();};
    const characters=groups.find(group=>group.id===set.packId)?.characters||groups[0].characters;
    button('导入皮肤压缩包',()=>pick('.zip',file=>run(async()=>{
     const rows=await readSkinArchive(file,characters,managedCharacterNames),chosen=await reviewSkinImport(rows,characters,managedCharacterName,set);
     if(!chosen)return 0;
     const entries={};for(let i=0;i<chosen.length;i++){const row=chosen[i];status.textContent=`正在保存原画 ${i+1} / ${chosen.length}…`;entries[row.character]=await saveSkinImage(await row.read(),row.path);}
     await manager.putEntries(set.id,entries);return chosen.length;
    },count=>count?`已导入 ${count} 张原画到 ${set.name}`:'已取消导入')),actions);
    button('删除所选武将的套装原画',()=>{
     if(!selected.size){status.textContent='请先勾选武将';return;}
     if(confirm(`从“${set.name}”删除所选武将的原画？删除后使用基础原画，文件归档到 temp。`))void run(()=>manager.deleteEntries(set.id,targets()),path=>'原画已归档：'+path);
    },actions);
    const setCharacters=[...new Set([...Object.keys(set.entries),...manager.listAssets().filter(asset=>asset.set===set.id).map(asset=>asset.character)])];
    if(setCharacters.length)button('清空套装内容',()=>{
     if(confirm(`清空“${set.name}”中的全部原画？套装本身保留，原画归档到 temp。`))void run(()=>manager.deleteEntries(set.id,setCharacters),path=>'套装内容已归档：'+path);
    },actions);sets.append(actions);
    if(focused&&characters.includes(focused)){
     const editor=element('section','skin-manager-entry-editor'),entry=set.entries[focused];
     editor.append(element('h3','',managedCharacterName(focused)+' · 当前套装原画'),element('p','',entry?entry.name:'此套装暂无原画，应用后沿用基础套装。'));
     const entryName=element('input');entryName.placeholder='原画名称（可选）';entryName.value=entry?.name||'';entryName.setAttribute('aria-label','原画名称');editor.append(entryName);
     button(entry?'替换此武将原画':'导入此武将原画',()=>pick('image/png,image/jpeg,image/webp,image/gif,image/avif',file=>{
      if(entry&&!confirm('替换此套装中 '+managedCharacterName(focused)+' 的原画？'))return;
      void run(async()=>{const image=await saveSkinImage(file,file.name);if(entryName.value.trim())image.name=entryName.value.trim();await manager.putEntries(set.id,{[focused]:image});},'已保存此武将的套装原画');
     }),editor);
     if(entry){
      if(!entry.classic)button('剥离为游离原画',()=>run(()=>manager.detachEntry(set.id,focused),'原画已从套装剥离，套装默认形象回退基础原画'),editor);
      button('保存原画名称',()=>run(()=>{if(!entryName.value.trim())throw Error('请填写原画名称');return manager.putEntries(set.id,{[focused]:{...entry,name:entryName.value.trim()}});},'原画名称已保存'),editor);
      button('删除此原画',()=>{if(confirm(`删除“${set.name}”中 ${managedCharacterName(focused)} 的原画并归档到 temp？`))void run(()=>manager.deleteEntries(set.id,[focused]),path=>'原画已归档：'+path);},editor);
     }
     sets.append(editor);
    }
   }
  }
  const preset=element('div','skin-manager-preset'),name=element('input');name.placeholder='自定义套装名称';name.setAttribute('aria-label','自定义套装名称');preset.append(name);
  button('新建空套装',()=>run(async()=>{selectedSet=await manager.savePreset(name.value,pack.value);},'已新建套装，可选择武将导入原画'),preset);
  button('保存所选当前搭配',()=>run(async()=>{targets();selectedSet=await manager.savePreset(name.value,pack.value,captureSkinEntries([...selected]));},'当前搭配已保存为套装'),preset);sets.append(preset);
  const trash=manager.listTrash();if(trash.length){
   const archive=element('details','skin-manager-archive');archive.append(element('summary','',`已删除内容 / 找回（${trash.length}）`));
   for(const item of trash.slice().reverse()){
    const row=element('div','skin-manager-set');row.append(element('strong','',item.set.name),element('small','',`${new Date(item.time).toLocaleString()} · ${Object.keys(item.entries).length+(item.extras?.length||0)} 张 · ${item.location||''}`));
    button('找回',()=>{if(confirm('找回这些原画？同一武将在该套装中已有的原画将被替换。'))void run(()=>manager.restoreTrash(item.id),'已找回归档的套装内容');},row);archive.append(row);
   }sets.append(archive);
  }
  assets.render();dynamicLibrary.refresh();
 }
 async function renderSkins(id){
  const version=++revision;detail.replaceChildren(element('h3','',id?managedCharacterName(id)+' · 单张皮肤':'单张皮肤'));
  if(!id)return;
  detail.append(element('p','','读取皮肤列表…'));
  let files=[],dynamics=[],dynamicError;
  try{dynamics=await dynamicSkins(id);}catch(error){dynamicError=error.message;}
  if(version!==revision||!dialog.isConnected)return;
  if(game.qhly_getManagedSkinList)files=await new Promise(resolve=>{const timer=setTimeout(()=>resolve([]),12000);game.qhly_getManagedSkinList(id,(_ok,list)=>{clearTimeout(timer);resolve(list||[]);});});
  else files=manager.listSets().filter(set=>set.entries[id]&&!set.entries[id].classic).map(set=>managedToken(set.id));
  const dynamicByToken=new Map(dynamics.map(skin=>[skin.token,skin]));
  files=[...new Set([...files,...dynamicByToken.keys(),...manager.listAssets(id).map(asset=>asset.token)])];
  if(version!==revision||!dialog.isConnected)return;
  detail.replaceChildren(element('h3','',managedCharacterName(id)+' · 单张皮肤'));
  const actions=element('div','skin-manager-toolbar');
  const type=element('select');type.setAttribute('aria-label','皮肤类型');for(const [value,label]of [['all','全部皮肤'],['static','静态原画'],['dynamic','动态皮肤']])type.add(new Option(label,value));type.value=skinType;type.onchange=()=>{skinType=type.value;skinSelected.clear();void renderSkins(id);};actions.append(type);
  if(dynamicError)detail.append(element('p','','动态皮肤读取失败，可稍后重新打开：'+dynamicError));
  files=files.filter(file=>skinType==='all'||(skinType==='dynamic')===(dynamicByToken.has(file)||!!game.qhly_hasDynamicSkin?.(id,file)));
  button('全选皮肤',()=>{files.forEach(file=>skinSelected.add(file));void renderSkins(id);},actions);
  for(const enabled of [true,false])button((enabled?'启用':'禁用')+'所选皮肤',()=>run(()=>{if(!skinSelected.size)throw Error('请先勾选皮肤');return manager.setSkinsEnabled(id,[...skinSelected].flatMap(file=>[file,game.qhly_getSkinFile?.(id,file)].filter(Boolean)),enabled);},'已'+(enabled?'启用':'禁用')+'所选皮肤'),actions);
  detail.append(actions);
  const cards=element('div','skin-manager-skin-grid'),catalog=manager.listSets();
  for(const file of files){
   const set=catalog.find(set=>managedToken(set.id)===file),asset=manager.assetForToken(id,file),dynamicEntry=dynamicByToken.get(file),entry=asset||dynamicEntry||set?.entries[id];
   const dynamic=!!dynamicEntry||!!game.qhly_hasDynamicSkin?.(id,file),hidden=!!lib.config.skin_management?.hidden?.[id]?.[file]||!!lib.config.skin_management?.hidden?.[id]?.[entry?.path];
   const row=element('article','skin-manager-skin'+(hidden?' is-disabled':'')),label=element('label'),check=element('input');row.dataset.skin=file;check.type='checkbox';check.checked=skinSelected.has(file);check.onchange=()=>check.checked?skinSelected.add(file):skinSelected.delete(file);
   const name=entry?.name||game.qhly_getSkinName?.(id,file)||file;label.append(check,element('span','',name));
   const img=element('img');img.loading='lazy';img.alt=name;img.src=lib.assetURL+(entry?.path||game.qhly_getSkinFile?.(id,file)||'');img.onerror=()=>{img.alt=name+'（无静态预览）';img.removeAttribute('src');};
   row.append(img,label,element('small','',`${dynamic?'动态':'静态'} · ${hidden?'已禁用':'已启用'}`));
   if(dynamicEntry){
    row.append(element('small','',dynamicEntry.pack+(dynamicEntry.packEnabled?'':' · 资源包已关闭')));
    button(hidden?'启用此动态皮肤':'禁用此动态皮肤',()=>run(()=>manager.setSkinsEnabled(id,[file,dynamicEntry.path],hidden),hidden?'动态皮肤已启用':'动态皮肤已禁用'),row);
    if(!dynamicEntry.packEnabled)button('启用资源包',()=>run(()=>enableDynamicPack(dynamicEntry.pack),'动态资源包已启用'),row);
    const preview=button('预览动态',()=>previewDynamicSkin(id,dynamicEntry),row);preview.disabled=hidden||!skinEnabled(lib.config,id,'dynamic')||!dynamicEntry.packEnabled;
    if(preview.disabled)preview.title='请先启用此动态皮肤及其资源包';
   }
   button('使用此皮肤',()=>run(async()=>{
    await manager.setSkinsEnabled(id,[file,entry?.path||game.qhly_getSkinFile?.(id,file)].filter(Boolean),true);await manager.setEnabled([id],dynamic?'dynamic':'static',true);
    if(dynamicEntry){await enableDynamicPack(dynamicEntry.pack);await manager.select(id,dynamicEntry,relatedCharacters([id]));}
    else if(asset)await manager.select(id,{...asset,assetId:asset.id},relatedCharacters([id]));
    else if(set)await manager.applySet(set.id,[id]);
    else if(game.qhly_setCurrentSkin)await new Promise((resolve,reject)=>game.qhly_setCurrentSkin(id,file,error=>error?reject(error):resolve()));
   },'已使用 '+name),row);cards.append(row);
  }
  if(!files.length)cards.append(element('p','','暂无已发现的皮肤。启用千幻聆音后可查看本地动静态资源。'));
  detail.append(cards);
 }
 for(const input of [pack,search,gender])input.addEventListener(input===search?'input':'change',()=>{
  selected.clear();page=0;render();
  if(input===pack){focused=filtered()[0];skinSelected.clear();renderSets();void renderSkins(focused);}
 });
 left.append(selectionBar,grid,pages);right.append(viewTabs,sets,assets.node,detail,dynamicLibrary.node);layout.append(left,right);dialog.append(head,help,filters,toolbar,layout,status);
 dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
 dialog.addEventListener('close',()=>{revision++;dialog.remove();if(active===dialog)active=undefined;},{once:true});
 document.body.append(dialog);dialog.showModal();render();void renderSkins(focused);return dialog;
}
