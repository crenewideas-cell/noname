import { app, getCurrentWindow } from "@electron/remote";
import { createRequire } from "node:module";
import { join } from "node:path";
// HTTP renderers otherwise resolve paths relative to Electron or the launch cwd.
Object.assign(window, { __dirname: app.getAppPath(), require: createRequire(join(app.getAppPath(), "package.json")) });
const thisWindow = getCurrentWindow();

thisWindow.setAutoHideMenuBar(false);
thisWindow.setMenuBarVisibility(true);

thisWindow.on("leave-full-screen", () => {
	if (!thisWindow.isDestroyed()) {
		thisWindow.webContents.closeDevTools();
	} else {
		app.exit(0);
	}
});
