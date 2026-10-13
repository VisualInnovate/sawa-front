<script setup>
// Carolina general goals: a title and the age ranges it covers. Deleting a goal, or taking an age range off it,
// deletes its skills there, so both ask first when skills would go.
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import CarolianaTab from '@/components/CarolianaTab.vue';

const { t } = useI18n();
const toast = useToast();
const rows = ref([]), ageRanges = ref([]);
const loading = ref(false), saving = ref(false), dialog = ref(false), deleting = ref(null), confirming = ref(null);
const errors = ref({});
const form = ref({ title: '', age_range_ids: [] });
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });
const firstError = (key) => Array.isArray(errors.value[key]) ? errors.value[key][0] : errors.value[key];
const tableRows = computed(() => rows.value.map(row => ({ ...row, ranges_text: (row.age_ranges ?? []).map(range => range.name).join(' ') })));

async function fetchRows() {
  loading.value = true;
  try {
    const [goals, ranges] = await Promise.all([axios.get('/api/carolina-general-goals'), axios.get('/api/carolina-age-range')]);
    rows.value = goals.data.data ?? [];
    ageRanges.value = ranges.data.data ?? [];
  } catch { notifyError(); }
  finally { loading.value = false; }
}
function openNew() {
  form.value = { title: '', age_range_ids: [] };
  errors.value = {};
  dialog.value = true;
}
function edit(row) {
  form.value = { id: row.id, title: row.title ?? '', age_range_ids: (row.age_ranges ?? []).map(range => range.id) };
  errors.value = {};
  dialog.value = true;
}
// Skills that would be deleted by taking age ranges off the goal being edited.
function removedSkills() {
  const row = rows.value.find(entry => entry.id === form.value.id);
  if (!row) return 0;
  return Object.entries(row.range_skill_counts ?? {})
    .filter(([range]) => !form.value.age_range_ids.includes(Number(range)))
    .reduce((sum, [, count]) => sum + Number(count), 0);
}
function submit() {
  const count = removedSkills();
  if (count) confirming.value = count;
  else save();
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  try {
    if (form.value.id) await axios.put(`/api/carolina-general-goals/${form.value.id}`, form.value);
    else await axios.post('/api/carolina-general-goals', form.value);
    dialog.value = false;
    confirming.value = null;
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000 });
    await fetchRows();
  } catch (error) {
    confirming.value = null;
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
    <DataTable :value="tableRows" :loading="loading" dataKey="id" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]"
      :filters="filters" :globalFilterFields="['title', 'ranges_text']" v-can="'carolina general goal list'">
      <template #header>
        <div class="carolina-table-header">
          <h1>{{ $t('carolina_ui.general_goals') }}</h1>
          <div class="carolina-table-tools">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="filters.global.value" :placeholder="$t('search')" />
            </IconField>
            <Button v-can="'carolina general goal create'" :label="$t('create_button')" icon="pi pi-plus" @click="openNew" />
          </div>
        </div>
      </template>
      <template #empty>{{ $t('carolina_ui.no_general_goals') }}</template>
      <Column field="title" :header="$t('carolina_ui.general_goal')" sortable />
      <Column :header="$t('carolina_ui.age_ranges')">
        <template #body="{ data }">
          <div class="range-chips">
            <Tag v-for="range in data.age_ranges" :key="range.id" severity="secondary" :value="range.name" class="ltr-chip" />
            <span v-if="!data.age_ranges?.length" class="muted">—</span>
          </div>
        </template>
      </Column>
      <Column field="skills_count" :header="$t('carolina_ui.skills_count')" sortable style="width: 9rem" />
      <Column style="width: 8rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'carolina general goal edit'" icon="pi pi-pencil" :aria-label="$t('edit')" @click="edit(data)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" />
            <Button v-can="'carolina general goal delete'" icon="pi pi-trash" :aria-label="$t('delete')" @click="deleting = data" rounded severity="danger" variant="outlined" v-tooltip.top="$t('delete')" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" :style="{ width: '560px', maxWidth: '95vw' }" :header="$t('carolina_ui.general_goal')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <form class="carolina-form" data-no-request-spinner @submit.prevent="submit">
        <div class="form-field">
          <label for="goal-title">{{ $t('carolina_ui.general_goal') }}</label>
          <InputText id="goal-title" v-model="form.title" fluid :disabled="saving" :invalid="Boolean(errors.title)" />
          <small v-if="errors.title" class="field-error">{{ firstError('title') }}</small>
        </div>
        <div class="form-field">
          <label for="goal-ranges">{{ $t('carolina_ui.age_ranges') }}</label>
          <MultiSelect inputId="goal-ranges" v-model="form.age_range_ids" :options="ageRanges" optionLabel="name" optionValue="id"
            display="chip" fluid filter :disabled="saving" :invalid="Boolean(errors.age_range_ids)"
            :placeholder="$t('carolina_ui.choose_age_ranges')" :emptyMessage="$t('carolina_ui.no_age_ranges')">
            <template #option="{ option }"><span dir="ltr">{{ option.name }}</span>&nbsp;{{ $t('carolina_ui.months') }}</template>
          </MultiSelect>
          <small v-if="errors.age_range_ids" class="field-error">{{ firstError('age_range_ids') }}</small>
        </div>
        <div class="form-actions">
          <Button type="submit" :loading="saving" :label="$t('submit')" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="Boolean(confirming)" @update:visible="confirming = null" :style="{ width: '460px', maxWidth: '95vw' }" :header="$t('carolina_ui.confirm')" modal>
      <p>{{ $t('carolina_ui.remove_ranges_cascade', { n: confirming }) }}</p>
      <template #footer>
        <Button :label="$t('no')" :disabled="saving" @click="confirming = null" variant="text" severity="secondary" />
        <Button :label="$t('yes')" :loading="saving" @click="save" severity="danger" />
      </template>
    </Dialog>

    <Dialog :visible="Boolean(deleting)" @update:visible="deleting = null" :style="{ width: '460px', maxWidth: '95vw' }" :header="$t('delete')" modal>
      <p>{{ $t('remove_item') }} <b>{{ deleting?.title }}</b>؟</p>
      <Message v-if="deleting?.skills_count" severity="warn" :closable="false">{{ $t('carolina_ui.delete_cascade', { n: deleting.skills_count }) }}</Message>
      <template #footer>
        <Button :label="$t('no')" :disabled="saving" @click="deleting = null" variant="text" severity="secondary" />
        <Button :label="$t('yes')" :loading="saving" @click="remove" severity="danger" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped src="./carolina-admin.css"></style>
