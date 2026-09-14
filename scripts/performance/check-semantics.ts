import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { root, chromium, startEnvironment } from "./environment.ts";
import { prepareSemantics, verifySemantics } from "./semantics.ts";
const out=resolve(root,"output/performance",`semantics-${new Date().toISOString().replaceAll(/[:.]/g,"-")}`);
await mkdir(out,{recursive:true});
const prepared=await prepareSemantics(out);
const server=await startEnvironment("dev",Number(process.env.PERF_PORT||8081));
let browser:any;
try {
	browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||"C:/Program Files/Google/Chrome/Application/chrome.exe"});
	const page=await browser.newPage();const errors:string[]=[];
	page.on("pageerror",(error:any)=>errors.push(error.message));
	await page.goto(server.url+"/__perf/semantic-page.html?perf=1");
	await page.waitForFunction(()=>(window as any).__semanticReady||(window as any).__semanticError,undefined,{timeout:60000});
	const error=await page.evaluate(()=>(window as any).__semanticError);if(error)throw new Error(error);
	const report=await verifySemantics(page,prepared);
	await writeFile(resolve(out,"semantics/report.json"),JSON.stringify({...report,pageErrors:errors},null,2));
	console.log(JSON.stringify(report,null,2));console.log(`SEMANTIC_REPORT=${out}`);
	if(!report.passed||errors.length)process.exitCode=1;
} finally {await browser?.close();await server.close();}
