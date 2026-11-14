<script setup>
// One word of «مكتبة المفاهيم» for a line of the form (a child's reinforcer): the parent types, the library's matching
// words come up with their pictures, and the chosen one stays with its picture and name. A word the library does not
// have is simply kept as it was written.
import { computed, inject, onBeforeUnmount, ref } from "vue";
import axios from "axios";

const props = defineProps({
  // The line: { [field]: the word, concept_id?: the library's concept }.
  row: { type: Object, required: true },
  field: { type: String, default: "name" },
  inputId: { type: String, required: true },
  label: { type: String, default: "" },
});
const emit = defineEmits(["update"]);

// id => { word_ar, thumb }: the cards of the words already picked (filled by the page, added to on every pick).
const cards = inject("caseStudyConcepts", null);
const card = computed(() => (props.row.concept_id ? cards?.[props.row.concept_id] ?? { word_ar: props.row[props.field] } : null));

const results = ref([]);
const open = ref(false);
const searching = ref(false);
const searched = ref("");
const active = ref(-1);
const input = ref(null);
let timer = null;
let request = 0;

function typed(event) {
  const text = event.target.value;
  // Writing by hand: the line is no longer a library word.
  emit("update", { [props.field]: text === "" ? null : text, concept_id: null });
  clearTimeout(timer);
  const q = text.trim();
  if (q.length < 2) {
    results.value = [];
    open.value = false;
    return;
  }
  timer = setTimeout(() => search(q), 300);
}

async function search(q) {
  const mine = ++request;
  searching.value = true;
  try {
    const { data } = await axios.get("/api/parent/concepts/search", { params: { q } });
    if (mine !== request) return;
    results.value = (data.data ?? []).slice(0, 12);
    searched.value = q;
    active.value = -1;
    open.value = true;
  } catch {
    // The search is only a help: what was typed is kept either way.
    if (mine === request) open.value = false;
  } finally {
    if (mine === request) searching.value = false;
  }
}

function pick(item) {
  if (cards) cards[item.id] = { id: item.id, word_ar: item.word_ar, word_en: item.word_en, thumb: item.thumb };
  emit("update", { [props.field]: item.word_ar, concept_id: item.id });
  close();
}
function clear() {
  emit("update", { [props.field]: null, concept_id: null });
  requestAnimationFrame(() => input.value?.focus());
}
function close() {
  open.value = false;
  active.value = -1;
}
function key(event) {
  if (!open.value || !results.value.length) return;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    active.value = (active.value + step + results.value.length) % results.value.length;
  } else if (event.key === "Enter" && active.value >= 0) {
    event.preventDefault();
    pick(results.value[active.value]);
  } else if (event.key === "Escape") {
    close();
  }
}
// A press on a result lands before the field loses focus closes the list.
const blur = () => setTimeout(close, 180);
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="cp">
    <label class="cp__label" :for="inputId">{{ label }}</label>

    <!-- A library word: its picture and name -->
    <div v-if="card" class="cp__picked">
      <img v-if="card.thumb" class="cp__img" :src="card.thumb" alt="" loading="lazy">
      <span v-else class="cp__img cp__img--none" aria-hidden="true"><i class="pi pi-image" /></span>
      <span class="cp__word">{{ card.word_ar || row[field] }}</span>
      <button type="button" class="cp__change" :id="inputId" @click="clear"><i class="pi pi-times" /> {{ $t("cs.concept_change") }}</button>
    </div>

    <!-- Typing: the library's matches, or the text as it is -->
    <div v-else class="cp__box">
      <input :id="inputId" ref="input" class="cp__input" type="text" maxlength="500" autocomplete="off" role="combobox" aria-autocomplete="list"
        :aria-expanded="open" :aria-controls="`${inputId}-list`" :aria-activedescendant="active >= 0 ? `${inputId}-o${active}` : undefined"
        :value="row[field] ?? ''" :placeholder="$t('cs.concept_placeholder')" @input="typed" @keydown="key" @blur="blur" @focus="results.length && (open = true)">
      <i v-if="searching" class="pi pi-spin pi-spinner cp__spin" aria-hidden="true" />
      <div v-if="open" :id="`${inputId}-list`" class="cp__list" role="listbox">
        <button v-for="(item, index) in results" :id="`${inputId}-o${index}`" :key="item.id" type="button" role="option" class="cp__option"
          :class="{ 'is-active': index === active }" :aria-selected="index === active" @mousedown.prevent @click="pick(item)">
          <img v-if="item.thumb" class="cp__img" :src="item.thumb" alt="" loading="lazy">
          <span v-else class="cp__img cp__img--none" aria-hidden="true"><i class="pi pi-image" /></span>
          <span class="cp__option-text"><b>{{ item.word_ar }}</b><small>{{ item.set?.name_ar }}</small></span>
        </button>
        <p class="cp__note">{{ results.length ? $t("cs.concept_or_keep", { text: searched }) : $t("cs.concept_none", { text: searched }) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp {
  display: grid;
  gap: 0.35rem;
  min-width: 0;
}
.cp__label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.cp__box {
  position: relative;
}
.cp__input {
  width: 100%;
  min-height: 46px;
  padding: 0.55rem 0.85rem;
  border: 1.5px solid var(--cs-line, #e5e2e1);
  border-radius: 12px;
  background: #fff;
  color: var(--cs-ink, #1f1b1c);
  font: inherit;
}
.cp__input:focus-visible {
  outline: none;
  border-color: var(--cs-accent, #1c6772);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--cs-accent, #1c6772) 18%, transparent);
}
.cp__spin {
  position: absolute;
  inset-inline-end: 0.85rem;
  top: 15px;
  color: var(--cs-muted, #6f6669);
}
.cp__list {
  position: absolute;
  z-index: 20;
  inset-inline: 0;
  top: calc(100% + 6px);
  max-height: 320px;
  overflow-y: auto;
  padding: 0.35rem;
  border: 1.5px solid var(--cs-line, #e5e2e1);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 18px 40px -18px rgb(0 0 0 / 0.35);
}
.cp__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 56px;
  padding: 0.35rem 0.5rem;
  border: 0;
  border-radius: 10px;
  background: none;
  color: var(--cs-ink, #1f1b1c);
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.cp__option:hover,
.cp__option.is-active {
  background: color-mix(in srgb, var(--cs-accent, #1c6772) 9%, #fff);
}
.cp__option-text {
  display: grid;
  min-width: 0;
}
.cp__option-text small {
  color: var(--cs-muted, #6f6669);
}
.cp__img {
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: 10px;
  object-fit: cover;
  background: var(--cs-soft, #f6f3f2);
}
.cp__img--none {
  display: grid;
  place-items: center;
  color: var(--cs-muted, #9a9295);
}
.cp__note {
  margin: 0.25rem 0.5rem 0.35rem;
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--cs-muted, #6f6669);
}
.cp__picked {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 46px;
  padding: 0.3rem 0.4rem;
  border: 1.5px solid var(--cs-accent, #1c6772);
  border-radius: 12px;
  background: #fff;
}
.cp__word {
  flex: 1;
  min-width: 0;
  font-weight: 800;
  color: var(--cs-ink, #1f1b1c);
  overflow-wrap: anywhere;
}
.cp__change {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 44px;
  padding: 0 0.75rem;
  border: 0;
  border-radius: 10px;
  background: none;
  color: var(--cs-muted, #6f6669);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}
.cp__change:hover {
  background: var(--cs-soft, #f6f3f2);
  color: var(--cs-ink, #1f1b1c);
}
.cp__change:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--cs-accent, #1c6772) 35%, transparent);
}
</style>
