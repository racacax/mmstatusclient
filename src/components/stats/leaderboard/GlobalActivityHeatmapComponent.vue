<template>
  <CardComponent
    classes="col-12"
    title="Global activity heatmap"
    tooltip="Hours in CE(S)T (Europe/Paris).
Shows total matches played globally at a specific time on each day of the week for the selected season and minimum rank."
  >
    <template #filters>
      <RankFilterComponent v-model="minEloRef" :top10="true" label="Min. rank" />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <div v-if="data.results.length === 0" class="w-100 d-flex justify-content-center">
              <span>No data to display</span>
            </div>
            <HeatmapChartComponent
              v-else
              :data="heatmapData"
              :x-categories="hours"
              :y-categories="days"
              :color-axis-max="colorAxisMax"
            />
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
import HeatmapChartComponent from '@/components/charts/HeatmapChartComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => `${i}h`)

const seasonRef = ref(props.season)
const minEloRef = ref(0)

watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)

const { data, error, loading } = APIClient.getGlobalActivityHeatmap(seasonRef, minEloRef)

const heatmapData = computed<[number, number, number][]>(() => {
  if (!data.value?.results) return []
  const map = new Map<string, number>()
  for (const r of data.value.results) {
    map.set(`${r.day},${r.hour}`, r.count)
  }
  const result: [number, number, number][] = []
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      result.push([h, d, map.get(`${d},${h}`) ?? 0])
    }
  }
  return result
})

const colorAxisMax = computed(() => {
  if (!data.value?.results?.length) return undefined
  return Math.max(...data.value.results.map((r) => r.count))
})
</script>
