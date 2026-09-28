import { compactSeatGeometry, installCompactSeatLayout } from './compactSeats.js';

export function responsivePlayerScale(width, height, count) {
 return compactSeatGeometry(width, height, count).scale;
}
// Built-in presentation owns panel styling only. Seat/hand geometry remains
// in the core when switching to another presentation.
export function releaseBuiltinAdaptiveLayout(arena) {
 arena?.classList.remove('builtin-responsive');
}
export function installBuiltinAdaptiveLayout({ game, ui, mode }) {
 installCompactSeatLayout({ game, ui, mode });
 if (!ui.arena?.classList.contains('compact-seats')) return;
 releaseBuiltinAdaptiveLayout(ui.arena);
 if (!document.body.matches('[data-decade-loading], [data-shousha-loading], .decade-layout, .shousha-skinned-arena, .shousha-native-game')) ui.arena.classList.add('builtin-responsive');
}
