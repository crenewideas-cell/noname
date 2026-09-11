<template>
  <section class="online-panel online-match">
    <p class="online-eyebrow">同台较量 · 实力交锋</p><h2>快速匹配</h2>
    <p v-if="s.match.state === 'idle'">单人加入同玩法队列，人数齐备后确认入席。</p>
    <label v-if="s.match.state === 'idle'">对局人数<select v-model.number="capacity"><option v-for="n in numbers" :key="n" :value="n">{{ n }} 人</option></select></label>
    <template v-if="s.match.state === 'queued'"><div class="match-orbit"><span class="online-spinner"></span><strong>{{ elapsed }}</strong></div><p>{{ s.match.reason || '等待其他玩家' }} · {{ s.match.capacity }} 人场</p><small>取消后将退出队列，不会继续分配。</small></template>
    <template v-if="s.match.state === 'confirming'"><h3>已找到对局</h3><div class="match-countdown">{{ remaining }}<small>秒</small></div><p>{{ s.match.acceptedCount }} / {{ s.match.capacity }} 人已确认</p><button class="online-primary" :disabled="busy || s.match.accepted" @click="act('match.accept', { offerId: s.match.offerId })">{{ s.match.accepted ? '等待其他玩家确认' : '确认入席' }}</button></template>
    <button v-if="s.match.state === 'idle'" class="online-primary" :disabled="busy || s.maintenance || !!s.room || s.status !== 'connected'" @click="join">开始匹配</button>
    <button v-else :disabled="busy" @click="act('match.cancel')">{{ s.match.state === 'confirming' ? '拒绝并退出' : '取消匹配' }}</button>
    <p v-if="error" class="online-modal-error" role="alert">{{ error }}</p><p v-if="notice" role="status">{{ notice }}</p>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from "vue";
import { modePreset } from "@noname/online-protocol";
import { onlineState as s, command, onOnlineEvent } from "../client";
const props = defineProps<{ modeId: string }>();
const numbers = computed(() => modePreset(props.modeId)?.players || []);
const capacity = ref<number>(numbers.value[0] || 4), busy = ref(false), error = ref(''), notice = ref(''), now = ref(Date.now());
watch(() => props.modeId, () => { capacity.value = numbers.value[0] || 4; });
const timer = setInterval(() => { now.value = Date.now(); }, 500);
const elapsed = computed(() => { const seconds = Math.max(0, Math.floor((now.value - (s.match.since || now.value)) / 1000)); return Math.floor(seconds / 60).toString().padStart(2,'0') + ':' + (seconds % 60).toString().padStart(2,'0'); });
const remaining = computed(() => Math.max(0, Math.ceil((s.match.deadline - now.value) / 1000)));
async function act(type: string, payload = {}) { if (busy.value) return; busy.value = true; error.value = ''; try { s.match = await command(type, payload); } catch (e: any) { error.value = e.message; } finally { busy.value = false; } }
const join = () => act('match.join', { modeId: props.modeId, capacity: capacity.value, preset: modePreset(props.modeId)?.preset, region: s.region });
const unsubscribe = onOnlineEvent((type, payload) => { if (type === 'match.notice') notice.value = payload.message; });
onBeforeUnmount(() => { clearInterval(timer); unsubscribe(); });
</script>
