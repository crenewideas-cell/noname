/** Visual controls emit the same style values as existing manifests. */
const choices = {
 'border-radius': ['圆角', {'0px':'直角','4px':'小圆角 · 4 px','8px':'中圆角 · 8 px','12px':'大圆角 · 12 px','999px':'胶囊形'}],
 'font-size': ['字号', Object.fromEntries([14,16,18,20,24,28,32].map(n=>[n+'px',n+' px']))],
 gap: ['元素间距', Object.fromEntries([0,4,8,12,16,24,32].map(n=>[n+'px',n+' px']))],
 'box-shadow': ['阴影', {none:'无阴影','0 2px 6px #0003':'轻微','0 4px 12px #0005':'柔和','0 0 12px #d3b47288':'金色光晕'}],
 width: ['指示线粗细', Object.fromEntries([1,2,3,4,6,8].map(n=>[n+'px',n+' px']))],
 opacity: ['不透明度', Object.fromEntries([100,90,80,70,60,50,25,0].map(n=>[String(n/100),n+'%']))],
};
export function renderStyleControls(parent, part, partId, changed) {
 const doc=parent.ownerDocument;
 const el=(tag,host,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;host.append(n);return n;};
 const commit=(key,value)=>{if(value)part.style[key]=value;else delete part.style[key];changed();};
 function selector(key,title,values){
  const row=el('div',parent);row.className='style-field';
  const label=el('label',row);el('span',label,title);const select=el('select',label);
  select.setAttribute('aria-label',title);select.dataset.styleKey=key;
  const all={'':'沿用原样式',...values},current=part.style[key]||'';
  if(current&&!Object.hasOwn(all,current))all[current]='已保存的自定义值';
  for(const [value,name]of Object.entries(all)){const o=el('option',select,name);o.value=value;}
  select.value=current;select.onchange=()=>commit(key,select.value);
  return {row,select};
 }
 for(const [key,title]of [['color',partId==='lines'?'指示线颜色':'文字颜色'],['background-color','底色'],['border-color','边框颜色']]){
  const {row,select}=selector(key,title,{'#30251c':'深棕','#fff3d3':'米白','#c4b590':'浅金','#d3b472':'金色','#702a1d':'朱红',transparent:'透明'});
  const picker=el('input',row);picker.type='color';picker.value=/^#[\da-f]{6}$/i.test(part.style[key]||'')?part.style[key]:'#d3b472';picker.setAttribute('aria-label','自选'+title);picker.title='点击选择'+title;
  picker.oninput=()=>{if(![...select.options].some(o=>o.value===picker.value)){const o=select.querySelector('[data-custom-color]')||el('option',select,'自选颜色');o.dataset.customColor='';o.value=picker.value;}select.value=picker.value;commit(key,picker.value);};
  select.addEventListener('change',()=>{if(/^#[\da-f]{6}$/i.test(select.value))picker.value=select.value;});
 }
 for(const [key,[title,values]]of Object.entries(choices))if(key!=='width'||partId==='lines')selector(key,title,values);
}
