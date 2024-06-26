<template>
<div class="grid grid-cols-7 gap-4">
    <div class="shadow-md py-2" v-for="abll in mainSquares">
        <p class="m-auto text-center w-full py-2">{{ abll?.category }}</p>
        <div    >
            <div v-for=" count in abll.missions" class="">
                <div class="flex">
                    
                    <p class="px-2">{{ count.mission_key }}</p>
                    <div class=" bg-white  grid w-[100px] "   :class="[ `grid-cols-${count.mission_degree.length-1}`]">
                        
                        <div v-for=" x,index in count.mission_degree.length-1" class=" w-full flex items-center justify-center " :style="{ border: '1px solid black',  backgroundColor:  index < count.answer_score? `#${count.answer_color}` :'' }"></div>

                    </div>

                </div>
                 
            </div>
        
        
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
      colums:2,
      color:'bg-[red]',
      mainSquares: [],
      table_resulte:[]
    };
  },
  methods:{
    getresulte(){
      axios
          .get(`api/able-category/flow-chart/${this.$route.params.id}`)
          .then((response) => {
            
            this.mainSquares = response.data.data
            
           
          })
          axios
          .get(`api/api/evaluations/report/${this.$route.params.id}`)
          .then((response) => {
            
            this.mainSquares = response.data.data
            
           
          })
         
         
    }
  },

  mounted() {
     this.getresulte()
    },
};
</script>