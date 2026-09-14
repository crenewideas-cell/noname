// Presentation entries belong to the local selected generals, not to every
// character installed in a pack. Never reveal a hidden general through a menu.
export function selectedCharacters(game) {
    const player = game.me;
    if (!player) return [];
    return [...new Set([
        !player.isUnseen?.(0) && (player.name1 || player.name),
        !player.isUnseen?.(1) && player.name2,
    ].filter(Boolean))];
}

export function createCharacterResourceMenu(lib, game, ui, { registry, suffix, available, open, update }) {
    const buttons = new Map();
    let timer, frame, disposed = false;
    function characters() { return selectedCharacters(game).filter(id => registry.has(id) && available(registry.get(id))); }
    function refresh() {
        if (disposed) return;
        const ids = characters();
        for (const [id, button] of buttons) if (!ids.includes(id) || !button.isConnected) {
            button.remove(); buttons.delete(id);
        }
        if (ui.window && ui.system2) for (const id of ids) {
            if (buttons.has(id)) continue;
            const spec = registry.get(id);
            const button = ui.create.system((spec.shortLabel || spec.label || id) + suffix, () => open(id), true);
            buttons.set(id, button);
        }
        update?.(ids);
    }
    function schedule() {
        if (!frame && !disposed) frame = requestAnimationFrame(() => { frame = null; refresh(); });
    }
    function start() {
        if (disposed) return;
        timer ||= setInterval(refresh, 1000);
        schedule();
    }
    function dispose() {
        disposed = true; clearInterval(timer); cancelAnimationFrame(frame);
        for (const button of buttons.values()) button.remove();
        buttons.clear();
        const index = lib.arenaReady.indexOf(start);
        if (index !== -1) lib.arenaReady.splice(index, 1);
        window.removeEventListener("pagehide", dispose);
    }
    (lib.arenaReady ||= []).push(start);
    window.addEventListener("pagehide", dispose, { once: true });
    if (ui.window) start();
    return { characters, refresh: schedule, dispose };
}
