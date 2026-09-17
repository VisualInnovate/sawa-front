<template>
  <div class="">
    <Nave />
    <Banner :heading="$t('profile_page_title')" :title="$t('profile_page_hint')"></Banner>


    <div class="bg-slate-50 auctions px-[2%] py-[3%] pt-[5%] ">
    <p class="text-3xl font-bold max-w-[1280px]  p-4  m-auto">{{ $t("personal_information") }}</p>
    <form  @submit.prevent="updateProfile"  class="max-w-[1280px] bg-white shadow-md grid grid-cols-1 p-4 lg:grid-cols-6 gap-4  m-auto">
      <div class="col-span-4">
        <div class=" py-1 relative ">
                  <div class="flex ">
                  <p class="py-2 font-bold text-[#303843]" for="username"> {{ $t("first_name") }}</p>
             
                </div>
                <div class="relative ">
                  <InputText v-model="parent.fname"  required class="w-full"  :placeholder='$t("first_name")'  />
                </div>

          </div>
          <div class=" py-1 relative ">
                  <div class="flex ">
                  <p class="py-2 font-bold text-[#303843]" for="username"> {{ $t("family_name") }}</p>
       
                </div>
                <div class="relative ">
                  <InputText v-model="parent.lname"  required class="w-full"  :placeholder='$t("family_name")'  />
                </div>

          </div>
        
              <div class=" py-1 relative ">
                  <div class="flex ">
                  <label class="py-2 font-bold text-[#303843]" for="profile-phone">{{ $t("Mobile_number") }}</label>
                </div>
                <div class="relative ">
                  <InputText id="profile-phone" v-model="parent.phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required class="w-full" :placeholder='$t("Mobile_number")' />
                </div>
              </div>

              <div class=" py-1 relative ">
                  <div class="flex ">
                  <label class="py-2 font-bold text-[#303843]" for="profile-email">{{ $t("parent_optional_email") }}</label>
                </div>
                <div class="relative ">
                  <InputText id="profile-email" v-model="parent.email" type="email" autocomplete="email" class="bg-[#303843] w-full" :placeholder='$t("email")' />
                </div>
              </div>

              <div v-if="profileErrors.length" class="py-1 text-red-600" role="alert">
                <p v-for="message in profileErrors" :key="message">{{ message }}</p>
              </div>
            
             
              <div class=" py-1 w-full relative ">
                  <div class="flex w-full">
                  <p class="py-2 font-bold text-[#303843]" for="username">{{ $t("password") }}</p>
               
                </div>
                <div class="relative w-full">
                  <Password  v-model="parent.Password" class="w-full" toggleMask   :placeholder="$t('enter_password')"/>
                </div>
              </div>
              

              <div class=" flex-column gap-2 py-1 hidden">
                  <label class="w-full " for="username">{{ $t('personal_image') }}</label>

                  <InputText name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full" />

            </div>
            <div class="flex justify-between ">
              <Button type="submit" :label='$t("تعديل")'  class="mt-3 w-[40%] mx-auto lg:mb-0 bg focus:ring-0"></Button>
              <Button @click="parentStore.logout" :label='$t("sign_out")'  class="mt-3 w-[40%] mx-auto lg:mb-0 bg focus:ring-0" severity="danger"></Button>

            </div>
      </div>
      <div class="col-span-2 mx-auto">
        <div class="rounded-full" style="border: 5px solid #135C65;">

                 <div ><img onclick="document.getElementById('filr').click()" class="hidden m-auto rounded-full" style="width: 200px ;height: 200px;" v-if="parent?.image"  :src="parent?.image" >
                    <div  class="m-auto rounded-full bg-no-repeat bg-cover" style="width: 200px ;height: 200px;" :style="{ backgroundImage: `url(${parent?.image})` }"></div>

                  </div>

          </div>
         <div class="mx-auto text-center w-full">
          <Button
                onclick="document.getElementById('filr').click()"
                :label='$t("تعديل")'
                class="mt-3 w-[90%] mx-auto lg:mb-0 bg focus:ring-0">
            </Button>
         </div>
         <div class="mx-auto text-center w-full">
         </div>

      </div>

    </form>
   </div>

   
    <About />
  </div>
  <Toast></Toast>
</template>
<script>
import Nave from "../components/Nave.vue";
import Sidbar from "../components/Sidbar.vue";
import Banner from '../components/Banner.vue'

import About from "../components/About.vue";
import Knob from "primevue/knob";
import FileUpload from "primevue/fileupload";
import { useParentStore } from "../../../stores/ParentStore";
import axios from "axios";

export default {
  components: { Nave, Sidbar, About, Knob, FileUpload,Banner },
  data() {
    return {
      imageSrc: null,
      image: null,
      parentStore: useParentStore(),
      parent: {},
      profileErrors: [],
   
    };
  },
  methods: {

    getUserProfile() {
      axios
        .get("/api/parent/user")
        .then((res) => {
          this.parent = res.data.user;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    uploadFile (e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.parent.image = e.target.result;
        this.parent.file = image;
      };
    },
    updateProfile() {

      // Only send what the parent can change; FormData would turn null/undefined into text.
      const formData = new FormData();
      formData.append("fname", this.parent.fname ?? "");
      formData.append("lname", this.parent.lname ?? "");
      formData.append("phone", this.parent.phone ?? "");
      formData.append("email", this.parent.email ?? "");
      if (this.parent.file) formData.append("image", this.parent.file);
      if (this.parent.Password) formData.append("password", this.parent.Password);

      this.profileErrors = [];
      axios
        .post("/api/parent/profile", formData)
        .then((res) => {
          this.parent = { ...res.data.profile, Password: "" };
          this.parentStore.parent = res.data.profile;
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_update_success")}`, life: 3000 });
        })
        .catch((err) => {
          const errors = err.response?.data?.errors;
          this.profileErrors = errors
            ? Object.values(errors).flat()
            : [this.$t("mission_error")];
        });
    },
  },
  computed: {
    imageClass() {
      // Return a string of Tailwind CSS classes to set the width of the image
      return this.imageSrc ? ["w-40", "h-0"] : ""; // Adjust the 'w-64' class to set the desired width
    },
   
  },
  mounted() {
    this.getUserProfile();
  },
};
</script>
<style>
.uploaded-image {
  width: 101px;
  height: 101px;
}
.p-inputtext:enabled {
  width: 100% !important;
}
</style>
