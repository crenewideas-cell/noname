import { lib, game, get } from 'noname';

let active;
/** Stable lifecycle handle: the extension owns the page, the lobby owns the session. */
export function openCharacterSkins(character, player) {
 if (!game.qhly_coreReady || !lib.config.extension_千幻聆音_enable) {
  const dialog=document.createElement('dialog');dialog.className='qhly-core-picker';
  const message=document.createElement('p');message.textContent='请在扩展管理中启用「千幻聆音」并重启游戏。';
  const close=document.createElement('button');close.textContent='关闭';close.onclick=()=>dialog.close();
  dialog.append(message,close);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();return dialog;
 }
 if(active)return active;
 const ids=[...new Set([...Object.keys(lib.character),...Object.values(lib.characterPack).flatMap(pack=>Object.keys(pack))])].filter(id=>!get.character(id).isUnseen);
 if(!ids.includes(character))character=ids.includes(lib.config.qhly_lastCharacter)?lib.config.qhly_lastCharacter:ids.includes('caocao')?'caocao':ids[0];
 if(!character)throw new Error('武将资料尚未加载');
 const session=new EventTarget();
 let view,picker,pending,disposed=false;
 const finish=()=>{if(active===session)active=undefined;session.dispatchEvent(new Event('close'));};
 session.close=()=>{disposed=true;pending=undefined;picker?.close();if(view?.isConnected)view.close();else finish();};
 Object.defineProperty(session,'isConnected',{get:()=>!!view?.isConnected});
 function show(id,currentPlayer) {
  view=game.qhly_open_new(id,'skin',currentPlayer);
  if(!view){finish();throw new Error('千幻页面尚未就绪');}
  game.saveConfig('qhly_lastCharacter',id);
  view.addEventListener('close',()=>{picker?.close();if(!disposed&&pending){const next=pending;pending=undefined;show(next);}else finish();},{once:true});
  const choose=document.createElement('button');choose.className='qhly-core-choose';choose.textContent='选择武将';
  choose.onclick=()=>{
   picker=document.createElement('dialog');picker.className='qhly-core-picker';
   const input=document.createElement('input');input.placeholder='搜索武将名称或编号';input.setAttribute('aria-label',input.placeholder);
   const list=document.createElement('div');list.className='qhly-core-results';
   const render=()=>{list.replaceChildren();const query=input.value.toLowerCase();for(const name of ids.filter(name=>(name+get.translation(name)).toLowerCase().includes(query)).slice(0,100)){
    const button=document.createElement('button');button.textContent=get.translation(name);button.title=name;
    button.onclick=()=>{picker.close();pending=name;view.close();};list.append(button);
   }};
   input.oninput=render;const back=document.createElement('button');back.textContent='返回';back.onclick=()=>picker.close();picker.append(input,list,back);
   document.body.append(picker);const current=picker;picker.addEventListener('close',()=>current.remove(),{once:true});render();picker.showModal();
  };
  view.append(choose);
 }
 active=session;
 try{show(character,player);}catch(error){active=undefined;throw error;}
 return session;
}
