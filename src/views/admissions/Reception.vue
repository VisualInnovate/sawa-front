<script setup>
// «الاستقبال»: an account for a parent who comes the first time (a temporary password shown once, sent on WhatsApp,
// then their children from the child form), and the review of the accounts parents made alone (24 hours, then the
// general manager is told).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { errorText } from "@/utils/accounting";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const canCreate = computed(() => can("parents create"));
const canReview = computed(() => can("parent registration review edit"));
const tab = ref(canCreate.value ? "new" : "pending");

// A new account.
const form = ref({ fname: "", lname: "", phone: "", email: "" });
const errors = ref({});
const saving = ref(false);
const made = ref(null);
async function create() {
  saving.value = true;
  errors.value = {};
  try {
    const { data } = await axios.post("api/reception/parents", { ...form.value, email: form.value.email || null });
    made.value = data.data;
    form.value = { fname: "", lname: "", phone: "", email: "" };
  } catch (e) {
    errors.value = e.response?.data?.errors ?? {};
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    saving.value = false;
  }
}
const loginUrl = computed(() => `${window.location.origin}/parent/login`);
const message = computed(() => made.value && t("rcp.whatsapp_text", { name: made.value.name, phone: made.value.phone, password: made.value.password, url: loginUrl.value }));
function whatsapp() {
  const phone = String(made.value.phone).replace(/\D/g, "").replace(/^0/, "962");
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message.value)}`, "_blank", "noopener");
}
async function copy() {
  await navigator.clipboard.writeText(message.value);
  toast.add({ severity: "success", summary: t("rcp.copied"), life: 1800 });
}

// The self-registered accounts.
const status = ref("pending");
const rows = ref([]);
const loading = ref(false);
const reviewing = ref(null);
const note = ref("");
async function load() {
  loading.value = true;
  try {
    rows.value = (await axios.get("api/reception/registrations", { params: { status: status.value } })).data.data;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    loading.value = false;
  }
}
async function review() {
  saving.value = true;
  try {
    await axios.post(`api/reception/registrations/${reviewing.value.id}/review`, { note: note.value || null });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("rcp.reviewed_done"), life: 2500 });
    reviewing.value = null;
    await load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    saving.value = false;
  }
}
onMounted(load);
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("rcp.title") }}</p>
    <small class="text-color-secondary">{{ $t("rcp.hint") }}</small>

    <Tabs v-model:value="tab" class="mt-2">
      <TabList>
        <Tab v-if="canCreate" value="new"><i class="pi pi-user-plus me-1" /> {{ $t("rcp.new") }}</Tab>
        <Tab value="pending"><i class="pi pi-inbox me-1" /> {{ $t("rcp.review") }} <Badge v-if="status === 'pending' && rows.length" :value="rows.length" severity="warn" class="ms-1" /></Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-if="canCreate" value="new">
          <div v-if="made" class="rcp-made">
            <p class="font-bold m-0"><i class="pi pi-check-circle text-green-600" /> {{ $t("rcp.made", { name: made.name }) }}</p>
            <p class="m-0">{{ $t("rcp.password_once") }} <code class="rcp-code"><bdi>{{ made.password }}</bdi></code></p>
            <pre class="rcp-msg">{{ message }}</pre>
            <div class="flex flex-wrap gap-2">
              <Button icon="pi pi-whatsapp" severity="success" :label="$t('rcp.send_whatsapp')" @click="whatsapp" />
              <Button icon="pi pi-copy" variant="outlined" :label="$t('rcp.copy')" @click="copy" />
              <Button icon="pi pi-user-plus" :label="$t('rcp.add_child')" @click="router.push({ name: 'CreateChildren', query: { parent_id: made.id } })" />
              <Button v-if="can('bookings create')" icon="pi pi-calendar-plus" variant="outlined" :label="$t('rcp.book')" @click="router.push({ name: 'BookingCreate' })" />
              <Button :label="$t('rcp.another')" text @click="made = null" />
            </div>
          </div>
          <form v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl" @submit.prevent="create">
            <div class="grid gap-1">
              <label for="rcp-f" class="font-bold">{{ $t("rcp.fname") }} <span class="text-red-500">*</span></label>
              <InputText id="rcp-f" v-model="form.fname" :invalid="!!errors.fname" />
            </div>
            <div class="grid gap-1">
              <label for="rcp-l" class="font-bold">{{ $t("rcp.lname") }} <span class="text-red-500">*</span></label>
              <InputText id="rcp-l" v-model="form.lname" :invalid="!!errors.lname" />
            </div>
            <div class="grid gap-1">
              <label for="rcp-p" class="font-bold">{{ $t("rcp.phone") }} <span class="text-red-500">*</span></label>
              <InputText id="rcp-p" v-model="form.phone" dir="ltr" inputmode="tel" :invalid="!!errors.phone" />
              <small v-if="errors.phone" class="text-red-600">{{ [errors.phone].flat()[0] }}</small>
            </div>
            <div class="grid gap-1">
              <label for="rcp-e" class="font-bold">{{ $t("rcp.email") }}</label>
              <InputText id="rcp-e" v-model="form.email" dir="ltr" type="email" :invalid="!!errors.email" />
              <small v-if="errors.email" class="text-red-600">{{ [errors.email].flat()[0] }}</small>
            </div>
            <div class="md:col-span-2 flex justify-end">
              <Button type="submit" icon="pi pi-check" :label="$t('rcp.create')" :loading="saving" :disabled="!form.fname || !form.lname || !form.phone" />
            </div>
          </form>
        </TabPanel>

        <TabPanel value="pending">
          <div class="flex justify-between items-center mb-2 gap-2">
            <SelectButton v-model="status" :options="[{ v: 'pending', l: $t('rcp.pending') }, { v: 'reviewed', l: $t('rcp.reviewed') }]" optionLabel="l" optionValue="v" :allowEmpty="false" @change="load" />
            <Button icon="pi pi-refresh" variant="text" :loading="loading" @click="load" :aria-label="$t('refresh_data')" />
          </div>
          <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows size="small">
            <template #empty><p class="text-center text-color-secondary m-0">{{ status === "pending" ? $t("rcp.none_pending") : $t("rcp.none_reviewed") }}</p></template>
            <Column :header="$t('parent')"><template #body="{ data }"><b>{{ data.name }}</b><div class="text-xs text-color-secondary"><bdi>{{ data.phone }}</bdi> <bdi v-if="data.email">· {{ data.email }}</bdi></div></template></Column>
            <Column :header="$t('children')"><template #body="{ data }">{{ data.children_count }}</template></Column>
            <Column :header="$t('rcp.registered_at')"><template #body="{ data }"><bdi>{{ data.created_at }}</bdi></template></Column>
            <Column v-if="status === 'pending'" :header="$t('rcp.due')"><template #body="{ data }">
              <Tag v-if="data.late" severity="danger" :value="$t('rcp.late')" class="me-1" /><bdi>{{ data.due_at ?? "—" }}</bdi></template></Column>
            <Column v-else :header="$t('rcp.reviewed_by')"><template #body="{ data }">{{ data.reviewed_by ?? "—" }}<div class="text-xs text-color-secondary"><bdi>{{ data.reviewed_at }}</bdi></div></template></Column>
            <Column v-if="status === 'pending' && canReview" style="width: 9rem"><template #body="{ data }">
              <Button size="small" icon="pi pi-check" :label="$t('rcp.mark_reviewed')" @click="reviewing = data; note = ''" /></template></Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog :visible="!!reviewing" modal :header="$t('rcp.mark_reviewed')" :style="{ width: '460px', maxWidth: '96vw' }" @update:visible="reviewing = null">
      <p class="mt-0">{{ $t("rcp.review_hint", { name: reviewing?.name }) }}</p>
      <label for="rcp-note" class="font-bold">{{ $t("notes") }}</label>
      <Textarea id="rcp-note" v-model="note" rows="2" autoResize class="w-full mt-1" />
      <template #footer><Button :label="$t('cancel')" text @click="reviewing = null" /><Button :label="$t('rcp.mark_reviewed')" icon="pi pi-check" :loading="saving" @click="review" /></template>
    </Dialog>
  </div>
</template>

<style scoped>
.rcp-made { display: grid; gap: .6rem; max-width: 640px; padding: 1rem; border: 1px solid #a7f3d0; background: #ecfdf5; border-radius: 12px; }
.rcp-code { font-size: 1.1rem; font-weight: 700; padding: .1rem .5rem; background: #fff; border-radius: 6px; letter-spacing: .08em; }
.rcp-msg { white-space: pre-wrap; font-family: inherit; background: #fff; border-radius: 8px; padding: .6rem; margin: 0; font-size: .88rem; }
</style>
