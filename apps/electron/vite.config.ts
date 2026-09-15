import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

export default defineConfig({
	resolve: {
		extensions: [".ts", ".mts", ".cts", ".js"],
	},
	plugins: [
		electron([
			{
				entry: "app/main.ts",
				vite: {
					build: {
						outDir: "dist/app/",
						minify: false,
						rollupOptions: { external: ["@electron/remote/main/index.js", "@noname/fs/dist/index.js"] },
						// rollupOptions: {
						// 	output: {
						// 		preserveModules: true,
						// 	},
						// },
					},
				},
			},
			{
				// Configure the entry through lib below, so the plugin doesn't add ES output.
				onstart({ reload }) {
					// Notify the Renderer process to reload the page when the Preload scripts build is complete,
					// instead of restarting the entire Electron App.
					reload();
				},
				vite: {
					build: {
						outDir: "dist/app/",
						rollupOptions: {
							// The plugin's default lib.formats follows package.type; override below.
							external: ["@electron/remote"],
							output: { format: "cjs", entryFileNames: "preload.cjs" },
						},
						lib: { entry: "app/preload.ts", formats: ["cjs"], fileName: () => "preload.cjs" },
						// rollupOptions: {
						// 	output: {
						// 		preserveModules: true,
						// 	},
						// },
					},
				},
			},
		]),
	],
});
