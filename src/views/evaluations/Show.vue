<script>
import axios from "axios";
import { format, formatDistance, formatRelative, subDays, differenceInMonths } from 'date-fns'
import moment from "moment";
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';

export default {
  components: { InputText, DatePicker },
  data: () => ({
    valu: "",

    NameRules: [
      value => {
        if (value) return true
        return "This field is required"

      },
    ],

    title: "",
    skills: [],
    skill: {},
    answers: [],
    error: {},
    type: "success",
    snackbar: true,
    load: false,
    selected: [],
    children: [],
    selectBox: [],
    c: {},
    child_id: '',
    child: '',
    numberOfMonth: '',
    skip: [],
    headerAndQuestions: {},
    examDate: '',
    submitted: false,
    alert_text: '',
    answerOptions: [
      { value: '1', label: 'yes' },
      { value: '0', label: 'no' },
    ],
  }),
  computed: {
    examDateText() {
      return moment(this.examDate || new Date()).format("YYYY-MM-DD HH:mm")
    },
    unansweredCount() {
      if (!this.child || this.child.childInMonths === undefined) return 0
      return Object.values(this.headerAndQuestions)
        .filter((questions) => questions[0].min_age <= this.child.childInMonths)
        .flat()
        .filter((question) => this.selected[question.questions.id] === undefined).length
    },
  },
  methods: {
    fomate() {
      // this.examDate =  moment(new Date()).format("YYYY-MM-DD HH:mm")
    },
    goBack() {
      this.$router.go(-1)
    },
    // The dimension's questions hang off evaluations.id, grouped by header (age band).
    getQuestions() {
      const id = this.$route.params.id
      axios.get(`/api/evaluations/${id}/show`).then(res => {
        this.title = res.data.evaluation?.title ?? ''
      })
      axios.get(`/api/evaluations/${id}`).then(res => {
        this.headerAndQuestions = res.data.evaluation ?? {}
      }).catch(() => {
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail: this.$t("evaluation_not_found"), life: 5000 })
      })
    },

    /*
    
    */
    async submit() {
      this.load = true
      setTimeout(() => {
        this.load = false
      }, 3000);
      this.submitted = true
      if (!this.child_id || this.unansweredCount) {
        this.load = false
        return
      }
      this.answers = []
      this.selected.forEach((value, question_id) => {
        this.answers.push({ question_id, value })
      })
      axios.post(`/api/evaluations/${this.$route.params.id}/submit`, {
        'answers': this.answers,
        'child_id': this.child_id,
        'date': this.examDateText,
        skills: this.skills
      }).then(res => {
        if (res.data.status == 200) {
          this.child.childInMonths = -1 //reset child in months to -1 to not show any question header

          this.type = "success"
        }
      }).catch((error) => {
        this.error = error.response?.data ?? {}
        this.type = "error"
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail: error.response?.data?.message ?? this.$t("request_failed_retry"), life: 5000 })
      })


    },
    getChildren() {
      axios.get("/api/child").then(res => {
        this.children = res.data.children.forEach((item) => {
          this.selectBox.push({ 'title': item.name, 'value': item.id })
        })
        // console.log(this.selectBox)

      })
    },
    radioChange(selected, evaluation_header_id, question_id) {
      // console.log(this.selected)
      // console.log(evaluation_header_id)
      let flag = 0
      if (this.skip[evaluation_header_id] == undefined) {
        this.skip[evaluation_header_id] = [{ id: question_id, answer: selected }]
      } else {
        let answer = this.skip[evaluation_header_id]
        answer.forEach((elem) => {
          // console.log(elem)
          if (elem.id == question_id) {
            flag++
            elem.answer = selected
          }

        })
        if (!flag) {
          answer.push({ id: question_id, answer: selected })
          this.skip[evaluation_header_id] = answer
        }
      }
      // console.log(this.skip)

      let count = 0;
      let check = 0.
      let prev = -1
      let current = -1
      Object.entries(this.skip).reverse().forEach((elem) => {
        const [key, value] = elem;
        prev = current
        current = key


        for (const item of value) {
          if (item.answer == 1)
            count++
          else {
            count = 0
            break
          }
        }
        if (count) {

          if (this.headerAndQuestions[key].length == count)
            check++;
          count = 0
        } else {
          check = 0
        }
        if (check == 2) {
          let checkHeaderFlag = 0;

          for (const item of Object.entries(this.headerAndQuestions)) {
            const [headerKey, valueKey] = item;
            if (key == headerKey) {
              break;
            }
            valueKey.forEach((elem) => {
              this.selected[elem.questions.id] = 1
            })
          }

          this.answers = []
          this.selected.forEach((value, question_id) => {
            this.answers.push({ question_id, value })
          })
          axios.post(`/api/evaluations/${this.$route.params.id}/${prev}/basalAge`, {
            answers: this.answers,
            child_id: this.child_id,
            date: this.examDateText,
            skills: this.skills
          }).then(res => {
            console.log(res.data.resultEvaluation)
          })

          this.$router.push({ name: 'Children', params: { alert: 1 } })
        }

      })
    },

    getallskills() {
      axios.get("/api/skills").then((res) => {
        this.skill = res.data.data

      });
    },



    getSpecificChildren() {


      axios.get(`/api/child/${this.child_id}/${this.$route.params.id}`).then(res => {
        console.log(res.data.child)
        if (!res.data.child.canDoExam) {
          this.alert_text = this.$t("evaluation_too_soon")
          this.type = "error"
          this.child = res.data.child
          this.child.childInMonths = -1 //reset child in months to -1 to not show any question header
        } else {
          this.alert_text = ""
          this.child = res.data.child
        }
        // console.log(this.child)
      })
    },

  }

  , mounted() {
    this.getQuestions()
    this.getChildren()
    this.getallskills()
    this.examDate = new Date()
  },



}


</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <h1 class="page-title">{{ title }}</h1>
      <BackButton />
    </div>

    <form class="surface-card form-stack" novalidate @submit.prevent="submit">
      <div class="form-grid">
        <div class="field">
          <label for="evaluation-child">{{ $t("child") }}</label>
          <Select inputId="evaluation-child" v-model="child_id" :options="selectBox" optionLabel="title" optionValue="value"
            filter fluid :placeholder="$t('select_child')" :invalid="submitted && !child_id"
            @update:modelValue="getSpecificChildren" />
          <small v-if="submitted && !child_id" class="field-error">{{ $t("field_required") }}</small>
        </div>
        <div class="field">
          <label for="evaluation-date">{{ $t("created_at") }}</label>
          <DatePicker inputId="evaluation-date" v-model="examDate" dateFormat="yy-mm-dd" showIcon showTime hourFormat="24" fluid />
        </div>
      </div>

      <Message v-if="alert_text" :severity="type === 'error' ? 'warn' : 'success'" :closable="false">{{ alert_text }}</Message>
      <Message v-if="type === 'success' && child.childInMonths === -1 && !alert_text" severity="success" :closable="false">
        {{ $t("evaluation_saved") }}
      </Message>

      <template v-for="questions in Object.values(headerAndQuestions).reverse()" :key="questions[0].id">
        <section v-if="questions[0].min_age <= child.childInMonths" class="question-group">
          <h2 class="question-group-title">{{ questions[0].title }}</h2>
          <div v-for="question in questions" :key="question.questions.id" class="question-row"
            :class="{ unanswered: submitted && selected[question.questions.id] === undefined }">
            <p class="question-text">{{ question.questions.title }}</p>
            <div class="answer-options">
              <label v-for="option in answerOptions" :key="option.value" class="answer-option">
                <RadioButton v-model="selected[question.questions.id]" :value="option.value"
                  :name="`question-${question.questions.id}`"
                  @update:modelValue="radioChange($event, question.questions.evaluation_header_id, question.questions.id)" />
                <span>{{ $t(option.label) }}</span>
              </label>
            </div>
          </div>
        </section>
      </template>

      <Message v-if="submitted && unansweredCount" severity="error" :closable="false">
        {{ $t("questions_missing", { count: unansweredCount }) }}
      </Message>

      <div class="form-actions">
        <Button :loading="load" type="submit" icon="pi pi-check" :label="$t('submit')" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-stack {
  display: grid;
  gap: 1rem;
}
.question-group {
  display: grid;
  gap: 0.5rem;
}
.question-group-title {
  margin: 0.5rem 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--sawa-primary);
}
.question-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
}
.question-row.unanswered {
  border-color: #fca5a5;
  background: #fef2f2;
}
.question-text {
  margin: 0;
  flex: 1 1 18rem;
}
.answer-options {
  display: flex;
  gap: 1.25rem;
}
.answer-option {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}
.form-actions {
  display: flex;
  justify-content: center;
}
.form-actions .p-button {
  min-width: 12rem;
}
</style>
