<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const socialIcons = ref([
  {
    src: new URL(
      "../views/frontend/views/main/images/icon-earth.svg",
      import.meta.url,
    ).href,
    alt: "Website",
    href: "/web",
  },
  {
    src: new URL(
      "../views/frontend/views/main/images/icon-mail.svg",
      import.meta.url,
    ).href,
    alt: "Email",
    href: "mailto:Info@sawa.academy",
  },
  {
    src: new URL(
      "../views/frontend/views/main/images/icon-connPhone.svg",
      import.meta.url,
    ).href,
    alt: "Phone",
    href: "https://wa.me/962791017001",
  },
]);

const departments = ref([
  { label: "التدخل المبكر", href: "#" },
  { label: "العلاج الوظيفي", href: "#" },
  { label: "علاج النطق", href: "#" },
  { label: "تعديل السلوك", href: "#" },
]);

const quickLinks = ref([
  { label: "من نحن", href: "/about-us" },
  { label: "البرامج", href: "/programs" },
  { label: "الاقسام العلاجية", href: "/therapeutic" },
  { label: "رحلة الطفل", href: "/journey" },
  { label: "الدمج والتطوير", href: "/integration" },
  { label: "الخدمات", href: "/services" },
]);

const contacts = ref([
  {
    icon: new URL(
      "../views/frontend/views/main/images/icon-location.svg",
      import.meta.url,
    ).href,
    text: "ش.ميسلون - الرابية - عمان - الأردن",
  },
  {
    icon: new URL(
      "../views/frontend/views/main/images/icon-phone.svg",
      import.meta.url,
    ).href,
    text: "+962791017001",
    dir: "ltr",
  },
  {
    icon: new URL(
      "../views/frontend/views/main/images/icon-email.svg",
      import.meta.url,
    ).href,
    text: "Info@sawa.academy",
    dir: "ltr",
  },
]);

const bottomLinks = ref(["الشروط والأحكام", "الأسئلة الشائعة"]);

const navigate = (href) => {
  router.push(href);
};
</script>

<template>
  <footer class="bg-[#fafafa] border-t border-[#e4e4e7]">
    <div
      class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
    >
      <!-- Brand -->
      <div class="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
        <p class="text-[#be185d] font-bold text-xl">Sawa Academy</p>
        <p class="text-[#71717a] text-sm leading-relaxed">
          مركز متكامل للتربية الخاصة والتأهيل، نضع طفلك في مقدمة أولوياتنا لنبني
          معاً مستقبله المشرق.
        </p>

        <div class="flex gap-3 mt-1">
          <div
            v-for="(icon, index) in socialIcons"
            :key="index"
            class="bg-[#e4e4e7] rounded-full w-10 h-10 flex items-center justify-center shrink-0 hover:bg-[#d1d5db] transition-colors duration-200 cursor-pointer"
          >
          <a :href="icon.href" target="_blank">
            <div>
              <img :src="icon.src" :alt="icon.alt" class="w-5 h-5" />
            </div>
          </a>
        </div>
        </div>
      </div>

      <!-- Departments -->
      <div class="flex flex-col gap-4">
        <h4 class="text-[#0f766e] font-bold text-base">أقسام الأكاديمية</h4>
        <ul class="flex flex-col gap-3">
          <li
            v-for="(dept, index) in departments"
            :key="index"
            class="text-[#71717a] text-sm sm:text-base hover:text-[#B21553] transition-colors duration-200 cursor-pointer"
            @click="navigate(dept.href)"
          >
            {{ dept.label }}
          </li>
        </ul>
      </div>

      <!-- Quick Links -->
      <div class="flex flex-col gap-4">
        <h4 class="text-[#0f766e] font-bold text-base">روابط سريعة</h4>
        <ul class="flex flex-col gap-3">
          <li v-for="(link, index) in quickLinks" :key="index">
            <a
              @click="navigate(link.href)"
              class="text-[#71717a] text-sm sm:text-base hover:text-[#B21553] transition-colors duration-200 cursor-pointer"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div class="flex flex-col gap-4">
        <h4 class="text-[#0f766e] font-bold text-base">تواصل معنا</h4>
        <div class="flex flex-col gap-4">
          <div
            v-for="(item, index) in contacts"
            :key="index"
            class="flex items-center gap-3"
          >
            <img :src="item.icon" alt="" class="w-5 shrink-0" />
            <span class="text-[#71717a] text-sm" :dir="item.dir || 'rtl'">
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-[#e4e4e7] bg-white">
      <div
        class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <p class="text-[#a1a1aa] text-xs">
          © Sawa Academy. All rights reserved.
        </p>

        <div class="flex gap-6">
          <a
            v-for="(link, index) in bottomLinks"
            :key="index"
            href="#"
            class="text-[#a1a1aa] text-xs hover:text-[#B21553] transition-colors duration-200"
          >
            {{ link }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
