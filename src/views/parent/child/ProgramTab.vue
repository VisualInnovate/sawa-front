<script setup>
// The child's program(s): the kind, the therapist, the period, the price and its payment, the week as a
// timetable, and the sessions — what is next and what happened (with how each ended).
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import EmptyState from "@/components/parent/EmptyState.vue";
import WeekTimetable from "@/components/studentPrograms/WeekTimetable.vue";
import { dayLabel, sessionKindLabel, timeRange } from "@/utils/studentPrograms";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { fmtDate, fmtDay, fmtTime, isToday, meta, money } from "@/utils/parentPortal";

const props = defineProps({ child: { type: Object, required: true }, childId: { type: [Number, String], required: true } });
const { t } = useI18n();
const portal = useParentPortalStore();

const loading = ref(true);
const programs = ref([]);
const sessions = ref({ upcoming: [], recent: [] });
const currency = computed(() => portal.home?.finance?.currency ?? "JD");

onMounted(async () => {
  try {
    const { data } = await axios.get(`/api/parent/child/${props.childId}/portal/programs`);
    programs.value = data.programs ?? [];
    sessions.value = data.sessions ?? { upcoming: [], recent: [] };
  } catch {
    programs.value = [];
  } finally {
    loading.value = false;
  }
});

const statusOf = (program) => (program.stopped_at ? "stopped" : program.accounting_status);
const when = (session) => `${isToday(session.starts_at) ? t("pp.today") : fmtDay(session.starts_at)} · ${fmtTime(session.starts_at)}`;
const flags = (session) => [session.postponed ? t("pp.flag_postponed") : null, session.makeup ? t("pp.flag_makeup") : null, session.holiday].filter(Boolean);
</script>

<template>
  <div class="pp-stack">
    <div v-if="loading" class="pp-stack">
      <div class="pp-skeleton" style="height: 220px" />
      <div class="pp-skeleton" style="height: 160px" />
    </div>

    <template v-else>
      <EmptyState v-if="!programs.length" icon="pi pi-book" :title="$t('pp.no_program_title')" :text="$t('pp.no_program_text')">
        <router-link :to="{ name: 'BookingTime', params: { child_id: childId } }" class="pp-btn pp-btn--magenta"><i class="pi pi-calendar-plus" /> {{ $t("pp.book_consultation") }}</router-link>
      </EmptyState>

      <article v-for="(program, i) in programs" :key="program.id" class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': i }">
        <div class="pp-row pp-between">
          <div class="pp-row">
            <span class="pp-item__icon"><i class="pi pi-book" /></span>
            <div>
              <h2 class="pp-h2">{{ meta("programKind", program.kind).label }}<template v-if="program.kind === 'inclusion' && program.inclusion_type"> · {{ program.inclusion_type === 'supervision' ? $t("pp.inclusion_supervision") : $t("pp.inclusion_full") }}</template></h2>
              <p class="pp-item__meta">{{ fmtDate(program.start_date) }} — {{ fmtDate(program.end_date) }}</p>
            </div>
          </div>
          <span class="pp-tag" :class="`pp-tag--${meta('programStatus', statusOf(program)).severity}`">{{ meta("programStatus", statusOf(program)).label }}</span>
        </div>

        <p v-if="statusOf(program) === 'tentative'" class="pp-note"><i class="pi pi-info-circle" /> {{ $t("pp.ps_tentative_hint") }}</p>
        <p v-else-if="statusOf(program) === 'unconfirmed'" class="pp-note pp-note--warn"><i class="pi pi-exclamation-triangle" /> {{ $t("pp.ps_unconfirmed_hint") }}</p>

        <dl class="pp-kv">
          <template v-if="program.therapist?.name"><dt>{{ $t("sp_therapist") }}</dt><dd>{{ program.therapist.name }}</dd></template>
          <template v-if="program.weekly_sessions"><dt>{{ $t("sp_weekly_sessions") }}</dt><dd>{{ program.weekly_sessions }}</dd></template>
          <template v-if="program.sessions_count"><dt>{{ $t("pp.sessions_total") }}</dt><dd>{{ program.sessions_count }}</dd></template>
          <dt>{{ $t("acc.price") }}</dt><dd class="pp-num">{{ money(program.price, currency) }}</dd>
          <template v-if="program.charge">
            <dt>{{ $t("acc.paid") }}</dt><dd class="pp-num text-[var(--pp-success)]">{{ money(program.charge.paid, currency) }}</dd>
            <dt>{{ $t("acc.remaining") }}</dt><dd class="pp-num">{{ money(program.charge.remaining, currency) }}</dd>
            <template v-if="program.charge.late > 0"><dt>{{ $t("acc.late") }}</dt><dd class="pp-num text-[var(--pp-danger)]">{{ money(program.charge.late, currency) }}</dd></template>
          </template>
        </dl>

        <div v-if="program.student_program_details?.length" class="pp-row">
          <span v-for="row in program.student_program_details" :key="row.id" class="pp-tag pp-tag--teal">
            {{ [row.treatment?.name, sessionKindLabel(t, row.session_kind), row.sessions ? $t("pp.sessions_n", { n: row.sessions }) : null].filter(Boolean).join(" · ") }}
          </span>
        </div>
        <div v-if="program.inclusion_hours?.length" class="pp-row text-sm">
          <span v-for="row in program.inclusion_hours" :key="row.day" class="pp-tag">{{ dayLabel(t, row.day) }}: {{ timeRange(row.start, row.end) }}</span>
        </div>

        <template v-if="program.week?.length">
          <h3 class="pp-h3">{{ $t("pp.program_week") }}</h3>
          <div class="pp-timetable"><WeekTimetable :slots="program.week" /></div>
        </template>

        <template v-if="program.plan_goals?.length">
          <h3 class="pp-h3">{{ $t("pp.program_goals") }}</h3>
          <ul class="pp-goals">
            <li v-for="goal in program.plan_goals" :key="goal.id">{{ goal.body }}</li>
          </ul>
        </template>
      </article>

      <section v-if="sessions.upcoming.length || sessions.recent.length" class="pp-grid pp-grid--2 pp-in" :style="{ '--i': programs.length }">
        <div class="pp-card pp-card--pad pp-stack">
          <h3 class="pp-h3"><i class="pi pi-calendar-clock text-[var(--pp-teal)]" /> {{ $t("pp.sessions_upcoming") }}</h3>
          <EmptyState v-if="!sessions.upcoming.length" icon="pi pi-calendar" :text="$t('pp.nothing_upcoming')" />
          <div v-else class="pp-list">
            <div v-for="session in sessions.upcoming" :key="session.id" class="pp-item">
              <span class="pp-item__icon"><i class="pi pi-users" /></span>
              <div class="pp-item__body">
                <p class="pp-item__title">{{ session.treatment || $t("pp.type_session") }}<small v-if="session.kind" class="pp-muted font-semibold"> · {{ sessionKindLabel(t, session.kind) }}</small></p>
                <p class="pp-item__meta">{{ when(session) }}<template v-if="session.therapist"> · {{ session.therapist }}</template><template v-if="session.room"> · {{ session.room }}</template></p>
                <p v-if="flags(session).length" class="pp-item__meta text-[var(--pp-warn)]">{{ flags(session).join(" · ") }}</p>
              </div>
              <span v-if="session.status && session.status !== 'closed'" class="pp-tag" :class="`pp-tag--${meta('session', session.status).severity}`">{{ meta("session", session.status).label }}</span>
            </div>
          </div>
        </div>
        <div class="pp-card pp-card--pad pp-stack">
          <h3 class="pp-h3"><i class="pi pi-history text-[var(--pp-teal)]" /> {{ $t("pp.sessions_recent") }}</h3>
          <EmptyState v-if="!sessions.recent.length" icon="pi pi-history" :text="$t('pp.no_sessions_yet')" />
          <div v-else class="pp-list">
            <div v-for="session in sessions.recent" :key="session.id" class="pp-item">
              <span class="pp-item__icon" :class="session.status === 'missed' ? 'pp-item__icon--warn' : 'pp-item__icon--success'"><i :class="session.status === 'missed' ? 'pi pi-times' : 'pi pi-check'" /></span>
              <div class="pp-item__body">
                <p class="pp-item__title">{{ session.treatment || $t("pp.type_session") }}</p>
                <p class="pp-item__meta">{{ fmtDay(session.starts_at) }} · {{ fmtTime(session.starts_at) }}<template v-if="session.therapist"> · {{ session.therapist }}</template></p>
              </div>
              <span class="pp-tag" :class="`pp-tag--${meta('session', session.status).severity}`">{{ meta("session", session.status).label }}</span>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.pp-note {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  background: var(--pp-info-50);
  color: var(--pp-info);
  font-size: 0.9rem;
  line-height: 1.7;
}
.pp-note--warn {
  background: var(--pp-warn-50);
  color: var(--pp-warn);
}
.pp-timetable {
  overflow-x: auto;
}
.pp-goals {
  margin: 0;
  padding-inline-start: 1.25rem;
  display: grid;
  gap: 0.35rem;
  line-height: 1.7;
}
.pp-goals li::marker {
  color: var(--pp-magenta);
}
</style>
