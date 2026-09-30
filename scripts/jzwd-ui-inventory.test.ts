import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import yazl from "yazl";
import iconv from "iconv-lite";
import { atlasPages, auditSource, binarySpineVersion, resolveDependency, writeAudit } from "./jzwd-ui-inventory.ts";

async function fixture(t: test.TestContext, files: Record<string, string | Buffer>) {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), "jzwd-audit-test-"));
	t.after(() => fs.rm(root, { recursive: true, force: true }));
	const zip = new yazl.ZipFile();
	for (const [name, value] of Object.entries(files)) {
		if (name.endsWith("/")) zip.addEmptyDirectory(name);
		else zip.addBuffer(Buffer.from(value), name, { compress: false });
	}
	const chunks: Buffer[] = [];
	const done = new Promise<Buffer>((resolve, reject) => {
		zip.outputStream.on("data", chunk => chunks.push(chunk));
		zip.outputStream.on("error", reject);
		zip.outputStream.on("end", () => resolve(Buffer.concat(chunks)));
	});
	zip.end();
	const source = path.join(root, "source.zip");
	await fs.writeFile(source, await done);
	return { source, root };
}

const atlas = "page.png\nsize: 8,8\nformat: RGBA8888\nfilter: Linear,Linear\nrepeat: none\nregion.png\n  rotate: false\n  xy: 0,0\n  size: 8,8\n";

test("atlas pages preserve multiple pages without mistaking region names for pages", () => {
	assert.deepEqual(atlasPages("\uFEFF\n" + atlas + "\nother.webp\nsize: 2,2\nregion\n xy: 0,0\n"), ["page.png", "other.webp"]);
	assert.deepEqual(atlasPages(""), []);
	assert.equal(resolveDependency("animation/a.atlas", "page.png"), "animation/page.png");
	for (const value of ["../escape.png", "/abs.png", "C:/data.png", "https://host/a.png", "page\\a.png", "NUL.png"]) assert.throws(() => resolveDependency("a.atlas", value));
});

test("audit hashes bytes and inventories empty files/directories without executing scripts", async t => {
	const { source } = await fixture(t, {
		"pack/": "", "pack/empty/": "", "pack/empty.txt": "",
		"pack/extension.js": "throw new Error('must never execute'); game.import('extension', evil);",
		"pack/a.json": JSON.stringify({ skeleton: { spine: "4.0.56" }, animations: { idle: {}, hit: {} } }),
		"pack/a.atlas": atlas, "pack/page.png": "pixels", "pack/copy.png": "pixels",
	});
	const audit = await auditSource(source, "pack/");
	assert.deepEqual(audit.summary.counts, { entries: 8, directories: 2, files: 6, nonemptyFiles: 5, emptyFiles: 1, uncompressedBytes: audit.resources.reduce((n, row) => n + row.bytes, 0) });
	assert.equal(audit.models[0].closure, "complete-files-only");
	assert.deepEqual(audit.models[0].animations, ["idle", "hit"]);
	assert.equal(audit.resources.find(row => row.path === "empty.txt")!.sha256, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
	assert.deepEqual(audit.duplicates[0].files, ["copy.png", "page.png"]);
	assert.ok(audit.evidence.entry.some(row => row.file === "extension.js" && row.line === 1));
	assert.equal(audit.summary.source.sha256.length, 64);
});

test("missing, empty and case-mismatched pages remain incomplete", async t => {
	const { source } = await fixture(t, {
		"pack/a.skel": "header\x063.6.38\0", "pack/a.atlas": atlas.replace("page.png", "PAGE.png"), "pack/page.png": "pixels",
		"pack/b.skel": "4.0.56", "pack/b.atlas": atlas,
		"pack/c.skel": "3.6.53", "pack/c.atlas": "",
		"pack/d.skel": "3.6.39",
		"pack/e.skel": "3.6.38", "pack/e.atlas": atlas.replace("page.png", "empty.png"), "pack/empty.png": "",
		"pack/f.skel": "3.6.38", "pack/f.atlas": atlas.replace("page.png", "missing.png"),
	});
	const audit = await auditSource(source, "pack/");
	assert.equal(audit.models.find(row => row.file === "a.skel")!.pages[0].status, "case-mismatch");
	assert.equal(audit.models.find(row => row.file === "b.skel")!.closure, "complete-files-only");
	assert.equal(audit.models.find(row => row.file === "c.skel")!.atlas.status, "empty");
	assert.equal(audit.models.find(row => row.file === "d.skel")!.atlas.status, "missing");
	assert.equal(audit.models.find(row => row.file === "e.skel")!.pages[0].status, "empty");
	assert.equal(audit.models.find(row => row.file === "f.skel")!.pages[0].status, "missing");
	assert.equal(audit.summary.incompleteModels, 5);
	assert.equal(binarySpineVersion(Buffer.from("unknown")), null);
});

test("unexpected root, case collisions and file-directory collisions are rejected", async t => {
	for (const files of [{ "wrong/file": "x" }, { "pack/A.png": "x", "pack/a.png": "y" }, { "pack/x": "x", "pack/x/y": "y" }]) {
		const { source } = await fixture(t, files);
		await assert.rejects(auditSource(source, "pack/"), /顶层|冲突/);
	}
});

test("GBK names decode correctly and ZIP path traversal is rejected before analysis", async t => {
	const { source } = await fixture(t, { "pack/AA.png": "x" });
	const bytes = await fs.readFile(source);
	// Rewrite both local and central filenames; filename changes do not change data CRC.
	for (const signature of [0x04034b50, 0x02014b50]) {
		const marker = Buffer.alloc(4); marker.writeUInt32LE(signature);
		const at = bytes.indexOf(marker), flagOffset = signature === 0x04034b50 ? 6 : 8;
		bytes.writeUInt16LE(bytes.readUInt16LE(at + flagOffset) & ~0x800, at + flagOffset);
	}
	let at = bytes.indexOf("AA.png");
	while (at !== -1) { iconv.encode("中", "gbk").copy(bytes, at); at = bytes.indexOf("AA.png", at + 2); }
	await fs.writeFile(source, bytes);
	assert.equal((await auditSource(source, "pack/")).resources[0].path, "中.png");
	const unsafe = await fixture(t, { "pack/aa/x": "x" });
	const bad = await fs.readFile(unsafe.source);
	let pos = bad.indexOf("pack/aa/x");
	while (pos !== -1) { bad.write("pack/../x", pos); pos = bad.indexOf("pack/aa/x", pos + 9); }
	await fs.writeFile(unsafe.source, bad);
	await assert.rejects(auditSource(unsafe.source, "pack/"), /路径/);
});

test("corrupted stored payload fails CRC rather than generating trustworthy-looking evidence", async t => {
	const { source } = await fixture(t, { "pack/data.txt": "payload-sentinel" });
	const bytes = await fs.readFile(source);
	bytes[bytes.indexOf("payload-sentinel")] ^= 1;
	await fs.writeFile(source, bytes);
	await assert.rejects(auditSource(source, "pack/"), /CRC/);
});

test("outputs are additive and never overwrite a previous audit or the source", async t => {
	const { source, root } = await fixture(t, { "pack/a.txt": "x" });
	const before = await fs.readFile(source);
	const audit = await auditSource(source, "pack/");
	const output = path.join(root, "audit");
	await writeAudit(output, audit);
	await assert.rejects(writeAudit(output, audit), { code: "EEXIST" });
	await assert.rejects(writeAudit(source, audit), { code: "EEXIST" });
	assert.deepEqual(await fs.readFile(source), before);
	assert.deepEqual(JSON.parse(await fs.readFile(path.join(output, "summary.json"), "utf8")), audit.summary);
});
