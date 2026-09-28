import fs from 'node:fs/promises';
const file='apps/core/noname/skin/localDynamic/runtime/composition.js';let s=await fs.readFile(file,'utf8');
const a='    const mainPrefix=prefix&&names.filter(n=>n.startsWith(prefix)).length>=Math.max(5,names.length*.35);';
const b=`    // "lian" also means curtain. A shared export prefix is not evidence
    // that a large drapery mesh is a face; require an anatomical sibling.
    const ambiguousCurtain=prefix&&/[_-]lian(?:[_-]?\\d+)?$/i.test(name)&&!names.some(n=>n.startsWith(prefix)&&/(?:[_-]|^)(?:tou|head|face|yan|eye|mei|nose|bi|kou|mouth|toufa)(?:[_-]?\\d+)?$/i.test(n));
    const mainPrefix=prefix&&!ambiguousCurtain&&names.filter(n=>n.startsWith(prefix)).length>=Math.max(5,names.length*.35);`;
if(!s.includes(a))throw Error('Missing camera edit');s=s.replace(a,b);await fs.writeFile(file+'.r09.tmp',s);await fs.rename(file+'.r09.tmp',file);
