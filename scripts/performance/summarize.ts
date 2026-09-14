import { readFile, writeFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const directory=resolve(process.argv[2] || "");
const report=JSON.parse(await readFile(resolve(directory,"summary.json"),"utf8"));
const profiles:any[]=[];
for(const pair of (await readdir(directory)).filter(name=>name.startsWith("pair-"))) {
	for(const cache of ["cold","warm"]) {
		let run:any;
		try{run=JSON.parse(await readFile(resolve(directory,pair,cache+".json"),"utf8"));}catch{continue;}
		const perf=run.perf||run.state?.perf,lobby=run.lobbySnapshot;
		let har:any;
		try{har=JSON.parse(await readFile(resolve(directory,pair,"network.har"),"utf8"));}catch{}
		const resources=perf?.resource?.entries||[];
		const begin=run.navigationEpochMs??lobby?.timeOrigin??perf?.timeOrigin;
		const end=run.navigationEpochMs!==undefined?begin+run.flowWallMs:begin+(perf?.now||0);
		const requests=har?.log.entries.filter((e:any)=>{const time=Date.parse(e.startedDateTime);return time>=begin&&time<=end;})||[];
		profiles.push({pair,cache,passed:run.passed,traced:run.traced,timeOrigin:begin,lobbyReadyMs:run.lobbyReadyMs,lobbyReadyWallMs:run.lobbyReadyWallMs??null,
			resourceEntries:perf?.resource?.total??null,resourceEntriesDropped:perf?.resource?.dropped??null,
			completedResourceTransferBytes:perf?resources.reduce((n:number,r:any)=>n+r.transferSize,0):null,
			lobbyCompletedTransferBytes:lobby?.resource?.entries.reduce((n:number,r:any)=>n+r.transferSize,0)??null,
			lobbyCompletedResources:lobby?.resource?.total??null,
			longTasks:perf?.supported?.includes("longtask")?(perf.longtask?.total??0):null,
			longTaskDurationMs:perf?.supported?.includes("longtask")?(perf.longtask?.entries.reduce((n:number,r:any)=>n+r.duration,0)??0):null,
			maxLongTaskMs:perf?.supported?.includes("longtask")?Math.max(0,...(perf.longtask?.entries||[]).map((r:any)=>r.duration)):null,
			slowStages:(perf?.stages?.entries||[]).filter((r:any)=>!r.name.startsWith("interaction:")).toSorted((a:any,b:any)=>b.duration-a.duration).slice(0,15),
			largestResources:resources.toSorted((a:any,b:any)=>b.encodedBodySize-a.encodedBodySize).slice(0,12),
			failedRequests:requests.filter((e:any)=>e.response.status>=400||e.response.status===0).map((e:any)=>({url:new URL(e.request.url).pathname,status:e.response.status})),
			requestCount:har&&Number.isFinite(begin)?requests.length:null,
			harTransferBytes:har&&Number.isFinite(begin)?requests.reduce((n:number,e:any)=>n+Math.max(0,e.response._transferSize??-1),0):null,
			harTransferUnknownResponses:har&&Number.isFinite(begin)?requests.filter((e:any)=>!(e.response._transferSize>=0)).length:null,
			semanticChecksExcluded:true,
		});
	}
}
await writeFile(resolve(directory,"analysis.json"),JSON.stringify({notes:["Resource Timing transfers count completed entries, exclude navigation document, and do not count unfinished requests. Zero transfer can indicate cache or timing restrictions.","HAR is segmented by navigation timeOrigin and end snapshot; repeated navigations share a HAR page id.","Long-task summary covers the collector observation window; full first-navigation CPU work is available in CDP trace.","Run metric percentiles mix first-registration and restored-save states only within their explicitly separate cold/warm groups; traced first pair is also flagged."],profiles},null,2));
console.log(JSON.stringify({directory,stats:report.stats,semantics:report.semantics,profiles:profiles.map(({slowStages,largestResources,failedRequests,...r}:any)=>r)},null,2));
