// Adapted from 千幻聆音 theme/shousha/code/shousha.js skin page.
// Source hashes and retained/excluded behavior are recorded in SOURCE.json.
export function skinName(filename) {
 const foundDot = filename.lastIndexOf('.');
 return filename.slice(0, foundDot === -1 ? filename.length : foundDot);
}
export function getCurrentSkin(skinList, skinId) {
 for (const skin of skinList) {
  if (skin && skin.skinId === skinId) return skin;
  if (!skinId && !skin.skinId) return skin;
 }
 return null;
}
export function skinCards(entries) {
 // The original theme always begins with the classic portrait.
 return [{skinId:null, name:'经典形象', path:null}, ...entries.map(entry=>({...entry,skinId:entry.id}))];
}
export function sharedCharacters(name, sharing) {
 const result = [], seen = new Set();
 while (name && !seen.has(name)) {
  seen.add(name); result.push(name); name = Object.hasOwn(sharing,name) ? sharing[name] : null;
 }
 return result;
}
