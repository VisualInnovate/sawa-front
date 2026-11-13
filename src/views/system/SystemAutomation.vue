<script setup>
// «المهام التلقائية والتنبيهات»: switch each automatic task on or off and choose its interval or time; the system's
// health and who gets an alert, by e-mail, Telegram or WhatsApp; the WhatsApp connection (Meta WhatsApp Cloud API).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";

const { t, locale } = useI18n();
const toast = useToast();
const data = ref(null);
const tab = ref("tasks");
const tasks = ref([]);
const alerts = ref(null);
const wa = ref(null);
const busy = ref("");
const testPhone = ref("");
const canEdit = computed(() => can("system settings edit"));
const lang = computed(() => (locale.value === "en" ? "en" : "ar"));
const listText = (list) => (list ?? []).join("\n");
const textList = (text) => text.split(/[\n,،]+/).map((s) => s.trim()).filter(Boolean);
const emailText = ref("");
const chatText = ref("");
const waText = ref("");

function fill(res) {
  data.value = res;
  tasks.value = res.tasks.map((x) => ({ ...x }));
  alerts.value = JSON.parse(JSON.stringify(res.alerts));
  wa.value = { ...res.whatsapp };
  emailText.value = listText(res.alerts.email.to);
  chatText.value = listText(res.alerts.telegram.chat_ids);
  waText.value = listText(res.alerts.whatsapp.to);
}
async function load() {
  const { data: res } = await axios.get("api/system-settings");
  fill(res.data);
}
const fail = (e) => toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 5000 });
const done = (detail) => toast.add({ severity: "success", summary: t("success_message"), detail, life: 2500 });

async function call(key, fn) {
  busy.value = key;
  try {
    await fn();
  } catch (e) {
    fail(e);
  } finally {
    busy.value = "";
  }
}
const saveTasks = () => call("tasks", async () => {
  const { data: res } = await axios.put("api/system-settings/tasks", { tasks: tasks.value.map(({ key, enabled, every, at }) => ({ key, enabled, every, at })) });
  fill(res.data);
  done(t("sysset.saved"));
});
const runTask = (task) => call("run:" + task.key, async () => {
  const { data: res } = await axios.post(`api/system-settings/tasks/${task.key}/run`);
  toast.add({ severity: res.data.ok ? "success" : "error", summary: task.label[lang.value], detail: res.data.output || (res.data.ok ? t("sysset.ran") : t("error")), life: 6000 });
  await load();
});
const saveAlerts = () => call("alerts", async () => {
  const body = JSON.parse(JSON.stringify(alerts.value));
  body.email.to = textList(emailText.value);
  body.telegram.chat_ids = textList(chatText.value);
  body.whatsapp.to = textList(waText.value);
  const { data: res } = await axios.put("api/system-settings/alerts", body);
  fill(res.data);
  done(t("sysset.saved"));
});
const testAlert = () => call("test", async () => {
  const { data: res } = await axios.post("api/system-settings/alerts/test");
  const entries = Object.entries(res.data);
  toast.add({ severity: entries.length && entries.every(([, v]) => v === "ok") ? "success" : "warn", summary: t("sysset.test_alert"),
    detail: entries.length ? entries.map(([k, v]) => `${k}: ${v === "ok" ? "✓" : v}`).join(" · ") : t("sysset.no_channels"), life: 8000 });
});
const checkNow = () => call("health", async () => {
  const { data: res } = await axios.post("api/system-settings/health");
  fill(res.data);
});
const saveWa = () => call("wa", async () => {
  const { data: res } = await axios.put("api/system-settings/whatsapp", wa.value);
  fill(res.data);
  done(t("sysset.saved"));
});
const testWa = () => call("watest", async () => {
  const { data: res } = await axios.post("api/system-settings/whatsapp/test", { phone: testPhone.value });
  toast.add({ severity: res.data.ok ? "success" : "error", summary: "WhatsApp", detail: res.data.ok ? t("sysset.wa_sent") : res.data.error, life: 7000 });
});

const fmt = (iso) => (iso ? new Date(iso).toLocaleString(lang.value === "en" ? "en-GB" : "ar-JO-u-nu-latn", { dateStyle: "short", timeStyle: "short" }) : "—");
const everyLabel = (n) => (n < 60 ? t("sysset.every_min", { n }) : t("sysset.every_hour", { n: n / 60 }));
const schedulerOk = computed(() => data.value?.scheduler?.heartbeat && Date.now() - new Date(data.value.scheduler.heartbeat).getTime() < 10 * 60 * 1000);
const audienceTag = { parents: "warn", staff: "info", system: "secondary", management: "success" };
onMounted(load);
</script>

<template>
  <div class="sa">
    <header class="sa-head">
      <div>
        <h1><i class="pi pi-clock" aria-hidden="true" /> {{ $t("sysset.title") }}</h1>
        <p>{{ $t("sysset.subtitle") }}</p>
      </div>
    </header>

    <div v-if="!data" class="sa-loading"><i class="pi pi-spin pi-spinner" /></div>
    <template v-else>
      <!-- Health -->
      <section class="sa-health">
        <div class="sa-card" :class="schedulerOk ? 'ok' : 'bad'">
          <i class="pi pi-sync" /><b>{{ $t("sysset.scheduler") }}</b>
          <span>{{ schedulerOk ? $t("sysset.scheduler_ok", { at: fmt(data.scheduler.heartbeat) }) : $t("sysset.scheduler_off") }}</span>
        </div>
        <div v-for="c in data.health.checks" :key="c.key" class="sa-card" :class="c.ok ? 'ok' : 'bad'">
          <i :class="c.ok ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'" /><span>{{ c.message }}</span>
        </div>
        <div class="sa-card sa-check">
          <small>{{ $t("sysset.checked_at", { at: fmt(data.health.checked_at) }) }}</small>
          <Button :label="$t('sysset.check_now')" icon="pi pi-refresh" size="small" outlined :loading="busy === 'health'" @click="checkNow" />
        </div>
      </section>

      <nav class="sa-tabs" role="tablist">
        <button v-for="k in ['tasks', 'alerts', 'whatsapp']" :key="k" type="button" role="tab" :aria-selected="tab === k" :class="{ on: tab === k }" @click="tab = k">
          {{ $t("sysset.tab_" + k) }}
        </button>
      </nav>

      <!-- Automatic tasks -->
      <section v-if="tab === 'tasks'" class="sa-block">
        <div class="sa-block-head">
          <p>{{ $t("sysset.tasks_hint", { tz: data.scheduler.timezone }) }}</p>
          <Button v-if="canEdit" :label="$t('save')" icon="pi pi-check" :loading="busy === 'tasks'" @click="saveTasks" />
        </div>
        <div v-for="task in tasks" :key="task.key" class="sa-task" :class="{ 'is-off': !task.enabled }">
          <ToggleSwitch v-model="task.enabled" :disabled="!canEdit" :aria-label="task.label[lang]" />
          <div class="sa-task-main">
            <b>{{ task.label[lang] }} <Tag :value="$t('sysset.aud_' + task.audience)" :severity="audienceTag[task.audience]" /></b>
            <small>{{ task.note[lang] }}</small>
            <small class="sa-last">
              <template v-if="task.last?.finished_at">
                <i :class="task.last.ok ? 'pi pi-check' : 'pi pi-times'" :style="{ color: task.last.ok ? '#16a34a' : '#dc2626' }" />
                {{ $t("sysset.last_run", { at: fmt(task.last.finished_at), n: task.last.runs }) }}
              </template>
              <template v-else>{{ $t("sysset.never_ran") }}</template>
            </small>
          </div>
          <div class="sa-task-when">
            <Select v-if="task.kind === 'interval'" v-model="task.every" :options="data.intervals" :optionLabel="(n) => everyLabel(n)" :disabled="!canEdit" class="sa-select" />
            <InputText v-else v-model="task.at" type="time" :disabled="!canEdit" class="sa-time" />
            <Button v-if="canEdit" v-tooltip.top="$t('sysset.run_now')" icon="pi pi-play" text rounded :loading="busy === 'run:' + task.key" :aria-label="$t('sysset.run_now')" @click="runTask(task)" />
          </div>
        </div>
      </section>

      <!-- Alerts -->
      <section v-if="tab === 'alerts'" class="sa-block">
        <fieldset :disabled="!canEdit" class="sa-fields">
          <div class="sa-block-head">
            <label class="sa-inline"><ToggleSwitch v-model="alerts.enabled" /> <b>{{ $t("sysset.alerts_on") }}</b></label>
            <div class="sa-actions">
              <Button :label="$t('sysset.test_alert')" icon="pi pi-send" outlined :loading="busy === 'test'" @click="testAlert" />
              <Button :label="$t('save')" icon="pi pi-check" :loading="busy === 'alerts'" @click="saveAlerts" />
            </div>
          </div>
          <div class="sa-grid">
            <div class="sa-channel">
              <label class="sa-inline"><ToggleSwitch v-model="alerts.email.enabled" /> <b><i class="pi pi-envelope" /> {{ $t("sysset.email") }}</b></label>
              <Textarea v-model="emailText" rows="3" :placeholder="$t('sysset.email_ph')" autoResize />
            </div>
            <div class="sa-channel">
              <label class="sa-inline"><ToggleSwitch v-model="alerts.telegram.enabled" /> <b><i class="pi pi-telegram" /> Telegram</b></label>
              <InputText v-model="alerts.telegram.bot_token" :placeholder="$t('sysset.tg_token')" />
              <Textarea v-model="chatText" rows="2" :placeholder="$t('sysset.tg_chats')" autoResize />
              <small>{{ $t("sysset.tg_hint") }}</small>
            </div>
            <div class="sa-channel">
              <label class="sa-inline"><ToggleSwitch v-model="alerts.whatsapp.enabled" :disabled="!data.whatsapp.configured" /> <b><i class="pi pi-whatsapp" /> WhatsApp</b></label>
              <Textarea v-model="waText" rows="3" :placeholder="$t('sysset.wa_numbers')" autoResize />
              <small v-if="!data.whatsapp.configured" class="sa-warn">{{ $t("sysset.wa_not_ready") }}</small>
            </div>
          </div>
          <h2>{{ $t("sysset.checks") }}</h2>
          <div class="sa-checks">
            <label v-for="(on, key) in alerts.checks" :key="key" class="sa-inline"><Checkbox v-model="alerts.checks[key]" binary /> {{ $t("sysset.c_" + key) }}</label>
          </div>
          <div class="sa-grid sa-thresholds">
            <label>{{ $t("sysset.t_disk") }} <InputNumber v-model="alerts.thresholds.disk_free_percent" :min="1" :max="50" suffix="%" /></label>
            <label>{{ $t("sysset.t_ssl") }} <InputNumber v-model="alerts.thresholds.ssl_days" :min="1" :max="60" /></label>
            <label>{{ $t("sysset.t_errors") }} <InputNumber v-model="alerts.thresholds.errors_per_hour" :min="1" :max="10000" /></label>
            <label>{{ $t("sysset.t_repeat") }} <InputNumber v-model="alerts.repeat_hours" :min="1" :max="72" /></label>
          </div>
        </fieldset>
      </section>

      <!-- WhatsApp connection -->
      <section v-if="tab === 'whatsapp'" class="sa-block">
        <fieldset :disabled="!canEdit" class="sa-fields">
          <div class="sa-block-head">
            <label class="sa-inline"><ToggleSwitch v-model="wa.enabled" /> <b>{{ $t("sysset.wa_on") }}</b>
              <Tag :value="data.whatsapp.configured ? $t('sysset.wa_ready') : $t('sysset.wa_off')" :severity="data.whatsapp.configured ? 'success' : 'secondary'" /></label>
            <Button :label="$t('save')" icon="pi pi-check" :loading="busy === 'wa'" @click="saveWa" />
          </div>
          <p class="sa-hint">{{ $t("sysset.wa_hint") }}</p>
          <div class="sa-grid">
            <label>{{ $t("sysset.wa_phone_id") }}<InputText v-model="wa.phone_number_id" inputmode="numeric" /></label>
            <label>{{ $t("sysset.wa_waba") }}<InputText v-model="wa.business_account_id" inputmode="numeric" /></label>
            <label>{{ $t("sysset.wa_token") }}<InputText v-model="wa.access_token" :placeholder="$t('sysset.wa_token_ph')" /></label>
            <label>{{ $t("sysset.wa_template") }}<InputText v-model="wa.alert_template" placeholder="system_alert" /></label>
            <label>{{ $t("sysset.wa_lang") }}<InputText v-model="wa.template_language" /></label>
            <label>{{ $t("sysset.wa_country") }}<InputText v-model="wa.country_code" inputmode="numeric" /></label>
            <label>API<InputText v-model="wa.api_version" /></label>
          </div>
          <div class="sa-test">
            <InputText v-model="testPhone" :placeholder="$t('sysset.wa_test_ph')" inputmode="tel" />
            <Button :label="$t('sysset.wa_test')" icon="pi pi-send" outlined :disabled="!data.whatsapp.configured || !testPhone" :loading="busy === 'watest'" @click="testWa" />
          </div>
        </fieldset>
      </section>
    </template>
  </div>
</template>

<style scoped>
.sa { display: flex; flex-direction: column; gap: 1rem; }
.sa-head h1 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: rgb(var(--bp-135c65)); }
.sa-head p { margin: 0; color: #6b7280; }
.sa-loading { display: flex; justify-content: center; padding: 3rem; font-size: 1.6rem; }
.sa-health { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.6rem; }
.sa-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 0.75rem 0.9rem; display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.88rem; }
.sa-card.ok { border-color: #86efac; } .sa-card.ok i { color: #16a34a; }
.sa-card.bad { border-color: #fecaca; background: #fff7f7; } .sa-card.bad i { color: #dc2626; }
.sa-check { justify-content: space-between; gap: 0.5rem; }
.sa-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.sa-tabs button { padding: 0.45rem 1rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; font-weight: 600; }
.sa-tabs button.on { background: rgb(var(--bp-135c65)); border-color: rgb(var(--bp-135c65)); color: #fff; }
.sa-block { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1rem 1.25rem; }
.sa-block h2 { font-size: 1rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.sa-block-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.sa-block-head p { margin: 0; color: #64748b; font-size: 0.88rem; flex: 1; min-width: 220px; }
.sa-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.sa-task { display: grid; grid-template-columns: auto 1fr auto; gap: 0.9rem; align-items: center; padding: 0.8rem 0; border-top: 1px solid #f1f5f9; }
.sa-task.is-off .sa-task-main { opacity: 0.6; }
.sa-task-main { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
.sa-task-main b { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.sa-task-main small { color: #64748b; }
.sa-last { font-size: 0.8rem; }
.sa-task-when { display: flex; align-items: center; gap: 0.3rem; }
.sa-select { min-width: 9.5rem; }
.sa-time { width: 7.5rem; }
.sa-fields { border: 0; padding: 0; margin: 0; }
.sa-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.9rem; }
.sa-grid label, .sa-channel { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.9rem; }
.sa-channel { border: 1px solid #f1f5f9; border-radius: 12px; padding: 0.75rem; }
.sa-channel small { color: #64748b; }
.sa-inline { display: inline-flex !important; flex-direction: row !important; align-items: center; gap: 0.5rem; }
.sa-checks { display: flex; flex-wrap: wrap; gap: 0.9rem 1.4rem; margin-bottom: 1rem; }
.sa-thresholds { margin-top: 0.5rem; }
.sa-hint { color: #64748b; font-size: 0.88rem; margin: 0 0 0.75rem; }
.sa-warn { color: #b45309 !important; }
.sa-test { display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; }
@media (max-width: 640px) {
  .sa-task { grid-template-columns: auto 1fr; }
  .sa-task-when { grid-column: 1 / -1; justify-content: flex-end; }
}
</style>
