<script setup>
// «لوحة المعلومات»: the management's view of the whole centre in one page — today's sessions and what runs now,
// what waits for a decision, the money, the children and their programs, the evaluations and consultations, the
// team and its attendance, the rooms, the assistant, the latest activity and what comes next. Everything comes from
// GET api/dashboard/overview; a part the user may not open comes back null and its block is left out. The page reads
// again every minute while it is visible.
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { amount, loadCurrency } from "@/utils/accounting";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { canVisit } from "@/utils/permissions";
import { useAuthStore } from "@/stores/Auth";

const REFRESH_MS = 60_000;
const COLORS = {
  teal: "#135c65", tealSoft: "#3aa39b", sand: "#a9ab7f", magenta: "#b21553", cyan: "#2fa8c4",
  amber: "#d9822b", red: "#dc2626", violet: "#6a3fb5", blue: "#2f6fcf", slate: "#94a3b8",
};

const { t, locale } = useI18n();
const router = useRouter();
const auth = useAuthStore();

const data = ref(null);
const loading = ref(false);
const failed = ref(false);
let timer = null;

async function load() {
  if (document.hidden && data.value) return;
  loading.value = true;
  try {
    await loadCurrency();
    data.value = (await axios.get("api/dashboard/overview")).data;
    failed.value = false;
  } catch {
    failed.value = !data.value;
  } finally {
    loading.value = false;
  }
}
const onVisible = () => { if (!document.hidden) load(); };
onMounted(() => {
  load();
  timer = setInterval(load, REFRESH_MS);
  document.addEventListener("visibilitychange", onVisible);
});
onBeforeUnmount(() => {
  clearInterval(timer);
  document.removeEventListener("visibilitychange", onVisible);
});

// ───────── formats ─────────
const isRtl = computed(() => locale.value !== "en");
const intlLocale = computed(() => (locale.value === "en" ? "en-GB" : "ar-JO-u-nu-latn"));
const num = (value) => new Intl.NumberFormat(intlLocale.value).format(Number(value ?? 0));
const toDate = (value) => new Date(String(value).replace(" ", "T"));
const fmt = (value, options) => (value ? new Intl.DateTimeFormat(intlLocale.value, options).format(toDate(value)) : "");
const todayText = computed(() => fmt(data.value?.now ?? new Date().toISOString(), { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
const updatedText = computed(() => fmt(data.value?.now, { hour: "numeric", minute: "2-digit" }));
// "30/10" written out: Intl adds direction marks that the chart's canvas draws in the wrong order.
const dayShort = (value) => `${Number(value.slice(8, 10))}/${Number(value.slice(5, 7))}`;
const dateText = (value) => fmt(String(value).length === 10 ? `${value}T00:00:00` : value, { weekday: "short", day: "numeric", month: "short" });
const monthText = (value) => fmt(`${value}-01T00:00:00`, { month: "short" });
const ago = (value) => {
  const minutes = Math.round((toDate(data.value?.now ?? new Date()) - toDate(value)) / 60000);
  const rtf = new Intl.RelativeTimeFormat(intlLocale.value, { numeric: "auto" });
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, "minute");
  if (Math.abs(minutes) < 1440) return rtf.format(-Math.round(minutes / 60), "hour");
  return rtf.format(-Math.round(minutes / 1440), "day");
};
const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);
const evaluationName = (type) => getEvaluationTypeLabel(type, t, `#${type}`);
const userName = computed(() => auth.authUser?.name ?? "");

// A link only to the pages the user may open.
function link(to) {
  try {
    const route = router.resolve(to);
    return route.matched.length && route.matched.every(canVisit) ? to : null;
  } catch {
    return null;
  }
}

// ───────── parts ─────────
const sessions = computed(() => data.value?.sessions ?? null);
const finance = computed(() => data.value?.finance ?? null);
const children = computed(() => data.value?.children ?? null);
const programs = computed(() => data.value?.programs ?? null);
const evaluations = computed(() => data.value?.evaluations ?? null);
const consultations = computed(() => data.value?.consultations ?? null);

const kpis = computed(() => {
  const d = data.value;
  if (!d) return [];
  const list = [];
  if (d.sessions) {
    const today = d.sessions.today;
    const done = (today.by_status.ongoing ?? 0) + (today.by_status.finished ?? 0);
    list.push({ key: "sessions_today", icon: "pi pi-calendar-clock", tone: "teal", value: num(today.total),
      sub: t("dash.kpi_sessions_today_sub", { done: num(done), left: num(today.by_status.closed ?? 0) }), progress: pct(done, today.total), to: { name: "sessions" } });
  }
  if (d.children) {
    list.push({ key: "children", icon: "pi pi-users", tone: "magenta", value: num(d.children.active),
      sub: t("dash.kpi_children_sub", { total: num(d.children.total), new: num(d.children.new_month) }), progress: pct(d.children.active, d.children.total), to: { name: "Children" } });
  }
  if (d.programs) {
    const running = Object.values(d.programs.by_kind ?? {}).reduce((sum, n) => sum + Number(n), 0);
    list.push({ key: "programs", icon: "pi pi-book", tone: "violet", value: num(running), sub: t("dash.kpi_programs_sub", { starting: num(d.programs.starting_soon) }),
      to: { name: "student-programe" } });
  }
  if (d.evaluations) {
    list.push({ key: "approvals", icon: "pi pi-verified", tone: "amber", value: num(d.evaluations.pending_approval),
      sub: t("dash.kpi_approvals_sub", { month: num(d.evaluations.month) }), to: { name: "evaluation-approvals" }, alert: d.evaluations.pending_approval > 0 });
    list.push({ key: "requests", icon: "pi pi-clipboard", tone: "blue", value: num(d.evaluations.requests.awaiting + d.evaluations.requests.in_progress),
      sub: t("dash.kpi_requests_sub", { overdue: num(d.evaluations.requests.overdue), unpaid: num(d.evaluations.requests.unpaid) }), to: { name: "required-evaluations" },
      alert: d.evaluations.requests.overdue > 0 });
  }
  if (d.finance) {
    list.push({ key: "received", icon: "pi pi-wallet", tone: "green", value: amount(d.finance.received_month),
      sub: t("dash.kpi_received_sub", { today: amount(d.finance.received_today) }), to: { name: "accounting-payments" } });
    list.push({ key: "remaining", icon: "pi pi-chart-bar", tone: "teal", value: amount(d.finance.remaining),
      sub: t("dash.kpi_remaining_sub", { due: amount(d.finance.due_month) }), to: { name: "accounting" } });
    list.push({ key: "late", icon: "pi pi-exclamation-triangle", tone: "red", value: amount(d.finance.late),
      sub: t("dash.kpi_late_sub", { children: num(d.finance.late_children) }), to: { name: "accounting-programs", query: { status: "late" } }, alert: d.finance.late > 0 });
  }
  return list.slice(0, 8).map((item) => ({ ...item, to: link(item.to) }));
});

const ATTENTION = {
  evaluation_approvals: { icon: "pi pi-verified", tone: "amber", to: { name: "evaluation-approvals" } },
  tracking_approvals: { icon: "pi pi-check-square", tone: "amber", to: { name: "tracking-approvals" } },
  goal_generalizations: { icon: "pi pi-share-alt", tone: "violet", to: { name: "goal-generalizations" } },
  evaluation_requests: { icon: "pi pi-clipboard", tone: "blue", to: { name: "required-evaluations" } },
  evaluation_requests_overdue: { icon: "pi pi-history", tone: "red", to: { name: "required-evaluations" } },
  bookings_waiting: { icon: "pi pi-comments", tone: "blue", to: { name: "ShowBooking" } },
  late_payments: { icon: "pi pi-exclamation-triangle", tone: "red", to: { name: "accounting-programs", query: { status: "late" } } },
  tentative_programs: { icon: "pi pi-hourglass", tone: "amber", to: { name: "accounting-programs", query: { status: "tentative" } } },
  unconfirmed_programs: { icon: "pi pi-ban", tone: "slate", to: { name: "accounting-programs", query: { status: "unconfirmed" } } },
  price_changes: { icon: "pi pi-tag", tone: "amber", to: { name: "accounting-programs", query: { status: "price_change" } } },
  pending_credits: { icon: "pi pi-replay", tone: "amber", to: { name: "accounting-credits" } },
  locked_evaluations: { icon: "pi pi-lock", tone: "amber", to: { name: "accounting-evaluations" } },
  locked_consultations: { icon: "pi pi-lock", tone: "amber", to: { name: "accounting-evaluations", query: { tab: "consultations" } } },
  leaves_pending: { icon: "pi pi-calendar-minus", tone: "violet", to: { name: "leaves" } },
};
// Only what has something waiting, the late and overdue first.
const attention = computed(() => (data.value?.attention ?? []).filter((item) => item.count > 0)
  .map((item) => ({ ...item, ...(ATTENTION[item.key] ?? { icon: "pi pi-circle", tone: "slate" }), to: link(ATTENTION[item.key]?.to ?? null) }))
  .sort((a, b) => (b.tone === "red") - (a.tone === "red") || b.count - a.count));
const attentionOpen = computed(() => attention.value.length);

const statusTone = { closed: "slate", waiting: "blue", late: "amber", ongoing: "green", finished: "teal", missed: "red", compensated: "violet", rescheduled: "violet" };
const weekProgress = computed(() => {
  const week = sessions.value?.week;
  return week ? pct(week.done, week.total - week.moved) : 0;
});
const maxTherapist = computed(() => Math.max(1, ...(sessions.value?.therapists ?? []).map((row) => row.sessions)));

// ───────── charts ─────────
const font = { family: "Cairo, 'Segoe UI', Tahoma, sans-serif", size: 12 };
const baseOptions = (extra = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { left: 12, right: 12 } },
  animation: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? false : { duration: 600 },
  plugins: {
    legend: { position: "bottom", rtl: isRtl.value, labels: { usePointStyle: true, pointStyle: "rectRounded", boxWidth: 10, padding: 14, font, color: "#475569" } },
    tooltip: { rtl: isRtl.value, textDirection: isRtl.value ? "rtl" : "ltr", backgroundColor: "#0f2f33", padding: 10, cornerRadius: 8, titleFont: font, bodyFont: font },
  },
  ...extra,
});
const axes = (stacked = false, money = false) => ({
  x: { stacked, reverse: isRtl.value, grid: { display: false }, ticks: { font, color: "#64748b" } },
  y: { stacked, beginAtZero: true, grid: { color: "#eef2f4" }, border: { display: false },
    ticks: { font, color: "#94a3b8", precision: 0, callback: (value) => (money && value >= 1000 ? `${value / 1000}k` : value) } },
});

const sessionsChart = computed(() => {
  const days = sessions.value?.days ?? [];
  const series = [["done", COLORS.teal], ["missed", COLORS.red], ["moved", COLORS.violet], ["ahead", "#b7d7d9"]];
  return {
    data: { labels: days.map((day) => (day.date === data.value?.now?.slice(0, 10) ? `● ${dayShort(day.date)}` : dayShort(day.date))),
      datasets: series.map(([key, color]) => ({ label: t(`dash.st_${key}`), data: days.map((day) => day[key]), backgroundColor: color, borderRadius: 4, maxBarThickness: 22 })) },
    options: baseOptions({ scales: axes(true) }),
    empty: !days.some((day) => day.done + day.missed + day.moved + day.ahead),
  };
});

const financeChart = computed(() => {
  const months = finance.value?.months ?? [];
  return {
    data: { labels: months.map((row) => monthText(row.month)),
      datasets: [
        { type: "bar", label: t("dash.received"), data: months.map((row) => row.received), backgroundColor: COLORS.teal, borderRadius: 6, maxBarThickness: 28, order: 2 },
        { type: "line", label: t("dash.expected"), data: months.map((row) => row.expected), borderColor: COLORS.magenta, backgroundColor: COLORS.magenta,
          borderDash: [6, 4], tension: 0.35, pointRadius: 4, order: 1 },
      ] },
    options: baseOptions({ scales: axes(false, true),
      plugins: { ...baseOptions().plugins, tooltip: { ...baseOptions().plugins.tooltip, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${amount(ctx.parsed.y)}` } } } }),
    empty: !months.some((row) => row.received || row.expected),
  };
});

const familiesChart = computed(() => {
  const kids = children.value?.months ?? [];
  const parents = data.value?.parents?.months ?? [];
  const datasets = [{ label: t("dash.new_children"), data: kids.map((row) => row.n), borderColor: COLORS.magenta, backgroundColor: "rgba(178,21,83,0.12)", fill: true, tension: 0.35, pointRadius: 3 }];
  if (parents.length) datasets.push({ label: t("dash.new_parents"), data: parents.map((row) => row.n), borderColor: COLORS.teal, backgroundColor: "rgba(19,92,101,0.08)", fill: true, tension: 0.35, pointRadius: 3 });
  return { data: { labels: kids.map((row) => monthText(row.month)), datasets }, options: baseOptions({ scales: axes() }), empty: !kids.some((row) => row.n) && !parents.some((row) => row.n) };
});

const doughnut = (labels, values, colors) => ({
  data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 2, borderColor: "#fff", hoverOffset: 6 }] },
  options: baseOptions({ cutout: "68%", plugins: { ...baseOptions().plugins, legend: { ...baseOptions().plugins.legend, position: "bottom" } } }),
  empty: !values.some(Boolean),
  total: values.reduce((sum, n) => sum + Number(n), 0),
});
const genderChart = computed(() => {
  const g = children.value?.by_gender ?? {};
  return doughnut([t("male"), t("female")], [Number(g[0] ?? g["0"] ?? 0), Number(g[1] ?? g["1"] ?? 0)], [COLORS.teal, COLORS.magenta]);
});
const programKindChart = computed(() => {
  const kinds = ["day", "clinics", "inclusion"];
  return doughnut(kinds.map((kind) => t(`pp.kind_${kind}`)), kinds.map((kind) => Number(programs.value?.by_kind?.[kind] ?? 0)), [COLORS.teal, COLORS.magenta, COLORS.sand]);
});
const evalTypeChart = computed(() => {
  const types = Object.entries(evaluations.value?.by_type ?? {}).sort((a, b) => b[1] - a[1]);
  return {
    data: { labels: types.map(([type]) => evaluationName(type)),
      datasets: [{ label: t("dash.evaluations"), data: types.map(([, n]) => n), backgroundColor: [COLORS.teal, COLORS.magenta, COLORS.amber, COLORS.violet, COLORS.blue, COLORS.tealSoft, COLORS.sand, COLORS.cyan], borderRadius: 6, maxBarThickness: 18 }] },
    options: baseOptions({ indexAxis: "y", plugins: { ...baseOptions().plugins, legend: { display: false } },
      scales: { x: { beginAtZero: true, reverse: isRtl.value, grid: { color: "#eef2f4" }, ticks: { font, precision: 0, color: "#94a3b8" } },
        y: { position: isRtl.value ? "right" : "left", grid: { display: false }, ticks: { font, color: "#475569" } } } }),
    empty: !types.length,
  };
});

const ages = computed(() => {
  const bands = children.value?.ages ?? {};
  const keys = ["0_3", "3_6", "6_12", "12_up", "unknown"].filter((key) => key !== "unknown" || bands.unknown);
  const max = Math.max(1, ...keys.map((key) => bands[key] ?? 0));
  return keys.map((key) => ({ key, n: bands[key] ?? 0, width: pct(bands[key] ?? 0, max) }));
});
const programStatus = computed(() => {
  const states = programs.value?.by_status ?? {};
  const total = Object.values(states).reduce((sum, n) => sum + Number(n), 0);
  return ["confirmed", "tentative", "unconfirmed", "stopped"].map((key) => ({ key, n: Number(states[key] ?? 0), width: pct(states[key] ?? 0, total),
    tone: { confirmed: "green", tentative: "amber", unconfirmed: "red", stopped: "slate" }[key] }));
});
const riskRows = (byRisk) => ["low", "medium", "high"].map((key) => ({ key, n: Number(byRisk?.[key] ?? 0), tone: { low: "green", medium: "amber", high: "red" }[key] }));
const methods = computed(() => {
  const rows = finance.value?.methods ?? [];
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  return rows.map((row) => ({ ...row, width: pct(row.total, total) }));
});
const maxRole = computed(() => Math.max(1, ...(data.value?.staff?.by_role ?? []).map((row) => row.n)));
const maxRoom = computed(() => Math.max(1, ...(data.value?.rooms?.today ?? []).map((row) => row.n)));

// ───────── activity ─────────
const ACTIVITY_ICON = { payment: ["pi pi-wallet", "green"], session: ["pi pi-calendar", "teal"], program: ["pi pi-book", "violet"], evaluation: ["pi pi-verified", "amber"] };
function activityText(item) {
  switch (item.kind) {
    case "payment": return t("dash.act_payment", { amount: amount(item.amount), method: t(`acc.methods.${item.method}`), ref: item.ref });
    case "session": return t("dash.act_session", { action: t(`session_log_action_${item.action}`) });
    case "program": return t("dash.act_program");
    case "evaluation": return t(`dash.act_evaluation_${item.status}`, { type: evaluationName(item.type) });
    default: return "";
  }
}
const activityLink = (item) => {
  if (item.kind === "payment") return link({ name: "accounting-receipt", params: { id: item.id } });
  return item.child_id ? link({ name: "ShowChildren", params: { id: item.child_id } }) : null;
};
const childLink = (id) => (id ? link({ name: "ShowChildren", params: { id } }) : null);

const totals = computed(() => {
  const all = data.value?.totals ?? {};
  return [
    ["children", "pi pi-users"], ["parents", "pi pi-user"], ["student_programs", "pi pi-book"], ["users", "pi pi-id-card"], ["employees", "pi pi-briefcase"],
    ["rooms", "pi pi-home"], ["treatments", "pi pi-heart"], ["programs", "pi pi-list"], ["departments", "pi pi-th-large"], ["vehicles", "pi pi-car"], ["events", "pi pi-star"],
  ].map(([key, icon]) => ({ key, icon, n: all[key] ?? 0 }));
});
const upcoming = computed(() => data.value?.upcoming ?? {});
const hasUpcoming = computed(() => (upcoming.value.holidays?.length || upcoming.value.events?.length || upcoming.value.programs_starting?.length) > 0);
</script>

<template>
  <div class="dsh" :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- Head -->
    <header class="dsh-hero">
      <div class="dsh-hero__text">
        <p class="dsh-kicker"><i class="pi pi-chart-line" aria-hidden="true" /> {{ $t("dash.kicker") }}</p>
        <h1 class="dsh-title">{{ $t("dash.title") }}</h1>
        <p class="dsh-sub">{{ todayText }}<template v-if="userName"> · {{ userName }}</template></p>
      </div>
      <div class="dsh-hero__actions">
        <span v-if="data" class="dsh-live" :title="$t('dash.auto')"><span class="dsh-live__dot" aria-hidden="true" />{{ $t("dash.updated", { time: updatedText }) }}</span>
        <button type="button" class="dsh-btn" :disabled="loading" @click="load">
          <i class="pi pi-refresh" :class="{ 'pi-spin': loading }" aria-hidden="true" /> {{ $t("dash.refresh") }}
        </button>
      </div>
    </header>

    <div v-if="upcoming.holiday_today" class="dsh-banner" role="status">
      <i class="pi pi-sun" aria-hidden="true" /> {{ $t("dash.holiday_today", { title: upcoming.holiday_today.title }) }}
    </div>

    <!-- Loading / failure -->
    <div v-if="!data && !failed" class="dsh-grid dsh-grid--kpi">
      <div v-for="n in 8" :key="n" class="dsh-skel" style="height: 118px" />
    </div>
    <div v-else-if="failed" class="dsh-card dsh-empty-state">
      <i class="pi pi-wifi" aria-hidden="true" />
      <p>{{ $t("dash.load_failed") }}</p>
      <button type="button" class="dsh-btn dsh-btn--solid" @click="load">{{ $t("dash.retry") }}</button>
    </div>

    <template v-else>
      <!-- KPIs -->
      <section class="dsh-grid dsh-grid--kpi">
        <component :is="kpi.to ? 'router-link' : 'div'" v-for="(kpi, index) in kpis" :key="kpi.key" :to="kpi.to ?? undefined"
          class="dsh-kpi dsh-in" :class="[`tone-${kpi.tone}`, { 'is-link': kpi.to, 'is-alert': kpi.alert }]" :style="{ '--i': index }">
          <div class="dsh-kpi__top">
            <span class="dsh-kpi__icon"><i :class="kpi.icon" aria-hidden="true" /></span>
            <span class="dsh-kpi__label">{{ $t(`dash.kpi_${kpi.key}`) }}</span>
          </div>
          <div class="dsh-kpi__value dsh-num">{{ kpi.value }}</div>
          <div class="dsh-kpi__sub">{{ kpi.sub }}</div>
          <div v-if="kpi.progress !== undefined" class="dsh-bar" aria-hidden="true"><span :style="{ width: `${kpi.progress}%` }" /></div>
        </component>
      </section>

      <!-- Today + attention -->
      <section class="dsh-grid dsh-grid--main">
        <article v-if="sessions" class="dsh-card dsh-in" :style="{ '--i': 2 }">
          <header class="dsh-card__head">
            <h2><i class="pi pi-clock" aria-hidden="true" /> {{ $t("dash.today") }}</h2>
            <router-link v-if="link({ name: 'staff-schedules' })" :to="{ name: 'staff-schedules' }" class="dsh-more">{{ $t("dash.view_all") }} <i class="pi pi-angle-left dsh-flip" aria-hidden="true" /></router-link>
          </header>
          <div class="dsh-status-strip">
            <span v-for="(n, status) in sessions.today.by_status" :key="status" class="dsh-chip" :class="`tone-${statusTone[status] ?? 'slate'}`">
              {{ $t(`dash.status_${status}`) }} <b class="dsh-num">{{ num(n) }}</b>
            </span>
          </div>
          <div class="dsh-split">
            <div>
              <h3 class="dsh-h3"><span class="dsh-pulse" aria-hidden="true" /> {{ $t("dash.now_running") }}</h3>
              <ul v-if="sessions.today.now.length" class="dsh-list">
                <li v-for="row in sessions.today.now" :key="row.id" class="dsh-row">
                  <span class="dsh-time dsh-num" dir="ltr">{{ row.start }}</span>
                  <div class="dsh-row__body">
                    <component :is="childLink(row.child_id) ? 'router-link' : 'span'" :to="childLink(row.child_id) ?? undefined" class="dsh-row__title">{{ row.child }}</component>
                    <span class="dsh-row__meta">{{ [row.treatment, row.therapist, row.room].filter(Boolean).join(" · ") }}</span>
                  </div>
                  <span class="dsh-chip" :class="`tone-${statusTone[row.status]}`">{{ $t(`dash.status_${row.status}`) }}</span>
                </li>
              </ul>
              <p v-else class="dsh-muted">{{ $t("dash.no_sessions_now") }}</p>
            </div>
            <div>
              <h3 class="dsh-h3"><i class="pi pi-forward" aria-hidden="true" /> {{ $t("dash.coming_today") }}</h3>
              <ul v-if="sessions.today.next.length" class="dsh-list">
                <li v-for="row in sessions.today.next" :key="row.id" class="dsh-row">
                  <span class="dsh-time dsh-num" dir="ltr">{{ row.start }}</span>
                  <div class="dsh-row__body">
                    <component :is="childLink(row.child_id) ? 'router-link' : 'span'" :to="childLink(row.child_id) ?? undefined" class="dsh-row__title">{{ row.child }}</component>
                    <span class="dsh-row__meta">{{ [row.treatment, row.therapist, row.room].filter(Boolean).join(" · ") }}</span>
                  </div>
                </li>
              </ul>
              <p v-else class="dsh-muted">{{ $t("dash.no_sessions_next") }}</p>
            </div>
          </div>
          <div v-if="evaluations?.requests.today.length || consultations?.today.length" class="dsh-split dsh-split--top">
            <div v-if="evaluations?.requests.today.length">
              <h3 class="dsh-h3"><i class="pi pi-clipboard" aria-hidden="true" /> {{ $t("dash.evaluations_today") }}</h3>
              <ul class="dsh-list">
                <li v-for="row in evaluations.requests.today" :key="row.id" class="dsh-row">
                  <span class="dsh-time dsh-num" dir="ltr">{{ row.time ?? "—" }}</span>
                  <div class="dsh-row__body">
                    <component :is="childLink(row.child_id) ? 'router-link' : 'span'" :to="childLink(row.child_id) ?? undefined" class="dsh-row__title">{{ row.child }}</component>
                    <span class="dsh-row__meta">{{ [evaluationName(row.type), row.specialist].filter(Boolean).join(" · ") }}</span>
                  </div>
                  <span v-if="row.billing === 'locked'" class="dsh-chip tone-amber"><i class="pi pi-lock" aria-hidden="true" /> {{ $t("dash.req_unpaid") }}</span>
                </li>
              </ul>
            </div>
            <div v-if="consultations?.today.length">
              <h3 class="dsh-h3"><i class="pi pi-comments" aria-hidden="true" /> {{ $t("dash.consultations_today") }}</h3>
              <ul class="dsh-list">
                <li v-for="row in consultations.today" :key="row.id" class="dsh-row">
                  <span class="dsh-time dsh-num" dir="ltr">{{ row.time }}</span>
                  <div class="dsh-row__body">
                    <component :is="childLink(row.child_id) ? 'router-link' : 'span'" :to="childLink(row.child_id) ?? undefined" class="dsh-row__title">{{ row.child }}</component>
                    <span class="dsh-row__meta">{{ row.doctor }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </article>

        <article class="dsh-card dsh-in" :style="{ '--i': 3 }">
          <header class="dsh-card__head">
            <h2><i class="pi pi-inbox" aria-hidden="true" /> {{ $t("dash.attention") }}</h2>
            <span v-if="attentionOpen" class="dsh-count">{{ attentionOpen }}</span>
          </header>
          <p class="dsh-muted dsh-hint">{{ $t("dash.attention_hint") }}</p>
          <ul v-if="attention.length" class="dsh-attn">
            <li v-for="item in attention" :key="item.key">
              <component :is="item.to ? 'router-link' : 'div'" :to="item.to ?? undefined" class="dsh-attn__item" :class="[`tone-${item.tone}`, { 'is-zero': !item.count, 'is-link': item.to }]">
                <span class="dsh-attn__icon"><i :class="item.icon" aria-hidden="true" /></span>
                <span class="dsh-attn__label">{{ $t(`dash.att_${item.key}`) }}<small v-if="item.extra" class="dsh-num">{{ amount(item.extra) }}</small></span>
                <span class="dsh-attn__n dsh-num">{{ num(item.count) }}</span>
              </component>
            </li>
          </ul>
          <p v-if="!attentionOpen" class="dsh-ok"><i class="pi pi-check-circle" aria-hidden="true" /> {{ $t("dash.attention_clear") }}</p>
        </article>
      </section>

      <!-- Sessions trend + week -->
      <section v-if="sessions" class="dsh-grid dsh-grid--main">
        <article class="dsh-card dsh-in" :style="{ '--i': 4 }">
          <header class="dsh-card__head"><h2><i class="pi pi-chart-bar" aria-hidden="true" /> {{ $t("dash.sessions_14") }}</h2></header>
          <div class="dsh-chart">
            <Chart v-if="!sessionsChart.empty" type="bar" :data="sessionsChart.data" :options="sessionsChart.options" class="h-full" />
            <p v-else class="dsh-chart-empty"><i class="pi pi-chart-bar" aria-hidden="true" /> {{ $t("dash.empty_chart") }}</p>
          </div>
        </article>
        <article class="dsh-card dsh-in" :style="{ '--i': 5 }">
          <header class="dsh-card__head"><h2><i class="pi pi-calendar" aria-hidden="true" /> {{ $t("dash.week") }}</h2></header>
          <div class="dsh-ring-row">
            <div class="dsh-ring" :style="{ '--p': weekProgress }" role="img" :aria-label="$t('dash.week_progress', { done: sessions.week.done, total: sessions.week.total })">
              <span class="dsh-num">{{ weekProgress }}%</span>
            </div>
            <div class="dsh-ring-legend">
              <p class="dsh-strong">{{ $t("dash.week_progress", { done: num(sessions.week.done), total: num(sessions.week.total) }) }}</p>
              <p v-for="key in ['missed', 'moved', 'ahead']" :key="key" class="dsh-legend-line">
                <span class="dsh-dot" :class="`tone-${{ missed: 'red', moved: 'violet', ahead: 'slate' }[key]}`" /> {{ $t(`dash.st_${key}`) }} <b class="dsh-num">{{ num(sessions.week[key]) }}</b>
              </p>
            </div>
          </div>
          <h3 class="dsh-h3">{{ $t("dash.top_therapists") }}</h3>
          <ul v-if="sessions.therapists.length" class="dsh-bars">
            <li v-for="row in sessions.therapists" :key="row.name">
              <div class="dsh-bars__label"><span>{{ row.name }}</span><span class="dsh-num">{{ num(row.done) }} / {{ num(row.sessions) }}</span></div>
              <div class="dsh-bars__track"><span class="tone-bg-teal" :style="{ width: `${(row.sessions / maxTherapist) * 100}%` }"><span class="dsh-bars__done" :style="{ width: `${pct(row.done, row.sessions)}%` }" /></span></div>
            </li>
          </ul>
          <p v-else class="dsh-muted">{{ $t("dash.empty_chart") }}</p>
        </article>
      </section>

      <!-- Money -->
      <section v-if="finance" class="dsh-grid dsh-grid--main">
        <article class="dsh-card dsh-in" :style="{ '--i': 6 }">
          <header class="dsh-card__head">
            <h2><i class="pi pi-wallet" aria-hidden="true" /> {{ $t("dash.finance_months") }}</h2>
            <router-link v-if="link({ name: 'accounting' })" :to="{ name: 'accounting' }" class="dsh-more">{{ $t("dash.view_all") }} <i class="pi pi-angle-left dsh-flip" aria-hidden="true" /></router-link>
          </header>
          <div class="dsh-mini-stats">
            <div><span>{{ $t("acc.received_today") }}</span><b class="dsh-num">{{ amount(finance.received_today) }}</b></div>
            <div><span>{{ $t("acc.due_month") }}</span><b class="dsh-num">{{ amount(finance.due_month) }}</b></div>
            <div><span>{{ $t("dash.payments_month", { n: "" }).trim() }}</span><b class="dsh-num">{{ num(finance.payments_month) }}</b></div>
            <div><span>{{ $t("dash.open_charges", { n: "" }).trim() }}</span><b class="dsh-num">{{ num(finance.open_charges) }}</b></div>
          </div>
          <div class="dsh-chart">
            <Chart v-if="!financeChart.empty" type="bar" :data="financeChart.data" :options="financeChart.options" class="h-full" />
            <p v-else class="dsh-chart-empty"><i class="pi pi-wallet" aria-hidden="true" /> {{ $t("dash.empty_chart") }}</p>
          </div>
        </article>
        <article class="dsh-card dsh-in" :style="{ '--i': 7 }">
          <header class="dsh-card__head"><h2><i class="pi pi-credit-card" aria-hidden="true" /> {{ $t("dash.methods") }}</h2></header>
          <ul v-if="methods.length" class="dsh-bars">
            <li v-for="row in methods" :key="row.method">
              <div class="dsh-bars__label"><span>{{ $t(`acc.methods.${row.method}`) }} <small class="dsh-muted">({{ num(row.n) }})</small></span><span class="dsh-num">{{ amount(row.total) }}</span></div>
              <div class="dsh-bars__track"><span class="tone-bg-green" :style="{ width: `${row.width}%` }" /></div>
            </li>
          </ul>
          <p v-else class="dsh-muted">{{ $t("dash.empty_chart") }}</p>
          <h3 class="dsh-h3 dsh-h3--gap"><i class="pi pi-exclamation-triangle" aria-hidden="true" /> {{ $t("dash.late_list") }}</h3>
          <ul v-if="finance.late_list.length" class="dsh-list">
            <li v-for="row in finance.late_list" :key="row.id" class="dsh-row">
              <div class="dsh-row__body">
                <component :is="link({ name: 'accounting-statement', params: { child: row.child_id } }) ? 'router-link' : 'span'"
                  :to="link({ name: 'accounting-statement', params: { child: row.child_id } }) ?? undefined" class="dsh-row__title">{{ row.child }}</component>
                <span class="dsh-row__meta">{{ $t("dash.late_days", { n: num(row.days) }) }} · {{ dateText(row.due_date) }}</span>
              </div>
              <b class="dsh-num dsh-red">{{ amount(row.amount) }}</b>
            </li>
          </ul>
          <p v-else class="dsh-ok"><i class="pi pi-check-circle" aria-hidden="true" /> {{ $t("dash.no_late") }}</p>
        </article>
      </section>

      <!-- Evaluations & consultations -->
      <section v-if="evaluations || consultations" class="dsh-grid dsh-grid--three">
        <article v-if="evaluations" class="dsh-card dsh-in" :style="{ '--i': 8 }">
          <header class="dsh-card__head"><h2><i class="pi pi-clipboard" aria-hidden="true" /> {{ $t("dash.eval_by_type") }}</h2></header>
          <p class="dsh-muted dsh-hint">{{ $t("dash.approved_month", { n: num(evaluations.approved_month) }) }} · {{ $t("dash.rejected", { n: num(evaluations.rejected) }) }}</p>
          <div class="dsh-chart dsh-chart--sm">
            <Chart v-if="!evalTypeChart.empty" type="bar" :data="evalTypeChart.data" :options="evalTypeChart.options" class="h-full" />
            <p v-else class="dsh-chart-empty">{{ $t("dash.empty_chart") }}</p>
          </div>
        </article>
        <article v-if="evaluations" class="dsh-card dsh-in" :style="{ '--i': 9 }">
          <header class="dsh-card__head"><h2><i class="pi pi-list-check" aria-hidden="true" /> {{ $t("dash.eval_requests") }}</h2></header>
          <div class="dsh-tiles">
            <div class="dsh-tile tone-blue"><b class="dsh-num">{{ num(evaluations.requests.awaiting) }}</b><span>{{ $t("dash.req_awaiting") }}</span></div>
            <div class="dsh-tile tone-teal"><b class="dsh-num">{{ num(evaluations.requests.in_progress) }}</b><span>{{ $t("dash.req_in_progress") }}</span></div>
            <div class="dsh-tile tone-red"><b class="dsh-num">{{ num(evaluations.requests.overdue) }}</b><span>{{ $t("dash.req_overdue") }}</span></div>
            <div class="dsh-tile tone-amber"><b class="dsh-num">{{ num(evaluations.requests.unpaid) }}</b><span>{{ $t("dash.req_unpaid") }}</span></div>
          </div>
          <h3 class="dsh-h3 dsh-h3--gap">{{ $t("dash.mchat") }}</h3>
          <div class="dsh-risk">
            <div v-for="group in [['mchat_staff', evaluations.mchat.by_risk, evaluations.mchat.month], ['mchat_parents', evaluations.mchat.parent_by_risk, evaluations.mchat.parent_month]]" :key="group[0]">
              <div class="dsh-bars__label"><span>{{ $t(`dash.${group[0]}`) }}</span><b class="dsh-num">{{ num(group[2]) }}</b></div>
              <div class="dsh-stack" role="img" :aria-label="riskRows(group[1]).map((row) => `${$t(`dash.risk_${row.key}`)} ${row.n}`).join('، ')">
                <span v-for="row in riskRows(group[1])" v-show="row.n" :key="row.key" :class="`tone-bg-${row.tone}`" :style="{ flex: row.n }" :title="`${$t(`dash.risk_${row.key}`)}: ${row.n}`">{{ row.n }}</span>
                <span v-if="!group[2]" class="dsh-stack__empty" />
              </div>
            </div>
            <p class="dsh-legend-line dsh-legend-line--row">
              <span v-for="key in ['low', 'medium', 'high']" :key="key"><span class="dsh-dot" :class="`tone-${{ low: 'green', medium: 'amber', high: 'red' }[key]}`" /> {{ $t(`dash.risk_${key}`) }}</span>
            </p>
          </div>
        </article>
        <article v-if="consultations" class="dsh-card dsh-in" :style="{ '--i': 10 }">
          <header class="dsh-card__head">
            <h2><i class="pi pi-comments" aria-hidden="true" /> {{ $t("dash.consultations") }}</h2>
            <router-link v-if="link({ name: 'ShowBooking' })" :to="{ name: 'ShowBooking' }" class="dsh-more">{{ $t("dash.view_all") }} <i class="pi pi-angle-left dsh-flip" aria-hidden="true" /></router-link>
          </header>
          <div class="dsh-tiles">
            <div class="dsh-tile tone-amber"><b class="dsh-num">{{ num(consultations.waiting) }}</b><span>{{ $t("dash.cons_waiting") }}</span></div>
            <div class="dsh-tile tone-blue"><b class="dsh-num">{{ num(consultations.upcoming) }}</b><span>{{ $t("dash.cons_upcoming") }}</span></div>
            <div class="dsh-tile tone-teal"><b class="dsh-num">{{ num(consultations.month) }}</b><span>{{ $t("dash.cons_month") }}</span></div>
            <div class="dsh-tile tone-red"><b class="dsh-num">{{ num(consultations.unpaid) }}</b><span>{{ $t("dash.cons_unpaid") }}</span></div>
          </div>
        </article>
      </section>

      <!-- Children & families -->
      <section v-if="children" class="dsh-grid dsh-grid--four">
        <article class="dsh-card dsh-span-2 dsh-in" :style="{ '--i': 11 }">
          <header class="dsh-card__head">
            <h2><i class="pi pi-users" aria-hidden="true" /> {{ $t("dash.children_months") }}</h2>
            <span v-if="data.parents" class="dsh-muted">{{ $t("dash.parents_verified", { n: num(data.parents.verified) }) }}</span>
          </header>
          <div class="dsh-chart dsh-chart--sm">
            <Chart v-if="!familiesChart.empty" type="line" :data="familiesChart.data" :options="familiesChart.options" class="h-full" />
            <p v-else class="dsh-chart-empty">{{ $t("dash.empty_chart") }}</p>
          </div>
        </article>
        <article class="dsh-card dsh-in" :style="{ '--i': 12 }">
          <header class="dsh-card__head"><h2><i class="pi pi-user" aria-hidden="true" /> {{ $t("dash.gender") }}</h2></header>
          <div class="dsh-donut">
            <Chart v-if="!genderChart.empty" type="doughnut" :data="genderChart.data" :options="genderChart.options" class="h-full" />
            <p v-else class="dsh-chart-empty">{{ $t("dash.empty_chart") }}</p>
            <span v-if="!genderChart.empty" class="dsh-donut__center dsh-num">{{ num(genderChart.total) }}</span>
          </div>
        </article>
        <article class="dsh-card dsh-in" :style="{ '--i': 13 }">
          <header class="dsh-card__head"><h2><i class="pi pi-calendar-plus" aria-hidden="true" /> {{ $t("dash.ages") }}</h2></header>
          <ul class="dsh-bars">
            <li v-for="row in ages" :key="row.key">
              <div class="dsh-bars__label"><span>{{ $t(`dash.age_${row.key}`) }}</span><span class="dsh-num">{{ num(row.n) }}</span></div>
              <div class="dsh-bars__track"><span class="tone-bg-magenta" :style="{ width: `${row.width}%` }" /></div>
            </li>
          </ul>
          <template v-if="children.by_treatment.length">
            <h3 class="dsh-h3 dsh-h3--gap">{{ $t("dash.by_treatment") }}</h3>
            <p v-for="row in children.by_treatment" :key="row.name" class="dsh-legend-line">{{ row.name }} <b class="dsh-num">{{ num(row.n) }}</b></p>
          </template>
        </article>
        <article v-if="programs" class="dsh-card dsh-in" :style="{ '--i': 14 }">
          <header class="dsh-card__head"><h2><i class="pi pi-book" aria-hidden="true" /> {{ $t("dash.programs_kind") }}</h2></header>
          <div class="dsh-donut">
            <Chart v-if="!programKindChart.empty" type="doughnut" :data="programKindChart.data" :options="programKindChart.options" class="h-full" />
            <p v-else class="dsh-chart-empty">{{ $t("dash.empty_chart") }}</p>
            <span v-if="!programKindChart.empty" class="dsh-donut__center dsh-num">{{ num(programKindChart.total) }}</span>
          </div>
        </article>
        <article v-if="programs" class="dsh-card dsh-in" :style="{ '--i': 15 }">
          <header class="dsh-card__head"><h2><i class="pi pi-flag" aria-hidden="true" /> {{ $t("dash.programs_status") }}</h2></header>
          <ul class="dsh-bars">
            <li v-for="row in programStatus" :key="row.key">
              <div class="dsh-bars__label"><span>{{ $t(`acc.program_status.${row.key}`) }}</span><span class="dsh-num">{{ num(row.n) }}</span></div>
              <div class="dsh-bars__track"><span :class="`tone-bg-${row.tone}`" :style="{ width: `${row.width}%` }" /></div>
            </li>
          </ul>
          <ul v-if="programs.tentative_expiring.length" class="dsh-list dsh-list--gap">
            <li v-for="row in programs.tentative_expiring" :key="row.id" class="dsh-row">
              <div class="dsh-row__body">
                <component :is="childLink(row.child_id) ? 'router-link' : 'span'" :to="childLink(row.child_id) ?? undefined" class="dsh-row__title">{{ row.child }}</component>
                <span class="dsh-row__meta">{{ $t(`pp.kind_${row.kind}`) }} · {{ dateText(row.until) }}</span>
              </div>
              <span class="dsh-chip tone-amber"><i class="pi pi-hourglass" aria-hidden="true" /></span>
            </li>
          </ul>
        </article>
      </section>

      <!-- Team, rooms, assistant -->
      <section v-if="data.staff || data.hr || data.rooms || data.ai" class="dsh-grid dsh-grid--three">
        <article v-if="data.staff || data.hr" class="dsh-card dsh-in" :style="{ '--i': 16 }">
          <header class="dsh-card__head"><h2><i class="pi pi-id-card" aria-hidden="true" /> {{ $t("dash.team") }}</h2></header>
          <div v-if="data.hr" class="dsh-tiles dsh-tiles--five">
            <div class="dsh-tile tone-green"><b class="dsh-num">{{ num(data.hr.present) }}</b><span>{{ $t("dash.present") }}</span></div>
            <div class="dsh-tile tone-teal"><b class="dsh-num">{{ num(data.hr.clocked_in) }}</b><span>{{ $t("dash.clocked_in") }}</span></div>
            <div class="dsh-tile tone-amber"><b class="dsh-num">{{ num(data.hr.late) }}</b><span>{{ $t("dash.late") }}</span></div>
            <div class="dsh-tile tone-red"><b class="dsh-num">{{ num(data.hr.absent) }}</b><span>{{ $t("dash.absent") }}</span></div>
            <div class="dsh-tile tone-violet"><b class="dsh-num">{{ num(data.hr.on_leave) }}</b><span>{{ $t("dash.on_leave") }}</span></div>
          </div>
          <p v-if="data.hr" class="dsh-muted dsh-hint">{{ $t("dash.attendance") }} — {{ $t("dash.of_employees", { n: num(data.hr.employees) }) }}</p>
          <template v-if="data.staff?.by_role.length">
            <h3 class="dsh-h3 dsh-h3--gap">{{ $t("dash.by_role") }}</h3>
            <ul class="dsh-bars">
              <li v-for="row in data.staff.by_role" :key="row.name">
                <div class="dsh-bars__label"><span>{{ row.name }}</span><span class="dsh-num">{{ num(row.n) }}</span></div>
                <div class="dsh-bars__track"><span class="tone-bg-violet" :style="{ width: `${(row.n / maxRole) * 100}%` }" /></div>
              </li>
            </ul>
          </template>
        </article>
        <article v-if="data.rooms" class="dsh-card dsh-in" :style="{ '--i': 17 }">
          <header class="dsh-card__head"><h2><i class="pi pi-home" aria-hidden="true" /> {{ $t("dash.rooms") }}</h2></header>
          <p class="dsh-strong">{{ $t("dash.rooms_in_use", { n: num(data.rooms.in_use), total: num(data.rooms.total) }) }}</p>
          <div class="dsh-bar dsh-bar--lg" aria-hidden="true"><span :style="{ width: `${pct(data.rooms.in_use, data.rooms.total)}%` }" /></div>
          <h3 class="dsh-h3 dsh-h3--gap">{{ $t("dash.rooms_today") }}</h3>
          <ul v-if="data.rooms.today.length" class="dsh-bars">
            <li v-for="row in data.rooms.today" :key="row.name">
              <div class="dsh-bars__label"><span>{{ row.name }}</span><span class="dsh-num">{{ $t("dash.sessions_n", { n: num(row.n) }) }}</span></div>
              <div class="dsh-bars__track"><span class="tone-bg-teal" :style="{ width: `${(row.n / maxRoom) * 100}%` }" /></div>
            </li>
          </ul>
          <p v-else class="dsh-muted">{{ $t("dash.no_rooms_today") }}</p>
        </article>
        <article v-if="data.ai" class="dsh-card dsh-in" :style="{ '--i': 18 }">
          <header class="dsh-card__head">
            <h2><i class="pi pi-sparkles" aria-hidden="true" /> {{ $t("dash.ai") }}</h2>
            <router-link v-if="link({ name: 'ai-assistant' })" :to="{ name: 'ai-assistant' }" class="dsh-more">{{ $t("dash.open") }} <i class="pi pi-angle-left dsh-flip" aria-hidden="true" /></router-link>
          </header>
          <div class="dsh-tiles dsh-tiles--three">
            <div class="dsh-tile tone-teal"><b class="dsh-num">{{ num(data.ai.conversations_month) }}</b><span>{{ $t("dash.ai_conversations") }}</span></div>
            <div class="dsh-tile tone-magenta"><b class="dsh-num">{{ num(data.ai.messages_month) }}</b><span>{{ $t("dash.ai_messages") }}</span></div>
            <div class="dsh-tile tone-sand"><b class="dsh-num" dir="ltr">${{ data.ai.cost_month.toFixed(2) }}</b><span>{{ $t("dash.ai_cost") }}</span></div>
          </div>
        </article>
      </section>

      <!-- Activity + upcoming -->
      <section class="dsh-grid dsh-grid--main">
        <article class="dsh-card dsh-in" :style="{ '--i': 19 }">
          <header class="dsh-card__head"><h2><i class="pi pi-history" aria-hidden="true" /> {{ $t("dash.activity") }}</h2></header>
          <ol v-if="data.activity.length" class="dsh-feed">
            <li v-for="item in data.activity" :key="`${item.kind}${item.id}`" class="dsh-feed__item">
              <span class="dsh-feed__icon" :class="`tone-${ACTIVITY_ICON[item.kind][1]}`"><i :class="ACTIVITY_ICON[item.kind][0]" aria-hidden="true" /></span>
              <div class="dsh-feed__body">
                <component :is="activityLink(item) ? 'router-link' : 'span'" :to="activityLink(item) ?? undefined" class="dsh-row__title">{{ activityText(item) }}</component>
                <span class="dsh-row__meta">{{ [item.child, item.user ? $t("dash.by", { name: item.user }) : null].filter(Boolean).join(" · ") }}</span>
              </div>
              <time class="dsh-feed__time" :datetime="item.at">{{ ago(item.at) }}</time>
            </li>
          </ol>
          <p v-else class="dsh-muted">{{ $t("dash.no_activity") }}</p>
        </article>
        <article class="dsh-card dsh-in" :style="{ '--i': 20 }">
          <header class="dsh-card__head"><h2><i class="pi pi-calendar-clock" aria-hidden="true" /> {{ $t("dash.upcoming") }}</h2></header>
          <template v-if="hasUpcoming">
            <template v-if="upcoming.programs_starting?.length">
              <h3 class="dsh-h3">{{ $t("dash.programs_starting") }}</h3>
              <ul class="dsh-list">
                <li v-for="row in upcoming.programs_starting" :key="row.id" class="dsh-row">
                  <span class="dsh-date"><b class="dsh-num">{{ fmt(`${row.date}T00:00:00`, { day: "numeric" }) }}</b>{{ fmt(`${row.date}T00:00:00`, { month: "short" }) }}</span>
                  <div class="dsh-row__body">
                    <component :is="childLink(row.child_id) ? 'router-link' : 'span'" :to="childLink(row.child_id) ?? undefined" class="dsh-row__title">{{ row.child }}</component>
                    <span class="dsh-row__meta">{{ $t(`pp.kind_${row.kind}`) }}</span>
                  </div>
                </li>
              </ul>
            </template>
            <template v-if="upcoming.holidays?.length">
              <h3 class="dsh-h3 dsh-h3--gap">{{ $t("dash.holidays") }}</h3>
              <ul class="dsh-list">
                <li v-for="row in upcoming.holidays" :key="row.id" class="dsh-row">
                  <span class="dsh-date tone-red"><b class="dsh-num">{{ fmt(`${row.from}T00:00:00`, { day: "numeric" }) }}</b>{{ fmt(`${row.from}T00:00:00`, { month: "short" }) }}</span>
                  <div class="dsh-row__body"><span class="dsh-row__title">{{ row.title }}</span>
                    <span v-if="row.to !== row.from" class="dsh-row__meta">{{ dateText(row.from) }} – {{ dateText(row.to) }}</span></div>
                </li>
              </ul>
            </template>
            <template v-if="upcoming.events?.length">
              <h3 class="dsh-h3 dsh-h3--gap">{{ $t("dash.events") }}</h3>
              <ul class="dsh-list">
                <li v-for="row in upcoming.events" :key="row.id" class="dsh-row">
                  <span class="dsh-date tone-violet"><b class="dsh-num">{{ fmt(row.start, { day: "numeric" }) }}</b>{{ fmt(row.start, { month: "short" }) }}</span>
                  <div class="dsh-row__body"><span class="dsh-row__title">{{ row.title }}</span></div>
                </li>
              </ul>
            </template>
          </template>
          <p v-else class="dsh-muted">{{ $t("dash.nothing_upcoming") }}</p>
        </article>
      </section>

      <!-- Totals -->
      <section class="dsh-card dsh-totals dsh-in" :style="{ '--i': 21 }">
        <h2 class="dsh-totals__title">{{ $t("dash.totals") }}</h2>
        <div class="dsh-totals__grid">
          <div v-for="item in totals" :key="item.key" class="dsh-total">
            <i :class="item.icon" aria-hidden="true" />
            <b class="dsh-num">{{ num(item.n) }}</b>
            <span>{{ $t(`dash.t_${item.key}`) }}</span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.dsh {
  --teal: #135c65;
  --teal-900: #0b3f45;
  --ink: #0f2a2e;
  --muted: #64748b;
  --line: #e4ecee;
  --soft: #f4f8f8;
  --radius: 16px;
  --shadow: 0 1px 2px rgba(15, 42, 46, 0.05), 0 4px 16px rgba(15, 42, 46, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--ink);
  font-family: var(--sawa-font, inherit);
}
.dsh-num {
  font-variant-numeric: tabular-nums;
}

/* tones: text / soft background pairs, all ≥ 4.5:1 */
.tone-teal { --c: #135c65; --bg: #e3f1f1; }
.tone-green { --c: #15803d; --bg: #e7f6ec; }
.tone-magenta { --c: #b21553; --bg: #fbe7ef; }
.tone-amber { --c: #b45309; --bg: #fdf1e1; }
.tone-red { --c: #b91c1c; --bg: #fde8e8; }
.tone-violet { --c: #5b34a3; --bg: #efe9fb; }
.tone-blue { --c: #1d4ed8; --bg: #e6efff; }
.tone-slate { --c: #475569; --bg: #eef2f5; }
.tone-sand { --c: #6b6d3f; --bg: #f2f2e6; }
.tone-bg-teal { background: #135c65; }
.tone-bg-green { background: #22a05a; }
.tone-bg-magenta { background: #b21553; }
.tone-bg-amber { background: #e19a3b; }
.tone-bg-red { background: #dc2626; }
.tone-bg-violet { background: #6a3fb5; }
.tone-bg-slate { background: #94a3b8; }

/* head */
.dsh-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.4rem 1.5rem;
  border-radius: var(--radius);
  color: #fff;
  background:
    radial-gradient(circle at 12% 120%, rgba(167, 235, 246, 0.35), transparent 45%),
    radial-gradient(circle at 95% -20%, rgba(212, 52, 107, 0.45), transparent 40%),
    linear-gradient(120deg, #0b3f45, #135c65 55%, #1c6772);
  box-shadow: 0 10px 30px rgba(11, 63, 69, 0.25);
}
.dsh-kicker {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.85;
}
.dsh-title {
  margin: 0.15rem 0 0.2rem;
  font-size: clamp(1.4rem, 1.1rem + 1.2vw, 2rem);
  font-weight: 800;
  line-height: 1.25;
}
.dsh-sub {
  margin: 0;
  font-size: 0.92rem;
  opacity: 0.9;
}
.dsh-hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}
.dsh-live {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
}
.dsh-live__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6);
  animation: dsh-ping 2s infinite;
}
.dsh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 40px;
  padding: 0 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.15s ease;
}
.dsh-btn:hover { background: rgba(255, 255, 255, 0.22); }
.dsh-btn:disabled { opacity: 0.7; cursor: wait; }
.dsh-btn--solid { background: var(--teal); border-color: var(--teal); }
.dsh-btn:focus-visible, .dsh-kpi:focus-visible, .dsh-attn__item:focus-visible, .dsh-more:focus-visible, .dsh-row__title:focus-visible {
  outline: 3px solid #a7ebf6;
  outline-offset: 2px;
}
.dsh-banner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: #fff7e0;
  border: 1px solid #f6d27a;
  color: #7a5200;
  font-weight: 700;
}

/* grids */
.dsh-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr);
}
.dsh-grid--kpi { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
@media (min-width: 768px) {
  .dsh-grid--three, .dsh-grid--four { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
  .dsh-grid--kpi { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .dsh-grid--main { grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr); }
  .dsh-grid--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (min-width: 1280px) {
  .dsh-grid--four { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .dsh-span-2 { grid-column: span 2; }
}

/* cards */
.dsh-card {
  min-width: 0;
  padding: 1.1rem 1.2rem;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.dsh-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.dsh-card__head h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--ink);
}
.dsh-card__head h2 .pi {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  font-size: 0.9rem;
  color: var(--teal);
  background: #e3f1f1;
}
.dsh-more {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--teal);
  text-decoration: none;
  white-space: nowrap;
}
.dsh-more:hover { text-decoration: underline; }
[dir="ltr"] .dsh-flip { transform: scaleX(-1); }
.dsh-h3 {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: #334155;
}
.dsh-h3--gap { margin-top: 1rem; }
.dsh-muted { margin: 0; color: var(--muted); font-size: 0.86rem; }
.dsh-hint { margin: -0.4rem 0 0.75rem; font-size: 0.8rem; }
.dsh-strong { margin: 0 0 0.5rem; font-weight: 800; }
.dsh-red { color: #b91c1c; }
.dsh-ok {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0.5rem 0 0;
  color: #15803d;
  font-weight: 700;
  font-size: 0.88rem;
}
.dsh-count {
  min-width: 26px;
  height: 26px;
  padding: 0 0.45rem;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: #b21553;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
}

/* KPI tiles */
.dsh-kpi {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  padding: 1rem 1.05rem;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.dsh-kpi::before {
  content: "";
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: var(--c);
}
.dsh-kpi.is-link { cursor: pointer; }
.dsh-kpi.is-link:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15, 42, 46, 0.1); border-color: color-mix(in srgb, var(--c) 35%, #fff); }
.dsh-kpi.is-alert .dsh-kpi__icon { box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 18%, transparent); }
.dsh-kpi__top { display: flex; align-items: center; gap: 0.6rem; min-width: 0; }
.dsh-kpi__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  color: var(--c);
  background: var(--bg);
}
.dsh-kpi__label {
  font-size: 0.84rem;
  font-weight: 700;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-kpi__value {
  font-size: clamp(1.35rem, 1.1rem + 0.8vw, 1.75rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--ink);
  overflow-wrap: anywhere;
}
.dsh-kpi__sub { font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
.dsh-bar {
  height: 6px;
  border-radius: 99px;
  background: #edf2f3;
  overflow: hidden;
  margin-top: 0.2rem;
}
.dsh-bar span { display: block; height: 100%; border-radius: 99px; background: var(--c, var(--teal)); transition: width 0.6s ease; }
.dsh-bar--lg { height: 10px; }

/* chips, lists */
.dsh-status-strip { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.9rem; }
.dsh-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c);
  background: var(--bg);
  white-space: nowrap;
}
.dsh-split { display: grid; gap: 1rem; grid-template-columns: minmax(0, 1fr); }
.dsh-split--top { margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--line); }
@media (min-width: 640px) { .dsh-split { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.dsh-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.45rem; }
.dsh-list--gap { margin-top: 0.9rem; }
.dsh-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.6rem;
  border-radius: 11px;
  background: var(--soft);
  min-width: 0;
}
.dsh-time {
  flex: none;
  min-width: 3.3rem;
  text-align: center;
  font-weight: 800;
  font-size: 0.85rem;
  color: var(--teal);
  background: #fff;
  border-radius: 8px;
  padding: 0.25rem 0.35rem;
}
.dsh-date {
  flex: none;
  display: grid;
  place-items: center;
  width: 3rem;
  padding: 0.25rem 0;
  border-radius: 10px;
  font-size: 0.7rem;
  line-height: 1.2;
  color: var(--c, var(--teal));
  background: var(--bg, #e3f1f1);
}
.dsh-date b { font-size: 1.05rem; }
.dsh-row__body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.dsh-row__title {
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--ink);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
a.dsh-row__title:hover { color: var(--teal); text-decoration: underline; }
.dsh-row__meta { font-size: 0.76rem; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-pulse {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
  animation: dsh-ping 1.8s infinite;
}

/* attention */
.dsh-attn { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
.dsh-attn__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 46px;
  padding: 0.45rem 0.6rem;
  border-radius: 12px;
  border: 1px solid transparent;
  background: var(--bg);
  color: inherit;
  text-decoration: none;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.dsh-attn__item.is-link:hover { border-color: color-mix(in srgb, var(--c) 40%, transparent); transform: translateX(var(--nudge, -2px)); }
[dir="ltr"] .dsh-attn__item { --nudge: 2px; }
.dsh-attn__item.is-zero { background: #f7f9fa; opacity: 0.75; }
.dsh-attn__item.is-zero .dsh-attn__icon { color: #94a3b8; background: #eef2f5; }
.dsh-attn__icon { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px; background: #fff; color: var(--c); }
.dsh-attn__label { flex: 1; min-width: 0; font-size: 0.86rem; font-weight: 700; display: flex; flex-direction: column; }
.dsh-attn__label small { font-size: 0.74rem; color: var(--c); font-weight: 700; }
.dsh-attn__n { font-size: 1.15rem; font-weight: 800; color: var(--c); }
.dsh-attn__item.is-zero .dsh-attn__n { color: #94a3b8; }

/* charts */
.dsh-chart { position: relative; height: 290px; }
.dsh-chart--sm { height: 240px; }
.dsh-donut { position: relative; height: 230px; }
.dsh-donut__center {
  position: absolute;
  top: calc(50% - 22px);
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--ink);
  pointer-events: none;
}
.dsh-chart-empty {
  height: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.88rem;
  border: 1px dashed var(--line);
  border-radius: 12px;
  background: repeating-linear-gradient(135deg, #fafcfc, #fafcfc 10px, #f4f8f8 10px, #f4f8f8 20px);
}

/* bars */
.dsh-bars { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }
.dsh-bars__label { display: flex; justify-content: space-between; gap: 0.5rem; font-size: 0.82rem; font-weight: 600; color: #334155; margin-bottom: 0.25rem; }
.dsh-bars__label span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-bars__track { height: 8px; border-radius: 99px; background: #edf2f3; overflow: hidden; }
.dsh-bars__track > span { position: relative; display: block; height: 100%; border-radius: 99px; transition: width 0.6s ease; }
.dsh-bars__done { position: absolute; inset-block: 0; inset-inline-start: 0; background: rgba(255, 255, 255, 0.35); border-radius: 99px; }
.dsh-ring-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.dsh-ring {
  --p: 0;
  flex: none;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--teal) calc(var(--p) * 1%), #e3eef0 0);
}
.dsh-ring span {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--teal);
}
.dsh-legend-line { display: flex; align-items: center; gap: 0.4rem; margin: 0 0 0.3rem; font-size: 0.82rem; color: #475569; }
.dsh-legend-line b { margin-inline-start: auto; }
.dsh-legend-line--row { flex-wrap: wrap; gap: 0.9rem; margin-top: 0.6rem; }
.dsh-legend-line--row > span { display: inline-flex; align-items: center; gap: 0.35rem; }
.dsh-dot { width: 10px; height: 10px; border-radius: 3px; background: var(--c); flex: none; }

/* tiles */
.dsh-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
.dsh-tiles--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.dsh-tiles--five { grid-template-columns: repeat(5, minmax(0, 1fr)); margin-bottom: 0.75rem; }
@media (max-width: 480px) { .dsh-tiles--five { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.dsh-tile {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.65rem 0.7rem;
  border-radius: 12px;
  background: var(--bg);
  min-width: 0;
}
.dsh-tile b { font-size: 1.3rem; font-weight: 800; color: var(--c); line-height: 1.2; }
.dsh-tile span { font-size: 0.74rem; font-weight: 700; color: #475569; line-height: 1.35; }
.dsh-mini-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; margin-bottom: 0.9rem; }
@media (min-width: 768px) { .dsh-mini-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.dsh-mini-stats > div { display: flex; flex-direction: column; padding: 0.55rem 0.7rem; border-radius: 11px; background: var(--soft); min-width: 0; }
.dsh-mini-stats span { font-size: 0.74rem; color: var(--muted); font-weight: 600; }
.dsh-mini-stats b { font-size: 1rem; font-weight: 800; }
.dsh-risk { display: flex; flex-direction: column; gap: 0.6rem; }
.dsh-stack { display: flex; height: 22px; border-radius: 8px; overflow: hidden; background: #edf2f3; }
.dsh-stack > span { display: grid; place-items: center; color: #fff; font-size: 0.72rem; font-weight: 800; min-width: 22px; }
.dsh-stack__empty { flex: 1; }

/* activity */
.dsh-feed { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.dsh-feed__item { position: relative; display: flex; align-items: flex-start; gap: 0.7rem; padding: 0.55rem 0; min-width: 0; }
.dsh-feed__item:not(:last-child)::after {
  content: "";
  position: absolute;
  inset-inline-start: 15px;
  top: 42px;
  bottom: -6px;
  width: 2px;
  background: var(--line);
}
.dsh-feed__icon { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; color: var(--c); background: var(--bg); font-size: 0.85rem; }
.dsh-feed__body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.dsh-feed__time { flex: none; font-size: 0.74rem; color: var(--muted); white-space: nowrap; padding-top: 0.2rem; }

/* totals */
.dsh-totals { padding: 1rem 1.2rem; }
.dsh-totals__title { margin: 0 0 0.75rem; font-size: 0.95rem; font-weight: 800; }
.dsh-totals__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 0.5rem; }
.dsh-total { display: flex; flex-direction: column; align-items: flex-start; gap: 0.1rem; padding: 0.65rem 0.75rem; border-radius: 12px; background: var(--soft); }
.dsh-total .pi { color: var(--teal); font-size: 0.95rem; margin-bottom: 0.15rem; }
.dsh-total b { font-size: 1.2rem; font-weight: 800; }
.dsh-total span { font-size: 0.74rem; color: var(--muted); font-weight: 600; }

/* states */
.dsh-skel {
  border-radius: var(--radius);
  background: linear-gradient(90deg, #eef3f4 25%, #f7fafa 50%, #eef3f4 75%);
  background-size: 200% 100%;
  animation: dsh-shimmer 1.2s infinite;
}
.dsh-empty-state { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2.5rem 1rem; text-align: center; color: var(--muted); }
.dsh-empty-state .pi { font-size: 2rem; color: #94a3b8; }

/* motion */
.dsh-in { animation: dsh-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: calc(var(--i, 0) * 35ms); }
@keyframes dsh-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes dsh-shimmer { to { background-position: -200% 0; } }
@keyframes dsh-ping {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-in, .dsh-skel, .dsh-live__dot, .dsh-pulse { animation: none; }
  .dsh-kpi, .dsh-attn__item, .dsh-bar span, .dsh-bars__track > span { transition: none; }
}
@media (max-width: 640px) {
  .dsh-hero { padding: 1.1rem 1rem; }
  .dsh-card { padding: 0.95rem 0.9rem; }
  .dsh-chart { height: 240px; }
  .dsh-kpi { padding: 0.85rem 0.8rem; }
  .dsh-kpi__label { white-space: normal; }
}
</style>
