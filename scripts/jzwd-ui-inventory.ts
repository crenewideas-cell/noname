import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseArgs } from "node:util";
import { Archive, hashFile, safePath, compare } from "./extension-organizer/archive.ts";

export const SOURCE_ROOT = "假装无敌完整包v2.0.4/";
const TEXT_LIMIT = 16 * 1024 ** 2;
const TEXT_TOTAL_LIMIT = 64 * 1024 ** 2;
const textExtension = /\.(?:js|css|html|md|txt|json|atlas)$/i;
type Evidence = { file: string; line: number; column: number; excerpt: string };
type Resource = { path: string; bytes: number; compressedBytes: number; sha256: string; kind: string };

/** A blank line starts an atlas page; region names (even *.png) do not. */
export function atlasPages(text: string): string[] {
	const result: string[] = [];
	let start = true;
	for (const raw of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
		const line = raw.trim();
		if (!line) { start = true; continue; }
		if (start) {
			if (line.includes(":")) throw new Error(`图集页名称无效：${line}`);
			result.push(line);
		}
		start = false;
	}
	return result;
}

/** Resolve only portable, local ZIP dependencies; never touch the filesystem. */
export function resolveDependency(from: string, reference: string): string {
	safePath(reference);
	if (reference.includes("\\") || reference.endsWith("/")) throw new Error(`非标准资源路径：${reference}`);
	return safePath(path.posix.join(path.posix.dirname(from), reference));
}

export function binarySpineVersion(header: Buffer): string | null {
	// This is header evidence, not proof that a runtime can decode the skeleton.
	return header.subarray(0, 256).toString("latin1").match(/(?:^|[^\d])([34]\.\d+\.\d+)(?!\d)/)?.[1] || null;
}

function kind(file: string): string {
	if (/\.(?:js|html|exe|dll)$/i.test(file)) return "source-program-not-for-import";
	if (/\.(?:skel|atlas)$/i.test(file)) return "spine";
	if (/\.(?:png|jpe?g|webp|gif|svg)$/i.test(file)) return "image";
	if (/\.(?:mp3|ogg|wav|m4a)$/i.test(file)) return "audio";
	if (/\.(?:ttf|woff2?|otf)$/i.test(file)) return "font";
	return "data-or-other";
}

function scan(texts: Map<string, string>, pattern: RegExp): Evidence[] {
	const result: Evidence[] = [];
	for (const [file, text] of texts) {
		if (/\.atlas$/i.test(file)) continue;
		const lines = text.split(/\r?\n/);
		lines.forEach((line, index) => {
			for (const match of line.matchAll(new RegExp(pattern.source, "g"))) {
				const at = match.index!;
				result.push({ file, line: index + 1, column: at + 1, excerpt: line.slice(Math.max(0, at - 80), at + match[0].length + 160) });
			}
		});
	}
	return result;
}

export async function auditSource(source: string, root = SOURCE_ROOT) {
	if (!root.endsWith("/") || safePath(root) !== root || root.split("/").length !== 2) throw new Error("来源必须有且仅有一个预期顶层目录");
	const archive = await Archive.open(source);
	try {
		const names = [...archive.entries.keys()].sort(compare);
		if (!names.length || [...names, ...archive.directories].some(name => !name.startsWith(root))) throw new Error(`ZIP 顶层目录必须为 ${root}`);
		const resources: Resource[] = [];
		const texts = new Map<string, string>();
		const skeletons: { file: string; format: string; version: string | null; animations: string[] | null }[] = [];
		const warnings: { file: string; reason: string }[] = [];
		let textBytes = 0;
		for (const name of names) {
			const entry = archive.entries.get(name)!;
			const file = name.slice(root.length);
			const isText = textExtension.test(file);
			const retain = isText && entry.uncompressedSize <= TEXT_LIMIT && textBytes + entry.uncompressedSize <= TEXT_TOTAL_LIMIT;
			if (isText && !retain) warnings.push({ file, reason: "超出文本分析限额；已校验哈希，未扫描文本" });
			const hash = createHash("sha256"), chunks: Buffer[] = [];
			let header = Buffer.alloc(0);
			// Archive.stream verifies decompressed size and CRC; hash every file, including empty files.
			for await (const value of await archive.stream(name)) {
				const chunk = value as Buffer;
				hash.update(chunk);
				if (retain) chunks.push(chunk);
				if (header.length < 256) header = Buffer.concat([header, chunk.subarray(0, 256 - header.length)]);
			}
			resources.push({ path: file, bytes: entry.uncompressedSize, compressedBytes: entry.compressedSize, sha256: hash.digest("hex"), kind: kind(file) });
			if (/\.skel$/i.test(file)) skeletons.push({ file, format: "binary", version: binarySpineVersion(header), animations: null });
			if (retain) {
				let text: string;
				try { text = new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)); }
				catch { warnings.push({ file, reason: "文本不是有效 UTF-8；未猜测内容编码" }); continue; }
				textBytes += entry.uncompressedSize;
				texts.set(file, text);
				if (/\.json$/i.test(file)) {
					try {
						const data = JSON.parse(text);
						if (data?.skeleton?.spine) skeletons.push({ file, format: "json", version: data.skeleton.spine, animations: Object.keys(data.animations || {}) });
					} catch { warnings.push({ file, reason: "JSON 无法解析；未执行内容" }); }
				}
			}
		}
		const byName = new Map(resources.map(row => [row.path, row]));
		const folded = new Map(resources.map(row => [row.path.normalize("NFC").toLowerCase(), row.path]));
		const dependency = (file: string) => ({ file, status: byName.has(file) ? (byName.get(file)!.bytes ? "present" : "empty") : folded.has(file.normalize("NFC").toLowerCase()) ? "case-mismatch" : "missing", actual: folded.get(file.normalize("NFC").toLowerCase()) || null });
		const atlases = [...texts].filter(([file]) => /\.atlas$/i.test(file)).map(([file, text]) => {
			try { return { file, pages: atlasPages(text).map(page => dependency(resolveDependency(file, page))), error: null as string | null }; }
			catch (error) { return { file, pages: [], error: (error as Error).message }; }
		});
		const models = skeletons.map(model => {
			const atlas = dependency(model.file.replace(/\.(?:skel|json)$/i, ".atlas"));
			const row = atlases.find(item => item.file === atlas.actual);
			return { ...model, atlas, closure: atlas.status === "present" && row && !row.error && row.pages.length > 0 && row.pages.every(page => page.status === "present") ? "complete-files-only" : "incomplete", pages: row?.pages || [] };
		});
		const grouped = new Map<string, string[]>();
		for (const row of resources) grouped.set(row.sha256, [...(grouped.get(row.sha256) || []), row.path]);
		const gaps = ["js/db/", "js/db/line/", "js/skin/Mobeil.js", "js/skin/Mobeil.min.js", "js/skin/skin.js", "js/skin/skin.min.js", "skinShare.js", "skinInfo.js", "gameAsset/"].map(requested => ({
			requested, matches: resources.filter(row => requested.endsWith("/") ? row.path.startsWith(requested) : row.path === requested || row.path.endsWith("/" + requested)).map(row => row.path),
		}));
		const evidence = {
			limitations: "静态候选索引，不执行源码；拼接路径、混淆代码和动态条件需要逐项复核。Spine 闭包只校验同名 atlas 和页，不证明可播放；二进制动画名尚未解析。",
			entry: scan(texts, /(?:lib\.init\.(?:js|css)|game\.import|importScripts|loadScript|js\/db|js\/skin|gameAsset\/|skinShare|skinInfo)/),
			configuration: scan(texts, /(?:getExtensionConfig|extension_假装无敌_|saveExtensionConfig|name\s*:\s*["'][^"'\r\n]{1,100}["']|label\s*:\s*["'][^"'\r\n]{1,100}["'])/),
			dom: scan(new Map([...texts].filter(([file]) => !file.includes("/pixi/"))), /(?:ui\.create\.div|createElement|classList\.(?:add|remove|toggle)|url\s*\([^)]{1,240}\)|\.[\w-]+(?=[\s.#:>[\]]*\{))/),
			licenses: scan(new Map([...texts].filter(([file]) => !/\.(atlas|json)$/i.test(file))), /(?:SPDX-License-Identifier|Copyright|copyright|版权所有|许可协议|MIT License|Spine Runtimes License|CC-BY)/),
		};
		const count = (values: (string | null)[]) => Object.fromEntries([...new Set(values)].map(key => [key || "unknown", values.filter(value => value === key).length]));
		const summary = {
			format: "jzwd-source-audit", version: 1, source: { name: path.basename(source), bytes: (await fs.stat(source)).size, sha256: await hashFile(source), root },
			counts: { entries: resources.length + archive.directories.length, directories: archive.directories.length, files: resources.length, nonemptyFiles: resources.filter(row => row.bytes > 0).length, emptyFiles: resources.filter(row => !row.bytes).length, uncompressedBytes: resources.reduce((n, row) => n + row.bytes, 0) },
			byExtension: count(resources.map(row => path.posix.extname(row.path).toLowerCase() || "(none)")),
			spineVersions: { binary: count(models.filter(row => row.format === "binary").map(row => row.version)), json: count(models.filter(row => row.format === "json").map(row => row.version)) },
			atlasCount: atlases.length, incompleteModels: models.filter(row => row.closure !== "complete-files-only").length,
			atlasIssues: atlases.filter(row => row.error || !row.pages.length || row.pages.some(page => page.status !== "present")),
			gaps, warnings, duplicateGroups: [...grouped.values()].filter(files => files.length > 1).length,
			limitations: evidence.limitations,
		};
		return { summary, resources, directories: archive.directories.map(name => name.slice(root.length)), atlases, models, duplicates: [...grouped].filter(([, files]) => files.length > 1).map(([sha256, files]) => ({ sha256, files })), evidence };
	} finally { archive.close(); }
}

export async function writeAudit(output: string, audit: Awaited<ReturnType<typeof auditSource>>) {
	// Refuse all pre-existing targets: never clear another task's output or a previous audit.
	await fs.mkdir(path.dirname(path.resolve(output)), { recursive: true });
	await fs.mkdir(output);
	for (const [name, value] of Object.entries(audit)) await fs.writeFile(path.join(output, `${name}.json`), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
}

async function main() {
	const { values } = parseArgs({ options: { source: { type: "string" }, output: { type: "string" }, help: { type: "boolean" } } });
	if (values.help) {
		console.log("pnpm exec tsx scripts/jzwd-ui-inventory.ts --source <只读来源.zip> --output <不存在的证据目录>\n校验 GBK/UTF-8 路径、CRC 和 SHA-256；扫描图集依赖、Spine 版本与静态证据。不会执行/解压来源代码。输出目录必须不存在。");
		return;
	}
	if (!values.source || !values.output) throw new Error("需要 --source 与 --output（参见 --help）");
	try { await fs.lstat(values.output); throw new Error("输出目录已存在；请指定新的证据目录"); }
	catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
	const audit = await auditSource(values.source);
	await writeAudit(values.output, audit);
	console.log(JSON.stringify(audit.summary, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) main().catch(error => { console.error(error.message); process.exitCode = 1; });
