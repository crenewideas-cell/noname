// Explicit media import from the supplied 琉璃版 distribution. Never executes it.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const sourceArg=process.argv.find(arg=>arg.startsWith('--source='))?.slice(9);
if(!sourceArg)throw new Error('Use --source=<resources/app/extension/十周年UI>');
const source=path.resolve(sourceArg),target=path.resolve('apps/core/extension/ui/十周年局内UI');
const records=[];
function writeChanged(file,data){
 const bytes=Buffer.isBuffer(data)?data:Buffer.from(data);
 if(fs.existsSync(file)&&bytes.equals(fs.readFileSync(file)))return;
 const fd=fs.openSync(file,fs.existsSync(file)?'r+':'w');
 try{fs.writeFileSync(fd,bytes);fs.ftruncateSync(fd,bytes.length);}finally{fs.closeSync(fd);}
}
function copy(relative,destination){
 const data=fs.readFileSync(path.join(source,relative)),out=path.join(target,destination);
 fs.mkdirSync(path.dirname(out),{recursive:true});
 writeChanged(out,data);
 records.push({source:relative,file:destination,sha256:crypto.createHash('sha256').update(data).digest('hex')});
}
// The reference's new card style uses the HD illustrations, under a separate
// gold frame. Keep these separate from the older gold card-skin collection.
for(const file of fs.readdirSync(path.join(source,'image/card')))if(file.endsWith('.jpg'))copy('image/card/'+file,'assets/cards/decade/'+file);
const effects=['effect_youxikaishi_SZN','SZN_nanmanruqin','SZN_taoyuanjieyi','SZN_jiuwo','SZN_loseHp','SZN_lebusishu','SZN_bingliangcunduan','jiubuff','aar_chupaizhishiX','baikuang','effect_jineng_SZN','SLwei','SLshu','SLwu','SLjin','SLqun','SS_zhuanhuanji'];
for(const name of effects){
 for(const suffix of ['skel','atlas'])copy('assets/animation/'+name+'.'+suffix,'assets/animation/'+name+'.'+suffix);
 const atlas=fs.readFileSync(path.join(source,'assets/animation/'+name+'.atlas'),'utf8');
 for(const page of new Set(atlas.split(/\r?\n/).filter(line=>/\.(png|jpe?g)$/.test(line.trim())).map(line=>line.trim())))copy('assets/animation/'+page,'assets/animation/'+page);
}
copy('audio/SZN_loseHp.mp3','assets/audio/SZN_loseHp.mp3');
for(const sound of ['nanmanruqin','wanjianqifa'])copy('audio/'+sound+'.mp3','assets/audio/'+sound+'.mp3');
writeChanged(path.join(target,'reference-details.json'),JSON.stringify({source:'三国杀·琉璃版5.5/十周年UI',cards:'image/card/*.jpg (高清卡牌)',effects:'animation.js; splash.js; effect.js',resources:records},null,2)+'\n');
const inventory=new Set(JSON.parse(fs.readFileSync(path.join(target,'files.json'),'utf8')));
for(const {file}of records)inventory.add(file);
inventory.add('reference-details.json');
inventory.add('indicators.js');
writeChanged(path.join(target,'files.json'),JSON.stringify([...inventory].sort(),null,2)+'\n');
console.log('Imported reference resources: '+records.length);
