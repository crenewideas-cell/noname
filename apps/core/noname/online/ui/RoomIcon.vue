<template>
  <svg class="online-room-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="kind === 'crown'"><path d="m4 9 7 6 5-10 5 10 7-6-3 17H7Z" fill="currentColor" fill-opacity=".2"/><path d="M8 22h16"/><circle cx="4" cy="8" r="1.5"/><circle cx="16" cy="4" r="1.5"/><circle cx="28" cy="8" r="1.5"/></template>
    <template v-else-if="kind === 'settings'"><path d="m13 3 6 0 1 4 4 2 4-1 3 5-3 3 0 4 2 3-4 5-4-2-4 1-2 3-6-2 0-4-3-3-4-1 1-6 4-1 2-3Z" fill="currentColor" fill-opacity=".2"/><circle cx="16" cy="16" r="5"/></template>
    <template v-else-if="kind === 'chat'"><path d="M28 14c0 7-6 11-13 11l-7 4 1-6C3 21 2 17 2 13 2 6 8 3 15 3s13 4 13 11Z" fill="currentColor" fill-opacity=".16"/><circle v-for="x in [9,15,21]" :key="x" :cx="x" cy="14" r="1" fill="currentColor"/></template>
    <template v-else><circle cx="16" cy="9" r="5" fill="currentColor" fill-opacity=".2"/><path d="M7 28v-4c0-6 3-9 9-9s9 3 9 9v4Z" fill="currentColor" fill-opacity=".2"/><path d="M7 8a4 4 0 0 0 0 8M4 19c-2 2-2 5-2 8h3M25 8a4 4 0 0 1 0 8m3 3c2 2 2 5 2 8h-3"/></template>
  </svg>
</template>
<script setup lang="ts">
defineProps<{kind: 'players' | 'friends' | 'settings' | 'chat' | 'crown'}>();
</script>
