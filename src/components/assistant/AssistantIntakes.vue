<script setup>
// What parents told the assistant about their children and the evaluations it suggested (for the specialists).
import axios from "axios";
import { onMounted, ref } from "vue";

const rows = ref([]);
const total = ref(0);
const loading = ref(false);
const expanded = ref({});
const perPage = 20;

const when = (value) => (value ? new Date(value).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }) : "");
const age = (months) => (months == null ? "-" : `${Math.floor(months / 12)}y ${months % 12}m`);

async function load(page = 1) {
  loading.value = true;
  const { data } = await axios.get("api/assistant-settings/parent/intakes", { params: { page, per_page: perPage } });
  rows.value = data.data;
  total.value = data.total;
  loading.value = false;
}

onMounted(load);
</script>

<template>
  <DataTable v-model:expandedRows="expanded" :value="rows" dataKey="id" :loading="loading" lazy paginator :rows="perPage" :totalRecords="total"
    size="small" stripedRows @page="(e) => load(e.page + 1)">
    <template #empty>{{ $t("ai.empty") }}</template>
    <Column expander style="width: 3rem" />
    <Column :header="$t('ai.parent')">
      <template #body="{ data }">{{ data.parent ? `${data.parent.fname} ${data.parent.lname}` : "-" }}<br /><small dir="ltr">{{ data.parent?.phone }}</small></template>
    </Column>
    <Column :header="$t('ai.child')">
      <template #body="{ data }">
        {{ data.child?.name ?? data.child_name ?? "-" }}
        <Tag v-if="!data.child_id" :value="$t('ai.not_registered')" severity="warn" class="mx-1" />
        <br /><small dir="ltr">{{ age(data.age_months) }}</small>
      </template>
    </Column>
    <Column :header="$t('ai.concerns')">
      <template #body="{ data }"><Tag v-for="c in data.concern_labels" :key="c" :value="c" severity="secondary" class="m-1" /></template>
    </Column>
    <Column :header="$t('ai.suggested')">
      <template #body="{ data }"><Tag v-for="s in data.suggested_names" :key="s" :value="s" severity="success" class="m-1" /></template>
    </Column>
    <Column :header="$t('ai.last_activity')" style="width: 150px"><template #body="{ data }">{{ when(data.created_at) }}</template></Column>
    <template #expansion="{ data }">
      <div class="p-2">
        <p class="font-bold mb-2">{{ $t("ai.answers") }}</p>
        <dl class="ai-answers">
          <template v-for="row in data.answer_rows" :key="row.key">
            <dt>{{ row.question }}</dt>
            <dd>{{ row.answer }}</dd>
          </template>
        </dl>
      </div>
    </template>
  </DataTable>
</template>

<style scoped>
.ai-answers dt {
  font-weight: 600;
  color: #135c65;
  margin-top: 0.5rem;
}
.ai-answers dd {
  margin: 0.15rem 0 0;
}
</style>
