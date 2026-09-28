// Retain existing character and set IDs; migrate only resource locations and labels.
const root='extension/键社/image/skin-sets/';
export function keySkinPath(value){
 return typeof value==='string'?value.replace(/^image\/skin-sets\/key\//,root+'new/'):value;
}
export function migrateKeySkinManagement(previous){
 const state=structuredClone(previous);
 const entry=(value,id)=>{
  if(!value||typeof value!=='object')return;
  value.path=keySkinPath(value.path);
  if(value.set==='key-original'&&/^key_/.test(id)&&/^image\/character\/key_.*\.jpg$/.test(value.path||''))value.path=root+'original/'+id+'.jpg';
  for(const [form,path] of Object.entries(value.variants||{})){
   value.variants[form]=value.set==='key-original'&&/^key_/.test(form)&&/^image\/character\/key_.*\.jpg$/.test(path)?root+'original/'+form+'.jpg':keySkinPath(path);
  }
 };
 for(const [id,value] of Object.entries(state.selections||{}))entry(value,id);
 for(const [id,value] of Object.entries(state.defaults||{}))entry(value,id);
 for(const preset of state.presets||[]){
  if(preset.pack==='二次元')preset.pack='键社';
  if(typeof preset.name==='string')preset.name=preset.name.replace(/^二次元(?= · )/,'键社');
  for(const [id,value] of Object.entries(preset.entries||{}))entry(value,id);
 }
 for(const [id,hidden] of Object.entries(state.hidden||{})){
  const next={};for(const [path,disabled] of Object.entries(hidden))next[keySkinPath(path)]=next[keySkinPath(path)]||disabled;
  state.hidden[id]=next;
 }
 state.keyResourceLayout=2;return state;
}
