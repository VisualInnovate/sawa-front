<template>
    
    <div class="back-back">
      <div  class="back">
        <div class="text-center"><img src="../../assets/img/sawa_logo.svg" style="width:130px; "></div>
      <div> <p class="w-[100%] text-h4 text-center ma-4" >{{title }}</p></div>
     <div>
      <p class="w-[100%] text-start ma-4">{{child_Name}}</p>
      <p class="w-[100%] text-start ma-4">{{birth_date}}</p>
     </div>
        <div class="sawa-card">
         
          
          <table class="print-table">
          <thead>
            <tr><th v-for="column in header" :key="column.key ?? column.title">{{ column.title }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in desserts" :key="item.id ?? index">
              <td>{{ item.id }}</td>
              <td>{{ item.evaluation_title }}</td>
              <td>{{ item.side_profile_title }}</td>
              <td>{{ item.child_age }}</td>
              <td>{{ item.diff_age }}</td>
              <td>{{ item.grow_age }}</td>
              <td>{{ Math.round(item.late_percentage) }} %</td>
              <td>{{ item.result_created_at }}</td>
            </tr>
          </tbody>
        </table>
        </div>
  
  
      </div>
    </div>
  
  
  
  
  </template>
<script>
import axios from 'axios'

  export default {
    data () {
      return {
        sortBy: [{ key: 'evaluation_title', order: 'asc' }],
        headers: [],
        desserts: [],
        child_Name:'',
        birth_date:'',
        title:'',
      }
    },
    computed: {
    locale() {

      return this.$i18n.locale;
    },
    header() {
      return this.headers = [
        {title: '#', key: 'id'},

        { title:this.$t('evaluation_title'), key: 'evaluation_title'},
          { title:this.$t('side_profile_title'), key: 'side_profile_title' },
          { title: this.$t('child_age'), key: 'child_age' },
          { title: this.$t('diff_age'), key: 'diff_age' },
          { title: this.$t('grow_age'), key: 'grow_age' },
          { title: this.$t('late_percentage'), key: 'late_percentage' },
          { title: this.$t('result_created_at'), key: 'result_created_at' },


      ];
    },
  },
    
    methods: {
        getresulte(){
            axios.get(`/api/child/${this.$route.params.child_id}`).then(res => {
              console.log(res.data)
          console.log(res.data.child)
       this.child_Name=res.data.child.name
       this.birth_date=res.data.child.birth_date

       console.log(this.print_results)
    //    this.child_Name=this.print_results[0].name
       console.log("ASa")
      })
        },
        goBack() {
        this.$router.go(-1)
      },
      async print(){
       await axios.post("/api/child/results",{
          sideprofile_id:this.$route.params.sideProfile_id,child_id:this.$route.params.child_id
        }).then(res => {
          
       this.desserts=res.data.evaluation_results
       this.title=res.data.evaluation_results[0].side_profile_title
       console.log(res)
      
      })
      setTimeout(() => {
        window.print();
      }, 500)
      
    },
},
     beforeMount() {
       this.getresulte(),
       this.print()

    },
  }
</script>
<style scoped>
.back-back {
    background: #999;
    cursor: default;
  }
  
  .back {
    box-sizing: border-box;
    height: 11in;
    margin: 0 auto;
    overflow: hidden;
    padding: 0.1in;
    width: 8.5in;
  }
  
  .back {
    background: #FFF;
    border-radius: 1px;
    box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
  }
  
  .hidden-table  {
    border-collapse: separate;
    border-spacing: 2px;
    width: 100%;
    font-size: 11px;
    
    border: 2px solid rgb(61,129,137)
  }
  .hidden-table td  {
   
    border: 1px solid rgb(239, 239, 239)
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
