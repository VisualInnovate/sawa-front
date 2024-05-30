<template>
       <div>
            <h1 class="w-full py-3 text-3xl font-bold text-center">LEVEL 1</h1>
      </div>
<div class="grid grid-cols-9 "  style="border: 1px 1px 0px 0px solid black;">
      
      <div  class="grid grid-cols-1">
      
      <div class="w-20 h-20  m-auto text-center " v-for="(mainSquare, index) in  mainSquares[0]?.questions" :key="index">
      <p class="m-revert h-full text-center pt-10">{{ index+1  }}</p>
      
      </div>
    </div>
    <div v-for="(x ,index) in 5" class="grid grid-cols-1">
      <div class="w-20  text-center">{{ mainSquares[0]?.subtest_name }}</div>
      <div style="border: 1px solid black !important;" class="w-20 h-20 border border-black flex flex-col justify-between" v-for="(mainSquare, index) in mainSquares[0]?.questions" :key="index">
        
        <div style="border: 1px dotted black !important; " class="h-1/2 border border-blue-500 " :class="{[`bg-[#${mainSquare?.answer_color}]`]: mainSquare.answer_score == 1,'': mainSquare.answer_score == 0.5 || mainSquare.answer_score == 0 }"></div>
        <div class="h-1/2 border border-blue-500" :class="{[`bg-[#${mainSquare?.answer_color}]`]: mainSquare.answer_score == 1 || mainSquare.answer_score == 0.5,'':mainSquare.answer_score == 0 }"></div>
      </div>
    </div>
   
   
    
  
    
    
   
</div>
</template>

<script>
  import axios from "axios";
export default {
  name: 'SquareGrid',
  data() {
    return {
      mainSquares: [],
    };
  },
  methods:{
    getresulte(){
      axios
          .get("api/mileston-levels/flow-chart/1")
          .then((response) => {
            console.log(response.data.data)
            this.mainSquares = response.data.data[0].subtests
           
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

<style scoped>
</style>
