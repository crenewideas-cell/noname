import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';

// Exports whose geometry matches but does not justify changing presentation.
// Keep these alongside the established 15 controls in the shared regression.
const controls=['base_db1c688085cd8f7e','base_8e4f0adaf8a959b9','base_07c8c7cd7a9ce71f','base_2eaf2f2ea5beb668','base_fb05954e29252b3b','base_bf47224b7cc64257','base_61a4ebb7f75858ea','base_277452944fe295f0','base_6d2b855bbca14273','base_1852f18512e4f61f','base_167c18b6356ca269','base_8fc449219e60c359','base_f6b0e008ccba37f7','base_f8464b12b290c716','base_88cf99c059c7d417','base_bf621bcc88472205'];
const result=spawnSync(process.execPath,['scripts/dynamic-feedback-regression.mjs'],{stdio:'inherit',env:{...process.env,SKIN_BASELINE_DIR:process.env.SKIN_BASELINE_DIR||'output/dynamic-zhang/baseline-runtime',SKIN_EXTRA_CONTROLS:JSON.stringify(controls)}});
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status||1);
await fs.copyFile('output/dynamic-feedback/regression.json','output/dynamic-zhang/controls.json');
