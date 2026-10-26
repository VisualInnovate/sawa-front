<script setup>
// The schedule items as a list (date, time, type, child, details, employee, status and marks), the colored row
// telling the type and the rows needing attention tinted.
import moment from "moment";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { dayLabel } from "@/utils/studentPrograms";
import { FLAG_META, ITEM_TYPES, STATUS_SEVERITY, itemSubtitle, itemTitle, needsAttention, statusLabel } from "@/utils/schedules";

const props = defineProps({
  items: { type: Array, default: () => [] },
  showStaff: { type: Boolean, default: false },
  showFlags: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
});

const { t } = useI18n();
const evaluationName = (type) => getEvaluationTypeLabel(type, t, t("sch.type_evaluation"));

const type = ref(null);
const attentionOnly = ref(false);
const types = computed(() => [{ value: null, label: t("sp_all") },
  ...Object.keys(ITEM_TYPES).filter((key) => props.items.some((item) => item.type === key)).map((value) => ({ value, label: t(`sch.type_${value}`) }))]);
const shown = computed(() => props.items.filter((item) => (!type.value || item.type === type.value) && (!attentionOnly.value || needsAttention(item))));
const rowClass = (item) => (props.showFlags && needsAttention(item) ? "sch-row-attention" : "");
const flagsOf = (item) => (item.flags ?? []).filter((flag) => FLAG_META[flag]);
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2 mb-3 no-print">
      <Button v-for="option in types" :key="String(option.value)" size="small" :variant="type === option.value ? undefined : 'outlined'"
        :label="`${option.label} (${option.value ? items.filter((item) => item.type === option.value).length : items.length})`" @click="type = option.value" />
      <label v-if="showFlags" class="flex items-center gap-2 ms-auto text-sm">
        <ToggleSwitch v-model="attentionOnly" inputId="sch-attention" />
        <span>{{ $t("sch.attention_only") }} ({{ items.filter(needsAttention).length }})</span>
      </label>
    </div>
    <DataTable :value="shown" :loading="loading" dataKey="key" paginator :rows="25" :rowClass="rowClass" size="small" class="sch-list">
      <template #empty><div class="text-center text-color-secondary py-4">{{ $t("sch.empty") }}</div></template>
      <Column :header="$t('sp_date')">
        <template #body="{ data }"><span class="whitespace-nowrap">{{ dayLabel(t, moment(data.date).day()) }} {{ moment(data.date).format("DD/MM") }}</span></template>
      </Column>
      <Column :header="$t('sp_hour')">
        <template #body="{ data }"><span v-if="data.start" class="whitespace-nowrap" dir="ltr">{{ data.start }} – {{ data.end }}</span><span v-else>{{ $t("sch.all_day") }}</span></template>
      </Column>
      <Column :header="$t('sch.type')">
        <template #body="{ data }">
          <span class="sch-type" :style="{ background: ITEM_TYPES[data.type]?.bg, color: ITEM_TYPES[data.type]?.text, borderColor: ITEM_TYPES[data.type]?.border }">
            <i :class="ITEM_TYPES[data.type]?.icon" aria-hidden="true" /> {{ $t(`sch.type_${data.type}`) }}
          </span>
        </template>
      </Column>
      <Column :header="$t('sp_student')">
        <template #body="{ data }"><b>{{ itemTitle(t, data) }}</b></template>
      </Column>
      <Column :header="$t('sch.details')">
        <template #body="{ data }">
          {{ itemSubtitle(t, data, evaluationName) }}
          <div v-if="data.room" class="text-xs text-color-secondary"><i class="pi pi-home text-xs" aria-hidden="true" /> {{ data.room }}</div>
        </template>
      </Column>
      <Column v-if="showStaff" :header="$t('sp_therapist')">
        <template #body="{ data }">{{ data.staff }}</template>
      </Column>
      <Column :header="$t('sp_status')">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <Tag v-if="data.status" :severity="STATUS_SEVERITY[data.status] ?? 'secondary'" :value="statusLabel(t, data)" class="whitespace-nowrap" />
            <template v-if="showFlags">
              <Tag v-for="flag in flagsOf(data)" :key="flag" :severity="FLAG_META[flag].severity" :icon="FLAG_META[flag].icon" :value="$t(`sch.flag_${flag}`)" class="whitespace-nowrap" />
            </template>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.sch-type {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.75rem;
  white-space: nowrap;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.sch-list :deep(.sch-row-attention) {
  background: #fff7ed;
}
</style>
