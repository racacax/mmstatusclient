<template>
  <CardComponent classes="col-12 col-lg-6" title="Activity heatmap">
    <template #filters>
      <div style="height: 40px"></div>
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <div class="w-100 position-relative">
            <div class="w-100" :class="{ 'opacity-0': data === null }">
              <HeatmapChartComponent
                :data="heatmapData"
                :x-categories="hours"
                :y-categories="days"
                :color-axis-max="colorAxisMax"
              />
            </div>
            <div class="w-100 position-absolute top-0 left-0">
              <LoadingComponent v-if="data === null" />
            </div>
            <div class="w-100 d-flex justify-content-center" v-if="data?.results?.length === 0">
              <span>No data to display</span>
            </div>
          </div>
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

const props = defineProps({
  minDate: { type: Date, required: true },
  maxDate: { type: Date, required: true },
  player: { type: String, required: true }
})

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => `${i}h`)

const minDateRef = ref(props.minDate)
const maxDateRef = ref(props.maxDate)
const playerRef = ref(props.player)
const updateRefs = () => {
  minDateRef.value = props.minDate
  maxDateRef.value = props.maxDate
  playerRef.value = props.player
}
const { data, error } = APIClient.getPlayerActivityHeatmap(minDateRef, maxDateRef, playerRef)
watch(() => [props.player, props.maxDate, props.minDate], updateRefs)

// day: 0=Mon...6=Sun (matching API), hour: 0-23
// Highcharts heatmap data: [x=hour, y=day, value=count]
const heatmapData = computed<[number, number, number][]>(() => {
  if (!data.value?.results) return []
  // Fill all cells with 0 first, then overlay actual values
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
