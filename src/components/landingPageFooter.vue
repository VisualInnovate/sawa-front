<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { siteContacts } from "@/utils/siteBrand";

const router = useRouter();

const icon = (name) => new URL(`../views/frontend/views/main/images/${name}`, import.meta.url).href;

// Contacts and social links from «إعدادات الموقع».
const contactInfo = computed(() => siteContacts());

const socialIcons = computed(() => {
  const c = contactInfo.value;
  return [
    { src: icon("icon-earth.svg"), alt: "Website", href: "/" },
    c.email && { src: icon("icon-mail.svg"), alt: "Email", href: `mailto:${c.email}` },
    c.whatsappHref && { src: icon("icon-connPhone.svg"), alt: "WhatsApp", href: c.whatsappHref },
  ].filter(Boolean);
});

const socialLinks = computed(() =>
  Object.entries(contactInfo.value.social)
    .filter(([, url]) => url)
    .map(([key, url]) => ({ key, url, icon: SOCIAL_ICONS[key] || "pi pi-link" })),
);
const SOCIAL_ICONS = { facebook: "pi pi-facebook", instagram: "pi pi-instagram", twitter: "pi pi-twitter", youtube: "pi pi-youtube", tiktok: "pi pi-tiktok", linkedin: "pi pi-linkedin" };

const departments = ref([
  { label: "التدخل المبكر", href: "/programs" },
  { label: "العلاج الوظيفي", href: "/therapeutic" },
  { label: "علاج النطق", href: "/therapeutic" },
  { label: "تعديل السلوك", href: "/therapeutic" },
]);

const quickLinks = ref([
  { label: "من نحن", href: "/about-us" },
  { label: "البرامج", href: "/programs" },
  { label: "الاقسام العلاجية", href: "/therapeutic" },
  { label: "رحلة الطفل", href: "/journey" },
  { label: "الدمج والتطوير", href: "/integration" },
  { label: "الخدمات", href: "/services" },
]);

const contacts = computed(() => {
  const c = contactInfo.value;
  return [
    c.address && { icon: icon("icon-location.svg"), text: c.address, href: c.mapHref },
    ...c.phones.map((phone) => ({ icon: icon("icon-phone.svg"), text: phone, dir: "ltr", href: c.telHref(phone) })),
    c.email && { icon: icon("icon-email.svg"), text: c.email, dir: "ltr", href: `mailto:${c.email}` },
  ].filter(Boolean);
});

const bottomLinks = ref([
  { label: "الشروط والأحكام", href: "/contact" },
  { label: "الأسئلة الشائعة", href: "/contact" },
]);

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
        <p class="text-bs-be185d font-bold text-xl">{{ contactInfo.name || "Sawa Academy" }}</p>
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
          <a
            v-for="link in socialLinks"
            :key="link.key"
            :href="link.url"
            target="_blank"
            rel="noopener"
            :aria-label="link.key"
            class="bg-[#e4e4e7] rounded-full w-10 h-10 flex items-center justify-center shrink-0 hover:bg-[#d1d5db] transition-colors duration-200 text-bp-1c6772"
          >
            <i :class="link.icon" />
          </a>
        </div>
      </div>

      <!-- Departments -->
      <div class="flex flex-col gap-4">
        <h4 class="text-[#0f766e] font-bold text-base">أقسام الأكاديمية</h4>
        <ul class="flex flex-col gap-3">
          <li
            v-for="(dept, index) in departments"
            :key="index"
            class="text-[#71717a] text-sm sm:text-base hover:text-bs-b21553 transition-colors duration-200 cursor-pointer"
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
              class="text-[#71717a] text-sm sm:text-base hover:text-bs-b21553 transition-colors duration-200 cursor-pointer"
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
            <a v-if="item.href" :href="item.href" target="_blank" rel="noopener" class="text-[#71717a] text-sm hover:text-bs-b21553" :dir="item.dir || 'rtl'">
              {{ item.text }}
            </a>
            <span v-else class="text-[#71717a] text-sm" :dir="item.dir || 'rtl'">
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
          © {{ contactInfo.name || "Sawa Academy" }}. جميع الحقوق محفوظة.
        </p>

        <div class="flex gap-6">
          <a
            v-for="(link, index) in bottomLinks"
            :key="index"
            :href="link.href"
            class="text-[#a1a1aa] text-xs hover:text-bs-b21553 transition-colors duration-200"
            @click.prevent="navigate(link.href)"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
