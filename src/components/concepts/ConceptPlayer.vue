<script setup>
// «مشغّل البطاقة»: one concept large in the middle (picture / drawn card 1 or 2, or its video), the word, sentence and
// question played in Arabic or English (the sound follows the picture shown: card 2 plays sentence 2), the vocalized
// text under it, and previous / next (buttons, arrow keys, a swipe). One sound at a time.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  concepts: { type: Array, required: true },
  index: { type: Number, default: 0 },
  kind: { type: String, default: "noun" },
});
const emit = defineEmits(["update:index", "close"]);

const { t, locale } = useI18n();
const lang = ref(locale.value === "en" ? "en" : "ar");
const variant = ref(1);
const showVideo = ref(false);
const showText = ref(true);
const playing = ref(null); // the role of the sound playing now
const video = ref(null);
const audio = new Audio();
audio.addEventListener("ended", () => (playing.value = null));
audio.addEventListener("pause", () => (playing.value = null));

const concept = computed(() => props.concepts[props.index] ?? null);
const media = computed(() => concept.value?.media ?? []);
const find = (role, { lang: l = null, variant: v = null } = {}) =>
  media.value.find((m) => m.role === role && (l === null || m.lang === l) && (v === null || m.variant === v) && !m.locked && m.url);

// Pictures (or the drawn cards, which stand in for them) by variant.
const pictures = computed(() => {
  const role = media.value.some((m) => m.role === "image" && m.url) ? "image" : "svg";
  return media.value.filter((m) => m.role === role && m.url && !m.locked).sort((a, b) => a.variant - b.variant);
});
const picture = computed(() => pictures.value.find((m) => m.variant === variant.value) ?? pictures.value[0] ?? null);
const videoItem = computed(() => find("video"));
const hasEnglish = computed(() => media.value.some((m) => m.lang === "en" && m.url));

// The sound for a role in the chosen language: the picture's own variant, else the first.
const sound = (role) => find(role, { lang: lang.value, variant: variant.value }) ?? find(role, { lang: lang.value });
const SOUNDS = [
  { role: "audio_word", label: "cl.word", icon: "pi pi-volume-up" },
  { role: "audio_sentence", label: "cl.sentence", icon: "pi pi-comment" },
  { role: "audio_question", label: "cl.question", icon: "pi pi-question-circle" },
];
const sounds = computed(() => SOUNDS.filter((s) => sound(s.role)));

const title = computed(() => (lang.value === "en" ? concept.value?.word_en || concept.value?.word_ar : concept.value?.word_ar_vocalized || concept.value?.word_ar));
// What is under the picture: the word, then the sentence and the question of this picture.
const lines = computed(() => ["audio_sentence", "audio_question"].map((role) => sound(role)?.text).filter(Boolean));

function stopSound() {
  audio.pause();
  playing.value = null;
}
function play(role) {
  const item = sound(role);
  if (!item) return;
  if (playing.value === role) return stopSound();
  audio.pause();
  audio.src = item.url;
  audio.currentTime = 0;
  playing.value = role;
  audio.play().catch(() => (playing.value = null));
}

function toggleVideo() {
  showVideo.value = !showVideo.value;
  stopSound();
}
// A verb's video is silent: its word is played with it. A feeling's or weather's video keeps the model's voice.
function onVideoPlay() {
  if (videoItem.value?.muted) play("audio_word");
}

function go(step) {
  const next = props.index + step;
  if (next < 0 || next >= props.concepts.length) return;
  emit("update:index", next);
}

watch(
  () => props.index,
  () => {
    stopSound();
    variant.value = 1;
    showVideo.value = false;
  },
);
watch(lang, stopSound);

function onKey(event) {
  if (["INPUT", "TEXTAREA"].includes(event.target?.tagName)) return;
  // Right-to-left: the right arrow goes back.
  if (event.key === "ArrowLeft") go(1);
  if (event.key === "ArrowRight") go(-1);
  if (event.key === " ") {
    event.preventDefault();
    play("audio_word");
  }
}
let touchX = null;
const onTouchStart = (event) => (touchX = event.touches[0].clientX);
function onTouchEnd(event) {
  if (touchX === null) return;
  const dx = event.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) > 50) go(dx < 0 ? -1 : 1);
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  stopSound();
  audio.src = "";
});
</script>

<template>
  <div v-if="concept" class="cp" dir="rtl">
    <header class="cp-head">
      <div class="cp-title">
        <h2 :dir="lang === 'en' ? 'ltr' : 'rtl'">{{ title }}</h2>
        <small>{{ index + 1 }} / {{ concepts.length }}</small>
      </div>
      <div class="cp-tools">
        <SelectButton v-if="hasEnglish" v-model="lang" :options="['ar', 'en']" :optionLabel="(o) => (o === 'ar' ? 'عربي' : 'English')" :allowEmpty="false" size="small" />
        <Button :icon="showText ? 'pi pi-eye' : 'pi pi-eye-slash'" variant="text" rounded severity="secondary" :aria-label="$t('cl.toggle_text')"
          v-tooltip.bottom="$t('cl.toggle_text')" @click="showText = !showText" />
        <Button icon="pi pi-times" variant="text" rounded severity="secondary" :aria-label="$t('close')" @click="emit('close')" />
      </div>
    </header>

    <div class="cp-stage" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <Button class="cp-nav cp-nav--prev" icon="pi pi-chevron-right" rounded severity="secondary" :disabled="index === 0" :aria-label="$t('cl.previous')" @click="go(-1)" />
      <div class="cp-picture" :class="{ 'is-card': picture?.role === 'svg' }">
        <video v-if="showVideo && videoItem" ref="video" :key="videoItem.url" :src="videoItem.url" :muted="videoItem.muted" controls autoplay playsinline
          @play="onVideoPlay" />
        <img v-else-if="picture" :key="picture.url" :src="picture.url" :alt="concept.word_ar" draggable="false" />
        <div v-else class="cp-empty"><i class="pi pi-lock" /> {{ $t("cl.no_picture") }}</div>
      </div>
      <Button class="cp-nav cp-nav--next" icon="pi pi-chevron-left" rounded severity="secondary" :disabled="index >= concepts.length - 1"
        :aria-label="$t('cl.next')" @click="go(1)" />
    </div>

    <div class="cp-variants">
      <template v-if="pictures.length > 1">
        <Button v-for="p in pictures" :key="p.variant" :label="String(p.variant)" size="small" :variant="variant === p.variant && !showVideo ? undefined : 'outlined'"
          :aria-label="$t('cl.picture_n', { n: p.variant })" @click="(variant = p.variant), (showVideo = false), stopSound()" />
      </template>
      <Button v-if="videoItem" icon="pi pi-video" :label="$t('cl.video')" size="small" :variant="showVideo ? undefined : 'outlined'" severity="help" @click="toggleVideo" />
    </div>

    <div class="cp-sounds">
      <Button v-for="s in sounds" :key="s.role" :icon="playing === s.role ? 'pi pi-stop' : s.icon" :label="$t(s.label)" size="large"
        :severity="playing === s.role ? 'danger' : undefined" @click="play(s.role)" />
    </div>

    <div v-if="showText && lines.length" class="cp-text" :dir="lang === 'en' ? 'ltr' : 'rtl'">
      <p v-for="line in lines" :key="line">{{ line }}</p>
    </div>
  </div>
</template>

<style scoped>
.cp {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  height: 100%;
}
.cp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.cp-title h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: rgb(var(--bp-135c65));
  line-height: 1.6;
}
.cp-title small {
  color: var(--p-text-muted-color);
}
.cp-tools {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.cp-stage {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-height: 0;
}
.cp-picture {
  flex: 1;
  aspect-ratio: 16 / 9;
  /* The sound buttons stay on screen under it, in the page and in the session's dialog. */
  max-height: max(180px, calc(100vh - 28rem));
  margin: 0 auto;
  border-radius: 18px;
  overflow: hidden;
  background: #f4f6f7;
  display: grid;
  place-items: center;
  user-select: none;
}
.cp-picture.is-card {
  background: #fff;
  border: 1px solid #e5e7eb;
}
.cp-picture {
  position: relative;
}
/* Fills the box whatever height it got, keeping the whole picture visible. */
.cp-picture img,
.cp-picture video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: inherit;
}
.cp-empty {
  color: var(--p-text-muted-color);
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.cp-nav {
  flex-shrink: 0;
}
.cp-variants,
.cp-sounds {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.cp-sounds :deep(.p-button) {
  min-width: 8.5rem;
}
.cp-text {
  text-align: center;
  font-size: 1.35rem;
  line-height: 2.1;
}
.cp-text p {
  margin: 0;
}
@media (max-width: 640px) {
  .cp-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    opacity: 0.85;
  }
  .cp-nav--prev {
    right: 0.25rem;
  }
  .cp-nav--next {
    left: 0.25rem;
  }
  .cp-sounds :deep(.p-button) {
    min-width: 0;
    flex: 1;
  }
  .cp-title h2 {
    font-size: 1.4rem;
  }
}
</style>
