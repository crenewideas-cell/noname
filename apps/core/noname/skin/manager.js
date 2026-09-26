import {lib, game} from 'noname';
import {getSkinManagement, managementCharacters, relatedCharacters, captureSkinEntries, managedCharacterName, managedCharacterSex, setSkinSystemEnabled} from './managementRuntime.js';
import {managedSelection, managedToken, skinEnabled} from './management.js';

let active;
const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
export function openSkinManager(character) {
 if(active?.isConnected){active.focus();return active;}
 const manager=getSkinManagement(),groups=managementCharacters();
 const selected=new Set(),skinSelected=new Set();let focused=character,revision=0,busy=false,page=0;
 const dialog=element('dialog','skin-manager');active=dialog;
 const head=element('header','skin-manager-head'),title=element('h2','','皮肤管理'),close=element('button','','关闭');close.onclick=()=>dialog.close();head.append(title,close);
 const help=element('p','skin-manager-help','按扩展包管理武将皮肤。禁用会保留选择，重新启用即可恢复；应用套装立即保存。');
 const filters=element('div','skin-manager-filters');
 const pack=element('select'),search=element('input'),gender=element('select');
 pack.setAttribute('aria-label','扩展包');search.setAttribute('aria-label','搜索武将');search.placeholder='搜索武将名称或 ID';gender.setAttribute('aria-label','性别');
 for(const group of groups)pack.add(new Option(group.name,group.id));
 pack.value=groups.find(group=>group.id!=='all'&&group.characters.includes(character))?.id||groups.find(group=>group.name.includes('怒焰'))?.id||groups[0]?.id||'';
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
  dialog.querySelectorAll('button,input,select').forEach(node=>node.disabled=true);
  try{await task();status.textContent=message;render();await renderSkins(focused);}catch(error){status.textContent=error.message;}
  finally{busy=false;dialog.classList.remove('is-busy');dialog.querySelectorAll('button,input,select').forEach(node=>node.disabled=false);}
 }
 button('全选筛选结果',()=>{filtered().forEach(id=>selected.add(id));render();},selectionBar);
 button('清空选择',()=>{selected.clear();render();},selectionBar);selectionBar.append(count);
 for(const [kind,label] of [['static','静态'],['dynamic','动态']])for(const enabled of [true,false])button((enabled?'启用':'禁用')+label,()=>run(()=>manager.setEnabled(targets(),kind,enabled),'已'+(enabled?'启用':'禁用')+'所选武将的'+label+'皮肤'),toolbar);
 button('恢复经典形象',()=>run(()=>manager.classic(targets()),'已恢复所选武将的经典形象'),toolbar);
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
   check.onchange=()=>{check.checked?selected.add(id):selected.delete(id);count.textContent=`已选 ${selected.size} / 筛选 ${ids.length}`;};
   label.append(check,element('strong','',managedCharacterName(id)));
   const state=managedSelection(lib.config,id);card.append(label,element('small','',id),element('span','skin-manager-current',state?.name||lib.config.skin?.[id]?.[0]||'个人选择 / 经典形象'));
   card.append(element('small','',`静态${skinEnabled(lib.config,id,'static')?'启用':'禁用'} · 动态${skinEnabled(lib.config,id,'dynamic')?'启用':'禁用'}`));
   button('查看皮肤',()=>{focused=id;skinSelected.clear();void renderSkins(id);},card);grid.append(card);
  }
  sets.replaceChildren(element('h3','','皮肤套装'));
  const groupIds=new Set(groups.find(group=>group.id===pack.value)?.characters||[]);
  for(const set of manager.listSets().filter(set=>Object.keys(set.entries).some(id=>groupIds.has(id)))){
   const row=element('div','skin-manager-set');row.append(element('strong','',set.name),element('small','',`${Object.keys(set.entries).filter(id=>groupIds.has(id)).length} 位武将`));
   button('一键应用整套',()=>run(()=>manager.applySet(set.id),'已应用 '+set.name+'（仅影响套装覆盖的武将）'),row);
   button('应用到所选',()=>run(()=>manager.applySet(set.id,targets()),'已将 '+set.name+' 应用到所选武将'),row);sets.append(row);
  }
  const preset=element('div','skin-manager-preset'),name=element('input');name.placeholder='自定义套装名称';name.setAttribute('aria-label','自定义套装名称');preset.append(name);
  button('保存所选当前搭配',()=>run(()=>{targets();return manager.savePreset(name.value,groups.find(group=>group.id===pack.value)?.name||'自定义',captureSkinEntries([...selected]));},'当前搭配已保存为套装'),preset);sets.append(preset);
 }
 async function renderSkins(id){
  const version=++revision;detail.replaceChildren(element('h3','',id?managedCharacterName(id)+' · 单张皮肤':'单张皮肤'));
  if(!id)return;
  detail.append(element('p','','读取皮肤列表…'));
  let files=[];
  if(game.qhly_getManagedSkinList)files=await new Promise(resolve=>{const timer=setTimeout(()=>resolve([]),12000);game.qhly_getManagedSkinList(id,(_ok,list)=>{clearTimeout(timer);resolve(list||[]);});});
  else files=manager.listSets().filter(set=>set.entries[id]).map(set=>managedToken(set.id));
  if(version!==revision||!dialog.isConnected)return;
  detail.replaceChildren(element('h3','',managedCharacterName(id)+' · 单张皮肤'));
  const actions=element('div','skin-manager-toolbar');
  button('全选皮肤',()=>{files.forEach(file=>skinSelected.add(file));void renderSkins(id);},actions);
  for(const enabled of [true,false])button((enabled?'启用':'禁用')+'所选皮肤',()=>run(()=>{if(!skinSelected.size)throw Error('请先勾选皮肤');return manager.setSkinsEnabled(id,[...skinSelected].flatMap(file=>[file,game.qhly_getSkinFile?.(id,file)].filter(Boolean)),enabled);},'已'+(enabled?'启用':'禁用')+'所选皮肤'),actions);
  detail.append(actions);
  const cards=element('div','skin-manager-skin-grid');
  for(const file of files){
   const set=manager.listSets().find(set=>managedToken(set.id)===file),entry=set?.entries[id];
   const dynamic=!!game.qhly_hasDynamicSkin?.(id,file),hidden=!!lib.config.skin_management?.hidden?.[id]?.[file];
   const row=element('article','skin-manager-skin'+(hidden?' is-disabled':'')),label=element('label'),check=element('input');row.dataset.skin=file;check.type='checkbox';check.checked=skinSelected.has(file);check.onchange=()=>check.checked?skinSelected.add(file):skinSelected.delete(file);
   const name=entry?.name||game.qhly_getSkinName?.(id,file)||file;label.append(check,element('span','',name));
   const img=element('img');img.loading='lazy';img.alt=name;img.src=lib.assetURL+(entry?.path||game.qhly_getSkinFile?.(id,file)||'');img.onerror=()=>{img.alt=name+'（无静态预览）';img.removeAttribute('src');};
   row.append(img,label,element('small','',`${dynamic?'动态':'静态'} · ${hidden?'已禁用':'已启用'}`));
   button('使用此皮肤',()=>run(async()=>{
    await manager.setSkinsEnabled(id,[file,entry?.path||game.qhly_getSkinFile?.(id,file)].filter(Boolean),true);await manager.setEnabled([id],dynamic?'dynamic':'static',true);
    if(set)await manager.applySet(set.id,[id]);
    else if(game.qhly_setCurrentSkin)await new Promise(resolve=>game.qhly_setCurrentSkin(id,file,resolve));
   },'已使用 '+name),row);cards.append(row);
  }
  if(!files.length)cards.append(element('p','','暂无已发现的皮肤。启用千幻聆音后可查看本地动静态资源。'));
  detail.append(cards);
 }
 for(const input of [pack,search,gender])input.addEventListener(input===search?'input':'change',()=>{
  selected.clear();page=0;render();
  if(input===pack){focused=filtered()[0];skinSelected.clear();void renderSkins(focused);}
 });
 left.append(selectionBar,grid,pages);right.append(sets,detail);layout.append(left,right);dialog.append(head,help,filters,toolbar,layout,status);
 dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
 dialog.addEventListener('close',()=>{revision++;dialog.remove();if(active===dialog)active=undefined;},{once:true});
 document.body.append(dialog);dialog.showModal();render();void renderSkins(focused);return dialog;
}
