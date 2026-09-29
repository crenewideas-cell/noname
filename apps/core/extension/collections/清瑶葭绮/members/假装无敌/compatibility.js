// Optional presentation helpers, independent of the old APK's engine replacements.
const qiyuLoads = new WeakMap();

export async function playQiyu(lib, game, auto = false) {
    if (!qiyuLoads.has(game)) {
        const base = (lib.assetURL || "") + "extension/清瑶葭绮/members/假装无敌/xianyu";
        const script = name => new Promise((resolve, reject) => lib.init.js(base, name, resolve, reject));
        const loading = (async () => {
            if (!window.XianYuCore) await script("core");
            if (!window.qyXianYuGame) await script("game");
            if (!window.XianYuCore || !window.qyXianYuGame) throw new Error("弦玉之间加载失败");
            return window.qyXianYuGame;
        })().catch(error => { qiyuLoads.delete(game); throw error; });
        qiyuLoads.set(game, loading);
    }
    const engine = await qiyuLoads.get(game);
    return new Promise((resolve, reject) => {
        let instance;
        const cleanup = () => {
            instance?.destroy();
            const index = lib.onover?.indexOf(cancel) ?? -1;
            if (index !== -1) lib.onover.splice(index, 1);
        };
        const cancel = () => { cleanup(); reject(new Error("对局已结束")); };
        try {
            instance = engine.mount(document.body, { keyboard: true, buttonRadius: 60, auto, hud: true });
            instance.onEnd(result => { cleanup(); resolve(result.score); });
            lib.onover?.push(cancel);
        } catch (error) { cleanup(); reject(error); }
    });
}

export async function playOptionalAudio(audio) {
    try {
        await audio.play();
        return true;
    } catch (error) {
        // Presentation must not interrupt character selection when autoplay is
        // blocked, playback is interrupted, or an optional resource is absent.
        if (!["NotAllowedError", "AbortError", "NotSupportedError"].includes(error?.name)) {
            console.warn("清瑶背景音乐播放失败", error);
        }
        return false;
    }
}

export function installCharacterUI(lib, ui) {
    if (typeof ui.setFlashBackground === "function") return;
    ui.setFlashBackground = function (src) {
        const previous = ui.background;
        const background = ui.create.div(".background");
        // The arena theme forwards this image through a CSS variable. Relative
        // URLs there resolve against its stylesheet, not the game document.
        const image = new URL(URL.canParse(src) ? src : (lib.assetURL || "") + src, document.baseURI).href;
        background.setBackgroundImage(image);
        Object.assign(background.style, {
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
            filter: lib.config.image_background_blur ? "blur(8px)" : "",
            webkitFilter: lib.config.image_background_blur ? "blur(8px)" : "",
            transform: lib.config.image_background_blur ? "scale(1.05)" : "",
        });
        document.body.insertBefore(background, document.body.firstChild);
        ui.background = background;
        if (previous) {
            previous.style.transition = "opacity 1s";
            ui.refresh(previous);
            previous.style.opacity = "0";
            setTimeout(() => previous.remove(), 1000);
        }
        return background;
    };
}
