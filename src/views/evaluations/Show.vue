<script>
import axios from "axios";
import { th } from "vuetify/locale";
import { format, formatDistance, formatRelative, subDays, differenceInMonths } from 'date-fns'
import moment from "moment";
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';

export default {
  components: { InputText, Calendar },
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
    headerAndQuestions: [],
    examDate: '',
  }),
  methods: {
    fomate() {
      // this.examDate =  moment(new Date()).format("YYYY-MM-DD HH:mm")
    },
    goBack() {
      this.$router.go(-1)
    },
    getQuestions() {
      axios.get(`/api/side-profile-types/${this.$route.params.id}`).then(res => {
        const data = res.data.data.evaluation_header
        this.title = res.data.data.title
        data.forEach(item => {
          const headerId = item.id;

          if (!this.headerAndQuestions[headerId]) {
            this.headerAndQuestions[headerId] = [];
          }

          this.headerAndQuestions[headerId].push(item);
        });

      })
      console.log(this.headerAndQuestions)
    },

    /*
    
    */
    async submit() {
      this.load = true
      setTimeout(() => {
        this.load = false
      }, 3000);
      const { valid } = await this.$refs.form.validate()
      if (!valid)
        return
      this.answers = []
      this.selected.forEach((value, question_id) => {
        this.answers.push({ question_id, value })
      })
      this.examDate = moment(new Date()).format("YYYY-MM-DD HH:mm")
      axios.post(`/api/evaluations/${this.$route.params.id}/submit`, {
        'answers': this.answers,
        'child_id': this.child_id,
        'date': this.examDate,
        skills: this.skills
      }).then(res => {
        if (res.data.status == 200) {
          this.child.childInMonths = -1 //reset child in months to -1 to not show any question header

          this.type = "success"
        }
      }).catch((error) => {

        this.error = error.data
        this.type = "error"
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
            date: this.examDate,
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
          this.alert_text = "sorry this child has this evaluate lass than 6 months"
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
    this.examDate = moment(new Date()).format("YYYY-MM-DD HH:mm")

    console.log(this.examDate)
  },



}


</script>

<template>
  <div>

    <v-btn height="45" class="mb-5 text-white" color="#A9AB7F" @click="goBack">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      {{ $t('back') }}
    </v-btn>
    <v-sheet max-width="1200" class="mx-auto">

      <h1 class="text-center"> {{ title }}</h1>


      <v-form fast-fail ref="form" @submit.prevent="submit" class="shadow-lg lg:p-[2%]">

        <v-select label="Child" v-model="child_id" @update:modelValue="getSpecificChildren"
          :items="selectBox"></v-select>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <div class="flex flex-column gap-2 py-2">
            <label class="w-full text-right" for="username">{{ $t('created_at') }}</label>
            <Calendar style="width: 100%;" v-model="examDate" @change="fomate()" date-format="dd-mm-yy" showIcon
              :rules="NameRules" :show-time="true" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
          </div>

        </div>

        <div v-for="questions in Object.values(headerAndQuestions).reverse()">

          <div v-if="questions[0].min_age <= this.child.childInMonths">
            <ul>
              <li class="font-weight-bold mb-3 mx-7">{{ questions[0].title }}</li>
            </ul>

            <div v-for="question in questions" class="border border-1 rounded pa-5">

              <div class="mb-3">
                {{ question.questions.title }}
              </div>
              <v-radio-group v-model="selected[question.questions.id]"
                @change="radioChange(selected[question.questions.id], question.questions.evaluation_header_id, question.questions.id)"
                :rules="NameRules">
                <v-radio label="True" value="1"></v-radio>
                <v-radio label="False" value="0"></v-radio>
              </v-radio-group>

            </div>
          </div>
          <div class="mb-7">

          </div>

        </div>
        <Button :loading="load" type="submit" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button>
        <!-- <v-btn :loading="load" type="submit" block class="create text-white lg:w-[50%] mt-2">{{ $t('submit') }}</v-btn> -->

      </v-form>

    </v-sheet>

  </div>
</template>