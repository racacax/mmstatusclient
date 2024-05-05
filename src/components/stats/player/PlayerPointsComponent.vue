<template>
  <CardComponent
    classes="col-lg-6 col-12"
    title="Player points evolution"
    tooltip="Note: Before April 28th, evolution is an estimation."
  >
    <template #filters>
      <div style="height: 40px"></div>
    </template>
    <template #main>
      <div class="w-100 position-relative">
        <div class="w-100" :class="{ 'opacity-0': data === null }">
          <LineChartComponent
            label="Points"
            :data="data?.results?.map((entry) => [entry.time * 1000, entry.points]) ?? []"
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
  </CardComponent>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { type PlayerPoints } from '@/api/entities'
import CardComponent from '@/components/basic/CardComponent.vue'
import LineChartComponent from '@/components/charts/LineChartComponent.vue'

const props = defineProps({
  minDate: { type: Date, required: true },
  maxDate: { type: Date, required: true },
  player: { type: String, required: true }
})

const data: Ref<PlayerPoints | null> = ref(null)
function fetchStats() {
  data.value = null
  APIClient.getPlayerPoints(props.minDate, props.maxDate, props.player).then((j) => {
    data.value = j
  })
}
fetchStats()
watch(() => [props.minDate, props.maxDate, props.player], fetchStats)
</script>
