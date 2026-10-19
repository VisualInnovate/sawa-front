<script setup>
// ABLLS Skills: add, rename and delete its domain types. Every type keeps the long-term goal + sub goals inputs.
// A type that still has domains cannot be deleted (the server refuses too).
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { apiOf, permOf } from './assessment'

const props = defineProps({ assessment: { type: Object, required: true } })
const visible = defineModel('visible', { type: Boolean, default: false })
const emit = defineEmits(['changed'])

const { t } = useI18n()
const toast = useToast()
const url = apiOf(props.assessment, 'type')
const perm = (action) => permOf(props.assessment, 'type', action)

const types = ref([])
const loading = ref(false)
const draft = ref('')
const adding = ref(false)
const addError = ref('')
const editing = ref(null) // { id, title, error }
const busy = ref(null)

const load = async () => {
  loading.value = true
  try {
    const res = await axios.get(url)
    types.value = res.data.data || []
  } finally {
    loading.value = false
  }
}
watch(visible, (open) => {
  if (open) load()
})

const errorOf = (e) => e.response?.data?.errors?.title?.[0] || e.response?.data?.message || e.message

const add = async () => {
  const title = draft.value.trim()
  if (!title || adding.value) return
  adding.value = true
  addError.value = ''
  try {
    await axios.post(url, { title })
    draft.value = ''
    await load()
    emit('changed')
  } catch (e) {
    addError.value = errorOf(e)
  } finally {
    adding.value = false
  }
}

const startEdit = (type) => {
  editing.value = { id: type.id, title: type.title, error: '' }
}
const saveEdit = async () => {
  const title = editing.value?.title.trim()
  if (!title) return
  busy.value = editing.value.id
  try {
    await axios.put(`${url}/${editing.value.id}`, { title })
    editing.value = null
    await load()
    emit('changed')
  } catch (e) {
    editing.value.error = errorOf(e)
  } finally {
    busy.value = null
  }
}

const remove = async (type) => {
  busy.value = type.id
  try {
    await axios.delete(`${url}/${type.id}`)
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('ablls_ui.deleted'), life: 3000 })
    await load()
    emit('changed')
  } catch (e) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('ablls_ui.type_has_domains'), life: 4000 })
  } finally {
    busy.value = null
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" :style="{ width: '34rem' }" :breakpoints="{ '640px': '94vw' }" modal :draggable="false">
    <template #header>
      <div class="ab-dialog-title">
        <i class="pi pi-tags" aria-hidden="true" />
        {{ $t('ablls_ui.manage_types') }}
      </div>
    </template>

    <div class="td">
      <p class="td-hint">{{ $t('ablls_ui.types_hint.custom') }}</p>

      <form v-if="$can(perm('create'))" class="td-add" @submit.prevent="add">
        <InputText v-model="draft" :placeholder="$t('ablls_ui.type_title_ph')" :invalid="!!addError" :aria-label="$t('ablls_ui.type')" fluid />
        <Button type="submit" icon="pi pi-plus" :label="$t('ablls_ui.add_item')" :disabled="!draft.trim()" :loading="adding" data-no-request-spinner />
      </form>
      <small v-if="addError" class="ab-error">{{ addError }}</small>

      <div v-if="loading && !types.length" class="td-list">
        <Skeleton v-for="n in 3" :key="n" height="2.75rem" />
      </div>
      <div v-else-if="!types.length" class="td-empty">
        <i class="pi pi-tags" aria-hidden="true" />
        {{ $t('ablls_ui.no_types') }}
      </div>
      <ol v-else class="td-list">
        <li v-for="type in types" :key="type.id" class="td-item">
          <template v-if="editing?.id === type.id">
            <form class="td-edit" @submit.prevent="saveEdit">
              <InputText v-model="editing.title" :invalid="!!editing.error" :aria-label="$t('ablls_ui.type')" fluid autofocus />
              <Button type="submit" icon="pi pi-check" text rounded :aria-label="$t('save')" :loading="busy === type.id" data-no-request-spinner />
              <Button type="button" icon="pi pi-times" text rounded severity="secondary" :aria-label="$t('cancel')" @click="editing = null" />
            </form>
            <small v-if="editing.error" class="ab-error">{{ editing.error }}</small>
          </template>
          <template v-else>
            <i class="pi pi-tag td-icon" aria-hidden="true" />
            <span class="td-title">{{ type.title }}</span>
            <span class="td-count">{{ $t('ablls_ui.domains_n', { n: type.categories_count ?? 0 }) }}</span>
            <Button v-if="$can(perm('edit'))" icon="pi pi-pencil" text rounded size="small" severity="secondary"
              v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="startEdit(type)" />
            <span v-if="$can(perm('delete'))" v-tooltip.top="type.categories_count ? $t('ablls_ui.type_has_domains') : $t('delete')">
              <Button icon="pi pi-trash" text rounded size="small" severity="danger" :aria-label="$t('delete')"
                :disabled="!!type.categories_count" :loading="busy === type.id" data-no-request-spinner @click="remove(type)" />
            </span>
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
.td {
  display: grid;
  gap: 0.85rem;
}
.td-hint {
  margin: 0;
  color: var(--sawa-muted);
  font-size: 0.85rem;
  line-height: 1.6;
}
.td-add,
.td-edit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.td-add .p-button {
  flex: none;
}
.td-edit {
  flex: 1;
}
.td-list {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.td-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.25rem 0.5rem 0.25rem 0.75rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: #fbfcfd;
}
.td-icon {
  color: var(--sawa-primary);
}
.td-title {
  flex: 1;
  min-width: 0;
  font-weight: 700;
  overflow-wrap: anywhere;
}
.td-count {
  padding: 0 0.5rem;
  border-radius: 999px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-size: 0.75rem;
}
.td-empty {
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
