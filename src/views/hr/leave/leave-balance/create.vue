<template>
  <v-card class="p-[2%]  bg-slate-50 shadow-xl gap-4" >
  
    <div :class="{'animate__animated animate__bounce animate__delay-0s':error.employee_id}" class="flex flex-column gap-2 md:w-[50%] py-[2%]">
       <label for="username">{{ $t('employee_name') }}</label>
        <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee_id" option-value="id"  :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full bg-[#f7f5f5]  " :class="{ 'p-invalid': submitted && !employee_id}" />
        <div class="mt-1 mb-5 text-red-500" v-if="error?.shift_id">{{ error.shift_id[0] }}</div>
    </div>
   

<form @submit.prevent="addItem">
  <table :class="{'animate__animated animate__bounce animate__delay-0s':error.balance}"  class="item-table w-[70%]">
    <thead>
      <tr>
        <th>leave_setup</th>
        <th>الكمية </th>
      </tr>
    </thead>
    <tbody  >
      <tr v-for="(item, index) in balance" :key="index">
      
        <td>{{ item.title }}</td>
        <td>{{ item.value }}</td>
        <td><Button @click="deleteitem(index)"  icon="pi pi-trash" class="p-button-rounded delete p-button-success m-auto" /></td>
      </tr>
      <tr >
        <td><Dropdown @update:model-value="getmaxvalue($event)"  style="direction: ltr !important;" v-model="selectedOption"  :options="filteredDays" optionLabel="title" :placeholder='$t("shift_name")' class="w-full " :class="{ 'p-invalid': submitted && !selectedOption}"/></td>
        <td><InputNumber   class="w-full" v-model="quantity" :placeholder='$t("max_value")+ "=" + maxvalue' :max="maxvalue" :class="{ 'p-invalid': submitted && !quantity}" /></td>
        <td> <Button   @click="submitted=true" type="submit" required class="create m-auto s " icon="pi pi-plus" ></Button></td>
      </tr>
    </tbody>
    
  </table>
</form>
<Button @click="submite" type="submit"  class="create m-auto w-32 my-4" :label='$t("submit")'></Button> 
</v-card>
<Toast></Toast>
</template>


<script>
import axios from "axios";
import InputNumber from "primevue/inputnumber";
import {useToast} from 'primevue/usetoast'
export default {


  data() {
    return {
      submitted:false,
      selectedOption: '',
      employee_id:'',
      maxvalue:'',
      quantity: '',
      balance: [],
      options: [] ,// قائمة الخيارات
      employees:[],
      error:{},
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
    this.quantity=''
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
      this.error={}
        axios.post(`api/leave-balance`,{
            employee_id:this.employee_id,
            balance:this.balance
        })
        .then((response) => {
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });

          }) .catch((el)=>{
            this.error=el.response.data.errors
            this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${el.response.data.message}`, life: 3000 });

          });
    }
  },

 computed: {
  filteredDays() {
    // Extract IDs from filterArray
    const filterIds = this.balance.map(filter => filter.id);

    // Filter data based on the extracted IDs
    return this.options.filter(item => !filterIds.includes(item.id));
  },
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