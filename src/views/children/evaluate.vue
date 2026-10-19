<template>
  <div>
    <ChildTaps></ChildTaps>

    <div class="sawa-card evaluations-page">
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
        <span>{{ $t("هل انت متاكد من ازالة هذا العنصر") }} ?</span>
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

    <Dialog
      v-model:visible="updatedialog"
      :style="{ width: '450px' }"
      :header="$t('submit')"
      :modal="true"
    >
      <form @submit.prevent="create" class="">
        <div class="flex flex-column gap-2 py-1">
          <label class="w-full text-start" for="username">{{
            $t("evalute_type")
          }}</label>
          <Select
            @update:model-value="getdoctor_evalte"
            required
            v-model="evalate.evaluation_type"
            option-value="id"
            filter
            :options="evaluate_types"
            optionLabel="name"
            class="w-full"
            :class="{ 'p-invalid': submitted && !evalate.evaluation_type }"
          />
        </div>
        <div v-if="evalate.evaluation_type" class="flex flex-column gap-2 py-1">
          <label class="w-full text-start" for="username">{{
            $t("Name_evaluator")
          }}</label>
          <Select
            @update:model-value="getDays"
            required
            v-model="evalate.specialist_id"
            option-value="id"
            filter
            :options="doctors"
            optionLabel="name"
            class="w-full"
            :class="{ 'p-invalid': submitted && !evalate.specialist_id }"
          />
        </div>
        <div v-if="evalate.specialist_id" class="flex flex-column gap-2">
          <label class="w-full text-start" for="username">{{
            $t("Evaluation_date")
          }}</label>
          <DatePicker
            @update:model-value="gettimes($event)"
            :disabledDays="filteredDays"
            style="width: 100%"
            showButtonBar
            v-model.number="evalate.date"
            showIcon
            :class="{ 'p-invalid': submitted && !evalate.date }"
            :minDate="maxDate"
          />
          <div class="mt-1 mb-5 text-red-500" v-if="error?.date">
            {{ error.date[0] }}
          </div>
        </div>
        <div v-if="evalate.date" class="flex flex-column gap-2 py-1">
          <label class="w-full text-start" for="username">{{
            $t("hour_evaluator")
          }}</label>
          <Select
            required
            v-model="evalate.Session_time"
            filter
            :options="slots"
            optionLabel="key"
            :class="{ 'p-invalid': submitted && !evalate.Session_time }"
            class="w-full"
          />
          <div class="mt-1 mb-5 text-red-500" v-if="error?.specialist_id">
            {{ error.specialist_id[0] }}
          </div>
        </div>

        <div class="w-full text-center">
          <Button
            type="submit"
            @click="submitted = true"
            class="m-auto w-[50%] my-4"
            :label="$t('submit')"
          ></Button>
        </div>
      </form>
    </Dialog>

    <Toast />
  </div>
</template>

<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import ChildTaps from "../../components/ChildTaps.vue";
import moment from "moment";
import { getEvaluationTypeLabel } from "../../utils/evaluationTypes";

export default {
  components: { ChildTaps },

  data() {
    return {
      child_id: useStorage("child_id", Number),
      maxDate: new Date(),
      details: {},
      evaluations: [],
      evalate: {},
      error: {},
      days: [0, 1, 2, 3, 4, 5, 6],
      business_hours: [],
      submitted: false,
      slots: [],
      delete_id: 0,
      doctors: [],
      deleteDialog: false,
      loading: true,
      first: 0,
      per_page: 6,
      total_records: 0,
      updatedialog: false,
      evaluate_types: [
        { name: "side profile", id: 1 },
        { name: "milestone", id: 2 },
        { name: "barrier", id: 3 },
        { name: "ABLLS Academy", id: 4 },
        { name: "carolina", id: 5 },
        { name: "Transition", id: 6 },
        { name: "Ablls OT", id: 7 },
      ],
    };
  },

  methods: {
    opennew() {
      this.updatedialog = !this.updatedialog;
    },

    getdoctor_evalte(id) {
      axios
        .post(`api/evaluation-doctors`, {
          evaluation_type: id,
        })
        .then((response) => {
          this.doctors = response.data.doctors;
        });
    },

    getDays(id) {
      this.business_hours =
        this.doctors.find((item) => item.id == id)?.business_hours || [];
    },

    gettimes(e) {
      axios
        .post(`api/users/available/slots`, {
          user_id: this.evalate.specialist_id,
          evaluation_type: this.evalate.evaluation_type,
          date: moment(e).format("Y-MM-DD"),
        })
        .then((response) => {
          this.slots = response.data.slots;
        });
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

    create() {
      axios
        .post(`api/evaluation-request`, {
          child_id: localStorage.getItem("child_id"),
          consultant_id: localStorage.getItem("user_id"),
          evaluation_type: this.evalate.evaluation_type,
          date: moment(this.evalate.date).format("Y-MM-DD"),
          specialist_id: this.evalate?.specialist_id,
          start_time: this.evalate?.Session_time?.start,
          end_time: this.evalate?.Session_time?.end,
        })
        .then((response) => {
          this.updatedialog = !this.updatedialog;
          this.$toast.add({
            severity: "success",
            summary: this.$t("success_message"),
            detail: `${this.$t("element_add_success")}`,
            life: 3000,
          });
          this.$router.push({ name: "children-request" });
        })
        .catch((el) => {
          this.$toast.add({
            severity: "error",
            summary: this.$t("error"),
            detail: `${this.$t("mission_error")}`,
            life: 3000,
          });
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

    getdoctors() {
      axios
        .get(`api/doctors`)
        .then((response) => {
          this.doctors = response.data.doctors;
        })
        .catch((error) => {});
    },
  },

  computed: {
    filteredDays() {
      const usedDays = this.business_hours.map((entry) => entry.day);
      return this.days.filter((day) => !usedDays.includes(day));
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
    this.getdoctors();
    this.child_id = localStorage.getItem("child_id");
  },
};
</script>

<style scoped>
.evaluations-page { padding: 1.25rem; }
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
