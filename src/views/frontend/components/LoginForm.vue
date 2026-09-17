<script>
import { useParentStore } from "../../../stores/ParentStore";

export default {
  props: ["alert"],
  data() {
    return {
      parentStore: useParentStore(),
      parent: {},
     
    };
  },
};
</script>
<template>
<!-- https://play.tailwindcss.com/MIwj5Sp9pw -->
<div class="py-16 animate__animated animate__bounceInRight">
    <div class="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
       
          
        <div class="w-full p-8 lg:w-1/2">
        
            <p class="text-2xl text-gray-600 text-center">{{ $t("sign_in") }}</p>
          
            <form @submit.prevent="parentStore.login(parent)">
            <div class="mt-4 flex items-center justify-between">
                <span class="border-b w-1/5 lg:w-1/4"></span>
               
                <span class="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full" for="parent-phone">{{ $t('Mobile_number') }}</label>
                <InputText id="parent-phone" v-model="parent.phone" type="tel" inputmode="tel" autocomplete="username" dir="ltr" required class="text-center" :placeholder="$t('Mobile_number')" />
                <div class="mt-1 mb-5 text-red-500" v-if="parentStore.errors?.phone">{{ parentStore.errors.phone[0] }}</div>
            </div>
            <div class=" flex flex-column gap-2">

                  <label class="w-full  " for="username">{{ $t('password') }}</label>
                <InputText v-model="parent.password"   type="password" required class="text-center"  :placeholder='$t("password")' />
                <div class="mt-1 mb-5 text-red-500" v-if="parentStore.errors?.password">{{ parentStore.errors?.password }}</div>
            </div>
            <div class="flex flex-column gap-2 w-full ">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                  <Button
                    type="submit"
                    :loading="parentStore.loading"
                    :disabled="parentStore.loading"
                    class="m-auto w-full"
                    :label='$t("sign_in")'></Button>
                  <small id="username-help"></small>
              </div>
            <div class="mt-3 text-center text-red-500" v-if="parentStore.errorMessage">
                {{ parentStore.errorMessage }}
            </div>
            <div class="mt-2 flex justify-between flex-col">
                
                <p class="text-xl">
                   <router-link :to="{ name: 'forgetpassword' }" class="text-xl text-[#135C65]  uppercase"> {{ $t("forgetpass") }}</router-link>
                </p>
               <p class="text-xl py-2">
                   <router-link :to="{ name: 'SingUp' }" class="text-xl text-[#135C65] uppercase"> {{ $t("Create_an_account") }}</router-link>
                </p>

            </div>
            </form>
        </div>
        <div class="hidden bg-[url('../image/childern.jpg')] lg:block lg:w-1/2 bg-cover" style="background-position: center; background-size: cover" ></div>
    </div>
</div>
</template>
