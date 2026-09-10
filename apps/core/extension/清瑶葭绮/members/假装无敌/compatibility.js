// Optional presentation helpers, independent of the old APK's engine replacements.
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
        background.setBackgroundImage(src);
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
