<script setup>
// Carolina symbols (names only, e.g. 4Ap-a). Each serves one skill; deleting a symbol deletes its skill.
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
const form = ref({ name: '' });
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });
const firstError = (key) => Array.isArray(errors.value[key]) ? errors.value[key][0] : errors.value[key];

async function fetchRows() {
  loading.value = true;
  try {
    rows.value = (await axios.get('/api/carolina-symbols')).data.data ?? [];
  } catch { notifyError(); }
  finally { loading.value = false; }
}
function openNew() {
  form.value = { name: '' };
  errors.value = {};
  dialog.value = true;
}
function edit(row) {
  form.value = { id: row.id, name: row.name };
  errors.value = {};
  dialog.value = true;
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  try {
    if (form.value.id) await axios.put(`/api/carolina-symbols/${form.value.id}`, form.value);
    else await axios.post('/api/carolina-symbols', form.value);
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
    await axios.delete(`/api/carolina-symbols/${deleting.value.id}`);
    deleting.value = null;
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000 });
    await fetchRows();
  } catch { notifyError(); }
  finally { saving.value = false; }
}
onMounted(fetchRows);
</script>

<template>
  <section>
    <CarolianaTab />
    <Toast />
    <DataTable :value="rows" :loading="loading" dataKey="id" paginator :rows="25" :rowsPerPageOptions="[25, 50, 100]"
      :filters="filters" :globalFilterFields="['name']" v-can="'carolina symbol list'">
      <template #header>
        <div class="carolina-table-header">
          <h1>{{ $t('carolina_ui.symbols') }}</h1>
          <div class="carolina-table-tools">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="filters.global.value" :placeholder="$t('search')" />
            </IconField>
            <Button v-can="'carolina symbol create'" :label="$t('create_button')" icon="pi pi-plus" @click="openNew" />
          </div>
        </div>
      </template>
      <template #empty>{{ $t('carolina_ui.no_symbols') }}</template>
      <Column field="name" :header="$t('carolina_ui.symbol')">
        <template #body="{ data }"><b dir="ltr">{{ data.name }}</b></template>
      </Column>
      <Column :header="$t('status')" style="width: 12rem">
        <template #body="{ data }">
          <Tag :severity="data.skill_id ? 'info' : 'success'" :value="$t(data.skill_id ? 'carolina_ui.symbol_used' : 'carolina_ui.symbol_free')" />
        </template>
      </Column>
      <Column style="width: 8rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'carolina symbol edit'" icon="pi pi-pencil" :aria-label="$t('edit')" @click="edit(data)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" />
            <Button v-can="'carolina symbol delete'" icon="pi pi-trash" :aria-label="$t('delete')" @click="deleting = data" rounded severity="danger" variant="outlined" v-tooltip.top="$t('delete')" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" :style="{ width: '420px', maxWidth: '95vw' }" :header="$t('carolina_ui.symbol')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <form class="carolina-form" data-no-request-spinner @submit.prevent="save">
        <div class="form-field">
          <label for="symbol-name">{{ $t('carolina_ui.symbol') }}</label>
          <InputText id="symbol-name" v-model="form.name" dir="ltr" placeholder="4Ap-a" fluid :disabled="saving" :invalid="Boolean(errors.name)" />
          <small v-if="errors.name" class="field-error">{{ firstError('name') }}</small>
        </div>
        <div class="form-actions">
          <Button type="submit" :loading="saving" :label="$t('submit')" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="Boolean(deleting)" @update:visible="deleting = null" :style="{ width: '460px', maxWidth: '95vw' }" :header="$t('delete')" modal>
      <p>{{ $t('remove_item') }} <b dir="ltr">{{ deleting?.name }}</b>؟</p>
      <Message v-if="deleting?.skill_id" severity="warn" :closable="false">{{ $t('carolina_ui.delete_cascade', { n: 1 }) }}</Message>
      <template #footer>
        <Button :label="$t('no')" :disabled="saving" @click="deleting = null" variant="text" severity="secondary" />
        <Button :label="$t('yes')" :loading="saving" @click="remove" severity="danger" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped src="./carolina-admin.css"></style>
