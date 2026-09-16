<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import Evaluation from '@/components/Evaluation.vue';
import SubGoalForm from '@/components/milestone/SubGoalForm.vue';
import { emptyMilestoneWording } from '@/utils/milestone';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';

const { t } = useI18n();
const toast = useToast();
const rows = ref([]), domains = ref([]), generalGoals = ref([]), levels = ref([]);
const selectedLevel = ref(null), loading = ref(false), saving = ref(false), dialog = ref(false), deleting = ref(null);
const errors = ref({});
const form = ref({ wording: emptyMilestoneWording() });
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });

async function fetchRows() {
  loading.value = true;
  try {
    const { data } = await axios.get('/api/milestone-sub-goals', { params: { level_id: selectedLevel.value || undefined } });
    rows.value = data.data;
  } catch { notifyError(); }
  finally { loading.value = false; }
}
function openNew() {
  form.value = { question_type_id: null, subtest_id: null, wording: emptyMilestoneWording() };
  errors.value = {};
  dialog.value = true;
}
async function edit(id) {
  try {
    const { data } = await axios.get(`/api/milestone-sub-goals/${id}`);
    const item = data.data, wording = emptyMilestoneWording();
    for (const gender of ['male', 'female']) Object.assign(wording[gender], item.wording?.[gender] || {});
    form.value = { id: item.id, question_type_id: item.question_type_id, subtest_id: item.subtest_id, wording };
    errors.value = {};
    dialog.value = true;
  } catch { notifyError(); }
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  try {
    if (form.value.id) await axios.put(`/api/milestone-sub-goals/${form.value.id}`, form.value);
    else await axios.post('/api/milestone-sub-goals', form.value);
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
    await axios.delete(`/api/milestone-sub-goals/${deleting.value.id}`);
    deleting.value = null;
    await fetchRows();
  } catch { notifyError(); }
  finally { saving.value = false; }
}
onMounted(async () => {
  await Promise.all([
    fetchRows(),
    axios.get('/api/milestone-domains').then(({ data }) => { domains.value = data.data; }).catch(notifyError),
    axios.get('/api/milestone-general-goals').then(({ data }) => { generalGoals.value = data.data; }).catch(notifyError),
    axios.get('/api/mileston-levels').then(({ data }) => { levels.value = data.data; }).catch(notifyError),
  ]);
});
</script>

<template>
  <section class="p-4">
    <Evaluation />
    <Toast />
    <DataTable :value="rows" :loading="loading" dataKey="id" paginator :rows="10" :rowsPerPageOptions="[5, 10, 25]"
      :filters="filters" :globalFilterFields="['wording.male.title', 'wording.female.title', 'question_type.title', 'subtest.title']"
      v-can="'milestone sub goal list'" responsiveLayout="scroll">
      <template #header>
        <div class="flex flex-wrap items-center gap-3 justify-between">
          <h1 class="text-lg font-semibold">{{ $t('milestone_sub_goals') }}</h1>
          <Button v-can="'milestone sub goal create'" :label="$t('create_button')" icon="pi pi-plus" class="p-button-success" @click="openNew" />
          <Dropdown v-model="selectedLevel" :options="levels" optionLabel="title" optionValue="id" showClear
            :placeholder="$t('level_id')" @update:modelValue="fetchRows" />
          <InputText v-model="filters.global.value" :placeholder="$t('search')" />
        </div>
      </template>
      <Column field="wording.male.title" :header="`${$t('milestone_sub_goal')} — ${$t('male')}`" sortable />
      <Column field="wording.female.title" :header="`${$t('milestone_sub_goal')} — ${$t('female')}`" sortable />
      <Column field="question_type.title" :header="$t('milestone_domain')" sortable />
      <Column field="subtest.title" :header="$t('milestone_general_goal')" sortable />
      <Column field="subtest.level.title" :header="$t('level_id')" sortable />
      <Column>
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button v-can="'milestone sub goal edit'" icon="pi pi-pencil" :aria-label="$t('edit')" class="p-button-rounded p-button-success" @click="edit(data.id)" />
            <Button v-can="'milestone sub goal delete'" icon="pi pi-trash" :aria-label="$t('delete')" class="p-button-rounded p-button-danger" @click="deleting = data" />
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="dialog" :style="{ width: '760px', maxWidth: '95vw' }" :header="$t('milestone_sub_goal')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <SubGoalForm v-if="dialog" v-model="form" :domains="domains" :generalGoals="generalGoals" :errors="errors" :saving="saving" @submit="save" />
    </Dialog>
    <Dialog :visible="Boolean(deleting)" @update:visible="deleting = null" :style="{ width: '450px', maxWidth: '95vw' }" :header="$t('submit')" modal>
      <p>{{ $t('remove_item') }}</p>
      <template #footer>
        <Button :label="$t('no')" :disabled="saving" class="p-button-text" @click="deleting = null" />
        <Button :label="$t('yes')" :loading="saving" class="p-button-danger" @click="remove" />
      </template>
    </Dialog>
  </section>
</template>
