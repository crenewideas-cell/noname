import { installCompactSeatLayout, releaseBuiltinAdaptiveLayout } from 'noname';

// The skin owns decoration only; the core commits all seats and hand sizes.
export function installAdaptiveLayout({game,ui,mode,className='shousha-native-game'}) {
 if(!ui.arena)return()=>{};
 releaseBuiltinAdaptiveLayout(ui.arena);
 const hadClass=document.body.classList.contains(className);
 document.body.classList.add(className);
 installCompactSeatLayout({game,ui,mode});
 return()=>{if(!hadClass)document.body.classList.remove(className);};
}
