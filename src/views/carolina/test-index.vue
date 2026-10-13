<script setup>
// Carolina skills: each one under a general goal, one of its domains and an age range, with its symbol and the
// five wordings for a boy and for a girl.
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import CarolianaTab from '@/components/CarolianaTab.vue';
import CarolinaItemForm from '@/components/carolina/CarolinaItemForm.vue';
import { emptyCarolinaWording } from '@/utils/carolina';

const { t } = useI18n();
const toast = useToast();
const rows = ref([]), categories = ref([]), generalGoals = ref([]);
const loading = ref(false), saving = ref(false), dialog = ref(false), deleting = ref(null);
const selectedGoal = ref(null);
const errors = ref({});
const form = ref({ wording: emptyCarolinaWording() });
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });

const find = (list, id) => list.find(entry => Number(entry.id) === Number(id));
// A skill's general goal is its domain's.
const goalOf = (item) => item.category?.general_goal_id ?? find(categories.value, item.category_id)?.general_goal_id ?? null;
const visibleRows = computed(() => rows.value
  .map(row => ({
    ...row,
    goal_id: goalOf(row),
    domain_title: row.category?.title ?? find(categories.value, row.category_id)?.title ?? '',
    goal_title: row.category?.general_goal?.title ?? find(generalGoals.value, goalOf(row))?.title ?? '',
  }))
  .filter(row => !selectedGoal.value || Number(row.goal_id) === Number(selectedGoal.value)));

async function fetchRows() {
  loading.value = true;
  try {
    const { data } = await axios.get('/api/carolina-test');
    rows.value = data.data ?? [];
  } catch { notifyError(); }
  finally { loading.value = false; }
}
function openNew() {
  form.value = { general_goal_id: selectedGoal.value, category_id: null, age_group_id: null, symbol: '', wording: emptyCarolinaWording() };
  errors.value = {};
  dialog.value = true;
}
async function edit(id) {
  try {
    const { data } = await axios.get(`/api/carolina-test/${id}`);
    const item = data.data, wording = emptyCarolinaWording();
    for (const gender of ['male', 'female']) Object.assign(wording[gender], item.wording?.[gender] || {});
    // Items saved before the wordings had only their skill.
    if (!wording.male.skill && item.skill) wording.male.skill = item.skill;
    form.value = {
      id: item.id,
      general_goal_id: goalOf(item),
      category_id: item.category_id,
      age_group_id: item.age_group_id,
      symbol: item.symbol ?? '',
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
  const payload = form.value;
  try {
    if (payload.id) await axios.put(`/api/carolina-test/${payload.id}`, payload);
    else await axios.post('/api/carolina-test', payload);
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
    await axios.delete(`/api/carolina-test/${deleting.value.id}`);
    deleting.value = null;
    await fetchRows();
  } catch { notifyError(); }
  finally { saving.value = false; }
}
onMounted(async () => {
  await Promise.all([
    fetchRows(),
    axios.get('/api/carolina-category').then(({ data }) => { categories.value = data.data ?? []; }).catch(notifyError),
    axios.get('/api/carolina-general-goals').then(({ data }) => { generalGoals.value = data.data ?? []; }).catch(notifyError),
  ]);
});
</script>

<template>
  <section>
    <CarolianaTab />
    <Toast />
    <DataTable :value="visibleRows" :loading="loading" dataKey="id" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]"
      :filters="filters" :globalFilterFields="['symbol', 'wording.male.skill', 'wording.female.skill', 'skill', 'goal_title', 'domain_title', 'age_group.name']"
      v-can="'carolina test list'">
      <template #header>
        <div class="flex flex-wrap items-center gap-3 justify-between">
          <h1 class="text-lg font-semibold">{{ $t('carolina_ui.items') }}</h1>
          <Button v-can="'carolina test create'" :label="$t('create_button')" icon="pi pi-plus" @click="openNew" />
          <Select v-model="selectedGoal" :options="generalGoals" optionLabel="title" optionValue="id" showClear
            :placeholder="$t('carolina_ui.general_goal')" />
          <InputText v-model="filters.global.value" :placeholder="$t('search')" />
        </div>
      </template>
      <Column field="goal_title" :header="$t('carolina_ui.general_goal')" sortable />
      <Column field="domain_title" :header="$t('carolina_ui.domain')" sortable />
      <Column field="age_group.name" :header="$t('age_range')" sortable />
      <Column field="symbol" :header="$t('carolina_ui.symbol')" sortable>
        <template #body="{ data }"><span dir="ltr">{{ data.symbol }}</span></template>
      </Column>
      <Column :header="$t('carolina_ui.skill')">
        <template #body="{ data }">{{ data.wording?.male?.skill || data.skill }}</template>
      </Column>
      <Column>
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'carolina test edit'" icon="pi pi-pencil" :aria-label="$t('edit')" @click="edit(data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" />
            <Button v-can="'carolina test delete'" icon="pi pi-trash" :aria-label="$t('delete')" @click="deleting = data" rounded severity="danger" variant="outlined" v-tooltip.top="$t('delete')" />
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="dialog" :style="{ width: '860px', maxWidth: '95vw' }" :header="$t('carolina_ui.item')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <CarolinaItemForm v-if="dialog" v-model="form" :categories="categories" :generalGoals="generalGoals" :errors="errors" :saving="saving" @submit="save" />
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
