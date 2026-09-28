import {lib,game} from 'noname';
import {loadDynamicLibrary,libraryRows,previewLibrarySkin,nameScore,randomSample} from './dynamicLibrary.js';
import {managedCharacterName,managedCharacterNames,managedCharacterSex} from './managementRuntime.js';
import {enableDynamicPack} from './dynamicManagement.js';

const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
const select=(label,choices)=>{const node=el('select');node.setAttribute('aria-label',label);for(const [id,text]of choices)node.add(new Option(text,id));return node;};
const button=(parent,text,handler)=>{const node=el('button',text);node.onclick=handler;parent.append(node);return node;};
const check=text=>{const label=el('label'),input=el('input');input.type='checkbox';label.append(input,el('span',text));return {label,input};};
export function createDynamicLibraryPanel({manager,groups,focused,selected,pack,run}){
 const root=el('section',undefined,'dynamic-library');root.hidden=true;
 let rows=[],loaded=false,loading=false,page=0,plan=null,planSignature,previewState,planningRevision=0;
 let viewRows,viewSource,viewState,viewLegacy;
 const picked=new Set(),targetPacks=new Set();
 const knownCharacters=new Set(groups.flatMap(group=>group.characters));
 const banner=el('header',undefined,'dynamic-library-hero');banner.append(el('h3','动态皮肤管理'),el('p','预览动皮，为武将搭配新的形象。'));
 const metrics=el('div',undefined,'dynamic-library-metrics'),notice=el('p','点击“载入动态资源库”后查看全部资源。','skin-manager-status');notice.setAttribute('role','status');
 const loadbar=el('div',undefined,'skin-manager-toolbar');button(loadbar,'载入 / 刷新动态资源库',()=>void load(true));
 const sourcePack=select('动态资源包',[['','全部资源包']]),sourceGroup=select('动态分组',[['','全部原角色 / 分组']]),ownership=select('绑定状态',[['','全部状态'],['unbound','游离动皮'],['bound','已绑定动皮']]),sourceSex=select('资源性别',[['','全部性别'],['female','女'],['male','男'],['double','双性 / 多人'],['unknown','未标注']]),query=el('input');query.placeholder='搜索角色、皮肤名称、资源 ID 或已绑定武将';query.setAttribute('aria-label','搜索动态资源');
 const filters=el('div',undefined,'dynamic-library-filters');filters.append(sourcePack,sourceGroup,ownership,sourceSex,query);
 const selection=el('div',undefined,'skin-manager-toolbar'),pickedCount=el('span');
 button(selection,'选择筛选结果',()=>{visibleRows().forEach(row=>picked.add(row.key));invalidate();renderCards();});button(selection,'清空勾选',()=>{picked.clear();invalidate();renderCards();});selection.append(pickedCount);
 const labeling=el('div',undefined,'dynamic-library-labeling'),labelSex=select('批量标注性别',[['unknown','标注为未确定'],['female','标注为女'],['male','标注为男'],['double','标注为双性 / 多人']]),labelGroup=el('input');labelGroup.placeholder='自定义分组名称';labelGroup.setAttribute('aria-label','自定义动态分组');labeling.append(labelSex);
 button(labeling,'标注所选性别',()=>void run(()=>{if(!picked.size)throw Error('请先勾选动态资源');return manager.labelDynamic([...picked],{sex:labelSex.value});},'已更新动态资源性别分类'));
 labeling.append(labelGroup);button(labeling,'归入此分组',()=>void run(()=>{if(!picked.size||!labelGroup.value.trim())throw Error('请勾选资源并填写分组名称');return manager.labelDynamic([...picked],{group:labelGroup.value.trim()});},'已更新动态分组'));
 const cards=el('div',undefined,'dynamic-library-grid'),pagination=el('div',undefined,'skin-manager-toolbar'),pageLabel=el('span');button(pagination,'上一页',()=>{page--;renderCards();});pagination.append(pageLabel);button(pagination,'下一页',()=>{page++;renderCards();});
 const planner=el('section',undefined,'dynamic-assignment');planner.append(el('h3','分配工作台'),el('p','选择目标 → 生成清单 → 确认应用'));
 const plannerHelp=el('details');plannerHelp.append(el('summary','分配说明'),el('p','绑定只改变归属，原始资源始终保留。名称匹配、性别条件及数量不足会在生成的清单中提示。'));planner.append(plannerHelp);
 const targetScope=select('目标武将范围',[['selected','左侧勾选的武将'],['focused','当前查看武将'],['pack','左侧当前将包'],['packages','自选多个将包'],['owners','候选动皮已绑定的武将']]),targetSex=select('目标武将性别',[['','目标不限性别'],['female','仅女武将'],['male','仅男武将'],['double','仅双性 / 多人']]),targetQuery=el('input');targetQuery.placeholder='目标武将名称 / ID（可选）';targetQuery.setAttribute('aria-label','目标武将搜索');
 const targetControls=el('div',undefined,'dynamic-library-filters');targetControls.append(targetScope,targetSex,targetQuery);planner.append(targetControls);
 const packList=el('div',undefined,'skin-asset-pack-list');for(const group of groups.filter(group=>group.id!=='all')){const item=check(group.name);item.input.onchange=()=>{item.input.checked?targetPacks.add(group.id):targetPacks.delete(group.id);invalidate();};packList.append(item.label);}packList.hidden=true;planner.append(packList);
 const pool=select('候选动皮范围',[['picked','勾选的动态皮肤'],['filtered','当前筛选结果']]),method=select('分配方法',[['name','按名称模糊匹配'],['random','从候选池随机分配'],['manual','指定候选动皮给每位目标']]),writeMode=select('写入方式',[['append','补充绑定（保留现有）'],['replace','替换目标的全部绑定']]);
 const modeControls=el('div',undefined,'dynamic-library-filters');modeControls.append(pool,method,writeMode);planner.append(modeControls);
 const numberMode=select('数量方式',[['fixed','每位武将固定数量'],['range','每位武将随机数量区间']]),min=el('input'),max=el('input');for(const node of [min,max]){node.type='number';node.min='1';node.step='1';node.value='1';}min.setAttribute('aria-label','固定数量或区间下限');max.setAttribute('aria-label','区间上限');max.value='3';max.hidden=true;
 const numbers=el('div',undefined,'dynamic-library-filters'),minimum=el('label','数量 / 下限'),maximum=el('label','上限');minimum.append(min);maximum.append(max);maximum.hidden=true;numbers.append(numberMode,minimum,maximum);planner.append(numbers);
 const genderMatch=check('资源与武将性别一致（跳过未标注资源）'),reuse=check('允许同一动皮分配给多位武将'),partial=check('数量不足时允许分配现有资源'),activate=check('分配后使用每位武将的第一款');reuse.input.checked=true;
 const switches=el('div',undefined,'dynamic-assignment-switches');for(const item of [genderMatch,reuse,partial,activate])switches.append(item.label);planner.append(switches);
 const targetCount=el('p'),planButtons=el('div',undefined,'skin-manager-toolbar'),preview=el('div',undefined,'dynamic-assignment-preview');planner.append(targetCount,planButtons,preview);
 button(planButtons,'生成分配清单',makePlan);button(planButtons,'解除候选资源与目标的绑定',makeRemovalPlan);
 const commit=button(planButtons,'应用此清单',()=>void applyPlan());commit.disabled=true;
 root.append(banner,metrics,loadbar,notice,filters,selection,labeling,cards,pagination,planner);
 function current(){
  if(!viewRows||viewSource!==rows||viewState!==lib.config.skin_management||viewLegacy!==lib.config.localDynamicSkinBindings){
   viewRows=libraryRows(rows);viewSource=rows;viewState=lib.config.skin_management;viewLegacy=lib.config.localDynamicSkinBindings;
  }
  return viewRows;
 }
 function visibleRows(){const q=query.value.trim().toLowerCase();return current().filter(row=>(!sourcePack.value||row.pack===sourcePack.value)&&(!sourceGroup.value||row.group===sourceGroup.value)&&(!sourceSex.value||row.sex===sourceSex.value)&&(!ownership.value||(ownership.value==='bound')===!!row.owners.length)&&(!q||[row.entry.character,row.entry.title,row.entry.id,...row.owners.map(managedCharacterName)].join(' ').toLowerCase().includes(q)));}
 function targets(){
  const ids=targetScope.value==='owners'?candidates().flatMap(row=>row.owners):targetScope.value==='focused'?[focused()]:targetScope.value==='selected'?[...selected()]:targetScope.value==='packages'?groups.filter(group=>targetPacks.has(group.id)).flatMap(group=>group.characters):groups.find(group=>group.id===pack())?.characters||[];
  const q=targetQuery.value.trim().toLowerCase();return [...new Set(ids.filter(id=>knownCharacters.has(id)))].filter(id=>(!targetSex.value||managedCharacterSex(id)===targetSex.value)&&(!q||(id+' '+managedCharacterName(id)).toLowerCase().includes(q)));
 }
 function candidates(){return pool.value==='picked'?current().filter(row=>picked.has(row.key)):visibleRows();}
 function signature(){return JSON.stringify([targets(),candidates().map(row=>row.key),method.value,writeMode.value,numberMode.value,min.value,max.value,genderMatch.input.checked,reuse.input.checked,partial.input.checked,activate.input.checked]);}
 function invalidate(){planningRevision++;plan=null;commit.disabled=true;preview.replaceChildren();targetCount.textContent=`当前目标 ${targets().length} 位 · 候选动皮 ${candidates().length} 款`;}
 function renderGroups(){const before=sourceGroup.value;sourceGroup.replaceChildren(new Option('全部原角色 / 分组',''));for(const group of [...new Set(current().filter(row=>!sourcePack.value||row.pack===sourcePack.value).map(row=>row.group))].sort((a,b)=>a.localeCompare(b,'zh')))sourceGroup.add(new Option(group,group));if([...sourceGroup.options].some(option=>option.value===before))sourceGroup.value=before;}
 function renderCards(){
  if(!loaded)return;
  const all=current(),visible=visibleRows();metrics.replaceChildren();for(const [label,count]of [['全部动皮',all.length],['游离',all.filter(row=>!row.owners.length).length],['已绑定',all.filter(row=>row.owners.length).length],['已勾选',picked.size]]){const stat=el('div');stat.append(el('strong',String(count)),el('span',label));metrics.append(stat);}
  page=Math.max(0,Math.min(page,Math.ceil(visible.length/12)-1));pickedCount.textContent=`已选 ${picked.size} / 筛选 ${visible.length}`;pageLabel.textContent=`${page+1} / ${Math.max(1,Math.ceil(visible.length/12))}`;cards.replaceChildren();
  for(const row of visible.slice(page*12,page*12+12)){
   const card=el('article',undefined,'dynamic-library-card'),image=el('img');image.src=lib.assetURL+row.path;image.loading='lazy';image.alt=row.entry.title;image.onerror=()=>{image.removeAttribute('src');image.alt=row.entry.title+'（暂无缩略图，可预览动态）';};
   const label=check(row.entry.title);label.input.checked=picked.has(row.key);label.input.onchange=()=>{label.input.checked?picked.add(row.key):picked.delete(row.key);invalidate();renderCards();};
   const status=el('span',row.owners.length?`已绑定 ${row.owners.length} 位`:'游离动皮','dynamic-library-badge'+(row.owners.length?' is-bound':''));
   card.append(image,status,label.label,el('small',row.pack+' · '+row.group),el('small',({female:'女',male:'男',double:'双性 / 多人',unknown:'性别未标注'})[row.sex]||row.sex));
   const owners=el('p',row.owners.slice(0,3).map(managedCharacterName).join('、')+(row.owners.length>3?'…':''));owners.title=row.owners.map(id=>managedCharacterName(id)+' ('+id+')').join('、');card.append(owners);
   button(card,'预览',()=>previewLibrarySkin(row));
   if(row.owners.length)button(card,'查看 / 解除绑定',()=>{picked.clear();picked.add(row.key);pool.value='picked';targetScope.value='owners';targetSex.value=targetQuery.value='';packList.hidden=true;notice.textContent='已选中此款动皮及其绑定的武将。可生成解除清单，也可在左侧勾选后切换目标范围。';invalidate();planner.scrollIntoView({block:'nearest'});renderCards();});
   cards.append(card);
  }
  if(!visible.length)cards.append(el('p','没有符合条件的动态资源。'));
  targetCount.textContent=`当前目标 ${targets().length} 位 · 候选动皮 ${candidates().length} 款`;
 }
 async function load(reload=false){
  if(loading)return;loading=true;
  invalidate();
  try{rows=await loadDynamicLibrary(text=>notice.textContent=text,{reload});loaded=true;const before=sourcePack.value;sourcePack.replaceChildren(new Option('全部资源包',''));for(const name of new Set(rows.map(row=>row.pack)))sourcePack.add(new Option(name,name));sourcePack.value=[...sourcePack.options].some(option=>option.value===before)?before:'';const known=new Set(rows.map(row=>row.key));for(const key of picked)if(!known.has(key))picked.delete(key);renderGroups();renderCards();notice.textContent='资源库已就绪。先勾选资源或使用筛选结果，再选择分配目标。';}catch(error){notice.textContent='读取失败：'+error.message;}finally{loading=false;}
 }
 function showPlan(next,issues,mode){
  plan={rows:next,issues,mode};planSignature=signature();previewState=lib.config.skin_management;
  preview.replaceChildren(el('strong',`${next.length} 位目标 · ${next.reduce((n,row)=>n+row.skins.length,0)} 项绑定 · ${issues.length} 项提示`));
  for(const issue of issues)preview.append(el('p',issue,'dynamic-assignment-warning'));
  for(const row of next){const line=el('div');line.append(el('strong',managedCharacterName(row.character)),el('small',row.skins.map(skin=>skin.entry.character+' · '+skin.entry.title).join('；')||'解除全部动态绑定'));preview.append(line);}
  commit.disabled=!next.length;notice.textContent='清单已生成，尚未修改绑定。';
 }
 async function makePlan(){
  invalidate();const generation=planningRevision,startedState=lib.config.skin_management,startedSignature=signature();
  if(!loaded){notice.textContent='请先载入资源库';return;}
  const ids=targets(),source=candidates(),low=Number(min.value),high=numberMode.value==='range'?Number(max.value):low;
  if(!ids.length||!source.length){notice.textContent='请先选择目标武将和候选动皮';return;}
  if(method.value!=='manual'&&(!Number.isSafeInteger(low)||!Number.isSafeInteger(high)||low<1||high<low)){notice.textContent='数量必须为有效正整数，区间上限不能小于下限';return;}
  const used=new Set(),next=[],issues=[];
  for(const [position,character]of ids.entries()){
   if(position%10===0){
    notice.textContent=`正在生成清单 ${position} / ${ids.length}…`;
    await new Promise(resolve=>setTimeout(resolve,0));
    if(generation!==planningRevision||!root.isConnected)return;
   }
   let pool=source.filter(row=>(writeMode.value!=='append'||!row.owners.includes(character))&&(reuse.input.checked||!used.has(row.key))&&(!genderMatch.input.checked||(row.sex!=='unknown'&&row.sex===managedCharacterSex(character))));
   if(method.value==='name'){const names=managedCharacterNames(character);pool=pool.map(row=>({...row,score:nameScore(row,character,names)})).filter(row=>row.score>=50).sort((a,b)=>b.score-a.score);}
   const random=new Uint32Array(1);crypto.getRandomValues(random);
   const amount=method.value==='manual'?pool.length:low+Math.floor(random[0]/4294967296*(high-low+1));
   if(pool.length<amount||!pool.length){issues.push(`${managedCharacterName(character)}：符合条件 ${pool.length} 款，需要 ${amount||1} 款${partial.input.checked?'，按现有数量分配':'，跳过此武将'}`);if(!partial.input.checked||!pool.length)continue;}
   if(method.value==='name'&&pool.length>amount&&pool[amount-1]?.score===pool[amount]?.score)issues.push(`${managedCharacterName(character)}：有多款名称匹配度相同的资源，请核对下方清单。`);
   const chosen=method.value==='random'?randomSample(pool,amount):pool.slice(0,amount);
   chosen.forEach(row=>used.add(row.key));next.push({character,skins:chosen});
  }
  if(startedState!==lib.config.skin_management||startedSignature!==signature()){invalidate();notice.textContent='目标或资源在生成过程中已变化，请重新生成清单。';return;}
  showPlan(next,issues,writeMode.value);
 }
 function makeRemovalPlan(){
  invalidate();
  if(!loaded)return;
  const ids=targets(),source=new Set(candidates().map(row=>row.key)),all=current();if(!ids.length||!source.size){notice.textContent='请选择需解除绑定的资源和目标武将';return;}
  const next=ids.filter(id=>all.some(row=>source.has(row.key)&&row.owners.includes(id))).map(character=>({character,skins:all.filter(row=>row.owners.includes(character)&&!source.has(row.key))}));
  showPlan(next,['此清单只解除所选资源的绑定，保留目标的其他动皮和全部源文件。'],'replace');plan.removal=true;
 }
 async function applyPlan(){
  if(!plan)return;
  if(planSignature!==signature()||previewState!==lib.config.skin_management){invalidate();notice.textContent='目标、资源或绑定已变化，请重新生成清单。';return;}
  const chosen=plan;
  if(chosen.mode==='replace'&&!confirm(chosen.removal?'确认执行解除绑定清单？原始动皮资源会保留。':'确认替换这些武将的全部动态绑定？原始动皮资源会保留。'))return;
  await run(async()=>{
   await manager.assignDynamic(chosen.rows.map(row=>({character:row.character,skins:row.skins.map(skin=>({pack:skin.pack,id:skin.entry.id,token:skin.entry.skinTitle+'.png'}))})),chosen.mode);
   const hub=game.localDynamicSkinTestHub;
   try{for(let i=0;i<chosen.rows.length;i+=6)await Promise.all(chosen.rows.slice(i,i+6).map(row=>hub.ensureCharacter(row.character)));}
   catch(error){throw Error('动态绑定已保存，但部分资源未能载入，可稍后重开皮肤管理：'+error.message);}
   if(activate.input.checked&&!chosen.removal){
    const selections=chosen.rows.filter(row=>row.skins.length).map(row=>{const skin=row.skins[0];return {character:row.character,entry:{name:skin.entry.title,path:skin.path,token:skin.entry.skinTitle+'.png',dynamic:true,pack:skin.pack,id:skin.entry.id}};});
    try{for(const name of new Set(selections.map(row=>row.entry.pack)))await enableDynamicPack(name);await manager.activateDynamic(selections);}
    catch(error){throw Error('动态绑定已保存，但启用形象未完成：'+error.message);}
   }
   hub.invalidateCatalog();hub.refresh();invalidate();renderCards();notice.textContent='分配已保存。';
  },'动态绑定已更新');
 }
 for(const node of [sourcePack,sourceGroup,ownership,sourceSex,query,targetScope,targetSex,targetQuery,pool,method,writeMode,numberMode,min,max,genderMatch.input,reuse.input,partial.input,activate.input])node.addEventListener(node===query||node===targetQuery?'input':'change',()=>{
  if(node===sourcePack)renderGroups();packList.hidden=targetScope.value!=='packages';maximum.hidden=max.hidden=numberMode.value!=='range';numbers.hidden=method.value==='manual';page=0;invalidate();renderCards();
 });
 return {node:root,show(){root.hidden=false;if(!loaded)void load();else refresh();},refresh};
 function refresh(){if(loaded){renderGroups();renderCards();if(plan&&(previewState!==lib.config.skin_management||planSignature!==signature()))invalidate();}}
}
