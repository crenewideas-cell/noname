import thumbnails from "./generated/portrait-thumbnails.json";

const pending = new WeakMap<HTMLElement, () => void>();
const loads = new Map<string, Promise<boolean>>();
let observer: IntersectionObserver | undefined;
const cssImages = (sources: string[]) => [...new Set(sources)].map(src => `url(${JSON.stringify(src)})`).join(",");

/** Release a directory entry that will be recreated on another page. */
export function releasePortraitBackground(node: HTMLElement) {
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
	node.style.backgroundImage = cssImages(mapped);
	if (mapped.every((url, index) => url === sources[index])) return;
	const expected = node.style.backgroundImage;
	const check = () => {
		void Promise.all(mapped.map((url, i) => url === sources[i] ? true : available(url))).then(ok => {
			// A late failure must not overwrite a newly selected character/skin.
			if (node.style.backgroundImage === expected && ok.some(value => !value)) {
				node.style.backgroundImage = cssImages(mapped.map((url, i) => ok[i] ? url : sources[i]));
			}
		});
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
