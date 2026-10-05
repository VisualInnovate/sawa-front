<script setup>
// Create / edit form of one ABLLS skill (used by mission-create and mission-update). The inputs follow the
// domain type: academic preparation keeps strengths/weaknesses, goals and questions; math, reading and
// spelling keep one long-term goal and sub goals. Every skill has a criterion (the scores it can get).
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import BackButton from '@/components/common/BackButton.vue'
import ListEditor from './ListEditor.vue'
import { CRITERIA_OPTIONS, isAcademic, listOf, nextSkillKey, typeIcon, typeOf, typeOrder } from './abllsTypes'
import './ablls.css'

const props = defineProps({ id: { type: [String, Number], default: null } })

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!props.id)
const loading = ref(true)
const saving = ref(false)
const categories = ref([])
const missions = ref([])
const errors = ref({})
const legacy = ref(false)
const original = ref(null)
const mission = ref({
  category_id: null,
  key: '',
  name: '',
  criteria: [],
  strengths: [],
  goals: [],
  questions: [],
  long_term_goal: '',
  sub_goals: [],
})
const editors = ref([])

const sortedCategories = computed(() =>
  [...categories.value].sort((a, b) => typeOrder(typeOf(a)) - typeOrder(typeOf(b)))
)
const selectedCategory = computed(() => categories.value.find((c) => c.id === mission.value.category_id))
const academic = computed(() => isAcademic(selectedCategory.value))

// The code the backend gives when the field is left empty.
const suggestedKey = computed(() => {
  const cat = selectedCategory.value
  if (!cat) return t('ablls_ui.auto_key')
  if (isEdit.value && original.value?.category_id === cat.id && original.value.key) return original.value.key
  const keys = missions.value.filter((m) => m.category_id === cat.id && m.id !== original.value?.id).map((m) => m.key)
  return nextSkillKey(cat, keys)
})
const codePrefix = computed(() => (mission.value.key || '').trim() || (selectedCategory.value ? suggestedKey.value : ''))
const scale = computed(() => [0, ...[...mission.value.criteria].sort((a, b) => a - b)])

const firstError = (field) =>
  errors.value?.[field]?.[0] || Object.entries(errors.value || {}).find(([k]) => k.startsWith(`${field}.`))?.[1]?.[0]

onMounted(async () => {
  try {
    const requests = [
      axios.get('/api/able-category'),
      axios.get('/api/able-mission').catch(() => ({ data: { data: [] } })),
    ]
    if (isEdit.value) requests.push(axios.get(`/api/able-mission/${props.id}`))
    const [cats, all, one] = await Promise.all(requests)
    categories.value = cats.data.data || []
    missions.value = all.data.data || []
    if (one) {
      const data = one.data.data
      original.value = data
      const criteria = (data.criteria || []).map(Number)
      legacy.value = !criteria.length
      const benchmarks = (data.benchmarks || []).length || Math.max(0, String(data.degree || '').length - 1)
      mission.value = {
        category_id: data.category_id,
        key: data.key || '',
        name: data.name || '',
        criteria: criteria.length ? criteria : Array.from({ length: Math.min(benchmarks, 9) }, (_, i) => i + 1),
        strengths: [...(data.strengths || [])],
        goals: listOf(data, 'goals', 'goal'),
        questions: listOf(data, 'questions', 'question'),
        long_term_goal: data.long_term_goal || (data.goal && !(data.goals || []).length ? data.goal : '') || '',
        sub_goals: [...(data.sub_goals || [])],
      }
    } else {
      const fromQuery = Number(route.query.category)
      if (categories.value.some((c) => c.id === fromQuery)) mission.value.category_id = fromQuery
      else if (categories.value.length === 1) mission.value.category_id = categories.value[0].id
    }
  } finally {
    loading.value = false
  }
})

const toggleCriterion = (n) => {
  const list = mission.value.criteria
  mission.value.criteria = list.includes(n) ? list.filter((x) => x !== n) : [...list, n].sort((a, b) => a - b)
  delete errors.value.criteria
}

const clearError = (field) => {
  delete errors.value[field]
}

const validate = () => {
  const e = {}
  const m = mission.value
  if (!m.category_id) e.category_id = [t('ablls_ui.required')]
  if (!m.name.trim()) e.name = [t('ablls_ui.required')]
  if (!m.criteria.length) e.criteria = [t('ablls_ui.criteria_required')]
  const lists = academic.value ? ['strengths', 'goals', 'questions'] : ['sub_goals']
  for (const f of lists) if (!m[f].some((x) => x.trim())) e[f] = [t('ablls_ui.list_required')]
  if (!academic.value && !m.long_term_goal.trim()) e.long_term_goal = [t('ablls_ui.required')]
  errors.value = e
  return !Object.keys(e).length
}

const save = async () => {
  if (saving.value) return
  editors.value.forEach((ed) => ed?.flush?.())
  if (!validate()) {
    toast.add({ severity: 'warn', summary: t('ablls_ui.fix_errors'), life: 3000 })
    return
  }
  saving.value = true
  const m = mission.value
  const clean = (list) => list.map((x) => x.trim()).filter(Boolean)
  const payload = {
    category_id: m.category_id,
    key: m.key.trim() || null,
    name: m.name.trim(),
    criteria: m.criteria,
    ...(academic.value
      ? { strengths: clean(m.strengths), goals: clean(m.goals), questions: clean(m.questions) }
      : { long_term_goal: m.long_term_goal.trim(), sub_goals: clean(m.sub_goals) }),
  }
  try {
    if (isEdit.value) await axios.put(`/api/able-mission/${props.id}`, payload)
    else await axios.post('/api/able-mission', payload)
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('ablls_ui.saved'), life: 3000 })
    router.push({ name: 'missions', query: { category: payload.category_id } })
  } catch (e) {
    errors.value = e.response?.data?.errors || {}
    if (!e.response?.data?.errors) toast.add({ severity: 'error', summary: t('error'), detail: e.response?.data?.message || e.message, life: 4000 })
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
      <div class="mf-side"><div class="mf-card"><Skeleton height="14rem" /></div></div>
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
            <div class="ab-field mf-span">
              <label for="mf-category">{{ $t('ablls_ui.domain') }}<span class="ab-req">*</span></label>
              <Select
                v-model="mission.category_id"
                input-id="mf-category"
                :options="sortedCategories"
                option-value="id"
                option-label="title"
                filter
                :filter-fields="['title', 'symbol']"
                :placeholder="$t('ablls_ui.choose_category')"
                :invalid="!!firstError('category_id')"
                fluid
                @change="clearError('category_id')"
              >
                <template #value="{ value, placeholder }">
                  <span v-if="selectedCategory && value" class="mf-cat-option">
                    <span class="ab-symbol is-sm">{{ selectedCategory.symbol }}</span>{{ selectedCategory.title }}
                    <span class="ab-type-tag">{{ $t(`ablls_ui.types.${typeOf(selectedCategory)}`) }}</span>
                  </span>
                  <span v-else>{{ placeholder }}</span>
                </template>
                <template #option="{ option }">
                  <span class="mf-cat-option">
                    <span class="ab-symbol is-sm">{{ option.symbol }}</span>{{ option.title }}
                    <span class="ab-type-tag"><i :class="typeIcon(typeOf(option))" aria-hidden="true" />{{ $t(`ablls_ui.types.${typeOf(option)}`) }}</span>
                  </span>
                </template>
              </Select>
              <small v-if="firstError('category_id')" class="ab-error">{{ firstError('category_id') }}</small>
            </div>

            <div class="ab-field">
              <label for="mf-name">{{ $t('ablls_ui.mission_name') }}<span class="ab-req">*</span></label>
              <InputText id="mf-name" v-model="mission.name" :placeholder="$t('ablls_ui.mission_name_ph')" :invalid="!!firstError('name')" fluid @input="clearError('name')" />
              <small v-if="firstError('name')" class="ab-error">{{ firstError('name') }}</small>
            </div>

            <div class="ab-field">
              <label for="mf-key">{{ $t('ablls_ui.key') }}</label>
              <IconField>
                <InputIcon class="pi pi-key" />
                <InputText id="mf-key" v-model="mission.key" class="ltr" maxlength="50" :placeholder="suggestedKey" :disabled="!selectedCategory" :invalid="!!firstError('key')" fluid />
              </IconField>
              <small v-if="firstError('key')" class="ab-error">{{ firstError('key') }}</small>
              <small v-else class="ab-hint">{{ $t('ablls_ui.key_hint') }}</small>
            </div>
          </div>
        </section>

        <!-- type-specific details -->
        <section class="mf-card">
          <div class="mf-card-head">
            <span class="mf-step">2</span>
            <div>
              <h2>
                {{ $t('ablls_ui.details') }}
                <span v-if="selectedCategory" class="ab-type-tag">
                  <i :class="typeIcon(typeOf(selectedCategory))" aria-hidden="true" />{{ $t(`ablls_ui.types.${typeOf(selectedCategory)}`) }}
                </span>
              </h2>
              <p>{{ selectedCategory ? $t(`ablls_ui.types_hint.${typeOf(selectedCategory)}`) : $t('ablls_ui.choose_category_first') }}</p>
            </div>
          </div>

          <Message v-if="legacy" severity="info" size="small" :closable="false">{{ $t('ablls_ui.legacy_note') }}</Message>

          <div v-if="!selectedCategory" class="mf-placeholder">
            <i class="pi pi-arrow-up" aria-hidden="true" />
            {{ $t('ablls_ui.choose_category_first') }}
          </div>

          <div v-else-if="academic" class="mf-lists">
            <ListEditor
              :ref="(el) => (editors[0] = el)"
              v-model="mission.strengths"
              :label="$t('ablls_ui.strengths')"
              icon="pi pi-chart-bar"
              :placeholder="$t('ablls_ui.strengths_ph')"
              :prefix="codePrefix"
              :error="firstError('strengths')"
              required
              @change="clearError('strengths')"
            />
            <ListEditor
              :ref="(el) => (editors[1] = el)"
              v-model="mission.goals"
              :label="$t('ablls_ui.goals')"
              icon="pi pi-flag"
              :placeholder="$t('ablls_ui.goals_ph')"
              :prefix="codePrefix"
              :error="firstError('goals')"
              required
              @change="clearError('goals')"
            />
            <ListEditor
              :ref="(el) => (editors[2] = el)"
              v-model="mission.questions"
              :label="$t('ablls_ui.questions')"
              icon="pi pi-question-circle"
              :placeholder="$t('ablls_ui.questions_ph')"
              :prefix="codePrefix"
              :error="firstError('questions')"
              required
              @change="clearError('questions')"
            />
          </div>

          <div v-else class="mf-lists">
            <div class="ab-field">
              <label for="mf-ltg"><i class="pi pi-flag mf-label-icon" aria-hidden="true" />{{ $t('ablls_ui.long_term_goal') }}<span class="ab-req">*</span></label>
              <div class="mf-ltg">
                <span class="mf-ltg-code">{{ codePrefix }}</span>
                <Textarea id="mf-ltg" v-model="mission.long_term_goal" rows="2" auto-resize :placeholder="$t('ablls_ui.long_term_goal_ph')" :invalid="!!firstError('long_term_goal')" fluid @input="clearError('long_term_goal')" />
              </div>
              <small v-if="firstError('long_term_goal')" class="ab-error">{{ firstError('long_term_goal') }}</small>
            </div>
            <ListEditor
              :ref="(el) => (editors[0] = el)"
              v-model="mission.sub_goals"
              :label="$t('ablls_ui.sub_goals')"
              icon="pi pi-sitemap"
              :placeholder="$t('ablls_ui.sub_goals_ph')"
              :prefix="codePrefix"
              :error="firstError('sub_goals')"
              required
              @change="clearError('sub_goals')"
            />
          </div>
        </section>
      </div>

      <!-- criterion -->
      <aside class="mf-side">
        <section class="mf-card mf-sticky">
          <div class="mf-card-head">
            <span class="mf-step">3</span>
            <div>
              <h2>{{ $t('ablls_ui.criteria') }}<span class="ab-req">*</span></h2>
              <p>{{ $t('ablls_ui.criteria_hint') }}</p>
            </div>
          </div>

          <div class="mf-criteria" role="group" :aria-label="$t('ablls_ui.criteria')">
            <button
              v-for="n in CRITERIA_OPTIONS"
              :key="n"
              type="button"
              class="mf-criterion"
              :class="{ 'is-active': mission.criteria.includes(n) }"
              :aria-pressed="mission.criteria.includes(n)"
              @click="toggleCriterion(n)"
            >
              {{ n }}
            </button>
          </div>
          <small v-if="firstError('criteria')" class="ab-error">{{ firstError('criteria') }}</small>

          <div class="mf-scale">
            <span>{{ $t('ablls_ui.degree_scale') }}</span>
            <div class="mf-scale-dots">
              <span v-for="d in scale" :key="d" class="mf-dot" :class="{ 'is-zero': d === 0, 'is-max': d > 0 && d === scale[scale.length - 1] }">{{ d }}</span>
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
    grid-template-columns: minmax(0, 2fr) minmax(18rem, 1fr);
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
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
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

.mf-grid {
  display: grid;
  gap: 1rem 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
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
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.mf-lists {
  display: grid;
  gap: 1.5rem;
}
.mf-placeholder {
  display: grid;
  justify-items: center;
  gap: 0.4rem;
  padding: 2rem 1rem;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  color: var(--sawa-muted);
  font-size: 0.9rem;
}
.mf-ltg {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.mf-ltg-code {
  flex: none;
  display: grid;
  place-items: center;
  min-width: 2.4rem;
  height: 2.4rem;
  padding: 0 0.4rem;
  border-radius: 8px;
  background: var(--sawa-primary);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  direction: ltr;
  unicode-bidi: isolate;
}

.mf-criteria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2.6rem, 1fr));
  gap: 0.4rem;
  direction: ltr;
}
.mf-criterion {
  height: 2.6rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fff;
  color: #334155;
  font: inherit;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.mf-criterion:hover {
  border-color: var(--sawa-primary);
  color: var(--sawa-primary);
}
.mf-criterion.is-active {
  background: var(--sawa-primary);
  border-color: var(--sawa-primary);
  color: #fff;
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
