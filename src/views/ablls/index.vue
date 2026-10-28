<template>
  <div class="ab-page">
    <Ablls />

    <template v-if="$can(perm('category', 'list'))">
      <header class="ab-hero">
        <div class="ab-hero-main">
          <span class="ab-hero-icon"><i class="pi pi-th-large" aria-hidden="true" /></span>
          <div>
            <h1>{{ $t('ablls_ui.categories_title', { name: $t(assessment.title) }) }}</h1>
            <p>{{ $t(assessment.title) }} · {{ $t('ablls_ui.categories_subtitle') }}</p>
          </div>
        </div>
        <div class="ab-hero-side">
          <div class="ab-stat">
            <b>{{ categories.length }}</b>
            <span>{{ $t('ablls_ui.categories_count') }}</span>
          </div>
          <div v-if="missionCounts" class="ab-stat">
            <b>{{ totalMissions }}</b>
            <span>{{ $t('ablls_ui.missions_count') }}</span>
          </div>
          <Button
            v-if="assessment.customTypes"
            v-can="[perm('type', 'list'), perm('type', 'create')]"
            class="ab-hero-action"
            severity="secondary"
            :label="$t('ablls_ui.manage_types')"
            icon="pi pi-tags"
            @click="typesDialog = true"
          />
          <Button
            v-can="perm('category', 'create')"
            class="ab-hero-action"
            :label="$t('ablls_ui.new_category')"
            icon="pi pi-plus"
            @click="openCreate"
          />
        </div>
      </header>

      <div class="ab-toolbar">
        <IconField class="ab-search">
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" :placeholder="$t('ablls_ui.search_categories')" />
        </IconField>
        <div class="ab-types" role="tablist">
          <button type="button" class="ab-type-tab" :class="{ 'is-active': !activeType }" @click="setType(null)">
            {{ $t('ablls_ui.all') }}
            <span class="ab-type-count">{{ categories.length }}</span>
          </button>
          <button
            v-for="type in types"
            :key="type.value"
            type="button"
            class="ab-type-tab"
            :class="{ 'is-active': activeType === type.value }"
            @click="setType(type.value)"
          >
            <i :class="type.icon" aria-hidden="true" />
            {{ type.label }}
            <span class="ab-type-count">{{ typeCount(type.value) }}</span>
          </button>
        </div>
      </div>

      <!-- loading -->
      <div v-if="loading" class="cat-grid">
        <div v-for="n in 6" :key="n" class="cat-card">
          <div class="cat-top">
            <Skeleton width="3.25rem" height="3.25rem" border-radius="14px" />
            <div class="flex-1 grid gap-2">
              <Skeleton width="70%" height="1.1rem" />
              <Skeleton width="40%" height=".9rem" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!categories.length" class="ab-empty">
        <i class="pi pi-folder-open" aria-hidden="true" />
        <h3>{{ $t('ablls_ui.empty_categories') }}</h3>
        <p>{{ $t('ablls_ui.empty_categories_hint') }}</p>
        <Button v-if="assessment.customTypes && !types.length" v-can="perm('type', 'create')" :label="$t('ablls_ui.manage_types')" icon="pi pi-tags" @click="typesDialog = true" />
        <Button v-else v-can="perm('category', 'create')" :label="$t('ablls_ui.new_category')" icon="pi pi-plus" @click="openCreate" />
      </div>

      <div v-else-if="!filtered.length" class="ab-empty">
        <i class="pi pi-search" aria-hidden="true" />
        <p>{{ $t('ablls_ui.no_results') }}</p>
      </div>

      <div v-else class="cat-grid">
        <article v-for="item in filtered" :key="item.id" class="cat-card">
          <div class="cat-top">
            <span class="ab-symbol is-lg">{{ item.symbol }}</span>
            <div class="cat-info">
              <span class="ab-type-tag"><i :class="iconOf(keyOf(item))" aria-hidden="true" />{{ labelOf(keyOf(item)) }}</span>
              <h3 :title="item.title">{{ item.title }}</h3>
            </div>
            <div class="ab-actions">
              <Button
                v-can="perm('category', 'edit')"
                icon="pi pi-pencil"
                text
                rounded
                severity="secondary"
                v-tooltip.top="$t('edit')"
                :aria-label="$t('edit')"
                @click="openEdit(item)"
              />
              <Button
                v-can="perm('category', 'delete')"
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                v-tooltip.top="$t('delete')"
                :aria-label="$t('delete')"
                @click="askDelete(item)"
              />
            </div>
          </div>

          <div class="cat-footer">
            <span v-if="missionCounts" class="cat-count" :class="{ 'is-zero': !missionCounts[item.id] }">
              <i class="pi pi-list-check" aria-hidden="true" />
              {{ missionCounts[item.id] ? $t('ablls_ui.missions_n', { n: missionCounts[item.id] }) : $t('ablls_ui.no_missions') }}
            </span>
            <router-link
              v-if="$can(perm('mission', 'list'))"
              :to="{ name: assessment.routes.missions, query: { category: item.id } }"
              class="cat-link"
            >
              {{ $t('ablls_ui.view_missions') }}
              <i class="pi pi-arrow-left cat-link-icon" aria-hidden="true" />
            </router-link>
          </div>
        </article>
      </div>
    </template>

    <!-- create / edit -->
    <Dialog v-model:visible="formDialog" :style="{ width: '32rem' }" :breakpoints="{ '640px': '94vw' }" modal :draggable="false">
      <template #header>
        <div class="ab-dialog-title">
          <i :class="['pi', form.id ? 'pi-pencil' : 'pi-plus']" aria-hidden="true" />
          {{ form.id ? $t('ablls_ui.edit_category') : $t('ablls_ui.new_category') }}
        </div>
      </template>

      <form class="grid gap-4" @submit.prevent="save">
        <div class="ab-field">
          <label>{{ $t('ablls_ui.type') }}<span class="ab-req">*</span></label>
          <div class="cat-type-pick" role="radiogroup">
            <button
              v-for="type in types"
              :key="type.value"
              type="button"
              role="radio"
              :aria-checked="form.type === type.value"
              class="cat-type-option"
              :class="{ 'is-active': form.type === type.value }"
              @click="form.type = type.value"
            >
              <i :class="type.icon" aria-hidden="true" />
              {{ type.label }}
            </button>
          </div>
          <small v-if="errors.type_id" class="ab-error">{{ errors.type_id[0] }}</small>
          <small class="ab-hint">{{ hintOf(form.type) }}</small>
        </div>
        <div class="ab-field">
          <label for="cat-title">{{ $t('ablls_ui.category_title') }}<span class="ab-req">*</span></label>
          <InputText id="cat-title" v-model="form.title" :placeholder="$t('ablls_ui.category_title_ph')" :invalid="!!errors.title" autofocus />
          <small v-if="errors.title" class="ab-error">{{ errors.title[0] }}</small>
        </div>
        <div class="ab-field">
          <label for="cat-symbol">{{ $t('ablls_ui.symbol') }}<span class="ab-req">*</span></label>
          <InputText id="cat-symbol" v-model="form.symbol" class="ltr" maxlength="10" :placeholder="$t('ablls_ui.symbol_ph')" :invalid="!!errors.symbol" />
          <small v-if="errors.symbol" class="ab-error">{{ errors.symbol[0] }}</small>
          <small v-else class="ab-hint">{{ $t('ablls_ui.symbol_hint') }}<template v-if="assessment.customTypes"> {{ $t('ablls_ui.symbol_numbered_hint') }}</template></small>
        </div>

        <div class="cat-preview">
          <span class="cat-preview-label">{{ $t('ablls_ui.preview') }}</span>
          <div class="cat-top">
            <span class="ab-symbol is-lg">{{ form.symbol || '?' }}</span>
            <div class="cat-info">
              <h3>{{ form.title || $t('ablls_ui.category_title') }}</h3>
              <span class="ab-key">{{ nextSkillKey({ type: assessment.customTypes ? CUSTOM_TYPE : form.type, symbol: form.symbol || '?' }) }}</span>
            </div>
          </div>
        </div>
        <button type="submit" hidden />
      </form>

      <template #footer>
        <Button :label="$t('cancel')" severity="secondary" variant="text" @click="formDialog = false" />
        <Button :label="$t('save')" icon="pi pi-check" :loading="saving" data-no-request-spinner @click="save" />
      </template>
    </Dialog>

    <!-- delete -->
    <Dialog v-model:visible="deleteDialog" :style="{ width: '28rem' }" :breakpoints="{ '640px': '94vw' }" modal :draggable="false" :header="$t('ablls_ui.delete_title')">
      <div class="ab-confirm">
        <span class="ab-confirm-icon"><i class="pi pi-trash" aria-hidden="true" /></span>
        <p>{{ $t('ablls_ui.delete_category_msg', { name: toDelete?.title }) }}</p>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" severity="secondary" variant="text" @click="deleteDialog = false" />
        <Button :label="$t('delete')" icon="pi pi-trash" severity="danger" :loading="deleting" data-no-request-spinner @click="remove" />
      </template>
    </Dialog>

    <!-- Ablls OT: its domain types -->
    <TypesDialog v-if="assessment.customTypes" v-model:visible="typesDialog" :assessment="assessment" @changed="loadTypes" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import Ablls from '../../components/Ablls.vue'
import TypesDialog from '@/components/ablls/TypesDialog.vue'
import { useRoute, useRouter } from 'vue-router'
import { can } from '@/utils/permissions'
import { nextSkillKey } from '@/components/ablls/abllsTypes'
import { CUSTOM_TYPE, apiOf, assessmentOf, permOf, useDomainTypes } from '@/components/ablls/assessment'
import '@/components/ablls/ablls.css'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()

// ABLLS Academy or Ablls OT (the route's meta.assessment).
const assessment = assessmentOf(route)
const perm = (resource, action) => permOf(assessment, resource, action)
const { types, load: loadTypes, keyOf, labelOf, iconOf, orderOf, hintOf } = useDomainTypes(assessment, t)
const typesDialog = ref(false)

const categories = ref([])
const missionCounts = ref(null)
const loading = ref(true)
const search = ref('')
const activeType = ref(route.query.type || null)

const formDialog = ref(false)
const form = ref({})
const errors = ref({})
const saving = ref(false)

const deleteDialog = ref(false)
const toDelete = ref(null)
const deleting = ref(false)

const totalMissions = computed(() => Object.values(missionCounts.value || {}).reduce((a, b) => a + b, 0))

const typeCount = (type) => categories.value.filter((c) => keyOf(c) === type).length

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return categories.value.filter((c) => {
    if (activeType.value && keyOf(c) !== activeType.value) return false
    return !q || (c.title || '').toLowerCase().includes(q) || (c.symbol || '').toLowerCase().includes(q)
  })
})

const setType = (type) => {
  activeType.value = type
  router.replace({ query: { ...route.query, type: type ?? undefined } })
}

const fetchData = async () => {
  try {
    const [res] = await Promise.all([axios.get(apiOf(assessment, 'category')), loadTypes()])
    categories.value = (res.data.data || [])
      .map((c, i) => ({ ...c, order: i }))
      .sort((a, b) => orderOf(keyOf(a)) - orderOf(keyOf(b)) || a.order - b.order)
  } finally {
    loading.value = false
  }
}

// Mission counts per category (only when the user may list missions).
const fetchCounts = async () => {
  if (!can(perm('mission', 'list'))) return
  try {
    const res = await axios.get(apiOf(assessment, 'mission'))
    const counts = {}
    for (const m of res.data.data || []) counts[m.category_id] = (counts[m.category_id] || 0) + 1
    missionCounts.value = counts
  } catch {
    missionCounts.value = null
  }
}

onMounted(() => {
  fetchData()
  fetchCounts()
})

const openCreate = () => {
  form.value = { title: '', symbol: '', type: activeType.value || types.value[0]?.value || '' }
  errors.value = {}
  formDialog.value = true
}

const openEdit = (item) => {
  form.value = { id: item.id, title: item.title, symbol: item.symbol, type: keyOf(item) }
  errors.value = {}
  formDialog.value = true
}

const save = async () => {
  if (saving.value) return
  errors.value = {}
  if (!form.value.title?.trim()) errors.value.title = [t('ablls_ui.required')]
  if (!form.value.symbol?.trim()) errors.value.symbol = [t('ablls_ui.required')]
  if (assessment.customTypes && !form.value.type) errors.value.type_id = [t('ablls_ui.choose_type')]
  if (Object.keys(errors.value).length) return

  saving.value = true
  const payload = { title: form.value.title.trim(), symbol: form.value.symbol.trim() }
  if (assessment.customTypes) payload.type_id = Number(String(form.value.type).slice(1))
  else payload.type = form.value.type || 'academic'
  try {
    if (form.value.id) await axios.put(`${apiOf(assessment, 'category')}/${form.value.id}`, payload)
    else await axios.post(apiOf(assessment, 'category'), payload)
    formDialog.value = false
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('ablls_ui.saved'), life: 3000 })
    fetchData()
  } catch (e) {
    errors.value = e.response?.data?.errors || {}
  } finally {
    saving.value = false
  }
}

const askDelete = (item) => {
  toDelete.value = item
  deleteDialog.value = true
}

const remove = async () => {
  deleting.value = true
  try {
    await axios.delete(`${apiOf(assessment, 'category')}/${toDelete.value.id}`)
    deleteDialog.value = false
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('ablls_ui.deleted'), life: 3000 })
    fetchData()
    fetchCounts()
  } catch (e) {
    toast.add({ severity: 'error', summary: t('delete'), detail: e.response?.data?.message || e.message, life: 4000 })
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.cat-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
}
.cat-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.1rem;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  box-shadow: var(--sawa-shadow);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.cat-card:hover {
  border-color: rgb(var(--bp-b6d7db));
  box-shadow: 0 10px 24px -14px rgb(var(--bp-135c65) / 0.45);
  transform: translateY(-2px);
}
.cat-top {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.cat-info {
  flex: 1;
  min-width: 0;
  display: grid;
  justify-items: start;
  gap: 0.15rem;
}
.cat-info h3 {
  margin: 0;
  max-width: 100%;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--sawa-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cat-type-pick {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}
.cat-type-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fff;
  color: #334155;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  text-align: start;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.cat-type-option:hover {
  border-color: var(--sawa-primary);
}
.cat-type-option.is-active {
  border-color: var(--sawa-primary);
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  box-shadow: inset 0 0 0 1px var(--sawa-primary);
}
.cat-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--sawa-border);
  font-size: 0.85rem;
}
.cat-count {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-weight: 600;
}
.cat-count.is-zero {
  background: #f1f5f9;
  color: var(--sawa-muted);
}
.cat-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-inline-start: auto;
  color: var(--sawa-primary);
  font-weight: 600;
  text-decoration: none;
}
.cat-link:hover {
  text-decoration: underline;
}
[dir='ltr'] .cat-link-icon {
  transform: scaleX(-1);
}
.cat-preview {
  position: relative;
  padding: 1.1rem 1rem 1rem;
  border: 1px dashed rgb(var(--bp-b6d7db));
  border-radius: var(--sawa-radius);
  background: #fafdfd;
}
.cat-preview-label {
  position: absolute;
  top: -0.65rem;
  inset-inline-start: 0.75rem;
  padding: 0 0.4rem;
  background: #fff;
  color: var(--sawa-muted);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>