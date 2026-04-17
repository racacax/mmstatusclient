<template>
  <CardComponent
    classes="col-12"
    title="Cross-rank match frequency"
    tooltip="Distribution of ELO spread within matches. Each bar represents how many matches had players whose ELO difference fell within that range. A spread of 0–299 means all players were within the same rank tier; 4000+ means players spanned from Bronze to Trackmaster."
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

const { data, error, loading } = APIClient.getCrossRankFrequency(seasonRef, minEloRef)

const categories = computed(
  () =>
    data.value?.results.map((r) =>
      r.spread_max === null ? `${r.spread_min}+` : `${r.spread_min}–${r.spread_max}`
    ) ?? []
)

const chartOptions = computed(() => ({
  chart: {
    type: 'column',
    styledMode: true
  },
  title: { text: '' },
  xAxis: {
    categories: categories.value,
    title: { text: 'ELO spread in match' },
    labels: { rotation: -45 }
  },
  yAxis: {
    type: 'logarithmic',
    title: { text: 'Match count (log scale)' },
    minorTickInterval: 'auto'
  },
  tooltip: {
    headerFormat: '<b>Spread: {point.key}</b><br/>',
    pointFormat: 'Matches: <b>{point.y}</b>'
  },
  legend: { enabled: false },
  plotOptions: {
    column: {
      borderWidth: 0,
      pointPadding: 0.05,
      groupPadding: 0
    }
  },
  series: [
    {
      name: 'Matches',
      data: data.value?.results.map((r) => r.count) ?? []
    }
  ]
}))
</script>
