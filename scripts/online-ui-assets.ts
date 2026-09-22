import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,extname,join,resolve} from 'node:path';

const programs:Record<string,Set<string>>={
 '手杀标准UI':new Set(['extension.js','native-runtime.js','boot.html','preview.html',
  'native/boot.js','native/lobby.js','native/layout.js','native/menu.js','native/portrait-clips.js','native/portraits.js','native/resources.js','native/presentation.js','native/animations.js','native/animation-renderer.js','native/login-bridge.js','native/login-backgrounds.js',
  'original/如真似幻/html/rzsh.html','original/如真似幻/js/pixi6.min.js','original/如真似幻/js/gsap.min.js','original/十周年UI/spine.js']),
 '如真似幻':new Set(['extension.js','scenes.js','bridge.js','runtime.js','js/pixi6.min.js','js/gsap.min.js']),
};
const media=new Set(['.json','.css','.png','.jpg','.jpeg','.webp','.gif','.avif','.svg','.atlas','.skel','.mp3','.ogg','.wav','.m4a','.mp4','.webm','.woff','.woff2','.ttf','.otf','.txt','.md']);
/** Package reviewed UI entry points plus data/media, never legacy rule modules. */
export async function copyOnlineSkins(root:string,output:string){
 for(const [name,allowed] of Object.entries(programs)){
  const source=resolve(root,'apps/core/extension/ui',name),target=join(output,'ui-skins',name);
  const inventory:string[]=JSON.parse(await readFile(join(source,'files.json'),'utf8'));
  const files=[...new Set([...inventory,...allowed,'files.json'])].filter(file=>allowed.has(file)||media.has(extname(file).toLowerCase()));
  for(const file of files){
   if(file==='files.json')continue;
   if(file.includes('\\')||file.includes(':')||file.startsWith('/')||file.split('/').some(part=>part==='.'||part==='..'))throw new Error('Invalid UI asset path');
   const destination=join(target,file);await mkdir(dirname(destination),{recursive:true});
   if(['.js','.html','.css','.json'].includes(extname(file))){
    let text=await readFile(join(source,file),'utf8');
    for(const provider of Object.keys(programs))text=text.replaceAll(`extension/${provider}/`,`ui-skins/${provider}/`);
    // Resource-list regex in the migrated lobby uses escaped slash literals.
    text=text.replaceAll('extension\\/如真似幻\\/','ui-skins\\/如真似幻\\/');
    await writeFile(destination,text);
   }else await cp(join(source,file),destination);
  }
  await writeFile(join(target,'files.json'),JSON.stringify(files.sort(),null,2)+'\n');
 }
}
