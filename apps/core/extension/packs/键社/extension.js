import {getSkinManagement,openSkinManager} from 'noname';
import manifest from './image/skin-sets/manifest.json' with {type:'json'};
import info from './info.json' with {type:'json'};

export const type='extension';
export default {
 name:info.name,
 editable:false,
 package:{version:info.version,intro:info.intro,author:info.author},
 content(){getSkinManagement().registerSets(manifest.sets);},
 config:{skin_manager:{name:'键社皮肤管理',clear:true,onclick:()=>openSkinManager('key_lucia')}},
 files:{character:[],card:[],skill:[],audio:[]},
};
