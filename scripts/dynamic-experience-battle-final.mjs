import fs from 'node:fs/promises';
let s=await fs.readFile('output/dynamic-remediation/20260926-r01/experience-r09/game-actions-harness.mjs','utf8');
s=s.replace("if(state.over){report.rounds.at(-1).finishedAt=new Date().toISOString();await beginRound();}","if(state.over){report.rounds.at(-1).finishedAt=new Date().toISOString();report.endedNaturally=true;break;}");
s=s.replace("report.elapsedSeconds=(Date.now()-start)/1000;", "report.elapsedSeconds=(Date.now()-start)/1000;assert.ok(report.skinEvents.some(e=>e.type==='noname-skin-motion'&&e.motion==='source:gongji'),'Actual player card use must reach the installed action renderer');");
process.env.NONAME_UI_TEST_ORIGIN='http://127.0.0.1:8081';process.env.SKIN_GAME_LABEL='experience-r09/game-actions-final';process.env.SKIN_GAME_SECONDS='60';
const file='output/dynamic-remediation/20260926-r01/experience-r09/game-actions-final-harness.mjs';await fs.writeFile(file,s);await import('../'+file);
