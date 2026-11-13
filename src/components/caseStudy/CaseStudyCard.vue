<script setup>
// «دراسة حالة الطالب» on the child's details: send the form to the parents' portal, follow whether they filled it in,
// and read (and print) what they answered — right where it was sent from.
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import CaseStudyAnswers from "./CaseStudyAnswers.vue";
import { STATUS } from "@/utils/caseStudy";
import { can } from "@/utils/permissions";

const props = defineProps({ childId: { type: [Number, String], required: true } });
const { t } = useI18n();
const toast = useToast();

const loading = ref(true);
const failed = ref(false);
const busy = ref(false);
const sections = ref([]);
const rows = ref([]);
const child = ref(null);
const hasParent = ref(true);
const openId = ref(null);
const confirm = ref(null); // { kind: 'delete' | 'reopen', row }

const canSend = computed(() => can("child edit"));
const waiting = computed(() => rows.value.find((row) => row.status === "sent") ?? null);
const opened = computed(() => rows.value.find((row) => row.id === openId.value) ?? null);
const hasAnswers = (row) => Object.keys(row.answers ?? {}).length > 0;

async function load() {
  loading.value = true;
  failed.value = false;
  try {
    const { data } = await axios.get(`/api/child-case-studies/${props.childId}`);
    sections.value = data.form ?? [];
    rows.value = data.data ?? [];
    child.value = data.child;
    hasParent.value = data.has_parent;
    // The newest filled-in form is open straight away.
    openId.value = rows.value.find((row) => row.status === "submitted")?.id ?? null;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

async function run(request, done) {
  if (busy.value) return;
  busy.value = true;
  try {
    await request();
    toast.add({ severity: "success", summary: t(done), life: 3000 });
    confirm.value = null;
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: error.response?.data?.message || t("request_failed_retry"), life: 5000 });
  } finally {
    busy.value = false;
  }
}
const send = () => run(() => axios.post(`/api/child-case-studies/${props.childId}`), "cs.sent_toast");
const decide = () => (confirm.value.kind === "delete"
  ? run(() => axios.delete(`/api/child-case-studies/${props.childId}/${confirm.value.row.id}`), "cs.deleted_toast")
  : run(() => axios.post(`/api/child-case-studies/${props.childId}/${confirm.value.row.id}/reopen`), "cs.reopened_toast"));
const toggle = (row) => { openId.value = openId.value === row.id ? null : row.id; };
const print = () => window.print();
</script>

<template>
  <section class="cs-card sawa-card">
    <header class="cs-card__head">
      <div>
        <h2 class="cs-card__title"><i class="pi pi-file-edit" /> {{ $t("cs.title") }}</h2>
        <p class="cs-card__lead">{{ $t("cs.admin_lead") }}</p>
      </div>
      <Button v-if="canSend && !loading && !failed" class="cs-no-print" icon="pi pi-send" :label="rows.length ? $t('cs.send_again') : $t('cs.send')"
        :loading="busy" :disabled="!hasParent || !!waiting" @click="send" />
    </header>

    <div v-if="loading" class="cs-card__state"><i class="pi pi-spin pi-spinner" /> {{ $t("loading") }}</div>
    <div v-else-if="failed" class="cs-card__state">
      {{ $t("request_failed_retry") }} <Button text :label="$t('cs.retry')" @click="load" />
    </div>
    <template v-else>
      <Message v-if="!hasParent" severity="warn" :closable="false">{{ $t("cs.no_parent") }}</Message>
      <Message v-else-if="waiting && canSend" severity="info" :closable="false" class="cs-no-print">{{ $t("cs.waiting_hint") }}</Message>
      <p v-if="!rows.length && hasParent" class="cs-card__empty">{{ $t("cs.never_sent") }}</p>

      <article v-for="row in rows" :key="row.id" class="cs-item" :class="{ 'is-open': openId === row.id, 'cs-no-print': openId !== row.id }">
        <div class="cs-item__head">
          <Tag :severity="STATUS[row.status]?.severity" :icon="STATUS[row.status]?.icon" :value="$t(STATUS[row.status]?.label ?? row.status)" />
          <div class="cs-item__meta">
            <span><i class="pi pi-send" /> {{ $t("cs.sent_on", { date: row.sent_at }) }}<template v-if="row.sent_by"> · {{ row.sent_by }}</template></span>
            <span v-if="row.submitted_at"><i class="pi pi-check" /> {{ $t("cs.submitted_on", { date: row.submitted_at }) }}</span>
            <span v-else-if="row.saved_at"><i class="pi pi-pencil" /> {{ $t("cs.draft_on", { date: row.saved_at }) }}</span>
            <span v-if="row.status === 'submitted' && row.unanswered"><i class="pi pi-info-circle" /> {{ $t("cs.unanswered", { n: row.unanswered }) }}</span>
          </div>
          <div class="cs-item__tools cs-no-print">
            <Button v-if="hasAnswers(row)" text size="small" :icon="openId === row.id ? 'pi pi-chevron-up' : 'pi pi-eye'"
              :label="openId === row.id ? $t('cs.hide') : (row.status === 'sent' ? $t('cs.show_draft') : $t('cs.show'))" @click="toggle(row)" />
            <Button v-if="openId === row.id" text size="small" icon="pi pi-print" :label="$t('print')" @click="print" />
            <Button v-if="canSend && row.status === 'submitted' && !waiting" text size="small" icon="pi pi-replay" :label="$t('cs.reopen')" @click="confirm = { kind: 'reopen', row }" />
            <Button v-if="canSend && row.status === 'sent'" text size="small" severity="danger" icon="pi pi-times" :label="$t('cs.withdraw')" @click="confirm = { kind: 'delete', row }" />
          </div>
        </div>
        <div v-if="openId === row.id && opened" class="cs-item__body">
          <div class="cs-print-head">
            <b>{{ $t("cs.title") }}</b>
            <span>{{ child?.name }}<template v-if="child?.birth_date"> · {{ child.birth_date }}</template></span>
            <span>{{ row.submitted_at || row.saved_at }}</span>
          </div>
          <CaseStudyAnswers :sections="sections" :answers="row.answers" />
        </div>
      </article>
    </template>

    <Dialog :visible="!!confirm" modal :header="confirm?.kind === 'delete' ? $t('cs.withdraw') : $t('cs.reopen')" :style="{ width: '26rem' }" @update:visible="confirm = null">
      <p class="m-0 leading-7">{{ confirm?.kind === "delete" ? $t("cs.withdraw_text") : $t("cs.reopen_text") }}</p>
      <template #footer>
        <Button text severity="secondary" :label="$t('cancel')" @click="confirm = null" />
        <Button :severity="confirm?.kind === 'delete' ? 'danger' : undefined" :label="confirm?.kind === 'delete' ? $t('cs.withdraw') : $t('cs.reopen')" :loading="busy" @click="decide" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped>
.cs-card {
  max-width: 56rem;
  margin: 1.5rem auto 0;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  display: grid;
  gap: 1rem;
}
.cs-card__head {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
}
.cs-card__title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
}
.cs-card__title i {
  color: var(--p-primary-color);
}
.cs-card__lead,
.cs-card__empty,
.cs-card__state {
  margin: 0.25rem 0 0;
  color: var(--p-text-muted-color, #6b7280);
  line-height: 1.8;
}
.cs-item {
  border: 1px solid var(--p-content-border-color, #e5e7eb);
  border-radius: 12px;
}
.cs-item__head {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  align-items: center;
  padding: 0.85rem 1rem;
}
.cs-item__meta {
  flex: 1;
  min-width: 14rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.1rem;
  font-size: 0.88rem;
  color: var(--p-text-muted-color, #6b7280);
}
.cs-item__meta i {
  font-size: 0.8rem;
  margin-inline-end: 0.25rem;
}
.cs-item__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem;
}
.cs-item__body {
  padding: 1rem;
  border-top: 1px solid var(--p-content-border-color, #e5e7eb);
  --cs-accent: var(--p-primary-color);
}
.cs-print-head {
  display: none;
}
@media print {
  .cs-no-print {
    display: none !important;
  }
  .cs-card {
    max-width: none;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }
  .cs-card__head,
  .cs-item__head {
    display: none;
  }
  .cs-item,
  .cs-item__body {
    border: 0;
    padding: 0;
  }
  .cs-print-head {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 2px solid #000;
    font-size: 1.05rem;
  }
}
</style>
