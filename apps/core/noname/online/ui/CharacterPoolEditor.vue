<template>
  <fieldset class="online-pool-editor" :disabled="disabled || loading">
    <legend>开局武将池</legend>
    <p>选择武将包，再按需禁用具体武将。引擎自带的联机禁用和模式限制仍然生效；身份场按具体武将分别分配，同名不同版本也是独立选项。</p>
    <div class="online-pool-actions">
      <button type="button" @click="replace(defaultCharacterPool())">推荐经典包</button>
      <button type="button" @click="setPacks(['standard'])">仅标准</button>
      <button type="button" @click="setPacks(ONLINE_CHARACTER_PACKS.map(pack => pack.id))">全部内置包</button>
      <button type="button" @click="importLocal(false)">导入本机启用设置</button>
      <button type="button" @click="importLocal(true)">导入旧联机设置</button>
    </div>
    <p v-if="loading" role="status">正在载入武将目录…</p>
    <p v-if="notice" role="status">{{ notice }}</p>
    <div class="online-pool-pack-list">
      <label v-for="pack in ONLINE_CHARACTER_PACKS" :key="pack.id">
        <input type="checkbox" :checked="modelValue.packs.includes(pack.id)" :disabled="modelValue.packs.length === 1 && modelValue.packs.includes(pack.id)" @change="togglePack(pack.id)" />
        {{ pack.name }} <small>{{ Object.keys(catalog[pack.id]?.character || {}).length }} 将</small>
      </label>
    </div>
    <p>已选 {{ modelValue.packs.length }} 个包 · 禁用 {{ modelValue.banned.length }} 名武将</p>
    <p :class="{ 'online-modal-error': !validation.valid }" role="status">{{ validation.message }}</p>
    <p v-if="!loading">有效选项 {{ validation.count }} / 最低 {{ validation.minimum }} · 已扣除禁将和模式限制，{{ modeId === 'identity' ? '同一武将编号去重，不合并同名版本。' : '按此模式的同名版本合并规则计数。' }}</p>
    <details>
      <summary>设置禁将 / 查看武将</summary>
      <input v-model="query" type="search" placeholder="搜索武将名或编号" aria-label="搜索武将" />
      <label class="online-pool-check"><input v-model="onlyBanned" type="checkbox" />仅显示已禁用</label>
      <button type="button" :disabled="!modelValue.banned.length" @click="replace({ packs: modelValue.packs, banned: [] })">清空禁将</button>
      <div class="online-pool-character-list">
        <label v-for="character in filtered.slice(0, 100)" :key="character.id">
          <input type="checkbox" :checked="modelValue.banned.includes(character.id)" :disabled="modelValue.banned.length >= 512 && !modelValue.banned.includes(character.id)" @change="toggleBan(character.id)" />
          <span>{{ character.name }}<small>{{ character.pack }} · {{ character.id }}</small></span>
        </label>
      </div>
      <p>勾选表示禁用。{{ filtered.length > 100 ? '结果较多，仅显示前 100 项，请输入关键词缩小范围。' : `共 ${filtered.length} 项` }}</p>
    </details>
  </fieldset>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import { lib } from "noname";
import { ONLINE_CHARACTER_PACKS, defaultCharacterPool, normalizeCharacterPool, type CharacterPool } from "@noname/online-protocol";
import { inspectCharacterPool, loadOnlineCharacterCatalog } from "../characterPool.js";
const props = defineProps<{ modelValue: CharacterPool; modeId: string; capacity: number; disabled?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: CharacterPool]; validation: [valid: boolean] }>();
const catalog = shallowRef<Record<string, any>>({}), loading = ref(true), notice = ref(''), query = ref(''), onlyBanned = ref(false);
const validation = computed(() => inspectCharacterPool(props.modelValue, props.capacity, props.modeId, catalog.value));
watch(() => validation.value.valid && !loading.value, valid => emit('validation', valid), { immediate: true });
const characters = computed(() => {
  const result = new Map<string, { id: string; name: string; pack: string }>();
  for (const pack of ONLINE_CHARACTER_PACKS) {
    if (!props.modelValue.packs.includes(pack.id)) continue;
    const data = catalog.value[pack.id];
    for (const id of Object.keys(data?.character || {})) {
      if (!result.has(id)) result.set(id, { id, name: data.translate?.[id] || lib.translate[id] || id, pack: pack.name });
    }
  }
  return [...result.values()];
});
const filtered = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  return characters.value.filter(item => (!onlyBanned.value || props.modelValue.banned.includes(item.id))
    && (!keyword || (item.name + ' ' + item.id).toLowerCase().includes(keyword)));
});
function replace(value: CharacterPool) {
  try { const pool = normalizeCharacterPool(value); notice.value = ''; emit('update:modelValue', pool); }
  catch (error: any) { notice.value = error.message; }
}
function setPacks(packs: string[]) {
  const ids = new Set(packs.flatMap(id => Object.keys(catalog.value[id]?.character || {})));
  replace({ packs, banned: props.modelValue.banned.filter(id => ids.has(id)) });
}
function togglePack(id: string) { setPacks(props.modelValue.packs.includes(id) ? props.modelValue.packs.filter(item => item !== id) : [...props.modelValue.packs, id]); }
function toggleBan(id: string) { replace({ packs: props.modelValue.packs, banned: props.modelValue.banned.includes(id) ? props.modelValue.banned.filter(item => item !== id) : [...props.modelValue.banned, id] }); }
function importLocal(online: boolean) {
  const packs = ONLINE_CHARACTER_PACKS.filter(pack => online ? !(lib.config.connect_characters || []).includes(pack.id) : lib.config.characters.includes(pack.id)).map(pack => pack.id);
  const ids = new Set(packs.flatMap(id => Object.keys(catalog.value[id]?.character || {})));
  const banned = (lib.config[`${online ? 'connect_' : ''}${props.modeId}_banned`] || []).filter((id: string) => ids.has(id));
  replace({ packs, banned });
}
onMounted(async () => {
  try {
    // The splash already imports stock packages, but local hidden packs may be absent.
    catalog.value = await loadOnlineCharacterCatalog();
    if (ONLINE_CHARACTER_PACKS.some(pack => !catalog.value[pack.id]?.character)) notice.value = '部分武将目录缺失，请更新联机客户端；开局时服务端还会检查资源。';
  } catch { notice.value = '武将目录加载失败，请更新客户端后重新进入。'; }
  finally { loading.value = false; }
});
</script>
