// Presentation adapters call the host engine once, preserving extension card
// metadata, multi-nature cards, skin identities, and current skill semantics.
export function createCompatibility({lib,game,get,files,base,config}) {
 const playerInit=lib.element.player.init;
 const playerReinit=lib.element.player.reinit;
 const playerChooseControl=lib.element.player.chooseControl;
 const cardInit=lib.element.card.init;
 const inventory=new Set(files), pictures=new Map(), failedPictures=new Set();
 const prefix='original/十周年UI/image/';
 const aliases={fire:'huosha',thunder:'leisha',ice:'bingsha',stab:'cisha'};
 function artwork(card) {
  if(config.extension_十周年UI_cardPrettify==='off'||lib.config.hide_card_image)return;
  const info=lib.card[card.name]||{};
  // Explicit extension artwork (including a function, db:, ext: and cardimage)
  // belongs to that extension. Do not hide it behind an unrelated theme image.
  if(info.image||info.cardimage)return;
  const nature=get.natureList(card)[0];
  const name=card.name==='sha'&&aliases[nature]?aliases[nature]:card.name;
  const supplied=lib.decade_extCardImage?.[name];
  if(typeof supplied==='string')return supplied.replace(/^ext:/,'extension/');
  const theme=config.extension_十周年UI_cardHelasisy2||config.extension_十周年UI_cardHelasisy;
  const format=config.extension_十周年UI_cardPrettify||'webp';
  for(const directory of [theme&&`card_${theme}`,'card'].filter(Boolean)) {
   for(const ext of new Set([format,'webp','png','jpg'])) {
    const path=prefix+directory+'/'+name+'.'+ext;
    if(inventory.has(path))return base+path;
   }
  }
 }
 function loadPicture(src) {
  if(pictures.has(src))return pictures.get(src);
  const task=new Promise(resolve=>{
   const image=new Image();image.decoding='async';let done=false;
   const finish=ok=>{if(done)return;done=true;clearTimeout(timer);image.onload=image.onerror=null;if(!ok)failedPictures.add(src);resolve(ok);};
   const timer=setTimeout(()=>finish(false),8000);
   image.onload=()=>finish(true);image.onerror=()=>finish(false);image.src=src;
  });
  pictures.set(src,task);return task;
 }
 function decorate(card) {
  const info=lib.card[card.name]||{};
  const number=get.strNumber(card.number,true)||'',suit=get.translation(card.suit)||'';
  const name=card.node.name.textContent||get.translation(card.name);
  card.dataset.cardName=card.name;
  card.dataset.cardType=info.type||'';
  card.dataset.cardSubype=info.subtype||'';
  card.dataset.cardMultitarget=info.multitarget?'1':'0';
  card.dataset.suit=card.suit||'';
  if(card.$name)card.$name.textContent=name;
  if(card.$suitnum){card.$suitnum.$num.textContent=number;card.$suitnum.$suit.textContent=suit;}
  if(card.$equip){
   // The modern renderer updates name2.innerHTML. Reattach the suit/name spans
   // used by the themed equipment area after that renderer has completed.
   card.$equip.replaceChildren(card.$equip.$suitnum,card.$equip.$name);
   card.$equip.$suitnum.textContent=suit+number;card.$equip.$name.textContent=' '+name;
  }
  const src=artwork(card);
  card.classList.remove('decade-card');
  const revision=card._shoushaArtworkRevision=(card._shoushaArtworkRevision||0)+1;
  if(src&&!failedPictures.has(src)&&!card.classList.contains('infohidden')) {
   const fallback=card.style.backgroundImage;
   card.style.backgroundImage=`url(${JSON.stringify(src)})`;
   card.classList.add('decade-card');
   void loadPicture(src).then(ok=>{
    if(!ok&&revision===card._shoushaArtworkRevision){card.style.backgroundImage=fallback;card.classList.remove('decade-card');}
   });
  }
  return card;
 }
 return {
  playerInit,playerReinit,
  installControls(){
   function chooseControl(...args){
    // Modern cards pass {controls, ai, ...}. Keep that object intact. Only
    // the source UI's explicit newpng calls use its illustrated choice event.
    if(!args.includes('newpng'))return playerChooseControl.apply(this,args);
    let picsrc=base+'original/十周年UI/image/vdcard/',pictype='.png';
    const options=args.filter(arg=>{
     if(arg==='newpng')return false;
     if(arg==='jpg'){pictype='.jpg';return false;}
     if(typeof arg==='string'&&arg.startsWith('src=')){picsrc=arg.slice(4);return false;}
     return true;
    });
    const event=playerChooseControl.apply(this,options);
    event.newpng=true;event.picsrc=picsrc;event.pictype=pictype;
    event.setContent('chooseControlnew');
    return event;
   }
   lib.element.player.chooseControl=chooseControl;
   return()=>{if(lib.element.player.chooseControl===chooseControl)lib.element.player.chooseControl=playerChooseControl;};
  },
  initCard(card,args){cardInit.apply(card,args);return decorate(card);},
  // Load only the active deck's distinct themed faces, sharing requests with
  // card rendering. Never enumerate every image from every installed pack.
  warmCards(){
   const pending=[...new Set((lib.card.list||[]).map(row=>artwork({name:row[2],nature:row[3]})).filter(Boolean))];
   let index=0;
   return Promise.all(Array.from({length:4},async()=>{while(index<pending.length)await loadPicture(pending[index++]);}));
  },
 };
}
