<script setup>
import axios from "axios";
import InputMask from 'primevue/inputmask';
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import moment from "moment";
const name=ref('')
const x=ref(true)
const countaire=ref(1)
const shift24=ref({})
const shift = ref({name: null,timeZone :Intl.DateTimeFormat().resolvedOptions().timeZone , days: [
    {week_end:false,clock_in:null,clock_out:null,day:'Saturday'},
    {week_end:true,clock_in:null,clock_out:null,day:'Sunday'},
    {week_end:true,clock_in:null,clock_out:null,day:'Monday'},
    {week_end:true,clock_in:null,clock_out:null,day:'Tuesday'},
    {week_end:true,clock_in:null,clock_out:null,day:'Wednesday'},
    {week_end:true,clock_in:null,clock_out:null,day:'Thursday'},
    {week_end:false,clock_in:null,clock_out:null,day:'Friday'},

  ]});
const submitted = ref(false);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const dayspush=ref([])
const directorate=ref({})
const days = ref([
   
    { name: 'Sunday', value: 'Sunday' },
    { name: 'Monday', value: 'Monday' },
    { name: 'Tuesday', value: 'Tuesday' },
    { name: 'Thursday', value: 'Thursday' },
    { name: 'Wednesday', value: 'Wednesday' },
    { name: 'Friday', value: 'Friday' },
    { name: 'Saturday', value: 'Saturday' }
   
]);
const selectedCity = ref();
const cities = ref([
    { name: 'Normal Shift', value: '1' },
    { name: '24 Shift', value: '2' },
    { name: 'directorate shift', value: '3' },
]);

const increasecount=()=>{
  
  dayspush.value.push(shift24.value)
  shift24.value=ref({})
  console.log(dayspush.value)  
  x.value=true

}

const decreasecount=()=>{
  dayspush.value.length=  dayspush.value.length - 1
}
const createdirectorate=()=>{
  axios.post(`/dashboard/directorate/shift`,directorate.value)
      .then((res) => {
        toast.add({severity: 'success', summary: 'Success', detail: 'created Successfully', life: 3000});
        router.go(-1)
      })
      .catch((error) => {
        console.error(error);
      });

}

const createshift = () => {
  dayspush.value.push(shift24.value)
  x.value=false
  shift24.value=ref({})
  axios.post(`/dashboard/custom/shift`,{
     name:name.value,
     days:dayspush.value
  })
      .then((res) => {
        toast.add({severity: 'success', summary: 'Success', detail: 'created Successfully', life: 3000});
        router.go(-1)
      })
      .catch((error) => {
        console.error(error);
      });
};
//
// onMounted(getData);
const submit = ()=>{
  submitted.value = true;
  let flag=0
  if(!shift.value.title) flag++
  shift.value.days.forEach((elem)=>{
    if (elem.week_end &&(!elem.clock_out || ! elem.clock_in))flag++;

  });
  if (flag)
    return
  axios.post(`/api/shifts`,shift.value)
      .then((res) => {
        toast.add({severity: 'success', summary: 'Success', detail: 'created Successfully', life: 3000});
        router.go(-1)
        console.log(shift.value);
      })
      .catch((error) => {
        toast.add({severity: 'error', summary: 'Success', detail: error, life: 3000});
      });

  console.log(shift);
}
const changeStatus= (index)=>{
  shift.value.days[index].clock_in=null;
  shift.value.days[index].clock_out=null;
}
</script>


<template>
  <div>
    <Toast/>
    <form>

  


    <v-card style="overflow-x: scroll;"  class="bg-slate-50">
        <div class="card " >
        <div class="w-full  m-5">

          <p class="" for="name">{{ $t("title") }}</p>
          <InputText v-model="shift.title" id="name" required :class="{ 'p-invalid': submitted && !shift.title}"/>
  
        </div>
        <div v-for="(day,index) in shift.days" class="flex align-items-center mb-2 ">
          <div class="field mx-5 " >
            <input type="checkbox" style="border: 1px solid black;" v-model="day.week_end" :binary="true" @click="changeStatus(index)"/>
          </div>
          <div class="field mr-7 w-24">
            {{day.day}}
          </div>

          <div class="field mx-5 "  v-if="!day.week_end"  >
            <label class="mx-5"  >Clock In</label>
            <InputText type="time"  v-model.trim="day.clock_in" timeOnly  disabled autofocus  />

          </div>


          <div class="field mr-5 " v-else>
            <label class="mx-5">Clock In</label>
            <InputText type="time" v-model.trim="day.clock_in" required timeOnly autofocus  hourFormat="12" :class="{ 'p-invalid': submitted && !day.clock_out}"/>
            

          </div>

          <div class="field" v-if="!day.week_end" >
            <label class="mx-2.5 w-10"  >Clock Out</label>
            <InputText  type="time" v-model.trim="day.clock_out" timeOnly   disabled autofocus  />

          </div>
          <div class="field" v-else>
            <label class="mx-5">Clock Out</label>
            <InputText type="time" v-model.trim="day.clock_out" timeOnly  required hourFormat="12" autofocus :class="{ 'p-invalid': submitted && !day.clock_out}"/>
            
          </div>

        </div>
        <Button class="create m-5" type="submit" @click.prevent="submit()" >Submit</Button>

      </div>
    </v-card>
      
    
    </form>

    <div class="card mt-4" v-if="selectedCity == 2">
      <div style="display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) ; gap: 8px;padding: 10px;">
        <div class="flex flex-column gap-2">
          <label for="username">Name</label>
          <InputText id="username" v-model="name" aria-describedby="username-help" />
          
      </div>
      <div style="visibility: hidden;" class="flex flex-column gap-2">
          <label for="username">Name</label>
          <InputText id="username" v-model="name" aria-describedby="username-help" />
          
      </div>
      </div>
      <div v-if="dayspush" v-for="(day, index) in dayspush" style="display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) ; gap: 8px;padding-bottom: 10px !important;padding: 10px !important; border-bottom: 2px solid black;" class=" m-auto   w-[90%]">
       
      <div class="flex flex-column gap-2 ">
        <label for="username">start Day</label>
        <Dropdown required v-model="day.start_day" editable :options="days" optionLabel="name"
                        option-value="value"
                       />
       </div>
          <div class="flex flex-column gap-2 ">
        <label for="username">Start Time</label>
        <InputText type="time" timeOnly  v-model="day.start_time"   autofocus  />
          </div>


          <div class="flex flex-column gap-2 ">
        <label for="username">End Day</label>
        <Dropdown required v-model="day.end_day" editable :options="days" optionLabel="name"
                        option-value="value"
                      />
          </div>
          <div class="flex flex-column gap-2 ">
        <label for="username">End Time</label>
        <InputText type="time" timeOnly  v-model="day.end_time"  autofocus  />
          </div>
       
          
          
      </div>
     <div v-if="x" style="display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) ; gap: 8px;padding-bottom: 10px !important;padding: 10px !important; border-bottom: 2px solid black;" class=" m-auto   w-[90%]">
      
      <div class="flex flex-column gap-2 ">
        <label for="username">start Day</label>
        <Dropdown required v-model="shift24.start_day" editable :options="days" optionLabel="name"
                        option-value="value"
                       />
       </div>
          <div class="flex flex-column gap-2 ">
        <label for="username">Start Time</label>
        <InputText type="time" timeOnly  v-model="shift24.start_time"   autofocus  />
          </div>


          <div class="flex flex-column gap-2 ">
        <label for="username">End Day</label>
        <Dropdown required v-model="shift24.end_day" editable :options="days" optionLabel="name"
                        option-value="value"
                      />
          </div>
          <div class="flex flex-column gap-2 ">
        <label for="username">End Time</label>
        <InputText type="time" timeOnly  v-model="shift24.end_time"  autofocus  />
          </div>
       
          
          
      </div>
      <div   class="flex  gap-2 "  style="display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) ; gap: 8px;padding: 10px;">
     
        <div>
        <Button style="background-color: #22C55E;" icon="pi pi-plus"  @click="increasecount"></Button>
         <Button v-if="dayspush.length !=0" severity="danger" icon="pi pi-minus" class=" mx-4" @click="decreasecount"></Button>  
        </div>
     <div class="flex flex-column gap-2 ">
        
        <Button  label="create shift" class="w-full" @click="createshift"></Button>
        </div>
     </div>
      
    </div>
    <div class="card mt-4" v-if="selectedCity == 3">
      
     <div class="lg:w-6 w-full">
      <div class="flex flex-column gap-2">
          <label for="username">Name</label>
          <InputText id="username" v-model="directorate.name" aria-describedby="username-help" />
          
      </div> 
      <div class="flex flex-column gap-2 ">
        <label for="username">Clock In</label>
        <InputText type="time" timeOnly  v-model="directorate.clock_in"   autofocus  />
      </div>
      <div class="flex flex-column gap-2 ">
        <label for="username">Clock Out</label>
        <InputText type="time" timeOnly  v-model="directorate.clock_out"   autofocus  />
      </div>
      <Button  label="create shift" class="w-full my-4" @click="createdirectorate"></Button>
     </div>
     
 
     
     
      
      
    </div>
  </div>

</template>


<style scoped lang="scss">

</style>
