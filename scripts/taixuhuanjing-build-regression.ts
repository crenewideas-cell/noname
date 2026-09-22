import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import preserveLegacySteps from '../apps/core/scripts/vite-plugin-legacy-steps.ts';

const requireCore=createRequire(path.resolve('apps/core/package.json'));
const {build}=await import(pathToFileURL(requireCore.resolve('vite')).href);
const {viteStaticCopy}=await import(pathToFileURL(requireCore.resolve('vite-plugin-static-copy')).href);
const outDir=path.resolve('output/taixuhuanjing-validation/build');
await build({configFile:false,root:path.resolve('apps/core'),base:'./',logLevel:'warn',
 plugins:[preserveLegacySteps(),viteStaticCopy({targets:[{src:'mode/taixuhuanjing/assets',dest:'taixuhuanjing'}]})],build:{outDir,emptyOutDir:false,minify:false,target:'chrome91',
 rollupOptions:{input:{taixuhuanjing:path.resolve('apps/core/mode/taixuhuanjing.js')},external:['noname'],treeshake:false,preserveEntrySignatures:'strict',
 output:{entryFileNames:'[name].js',chunkFileNames:'[name].js'}}}});
const code=await fs.readFile(path.join(outDir,'taixuhuanjing.js'),'utf8');
assert.match(code,/taixuhuanjing/);
assert.match(code,/export\s*\{[^}]*default[^}]*type\s*\}/);
assert.doesNotMatch(code,/[\\/]temp[\\/]|extension\/(?:太虚幻境|手杀标准UI)/);
assert.ok(await fs.stat(path.join(outDir,'spine.js')));
const assets=JSON.parse(await fs.readFile(path.join(outDir,'taixuhuanjing/assets/files.json'),'utf8'));
for(const asset of assets)assert.ok((await fs.stat(path.join(outDir,'taixuhuanjing/assets',asset))).isFile(),asset);
console.log('Standalone mode build passed; core rules and lazy drawing modules are bundled without reference-tree dependencies.');
