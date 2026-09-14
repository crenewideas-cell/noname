export const startupConfigReceiptKey = "_noname_startup_config_receipt";

/** Only used when the optional startup import file actually exists. */
export async function fingerprintStartupConfig(source: string): Promise<string> {
	if (globalThis.crypto?.subtle) {
		const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
		return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
	}
	const { default: CryptoJS } = await import("crypto-js");
	return CryptoJS.SHA256(source).toString();
}

/** Config, game data and receipt either all commit or all stay unchanged. */
export function commitStartupConfig(db: IDBDatabase, config: Record<string, unknown>, data: Record<string, unknown>, fingerprint: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["config", "data"], "readwrite");
		transaction.oncomplete = () => resolve();
		transaction.onabort = () => reject(transaction.error || new Error("启动配置导入已取消"));
		try {
			const configs = transaction.objectStore("config");
			const records = transaction.objectStore("data");
			for (const [key, value] of Object.entries(config)) configs.put(value, key);
			for (const [key, value] of Object.entries(data)) records.put(value, key);
			records.put({ version: 1, fingerprint }, startupConfigReceiptKey);
		} catch (error) {
			transaction.abort();
			reject(error);
		}
	});
}
