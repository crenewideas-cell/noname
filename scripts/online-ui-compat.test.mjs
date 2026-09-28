import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { prepareOnlineSkinCompatibility } from './online-ui-compat.mjs';

async function fixture(t, exports) {
 const root=await mkdtemp(join(tmpdir(),'noname-ui-compat-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const put=async(path,text)=>{await mkdir(dirname(join(root,path)),{recursive:true});await writeFile(join(root,path),text);};
 await put('client/noname.js',exports);
 await put('apps/core/noname/ui/compactSeats.js','export function installCompactSeatLayout() {}');
 await put('apps/core/layout/default/compact-seats.css','.compact-seats { inset: 0; }');
 for(const provider of ['手杀标准UI/native','十周年局内UI'])await put(`client/ui-skins/${provider}/layout.js`,"import { installCompactSeatLayout, releaseBuiltinAdaptiveLayout } from 'noname'; export { installCompactSeatLayout };");
 return {root,output:join(root,'client'),put};
}
test('published cores without compact seats get the visual helper and its stylesheet, without altering core',async t=>{
 const core='export function releaseBuiltinAdaptiveLayout() {}';
 const {root,output}=await fixture(t,core);
 assert.equal((await prepareOnlineSkinCompatibility(root,output)).adapted,2);
 for(const provider of ['手杀标准UI/native','十周年局内UI'])assert.match(await readFile(join(output,`ui-skins/${provider}/layout.js`),'utf8'),/\/ui-skins\/compat\/noname.js/);
 await access(join(output,'ui-skins/compat/compactSeats.js'));
 assert.match(await readFile(join(output,'ui-skins/compat/noname.js'),'utf8'),/compact-seats.css/);
 assert.equal(await readFile(join(output,'noname.js'),'utf8'),core);
 assert.equal((await prepareOnlineSkinCompatibility(root,output)).adapted,2);
});
test('new cores keep their original layout module and imports',async t=>{
 const {root,output}=await fixture(t,'export function installCompactSeatLayout() {} export function releaseBuiltinAdaptiveLayout() {}');
 assert.equal((await prepareOnlineSkinCompatibility(root,output)).adapted,0);
 assert.match(await readFile(join(output,'ui-skins/手杀标准UI/native/layout.js'),'utf8'),/from 'noname'/);
 await assert.rejects(access(join(output,'ui-skins/compat/noname.js')));
});
test('unknown missing interfaces stop packaging before changing skins',async t=>{
 const {root,output,put}=await fixture(t,'export function releaseBuiltinAdaptiveLayout() {}');
 await put('client/ui-skins/other.js',"import { missingRuleApi as rule } from 'noname';");
 await assert.rejects(prepareOnlineSkinCompatibility(root,output),/missingRuleApi/);
 assert.match(await readFile(join(output,'ui-skins/手杀标准UI/native/layout.js'),'utf8'),/from 'noname'/);
});
