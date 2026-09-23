// Decorate the existing right-hand toolbar only. The host keeps ownership of
// opening/closing, visibility, click/touch listeners and hover popups.
export function installNativeMenu({ui}) {
 const group=ui.system2;
 if(!group)return()=>{};
 const decorated=new Set();
 const dialogs=new Map();
 const actions=[[/^投降$/,'surrender'],[/^记牌器$/,'record'],[/^牌堆$/,'pile'],[/^公共区域$/,'public'],[/^(显示|隐藏)身份$/,'identity']];
 function decorate(){
  for(const button of group.children){
   const label=(button.textContent||'').trim();
   const action=actions.find(([pattern])=>pattern.test(label));
   if(!action){
    if(decorated.delete(button)){button.classList.remove('ss-utility-button');delete button.dataset.ssIcon;delete button.dataset.ssLabel;}
    continue;
   }
   decorated.add(button);button.classList.add('ss-utility-button');
   if(button.dataset.ssIcon!==action[1])button.dataset.ssIcon=action[1];
   if(button.dataset.ssLabel!==label)button.dataset.ssLabel=label;
  }
 }
 function decorateDialogs(){
  for(const dialog of document.querySelectorAll('dialog.game-navigation[aria-labelledby="game-navigation-title"]')){
   if(dialogs.has(dialog))continue;
   // Keep the host's continue/restart/leave/exit buttons and their handlers.
   // Extra shortcuts activate the existing host controls after closing its modal.
   dialog.classList.add('ss-game-menu');
   const shortcuts=document.createElement('div');shortcuts.className='ss-menu-shortcuts';
   const surrender=Array.from(group.children).find(n=>n.textContent?.trim()==='投降');
   for(const [source,label,icon]of [[ui.config2,'设置','settings'],[ui.auto,'托管','auto'],[surrender,'投降','surrender']]){
    const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.ssIcon=icon||'settings';
    button.title=label;button.setAttribute('aria-label',label);
    button.disabled=!source?.isConnected||source.classList.contains('hidden')||source.style.display==='none'||source.disabled;
    button.addEventListener('click',()=>{if(dialog.querySelector('.game-navigation-actions button:disabled'))return;dialog.addEventListener('close',()=>source.click(),{once:true});dialog.close();});shortcuts.append(button);
   }
   dialog.insertBefore(shortcuts,dialog.querySelector('.game-navigation-actions'));
   dialogs.set(dialog,shortcuts);
  }
  for(const dialog of dialogs.keys())if(!dialog.isConnected){dialog.classList.remove('ss-game-menu');dialogs.get(dialog).remove();dialogs.delete(dialog);}
 }
 const observer=new MutationObserver(decorate);
 observer.observe(group,{childList:true,subtree:true,characterData:true});decorate();
 const modalObserver=new MutationObserver(decorateDialogs);modalObserver.observe(document.body,{childList:true,subtree:true});decorateDialogs();
 return()=>{
  observer.disconnect();
  modalObserver.disconnect();for(const [dialog,shortcuts]of dialogs){dialog.classList.remove('ss-game-menu');shortcuts.remove();}dialogs.clear();
  for(const button of decorated){button.classList.remove('ss-utility-button');delete button.dataset.ssIcon;delete button.dataset.ssLabel;}
 };
}
