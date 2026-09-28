<template>
  <main class="online-lobby" :class="{ 'online-login-scene': !s.account, 'online-room-scene': !!s.account }">
    <header class="online-heading">
      <div class="online-heading-title">
        <Teleport :to="navigationTarget || 'body'" :disabled="!navigationTarget">
          <a v-if="!s.account && !navigationTarget" class="online-back-link" href="#modes" @click.prevent="back">‹ 返回玩法</a>
          <button v-else type="button" class="online-back" :disabled="!!s.account && (busy || s.room?.state === 'starting')" @click="s.room ? leaveRoom() : back()">{{ s.room ? '返回大厅' : '返回玩法' }}</button>
        </Teleport>
        <div><p v-if="!s.account" class="online-eyebrow">群雄聚首 · 公网对战</p><h1>{{ modeName }}大厅</h1><p>寻一席知己，共决天下。</p></div>
      </div>
      <div class="online-profile" :class="{ 'online-profile-info': navigationTarget }">
        <span class="online-connection" :data-state="s.status">● {{ statusLabel }}</span>
        <template v-if="s.account">
          <strong>{{ s.account.nickname }}</strong><small>玩家码 {{ s.account.code }}</small>
          <Teleport :to="navigationTarget || 'body'" :disabled="!navigationTarget">
            <button v-if="s.room" type="button" :disabled="busy || s.room.state === 'starting'" @click="leaveRoom">退出房间</button>
            <button v-else type="button" @click="run(logout)">退出账号</button>
          </Teleport>
        </template>
      </div>
    </header>
    <div v-if="!s.account && !loading && !error && !s.error && s.status !== 'disconnected'" class="online-login-banner"><span>请先登录</span><button :disabled="busy || loading" @click="retry">重新连接</button></div>
    <div v-if="error" class="online-feedback error" role="alert">{{ error }}<button @click="retry">重试</button><button @click="error = ''">×</button></div>
    <div v-if="s.status === 'disconnected'" class="online-feedback" role="status">与服务器的连接已中断。<button @click="retry">重新连接</button></div>
    <div v-if="s.error" class="online-feedback error" role="alert">{{ s.error }}<button @click="retry">重新连接</button></div>
    <div v-if="s.maintenance" class="online-feedback maintenance" role="status">服务器正在维护，暂不接受新房间、新匹配或再来一局；当前进行中的对局可以继续。</div>
    <div v-if="s.reconnectAttempt" class="online-feedback" role="status">正在自动重连 · 第 {{ s.reconnectAttempt }} 次尝试</div>
    <div v-if="s.recovery" class="online-feedback recovery"><strong>请保存一次性账号恢复码</strong><code>{{ s.recovery }}</code><span>忘记密码时使用，使用后会更换。不要分享给他人。</span><button @click="s.recovery = ''">我已保存</button></div>
    <section v-if="loading" class="online-loading" role="status"><span class="online-spinner"></span>正在载入联机大厅…</section>
    <section v-else-if="!preset" class="online-empty"><h2>此玩法暂未开放联机</h2><p>当前开放标准身份与标准斗地主房间。{{ modeName }}的单机玩法仍可正常进入。</p><button @click="back">返回选择玩法</button></section>
    <section v-else-if="!s.account" class="online-auth online-panel">
      <div class="online-auth-art"><div class="online-auth-caption"><h2>群英会</h2><p>一席之间，风云再起</p></div></div>
      <form @submit.prevent="authenticate">
        <h2>{{ authKind === 'register' ? '创建你的身份' : authKind === 'recover' ? '找回账号' : '欢迎归来' }}</h2>
        <p>登录后创建房间，和真实玩家开启联机对局。</p>
        <label>用户名<input v-model="username" required minlength="3" maxlength="32" autocomplete="username" placeholder="字母、数字或下划线" /></label>
        <label v-if="authKind === 'register'">游戏昵称<input v-model="nickname" required maxlength="12" placeholder="你的江湖名号" /></label>
        <label v-if="authKind === 'recover'">恢复码<input v-model="recoveryCode" required autocomplete="off" /></label>
        <label>{{ authKind === 'recover' ? '新密码' : '密码' }}<input v-model="password" type="password" required minlength="10" maxlength="128" :autocomplete="authKind === 'login' ? 'current-password' : 'new-password'" placeholder="至少 10 个字符" /></label>
        <button class="online-primary" :disabled="busy">{{ busy ? '正在处理…' : authKind === 'register' ? '注册并进入' : authKind === 'recover' ? '重置密码' : '登录大厅' }}</button>
        <div class="online-auth-links"><a href="#account" @click.prevent="authKind = authKind === 'login' ? 'register' : 'login'">{{ authKind === 'login' ? '创建账号' : '已有账号，去登录' }}</a><a href="#recover" @click.prevent="authKind = 'recover'">忘记密码</a></div>
      </form>
    </section>
    <template v-else>
      <section v-if="s.room" class="online-room online-panel">
        <div v-if="s.room.state === 'finished'" class="online-feedback" role="status">本局已结束，无法再恢复对局。{{ isOwner ? '点击“再来一局”，全员重新准备后即可开始。' : '等待房主点击“再来一局”，然后重新准备。' }}</div>
        <div v-if="['starting','in_game'].includes(s.room.state) && !myMember?.abandoned" class="online-feedback"><span>{{ s.room.state === 'in_game' ? '发现未结束的对局，可恢复你的手牌、身份和回合。' : s.room.instanceReady ? '托管实例已就绪，请进入对局完成入席。' : '正在分配对局，请保持在线。' }}</span><button v-if="s.room.instanceId && s.room.instanceReady" class="online-primary" @click="resumeGame">{{ s.room.state === 'starting' ? '进入对局' : '恢复对局' }}</button></div>
        <div v-if="myMember?.abandoned" class="online-feedback">席位保留时间已过，本局由服务器继续托管。可等待结算或离开房间。</div>
        <section class="online-room-players room-surface">
        <header class="online-players-heading">
          <div><h2><RoomIcon kind="players" />玩家列表<small class="online-room-name">{{ s.room.name }}</small></h2><p>房间码 {{ s.room.code }} · {{ ruleName }} · {{ s.room.capacity }} 人 <span class="online-room-state">{{ roomState[s.room.state] }}</span></p></div>
          <div class="online-room-actions" role="group" aria-label="房间操作">
            <button v-if="s.room.state === 'waiting'" :class="{ 'online-primary': !isOwner }" :disabled="s.maintenance || busy" @click="ready">{{ myReady ? '取消准备' : '准备就绪' }}</button>
            <button v-if="isOwner && s.room.state === 'waiting'" class="online-primary" :disabled="s.maintenance || busy || !canStart" @click="start">开始对局</button>
            <button v-if="isOwner && s.room.state === 'waiting' && emptySeats.length" :disabled="busy" @click="setAI(emptySeats, true)">AI 补满空位</button>
            <button v-if="isOwner && s.room.state === 'finished'" class="online-primary" :disabled="s.maintenance || busy" @click="run(() => roomCommand('room.rematch'))">再来一局</button>
            <button :disabled="busy || s.room.state === 'starting'" @click="leaveRoom">离开房间</button>
          </div>
        </header>
        <div class="online-seats" :class="{ 'five-seats': s.room.capacity === 5, 'three-seats': s.room.capacity === 3 }">
          <article v-for="seat in s.room.capacity" :key="seat" :class="{ occupied: memberAt(seat - 1), owner: memberAt(seat - 1)?.id === s.room.ownerId, ready: memberAt(seat - 1)?.ready }">
            <template v-if="memberAt(seat - 1)">
              <RoomIcon v-if="memberAt(seat - 1)?.id === s.room.ownerId" kind="crown" class="online-seat-owner" /><img :src="avatar" alt="" /><strong>{{ memberAt(seat - 1)?.nickname }}</strong>
              <small>{{ memberAt(seat - 1)?.id === s.room.ownerId ? '房主 · ' : '' }}{{ memberAt(seat - 1)?.isAI ? 'AI · 自动参战' : !memberAt(seat - 1)?.online ? '已离线' : memberAt(seat - 1)?.ready ? '已准备' : '等待准备' }}</small>
              <button v-if="isOwner && s.room.state === 'waiting' && memberAt(seat - 1)?.isAI" class="seat-kick" :disabled="busy" :aria-label="`移除 ${seat} 号位 AI`" @click="setAI([seat - 1], false)">移除 AI</button>
            </template>
            <template v-else>
              <span class="seat-plus">＋</span><strong>虚位以待</strong><small>等待玩家加入</small>
              <button v-if="isOwner && s.room.state === 'waiting'" :disabled="busy" :aria-label="`为 ${seat} 号位添加 AI`" @click="setAI([seat - 1], true)">添加 AI</button>
            </template>
            <b>{{ seat }}</b>
          </article>
        </div>
        </section>
        <div class="online-room-workspace">
        <section class="online-room-config room-surface"><h3><RoomIcon kind="settings" />对局设置</h3>
        <dl class="online-rule-facts"><div><dt>玩法</dt><dd>{{ ruleName }} · 标准卡牌</dd></div><div><dt>武将池</dt><dd>{{ characterPoolLabel(s.room.characterPool) }}</dd></div><div v-for="fact in roomRuleFacts" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div></dl>
        <details v-if="s.room.characterPool?.banned.length"><summary>查看禁将</summary><p>{{ s.room.characterPool.banned.map(id => get.translation(id)).join('、') }}</p></details>
        <details v-if="isOwner && s.room.state === 'waiting'" class="online-pool-settings"><summary>房间名称与成员管理</summary><div class="online-room-management"><form @submit.prevent="renameRoom"><input v-model="newName" maxlength="32" placeholder="新的房间名称" aria-label="新的房间名称" /><button :disabled="busy || !newName.trim()">修改房名</button></form><button v-for="member in s.room.members.filter(m => !m.isAI && m.id !== s.account?.id)" :key="member.id" :disabled="busy" @click="run(() => roomCommand('room.kick', { accountId: member.id }))">移出 {{ member.nickname }}</button></div></details>
        <details v-if="isOwner && s.room.state === 'waiting'" class="online-pool-settings" @toggle="togglePoolEditor">
          <summary>修改武将池</summary>
          <CharacterPoolEditor v-if="poolEditorOpen" v-model="editPool" :capacity="s.room.capacity" @validation="editPoolValid = $event" :mode-id="s.room.modeId" :disabled="busy" />
          <p>保存后所有玩家需要重新准备。</p>
          <button class="online-primary" :disabled="busy || !poolChanged || !editPoolValid" @click="savePool">保存武将池</button>
          <button :disabled="busy" @click="editPool = normalizeCharacterPool(s.room.characterPool)">还原当前规则</button>
        </details>
        <details v-if="isOwner && s.room.state === 'waiting'" class="online-pool-settings">
          <summary>修改开局与操作设置</summary>
          <RoomRulesEditor v-model="editRules" :mode-id="s.room.modeId" :disabled="busy" />
          <p>保存后所有真人玩家需重新准备，已准备的玩家不会按旧规则直接开局。</p>
          <button class="online-primary" :disabled="busy || !rulesChanged" @click="saveRules">保存对局设置</button>
          <button :disabled="busy" @click="editRules = normalizeRoomRules(s.room.rules, s.room.modeId)">还原当前设置</button>
        </details>
        </section>
        <section class="online-room-conversation room-surface"><header class="online-conversation-heading"><h3><RoomIcon kind="chat" />房间消息</h3><button @click="copyCode">{{ codeCopied ? '已复制' : '复制房间码' }}</button></header><p class="online-hint">{{ s.room.visibility === 'public' ? '公开房间' : '邀请房间' }} · 全员入席并准备后，由房主开始。</p><div class="online-chat" aria-live="polite"><p v-if="!s.chat.length" class="online-chat-empty">还没有消息，邀请好友一起入席吧。</p><p v-for="message in s.chat" :key="message.id"><strong>{{ message.nickname }}</strong> {{ message.text }}</p></div><form class="online-chat-form" @submit.prevent="chat"><input v-model="chatText" maxlength="300" aria-label="房间消息" placeholder="说点什么…" /><button :disabled="busy || !chatText.trim()">发送</button></form><small>消息仅在本次会话保留。</small></section>
        </div>
      </section>
      <div v-else class="online-body">
        <section class="online-room-browser room-surface">
          <form class="online-search online-panel" @submit.prevent="refresh"><input v-model="query" maxlength="64" placeholder="搜索房间名称 / 房间码" aria-label="搜索房间" /><button :disabled="busy">搜索</button><select v-model="filterState" @change="refresh" aria-label="房间状态"><option value="all">全部状态</option><option value="waiting">等待加入</option><option value="in_game">对局中</option></select><select v-model="capacity" @change="refresh" aria-label="人数"><option value="">全部人数</option><option v-for="n in playerCounts" :key="n" :value="String(n)">{{ n }} 人</option></select></form>
          <div class="online-list-heading"><h2><RoomIcon kind="players" />正在招募</h2><span>{{ s.total }} 个房间</span><button @click="refresh">刷新</button></div>
          <section v-if="listLoading" class="online-loading">正在查找房间…</section>
          <section v-else-if="listError" class="online-empty"><h3>房间列表加载失败</h3><p>{{ listError }}</p><button @click="refresh">重新加载</button></section>
          <section v-else-if="!s.rooms.length" class="online-empty"><h3>还没有符合条件的房间</h3><p>创建一个房间，邀朋友来切磋。</p><button class="online-primary" :disabled="s.maintenance" @click="showCreate = true">创建房间</button></section>
          <div v-else class="online-room-grid"><article v-for="room in s.rooms" :key="room.id" class="online-room-card"><div class="room-card-top"><span>{{ room.locked ? '密码房' : '公开房' }}</span><b>{{ roomState[room.state] }}</b></div><h3>{{ room.name }}</h3><p>{{ ruleName }} · {{ room.capacity }} 人场</p><p class="online-pool-summary">{{ characterPoolLabel(room.characterPool) }}</p><details class="online-room-rule-summary"><summary>查看对局规则</summary><p>{{ describeRules(room) }}</p></details><div class="room-portraits"><span v-for="n in room.capacity" :key="n" :class="{ filled: n <= room.members.length }"></span></div><footer><span>{{ room.members.length }}/{{ room.capacity }} 席 · {{ room.code }}</span><button :disabled="s.maintenance || busy || !['waiting', 'finished'].includes(room.state) || room.members.length >= room.capacity && !room.members.some(m => m.id === s.account?.id)" @click="openJoin(room)">{{ room.members.some(m => m.id === s.account?.id) ? '返回房间' : '加入' }}</button></footer></article></div>
          <div class="online-pagination"><button :disabled="page <= 1" @click="page--; refresh()">上一页</button><span>第 {{ page }} 页</span><button :disabled="page * 12 >= s.total" @click="page++; refresh()">下一页</button></div>
        </section>
        <aside class="online-sidebar"><section class="online-panel online-create-card room-surface"><p class="online-eyebrow">召集同道</p><h2>开一局自己的房间</h2><p>选择人数与可见性，等待玩家入席。</p><button class="online-primary" :disabled="s.maintenance" @click="showCreate = true">创建房间</button><button :disabled="s.maintenance" @click="showJoin = true">输入房间码</button></section><MatchPanel :mode-id="modeId" /></aside>
      </div>
      <SocialPanel @joined="mode => emit('mode', mode)" />
    </template>
    <dialog ref="createDialog" class="online-dialog online-pool-dialog" @close="showCreate = false"><form @submit.prevent="createRoom"><header><h2>创建{{ modeName }}房间</h2><button type="button" @click="showCreate = false" aria-label="关闭">×</button></header><label>房间名称<input v-model="roomName" required maxlength="32" /></label><label>对局人数<select v-model.number="roomCapacity"><option v-for="n in playerCounts" :key="n" :value="n">{{ n }} 人{{ ruleName }}</option></select></label><label>房间可见性<select v-model="visibility"><option value="public">公开 · 所有玩家可搜索</option><option value="invite">邀请 · 仅凭房间码加入</option></select></label><label>房间密码（可选）<input v-model="roomPassword" type="password" minlength="4" maxlength="64" autocomplete="new-password" /></label><CharacterPoolEditor v-if="showCreate" v-model="createPool" :capacity="roomCapacity" @validation="createPoolValid = $event" :mode-id="modeId" :disabled="busy" /><RoomRulesEditor v-model="createRules" :mode-id="modeId" :disabled="busy" /><p>标准卡牌、单将；所有玩家共享房间规则。</p><p v-if="modalError" class="online-modal-error" role="alert">{{ modalError }}</p><button class="online-primary" :disabled="busy || !createPoolValid">{{ busy ? '正在创建…' : '创建并入席' }}</button></form></dialog>
    <dialog ref="joinDialog" class="online-dialog" @close="showJoin = false"><form @submit.prevent="joinRoom"><header><h2>加入房间</h2><button type="button" @click="showJoin = false" aria-label="关闭">×</button></header><label>房间码<input v-model="joinCode" required maxlength="32" /></label><label>房间密码（如有）<input v-model="joinPassword" type="password" maxlength="64" /></label><p v-if="modalError" class="online-modal-error" role="alert">{{ modalError }}</p><button class="online-primary" :disabled="busy">加入房间</button></form></dialog>
  </main>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import "./login-scene.css";
import "./room-scene.css";
import RoomIcon from "./RoomIcon.vue";
import { lib, get } from "noname";
import { modePreset, defaultCharacterPool, normalizeCharacterPool, normalizeRoomRules, characterPoolLabel, type Room } from "@noname/online-protocol";
import SocialPanel from "./SocialPanel.vue";
import MatchPanel from "./MatchPanel.vue";
import CharacterPoolEditor from "./CharacterPoolEditor.vue";
import RoomRulesEditor from "./RoomRulesEditor.vue";
import { inspectCharacterPool, loadOnlineCharacterCatalog } from "../characterPool.js";
import { onlineState as s, restoreAccount, login, logout, searchRooms, command, onOnlineEvent, copyOnlineText } from "../client";
const props = defineProps<{ modeId: string; navigationTarget?: HTMLElement | null }>();
const emit = defineEmits<{ back: []; play: []; mode: [id: string] }>();
const preset = computed(() => modePreset(props.modeId));
const playerCounts = computed(() => preset.value?.players || []);
const ruleName = computed(() => (s.room?.modeId || props.modeId) === 'doudizhu' ? '标准斗地主' : '标准身份');
const modeName = computed(() => get.translation(props.modeId));
const avatar = lib.assetURL + "image/character/caocao.jpg";
const statusLabel = computed(() => ({ idle: '未连接', connecting: '连接中', connected: '已连接', guest: '待登录', disconnected: '连接中断', blocked: '需要重新登录' }[s.status] || '连接中'));
const roomState: Record<string,string> = { waiting: '等待入席', starting: '准备开局', in_game: '对局中', finished: '已结算', closed: '已关闭' };
const loading = ref(true), busy = ref(false), error = ref(''), modalError = ref('');
const authKind = ref<'login'|'register'|'recover'>('login'), username = ref(''), password = ref(''), nickname = ref(''), recoveryCode = ref('');
const query = ref(''), filterState = ref('all'), capacity = ref(''), page = ref(1), listLoading = ref(false), listError = ref('');
const showCreate = ref(false), showJoin = ref(false), createDialog = ref<HTMLDialogElement>(), joinDialog = ref<HTMLDialogElement>();
const roomName = ref('群英小聚'), roomCapacity = ref<number>(props.modeId === 'doudizhu' ? 3 : 5), visibility = ref('public'), roomPassword = ref(''), joinCode = ref(''), joinPassword = ref(''), chatText = ref('');
const myMember = computed(() => s.room?.members.find(member => member.id === s.account?.id));
watch(() => props.modeId, () => { roomCapacity.value = props.modeId === 'doudizhu' ? 3 : 5; createRules.value = normalizeRoomRules(undefined, props.modeId); page.value = 1; capacity.value = ''; void refresh(); });
const newName = ref(''), codeCopied = ref(false);
const createPoolValid = ref(false), editPoolValid = ref(false);
const createPool = ref(defaultCharacterPool()), editPool = ref(defaultCharacterPool()), poolEditorOpen = ref(false);
const createRules = ref(normalizeRoomRules(undefined, props.modeId)), editRules = ref(normalizeRoomRules(undefined, props.modeId));
const roomRuleFacts = computed(() => {
  const rules = normalizeRoomRules(s.room?.rules, s.room?.modeId || props.modeId);
  return [...((s.room?.modeId || props.modeId) === 'identity' ? [
    { label: '手气卡', value: rules.mulligan ? `${rules.mulligan} 次` : '关闭' },
    { label: '主公点将', value: rules.freeChoose ? '开启' : '关闭' },
    { label: '选将方式', value: rules.characterPoolMode === 'partitioned' ? '均分独立池' : '共享抢选池' },
    { label: '换候选', value: `${rules.characterRerolls} 次` },
    { label: '开局准备', value: `${rules.openingTimeout} 秒` },
  ] : []), { label: '操作时限', value: `${rules.chooseTimeout} 秒` }];
});
const rulesChanged = computed(() => JSON.stringify(editRules.value) !== JSON.stringify(normalizeRoomRules(s.room?.rules, s.room?.modeId || props.modeId)));
watch(() => `${s.room?.id}:${JSON.stringify(s.room?.rules)}`, () => { editRules.value = normalizeRoomRules(s.room?.rules, s.room?.modeId || props.modeId); }, { immediate: true });
function describeRules(room: Room) {
  const rules = normalizeRoomRules(room.rules, room.modeId);
  return `${room.modeId === 'identity' ? `手气卡：${rules.mulligan ? rules.mulligan + ' 次' : '关闭'} · 主公点将：${rules.freeChoose ? '开启' : '关闭'} · ${rules.characterPoolMode === 'partitioned' ? '均分独立池' : '共享抢选池'} · 换候选：${rules.characterRerolls} 次 · 开局准备 ${rules.openingTimeout} 秒 · ` : ''}${rules.chooseTimeout} 秒操作时限`;
}
const poolChanged = computed(() => JSON.stringify(normalizeCharacterPool(editPool.value)) !== JSON.stringify(normalizeCharacterPool(s.room?.characterPool)));
watch(() => `${s.room?.id}:${JSON.stringify(s.room?.characterPool)}`, () => { editPool.value = normalizeCharacterPool(s.room?.characterPool); }, { immediate: true });
function togglePoolEditor(event: Event) { poolEditorOpen.value = (event.target as HTMLDetailsElement).open; }
const isOwner = computed(() => s.room?.ownerId === s.account?.id), myReady = computed(() => s.room?.members.find(m => m.id === s.account?.id)?.ready);
const canStart = computed(() => s.room && s.room.members.length === s.room.capacity && s.room.members.every(m => m.isAI || m.ready && m.online));
const memberAt = (seat: number) => s.room?.members.find(m => m.seat === seat);
const emptySeats = computed(() => Array.from({ length: s.room?.capacity || 0 }, (_, seat) => seat).filter(seat => !memberAt(seat)));
let disposed = false, refreshTimer: ReturnType<typeof setTimeout> | undefined;
watch(showCreate, value => { modalError.value = ''; value ? createDialog.value?.showModal() : createDialog.value?.close(); });
watch(showJoin, value => { modalError.value = ''; value ? joinDialog.value?.showModal() : joinDialog.value?.close(); });
async function run(action: () => Promise<any>) { if (busy.value) return; busy.value = true; error.value = ''; try { await action(); } catch (e: any) { error.value = e.message; modalError.value = e.message; } finally { busy.value = false; } }
async function refresh() { if (!s.account || disposed) return; listLoading.value = true; listError.value = ''; try { await searchRooms(props.modeId, query.value, page.value, filterState.value, capacity.value); } catch (e: any) { listError.value = e.message; } finally { listLoading.value = false; } }
async function retry() { loading.value = true; error.value = ''; s.error = ''; try { await restoreAccount(); if (s.room?.modeId && s.room.modeId !== props.modeId) emit('mode', s.room.modeId); await refresh(); } catch (e: any) { error.value = e.message; } finally { loading.value = false; } }
async function authenticate() { await run(async () => { await login(authKind.value, { username: username.value, password: password.value, nickname: nickname.value, recovery: recoveryCode.value }); password.value = ''; if (authKind.value === 'recover') authKind.value = 'login'; else { if (s.room) emit('mode', s.room.modeId); await refresh(); } }); }
async function createRoom() { if (!createPoolValid.value) return; await run(async () => { s.room = await command('room.create', { modeId: props.modeId, preset: preset.value!.preset, name: roomName.value, capacity: roomCapacity.value, visibility: visibility.value, password: roomPassword.value, characterPool: createPool.value, rules: createRules.value }); s.chat = []; showCreate.value = false; roomPassword.value = ''; }); }
function openJoin(room: Room) { joinCode.value = room.code; joinPassword.value = ''; if (room.locked) showJoin.value = true; else void joinRoom(); }
async function joinRoom() { await run(async () => { s.room = await command('room.join', { code: joinCode.value, password: joinPassword.value }); s.chat = []; showJoin.value = false; joinPassword.value = ''; if (s.room) emit('mode', s.room.modeId); }); }
const roomCommand = (type: string, payload = {}) => command(type, { roomId: s.room!.id, revision: s.room!.revision, ...payload });
const savePool = () => editPoolValid.value && run(() => roomCommand('room.update', { characterPool: editPool.value }));
const saveRules = () => run(() => roomCommand('room.update', { rules: editRules.value }));
const ready = () => run(() => roomCommand('room.ready', { ready: !myReady.value }));
const start = () => run(async () => {
  const room = s.room!;
  const catalog = await loadOnlineCharacterCatalog();
  const validation = inspectCharacterPool(normalizeCharacterPool(room.characterPool), room.capacity, room.modeId, catalog);
  if (!validation.valid) throw new Error(validation.message);
  await roomCommand('room.start');
});
const setAI = (seats: number[], enabled: boolean) => run(() => roomCommand('room.ai', { seats, enabled }));
const leaveRoom = () => run(async () => { await roomCommand('room.leave'); s.room = null; await refresh(); });
const chat = () => run(async () => { await command('room.chat', { roomId: s.room!.id, text: chatText.value }); chatText.value = ''; });
const copyCode = () => run(async () => { await copyOnlineText(s.room!.code); codeCopied.value = true; });
const renameRoom = () => run(async () => { await roomCommand('room.update', { name: newName.value }); newName.value = ''; });
function back() { if (s.room || s.match.state !== 'idle') { error.value = '请先离开当前房间或取消匹配。'; return; } emit('back'); }
function resumeGame() { if (!s.room?.instanceId) return; sessionStorage.setItem('noname_online_game', JSON.stringify({ roomId: s.room.id, instanceId: s.room.instanceId, modeId: s.room.modeId })); emit('play'); }
const unsubscribe = onOnlineEvent((type, payload) => {
  if (type === 'rooms.changed' && !s.room) { clearTimeout(refreshTimer); refreshTimer = setTimeout(refresh, 200); }
  if (type === 'game.assigned') { sessionStorage.setItem('noname_online_game', JSON.stringify(payload)); emit('play'); }
  if (type === 'game.failed') error.value = payload.message;
  if (type === 'connection.restored') void refresh();
});
onMounted(retry);
onBeforeUnmount(() => { disposed = true; unsubscribe(); clearTimeout(refreshTimer); });
</script>
