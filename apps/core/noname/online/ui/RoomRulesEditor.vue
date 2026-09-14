<template>
  <section class="online-rule-fields">
    <h3>开局与操作设置</h3>
    <template v-if="modeId === 'identity'">
      <label>开局手气卡<select :value="modelValue.mulligan" :disabled="disabled" @change="set('mulligan', Number(($event.target as HTMLSelectElement).value))"><option :value="0">关闭</option><option :value="1">每人 1 次（默认）</option><option :value="2">每人 2 次</option></select></label>
      <p>发完起手牌后可自愿整手换牌；不消耗道具。保留或超时即结束换牌。</p>
      <label>开启点将<select :value="String(modelValue.freeChoose)" :disabled="disabled" @change="set('freeChoose', ($event.target as HTMLSelectElement).value === 'true')"><option value="false">关闭 · 随机候选武将</option><option value="true">开启 · 从房间武将池自由选将</option></select></label>
      <p>点将按主公起顺时针依次选择，已选武将及其同名版本不再可选；禁将仍生效。</p>
    </template>
    <label>每次操作时限<select :value="modelValue.chooseTimeout" :disabled="disabled" @change="set('chooseTimeout', Number(($event.target as HTMLSelectElement).value))"><option v-for="seconds in [15, 30, 60, 90]" :key="seconds" :value="seconds">{{ seconds }} 秒</option></select></label>
    <p>超时转为托管，可在对局中关闭托管恢复操作。</p>
  </section>
</template>
<script setup lang="ts">
import type { RoomRules } from "@noname/online-protocol";
const props = defineProps<{ modelValue: RoomRules; modeId: string; disabled?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: RoomRules] }>();
function set(key: keyof RoomRules, value: number | boolean) { emit('update:modelValue', { ...props.modelValue, [key]: value } as RoomRules); }
</script>
