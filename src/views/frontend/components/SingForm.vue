
<script>
import axios from "axios";
import { useParentStore } from "../../../stores/ParentStore";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InlineMessage from "primevue/inlinemessage";
import { useStorage } from "@vueuse/core";
export default {
  components: { Button, InputText, InlineMessage },
  data() {
    return {
      submitted:false,
      email_parent: useStorage("email_parent", ),
      alert: {},
      alert_text: null,
      alert: {},
      error:{},
      parentStore: useParentStore(),
      parent: {
        fname: null,
        lname: null,
        phone: null,
        email: null,
        password: null,
        password_confirmation: null,
      },
    };
  
  },
  methods:{
    createRow() {

      axios.post("/api/parent/register",this.parent).then((res) => {
        this.email_parent=this.parent.email
        this.$router.push({ name: 'register-code' });
      }).catch((el)=>{
   
        this.$toast.add({ severity: 'error', summary: this.$t("error"), detail:  `${el.response.data.message}`, life: 3000 });

      })
      },


  }
};
</script>
<template>
  <!-- https://play.tailwindcss.com/MIwj5Sp9pw -->
  <div class="py-8 animate__animated animate__bounceInRight">
      <div class="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-5xl">
         
            
          <form @submit.prevent="createRow" class="w-full px-4 py-1 lg:w-1/2">
          
            
            
              <div class="my-3 flex items-center justify-between">
                  <span class="border-b w-1/5 lg:w-1/4"></span>
                  <p class="text-xl py-2">
                    {{ $t("sign_in") }}
                  </p>
                  <span class="border-b w-1/5 lg:w-1/4"></span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class=" flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('first_name') }}</label>
                  <InputText v-model="parent.fname"   required class="bg-[#f7f5f5] text-center"   />
                  
              </div>
              <div class=" flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('family_name') }}</label>
                  <InputText      v-model="parent.lname"  required class="bg-[#f7f5f5] text-center"  />

              </div>
              </div>
              <div class=" flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('Mobile_number') }}</label>
                  <InputText   v-model="parent.phone"     required class="bg-[#f7f5f5] text-center"   />

              </div>
              <div class=" flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('email') }}</label>
                  <InputText v-model="parent.email" style="border:  1px solid #ced4da!important; border-radius: 5px !important;"  type="email" required class="bg-[#f7f5f5] text-center"  />

              </div>
              <div class=" flex flex-column gap-2">
                <label class="w-full  " for="username">{{ $t('password') }}</label>
              <InputText v-model="parent.password" style="border:  1px solid #ced4da!important; border-radius: 5px !important;"  type="password" required class="bg-[#f7f5f5] text-center"   />
              </div>
              <div class=" flex flex-column gap-2">
                <label class="w-full  " for="username">{{ $t('password_confirmation') }}</label>
              <InputText v-model="parent.password_confirmation" style="border:  1px solid #ced4da!important; border-radius: 5px !important;"  type="password" required class="bg-[#f7f5f5] text-center"  :class="{ 'p-invalid': submitted && !parent.password_confirmation}" />

              </div>
              
              <div class="flex flex-column gap-2 w-full ">
                    <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                    <Button @click="submitted = true" type="submit" class="create m-auto w-full " :label='$t("create_button")'></Button>
                    <small id="username-help"></small>
                </div>
                <div class="mt-2 flex items-center justify-between">
                  
                <p class="mb-4 text-xl w-full text-center">
                  
                   <router-link :to="{ name: 'parentLogin' }" class="text-xl text-[#135C65]  uppercase"> {{ $t("sign_in") }}</router-link>
                </p>
              
               
            </div>
             
          </form>
          
          <div class="hidden bg-[url('../image/childern.jpg')] lg:block lg:w-1/2 bg-cover" style="background-position: center; background-size: cover" ></div>
      </div>
      <toast></toast>
  </div>
  </template>