<script setup>
// Over every page (dashboard and parents' portal): a call ringing for me, and the window of the call I am in.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import axios from "axios";
import { comm, acceptCall, declineCall, callAction, renewCallToken, tokenOf } from "@/utils/communication";
import { session, joinCall, leaveCall, toggleMic, toggleCam, localVideoTrack } from "@/utils/agoraCall";
import VideoTile from "./VideoTile.vue";

const { t } = useI18n();
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
  const beep = () => {
    try {
      audio ??= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = 520;
      gain.gain.value = 0.06;
      osc.connect(gain).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + 0.35);
    } catch {
      // no sound allowed yet
    }
  };
  beep();
  ringLoop = setInterval(beep, 1500);
}

watch(incoming, (call, old) => {
  ring(Boolean(call));
  if (call && call.id !== old?.id && document.visibilityState !== "visible" && "Notification" in window && Notification.permission === "granted") {
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
onMounted(() => window.addEventListener("beforeunload", onUnload));
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", onUnload);
  ring(false);
});
</script>

<template>
  <!-- A call ringing for me -->
  <Transition name="cm-pop">
    <div v-if="incoming" class="cm-ring" role="alertdialog" :aria-label="$t('comm.incoming_title')">
      <div class="cm-ring__pulse"><i :class="incoming.type === 'video' ? 'pi pi-video' : 'pi pi-phone'" /></div>
      <div class="cm-ring__text">
        <strong>{{ incoming.initiator?.name }}</strong>
        <span>{{ $t(incoming.type === "video" ? "comm.incoming_video" : "comm.incoming_voice") }}</span>
        <small v-if="incoming.initiator?.subtitle">{{ incoming.initiator.subtitle }}</small>
      </div>
      <div class="cm-ring__actions">
        <Button icon="pi pi-times" rounded severity="danger" :aria-label="$t('comm.decline')" @click="declineCall(incoming)" />
        <Button :icon="incoming.type === 'video' ? 'pi pi-video' : 'pi pi-phone'" rounded severity="success" :aria-label="$t('comm.answer')" @click="answer" />
      </div>
    </div>
  </Transition>

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
.cm-ring { position: fixed; z-index: 1300; top: 18px; inset-inline-end: 18px; width: min(360px, calc(100vw - 24px)); background: #fff; border-radius: 18px; box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22); padding: 14px; display: flex; align-items: center; gap: 12px; }
.cm-ring__pulse { width: 52px; height: 52px; border-radius: 50%; background: #135c65; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; animation: cm-pulse 1.4s infinite; flex: none; }
.cm-ring__text { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.cm-ring__text small { color: #64748b; }
.cm-ring__actions { display: flex; gap: 8px; }
@keyframes cm-pulse { 0% { box-shadow: 0 0 0 0 rgba(19, 92, 101, 0.5); } 70% { box-shadow: 0 0 0 14px rgba(19, 92, 101, 0); } 100% { box-shadow: 0 0 0 0 rgba(19, 92, 101, 0); } }

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
