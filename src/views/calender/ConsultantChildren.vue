<script setup>
// A consultant's children (consulted by them or referred to evaluation under their name): per child the
// consultation result, the evaluation appointments with their status, and the evaluations with links to results.
// A consultant sees their own; whoever can list children picks any consultant.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { can } from "@/utils/permissions";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { requestStatus } from "@/utils/evaluationRequestStatus";
import { formatChildAge } from "@/utils/childAge";

const router = useRouter();
const { t } = useI18n();

const canPick = computed(() => can("child list"));
const ownList = computed(() => can("consultant children list"));
const consultants = ref([]);
const consultantId = ref(null);
const children = ref([]);
const loading = ref(false);
const loadError = ref(false);
const search = ref("");
const expanded = ref({});

const shown = computed(() => {
  const term = search.value.trim().toLocaleLowerCase();
  return term ? children.value.filter((child) => String(child.name ?? "").toLocaleLowerCase().includes(term)) : children.value;
});

const typeLabel = (type) => getEvaluationTypeLabel(type, t, String(type));
const withName = (text, child) => String(text ?? "").replace(/\{\{.*?\}\}/g, String(child.name ?? "").split(" ")[0]);
const recommendations = (result) => [...(result?.filed_value ?? [])].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
const finishedCount = (child) => child.evaluations.filter((evaluation) => evaluation.status === 1).length;
const openCount = (child) => child.appointments.filter((appointment) => appointment.status !== 1).length;

// The results page of each evaluation type, and the permission it needs.
const RESULT_PERMISSIONS = { 1: "evaluation results list", 2: "milestone answer list", 3: "barrier answer list", 4: "able answer list", 5: "carolina answer list", 6: "transition answer list", 7: "skills answer list", 8: "mchat answer list" };
const canOpenResult = (evaluation) => evaluation.status === 1 && can(RESULT_PERMISSIONS[evaluation.type] ?? "evaluation results list");
function openResult(child, evaluation) {
  const routes = {
    2: { name: "milestone-resulte", params: { id: child.id, evla_id: evaluation.id } },
    3: { name: "barrier-resulte", params: { id: child.id } },
    4: { name: "ablls-resulte", params: { id: evaluation.id } },
    5: { name: "carolina-resulte", params: { id: evaluation.id } },
    6: { name: "transition-result", params: { id: child.id, evaluation: evaluation.id } },
    7: { name: "skills-result", params: { id: evaluation.id } },
    8: { name: "mchat-result", params: { id: child.id, evaluation: evaluation.id } },
  };
  localStorage.setItem("child_id", child.id);
  router.push(routes[evaluation.type] ?? {
    name: "showChildResult",
    params: { child_id: child.id, sideProfile_id: evaluation.side_profile_id || 0, evaluation_id: evaluation.id },
  });
}

async function load() {
  if (!consultantId.value && !ownList.value) {
    children.value = [];
    return;
  }
  loading.value = true;
  loadError.value = false;
  try {
    const { data } = await axios.get("api/consultant-children", { params: { consultant_id: consultantId.value || undefined, _ts: Date.now() } });
    children.value = data?.data ?? [];
    expanded.value = {};
  } catch {
    children.value = [];
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (canPick.value) {
    try {
      const { data } = await axios.get("api/consultant-children/consultants");
      consultants.value = data?.data ?? [];
    } catch {
      consultants.value = [];
    }
  }
  await load();
});
</script>

<template>
  <div class="sawa-card consultant-page">
    <header class="page-head">
      <div>
        <h2>{{ $t("consultant_children") }}</h2>
        <p>{{ $t("consultant_children_hint") }}</p>
      </div>
      <div class="page-tools">
        <Select v-if="canPick" v-model="consultantId" :options="consultants" optionLabel="name" optionValue="id" filter
          :showClear="ownList" :placeholder="ownList ? $t('consultant_children_mine') : $t('choose_consultant')"
          :filterPlaceholder="$t('search')" class="consultant-picker" @update:modelValue="load" />
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" :placeholder="$t('child_name')" :aria-label="$t('search')" />
        </IconField>
      </div>
    </header>

    <div v-if="loading" class="page-state"><i class="pi pi-spin pi-spinner" aria-hidden="true" /> {{ $t("loading") }}</div>
    <div v-else-if="loadError" class="page-state"><i class="pi pi-exclamation-circle" aria-hidden="true" /><p>{{ $t("request_failed_retry") }}</p></div>
    <div v-else-if="!consultantId && !ownList" class="page-state"><i class="pi pi-user" aria-hidden="true" /><p>{{ $t("choose_consultant") }}</p></div>
    <div v-else-if="!shown.length" class="page-state"><i class="pi pi-inbox" aria-hidden="true" /><p>{{ $t("consultant_children_empty") }}</p></div>

    <div v-else class="child-list">
      <article v-for="child in shown" :key="child.id" class="child-card">
        <button type="button" class="child-head" :aria-expanded="!!expanded[child.id]"
          @click="expanded = { ...expanded, [child.id]: !expanded[child.id] }">
          <span class="child-avatar"><i class="pi pi-user" aria-hidden="true" /></span>
          <span class="child-identity">
            <strong>{{ child.name }}</strong>
            <small>
              {{ formatChildAge(child.birth_date, null, t) }}
              <template v-if="child.parent?.phone"> · <span dir="ltr">{{ child.parent.phone }}</span></template>
            </small>
          </span>
          <span class="child-tags">
            <Tag v-if="openCount(child)" severity="warn" icon="pi pi-clock" :value="$t('consultant_children_open', { count: openCount(child) })" />
            <Tag v-if="finishedCount(child)" severity="success" icon="pi pi-check" :value="$t('consultant_children_finished', { count: finishedCount(child) })" />
            <Tag v-if="!child.appointments.length && !child.evaluations.length" severity="secondary" :value="$t('consultant_children_no_evaluations')" />
          </span>
          <i class="pi" :class="expanded[child.id] ? 'pi-chevron-up' : 'pi-chevron-down'" aria-hidden="true" />
        </button>

        <div v-if="expanded[child.id]" class="child-body">
          <!-- Evaluation appointments and their status -->
          <section>
            <h3><i class="pi pi-calendar" aria-hidden="true" /> {{ $t("consultant_children_appointments") }}</h3>
            <p v-if="!child.appointments.length" class="muted">{{ $t("no_appointments_yet") }}</p>
            <ul v-else class="rows">
              <li v-for="appointment in child.appointments" :key="appointment.id">
                <span class="row-main">
                  <strong>{{ typeLabel(appointment.evaluation_type) }}</strong>
                  <small><span dir="ltr">{{ appointment.date }} {{ appointment.start_time?.slice(0, 5) }}</span> · {{ appointment.specialist || "—" }}</small>
                </span>
                <Tag :severity="requestStatus(appointment.status).severity" :value="$t(requestStatus(appointment.status).key)" />
              </li>
            </ul>
          </section>

          <!-- Evaluations and their results -->
          <section>
            <h3><i class="pi pi-chart-bar" aria-hidden="true" /> {{ $t("consultant_children_results") }}</h3>
            <p v-if="!child.evaluations.length" class="muted">{{ $t("consultant_children_no_results") }}</p>
            <ul v-else class="rows">
              <li v-for="evaluation in child.evaluations" :key="evaluation.id">
                <span class="row-main">
                  <strong>{{ typeLabel(evaluation.type) }}</strong>
                  <small><span dir="ltr">{{ evaluation.date }}</span><template v-if="evaluation.specialist"> · {{ evaluation.specialist }}</template></small>
                </span>
                <Tag :severity="evaluation.status === 1 ? 'success' : 'info'" :value="$t(evaluation.status === 1 ? 'status_finished' : 'status_in_progress')" />
                <Button v-if="canOpenResult(evaluation)" icon="pi pi-eye" :label="$t('consultant_children_view_result')" size="small"
                  variant="outlined" @click="openResult(child, evaluation)" />
              </li>
            </ul>
          </section>

          <!-- The consultation result(s) with this consultant -->
          <section class="wide">
            <h3><i class="pi pi-file" aria-hidden="true" /> {{ $t("consultation_result") }}</h3>
            <p v-if="!child.consultations.length" class="muted">{{ $t("consultant_children_referred_only") }}</p>
            <div v-for="consultation in child.consultations" :key="consultation.booking_id" class="consultation">
              <p class="consultation-date"><i class="pi pi-calendar" aria-hidden="true" /> <span dir="ltr">{{ consultation.date || "—" }}</span></p>
              <dl v-if="consultation.consultation_result" class="result-list">
                <template v-if="consultation.consultation_result.health">
                  <dt>{{ $t("health_development_history") }}</dt><dd>{{ consultation.consultation_result.health }}</dd>
                </template>
                <template v-if="consultation.consultation_result.consultant_recommendations">
                  <dt>{{ $t("consultant_recommendations") }}</dt><dd>{{ consultation.consultation_result.consultant_recommendations }}</dd>
                </template>
                <template v-if="recommendations(consultation.consultation_result).length">
                  <dt>{{ $t("choose_home_recommendations") }}</dt>
                  <dd><p v-for="(item, i) in recommendations(consultation.consultation_result)" :key="item.id ?? i">{{ withName(item.value, child) }}</p></dd>
                </template>
                <template v-if="consultation.consultation_result.notes">
                  <dt>{{ $t("additional_notes") }}</dt><dd>{{ consultation.consultation_result.notes }}</dd>
                </template>
              </dl>
              <p v-else class="muted">{{ $t("no_consultation_result") }}</p>
              <p v-if="consultation.required.length" class="required">
                <span>{{ $t("required_evaluations") }}:</span>
                <Tag v-for="type in consultation.required" :key="type" severity="secondary" :value="typeLabel(type)" />
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.consultant-page { padding: 1.25rem; }
.page-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
.page-head h2 { margin: 0; font-size: 1.3rem; font-weight: 700; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.page-head p { margin: 0.3rem 0 0; color: #64748b; font-size: 0.9rem; }
.page-tools { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.consultant-picker { min-width: 14rem; }
.page-state { display: grid; justify-items: center; gap: 0.5rem; padding: 3rem 1rem; color: #64748b; }
.page-state .pi { font-size: 2rem; color: #94a3b8; }
.child-list { display: grid; gap: 0.75rem; }
.child-card { border: 1px solid #e2e8f0; border-inline-start: 4px solid var(--sawa-primary, rgb(var(--bp-135c65))); border-radius: 0.85rem; background: #fff; overflow: hidden; }
.child-head { display: flex; align-items: center; gap: 0.85rem; width: 100%; padding: 0.85rem 1rem; border: 0; background: none; text-align: start; cursor: pointer; }
.child-head:hover, .child-head:focus-visible { background: #f8fafc; }
.child-avatar { display: grid; place-items: center; flex-shrink: 0; width: 2.4rem; height: 2.4rem; border-radius: 50%; background: #e6f4f3; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.child-identity { display: grid; flex: 1; min-width: 0; }
.child-identity strong { color: #0f172a; }
.child-identity small { color: #64748b; }
.child-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.child-body { display: grid; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem; padding: 0 1rem 1rem; }
.child-body .wide { grid-column: 1 / -1; }
.child-body h3 { display: flex; align-items: center; gap: 0.4rem; margin: 0 0 0.6rem; font-size: 0.98rem; font-weight: 700; color: rgb(var(--bp-135c65)); }
.rows { display: grid; gap: 0.45rem; margin: 0; padding: 0; list-style: none; }
.rows li { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; padding: 0.5rem 0.7rem; border: 1px solid #eef2f2; border-radius: 0.6rem; }
.row-main { display: grid; flex: 1; min-width: 10rem; }
.row-main small { color: #64748b; }
.muted { margin: 0; color: #94a3b8; }
.consultation + .consultation { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed #e2e8f0; }
.consultation-date { margin: 0 0 0.4rem; color: #475569; font-weight: 600; }
.result-list { display: grid; gap: 0.3rem; margin: 0; }
.result-list dt { font-weight: 600; color: #374151; font-size: 0.9rem; }
.result-list dd { margin: 0 0 0.4rem; color: #4b5563; font-size: 0.9rem; white-space: pre-line; }
.result-list dd p { margin: 0 0 0.3rem; }
.required { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; margin: 0.5rem 0 0; color: #475569; font-size: 0.9rem; }
</style>
