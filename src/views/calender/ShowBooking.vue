<template>
  <div class="page">
    <DataTable :value="bookings" :loading="loading" dataKey="id" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]"
      stripedRows>
      <template #header>
        <div class="bookings-header">
          <h1 class="page-title">{{ $t("bookings") }}</h1>
          <div class="bookings-filters">
            <div class="field">
              <label for="booking-status">{{ $t("booking_status_filter") }}</label>
              <Select inputId="booking-status" v-model="selectedStatus" :options="status" optionLabel="name"
                optionValue="code" @update:modelValue="getBookings" />
            </div>
            <div class="field">
              <label for="consultation-status">{{ $t("consultation_status_filter") }}</label>
              <Select inputId="consultation-status" v-model="selectedFilter" :options="filter" optionLabel="name"
                optionValue="code" @update:modelValue="getBookings" />
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="empty-state"><i class="pi pi-calendar-times" />{{ $t("no_bookings") }}</div>
      </template>

      <Column field="child_name" :header="$t('child_name')" sortable>
        <template #body="{ data }">
          <span class="font-semibold">{{ data.child_name }}</span>
        </template>
      </Column>
      <Column :header="$t('child_age')">
        <template #body="{ data }">{{ childAge(data) }}</template>
      </Column>
      <Column :header="$t('parent.phone')">
        <template #body="{ data }">
          <span dir="ltr">{{ data.details?.requester_phone || "—" }}</span>
        </template>
      </Column>
      <Column field="event_date" :header="$t('consultation_date')" sortable>
        <template #body="{ data }">
          <span dir="ltr">{{ data.event_date || "—" }}</span>
        </template>
      </Column>
      <Column :header="$t('booking_status_filter')">
        <template #body="{ data }">
          <Tag :value="labelOf(status, data.accepted)" :severity="severityOf(data.accepted)" />
        </template>
      </Column>
      <Column :header="$t('consultation_status_filter')">
        <template #body="{ data }">
          <Tag :value="labelOf(filter, data.status)" :severity="severityOf(data.status)" />
        </template>
      </Column>
      <Column :header="$t('actions')" style="width: 6rem">
        <template #body="{ data }">
          <Button icon="pi pi-eye" rounded variant="outlined" severity="secondary"
            v-tooltip.top="$t('follow_details')" :aria-label="$t('follow_details')" @click="bookingDetailes(data.id)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script>
import axios from "axios";
import { formatChildAge } from "@/utils/childAge";

export default {
  data() {
    return {
      bookings: [],
      loading: true,
      selectedStatus: -1,
      selectedFilter: -1,
    };
  },
  computed: {
    // accepted: -1 waiting, 1 accepted, 0 rejected — status: -1 in progress, 1 done, 0 cancelled
    status() {
      return [
        { name: this.$t("Pending"), code: -1 },
        { name: this.$t("Accept"), code: 1 },
        { name: this.$t("Cancell"), code: 0 },
      ];
    },
    filter() {
      return [
        { name: this.$t("consultation_in_progress"), code: -1 },
        { name: this.$t("consultation_done"), code: 1 },
        { name: this.$t("consultation_cancelled"), code: 0 },
      ];
    },
  },
  methods: {
    getBookings() {
      this.loading = true;
      axios
        .get(`/api/calender/bookings?accepted=${this.selectedStatus}&status=${this.selectedFilter}`)
        .then((res) => {
          // The filtered response can contain entries with no child; don't render them as empty rows.
          const list = res.data.bookings ?? [];
          this.bookings = Object.values(list).filter(
            (booking) => booking && String(booking.child_name ?? "").trim() !== ""
          );
        })
        .catch(() => {
          this.$toast.add({ severity: "error", summary: this.$t("error"), detail: this.$t("request_failed_retry"), life: 5000 });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    bookingDetailes(id) {
      this.$router.push({ name: "BookingDetails", params: { id } });
    },
    childAge(booking) {
      return formatChildAge(booking.child_birth_date, booking.child_age, this.$t);
    },
    labelOf(options, code) {
      return options.find((option) => option.code === Number(code))?.name ?? "—";
    },
    severityOf(code) {
      return { "-1": "warn", 1: "success", 0: "danger" }[Number(code)] ?? "secondary";
    },
  },
  mounted() {
    this.getBookings();
  },
};
</script>

<style scoped>
.bookings-header {
  display: grid;
  gap: 1rem;
}
.bookings-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
  gap: 0.75rem;
  align-items: end;
}
.bookings-filters .field {
  margin: 0;
}
.bookings-filters .p-select {
  width: 100%;
}
</style>
