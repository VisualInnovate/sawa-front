<template>
  <div class="sawa-card calendar-page p-[1%] bg-slate-50">
    <Toolbar>
      <template #start>
        <div class="calendar-filters">
          <Select
            @update:model-value="fetchEmployees($event)"
            required
            :modelValue="event.evaluation_type"
            :disabled="saving"
            option-value="id"
            :options="evaluate_types"
            optionLabel="name"
          />
          <Select
            @update:model-value="getTimes($event)"
            :placeholder="$t('employee_name')"
            :modelValue="event.employee_id"
            required
            :loading="employeesLoading"
            :disabled="employeesLoading || !employees.length || saving"
            :invalid="submitted && !event.employee_id"
            option-value="id"
            filter
            :options="employees"
            optionLabel="name"
          />
        </div>
      </template>

      <template #end> </template>
    </Toolbar>
<h2 class="text-xl text-center">{{ childreen.find(child => child.id === event.child_id)?.name }}</h2>
    <!-- Opened for a consultation: what it asked for and what is already booked. -->
    <div v-if="required" class="required-strip" role="status">
      <span class="required-strip-label">{{ $t("required_evaluations") }}:</span>
      <Tag v-for="item in required.required" :key="item.type"
        :severity="item.booked ? 'success' : 'warn'"
        :icon="item.booked ? 'pi pi-check' : 'pi pi-clock'"
        :value="requiredLabel(item)" />
    </div>
    <p role="status" class="calendar-status">
      <span v-if="employeesLoading || calendarLoading">{{ $t('calendar_loading') }}</span>
      <span v-else-if="calendarError">{{ calendarError }}</span>
      <span v-else-if="!employees.length">{{ $t('calendar_no_employees') }}</span>
      <span v-else-if="!event.employee_id">{{ $t('select_evaluation_employee') }}</span>
      <span v-else-if="!avalible_day.length">{{ $t('calendar_no_slots') }}</span>
    </p>
    <p v-if="isMobile && event.employee_id && avalible_day.length" class="calendar-hint">{{ $t('calendar_tap_hint') }}</p>
    <FullCalendar
      :options="opts"
      ref="fullCalendar"
    />
    <Dialog
      v-model:visible="visible"
      id="modal"
      modal
      :header="$t('submit')"
      :style="{ width: '40vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
    >
      <form @submit.prevent="create" class="">
        <div v-if="opts.event" class="slot-summary">
          <i class="pi pi-calendar" />
          <span>{{ slotLabel }}</span>
        </div>
        <p class="dialog-line">{{ $t('employee_name') }}: {{ employees.find(employee => employee.id === event.employee_id)?.name }}</p>
        <div class="flex flex-column gap-1">
          <label class="text-start" for="evaluation-notes">{{ $t("notes") }} ({{ $t("optional") }})</label>
          <Textarea id="evaluation-notes" v-model="event.notes" rows="3" autoResize maxlength="2000" />
        </div>

        <div class="flex flex-column gap-2 py-1">
          <label class="w-full text-start" for="username">{{
            $t("child_name")
          }}</label>
          <Select
            disabled
            required
            v-model="event.child_id"
            option-value="id"
            filter
            :options="childreen"
            optionLabel="name"
            class="w-full"
            :class="{ 'p-invalid': submitted && !event.child_id }"
          />
        </div>

        <div class="w-full text-center">
          <Button
            type="submit"
            :loading="saving"
            :disabled="!event.employee_id || calendarLoading || saving || !opts.event"
            @click="submitted = true"
            class="m-auto w-full sm:w-[50%] my-4"
            :label="$t('submit')"></Button>
        </div>
      </form>
    </Dialog>
    <Dialog
      v-model:visible="updateevent"
      id="modal"
      modal
      :header="modal_text"
      :style="{ width: '40vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
    >
      <form>
        <h2 class="font-bold text-xl text-center py-1">{{ event.title }}</h2>
        <p class="font-bold text-lg text-center py-1">
          {{ $t("from") }} {{ event.start_time }} {{ $t("to") }}
          {{ event.end_time }}
        </p>
        <Button v-if="event_id" v-can="'working hours delete'" class="mt-3" icon="pi pi-trash" @click="deleteEvent" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
      </form>
    </Dialog>
    <Dialog
      v-model:visible="not_find"
      id="modal"
      modal
      :header="modal_text"
      :style="{ width: '40vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
    >
      <form>
        <p class="dialog-line">{{ $t("no_open_positions") }}</p>
      </form>
    </Dialog>
  </div>
  <Toast></Toast>
</template>

<script>
import axios from "axios";
import moment from "moment";
import arLocale from "@fullcalendar/core/locales/ar";
import FullCalendar from "@fullcalendar/vue3";
import TimeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import DatePicker from 'primevue/datepicker';
import InputText from "primevue/inputtext";
import { getEvaluationTypeLabel } from "../../utils/evaluationTypes";
import { useAppLangStore } from "../../stores/AppLangStore";
import { Toast } from "flowbite-vue";
import { watch } from "vue";
import { text } from "@fortawesome/fontawesome-svg-core";

export default {
  components: {
    FullCalendar,
    DatePicker,
    InputText,
  },
  data() {
    return {
      filter: {},
      bookingId: Number(this.$route.query.bookingId) || null,
      isMobile: false,
      mobileQuery: null,
      required: null,
      not_find: false,
      childreen: [],
      modal_text: false,
      evaluate_types: [
        { name: "milestone", id: 2 },
        { name: "barrier", id: 3 },
        { name: "ABLLS Academy", id: 4 },
        { name: "carolina", id: 5 },
        { name: "Transition", id: 6 },
        { name: "البعد المعرفي", id: 101 },
        { name: "البعد العنايه الذاتيه", id: 102 },
        { name: "البعد الحركي", id: 103 },
        { name: "البعد الاجتماعي", id: 104 },
        { name: "البعد الاتصالي", id: 105 },
      ],
      users: [],
      business_hours: [],
      langStore: useAppLangStore(),
      visible: false,
      updateevent: false,
      event: {
        employee_id: null,
        // The calendar's work type: this page books evaluations only (1).
        type: 1,
        color: "87ceeb",
        evaluation_type: 2,
      },
      submitted: false,
      employeesLoading: false,
      calendarLoading: false,
      calendarError: '',
      saving: false,
      employeesRequest: 0,
      calendarRequest: 0,
      slotEmployeeId: null,
      booked: [],
      employees: [],
      avalible_day: [],
      days: [0, 1, 2, 3, 4, 5, 6],
      doctorshow: "",
      create_visible: false,
      event_id: null,
      opts: {
        plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, listPlugin],
        initialView: "dayGridMonth",
        locale: null,
        slotDuration: "00:30:00",
        slotLabelInterval: "00:30:00",
        hiddenDays: [],
        slotMinTime: "00:00:00",
        slotMaxTime: "24:00:00",
        nowIndicator: true,
        selectable: false,
        editable: false,
        events: [],
        event: null,
        validRange: { start: new Date() },
        // On a phone a tap books (dateClick); a short press also selects.
        selectLongPressDelay: 300,
        headerToolbar: {
          left: "title",
          center: "prev next today",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        selectAllow: this.canSelectSlot.bind(this),

        eventClick: this.handleEventClick.bind(this),
        dateClick: this.handleDateClick.bind(this),
        datesSet: this.handleDatesSet.bind(this),
        select: this.handleSelect.bind(this),
        dayCellClassNames: () => [],
      },
    };
  },
  computed: {
    slotLabel() {
      const slot = this.opts.event;
      if (!slot) return '';
      return `${moment(slot.start).format('YYYY-MM-DD')} · ${this.$t('from')} ${moment(slot.start).format('HH:mm')} ${this.$t('to')} ${moment(slot.end).format('HH:mm')}`;
    },
  },
  methods: {
    applyLayout() {
      // Phones get a shorter toolbar and fewer views.
      this.isMobile = Boolean(this.mobileQuery?.matches);
      this.opts.headerToolbar = this.isMobile
        ? { left: 'prev,next', center: 'title', right: 'dayGridMonth,timeGridDay' }
        : { left: 'title', center: 'prev next today', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' };
    },
    // The consultation this calendar books for (?bookingId=), and the next evaluation it still needs.
    async loadRequired({ selectNext = true } = {}) {
      try {
        const { data } = await axios.get(`api/required-evaluations/${this.bookingId}`, { params: { _ts: Date.now() } });
        this.required = data.data;
      } catch {
        this.required = null;
        return;
      }
      if (!selectNext) return;
      const next = this.required.required.find(item => !item.booked);
      if (!next) return;
      // Side profile is booked one dimension at a time.
      const type = next.missing_dimensions?.[0] ?? next.type;
      if (this.evaluate_types.some(option => option.id === type)) await this.fetchEmployees(type);
    },
    requiredLabel(item) {
      const label = getEvaluationTypeLabel(item.type, this.$t, String(item.type));
      return item.missing_dimensions?.length
        ? `${label} (${this.$t("required_dimensions_left", { count: item.missing_dimensions.length })})`
        : label;
    },
    goBack() {
      this.$router.go(-1);
    },
    asList(value) {
      return Array.isArray(value) ? value : (value && typeof value === 'object' ? Object.values(value) : []);
    },
    clearCalendar() {
      this.business_hours = [];
      this.avalible_day = [];
      this.booked = [];
      this.opts.events = [];
      this.opts.event = null;
      this.opts.selectable = false;
      this.opts.hiddenDays = [];
      this.opts.validRange = { start: moment().startOf('day').toDate() };
      this.opts.dayCellClassNames = this.dayCellClassNames.bind(this);
      this.opts.slotMinTime = '00:00:00';
      this.opts.slotMaxTime = '24:00:00';
      this.slotEmployeeId = null;
      this.visible = false;
      this.updateevent = false;
      this.calendarError = '';
    },
    async fetchEmployees(value = this.event.evaluation_type) {
      // Assign the emitted value before requesting data; v-model may update after the handler.
      const evaluationType = Number(value);
      this.event.evaluation_type = evaluationType;
      const request = ++this.employeesRequest;
      ++this.calendarRequest;
      this.event.employee_id = null;
      this.employees = [];
      this.employeesLoading = true;
      this.calendarLoading = false;
      this.clearCalendar();
      try {
        const { data } = await axios.get(`api/employees/get/with/${evaluationType}`);
        if (request !== this.employeesRequest) return;
        this.employees = this.asList(data.data?.employees).map(employee => ({ ...employee, id: Number(employee.id) }));
      } catch (error) {
        if (request !== this.employeesRequest) return;
        if (error.response?.status !== 404) this.calendarError = this.$t('request_failed_retry');
      } finally {
        if (request === this.employeesRequest) this.employeesLoading = false;
      }
    },
    handleDatesSet() {
      // Keep usable time bounds even when the visible month starts on a non-working day.
      if (!this.business_hours.length) return;
      this.opts.slotMinTime = this.business_hours.map(hours => hours.start).sort()[0];
      this.opts.slotMaxTime = this.business_hours.map(hours => hours.end).sort().at(-1);
    },
    isAvailableDate(date) {
      return this.avalible_day.some(day => moment(day.start).isSame(date, 'day'));
    },
    nextBookableSlot(reference = moment()) {
      const slot = reference.clone().seconds(0).milliseconds(0);
      const remainder = slot.minute() % 30;
      slot.add(remainder === 0 ? 30 : 30 - remainder, 'minutes');
      return slot;
    },
    dayCellClassNames({ date }) {
      if (!this.event.employee_id || !this.avalible_day.length) return [];
      return this.isAvailableDate(date) ? ['fc-day-available'] : ['fc-day-unavailable'];
    },
    canSelectSlot(slot) {
      if (!this.event.employee_id || this.calendarLoading || this.employeesLoading || this.saving) return false;
      if (slot.allDay) return this.isAvailableDate(slot.start);
      const start = moment(slot.start);
      const end = moment(slot.end);
      if (!start.isAfter(moment())) return false;
      const available = end.isAfter(start) && this.avalible_day.some(day =>
        start.isSameOrAfter(moment(day.start)) && end.isSameOrBefore(moment(day.end))
      );
      return available && !this.booked.some(booking =>
        start.isBefore(moment(booking.end)) && end.isAfter(moment(booking.start))
      );
    },

    getClidreen() {
      axios.get("/api/child").then((res) => {
        this.childreen = res.data.children;
      });
    },
    updateEvents() {
      axios
        .get(
          `/api/event-calendar?employee_id=${this.event.employee_id}&type=${this.event.type}`
        )
        .then((res) => {
          this.opts.events = res.data.data.map((event) => ({
            title: event.title,
            start: event.start,
            end: event.end,
            type: event.type,
            col: event.color,
            id: event.id,
            backgroundColor: "#" + event.color,

            // from:event.from
          }));
        });
    },
    async create() {
      this.submitted = true;
      if (this.saving) return;
      if (!this.event.employee_id || !this.employees.some(employee => employee.id === this.event.employee_id)) {
        this.$toast.add({ severity: 'error', summary: this.$t('error'), detail: this.$t('select_evaluation_employee'), life: 4000 });
        return;
      }
      if (!this.opts.event || this.slotEmployeeId !== this.event.employee_id || !this.canSelectSlot(this.opts.event)) {
        this.$toast.add({ severity: 'error', summary: this.$t('error'), detail: this.$t('calendar_select_slot'), life: 4000 });
        return;
      }
      this.saving = true;
      try {
        await axios.post(`api/evaluation-request`, {
          booking_id: this.bookingId,
          employee_id: this.event.employee_id,
          color: this.event.color,
          notes: this.event.notes?.trim() || null,
          evaluation_type: this.event.evaluation_type,
          consultant_id: localStorage.getItem("user_id"),
          child_id: this.event.child_id,
          date: moment(this.opts.event.start).format("YYYY-MM-DD"),
          start_time: moment(this.opts.event.start).format("HH:mm:ss"),
          end_time: moment(this.opts.event.end).format("HH:mm:ss"),
        });
          this.visible = false;
          this.$toast.add({
            severity: "success",
            summary: this.$t("success_message"),
            detail: `${this.$t("element_add_success")}`,
            life: 3000,
          });
          await this.getTimes();
          if (this.bookingId) await this.loadRequired({ selectNext: false });
      } catch (el) {
          const pastSlot = Boolean(el.response?.data?.errors?.start_time);
          this.$toast.add({
            severity: "error",
            summary: this.$t("error"),
            detail: pastSlot ? this.$t('calendar_past_slot') : (el.response?.data?.message || this.$t("mission_error")),
            life: 3000,
          });
      } finally {
        this.saving = false;
      }
    },
    async getTimes(value = this.event.employee_id) {
      const id = value == null ? null : Number(value);
      this.event.employee_id = id;
      const request = ++this.calendarRequest;
      this.clearCalendar();
      this.calendarLoading = false;
      if (!id || !this.employees.some(employee => employee.id === id)) return;
      this.calendarLoading = true;
      try {
          const response = await axios.get(`api/employees/get/with/calendar/${id}?type=${this.event.type}`);
          if (request !== this.calendarRequest) return;
          const now = moment();
          const nextSlot = this.nextBookableSlot(now);
          const daysData = this.asList(response.data.data?.days).map(day => {
            const start = moment(day.start);
            const end = moment(day.end);
            if (!start.isValid() || !end.isAfter(start) || !end.isAfter(now)) return null;
            const visibleStart = start.isSame(now, 'day') && start.isBefore(nextSlot) ? nextSlot.clone() : start;
            if (!end.isAfter(visibleStart)) return null;
            return {
              ...day,
              start: visibleStart.format('YYYY-MM-DDTHH:mm:ss'),
              end: end.format('YYYY-MM-DDTHH:mm:ss'),
            };
          }).filter(Boolean);
          this.avalible_day = daysData;
          this.business_hours = daysData.map((event) => ({
            day: moment(event.start).day(),
            start: moment(event.start).format("HH:mm:ss"),
            end: moment(event.end).isSame(moment(event.start), 'day') ? moment(event.end).format("HH:mm:ss") : '24:00:00',
          }));
          this.handleDatesSet();
          if (daysData.length) {
            // Only show the employee's working weekdays, from today until their last open date.
            const workDays = new Set(this.business_hours.map(hours => hours.day));
            this.opts.hiddenDays = this.days.filter(day => !workDays.has(day));
            const lastDay = moment.max(daysData.map(day => moment(day.start)));
            this.opts.validRange = {
              start: moment().startOf('day').toDate(),
              end: lastDay.clone().add(1, 'day').startOf('day').toDate(),
            };
            const firstDay = moment.min(daysData.map(day => moment(day.start))).toDate();
            this.$nextTick(() => this.$refs.fullCalendar?.getApi().gotoDate(firstDay));
          }
          this.opts.dayCellClassNames = this.dayCellClassNames.bind(this);
          // A booking reads as its evaluation type and child (older ones fall back to their title).
          this.booked = this.asList(response.data.data?.booked).map((event) => ({
            title: [getEvaluationTypeLabel(event.evaluation_type, this.$t, event.title || ''), event.child?.name]
              .filter(Boolean).join(' - '),
            start: `${event.date}T${event.start_time}`,
            end: `${event.date}T${event.end_time}`,
            backgroundColor: "#" + event.color,
          }));
          this.opts.events = [
            ...daysData.map(day => ({ start: day.start, end: day.end, display: 'background', backgroundColor: '#d1fae5' })),
            ...(daysData.some(day => moment(day.start).isSame(now, 'day')) ? [{
              start: now.clone().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
              end: nextSlot.format('YYYY-MM-DDTHH:mm:ss'),
              display: 'background',
              classNames: ['fc-past-time-block'],
              backgroundColor: '#e2e8f0',
            }] : []),
            ...this.booked,
          ];
          this.opts.selectable = daysData.length > 0;
      } catch (error) {
        if (request !== this.calendarRequest) return;
        this.calendarError = error.response?.status === 404 ? this.$t('calendar_no_slots') : this.$t('request_failed_retry');
      } finally {
        if (request === this.calendarRequest) this.calendarLoading = false;
      }
    },

    handleEventClick(event) {
      this.event_id = event.event.id;
      this.event.title = event.event.title;
      this.event.color = "#" + event.event.color;

      this.event.start_time = moment(event.event.start).format("HH:mm:ss");
      this.event.end_time = moment(event.event.end).format("HH:mm:ss");

      this.updateevent = true;
    },
    handleDateClick(info) {
      if (info.view.type === 'dayGridMonth') {
        if (!this.canSelectSlot({ ...info, start: info.date, allDay: true })) return;
        this.$refs.fullCalendar.getApi().changeView('timeGridDay', info.date);
        return;
      }
      // A tap on a free time books the half hour starting there (on touch screens a tap never fires `select`).
      if (info.allDay || this.visible) return;
      const slot = { start: info.date, end: moment(info.date).add(30, 'minutes').toDate(), allDay: false };
      if (!this.canSelectSlot(slot)) {
        this.$toast.add({ severity: 'warn', summary: this.$t('error'), detail: this.$t('calendar_select_slot'), life: 3000 });
        return;
      }
      this.handleSelect(slot);
    },
    handleSelect(event) {
      if (!this.canSelectSlot(event)) return;
      if (event.allDay) {
        this.$refs.fullCalendar.getApi().changeView('timeGridDay', event.start);
        return;
      } 
      this.opts.event = event;
      this.slotEmployeeId = this.event.employee_id;
      this.event.notes = "";
      this.visible = true;
    },
    createEvent() {
      axios
        .post("/api/event-calendar", this.event)
        .then(() => {
          this.updateEvents();
          this.visible = false;
          this.$toast.add({
            severity: "success",
            summary: this.$t("success_message"),
            detail: `${this.$t("element_add_success")}`,
            life: 3000,
          });
        })
        .catch((el) => {
          this.$toast.add({
            severity: "error",
            summary: this.$t("error"),
            detail: `${el.response.data.message}`,
            life: 3000,
          });
        });
    },

    updateEvent() {
      axios.put(`/api/event-calendar/${this.event_id}`, this.event).then(() => {
        this.updateevent = false;
        this.updateEvents();
      });
    },
    deleteEvent() {
      axios.delete(`/api/event-calendar/${this.event_id}`).then(() => {
        this.updateevent = false;
        this.updateEvents();
      });
    },
    resetModal() {
      this.visible = false;
      this.updateevent = false;
      this.event.title = '';
      this.event.color = '87ceeb';
    },
  },
  mounted() {
    this.mobileQuery = window.matchMedia('(max-width: 640px)');
    this.mobileQuery.addEventListener?.('change', this.applyLayout);
    this.applyLayout();
    this.getClidreen();
    if (this.bookingId) this.loadRequired().then(() => { if (!this.employees.length && !this.employeesLoading) this.fetchEmployees(); });
    else this.fetchEmployees();
    this.doctorshow = localStorage.getItem("type");
    this.opts.locale = localStorage.appLang === "en" ? null : arLocale;
    this.event.child_id = parseInt(this.$route.params.id);
  },
  beforeUnmount() {
    this.mobileQuery?.removeEventListener?.('change', this.applyLayout);
  },
};
</script>
<style scoped>
.required-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem 0 0.75rem;
}
.required-strip-label {
  font-weight: 600;
  color: #135c65;
}
:deep(.fc-day-unavailable) {
  background: repeating-linear-gradient(135deg, #f3f4f6, #f3f4f6 6px, #e5e7eb 6px, #e5e7eb 12px);
  opacity: 0.55;
  cursor: not-allowed;
}
:deep(.fc-daygrid-day.fc-day-available) {
  background: #ecfdf5;
  cursor: pointer;
}
:deep(.fc-past-time-block) {
  background: repeating-linear-gradient(135deg, #e2e8f0, #e2e8f0 7px, #cbd5e1 7px, #cbd5e1 14px) !important;
  opacity: 0.8;
}
input {
  width: 100%;
  font-size: 20px;
  text-align: center;
  margin: 20px 0;
  padding: 8px;
  border: 2px solid #8284a8;
}
.calendar-status {
  color: red;
  font-size: 20px;
  text-align: center;
  margin: 5px 0;
}
.calendar-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.calendar-filters > :deep(.p-select:not(.hidden)) {
  min-width: 12rem;
}
.calendar-hint {
  text-align: center;
  color: #135c65;
  font-size: 0.9rem;
  margin: 0 0 0.5rem;
}
.slot-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 10px;
  background: #ecfdf5;
  color: #065f46;
  font-weight: 600;
}
.dialog-line {
  margin: 0.25rem 0;
}
@media (max-width: 640px) {
  .calendar-page {
    padding: 0.5rem;
  }
  .calendar-page :deep(.p-toolbar) {
    padding: 0.5rem;
  }
  .calendar-page :deep(.p-toolbar-start),
  .calendar-filters,
  .calendar-filters > :deep(.p-select:not(.hidden)) {
    width: 100%;
    min-width: 0;
  }
  .calendar-status {
    font-size: 15px;
  }
  .calendar-page :deep(.fc .fc-toolbar) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .calendar-page :deep(.fc .fc-toolbar-title) {
    font-size: 1.05rem;
  }
  .calendar-page :deep(.fc .fc-button) {
    padding: 0.3rem 0.55rem;
    font-size: 0.8rem;
  }
  .calendar-page :deep(.fc .fc-col-header-cell-cushion),
  .calendar-page :deep(.fc .fc-daygrid-day-number) {
    font-size: 0.75rem;
    padding: 2px;
  }
  .calendar-page :deep(.fc .fc-timegrid-slot) {
    height: 2.75rem;
  }
  .calendar-page :deep(.fc .fc-daygrid-event) {
    font-size: 0.65rem;
  }
}
</style>
