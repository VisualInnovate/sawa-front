<template>
<v-card class="p-[1%]">

  <div class="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-5 gap-4">
    <div v-if="mainSquares" class="shadow-md py-2" v-for="abll in mainSquares">
        <p class="m-auto text-center w-full py-2">{{ abll?.category }}</p>
        <div    >
            <div v-for=" count in abll.missions" class="">
                <div class="flex">
                    
                    <p class="px-2 w-16">{{ count.mission_key }}</p>
                    <div class=" bg-white  grid w-[200px] "   :class="[ `grid-cols-${count.mission_degree.length-1}`]">
                        
                        <div v-for=" x,index in count.mission_degree.length-1" class=" w-full flex items-center justify-center " :style="{ border: '1px solid black',  backgroundColor:  index < count.answer_score? `#${count.answer_color}` :'' }"></div>

                    </div>

                </div>
                 
            </div>
        
        
    </div>
    
    </div>
    
    
</div>
</v-card>
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

  beforeMount() {
     this.getresulte()
      
    },
    mounted(){
      this.getresulte()
    }
  
};
</script>