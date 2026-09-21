// Decorate the existing right-hand toolbar only. The host keeps ownership of
// opening/closing, visibility, click/touch listeners and hover popups.
export function installNativeMenu({ui}) {
 const group=ui.system2;
 if(!group)return()=>{};
 const decorated=new Set();
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
 const observer=new MutationObserver(decorate);
 observer.observe(group,{childList:true,subtree:true,characterData:true});decorate();
 return()=>{
  observer.disconnect();
  for(const button of decorated){button.classList.remove('ss-utility-button');delete button.dataset.ssIcon;delete button.dataset.ssLabel;}
 };
}