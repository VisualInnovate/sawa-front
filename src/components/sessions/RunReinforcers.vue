<script setup>
// Step 2 of a session: the child's own reinforcers (add / rename / remove, kept for their next sessions) and a
// preference test on some of them:
// - paired: one pair at a time, the child takes one;
// - with replacement (MSW): every trial shows all of them, the taken one comes back;
// - without replacement (MSWO): the taken one leaves until one is left.
// The result ranks every item (never taken = 0 %) in three tiers. The test can be skipped.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import AutoComplete from "primevue/autocomplete";

const props = defineProps({
  sessionId: { type: [String, Number], required: true },
  canEdit: { type: Boolean, default: false },
  reinforcers: { type: Array, default: () => [] },
  tests: { type: Array, default: () => [] },
});
const emit = defineEmits(["update:reinforcers", "update:tests", "skip", "next"]);
const { t } = useI18n();
const toast = useToast();
const api = (path) => `api/program-sessions/${props.sessionId}/${path}`;
const letter = (i) => String.fromCharCode(65 + i);

// ---- the child's list ---------------------------------------------------------------------------
const newName = ref("");
const suggestions = ref([]);
const filtered = ref([]);
const editing = ref(null);
const busy = ref(false);

async function loadSuggestions() {
  if (suggestions.value.length || !props.canEdit) return;
  const { data } = await axios.get(api("reinforcers/suggestions"));
  suggestions.value = data.data ?? [];
}
const search = (event) => {
  const q = (event.query ?? "").trim();
  filtered.value = suggestions.value.filter((name) => !q || name.includes(q)).slice(0, 12);
};

async function add() {
  const name = (typeof newName.value === "string" ? newName.value : "").trim();
  if (!name || busy.value) return;
  busy.value = true;
  try {
    const { data } = await axios.post(api("reinforcers"), { name });
    emit("update:reinforcers", data.data);
    newName.value = "";
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    busy.value = false;
  }
}
async function rename(item, name) {
  editing.value = null;
  if (!name.trim() || name.trim() === item.name) return;
  const { data } = await axios.put(api(`reinforcers/${item.id}`), { name: name.trim() });
  emit("update:reinforcers", data.data);
}
async function remove(item) {
  const { data } = await axios.delete(api(`reinforcers/${item.id}`));
  emit("update:reinforcers", data.data);
  picked.value = picked.value.filter((id) => id !== item.id);
}

// ---- the test -----------------------------------------------------------------------------------
const METHODS = computed(() => [
  { key: "paired", icon: "pi pi-th-large", title: t("pref_paired"), hint: t("pref_paired_hint") },
  { key: "with_replacement", icon: "pi pi-replay", title: t("pref_with"), hint: t("pref_with_hint") },
  { key: "without_replacement", icon: "pi pi-sort-amount-down", title: t("pref_without"), hint: t("pref_without_hint") },
]);
const method = ref("paired");
const picked = ref([]);
const run = ref(null); // { type, items, answers, pairs?, remaining? }
const shownTest = ref(props.tests.length ? props.tests[props.tests.length - 1] : null);
watch(() => props.tests.length, () => { shownTest.value = props.tests[props.tests.length - 1] ?? null; });

const pickedItems = computed(() => props.reinforcers.filter((item) => picked.value.includes(item.id)).map((item) => item.name));
const toggle = (item) => {
  picked.value = picked.value.includes(item.id) ? picked.value.filter((id) => id !== item.id) : [...picked.value, item.id];
};

function pairsOf(n) {
  const pairs = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j]);
  return pairs;
}
function begin() {
  const items = pickedItems.value;
  run.value = { type: method.value, items, answers: [], pairs: method.value === "paired" ? pairsOf(items.length) : null };
}
const remaining = computed(() => (run.value ? run.value.items.map((_, i) => i).filter((i) => !run.value.answers.includes(i)) : []));
const currentPair = computed(() => run.value?.pairs?.[run.value.answers.length] ?? null);
const runProgress = computed(() => {
  if (!run.value) return 0;
  if (run.value.type === "paired") return run.value.answers.length / run.value.pairs.length;
  if (run.value.type === "without_replacement") return run.value.answers.length / Math.max(1, run.value.items.length - 1);
  return Math.min(1, run.value.answers.length / run.value.items.length);
});
const runDone = computed(() => {
  if (!run.value) return false;
  if (run.value.type === "paired") return run.value.answers.length === run.value.pairs.length;
  if (run.value.type === "without_replacement") return remaining.value.length <= 1;
  return run.value.answers.length >= run.value.items.length;
});
const choose = (i) => { if (!(run.value.type !== "with_replacement" && runDone.value)) run.value.answers.push(i); };
const undo = () => run.value.answers.pop();

const saving = ref(false);
async function finish() {
  saving.value = true;
  try {
    const { data } = await axios.post(api("preference-tests"), { type: run.value.type, items: run.value.items, answers: run.value.answers });
    emit("update:tests", [...props.tests, data.data]);
    run.value = null;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    saving.value = false;
  }
}
const pickCount = (i) => run.value?.answers.filter((a) => a === i).length ?? 0;
const TIER_LABEL = { highest: "pref_tier_highest", moderate: "pref_tier_moderate", lowest: "pref_tier_lowest" };
</script>

<template>
  <section class="rr-root">
    <div class="run-panel-head">
      <div>
        <h2>{{ $t("run_step_reinforcers") }}</h2>
        <p>{{ $t("rr_hint") }}</p>
      </div>
      <div class="flex gap-2">
        <Button icon="pi pi-forward" :label="$t('rr_skip')" severity="secondary" variant="outlined" @click="$emit('skip')" />
        <Button icon="pi pi-arrow-left" iconPos="right" :label="$t('rr_next')" :disabled="!!run" @click="$emit('next')" />
      </div>
    </div>

    <div class="rr-body">
      <!-- the child's reinforcers -->
      <aside class="rr-list">
        <header><i class="pi pi-heart-fill" /> {{ $t("rr_child_list") }} <span class="rr-count">{{ reinforcers.length }}</span></header>
        <form v-if="canEdit" class="rr-add" @submit.prevent="add">
          <AutoComplete v-model="newName" :suggestions="filtered" :placeholder="$t('rr_add_placeholder')" class="rr-add-input" fluid
            @complete="search" @focus="loadSuggestions" @option-select="add" />
          <Button type="submit" icon="pi pi-plus" :loading="busy" :aria-label="$t('add')" />
        </form>
        <TransitionGroup name="rr-item" tag="ul" class="rr-items">
          <li v-for="(item, i) in reinforcers" :key="item.id" class="rr-item" :class="{ 'is-picked': picked.includes(item.id) }">
            <button type="button" class="rr-check" :disabled="!!run" :aria-pressed="picked.includes(item.id)" @click="toggle(item)">
              <i :class="picked.includes(item.id) ? 'pi pi-check' : ''" />
            </button>
            <input v-if="editing === item.id" class="rr-edit" :value="item.name" autofocus @blur="rename(item, $event.target.value)"
              @keydown.enter.prevent="$event.target.blur()" @keydown.esc="editing = null" />
            <span v-else class="rr-name" @dblclick="canEdit && (editing = item.id)">{{ item.name }}</span>
            <span v-if="canEdit" class="rr-tools">
              <button type="button" :aria-label="$t('edit')" @click="editing = item.id"><i class="pi pi-pencil" /></button>
              <button type="button" class="is-danger" :aria-label="$t('delete')" @click="remove(item)"><i class="pi pi-trash" /></button>
            </span>
          </li>
        </TransitionGroup>
        <p v-if="!reinforcers.length" class="rr-empty"><i class="pi pi-inbox" /> {{ $t("rr_empty") }}</p>
      </aside>

      <!-- the test -->
      <div class="rr-stage">
        <Transition name="rr-fade" mode="out-in">
          <!-- choosing the method -->
          <div v-if="!run" key="setup" class="rr-setup">
            <div class="rr-methods">
              <button v-for="item in METHODS" :key="item.key" type="button" class="rr-method" :class="{ 'is-active': method === item.key }" @click="method = item.key">
                <i :class="item.icon" />
                <b>{{ item.title }}</b>
                <small>{{ item.hint }}</small>
              </button>
            </div>
            <div class="rr-setup-foot">
              <span>{{ $t("rr_picked", { count: picked.length }) }}</span>
              <Button icon="pi pi-play" :label="$t('rr_start_test')" :disabled="!canEdit || picked.length < 2 || picked.length > 12" @click="begin" />
            </div>

            <!-- the latest result of this session -->
            <div v-if="shownTest" class="rr-result">
              <header>
                <b>{{ $t("rr_result") }} · {{ METHODS.find((m) => m.key === shownTest.type)?.title }}</b>
                <span v-if="tests.length > 1" class="rr-history">
                  <button v-for="(test, i) in tests" :key="test.id" type="button" :class="{ 'is-active': test.id === shownTest.id }" @click="shownTest = test">{{ i + 1 }}</button>
                </span>
              </header>
              <TransitionGroup name="rr-bar" tag="ol" class="rr-ranking" appear>
                <li v-for="(row, i) in shownTest.result.ranking" :key="row.letter + shownTest.id" :class="`tier-${row.tier}`" :style="{ '--d': `${i * 60}ms` }">
                  <span class="rr-rank">{{ row.rank }}</span>
                  <span class="rr-letter ltr">{{ row.letter }}</span>
                  <span class="rr-bar-name">{{ row.name }}</span>
                  <span class="rr-bar"><span :style="{ width: `${row.percent}%` }" /></span>
                  <b class="rr-pct ltr">{{ row.percent }}%</b>
                  <Tag :value="$t(TIER_LABEL[row.tier])" :severity="row.tier === 'highest' ? 'success' : row.tier === 'lowest' ? 'danger' : 'warn'" />
                </li>
              </TransitionGroup>
            </div>
          </div>

          <!-- running it -->
          <div v-else key="run" class="rr-run">
            <div class="rr-run-head">
              <b>{{ METHODS.find((m) => m.key === run.type)?.title }}</b>
              <span class="rr-progress"><span :style="{ width: `${runProgress * 100}%` }" /></span>
              <span class="ltr text-sm">
                <template v-if="run.type === 'paired'">{{ run.answers.length }} / {{ run.pairs.length }}</template>
                <template v-else-if="run.type === 'with_replacement'">{{ $t("rr_trials", { count: run.answers.length }) }}</template>
                <template v-else>{{ run.answers.length }} / {{ run.items.length - 1 }}</template>
              </span>
            </div>

            <Transition name="rr-swap" mode="out-in">
              <div v-if="run.type === 'paired' && currentPair" :key="run.answers.length" class="rr-choices is-pair">
                <button v-for="i in currentPair" :key="i" type="button" class="rr-card" @click="choose(i)">
                  <span class="rr-card-letter ltr">{{ letter(i) }}</span><b>{{ run.items[i] }}</b>
                </button>
              </div>
              <TransitionGroup v-else-if="run.type === 'without_replacement' && !runDone" key="mswo" name="rr-out" tag="div" class="rr-choices">
                <button v-for="i in remaining" :key="i" type="button" class="rr-card" @click="choose(i)">
                  <span class="rr-card-letter ltr">{{ letter(i) }}</span><b>{{ run.items[i] }}</b>
                </button>
              </TransitionGroup>
              <div v-else-if="run.type === 'with_replacement'" key="msw" class="rr-choices">
                <button v-for="(name, i) in run.items" :key="i" type="button" class="rr-card" @click="choose(i)">
                  <span class="rr-card-letter ltr">{{ letter(i) }}</span><b>{{ name }}</b>
                  <span v-if="pickCount(i)" class="rr-card-count">{{ pickCount(i) }}</span>
                </button>
              </div>
              <div v-else key="done" class="rr-done"><i class="pi pi-check-circle" /> {{ $t("rr_test_done") }}</div>
            </Transition>

            <!-- the order taken (without replacement) -->
            <ol v-if="run.type === 'without_replacement' && run.answers.length" class="rr-order">
              <li v-for="(i, k) in run.answers" :key="k"><span class="ltr">{{ k + 1 }}.</span> {{ run.items[i] }}</li>
            </ol>

            <div class="rr-run-foot">
              <Button icon="pi pi-times" :label="$t('cancel')" variant="text" severity="secondary" @click="run = null" />
              <Button icon="pi pi-undo" :label="$t('rr_undo')" variant="outlined" severity="secondary" :disabled="!run.answers.length" @click="undo" />
              <Button icon="pi pi-check" :label="$t('rr_finish')" :disabled="!runDone" :loading="saving" @click="finish" />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rr-root { display: grid; grid-template-rows: auto 1fr; gap: .7rem; min-height: 0; }
.rr-body { display: grid; grid-template-columns: minmax(15rem, 22rem) 1fr; gap: .9rem; min-height: 0; }
.rr-list, .rr-stage { min-height: 0; border-radius: 16px; background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 8px 30px -24px rgb(15 23 42 / .5); }
.rr-list { display: flex; flex-direction: column; padding: .8rem; gap: .6rem; animation: rr-in .4s ease both; }
.rr-list header { display: flex; align-items: center; gap: .45rem; font-weight: 800; color: rgb(var(--bp-135c65)); }
.rr-list header .pi { color: #e11d48; }
.rr-count { margin-inline-start: auto; min-width: 1.6rem; padding: 0 .4rem; border-radius: 999px; background: #e0f2f1; text-align: center; font-size: .8rem; }
.rr-add { display: flex; gap: .4rem; }
.rr-add-input { flex: 1; min-width: 0; }
.rr-items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .35rem; min-height: 0; overflow: hidden; }
.rr-item { display: flex; align-items: center; gap: .5rem; padding: .4rem .5rem; border-radius: 10px; background: #f8fafc; border: 1px solid transparent; transition: all .2s; }
.rr-item:hover { border-color: #99f6e4; background: #f0fdfa; }
.rr-item.is-picked { background: #ecfdf5; border-color: #34d399; }
.rr-check { width: 1.4rem; height: 1.4rem; border-radius: 7px; border: 2px solid #94a3b8; background: #fff; display: grid; place-items: center; color: #fff; font-size: .7rem; cursor: pointer; transition: all .2s; }
.rr-item.is-picked .rr-check { background: #10b981; border-color: #10b981; transform: scale(1.08); }
.rr-name { flex: 1; font-weight: 600; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rr-edit { flex: 1; border: 0; border-bottom: 2px solid #14b8a6; background: transparent; font: inherit; outline: none; }
.rr-tools { display: flex; gap: .15rem; opacity: 0; transition: opacity .2s; }
.rr-item:hover .rr-tools { opacity: 1; }
.rr-tools button { border: 0; background: none; color: #64748b; cursor: pointer; padding: .2rem; border-radius: 6px; }
.rr-tools button:hover { background: #e2e8f0; }
.rr-tools .is-danger:hover { background: #fee2e2; color: #b91c1c; }
.rr-empty { margin: auto; color: #94a3b8; display: flex; align-items: center; gap: .4rem; }
.rr-stage { padding: 1rem; overflow: hidden; animation: rr-in .4s .08s ease both; }
.rr-setup, .rr-run { height: 100%; display: flex; flex-direction: column; gap: .9rem; min-height: 0; }
.rr-methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; }
.rr-method { display: flex; flex-direction: column; align-items: flex-start; gap: .3rem; padding: .9rem; border-radius: 14px; border: 2px solid #e2e8f0; background: #fff;
  cursor: pointer; text-align: start; font: inherit; transition: transform .2s, border-color .2s, box-shadow .2s; }
.rr-method i { font-size: 1.3rem; color: #0f8a7e; }
.rr-method small { color: #64748b; line-height: 1.5; }
.rr-method:hover { transform: translateY(-3px); box-shadow: 0 12px 24px -18px rgb(15 23 42 / .6); }
.rr-method.is-active { border-color: #0f8a7e; background: linear-gradient(160deg, #f0fdfa, #fff); box-shadow: 0 0 0 4px rgb(15 138 126 / .12); }
.rr-setup-foot { display: flex; align-items: center; justify-content: space-between; color: #475569; }
.rr-result { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: .5rem; padding: .8rem; border-radius: 14px; background: #f8fafc; }
.rr-result header { display: flex; align-items: center; justify-content: space-between; color: rgb(var(--bp-135c65)); }
.rr-history { display: flex; gap: .25rem; }
.rr-history button { width: 1.6rem; height: 1.6rem; border-radius: 50%; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; font-size: .75rem; }
.rr-history button.is-active { background: rgb(var(--bp-135c65)); color: #fff; border-color: rgb(var(--bp-135c65)); }
.rr-ranking { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .35rem; overflow: hidden; }
.rr-ranking li { display: grid; grid-template-columns: 1.6rem 1.8rem minmax(6rem, 10rem) 1fr 3.6rem auto; align-items: center; gap: .5rem; padding: .3rem .5rem;
  border-radius: 10px; background: #fff; }
.rr-rank { font-weight: 800; color: #94a3b8; text-align: center; }
.rr-letter { width: 1.6rem; height: 1.6rem; border-radius: 8px; display: grid; place-items: center; background: #e0f2f1; color: rgb(var(--bp-135c65)); font-weight: 800; }
.rr-bar-name { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rr-bar { height: .55rem; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
.rr-bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #f59e0b, #fbbf24); animation: rr-grow .9s var(--d) cubic-bezier(.22, 1, .36, 1) both; }
.tier-highest .rr-bar span { background: linear-gradient(90deg, #059669, #34d399); }
.tier-lowest .rr-bar span { background: linear-gradient(90deg, #e11d48, #fb7185); }
.rr-pct { text-align: end; color: #0f172a; }
.rr-run-head { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: .8rem; color: rgb(var(--bp-135c65)); }
.rr-progress { height: .5rem; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
.rr-progress span { display: block; height: 100%; background: linear-gradient(90deg, #0f8a7e, #34d399); transition: width .35s ease; }
.rr-choices { flex: 1; min-height: 0; display: flex; flex-wrap: wrap; align-content: center; justify-content: center; gap: 1rem; }
.rr-choices.is-pair { gap: 2.5rem; }
.rr-card { position: relative; width: 11rem; height: 9rem; border-radius: 20px; border: 2px solid #e2e8f0; background: #fff; cursor: pointer; font: inherit;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .5rem; box-shadow: 0 14px 30px -22px rgb(15 23 42 / .6);
  transition: transform .2s cubic-bezier(.34, 1.56, .64, 1), border-color .2s, box-shadow .2s; }
.is-pair .rr-card { width: 15rem; height: 12rem; font-size: 1.2rem; }
.rr-card:hover { transform: translateY(-6px) scale(1.03); border-color: #0f8a7e; box-shadow: 0 22px 40px -24px rgb(15 138 126 / .8); }
.rr-card:active { transform: scale(.96); }
.rr-card-letter { width: 2.4rem; height: 2.4rem; border-radius: 12px; display: grid; place-items: center; background: rgb(var(--bp-135c65)); color: #fff; font-weight: 800; }
.rr-card-count { position: absolute; top: .5rem; inset-inline-end: .5rem; min-width: 1.6rem; height: 1.6rem; border-radius: 999px; background: #10b981; color: #fff;
  display: grid; place-items: center; font-weight: 800; animation: rr-pop .3s cubic-bezier(.34, 1.56, .64, 1); }
.rr-done { flex: 1; display: grid; place-items: center; font-size: 1.3rem; color: #059669; animation: rr-pop .4s ease; }
.rr-done i { font-size: 3rem; }
.rr-order { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0; padding: 0; list-style: none; }
.rr-order li { padding: .2rem .6rem; border-radius: 999px; background: #e0f2f1; color: rgb(var(--bp-135c65)); font-size: .85rem; animation: rr-pop .25s ease; }
.rr-run-foot { display: flex; justify-content: flex-end; gap: .5rem; }
.rr-fade-enter-active, .rr-fade-leave-active { transition: opacity .25s, transform .25s; }
.rr-fade-enter-from, .rr-fade-leave-to { opacity: 0; transform: translateY(10px); }
.rr-swap-enter-active { transition: all .3s cubic-bezier(.22, 1, .36, 1); }
.rr-swap-leave-active { transition: all .18s ease-in; }
.rr-swap-enter-from { opacity: 0; transform: scale(.9); }
.rr-swap-leave-to { opacity: 0; transform: scale(1.05); }
.rr-out-leave-active { transition: all .35s ease; position: absolute; }
.rr-out-leave-to { opacity: 0; transform: translateY(-30px) scale(.8); }
.rr-out-move { transition: transform .35s ease; }
.rr-item-enter-active, .rr-item-leave-active { transition: all .3s ease; }
.rr-item-enter-from, .rr-item-leave-to { opacity: 0; transform: translateX(20px); }
@keyframes rr-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes rr-grow { from { width: 0; } }
@keyframes rr-pop { from { transform: scale(.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
