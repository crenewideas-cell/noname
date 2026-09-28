import { samplePortraitBackground, releasePortraitSampling, fillPortraitBackdrop } from "./portraitSampling.js";
import thumbnails from "./generated/portrait-thumbnails.json";

const pending = new WeakMap<HTMLElement, () => void>();
const loads = new Map<string, Promise<boolean>>();
let observer: IntersectionObserver | undefined;
const cssImages = (sources: string[]) => [...new Set(sources)].map(src => `url(${JSON.stringify(src)})`).join(",");

/** Release a directory entry that will be recreated on another page. */
export function releasePortraitBackground(node: HTMLElement) {
	releasePortraitSampling(node);
	pending.delete(node);
	observer?.unobserve(node);
}

function available(url: string): Promise<boolean> {
	let job = loads.get(url);
	if (!job) {
		job = new Promise(resolve => {
			const image = new Image();
			image.onload = () => resolve(true);
			image.onerror = () => resolve(false);
			image.src = url;
		});
		loads.set(url, job);
	}
	return job;
}

/** Writes the style synchronously so legacy character buttons can clone it. */
export function setPortraitBackground(node: HTMLDivElement, sources: string[], assetURL: string) {
	releasePortraitBackground(node);
	const mapped = sources.map(source => {
		if (!node.classList.contains("button") || !node.classList.contains("character")) return source;
		const base = new URL(assetURL || "./", document.baseURI);
		const url = new URL(source, document.baseURI);
		if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return source;
		let path: string;
		try { path = decodeURIComponent(url.pathname.slice(base.pathname.length)); } catch { return source; }
		const thumbnail = (thumbnails as Record<string, string>)[path];
		return thumbnail ? new URL(thumbnail, base).href : source;
	});
	// These are load-failure alternatives, not layers in the artwork. A
	// transparent skin must never reveal a different character underneath it.
	node.style.backgroundImage = cssImages(mapped.slice(0, 1));
	if (mapped.length === 1 && mapped[0] === sources[0] && !node.matches('.qh-image-standard, .primary-avatar, .button.character')) {
		samplePortraitBackground(node, mapped);
		return;
	}
	const expected = node.style.backgroundImage;
	const check = () => {
		void (async () => {
			for (let i = 0; i < mapped.length; i++) {
				for (const source of [...new Set([mapped[i], sources[i]])]) {
					const ok = await available(source);
					if (node.style.backgroundImage !== expected) return;
					if (!ok) continue;
					node.style.backgroundImage = cssImages([source]);
					samplePortraitBackground(node, [source]);
					if (node.matches('.qh-image-standard, .primary-avatar, .button.character')) void fillPortraitBackdrop(node, source);
					return;
				}
			}
		})();
	};
	// Hidden directory entries must never fetch images just to test a fallback.
	if (typeof IntersectionObserver === "undefined") return;
	observer ||= new IntersectionObserver(entries => {
		for (const entry of entries) if (entry.isIntersecting) {
			observer!.unobserve(entry.target);
			const run = pending.get(entry.target as HTMLElement);
			pending.delete(entry.target as HTMLElement);
			run?.();
		}
	});
	pending.set(node, check);
	observer.observe(node);
}
