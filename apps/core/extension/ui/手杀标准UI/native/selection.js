// The host owns selection legality and event completion; the suite owns art.
export function createSelectionAdapter({lib,game,ui,get,_status}) {
 const original={button:ui.click.button,ok:ui.click.ok,cancel:ui.click.cancel};
 function isGuozhanChoice(event) {
  return get.mode()==='guozhan' && event?.name==='chooseButton'
   && event.getParent('chooseCharacter')?.name==='chooseCharacter'
   && event.dialog?.buttons?.some(button=>button.classList.contains('character'))
   && !event.custom?.replace?.button;
 }
 const handlers={...original,
  cancel(...args) {
   const event=_status.event;
   if(isGuozhanChoice(event)&&ui.selected.buttons.length){
    game.uncheck('button');
    delete event._buttonChoice;
    event.custom?.add?.button?.();
    game.check();
    return;
   }
   return original.cancel.apply(this,args);
  },
 };
 function begin(event){
  if(!isGuozhanChoice(event))return;
  // Faction compatibility depends on the first pick: never cache the first
  // empty-selection result or inherit the legacy single-click shortcut.
  event.selectButton=[2,2];event.complexSelect=true;event.auto=false;
  delete event._buttonChoice;
  event.dialog.classList.add('ss-guozhan-choice');
 }
 function end(event,{ok}){
  const choosing=isGuozhanChoice(event)&&event.isMine();
  ui.confirm?.classList.toggle('ss-guozhan-confirm',!!choosing);
  if(!choosing)return;
  const selected=ui.selected.buttons;
  for(const button of event.dialog.buttons){
   const index=selected.indexOf(button);
   button.classList.toggle('ss-choice-unavailable',index<0&&!button.classList.contains('selectable'));
   if(index>=0)button.dataset.ssGeneral=index===0?'主将':'副将';
   else delete button.dataset.ssGeneral;
  }
  if(!_status.noconfirm&&!event.noconfirm){
   // Cancel means start the mandatory pair again, never submit a false result
   // to the mode's required chooseButton event.
   ui.create.confirm((ok&&selected.length===2?'o':'')+(selected.length?'c':''));
   ui.confirm?.classList.add('ss-guozhan-confirm');
  }
 }
 return {handlers,install(){
  Object.assign(ui.click,handlers);
  lib.hooks.checkBegin.push(begin);lib.hooks.checkEnd.push(end);
  return()=>{
   lib.hooks.checkBegin.remove(begin);lib.hooks.checkEnd.remove(end);
   for(const key of Object.keys(handlers))if(ui.click[key]===handlers[key])ui.click[key]=original[key];
  };
 }};
}
