<script setup>
// Carolina age ranges, in months (e.g. 24-30). The general goals pick theirs; deleting a range deletes its skills.
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import CarolianaTab from '@/components/CarolianaTab.vue';

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const loading = ref(false), saving = ref(false), dialog = ref(false), deleting = ref(null);
const errors = ref({});
const form = ref({ from_month: null, to_month: null });
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });
const firstError = (key) => Array.isArray(errors.value[key]) ? errors.value[key][0] : errors.value[key];

async function fetchRows() {
  loading.value = true;
  try {
    rows.value = (await axios.get('/api/carolina-age-range')).data.data ?? [];
  } catch { notifyError(); }
  finally { loading.value = false; }
}
function openNew() {
  // A new range usually starts where the last one ended.
  const last = rows.value[rows.value.length - 1];
  form.value = { from_month: last?.to_month ?? null, to_month: null };
  errors.value = {};
  dialog.value = true;
}
function edit(row) {
  form.value = { id: row.id, from_month: row.from_month, to_month: row.to_month };
  errors.value = {};
  dialog.value = true;
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  try {
    if (form.value.id) await axios.put(`/api/carolina-age-range/${form.value.id}`, form.value);
    else await axios.post('/api/carolina-age-range', form.value);
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
    await axios.delete(`/api/carolina-age-range/${deleting.value.id}`);
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
    <DataTable :value="rows" :loading="loading" dataKey="id" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]"
      v-can="'carolina age range list'">
      <template #header>
        <div class="carolina-table-header">
          <h1>{{ $t('carolina_ui.age_ranges') }}</h1>
          <Button v-can="'carolina age range create'" :label="$t('create_button')" icon="pi pi-plus" @click="openNew" />
        </div>
      </template>
      <template #empty>{{ $t('carolina_ui.no_age_ranges') }}</template>
      <Column :header="$t('carolina_ui.age_range')">
        <template #body="{ data }"><b dir="ltr">{{ data.name }}</b> {{ $t('carolina_ui.months') }}</template>
      </Column>
      <Column :header="$t('carolina_ui.general_goals')">
        <template #body="{ data }">
          <div class="range-chips">
            <Tag v-for="goal in data.general_goals" :key="goal.id" severity="secondary" :value="goal.title" />
            <span v-if="!data.general_goals?.length" class="muted">—</span>
          </div>
        </template>
      </Column>
      <Column field="skills_count" :header="$t('carolina_ui.skills_count')" style="width: 9rem" />
      <Column style="width: 8rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'carolina age range edit'" icon="pi pi-pencil" :aria-label="$t('edit')" @click="edit(data)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" />
            <Button v-can="'carolina age range delete'" icon="pi pi-trash" :aria-label="$t('delete')" @click="deleting = data" rounded severity="danger" variant="outlined" v-tooltip.top="$t('delete')" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" :style="{ width: '480px', maxWidth: '95vw' }" :header="$t('carolina_ui.age_range')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <form class="carolina-form" data-no-request-spinner @submit.prevent="save">
        <div class="field-row">
          <div class="form-field">
            <label for="range-from">{{ $t('carolina_ui.from_month') }}</label>
            <InputNumber inputId="range-from" v-model="form.from_month" :min="0" :max="1000" fluid :disabled="saving"
              :invalid="Boolean(errors.from_month)" :suffix="' ' + $t('carolina_ui.months')" />
            <small v-if="errors.from_month" class="field-error">{{ firstError('from_month') }}</small>
          </div>
          <div class="form-field">
            <label for="range-to">{{ $t('carolina_ui.to_month') }}</label>
            <InputNumber inputId="range-to" v-model="form.to_month" :min="0" :max="1000" fluid :disabled="saving"
              :invalid="Boolean(errors.to_month)" :suffix="' ' + $t('carolina_ui.months')" />
            <small v-if="errors.to_month" class="field-error">{{ firstError('to_month') }}</small>
          </div>
        </div>
        <div class="form-actions">
          <Button type="submit" :loading="saving" :label="$t('submit')" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="Boolean(deleting)" @update:visible="deleting = null" :style="{ width: '460px', maxWidth: '95vw' }" :header="$t('delete')" modal>
      <p>{{ $t('remove_item') }} <b dir="ltr">{{ deleting?.name }}</b>؟</p>
      <Message v-if="deleting?.skills_count" severity="warn" :closable="false">{{ $t('carolina_ui.delete_cascade', { n: deleting.skills_count }) }}</Message>
      <template #footer>
        <Button :label="$t('no')" :disabled="saving" @click="deleting = null" variant="text" severity="secondary" />
        <Button :label="$t('yes')" :loading="saving" @click="remove" severity="danger" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped src="./carolina-admin.css"></style>
