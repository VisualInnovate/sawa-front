<template>
  <div class="dashboard-wrapper">

    <!-- ════════════════ STAT CARDS ════════════════ -->
    <div class="stats-grid">

      <div class="stat-card" style="--accent: #EC477C">
        <div class="stat-icon">
          <i class="pi pi-car" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.TotalDrivers }}</p>
          <p class="stat-label">{{ $t("driver") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #135B64">
        <div class="stat-icon">
          <i class="pi pi-user" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.TotalEmployees }}</p>
          <p class="stat-label">{{ $t("Employees") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #8a9070">
        <div class="stat-icon">
          <i class="pi pi-users" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.TotalChild }}</p>
          <p class="stat-label">{{ $t("children") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #1a7a3c">
        <div class="stat-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M22 22L2 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M2 11L10.1259 4.5C11.2216 3.62 12.7784 3.62 13.8741 4.5L22 11" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round" />
            <path d="M4 22V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M20 22V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path
              d="M15 22V17C15 15.59 15 14.88 14.56 14.44C14.12 14 13.41 14 12 14C10.59 14 9.88 14 9.44 14.44C9 14.88 9 15.59 9 17V22"
              stroke="currentColor" stroke-width="1.5" />
          </svg>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.TotalRoom }}</p>
          <p class="stat-label">{{ $t("room") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #C8A824">
        <div class="stat-icon">
          <i class="pi pi-clock" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.TotalShifts }}</p>
          <p class="stat-label">{{ $t("shift") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #9253eb">
        <div class="stat-icon">
          <i class="pi pi-calendar" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.session }}</p>
          <p class="stat-label">{{ $t("sessions") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #dc2626">
        <div class="stat-icon">
          <i class="pi pi-heart" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.TotalDoctors }}</p>
          <p class="stat-label">{{ $t("doctors") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #334155">
        <div class="stat-icon">
          <i class="pi pi-star" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.TotalEvents }}</p>
          <p class="stat-label">{{ $t("events") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #92400e">
        <div class="stat-icon">
          <i class="pi pi-th-large" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.TotalDepartments }}</p>
          <p class="stat-label">{{ $t("departments") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

      <div class="stat-card" style="--accent: #30a6aa">
        <div class="stat-icon">
          <i class="pi pi-list" style="font-size:1.6rem"></i>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ totla.program }}</p>
          <p class="stat-label">{{ $t("addTherapeutic") }}</p>
        </div>
        <div class="stat-glow"></div>
      </div>

    </div>

    <!-- ════════════════ CHARTS ROW ════════════════ -->
    <div class="charts-row">

      <div class="chart-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="panel-dot" style="background:#EC477C"></span>
            <h3 class="panel-title">{{ $t('total') }} — {{ $t('overview') }}</h3>
          </div>
        </div>
        <div class="chart-area">
          <Chart type="bar" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div class="chart-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="panel-dot" style="background:#135B64"></span>
            <h3 class="panel-title">{{ $t('total') }} — {{ $t('trend') }}</h3>
          </div>
        </div>
        <div class="chart-area">
          <Chart type="line" :data="chartData" :options="chartOptions" />
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      chartData: null,
      chartOptions: null,
      totla: {}
    };
  },
  mounted() {
    this.chartData = this.setChartData();
    this.chartOptions = this.setChartOptions();

    axios.get("api/total/users")
      .then(({ data }) => {
        this.totla = data;
        if (this.chartData?.datasets?.[0]) {
          this.chartData.datasets[0].data = [
            data.TotalUsers,
            data.TotalDrivers,
            data.TotalChild,
            data.TotalRoom
          ];
        }
      })
      .catch(err => console.error("Error fetching totals:", err));
  },

  methods: {
    setChartData() {
      return {
        labels: [
          this.$t('users'),
          this.$t('driver'),
          this.$t('children'),
          this.$t('room')
        ],
        datasets: [{
          label: this.$t('total'),
          data: [],
          backgroundColor: [
            'rgba(249,115,22,0.25)',
            'rgba(6,182,212,0.25)',
            'rgba(107,114,128,0.25)',
            'rgba(139,92,246,0.25)'
          ],
          borderColor: [
            'rgb(249,115,22)',
            'rgb(6,182,212)',
            'rgb(107,114,128)',
            'rgb(139,92,246)'
          ],
          borderWidth: 2,
          borderRadius: 6,
          tension: 0.4,
          pointBackgroundColor: [
            'rgb(249,115,22)',
            'rgb(6,182,212)',
            'rgb(107,114,128)',
            'rgb(139,92,246)'
          ],
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      };
    },

    setChartOptions() {
      const ds = getComputedStyle(document.documentElement);
      const text = ds.getPropertyValue('--text-color') || '#374151';
      const muted = ds.getPropertyValue('--text-color-secondary') || '#9ca3af';
      const grid = ds.getPropertyValue('--surface-border') || '#e5e7eb';

      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: text,
              font: { size: 13 },
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.85)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: ctx => ` ${ctx.parsed.y?.toLocaleString() ?? ctx.parsed.y}`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: muted, font: { size: 12 } },
            grid: { color: grid, drawBorder: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: muted,
              font: { size: 12 },
              callback: v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v
            },
            grid: { color: grid, drawBorder: false }
          }
        },
        animation: {
          duration: 800,
          easing: 'easeInOutQuart'
        }
      };
    }
  }
};
</script>

<style scoped>
/* ── wrapper ── */
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem;
  font-family: inherit;
}

/* ── STAT CARDS ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.stat-card {
  position: relative;
  overflow: hidden;
  background: var(--accent, #555);
  border-radius: 14px;
  padding: 1.1rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  color: #fff;
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);
}

/* soft inner glow */
.stat-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 110% 0%, rgba(255, 255, 255, 0.18) 0%, transparent 65%);
  pointer-events: none;
}

.stat-icon {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-body {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.65rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.stat-label {
  font-size: 0.78rem;
  opacity: 0.85;
  font-weight: 600;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── CHARTS ── */
.charts-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 900px) {
  .charts-row {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-panel,
.map-panel {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0;
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.panel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.panel-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

.panel-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #64748b;
  letter-spacing: 0.03em;
}

.chart-area {
  padding: 0.35rem 1.4rem;
  height: 280px;
}

.chart-area :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-dot 1.8s ease-in-out infinite;
}

@keyframes pulse-dot {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.5);
    opacity: 0.6;
  }
}
</style>