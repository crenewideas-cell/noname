import { lib, game, get, ui, _status } from 'noname';
import {openSkinManager} from '../manager.js';

let active;
let notice;

function showNotice(text) {
 if(notice?.isConnected){notice.querySelector('p').textContent=text;return notice;}
 const dialog=document.createElement('dialog');dialog.className='qhly-core-notice';
 const message=document.createElement('p');message.textContent=text;
 const close=document.createElement('button');close.textContent='关闭';close.onclick=()=>dialog.close();
 dialog.append(message,close);document.body.append(dialog);
 dialog.addEventListener('close',()=>{dialog.remove();if(notice===dialog)notice=undefined;},{once:true});
 notice=dialog;dialog.showModal();return dialog;
}

/** A remembered skin entry may belong to an uninstalled/disabled character pack.
 * Resolve against current metadata only; browsing must not enable gameplay code.
 * The normal remembered/default path does not scan the entire character catalog.
 */
function defaultCharacter() {
 const available=id=>{if(typeof id!=='string'||!id)return false;const info=get.character(id);return !info.isNull&&!info.isUnseen;};
 for(const id of [lib.config.qhly_lastCharacter,'caocao'])if(available(id))return id;
 for(const id of Object.keys(lib.character))if(available(id))return id;
 for(const pack of Object.values(lib.characterPack))for(const id of Object.keys(pack))if(available(id))return id;
}

/** Use Qianhuan's original portrait menu without its legacy player.init override. */
export function openPlayerSkinMenu(avatar, event) {
 const player=avatar?.parentNode;
 if(!game.qhly_coreReady || !lib.config.extension_千幻聆音_enable ||
  lib.config.extension_千幻聆音_qhly_playerwindow===false ||
  !player?.node || ![player.node.avatar,player.node.avatar2].includes(avatar) ||
  !(game.players?.includes(player)||game.dead?.includes(player)))return false;
 const secondary=avatar===player.node.avatar2;
 const name=secondary?player.name2:player.name1||player.name;
 if(!name || get.character(name).isNull || player.isUnseen(secondary?1:0) ||
  _status.dragged || _status.clicked || ui.intro || ui.arena?.classList.contains('selecting') ||
  player.classList.contains('selectable') || player.classList.contains('target'))return false;
 if(!game.qhly_playerWindow(avatar))return false;
 // touchend no longer bubbles to the player: cancel its pending long press here.
 ui.click.longpresscancel.call(player);
 // Stop the browser's compatibility click from landing on the newly opened menu.
 if(event?.type==='touchend')event.preventDefault();
 event?.stopPropagation();
 return true;
}

/** Replace the former in-game player introduction with the native profile. */
export function openPlayerCharacterInfo(node, event) {
 const player=node?.linkplayer?node.link:node;
 if(!game.qhly_coreReady || !lib.config.extension_千幻聆音_enable ||
  !player?.node || !(game.players?.includes(player)||game.dead?.includes(player)))return false;
 const secondary=event?.target?.closest?.('.avatar2, .name2');
 const slots=secondary?[1]:[0,1];
 const slot=slots.find(index=>{
  const name=index?player.name2:player.name1||player.name;
  return name&&!player.isUnseen(index)&&!get.character(name).isNull;
 });
 event?.stopPropagation?.();
 game.qhly_closePlayerWindow?.();
 if(_status.qhly_open || _status.bigEditing)return true;
 // Consume hidden-player introductions without revealing their identity.
 if(slot===undefined)return true;
 openCharacterSkins(slot?player.name2:player.name1||player.name,player,'skill');
 return true;
}

/** Lobby entries select the native page; Qianhuan owns the original detail UI. */
export function openCharacterSkins(character, player, requestedPage) {
 if (!game.qhly_coreReady || !lib.config.extension_千幻聆音_enable) {
  return showNotice('请在扩展管理中启用「千幻聆音」并重启游戏。');
 }
 character ||= defaultCharacter();
 if(!character)return showNotice('当前没有可查看的武将资料，请启用武将包后重新进入。');
 if(get.character(character).isNull)return showNotice('当前未加载武将“'+character+'”的资料，请启用对应武将包后重新进入。');
 notice?.close();
 if(active){active.showCharacter(character,player,requestedPage);return active;}
 const session=new EventTarget();
 let view,pending,disposed=false,finished=false,currentCharacter,currentPage;
 const finish=()=>{if(finished)return;finished=true;if(active===session)active=undefined;session.dispatchEvent(new Event('close'));};
 session.showCharacter=(id,currentPlayer,page)=>{
  if(disposed||get.character(id).isNull)return false;
  if(id===currentCharacter&&page===currentPage&&view?.isConnected)return true;
  pending={id,player:currentPlayer,page};
  if(view?.isConnected)view.close();
  return true;
 };
 session.close=()=>{if(disposed)return;disposed=true;pending=undefined;if(view?.isConnected)view.close();else finish();};
 Object.defineProperty(session,'isConnected',{get:()=>!!view?.isConnected});
 function show(id,currentPlayer,requestedPage) {
  const page=requestedPage||(currentPlayer?lib.config.qhly_doubledefaultpage:lib.config.qhly_listdefaultpage);
  view=game.qhly_open(id,page||'skin',currentPlayer);
  if(!view){finish();throw new Error('千幻页面尚未就绪');}
  const manage=document.createElement('button');manage.className='qhly-manage-entry';manage.textContent='皮肤管理';
  manage.onclick=event=>{event.stopPropagation();openSkinManager(id);};view.append(manage);
  currentCharacter=id; currentPage=requestedPage;
  game.saveConfig('qhly_lastCharacter',id);
  view.addEventListener('close',()=>{
   if(!disposed&&pending){const next=pending;pending=undefined;show(next.id,next.player,next.page);}
   else finish();
  },{once:true});
 }
 active=session;
 try{show(character,player,requestedPage);}catch(error){active=undefined;throw error;}
 return session;
}
