import fs from 'node:fs/promises';
async function edit(file,changes){let s=(await fs.readFile(file,'utf8')).replaceAll('\r\n','\n');for(const [a,b]of changes){if(!s.includes(a))throw Error('Missing: '+a);s=s.replace(a,b);}await fs.writeFile(file+'.r09.tmp',s);await fs.rename(file+'.r09.tmp',file);}
const root='apps/core/noname/skin/localDynamic/';
await edit(root+'runtime/player.js',[
 [' let capabilities=', ' let screenActions;\n let capabilities='],
 ["  if(effectHost&&sourceActions&&name.startsWith('source:')){\n   const i=sourceScene.layers.findIndex(l=>l.role==='primary'),l=engine42?.layers[i]||root.children[i];\n   const action=resolveScreenAction(sourceActions.sourceAction(sourceScene,name,l.skeleton.data.animations),entry.models);", "  const actionScene=entry.actionScene||sourceScene,actionAPI=entry.actionScene?screenActions:sourceActions;\n  if(effectHost&&actionAPI&&name.startsWith('source:')){\n   const i=actionScene.layers.findIndex(l=>l.role==='primary'),l=engine42?.layers[i]||root.children[i];\n   const action=resolveScreenAction(actionAPI.sourceAction(actionScene,name,l.skeleton.data.animations),entry.models);"],
 ['t.timeScale=sourceScene.layers[i].playback.speed;}', 't.timeScale=actionScene.layers[i].playback.speed;}'],
 ["  const {idleAnimation}=await import('./composition.js');", "  if(entry.actionScene&&effectHost){screenActions=await import('./source-actions.js');resolveScreenAction=(await import('./effect-layout.js')).screenAction;}\n  const {idleAnimation}=await import('./composition.js');"],
 ["  const {primaryCapabilities}=await import('./motion-catalog.js');", "  if(screenActions)entry.motions=[...new Set([...entry.motions,...entry.actionScene.actionContract.records.map(a=>a.command)])];\n  const {primaryCapabilities}=await import('./motion-catalog.js');"],
]);
await edit(root+'runtime/motion-catalog.js',[["entry.scene?.actionContract?.records", "(entry.actionScene||entry.scene)?.actionContract?.records"]]);
// Re-indexing the unchanged source retains verified action resource metadata.
// A changed source deliberately requires revalidation before carrying it over.
await edit('scripts/index-dynamic-skins.mjs',[
 ["      await write(path.join(directory, summary.detail), { ...entry, skinTitle, ...(sceneModels?{models:sceneModels}:{}) });", "      const detail=path.join(directory,summary.detail);\n      let actionScene=entry.actionScene;\n      if(!actionScene)try{const previous=await read(detail);if(JSON.stringify(previous.legacy)===JSON.stringify(entry.legacy))actionScene=previous.actionScene;}catch(error){if(error.code!=='ENOENT')throw error;}\n      await write(detail, { ...entry, skinTitle, ...(sceneModels?{models:sceneModels}:{}), ...(actionScene?{actionScene}:{}) });"],
]);
