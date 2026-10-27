<script setup>
// Carolina domains (المجال): a title, its type (one of the two «الأنواع»), a display order within the type and the
// general goals under it. A general goal has one domain at most, so picking a goal here moves it from any other
// domain. Deleting a domain keeps its goals, without a domain. Listed by type, then display order.
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import CarolianaTab from '@/components/CarolianaTab.vue';

const { t } = useI18n();
const toast = useToast();
const rows = ref([]), goals = ref([]), types = ref([]);
const loading = ref(false), saving = ref(false), dialog = ref(false), deleting = ref(null);
const errors = ref({});
const blank = () => ({ title: '', type: null, display_order: null, general_goal_ids: [] });
const form = ref(blank());
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });
const firstError = (key) => Array.isArray(errors.value[key]) ? errors.value[key][0] : errors.value[key];
const tableRows = computed(() => rows.value.map(row => ({ ...row, goals_text: (row.general_goals ?? []).map(goal => goal.title).join(' ') })));
// A goal already in another domain says so in the picker (picking it moves it here).
const goalOptions = computed(() => goals.value.map(goal => ({
  ...goal,
  other: goal.domain && goal.domain.id !== form.value.id ? goal.domain.title : null,
})));

async function fetchRows() {
  loading.value = true;
  try {
    const [domains, list, typeList] = await Promise.all([axios.get('/api/carolina-domains'), axios.get('/api/carolina-general-goals'),
      axios.get('/api/carolina-domains/types')]);
    rows.value = domains.data.data ?? [];
    goals.value = list.data.data ?? [];
    types.value = (typeList.data.data?.types ?? []).map(({ id, title }) => ({ id, title }));
  } catch { notifyError(); }
  finally { loading.value = false; }
}
function openNew() {
  form.value = blank();
  errors.value = {};
  dialog.value = true;
}
function edit(row) {
  form.value = { id: row.id, title: row.title ?? '', type: row.type ?? null, display_order: row.display_order ?? null,
    general_goal_ids: (row.general_goals ?? []).map(goal => goal.id) };
  errors.value = {};
  dialog.value = true;
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  try {
    if (form.value.id) await axios.put(`/api/carolina-domains/${form.value.id}`, form.value);
    else await axios.post('/api/carolina-domains', form.value);
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
    await axios.delete(`/api/carolina-domains/${deleting.value.id}`);
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
      :filters="filters" :globalFilterFields="['title', 'goals_text']" v-can="'carolina domain list'">
      <template #header>
        <div class="carolina-table-header">
          <h1>{{ $t('carolina_ui.domains') }}</h1>
          <div class="carolina-table-tools">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="filters.global.value" :placeholder="$t('search')" />
            </IconField>
            <Button v-can="'carolina domain create'" :label="$t('create_button')" icon="pi pi-plus" @click="openNew" />
          </div>
        </div>
      </template>
      <template #empty>{{ $t('carolina_ui.no_domains') }}</template>
      <Column field="title" :header="$t('carolina_ui.domain')" sortable />
      <Column :header="$t('carolina_ui.type')" style="width: 15rem">
        <template #body="{ data }">
          <Tag v-if="data.type_title" severity="info" :value="data.type_title" />
          <Tag v-else severity="warn" :value="$t('carolina_ui.no_type')" />
        </template>
      </Column>
      <Column field="display_order" :header="$t('carolina_ui.display_order')" style="width: 8rem" />
      <Column :header="$t('carolina_ui.general_goals')">
        <template #body="{ data }">
          <div class="range-chips">
            <Tag v-for="goal in data.general_goals" :key="goal.id" severity="secondary" :value="goal.title" />
            <span v-if="!data.general_goals?.length" class="muted">—</span>
          </div>
        </template>
      </Column>
      <Column style="width: 8rem">
        <template #body="{ data }">
          <div class="table-actions">
            <Button v-can="'carolina domain edit'" icon="pi pi-pencil" :aria-label="$t('edit')" @click="edit(data)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" />
            <Button v-can="'carolina domain delete'" icon="pi pi-trash" :aria-label="$t('delete')" @click="deleting = data" rounded severity="danger" variant="outlined" v-tooltip.top="$t('delete')" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" :style="{ width: '560px', maxWidth: '95vw' }" :header="$t('carolina_ui.domain')"
      modal :closable="!saving" :closeOnEscape="!saving">
      <form class="carolina-form" data-no-request-spinner @submit.prevent="save">
        <div class="form-field">
          <label for="domain-title">{{ $t('carolina_ui.domain') }}</label>
          <InputText id="domain-title" v-model="form.title" fluid :disabled="saving" :invalid="Boolean(errors.title)" />
          <small v-if="errors.title" class="field-error">{{ firstError('title') }}</small>
        </div>
        <div class="form-field">
          <label for="domain-type">{{ $t('carolina_ui.type') }} <span class="field-error">*</span></label>
          <Select inputId="domain-type" v-model="form.type" :options="types" optionLabel="title" optionValue="id" fluid :disabled="saving"
            :invalid="Boolean(errors.type)" :placeholder="$t('carolina_ui.choose_type')" />
          <small v-if="errors.type" class="field-error">{{ firstError('type') }}</small>
        </div>
        <div class="form-field">
          <label for="domain-order">{{ $t('carolina_ui.display_order') }}</label>
          <InputNumber inputId="domain-order" v-model="form.display_order" :min="0" :max="100000" :useGrouping="false" fluid :disabled="saving"
            :invalid="Boolean(errors.display_order)" />
          <small class="muted">{{ $t('carolina_ui.display_order_hint') }}</small>
          <small v-if="errors.display_order" class="field-error">{{ firstError('display_order') }}</small>
        </div>
        <div class="form-field">
          <label for="domain-goals">{{ $t('carolina_ui.general_goals') }}</label>
          <MultiSelect inputId="domain-goals" v-model="form.general_goal_ids" :options="goalOptions" optionLabel="title" optionValue="id"
            display="chip" fluid filter :disabled="saving" :invalid="Boolean(errors.general_goal_ids)"
            :placeholder="$t('carolina_ui.choose_general_goals')" :emptyMessage="$t('carolina_ui.no_general_goals')">
            <template #option="{ option }">
              <span>{{ option.title }}</span>
              <small v-if="option.other" class="muted">&nbsp;({{ $t('carolina_ui.in_domain', { name: option.other }) }})</small>
            </template>
          </MultiSelect>
          <small class="muted">{{ $t('carolina_ui.domain_goals_hint') }}</small>
          <small v-if="errors.general_goal_ids" class="field-error">{{ firstError('general_goal_ids') }}</small>
        </div>
        <div class="form-actions">
          <Button type="submit" :loading="saving" :label="$t('submit')" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="Boolean(deleting)" @update:visible="deleting = null" :style="{ width: '460px', maxWidth: '95vw' }" :header="$t('delete')" modal>
      <p>{{ $t('remove_item') }} <b>{{ deleting?.title }}</b>؟</p>
      <Message v-if="deleting?.general_goals_count" severity="info" :closable="false">{{ $t('carolina_ui.domain_delete_keeps') }}</Message>
      <template #footer>
        <Button :label="$t('no')" :disabled="saving" @click="deleting = null" variant="text" severity="secondary" />
        <Button :label="$t('yes')" :loading="saving" @click="remove" severity="danger" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped src="./carolina-admin.css"></style>
