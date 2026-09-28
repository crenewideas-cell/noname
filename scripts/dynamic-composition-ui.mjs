import fs from 'node:fs/promises';
// Reuse the actual Qianhuan UI harness, changing only case data/evidence paths.
let source=await fs.readFile(new URL('./dynamic-shared-ui-browser.mjs',import.meta.url),'utf8');
const original="[['shen_xunyu','base_38c67eef25ea1c12','匡汉延祚'],['shen_xunyu','base_aada6c1f8c328f4b','为汉建安'],['db_wenyang','base_2ffdbe289f05a565','破云翔宇2'],['db_wenyang','base_548a5def3d1b73f9','云涯文鸯']]";
const ids=JSON.parse(await fs.readFile('output/dynamic-remediation/20260926-r01/composition-r08/ids.json'));
const cases=await Promise.all(ids.map(async id=>{const e=JSON.parse(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/entries/'+id+'.json'));return[e.characterIds[0],id,e.title];}));
if(!source.includes(original))throw Error('UI harness changed');
source=source.replace(original,JSON.stringify(cases)).replaceAll('shared-runtime-r07','composition-r08').replaceAll('http://127.0.0.1:8184','http://127.0.0.1:8081').replace("root+'/isolated-profile'","root+'/isolated-profile-'+phase");
const file=new URL('../output/dynamic-remediation/20260926-r01/composition-r08/ui-harness.mjs',import.meta.url);await fs.writeFile(file,source);await import(file.href+'?run='+Date.now());
