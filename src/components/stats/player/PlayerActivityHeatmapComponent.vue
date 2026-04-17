<template>
  <CardComponent
    classes="col-12 col-lg-6"
    title="Activity heatmap"
    tooltip="Hours in CE(S)T (Europe/Paris).
Shows how many matches a player played at a specific time on each day of the week.
Ex: Sun 15h will show all matches played on a sunday between 15h00-15h59."
  >
    <template #filters>
      <div style="height: 40px"></div>
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <HeatmapChartComponent
              :data="heatmapData"
              :x-categories="hours"
              :y-categories="days"
              :color-axis-max="colorAxisMax"
            />
            <div class="w-100 d-flex justify-content-center" v-if="data.results.length === 0">
              <span>No data to display</span>
            </div>
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import HeatmapChartComponent from '@/components/charts/HeatmapChartComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

const props = defineProps<{
  minDate: Date
  maxDate: Date
  player: string
}>()

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => `${i}h`)

const { data, error, loading } = APIClient.getPlayerActivityHeatmap(
  toRef(props, 'minDate'),
  toRef(props, 'maxDate'),
  toRef(props, 'player')
)

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
