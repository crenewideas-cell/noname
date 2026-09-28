// Bundle with esbuild --bundle --platform=node --format=cjs --external:electron,
// then run with Electron, passing the packaged online-client directory.
import { app, BrowserWindow, session } from "electron";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { onlineEntry } from "../apps/electron/app/online-assets";
import { installOnlineProtocol } from "../apps/electron/app/online-protocol";

const root = resolve(process.argv[2]);
const output = resolve(process.argv[3]);
const failures: string[] = [];
void (async () => {
  app.setPath("userData", await mkdtemp(resolve(tmpdir(), "noname-online-smoke-")));
  await mkdir(output, { recursive: true });
  await app.whenReady();
  const target = await onlineEntry(root, "#online=identity");
  const isolated = session.fromPartition("online-smoke");
  installOnlineProtocol(isolated, root, target.origin, (stage, error) => failures.push(`${stage}: ${error}`));
  const window = new BrowserWindow({ show: false, width: 1280, height: 900,
    webPreferences: { session: isolated, sandbox: true, nodeIntegration: false, contextIsolation: true } });
  window.webContents.on('console-message', (_event, level, message) => {
    if (level >= 2) console.error('Renderer:', message);
  });
  const deadline = setTimeout(() => { console.error("Electron online smoke timed out"); app.exit(1); }, 90000);
  try {
    // A same-origin inert document avoids unrelated first-run game dialogs.
    // All imported client modules still come from the real packaged files.
    await window.loadURL(new URL("/game/config.json", target).href);
    // This is the real production bundle and the native protocol/API proxy,
    // using a fresh profile. No account creation or production room mutation.
    const result = await window.webContents.executeJavaScript(`(async () => {
      const client = await import('/client.js');
      try { await client.restoreAccount(); }
      catch (error) { return { ok: false, code: error.code, message: error.message, build: client.onlineState.build }; }
      return { ok: true, build: client.onlineState.build, error: client.onlineState.error,
        account: client.onlineState.account, status: client.onlineState.status };
    })()`);
    await writeFile(resolve(output, "result.json"), JSON.stringify({ ...result, failures }, null, 2));
    console.log(JSON.stringify(result));
    // /me returns AUTH_EXPIRED for this clean profile, which restoreAccount
    // handles as a login prompt. It must never throw VERSION_MISMATCH.
    if (!result.ok) throw new Error(result.message);
    if (process.argv.includes('--ui')) {
      const html = await readFile(resolve(root, 'index.html'), 'utf8');
      const imports = JSON.parse(/<script[^>]*type="importmap"[^>]*>([\s\S]*?)<\/script>/.exec(html)![1]);
      await window.webContents.executeJavaScript(`(() => {
        const map=document.createElement('script');map.type='importmap';map.textContent=${JSON.stringify(JSON.stringify(imports))};document.head.append(map);
      })()`);
      const modules = await window.webContents.executeJavaScript(`(async () => {
        const paths=['手杀标准UI/native-runtime.js','十周年局内UI/presentation.js','如真似幻/extension.js'];
        const results=[];
        for(const path of paths)try{await import('/ui-skins/'+path);results.push({path,ok:true});}
        catch(error){results.push({path,ok:false,error:error.message});}
        return results;
      })()`);
      await writeFile(resolve(output, 'ui-modules.json'), JSON.stringify(modules, null, 2));
      if (modules.some((item: any) => !item.ok)) throw new Error(JSON.stringify(modules));
      // Seed only this disposable test profile; never touch the user's saves.
      await window.webContents.executeJavaScript(`(async () => {
        const {lib}=await import('/noname.js');
        localStorage.setItem('gplv3_noname_alerted','true');
        const db=await new Promise((resolve,reject)=>{
          const request=indexedDB.open(lib.configprefix+'data',4);
          request.onupgradeneeded=()=>{for(const name of ['video','image','audio','config','data'])if(!request.result.objectStoreNames.contains(name))request.result.createObjectStore(name,name==='video'?{keyPath:'time'}:undefined);};
          request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
        });
        await new Promise((resolve,reject)=>{const transaction=db.transaction('config','readwrite');
          for(const [key,value] of Object.entries({ui_workshop_active:'builtin-shousha-standard',new_tutorial:true,version:'1.11.6',show_splash:'always',splash_style:'shousha-standard'}))transaction.objectStore('config').put(value,key);
          transaction.oncomplete=resolve;transaction.onerror=()=>reject(transaction.error);
        });db.close();
      })()`);
      await window.loadURL(target.href);
      let state: any;
      for (let attempt = 0; attempt < 45; attempt++) {
        state = await window.webContents.executeJavaScript(`(async()=>{const {lib}=await import('/noname.js');return {text:document.body.innerText,error:lib.uiWorkshop?.error||'',loading:document.body.hasAttribute('data-shousha-loading'),ready:!!document.querySelector('.online-lobby'),skin:lib.config?.ui_workshop_active};})()`);
        if (state.error || state.ready && !state.loading) break;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      const frames = await window.webContents.executeJavaScript("Array.from(document.querySelectorAll('iframe'),frame=>({src:frame.src,visible:!!frame.getBoundingClientRect().width}))");
      await writeFile(resolve(output, 'ui-state.json'), JSON.stringify({ ...state, frames, failures }, null, 2));
      await writeFile(resolve(output, 'lobby.png'), (await window.webContents.capturePage()).toPNG());
      if (state.error || !state.ready || state.loading || state.skin !== 'builtin-shousha-standard') throw new Error(JSON.stringify(state));
      // Render real engine player nodes through the already activated skin.
      // This exercises its layout installer, not only ESM linking or login.
      await window.webContents.executeJavaScript(`(async()=>{
        const {lib,game,ui}=await import('/noname.js');
        // Normal game startup loads rank data before constructing players.
        await import('/character/rank.js');lib.rank=window.noname_character_rank;
        document.querySelectorAll('dialog,#splash,.session-entry,.online-lobby,#noname-boot-status').forEach(node=>node.remove());
        ui.window ||= ui.create.div('#window',document.body);
        ui.window.classList.remove('hidden');ui.window.style.display='';
        ui.arena?.remove();ui.arena=ui.create.div('#arena.long.single-handcard',ui.window);ui.arena.dataset.number='8';
        game.players=[];game.dead=[];lib.config.mode='identity';
        for(let i=0;i<8;i++){
          const player=ui.create.player(ui.arena);player.dataset.position=String(i);
          player.node.avatar.setBackground(['caocao','liubei','sunquan','diaochan'][i%4],'character');player.node.avatar.show();
          player.node.name.textContent='测试角色'+(i+1);game.players.push(player);
        }
        game.me=game.players[0];game.zhu=game.players[0];
      })()`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const arena = await window.webContents.executeJavaScript(`(async()=>{
        const {ui}=await import('/noname.js');
        return {compact:ui.arena.classList.contains('compact-seats'),
          frames:ui.arena.querySelectorAll('.ss-player-frame').length,
          seats:[...ui.arena.querySelectorAll(':scope > .player')].map(p=>({ready:p.dataset.seatReady,width:p.getBoundingClientRect().width})),
          style:!!document.querySelector('link[href$="/compat/compact-seats.css"]')};
      })()`);
      await writeFile(resolve(output,'arena.json'),JSON.stringify(arena,null,2));
      await writeFile(resolve(output,'arena.png'),(await window.webContents.capturePage()).toPNG());
      if (!arena.compact || !arena.style || arena.frames !== 8 || arena.seats.some((seat: any)=>seat.ready !== 'true' || seat.width <= 0)) throw new Error(JSON.stringify(arena));
    }
  } finally { clearTimeout(deadline); window.destroy(); }
  app.exit(0);
})().catch(error => { console.error(error); app.exit(1); });
