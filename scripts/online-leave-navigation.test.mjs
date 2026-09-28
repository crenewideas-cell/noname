import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile('apps/core/noname/online/game.js','utf8');
function fixture(fail=false){
 const log=[],storage=new Map([['noname_online_game','assignment']]);
 const state={account:{id:'guest'},status:'connected',room:{id:'room',modeId:'identity'}};
 const context=vm.createContext({onlineState:state,command:async(type,payload)=>{log.push(type);if(fail)throw new Error('request lost');state.room=null;},restoreAccount:async()=>{},prepareRoomNavigation:async()=>log.push('navigate'),
  game:{promises:{saveConfig:async()=>{}},reload:()=>log.push('reload')},lib:{configprefix:'test_'},console,window:{},clearInterval:()=>{},
  sessionStorage:{removeItem:k=>storage.delete(k),setItem:(k,v)=>storage.set(k,v)},localStorage:{removeItem:()=>{}},disconnectPlatform:()=>log.push('disconnect')});
 const code=source.slice(source.indexOf('let statusPanel;'),source.indexOf('export async function startManagedGame')).replaceAll('export async function','async function');
 const returnTo=vm.runInContext(code+'\nreturnToOnlineLobby',context);return{log,storage,returnTo};
}
test('explicit exit waits for room.leave acknowledgement before reload',async()=>{
 const f=fixture();await f.returnTo(true);assert.deepEqual(f.log,['room.leave','disconnect','reload']);assert(!f.storage.has('noname_online_game'));
});
test('lost leave request cannot present false success or erase retry context',async()=>{
 const f=fixture(true);await assert.rejects(f.returnTo(true),/request lost/);assert.deepEqual(f.log,['room.leave']);assert(f.storage.has('noname_online_game'));
});
test('settlement return retains room using navigation lease instead of explicit exit',async()=>{
 const f=fixture();await f.returnTo(false);assert.deepEqual(f.log,['navigate','disconnect','reload']);
});
