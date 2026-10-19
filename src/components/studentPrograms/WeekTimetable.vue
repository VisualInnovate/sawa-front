<script setup>
// A school-like week: one column per day, one row per hour; inclusion shows its from–to in each day.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { dayLabel, sessionKindLabel, timeRange } from "@/utils/studentPrograms";

const props = defineProps({
  // [{day, start, end, session_kind, treatment_name, room_name, therapist_name, available, available_from}]
  slots: { type: Array, default: () => [] },
  treatments: { type: Object, default: () => ({}) }, // id -> name, when slots only carry ids
});
const { t } = useI18n();

const days = computed(() => [...new Set(props.slots.map((slot) => slot.day))].sort());
const hours = computed(() => [...new Set(props.slots.filter((slot) => slot.start).map((slot) => slot.start))].sort());
const isInclusion = computed(() => props.slots.some((slot) => slot.session_kind === "inclusion"));

function cell(day, hour) {
  return props.slots.find((slot) => slot.day === day && slot.start === hour);
}

function inclusionOf(day) {
  return props.slots.find((slot) => slot.day === day) ?? {};
}

function treatment(slot) {
  return slot.treatment_name ?? slot.treatment?.name ?? props.treatments[slot.treatment_id] ?? "";
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[560px] border-collapse text-sm">
      <thead>
        <tr class="bg-[#F4F7F8]">
          <th class="p-2 text-start w-[6rem]">{{ $t("sp_hour") }}</th>
          <th v-for="day in days" :key="day" class="p-2 text-start">{{ dayLabel(t, day) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isInclusion">
          <td class="p-2 font-semibold">{{ $t("sp_inclusion_time") }}</td>
          <td v-for="day in days" :key="day" class="p-2">
            <div class="rounded-lg p-2" :class="inclusionOf(day).available === false ? 'bg-[#FDECEC]' : 'bg-[#E8F3F4]'">
              <div class="font-semibold">{{ timeRange(inclusionOf(day).start, inclusionOf(day).end) }}</div>
              <div class="text-color-secondary">{{ inclusionOf(day).therapist_name ?? inclusionOf(day).therapist?.name }}</div>
            </div>
          </td>
        </tr>
        <tr v-for="hour in isInclusion ? [] : hours" :key="hour" class="border-b border-[#EEF1F2] align-top">
          <td class="p-2 font-semibold whitespace-nowrap">{{ hour }}</td>
          <td v-for="day in days" :key="day" class="p-1">
            <div v-if="cell(day, hour)" class="rounded-lg p-2 flex flex-column gap-1"
              :class="cell(day, hour).available === false ? 'bg-[#FDECEC]' : cell(day, hour).session_kind === 'individual' ? 'bg-[#E8F3F4]' : 'bg-[#F3EFE6]'">
              <span class="font-semibold">{{ treatment(cell(day, hour)) }}</span>
              <span class="text-xs">{{ sessionKindLabel(t, cell(day, hour).session_kind) }}</span>
              <span class="text-xs text-color-secondary">
                {{ cell(day, hour).room_name ?? cell(day, hour).room?.name }} · {{ cell(day, hour).therapist_name ?? cell(day, hour).therapist?.name }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
