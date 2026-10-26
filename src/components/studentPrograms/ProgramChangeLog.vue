<script setup>
// A student program's log entries: who created or changed it and when, and for each changed field what it was and
// what it became (therapist, dates, weekly sessions, days, inclusion settings, price, quota rows, the week's slots).
import { amount } from "@/utils/accounting";
import moment from "moment";
import { useI18n } from "vue-i18n";
import { money } from "@/utils/programFees";
import { dayLabel, sessionKindLabel, timeRange } from "@/utils/studentPrograms";

defineProps({
  logs: { type: Array, default: () => [] },
  showProgram: { type: Boolean, default: false },
});

const { t } = useI18n();

const LIST_FIELDS = ["rows", "week", "days", "inclusion_hours"];

function lines(field, value) {
  if (value === null || value === undefined || value === "") return [];
  switch (field) {
    case "days": return [value.map((day) => dayLabel(t, day)).join("، ")];
    case "rows": return value.map((row) => [row.treatment, sessionKindLabel(t, row.session_kind), `× ${row.sessions}`].filter(Boolean).join(" · "));
    case "week": return value.map((slot) => `${dayLabel(t, slot.day)} ${timeRange(slot.start, slot.end)} · ${[slot.treatment, sessionKindLabel(t, slot.session_kind), slot.room, slot.therapist].filter(Boolean).join(" · ")}`);
    case "inclusion_hours": return value.map((row) => `${dayLabel(t, row.day)} ${timeRange(row.start, row.end)}`);
    case "price": return [amount(value)];
    case "inclusion_english": return [value ? t("yes") : t("no")];
    case "inclusion_type": return [value === "supervision" ? t("sp_inclusion_supervision") : t("sp_inclusion_program")];
    default: return [String(value)];
  }
}
// For lists: what was removed and what was added; for the rest, the old and new values.
function diff(change) {
  const before = lines(change.field, change.before);
  const after = lines(change.field, change.after);
  if (!LIST_FIELDS.includes(change.field) || change.field === "days") return { before, after };
  return { before: before.filter((line) => !after.includes(line)), after: after.filter((line) => !before.includes(line)) };
}
</script>

<template>
  <p v-if="!logs.length" class="pcl-empty">{{ $t("program_log_empty") }}</p>
  <ol v-else class="pcl">
    <li v-for="log in logs" :key="log.id" class="pcl-entry" :class="'is-' + log.action">
      <header>
        <Tag :severity="log.action === 'created' ? 'success' : 'info'" :value="$t(`program_log_${log.action}`)" />
        <span v-if="showProgram && log.program" class="pcl-program">{{ log.program.student?.name }}</span>
        <span class="pcl-meta"><i class="pi pi-user" aria-hidden="true" /> {{ log.user?.name ?? "—" }}</span>
        <span class="pcl-meta" dir="ltr">{{ moment(log.created_at).format("YYYY-MM-DD HH:mm") }}</span>
      </header>
      <table v-if="log.changes?.length" class="pcl-table">
        <thead>
          <tr>
            <th>{{ $t("program_log_field") }}</th>
            <th v-if="log.action === 'updated'">{{ $t("program_log_before") }}</th>
            <th>{{ log.action === "updated" ? $t("program_log_after") : $t("program_log_value") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="change in log.changes" :key="change.field">
            <th scope="row">{{ $t(`program_log_field_${change.field}`) }}</th>
            <td v-if="log.action === 'updated'" class="pcl-before">
              <div v-for="(line, i) in diff(change).before" :key="i">{{ line }}</div>
              <span v-if="!diff(change).before.length">—</span>
            </td>
            <td class="pcl-after">
              <div v-for="(line, i) in diff(change).after" :key="i">{{ line }}</div>
              <span v-if="!diff(change).after.length">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </li>
  </ol>
</template>

<style scoped>
.pcl-empty { margin: 0; padding: 1rem; text-align: center; color: #64748b; }
.pcl { display: grid; gap: .9rem; margin: 0; padding: 0; list-style: none; }
.pcl-entry { padding: .85rem 1rem; border: 1px solid #e2e8f0; border-inline-start: 4px solid #0ea5e9; border-radius: 12px; background: #fff; }
.pcl-entry.is-created { border-inline-start-color: #16a34a; }
.pcl-entry header { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; margin-bottom: .6rem; }
.pcl-program { font-weight: 700; color: #135c65; }
.pcl-meta { color: #64748b; font-size: .85rem; }
.pcl-table { width: 100%; border-collapse: collapse; font-size: .85rem; }
.pcl-table th, .pcl-table td { padding: .4rem .55rem; border-bottom: 1px solid #f1f5f9; text-align: start; vertical-align: top; }
.pcl-table thead th { color: #64748b; font-weight: 600; background: #f8fafc; }
.pcl-table tbody th { width: 9rem; font-weight: 700; color: #0f172a; }
.pcl-before { color: #b91c1c; text-decoration: line-through; text-decoration-color: rgb(185 28 28 / .35); }
.pcl-after { color: #166534; }
.pcl-entry.is-created .pcl-after { color: #0f172a; }
@media (max-width: 640px) { .pcl-table tbody th { width: auto; } }
</style>
