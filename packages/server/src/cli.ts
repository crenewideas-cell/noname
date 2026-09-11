#!/usr/bin/env node

import { createServer } from "./server/createServer";

function readPort(): number {
	const portArgIndex = process.argv.findIndex(arg => arg === "--port" || arg === "-p");
	const rawPort = portArgIndex === -1 ? process.env.PORT : process.argv[portArgIndex + 1];
	const port = Number(rawPort ?? 8082);

	if (!Number.isInteger(port) || port < 0 || port > 65535) {
		throw new Error(`Invalid port: ${rawPort}`);
	}

	return port;
}

const port = readPort();
const readLimit = (name: string) => process.env[name] === undefined ? undefined : Number(process.env[name]);
const server = createServer({
	port,
	host: process.env.HOST,
	allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",").map(value => value.trim()).filter(Boolean),
	maxConnections: readLimit("MAX_CONNECTIONS"),
	maxConnectionsPerIp: readLimit("MAX_CONNECTIONS_PER_IP"),
	maxPayload: readLimit("MAX_PAYLOAD"),
	maxBufferedAmount: readLimit("MAX_BUFFERED_AMOUNT"),
	messagesPerSecond: readLimit("MESSAGES_PER_SECOND"),
});

const stop = async () => {
	await server.stop();
	process.exit(0);
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

async function main() {
	await server.start();
	console.log(`Server listening on port ${port}`);
}

main().catch(error => {
	console.error(error);
	process.exit(1);
});
