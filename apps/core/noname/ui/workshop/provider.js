import {lib} from 'noname';

// Public online builds ship only reviewed presentation modules under ui-skins.
// This does not enable the general extension loader in the online client.
export function providerDirectory(name) {
 if(!['手杀标准UI','如真似幻','十周年局内UI'].includes(name))throw new Error('未知 UI 提供者');
 return `${lib.assetURL}${import.meta.env.VITE_PUBLIC_ONLINE==='1'?'ui-skins':'extension'}/${name}/`;
}
