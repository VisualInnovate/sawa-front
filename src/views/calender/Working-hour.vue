<template>
  <div class="wh-page">
    <Toast />
    <!-- Header: what the page is for, and the employee whose hours are shown. -->
    <section class="wh-head sawa-card">
      <div class="wh-title">
        <span class="wh-icon"><i class="pi pi-calendar-clock" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("wh.title") }}</h1>
          <p>{{ $t("wh.subtitle") }}</p>
        </div>
      </div>
      <div class="wh-picker">
        <label for="wh-employee">{{ $t("employee_name") }}</label>
        <Select inputId="wh-employee" v-model="event.employee_id" :options="employees" optionLabel="name" optionValue="id"
          filter :placeholder="$t('wh.pick_employee')" :loading="employeesLoading" class="w-full" @update:model-value="getTimes" />
      </div>
    </section>

    <!-- No employee yet. -->
    <section v-if="!event.employee_id" class="wh-empty sawa-card">
      <i class="pi pi-user" aria-hidden="true" />
      <h2>{{ $t("wh.empty_title") }}</h2>
      <p>{{ $t("wh.empty_text") }}</p>
    </section>

    <template v-else>
      <!-- The employee: their shift days, how to add a time, and what the colours mean. -->
      <section class="wh-info sawa-card">
        <div class="wh-who">
          <span class="wh-avatar">{{ initials(selectedEmployee?.name) }}</span>
          <div class="min-w-0">
            <b class="block truncate">{{ selectedEmployee?.name }}</b>
            <small v-if="workDays.length" class="text-slate-500">{{ $t("wh.shift_days") }}: {{ workDays.join("، ") }}</small>
            <small v-else-if="!hoursLoading" class="text-orange-600">{{ $t("wh.no_shift") }}</small>
          </div>
        </div>
        <div class="wh-legend">
          <span><i class="dot" style="background:#87ceeb" />{{ $t("wh.legend_work") }}</span>
          <span><i class="dot" style="background:#94a3b8" />{{ $t("calendar_program_busy") }}</span>
        </div>
        <p v-if="$can('working hours create')" class="wh-hint"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t(isMobile ? "wh.hint_mobile" : "wh.hint") }}</p>
      </section>

      <section class="wh-calendar sawa-card">
        <p v-if="hoursLoading" class="text-center text-slate-500 py-8"><i class="pi pi-spin pi-spinner" aria-hidden="true" /></p>
        <FullCalendar v-else :options="opts" ref="fullCalendar" />
      </section>
    </template>

    <!-- Add a working time. -->
    <Dialog v-model:visible="visible" modal :header="$t('wh.add_title')" :style="{ width: '34rem' }" :breakpoints="{ '640px': '95vw' }" @hide="submitted = false">
      <form class="wh-form" @submit.prevent="createEvent">
        <p class="wh-range"><i class="pi pi-clock" aria-hidden="true" /> <span dir="ltr">{{ rangeText }}</span></p>
        <div class="wh-field">
          <label for="wh-title">{{ $t("title") }}</label>
          <InputText id="wh-title" v-model="event.title" :invalid="submitted && !event.title" />
        </div>
        <div class="wh-field">
          <label>{{ $t("wh.used_for") }}</label>
          <MultiSelect v-model="event.type" :options="event_types" optionLabel="name" optionValue="id" display="chip" class="w-full"
            :invalid="submitted && !event.type?.length" :placeholder="$t('wh.used_for_ph')" />
        </div>
        <div class="wh-switch">
          <ToggleSwitch v-model="event.sub" inputId="wh-repeat" />
          <label for="wh-repeat">{{ $t("wh.repeat") }}</label>
        </div>
        <template v-if="event.sub">
          <div class="wh-field">
            <label>{{ $t("wh.repeat_type") }}</label>
            <Select v-model="event.repeat_type" :options="repeat_types" optionLabel="name" class="w-full" :invalid="submitted && !event.repeat_type" />
            <small v-if="days_week.length" class="text-slate-500">{{ $t("wh.on_days") }}: {{ days_week.map((day) => day.name).join("، ") }}</small>
          </div>
          <div v-if="event.repeat_type?.id == 2" class="wh-field">
            <label>{{ $t("wh.repeat_days") }}</label>
            <MultiSelect v-model="event.day" :options="days_week" optionLabel="name" optionValue="value" display="chip" class="w-full" />
          </div>
          <div v-if="event.repeat_type" class="wh-field">
            <label>{{ $t("wh.repeat_end") }}</label>
            <DatePicker v-model="event.end_of_repeat" showIcon showButtonBar class="w-full" />
          </div>
        </template>
        <div class="wh-actions">
          <Button type="button" :label="$t('cancel')" severity="secondary" text @click="visible = false" />
          <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" @click="submitted = true" />
        </div>
      </form>
    </Dialog>

    <!-- Change or delete a working time. -->
    <Dialog v-model:visible="updateevent" modal :header="$t('wh.edit_title')" :style="{ width: '34rem' }" :breakpoints="{ '640px': '95vw' }">
      <form class="wh-form" @submit.prevent="updateEvent">
        <p class="wh-range"><i class="pi pi-clock" aria-hidden="true" /> <span dir="ltr">{{ rangeText }}</span></p>
        <div class="wh-field">
          <label for="wh-title-edit">{{ $t("title") }}</label>
          <InputText id="wh-title-edit" v-model="event.title" />
        </div>
        <div class="wh-field">
          <label>{{ $t("wh.used_for") }}</label>
          <MultiSelect v-model="event.type" :options="event_types" optionLabel="name" optionValue="id" display="chip" class="w-full" />
        </div>
        <div class="wh-switch">
          <ToggleSwitch v-model="repeat" inputId="wh-repeat-all" />
          <label for="wh-repeat-all">{{ $t("wh.apply_all") }}</label>
        </div>
        <Message v-if="repeat" severity="warn" :closable="false" size="small">{{ $t("wh.apply_all_warn") }}</Message>
        <div class="wh-actions">
          <Button v-can="'working hours delete'" type="button" :label="$t('delete')" icon="pi pi-trash" severity="danger" outlined class="me-auto" :loading="saving" @click="deleteEvent" />
          <Button type="button" :label="$t('cancel')" severity="secondary" text @click="updateevent = false" />
          <Button v-can="'working hours edit'" type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" />
        </div>
      </form>
    </Dialog>
  </div>
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
  import { useAppLangStore } from "../../stores/AppLangStore";

  export default {
    components: {
      FullCalendar,
      DatePicker,
      InputText,
    },
    data() {
      return {
        filter:{},
        repeat:false,
         all_days_week :[

            { name: this.$t('weekday.sunday'), value: 0 },
            { name: this.$t('weekday.monday'), value: 1 },
            { name: this.$t('weekday.tuesday'), value: 2},
            { name: this.$t('weekday.wednesday'), value: 3 },
            { name: this.$t('weekday.thursday'), value: 4 },
            { name: this.$t('weekday.friday'), value: 5 },
            { name: this.$t('weekday.saturday'), value: 6 }

        ],
        days_week: [],
        event_types : [
                      { name: this.$t('event_type.evaluations'), id: 1 },
                      { name: this.$t('event_type.meetings'), id: 2 },
                      { name: this.$t('event_type.consultations'), id: 3 },


        ],
        repeat_types:[
                      { name: this.$t('repeat_type.days'),type:'single','dateFormat':'DD MM yy ', id: 1 },
                      { name: this.$t('repeat_type.weekly'),type:'single','dateFormat':'DD MM yy ', id: 2 },
                      { name: this.$t('repeat_type.monthly'),type:'month','dateFormat':' MM yy ', id: 3 },
                      { name: this.$t('repeat_type.yearly'),type:'year','dateFormat':'  yy ', id: 4 },
        ],
        users:[],
        business_hours:[],
        langStore: useAppLangStore(),
        visible: false,
        updateevent:false,
        event:{color:'87ceeb',
          repeate:[
            {
              type:'',
              days:'',

            }
          ]
        },
        submitted:false,
        employees: [],
        employeesLoading: false,
        hoursLoading: false,
        saving: false,
        isMobile: window.matchMedia('(max-width: 640px)').matches,
        days:[0,1,2,3,4,5,6],
        doctorshow: "",
        create_visible: false,
        event_id: null,
        // The employee's own events, and their student-program times (shown busy, read only).
        calendarEvents: [],
        programEvents: [],
        visibleRange: null,
        opts: {
          plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, listPlugin],
          initialView: "dayGridMonth",
          locale: null,
          slotDuration:'00:30:00',
          slotLabelInterval: '00:30:00',
          hiddenDays: [],
          slotMinTime:'00:00:00',
          slotMaxTime:'00:00:00',
          selectable: true,
          editable: true,
          validRange: { start: new Date() },
          headerToolbar: {
            left: "title",
            center: "prev next today",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          },
          height: "auto",
          dayMaxEvents: 3,
          longPressDelay: 300,
          selectLongPressDelay: 300,
          selectAllow: (selectInfo) => {
        const calendarApi = this.$refs.fullCalendar.getApi();
        const events = calendarApi.getEvents();

        for (let event of events) {
          // تحقق فقط من التداخل على مستوى الوقت داخل نفس اليوم
          if (
            moment(selectInfo.start).isSame(event.start, "day") && // نفس اليوم
            (
              (selectInfo.start >= event.start && selectInfo.start < event.end) || // البداية داخل الحدث
              (selectInfo.end > event.start && selectInfo.end <= event.end)  // النهاية داخل الحدث
            )
          ) {
            return false; // يوجد تداخل، لا تسمح
          }
        }

        return true; // لا يوجد تداخل، يمكن الإضافة
      },

          eventClick: this.handleEventClick.bind(this),
          dateClick: this.handleDateClick,
          datesSet: this.handleDatesSet.bind(this),
          select: this.handleSelect.bind(this),

        },
      };
    },
    computed: {
      selectedEmployee() {
        return this.employees.find((employee) => employee.id === this.event.employee_id) ?? null;
      },
      // The employee's shift days, in week order.
      workDays() {
        const used = new Set(this.business_hours.map((entry) => entry.day));
        return this.all_days_week.filter((day) => used.has(day.value)).map((day) => day.name);
      },
      rangeText() {
        if (!this.event.start) return '';
        const start = moment(this.event.start);
        const end = this.event.end ? moment(this.event.end) : null;
        return start.format('YYYY-MM-DD') + '  ' + start.format('HH:mm') + (end ? ' – ' + end.format('HH:mm') : '');
      },
    },
    methods: {
      initials(name) {
        return String(name ?? '').split(/\s+/).map((part) => part.match(/\p{L}/u)?.[0]).filter(Boolean).slice(0, 2).join('');
      },
      // Phones: a shorter toolbar, the views below it, and a day view to start from.
      applyLayout() {
        this.isMobile = window.matchMedia('(max-width: 640px)').matches;
        this.opts.headerToolbar = this.isMobile
          ? { left: 'prev,next', center: 'title', right: 'today' }
          : { left: 'title', center: 'prev next today', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' };
        this.opts.footerToolbar = this.isMobile ? { center: 'dayGridMonth,timeGridDay,listWeek' } : false;
      },
      goBack() {
        this.$router.go(-1);
      },
      fetchEmployees() {
        this.employeesLoading = true;
        axios
          .get("api/employees")
          .then((response) => {
            this.employees = response.data.data;
          })
          .catch((error) => console.error("Error retrieving doctors:", error))
          .finally(() => (this.employeesLoading = false));
      },
      handleDatesSet(event){
        this.visibleRange = { start: event.start, end: event.end }
        this.loadProgramBusy()
        const hours = this.business_hours.find(item => item.day === new Date(event.startStr).getDay())
        if (hours) {
          this.opts.slotMinTime = hours.start
          this.opts.slotMaxTime = hours.end
        }
      },
      updateEvents() {
        if (!this.event.employee_id) return;
        axios.get(`/api/event-calendar?employee_id=${this.event.employee_id}`,).then((res) => {

          this.calendarEvents = res.data.data.map(event => ({

              title: event.title,
              start: event.start,
              end: event.end,
              type: event.type,
              col :event.color,
              id: event.id,
              backgroundColor:'#'+event.color,

            }));
          this.showEvents()
        });
      },
      // The student-program sessions (and inclusion time) of the visible weeks: busy, not clickable.
      loadProgramBusy() {
        if (!this.event.employee_id || !this.visibleRange) return
        axios.get('api/event-calendar/program-busy', { params: {
          employee_id: this.event.employee_id,
          from: moment(this.visibleRange.start).format('YYYY-MM-DD'),
          to: moment(this.visibleRange.end).format('YYYY-MM-DD'),
        } }).then((res) => {
          this.programEvents = (res.data.data ?? []).map((busy, i) => ({
            id: `program-${i}`,
            title: [this.$t('calendar_program_busy'), busy.child, busy.treatment].filter(Boolean).join(' · '),
            start: busy.start,
            end: busy.end,
            backgroundColor: '#94a3b8',
            borderColor: '#64748b',
            editable: false,
            extendedProps: { program: true },
          }))
          this.showEvents()
        }).catch(() => {})
      },
      showEvents() {
        this.opts.events = [...this.calendarEvents, ...this.programEvents]
      },
      // The server refuses (or skips) events over the employee's program sessions.
      programOverlapMessage(message) {
        return /program sessions/i.test(message ?? '') ? this.$t('calendar_program_overlap') : message
      },
      getTimes(id){
        this.business_hours = [];
        this.calendarEvents = [];
        this.programEvents = [];
        this.showEvents();
        if (!id) return;
        this.hoursLoading = true;
        axios
          .get(`api/employees/get/with/shift-days/${id}`)
          .then((response) => {
            this.business_hours = response.data.data.days ?? [];
            this.updateEvents();
            this.loadProgramBusy();
          })
          .catch(() => {})
          .finally(() => (this.hoursLoading = false));
      },




      handleEventClick(event) {
        if (event.event.extendedProps?.program) return
        if (!this.$can('working hours edit', 'working hours delete')) return
        this.event_id=event.event.id
        this.repeat = false
        this.event.title = event.event.title
        this.event.color = '#'+event.event.color
        this.event.start = event.event.start
        this.event.end = event.event.end
        this.event.type = event.event.extendedProps.type
        this.event.color = event.event.extendedProps.col
        this.updateevent = true;
      },
      handleSelect(event) {
        const clickedDate = new Date(event.startStr);
        const hours = this.business_hours.find(item => item.day === clickedDate.getDay());
        if (hours) {
          this.opts.slotMinTime = hours.start;
          this.opts.slotMaxTime = hours.end;
        }
        if(event.view.type == 'dayGridMonth'){
          const calendarApi = this.$refs.fullCalendar.getApi();
          calendarApi.changeView("timeGridDay", event.startStr);
        }else if (this.$can('working hours create')) {
            this.event.start=event.startStr
            this.event.end=event.endStr
            this.event.title = this.event.title || this.$t('wh.default_title')
            this.submitted = false
            this.visible = true;
        }

  },
      createEvent() {
        if (!this.event.title || !this.event.type?.length || (this.event.sub && !this.event.repeat_type)) return;
        this.saving = true;
        this.event.repeate = this.event.repeate?.length ? this.event.repeate : [{ type: '', days: '' }];
        if (!this.event.sub) { this.event.repeat_type = null; this.event.day = null; this.event.end_of_repeat = null; }
        this.event.repeate[0].type=this.event?.repeat_type?.id
        this.event.repeate[0].days=this.event.day
        this.event.repeate[0].end_of_repeat=this.event.end_of_repeat ? moment(this.event.end_of_repeat).format('YYYY-MM-DD') : null

        axios.post("/api/event-calendar",{
          employee_id:this.event.employee_id,
          title:this.event.title,
          type:this.event.type,
          start:this.event.start,
          end:this.event.end,
          color:this.event.color,
          repeat:this.event.repeate
        }).then((res) => {
          this.updateEvents();
          this.visible=false
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
          if (/program sessions/i.test(res.data?.message ?? '')) {
            this.$toast.add({ severity: 'warn', summary: this.$t("calendar_program_busy"), detail: this.$t('calendar_program_skipped'), life: 5000 });
          }

        }) .catch((el)=>{
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.programOverlapMessage(el.response?.data?.message)}`, life: 4000 });

        }).finally(() => (this.saving = false));
      },

      updateEvent() {
        this.saving = true
        const repeat = this.repeat ? 1 : 0
        axios.put(`/api/event-calendar/${this.event_id}`,
         {
          color:this.event.color,
          repeat,
          title:this.event.title,
          employee_id:this.event.employee_id,
          start:this.event.start,
          type:this.event.type,
          end:this.event.end,
         }).then(() => {
          this.updateevent=false
          this.updateEvents();
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), life: 2500 });
        }).catch((el) => {
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.programOverlapMessage(el.response?.data?.message)}`, life: 4000 });
        }).finally(() => (this.saving = false));
      },
      deleteEvent() {
        if (!window.confirm(this.$t(this.repeat ? 'wh.delete_all_confirm' : 'wh.delete_confirm'))) return
        this.saving = true
        axios.delete(`/api/event-calendar/${this.event_id}?repeat=${this.repeat ? 1 : 0}`).then(() => {
          this.updateevent=false
          this.updateEvents();
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), life: 2500 });
        }).catch((el) => {
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: el.response?.data?.message ?? this.$t('request_failed_retry'), life: 4000 });
        }).finally(() => (this.saving = false));
      },
      resetModal() {
        this.visible = false;
        this.updateevent=false
        this.event={
          color:'87ceeb'
        }
      },
    },

    watch: {
            // Watch the variable for changes
            business_hours(newValue, oldValue) {
                    // Extract the `day` values from `business_hours`
                const usedDays = newValue.map(entry => entry.day);
                // Filter `days` to only include those present in `usedDays`
                // No shift days (or not loaded yet): hide nothing; the calendar refuses to hide every day.
                this.opts.hiddenDays = usedDays.length ? this.days.filter(day => !usedDays.includes(day)) : [];
                this.days_week = this.all_days_week.filter(day => !this.opts.hiddenDays.includes(day.value));

            },


        },
    mounted() {
      this.applyLayout();
      this.$_onResize = () => {
        const mobile = window.matchMedia('(max-width: 640px)').matches;
        if (mobile !== this.isMobile) this.applyLayout();
      };
      window.addEventListener('resize', this.$_onResize);
      this.fetchEmployees();
      this.doctorshow = localStorage.getItem("type");
      this.opts.locale = localStorage.appLang === "en" ? null : arLocale;
      this.updateEvents();
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.$_onResize);
    },
  };
  </script>
<style scoped>
.wh-page { display: flex; flex-direction: column; gap: 1rem; }
.wh-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem; padding: 1.25rem; }
.wh-title { display: flex; align-items: center; gap: .85rem; }
.wh-title h1 { font-size: 1.35rem; font-weight: 700; color: rgb(var(--bp-135c65)); margin: 0; }
.wh-title p { color: #64748b; margin: .15rem 0 0; font-size: .9rem; }
.wh-icon { width: 3rem; height: 3rem; border-radius: .85rem; display: grid; place-items: center; flex-shrink: 0;
  background: rgb(var(--bp-135c65) / .1); color: rgb(var(--bp-135c65)); font-size: 1.35rem; }
.wh-picker { display: flex; flex-direction: column; gap: .35rem; width: min(100%, 22rem); }
.wh-picker label, .wh-field label { font-size: .85rem; font-weight: 600; color: #334155; }
.wh-empty { text-align: center; padding: 3rem 1rem; color: #64748b; }
.wh-empty .pi { font-size: 2.25rem; color: rgb(var(--bp-135c65) / .6); }
.wh-empty h2 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: .75rem 0 .25rem; }
.wh-empty p { margin: 0; }
.wh-info { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem 1.5rem; padding: .9rem 1.25rem; }
.wh-who { display: flex; align-items: center; gap: .65rem; min-width: 0; flex: 1 1 16rem; }
.wh-avatar { width: 2.5rem; height: 2.5rem; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0;
  background: rgb(var(--bp-135c65)); color: #fff; font-weight: 700; }
.wh-legend { display: flex; flex-wrap: wrap; gap: .4rem 1rem; font-size: .85rem; color: #475569; }
.wh-legend span { display: inline-flex; align-items: center; gap: .35rem; }
.dot { width: .7rem; height: .7rem; border-radius: 50%; display: inline-block; }
.wh-hint { flex-basis: 100%; margin: 0; font-size: .85rem; color: rgb(var(--bp-135c65)); }
.wh-calendar { padding: 1rem; overflow: hidden; }
.wh-form { display: flex; flex-direction: column; gap: 1rem; }
.wh-field { display: flex; flex-direction: column; gap: .35rem; }
.wh-switch { display: flex; align-items: center; gap: .6rem; }
.wh-range { margin: 0; padding: .6rem .8rem; border-radius: .6rem; background: rgb(var(--bp-135c65) / .08); color: rgb(var(--bp-135c65)); font-weight: 600; }
.wh-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .5rem; padding-top: .25rem; }
:deep(.fc .fc-toolbar) { flex-wrap: wrap; gap: .5rem; }
:deep(.fc .fc-toolbar-title) { font-size: 1.2rem; }
:deep(.fc .fc-button-primary) { background: rgb(var(--bp-135c65)); border-color: rgb(var(--bp-135c65)); }
:deep(.fc .fc-button-primary:not(:disabled).fc-button-active) { background: #0b3f45; border-color: #0b3f45; }
:deep(.fc-event) { cursor: pointer; }
@media (max-width: 640px) {
  .wh-head, .wh-info { padding: 1rem; }
  .wh-calendar { padding: .5rem; }
  .wh-picker { width: 100%; }
  :deep(.fc .fc-header-toolbar) { flex-direction: column; align-items: stretch; }
  :deep(.fc .fc-toolbar-chunk) { display: flex; justify-content: center; flex-wrap: wrap; gap: .25rem; }
  :deep(.fc .fc-toolbar-title) { font-size: 1.05rem; text-align: center; }
  :deep(.fc .fc-button) { padding: .3rem .55rem; font-size: .8rem; }
  .wh-actions :deep(.p-button) { flex: 1 1 auto; }
}
</style>
