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
import WordingBar from './WordingBar.vue'
import { isAcademic, listOf, nextSkillKey } from './abllsTypes'
import { apiOf, assessmentOf, useDomainTypes } from './assessment'
import './ablls.css'

const props = defineProps({ id: { type: [String, Number], default: null } })

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()

// ABLLS Academy or Ablls OT (the route's meta.assessment).
const assessment = assessmentOf(route)
const { load: loadTypes, keyOf, labelOf, iconOf, orderOf, hintOf } = useDomainTypes(assessment, t)

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
  goals_female: [],
  questions_female: [],
  long_term_goal: '',
  sub_goals: [],
  long_term_goal_female: '',
  sub_goals_female: [],
})
const editors = ref([])

// A boy's and a girl's wording (the field and "<field>_female"), item by item; both may hold {{name}}: an academic
// skill's goals and questions, and an Ablls OT skill's long-term goal and sub goals.
const gender = ref('male')
const otherGender = computed(() => (gender.value === 'male' ? 'female' : 'male'))
const gendered = computed(() => academic.value || (assessment.customTypes && !!selectedCategory.value))
const wordingFields = computed(() => (academic.value ? ['goals', 'questions'] : ['long_term_goal', 'sub_goals']))
const fieldOf = (field, g = gender.value) => (g === 'male' || !gendered.value ? field : `${field}_female`)
const genderHasError = (g) => wordingFields.value.some((f) => firstError(fieldOf(f, g)))
const flushWording = () => editors.value.forEach((ed) => ed?.flush?.())
const switchGender = (g) => {
  if (!g || g === gender.value) return
  flushWording()
  gender.value = g
  undo.value = null
}

// Copy the other gender's wording into the open one, with an undo while the notice is shown.
const undo = ref(null)
const copyOf = (value) => (Array.isArray(value) ? [...value] : value)
const hasText = (value) => (Array.isArray(value) ? value.some((x) => String(x || '').trim()) : !!String(value || '').trim())
const otherHasText = computed(() => wordingFields.value.some((f) => hasText(mission.value[fieldOf(f, otherGender.value)])))
const copyFromOther = () => {
  flushWording()
  const m = mission.value
  undo.value = { gender: gender.value, values: Object.fromEntries(wordingFields.value.map((f) => [f, copyOf(m[fieldOf(f)])])) }
  for (const f of wordingFields.value) {
    m[fieldOf(f)] = copyOf(m[fieldOf(f, otherGender.value)])
    clearError(fieldOf(f))
  }
}
const undoCopy = () => {
  if (!undo.value) return
  for (const [f, value] of Object.entries(undo.value.values)) mission.value[fieldOf(f, undo.value.gender)] = value
  undo.value = null
}

const sortedCategories = computed(() =>
  [...categories.value].sort((a, b) => orderOf(keyOf(a)) - orderOf(keyOf(b)))
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
// The criterion follows the skill: one score per question (academic preparation) or per sub goal (the other types).
const autoCriteria = computed(() => {
  const list = (academic.value ? mission.value.questions : mission.value.sub_goals) || []
  const count = list.filter((x) => String(x || '').trim()).length
  return Array.from({ length: count }, (_, i) => i + 1)
})
const scale = computed(() => [0, ...autoCriteria.value])

const firstError = (field) =>
  errors.value?.[field]?.[0] || Object.entries(errors.value || {}).find(([k]) => k.startsWith(`${field}.`))?.[1]?.[0]

onMounted(async () => {
  try {
    loadTypes().catch(() => {})
    const requests = [
      axios.get(apiOf(assessment, 'category')),
      axios.get(apiOf(assessment, 'mission')).catch(() => ({ data: { data: [] } })),
    ]
    if (isEdit.value) requests.push(axios.get(`${apiOf(assessment, 'mission')}/${props.id}`))
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
        goals_female: [...(data.goals_female || [])],
        questions_female: [...(data.questions_female || [])],
        long_term_goal: data.long_term_goal || (data.goal && !(data.goals || []).length ? data.goal : '') || '',
        sub_goals: [...(data.sub_goals || [])],
        long_term_goal_female: data.long_term_goal_female || '',
        sub_goals_female: [...(data.sub_goals_female || [])],
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

const clearError = (field) => {
  delete errors.value[field]
}

const validate = () => {
  const e = {}
  const m = mission.value
  if (!m.category_id) e.category_id = [t('ablls_ui.required')]
  if (!m.name.trim()) e.name = [t('ablls_ui.required')]
  const lists = academic.value ? ['strengths', 'goals', 'questions'] : ['sub_goals']
  for (const f of lists) if (!m[f].some((x) => x.trim())) e[f] = [t('ablls_ui.list_required')]
  if (academic.value) {
    // The girl's wording needs one item for each of the boy's goals / questions.
    for (const f of ['goals', 'questions']) {
      const count = m[f].filter((x) => x.trim()).length
      const female = m[`${f}_female`].filter((x) => x.trim()).length
      if (!female) e[`${f}_female`] = [t('ablls_ui.list_required')]
      else if (count && female !== count) e[`${f}_female`] = [t('ablls_ui.female_count_mismatch', { n: count })]
    }
  }
  if (!academic.value && !m.long_term_goal.trim()) e.long_term_goal = [t('ablls_ui.required')]
  if (!academic.value && gendered.value) {
    // Ablls OT: the girl's long-term goal and one girl's sub goal for each of the boy's.
    if (!m.long_term_goal_female.trim()) e.long_term_goal_female = [t('ablls_ui.required')]
    const count = m.sub_goals.filter((x) => x.trim()).length
    const female = m.sub_goals_female.filter((x) => x.trim()).length
    if (!female) e.sub_goals_female = [t('ablls_ui.list_required')]
    else if (count && female !== count) e.sub_goals_female = [t('ablls_ui.female_count_mismatch', { n: count })]
  }
  errors.value = e
  // Show the wording that has the error.
  if (gendered.value && !genderHasError(gender.value) && genderHasError(otherGender.value)) switchGender(otherGender.value)
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
    criteria: autoCriteria.value,
    ...(academic.value
      ? {
          strengths: clean(m.strengths),
          goals: clean(m.goals),
          questions: clean(m.questions),
          goals_female: clean(m.goals_female),
          questions_female: clean(m.questions_female),
        }
      : {
          long_term_goal: m.long_term_goal.trim(),
          sub_goals: clean(m.sub_goals),
          ...(gendered.value ? { long_term_goal_female: m.long_term_goal_female.trim(), sub_goals_female: clean(m.sub_goals_female) } : {}),
        }),
  }
  try {
    if (isEdit.value) await axios.put(`${apiOf(assessment, 'mission')}/${props.id}`, payload)
    else await axios.post(apiOf(assessment, 'mission'), payload)
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('ablls_ui.saved'), life: 3000 })
    router.push({ name: assessment.routes.missions, query: { category: payload.category_id } })
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
          <p>{{ $t('ablls_ui.missions_title', { name: $t(assessment.title) }) }}</p>
        </div>
      </div>
      <BackButton :to="{ name: assessment.routes.missions }" />
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
                    <span class="ab-type-tag">{{ labelOf(keyOf(selectedCategory)) }}</span>
                  </span>
                  <span v-else>{{ placeholder }}</span>
                </template>
                <template #option="{ option }">
                  <span class="mf-cat-option">
                    <span class="ab-symbol is-sm">{{ option.symbol }}</span>{{ option.title }}
                    <span class="ab-type-tag"><i :class="iconOf(keyOf(option))" aria-hidden="true" />{{ labelOf(keyOf(option)) }}</span>
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
                  <i :class="iconOf(keyOf(selectedCategory))" aria-hidden="true" />{{ labelOf(keyOf(selectedCategory)) }}
                </span>
              </h2>
              <p>{{ selectedCategory ? hintOf(keyOf(selectedCategory)) : $t('ablls_ui.choose_category_first') }}</p>
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
            <div class="mf-wording">
              <WordingBar :gender="gender" :title="$t('ablls_ui.wording')" :hint="$t('ablls_ui.name_hint_after')"
                :has-error="genderHasError" :other-has-text="otherHasText" :undone-gender="undo?.gender"
                @switch="switchGender" @copy="copyFromOther" @undo="undoCopy" />

              <ListEditor
                :ref="(el) => (editors[1] = el)"
                v-model="mission[fieldOf('goals')]"
                :label="`${$t('ablls_ui.goals')} (${$t(gender)})`"
                icon="pi pi-flag"
                :placeholder="$t('ablls_ui.goals_ph')"
                :prefix="codePrefix"
                :error="firstError(fieldOf('goals'))"
                :reference="mission[fieldOf('goals', otherGender)]"
                :reference-label="$t(otherGender)"
                required
                @change="clearError(fieldOf('goals'))"
              />
              <ListEditor
                :ref="(el) => (editors[2] = el)"
                v-model="mission[fieldOf('questions')]"
                :label="`${$t('ablls_ui.questions')} (${$t(gender)})`"
                icon="pi pi-question-circle"
                :placeholder="$t('ablls_ui.questions_ph')"
                :prefix="codePrefix"
                :error="firstError(fieldOf('questions'))"
                :reference="mission[fieldOf('questions', otherGender)]"
                :reference-label="$t(otherGender)"
                required
                @change="clearError(fieldOf('questions'))"
              />
            </div>
          </div>

          <div v-else class="mf-lists">
            <!-- Ablls OT keeps a boy's and a girl's wording of the long-term goal and sub goals. -->
            <div :class="gendered ? 'mf-wording' : 'mf-lists'">
              <WordingBar v-if="gendered" :gender="gender" :title="$t('ablls_ui.wording_goals')" :hint="$t('ablls_ui.name_hint_goals')"
                :has-error="genderHasError" :other-has-text="otherHasText" :undone-gender="undo?.gender"
                @switch="switchGender" @copy="copyFromOther" @undo="undoCopy" />
              <div class="ab-field">
                <label for="mf-ltg"><i class="pi pi-flag mf-label-icon" aria-hidden="true" />{{ $t('ablls_ui.long_term_goal') }}<template v-if="gendered"> ({{ $t(gender) }})</template><span class="ab-req">*</span></label>
                <div class="mf-ltg">
                  <span class="mf-ltg-code">{{ codePrefix }}</span>
                  <Textarea id="mf-ltg" v-model="mission[fieldOf('long_term_goal')]" rows="2" auto-resize :placeholder="$t('ablls_ui.long_term_goal_ph')" :invalid="!!firstError(fieldOf('long_term_goal'))" fluid @input="clearError(fieldOf('long_term_goal'))" />
                </div>
                <small v-if="gendered && mission[fieldOf('long_term_goal', otherGender)]" class="mf-ref"><b>{{ $t(otherGender) }}:</b> {{ mission[fieldOf('long_term_goal', otherGender)] }}</small>
                <small v-if="firstError(fieldOf('long_term_goal'))" class="ab-error">{{ firstError(fieldOf('long_term_goal')) }}</small>
              </div>
              <ListEditor
                :ref="(el) => (editors[0] = el)"
                v-model="mission[fieldOf('sub_goals')]"
                :label="gendered ? `${$t('ablls_ui.sub_goals')} (${$t(gender)})` : $t('ablls_ui.sub_goals')"
                icon="pi pi-sitemap"
                :placeholder="$t('ablls_ui.sub_goals_ph')"
                :prefix="codePrefix"
                :error="firstError(fieldOf('sub_goals'))"
                :reference="gendered ? mission[fieldOf('sub_goals', otherGender)] : []"
                :reference-label="$t(otherGender)"
                required
                @change="clearError(fieldOf('sub_goals'))"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- criterion -->
      <aside class="mf-side">
        <section class="mf-card mf-sticky">
          <div class="mf-card-head">
            <span class="mf-step">3</span>
            <div>
              <h2>{{ $t('ablls_ui.criteria') }}</h2>
              <p>{{ $t(academic ? 'ablls_ui.criteria_auto_questions' : 'ablls_ui.criteria_auto_sub_goals') }}</p>
            </div>
          </div>

          <!-- Computed: one criterion per question / sub goal. -->
          <div class="mf-criteria" role="group" :aria-label="$t('ablls_ui.criteria')">
            <span v-for="n in autoCriteria" :key="n" class="mf-criterion is-active">{{ n }}</span>
            <small v-if="!autoCriteria.length" class="mf-criteria-empty">{{ $t(academic ? 'ablls_ui.criteria_add_questions' : 'ablls_ui.criteria_add_sub_goals') }}</small>
          </div>

          <div class="mf-scale">
            <span>{{ $t('ablls_ui.degree_scale') }}</span>
            <div class="mf-scale-dots">
              <span v-for="d in scale" :key="d" class="mf-dot" :class="{ 'is-zero': d === 0, 'is-max': d > 0 && d === scale[scale.length - 1] }">{{ d }}</span>
            </div>
          </div>

          <div class="mf-submit">
            <Button type="button" :label="$t('cancel')" severity="secondary" variant="outlined" @click="router.push({ name: assessment.routes.missions })" />
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
.mf-wording {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--sawa-border);
  border-radius: 12px;
  background: #fcfdfd;
}
.mf-ref {
  padding-inline-start: 2.9rem;
  color: var(--sawa-muted);
  font-size: 0.78rem;
  line-height: 1.6;
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
