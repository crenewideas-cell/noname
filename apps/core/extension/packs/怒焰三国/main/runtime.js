import { lib, get } from "noname";

// Checked-in modules, not a runtime directory scan. This works on static HTTP
// clients too, and makes the dependency order explicit to both Vite and the game.
export async function installRuntime() {
    const modules = [
        [lib.element.content, () => import("../js/lib/element/content/content.js")],
        [lib.element.player, () => import("../js/lib/element/player/player.js")],
        [lib.filter, () => import("../js/lib/filter/filter.js")],
        [get, () => import("../js/lib/get/get.js")],
        [get.is, () => import("../js/lib/get/is/is.js")],
        [lib.skill, () => import("../js/lib/skill/runestone.js")],
        [lib.skill, () => import("../js/lib/skill/skin.js")],
        [lib.skill, () => import("../js/lib/skill/stratagem.js")],
        [lib.skill, () => import("../js/lib/skill/strategy.js")],
        [lib.translate, () => import("../js/lib/translate/runestone.js")],
        [lib.translate, () => import("../js/lib/translate/translate.js")],
    ];
    // Parallel downloads, deterministic merges, and a single awaited completion.
    // Import rejection propagates to the core extension loader, never detached.
    const loaded = await Promise.all(modules.map(([, load]) => load()));
    for (let index = 0; index < modules.length; index++) {
        mergeObjects(modules[index][0], loaded[index].default);
    }
}

function mergeObjects(target, source) {
    if (typeof target === "function" && /^class\s/.test(Function.prototype.toString.call(target))) target = target.prototype;
    if (!source) return;
    for (const key of Object.keys(source)) {
        const descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (descriptor.get || descriptor.set) {
            Object.defineProperty(target, key, descriptor);
            continue;
        }
        const value = descriptor.value;
        if (value instanceof Map) {
            target[key] ??= new Map();
            for (const [name, entry] of value) target[key].set(name, entry);
        } else if (value instanceof Set) {
            target[key] = new Set([...(target[key] || []), ...value]);
        } else if (Array.isArray(value)) {
            target[key] ??= [];
            target[key].addArray(value);
        } else if (value && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) {
            target[key] ??= {};
            mergeObjects(target[key], value);
        } else {
            Object.defineProperty(target, key, descriptor);
        }
    }
}
