import {lib,game} from 'noname';
import {directories} from './filesystem.js';

/** Original editors use callbacks; the current core owns the platform adapter. */
export function connectFileIO() {
 game.qhly_readFileAsText=(path,callback)=>{
  let settled=false;const done=(ok,text)=>{if(settled)return;settled=true;clearTimeout(timer);callback?.(ok,text);};
  const timer=setTimeout(()=>done(false),10000);
  const fallback=()=>fetch(lib.assetURL+path).then(r=>{if(!r.ok)throw Error('无法读取 '+path);return r.text();}).then(text=>done(true,text),()=>done(false));
  try{game.readFileAsText(path,text=>done(true,text),fallback);}catch{fallback();}
 };
 const write=(data,path,name,callback)=>{
  let settled=false;const done=error=>{if(settled)return;settled=true;clearTimeout(timer);if(!error){const dir=path.replace(/\/$/,'');directories[dir] ||= {folders:[],files:[]};if(!directories[dir].files.includes(name))directories[dir].files.push(name);}callback?.(error ? {message:error.message||String(error)} : false);};
  const timer=setTimeout(()=>done(Error('写入超时，请检查文件服务或存储权限')),15000);
  try{game.writeFile(data,path,name,done);}catch(error){done(error);}
 };
 game.qhly_writeTextFile=(text,path,name,callback)=>write(text,path,name,callback);
 game.qhly_writeImageFile=(blob,path,name,callback)=>write(blob,path,name,callback);
}
