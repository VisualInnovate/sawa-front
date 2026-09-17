<script>
import axios from 'axios'
import Chart from 'chart.js/auto';
import moment from "moment";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';


export default {

  data() {
    return {
      search: '',
      headers: [],
      result: [],
      print_results: [],
      alert_text: null,
      ctx: null,
      created_at: [],
      latePercenteges: [],
      growAge: [],
      diffAge: [],
      date1: '',
      date2: '',
      myCahrt: '',
      selectX: null,
      selectY: null,
      visible: false,
      examDate: '',
      NameRules: [
        value => {
          if (value) return true
          return "This field is required"

        },
      ],
      examId: '',
      loading: true,


    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async print() {
      // await axios.post("/api/child/results",{
      //     sideprofile_id:this.$route.params.sideProfile_id,child_id:this.$route.params.child_id
      //   }).then(res => {
          
      //  this.print_results=res.data.evaluation_results
      //  this.title=res.data.evaluation_results[0].side_profile_title
      //  console.log(res)
      
      // })
      // setTimeout(() => {
      //   window.print();
      // }, 500)
      
      await  axios.post(`/api/filter/resultr/${this.$route.params.child_id}/${this.$route.params.sideProfile_id}/${this.$route.params.evaluation_id}`, {
        startdate: this.$route.params.start,
        enddate: this.$route.params.end
      }).then(res => {
        console.log(res)
        this.print_results = res.data.evaluation_results

      })
     
      setTimeout(() => {
        window.print();
      }, 500)

    },
  
    formateDate(date) {
      return moment(date).format('DD-MM-YYYY HH:mm')
    },


  },
  components: {
    Dialog,
    Button
  },

  beforeMount() {

    this.print()

  },
  computed: {
    locale() {

      return this.$i18n.locale;
    },
    header() {
      return this.headers = [
        {title: '#'},

        {key: 'therapist_name', title: this.$t('therapist_name')},
        {key: 'child_age', title: this.$t('child_age')},
        {key: 'grow_age', title: this.$t('grow_age')},
        {key: 'diff_age', title: this.$t('diff_age')},
        {key: 'basal_age', title: this.$t('basal_age')},
        {key: 'late_percentage', title: this.$t('late_percentage')},
        {key: 'result_created_at', title: this.$t('created_at')},

      ];
    },

  },
  computedResult() {
    return this.result
  }


}
</script>

<template>
  <Message v-if="alert_text != null" severity="success" class="no-print">{{ alert_text }}</Message>
  <div class="back-back">
    <div class="back">
      <div class="text-center"><img src="../../assets/img/sawa_logo.svg" style="width:130px; "></div>
      <div><p class="w-[100%] text-h4 text-center ma-4">{{ print_results[0]?.evaluation_title }}</p></div>
      <div>
        <p class="w-[100%] text-start ma-4">{{ print_results[0]?.child_name }}</p>
        <p class="w-[100%] text-start ma-4">{{ print_results[0]?.birth_date }}</p>


      </div>
      <canvas id="myChart" style="height: 70vh !important; margin-bottom : 30px"></canvas>

      <div class="sawa-card">
        <table class="print-table">
          <thead>
            <tr><th v-for="column in header" :key="column.key ?? column.title">{{ column.title }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in print_results" :key="item.id ?? index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.therapist_name }}</td>
              <td>{{ item.child_age }} {{ $t('months') }}</td>
              <td>{{ item.grow_age }}</td>
              <td>{{ item.diff_age }}</td>
              <td>{{ item.basal_age }} {{ $t('months') }}</td>
              <td>{{ Math.round(item.late_percentage) }} %</td>
              <td>{{ formateDate(item.result_created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>
  </div>


</template>
<style scoped>
.back-back {
  background: #999;
  cursor: default;
}

.back {
  box-sizing: border-box;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.5in;
  width: 8.5in;
}

.back {
  background: #FFF;
  border-radius: 1px;
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
}

.hidden-table {
  width: 100%;
  font-size: 12px;
}

.hidden-table {
  border-collapse: separate;
  border-spacing: 2px;
}

th, td {
  border-width: 1px;
  padding: 0.5em;
  position: relative;
  text-align: right;
  border-style: solid;
}

th, td {
  border-radius: 0.25em;
  border-style: solid;
}

th {
  border: 1px solid;
}

td {
  border-color: #DDD;
}


.print-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.print-table th,
.print-table td {
  border: 1px solid #cbd5e1;
  padding: 0.4em 0.5em;
  text-align: start;
}
.print-table th {
  background: #eef8f9;
  color: #135c65;
}
</style>