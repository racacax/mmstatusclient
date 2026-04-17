<template>
  <CardComponent
    classes="col-12 col-lg-6"
    title="Player retention per week"
    tooltip="Weekly player retention: how many players who played the previous week came back. Retention rate is shown as a line on the right axis."
  >
    <template #filters>
      <RankFilterComponent v-model="minEloRef" :top10="true" label="Min. Rank" />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <div v-if="data.results.length === 0" class="w-100 d-flex justify-content-center">
              <span>No data to display</span>
            </div>
            <highcharts v-else class="hc" :options="chartOptions" />
            <div class="w-100 d-flex justify-content-end">
              <i>Last updated on : {{ new Date(data.last_updated * 1000).toLocaleString() }}</i>
            </div>
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const seasonRef = ref(props.season)
const minEloRef = ref(0)

watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)

const { data, error, loading } = APIClient.getPlayerRetention(seasonRef, minEloRef)

const chartOptions = computed(() => ({
  chart: {
    type: 'column',
    styledMode: true
  },
  title: { text: '' },
  xAxis: {
    type: 'datetime',
    labels: { format: '{value:%b %d}' }
  },
  yAxis: [
    {
      min: 0,
      title: { text: 'Players' }
    },
    {
      min: 0,
      max: 100,
      title: { text: 'Retention rate (%)' },
      opposite: true,
      labels: { format: '{value}%' }
    }
  ],
  tooltip: {
    shared: true,
    headerFormat: '<b>{point.x:%b %d, %Y}</b><br/>'
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      borderWidth: 0,
      pointPadding: 0.1
    }
  },
  legend: { enabled: true },
  series: [
    {
      name: 'Retained',
      type: 'column',
      yAxis: 0,
      data: data.value?.results.map((r) => [r.week_start * 1000, r.retained_players]) ?? []
    },
    {
      name: 'Not retained',
      type: 'column',
      yAxis: 0,
      data:
        data.value?.results.map((r) => [
          r.week_start * 1000,
          r.total_players - r.retained_players
        ]) ?? []
    },
    {
      name: 'Retention rate',
      type: 'line',
      yAxis: 1,
      data: data.value?.results.map((r) => [r.week_start * 1000, r.retention_rate]) ?? [],
      tooltip: { valueSuffix: '%' },
      marker: { enabled: true }
    }
  ]
}))
</script>
