<template>
  <div class="be-page">
    <Toast />

    <header class="be-hero">
      <div class="be-hero-main">
        <span class="be-hero-icon"><i class="pi pi-shield" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("barrier_ui.title") }}</h1>
          <p v-if="childName">{{ childName }}</p>
        </div>
      </div>
      <div v-if="started" class="be-hero-progress">
        <b>{{ answeredCount }}/{{ barriers.length }}</b>
        <span>{{ $t("barrier_ui.answered") }}</span>
      </div>
    </header>

    <!-- Opened from the result (?edit=): the same screen with the answers given, until the evaluation is approved. -->
    <EditModeBanner v-if="editing" :status="editing.approval_status" :note="editing.approval_note" />
    <Message v-if="alert_text" severity="error" :closable="false">{{ alert_text }}</Message>

    <!-- 1. Evaluation details -->
    <section class="be-card">
      <div class="be-card-head">
        <span class="be-step">1</span>
        <div>
          <h2>{{ $t("barrier_ui.details") }}</h2>
          <p>{{ $t("barrier_ui.details_hint") }}</p>
        </div>
        <Tag v-if="started" severity="success" icon="pi pi-check" :value="$t('barrier_ui.started')" class="be-started" />
      </div>

      <div class="be-grid">
        <div class="be-field">
          <label>{{ $t("child_name") }}</label>
          <div class="be-readonly"><i class="pi pi-user" aria-hidden="true" /> {{ childName || "—" }}</div>
          <small v-if="error?.child_id" class="be-error">{{ error.child_id[0] }}</small>
        </div>

        <div class="be-field">
          <label for="be-date">{{ $t("date") }}<span class="be-req">*</span></label>
          <DatePicker
            v-model="answer.date"
            inputId="be-date"
            showIcon
            showButtonBar
            :minDate="minDate"
            :disabled="started"
            :placeholder="$t('date')"
            fluid
            @update:model-value="getage"
          />
        </div>

        <div class="be-field">
          <label>{{ $t("age") }}</label>
          <div class="be-readonly">
            <i class="pi pi-hourglass" aria-hidden="true" />
            <template v-if="answer.child_age !== undefined && answer.child_age !== null">
              {{ formatChildAge(null, answer.child_age, $t) }}
            </template>
            <span v-else class="be-muted">{{ $t("barrier_ui.pick_date") }}</span>
          </div>
          <small v-if="error?.child_age" class="be-error">{{ error.child_age[0] }}</small>
        </div>

        <div class="be-field">
          <label>{{ $t("color") }}</label>
          <div class="be-colors" role="radiogroup" :aria-label="$t('color')">
            <button
              v-for="color in colorOptions"
              :key="color"
              type="button"
              role="radio"
              :aria-checked="answer.color === color"
              :aria-label="'#' + color"
              :class="{ selected: answer.color === color }"
              :style="{ backgroundColor: '#' + color }"
              :disabled="Boolean(editing)"
              @click="answer.color = color"
            >
              <i v-if="answer.color === color" class="pi pi-check" aria-hidden="true" />
            </button>
          </div>
          <small class="be-hint">{{ $t("barrier_ui.color_hint") }}</small>
          <small v-if="error?.color" class="be-error">{{ error.color[0] }}</small>
        </div>
      </div>

      <div v-if="!started" class="be-start">
        <Button
          :label="$t('strart_evaluate')"
          icon="pi pi-play"
          :disabled="!answer.date || answer.child_age === undefined"
          :loading="starting"
          data-no-request-spinner
          @click="createevalutae"
        />
      </div>
    </section>

    <!-- 2. The barriers -->
    <template v-if="started">
      <nav class="be-nav" :aria-label="$t('barrier_ui.barriers')">
        <div class="be-progress"><span :style="{ width: progress + '%', background: '#' + answer.color }" /></div>
        <div class="be-chips">
          <a
            v-for="(barrier, ind) in barriers"
            :key="barrier.id"
            :href="'#barrier-' + ind"
            class="be-chip"
            :class="{ 'is-done': selected[ind] !== undefined, 'is-missing': showMissing && selected[ind] === undefined }"
            @click.prevent="scrollTo(ind)"
          >
            <i :class="selected[ind] !== undefined ? 'pi pi-check-circle' : 'pi pi-circle'" aria-hidden="true" />
            {{ ind + 1 }}
          </a>
        </div>
      </nav>

      <section
        v-for="(barrier, ind) in barriers"
        :id="'barrier-' + ind"
        :key="barrier.id"
        class="be-card be-barrier"
        :class="{ 'is-missing': showMissing && selected[ind] === undefined }"
      >
        <header class="be-barrier-head">
          <span class="be-num" :style="selected[ind] !== undefined ? { background: '#' + answer.color, color: '#fff' } : null">{{ ind + 1 }}</span>
          <h3>{{ barrier.title }}</h3>
          <span v-if="selected[ind] !== undefined" class="be-score" :style="{ borderColor: '#' + answer.color }">
            {{ $t("barrier_ui.score") }}: <b>{{ selected[ind] }}</b>
          </span>
        </header>

        <!-- Some barriers take an example: typed above the answers, it shows at once in parentheses in every answer. -->
        <div v-if="takesExample(ind)" class="be-example">
          <label :for="'be-example-' + ind">{{ $t("barrier_ui.example") }}</label>
          <InputText :id="'be-example-' + ind" v-model="examples[ind]" :placeholder="$t('barrier_ui.example_hint')" fluid />
        </div>

        <div class="be-options" role="radiogroup" :aria-label="barrier.title">
          <label
            v-for="question in barrier.options"
            :key="question.id"
            class="be-option"
            :class="{ 'is-picked': selected[ind] === question.index }"
            :style="selected[ind] === question.index ? { '--pick': '#' + answer.color } : null"
          >
            <input
              type="radio"
              class="be-radio"
              :name="'barrier-' + ind"
              :value="question.index"
              :checked="selected[ind] === question.index"
              @change="getscore(ind, question.id, question.subtest_id, question.index)"
            />
            <span class="be-option-score">{{ question.index }}</span>
            <span class="be-option-text">{{ takesExample(ind) ? withExample(question.title, examples[ind]) : question.title }}</span>
          </label>
        </div>

      </section>

      <footer class="be-footer">
        <span class="be-footer-count">
          <i class="pi pi-list-check" aria-hidden="true" />
          {{ $t("barrier_ui.answered_of", { n: answeredCount, total: barriers.length }) }}
        </span>
        <Button :label="editing ? $t('mae_save') : $t('barrier_ui.save')" icon="pi pi-check" :loading="saving" data-no-request-spinner @click="getanswer" />
      </footer>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { getEvaluationTypeLabel } from "../../../utils/evaluationTypes";
import { formatChildAge, toDateOnly } from "../../../utils/childAge";
import EditModeBanner from "../../../components/evaluations/EditModeBanner.vue";

// As the backend's BarrierAnswers: a barrier whose answers carry the {{example}} token takes the evaluator's example.
const EXAMPLE_TOKEN = "{{example}}";

// «(مثال: …)» in place of {{example}}; an answer without the token is left as it is, and so is any answer while
// no example is written.
function withExample(text, example) {
  const value = String(example ?? "").trim();
  return value ? String(text).replaceAll(EXAMPLE_TOKEN, `(مثال: ${value})`) : text;
}

// The colors every evaluation screen offers (VB-MAPP, ABLLS, Carolina use the same ones).
const COLOR_OPTIONS = ["00B8D9", "36B37E", "FFAB00", "FF5630", "6554C0"];

export default {
  components: { EditModeBanner },
  data() {
    return {
      // Editing a saved evaluation (?edit=id) before its approval: { approval_status, approval_note, ... }.
      editing: null,
      alert_text: "",
      change: { status: "1" },
      started: false,
      starting: false,
      saving: false,
      showMissing: false,
      colorOptions: COLOR_OPTIONS,
      // The child is in the URL (/barrier-evaluation/:id); older links relied on the stored child.
      answer: { color: COLOR_OPTIONS[0], child_id: parseInt(this.$route.params.id) || parseInt(localStorage.getItem("child_id")) || null },
      // barrier position -> the chosen option's score
      selected: {},
      // barrier position -> the evaluator's example (only the barriers whose answers carry {{example}})
      examples: {},
      score: [],
      allquestion: [],
      childName: "",
      childGender: "0",
      error: {},
      minDate: new Date(),
    };
  },
  computed: {
    // Each barrier with its options in score order (0-4).
    barriers() {
      return this.allquestion.map((barrier) => ({
        ...barrier,
        options: (barrier.barriers_questiont ?? []).map(question => ({
          ...question,
          title: String(question.wording?.[String(this.childGender) === '1' ? 'female' : 'male'] ?? question.title ?? '').replaceAll('{{name}}', this.childName.trim().split(/\s+/)[0] || ''),
        })).sort((a, b) => Number(a.index) - Number(b.index)),
      }));
    },
    answeredCount() {
      return Object.keys(this.selected).length;
    },
    progress() {
      return this.barriers.length ? Math.round((this.answeredCount / this.barriers.length) * 100) : 0;
    },
  },
  methods: {
    formatChildAge,
    withExample,
    takesExample(ind) {
      return !!this.barriers[ind]?.options?.some((option) => String(option.title ?? "").includes(EXAMPLE_TOKEN));
    },
    createevalutae() {
      this.starting = true;
      axios
        .post(`api/evaluations/create`, {
          type: 3,
          title: getEvaluationTypeLabel(3, this.$t, this.$t("evaluation_results")),
          child_id: this.answer.child_id,
          specialist_id: localStorage.getItem("user_id"),
          // A plain YYYY-MM-DD: a Date object used to be sent and saved as 0000-00-00.
          date: toDateOnly(this.answer.date),
        })
        .then((response) => {
          this.answer.evaluation_id = response.data.evaluation.id;
          this.started = true;
        })
        .catch((el) => {
          this.error = el.response?.data?.errors ?? {};
        })
        .finally(() => {
          this.starting = false;
        });
    },
    getscore(index, question_id, subtest_id, question_index) {
      this.score[index] = { subtest_id, question_id, question_index };
      this.selected = { ...this.selected, [index]: question_index };
    },
    getage() {
      if (!this.answer.date) return;
      axios
        .post("api/milestone-answers/get-age-child", { date: toDateOnly(this.answer.date), child_id: this.answer.child_id })
        .then((response) => {
          this.answer.child_age = response.data;
        });
    },
    getallquestion() {
      axios.get("api/barrier-subtest").then((response) => {
        this.allquestion = response.data.data ?? [];
      });
    },
    // The children list is open to evaluators ("barrier answer create"); the child's own endpoints are not.
    getchild() {
      if (!this.answer.child_id) return;
      axios
        .get("api/child")
        .then(({ data }) => {
          const child = (data?.children ?? []).find((child) => Number(child.id) === this.answer.child_id);
          this.childName = child?.name ?? "";
          this.childGender = child?.gender ?? "0";
        })
        .catch(() => {});
    },
    // The saved evaluation on this screen: its details, and every barrier with the answer and example given.
    async loadEdit() {
      try {
        const [{ data: subtests }, { data: edit }] = await Promise.all([
          axios.get("api/barrier-subtest"),
          axios.get(`api/barrier-answer/evaluation/${this.$route.query.edit}/edit`),
        ]);
        const { evaluation, child, barriers } = edit.data;
        this.editing = evaluation;
        this.childName = child?.name ?? "";
        this.childGender = child?.gender ?? "0";
        this.answer = {
          ...this.answer, child_id: child?.id ?? this.answer.child_id, evaluation_id: evaluation.id,
          date: evaluation.date ? new Date(evaluation.date) : new Date(), child_age: evaluation.child_age,
          color: evaluation.color || this.answer.color,
        };
        this.minDate = null;
        const saved = Object.fromEntries(barriers.map((barrier) => [barrier.subtest_id, barrier]));
        // The barriers the evaluation answered, in the screen's order.
        this.allquestion = (subtests.data ?? []).filter((subtest) => saved[subtest.id]);
        this.allquestion.forEach((subtest, ind) => {
          const option = (subtest.barriers_questiont ?? []).find((item) => Number(item.index) === saved[subtest.id].score);
          this.score[ind] = { subtest_id: subtest.id, question_id: option?.id, question_index: saved[subtest.id].score };
          this.selected[ind] = saved[subtest.id].score;
          if (saved[subtest.id].example) this.examples[ind] = saved[subtest.id].example;
        });
        this.started = true;
      } catch (error) {
        this.alert_text = error.response?.data?.message || this.$t("request_failed_retry");
      }
    },
    saveEdit() {
      this.saving = true;
      const answers = this.barriers.map((barrier, ind) => ({
        subtest_id: barrier.id, score: Number(this.selected[ind]), example: this.takesExample(ind) ? this.examples[ind] || null : null,
      }));
      axios
        .put(`api/barrier-answer/evaluation/${this.answer.evaluation_id}/edit`, { answers })
        .then(() => {
          this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: this.$t("mae_saved"), life: 2500 });
          this.$router.push({ name: "barrier-resulte", params: { id: this.answer.child_id } });
        })
        .catch((error) => {
          this.alert_text = Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || this.$t("request_failed_retry");
        })
        .finally(() => {
          this.saving = false;
        });
    },
    scrollTo(ind) {
      document.getElementById("barrier-" + ind)?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    getanswer() {
      const missing = this.barriers.findIndex((_, ind) => this.selected[ind] === undefined);
      if (missing !== -1) {
        this.showMissing = true;
        this.alert_text = this.$t("answer_all_questions");
        this.scrollTo(missing);
        setTimeout(() => (this.alert_text = ""), 3000);
        return;
      }
      if (this.editing) return this.saveEdit();
      this.saving = true;
      this.answer.scores = this.score.map((score, ind) => (score && this.takesExample(ind) ? { ...score, example: this.examples[ind] || null } : score));
      const payload = { ...this.answer, date: toDateOnly(this.answer.date) };
      // The request being closed: the one opened from the requests list (same id either way).
      const requestId = this.$route.query.requestId || localStorage.getItem("eavl_id");
      axios
        .post("/api/barrier-answer", payload)
        .then(() => {
          if (requestId) axios.post(`/api/evaluation-request/change-status/${requestId}`, this.change);
          this.$router.push({ name: "barrier-resulte", params: { id: this.answer.child_id } });
        })
        .catch(() => {
          this.alert_text = this.$t("answer_all_questions");
          setTimeout(() => (this.alert_text = ""), 3000);
        })
        .finally(() => {
          this.saving = false;
        });
    },
  },
  mounted() {
    if (this.$route.query.edit) {
      this.loadEdit();
      return;
    }
    this.getchild();
    this.getallquestion();
  },
};
</script>

<style scoped>
.be-page {
  display: grid;
  gap: 1rem;
}

.be-hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--sawa-radius);
  background: linear-gradient(135deg, var(--sawa-primary) 0%, #1b7c86 100%);
  color: #fff;
  box-shadow: 0 8px 24px -12px rgba(19, 92, 101, 0.55);
}
.be-hero-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.be-hero-icon {
  display: grid;
  place-items: center;
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 1.35rem;
}
.be-hero h1 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
}
.be-hero p {
  margin: 0.15rem 0 0;
  opacity: 0.9;
}
.be-hero-progress {
  display: grid;
  min-width: 6rem;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
  text-align: center;
}
.be-hero-progress b {
  font-size: 1.25rem;
}
.be-hero-progress span {
  font-size: 0.75rem;
  opacity: 0.85;
}

.be-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  box-shadow: var(--sawa-shadow);
  scroll-margin-top: calc(var(--header-h, 64px) + 8rem);
}
.be-card-head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid #f1f5f9;
}
.be-card-head h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}
.be-card-head p {
  margin: 0.15rem 0 0;
  color: var(--sawa-muted);
  font-size: 0.85rem;
}
.be-started {
  margin-inline-start: auto;
}
.be-step {
  display: grid;
  place-items: center;
  flex: none;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-weight: 800;
}
.be-grid {
  display: grid;
  gap: 1rem 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}
.be-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.be-field > label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
}
.be-req {
  color: #dc2626;
  margin-inline-start: 0.15rem;
}
.be-readonly {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.65rem;
  padding: 0 0.8rem;
  border: 1px solid var(--sawa-border);
  border-radius: 6px;
  background: #f8fafc;
  font-weight: 600;
}
.be-readonly .pi {
  color: var(--sawa-muted);
}
.be-muted {
  color: var(--sawa-muted);
  font-weight: 400;
}
.be-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.be-colors button {
  display: grid;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  border: 3px solid transparent;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.be-colors button:hover {
  transform: scale(1.06);
}
.be-colors button.selected {
  border-color: #fff;
  box-shadow: 0 0 0 2px #1e293b;
}
.be-hint {
  color: var(--sawa-muted);
  font-size: 0.8rem;
}
.be-error {
  color: #dc2626;
  font-size: 0.82rem;
}
.be-start {
  display: flex;
  justify-content: flex-end;
}
.be-start .p-button {
  min-width: 12rem;
}

/* progress + quick navigation */
.be-nav {
  position: sticky;
  /* below the dashboard's fixed header */
  top: calc(var(--header-h, 64px) + 0.5rem);
  z-index: 5;
  display: grid;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  box-shadow: 0 6px 16px -10px rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(4px);
}
.be-progress {
  height: 6px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}
.be-progress span {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.25s;
}
.be-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.be-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border: 1px solid var(--sawa-border);
  border-radius: 999px;
  background: #fff;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
}
.be-chip .pi {
  font-size: 0.8rem;
}
.be-chip.is-done {
  border-color: #86efac;
  background: #f0fdf4;
  color: #15803d;
}
.be-chip.is-missing {
  border-color: #fca5a5;
  background: #fef2f2;
  color: #b91c1c;
}

/* a barrier */
.be-barrier.is-missing {
  border-color: #fca5a5;
  box-shadow: 0 0 0 3px #fee2e2;
}
.be-barrier-head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.be-barrier-head h3 {
  flex: 1;
  margin: 0.2rem 0 0;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.6;
  color: var(--sawa-text);
}
.be-num {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 10px;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
  font-weight: 800;
  transition: background-color 0.15s;
}
.be-score {
  flex: none;
  padding: 0.2rem 0.7rem;
  border: 2px solid;
  border-radius: 999px;
  font-size: 0.82rem;
  white-space: nowrap;
}
.be-example { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: .4rem .75rem; margin-bottom: .9rem; padding-bottom: .9rem; border-bottom: 1px dashed var(--sawa-border); }
@media (max-width: 640px) { .be-example { grid-template-columns: 1fr; } }
.be-example label { font-weight: 700; font-size: .9rem; }
.be-options {
  display: grid;
  gap: 0.5rem;
}
.be-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border: 1.5px solid var(--sawa-border);
  border-radius: 10px;
  background: #fbfcfd;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}
.be-option:hover {
  border-color: #b6d7db;
  background: #fff;
}
.be-option.is-picked {
  border-color: var(--pick);
  background: color-mix(in srgb, var(--pick) 9%, #fff);
}
.be-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.be-option:has(.be-radio:focus-visible) {
  outline: 2px solid var(--sawa-primary);
  outline-offset: 2px;
}
.be-option-score {
  display: grid;
  place-items: center;
  flex: none;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  background: #fff;
  color: #475569;
  font-weight: 800;
}
.be-option.is-picked .be-option-score {
  border-color: var(--pick);
  background: var(--pick);
  color: #fff;
}
.be-option-text {
  padding-top: 0.2rem;
  line-height: 1.7;
}

.be-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  box-shadow: 0 -6px 16px -12px rgba(15, 23, 42, 0.35);
}
.be-footer-count {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--sawa-muted);
  font-weight: 600;
}
.be-footer .p-button {
  min-width: 11rem;
}
</style>
