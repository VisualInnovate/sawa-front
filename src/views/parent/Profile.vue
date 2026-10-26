<script setup>
// The parent's own account: the name, the phone, the e-mail, the photo, and a new password.
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import { useParentStore } from "@/stores/ParentStore";
import { useParentPortalStore } from "@/stores/ParentPortal";

const { t } = useI18n();
const toast = useToast();
const parentStore = useParentStore();
const portal = useParentPortalStore();

const parent = ref({ fname: "", lname: "", phone: "", email: "", image: null });
const password = ref("");
const file = ref(null);
const preview = ref(null);
const errors = ref([]);
const saving = ref(false);

onMounted(async () => {
  try {
    parent.value = { ...(await axios.get("/api/parent/user")).data.user };
  } catch {
    parent.value = { ...parentStore.user };
  }
});

function pickImage(event) {
  const image = event.target.files?.[0];
  if (!image) return;
  file.value = image;
  const reader = new FileReader();
  reader.onload = (e) => (preview.value = e.target.result);
  reader.readAsDataURL(image);
}

async function save() {
  // Only what the parent can change; FormData would turn null into the text "null".
  const form = new FormData();
  form.append("fname", parent.value.fname ?? "");
  form.append("lname", parent.value.lname ?? "");
  form.append("phone", parent.value.phone ?? "");
  form.append("email", parent.value.email ?? "");
  if (file.value) form.append("image", file.value);
  if (password.value) form.append("password", password.value);
  errors.value = [];
  saving.value = true;
  try {
    const { data } = await axios.post("/api/parent/profile", form);
    parent.value = { ...data.profile };
    parentStore.parent = data.profile;
    password.value = "";
    file.value = null;
    preview.value = null;
    portal.refresh();
    toast.add({ severity: "success", summary: t("success_message"), detail: t("element_update_success"), life: 3000 });
  } catch (error) {
    const list = error.response?.data?.errors;
    errors.value = list ? Object.values(list).flat() : [t("mission_error")];
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="pp-page">
    <Toast />
    <PageHead :title="$t('profile_page_title')" :lead="$t('profile_page_hint')" :kicker="$t('pp.brand')" icon="pi pi-user" />

    <form class="pp-card pp-card--pad pp-stack pp-in max-w-[760px]" novalidate data-no-request-spinner @submit.prevent="save">
      <div class="pp-photo">
        <label class="pp-photo__pick" :title="$t('personal_image')">
          <img v-if="preview || parent.image" :src="preview || parent.image" alt="" />
          <span v-else class="pp-photo__initial">{{ (parent.fname || "?").slice(0, 1) }}</span>
          <span class="pp-photo__cam"><i class="pi pi-camera" /></span>
          <input type="file" accept="image/*" class="sr-only" @change="pickImage" />
        </label>
        <div>
          <p class="pp-item__title text-lg">{{ parent.fname }} {{ parent.lname }}</p>
          <p class="pp-item__meta">{{ $t("pp.photo_hint") }}</p>
        </div>
      </div>

      <div class="pp-form-grid">
        <div class="pp-field is-required"><label for="p-fname">{{ $t("first_name") }}</label><InputText id="p-fname" v-model="parent.fname" autocomplete="given-name" fluid /></div>
        <div class="pp-field is-required"><label for="p-lname">{{ $t("family_name") }}</label><InputText id="p-lname" v-model="parent.lname" autocomplete="family-name" fluid /></div>
        <div class="pp-field is-required"><label for="p-phone">{{ $t("Mobile_number") }}</label><InputText id="p-phone" v-model="parent.phone" type="tel" dir="ltr" autocomplete="tel" fluid /></div>
        <div class="pp-field"><label for="p-email">{{ $t("parent_optional_email") }}</label><InputText id="p-email" v-model="parent.email" type="email" autocomplete="email" fluid /><small class="help">{{ $t("parent_email_recovery_hint") }}</small></div>
        <div class="pp-field sm:col-span-2"><label for="p-password">{{ $t("new_password") }}</label><Password v-model="password" input-id="p-password" toggle-mask :feedback="false" autocomplete="new-password" fluid /><small class="help">{{ $t("pp.password_keep_hint") }}</small></div>
      </div>

      <Message v-if="errors.length" severity="error" :closable="false">
        <ul class="m-0 ps-4"><li v-for="(error, i) in errors" :key="i">{{ error }}</li></ul>
      </Message>

      <div class="pp-row pp-between pt-2">
        <button type="button" class="pp-btn pp-btn--ghost text-[var(--pp-danger)]" @click="parentStore.logout()"><i class="pi pi-sign-out" /> {{ $t("pp.logout") }}</button>
        <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" size="large" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.pp-photo {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.pp-photo__pick {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
}
.pp-photo__pick img,
.pp-photo__initial {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: grid;
  place-items: center;
  background: var(--pp-magenta-100);
  color: var(--pp-magenta);
  font-size: 2rem;
  font-weight: 800;
}
.pp-photo__cam {
  position: absolute;
  inset-inline-end: -2px;
  bottom: -2px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--pp-teal);
  color: #fff;
  box-shadow: 0 0 0 3px #fff;
  font-size: 0.8rem;
}
.pp-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}
@media (min-width: 640px) {
  .pp-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
