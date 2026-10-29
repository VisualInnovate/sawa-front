<script setup>
// A signature: drawn with a finger, pen or mouse, or a stamp image uploaded. v-model is a PNG/JPEG/WebP data URI (null
// while empty). The image never leaves the page until the form is sent.
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  modelValue: { type: String, default: null },
  maxKb: { type: Number, default: 1536 },
});
const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const mode = ref("draw");
const canvas = ref(null);
const uploaded = ref(null);
const error = ref("");
let ctx = null;
let drawing = false;
let drawn = false;
let last = null;

function setup() {
  const el = canvas.value;
  if (!el) return;
  const ratio = window.devicePixelRatio || 1;
  el.width = el.clientWidth * ratio;
  el.height = el.clientHeight * ratio;
  ctx = el.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.lineWidth = 2.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#0f172a";
  drawn = false;
}

const point = (e) => {
  const r = canvas.value.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
};
function down(e) {
  e.preventDefault();
  canvas.value.setPointerCapture?.(e.pointerId);
  drawing = true;
  last = point(e);
  ctx.beginPath();
  ctx.arc(last.x, last.y, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
}
function move(e) {
  if (!drawing) return;
  e.preventDefault();
  const p = point(e);
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  last = p;
  drawn = true;
}
function up() {
  if (!drawing) return;
  drawing = false;
  if (drawn) emit("update:modelValue", canvas.value.toDataURL("image/png"));
}

function clear() {
  uploaded.value = null;
  error.value = "";
  if (ctx) ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  drawn = false;
  emit("update:modelValue", null);
}

function upload(e) {
  const file = e.target.files?.[0];
  e.target.value = "";
  error.value = "";
  if (!file) return;
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    error.value = t("sig.bad_type");
    return;
  }
  if (file.size > props.maxKb * 1024) {
    error.value = t("sig.too_big", { kb: props.maxKb });
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    uploaded.value = reader.result;
    emit("update:modelValue", reader.result);
  };
  reader.readAsDataURL(file);
}

watch(mode, async () => {
  clear();
  await nextTick();
  if (mode.value === "draw") setup();
});
onMounted(() => nextTick(setup));
const onResize = () => mode.value === "draw" && !drawn && setup();
window.addEventListener("resize", onResize);
onBeforeUnmount(() => window.removeEventListener("resize", onResize));
</script>

<template>
  <div class="sp">
    <SelectButton v-model="mode" :options="[{ v: 'draw', l: t('sig.draw') }, { v: 'upload', l: t('sig.upload') }]" option-label="l" option-value="v" :allow-empty="false" size="small" />
    <div v-if="mode === 'draw'" class="sp-box">
      <canvas ref="canvas" class="sp-canvas" :aria-label="t('sig.draw_here')" role="img" @pointerdown="down" @pointermove="move" @pointerup="up" @pointerleave="up" @pointercancel="up" />
      <span v-if="!modelValue" class="sp-hint">{{ t("sig.draw_here") }}</span>
    </div>
    <div v-else class="sp-box sp-upload">
      <img v-if="uploaded" :src="uploaded" :alt="t('sig.preview')" />
      <label v-else class="sp-pick">
        <i class="pi pi-upload" aria-hidden="true" />
        <span>{{ t("sig.pick") }}</span>
        <input type="file" accept="image/png,image/jpeg,image/webp" class="sr-only" @change="upload" />
      </label>
    </div>
    <div class="flex items-center justify-between gap-2">
      <small v-if="error" class="p-error">{{ error }}</small>
      <small v-else class="text-color-secondary">{{ mode === "draw" ? t("sig.draw_tip") : t("sig.upload_tip") }}</small>
      <Button size="small" text icon="pi pi-eraser" :label="t('sig.clear')" @click="clear" />
    </div>
  </div>
</template>

<style scoped>
.sp { display: grid; gap: .5rem; }
.sp-box { position: relative; height: 180px; border: 2px dashed #cbd5e1; border-radius: 12px; background: #fff; overflow: hidden; }
.sp-canvas { width: 100%; height: 100%; touch-action: none; cursor: crosshair; display: block; }
.sp-hint { position: absolute; inset: 0; display: grid; place-items: center; color: #94a3b8; pointer-events: none; font-size: .9rem; }
.sp-upload { display: grid; place-items: center; }
.sp-upload img { max-width: 100%; max-height: 100%; object-fit: contain; }
.sp-pick { display: grid; place-items: center; gap: .35rem; color: #475569; cursor: pointer; padding: 1rem; text-align: center; }
.sp-pick:focus-within { outline: 2px solid rgb(var(--bp-135c65)); border-radius: 8px; }
.sr-only { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
</style>
