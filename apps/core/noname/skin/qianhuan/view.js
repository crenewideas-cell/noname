import { skinCards, getCurrentSkin } from './model.js';

/** Port of the Qianhuan shousha skin page's portrait/card/selection flow.
 * Engine access is supplied by the host; this view never creates players.
 */
export function createQianhuanView({characters, initialCharacter, label, portrait, store, enabled, subscribe, asset}) {
 const previousFocus = document.activeElement;
 const dialog = document.createElement('dialog');
 dialog.className = 'qhly-character-skins';
 dialog.setAttribute('aria-label', '千幻聆音 · 武将皮肤');
 dialog.style.setProperty('--qh-background', `url(${JSON.stringify(asset('theme/shousha/bg_lobby.jpg'))})`);
 function node(tag, className, parent, text) {
  const element = document.createElement(tag); element.className = className;
  if (text) element.textContent = text;
  parent.append(element); return element;
 }
 function button(text, className, parent, action) {
  const element = node('button',className,parent,text); element.type='button';
  element.addEventListener('click',action); return element;
 }
 const header = node('header','qhly-heading',dialog);
 node('span','qhly-title',header,'千幻聆音');
 const choose = button('选择武将','qhly-choose-character',header,()=>{
  picker.hidden = !picker.hidden; choose.setAttribute('aria-expanded',String(!picker.hidden));
  if (!picker.hidden) search.focus();
 });
 choose.setAttribute('aria-expanded','false');
 const close = button('关闭','qhly-close',header,()=>dialog.close());
 const picker = node('section','qhly-character-picker',dialog); picker.hidden=true;
 const search = node('input','qhly-search',picker); search.type='search';search.placeholder='搜索武将名称 / 编号';search.setAttribute('aria-label','搜索武将');
 const results = node('div','qhly-character-results',picker);
 const main = node('main','qhly-main',dialog);
 const illustration = node('section','qhly-illustration',main);
 const largePortrait = node('div','qh-shousha-big-avatar',illustration);largePortrait.setAttribute('role','img');
 const caption = node('div','qhly-caption',illustration);
 const title = node('h2','qhly-character-name',caption);
 const selectedName = node('p','qhly-skin-name',caption);
 const page = node('section','qh-page-skin',main);
 node('h3','qhly-page-title',page,'武将皮肤');
 const context = node('p','qhly-context',page,'选择皮肤查看立绘，点击使用后同步到对局。');
 const track = node('div','qhly-skin-track',page); track.setAttribute('aria-label','皮肤列表');
 const toolbar = node('footer','qhly-actions',page);
 const status = node('p','qhly-status',toolbar);status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const retry = button('刷新','qhly-retry',toolbar,()=>load(true));
 const apply = button('使用皮肤','qhly-apply',toolbar,commit);
 let character = characters.includes(initialCharacter) ? initialCharacter : characters[0];
 let skinList=[], selected=null, disposed=false, busy=false, generation=0, unavailable=false;
 const cards = new Map();
 function message(text, error=false) {status.textContent=text;status.classList.toggle('qhly-error',error);}
 function update() {
  const current=store.current(character);
  apply.disabled=busy||!selected||!enabled()||current===selected.skinId;
  apply.textContent=busy?'正在保存…':current===selected?.skinId?'使用中':'使用皮肤';
  retry.disabled=choose.disabled=search.disabled=busy;
  for(const [id,card] of cards){card.disabled=busy;card.setAttribute('aria-pressed',String(id===selected?.skinId));card.dataset.equipped=String(id===current);}
 }
 function select(skin) {
  if(disposed||busy)return;
  selected=skin;selectedName.textContent=skin.name;
  portrait(largePortrait,character,skin.path);
  largePortrait.setAttribute('aria-label',`${label(character)} · ${skin.name}`);
  message(!enabled()?'请在外观设置中开启换肤。':unavailable?'本地目录暂不可用，已提供随包皮肤。':'预览中；使用皮肤后自动保存。');
  update();
 }
 function renderCharacters() {
  results.replaceChildren();const query=search.value.trim().toLocaleLowerCase();
  for(const id of characters){
   if(query&&!`${id} ${label(id)}`.toLocaleLowerCase().includes(query))continue;
   const item=button(label(id),'qhly-character',results,()=>{
    if(busy)return; character=id;picker.hidden=true;choose.setAttribute('aria-expanded','false');void load();
   });item.title=id;item.setAttribute('aria-current',String(id===character));item.disabled=busy;
  }
  if(!results.childElementCount)node('p','qhly-empty',results,'没有匹配的武将');
 }
 async function load(reload=false) {
  if(disposed||busy)return;
  const version=++generation;selected=null;cards.clear();track.replaceChildren();update();
  if(!character){message('当前没有可展示的武将');return;}
  title.textContent=label(character);choose.textContent=`${label(character)} · 选择武将`;
  selectedName.textContent='经典形象';portrait(largePortrait,character,null);message('正在读取皮肤…');
  try{
   const result=await store.list(character,{reload});
   if(disposed||version!==generation)return;
   unavailable=result.unavailable;skinList=skinCards(result.skins);
   context.textContent=`${label(character)} · ${skinList.length} 款形象`;
   for(const skin of skinList){
    const card=button('','qh-skinchange-shousha-big-skin',track,()=>select(skin));
    card.setAttribute('aria-label',skin.name);card.dataset.skinId=skin.skinId||'';
    const image=node('div','primary-avatar',card);portrait(image,character,skin.path);
    node('span','qh-skinchange-shousha-big-skin-text',card,skin.name);
    node('span','qhly-equipped',card,'使用中');cards.set(skin.skinId,card);
   }
   select(getCurrentSkin(skinList,store.current(character))||skinList[0]);
   renderCharacters();
  }catch(error){if(!disposed&&version===generation)message(error.message||'皮肤读取失败，请刷新重试',true);}
 }
 async function commit(){
  if(disposed||busy||!selected||!enabled())return;
  busy=true;update();renderCharacters();
  try{
   const changed=await store.apply(character,selected.skinId);
   if(!disposed)message(changed?'皮肤已使用并保存':'选择已更新，请刷新查看');
  }catch(error){if(!disposed)message(error.message||'保存失败，已保留原有皮肤',true);}
  finally{busy=false;if(!disposed){update();renderCharacters();}}
 }
 search.addEventListener('input',renderCharacters);
 const unsubscribe=subscribe(()=>{if(!disposed)update();});
 for(const type of ['keydown','keyup','click','pointerdown','pointerup','touchstart','touchend','wheel'])dialog.addEventListener(type,event=>event.stopPropagation());
 dialog.addEventListener('close',()=>{disposed=true;generation++;unsubscribe();dialog.remove();if(previousFocus?.isConnected&&!document.querySelector('.qhly-character-skins[open]'))previousFocus.focus();},{once:true});
 document.body.append(dialog);dialog.showModal();close.focus();renderCharacters();void load();
 return dialog;
}
