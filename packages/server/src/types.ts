export interface ServerOptions {
	port?: number;
	host?: string;
	/** Optional browser Origin allowlist; native clients without Origin are allowed. */
	allowedOrigins?: string[];
	maxConnections?: number;
	maxConnectionsPerIp?: number;
	maxPayload?: number;
	maxBufferedAmount?: number;
	/** Per-connection burst allowance, replenished every second. */
	messagesPerSecond?: number;
}

export interface ServerInstance {
	start(): Promise<void>;
	stop(): Promise<void>;
}
