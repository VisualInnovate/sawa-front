<script>
import axios from "axios";
import InputText from "primevue/inputtext";
import moment from "moment";
import {useToast} from 'primevue/usetoast'
import DatePicker from 'primevue/datepicker';
import { max } from "date-fns";
export default {
  components: { InputText, DatePicker },
  data() {
    return {
    pasrents:{},
   
    submitted:false,
    toast:useToast(),
     modules:[],
     option_en:'',
     option_ar:'',
     field_types:[
     { name: this.$t("input_type.text"), value: "text" },
     { name: this.$t("input_type.number"), value: "number" },
     { name: this.$t("input_type.date"), value: "date" },
     { name: this.$t("input_type.select"), value: "select" },
     { name: this.$t("input_type.file"), value: "File" },
     ],
    cities:{},
    error:{},
    custom: {
        key:{},
        
    },
    lan:[],
    snackbar: true,
  };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    addItem() {
        this.custom.options=[]
      if (this.option_ar && this.option_en ) {
        this.custom.options.push({ en: this.option_en,ar:this.option_ar });
        this.option_en  = '' 
        this.option_ar = ''
      }
    },
    deleteitem(index){
        this.custom.options.splice(index, 1); // يحذف العنصر بناءً على الفهرس

   },
    getlang(){
     
      
        axios
        .get(`/api/all-modules`)
        .then((res) => {
          console.log(res.data.countries)
          this.modules = res.data.data
         
        })
        axios
       
    },
    submit() {
      


      axios.post(`/api/attributes`, this.custom).then((res) => {
        this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
      }).catch((el)=>{
        this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });

      })
    },
  },
  mounted() {
    this.getlang()
    console.log(moment(new Date()).format(" YYYY-MM-DD"));
  },
};
</script>
<template>


  <div class="sawa-card p-[1%]">


     
    
      <form @submit.prevent="submit" class="animate__animated animate__zoomIn  p-[2%] bg-slate-50 grid grid-cols-1 lg:grid-cols-2 gap-3 shadow-lg"  >
      
        
           <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('attributable_type') }}</label>
                    <Select filter required v-model="custom.attributable_type"  option-value="value" :options="modules" optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !custom.attributable_type }" />

            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('field_type') }}</label>
                    <Select required v-model="custom.field_type"  option-value="value" :options="field_types" optionLabel="name" class="w-full" :class="{ 'p-invalid': submitted && !custom.field_type }" />
            </div>
           
          <div class="flex flex-row gap-4 w-full">
            <div class="flex flex-column gap-2 w-full">
                <div class="flex">
                    <label class="px-1"  for="username">{{ $t('field_name')}} </label>
                    <label for="username">{{ $t("in_english") }}</label>
                </div>
                    <InputText  required v-model="custom.key.en"  />
            </div> 
            <div class="flex flex-column gap-2 w-full">
                <div class="flex">
                    <label class="px-1" for="username">{{ $t('field_name')}} </label>
                    <label for="username">{{ $t("in_arabic") }}</label>
                </div>
                    <InputText  required v-model="custom.key.ar"  />
            </div> 
          </div>
           <div class="flex flex-row gap-8">
            <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('required') }}</label>
                    <ToggleSwitch required class=" px-3" v-model="custom.is_required"/>   
            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('show_in_table') }}</label>
                    <ToggleSwitch required class=" px-3" v-model="custom.show_in_table"/>   
            </div>
           </div>
           <p>{{ $t("choices") }}</p>
           <table   class="item-table col-span-2 w-[70%]">
            
                <thead>
                <tr>
                    <th>
                        <div class="flex">
                            <label class="px-1"  for="username">{{ $t('option')}} </label>
                            <label for="username">{{ $t("in_arabic") }}</label>
                        </div>
                    </th>
                    <th>
                        <div class="flex">
                            <label class="px-1"  for="username">{{ $t('option')}} </label>
                            <label for="username">{{ $t("in_english") }}</label>
                        </div>
                    </th>
                    
                    
                </tr>
                </thead>
                <tbody  >
                    
                <tr v-for="(item, index) in custom.options" :key="index">
                
                    <td>{{ item.ar }}</td>
                    <td>{{ item.en }}</td>
                    <td><Button @click="deleteitem(index)"  icon="pi pi-trash" class="m-auto" rounded severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" /></td>
                </tr>
                <tr >

                    <td><InputText   class="w-full" v-model="option_ar"  :class="{ 'p-invalid': submitted && !option_ar}" /></td>
                    <td><InputText   class="w-full" v-model="option_en"  :class="{ 'p-invalid': submitted && !option_ar}" /></td>
                    <td> <Button   @click="addItem"  required class="m-auto s" icon="pi pi-plus"></Button></td>
                </tr>
                </tbody>
                
        </table>
          
          
       <div class="card text-center py-3">
        <Button type="submit" @click="submitted =true" :label='$t("submit")' class="w-[90%] lg:w-[50%]" />
      </div>   
      </form>
      <Toast/>
    
  </div>
</template>
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