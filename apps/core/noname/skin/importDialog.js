/** Review archive assignments before any artwork or set configuration is written. */
export function reviewSkinImport(rows,characters,nameOf,set,{multiple=false}={}){
 return new Promise(resolve=>{
  const node=(tag,text)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=text;return element;};
  const dialog=node('dialog');dialog.className='skin-manager skin-import';
  const title=node('h2','导入到 '+set.name),help=node('p','已自动匹配武将，请检查结果；不需要的图片选择“跳过”。'+(multiple?'可为同一武将导入多张原画。':'每位武将保留一张原画。'));
  const summary=node('p'),list=node('div'),status=node('p'),tools=node('div');list.className='skin-import-rows';tools.className='skin-manager-toolbar';status.setAttribute('role','status');
  const allowed=new Set(characters);
  const overwrite=node('input');overwrite.type='checkbox';const label=node('label');label.append(overwrite,node('span','允许替换此套装已有的原画（默认保留）'));
  let page=0,result=null;
  const button=(text,handler)=>{const b=node('button',text);b.onclick=handler;tools.append(b);return b;};
  const pageLabel=node('span');
  function counts(){const mapped=rows.filter(row=>allowed.has(row.character));summary.textContent=`共 ${rows.length} 张 · 已分配 ${mapped.length} 张 · 待分配 / 跳过 ${rows.length-mapped.length} 张 · 将遇到已有皮肤 ${mapped.filter(row=>set.entries[row.character]).length} 张`;}
  function render(){
   list.replaceChildren();counts();pageLabel.textContent=`${page+1} / ${Math.max(1,Math.ceil(rows.length/40))}`;
   for(const row of rows.slice(page*40,page*40+40)){
    const line=node('label');line.className='skin-import-row';
    const info=node('span',row.path),input=node('select');input.setAttribute('aria-label','分配 '+row.path);input.add(new Option('跳过此图片',''));
    const ordered=[...new Set([...row.matches,...characters])].filter(id=>allowed.has(id));for(const id of ordered)input.add(new Option(nameOf(id)+(row.matches.includes(id)?' · 匹配候选':''),id));input.value=allowed.has(row.character)?row.character:'';
    const note=node('small');
    const update=()=>{row.character=input.value.trim();note.textContent=allowed.has(row.character)?nameOf(row.character)+(set.entries[row.character]?' · 已有原画':''):row.character?'无效的武将 ID':row.matches.length>1?'重名候选：'+row.matches.map(nameOf).join('、'):'未分配';counts();};
    input.onchange=update;update();line.append(info,input,note);list.append(line);
   }
  }
  button('上一页',()=>{page=Math.max(0,page-1);render();});tools.append(pageLabel);
  button('下一页',()=>{page=Math.min(Math.ceil(rows.length/40)-1,page+1);render();});
  button('取消',()=>dialog.close());
  button('确认导入',()=>{
   const chosen=[],seen=new Set();
   for(const row of rows){
    if(!row.character)continue;
    if(!allowed.has(row.character)){status.textContent='请修正无效武将 ID，或清空该行以跳过：'+row.path;return;}
    if(!overwrite.checked&&set.entries[row.character])continue;
    if(!multiple&&seen.has(row.character)){status.textContent='多张图片分配给了 '+nameOf(row.character)+'，请只保留一张，其余行选择跳过后再导入。';return;}
    seen.add(row.character);chosen.push(row);
   }
   if(!chosen.length){status.textContent='没有可导入的图片。请分配武将，或勾选允许替换已有原画。';return;}
   result=chosen;dialog.close();
  });
  dialog.append(title,help,summary,label,list,status,tools);
  dialog.addEventListener('close',()=>{dialog.remove();resolve(result);},{once:true});
  document.body.append(dialog);render();dialog.showModal();
 });
}
