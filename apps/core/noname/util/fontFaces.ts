import subsets from "./generated/font-subsets.json";

/** Disjoint ranges cover every codepoint of the source fonts, including rare names. */
export function fontFaces(family: string, localName: string, assetURL: string): string[] {
	const chunks = (subsets as Record<string, { file: string; range: string }[]>)[family];
	return (chunks || [{ file: `font/${family}.woff2`, range: "" }]).map(chunk =>
		`@font-face {font-family: ${JSON.stringify(family)}; font-display: swap; ${chunk.range ? `unicode-range: ${chunk.range};` : ""} src: local(${JSON.stringify(localName)}), url(${JSON.stringify(assetURL + chunk.file)}) format('woff2');}`
	);
}
