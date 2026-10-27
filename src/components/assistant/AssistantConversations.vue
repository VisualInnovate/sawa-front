<script setup>
// An assistant's conversations (parent or dashboard): who asked what, the answers, the tools it used and what each cost.
import axios from "axios";
import { onMounted, ref } from "vue";

const props = defineProps({ assistant: { type: String, default: "parent" }, pages: { type: Array, default: () => [] } });

const rows = ref([]);
const total = ref(0);
const loading = ref(false);
const open = ref(null);
const perPage = 20;

const usd = (value) => `$${Number(value ?? 0).toFixed(4)}`;
const when = (value) => (value ? new Date(value).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }) : "");
const pageLabel = (name) => props.pages.find((p) => p.name === name)?.label ?? name;

async function load(page = 1) {
  loading.value = true;
  const { data } = await axios.get(`api/assistant-settings/${props.assistant}/conversations`, { params: { page, per_page: perPage } });
  rows.value = data.data;
  total.value = data.total;
  loading.value = false;
}

async function show(row) {
  const { data } = await axios.get(`api/assistant-settings/${props.assistant}/conversations/${row.id}`);
  open.value = data.data;
}

onMounted(load);
</script>

<template>
  <DataTable :value="rows" :loading="loading" lazy paginator :rows="perPage" :totalRecords="total" size="small" stripedRows rowHover
    class="cursor-pointer" @page="(e) => load(e.page + 1)" @row-click="(e) => show(e.data)">
    <template #empty>{{ $t("ai.empty") }}</template>
    <Column :header="assistant === 'parent' ? $t('ai.parent') : assistant === 'public' ? $t('ai.visitor') : $t('ai.owner')">
      <template #body="{ data }">{{ data.owner?.name ?? "-" }}<br /><small dir="ltr">{{ data.owner?.contact }}</small></template>
    </Column>
    <Column field="title" :header="$t('ai.messages')" />
    <Column field="turns" :header="$t('ai.turns')" style="width: 90px" />
    <Column :header="$t('ai.cost')" style="width: 110px"><template #body="{ data }">{{ usd(data.cost_usd) }}</template></Column>
    <Column :header="$t('ai.last_activity')" style="width: 150px"><template #body="{ data }">{{ when(data.updated_at) }}</template></Column>
  </DataTable>

  <Dialog :visible="!!open" modal :header="open?.conversation.title" :style="{ width: 'min(720px, 95vw)' }" @update:visible="open = null">
    <p v-if="open" class="text-sm text-gray-500 mb-3">
      {{ open.owner?.name ?? "" }} · {{ $t("ai.turns") }}: {{ open.conversation.turns }} · {{ usd(open.conversation.cost_usd) }}
    </p>
    <div v-if="open" class="flex flex-col gap-2">
      <div v-for="m in open.messages" :key="m.id" class="ai-log" :class="m.role === 'user' ? 'ai-log--user' : 'ai-log--bot'">
        <div class="whitespace-pre-line">{{ m.text }}</div>
        <small v-if="m.role === 'user' && m.page?.name" class="text-gray-500">📍 {{ pageLabel(m.page.name) }}</small>
        <div v-if="m.tools?.length" class="flex flex-wrap items-center gap-1 mt-1">
          <small class="text-gray-500">{{ $t("ai.tools_used") }}:</small>
          <Tag v-for="tool in m.tools" :key="tool" :value="tool" severity="secondary" />
        </div>
        <div v-if="m.actions?.length" class="mt-1">
          <Tag v-for="a in m.actions" :key="a.route" :value="`${$t('ai.opened_page')}: ${a.label}`" severity="info" />
        </div>
        <small class="text-gray-400 block mt-1">{{ when(m.created_at) }}</small>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.ai-log {
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  max-width: 90%;
}
.ai-log--user {
  background: #e8f3f4;
  align-self: flex-start;
}
.ai-log--bot {
  background: #f3f4f6;
  align-self: flex-end;
}
</style>
