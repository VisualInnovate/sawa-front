<script setup>
// «مكتبة المفاهيم من Enable 360»: the sets as cards, a set's words with a search, and the card player.
// One component for the library page and the session run page (embedded, inside a dialog; it does not change the URL).
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import ConceptPlayer from "./ConceptPlayer.vue";

const props = defineProps({ embedded: { type: Boolean, default: false } });

const { t, locale } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const sets = ref([]);
const set = ref(null);
const loading = ref(false);
const search = ref("");
const playing = ref(null); // index in the shown concepts, or null
const code = ref(props.embedded ? null : route.query.set ?? null);

const en = computed(() => locale.value === "en");
const setName = (s) => (en.value ? s?.name_en || s?.name_ar : s?.name_ar);
const wordOf = (c) => (en.value ? c.word_en || c.word_ar : c.word_ar);
const thumb = (c) => {
  const pictures = c.media.filter((m) => ["image", "svg"].includes(m.role) && m.url);
  return (pictures.find((m) => m.role === "image") ?? pictures[0])?.url ?? null;
};
const strip = (text) => (text ?? "").normalize("NFC").replace(/[ً-ْٰ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase();
const shown = computed(() => {
  const q = strip(search.value.trim());
  const list = set.value?.concepts ?? [];
  return q ? list.filter((c) => [c.word_ar, c.word_en, c.slug].some((w) => strip(w).includes(q))) : list;
});

const error = (e) => toast.add({ severity: "error", summary: t("error"), detail: e?.response?.data?.message ?? t("cl.load_failed"), life: 5000 });

async function loadSets() {
  loading.value = true;
  try {
    sets.value = (await axios.get("api/concepts/sets")).data.data;
  } catch (e) {
    error(e);
  } finally {
    loading.value = false;
  }
}
async function openSet(value) {
  code.value = value;
  search.value = "";
  playing.value = null;
  if (!value) return (set.value = null);
  loading.value = true;
  try {
    set.value = (await axios.get(`api/concepts/sets/${encodeURIComponent(value)}`)).data.data;
  } catch (e) {
    set.value = null;
    code.value = null;
    error(e);
  } finally {
    loading.value = false;
  }
}

// On the page the chosen set lives in the URL (back returns to the sets).
watch(code, (value) => {
  if (!props.embedded && route.query.set !== (value ?? undefined)) router.push({ query: value ? { set: value } : {} }).catch(() => {});
});
if (!props.embedded) {
  watch(
    () => route.query.set,
    (value) => value !== code.value && openSet(value ?? null),
  );
}

onMounted(() => {
  loadSets();
  if (code.value) openSet(code.value);
});
</script>

<template>
  <div class="cl">
    <!-- The player -->
    <div v-if="set && playing !== null" class="cl-player">
      <ConceptPlayer v-model:index="playing" :concepts="shown" :kind="set.kind" @close="playing = null" />
    </div>

    <!-- A set's words -->
    <template v-else-if="set">
      <div class="cl-bar">
        <Button icon="pi pi-arrow-right" :label="$t('cl.all_sets')" variant="text" severity="secondary" @click="openSet(null)" />
        <h3>{{ setName(set) }} <small>({{ set.concepts.length }})</small></h3>
        <IconField class="cl-search">
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" :placeholder="$t('cl.search')" :aria-label="$t('cl.search')" />
        </IconField>
      </div>
      <p v-if="!shown.length" class="cl-empty">{{ $t("cl.no_match") }}</p>
      <div class="cl-grid cl-grid--words">
        <button v-for="(c, i) in shown" :key="c.slug" type="button" class="cl-card" @click="playing = i">
          <span class="cl-thumb"><img v-if="thumb(c)" :src="thumb(c)" alt="" loading="lazy" /><i v-else class="pi pi-lock" /></span>
          <span class="cl-name">{{ wordOf(c) }}</span>
        </button>
      </div>
    </template>

    <!-- The sets -->
    <template v-else>
      <ProgressSpinner v-if="loading && !sets.length" class="w-3rem h-3rem" />
      <p v-else-if="!sets.length" class="cl-empty">{{ $t("cl.empty") }}</p>
      <div class="cl-grid">
        <button v-for="s in sets" :key="s.code" type="button" class="cl-card" :class="{ 'is-locked': s.locked }" :disabled="loading" @click="openSet(s.code)">
          <span class="cl-thumb"><img v-if="s.cover" :src="s.cover" alt="" loading="lazy" /><i v-else class="pi pi-images" /></span>
          <span class="cl-name">{{ setName(s) }}</span>
          <span class="cl-meta">
            {{ $t("cl.count", { n: s.concepts_count }) }}
            <i v-if="s.has_video" class="pi pi-video" v-tooltip.top="$t('cl.has_video')" />
            <i v-if="s.locked" class="pi pi-lock" />
          </span>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cl-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.cl-bar h3 {
  margin: 0;
  font-size: 1.25rem;
  color: rgb(var(--bp-135c65));
}
.cl-bar h3 small {
  color: var(--p-text-muted-color);
  font-weight: 400;
}
.cl-search {
  margin-inline-start: auto;
  width: min(18rem, 100%);
}
.cl-search :deep(input) {
  width: 100%;
}
.cl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 0.9rem;
}
.cl-grid--words {
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}
.cl-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.5rem 0.5rem 0.7rem;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  text-align: center;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}
.cl-card:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.cl-card.is-locked {
  opacity: 0.7;
}
.cl-thumb {
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: #f4f6f7;
  display: grid;
  place-items: center;
  color: var(--p-text-muted-color);
}
.cl-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.cl-name {
  font-weight: 700;
  font-size: 1.05rem;
}
.cl-meta {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--p-text-muted-color);
}
.cl-empty {
  color: var(--p-text-muted-color);
}
.cl-player {
  min-height: 70vh;
}
</style>
