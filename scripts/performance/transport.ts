import { request } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import assert from "node:assert/strict";
import createApp from "../../packages/fs/src/index.ts";
import { root } from "./environment.ts";

const artifact = process.argv[2];
if (!artifact) throw new Error("Pass core dist directory");
const app = createApp({ dirname: artifact, server: true, listen: false });
const url = await app.listen({ port: 0, host: "127.0.0.1" });
const results = [];
try {
	for (const path of ["noname/library/element/content.js", "layout/default/layout.css", "font/suits.woff2"]) {
		const original = await readFile(resolve(artifact, path));
		for (const encoding of ["identity", "gzip", "br"]) {
			const response = await new Promise<{ body: Buffer; headers: any; status: number | undefined }>((ok, fail) => {
				request(`${url}/${path}`, { headers: { "accept-encoding": encoding } }, response => {
					const chunks: Buffer[] = [];
					response.on("data", chunk => chunks.push(chunk));
					response.on("error", fail);
					response.on("end", () => ok({ body: Buffer.concat(chunks), headers: response.headers, status: response.statusCode }));
				}).on("error", fail).end();
			});
			assert.equal(response.status, 200);
			const coding = response.headers["content-encoding"];
			const decoded = coding === "br" ? brotliDecompressSync(response.body) : coding === "gzip" ? gunzipSync(response.body) : response.body;
			assert.deepEqual(decoded, original);
			results.push({ path, requestedEncoding: encoding, headers: response.headers, sourceBytes: original.length, wireBodyBytes: response.body.length });
		}
	}
	const out = resolve(root, "output/performance", "phase1-transport.json");
	await mkdir(resolve(out, ".."), { recursive: true });
	await writeFile(out, JSON.stringify({ artifact, server: "real @noname/fs over HTTP", results }, null, 2));
	console.log(out);
} finally { await app.close(); }
