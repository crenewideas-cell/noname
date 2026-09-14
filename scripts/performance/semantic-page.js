import { lib, game, ui, get, ai, _status } from "/noname.js";
import "/noname/init/polyfill.ts";
import { initializeSandboxRealms, security } from "/noname/util/sandbox.ts";
try {
	lib.config = await (await fetch("/game/config.json")).json();
	await initializeSandboxRealms(true);
	await security.initSecurity({lib,game,ui,get,ai,_status});
	window.__semanticReady = true;
} catch(error) { window.__semanticError = String(error); }
