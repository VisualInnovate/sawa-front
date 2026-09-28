<template>
  <div class="ab-page">
    <Ablls />

    <header class="ab-hero">
      <div class="ab-hero-main">
        <span class="ab-hero-icon"><i class="pi pi-list-check" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t('ablls_ui.missions_title') }}</h1>
          <p>{{ $t('ablls_ui.missions_subtitle') }}</p>
        </div>
      </div>
      <div class="ab-hero-side">
        <div class="ab-stat">
          <b>{{ missions.length }}</b>
          <span>{{ $t('ablls_ui.missions_count') }}</span>
        </div>
        <div class="ab-stat">
          <b>{{ categories.length }}</b>
          <span>{{ $t('ablls_ui.categories_count') }}</span>
        </div>
        <Button
          v-can="'able mission create'"
          class="ab-hero-action"
          :label="$t('ablls_ui.new_mission')"
          icon="pi pi-plus"
          @click="create"
        />
      </div>
    </header>

    <div class="ab-toolbar ms-toolbar">
      <IconField class="ab-search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" :placeholder="$t('ablls_ui.search_missions')" />
      </IconField>

      <div class="ms-chips" role="tablist">
        <button type="button" class="ms-chip" :class="{ 'is-active': !activeCategory }" @click="setCategory(null)">
          {{ $t('ablls_ui.all') }}
          <span class="ms-chip-count">{{ missions.length }}</span>
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="ms-chip"
          :class="{ 'is-active': activeCategory === cat.id }"
          :title="cat.title"
          @click="setCategory(cat.id)"
        >
          <span class="ms-chip-symbol">{{ cat.symbol }}</span>
          <span class="ms-chip-label">{{ cat.title }}</span>
          <span class="ms-chip-count">{{ countFor(cat.id) }}</span>
        </button>
      </div>
    </div>

    <!-- loading -->
    <section v-if="loading" class="ms-group">
      <div class="ms-grid">
        <div v-for="n in 6" :key="n" class="ms-card">
          <Skeleton width="3.5rem" height="1.4rem" />
          <Skeleton width="80%" height="1.1rem" />
          <Skeleton width="100%" height="2.4rem" />
          <Skeleton width="50%" height="1.4rem" />
        </div>
      </div>
    </section>

    <div v-else-if="!groups.length" class="ab-empty">
      <i class="pi pi-inbox" aria-hidden="true" />
      <h3>{{ $t('ablls_ui.empty_missions') }}</h3>
      <p>{{ $t('ablls_ui.empty_missions_hint') }}</p>
      <Button v-can="'able mission create'" :label="$t('ablls_ui.new_mission')" icon="pi pi-plus" @click="create" />
    </div>

    <section v-for="group in groups" v-else :key="group.id" class="ms-group">
      <header class="ms-group-head">
        <span class="ab-symbol">{{ group.symbol }}</span>
        <h2>{{ group.title }}</h2>
        <span class="ms-group-count">{{ $t('ablls_ui.missions_n', { n: group.items.length }) }}</span>
      </header>

      <div class="ms-grid">
        <article v-for="m in group.items" :key="m.id" class="ms-card">
          <div class="ms-card-top">
            <span class="ab-key"><i class="pi pi-key" aria-hidden="true" />{{ m.key }}</span>
            <div class="ab-actions">
              <Button
                v-can="'able mission edit'"
                icon="pi pi-pencil"
                text
                rounded
                severity="secondary"
                v-tooltip.top="$t('edit')"
                :aria-label="$t('edit')"
                @click="edit(m.id)"
              />
              <Button
                v-can="'able mission delete'"
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                v-tooltip.top="$t('delete')"
                :aria-label="$t('delete')"
                @click="askDelete(m)"
              />
            </div>
          </div>

          <h3 class="ms-name" :title="m.name">{{ m.name }}</h3>
          <p v-if="m.goal" class="ms-goal" :title="m.goal">{{ m.goal }}</p>

          <div class="ms-card-foot">
            <span class="ms-foot-label">{{ $t('ablls_ui.degrees') }}</span>
            <div class="ms-degrees" :aria-label="$t('ablls_ui.degree_scale')">
              <span v-for="d in degreesOf(m)" :key="d" class="ms-degree">{{ d }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- delete -->
    <Dialog v-model:visible="deleteDialog" :style="{ width: '28rem' }" :breakpoints="{ '640px': '94vw' }" modal :draggable="false" :header="$t('ablls_ui.delete_title')">
      <div class="ab-confirm">
        <span class="ab-confirm-icon"><i class="pi pi-trash" aria-hidden="true" /></span>
        <p>{{ $t('ablls_ui.delete_mission_msg', { name: toDelete ? `${toDelete.key} — ${toDelete.name}` : '' }) }}</p>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" severity="secondary" variant="text" @click="deleteDialog = false" />
        <Button :label="$t('delete')" icon="pi pi-trash" severity="danger" :loading="deleting" data-no-request-spinner @click="remove" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import Ablls from '../../components/Ablls.vue'
import '@/components/ablls/ablls.css'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const missions = ref([])
const categories = ref([])
const loading = ref(true)
const search = ref('')
const activeCategory = ref(route.query.category ? Number(route.query.category) : null)

const deleteDialog = ref(false)
const toDelete = ref(null)
const deleting = ref(false)

const countFor = (id) => missions.value.filter((m) => m.category_id === id).length

// "B-12" sorts after "B-2".
const keyNumber = (key) => Number(String(key || '').match(/\d+$/)?.[0] ?? 0)

// Degree is stored as the digits of the scale ("01234"); fall back to 0..1.
const degreesOf = (m) => {
  const digits = String(m.degree ?? '').replace(/\D/g, '').split('')
  return digits.length ? digits : ['0', '1']
}

const groups = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = missions.value.filter((m) => {
    if (activeCategory.value && m.category_id !== activeCategory.value) return false
    if (!q) return true
    return [m.name, m.key, m.goal, m.category?.title].some((v) => String(v || '').toLowerCase().includes(q))
  })

  const byCat = new Map()
  for (const m of list) {
    if (!byCat.has(m.category_id)) {
      const cat = categories.value.find((c) => c.id === m.category_id) || m.category || {}
      byCat.set(m.category_id, { id: m.category_id, title: cat.title || '—', symbol: cat.symbol || '?', items: [] })
    }
    byCat.get(m.category_id).items.push(m)
  }
  const order = categories.value.map((c) => c.id)
  return [...byCat.values()]
    .sort((a, b) => {
      const ia = order.indexOf(a.id)
      const ib = order.indexOf(b.id)
      return (ia < 0 ? Infinity : ia) - (ib < 0 ? Infinity : ib)
    })
    .map((g) => ({ ...g, items: g.items.sort((a, b) => keyNumber(a.key) - keyNumber(b.key)) }))
})

const setCategory = (id) => {
  activeCategory.value = id
  router.replace({ query: { ...route.query, category: id ?? undefined } })
}

const fetchData = async () => {
  try {
    const [m, c] = await Promise.all([
      axios.get('/api/able-mission'),
      axios.get('/api/able-category').catch(() => ({ data: { data: [] } })),
    ])
    missions.value = m.data.data || []
    categories.value = c.data.data || []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const create = () => router.push({ name: 'mission-create' })
const edit = (id) => router.push({ name: 'mission-update', params: { id } })

const askDelete = (m) => {
  toDelete.value = m
  deleteDialog.value = true
}

const remove = async () => {
  deleting.value = true
  try {
    await axios.delete(`/api/able-mission/${toDelete.value.id}`)
    deleteDialog.value = false
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('ablls_ui.deleted'), life: 3000 })
    fetchData()
  } catch (e) {
    toast.add({ severity: 'error', summary: t('delete'), detail: e.response?.data?.message || e.message, life: 4000 })
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.ms-toolbar {
  align-items: flex-start;
}
.ms-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  flex: 1 1 100%;
}
.ms-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  max-width: 16rem;
  padding: 0.3rem 0.5rem 0.3rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 999px;
  background: #fff;
  color: #334155;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
[dir='rtl'] .ms-chip {
  padding: 0.3rem 0.75rem 0.3rem 0.5rem;
}
.ms-chip:hover {
  border-color: var(--sawa-primary);
  color: var(--sawa-primary);
}
.ms-chip.is-active {
  background: var(--sawa-primary);
  border-color: var(--sawa-primary);
  color: #fff;
}
.ms-chip-symbol {
  padding: 0 0.35rem;
  border-radius: 5px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-size: 0.75rem;
  font-weight: 800;
  direction: ltr;
}
.ms-chip-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ms-chip-count {
  min-width: 1.4rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: var(--sawa-muted);
  font-size: 0.75rem;
  text-align: center;
}
.ms-chip.is-active .ms-chip-symbol,
.ms-chip.is-active .ms-chip-count {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.ms-group {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
}
.ms-group-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.ms-group-head h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--sawa-text);
}
.ms-group-count {
  margin-inline-start: auto;
  color: var(--sawa-muted);
  font-size: 0.82rem;
  font-weight: 600;
}

.ms-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16.5rem), 1fr));
}
.ms-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: #fbfcfd;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
}
.ms-card::before {
  content: '';
  position: absolute;
  inset-block: 0.85rem;
  inset-inline-start: -1px;
  width: 3px;
  border-radius: 3px;
  background: var(--sawa-primary);
  opacity: 0;
  transition: opacity 0.15s;
}
.ms-card:hover {
  background: #fff;
  border-color: #b6d7db;
  box-shadow: 0 8px 20px -14px rgba(19, 92, 101, 0.5);
}
.ms-card:hover::before {
  opacity: 1;
}
.ms-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-block: -0.25rem;
}
.ms-name {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--sawa-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ms-goal {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--sawa-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ms-card-foot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--sawa-border);
}
.ms-foot-label {
  color: var(--sawa-muted);
  font-size: 0.78rem;
  font-weight: 600;
}
.ms-degrees {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  direction: ltr;
}
.ms-degree {
  display: grid;
  place-items: center;
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 50%;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-size: 0.72rem;
  font-weight: 700;
}
.ms-degree:first-child {
  background: #f1f5f9;
  color: var(--sawa-muted);
}
.ms-degree:last-child:not(:first-child) {
  background: var(--sawa-primary);
  color: #fff;
}
</style>
