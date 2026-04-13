<template>
  <CardComponent
    classes="col-12"
    title="New Players / Week"
    tooltip="Players who played their first match each week this season."
  >
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || !data" />
          <template v-else>
            <div class="d-flex align-items-baseline gap-2 mt-1 mb-1 px-1">
              <span class="kpi-number">{{ latestCount }}</span>
              <span class="kpi-label text-muted">new players last week</span>
              <span class="ms-auto kpi-trend" :class="trendClass">{{ trendLabel }}</span>
            </div>

            <highcharts :options="chartOptions" />

            <div class="text-end mt-1">
              <a href="/#/statistics/tab/activity" class="small">Full statistics →</a>
            </div>
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
const minElo = ref(0)
watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data, error, loading } = APIClient.getNewPlayersPerWeek(seasonRef, minElo)

const results = computed(() => data.value?.results ?? [])
const latestCount = computed(() => results.value[results.value.length - 1]?.new_players ?? 0)
const prevCount = computed(() => results.value[results.value.length - 2]?.new_players ?? null)

const trendLabel = computed(() => {
  if (prevCount.value === null) return ''
  const diff = latestCount.value - prevCount.value
  return diff > 0 ? `+${diff}` : `${diff}`
})
const trendClass = computed(() => {
  if (prevCount.value === null) return ''
  return latestCount.value >= prevCount.value ? 'text-success' : 'text-danger'
})

const chartOptions = computed(() => ({
  chart: { type: 'column', height: 195, styledMode: true, margin: [8, 8, 30, 36] },
  title: { text: '' },
  credits: { enabled: false },
  xAxis: { type: 'datetime', labels: { format: '{value:%b %d}', style: { fontSize: '10px' } } },
  yAxis: { min: 0, title: { text: null }, labels: { style: { fontSize: '10px' } } },
  legend: { enabled: false },
  tooltip: {
    headerFormat: '<b>{point.x:%b %d, %Y}</b><br/>',
    pointFormat: 'New players: <b>{point.y}</b>'
  },
  plotOptions: { column: { pointPadding: 0.05, borderWidth: 0 } },
  series: [
    { name: 'New players', data: results.value.map((r) => [r.week_start * 1000, r.new_players]) }
  ]
}))
</script>

<style scoped>
.kpi-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}
.kpi-label {
  font-size: 0.78rem;
}
.kpi-trend {
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
