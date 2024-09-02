<template>
    <Stimulu></Stimulu>
     
      <Button icon="pi pi-angle-left" @click="gosession" class=" my-4  m-auto create  " :label='$t("العودة للجلسة")'></Button>
  
    <v-card class="p-[2%]">
        <!-- <div class="m-auto bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="flex  flex-column gap-2">
                <label for="username">{{ $t('child_name') }}</label>
                   <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="pair.child_id" disabled option-value="id" :options="childs" optionLabel="name" :placeholder='$t("child_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                     <div class="mt-1 mb-5 text-red-500" v-if="error?.child_id">{{ error.child_id[0] }}</div>
               </div>
               
       </div> -->

       <!-- items -->
       <div class="m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div>
            <Button   @click="addarray"  class="create m-auto  " icon="pi pi-plus" ></Button>
            <Button  :disabled="count <= 0"  @click="deletearray"  class="delete m-auto  " icon="pi pi-minus" ></Button>
            <Dropdown v-model="stimul" class="hover:ring-0 w-52 mx-2" filter option-value="name"  :options="stimulus" optionLabel="name"  placeholder="select item" />
      
        </div>
        <div class='bg-white p-2 flex justify-between rounded-sm' v-for="item,index in items" >
            <div class="flex">
                <h3 class="my-auto font-bold">{{ $t("name") }} :</h3>
                <p class="font-bold text-sm my-auto  text-green-600 " style=" word-wrap: unset">   {{item.value  }}</p>
            </div>
            <div class="flex">
                <h3 class="my-auto font-bold">{{ $t("ترتيب المعزز") }} :</h3>
                <p class="font-bold  my-auto  text-green-600">   {{item.name  }}</p>
            </div>
            
        </div>
          
       </div>
       <!-- table -->
       <div class="m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div class="shadow-md bg-[#FFFFFF] rounded-sm p-2 min-h-[250px]">
          <div class="flex justify-between py-2">
          <div class="flex">
            <h2 class="font-bold px-1 ">{{$t("highest_preferred") }} :</h2>
            <span class="font-bold text-[green]" v-if="result?.highest_preferred "> {{ result?.highest_preferred[0].letter }} </span>
          </div>
           <div class="flex">
            <h4 class="text-xl ">{{ $t("percentage") }} :</h4>
             <span class="m-auto text-xl text-[green] font-bold" v-if="result?.highest_preferred">  {{ result?.highest_preferred[0].percentage }}  </span>
           </div>
                 
       </div>
       
       <div  class="flex justify-between py-2">
          <div class="flex">
            <h2 class="font-bold px-1 ">{{ $t("moderately_preferred") }} :</h2>
            <span class="font-bold text-[green]" v-if="result?.moderately_preferred "> {{ result?.moderately_preferred[0].letter }} </span>
          </div>
           <div class="flex">
            <h4 class="text-xl ">{{ $t("percentage") }} :</h4>
             <span class="m-auto text-xl text-[green] font-bold" v-if="result?.moderately_preferred">  {{ result?.moderately_preferred[0].percentage }}  </span>
           </div>
                 
       </div>
       <div class="flex justify-between py-2">
          <div class="flex">
            <h2 class="font-bold px-1 ">{{ $t("latest_preferred") }} :</h2>
            <span class="font-bold text-[green]" v-if="result?.lowest_preferred "> {{ result?.lowest_preferred[0].letter }} </span>
          </div>
           <div class="flex">
            <h4 class="text-xl ">{{ $t("percentage") }} :</h4>
             <span class="m-auto text-xl text-[green] font-bold" v-if="result?.lowest_preferred">  {{ result?.lowest_preferred[0].percentage }}  </span>
           </div>
                 
       </div>
    
       <Button @click="createevalation" class=" mt-4 m-auto create  w-full " :label='$t("submit")'></Button>
        </div>
      <div>
        <table class="w-full h-full rounded-md shadow-md text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400">
       <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
           <tr>
             
               <th scope="col" class="px-6 py-3">
                {{ $t("index") }}
                             </th>
               <th scope="col" class="px-6 py-3">
                {{ $t('Selected_item') }}
               </th>
           </tr>
       </thead>
       <tbody>
           <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
               <th  scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   <div v-for="pair,index in arr" >
                       {{ index+1 }}

                   
                   </div>
               </th>
               <th  scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                 <div class="w-full text-center">
                    <span class="w-full text-center" v-for="x,c in arr.length" >
                       <div class="flex">
                           <span v-for="pair,index in arr"  >
                               <span>{{ pair }}</span>
                               <input @change="getanswer(c,pair)" style="border: 1px solid black " class="mx-2" type="radio"  :name="c" :value="pair[1]" >
                           </span>
                           <span>  </span>
                          
                           
                          
                       </div>

                   
                   </span>
                 </div>
               </th>
              
              
           </tr>
           
           <div class="mt-1 mb-5 w-full text-center text-red-500" v-if="error?.result">{{ error.result[0] }}</div>
       </tbody>
       
   </table>
      </div>
     
       </div>
    </v-card>
  

  
 </template>
 
 <script>
 import axios from "axios";
 import moment from "moment";
 import Stimulu from '../../components/Stimulu.vue'

 export default {
   components:{Stimulu},
 
 
   data() {
     return {
       error:{},
       count:0,
       pair:{
           result:[],
           values:[]
       },
       namesToCheck: [],
       result:{},
       childs:[],
       charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
       stimulus:[],
      stimul:' ',
      
       items: [],
       arr: [],
        pairs: [],
       // Add other validation rules for the title field
     };
 
   },

 
   methods: {
       getdatafilter(id){
           this.namesToCheck.push(id)
           this.missingNames()
       },
       missingNames() {
           this.stimulus=this.stimulus.filter(item => !this.namesToCheck.includes(item.id));
           
       },
       deletearray(){
         if( this.items.length > 0){
           this.items.length--
           this.arr.length--
           this.count--
           this.generatePairs()
           this.getchilde()
         }
        
       },

       addarray(){
          
        if(this.stimul !== ' ' ){
           this.items.push({ name: `${this.charset[this.count]}`,  value:`${this.stimul}` } );
           this.arr.push(this.charset[this.count]);
           this.generatePairs()
           this.count ++
            this.stimul=' '
           const valuesToFilter = this.items.map(item => item.value);
           this.stimulus=this.stimulus.filter(item => !valuesToFilter.includes(item.name));
        }
           
       },
      
       getanswer(id,value){
           console.log(value)
           this.pair.result[id]=value
           console.log( this.items)
       },
       getchilde(){
           axios
         .get("api/child")
         .then((response) => {
          
           this.childs = response.data.children
           this.pair.child_id=parseInt(localStorage.getItem("child_id")) 
          
         })
         axios
         .get("api/stimulus")
         .then((response) => {
          
           this.stimulus = response.data.data
           const valuesToFilter = this.items.map(item => item.value);
           this.stimulus=this.stimulus.filter(item => !valuesToFilter.includes(item.name));
          
         })
       },

       gosession(){
        this.$router.push({name:'sessions-update',params:{'id':this.$route.params.id} });
       },
       createevalation(){

           this.pair.date= moment(this.pair.date).format("Y-MM-DD") ,
           this.pair.session_id=this.$route.params.id,
           this.pair.type=1
           this.pair.values=this.items
           axios.post("api/stimulus-test" ,this.pair).then((response) => {
           console.log(response.data.data)
           this.result = response.data.data
           this.stimulus_id=response.data.data.id
          
          
         }).catch((el)=>{
               this.error = el.response.data.errors
           })
       },

       generatePairs() {
     const combinations = (arr) => {
       let result = [];
       for (let i = 0; i < arr.length; i++) {
         for (let j = i + 1; j < arr.length; j++) {
           result.push([arr[i], arr[j]]);
         }
       }
       return result;
     };

     this.pairs = combinations(this.arr);
   },
    
    
   },
   mounted() {
      
       
       this.getchilde()
      
   },
 };
 </script>
 
 <style scoped>
 th,td{
 text-align: center !important;
}
.p-dropdown{
   border: 0 !important;
   padding: 0 !important;

}

svg{

   visibility: hidden !important;
  
}

 </style>
 