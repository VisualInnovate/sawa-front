<template>


<div class="relative py-[4%] overflow-x-auto">
 <table class="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
     <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
         <tr>
            <th scope="col" class="px-6 py-3">
                 الفئة الرئيسية
             </th>
             <th scope="col" class="px-6 py-3 " style="    display: flex; justify-content: space-around;">
                  
                  <th style="margin-left: 10px !important;">
                    العمر
                  </th>
                  <th style="margin-left: 10px !important;">
                    الرمز
                  </th>
                  <th style="margin-left: 10px !important;">
                    المهاره
                </th>
                <th style="margin-left: 10px !important;">
                    الاستجابة
                </th>
             </th>
           

         </tr>
     </thead>
     <tbody>
           


            <tr v-for="res,index in table_resulte"  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td style="border: 1px  solid black;" class="font-bold text-lg">
                 {{ res.category }}   
                </td>
                <td  class=" w-[70%]">
                    <td style="display: flex;justify-content: space-around;border: 1px solid black" v-for="r,x in res.groups">
                    <td  class="w-[50%] m-auto" >{{ r.age }}</td>
                    <div style="display: inline-grid;border-left: 1px solid black;border-right: 1px solid black;" class="w-[50%]" > 
                        <p style="border: 1px solid black;" v-for="rr in r.tests">{{ rr.symbol }}</p> 
                      
                    </div>
                    <div style="display: block;" class="w-[50%]" > 
                        <p style=" height: 80px;border: 1px solid black" v-for="rr in r.tests">{{ rr.skill }}</p>
                      
                    </div>
                    <div style="display: block;" class="w-[50%]" > 
                        <p style=" height: 80px;border: 1px solid black" class="m-auto" v-for="rr in r.tests">{{ rr.response }}</p> 
                      
                    </div>
                    </td>
                    
                   
                 </td>
                 <td  class="px-6 py-4">
                    
                   
                 </td>
                 <td  class="px-6 py-4">
                    <p v-for="r,x in res.tests">{{ r.skill }}</p>
                   
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
       .get(`api/carolina-category/flow-chart/${this.$route.params.id}`)
       .then((response) => {
         console.log(response.data)
         this.table_resulte = response.data.data
        
       })
     
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
