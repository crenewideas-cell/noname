import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
// Move only files added by this import out of retired extension directories.
// Tracked files are immutable; every resolved source and destination is checked.
const root=path.resolve('apps/core/extension');
const tracked=new Set(execFileSync('git',['ls-files','-z','--','apps/core/extension'],{encoding:'utf8',maxBuffer:32*1024*1024}).split('\0'));
const started=fs.statSync('scripts/auditBranchCharacters.ts').birthtimeMs;
function check(p:string){const rel=path.relative(root,path.resolve(p));if(rel.startsWith('..')||path.isAbsolute(rel))throw Error(p);}
let moved=0;
function walk(dir:string){
 check(dir);
 for(const d of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,d.name);
  if(d.isDirectory()){walk(p);if(fs.readdirSync(p).length===0){check(p);fs.rmdirSync(p);}}
  else if(fs.statSync(p).birthtimeMs>=started && !tracked.has(path.relative(process.cwd(),p).replaceAll('\\','/'))){
   const dest=path.join(root,'分支武将/assets/extension',path.relative(root,p));check(p);check(dest);
   fs.mkdirSync(path.dirname(dest),{recursive:true});
   if(fs.existsSync(dest)){if(!fs.readFileSync(p).equals(fs.readFileSync(dest)))throw Error('Conflicting destination: '+dest);fs.unlinkSync(p);}
   else fs.renameSync(p,dest);
   moved++;
  }
 }
}
function restore(dir:string){
 if(!fs.existsSync(dir))return;
 for(const d of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,d.name);if(d.isDirectory())restore(p);
  else if(fs.statSync(p).birthtimeMs<started){
   const dest=path.join(root,path.relative(path.join(root,'分支武将/assets/extension'),p));check(p);check(dest);
   if(fs.existsSync(dest))throw Error('Original already exists: '+dest);
   fs.mkdirSync(path.dirname(dest),{recursive:true});fs.renameSync(p,dest);
  }
 }
}
restore(path.join(root,'分支武将/assets/extension'));
for(const name of ['假装无敌','太虚幻境','EpicFX','Thunder']){const dir=path.join(root,name);if(fs.existsSync(dir)){walk(dir);if(fs.readdirSync(dir).length===0){check(dir);fs.rmdirSync(dir);}}}
console.log({moved});
