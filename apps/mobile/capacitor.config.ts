import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.libnoname.noname",
	appName: "noname",
	webDir: process.env.NONAME_MOBILE_WEB_DIR || "../../dist",
	plugins: {
		App: {},
	},
};

export default config;
