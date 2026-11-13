// «التواصل»: the conversations and calls of whoever is signed in — a staff member (dashboard) or a parent (portal).
// One reactive state for the page; the real-time events keep it current, and a refresh every minute (and on focus)
// keeps it right if the real-time server is not reachable.
import axios from "axios";
import { reactive } from "vue";
import { useAuthStore } from "@/stores/Auth";
import { useParentStore } from "@/stores/ParentStore";
import { connectRealtime, disconnectRealtime } from "@/utils/realtime";
import { refreshPendingCounts } from "@/utils/pendingCounts";

export const comm = reactive({
  side: null, // "staff" | "parent"
  myId: null,
  conversations: [],
  loaded: false,
  activeId: null,
  threads: {}, // conversation id → { messages (oldest first), hasMore, loading }
  typing: {}, // conversation id → { name, until }
  incoming: [], // calls ringing for me
  call: null, // the call I am in: { call, token, outgoing }
  callsEnabled: true,
  // What «إعدادات التواصل» allows this member (api/communication/features); off: the whole service is switched off.
  features: { calls: true, video: true, group_calls: true, groups: true, can_start: true, attachments: true, delete: true, push: true },
  off: false,
  realtime: false,
});

let echo = null;
let timer = null;
let conversationChannel = null;

export const tokenOf = (side) => (side === "parent" ? useParentStore().parentToken : useAuthStore().token);
const myIdOf = (side) =>
  Number(side === "parent" ? useParentStore().parent_id ?? useParentStore().user?.id : useAuthStore().authUser?.id ?? useAuthStore().user_id);

/** Requests with this side's own token (a browser may hold a staff and a parent session at once). */
export const api = (method, url, data, config = {}) =>
  axios({
    method,
    url: `api/communication/${url}`,
    data,
    ...config,
    skipAuth: true,
    skipAuthRedirect: true,
    headers: { Authorization: `Bearer ${tokenOf(comm.side)}`, Accept: "application/json", ...(config.headers ?? {}) },
  }).then((r) => r.data);

export const isMine = (message) => message?.sender?.type === comm.side && Number(message?.sender?.id) === comm.myId;
export const myKey = () => `${comm.side}:${comm.myId}`;

export async function startCommunication(side) {
  if (comm.side === side && comm.loaded) return;
  stopCommunication();
  comm.side = side;
  comm.myId = myIdOf(side);
  echo = connectRealtime(tokenOf(side));
  comm.realtime = Boolean(echo);
  if (echo) {
    echo
      .private(`${side}.${comm.myId}`)
      .listen(".message.sent", onMessage)
      .listen(".message.read", onRead)
      .listen(".conversation.updated", () => loadConversations())
      .listen(".call.invited", onCallInvited)
      .listen(".call.updated", onCallUpdated);
  }
  try {
    comm.features = { ...comm.features, ...(await api("get", "features")).data };
    comm.off = false;
  } catch (e) {
    // 404 / 403: «التواصل» is switched off (for everyone, or for the parents).
    if ([403, 404].includes(e?.response?.status)) {
      comm.off = true;
      return;
    }
  }
  await Promise.allSettled([loadConversations(), loadRinging()]);
  timer = setInterval(() => {
    loadConversations();
    loadRinging();
  }, echo ? 120_000 : 30_000);
  window.addEventListener("focus", onFocus);
}

export function stopCommunication() {
  clearInterval(timer);
  window.removeEventListener("focus", onFocus);
  disconnectRealtime();
  echo = null;
  Object.assign(comm, { side: null, myId: null, conversations: [], loaded: false, activeId: null, threads: {}, incoming: [], call: null });
}

const onFocus = () => {
  loadConversations();
  loadRinging();
};

export async function loadConversations() {
  try {
    const { data } = await api("get", "conversations");
    comm.conversations = data;
    comm.loaded = true;
  } catch {
    // signed out or offline: keep what is shown
  }
}

export const contacts = (search) => api("get", "contacts", undefined, { params: { search } }).then((r) => r.data);

export async function createDirect(member, childId = null) {
  const { data } = await api("post", "conversations", { type: "direct", member, child_id: childId });
  upsertConversation(data);
  return data;
}

export async function createGroup(title, members, childId = null) {
  const { data } = await api("post", "conversations", { type: "group", title, members, child_id: childId });
  upsertConversation(data);
  return data;
}

export const addMembers = (id, members) => api("post", `conversations/${id}/members`, { members }).then((r) => upsertConversation(r.data));
export const removeMember = (id, member) => api("delete", `conversations/${id}/members/${member}`).then(() => loadConversations());

function upsertConversation(conversation) {
  const i = comm.conversations.findIndex((c) => c.id === conversation.id);
  if (i >= 0) comm.conversations[i] = conversation;
  else comm.conversations.unshift(conversation);
  return conversation;
}

const thread = (id) => (comm.threads[id] ??= { messages: [], hasMore: true, loading: false });

export async function openConversation(id) {
  comm.activeId = id;
  const t = thread(id);
  if (!t.messages.length) await loadOlder(id);
  markRead(id);
  conversationChannel && echo?.leave(conversationChannel);
  conversationChannel = `conversation.${id}`;
  echo
    ?.private(conversationChannel)
    .listenForWhisper("typing", (e) => {
      comm.typing[id] = { name: e.name, until: Date.now() + 4000 };
    });
}

export function closeConversation() {
  conversationChannel && echo?.leave(conversationChannel);
  conversationChannel = null;
  comm.activeId = null;
}

export async function loadOlder(id) {
  const t = thread(id);
  if (t.loading || !t.hasMore) return;
  t.loading = true;
  try {
    const before = t.messages[0]?.id;
    const res = await api("get", `conversations/${id}/messages`, undefined, { params: before ? { before } : {} });
    t.messages = [...res.data.slice().reverse(), ...t.messages];
    t.hasMore = res.has_more;
  } finally {
    t.loading = false;
  }
}

export async function sendMessage(id, body, file = null) {
  let payload = { body };
  let config = {};
  if (file) {
    payload = new FormData();
    if (body) payload.append("body", body);
    payload.append("file", file);
    config = { headers: { "Content-Type": "multipart/form-data" } };
  }
  const { data } = await api("post", `conversations/${id}/messages`, payload, config);
  addMessage(data);
  return data;
}

export const deleteMessage = (id, messageId) =>
  api("delete", `conversations/${id}/messages/${messageId}`).then(({ data }) => addMessage(data));

export function whisperTyping(id, name) {
  echo?.private(`conversation.${id}`).whisper("typing", { name });
}

export async function markRead(id) {
  const c = comm.conversations.find((x) => x.id === id);
  if (c) c.unread = 0;
  try {
    await api("post", `conversations/${id}/read`);
    refreshPendingCounts(comm.side);
  } catch {
    // next refresh
  }
}

/** Downloads an attachment with the bearer token (a plain link would have no token). */
export async function downloadAttachment(attachment) {
  const blob = await api("get", `attachments/${attachment.id}`, undefined, { responseType: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = attachment.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export const attachmentUrl = async (attachment) =>
  URL.createObjectURL(await api("get", `attachments/${attachment.id}`, undefined, { responseType: "blob" }));

function addMessage(message) {
  const t = thread(message.conversation_id);
  const i = t.messages.findIndex((m) => m.id === message.id);
  if (i >= 0) t.messages[i] = message;
  else t.messages.push(message);
  const c = comm.conversations.find((x) => x.id === message.conversation_id);
  if (c) {
    c.last_message = message;
    c.last_message_at = message.created_at;
    comm.conversations.sort((a, b) => (b.last_message_at ?? "").localeCompare(a.last_message_at ?? ""));
  }
}

/** Someone read a conversation up to a message: the ticks of my messages before it turn read. */
function onRead({ conversation_id, member, message_id }) {
  if (member === myKey()) return;
  const c = comm.conversations.find((x) => x.id === conversation_id);
  if (!c) return;
  const reads = { ...(c.reads ?? {}) };
  reads[member] = Math.max(Number(reads[member] ?? 0), Number(message_id));
  c.reads = reads;
}

/**
 * The state of my message: "sent" (✓) or "read" (✓✓, read by everyone in the conversation; in a group, by all).
 * null for others' messages.
 */
export function receipt(message, conversation) {
  if (!isMine(message) || !conversation) return null;
  const reads = Object.values(conversation.reads ?? {});
  return reads.length && reads.every((id) => Number(id) >= Number(message.id)) ? "read" : "sent";
}

function onMessage(message) {
  const known = comm.conversations.some((c) => c.id === message.conversation_id);
  if (!known) {
    loadConversations();
  }
  addMessage(message);
  if (isMine(message)) return;
  if (comm.activeId === message.conversation_id && document.visibilityState === "visible") {
    markRead(message.conversation_id);
  } else {
    const c = comm.conversations.find((x) => x.id === message.conversation_id);
    if (c) c.unread = (c.unread ?? 0) + 1;
    refreshPendingCounts(comm.side);
  }
  delete comm.typing[message.conversation_id];
}

// ---------- calls ----------

export async function loadRinging() {
  try {
    const { data } = await api("get", "calls/ringing");
    comm.incoming = data.filter((call) => call.initiator?.type !== comm.side || Number(call.initiator?.id) !== comm.myId);
  } catch {
    // keep
  }
}

function onCallInvited(call) {
  if (!comm.incoming.some((c) => c.id === call.id)) comm.incoming.push(call);
}

function onCallUpdated(call) {
  const finished = ["ended", "missed", "declined", "cancelled"].includes(call.status);
  const mine = call.participants?.find((p) => p.type === comm.side && Number(p.id) === comm.myId);
  if (finished || (mine && mine.status !== "invited")) {
    comm.incoming = comm.incoming.filter((c) => c.id !== call.id);
  }
  if (comm.call?.call?.id === call.id) {
    comm.call.call = call;
  }
}

export const callHistory = () => api("get", "calls");

export async function startCall(type, { conversationId = null, members = null, childId = null } = {}) {
  const res = await api("post", "calls", { type, conversation_id: conversationId, members, child_id: childId });
  comm.call = { call: res.data, token: res.token, outgoing: true };
  return comm.call;
}

export async function acceptCall(call) {
  const res = await api("post", `calls/${call.id}/accept`);
  comm.incoming = comm.incoming.filter((c) => c.id !== call.id);
  comm.call = { call: res.data, token: res.token, outgoing: false };
  return comm.call;
}

export async function declineCall(call) {
  comm.incoming = comm.incoming.filter((c) => c.id !== call.id);
  await api("post", `calls/${call.id}/decline`).catch(() => {});
}

export const callAction = (call, action) => api("post", `calls/${call.id}/${action}`).catch(() => null);
export const renewCallToken = (call) => api("post", `calls/${call.id}/token`).then((r) => r.token);
