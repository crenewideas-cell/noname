/** Reproducible data-only import. Never evaluates the source ZIP's JavaScript. */
import fs from "node:fs/promises";
import syncFs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import ts from "typescript";
import { Archive, digest } from "./extension-organizer/archive.ts";

const input = path.resolve("temp/卡牌扩展包");
const output = path.resolve("apps/core/extension/collections/卡牌扩展");
const report: any[] = [];
const candidates: any[] = [];
const assetPacks: any[] = [];
const property = (node: any, key: string) => node?.properties?.find((p: any) => p.name?.text === key)?.initializer;

async function write(file: string, data: string | Buffer) {
	await fs.mkdir(path.dirname(file), { recursive: true });
	await fs.writeFile(file, data);
}

async function scan(file: string, source: string, nested = false) {
	const zip = await Archive.open(file);
	try {
		const entries = [...zip.entries.keys()];
		for (const entry of entries.filter(f => f.endsWith(".zip"))) {
			const bytes = await zip.read(entry, 128 * 1024 ** 2);
			const cache = path.resolve("temp/card-import-cache", `${digest(bytes)}.zip`);
			await write(cache, bytes);
			await scan(cache, `${source}/${entry}`, true);
		}
		const entry = entries.find(f => /(^|\/)extension\.js$/.test(f));
		if (!entry) {
			if (entries.some(f => /\.(png|jpg|webp|gif)$/i.test(f))) assetPacks.push({ file, source, entries });
			return;
		}
		const text = (await zip.read(entry)).toString("utf8");
		const ast = ts.createSourceFile(entry, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
		if ((ast as any).parseDiagnostics.length) throw new Error(`源文件语法错误：${source}`);
		let object: any;
		function find(node: ts.Node) {
			if (ts.isCallExpression(node) && node.expression.getText(ast) === "game.import" && (node.arguments[0] as any)?.text === "extension") {
				const arg: any = node.arguments[1];
				object = ts.isObjectLiteralExpression(arg) ? arg : arg.body.statements.find(ts.isReturnStatement)?.expression;
			}
			if (!object) ts.forEachChild(node, find);
		}
		find(ast);
		const name = property(object, "name")?.text;
		if (!name) throw new Error(`无法识别入口：${source}`);
		candidates.push({ file, source, entries, entry, text, ast, object, name, nested });
	} finally {
		zip.close();
	}
}

for (const file of (await fs.readdir(input)).filter(f => f.endsWith(".zip")).sort()) await scan(path.join(input, file), file);
const chosen = new Map();
// A top-level source is the user's selected version; nested duplicates are fallback only.
for (const candidate of candidates.sort((a, b) => Number(a.nested) - Number(b.nested))) {
	if (chosen.has(candidate.name)) {
		report.push({ source: candidate.source, name: candidate.name, status: "duplicate", retained: chosen.get(candidate.name).source });
	} else chosen.set(candidate.name, candidate);
}

const members: any[] = [];
for (const c of chosen.values()) {
	if (c.name === "士兵扩展包") {
		report.push({ source: c.source, name: c.name, status: "existing", retained: "extension/packs/士兵扩展包", reason: "武将包，已有适配版本；不重复安装" });
		continue;
	}
	if (c.name === "十周年UI" || c.name === "王者魔戒") {
		assetPacks.push({ ...c, reason: c.name === "十周年UI" ? "旧版整套 UI；只收纳卡牌资源，沿用现有公共展示入口" : "依赖未安装的王者荣耀属性/装备系统，保留来源，不能伪装为可独立使用的卡包" });
		continue;
	}
	const id = `import_${digest(c.name).slice(0, 10)}`;
	const assetBase = `卡牌扩展/members/${id}`;
	const omissions: string[] = [];
	const helpers: string[] = [];
	const packageNode = property(c.object, "package");
	const cardData = property(packageNode, "card")?.getText(c.ast) || "{}";
	const skillData = property(packageNode, "skill")?.getText(c.ast) || "{}";
	let config = property(c.object, "config")?.getText(c.ast) || "{}";
	let content = property(c.object, "content");
	let deferred = false;
	if (c.name === "技能卡牌") {
		content = content.body.statements[0].expression.arguments[0];
		deferred = true;
	}
	// Convert only initialization writes. Card/skill callbacks retain real engine bindings.
	function convert(node: ts.Node): string {
		const edits: [number, number, string][] = [];
		function visit(current: ts.Node) {
			if (ts.isFunctionExpression(current) || ts.isArrowFunction(current) || ts.isMethodDeclaration(current)) return;
			const text = current.getText(c.ast);
			const mapped: Record<string, string> = { "lib.card.list": "builder.list", "lib.guozhanPile": "builder.list", "lib.card": "builder.card", "lib.skill": "builder.skill", "lib.translate": "builder.translate", "game.addCardPack": "builder.addPack", "game.addCharacterPack": "builder.addPack", "game.addCard": "builder.addCard" };
			if (mapped[text]) {
				edits.push([current.getStart(c.ast), current.end, mapped[text]]);
				return;
			}
			ts.forEachChild(current, visit);
		}
		visit(node);
		let text = node.getText(c.ast);
		for (const [start, end, value] of edits.sort((a, b) => b[0] - a[0])) text = text.slice(0, start - node.getStart(c.ast)) + value + text.slice(end - node.getStart(c.ast));
		return text;
	}

	const statements: string[] = [];
	for (const node of content?.body?.statements || []) {
		const text = node.getText(c.ast);
		if (/^lib\.element\.player\.needToRemove\s*=/.test(text)) {
			helpers.push(text.replace("lib.element.player.needToRemove=", "const needToRemove ="));
			continue;
		}
		if (/^game\.animationofgif\s*=/.test(text)) {
			omissions.push("旧暂停式 GIF 全屏特效，卡牌本身效果保留");
			continue;
		}
		if (/^lib\.(group|linked)\.push|^if\(game\.createNature\)|^lib\.card\.sha\s*=|^if\(lib\.cardPack\.guozhan\)|^lib\.arenaReady\.push|^lib\.cardPack\.|^lib\.translate\.mode_extension_|^if\(config\.friendly\)/.test(text)) {
			omissions.push(text.slice(0, 90));
			continue;
		}
		statements.push(convert(node));
	}
	// 超越人类 created its actual options by patching extensionMenu in precontent.
	if (c.name === "超越人类") {
		const configs: string[] = [];
		function collect(node: ts.Node) {
			if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && node.left.getText(c.ast).startsWith("lib.extensionMenu.extension_超越人类.") && ts.isObjectLiteralExpression(node.right) && property(node.right, "init")) {
				const key = node.left.getText(c.ast).split(".").at(-1)!;
				if (!["line2", "Twinkling", "friendly", "attShow", "NoU"].includes(key)) configs.push(`${JSON.stringify(key)}: ${node.right.getText(c.ast)}`);
			}
			ts.forEachChild(node, collect);
		}
		collect(property(c.object, "precontent"));
		config = `{${configs.join(",\n")}}`;
	}
	let code = `// Generated from ${c.source}; registration and configuration live in cardPackRuntime.js.\nexport default function(lib, game, ui, get, ai, _status) {\n${helpers.join("\n")}\nreturn { config: ${config}, build(config, builder) {\nbuilder.addPack(${cardData});\nbuilder.addPack(${skillData});\n${statements.join("\n")}\n} };\n}\n`;
	code = code.replaceAll("player.needToRemove()", "lib.skill.import_card_helpers.needToRemove.call(player)");
	if (helpers.length) code = code.replace("build(config, builder) {", "build(config, builder) { builder.skill.import_card_helpers = { needToRemove }; ");
	code = code.replace(/game\.animationofgif\([^;]+;/g, "/* Presentation uses the installed UI. */");
	code = code.replaceAll("lib.config['extension_技能卡牌_num']", "config.num");
	if (deferred) {
		code = code.replaceAll("image:'character/'", "fullimage:true, image:'character:'");
		code = code.replace("builder.list.length*", "lib.card.list.length*");
		for (const key of ["forbidai", "forbidall", "banned", "forbiddouble"]) code = code.replaceAll(`lib.config.${key}.contains(i)`, `(lib.config.${key} || []).includes(i)`);
		code = code.replaceAll("lib.character[i][4]", "get.convertedCharacter(lib.character[i]).trashBin").replaceAll("lib.character[name][3]", "get.convertedCharacter(lib.character[name]).skills").replaceAll("lib.character[name][2]", "get.convertedCharacter(lib.character[name]).hp").replaceAll("target.get('s')", "target.getSkills()");
	}
	// Asset paths are rewritten at import time; no per-pack runtime resolver is installed.
	code = code.replaceAll(`db:extension-${c.name}:`, `ext:${assetBase}/`).replaceAll(`ext:${c.name}/`, `ext:${assetBase}/`).replaceAll(`ext:${c.name}:`, `ext:${assetBase}:`).replaceAll(`extension/${c.name}/`, `extension/${assetBase}/`);
	code = code.replace(/(game\.playAudio\(['"]\.\.['"],\s*['"]extension['"],\s*)(['"])([^'"]+)\2/g, (match, before, quote, name) => (name === c.name ? `${before}${quote}${assetBase}${quote}` : match));
	code = code.replace(/lib\.config\.extension_超越人类_([A-Za-z0-9_]+)/g, (_, key) => `lib.config["extension_卡牌扩展_${id}_${key}"]`);
	// Old global helper IDs collided across 祈愿/超越人类. Namespace only owned globals.
	const globals = [...new Set([...code.matchAll(/builder\.skill\.(_[A-Za-z0-9_]+)\s*=/g)].map(m => m[1]))];
	if (globals.length) code = code.replace(new RegExp(`(?<![\\w])(?:${globals.sort((a, b) => b.length - a.length).join("|")})(?=_|[\\W]|$)`, "g"), value => `${value}_${id}`);
	if (!c.entries.some((file: string) => /\.(png|jpg|webp|gif)$/i.test(file))) {
		code = code.replace(/fullskin\s*:\s*true/g, "fullskin:false").replace(/fullimage\s*:\s*true/g, "fullimage:false");
		omissions.push("源包不含卡面，使用引擎文字卡面");
	}
	const parsed = ts.createSourceFile("data.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
	if ((parsed as any).parseDiagnostics.length) {
		await write("temp/card-import-error.js", code);
		console.log((parsed as any).parseDiagnostics.map((d: any) => ({ pos: d.start, message: d.messageText })));
		throw new Error(`转换语法错误：${c.name}`);
	}
	await write(path.join(output, "members", id, "data.js"), code);
	const zip = await Archive.open(c.file);
	try {
		const prefix = c.entry.slice(0, -"extension.js".length);
		for (const entry of c.entries) {
			if (!entry.startsWith(prefix) || /\.(js|zip)$/i.test(entry)) continue;
			await write(path.join(output, "members", id, entry.slice(prefix.length)), await zip.read(entry, 128 * 1024 ** 2));
		}
	} finally {
		zip.close();
	}
	if (c.name === "国战补充②") {
		code = code.replace("} };\n}", "builder.list.splice(0, builder.list.length, ...builder.list.filter(row => Object.hasOwn(builder.card, row[2])));\n} };\n}");
		await write(path.join(output, "members", id, "data.js"), code);
	}
	const member: any = { id, name: c.name === "扩展" ? "古代装备" : c.name, source: c.source, deferred };
	if (c.name === "国战补充②") member.constraints = { mode: ["guozhan"], modePile: true };
	members.push(member);
	report.push({ ...member, status: "imported", sourceHash: digest(c.text), omittedLegacyPatches: omissions });
}

const assets: any[] = [];
for (const source of assetPacks) {
	const id = `assets_${digest(source.source).slice(0, 10)}`;
	const zip = await Archive.open(source.file);
	const files: string[] = [];
	try {
		for (const entry of source.entries) {
			if (!/\.(png|jpg|webp|gif|mp3)$/i.test(entry)) continue;
			// The old UI's card artwork/frames are useful; its engine replacements are not installed.
			if (source.name === "十周年UI" && !/^(olcard|image\/card)\//.test(entry)) continue;
			await write(path.join(output, "assets", id, entry), await zip.read(entry, 128 * 1024 ** 2));
			files.push(entry);
		}
	} finally {
		zip.close();
	}
	const descriptor: any = { id, source: source.source, files, label: source.source.replace(/\.zip$/, "") };
	if (source.source.includes("冰杀")) descriptor.kind = "ice";
	else if (source.name === "十周年UI") {
		descriptor.kind = "frames";
		descriptor.frames = {};
		for (const file of files) {
			const match = /^olcard\/([^/]+)\/(\d+)\.png$/.exec(file);
			if (match) (descriptor.frames[match[1]] ||= []).push(file);
		}
		for (const frames of Object.values(descriptor.frames) as string[][]) frames.sort((a, b) => Number(path.basename(a, ".png")) - Number(path.basename(b, ".png")));
	} else if (source.name !== "王者魔戒") {
		descriptor.kind = "art";
		descriptor.cards = {};
		for (const file of files) {
			const key = path.basename(file).replace(/\.[^.]+$/, "");
			if (/^[a-z0-9_]+$/.test(key)) descriptor.cards[key] = file;
		}
	}
	assets.push({ ...descriptor, reason: source.reason || "纯卡面素材，没有卡牌规则" });
	report.push({ source: source.source, name: source.name, status: source.name === "王者魔戒" ? "dependency-unavailable" : "assets", id, files: files.length, reason: source.reason || "纯卡面素材，没有卡牌规则" });
}

await write(path.join(output, "manifest.json"), JSON.stringify({ members, assets, sources: report }, null, 2) + "\n");
const imports = members.map(m => `import ${m.id} from "./members/${m.id}/data.js";`).join("\n");
await write(path.join(output, "extension.js"), `import presentation from "./presentation.js";\nimport { createCardCollection } from "noname";\n${imports}\nexport const type = "extension";\nexport default function (...args) {\nreturn createCardCollection("卡牌扩展", [\n${members.map(m => `{ ...${JSON.stringify(m)}, create: ${m.id} }`).join(",\n")}\n], args, ${JSON.stringify(assets)}, presentation);\n}\n`);
console.log(JSON.stringify({ imported: members.length, sources: report.length, assets: assets.length, output }));

// Refresh installation metadata only after every source has been imported.
const name = "卡牌扩展";
const p = "apps/core/game/extension-catalog.json";
const items = JSON.parse(syncFs.readFileSync(p));
if (!items.some(x => x.name === name)) {
	items.push({ name, category: "collections", path: "extension/collections/" + name });
	syncFs.writeFileSync(p, JSON.stringify(items, null, 2) + "\n");
}
const file = "apps/core/game/organized-extensions.json";
const records = JSON.parse(syncFs.readFileSync(file));
const dir = "apps/core/extension/collections/" + name;
const files = {};
function walk(folder) {
	for (const e of syncFs.readdirSync(folder, { withFileTypes: true })) {
		const f = path.join(folder, e.name);
		if (e.isDirectory()) walk(f);
		else files[path.relative(dir, f).replaceAll("\\", "/")] = createHash("sha256").update(syncFs.readFileSync(f)).digest("hex");
	}
}
walk(dir);
const record = { name, hash: createHash("sha256").update(JSON.stringify(files)).digest("hex"), characters: [], files, defaultEnabled: true, source: "temp/卡牌扩展包" };
const i = records.findIndex(x => x.name === name);
if (i >= 0) records[i] = record;
else records.push(record);
syncFs.writeFileSync(file, JSON.stringify(records, null, 2) + "\n");
