<template>
  <div>
    <ChildTaps></ChildTaps>

    <div class="sawa-card evaluations-page">
      <!-- A new evaluation: booked in a specialist's calendar, or for a specialist without an appointment. -->
      <div class="evaluations-toolbar">
        <Button v-can="'evaluation request create'" icon="pi pi-calendar-plus" :label="$t('evaluation_with_appointment')"
          @click="$router.push({ name: 'Calender', params: { id: child_id } })" />
        <Button v-can="'evaluation request without appointment create'" icon="pi pi-plus" :label="$t('evaluation_without_appointment_add')"
          severity="secondary" variant="outlined" @click="openUnscheduled" />
      </div>

      <div v-if="loading" class="evaluations-empty">
        <i class="pi pi-spin pi-spinner" aria-hidden="true"></i>
        <p>{{ $t("loading") }}</p>
      </div>

      <div v-else-if="evaluations.length" class="evaluations-grid">
        <article
          v-for="evalu in evaluations"
          :key="(isSideProfile(evalu) ? 'side-' : 'eval-') + evalu.id"
          class="evaluation-card"
          :class="'type-' + typeTone(evalu)"
        >
          <header class="evaluation-card-header">
            <span class="evaluation-type-badge">
              <i :class="typeIcon(evalu)" aria-hidden="true"></i>
              {{ typeLabel(evalu) }}
            </span>
            <span
              v-if="!isSideProfile(evalu) && (evalu.status == 0 || evalu.status == 1)"
              class="evaluation-status"
              :class="evalu.status == 1 ? 'is-finished' : 'is-pending'"
            >
              {{ evalu.status == 1 ? $t("status_finished") : Number(evalu.type) === 2 ? $t("milestone_pending_status") : $t("status_under_evaluation") }}
            </span>
          </header>

          <h3 class="evaluation-title">{{ isSideProfile(evalu) && evalu.title ? evalu.title : typeLabel(evalu) }}</h3>

          <dl class="evaluation-meta">
            <div>
              <dt><i class="pi pi-calendar" aria-hidden="true"></i>{{ $t("evaluation_date") }}</dt>
              <dd dir="ltr">{{ evalu.date || "—" }}</dd>
            </div>
            <div v-if="evalu.specialist?.name || evalu.doctor?.name">
              <dt><i class="pi pi-user" aria-hidden="true"></i>{{ $t("Name_evaluator") }}</dt>
              <dd>{{ evalu.specialist?.name || evalu.doctor?.name }}</dd>
            </div>
          </dl>

          <footer class="evaluation-actions">
            <Button
              v-can="[
                'evaluation results list',
                'able answer list',
                'skills answer list',
                'carolina answer list',
                'milestone answer list',
                'barrier answer list',
                'transition answer list',
                'mchat answer list',
              ]"
              @click="go_evaluate(evalu)"
              icon="pi pi-chart-bar"
              :label="$t('evaluation_results')"
              class="evaluation-results-btn"
            />
            <!-- A VB-MAPP evaluation waiting for levels: continue it with the missing levels. -->
            <Button
              v-if="!isSideProfile(evalu) && Number(evalu.type) === 2 && evalu.status == 0"
              v-can="'milestone answer create'"
              icon="pi pi-play"
              :label="$t('milestone_continue')"
              severity="warn"
              @click="continueMilestone(evalu)"
            />
            <!-- Side profile rows are shared evaluation templates: deleting one would remove it for every child. -->
            <Button
              v-if="!isSideProfile(evalu)"
              v-can="'evaluations delete'"
              icon="pi pi-trash"
              @click="deleteevalution(evalu.id)"
              severity="danger"
              variant="outlined"
              v-tooltip.top="$t('delete')"
              :aria-label="$t('delete')"
            />
          </footer>
        </article>
      </div>

      <div v-else class="evaluations-empty">
        <i class="pi pi-inbox" aria-hidden="true"></i>
        <p>{{ $t("no_evaluations_yet") }}</p>
      </div>

      <Paginator
        v-if="total_records > per_page"
        v-model:first="first"
        :rows="per_page"
        :totalRecords="total_records"
        class="evaluations-paginator"
      />
    </div>

    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      :header="$t('submit')"
      :modal="true"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>{{ $t("evaluation_delete_confirm") }}</span>
      </div>
      <template #footer>
        <Button
          :label="$t('no')"
          icon="pi pi-times"
          @click="deleteDialog = false"
          variant="text"
          severity="secondary"
        />
        <Button
          :label="$t('yes')"
          icon="pi pi-check"
          @click="deleteAction"
          severity="danger"
        />
      </template>
    </Dialog>

    <Dialog v-model:visible="unscheduled.visible" modal :header="$t('evaluation_without_appointment_add')" :style="{ width: '30rem' }"
      :breakpoints="{ '640px': '94vw' }">
      <form class="flex flex-column gap-3" @submit.prevent="createUnscheduled">
        <div class="flex flex-column gap-2">
          <label for="unscheduled-type">{{ $t("evalute_type") }}</label>
          <Select v-model="unscheduled.evaluation_type" inputId="unscheduled-type" :options="evaluate_types" optionLabel="name" optionValue="id"
            filter :invalid="unscheduled.submitted && !unscheduled.evaluation_type" @update:modelValue="loadSpecialists" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="unscheduled-specialist">{{ $t("Name_evaluator") }}</label>
          <Select v-model="unscheduled.employee_id" inputId="unscheduled-specialist" :options="specialists" optionLabel="name" optionValue="id"
            filter :disabled="!unscheduled.evaluation_type" :loading="unscheduled.loading"
            :placeholder="unscheduled.evaluation_type && !unscheduled.loading && !specialists.length ? $t('no_evaluators_for_type') : ''"
            :invalid="unscheduled.submitted && !unscheduled.employee_id">
            <template #option="{ option }">
              <span>{{ option.name }}</span>
              <i v-if="!fitsAge(option.age_from_months, option.age_to_months, childAgeMonths)" class="pi pi-exclamation-triangle text-orange-500 ms-2"
                v-tooltip.top="$t('age_ranges.therapist_short')" />
            </template>
          </Select>
        </div>
        <!-- Age ranges only warn. -->
        <Message v-for="warning in unscheduledWarnings" :key="warning" severity="warn" :closable="false">{{ warning }}</Message>
        <div class="flex flex-column gap-2">
          <label for="unscheduled-notes">{{ $t("notes") }}</label>
          <Textarea id="unscheduled-notes" v-model="unscheduled.notes" rows="3" autoResize />
        </div>
        <small class="text-color-secondary">{{ $t("evaluation_without_appointment_hint") }}</small>
        <Button type="submit" icon="pi pi-check" :label="$t('submit')" :loading="unscheduled.saving" class="w-full" />
      </form>
    </Dialog>

    <Toast />
  </div>
</template>

<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import ChildTaps from "../../components/ChildTaps.vue";
import { getEvaluationTypeLabel } from "../../utils/evaluationTypes";
import { childMonths, fitsAge, formatAgeRange } from "../../utils/ageRange";
import { formatChildAge } from "../../utils/childAge";

export default {
  components: { ChildTaps },

  data() {
    return {
      child_id: useStorage("child_id", Number),
      maxDate: new Date(),
      details: {},
      evaluations: [],
      delete_id: 0,
      specialists: [],
      unscheduled: { visible: false },
      typeAges: [],
      deleteDialog: false,
      loading: true,
      first: 0,
      per_page: 6,
      total_records: 0,
    };
  },

  methods: {
    fitsAge,
    openUnscheduled() {
      if (!this.typeAges.length) axios.get("api/evaluation-type-ages").then(({ data }) => { this.typeAges = data.data ?? []; }).catch(() => {});
      this.specialists = [];
      this.unscheduled = { visible: true, evaluation_type: null, employee_id: null, notes: "", submitted: false, loading: false, saving: false };
    },

    // The specialists who do this evaluation (as the booking calendar lists them).
    async loadSpecialists(type) {
      this.unscheduled.employee_id = null;
      this.specialists = [];
      if (!type) return;
      this.unscheduled.loading = true;
      try {
        const { data } = await axios.get(`api/employees/get/with/${type}`);
        if (this.unscheduled.evaluation_type !== type) return;
        const list = data.data?.employees;
        this.specialists = (Array.isArray(list) ? list : Object.values(list ?? {}))
          .map((row) => ({ id: Number(row.id), name: row.name, age_from_months: row.age_from_months ?? null, age_to_months: row.age_to_months ?? null }));
      } catch {
        this.specialists = [];
      } finally {
        this.unscheduled.loading = false;
      }
    },

    async createUnscheduled() {
      this.unscheduled.submitted = true;
      if (!this.unscheduled.evaluation_type || !this.unscheduled.employee_id) return;
      this.unscheduled.saving = true;
      try {
        await axios.post("api/evaluation-request/unscheduled", {
          child_id: this.child_id,
          employee_id: this.unscheduled.employee_id,
          evaluation_type: this.unscheduled.evaluation_type,
          notes: this.unscheduled.notes?.trim() || null,
        });
        this.unscheduled.visible = false;
        this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: this.$t("element_add_success"), life: 3000 });
        this.$router.push({ name: "children-request" });
      } catch (e) {
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail: e.response?.data?.message || this.$t("mission_error"), life: 3000 });
      } finally {
        this.unscheduled.saving = false;
      }
    },

    // Side profile rows come from the evaluation_results pivot and have no type;
    // every other row is the child's own evaluation with a type.
    isSideProfile(evalu) {
      return Boolean(evalu?.pivot) || evalu?.type == null;
    },
    typeLabel(evalu) {
      return this.isSideProfile(evalu)
        ? this.$t("side_profile_eval")
        : getEvaluationTypeLabel(evalu.type, this.$t, this.$t("evaluation_results"));
    },
    typeTone(evalu) {
      return this.isSideProfile(evalu) ? 1 : Number(evalu.type) || 0;
    },
    typeIcon(evalu) {
      return {
        1: "pi pi-id-card", 2: "pi pi-flag", 3: "pi pi-shield", 4: "pi pi-list-check", 5: "pi pi-sitemap",
      }[this.typeTone(evalu)] || "pi pi-file";
    },

    continueMilestone(evalu) {
      const childId = evalu?.pivot?.child_id || evalu?.child_id || Number(localStorage.getItem("child_id"));
      this.$router.push({ name: "milestone-evaluation", params: { id: childId }, query: { evaluation: evalu.id } });
    },

    go_evaluate(evalu) {
      const childId = evalu?.pivot?.child_id || evalu?.child_id || Number(localStorage.getItem("child_id"));
      if (!evalu?.id || !childId) {
        this.$toast.add({
          severity: "error",
          summary: this.$t("error"),
          detail: this.$t("mission_error"),
          life: 3000,
        });
        return;
      }

      const type = this.isSideProfile(evalu) ? 1 : Number(evalu.type);
      const routes = {
        2: { name: "milestone-resulte", params: { id: childId, evla_id: evalu.id } },
        3: { name: "barrier-resulte", params: { id: childId } },
        4: { name: "ablls-resulte", params: { id: evalu.id } },
        5: { name: "carolina-resulte", params: { id: evalu.id } },
        6: { name: "transition-result", params: { id: childId, evaluation: evalu.id } },
        7: { name: "skills-result", params: { id: evalu.id } },
        8: { name: "mchat-result", params: { id: childId, evaluation: evalu.id } },
      };
      this.$router.push(routes[type] || {
        name: "showChildResult",
        params: {
          child_id: childId,
          sideProfile_id: evalu.side_profile_id || 0,
          evaluation_id: evalu.id,
        },
      });
    },

    getusers(page = 1) {
      this.loading = true;
      axios
        .get(`api/child/${localStorage.getItem("child_id")}/get/evaluations`, { params: { page } })
        .then((response) => {
          const root = response.data?.evaluations || response.data?.data?.evaluations || {};
          const list = Array.isArray(root.data) ? root.data : Array.isArray(root) ? root : [];

          this.details = response.data || {};
          this.evaluations = list;
          this.per_page = Number(root.per_page) || this.per_page;
          this.total_records = Number(root.total) || list.length;
        })
        .catch(() => {
          this.details = {};
          this.evaluations = [];
          this.total_records = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    deleteevalution(id) {
      this.delete_id = id;
      this.deleteDialog = !this.deleteDialog;
    },

    deleteAction() {
      axios
        .delete(`api/evaluations/${this.delete_id}/delete`)
        .then(() => {
          this.deleteDialog = false;
          // Step back a page when the last item on it was removed.
          if (this.evaluations.length === 1 && this.first >= this.per_page) this.first -= this.per_page;
          else this.getusers(Math.floor(this.first / this.per_page) + 1);
        })
        .catch(() => {
          this.$toast.add({ severity: "error", summary: this.$t("error"), detail: this.$t("mission_error"), life: 3000 });
        });
    },

  },

  computed: {
    childAgeMonths() {
      return childMonths(this.details?.birth_date);
    },
    // The evaluation type's and the evaluator's age ranges against the child's age (warnings only).
    unscheduledWarnings() {
      if (!this.unscheduled.visible || this.childAgeMonths === null) return [];
      const age = formatChildAge(this.details.birth_date, null, this.$t);
      const warnings = [];
      const range = this.typeAges.find((row) => row.type === Number(this.unscheduled.evaluation_type));
      if (range && !fitsAge(range.from_months, range.to_months, this.childAgeMonths)) {
        warnings.push(this.$t("age_ranges.evaluation_warning", { age, range: formatAgeRange(this.$t, range.from_months, range.to_months) }));
      }
      const specialist = this.specialists.find((row) => row.id === this.unscheduled.employee_id);
      if (specialist && !fitsAge(specialist.age_from_months, specialist.age_to_months, this.childAgeMonths)) {
        warnings.push(this.$t("age_ranges.therapist_warning", { age, range: formatAgeRange(this.$t, specialist.age_from_months, specialist.age_to_months) }));
      }
      return warnings;
    },
    // The types the booking calendar books: the evaluations and the side profile dimensions.
    evaluate_types() {
      return [2, 3, 4, 5, 6, 7, 8, 101, 102, 103, 104, 105].map((id) => ({ id, name: getEvaluationTypeLabel(id, this.$t) }));
    },
  },

  watch: {
    // Paginator's `first` is a 0-based row offset; the API pages start at 1.
    first(value) {
      this.getusers(Math.floor(value / this.per_page) + 1);
    },
  },

  mounted() {
    this.getusers();
    this.child_id = Number(localStorage.getItem("child_id"));
  },
};
</script>

<style scoped>
.evaluations-page { padding: 1.25rem; }
.evaluations-toolbar { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .5rem; margin-bottom: 1rem; }
.evaluations-toolbar:empty { display: none; }
.evaluations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); gap: 1rem; }
.evaluation-card {
  --tone: #135c65; --tone-soft: #e6f4f3;
  display: flex; flex-direction: column; gap: .85rem; padding: 1.1rem 1.25rem;
  border: 1px solid #e2e8f0; border-top: 4px solid var(--tone); border-radius: 14px; background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / .04); transition: box-shadow .2s, transform .2s;
}
.evaluation-card:hover { box-shadow: 0 10px 24px -12px rgb(15 23 42 / .25); transform: translateY(-2px); }
.evaluation-card.type-1 { --tone: #6554C0; --tone-soft: #efedfa; }
.evaluation-card.type-2 { --tone: #0f8a7e; --tone-soft: #e3f5f2; }
.evaluation-card.type-3 { --tone: #d9730d; --tone-soft: #fdf0e3; }
.evaluation-card.type-4 { --tone: #2563eb; --tone-soft: #e8effd; }
.evaluation-card.type-5 { --tone: #db2777; --tone-soft: #fce8f1; }
.evaluation-card-header { display: flex; align-items: center; justify-content: space-between; gap: .5rem; flex-wrap: wrap; }
.evaluation-type-badge { display: inline-flex; align-items: center; gap: .4rem; padding: .3rem .7rem; border-radius: 999px; background: var(--tone-soft); color: var(--tone); font-size: .8rem; font-weight: 700; }
.evaluation-status { padding: .25rem .65rem; border-radius: 999px; font-size: .75rem; font-weight: 700; }
.evaluation-status.is-finished { background: #dcfce7; color: #166534; }
.evaluation-status.is-pending { background: #fef3c7; color: #92400e; }
.evaluation-title { margin: 0; color: #0f172a; font-size: 1.15rem; font-weight: 700; line-height: 1.6; overflow-wrap: anywhere; }
.evaluation-meta { display: grid; gap: .5rem; margin: 0; padding: .75rem; border-radius: 10px; background: #f8fafc; }
.evaluation-meta > div { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
.evaluation-meta dt { display: inline-flex; align-items: center; gap: .4rem; color: #64748b; font-size: .85rem; }
.evaluation-meta dt i { color: var(--tone); font-size: .85rem; }
.evaluation-meta dd { margin: 0; color: #1e293b; font-weight: 600; }
.evaluation-actions { display: flex; gap: .5rem; margin-top: auto; }
.evaluation-results-btn { flex: 1; }
.evaluations-empty { display: grid; justify-items: center; gap: .6rem; padding: 3rem 1rem; color: #64748b; }
.evaluations-empty i { font-size: 2.25rem; color: #94a3b8; }
.evaluations-paginator { margin-top: 1rem; }
@media (max-width: 480px) {
  .evaluations-page { padding: .75rem; }
  .evaluations-grid { grid-template-columns: 1fr; }
}
</style>
