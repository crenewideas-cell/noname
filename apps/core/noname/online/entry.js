import { createApp, h, ref } from "vue";
import { game, lib } from "noname";
import { disconnectPlatform, prepareRoomNavigation } from "./client";
import { onlineEntryFragment } from "./appearance.js";
import "./ui/online.css";

// Shared room entry for canvas-based lobbies. The server still owns real
// matchmaking; the themed lobby's local matching animation is not used here.
export async function openOnlineRooms(mode = "identity") {
 if (game.openOnlineLobby) {
  await game.openOnlineLobby(onlineEntryFragment(mode));
  return {close() {}, closed:Promise.resolve()};
 }
 const origin = import.meta.env.DEV ? location.origin : import.meta.env.VITE_ONLINE_ORIGIN;
 if (new URL("/index.html", origin || location.origin).origin !== location.origin) {
  throw new Error("请使用下载的完整客户端进入联机。");
 }
 const {default: OnlineLobby} = await import("./ui/OnlineLobby.vue");
 const host = document.createElement("section");
 host.className = "session-entry online-visible";
 Object.assign(host.style, {position:"fixed", inset:"0", zIndex:"10010", overflow:"auto"});
 document.body.append(host);
 const selected = ref(mode), error = ref("");
 let entering = false, disposed = false, resolveClosed;
 const closed = new Promise(resolve => { resolveClosed = resolve; });
 const close = () => {
  if (disposed) return;
  disposed = true; app.unmount(); host.remove(); resolveClosed();
 };
 const play = async () => {
  if (entering || disposed) return;
  entering = true;
  try {
   const assignment = JSON.parse(sessionStorage.getItem("noname_online_game") || "null");
   await game.promises.saveConfig("mode", "connect");
   await game.promises.saveConfig("sessionType", "online");
   await prepareRoomNavigation("game", assignment?.instanceId);
   localStorage.setItem(lib.configprefix + "directstart", "true");
   window.onbeforeunload = null;
   game.reload();
  } catch (reason) { entering = false; error.value = reason.message || "无法进入对局，请重试。"; }
 };
 const app = createApp({setup: () => () => h("section", [
  error.value ? h("p", {class:"online-feedback error", role:"alert"}, error.value) : null,
  h(OnlineLobby, {modeId:selected.value, onMode:mode => { selected.value = mode; }, onPlay:play,
   onBack:() => { disconnectPlatform(); close(); }})
 ])});
 app.mount(host);
 return {close, closed};
}
