<script setup>
// Who changed the structure, the roles, their permissions and conditions: before → after (only what changed).
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const rows = ref([]);
const total = ref(0);
const page = ref(1);
const loading = ref(false);
const type = ref("all");
const typeOptions = computed(() => [
  { value: "all", label: t("org.log_all") },
  ...["role", "department", "position", "flow"].map((value) => ({ value, label: t(`org.subject_${value}`) })),
]);

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/org-structure/log", { params: { page: page.value, subject_type: type.value === "all" ? undefined : type.value } });
    rows.value = data.data;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

watch(type, () => {
  page.value = 1;
  load();
});

const fieldLabel = (key) => (t(`org.field_${key}`) !== `org.field_${key}` ? t(`org.field_${key}`) : key);
const show = (value) => (Array.isArray(value) ? (value.length ? value.join("، ") : "—") : value ?? "—");
// One line per changed field.
const changes = (row) => {
  const keys = [...new Set([...Object.keys(row.before ?? {}), ...Object.keys(row.after ?? {})])];
  return keys.map((key) => ({ key, before: row.before?.[key], after: row.after?.[key] }));
};
const listField = (row, key) => Array.isArray(row.before?.[key]) || Array.isArray(row.after?.[key]);

function onPage(event) {
  page.value = event.page + 1;
  load();
}

onMounted(load);
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("org.log_menu") }}</p>
      <div class="flex gap-2">
        <Select v-model="type" :options="typeOptions" optionLabel="label" optionValue="value" class="w-12rem" :aria-label="$t('org.log_filter')" />
        <Button icon="pi pi-refresh" variant="text" :loading="loading" @click="load" :aria-label="$t('refresh_data')" />
      </div>
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" lazy paginator :rows="25" :totalRecords="total" @page="onPage" stripedRows size="small">
      <Column :header="$t('org.when')">
        <template #body="{ data }"><bdi class="whitespace-nowrap">{{ data.created_at }}</bdi></template>
      </Column>
      <Column :header="$t('org.by')">
        <template #body="{ data }">{{ data.user?.name ?? "—" }}</template>
      </Column>
      <Column :header="$t('org.subject')">
        <template #body="{ data }">
          <Tag :value="$t(`org.subject_${data.subject_type}`)" severity="secondary" class="me-1" />
          <b>{{ data.subject_name }}</b>
        </template>
      </Column>
      <Column :header="$t('org.action')">
        <template #body="{ data }">
          <Tag :value="$t(`org.action_${data.action}`)" :severity="{ created: 'success', updated: 'info', deleted: 'danger' }[data.action]" />
        </template>
      </Column>
      <Column :header="$t('org.changes')">
        <template #body="{ data }">
          <ul class="m-0 ps-3 text-sm">
            <li v-for="c in changes(data)" :key="c.key">
              <b>{{ fieldLabel(c.key) }}:</b>
              <template v-if="listField(data, c.key) && data.action === 'updated'">
                <span v-if="c.before?.length" class="text-red-600"> − {{ show(c.before) }}</span>
                <span v-if="c.after?.length" class="text-green-700"> + {{ show(c.after) }}</span>
              </template>
              <template v-else-if="data.action === 'updated'">
                <span class="text-color-secondary">{{ show(c.before) }}</span> → <span>{{ show(c.after) }}</span>
              </template>
              <template v-else> {{ show(c.after ?? c.before) }}</template>
            </li>
          </ul>
        </template>
      </Column>
      <template #empty><p class="text-center text-color-secondary">{{ $t("org.log_empty") }}</p></template>
    </DataTable>
  </div>
</template>
