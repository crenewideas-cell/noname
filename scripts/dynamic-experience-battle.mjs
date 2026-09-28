import fs from 'node:fs/promises';
let s=await fs.readFile('scripts/dynamic-experience-game.mjs','utf8');
s=s.replaceAll("'ganfuren'","'sunshangxiang'");
s=s.replace("s=s.replace(\"await page.evaluate(()=>__env.game.resume2());await save();\"", "s=s.replace(\"const e=skins.find(e=>e.characterIds.includes(name)\",\"const e=skins.find(e=>(name!=='sunshangxiang'||e.id==='base_dd28794bc31102d4')&&e.characterIds.includes(name)\");\ns=s.replace(\"await page.evaluate(()=>__env.game.resume2());await save();\"");
s=s.replace("process.env.SKIN_GAME_LABEL||'experience-r09/game-standard'", "process.env.SKIN_GAME_LABEL||'experience-r09/game-actions'");
s=s.replace("game-fixed-harness.mjs", "game-actions-harness.mjs");
const file='scripts/dynamic-experience-battle-harness.mjs';await fs.writeFile(file,s);await import('./dynamic-experience-battle-harness.mjs');
