<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import Evaluation from '@/components/Evaluation.vue';
import SubGoalForm from '@/components/milestone/SubGoalForm.vue';
import { emptyMilestoneWording } from '@/utils/milestone';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';

const { t } = useI18n();
const toast = useToast();
const rows = ref([]), domains = ref([]), generalGoals = ref([]), levels = ref([]);
// A domain scored through its own form (EESA) takes no new sub-goals; an existing one keeps its domain.
const subGoalDomains = computed(() => domains.value.filter((domain) => !domain.form || domain.id === form.value?.question_type_id));
const selectedLevel = ref(null), loading = ref(false), saving = ref(false), dialog = ref(false), deleting = ref(null);
const errors = ref({});
const form = ref({ display_order: 0, wording: emptyMilestoneWording() });
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
  form.value = { question_type_id: null, subtest_id: null, display_order: 0, wording: emptyMilestoneWording() };
  errors.value = {};
  dialog.value = true;
}
async function edit(id) {
  try {
    const { data } = await axios.get(`/api/milestone-sub-goals/${id}`);
    const item = data.data, wording = emptyMilestoneWording();
    for (const gender of ['male', 'female']) Object.assign(wording[gender], item.wording?.[gender] || {});
    form.value = {
      id: item.id,
      question_type_id: item.question_type_id,
      subtest_id: item.subtest_id,
      display_order: item.display_order ?? 0,
      wording,
    };
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
      :filters="filters" :globalFilterFields="['wording.male.title', 'wording.female.title', 'question_type.title', 'subtest.title', 'display_order']"
      v-can="'milestone sub goal list'">
      <template #header>
        <div class="flex flex-wrap items-center gap-3 justify-between">
          <h1 class="text-lg font-semibold">{{ $t('milestone_sub_goals') }}</h1>
          <Button v-can="'milestone sub goal create'" :label="$t('create_button')" icon="pi pi-plus" @click="openNew" />
          <Select v-model="selectedLevel" :options="levels" optionLabel="title" optionValue="id" showClear
            :placeholder="$t('level_id')" @update:modelValue="fetchRows" />
          <InputText v-model="filters.global.value" :placeholder="$t('search')" />
        </div>
      </template>
      <Column field="wording.male.title" :header="`${$t('milestone_sub_goal')} — ${$t('male')}`" sortable />
      <Column field="wording.female.title" :header="`${$t('milestone_sub_goal')} — ${$t('female')}`" sortable />
      <Column field="question_type.title" :header="$t('milestone_domain')" sortable />
      <Column field="subtest.title" :header="$t('milestone_general_goal')" sortable />
      <Column field="subtest.level.title" :header="$t('level_id')" sortable />
      <Column field="display_order" :header="$t('display_order')" sortable />
      <Column>
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'milestone sub goal edit'" icon="pi pi-pencil" :aria-label="$t('edit')" @click="edit(data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" />
            <Button v-can="'milestone sub goal delete'" icon="pi pi-trash" :aria-label="$t('delete')" @click="deleting = data" rounded severity="danger" variant="outlined" v-tooltip.top="$t('delete')" />
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="dialog" :style="{ width: '760px', maxWidth: '95vw' }" :header="$t('milestone_sub_goal')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <SubGoalForm v-if="dialog" v-model="form" :domains="subGoalDomains" :generalGoals="generalGoals" :errors="errors" :saving="saving" @submit="save" />
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
