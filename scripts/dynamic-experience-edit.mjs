import fs from 'node:fs/promises';
const root='apps/core/noname/skin/localDynamic/';
async function edit(file,changes){let s=(await fs.readFile(file,'utf8')).replaceAll('\r\n','\n');for(let [a,b]of changes){a=a.replaceAll('\r\n','\n');if(!s.includes(a))throw Error('Missing edit: '+file+' '+a.slice(0,100));s=s.replace(a,b);}await fs.writeFile(file+'.r09.tmp',s);await fs.rename(file+'.r09.tmp',file);}
if(!(await fs.readFile(root+'runtime/player.js','utf8')).includes('let capabilities='))await edit(root+'runtime/player.js',[
 [' function info(){',' let capabilities={events:{},interaction:{available:false,motions:[]}};\n function info(){'],
 ['parameters,layers,hits,expressions,voices:','parameters,layers,hits,expressions,...capabilities,voices:'],
 ["const list=entry.motions.filter(n=>!model?n!==entry.idle:/^(touch|tap|click)(_|$)/i.test(n));","const list=model?entry.motions.filter(n=>/^(touch|tap|click)(_|$)/i.test(n)):capabilities.interaction.motions;"],
 ["  checkAlive();setPhase('composed');","  const {primaryCapabilities}=await import('./motion-catalog.js');\n  capabilities=primaryCapabilities(entry,model?[]:(engine42?.layers||root.children).map((l,i)=>({role:sourceScene?.layers[i]?.role,motions:l.names||l.skinAnimations,idle:l.idle||l.skinIdle})),!!model);\n  checkAlive();setPhase('composed');"],
]);
await edit(root+'bridge.js',[
 ["'.local-dynamic-visible,:has(>.local-dynamic-preview){background-image:none!important}","'.local-dynamic-visible{background-image:none!important}.local-dynamic-loading{position:absolute;left:50%;bottom:12%;transform:translateX(-50%);padding:5px 12px;border-radius:8px;background:#211a18b8;color:#eadcb8;font-size:14px;white-space:nowrap;pointer-events:none}"],
 ["    // Suppress the old portrait immediately, including the loading interval.\r\n    portrait.classList.add('local-dynamic-visible');", "    // Keep a real portrait until the composed first frame is ready.\n    portrait.classList.remove('local-dynamic-visible');"],
 ["    const h={p,e,portrait,name,player,node};","    const h={p,e,portrait,name,player,node};\n    if(animated){\n      hub.loadThumbnail.preview(p,e,node);\n      h.loading=document.createElement('span');h.loading.className='local-dynamic-loading';h.loading.textContent='动态加载中…';node.append(h.loading);\n    }"],
 ["function dispose(h){if(h){h.effectHost", "function dispose(h){if(h){hub.loadThumbnail.cancel(h.node);h.cleanupInput?.();h.effectHost"],
 ["h.node.style.backgroundImage='none';h.portrait.classList.add('local-dynamic-visible');h.frame.dataset.ready='true';", "hub.loadThumbnail.cancel(h.node);h.loading?.remove();h.node.style.backgroundImage='none';h.portrait.classList.add('local-dynamic-visible');h.frame.dataset.ready='true';\n        h.capabilities=event.data.info;"],
 ["h.events=eventMotions(h.e,event.data.info?.motions);", "h.events=event.data.info?.events||eventMotions(h.e,event.data.info?.motions);\n        hub.loadThumbnail.publish(h.p,h.e,h.frame.contentWindow.skinPlayer);"],
 ["if(h.pendingEvent){const kind=h.pendingEvent;delete h.pendingEvent;playHostEvent(h,kind);}","playHostEvent(h,'enter');\n        if(h.pendingEvent&&h.pendingEvent!=='enter'){const kind=h.pendingEvent;delete h.pendingEvent;playHostEvent(h,kind);}else delete h.pendingEvent;"],
]);
await edit('apps/core/extension/ui/千幻聆音/theme/shousha/code/shousha.js',[
 ["interactionButton.disabled = !ready;\r\n          interactionButton.hidden = !ready;","const capable = !!host?.capabilities?.interaction?.available;\n          interactionButton.disabled = !ready || !capable;\n          interactionButton.hidden = !ready || !capable;"],
]);
console.log('Applied loading, primary capabilities and entrance edits.');
