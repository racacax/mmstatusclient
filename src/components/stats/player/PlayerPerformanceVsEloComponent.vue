<template>
  <CardComponent
    classes="col-12 col-lg-6"
    title="Performance vs lobby Elo"
    tooltip="Win rate split into three buckets based on your Elo relative to the match average: underdog (below average by ≥ threshold), favorite (above by ≥ threshold), or even (within threshold)."
  >
    <template #filters>
      <NumberInputComponent label="Threshold (pts)" v-model="threshold" :min="1" />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <highcharts class="hc" :options="chartOptions" />
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import NumberInputComponent from '@/components/basic/NumberInputComponent.vue'

const BUCKETS = ['underdog', 'even', 'favorite'] as const
const BUCKET_LABELS: Record<string, string> = {
  underdog: 'Underdog',
  even: 'Even',
  favorite: 'Favorite'
}

const props = defineProps<{
  minDate: Date
  maxDate: Date
  player: string
}>()

const threshold = ref(100)

const { data, error, loading } = APIClient.getPlayerPerformanceVsElo(
  toRef(props, 'minDate'),
  toRef(props, 'maxDate'),
  toRef(props, 'player'),
  threshold
)

const chartOptions = computed(() => {
  const ordered = BUCKETS.map(
    (b) =>
      data.value?.results.find((r) => r.bucket === b) ?? {
        bucket: b,
        games_played: 0,
        wins: 0,
        losses: 0,
        win_rate: 0
      }
  )

  return {
    chart: { styledMode: true },
    title: { text: '' },
    xAxis: {
      categories: ordered.map((r) => BUCKET_LABELS[r.bucket]),
      crosshair: true
    },
    yAxis: [
      {
        min: 0,
        title: { text: 'Matches' },
        allowDecimals: false
      },
      {
        min: 0,
        max: 100,
        title: { text: 'Win rate (%)' },
        opposite: true,
        labels: { format: '{value}%' }
      }
    ],
    tooltip: { shared: true },
    legend: { enabled: true },
    plotOptions: {
      column: { borderWidth: 0, stacking: 'normal', pointPadding: 0.1 }
    },
    series: [
      {
        name: 'Losses',
        type: 'column',
        yAxis: 0,
        data: ordered.map((r) => r.losses)
      },
      {
        name: 'Wins',
        type: 'column',
        yAxis: 0,
        data: ordered.map((r) => r.wins)
      },
      {
        name: 'Win rate',
        type: 'line',
        yAxis: 1,
        data: ordered.map((r) => r.win_rate),
        marker: { enabled: true, radius: 5 },
        tooltip: {
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.1f}%</b><br/>'
        }
      }
    ]
  }
})
</script>
