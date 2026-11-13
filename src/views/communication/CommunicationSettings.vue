<script setup>
// «إعدادات التواصل»: what the chat and the calls allow (the parents' side, groups, files, calls and their kinds, the
// ring), the notifications, the services' state and this month's use (Agora bills the call minutes).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";

const { t } = useI18n();
const toast = useToast();
const data = ref(null);
const form = ref(null);
const saving = ref(false);
const canEdit = computed(() => can("communication settings edit"));

// The page works on flat keys ("calls.enabled"); the API takes them nested.
const nest = (flat) => {
  const out = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let node = out;
    parts.slice(0, -1).forEach((p) => (node = node[p] ??= {}));
    node[parts.at(-1)] = value;
  }
  return out;
};

async function load() {
  const { data: res } = await axios.get("api/communication-settings");
  data.value = res.data;
  form.value = { ...res.data.settings, parent_contact_roles: [...(res.data.settings.parent_contact_roles ?? [])], "attachments.mimes": [...(res.data.settings["attachments.mimes"] ?? [])] };
}

async function save() {
  saving.value = true;
  try {
    const { data: res } = await axios.put("api/communication-settings", nest(form.value));
    data.value = res.data;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("cset.saved"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    saving.value = false;
  }
}

const toggle = (list, value) => (list.includes(value) ? list.splice(list.indexOf(value), 1) : list.push(value));
onMounted(load);

// [key, label, hint, disabled-when]
const switches = computed(() => [
  { title: t("cset.s_general"), rows: [
    ["enabled", "cset.enabled", "cset.enabled_hint"],
    ["groups.enabled", "cset.groups", "cset.groups_hint"],
    ["messages.allow_delete", "cset.delete", "cset.delete_hint"],
  ] },
  { title: t("cset.s_parents"), rows: [
    ["parents.enabled", "cset.parents", "cset.parents_hint"],
    ["parents.can_start", "cset.parents_start", "cset.parents_start_hint", () => !form.value["parents.enabled"]],
  ] },
  { title: t("cset.s_calls"), rows: [
    ["calls.enabled", "cset.calls", "cset.calls_hint"],
    ["calls.video", "cset.video", "cset.video_hint", () => !form.value["calls.enabled"]],
    ["calls.group", "cset.group_calls", "cset.group_calls_hint", () => !form.value["calls.enabled"]],
  ] },
  { title: t("cset.s_push"), rows: [
    ["push.enabled", "cset.push", "cset.push_hint"],
    ["push.repeat", "cset.repeat", "cset.repeat_hint", () => !form.value["push.enabled"]],
    ["push.message_preview", "cset.preview", "cset.preview_hint", () => !form.value["push.enabled"]],
  ] },
]);
</script>

<template>
  <div class="cs">
    <header class="cs-head">
      <div>
        <h1><i class="pi pi-comments" aria-hidden="true" /> {{ $t("cset.title") }}</h1>
        <p>{{ $t("cset.subtitle") }}</p>
      </div>
      <Button v-if="canEdit && form" :label="$t('save')" icon="pi pi-check" :loading="saving" @click="save" />
    </header>

    <div v-if="!data" class="cs-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else>
      <!-- The services and this month's use -->
      <section class="cs-cards">
        <div class="cs-card" :class="data.services.realtime ? 'ok' : 'bad'"><i class="pi pi-bolt" /><b>{{ $t("cset.svc_realtime") }}</b><span>{{ $t(data.services.realtime ? "cset.on" : "cset.off") }}</span></div>
        <div class="cs-card" :class="data.services.calls ? 'ok' : 'bad'"><i class="pi pi-video" /><b>{{ $t("cset.svc_calls") }}</b><span>{{ $t(data.services.calls ? "cset.on" : "cset.off") }}</span></div>
        <div class="cs-card" :class="data.services.push ? 'ok' : 'bad'"><i class="pi pi-bell" /><b>{{ $t("cset.svc_push") }}</b><span>{{ $t("cset.devices", { n: data.services.push_devices }) }}</span></div>
        <div class="cs-card"><i class="pi pi-envelope" /><b>{{ data.usage.messages_month }}</b><span>{{ $t("cset.u_messages") }}</span></div>
        <div class="cs-card"><i class="pi pi-phone" /><b>{{ data.usage.answered_month }} / {{ data.usage.calls_month }}</b><span>{{ $t("cset.u_calls") }}</span></div>
        <div class="cs-card"><i class="pi pi-clock" /><b>{{ data.usage.minutes_month }}</b><span>{{ $t("cset.u_minutes", { video: data.usage.video_minutes_month }) }}</span></div>
      </section>

      <fieldset :disabled="!canEdit" class="cs-form">
        <section v-for="group in switches" :key="group.title" class="cs-block">
          <h2>{{ group.title }}</h2>
          <div v-for="[key, label, hint, off] in group.rows" :key="key" class="cs-row" :class="{ 'is-off': off && off() }">
            <div><b>{{ $t(label) }}</b><small>{{ $t(hint) }}</small></div>
            <ToggleSwitch v-model="form[key]" :disabled="!canEdit || (off && off())" />
          </div>
          <!-- Group extras -->
          <template v-if="group.title === $t('cset.s_parents')">
            <div class="cs-row is-col">
              <div><b>{{ $t("cset.parent_roles") }}</b><small>{{ $t("cset.parent_roles_hint") }}</small></div>
              <div class="cs-chips">
                <button v-for="r in data.roles" :key="r.key" type="button" class="cs-chip" :class="{ on: form.parent_contact_roles.includes(r.key) }"
                  :disabled="!canEdit" @click="toggle(form.parent_contact_roles, r.key)">{{ r.name }}</button>
              </div>
            </div>
          </template>
          <template v-if="group.title === $t('cset.s_calls')">
            <div class="cs-row">
              <div><b>{{ $t("cset.ring_seconds") }}</b><small>{{ $t("cset.ring_seconds_hint") }}</small></div>
              <InputNumber v-model="form['calls.ring_seconds']" :min="15" :max="120" suffix=" ث" showButtons inputClass="cs-num" />
            </div>
            <div class="cs-row">
              <div><b>{{ $t("cset.max_participants") }}</b><small>{{ $t("cset.max_participants_hint") }}</small></div>
              <InputNumber v-model="form['calls.max_participants']" :min="2" :max="16" showButtons inputClass="cs-num" />
            </div>
          </template>
          <template v-if="group.title === $t('cset.s_push')">
            <div class="cs-row" :class="{ 'is-off': !form['push.enabled'] || !form['push.repeat'] }">
              <div><b>{{ $t("cset.repeat_seconds") }}</b><small>{{ $t("cset.repeat_seconds_hint") }}</small></div>
              <InputNumber v-model="form['push.repeat_seconds']" :min="2" :max="15" suffix=" ث" showButtons inputClass="cs-num" />
            </div>
          </template>
        </section>

        <section class="cs-block">
          <h2>{{ $t("cset.s_files") }}</h2>
          <div class="cs-row">
            <div><b>{{ $t("cset.files") }}</b><small>{{ $t("cset.files_hint") }}</small></div>
            <ToggleSwitch v-model="form['attachments.enabled']" :disabled="!canEdit" />
          </div>
          <div class="cs-row" :class="{ 'is-off': !form['attachments.enabled'] }">
            <div><b>{{ $t("cset.max_mb") }}</b><small>{{ $t("cset.max_mb_hint") }}</small></div>
            <InputNumber :modelValue="Math.round(form['attachments.max_kb'] / 1024)" @update:modelValue="(v) => (form['attachments.max_kb'] = (v || 1) * 1024)"
              :min="1" :max="50" suffix=" MB" showButtons inputClass="cs-num" />
          </div>
          <div class="cs-row is-col" :class="{ 'is-off': !form['attachments.enabled'] }">
            <div><b>{{ $t("cset.mimes") }}</b><small>{{ $t("cset.mimes_hint") }}</small></div>
            <div class="cs-chips">
              <button v-for="m in data.all_mimes" :key="m" type="button" class="cs-chip" :class="{ on: form['attachments.mimes'].includes(m) }"
                :disabled="!canEdit" @click="toggle(form['attachments.mimes'], m)">{{ m }}</button>
            </div>
          </div>
        </section>
      </fieldset>
    </template>
  </div>
</template>

<style scoped>
.cs { display: flex; flex-direction: column; gap: 1rem; }
.cs-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
.cs-head h1 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: rgb(var(--bp-135c65)); }
.cs-head p { margin: 0; color: #6b7280; }
.cs-loading { display: flex; justify-content: center; padding: 3rem; font-size: 1.6rem; }
.cs-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 0.75rem; }
.cs-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 0.9rem 1rem; display: flex; flex-direction: column; gap: 0.2rem; }
.cs-card i { color: rgb(var(--bp-135c65)); }
.cs-card b { font-size: 1.2rem; }
.cs-card span { color: #64748b; font-size: 0.85rem; }
.cs-card.ok { border-color: #86efac; }
.cs-card.ok i { color: #16a34a; }
.cs-card.bad { border-color: #fecaca; }
.cs-card.bad i { color: #dc2626; }
.cs-form { border: 0; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 1rem; }
.cs-block { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1rem 1.25rem; }
.cs-block h2 { font-size: 1.05rem; font-weight: 700; margin: 0 0 0.5rem; }
.cs-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.7rem 0; border-top: 1px solid #f1f5f9; }
.cs-row.is-col { flex-direction: column; align-items: stretch; }
.cs-row > div:first-child { display: flex; flex-direction: column; gap: 0.15rem; }
.cs-row small { color: #64748b; }
.cs-row.is-off { opacity: 0.5; }
.cs-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.cs-chip { padding: 0.3rem 0.75rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; font-size: 0.85rem; }
.cs-chip.on { background: rgb(var(--bp-135c65)); border-color: rgb(var(--bp-135c65)); color: #fff; }
:deep(.cs-num) { width: 5.5rem; text-align: center; }
@media (max-width: 640px) { .cs-form { grid-template-columns: 1fr; } }
</style>
