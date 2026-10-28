<script setup>
// Carolina types (الأنواع): two fixed types, each with several domains in their display order. A domain is put in a
// type here (moving it from the other one, after the type's last) or in its own form; it is never left without one.
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import CarolianaTab from '@/components/CarolianaTab.vue';

const { t } = useI18n();
const toast = useToast();
const types = ref([]), untyped = ref([]), domains = ref([]);
const loading = ref(false), saving = ref(null);
// type id -> the domain ids being added to it
const adding = ref({});
const notifyError = () => toast.add({ severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 5000 });
const show = (data) => {
  types.value = data.types ?? [];
  untyped.value = data.untyped ?? [];
  domains.value = [...types.value.flatMap((type) => type.domains.map((domain) => ({ ...domain, type_title: type.title }))), ...untyped.value];
  adding.value = Object.fromEntries(types.value.map((type) => [type.id, []]));
};
// The domains a type can take: the others', each saying where it is now.
const optionsFor = (type) => domains.value.filter((domain) => domain.type !== type.id);

async function load() {
  loading.value = true;
  try {
    show((await axios.get('/api/carolina-domains/types')).data.data ?? {});
  } catch { notifyError(); }
  finally { loading.value = false; }
}
async function add(type) {
  if (saving.value || !adding.value[type.id]?.length) return;
  saving.value = type.id;
  try {
    show((await axios.put(`/api/carolina-domains/types/${type.id}`, { domain_ids: adding.value[type.id] })).data.data ?? {});
    toast.add({ severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000 });
  } catch { notifyError(); }
  finally { saving.value = null; }
}
onMounted(load);
</script>

<template>
  <section>
    <CarolianaTab />
    <Toast />
    <div class="types-page" v-can="'carolina domain list'">
      <div class="carolina-table-header">
        <h1>{{ $t('carolina_ui.types') }}</h1>
      </div>
      <p class="muted types-hint">{{ $t('carolina_ui.types_hint') }}</p>
      <Message v-if="untyped.length" severity="warn" :closable="false">
        {{ $t('carolina_ui.untyped_domains') }} <b>{{ untyped.map((domain) => domain.title).join('، ') }}</b>
      </Message>
      <div v-if="loading" class="muted">{{ $t('loading') }}</div>
      <div v-else class="types-grid">
        <article v-for="(type, index) in types" :key="type.id" class="type-card">
          <header class="type-card-head">
            <span class="type-number">{{ index + 1 }}</span>
            <h2>{{ type.title }}</h2>
            <Tag severity="secondary" :value="String(type.domains.length)" />
          </header>
          <ol v-if="type.domains.length" class="type-domains">
            <li v-for="domain in type.domains" :key="domain.id">
              <span>{{ domain.title }}</span>
              <small class="muted">{{ $t('carolina_ui.display_order') }}: {{ domain.display_order }}</small>
            </li>
          </ol>
          <p v-else class="muted">{{ $t('carolina_ui.no_type_domains') }}</p>
          <div v-can="'carolina domain edit'" class="type-add">
            <label :for="`type-add-${type.id}`">{{ $t('carolina_ui.add_domains_to_type') }}</label>
            <div class="type-add-row">
              <MultiSelect :inputId="`type-add-${type.id}`" v-model="adding[type.id]" :options="optionsFor(type)" optionLabel="title" optionValue="id"
                display="chip" filter fluid :disabled="saving === type.id" :placeholder="$t('carolina_ui.add_domains_to_type')">
                <template #option="{ option }">
                  <span>{{ option.title }}</span>
                  <small class="muted">&nbsp;({{ option.type_title || $t('carolina_ui.no_type') }})</small>
                </template>
              </MultiSelect>
              <Button icon="pi pi-plus" :label="$t('add')" :loading="saving === type.id" :disabled="!adding[type.id]?.length" @click="add(type)" />
            </div>
            <small class="muted">{{ $t('carolina_ui.add_domains_hint') }}</small>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped src="./carolina-admin.css"></style>
<style scoped>
.types-page { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; border-radius: 16px; background: #fff; }
.types-hint { margin: 0; }
.types-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); gap: 1rem; }
.type-card { display: flex; flex-direction: column; gap: .8rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 14px; }
.type-card-head { display: flex; align-items: center; gap: .6rem; }
.type-card-head h2 { flex: 1; margin: 0; color: rgb(var(--bp-135c65)); font-size: 1.1rem; font-weight: 800; }
.type-number { display: inline-grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; background: rgb(var(--bp-135c65)); color: #fff; font-weight: 800; }
.type-domains { display: flex; flex-direction: column; gap: .35rem; margin: 0; padding-inline-start: 1.4rem; }
.type-domains li { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .2rem .8rem; }
.type-add { display: flex; flex-direction: column; gap: .4rem; padding-top: .8rem; border-top: 1px dashed #e2e8f0; }
.type-add label { font-weight: 700; }
.type-add-row { display: flex; gap: .5rem; }
.type-add-row :deep(.p-multiselect) { flex: 1; min-width: 0; }
</style>
