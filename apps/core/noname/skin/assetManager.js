import {lib} from 'noname';
import {managedCharacterName,managedCharacterNames} from './managementRuntime.js';
import {saveSkinImage,readSkinArchive,matchSkinCharacter} from './setFiles.js';
import {reviewSkinImport} from './importDialog.js';

const el=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
const button=(parent,text,action)=>{const node=el('button',text);node.onclick=action;parent.append(node);return node;};
export function createAssetManager({manager,groups,focused,selected,pack,currentSet,run}){
 const root=el('section');root.className='skin-manager-assets';
 let scope='focused',view='focused',page=0;const selectedPacks=new Set();
 const all=groups.find(group=>group.id==='all')?.characters||[];
 function characters(){
  if(scope==='focused')return focused()?[focused()]:[];
  if(scope==='selected')return [...selected()];
  if(scope==='packages')return [...new Set(groups.filter(group=>selectedPacks.has(group.id)).flatMap(group=>group.characters))];
  return groups.find(group=>group.id===pack())?.characters||[];
 }
 function chooseFiles(){
  const ids=characters();if(!ids.length){void run(()=>{throw Error('请先选择武将或将包');},'');return;}
  const input=el('input');input.type='file';input.multiple=true;input.accept='.zip,.png,.jpg,.jpeg,.webp,.gif,.avif';input.hidden=true;root.append(input);
  input.oncancel=()=>input.remove();input.onchange=()=>{
   const files=[...input.files];input.remove();if(!files.length)return;
   void run(async()=>{
    const rows=[];
    for(const file of files){
     if(/\.zip$/i.test(file.name))rows.push(...await readSkinArchive(file,ids,managedCharacterNames));
     else{const matches=ids.length===1?ids:matchSkinCharacter(file.name,ids,managedCharacterNames);rows.push({path:file.name,matches,character:matches.length===1?matches[0]:'',read:async()=>file});}
    }
    const chosen=await reviewSkinImport(rows,ids,managedCharacterName,{name:'游离原画',entries:{}},{multiple:true});if(!chosen)return 0;
    const entries=[];for(const row of chosen)entries.push({character:row.character,entry:await saveSkinImage(await row.read(),row.path)});
    return manager.importLoose(entries);
   },count=>count?`已导入 ${count} 张游离原画，不属于任何套装`:'已取消导入');
  };input.click();
 }
 function transfer(asset){
  const dialog=el('dialog');dialog.className='skin-manager skin-asset-transfer';
  dialog.append(el('h2','移动原画 · '+asset.name),el('p','选择目标将包、武将和归属。替换套装原画时，原有原画会转为游离保存。'));
  const targetPack=el('select'),character=el('select'),destination=el('select'),mode=el('select'),status=el('p');
  character.setAttribute('aria-label','目标武将');
  const field=(title,control)=>{const label=el('label',title);label.append(control);return label;};
  const modeField=field('加入套装方式',mode);
  targetPack.setAttribute('aria-label','目标将包');destination.setAttribute('aria-label','目标归属');mode.setAttribute('aria-label','加入套装方式');
  for(const group of groups)targetPack.add(new Option(group.name,group.id));targetPack.value=groups.find(group=>group.id!=='all'&&group.characters.includes(asset.character))?.id||'all';let initialCharacter=asset.character;
  mode.add(new Option('补充到套装（保留现有默认原画）','extra'));mode.add(new Option('替换该套装默认原画','replace'));
  function targets(){
   const ids=groups.find(group=>group.id===targetPack.value)?.characters||[],before=initialCharacter||character.value;initialCharacter='';character.replaceChildren();
   for(const id of ids)character.add(new Option(managedCharacterName(id)+' · '+id,id));
   character.value=ids.includes(before)?before:ids[0]||'';destinations();
  }
  function destinations(){
   const before=destination.value;destination.replaceChildren(new Option('游离（不属于任何套装）',''));
   for(const set of manager.listSets())if(!set.base&&(set.packId==='all'||groups.find(group=>group.id===set.packId)?.characters.includes(character.value)))destination.add(new Option(set.name,set.id));
   destination.value=[...destination.options].some(option=>option.value===before)?before:'';modeField.hidden=!destination.value;
  }
  targetPack.onchange=targets;character.onchange=destinations;destination.onchange=()=>{modeField.hidden=!destination.value;};
  dialog.append(field('目标将包',targetPack),field('目标武将',character),field('目标归属',destination),modeField,status);const actions=el('div');actions.className='skin-manager-toolbar';dialog.append(actions);
  button(actions,'取消',()=>dialog.close());button(actions,'确认移动',()=>{
   const id=character.value.trim(),setId=destination.value;if(!all.includes(id)){status.textContent='请选择目标武将';return;}
   const replace=mode.value==='replace';dialog.close();void run(()=>manager.moveAsset(asset.id,id,setId||null,replace),'原画已移动至 '+managedCharacterName(id));
  });
  dialog.addEventListener('close',()=>dialog.remove(),{once:true});document.body.append(dialog);targets();dialog.showModal();
 }
 function render(){
  root.replaceChildren(el('h3','游离原画 / 套装补充原画'));
  const controls=el('div');controls.className='skin-manager-toolbar';const range=el('select');range.setAttribute('aria-label','导入范围');
  for(const [value,label]of [['focused','导入到当前武将'],['selected','导入到勾选武将'],['pack','导入到当前将包'],['packages','导入到多个将包']])range.add(new Option(label,value));range.value=scope;range.onchange=()=>{scope=range.value;render();};controls.append(range);button(controls,'导入图片 / ZIP',chooseFiles);root.append(controls);
  if(scope==='packages'){
   const packs=el('div');packs.className='skin-asset-pack-list';for(const group of groups.filter(group=>group.id!=='all')){const label=el('label'),check=el('input');check.type='checkbox';check.checked=selectedPacks.has(group.id);check.onchange=()=>check.checked?selectedPacks.add(group.id):selectedPacks.delete(group.id);label.append(check,el('span',group.name));packs.append(label);}root.append(packs);
  }
  root.append(el('p','每位武将可拥有多张游离原画；导入时按名称匹配，也可手动分配。'));
  const filter=el('select');filter.setAttribute('aria-label','原画查看范围');for(const [value,label]of [['focused','当前武将'],['pack','当前将包'],['all','全部游离 / 补充原画']])filter.add(new Option(label,value));filter.value=view;filter.onchange=()=>{view=filter.value;page=0;render();};root.append(filter);
  const ids=new Set(groups.find(group=>group.id===pack())?.characters||[]),rows=manager.listAssets().filter(asset=>view==='all'||(view==='focused'?asset.character===focused():ids.has(asset.character)));
  page=Math.max(0,Math.min(page,Math.ceil(rows.length/12)-1));const cards=el('div');cards.className='skin-manager-skin-grid';
  for(const asset of rows.slice(page*12,page*12+12)){
   const card=el('article');card.className='skin-manager-skin';const image=el('img');image.src=lib.assetURL+asset.path;image.loading='lazy';image.alt=asset.name;card.append(image,el('strong',asset.name),el('small',managedCharacterName(asset.character)+' · '+(asset.set?manager.getSet(asset.set).name:'游离')));
   button(card,'使用原画',()=>run(()=>manager.select(asset.character,{...asset,assetId:asset.id}),'已使用 '+asset.name));
   button(card,'移动 / 加入套装',()=>transfer(asset));
   if(!asset.set&&currentSet()&&!manager.getSet(currentSet()).base){
    button(card,'补充到当前套装',()=>run(()=>manager.moveAsset(asset.id,asset.character,currentSet()),'已补充到当前套装'));
    button(card,'替换当前套装原画',()=>{if(confirm('替换当前套装中此武将的默认原画？原有原画会转为游离保存。'))void run(()=>manager.moveAsset(asset.id,asset.character,currentSet(),true),'已替换套装默认原画');});
   }
   if(asset.set)button(card,'剥离为游离',()=>run(()=>manager.moveAsset(asset.id,asset.character),'已从套装剥离'));
   button(card,'重命名',()=>{const name=prompt('原画名称',asset.name);if(name!==null)void run(()=>manager.renameAsset(asset.id,name),'原画已重命名');});
   button(card,'删除并归档',()=>{if(confirm('删除此原画并归档到 temp？'))void run(()=>manager.deleteAsset(asset.id),path=>'原画已归档：'+path);});cards.append(card);
  }
  root.append(cards);if(!rows.length)root.append(el('p','此范围暂无游离或补充原画。'));
  if(rows.length>12){const pages=el('div');pages.className='skin-manager-toolbar';button(pages,'上一页',()=>{page--;render();});pages.append(el('span',`${page+1} / ${Math.ceil(rows.length/12)}`));button(pages,'下一页',()=>{page++;render();});root.append(pages);}
 }
 return {node:root,render};
}
