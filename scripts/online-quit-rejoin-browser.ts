import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

import { Rooms } from '../packages/server/src/platform/rooms.ts';
import { RULESET } from '../packages/online-protocol/src/index.ts';
const root = resolve(import.meta.dirname, "..");
const requireCore = createRequire(resolve(root, "apps/core/package.json"));
const requireHost = createRequire(resolve(root, "packages/game-host/package.json"));
const { createServer } = await import(pathToFileURL(requireCore.resolve("vite")).href);
const { chromium } = requireHost("playwright-core");
const server = await createServer({ configFile: resolve(root, "apps/core/vite.config.ts"), root: resolve(root, "apps/core"), server: { port: 8097, strictPort: true, open: false, hmr: false } });
await server.listen();
const component = await server.transformRequest("/noname/online/ui/OnlineLobby.vue");
const vueUrl = component!.code.match(/from\s+["']([^"']*\/vue\.js[^"']*)["']/)?.[1];
if (!vueUrl) throw new Error("Cannot resolve component Vue runtime");
let browser;
const owner={id:'owner',code:'OWNER',nickname:'1号位',avatar:'caocao'}, guest={id:'guest',code:'GUEST',nickname:'2号位',avatar:'caocao'};
let hostEvent:any; const publications:any[]=[];
const saved=new Map();
const rooms=new Rooms({saveRoom:async(v:any)=>saved.set(v.id,structuredClone(v)),deleteRoom:async(id:string)=>saved.delete(id),saveResult:async()=>{}} as any,
 {count:0,start:async(_:any,emit:any)=>{hostEvent=emit;},stop:async()=>{},receive:async()=>{},close:async()=>{}} as any,
 (id,type,payload)=>publications.push({id,type,payload:structuredClone(payload)}));
const room:any=await rooms.command(owner,'room.create',{name:'中途退出回归',modeId:'identity',preset:RULESET,capacity:5,visibility:'public'});
const call=(account:any,type:string,payload={})=>rooms.command(account,type,{roomId:room.id,...payload});
await call(guest,'room.join');await call(owner,'room.ai',{seats:[2,3,4],enabled:true});
await call(owner,'room.ready',{ready:true});await call(guest,'room.ready',{ready:true});await call(owner,'room.start');
hostEvent({type:'ready'});await rooms.read(()=>{});hostEvent({type:'started'});await rooms.read(()=>{});

try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.platform === "win32" ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : undefined) });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors: string[] = [];
  page.on("pageerror", error => { errors.push(error.message); console.error(error.message); });
  page.on("console", message => { if (message.type() === "error") console.error(message.text()); });
  await page.route("**/@vite/client", route => route.fulfill({ contentType: "application/javascript", body: `
    const styles = new Map();
    export const createHotContext = () => ({accept(){},acceptExports(){},dispose(){},prune(){},on(){},off(){},send(){},invalidate(){},data:{}});
    export const injectQuery = url => url;
    export function updateStyle(id, css) {
      let style = styles.get(id);
      if (!style) { style = document.createElement('style'); styles.set(id, style); document.head.append(style); }
      style.textContent = css;
    }
    export function removeStyle(id) { styles.get(id)?.remove(); styles.delete(id); }
  ` }));
  await page.exposeFunction('__authority',async(type:string,payload:any)=>{
    if(type==='read')return structuredClone({room:rooms.current(guest.id),...rooms.list(guest.id,{})});
    return structuredClone(await call(guest,type,payload));
  });
  await page.route('**/noname/online/client*',route=>route.fulfill({contentType:'application/javascript',body:`
    import {reactive} from '${vueUrl}';
    export const onlineState=reactive({account:{id:'guest',nickname:'2号位'},status:'connected',room:null,rooms:[],total:0,chat:[],social:{friends:[],blocked:[],invites:[]},match:{state:'idle'}});
    window.__roomState=onlineState;
    export async function restoreAccount(){const r=await window.__authority('read',{});onlineState.room=r.room;}
    export async function searchRooms(){const r=await window.__authority('read',{});onlineState.rooms=r.items;onlineState.total=r.total;}
    export async function command(type,payload){const r=await window.__authority(type,payload);if(type==='room.leave')onlineState.room=null;else if(r)onlineState.room=r;return r;}
    export const onOnlineEvent=()=>()=>{},disconnectPlatform=()=>{},connectPlatform=async()=>{},onlineId=()=>'test',prepareRoomNavigation=async()=>{},login=async()=>{},logout=async()=>{},copyOnlineText=async()=>{},loadSocial=async()=>{},api=async()=>({});
  `}));
  await page.route('**/__ai_ui.html',route=>route.fulfill({contentType:'text/html',body:`
    <meta charset="utf-8"><style>body{margin:0;background:#142827}</style><div id="splash"><div id="app"></div></div>
    <script type="module">
    import {createApp} from '${vueUrl}';import {lib} from '/noname.js';import config from '/game/config.json';
    import Lobby from '/noname/online/ui/OnlineLobby.vue';import '/noname/online/ui/online.css';
    lib.config=config;lib.assetURL='/';createApp(Lobby,{modeId:'identity'}).mount('#app');
    </script>`}));
  await page.goto('http://127.0.0.1:8097/__ai_ui.html');
  await page.getByRole('button',{name:'离开房间',exact:true}).click();
  await page.locator('.online-room-grid').waitFor();
  assert.equal(rooms.current(guest.id),null);
  assert.equal(rooms.current(owner.id)!.members.length,5,'对局尚未结束，暂存历史引擎席位');
  assert(rooms.current(owner.id)!.members.find(m=>m.id===guest.id)!.abandoned);
  assert(await page.getByRole('button',{name:'加入',exact:true}).isDisabled());
  hostEvent({type:'finished',results:[{accountId:owner.id,won:true},{accountId:guest.id,won:false}]});await rooms.read(()=>{});
  await page.waitForTimeout(300); console.log('authority',rooms.current(owner.id)?.state,rooms.current(owner.id)?.members.length);
  await page.getByRole('button',{name:'刷新',exact:true}).first().click();
  await page.waitForTimeout(300);console.log('client',await page.evaluate(()=>JSON.stringify((window as any).__roomState.rooms.map((r:any)=>[r.state,r.members.length]))));
  const join=page.getByRole('button',{name:'加入',exact:true});await join.waitFor();
  await page.waitForFunction(()=>{const s=(window as any).__roomState;return s.rooms[0]?.state==='finished'&&s.rooms[0]?.members.length===4;});
  await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='加入'&&!b.disabled));
  assert(await join.isEnabled());assert.equal(rooms.current(owner.id)!.members.length,4);
  assert(!rooms.current(owner.id)!.members.some(m=>m.id===guest.id));assert.equal(saved.get(room.id).members.length,4);
  const out=resolve(root,'output/online-join-r15');await mkdir(out,{recursive:true});
  await page.screenshot({path:resolve(out,'guest-after-settlement.png'),fullPage:true});
  await join.click();await page.locator('.online-seats').getByText('2号位',{exact:true}).waitFor();
  assert.equal(rooms.current(owner.id)!.members.length,5);assert.equal(rooms.current(guest.id)!.members.find(m=>m.id===guest.id)!.seat,1);
  assert.equal(rooms.current(owner.id)!.members.filter(m=>m.isAI).length,3,'AI席位完全不变');
  await page.screenshot({path:resolve(out,'guest-rejoined.png'),fullPage:true});
  await call(owner,'room.rematch');await call(owner,'room.ready',{ready:true});await call(guest,'room.ready',{ready:true});
  assert(rooms.current(owner.id)!.members.every(m=>m.ready));
  assert.deepEqual(errors,[]);
  await writeFile(resolve(out,'browser-report.json'),JSON.stringify({passed:true,realProductionComponent:true,realRoomsAuthority:true,transport:'in-memory bridge',engine:'stub; no match started',steps:['中途退出','房主结算','服务端和持久化4/5','大厅刷新可加入','2号位重新入座','3个AI不变','全员重新准备'],errors},null,2));
  console.log('真实大厅组件 + 实际 Rooms 服务：中途退出→结算4/5→原玩家重新入座→重新准备通过，AI不变');
} finally {await browser?.close();await rooms.close();await server.close();}
