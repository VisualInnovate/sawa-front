<template>
<div v-for="x,n in mainSquares">
  <div>
            <h1 class="w-full py-3 text-3xl font-bold text-center">LEVEL {{ n+1 }}</h1>
        
      </div>

      <div  class="grid grid-cols-10 "  style="border: 1px 1px 0px 0px solid black;">
      
      <div  class="grid grid-cols-1">
        <div class="w-20 h-16 text-center" style="overflow: hidden;font-size: 13px;" ></div>
      <div class="w-20 h-16  m-auto text-center " v-for="(mainSquare, index) in   mainSquares[n]?.subtests[0].questions" :key="index">
        
        <p class=" h-full text-center pt-7">{{ index+1  }}</p>
      
      </div>
    </div>
    <div  class="grid grid-cols-1" v-for="mil,index in mainSquares[0]?.subtests ">
         
      <div class="w-20 h-20 text-center" style="overflow: hidden;font-size: 13px;" >{{ mainSquares[n]?.subtests[index]?.subtest_name }}</div>

      <div style="border: 1px solid black !important;" class="w-20 h-16 border border-black flex flex-col justify-between" v-for="(mainSquare, index) in mainSquares[n]?.subtests[index].questions" :key="index">
        
      
        <div class="h-1/2 border border-blue-500 "  :style="{ border: '1px dotted black',  backgroundColor: mainSquare.answer_score == 1 ? `#${mainSquare.answer_color}` : (mainSquare.answer_score == 0.5 || mainSquare.answer_score == 0 ? '' : '')}"></div>
        <div class="h-1/2 border border-blue-500 " :style="{ border: '1px dotted black', backgroundColor: mainSquare?.answer_score == 1 || mainSquare?.answer_score == 0.5 ? `#${mainSquare?.answer_color}` : '' }"></div>

      </div>
    </div> 



    



   
   
    
  
    
    
   
</div> 
</div>
<div class="relative py-[4%] overflow-x-auto">
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
</div>
</template>

<script>
  import axios from "axios";
export default {
  name: 'SquareGrid',
  data() {
    return {
      color:'bg-[red]',
      mainSquares: [],
      table_resulte:[]
    };
  },
  methods:{
    getresulte(){
      axios
          .get(`api/mileston-levels/flow-chart/${this.$route.params.id}`)
          .then((response) => {
            console.log(response.data.data[0].subtests)
            this.mainSquares = response.data.data
            
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
          axios
          .get(`api/evaluations/report/${this.$route.params.evla_id}`)
          .then((response) => {
            console.log(response.data)
            this.table_resulte = response.data
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
    }
  },
  mounted() {
     this.getresulte()
    },
};
</script>

<style>
th,td{
  text-align: center !important;
}
</style>
