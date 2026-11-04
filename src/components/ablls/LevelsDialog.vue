<script setup>
// Ablls SP: its levels (level 1, level 2, level 3A …). Each level is linked to its domains; the flow chart draws a
// band per level in this order, the first at the bottom. A domain belongs to one level at most (choosing it in another
// level moves it); a domain in no level is drawn above the levels. Deleting a level only unlinks its domains.
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { apiOf, permOf } from './assessment'

const props = defineProps({ assessment: { type: Object, required: true } })
const visible = defineModel('visible', { type: Boolean, default: false })
const emit = defineEmits(['changed'])

const { t } = useI18n()
const toast = useToast()
const url = apiOf(props.assessment, 'level')
const perm = (action) => permOf(props.assessment, 'type', action)

const levels = ref([])
const categories = ref([])
const types = ref([])
const loading = ref(false)
const draft = ref({ title: '', category_ids: [] })
const adding = ref(false)
const addError = ref('')
const editing = ref(null) // { id, title, category_ids, error }
const busy = ref(null)

const load = async () => {
  loading.value = true
  try {
    const [lv, cats, tps] = await Promise.all([
      axios.get(url),
      axios.get(apiOf(props.assessment, 'category')),
      axios.get(apiOf(props.assessment, 'type')).catch(() => ({ data: { data: [] } })),
    ])
    levels.value = lv.data.data || []
    categories.value = cats.data.data || []
    types.value = tps.data.data || []
  } finally {
    loading.value = false
  }
}
watch(visible, (open) => {
  if (open) load()
})

const natural = (a, b) => String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true })
const levelOf = (categoryId) => levels.value.find((level) => (level.category_ids || []).includes(categoryId))
// The domains grouped by type, each showing the level it is in now (choosing it here moves it).
const domainGroups = computed(() => {
  const groups = types.value.map((type) => ({ label: type.title, items: [] }))
  const other = { label: '—', items: [] }
  for (const category of [...categories.value].sort((a, b) => natural(a.symbol, b.symbol))) {
    const group = groups[types.value.findIndex((type) => type.id === category.type_id)] ?? other
    const level = levelOf(category.id)
    group.items.push({ id: category.id, name: [category.symbol, category.title].filter(Boolean).join(' - '), level: level?.title ?? '' })
  }
  return [...groups, other].filter((group) => group.items.length)
})
const domainsOf = (level) => (level.category_ids || []).map((id) => categories.value.find((c) => c.id === id)).filter(Boolean)

const errorOf = (e) => e.response?.data?.errors?.title?.[0] || e.response?.data?.message || e.message

const add = async () => {
  const title = draft.value.title.trim()
  if (!title || adding.value) return
  adding.value = true
  addError.value = ''
  try {
    await axios.post(url, { title, category_ids: draft.value.category_ids })
    draft.value = { title: '', category_ids: [] }
    await load()
    emit('changed')
  } catch (e) {
    addError.value = errorOf(e)
  } finally {
    adding.value = false
  }
}

const startEdit = (level) => {
  editing.value = { id: level.id, title: level.title, category_ids: [...(level.category_ids || [])], error: '' }
}
const saveEdit = async () => {
  const title = editing.value?.title.trim()
  if (!title) return
  busy.value = editing.value.id
  try {
    await axios.put(`${url}/${editing.value.id}`, { title, category_ids: editing.value.category_ids })
    editing.value = null
    await load()
    emit('changed')
  } catch (e) {
    editing.value.error = errorOf(e)
  } finally {
    busy.value = null
  }
}

const move = async (index, step) => {
  const ids = levels.value.map((level) => level.id)
  const to = index + step
  if (to < 0 || to >= ids.length) return
  ;[ids[index], ids[to]] = [ids[to], ids[index]]
  busy.value = ids[to]
  try {
    const res = await axios.put(`${url}/order`, { ids })
    levels.value = res.data.data || levels.value
    emit('changed')
  } finally {
    busy.value = null
  }
}

const remove = async (level) => {
  busy.value = level.id
  try {
    await axios.delete(`${url}/${level.id}`)
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('ablls_ui.deleted'), life: 3000 })
    await load()
    emit('changed')
  } catch (e) {
    toast.add({ severity: 'error', summary: t('error'), detail: errorOf(e), life: 4000 })
  } finally {
    busy.value = null
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" :style="{ width: '44rem' }" :breakpoints="{ '720px': '96vw' }" modal :draggable="false">
    <template #header>
      <div class="ab-dialog-title">
        <i class="pi pi-sort-amount-up" aria-hidden="true" />
        {{ $t('ablls_ui.manage_levels') }}
      </div>
    </template>

    <div class="ld">
      <p class="ld-hint">{{ $t('ablls_ui.levels_hint') }}</p>

      <form v-if="$can(perm('create'))" class="ld-form" @submit.prevent="add">
        <InputText v-model="draft.title" :placeholder="$t('ablls_ui.level_title_ph')" :invalid="!!addError" :aria-label="$t('ablls_ui.level')" fluid />
        <MultiSelect v-model="draft.category_ids" :options="domainGroups" optionGroupLabel="label" optionGroupChildren="items" optionLabel="name"
          optionValue="id" filter display="chip" :maxSelectedLabels="6" :placeholder="$t('ablls_ui.level_domains_ph')" fluid>
          <template #option="{ option }">
            <span class="ld-option">{{ option.name }}<small v-if="option.level">{{ option.level }}</small></span>
          </template>
        </MultiSelect>
        <Button type="submit" icon="pi pi-plus" :label="$t('ablls_ui.add_item')" :disabled="!draft.title.trim()" :loading="adding" data-no-request-spinner />
      </form>
      <small v-if="addError" class="ab-error">{{ addError }}</small>

      <div v-if="loading && !levels.length" class="ld-list">
        <Skeleton v-for="n in 3" :key="n" height="3rem" />
      </div>
      <div v-else-if="!levels.length" class="ld-empty">
        <i class="pi pi-sort-amount-up" aria-hidden="true" />
        {{ $t('ablls_ui.no_levels') }}
      </div>
      <!-- Top of the list = bottom of the chart. -->
      <ol v-else class="ld-list">
        <li v-for="(level, i) in levels" :key="level.id" class="ld-item">
          <template v-if="editing?.id === level.id">
            <form class="ld-form" @submit.prevent="saveEdit">
              <InputText v-model="editing.title" :invalid="!!editing.error" :aria-label="$t('ablls_ui.level')" fluid autofocus />
              <MultiSelect v-model="editing.category_ids" :options="domainGroups" optionGroupLabel="label" optionGroupChildren="items" optionLabel="name"
                optionValue="id" filter display="chip" :maxSelectedLabels="6" :placeholder="$t('ablls_ui.level_domains_ph')" fluid>
                <template #option="{ option }">
                  <span class="ld-option">{{ option.name }}<small v-if="option.level">{{ option.level }}</small></span>
                </template>
              </MultiSelect>
              <div class="ld-actions">
                <Button type="submit" icon="pi pi-check" :label="$t('save')" size="small" :loading="busy === level.id" data-no-request-spinner />
                <Button type="button" icon="pi pi-times" :label="$t('cancel')" size="small" severity="secondary" text @click="editing = null" />
              </div>
            </form>
            <small v-if="editing.error" class="ab-error">{{ editing.error }}</small>
          </template>
          <template v-else>
            <div class="ld-head">
              <span class="ld-num">{{ i + 1 }}</span>
              <b class="ld-title">{{ level.title }}</b>
              <span class="ld-count">{{ $t('ablls_ui.domains_n', { n: (level.category_ids || []).length }) }}</span>
              <template v-if="$can(perm('edit'))">
                <Button icon="pi pi-arrow-up" text rounded size="small" severity="secondary" :disabled="i === 0" v-tooltip.top="$t('ablls_ui.move_up')"
                  :aria-label="$t('ablls_ui.move_up')" @click="move(i, -1)" />
                <Button icon="pi pi-arrow-down" text rounded size="small" severity="secondary" :disabled="i === levels.length - 1" v-tooltip.top="$t('ablls_ui.move_down')"
                  :aria-label="$t('ablls_ui.move_down')" @click="move(i, 1)" />
                <Button icon="pi pi-pencil" text rounded size="small" severity="secondary" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="startEdit(level)" />
              </template>
              <Button v-if="$can(perm('delete'))" icon="pi pi-trash" text rounded size="small" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')"
                :loading="busy === level.id" data-no-request-spinner @click="remove(level)" />
            </div>
            <div v-if="domainsOf(level).length" class="ld-domains">
              <span v-for="category in domainsOf(level)" :key="category.id" class="ld-chip">{{ category.symbol }}</span>
            </div>
          </template>
        </li>
      </ol>
    </div>

    <template #footer>
      <Button :label="$t('close')" severity="secondary" variant="text" @click="visible = false" />
    </template>
  </Dialog>
</template>

<style scoped>
.ld {
  display: grid;
  gap: 0.85rem;
}
.ld-hint {
  margin: 0;
  color: var(--sawa-muted);
  font-size: 0.85rem;
  line-height: 1.6;
}
.ld-form {
  display: grid;
  gap: 0.5rem;
}
.ld-form > .p-button {
  justify-self: start;
}
.ld-actions {
  display: flex;
  gap: 0.4rem;
}
.ld-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.ld-item {
  display: grid;
  gap: 0.4rem;
  padding: 0.5rem 0.6rem 0.6rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fbfcfd;
}
.ld-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}
.ld-num {
  display: inline-grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 999px;
  background: var(--sawa-primary);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
}
.ld-title {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.ld-count {
  padding: 0 0.5rem;
  border-radius: 999px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-size: 0.75rem;
}
.ld-domains {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.ld-chip {
  padding: 0.05rem 0.45rem;
  border: 1px solid var(--sawa-border);
  border-radius: 6px;
  background: #fff;
  font-size: 0.75rem;
  direction: ltr;
}
.ld-option {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}
.ld-option small {
  color: var(--sawa-muted);
}
.ld-empty {
  display: grid;
  justify-items: center;
  gap: 0.4rem;
  padding: 1.5rem 1rem;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  color: var(--sawa-muted);
  font-size: 0.9rem;
}
</style>
