<template>
  <div></div>
  <div class="sawa-card">
    <div>
      <Message v-if="alert_text" severity="error" class="mb-3">{{
        alert_text
      }}</Message>

      <form
        style="max-height: 80vh; overflow-y: scroll"
        ref="form"
        @submit.prevent="getanswer"
        class="p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <!-- ... existing code ... -->


        <div class="flex flex-column gap-2">
          <label for="username">{{ $t("child_name") }}</label>
          <Select
            filter
            required
            disabled
            v-model="answer.child_id"
            option-value="id"
            :options="childs"
            optionLabel="name"
            :placeholder="$t('child_name')"
            class="w-full"
          />
          <div class="mt-1 mb-5 text-red-500" v-if="error?.child_id">
            {{ error.child_id[0] }}
          </div>
        </div>

        <div v-if="answer.child_id" class="flex flex-column gap-2">
          <label for="username">{{ $t("date") }}</label>
          <DatePicker
            :disabled="strart_evaluate"
            @update:model-value="getage"
            style="width: 100%"
            showButtonBar
            v-model.number="answer.date"
            showIcon
            :placeholder="$t('date')"
          />
          <div class="mt-1 mb-5 text-red-500" v-if="error?.child_age">
            {{ error.child_age[0] }}
          </div>
        </div>
        <div v-if="answer.date" class="flex flex-column gap-2">
          <label for="username">{{ $t("age") }}</label>
          <InputNumber
            readonly
            required
            v-model="answer.child_age"
            :placeholder="$t('age')"
          />
          <div class="mt-1 mb-5 text-red-500" v-if="error?.child_age">
            {{ error.child_age[0] }}
          </div>
        </div>

        <!-- <div  v-if="answer.child_id" class="flex flex-column gap-2">
                  <label for="username">{{ $t('score') }}</label>
                  
                  <InputNumber  :min="0" :max=".9" required inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="5" v-model="answer.score" :placeholder='$t("score")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.score">{{ error.score[0] }}</div>
              </div> 
              -->

        <!-- 
              <div  v-if="answer.child_id" class="flex flex-column gap-2">
                  <label for="username">{{ $t('notes') }}</label>
                  <InputText style="width: 100% !important; max-height: 50px !important;;"  v-model="answer.notes"  :placeholder='$t("notes")' />
  
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.notes">{{ error.notes[0] }}</div>
              </div>  -->
        <div
          v-if="answer.child_id && answer.child_age != null"
          class="flex flex-column gap-2"
        >
          <label style="visibility: hidden">{{ $t("strart_evaluate") }}</label>
          <Button
            @click="createevalutae"
            :loading="starting"
            :disabled="questionsLoading || !selectedLevelGroups.length || strart_evaluate"
            class="w-full"
            :label="$t('strart_evaluate')"
          ></Button>
        </div>

        <Message v-if="questionsLoading" class="lg:col-span-2">{{ $t('loading') }}</Message>
        <Message v-else-if="answer.child_age != null && !allquestion.length" severity="warn" class="lg:col-span-2">{{ $t('no_records_found') }}</Message>
        <fieldset v-if="!questionsLoading && levelGroups.length" class="level-picker lg:col-span-2" :disabled="strart_evaluate || starting">
          <legend>{{ $t('milestone_choose_levels') }}</legend>
          <p>{{ $t('milestone_choose_levels_hint') }}</p>
          <div class="level-picker-options">
            <label v-for="level in levelGroups" :key="level.id">
              <Checkbox v-model="selectedLevelIds" :value="level.id" />
              <span>{{ level.title }}</span>
            </label>
          </div>
        </fieldset>
        <template v-if="strart_evaluate">
          <!-- What each answer means and how it shows in the results chart. -->
          <div class="score-legend lg:col-span-2">
            <span class="score-legend-title">{{ $t("milestone_score_legend") }}</span>
            <span v-for="score in [0, 0.5, 1]" :key="score" class="score-legend-item">
              <span class="score-box" :class="'score-box-' + String(score).replace('.', '_')" aria-hidden="true"><i /><i /></span>
              {{ $t('milestone_score_box_' + String(score).replace('.', '_')) }}
            </span>
          </div>
          <!-- Each level is its own card with its own color; answers are saved with their level's color. -->
          <section v-for="level in selectedLevelGroups" :key="level.id" class="milestone-level lg:col-span-2"
            :style="{ '--level-color': '#' + levelColor(level.id) }">
            <header class="milestone-level-header">
              <h2>{{ level.title }}</h2>
              <div class="milestone-level-colors">
                <span>{{ $t("color") }}</span>
                <!-- The color of the last evaluation in this level is locked, so the report tells the tests apart. -->
                <button v-for="color in colorOptions" :key="color" type="button"
                  :class="{ selected: levelColor(level.id) === color, blocked: isBlockedColor(level.id, color) }"
                  :style="{ backgroundColor: '#' + color }" :disabled="isBlockedColor(level.id, color)"
                  :title="isBlockedColor(level.id, color) ? $t('milestone_color_used_last') : ''"
                  :aria-label="'#' + color + (isBlockedColor(level.id, color) ? ' — ' + $t('milestone_color_used_last') : '')"
                  @click="setLevelColor(level.id, color)"></button>
              </div>
            </header>
            <template v-for="block in level.blocks" :key="block.key">
              <!-- The EESA domain is scored through its form, once in each level, in the domain's place. -->
              <section v-if="block.eesa" class="milestone-domain">
                <h3 class="milestone-domain-title">{{ eesa.domain?.title }}</h3>
                <div class="eesa-wrap">
                  <Message v-if="eesaInvalidLevels.includes(level.id)" severity="error" :closable="false">{{ $t('eesa_invalid_boxes') }}</Message>
                  <EesaForm :modelValue="eesaBoxes[level.id] || {}" @update:modelValue="setEesaBoxes(level.id, $event)"
                    :previous="block.eesa.previous" :disabled="saving" />
                </div>
              </section>
              <section v-else class="milestone-domain">
                <h3 class="milestone-domain-title">{{ block.title }}</h3>
                <section v-for="goal in block.goals" :key="goal.id" class="milestone-goal">
                  <h4>{{ goal.title }}</h4>
                  <div v-for="question in goal.questions" :key="question.id" class="milestone-question">
                    <p>{{ question.title }}</p>
                    <div class="milestone-scores">
                      <!-- Each answer with the box it draws in the results chart: 0 empty, 0.5 lower half, 1 full. -->
                      <label v-for="score in [0, 0.5, 1]" :key="score" :title="$t('milestone_score_box_' + String(score).replace('.', '_'))">
                        <input type="radio" required :name="'question-' + question.id" :value="score"
                          @change="collectanswer($event, question.id)" />
                        <span>{{ score }}</span>
                        <span class="score-box" :class="'score-box-' + String(score).replace('.', '_')" aria-hidden="true">
                          <i /><i />
                        </span>
                      </label>
                    </div>
                  </div>
                </section>
              </section>
            </template>
          </section>
        </template>
        <div v-if="strart_evaluate" class="flex flex-column gap-2">
          <label for="milestone-program">{{
            $t("milestone_target_program")
          }}</label>
          <Select
            inputId="milestone-program"
            v-model="answers.student_program_id"
            :options="programs"
            :optionLabel="programLabel"
            optionValue="id"
            filter
            showClear
            :placeholder="$t('milestone_target_program')"
          />
          <small v-if="!programs.length">{{
            $t("milestone_no_programs")
          }}</small>
          <p v-if="error.student_program_id" class="text-red-600">
            {{ error.student_program_id[0] }}
          </p>
        </div>
        <div v-if="strart_evaluate" class="flex flex-column gap-2 w-full">
          <label style="visibility: hidden" for="username">{{
            $t("gruop_sessaion")
          }}</label>
          <Button
            type="submit"
            :loading="saving"
            :disabled="saving"
            class="m-auto w-full"
            :label="$t('submit')"
          />
          <small id="username-help"></small>
        </div>
      </form>
      <Toast />
      <!-- ... existing code ... -->
    </div>
  </div>
</template>

<script>
import { getEvaluationTypeLabel } from "../../../utils/evaluationTypes";
import axios from "axios";
import moment from "moment";
import { resetUserProfile } from "../../../components/profile/userProfile";
import InputNumber from "primevue/inputnumber";
import EvaluationType from "../../../components/EvaluationType.vue";
import EesaForm from "../../../components/milestone/EesaForm.vue";
import { eesaInvalidKeys, eesaScores } from "../../../utils/eesa";
import { useToast } from "primevue/usetoast";
export default {
  components: { EvaluationType, EesaForm },

  data() {
    return {
      change: {
        status: "1",
      },
      strart_evaluate: false,
      alert_text: "",
      answers: {
        student_program_id: null,
        answers: [],
      },
      programs: [],
      saving: false,
      questionsLoading: false,
      starting: false,
      type: 2,

      answer: {},
      allquestion: [],
      levels: [],
      selectedLevelIds: [],
      colorOptions: ["00B8D9", "36B37E", "FFAB00", "FF5630", "6554C0"],
      // level id -> chosen color (hex without #)
      levelColors: {},
      // level id -> the color the child's last evaluation used in that level (not allowed again)
      lastColors: {},
      // The EESA form, when the child's levels include its domain.
      // levels: [{ level_id, title, previous }], one form per level.
      eesa: { show: false, domain: null, levels: [] },
      // level id -> { g1_1: "1", ... }
      eesaBoxes: {},
      childs: [],
      qustions: {},
      error: {},
      maxDate: new Date(),
      notanswer: [],

      // Add other validation rules for the title field
    };
  },

  computed: {
    selectedLevelGroups() {
      return this.levelGroups.filter(level => this.selectedLevelIds.map(String).includes(String(level.id)))
    },
    selectedEesaLevels() {
      return this.eesa.levels.filter(level => this.selectedLevelIds.map(String).includes(String(level.level_id)))
    },
    eesaInvalidLevels() {
      return this.selectedEesaLevels
        .filter((level) => eesaInvalidKeys(this.eesaBoxes[level.level_id] || {}).length)
        .map((level) => level.level_id);
    },
    levelGroups() {
      const titles = new Map(this.levels.map(level => [level.id, level.title]))
      const levels = new Map()
      for (const question of this.allquestion) {
        const levelId = question.subtest?.level_id ?? 'other'
        if (!levels.has(levelId)) levels.set(levelId, { id: levelId, title: titles.get(levelId), domains: new Map() })
        const level = levels.get(levelId)
        const domainId = question.question_type_id ?? 'other'
        if (!level.domains.has(domainId)) level.domains.set(domainId, { id: domainId, title: question.question_type?.title || this.$t('milestone_domains'), goals: new Map() })
        const domain = level.domains.get(domainId)
        const goalId = question.subtest_id
        if (!domain.goals.has(goalId)) domain.goals.set(goalId, { id: goalId, title: question.subtest?.title || this.$t('milestone_general_goals'), questions: [] })
        domain.goals.get(goalId).questions.push(question)
      }
      const order = new Map(this.levels.map((level, index) => [level.id, index]))
      const eesaDomainId = Number(this.eesa.domain?.id)
      return [...levels.values()]
        .sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity))
        .map((level, index) => {
          const blocks = [...level.domains.values()].map(domain => ({ ...domain, key: 'domain-' + domain.id, goals: [...domain.goals.values()] }))
          // The EESA sits where its domain falls in the domain order (before the first domain numbered after it).
          const eesa = this.eesa.levels.find(item => item.level_id === level.id)
          if (eesa) {
            const at = blocks.findIndex(block => Number(block.id) > eesaDomainId)
            blocks.splice(at === -1 ? blocks.length : at, 0, { key: 'eesa', eesa })
          }
          return { ...level, title: level.title || this.$t('level_n', { n: index + 1 }), blocks }
        })
    },
    questionLevels() {
      return Object.fromEntries(this.allquestion.map(question => [question.id, question.subtest?.level_id ?? 'other']))
    },
  },
  methods: {
    // ... existing methods ...
    Therapeutic() {
      this.$router.push({ name: "answer" });
    },

    programLabel(option) {
      if (!option) return "";
      return option.program?.name || option.name || "";
    },
    // Until one is chosen, each level gets a different default color.
    levelColor(levelId) {
      if (this.levelColors[levelId] && !this.isBlockedColor(levelId, this.levelColors[levelId])) return this.levelColors[levelId];
      const index = Math.max(0, this.levelGroups.findIndex(level => level.id === levelId));
      const free = this.colorOptions.filter(color => !this.isBlockedColor(levelId, color));
      return free[index % free.length] ?? this.colorOptions[index % this.colorOptions.length];
    },
    isBlockedColor(levelId, color) {
      return String(this.lastColors[levelId] ?? '').toUpperCase() === String(color).toUpperCase();
    },
    setEesaBoxes(levelId, boxes) {
      this.eesaBoxes = { ...this.eesaBoxes, [levelId]: boxes };
    },
    setLevelColor(levelId, color) {
      if (this.isBlockedColor(levelId, color)) return;
      this.levelColors = { ...this.levelColors, [levelId]: color };
    },
    submit() {},
    async createevalutae() {
      if (this.starting || this.strart_evaluate || this.questionsLoading || !this.selectedLevelGroups.length) return
      this.starting = true
      this.error = {}
      try {
        const { data } = await axios.post('api/evaluations/create', {
          type: this.type, title: getEvaluationTypeLabel(this.type, this.$t, this.$t("evaluation_results")), child_id: this.answer.child_id,
          specialist_id: localStorage.getItem('user_id'),
          date: moment(this.answer.date).format('YYYY-MM-DD'),
        })
        this.answer.evaluation_id = data.evaluation.id
        this.strart_evaluate = true
      } catch (error) {
        this.error = error.response?.data?.errors || {}
        this.alert_text = error.response?.data?.message || this.$t('request_failed_retry')
      } finally { this.starting = false }
    },
    anserdata(id, val) {
      console.log(id);
      console.log(val);
    },
    async getage() {
      if (!this.answer.date || this.strart_evaluate) return
      this.questionsLoading = true
      this.allquestion = []
      this.selectedLevelIds = []
      this.alert_text = ''
      try {
        const { data: age } = await axios.post('api/milestone-answers/get-age-child', {
          date: moment(this.answer.date).format('YYYY-MM-DD'), child_id: this.answer.child_id,
        })
        this.answer.child_age = Number(age)
        const [{ data }, { data: eesa }] = await Promise.all([
          axios.get(`api/milestone-answers/sub-goals/${age}`, { params: { child_id: this.answer.child_id } }),
          // Without the EESA endpoint (older server) the evaluation still loads, just without the form.
          axios.get(`api/milestone-answers/eesa/${age}`, { params: { child_id: this.answer.child_id } }).catch(() => ({ data: null })),
        ])
        this.allquestion = Array.isArray(data) ? data : (data.data || [])
        // An older server returns one form without levels: it belongs to the first level.
        const eesaLevels = Array.isArray(eesa?.levels) ? eesa.levels
          : eesa?.show ? [{ level_id: this.allquestion[0]?.subtest?.level_id, previous: eesa.previous ?? [] }] : []
        this.eesa = { show: eesaLevels.length > 0, domain: eesa?.domain ?? null, levels: eesaLevels }
        this.eesaBoxes = {}
      } catch (error) {
        this.alert_text = error.response?.data?.message || this.$t('request_failed_retry')
      } finally { this.questionsLoading = false }
    },

    collectanswer(e, id) {
      this.answers.answers[id] = {
        question_id: id,
        score: e.target.value,
        child_id: this.answer.child_id,
        date: moment(this.answer.date).format("YYYY-MM-DD"),
        child_age: this.answer.child_age,
        evaluation_id: this.answer.evaluation_id,
      };
      console.log(this.answers.answers);
    },

    async getanswer() {
      if (this.saving || !this.selectedLevelGroups.length) return;
      if (this.eesaInvalidLevels.length) {
        this.alert_text = this.$t('eesa_invalid_boxes');
        return;
      }
      this.saving = true;
      this.error = {};
      try {
        const answers = this.answers.answers
          .filter(answer => answer && this.selectedLevelIds.map(String).includes(String(this.questionLevels[answer.question_id])))
          .map((answer) => ({ ...answer, color: this.levelColor(this.questionLevels[answer.question_id]) }));
        await axios.post("/api/milestone-answers", {
          student_program_id: this.answers.student_program_id,
          request_id: this.$route.query.requestId || null,
          answers,
          selected_level_ids: this.selectedLevelIds,
          ...(this.selectedEesaLevels.length ? {
            eesa: { levels: Object.fromEntries(this.selectedEesaLevels.map((level) => [level.level_id, eesaScores(this.eesaBoxes[level.level_id] || {})])) },
          } : {}),
        });
        resetUserProfile();
        await this.$router.push({
          name: "milestone-resulte",
          params: {
            id: this.answer.child_id,
            evla_id: this.answer.evaluation_id,
          },
        });
      } catch (error) {
        this.error = error.response?.data?.errors || {};
        this.alert_text =
          Object.values(this.error).flat().join(" ") ||
          (error.response?.status === 422 && error.response?.data?.data?.level_id ? this.$t("milestone_color_used_last_error") : "") ||
          this.$t("request_failed_retry");
      } finally {
        this.saving = false;
      }
    },
    getusers() {
      axios.get("api/child").then((response) => {
        console.log(localStorage.getItem("child_id"));
        this.childs = response.data.children;
        this.answer.child_id = Number(this.$route.params.id || localStorage.getItem("child_id"));
        this.answer.date = new Date();
        this.getage();
        // Without the endpoint (older server) every color stays available.
        axios
          .get(`api/milestone-answers/last-colors/${this.answer.child_id}`)
          .then(({ data }) => { this.lastColors = data?.levels ?? {}; })
          .catch(() => {});
        axios
          .get("api/mileston-levels")
          .then(({ data }) => {
            const levels = data?.data?.data ?? data?.data ?? [];
            this.levels = Array.isArray(levels) ? levels : [];
          })
          .catch(() => {});
        axios
          .get(`/api/milestone-answers/programs/${this.answer.child_id}`)
          .then(({ data }) => {
            const nextPrograms = Array.isArray(data)
              ? data
              : data?.data ?? data?.programs ?? [];
            this.programs = Array.isArray(nextPrograms) ? nextPrograms : [];
          })
          .catch(() => {
            this.alert_text = this.$t("request_failed_retry");
          });
        this.answer.evaluation_id = parseInt(this.$route.params.evaluation);
      });
    },

    createtreatment() {
      axios
        .post("/api/milestone-answers/check/answers", {
          child_id: this.answer.child_id,
          level_id: this.answer.level_id,
        })
        .then((res) => {
          console.log(res.data.data);
          this.notanswer = res.data.data;
          if (this.notanswer == "") {
            this.$toast.add({
              severity: "success",
              summary: this.$t("success_message"),
              detail: this.$t("successful"),
              life: 3000,
            });
          }
        })
        .catch((el) => {
          console.log(el.response.data.errors.name);
          this.error = el.response.data.errors;
        });
    },
  },
  mounted() {
    this.getusers();
  },
};
</script>

<style scoped>
.level-picker { border: 1px solid var(--sawa-border); border-radius: 12px; padding: 1rem; }
.level-picker legend { font-weight: 700; color: var(--sawa-primary); }
.level-picker p { margin: 0 0 .75rem; color: var(--sawa-muted); }
.level-picker-options { display: flex; flex-wrap: wrap; gap: 1rem; }
.level-picker-options label { display: flex; align-items: center; gap: .5rem; cursor: pointer; }
.level-picker:disabled .level-picker-options label { cursor: default; }
.milestone-level { border: 2px solid var(--level-color); border-radius: 16px; overflow: hidden; }
.milestone-level-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .75rem; padding: 1rem 1.25rem; background: var(--level-color); color: #fff; }
.milestone-level-header h2 { margin: 0; font-weight: 700; font-size: 1.25rem; }
.milestone-level-colors { display: flex; align-items: center; gap: .4rem; padding: .35rem .6rem; border-radius: 10px; background: rgba(255, 255, 255, .9); color: #333; }
.milestone-level-colors span { font-size: .85rem; margin-inline-end: .25rem; }
.milestone-level-colors button { width: 26px; height: 26px; border-radius: 6px; border: 2px solid transparent; cursor: pointer; transition: transform .15s; }
.milestone-level-colors button:hover { transform: scale(1.1); }
.milestone-level-colors button.selected { border-color: #333; box-shadow: 0 0 0 2px #fff inset; }
/* The last evaluation's color: crossed out and not clickable. */
.milestone-level-colors button.blocked { position: relative; cursor: not-allowed; opacity: .35; transform: none; }
.milestone-level-colors button.blocked::after { content: ""; position: absolute; inset: 45% -2px auto; height: 2px; background: #333; transform: rotate(-45deg); }
.milestone-domain { border: 1px solid var(--sawa-border); border-radius: 16px; overflow: hidden; }
.milestone-level .milestone-domain { border: 0; border-radius: 0; }
.milestone-level .milestone-domain + .milestone-domain { border-top: 1px solid var(--sawa-border); }
.milestone-domain-title { margin: 0; padding: .85rem 1.25rem; color: var(--sawa-primary); background: #edf7f5; font-weight: 700; font-size: 1.1rem; }
.eesa-wrap { display: grid; gap: .75rem; padding: 1rem; }
.milestone-domain h2 { margin: 0; padding: 1rem 1.25rem; color: var(--sawa-primary); background: #edf7f5; font-weight: 700; font-size: 1.15rem; }
.milestone-goal { padding: 1rem 1.25rem; }
.milestone-goal h4 { margin-bottom: .75rem; font-weight: 700; }
.milestone-question { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--sawa-border); padding: 1rem 0; }
.milestone-question p { flex: 1 1 20rem; }
.milestone-scores { display: flex; gap: .6rem; }
.milestone-scores label { display: flex; align-items: center; gap: .4rem; padding: .5rem .8rem; border: 1px solid var(--sawa-border); border-radius: 8px; cursor: pointer; }
.score-legend { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem 1.25rem; padding: .75rem 1rem; border: 1px dashed var(--sawa-border); border-radius: 12px; background: #f8fafc; color: #334155; font-size: .9rem; }
.score-legend-title { font-weight: 700; color: var(--sawa-primary, #135c65); }
.score-legend-item { display: inline-flex; align-items: center; gap: .45rem; }
/* The chart box for each answer, in the level's color: upper half for 1, lower half for 0.5 and 1. */
.score-box { display: grid; grid-template-rows: 1fr 1fr; width: 22px; height: 22px; margin-inline-start: .15rem; border: 1.5px solid var(--level-color, #135c65); background: #fff; }
.score-box i + i { border-top: 1px dotted var(--level-color, #135c65); }
.score-box-0_5 i:last-child,
.score-box-1 i { background: var(--level-color, #135c65); }
.score-box-1 i + i { border-top-color: rgba(255, 255, 255, .7); }

/* Add custom styles for the name input field */
.name-input {
  height: 70vh;
  margin: auto !important;
  overflow-y: scroll;
  width: 100%;
  position: relative;
  background-color: #e7e7e7;
  padding: 10px;
  margin-bottom: 15px !important;
  border-radius: 10px;
}
.name-input::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.name-input {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.name-input {
  width: 606px;
}

.seed {
  width: 600px;

  margin: auto !important;
  background-color: #135c65;
  display: block;
  color: white;

  /* Set the width to 606px */
}

.custom-select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background-color: #f8f8f8;
  color: #333;
  appearance: none;
  /* Remove default arrow in some browsers */
  -webkit-appearance: none;
  /* Remove default arrow in Chrome and Safari */
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 20px auto;
  /* Adjust margin as needed */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  display: flex;
  align-items: center;
  color: #ff0000;
  /* Red color for errors */
  margin-top: 5px;
  font-size: 0.9em;
}

.error-icon {
  margin-right: 5px;
  /* Add styles for your error icon */
}

@media (max-width: 768px) {
  .name-input,
  .custom-select,
  .error-message {
    width: 100%;
    /* Full width on smaller screens */
    margin-bottom: 15px;
  }

  .v-btn {
    width: 100%;
    /* Full width button */
    padding: 12px;
    /* Larger touch target */
  }

  .error-message {
    font-size: 0.8em;
    /* Adjust font size */
  }
}

/* Add additional CSS for animation or other styling as needed */

/* Add any other custom styles here */
</style>
