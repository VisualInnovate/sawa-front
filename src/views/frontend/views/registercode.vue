<template>
 <Map></Map>
<div class="py-16 animate__animated animate__bounceInRight">
    <div class="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
       
          
        <div class="w-full p-8 lg:w-1/2">
        
            <p class="text-2xl text-gray-600 text-center">{{ $t("Enter_the_activation_code") }}</p>
          
            <div class="mt-4 flex items-center justify-between">
                <span class="border-b w-1/5 lg:w-1/4"></span>
                <p class="text-xl py-2">
                   <router-link :to="{ name: 'SingUp' }" class="text-xl text-[#135C65] uppercase"> {{ $t("Create_an_account") }}</router-link>
                </p>
                <span class="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div class="flex justify-center gap-2 py-6">
                <input v-model="parent.num1" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
                <input v-model="parent.num2" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
                <input v-model="parent.num3" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
                <input v-model="parent.num4" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
            </div>
            
            <div class="flex flex-column gap-2 w-full ">
                    <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                    <Button @click="parentStore.register(parent)" class="create m-auto w-full " :label='$t("Register_now")'></Button>
                    <small id="username-help"></small>
                </div>
            
            <div class="mt-2 flex items-center justify-between">
                
                <p class="text-xl w-full text-center">
                   <router-link :to="{ name: 'forgetpassword' }" class="text-xl text-[#135C65]  uppercase"> {{ $t("Resend_the_code") }}</router-link>
                </p>
              
               
            </div>
        </div>
        <div class="hidden bg-[url('../image/childern.jpg')] lg:block lg:w-1/2 bg-cover" style="background-position: center; background-size: cover" ></div>
    </div>
</div>
</template>
<script>
import axios from "axios";
import { useParentStore } from "../../../stores/ParentStore";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InlineMessage from "primevue/inlinemessage";
import { useStorage } from "@vueuse/core";
import Map from '../components/Map.vue'; 
export default {
  components: {Map, Button, InputText, InlineMessage },
  data() {
    return {
      email_parent: useStorage("email_parent", ),
      alert: {},
      alert_text: null,
      alert: {},
      errors:{},
      parentStore: useParentStore(),
      parent: {},
    };
  
  },
  methods:{
          createtreatment() {

      axios.post("/api/parent/register",this.parent).then((res) => {
        this.email_parent=this.parent.email
        this.$router.push({ name: 'register-code' });
      }).catch((el)=>{
   
         this.errors = el.response.data.errors
      })
      },


  }
};
</script>
  <style>
  .otp-input {
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 0 10px;
    font-size: 20px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  
  /* Background colour of an input field with value */
  .otp-input.is-complete {
    background-color: rgb(226, 219, 219);
  }
  
  .otp-input::-webkit-inner-spin-button,
  .otp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input::placeholder {
    font-size: 15px;
    text-align: center;
    font-weight: 600;
  }
  </style>
  