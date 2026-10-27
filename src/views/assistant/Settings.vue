<script setup>
// «المساعد الذكي», for each assistant (parent portal, dashboard): what it may reach, its model and limits, its spending
// and conversations; for the parent one also the questions it asks, the evaluation suggestion rules and the parents'
// answers. The dashboard assistant's pages are each employee's menu; here the management only hides some of them.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { allMenuPages } from "@/utils/assistantPages";
import AssistantQuestions from "@/components/assistant/AssistantQuestions.vue";
import AssistantRules from "@/components/assistant/AssistantRules.vue";
import AssistantConversations from "@/components/assistant/AssistantConversations.vue";
import AssistantIntakes from "@/components/assistant/AssistantIntakes.vue";

const { t } = useI18n();
const toast = useToast();

const assistant = ref("parent");
const assistants = computed(() => [
  { value: "parent", label: t("ai.assistant_parent") },
  { value: "dashboard", label: t("ai.assistant_dashboard") },
  { value: "public", label: t("ai.assistant_public") },
]);
const isParent = computed(() => assistant.value === "parent");
const isPublic = computed(() => assistant.value === "public");
// The parent portal's and the public site's pages are chosen here; the dashboard's come from each employee's menu.
const fixedPages = computed(() => assistant.value !== "dashboard");
// The texts that differ by assistant.
const text = (parent, dashboard, visitors) => (isParent.value ? t(parent) : isPublic.value ? t(visitors) : t(dashboard));
const data = ref(null);
const form = ref({});
const tab = ref("general");
const saving = ref(false);
const canEdit = computed(() => can("ai assistant edit"));
const canList = computed(() => can("ai assistant list"));
const usd = (value) => `$${Number(value ?? 0).toFixed(2)}`;
const menuPages = computed(() => allMenuPages(t));

async function load() {
  const key = assistant.value;
  const { data: res } = await axios.get(`api/assistant-settings/${key}`);
  if (key !== assistant.value) return;
  data.value = res.data;
  const s = res.data.settings;
  form.value = {
    enabled: s.enabled,
    model: s.model,
    monthly_budget_usd: s.monthly_budget_usd,
    daily_messages_per_user: s.daily_messages_per_user,
    tools: [...(s.tools ?? [])],
    knowledge: s.knowledge ?? "",
    welcome_message: s.welcome_message ?? "",
    ...(key !== "dashboard" ? { routes: [...(s.routes ?? [])] } : { hidden_routes: [...(s.hidden_routes ?? [])] }),
  };
}

async function save() {
  saving.value = true;
  try {
    const { data: res } = await axios.put(`api/assistant-settings/${assistant.value}`, form.value);
    data.value = res.data;
    toast.add({ severity: "success", summary: t("ai.saved"), life: 2500 });
  } catch (error) {
    const errors = error.response?.data?.errors;
    toast.add({ severity: "error", summary: t("error"), detail: errors ? Object.values(errors).flat()[0] : error.response?.data?.message, life: 4000 });
  } finally {
    saving.value = false;
  }
}

function toggle(list, key, on) {
  const set = new Set(form.value[list]);
  on ? set.add(key) : set.delete(key);
  form.value[list] = [...set];
}

watch(assistant, () => {
  data.value = null;
  tab.value = "general";
  load();
});
onMounted(load);
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 p-4">
    <p class="text-xl text-[#135C65] font-bold m-0">{{ $t("ai.page_title") }}</p>
    <SelectButton v-model="assistant" :options="assistants" optionLabel="label" optionValue="value" :allowEmpty="false" />
  </div>
  <div class="sawa-card p-3">
    <div v-if="!data" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <template v-else>
      <Message v-if="!data.has_api_key" severity="warn" class="mb-3">{{ $t("ai.no_api_key") }}</Message>

      <div class="ai-usage mb-3">
        <div class="ai-stat">
          <span>{{ $t("ai.spent_month") }}</span>
          <b>{{ usd(data.usage.spent_month) }} / {{ usd(data.settings.monthly_budget_usd) }}</b>
          <ProgressBar :value="Math.min(100, (data.usage.spent_month / (data.settings.monthly_budget_usd || 1)) * 100)" :showValue="false" style="height: 6px" />
        </div>
        <div class="ai-stat">
          <span>{{ $t("ai.spent_all") }}</span>
          <b>{{ usd(data.usage.spent_month_all) }} / {{ usd(data.usage.monthly_cap_usd) }}</b>
          <ProgressBar :value="Math.min(100, (data.usage.spent_month_all / (data.usage.monthly_cap_usd || 1)) * 100)" :showValue="false" style="height: 6px" />
        </div>
        <div class="ai-stat"><span>{{ $t("ai.questions_month") }}</span><b>{{ data.usage.questions_month }}</b></div>
        <div class="ai-stat"><span>{{ $t("ai.conversations_month") }}</span><b>{{ data.usage.conversations_month }}</b></div>
        <div class="ai-stat"><span>{{ text("ai.parents_month", "ai.owners_month", "ai.visitors_month") }}</span><b>{{ data.usage.parents_month }}</b></div>
      </div>

      <Tabs v-model:value="tab" scrollable>
        <TabList>
          <Tab value="general"><i class="pi pi-cog mx-1" />{{ $t("ai.tab_general") }}</Tab>
          <Tab value="access"><i class="pi pi-lock mx-1" />{{ $t("ai.tab_access") }}</Tab>
          <Tab v-if="isParent" value="questions"><i class="pi pi-question-circle mx-1" />{{ $t("ai.tab_questions") }}</Tab>
          <Tab v-if="isParent" value="rules"><i class="pi pi-sitemap mx-1" />{{ $t("ai.tab_rules") }}</Tab>
          <Tab v-if="canList" value="conversations"><i class="pi pi-comments mx-1" />{{ $t("ai.tab_conversations") }}</Tab>
          <Tab v-if="canList && isParent" value="intakes"><i class="pi pi-file-edit mx-1" />{{ $t("ai.tab_intakes") }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="general">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-2 md:col-span-2">
                <ToggleSwitch v-model="form.enabled" inputId="ai-enabled" :disabled="!canEdit" />
                <label for="ai-enabled" class="font-bold">{{ text("ai.enabled", "ai.enabled_dashboard", "ai.enabled_public") }}</label>
              </div>
              <div class="flex flex-col gap-1">
                <label for="ai-model">{{ $t("ai.model") }}</label>
                <Select v-model="form.model" inputId="ai-model" :options="data.models" optionLabel="label" optionValue="id" :disabled="!canEdit" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="ai-budget">{{ $t("ai.monthly_budget") }}</label>
                <InputNumber v-model="form.monthly_budget_usd" inputId="ai-budget" :min="0" :max="data.usage.monthly_cap_usd" :maxFractionDigits="2" :disabled="!canEdit" />
                <small class="text-gray-500">{{ $t("ai.monthly_budget_hint", { cap: data.usage.monthly_cap_usd }) }}</small>
              </div>
              <div class="flex flex-col gap-1">
                <label for="ai-daily">{{ text("ai.daily_limit", "ai.dash_daily_limit", "ai.pub_daily_limit") }}</label>
                <InputNumber v-model="form.daily_messages_per_user" inputId="ai-daily" :min="0" :max="1000" :disabled="!canEdit" />
                <small class="text-gray-500">{{ $t("ai.daily_limit_hint") }}</small>
              </div>
              <div class="flex flex-col gap-1 md:col-span-2">
                <label for="ai-welcome">{{ $t("ai.welcome_message") }}</label>
                <Textarea v-model="form.welcome_message" id="ai-welcome" rows="2" autoResize :disabled="!canEdit" />
              </div>
              <div class="flex flex-col gap-1 md:col-span-2">
                <label for="ai-knowledge">{{ $t("ai.knowledge") }}</label>
                <small class="text-gray-500">{{ $t("ai.knowledge_hint") }}</small>
                <Textarea v-model="form.knowledge" id="ai-knowledge" rows="12" autoResize :disabled="!canEdit" />
              </div>
            </div>
            <Message severity="info" size="small" class="my-3">{{ $t("ai.applies_new") }}</Message>
            <Button v-if="canEdit" icon="pi pi-check" :label="$t('submit')" :loading="saving" @click="save" />
          </TabPanel>

          <TabPanel value="access">
            <p class="font-bold mb-1">{{ $t("ai.tools_title") }}</p>
            <small class="text-gray-500 block mb-3">{{ text("ai.tools_hint", "ai.dash_tools_hint", "ai.pub_tools_hint") }}</small>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
              <label v-for="tool in data.tools" :key="tool.key" class="ai-option" :for="`ai-tool-${tool.key}`">
                <ToggleSwitch :inputId="`ai-tool-${tool.key}`" :modelValue="form.tools.includes(tool.key)" :disabled="!canEdit"
                  @update:modelValue="(on) => toggle('tools', tool.key, on)" />
                <span>
                  <b>{{ tool.label }}</b><br /><small class="text-gray-500">{{ tool.about }}</small>
                  <small v-if="!fixedPages" class="ai-perms">{{ tool.perms.length ? $t("ai.needs_perm", { perms: tool.perms.join("، ") }) : $t("ai.everyone") }}</small>
                </span>
              </label>
            </div>

            <template v-if="fixedPages">
              <p class="font-bold mb-3">{{ $t("ai.pages_title") }}</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label v-for="page in data.pages" :key="page.name" class="ai-option" :for="`ai-page-${page.name}`">
                  <Checkbox :inputId="`ai-page-${page.name}`" binary :modelValue="form.routes.includes(page.name)" :disabled="!canEdit || !form.tools.includes('open_page')"
                    @update:modelValue="(on) => toggle('routes', page.name, on)" />
                  <span><b>{{ page.label }}</b><br /><small class="text-gray-500">{{ page.about }}</small></span>
                </label>
              </div>
            </template>
            <template v-else>
              <p class="font-bold mb-1">{{ $t("ai.dash_pages_title") }}</p>
              <small class="text-gray-500 block mb-3">{{ $t("ai.dash_pages_hint") }}</small>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <label v-for="page in menuPages" :key="page.name" class="ai-option ai-option--small" :for="`ai-hide-${page.name}`">
                  <Checkbox :inputId="`ai-hide-${page.name}`" binary :modelValue="form.hidden_routes.includes(page.name)" :disabled="!canEdit || !form.tools.includes('open_page')"
                    @update:modelValue="(on) => toggle('hidden_routes', page.name, on)" />
                  <span>
                    <b>{{ page.label }}</b><br /><small class="text-gray-500">{{ page.section }}</small>
                    <small v-if="form.hidden_routes.includes(page.name)" class="ai-hidden">{{ $t("ai.hidden") }}</small>
                  </span>
                </label>
              </div>
            </template>
            <Message severity="info" size="small" class="my-3">{{ $t("ai.applies_new") }}</Message>
            <Button v-if="canEdit" icon="pi pi-check" :label="$t('submit')" :loading="saving" @click="save" />
          </TabPanel>

          <TabPanel v-if="isParent" value="questions">
            <AssistantQuestions :questions="data.questions" :canEdit="canEdit" @saved="load" />
          </TabPanel>

          <TabPanel v-if="isParent" value="rules">
            <AssistantRules :rules="data.rules" :concerns="data.concerns" :evaluationTypes="data.evaluation_types" :canEdit="canEdit" @saved="load" />
          </TabPanel>

          <TabPanel v-if="canList" value="conversations">
            <AssistantConversations :key="assistant" :assistant="assistant" :pages="fixedPages ? data.pages : menuPages" />
          </TabPanel>

          <TabPanel v-if="canList && isParent" value="intakes">
            <AssistantIntakes />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.ai-usage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.75rem;
}
.ai-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
}
.ai-stat span {
  color: #6b7280;
  font-size: 0.85rem;
}
.ai-stat b {
  font-size: 1.15rem;
  color: #135c65;
}
.ai-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
}
.ai-option--small {
  padding: 0.55rem 0.7rem;
}
.ai-perms {
  display: block;
  margin-top: 0.3rem;
  color: #135c65;
}
.ai-hidden {
  display: inline-block;
  margin-top: 0.3rem;
  padding: 0 0.4rem;
  border-radius: 6px;
  background: #fee2e2;
  color: #b91c1c;
}
</style>
