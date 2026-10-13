<script setup>
// Carolina skills: each under a general goal and one of its age ranges, with its own symbol and the five wordings
// for a boy and for a girl.
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import CarolianaTab from '@/components/CarolianaTab.vue';
import CarolinaSkillForm from '@/components/carolina/CarolinaSkillForm.vue';
import { emptyCarolinaWording } from '@/utils/carolina';

const { t } = useI18n();
const toast = useToast();
const rows = ref([]), generalGoals = ref([]), symbols = ref([]);
const loading = ref(false), saving = ref(false), dialog = ref(false), deleting = ref(null);
const selectedGoal = ref(null);
const errors = ref({});
const form = ref({ wording: emptyCarolinaWording() });
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });

const visibleRows = computed(() => rows.value.filter(row => !selectedGoal.value || row.general_goal_id === selectedGoal.value));

async function fetchAll() {
  loading.value = true;
  try {
    const [skills, goals, list] = await Promise.all([
      axios.get('/api/carolina-skills'), axios.get('/api/carolina-general-goals'), axios.get('/api/carolina-symbols'),
    ]);
    rows.value = skills.data.data ?? [];
    generalGoals.value = goals.data.data ?? [];
    symbols.value = list.data.data ?? [];
  } catch { notifyError(); }
  finally { loading.value = false; }
}
function openNew() {
  form.value = { general_goal_id: selectedGoal.value, age_range_id: null, symbol_id: null, wording: emptyCarolinaWording() };
  errors.value = {};
  dialog.value = true;
}
function edit(row) {
  const wording = emptyCarolinaWording();
  for (const gender of ['male', 'female']) Object.assign(wording[gender], row.wording?.[gender] || {});
  form.value = { id: row.id, general_goal_id: row.general_goal_id, age_range_id: row.age_range_id, symbol_id: row.symbol_id, wording };
  errors.value = {};
  dialog.value = true;
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  try {
    if (form.value.id) await axios.put(`/api/carolina-skills/${form.value.id}`, form.value);
    else await axios.post('/api/carolina-skills', form.value);
    dialog.value = false;
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000 });
    await fetchAll();
  } catch (error) {
    if (error.response?.status === 422) errors.value = error.response.data.errors || {};
    else notifyError();
  } finally { saving.value = false; }
}
async function remove() {
  if (saving.value || !deleting.value) return;
  saving.value = true;
  try {
    await axios.delete(`/api/carolina-skills/${deleting.value.id}`);
    deleting.value = null;
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000 });
    await fetchAll();
  } catch { notifyError(); }
  finally { saving.value = false; }
}
onMounted(fetchAll);
</script>

<template>
  <section>
    <CarolianaTab />
    <Toast />
    <DataTable :value="visibleRows" :loading="loading" dataKey="id" paginator :rows="25" :rowsPerPageOptions="[25, 50, 100]"
      :filters="filters" :globalFilterFields="['symbol.name', 'wording.male.skill', 'wording.female.skill', 'general_goal.title', 'age_range.name']"
      v-can="'carolina skill list'">
      <template #header>
        <div class="carolina-table-header">
          <h1>{{ $t('carolina_ui.skills') }}</h1>
          <div class="carolina-table-tools">
            <Select v-model="selectedGoal" :options="generalGoals" optionLabel="title" optionValue="id" showClear filter
              :placeholder="$t('carolina_ui.all_general_goals')" />
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="filters.global.value" :placeholder="$t('search')" />
            </IconField>
            <Button v-can="'carolina skill create'" :label="$t('create_button')" icon="pi pi-plus" @click="openNew" />
          </div>
        </div>
      </template>
      <template #empty>{{ $t('carolina_ui.no_skills') }}</template>
      <Column field="general_goal.title" :header="$t('carolina_ui.general_goal')" />
      <Column :header="$t('carolina_ui.age_range')" style="width: 9rem">
        <template #body="{ data }"><span dir="ltr">{{ data.age_range?.name }}</span></template>
      </Column>
      <Column :header="$t('carolina_ui.symbol')" style="width: 8rem">
        <template #body="{ data }"><b dir="ltr">{{ data.symbol?.name }}</b></template>
      </Column>
      <Column :header="$t('carolina_ui.skill')">
        <template #body="{ data }">{{ data.wording?.male?.skill }}</template>
      </Column>
      <Column style="width: 8rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'carolina skill edit'" icon="pi pi-pencil" :aria-label="$t('edit')" @click="edit(data)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" />
            <Button v-can="'carolina skill delete'" icon="pi pi-trash" :aria-label="$t('delete')" @click="deleting = data" rounded severity="danger" variant="outlined" v-tooltip.top="$t('delete')" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" :style="{ width: '900px', maxWidth: '95vw' }" :header="$t('carolina_ui.skill')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <CarolinaSkillForm v-if="dialog" v-model="form" :generalGoals="generalGoals" :symbols="symbols" :skillId="form.id ?? null"
        :errors="errors" :saving="saving" @submit="save" />
    </Dialog>

    <Dialog :visible="Boolean(deleting)" @update:visible="deleting = null" :style="{ width: '460px', maxWidth: '95vw' }" :header="$t('delete')" modal>
      <p>{{ $t('remove_item') }} <b dir="ltr">{{ deleting?.symbol?.name }}</b>؟</p>
      <template #footer>
        <Button :label="$t('no')" :disabled="saving" @click="deleting = null" variant="text" severity="secondary" />
        <Button :label="$t('yes')" :loading="saving" @click="remove" severity="danger" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped src="./carolina-admin.css"></style>
