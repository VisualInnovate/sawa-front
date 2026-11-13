<script setup>
// Over every page (dashboard and parents' portal): a call ringing for me, and the window of the call I am in.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { comm, acceptCall, declineCall, callAction, renewCallToken, tokenOf, loadRinging } from "@/utils/communication";
import { push, initPush, enablePush, dismissPush, closeCallNotification } from "@/utils/push";
import { session, joinCall, leaveCall, toggleMic, toggleCam, localVideoTrack } from "@/utils/agoraCall";
import VideoTile from "./VideoTile.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const RING_SECONDS = 45;

const incoming = computed(() => (comm.call ? null : comm.incoming[0] ?? null));
const current = computed(() => comm.call?.call ?? null);
const finished = (call) => ["ended", "missed", "declined", "cancelled"].includes(call?.status);
const minimized = ref(false);
const seconds = ref(0);
const notice = ref("");
let clock = null;
let ringTimer = null;

// ---------- the ring ----------
let audio = null;
let ringLoop = null;
function ring(on) {
  clearInterval(ringLoop);
  if (!on) return;
  // A phone's ring: two tones together, twice, then a pause; and the phone vibrates.
  const beep = () => {
    try {
      audio ??= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      for (const start of [0, 0.5]) {
        const gain = audio.createGain();
        gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + start + 0.03);
        gain.gain.setValueAtTime(0.18, audio.currentTime + start + 0.38);
        gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + 0.42);
        gain.connect(audio.destination);
        for (const f of [440, 480]) {
          const osc = audio.createOscillator();
          osc.frequency.value = f;
          osc.connect(gain);
          osc.start(audio.currentTime + start);
          osc.stop(audio.currentTime + start + 0.42);
        }
      }
    } catch {
      // no sound allowed yet
    }
    navigator.vibrate?.([400, 200, 400]);
  };
  beep();
  ringLoop = setInterval(beep, 2500);
}

watch(incoming, (call, old) => {
  ring(Boolean(call));
  // Opened from the notification's «رد»: answered at once.
  if (call && pendingAnswer === call.id) {
    pendingAnswer = null;
    answer();
    return;
  }
  if (call && call.id !== old?.id && document.visibilityState !== "visible" && !push.subscribed && "Notification" in window && Notification.permission === "granted") {
    new Notification(t("comm.incoming_title"), { body: `${call.initiator?.name ?? ""} — ${t(call.type === "video" ? "comm.video_call" : "comm.voice_call")}` });
  }
});

// ---------- joining and leaving ----------
watch(
  () => comm.call?.token,
  async (token) => {
    if (!token) return;
    notice.value = "";
    minimized.value = false;
    try {
      await joinCall(token, current.value?.type === "video", () => renewCallToken(current.value));
    } catch {
      notice.value = t(session.error === "permission" ? "comm.no_permission" : "comm.join_failed");
      await callAction(current.value, "leave");
      setTimeout(close, 2500);
      return;
    }
    seconds.value = 0;
    clearInterval(clock);
    clock = setInterval(() => (seconds.value += 1), 1000);
    clearTimeout(ringTimer);
    if (comm.call?.outgoing) {
      // Nobody answered: the call stops ringing on its own.
      ringTimer = setTimeout(async () => {
        if (current.value?.status === "ringing") {
          await callAction(current.value, "cancel");
          notice.value = t("comm.no_answer");
          setTimeout(close, 2000);
        }
      }, RING_SECONDS * 1000);
    }
  },
);

watch(
  () => current.value?.status,
  (status) => {
    if (finished({ status }) && comm.call) {
      notice.value = t(`comm.status_${status}`);
      setTimeout(close, 1800);
    }
  },
);

// The ring notification on this device goes when the call is answered or ends.
watch(
  () => current.value?.id,
  (id) => id && closeCallNotification(id),
);

async function close() {
  clearInterval(clock);
  clearTimeout(ringTimer);
  await leaveCall();
  comm.call = null;
  notice.value = "";
}

async function hangUp() {
  const call = current.value;
  if (call) await callAction(call, call.status === "ringing" && comm.call?.outgoing ? "cancel" : "leave");
  await close();
}

async function answer() {
  const call = incoming.value;
  ring(false);
  try {
    await acceptCall(call);
  } catch {
    notice.value = t("comm.status_ended");
  }
}

// ---------- the people on the screen ----------
const byUid = computed(() => Object.fromEntries((current.value?.participants ?? []).map((p) => [p.uid, p])));
const tiles = computed(() =>
  session.remotes.map((r) => ({ ...r, name: byUid.value[r.uid]?.name ?? "…", speaking: session.speaking === r.uid })),
);
const others = computed(() =>
  (current.value?.participants ?? []).filter((p) => !(p.type === comm.side && Number(p.id) === comm.myId)),
);
const title = computed(() => others.value.map((p) => p.name).join("، "));
const waitingFor = computed(() => others.value.filter((p) => p.status === "invited").length);
const clockText = computed(() => {
  const m = Math.floor(seconds.value / 60);
  const s = seconds.value % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
});
const gridClass = computed(() => `cm-grid--${Math.min(tiles.value.length + 1, 9)}`);

// Leaving the page leaves the call (the others see it at once).
const onUnload = () => {
  const call = current.value;
  if (!call || finished(call)) return;
  fetch(new URL(`api/communication/calls/${call.id}/leave`, axios.defaults.baseURL), {
    method: "POST",
    keepalive: true,
    headers: { Authorization: `Bearer ${tokenOf(comm.side)}`, Accept: "application/json" },
  }).catch(() => {});
};
// ---------- push notifications ----------
// ?call=ID (&answer=1): opened from a call's notification.
let pendingAnswer = null;
const showPushPrompt = computed(() => !push.dismissed && !comm.call && !incoming.value
  && ((push.supported && push.permission === "default") || (!push.supported && push.needsInstall)));
async function turnOnPush() {
  await enablePush();
  if (push.permission !== "default") dismissPush();
}
function onWorkerMessage(event) {
  const { type, action, data } = event.data || {};
  if (type !== "comm-notification" || !data) return;
  if (data.kind === "call" && data.call_id) {
    if (action === "answer") pendingAnswer = Number(data.call_id);
    loadRinging();
  } else if (data.url) {
    router.push(data.url);
  }
}
function fromNotification() {
  const id = Number(route.query.call);
  if (!id) return;
  if (route.query.answer) pendingAnswer = id;
  loadRinging();
  router.replace({ query: { ...route.query, call: undefined, answer: undefined } });
}
watch(() => comm.side, (side) => side && initPush(), { immediate: true });

onMounted(() => {
  window.addEventListener("beforeunload", onUnload);
  navigator.serviceWorker?.addEventListener("message", onWorkerMessage);
  fromNotification();
});
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", onUnload);
  navigator.serviceWorker?.removeEventListener("message", onWorkerMessage);
  ring(false);
});
</script>

<template>
  <!-- A call ringing for me -->
  <Transition name="cm-pop">
    <div v-if="incoming" class="cm-ring" role="alertdialog" :aria-label="$t('comm.incoming_title')">
      <span class="cm-ring__kind">{{ $t(incoming.type === "video" ? "comm.video_call" : "comm.voice_call") }}</span>
      <div class="cm-ring__pulse">{{ (incoming.initiator?.name || "?").charAt(0) }}</div>
      <div class="cm-ring__text">
        <strong>{{ incoming.initiator?.name }}</strong>
        <small v-if="incoming.initiator?.subtitle">{{ incoming.initiator.subtitle }}</small>
        <span>{{ $t("comm.incoming_title") }}…</span>
      </div>
      <div class="cm-ring__actions">
        <div>
          <button type="button" class="cm-ring__btn is-decline" :aria-label="$t('comm.decline')" @click="declineCall(incoming)"><i class="pi pi-phone" /></button>
          <span>{{ $t("comm.decline") }}</span>
        </div>
        <div>
          <button type="button" class="cm-ring__btn is-answer" :aria-label="$t('comm.answer')" @click="answer"><i :class="incoming.type === 'video' ? 'pi pi-video' : 'pi pi-phone'" /></button>
          <span>{{ $t("comm.answer") }}</span>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Turn on the notifications, so calls and messages arrive with the page in the background or closed -->
  <div v-if="showPushPrompt" class="cm-push" role="dialog">
    <i class="pi pi-bell" aria-hidden="true" />
    <span>{{ push.supported ? $t("comm.push_ask") : $t("comm.push_install_ios") }}</span>
    <Button v-if="push.supported" size="small" :label="$t('comm.push_on')" @click="turnOnPush" />
    <Button size="small" text severity="secondary" :label="$t('comm.push_later')" @click="dismissPush" />
  </div>

  <!-- The call I am in -->
  <div v-if="comm.call" class="cm-call" :class="{ 'is-min': minimized, 'is-video': session.video }">
    <header class="cm-call__head">
      <div>
        <strong>{{ title }}</strong>
        <span v-if="notice" class="cm-call__notice">{{ notice }}</span>
        <span v-else-if="current?.status === 'ringing'">{{ $t("comm.ringing") }}<template v-if="waitingFor > 1"> ({{ waitingFor }})</template></span>
        <span v-else-if="session.joined">{{ clockText }}</span>
        <span v-else>{{ $t("comm.connecting") }}</span>
      </div>
      <Button :icon="minimized ? 'pi pi-window-maximize' : 'pi pi-window-minimize'" text rounded severity="secondary"
        :aria-label="$t('comm.minimize')" @click="minimized = !minimized" />
    </header>

    <div v-show="!minimized" class="cm-grid" :class="gridClass">
      <VideoTile v-for="r in tiles" :key="r.uid" :track="r.hasVideo ? r.videoTrack : null" :name="r.name" :muted="!r.hasAudio" :speaking="r.speaking" />
      <VideoTile :track="session.camOn ? localVideoTrack() : null" :name="$t('comm.me')" :muted="!session.micOn" mine />
    </div>

    <footer class="cm-call__controls">
      <Button :icon="session.micOn ? 'pi pi-microphone' : 'pi pi-microphone-slash'" rounded :severity="session.micOn ? 'secondary' : 'warn'"
        :aria-label="$t('comm.mic')" @click="toggleMic" />
      <Button :icon="session.camOn ? 'pi pi-video' : 'pi pi-eye-slash'" rounded :severity="session.camOn ? 'secondary' : 'contrast'"
        :aria-label="$t('comm.camera')" @click="toggleCam" />
      <Button icon="pi pi-phone" class="cm-hangup" rounded severity="danger" :aria-label="$t('comm.hang_up')" @click="hangUp" />
    </footer>
  </div>
</template>

<style scoped>
/* The incoming call takes the whole screen, like a phone's. */
.cm-ring { position: fixed; z-index: 1300; inset: 0; background: radial-gradient(circle at 50% 30%, #1d6f79, #0f171b 70%); color: #fff;
  display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 12vh 24px 10vh; text-align: center; }
.cm-ring__kind { color: #cbd5e1; font-size: 0.95rem; letter-spacing: 0.02em; }
.cm-ring__pulse { width: 128px; height: 128px; border-radius: 50%; background: #135c65; color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 3rem; font-weight: 700; animation: cm-pulse 1.6s infinite; flex: none; border: 3px solid rgba(255, 255, 255, 0.25); }
.cm-ring__text { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.cm-ring__text strong { font-size: 1.8rem; }
.cm-ring__text small { color: #cbd5e1; }
.cm-ring__text span { color: #94a3b8; }
.cm-ring__actions { display: flex; gap: 72px; }
.cm-ring__actions > div { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #e2e8f0; }
.cm-ring__btn { width: 72px; height: 72px; border-radius: 50%; color: #fff; font-size: 1.7rem; display: flex; align-items: center; justify-content: center; }
.cm-ring__btn.is-decline { background: #dc2626; }
.cm-ring__btn.is-decline i { transform: rotate(135deg); }
.cm-ring__btn.is-answer { background: #16a34a; animation: cm-shake 1.2s infinite; }
@keyframes cm-shake { 0%, 60%, 100% { transform: rotate(0); } 70% { transform: rotate(-12deg); } 80% { transform: rotate(12deg); } 90% { transform: rotate(-8deg); } }
.cm-push { position: fixed; z-index: 1200; bottom: 90px; left: 50%; transform: translateX(-50%); width: min(520px, calc(100vw - 24px)); background: #fff;
  border-radius: 16px; box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2); padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
.cm-push > i { color: #b21553; font-size: 1.3rem; }
.cm-push > span { flex: 1; font-size: 0.9rem; }
@keyframes cm-pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.35); } 70% { box-shadow: 0 0 0 28px rgba(255, 255, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } }

.cm-call { position: fixed; z-index: 1250; inset: 0; background: #0f171b; color: #fff; display: flex; flex-direction: column; }
.cm-call.is-min { inset: auto; bottom: 16px; inset-inline-end: 16px; width: min(320px, calc(100vw - 24px)); border-radius: 18px; box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35); }
.cm-call__head { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; }
.cm-call__head > div { display: flex; flex-direction: column; }
.cm-call__head span { color: #cbd5e1; font-size: 0.9rem; }
.cm-call__notice { color: #fbbf24 !important; }
.cm-grid { flex: 1; display: grid; gap: 10px; padding: 10px 16px; grid-template-columns: 1fr; grid-auto-rows: minmax(140px, 1fr); }
.cm-grid--2 { grid-template-columns: 1fr 1fr; }
.cm-grid--3, .cm-grid--4 { grid-template-columns: 1fr 1fr; }
.cm-grid--5, .cm-grid--6, .cm-grid--7, .cm-grid--8, .cm-grid--9 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 640px) { .cm-grid--2 { grid-template-columns: 1fr; } .cm-grid--5, .cm-grid--6, .cm-grid--7, .cm-grid--8, .cm-grid--9 { grid-template-columns: 1fr 1fr; } }
.cm-call__controls { display: flex; justify-content: center; gap: 18px; padding: 14px; }
.cm-hangup :deep(.pi-phone) { transform: rotate(135deg); }
.cm-pop-enter-active, .cm-pop-leave-active { transition: all 0.2s ease; }
.cm-pop-enter-from, .cm-pop-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
