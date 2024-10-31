<template>
  <v-card class="p-[2%]  bg-[#FDFDFD] shadow-xl gap-4" >
  
    <div class="flex flex-column gap-2 md:w-[50%] py-[2%]">
       <label for="username">{{ $t('employee_name') }}</label>
        <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee_id" option-value="id"  :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full bg-[#f7f5f5]  " />
        <div class="mt-1 mb-5 text-red-500" v-if="error?.shift_id">{{ error.shift_id[0] }}</div>
    </div>
   


  <table  class="item-table w-[70%]">
    <thead>
      <tr>
        <th>leave_setup</th>
        <th>الكمية</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in balance" :key="index">
      
        <td>{{ item.title }}</td>
        <td>{{ item.value }}</td>
        <td><Button @click="deleteitem(index)"  icon="pi pi-trash" class="p-button-rounded delete p-button-success m-auto" /></td>
      </tr>
      <tr>
        <td><Dropdown @update:model-value="getmaxvalue($event)"  style="direction: ltr !important;" v-model="selectedOption"  :options="options" optionLabel="title" :placeholder='$t("shift_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " /></td>
        <td><InputNumber class="w-full" v-model="quantity" placeholder="الكمية" :max="maxvalue" /></td>
        <td> <Button   @click="addItem"  class="create m-auto s " icon="pi pi-plus" ></Button></td>
      </tr>
    </tbody>
  </table>
  <Button @click="submite" class="create m-auto w-32 my-4" :label='$t("submit")'></Button> 
</v-card>
</template>


<script>
import axios from "axios";
import InputNumber from "primevue/inputnumber";

  import {useToast} from 'primevue/usetoast'
export default {


  data() {
    return {
     selectedOption: '',
     employee_id:'',
     maxvalue:'',
      quantity: 0,
      balance: [],
      options: [] ,// قائمة الخيارات
      employees:[]
      // Add other validation rules for the title field
    };

  },

  methods: {
   
   getallsetup(){
    axios
        .get("api/leave-setup")
        .then((response) => {
          this.options=response.data.data
        })
   },
   getallemployees(){
    axios
        .get("api/employees/get/no-balance")
        .then((response) => {
          this.employees=response.data
        })
   },

   deleteitem(index){
      this.balance.splice(index, 1); // يحذف العنصر بناءً على الفهرس

   },
   getmaxvalue(data){
    this.quantity=0
    axios
        .get(`api/leave-setup/${data.id}`)
        .then((response) => {

            this.maxvalue= response.data.data.days ? response.data.data.days  : response.data.data.hours 
          
        })
   },
    addItem() {
      if (this.selectedOption && this.quantity > 0) {
        this.balance.push({ id: this.selectedOption.id,title:this.selectedOption.title, value: this.quantity });
        this.selectedOption = '';
        this.value = 1;
      }
    },
    submite(){
        axios.post(`api/leave-balance`,{
            employee_id:this.employee_id,
            balance:this.balance
        })
        .then((response) => {

           
          
        })
    }
  },

 
  mounted() {
    this.getallsetup()
    this.getallemployees()
  },
};
</script>
<style>

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.item-table {
  border-collapse: collapse;
}

.item-table th, .item-table td {
  padding: 5px;
  border: 1px solid #ddd;
  text-align: center;
}


</style>