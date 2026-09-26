import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

async function fixture({characters={caocao:{},xiaoqiao:{}},packs={},last='hlhj_daiyu'}={}) {
 class Node extends EventTarget {
  constructor(tag){super();this.tag=tag;this.children=[];this.isConnected=false;}
  append(...nodes){for(const n of nodes){n.parent=this;n.isConnected=true;this.children.push(n);}}
  querySelector(tag){return this.children.find(n=>n.tag===tag);}
  showModal(){this.open=true;}
  close(){if(!this.isConnected)return;this.open=false;this.dispatchEvent(new Event('close'));}
  remove(){this.isConnected=false;if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 }
 const document={createElement:tag=>new Node(tag),body:new Node('body')},opened=[],saved=[];
 const lib={config:{extension_千幻聆音_enable:true,qhly_lastCharacter:last},character:characters,characterPack:packs};
 const get={character(id){return characters[id]||Object.values(packs).find(p=>p[id])?.[id]||{isNull:true};}};
 const game={qhly_coreReady:true,qhly_open(id,page,player){const view=new Node('view');document.body.append(view);view.addEventListener('close',()=>view.remove());opened.push({id,page,player,view});return view;},saveConfig(k,v){saved.push([k,v]);lib.config[k]=v;}};
 const context=vm.createContext({Event,EventTarget,document});
 const noname=new vm.SyntheticModule(['lib','game','get','ui','_status'],function(){for(const[k,v]of Object.entries({lib,game,get,ui:{},_status:{}}))this.setExport(k,v);},{context});
 const module=new vm.SourceTextModule(await fs.readFile('apps/core/noname/skin/qianhuan/index.js','utf8'),{context});
 await module.link(()=>noname);await module.evaluate();
 return {open:module.namespace.openCharacterSkins,lib,opened,saved,document};
}
test('stale last character falls back to loaded Cao Cao and repairs history after opening',async()=>{
 const f=await fixture();const session=f.open(undefined,undefined,'skin');
 assert.equal(f.opened[0].id,'caocao');assert.equal(f.opened[0].page,'skin');
 assert.equal(f.lib.config.qhly_lastCharacter,'caocao');assert.equal(session.isConnected,true);
 session.close();assert.equal(session.isConnected,false);
 f.open();assert.equal(f.opened.length,2);
});
test('a valid remembered or explicitly selected character is never substituted',async()=>{
 const f=await fixture({characters:{caocao:{},hlhj_daiyu:{}},last:'hlhj_daiyu'});
 const session=f.open();assert.equal(f.opened[0].id,'hlhj_daiyu');
 const player={name:'caocao'};assert.equal(f.open('caocao',player,'skill'),session);
 assert.equal(f.opened[1].id,'caocao');assert.equal(f.opened[1].player,player);assert.equal(f.opened[1].page,'skill');
});
test('missing default character resolves another loaded public pack entry, skipping hidden entries',async()=>{
 const f=await fixture({characters:{hidden:{isUnseen:true}},packs:{extra:{xiaoqiao:{}}}});
 f.open();assert.equal(f.opened[0].id,'xiaoqiao');
});
test('an explicitly missing character yields one closable notice without changing history or session',async()=>{
 const f=await fixture();const session=f.open('caocao');const count=f.saved.length;
 const notice=f.open('hlhj_daiyu');assert.match(notice.querySelector('p').textContent,/hlhj_daiyu/);
 assert.equal(f.open('hlhj_daiyu'),notice);assert.equal(f.opened.length,1);assert.equal(f.saved.length,count);assert.equal(session.isConnected,true);
 notice.close();assert.equal(notice.isConnected,false);
 f.open('xiaoqiao');assert.equal(f.opened.at(-1).id,'xiaoqiao');
});
test('an empty catalog is nonfatal and can be retried when metadata becomes available',async()=>{
 const f=await fixture({characters:{}});const notice=f.open();assert.equal(f.opened.length,0);assert.equal(f.saved.length,0);
 assert.match(notice.querySelector('p').textContent,/没有可查看/);
 f.lib.character.caocao={};f.open();assert.equal(notice.isConnected,false);assert.equal(f.opened[0].id,'caocao');
});
test('disabled Qianhuan keeps the existing enable-extension notice',async()=>{
 const f=await fixture();f.lib.config.extension_千幻聆音_enable=false;
 assert.match(f.open().querySelector('p').textContent,/启用「千幻聆音」/);assert.equal(f.opened.length,0);
});
