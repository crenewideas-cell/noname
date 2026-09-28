// Resources owned by one lobby visit. They never outlive the game handoff.
export function createLobbyAudio(node) {
 const sounds = new Map(), blocked = new Set();
 let disposed = false;
 const stop = audio => { blocked.delete(audio); audio.pause(); audio.currentTime = 0; };
 const play = audio => {
  if (disposed) return;
  const attempt = audio.play();
  attempt?.catch(error => {
   if (!disposed && error.name === "NotAllowedError") blocked.add(audio);
  });
 };
 const unlock = () => { for (const audio of blocked) { blocked.delete(audio); play(audio); } };
 node.addEventListener("pointerdown", unlock);
 return {
  add(name, options) {
   if (disposed) return;
   if (sounds.has(name)) stop(sounds.get(name));
   const audio = new Audio(options.url);
   audio.preload = "none";
   audio.loop = Boolean(options.loop);
   audio.volume = Math.max(0, Math.min(1, options.volume ?? 1));
   sounds.set(name, audio);
   return audio;
  },
  play(name) { const audio = sounds.get(name); if (!disposed && audio) { stop(audio); play(audio); } },
  stop(name) { const audio = sounds.get(name); if (audio) stop(audio); },
  dispose() {
   disposed = true;
   node.removeEventListener("pointerdown", unlock);
   for (const audio of sounds.values()) { stop(audio); audio.removeAttribute("src"); audio.load(); }
   sounds.clear(); blocked.clear();
  }
 };
}

