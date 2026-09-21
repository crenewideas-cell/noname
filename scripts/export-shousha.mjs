// Package the private UI provider. No test, browser or import round trip is run.
import fs from 'node:fs';
import path from 'node:path';
import {ZipFile} from 'yazl';
import {pipeline} from 'node:stream/promises';
const base=path.resolve('apps/core/extension/ui/手杀标准UI');
const files=JSON.parse(fs.readFileSync(path.join(base,'files.json'),'utf8'));
const destination=path.resolve('dist/ui/手杀标准UI-UI套装.zip');
fs.mkdirSync(path.dirname(destination),{recursive:true});
const zip=new ZipFile();
const writing=pipeline(zip.outputStream,fs.createWriteStream(destination+'.partial'));
let bytes=0;
for(const file of [...new Set([...files,'files.json'])]){
 const source=path.resolve(base,file);
 if(!source.startsWith(base+path.sep))throw new Error('Invalid provider resource path');
 bytes+=fs.statSync(source).size;zip.addFile(source,file,{compress:false});
}
zip.addBuffer(Buffer.from('手杀标准UI：完整界面和内部依赖的独立套装。通过 UI 工坊应用。内部依赖不会注册为独立扩展；联机房间沿用宿主项目。详见 MIGRATION.md。'),'README.txt',{compress:false});
zip.end();await writing;fs.renameSync(destination+'.partial',destination);
console.log(JSON.stringify({destination,files:files.length,sourceBytes:bytes,archiveBytes:fs.statSync(destination).size},null,2));
