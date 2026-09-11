<template>
  <section class="online-panel online-social">
    <header class="online-list-heading"><h2>同道好友</h2><button @click="refresh" :disabled="busy">刷新</button></header>
    <p v-if="error" class="online-modal-error" role="alert">{{ error }}</p>
    <p v-if="notice" role="status">{{ notice }}</p>
    <form class="online-chat-form" @submit.prevent="find"><input v-model="code" maxlength="12" placeholder="输入 12 位玩家码" aria-label="搜索玩家码" /><button :disabled="busy || code.length !== 12">查找</button></form>
    <article v-if="found" class="social-person"><div><strong>{{ found.nickname }}</strong><small>{{ found.code }}</small></div><button :disabled="busy" @click="act('friend.request', found.id)">加为好友</button></article>
    <h3 v-if="invitations.length">房间邀请</h3>
    <article v-for="invite in invitations" :key="invite.id" class="social-invitation"><strong>{{ invite.nickname }} 邀你入席</strong><small>有效至 {{ new Date(invite.expiresAt).toLocaleTimeString() }}</small><div><button :disabled="busy" @click="selectedInvite = invite; invitePassword = ''; inviteDialog?.showModal()">查看邀请</button><button :disabled="busy" @click="respond(invite.id, false)">拒绝</button></div></article>
    <h3 v-if="pending.length">好友申请</h3>
    <article v-for="friend in pending" :key="friend.id" class="social-person"><div><strong>{{ friend.nickname }}</strong><small>{{ friend.incoming ? '希望与你成为好友' : '等待对方同意' }}</small></div><div><button v-if="friend.incoming" :disabled="busy" @click="act('friend.accept', friend.id)">同意</button><button :disabled="busy" @click="act(friend.incoming ? 'friend.reject' : 'friend.cancel', friend.id)">{{ friend.incoming ? '拒绝' : '撤回' }}</button></div></article>
    <div class="social-friends"><p v-if="!friends.length">还没有好友。通过玩家码结识同道，或将自己的玩家码分享给朋友。</p><article v-for="friend in friends" :key="friend.id" class="social-person"><div><strong>{{ friend.nickname }}</strong><small :class="{ 'friend-online': friend.online }">● {{ friend.online ? '在线' : '离线' }}</small></div><div class="social-actions"><button :disabled="busy || !friend.online || s.room?.state !== 'waiting'" @click="invite(friend.id)">邀入房间</button><details><summary>更多</summary><button @click="act('friend.remove', friend.id)">删除好友</button><button @click="act('friend.block', friend.id)">屏蔽</button></details></div></article></div>
    <details v-if="s.social.blocked.length" class="social-blocked"><summary>屏蔽名单（{{ s.social.blocked.length }}）</summary><article v-for="friend in s.social.blocked" :key="friend.id" class="social-person"><span>{{ friend.nickname }}</span><button @click="act('friend.unblock', friend.id)">解除屏蔽</button></article></details>
    <dialog ref="inviteDialog" class="online-dialog"><form @submit.prevent="respond(selectedInvite.id, true)"><header><h2>好友房间邀请</h2><button type="button" @click="inviteDialog?.close()">×</button></header><p>{{ selectedInvite?.nickname }} 希望与你对战。</p><label>房间密码（如有）<input v-model="invitePassword" type="password" maxlength="64" /></label><p>接受前请先离开当前房间或取消匹配。邀请过期、满房或对局已开始时不会切换当前页面。</p><p v-if="error" class="online-modal-error">{{ error }}</p><button class="online-primary" :disabled="busy">接受并加入房间</button></form></dialog>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import { onlineState as s, api, command, loadSocial } from "../client";
const emit = defineEmits<{ joined: [modeId: string] }>();
const code = ref(''), found = ref<any>(null), error = ref(''), notice = ref(''), busy = ref(false), selectedInvite = ref<any>(null), invitePassword = ref('');
const inviteDialog = ref<HTMLDialogElement>();
const friends = computed(() => s.social.friends.filter((f: any) => f.state === 'accepted').sort((a: any, b: any) => Number(b.online) - Number(a.online)));
const pending = computed(() => s.social.friends.filter((f: any) => f.state === 'pending'));
const now = ref(Date.now());
const expiryTimer = setInterval(() => { now.value = Date.now(); }, 1000);
onBeforeUnmount(() => { clearInterval(expiryTimer); inviteDialog.value?.close(); });
const invitations = computed(() => s.social.invites.filter((invite: any) => new Date(invite.expiresAt).getTime() > now.value));
async function run(fn: () => Promise<any>) { if (busy.value) return; busy.value = true; error.value = ''; notice.value = ''; try { await fn(); } catch (e: any) { error.value = e.message; } finally { busy.value = false; } }
const refresh = () => run(loadSocial);
const find = () => run(async () => { found.value = (await api('/players?' + new URLSearchParams({ code: code.value }))).account; if (!found.value) notice.value = '没有找到可添加的玩家'; });
const act = (type: string, accountId: string) => run(async () => { await command(type, { accountId }); await loadSocial(); found.value = null; });
const invite = (accountId: string) => run(async () => { await command('invite.send', { accountId }); notice.value = '邀请已发送，两分钟内有效'; });
const respond = (inviteId: string, accept: boolean) => run(async () => {
  const room = await command(accept ? 'invite.accept' : 'invite.reject', { inviteId, password: invitePassword.value });
  inviteDialog.value?.close(); if (accept) { s.room = room; s.chat = []; emit('joined', room.modeId); }
  await loadSocial();
});
</script>
