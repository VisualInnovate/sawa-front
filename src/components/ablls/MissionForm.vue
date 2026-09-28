<script setup>
// Create / edit form of one ABLLS mission (used by mission-create and mission-update).
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import BackButton from '@/components/common/BackButton.vue'
import './ablls.css'

const props = defineProps({ id: { type: [String, Number], default: null } })

const { t } = useI18n()
const toast = useToast()
const router = useRouter()

const isEdit = computed(() => !!props.id)
const loading = ref(true)
const saving = ref(false)
const categories = ref([])
const errors = ref({})
const mission = ref({ category_id: null, name: '', goal: '', question: '', sample: '', note: '', benchmarks: [] })
const draft = ref('')
const benchmarkInput = ref(null)

const selectedCategory = computed(() => categories.value.find((c) => c.id === mission.value.category_id))
const keyPreview = computed(() => {
  if (isEdit.value && mission.value.key) return mission.value.key
  return selectedCategory.value ? `${selectedCategory.value.symbol}-…` : t('ablls_ui.auto_key')
})
const degrees = computed(() => Array.from({ length: mission.value.benchmarks.length + 1 }, (_, i) => i))

const firstError = (field) => errors.value?.[field]?.[0]
const benchmarkError = computed(
  () => firstError('benchmarks') || Object.entries(errors.value || {}).find(([k]) => k.startsWith('benchmarks.'))?.[1]?.[0]
)

onMounted(async () => {
  try {
    const requests = [axios.get('/api/able-category')]
    if (isEdit.value) requests.push(axios.get(`/api/able-mission/${props.id}`))
    const [cats, one] = await Promise.all(requests)
    categories.value = cats.data.data || []
    if (one) {
      const data = one.data.data
      mission.value = {
        ...data,
        sample: data.sample ?? '',
        note: data.note ?? '',
        benchmarks: (data.benchmarks || []).map((b) => ({ body: b.body })),
      }
    } else if (categories.value.length === 1) {
      mission.value.category_id = categories.value[0].id
    }
  } finally {
    loading.value = false
  }
})

const addBenchmark = () => {
  const body = draft.value.trim()
  if (!body) return
  mission.value.benchmarks.push({ body })
  draft.value = ''
  delete errors.value.benchmarks
  nextTick(() => benchmarkInput.value?.$el?.focus?.())
}
const removeBenchmark = (i) => mission.value.benchmarks.splice(i, 1)
const moveBenchmark = (i, dir) => {
  const list = mission.value.benchmarks
  const j = i + dir
  if (j < 0 || j >= list.length) return
  ;[list[i], list[j]] = [list[j], list[i]]
}

const validate = () => {
  const e = {}
  for (const f of ['category_id', 'name', 'goal', 'question']) {
    const v = mission.value[f]
    if (v === null || v === undefined || String(v).trim() === '') e[f] = [t('ablls_ui.required')]
  }
  const list = mission.value.benchmarks.filter((b) => b.body.trim())
  if (!list.length) e.benchmarks = [t('ablls_ui.benchmarks_required')]
  errors.value = e
  return !Object.keys(e).length
}

const save = async () => {
  if (saving.value) return
  if (draft.value.trim()) addBenchmark()
  if (!validate()) {
    toast.add({ severity: 'warn', summary: t('ablls_ui.fix_errors'), life: 3000 })
    return
  }
  saving.value = true
  const m = mission.value
  const payload = {
    category_id: m.category_id,
    name: m.name.trim(),
    goal: m.goal.trim(),
    question: m.question.trim(),
    sample: m.sample?.trim() || null,
    note: m.note?.trim() || null,
    benchmarks: m.benchmarks.map((b) => ({ body: b.body.trim() })).filter((b) => b.body),
  }
  try {
    if (isEdit.value) await axios.put(`/api/able-mission/${props.id}`, payload)
    else await axios.post('/api/able-mission', payload)
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('ablls_ui.saved'), life: 3000 })
    router.push({ name: 'missions', query: { category: payload.category_id } })
  } catch (e) {
    errors.value = e.response?.data?.errors || {}
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="ab-page">
    <header class="mf-head">
      <div class="mf-head-main">
        <span class="mf-head-icon"><i :class="['pi', isEdit ? 'pi-pencil' : 'pi-plus']" aria-hidden="true" /></span>
        <div>
          <h1>{{ isEdit ? $t('ablls_ui.edit_mission') : $t('ablls_ui.new_mission') }}</h1>
          <p>{{ $t('ablls_ui.missions_title') }}</p>
        </div>
      </div>
      <BackButton :to="{ name: 'missions' }" />
    </header>

    <div v-if="loading" class="mf-layout">
      <div class="mf-main">
        <div class="mf-card"><Skeleton height="9rem" /></div>
        <div class="mf-card"><Skeleton height="16rem" /></div>
      </div>
      <div class="mf-side"><div class="mf-card"><Skeleton height="20rem" /></div></div>
    </div>

    <form v-else class="mf-layout" novalidate @submit.prevent="save">
      <div class="mf-main">
        <!-- basic info -->
        <section class="mf-card">
          <div class="mf-card-head">
            <span class="mf-step">1</span>
            <div>
              <h2>{{ $t('ablls_ui.basic_info') }}</h2>
              <p>{{ $t('ablls_ui.basic_info_hint') }}</p>
            </div>
          </div>

          <div class="mf-grid">
            <div class="ab-field">
              <label for="mf-category">{{ $t('category') }}<span class="ab-req">*</span></label>
              <Select
                v-model="mission.category_id"
                input-id="mf-category"
                :options="categories"
                option-value="id"
                option-label="title"
                filter
                :placeholder="$t('ablls_ui.choose_category')"
                :invalid="!!firstError('category_id')"
                fluid
              >
                <template #value="{ value, placeholder }">
                  <span v-if="selectedCategory && value" class="mf-cat-option">
                    <span class="ab-symbol is-sm">{{ selectedCategory.symbol }}</span>{{ selectedCategory.title }}
                  </span>
                  <span v-else>{{ placeholder }}</span>
                </template>
                <template #option="{ option }">
                  <span class="mf-cat-option">
                    <span class="ab-symbol is-sm">{{ option.symbol }}</span>{{ option.title }}
                  </span>
                </template>
              </Select>
              <small v-if="firstError('category_id')" class="ab-error">{{ firstError('category_id') }}</small>
            </div>

            <div class="ab-field">
              <label>{{ $t('ablls_ui.key') }}</label>
              <div class="mf-key">
                <i class="pi pi-key" aria-hidden="true" />
                <span :class="{ ltr: selectedCategory || isEdit }">{{ keyPreview }}</span>
              </div>
            </div>

            <div class="ab-field mf-span">
              <label for="mf-name">{{ $t('ablls_ui.mission_name') }}<span class="ab-req">*</span></label>
              <InputText id="mf-name" v-model="mission.name" :placeholder="$t('ablls_ui.mission_name_ph')" :invalid="!!firstError('name')" fluid />
              <small v-if="firstError('name')" class="ab-error">{{ firstError('name') }}</small>
            </div>
          </div>
        </section>

        <!-- details -->
        <section class="mf-card">
          <div class="mf-card-head">
            <span class="mf-step">2</span>
            <div>
              <h2>{{ $t('ablls_ui.details') }}</h2>
              <p>{{ $t('ablls_ui.details_hint') }}</p>
            </div>
          </div>

          <div class="mf-grid">
            <div class="ab-field">
              <label for="mf-goal"><i class="pi pi-flag mf-label-icon" aria-hidden="true" />{{ $t('ablls_ui.goal') }}<span class="ab-req">*</span></label>
              <Textarea id="mf-goal" v-model="mission.goal" rows="3" auto-resize :placeholder="$t('ablls_ui.goal_ph')" :invalid="!!firstError('goal')" fluid />
              <small v-if="firstError('goal')" class="ab-error">{{ firstError('goal') }}</small>
            </div>
            <div class="ab-field">
              <label for="mf-question"><i class="pi pi-comment mf-label-icon" aria-hidden="true" />{{ $t('ablls_ui.question') }}<span class="ab-req">*</span></label>
              <Textarea id="mf-question" v-model="mission.question" rows="3" auto-resize :placeholder="$t('ablls_ui.question_ph')" :invalid="!!firstError('question')" fluid />
              <small v-if="firstError('question')" class="ab-error">{{ firstError('question') }}</small>
            </div>
            <div class="ab-field">
              <label for="mf-sample"><i class="pi pi-lightbulb mf-label-icon" aria-hidden="true" />{{ $t('ablls_ui.sample') }}<span class="ab-opt">({{ $t('ablls_ui.optional') }})</span></label>
              <Textarea id="mf-sample" v-model="mission.sample" rows="3" auto-resize :placeholder="$t('ablls_ui.sample_ph')" fluid />
              <small v-if="firstError('sample')" class="ab-error">{{ firstError('sample') }}</small>
            </div>
            <div class="ab-field">
              <label for="mf-note"><i class="pi pi-bookmark mf-label-icon" aria-hidden="true" />{{ $t('ablls_ui.note') }}<span class="ab-opt">({{ $t('ablls_ui.optional') }})</span></label>
              <Textarea id="mf-note" v-model="mission.note" rows="3" auto-resize :placeholder="$t('ablls_ui.note_ph')" fluid />
              <small v-if="firstError('note')" class="ab-error">{{ firstError('note') }}</small>
            </div>
          </div>
        </section>
      </div>

      <!-- benchmarks -->
      <aside class="mf-side">
        <section class="mf-card mf-sticky">
          <div class="mf-card-head">
            <span class="mf-step">3</span>
            <div>
              <h2>
                {{ $t('ablls_ui.benchmarks') }}<span class="ab-req">*</span>
                <span class="mf-count">{{ mission.benchmarks.length }}</span>
              </h2>
              <p>{{ $t('ablls_ui.benchmarks_hint') }}</p>
            </div>
          </div>

          <div class="mf-add">
            <InputText
              ref="benchmarkInput"
              v-model="draft"
              :placeholder="$t('ablls_ui.benchmark_ph')"
              :invalid="!!benchmarkError"
              fluid
              @keydown.enter.prevent="addBenchmark"
            />
            <Button type="button" icon="pi pi-plus" :aria-label="$t('ablls_ui.add_benchmark')" v-tooltip.top="$t('ablls_ui.add_benchmark')" :disabled="!draft.trim()" @click="addBenchmark" />
          </div>
          <small v-if="benchmarkError" class="ab-error">{{ benchmarkError }}</small>

          <ol v-if="mission.benchmarks.length" class="mf-list">
            <li v-for="(b, i) in mission.benchmarks" :key="i" class="mf-item">
              <span class="mf-item-num">{{ i + 1 }}</span>
              <Textarea v-model="b.body" rows="1" auto-resize class="mf-item-input" :aria-label="`${$t('ablls_ui.benchmarks')} ${i + 1}`" />
              <div class="mf-item-actions">
                <Button type="button" icon="pi pi-chevron-up" text rounded size="small" severity="secondary" :disabled="i === 0" :aria-label="$t('ablls_ui.move_up')" @click="moveBenchmark(i, -1)" />
                <Button type="button" icon="pi pi-chevron-down" text rounded size="small" severity="secondary" :disabled="i === mission.benchmarks.length - 1" :aria-label="$t('ablls_ui.move_down')" @click="moveBenchmark(i, 1)" />
                <Button type="button" icon="pi pi-times" text rounded size="small" severity="danger" :aria-label="$t('ablls_ui.remove')" @click="removeBenchmark(i)" />
              </div>
            </li>
          </ol>
          <div v-else class="mf-list-empty">
            <i class="pi pi-list" aria-hidden="true" />
            {{ $t('ablls_ui.no_benchmarks') }}
          </div>

          <div class="mf-scale">
            <span>{{ $t('ablls_ui.degree_scale') }}</span>
            <div class="mf-scale-dots">
              <span v-for="d in degrees" :key="d" class="mf-dot" :class="{ 'is-zero': d === 0, 'is-max': d > 0 && d === degrees.length - 1 }">{{ d }}</span>
            </div>
          </div>

          <div class="mf-submit">
            <Button type="button" :label="$t('cancel')" severity="secondary" variant="outlined" @click="router.push({ name: 'missions' })" />
            <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" data-no-request-spinner />
          </div>
        </section>
      </aside>
    </form>
  </div>
</template>

<style scoped>
.mf-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  box-shadow: var(--sawa-shadow);
}
.mf-head-main {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.mf-head-icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 12px;
  background: var(--sawa-primary);
  color: #fff;
  font-size: 1.1rem;
}
.mf-head h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--sawa-primary);
}
.mf-head p {
  margin: 0;
  color: var(--sawa-muted);
  font-size: 0.85rem;
}

.mf-layout {
  display: grid;
  gap: 1rem;
  align-items: start;
}
@media (min-width: 1100px) {
  .mf-layout {
    grid-template-columns: minmax(0, 1.7fr) minmax(20rem, 1fr);
  }
  .mf-sticky {
    position: sticky;
    top: 1rem;
  }
}
.mf-main,
.mf-side {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.mf-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  box-shadow: var(--sawa-shadow);
}
.mf-card-head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid #f1f5f9;
}
.mf-card-head h2 {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--sawa-text);
}
.mf-card-head p {
  margin: 0.15rem 0 0;
  color: var(--sawa-muted);
  font-size: 0.83rem;
  line-height: 1.6;
}
.mf-step {
  flex: none;
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-weight: 800;
  font-size: 0.9rem;
}
.mf-count {
  margin-inline-start: 0.35rem;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-size: 0.78rem;
}

.mf-grid {
  display: grid;
  gap: 1rem 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}
.mf-span {
  grid-column: 1 / -1;
}
.mf-label-icon {
  margin-inline-end: 0.4rem;
  color: var(--sawa-primary);
  font-size: 0.85rem;
}
.mf-cat-option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.mf-key {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.6rem;
  padding: 0 0.85rem;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  background: #f8fafc;
  color: #334155;
  font-weight: 700;
}
.mf-key .pi {
  color: var(--sawa-muted);
  font-size: 0.85rem;
}

.mf-add {
  display: flex;
  gap: 0.5rem;
}
.mf-add .p-button {
  flex: none;
}
.mf-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 26rem;
  overflow-y: auto;
}
.mf-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.4rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fbfcfd;
  transition: border-color 0.15s;
}
.mf-item:focus-within {
  border-color: var(--sawa-primary);
  background: #fff;
}
.mf-item-num {
  flex: none;
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  margin-top: 0.3rem;
  border-radius: 8px;
  background: var(--sawa-primary);
  color: #fff;
  font-weight: 700;
  font-size: 0.82rem;
}
.mf-item-input {
  flex: 1;
  min-width: 0;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  resize: none;
}
.mf-item-input:focus {
  border-color: transparent;
  box-shadow: none;
}
.mf-item-actions {
  display: flex;
  flex: none;
}
.mf-item-actions .p-button {
  width: 1.9rem;
  height: 1.9rem;
}
.mf-list-empty {
  display: grid;
  justify-items: center;
  gap: 0.4rem;
  padding: 1.5rem 1rem;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  color: var(--sawa-muted);
  font-size: 0.85rem;
}
.mf-list-empty .pi {
  font-size: 1.4rem;
  color: #94a3b8;
}

.mf-scale {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-size: 0.85rem;
  font-weight: 700;
}
.mf-scale-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  direction: ltr;
}
.mf-dot {
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: #fff;
  color: var(--sawa-primary);
  font-size: 0.75rem;
}
.mf-dot.is-zero {
  color: var(--sawa-muted);
}
.mf-dot.is-max {
  background: var(--sawa-primary);
  color: #fff;
}

.mf-submit {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.5rem;
  padding-top: 0.25rem;
}
</style>
