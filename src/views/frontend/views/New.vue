<template>
  <Nave />
  <div  class="banner flex items-center h-[35vh] lg:h-[55vh] relative ">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%] ">
      <h1 class="font-bold text-5xl text-white z-50">{{ $t("The_latest_developments") }}</h1>
     <div class="flex py-8 ">
      <p class="text-2xl font-semibold "> {{ $t("home") }}</p>
      <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-2xl font-semibold "> {{ $t("The_latest_developments") }}</p>
     </div>
    </div>
   </div>

   <div >
      <div class="max-w-[1300px] mx-auto  py-[4%] ">
        <div class="flex justify-between w-full m-auto px-2">
           <h3 class="font-bold text-2xl text-[#303843]">{{ $t("The_latest_developments") }}</h3>
        </div>
        
        <div class="mt-3 grid gap-3">
          <div v-if="loading" class="py-10 text-center"><ProgressSpinner style="width: 40px; height: 40px" /></div>
          <div v-else-if="!notifications.length" class="empty-state bg-white rounded-xl border">
            <i class="pi pi-bell" />
            {{ $t("no_notifications") }}
          </div>
          <template v-else>
          <article v-for="item in notifications" :key="item.id" class="bg-white rounded-xl border p-4 flex gap-3 items-start">
            <span class="notification-dot" :class="{ unread: !item.read_at }" aria-hidden="true"></span>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-[#303843]">{{ notificationTitle(item) }}</p>
              <p v-if="notificationBody(item)" class="text-slate-600 mt-1">{{ notificationBody(item) }}</p>
              <p class="text-sm text-slate-400 mt-2" dir="ltr">{{ formatDate(item.created_at) }}</p>
            </div>
          </article>
          </template>
        </div>
      </div>
    </div>

  <About />
</template>
<script>
import NewAcorrding from "../components/NewAcorrding.vue";
import Sidbar from "../components/Sidbar.vue";
import About from "../components/About.vue";
import axios from "axios";
import Nave from "../components/Nave.vue";
export default {
  components: { Nave, NewAcorrding, Sidbar, About },
  data() {
    return {
      showsider: false,
      notifications: [],
      loading: true,
    };
  },
  methods: {
    toggle() {
      this.showsider = !this.showsider;
    },
    payload(item) {
      if (item.data && typeof item.data === "object") return item.data;
      try {
        return JSON.parse(item.data ?? "{}");
      } catch {
        return { message: item.data };
      }
    },
    notificationTitle(item) {
      const data = this.payload(item);
      return data.title ?? data.subject ?? this.$t("notification");
    },
    notificationBody(item) {
      const data = this.payload(item);
      return data.message ?? data.body ?? data.text ?? "";
    },
    formatDate(value) {
      return value ? new Date(value).toLocaleString(this.$i18n.locale === "ar" ? "ar-JO" : "en-GB") : "";
    },
    getNotifications() {
      axios
        .get("/api/parent/notification")
        .then((res) => {
          this.notifications = res.data.notifications ?? [];
        })
        .catch(() => {
          this.notifications = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getNotifications();
  },
};
</script>
<style>
.notification-dot {
  width: 10px;
  height: 10px;
  margin-top: 0.45rem;
  border-radius: 50%;
  background: #cbd5e1;
  flex-shrink: 0;
}
.notification-dot.unread {
  background: #ff2a5b;
}
.item:hover {
  background-color: #e6f8f6;
  transition: all linear 300ms;
}
</style>