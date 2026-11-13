<script setup>
// «التواصل»: the conversations list and the open conversation, for the staff (dashboard) and the parents (portal).
// ?c=<id> opens a conversation; ?to=staff:12 / ?to=parent:5 (&child=<id>) opens the direct one with that person.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import {
  comm, startCommunication, openConversation, closeConversation, loadOlder, sendMessage, deleteMessage, isMine,
  createDirect, createGroup, addMembers, removeMember, contacts, whisperTyping, startCall, downloadAttachment,
  attachmentUrl, callHistory, myKey, receipt,
} from "@/utils/communication";

const props = defineProps({ side: { type: String, required: true } });
const route = useRoute();
const { t, locale } = useI18n();

const tab = ref("chats");
const filter = ref("");
const draft = ref("");
const file = ref(null);
const fileInput = ref(null);
const sending = ref(false);
const scroller = ref(null);
const error = ref("");
const images = ref({});

const conversations = computed(() => {
  const q = filter.value.trim();
  return q ? comm.conversations.filter((c) => (c.title + " " + (c.subtitle ?? "")).includes(q)) : comm.conversations;
});
const active = computed(() => comm.conversations.find((c) => c.id === comm.activeId) ?? null);
// «إعدادات التواصل»: calls on, and a group call only when group calls are on.
const canCall = computed(() => comm.features.calls && (active.value?.type !== "group" || comm.features.group_calls));
const thread = computed(() => (comm.activeId ? comm.threads[comm.activeId] : null));
const typing = computed(() => {
  const x = comm.typing[comm.activeId];
  return x && x.until > Date.now() ? x.name : null;
});

const fmtTime = (iso) => (iso ? new Date(iso).toLocaleTimeString(locale.value === "ar" ? "ar" : "en", { hour: "2-digit", minute: "2-digit" }) : "");
const fmtDay = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return fmtTime(iso);
  return d.toLocaleDateString(locale.value === "ar" ? "ar" : "en", { day: "numeric", month: "short" });
};
const preview = (m) => {
  if (!m) return "";
  if (m.deleted) return t("comm.deleted");
  if (m.type === "call") return callLine(m);
  if (m.type === "system") return systemLine(m);
  if (m.type === "image") return "📷 " + (m.body || t("comm.photo"));
  if (m.type === "file") return "📎 " + (m.attachments?.[0]?.name || t("comm.file"));
  return m.body;
};
const nameOf = (key) => {
  for (const c of comm.conversations) {
    const p = c.participants?.find((x) => `${x.type}:${x.id}` === key);
    if (p) return p.name;
  }
  return "";
};
const duration = (s) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "");
const callLine = (m) => {
  const kind = t(m.meta?.call_type === "video" ? "comm.video_call" : "comm.voice_call");
  const status = m.meta?.status;
  return status === "ended" ? `${kind} — ${duration(m.meta?.duration_seconds)}` : `${kind} — ${t(`comm.status_${status}`)}`;
};
const systemLine = (m) => {
  const e = m.meta?.event;
  if (e === "created") return t("comm.sys_created", { name: nameOf(m.meta.by) });
  if (e === "member_added") return t("comm.sys_added", { name: nameOf(m.meta.member) });
  if (e === "member_left") return t("comm.sys_left", { name: nameOf(m.meta.member) });
  if (e === "member_removed") return t("comm.sys_removed", { name: nameOf(m.meta.member) });
  return "";
};

// The address keeps the open conversation without a navigation (the portal re-creates its page on every route change).
function setQuery(id) {
  const url = new URL(window.location.href);
  ["c", "to", "child"].forEach((k) => url.searchParams.delete(k));
  if (id) url.searchParams.set("c", id);
  window.history.replaceState(window.history.state, "", url);
}

async function scrollToEnd() {
  await nextTick();
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
}

async function open(id) {
  error.value = "";
  await openConversation(id);
  setQuery(id);
  scrollToEnd();
}

function back() {
  closeConversation();
  setQuery(null);
}

async function onScroll() {
  const el = scroller.value;
  if (!el || el.scrollTop > 40 || !thread.value?.hasMore || thread.value?.loading) return;
  const before = el.scrollHeight;
  await loadOlder(comm.activeId);
  await nextTick();
  el.scrollTop = el.scrollHeight - before;
}

watch(() => thread.value?.messages.length, (n, old) => {
  const el = scroller.value;
  if (!el) return;
  const nearEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
  if (!old || nearEnd || isMine(thread.value.messages.at(-1))) scrollToEnd();
});

let lastWhisper = 0;
function onInput() {
  if (Date.now() - lastWhisper > 2500 && comm.activeId) {
    lastWhisper = Date.now();
    whisperTyping(comm.activeId, nameOf(myKey()) || t("comm.someone"));
  }
}

async function send() {
  if (sending.value || (!draft.value.trim() && !file.value)) return;
  sending.value = true;
  error.value = "";
  try {
    await sendMessage(comm.activeId, draft.value.trim(), file.value);
    draft.value = "";
    file.value = null;
    if (fileInput.value) fileInput.value.value = "";
  } catch (e) {
    error.value = e?.response?.data?.message || t("comm.send_failed");
  } finally {
    sending.value = false;
  }
}
const onKey = (e) => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    send();
  }
};
const pickFile = (e) => (file.value = e.target.files?.[0] ?? null);

async function loadImage(a) {
  if (images.value[a.id]) return;
  images.value[a.id] = "loading";
  try {
    images.value[a.id] = await attachmentUrl(a);
  } catch {
    images.value[a.id] = null;
  }
}

async function call(type) {
  error.value = "";
  try {
    await startCall(type, { conversationId: comm.activeId });
  } catch (e) {
    error.value = e?.response?.data?.message || t("comm.call_failed");
  }
}

// ---------- new conversation / group ----------
const newOpen = ref(false);
const newMode = ref("direct");
const search = ref("");
const people = ref([]);
const picked = ref([]);
const groupTitle = ref("");
const loadingPeople = ref(false);
let searchTimer = null;
async function loadPeople() {
  loadingPeople.value = true;
  try {
    people.value = await contacts(search.value);
  } finally {
    loadingPeople.value = false;
  }
}
watch(search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadPeople, 300);
});
function openNew(mode = "direct") {
  newMode.value = mode;
  picked.value = [];
  groupTitle.value = "";
  search.value = "";
  newOpen.value = true;
  loadPeople();
}
const keyOf = (p) => `${p.type}:${p.id}`;
const togglePick = (p) => {
  const k = keyOf(p);
  picked.value = picked.value.includes(k) ? picked.value.filter((x) => x !== k) : [...picked.value, k];
};
async function choose(p) {
  if (newMode.value !== "direct") return togglePick(p);
  const c = await createDirect(keyOf(p));
  newOpen.value = false;
  open(c.id);
}
async function saveGroup() {
  if (!groupTitle.value.trim() || !picked.value.length) return;
  try {
    if (newMode.value === "add") {
      await addMembers(comm.activeId, picked.value);
    } else {
      const c = await createGroup(groupTitle.value.trim(), picked.value);
      open(c.id);
    }
    newOpen.value = false;
  } catch (e) {
    error.value = e?.response?.data?.message || t("comm.send_failed");
  }
}
function openAdd() {
  openNew("add");
  groupTitle.value = active.value?.title ?? "x";
}

// ---------- members ----------
const membersOpen = ref(false);
const iOwn = computed(() => active.value?.my_role === "owner" && active.value?.type === "group");
async function kick(p) {
  await removeMember(comm.activeId, keyOf(p));
}
async function leave() {
  await removeMember(comm.activeId, myKey());
  membersOpen.value = false;
  back();
}

// ---------- calls history ----------
const calls = ref([]);
watch(tab, async (v) => {
  if (v === "calls") calls.value = (await callHistory()).data;
});
const callTitle = (c) =>
  [c.initiator, ...c.participants].filter((p) => p && `${p.type}:${p.id}` !== myKey()).map((p) => p.name).filter((v, i, a) => a.indexOf(v) === i).join("، ");

onMounted(async () => {
  await startCommunication(props.side);
  if (route.query.to) {
    try {
      const c = await createDirect(String(route.query.to), route.query.child ? Number(route.query.child) : null);
      return open(c.id);
    } catch (e) {
      error.value = e?.response?.data?.message || t("comm.cannot_reach");
    }
  }
  if (route.query.c) open(Number(route.query.c));
});
// Opened again from a notification while on this page.
watch(() => route.query.c, (c) => c && Number(c) !== comm.activeId && open(Number(c)));
onBeforeUnmount(() => closeConversation());
</script>

<template>
  <div class="cm" :class="{ 'has-active': active }">
    <!-- ===== List ===== -->
    <aside class="cm-list">
      <div class="cm-list__head">
        <h1>{{ $t("comm.title") }}</h1>
        <div class="cm-list__actions">
          <Button v-if="comm.features.can_start" icon="pi pi-pencil" rounded text :aria-label="$t('comm.new_chat')" v-tooltip.bottom="$t('comm.new_chat')" @click="openNew('direct')" />
          <Button v-if="side === 'staff' && comm.features.groups" icon="pi pi-users" rounded text :aria-label="$t('comm.new_group')" v-tooltip.bottom="$t('comm.new_group')" @click="openNew('group')" />
        </div>
      </div>
      <div class="cm-tabs">
        <button :class="{ on: tab === 'chats' }" @click="tab = 'chats'">{{ $t("comm.chats") }}</button>
        <button :class="{ on: tab === 'calls' }" @click="tab = 'calls'">{{ $t("comm.calls") }}</button>
      </div>
      <template v-if="tab === 'chats'">
        <InputText v-model="filter" class="cm-filter" :placeholder="$t('comm.search')" />
        <p v-if="!comm.realtime" class="cm-hint">{{ $t("comm.no_realtime") }}</p>
        <ul class="cm-items">
          <li v-for="c in conversations" :key="c.id">
            <button class="cm-item" :class="{ on: c.id === comm.activeId }" @click="open(c.id)">
              <span class="cm-avatar" :class="{ group: c.type === 'group' }">
                <i v-if="c.type === 'group'" class="pi pi-users" /><template v-else>{{ (c.title || "?").charAt(0) }}</template>
              </span>
              <span class="cm-item__body">
                <span class="cm-item__top"><strong>{{ c.title }}</strong><small>{{ fmtDay(c.last_message_at) }}</small></span>
                <span class="cm-item__bottom">
                  <span class="cm-item__preview">
                    <span v-if="receipt(c.last_message, c)" class="cm-ticks" :class="receipt(c.last_message, c)"><i class="pi pi-check" /><i v-if="receipt(c.last_message, c) === 'read'" class="pi pi-check" /></span>
                    {{ preview(c.last_message) || c.subtitle }}
                  </span>
                  <span v-if="c.unread" class="cm-badge">{{ c.unread }}</span>
                </span>
              </span>
            </button>
          </li>
          <li v-if="comm.loaded && !conversations.length" class="cm-empty">
            <i class="pi pi-comments" />
            <span>{{ $t("comm.empty") }}</span>
            <Button v-if="comm.features.can_start" :label="$t('comm.new_chat')" size="small" @click="openNew('direct')" />
          </li>
        </ul>
      </template>
      <ul v-else class="cm-items">
        <li v-for="c in calls" :key="c.id" class="cm-callrow">
          <i :class="[c.type === 'video' ? 'pi pi-video' : 'pi pi-phone', `st-${c.status}`]" />
          <span class="cm-item__body">
            <strong>{{ callTitle(c) }}</strong>
            <small>{{ $t(`comm.status_${c.status}`) }} · {{ fmtDay(c.created_at) }}<template v-if="c.duration_seconds"> · {{ duration(c.duration_seconds) }}</template></small>
          </span>
        </li>
        <li v-if="!calls.length" class="cm-empty"><span>{{ $t("comm.no_calls") }}</span></li>
      </ul>
    </aside>

    <!-- ===== Conversation ===== -->
    <section class="cm-thread">
      <template v-if="active">
        <header class="cm-thread__head">
          <Button icon="pi pi-arrow-right" class="cm-back" text rounded :aria-label="$t('comm.back')" @click="back" />
          <span class="cm-avatar" :class="{ group: active.type === 'group' }">
            <i v-if="active.type === 'group'" class="pi pi-users" /><template v-else>{{ (active.title || "?").charAt(0) }}</template>
          </span>
          <button class="cm-thread__title" @click="membersOpen = active.type === 'group'">
            <strong>{{ active.title }}</strong>
            <small>{{ typing ? $t("comm.typing", { name: typing }) : active.subtitle }}<template v-if="active.child"> · {{ active.child.name }}</template></small>
          </button>
          <Button v-if="canCall" icon="pi pi-phone" text rounded :aria-label="$t('comm.voice_call')" v-tooltip.bottom="$t('comm.voice_call')" :disabled="!!comm.call" @click="call('audio')" />
          <Button v-if="canCall && comm.features.video" icon="pi pi-video" text rounded :aria-label="$t('comm.video_call')" v-tooltip.bottom="$t('comm.video_call')" :disabled="!!comm.call" @click="call('video')" />
        </header>

        <div ref="scroller" class="cm-messages" @scroll.passive="onScroll">
          <div v-if="thread?.loading" class="cm-hint">…</div>
          <template v-for="m in thread?.messages ?? []" :key="m.id">
            <div v-if="m.type === 'system' || m.type === 'call'" class="cm-system">
              <span><i v-if="m.type === 'call'" :class="m.meta?.call_type === 'video' ? 'pi pi-video' : 'pi pi-phone'" /> {{ m.type === "call" ? callLine(m) : systemLine(m) }} · {{ fmtTime(m.created_at) }}</span>
            </div>
            <div v-else class="cm-msg" :class="{ mine: isMine(m) }">
              <div class="cm-bubble">
                <small v-if="active.type === 'group' && !isMine(m)" class="cm-sender">{{ m.sender?.name }}</small>
                <template v-if="m.deleted"><em class="cm-deleted">{{ $t("comm.deleted") }}</em></template>
                <template v-else>
                  <div v-for="a in m.attachments" :key="a.id" class="cm-attachment">
                    <template v-if="a.is_image">
                      <img v-if="images[a.id] && images[a.id] !== 'loading'" :src="images[a.id]" :alt="a.name" @click="downloadAttachment(a)" />
                      <button v-else class="cm-file" @click="loadImage(a)" @vue:mounted="loadImage(a)"><i class="pi pi-image" /> {{ a.name }}</button>
                    </template>
                    <button v-else class="cm-file" @click="downloadAttachment(a)"><i class="pi pi-file" /> {{ a.name }} <small>{{ Math.ceil(a.size / 1024) }} KB</small></button>
                  </div>
                  <p v-if="m.body" class="cm-text">{{ m.body }}</p>
                </template>
                <span class="cm-meta">
                  {{ fmtTime(m.created_at) }}
                  <span v-if="receipt(m, active)" class="cm-ticks" :class="receipt(m, active)" :title="$t(`comm.receipt_${receipt(m, active)}`)">
                    <i class="pi pi-check" /><i v-if="receipt(m, active) === 'read'" class="pi pi-check" />
                  </span>
                  <button v-if="isMine(m) && !m.deleted && comm.features.delete" class="cm-del" :aria-label="$t('comm.delete')" @click="deleteMessage(comm.activeId, m.id)"><i class="pi pi-trash" /></button>
                </span>
              </div>
            </div>
          </template>
        </div>

        <p v-if="error" class="cm-error">{{ error }}</p>
        <footer class="cm-composer">
          <input ref="fileInput" type="file" hidden @change="pickFile" />
          <Button v-if="comm.features.attachments" icon="pi pi-paperclip" text rounded :aria-label="$t('comm.attach')" @click="fileInput.click()" />
          <div class="cm-composer__box">
            <span v-if="file" class="cm-chip">{{ file.name }} <i class="pi pi-times" @click="file = null" /></span>
            <Textarea v-model="draft" autoResize rows="1" :placeholder="$t('comm.write')" @keydown="onKey" @input="onInput" />
          </div>
          <Button icon="pi pi-send" rounded :loading="sending" :aria-label="$t('comm.send')" @click="send" />
        </footer>
      </template>
      <div v-else class="cm-placeholder">
        <i class="pi pi-comments" />
        <p>{{ $t("comm.pick") }}</p>
        <p v-if="error" class="cm-error">{{ error }}</p>
      </div>
    </section>

    <!-- ===== New conversation / group / add members ===== -->
    <Dialog v-model:visible="newOpen" modal :header="$t(newMode === 'direct' ? 'comm.new_chat' : newMode === 'add' ? 'comm.add_members' : 'comm.new_group')" :style="{ width: 'min(480px, 95vw)' }">
      <InputText v-if="newMode === 'group'" v-model="groupTitle" class="w-full mb-3" :placeholder="$t('comm.group_name')" />
      <InputText v-model="search" class="w-full" :placeholder="$t('comm.search_people')" autofocus />
      <ul class="cm-people">
        <li v-for="p in people" :key="keyOf(p)">
          <button class="cm-item" :class="{ on: picked.includes(keyOf(p)) }" @click="choose(p)">
            <span class="cm-avatar" :class="{ parent: p.type === 'parent' }">{{ (p.name || "?").charAt(0) }}</span>
            <span class="cm-item__body"><strong>{{ p.name }}</strong><small>{{ p.subtitle }}</small></span>
            <i v-if="newMode !== 'direct'" :class="picked.includes(keyOf(p)) ? 'pi pi-check-circle' : 'pi pi-circle'" />
          </button>
        </li>
        <li v-if="!loadingPeople && !people.length" class="cm-hint">{{ $t("comm.nobody") }}</li>
      </ul>
      <template v-if="newMode !== 'direct'" #footer>
        <Button :label="$t(newMode === 'add' ? 'comm.add' : 'comm.create_group')" :disabled="!picked.length || !groupTitle.trim()" @click="saveGroup" />
      </template>
    </Dialog>

    <!-- ===== Group members ===== -->
    <Dialog v-model:visible="membersOpen" modal :header="active?.title" :style="{ width: 'min(420px, 95vw)' }">
      <ul class="cm-people">
        <li v-for="p in active?.participants ?? []" :key="keyOf(p)" class="cm-item">
          <span class="cm-avatar" :class="{ parent: p.type === 'parent' }">{{ (p.name || "?").charAt(0) }}</span>
          <span class="cm-item__body"><strong>{{ p.name }}</strong><small>{{ p.subtitle }}</small></span>
          <Button v-if="iOwn && keyOf(p) !== myKey()" icon="pi pi-user-minus" text rounded severity="danger" :aria-label="$t('comm.remove')" @click="kick(p)" />
        </li>
      </ul>
      <template #footer>
        <Button v-if="iOwn" :label="$t('comm.add_members')" icon="pi pi-user-plus" text @click="membersOpen = false; openAdd()" />
        <Button :label="$t('comm.leave_group')" icon="pi pi-sign-out" severity="danger" text @click="leave" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.cm { display: grid; grid-template-columns: 340px 1fr; height: calc(100vh - 140px); min-height: 480px; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; }
.cm-list { border-inline-end: 1px solid #e5e7eb; display: flex; flex-direction: column; min-height: 0; }
.cm-list__head { display: flex; align-items: center; justify-content: space-between; padding: 14px 14px 6px; }
.cm-list__head h1 { font-size: 1.25rem; font-weight: 700; margin: 0; }
.cm-tabs { display: flex; gap: 6px; padding: 0 14px 8px; }
.cm-tabs button { flex: 1; padding: 6px; border-radius: 10px; background: #f1f5f9; font-weight: 600; color: #475569; }
.cm-tabs button.on { background: #135c65; color: #fff; }
.cm-filter { margin: 0 14px 8px; }
.cm-hint { color: #94a3b8; font-size: 0.8rem; padding: 4px 14px; }
.cm-items, .cm-people { list-style: none; margin: 0; padding: 0; overflow-y: auto; flex: 1; }
.cm-people { max-height: 50vh; margin-top: 10px; }
.cm-item { width: 100%; display: flex; gap: 10px; align-items: center; padding: 10px 14px; text-align: start; border-radius: 0; }
.cm-item:hover, .cm-item.on { background: #f0f7f8; }
.cm-avatar { width: 44px; height: 44px; flex: none; border-radius: 50%; background: #135c65; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
.cm-avatar.group { background: #5b21b6; }
.cm-avatar.parent { background: #b21553; }
.cm-item__body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.cm-item__body small { color: #64748b; }
.cm-item__top, .cm-item__bottom { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.cm-item__top strong { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cm-item__top small { color: #94a3b8; flex: none; }
.cm-item__preview { color: #64748b; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cm-badge { background: #22c55e; color: #fff; border-radius: 999px; min-width: 20px; padding: 0 6px; font-size: 0.75rem; text-align: center; flex: none; }
.cm-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px 14px; color: #94a3b8; }
.cm-empty i { font-size: 2rem; }
.cm-callrow { display: flex; gap: 12px; align-items: center; padding: 10px 14px; }
.cm-callrow .st-missed, .cm-callrow .st-declined { color: #dc2626; }
.cm-callrow .st-ended { color: #16a34a; }

.cm-thread { display: flex; flex-direction: column; min-height: 0; background: #f6f8f9; }
.cm-thread__head { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #fff; border-bottom: 1px solid #e5e7eb; }
.cm-thread__title { flex: 1; min-width: 0; display: flex; flex-direction: column; text-align: start; }
.cm-thread__title small { color: #64748b; }
.cm-back { display: none; }
.cm-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 6px; }
.cm-msg { display: flex; }
.cm-msg.mine { justify-content: flex-end; }
.cm-bubble { max-width: min(75%, 560px); background: #fff; border-radius: 14px; padding: 8px 12px 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06); }
.cm-msg.mine .cm-bubble { background: #dcf3f0; }
.cm-sender { color: #135c65; font-weight: 700; display: block; }
.cm-text { white-space: pre-wrap; word-break: break-word; margin: 0; }
.cm-meta { display: flex; justify-content: flex-end; gap: 6px; font-size: 0.72rem; color: #94a3b8; align-items: center; }
.cm-ticks { display: inline-flex; color: #94a3b8; }
.cm-ticks i { font-size: 0.7rem; font-weight: 700; }
.cm-ticks i + i { margin-inline-start: -0.35rem; }
.cm-ticks.read { color: #0ea5e9; }
.cm-del { opacity: 0; transition: opacity 0.15s; }
.cm-bubble:hover .cm-del { opacity: 1; }
.cm-deleted { color: #94a3b8; }
.cm-attachment img { max-width: 260px; max-height: 260px; border-radius: 10px; cursor: pointer; display: block; margin-bottom: 4px; }
.cm-file { display: flex; gap: 6px; align-items: center; background: #f1f5f9; padding: 6px 10px; border-radius: 10px; margin-bottom: 4px; }
.cm-system { text-align: center; }
.cm-system span { display: inline-block; background: #e2e8f0; color: #475569; border-radius: 999px; padding: 3px 12px; font-size: 0.8rem; }
.cm-error { color: #dc2626; font-size: 0.85rem; padding: 0 14px; }
.cm-composer { display: flex; gap: 8px; align-items: flex-end; padding: 10px 14px; background: #fff; border-top: 1px solid #e5e7eb; }
.cm-composer__box { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.cm-composer__box :deep(textarea) { width: 100%; max-height: 140px; }
.cm-chip { align-self: flex-start; background: #e2e8f0; border-radius: 999px; padding: 2px 10px; font-size: 0.8rem; }
.cm-chip i { cursor: pointer; font-size: 0.7rem; }
.cm-placeholder { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; gap: 8px; }
.cm-placeholder i { font-size: 3rem; }

@media (max-width: 860px) {
  .cm { grid-template-columns: 1fr; height: calc(100vh - 150px); }
  .cm.has-active .cm-list { display: none; }
  .cm:not(.has-active) .cm-thread { display: none; }
  .cm-back { display: inline-flex; }
}
[dir="ltr"] .cm-back :deep(.pi-arrow-right) { transform: rotate(180deg); }
</style>
