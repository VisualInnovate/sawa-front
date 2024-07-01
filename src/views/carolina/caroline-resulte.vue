<template>


<div class="relative py-[4%] overflow-x-auto">
 <table class="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
     <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
         <tr>
            <th scope="col" class="px-6 py-3">
                 الفئة الرئيسية
             </th>
             <th scope="col" class="px-6 py-3">
                 العمر
             </th>
             <th scope="col" class="px-6 py-3">
                 الرمز
             </th>
             <th scope="col" class="px-6 py-3">
                 المهارة 
             </th>
             <th scope="col" class="px-6 py-3">
                   الاستجابة
             </th>
         </tr>
     </thead>
     <tbody>
           


            <tr v-for="res,index in table_resulte"  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td>
                 {{ res.category }}   
                </td>
                <td  class="px-6 py-4">
                    <td style="display: block;" v-for="r,x in res.tests">{{ r.age }}</td>
                   
                 </td>
                 <td  class="px-6 py-4">
                    <p v-for="r,x in res.tests">{{ r.symbol }}</p>
                   
                 </td>
                 <td  class="px-6 py-4">
                    <p v-for="r,x in res.tests">{{ r.skill }}</p>
                   
                 </td>
                 <td  class="px-6 py-4">
                    <p v-for="r,x in res.tests">{{ r.response }}</p>
                   
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
