<script setup>
// «ملاحظات أولياء الأمور»: the notes, complaints, suggestions and questions parents send from the portal.
// list = read them; edit = answer (the parent is told and reads it on the portal) and change the status; delete.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { can } from "@/utils/permissions";
import { FEEDBACK_ICONS, FEEDBACK_STATUSES, FEEDBACK_TYPES, STATUS_SEVERITY, openAttachment } from "@/utils/parentFeedback";

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const route = useRoute();
const router = useRouter();
const canEdit = can("parent feedback edit");
const canDelete = can("parent feedback delete");

const rows = ref([]);
const total = ref(0);
const counts = ref({});
const loading = ref(false);
const page = ref(1);
const perPage = ref(20);
const status = ref("new");
const type = ref(null);
const search = ref("");
const current = ref(null);
const draft = ref({ reply: "", status: "new" });
const saving = ref(false);

const statusOptions = computed(() => [null, ...FEEDBACK_STATUSES].map((value) => ({
  value,
  label: value ? t(`pfb.status_${value}`) : t("sp_all"),
  count: value ? counts.value[value] ?? 0 : null,
})));
const typeOptions = computed(() => FEEDBACK_TYPES.map((value) => ({ value, label: t(`pfb.type_${value}`) })));
const editStatuses = computed(() => FEEDBACK_STATUSES.map((value) => ({ value, label: t(`pfb.status_${value}`) })));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/parent-feedback", {
      params: { status: status.value || undefined, type: type.value || undefined, search: search.value.trim() || undefined, page: page.value, per_page: perPage.value },
    });
    rows.value = data.data;
    total.value = data.total;
    counts.value = data.counts ?? {};
  } finally {
    loading.value = false;
  }
}
function reload() {
  page.value = 1;
  load();
}
let typing;
watch(search, () => {
  clearTimeout(typing);
  typing = setTimeout(reload, 350);
});
function onPage(event) {
  page.value = event.page + 1;
  perPage.value = event.rows;
  load();
}

function openRow(row) {
  current.value = row;
  draft.value = { reply: row.reply ?? "", status: row.status };
}
async function openById(id) {
  if (!id) return;
  try {
    openRow((await axios.get(`api/parent-feedback/${id}`)).data.data);
  } catch {
    // Deleted or not there any more: just the list.
  }
}
function closeDialog() {
  current.value = null;
  if (route.query.id) router.replace({ query: { ...route.query, id: undefined } });
}

async function save() {
  saving.value = true;
  try {
    const { data } = await axios.put(`api/parent-feedback/${current.value.id}`, { reply: draft.value.reply, status: draft.value.status });
    const replied = (data.data.reply ?? "") !== (current.value.reply ?? "") && !!data.data.reply;
    toast.add({ severity: "success", summary: t("success_message"), detail: replied ? t("pfb.reply_sent") : t("pfb.saved"), life: 2500 });
    closeDialog();
    await load();
  } catch (error) {
    const errors = error.response?.data?.errors;
    toast.add({ severity: "error", summary: t("error"), detail: errors ? Object.values(errors).flat()[0] : error.response?.data?.message ?? t("mission_error"), life: 3500 });
  } finally {
    saving.value = false;
  }
}

function remove(row) {
  confirm.require({
    header: t("pfb.delete"),
    message: t("pfb.confirm_delete", { subject: row.subject }),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await axios.delete(`api/parent-feedback/${row.id}`);
        toast.add({ severity: "success", summary: t("pfb.deleted"), life: 2500 });
        if (current.value?.id === row.id) closeDialog();
        await load();
      } catch (error) {
        toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message ?? t("mission_error"), life: 3000 });
      }
    },
  });
}

async function attachment(row) {
  try {
    await openAttachment(`api/parent-feedback/${row.id}/attachment`);
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("mission_error"), life: 3000 });
  }
}

onMounted(() => {
  load();
  openById(Number(route.query.id) || null);
});
// A bell notification opens another note while the page is already open.
watch(() => route.query.id, (id) => openById(Number(id) || null));
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <ConfirmDialog />
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0"><i class="pi pi-comments" aria-hidden="true" /> {{ $t("pfb.menu") }}</p>
        <small class="text-slate-500">{{ $t("pfb.admin_lead") }}</small>
      </div>
      <Button icon="pi pi-refresh" variant="outlined" :loading="loading" :aria-label="$t('refresh')" @click="load" />
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-3">
      <SelectButton v-model="status" :options="statusOptions" optionLabel="label" optionValue="value" :allowEmpty="false" @change="reload">
        <template #option="{ option }">
          <span>{{ option.label }}</span>
          <Badge v-if="option.count" :value="option.count" :severity="STATUS_SEVERITY[option.value]" class="ms-1" />
        </template>
      </SelectButton>
      <Select v-model="type" :options="typeOptions" optionLabel="label" optionValue="value" :placeholder="$t('pfb.all_types')" showClear class="w-44" @change="reload" />
      <IconField class="grow max-w-80">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" :placeholder="$t('pfb.search')" fluid />
      </IconField>
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows lazy paginator :rows="perPage" :rowsPerPageOptions="[20, 50, 100]" :totalRecords="total"
               :first="(page - 1) * perPage" responsiveLayout="scroll" rowHover class="cursor-pointer" @page="onPage" @row-click="openRow($event.data)">
      <template #empty><p class="text-center text-slate-500 py-6">{{ $t("pfb.admin_empty") }}</p></template>
      <Column :header="$t('pfb.type')" style="width: 8rem">
        <template #body="{ data }"><span class="whitespace-nowrap"><i :class="FEEDBACK_ICONS[data.type]" aria-hidden="true" /> {{ $t(`pfb.type_${data.type}`) }}</span></template>
      </Column>
      <Column :header="$t('pfb.subject')">
        <template #body="{ data }">
          <div class="max-w-[28rem]">
            <b>{{ data.subject }}</b>
            <i v-if="data.has_attachment" class="pi pi-paperclip text-slate-500 ms-1" :aria-label="$t('pfb.attachment')" />
            <p class="m-0 text-slate-600 truncate">{{ data.message }}</p>
          </div>
        </template>
      </Column>
      <Column :header="$t('pfb.parent')">
        <template #body="{ data }">{{ data.parent }}<br /><small class="ltr text-slate-500">{{ data.parent_phone }}</small></template>
      </Column>
      <Column :header="$t('child')"><template #body="{ data }">{{ data.child || $t("pfb.general_short") }}</template></Column>
      <Column :header="$t('pfb.sent_at')"><template #body="{ data }"><span class="ltr whitespace-nowrap">{{ data.created_at }}</span></template></Column>
      <Column :header="$t('status')">
        <template #body="{ data }">
          <Tag :severity="STATUS_SEVERITY[data.status]" :value="$t(`pfb.status_${data.status}`)" />
          <small v-if="data.replied_by" class="block text-slate-500 mt-1">{{ $t("pfb.replied_by", { name: data.replied_by }) }}</small>
        </template>
      </Column>
      <Column style="width: 7rem">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button size="small" variant="text" :icon="canEdit ? 'pi pi-reply' : 'pi pi-eye'" :aria-label="canEdit ? $t('pfb.answer') : $t('pfb.view')" v-tooltip.top="canEdit ? $t('pfb.answer') : $t('pfb.view')" @click.stop="openRow(data)" />
            <Button v-if="canDelete" size="small" variant="text" severity="danger" icon="pi pi-trash" :aria-label="$t('pfb.delete')" v-tooltip.top="$t('pfb.delete')" @click.stop="remove(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog :visible="!!current" modal :header="current?.subject" :style="{ width: '44rem' }" :breakpoints="{ '768px': '95vw' }" @update:visible="closeDialog">
      <div v-if="current" class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <Tag severity="secondary"><i :class="FEEDBACK_ICONS[current.type]" aria-hidden="true" />&nbsp;{{ $t(`pfb.type_${current.type}`) }}</Tag>
          <Tag :severity="STATUS_SEVERITY[current.status]" :value="$t(`pfb.status_${current.status}`)" />
          <small class="ltr text-slate-500">{{ current.created_at }}</small>
        </div>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 m-0">
          <dt class="text-slate-500">{{ $t("pfb.parent") }}</dt><dd class="m-0">{{ current.parent }} · <span class="ltr">{{ current.parent_phone }}</span></dd>
          <dt class="text-slate-500">{{ $t("child") }}</dt><dd class="m-0">{{ current.child || $t("pfb.general_short") }}</dd>
        </dl>
        <p class="m-0 leading-7 whitespace-pre-line p-3 rounded-lg bg-slate-50 border border-slate-200">{{ current.message }}</p>
        <Button v-if="current.has_attachment" variant="link" icon="pi pi-paperclip" :label="current.attachment_name || $t('pfb.attachment')" class="self-start p-0" @click="attachment(current)" />

        <template v-if="canEdit">
          <div class="flex flex-col gap-1">
            <label for="pfb-reply" class="font-semibold">{{ $t("pfb.reply") }}</label>
            <Textarea id="pfb-reply" v-model="draft.reply" rows="4" maxlength="5000" autoResize fluid />
            <small class="text-slate-500">{{ $t("pfb.reply_hint") }}</small>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-semibold" id="pfb-status-label">{{ $t("status") }}</label>
            <SelectButton v-model="draft.status" :options="editStatuses" optionLabel="label" optionValue="value" :allowEmpty="false" aria-labelledby="pfb-status-label" />
          </div>
        </template>
        <div v-else-if="current.reply" class="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <p class="m-0 font-semibold">{{ $t("pfb.reply") }}</p>
          <p class="m-0 leading-7 whitespace-pre-line">{{ current.reply }}</p>
        </div>
        <small v-if="current.replied_by" class="text-slate-500">{{ $t("pfb.replied_by", { name: current.replied_by }) }} · <span class="ltr">{{ current.replied_at }}</span></small>
      </div>
      <template #footer>
        <Button v-if="canDelete && current" severity="danger" variant="text" icon="pi pi-trash" :label="$t('pfb.delete')" class="me-auto" @click="remove(current)" />
        <Button variant="outlined" :label="$t('close')" @click="closeDialog" />
        <Button v-if="canEdit" icon="pi pi-check" :label="$t('save')" :loading="saving" @click="save" />
      </template>
    </Dialog>
  </div>
</template>
