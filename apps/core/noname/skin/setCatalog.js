import nuyan from '../../extension/怒焰三国/image/skin-sets/manifest.json' with {type:'json'};
import key from '../../extension/键社/image/skin-sets/manifest.json' with {type:'json'};

const manifests=[nuyan,key];
export const skinSets=manifests.flatMap(manifest=>manifest.sets);
export const skinSetCharacters=Object.assign({},...manifests.map(manifest=>manifest.characters));
