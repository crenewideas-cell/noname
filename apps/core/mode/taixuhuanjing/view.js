/** Shared mode panels. UI providers may restyle these nodes, not replace actions. */
import {game, lib} from 'noname';

export function confirmChoice(message, callback) {
 callback(window.confirm(message) ? 1 : 2);
}

export function returnToLobby() {
 sessionStorage.setItem(lib.configprefix+'return_to_lobby', 'true');
 localStorage.removeItem(lib.configprefix+'directstart');
 game.reload();
}

export function createStyle(text) {
 const style = document.createElement('style');
 style.dataset.mode = 'taixuhuanjing';
 style.textContent = text;
 document.head.append(style);
 return style;
}
