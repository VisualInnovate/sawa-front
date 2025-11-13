
<template>
  <Map></Map>
  <div class="py-16 animate__animated animate__bounceInRight">
    <div class="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
      <div class="w-full p-8 lg:w-1/2">
        <p class="text-2xl text-gray-600 text-center">{{ $t("Enter_the_activation_code") }}</p>
        <div class="mt-4 flex items-center justify-between">
        </div>
        <div   style="direction: ltr;" class="flex justify-center gap-2 py-6">
          <input
            v-for="(digit, index) in parent.otp"
            :key="index"
            ref="otpInputs"
            v-model="parent.otp[index]"
            type="text"
            maxlength="1"
          
            class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            @input="handleInput(index, $event)"
            @keydown.backspace="handleBackspace(index, $event)"
          />
        </div>
        <div class="flex flex-column gap-2 w-full">
          <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
          <Button @click="parentStore.register(parent)" class="create m-auto w-full" :label='$t("Register_now")'></Button>
          <small id="username-help"></small>
        </div>
        <!-- <div class="mt-2 flex items-center justify-between">
          <p class="text-xl w-full text-center">
            <router-link :to="{ name: 'forgetpassword' }" class="text-xl text-[#135C65] uppercase"> {{ $t("Resend_the_code") }}</router-link>
          </p>
        </div> -->
      </div>
      <div class="hidden bg-[url('../image/childern.jpg')] lg:block lg:w-1/2 bg-cover" style="background-position: center; background-size: cover"></div>
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
  components: { Map, Button, InputText, InlineMessage },
  data() {
    return {
      email_parent: useStorage("email_parent", ""),
      alert: {},
      alert_text: null,
      errors: {},
      parentStore: useParentStore(),
      parent: {
        otp: ["", "", "", ""],
        user_id: '',
        request_id: ''
      },
    };
  },
  methods: {
    handleInput(index, event) {
      const value = event.target.value;

      if (value.match(/^[0-9]$/)) {
        this.parent.otp[index] = value;

        if (index < this.parent.otp.length - 1) {
          this.$nextTick(() => {
            this.$refs.otpInputs[index + 1].focus();
          });
        }
      } else {
        this.parent.otp[index] = "";
      }
    },
    handleBackspace(index, event) {
      if (!this.parent.otp[index] && index > 0) {
        this.$nextTick(() => {
          this.$refs.otpInputs[index - 1].focus();
        });
      }
    },
    createtreatment() {
      axios.post("/api/parent/register", this.parent).then((res) => {
        this.email_parent = this.parent.email;
        this.$router.push({ name: 'register-code' });
      }).catch((el) => {
        this.errors = el.response.data.errors;
      });
    },
  },
  mounted() {
    this.parent.user_id = this.$route.params.user_id;
    this.parent.request_id = this.$route.params.request_id;
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