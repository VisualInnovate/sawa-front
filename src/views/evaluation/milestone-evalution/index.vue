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
          <label for="username">{{ $t("evaluation_name") }}</label>
          <InputText
            required
            v-model="answer.title"
            :placeholder="$t('evaluation_name')"
          />
          <div class="mt-1 mb-5 text-red-500" v-if="error?.title">
            {{ error.title[0] }}
          </div>
        </div>

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
            :minDate="maxDate"
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
          <label for="username">{{ $t("color") }}</label>

          <div class="flex">
            <!-- <ColorPicker   :style="{ 'background-color':'#' +answer.color  }"  class="w-full h-[50px]" v-model="answer.color" /> -->
            <div>
              <div class="flex gap-1">
                <span
                  @click="addcolor('00B8D9')"
                  class="w-[30px] h-[30px] bg-[#00B8D9] cursor-pointer hover:border-2 hover:border-[#333] transition"
                ></span>
                <span
                  @click="addcolor('36B37E')"
                  class="w-[30px] h-[30px] bg-[#36B37E] cursor-pointer hover:border-2 hover:border-[#333] transition"
                ></span>
                <span
                  @click="addcolor('FFAB00')"
                  class="w-[30px] h-[30px] bg-[#FFAB00] cursor-pointer hover:border-2 hover:border-[#333] transition"
                ></span>
                <span
                  @click="addcolor('FF5630')"
                  class="w-[30px] h-[30px] bg-[#FF5630] cursor-pointer hover:border-2 hover:border-[#333] transition"
                ></span>
                <span
                  @click="addcolor('6554C0')"
                  class="w-[30px] h-[30px] bg-[#6554C0] cursor-pointer hover:border-2 hover:border-[#333] transition"
                ></span>
              </div>
              <div class="bg-[#00B8D9] h-[40%] mt-1" ref="showcolor"></div>
            </div>
            <Button
              @click="createevalutae"
              :loading="starting"
              :disabled="questionsLoading || !allquestion.length || strart_evaluate"
              class="m-auto w-full h-[50px]"
              :label="$t('strart_evaluate')"
            ></Button>
          </div>
          <div class="mt-1 mb-5 text-red-500" v-if="error?.color">
            {{ error.color[0] }}
          </div>
        </div>

        <Message v-if="questionsLoading" class="lg:col-span-2">{{ $t('loading') }}</Message>
        <Message v-else-if="answer.child_age != null && !allquestion.length" severity="warn" class="lg:col-span-2">{{ $t('no_records_found') }}</Message>
        <template v-if="strart_evaluate">
          <section v-for="domain in questionGroups" :key="domain.id" class="milestone-domain lg:col-span-2">
            <h2>{{ domain.title }}</h2>
            <section v-for="goal in domain.goals" :key="goal.id" class="milestone-goal">
              <h3>{{ goal.title }}</h3>
              <div v-for="question in goal.questions" :key="question.id" class="milestone-question">
                <p>{{ question.title }}</p>
                <div class="milestone-scores">
                  <label v-for="score in [0, 0.5, 1]" :key="score">
                    <input type="radio" required :name="'question-' + question.id" :value="score"
                      @change="collectanswer($event, question.id)" />
                    <span>{{ score }}</span>
                  </label>
                </div>
              </div>
            </section>
          </section>
          <!-- This domain is scored through the EESA form instead of sub-goals. -->
          <section v-if="eesa.show" class="milestone-domain lg:col-span-2">
            <h2>{{ eesa.domain?.title }}</h2>
            <div class="eesa-wrap">
              <Message v-if="eesaInvalid.length" severity="error" :closable="false">{{ $t('eesa_invalid_boxes') }}</Message>
              <EesaForm v-model="eesaBoxes" :previous="eesa.previous" :disabled="saving" />
            </div>
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

      answer: {
        color: "6554C0",
      },
      allquestion: [],
      // The EESA form, when the child's levels include its domain.
      eesa: { show: false, domain: null, previous: [] },
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
    eesaInvalid() {
      return this.eesa.show ? eesaInvalidKeys(this.eesaBoxes) : [];
    },
    questionGroups() {
      const domains = new Map()
      for (const question of this.allquestion) {
        const domainId = question.question_type_id ?? 'other'
        if (!domains.has(domainId)) domains.set(domainId, { id: domainId, title: question.question_type?.title || this.$t('milestone_domains'), goals: new Map() })
        const domain = domains.get(domainId)
        const goalId = question.subtest_id
        if (!domain.goals.has(goalId)) domain.goals.set(goalId, { id: goalId, title: question.subtest?.title || this.$t('milestone_general_goals'), questions: [] })
        domain.goals.get(goalId).questions.push(question)
      }
      return [...domains.values()].map(domain => ({ ...domain, goals: [...domain.goals.values()] }))
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
    addcolor(color) {
      this.answer.color = color;
      this.$refs.showcolor.style.background = "#" + color;
    },
    submit() {},
    async createevalutae() {
      if (this.starting || this.strart_evaluate || this.questionsLoading || !this.allquestion.length) return
      this.starting = true
      this.error = {}
      try {
        const { data } = await axios.post('api/evaluations/create', {
          type: this.type, title: this.answer.title, child_id: this.answer.child_id,
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
    getcolor(id) {
      this.answer.color = id.target.value;
    },
    async getage() {
      if (!this.answer.date || this.strart_evaluate) return
      this.questionsLoading = true
      this.allquestion = []
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
        this.eesa = { show: Boolean(eesa?.show), domain: eesa?.domain ?? null, previous: eesa?.previous ?? [] }
        this.eesaBoxes = {}
      } catch (error) {
        this.alert_text = error.response?.data?.message || this.$t('request_failed_retry')
      } finally { this.questionsLoading = false }
    },

    collectanswer(e, id) {
      this.answers.answers[id] = {
        question_id: id,
        score: e.target.value,
        color: this.answer.color,
        child_id: this.answer.child_id,
        date: moment(this.answer.date).format("YYYY-MM-DD"),
        child_age: this.answer.child_age,
        evaluation_id: this.answer.evaluation_id,
      };
      console.log(this.answers.answers);
    },

    async getanswer() {
      if (this.saving) return;
      if (this.eesaInvalid.length) {
        this.alert_text = this.$t('eesa_invalid_boxes');
        return;
      }
      this.saving = true;
      this.error = {};
      try {
        const answers = this.answers.answers
          .filter(Boolean)
          .map((answer) => ({ ...answer, color: this.answer.color }));
        await axios.post("/api/milestone-answers", {
          student_program_id: this.answers.student_program_id,
          request_id: this.$route.query.requestId || null,
          answers,
          ...(this.eesa.show ? { eesa: { scores: eesaScores(this.eesaBoxes) } } : {}),
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
.milestone-domain { border: 1px solid var(--sawa-border); border-radius: 16px; overflow: hidden; }
.eesa-wrap { display: grid; gap: .75rem; padding: 1rem; }
.milestone-domain h2 { margin: 0; padding: 1rem 1.25rem; color: var(--sawa-primary); background: #edf7f5; font-weight: 700; font-size: 1.15rem; }
.milestone-goal { padding: 1rem 1.25rem; }
.milestone-goal h3 { margin-bottom: .75rem; font-weight: 700; }
.milestone-question { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--sawa-border); padding: 1rem 0; }
.milestone-question p { flex: 1 1 20rem; }
.milestone-scores { display: flex; gap: .6rem; }
.milestone-scores label { display: flex; gap: .4rem; padding: .5rem .8rem; border: 1px solid var(--sawa-border); border-radius: 8px; cursor: pointer; }

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
