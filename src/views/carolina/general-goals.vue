<script setup>
// Carolina general goals: the top level, each one holding its domains (the categories) and their skills.
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import CarolianaTab from '@/components/CarolianaTab.vue';

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const loading = ref(false), saving = ref(false), dialog = ref(false), deleting = ref(null);
const errors = ref({});
const form = ref({});
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });
const firstError = (key) => Array.isArray(errors.value[key]) ? errors.value[key][0] : errors.value[key];


async function fetchRows() {
  loading.value = true;
  try {
    const { data } = await axios.get('/api/carolina-general-goals');
    rows.value = data.data ?? [];
  } catch { notifyError(); }
  finally { loading.value = false; }
}
function openNew() {
  form.value = { title: '' };
  errors.value = {};
  dialog.value = true;
}
function edit(row) {
  form.value = { id: row.id, title: row.title ?? '' };
  errors.value = {};
  dialog.value = true;
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  try {
    if (form.value.id) await axios.put(`/api/carolina-general-goals/${form.value.id}`, form.value);
    else await axios.post('/api/carolina-general-goals', form.value);
    dialog.value = false;
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000 });
    await fetchRows();
  } catch (error) {
    if (error.response?.status === 422) errors.value = error.response.data.errors || {};
    else notifyError();
  } finally { saving.value = false; }
}
async function remove() {
  if (saving.value || !deleting.value) return;
  saving.value = true;
  try {
    await axios.delete(`/api/carolina-general-goals/${deleting.value.id}`);
    deleting.value = null;
    await fetchRows();
  } catch (error) {
    // A goal that still has domains is refused (422) with the reason.
    toast.add({ severity: 'error', summary: t('error'), detail: error.response?.data?.message || t('request_failed_retry'), life: 5000 });
  } finally { saving.value = false; }
}
onMounted(fetchRows);
</script>

<template>
  <section>
    <CarolianaTab />
    <Toast />
    <DataTable :value="rows" :loading="loading" dataKey="id" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]"
      :filters="filters" :globalFilterFields="['title']" v-can="'carolina general goal list'">
      <template #header>
        <div class="flex flex-wrap items-center gap-3 justify-between">
          <h1 class="text-lg font-semibold">{{ $t('carolina_ui.general_goals') }}</h1>
          <Button v-can="'carolina general goal create'" :label="$t('create_button')" icon="pi pi-plus" @click="openNew" />
          <InputText v-model="filters.global.value" :placeholder="$t('search')" />
        </div>
      </template>
      <Column field="title" :header="$t('carolina_ui.general_goal')" sortable />
      <Column field="categories_count" :header="$t('carolina_ui.domains')" sortable />
      <Column>
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'carolina general goal edit'" icon="pi pi-pencil" :aria-label="$t('edit')" @click="edit(data)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" />
            <Button v-can="'carolina general goal delete'" icon="pi pi-trash" :aria-label="$t('delete')" @click="deleting = data" rounded severity="danger" variant="outlined" v-tooltip.top="$t('delete')" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" :style="{ width: '520px', maxWidth: '95vw' }" :header="$t('carolina_ui.general_goal')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <form class="goal-form" data-no-request-spinner @submit.prevent="save">
        <div class="form-field">
          <label for="goal-title">{{ $t('carolina_ui.general_goal') }}</label>
          <InputText id="goal-title" v-model="form.title" fluid :disabled="saving" :invalid="Boolean(errors.title)" />
          <small v-if="errors.title" class="field-error">{{ firstError('title') }}</small>
        </div>
        <div class="form-actions">
          <Button type="submit" :loading="saving" :label="$t('submit')" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="Boolean(deleting)" @update:visible="deleting = null" :style="{ width: '450px', maxWidth: '95vw' }" :header="$t('submit')" modal>
      <p>{{ $t('remove_item') }}</p>
      <template #footer>
        <Button :label="$t('no')" :disabled="saving" @click="deleting = null" variant="text" severity="secondary" />
        <Button :label="$t('yes')" :loading="saving" @click="remove" severity="danger" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped>
.goal-form { display: grid; gap: 1rem; }
.form-field { display: grid; gap: .35rem; }
.form-field label { font-weight: 600; text-align: start; }
.field-error { color: #dc2626; }
.form-actions { display: flex; justify-content: center; }
.form-actions .p-button { min-width: 12rem; }
</style>
