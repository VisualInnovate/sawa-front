<script setup>
// «مساعد سوا» in the parent portal: a floating chat that stays open across pages, sends the current page with
// every question and opens the pages the assistant suggests (the parent keeps talking to it on the new page).
import axios from "axios";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";
import { useParentStore } from "@/stores/ParentStore";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const parentStore = useParentStore();

const enabled = ref(false);
const welcome = ref("");
const open = useStorage("assistantOpen", false, sessionStorage);
const conversationId = useStorage("assistantConversation", null, sessionStorage);
const messages = ref([]);
const draft = ref("");
const sending = ref(false);
const list = ref(null);
const input = ref(null);

const suggestions = computed(() => [t("ai.suggestion_1"), t("ai.suggestion_2"), t("ai.suggestion_3")]);

// The answers are plain text; only **bold** is kept, everything else is escaped.
const escape = (text) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const format = (text) => escape(text ?? "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

async function scrollDown() {
  await nextTick();
  if (list.value) list.value.scrollTop = list.value.scrollHeight;
}

async function load() {
  try {
    const { data } = await axios.get("/api/parent/assistant");
    enabled.value = data.data.enabled;
    welcome.value = data.data.welcome_message ?? "";
  } catch {
    enabled.value = false;
  }
  if (enabled.value && conversationId.value) {
    try {
      const { data } = await axios.get(`/api/parent/assistant/conversations/${conversationId.value}`);
      messages.value = data.data.messages;
    } catch {
      conversationId.value = null;
    }
  }
  scrollDown();
}

function go(action) {
  if (action?.type !== "navigate") return;
  router.push({ name: action.route, params: action.params ?? {} }).catch(() => {});
  // On a phone the chat covers the page: fold it so the parent sees where they are (the conversation stays).
  if (window.innerWidth < 640) open.value = false;
}

// The answer arrives as server-sent events (start, delta…, action, done | error) and fills its bubble as it is
// written. fetch, not axios: axios only hands the body over once it is complete.
async function stream(body, onEvent) {
  const token = JSON.parse(localStorage.getItem("parentToken") ?? "null");
  const response = await fetch(new URL("api/parent/assistant/chat/stream", axios.defaults.baseURL), {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
      lang: localStorage.getItem("appLang") ?? "",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (response.status === 401) {
    parentStore.resetAuthStore();
    router.replace({ name: "parentLogin" }).catch(() => {});
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(response.status === 429 ? t("ai.chat_error") : data.message ?? t("ai.chat_error"));
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let end;
    while ((end = buffer.indexOf("\n\n")) >= 0) {
      const chunk = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      const event = chunk.match(/^event: (.+)$/m)?.[1];
      const data = chunk.match(/^data: (.+)$/m)?.[1];
      if (event && data) onEvent(event, JSON.parse(data));
    }
  }
}

async function send(text = draft.value) {
  text = text.trim();
  if (!text || sending.value) return;
  draft.value = "";
  messages.value.push({ id: `local-${Date.now()}`, role: "user", text });
  messages.value.push({ id: `reply-${Date.now()}`, role: "assistant", text: "", actions: [] });
  // The reactive copy, so the bubble updates as the text arrives.
  const reply = messages.value[messages.value.length - 1];
  sending.value = true;
  scrollDown();
  let finished = false;
  let navigated = false;
  try {
    await stream(
      { message: text, conversation_id: conversationId.value, page: { name: route.name ?? null, path: route.fullPath, title: document.title } },
      (event, data) => {
        if (event === "start") conversationId.value = data.conversation_id;
        if (event === "delta") reply.text += data.text;
        // Take the parent to the page as soon as the assistant opens it; the chat stays open there.
        if (event === "action") {
          reply.actions.push(data);
          if (!navigated) go(data);
          navigated = true;
        }
        if (event === "done") {
          conversationId.value = data.conversation_id;
          Object.assign(reply, data.message);
          if (!navigated) go(data.message.actions?.find((a) => a.type === "navigate"));
          finished = true;
        }
        if (event === "error") {
          Object.assign(reply, { text: data.message, error: true });
          finished = true;
        }
        scrollDown();
      }
    );
    if (!finished) throw new Error(t("ai.chat_error"));
  } catch (error) {
    Object.assign(reply, { text: error.message || t("ai.chat_error"), error: true });
  } finally {
    sending.value = false;
    scrollDown();
    nextTick(() => input.value?.focus?.());
  }
}

function onKey(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    send();
  }
}

function restart() {
  conversationId.value = null;
  messages.value = [];
}

watch(open, (value) => value && scrollDown());
onMounted(load);
</script>

<template>
  <div v-if="enabled" class="sawa-assistant" dir="rtl">
    <transition name="sawa-assistant-pop">
      <section v-if="open" class="sawa-assistant__panel" role="dialog" :aria-label="$t('ai.chat_title')">
        <header class="sawa-assistant__head">
          <div class="sawa-assistant__avatar"><i class="pi pi-sparkles" /></div>
          <div class="grow">
            <p class="sawa-assistant__title">{{ $t("ai.chat_title") }}</p>
            <p class="sawa-assistant__subtitle">{{ $t("ai.chat_subtitle") }}</p>
          </div>
          <button type="button" class="sawa-assistant__icon" :title="$t('ai.chat_new')" :aria-label="$t('ai.chat_new')" @click="restart">
            <i class="pi pi-refresh" />
          </button>
          <button type="button" class="sawa-assistant__icon" :title="$t('ai.chat_close')" :aria-label="$t('ai.chat_close')" @click="open = false">
            <i class="pi pi-times" />
          </button>
        </header>

        <div ref="list" class="sawa-assistant__messages" aria-live="polite">
          <div class="sawa-assistant__msg sawa-assistant__msg--bot">{{ welcome }}</div>
          <div v-if="!messages.length" class="sawa-assistant__chips">
            <button v-for="s in suggestions" :key="s" type="button" class="sawa-assistant__chip" @click="send(s)">{{ s }}</button>
          </div>
          <template v-for="m in messages" :key="m.id">
            <div v-if="m.text" class="sawa-assistant__msg" :class="m.role === 'user' ? 'sawa-assistant__msg--user' : m.error ? 'sawa-assistant__msg--error' : 'sawa-assistant__msg--bot'"
              v-html="format(m.text)" />
            <div v-if="m.actions?.length" class="sawa-assistant__actions">
              <button v-for="a in m.actions" :key="a.route + JSON.stringify(a.params)" type="button" class="sawa-assistant__go" @click="go(a)">
                <i class="pi pi-arrow-left" /> {{ $t("ai.chat_go", { page: a.label }) }}
              </button>
            </div>
          </template>
          <!-- Until the first words of the answer arrive. -->
          <div v-if="sending && !messages[messages.length - 1]?.text" class="sawa-assistant__msg sawa-assistant__msg--bot sawa-assistant__typing"><span /><span /><span /></div>
        </div>

        <form class="sawa-assistant__form" @submit.prevent="send()">
          <textarea ref="input" v-model="draft" rows="1" maxlength="2000" :placeholder="$t('ai.chat_placeholder')" :aria-label="$t('ai.chat_placeholder')"
            @keydown="onKey" />
          <button type="submit" class="sawa-assistant__send" :disabled="!draft.trim() || sending" :aria-label="$t('ai.chat_send')">
            <i class="pi pi-send" />
          </button>
        </form>
        <p class="sawa-assistant__note">{{ $t("ai.chat_note") }}</p>
      </section>
    </transition>

    <button v-if="!open" type="button" class="sawa-assistant__fab" :aria-label="$t('ai.chat_open')" @click="open = true">
      <i class="pi pi-comments" />
      <span>{{ $t("ai.chat_title") }}</span>
    </button>
  </div>
</template>

<style scoped>
.sawa-assistant {
  --sa-main: #135c65;
  --sa-accent: #ff2a5b;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  font-family: inherit;
}
.sawa-assistant__fab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  background: var(--sa-main);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(19, 92, 101, 0.35);
}
.sawa-assistant__fab .pi {
  font-size: 1.3rem;
}
.sawa-assistant__panel {
  width: min(380px, calc(100vw - 32px));
  height: min(600px, calc(100vh - 40px));
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.sawa-assistant__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  background: var(--sa-main);
  color: #fff;
}
.sawa-assistant__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: grid;
  place-items: center;
}
.sawa-assistant__title {
  font-weight: 700;
  margin: 0;
}
.sawa-assistant__subtitle {
  font-size: 0.78rem;
  opacity: 0.85;
  margin: 0;
}
.sawa-assistant__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
}
.sawa-assistant__icon:hover {
  background: rgba(255, 255, 255, 0.15);
}
.sawa-assistant__messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: #f6f8f9;
}
.sawa-assistant__msg {
  max-width: 85%;
  padding: 0.6rem 0.85rem;
  border-radius: 14px;
  line-height: 1.7;
  white-space: pre-line;
  word-break: break-word;
  font-size: 0.95rem;
}
.sawa-assistant__msg--bot {
  align-self: flex-start;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-start-start-radius: 4px;
}
.sawa-assistant__msg--user {
  align-self: flex-end;
  background: var(--sa-main);
  color: #fff;
  border-start-end-radius: 4px;
}
.sawa-assistant__msg--error {
  align-self: flex-start;
  background: #fff4f4;
  border: 1px solid #fecaca;
  color: #991b1b;
}
.sawa-assistant__chips,
.sawa-assistant__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.sawa-assistant__chip {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--sa-main);
  color: var(--sa-main);
  background: #fff;
  font-size: 0.85rem;
}
.sawa-assistant__go {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.8rem;
  border-radius: 10px;
  background: var(--sa-accent);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
}
.sawa-assistant__typing {
  display: flex;
  gap: 4px;
}
.sawa-assistant__typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #9ca3af;
  animation: sa-blink 1.2s infinite;
}
.sawa-assistant__typing span:nth-child(2) {
  animation-delay: 0.2s;
}
.sawa-assistant__typing span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes sa-blink {
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
}
.sawa-assistant__form {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.6rem;
  border-top: 1px solid #e5e7eb;
}
.sawa-assistant__form textarea {
  flex: 1;
  resize: none;
  max-height: 120px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0.55rem 0.75rem;
  font: inherit;
  outline: none;
}
.sawa-assistant__form textarea:focus {
  border-color: var(--sa-main);
}
.sawa-assistant__send {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--sa-main);
  color: #fff;
  flex-shrink: 0;
}
.sawa-assistant__send:disabled {
  opacity: 0.45;
}
.sawa-assistant__note {
  font-size: 0.7rem;
  color: #6b7280;
  text-align: center;
  padding: 0 0.75rem 0.5rem;
  margin: 0;
}
.sawa-assistant-pop-enter-active,
.sawa-assistant-pop-leave-active {
  transition: opacity 0.18s, transform 0.18s;
}
.sawa-assistant-pop-enter-from,
.sawa-assistant-pop-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
@media (max-width: 480px) {
  .sawa-assistant {
    left: 12px;
    bottom: 12px;
  }
}
</style>
