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
import type Highcharts from 'highcharts'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

const N_PREV_WEEKS = 8

const props = defineProps<{ season: number; prevSeason?: number }>()
const seasonRef = ref(props.season)
const minElo = ref(0)
const prevSeasonRef = ref(props.prevSeason ?? 0)

watch(
  () => props.season,
  (v) => (seasonRef.value = v)
)

const { data, error, loading } = APIClient.getNewPlayersPerWeek(seasonRef, minElo)
const { data: prevData, fetchFn: fetchPrev } = APIClient.getNewPlayersPerWeek(
  prevSeasonRef,
  minElo,
  { lazy: true }
)

watch(
  [() => props.prevSeason, () => props.season],
  ([prevSeason]) => {
    if (prevSeason) {
      prevSeasonRef.value = prevSeason
      fetchPrev()
    }
  },
  { immediate: true }
)

const results = computed(() => data.value?.results ?? [])

const prevResults = computed(() => {
  const current = results.value
  const prev = prevData.value?.results ?? []
  if (!props.prevSeason || !prev.length) return []
  const needed = Math.max(0, N_PREV_WEEKS - current.length)
  if (needed === 0) return []
  return prev.slice(-needed)
})

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

const prevWeeksCount = computed(() => prevResults.value.length)

const chartOptions = computed(() => {
  // Category axis: every bar gets equal width regardless of actual date gap between seasons
  const prevPoints = prevResults.value.map((r) => ({
    name: `W${r.week + 1}`,
    y: r.new_players,
    colorIndex: 3
  }))
  const currentPoints = results.value.map((r) => ({
    name: `W${r.week + 1}`,
    y: r.new_players
  }))

  return {
    chart: { type: 'column', height: 195, styledMode: true, margin: [8, 8, 30, 36] },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      type: 'category',
      labels: { rotation: 0, style: { fontSize: '9px' } },
      plotLines:
        prevWeeksCount.value > 0
          ? [
              {
                value: prevWeeksCount.value - 0.5,
                width: 1,
                dashStyle: 'ShortDash',
                className: 'season-boundary-line'
              }
            ]
          : []
    },
    yAxis: { min: 0, title: { text: null }, labels: { style: { fontSize: '10px' } } },
    legend: { enabled: false },
    tooltip: {
      formatter(this: Highcharts.TooltipFormatterContextObject) {
        const season = this.point.index < prevWeeksCount.value ? 'Last season' : 'Current season'
        return `<b>${this.key}</b> — ${season}: <b>${this.y}</b>`
      }
    },
    plotOptions: { column: { pointPadding: 0.05, borderWidth: 0 } },
    series: [{ name: 'New players', data: [...prevPoints, ...currentPoints] }]
  }
})
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
