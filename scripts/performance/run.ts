import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { cpus, platform, release, totalmem } from "node:os";
import { createHash } from "node:crypto";
import { chromium, root, startEnvironment } from "./environment.ts";
import { seed } from "./seed.ts";
import { prepareSemantics, verifySemantics } from "./semantics.ts";

const args = new Map(process.argv.slice(2).map(arg => { const [key,...rest] = arg.replace(/^--/, "").split("="); return [key,rest.join("=") || "true"]; }));
const channel = args.get("channel") || "dev", scenario = args.get("scenario") || "minimal";
const runs = Number(args.get("runs") || 20), port = Number(args.get("port") || 8081);
const collector = args.get("collector") !== "off";
if (!["dev","production"].includes(channel) || !["minimal","defaults"].includes(scenario) || !Number.isInteger(runs) || runs < 1 || runs > 100) throw new Error("Invalid channel/scenario/runs");
const out = resolve(root,"output/performance",`${new Date().toISOString().replaceAll(/[:.]/g,"-")}-${channel}-${scenario}`);
await mkdir(out,{recursive:true});
const git = (...a: string[]) => execFileSync("git",a,{cwd:root,encoding:"utf8"});
const diff = git("diff","HEAD");
await writeFile(resolve(out,"source.patch"),diff);
const hash = createHash("sha256").update(diff);
for (const file of git("ls-files","--others","--exclude-standard").trim().split(/\r?\n/).filter(Boolean)) {
	const content = await readFile(resolve(root,file)); hash.update(file).update(content);
	const copy = resolve(out,"untracked-source",file); await mkdir(resolve(copy,".."),{recursive:true}); await writeFile(copy,content);
}
const metadata: any = { createdAt:new Date().toISOString(),commit:git("rev-parse","HEAD").trim(),workingTreeHash:hash.digest("hex"),command:process.argv,
	channel,scenario,collector,requestedPairs:runs,hostname:"localhost",device:{os:platform(),release:release(),cpu:cpus()[0]?.model,logicalCpus:cpus().length,memoryBytes:totalmem()},
	network:{profile:"unthrottled loopback",cpuThrottle:1},viewport:{width:1280,height:800},realMobile:false,
	notes:["Isolated Chromium context, synthetic two-player identity fixture; not the user's saved extension configuration.","Cold=new context+explicit HTTP cache clear; warm=reload in same context with previous browser storage. No page routing (routing would disable cache).","First navigation of server is separate; existing Vite dependency disk cache is retained. Timings include app animations but exclude deliberate test dwell.","Event Timing is raw samples, not aggregated INP. Two rAFs represent a presentation opportunity, not exact paint.","Detailed CDP CPU tracing only on first pair; retain trace flag when comparing. HAR is captured for each pair."] };
let server: Awaited<ReturnType<typeof startEnvironment>> | undefined, browser: any;
const summaries: any[] = [];
let semanticReport: any;
const frame = (page: any) => page.evaluate(() => new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
const now = (page: any) => page.evaluate(() => performance.now());
async function arm(page: any, label: string, event = "pointerdown") {
	await page.evaluate(({label,event}: any) => { const w=window as any; w.__perfActions ||= {}; delete w.__perfActions[label]; document.addEventListener(event,()=>{w.__perfActions[label]=performance.now();w.__nonamePerf?.mark(`input:${label}`);},{once:true,capture:true}); },{label,event});
}
async function complete(page: any,label: string) {
	await frame(page);
	return page.evaluate((label: string)=>{const w=window as any, start=w.__perfActions[label]; if(typeof start!=="number")throw new Error(`No input observed: ${label}`); w.__nonamePerf?.end(`interaction:${label}`,start);return performance.now()-start;},label);
}
async function traceStart(cdp: any) {
	await cdp.send("Tracing.start",{categories:"devtools.timeline,v8,blink.user_timing,disabled-by-default-devtools.timeline,disabled-by-default-v8.cpu_profiler",transferMode:"ReturnAsStream"});
}
async function traceStop(cdp: any,file: string) {
	const done = new Promise<any>(r=>cdp.once("Tracing.tracingComplete",r));await cdp.send("Tracing.end");const {stream}=await done;
	const output=createWriteStream(file);
	while(true){const chunk=await cdp.send("IO.read",{handle:stream,size:1048576});if(!output.write(chunk.base64Encoded?Buffer.from(chunk.data,"base64"):chunk.data))await new Promise(r=>output.once("drain",r));if(chunk.eof)break;}
	await new Promise<void>(r=>output.end(r));await cdp.send("IO.close",{handle:stream});
}
async function flow(page: any, result: any, navigationWallStart: number) {
	await page.waitForSelector(".lobby-mode:enabled",{timeout:120000}); await frame(page);
	// Node's clock survives the production JIT worker's automatic reloads.
	result.lobbyReadyWallMs = performance.now() - navigationWallStart;
	result.lobbyReadyMs = await now(page);
	result.lobbySnapshot = await page.evaluate(()=>(window as any).__nonamePerf?.snapshot());
	await page.evaluate(async()=>{(window as any).__perfGame=await import("/noname.js");});
	await arm(page,"mode"); await page.getByRole("button",{name:"身份",exact:true}).click();
	await page.waitForFunction(()=>{const {ui,_status}=(window as any).__perfGame;return _status.event?.name==="chooseButton" && ui.dialog?.buttons?.some((b:any)=>b.classList.contains("selectable"));},undefined,{timeout:120000});
	result.modeToChooseMs=await complete(page,"mode");
	// Observe only currently visible candidate images. Do not hold up user actions.
	await page.evaluate(() => {
		const w = window as any;
		const urls = new Set<string>();
		for (const button of w.__perfGame.ui.dialog.buttons) {
			const rect = button.getBoundingClientRect();
			if (!rect.width || !rect.height || rect.bottom <= 0 || rect.top >= innerHeight || rect.right <= 0 || rect.left >= innerWidth) continue;
			for (const match of getComputedStyle(button).backgroundImage.matchAll(/url\(("(?:\\.|[^"])*"|[^)]*)\)/g)) {
				urls.add(match[1].startsWith('"') ? JSON.parse(match[1]) : match[1]);
			}
		}
		w.__candidateImages = Promise.all([...urls].map(url => new Promise<boolean>(resolve => {
			const image = new Image();
			const timer = setTimeout(() => resolve(false), 15000);
			image.onload = () => { void image.decode().then(() => { clearTimeout(timer); resolve(true); }, () => { clearTimeout(timer); resolve(false); }); };
			image.onerror = () => { clearTimeout(timer); resolve(false); };
			image.src = url;
		}))).then(ok => ({ count: urls.size, failed: ok.filter(value => !value).length, readyMs: performance.now() - w.__perfActions.mode }));
	});
	result.choose = await page.evaluate(()=>{const {lib,game,ui}=(window as any).__perfGame;return {candidates:ui.dialog.buttons.length,identity:game.me.identity,characters:Object.keys(lib.character).length,loadedPacks:lib.config.all.characters,enabledPacks:lib.config.characters,enabledExtensions:(lib.config.extensions||[]).filter((id:string)=>lib.config[`extension_${id}_enable`]),domNodes:document.getElementsByTagName("*").length};});
	// Force first seat through the application's real identity selector, separately from navigation timing.
	if (result.choose.identity!=="zhu") {
		await page.evaluate(()=>{const {ui}=(window as any).__perfGame;const node=[...ui.dialog.querySelectorAll(".tdnode")].find((n:any)=>n.link==="zhu") as HTMLElement;if(!node)throw new Error("Missing identity selector");node.click();});
		await page.waitForFunction(()=>{const {game,ui,_status}=(window as any).__perfGame;return game.me.identity==="zhu"&&_status.event.name==="chooseButton"&&ui.dialog?.buttons?.length;});
	}
	await page.waitForFunction(()=>{const {ui}=(window as any).__perfGame;return ui.cheat2&&!ui.cheat2.classList.contains("disabled");},undefined,{timeout:30000});
	await page.evaluate(()=>{(window as any).__perfGame.ui.cheat2.setAttribute("data-perf-free","true");});
	await arm(page,"directory");await page.locator('[data-perf-free="true"]').click();
	await page.waitForSelector(".character-browser input",{state:"visible",timeout:30000});
	result.directoryOpenMs=await complete(page,"directory");
	result.directoryButtons=await page.locator(".character-browser .button.character").count();
	result.directoryPageState=await page.evaluate(()=>{const {ui}= (window as any).__perfGame;const pager=ui.dialog.characterPager;return pager?[{page:pager.page,total:pager.totalPages,max:pager.pageSize}]:[...ui.dialog.paginationMap.values()].map((p:any)=>({page:p.state.pageNumber,total:p.state.totalPageCount,max:ui.dialog.paginationMaxCount.get("character")}));});
	const next = page.locator(".character-browser .page-next:not(.no-next)");
	if(await next.count()) {await arm(page,"nextPage");await next.click();result.nextPageMs=await complete(page,"nextPage");const changed=await page.evaluate(()=>{const dialog=(window as any).__perfGame.ui.dialog;return dialog.characterPager?dialog.characterPager.page===2:[...dialog.paginationMap.values()].some((p:any)=>p.state.pageNumber===2);});if(!changed)throw new Error("Pagination did not change to page 2");}
	else result.nextPageMs=null;
	const search=page.locator(".character-browser input");
	await search.fill("^曹操$");await arm(page,"search","keydown");await search.press("Enter");
	await page.waitForFunction(()=>[...document.querySelectorAll(".character-browser .button.character:not(.nodisplay)")].some((b:any)=>b.link==="caocao"));
	result.searchMs=await complete(page,"search");
	await page.evaluate(()=>{const button=[...document.querySelectorAll(".character-browser .button.character:not(.nodisplay)")].find((b:any)=>b.link==="caocao");if(!button)throw new Error("Search did not offer caocao");button.setAttribute("data-perf-character","true");});
	await arm(page,"choose");await page.locator('[data-perf-character="true"]').click();
	await frame(page);
	// Auto-confirm may already have progressed. Otherwise click the real confirmation control.
	const confirm = await page.evaluate(()=>{const {ui,game}=(window as any).__perfGame;if(game.me.name)return false;const button=ui.confirm&&[...ui.confirm.childNodes].find((n:any)=>n.link==="ok");if(button){button.setAttribute("data-perf-confirm","true");return true;}return false;});
	if(confirm){await arm(page,"confirm");await page.locator('[data-perf-confirm="true"]').click();}
	await page.waitForFunction(()=>{const {game,_status}=(window as any).__perfGame;const e=_status.event;return game.me?.name&&e?.name==="chooseToUse"&&e.player===game.me&&game.me.getCards("h").some((c:any)=>c.classList.contains("selectable"));},undefined,{timeout:45000});
	result.chooseToFirstActionMs=await complete(page,confirm?"confirm":"choose");
	result.firstAction = await page.evaluate(()=>{const {game,_status,lib}=(window as any).__perfGame;return {event:_status.event.name,type:_status.event.type,player:game.me.name,handCards:game.me.getCards("h").map((c:any)=>c.name),autoConfirm:lib.config.auto_confirm};});
	await page.evaluate(()=>{const {game}=(window as any).__perfGame;game.me.getCards("h").find((c:any)=>c.classList.contains("selectable")).setAttribute("data-perf-hand","true");});
	await arm(page,"handSelect");await page.locator('[data-perf-hand="true"]').click();result.handSelectMs=await complete(page,"handSelect");
	result.handSelected=await page.evaluate(()=>(window as any).__perfGame.ui.selected.cards.length);
	if(result.handSelected<1)throw new Error("Hand click produced no selection: "+await page.evaluate(()=>JSON.stringify({event:(window as any).__perfGame._status.event.name,card:(document.querySelector('[data-perf-hand="true"]') as any)?.name,classes:document.querySelector('[data-perf-hand="true"]')?.className})));
	await arm(page,"handUnselect");await page.locator('[data-perf-hand="true"]').click();result.handUnselectMs=await complete(page,"handUnselect");
	if(await page.evaluate(()=>(window as any).__perfGame.ui.selected.cards.length)!==0)throw new Error("Hand selection did not clear");
	await frame(page);
	result.perf=await page.evaluate(()=>(window as any).__nonamePerf?.snapshot());
	result.passed=true;
}

try {
	if(channel==="production") {
		metadata.artifact=resolve(args.get("artifact")||"");
		metadata.artifactBuild=JSON.parse(await readFile(resolve(metadata.artifact,"../../../build.json"),"utf8"));
	}
	const prepared = await prepareSemantics(out);
	server = await startEnvironment(channel,port,args.get("artifact"),args.get("compression") !== "off"); metadata.serverCache=server.cache;
	browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"});
	metadata.browser=browser.version();
	await writeFile(resolve(out,"environment.json"),JSON.stringify(metadata,null,2));
	for(let pair=0;pair<runs;pair++) {
		const pairDir=resolve(out,`pair-${String(pair+1).padStart(2,"0")}`);await mkdir(pairDir,{recursive:true});
		const context=await browser.newContext({viewport:metadata.viewport,recordHar:{path:resolve(pairDir,"network.har"),content:"omit",mode:"full"},serviceWorkers:channel==="dev"?"block":"allow"});
		const page=await context.newPage();const errors:any[]=[];page.on("pageerror",(e:any)=>errors.push({type:"pageerror",message:e.message.slice(0,1000)}));
		let navigations=0;page.on("framenavigated",(f:any)=>{if(f===page.mainFrame())navigations++;});
		page.on("console",(msg:any)=>{if(msg.type()==="error")errors.push({type:"console",message:msg.text().slice(0,1000)});});
		page.on("dialog",async(d:any)=>{errors.push({type:"dialog",message:d.message().slice(0,1000)});await d.dismiss();});
		await page.addInitScript(()=>{let value=1337;Math.random=()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};});
		const config=await seed(page,server.url,scenario);if(pair===0)await writeFile(resolve(out,"seed-config.json"),JSON.stringify(config,null,2));
		const cdp=await context.newCDPSession(page);await cdp.send("Network.enable");await cdp.send("Network.clearBrowserCache");
		for(const cache of ["cold","warm"]) {
			const traced=pair===0;
			const result:any={pair:pair+1,cache,serverNavigation:pair===0&&cache==="cold"?"first":"subsequent",traced,passed:false};errors.length=0;
			if(traced)await traceStart(cdp);
			const wallStart=performance.now(), navigationStart=navigations;
			result.navigationEpochMs=Date.now();
			try {
				await page.goto(`${server.url}/${collector?"?perf=1":""}`,{waitUntil:"domcontentloaded",timeout:120000});
				await flow(page,result,wallStart);
				result.candidateImages = await page.evaluate(() => (window as any).__candidateImages);
				if (result.candidateImages?.failed === 0) result.candidateImagesReadyMs = result.candidateImages.readyMs;
				const apiExists=await page.evaluate(()=>!!(window as any).__nonamePerf);
				if(apiExists!==collector)throw new Error("Collector opt-in state mismatch");
			} catch(error) { result.failure=String(error);try{result.state=await page.evaluate(()=>({body:document.body.innerText.slice(-1000),event:(window as any).__perfGame?._status.event?.name,perf:(window as any).__nonamePerf?.snapshot()}));}catch{} }
			finally {
				result.flowWallMs=performance.now()-wallStart;result.navigationCount=navigations-navigationStart;
				if(result.failure)result.passed=false;
				result.errors=errors.slice(0,100);result.errorCount=errors.length;
				result.runtimeClean=!errors.some(e=>e.type==="pageerror"||e.type==="dialog");
				if(traced)await traceStop(cdp,resolve(pairDir,`${cache}.trace.json`));
				await page.screenshot({path:resolve(pairDir,`${cache}.png`),timeout:15000}).catch(()=>{});
				await writeFile(resolve(pairDir,`${cache}.json`),JSON.stringify(result,null,2));
				summaries.push({...result,perf:undefined,lobbySnapshot:undefined,state:undefined});
				console.log(JSON.stringify(summaries.at(-1)));
			}
			if(!result.passed)break;
		}
		if(!semanticReport && summaries.at(-1)?.passed) { semanticReport=await verifySemantics(page,prepared);await writeFile(resolve(out,"semantics/report.json"),JSON.stringify(semanticReport,null,2));console.log(`SEMANTICS ${semanticReport.passed}`); }
		await context.close();
		if(!summaries.at(-1)?.passed)break;
	}
} finally {
	try { await browser?.close(); } finally { await server?.close(); }
	const percentiles=(values:number[])=>{const sorted=values.toSorted((a,b)=>a-b);return {n:sorted.length,p50:sorted.length?sorted[Math.ceil(sorted.length*.5)-1]:null,p95:sorted.length>=20?sorted[Math.ceil(sorted.length*.95)-1]:null,min:sorted[0]??null,max:sorted.at(-1)??null};};
	const stats:Record<string,unknown>={};
	for(const cache of ["cold","warm"])for(const metric of ["lobbyReadyWallMs","lobbyReadyMs","modeToChooseMs","candidateImagesReadyMs","directoryOpenMs","nextPageMs","searchMs","chooseToFirstActionMs","handSelectMs","handUnselectMs"]){stats[`${cache}.${metric}`]=percentiles(summaries.filter(r=>r.cache===cache&&r.passed&&Number.isFinite(r[metric])).map(r=>r[metric]));}
	await writeFile(resolve(out,"summary.json"),JSON.stringify({metadata,results:summaries,stats,semantics:semanticReport?.passed??null},null,2));
	console.log(`PERF_REPORT=${out}`);
}
if(summaries.length!==runs*2||summaries.some(r=>!r.passed||!r.runtimeClean)||!semanticReport?.passed)process.exitCode=1;
