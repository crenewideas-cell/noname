import fs from 'node:fs/promises';
const file='apps/core/noname/skin/localDynamic/bridge.js';let s=await fs.readFile(file,'utf8');
s=s.replace("const interactive=p=>lib.config['extension_'+p.name+'_interaction']===true;", "const interactive=p=>lib.config['extension_'+p.name+'_interaction']!==false;");
s=s.replace("const enabled=((manual===undefined?interactive(h.p):manual==='true')||h.portrait.closest('.qh-interaction'))&&!blocked(h);", "const enabled=((manual===undefined?false:manual==='true')||h.portrait.closest('.qh-interaction'))&&!blocked(h);\n    h.tapEnabled=!!(h.player&&interactive(h.p)&&h.capabilities?.interaction?.available&&!blocked(h));");
s=s.replace("(player||portrait).append(node);updateInput(h);return h;", `(player||portrait).append(node);
    if(player){
      const tap=event=>{
        if(!h.tapEnabled||blocked(h)||event.button!==0||event.defaultPrevented||event.target.closest('.card,.button'))return;
        const r=h.node.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)return;
        const choices=h.capabilities.interaction.motions,command=choices[(h.tapIndex||0)%choices.length];h.tapIndex=(h.tapIndex||0)+1;
        message(h.frame,'motion',{motion:command});
      };
      player.addEventListener('click',tap);h.cleanupInput=()=>player.removeEventListener('click',tap);
    }
    updateInput(h);return h;`);
s=s.replace("const motion=h.events?.[kind];if(!motion)return;", "const motion=h.events?.[kind];if(!motion)return;\n    if(kind==='enter'){if(h.entered)return;h.entered=true;}");
await fs.writeFile(file+'.r09.tmp',s);await fs.rename(file+'.r09.tmp',file);
