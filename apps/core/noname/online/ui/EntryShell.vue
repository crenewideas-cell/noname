<template>
  <section class="session-entry" :class="{ 'online-visible': activeMode, 'classic-entry': !shousha }">
    <div class="session-bar">
      <div class="session-switch" role="group" aria-label="对局方式">
        <button :class="{ active: sessionType === 'offline' }" :aria-pressed="sessionType === 'offline'" @click="selectType('offline')">单机</button>
        <button :class="{ active: sessionType === 'online' }" :aria-pressed="sessionType === 'online'" @click="selectType('online')">联机 <i></i></button>
      </div>
      <span class="session-hint">{{ sessionType === 'online' ? '选择玩法，进入在线房间' : '随时开局，独享策略时光' }}</span>
      <button class="session-exit" @click="exit">退出</button>
    </div>
    <OnlineLobby v-if="activeMode" :mode-id="activeMode" @back="activeMode = ''" @play="play" @mode="activeMode = $event" />
    <component v-else :is="shousha ? ShoushaSplash : OnloadSplash" :handle="handle" :click="choose" />
    <div v-if="notice" class="entry-notice" role="status">{{ notice }}<button @click="notice = ''">知道了</button></div>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { lib, game } from "noname";
import ShoushaSplash from "../../init/onload/ShoushaSplash.vue";
import OnloadSplash from "../../init/onload/OnloadSplash.vue";
import OnlineLobby from "./OnlineLobby.vue";
import { disconnectPlatform, onlineState } from "../client";
import { openGameNavigation } from "../../ui/gameNavigation.js";
import "./online.css";
const props = defineProps<{ shousha: boolean; handle: (mode: string) => string; click: (mode: string, node: HTMLElement) => void }>();
const sessionType = ref(lib.config.sessionType || (lib.config.mode === "connect" ? "online" : "offline"));
const activeMode = ref(sessionStorage.getItem("noname_online_return") || "");
sessionStorage.removeItem("noname_online_return");
const notice = ref("");
function selectType(type: string) {
  if (onlineState.room || onlineState.match.state !== 'idle') { notice.value = "请先离开当前房间或取消匹配，再切换对局方式。"; return; }
  sessionType.value = type; game.saveConfig("sessionType", type);
  if (type === "offline") { activeMode.value = ""; disconnectPlatform(); }
}
async function choose(mode: string, node: HTMLElement) {
  if (sessionType.value === "offline") { props.click(mode, node); return; }
  try {
    const configuredOrigin = import.meta.env.DEV ? location.origin : import.meta.env.VITE_ONLINE_ORIGIN;
    const nativeEntry = (game as any).openOnlineLobby;
    // Native launchers use their bundled manifest and intercept static requests
    // locally; only API/WebSocket traffic reaches the configured server.
    if (nativeEntry) { await nativeEntry("#online=" + encodeURIComponent(mode)); return; }
    const target = new URL("/index.html", configuredOrigin || location.origin);
    if (target.origin !== location.origin) throw new Error("请使用下载的完整客户端进入联机。");
  } catch (error: any) { notice.value = error.message; return; }
  activeMode.value = mode;
}
async function play() {
  // Start a clean client runtime, without any locally enabled extension hooks.
  try {
    await game.promises.saveConfig("mode", "connect");
    await game.promises.saveConfig("sessionType", "online");
    localStorage.setItem(lib.configprefix + "directstart", "true");
    window.onbeforeunload = null;
    game.reload();
  } catch { notice.value = "无法保存对局入口，请检查浏览器存储是否可用。"; }
}
function exit() { openGameNavigation(); }
</script>
