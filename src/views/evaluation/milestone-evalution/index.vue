<template>
  <div></div>
  <div class="sawa-card">
    <div>
      <!-- Opened from the result (?edit=): the same screen with the answers given, until the evaluation is approved. -->
      <EditModeBanner v-if="editing" class="mb-3" :status="editing.approval_status" :note="editing.approval_note" />
      <Message v-if="alert_text" severity="error" class="mb-3">{{
        alert_text
      }}</Message>

      <form
        style="max-height: 80vh; overflow-y: scroll"
        ref="form"
        @submit.prevent="getanswer"
        class="p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <!-- Continuing an evaluation that still misses levels: what was done, and only the missing levels below. -->
        <Message v-if="continuing" severity="info" :closable="false" class="lg:col-span-2">
          <p class="m-0">{{ $t("milestone_continuing", { date: day(continuing.date) }) }}</p>
          <p v-if="doneLevels.length" class="mt-2 mb-0">
            {{ $t("milestone_done_levels") }}
            <span v-for="(level, i) in doneLevels" :key="level.level_id">
              <span v-if="i">، </span>{{ $t("milestone_level_on", { level: level.title, date: level.date }) }}
            </span>
          </p>
        </Message>
        <!-- The kind of evaluation chosen in the dialog: new (every question) or continuing the last one. -->
        <Message v-else-if="mode && lastEvaluation && !editing" :severity="mode === 'continue' ? 'info' : 'secondary'" :closable="false" class="lg:col-span-2">
          <div class="mode-banner">
            <span>{{ mode === 'continue' ? $t('milestone_mode_continue_on', { date: day(lastEvaluation.date) }) : $t('milestone_mode_new_on') }}</span>
            <Button v-if="!strart_evaluate" size="small" variant="text" icon="pi pi-sync" :label="$t('milestone_mode_change')" @click="modeDialog = true" />
          </div>
        </Message>

        <!-- Before a new evaluation of a child who has one already: start over, continue the last one, or finish the
             levels an unfinished evaluation still misses. -->
        <Dialog v-model:visible="modeDialog" modal :closable="Boolean(mode)" :header="$t('milestone_mode_title')" :style="{ width: 'min(36rem, 94vw)' }">
          <div class="mode-options">
            <button type="button" class="mode-option" @click="chooseMode('new')">
              <i class="pi pi-plus-circle" aria-hidden="true" />
              <span><b>{{ $t('milestone_mode_new') }}</b><small>{{ $t('milestone_mode_new_hint') }}</small></span>
            </button>
            <button v-if="lastEvaluation" type="button" class="mode-option" @click="chooseMode('continue')">
              <i class="pi pi-forward" aria-hidden="true" />
              <span><b>{{ $t('milestone_mode_continue', { date: day(lastEvaluation.date) }) }}</b><small>{{ $t('milestone_mode_continue_hint') }}</small></span>
            </button>
            <button v-for="item in pending" :key="item.evaluation_id" type="button" class="mode-option" @click="continueEvaluation(item.evaluation_id)">
              <i class="pi pi-hourglass" aria-hidden="true" />
              <!-- Several can share a date: each tells what it already has, who evaluated it, and its number. -->
              <span>
                <b>{{ $t('milestone_mode_missing', { date: day(item.date) }) }}</b>
                <small>{{ $t('milestone_mode_missing_hint', { levels: missingTitles(item) }) }}</small>
                <small v-if="doneTitles(item)">{{ $t('milestone_mode_missing_done', { levels: doneTitles(item) }) }}</small>
                <small class="mode-option-id">{{ $t('milestone_mode_evaluation_no', { id: item.evaluation_id }) }}</small>
              </span>
            </button>
          </div>
        </Dialog>

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
        <!-- One color for the whole evaluation (all its levels, also when continued); the last evaluation's color is locked. -->
        <div v-if="answer.child_id && answer.child_age != null" class="flex flex-column gap-2">
          <label>{{ $t("color") }}</label>
          <div class="milestone-colors">
            <button v-for="option in colorOptions" :key="option" type="button"
              :class="{ selected: color === option, blocked: isBlockedColor(option) }"
              :style="{ backgroundColor: '#' + option }" :disabled="isBlockedColor(option) || colorLocked || strart_evaluate"
              :title="isBlockedColor(option) ? $t('milestone_color_used_last') : ''"
              :aria-label="'#' + option + (isBlockedColor(option) ? ' — ' + $t('milestone_color_used_last') : '')"
              @click="color = option"></button>
          </div>
          <small v-if="colorLocked" class="text-gray-500">{{ $t("milestone_color_kept") }}</small>
        </div>
        <div
          v-if="answer.child_id && answer.child_age != null && !editing"
          class="flex flex-column gap-2"
        >
          <label style="visibility: hidden">{{ $t("strart_evaluate") }}</label>
          <Button
            @click="createevalutae"
            :loading="starting"
            :disabled="questionsLoading || !selectedLevelGroups.length || strart_evaluate || !color"
            class="w-full"
            :label="continuing ? $t('milestone_continue') : $t('strart_evaluate')"
          ></Button>
        </div>

        <!-- Only what the last evaluation scored 0 or ½ (or never asked) is asked again; its 1s are carried over. -->
        <Message v-if="!questionsLoading && carriedCount && !editing" severity="info" :closable="false" class="lg:col-span-2">
          {{ $t("milestone_carried_hint", { count: carriedCount }) }}
        </Message>
        <Message v-if="questionsLoading" class="lg:col-span-2">{{ $t('loading') }}</Message>
        <Message v-else-if="continuing && !continuing.missing_level_ids.length" severity="success" class="lg:col-span-2">{{ $t('milestone_nothing_missing') }}</Message>
        <Message v-else-if="answer.child_age != null && !allquestion.length" severity="warn" class="lg:col-span-2">{{ $t('no_records_found') }}</Message>
        <fieldset v-if="!questionsLoading && levelGroups.length && !editing" class="level-picker lg:col-span-2" :disabled="strart_evaluate || starting">
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
          <!-- Each level is its own card, all in the evaluation's one color. -->
          <section v-for="level in selectedLevelGroups" :key="level.id" class="milestone-level lg:col-span-2"
            :style="{ '--level-color': '#' + color }">
            <header class="milestone-level-header">
              <h2>{{ level.title }}</h2>
            </header>
            <p v-if="!level.blocks.length" class="milestone-all-carried">{{ $t("milestone_level_all_carried") }}</p>
            <template v-for="block in level.blocks" :key="block.key">
              <!-- The EESA domain is scored through its form, once in each level, in the domain's place. -->
              <section v-if="block.eesa" class="milestone-domain">
                <h3 class="milestone-domain-title">{{ eesa.domain?.title }}</h3>
                <div class="eesa-wrap">
                  <Message v-if="eesaInvalidLevels.includes(level.id)" severity="error" :closable="false">{{ $t('eesa_invalid_boxes') }}</Message>
                  <EesaForm :modelValue="eesaBoxes[level.id] || {}" @update:modelValue="setEesaBoxes(level.id, $event)"
                    :previous="block.eesa.previous" :disabled="saving || block.eesa.locked" />
                </div>
              </section>
              <section v-else class="milestone-domain">
                <h3 class="milestone-domain-title">{{ block.title }}</h3>
                <section v-for="goal in block.goals" :key="goal.id" class="milestone-goal">
                  <h4>{{ goal.title }}</h4>
                  <div v-for="question in goal.questions" :key="question.id" class="milestone-question">
                    <p>
                      {{ question.title }}
                      <span v-if="question.previous" class="milestone-previous" :style="{ '--prev': '#' + (question.previous.color || '94a3b8') }">
                        {{ $t("milestone_previous_answer", { score: question.previous.score }) }}
                      </span>
                      <small v-if="isHalfBefore(question)" class="milestone-half-hint">{{ $t("milestone_half_hint") }}</small>
                    </p>
                    <div class="milestone-scores">
                      <!-- Each answer with the box it draws in the results chart: 0 empty, 0.5 lower half, 1 full. After a ½
                           (lower half in the old color) only 0 (it stays) or 0.5 (the upper half in this color). -->
                      <label v-for="score in question.options || [0, 0.5, 1]" :key="score"
                        :title="isHalfBefore(question) ? $t('milestone_half_box_' + String(score).replace('.', '_')) : $t('milestone_score_box_' + String(score).replace('.', '_'))">
                        <input type="radio" :required="!question.locked" :disabled="question.locked" :name="'question-' + question.id" :value="score"
                          :checked="isPicked(question, score)" @change="collectanswer($event, question.id)" />
                        <span>{{ score }}</span>
                        <span v-if="isHalfBefore(question)" class="score-box score-box-after-half" :class="{ completes: score === 0.5 }"
                          :style="{ '--prev': '#' + (question.previous.color || '94a3b8') }" aria-hidden="true">
                          <i /><i />
                        </span>
                        <span v-else class="score-box" :class="'score-box-' + String(score).replace('.', '_')" aria-hidden="true">
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
        <div v-if="strart_evaluate && !editing" class="flex flex-column gap-2">
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
            :label="editing ? $t('mae_save') : $t('submit')"
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
import EditModeBanner from "../../../components/evaluations/EditModeBanner.vue";
import { eesaInvalidKeys, eesaScores } from "../../../utils/eesa";
import { useToast } from "primevue/usetoast";
export default {
  components: { EvaluationType, EesaForm, EditModeBanner },

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
      // The evaluation's one color (hex without #), for every level.
      color: null,
      // The color of the child's last evaluation (not allowed again when continuing it).
      lastColor: null,
      // The child's latest milestone evaluation ({ id, date, status }), which a new one may continue.
      lastEvaluation: null,
      // "new": every question; "continue": only what the last evaluation scored 0 or ½. Chosen in the dialog.
      mode: null,
      modeDialog: false,
      // The EESA form, when the child's levels include its domain.
      // levels: [{ level_id, title, previous }], one form per level.
      eesa: { show: false, domain: null, levels: [] },
      // level id -> { g1_1: "1", ... }
      eesaBoxes: {},
      childs: [],
      // The progress of the evaluation being continued (?evaluation=id): its start age and missing levels.
      continuing: null,
      // The child's other evaluations still waiting for levels (offered when starting a new one).
      pending: [],
      qustions: {},
      error: {},
      maxDate: new Date(),
      notanswer: [],
      // Editing a saved evaluation (?edit=id) before its approval: { approval_status, approval_note }.
      editing: null,

      // Add other validation rules for the title field
    };
  },

  computed: {
    doneLevels() {
      return (this.continuing?.levels ?? []).filter(level => level.done)
    },
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
        // Scored 1 in the last evaluation: carried over, not asked again.
        if (question.carried) continue
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
        // Continuing: only the levels this evaluation still misses.
        .filter(level => !this.continuing || this.continuing.missing_level_ids.map(String).includes(String(level.id)))
    },
    carriedCount() {
      const levels = this.continuing ? this.continuing.missing_level_ids.map(String) : null
      return this.allquestion.filter(question => question.carried && (!levels || levels.includes(String(question.subtest?.level_id)))).length
    },
    // The evaluation being continued keeps the color it was started with.
    colorLocked() {
      return Boolean(this.continuing?.color)
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
    // Only continuing may not reuse the color of the evaluation it continues.
    isBlockedColor(color) {
      return this.mode === 'continue' && !this.colorLocked && String(this.lastColor ?? '').toUpperCase() === String(color).toUpperCase();
    },
    isHalfBefore(question) {
      return Number(question.previous?.score) === 0.5 && (question.options || []).length === 2;
    },
    chooseMode(mode) {
      this.modeDialog = false;
      if (this.mode === mode) return;
      this.mode = mode;
      this.defaultColor();
      this.getage();
    },
    // The first color the last evaluation did not use, until one is chosen.
    defaultColor() {
      if (this.color && !this.isBlockedColor(this.color)) return
      this.color = this.colorOptions.find(option => !this.isBlockedColor(option)) ?? this.colorOptions[0]
    },
    setEesaBoxes(levelId, boxes) {
      this.eesaBoxes = { ...this.eesaBoxes, [levelId]: boxes };
    },
    submit() {},
    day(value) {
      return String(value ?? '').slice(0, 10)
    },
    // The levels already done, each with its date and evaluator.
    doneTitles(progress) {
      return progress.levels.filter(level => level.done)
        .map(level => [level.title, [this.day(level.date), level.tester].filter(Boolean).join('، ')].filter(Boolean).join(' ('))
        .map(text => text.includes(' (') ? text + ')' : text).join(' · ')
    },
    missingTitles(progress) {
      return progress.levels.filter(level => progress.missing_level_ids.includes(level.level_id)).map(level => level.title).join('، ')
    },
    continueEvaluation(evaluationId) {
      this.$router.push({ name: 'milestone-evaluation', params: { id: this.answer.child_id }, query: { ...this.$route.query, evaluation: evaluationId } })
    },
    async createevalutae() {
      if (this.starting || this.strart_evaluate || this.questionsLoading || !this.selectedLevelGroups.length) return
      // Continuing: the evaluation exists already.
      if (this.continuing) {
        this.strart_evaluate = true
        return
      }
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
      if (!this.answer.date || this.strart_evaluate || !this.mode) return
      this.questionsLoading = true
      this.allquestion = []
      this.selectedLevelIds = []
      this.alert_text = ''
      try {
        const { data: age } = await axios.post('api/milestone-answers/get-age-child', {
          date: moment(this.answer.date).format('YYYY-MM-DD'), child_id: this.answer.child_id,
        })
        this.answer.child_age = Number(age)
        // The levels are those of the child's age when the evaluation started, however late it is continued.
        const levelAge = this.continuing?.start_age ?? age
        const [{ data }, { data: eesa }] = await Promise.all([
          axios.get(`api/milestone-answers/sub-goals/${levelAge}`, { params: { child_id: this.answer.child_id, evaluation_id: this.continuing ? this.answer.evaluation_id : undefined, mode: this.mode } }),
          // Without the EESA endpoint (older server) the evaluation still loads, just without the form.
          axios.get(`api/milestone-answers/eesa/${levelAge}`, { params: { child_id: this.answer.child_id } }).catch(() => ({ data: null })),
        ])
        this.allquestion = Array.isArray(data) ? data : (data.data || [])
        // An older server returns one form without levels: it belongs to the first level.
        const eesaLevels = Array.isArray(eesa?.levels) ? eesa.levels
          : eesa?.show ? [{ level_id: this.allquestion[0]?.subtest?.level_id, previous: eesa.previous ?? [] }] : []
        this.eesa = { show: eesaLevels.length > 0, domain: eesa?.domain ?? null, levels: eesaLevels }
        this.eesaBoxes = {}
        // Continuing: the missing levels are chosen to start with.
        if (this.continuing) this.selectedLevelIds = this.levelGroups.map(level => level.id)
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

    isPicked(question, score) {
      const picked = this.answers.answers[question.id]?.score;
      return picked !== undefined && picked !== null && Number(picked) === Number(score);
    },
    // The saved evaluation on this screen: the sub-goals it asked with their answers, and its EESA forms.
    async loadEdit() {
      this.questionsLoading = true;
      this.alert_text = "";
      try {
        const { data } = (await axios.get(`api/milestone-answers/evaluation/${this.$route.query.edit}/edit`)).data;
        const evaluation = data.evaluation;
        this.editing = evaluation;
        this.childs = [data.child];
        this.mode = evaluation.mode;
        this.color = String(evaluation.color || this.colorOptions[0]).replace("#", "").toUpperCase();
        this.answer = { child_id: data.child.id, date: evaluation.date ? new Date(evaluation.date) : new Date(), child_age: Number(evaluation.child_age ?? 0), evaluation_id: evaluation.id };
        this.levels = data.levels;
        this.allquestion = data.questions;
        this.eesa = { show: data.eesa.levels.length > 0, domain: data.eesa.domain, levels: data.eesa.levels };
        this.eesaBoxes = Object.fromEntries(data.eesa.levels.map((level) =>
          [level.level_id, Object.fromEntries(Object.entries(level.scores ?? {}).map(([key, value]) => [key, String(value)]))]));
        this.answers.answers = [];
        data.questions.filter((question) => !question.carried).forEach((question) => {
          this.answers.answers[question.id] = { question_id: question.id, score: question.score };
        });
        this.selectedLevelIds = data.levels.map((level) => level.id);
        this.strart_evaluate = true;
      } catch (error) {
        this.alert_text = error.response?.data?.message || this.$t("request_failed_retry");
      } finally {
        this.questionsLoading = false;
      }
    },
    async saveEdit() {
      this.saving = true;
      this.error = {};
      try {
        const answers = this.allquestion.filter((question) => !question.carried && !question.locked)
          .map((question) => ({ question_id: question.id, score: Number(this.answers.answers[question.id]?.score) }));
        const eesaLevels = this.selectedEesaLevels.filter((level) => !level.locked);
        await axios.put(`api/milestone-answers/evaluation/${this.answer.evaluation_id}/edit`, {
          answers,
          ...(eesaLevels.length ? { eesa: { levels: Object.fromEntries(eesaLevels.map((level) => [level.level_id, eesaScores(this.eesaBoxes[level.level_id] || {})])) } } : {}),
        });
        this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: this.$t("mae_saved"), life: 2500 });
        await this.$router.push({ name: "milestone-resulte", params: { id: this.answer.child_id, evla_id: this.answer.evaluation_id } });
      } catch (error) {
        this.error = error.response?.data?.errors || {};
        this.alert_text = Object.values(this.error).flat().join(" ") || error.response?.data?.message || this.$t("request_failed_retry");
      } finally {
        this.saving = false;
      }
    },

    async getanswer() {
      if (this.saving || !this.selectedLevelGroups.length) return;
      if (this.eesaInvalidLevels.length) {
        this.alert_text = this.$t('eesa_invalid_boxes');
        return;
      }
      if (this.editing) return this.saveEdit();
      this.saving = true;
      this.error = {};
      try {
        const inSelected = (questionId) => this.selectedLevelIds.map(String).includes(String(this.questionLevels[questionId]));
        // The carried 1s go along as 1 (the server keeps them in the color they were scored in).
        const carried = this.allquestion.filter(question => question.carried && inSelected(question.id)).map(question => ({
          question_id: question.id, score: 1, child_id: this.answer.child_id, date: moment(this.answer.date).format("YYYY-MM-DD"),
          child_age: this.answer.child_age, evaluation_id: this.answer.evaluation_id,
        }));
        const answers = [...this.answers.answers.filter(answer => answer && inSelected(answer.question_id)), ...carried]
          .map((answer) => ({ ...answer, color: this.color }));
        await axios.post("/api/milestone-answers", {
          student_program_id: this.answers.student_program_id,
          request_id: this.$route.query.requestId || null,
          mode: this.mode,
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
          (error.response?.status === 422 && error.response?.data?.data?.color ? this.$t("milestone_color_used_last_error") : "") ||
          this.$t("request_failed_retry");
      } finally {
        this.saving = false;
      }
    },
    // The evaluation to continue (?evaluation=id), or else the child's evaluations still waiting for levels.
    async loadProgress() {
      const evaluationId = Number(this.$route.query.evaluation) || null
      try {
        if (evaluationId) {
          const { data } = await axios.get(`api/milestone-answers/progress/${evaluationId}`)
          if (Number(data.child_id) === Number(this.answer.child_id)) {
            this.continuing = data
            this.answer.evaluation_id = evaluationId
            if (data.color) this.color = String(data.color).replace('#', '').toUpperCase()
            // Its kind was fixed when it was first saved.
            this.mode = data.based_on_evaluation_id ? 'continue' : 'new'
          }
        } else {
          const { data } = await axios.get(`api/milestone-answers/pending/${this.answer.child_id}`)
          this.pending = data?.data ?? []
        }
      } catch {
        // Without the endpoints (older server) a new evaluation starts as before.
      }
    },
    getusers() {
      axios.get("api/child").then(async (response) => {
        this.childs = response.data.children;
        this.answer.child_id = Number(this.$route.params.id || localStorage.getItem("child_id"));
        this.answer.date = new Date();
        await this.loadProgress();
        // Without the endpoint (older server) every color stays available and the evaluation is new.
        try {
          const { data } = await axios.get(`api/milestone-answers/last-colors/${this.answer.child_id}`);
          this.lastColor = data?.color ?? null;
          this.lastEvaluation = data?.last ?? null;
        } catch {
          // keep the defaults
        }
        if (!this.mode) {
          // A child with an earlier evaluation: ask whether to start over or continue it.
          if (this.lastEvaluation || this.pending.length) this.modeDialog = true;
          else this.mode = 'new';
        }
        this.defaultColor();
        this.getage();
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
    if (this.$route.query.edit) this.loadEdit();
    else this.getusers();
  },
  watch: {
    // "Continue" opens the same screen with ?evaluation=id: start over with that evaluation.
    "$route.query.evaluation"(value, before) {
      if (value === before || this.$route.name !== "milestone-evaluation") return;
      Object.assign(this.$data, this.$options.data.call(this));
      this.getusers();
    },
  },
};
</script>

<style scoped>
.mode-banner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem; }
.mode-options { display: grid; gap: .75rem; }
.mode-option { display: flex; align-items: flex-start; gap: .85rem; width: 100%; padding: .9rem 1rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 12px; background: #fff; text-align: start; cursor: pointer; font: inherit; }
.mode-option:hover, .mode-option:focus-visible { border-color: var(--sawa-primary, rgb(var(--bp-135c65))); background: #edf7f5; }
.mode-option i { font-size: 1.3rem; color: var(--sawa-primary, rgb(var(--bp-135c65))); margin-top: .1rem; }
.mode-option span { display: grid; gap: .2rem; }
.mode-option small { color: var(--sawa-muted, #64748b); }
.mode-option .mode-option-id { font-size: .75rem; opacity: .8; }
.milestone-half-hint { display: block; margin-top: .25rem; color: var(--sawa-muted, #64748b); font-size: .8rem; }
/* After a ½: the lower half already in the old color; 0.5 adds the upper half in this evaluation's color. */
.score-box-after-half i:last-child { background: var(--prev); }
.score-box-after-half.completes i:first-child { background: var(--level-color, rgb(var(--bp-135c65))); }
.pending-item { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem; margin-top: .6rem; }
.level-picker { border: 1px solid var(--sawa-border); border-radius: 12px; padding: 1rem; }
.level-picker legend { font-weight: 700; color: var(--sawa-primary); }
.level-picker p { margin: 0 0 .75rem; color: var(--sawa-muted); }
.level-picker-options { display: flex; flex-wrap: wrap; gap: 1rem; }
.level-picker-options label { display: flex; align-items: center; gap: .5rem; cursor: pointer; }
.level-picker:disabled .level-picker-options label { cursor: default; }
.milestone-level { border: 2px solid var(--level-color); border-radius: 16px; overflow: hidden; }
.milestone-level-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .75rem; padding: 1rem 1.25rem; background: var(--level-color); color: #fff; }
.milestone-level-header h2 { margin: 0; font-weight: 700; font-size: 1.25rem; }
.milestone-colors { display: flex; align-items: center; gap: .5rem; min-height: 2.6rem; }
.milestone-colors button { width: 30px; height: 30px; border-radius: 6px; border: 2px solid transparent; cursor: pointer; transition: transform .15s; }
.milestone-colors button:hover:not(:disabled) { transform: scale(1.1); }
.milestone-colors button.selected { border-color: #333; box-shadow: 0 0 0 2px #fff inset; }
.milestone-colors button:disabled:not(.selected) { opacity: .5; cursor: default; }
.milestone-colors button.blocked { position: relative; cursor: not-allowed; opacity: .35; }
.milestone-colors button.blocked::after { content: ""; position: absolute; inset: 45% -2px auto; height: 2px; background: #333; transform: rotate(-45deg); }
.milestone-all-carried { margin: 0; padding: 1rem 1.25rem; color: var(--sawa-muted); }
.milestone-previous { display: inline-block; margin-inline-start: .5rem; padding: .1rem .5rem; border-radius: 999px; border: 1px solid var(--prev); color: #334155; font-size: .8rem; white-space: nowrap; }
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
.score-legend-title { font-weight: 700; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.score-legend-item { display: inline-flex; align-items: center; gap: .45rem; }
/* The chart box for each answer, in the level's color: upper half for 1, lower half for 0.5 and 1. */
.score-box { display: grid; grid-template-rows: 1fr 1fr; width: 22px; height: 22px; margin-inline-start: .15rem; border: 1.5px solid var(--level-color, rgb(var(--bp-135c65))); background: #fff; }
.score-box i + i { border-top: 1px dotted var(--level-color, rgb(var(--bp-135c65))); }
.score-box-0_5 i:last-child,
.score-box-1 i { background: var(--level-color, rgb(var(--bp-135c65))); }
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
  background-color: rgb(var(--bp-135c65));
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
