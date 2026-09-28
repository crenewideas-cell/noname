export const CARD_GALLERY_PAGE_SIZE = 72;

/** Bound retained pages as well as visible nodes; detached galleries hold images too. */
export function createCardPageCache(dispose, limit = 3) {
 const pages = new Map();
 return {
  use(node) {
   pages.delete(node); pages.set(node, true);
   while (pages.size > limit) {
    const oldest = [...pages.keys()].find(page => page !== node && !page.classList?.contains('active'));
    if (!oldest) break;
    pages.delete(oldest); dispose(oldest);
   }
  },
 };
}

export function createCardPackGallery({ parent, list, createButtons, configure, translate, state }) {
 const host = document.createElement('div');host.className='card-pack-gallery';
 const controls = document.createElement('div');controls.className='card-gallery-controls';
 const grid = document.createElement('div');grid.className='card-gallery-grid';
 const previous=document.createElement('button'), next=document.createElement('button'), retry=document.createElement('button'), status=document.createElement('span');
 previous.textContent='上一页';next.textContent='下一页';retry.textContent='重新加载牌面';
 const search=document.createElement('input');search.type='search';search.placeholder='搜索本卡包';search.setAttribute('aria-label','搜索本卡包');search.value=state.query||'';
 if(list.length>CARD_GALLERY_PAGE_SIZE)controls.append(search,previous,status,next);
 controls.append(retry);host.append(controls,grid);parent.append(host);
 function render() {
  const query=search.value.trim().toLocaleLowerCase();state.query=search.value;
  const filtered=query?list.filter(item=>(translate(item[2])+' '+item[2]).toLocaleLowerCase().includes(query)):list;
  const count=Math.max(1,Math.ceil(filtered.length/CARD_GALLERY_PAGE_SIZE));
  state.page=Math.max(0,Math.min(state.page||0,count-1));
  grid.replaceChildren();
  const buttons=createButtons(filtered.slice(state.page*CARD_GALLERY_PAGE_SIZE,(state.page+1)*CARD_GALLERY_PAGE_SIZE),grid);
  buttons.forEach(configure);
  status.textContent=`${state.page+1} / ${count} · 共 ${filtered.length} 张`;
  previous.disabled=state.page===0;next.disabled=state.page===count-1;
  if(!filtered.length){const empty=document.createElement('p');empty.textContent='没有匹配的卡牌';grid.append(empty);}
 }
 search.addEventListener('input',()=>{state.page=0;render();});
 previous.onclick=()=>{state.page--;render();};next.onclick=()=>{state.page++;render();};retry.onclick=render;
 render();return host;
}
