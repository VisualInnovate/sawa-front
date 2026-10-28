<script setup>
// «المرشحون»: the board of sent applications. Drag a card to another column (or use its menu) to move it; dropping
// it on «تعديل بيانات» asks for the reason and what to fix, which the candidate sees on the careers page. The
// drawer shows the whole file, the documents and the history, with notes.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Menu from "primevue/menu";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const COLORS = { new: "#0ea5e9", review: "#6366f1", returned: "#f59e0b", approved: "#10b981", contracting: "#8b5cf6", rejected: "#ef4444" };
const rows = ref([]);
const columns = ref(["new", "review", "returned", "approved", "contracting", "rejected"]);
const vacancies = ref([]);
const loading = ref(false);
const filters = ref({ search: "", range: null, vacancy_id: route.query.vacancy ? Number(route.query.vacancy) : null, drafts: false });
const canEdit = computed(() => can("candidates edit"));
const ar = computed(() => locale.value === "ar");

async function load() {
  loading.value = true;
  const [from, to] = filters.value.range ?? [];
  try {
    const { data } = await axios.get("api/candidates", {
      params: {
        search: filters.value.search.trim() || undefined, vacancy_id: filters.value.vacancy_id || undefined, drafts: filters.value.drafts ? 1 : undefined,
        from: from ? moment(from).format("YYYY-MM-DD") : undefined, to: to ? moment(to).format("YYYY-MM-DD") : undefined,
      },
    });
    rows.value = data.data;
    columns.value = data.columns;
  } finally {
    loading.value = false;
  }
}
onMounted(async () => {
  load();
  try {
    vacancies.value = (await axios.get("api/vacancies")).data.data;
  } catch {
    vacancies.value = [];
  }
});

const inColumn = (status) => rows.value.filter((r) => r.status === status);
const drafts = computed(() => rows.value.filter((r) => r.status === "draft"));
const vacancyTitle = (v) => (v ? (ar.value ? v.title_ar : v.title_en || v.title_ar) : t("cand.no_vacancy"));
const ago = (date) => {
  if (!date) return "";
  const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: "auto" });
  const minutes = Math.round((new Date(date) - new Date()) / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
};

// ---- Moving ----
const dragged = ref(null);
const over = ref(null);
function onDrop(status) {
  over.value = null;
  const card = rows.value.find((r) => r.id === dragged.value);
  dragged.value = null;
  if (card && card.status !== status) moveTo(card, status);
}
async function moveTo(card, status) {
  if (status === "returned") {
    openReturn(card.id);
    return;
  }
  const before = card.status;
  card.status = status;
  try {
    await axios.put(`api/candidates/${card.id}/status`, { status });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("cand.moved", { status: t(`cand.col_${status}`) }), life: 2000 });
    if (detail.value?.candidate.id === card.id) openDetail(card.id);
  } catch (error) {
    card.status = before;
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}
const menu = ref(null);
const menuCard = ref(null);
const menuItems = computed(() => [
  { label: t("cand.details"), icon: "pi pi-eye", command: () => openDetail(menuCard.value.id) },
  // An approved candidate gets a contract on «العقود».
  ...(menuCard.value?.status === "approved" && can("contracts create")
    ? [{ label: t("ctr.add"), icon: "pi pi-file-edit", command: () => router.push({ name: "contracts", query: { candidate: menuCard.value.id } }) }]
    : []),
  ...(canEdit.value
    ? [{ separator: true }, ...columns.value.filter((c) => c !== menuCard.value?.status).map((c) => ({ label: t("cand.move_to", { status: t(`cand.col_${c}`) }), icon: "pi pi-arrow-right-arrow-left", command: () => moveTo(menuCard.value, c) }))]
    : []),
]);
function openMenu(event, card) {
  menuCard.value = card;
  menu.value.toggle(event);
}

// ---- Details drawer ----
const detail = ref(null);
const drawer = ref(false);
const previews = ref({});
const note = ref("");
async function openDetail(id) {
  drawer.value = true;
  detail.value = null;
  const { data } = await axios.get(`api/candidates/${id}`);
  detail.value = data.data;
  for (const doc of data.data.candidate.documents) {
    if (!doc.mime?.startsWith("image/") || previews.value[doc.id]) continue;
    axios.get(`api/candidates/${id}/documents/${doc.id}`, { responseType: "blob" }).then(({ data: blob }) => (previews.value[doc.id] = URL.createObjectURL(blob))).catch(() => {});
  }
}
async function openDoc(doc) {
  const { data } = await axios.get(`api/candidates/${detail.value.candidate.id}/documents/${doc.id}`, { responseType: "blob" });
  window.open(URL.createObjectURL(data), "_blank", "noopener");
}
const c = computed(() => detail.value?.candidate);
const facts = computed(() => {
  if (!c.value) return [];
  const yes = (v) => (v === null || v === undefined ? "—" : v ? t("careers.yes") : t("careers.no"));
  const look = (row) => (row ? (ar.value ? row.name_ar : row.name_en || row.name_ar) : "—");
  return [
    ["vacancy_id", t("careers.vacancy"), vacancyTitle(c.value.vacancy)],
    ["name_ar", t("careers.name_ar"), c.value.name_ar],
    ["citizen", t("careers.citizenship"), c.value.citizen === null ? "—" : c.value.citizen ? (ar.value ? detail.value.profile.citizen_ar : detail.value.profile.citizen_en) : `${t("careers.resident")}${c.value.nationality ? ` (${c.value.nationality})` : ""}`],
    ["national_id", t("cand.national_id"), c.value.national_id, true],
    ["birth_date", t("careers.birth_date"), c.value.birth_date, true],
    ["gender", t("careers.gender"), c.value.gender ? t(`careers.${c.value.gender}`) : "—"],
    ["marital_status", t("careers.marital_status"), c.value.marital_status ? t(`careers.${c.value.marital_status}`) : "—"],
    ["has_disability", t("careers.has_disability"), `${yes(c.value.has_disability)}${c.value.disability_details ? ` — ${c.value.disability_details}` : ""}`],
    ["email", t("careers.email"), c.value.email, true],
    ["phone", t("careers.phone"), c.value.phone, true],
    ...(c.value.country === "SA" ? [["national_address", t("careers.national_address"), c.value.national_address, true]] : []),
    ["address", t("careers.address"), c.value.address],
    ["bank_id", t("careers.bank_name"), look(c.value.bank)],
    ["iban", t("careers.iban"), c.value.iban, true],
    ["qualification_id", t("careers.qualification"), look(c.value.qualification)],
    ["specialty_id", t("careers.specialty"), look(c.value.specialty)],
    ["has_experience", t("careers.has_experience"), yes(c.value.has_experience)],
  ];
});
const docsOf = (typeId) => c.value.documents.filter((d) => d.lookup_id === typeId);
const typeName = (type) => (ar.value ? type.name_ar : type.name_en || type.name_ar);

async function addNote() {
  if (!note.value.trim()) return;
  try {
    await axios.post(`api/candidates/${c.value.id}/notes`, { body: note.value.trim() });
    note.value = "";
    openDetail(c.value.id);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

const archiving = ref(false);
async function archive() {
  try {
    await axios.delete(`api/candidates/${c.value.id}`);
    archiving.value = false;
    drawer.value = false;
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}

// ---- Returning to the candidate ----
const returning = ref(null);
const returnForm = ref({ reason: "", fields: [], documents: [] });
const returnError = ref("");
const returnTypes = ref([]);
async function openReturn(id) {
  returnForm.value = { reason: "", fields: [], documents: [] };
  returnError.value = "";
  returning.value = id;
  const { data } = await axios.get(`api/candidates/${id}`);
  returnTypes.value = data.data.document_types;
}
const fieldOptions = computed(() =>
  ["vacancy_id", "name_ar", "national_id", "citizen", "nationality", "birth_date", "gender", "marital_status", "has_disability", "email", "national_address", "address",
    "has_experience", "experience", "bank_id", "iban", "qualification_id", "specialty_id"].map((value) => ({ value, label: t(`cand.field_${value}`) })),
);
async function sendReturn() {
  if (returnForm.value.reason.trim().length < 3) {
    returnError.value = t("cand.reason_required");
    return;
  }
  try {
    await axios.post(`api/candidates/${returning.value}/return`, { ...returnForm.value, reason: returnForm.value.reason.trim() });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("cand.returned"), life: 2500 });
    const id = returning.value;
    returning.value = null;
    await load();
    if (drawer.value && c.value?.id === id) openDetail(id);
  } catch (error) {
    returnError.value = errorText(error);
  }
}

const noteLine = (n) => {
  if (n.kind === "status") return t("cand.log_status", { from: t(`cand.col_${n.data?.from}`), to: t(`cand.col_${n.data?.to}`) }) + (n.data?.by === "candidate" ? ` · ${t("cand.by_candidate")}` : "");
  if (n.kind === "return") return t("cand.log_return");
  return t("cand.log_note");
};
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2 p-4">
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("cand.title") }}</p>
      <a href="/careers" target="_blank" rel="noopener" class="text-sm"><i class="pi pi-external-link me-1" />{{ $t("cand.open_careers") }}</a>
    </div>
    <Toast />
    <Menu ref="menu" :model="menuItems" popup />

    <div class="sawa-card p-3 flex flex-wrap items-end gap-2 mb-3">
      <IconField class="table-search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.search" :placeholder="$t('cand.search')" @keyup.enter="load" />
      </IconField>
      <DatePicker v-model="filters.range" selectionMode="range" dateFormat="yy-mm-dd" showButtonBar :placeholder="$t('cand.sent_between')" class="w-14rem" @update:modelValue="load" />
      <Select v-model="filters.vacancy_id" :options="vacancies" optionValue="id" :optionLabel="vacancyTitle" showClear filter :placeholder="$t('cand.all_vacancies')" class="w-14rem" @change="load" />
      <div class="flex items-center gap-2">
        <ToggleSwitch v-model="filters.drafts" inputId="cand-drafts" @update:modelValue="load" />
        <label for="cand-drafts">{{ $t("cand.show_drafts") }}</label>
      </div>
      <Button icon="pi pi-search" :label="$t('hrlog.apply')" @click="load" />
      <span class="ms-auto text-color-secondary text-sm">{{ $t("cand.count", { n: rows.length - drafts.length }) }}</span>
    </div>

    <div class="cand-board" :class="{ 'opacity-60': loading }">
      <section v-for="col in columns" :key="col" class="cand-col" :class="{ 'is-over': over === col }" :aria-label="$t(`cand.col_${col}`)"
        @dragover.prevent="canEdit && (over = col)" @dragleave="over === col && (over = null)" @drop.prevent="canEdit && onDrop(col)">
        <header class="cand-col__head">
          <span class="cand-dot" :style="{ background: COLORS[col] }" />
          <strong>{{ $t(`cand.col_${col}`) }}</strong>
          <span class="cand-count" :style="{ color: COLORS[col], background: `${COLORS[col]}1a` }">{{ inColumn(col).length }}</span>
        </header>
        <p class="cand-col__hint">{{ $t(`cand.col_${col}_hint`) }}</p>
        <div class="cand-col__cards">
          <article v-for="card in inColumn(col)" :key="card.id" class="cand-card" :draggable="canEdit" :class="{ 'is-dragging': dragged === card.id }"
            @dragstart="dragged = card.id" @dragend="dragged = null; over = null">
            <div class="cand-card__top">
              <Avatar icon="pi pi-user" shape="circle" class="cand-card__avatar" />
              <div class="cand-card__who">
                <strong>{{ card.name_ar || $t("cand.unnamed") }}</strong>
                <small dir="ltr">{{ card.phone }}</small>
              </div>
              <Button icon="pi pi-ellipsis-h" text rounded size="small" :aria-label="$t('cand.actions')" @click="openMenu($event, card)" />
            </div>
            <small class="cand-card__job"><i class="pi pi-briefcase" /> {{ vacancyTitle(card.vacancy) }}</small>
            <div class="cand-card__progress">
              <div class="flex justify-between text-xs"><span>{{ $t("cand.completion") }}</span><span>{{ card.completion }}%</span></div>
              <ProgressBar :value="card.completion" :showValue="false" style="height: 6px" />
            </div>
            <footer class="cand-card__foot">
              <small><i class="pi pi-clock" /> {{ ago(card.updated_at) }}</small>
              <button type="button" class="cand-card__link" @click="openDetail(card.id)">{{ $t("cand.details") }} <i class="pi pi-arrow-left" /></button>
            </footer>
          </article>
          <div v-if="!inColumn(col).length" class="cand-empty">{{ $t("cand.empty") }}</div>
        </div>
      </section>
    </div>

    <section v-if="filters.drafts && drafts.length" class="sawa-card p-3 mt-3">
      <strong>{{ $t("cand.drafts", { n: drafts.length }) }}</strong>
      <div class="flex flex-wrap gap-2 mt-2">
        <Button v-for="d in drafts" :key="d.id" :label="`${d.name_ar || $t('cand.unnamed')} · ${d.completion}%`" size="small" severity="secondary" outlined @click="openDetail(d.id)" />
      </div>
    </section>

    <!-- The file -->
    <Drawer v-model:visible="drawer" :position="ar ? 'left' : 'right'" class="cand-drawer" :header="c?.name_ar || $t('cand.unnamed')">
      <div v-if="!detail" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
      <div v-else class="flex flex-column gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <Tag :value="$t(`cand.col_${c.status}`)" :style="{ background: COLORS[c.status], color: '#fff' }" />
          <span class="text-sm text-color-secondary">{{ $t("cand.completion") }}: {{ detail.completion }}%</span>
          <span v-if="c.submitted_at" class="text-sm text-color-secondary" dir="ltr">{{ moment(c.submitted_at).format("YYYY-MM-DD HH:mm") }}</span>
        </div>
        <div v-if="canEdit && !['draft', 'hired'].includes(c.status)" class="flex flex-wrap gap-2">
          <Select :modelValue="c.status" :options="columns.filter((x) => x !== 'returned')" :optionLabel="(x) => $t(`cand.col_${x}`)" class="w-12rem"
            :aria-label="$t('cand.move')" @update:modelValue="(s) => moveTo(rows.find((r) => r.id === c.id) ?? c, s)" />
          <Button icon="pi pi-replay" :label="$t('cand.return')" severity="warn" outlined @click="openReturn(c.id)" />
          <Button v-if="can('candidates delete')" icon="pi pi-box" :label="$t('cand.archive')" severity="danger" text @click="archiving = true" />
        </div>

        <section>
          <h3 class="cand-h">{{ $t("cand.file") }}</h3>
          <dl class="cand-facts">
            <template v-for="[key, label, value, ltr] in facts" :key="key">
              <dt>{{ label }}</dt>
              <dd><bdi :dir="ltr ? 'ltr' : undefined">{{ value || "—" }}</bdi></dd>
            </template>
          </dl>
          <div v-if="c.has_experience && c.experience?.length" class="flex flex-column gap-2 mt-2">
            <div v-for="(job, i) in c.experience" :key="i" class="cand-job">
              <strong>{{ job.title }}</strong> — {{ job.employer }}
              <small dir="ltr" class="block text-start">{{ job.from }} → {{ job.current ? $t("careers.current_job") : job.to || "—" }}</small>
            </div>
          </div>
        </section>

        <section>
          <h3 class="cand-h">{{ $t("careers.documents") }}</h3>
          <div class="flex flex-column gap-2">
            <div v-for="type in detail.document_types" :key="type.id" class="cand-doc" :class="{ 'is-missing': detail.missing_documents.includes(type.id) }">
              <div class="flex items-center justify-between gap-2">
                <strong class="text-sm">{{ typeName(type) }}</strong>
                <Tag v-if="detail.missing_documents.includes(type.id)" severity="danger" :value="$t('cand.missing')" />
                <Tag v-else-if="!type.required" severity="secondary" :value="$t('careers.optional')" />
              </div>
              <div class="flex flex-wrap gap-2 mt-1">
                <button v-for="doc in docsOf(type.id)" :key="doc.id" type="button" class="cand-file" :title="doc.original_name" @click="openDoc(doc)">
                  <img v-if="previews[doc.id]" :src="previews[doc.id]" alt="" />
                  <i v-else :class="doc.mime === 'application/pdf' ? 'pi pi-file-pdf' : 'pi pi-file'" />
                  <span>{{ doc.original_name }}</span>
                </button>
                <small v-if="!docsOf(type.id).length" class="text-color-secondary">{{ $t("careers.no_file") }}</small>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 class="cand-h">{{ $t("cand.history") }}</h3>
          <div v-if="canEdit" class="flex gap-2 mb-2">
            <Textarea v-model="note" rows="2" autoResize class="flex-1" :placeholder="$t('cand.note_placeholder')" :aria-label="$t('cand.note_placeholder')" />
            <Button icon="pi pi-send" :aria-label="$t('cand.add_note')" :disabled="!note.trim()" @click="addNote" />
          </div>
          <ol class="cand-timeline">
            <li v-for="n in detail.notes" :key="n.id" :class="`is-${n.kind}`">
              <div class="flex justify-between gap-2 text-sm">
                <strong>{{ noteLine(n) }}</strong>
                <small dir="ltr" class="text-color-secondary">{{ moment(n.created_at).format("YYYY-MM-DD HH:mm") }}</small>
              </div>
              <p v-if="n.body" class="m-0 whitespace-pre-line">{{ n.body }}</p>
              <small v-if="n.kind === 'return' && (n.data?.fields?.length || n.data?.documents?.length)" class="text-color-secondary">
                {{ [...(n.data.fields ?? []).map((f) => $t(`cand.field_${f}`)), ...(n.data.documents ?? []).map((id) => typeName(detail.document_types.find((x) => x.id === id) ?? { name_ar: `#${id}` }))].join("، ") }}
              </small>
              <small class="block text-color-secondary">{{ n.user?.name || (n.data?.by === "candidate" ? $t("cand.by_candidate") : "") }}</small>
            </li>
            <li v-if="!detail.notes.length" class="text-color-secondary">{{ $t("cand.no_history") }}</li>
          </ol>
        </section>
      </div>
    </Drawer>

    <Dialog :visible="!!returning" modal :header="$t('cand.return_title')" :style="{ width: '560px' }" :breakpoints="{ '640px': '95vw' }" @update:visible="returning = null">
      <div class="flex flex-column gap-3">
        <p class="m-0 text-color-secondary">{{ $t("cand.return_hint") }}</p>
        <div class="flex flex-column gap-1">
          <label for="ret-reason">{{ $t("cand.reason") }} <span class="text-red-500">*</span></label>
          <Textarea id="ret-reason" v-model="returnForm.reason" rows="4" autoResize maxlength="2000" :invalid="!!returnError" />
          <small v-if="returnError" class="text-red-500">{{ returnError }}</small>
        </div>
        <div class="flex flex-column gap-1">
          <label for="ret-fields">{{ $t("cand.fix_fields") }}</label>
          <MultiSelect inputId="ret-fields" v-model="returnForm.fields" :options="fieldOptions" optionLabel="label" optionValue="value" filter display="chip" />
        </div>
        <div class="flex flex-column gap-1">
          <label for="ret-docs">{{ $t("cand.fix_documents") }}</label>
          <MultiSelect inputId="ret-docs" v-model="returnForm.documents" :options="returnTypes" :optionLabel="typeName" optionValue="id" display="chip" />
        </div>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="returning = null" />
        <Button icon="pi pi-replay" :label="$t('cand.send_return')" severity="warn" @click="sendReturn" />
      </template>
    </Dialog>

    <Dialog v-model:visible="archiving" modal :header="$t('cand.archive')" :style="{ width: '420px' }">
      <p class="m-0">{{ $t("cand.archive_confirm") }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="archiving = false" />
        <Button icon="pi pi-box" severity="danger" :label="$t('cand.archive')" @click="archive" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.cand-board { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(270px, 1fr); gap: 0.9rem; overflow-x: auto; padding-bottom: 0.75rem; align-items: start; }
.cand-col { background: var(--p-surface-100, #f1f5f9); border-radius: 18px; padding: 0.9rem; display: grid; gap: 0.6rem; border: 2px dashed transparent; transition: border-color 0.15s, background 0.15s; min-height: 220px; }
.cand-col.is-over { border-color: var(--p-primary-color); background: color-mix(in srgb, var(--p-primary-color) 8%, transparent); }
.cand-col__head { display: flex; align-items: center; gap: 0.5rem; }
.cand-dot { width: 10px; height: 10px; border-radius: 99px; }
.cand-count { margin-inline-start: auto; font-weight: 800; font-size: 0.8rem; padding: 0.1rem 0.55rem; border-radius: 99px; }
.cand-col__hint { margin: 0; font-size: 0.78rem; color: var(--p-text-muted-color); line-height: 1.5; }
.cand-col__cards { display: grid; gap: 0.6rem; }
.cand-card { background: var(--p-content-background, #fff); border-radius: 14px; padding: 0.8rem; display: grid; gap: 0.55rem; box-shadow: 0 1px 2px rgb(0 0 0 / 0.06); border: 1px solid var(--p-content-border-color); cursor: grab; transition: transform 0.15s, box-shadow 0.15s; }
.cand-card:hover { box-shadow: 0 6px 18px -8px rgb(0 0 0 / 0.25); transform: translateY(-1px); }
.cand-card.is-dragging { opacity: 0.45; }
.cand-card__top { display: flex; align-items: center; gap: 0.6rem; }
.cand-card__avatar { flex: none; }
.cand-card__who { display: grid; min-width: 0; flex: 1; }
.cand-card__who strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cand-card__who small { color: var(--p-text-muted-color); text-align: start; }
.cand-card__job { color: var(--p-text-muted-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cand-card__progress { display: grid; gap: 0.25rem; color: var(--p-text-muted-color); }
.cand-card__foot { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--p-content-border-color); padding-top: 0.5rem; color: var(--p-text-muted-color); }
.cand-card__link { background: none; border: 0; cursor: pointer; color: var(--p-primary-color); font-weight: 700; display: inline-flex; gap: 0.3rem; align-items: center; }
.cand-empty { border: 2px dashed var(--p-content-border-color); border-radius: 14px; padding: 1.5rem 0.5rem; text-align: center; color: var(--p-text-muted-color); font-size: 0.85rem; }
.cand-h { font-size: 1rem; font-weight: 800; margin: 0 0 0.5rem; }
.cand-facts { display: grid; grid-template-columns: minmax(110px, 40%) 1fr; gap: 0.35rem 0.75rem; margin: 0; font-size: 0.9rem; }
.cand-facts dt { color: var(--p-text-muted-color); }
.cand-facts dd { margin: 0; font-weight: 600; word-break: break-word; }
.cand-job { background: var(--p-surface-100, #f1f5f9); border-radius: 10px; padding: 0.5rem 0.75rem; font-size: 0.9rem; }
.cand-doc { border: 1px solid var(--p-content-border-color); border-radius: 12px; padding: 0.6rem; }
.cand-doc.is-missing { border-color: #fca5a5; background: #fef2f2; }
.cand-file { display: inline-flex; align-items: center; gap: 0.4rem; max-width: 100%; border: 1px solid var(--p-content-border-color); border-radius: 10px; padding: 0.25rem 0.5rem 0.25rem 0.25rem; background: var(--p-content-background, #fff); cursor: pointer; }
.cand-file img { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; }
.cand-file i { font-size: 1.3rem; color: var(--p-primary-color); padding: 0.4rem; }
.cand-file span { font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px; }
.cand-timeline { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.6rem; }
.cand-timeline li { border-inline-start: 3px solid var(--p-content-border-color); padding-inline-start: 0.75rem; }
.cand-timeline li.is-return { border-color: #f59e0b; }
.cand-timeline li.is-status { border-color: #6366f1; }
</style>

<style>
.cand-drawer { width: min(560px, 100vw) !important; }
</style>
