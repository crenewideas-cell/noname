<template>
  <section class="online-rule-fields">
    <h3>开局与操作设置</h3><div class="online-rule-grid">
    <template v-if="modeId === 'identity'">
      <label>开局手气卡<select :value="modelValue.mulligan" :disabled="disabled" @change="set('mulligan', Number(($event.target as HTMLSelectElement).value))"><option :value="0">关闭</option><option :value="1">每人 1 次（默认）</option><option :value="2">每人 2 次</option></select></label>
      <label>主公自由点将<select :value="String(modelValue.freeChoose)" :disabled="disabled" @change="set('freeChoose', ($event.target as HTMLSelectElement).value === 'true')"><option value="false">关闭</option><option value="true">开启</option></select></label>
      <label>武将池分配<select :value="modelValue.characterPoolMode" :disabled="disabled" @change="set('characterPoolMode', ($event.target as HTMLSelectElement).value)"><option value="shared">共享抢选池</option><option value="partitioned">均分独立池</option></select></label>
      <label>换候选次数<select :value="modelValue.characterRerolls" :disabled="disabled" @change="set('characterRerolls', Number(($event.target as HTMLSelectElement).value))"><option v-for="times in [0, 1, 2, 3]" :key="times" :value="times">{{ times ? `每人 ${times} 次` : '关闭' }}</option></select></label>
      <label>开局准备时限<select :value="modelValue.openingTimeout" :disabled="disabled" @change="set('openingTimeout', Number(($event.target as HTMLSelectElement).value))"><option v-for="seconds in [30, 60, 90]" :key="seconds" :value="seconds">{{ seconds }} 秒</option></select></label>
    </template>
    <label>每次操作时限<select :value="modelValue.chooseTimeout" :disabled="disabled" @change="set('chooseTimeout', Number(($event.target as HTMLSelectElement).value))"><option v-for="seconds in [15, 30, 60, 90]" :key="seconds" :value="seconds">{{ seconds }} 秒</option></select></label>
    </div><details class="online-rule-help"><summary>规则说明</summary><ul><li v-if="modeId === 'identity'">手气卡用于重换起手牌，不消耗道具；超时保留当前手牌。</li><li v-if="modeId === 'identity'">主公先选，其余玩家同时选将。自由点将开启后，主公可浏览全部合法武将；关闭时保留专属候选。共享池先确认者获得武将；独立池随机均分候选。</li><li v-if="modeId === 'identity'">选将、换牌阶段分别计时，重连与换候选不重置时限。</li><li>操作超时后转为托管，可在对局中关闭托管。</li></ul></details>
  </section>
</template>
<script setup lang="ts">
import type { RoomRules } from "@noname/online-protocol";
const props = defineProps<{ modelValue: Required<RoomRules>; modeId: string; disabled?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: Required<RoomRules>] }>();
function set(key: keyof RoomRules, value: number | boolean | string) { emit('update:modelValue', { ...props.modelValue, [key]: value } as Required<RoomRules>); }
</script>
