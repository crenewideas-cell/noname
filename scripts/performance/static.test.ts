import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import createApp from "../../packages/fs/src/index.ts";

test("real static service negotiates compression, revalidation, HEAD and ranges; APIs/media stay unchanged", async () => {
	const directory = await mkdtemp(join(tmpdir(), "noname-static-test-"));
	const script = Buffer.from("export const text = '人物 ♠♥♣♦ JQKA';\n".repeat(400));
	await writeFile(join(directory, "large.js"), script);
	await writeFile(join(directory, "tiny.js"), "true;");
	await writeFile(join(directory, "picture.webp"), Buffer.alloc(4096, 17));
	const app = createApp({ dirname: directory, server: true, listen: false });
	try {
		for (const [encoding, decode] of [["br", brotliDecompressSync], ["gzip", gunzipSync]] as const) {
			const response = await app.inject({ url: "/large.js", headers: { "accept-encoding": encoding } });
			assert.equal(response.statusCode, 200);
			assert.equal(response.headers["content-encoding"], encoding);
			assert.match(String(response.headers.vary), /accept-encoding/i);
			assert.deepEqual(decode(response.rawPayload), script);
			assert.ok(response.rawPayload.length < script.length / 3);
			const cached = await app.inject({ url: "/large.js", headers: { "accept-encoding": encoding, "if-none-match": String(response.headers.etag) } });
			assert.equal(cached.statusCode, 304); assert.equal(cached.rawPayload.length, 0);
		}
		const plain = await app.inject({ url: "/large.js", headers: { "accept-encoding": "identity" } });
		assert.equal(plain.headers["content-encoding"], undefined); assert.deepEqual(plain.rawPayload, script);
		const head = await app.inject({ method: "HEAD", url: "/large.js", headers: { "accept-encoding": "br" } });
		assert.equal(head.statusCode, 200); assert.equal(head.rawPayload.length, 0);
		const range = await app.inject({ url: "/large.js", headers: { "accept-encoding": "br", range: "bytes=0-2047" } });
		assert.equal(range.statusCode, 206);
		assert.equal(range.headers["content-encoding"], undefined);
		assert.deepEqual(range.headers["content-encoding"] ? brotliDecompressSync(range.rawPayload) : range.rawPayload, script.subarray(0, 2048));
		for (const url of ["/tiny.js", "/picture.webp", "/readFileAsText?fileName=large.js"]) {
			const response = await app.inject({ url, headers: { "accept-encoding": "br" } });
			assert.equal(response.statusCode, 200); assert.equal(response.headers["content-encoding"], undefined, url);
		}
	} finally { await app.close(); await rm(directory, { recursive: true, force: true }); }
});
