import fs from 'node:fs/promises';
let source=await fs.readFile('scripts/dynamic-remediation-spine38-reference.mjs','utf8');
source=source.replace('const e=inventory.entries.find(e=>e.id===id);',"const e=structuredClone(inventory.entries.find(e=>e.id===id));if(e)e.sourceConfigs=e.sourceConfigs.map(r=>({...r,config:{...r.config,beijing:undefined,angle:0}}));");
await fs.writeFile('scripts/dynamic-experience-reference.mjs',source);
await import('./dynamic-experience-reference.mjs');
