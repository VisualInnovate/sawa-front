<script setup>
// «مكتبة المفاهيم من Enable 360»: the sets as cards under their groups (in teaching order, from the server), a filter by
// group / video and a search over the sets and every word; a set's words with a search, and the card player.
// The grids show small pictures (thumb) and add the words a page at a time as the list is scrolled, so a set opens fast.
// One component for the library page and the session run page (embedded, inside a dialog; it does not change the URL).
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useDebounceFn, useIntersectionObserver } from "@vueuse/core";
import ConceptPlayer from "./ConceptPlayer.vue";

const props = defineProps({ embedded: { type: Boolean, default: false } });

const PAGE = 24;

const { t, locale } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const sets = ref([]);
const groups = ref([]);
const set = ref(null);
const loading = ref(false);
const search = ref(""); // inside a set
const query = ref(""); // over the sets and every word
const group = ref("all");
const videoOnly = ref(false);
const found = ref([]);
const searching = ref(false);
const playing = ref(null); // index in the shown concepts, or null
const limit = ref(PAGE);
const more = ref(null);
const code = ref(props.embedded ? null : route.query.set ?? null);

const en = computed(() => locale.value === "en");
const nameOf = (item) => (en.value ? item?.name_en || item?.name_ar : item?.name_ar);
const wordOf = (c) => (en.value ? c.word_en || c.word_ar : c.word_ar);
const thumb = (c) => {
  const pictures = c.media.filter((m) => ["image", "svg"].includes(m.role) && (m.thumb || m.url));
  const picture = pictures.find((m) => m.role === "image") ?? pictures[0];
  return picture ? picture.thumb || picture.url : null;
};
// Arabic without its marks and with one alef / ya / ta marbuta (as the server's search), lower-case.
const plain = (text) =>
  (text ?? "").normalize("NFC").replace(/[ً-ْٰـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").toLowerCase();

// The sets page: filtered by group and video, shown under their groups (in the server's order).
const filteredSets = computed(() =>
  sets.value.filter((s) => (group.value === "all" || s.group === group.value) && (!videoOnly.value || s.has_video)),
);
const sections = computed(() =>
  groups.value.map((g) => ({ ...g, sets: filteredSets.value.filter((s) => s.group === g.key) })).filter((g) => g.sets.length),
);
const groupOptions = computed(() => [{ key: "all", label: t("cl.all_groups") }, ...groups.value.map((g) => ({ key: g.key, label: nameOf(g) }))]);
const q = computed(() => plain(query.value.trim()));
const setsFound = computed(() => (q.value ? filteredSets.value.filter((s) => [s.name_ar, s.name_en, s.code].some((w) => plain(w).includes(q.value))) : []));
const wordsFound = computed(() =>
  found.value.filter((w) => (group.value === "all" || w.set.group === group.value) && (!videoOnly.value || sets.value.find((s) => s.code === w.set.code)?.has_video)),
);

// A set's words: its search, then a page at a time.
const shown = computed(() => {
  const term = plain(search.value.trim());
  const list = set.value?.concepts ?? [];
  return term ? list.filter((c) => [c.word_ar, c.word_ar_vocalized, c.word_en, c.slug].some((w) => plain(w).includes(term))) : list;
});
const visible = computed(() => shown.value.slice(0, limit.value));
watch([search, set], () => (limit.value = PAGE));
useIntersectionObserver(more, ([entry]) => {
  if (entry?.isIntersecting) limit.value += PAGE;
}, { rootMargin: "300px" });

const error = (e) => toast.add({ severity: "error", summary: t("error"), detail: e?.response?.data?.message ?? t("cl.load_failed"), life: 5000 });

async function loadSets() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/concepts/sets");
    sets.value = data.data;
    groups.value = data.groups ?? [];
  } catch (e) {
    error(e);
  } finally {
    loading.value = false;
  }
}

const runSearch = useDebounceFn(async (value) => {
  try {
    const { data } = await axios.get("api/concepts/search", { params: { q: value } });
    if (value === query.value.trim()) found.value = data.data;
  } catch (e) {
    error(e);
  } finally {
    if (value === query.value.trim()) searching.value = false;
  }
}, 300);
watch(query, (value) => {
  const term = value.trim();
  if (!term) {
    found.value = [];
    searching.value = false;
    return;
  }
  searching.value = true;
  runSearch(term);
});

// slug: open the player on that word (a word picked from the search).
async function openSet(value, slug = null) {
  code.value = value;
  search.value = "";
  playing.value = null;
  if (!value) return (set.value = null);
  loading.value = true;
  try {
    set.value = (await axios.get(`api/concepts/sets/${encodeURIComponent(value)}`)).data.data;
    if (slug) {
      const index = set.value.concepts.findIndex((c) => c.slug === slug);
      if (index >= 0) playing.value = index;
    }
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
        <h3>{{ nameOf(set) }} <small>({{ set.concepts.length }})</small></h3>
        <IconField class="cl-search">
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" :placeholder="$t('cl.search')" :aria-label="$t('cl.search')" />
        </IconField>
      </div>
      <p v-if="!shown.length" class="cl-empty">{{ $t("cl.no_match") }}</p>
      <div class="cl-grid cl-grid--words">
        <button v-for="(c, i) in visible" :key="c.slug" type="button" class="cl-card" @click="playing = i">
          <span class="cl-thumb"><img v-if="thumb(c)" :src="thumb(c)" alt="" loading="lazy" decoding="async" /><i v-else class="pi pi-lock" /></span>
          <span class="cl-name">{{ wordOf(c) }}</span>
        </button>
      </div>
      <div v-if="visible.length < shown.length" ref="more" class="cl-more">
        <Button :label="$t('cl.load_more')" variant="text" severity="secondary" @click="limit += PAGE" />
      </div>
    </template>

    <!-- The sets -->
    <template v-else>
      <div class="cl-tools">
        <IconField class="cl-search cl-search--wide">
          <InputIcon :class="searching ? 'pi pi-spin pi-spinner' : 'pi pi-search'" />
          <InputText v-model="query" :placeholder="$t('cl.search_all')" :aria-label="$t('cl.search_all')" />
        </IconField>
        <SelectButton v-if="groups.length > 1" v-model="group" :options="groupOptions" optionLabel="label" optionValue="key" :allowEmpty="false" size="small" class="cl-groups" />
        <label class="cl-toggle">
          <ToggleSwitch v-model="videoOnly" inputId="cl-video-only" />
          <span><i class="pi pi-video" /> {{ $t("cl.video_only") }}</span>
        </label>
      </div>

      <ProgressSpinner v-if="loading && !sets.length" class="w-3rem h-3rem" />
      <p v-else-if="!sets.length" class="cl-empty">{{ $t("cl.empty") }}</p>

      <!-- Searching: the matching sets, then the matching words of every set -->
      <template v-else-if="q">
        <template v-if="setsFound.length">
          <h4 class="cl-heading">{{ $t("cl.sets_found") }} <small>({{ setsFound.length }})</small></h4>
          <div class="cl-grid">
            <button v-for="s in setsFound" :key="s.code" type="button" class="cl-card" :class="{ 'is-locked': s.locked }" :disabled="loading" @click="openSet(s.code)">
              <span class="cl-thumb"><img v-if="s.cover" :src="s.cover" alt="" loading="lazy" decoding="async" /><i v-else class="pi pi-images" /></span>
              <span class="cl-name">{{ nameOf(s) }}</span>
              <span class="cl-meta">{{ $t("cl.count", { n: s.concepts_count }) }}</span>
            </button>
          </div>
        </template>
        <template v-if="wordsFound.length">
          <h4 class="cl-heading">{{ $t("cl.words_found") }} <small>({{ wordsFound.length }})</small></h4>
          <div class="cl-grid cl-grid--words">
            <button v-for="w in wordsFound" :key="w.set.code + w.slug" type="button" class="cl-card" :disabled="loading" @click="openSet(w.set.code, w.slug)">
              <span class="cl-thumb"><img v-if="w.thumb" :src="w.thumb" alt="" loading="lazy" decoding="async" /><i v-else class="pi pi-lock" /></span>
              <span class="cl-name">{{ wordOf(w) }}</span>
              <span class="cl-meta">{{ nameOf(w.set) }}</span>
            </button>
          </div>
        </template>
        <p v-if="searching && !wordsFound.length" class="cl-empty">{{ $t("cl.searching") }}</p>
        <p v-else-if="!searching && !setsFound.length && !wordsFound.length" class="cl-empty">{{ $t("cl.nothing_found") }}</p>
      </template>

      <!-- Browsing: the groups in order -->
      <template v-else>
        <p v-if="!sections.length" class="cl-empty">{{ $t("cl.nothing_found") }}</p>
        <section v-for="g in sections" :key="g.key" class="cl-section">
          <h4 class="cl-heading">{{ nameOf(g) }} <small>({{ $t("cl.sets_n", { n: g.sets.length }) }})</small></h4>
          <div class="cl-grid">
            <button v-for="s in g.sets" :key="s.code" type="button" class="cl-card" :class="{ 'is-locked': s.locked }" :disabled="loading" @click="openSet(s.code)">
              <span class="cl-thumb"><img v-if="s.cover" :src="s.cover" alt="" loading="lazy" decoding="async" /><i v-else class="pi pi-images" /></span>
              <span class="cl-name">{{ nameOf(s) }}</span>
              <span class="cl-meta">
                {{ $t("cl.count", { n: s.concepts_count }) }}
                <i v-if="s.has_video" class="pi pi-video" v-tooltip.top="$t('cl.has_video')" />
                <i v-if="s.locked" class="pi pi-lock" />
              </span>
            </button>
          </div>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped>
.cl-bar,
.cl-tools {
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
.cl-bar h3 small,
.cl-heading small {
  color: var(--p-text-muted-color);
  font-weight: 400;
}
.cl-search {
  margin-inline-start: auto;
  width: min(18rem, 100%);
}
.cl-search--wide {
  margin-inline-start: 0;
  width: min(22rem, 100%);
}
.cl-search :deep(input) {
  width: 100%;
}
.cl-groups {
  flex-wrap: wrap;
}
.cl-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  color: var(--p-text-muted-color);
}
.cl-section + .cl-section {
  margin-top: 1.5rem;
}
.cl-heading {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: rgb(var(--bp-135c65));
}
.cl-grid + .cl-heading {
  margin-top: 1.5rem;
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
.cl-more {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.cl-empty {
  color: var(--p-text-muted-color);
}
.cl-player {
  min-height: 70vh;
}
</style>
