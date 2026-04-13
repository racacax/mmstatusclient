<template>
  <CardComponent
    classes="col-12 col-lg-6"
    title="Activity per day of the week"
    tooltip="Total matches played per day of the week for the selected season and minimum rank."
  >
    <template #filters>
      <RankFilterComponent v-model="minEloRef" :top10="true" label="Min. Rank" />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <highcharts class="hc" :options="chartOptions" />
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

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const seasonRef = ref(props.season)
const minEloRef = ref(0)

watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)

const { data, error, loading } = APIClient.getActivityPerDayOfWeek(seasonRef, minEloRef)

const chartOptions = computed(() => ({
  chart: { type: 'column', styledMode: true },
  title: { text: '' },
  xAxis: {
    categories: days,
    title: { text: 'Day' }
  },
  yAxis: {
    min: 0,
    title: { text: 'Matches played' }
  },
  tooltip: {
    headerFormat: '<b>{point.key}</b><br/>',
    pointFormat: 'Matches: <b>{point.y}</b>'
  },
  legend: { enabled: false },
  plotOptions: {
    column: { borderWidth: 0, pointPadding: 0.1 }
  },
  series: [
    {
      name: 'Matches',
      data: days.map((_, i) => data.value?.results[String(i)] ?? 0)
    }
  ]
}))
</script>
