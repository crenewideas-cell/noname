import compress from "@fastify/compress";
import fastifyStatic, { type FastifyStaticOptions } from "@fastify/static";
import type { FastifyInstance } from "fastify";
import { constants } from "node:zlib";

/** Shared by the real filesystem server and the production performance harness. */
export async function registerStaticCompression(app: FastifyInstance) {
	// These responses describe the original representation or have no body.
	// Register before the compressor; its documented bypass also avoids emitting
	// an empty Brotli frame for a 304 response.
	app.addHook("onSend", async (request, reply, payload) => {
		const length = reply.getHeader("content-length");
		if (request.method === "HEAD" || reply.statusCode === 304 || reply.statusCode === 206 || (length !== undefined && Number(length) < 1024)) {
			request.headers["x-no-compression"] = "1";
		}
		return payload;
	});
	await app.register(compress, {
		global: true,
		globalDecompression: false,
		encodings: ["br", "gzip"],
		threshold: 1024,
		customTypes: /^(text\/|application\/(javascript|json|wasm)|image\/svg\+xml)/,
		brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } },
	});
}

/** Encapsulation keeps compression off the filesystem APIs. */
export async function staticAssets(app: FastifyInstance, options: FastifyStaticOptions) {
	await registerStaticCompression(app);
	await app.register(fastifyStatic, options);
}
