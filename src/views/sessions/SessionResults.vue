<script setup>
// What happened in a session: its break tables, the reinforcer tests and the DTT sheets saved in it (read only).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import BreakTables from "@/components/sessions/BreakTables.vue";
import { SESSION_STATUS_SEVERITY, sessionKindLabel } from "@/utils/studentPrograms";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const session = ref(null);
const openSheet = ref(null);

const METHOD = { paired: "pref_paired", with_replacement: "pref_with", without_replacement: "pref_without" };
const TIER = { highest: "success", moderate: "warn", lowest: "danger" };
const schedule = computed(() => session.value?.break_schedule);
// A Novel table saved before 2026-10-27 has C and P columns.
const oldApprox = (sheet) => (sheet.approx ?? []).some((row) => row.c || row.p);
const counts = (sheet) => ["C", "I", "P", "NR"].map((value) => ({ value, count: sheet.trials.filter((row) => row.response === value).length }));

onMounted(async () => {
  const { data } = await axios.get(`api/program-sessions/${route.params.id}/results`);
  session.value = data.data;
});
</script>

<template>
  <div class="flex flex-column gap-3">
    <div class="sawa-card p-3 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <Button icon="pi pi-arrow-right" variant="text" rounded :aria-label="$t('back')" @click="router.push({ name: 'sessions' })" />
        <div>
          <p class="text-xl text-[#135C65] font-bold m-0">{{ $t("session_results") }}</p>
          <p v-if="session" class="text-sm text-color-secondary m-0">
            {{ session.child?.name }} · {{ moment(session.starts_at).format("YYYY-MM-DD HH:mm") }} · {{ session.therapist?.name }}
            · {{ session.treatment?.name ?? sessionKindLabel(t, session.session_kind) }}
          </p>
        </div>
      </div>
      <Tag v-if="session" :severity="SESSION_STATUS_SEVERITY[session.status]" :value="$t(`session_status_${session.status}`)" />
    </div>

    <div v-if="!session" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <template v-else>
      <section class="sawa-card p-3">
        <h3 class="sr-title"><i class="pi pi-stopwatch" /> {{ $t("run_step_breaks") }}</h3>
        <BreakTables v-if="schedule" :modelValue="schedule" :childName="session.child?.name" />
        <p v-else class="text-color-secondary">{{ $t("break_none") }}</p>
      </section>

      <section class="sawa-card p-3">
        <h3 class="sr-title"><i class="pi pi-star" /> {{ $t("run_step_reinforcers") }}</h3>
        <p v-if="!session.preference_tests?.length" class="text-color-secondary">{{ $t("sr_no_tests") }}</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div v-for="test in session.preference_tests" :key="test.id" class="sr-test">
            <b>{{ $t(METHOD[test.type]) }}</b> <small class="text-color-secondary">{{ moment(test.created_at).format("HH:mm") }}</small>
            <ol>
              <li v-for="row in test.result.ranking" :key="row.letter">
                <span class="ltr sr-letter">{{ row.letter }}</span> {{ row.name }}
                <span class="sr-bar"><span :style="{ width: `${row.percent}%` }" /></span>
                <b class="ltr">{{ row.percent }}%</b>
                <Tag :severity="TIER[row.tier]" :value="$t(`pref_tier_${row.tier}`)" />
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section class="sawa-card p-3">
        <h3 class="sr-title"><i class="pi pi-flag" /> {{ $t("sr_dtt_sheets") }}</h3>
        <p v-if="!session.dtt_sheets?.length" class="text-color-secondary">{{ $t("sr_no_sheets") }}</p>
        <div v-for="sheet in session.dtt_sheets" :key="sheet.id" class="sr-sheet">
          <button type="button" class="sr-sheet-head" @click="openSheet = openSheet === sheet.id ? null : sheet.id">
            <span class="sr-mt ltr">MT{{ sheet.step }}</span>
            <span class="flex-1 text-start">{{ sheet.goal_text || sheet.goal_weakness }}</span>
            <span class="ltr text-sm text-color-secondary">{{ sheet.date }} · {{ sheet.trainer }}</span>
            <span class="sr-counts"><span v-for="item in counts(sheet)" :key="item.value" :class="`is-${item.value.toLowerCase()}`">{{ item.value }} {{ item.count }}</span></span>
            <i :class="openSheet === sheet.id ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" />
          </button>
          <Transition name="sr-open">
            <div v-if="openSheet === sheet.id" class="sr-sheet-body" dir="ltr">
            <table class="sr-table">
              <thead><tr><th>Trial</th><th>Response</th><th>prompt</th><th>Notes</th></tr></thead>
              <tbody>
                <tr v-for="(row, i) in sheet.trials" :key="i"><td>{{ i + 1 }}</td><td><b>{{ row.response ?? "" }}</b></td><td>{{ row.prompt }}</td><td>{{ row.notes }}</td></tr>
                <tr><td colspan="2"><b>Phase</b> {{ sheet.phase }}</td><td colspan="2"><b>SD/SΔ</b> {{ sheet.sd }}</td></tr>
                <tr><td colspan="2"><b>% correct</b> {{ sheet.percent_correct }}</td><td colspan="2"><b>Next</b> {{ sheet.next }}</td></tr>
              </tbody>
            </table>
            <!-- A VB-MAPP goal's «Novel» table (C and P only for a sheet written before they were dropped). -->
            <table v-if="sheet.approx?.length" class="sr-table sr-approx">
              <thead>
                <tr><th :colspan="oldApprox(sheet) ? 6 : 4">Novel</th></tr>
                <tr><th>Approx</th><th>Item</th><template v-if="oldApprox(sheet)"><th>C</th><th>P</th></template><th>Date</th><th /></tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in sheet.approx" :key="i">
                  <td>{{ row.approx }}</td><td>{{ row.item }}</td>
                  <template v-if="oldApprox(sheet)"><td><b>{{ row.c }}</b></td><td><b>{{ row.p }}</b></td></template>
                  <td>{{ row.date }}</td><td>{{ i + 1 }}</td>
                </tr>
              </tbody>
            </table>
            </div>
          </Transition>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.sr-title { display: flex; align-items: center; gap: .5rem; margin: 0 0 .8rem; color: #135c65; font-size: 1.05rem; font-weight: 800; }
.sr-test { padding: .8rem; border-radius: 12px; background: #f8fafc; }
.sr-test ol { list-style: none; margin: .5rem 0 0; padding: 0; display: grid; gap: .3rem; }
.sr-test li { display: grid; grid-template-columns: 1.6rem minmax(5rem, 9rem) 1fr 3.5rem auto; align-items: center; gap: .5rem; }
.sr-letter { width: 1.5rem; height: 1.5rem; border-radius: 7px; display: grid; place-items: center; background: #e0f2f1; color: #135c65; font-weight: 800; }
.sr-bar { height: .45rem; border-radius: 9px; background: #e2e8f0; overflow: hidden; }
.sr-bar span { display: block; height: 100%; background: #0f8a7e; }
.sr-sheet { border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: .5rem; overflow: hidden; }
.sr-sheet-body { display: flex; flex-wrap: wrap; gap: .75rem; align-items: start; }
.sr-sheet-body .sr-table { flex: 1 1 26rem; }
.sr-sheet-body .sr-approx { flex: 0 1 20rem; }
.sr-sheet-head { width: 100%; display: flex; align-items: center; gap: .7rem; padding: .6rem .8rem; border: 0; background: #fff; cursor: pointer; font: inherit; }
.sr-sheet-head:hover { background: #f8fafc; }
.sr-mt { padding: .2rem .5rem; border-radius: 8px; background: #135c65; color: #fff; font-weight: 800; }
.sr-counts { display: flex; gap: .3rem; font-size: .75rem; }
.sr-counts span { padding: .1rem .4rem; border-radius: 6px; background: #f1f5f9; }
.sr-counts .is-c { background: #d1fae5; } .sr-counts .is-i { background: #fee2e2; } .sr-counts .is-p { background: #fef3c7; }
.sr-table { width: 100%; border-collapse: collapse; font-size: .85rem; }
.sr-table th, .sr-table td { border-top: 1px solid #e2e8f0; padding: .35rem .6rem; text-align: start; }
.sr-table th { background: #f1f5f9; }
.sr-open-enter-active, .sr-open-leave-active { transition: opacity .25s, transform .25s; }
.sr-open-enter-from, .sr-open-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
