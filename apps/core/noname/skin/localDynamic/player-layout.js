// Resize the existing local player's frame. Height, decorations and controls stay native.
import { registerPortraitFrame } from 'noname';
export function layoutLocalPlayer(player) {
  const save = (node, keys) => keys.map(key => [node, key, node.style.getPropertyValue(key), node.style.getPropertyPriority(key)]);
  const avatars = [player.node.avatar, player.node.avatar2].filter(Boolean);
  const original = [...save(player, ['width', 'height', 'left']), ...avatars.flatMap(node => save(node, ['left', 'width', 'height']))];
  const parent=player.offsetParent, parentRect=parent.getBoundingClientRect();
  const base = {width:player.offsetWidth, height:player.offsetHeight, right:parentRect.right-player.getBoundingClientRect().right};
  const releaseFrame = registerPortraitFrame(player, base);
  const slots = avatars.map(node => ({node, left:node.offsetLeft, width:node.offsetWidth, height:node.offsetHeight}));
  // The core dragon is one transparent image sized at 100% of the player.
  // Keep its native size and right anchor instead of stretching the artwork.
  const fixed = new Map(), savedOrnaments = new Map(), frames = new Set();
  function collectOrnaments() {
    const pending=[...player.children].filter(node=>node.matches('.framebg,.identity,.hp,.count,.ss-rarity-ornament')&&
      (!fixed.has(node)||fixed.get(node).rarity!==node.dataset.rarity));
    if(!pending.length)return;
    // Providers may add or replace a rarity ornament after the model is ready.
    // Measure it against the native frame, never against the already widened one.
    const dimensions=save(player,['width','height']);
    const transition=save(player,['transition']);
    player.style.setProperty('transition','none','important');
    player.style.setProperty('width',base.width+'px','important');player.style.setProperty('height',base.height+'px','important');
    for(const node of pending){
      if(!savedOrnaments.has(node)){const saved=save(node,['width','height','left']);savedOrnaments.set(node,saved);original.push(...saved);}
      restore(savedOrnaments.get(node));
      const css=getComputedStyle(node);
      fixed.set(node,{node,width:css.width,height:css.height,left:node.offsetLeft,rarity:node.dataset.rarity,
        dragon:node.matches('.framebg,.ss-rarity-ornament')});
    }
    restore(dimensions);
    player.getBoundingClientRect();
    restore(transition);
  }
  function restore(values){for(const[node,key,value,priority]of values){if(value)node.style.setProperty(key,value,priority);else node.style.removeProperty(key);}}
  const set = (node, key, value) => {const v=value+'px';if(node.style.getPropertyValue(key)!==v)node.style.setProperty(key,v,'important');};
  function update(aspects) {
    collectOrnaments();
    let extra = 0;
    for (let i=0;i<slots.length;i++) {
      const s=slots[i], width=aspects[i] ? s.height * aspects[i] : s.width;
      set(s.node,'left',s.left+extra);set(s.node,'width',width);set(s.node,'height',s.height);
      extra += width-s.width;
    }
    set(player,'width',base.width+extra);set(player,'height',base.height);
    for(const s of fixed.values()){
      if(s.width!=='auto')s.node.style.setProperty('width',s.width,'important');
      // HP height must still follow the current number of health pips.
      if(!s.node.classList.contains('hp')&&s.height!=='auto')s.node.style.setProperty('height',s.height,'important');
      if(s.dragon)set(s.node,'left',s.left+extra);
    }
    for(const frame of player.querySelectorAll(':scope > .ss-player-frame')){
      // name_new_*.png is 400×536: keep the faction rail and corner artwork at
      // native size while only extending the middle of the existing frame.
      if(!frames.has(frame)){original.push(...save(frame,['background-size','border-style','border-width','border-image-source','border-image-slice','border-image-width','border-image-repeat']));frames.add(frame);}
      Object.assign(frame.style,{backgroundSize:'0 0',borderStyle:'solid',borderWidth:'0',borderImageSource:frame.style.backgroundImage,
        borderImageSlice:'20 20 20 84 fill',borderImageWidth:`${base.height*20/536}px ${base.width*20/400}px ${base.height*20/536}px ${base.width*84/400}px`,borderImageRepeat:'stretch'});
    }
    // Keep the right edge anchored at the original seat, expanding toward the table.
    const parentBox=parent.getBoundingClientRect();
    const scale=(parentBox.width/parent.clientWidth)*(parseFloat(getComputedStyle(player).zoom)||1);
    const left=((parentBox.width-base.right)/scale-base.width-extra)+'px';
    if(player.style.getPropertyValue('left')!==left)player.style.setProperty('left',left,'important');
  }
  return {update, restore(){releaseFrame();restore(original);},base};
}
