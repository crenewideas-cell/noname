import { skinFiles, skinSharing } from './catalog-data.js';
import { skinName, sharedCharacters } from './model.js';
export function qianhuanSkins(character, prefix = 'extension') {
 // Own art and explicitly shared art remain available; no heuristic prefix stripping.
 return sharedCharacters(character, skinSharing).flatMap(name => (skinFiles[name] || []).map(file => ({
  name: skinName(file),
  path: `${prefix}/手杀标准UI/original/千幻聆音/sanguoskin/${name}/${file}`,
  source: '千幻聆音',
 })));
}
