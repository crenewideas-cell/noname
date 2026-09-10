import fs from 'node:fs';
const config=JSON.parse(fs.readFileSync('apps/core/game/config.json','utf8'));
const entries=config.moderned_characters.map((name:string)=>{const base=`character/${name}/index`;return '/'+base+(fs.existsSync('apps/core/'+base+'.ts')?'.ts':'.js');});
const cardEntries=fs.readdirSync('apps/core/card').filter(name=>name.endsWith('.js')).map(name=>'/card/'+name);
fs.mkdirSync('apps/core/output',{recursive:true});
fs.writeFileSync('apps/core/output/branch-check.html',`<!doctype html><meta charset="utf-8"><title>分支武将加载验证</title><h1>分支武将加载验证</h1><pre id="result">正在运行实际引擎注册与技能编译检查…</pre><script type="module">
import {lib,game,ui,get,ai,_status} from '/noname.js';
import config from '/game/config.json';
import '/noname/init/polyfill.ts';
import {loadCharacter,loadExtension,loadCard} from '/noname/init/loading.ts';
import compiler from '/noname/library/element/gameEvent/compilers/ContentCompiler.ts';
import {security,initializeSandboxRealms} from '/noname/util/sandbox.ts';
import create from '/extension/分支武将/extension.js';
const output=document.querySelector('#result');
try {
 lib.config={...config,characters:[...config.characters,'分支武将'],mode:'identity',ignore_error:false};
 lib.get=get;lib.game=game;lib.ui=ui;lib.ai=ai;lib.connectCharacterPack=[];
 await initializeSandboxRealms(true);await security.initSecurity({lib,game,ui,get,ai,_status});
 for(const file of ${JSON.stringify(entries)}){const module=await import(file);if(module.default)await game.import(module.type||'character',module.default);}
 for(const pack of Object.values(lib.imported.character))loadCharacter(pack);
 for(const file of ${JSON.stringify(cardEntries)}){const module=await import(file);if(module.default)await game.import(module.type||'card',module.default);}
 lib.connectCardPack=[];
 for(const pack of Object.values(lib.imported.card))loadCard(pack);
 const oldCharacters={...lib.character},oldSkills={...lib.skill},oldTranslations={...lib.translate};
 const extension=create(lib,game,ui,get,ai,_status);
 lib.config['@Experimental.extension.分支武将.character']=true;
 lib.config['@Experimental.extension.分支武将.card']=true;
 await loadExtension(['分支武将',extension.content,{},false,extension.package]);
 const changed=[];
 for(const [field,before]of [['character',oldCharacters],['skill',oldSkills],['translate',oldTranslations]])for(const [id,value]of Object.entries(before))if(lib[field][id]!==value)changed.push(field+'/'+id);
 const errors=[];let compiled=0;
 function inspect(id,skill){for(const field of ['content','precontent','cost'])if(typeof skill[field]==='function'){try{compiler.compile(skill[field]);compiled++;}catch(error){errors.push({id,field,error:String(error)});}}for(const [sub,info]of Object.entries(skill.subSkill||{}))inspect(id+'_'+sub,info);}
 for(const [id,skill]of Object.entries(extension.package.skill.skill))inspect(id,skill);
 const audit=lib.branchCharacterAudit;
 const result={registered:Object.keys(lib.characterPack['分支武将']||{}).length,skills:Object.keys(extension.package.skill.skill).length,compiled,compileErrors:errors,changedOriginals:changed,missing:audit.missing,missingPortraits:Object.entries(audit.characters).filter(([id,r])=>!r.portrait).map(([id])=>id),ordinarySelectable:Object.keys(audit.characters).filter(id=>lib.characterFilter[id]()).length};
 output.textContent=JSON.stringify(result,null,2);
 document.title=result.registered===855&&!errors.length&&!changed.length?'通过：分支武将加载验证':'待修复：分支武将加载验证';
}catch(error){output.textContent=error.stack;document.title='失败：分支武将加载验证';}
</script>`);
