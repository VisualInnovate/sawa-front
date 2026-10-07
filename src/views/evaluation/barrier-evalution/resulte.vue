<template>
  <div class="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-3 gap-y-4">
      <div class="" v-for="x,top in mainSquares">
          <p class="font-bold w-full h-20 text-center py-1">{{ x.subtest }}</p>
          <div v-if="mainSquares" class=" flex "  style="border: 1px 1px 0px 0px solid black;">
         
         <div  class="grid grid-cols-1">
          
         <div class="w-20 h-16  m-auto text-center " v-for="(mainSquare, index) in  mainSquares[0]?.questions.slice().reverse()" :key="index">
           
           <p class=" h-full text-center ">{{ mainSquares[0]?.questions.length - index }}</p>
         </div>
       </div>
     
      
       <div  class="grid grid-cols-1" v-for="mil,index in  5">
          
          <div   class="grid grid-cols-1   m-auto text-center "  v-for="m,ind in  5" >
              <p   class=" text-center pt-7 w-16 h-16 " style="border: 1px solid black;" :style="{backgroundColor: mainSquares[top]?.questions[index].score >= mainSquares[top]?.questions.length - ind ? `#${mainSquares[top]?.questions[index].color}` : ''  }" ></p>
          </div>
          <p class="text-center pt-">{{ index+1  }}</p>
       </div>
      
      
       <!-- table -->
       
      
      
      
      
      
       
      
       
       
      
      </div>
      </div>
  
  </div>
  
  <!-- <div class="relative py-[4%] overflow-x-auto">
   <table class="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
       <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
           <tr>
             <th scope="col" class="px-6 py-3">
               الرقم
               </th>
               <th scope="col" class="px-6 py-3">
                   نقاط القوة
               </th>
               <th scope="col" class="px-6 py-3">
                   نقاط الضعف
               </th>
               <th scope="col" class="px-6 py-3">
                   حاله الهدف
               </th>
               <th scope="col" class="px-6 py-3">
                    الرمز المستهدف
               </th>
           </tr>
       </thead>
       <tbody>
           <tr v-for="res,index in table_resulte" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              
               <td class="px-6 py-4">
                 {{ res.index }}
               </td>
               <td  class="px-6 py-4">
                 <span v-for="str in res.strength">{{str}} - </span>
               </td>
               <td  class="px-6 py-4">
                 <span v-for="str in res.weak">{{str}} - </span>
               </td>
               <td class="px-6 py-4">
                 {{ res.status }}
               </td>
               <td class="px-6 py-4">
                 {{ res.symbol }}
               </td>
           </tr>
          
       </tbody>
   </table>
  </div> -->

  <!-- The child's latest barriers evaluation: each barrier with the chosen answer and its number. -->
  <section v-if="answersTable.rows.length" class="ba-card">
    <h2>{{ $t("barrier_ui.answers_table") }} <small v-if="answersTable.evaluation">· <span dir="ltr">{{ String(answersTable.evaluation.date).slice(0, 10) }}</span></small></h2>
    <div class="ba-wrap">
      <table class="ba-table">
        <thead>
          <tr>
            <th>{{ $t("barrier_ui.number") }}</th>
            <th>{{ $t("barrier_ui.question") }}</th>
            <th>{{ $t("barrier_ui.answer") }}</th>
            <th>{{ $t("barrier_ui.answer_number") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in answersTable.rows" :key="row.subtest_id">
            <td class="ba-num">{{ row.number }}</td>
            <td>{{ row.subtest }}</td>
            <td>{{ row.answer }}</td>
            <td class="ba-num">{{ row.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  </template>
  
  <script>
  import axios from "axios";
  export default {
  name: 'SquareGrid',
  data() {
   return {
     color:'bg-[red]',
     mainSquares: [],
     table_resulte:[],
     answersTable: { evaluation: null, rows: [] }
   };
  },
  methods:{
   getresulte(){
     axios
         .get(`api/barrier-subtest/result/${this.$route.params.id}`)
         .then((response) => {
            
           this.mainSquares = response.data
                  for (let i = 0; i < this.mainSquares.length; i++) {
                    
                    for (let x = 0; x < 5; x++) {
                      if(this.mainSquares[i].questions[x]){
                        
                      }else{
                        this.mainSquares[i].questions[x]={score:0,color:"FFFFFF"}
                      }
                    
                              
                  }         
                  }
                  console.log(this.mainSquares)
           this.mainSquares[0].questions.slice().reverse();
       
          
         })
        
         
   }
  },
  mounted() {
    this.getresulte()
    // Without the endpoint (older server) the page shows the chart only.
    axios.get(`api/barrier-subtest/latest-answers/${this.$route.params.id}`)
      .then(({ data }) => { this.answersTable = { evaluation: data?.evaluation ?? null, rows: data?.rows ?? [] }; })
      .catch(() => {});
    localStorage.getItem("child_id")
   },
  };
  </script>
  
  <style>
  .ba-card { margin-top: 2rem; padding: 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
  .ba-card h2 { margin: 0 0 1rem; font-size: 1.1rem; font-weight: 800; color: var(--sawa-primary, #135c65); }
  .ba-card h2 small { color: #64748b; font-weight: 600; }
  .ba-wrap { overflow-x: auto; }
  .ba-table { width: 100%; border-collapse: collapse; font-size: .92rem; }
  .ba-table th, .ba-table td { padding: .55rem .7rem; border: 1px solid #cbd5e1; vertical-align: top; }
  .ba-table th { background: #f1f5f9; font-weight: 800; }
  .ba-table td { text-align: start !important; }
  .ba-table td.ba-num { text-align: center !important; font-weight: 800; width: 5rem; }
  th,td{
  text-align: center !important;
  }
  </style>