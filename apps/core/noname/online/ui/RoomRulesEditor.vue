<template>
  <section class="online-rule-fields">
    <h3>开局与操作设置</h3>
    <template v-if="modeId === 'identity'">
      <label>开局手气卡<select :value="modelValue.mulligan" :disabled="disabled" @change="set('mulligan', Number(($event.target as HTMLSelectElement).value))"><option :value="0">关闭</option><option :value="1">每人 1 次（默认）</option><option :value="2">每人 2 次</option></select></label>
      <p>发完起手牌后自动打开换牌面板，不消耗道具。可在时限内连续换牌，确认保留或超时后结束。</p>
      <label>主公自由点将<select :value="String(modelValue.freeChoose)" :disabled="disabled" @change="set('freeChoose', ($event.target as HTMLSelectElement).value === 'true')"><option value="false">关闭 · 保留主公专属候选规则</option><option value="true">开启 · 主公也可浏览全部合法武将</option></select></label>
      <p>主公先选，随后其余玩家同时选将。确认后锁定；所有人完成前，不公开武将与玩家的对应关系。</p>
      <label>武将池分配<select :value="modelValue.characterPoolMode" :disabled="disabled" @change="set('characterPoolMode', ($event.target as HTMLSelectElement).value)"><option value="shared">共享抢选池 · 先确认者获得</option><option value="partitioned">均分独立池 · 每人拥有不同的可选武将</option></select></label>
      <p>所有已勾选扩展包的合法武将合为一池，主公选后移除具体武将。独立池将剩余全部武将打乱后近似均分，每人的组合不同，不区分扩展包或家族；共享池让每个人选择全部剩余武将，先确认者获得。其余玩家默认打开完整的个人池或共享池，不受主公点将开关影响。</p>
      <label>换候选次数<select :value="modelValue.characterRerolls" :disabled="disabled" @change="set('characterRerolls', Number(($event.target as HTMLSelectElement).value))"><option v-for="times in [0, 1, 2, 3]" :key="times" :value="times">{{ times ? `每人 ${times} 次` : '关闭' }}</option></select></label>
      <label>开局准备时限<select :value="modelValue.openingTimeout" :disabled="disabled" @change="set('openingTimeout', Number(($event.target as HTMLSelectElement).value))"><option v-for="seconds in [30, 60, 90]" :key="seconds" :value="seconds">{{ seconds }} 秒</option></select></label>
      <p>主公选将、其他玩家同时选将、全员换牌三个阶段分别计时。换候选、点将、换牌与重新连接都不会重置时限；超时自动选择剩余武将或保留手牌。</p>
    </template>
    <label>每次操作时限<select :value="modelValue.chooseTimeout" :disabled="disabled" @change="set('chooseTimeout', Number(($event.target as HTMLSelectElement).value))"><option v-for="seconds in [15, 30, 60, 90]" :key="seconds" :value="seconds">{{ seconds }} 秒</option></select></label>
    <p>超时转为托管，可在对局中关闭托管恢复操作。</p>
  </section>
</template>
<script setup lang="ts">
import type { RoomRules } from "@noname/online-protocol";
const props = defineProps<{ modelValue: Required<RoomRules>; modeId: string; disabled?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: Required<RoomRules>] }>();
function set(key: keyof RoomRules, value: number | boolean | string) { emit('update:modelValue', { ...props.modelValue, [key]: value } as Required<RoomRules>); }
</script>
