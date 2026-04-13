<template>
  <CardComponent
    classes="col-12 col-lg-6"
    title="Statistics per rank"
    tooltip="Win rate, losses and MVP count broken down by the rank player was at the time of the match."
  >
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
import { computed, toRef } from 'vue'
import { APIClient } from '@/api/client'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import CardComponent from '@/components/basic/CardComponent.vue'

const props = defineProps<{
  minDate: Date
  maxDate: Date
  player: string
}>()

const { data, error, loading } = APIClient.getPlayerStatisticsPerRank(
  toRef(props, 'minDate'),
  toRef(props, 'maxDate'),
  toRef(props, 'player')
)

const chartOptions = computed(() => {
  const results = [...(data.value?.results ?? [])]
  const categories = results.map((r) => r.rank_name)
  const losses = results.map((r) => r.played - r.wins)

  return {
    chart: { type: 'bar', styledMode: true },
    title: { text: '' },
    xAxis: {
      categories,
      title: { text: '' }
    },
    yAxis: {
      min: 0,
      title: { text: 'Matches' },
      allowDecimals: false
    },
    tooltip: {
      shared: true
    },
    legend: { enabled: true },
    plotOptions: {
      bar: { borderWidth: 0, stacking: 'normal' }
    },
    series: [
      {
        name: 'Losses',
        type: 'bar',
        data: losses
      },
      {
        name: 'Wins',
        type: 'bar',
        data: results.map((r) => r.wins)
      },
      {
        name: 'MVPs',
        type: 'scatter',
        data: results.map((r, i) => [i, r.mvps]),
        marker: { symbol: 'diamond', radius: 5 },
        tooltip: { pointFormat: 'MVPs: <b>{point.y}</b><br/>' }
      }
    ]
  }
})
</script>
