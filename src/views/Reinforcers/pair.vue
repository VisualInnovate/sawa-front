<template>
     <Stimulu></Stimulu>
    <v-card class="grid grid-cols-1 lg:grid-cols-4 gap-4">
     <div class="m-auto">
        <div class="flex justify-between flex-column gap-2">
                 <label for="username">{{ $t('child_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="pair.child_id"  option-value="id" :options="childs" optionLabel="name" :placeholder='$t("child_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.child_id">{{ error.child_id[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('Evaluation_date') }}</label>
                    <Calendar  style="width: 100%" showButtonBar v-model.number="pair.date" showIcon  :placeholder='$t("Evaluation_date")'   />   
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
                </div> 
    </div>
    <div class="lg:col-span-2 m-auto">
        <div class="flex">
            <Button  :disabled="count <= 2"  @click="deletearray"  class="delete m-auto  " icon="pi pi-minus" label="ازالة عنصر"></Button>
            <Button   @click="addarray"  class="create m-auto  " icon="pi pi-plus" label="اضافة عنصر" ></Button>
        </div>
        <div v-for="item,index in items" class="flex border-b-2 border-black">
            <Dropdown v-model="items[index].value" class="hover:ring-0 w-52"  option-value="id"  :options="stimulus" optionLabel="name" :placeholder=" ' select ' + ' '+item.name "  />
             
          <p class="my-auto w-16" > item : {{ item.name }} </p>
        </div>
        <div class="mt-1 mb-5 w-full text-center text-red-500" v-if="error?.result">{{ error.result[0] }}</div>
        
    </div>

<div class="relative overflow-x-auto">
    <table class="min-w-3xl text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              
                <th scope="col" class="px-6 py-3">
                    الرقم
                </th>
                <th scope="col" class="px-6 py-3">
                    العنصر المختار
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th  scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div v-for="pair,index in pairs" :key="pair.join('-')">
                        {{ index+1 }}

                    
                    </div>
                </th>
                <th  scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div v-for="pair,index in pairs" :key="pair.join('-')">
                        <div class="flex">
                            <div>
                                <span>{{ pair[1] }}</span>
                                <input @change="getanswer(index,pair[1])" style="border: 1px solid black " class="mx-2" type="radio"  :name="index" :value="pair[1]" >
                            </div>
                            <span>  </span>
                            <div class="px-[1%]">
                                <span>{{ pair[0] }}</span>
                                <input @change="getanswer(index,pair[0])"  style="border: 1px solid black " class="mx-2" type="radio"  :name="index" :value="pair[0]" >
                            </div>
                            
                           
                        </div>

                    
                    </div>
                </th>
               
               
            </tr>
            
            <div class="mt-1 mb-5 w-full text-center text-red-500" v-if="error?.result">{{ error.result[0] }}</div>
        </tbody>
        
    </table>
</div>

         <div></div>

         <div>            <Button @click="createevalation" class="col-span-2 mb-2 create m-auto w-full " :label='$t("submit")'></Button></div>


    </v-card>

    <v-card v-if="result" class="my-[2%] py-[2%]">
        <div class="flex py-2">
            <h2 class="font-bold px-1 ">highest preferred :</h2>
            <span v-if="result?.highest_preferred ">letter: {{ result?.highest_preferred[0].letter }} </span>
            <span>    </span>
            <span v-if="result?.highest_preferred"> percentage {{ result?.highest_preferred[0].percentage }}  </span>
                  
        </div>
        <div class="flex py-2">
            <h2 class="font-bold px-1 ">moderately preferred :</h2>
            <p> {{ result.moderately_preferred }}</p>
                  
        </div>
        <div class="flex py-2">
            <h2 class="font-bold px-1 ">lowest preferred :</h2>
            <p> {{ result.lowest_preferred }}</p>
                  
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
        count:2,
        pair:{
            result:[],
            values:[]
        },
        namesToCheck: [],
        result:{},
        childs:[],
        charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        stimulus:[],

        items: [
            {name:'A', value: ' ' },
            {name:'B', value: ' ' }],
        arr: ['A','B'],
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
          if( this.items.length > 2){
            this.items.length--
            this.arr.length--
            this.count--
            this.generatePairs()
          }
         
        },
        addarray(){
           
           
            this.items.push({ name: `${this.charset[this.count]}`, value: ' ' });
            this.arr.push(this.charset[this.count]);
            this.generatePairs()
            this.count ++
           
            
        },
        getanswer(id,value){
            
            this.pair.result[id]=value
            console.log( this.items)
        },
        getchilde(){
            axios
          .get("api/child")
          .then((response) => {
           
            this.childs = response.data.children
           
          })
          axios
          .get("api/stimulus")
          .then((response) => {
           
            this.stimulus = response.data.data
           
          })
        },
        createevalation(){

            this.pair.date= moment(this.pair.date).format("Y-MM-DD") ,
            this.pair.specialist_id=localStorage.getItem("user_id") ,
            this.pair.type=0
            this.pair.values=this.items
            axios.post("api/stimulus-test" ,this.pair).then((response) => {
            console.log(response.data.data)
            this.result = response.data.data
           
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
       
        this.generatePairs()
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
  