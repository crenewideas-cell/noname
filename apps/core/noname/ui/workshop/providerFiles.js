// Shared by source migration, workshop export and native online packaging.
// Only these programs belong to a skin; media never grants code execution.
export const PROVIDER_PROGRAMS = {
	"十周年局内UI": ["extension.js", "presentation.js", "animations.js", "portraits.js", "layout.js", "animation-renderer.js", "vendor/spine.js"],
	"手杀标准UI": ["extension.js", "native-runtime.js", "boot.html", "preview.html",
		"native/boot.js", "native/lobby.js", "native/layout.js", "native/menu.js", "native/portrait-clips.js", "native/portraits.js", "native/resources.js", "native/presentation.js", "native/animations.js", "native/animation-renderer.js", "native/login-bridge.js", "native/login-backgrounds.js",
		"original/如真似幻/html/rzsh.html", "original/如真似幻/js/pixi6.min.js", "original/如真似幻/js/gsap.min.js", "original/十周年UI/spine.js"],
	"如真似幻": ["extension.js", "scenes.js", "bridge.js", "runtime.js", "js/pixi6.min.js", "js/gsap.min.js"],
};
const media = /\.(?:json|css|png|jpe?g|webp|gif|avif|svg|atlas|skel|mp3|ogg|wav|m4a|mp4|webm|woff2?|ttf|otf|txt|md)$/i;
export function isProviderFile(provider, file) {
	if (!Object.hasOwn(PROVIDER_PROGRAMS, provider) || typeof file !== "string" || /(^\/|\\|:|\0|(^|\/)\.\.?($|\/))/.test(file)) return false;
	if (provider === "手杀标准UI" && /^(?:assets|spine|vendor)\//.test(file)) return false;
	if (provider === "手杀标准UI" && /^(?:native\/(?:script-globals|core-dependencies)\.json|(?:resources|SOURCE)\.json)$/.test(file)) return false;
	return PROVIDER_PROGRAMS[provider].includes(file) || ["LICENSE", "NOTICE"].includes(file) || media.test(file);
}
